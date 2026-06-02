# Step 13. 定义并发、幂等与重入保护

## 1. Step 状态

- 状态: `[x] 已完成`
- 对应 SOP: `standards/document/详细设计讨论流程_SOP.md` Step 13
- 回填章节: `projects/L1-conversation/03-详细设计.md` §12 并发、幂等与重入保护

---

## 2. 本步输入

| 输入 | 内容 | 本步使用方式 |
|---|---|---|
| `03_ddd_step_08_protocol_contracts.md` §7.10 | 幂等与审计矩阵 | 作为接口、事件和 job 幂等键来源 |
| `03_ddd_step_09_function_flows.md` | 45 个函数级处理流 | 作为并发修改、重复调用和重入场景来源 |
| `03_ddd_step_11_persistence_transaction_consistency.md` §6.4~§6.6 | 事务边界、一致性和补偿策略 | 作为锁、事务、sequence 和恢复口径来源 |
| `03_ddd_step_12_error_recovery.md` §3.4 | 并发冲突、重复请求和外部依赖失败处理 | 作为错误映射和恢复分类来源 |
| `standards/document/详细设计书写规范.md` §5.12 | 并发、幂等与重入保护格式 | 作为输出格式约束 |

---

## 3. SOP 问题回答

### 3.1 哪些处理流可能并发修改同一资源？

会并发修改同一资源的处理流集中在五类:

| 类型 | 可能并发的处理流 | 共享资源 |
|---|---|---|
| space / scope 写入 | `CloseConversationSpaceFlow`、`UpdateParticipantScopeFlow`、`UpdateVisibilityScopeFlow`、`AppendConversationFactFlow` | `ConversationSpace`、`ParticipantScope`、`VisibilityScope`、`ScopeChangeRecord` |
| fact 写入 | `AppendConversationFactFlow`、`RetractConversationFactFlow`、runtime / bridge inbound consumer | `ConversationFact`、`FactAppendReceipt`、`ConversationFactSequence` |
| manifestation / external reference 写入 | `ManifestExternalFactFlow`、governance / work / artifact / bridge inbound consumer、snapshot refresh job | `CrossDomainManifestation`、`ExternalFactSnapshot`、`ExternalReferenceProjection` |
| outbox / handoff 推进 | command / consumer enqueue、outbox publish job、trace handoff job、archive handoff job | `ConversationOutboxRecord`、`TraceHandoffRecord`、`ArchiveHandoffRecord` |
| projection / cursor 维护 | read model rebuild、search rebuild、cursor maintenance、cursor cleanup、visibility scope update | `ConversationProjectionState`、`ConversationReadModel`、`SearchIndexProjection`、`ConversationChangeCursor` |

统一控制口径:

```text
write-like flow:
  begin UnitOfWork
  reserve IdempotencyKey
  lock aggregate with get_for_update when existing truth is changed
  save truth / derived marker / outbox in the same UnitOfWork
  complete idempotency
  commit UnitOfWork
```

外部 publish / handoff 不在长事务内执行。外部调用完成后,再用短事务锁定 outbox 或 handoff record 并推进状态。

### 3.2 哪些接口、事件或 job 可能被重复调用？

| 类别 | 可能重复来源 | 处理原则 |
|---|---|---|
| Command API | client retry、network timeout、handler response lost | 同 key 同请求返回既有 result;同 key 不同请求返回 `IdempotencyError::Conflict` |
| Query API | client refresh、poll retry、page retry | 不写幂等记录;按 request id / cursor / page 读取,不会推进 truth |
| Inbound Event Consumer | upstream replay、broker redelivery、consumer crash retry | event id + source ref + idempotency key 命中时 skip |
| Outbound Event Publish | publish job 重跑、transport retry、state write failure after publish | outbox record id + event id 去重;不得发布重复事件 |
| Operations Job | scheduler retry、operator rerun、partial failure rerun | job run id + idempotency key 返回已有 job receipt;不同 run 可重扫未完成目标 |

### 3.3 幂等键来自请求、事件、job 参数还是数据库唯一约束？

| 来源 | 使用位置 | 说明 |
|---|---|---|
| `CommandMetadata.request.idempotency_key` | 10 个 Command API | 必须为 `Some(IdempotencyKey)`;command envelope 不再携带顶层 key |
| query `RequestId` | 11 个 Query API | 只用于读取审计或 read marker,不作为写幂等 |
| event id + source ref + `IdempotencyKey` | 6 个 Inbound Consumer | event id 负责 broker replay 去重,source ref 防止跨来源误判 |
| outbox record id + event id | 8 个 Outbound Event | event id 必须稳定来自 outbox / id generator |
| job run id + `IdempotencyKey` | 9 个 Operations Job | 同一 job run 重复提交返回已有 receipt |
| 数据库唯一约束 / 版本 / sequence | repository adapter | 兜底保护 space / fact / cursor / outbox sequence 和 source ref 唯一性 |

### 3.4 重复请求应该返回既有结果、跳过、覆盖还是报错？

| 重复类型 | 处理 |
|---|---|
| 同 command key、同 operation、同 request digest | 返回已完成 result 或 receipt |
| 同 command key、不同 operation 或不同 request digest | `mark_conflict`,返回 409 conflict |
| 重复 query | 重新读取或返回 cached read marker,不得覆盖状态 |
| 重复 inbound event | skip already consumed event,保留 consumer audit |
| 重复 outbound event publish | 不重复 publish;必要时用同 event id 查询 / 写入 publish evidence |
| 重复 job run | 返回 existing job receipt |
| 不同 job run 扫到同一 pending 目标 | 按 record lock / state transition 处理,已完成目标 skip |

本仓不采用“覆盖”作为重复请求处理方式。Conversation truth、scope、fact、handoff 和 projection state 的重复写入必须通过状态转换、sequence 前进或明确的新 command 表达。

`request digest` 由 application service 在 validate 后、调用 `IdempotencyRepository.reserve(key, operation, request_digest, uow)` 前按规范化 command / event / job 输入计算;不得包含 `request_id`、`requested_at`、`trace_context` 等 volatile metadata。同一 key 的 duplicate / conflict 判断必须以 `operation + request_digest` 为准。

### 3.5 并发冲突如何测试？

测试必须覆盖三层:

| 层级 | 测试口径 |
|---|---|
| domain / application 单元测试 | 同一对象重复状态转换、sequence regression、idempotency duplicate / conflict |
| in-memory adapter 测试 | 必须模拟唯一键、版本、锁和 transaction rollback,不能让测试绕过并发语义 |
| durable adapter / integration 测试 | 同一 idempotency key、同一 fact / cursor / outbox record 并发写入,必须出现唯一键冲突、版本冲突或 skip |

并发测试不要求真实多线程覆盖所有业务分支,但每个会影响实现的锁、唯一约束、幂等记录和 retry 状态必须有可重复触发的测试切口。

## 4. 当前文档问题诊断

| 问题 | 影响 | 本步处理 |
|---|---|---|
| Step 8 已给幂等矩阵,但未展开并发资源 | 实现者不知道哪些 repository 调用必须加锁 | 本步按 space、fact、manifestation、outbox、projection 分场景列出 |
| Step 9 已在每个 flow 写 duplicate / retry,但缺统一处理口径 | 容易出现某些 flow 返回旧结果、某些 flow 重新写 truth | 本步统一 command / event / job 重复处理 |
| Step 11 已定义事务边界,但未说明重入后如何恢复 | job 和外部 publish / handoff 容易在部分失败后重复副作用 | 本步补重入保护表 |
| Step 12 把并发冲突交给 Step 13 | 需要把 conflict 映射到具体测试切口 | 本步把失败错误和测试切口落表 |

## 5. 设计取舍

| 议题 | 方案 | 取舍 |
|---|---|---|
| 幂等记录归属 | A. command、consumer、job 共用 `IdempotencyRepository`;B. 每类 flow 独立 repository | 采用 A。Step 7 已定义统一 port,实现时通过 `IdempotencyOperation` 区分类别 |
| 并发控制方式 | A. 只靠乐观版本;B. `get_for_update` 锁 + version / unique constraint | 采用 B。既能表达写事务锁,也能让 durable adapter 用唯一键兜底 |
| 重复 command 处理 | A. 重新执行业务逻辑;B. 返回已有 result / receipt | 采用 B。避免重复 outbox、fact sequence 和 handoff intent |
| outbound publish 重试 | A. truth 事务内同步 publish;B. outbox 异步 publish,短事务推进状态 | 采用 B。Step 11 已要求 publish / handoff 失败不回滚 truth |
| query 幂等 | A. 给 query 写幂等记录;B. query 只读,只使用 request id 做审计 | 采用 B。query 不应推进 cursor 或 projection truth |

## 6. 结构化中间产物

### 6.1 并发场景表

| 场景 | 冲突资源 | 控制方式 | 失败错误 | 测试切口 |
|---|---|---|---|---|
| 同一 `CreateConversationSpace` command 重试 | `IdempotencyRecord`、`ConversationSpaceId`、初始 scope bundle | 先计算 request digest,再 reserve command key + operation + digest;同 key 同 digest 返回已创建 result | `IdempotencyError::Conflict` / `RepositoryError` | duplicate create returns previous result;different body same key conflicts |
| close space 与 append fact 并发 | `ConversationSpace.truth_state`、fact append policy | `get_space_for_update`;close 后 append 必须重新检查 state | `ApplicationError::Conflict` / `DomainError::InvalidStateTransition` | close while append;append after closed rejected |
| participant scope 与 visibility scope 并发更新 | `ParticipantScope`、`VisibilityScope`、`ScopeChangeRecord` | scope bundle 同事务保存;版本冲突返回 conflict | `RepositoryError` / `ApplicationError::Conflict` | concurrent participant and visibility updates |
| visibility scope 更新与 read model rebuild 并发 | `VisibilityScope`、`ConversationProjectionState`、`ConversationReadModel` | visibility command stale projection;rebuild 读取最新 scope 后 upsert | `RepositoryError` / stale marker | visibility update marks projection stale;rebuild refreshes |
| 同一 space 内并发 append fact | `ConversationFactSequence`、`ConversationFact`、`FactAppendReceipt` | sequence 单调唯一;append receipt 与 fact 同事务 | `RepositoryError` / `DomainError::SequenceRegression` | concurrent append produces unique sequence or conflict |
| retract 同一 fact 并发 | `ConversationFact.fact_state`、trace context | `get_fact_for_update`;terminal fact 不允许重复推进 | `DomainError::InvalidStateTransition` / conflict | double retract returns existing result or rejects terminal transition |
| append fact 与 retract fact 交叉 | `ConversationFact.fact_state` | append 创建后 retract 锁 fact;retract 不能抢先处理 missing fact | `ApplicationError::NotFound` / conflict | retract before append commit;retract after append commit |
| manifestation command 与 inbound source event 并发 | `CrossDomainManifestation`、`ExternalFactSnapshot`、`ExternalReferenceProjection` | external fact ref 唯一;manifestation state 只能前进 | `RepositoryError` / `DomainError::DigestMismatch` | same external ref manifests once;digest mismatch evidence |
| snapshot refresh 与 manifestation read 并发 | `ExternalFactSnapshot`、`ReferenceResolutionState` | refresh 用短事务 upsert snapshot;query 暴露 stale / unresolved marker | `RepositoryError` / unresolved marker | query during refresh returns safe marker |
| inbound duplicate source event | `IdempotencyRecord`、source projection | event id + source ref + key reserve;命中 skip | `IdempotencyError::Conflict` / skip receipt | duplicate work / governance / runtime / artifact / bridge event skipped |
| inbound event 与 command 同时写 fact | `ConversationFactSequence`、space truth | 同一 space sequence 唯一;consumer 写入也走 UnitOfWork | `RepositoryError` / policy reject | runtime result and manual append race |
| outbox enqueue 与 truth 写入 | truth object、`ConversationOutboxRecord` | truth + outbox 同事务;enqueue 失败回滚 truth | `RepositoryError` / `TransactionError` | outbox rollback leaves no fact / scope truth |
| outbox publish job 并发处理同一 record | `ConversationOutboxRecord.publication_state` | `get_for_update`;状态只允许 `Pending` / `RetryPending` 推进 | `PublishError` / state conflict | duplicate publish job does not double publish |
| projection rebuild 同时处理同一 space | `ConversationProjectionState`、read model | 每 space 事务;projection state version 控制 | `RepositoryError` / `JobError::PartialFailure` | concurrent rebuild returns one fresh state |
| cursor maintenance 与 cursor cleanup 并发 | `ConversationChangeCursor`、cursor projection | maintenance 只推进 cursor;cleanup 只删 expired cursor | `DomainError::SequenceRegression` / skipped active | active cursor not deleted;expired cursor cleanup idempotent |
| poll changes 与 cursor maintenance 并发 | `ConversationChangeCursor`、`ChangeCursorProjection` | query 只读不推进;job 推进 cursor / projection | stale / expired cursor marker | poll sees old or new cursor safely |
| trace handoff command 与 delivery job 并发 | `TraceHandoffRecord` | command 创建 pending;job 只锁 pending / retry pending | `ApplicationError::NotFound` / state conflict | delivery skips missing or non-pending handoff |
| archive handoff delivery 并发 | `ArchiveHandoffRecord` | 每条 handoff 短事务锁定;external package ref 幂等 | `HandoffError` / `JobError::PartialFailure` | duplicate archive delivery does not create second package |
| consistency validation 与其他 job 并发 | projection / reference diagnostic marker | validation 只写 report / diagnostic,不自动 repair truth | `JobError::PartialFailure` | validation rerun does not mutate truth |
| same idempotency key with different payload | `IdempotencyRecord` | request digest / operation mismatch 后 `mark_conflict` | `IdempotencyError::Conflict` | same key different command body returns 409 |

### 6.2 幂等键表

| 接口 / Job / Event | 幂等键 | 幂等窗口 | 重复请求处理 |
|---|---|---|---|
| `CreateConversationSpace` | `CommandMetadata.request.idempotency_key` | command retention window | 返回已创建 space result |
| `CloseConversationSpace` | `CommandMetadata.request.idempotency_key` | command retention window | 返回已有 lifecycle result |
| `UpdateParticipantScope` | `CommandMetadata.request.idempotency_key` | command retention window | 返回已有 participant result |
| `UpdateVisibilityScope` | `CommandMetadata.request.idempotency_key` | command retention window | 返回已有 visibility result |
| `AppendConversationFact` | `CommandMetadata.request.idempotency_key` | command retention window | 返回 duplicate receipt |
| `RetractConversationFact` | `CommandMetadata.request.idempotency_key` | command retention window | 返回已有 retraction result |
| `ManifestExternalFact` | `CommandMetadata.request.idempotency_key` | command retention window | 返回已有 manifestation result |
| `CreateReviewAnchor` | `CommandMetadata.request.idempotency_key` | command retention window | 返回已有 anchor result |
| `RequestTraceHandoff` | `CommandMetadata.request.idempotency_key` | handoff retention window | 返回已有 handoff intent |
| `RequestArchiveHandoff` | `CommandMetadata.request.idempotency_key` | archive retention window | 返回已有 archive intent |
| Query APIs | optional request id | read audit policy | 不写状态;重复读取返回当前 authorized view 或 cached read marker |
| `ConsumeWorkContextChanged` | event id + source ref + `IdempotencyKey` | consumer retention window | skip already consumed event |
| `ConsumeGovernanceFactCommitted` | event id + source ref + `IdempotencyKey` | consumer retention window | skip already consumed event |
| `ConsumeArtifactFactCommitted` | event id + source ref + `IdempotencyKey` | consumer retention window | skip already consumed event |
| `ConsumeRuntimeResultCommitted` | event id + source ref + `IdempotencyKey` | consumer retention window | skip already consumed event |
| `ConsumeBridgeMappedFact` | event id + source ref + `IdempotencyKey` | consumer retention window | skip already consumed event |
| `ConsumeIdentityActorChanged` | event id + source ref + `IdempotencyKey` | consumer retention window | skip already consumed event |
| Outbound events | outbox record id + event id | outbox retention window | do not publish duplicate;write publish evidence once |
| `PublishConversationOutbox` | job run id + `IdempotencyKey` | job retention window | return existing job receipt |
| `RebuildConversationReadModels` | job run id + `IdempotencyKey` | job retention window | return existing job receipt |
| `RebuildConversationSearchIndex` | job run id + `IdempotencyKey` | job retention window | return existing job receipt |
| `MaintainConversationChangeCursors` | job run id + `IdempotencyKey` | job retention window | return existing job receipt |
| `RefreshExternalReferenceSnapshots` | job run id + `IdempotencyKey` | job retention window | return existing job receipt |
| `DeliverTraceHandoff` | job run id + `IdempotencyKey` | job retention window | return existing job receipt |
| `DeliverArchiveHandoff` | job run id + `IdempotencyKey` | job retention window | return existing job receipt |
| `ValidateConversationConsistency` | job run id + `IdempotencyKey` | job retention window | return existing job receipt |
| `CleanupExpiredConversationCursors` | job run id + `IdempotencyKey` | job retention window | return existing job receipt |

### 6.3 重入保护表

| 场景 | 重入来源 | 保护方式 | 恢复方式 |
|---|---|---|---|
| command 事务提交前失败后重试 | repository / transaction transient failure | UnitOfWork rollback;idempotency 未完成时重新 reserve | 重跑整个 command,不得保留部分 truth |
| command 已提交但响应丢失 | client timeout / gateway retry | completed idempotency record 保存 result ref | 返回 existing result / receipt |
| command 同 key 不同内容 | client bug / retry payload drift | request digest + operation 校验 | `mark_conflict` 并返回 409 |
| inbound consumer 提交后 ack 丢失 | broker redelivery | event id + source ref + key 命中 | skip,返回 consumed receipt |
| inbound consumer 中途失败 | resolver / repository failure | consumer UnitOfWork rollback;quarantine only for invalid envelope | broker / scheduler 重试或写 quarantine evidence |
| outbox publish 成功后状态写失败 | publish transport success but DB failure | event id 稳定;重新锁 outbox 前检查 publication state / evidence | publish job 重跑,mark published / retry / failed |
| outbox publish transient failure | event bus temporary unavailable | outbox `RetryPending` + retry marker | publish job 根据 retry marker 重跑 |
| projection rebuild 部分失败 | job batch interruption | 每 space / consumer 一事务;projection state 标记 `Failed` 或 stale | 下次 job 从 source position 重扫 |
| cursor maintenance 部分失败 | outbox gap / transaction failure | cursor sequence 只能前进;gap 写 stale marker | rerun maintenance;expired cursor 由 cleanup 处理 |
| snapshot refresh resolver 失败 | external source unavailable | 写 unresolved / stale marker,不写来源正文 | 后续 refresh job 重试并更新 safe snapshot |
| trace handoff 外部成功但状态写失败 | handoff adapter success + DB failure | handoff id / destination ref 作为外部幂等参考;短事务锁 record | delivery job 重跑并补写 `HandedOff` / retry / failed |
| archive handoff 外部成功但状态写失败 | archive package created + DB failure | archive handoff id / package ref 去重 | delivery job 重跑并补写 `Archived` / retry / failed |
| cleanup expired cursor 重跑 | scheduler retry | delete expired cursor 幂等;active cursor skipped | 返回已有清理结果或重新计算 cleaned / skipped count |
| consistency validation 重跑 | operator rerun / scheduler retry | report output ref + job idempotency;不自动 repair truth | 返回 existing receipt 或生成新 validation report |

## 7. 回填草稿

> 本节不重复粘贴 §6 的完整表。正式 `03-详细设计.md` 生成 §12 时,应从本文件 §6 摘录。

正式文档 §12 建议采用以下结构:

```text
12. 并发、幂等与重入保护
  12.1 设计依据与总体策略
  12.2 并发场景表
  12.3 幂等键表
  12.4 重入保护表
  12.5 测试要求
```

必须引用:

| 正式章节 | 引用来源 |
|---|---|
| §12.1 | `design-calibration/03_ddd_step_13_concurrency_idempotency.md` §3 / §5 |
| §12.2 | `design-calibration/03_ddd_step_13_concurrency_idempotency.md` §6.1 |
| §12.3 | `design-calibration/03_ddd_step_13_concurrency_idempotency.md` §6.2 |
| §12.4 | `design-calibration/03_ddd_step_13_concurrency_idempotency.md` §6.3 |
| §12.5 | `design-calibration/03_ddd_step_13_concurrency_idempotency.md` §3.5 |

## 8. 待确认事项

无。

本步以 Step 8 的幂等矩阵、Step 11 的事务 / 一致性契约和 Step 12 的错误恢复口径为真相源,未引入新的对象名、状态名或协议字段。

## 9. 本步完成检查

| 检查项 | 结果 | 说明 |
|---|---|---|
| 并发场景可映射到真实处理流 | 通过 | §6.1 覆盖 command、consumer、outbox、projection、handoff 和 job |
| 幂等键可从请求、事件或 job 参数中计算 | 通过 | §6.2 与 Step 8 §7.10 对齐 |
| 重复事件和重复 job 处理结果明确 | 通过 | inbound skip、outbound no duplicate publish、job existing receipt 已写明 |
| 重入保护有恢复方式 | 通过 | §6.3 覆盖事务失败、ack 丢失、publish / handoff 状态写失败和 job rerun |
| 可进入 Step 14 配置引用与外部依赖绑定 | 通过 | 下一步可基于本步 retention window、retry marker 和 job 行为补配置引用 |
