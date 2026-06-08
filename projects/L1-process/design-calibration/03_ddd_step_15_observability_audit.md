# L1-process 03 DDD Step 15 可观测性与审计埋点契约

> SOP: `standards/document/详细设计讨论流程_SOP.md` Step 15
> 书写规范: `standards/document/详细设计书写规范.md` §5.14
> 上游输入: `projects/L1-process/01-架构设计.md` §9;`projects/L1-process/02-概要设计.md` §10
> 直接输入:
> - `projects/L1-process/design-calibration/03_ddd_step_06_object_contracts.md`
> - `projects/L1-process/design-calibration/03_ddd_step_08_protocol_contracts.md`
> - `projects/L1-process/design-calibration/03_ddd_step_09_function_flows.md`
> - `projects/L1-process/design-calibration/03_ddd_step_12_error_recovery.md`
> - `projects/L1-process/design-calibration/03_ddd_step_14_config_external_binding.md`
> 创建日期: 2026-06-06
> 状态: Completed

---

## 1. Step 状态

本 Step 已完成。

---

## 2. 本步输入

| 输入 | 用途 | 结论 |
|---|---|---|
| Step 6 trace / audit / outbox objects | `ProcessTraceRecord`、`ProcessAuditTrail`、`ProcessTruthChange`、`TraceHandoffRef` | 审计以 trace ref / truth ref 为主,不保存外部正文 |
| Step 8 receipts / markers / job DTO | `CommandReceipt`、`ConsumerReceipt`、`JobRunReceipt`、markers | protocol receipt 已提供 result / marker / count 字段 |
| Step 9 function flows | command / query / consumer / job 切口 | 埋点位置按 handler、service、repository / adapter boundary、job item loop 定义 |
| Step 12 error recovery | 异常分支和手工介入口径 | result missing、rollback failure、permanent publish / handoff、reconciliation drift 必须可定位 |
| Step 14 config binding | adapter failure、config validation、external dependency | config validation、resolver / publisher / handoff 失败需日志和指标 |

---

## 3. SOP 问题回答

1. 哪些处理流必须记录审计?

   回答:所有成功成立 `ProcessTruthChange` 的 command、consumer marker、projection marker、outbox publication state、handoff state、recovery maintenance state 和 reconciliation report 都必须可由 `ProcessTraceRecord` / `ProcessAuditTrail` / receipt / report ref 追溯。失败的 domain transition 不写 success trace,但必须有日志和 error mapping。

2. 哪些错误分支必须记录日志?

   回答:validation reject、idempotency conflict、result missing、repository conflict / unavailable、resolver unavailable / digest mismatch / body rejected、consumer quarantine / delayed、publisher retry / permanent failure、handoff retry / permanent failure、projection failed、reconciliation issue、UoW commit / rollback failure 和 config validation failure 必须记录结构化日志。

3. 哪些关键路径需要指标?

   回答:command latency / result、query latency / status、consumer disposition、job disposition / counts、outbox publish result、resolver result、handoff result、projection freshness、idempotency duplicate / conflict、repository conflict / unavailable 和 config validation result 需要指标。

4. 日志、指标、审计字段分别记录什么?

   回答:日志记录 operation kind、request / event / job ref、actor / source actor ref、trace context、subject ref、result / error ref、state / disposition、dependency ref 和 count。指标记录低基数标签。审计记录 committed truth / trace / marker / report ref。三者均不得记录 external body、raw payload、secret、token、credential、observability ledger body 或 archive package body。

5. 哪些监控和告警细节应留给运维手册?

   回答:告警阈值、SLO、dashboard、采样率、log retention、metric backend、pager escalation、secret redaction implementation 和 runbook 留给运维 / 配置文档。本 Step 只定义代码打点切口和字段。

---

## 4. 当前文档问题诊断

| 来源 | 问题 | 本 Step 收口 |
|---|---|---|
| Step 6 | trace / audit 对象已有,但不等于日志 / 指标切口 | 补 command / consumer / job 审计事件表 |
| Step 8 | receipts / markers 有字段,但未说明埋点 | 补 receipt / marker log 和 metric 位置 |
| Step 12 | 手工介入场景需要可定位 ref | 补 result missing、rollback failure、permanent failure、drift 的日志 / metric / audit |
| Step 14 | config / adapter failure 绑定清楚,但无埋点 | 补 config validation、resolver / publisher / handoff adapter metrics |

---

## 5. 设计取舍

| 议题 | 方案 | 取舍 |
|---|---|---|
| 审计对象 | A. 另建 observability ledger;B. 使用 `ProcessTraceRecord` / `ProcessAuditTrail` / receipt / report ref | 采用 B。Process 不拥有 observability ledger body |
| 日志字段 | A. 记录 raw payload 便于排查;B. 只记录 ref / digest / summary marker | 采用 B。遵守正文排除 |
| 指标标签 | A. 高基数字段全做 label;B. 只用 operation kind / status / dependency kind 等低基数字段 | 采用 B。request ref 等进入日志 / trace,不进 metric label |
| Query 埋点 | A. query 自动修复 projection;B. query 只记录 stale / degraded status | 采用 B。query no-write |
| Handoff 可观测性 | A. 保存外部响应 body;B. 保存 receipt ref / external ref marker | 采用 B。handoff 不保存外部正文 |

---

## 6. 结构化中间产物

### 6.1 日志埋点表

| 位置 | 日志级别 | 字段 | 目的 |
|---|---|---|---|
| API command handler validation reject | `warn` | `command_kind`,`request_ref`,`actor_ref`,`protocol_error_ref` | 定位 bad request,不进入 UoW |
| API command success | `info` | `command_kind`,`request_ref`,`actor_ref`,`result_ref`,`trace_record_ref`,`outbox_record_ref`,`duplicate` | command result 可追溯 |
| Command idempotency duplicate | `info` | `operation`,`idempotency_key_hash`,`result_ref`,`request_ref` | 证明未重放 domain transition |
| Command idempotency conflict | `warn` | `operation`,`idempotency_key_hash`,`conflict_ref`,`request_ref` | 定位 same key different digest |
| Command duplicate result missing | `error` | `operation`,`result_ref`,`request_ref` | manual repair `operation_results` |
| Domain rejected | `warn` | `command_kind`,`request_ref`,`actor_ref`,`domain_error_ref`,`subject_ref` | 区分业务拒绝和系统失败 |
| Repository conflict | `info` | `repository`,`subject_ref`,`expected_version`,`error_kind` | 并发冲突可诊断 |
| Repository unavailable / serialization failed | `error` | `repository`,`dependency_ref`,`error_kind`,`operation` | dependency failure |
| UoW begin / commit failure | `error` | `operation`,`request_or_job_ref`,`error_kind`,`trace_context` | commit unknown / retry 判断 |
| UoW rollback failure | `error` | `operation`,`request_or_job_ref`,`error_kind`,`trace_context` | manual intervention |
| Query not visible / missing | `info` | `query_kind`,`request_ref`,`actor_ref`,`subject_ref`,`status` | query surface audit correlation |
| Query degraded / unavailable | `warn` | `query_kind`,`request_ref`,`subject_ref`,`projection_marker_ref`,`freshness_state` | projection health |
| Consumer envelope invalid | `warn` | `event_kind`,`source_event_id`,`source_ref`,`quarantine_reason_ref` | bad event triage |
| Consumer accepted | `info` | `event_kind`,`source_event_id`,`dedup_key_hash`,`reference_state_ref`,`trace_record_ref_optional` | event intake trace;`trace_record_ref_optional = None` for reference-only accepted consumers such as method definition snapshot intake |
| Consumer duplicate | `info` | `event_kind`,`source_event_id`,`dedup_key_hash`,`result_ref` | no duplicate marker write |
| Consumer delayed | `warn` | `event_kind`,`source_event_id`,`delay_reason_ref`,`retry_after` | source unavailable |
| Consumer quarantined | `warn` | `event_kind`,`source_event_id`,`quarantine_reason_ref`,`offending_ref` | source / payload issue |
| Resolver success | `debug` | `resolver_kind`,`source_ref`,`source_version_ref`,`snapshot_ref` | source resolution trace without body |
| Resolver unavailable | `warn` | `resolver_kind`,`source_ref`,`dependency_ref` | retry / delayed decision |
| Resolver digest mismatch / body rejected | `warn` | `resolver_kind`,`source_ref`,`source_digest_ref_or_hash`,`error_kind` | boundary violation diagnosis |
| Publish success | `info` | `outbox_id`,`event_kind`,`truth_ref`,`publication_ref` | outbound propagation evidence |
| Publish retryable failure | `warn` | `outbox_id`,`event_kind`,`retry_reason_ref`,`attempt_count` | retry tracking |
| Publish permanent failure / invalid event | `error` | `outbox_id`,`event_kind`,`failure_reason_ref` | manual repair |
| Projection rebuild start / finish | `info` | `job_run_ref`,`projection_kind`,`from_cursor_ref`,`changed_count`,`failed_count` | rebuild observability |
| Projection rebuild failure | `error` | `job_run_ref`,`projection_kind`,`failure_reason_ref`,`view_state_ref` | query degradation source |
| Snapshot refresh partial | `warn` | `job_run_ref`,`external_context_kind`,`scanned_count`,`failed_count`,`report_ref` | source health |
| Reconciliation report saved | `info` | `job_run_ref`,`scope_ref`,`report_ref`,`result_state`,`issue_count` | drift evidence |
| Handoff delivered | `info` | `job_run_ref`,`handoff_ref`,`target_ref`,`receipt_ref` | trace / archive delivery evidence |
| Handoff retryable failure | `warn` | `job_run_ref`,`handoff_ref`,`target_ref`,`failure_ref` | retry tracking |
| Handoff permanent failure / invalid target | `error` | `job_run_ref`,`handoff_ref`,`target_ref`,`failure_ref` | manual repair |
| Config validation failure | `error` | `config_section`,`config_key`,`validation_error_ref` | startup fail-fast |

Log field rules:

- `*_key_hash` means one-way hash or redacted stable fingerprint,not raw idempotency key when key can contain caller data.
- `source_digest_ref_or_hash` may record digest value only when digest itself is not a secret;otherwise record a redacted hash.
- Logs must not include raw event payload,method body,work item body,identity profile,governance decision body,artifact body,runtime execution log,conversation body,observability ledger body,archive package body,secret,token or credential.

### 6.2 指标埋点表

| 指标 | 类型 | 打点位置 | 标签 |
|---|---|---|---|
| `process_command_total` | counter | command handler return | `command_kind`,`result` |
| `process_command_latency_ms` | histogram | command handler around service call | `command_kind`,`result` |
| `process_query_total` | counter | query handler return | `query_kind`,`status` |
| `process_query_latency_ms` | histogram | query handler around service call | `query_kind`,`status` |
| `process_idempotency_total` | counter | idempotency reservation result | `operation_group`,`reservation_result` |
| `process_repository_error_total` | counter | repository adapter error mapping | `repository`,`error_kind` |
| `process_uow_total` | counter | UoW begin / commit / rollback | `phase`,`result` |
| `process_consumer_total` | counter | consumer service return | `event_kind`,`disposition` |
| `process_consumer_latency_ms` | histogram | consumer service call | `event_kind`,`disposition` |
| `process_resolver_total` | counter | resolver adapter return | `resolver_kind`,`result` |
| `process_outbox_publish_total` | counter | outbox publish per record | `event_kind`,`result` |
| `process_outbox_pending` | gauge | outbox scan / worker loop | `event_kind`,`publication_state` |
| `process_job_total` | counter | job runner return | `job_kind`,`disposition` |
| `process_job_latency_ms` | histogram | job runner around service call | `job_kind`,`disposition` |
| `process_job_items_total` | counter | job item loop finish | `job_kind`,`item_result` |
| `process_projection_state_total` | counter | projection state transition | `projection_kind`,`freshness_state` |
| `process_reconciliation_issues_total` | counter | reconciliation report save | `result_state` |
| `process_handoff_total` | counter | handoff port return / marker save | `handoff_kind`,`result` |
| `process_config_validation_total` | counter | config loader validation | `config_section`,`result` |

Metric label rules:

- Labels must be low cardinality. Do not use request ref、actor ref、subject ref、idempotency key、source event id、trace id、result ref、outbox id、report ref as labels.
- High-cardinality refs belong in logs,trace context or audit records.
- Metrics must not expose secret / credential / raw endpoint values.

### 6.3 审计事件表

| 审计事件 | 触发位置 | 记录字段 | 消费方 |
|---|---|---|---|
| `ProcessTruthCommittedAudit` | after command truth save + trace append | `ProcessTraceRecordRef`,`ProcessTruthChangeRef`,`actor_ref`,`request_ref`,`trace_context` | process query / trace / archive |
| `ProcessCommandRejectedAudit` | command rejected after authorization / domain policy | `command_kind`,`request_ref`,`actor_ref`,`domain_error_ref` or `protocol_error_ref` | operations audit;not outbox |
| `ProcessIdempotencyConflictAudit` | idempotency same operation key different digest | `operation`,`conflict_ref`,`request_ref` | operations audit |
| `ProcessResultMissingAudit` | duplicate result missing | `operation`,`application_result_ref` | operations repair |
| `ProcessConsumerMarkerAudit` | consumer accepted / delayed / quarantine / noop marker saved | `event_kind`,`source_event_id`,`consumer_receipt_ref_or_result_ref`,`marker_ref`,`trace_record_ref_optional` | worker / operations |
| `ProcessProjectionStateAudit` | projection state stale / rebuilding / fresh / failed / disabled | `view_state_ref`,`projection_kind`,`source_cursor_ref`,`freshness_state` | query / operations |
| `ProcessOutboxPublicationAudit` | outbox published / retry / failed | `outbox_id`,`event_kind`,`truth_ref`,`publication_state`,`publication_ref_or_failure_ref` | worker / operations |
| `ProcessTraceHandoffAudit` | trace handoff prepared / delivered / failed / cancelled | `handoff_ref`,`target_ref`,`handoff_state`,`receipt_or_failure_ref` | observability / archive operations |
| `ProcessArchiveHandoffAudit` | archive handoff delivered / failed | `handoff_ref`,`archive_target_ref`,`archive_package_ref_or_failure_ref` | archive operations |
| `ProcessRecoveryMaintenanceAudit` | maintenance job changes recovery attempt | `job_run_ref`,`recovery_attempt_ref`,`history_record_ref`,`recovery_state` | recovery operations |
| `ProcessReconciliationReportAudit` | reconciliation report saved | `job_run_ref`,`scope_ref`,`report_ref`,`result_state`,`issue_refs` | operations / acceptance evidence |
| `ProcessConfigValidationAudit` | config validation failed or runtime built | `config_section`,`validation_result`,`config_profile_ref_or_digest` | startup operations |

Audit rules:

- Audit records may reference `ProcessTraceRecord`,`ProcessAuditTrail`,receipt,marker,report and outbox refs.
- Audit records must not store external source body,raw payload,secret,token,credential,observability ledger body or archive package body.
- Failed domain transition audit must be explicitly rejected / failed audit,not a truth-committed trace.
- Outbox publication audit does not mean downstream truth is owned by Process.

### 6.4 Trace / span cut table

| Span / trace cut | Start | Required fields | End condition |
|---|---|---|---|
| `process.command` | API handler receives valid command envelope | `command_kind`,`request_ref`,`actor_ref`,`trace_context` | command result or `ProcessApiError` |
| `process.query` | API handler receives query | `query_kind`,`request_ref`,`actor_ref`,`consistency_hint` | query response status |
| `process.consumer` | worker receives `InboundEventEnvelope<T>` | `event_kind`,`source_event_id`,`source_ref`,`trace_context` | `ConsumerReceipt` |
| `process.job` | job runner starts | `job_kind`,`job_run_ref`,`trace_context` | `JobRunReceipt` or `JobError` |
| `process.repository` | application calls repository | `repository`,`operation_group` | repository result / error |
| `process.resolver` | application calls resolver | `resolver_kind`,`source_ref` | resolver result / error |
| `process.publisher` | outbox service publishes one record | `event_kind`,`outbox_id`,`truth_ref` | publication receipt / error |
| `process.handoff` | handoff job calls handoff port | `handoff_kind`,`handoff_ref`,`target_ref` | handoff receipt / error |

Trace rules:

- Use existing `TraceContext` from command/query/event/job metadata when present.
- Do not create new trace context in domain objects.
- Do not attach raw external payload as span attribute.

### 6.5 Redaction / forbidden-field table

| Data class | Allowed in logs / metrics / audit | Forbidden |
|---|---|---|
| Process refs / ids | yes,except high-cardinality metrics labels | none |
| Actor refs | logs / audit yes;metrics labels no | identity profile body |
| Idempotency keys | hash / redacted fingerprint only | raw key when caller supplied |
| Source digest | digest or hash if non-secret | source body |
| Method / work / governance / artifact / runtime / conversation data | safe ref / snapshot ref / marker ref | raw body / package / execution log / conversation text |
| Credentials / endpoints | credential ref / endpoint ref | secret,token,raw credential |
| Archive / observability handoff | handoff ref、receipt ref、archive package ref | ledger body、archive package body |

---

## 7. 回填草稿

> 校准来源:
> - `design-calibration/03_ddd_step_15_observability_audit.md`
>
> 延伸阅读:
> - Step 6 trace / audit / outbox object contracts
> - Step 8 receipt / marker / job DTOs
> - Step 12 error recovery matrix
> - Step 14 config / adapter binding

`03-详细设计.md` §14 必须写入本 Step 的日志埋点表、指标埋点表、审计事件表、trace / span cut table 和 redaction rules。所有埋点字段必须使用 ref、state、marker、receipt、report、count、error ref 或 trace context,不得记录外部正文、raw payload、secret、token、credential、observability ledger body 或 archive package body。失败的 domain transition 不写 success trace / outbox;需要用 rejected audit / structured log 表达。

---

## 8. 待确认事项

- 无阻塞 Step 16 的待确认事项。
- 告警阈值、SLO、dashboard、采样率、日志保留和 runbook 留给运维 / 配置文档。
- Step 16 必须为 duplicate / conflict / result missing / rollback failure / forbidden body / config validation / permanent publisher / handoff failure 等切口定义测试或 evidence scan。

---

## 9. 完成检查

| 检查项 | 结果 | 说明 |
|---|---|---|
| 日志切口明确 | 通过 | command、query、consumer、job、adapter、config 均覆盖 |
| 指标切口明确 | 通过 | 使用低基数标签 |
| 审计事件明确 | 通过 | committed truth、marker、outbox、handoff、report 均覆盖 |
| 安全 / 隐私边界明确 | 通过 | forbidden-field table |
| 可进入 Step 16 测试切口 | 通过 | 下一步可映射测试 |
