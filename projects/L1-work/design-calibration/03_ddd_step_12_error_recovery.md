# Step 12. 定义错误模型、异常分支与恢复口径

### 1. Step 状态

- 状态:[x] 已确认
- 对应 SOP:`standards/document/详细设计讨论流程_SOP.md` Step 12
- 回填章节:`03-详细设计.md` §5.11 错误模型、异常分支与恢复口径 / §7 API / Command / Query / Event / Job 协议契约 / §8 事务与一致性

### 2. 本步输入

| 输入 | 内容 | 本步使用方式 |
|---|---|---|
| `03_ddd_step_06_object_contracts.md` | domain method 返回 `DomainError`、policy guard 和状态转换拒绝点 | 固定 domain error 来源 |
| `03_ddd_step_07_trait_port_adapter_contracts.md` | `RepositoryError`、`PortError`、`UnitOfWorkError`、`IdempotencyError` | 固定 port / infra 前的错误边界 |
| `03_ddd_step_08_protocol_contracts.md` | `WorkProtocolError`、query surface、protocol error 映射 | 固定对外错误面 |
| `03_ddd_step_09_function_flows.md` | 每条 flow 的异常分支、回滚和 failed marker | 固定处理位置 |
| `03_ddd_step_10_state_matrix.md` | 非法转换、terminal state、failed / retry 状态 | 固定状态错误和状态副作用 |
| `03_ddd_step_11_persistence_transaction_consistency.md` | version conflict、UoW、outbox / projection / reference 恢复口径 | 固定事务失败和恢复策略 |

### 3. 分批写入记录

本 Step 按 `设计文档讨论中间产物规范.md` §3.4 分批写入:

| 批次 | 内容 | 状态 |
|---|---|---|
| 12.1 | 文件骨架、SOP 问题回答、错误层级与错误类型表 | [x] |
| 12.2 | 内部错误到协议 / query / event / job 映射表 | [x] |
| 12.3 | 异常分支处理表、恢复口径表、审计 / 事件规则 | [x] |
| 12.4 | 回填草稿、待确认事项和进入下一步条件 | [x] |

### 4. SOP 问题回答

1. 每个模块有哪些错误类型?

   回答:Domain 层使用 `DomainError`;Application / service 层使用 `ApplicationError`;repository / resolver / publisher / handoff / UoW / idempotency 使用 Step 7 已定义的 `RepositoryError`、`PortError`、`UnitOfWorkError`、`IdempotencyError`;protocol 层对外只暴露 Step 8 的 `WorkProtocolError` 和 query `QuerySurface`。各层错误不得互相泄漏。

2. 哪些错误映射到 HTTP / RPC / Event 失败?

   回答:同步 Command / Query handler 只返回 `WorkProtocolError` 或 query surface。Inbound Event consumer 将 envelope / version / required ref 类错误映射为 `DeadLetter`,临时 repository / resolver 错误映射为 retry。Operations Job 将 item-level failure 写入 job report,job input 无效才 reject。

3. 哪些错误可重试,哪些不可重试,哪些需要人工介入?

   回答:store / resolver / publisher / handoff temporary unavailable、version conflict、event consumer transient repository failure 可重试。invalid request、domain rejected、not visible、not found、idempotency conflict、unsupported event version 不可原样重试。UnitOfWork commit unknown、projection repeated failed、reference repeated failed、outbox repeated failed 和 invariant violation 需要人工介入或 reconciliation。

4. 事务失败、并发冲突、重复请求、外部依赖失败如何处理?

   回答:事务内失败 rollback,不得写 accepted truth / outbox / projection stale 成功副作用。version conflict 返回 `VersionConflict` 或 event retry。duplicate same digest 中,Command 通过 `CommandResultRepository.get_result` 返回 stored result,Job 通过 `JobResultRepository.get_report` 返回 stored report;different digest 返回 `IdempotencyConflict`。外部依赖 failure 不补造外部 truth:command reject / unresolved,consumer 保存 failed / unresolved marker 或 retry,job 写 failed_refs。

5. 哪些异常需要写审计、日志或事件?

   回答:只有 accepted truth change 写 `WorkTraceRecord` 和 `WorkOutboxRecord`。非法 command、domain reject、not visible、invalid request 不写业务 audit / outbox。outbox publish failure 写 outbox failed marker;projection rebuild failure 写 freshness failed marker;reference resolver failure 写 reference failed marker;consumer dead-letter / job failed report 属于 worker / job 运行面,不表示业务 truth 成立。

### 5. 当前文档问题诊断

| 位置 | 当前问题 | 本步处理 |
|---|---|---|
| Step 6 | `DomainError` 被大量函数引用,但未集中定义 variant / 对外映射 | 本 Step 定义 domain error category 和 mapping |
| Step 7 | repository / port / UoW / idempotency error 已定义,但未统一映射到 application / protocol | 本 Step 补跨层映射表 |
| Step 8 | protocol error 已定义,但 query surface、event disposition、job report 的错误边界需要集中说明 | 本 Step 分别定义 Command / Query / Event / Job 映射 |
| Step 9 | 错误映射分散在每个 flow 中 | 本 Step 汇总异常分支处理表 |
| Step 11 | commit unknown 和 failed marker 恢复仍需错误模型承接 | 本 Step 固定可重试、不可重试、人工介入口径 |

### 6. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| DomainError | 只作为函数返回类型出现 | 定义 category、触发条件和 mapping | 支撑 domain 单测断言 |
| ApplicationError | service 层只从 flow 推断 | 定义 service error enum category | 支撑 handler 映射 |
| Query error | 分散为 surface marker | 统一 query surface 映射 | 防止 query 写修复 |
| Event error | 只有 dead-letter / retry 文本 | 定义 consumer disposition | 支撑 worker adapter |
| Job error | 只有 failed report 文本 | 定义 job-level vs item-level failure | 支撑 job report tests |

### 7. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 直接向外暴露 repository / domain error | 实现少一层映射 | 泄漏内部结构,protocol 不稳定 | 不采用 |
| 所有错误统一成 `Failed` | 简洁 | 调用方无法区分 retry / reject / dead-letter | 不采用 |
| 分层错误 + 统一映射 | 可测试,边界清晰 | 表格较长 | 采用 |
| Query 读取 projection failed 时返回 error | 简化 handler | 违背 query degraded surface 设计 | 不采用 |
| Query 使用 surface marker 表达 stale / failed / missing | 调用方可解释 degraded read | 需要 view DTO 带 marker | 采用 |

### 8. 结构化中间产物

#### 8.1 错误层级

```text
domain method / policy
  -> DomainError
application service
  -> ApplicationError
repository / port / UoW / idempotency
  -> RepositoryError / PortError / UnitOfWorkError / IdempotencyError
api / worker / jobs handler
  -> WorkProtocolError / QuerySurface / ConsumerDisposition / WorkJobReport
```

错误边界规则:

- `domain` 不返回 `RepositoryError`、`PortError`、`ApplicationError` 或 `WorkProtocolError`。
- `application` 可以接收 domain / repository / port / UoW / idempotency error,但对 handler 只返回 `ApplicationError` 或 typed report。
- `api` / `worker` / `jobs` 不把 internal error 结构直接暴露给调用方。
- `query` 不把 stale / rebuilding / failed projection 当作写路径错误,必须映射为 query surface。

#### 8.2 错误类型表

##### `DomainError`

`DomainError` 定义在 `domain/src/errors.rs`,由 domain object method / policy 返回。

| 错误类型 | 所属模块 | 触发条件 | 是否可重试 | 对外映射 |
|---|---|---|---|---|
| `DomainError::InvalidStateTransition` | domain | From / To 不在 Step 10 矩阵、terminal state 再迁移、状态机前置条件不满足 | 否 | `WorkProtocolError::DomainRejected` |
| `DomainError::PolicyRejected` | domain policy | lifecycle / backlog / formal work / dependency graph / commitment / evidence policy 拒绝 | 否 | `WorkProtocolError::DomainRejected` |
| `DomainError::InvariantViolation` | domain | domain object 内部字段组合不可能成立,例如 accepted promote 无 created work ref | 否;需人工介入 | `WorkProtocolError::DomainRejected` or job failed |
| `DomainError::ExternalBodyRejected` | domain policy | command / event 尝试携带 conversation / artifact / runtime 正文进入 Work truth | 否 | `WorkProtocolError::DomainRejected` |
| `DomainError::MissingRequiredValue` | domain factory | domain factory 必需值为空或非法,且 handler 未提前捕获 | 否 | `WorkProtocolError::InvalidRequest` |
| `DomainError::ProjectionMutationRejected` | domain projection policy | projection / query / reconciliation 试图生成业务 truth | 否 | `WorkProtocolError::DomainRejected` |

##### `ApplicationError`

`ApplicationError` 定义在 `application/src/errors.rs`,由 service 返回给 handler / runner。

| 错误类型 | 所属模块 | 触发条件 | 是否可重试 | 对外映射 |
|---|---|---|---|---|
| `ApplicationError::InvalidRequest` | application | metadata / actor / idempotency / required DTO field 缺失,route/body 不一致 | 否 | `WorkProtocolError::InvalidRequest` |
| `ApplicationError::NotFound` | application | Work-owned truth repository 返回 `None` | 否,除非调用方随后创建 | `WorkProtocolError::NotFound` / query `Missing` |
| `ApplicationError::NotVisible` | application authorization | query actor 通过 `ActorMemberResolverPort` 解析时返回 not found / rejected;actor 在目标 project 内没有 `Active` / `Paused` ProjectMember;target member 为 `Proposed` / `Released`;formal work / iteration / relation / trace subject scope 无法解析到可见 project;或 command actor 不可修改目标 scope | 否 | `WorkProtocolError::NotVisible` / query `NotVisible` |
| `ApplicationError::DomainRejected` | application | `DomainError::InvalidStateTransition` / `PolicyRejected` / `ExternalBodyRejected` | 否 | `WorkProtocolError::DomainRejected` |
| `ApplicationError::VersionConflict` | application | `RepositoryError::VersionConflict` | 可 reload 后重试 | `WorkProtocolError::VersionConflict` |
| `ApplicationError::IdempotencyConflict` | application | same key + different digest | 否,需换 key | `WorkProtocolError::IdempotencyConflict` |
| `ApplicationError::ExternalReferenceUnresolved` | application | resolver not found / rejected / required snapshot missing | 通常否;source 修复后可重试 | `WorkProtocolError::ExternalReferenceUnresolved` |
| `ApplicationError::TemporarilyUnavailable` | application | repository / port / UoW temporary failure | 是 | `WorkProtocolError::TemporarilyUnavailable` |
| `ApplicationError::CommitStatusUnknown` | application | UoW commit failure after possible partial durable commit | 需人工 / reconciliation | `WorkProtocolError::TemporarilyUnavailable` |
| `ApplicationError::DuplicateResultMissing` | application idempotency | duplicate reservation points to missing result_ref,or `CommandResultRepository.get_result(result_ref)` / `JobResultRepository.get_report(result_ref)` returns none / wrong result kind | 需人工 / reconciliation | `WorkProtocolError::TemporarilyUnavailable` |

##### Infrastructure and port errors

| 错误类型 | 所属模块 | 触发条件 | 是否可重试 | 对外映射 |
|---|---|---|---|---|
| `RepositoryError::NotFound` | application port | repository helper 需要强制存在但 durable store 缺失 | 视调用场景 | `NotFound` / `Missing` / failed report |
| `RepositoryError::VersionConflict` | application port | optimistic version mismatch | 是,reload 后重试 | `VersionConflict` / event retry |
| `RepositoryError::TransactionRejected` | application port | UoW handle invalid or operation outside transaction | 否,实现错误或 adapter bug | `TemporarilyUnavailable` + inspect |
| `RepositoryError::StoreUnavailable` | application port | store temporary unavailable | 是 | `TemporarilyUnavailable` / event retry / job failed |
| `PortError::NotFound` | external port | external ref 不存在 | 否,除非上游随后创建 | `ExternalReferenceUnresolved` / failed marker |
| `PortError::Rejected` | external port | external ref 存在但不可用于该操作 | 否 | `ExternalReferenceUnresolved` / failed marker |
| `PortError::Unavailable` | external port | upstream / publisher / handoff temporary failure | 是 | `TemporarilyUnavailable` / retry / failed marker |
| `PortError::InvalidResponse` | external port | unsupported or malformed upstream payload | 否,需适配器升级 | `DeadLetter` / failed report |
| `UnitOfWorkError::BeginFailed` | application | 本地事务无法开始 | 是 | `TemporarilyUnavailable` |
| `UnitOfWorkError::CommitFailed` | application | commit 失败且状态可能未知 | 需人工 / reconciliation | `TemporarilyUnavailable` |
| `UnitOfWorkError::RollbackFailed` | application | rollback 失败 | 需人工 / reconciliation | `TemporarilyUnavailable` |
| `IdempotencyError::AlreadyReserved` | application | same key in-flight | 是,稍后重试 | `TemporarilyUnavailable` or duplicate wait policy |
| `IdempotencyError::Conflict` | application | same key different digest | 否 | `IdempotencyConflict` |
| `IdempotencyError::StoreUnavailable` | application | idempotency store unavailable | 是 | `TemporarilyUnavailable` |

#### 8.3 内部错误映射表

| 内部错误 | HTTP / RPC / Event 映射 | 调用方应如何处理 |
|---|---|---|
| `ApplicationError::InvalidRequest` | HTTP 400 / RPC invalid argument / job reject / event dead-letter if envelope invalid | 修正请求或事件 envelope |
| `ApplicationError::NotFound` | HTTP 404 / RPC not found / query `Missing` | reload refs;不要重放相同 command 期待创建 |
| `ApplicationError::NotVisible` | HTTP 403 / query `NotVisible` | 调整权限或 actor scope |
| `ApplicationError::DomainRejected` | HTTP 409 or 422 / domain rejected | 修正业务状态、reason、evidence 或 command target |
| `ApplicationError::VersionConflict` | HTTP 409 / event retry / job failed item | reload current version and retry |
| `ApplicationError::IdempotencyConflict` | HTTP 409 / event dead-letter / job reject | 使用新 idempotency key |
| `ApplicationError::ExternalReferenceUnresolved` | HTTP 424-like dependency failed / event unresolved marker / job failed ref | 修复外部 ref 或等待 refresh |
| `ApplicationError::TemporarilyUnavailable` | HTTP 503 / event retry / job failed or retry | retry with same idempotency key where applicable |
| `ApplicationError::CommitStatusUnknown` | HTTP 503 with unknown status marker / reconciliation required | do not blind retry without idempotency lookup |
| `RepositoryError::VersionConflict` | mapped to `ApplicationError::VersionConflict` | reload current record |
| `PortError::Unavailable` | mapped to `TemporarilyUnavailable` or failed marker | retry by policy |
| `PortError::InvalidResponse` | event `DeadLetter` / job failed | adapter or upstream contract fix |
| `UnitOfWorkError::CommitFailed` | `CommitStatusUnknown` when commit may have partially applied | run reconciliation / idempotency audit |
| `IdempotencyError::Conflict` | `IdempotencyConflict` | do not execute business write |

#### 8.4 Query surface mapping

| 来源 | Query surface / error | 写入副作用 | 调用方处理 |
|---|---|---|---|
| authorized projection exists and fresh | `Visible` | none | consume data |
| authorized but no data exists | `Empty` or `Missing` per Step 8 DTO | none | show empty / missing |
| authorization denied by actor-member / ProjectMember visibility policy | `NotVisible` | none | hide data, do not leak existence |
| projection stale | `Stale` with marker | none | display stale marker;operations may trigger rebuild separately |
| projection rebuilding | `Rebuilding` | none | retry later or show pending |
| projection failed | `Failed` | none | show degraded / operations inspect |
| repository read unavailable | `WorkProtocolError::TemporarilyUnavailable` | none | retry read |

Query path must not write audit, outbox, idempotency, freshness marker, or reference state.

#### 8.5 Inbound event disposition

`ConsumerDisposition` 是 worker / consumer service 的内部处理结果,不作为 public API DTO。它用于把 event handling 结果交给 runtime adapter 执行 ack / retry / dead-letter。

| Disposition | 含义 | Runtime adapter 行为 |
|---|---|---|
| `Ack` | event 已被接受并完成本地处理 | ack source event |
| `AckDuplicate` | same digest duplicate,无需重放处理 | ack source event |
| `AckWithMarker` | event 未形成业务 truth,但已保存 unresolved / failed / pending marker | ack source event |
| `Retry` | 临时依赖或 store failure,本地 UoW 已 rollback | retry by worker policy |
| `DeadLetter` | envelope / version / digest conflict / malformed payload 不可接受 | send to DLQ / dead-letter record |

| 场景 | 检测位置 | Consumer disposition | 是否写本地状态 |
|---|---|---|---|
| missing envelope / event id / required ref | worker handler | `DeadLetter` | no business state |
| unsupported event version | worker handler `EventSchemaVersion` parse / topic major check | `DeadLetter` | no business state |
| duplicate same source event digest | idempotency service | `AckDuplicate` | no new state |
| same event key different digest | idempotency service | `DeadLetter` / conflict marker | no business state |
| external ref unresolved but event valid | consumer service | `AckWithMarker` or retry by source policy | save `ReferenceResolutionState::Unresolved` / failed marker when allowed |
| repository temporary failure | repository | `Retry` | rollback |
| domain / policy reject for snapshot marker | domain / policy | `DeadLetter` or failed marker by event policy | only marker if explicitly allowed |

#### 8.6 Operations job error model

| Job category | Job-level reject | Item-level failure | Recovery |
|---|---|---|---|
| `PublishWorkOutbox` | invalid metadata / missing idempotency | publisher failure, outbox version conflict | mark failed / retry pending |
| `RebuildWorkProjections` | invalid projection_set / missing idempotency | build failure, replace failure | mark projection failed, rerun job |
| `RefreshExternalReferenceSnapshots` | invalid scope / missing idempotency | resolver failure per ref | mark reference failed, retry refresh |
| `RunWorkReconciliation` | invalid scope | drift found in report | operator review;does not auto-fix truth |
| `PrepareWorkTraceHandoff` | invalid target / missing idempotency | handoff port failure | retry handoff job |
| `PrepareArchiveHandoff` | invalid archive scope / missing idempotency | archive port failure | retry handoff job |

Job-level reject does not produce business truth. Item-level failure is reported in `WorkJobReport.failed_refs` or equivalent report DTO and must not be hidden as success.

#### 8.7 异常分支处理表

| 场景 | 检测位置 | 处理方式 | 是否写审计 / 事件 |
|---|---|---|---|
| actor / metadata / body missing | handler / runner | reject `InvalidRequest`;no service write | no audit, no outbox |
| command idempotency key missing | handler | reject `InvalidRequest` before UoW | no audit, no outbox |
| idempotency duplicate same digest | application service | command returns stored result via `CommandResultRepository`;job returns stored report via `JobResultRepository` | no new audit / outbox |
| idempotency conflict | application service | rollback, mark conflict if reserved, return conflict | no business audit / outbox |
| repository none for Work-owned truth | application service | `NotFound` or query `Missing` | no audit / outbox |
| external resolver not found / rejected | application service / consumer / job | command rejects;consumer / job writes unresolved / failed marker if allowed | no business outbox;marker write allowed |
| domain invalid transition | domain object | rollback, `DomainRejected` | no trace / outbox |
| dependency graph cycle | domain policy | rollback, `DomainRejected` | no trace / outbox |
| completion evidence unverified / rejected | domain / resolver | rollback, `ExternalReferenceUnresolved` or `DomainRejected` | no trace / outbox |
| version conflict | repository save | rollback, `VersionConflict`;event may retry | no trace / outbox |
| store unavailable before commit | repository / UoW | rollback, `TemporarilyUnavailable` | no accepted outbox |
| commit status unknown | UoW commit | return `TemporarilyUnavailable`;require reconciliation | no external publish from handler |
| publisher failure after committed truth | publisher | mark outbox `Failed`;job failed item | outbox failed marker only |
| projection build / replace failure | rebuild job | mark view `Failed` where possible;job failed item | optional derived event only if marker committed |
| reference refresh failure | refresh job / consumer | mark reference failed or retry | reference marker only |
| unsupported inbound event version | worker handler `EventSchemaVersion` parse / topic major check | dead-letter | no business write |
| handoff port failure | job service | failed report / marker by job policy | no business truth event |

#### 8.8 恢复口径表

| 错误 / 状态 | 是否可自动重试 | 自动重试条件 | 人工介入条件 |
|---|---|---|---|
| `InvalidRequest` | 否 | 不适用 | caller must fix request |
| `NotVisible` | 否 | 不适用 | permission / actor config review |
| `NotFound` | 否 | only after caller obtains valid ref | missing expected truth indicates data issue |
| `DomainRejected` | 否 | after business state changes or request target changes | repeated reject with valid input indicates design gap |
| `VersionConflict` | 是 | reload latest version and retry same business intent | repeated conflict under high contention -> Step 13 policy review |
| `IdempotencyConflict` | 否 | use different key only for different request | repeated same key conflicts |
| `ExternalReferenceUnresolved` | 有条件 | upstream ref becomes resolvable / refresh succeeds | source deleted, unsupported type, contract drift |
| `TemporarilyUnavailable` | 是 | same idempotency key, bounded retry | retry budget exhausted |
| `CommitStatusUnknown` | 否,先查幂等 / reconciliation | only after result state verified | any unknown commit marker |
| `DeadLetter` | 否 | after adapter / contract upgrade replay from DLQ | unsupported version / malformed payload |
| `OutboxPublicationState::Failed` | 是 | retry policy allows `mark_pending_for_retry` | repeated publisher failure |
| `DerivedFreshnessState::Failed` | 是 | rebuild input fixed and job rerun | repeated build failure / truth snapshot corrupt |
| `ReferenceResolutionStatus::Failed` | 是 | resolver / upstream recovered | unsupported external contract |

#### 8.9 审计、日志和事件规则

| 情况 | WorkTraceRecord | WorkOutboxRecord | Runtime log / metric | Marker / report |
|---|---|---|---|---|
| accepted business truth change | 必须写 | 必须 enqueue | 建议记录 | result ref |
| invalid request | 不写 | 不写 | 记录 reject count | no marker |
| domain rejected | 不写 | 不写 | 记录 reject reason category | idempotency conflict marker only if applicable |
| version conflict | 不写 | 不写 | 记录 conflict count | no marker |
| external resolver failed in command | 不写 business trace | 不写 | 记录 resolver failure | no marker unless command explicitly writes reference state |
| inbound reference failed | 不写 business truth trace | 不写 business outbox | 记录 consumer failure | `ReferenceResolutionState::Failed` |
| projection rebuild failed | 不写 business truth trace | optional derived event only after marker | 记录 rebuild failure | `DerivedFreshnessState::Failed` + job report |
| outbox publish failed | 不写 new business trace | 不新增 business outbox | 记录 publish failure | `OutboxPublicationState::Failed` |
| handoff failed | 不写 business truth trace | 不新增 business outbox unless marker contract commits | 记录 handoff failure | job report / marker |

Step 15 will define concrete log fields, metric names and trace spans. This Step only fixes whether an error may create Work audit / outbox / marker side effects.

### 9. 回填草稿

> 校准来源:
> - `design-calibration/03_ddd_step_12_error_recovery.md`
>
> 延伸阅读:
> - 建议继续阅读本中间产物的“错误类型表”“内部错误映射表”“异常分支处理表”和“恢复口径表”小节。

#### 5.11 错误模型、异常分支与恢复口径

L1-work 错误模型采用分层错误边界。Domain 层只返回 `DomainError`;repository / port / UoW / idempotency 层分别返回 `RepositoryError`、`PortError`、`UnitOfWorkError`、`IdempotencyError`;application service 将这些错误映射为 `ApplicationError`;handler / runner 最终映射为 `WorkProtocolError`、query surface、consumer disposition 或 job report。

同步 Command 的失败不得写 accepted truth、trace 或 outbox。Query 失败不得触发修复写入。Inbound Event 的 malformed / unsupported 输入进入 dead-letter,临时 store / resolver failure 进入 retry。Operations Job 区分 job-level reject 和 item-level failure;item-level failure 必须进入 report 或 failed marker。

错误恢复遵守以下规则:

| 错误类别 | 恢复方式 |
|---|---|
| request / metadata / visibility / domain policy 错误 | 调用方修正输入或权限,不可自动原样重试 |
| version conflict | reload latest version,用同一业务意图重试 |
| idempotency duplicate | Command 通过 `CommandResultRepository.get_result` 返回 stored result;Job 通过 `JobResultRepository.get_report` 返回 stored report;不得重放 domain transition / job side effect |
| idempotency conflict | reject,调用方更换 key |
| external reference unresolved | 等待 upstream / resolver 恢复或写 failed / unresolved marker |
| store / publisher / handoff temporary unavailable | bounded retry;保留 failed marker / report |
| commit status unknown | 不盲重试;先查 idempotency result / reconciliation |

accepted truth change 必须写 Work trace 和 outbox;failed publish、failed projection rebuild 和 failed reference refresh 只写各自 marker,不得回滚或改写业务 truth。

### 10. 待确认事项

| 编号 | 待确认项 | 当前口径 | 影响 |
|---|---|---|---|
| DDD12-OPEN-001 | `DomainError` / `ApplicationError` 的最终 Rust enum 是否在 Step 19 正式文档中给完整 code block | 本 Step 给 category 和 variant 表 | Step 19 组装时需要转成正式 code block |
| DDD12-OPEN-002 | `CommitStatusUnknown` 的 reconciliation procedure | Step 13 已定义 retry 前 `IdempotencyRepository.get(...)` 审计和 reserved unknown 处理;自动修复留给后续 | Step 16 需补测试切口 |
| DDD12-OPEN-003 | event dead-letter storage / DLQ adapter 具体形态 | 本 Step 只定义 disposition,不锁 bus 产品 | Step 14 / Step 15 |
| DDD12-OPEN-004 | job report DTO 是否需要区分 retryable_failed_refs / terminal_failed_refs | 当前只要求 failed_refs 不隐藏 | Step 16 测试切口或 Step 19 formal DTO |

### 11. 进入下一步条件

- [x] 错误类型表覆盖 domain、application、repository、port、UoW、idempotency 和 protocol。
- [x] 内部错误到 Command / Query / Event / Job 的映射已收敛。
- [x] 异常分支处理表明确是否写 audit / outbox / marker。
- [x] 恢复口径区分可重试、不可重试和人工介入。
- [x] commit unknown、dead-letter、failed marker 和 query degraded surface 已进入错误模型。
