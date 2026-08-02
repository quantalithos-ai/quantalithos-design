# Step 15. 定义可观测性与审计埋点契约

> 对应 SOP: `standards/document/详细设计讨论流程_SOP.md` Step 15
> 回填章节: `03-详细设计.md` §14 可观测性与审计埋点契约
> 生成日期: 2026-07-09
> 状态: completed_wait_user_review
> 所属流程: `03_ddd_calibration_flow.md`
> 本 Step 口径: 在 Step 6 对象契约、Step 7 port / repository 契约、Step 8 协议契约、Step 9 flow、Step 11 transaction / cursor、Step 12 error recovery、Step 13 idempotency 和 Step 14 config / adapter binding 基础上,定义 L4-sandbox 的 runtime log、metric、business audit trace、relay marker、handoff marker、job report 与 diagnostic issue 的代码埋点切口。本步不写告警阈值、SLO、dashboard、采样率、日志保留、观测后端产品、runbook、真实 evidence alias、真实测试结果、验收签署、实施 commit boundary 或正式 `03-详细设计.md`。

---

## 1. Step 开工确认

| 检查项 | 结论 |
|---|---|
| 用户是否已确认进入 Step 15 | 是。Step 14 审查点后用户已回复“同意”,允许进入 Step 15。 |
| 项目级台账是否允许进入 Step 15 | 是。原恢复点为 Step 14 `pass_wait_review`;用户确认后可进入本步。 |
| 文档级 flow 是否允许进入 Step 15 | 是。`03_ddd_calibration_flow.md` 原记录 Step 15 `blocked_by_step_14`,用户确认后门禁满足。 |
| 是否已读取 Step 15 SOP | 是。本步必须输出日志埋点表、指标埋点表、审计事件表。 |
| 是否已读取详细设计书写规范 §5.14 | 是。本章只写实现切口,不写运维告警阈值;审计字段不得越过安全边界。 |
| 是否已读取真相源闭环标准 §2.14 / §2.14-a | 是。必须区分 runtime log / metric、business trace / audit、outbox publication marker、handoff marker、job report 和 diagnostic issue。 |
| 是否已读取 consumer receipt trace 来源规则 | 是。reference-only consumer 若无正式 trace subject,`trace_record_ref=None`,不得伪造 subject。 |
| 是否已读取上游详细设计 Step | 是。重点读取 Step 6/7/8/9/11/12/13/14,并参考 `L1-governance` Step 15 粒度。 |
| 是否发现阻塞 Step 15 的上游 blocker | 未发现阻塞本步生成的 blocker。`04-配置设计.md` 与 `07-实施计划.md` 缺失仍是 downstream gap,不阻塞本步。 |

---

## 2. 本步目标

本步把可观测性与审计固定到实现者可以直接落码的粒度:

- 哪些 entry / application / repository / adapter / worker / job 位置必须记录结构化日志。
- 哪些 command、query、consumer、relay、job、adapter、repository、config 关键路径必须输出 counter / histogram / gauge 指标。
- 哪些 accepted sandbox-owned truth change 或 formal marker 必须追加 `SandboxAuditTrace` 或写入对应 marker / report。
- 哪些 rejected、unsupported、delayed、failed、duplicate replay、query no-write、adapter unavailable、config invalid 分支只能写 runtime log / metric / receipt / report / diagnostic issue,不得伪造成 accepted audit trace。
- `SandboxTraceContext`、`SandboxAuditTrace`、`SandboxConsumerReceiptDto.trace_record_ref`、`SandboxOutboundEventEnvelopeDto.audit_trace_ref`、`SandboxJobReportDto.audit_trace_refs` 之间如何串联。
- 日志、指标、审计字段允许记录什么,禁止记录什么,以及定位 raw 失败时只能使用 redacted diagnostic ref。
- 哪些监控细节必须留给 `04-配置设计.md`、运维手册或部署文档,不得在详细设计中伪装成已确认生产口径。

本步不处理:

- 观测产品选型、OpenTelemetry exporter、log sink、metric backend、dashboard、alert threshold、SLO、采样率、日志保留和 pager / runbook。
- 正式配置 key、topic 原名、endpoint、secret、credential、profile 默认数值和 health probe 细节。
- `05-测试方案.md` 的完整测试 case、测试数据、真实执行结果和 evidence alias。
- `07-实施计划.md` 的 phase / commit boundary、implementation ledger 和 planned boundary skeleton。

---

## 3. 本步输入

| 输入 | 状态 | 本 Step 用途 |
|---|---|---|
| `project_execution_ledger.md` | 已读取 | 确认当前恢复点、用户门禁和 downstream gap。 |
| `03_ddd_calibration_flow.md` | 已读取 | 确认 Step 1~14 已完成,正式 `03` 仍不得修改。 |
| `03_ddd_step_06_object_contracts.md` | 已读取 | 提供 `SandboxAuditTrace`、`SandboxTraceContext`、`SandboxServiceCallContext`、public error、worker/job context 和 trace kind。 |
| `03_ddd_step_07_trait_port_adapter_contracts.md` | 已读取 | 提供 `SandboxAuditTraceRepository`、UoW、truth / projection / relay / idempotency repositories、resolver、backend、handoff、publisher 和 runtime config ports。 |
| `03_ddd_step_08_protocol_contracts.md` | 已读取 | 提供 command result、query surface、consumer receipt、outbound envelope、job report 和 public error DTO 字段边界。 |
| `03_ddd_step_09_function_flows.md` | 已读取 | 提供 command / query / consumer / relay / job 调用顺序、side effect、no-write / no-rollback / no-repair 规则。 |
| `03_ddd_step_10_state_matrix.md` | 已完成并承接 | 提供状态机、terminal guard、非法转换和 lifecycle / cleanup / redline 迁移口径。 |
| `03_ddd_step_11_persistence_transaction_consistency.md` | 已读取 | 提供 `SandboxAuditTrace` same-UoW append、cursor 来源、rollback visibility、relay publish separate transaction、query read-only。 |
| `03_ddd_step_12_error_recovery.md` | 已读取 | 提供 validation / domain / adapter / transaction / duplicate / no-write / no-repair / redline 等错误分类与恢复口径。 |
| `03_ddd_step_13_concurrency_idempotency.md` | 已读取 | 提供 duplicate replay 不新增 business audit / relay / handoff / report item,以及 retry identity / digest 禁止字段。 |
| `03_ddd_step_14_config_external_binding.md` | 已读取 | 提供 config validation、runtime builder、adapter availability、topic binding、handoff / relay / backend external dependency binding。 |
| 正式 `00/01/02` | 已读取过并在前序 Step 承接 | 提供可追溯、可观测、external body exclusion、cleanup / redline、capture / handoff 分层和 observability store 不归 sandbox 的边界。 |

---

## 4. Step 内计划

| 顺序 | 动作 | 状态 | 产物 / 门禁 |
|---:|---|---|---|
| 1 | 恢复项目级台账、文档级 flow 和 Step 14 当前文件。 | done | 确认用户已允许进入 Step 15。 |
| 2 | 读取 Step 15 SOP、详细设计书写规范 §5.14、真相源闭环标准 §2.14 / §3.7.1。 | done | 明确日志 / 指标 / 审计事件表和 redaction 边界。 |
| 3 | 从 Step 6~14 抽取 trace、receipt、report、relay、handoff、idempotency、error、config / adapter 观测输入池。 | done | 形成本步埋点候选池。 |
| 4 | 定义 runtime log 表、字段规则和必须记录日志的错误分支。 | done | 实现者知道代码位置、level、字段和目的。 |
| 5 | 定义 metric 表、低基数 label 规则和关键路径指标。 | done | 实现者知道 counter / histogram / gauge 打点位置。 |
| 6 | 定义 audit event / trace / marker / report 规则、consumer/job/handoff trace 来源和禁止字段。 | done | 实现者知道哪些 flow 写 `SandboxAuditTrace`,哪些只写 receipt/report/diagnostic。 |
| 7 | 更新 `03_ddd_calibration_flow.md` 和项目级台账。 | done | 当前恢复点停在 Step 15 审查点,不跨到 Step 16。 |

---

## 5. SOP 问题回答

| SOP 问题 | 本步回答 |
|---|---|
| 哪些处理流必须记录审计 | 所有 accepted sandbox-owned truth change 必须在同一 UoW 中追加 `SandboxAuditTrace` 或写 formal marker trace: context accepted/rejected、environment identity bind/close、boundary accepted/rejected、policy accepted/fail-closed/blocked、run started/terminal、capture recorded、handoff opened / terminal、failure classified、control recorded、cleanup guard evaluated、lease/orphan reaper result、redline containment、investigation handoff、relay terminal feedback、projection / derived / reconciliation formal maintenance marker。Reference-only consumer 只写 reference state / stale marker / receipt,默认 `trace_record_ref=None`。Query 默认不写 audit。Duplicate replay 不新增业务 audit。 |
| 哪些错误分支必须记录日志 | API / worker / job validation reject、forbidden external body、unsupported schema version、domain rejected、boundary rejected、policy fail-closed、not visible、missing / degraded projection、adapter unavailable / disabled、resolver delayed、backend launch / capture / inspect / release failure、handoff failure、relay retry / dead-letter、UoW begin / commit / rollback failure、version / unique conflict、idempotency conflict / in-flight / duplicate missing result、no-write violation、job no-repair violation、config validation reject、runtime builder blocked / degraded、adapter availability changed、redline detected / containment failure 都必须记录 structured log。 |
| 哪些关键路径需要指标 | Command、Query、Inbound Consumer、Idempotency、UoW / repository、boundary decision、policy decision、backend capability、isolation run、capture、handoff、relay append / publish、cleanup guard、lease / orphan reaper、redline、projection / derived / reconciliation、operations job、config validation、adapter availability 需要 counter / histogram / gauge。 |
| 日志、指标、审计字段分别记录什么 | 日志记录 trace context ref、operation kind、channel、actor / subject safe ref、source ref、status / disposition、error kind、safe reason ref、diagnostic issue ref、stored result / receipt / report / marker ref、duration 和 counts。指标只记录低基数标签,如 operation kind、result、error kind、state、adapter kind、source family、job kind、handoff kind。审计只记录 body-free refs、from/to state、reason ref、source truth / marker ref、source cursor、receipt / report ref、redacted issue ref 和 `SandboxTraceContext` 来源。 |
| 哪些监控和告警细节留给运维手册 | 告警阈值、SLO、dashboard、采样率、日志保留、metric / trace backend、OTel exporter、生产 adapter endpoint、topic 物理名、health probe、pager escalation、manual recovery runbook、secret scanning 实现和生产 incident workflow 留给运维手册 / 配置设计 / 部署文档。本 Step 只定义代码埋点切口和字段边界。 |

---

## 6. 当前文档问题诊断

| 位置 | 当前问题 | 本步处理 |
|---|---|---|
| Step 6 `SandboxAuditTrace` | 已定义 append-only audit trace,但未列出哪些 flow 必须 append、哪些不能 append。 | 本步按 command / consumer / job / relay / cleanup / redline 区分 business audit、marker trace、receipt/report 和 diagnostic。 |
| Step 7 repository / adapter | 已定义 repository / port callable surface,但没有统一日志和指标字段。 | 本步规定 repository / UoW / resolver / backend / handoff / publisher / config adapter 的 log / metric 切口。 |
| Step 8 protocol DTO | 已定义 trace context、audit ref、receipt trace、job report trace、public error,但缺字段 redaction 规则汇总。 | 本步将 DTO 字段映射到允许日志 / 指标 / 审计字段,禁止 raw body / stack trace / secret。 |
| Step 9 flow | 已定义 side effect 顺序,但实现侧可能把 query / duplicate / relay failure 写成业务 audit。 | 本步固定 query no-audit、duplicate no-new-side-effect、relay publish failure no-rollback。 |
| Step 11 transaction | 已定义 audit same UoW append 和 rollback visibility,但未列出 commit / rollback 失败观测。 | 本步固定 UoW begin / commit / rollback / commit unknown 日志和指标。 |
| Step 12 error recovery | 已定义错误分类,但 runtime 定位字段未统一。 | 本步要求所有错误分支至少记录 `error_kind`、safe reason / diagnostic ref 和关联 body-free ref。 |
| Step 13 idempotency | 已定义 duplicate replay 不新增业务 side effect,但 log / metric 切口未显式化。 | 本步固定 duplicate replay 只写 safe replay log / metric,不得追加新 audit / relay / handoff / report item。 |
| Step 14 config / adapter | 已定义 config binding 和 adapter availability,但 startup / degraded / disabled 观测未汇总。 | 本步固定 config validation、runtime builder、adapter availability log / metric / diagnostic 口径。 |

---

## 7. 设计取舍 / 分层原则

| 议题 | 方案 | 取舍 |
|---|---|---|
| runtime log 与 business audit | A. 日志替代 audit;B. accepted truth / marker 写 `SandboxAuditTrace`,日志只做运行定位 | 采用 B。日志不可替代可追溯业务事实。 |
| Query 审计 | A. 每次 query 写审计;B. query no-write,只写 log / metric | 采用 B。保持 Step 9 / Step 11 query no-write。 |
| duplicate replay | A. 重放时追加 replay audit;B. 只写 safe replay log / metric,返回 stored result / receipt / report | 采用 B。避免重复业务审计和二次 side effect。 |
| reference-only consumer trace | A. 为 receipt 统一伪造 subject;B. 无正式 subject 时 `trace_record_ref=None` | 采用 B。符合 consumer receipt trace 来源标准。 |
| metric 定位 | A. 把 request / subject / trace id 放 label;B. label 只放低基数类别,精确定位走 log / trace / ref | 采用 B。防止高基数和敏感泄露。 |
| adapter failure 细节 | A. 保存 raw response / stack trace;B. 保存 redacted diagnostic issue ref | 采用 B。外部正文和 secret 不进入 sandbox。 |
| observability material | A. 由 sandbox 保存 observability store body;B. sandbox 只保存 capture / handoff refs 与 marker | 采用 B。observability store truth 不归 sandbox。 |
| config / startup audit | A. runtime 初始化失败也写业务 audit;B. repository 未初始化前只写 log / metric / diagnostic;初始化后才可写 operations marker | 采用 B。不得为了审计而假设 truth store 可用。 |

---

## 8. 可观测性与审计总原则

| 规则 | 正式口径 |
|---|---|
| TraceContext 来源 | `SandboxTraceContext` 来自 command / query metadata、inbound event envelope 或 job input;domain object 不自行生成 trace context,也不得用 trace id 拼 subject。 |
| Accepted command | 同一 write UoW 内完成 truth save、`SandboxAuditTraceRepository.append_trace`、relay append、projection stale、stored result、idempotency complete 和 cursor 分配;runtime log / metric 在 handler / service boundary 记录。 |
| Rejected command | 若 rejected / unresolved 是正式 sandbox truth,按对应 truth subject 写 audit;若是 validation before reserve、unsupported、not visible 或 boundary before formal subject,只写 log / metric / public error / diagnostic。 |
| Query | 不 begin write UoW,不写 audit、idempotency、relay、projection stale、refresh、handoff、cleanup、redline release;只记录 query log / metric 和 response surface。 |
| Inbound consumer | accepted reference / marker / feedback path 保存 receipt 和 stored result;只有存在正式 subject 且同一 UoW 追加 trace 时 `trace_record_ref` 非空。 |
| Outbound relay | append pending relay 在 source UoW;publish 在独立 relay UoW 更新 relay status / report。publish failure 不回滚 source truth,也不重建 payload。 |
| Handoff | handoff success / retryable / failed 保存 handoff fact / marker / report / receipt refs,不保存 downstream package body、observability ledger body 或 investigation document body。 |
| Job | job report 是 operations surface;job duplicate 返回 stored report;job 不修 core truth,不因 report 需要而重复写业务 audit。 |
| Diagnostic issue | diagnostic 只存 stable code、safe summary、redacted issue ref 和 supporting refs;不得保存 raw request、raw event payload、adapter body、stack trace、secret。 |
| Rollback visibility | rollback 后 truth、audit trace、relay、projection stale、stored result、idempotency complete / failed、cursor 均不可见;日志可以记录 rollback result 但不得当业务事实。 |

---

## 9. 日志埋点表

| 位置 | 日志级别 | 字段 | 目的 |
|---|---|---|---|
| API command handler entry | `info` | `trace_ref`,`command_kind`,`channel`,`actor_ref_optional`,`idempotency_key_hash`,`request_digest_ref` | 追踪写入口与幂等 fingerprint。 |
| API command metadata / boundary validation rejected | `warn` | `trace_ref`,`command_kind`,`error_kind`,`validation_issue_ref`,`redaction_marker_ref` | 定位缺 metadata、body limit、forbidden body、schema / page / version 错误。 |
| Command idempotency reserve result | `debug` / `info` / `warn` | `trace_ref`,`command_kind`,`idempotency_key_hash`,`reservation_result`,`stored_result_ref_optional`,`conflict_ref_optional` | 区分 first-run、duplicate replay、in-flight、conflict。 |
| Command accepted truth change | `info` | `trace_ref`,`command_kind`,`subject_ref`,`truth_change_ref`,`audit_trace_ref`,`relay_record_refs_count`,`stored_result_ref`,`source_cursor_ref`,`duration_ms` | 串联 source truth、audit、relay、stored result 和 cursor。 |
| Command domain rejected / fail-closed | `warn` | `trace_ref`,`command_kind`,`subject_ref_optional`,`domain_error_kind`,`reason_ref`,`diagnostic_ref` | 区分业务拒绝、policy fail-closed 和系统失败。 |
| Query handler completion | `info` / `debug` | `trace_ref`,`query_kind`,`surface_status`,`view_kind_optional`,`page_limit_class`,`duration_ms` | 追踪 visible / empty / not-visible / stale / degraded / missing projection。 |
| Query not visible / restricted | `info` | `trace_ref`,`query_kind`,`actor_kind`,`read_subject_kind`,`visibility_marker_ref_optional` | `actor_kind`只取 core `ActorKind`；记录 redacted read surface，不泄露正文或伪造 Sandbox 私有 authority。 |
| Query degraded / missing projection | `warn` | `trace_ref`,`query_kind`,`view_kind`,`freshness_state`,`degraded_marker_ref`,`source_cursor_ref_optional` | 解释 read-side 降级且不触发 repair。 |
| Inbound consumer envelope rejected | `warn` | `trace_ref`,`consumer_name`,`source_family`,`source_event_ref`,`schema_version`,`error_kind`,`validation_issue_ref` | 定位坏 envelope、unsupported source、forbidden body。 |
| Inbound consumer accepted | `info` | `trace_ref`,`consumer_name`,`source_event_ref`,`source_ref`,`receipt_ref`,`trace_record_ref_optional`,`affected_reference_state_count`,`affected_projection_count`,`source_cursor_ref_optional` | 追踪 consumer mutation、receipt 和 optional trace。 |
| Inbound consumer duplicate replay | `info` | `trace_ref`,`consumer_name`,`dedup_key_hash`,`stored_result_ref`,`receipt_ref` | 证明没有重复写 reference / marker / trace。 |
| Inbound consumer delayed / quarantined | `warn` / `error` | `trace_ref`,`consumer_name`,`source_event_ref`,`disposition`,`error_kind`,`quarantine_marker_ref_optional`,`diagnostic_ref` | 支撑 retry / quarantine / manual inspection。 |
| Context / policy / capability resolver outcome | `debug` / `warn` | `trace_ref`,`resolver_kind`,`source_ref`,`adapter_kind`,`outcome`,`snapshot_ref_optional`,`diagnostic_ref_optional`,`duration_ms` | 追踪 body-free resolution 与 adapter unavailable。 |
| Boundary decision evaluated | `info` / `warn` | `trace_ref`,`context_ref`,`boundary_ref_optional`,`boundary_status`,`backend_profile_ref`,`reason_ref`,`diagnostic_ref_optional` | 解释 resource / filesystem / network / process boundary 是否整体成立。 |
| Policy decision evaluated | `info` / `warn` | `trace_ref`,`context_ref`,`decision_ref_optional`,`policy_status`,`policy_summary_ref_optional`,`reason_ref`,`diagnostic_ref_optional` | 解释 allow / reject / fail-closed / high-risk block。 |
| Isolation backend launch / inspect / release outcome | `info` / `warn` / `error` | `trace_ref`,`backend_adapter_kind`,`context_ref_optional`,`run_ref_optional`,`handle_ref_optional`,`outcome`,`failure_kind_optional`,`diagnostic_ref_optional`,`duration_ms` | 追踪 launch、lifecycle inspection、cleanup release 和 no weak fallback。 |
| Capture recorded / failed | `info` / `warn` | `trace_ref`,`run_ref`,`capture_ref_optional`,`capture_status`,`material_count`,`observability_material_count`,`reason_ref_optional` | 追踪 capture fact,不保存 material body。 |
| Handoff outcome | `info` / `warn` / `error` | `trace_ref`,`handoff_kind`,`handoff_ref`,`target_kind`,`target_ref`,`handoff_status`,`receipt_ref_optional`,`report_ref_optional`,`failure_reason_ref_optional`,`duration_ms` | 追踪 material / observability / investigation handoff,不回滚 source truth。 |
| Relay append / publish outcome | `debug` / `info` / `warn` / `error` | `trace_ref`,`event_kind`,`relay_record_ref`,`relay_status`,`publication_ref_optional`,`dead_letter_reason_ref_optional`,`report_ref_optional`,`duration_ms` | 追踪 source transaction relay append 与 separate publish transaction。 |
| Cleanup guard evaluated | `info` / `warn` | `trace_ref`,`cleanup_ref`,`guard_status`,`evidence_state`,`handoff_state`,`redline_state`,`reason_ref`,`report_ref_optional` | 证明 cleanup 不先删证据。 |
| Lease orphan reaper item | `info` / `warn` / `error` | `trace_ref`,`job_run_ref`,`lease_ref`,`handle_ref_optional`,`orphan_status`,`release_outcome`,`report_item_ref`,`diagnostic_ref_optional` | 追踪 orphan recovery 与 release failure。 |
| Redline detected / contained / release evaluated | `warn` / `error` | `trace_ref`,`redline_ref`,`containment_status`,`investigation_handoff_ref_optional`,`cleanup_blocked`,`reason_ref`,`diagnostic_ref_optional` | 记录安全红线和 containment 事实。 |
| Operations job summary | `info` | `trace_ref`,`job_kind`,`job_run_ref`,`job_status`,`processed_count`,`succeeded_count`,`failed_count`,`skipped_count`,`degraded_count`,`job_report_ref`,`duration_ms` | 汇总后台维护结果。 |
| Operations job item failed / skipped | `warn` | `trace_ref`,`job_kind`,`target_kind`,`target_ref`,`item_status`,`reason_ref`,`report_item_ref`,`diagnostic_ref_optional` | 定位单项失败且不修 core truth。 |
| UoW begin / commit / rollback result | `debug` / `error` | `trace_ref`,`operation_kind`,`uow_phase`,`result`,`error_kind_optional`,`diagnostic_ref_optional` | 定位 transaction failure、commit unknown、rollback failure。 |
| Repository version / unique conflict | `warn` | `trace_ref`,`repository_kind`,`subject_kind`,`subject_ref`,`expected_version_ref_optional`,`error_kind` | 排查 optimistic concurrency 和 duplicate create。 |
| No-write / no-repair violation detected | `error` | `trace_ref`,`operation_kind`,`violation_kind`,`attempted_write_kind`,`diagnostic_ref` | 捕获实现违反 query no-write / job no-repair 红线。 |
| Runtime config validation rejected | `error` | `config_ref_optional`,`profile_ref_optional`,`config_section`,`adapter_slot_optional`,`validation_issue_ref`,`diagnostic_ref` | 防止 config 改写 truth / fail-closed / cleanup / redline 语义。 |
| Runtime builder blocked / degraded | `error` / `warn` | `profile_ref`,`adapter_slot`,`availability_state`,`startup_disposition`,`diagnostic_ref` | 解释启动阻断、consumer disabled、adapter degraded。 |
| Adapter availability changed | `info` / `warn` | `adapter_slot`,`adapter_kind`,`availability_state`,`failure_ref_optional`,`checked_at_ref` | 支撑外部依赖健康观察,不记录 endpoint / secret。 |

### 9.1 日志字段与 redaction 规则

| 字段规则 | 正式要求 |
|---|---|
| trace 字段 | 日志可记录 `trace_ref`、`parent_trace_ref`、`span_ref`,来源为 metadata / event / job envelope;不得在 domain / repository 中重新生成。 |
| key 字段 | `idempotency_key`、`dedup_key` 只允许记录 one-way hash 或 redacted fingerprint,不得记录 caller supplied raw key。 |
| subject 字段 | 只记录 sandbox-owned truth / marker / receipt / report 的 body-free ref,不得拼入 identity / work / tool / runtime / artifact / observability / investigation 正文。 |
| diagnostic 字段 | 只记录 `diagnostic_ref`、`validation_issue_ref`、`redaction_marker_ref`;不得记录 raw SQL、HTTP body、SDK response、panic stack、adapter stdout/stderr body。 |
| material 字段 | 只记录 capture / material / observability material / handoff refs 和数量,不得记录文件内容、archive package body、observability ledger body。 |
| source cursor | 只记录 truth cursor / reference marker cursor / relay cursor ref;不得记录 page cursor、timestamp、trace id、request digest 作为 source cursor。 |
| 日志等级 | 正常 accepted / duplicate / job summary 使用 `info`;高频 adapter success 可用 `debug`;validation/domain/idempotency conflict 使用 `warn`;commit unknown、rollback failure、dead-letter、config reject、redline containment failure 使用 `error`。 |

---

## 10. 指标埋点表

| 指标 | 类型 | 打点位置 | 标签 |
|---|---|---|---|
| `sandbox_command_total` | counter | command handler 返回前 | `command_kind`,`result`,`error_kind` |
| `sandbox_command_duration_ms` | histogram | command handler 包裹 application service | `command_kind`,`result` |
| `sandbox_query_total` | counter | query handler 返回前 | `query_kind`,`surface_status`,`freshness_state` |
| `sandbox_query_duration_ms` | histogram | query handler 包裹 query service | `query_kind`,`surface_status` |
| `sandbox_inbound_event_total` | counter | consumer service / worker 返回前 | `consumer_name`,`source_family`,`disposition` |
| `sandbox_inbound_event_duration_ms` | histogram | worker 包裹 consumer service | `consumer_name`,`disposition` |
| `sandbox_idempotency_total` | counter | reserve / complete / conflict / duplicate / missing result 分支 | `channel`,`operation_group`,`reservation_result` |
| `sandbox_uow_total` | counter | UoW begin / commit / rollback 返回后 | `phase`,`result` |
| `sandbox_repository_error_total` | counter | repository error 映射时 | `repository_kind`,`error_kind` |
| `sandbox_version_conflict_total` | counter | optimistic version conflict 映射时 | `repository_kind`,`subject_kind` |
| `sandbox_boundary_decision_total` | counter | boundary service 决策后 | `boundary_status`,`backend_kind`,`reason_kind` |
| `sandbox_policy_decision_total` | counter | policy service 决策后 | `policy_status`,`reason_kind` |
| `sandbox_backend_capability_total` | counter | capability resolver / refresh item 完成后 | `adapter_kind`,`capability_state`,`result` |
| `sandbox_run_total` | counter | run start / terminal transition 保存后 | `run_status`,`backend_kind`,`failure_kind` |
| `sandbox_run_duration_ms` | histogram | controlled run lifecycle terminal 后 | `run_status`,`backend_kind` |
| `sandbox_capture_total` | counter | capture fact 保存后 | `capture_status`,`material_class`,`result` |
| `sandbox_handoff_total` | counter | handoff fact / marker 保存后 | `handoff_kind`,`target_kind`,`handoff_status` |
| `sandbox_handoff_duration_ms` | histogram | handoff adapter 调用前后 | `handoff_kind`,`target_kind`,`result` |
| `sandbox_relay_append_total` | counter | pending relay append 后 | `event_kind`,`result` |
| `sandbox_relay_publish_total` | counter | publish item 完成后 | `event_kind`,`publish_result` |
| `sandbox_relay_publish_duration_ms` | histogram | publisher port 调用前后 | `event_kind`,`publish_result` |
| `sandbox_cleanup_guard_total` | counter | cleanup guard evaluation 保存后 | `guard_status`,`block_reason_kind` |
| `sandbox_lease_reaper_total` | counter | reaper item 完成后 | `orphan_status`,`release_result` |
| `sandbox_redline_total` | counter | redline detection / containment / release evaluation 后 | `redline_status`,`containment_result` |
| `sandbox_projection_freshness_total` | gauge | projection read / stale / rebuild 后 | `view_kind`,`freshness_state` |
| `sandbox_projection_rebuild_total` | counter | rebuild item 完成后 | `view_kind`,`result` |
| `sandbox_derived_maintenance_total` | counter | derived maintenance item 完成后 | `derived_kind`,`result` |
| `sandbox_reconciliation_total` | counter | reconciliation report 保存后 | `report_status`,`finding_state` |
| `sandbox_job_total` | counter | job runner 返回前 | `job_kind`,`job_status` |
| `sandbox_job_duration_ms` | histogram | job runner 包裹 application job service | `job_kind`,`job_status` |
| `sandbox_job_item_total` | counter | per item report item 形成后 | `job_kind`,`item_status`,`target_kind` |
| `sandbox_no_write_violation_total` | counter | no-write / no-repair guard 触发时 | `operation_group`,`violation_kind` |
| `sandbox_config_validation_total` | counter | config validation 后 | `config_section`,`result` |
| `sandbox_adapter_availability_total` | gauge | adapter availability check 后 | `adapter_slot`,`adapter_kind`,`availability_state` |

### 10.1 指标标签规则

| 规则 | 正式要求 |
|---|---|
| 低基数 | 标签只能使用 kind、state、result、disposition、error category、adapter kind、source family、job kind、handoff kind 等有限集合。 |
| 禁止高基数 | request id、actor id、subject id、trace id、outbox / relay id、marker id、receipt id、report id、payload digest、idempotency key、dedup key、free text 不得作为 metric label。 |
| 禁止敏感值 | secret、token、credential、raw endpoint、transport topic、filesystem path、SQL、HTTP body、adapter response body、raw process output 不得作为 metric label。 |
| 关联定位 | 单记录定位通过 structured log、`SandboxAuditTrace`、receipt / report ref、relay ref、handoff ref 或 diagnostic ref 完成,不通过 metric label 完成。 |
| domain 无指标依赖 | domain object 不直接依赖 metric backend;指标由 api / application service boundary、worker、jobs、infra adapter wrapper 记录。 |

---

## 11. 审计事件表

| 审计事件 | 触发位置 | 记录字段 | 消费方 |
|---|---|---|---|
| `SandboxContextAcceptedAudit` | `OpenControlledExecutionContextFlow` accepted UoW | `audit_trace_ref`,`context_ref`,`actor_ref_optional`,`responsibility_context_ref`,`source_ref_set`,`source_cursor`,`stored_result_ref`,`relay_record_refs` | audit query、status projection、downstream relay |
| `SandboxContextRejectedAudit` | `OpenControlledExecutionContextFlow` formal rejected / unresolved truth UoW | `audit_trace_ref`,`context_ref_optional`,`actor_ref_optional`,`reason_ref`,`rejected_source_ref`,`source_cursor_optional`,`stored_result_ref` | audit query、failure status projection |
| `SandboxEnvironmentIdentityBoundAudit` | `BindExecutionEnvironmentIdentityFlow` / context accepted identity bind | `audit_trace_ref`,`environment_identity_ref`,`context_ref`,`responsibility_anchor_ref`,`identity_status`,`source_cursor` | status projection、runtime / member handoff consumers |
| `SandboxBoundaryDecisionAudit` | `EstablishExecutionBoundaryFlow` accepted / rejected boundary UoW | `audit_trace_ref`,`context_ref`,`boundary_ref`,`boundary_status`,`backend_profile_ref`,`limit_template_ref`,`reason_ref`,`source_cursor`,`relay_record_refs` | status projection、security review、relay consumers |
| `SandboxPolicyDecisionAudit` | `EvaluatePolicyExecutionFlow` accepted / fail-closed / blocked UoW | `audit_trace_ref`,`context_ref`,`decision_ref`,`policy_status`,`policy_summary_ref_optional`,`reason_ref`,`source_cursor`,`relay_record_refs` | status projection、governance / runtime consumers |
| `SandboxRunStartedAudit` | `StartControlledExecutionRunFlow` run enters preparing/running | `audit_trace_ref`,`context_ref`,`run_ref`,`environment_identity_ref`,`boundary_ref`,`decision_ref`,`backend_handle_ref_optional`,`source_cursor` | run status projection、runtime consumers |
| `SandboxRunTerminalAudit` | run completed / failed / terminated / timed out UoW | `audit_trace_ref`,`context_ref`,`run_ref`,`from_state`,`to_state`,`failure_ref_optional`,`reason_ref`,`source_cursor`,`stored_result_ref` | status projection、failure classification、cleanup guard |
| `SandboxCaptureRecordedAudit` | `RecordCaptureResultFlow` capture fact saved | `audit_trace_ref`,`run_ref`,`capture_ref`,`capture_status`,`material_refs`,`observability_material_refs`,`reason_ref_optional`,`source_cursor`,`handoff_ref_optional` | artifact handoff、observability handoff、cleanup guard |
| `SandboxMaterialHandoffAudit` | `OpenMaterialHandoffFlow` / handoff retry / feedback terminal UoW | `audit_trace_ref`,`capture_ref`,`handoff_ref`,`handoff_kind`,`target_ref`,`handoff_status`,`receipt_ref_optional`,`failure_reason_ref_optional`,`source_cursor` | cleanup guard、artifact consumers、audit query |
| `SandboxObservabilityHandoffAudit` | observability material handoff marker saved / updated | `audit_trace_ref_optional`,`capture_ref`,`handoff_ref`,`target_ref`,`handoff_status`,`receipt_ref_optional`,`report_ref_optional`,`source_cursor_optional` | L4-observability handoff consumer、cleanup guard |
| `SandboxFailureClassifiedAudit` | `ClassifySandboxFailureFlow` accepted UoW | `audit_trace_ref`,`context_ref`,`run_ref_optional`,`failure_ref`,`failure_kind`,`failure_status`,`source_markers`,`reason_ref`,`source_cursor`,`relay_record_refs` | failure status projection、security review |
| `SandboxControlRecordedAudit` | `SubmitSandboxControlFlow` accepted / rejected formal control UoW | `audit_trace_ref`,`context_ref`,`control_ref`,`control_kind`,`control_status`,`actor_ref_optional`,`reason_ref`,`source_cursor`,`stored_result_ref` | runtime control consumers、audit query |
| `SandboxCleanupGuardEvaluatedAudit` | `EvaluateCleanupReadinessFlow` / cleanup job guard item UoW | `audit_trace_ref`,`context_ref`,`cleanup_ref`,`guard_status`,`evidence_state`,`handoff_state`,`investigation_state`,`reason_ref`,`source_cursor`,`report_ref_optional` | cleanup / reaper job、security review |
| `SandboxLeaseOrphanReaperAudit` | `RunLeaseOrphanReaperFlow` item UoW | `audit_trace_ref`,`lease_ref`,`handle_ref_optional`,`context_ref_optional`,`orphan_status`,`release_result`,`reason_ref`,`source_cursor`,`job_report_ref` | operations report、security review |
| `SandboxRedlineContainmentAudit` | `RecordRedlineContainmentFlow` / containment job UoW | `audit_trace_ref`,`context_ref`,`redline_ref`,`containment_status`,`investigation_handoff_ref_optional`,`cleanup_blocked`,`reason_ref`,`source_cursor`,`relay_record_refs` | investigation handoff、cleanup guard、audit query |
| `SandboxInvestigationHandoffAudit` | investigation handoff opened / updated / feedback UoW | `audit_trace_ref_optional`,`redline_ref_optional`,`cleanup_ref_optional`,`handoff_ref`,`target_ref`,`handoff_status`,`receipt_ref_optional`,`failure_reason_ref_optional`,`source_cursor_optional` | investigation consumers、cleanup guard |
| `SandboxRelayPublicationAudit` | relay feedback consumer or publish job terminal transition | `audit_trace_ref_optional`,`relay_record_ref`,`event_kind`,`relay_status`,`publication_ref_optional`,`dead_letter_reason_ref_optional`,`source_cursor_optional`,`job_report_ref_optional` | relay status query、operations report |
| `SandboxProjectionFreshnessAudit` | projection stale / rebuild marker saved where formal marker subject exists | `audit_trace_ref_optional`,`projection_ref`,`view_kind`,`freshness_state`,`source_truth_ref`,`source_cursor`,`reason_ref`,`job_report_ref_optional` | query surface、rebuild job |
| `SandboxDerivedMaintenanceAudit` | derived trend / comparison state updated by job | `audit_trace_ref_optional`,`derived_ref`,`derived_kind`,`from_state`,`to_state`,`source_snapshot_ref`,`reason_ref_optional`,`job_report_ref` | derived query、operations report |
| `SandboxReconciliationAudit` | `RunSandboxReconciliationFlow` report saved | `audit_trace_ref_optional`,`report_ref`,`scope_ref`,`report_status`,`finding_count`,`degraded_refs`,`source_cursor_optional`,`stored_result_ref` | reconciliation query、operations report |
| `SandboxDuplicateMissingResultAudit` | duplicate path detects completed idempotency record without stored result and formal issue marker is saved | `audit_trace_ref_optional`,`operation_kind`,`channel`,`idempotency_record_ref`,`diagnostic_ref`,`reason_ref`,`source_cursor_optional` | recovery / diagnostic query |
| `SandboxNoWriteViolationAudit` | query no-write / job no-repair guard creates formal diagnostic marker | `audit_trace_ref_optional`,`operation_kind`,`violation_kind`,`attempted_write_kind`,`diagnostic_ref`,`source_cursor_optional` | development gate、reconciliation |
| `SandboxConfigValidationAudit` | runtime config validation creates durable operations diagnostic after store is available | `audit_trace_ref_optional`,`config_ref`,`profile_ref`,`config_section`,`validation_issue_ref`,`startup_disposition`,`diagnostic_ref` | operations query、configuration review |
| `SandboxAdapterAvailabilityAudit` | adapter availability marker saved by operations job / runtime registry | `audit_trace_ref_optional`,`adapter_slot`,`adapter_kind`,`availability_state`,`failure_ref_optional`,`checked_at_ref`,`job_report_ref_optional` | operations query、runtime builder review |

审计事件命名是详细设计中的业务审计意图,实现时可以映射为 `SandboxAuditTrace.trace_kind` + `reason` + `source_ref` + typed subject refs 的组合,不得额外创建未在 Step 6 / Step 7 闭口的第二套 audit object。

---

## 12. Trace / Audit Subject 与 Source Cursor 规则

| 项 | 正式规则 | 禁止替代 |
|---|---|---|
| trace subject | 必须来自 sandbox-owned truth ref、formal marker ref、receipt/report ref 或已定义 marker subject helper。 | 外部 definition ref、raw source ref、target string、job name、run id、trace id、idempotency key、hard-coded string。 |
| `SandboxAuditTrace.trace_ref` | 由 `SandboxIdGeneratorPort.next_trace_ref` 或正式 trace factory 分配,通过 repository append 返回。 | request id、event id、trace context ref、timestamp、hash(source)。 |
| `SandboxAuditTrace.source_ref` | 指向引发该 trace 的 source truth / marker / receipt / report / diagnostic ref。 | raw request body、payload body、adapter response body、external document。 |
| `SandboxTraceKind` | 使用 Step 6 enum: `Intake`,`Boundary`,`Policy`,`Run`,`Capture`,`Handoff`,`Failure`,`Cleanup`,`Redline`,`Projection`,`Relay`,`Job`。 | 临时字符串或下游 topic 名。 |
| source cursor | accepted truth change 使用 `assign_truth_change_cursor()`;reference-only marker 使用 `assign_reference_marker_cursor()`;relay publish 使用 relay transaction cursor。 | page cursor、repository version、timestamp、trace id、request digest、event dedup key。 |
| same UoW | accepted truth / formal marker 的 `SandboxAuditTrace` 必须与 source object 同 UoW append;append 失败则 source mutation rollback。 | commit 后补 trace、query 触发补 trace、日志替代 trace。 |
| rollback | rollback 后 audit trace、relay、stored result、cursor 均不可见。 | fake 保留 staged trace 或 cursor 泄露到 receipt。 |
| public error trace | `SandboxPublicErrorDto.trace_ref` 使用 metadata trace ref 或已存在 audit trace ref;不得为了错误返回创建业务 audit。 | validation error 临时写 accepted audit。 |

---

## 13. Consumer / Job / Handoff Trace 规则

| Flow / 场景 | trace / audit 规则 | receipt / report 规则 |
|---|---|---|
| `ConsumeCallerContextReferenceChangedFlow` | reference-only;默认不追加 `SandboxAuditTrace`,除非后续正式定义 reference marker subject helper。 | `trace_record_ref=None`;receipt 保存 affected reference / projection refs。 |
| `ConsumePolicySummaryChangedFlow` | reference-only;不得把 policy summary ref 伪装成 policy decision audit subject。 | `trace_record_ref=None`;missing / stale 可 delayed / rejected receipt。 |
| `ConsumeBackendCapabilitySummaryChangedFlow` | reference-only;不得创建 boundary accepted audit。 | `trace_record_ref=None`;receipt 保存 backend reference state / projection refs。 |
| `ConsumeIsolationBackendLifecycleSignalFlow` | 只有写 orphan / lease / failure formal safety truth 时 append audit;缺 relation delayed 不写业务 trace。 | safety truth 写入时 receipt 可填 trace ref;delayed / duplicate 按 stored receipt。 |
| `ConsumeMaterialHandoffStatusChangedFlow` | 匹配 existing `HandoffFact` 并更新 status 时 append `Handoff` audit;target mismatch quarantine 不写 accepted audit。 | matched accepted 填 trace ref;quarantine 写 quarantine marker / diagnostic。 |
| `ConsumeObservabilityHandoffStatusChangedFlow` | 只记录 observability handoff marker;若 marker subject 未正式定义则 audit optional None。不得保存 observability store truth。 | receipt 可 `trace_record_ref=None`;必须记录 receipt / marker refs。 |
| `ConsumeSandboxControlRequestedFlow` | 进入 formal control command path;审计由 command path 产生,consumer 本身不绕过 command guard。 | consumer receipt 引用 command result / stored receipt;duplicate 不重跑 command。 |
| `ConsumeInvestigationHandoffStatusChangedFlow` | 只有匹配 cleanup / redline formal truth 并更新 handoff marker 时 append audit;不直接 release containment。 | mismatch quarantine;accepted receipt 可填 trace ref。 |
| `ConsumeSandboxTruthRelayFeedbackFlow` | 更新 relay record terminal / retryable status 时可 append relay trace;不得触碰 source truth。 | receipt / job report 记录 relay ref、status 和 diagnostic refs。 |
| `PublishSandboxEventRelayFlow` | source audit 已在 source UoW;publish job 只写 relay publication marker / optional relay audit。 | job report item 记录 delivered / retryable / dead-letter refs;duplicate report 不重新 publish。 |
| `RetryPendingMaterialHandoffsFlow` | 更新 `HandoffFact` 时 append handoff audit;adapter failure 只写 retryable / failed marker。 | job report item 记录 handoff ref / failure ref;不回滚 capture。 |
| `RunLeaseOrphanReaperFlow` | release / orphan status 写 safety truth 时 append cleanup / job audit;release adapter failure 不伪造 success。 | report item 记录 skipped / failed / released refs。 |
| `MaintainRedlineContainmentHandoffsFlow` | redline containment / investigation handoff marker 更新时 append redline / handoff audit。 | report item 记录 handoff / containment refs;不自动 release。 |
| Job duplicate replay | 不追加新的 audit、handoff、relay 或 report item。 | 返回 stored `SandboxJobReportDto` 并记录 replay log / metric。 |

---

## 14. 禁止字段 / Forbidden Observability Table

| 载体 | 禁止字段 / 内容 | 允许替代 |
|---|---|---|
| runtime log | raw request body、raw event payload、raw command DTO body dump、adapter response body、stdout/stderr body、stack trace、secret、credential、raw endpoint、filesystem content。 | `diagnostic_ref`,`redaction_marker_ref`,`payload_digest`,`safe_reason_ref`,`body-free refs`。 |
| metric label | request id、actor id、subject id、trace id、relay id、marker id、receipt id、report id、payload digest、idempotency key、dedup key、free text、secret、raw endpoint、topic name。 | kind / state / result / disposition / error category / adapter kind。 |
| `SandboxAuditTrace` | external document body、policy DSL、approval workflow body、tool semantic result、runtime recover body、artifact body、observability ledger body、archive package body、investigation document body。 | source refs、state enum、reason ref、source cursor、receipt / report ref、redacted issue ref。 |
| `SandboxConsumerReceiptDto` | raw event body、transport delivery body、external source snapshot body、policy body、backend response body。 | source_event_ref、dedup key fingerprint in log only、payload_digest、affected refs、quarantine marker ref。 |
| `SandboxJobReportDto` | adapter raw failure body、external package body、raw material,unbounded list dump。 | item refs、counts、safe reason refs、diagnostic refs、next cursor。 |
| handoff marker | downstream package body、observability ledger body、archive tar body、investigation document body、secret / credential。 | package ref、target ref、receipt ref、failure reason ref、redacted issue ref。 |
| public error | SQL、IO path details、HTTP / SDK raw body、panic stack、fake-only error、secret。 | `SandboxPublicErrorKind`,`safe_reason`,`retryable`,`source_ref`,`trace_ref`,`redaction_marker`。 |

---

## 15. Historical Material / Blocker

| ID | 类型 | 状态 | 描述 | 本步处理 |
|---|---|---|---|---|
| SBX-DDD-OBSERVABILITY-001 | blocker | resolved_for_step_15 | Step 6~14 已分别定义 trace、protocol、flow、transaction、error、idempotency 和 config,但缺少统一 log / metric / audit 埋点契约,实现侧可能自行把日志、audit、report、handoff、diagnostic 混用。 | 本步已按 runtime log、metric、`SandboxAuditTrace`、relay marker、handoff marker、job report、diagnostic issue 分层闭口。 |
| SBX-DDD-OBS-HIST-001 | historical_material | contained_as_historical_material | 旧 README / 旧 `03` 的 audit event、observability hint、Docker/gVisor log、provider bridge 和 artifact evidence 线索可能误导为当前观测事实。 | 本步未继承旧观测事件或后端日志口径,只按正式 `00/01/02` 和 Step 6~14 重建。 |
| SBX-DOC-GAP-001 | downstream_gap | open_downstream | 正式 `04-配置设计.md` 缺失,无法在本步写告警阈值、采样率、profile、endpoint、topic、secret 或 adapter health probe。 | 不阻塞 Step 15;后续 `04` 承接 config / observability operations details。 |
| SBX-DOC-GAP-002 | downstream_gap | open_downstream | 正式 `07-实施计划.md` 缺失,尚不能创建 implementation ledger 和 planned boundary skeleton。 | 不阻塞 Step 15;后续进入 `07` 时创建。 |

---

## 16. 回填草稿: `03-详细设计.md` §14

> 以下为 Step 19 装配正式 `03-详细设计.md` 时的候选正文草稿。当前 Step 不直接修改正式 `03-详细设计.md`。

L4-sandbox 的可观测性分为 runtime log、metric、business audit trace、relay / handoff marker、job report 和 diagnostic issue 六类。它们可以通过 `SandboxTraceContext`、body-free refs、source cursor、receipt / report ref 串联,但不能互相替代。Accepted sandbox-owned truth change 必须在同一 UoW 中追加 `SandboxAuditTrace`;query no-write、duplicate replay、unsupported event、validation reject 和 adapter unavailable 不得伪造成 accepted audit。

日志埋点由 API / worker / job entry、application service boundary、repository / UoW wrapper、infra adapter wrapper 和 runtime builder 负责。日志字段只允许记录 trace ref、operation kind、actor / subject safe ref、status、error kind、safe reason ref、diagnostic ref、receipt / report / marker ref、duration 和 counts。日志禁止保存 raw request、raw event payload、adapter response body、stack trace、credential、secret、observability ledger body、archive package body 或 external document body。

指标埋点覆盖 command、query、consumer、idempotency、UoW、repository、boundary、policy、backend、run、capture、handoff、relay、cleanup、redline、projection、derived、reconciliation、job、config validation 和 adapter availability。Metric label 只能使用低基数 kind / state / result / disposition / error category / adapter kind,不得使用 request id、actor id、subject id、trace id、relay id、marker id、payload digest、free text、secret 或 raw endpoint。

业务审计以 `SandboxAuditTrace` 和 formal marker / report 为载体。`SandboxAuditTrace` 字段只记录 `trace_ref`、`subject_ref`、`trace_kind`、`source_ref`、`occurred_at`、`reason` 和必要 body-free refs。Reference-only consumer 默认 `trace_record_ref=None`;只有存在正式 trace subject 且在同一 UoW 中写入 sandbox-owned truth 或 formal marker 时才填充 trace ref。Job duplicate replay 只返回 stored report,不得追加新的 audit、relay、handoff 或 report item。

---

## 17. Step 16 Handoff

| 交给 Step 16 的测试切口 | 来源 |
|---|---|
| command accepted path 必须同时验证 truth、audit trace、relay / stored result、log / metric 切口 | §8、§9、§10、§11 |
| query no-write 必须验证不 begin write UoW、不 append audit、不 mark stale、不触发 adapter | §8、§9、§13 |
| duplicate replay 必须验证不追加业务 audit / relay / handoff / report item,只写 replay log / metric | §8、§13 |
| reference-only consumer 必须验证 `trace_record_ref=None` 且不伪造 subject | §13 |
| handoff / relay / backend adapter failure 必须验证 no-rollback、diagnostic redaction 和 safe log / metric | §9、§11、§14 |
| metric label redaction 必须验证无 high-cardinality refs / secret / raw endpoint | §10、§14 |
| log / diagnostic redaction 必须验证无 raw body / stack trace / secret / external package body | §9.1、§14 |
| cleanup / reaper / redline 必须验证 audit trace、report item 和 guard / containment log / metric | §9、§10、§11 |
| config validation / adapter availability 必须验证 startup blocked / degraded log / metric,不创建业务 audit before store | §9、§10、§15 |

---

## 18. 待确认事项

| 待确认项 | 当前处理 | 是否阻塞 Step 16 |
|---|---|---|
| 观测后端、OTel exporter、日志 sink、metric backend 产品 | 留给 `04-配置设计.md` / 运维手册 / 实施计划。 | 否 |
| 告警阈值、dashboard、SLO、采样率、日志保留 | 留给运维手册 / 配置设计。 | 否 |
| reference marker subject helper 是否正式定义 | 当前不定义;reference-only consumer 默认 `trace_record_ref=None`。 | 否 |
| `SandboxConfigValidationAudit` 是否在 startup 前持久化 | 仅当 store 可用且 formal diagnostic marker 已定义时可写;否则只写 log / metric / diagnostic output。 | 否 |
| 物理 diagnostic store / issue ref 格式 | 后续 `04/07` 承接,当前只要求 redacted diagnostic ref。 | 否 |

---

## 19. 自检

| 检查项 | 结论 |
|---|---|
| 是否输出日志埋点表 | 通过。见 §9。 |
| 是否输出指标埋点表 | 通过。见 §10。 |
| 是否输出审计事件表 | 通过。见 §11。 |
| 是否回答 SOP 五个问题 | 通过。见 §5。 |
| 是否区分 log / metric / audit / relay / handoff / job report / diagnostic | 通过。见 §8、§11、§13。 |
| 是否保护 query no-write | 通过。Query 只写 log / metric,不写 audit 或 side effect。 |
| 是否保护 duplicate replay | 通过。Duplicate replay 不新增业务 audit / relay / handoff / report item。 |
| 是否保护 consumer trace 来源 | 通过。Reference-only consumer 默认 `trace_record_ref=None`。 |
| 是否禁止 raw body / secret / stack trace / external body | 通过。见 §9.1、§10.1、§14。 |
| 是否混入运维告警阈值 / dashboard / 采样率 | 未混入。 |
| 是否修改正式 `03-详细设计.md` | 未修改。本步只创建中间产物。 |
| 是否创建 Step 16 文件 | 未创建。 |

---

## 20. 进入下一步条件

```text
Step 15 已完成并停在用户审查点。
用户确认本文件后,才允许进入 Step 16 `定义测试切口与最小验证清单`。
进入 Step 16 前必须读取:
1. `project_execution_ledger.md`
2. `03_ddd_calibration_flow.md`
3. `03_ddd_step_15_observability_audit.md`
4. `03_ddd_step_05_module_contracts.md`
5. `03_ddd_step_08_protocol_contracts.md`
6. `03_ddd_step_09_function_flows.md`
7. `03_ddd_step_10_state_matrix.md`
8. `03_ddd_step_11_persistence_transaction_consistency.md`
9. `03_ddd_step_12_error_recovery.md`
10. `03_ddd_step_13_concurrency_idempotency.md`
11. 详细设计 SOP Step 16
12. 详细设计书写规范 §5.15
```
