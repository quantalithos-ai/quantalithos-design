# Step 15. 可观测性与审计埋点契约

> 对应 SOP: `standards/document/详细设计讨论流程_SOP.md` Step 15

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 15 可观测性与审计埋点契约 |
| 当前状态 | 已完成;待用户审查 |
| 输入基线 | 需求、架构、概要、Step 1~14 详细设计校准文档 |
| 输出文件 | `projects/L1-governance/design-calibration/03_ddd_step_15_observability_audit.md` |
| 停审方式 | 按 SOP 问题、日志表、指标表、审计事件表、trace / handoff / redaction 规则分批写入;完成后做跨 Step 6~14 闭环审计 |

## 2. 本步目标

本 Step 定义 Governance 实现必须暴露的结构化日志、指标、trace 和审计事件切口,让后续实现者能够 1:1 判断:

- 每类 command、query、consumer、publisher、job、repository、adapter 和 config validation 应在什么位置打日志。
- 哪些路径需要计数、耗时、状态类指标,以及指标标签允许使用哪些低基数字段。
- 哪些 accepted truth change、consumer marker、operations marker、publication state、projection state、reference state、handoff/export marker 和 reconciliation report 必须形成可追溯审计。
- `GovernanceTraceRecord`、`GovernanceAuditTrail`、history record、outbox record、job report、handoff marker 与 runtime log / metric 的边界。
- 哪些错误分支只写 runtime log / metric,不得伪造成 accepted audit / trace / outbox。
- 哪些正文、secret、外部响应、payload、包体和 debug dump 永远不得进入日志、指标、审计、trace、marker 或 diagnostic。

本步不定义告警阈值、SLO、dashboard、采样率、日志保留周期、观测后端产品、pager 值班流程、人工恢复 runbook、生产 endpoint 健康阈值或 secret 管理方案。这些由运维手册、配置设计或部署文档承接。

## 3. 本步输入

| 输入 | 状态 | 本 Step 用途 |
|---|---|---|
| `03_ddd_step_06_object_contracts.md` | 已完成 | 固定 `GovernanceTraceRecord`、`GovernanceAuditTrail`、history record、`GovernanceOutboxRecord`、`GovernanceHandoffMarker`、job report、infra entry 和 forbidden body 边界 |
| `03_ddd_step_07_trait_port_adapter_contracts.md` | 已完成 | 固定 trace、audit history、outbox、projection、reference、handoff、publisher、stored result、UoW、Clock、IdGenerator 和 adapter port 的打点位置 |
| `03_ddd_step_08_protocol_contracts.md` | 已完成 | 固定 22 个 Command、14 个 Query、9 个 Inbound Consumer、13 个 Outbound Event、7 个 Operations Job 的协议字段和 receipt / report surface |
| `03_ddd_step_09_function_flows.md` | 已完成 | 固定 command accepted transaction、query no-write、consumer accepted write、outbox publish、maintenance job、handoff/export flow 的顺序 |
| `03_ddd_step_10_state_matrix.md` | 已完成 | 固定状态转换、terminal state、not-visible/degraded/unsupported/dead-letter/retry 的状态含义 |
| `03_ddd_step_11_persistence_transaction_consistency.md` | 已完成 | 固定 trace/audit/outbox/projection/reference/result 的事务、append-only、optimistic version 和 payload snapshot 一致性 |
| `03_ddd_step_12_error_recovery.md` | 已完成 | 固定 rejected path、commit unknown、rollback failure、unsupported version、adapter failure、handoff/export failure 的恢复口径 |
| `03_ddd_step_13_concurrency_idempotency.md` | 已完成 | 固定 duplicate replay、idempotency conflict、job reentry、publication retry、commit unknown 对账的观测切口 |
| `03_ddd_step_14_config_external_binding.md` | 已完成 | 固定 config validation、adapter availability、publisher/handoff/export target binding 和 raw config 禁止边界 |

## 4. 分批写入计划

| 批次 | 内容 | 状态 |
|---|---|---|
| 15.1 | 文件骨架、SOP 问题回答、当前文档诊断和总原则 | [x] 已写入 |
| 15.2 | 日志埋点表、日志字段规则和错误分支日志口径 | [x] 已写入 |
| 15.3 | 指标埋点表、低基数标签规则和关键路径指标口径 | [x] 已写入 |
| 15.4 | 审计事件表、trace/audit/history/outbox/handoff 绑定规则 | [x] 已写入 |
| 15.5 | 安全边界、禁止字段、前序闭环审计、回填草稿和进入下一步条件 | [x] 已写入 |

## 5. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 哪些处理流必须记录审计? | 所有 accepted Governance truth change 必须追加 `GovernanceTraceRecord`、更新或创建 `GovernanceAuditTrail`、按模块追加对应 history record、同事务 append `GovernanceOutboxRecord` 和 stored result。Inbound consumer 只在 accepted 写本地 snapshot / reference state / pending marker / stale marker / receipt 时写 consumer marker trace 或 stored receipt。Operations job 只对 outbox publication state、projection state、reference state、reconciliation report、handoff/export marker 和 job report 写 operations audit。Query 不写业务 audit。 |
| 哪些错误分支必须记录日志? | API / worker / job validation reject、domain reject、not visible、not found、version conflict、unique conflict、idempotency duplicate / conflict / in-flight / result missing、resolver unavailable、forbidden body detected、unsupported event version、consumer delayed / rejected、publisher failed / dead-lettered、projection rebuild failed、reference refresh failed、handoff/export failed、UoW commit unknown、rollback failed、config validation rejected 和 adapter unavailable 都必须记录结构化日志。 |
| 哪些关键路径需要指标? | Command、Query、Inbound Consumer、Outbound Publisher、Operations Job、repository/UoW、idempotency、reference resolver、projection freshness/rebuild、outbox publication、handoff/export、reconciliation、config validation 和 adapter availability 需要 counter / histogram / gauge 指标。 |
| 日志、指标、审计字段分别记录什么? | 日志记录 `trace_context_ref`、request/event/job ref、operation、actor ref、subject ref、safe source ref、status/disposition、error kind、diagnostic ref、result/report/marker ref、duration 和 count。指标只记录低基数 label,例如 operation kind、result、error kind、event kind、job kind、view kind、adapter kind、freshness state。审计记录 committed truth / trace / history / outbox / marker / report refs、from/to state、reason ref、source cursor、actor ref 和 trace context。 |
| 哪些监控和告警细节应留给运维手册? | 告警阈值、SLO、dashboard、采样率、日志保留、指标后端、trace backend、pager escalation、人工修复 runbook、生产 adapter endpoint 健康阈值、secret redaction 实现细节和部署级 topic/endpoint 名称留给运维或配置文档。本 Step 只定义代码必须暴露的埋点切口和字段边界。 |

## 6. 当前文档问题诊断

| 位置 | 当前问题 | 本步处理 |
|---|---|---|
| Step 6 trace / audit / history | 对象已经闭合,但未说明 runtime log / metric 应在何处记录 | 本 Step 区分业务审计对象与运行观测埋点 |
| Step 7 repository / adapter ports | 已定义写入面,但没有固定 repository / adapter error 的日志和指标字段 | 本 Step 给出 repository、UoW、resolver、publisher、handoff/export port 的打点规则 |
| Step 8 protocol | Command / Query / Event / Job 协议已闭合,但缺少入口级日志、指标、receipt/report 观测口径 | 本 Step 按 API、worker、job 三类入口固定埋点 |
| Step 9 flow | 每条 flow 已定义 truth/trace/audit/outbox/stale/result 顺序,但实现侧仍可能漏掉错误路径观测 | 本 Step 把 accepted / rejected / duplicate / delayed / failed 分支拆成日志、指标、审计表 |
| Step 12 error recovery | 错误恢复规则已定义,但 runtime 可定位字段未统一 | 本 Step 规定每类 error 至少记录 error kind、safe diagnostic ref 和关联 ref |
| Step 13 idempotency | duplicate replay 和 commit unknown 已闭合,但观测切口需要显式化 | 本 Step 规定 duplicate 不新增业务 trace/outbox,但必须写 replay 日志和幂等指标 |
| Step 14 config binding | adapter/config binding 已闭合,但 config validation 与 adapter availability 观测字段未汇总 | 本 Step 固定 config validation / adapter availability log 和 metric |

## 7. 设计取舍

| 议题 | 方案 | 取舍 |
|---|---|---|
| 业务审计载体 | A. 另建 observability ledger;B. 使用 `GovernanceTraceRecord`、`GovernanceAuditTrail`、history record、marker 和 report refs | 采用 B。Governance 不拥有 L4 observability ledger body |
| runtime log 与 trace record | A. 只写日志;B. accepted truth change 同时写 trace/audit/history/outbox | 采用 B。日志不可替代业务可追溯性 |
| rejected command | A. 写 failed business trace;B. 只写 structured log / metric / stored rejected result | 采用 B。rejected transition 不得伪造成 accepted truth trace |
| Query 审计 | A. 每次读都写 audit;B. Query no-write,只记录日志和指标 | 采用 B。保持 Step 9 query no-write |
| 指标标签 | A. 把 subject/ref/id 都放 label;B. 只用低基数类别,label 外定位走日志/trace/ref | 采用 B。避免高基数和敏感信息泄露 |
| 外部 adapter failure | A. 保存 adapter error body;B. 保存 redacted failure ref / diagnostic ref | 采用 B。外部正文和 stack trace 不进入 Governance |
| handoff/export | A. marker 保存 package / document body;B. marker 只保存 package/ref/receipt/failure refs | 采用 B。package/body 属于下游系统 |

## 8. 可观测性与审计总原则

| 规则 | 正式口径 |
|---|---|
| Command accepted | 同一 `GovernanceUnitOfWork` 内保存 truth、history、`GovernanceTraceRecord`、`GovernanceAuditTrail`、`GovernanceOutboxRecord`、projection stale marker 和 stored result;同时记录 command success 日志和指标 |
| Command rejected | 不保存 truth/history/accepted trace/outbox/projection stale;返回 protocol/domain error 或 stored rejected result;记录 warn/error 日志和 error 指标 |
| Duplicate replay | same key same digest duplicate 读取 stored result/report/receipt;不得重跑 domain transition、consumer mutation 或 job body;记录 replay 日志和幂等指标 |
| Idempotency conflict | same key different digest 不写业务对象;记录 conflict 日志、指标和 redacted issue ref |
| Query | 只读;不得写 audit、outbox、idempotency、projection repair、reference refresh 或 trace repair;可记录 query 日志和指标 |
| Inbound consumer accepted | 只写本地 snapshot/reference/pending marker/stale marker/receipt;如 Step 9 要求 trace marker,通过 `GovernanceTraceRecord::from_marker(...)` 写 trace;不得写 core Governance truth |
| Unsupported event version | 不解析 payload、不写 snapshot、不 mark stale、不写 accepted trace;返回 unsupported receipt;记录 warn 日志和 counter |
| Outbox publisher | 只发布 stored payload snapshot;发布成功/失败只更新 outbox publication state 和 job report;不得回查 current truth 重新构造 payload |
| Maintenance job | 只维护 projection/reference/reconciliation/report/outbox/handoff/export surface;不得修复 business truth |
| Handoff/export | 保存 marker refs、package refs、receipt refs、failure refs 和 report refs;不得保存 observability ledger body、archive package body 或 external GRC document body |
| Diagnostic | 只能记录 stable error code、safe summary、supporting refs 和 redacted diagnostic ref;不得保存 raw request/payload/response/secret/stack trace |

## 9. 日志埋点表

| 位置 | 日志级别 | 字段 | 目的 |
|---|---|---|---|
| API command handler entry | `info` | `trace_context_ref`, `request_ref`, `command_kind`, `actor_ref`, `idempotency_key_hash` | 追踪写入口和幂等 key fingerprint |
| API command metadata / body validation rejected | `warn` | `trace_context_ref`, `request_ref`, `command_kind`, `error_kind`, `validation_issue_ref`, `diagnostic_ref` | 定位缺 metadata、actor、idempotency、body limit 或 forbidden body |
| Command idempotency reserved | `debug` | `trace_context_ref`, `command_kind`, `idempotency_key_hash`, `reservation_state` | 排查 first-run / in-flight 进入点 |
| Command idempotency duplicate replay | `info` | `trace_context_ref`, `command_kind`, `idempotency_key_hash`, `result_ref` | 证明使用 stored result,没有重跑 domain transition |
| Command idempotency conflict / in-flight | `warn` | `trace_context_ref`, `command_kind`, `idempotency_key_hash`, `reservation_state`, `conflict_ref` | 定位 same key different digest 或并发处理中 |
| Command accepted truth change | `info` | `trace_context_ref`, `command_kind`, `actor_ref`, `subject_ref`, `truth_change_ref`, `trace_record_ref`, `outbox_ref`, `result_ref`, `duration_ms` | 串联 truth、trace、audit、outbox 和 result |
| Command domain rejected | `warn` | `trace_context_ref`, `command_kind`, `actor_ref`, `subject_ref`, `domain_error_kind`, `reason_ref`, `diagnostic_ref` | 区分业务拒绝与系统失败 |
| Command not visible / capability denied | `warn` | `trace_context_ref`, `command_kind`, `actor_ref`, `scope_ref`, `visibility_marker_ref`, `error_kind` | 追踪授权和可见性拒绝 |
| Version or unique conflict | `warn` | `trace_context_ref`, `operation`, `repository_kind`, `subject_ref`, `expected_version`, `error_kind` | 排查 optimistic concurrency 和唯一约束冲突 |
| UoW begin / commit failed | `error` | `trace_context_ref`, `operation`, `request_or_job_ref`, `uow_phase`, `error_kind`, `diagnostic_ref` | 定位事务失败和 commit unknown |
| UoW rollback failed | `error` | `trace_context_ref`, `operation`, `request_or_job_ref`, `error_kind`, `diagnostic_ref` | 触发人工介入和对账 |
| Query handler completion | `info` / `debug` | `trace_context_ref`, `request_ref`, `query_kind`, `actor_ref`, `surface_kind`, `result_status`, `duration_ms` | 追踪读面成功、empty、not-visible、degraded、stale |
| Query not visible | `info` | `trace_context_ref`, `query_kind`, `actor_ref`, `read_subject_ref`, `visibility_marker_ref` | 说明 body-free not-visible surface |
| Query degraded / stale / projection missing | `warn` | `trace_context_ref`, `query_kind`, `view_kind`, `freshness_state`, `degraded_marker_ref`, `source_cursor` | 解释 projection/read model 降级 |
| Inbound consumer envelope validation rejected | `warn` | `trace_context_ref`, `consumer_name`, `source_family`, `source_event_ref`, `event_version`, `validation_issue_ref` | 定位坏 envelope,不进入业务写 |
| Inbound consumer unsupported version | `warn` | `trace_context_ref`, `consumer_name`, `source_event_ref`, `event_version`, `supported_version_set_ref`, `worker_issue_ref` | 证明未解析 payload、未写 snapshot |
| Inbound consumer accepted | `info` | `trace_context_ref`, `consumer_name`, `source_event_ref`, `source_ref`, `reference_state_ref`, `affected_view_count`, `result_ref`, `trace_record_ref_optional` | 追踪 snapshot/reference/stale/receipt 成功 |
| Inbound consumer duplicate replay | `info` | `trace_context_ref`, `consumer_name`, `source_event_ref`, `dedup_key_hash`, `result_ref` | 证明不重写 snapshot/stale marker |
| Inbound consumer delayed / rejected | `warn` | `trace_context_ref`, `consumer_name`, `source_event_ref`, `disposition`, `error_kind`, `worker_issue_ref` | 排查上游不可用或 payload boundary 违规 |
| External source resolver success | `debug` | `trace_context_ref`, `resolver_kind`, `source_ref`, `source_version_ref`, `snapshot_ref`, `duration_ms` | 追踪 body-free resolution |
| External source resolver unavailable / rejected | `warn` | `trace_context_ref`, `resolver_kind`, `source_ref`, `adapter_kind`, `error_kind`, `retryable`, `diagnostic_ref` | 支撑 delayed、failed reference 或 command reject |
| Outbox append helper completion | `debug` | `trace_context_ref`, `event_kind`, `subject_ref`, `outbox_ref`, `payload_snapshot_ref` | 验证 accepted transaction 已持久化 payload snapshot |
| Outbox publisher scanned | `info` | `trace_context_ref`, `job_run_id`, `event_kind`, `scanned_count`, `pending_count` | 追踪 publish job 扫描范围 |
| Outbox publish success | `info` | `trace_context_ref`, `job_run_id`, `outbox_ref`, `event_kind`, `publication_ref`, `duration_ms` | 证明 published marker 来源 |
| Outbox publish retryable failure | `warn` | `trace_context_ref`, `job_run_id`, `outbox_ref`, `event_kind`, `failure_reason_ref`, `retryable` | 追踪 failed publication state |
| Outbox dead-letter | `error` | `trace_context_ref`, `job_run_id`, `outbox_ref`, `event_kind`, `dead_letter_reason_ref`, `report_ref` | 触发人工介入和 downstream 修复 |
| Projection stale marker saved | `info` | `trace_context_ref`, `view_ref`, `view_kind`, `freshness_state`, `source_cursor`, `reason_ref` | 追踪派生视图 stale 来源 |
| Projection rebuild start / finish | `info` | `trace_context_ref`, `job_run_id`, `view_kind`, `scope_ref`, `changed_count`, `failed_count`, `report_ref`, `duration_ms` | 追踪 projection maintenance |
| Projection rebuild failed | `warn` / `error` | `trace_context_ref`, `job_run_id`, `view_kind`, `scope_ref`, `failure_reason_ref`, `report_ref` | 解释 query degraded / failed view |
| Reference refresh item success | `info` | `trace_context_ref`, `job_run_id`, `reference_ref`, `adapter_kind`, `resolution_state`, `snapshot_ref`, `duration_ms` | 追踪 external reference refresh |
| Reference refresh item failed | `warn` | `trace_context_ref`, `job_run_id`, `reference_ref`, `adapter_kind`, `failure_reason_ref`, `last_successful_snapshot_ref` | 解释 unresolved/unavailable state |
| Reconciliation report generated | `info` | `trace_context_ref`, `job_run_id`, `scope_ref`, `report_ref`, `finding_count`, `view_count`, `outbox_count` | 记录 drift evidence |
| Reconciliation failed report saved | `warn` / `error` | `trace_context_ref`, `job_run_id`, `scope_ref`, `report_ref`, `failure_reason_ref` | 保留失败对账 surface |
| Trace handoff prepared / delivered | `info` | `trace_context_ref`, `job_run_id`, `handoff_kind`, `target_ref`, `marker_ref`, `package_ref`, `receipt_ref_optional`, `duration_ms` | 追踪 L4 observability / archive handoff 成功 |
| Trace/archive/external GRC handoff failed | `warn` / `error` | `trace_context_ref`, `job_run_id`, `handoff_kind`, `target_ref`, `marker_ref`, `failure_reason_ref`, `report_ref` | 排查 adapter failure,不保存 package/document body |
| External GRC export disabled / target rejected | `warn` | `trace_context_ref`, `job_run_id`, `target_ref`, `config_ref`, `validation_issue_ref` | 说明 export 未执行且不影响 Governance truth |
| Operations job duplicate replay | `info` | `trace_context_ref`, `job_kind`, `job_run_id`, `idempotency_key_hash`, `result_ref`, `report_ref` | 证明 duplicate 未重跑 job body |
| Operations job summary | `info` | `trace_context_ref`, `job_kind`, `job_run_id`, `disposition`, `item_count`, `changed_count`, `failed_count`, `report_ref`, `duration_ms` | 汇总后台维护结果 |
| Runtime config validation rejected | `error` | `config_source_ref`, `config_section`, `adapter_slot`, `validation_issue_ref`, `diagnostic_ref` | 防止 raw config/secret/forbidden feature 越界 |
| Adapter availability changed | `warn` / `info` | `adapter_slot`, `adapter_kind`, `availability_state`, `failure_ref_optional`, `checked_at` | 支撑外部依赖健康判断 |

### 9.1 日志字段规则

| 字段规则 | 正式要求 |
|---|---|
| `trace_context_ref` | 来自 command/query/event/job metadata 中的 `TraceContext`;日志可记录其 stable ref / correlation id,不得重新生成替代上下文 |
| `*_key_hash` | idempotency key、dedup key 只允许记录 one-way hash 或 redacted fingerprint,不得记录 caller supplied raw key |
| `diagnostic_ref` | 指向 redacted diagnostic / validation issue;不得把 raw stack trace、HTTP body、SQL、adapter response body 写入日志 |
| `subject_ref` | 只记录 body-free ref;不得附带 process/work/artifact/method/runtime/conversation/observability/archive/external GRC 正文 |
| `duration_ms` | 由 application/handler/worker/job boundary 记录;domain object 不读取 clock |
| log level | validation/domain/idempotency conflict 使用 `warn`;repository unavailable、commit unknown、rollback failure、dead-letter、config reject 使用 `error`;正常 accepted / duplicate replay / job summary 使用 `info`;resolver success 等高频细节可用 `debug` |

## 10. 指标埋点表

| 指标 | 类型 | 打点位置 | 标签 |
|---|---|---|---|
| `governance_command_total` | counter | command handler 返回前 | `command_kind`, `result`, `error_kind` |
| `governance_command_duration_ms` | histogram | command handler 包裹 application service | `command_kind`, `result` |
| `governance_command_truth_change_total` | counter | accepted truth change 保存后 | `truth_change_kind`, `subject_kind` |
| `governance_query_total` | counter | query handler 返回前 | `query_kind`, `surface_kind`, `freshness_state` |
| `governance_query_duration_ms` | histogram | query handler 包裹 query service | `query_kind`, `surface_kind` |
| `governance_visibility_decision_total` | counter | `ReadVisibilityPolicy.evaluate_*` 返回后 | `query_or_command_kind`, `decision` |
| `governance_idempotency_total` | counter | reserve / duplicate / complete / conflict / result-missing 后 | `operation_group`, `reservation_result` |
| `governance_uow_total` | counter | UoW begin / commit / rollback 返回后 | `phase`, `result` |
| `governance_repository_error_total` | counter | repository / UoW error 映射时 | `repository_kind`, `error_kind` |
| `governance_version_conflict_total` | counter | optimistic version conflict 映射时 | `repository_kind`, `resource_kind` |
| `governance_inbound_event_total` | counter | inbound consumer 返回前 | `consumer_name`, `source_family`, `disposition` |
| `governance_inbound_event_duration_ms` | histogram | worker 包裹 consumer service | `consumer_name`, `disposition` |
| `governance_unsupported_event_version_total` | counter | unsupported version receipt 形成后 | `consumer_name`, `source_family` |
| `governance_reference_resolution_total` | counter | resolver / refresh item 完成后 | `resolver_kind`, `adapter_kind`, `result` |
| `governance_reference_resolution_duration_ms` | histogram | resolver / refresh item 调用外部 adapter 前后 | `resolver_kind`, `adapter_kind`, `result` |
| `governance_reference_state_total` | gauge | reference state 保存后或 refresh scan 后 | `reference_kind`, `resolution_state` |
| `governance_outbox_pending_total` | gauge | outbox publish job scan 后 | `event_kind`, `publication_state` |
| `governance_outbox_publish_total` | counter | 每条 outbox publish 完成后 | `event_kind`, `result` |
| `governance_outbox_publish_duration_ms` | histogram | publisher port 调用前后 | `event_kind`, `result` |
| `governance_outbox_dead_letter_total` | counter | outbox 进入 dead-letter 后 | `event_kind`, `dead_letter_kind` |
| `governance_projection_freshness_total` | gauge | projection state 保存或 query 读取后 | `view_kind`, `freshness_state` |
| `governance_projection_rebuild_total` | counter | rebuild item 完成后 | `view_kind`, `result` |
| `governance_projection_rebuild_duration_ms` | histogram | rebuild job item 前后 | `view_kind`, `result` |
| `governance_reconciliation_total` | counter | reconciliation report 保存后 | `result_state` |
| `governance_reconciliation_findings_total` | counter | reconciliation report 生成后 | `finding_kind`, `severity` |
| `governance_handoff_total` | counter | trace/archive handoff marker 保存后 | `handoff_kind`, `target_kind`, `result` |
| `governance_handoff_duration_ms` | histogram | handoff/archive/export port 调用前后 | `handoff_kind`, `target_kind`, `result` |
| `governance_external_grc_export_total` | counter | external GRC export job item 完成后 | `target_kind`, `result` |
| `governance_job_total` | counter | operations job 返回前 | `job_kind`, `disposition` |
| `governance_job_duration_ms` | histogram | job runner 包裹 application service | `job_kind`, `disposition` |
| `governance_job_item_total` | counter | job item loop 每项完成后 | `job_kind`, `item_result` |
| `governance_config_validation_total` | counter | runtime config validation 后 | `config_section`, `result` |
| `governance_adapter_availability_total` | gauge | adapter registry / health check 保存后 | `adapter_slot`, `adapter_kind`, `availability_state` |

### 10.1 指标标签规则

| 规则 | 正式要求 |
|---|---|
| 低基数 | 标签只能使用 kind / state / result / disposition / error category / adapter kind / source family 等有限集合 |
| 禁止高基数 | request ref、actor ref、subject ref、trace id、result ref、outbox id、marker ref、source event id、idempotency key、dedup key、payload digest、free text 不得作为 metric label |
| 禁止敏感值 | secret、token、credential、raw endpoint、transport topic、SQL、HTTP status body、adapter response body 不得作为 metric label |
| 关联定位 | 单记录定位通过 structured log、trace record、audit trail、report ref 或 diagnostic ref 完成,不通过 metric label 完成 |
| domain 无指标依赖 | domain object 不直接依赖 metric backend;指标由 handler/application/worker/job/infra boundary 记录 |

## 11. 审计事件表

| 审计事件 | 触发位置 | 记录字段 | 消费方 |
|---|---|---|---|
| `GovernanceContextAcceptedAudit` | `CreateGovernanceContextFlow` accepted transaction 提交后 | `trace_record_ref`, `audit_trail_ref`, `actor_ref`, `context_ref`, `subject_ref`, `source_cursor`, `outbox_ref`, `result_ref` | trace query / dashboard / archive / downstream |
| `GovernanceInputStateChangedAudit` | `SubmitGovernanceInputFlow` / `UpdateGovernanceInputStateFlow` accepted 后 | `trace_record_ref`, `audit_trail_ref`, `actor_ref`, `input_ref`, `from_state`, `to_state`, `reason_ref`, `outbox_ref`, `result_ref` | trace query / context views |
| `GovernanceGateOpenedAudit` | `OpenGovernanceGateFlow` accepted 后 | `trace_record_ref`, `audit_trail_ref`, `actor_ref`, `gate_ref`, `context_ref`, `required_responsibility_ref`, `outbox_ref`, `result_ref` | decision views / downstream |
| `GovernanceDecisionRecordedAudit` | `RecordGovernanceDecisionFlow` / `SupersedeGovernanceDecisionFlow` accepted 后 | `trace_record_ref`, `decision_record_ref`, `actor_ref`, `decision_ref`, `gate_ref`, `from_state`, `to_state`, `outcome_ref`, `reason_ref`, `outbox_ref` | trace query / policy conflict / archive |
| `ApprovalResponsibilityChangedAudit` | `OpenGovernanceGateFlow` requirement path / `AssignApprovalResponsibilityFlow` / `RecordApprovalVoteFlow` / `DelegateApprovalResponsibilityFlow` accepted 后 | `trace_record_ref`, `responsibility_record_ref`, `actor_ref`, `responsibility_ref`, `chain_ref`, `from_state`, `to_state`, `vote_optional`, `outbox_ref` | decision views / downstream |
| `PolicyEffectiveFactChangedAudit` | `ActivatePolicyEffectiveFactFlow` / `UpdatePolicyEffectiveFactStateFlow` accepted 后 | `trace_record_ref`, `policy_record_ref`, `actor_ref`, `policy_fact_ref`, `scope_ref`, `from_state`, `to_state`, `policy_snapshot_ref`, `outbox_ref` | policy effective views / downstream |
| `SharedRuleSetChangedAudit` | `UpdateSharedRuleSetFlow` accepted 后 | `trace_record_ref`, `policy_record_ref`, `actor_ref`, `rule_set_ref`, `scope_ref`, `from_state`, `to_state`, `changed_rule_refs`, `outbox_ref` | policy views / archive |
| `PolicyConflictChangedAudit` | `ResolvePolicyConflictFlow` accepted 后 | `trace_record_ref`, `policy_record_ref`, `actor_ref`, `conflict_ref`, `scope_ref`, `from_state`, `to_state`, `resolution_ref`, `outbox_ref` | decision views / dashboard |
| `ControlApplicabilityChangedAudit` | `AssessControlApplicabilityFlow` accepted 后 | `trace_record_ref`, `control_record_ref`, `actor_ref`, `applicability_ref`, `context_ref`, `from_state`, `to_state`, `control_snapshot_ref`, `outbox_ref` | control coverage views |
| `ControlReviewChangedAudit` | `RecordControlReviewFlow` accepted 后 | `trace_record_ref`, `control_record_ref`, `actor_ref`, `review_ref`, `applicability_ref`, `from_state`, `to_state`, `decision_ref_optional`, `outbox_ref` | compliance / nonconformity views |
| `ComplianceConclusionChangedAudit` | `SubmitAIIAConclusionFlow` / `SubmitSoAConclusionFlow` / `ApproveComplianceConclusionFlow` accepted 后 | `trace_record_ref`, `compliance_record_ref`, `actor_ref`, `conclusion_ref`, `context_ref`, `from_state`, `to_state`, `artifact_ref`, `decision_ref_optional`, `outbox_ref` | compliance views / archive |
| `NonconformityChangedAudit` | `RaiseNonconformityFlow` / `ConfirmNonconformityCauseFlow` accepted 后 | `trace_record_ref`, `nonconformity_record_ref`, `actor_ref`, `nonconformity_ref`, `context_ref`, `from_state`, `to_state`, `cause_ref_optional`, `outbox_ref` | nonconformity views / archive |
| `CorrectiveActionChangedAudit` | `PlanCorrectiveActionFlow` / `CompleteCorrectiveActionFlow` accepted 后 | `trace_record_ref`, `nonconformity_record_ref`, `actor_ref`, `corrective_action_ref`, `nonconformity_ref`, `from_state`, `to_state`, `reason_ref`, `outbox_ref` | nonconformity views |
| `VerificationRecordedAudit` | `VerifyNonconformityFlow` accepted 后 | `trace_record_ref`, `nonconformity_record_ref`, `actor_ref`, `verification_ref`, `nonconformity_ref`, `verification_state`, `closure_state_optional`, `outbox_ref` | compliance / archive |
| `InboundReferenceSnapshotChangedAudit` | inbound consumer accepted 保存 snapshot/reference state 后 | `trace_record_ref_optional`, `source_event_ref`, `consumer_name`, `reference_ref`, `reference_state_ref`, `snapshot_ref_optional`, `affected_view_refs`, `result_ref` | operations / projection rebuild |
| `InboundEventRejectedAudit` | worker 形成 rejected / unsupported / delayed receipt 后 | `source_event_ref`, `consumer_name`, `disposition`, `worker_issue_refs`, `diagnostic_ref` | operations;not business trace |
| `OutboxPublicationAudit` | `PublishGovernanceOutboxFlow` mark published / failed / dead-letter 后 | `outbox_ref`, `event_kind`, `publication_state`, `publication_ref_optional`, `failure_reason_ref_optional`, `job_report_ref` | operations / downstream evidence |
| `ProjectionFreshnessChangedAudit` | command/consumer/refresh/rebuild 保存 stale/fresh/failed marker 后 | `view_ref`, `view_kind`, `from_state_optional`, `to_state`, `source_cursor`, `reason_ref`, `job_report_ref_optional` | query service / operations |
| `ReferenceResolutionChangedAudit` | resolver/consumer/refresh 保存 reference state 后 | `reference_ref`, `reference_kind`, `from_state_optional`, `to_state`, `snapshot_ref_optional`, `failure_reason_ref_optional`, `source_version_ref_optional` | command resolver / query / operations |
| `GovernanceReconciliationReportedAudit` | `RunGovernanceReconciliationFlow` 保存 report 后 | `report_ref`, `scope_ref`, `report_state`, `finding_refs`, `view_refs`, `outbox_refs`, `job_report_ref` | operations / acceptance evidence |
| `GovernanceTraceHandoffAudit` | `PrepareGovernanceTraceHandoffFlow` 保存 marker 或 delivery receipt 后 | `marker_ref`, `trace_refs`, `target_ref`, `handoff_state`, `package_ref_optional`, `receipt_ref_optional`, `failure_reason_ref_optional`, `job_report_ref` | L4 observability / operations |
| `GovernanceArchiveHandoffAudit` | `PrepareGovernanceArchiveHandoffFlow` 保存 marker 或 delivery receipt 后 | `marker_ref`, `trace_refs`, `report_refs`, `target_ref`, `handoff_state`, `package_ref_optional`, `receipt_ref_optional`, `failure_reason_ref_optional`, `job_report_ref` | L4 archive / operations |
| `ExternalGrcExportAudit` | `PrepareExternalGrcExportFlow` 保存 export marker 后 | `marker_ref`, `trace_refs`, `target_ref`, `snapshot_ref_or_cursor`, `handoff_state`, `package_ref_optional`, `receipt_ref_optional`, `failure_reason_ref_optional`, `job_report_ref` | external GRC operations |
| `CommitStatusUnknownAudit` | UoW commit unknown 后的 recovery/idempotency audit | `trace_context_ref`, `operation`, `request_or_job_ref`, `idempotency_key_hash`, `reservation_state`, `result_ref_optional`, `diagnostic_ref` | operations / reconciliation |
| `ConfigValidationAudit` | runtime config validation failed 或 runtime builder failed 后 | `config_source_ref`, `config_section`, `adapter_slot_optional`, `validation_issue_ref`, `diagnostic_ref` | startup operations |

### 11.1 审计写入规则

| 规则 | 正式要求 |
|---|---|
| accepted truth 必须有 trace | 所有 accepted command truth change 必须先由 `GovernanceTraceRecord::from_truth_change(...)` 形成 trace record,再写 history/audit/outbox |
| history record 引用 trace | `DecisionRecord`、`ResponsibilityTraceRecord`、`PolicyChangeRecord`、`ControlChangeRecord`、`ComplianceConclusionRecord`、`NonconformityChangeRecord` 必须接收同事务 `GovernanceTraceRecordRef` |
| audit trail 只存 refs | `GovernanceAuditTrail.record_refs` 只追加 `GovernanceTraceRecordRef`;不得复制 trace body 或业务正文 |
| consumer marker trace | 只有 Step 9 指定需要 trace marker 的 accepted consumer / job marker 才调用 `GovernanceTraceRecord::from_marker(...)`;unsupported/rejected 不写 accepted marker trace |
| outbox 引用 trace | `GovernanceOutboxRecord::from_truth_change(...)` 必须接收同事务 trace ref;outbox 不反向生成 trace |
| handoff marker trace refs 非空 | trace/archive/external GRC marker 的 `trace_refs` 必须从已保存 trace/history/report 中收集且非空;external GRC export 必须先创建 marker trace 再创建 marker |
| failed audit 不等于 accepted audit | rejected command、unsupported event、adapter failure、config reject 使用 rejected/failed operations audit、日志和 report;不得写 accepted truth trace |

## 12. Trace / span 切口表

| Trace / span cut | Start | Required fields | End condition |
|---|---|---|---|
| `governance.command` | API handler 收到 command envelope | `command_kind`, `request_ref`, `actor_ref`, `trace_context_ref`, `idempotency_key_hash` | command response / protocol error / application error |
| `governance.query` | API handler 收到 query envelope | `query_kind`, `request_ref`, `actor_ref`, `trace_context_ref`, `consistency_hint` | query response surface / query error |
| `governance.consumer` | worker 收到 `GovernanceInboundEventEnvelope<T>` | `consumer_name`, `source_family`, `source_event_ref`, `event_version`, `trace_context_ref` | `GovernanceInboundEventReceipt` |
| `governance.job` | job runner 收到 `GovernanceJobRequest<T>` | `job_kind`, `job_run_id`, `trace_context_ref`, `idempotency_key_hash` | `GovernanceJobResponse` / `JobError` |
| `governance.repository` | application 调用 repository | `repository_kind`, `operation_group`, `subject_kind` | repository result / `ApplicationError` |
| `governance.uow` | UnitOfWork begin | `operation`, `request_or_job_ref`, `trace_context_ref` | commit / rollback / commit unknown |
| `governance.resolver` | application 调用 external source resolver | `resolver_kind`, `adapter_kind`, `source_ref` | resolver summary / unavailable / rejected |
| `governance.publisher` | outbox service 发布一条 stored snapshot | `event_kind`, `outbox_ref`, `payload_snapshot_ref` | publication receipt / failure |
| `governance.projection` | projection stale/rebuild item 开始 | `view_kind`, `view_ref`, `source_cursor` | freshness state saved / failure report |
| `governance.handoff` | handoff/export job 调用 port | `handoff_kind`, `target_ref`, `trace_ref_count` | marker saved / receipt / failure |

### 12.1 Trace context 规则

| 规则 | 正式要求 |
|---|---|
| context 来源 | command/query/event/job metadata 中的 `TraceContext` 是唯一传播来源;domain object 不创建新 context |
| trace record 来源 | `GovernanceTraceRecord` 是 Governance 本地业务追溯 record,不是 runtime span body |
| span attribute 边界 | span/log attribute 只能放 safe refs、kind、state、count、duration;不得放 payload body、external response、secret 或 package body |
| missing context | 协议要求 trace context 而缺失时按 Step 12 validation reject 或 redacted fallback 处理;不得用随机 context 掩盖协议错误 |

## 13. Redaction / forbidden-field 表

| 材料类型 | 允许字段 | 禁止字段 |
|---|---|---|
| structured log | stable refs、operation kind、state、error kind、duration、counts、redacted diagnostic ref | raw command body、raw query body、raw event payload、raw adapter response、stack trace、secret、token、credential |
| metrics | low-cardinality kind/state/result/error category | actor id、subject id、request id、trace id、outbox id、marker id、free text、secret、raw endpoint |
| `GovernanceTraceRecord` | trace id/ref、subject ref、trace kind、trace context ref、optional source cursor | external observability span body、runtime log body、conversation text、archive package body |
| `GovernanceAuditTrail` | audit subject ref、ordered trace record refs | trace body copy、truth object body copy、external source body |
| history records | trace ref、actor ref、object ref、from/to state、reason/change kind | evidence body、method definition body、policy expression body、artifact body |
| `GovernanceOutboxRecord` / payload snapshot | event kind、subject ref、source cursor、trace ref/context、body-free payload refs/states | current truth debug dump、uncommitted truth、external source body、secret |
| consumer receipt | source event ref、consumer name、disposition、result ref、reference state ref、affected view refs、issue refs | unsupported payload body、upstream event body、source system error body |
| job report | job kind/run/ref、counts、changed refs、failed refs、report refs、marker refs、redacted issue refs | job input body dump、adapter response body、package/document body |
| handoff/export marker | marker ref、trace refs、target ref、package ref、receipt ref、failure reason ref | observability ledger body、archive package body、external GRC document body |
| config validation issue | config source ref、section、adapter slot、redacted issue ref | raw URL、raw topic、secret、credential, full config file |
| diagnostic | stable error code、safe summary、supporting refs | HTTP body、SQL text、private profile、authorization internals、stack trace |

## 14. Flow 到观测/审计闭环表

| Flow family | 日志 | 指标 | 审计 / trace | 禁止副作用 |
|---|---|---|---|---|
| 22 command flows | entry、validation、idempotency、accepted/rejected、UoW | command total/duration、truth change、idempotency、UoW、repository conflict | accepted 写 `GovernanceTraceRecord`、`GovernanceAuditTrail`、history、outbox、stored result;rejected 只写 failed/rejected surface | rejected 不写 accepted trace/outbox;duplicate 不重放 transition |
| 14 query flows | completion、not-visible、degraded/stale/missing | query total/duration、visibility decision、projection freshness | no-write;只读取 trace/audit/report/view | 不写 audit/outbox/idempotency/projection repair/reference refresh |
| 9 inbound consumer flows | envelope validation、unsupported、duplicate、accepted、delayed/rejected | inbound event total/duration、unsupported version、reference resolution | accepted 写 snapshot/reference/stale/receipt;必要时写 marker trace | 不写 core Governance truth;unsupported 不解析 payload |
| outbound append helper | payload snapshot build、outbox append | command truth change、outbox pending | outbox 引用同事务 trace | publisher 不从 current truth 造 payload |
| `PublishGovernanceOutboxFlow` | scan、per item success/failure/dead-letter、summary | outbox pending/publish/dead-letter、job | publication audit、job report | 发布失败不回滚 accepted truth |
| `RebuildGovernanceProjectionsFlow` | start/finish/item failure | projection rebuild/freshness、job | projection freshness audit、job report | 不修 core truth |
| `RefreshExternalContextSnapshotsFlow` | per reference success/failure、summary | reference resolution/state、job | reference resolution audit、affected view stale audit | 不保存 sibling body;不修 truth |
| `RunGovernanceReconciliationFlow` | report generated/failed | reconciliation reports/findings、job | reconciliation report audit | 不直接修复 drift |
| `PrepareGovernanceTraceHandoffFlow` | target validation、prepare/deliver/fail | handoff total/duration、job | handoff marker audit、job report | 不保存 L4 observability body |
| `PrepareGovernanceArchiveHandoffFlow` | target validation、prepare/deliver/fail | handoff total/duration、job | archive handoff marker audit、job report | 不保存 archive package body |
| `PrepareExternalGrcExportFlow` | disabled/target rejected/prepare/export/fail | external GRC export、handoff、job | export marker audit;marker trace ref 必须非空 | 不创建 external GRC truth;不保存 document body |
| config/runtime builder | validation reject、adapter unavailable/ready | config validation、adapter availability | config validation audit | 不允许配置改变业务不变量 |

## 15. 前序闭环审计

| 检查项 | 结果 | 说明 |
|---|---|---|
| Step 6 trace/audit object 是否可承载 accepted truth 审计 | 通过 | `GovernanceTraceRecord::from_truth_change(...)`、`GovernanceAuditTrail.append(...)`、history record 均已闭合 |
| Step 7 port 是否能保存审计对象 | 通过 | `GovernanceTraceRepository`、`GovernanceAuditHistoryRepository`、`GovernanceHandoffMarkerRepository`、outbox/projection/reference/result repositories 已定义 |
| Step 8 protocol 是否能暴露 receipt/report refs | 通过 | inbound receipt、outbound envelope、job response/report 均有 ref/report surface |
| Step 9 flow 是否给出写入时机 | 通过 | command accepted transaction、consumer accepted flow、publish flow、maintenance job、handoff/export job 均定义顺序 |
| Step 12 错误路径是否避免伪造 accepted audit | 通过 | rejected / unsupported / failed path 只写 error surface、marker、report 或 log/metric |
| Step 13 duplicate replay 是否避免重放审计 | 通过 | duplicate command/consumer/job 使用 stored result/report/receipt,不新增业务 trace/outbox |
| Step 14 config binding 是否避免 raw config 泄露 | 通过 | config refs 与 adapter slots 已 body-free;本 Step 增加日志/指标 redaction |
| 告警/运维是否越界进入详细设计 | 通过 | 本 Step 只给 code instrumentation point,不写阈值/runbook |

## 16. 回填草稿

正式 `03-详细设计.md` §5.14 应回填:

- 本 Step §8 的可观测性与审计总原则。
- 本 Step §9 的日志埋点表和日志字段规则。
- 本 Step §10 的指标埋点表和低基数标签规则。
- 本 Step §11 的审计事件表和审计写入规则。
- 本 Step §12 的 trace / span 切口表和 trace context 规则。
- 本 Step §13 的 redaction / forbidden-field 表。
- 本 Step §14 的 flow 到观测/审计闭环表。

回填时必须保留以下约束:

- runtime log / metric 不是业务审计的替代品;accepted truth change 必须有 trace/audit/history/outbox/result。
- business trace / audit 不是外部 observability ledger;不得保存 L4 observability body。
- failed/rejected/unsupported path 不得伪造成 accepted truth trace。
- query no-write 不得因“审计读操作”而写 audit / idempotency / projection / reference。
- metric label 只允许低基数字段;高基数 ref 进入日志、trace、audit 或 report。
- 所有 diagnostic 必须 redacted;raw body、secret、credential、stack trace 和 external response body 禁止进入 Governance。

## 17. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| 日志埋点表覆盖 command/query/consumer/publisher/job/repository/adapter/config | 通过 | §9 覆盖全部入口和错误分支 |
| 指标埋点表覆盖关键路径且标签低基数 | 通过 | §10 明确禁止高基数 label |
| 审计事件覆盖 accepted truth、consumer marker、publication、projection、reference、reconciliation、handoff/export、commit unknown | 通过 | §11 完整列出 |
| trace / handoff / redaction 口径闭合 | 通过 | §12~§13 明确正文和 secret 边界 |
| 告警阈值 / runbook 未越界写入 | 通过 | 留给运维和配置文档 |
| 可进入 Step 16 | 通过 | Step 16 应把本 Step 的日志/指标/审计/forbidden body 规则转为测试切口和 evidence scan |
