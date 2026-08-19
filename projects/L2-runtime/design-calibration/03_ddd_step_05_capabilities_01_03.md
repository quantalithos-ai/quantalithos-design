# L2-runtime Step 5 capability cards: CAP-01~03

> 状态: done
> 当前 Step: 5
> 批次: contracts、admission/control、goal/plan
> 输入: Step 3/4、正式 02、Step 5 粒度重开审计

## 1. CAP-01 Shared Runtime Vocabulary

### 1.1 Capability contract

| 项目 | 契约 |
|---|---|
| 目标 | 为所有 Runtime protocol、domain object、application operation 提供稳定 identity、scope、correlation、source、digest、reason、visibility 与 availability 语义 |
| 输入 | `ActorRef`、`ScopeId`、`OwnerRef`、`TypedRef`、`SchemaVersion`、`Timestamp`、body-free canonical payload |
| 输出 | `RuntimeScope`、`RuntimeCorrelation`、`CommandMetadata`、`QueryMetadata`、`SourceReference`、`RequestDigest`、`SafeReason`、`ProtocolError` |
| local truth | 无 aggregate truth；只定义不可变 value object 和 protocol carrier |
| side effect | 无；ID/time/digest 分别通过 technical Port 获取 |
| forbidden | 从 display text 拼 ID；将正文、secret、hidden reasoning 纳入 digest/event/error；用空 ref 表示 not-visible |

### 1.2 File and object allocation

| crate/file | objects/types | responsibility |
|---|---|---|
| `runtime-contracts/src/ids_refs.rs` | `RuntimeScope`、`RuntimeCorrelation`、所有 Runtime typed IDs/refs | opaque identity、scope containment、correlation matching |
| `runtime-contracts/src/metadata.rs` | `CommandMetadata`、`QueryMetadata`、`EventMetadata`、`JobMetadata` | public operation metadata 与 validation |
| `runtime-contracts/src/reasons.rs` | `SafeReason`、`SafeReasonCode`、`RedactionMarker` | body-free reason 与 redaction |
| `runtime-contracts/src/errors.rs` | `ProtocolError`、`StableErrorCode`、`RetryPosture` | public safe error surface |
| `runtime-application/src/operation_context.rs` | `OperationContext`、`ConfigSnapshotRef` | application-only operation carrier |
| `runtime-application/src/ports/technical.rs` | `ClockPort`、`IdGeneratorPort`、`DigestPort` | deterministic technical authority |

### 1.3 Object capability allocation

| object | required capability | called by | failure |
|---|---|---|---|
| `RuntimeScope` | `contains(ScopeId)`、`derive_child(ScopeId, ScopeBoundary)` | admission、delegation、visibility | `ScopeViolation` |
| `RuntimeCorrelation` | `for_run(RunId)`、`for_turn(RunId, ModelTurnId)`、`matches(EventCorrelation)` | every Flow/event | `CorrelationMismatch` |
| `CommandMetadata` | `validate()`、`canonical_digest_input()` | every Command handler | `InvalidMetadata`、`DigestMismatch` |
| `QueryMetadata` | `validate_visibility_input()` | every Query handler | `InvalidReadScope` |
| `SourceReference` | `validate_authority()`、`validate_scope(RuntimeScope)`、`is_fresh(FreshnessRequirement)` | source/governance/model/memory/action Flows | `SourceAuthorityMismatch`、`StaleSource` |
| `SafeReason` | `new(SafeReasonCode, RedactionMarker, Option<SourceReference>)`、`validate_body_free()` | errors、state transition、events | `UnsafeReason` |
| `OperationContext` | `from_command(CommandMetadata, ConfigSnapshotRef)`、`begin(UnitOfWork)` | application services | `OperationContextError` |

### 1.4 Port and protocol allocation

| Port | functions | authority/read-write |
|---|---|---|
| `ClockPort` | `now() -> Timestamp` | technical time source；无 truth 写权 |
| `IdGeneratorPort` | `next_id(IdKind) -> Result<TypedId, TechnicalError>` | identity authority；失败时不生成 fallback ID |
| `DigestPort` | `digest(BodyFreeCanonicalValue) -> Result<RequestDigest, DigestError>` | canonical digest；拒绝 forbidden body |

所有 17 Command 使用 `CommandMetadata`；12 Query 使用 `QueryMetadata`；12 event 使用 `EventEnvelope<T>`；7 Job 使用 `JobMetadata`。CAP-01 不拥有独立 Command/Query/Event/Job handler，其 validation 是所有 entry Flow 的第一阶段。旧 15 Command 计数已在 Step 8 记为 `historical_material`。

### 1.5 State, transaction, error and test

| concern | contract |
|---|---|
| state | value object 不设生命周期；`IdempotencyReservation` 和 `AdapterAvailability` 分别由 CAP-02/CAP-12 状态机承接 |
| transaction | metadata/digest validation 在 UoW 前；`OperationContext` 在 `UnitOfWorkPort.begin` 后绑定 UoW identity |
| consistency | request digest version 与 stored idempotency digest version一致；correlation/causation 不可在中途替换 |
| errors | invalid metadata 不写 domain truth；technical ID/digest failure 映射 `DependencyUnavailable`，不得伪造值 |
| unit tests | scope containment、child subset、correlation match、canonical digest determinism、unsafe reason rejection |
| protocol tests | missing actor/scope/version/correlation、digest mismatch、not-visible redaction、forbidden body serialization rejection |
| implementation handoff | contracts 先实现；technical fake 必须可注入 fixed time/ID/digest failure，不能证明 production readiness |

### 1.6 Stop review

CAP-01 已闭合到 contracts/application foundation/technical ports/protocol validation/tests。没有创建 global runtime truth，也没有把 Core candidate 之外的 sibling 仓写成 compile dependency。

## 2. CAP-02 Admission & Control

### 2.1 Capability contract

| 项目 | 契约 |
|---|---|
| 目标 | 校验 actor/scope/source/formal precondition 后创建唯一 controlled run；对已存在 run 应用 pause/cancel/resume/stop local control intent |
| typed input | `AcceptRuntimeTrigger`、`ApplyRuntimeControl`、`RuntimeTriggerContext`、`PreconditionSummary`、`ExpectedVersion` |
| typed output | `AdmissionResult`、`ControlResult`、`RuntimeAdmissionDecision`、`ControlledRun`、`RuntimeHistoryEntry` |
| local truth | admission decision、run aggregate、control/progress decision、immutable history、idempotency result |
| external read | source availability、Governance formal result、latest stable checkpoint、unresolved effect markers |
| forbidden | 未验证 scope 创建 run；cancel 推导外部 effect 已取消；resume 绕过 stable checkpoint/fence；创建 member/product lifecycle |

### 2.2 File allocation

| layer | files | responsibility |
|---|---|---|
| contracts | `commands.rs`、`views.rs`、`events.rs` | `AcceptRuntimeTrigger`、`ApplyRuntimeControl`、results/views/outbound snapshots |
| domain | `run.rs`、`history.rs`、`policies.rs` | admission decision、controlled run、control guard、history fact factory |
| application | `admission_service.rs`、`control_service.rs`、`ports/repositories.rs`、`idempotency.rs` | two independent command Flows、UoW、stored result |
| infra | `repositories.rs`、`idempotency_store.rs`、`outbox_store.rs` | run/history/idempotency/outbox Port implementations |
| api | `command_handlers.rs` | request mapping、service call、safe result/error mapping |
| tests | `domain/run.rs`、`application/admission.rs`、`application/control.rs` | state/Flow/idempotency/version/fail-closed cuts |

### 2.3 Object allocation

| object | key fields | functions owned by capability |
|---|---|---|
| `RuntimeTriggerContext` | actor_ref、scope、goal_refs、source_ref、precondition_refs、metadata | `create`、`validate_scope`、`canonical_payload` |
| `RuntimeAdmissionDecision` | decision_id、trigger_digest、disposition、reason、source_refs、decided_at | `decide`、`permits_run_creation`、`to_history_fact` |
| `ControlledRun` | run_id、scope、status、workspace_id、current_decision_id、checkpoint_id、version | `create`、`apply_control`、`apply_progress`、`attach_checkpoint` |
| `RuntimeControlIntent` | run_id、control_kind、reason、checkpoint_ref、expected_version | `validate_against`、`requires_stable_checkpoint` |
| `RuntimeHistoryEntry` | entry_id、run_id、sequence、fact_kind/ref、causation/correlation、committed_at | `from_admission`、`from_control`、`relates_to` |
| `AdmissionApplicationService` | clock/id/digest/source/governance/run/history/idempotency/UoW/outbox ports | `accept(AcceptRuntimeTrigger) -> Future<Result<AdmissionResult, ApplicationError>>` |
| `ControlApplicationService` | run/checkpoint/effect/history/idempotency/UoW/outbox ports | `apply(ApplyRuntimeControl) -> Future<Result<ControlResult, ApplicationError>>` |

### 2.4 Port allocation

| Port | required functions | Flow usage |
|---|---|---|
| `RunRepositoryPort` | `get`、`get_for_update`、`save`、`list_resume_eligible` | create with no prior version；control expected-version update |
| `HistoryRepositoryPort` | `append`、`list_by_run`、`list_by_correlation`、`find_fact` | admission/control fact append and readback |
| `IdempotencyPort` | `reserve`、`get_stored_result`、`store_result` | same key/digest replay；different digest conflict |
| `UnitOfWorkPort` | `begin`、`commit`、`rollback` | aggregate/history/result/outbox atomic boundary |
| `SourceResolverPort` | `availability` | trigger source authority/freshness |
| `GovernancePreconditionPort` | `read` | formal admission authority only |
| `CheckpointRepositoryPort` | `get_latest_stable` | resume guard |
| `SideEffectRepositoryPort` | `list_unresolved` | cancel/resume unknown fence |
| `EventPublisherPort` | `publish` | post-commit local fact event |

### 2.5 Protocol and Flow allocation

| protocol | handler | Flow | state transition |
|---|---|---|---|
| `AcceptRuntimeTrigger` | `AcceptRuntimeTriggerHandler::handle` | `AcceptRuntimeTriggerFlow` | admission candidate -> accepted/waiting/blocked/rejected；accepted -> run active |
| `ApplyRuntimeControl` | `ApplyRuntimeControlHandler::handle` | `ApplyRuntimeControlFlow` | active/waiting/blocked -> paused/cancelled/active/unknown according to verified guard |
| `GetRunStatus` | `RuntimeQueryHandler::get_run_status` | `GetRunStatusFlow` | read-only |
| `RuntimeFactCommitted` | outbox publisher | `MaterializeRuntimeFactCommittedFlow` | no domain state change |

### 2.6 Transaction and consistency

| phase | admission | control |
|---|---|---|
| before UoW | metadata/digest/scope validation、idempotency lookup | metadata/digest/visibility validation、idempotency lookup |
| UoW reads | source/governance snapshot; existing reservation | run for update、checkpoint/effects |
| UoW writes | admission decision、run、workspace seed、history、stored result、outbox | run/control decision、history、stored result、outbox |
| commit unknown | return admission unknown fence；same key cannot create another run | run control unknown；caller must reconcile original operation |
| post commit | publish same event identity | publish same event identity |

### 2.7 Errors and tests

| branch | public posture | mandatory test |
|---|---|---|
| invalid actor/scope/source | rejected/not-visible | no UoW save；no existence leak |
| governance pending/stale/conflict | waiting/blocked | no active run；formal source refs retained |
| duplicate key/same digest | replay | exact stored result；no new ID/history |
| duplicate key/different digest | conflict | no domain call |
| run version conflict | concurrency conflict | old run unchanged |
| resume without stable checkpoint | blocked/manual review | no transition to active |
| unresolved effect | unknown/manual review | no automatic resume/cancel-success claim |
| commit unknown | unknown | no second run/control replay |

### 2.8 Stop review

CAP-02 has distinct admission/control objects, services, ports, protocols, Flows, state transitions, transaction boundaries and test assertions. Governance approval and external effect truth remain external.

## 3. CAP-03 Goal & Plan Working State

### 3.1 Capability contract

| 项目 | 契约 |
|---|---|
| 目标 | 从 goal refs、method/process definition refs、constraints 和 committed Runtime facts 推导 working plan candidates、progress decision 和下一步 posture |
| typed input | `EvaluateRunProgress`、`ControlledRun`、`GoalPlanWorkspace`、`DecisionInputs`、`Page<WorkingPlanItem>` |
| typed output | `ProgressResult`、`RunProgressDecision`、updated workspace/run、history/outbox facts |
| local truth | run-scoped working workspace、plan item refs/progress、progress decision |
| external read | Method/Hub/Artifact/Governance typed source refs/safe views；不读取 body |
| forbidden | 保存 method/process body；从 external delivery 推导 item completed；缺 dependency/source 时形成 terminal outcome |

### 3.2 File and object allocation

| file | objects/functions |
|---|---|
| `domain/goal_plan.rs` | `WorkingPlanItem`、`GoalPlanWorkspace`、`RunProgressDecision`、`GoalPlanProgress`、`ItemProgress` |
| `domain/policies.rs` | `GoalDependencyPolicy`、`TerminalEligibilityPolicy` |
| `application/services/run_progress_service.rs` | `RunProgressApplicationService::evaluate` |
| `application/ports/repositories.rs` | `GoalPlanRepositoryPort`、`RunRepositoryPort`、`HistoryRepositoryPort` |
| `application/ports/external.rs` | `SourceResolverPort`、`CapabilityExposurePort` |
| `contracts/commands.rs` | `EvaluateRunProgress`、`DecisionInputs`、`ProgressResult` |
| `contracts/queries.rs`、`views.rs` | `GetGoalPlan`、`GoalPlanView`、`WorkingPlanItemView` |

### 3.3 Object capability allocation

| object | key fields | functions |
|---|---|---|
| `WorkingPlanItem` | item_ref、kind、dependency_refs、progress、source_ref、source_version、eligibility | `from_source`、`validate_dependencies`、`apply_progress`、`is_candidate` |
| `GoalPlanWorkspace` | workspace_id、run_id、goal_refs、items、constraints、progress、source_refs、version | `create`、`next_candidates`、`record_progress`、`reconcile_dependencies`、`terminal_eligibility` |
| `DecisionInputs` | current_fact_refs、source_snapshots、constraint_refs、effect_fences、terminal_candidate | `validate_for_run`、`source_versions` |
| `RunProgressDecision` | decision_id、run_id、workspace_id、disposition、selected_items、reason、source_refs、decided_at | `decide`、`is_terminal`、`to_history_fact` |
| `RunProgressApplicationService` | run/workspace/history/source/idempotency/UoW/outbox ports、policies | `evaluate(EvaluateRunProgress) -> Future<Result<ProgressResult, ApplicationError>>` |

### 3.4 Port, protocol and state allocation

| concern | contract |
|---|---|
| workspace read | `GoalPlanRepositoryPort::get_for_update(workspace_id, expected_version)` |
| candidate page | `GoalPlanRepositoryPort::list_candidates(run_id, cursor)` |
| workspace write | `GoalPlanRepositoryPort::save(workspace, expected_version, uow)` |
| external definition | `SourceResolverPort::resolve(source_ref, resolve_policy)` returns safe snapshot/availability |
| command | `EvaluateRunProgress` -> `ProgressResult` through `EvaluateRunProgressFlow` |
| query | `GetGoalPlan` -> `QueryViewEnvelope<GoalPlanView>` through `GetGoalPlanFlow` |
| state | workspace created -> evaluating -> ready/partial/waiting/blocked；ready -> evaluating on new verified fact |
| run effect | progress decision may move run active/waiting/blocked/terminal candidate; outcome finalization remains CAP-11 |

### 3.5 Transaction, errors and tests

| concern | contract/test assertion |
|---|---|
| UoW | load run/workspace versions；resolve frozen input refs；save decision/workspace/run/history/result/outbox atomically |
| conflict | run or workspace version conflict rejects whole mutation；no merge outside domain reconciliation function |
| missing dependency | disposition waiting/blocked；selected item list excludes unresolved item with safe reason |
| stale source | source unavailable/stale marker；no terminal eligibility |
| duplicate command | stored `ProgressResult` returned；no second decision/history entry |
| terminal proof | all required items/fences/sources verified；test missing any one input prevents terminal disposition |
| query | empty workspace、not-visible、stale/degraded view；query performs no save/refresh |
| owner boundary | test fixture containing method/process body is rejected at mapping boundary |

### 3.6 Stop review

CAP-03 closes goal/plan working truth without importing Method Library body or completion truth. Its command, query, repository reads, state transitions and transaction/test boundaries are independently traceable.

## 4. Batch audit

| audit | result |
|---|---|
| each capability has typed input/output and forbidden ownership | pass |
| crate/file/object/service/Port/protocol/Flow/state/transaction/test mapping exists | pass |
| CAP-01 value objects do not become global aggregate | pass |
| CAP-02 Governance and external effects remain consumer-only | pass |
| CAP-03 method/process body remains external | pass |
| no ellipsis or merged service contract substitutes implementation detail | pass |
