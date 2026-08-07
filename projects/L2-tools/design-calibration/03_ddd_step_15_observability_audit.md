# L2-tools 03 详细设计 Step 15: 可观测性与审计埋点契约

> 对应 SOP: `standards/document/详细设计讨论流程_SOP.md` Step 15
> 对标粒度: `projects/L1-governance/design-calibration/03_ddd_step_15_observability_audit.md`
> 正式文档: `projects/L2-tools/03-详细设计.md`（Step 19 前保持 write-closed）
> 模式: `full-restart / single-agent-serial`

## 0. Step 开工确认

| 项目 | 记录 |
|---|---|
| 前序门禁 | Step 14 `completed / pass`；typed config candidate、builder binding、Store/UoW/Port seam 与不可配置化红线已闭合。 |
| 直接输入 | 正式 02 §10~§12；Step 6 object/carrier contracts；Step 7 Store/Port/UoW；Step 8 protocol contracts；Step 9 `CF-01~13`、`QF-01~11`、`IF-01~05`、`OF-01~04`、`JF-01~04` flows；Step 10 state；Step 11 persistence；Step 12 error/recovery；Step 13 concurrency/idempotency；Step 14 config binding。 |
| 观测 owner | L2 只定义自身代码埋点、`ToolAuditEntry`、安全 marker/ref/report 的产生时机；L4-observability 是外部 handoff/status seam，不在 L2 创建观测存储或 producer registry。 |
| Trace authority | `TraceContext` 只来自 Command/Query/InboundEvent/Job metadata；domain 不生成替代 context，span 不改写业务 audit。 |
| 业务审计 authority | 工具执行结果审计由 `ToolAuditEntry` 拥有；其他历史解释使用已定义 evolution/change fact、assessment、gap、attempt、receipt、projection 或 `JobReport`，不新增通用审计聚合。 |
| 外部 blocker | `L2T-UP-001~009` 原样继承；Step 15 不把日志、fake、endpoint、status ref 或 handoff marker 当作 provider/schema/route/readiness 证据。 |
| 正式回填 | 本 Step 只写中间产物；正式 §14 仅在 Step 19 按本文件及 Step 16~18 结论整体装配。 |
| 提交 | 未获用户授权，不提交 commit。 |

## 1. 本步目标与边界

本 Step 把每个实现入口、错误分支、事务边界和外部 handoff 的观测切口固定到可落码的
位置。实现者完成本 Step 后应能回答：

1. 哪个 entry/application/worker/job/infra boundary 记录什么结构化日志。
2. 哪些指标使用哪些低基数标签，哪些关联值只能进入 log/trace/ref/report。
3. 哪些本地 truth 变化必须形成 `ToolAuditEntry`、change fact、assessment、gap、attempt、receipt 或 report。
4. `TraceContext`、runtime span、`ToolAuditEntry`、history/change fact、外部 status ref 和 handoff marker 如何分层。
5. accepted、rejected、duplicate、query、consumer、outbound continuation、job 和 commit/call unknown 各自允许哪些观测副作用。
6. raw body、prompt、capture、provider response、secret、credential、stack trace、外部正文如何在所有观测面被拒绝。

本 Step 不定义告警阈值、SLO/SLA、dashboard、采样率、日志或指标保留周期、pager/runbook、观测后端产品、生产 endpoint 健康阈值、部署拓扑、具体 topic/route 或外部状态轮询策略。上述内容留给 04、部署/运维文档或对应 owner；本 Step 只定义代码埋点契约。

## 2. SOP 问题回答

| SOP 问题 | 收口回答 |
|---|---|
| 哪些处理流必须记录审计？ | `CF-01~07` 的 accepted Contract/Binding truth 追加其既有 evolution/change fact；`CF-08/11` 的 accepted invocation source 形成 outcome/audit pair，其中 `ToolAuditEntry` 与 `ToolInvocationOutcome` 在同一 UoW 原子保存；`CF-09/10/12/13` 的 accepted assessment/handoff/material/gap 追加既有对象或 marker。`IF` 只记录本地 snapshot/assessment/ref/gap/receipt；`OF` 只记录 local `ExternalSubmissionAttempt`；`JF` 只记录 assessment/status/gap/projection/report。Query 不写业务审计。 |
| 哪些错误必须记录日志？ | metadata/body validation、domain reject、not-visible/not-found、version/unique conflict、idempotency duplicate/conflict/in-flight/result-missing、Port blocked/unavailable/conflicting/unknown、unsupported consumer version、UoW commit/rollback/commit-unknown、projection/reference/job failure、config validation reject 和 adapter availability change 都必须写结构化日志；不把错误写成 accepted audit。 |
| 哪些关键路径需要指标？ | Command、Query、Consumer、outbound continuation、Job、UoW/repository、idempotency、external resolver/feedback、projection、config validation 和 adapter availability 均需要 counter；入口和外部/长路径需要 duration histogram；projection freshness、pending local attempt、adapter availability 使用 gauge 仅表达本地观察面。 |
| 日志、指标、审计字段分别记录什么？ | 日志记录 safe operation/ref/state/error/diagnostic/duration/count；指标只记录低基数 kind/state/result/category；审计/事实对象记录已提交的 typed refs、from/to state、basis、actor/correlation/time 和 local result refs。任何面都不记录正文。 |
| 哪些监控细节留给运维？ | 阈值、告警规则、SLO、dashboard、采样、保留、backend、pager、runbook、endpoint 健康阈值和 secret 管理全部留给下游文档；本 Step 不伪造运行结果或 readiness。 |

## 3. 当前材料诊断与设计取舍

### 3.1 Historical material / conflict audit

| 材料 | 冲突或缺口 | 本 Step 处理 |
|---|---|---|
| 旧 README / 正式 03 | 将 telemetry、NATS/RPC、executor、provider response 或运行日志混入工具实现事实。 | 标为 `historical_material`；不继承 backend、route、consumer group、capture 或运行结果字段。 |
| 正式 02 横切章节 | 已规定 body-free、outcome/audit 原子性和外部 status 独立，但未给出具体埋点位置。 | 本文件补齐 entry/handler/worker/job/infra 切口，不修改 02 的 owner。 |
| Step 6 outcome annex | `ToolAuditEntry` 已是 append-only local audit，但容易被误读为 runtime log 或 L4 observation。 | 明确它只解释 `ToolInvocationOutcome`，不承载日志、Bus history 或 Observability truth。 |
| Step 7 adapter contract | 规定 safe error/blocked/unknown，但未规定日志/metric 字段。 | 按 `PortResolution` 与 `PortCallError` 分别记录 semantic outcome 和 adapter failure。 |
| Step 9 flows | 每条 flow 已有 UoW/side effect 顺序，但观测副作用未集中。 | 用 flow family matrix 和逐 flow audit matrix 回指已有调用，不新增 flow。 |
| Step 11~14 | 已固定 atomic pair、replay、unknown 和 config boundary。 | 观测不能改变这些事务、幂等、状态或配置约束。 |
| L4-observability 当前正式文档 | 只提供外部安全材料/观察面边界，Tools-specific producer/source family 仍未闭口。 | 只保留 `ObservationMaterialRef`/handoff/status blocked-aware seam；不声称 producer、route 或 observation readiness。 |

### 3.2 设计取舍

| 议题 | 选择 | 原因 |
|---|---|---|
| Tool 域审计 | 复用 `ToolAuditEntry` + 已定义 facts/assessments/gaps/attempts/receipts/reports | 每个事实有唯一 owner，避免新增第二套 audit truth。 |
| runtime log 与业务 audit | 分离 | 日志可定位运行错误，但不能替代 outcome/audit 原子事实。 |
| TraceContext | metadata 传播，entry 建 span | domain 不生成随机 trace；业务对象只保存 typed correlation/context ref。 |
| rejected/duplicate | 仅 log/metric 与已有 stored error/receipt/report | 不伪造 accepted truth、history、outbox 或 `ToolAuditEntry`。 |
| Query | no-write，仅 log/metric | 不因“读审计”而写 audit、idempotency、projection repair 或 ref refresh。 |
| external status | 独立 `BusDeliveryStatusRef`/`ObservationMaterialRef` | local submission 不升级为 delivered/observed。 |
| outbound continuation | 记录 `ExternalSubmissionAttempt` local disposition | 不记录 delivery/observation/route success；unknown 不自动重调。 |
| metric cardinality | kind/state/result/category 标签 | 高基数 ref 用 structured log、trace、audit、report 关联。 |

## 4. 可观测性分层与 ownership

| 层 | L2 载体 | 何时产生 | 允许表达 | 明确不表达 |
|---|---|---|---|---|
| Runtime log | structured log record | handler/worker/job/infra boundary | operation、safe ref、state、error kind、duration、count、diagnostic ref | truth history、raw body、provider/transport body |
| Metric | counter/histogram/gauge | boundary 返回或状态保存后 | 低基数调用量、结果类别、耗时、freshness/availability | 单条 subject、actor、trace、secret、endpoint |
| Trace/span | `TraceContext` + boundary span | entry 到 result/error | parent/child correlation、operation kind、phase、safe attrs | 新业务 identity、domain 决策、完整 payload |
| Tool audit | `ToolAuditEntry` | `CF-08/11` accepted outcome pair | invocation、anchor、judgment、source、gap、outcome refs | log body、Bus delivery、Observation store、runtime checkpoint |
| Change/history fact | 已定义 evolution/change fact、assessment、gap、attempt | local truth 或消费事实提交 | from/to、basis、actor、source/time、local result ref | 外部 owner truth、测试/验收签署 |
| Projection/job report | `ReferenceConsistencyReport`、D1 projection、`JobReport` | Job/Projection target UoW | derived coverage、freshness、counts、gap/output refs | subject repair、readiness、实现成功 |
| External status ref | `BusDeliveryStatusRef`、`ObservationMaterialRef` | IF-04/05、JF-04 | formal authority/status ref 或 unknown/blocked | delivered/observed truth owned by L0/L4 |
| Handoff/submission marker | `ExternalSubmissionAttempt`、`ExecutionHandoffAttempt` | prepared/one local call/result | local call disposition、attempt correlation、unknown | physical delivery、Sandbox run/capture、retry/DLQ |

### 4.1 TraceContext 与 span 约束

`TraceContext` 的唯一输入是 `CommandMetadata`、`QueryMetadata`、`InboundEventEnvelope` 或
`JobMetadata`。entry 可以在该 context 下建立 `command`、`query`、`consumer`、`continuation`、
`job`、`uow`、`repository`、`resolver`、`collaboration` 和 `config` span；span 只附带 safe
kind/ref/state/count/duration 属性。domain factory、Store、Port adapter 不得自行生成新的
trace context；缺失必填 context 按 Step 12 validation error 处理，不能用随机值掩盖错误。

`TraceContext.parent_span_ref` 是传播关系，不是业务 parent object；`TraceSamplingHint` 只可
影响可选 runtime span，不能抑制 required error log、required metric、`ToolAuditEntry` 或已
提交的 local fact。span 完成不代表 transaction commit、external delivery 或 observation 成功。

## 5. 日志埋点表

日志字段均为 body-free、structured、backend-neutral。`*_ref` 是 typed safe ref；`*_hash` 只允许 one-way fingerprint，不得恢复 caller 输入。

| 位置 | 级别 | 必填字段 | 目的 |
|---|---|---|---|
| `api` Command handler entry | `info` | `trace_context_ref`, `request_ref`, `command_kind`, `actor_kind`, `idempotency_key_hash` | 记录写入口与关联上下文。 |
| Command metadata/body validation reject | `warn` | `trace_context_ref`, `request_ref`, `command_kind`, `error_kind`, `validation_issue_ref`, `diagnostic_ref` | 说明未进入 domain/UoW 的原因。 |
| Command idempotency reserve/claim | `debug` | `trace_context_ref`, `command_kind`, `idempotency_key_hash`, `reservation_state` | 区分 first claim、in-flight 和 completed。 |
| Command duplicate replay | `info` | `trace_context_ref`, `command_kind`, `idempotency_key_hash`, `stored_result_ref`, `replay_kind` | 证明只读 stored typed result，未重跑 transition。 |
| Command conflict/in-flight/result missing | `warn` | `trace_context_ref`, `command_kind`, `idempotency_key_hash`, `error_kind`, `conflict_ref`, `diagnostic_ref` | 定位幂等冲突或完整性缺口。 |
| Accepted Command after commit confirmation | `info` | `trace_context_ref`, `command_kind`, `actor_ref`, `subject_ref`, `result_refs`, `gap_refs`, `duration_ms` | 记录已提交本地结果；不把 log 当 audit。 |
| Command domain/application rejection | `warn` | `trace_context_ref`, `command_kind`, `subject_ref`, `error_kind`, `reason_ref`, `diagnostic_ref` | 区分业务拒绝、blocked 与 adapter failure。 |
| Command UoW begin/commit/rollback | `debug`/`error` | `trace_context_ref`, `operation`, `request_ref`, `uow_phase`, `transaction_ref`, `error_kind`, `diagnostic_ref` | 定位事务边界与失败。 |
| Commit outcome unknown / rollback failure | `error` | `trace_context_ref`, `operation`, `transaction_ref`, `idempotency_key_hash`, `resolution_state`, `diagnostic_ref` | 支撑同 authority resolution 与人工恢复。 |
| `api` Query entry/completion | `info`/`debug` | `trace_context_ref`, `request_ref`, `query_kind`, `consumer_kind`, `surface_disposition`, `freshness_state`, `duration_ms` | 追踪只读 surface 和耗时。 |
| Query not-visible/not-found | `info` | `trace_context_ref`, `query_kind`, `subject_ref`, `visibility_state`, `surface_disposition` | 记录 anti-enumeration-safe read outcome。 |
| Query stale/rebuilding/unavailable/failed | `warn` | `trace_context_ref`, `query_kind`, `view_kind`, `freshness_state`, `source_watermark_ref`, `gap_refs`, `diagnostic_ref` | 解释 derived/read surface 降级。 |
| `worker` inbound envelope reject/unsupported | `warn` | `trace_context_ref`, `consumer_name`, `source_event_ref`, `event_version`, `disposition`, `validation_issue_ref` | 证明未解析/未写入不支持 payload。 |
| Inbound consumer accepted | `info` | `trace_context_ref`, `consumer_name`, `source_event_ref`, `source_ref`, `local_result_refs`, `gap_refs`, `duration_ms` | 关联 snapshot/assessment/ref/gap/receipt。 |
| Inbound duplicate replay | `info` | `trace_context_ref`, `consumer_name`, `source_event_ref`, `dedup_key_hash`, `receipt_ref`, `replay_kind` | 证明没有二次 Port/page/write。 |
| Inbound quarantined/delayed/blocked | `warn` | `trace_context_ref`, `consumer_name`, `source_event_ref`, `disposition`, `error_kind`, `gap_refs`, `diagnostic_ref` | 解释安全拒绝和 blocked seam。 |
| External resolver/feedback call start/end | `debug`/`warn` | `trace_context_ref`, `resolver_kind`, `adapter_slot`, `subject_ref`, `resolution_state`, `error_kind`, `retryable`, `duration_ms` | 区分 semantic blocked/unavailable 与 adapter error。 |
| `CF-10`/`OF-*` prepared marker saved | `info` | `trace_context_ref`, `flow_kind`, `attempt_ref`, `material_ref_or_handoff_ref`, `event_kind`, `phase` | 证明 side-effect 前 local marker 已提交；不证明 call 已发生。 |
| `CF-10`/`OF-*` local attempt terminal | `info`/`warn` | `trace_context_ref`, `flow_kind`, `attempt_ref`, `attempt_state`, `local_failure_ref`, `gap_refs`, `duration_ms` | 记录 local disposition/unknown，不写 delivered/observed。 |
| Outbound continuation duplicate/unknown | `info`/`error` | `trace_context_ref`, `flow_kind`, `attempt_ref`, `idempotency_key_hash`, `replay_kind`, `error_kind` | 证明 Prepared/Unknown 不自动重调。 |
| Job entry/claim/summary | `info` | `trace_context_ref`, `job_kind`, `job_key_hash`, `disposition`, `counts`, `output_refs`, `gap_refs`, `duration_ms` | 记录 bounded report；不声称 scheduler run/evidence。 |
| Job duplicate/conflict/in-flight | `info`/`warn` | `trace_context_ref`, `job_kind`, `job_key_hash`, `replay_kind`, `error_kind`, `report_ref` | 证明不重扫、不重调 external Port。 |
| Projection rebuild item | `info`/`warn` | `trace_context_ref`, `job_kind`, `view_kind`, `target_ref`, `source_watermark_ref`, `write_result_kind`, `report_ref` | 解释 D1 freshness/write outcome。 |
| Reference/status refresh item | `info`/`warn` | `trace_context_ref`, `job_kind`, `status_family`, `attempt_ref`, `status_ref`, `resolution_state`, `gap_refs` | 保持 Bus/Observation 独立。 |
| Config validation / builder failure | `error` | `config_source_ref`, `config_section`, `adapter_slot`, `validation_issue_ref`, `diagnostic_ref` | 记录 safe config 问题，不泄露 raw config。 |
| Adapter availability change | `info`/`warn` | `adapter_slot`, `adapter_kind`, `availability_state`, `failure_ref`, `checked_at` | 只表达本地 binding observation，不表达 provider readiness。 |

### 5.1 日志字段与级别规则

| 规则 | 正式要求 |
|---|---|
| Context | `trace_context_ref` 必须来自入站 metadata；不存在时只写 validation issue，不随机生成替代值。 |
| Identity | `request_ref`、`actor_ref`、`subject_ref`、`attempt_ref`、`result_ref` 可出现在 structured log，但不得进入 metric label。 |
| Idempotency | raw idempotency/dedup key 禁止；只记录 one-way hash 或 redacted fingerprint。 |
| Error | `error_kind` 使用 Step 12 stable category；`diagnostic_ref` 指向 redacted issue，不包含 stack/body。 |
| Time | `duration_ms` 由 boundary 记录；domain 不读 wall clock。 |
| Level | accepted/replay/summary 用 `info`；validation/domain/blocked/conflict 用 `warn`；commit unknown、rollback failure、result missing、ambiguous side effect、config reject 用 `error`；高频 resolver/claim 细节可用 `debug`。 |
| No body | 所有 log attribute 禁止 raw request/query/event body、prompt、capture、provider response、SQL、URL credential、secret 和 stack trace。 |

## 6. 指标埋点表

| 指标 | 类型 | 打点位置 | 低基数标签 |
|---|---|---|---|
| `tools_command_total` | counter | Command handler 返回前 | `command_kind`, `result`, `error_kind` |
| `tools_command_duration_ms` | histogram | Command application service 外层 | `command_kind`, `result` |
| `tools_truth_change_total` | counter | accepted local truth commit confirmed 后 | `truth_kind`, `subject_kind` |
| `tools_query_total` | counter | Query handler 返回前 | `query_kind`, `surface_disposition`, `freshness_state` |
| `tools_query_duration_ms` | histogram | Query service 外层 | `query_kind`, `surface_disposition` |
| `tools_consumer_total` | counter | Consumer receipt 形成后 | `consumer_name`, `disposition`, `error_kind` |
| `tools_consumer_duration_ms` | histogram | Consumer service 外层 | `consumer_name`, `disposition` |
| `tools_unsupported_event_version_total` | counter | version reject receipt 形成后 | `consumer_name`, `source_family` |
| `tools_outbound_continuation_total` | counter | local attempt disposition 保存后 | `event_kind`, `attempt_state` |
| `tools_outbound_continuation_duration_ms` | histogram | continuation service 外层 | `event_kind`, `attempt_state` |
| `tools_job_total` | counter | Job report/error 返回前 | `job_kind`, `disposition`, `error_kind` |
| `tools_job_duration_ms` | histogram | Job runner 外层 | `job_kind`, `disposition` |
| `tools_job_item_total` | counter | 每个 bounded target 结果提交后 | `job_kind`, `item_result` |
| `tools_idempotency_total` | counter | reserve/replay/conflict/complete 后 | `operation_group`, `reservation_result` |
| `tools_uow_total` | counter | begin/commit/rollback/resolve 返回后 | `uow_phase`, `result` |
| `tools_repository_error_total` | counter | Store error 映射处 | `repository_kind`, `error_kind` |
| `tools_version_conflict_total` | counter | expected-version conflict 映射处 | `repository_kind`, `resource_kind` |
| `tools_external_resolution_total` | counter | external Port resolution/call 完成后 | `port_kind`, `resolution_state`, `error_kind` |
| `tools_external_resolution_duration_ms` | histogram | resolver/feedback Port 边界 | `port_kind`, `resolution_state` |
| `tools_projection_freshness_total` | gauge | projection state 保存或 query 读取后 | `view_kind`, `freshness_state` |
| `tools_projection_rebuild_total` | counter | JF-03 target 完成后 | `view_kind`, `write_result_kind` |
| `tools_projection_rebuild_duration_ms` | histogram | JF-03 target 外层 | `view_kind`, `write_result_kind` |
| `tools_reference_resolution_total` | counter | snapshot/assessment/status ref 保存后 | `reference_kind`, `resolution_state` |
| `tools_external_status_total` | counter | IF-04/05 或 JF-04 status/gap 保存后 | `status_family`, `result` |
| `tools_gap_total` | counter | gap create/save/resolve result 后 | `gap_class`, `gap_state`, `impact_class` |
| `tools_local_attempt_total` | gauge | handoff/submission attempt state 保存后 | `attempt_kind`, `attempt_state` |
| `tools_config_validation_total` | counter | `ToolsRuntimeConfig` validation 后 | `config_section`, `result`, `issue_kind` |
| `tools_adapter_availability_total` | gauge | adapter binding/availability observation 后 | `adapter_slot`, `adapter_kind`, `availability_state` |

### 6.1 指标标签规则

| 规则 | 正式要求 |
|---|---|
| 允许 | closed enum 的 operation/kind/state/result/disposition/error category/port kind/view kind/source family。 |
| 禁止高基数 | request/actor/subject/trace/correlation/result/outbox/marker/source-event/idempotency/dedup/payload-digest/job-key 值。 |
| 禁止敏感值 | secret/token/credential/raw endpoint/topic/SQL/HTTP body/provider response/prompt/capture。 |
| 关联方式 | 单记录诊断使用 structured log、span、typed audit/ref/report/diagnostic，不依赖 metric label。 |
| Domain purity | domain 不依赖 metric/log backend；埋点由 api/application/worker/jobs/infra boundary 注入。 |
| Gauge 语义 | gauge 只表达本地可读状态（freshness、availability、attempt state），不表达外部 delivered/observed/readiness。 |

## 7. 审计事件与本地事实表

本表的“审计事件”是已定义的 L2 local fact/ref/report/marker 形成点，不是新增公共
`AuditEvent` enum，也不是 L4 Observability event schema。

| 审计/事实形成点 | 触发位置 | 必须引用的字段 | 消费方 |
|---|---|---|---|
| `ToolContractEvolutionFact` | `CF-01~04` accepted UoW | `tool_id`, `from_revision`, `to_revision`, `change_kind`, `actor_ref`, `correlation_ref`, `basis_refs`, `committed_result_ref` | Contract queries, safe material mapper, bounded reports |
| `CapabilityBindingChangeFact` | `CF-05~07` accepted UoW | `tool_id`, `binding_ref`, optional successor, `from_state`, `to_state`, `actor_ref`, `correlation_ref`, `basis_refs` | Binding queries, safe material mapper, gap/report views |
| `CapabilityBindingAssessment` / `HubControlledSnapshot` | `IF-01`, `JF-01`, applicable Commands | `binding_ref`, authority/revision refs, assessment state, source summary ref, consumption time, gap refs | Binding/precondition Query, consistency Job |
| `InvocationAdmission` | `CF-08~09` accepted local decision | `invocation_ref`, anchor ref, decision state, basis refs, actor/correlation/time | Invocation/precondition Query |
| `ToolInvocationOutcome` + `ToolAuditEntry` pair | `CF-08` no-execution branch or `CF-11` accepted source | outcome ref/class, audit ref, invocation/anchor, judgment/source/gap refs, actor/correlation/time | `QF-06`, `OF-03`, safe-handoff source selector |
| `ExecutionRequirement` / authorization/readiness assessment | `CF-09` local consumption | invocation/anchor, requirement and assessment refs, source authority/revision, blocked/gap state, time | `QF-05`, `CF-10`, diagnostics |
| `ExecutionHandoff` + `ExecutionHandoffAttempt` | `CF-10` phase-1/phase-2 | handoff/attempt refs, requirement/auth/readiness refs, local state, correlation, local failure/unknown ref | `QF-05`, source intake, recovery owner |
| `SafeHandoffEligibility` + `SafeHandoffMaterial` | `CF-12` eligible branch | source class/refs, target class, four safety check results, material ref, correlation, prepared time | `OF-01~04`, safe-handoff Query |
| `ExternalSubmissionAttempt` | `OF-01~04` phase-1/phase-2 | material/event/target refs, local attempt state, local failure/locator/revision if valid, attempted time | `IF-04/05`, `JF-04`, `QF-06` |
| `ReferenceValidityAssessment` / `ConsistencyGap` | negative path, `CF-13`, `IF`, `JF`, `OF-04` | scope/subject refs, class/impact/state, basis, owner/decision refs, detection/resolution time | integrity Query, jobs, safe gap material |
| `ConsumerReceipt` | `IF-01~05` phase-2 completion | consumer/source event/dedup refs, disposition, local result refs, gap refs, correlation | worker replay/operations; not broker receipt |
| `ReferenceConsistencyReport` / D1 projection | `JF-02/03` target/report UoW | scope, source watermark, freshness/report state, output/gap refs, counts | Queries and operations; not subject truth |
| `BusDeliveryStatusRef` | `IF-04` / `JF-04` | attempt ref, Bus authority/status ref, safe summary, state, consumption time | `QF-06`; never upgrades local attempt |
| `ObservationMaterialRef` | `IF-05` / `JF-04` | attempt ref, Observation authority/material ref if formal, safe summary, state, time | `QF-06`; no Observation store/readiness claim |
| `JobReport` | `JF-01~04` final report UoW | job name/key, requested/processed watermark, disposition, safe counts, output/gap refs, cursor, correlation | job replay/operations; not run/evidence/signoff |
| `CommitStatusUnknown` diagnostic marker | any UoW commit resolution unknown | operation, transaction ref, idempotency key hash, resolution state, diagnostic ref | recovery/reconciliation only; no accepted truth |
| Config validation issue / adapter availability observation | `infra/config.rs` / `runtime_builder.rs` | config source/section, adapter slot/kind, issue/availability state, redacted diagnostic ref | startup operations; no business audit or readiness |

### 7.1 ToolAuditEntry 原子性和边界

`ToolAuditEntry` 必须由 `OutcomeAuditStore::insert_outcome_audit_pair` 与
`ToolInvocationOutcome` 在同一 local UoW 保存。`ToolAuditEntry` 的 `judgment_refs`、
`source_refs`、`known_gap_refs` 只能引用已定义的 typed refs；它不复制 result/error body，
不承载 `TraceContext` 的完整 span body，不变成 Bus history、Observation material、Sandbox
capture 或 Runtime checkpoint。若 pair 不完整、invocation/outcome/audit refs 不对称或
commit unknown，外部 Query 只能返回 integrity/unknown surface，不得返回“已审计成功”。

`ToolAuditEntry` 的 `correlation_ref` 与 `actor_ref` 来自原始 Command 或受信 Integration
source；domain 不重新推断 actor。duplicate replay 只记录 replay log/metric，不创建第二个
outcome/audit pair；late source material 追加新的 assessment/gap，不能覆盖 terminal pair。

### 7.2 Accepted 与非 accepted 观测规则

| 路径 | 必须有 | 不得有 |
|---|---|---|
| accepted Command truth | existing change fact/assessment/outcome/attempt 等 local fact + stored result；`CF-08/11` 另有 outcome/audit pair | 未提交的 accepted log、伪造 external success |
| deterministic rejected/blocked | error log、error metric、typed `ProtocolError` 或已定义 no-execution/error result | accepted `ToolAuditEntry`、outbox、delivery/observation claim |
| duplicate replay | replay log、idempotency metric、stored result/receipt/report | 第二次 domain transition、audit、outbox、external call |
| Query | query log/metric、结构化 surface | audit/outbox/idempotency/projection repair/ref refresh |
| Consumer accepted | local snapshot/assessment/ref/gap/receipt 与相关 metric/log | 外部 delivery ack、Broker DLQ truth、核心 subject mutation（IF-03 除外的正式 CF-11 re-entry） |
| Outbound continuation | prepared marker、one local attempt disposition、metric/log | delivered/observed/accepted-by-downstream claim；unknown 自动重调 |
| Job | bounded target result、projection/status/gap/report refs、metric/log | subject repair、scheduler/run/evidence/signoff truth |
| commit/call unknown | diagnostic/gap/manual-owner ref、error metric/log | committed/accepted/delivered 结论或 blind retry |

## 8. Redaction / forbidden-field 契约

| 材料 | 允许 | 永久禁止 |
|---|---|---|
| log/span attribute | operation/kind/state/result、typed safe refs、counts、duration、redacted diagnostic ref | raw request/query/event/job body、prompt、capture、provider response、HTTP/RPC body、SQL、stack trace、secret/token/credential |
| metric label | closed low-cardinality enum | actor/subject/request/trace/correlation/result/outbox/marker/source event/idempotency/dedup/payload digest/free text/endpoint/topic/secret |
| `ToolAuditEntry` | invocation/anchor/judgment/outcome/source/gap refs、actor/correlation/time | result/error/audit正文、external response、Sandbox body、Observation body、Runtime state |
| change fact/assessment/gap | typed basis/source/reason/state/ref/time | external owner body、prompt、capture、evidence alias、test result、acceptance signature |
| `ConsumerReceipt` / `JobReport` | event/job/ref/disposition/count/gap/output/cursor | payload/input dump、broker ack/receipt/DLQ、scheduler run/lease、adapter response |
| `ExternalSubmissionAttempt` / handoff attempt | material/event/handoff refs、local state、safe locator/failure/unknown ref | delivery/observed/executed/capture state、retry count、provider body、route credential |
| external status ref | authority/ref/status-safe-summary/state/time | external body、retention record、provider response、local delivered/observed truth |
| config issue | config source ref/section/adapter slot/issue ref | raw URL/topic/path, secret, credential, full config, endpoint health assertion |

任何实现若无法证明字段经过 typed redaction/forbidden-body guard，必须拒绝写入该观测面。
Fake 与 durable adapter 使用相同 redaction contract；fake 的安全输出只能证明 L2 mapping
行为，不证明外部 provider 或 route readiness。

## 9. `CF/QF/IF/OF/JF` flow 到观测闭环

| Flow family | 入口/完成日志 | 指标 | 业务审计/事实 | 关键禁止项 |
|---|---|---|---|---|
| `CF-01~04` contract | entry、authority resolution、validation、accepted/rejected、UoW | command total/duration、truth change、resolver、UoW、idempotency | `ToolContractEvolutionFact` 与 stored result；不新增通用 audit | duplicate 不重写 evolution/outbox；blocked 不造 authority truth |
| `CF-05~07` binding | entry、Hub resolution、CAS/conflict、accepted/blocked | command、resolver、version conflict、gap | `CapabilityBindingChangeFact`、snapshot/assessment/gap | 不改 Hub registry；不把 fake/endpoint 当 Hub readiness |
| `CF-08` invocation | admission validation、duplicate、pair commit/unknown | command、truth change、idempotency、UoW | Invocation/admission；no-execution 分支写 outcome/audit pair | rejected 不伪造 accepted outcome；pair 不可半写 |
| `CF-09` precondition | requirement/Port resolution、blocked/denied | command、external resolution、gap | requirement/authorization/readiness assessment；正式 deny/no-execution pair按 flow | 不生成 effective authorization/Sandbox truth |
| `CF-10` handoff | prepared、Port call、local disposition/unknown、phase-2 | command、external resolution、local attempt、UoW | `ExecutionHandoffAttempt` local marker | prepared 不等于 called；unknown 不重调；无 host fallback |
| `CF-11` source/outcome | source mapping、pair success/failure、late/conflict | command、external resolution、truth change、gap | `ExecutionSourceAssessment` + atomic `ToolInvocationOutcome`/`ToolAuditEntry` | capture 存在不等于 accepted；不生成 outcome from unverified source |
| `CF-12` safe handoff | four-gate check、material、continuation handoff | command、local attempt、gap、external resolution | eligibility/material；OF 另记 attempt | 不把 material 当 event delivery；不绕过 safety gate |
| `CF-13` gap resolution | pending、owner re-read、CAS resolve/supersede | command、gap、version conflict | `ConsistencyGap` state/fact and stored result | 不修复 subject truth；伪 evidence/签署禁止 |
| `QF-01~11` query | entry/completion/not-visible/stale/degraded/error | query total/duration、visibility、freshness | no-write;只读取已有 audit/fact/ref/report | 不写 audit/outbox/idempotency/repair，不调外部 Port |
| `IF-01` Hub clue | envelope/version、bounded reverse read、accepted/gap/duplicate | consumer、unsupported version、resolution、gap | Hub snapshot/assessment/gap + receipt | 不改 Binding relation，不把 clue 当 registry truth |
| `IF-02` Auth clue | envelope/source mismatch、blocked/accepted/duplicate | consumer、resolution、gap | reference assessment/gap + receipt | 不改 effective authorization 或旧 assessment |
| `IF-03` Sandbox source | envelope、CF-11 re-entry、receipt completion | consumer、command、resolution、UoW | CF-11 source/outcome/audit；Consumer receipt separately | 不直接写 outcome；不伪造 Sandbox mapping/receipt |
| `IF-04` Bus feedback | attempt read、feedback resolve、append/gap/receipt | consumer、external status、gap | `BusDeliveryStatusRef` + receipt | 不写 Delivered；不写 Bus store/ack truth |
| `IF-05` Observation feedback | attempt read、feedback resolve、append/gap/receipt | consumer、external status、gap | `ObservationMaterialRef` + receipt | 不写 Observed；不创建 Observability store |
| `OF-01~04` outbound | material/event symmetry、Prepared、one call、local terminal/unknown | continuation、external resolution、attempt gauge、gap | `ExternalSubmissionAttempt` + optional gap | 不声称 route/delivery/observation；Prepared/Unknown 不二次 call |
| `JF-01` binding consistency | bounded claim/target/report | job、item、resolver、gap | snapshots/assessments/gaps/JobReport | 不修 Binding、不能空集合隐式全扫 |
| `JF-02` reference integrity | target read/blocked/unverifiable/report | job、resolution、gap | reference assessments/gaps/report | 不创造 Core authority query，不把 report 当 subject health |
| `JF-03` derived view | rebuild start/item/write/result/report | job、projection freshness/rebuild | projection write result/report | 不改 Contract/Binding/Invocation/Outcome/Audit |
| `JF-04` status refresh | explicit/ bounded scan、fresh skip、one feedback call、append/report | job、external status、gap、UoW | Bus/Observation refs + report | Bus/Observation 独立；不升级 local attempt；不重调 unknown |

## 10. 前序 Step 6~14 cross-step audit

| 审计项 | 结果 | 依据与剩余边界 |
|---|---|---|
| `ToolAuditEntry` fields/source/atomic pair | pass | Step 6 outcome annex、Step 11 `insert_outcome_audit_pair`；half pair 只返回 integrity surface。 |
| TraceContext 单一来源 | pass | Step 8 shared carriers；Command/Query/Event/Job metadata 传播，domain 不生成。 |
| 37 flow 观测覆盖 | pass | §9 逐 family/flow 回指全部 `13/11/5/4/4`；无新增 flow。 |
| accepted/rejected/duplicate/no-write fence | pass | Step 9/11/12/13 与本文件 §7.2 一致。 |
| external status/handoff boundary | pass | Step 6/9/11；local attempt、Bus ref、Observation ref 独立。 |
| config/adapter redaction | pass | Step 14 typed refs 与本文件 §8；raw config/secret forbidden。 |
| low-cardinality metrics | pass | §6.1 禁止高基数和敏感标签。 |
| L4-observability integration | pass with blocker | 仅保留 body-free handoff/status seam；`L2T-UP-005~006` 未关闭，不声明 producer/route/readiness。 |
| no accidental owner expansion | pass | 未新增 Observability Store、AuditLedger、Bus delivery、Sandbox run 或 SDK client。 |
| test handoff | pending Step 16 | 本 Step 给出埋点和 redaction predicates，具体测试切口下 Step 16。 |

## 11. 正式 §5.14 回填草稿

正式 `03-详细设计.md` §14 应整体回填本文件 §4~§9，至少包含：

- 日志埋点表与字段级 redaction/level 规则。
- 指标表与低基数标签禁用清单。
- 审计/事实形成点与 `ToolAuditEntry` 原子性。
- TraceContext/span 传播、external status ref 和 handoff attempt 分层。
- `CF/QF/IF/OF/JF` 观测闭环与 Query no-write、duplicate、unknown fence。

正式文档不得把本 Step 的 blocker、fake、日志或 metric 记录写成 provider readiness、
delivery/observed truth、真实测试结果、run_id、evidence alias 或验收签署。

## 12. Blocker / 待确认事项

| ID | 状态 | 影响 | 未确认前处理 |
|---|---|---|---|
| `L2T-UP-001` | open | Authorization owner/source/taxonomy；影响 CF-09/IF-02/JF-02 观测分类 | 记录 blocked/unavailable/unknown，不写 allow/deny owner truth。 |
| `L2T-UP-002` | open | Sandbox policy/high-risk taxonomy；影响 CF-09/CF-10 | 只记录 typed assessment/gap/error kind，不记录 policy truth。 |
| `L2T-UP-003` | open | Sandbox generic mapping；影响 CF-10/CF-11 | 记录 mapping-blocked/unknown，不记录 execution accepted/capture。 |
| `L2T-UP-004` | open | Sandbox receipt/dead-letter handoff；影响 CF-10/JF-04/OF | 只记录 local attempt/unknown marker，不记录 receipt/delivery。 |
| `L2T-UP-005` | open | Observability producer/source family；影响 IF-05/JF-04/OF-03 | `ObservationMaterialRef::RouteBlocked/Unknown`，不创建观察存储。 |
| `L2T-UP-006` | open | Observability formal-chain/status conflict | 不把当前日志/marker 当 readiness；保留 status gap。 |
| `L2T-UP-007` | open | workspace baseline 未冻结 | 不声称 implementation/test evidence；日志只记录当前 typed refs。 |
| `L2T-UP-008` | open | Core tools-specific shared schema | 不复制 Core 类型；记录 candidate/blocked。 |
| `L2T-UP-009` | open | SDK tools-specific client seam | 仅允许 guidance/query surface，不记录 client readiness。 |

## 13. Stop review 与 Step 16 handoff

| Gate | 结论 |
|---|---|
| 日志埋点覆盖 entry、flow、Store/UoW、Port、Job、config 与错误分支 | pass |
| 指标覆盖关键路径且无高基数/敏感标签 | pass |
| `ToolAuditEntry` 与 outcome 同 UoW，其他事实有唯一 owner | pass |
| TraceContext、span、external status、handoff marker 分层明确 | pass |
| Query no-write、duplicate replay、unknown/blocked 不伪造 accepted/delivered/observed | pass |
| raw body/secret/provider response/stack trace 在所有面禁止 | pass |
| 未写告警阈值、SLO、dashboard、backend、runbook 或真实 evidence | pass |
| 上游 blocker 状态 | unchanged: `L2T-UP-001~009` open |
| 下一步 | Step 16「测试切口与最小验证清单」；正式 03 仍 write-closed。 |

```text
step_status = completed
gate_status = pass
gate_reason = all required log, metric, trace, ToolAuditEntry, fact/ref/report, redaction and flow-closure cuts are implementation-addressable without adding an observability store or claiming external readiness
next_allowed_action = create_step_16_test_cuts
formal_03_write_allowed = false
formal_document_write_allowed = false
next_formal_document_allowed = false
commit_required = false
```
