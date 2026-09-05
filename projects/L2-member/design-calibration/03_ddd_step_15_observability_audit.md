# Step 15. 可观测性与审计埋点契约

> 对应 SOP: `standards/document/详细设计讨论流程_SOP.md` Step 15
> 书写规范: `standards/document/详细设计书写规范.md` §5.14
> 粒度参考: `projects/L1-governance/design-calibration/03_ddd_step_15_observability_audit.md`

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 15 可观测性与审计埋点契约 |
| 当前状态 | in_progress;本次补齐审计记录、trace / span、redaction、跨 Step 审计和正式回填草稿 |
| 输入基线 | 当前正式 `00/01/02`、Step 1~14 以及当前可引用的上游 / sibling 材料 |
| 输出文件 | `projects/L2-member/design-calibration/03_ddd_step_15_observability_audit.md` |
| 写入范围 | member-local structured log、metric、runtime span、local audit proof、redaction 和现有对象 / Port 的绑定点 |
| 明确非范围 | 告警阈值、SLO、dashboard、采样率、保留周期、观测 backend、运行手册、真实 topic / route、transport ack、DLQ、外部 audit ledger、evidence / verdict / readiness |
| 停审方式 | 依 SOP 问题、日志表、指标表、审计表、span / redaction、跨 Step 审计和回填草稿逐项收束后立即停审 |

## 2. 本步目标与边界

本 Step 让实现者能够在不扩大 `L2-member` 职责的前提下，判断每个入口、服务和 technical seam 应在何处产生可定位的运行观测，以及哪些已提交的 member-local fact / successor / receipt / report 可以形成业务可追溯的审计证明。

本仓不拥有 L4 observability backend、完整日志体、外部 audit ledger、evidence body 或外部 delivery / observed truth。因此本 Step 的“审计事件”是 **member-local logical audit record**：它由已定义的 immutable fact、attempt / gap successor、`InteractionTraceEntry`、projection state / safe diagnostic view、typed receipt、typed stored result 或 `MemberJobReport` 的 ref 和安全状态组成；它不是新建的 `MemberAuditTrail` domain object，不是 `L0-bus` outbound event，也不授权 publisher、outbox、topic、route、DLQ 或 delivery receipt。

`InteractionTraceEntry` 是 CP05 的业务关联链，不是 runtime span body；runtime span / structured log 也不能替代 committed local fact、typed replay carrier 或 trace / gap 事实。`Submitted`、`FeedbackLinked`、`Blocked`、`Waiting`、`Unknown` 均仅是本仓可证明的本地状态，绝不写成 host accepted、Runtime run、downstream delivered、observability backend observed 或 evidence 已产生。

## 3. 本步输入

| 输入 | 状态 | 本 Step 的使用方式 |
|---|---|---|
| `03_ddd_step_05_module_contracts.md` | 已完成 | 固定 `contracts/domain/application/infra/api/worker/jobs` 七模块以及 CP01~CP07 的观测归属 |
| `03_ddd_step_06_object_contracts.md` | 已完成 | 固定 `MemberOperationContext`、`StoredMemberOperationResult`、`InteractionTraceEntry`、attempt / gap、projection / diagnostic 和 body-free 对象边界 |
| `03_ddd_step_07_trait_port_adapter_contracts.md` | 已完成 | 固定 Store、UoW、idempotency、typed result、resolver、handoff、technical Port 和 fake 边界 |
| `03_ddd_step_08_protocol_contracts.md` | 已完成 | 固定 10 Command、16 Query、14 Consumer、5 Job、metadata、receipt / report 和 24 个 blocked candidate |
| `03_ddd_step_09_function_flows.md` | 已完成 | 固定 fresh / duplicate / no-write / external fence / partial Job 的写入顺序 |
| `03_ddd_step_10_state_matrix.md` | 已完成 | 固定 CP01~CP07、application / infra / entry disposition 的状态名称与非法迁移口径 |
| `03_ddd_step_11_persistence_transaction_consistency.md` | 已完成 | 固定 local truth、append-only trace、successor、UoW、version、stored carrier 与 projection consistency |
| `03_ddd_step_12_error_recovery.md` | 已完成 | 固定 rejected、blocked、waiting、unknown、conflict、commit unknown 的安全结果 |
| `03_ddd_step_13_concurrency_idempotency.md` | 已完成 | 固定 digest、reservation、duplicate replay、CAS、partial Job 与重入保护 |
| `03_ddd_step_14_configuration_external_bindings.md` | 已完成 | 固定 raw config 隔离、runtime builder、adapter availability、blocked seam 与唯一 Core compile dependency |

## 4. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 哪些处理流必须记录审计？ | accepted Command、accepted Consumer、已提交 committed-fact trace / projection continuation、attempt / gap successor、mirror resolution / gap、projection state successor 和 Job report 必须形成 member-local audit proof。具体写入以 Step 9 / 11 已授权的 local fact、typed receipt / result / report 为准；Query 不写业务 audit。 |
| 哪些错误分支必须记录日志？ | entry validation、body gate、domain reject、blocked / waiting / unknown seam、idempotency duplicate / conflict / in-flight / carrier missing、Store / version / UoW 失败、resolver / handoff 失败、projection / mirror / Job partial、config validation 和 adapter slot unavailable 都必须有结构化日志。 |
| 哪些关键路径需要指标？ | Command、Query、Consumer、Job、idempotency、Store / UoW conflict、owner-specific resolver、handoff、projection / mirror freshness、runtime builder / adapter availability 需要计数、耗时或状态 gauge。 |
| 日志、指标、审计字段分别记录什么？ | 日志记录安全 ref、有限 operation / channel / state / disposition / error kind、duration、count、one-way key fingerprint 和 redacted diagnostic ref；指标只记录低基数 kind / state / outcome label；审计只记录已提交 local object / successor / receipt / result / report ref、state transition、safe reason、source / boundary ref、actor ref 与 inherited `trace_id`。 |
| 哪些监控和告警细节留给运维手册？ | 告警阈值、SLO、dashboard、sampling、retention、backend、sink、pager、runbook、endpoint health、secret manager、真实 broker / IPC / HTTP 细节留给后续运维、配置或实施文档。 |

## 5. 当前材料诊断与设计取舍

| 位置 | 已有结论 / 缺口 | 本 Step 处理 |
|---|---|---|
| Step 6 CP05 / CP07 | `InteractionTraceEntry`、gap、observation material / attempt 和 diagnostics 已定义，但未区分业务 trace 与 runtime span | 固定二者一对多关联而不互相复制 body |
| Step 7 / 11 | Store、UoW、result、resolver、handoff 已有 Port / transaction 口径，但无统一埋点位置 | 以 application / infra boundary 为唯一 instrumentation point；domain 不依赖 metric backend |
| Step 8 / 9 | 10/16/14/5 流程已有 metadata、replay 和错误路径，但入口观测未聚合 | 为 API、worker、jobs、named service 和 builder 给出同一有限字段集 |
| Step 12 / 13 | unknown、commit unknown、duplicate 和 missing carrier 已 fail closed | 明确它们只产生 operations log / metric / permitted local diagnostic，不伪造成 accepted audit |
| Step 14 | config 与 external slots 已 body-free，但 raw config 泄露风险尚需观测规则 | 限制 config observability 到 source / section / slot / safe issue ref |

| 议题 | 取舍 |
|---|---|
| 业务审计载体 | 使用既有 local fact / successor、`InteractionTraceEntry`、receipt / result / report、projection / diagnostic ref；不增加 generic audit ledger 或新跨仓 event。 |
| accepted Command 的追溯 | 以 committed local object ref、state transition、same-UoW typed result 和适用 trace / projection ref 表达；并非每个 Command 都强制创建 CP05 trace。 |
| Query 观测 | 允许 log / metric / span，但 `assert_query_no_write` 不变；不得写 audit、reservation、result、projection repair、refresh 或 reconciliation。 |
| 24 outbound semantic candidates | 只能记录 `Blocked(L2M-UP-005)` 的安全 boundary log / metric；不能因此创建 event、publisher、outbox、route、DLQ 或 candidate audit carrier。 |
| external handoff | 用已保存 material / attempt / gap / feedback ref 追溯本地调用；`Completed` 也不是 downstream success proof。 |

## 6. 可观测性与审计总原则

| 规则 | 正式口径 |
|---|---|
| context 来源 | `MemberOperationContext.trace_id` 必须从已验证 Command / Query metadata、Consumer envelope 或 logical Job metadata 继承；domain、adapter、fake 不得生成替代 trace。 |
| accepted 非 Query | 先遵守 Step 11 的 `validate -> begin -> digest -> reserve -> local fact/successor -> typed carrier -> complete -> commit`；只对 commit 可证明的 local result 写 accepted audit proof。 |
| rejected / pre-gate | body gate、invalid metadata、unsupported schema、非法状态迁移或 invalid contract 只写 warn / error log、metric 和允许的 typed rejection；不得写 accepted fact / trace / projection / handoff audit。 |
| duplicate / conflict / in-flight | duplicate 只 replay exact typed carrier，记录 replay log / metric；conflict / in-flight 不进入 service body，不新增 local audit fact。 |
| Query no-write | Query 的 span / log / metric 在 entry/application boundary 结束；不以“访问审计”为由写 Store 或更新 freshness。 |
| Consumer | accepted Consumer 仅审计其已提交 local fact、safe snapshot / resolution、attempt feedback link、trace append 或 affected projection successor 与 receipt；unsupported / forbidden body 不解析、不保存正文。 |
| Job | Job 只审计已提交的 item-level local successor、safe unresolved ref、`MemberJobReport` 和 report disposition；它不是 scheduler run、test result、artifact、evidence 或 readiness。 |
| runtime / host / handoff | span 记录 local boundary invocation 和 safe outcome；外部 `Blocked` / `Waiting` / `Unknown` 不升级为 positive state，unknown 不能驱动盲重试。 |
| dependency classification | Core compile、runtime / host、event collaboration、ref / supply、adapter 和 fake 分类保持 Step 3 / 14 原样；metric / log 不能把它们伪装成 Cargo dependency 或 integration evidence。 |

## 7. 日志埋点表

| 位置 | 日志级别 | 字段 | 目的 |
|---|---|---|---|
| `api` Command entry | `info` | `trace_id`, `channel=command`, `operation_name`, `actor_ref`, `subject_ref`, `idempotency_key_hash` | 定位 10 个 Command 的受理边界；不记录 body。 |
| Command metadata / subject / canonical-input reject | `warn` | `trace_id?`, `operation_name`, `safe_error_kind`, `validation_issue_ref`, `diagnostic_ref?` | 区分 pre-gate invalid 与 domain / Port error；不 reserve。 |
| Command reserve outcome | `debug` / `info` | `trace_id`, `operation_name`, `reservation_state`, `idempotency_key_hash`, `result_ref?` | 证明 fresh、duplicate、in-flight 或 conflict 分支。 |
| Command accepted local commit | `info` | `trace_id`, `operation_name`, `subject_ref`, `changed_fact_refs`, `from_state?`, `to_state?`, `result_ref`, `projection_state_refs?`, `duration_ms` | 关联 committed local fact、typed result 和派生影响。 |
| Command rejected / blocked / waiting / unknown | `warn` | `trace_id`, `operation_name`, `subject_ref`, `disposition`, `safe_reason_category`, `blocker_id?`, `diagnostic_ref?` | 显示 fail-closed 结果，避免写成成功。 |
| Query entry / completion | `debug` / `info` | `trace_id`, `channel=query`, `operation_name`, `actor_ref`, `subject_ref?`, `surface_kind`, `serve_disposition?`, `duration_ms` | 定位 16 个只读查询及其 safe surface。 |
| Query not-visible / stale / degraded / unavailable | `info` / `warn` | `trace_id`, `operation_name`, `projection_kind?`, `serve_disposition`, `projection_state_ref?`, `safe_reason_category?` | 解释读取面，不触发 repair。 |
| `worker` Consumer pre-gate | `warn` | `trace_id?`, `consumer_name`, `source_kind`, `source_ref`, `schema_version`, `safe_error_kind` | 定位 source / version / body gate，禁止输出 event payload。 |
| Consumer accepted / duplicate | `info` | `trace_id`, `consumer_name`, `source_ref`, `dedup_key_hash`, `receipt_ref`, `changed_fact_refs?`, `projection_state_refs?` | 证明 accepted local write 或 exact replay。 |
| Consumer delayed / rejected / unknown | `warn` | `trace_id`, `consumer_name`, `source_ref`, `disposition`, `safe_reason_category`, `diagnostic_ref?` | 记录非正向 receipt，不声称 ack / DLQ。 |
| `jobs` entry / summary | `info` | `trace_id`, `job_kind`, `job_invocation_ref`, `idempotency_key_hash`, `disposition`, `advanced_count`, `unresolved_count`, `report_ref`, `duration_ms` | 汇总五类逻辑 Job 的 local report。 |
| Job item conflict / partial / failed | `warn` / `error` | `trace_id`, `job_kind`, `item_kind`, `safe_error_kind`, `affected_ref`, `safe_reason_category`, `report_ref?` | 定位 item-level failure；不输出 item body。 |
| Store / UoW boundary | `warn` / `error` | `trace_id`, `operation_name`, `store_kind`, `uow_phase`, `expected_version?`, `safe_error_kind`, `diagnostic_ref?` | 定位 version conflict、begin / commit / rollback / carrier mismatch。 |
| idempotency carrier missing / wrong relation | `error` | `trace_id`, `operation_name`, `reservation_ref`, `result_ref?`, `result_kind?`, `safe_error_kind` | 暴露 consistency defect；禁止重算 carrier。 |
| owner-specific resolver | `debug` / `warn` | `trace_id`, `resolver_kind`, `source_owner_kind`, `source_ref`, `resolution_disposition`, `duration_ms`, `diagnostic_ref?` | 记录 safe resolution，不复制 owner body。 |
| host / Runtime / publication / observation handoff | `info` / `warn` | `trace_id`, `handoff_kind`, `attempt_ref?`, `boundary_ref?`, `submission_ref?`, `local_status`, `safe_reason_category?` | 证明 local invocation / fence，非 external acceptance。 |
| projection / mirror successor | `info` / `warn` | `trace_id`, `projection_kind?`, `projection_state_ref?`, `resolution_ref?`, `gap_ref?`, `from_state?`, `to_state?`, `duration_ms` | 解释 stale / current / degraded / unresolved 的本地变化。 |
| `infra::config` / runtime builder | `warn` / `error` | `config_source_ref`, `config_section`, `adapter_slot?`, `availability_state?`, `validation_issue_ref`, `diagnostic_ref?` | 记录验证失败或 blocked slot，禁止 raw config / credential。 |

### 7.1 日志字段纪律

| 规则 | 要求 |
|---|---|
| high-cardinality 关联 | `trace_id`、request / result / receipt / report / source / attempt / gap / projection ref 仅可出现在结构化日志、span 或 local audit proof，不得成为 metric label。 |
| key fingerprint | idempotency / dedup key 只记录 one-way hash 或脱敏 fingerprint；原 key 不得写日志、diagnostic、audit 或 view。 |
| error 表达 | 只能记录 `MemberContractError` / `DomainError` / `ApplicationError` / `MemberPortError` / `JobError` 的有限 kind、`SafeReasonCategory` 和 redacted diagnostic ref；不得透传 adapter exception / stack trace。 |
| sampling | 任何 sampling 由运维 owner 决定；实现不得以关闭日志为由跳过 local fact / result / receipt / report 的持久化。 |
| domain 独立性 | `domain` 和 `contracts` 不引用 logger / metrics SDK；埋点由 api / worker / jobs、application orchestration 或 infra boundary 发出。 |

## 8. 指标埋点表

| 指标 | 类型 | 打点位置 | 标签 |
|---|---|---|---|
| `l2_member_operation_total` | Counter | Command / Query application completion | `channel`, `operation_name`, `disposition` |
| `l2_member_operation_duration_seconds` | Histogram | Command / Query application completion | `channel`, `operation_name`, `disposition` |
| `l2_member_idempotency_reservation_total` | Counter | `MemberIdempotencyStore::reserve` outcome | `channel`, `operation_name`, `reservation_state` |
| `l2_member_stored_carrier_issue_total` | Counter | typed result / receipt / report relation check | `channel`, `result_kind`, `issue_kind` |
| `l2_member_store_write_total` | Counter | Store / UoW commit result | `store_kind`, `operation_group`, `outcome` |
| `l2_member_store_conflict_total` | Counter | expected-version / unique / consistency failure | `store_kind`, `conflict_kind` |
| `l2_member_consumer_total` | Counter | worker Consumer completion | `consumer_name`, `source_kind`, `disposition` |
| `l2_member_consumer_duration_seconds` | Histogram | worker Consumer completion | `consumer_name`, `disposition` |
| `l2_member_resolution_total` | Counter | owner-specific resolver completion | `resolver_kind`, `source_owner_kind`, `resolution_disposition` |
| `l2_member_handoff_total` | Counter | host / Runtime / publication / observation Port return | `handoff_kind`, `local_status` |
| `l2_member_projection_transition_total` | Counter | projection state successor save | `projection_kind`, `to_state`, `reason_category` |
| `l2_member_mirror_transition_total` | Counter | resolution / gap successor save | `resolution_kind`, `to_state`, `reason_category` |
| `l2_member_job_total` | Counter | Job report completion | `job_kind`, `disposition` |
| `l2_member_job_item_total` | Counter | Job item processing | `job_kind`, `item_kind`, `outcome` |
| `l2_member_job_duration_seconds` | Histogram | Job report completion | `job_kind`, `disposition` |
| `l2_member_config_validation_total` | Counter | config loader / builder validation | `config_section_kind`, `outcome` |
| `l2_member_adapter_availability` | Gauge | builder slot availability transition / observed check | `adapter_kind`, `availability_state` |
| `l2_member_outbound_candidate_blocked_total` | Counter | any 24 semantic candidate boundary attempt | `candidate_cp`, `blocker_id=L2M-UP-005` |

### 8.1 指标字段纪律

1. 标签只允许有限 enum / small controlled vocabulary：channel、operation name、consumer name、job kind、CP、state、disposition、error / conflict kind、adapter kind、owner kind、projection kind 和 blocker ID。
2. `ProjectMemberRef`、`GlobalMemberRef`、actor、trace、request、source event、idempotency key、digest、result / receipt / report / attempt / gap / view ref、timestamp、endpoint、route、topic、free text、secret 与 raw configuration 均不得作为 label。
3. 单次关联查询必须通过 structured log、span 或 local typed ref，而不是扩张 metric cardinality。`safe_reason_category` 仅当其是固定有限 enum 时可作为 label；自由文本不允许。
4. 指标是 runtime telemetry，不是 business audit，也不证明 host / Runtime / downstream / observability backend 已接受任何交接。

## 9. member-local 审计记录表

下表中的名称是实现可查询或可关联的**逻辑审计记录类别**，而不是新增 Rust
domain type、`L0-bus` event、publisher payload 或任何已发生的交付证据。记录只能由
Step 6、7、8、9、11 已定义且已经提交的 fact / successor / trace / receipt / result /
report / safe diagnostic ref 组成；若对应对象尚未提交，不能伪造一条 accepted 审计记录。

| 审计记录 | 触发位置 | 记录字段 | 消费方 |
|---|---|---|---|
| `MemberPresenceLocalAudit` | `RegisterMemberPresence`、`UpdateMemberPresence` 或 host-signal Consumer 在本地 presence successor 提交后 | `trace_id`, `actor_ref?`, `ProjectMemberRef`, `GlobalMemberRef`, `presence_fact_ref`, `from_state?`, `to_state`, `safe_host_boundary_ref?`, `result_or_receipt_ref` | CP01 查询、member-local operations 诊断 |
| `InboundScreeningLocalAudit` | 入站筛选 Command / Consumer 提交筛选 disposition、safe snapshot 或 gap successor 后 | `trace_id`, `subject_ref`, `screening_state_ref`, `from_state?`, `to_state`, `rule_snapshot_ref?`, `gap_ref?`, `result_or_receipt_ref` | CP02 查询、reconciliation Job |
| `RuntimeMediationLocalAudit` | Runtime handoff material / attempt / feedback link 提交后 | `trace_id`, `subject_ref`, `handoff_kind`, `material_ref?`, `attempt_ref?`, `feedback_ref?`, `gap_ref?`, `local_status`, `result_or_receipt_ref` | CP03 / CP05 查询、operations 诊断 |
| `OutboundInteractionLocalAudit` | outbound interaction material、attempt、submission ref 或 failure / gap successor 提交后 | `trace_id`, `subject_ref`, `interaction_kind`, `material_ref?`, `attempt_ref?`, `submission_ref?`, `gap_ref?`, `local_status`, `result_or_receipt_ref` | CP04 / CP05 查询、operations 诊断 |
| `InteractionTraceAppendLocalAudit` | `InteractionTraceEntry` append 与关联 successor 在同一 UoW 提交后 | `trace_id`, `trace_entry_ref`, `subject_ref`, `interaction_ref?`, `attempt_ref?`, `gap_ref?`, `correlation_ref`, `result_or_receipt_ref` | CP05 trace query、reconciliation Job |
| `ExternalMirrorResolutionLocalAudit` | owner-specific resolver 或 Consumer 提交 safe observation material / resolution / gap successor 后 | `trace_id`, `owner_kind`, `source_ref`, `resolution_ref?`, `observation_material_ref?`, `gap_ref?`, `from_state?`, `to_state`, `receipt_or_report_ref` | CP06 / CP07 查询、refresh Job |
| `MemberProjectionLocalAudit` | member read model / safe diagnostic projection successor 提交后 | `trace_id`, `projection_kind`, `projection_state_ref`, `from_state?`, `to_state`, `source_cursor_or_ref?`, `safe_reason_category?`, `result_or_report_ref` | CP07 Query、projection maintenance Job |
| `ConsumerDispositionLocalAudit` | accepted Consumer 形成 receipt，或 allowed delayed / rejected / unsupported receipt 提交后 | `trace_id?`, `consumer_name`, `source_ref`, `schema_version`, `disposition`, `receipt_ref`, `changed_local_refs?`, `diagnostic_ref?` | worker diagnostics、operations Job |
| `MemberJobDispositionLocalAudit` | item-level successor 或 `MemberJobReport` 提交后 | `trace_id`, `job_kind`, `job_invocation_ref`, `item_refs?`, `advanced_count`, `unresolved_count`, `disposition`, `report_ref` | jobs diagnostics、future test / acceptance design |
| `CommitStatusUnknownLocalAudit` | UoW 返回 commit-unknown 且保留 permitted reservation / diagnostic successor 时 | `trace_id`, `operation_name`, `reservation_ref?`, `affected_ref?`, `safe_error_kind`, `diagnostic_ref?` | reconciliation Job、manual operations diagnosis |
| `ConfigValidationLocalAudit` | config validation 或 builder binding 形成 safe issue ref 后 | `config_source_ref`, `config_section`, `adapter_slot?`, `validation_issue_ref`, `availability_state?`, `diagnostic_ref?` | startup operations diagnosis |

### 9.1 审计写入规则

| 规则 | 正式口径 |
|---|---|
| 只关联已提交 local truth | accepted Command、Consumer 或 Job 必须先完成 Step 11 指定的 local UoW；审计记录随后从同事务或其 typed stored carrier 的 ref 导出。日志成功不构成审计记录。 |
| 不新增通用 audit store | 不创建 `MemberAuditTrail`、audit repository、audit outbox、audit topic 或 audit publisher。若未来上游定义 shared audit contract，必须重开本 Step 和 Step 7 / 8 / 11。 |
| trace 不等于 audit | `InteractionTraceEntry` 是业务关联对象；它可以被 `InteractionTraceAppendLocalAudit` 引用，但不能被 runtime span、metric 或外部 trace backend 替代，也不能保存 runtime span body。 |
| accepted 与 non-positive disposition | `Blocked`、`Waiting`、`Unknown`、`Rejected`、`Unsupported` 可形成 safe disposition record 或 typed result / receipt / report 的关联，但不得冠以 `Accepted`，不得暗示 host、Runtime、Bus 或下游已接受。 |
| duplicate | duplicate 只关联既存 exact typed carrier；可有 replay log / metric，但不得追加新的 fact、trace、attempt、gap、projection successor 或审计记录。 |
| Query | Query 不写审计记录，不因访问、not-visible、stale 或 degraded 而写 repair、freshness 或 diagnostic state。 |
| candidate outbound event | 被 `L2M-UP-005` 阻塞的 24 个 candidate 只能产生 blocked boundary log / metric；不形成 event audit、outbox、route、publisher receipt 或 delivery record。 |
| external handoff | `attempt_ref`、`submission_ref`、`feedback_ref` 和 `gap_ref` 只表示 member-local 记录；它们不是 transport ack、consumer observed、delivery success、runtime outcome 或 evidence。 |

## 10. Trace / span 关联切口

| span 名称 | 开始位置 | 必填安全字段 | 结束条件 |
|---|---|---|---|
| `l2_member.command` | `api` 已完成 envelope metadata / body gate 后 | `trace_id`, `operation_name`, `actor_ref`, `subject_ref?`, `idempotency_key_hash` | typed Command result、typed rejection 或 mapped application error 返回 |
| `l2_member.query` | `api` 已完成 Query metadata gate 后 | `trace_id`, `operation_name`, `actor_ref`, `subject_ref?`, `surface_kind` | response view / page / safe read error 返回；不跨入 write path |
| `l2_member.consumer` | `worker` 收到 Consumer envelope 后 | `trace_id?`, `consumer_name`, `source_kind`, `source_ref`, `schema_version` | typed receipt、pre-gate reject 或 mapped worker error 返回 |
| `l2_member.job` | `jobs` 接收 logical Job request 后 | `trace_id`, `job_kind`, `job_invocation_ref`, `idempotency_key_hash` | typed `MemberJobReport`、typed stored result 或 `JobError` 返回 |
| `l2_member.uow` | application 调用 `MemberUnitOfWork::begin` 时 | `trace_id`, `operation_name`, `operation_group`, `reservation_ref?` | commit、rollback 或 commit-unknown 映射结束 |
| `l2_member.store` | application / infra 调用 logical Store 时 | `trace_id`, `store_kind`, `operation_group`, `subject_kind?` | Store success、conflict 或 mapped `MemberPortError` |
| `l2_member.resolver` | owner-specific resolver 调用前 | `trace_id`, `resolver_kind`, `source_owner_kind`, `source_ref` | safe summary、blocked / waiting / unknown or reject 返回 |
| `l2_member.handoff` | host / Runtime / observation / publication technical Port 调用前 | `trace_id`, `handoff_kind`, `boundary_ref?`, `attempt_ref?` | local return、local attempt / gap successor 或 mapped Port error |
| `l2_member.projection` | projection / mirror successor 写入或 Job item 开始时 | `trace_id`, `projection_kind`, `projection_state_ref?`, `resolution_ref?` | successor commit、partial item report 或 safe failure return |
| `l2_member.runtime_builder` | `infra/runtime_builder.rs` 开始装配 validated bindings 时 | `config_source_ref`, `adapter_slot?`, `binding_kind` | validated composition、blocked seam registration 或 validation failure |

### 10.1 Trace context 和关联规则

1. `MemberOperationContext.trace_id` 是唯一业务操作关联来源。它由已验证的
   Command / Query metadata、Consumer envelope 或 logical Job metadata 继承；domain、adapter、fake、Store 和 builder 不得生成替代 trace。
2. 缺失必填 trace context 的入口按 Step 12 的 validation / safe reject 口径处理；不得随机生成一个 trace id 掩盖协议错误。
3. span parent / child 关系仅表达本地调用关系：entry 可包含 application、UoW、Store、resolver、handoff、projection child span；不得用 parent-child 关系声称外部 host、Runtime、Bus、工具、conversation 或 observability backend 已完成动作。
4. span attribute 与 structured log 只能保存稳定 ref、有限 kind / state / disposition、duration、计数和 one-way fingerprint。`InteractionTraceEntry`、safe diagnostic、typed receipt / result / report 是关联对象，不能复制进 span。
5. `trace_id` 允许用于日志和 span 的关联，不可用作 metric label、Store primary key、idempotency key、routing key 或新增 event header contract。

## 11. Redaction 与禁止字段

| 材料 | 允许字段 | 禁止字段 |
|---|---|---|
| structured log | stable ref、operation / consumer / job / adapter kind、有限 state / disposition、safe error kind、duration、count、one-way key fingerprint、redacted diagnostic ref | raw Command / Query / event / Job body、conversation content、tool input / output、plan / outcome / memory / checkpoint、adapter request / response、stack trace、raw config、secret、token、credential、endpoint、topic / route |
| metric | finite kind / state / disposition / error category / adapter kind / owner kind / CP / controlled blocker ID | member / actor / project identity、trace / request / receipt / report / attempt / gap / projection ref、idempotency / dedup key、digest、timestamp、free text、endpoint、topic、raw config、secret |
| member-local audit record | committed local object / successor / typed carrier ref、state transition、safe reason category、boundary / source ref、actor ref、inherited trace id | body、payload snapshot、external response、runtime span body、transport ack body、credential、secret、full diagnostic / stack trace、evidence / artifact body |
| `InteractionTraceEntry` | Step 6 的 correlation / safe ref / disposition fields | raw message, tool, conversation, runtime, external adapter, diagnostic or event body；不得作为 observability backend span payload |
| safe diagnostic view | stable error code、safe summary、supporting safe refs、redacted issue / diagnostic ref | exception text、SQL、header、cookie、token、credential、secret、full stack trace、request / response body |
| config / builder diagnostic | config source / section ref、slot kind、availability state、validation issue ref | raw config values、environment dump、image manifest body、launch token、credential material、transport endpoint / socket path |

### 11.1 永久禁止与 owner 边界

- 本仓不拥有 LLM reasoning、plan、memory、checkpoint、tool execution payload、capability registry、external MCP / A2A / API adapter body、container lifecycle、image build / supply truth、sandbox isolation truth、governance approval truth、conversation truth 或 observability backend。它们不得因“调试”或“审计”进入 member 日志、metric、trace 或 logical audit record。
- `L0-core` / `L0-bus` 共享 envelope 或 trace category 只在现有正式上游已定义的范围内消费。member-specific event schema、type、source、subject、route、topic、payload 继续 pending；本 Step 不 shadow 定义。
- old README 的 CloudEvents、AG-UI、UDS、launch token 或 transport 命名不构成当前埋点字段 authority。若未来被正式上游采纳，需通过 Step 8 / 14 的重开流程再进入本表。

## 12. Command、Query、Consumer、Job、handoff 与 config 的观测闭环

| 入口 / seam | 正向 local 结果 | 非正向结果 | log / metric | logical audit 约束 |
|---|---|---|---|---|
| 10 Command | committed fact / successor + exact typed result | pre-gate reject、domain reject、blocked、waiting、unknown、conflict、in-flight、commit unknown | entry、reserve、commit / failure、duration | 只对可证明 commit 的 local change 关联 audit；duplicate 不新增 |
| 16 Query | safe response view / page / marker | not-visible、empty、stale、degraded、unavailable | entry、serve disposition、duration | no-write；不产生 audit 或 repair |
| 14 Consumer | committed local fact / safe snapshot / resolution / gap / projection successor + receipt | unsupported、forbidden-body reject、delayed、blocked、unknown、duplicate | gate、receipt disposition、dedup、duration | accepted 仅关联 committed local refs；reject 仅允许 safe disposition ref |
| 5 Job | item-level successor + `MemberJobReport` | partial、unresolved、conflict、blocked、waiting、unknown | invocation、item outcome、summary、duration | report 只代表 member-local execution summary，不是 scheduler run / artifact / evidence |
| Runtime / host / publication / observation handoff | material / attempt / local submission / feedback link / gap ref | blocked、waiting、unknown、Port error | handoff kind、local status、safe reason、duration | 不声称 host accepted、Runtime executed、Bus delivered、downstream observed |
| raw config / builder | validated binding / blocked seam registration | validation failed、slot unavailable | section / slot / safe issue / availability | 只可关联 safe config validation issue；不记录 raw values / credentials |

## 13. Step 6~14 前序审计

| 前序 Step | 本 Step 复核 | 结果 | 未关闭项 |
|---|---|---|---|
| Step 6 对象 | 仅使用既有 `MemberOperationContext`、`InteractionTraceEntry`、attempt / gap、projection、typed result / receipt / report 和 safe diagnostic；没有增设 audit domain object | pass | `L2M-DDD-001~007` 保留 |
| Step 7 Port / adapter | instrumentation 位于 entry、application orchestration 或 infra boundary；domain / contracts 无 backend 依赖 | pass | external resolver / handoff exact Port 受 `L2M-UP-001~006` 约束 |
| Step 8 协议 | 10 Command、16 Query、14 Consumer、5 Job 使用既有 metadata / result / receipt / report；24 candidate 不被升级为 event | pass_with_blocker | `L2M-UP-005` |
| Step 9 处理流 | fresh / duplicate / no-write / external fence / partial Job 的写入顺序未因 telemetry 改写 | pass | `Unknown` 继续 fail closed |
| Step 10 状态 | 只使用已定义 local disposition / state，未把 `Ready`、`Submitted`、`Completed` 解释为外部成功 | pass | host / Runtime / downstream positive truth 不在本仓 |
| Step 11 持久化 | audit 关联以 same-UoW committed ref 或 stored carrier 为前提；无 audit outbox / generic ledger | pass | Store physical schema defer 至 implementation / config design |
| Step 12 错误恢复 | reject、conflict、in-flight、commit-unknown 与 blocked / waiting / unknown 保持安全区分 | pass | commit-unknown reconciliation policy 仍是 design-open item |
| Step 13 并发幂等 | exact replay 不新增 trace、successor 或 audit；key 仅 hash / fingerprint | pass | idempotency backend physical realization defer |
| Step 14 config / external bindings | raw config 仅 `infra/config.rs`；builder diagnostics 只 safe ref；adapter availability 不构成 external health truth | pass_with_blockers | `L2M-UP-001~006`、`L2M-UP-005` |

## 14. 正式 §5.14 回填草稿

正式 `03-详细设计.md` 的 §5.14 必须回填以下内容，而不复制本文件的过程性讨论：

1. 日志、指标和 member-local audit record 三张实现切口表；
2. `l2_member.command/query/consumer/job/uow/store/resolver/handoff/projection/runtime_builder` 的 span 切口和 `MemberOperationContext.trace_id` 继承规则；
3. Query no-write、duplicate exact replay、commit-before-audit、blocked / waiting / unknown 非正向语义、24 candidates 禁止发布的约束；
4. 低基数 metric label、redaction / forbidden-field、owner-boundary 和非 observability-backend 边界；
5. 只把告警阈值、SLO、dashboard、sampling、retention、backend、pager、runbook 和真实 transport 细节留给后续配置 / 运维材料。

## 15. 待确认事项与完成门禁

| 项目 | 影响 | 当前处理 |
|---|---|---|
| `L2M-UP-001~004` | host / Runtime exact IPC、entry、handoff / feedback 的 field 与 positive acknowledgement | 仅记录 local attempt / gap / safe boundary log；不声明外部成功 |
| `L2M-UP-005` | member-specific shared event schema / route | 禁止 event audit、outbox、publisher、topic、route、DLQ、delivery receipt |
| `L2M-UP-006~008` | identity credential、screening taxonomy、非项目型 execution subject | fail closed / blocked；仅 safe diagnostic / metric category |
| `L2M-DDD-001~007` 与 `scope_supersede_gap` | object、Port、physical persistence 和 scope 边界仍有设计待收束点 | 本 Step 不以 telemetry 伪造 closure；转入 Step 16~18 检查 |

### 15.1 完成门禁与停审记录

- [x] 已回答 SOP 五问，且没有把 runtime telemetry 写成 business / external truth。
- [x] 已给出 entry、application、infra 和 builder 的日志、指标、span 与 logical audit 切口。
- [x] 已覆盖 Command、Query、Consumer、Job、handoff、projection / mirror、config 和 24 个 blocked candidate。
- [x] 已规定 Query no-write、duplicate exact replay、commit-before-audit、`Unknown` side-effect fence 与 low-cardinality / redaction 纪律。
- [x] 已审计 Step 6~14 的对象、Port、协议、flow、状态、持久化、错误、幂等与 config 一致性。
- [x] 已标注 upstream / design blockers，未伪造 publisher、outbox、delivery、evidence、backend observation、test 或 runtime 结果。
- [x] 已形成正式 §5.14 回填草稿。

**Step 15 结论：** `completed / pass_with_upstream_and_design_blockers / stop_review`。下一步可严格串行创建 Step 16 测试切口中间产物；正式 `03-详细设计.md` 仍只允许在 Step 19 统一装配。
