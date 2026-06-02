# Step 15. 定义可观测性与审计埋点契约

> 本文件是 `projects/L1-conversation/03-详细设计.md` 的 Step 15 中间产物。
> 本步只收稳代码中必须记录的日志、指标、trace 和审计事件切口。
> 本步不写告警阈值、dashboard、日志保留周期或运维 runbook。
> 正式 `03-详细设计.md` 仍在 Step 19 统一回填,本文件不替代正式详细设计。

## 1. Step 状态

- 状态: `[x] 已完成`
- 对应 SOP: `standards/document/详细设计讨论流程_SOP.md` Step 15
- 回填章节: `projects/L1-conversation/03-详细设计.md` §14 可观测性与审计埋点契约

---

## 2. 本步输入

| 输入 | 内容 | 本步使用方式 |
|---|---|---|
| `projects/L1-conversation/01-架构设计.md` | Conversation 是 truth center,trace / archive / observability 是外部消费或交接边界 | 确认可观测材料只输出引用和证据,不实现长期观测产品 |
| `projects/L1-conversation/02-概要设计.md` §10 / §11 | outbox / handoff 失败不回滚 truth;forbidden body 不得进入 fact、snapshot、trace、outbox 或 handoff payload | 固定日志、审计和 evidence 的安全红线 |
| `03_ddd_step_08_protocol_contracts.md` | Command / Query / Inbound Event / Outbound Event / Job 的协议、错误和幂等审计矩阵 | 固定入口名称、审计类别和字段来源 |
| `03_ddd_step_09_function_flows.md` | 45 个处理流的事务边界、状态副作用、outbox / projection / handoff / job evidence | 固定埋点位置 |
| `03_ddd_step_12_error_recovery.md` | command rejection、idempotency conflict、invalid transition、quarantine、resolver、outbox、handoff、projection、cursor 等异常 | 固定日志级别和审计 / evidence 触发条件 |
| `03_ddd_step_13_concurrency_idempotency.md` | command / consumer / job 幂等、重入和并发控制 | 固定 duplicate、conflict、rerun 的观测切口 |
| `03_ddd_step_14_config_dependencies.md` | publisher、resolver、handoff、reports output、redaction policy 和 fake adapter 边界 | 固定外部依赖失败和脱敏策略的观测切口 |

已确认约束:

```text
日志用于排错,指标用于统计,审计 / evidence 用于证明 conversation-local truth、派生状态和交接状态发生了什么。
trace schema 由 core-contracts 承接,本仓只贯穿 TraceContextRef / request id / operation。
本步不新增独立 AuditRepository 契约;审计材料先落到既有 receipt、trace、outbox、handoff、projection、job evidence 和 safe diagnostic ref。
如果后续要引入独立 audit store,必须回到 Step 7 / Step 11 补 trait 和持久化契约。
```

## 3. SOP 问题回答

### 3.1 哪些处理流必须记录审计？

| 处理流 | 审计 / evidence 要求 | 说明 |
|---|---|---|
| 10 个 Command API | 必须 | 改变 space、scope、fact、manifestation、trace、review anchor、handoff intent 或 outbox |
| 6 个 Inbound Event Consumer | 必须 | 来源事件可能写 projection、safe snapshot、manifestation、fact 或 quarantine marker |
| 9 个 Outbound Event Publish Flow | 必须记录 publish evidence | 发布已提交 truth / projection state;失败可重试或人工处理 |
| 9 个 Operations Job | 必须 | 维护 projection、cursor、snapshot、outbox、handoff、consistency report 或 cleanup evidence |
| Query API | 普通查询记录日志 / 指标;敏感查询或拒绝分支写 read audit | `GetConversationTraceContext`、`GetReviewAnchor`、`GetConversationProjectionState`、`GetExternalReferenceProjection` 等需要可追溯 |
| Idempotency / boundary violation | 必须 | duplicate、conflict、forbidden body、source truth violation 直接影响实现安全性 |

### 3.2 哪些错误分支必须记录日志？

| 错误分支 | 日志级别 | 记录目的 |
|---|---|---|
| schema / metadata / required field 校验失败 | `warn` | 定位调用方输入问题 |
| visibility denied / not authorized | `warn` | 排查访问边界,不得泄露可见性细节 |
| idempotency replay | `info` | 说明重复请求复用既有结果 |
| idempotency conflict / version conflict | `warn` | 定位同 key 不同内容或并发覆盖 |
| invalid state transition / boundary violation | `warn` / `error` | 状态机或 forbidden body 越界必须可追踪 |
| resolver unresolved / digest mismatch | `warn` | 解释 manifestation / reference projection 降级 |
| repository / UnitOfWork / transaction failure | `error` | 排查本仓写入或提交失败 |
| outbound publish failure | `warn` / `error` | transient 记 `warn`,schema / boundary rejected 记 `error` |
| trace / archive handoff failure | `warn` / `error` | transient 记 retry,permanent 记 failed evidence |
| projection rebuild / cursor cleanup failure | `warn` / `error` | 解释 read model stale、failed 或 cursor invalidated |
| config validation 违反 redaction / forbidden body 边界 | `error` | 防止配置绕过安全红线 |

### 3.3 哪些关键路径需要指标？

| 关键路径 | 指标目的 |
|---|---|
| Command API | 统计 accepted、rejected、duplicate、conflict 和耗时 |
| Query API | 统计 authorized、denied、stale、not found、cursor invalid 和耗时 |
| Inbound Event Consumer | 统计 accepted、quarantined、duplicate、unresolved 和处理耗时 |
| Outbox Publish | 统计 pending、published、retry pending、failed、suppressed 和发布耗时 |
| Resolver / snapshot refresh | 统计 resolved、unresolved、digest mismatch、timeout |
| Projection / cursor maintenance | 统计 fresh、stale、rebuilding、failed、expired cursor cleanup |
| Trace / archive handoff | 统计 handed off、archived、retry、failed 和交付耗时 |
| Operations Job | 统计 job success、partial failure、failed、rerun 和 report output |
| Repository / UnitOfWork | 统计 transaction duration、commit failure、rollback failure、version conflict |
| Boundary / redaction | 统计 forbidden body、secret、unredacted payload 被拒绝的次数 |

### 3.4 日志、指标、审计字段分别记录什么？

| 类型 | 必须字段 | 禁止字段 |
|---|---|---|
| 日志 | `trace_ref`、`request_id`、`operation`、`actor_ref`、`space_id` / `subject_ref`、`status`、`error_code`、`evidence_ref`、`duration_ms` | fact payload body、runtime reasoning body、tool call body、bridge message body、artifact body、secret、token、外部返回全文 |
| 指标 | `operation`、`result`、`error_category`、`source_kind`、`projection_kind`、`job_kind`、`handoff_kind` | record id、payload digest 全量、actor profile、自由文本、secret ref 明文 |
| 审计 / evidence | `audit_ref` / `evidence_ref`、`trace_ref`、`actor_ref`、`subject_ref`、`source_ref`、`from_state`、`to_state`、`result_ref`、`occurred_at`、`reason_code` | 原始正文、凭据、外部 source body、归档包正文、未脱敏 trace / archive payload |
| Trace | core trace 引用、span / operation 名称、correlation ref | 不在 span attribute 写业务正文、secret 或外部全文 |
| Diagnostic | safe summary、稳定错误码、supporting refs | debug dump、请求 / 响应全文、私有 profile、策略内部细节 |

### 3.5 哪些监控和告警细节应留给运维手册？

| 留给运维手册的内容 | 本步只定义什么 |
|---|---|
| 告警阈值、SLO、dashboard | 指标名、类型、打点位置和标签 |
| 日志采集系统、索引策略、保留周期 | 日志字段和禁止字段 |
| 值班 runbook、人工恢复流程 | 哪些失败要产生 retry / failed / diagnostic evidence |
| resolver / publisher / handoff 生产健康阈值 | 外部依赖失败指标和日志切口 |
| 长期 trace / archive / observability 产品能力 | Conversation 只输出交接材料和证据引用 |

## 4. 当前文档问题诊断

| 问题 | 影响 | 本步处理 |
|---|---|---|
| Step 8 / Step 9 已分散出现 command audit、consumer audit、publish evidence、job evidence | 实现者可能只实现返回值,漏掉可追溯材料 | 本步汇总为统一日志、指标、审计表 |
| Step 12 已列哪些异常需要 audit / evidence,但未固定代码位置 | 错误处理可能只写日志或只返回 error | 本步把异常绑定到 handler、service、repository、publisher、handoff、job |
| Conversation 有 trace / review / handoff 对象,但不拥有全局 observability truth | 容易误建全局观测存储或长期报表 | 本步明确只输出 trace / evidence / handoff 引用 |
| forbidden body 边界横跨日志、审计、event、projection 和 handoff | 实现者可能在 debug log 或 diagnostic 中泄露正文 | 本步单列允许 / 禁止字段 |
| 指标若带 record id、digest 或 actor profile 会高基数或泄露 | 观测系统不可用且违反安全边界 | 本步限定指标只使用低基数标签 |
| 旧版详细设计仍是 Conversation / Turn / StreamEvents 旧口径 | 可观测切口会落在旧对象上 | 本步全部按新版 fact、scope、manifestation、trace、projection、outbox 和 handoff 主线收敛 |

## 5. 改动前后对比

| 维度 | 改动前 | 改动后 |
|---|---|---|
| 日志 | 只知道异常需要记录 | 明确日志位置、级别、字段和目的 |
| 指标 | 只有“可观察”目标 | 明确 counter / gauge / histogram、打点位置和低基数标签 |
| 审计 / evidence | 分散在协议、处理流和错误恢复中 | 汇总为审计事件表,固定触发位置和消费方 |
| Trace | 只隐含依赖 core trace | 明确 trace ref 贯穿 command、query、consumer、publisher、job 和 handoff |
| 安全边界 | forbidden body 在概要和错误章节分散出现 | 统一约束日志、指标、审计、trace、diagnostic 的禁止字段 |
| 运维边界 | 容易写成告警方案 | 本步只写代码埋点契约,阈值和 runbook 后移 |

## 6. 设计取舍

| 决策点 | 方案 A | 方案 B | 推荐 | 原因 |
|---|---|---|---|---|
| 是否新增独立 `AuditRepository` | 在 Step 15 直接新增 | 先使用既有 receipt、trace、outbox、handoff、projection、job evidence;若需要独立 store 回 Step 7 / 11 | B | 避免在观测 Step 静默新增持久化契约 |
| 是否所有 Query 都写审计 | 所有 Query 写 read audit | 普通 Query 只打日志 / 指标;敏感查询和拒绝分支写 read audit | B | 降低噪声,同时保留 trace / review / projection 敏感读取追溯 |
| 审计是否保存完整正文 | 保存完整上下文 | 只保存 ref、状态、reason 和 evidence ref | B | 符合 forbidden body 和隐私边界 |
| 指标标签是否包含资源 id | 包含 `space_id` / `fact_id` | 只使用低基数标签,单记录定位走 trace / audit ref | B | 避免高基数和敏感信息泄露 |
| publish / handoff 失败日志级别 | 全部 `error` | transient 为 `warn`,permanent / boundary rejected 为 `error` | B | 区分自动可恢复和人工介入 |
| 是否在本步定义告警阈值 | 定义 | 不定义,留给运维手册 | B | Step 15 是实现埋点契约,不是运维方案 |

## 7. 结构化中间产物

### 7.1 可观测性与审计边界图

#### 边界图: Conversation 观测材料输出边界

```text
[API / Consumer / Job / Publisher]
  | call with TraceContextRef / RequestId / Operation
  v
[Application Service]
  | append / tx / publish / handoff / rebuild
  +--> [Structured Logs] : log
  +--> [Metrics Collector] : metric
  +--> [Receipt / Trace / Evidence Refs] : audit
  +--> [Diagnostic Ref] : safe diagnostic
  v
[Repository / Adapter / Port]
  | tx / external-call / retry
  v
[Conversation Truth / Projection / Outbox / Handoff State]
```

关键说明:

- 图表达日志、指标、审计和 diagnostic 从同一处理流分层输出。
- 图不表达告警阈值、dashboard、日志采集系统或运维处置流程。
- `Receipt / Trace / Evidence Refs` 不是新的全局 audit store;若实现需要独立存储,必须回 Step 7 / Step 11 补契约。
- 任何输出材料都不得保存 forbidden body 或 secret。

### 7.2 日志埋点表

| 位置 | 日志级别 | 字段 | 目的 |
|---|---|---|---|
| Command handler 入口 / 结束 | `info` | `trace_ref`、`request_id`、`operation`、`actor_ref`、`status`、`duration_ms` | 追踪写请求生命周期 |
| Command validation failed | `warn` | `trace_ref`、`request_id`、`operation`、`error_code`、`diagnostic_ref` | 定位缺字段、metadata 或 idempotency key |
| Command idempotency replay | `info` | `trace_ref`、`operation`、`idempotency_scope`、`result_ref` | 说明 duplicate 返回既有结果 |
| Command idempotency conflict / version conflict | `warn` | `trace_ref`、`operation`、`subject_ref`、`error_code`、`diagnostic_ref` | 排查同 key 不同请求或并发覆盖 |
| `AppendConversationFactFlow` forbidden payload | `error` | `trace_ref`、`space_ref`、`source_ref`、`error_code`、`diagnostic_ref` | 阻止正文进入 fact、trace 或 outbox |
| `ManifestExternalFactFlow` resolver unresolved / digest mismatch | `warn` | `trace_ref`、`external_fact_ref`、`source_kind`、`error_code`、`evidence_ref` | 解释 unresolved manifestation / degraded view |
| `CreateReviewAnchorFlow` visibility denied | `warn` | `trace_ref`、`review_target_ref`、`actor_ref`、`error_code` | 排查复盘读取边界 |
| `RequestTraceHandoffFlow` / `RequestArchiveHandoffFlow` rejected | `warn` | `trace_ref`、`handoff_kind`、`trace_context_ref`、`error_code`、`diagnostic_ref` | 解释交接意图未成立 |
| Query authorized read result | `debug` / `info` | `trace_ref`、`request_id`、`query`、`result`、`consistency_marker` | 追踪读面命中、stale 或 degraded |
| Query visibility denied / cursor invalid | `warn` | `trace_ref`、`query`、`consumer_ref`、`error_code`、`cursor_ref` | 排查访问拒绝和不可续读 cursor |
| Inbound consumer accepted | `info` | `trace_ref`、`event_id`、`source_ref`、`event_kind`、`result_ref` | 追踪来源事件消费成功 |
| Inbound consumer duplicate | `info` | `trace_ref`、`event_id`、`source_ref`、`idempotency_scope` | 说明 broker replay 被跳过 |
| Inbound consumer quarantine | `warn` | `trace_ref`、`event_id`、`source_ref`、`error_code`、`quarantine_ref` | 记录非法来源事件,不写 truth |
| Outbox publish success | `info` | `trace_ref`、`outbox_record_id`、`event_kind`、`published_event_ref` | 追踪事件发布成功 |
| Outbox publish retry / failed | `warn` / `error` | `trace_ref`、`outbox_record_id`、`event_kind`、`error_code`、`evidence_ref` | 保留 publish 恢复线索 |
| Projection rebuild / cursor maintenance item | `info` | `trace_ref`、`job_run_id`、`projection_kind`、`status`、`duration_ms` | 追踪派生状态维护 |
| Projection failed / source gap | `warn` / `error` | `trace_ref`、`projection_kind`、`source_position`、`error_code`、`projection_error_ref` | 解释 read model 降级 |
| Trace / archive handoff delivered | `info` | `trace_ref`、`job_run_id`、`handoff_kind`、`handoff_ref`、`external_receipt_ref` | 追踪交接成功 |
| Trace / archive handoff retry / failed | `warn` / `error` | `trace_ref`、`job_run_id`、`handoff_kind`、`handoff_ref`、`error_code`、`evidence_ref` | 追踪交接恢复状态 |
| Repository / UnitOfWork failure | `error` | `trace_ref`、`operation`、`repository`、`error_code`、`retryable`、`diagnostic_ref` | 排查存储、提交或回滚失败 |
| Operations job summary | `info` | `trace_ref`、`job_run_id`、`job_kind`、`result`、`item_count`、`duration_ms`、`report_ref` | 记录批处理结果和报告引用 |
| Config validation boundary rejected | `error` | `operation`、`config_source_ref`、`error_code`、`diagnostic_ref` | 防止配置关闭脱敏或绕过 forbidden body |

### 7.3 指标埋点表

| 指标 | 类型 | 打点位置 | 标签 |
|---|---|---|---|
| `conversation_command_total` | counter | Command 完成时 | `operation`, `result`, `error_category` |
| `conversation_command_latency_ms` | histogram | Command 完成时 | `operation`, `result` |
| `conversation_query_total` | counter | Query 完成时 | `query`, `result`, `consistency_state` |
| `conversation_query_latency_ms` | histogram | Query 完成时 | `query`, `result` |
| `conversation_idempotency_total` | counter | 幂等 reserve / complete / conflict 后 | `operation`, `result=reserved/replayed/conflict/completed` |
| `conversation_inbound_event_total` | counter | consumer 完成时 | `event_kind`, `source_kind`, `result=accepted/duplicate/quarantined/unresolved` |
| `conversation_boundary_violation_total` | counter | forbidden body / source truth violation 被拒绝时 | `operation`, `violation_kind` |
| `conversation_resolver_total` | counter | resolver / snapshot refresh 返回后 | `source_kind`, `result=resolved/unresolved/digest_mismatch/timeout` |
| `conversation_outbox_pending_total` | gauge | outbox publish job poll 后 | `event_kind`, `publication_state` |
| `conversation_outbox_publish_total` | counter | outbox publish item 完成时 | `event_kind`, `result=published/retry/failed/suppressed` |
| `conversation_outbox_publish_latency_ms` | histogram | publisher port 返回后 | `event_kind`, `result` |
| `conversation_projection_state_total` | gauge | projection state 保存后 | `projection_kind`, `freshness_state` |
| `conversation_projection_rebuild_total` | counter | rebuild job item 完成时 | `projection_kind`, `result` |
| `conversation_projection_rebuild_latency_ms` | histogram | rebuild job item 完成时 | `projection_kind`, `result` |
| `conversation_cursor_cleanup_total` | counter | cleanup job item 完成时 | `result=deleted/skipped/failed` |
| `conversation_handoff_total` | counter | trace / archive handoff item 完成时 | `handoff_kind`, `result=delivered/retry/failed/cancelled` |
| `conversation_handoff_latency_ms` | histogram | handoff adapter 返回后 | `handoff_kind`, `result` |
| `conversation_job_total` | counter | Operations job 完成时 | `job_kind`, `result=success/partial_failure/failed/rerun` |
| `conversation_job_latency_ms` | histogram | Operations job 完成时 | `job_kind`, `result` |
| `conversation_repository_error_total` | counter | repository / UnitOfWork error 返回时 | `repository`, `error_category` |
| `conversation_consistency_issue_total` | counter | consistency validation 产出 issue 时 | `issue_kind`, `severity` |

### 7.4 审计事件表

| 审计事件 | 触发位置 | 记录字段 | 消费方 |
|---|---|---|---|
| `ConversationSpaceCreatedAudit` | `CreateConversationSpaceFlow` 提交后 | `audit_ref`、`trace_ref`、`actor_ref`、`space_ref`、`scope_change_ref`、`outbox_record_ref` | trace / review / reports |
| `ConversationSpaceClosedAudit` | `CloseConversationSpaceFlow` 提交后 | `audit_ref`、`trace_ref`、`actor_ref`、`space_ref`、`from_state`、`to_state`、`reason_ref` | trace / review / reports |
| `ParticipantScopeUpdatedAudit` | `UpdateParticipantScopeFlow` 提交后 | `audit_ref`、`trace_ref`、`actor_ref`、`space_ref`、`scope_change_ref`、`from_version`、`to_version` | trace / authorized query |
| `VisibilityScopeUpdatedAudit` | `UpdateVisibilityScopeFlow` 提交后 | `audit_ref`、`trace_ref`、`actor_ref`、`space_ref`、`scope_change_ref`、`projection_state_ref` | trace / projection jobs |
| `ConversationFactAppendedAudit` | `AppendConversationFactFlow` 提交后 | `audit_ref`、`trace_ref`、`actor_ref`、`space_ref`、`fact_ref`、`append_receipt_ref`、`source_ref` | trace / read model / downstream |
| `ConversationFactRetractedAudit` | `RetractConversationFactFlow` 提交后 | `audit_ref`、`trace_ref`、`actor_ref`、`fact_ref`、`append_receipt_ref`、`from_state`、`to_state` | trace / read model / downstream |
| `CrossDomainManifestationRecordedAudit` | `ManifestExternalFactFlow` 或来源 consumer 提交后 | `audit_ref`、`trace_ref`、`actor_ref`、`manifestation_ref`、`external_fact_ref`、`snapshot_ref`、`resolution_state` | trace / reports / authorized query |
| `ReviewAnchorCreatedAudit` | `CreateReviewAnchorFlow` 提交后 | `audit_ref`、`trace_ref`、`actor_ref`、`review_anchor_ref`、`target_ref`、`reason_ref` | trace / review / reports |
| `TraceHandoffRequestedAudit` | `RequestTraceHandoffFlow` 提交后 | `audit_ref`、`trace_ref`、`actor_ref`、`trace_handoff_ref`、`trace_context_ref`、`destination_ref` | observability / reports |
| `ArchiveHandoffRequestedAudit` | `RequestArchiveHandoffFlow` 提交后 | `audit_ref`、`trace_ref`、`actor_ref`、`archive_handoff_ref`、`trace_context_ref`、`archive_scope` | archive / reports |
| `InboundSourceEventAcceptedAudit` | consumer 成功提交后 | `audit_ref`、`trace_ref`、`event_id`、`source_ref`、`event_kind`、`result_ref` | operations / reports |
| `InboundSourceEventQuarantinedAudit` | consumer 写 quarantine marker 后 | `audit_ref`、`trace_ref`、`event_id`、`source_ref`、`event_kind`、`quarantine_ref`、`reason_code` | operations / security review |
| `IdempotencyConflictAudit` | `IdempotencyRepository.mark_conflict(...)` 后 | `audit_ref`、`trace_ref`、`operation`、`idempotency_scope`、`subject_ref`、`reason_code` | operations / support |
| `BoundaryViolationAudit` | forbidden body / source truth violation 被拒绝后 | `audit_ref`、`trace_ref`、`operation`、`subject_ref`、`violation_kind`、`diagnostic_ref` | security review / operations |
| `ConversationOutboxPublishedAudit` | outbox job 标记 published 后 | `audit_ref`、`trace_ref`、`outbox_record_ref`、`event_kind`、`published_event_ref`、`published_at` | operations / downstream reports |
| `ConversationOutboxFailedAudit` | outbox job 标记 failed 后 | `audit_ref`、`trace_ref`、`outbox_record_ref`、`event_kind`、`reason_code`、`evidence_ref` | operations |
| `ProjectionFreshnessChangedAudit` | projection state 保存后 | `audit_ref`、`trace_ref`、`projection_kind`、`from_state`、`to_state`、`source_position`、`projection_error_ref` | query / operations |
| `ReferenceResolutionChangedAudit` | snapshot refresh / manifestation 更新 resolution 后 | `audit_ref`、`trace_ref`、`external_fact_ref`、`source_kind`、`from_state`、`to_state`、`snapshot_ref` | query / reports |
| `TraceHandoffDeliveredAudit` | `DeliverTraceHandoffFlow` 标记 handed off 后 | `audit_ref`、`trace_ref`、`trace_handoff_ref`、`external_receipt_ref`、`delivered_at` | observability / reports |
| `TraceHandoffFailedAudit` | `DeliverTraceHandoffFlow` 标记 failed 后 | `audit_ref`、`trace_ref`、`trace_handoff_ref`、`reason_code`、`evidence_ref` | operations |
| `ArchiveHandoffDeliveredAudit` | `DeliverArchiveHandoffFlow` 标记 archived 后 | `audit_ref`、`trace_ref`、`archive_handoff_ref`、`archive_package_ref`、`archived_at` | archive / reports |
| `ArchiveHandoffFailedAudit` | `DeliverArchiveHandoffFlow` 标记 failed 后 | `audit_ref`、`trace_ref`、`archive_handoff_ref`、`reason_code`、`evidence_ref` | operations |
| `ConsistencyValidationReportedAudit` | `ValidateConversationConsistencyFlow` 写 report ref 后 | `audit_ref`、`trace_ref`、`job_run_id`、`report_ref`、`issue_count`、`checked_scope_ref` | reports / operations |
| `CursorMaintenanceChangedAudit` | cursor maintenance / cleanup 保存状态后 | `audit_ref`、`trace_ref`、`job_run_id`、`cursor_ref`、`from_state`、`to_state`、`cleanup_evidence_ref` | query / operations |

### 7.5 观测字段边界表

| 材料类型 | 允许字段 | 禁止字段 |
|---|---|---|
| 日志 | stable refs、operation、state、error code、duration、safe diagnostic ref | fact payload body、runtime reasoning body、tool call body、bridge message body、artifact body、secret、token |
| 指标 | low-cardinality kind / status / result / category | record id、payload digest 全量、actor profile、free text、secret ref |
| 审计 / evidence | subject ref、actor ref、trace ref、source ref、state from / to、result ref、reason code | 外部 source body、归档包正文、未脱敏 trace payload、credential |
| Diagnostic | safe summary、supporting refs、stable error code | debug dump、HTTP body、private profile、authorization rule internals |
| Trace attributes | `trace_ref`、span name、operation、correlation ref | raw request / response body、secret、source body |

## 8. 回填草稿

> 本节不重复粘贴 §7 的完整表。正式 `03-详细设计.md` 生成 §14 时,应从本文件 §7 摘录。

正式文档 §14 建议采用以下结构:

```text
14. 可观测性与审计埋点契约
  14.1 设计依据与边界
  14.2 可观测性与审计边界图
  14.3 日志埋点表
  14.4 指标埋点表
  14.5 审计事件表
  14.6 观测字段边界表
  14.7 运维后移内容
```

必须引用:

| 正式章节 | 引用来源 |
|---|---|
| §14.1 | `design-calibration/03_ddd_step_15_observability_audit.md` §2 / §4 / §6 |
| §14.2 | `design-calibration/03_ddd_step_15_observability_audit.md` §7.1 |
| §14.3 | `design-calibration/03_ddd_step_15_observability_audit.md` §7.2 |
| §14.4 | `design-calibration/03_ddd_step_15_observability_audit.md` §7.3 |
| §14.5 | `design-calibration/03_ddd_step_15_observability_audit.md` §7.4 |
| §14.6 | `design-calibration/03_ddd_step_15_observability_audit.md` §7.5 |
| §14.7 | `design-calibration/03_ddd_step_15_observability_audit.md` §3.5 |

回填要求:

- 正式 §14 开头必须列出本文件作为校准来源,并提示读者继续阅读本文件 §7 和 §9。
- 不得在正式 §14 新增未在本文件出现的审计事件、指标或字段。
- 若实现侧需要独立 `AuditRepository`,不得直接在 §14 新增,必须回 Step 7 / Step 11 重新补 trait 和持久化契约。
- `audit_ref`、`evidence_ref`、`diagnostic_ref` 只能指向安全材料,不得包装 forbidden body。

## 9. 待确认事项

无。

本步未引入新的状态名、协议字段、repository trait 或跨仓依赖;审计事件表只定义实现埋点切口和安全字段边界。

## 10. 本步完成检查

| 检查项 | 结果 | 说明 |
|---|---|---|
| SOP 应问问题已回答 | 通过 | §3 覆盖审计处理流、错误日志、关键指标、字段和运维后移 |
| 日志埋点表格式符合规范 | 通过 | §7.2 使用 `位置 / 日志级别 / 字段 / 目的` |
| 指标埋点表格式符合规范 | 通过 | §7.3 使用 `指标 / 类型 / 打点位置 / 标签` |
| 审计事件表格式符合规范 | 通过 | §7.4 使用 `审计事件 / 触发位置 / 记录字段 / 消费方` |
| 安全 / 隐私边界已约束 | 通过 | §3.4 和 §7.5 明确 forbidden body、secret、外部正文禁止进入观测材料 |
| 没有写告警阈值或运维 runbook | 通过 | §3.5 只定义后移内容 |
| 可进入 Step 16 测试切口与最小验证清单 | 通过 | 下一步可基于本步日志、指标、审计和 forbidden field 约束定义测试切口 |
