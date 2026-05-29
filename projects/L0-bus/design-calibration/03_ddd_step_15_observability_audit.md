# Step 15. 定义可观测性与审计埋点契约

## 1. Step 状态

- 状态：[x] 已确认
- 所属文档：`projects/L0-bus/03-详细设计.md`
- 本步目标：定义 L0-bus 在代码中需要记录的日志、指标、trace 关联和审计事件切口，确保实现者知道在什么位置记录哪些观测材料。
- 本步不直接修改正式 `03-详细设计.md`，只形成中间产物。

---

## 2. 本步输入

| 输入 | 关键结论 | 本步使用方式 |
|---|---|---|
| `standards/document/详细设计讨论流程_SOP.md` Step 15 | 必须输出日志埋点表、指标埋点表、审计事件表 | 约束本文件结构 |
| `standards/document/详细设计书写规范.md` §5.14 | 只写实现切口，不写运维告警阈值；审计字段不得越过安全边界 | 约束正式文档回填 |
| `projects/L0-bus/01-架构设计.md` §13 | bus 输出传递、失败、重试、死信、后端状态和只读派生材料，不承载长期报表产品 | 决定本步边界 |
| `projects/L0-bus/02-概要设计.md` §5 / §6 / §10 | 已确认 bus audit、delivery history、projection 和 forbidden body 边界 | 决定审计字段红线 |
| `projects/L0-bus/design-calibration/03_ddd_step_08_protocol_contracts.md` | 已定义 Command / Query / Event / Job 的入口、错误、幂等和审计要求 | 决定入口埋点 |
| `projects/L0-bus/design-calibration/03_ddd_step_09_function_flows.md` | 已定义每个处理流的 audit / event / projection / publisher 副作用 | 决定处理流埋点位置 |
| `projects/L0-bus/design-calibration/03_ddd_step_12_error_recovery.md` | 已定义异常分支的日志、evidence、audit 和 event 规则 | 决定错误埋点 |
| `projects/L0-bus/design-calibration/03_ddd_step_14_config_dependencies.md` | 已定义 observability / governance / SDK 通过 event、query、projection、audit material 协作，不阻塞 P0 | 决定外部消费边界 |

---

## 3. SOP 问题回答

### 3.1 哪些处理流必须记录审计？

| 处理流 | 是否必须审计 | 审计原因 |
|---|---|---|
| `AcceptPublicationFlow` | 是 | accepted / rejected publication 是 bus truth 起点 |
| `ConsumeCommittedOutboxFactFlow` | 是 | 上游 committed fact 被接入、拒绝或重复消费必须可追溯 |
| `RunDeliveryProgressionFlow` | 是 | delivery attempt、dispatch、failed candidate 影响 delivery 主生命周期 |
| `RecordDeliveryFeedbackFlow` | 是 | ack / fail / duplicate feedback 影响 delivery 结果和恢复候选 |
| `ConsumeBackendDeliverySignalFlow` | 是 | 后端 signal 归一化后影响 delivery / feedback；unknown signal 也要可追踪 |
| `ConsumeTimeoutSignalFlow` | 是 | timeout 是 bus 级反馈，可能推动 delivery failed |
| `RequestRetryFlow` | 是 | retry plan 创建、拒绝、冲突均属于恢复链事实 |
| `RunRetryCycleFlow` | 是 | retry attempt、exhausted、skipped 影响恢复状态 |
| `MoveDeliveryToDeadLetterFlow` | 是 | DLQ 与 failure material 是 replay 和治理消费前置 |
| `PrepareReplayFlow` | 是 | replay preparation 必须可追溯到 DLQ、approval ref 和 audit chain |
| `RunReadOutputProjectionFlow` | 是，至少记录 projection evidence | projection 只读输出的 stale / source missing / rebuild marker 需要可解释 |
| `RebuildReadProjectionFlow` | 是 | rebuild 会替换 projection batch，必须可追溯 |
| `CheckBackendCapabilityFlow` | 是 | backend capability change 不能静默改变上层语义 |
| `OutboundEventPublishFlow` | 是，记录 publish evidence | publisher success / retryable failure / rejected schema 都必须可恢复 |
| Query read-only flow | 仅敏感查询或失败分支 | 普通查询不必写业务 audit；`GetBusAuditTrail`、DLQ / failure material 查询等敏感读取应留痕 |

### 3.2 哪些错误分支必须记录日志？

| 错误分支 | 日志级别 | 原因 |
|---|---|---|
| validation error | `warn` 或 `info` | 调用方输入错误，需要 trace 但不是系统故障 |
| boundary violation | `warn` | payload body、raw secret、private body 等越界必须可排查 |
| dependency failure | `error` | repository、source、publisher、backend 不可用影响处理 |
| version / state conflict | `warn` | 可能是并发或重复调用，需要定位但不一定是故障 |
| source ack failure | `warn` | truth 已提交但 ack 失败，需要后续重复消费兜底 |
| publisher retryable failure | `warn` / `error` | 需要记录 retry evidence 和 publisher 状态 |
| publisher schema / boundary rejection | `error` | 自动重试不能修复，需人工处理 |
| projection source missing / stale | `warn` | Query 和 projection 一致性需要可解释 |
| commit uncertain / rollback failed | `error` 或 `critical` | 需要人工确认事务结果或清理锁 |
| raw secret / forbidden body detected | `error` | 安全边界风险，必须拒绝并记录引用化证据 |

### 3.3 哪些关键路径需要指标？

| 关键路径 | 指标目的 |
|---|---|
| publication acceptance | 统计 accepted / rejected / duplicate / conflict 数量和处理耗时 |
| outbox relay | 观察 poll 数量、accepted fact、rejected fact、source ack failure、relay lag |
| delivery progression | 观察 scheduled、dispatching、delivered、failed、backend unavailable 和处理耗时 |
| feedback recording | 观察 ack / fail / timeout / duplicate 和 late feedback |
| retry / DLQ / replay preparation | 观察 retry backlog、retry exhausted、DLQ created、replay ready / rejected |
| projection update / rebuild | 观察 projection lag、stale count、source missing、rebuild duration |
| outbound publish | 观察 published、retryable failed、rejected、duplicate publish 和 publish latency |
| backend capability check | 观察 backend health、capability mismatch、check failure |
| repository / UnitOfWork | 观察 transaction duration、commit failure、rollback failure、version conflict |
| API / worker / job entry | 观察 request / event / job item count、error category、duration |

### 3.4 日志、指标、审计字段分别记录什么？

| 类型 | 记录内容 | 禁止内容 |
|---|---|---|
| 日志 | trace id、request id、actor ref、operation、record ref、error code、retryable、details ref、duration | payload body、raw secret、backend private response、governance decision body |
| 指标 | counter / gauge / histogram，标签包含 operation、status、error category、backend kind、job kind | 高基数字段如 raw record id、payload digest 全量、secret ref 明文 |
| 审计 | subject ref、action、actor ref、occurred at、trace ref、source ref、state from/to、result ref、details ref | payload body、raw secret、后端私有正文、长期日志正文、治理决策正文 |
| Trace | 关联 L0-core trace context，不重新定义 trace schema | 不在 span attribute 写正文或 secret |
| Evidence | publish / projection / ack / boundary violation 的可恢复材料引用 | 不保存禁止正文 |

### 3.5 哪些监控和告警细节应留给运维手册？

| 留给运维手册的内容 | 本步只定义什么 |
|---|---|
| 告警阈值、SLO、仪表盘布局 | 只定义指标名、类型、打点位置、标签 |
| 生产后端健康判定阈值 | 只定义 backend health metric 和 audit / event 切口 |
| 日志采集系统、存储保留周期 | 只定义日志字段和禁止字段 |
| 事故处理流程、值班 runbook | 只定义 commit uncertain、publisher rejected 等需要人工介入的 signal |
| 多租户观测隔离策略 | 只定义不记录敏感正文和 boundary ref |
| 长期报表和查询产品 | 归 observability，不在 L0-bus 实现 |

---

## 4. 当前文档问题诊断

| 问题 | 影响 | 本步处理 |
|---|---|---|
| Step 8 / 9 已反复提到 audit，但没有集中埋点表 | 实现者不知道每个处理流具体要记录什么 | 本步输出审计事件表 |
| Step 12 已定义错误日志和 evidence 口径，但没有按代码位置展开 | 错误处理可能只返回错误不留观测材料 | 本步输出日志埋点表和错误分支规则 |
| 需求和架构要求 operator 能观察 backlog、DLQ、backend health | 如果详细设计不定义指标，测试和实现无法验证 | 本步输出指标埋点表 |
| `L0-core` 已拥有 trace 契约 | L0-bus 不能重新定义 trace schema | 本步只定义 trace 关联字段和传播位置 |
| forbidden body 边界横跨日志、审计、projection 和 event | 容易在日志里泄露 payload / secret | 本步列 redaction / 禁止字段规则 |
| observability 是外部消费方 | L0-bus 不能实现长期报表产品 | 本步只输出材料和埋点切口，不写告警阈值和 dashboard |

---

## 5. 改动前后对比

| 维度 | 改动前 | 改动后 |
|---|---|---|
| 审计 | 分散在处理流和状态机里 | 汇总为审计事件表，明确触发位置、字段和消费方 |
| 日志 | 错误分支只说要记录 | 明确日志位置、级别、字段和目的 |
| 指标 | 需求层只要求可观察 | 明确 counter / gauge / histogram 的打点位置和标签 |
| Trace | 只知道消费 L0-core trace | 明确 request / event / job / publisher / projection 的 trace 关联点 |
| 安全边界 | 只在对象和错误中禁止正文 | 明确日志、指标、审计、evidence 都不得保存 forbidden body |
| 运维边界 | 容易写成告警方案 | 本步只写实现切口，阈值和 runbook 留给运维手册 |

---

## 6. 设计取舍

### 6.1 是否所有 Query 都写审计

| 方案 | 说明 | 结论 |
|---|---|---|
| 方案 A：所有 Query 都写 audit | 最完整，但噪声大，且查询不改变 bus truth | 不采用 |
| 方案 B：普通 Query 只打日志 / 指标，敏感 Query 或失败分支写 access audit | 推荐 |
| 方案 C：Query 完全不观测 | 不利于排查 projection stale / access boundary | 不采用 |

推荐方案 B。`GetBusAuditTrail`、DLQ / failure material、replay preparation 相关读取应留痕，普通状态查询以指标和日志为主。

### 6.2 是否把日志当作审计

| 方案 | 说明 | 结论 |
|---|---|---|
| 方案 A：只写日志，不写审计表 | 简单，但日志不可替代 append-only bus audit truth | 不采用 |
| 方案 B：日志、指标、审计分层：日志排错，指标统计，审计作为 bus truth / recovery chain | 推荐 |
| 方案 C：只写审计，不写日志和指标 | 无法满足运行观测 | 不采用 |

推荐方案 B。三者用途不同，不能互相替代。

### 6.3 指标是否包含业务 payload 或 record id

| 方案 | 说明 | 结论 |
|---|---|---|
| 方案 A：指标标签包含完整 record id / payload digest | 便于定位，但高基数且有泄露风险 | 不采用 |
| 方案 B：指标只使用 operation、status、error category、backend kind、job kind 等低基数标签 | 推荐 |
| 方案 C：不打标签 | 无法定位类别问题 | 不采用 |

推荐方案 B。定位单个记录应通过 trace / audit ref，而不是指标标签。

### 6.4 是否由 L0-bus 实现长期观测存储和 dashboard

| 方案 | 说明 | 结论 |
|---|---|---|
| 方案 A：L0-bus 内置长期报表 | 职责越界到 observability | 不采用 |
| 方案 B：L0-bus 输出日志、指标、audit、projection 和 event 材料，长期存储由 observability 消费 | 推荐 |
| 方案 C：L0-bus 不输出观测材料 | 不满足 operator / observability 需求 | 不采用 |

推荐方案 B。它符合架构边界：bus 输出材料，不承载长期报表产品。

---

## 7. 结构化中间产物

### 7.1 可观测性与审计边界图

```text
Command / Event / Job / Query entry
  |
  +-- structured log -----------> runtime logs
  |
  +-- metrics ------------------> metrics collector
  |
  +-- trace context ref --------> L0-core trace context
  |
  v
Application service
  |
  +-- BusAuditEntry ------------> AuditTrailRepository
  |
  +-- DeliveryHistoryEntry -----> DeliveryRepository history
  |
  +-- publish / ack evidence ---> publisher / source evidence
  |
  +-- projection marker --------> ReadProjectionRepository
```

关键说明：

- `BusAuditEntry` 和 `DeliveryHistoryEntry` 是 bus 可追溯事实，不等同于普通日志。
- trace schema 由 L0-core 提供，L0-bus 只保存 `TraceContextRef` / `trace_id` / `span_ref` 等引用。
- metrics 只使用低基数标签，单记录定位走 audit ref / trace ref。
- 日志、审计、指标、evidence 和 projection 均不得保存 forbidden body。

### 7.2 观测字段基础表

| 字段 | 类型 | 用途 | 禁止事项 |
|---|---|---|---|
| `trace_id` | `TraceId` | 跨入口、service、adapter、publisher 关联 | 不重新定义 trace schema |
| `request_id` | `RequestId` | HTTP request 关联 | 不作为业务幂等键 |
| `event_id` | `EventId` | inbound / outbound event 关联 | 不保存 event payload body |
| `job_run_id` | `JobRunId` | job summary 关联 | 不作为业务 item 唯一幂等 |
| `actor_ref` | `ActorRef` | 操作者或系统 actor 引用 | 不保存认证 token |
| `operation` | `OperationName` | 标识处理流或函数入口 | 使用稳定枚举 / 常量 |
| `subject_ref` | `SubjectRef` | 被审计对象引用 | 不写业务正文 |
| `record_ref` | `LocalRecordRef` | 本仓 truth / projection / evidence 引用 | 不放高基数 metric 标签 |
| `error_code` | `ErrorCode` | 稳定错误码 | 不使用 debug string |
| `details_ref` | `ErrorDetailsRef` | 错误详情引用 | 详情仍不得包含 forbidden body |
| `duration_ms` | `u64` | 处理耗时 | 只用于日志 / histogram |
| `status` | `StatusLabel` | success / rejected / conflict / failed / retryable | 低基数 |

### 7.3 日志埋点表

| 位置 | 日志级别 | 字段 | 目的 |
|---|---|---|---|
| API request accepted | `info` | `trace_id`、`request_id`、`actor_ref`、`operation`、`route` | 关联入口请求 |
| API validation failed | `warn` | `trace_id`、`request_id`、`operation`、`error_code`、`details_ref` | 排查无效请求 |
| Command idempotency hit | `info` | `trace_id`、`operation`、`idempotency_scope`、`result_ref` | 说明 duplicate 返回既有结果 |
| Command idempotency conflict | `warn` | `trace_id`、`operation`、`idempotency_scope`、`error_code` | 排查同 key 不同请求 |
| `AcceptPublicationFlow` success / rejected | `info` | `trace_id`、`publication_id`、`status`、`audit_ref` | 记录接入结果 |
| payload boundary violation | `warn` | `trace_id`、`operation`、`source_ref`、`error_code`、`details_ref` | 记录 forbidden body 拒绝，不记录正文 |
| `RunDeliveryProgressionFlow` item start / finish | `info` | `trace_id`、`job_run_id`、`delivery_id`、`attempt_id`、`status`、`duration_ms` | 排查 delivery 推进 |
| backend unavailable / timeout | `warn` | `trace_id`、`delivery_id`、`backend_kind`、`error_code`、`retryable` | 排查 backend 失败和 retry candidate |
| backend private body violation | `error` | `trace_id`、`backend_kind`、`delivery_id`、`details_ref` | 安全边界违规 |
| feedback recorded | `info` | `trace_id`、`delivery_id`、`feedback_status`、`audit_ref` | 记录 ack / fail / timeout |
| late feedback / state conflict | `warn` | `trace_id`、`delivery_id`、`from_status`、`error_code` | 排查重复或过晚反馈 |
| retry plan created / exhausted | `info` | `trace_id`、`retry_plan_id`、`delivery_id`、`retry_status`、`audit_ref` | 跟踪恢复链 |
| DLQ created | `warn` | `trace_id`、`dead_letter_id`、`delivery_id`、`failure_material_id`、`audit_ref` | 便于 operator 处置 |
| replay preparation ready / rejected | `info` | `trace_id`、`replay_preparation_id`、`dead_letter_id`、`approval_ref`、`audit_ref` | 追踪 replay 前置材料 |
| projection source missing / stale | `warn` | `trace_id`、`projection_key`、`source_audit_ref`、`consistency_marker` | 解释只读输出不新鲜 |
| projection rebuild finish | `info` | `trace_id`、`job_run_id`、`rebuild_scope`、`status`、`duration_ms` | 追踪 rebuild |
| outbound publish success | `info` | `trace_id`、`event_id`、`event_kind`、`publish_receipt_ref` | 追踪事件发布 |
| outbound publish retryable failure | `warn` | `trace_id`、`event_id`、`event_kind`、`error_code`、`evidence_ref` | 保留 publisher retry 线索 |
| outbound publish rejected | `error` | `trace_id`、`event_id`、`event_kind`、`error_code`、`evidence_ref` | schema / boundary 需人工修复 |
| source ack failed | `warn` | `trace_id`、`source_ref`、`event_id`、`error_code`、`evidence_ref` | 解释重复消费 |
| repository unavailable | `error` | `trace_id`、`operation`、`repository`、`error_code`、`retryable` | 排查 store 故障 |
| UnitOfWork commit uncertain | `error` | `trace_id`、`operation`、`uow_ref`、`details_ref`、`manual_action_required` | 人工确认事务结果 |
| rollback failed | `error` | `trace_id`、`operation`、`uow_ref`、`details_ref` | 人工清理 locks / staged writes |
| Config validation rejected forbidden boundary | `error` | `operation`、`config_source_ref`、`error_code`、`details_ref` | 防止配置绕过红线 |

### 7.4 指标埋点表

| 指标 | 类型 | 打点位置 | 标签 |
|---|---|---|---|
| `bus_api_requests_total` | counter | API handler entry | `operation`、`status`、`error_category` |
| `bus_api_request_duration_ms` | histogram | API handler finish | `operation`、`status` |
| `bus_publication_acceptance_total` | counter | `AcceptPublicationFlow` / outbox fact consume | `status=accepted/rejected/duplicate/conflict`、`source_kind` |
| `bus_outbox_relay_polled_total` | counter | `RunOutboxRelayFlow` | `source_kind`、`status` |
| `bus_outbox_relay_lag` | gauge | outbox relay job summary | `source_kind` |
| `bus_delivery_progression_total` | counter | `RunDeliveryProgressionFlow` item finish | `from_status`、`to_status`、`backend_kind`、`status` |
| `bus_delivery_attempt_duration_ms` | histogram | delivery attempt finish | `backend_kind`、`result_status` |
| `bus_feedback_recorded_total` | counter | feedback / backend signal / timeout flows | `feedback_status`、`source_kind` |
| `bus_retry_plan_total` | counter | `RequestRetryFlow` / `RunRetryCycleFlow` | `retry_status`、`result_status` |
| `bus_retry_backlog` | gauge | retry cycle job scan | `retry_status` |
| `bus_dead_letter_total` | counter | `MoveDeliveryToDeadLetterFlow` | `reason_category` |
| `bus_dead_letter_open` | gauge | DLQ query / job summary | `status` |
| `bus_replay_preparation_total` | counter | `PrepareReplayFlow` | `status=ready/rejected/conflict` |
| `bus_projection_update_total` | counter | projection run / rebuild | `projection_kind`、`status` |
| `bus_projection_lag` | gauge | projection job summary | `projection_kind` |
| `bus_outbound_publish_total` | counter | `OutboundEventPublishFlow` | `event_kind`、`status=published/retryable_failed/rejected/duplicate` |
| `bus_outbound_publish_duration_ms` | histogram | publisher finish | `event_kind`、`status` |
| `bus_backend_health` | gauge | `CheckBackendCapabilityFlow` | `backend_kind`、`health_status` |
| `bus_repository_errors_total` | counter | repository adapter error mapping | `repository`、`error_kind` |
| `bus_uow_duration_ms` | histogram | `UnitOfWork.begin` to `commit` / `rollback` | `purpose`、`status` |
| `bus_idempotency_total` | counter | idempotency check / bind | `operation`、`result=miss/hit/conflict` |

指标标签约束：

- 禁止把 `delivery_id`、`publication_id`、`payload_digest`、`secret_ref`、`details_ref` 放入指标标签。
- 单记录定位必须使用 trace / audit / log，不使用 metric label。
- 告警阈值、SLO 和 dashboard 不在本步定义。

### 7.5 审计事件表

| 审计事件 | 触发位置 | 记录字段 | 消费方 |
|---|---|---|---|
| `PublicationAcceptedAudit` | `AcceptPublicationFlow` / `ConsumeCommittedOutboxFactFlow` | `audit_id`、`publication_id`、`source_ref`、`actor_ref`、`trace_ref`、`occurred_at` | delivery worker、operator、observability |
| `PublicationRejectedAudit` | payload / contract rejection | `audit_id`、`publication_id`、`source_ref`、`reason_code`、`details_ref`、`trace_ref` | publisher、operator、observability |
| `OutboxFactConsumedAudit` | outbox fact consumer success / duplicate | `audit_id`、`committed_fact_ref`、`event_id`、`source_ref`、`result_ref`、`trace_ref` | operator、observability |
| `DeliveryAttemptStartedAudit` | `RunDeliveryProgressionFlow` | `audit_id`、`delivery_id`、`attempt_id`、`backend_capability_ref`、`trace_ref` | operator、observability |
| `DeliveryStateChangedAudit` | delivery status transition | `audit_id`、`delivery_id`、`from_status`、`to_status`、`reason_code`、`trace_ref` | read projection、operator、SDK view |
| `FeedbackRecordedAudit` | feedback / backend signal / timeout recorded | `audit_id`、`delivery_id`、`feedback_id`、`feedback_status`、`source_ref`、`trace_ref` | recovery、read projection、operator |
| `DuplicateFeedbackAudit` | duplicate feedback / event | `audit_id`、`delivery_id`、`idempotency_scope`、`result_ref`、`trace_ref` | operator、observability |
| `RecoveryRetryRequestedAudit` | `RequestRetryFlow` | `audit_id`、`delivery_id`、`retry_plan_id`、`failure_material_ref`、`actor_ref`、`trace_ref` | retry job、operator |
| `RetryAttemptedAudit` | `RunRetryCycleFlow` | `audit_id`、`retry_plan_id`、`delivery_id`、`attempt_id`、`attempt_index`、`trace_ref` | operator、observability |
| `RetryExhaustedAudit` | retry plan exhausted | `audit_id`、`retry_plan_id`、`delivery_id`、`reason_code`、`trace_ref` | recovery、operator |
| `DeadLetterCreatedAudit` | `MoveDeliveryToDeadLetterFlow` | `audit_id`、`dead_letter_id`、`delivery_id`、`failure_material_id`、`audit_chain_ref`、`trace_ref` | governance、operator、observability |
| `DeadLetterReviewedAudit` | operator review flow | `audit_id`、`dead_letter_id`、`actor_ref`、`action`、`trace_ref` | operator、governance |
| `ReplayPreparationReadyAudit` | `PrepareReplayFlow` | `audit_id`、`replay_preparation_id`、`dead_letter_id`、`approval_ref`、`audit_chain_ref`、`trace_ref` | replay executor boundary、governance、operator |
| `ReplayPreparationRejectedAudit` | replay precondition failed | `audit_id`、`dead_letter_id`、`reason_code`、`details_ref`、`trace_ref` | operator、governance |
| `ProjectionUpdatedAudit` | projection run / rebuild success | `audit_id`、`projection_kind`、`projection_key`、`source_audit_ref`、`projection_version`、`trace_ref` | SDK、observability、operator |
| `ProjectionRejectedAudit` | projection boundary / source missing / version conflict | `audit_id`、`projection_kind`、`projection_key`、`reason_code`、`details_ref`、`trace_ref` | operator、observability |
| `BackendCapabilityCheckedAudit` | `CheckBackendCapabilityFlow` | `audit_id`、`backend_kind`、`capability_profile_ref`、`health_status`、`trace_ref` | operator、observability |
| `BackendCapabilityChangedAudit` | capability status changed | `audit_id`、`backend_kind`、`old_status`、`new_status`、`trace_ref` | operator、observability |
| `PublishEvidenceAudit` | `OutboundEventPublishFlow` | `audit_id`、`event_id`、`event_kind`、`source_record_ref`、`publish_status`、`evidence_ref`、`trace_ref` | publisher retry、observability |
| `BoundaryViolationAudit` | payload / secret / private body / projection truth write rejected | `audit_id`、`operation`、`subject_ref`、`reason_code`、`details_ref`、`trace_ref` | operator、security review |
| `IdempotencyConflictAudit` | same key different digest | `audit_id`、`idempotency_scope`、`record_ref`、`error_code`、`trace_ref` | operator、observability |

审计字段约束：

- `details_ref` 可以指向详情材料，但详情材料仍不得包含 forbidden body。
- `actor_ref` 是可信入口传入的 actor 引用，不保存 token 或 credential。
- `source_ref`、`payload_ref`、`backend_result_ref` 只保存引用，不保存正文。

### 7.6 Trace 关联表

| 入口 / 处理点 | Trace 来源 | 必须传播到哪里 |
|---|---|---|
| HTTP Command / Query | gateway headers / command metadata | API log、application service、audit、error response、outbound event |
| Inbound Event Consumer | event envelope / source metadata | consumer log、application service、audit、source ack evidence |
| Operations Job | job metadata / generated job trace | job summary、item log、audit、projection evidence |
| Outbound Event Publish | source bus truth trace | publish evidence、publisher log、event envelope |
| Projection Job | source audit ref / job trace | projection record、projection log、consistency marker |
| Backend adapter call | delivery / job trace | backend result ref、attempt audit、error log |

约束：

- L0-bus 只消费和传播 L0-core 的 trace context，不重新定义 trace schema。
- trace span attribute 不得保存 payload body、raw secret、backend private body。
- 跨异步边界必须保留 trace ref，尤其是 truth commit 后 publisher / projection 路径。

### 7.7 Redaction 与 forbidden body 规则

| 材料类型 | 必须保留 | 必须剔除 |
|---|---|---|
| 日志 | `trace_id`、`operation`、`record_ref`、`error_code`、`details_ref` | payload body、raw secret、backend private response、governance decision body |
| 指标 | low-cardinality status / kind / category | record id、payload digest 全量、secret ref 明文 |
| 审计 | subject ref、actor ref、action、trace ref、reason code | payload body、raw credential、private response body |
| Publish evidence | event id、event kind、source record ref、status、error code | event body 原文、secret、payload body |
| Projection | source audit ref、projection key、version、consistency marker | 禁止正文和可反写真相的字段 |
| Error details | stable error code、safe summary、supporting refs | raw request body、raw backend body、token |

---

## 8. 回填草稿

正式 `03-详细设计.md` 的 §14 按以下方式回填：

```md
## 14. 可观测性与审计埋点契约

### 14.1 可观测性与审计边界图

从 `design-calibration/03_ddd_step_15_observability_audit.md` §7.1 摘录。

### 14.2 观测字段基础表

从 `design-calibration/03_ddd_step_15_observability_audit.md` §7.2 摘录。

### 14.3 日志埋点表

从 `design-calibration/03_ddd_step_15_observability_audit.md` §7.3 摘录。

### 14.4 指标埋点表

从 `design-calibration/03_ddd_step_15_observability_audit.md` §7.4 摘录。

### 14.5 审计事件表

从 `design-calibration/03_ddd_step_15_observability_audit.md` §7.5 摘录。

### 14.6 Trace 关联表

从 `design-calibration/03_ddd_step_15_observability_audit.md` §7.6 摘录。

### 14.7 Redaction 与 forbidden body 规则

从 `design-calibration/03_ddd_step_15_observability_audit.md` §7.7 摘录。
```

说明：

- 正式文档不写告警阈值、SLO、dashboard 或运维 runbook。
- 正式文档必须明确日志、指标、审计、trace、evidence、projection 都不得保存 forbidden body。
- Step 16 需要承接本步，补充日志 / 指标 / 审计字段的最小测试切口。

---

## 9. 待确认事项

| 待确认事项 | 方案 | 推荐 | 原因 |
|---|---|---|---|
| 是否所有 Query 都写 audit | A. 全部写；B. 只敏感 Query 和失败分支写；C. 完全不写 | 推荐 B | 降低噪声，同时保留敏感访问和异常追踪 |
| 指标是否包含 record id | A. 包含；B. 不包含，只用低基数标签；C. 仅测试环境包含 | 推荐 B | 防止高基数和敏感信息泄露 |
| `critical` 是否作为独立日志级别 | A. 独立级别；B. 使用 `error` + `manual_action_required=true` 字段；C. 不区分 | 推荐 B | 兼容常见日志系统，同时保留人工介入口径 |
| publish failure 是否写审计还是只写 evidence | A. 只写日志；B. 写 publish evidence，必要时写 audit；C. 每次失败都写业务 audit | 推荐 B | publish failure 不改变 truth，但必须可恢复和可追踪 |
| 是否在本步定义告警阈值 | A. 定义；B. 不定义，留给运维手册 / observability 仓 | 推荐 B | SOP 要求本步只写代码埋点切口 |

---

## 10. 进入下一步条件

```text
实现者知道在什么代码位置记录哪些日志、指标和审计事件。
日志埋点、指标埋点、审计事件、trace 关联、evidence 和 forbidden body redaction 规则均已定义。
可以进入 Step 16,定义测试切口与最小验证清单。
```
