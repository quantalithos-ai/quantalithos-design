# L1-process 03 DDD Step 11 持久化、事务与一致性契约

> SOP: `standards/document/详细设计讨论流程_SOP.md` Step 11
> 书写规范: `standards/document/详细设计书写规范.md` §5.10
> 上游输入: `projects/L1-process/01-架构设计.md` §8;`projects/L1-process/02-概要设计.md` §10
> 直接输入:
> - `projects/L1-process/design-calibration/03_ddd_step_06_object_contracts.md`
> - `projects/L1-process/design-calibration/03_ddd_step_07_trait_port_adapter_contracts.md`
> - `projects/L1-process/design-calibration/03_ddd_step_08_protocol_contracts.md`
> - `projects/L1-process/design-calibration/03_ddd_step_09_function_flows.md`
> - `projects/L1-process/design-calibration/03_ddd_step_10_state_matrix.md`
> 创建日期: 2026-06-06
> 状态: Completed

---

## 1. Step 状态

本 Step 已完成。

---

## 2. 本步输入

| 输入 | 用途 | 结论 |
|---|---|---|
| `01-架构设计.md` §8 | 数据所有权和一致性原则 | Process 拥有 runtime process truth、local snapshot、projection、trace、outbox 和 technical stores;外部仓只保存 ref / summary / marker |
| Step 6 对象契约 | truth object、projection、snapshot、trace、outbox 字段和状态 | 持久化约束必须回指 Step 6 字段;发现 handoff / outbox evidence 字段缺口时已同步回填 Step 6 / Step 8 |
| Step 7 trait / port 契约 | repository、UnitOfWork、idempotency、operation result store、publisher、handoff port | 持久化函数必须回指 Step 7 trait;发现 handoff scope 扫描函数缺口时已同步回填 Step 7 |
| Step 8 protocol 契约 | command result、consumer receipt、job receipt、scope、outbound event DTO | duplicate replay result / receipt 以 Step 8 DTO 为存储 surface |
| Step 9 函数流 | command / query / consumer / job 事务位置 | 本步聚合成事务边界表 |
| Step 10 状态矩阵 | 状态迁移、非法转换、状态副作用 | 本步定义 optimistic version、append-only、per-item tx 和补偿规则 |

---

## 3. SOP 问题回答

1. 哪些数据对象由本仓拥有?

   回答:本仓拥有 `RuntimeProcessShape`、`ProcessProfile`、`ProcessInstance`、`Activity`、`Token`、`Gateway`、`WaitingGate`、`PauseContext`、`ProcessCheckpoint`、`RecoveryAttempt`、`ProcessStageState`、`ProcessTimeboxBinding`、trace / audit / outbox / projection / reconciliation / idempotency / operation result store。外部 method、work、identity、governance、artifact、runtime、conversation truth 不属于本仓。

2. 哪些只是引用、快照或投影?

   回答:`MethodDefinitionSnapshot`、`WorkContextSnapshot`、`ActorCapabilitySnapshot`、`GovernanceDecisionRef`、`ArtifactEvidenceMarker`、`RuntimeFeedbackRef`、`ConversationContextRef` 和 `ReferenceResolutionState` 是本地 snapshot / marker。`ProcessReadModel`、`ProcessTimelineView`、`ProcessProgressSummary`、`ActivityStatusView`、`DerivedProcessViewState`、`ReconciliationReport` 是派生 / report。它们不得反向改写核心 truth。

3. repository 函数如何命名，参数和返回是什么?

   回答:完全沿用 Step 7。mutable truth 读取返回 `Versioned<T>`;保存函数接收 `expected_version: StorageVersion` 与 `&mut dyn UnitOfWorkHandle`。append-only history / trace / audit / outbox append 不接收 expected version,但必须在 UoW 内写入。duplicate replay 通过 `OperationResultRepository::get_result(ApplicationResultRef)` 读取。

4. 哪些处理流需要事务，事务内必须完成哪些写入?

   回答:command、consumer、job 写路径需要 `UnitOfWork`。command 必须同事务保存 truth、trace / audit、outbox、operation result 和 idempotency completion。consumer 必须同事务保存 snapshot / marker / stale state、operation receipt 和 event idempotency completion。job 对 outbox publish / handoff 可采用 per-item transaction;projection / refresh / reconciliation / recovery maintenance 按 scope 或 item 事务保存结果。

5. 是否需要乐观锁、行锁、版本号、outbox 或 projection?

   回答:需要。Step 7 的 `Versioned<T>` / `StorageVersion` 是 optimistic concurrency 口径。P0 repository 不要求显式 SQL `FOR UPDATE`,但同一写事务中由 expected version 防止并发覆盖。outbox 与 command truth 同事务写入;projection 由 committed truth / trace 异步重建。

6. 如果事件发布或 projection 更新失败，如何恢复?

   回答:outbox publish 外部调用失败不回滚已提交 truth,而是写 `RetryPending` / `Failed`。handoff 外部调用失败不回滚 trace / archive marker,而是写 `TraceHandoffState::Failed` 并保留 retryable / permanent failure marker。projection rebuild 失败只更新 `DerivedProcessViewState::Failed`;query 返回 degraded / unavailable surface。resolver failure 写 `ReferenceResolutionState::Unavailable` / `Unresolved` 或 delayed receipt,不得补造外部 truth。

---

## 4. 当前文档问题诊断

| 来源 | 问题 | 本 Step 收口 |
|---|---|---|
| Step 7 | repository 已有函数,但没有统一持久化所有权表 | 补数据所有权实现表 |
| Step 9 | 事务规则分散在 command / consumer / job 模板和逐接口流 | 聚合成事务边界表 |
| Step 10 | 状态矩阵要求状态副作用,但未说明存储策略 | 补版本、append-only、per-item transaction 和补偿规则 |
| Step 8 / Step 9 | consumer / job duplicate 要返回原 receipt | 已回填 Step 7/8/9 的 `OperationResultRepository` 口径,本 Step 纳入 technical store |
| projection / report | 可重建对象容易被误当 truth | 明确 projection / report 不反写 core truth |

---

## 5. 设计取舍

| 议题 | 方案 | 取舍 |
|---|---|---|
| 是否指定物理数据库 | A. 指定 SQL DDL;B. 定义 logical store / repository 契约 | 采用 B。P0 不强制迁移脚本,in-memory 和 durable adapter 共享行为语义 |
| 并发控制 | A. 每个 repository 自行决定;B. `Versioned<T>` + `StorageVersion` 统一 | 采用 B。保持 Step 7 可落码 |
| command result / consumer receipt / job receipt | A. 分三个 store;B. 统一 `OperationResultRepository` | 采用 B。`ApplicationResultRef` 可覆盖 command / event / job duplicate |
| outbox publish | A. publish 与 DB transaction 同时打开;B. 外部调用后短事务更新 state | 采用 B。避免长事务包外部副作用 |
| projection failure | A. 回滚来源 truth;B. 标记 projection failed / stale | 采用 B。projection 是派生状态 |

---

## 6. 结构化中间产物

### 6.1 数据所有权实现表

| 数据对象 | 拥有模块 | 写入方 | 读取方 | 一致性要求 |
|---|---|---|---|---|
| `RuntimeProcessShape` | `domain/runtime_shape.rs` | shape command / method consumer stale marker | profile command、query、projection job | `shape_id` 唯一;save 使用 loaded `StorageVersion` |
| `ProcessProfile` | `domain/process_profile.rs` | profile command | instance command、query、projection job | active / suspended / retired 按 Step 10;change record append 同事务 |
| `ProfileChangeRecord` | `domain/process_profile.rs` | profile command | audit、projection、query | append-only;不得替代 `ProcessProfile` 当前状态 |
| `ProcessInstance` | `domain/process_instance.rs` | instance / gate / recovery command | activity command、query、projection、reconciliation | state transition 必须使用 expected version;recovery 不 fork instance |
| `Activity` | `domain/activity.rs` | instance start、activity command、feedback command | query、projection、runtime feedback consumer marker | `activity_id` 唯一;feedback ref only;no runtime body |
| `ActivityProgressionRecord` | `domain/activity.rs` | activity command | timeline、audit、projection | append-only;from / to state 来自 committed transition |
| `Token` | `domain/token_gateway.rs` | instance / activity / gate command | activity command、reconciliation | flow position 由 expected version 保护 |
| `Gateway` | `domain/token_gateway.rs` | instance / activity command | activity command、reconciliation | route / join state 按 Step 10;`selected_route_ref` 是 route selection 的 committed truth;不实现完整 BPMN 引擎 |
| `WaitingGate` | `domain/waiting_gate.rs` | gate command、governance consumer marker | query、projection、reconciliation | decision marker 不等同 resume;resume 走 command |
| `PauseContext` | `domain/waiting_gate.rs` | open waiting gate command | resume gate、query | append / immutable context;不保存 decision body |
| `WaitingGateChangeRecord` | `domain/waiting_gate.rs` | gate command、governance consumer marker | audit、timeline | append-only |
| `ProcessCheckpoint` | `domain/checkpoint.rs` | checkpoint command、maintenance policy | recovery command、query | supersede / expire 使用 expected version |
| `RecoveryAttempt` | `domain/recovery.rs` | recovery command、maintenance job | query、reconciliation | no truth fork;state transition 和 instance recovery 同事务 when command |
| `RecoveryHistoryRecord` | `domain/recovery.rs` | recovery command、maintenance job | trace、query、audit | append-only |
| `ProcessStageState` | `domain/rhythm.rs` | rhythm command | summary projection、query | stage state save 使用 expected version |
| `ProcessTimeboxBinding` | `domain/rhythm.rs` | rhythm command、work context consumer stale marker | query、projection | external timebox ref only;no Work truth |
| `MethodDefinitionSnapshot` | `domain/reference.rs` | resolver / method consumer / refresh job | shape command、query、projection | local safe snapshot;no method body |
| `WorkContextSnapshot` | `domain/reference.rs` | resolver / work consumer / refresh job | profile / rhythm command、query | local safe snapshot;no work truth |
| `ActorCapabilitySnapshot` | `domain/reference.rs` | actor capability consumer / refresh job | assignment / visibility policy | local safe snapshot;no identity lifecycle |
| `GovernanceDecisionRef` | `contracts/refs.rs` + `domain/reference.rs` | governance consumer / resolver | gate command / query | marker only;no decision body |
| `ArtifactEvidenceMarker` | `contracts/refs.rs` + `domain/reference.rs` | artifact consumer / resolver | checkpoint / recovery command、query | marker only;no artifact body or package content |
| `RuntimeFeedbackRef` | `contracts/refs.rs` + `domain/reference.rs` | runtime feedback consumer / resolver | activity feedback command / query | marker only;no runtime log |
| `RuntimeFeedbackSummary` | `domain/reference.rs` | runtime feedback consumer / resolver | activity feedback command policy / query marker | body-free summary only;`contains_runtime_body` must be false before persistence |
| `ConversationContextRef` | `contracts/refs.rs` + `domain/reference.rs` | conversation consumer / resolver | trace / query | marker only;no conversation body |
| `ReferenceResolutionState` | `domain/reference.rs` | consumer / refresh job | command / query / projection | resolution state must expose stale / unavailable / invalid |
| `ProcessTraceRecord` | `domain/trace.rs` | command / consumer marker / job marker | timeline、handoff、query | append-only from committed `ProcessTruthChange` |
| `ProcessAuditTrail` | `domain/trace.rs` | command / trace service | audit query / reports | record refs only;not source of truth |
| `TraceHandoffRecord` | `domain/trace.rs` + `contracts/refs.rs` identity | trace / archive handoff job | handoff job、query | receipt / external ref marker only;no observability / archive body |
| `ProcessOutboxRecord` | `domain/outbox.rs` | command / consumer / projection marker / publish job | publish job、reconciliation | append with truth + outbound payload snapshot;publish state changes later by expected version |
| `DerivedProcessViewState` | `domain/projection.rs` | projection / consumer stale marker / job | query、reconciliation | source cursor only moves forward |
| `ProcessReadModel` | `domain/projection.rs` | projection rebuild job | query、search、reconciliation | derived from committed truth;no reverse write |
| `ProcessTimelineView` | `domain/projection.rs` | projection rebuild job | query | derived from trace;gap must be visible |
| `ProcessProgressSummary` | `domain/projection.rs` | projection rebuild job | query | `ProcessProgressState` is derived,not command state |
| `ActivityStatusView` | `domain/projection.rs` | query mapper / projection job | query | read-only view;does not advance activity |
| `ReconciliationReport` | `domain/projection.rs` | reconciliation job | query、operations | report only;does not repair truth |
| `IdempotencyRecord` | `application/idempotency.rs` | command / consumer / job service | same operation duplicate path | key + digest + operation unique;complete with result ref |
| `StoredProcessOperationResult` | `application/idempotency.rs` | command / consumer / job service | duplicate replay | stores command result / consumer receipt / job receipt surface |

### 6.2 存储对象 / collection / projection 契约表

表名是 logical store 契约名,不是强制 DDL。durable adapter 可以物理合表,但 repository 行为、唯一键、索引和版本语义必须等价。

| 存储对象 | 用途 | 主键 / 唯一键 | 关键索引 | 版本字段 |
|---|---|---|---|---|
| `runtime_process_shapes` | runtime shape truth | `shape_id`;unique(`definition_ref`,`definition_version_ref`) | `shape_state`,`definition_ref` | `storage_version` |
| `process_profiles` | profile truth | `profile_id`;unique active by `project_ref` when state active | `project_ref`,`shape_ref`,`profile_state` | `storage_version` |
| `profile_change_records` | profile change history | `change_id` | `profile_ref`,`actor_ref` | append-only;optional `storage_version` |
| `process_instances` | instance truth | `process_instance_id` | `profile_ref`,`project_ref`,`instance_state`,`current_activity_ref` | `storage_version` |
| `activities` | activity truth | `activity_id` | `process_instance_id`,`shape_node_ref`,`activity_state`,`assignee_ref` | `storage_version` |
| `activity_progression_records` | activity transition history | `progression_id` | `activity_ref`,`from_state`,`to_state` | append-only;optional `storage_version` |
| `tokens` | token flow state | `token_id` | `process_instance_id`,`position_ref`,`token_state` | `storage_version` |
| `gateways` | gateway flow state | `gateway_id` | `shape_node_ref`,`gateway_state`,`selected_route_ref` | `storage_version` |
| `waiting_gates` | waiting gate truth | `waiting_gate_id` | `process_instance_id`,`activity_ref`,`gate_state`,`decision_ref` | `storage_version` |
| `pause_contexts` | waiting pause context | `pause_context_id` | `activity_ref`,`resume_requirement_ref` | immutable or `storage_version` |
| `waiting_gate_change_records` | waiting gate transition history | `change_id` | `waiting_gate_ref`,`from_state`,`to_state` | append-only;optional `storage_version` |
| `process_checkpoints` | checkpoint truth | `checkpoint_id` | `process_instance_id`,`activity_ref`,`checkpoint_state` | `storage_version` |
| `recovery_attempts` | recovery attempt truth | `recovery_attempt_id` | `process_instance_id`,`checkpoint_ref`,`recovery_state`,`failure_reason`,`abandon_reason` | `storage_version` |
| `recovery_history_records` | recovery history | `history_id` | `process_instance_ref`,`checkpoint_ref`,`attempt_ref`,`history_kind` | append-only;optional `storage_version` |
| `process_stage_states` | stage truth | `stage_id` | `process_instance_id`,`stage_kind`,`stage_state` | `storage_version` |
| `process_timebox_bindings` | timebox binding truth | `binding_id` | `process_timebox_ref`,`external_timebox_ref`,`binding_state` | `storage_version` |
| `method_definition_snapshots` | safe method summary | unique(`definition_ref`,`definition_version_ref`) | `definition_kind`,`snapshot_state.reference_ref` | `storage_version` |
| `work_context_snapshots` | safe work summary | `work_context_ref` | `project_ref`,`iteration_ref`,`snapshot_state.reference_ref` | `storage_version` |
| `actor_capability_snapshots` | safe identity capability summary | `actor_ref` | `member_ref`,`snapshot_state.reference_ref` | `storage_version` |
| `reference_resolution_states` | external ref resolution marker | `reference_state_id`;unique(`reference_ref`) | `resolution_state`,`snapshot_ref` | `storage_version` |
| `governance_decision_markers` | governance decision marker | `external_ref` | `decision_kind`,`decision_state.reference_ref` | `storage_version` |
| `artifact_evidence_markers` | artifact evidence marker | source evidence ref | `resolution_state`,`source_digest` | `storage_version` |
| `runtime_feedback_markers` | runtime feedback marker | `external_ref` | `feedback_kind`,`feedback_state.reference_ref` | `storage_version` |
| `runtime_feedback_summaries` | body-free runtime feedback summary | `feedback_summary_ref`;unique(`runtime_feedback_ref`,`activity_ref`) | `feedback_kind`,`feedback_state.reference_ref`,`source_digest` | `storage_version` |
| `conversation_context_markers` | conversation context marker | unique(`conversation_ref`,`context_kind`) | `context_state.reference_ref` | `storage_version` |
| `process_trace_records` | committed truth trace | `trace_id` | `subject_ref`,`change_ref`,`trace_context` | append-only;optional `storage_version` |
| `process_audit_trails` | subject audit chain | `audit_trail_id`;unique(`subject_ref`) | `subject_ref` | `storage_version` |
| `trace_handoff_refs` | trace / archive handoff marker | `handoff_ref`;unique(`handoff_kind`,`trace_record_ref`,`target_ref`) while not terminal;unique(`handoff_kind`,`external_ref`) when external exists | `trace_record_ref`,`target_ref`,`handoff_state`,`handoff_kind`,`external_ref`,`receipt_ref`,`archive_package_ref`,`failure_ref`,`cancel_reason`,`delivered_at` | `storage_version` |
| `process_outbox_records` | outbox publication state and outbound payload snapshot | `outbox_id` | `publication_state`,`event_kind`,`truth_ref`,`trace_context`,`visibility_marker`,`payload_snapshot` | `storage_version` |
| `process_read_models` | process read model projection | `read_model_id`;unique(`process_instance_ref`) | `profile_ref`,`current_activity_ref`,`view_state_ref` | projection `storage_version` |
| `process_timeline_views` | timeline projection | `timeline_id`;unique(`process_instance_ref`) | `view_state_ref` | projection `storage_version` |
| `process_progress_summaries` | summary projection | `summary_id`;unique(`process_instance_ref`) | `stage_ref`,`progress_state`,`view_state_ref` | projection `storage_version` |
| `activity_status_views` | activity status projection | `activity_status_view_id`;unique(`activity_ref`) | `activity_state`,`assignee_ref`,`feedback_state.reference_ref` | projection `storage_version` |
| `derived_process_view_states` | projection freshness state | `view_state_id`;unique(`projection_kind`,`source_cursor_ref`) when active | `projection_kind`,`freshness_state` | `storage_version` |
| `reconciliation_reports` | reconciliation report | `report_id` | `scope_ref`,`result_state` | immutable or `storage_version` |
| `idempotency_records` | command / event / job reservation and completion | operation-specific key;unique(`operation_kind`,`key`) | `request_digest`,`result_ref`,`metadata.trace_context`,`completed_at` | `storage_version` |
| `operation_results` | duplicate replay surface | `result_ref` | `operation_result_kind` | immutable after commit |

### 6.3 Repository 函数表

下表是 Step 7 函数的持久化约束摘要。不得用本表新增 Step 7 未定义的 repository 方法。

| 函数签名 | 作用 | 锁 / 事务要求 | 返回 | 错误 |
|---|---|---|---|---|
| `UnitOfWork::begin()` | 开启 command / consumer / job 写事务 | application service 内调用;query 禁用 | `Box<dyn UnitOfWorkHandle>` | `UnitOfWorkError` |
| `UnitOfWorkHandle::commit(self)` | 提交本事务 staged writes | 所有必须写入完成后消费 handle | `()` | `UnitOfWorkError` |
| `UnitOfWorkHandle::rollback(self)` | 回滚本事务 staged writes | domain / repository / idempotency error 时调用 | `()` | `UnitOfWorkError` |
| `IdempotencyRepository::reserve_command(operation, key, digest, ...)` | command idempotency reservation | 在 command write transaction 起始阶段调用;`operation` 为 `ProcessCommandKind` | `IdempotencyReservation` | `IdempotencyError` |
| `IdempotencyRepository::reserve_event(operation, key, digest, ...)` | inbound event dedup reservation | consumer write transaction 起始阶段调用;`operation` 为 `ProcessInboundEventKind` | `IdempotencyReservation` | `IdempotencyError` |
| `IdempotencyRepository::reserve_job(operation, key, digest, ...)` | job idempotency reservation | job transaction 起始阶段调用;`operation` 为 `ProcessJobKind`;per-item mutation 可另开事务 | `IdempotencyReservation` | `IdempotencyError` |
| `IdempotencyRepository::complete(...)` | 将 reservation 完成到 `ApplicationResultRef` | 与 operation result / receipt 保存同事务 | `()` | `IdempotencyError` |
| `OperationResultRepository::save_result(...)` | 保存 command result / consumer receipt / job receipt | 必须在 idempotency complete 前同事务写入 | `()` | `RepositoryError` |
| `OperationResultRepository::get_result(...)` | duplicate replay 读取 result / receipt | 只读;不得重放 domain transition | `Option<StoredProcessOperationResult>` | `RepositoryError` |
| `ProcessShapeRepository::get(...)` | 读取 shape | 只读 | `Option<Versioned<RuntimeProcessShape>>` | `RepositoryError` |
| `ProcessShapeRepository::find_by_definition_version(...)` | 按外部 definition/version 查 shape | 只读;unique lookup | `Option<Versioned<RuntimeProcessShape>>` | `RepositoryError` |
| `ProcessShapeRepository::get_gateway_route_set(...)` | 读取 gateway 可选 route 集合 | 只读;由 indexed method snapshot 形成 body-free summary | `Option<GatewayRouteSet>` | `RepositoryError` |
| `ProcessShapeRepository::save(...)` | 保存 shape | 使用 loaded / initial `StorageVersion`;写事务内 | `StorageVersion` | `RepositoryError` |
| `ProcessProfileRepository::get(...)` / `find_active_by_project(...)` | 读取 profile | 只读;update path 使用 returned version | `Option<Versioned<ProcessProfile>>` | `RepositoryError` |
| `ProcessProfileRepository::save(...)` | 保存 profile | optimistic save;同事务 append change record when changed | `StorageVersion` | `RepositoryError` |
| `ProcessProfileRepository::append_change_record(...)` | 追加 profile change | command transaction 内 append-only | `()` | `RepositoryError` |
| `ProcessInstanceRepository::get(...)` | 读取 instance | update path 使用 returned version | `Option<Versioned<ProcessInstance>>` | `RepositoryError` |
| `ProcessInstanceRepository::list_by_profile(...)` / `list_by_work_context(...)` | 分页读取 instances | read-only page | `Page<Versioned<ProcessInstance>>` | `RepositoryError` |
| `ProcessInstanceRepository::save(...)` | 保存 instance | optimistic save;与 activity/token/gate/recovery 相关变化同事务 | `StorageVersion` | `RepositoryError` |
| `ActivityRepository::get(...)` / `list_by_instance(...)` | 读取 activity | update path 使用 returned version | `Option` / `Page<Versioned<Activity>>` | `RepositoryError` |
| `ActivityRepository::save(...)` | 保存 activity | optimistic save;同事务 append progression record | `StorageVersion` | `RepositoryError` |
| `ActivityRepository::append_progression_record(...)` | 追加 activity progression | append-only;command transaction 内 | `()` | `RepositoryError` |
| `TokenGatewayRepository::get_token(...)` / `get_gateway(...)` | 读取 token / gateway | update path 使用 returned version | `Option<Versioned<_>>` | `RepositoryError` |
| `TokenGatewayRepository::list_tokens_by_instance(...)` | 分页读取 token | read-only page | `Page<Versioned<Token>>` | `RepositoryError` |
| `TokenGatewayRepository::save_token(...)` / `save_gateway(...)` | 保存 token / gateway | optimistic save;与 instance/activity transition 同事务 | `StorageVersion` | `RepositoryError` |
| `WaitingGateRepository::get_gate(...)` / `find_open_by_instance(...)` | 读取 waiting gate | update path 使用 returned version | `Option` / `Page<Versioned<WaitingGate>>` | `RepositoryError` |
| `WaitingGateRepository::get_pause_context(pause_context_ref)` | 读取 immutable pause context | read-only sidecar truth;不带 optimistic version | `Option<PauseContext>` | `RepositoryError` |
| `WaitingGateRepository::save_gate(...)` | 保存 waiting gate | optimistic save;与 instance/token/pause context 同事务 | `StorageVersion` | `RepositoryError` |
| `WaitingGateRepository::save_pause_context(...)` | 保存 pause context | open gate transaction 内;immutable semantics | `()` | `RepositoryError` |
| `WaitingGateRepository::append_change_record(...)` | 追加 waiting change | append-only | `()` | `RepositoryError` |
| `CheckpointRepository::get(...)` / `latest_for_instance(...)` | 读取 checkpoint | update path 使用 returned version | `Option<Versioned<ProcessCheckpoint>>` | `RepositoryError` |
| `CheckpointRepository::save(...)` | 保存 checkpoint | optimistic save;supersede previous checkpoint uses its loaded version | `StorageVersion` | `RepositoryError` |
| `RecoveryRepository::get_attempt(...)` / `list_pending_attempts(...)` | 读取 recovery attempt | maintenance job uses returned versions per item | `Option` / `Page<Versioned<RecoveryAttempt>>` | `RepositoryError` |
| `RecoveryRepository::save_attempt(...)` | 保存 recovery attempt | optimistic save;command path may also save instance | `StorageVersion` | `RepositoryError` |
| `RecoveryRepository::append_history(...)` | 追加 recovery history | append-only;state changed transaction 内 | `()` | `RepositoryError` |
| `RhythmRepository::get_stage(...)` / `get_binding(...)` / `find_active_binding(...)` | 读取 rhythm truth | update path 使用 returned version | `Option<Versioned<_>>` | `RepositoryError` |
| `RhythmRepository::save_stage(...)` / `save_binding(...)` | 保存 stage / binding | optimistic save;with trace / outbox when Step 9 requires | `StorageVersion` | `RepositoryError` |
| `TraceRepository::append_trace(...)` | 追加 trace record | 与 committed truth change 同事务 | `()` | `RepositoryError` |
| `TraceRepository::append_audit_record(...)` | 追加 audit ref | 与 trace append 同事务 when required | `()` | `RepositoryError` |
| `TraceRepository::save_handoff_ref(...)` | 保存 handoff record marker | handoff prepare / delivery transaction 内 | `()` | `RepositoryError` |
| `TraceRepository::list_trace_records(...)` / `list_trace_records_for_handoff(...)` / `list_handoff_refs(...)` | 读取 trace / handoff records | read-only page;delivery path uses loaded marker state | `Page<_>` | `RepositoryError` |
| `ProcessOutboxRepository::append(...)` | 写 outbox record | 与 source truth / trace 同事务 | `()` | `RepositoryError` |
| `ProcessOutboxRepository::get(...)` / `list_pending(...)` | 读取 outbox | publish path uses returned `StorageVersion` | `Option` / `Page<Versioned<ProcessOutboxRecord>>` | `RepositoryError` |
| `ProcessOutboxRepository::save_state(...)` | 保存 publication state | external publish 后短事务 optimistic save | `StorageVersion` | `RepositoryError` |
| `ProjectionRepository::upsert_read_model(...)` / `upsert_timeline(...)` / `upsert_progress_summary(...)` | 保存 projections | projection job transaction 内;同事务 save view state | `()` | `RepositoryError` |
| `ProjectionRepository::find_read_model(...)` / `find_timeline(...)` / `search_instances(...)` | 读取 projections | query read-only;不得修复 | `Option` / `Page<_>` | `RepositoryError` |
| `ProjectionRepository::save_view_state(...)` / `get_view_state(...)` | 保存 / 读取 freshness marker | save in projection / stale marker transaction | `()` / `Option<DerivedProcessViewState>` | `RepositoryError` |
| `ReferenceSnapshotRepository::upsert_method_snapshot(...)` / `upsert_work_snapshot(...)` / `upsert_actor_capability_snapshot(...)` | 保存 safe snapshot | consumer / refresh transaction 内 | `()` | `RepositoryError` |
| `ReferenceSnapshotRepository::upsert_governance_decision_marker(...)` | 保存 governance decision marker | governance consumer / refresh transaction 内 | `()` | `RepositoryError` |
| `ReferenceSnapshotRepository::upsert_artifact_evidence_marker(...)` | 保存 artifact evidence marker | artifact consumer / refresh transaction 内;no artifact body | `()` | `RepositoryError` |
| `ReferenceSnapshotRepository::upsert_runtime_feedback_marker(...)` | 保存 runtime feedback marker | runtime feedback consumer transaction 内;no runtime log | `()` | `RepositoryError` |
| `ReferenceSnapshotRepository::upsert_runtime_feedback_summary(...)` / `get_runtime_feedback_summary(...)` | 保存 / 读取 body-free feedback summary | runtime feedback consumer / record feedback command transaction 内;no runtime body;`contains_runtime_body = false` required | `()` / `Option<RuntimeFeedbackSummary>` | `RepositoryError` |
| `ReferenceSnapshotRepository::upsert_conversation_context_marker(...)` | 保存 conversation context marker | conversation consumer transaction 内;no conversation body | `()` | `RepositoryError` |
| `ReferenceSnapshotRepository::upsert_reference_state(...)` / `get_reference_state(...)` | 保存 / 读取 reference resolution | consumer / refresh transaction 内;query read-only | `()` / `Option<ReferenceResolutionState>` | `RepositoryError` |
| `ReconciliationReportRepository::save_report(...)` | 保存 report | reconciliation job transaction 内;does not repair truth | `()` | `RepositoryError` |
| `ReconciliationReportRepository::get_report(...)` / `list_reports(...)` | 读取 report | query / ops read-only | `Option` / `Page<_>` | `RepositoryError` |

### 6.4 事务边界表

Command 行的“开始位置”统一表示 write `UnitOfWork` 的起点:request / envelope 校验通过后立即 `UnitOfWork.begin()`,随后在同一 UoW 内执行 `reserve_command(...)`。resolver、dependency load、truth load、policy input load 必须发生在 reservation 成功之后;duplicate / conflict 分支不得调用 resolver 或加载业务依赖,必须 rollback 该 reservation UoW 并读取已存 `StoredProcessOperationResult`。

| 场景 | 开始位置 | 提交位置 | 回滚条件 | 同事务内必须完成 |
|---|---|---|---|---|
| `SyncRuntimeProcessShapeFlow` | request 校验后,service 调 `UnitOfWork.begin()`;resolver 在 reserve command 成功后调用 | shape、method snapshot、trace、outbox、operation result、idempotency complete 保存后 | resolver reject、shape policy reject、repository conflict、operation result save failure | reserve command、resolve method definition、save / update shape、upsert method snapshot、append trace、append outbox `RuntimeShapeChanged`、save command operation result |
| `AdoptProcessProfileFlow` | request 校验后,service 调 `UnitOfWork.begin()`;dependency load 在 reserve command 成功后调用 | profile、change record、audit / trace、outbox、operation result 保存后 | inactive shape、work context mismatch、version conflict、result save failure | reserve command、load shape / work context、save profile、append change record、append audit / trace、append outbox `ProfileChanged`、save command operation result |
| `UpdateProcessProfileTailoringFlow` | request 校验后,service 调 `UnitOfWork.begin()`;profile with version load 在 reserve command 成功后调用 | profile and change side effects 保存后 | high-risk evidence missing、shape invalid、stale version、result save failure | reserve command、load profile with version / shape inputs、save profile using loaded version、append change / audit / trace、append outbox、save command operation result |
| `StartProcessInstanceFlow` | request 校验后,service 调 `UnitOfWork.begin()`;active profile / work context load 在 reserve command 成功后调用 | instance、initial activity/token/gateway、trace/outbox/result 保存后 | profile not active、shape invalid、missing start node、repository conflict | reserve command、load active profile / work context、create initial activity/token/gateway before `ProcessInstance::start(...)`,save instance/activity/token/gateway、append trace、append outbox `InstanceChanged`、save command operation result;no `ActivityProgressionRecord` append during bootstrap |
| `AdvanceProcessActivityFlow` | request 校验后,service 调 `UnitOfWork.begin()`;instance/activity/token/gateway load 在 reserve command 成功后调用 | all changed flow objects and outbox saved 后 | invalid `ActivityProgressionIntentRef`、expected position conflict、invalid transition、gateway route reject、repository conflict | reserve command、load instance/activity/token/gateway、apply Step 6 §7.2.2 activity / flow-control intent mapping、save activity/token/gateway/instance when changed;`Gateway.select_route` writes `selected_route_ref` before `save_gateway`、append progression with token/gateway/selected route refs、append trace、append outbox `ActivityProgressed`、save command operation result |
| `RecordActivityFeedbackFlow` | request 校验后,service 调 `UnitOfWork.begin()`;activity load / feedback resolve 在 reserve command 成功后调用 | activity、feedback marker/summary、progression、trace/result 保存后 | feedback mismatch、summary ref mismatch、runtime body rejected、resolver unavailable when required、repository conflict | reserve command、load activity、resolve `RuntimeFeedbackResolution`、upsert feedback marker/summary、save activity、append progression / trace、append outbox when publishable、save command operation result |
| `OpenWaitingGateFlow` | request 校验后,service 调 `UnitOfWork.begin()`;instance/activity load 在 reserve command 成功后调用 | pause context、gate、instance、token、outbox/result saved 后 | invalid instance/activity/gate policy、token conflict、repository conflict | reserve command、load instance/activity、save pause context、save gate、save instance/token、append waiting change、append trace/outbox、save command operation result |
| `ResumeWaitingGateFlow` | request 校验后,service 调 `UnitOfWork.begin()`;gate/context/instance/token load 在 reserve command 成功后调用;context 必须由 `get_pause_context(gate.pause_context_ref)` 读取 | gate、instance、token、outbox/result saved 后 | decision mismatch、already terminal、token missing、missing pause context、repository conflict | reserve command、load gate/context/instance/token、save gate、save instance/token、append waiting change、append trace/outbox、save command operation result |
| `CreateProcessCheckpointFlow` | request 校验后,service 调 `UnitOfWork.begin()`;instance / optional activity load 在 reserve command 成功后调用 | checkpoint/history/trace/result saved 后 | instance missing、activity mismatch、evidence invalid、repository conflict | reserve command、load instance / optional activity、save checkpoint、supersede previous when policy requires、append history / trace / audit、save command operation result |
| `StartRecoveryAttemptFlow` | request 校验后,service 调 `UnitOfWork.begin()`;checkpoint and instance load 在 reserve command 成功后调用 | attempt、instance、history/outbox/result saved 后 | checkpoint invalid、fork violation、instance terminal、repository conflict | reserve command、load checkpoint and instance、save recovery attempt、save instance recovering、append history/trace、append outbox `RecoveryAttemptChanged`、save command operation result |
| `CompleteRecoveryAttemptFlow` | request 校验后,service 调 `UnitOfWork.begin()`;attempt and instance load 在 reserve command 成功后调用 | attempt、instance when changed、history/outbox/result saved 后 | outcome mismatch、terminal attempt、missing failure reason、missing abandon reason、conflicting reason fields、repository conflict | reserve command、load attempt and instance、save attempt、save instance for applied/failed outcome,append history/trace/outbox、save command operation result |
| `BindProcessTimeboxFlow` | request 校验后,service 调 `UnitOfWork.begin()`;work snapshot resolve 在 reserve command 成功后调用 | binding、trace/outbox/result saved 后 | external timebox unavailable、invalid binding、repository conflict | reserve command、resolve work snapshot、save binding、append trace、append outbox `TimingChanged`、save command operation result |
| `UpdateProcessStageStateFlow` | request 校验后,service 调 `UnitOfWork.begin()`;stage load 在 reserve command 成功后调用 | stage、trace/outbox/result saved 后 | illegal stage target、version conflict、result save failure | reserve command、load stage、save stage、append trace、append outbox `TimingChanged`、save command operation result |
| Query flows | 不开启 write UoW | 不适用 | repository read failure、visibility denied | 无写入;不得 refresh snapshot、rebuild projection 或 repair truth |
| `ConsumeMethodDefinitionChangedFlow` | envelope valid 后 `UnitOfWork.begin()` | snapshot/reference/stale marker/receipt/idempotency saved 后 | invalid envelope before tx、dedup conflict、digest mismatch quarantine、repository failure | reserve event、upsert method snapshot/reference state、mark affected shape/profile/projection stale when allowed、append trace marker、save consumer receipt |
| `ConsumeWorkContextChangedFlow` | envelope valid 后 | work snapshot/reference/binding stale marker/receipt saved 后 | source unavailable delayed、invalid schema quarantine、repository failure | reserve event、upsert work snapshot/reference state、mark matching timebox binding stale、save consumer receipt |
| `ConsumeIdentityActorCapabilityChangedFlow` | envelope valid 后 | capability snapshot/reference/projection marker/receipt saved 后 | missing actor quarantine、source unavailable delayed、repository failure | reserve event、upsert actor capability snapshot、mark dependent projections stale、save consumer receipt |
| `ConsumeGovernanceDecisionChangedFlow` | envelope valid 后 | decision marker/gate marker/receipt saved 后 | decision mismatch noop、body rejected quarantine、repository failure | reserve event、upsert decision marker/reference state、attach decision marker when allowed,save consumer receipt |
| `ConsumeArtifactEvidenceChangedFlow` | envelope valid 后 | evidence marker/reference/checkpoint stale marker/receipt saved 后 | digest mismatch quarantine、source unavailable delayed、repository failure | reserve event、upsert evidence marker/reference state、mark checkpoint/recovery projections stale、save consumer receipt |
| `ConsumeRuntimeActivityFeedbackFlow` | envelope valid 后 | feedback marker/summary/activity stale marker/receipt saved 后 | feedback mismatch quarantine、runtime body rejected quarantine、source unavailable delayed、repository failure | reserve event、upsert runtime feedback marker/summary、mark activity pending/stale marker、save consumer receipt |
| `ConsumeConversationContextChangedFlow` | envelope valid 后 | context marker/timeline stale marker/receipt saved 后 | source unavailable delayed、no affected subject noop、repository failure | reserve event、upsert conversation context marker、mark timeline / trace view stale、save consumer receipt |
| `PublishProcessOutboxFlow` job reservation | job service begins run transaction | job reservation / duplicate handling committed before item loop when adapter chooses separate run tx | idempotency conflict、invalid input | reserve job and duplicate detection;stored job receipt for no-op duplicate path when already completed |
| `PublishProcessOutboxFlow` per record | after publisher returns for one outbox record | outbox state saved 后 | record missing、invalid state transition、repository conflict | load `Versioned<ProcessOutboxRecord>`,mark published/retry/failed,save_state with loaded version |
| `RebuildProcessProjectionsFlow` | projection job begins batch transaction | projections、view state、job receipt/result saved 后 | stale source error、projection build error、repository conflict | reserve job、upsert read model/timeline/summary,mark view state fresh/failed,save job receipt |
| `RefreshExternalContextSnapshotsFlow` | refresh job begins item/batch transaction | snapshot/reference state/job receipt saved 后 | resolver unavailable may write unavailable state;repository conflict rolls back item | reserve job、upsert snapshot on success,mark reference unavailable/unresolved on failure,save job receipt |
| `RunProcessReconciliationFlow` | reconciliation job begins transaction | report and job receipt saved 后 | report builder failure、repository conflict | reserve job、save report only,save job receipt;no truth repair |
| `PrepareProcessTraceHandoffFlow` | per trace / handoff item transaction after handoff port outcome | handoff marker and job receipt / counters saved 后 | invalid target、handoff state conflict、repository conflict | prepare / save `TraceHandoffRecord`,mark delivered/failed,save job receipt or report marker |
| `PrepareProcessArchiveHandoffFlow` | per handoff item transaction after archive port outcome | handoff/archive marker and receipt saved 后 | invalid target、archive adapter failure、repository conflict | save handoff marker,store archive package ref marker only,save job receipt |
| `MaintainRecoveryAttemptsFlow` | per recovery attempt transaction | attempt/history/outbox/job receipt saved 后 | checkpoint missing、invalid state,repository conflict | load attempt with version,save attempt,append history,append outbox when changed,save job receipt/report |

### 6.5 一致性策略表

| 一致性对象 | 策略 | 失败时处理 |
|---|---|---|
| mutable truth | repository read returns `Versioned<T>`;save requires loaded `StorageVersion` | stale version -> `RepositoryError::Conflict`;application rollback |
| append-only records | history / trace / progression / waiting / recovery records append in same tx as state change | append failure rolls back source state change |
| command idempotency | reserve, business write, operation result save, complete happen in one UoW | complete / result save failure rolls back whole command |
| consumer idempotency | reserve_event, marker / snapshot write, `ConsumerReceipt` save, complete happen in one UoW | duplicate loads stored receipt;missing result is error |
| job idempotency | reserve_job and final `JobRunReceipt` save define duplicate replay surface | duplicate loads stored receipt;must not recompute counters |
| truth + outbox | command / consumer truth change that requires publication must append outbox in same UoW | outbox append failure rolls back truth change |
| outbox publish | external publish is outside DB tx;state update uses short tx and loaded outbox version | publish failure marks retry / failed;truth is not rolled back |
| trace handoff | handoff port returns receipt / failure marker;only refs are stored | failure marks `TraceHandoffState::Failed` with retryable / permanent marker;no observability / archive body stored |
| projection freshness | projection source cursor must come from committed truth / trace and move forward | build failure marks `DerivedProcessViewState::Failed`;query degrades |
| outbox payload snapshot | outbox row must persist the exact envelope payload, trace context, and visibility marker captured at accepted transition time | publish job copies snapshot fields;it must not reload current truth to recompute event payload |
| reference snapshots | resolver returns safe snapshot / marker only | source unavailable writes unavailable / delayed marker;no external truth copied |
| query consistency | query is read-only and exposes stale / failed markers | query must not repair projection or refresh snapshot |
| reconciliation | report detects drift and stores issue refs only | report failure marks failed / partial;no silent repair |
| external body exclusion | resolver / consumer / handoff must reject body payload crossing boundary | return resolver / domain error;quarantine if inbound event |
| recovery continuity | recovery attempt and instance state changes share one command transaction | fork violation rollback;maintenance job handles attempt per item |
| in-memory adapter | must simulate uniqueness, version conflict, rollback and duplicate result store | tests must assert conflict / rollback / duplicate paths |

### 6.6 恢复与补偿表

| 场景 | 恢复方式 | 不允许的做法 |
|---|---|---|
| command repository failure before commit | rollback UoW;caller retries or receives mapped error | leave truth without outbox / operation result |
| operation result store missing on duplicate | return idempotency result missing error | recompute command result,consumer receipt,or job counters |
| outbox publish retryable failure | mark outbox `RetryPending` with retry reason | rollback committed process truth |
| outbox publish permanent failure | mark outbox `Failed` and expose job partial failure | drop outbox silently |
| projection rebuild failure | mark `DerivedProcessViewState::Failed` and return job partial / failed receipt | mutate source truth to match projection |
| resolver source unavailable | mark reference unavailable or return delayed receipt | fabricate external snapshot fields |
| inbound event invalid payload | quarantine receipt;do not call domain command transition | partially write snapshot then quarantine |
| handoff retryable failure | store failed / retryable marker and count failed item | delete handoff intent |
| handoff delivered state save conflict | job may retry and check existing marker state | deliver body into local store |
| recovery maintenance partial failure | commit successful per-attempt changes,report partial failure | rollback prior successful attempts |
| reconciliation drift found | store `ReconciliationReport` with issue refs | auto-fix truth / projection in reconciliation job |

---

## 7. 回填草稿

> 校准来源:
> - `design-calibration/03_ddd_step_11_persistence_transaction_consistency.md`

正式 `03-详细设计.md` §10 应包含:

```text
## 10. 数据持久化、事务与一致性契约

### 10.1 数据所有权实现表
引用本 Step §6.1。

### 10.2 表 / collection / projection 契约表
引用本 Step §6.2。

### 10.3 Repository 函数表
引用本 Step §6.3。

### 10.4 事务边界表
引用本 Step §6.4。

### 10.5 一致性策略与恢复补偿
引用本 Step §6.5 和 §6.6。
```

正式回填时必须保留:

| 正式章节 | 必须保留内容 |
|---|---|
| §10.1 | owning truth、snapshot / marker、projection / report、technical store 的区分 |
| §10.2 | logical store 主键 / 唯一键、关键索引和版本字段 |
| §10.3 | `Versioned<T>`、`StorageVersion`、`UnitOfWorkHandle`、`OperationResultRepository` 的读取 / 写入规则 |
| §10.4 | command、consumer、job、publish、handoff、query 的事务边界 |
| §10.5 | truth + outbox 同事务、publish / handoff 外部调用短事务、projection / snapshot 异步补偿 |

---

## 8. 待确认事项

本 Step 无阻塞性待确认事项。

| 事项 | 当前口径 | 后续承接 |
|---|---|---|
| 物理数据库与 DDL | 不指定;只要求 logical store / repository 行为等价 | 实施计划 / infra adapter |
| explicit row lock | P0 以 optimistic version 表达;durable adapter 可使用 row lock 优化 | Step 13 并发重入 |
| retry backoff / retention 参数 | 本 Step 只定义状态和补偿边界 | Step 13 / Step 14 |
| commit unknown / rollback failure | 本 Step 标出 UoW 错误;完整恢复映射后移 | Step 12 |

---

## 9. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| 数据所有权明确 | 通过 | truth、snapshot / marker、projection / report、technical store 已区分 |
| 存储对象契约明确 | 通过 | logical stores、主键 / 唯一键、索引和版本字段已列出 |
| Repository 函数事务要求明确 | 通过 | 使用已回填后的 Step 7 函数全集 |
| 事务边界明确 | 通过 | command、query、consumer、job、publish、handoff、maintenance 均覆盖 |
| 一致性和补偿规则明确 | 通过 | outbox、operation result store、projection、resolver、handoff、reconciliation 均闭合 |
| 可进入 Step 12 错误模型 | 通过 | 下一步可把 repository / idempotency / resolver / publisher / handoff / UoW 错误映射成恢复口径 |
