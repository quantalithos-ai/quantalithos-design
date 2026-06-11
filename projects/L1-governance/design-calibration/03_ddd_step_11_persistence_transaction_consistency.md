# Step 11. 持久化、事务与一致性契约

> 对应 SOP: `standards/document/详细设计讨论流程_SOP.md` Step 11

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 11 持久化、事务与一致性契约 |
| 当前状态 | 已完成;待用户审查 |
| 输入基线 | 需求、架构、概要、Step 1~10 详细设计校准文档 |
| 输出文件 | `projects/L1-governance/design-calibration/03_ddd_step_11_persistence_transaction_consistency.md` |
| 停审方式 | 按 logical store、repository 函数、transaction boundary、一致性 / 恢复策略分批写入;全部完成后做跨 Step 6~10 闭环审计 |

## 2. 本步目标

本 Step 把 Step 6 的对象字段、Step 7 的 repository / UnitOfWork / outbox / projection / reference / result port、Step 9 的函数级事务顺序、Step 10 的状态矩阵收束成可实现的持久化与一致性契约。

实现侧必须按本 Step 保存 truth、snapshot、projection、trace、audit、history、outbox、handoff marker、idempotency record 和 stored result。若某个 flow 需要更新已有 state,必须使用本 Step 明确的 `GovernanceVersion` 来源;不得用 cursor、timestamp、event sequence、page token 或 hard-coded version 代替 optimistic version。

本步不定义物理数据库产品、DDL 语法、SQL index 名称、migration 文件、retry 次数、topic 名称、transport route、错误 enum 全量变体或实施 commit boundary。物理 schema 可由 infra 设计或实施计划细化,但 durable adapter 与 in-memory fake 必须保留本 Step 的主键、唯一性、索引、version、transaction 和 append-only 语义。

## 3. 输入材料

| 输入 | 状态 | 本 Step 用途 |
|---|---|---|
| `00-需求文档.md` | 已完成 | 固定 Governance 只拥有治理 truth、marker、projection 和本地 snapshot,不拥有 process/work/artifact/method/runtime 等 sibling 正文 |
| `01-架构设计.md` | 已完成 | 固定数据所有权、异步传播、outbox、projection、external reference snapshot、audit / handoff 边界 |
| `02-概要设计.md` | 已完成 | 提供模块、对象、状态和处理流的概要归属 |
| `03_ddd_step_06_object_contracts.md` | 已完成 | 提供 truth object、snapshot、view/report、trace/audit/history/outbox/handoff/idempotency object 字段和 factory |
| `03_ddd_step_07_trait_port_adapter_contracts.md` | 已完成 | 提供 `GovernanceUnitOfWork`、repository、resolver、publisher、handoff、result store、id generator 和 versioned read 函数 |
| `03_ddd_step_08_protocol_contracts.md` | 已完成 | 提供 Command / Query / Event / Job DTO、stored result surface、payload snapshot schema 和 public view/report surface |
| `03_ddd_step_09_function_flows.md` | 已完成 | 提供 command / query / consumer / publisher / job / handoff flow 的事务顺序和副作用 |
| `03_ddd_step_10_state_matrix.md` | 已完成 | 提供 state transition、terminal state、retry / failed / stale / unavailable / handoff marker guard |
| `standards/document/设计真相源闭环与可落码性标准.md` | 已检查 | 检查 version 来源、payload snapshot、sidecar truth 读取面、stored result、affected view 和 append-only record 闭环 |

## 4. 分批写入计划

| 批次 | 内容 | 状态 |
|---|---|---|
| 11.1 | 文件骨架、SOP 问题回答、数据所有权实现表、logical store / projection 契约表 | [x] 已写入 |
| 11.2 | Repository 函数持久化语义表、version / unique key / index 规则 | [x] 已写入 |
| 11.3 | Command / consumer / publisher / job / handoff transaction boundary 表 | [x] 已写入 |
| 11.4 | 一致性策略、失败恢复、补偿、no-write query、no-repair job 规则 | [x] 已写入 |
| 11.5 | 前序契约回填、跨 Step 6~10 闭环审计、进入 Step 12 条件 | [x] 已写入 |

## 5. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 哪些数据对象由本仓拥有? | `GovernanceContext`、`GovernanceInput`、`Gate`、`GovernanceDecision`、`ApproverRequirement`、`ApprovalResponsibility`、`ResponsibilityChain`、`PolicyEffectiveFact`、`SharedRuleSet`、`PolicyConflictRecord`、`ControlApplicability`、`ControlReview`、`AIIAConclusion`、`SoAConclusion`、`NonconformityRecord`、`CorrectiveAction`、`VerificationResult`、Governance trace / audit / history / outbox / projection state / reconciliation report / handoff marker / idempotency / stored result 由本仓拥有。 |
| 哪些只是引用、快照或投影? | Actor capability、method policy/control、evidence summary、process context、work context、runtime signal、archive/observability/external GRC target 都只能以 typed ref、body-free snapshot、safe summary ref、source version、digest、resolution state 或 marker 保存。Dashboard、decision summary、policy effective、control coverage、nonconformity status、search fact、reconciliation report 是派生读模型或报告,不得反写 core truth。 |
| repository 函数如何命名,参数和返回是什么? | 函数签名以 Step 7 为准。本 Step 只补持久化语义:mutable truth / marker 使用 `get_*_with_version(...) -> Versioned<T>` 和 `save(... expected_version, &uow)`;append-only trace/history/outbox append 不使用 expected_version 但必须在 UoW 内;publisher / refresh / rebuild 等 marker update 必须使用 versioned list/read 返回的 `GovernanceVersion`。 |
| 哪些处理流需要事务,事务内必须完成哪些写入? | Command accepted path、inbound consumer accepted path、outbox publication marker update、projection rebuild item、reference refresh item、reconciliation report save、handoff/export marker save、idempotency/result completion 都需要 `GovernanceUnitOfWork`。Query 不开启写事务。 |
| 是否需要乐观锁、行锁、版本号、outbox 或 projection? | 需要乐观锁和版本号。P0 不要求显式行锁或具体数据库隔离级别,但 repository 必须通过 `GovernanceVersion` 防止 lost update。Command truth accepted path 必须同事务写 trace/audit/history/outbox/stored result/idempotency complete 和 affected projection stale marker。Projection / reference / outbox publisher 是最终一致维护状态。 |
| 如果事件发布或 projection 更新失败,如何恢复? | Outbox publish 失败只更新 `OutboxPublicationState::Failed` 或 `DeadLettered`,不回滚 committed truth。Projection rebuild 失败写 `DerivedGovernanceViewFreshnessState::Failed` 或 `Unavailable`,query 返回 stale/degraded/unavailable surface。Reference refresh 失败写 `ReferenceResolutionKind::Unavailable/Stale/Invalid` 或 job failed item,不得补造 external truth。Handoff/export 失败保存 failed marker 和 stored job report,不得保存 external body。 |

## 6. 当前文档问题诊断

| 来源 | 已发现问题 | 本 Step 收口方式 |
|---|---|---|
| Step 7 repository trait | 函数签名已有,但需要映射到 logical store、主键、索引、version 和 append-only 语义 | §8 / §9 补 store contract 与函数语义 |
| Step 9 flow | 每条 flow 已有事务顺序,但需要统一事务边界表 | §10 汇总 begin / commit / rollback 和同事务必须写入 |
| Step 10 state matrix | stale / failed / retry / dead-letter / delivered 等状态需要持久化来源和 version guard | §8~§11 固定 state storage 与 expected_version 来源 |
| Outbox payload | publisher 只读 stored payload snapshot,不能重查 current truth | §8 / §9 固定 record + payload snapshot 同事务保存和 pending list 版本来源 |
| Handoff/export | marker 可失败,external GRC export 必须先写 marker trace 且 trace_refs 非空 | §8 / §10 固定 trace append + marker save 事务顺序 |
| Stored result | duplicate command / consumer / job 需要 replay 原 result / receipt / report | §8~§10 固定 stored result store 和 idempotency complete 同事务 |

## 7. 设计取舍

| 议题 | 可选方案 | 取舍 |
|---|---|---|
| 是否写具体 DDL | A. 直接写 SQL DDL;B. 写 logical store 契约 | 采用 B。项目尚未锁定物理数据库,但 fake / durable adapter 必须具备等价 key、index、version 和 transaction 语义。 |
| mutable truth 并发控制 | A. adapter 自行决定;B. `Versioned<T>` + `GovernanceVersion` 统一 optimistic update | 采用 B。所有 update existing state 的路径必须有正式 version 来源。 |
| trace/history/outbox record | A. 也使用 expected_version;B. append-only with generated id and UoW | 采用 B。append-only record 以 generated id / unique key 防重复,不覆盖已有行。 |
| outbox payload | A. publish 时重查 truth 构造;B. accepted transaction 保存 stored payload snapshot | 采用 B。publisher 只发布 stored snapshot,防止 truth 后续变化污染已提交事件。 |
| projection / reference failure | A. 回滚 source truth;B. 标记 stale/failed/unavailable 并异步恢复 | 采用 B。projection / reference 是派生和本地 snapshot,不得反写真相。 |
| duplicate replay | A. duplicate 重新执行 service;B. 从 stored result / receipt / report 读取 | 采用 B。same key same digest duplicate 不重跑 mutation、scan、publish 或 handoff。 |
| handoff/export marker | A. 只返回 adapter result,不保存 marker;B. 保存 body-free marker + stored job report | 采用 B。保留可审计、可查询、可 replay 的 marker,但不保存 archive/GRC/observability body。 |

## 8. 结构化中间产物

### 8.1 数据所有权实现表

| 数据对象 | 拥有模块 | 写入方 | 读取方 | 一致性要求 |
|---|---|---|---|---|
| `GovernanceContext` | `domain/context.rs` / `GovernanceContextRepository` | create/update context command、reference refresh accepted path | command service、query service、projection rebuild、reconciliation、external GRC export | mutable truth;save 使用 loaded `GovernanceVersion`;context change 与 trace/audit/outbox/stale/result 同 UoW |
| `GovernanceInput` | `domain/context.rs` / `GovernanceInputRepository` | submit/update input command、external source consumer accepted marker | command service、query、projection rebuild、reconciliation | mutable truth;source body 不保存;actor surface 来自 command / operation context;state update 必须 expected_version |
| `Gate` | `domain/decision.rs` / `GateRepository` | open gate、record decision、expire/cancel gate | decision command、query、projection、reconciliation | mutable truth;open gate create uses `None`;attach decision / expire / cancel 使用 loaded version |
| `GovernanceDecision` | `domain/decision.rs` / `GovernanceDecisionRepository` | record/supersede/revoke decision command | gate service、query、projection、audit/export | mutable truth;final outcome may be superseded/revoked only by formal transition;basis/ref only,不保存 evidence body |
| `ApproverRequirement` | `domain/responsibility.rs` / `ApproverRequirementRepository` | open gate / assign responsibility command | responsibility service、chain satisfaction policy、query | requirement sidecar value;create append/save in same command UoW;不得由 chain 临时重建 |
| `ApprovalResponsibility` | `domain/responsibility.rs` / `ApprovalResponsibilityRepository` | assign/vote/delegate/release responsibility command | decision service、query、projection、reconciliation | mutable truth;actor capability 只保存 snapshot/ref;vote/delegate/release 使用 expected_version |
| `ResponsibilityChain` | `domain/responsibility.rs` / `ResponsibilityChainRepository` | open gate / assign / vote / escalation / close flows | decision finalization guard、query、projection | mutable truth;chain satisfaction 来自 loaded responsibility refs,不得扫描 identity body |
| `PolicyEffectiveFact` | `domain/policy.rs` / `PolicyEffectiveFactRepository` | activate/update policy fact command、method policy consumer stale path | policy guard、control assessment、query、projection、reconciliation | mutable truth;method policy 只存 ref/version/snapshot;conflict detection 与 policy save 同 UoW when same command |
| `SharedRuleSet` | `domain/policy.rs` / `SharedRuleSetRepository` | update shared rules command | policy guard、conflict detection、query、projection | mutable truth;rule refs only;active/deprecated/retired changes must mark affected views stale |
| `PolicyConflictRecord` | `domain/policy.rs` / `PolicyConflictRepository` | policy activation/update, conflict resolution command | policy service、decision service、query、reconciliation | mutable truth;resolution/waiver 必须引用 formal decision;不得直接改写 conflicting policies |
| `ControlApplicability` | `domain/control.rs` / `ControlApplicabilityRepository` | assess control applicability command、method control consumer stale path | control review、compliance、query、projection | mutable truth;method control snapshot/ref only;assessment conclusion requires formal evidence/reason refs |
| `ControlReview` | `domain/control.rs` / `ControlReviewRepository` | record control review command | compliance conclusion、nonconformity flow、query、projection | mutable truth;review evidence summary ref only;failed review 不自动创建 nonconformity unless command flow says so |
| `AIIAConclusion` | `domain/compliance.rs` / `ComplianceConclusionRepository` | submit/approve compliance conclusion command | compliance query、projection、audit/export | mutable truth;approval/rejection/revoke 使用 decision/basis refs;no artifact package body |
| `SoAConclusion` | `domain/compliance.rs` / `ComplianceConclusionRepository` | submit/approve SoA conclusion command | control coverage、query、projection、audit/export | mutable truth;coverage refs and control refs only;approval requires control coverage closure |
| `NonconformityRecord` | `domain/nonconformity.rs` / `NonconformityRepository` | raise/confirm/transition/reopen/reject nonconformity command | corrective action、query、projection、reconciliation | mutable truth;closure requires verification passed;external defect state cannot overwrite this truth |
| `CorrectiveAction` | `domain/nonconformity.rs` / `CorrectiveActionRepository` | plan/complete/cancel/fail corrective action command | nonconformity verification,query,projection | mutable truth;work/process refs only;completed action does not close nonconformity by itself |
| `VerificationResult` | `domain/nonconformity.rs` / `CorrectiveActionRepository` | verify nonconformity command | nonconformity closure guard、query、projection | immutable or mutable-by-version result;verification evidence summary ref only;no evidence body |
| `DerivedGovernanceViewState` | `domain/projection.rs` / `GovernanceProjectionRepository` | command/consumer/job stale marker, projection rebuild | query、reconciliation、projection job | maintenance state;source cursor only moves forward;query cannot repair state |
| public projection views | `contracts/views.rs` / `GovernanceProjectionRepository` | projection rebuild job | query service、search、dashboard、reconciliation | derived from committed truth/snapshot;replace with view state in UoW;never source of truth |
| `ReferenceResolutionState` | `domain/reference.rs` / `ReferenceSnapshotRepository` | inbound consumer, reference refresh job, command resolver marker | command guards、query、projection、reconciliation | mutable local snapshot state;save uses versioned read/list;does not create sibling truth |
| body-free snapshots / refs | `domain/reference.rs` / `ReferenceSnapshotRepository` | consumer/refresh accepted path | command guards、query、projection | actor/method/evidence/process/work/runtime summary only;no external正文 |
| `GovernanceTraceRecord` | `domain/audit.rs` / `GovernanceTraceRepository` | accepted command / accepted consumer marker / export marker trace | trace query、handoff、archive/export、audit | append-only;must be in same UoW as accepted truth or marker that requires trace |
| `GovernanceAuditTrail` | `domain/audit.rs` / `GovernanceAuditHistoryRepository` | accepted command / audit update flow | audit query、export、reconciliation | mutable ref chain summary;save uses expected_version when existing |
| history records | `domain/audit.rs` / `GovernanceAuditHistoryRepository` | accepted domain family command | query/audit/export/reconciliation | append-only;factory fields must come from committed transition;not a replacement for current truth |
| `GovernanceOutboxRecord` | `domain/outbox.rs` / `GovernanceOutboxRepository` | accepted truth command / trace available / derived view changed event append | publisher job、reconciliation | append with stored payload snapshot in same UoW;publication state updates later by version |
| `GovernanceOutboxPayloadSnapshot` | application/contracts helper / `GovernanceOutboxRepository` | accepted outbox append helper | publisher | immutable stored outbound payload shell;publisher cannot rebuild from current truth |
| `GovernanceReconciliationReport` | `contracts/reports.rs` / `GovernanceReconciliationReportRepository` | reconciliation job | query、operations、archive/export | report only;does not repair truth/projection/outbox |
| `GovernanceHandoffMarker` | `domain/audit.rs` / `GovernanceHandoffMarkerRepository` | trace/archive/external GRC handoff jobs | operations query、archive/export audit、duplicate job report | body-free marker;prepared/delivered/failed state persisted;failed marker does not delete package ref |
| `GovernanceIdempotencyRecord` | `application/idempotency.rs` / `GovernanceIdempotencyRepository` | command/consumer/job service | same operation duplicate path | key+operation+digest unique;complete points to stored result in same UoW |
| `StoredGovernanceOperationResult` | `application/results.rs` / `StoredGovernanceResultRepository` | command accepted / command rejected / consumer / job path | duplicate replay、API/worker/job runner | immutable replay surface;duplicate does not rebuild result from current truth |
| adapter/runtime state | `infra/*` | runtime builder / adapter registry / health checks | API/worker/jobs/application service availability checks | infra state only;no raw config/secret/body;does not mutate Governance truth |

### 8.2 Logical store / collection / projection 契约表

本表是 logical persistence contract,不是强制 DDL。一个 durable adapter 可以把多个 logical store 合并到同一物理表,也可以拆分,但必须保持等价的主键、唯一键、索引、version、append-only 和 transaction 行为。

| 存储对象 | 用途 | 主键 / 唯一键 | 关键索引 | 版本字段 |
|---|---|---|---|---|
| `governance_contexts` | context truth | PK `context_id`;unique active `(subject_ref, source_ref)` when not terminal as policy requires | `subject_ref`,`source_ref`,`context_state`,`pending_reference_ref` | `governance_version` |
| `governance_inputs` | input truth | PK `input_id`;optional unique `(context_ref, source_ref)` for dedup by source | `actor_ref`,`context_ref`,`source_ref`,`input_state`,`pending_evidence_ref` | `governance_version` |
| `governance_gates` | gate truth | PK `gate_id`;unique active `(context_ref, gate_kind)` when gate policy says singleton | `context_ref`,`gate_state`,`decision_ref`,`required_responsibility_ref` | `governance_version` |
| `governance_decisions` | formal decision truth | PK `decision_id`;unique latest by `(gate_ref, decision_kind)` only if policy requires | `gate_ref`,`decision_state`,`basis_ref`,`superseded_by` | `governance_version` |
| `approver_requirements` | requirement sidecar value | PK `requirement_ref`;unique optional `(context_ref, requirement_kind)` | `context_ref`,`capability_ref`,`threshold_ref` | immutable or `governance_version` |
| `approval_responsibilities` | responsibility truth | PK `responsibility_id`;unique active `(context_ref, requirement_ref, actor_ref)` when actor assigned | `context_ref`,`requirement_ref`,`actor_ref`,`responsibility_state` | `governance_version` |
| `responsibility_chains` | approval chain truth | PK `chain_id`;unique active `context_ref` when one active chain per context | `context_ref`,`chain_state`,`requirement_ref` | `governance_version` |
| `responsibility_chain_items` | ordered responsibility refs | PK `(chain_id, ordinal)`;unique `(chain_id, responsibility_ref)` | `responsibility_ref` | owned by `responsibility_chains` save |
| `policy_effective_facts` | policy fact truth | PK `policy_fact_id`;unique active `(scope_ref, method_policy_ref)` when effective | `scope_ref`,`method_policy_ref`,`policy_state`,`source_version_ref` | `governance_version` |
| `shared_rule_sets` | shared rule set truth | PK `rule_set_id`;unique active `scope_ref` when active singleton | `scope_ref`,`rule_set_state` | `governance_version` |
| `shared_rule_set_items` | ordered shared rule refs | PK `(rule_set_id, rule_ref)` | `rule_ref` | owned by `shared_rule_sets` save |
| `policy_conflicts` | conflict truth | PK `conflict_id`;unique active conflict digest if configured | `scope_ref`,`conflict_state`,`pending_gate_ref`,`resolution_ref` | `governance_version` |
| `policy_conflict_items` | conflicting policy refs | PK `(conflict_id, policy_fact_ref)` | `policy_fact_ref` | owned by `policy_conflicts` save |
| `control_applicabilities` | control applicability truth | PK `applicability_id`;unique latest `(context_ref, method_control_ref)` | `context_ref`,`method_control_ref`,`applicability_state`,`evidence_ref` | `governance_version` |
| `control_reviews` | control review truth | PK `review_id`;unique active `(applicability_ref, review_kind)` if review policy requires | `applicability_ref`,`review_state`,`decision_ref`,`evidence_ref` | `governance_version` |
| `aiia_conclusions` | AIIA conclusion truth | PK `aiia_conclusion_id`;unique latest `context_ref` by policy | `context_ref`,`conclusion_state`,`decision_ref`,`basis_ref` | `governance_version` |
| `soa_conclusions` | SoA conclusion truth | PK `soa_conclusion_id`;unique latest `context_ref` by policy | `context_ref`,`conclusion_state`,`coverage_ref`,`decision_ref` | `governance_version` |
| `nonconformity_records` | nonconformity truth | PK `nonconformity_id`;unique optional source `(context_ref, source_ref)` | `context_ref`,`owner_ref`,`nonconformity_state`,`verification_ref` | `governance_version` |
| `corrective_actions` | corrective action truth | PK `corrective_action_id` | `nonconformity_ref`,`owner_ref`,`action_state`,`work_ref` | `governance_version` |
| `verification_results` | verification result truth | PK `verification_result_id`;unique latest by `(nonconformity_ref, verification_kind)` if policy requires | `nonconformity_ref`,`verification_state`,`evidence_ref` | `governance_version` |
| `derived_governance_view_states` | projection freshness state | PK `derived_view_ref`;unique `(projection_kind, source_identity_ref)` | `freshness_state`,`source_cursor`,`last_issue_ref` | `governance_version` |
| `governance_dashboard_views` | dashboard projection | PK `dashboard_view_ref`;unique `scope_ref` for dashboard kind | `scope_ref`,`source_cursor`,`freshness_state` | replaced with state version |
| `decision_summary_views` | decision summary projection | PK `decision_summary_view_ref`;unique `decision_ref` or configured summary target | `context_ref`,`gate_ref`,`decision_state`,`source_cursor` | replaced with state version |
| `policy_effective_views` | policy effective projection | PK `policy_effective_view_ref`;unique `scope_ref` for policy effective view | `scope_ref`,`policy_state`,`source_cursor` | replaced with state version |
| `control_coverage_views` | control coverage projection | PK `control_coverage_view_ref`;unique `context_ref` for coverage view | `context_ref`,`coverage_state`,`source_cursor` | replaced with state version |
| `nonconformity_status_views` | nonconformity status projection | PK `nonconformity_status_view_ref`;unique `nonconformity_ref` | `context_ref`,`owner_ref`,`status_state`,`source_cursor` | replaced with state version |
| `governance_search_facts` | search projection rows | PK `search_fact_ref`;unique `(fact_kind, fact_subject_ref)` | `context_ref`,`scope_ref`,`fact_kind`,`source_cursor` | replaced with state version |
| `projection_dependency_index` | affected view lookup | unique `(dependency_kind, dependency_ref, derived_view_ref)` | `dependency_kind`,`dependency_ref`,`derived_view_ref` | rebuilt with projection;no standalone version |
| `reference_resolution_states` | tracked external ref state | PK `reference_state_ref`;unique `reference_ref` | `resolution_kind`,`source_version_ref`,`checked_at`,`scope_ref` | `governance_version` |
| `actor_capability_snapshots` | identity capability snapshot | PK `snapshot_ref`;unique `actor_ref` current | `actor_ref`,`reference_ref`,`source_version_ref` | `governance_version` |
| `method_policy_snapshots` | method policy summary snapshot | PK `snapshot_ref`;unique `(method_policy_ref, policy_version_ref)` | `method_policy_ref`,`reference_ref`,`source_version_ref` | `governance_version` |
| `method_control_snapshots` | method control summary snapshot | PK `snapshot_ref`;unique `(method_control_ref, control_version_ref)` | `method_control_ref`,`reference_ref`,`source_version_ref` | `governance_version` |
| `evidence_summary_refs` | evidence summary marker / safe ref | PK `summary_ref`;unique source digest when available | `evidence_kind`,`external_ref`,`verified_state` | `governance_version` optional when local marker updated |
| `process_governance_context_refs` | process context marker | PK `process_context_ref`;unique source process/activity/waiting tuple | `process_instance_ref`,`activity_ref`,`waiting_gate_ref`,`reference_ref` | `governance_version` |
| `work_governance_context_refs` | work context marker | PK `work_context_ref`;unique work/project/iteration tuple | `project_ref`,`work_ref`,`iteration_ref`,`reference_ref` | `governance_version` |
| `runtime_signal_refs` | runtime signal marker | PK `runtime_signal_ref`;unique source signal ref | `signal_kind`,`reference_ref`,`checked_at` | `governance_version` |
| `governance_trace_records` | trace records | PK `trace_id`;unique `trace_record_ref` | `subject_ref`,`truth_change_ref`,`core_trace_id`,`source_cursor` | append-only;no optimistic overwrite |
| `governance_audit_trails` | audit trail ref chain | PK `audit_trail_id`;unique `audit_subject_ref` | `latest_trace_ref`,`subject_ref` | `governance_version` |
| `decision_records` | decision history | PK `decision_record_id` | `decision_ref`,`gate_ref`,`trace_ref` | append-only |
| `responsibility_trace_records` | responsibility history | PK `responsibility_trace_record_id` | `responsibility_ref`,`chain_ref`,`trace_ref` | append-only |
| `policy_change_records` | policy/shared/conflict history | PK `policy_change_record_id` | `policy_fact_ref`,`rule_set_ref`,`conflict_ref`,`trace_ref` | append-only |
| `control_change_records` | control applicability/review history | PK `control_change_record_id` | `applicability_ref`,`review_ref`,`trace_ref` | append-only |
| `compliance_conclusion_records` | compliance history | PK `compliance_conclusion_record_id` | `conclusion_ref`,`context_ref`,`trace_ref` | append-only |
| `nonconformity_change_records` | nonconformity/corrective history | PK `nonconformity_change_record_id` | `nonconformity_ref`,`corrective_action_ref`,`verification_ref`,`trace_ref` | append-only |
| `governance_outbox_records` | outbox publication marker | PK `outbox_id`;unique optional `truth_change_ref` per event kind | `publication_state`,`event_kind`,`subject_ref`,`payload_snapshot_ref`,`core_trace_id` | `governance_version` |
| `governance_outbox_payload_snapshots` | immutable outbound payload | PK `payload_snapshot_ref` | `event_kind`,`subject_ref`,`schema_version`,`core_trace_id` | immutable;no optimistic update |
| `governance_reconciliation_reports` | reconciliation report | PK `report_ref`;latest by `scope_ref` | `scope_ref`,`report_state`,`created_at` | immutable or superseded with `governance_version` |
| `governance_handoff_markers` | trace/archive/GRC handoff marker | PK `handoff_marker_ref`;unique `(handoff_kind, target_ref, package_ref)` when package exists | `handoff_state`,`target_ref`,`trace_ref`,`package_ref`,`receipt_ref`,`failure_ref` | `governance_version` |
| `governance_handoff_trace_items` | marker trace refs | PK `(handoff_marker_ref, trace_ref)` | `trace_ref`,`target_ref` | owned by marker save |
| `governance_idempotency_records` | operation idempotency | PK `idempotency_ref`;unique `(operation_kind, idempotency_key)` | `request_digest`,`idempotency_state`,`result_ref` | `governance_version` or atomic reservation token |
| `stored_governance_results` | command / consumer / job replay surface | PK `application_result_ref` | `operation_kind`,`result_kind`,`created_at` | immutable after save |
| `runtime_adapter_availability` | adapter availability marker | PK `adapter_slot_ref` | `availability_state`,`config_ref`,`issue_ref` | runtime-local version optional |
| `runtime_builder_state` | runtime assembly state | PK `runtime_build_ref` | `build_state`,`config_profile_ref` | runtime-local version optional |

### 8.3 Store 契约停审记录

| 项目 | 结论 | 说明 |
|---|---|---|
| Governance-owned truth 是否列全 | 通过 | context、input、decision、approval、policy、control、compliance、nonconformity、corrective 均有 logical store |
| External body boundary 是否明确 | 通过 | external process/work/artifact/method/runtime/observability/archive/GRC 只保存 ref、summary、snapshot、digest、version 或 marker |
| Projection identity 是否闭合 | 通过 | `projection_dependency_index` 支撑 affected view lookup,禁止 ad hoc view ref |
| Outbox payload snapshot 是否闭合 | 通过 | record 与 payload snapshot 分 store 同 UoW append,publisher 只读 snapshot |
| Stored result replay 是否闭合 | 通过 | command / consumer / job result 都落 `stored_governance_results` |
| Version 字段是否有归属 | 通过 | mutable truth / marker / projection / reference / outbox / idempotency 均有 `governance_version` 或 atomic reservation |

### 8.4 Repository 函数持久化语义表

本表承接 Step 7 trait。不得用本表新增 Step 7 没有的 repository 方法;如果实施发现需要新读取面,必须先回 Step 7 / Step 9 / Step 11 修正文档。

| 函数签名 | 作用 | 锁 / 事务要求 | 返回 | 错误 |
|---|---|---|---|---|
| `GovernanceUnitOfWorkManager.begin()` | 开启 command / consumer / job / marker update 写事务 | application service 入口调用;query 禁止调用 | `Box<dyn GovernanceUnitOfWork>` | begin failure -> `ApplicationError` |
| `GovernanceUnitOfWorkManager.commit(uow)` | 提交 staged writes | 所有必须写入完成后调用;commit 后不得继续使用该 UoW | `()` | commit failure -> operation failure;外部副作用不可包进该事务 |
| `GovernanceUnitOfWorkManager.rollback(uow)` | 回滚 staged writes | idempotency reserve conflict、domain error、repository error、payload build error、adapter precheck error 时调用 | `()` | rollback failure 进入 Step 12 operational error |
| `GovernanceContextRepository.get_with_version(context_ref)` | 读取 context truth 和 optimistic version | read-only;update path 必须使用返回 version | `Option<Versioned<GovernanceContext>>` | repository failure |
| `GovernanceContextRepository.find_by_subject(subject_ref, page)` | 按被治理对象列 context | read-only;stable page order;用于 query / duplicate prevention / projection source | `Page<Versioned<GovernanceContext>>` | repository failure |
| `GovernanceContextRepository.save(context, expected_version, uow)` | 创建或更新 context truth | `None` only create;`Some(version)` update;same UoW with trace/audit/outbox/stale/result on accepted command | `GovernanceContextRef` | duplicate / version conflict / repository failure |
| `GovernanceInputRepository.get_with_version(input_ref)` | 读取 input truth 和 optimistic version | read-only;state update path 使用返回 version | `Option<Versioned<GovernanceInput>>` | repository failure |
| `GovernanceInputRepository.list_by_context(context_ref, page)` | 列 context 下 inputs | read-only;stable page order | `Page<Versioned<GovernanceInput>>` | repository failure |
| `GovernanceInputRepository.list_by_source(source_ref, page)` | 按 source 反查 inputs | read-only;用于 consumer stale / reconciliation | `Page<Versioned<GovernanceInput>>` | repository failure |
| `GovernanceInputRepository.save(input, expected_version, uow)` | 创建或更新 input truth | `None` create;`Some(version)` update;accepted path 同 UoW append trace/outbox/result | `GovernanceInputRef` | duplicate / version conflict |
| `GateRepository.get_with_version(gate_ref)` | 读取 gate truth 和 version | read-only;attach decision / cancel / expire 使用返回 version | `Option<Versioned<Gate>>` | repository failure |
| `GateRepository.find_open_by_context(context_ref, page)` | 查 context 下 open/pending gate | read-only;stable order;用于防重复和 query | `Page<Versioned<Gate>>` | repository failure |
| `GateRepository.save(gate, expected_version, uow)` | 创建或更新 gate | `None` create;`Some(version)` update;decision attach 必须与 decision save 同 UoW | `GateRef` | duplicate / version conflict |
| `GovernanceDecisionRepository.get_with_version(decision_ref)` | 读取 decision truth 和 version | read-only;supersede/revoke 使用返回 version | `Option<Versioned<GovernanceDecision>>` | repository failure |
| `GovernanceDecisionRepository.find_current_by_gate(gate_ref)` | 找 gate 当前正式 decision | read-only;不得从 history 临时推断 | `Option<Versioned<GovernanceDecision>>` | repository failure |
| `GovernanceDecisionRepository.list_by_context(context_ref, page)` | 列 context decisions | read-only;stable order | `Page<Versioned<GovernanceDecision>>` | repository failure |
| `GovernanceDecisionRepository.save(decision, expected_version, uow)` | 创建或更新 decision | new proposed/finalized decision `None`;supersede/revoke `Some(version)`;history/outbox/stale same UoW | `GovernanceDecisionRef` | duplicate / version conflict |
| `ApproverRequirementRepository.get(requirement_ref)` | 读取 requirement sidecar value | read-only;immutable,不带 version | `Option<ApproverRequirement>` | repository failure |
| `ApproverRequirementRepository.save(requirement, uow)` | 保存 requirement | command UoW;PK conflict only;不得覆盖不同 body | `ApproverRequirementRef` | duplicate mismatch / repository failure |
| `ApprovalResponsibilityRepository.get_with_version(responsibility_ref)` | 读取 responsibility 和 version | read-only;assign/vote/delegate/release 使用返回 version | `Option<Versioned<ApprovalResponsibility>>` | repository failure |
| `ApprovalResponsibilityRepository.list_by_context(context_ref, page)` | 读取 chain satisfaction 所需 responsibility set | read-only;stable page;caller 必须处理分页或使用 bounded policy | `Page<Versioned<ApprovalResponsibility>>` | repository failure |
| `ApprovalResponsibilityRepository.list_by_actor(actor_ref, page)` | actor responsibility query | read-only;不读取 identity body | `Page<Versioned<ApprovalResponsibility>>` | repository failure |
| `ApprovalResponsibilityRepository.save(responsibility, expected_version, uow)` | 创建或更新 responsibility | `None` create;`Some(version)` update;history/outbox/stale/result same UoW | `ApprovalResponsibilityRef` | duplicate / version conflict |
| `ResponsibilityChainRepository.get_with_version(chain_ref)` | 读取 chain 和 version | read-only;append/satisfied/blocked/close 使用返回 version | `Option<Versioned<ResponsibilityChain>>` | repository failure |
| `ResponsibilityChainRepository.find_by_context(context_ref)` | 查 context active/current chain | read-only;不得由 gate 临时拼 chain ref | `Option<Versioned<ResponsibilityChain>>` | repository failure |
| `ResponsibilityChainRepository.save(chain, expected_version, uow)` | 创建或更新 chain | `None` create;`Some(version)` update;chain items 与 chain state 一起持久化 | `ResponsibilityChainRef` | duplicate / version conflict |
| `PolicyEffectiveFactRepository.get_with_version(policy_fact_ref)` | 读取 policy fact 和 version | read-only;update/suspend/retire/supersede 使用返回 version | `Option<Versioned<PolicyEffectiveFact>>` | repository failure |
| `PolicyEffectiveFactRepository.list_active_by_scope(scope_ref, page)` | policy guard / conflict detection | read-only;stable order;不读取 method body | `Page<Versioned<PolicyEffectiveFact>>` | repository failure |
| `PolicyEffectiveFactRepository.list_by_method_policy(method_policy_ref, page)` | method policy change affected facts | read-only;stable order | `Page<Versioned<PolicyEffectiveFact>>` | repository failure |
| `PolicyEffectiveFactRepository.save(policy_fact, expected_version, uow)` | 创建或更新 policy fact | `None` create;`Some(version)` update;conflict record/history/outbox/stale same UoW when same flow | `PolicyEffectiveFactRef` | duplicate / version conflict |
| `SharedRuleSetRepository.get_with_version(rule_set_ref)` | 读取 shared rule set 和 version | read-only;add/deprecate/retire 使用返回 version | `Option<Versioned<SharedRuleSet>>` | repository failure |
| `SharedRuleSetRepository.find_active_by_scope(scope_ref)` | 查 active shared rules | read-only;用于 policy guard/conflict detection | `Option<Versioned<SharedRuleSet>>` | repository failure |
| `SharedRuleSetRepository.save(rule_set, expected_version, uow)` | 创建或更新 shared rule set | `None` create;`Some(version)` update;rule items 与 state 一起保存 | `SharedRuleSetRef` | duplicate / version conflict |
| `PolicyConflictRepository.get_with_version(conflict_ref)` | 读取 conflict 和 version | read-only;resolve/waive/invalid 使用返回 version | `Option<Versioned<PolicyConflictRecord>>` | repository failure |
| `PolicyConflictRepository.list_unresolved_by_scope(scope_ref, page)` | 查 active unresolved conflict | read-only;用于 activation guard/query | `Page<Versioned<PolicyConflictRecord>>` | repository failure |
| `PolicyConflictRepository.save(conflict, expected_version, uow)` | 创建或更新 conflict | `None` create;`Some(version)` update;does not mutate policy facts unless same flow explicitly saves them | `PolicyConflictRecordRef` | duplicate / version conflict |
| `ControlApplicabilityRepository.get_with_version(applicability_ref)` | 读取 applicability 和 version | read-only;assessment update 使用返回 version | `Option<Versioned<ControlApplicability>>` | repository failure |
| `ControlApplicabilityRepository.list_by_context(context_ref, page)` | compliance / coverage query | read-only;stable page order | `Page<Versioned<ControlApplicability>>` | repository failure |
| `ControlApplicabilityRepository.list_by_method_control(method_control_ref, page)` | method control changed affected facts | read-only;stable order | `Page<Versioned<ControlApplicability>>` | repository failure |
| `ControlApplicabilityRepository.save(applicability, expected_version, uow)` | 创建或更新 applicability | `None` create;`Some(version)` update;history/outbox/stale same UoW | `ControlApplicabilityRef` | duplicate / version conflict |
| `ControlReviewRepository.get_with_version(review_ref)` | 读取 review 和 version | read-only;start/pass/fail/waive/supersede 使用返回 version | `Option<Versioned<ControlReview>>` | repository failure |
| `ControlReviewRepository.list_by_applicability(applicability_ref, page)` | 读取 applicability 下 reviews | read-only;stable order | `Page<Versioned<ControlReview>>` | repository failure |
| `ControlReviewRepository.save(review, expected_version, uow)` | 创建或更新 review | `None` create;`Some(version)` update;failed review 不自动写 nonconformity unless flow says so | `ControlReviewRef` | duplicate / version conflict |
| `ComplianceConclusionRepository.get_aiia_with_version(ref)` | 读取 AIIA conclusion 和 version | read-only;approve/reject/revoke/supersede 使用返回 version | `Option<Versioned<AIIAConclusion>>` | repository failure |
| `ComplianceConclusionRepository.get_soa_with_version(ref)` | 读取 SoA conclusion 和 version | read-only;approve/reject/revoke/supersede 使用返回 version | `Option<Versioned<SoAConclusion>>` | repository failure |
| `ComplianceConclusionRepository.list_by_context(context_ref, page)` | 统一列 AIIA / SoA versioned refs | read-only;返回 union ref+version,不合并成一个 domain object | `Page<ComplianceConclusionVersionedRef>` | repository failure |
| `ComplianceConclusionRepository.save_aiia(conclusion, expected_version, uow)` | 创建或更新 AIIA conclusion | `None` create;`Some(version)` update;history/outbox/stale/result same UoW | `AIIAConclusionRef` | duplicate / version conflict |
| `ComplianceConclusionRepository.save_soa(conclusion, expected_version, uow)` | 创建或更新 SoA conclusion | `None` create;`Some(version)` update;coverage refs persisted with conclusion | `SoAConclusionRef` | duplicate / version conflict |
| `NonconformityRepository.get_with_version(nonconformity_ref)` | 读取 nonconformity 和 version | read-only;confirm/correct/verify/close/reopen/reject 使用返回 version | `Option<Versioned<NonconformityRecord>>` | repository failure |
| `NonconformityRepository.list_by_context(context_ref, page)` | context nonconformity query/projection | read-only;stable order | `Page<Versioned<NonconformityRecord>>` | repository failure |
| `NonconformityRepository.list_open_by_owner(actor_ref, page)` | owner work queue query | read-only;stable order;不读取 identity body | `Page<Versioned<NonconformityRecord>>` | repository failure |
| `NonconformityRepository.save(record, expected_version, uow)` | 创建或更新 nonconformity | `None` create;`Some(version)` update;verification close requires verification saved/read in same flow | `NonconformityRef` | duplicate / version conflict |
| `CorrectiveActionRepository.get_action_with_version(action_ref)` | 读取 corrective action 和 version | read-only;start/complete/cancel/fail 使用返回 version | `Option<Versioned<CorrectiveAction>>` | repository failure |
| `CorrectiveActionRepository.get_verification_with_version(verification_ref)` | 读取 verification result 和 version | read-only;update only if Step 9 flow allows;usually immutable create | `Option<Versioned<VerificationResult>>` | repository failure |
| `CorrectiveActionRepository.list_actions_by_nonconformity(nonconformity_ref, page)` | nonconformity query / verification guard | read-only;stable order | `Page<Versioned<CorrectiveAction>>` | repository failure |
| `CorrectiveActionRepository.save_action(action, expected_version, uow)` | 创建或更新 corrective action | `None` create;`Some(version)` update;does not close nonconformity alone | `CorrectiveActionRef` | duplicate / version conflict |
| `CorrectiveActionRepository.save_verification(verification, expected_version, uow)` | 创建 verification result | `None` create;`Some(version)` only explicit update path;nonconformity close same UoW when passed | `VerificationResultRef` | duplicate / version conflict |

### 8.5 Trace / audit / history repository 语义

| 函数签名 | 作用 | 锁 / 事务要求 | 返回 | 错误 |
|---|---|---|---|---|
| `GovernanceTraceRepository.append(record, uow)` | 追加 accepted truth / consumer marker / export marker trace | append-only;same UoW as source truth/marker;generated trace id unique | `GovernanceTraceRecordRef` | duplicate trace id / repository failure |
| `GovernanceTraceRepository.get(trace_ref)` | 读取单条 trace | read-only;handoff/export must validate requested traces through this function | `Option<GovernanceTraceRecord>` | repository failure |
| `GovernanceTraceRepository.list_by_subject(subject_ref, page)` | trace query / audit / handoff source scan | read-only;stable page order by trace cursor/time | `Page<GovernanceTraceRecord>` | repository failure |
| `GovernanceAuditHistoryRepository.get_audit_trail_with_version(audit_ref)` | 读取 audit trail 和 version | read-only;trail update 使用返回 version | `Option<Versioned<GovernanceAuditTrail>>` | repository failure |
| `GovernanceAuditHistoryRepository.get_audit_trail_by_subject_with_version(subject_ref)` | 按 audit subject 唯一键读取 audit trail 和 version | accepted command 更新 audit trail 前必须使用;返回已有 `audit_trail_id` 与 expected version;missing 表示首次创建 | `Option<Versioned<GovernanceAuditTrail>>` | repository failure |
| `GovernanceAuditHistoryRepository.save_audit_trail(trail, expected_version, uow)` | 保存 audit trail ref chain | `None` create;`Some(version)` update;same UoW as accepted truth/trace | `GovernanceAuditTrailRef` | duplicate / version conflict |
| `append_decision_record(record, uow)` | 追加 decision history | append-only;same UoW as decision/gate transition | `DecisionRecordRef` | duplicate record id |
| `append_responsibility_record(record, uow)` | 追加 approval responsibility history | append-only;same UoW as responsibility/chain transition;includes `OpenGovernanceGateFlow` requirement path when it creates `ApprovalResponsibility` | `ResponsibilityTraceRecordRef` | duplicate record id |
| `append_policy_record(record, uow)` | 追加 policy/shared/conflict history | append-only;same UoW as policy/rule/conflict transition | `PolicyChangeRecordRef` | duplicate record id |
| `append_control_record(record, uow)` | 追加 control applicability/review history | append-only;same UoW as control transition | `ControlChangeRecordRef` | duplicate record id |
| `append_compliance_record(record, uow)` | 追加 AIIA/SoA conclusion history | append-only;same UoW as conclusion transition | `ComplianceConclusionRecordRef` | duplicate record id |
| `append_nonconformity_record(record, uow)` | 追加 nonconformity/corrective/verification history | append-only;same UoW as nonconformity/corrective transition | `NonconformityChangeRecordRef` | duplicate record id |

| append-only record rule | 正式口径 |
|---|---|
| identity | record id 必须来自 `IdGeneratorPort`,不得由 repository 拼接 |
| construction timing | record 字段若来自多个 truth transition,必须等所有字段来源形成后由 application flow 构造 |
| transaction | accepted command path 必须与 source truth save 同 UoW append |
| embedded object change | command flow 若在主对象之外创建 / 更新 secondary truth object 并发出该对象的 changed event,必须显式裁定是否 append 该对象家族的 history;`OpenGovernanceGateFlow` requirement path 创建 `ApprovalResponsibility` 时必须 append `ResponsibilityTraceRecord` |
| duplicate | duplicate replay 不追加新 record;直接读取 stored result |
| query | query 只能读取 record,不得补写缺失 history |

### 8.6 Projection / reconciliation repository 语义

| 函数签名 | 作用 | 锁 / 事务要求 | 返回 | 错误 |
|---|---|---|---|---|
| `GovernanceProjectionRepository.resolve_projection_target(view_ref)` | 将 public derived view ref 解析为 typed target | read-only;must use `projection_dependency_index` / view metadata,不得字符串猜测 | `Option<GovernanceProjectionTargetRef>` | repository failure |
| `find_dashboard_view_ref_by_scope(scope_ref)` | 按 scope 查 existing dashboard view ref | read-only;must use view metadata / projection index;missing 表示当前无已建 dashboard projection | `Option<DerivedGovernanceViewRef>` | repository failure |
| `find_policy_effective_view_ref_by_scope(scope_ref)` | 按 scope 查 existing policy effective view ref | read-only;不得生成新 view identity | `Option<PolicyEffectiveViewRef>` | repository failure |
| `find_control_coverage_view_ref_by_context(context_ref)` | 按 context 查 existing control coverage view ref | read-only;不得扫描 truth 临时聚合 view | `Option<ControlCoverageViewRef>` | repository failure |
| `find_nonconformity_status_view_ref_by_nonconformity(nonconformity_ref)` | 按 nonconformity 查 existing status view ref | read-only;不得从 nonconformity id 拼接 view ref | `Option<NonconformityStatusViewRef>` | repository failure |
| `GovernanceProjectionRepository.get_state_with_version(view_ref)` | 读取 projection freshness state 和 version | read-only;replace/failed/unavailable update 使用返回 version | `Option<Versioned<DerivedGovernanceViewState>>` | repository failure |
| `GovernanceProjectionRepository.get_dashboard_view(view_ref)` | 读取 dashboard projection | read-only;query 不重建 | `Option<GovernanceDashboardView>` | repository failure |
| `get_decision_summary_view(view_ref)` | 读取 decision summary projection | read-only | `Option<DecisionSummaryView>` | repository failure |
| `list_pending_decision_summary_views(context_ref, scope_ref, page)` | pending decision list query | read-only;existing projection only | `Page<DecisionSummaryView>` | repository failure |
| `get_policy_effective_view(view_ref)` | 读取 policy projection | read-only | `Option<PolicyEffectiveView>` | repository failure |
| `get_control_coverage_view(view_ref)` | 读取 control coverage projection | read-only | `Option<ControlCoverageView>` | repository failure |
| `get_nonconformity_status_view(view_ref)` | 读取 nonconformity projection | read-only | `Option<NonconformityStatusView>` | repository failure |
| `search_governance_facts(scope_ref, fact_kind, read_subject_ref, page)` | search projection query | read-only;body-free result items only | `Page<GovernanceFactSearchResultItem>` | repository failure |
| `list_views_affected_by_truth_change(change, page)` | command accepted 后定位 affected views | read-only;must use dependency index / committed metadata;stable page | `Page<DerivedGovernanceViewRef>` | repository failure |
| `list_views_affected_by_references(reference_refs, page)` | consumer/refresh success 后定位 affected views | read-only;input/output stable unique order | `Page<DerivedGovernanceViewRef>` | repository failure |
| `mark_stale(view_refs, source_cursor, uow)` | 标记 views stale | command/consumer/refresh UoW;idempotent when incoming cursor <= stored cursor | `()` | repository failure |
| `GovernanceUnitOfWork.assign_truth_change_cursor()` | 为 accepted command 分配 committed truth boundary cursor | all changed truth already saved/staged in same UoW;called once per accepted command before trace/outbox/stale/result | `GovernanceTruthCursor` | cursor allocation / transaction state failure |
| `save_state(state, expected_version, uow)` | 保存 view state only | `None` create;`Some(version)` update | `DerivedGovernanceViewRef` | version conflict |
| `replace_dashboard_view(view, state, expected_version, uow)` | 替换 dashboard view + state | rebuild UoW;state version from `get_state_with_version` or `None`;must update dependency index | `DerivedGovernanceViewRef` | version conflict |
| `replace_decision_summary_view(view, state, expected_version, uow)` | 替换 decision summary view + state | rebuild UoW;must update dependency index | `DecisionSummaryViewRef` | version conflict |
| `replace_policy_effective_view(view, state, expected_version, uow)` | 替换 policy effective view + state | rebuild UoW;must update dependency index | `PolicyEffectiveViewRef` | version conflict |
| `replace_control_coverage_view(view, state, expected_version, uow)` | 替换 control coverage view + state | rebuild UoW;must update dependency index | `ControlCoverageViewRef` | version conflict |
| `replace_nonconformity_status_view(view, state, expected_version, uow)` | 替换 nonconformity status view + state | rebuild UoW;must update dependency index | `NonconformityStatusViewRef` | version conflict |
| `GovernanceReconciliationReportRepository.get(report_ref)` | 读取 reconciliation report | read-only | `Option<GovernanceReconciliationReport>` | repository failure |
| `find_latest_by_scope(scope_ref)` | 查 scope latest report | read-only;stable latest rule by created cursor/time | `Option<GovernanceReconciliationReport>` | repository failure |
| `save(report, uow)` | 保存 reconciliation report | job UoW;report immutable or superseded by new report per Step 10 | `GovernanceReconciliationReportRef` | duplicate report id |

| projection rule | 正式口径 |
|---|---|
| query no-write | query 不调用 `mark_stale`、`save_state` 或 `replace_*` |
| query index lookup | projection-backed query 必须先通过正式 `find_*_view_ref_by_*` 读取 existing view ref;missing 只能返回 degraded/missing projection surface,不得创建或拼接 view ref |
| stale identity | affected view refs 只能来自 repository list,不得拼接 |
| replace atomicity | view body、view state、dependency index 必须在同一 UoW 替换 |
| missing state | rebuild 可用 `expected_version = None` 创建 new state;query 不创建 |
| failed rebuild | failure path 只保存 `Failed` / `Unavailable` state 或 job report,不改 source truth |

### 8.7 Reference snapshot repository 语义

| 函数签名 | 作用 | 锁 / 事务要求 | 返回 | 错误 |
|---|---|---|---|---|
| `ReferenceSnapshotRepository.get_reference_state_with_version(reference_ref)` | 读取 tracked reference state 和 version | read-only;refresh success/failure update 必须使用返回 version | `Option<Versioned<ReferenceResolutionState>>` | repository failure |
| `ReferenceSnapshotRepository.list_reference_states(scope, page)` | 按 refresh scope 列 tracked refs | read-only;stable page;returns `Versioned<T>` for per-item update | `Page<Versioned<ReferenceResolutionState>>` | repository failure |
| `ReferenceSnapshotRepository.save_reference_state(state, expected_version, uow)` | 保存 reference resolution state | `None` create only when flow explicitly tracks new ref;`Some(version)` update existing | `ExternalGovernanceReferenceRef` | version conflict |
| `ReferenceSnapshotRepository.get_actor_capability_snapshot(actor_ref)` | 按 actor ref 读取本地 body-free actor capability snapshot | read-only;query visibility / approval view / responsibility command 使用;不得触发 external resolver 或 identity refresh | `Option<ActorCapabilitySnapshot>` | repository failure |
| `save_actor_capability_snapshot(snapshot, expected_version, uow)` | 保存 actor capability body-free snapshot | `None` create;`Some(version)` update;same UoW as reference state save when from consumer/refresh | `ActorCapabilitySnapshotRef` | version conflict |
| `save_method_policy_snapshot(snapshot, expected_version, uow)` | 保存 method policy snapshot | same UoW as reference state;must persist `policy_ref` / `policy_version_ref` / `scope_ref` / `summary_ref` / `snapshot_state`;no method body | `MethodPolicySnapshotRef` | version conflict |
| `save_method_control_snapshot(snapshot, expected_version, uow)` | 保存 method control snapshot | same UoW as reference state;no control body | `MethodControlSnapshotRef` | version conflict |
| `save_evidence_summary_ref(summary_ref, expected_version, uow)` | 保存 evidence summary marker | same UoW as reference state;no artifact/evidence body | `EvidenceSummaryRef` | version conflict |
| `save_process_context_ref(context_ref, expected_version, uow)` | 保存 process context marker | same UoW as reference state;no process truth body | `ProcessGovernanceContextRef` | version conflict |
| `save_work_context_ref(context_ref, expected_version, uow)` | 保存 work context marker | same UoW as reference state;no work truth body | `WorkGovernanceContextRef` | version conflict |
| `save_runtime_signal_ref(signal_ref, expected_version, uow)` | 保存 runtime signal marker | same UoW as reference state;no runtime log body | `RuntimeSignalRef` | version conflict |

| `ExternalContextRefreshScope` branch | list rule | update rule |
|---|---|---|
| `ExplicitRefs(refs)` | 返回已存在 tracked refs;缺失 ref 由 job report 记录 failed/rejected item | existing state uses returned version;不得隐式创建 unknown state |
| `UnhealthyReferences` | 返回 `Unresolved/Stale/Unavailable/Invalid` 或 Step 10 定义的不健康 state | per-item update with returned version |
| `GovernanceScope(scope_ref)` | 通过 scope reference index 枚举关联 refs,再返回 tracked states | scope index 只能来自 Governance truth/snapshot metadata,不得扫描 sibling body |

Actor capability snapshot read 语义:

- `get_actor_capability_snapshot(actor_ref)` 只能读取已经由 `ConsumeIdentityActorCapabilityChangedFlow` 或 `RefreshExternalContextSnapshots` 保存的本地 body-free snapshot。
- `None` 在 query visibility 中映射为 degraded / not-visible marker;在 responsibility command guard 中按对应 flow 映射为 rejected / degraded,不得默认放行。
- `ReferenceResolutionState` 只表达 tracked external reference state,不能替代 `ActorCapabilitySnapshot` 传给 `ReadVisibilityPolicy`、`ApprovalResponsibilityPolicy` 或 `ApprovalResponsibilityView.actor_snapshot`。
- query path 不得调用 `ExternalGovernanceSourceResolverPort.resolve_actor_capability(...)` 主动刷新 identity;刷新只属于 consumer / refresh job / command precheck 已声明路径。

### 8.8 Outbox repository / publisher persistence 语义

| 函数签名 | 作用 | 锁 / 事务要求 | 返回 | 错误 |
|---|---|---|---|---|
| `GovernanceOutboxRepository.append(record, payload_snapshot, uow)` | accepted transaction 保存 outbox record + immutable payload snapshot | same UoW as source truth/trace;record and snapshot fields must match | `GovernanceOutboxRef` | duplicate outbox id / payload mismatch / repository failure |
| `GovernanceOutboxRepository.get_with_version(outbox_ref)` | 读取 outbox record 和 version | read-only;retry/dead-letter/reconciliation uses returned version | `Option<Versioned<GovernanceOutboxRecord>>` | repository failure |
| `GovernanceOutboxRepository.get_payload_snapshot(payload_snapshot_ref)` | 读取 stored outbound payload | read-only;publisher uses this payload only | `Option<GovernanceOutboxPayloadSnapshot>` | repository failure |
| `GovernanceOutboxRepository.list_pending_with_payload(page)` | 扫描 pending/retryable failed records | read-only;stable order;returns pending item with outbox version | `Page<Versioned<GovernanceOutboxPendingItem>>` | repository failure |
| `GovernanceOutboxRepository.mark_published(outbox_ref, publication_ref, expected_version, uow)` | 标记 publish success | publisher item UoW;expected_version from `list_pending_with_payload` or `get_with_version` | `()` | version conflict |
| `mark_failed(outbox_ref, failure_reason, expected_version, uow)` | 标记 publish temporary failure | publisher item UoW;expected_version from pending read | `()` | version conflict |
| `mark_dead_lettered(outbox_ref, reason, expected_version, uow)` | 标记 terminal publish failure | publisher item UoW;expected_version from pending read | `()` | version conflict |

| outbox persistence rule | 正式口径 |
|---|---|
| source payload | payload snapshot comes from accepted transaction build input,not from publisher lookup |
| version source | publication marker update uses version returned by pending list/get |
| missing payload | publisher never rebuilds;missing snapshot is failed/dead-letter per Step 12/13 |
| external publish call | external publish is outside Governance DB transaction;marker update is short UoW after call result |
| published terminal | `Published` / `DeadLettered` cannot return to `Pending` without formal operator recovery in later Step |

### 8.9 Handoff marker repository 语义

| 函数签名 | 作用 | 锁 / 事务要求 | 返回 | 错误 |
|---|---|---|---|---|
| `GovernanceHandoffMarkerRepository.get_with_version(marker_ref)` | 读取 marker 和 version | read-only;delivery retry/update uses returned version | `Option<Versioned<GovernanceHandoffMarker>>` | repository failure |
| `GovernanceHandoffMarkerRepository.list_by_target(target_ref, page)` | 按 handoff target 查询 markers | read-only;operations query / audit query | `Page<Versioned<GovernanceHandoffMarker>>` | repository failure |
| `GovernanceHandoffMarkerRepository.save(marker, expected_version, uow)` | 保存 prepared/delivered/failed marker | `None` create;`Some(version)` update;stored job report same UoW | `GovernanceHandoffMarkerRef` | version conflict |

| handoff persistence rule | 正式口径 |
|---|---|
| trace refs | marker `trace_refs` 必须非空;external GRC export 先 append marker trace 再 save marker |
| package body | marker stores package/receipt/failure refs only;no archive / observability / external GRC body |
| failed marker | failed marker is persisted for audit and duplicate replay;does not delete package ref |
| retry | retry that changes delivered/failed state must load marker version first;retry creating new package may create new marker |

### 8.10 Idempotency / stored result repository 语义

| 函数签名 | 作用 | 锁 / 事务要求 | 返回 | 错误 |
|---|---|---|---|---|
| `GovernanceIdempotencyRepository.reserve(operation_name, key, digest, uow)` | reserve command / consumer / job operation | first write in operation UoW;unique `(operation,key)`;same digest duplicate returns result ref if completed | `GovernanceIdempotencyReservation` | repository failure |
| `GovernanceIdempotencyRepository.complete(idempotency_ref, result_ref, uow)` | 将 reservation 完成到 stored result | same UoW as stored result save;must not complete before result exists | `()` | version/state conflict |
| `GovernanceIdempotencyRepository.mark_conflict(idempotency_ref, reason, uow)` | 记录 key digest conflict | conflict UoW;must not run domain mutation | `()` | repository failure |
| `StoredGovernanceResultRepository.save(result, uow)` | 保存 command result / command rejection / consumer receipt / job report | same UoW before idempotency complete;immutable after save | `GovernanceApplicationResultRef` | duplicate result id |
| `StoredGovernanceResultRepository.get(result_ref)` | 读取 stored operation result | read-only;duplicate replay path | `Option<StoredGovernanceOperationResult>` | repository failure |
| `get_command_result(result_ref)` | 读取 command result envelope | read-only;must validate result kind | `Option<GovernanceCommandResultEnvelope>` | wrong kind / repository failure |
| `get_command_rejection(result_ref)` | 读取 command rejection envelope | read-only;must validate result kind | `Option<GovernanceCommandRejectionEnvelope>` | wrong kind / repository failure |
| `get_consumer_receipt(result_ref)` | 读取 consumer receipt | read-only;must validate result kind | `Option<GovernanceConsumerReceipt>` | wrong kind / repository failure |
| `get_job_report(result_ref)` | 读取 job report | read-only;must validate result kind | `Option<GovernanceJobReport>` | wrong kind / repository failure |

| idempotency rule | 正式口径 |
|---|---|
| digest stability | digest excludes volatile timestamp,generated id,trace id,result ref and adapter latency |
| duplicate same digest | rollback current UoW if needed,read stored result by stored kind,return replay |
| conflict different digest | mark conflict or return conflict per Step 13;do not run mutation |
| missing stored result | completed idempotency without stored result is consistency defect;Step 12 maps to internal consistency error |
| job duplicate | duplicate job returns stored `GovernanceJobReport`;does not rescan page,republish outbox,refresh refs or prepare handoff |

### 8.11 Version / cursor / identity rules

| Token | Meaning | Allowed source | Forbidden use |
|---|---|---|---|
| `GovernanceVersion` | optimistic lock token for one persisted mutable object | `get_*_with_version`, `list_*` returning `Versioned<T>`, `list_pending_with_payload` for outbox | page cursor, truth cursor, timestamp, event sequence, hard-coded `1` |
| `GovernanceRepositoryCursor` | pagination position inside repository list | repository page response | optimistic lock, truth change cursor |
| `GovernanceTruthCursor` | committed truth/projection source ordering cursor | command accepted path: `GovernanceUnitOfWork.assign_truth_change_cursor()` after truth save in same UoW;read/job path: truth snapshot scan, trace cursor, projection rebuild result | optimistic lock, repository page cursor, timestamp, id generator, idempotency digest |
| `GovernanceOutboxPayloadSnapshotRef` | immutable payload snapshot identity | id generator/store during accepted transaction | event id, outbox id unless explicitly same by schema |
| `GovernanceApplicationResultRef` | stored replay result identity | id generator/result store save | idempotency key, trace id |
| `GovernanceTraceRecordRef` | trace record identity | id generator + trace append | handoff marker id, audit trail id |
| `DerivedGovernanceViewRef` | public projection identity | projection target resolver / view metadata / dependency index | ad hoc string from subject ref |

| write kind | expected_version |
|---|---|
| create new truth | `None`, with PK / unique conflict detection |
| update existing truth | `Some(version)` from matching `get_*_with_version` |
| append-only trace/history | no expected_version;generated id uniqueness |
| audit trail update | `Some(version)` when existing,`None` when created |
| projection replace existing | `Some(version)` from `get_state_with_version` |
| projection create state | `None` only when state missing and rebuild flow explicitly creates it |
| reference state update | `Some(version)` from `get_reference_state_with_version` or `list_reference_states` |
| outbox append | no expected_version;generated id + source unique guard |
| outbox publication marker | `Some(version)` from pending list/get |
| handoff marker update | `Some(version)` from `get_with_version`;new marker `None` |
| idempotency complete | reservation token / record ref from `reserve`;not a public expected_version |

### 8.12 事务边界表

| 场景 | 开始位置 | 提交位置 | 回滚条件 | 同事务内必须完成 |
|---|---|---|---|---|
| Command accepted path | application command service after request validation and before idempotency reserve | stored result saved and idempotency completed | idempotency conflict,missing truth,domain invalid transition,policy guard failure,repository failure,payload build failure,projection affected-view lookup failure | reserve idempotency,load versioned truth,save truth,assign truth change cursor,append applicable history,append trace,save audit trail,build and append outbox payload snapshot,mark affected views stale,save stored command result,complete idempotency |
| Command save-before rejected path | application command service after idempotency reserve but before accepted truth save | rejected result saved and idempotency completed | resolver/reference unresolved,policy/domain rejected,dependency unavailable mapped to protocol rejection,result store failure | reserve idempotency,build body-free `GovernanceProtocolRejection`,save `StoredGovernanceOperationResult::CommandRejection`,complete idempotency;do not save truth/history/trace/outbox/stale |
| Command duplicate same digest | application command service after reserve returns `Duplicate` | no business commit;current UoW rolled back before read-only replay | stored result missing/wrong kind | rollback current UoW,read stored command result or command rejection by stored kind,return replay;no truth/history/trace/outbox/stale write |
| Command idempotency conflict | application command service after reserve returns `Conflict` | conflict marker committed only if Step 13 requires persistence | digest mismatch or operation mismatch | optional `mark_conflict`;no domain mutation,no trace/outbox/stale |
| Command validation rejected before reserve | API/application validation before `begin()` or before reserve | no write transaction | invalid DTO,missing metadata,unsupported public route | no repository write;rejected response assembled by handler/service |
| Query read-only path | query service after request validation | no write commit | visibility denied,missing truth,repository failure | no write UoW;read truth/projection/reference/trace/report only;return body/not-visible/degraded/unavailable marker |
| Inbound consumer unsupported version | worker envelope version gate before payload parse | no write commit unless Step 13 dead-letter receipt says so | schema version unsupported | do not parse payload;do not save snapshot;do not mark stale;return unsupported receipt/dead-letter marker by Step 13 |
| Inbound consumer accepted path | consumer application service after envelope validation | stored consumer receipt saved and idempotency completed | idempotency conflict,body forbidden violation,resolver/snapshot validation failure,repository failure,affected-view lookup failure | reserve event idempotency,save reference state/snapshot or marker,mark affected views stale,append marker trace only when formal flow requires,save stored consumer receipt,complete idempotency |
| Inbound consumer duplicate | reserve returns `Duplicate` | no business commit | stored receipt missing/wrong kind | rollback current UoW,read stored consumer receipt,return replay |
| Outbox append helper | inside command accepted UoW after truth change and trace exist | command accepted UoW commit | payload builder failure,record/snapshot mismatch,repository append failure | create payload snapshot ref,build serialized payload,append outbox record and snapshot atomically |
| Publish outbox item | publisher service per pending item after pending list read and external publish attempt result | after `mark_published` / `mark_failed` / `mark_dead_lettered` | version conflict,marker repository failure | use pending item version,update publication state only;no truth/projection/reference update |
| Publish outbox duplicate job | job service reserve returns duplicate | no publish scan | stored job report missing/wrong kind | rollback current UoW,read stored job report,return replay |
| Rebuild projection job item | operations job after projection target resolved and source truth/snapshot loaded | after view body/state/dependency index replace and report item staged | target missing,source truth missing,version conflict,view assembly failure,repository failure | load state with version,assemble view from committed truth/snapshot,replace view body + state + dependency index,record report item |
| Rebuild projection job report | operations job after all items attempted | stored job report saved and idempotency completed | fatal report assembly failure,result store failure | save completed/partial/failed job report and complete idempotency;does not change source truth |
| Refresh reference item | operations job after `list_reference_states` returned item | after state/snapshot/stale marker update | resolver failure,version conflict,affected-view lookup failure,repository failure | save reference state with item version,save typed body-free snapshot/ref if resolved,mark affected views stale on success when formal helper returns views,record job item |
| Refresh reference failure item | resolver returns failure after tracked state loaded | after failed/unavailable/stale state persisted or item failure recorded | version conflict,repository failure | preserve existing snapshot;save failed/unavailable state with item version when Step 10 allows;do not create external truth |
| Reconciliation job | operations job after scope validation | report saved and idempotency completed | report assembly failure,result store failure | read truth/projection/reference/outbox;save report;save stored job result;complete idempotency;no repair writes |
| Trace handoff job | handoff job after trace refs and target validation | marker saved,stored job report saved,idempotency completed | trace missing,target disabled,adapter prepare/deliver failure,repository failure | validate/load traces,call handoff adapter,save prepared/delivered/failed marker,save stored job report,complete idempotency |
| Archive handoff job | archive job after trace/report refs validation | marker saved,stored job report saved,idempotency completed | trace/report missing,target disabled,adapter failure,repository failure | load trace/report refs,prepare archive package ref,save marker,save stored job report,complete idempotency;no archive body saved |
| External GRC export job | export job after truth snapshot/scope validation | marker trace + marker + stored job report committed | target disabled,snapshot missing,adapter failure,repository failure | append marker trace,create non-empty trace ref set,save prepared/delivered/failed marker,save stored job report,complete idempotency;no external GRC body saved |
| Runtime builder | infra runtime assembly | runtime facade exposed only after Ready | config validation failure,adapter init failure | no Governance truth transaction;only runtime-local availability/build state |

### 8.13 Command transaction ordering

所有 accepted command 必须使用下列相对顺序。具体 command 可以跳过不适用的 history record 或 secondary truth,但不得把 outbox / stored result 提前到 truth save 之前,也不得在 idempotency complete 后继续写业务副作用。

```text
validate public request and operation metadata
begin GovernanceUnitOfWork
reserve idempotency(operation, key, digest)
  Duplicate -> rollback, read stored command result or command rejection by result kind, return replay
  Conflict  -> mark conflict if required, commit or rollback per Step 13, return conflict
load required truth with get_*_with_version / list_* returning Versioned<T>
load body-free snapshots / reference states / policy guards
call domain factory / transition methods
save changed truth with expected_version
subject_refs = GovernanceTruthChangeSubjectMapper.<subject>s(changed_truth.to_ref())
source_cursor = GovernanceUnitOfWork.assign_truth_change_cursor()
build GovernanceTruthChange(s) from subject_refs.outbox_subject_ref + event descriptor + source_cursor
append applicable history records
append GovernanceTraceRecord::from_truth_change(..., subject_refs.trace_subject_ref, ...)
用 get_audit_trail_by_subject_with_version(subject_refs.audit_subject_ref) 按 subject 读取既有 GovernanceAuditTrail
  Some(versioned trail) -> 追加 trace ref 并用 Some(versioned.version) 保存
  None -> start_for_subject(new_audit_trail_id(), subject_refs.audit_subject_ref),追加 trace ref,并用 None 保存
build GovernanceOutboxPayloadSnapshot from committed truth change
append GovernanceOutboxRecord + payload snapshot
list affected views through GovernanceProjectionRepository
mark_stale(affected_views, change.source_cursor)
save StoredGovernanceOperationResult::Command(...)
complete idempotency(idempotency_ref, result_ref)
commit GovernanceUnitOfWork
```

| Ordering point | Required reason |
|---|---|
| idempotency before mutation | duplicate/conflict must not create trace/outbox/history |
| versioned read before transition | state transition and expected_version share same loaded truth |
| truth save before trace/outbox | trace/outbox describe committed accepted truth,not speculative transition |
| accepted subject before trace/audit/outbox | trace subject、audit subject 和 outbox subject 必须来自同一个 `GovernanceTruthChangeSubjectMapper` result;不得由各 repository 分别推导 |
| source cursor after truth save | `GovernanceTruthChange.source_cursor` must be assigned by the same UoW after changed truth is saved/staged;validation failure、duplicate 和 rollback path 不分配 cursor |
| history after transition | history fields come from from/to state and formal reason/basis |
| payload snapshot before outbox append | record must reference immutable payload snapshot saved in same UoW |
| affected views after truth change known | affected view lookup needs formal `GovernanceTruthChange` and source cursor |
| stored result before idempotency complete | duplicate replay cannot point to missing result |
| no writes after idempotency complete | completed record declares operation durable |

### 8.13-a Command save-before rejected ordering

当 command 已完成 idempotency reserve,但在 accepted truth save 前被 resolver、reference state、domain policy 或 application guard 正式拒绝时,必须使用下列相对顺序。该路径不分配 truth cursor,不构造 `GovernanceTruthChange`,不 append history / trace / audit / outbox,不 mark projection stale。

```text
validate public request and operation metadata
begin GovernanceUnitOfWork
reserve idempotency(operation, key, digest)
  Duplicate -> rollback, read stored command result or command rejection by result kind, return replay
  Conflict  -> mark conflict if required, commit or rollback per Step 13, return conflict
load only the refs/snapshots needed for precheck
build body-free GovernanceProtocolRejection
save StoredGovernanceOperationResult::CommandRejection(...)
complete idempotency(idempotency_ref, rejected_result_ref)
commit GovernanceUnitOfWork
return GovernanceCommandOutcome::Rejected(...)
```

| Ordering point | Required reason |
|---|---|
| rejection result before idempotency complete | duplicate replay cannot point to missing rejection |
| no truth cursor | no accepted truth was saved or staged |
| no trace/history/outbox/stale | rejected path must not look like accepted truth propagation |
| no writes after idempotency complete | completed record declares rejected outcome durable |

### 8.14 Consumer transaction ordering

Inbound consumers include method/library, identity/capability, artifact/evidence, process/work/runtime context, external GRC/imported governance source and any event that only refreshes local reference/snapshot state. They do not create core Governance truth unless Step 9 names a command flow that does so.

```text
validate envelope metadata and schema version
unsupported version -> return unsupported/dead-letter receipt without parsing payload
begin GovernanceUnitOfWork
reserve idempotency(inbound_event_kind, event_idempotency_key, digest)
  Duplicate -> rollback, read stored consumer receipt, return replay
  Conflict  -> mark conflict if required, no snapshot mutation
parse typed payload after version accepted
validate body-free payload boundary
load tracked reference state with get_reference_state_with_version or list_reference_states item
save ReferenceResolutionState and typed snapshot/ref with expected_version
list affected views by references
mark_stale(affected_views, cursor)
append marker trace only if the flow formally requires trace
save StoredGovernanceOperationResult::ConsumerReceipt(...)
complete idempotency
commit
```

| Consumer write | Allowed | Forbidden |
|---|---|---|
| reference state | resolved/stale/unavailable/invalid marker with version | creating sibling truth body |
| snapshot/ref | body-free actor/method/evidence/process/work/runtime summary or ref | saving policy/control/evidence/process/work/raw body |
| projection | stale marker for existing public views | rebuilding view body inline |
| trace | marker trace only when Step 9 requires | fake accepted truth trace |
| outbox | only if Step 9 explicitly defines consumer outbound event | implicit event for every snapshot |
| result | stored consumer receipt | rebuilding receipt on duplicate |

### 8.15 Publisher transaction ordering

Outbox publish deliberately separates external publish calls from Governance truth transactions.

```text
list_pending_with_payload(page) -> Versioned<GovernanceOutboxPendingItem>
for each item:
  payload_snapshot = get_payload_snapshot(item.payload_snapshot_ref)
  if missing -> begin tx, mark_failed/dead_lettered(item.record, item.version), commit
  publish stored payload snapshot to configured publisher
  begin GovernanceUnitOfWork
  if publish success -> mark_published(outbox_ref, publication_ref, item.version)
  if publish retryable failure -> mark_failed(outbox_ref, reason, item.version)
  if publish fatal/exhausted -> mark_dead_lettered(outbox_ref, reason, item.version)
  commit
assemble job report and stored result per job transaction rule
```

| Publisher invariant | Rule |
|---|---|
| no current truth read | publisher receives `GovernanceOutboxPayloadSnapshot`,not truth repository handles |
| item-level version | each marker update uses version returned with pending item |
| no long DB transaction | external publish call is outside `GovernanceUnitOfWork` |
| version conflict | another worker updated the record;item is skipped/reported conflict,not overwritten |
| missing snapshot | consistency failure;do not rebuild payload |

### 8.16 Operations job transaction ordering

Operations jobs share idempotency/result rules but differ in item transaction size. P0 permits one UoW per job run or per item+final report as long as stored job report accurately reflects committed item changes. Step 13 will refine retry and partial commit details; this Step fixes the minimum consistency rule.

| Job | Allowed reads | Allowed writes | Forbidden writes |
|---|---|---|---|
| `RebuildGovernanceProjections` | committed truth snapshot,projection target,state,body-free snapshots | projection view body,state,dependency index,stored job report,idempotency | Governance core truth,outbox publication,reference state repair unrelated to item |
| `RefreshExternalContextSnapshots` | tracked reference state,external resolver body-free result,projection affected view list | reference state,body-free snapshot/ref,projection stale marker,stored job report,idempotency | sibling truth body,core Governance truth,view body rebuild |
| `RunGovernanceReconciliation` | truth snapshot,projection state,outbox state,reference state,reports | reconciliation report,stored job report,idempotency | repairing truth/projection/outbox/reference |
| `PrepareGovernanceTraceHandoff` | trace records,target availability,existing markers | handoff marker,stored job report,idempotency | trace mutation,observability body |
| `PrepareGovernanceArchiveHandoff` | trace records,reconciliation reports,target availability | handoff marker,stored job report,idempotency | archive package body,truth mutation |
| `PrepareExternalGrcExport` | truth snapshot,target availability,trace repository | marker trace,handoff marker,stored job report,idempotency | external GRC document body,core truth mutation |

| Job result consistency | Rule |
|---|---|
| accepted job report | report includes only item changes actually committed or formal failed item refs |
| duplicate job | duplicate returns stored report;does not rescan,republish,rebuild,refresh or handoff |
| partial failure | completed item commits must be reflected in report;failed item refs must be typed and body-free |
| fatal pre-validation | rejected job can return rejected run result without idempotency mutation unless Step 13 says otherwise |
| fatal after accepted start | save failed job report when enough operation context exists |

### 8.17 Handoff / export marker transaction ordering

Handoff and export jobs interact with external systems, but Governance only persists marker refs and receipts.

```text
validate job metadata, target_ref, scope/ref set
begin GovernanceUnitOfWork
reserve job idempotency
duplicate -> rollback, read stored job report, return replay
load required trace/report/snapshot refs
for external GRC export:
  create GovernanceTraceRecord::from_marker(...)
  append trace
  create GovernanceTraceRecordRefSet with that trace ref
call adapter prepare/export/deliver outside or inside marker staging as Step 14 binding permits
create GovernanceHandoffMarker::prepared / delivered / failed
save marker with expected_version None or loaded version
save stored GovernanceJobReport
complete idempotency
commit
```

| Handoff invariant | Rule |
|---|---|
| trace refs non-empty | all markers require non-empty `trace_refs`;external GRC export creates marker trace first |
| adapter body boundary | adapter may return package/receipt/failure refs,not package/document body |
| marker state | `Prepared` may become `Delivered` or `Failed`;`Delivered` and `Failed` are terminal unless Step 13 defines new marker retry |
| target disabled | no adapter body call;save failed marker only when trace refs are valid and job accepted |
| archive/export | archive/GRC truth remains external;Governance stores marker and report only |

### 8.18 Query no-write boundary

| Query family | Reads allowed | Writes forbidden | Degraded / missing behavior |
|---|---|---|---|
| truth query | truth repositories,reference state,visibility policy | trace,audit,outbox,projection repair,reference refresh | return not-visible/degraded/unavailable marker per Step 8/12 |
| projection query | projection view,state,dependency metadata | mark stale,rebuild,replace view | return stale/freshness/degraded marker |
| trace query | trace repository,audit trail,handoff marker | append trace,repair audit trail | missing trace -> not found/degraded,not synthetic trace |
| reconciliation query | report repository,projection/reference/outbox state | run reconciliation or repair findings | return latest/missing report response |
| dashboard/search query | projection/search store,visibility policy | rebuild search facts or refresh snapshots | stale search returns stale marker,not hidden mutation |

Query path may call repository reads that return `Versioned<T>`,but it must not pass those versions into writes. Visibility denied must not be implemented by throwing a generic repository error;it must return the Step 8 not-visible surface with marker.

### 8.19 一致性策略表

| 数据 / 副作用 | 一致性策略 | 成功条件 | 失败 / 恢复 |
|---|---|---|---|
| core Governance truth | local strong consistency inside UoW | truth save committed with expected_version and idempotency result | rollback command UoW;no trace/outbox/stale/result |
| trace / audit / history | same-UoW with accepted truth or marker | trace/history/audit persisted before stored result complete | rollback accepted command/job;do not later patch missing accepted trace silently |
| outbox append | same-UoW with accepted truth | outbox record + payload snapshot saved atomically | rollback accepted command;publisher never sees partial record |
| outbox publication | eventual consistency per item | external publish result reflected in publication state with expected_version | failed/dead-letter marker;truth remains committed |
| projection stale | same-UoW with source truth or reference state change | affected public views marked stale with source cursor | rollback accepted source update if affected view lookup/mark fails in same path |
| projection rebuild | eventual consistency by job | view body,state and dependency index replaced atomically | state failed/unavailable or job failed item;source truth unchanged |
| reference snapshot | eventual consistency with versioned marker | reference state and typed snapshot/ref saved with expected_version | failed/unavailable marker or failed job item;old snapshot preserved |
| reconciliation report | eventually generated report | report saved and stored job result points to it | failed report or rejected job;no repair side effect |
| handoff/export marker | eventually prepared/delivered/failed marker | marker and stored job report committed | failed marker/report;external package/document body not stored |
| idempotency / stored result | local strong consistency with operation result | stored result saved before idempotency complete | completed-with-missing-result is consistency defect;duplicate must not rerun |
| API / worker / job entry state | runtime consistency only | entry disposition reflects application result or validation issue | no domain truth write;retry/backoff handled by Step 13/14 |

### 8.20 Failure recovery table

| Failure | Where detected | Persisted marker | Retry / recovery | Must not do |
|---|---|---|---|---|
| optimistic version conflict | repository save/marker update | none unless operation report records conflict | caller reloads through formal read path;Step 12 maps to conflict response | overwrite without version |
| idempotency same key same digest duplicate | idempotency reserve | existing completed record | replay stored result | rerun mutation/job/publish |
| idempotency same key different digest | idempotency reserve | optional conflict marker | return conflict;operator/user uses new key | run operation partially |
| missing stored result for completed idempotency | duplicate replay | consistency issue ref by Step 12 | fail fast/internal consistency error | reconstruct result from current truth |
| missing outbox payload snapshot | publisher `get_payload_snapshot` | `Failed` or `DeadLettered` outbox marker | operator recovery / dead-letter handling by Step 13 | rebuild payload from current truth |
| publisher transient failure | publisher port | `OutboxPublicationState::Failed` | retry if Step 13 policy allows `Failed -> Pending` | rollback committed truth |
| publisher fatal/unsupported schema | publisher/version gate | `DeadLettered` | operator/manual recovery by Step 13 | parse unsupported payload as accepted |
| projection source truth missing | rebuild job | view state `Unavailable` or job failed item | later rebuild after source restored/contract fixed | create placeholder truth |
| projection replace version conflict | projection repository | job failed item | skip/retry item after reload | overwrite view state |
| reference resolver unavailable | resolver port | `ReferenceResolutionKind::Unavailable` or failed job item | retry refresh per Step 13 | save external body or mark truth ready without resolved state |
| reference invalid | resolver/source says invalid | `ReferenceResolutionKind::Invalid` | replacement/new reference path only unless Step 13 defines recovery | mutate invalid state to resolved implicitly |
| affected view lookup failure | projection repository | operation failure or job failed item | retry whole operation/item | silently skip stale marker |
| trace append failure in command | trace repository | none | rollback command | commit truth without required trace |
| history append failure in command | audit/history repository | none | rollback command | commit truth and backfill history later |
| audit trail update failure | audit/history repository | none | rollback command if trail required by flow | ignore audit chain divergence |
| handoff target disabled | adapter registry | failed marker only if job accepted and trace refs valid | retry after config enables target | call disabled adapter or save package body |
| handoff prepare failure | handoff adapter | failed marker and job failed/partial report | retry with new marker or formal retry transition | delete trace/report refs |
| external GRC export adapter failure | export adapter | marker trace + failed marker + job report | retry by new run/marker | save external GRC document body |
| query visibility denied | visibility policy | no write marker | return not-visible surface | write audit/projection/reference repair |

### 8.21 Cross-store consistency invariants

| Invariant | Required by | Persistence rule |
|---|---|---|
| context source uniqueness | context create / submit input | repository enforces configured active uniqueness;duplicate command uses idempotency,not silent merge |
| gate finalization | record decision | `Gate.decision_ref` and finalized `GovernanceDecision` save in same UoW |
| supersede decision | supersede command | current decision and next decision saves in same UoW;history records for both if flow requires |
| chain satisfaction | vote flow | responsibility vote save and chain state save in same UoW when same flow marks satisfied |
| policy conflict detection | policy/shared rule flows | policy/rule save and conflict record save in same UoW when conflict is created by same command |
| compliance approval | approve conclusion | conclusion state save and decision/basis refs must already exist or be saved in same UoW as flow defines |
| nonconformity closure | verify nonconformity | verification result save and nonconformity close save in same UoW when verification passed |
| corrective action completion | complete corrective action | action completed save does not imply nonconformity close unless nonconformity save also occurs in flow |
| truth change outbox | accepted command | every outbound-required truth change must have outbox record + payload snapshot in same UoW |
| projection stale | accepted command/consumer/refresh | affected views from repository must be stale-marked before stored result complete |
| audit / trace | accepted command | accepted truth trace and required history must be appended before stored result complete |
| stored replay | all idempotent operations | stored result saved before idempotency complete |
| handoff marker trace_refs | handoff/export jobs | marker save rejects empty trace refs;external GRC export appends marker trace first |

### 8.22 Outbox payload snapshot persistence schema

`GovernanceOutboxPayloadSnapshot` is a stored shell, not a domain truth object. Its serialized payload is the Step 8 outbound event DTO bytes captured in the accepted transaction.

| Field | Type | Source | Persistence rule |
|---|---|---|---|
| `snapshot_ref` | `GovernanceOutboxPayloadSnapshotRef` | `IdGeneratorPort.new_outbox_payload_snapshot_ref()` | PK;immutable |
| `event_kind` | `GovernanceOutboxEventKind` | `GovernanceOutboxRecord.event_kind` | must equal record event kind |
| `subject_ref` | `GovernanceOutboxSubjectRef` | truth change / trace / view state subject | must equal record subject ref |
| `schema_version` | `GovernanceEventSchemaVersion` | Step 8 event schema version;minimum `v1` | unsupported handled by publisher/consumer Step 12/13 |
| `serialized_payload` | `GovernanceSerializedOutboundPayload` | outbound payload builder in accepted transaction | immutable;no current truth lookup |
| `core_trace_id` | `TraceId` | operation context / trace record | redacted-safe;captured at append time from core metadata or event/job envelope |
| `created_at` | `GovernanceTimestamp` | `ClockPort.now()` | metadata only;not optimistic version |

| Consistency check | Rule |
|---|---|
| record/snapshot equality | `event_kind`, `subject_ref`, `core_trace_id` must align;failure rejects append |
| payload source | payload builder may read saved truth/snapshot in memory from current flow,not later repository current state |
| redaction | serialized payload must not include external body forbidden by Step 6/8 |
| replay | publisher publishes exactly stored bytes plus envelope metadata;no recomputation |

### 8.23 Projection dependency index schema

`projection_dependency_index` plus projection view metadata is the formal source for `list_views_affected_by_truth_change(...)`, `list_views_affected_by_references(...)`, `resolve_projection_target(...)`, and projection-backed query lookup functions such as `find_policy_effective_view_ref_by_scope(...)`.

| Field | Type | Source | Rule |
|---|---|---|---|
| `dependency_kind` | `GovernanceProjectionDependencyKind` | projection replace assembler | finite enum: context, decision, gate, policy, rule set, control, conclusion, nonconformity, corrective, verification, external reference, scope |
| `dependency_ref` | typed ref encoded as `GovernanceProjectionDependencyRef` | source truth/snapshot/view target | body-free typed identity only |
| `derived_view_ref` | `DerivedGovernanceViewRef` | projection target | public view identity from Step 8 |
| `projection_kind` | `GovernanceProjectionKind` | resolved target | used for stable list and replace branch |
| `lookup_kind` | `GovernanceProjectionLookupKind` | projection replace assembler | finite enum for query lookup keys: dashboard-by-scope, policy-effective-by-scope, control-coverage-by-context, nonconformity-status-by-nonconformity |
| `lookup_ref` | typed ref encoded as `GovernanceProjectionLookupRef` | source query identity | scope/context/nonconformity typed identity only;must match view body target fields |
| `source_cursor` | `GovernanceTruthCursor` | rebuild source snapshot | not a version |

| Function | Uses index how |
|---|---|
| `resolve_projection_target(view_ref)` | reads view metadata / dependency rows to map public view to typed target |
| `find_dashboard_view_ref_by_scope(scope_ref)` | reads query lookup row `(dashboard-by-scope, scope_ref)` and returns an existing dashboard view ref |
| `find_policy_effective_view_ref_by_scope(scope_ref)` | reads query lookup row `(policy-effective-by-scope, scope_ref)` and returns an existing policy view ref |
| `find_control_coverage_view_ref_by_context(context_ref)` | reads query lookup row `(control-coverage-by-context, context_ref)` and returns an existing coverage view ref |
| `find_nonconformity_status_view_ref_by_nonconformity(nonconformity_ref)` | reads query lookup row `(nonconformity-status-by-nonconformity, nonconformity_ref)` and returns an existing status view ref |
| `list_views_affected_by_truth_change(change, page)` | maps truth change subject/ref/scope to existing view refs |
| `list_views_affected_by_references(refs, page)` | maps external reference refs to existing view refs |
| `replace_*_view` | replaces rows for the view atomically with view body/state and lookup/dependency rows |

No flow may derive a `DerivedGovernanceViewRef` by concatenating project/context/scope/ref strings. If dependency rows are missing, a stale/rebuild flow must return empty affected page or failed item according to Step 9/12. If query lookup rows are missing, a projection-backed query must return the formal missing / degraded projection surface. Neither path may invent projection identity.

### 8.24 Reference scope index schema

`ReferenceSnapshotRepository.list_reference_states(scope, page)` requires a formal scope index so refresh jobs do not scan unrelated stores or inspect sibling bodies.

| Scope | Index source | Returned state |
|---|---|---|
| `ExplicitRefs(refs)` | input refs intersect tracked `reference_resolution_states` | existing `Versioned<ReferenceResolutionState>` only |
| `UnhealthyReferences` | `reference_resolution_states.resolution_kind` unhealthy index | existing unhealthy tracked states |
| `GovernanceScope(scope_ref)` | Governance-owned truth/snapshot metadata that links scope to external refs | existing tracked states under scope |

| Reference type | Scope link examples | Snapshot store |
|---|---|---|
| actor capability | responsibility actor / context owner / nonconformity owner | `actor_capability_snapshots` |
| method policy | policy effective fact | `method_policy_snapshots` |
| method control | control applicability | `method_control_snapshots` |
| evidence summary | decision basis,control review,verification result | `evidence_summary_refs` |
| process context | governed subject / process context marker | `process_governance_context_refs` |
| work context | governed subject / corrective work ref / work governance marker | `work_governance_context_refs` |
| runtime signal | runtime signal marker used by nonconformity/control evidence | `runtime_signal_refs` |

If a scope link points to a ref with no tracked `ReferenceResolutionState`, the refresh job records a failed/missing item or ignores it according to Step 12. It must not create a resolved state without resolver output.

### 8.25 Stored result persistence schema

| Field | Type | Source | Rule |
|---|---|---|---|
| `application_result_ref` | `GovernanceApplicationResultRef` | id generator / result store | PK;referenced by idempotency complete |
| `operation_kind` | `GovernanceOperationKind` | command / consumer / job service | must match idempotency operation |
| `result_kind` | `StoredGovernanceResultKind` | service branch | command result / command rejection / consumer receipt / job report |
| `serialized_surface` | typed result DTO or body-free serialized shell | Step 8 result/receipt/report builder | immutable;redacted-safe |
| `trace_record_ref` | optional `GovernanceTraceRecordRef` | accepted path trace | optional for rejected/unsupported/no-write results |
| `created_at` | `GovernanceTimestamp` | `ClockPort.now()` | metadata;not version |

| Replay branch | Required read | If missing |
|---|---|---|
| command accepted duplicate | `get_command_result(result_ref)` | internal consistency error;do not reconstruct |
| command rejected duplicate | `get_command_rejection(result_ref)` | internal consistency error;do not rerun resolver or policy |
| consumer duplicate | `get_consumer_receipt(result_ref)` | internal consistency error;do not reparse event |
| job duplicate | `get_job_report(result_ref)` | internal consistency error;do not rerun job |

### 8.26 Handoff marker persistence schema

| Field | Type | Source | Rule |
|---|---|---|---|
| `handoff_marker_ref` | `GovernanceHandoffMarkerRef` | `IdGeneratorPort.new_handoff_marker_id()` | PK |
| `handoff_kind` | `GovernanceHandoffKind` | job kind | trace/archive/external GRC export |
| `target_ref` | `TraceHandoffTargetRef` or formal target wrapper from Step 8 | job request / adapter registry | body-free target identity |
| `trace_refs` | `GovernanceTraceRecordRefSet` | job input or marker trace | non-empty |
| `handoff_state` | `GovernanceHandoffState` | marker factory / transition | `Prepared/Delivered/Failed` |
| `package_ref` | optional package/export ref | adapter prepare/export result | ref only;no package body |
| `receipt_ref` | optional receipt ref | adapter deliver/export result | ref only |
| `failure_ref` | optional failure ref | adapter failure classifier | redacted ref/reason only |
| `created_at` / `updated_at` | `GovernanceTimestamp` | `ClockPort.now()` | metadata |

| Marker case | Required persisted data |
|---|---|
| trace handoff prepared | marker ref,target,non-empty trace refs,package ref,state prepared |
| trace handoff delivered | prepared marker plus receipt ref,state delivered |
| trace handoff failed | marker ref,target,non-empty trace refs,failure ref,optional package ref,state failed |
| archive handoff prepared/failed | marker ref,target,trace/report refs represented by marker/report fields,package or failure ref |
| external GRC export prepared/failed | marker trace already appended;marker trace ref included in `trace_refs`;package/export or failure ref |

### 8.27 Consistency anti-patterns

| Anti-pattern | Why invalid | Correct rule |
|---|---|---|
| `expected_version = Some(1)` for existing record | loses concurrency semantics | load `Versioned<T>` from repository |
| use page cursor as version | cursor is list position,not row version | use `GovernanceVersion` only |
| publish by loading current truth | event payload changes with later truth state | publish stored payload snapshot |
| construct affected views from string template | violates public projection identity closure | call `list_views_affected_by_*` / `resolve_projection_target` |
| query repairs stale projection | query path creates hidden mutation | return stale/degraded and let job rebuild |
| consumer stores external body | violates sibling data ownership | store body-free snapshot/ref/digest/version |
| duplicate job reruns scan | may duplicate side effects | replay stored job report |
| handoff marker without trace refs | cannot audit marker source | create/load formal trace refs first |
| reconciliation fixes drift inline | report becomes hidden repair command | save report only |
| completed idempotency before result save | duplicate points to missing result | save result first,then complete |

## 9. 前序契约回填

本 Step 不直接修改 Step 6~10 的内容,但 Step 19 装配正式 `03-详细设计.md` 时必须把下列约束回填到对应章节。若后续 Step 12~16 对错误、幂等、配置、观测或测试做更精确约束,以更晚 Step 的正式闭口为准,但不得放宽本 Step 的数据所有权和 version 来源规则。

| 回填目标 | 必须写入的正式口径 | 来源 |
|---|---|---|
| `03-详细设计.md` §5 application port | `GovernanceVersion` 只能来自 versioned read/list;`GovernanceUnitOfWork` 是 accepted write path 的唯一 transaction boundary | §8.4、§8.11 |
| `03-详细设计.md` §5 domain object | domain 不访问 repository、不生成 id、不提交事务、不发布 outbox;只返回 state transition / change object | §8.13、Step 6 |
| `03-详细设计.md` §5 infra adapter | durable adapter 可自由选物理存储,但必须保留 logical key/index/version/append-only semantics | §8.2 |
| `03-详细设计.md` §5.10 persistence | logical store table、repository semantic table、transaction boundary table、一致性策略 table | §8.1~§8.27 |
| `03-详细设计.md` §8 transaction | command/consumer/publisher/job/handoff query no-write boundaries | §8.12~§8.18 |
| `03-详细设计.md` §9 outbox | outbox record + payload snapshot same UoW;publisher only reads stored snapshot | §8.8、§8.22 |
| `03-详细设计.md` §9 projection | affected views from repository / dependency index;query no-write;replace view/state/index atomically | §8.6、§8.23 |
| `03-详细设计.md` §9 reference | refresh scope list uses tracked reference state and scope index;body-free snapshots only | §8.7、§8.24 |
| `03-详细设计.md` §9 idempotency | stored result saved before idempotency complete;duplicate replays stored surface | §8.10、§8.25 |
| `03-详细设计.md` §9 handoff/export | marker body-free;trace refs non-empty;external GRC export appends marker trace first | §8.9、§8.17、§8.26 |

## 10. Cross-step closure audit

| 审查项 | 结论 | 证据 |
|---|---|---|
| Step 6 object 字段是否有持久化落点 | 通过 | §8.1 数据所有权表和 §8.2 logical store 表覆盖 truth、snapshot、projection、trace、audit、history、outbox、handoff、idempotency、stored result |
| Step 7 repository 是否有持久化语义 | 通过 | §8.4~§8.10 为 Step 7 port 固定 read/write/version/transaction/error 语义 |
| Step 8 DTO/result/event/job 是否有 storage surface | 通过 | outbox payload snapshot、stored result、job report、consumer receipt、projection view/report 均有 store |
| Step 9 transaction ordering 是否收束 | 通过 | §8.12~§8.17 汇总 command、consumer、publisher、operations job、handoff/export transaction |
| Step 10 state matrix 是否有 version / persistence guard | 通过 | stale/failed/unavailable/published/dead-letter/delivered/failed marker 均有 expected_version 或 append-only rule |
| optimistic version 来源是否闭合 | 通过 | §8.11 明确 allowed source;禁止 cursor/timestamp/hard-coded version |
| outbox payload source 是否闭合 | 通过 | §8.22 要求 accepted transaction stored snapshot,publisher no current truth lookup |
| projection identity 是否闭合 | 通过 | §8.23 定义 dependency index and resolver;禁止 ad hoc view id |
| reference refresh list 是否闭合 | 通过 | §8.24 定义 refresh scope index and tracked state |
| stored result replay 是否闭合 | 通过 | §8.25 定义 command/consumer/job replay surface |
| handoff marker trace refs 是否闭合 | 通过 | §8.26 requires non-empty trace refs;external GRC export marker trace first |
| no external body boundary 是否闭合 | 通过 | §8.1、§8.7、§8.19、§8.20 均禁止 sibling/external body persistence |

## 11. Step 12~16 handoff

| 后续 Step | 待闭合事项 | 本 Step 固定输入 |
|---|---|---|
| Step 12 Error / recovery | classify version conflict、missing stored result、missing outbox payload、projection source missing、resolver unavailable、target disabled、commit failure | §8.20 failure recovery table |
| Step 13 Concurrency / idempotency | retry policy,dead-letter policy,partial job commit,operator recovery,duplicate replay exact semantics | §8.10、§8.11、§8.15、§8.16 |
| Step 14 Config / external binding | publisher topic/schema map,adapter availability slots,handoff target registry,external GRC export binding | §8.8、§8.9、§8.17、§8.26 |
| Step 15 Observability / audit | trace subject mapping,audit source,history kind,redacted consistency issue refs,commit/rollback telemetry | §8.5、§8.13、§8.20 |
| Step 16 Test cuts | repository contract tests,transaction ordering tests,no-write query tests,outbox snapshot tests,projection dependency tests,reference scope tests,stored result duplicate tests | §8.3、§8.10、§8.12~§8.27 |

## 12. Stop-review checklist

| Checklist item | Status | Notes |
|---|---|---|
| 数据所有权实现表已覆盖本仓 owned truth、snapshot、projection、trace、audit、history、outbox、handoff、idempotency、stored result | 通过 | §8.1 |
| logical store 契约已给出 key/index/version 语义 | 通过 | §8.2 |
| repository 函数表已覆盖 Step 7 port 持久化语义 | 通过 | §8.4~§8.10 |
| transaction boundary table 已覆盖 command/query/consumer/publisher/job/handoff/export | 通过 | §8.12~§8.18 |
| 一致性策略和失败恢复已覆盖 outbox、projection、reference、handoff、stored result | 通过 | §8.19~§8.20 |
| outbox payload snapshot schema 已闭合 | 通过 | §8.22 |
| projection dependency index 已闭合 | 通过 | §8.23 |
| reference scope index 已闭合 | 通过 | §8.24 |
| duplicate replay stored result schema 已闭合 | 通过 | §8.25 |
| handoff marker persistence schema 已闭合 | 通过 | §8.26 |
| 反例 / anti-pattern 已列出 | 通过 | §8.27 |

## 13. Step 完成记录

| 项目 | 结论 |
|---|---|
| Step 11 是否完成 | 是 |
| 是否需要回改 Step 6~10 | 暂无必须即时回改;Step 19 装配正式 `03-详细设计.md` 时按 §9 回填 |
| 是否发现新的标准经验 | 待最终检查 `设计真相源闭环与可落码性标准.md` 后决定 |
| 下一步 | Step 12 `03_ddd_step_12_error_recovery.md`:错误模型、异常分支与恢复口径 |
