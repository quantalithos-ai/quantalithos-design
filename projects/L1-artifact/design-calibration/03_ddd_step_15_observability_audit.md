# Step 15. 可观测性与审计埋点契约

> 对应 SOP: `standards/document/详细设计讨论流程_SOP.md` Step 15
> 回填章节: `03-详细设计.md` §5.15 可观测性与审计埋点契约
> 生成日期: 2026-07-04
> 状态: 已完成;待用户审查

---

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 15 可观测性与审计埋点契约 |
| 当前状态 | 已完成;待用户审查 |
| 输入基线 | 需求、架构、概要、Step 1~14 详细设计校准文档 |
| 输出文件 | `projects/L1-artifact/design-calibration/03_ddd_step_15_observability_audit.md` |
| 停审方式 | 按日志表、指标表、审计记录表、trace/span 切口、redaction 和 flow-to-observability 闭环分批写入;完成后只做跨 Step 6~14 闭环审计 |

## 2. 本步目标

本 Step 只定义代码层的可观测性和审计埋点，不定义告警阈值、SLO、dashboard、采样率、日志保留期、监控后端产品、pager 规则、人工恢复 runbook 或运维 endpoint 绑定。

实现侧必须从本 Step 直接判断:

- 哪些 command、query、consumer、relay publisher、job、repository、adapter 和 config validation 入口必须打日志。
- 哪些路径需要计数、耗时、状态类指标,以及指标标签允许使用哪些低基数字段。
- 哪些 accepted truth change、boundary audit、trace record、handoff record、mirror refresh record、relay publication state、projection freshness state、reconciliation report 和 commit unknown recovery 必须形成可追溯记录。
- `ArtifactTraceRecord`、`ArtifactReviewTraceRecord`、`AutomationIntakeAuditRecord`、`ArtifactBoundaryAuditRepository`、`ArtifactHandoffRecord`、`ExternalMirrorRefreshRecord` 和 `ArtifactCommittedChangeRelayRepository` 的边界如何与 runtime log / metric 分开。
- 哪些正文、secret、外部响应、payload、包体、debug dump 和 stack trace 永远不得进入日志、指标、审计、trace、marker 或 diagnostic。

## 3. 本步输入

| 输入 | 状态 | 本 Step 用途 |
|---|---|---|
| `03_ddd_step_06_object_contracts.md` | 已完成 | 固定 `ArtifactBoundaryAuditRepository`、`ArtifactReviewTraceRecord`、`AutomationIntakeAuditRecord`、`ArtifactTraceRecord`、`ArtifactHandoffRecord`、`ExternalMirrorRefreshRecord`、`ArtifactTraceAvailablePayload` 和 forbidden body 边界 |
| `03_ddd_step_07_trait_port_adapter_contracts.md` | 已完成 | 固定 trace、audit、relay、handoff、projection、reference、result 和 UoW port 的打点位置 |
| `03_ddd_step_08_protocol_contracts.md` | 已完成 | 固定 Command / Query / Inbound Event / Outbound Event / Job 的协议字段、receipt 和 report surface |
| `03_ddd_step_09_function_flows.md` | 已完成 | 固定 accepted transaction、query no-write、consumer accepted write、relay append / publish、maintenance job、handoff / export flow 的顺序 |
| `03_ddd_step_10_state_matrix.md` | 已完成 | 固定状态转换、terminal state、not-visible / degraded / unsupported / dead-letter / retry 的状态含义 |
| `03_ddd_step_11_persistence_transaction_consistency.md` | 已完成 | 固定 trace/audit/relay/projection/reference/result 的事务、一致性和 snapshot 闭环 |
| `03_ddd_step_12_error_recovery.md` | 已完成 | 固定 rejected path、commit unknown、rollback failure、unsupported version、adapter failure、handoff failure 的恢复口径 |
| `03_ddd_step_13_concurrency_idempotency.md` | 已完成 | 固定 duplicate replay、idempotency conflict、job reentry、publication retry 和 commit unknown 对账口径 |
| `03_ddd_step_14_config_external_binding.md` | 已完成 | 固定 config validation、adapter availability 和 target binding 的边界 |
| `projects/L1-governance/design-calibration/03_ddd_step_15_observability_audit.md` | 已读取 | 作为 Step 15 粒度框架参考,本文件按 Artifact 语义重写 |

## 4. 分批写入计划

| 批次 | 内容 | 状态 |
|---|---|---|
| 15.1 | 文件骨架、SOP 问题回答、当前诊断和总原则 | [x] 已写入 |
| 15.2 | 日志埋点表、日志字段规则和错误分支日志口径 | [x] 已写入 |
| 15.3 | 指标埋点表、低基数标签规则和关键路径指标口径 | [x] 已写入 |
| 15.4 | 审计记录表、trace/span 切口、redaction 和闭环规则 | [x] 已写入 |
| 15.5 | 前序闭环审计、回填草稿和进入下一步条件 | [x] 已写入 |

## 5. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 哪些处理流必须记录审计? | 所有 accepted truth change 必须形成 `ArtifactTraceRecord`、对应 change record、`ArtifactCommittedChangeRelayRepository` pending item 和 stored result;`ArtifactBoundaryAuditRepository.append_input_resolution(...)`、`append_review_trace(...)`、`append_automation_audit(...)` 只用于 intake/review/automation 的 accepted boundary audit;`ArtifactHandoffRecord`、`ExternalMirrorRefreshRecord`、`ArtifactDerivedViewState` 和 reconciliation report 用于维护、交接和刷新记录。 |
| 哪些错误分支必须记录日志? | API / worker / job validation reject、domain reject、not visible、not found、version conflict、unique conflict、idempotency duplicate / in-flight / conflict、resolver unavailable、forbidden body、unsupported event version、consumer delayed / rejected、publisher failed / dead-lettered、projection rebuild failed、reference refresh failed、handoff failed、UoW commit unknown、rollback failed、config validation rejected 和 adapter unavailable 都必须记录结构化日志。 |
| 哪些关键路径需要指标? | Command、Query、Inbound Consumer、Relay Publisher、Operations Job、repository / UoW、idempotency、reference resolver、projection freshness / rebuild、outbox / relay publication、handoff / export、reconciliation、config validation 和 adapter availability 都需要 counter / histogram / gauge 指标。 |
| 日志、指标、审计字段分别记录什么? | 日志记录 `trace_context_ref`、request / event / job ref、operation、actor ref、subject ref、safe source ref、status / disposition、error kind、diagnostic ref、result / report / marker ref、duration 和 count;指标只记录低基数 label;审计记录 committed truth / trace / history / relay / marker / report refs、from/to state、reason ref、source cursor、actor ref 和 trace context。 |
| 哪些监控和告警细节应留给运维文档? | 告警阈值、SLO、dashboard、采样率、日志保留、指标后端、trace backend、pager escalation、人工修复 runbook、具体 topic / endpoint / secret 绑定和健康阈值留给运维或配置文档。本 Step 只定义代码必须暴露的埋点切口和字段边界。 |

## 6. 当前文档问题诊断

| 位置 | 当前问题 | 本步处理 |
|---|---|---|
| Step 6 trace / audit object | 业务对象已闭合,但未说明 runtime log / metric 应在何处记录 | 本 Step 区分业务审计对象与运行观测埋点 |
| Step 7 repository / adapter ports | 已定义写入面,但没有固定 repository / adapter error 的日志和指标字段 | 本 Step 给出 repository、UoW、resolver、publisher、handoff 和 config 的打点规则 |
| Step 8 protocol | Command / Query / Event / Job 协议已闭合,但缺少入口级日志、指标、receipt / report 观测口径 | 本 Step 按 API、worker 和 job 三类入口固定埋点 |
| Step 9 flow | 每条 flow 已定义 truth / trace / relay / stale / result 顺序,但实现侧仍可能漏掉错误路径观测 | 本 Step 把 accepted / rejected / duplicate / delayed / failed 分支拆成日志、指标和记录表 |
| Step 10 state matrix | 状态已经定义,但运行态只看状态不足以定位问题 | 本 Step 为 terminal / degraded / stale / retryable / dead-letter 增加观测字段 |
| Step 12 error recovery | 错误恢复规则已定义,但 runtime 可定位字段未统一 | 本 Step 规定每类 error 至少记录 error kind、safe diagnostic ref 和关联 ref |
| Step 13 idempotency | duplicate replay 和 commit unknown 已闭合,但观测切口需要显式化 | 本 Step 规定 duplicate 不新增业务记录,但必须写 replay 日志和幂等指标 |
| Step 14 config binding | adapter / config binding 已闭合,但 config validation 与 adapter availability 观测字段未汇总 | 本 Step 固定 config validation / adapter availability log 和 metric |

## 7. 设计取舍

| 议题 | 方案 | 取舍 |
|---|---|---|
| 业务审计载体 | A. 另建 observability ledger;B. 使用 `ArtifactTraceRecord`、`ArtifactBoundaryAuditRepository`、`ArtifactHandoffRecord`、`ExternalMirrorRefreshRecord`、`ArtifactCommittedChangeRelayRepository` 和 report / result refs | 采用 B。Artifact 不拥有独立观测 ledger body |
| runtime log 与审计记录 | A. 只写日志;B. accepted truth change 同时写 trace / audit / relay / stored result | 采用 B。日志不可替代业务可追溯性 |
| rejected command | A. 写失败业务审计;B. 只写 structured log / metric / stored rejection 或 result | 采用 B。rejected transition 不得伪造成 accepted trace |
| Query 审计 | A. 每次读都写 audit;B. Query no-write,只记录日志和指标 | 采用 B。保持 Step 9 query no-write |
| 指标标签 | A. 把 subject / ref / id 都放 label;B. 只用低基数类别,定位通过日志 / trace / record | 采用 B。避免高基数和敏感信息泄露 |
| 外部 adapter failure | A. 保存 adapter error body;B. 保存 redacted issue ref / diagnostic ref | 采用 B。外部正文和 stack trace 不进入 Artifact |
| handoff / export | A. marker 保存 package / document body;B. marker 只保存 ref、receipt 和 failure refs | 采用 B。package / body 属于下游系统 |

## 8. 可观测性与审计总原则

| 规则 | 正式口径 |
|---|---|
| Command accepted | 同一 `ArtifactUnitOfWork` 内保存 truth、change record、`ArtifactTraceRecord`、`ArtifactCommittedChangeRelayRepository` pending item、必要的 `ArtifactBoundaryAuditRepository` 记录、stored result 和日志 / 指标;accepted path 的可观测性必须和写入一同完成。 |
| Command rejected | 不保存 accepted truth/change/relay;返回 protocol / domain rejection 或 stored rejection/result;记录 warn/error 日志和 error 指标。 |
| Duplicate replay | same key same digest 读取 stored result / receipt / report,不得重跑 domain transition、resolver、publisher 或 job body;记录 replay 日志和幂等指标。 |
| Idempotency conflict | same key different digest 不写业务对象;记录 conflict 日志、指标和 redacted issue ref。 |
| Query | 只读;不得写 audit、relay、idempotency、projection repair、reference refresh 或 trace repair;可记录 query 日志和指标。 |
| Inbound consumer accepted | 只写本地 snapshot / reference state / stale marker / receipt;如 Step 9 指定需要 trace marker,通过 `ArtifactTraceRecord::record_trace(...)` 写 trace;不得写 core truth。 |
| Unsupported event version | 不解析 payload、不写 snapshot、不 mark stale、不写 accepted trace;返回 unsupported receipt;记录 warn 日志和 counter。 |
| Relay publisher | 只发布 stored payload snapshot;发布成功/失败只更新 relay publication state 和 job report;不得回查 current truth 重新构造 payload。 |
| Maintenance job | 只维护 projection / reference / reconciliation / report / relay publication / handoff surface;不得修复 business truth。 |
| Handoff / export | 保存 marker refs、trace refs、package refs、receipt refs、failure refs 和 report refs;不得保存 observability body、archive body 或 external private copy。 |
| Diagnostic | 只能记录 stable error code、safe summary、supporting refs 和 redacted diagnostic ref;不得保存 raw request / payload / response / secret / stack trace。 |

## 9. 日志埋点表

| 位置 | 日志级别 | 字段 | 目的 |
|---|---|---|---|
| API command handler entry | `info` | `trace_context_ref`, `request_ref`, `command_kind`, `actor_ref`, `idempotency_key_hash` | 追踪写入口和幂等 key fingerprint |
| API command validation rejected | `warn` | `trace_context_ref`, `request_ref`, `command_kind`, `error_kind`, `validation_issue_ref`, `diagnostic_ref` | 定位缺 metadata、actor、idempotency、body limit 或 forbidden body |
| Command idempotency reserved | `debug` | `trace_context_ref`, `command_kind`, `idempotency_key_hash`, `reservation_state` | 排查 first-run / in-flight 进入点 |
| Command idempotency duplicate replay | `info` | `trace_context_ref`, `command_kind`, `idempotency_key_hash`, `result_ref` | 证明使用 stored result,没有重跑 domain transition |
| Command idempotency conflict / in-flight | `warn` | `trace_context_ref`, `command_kind`, `idempotency_key_hash`, `reservation_state`, `conflict_ref` | 定位 same key different digest 或并发处理中 |
| Command accepted truth change | `info` | `trace_context_ref`, `command_kind`, `actor_ref`, `subject_ref`, `truth_change_ref`, `trace_record_ref`, `relay_item_ref`, `result_ref`, `duration_ms` | 串联 truth、trace、audit、relay 和 result |
| Command domain rejected | `warn` | `trace_context_ref`, `command_kind`, `actor_ref`, `subject_ref`, `domain_error_kind`, `reason_ref`, `diagnostic_ref` | 区分业务拒绝与系统失败 |
| Command not visible / capability denied | `warn` | `trace_context_ref`, `command_kind`, `actor_ref`, `scope_ref`, `visibility_marker_ref`, `error_kind` | 追踪授权和可见性拒绝 |
| Version or unique conflict | `warn` | `trace_context_ref`, `operation`, `repository_kind`, `subject_ref`, `expected_version`, `error_kind` | 排查 optimistic concurrency 和唯一约束冲突 |
| UoW begin / commit failed | `error` | `trace_context_ref`, `operation`, `request_or_job_ref`, `uow_phase`, `error_kind`, `diagnostic_ref` | 定位事务失败和 commit unknown |
| UoW rollback failed | `error` | `trace_context_ref`, `operation`, `request_or_job_ref`, `error_kind`, `diagnostic_ref` | 触发人工介入和对账 |
| Query handler completion | `info` / `debug` | `trace_context_ref`, `request_ref`, `query_kind`, `actor_ref`, `surface_kind`, `result_status`, `duration_ms` | 追踪读面成功、empty、not-visible、degraded、stale |
| Query not visible | `info` | `trace_context_ref`, `query_kind`, `actor_ref`, `read_subject_ref`, `visibility_marker_ref` | 说明 body-free not-visible surface |
| Query degraded / stale / missing | `warn` | `trace_context_ref`, `query_kind`, `view_kind`, `freshness_state`, `degraded_marker_ref`, `source_cursor` | 解释 projection/read model 降级 |
| Inbound consumer envelope validation rejected | `warn` | `trace_context_ref`, `consumer_name`, `source_family`, `source_event_ref`, `event_version`, `validation_issue_ref` | 定位坏 envelope,不进入业务写 |
| Inbound consumer unsupported version | `warn` | `trace_context_ref`, `consumer_name`, `source_event_ref`, `event_version`, `supported_version_set_ref`, `worker_issue_ref` | 证明未解析 payload、未写 snapshot |
| Inbound consumer accepted | `info` | `trace_context_ref`, `consumer_name`, `source_event_ref`, `source_ref`, `reference_state_ref`, `affected_view_count`, `result_ref`, `trace_record_ref_optional` | 追踪 snapshot / reference / stale / receipt 成功 |
| Inbound consumer duplicate replay | `info` | `trace_context_ref`, `consumer_name`, `source_event_ref`, `dedup_key_hash`, `result_ref` | 证明不重写 snapshot / stale marker |
| Inbound consumer delayed / rejected | `warn` | `trace_context_ref`, `consumer_name`, `source_event_ref`, `disposition`, `error_kind`, `worker_issue_ref` | 排查上游不可用或 payload boundary 违规 |
| Relay append helper completion | `debug` | `trace_context_ref`, `event_kind`, `subject_ref`, `relay_item_ref`, `payload_snapshot_ref` | 验证 accepted transaction 已持久化 payload snapshot |
| Relay publisher scanned | `info` | `trace_context_ref`, `job_run_id`, `event_kind`, `scanned_count`, `pending_count` | 追踪 publish job 扫描范围 |
| Relay publish success | `info` | `trace_context_ref`, `job_run_id`, `relay_item_ref`, `event_kind`, `publication_ref`, `duration_ms` | 证明 published marker 来源 |
| Relay publish retryable failure | `warn` | `trace_context_ref`, `job_run_id`, `relay_item_ref`, `event_kind`, `failure_reason_ref`, `retryable` | 追踪 failed publication state |
| Relay dead-letter | `error` | `trace_context_ref`, `job_run_id`, `relay_item_ref`, `event_kind`, `dead_letter_reason_ref`, `report_ref` | 触发人工介入和 downstream 修复 |
| Projection stale marker saved | `info` | `trace_context_ref`, `view_ref`, `view_kind`, `freshness_state`, `source_cursor`, `reason_ref` | 追踪派生视图 stale 来源 |
| Projection rebuild start / finish | `info` | `trace_context_ref`, `job_run_id`, `view_kind`, `scope_ref`, `changed_count`, `failed_count`, `report_ref`, `duration_ms` | 追踪 projection maintenance |
| Projection rebuild failed | `warn` / `error` | `trace_context_ref`, `job_run_id`, `view_kind`, `scope_ref`, `failure_reason_ref`, `report_ref` | 解释 query degraded / failed view |
| Reference refresh item success | `info` | `trace_context_ref`, `job_run_id`, `reference_ref`, `adapter_kind`, `resolution_state`, `snapshot_ref`, `duration_ms` | 追踪 external reference refresh |
| Reference refresh item failed | `warn` | `trace_context_ref`, `job_run_id`, `reference_ref`, `adapter_kind`, `failure_reason_ref`, `last_successful_snapshot_ref` | 解释 unresolved / unavailable state |
| Reconciliation report generated | `info` | `trace_context_ref`, `job_run_id`, `scope_ref`, `report_ref`, `finding_count`, `view_count`, `relay_count` | 记录 drift evidence |
| Reconciliation failed report saved | `warn` / `error` | `trace_context_ref`, `job_run_id`, `scope_ref`, `report_ref`, `failure_reason_ref` | 保留失败对账 surface |
| Handoff prepared / delivered | `info` | `trace_context_ref`, `job_run_id`, `handoff_kind`, `target_ref`, `marker_ref`, `package_ref`, `receipt_ref_optional`, `duration_ms` | 追踪 trace / archive / sync handoff 成功 |
| Handoff failed | `warn` / `error` | `trace_context_ref`, `job_run_id`, `handoff_kind`, `target_ref`, `marker_ref`, `failure_reason_ref`, `report_ref` | 排查 adapter failure,不保存 package / document body |
| Runtime config validation rejected | `error` | `config_source_ref`, `config_section`, `adapter_slot`, `validation_issue_ref`, `diagnostic_ref` | 防止 raw config / secret / forbidden feature 越界 |
| Adapter availability changed | `warn` / `info` | `adapter_slot`, `adapter_kind`, `availability_state`, `failure_ref_optional`, `checked_at` | 支撑外部依赖健康判断 |

### 9.1 日志字段规则

| 字段规则 | 正式要求 |
|---|---|
| `trace_context_ref` | 来自 command / query / event / job metadata 中的 `TraceContext`;日志可记录 stable ref / correlation id,不得重新生成替代上下文 |
| `*_key_hash` | idempotency key、dedup key 只允许记录 one-way hash 或 redacted fingerprint,不得记录 caller supplied raw key |
| `diagnostic_ref` | 指向 redacted diagnostic / validation issue;不得把 raw stack trace、HTTP body、SQL、adapter response body 写入日志 |
| `subject_ref` | 只记录 body-free ref;不得附带正文、包体、archive body、observability body 或 sync 私有复制 |
| `duration_ms` | 由 application / handler / worker / job boundary 记录;domain object 不读取 clock |
| log level | validation / domain / idempotency conflict 使用 `warn`;repository unavailable、commit unknown、rollback failure、dead-letter、config reject 使用 `error`;正常 accepted / duplicate replay / job summary 使用 `info`;高频细节可用 `debug` |

## 10. 指标埋点表

| 指标 | 类型 | 打点位置 | 标签 |
|---|---|---|---|
| `artifact_command_total` | counter | command handler 返回前 | `command_kind`, `result`, `error_kind` |
| `artifact_command_duration_ms` | histogram | command handler 包裹 application service | `command_kind`, `result` |
| `artifact_command_truth_change_total` | counter | accepted truth change 保存后 | `truth_change_kind`, `subject_kind` |
| `artifact_query_total` | counter | query handler 返回前 | `query_kind`, `surface_kind`, `freshness_state` |
| `artifact_query_duration_ms` | histogram | query handler 包裹 query service | `query_kind`, `surface_kind` |
| `artifact_visibility_decision_total` | counter | `ReadVisibilityPolicy.evaluate_*` 返回后 | `query_or_command_kind`, `decision` |
| `artifact_idempotency_total` | counter | reserve / duplicate / complete / conflict / result-missing 后 | `operation_group`, `reservation_result` |
| `artifact_uow_total` | counter | UoW begin / commit / rollback 返回后 | `phase`, `result` |
| `artifact_repository_error_total` | counter | repository / UoW error 映射时 | `repository_kind`, `error_kind` |
| `artifact_version_conflict_total` | counter | optimistic version conflict 映射时 | `repository_kind`, `resource_kind` |
| `artifact_inbound_event_total` | counter | inbound consumer 返回前 | `consumer_name`, `source_family`, `disposition` |
| `artifact_inbound_event_duration_ms` | histogram | worker 包裹 consumer service | `consumer_name`, `disposition` |
| `artifact_unsupported_event_version_total` | counter | unsupported version receipt 形成后 | `consumer_name`, `source_family` |
| `artifact_reference_resolution_total` | counter | resolver / refresh item 完成后 | `resolver_kind`, `adapter_kind`, `result` |
| `artifact_reference_resolution_duration_ms` | histogram | resolver / refresh item 调用外部 adapter 前后 | `resolver_kind`, `adapter_kind`, `result` |
| `artifact_reference_state_total` | gauge | reference state 保存后或 refresh scan 后 | `reference_kind`, `resolution_state` |
| `artifact_relay_pending_total` | gauge | relay publish job scan 后 | `event_kind`, `publication_state` |
| `artifact_relay_publish_total` | counter | 每条 relay publish 完成后 | `event_kind`, `result` |
| `artifact_relay_publish_duration_ms` | histogram | publisher port 调用前后 | `event_kind`, `result` |
| `artifact_relay_dead_letter_total` | counter | relay 进入 dead-letter 后 | `event_kind`, `dead_letter_kind` |
| `artifact_projection_freshness_total` | gauge | projection state 保存或 query 读取后 | `view_kind`, `freshness_state` |
| `artifact_projection_rebuild_total` | counter | rebuild item 完成后 | `view_kind`, `result` |
| `artifact_projection_rebuild_duration_ms` | histogram | rebuild job item 前后 | `view_kind`, `result` |
| `artifact_reconciliation_total` | counter | reconciliation report 保存后 | `result_state` |
| `artifact_reconciliation_findings_total` | counter | reconciliation report 生成后 | `finding_kind`, `severity` |
| `artifact_handoff_total` | counter | trace / archive / sync handoff marker 保存后 | `handoff_kind`, `target_kind`, `result` |
| `artifact_handoff_duration_ms` | histogram | handoff port 调用前后 | `handoff_kind`, `target_kind`, `result` |
| `artifact_job_total` | counter | operations job 返回前 | `job_kind`, `disposition` |
| `artifact_job_duration_ms` | histogram | job runner 包裹 application service | `job_kind`, `disposition` |
| `artifact_job_item_total` | counter | job item loop 每项完成后 | `job_kind`, `item_result` |
| `artifact_config_validation_total` | counter | runtime config validation 后 | `config_section`, `result` |
| `artifact_adapter_availability_total` | gauge | adapter registry / health check 保存后 | `adapter_slot`, `adapter_kind`, `availability_state` |

### 10.1 指标标签规则

| 规则 | 正式要求 |
|---|---|
| 低基数 | 标签只能使用 kind / state / result / disposition / error category / adapter kind / source family 等有限集合 |
| 禁止高基数 | request ref、actor ref、subject ref、trace id、result ref、relay id、marker ref、source event id、idempotency key、dedup key、payload digest、free text 不得作为 metric label |
| 禁止敏感值 | secret、token、credential、raw endpoint、transport topic、SQL、HTTP status body、adapter response body 不得作为 metric label |
| 关联定位 | 单记录定位通过 structured log、trace record、audit record、report ref 或 diagnostic ref 完成,不通过 metric label 完成 |
| domain 无指标依赖 | domain object 不直接依赖 metric backend;指标由 handler / application / worker / job / infra boundary 记录 |

## 11. 审计记录表

| 审计 / 记录口径 | 触发位置 | 记录字段 | 消费方 |
|---|---|---|---|
| Accepted truth change record | fact / version / lineage / baseline / consumable / traceability accepted commit | `trace_record_ref`, `change_record_ref`, `truth_anchor_ref`, `from_state`, `to_state`, `source_cursor`, `relay_item_ref`, `result_ref` | trace query / downstream / archive |
| `ArtifactBoundaryAuditRepository.append_input_resolution` | intake / source resolution accepted | `record_ref`, `input_ref`, `source_ref`, `resolution_state`, `trace_record_ref_optional`, `result_ref` | boundary query |
| `ArtifactBoundaryAuditRepository.append_review_trace` | review open / responsibility accepted | `record_ref`, `review_anchor_ref`, `assignment_ref_optional`, `trace_record_ref`, `result_ref` | trace query |
| `ArtifactBoundaryAuditRepository.append_automation_audit` | automation intake accepted | `record_ref`, `automation_input_ref`, `audit_kind`, `audit_result`, `intake_context_ref_optional`, `result_ref` | boundary / review query |
| `ArtifactTraceRecord` | backref / traceability append | `artifact_trace_record_ref`, `truth_anchor_ref`, `consumer_ref`, `operation_kind`, `trace_state`, `backref_ref_optional` | trace query / handoff |
| `ArtifactHandoffRecord` | handoff job append | `artifact_handoff_record_ref`, `consumer_ref`, `truth_anchor_ref`, `channel_ref`, `handoff_state`, `trace_ref_optional` | operations query / archive / sync / observability |
| `ExternalMirrorRefreshRecord` | consumer / refresh job append | `external_mirror_refresh_record_ref`, `external_ref`, `reference_kind`, `refresh_state`, `snapshot_ref_optional`, `resolution_state_ref_optional` | reference query / audit |
| Relay publication state update | `ArtifactCommittedChangeRelayRepository.append(...)` / `mark_published(...)` / `mark_retryable(...)` / `mark_failed(...)` | `relay_item_ref`, `payload_snapshot_ref`, `event_kind`, `publication_state`, `truth_cursor`, `result_ref` | relay query / worker evidence |
| Projection freshness state update | derived view save / stale marker save | `derived_view_state_ref`, `derived_view_kind`, `freshness_state`, `source_cursor`, `reason_ref`, `result_ref` | query / operations |
| Reconciliation report saved | reconciliation job accepted finish | `report_ref`, `scope_ref`, `finding_count`, `changed_count`, `failed_count`, `result_ref` | operations / acceptance evidence |
| Commit status unknown recovery | UoW commit unknown 后的 recovery / idempotency audit | `trace_context_ref`, `operation`, `request_or_job_ref`, `idempotency_key_hash`, `reservation_state`, `result_ref_optional`, `diagnostic_ref` | operations / reconciliation |
| Runtime config validation audit | runtime config validation failed | `config_source_ref`, `config_section`, `adapter_slot_optional`, `validation_issue_ref`, `diagnostic_ref` | startup operations |

### 11.1 审计写入规则

| 规则 | 正式要求 |
|---|---|
| accepted truth 必须有 trace | 所有 accepted command truth change 必须先形成 `ArtifactTraceRecord` 或 flow 明确的 accepted trace record,再写 history / audit / relay / stored result |
| boundary audit 只存 refs | `ArtifactBoundaryAuditRepository` 只追加 record / trace / audit refs;不得复制正文、payload body 或外部内容 |
| trace / handoff / refresh append-only | `ArtifactTraceRecord`、`ArtifactHandoffRecord`、`ExternalMirrorRefreshRecord` 必须 append-only,不得覆盖 |
| relay 引用 trace | `ArtifactCommittedChangeRelayRepository.append(...)` 必须接收同事务 truth cursor / trace context / payload snapshot;publisher 不反向生成 trace |
| failed audit 不等于 accepted audit | rejected command、unsupported event、adapter failure、config reject、commit unknown 使用 rejected / failed surface、日志和 report;不得写 accepted truth trace |
| handoff marker trace refs 非空 | trace / archive / sync handoff 的 `trace_refs` 必须从已保存 trace / history / report / relay 中收集且非空;不得从 runtime body 现算 |

## 12. Trace / span 切口表

| Trace / span cut | Start | Required fields | End condition |
|---|---|---|---|
| `artifact.command` | API handler 收到 command envelope | `command_kind`, `request_ref`, `actor_ref`, `trace_context_ref`, `idempotency_key_hash` | command response / protocol error / application error |
| `artifact.query` | API handler 收到 query envelope | `query_kind`, `request_ref`, `actor_ref`, `trace_context_ref`, `consistency_hint` | query response surface / query error |
| `artifact.consumer` | worker 收到 inbound event envelope | `consumer_name`, `source_family`, `source_event_ref`, `event_version`, `trace_context_ref` | inbound receipt |
| `artifact.job` | job runner 收到 job request | `job_kind`, `job_run_id`, `trace_context_ref`, `idempotency_key_hash` | job response / report |
| `artifact.repository` | application 调用 repository | `repository_kind`, `operation_group`, `subject_kind` | repository result / `ApplicationError` |
| `artifact.uow` | UnitOfWork begin | `operation`, `request_or_job_ref`, `trace_context_ref` | commit / rollback / commit unknown |
| `artifact.resolver` | application 调用 external source resolver | `resolver_kind`, `adapter_kind`, `source_ref` | resolver summary / unavailable / rejected |
| `artifact.publisher` | relay publisher 调用 | `event_kind`, `relay_item_ref`, `payload_snapshot_ref` | publication receipt / failure |
| `artifact.projection` | projection stale / rebuild item 开始 | `view_kind`, `view_ref`, `source_cursor` | freshness state saved / failure report |
| `artifact.reference` | reference refresh item 开始 | `reference_kind`, `reference_ref`, `source_ref` | resolution state saved / failure report |
| `artifact.handoff` | handoff job 开始 | `handoff_kind`, `handoff_record_ref`, `target_ref` | marker / receipt / failure report |

## 13. Redaction / forbidden-field 表

| 材料类型 | 允许字段 | 禁止字段 |
|---|---|---|
| structured log | stable refs、operation kind、state、error kind、duration、counts、redacted diagnostic ref | raw command body、raw query body、raw event payload、raw adapter response、stack trace、secret、token、credential |
| metrics | low-cardinality kind / state / result / error category | actor id、subject id、request id、trace id、relay id、marker id、free text、secret、raw endpoint |
| `ArtifactTraceRecord` | trace id / ref、subject ref、trace kind、trace context ref、optional source cursor | external observability span body、runtime log body、conversation text、archive package body |
| `ArtifactBoundaryAuditRepository` records | audit subject ref、ordered trace refs、state transitions | trace body copy、truth object body copy、external source body |
| history / change record | trace ref、actor ref、object ref、from/to state、reason / change kind | evidence body、method definition body、policy expression body、artifact body |
| `ArtifactCommittedChangeRelayRepository` / payload snapshot | event kind、subject ref、source cursor、trace ref / context、body-free payload refs / states | current truth debug dump、uncommitted truth、external source body、secret |
| consumer receipt / job report | source event ref、consumer / job name、disposition、result ref、issue refs、marker refs | unsupported payload body、upstream event body、job input body dump、package / document body |
| handoff / export marker | marker ref、trace refs、target ref、package ref、receipt ref、failure reason ref | observability body、archive package body、sync private copy body |

## 14. Flow 到观测 / 审计闭环表

| Flow family | 日志 | 指标 | 审计 / trace | 禁止副作用 |
|---|---|---|---|---|
| 16 command flows | entry、validation、idempotency、accepted / rejected、UoW | command total / duration、truth change、idempotency、UoW、repository conflict | accepted 写 `ArtifactTraceRecord`、必要 boundary audit、relay pending item、stored result;rejected 只写 failed / rejected surface | rejected 不写 accepted trace / relay;duplicate 不重跑 transition |
| 13 query flows | completion、not-visible、degraded / stale / missing | query total / duration、visibility decision、projection freshness | no-write;只读取 trace / audit / report / view | 不写 audit / relay / idempotency / repair |
| 6 inbound consumer flows | envelope validation、unsupported、duplicate、accepted、delayed / rejected | inbound event total / duration、unsupported version、reference resolution | accepted 写 snapshot / reference / stale / receipt;需要时写 trace record | 不写 core truth;unsupported 不解析 payload |
| outbound relay append helper | payload snapshot build、relay append | command truth change、relay pending | relay item 引用同事务 trace | publisher 不从 current truth 造 payload |
| `PublishPendingArtifactRelaysFlow` | scan、per item success / failure / dead-letter、summary | relay pending / publish / dead-letter、job | publication state update、job report | 发布失败不回滚 accepted truth |
| `RebuildArtifactDerivedViewsFlow` | start / finish / item failure | projection rebuild / freshness、job | freshness state update、job report | 不修 core truth |
| `RefreshExternalReferenceStatesFlow` | per reference success / failure、summary | reference resolution / state、job | reference resolution record、affected view stale marker | 不保存 sibling body;不修 truth |
| `RunArtifactReconciliationFlow` | report generated / failed | reconciliation reports / findings、job | reconciliation report | 不直接修复 drift |
| `PrepareArtifactTraceHandoffFlow` | target validation、prepare / deliver / fail | handoff total / duration、job | `ArtifactHandoffRecord`、job report | 不保存 observability body |
| `PrepareArtifactArchiveHandoffFlow` / `PrepareArtifactSyncHandoffFlow` | target validation、prepare / deliver / fail | handoff total / duration、job | `ArtifactHandoffRecord`、job report | 不保存 archive / sync body |
| config / runtime builder | validation reject、adapter unavailable / ready | config validation、adapter availability | config validation record / diagnostic ref | 不允许配置改变业务不变量 |

## 15. 前序闭环审计

| 检查项 | 结果 | 说明 |
|---|---|---|
| Step 6 trace / audit 对象是否可承载 accepted truth 审计 | 通过 | `ArtifactTraceRecord`、`ArtifactReviewTraceRecord`、`AutomationIntakeAuditRecord`、`ArtifactHandoffRecord` 和 `ExternalMirrorRefreshRecord` 已闭合 |
| Step 7 port 是否能保存审计对象 | 通过 | `ArtifactBoundaryAuditRepository`、`ArtifactTraceRepository`、`ArtifactHandoffRecordRepository`、`ExternalMirrorRefreshRecordRepository`、`ArtifactCommittedChangeRelayRepository` 已定义 |
| Step 8 protocol 是否能暴露 receipt / report / payload refs | 通过 | inbound receipt、outbound envelope、job response / report 均有 ref / report surface |
| Step 9 flow 是否给出写入时机 | 通过 | accepted transaction、consumer accepted flow、relay append / publish、maintenance job、handoff flow 均定义顺序 |
| Step 10 状态语义是否能被观测 | 通过 | terminal / stale / degraded / unsupported / retryable / dead-letter 已在日志、指标和记录表里分别标识 |
| Step 12 错误路径是否避免伪造 accepted audit | 通过 | rejected / unsupported / failed path 只写 error surface、marker、report 或 log / metric |
| Step 13 duplicate replay 是否避免重放审计 | 通过 | duplicate command / consumer / job 使用 stored result / receipt / report,不新增业务 trace / relay |
| Step 14 config binding 是否避免 raw config 泄露 | 通过 | config refs 与 adapter slots 已 body-free;本 Step 增加日志 / 指标 redaction 汇总 |
| 告警 / 运维是否越界进入详细设计 | 通过 | 本 Step 只给 code instrumentation point,不写阈值 / runbook |

## 16. 回填草稿

正式 `03-详细设计.md` §5.15 应回填:

- 本 Step §8 的可观测性与审计总原则。
- 本 Step §9 的日志埋点表和日志字段规则。
- 本 Step §10 的指标埋点表和低基数标签规则。
- 本 Step §11 的审计记录表和审计写入规则。
- 本 Step §12 的 trace / span 切口表和 trace context 规则。
- 本 Step §13 的 redaction / forbidden-field 表。
- 本 Step §14 的 flow 到观测 / 审计闭环表。

回填时必须保留以下约束:

- runtime log / metric 不是业务审计的替代品;accepted truth change 必须有 trace / audit / relay / stored result。
- business trace / audit 不是外部 observability ledger;不得保存 L4 observability body。
- failed / rejected / unsupported path 不得伪造成 accepted truth trace。
- query no-write 不得因“审计读操作”而写 audit / idempotency / projection / reference。
- metric label 只允许低基数字段;高基数 ref 进入日志、trace、审计或 report。
- 所有 diagnostic 必须 redacted;raw body、secret、credential、stack trace 和 external response body 禁止进入 Artifact。

## 17. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| 日志埋点表覆盖 command / query / consumer / relay / job / repository / adapter / config | 通过 | §9 覆盖全部入口和错误分支 |
| 指标埋点表覆盖关键路径且标签低基数 | 通过 | §10 明确禁止高基数 label |
| 审计记录覆盖 accepted truth、boundary audit、relay publication、projection、reference、reconciliation、handoff / export、commit unknown | 通过 | §11 完整列出 |
| trace / handoff / redaction 口径闭合 | 通过 | §12~§13 明确正文和 secret 边界 |
| 告警阈值 / runbook 未越界写入 | 通过 | 留给运维和配置文档 |
| 可进入 Step 16 | 通过 | Step 16 应把本 Step 的日志 / 指标 / 审计 / forbidden body 规则转为测试切口和 evidence scan |
