# L2-tools Step 7 模块附录: application foundation ports

> 状态: completed / pass
> 主文件: `03_ddd_step_07_trait_port_adapter_contracts.md`
> 输入: Step 6 stable carriers；Step 7 shared helper contracts
> 作用: 固定 UoW、clock、ID、read visibility 与 idempotency exact contracts；application 定义，infra durable/fake 实现。

## 1. Foundation capability / seam list

| Capability | Seam | Caller | Implementer | Later consumer |
|---|---|---|---|---|
| Create one local atomic boundary | `ToolsUnitOfWorkManager` | Every write use case | infra/fake | Step 9/11 transaction flows |
| Enlist all local writes in same transaction | `ToolsUnitOfWork` | repository write methods | infra UoW | Step 11 atomic families |
| Resolve commit-unknown | `ToolsUnitOfWorkManager::resolve_commit` | write use case recovery | same persistence authority | Step 12/13 recovery |
| Supply authoritative boundary time | `ClockPort` | application before domain call | infra/fake | Object factories, audit, attempts |
| Supply typed IDs | `IdGeneratorPort` | application before domain call | infra/fake | All Step 6 generated IDs |
| Resolve no-write read visibility | `ReadVisibilityResolverPort` | every Query use case | infra/fake over formal local scope inputs | Step 8 query views / Step 9 no-write flows |
| Reserve/replay scoped operation | `IdempotencyStore` | Command/Consumer/Job services | infra/fake | Step 8 result/receipt/report, Step 13 |

## 2. `ToolsUnitOfWork` / `ToolsUnitOfWorkManager`

```rust
/// Object-safe marker for one local transaction owned by the application use case.
pub trait ToolsUnitOfWork: Send + Sync {
    /// Stable local reference used only for commit resolution and correlation.
    fn transaction_ref(&self) -> &TransactionRef;

    /// Persistence-authority stamp reserved for values staged by this transaction.
    fn commit_candidate(&self) -> &CommitCandidate;
}

/// Starts and resolves local units of work without owning business sequencing.
pub trait ToolsUnitOfWorkManager: Send + Sync {
    fn begin(&self) -> PortFuture<'_, Result<Box<dyn ToolsUnitOfWork>, UnitOfWorkError>>;

    fn commit<'a>(
        &'a self,
        uow: Box<dyn ToolsUnitOfWork>,
    ) -> PortFuture<'a, Result<CommitReceipt, UnitOfWorkError>>;

    fn rollback<'a>(
        &'a self,
        uow: Box<dyn ToolsUnitOfWork>,
    ) -> PortFuture<'a, Result<(), UnitOfWorkError>>;

    fn resolve_commit<'a>(
        &'a self,
        transaction_ref: &'a TransactionRef,
    ) -> PortFuture<'a, Result<CommitResolution, UnitOfWorkError>>;
}
```

| Type / variant | English rustdoc | Contract |
|---|---|---|
| `CommitResolution::Committed(CommitReceipt)` | `/// The single local persistence authority confirms that the transaction committed.` | Stable receipt; application may return stored result |
| `CommitResolution::RolledBack` | `/// The persistence authority confirms that no writes from the transaction are visible.` | Same input may re-enter idempotency reserve |
| `CommitResolution::Unknown` | `/// The persistence authority cannot prove commit or rollback.` | Fail closed/manual recovery; never retry writes blindly |

`CommitCandidate` contains `transaction_ref`, a persistence-authority `commit_time`, and a reserved `commit_watermark`. It is allocated by `begin`, is immutable for the UoW, and may be used only to stage rows that remain invisible unless that exact transaction commits. Subject versions still come from repository `Loaded<T>` results. `CommitReceipt` contains the same candidate fields and the final committed-version map for touched versioned subjects; application must reject a candidate/receipt mismatch as an integrity failure. It is a local persistence receipt, not an external delivery/evidence/acceptance receipt. `UnitOfWorkError` variants are `Unavailable`, `BeginFailed`, `CommitFailedKnownRolledBack`, `CommitOutcomeUnknown(TransactionRef)`, `RollbackFailed`; raw backend text is not exposed.

All repository write methods receive `&dyn ToolsUnitOfWork`. Only the application service calls begin/commit/rollback. Infra repository adapters cannot nest a transaction, autocommit, retry a compare-and-swap or publish external material. A stored result or idempotency record carrying the candidate stamp is not described as committed until `commit` or `resolve_commit` confirms the matching receipt; rollback makes the staged values non-visible.

## 3. `ClockPort`

```rust
/// Supplies authoritative application-boundary time values.
pub trait ClockPort: Send + Sync {
    fn now(&self) -> Result<ApplicationTime, TechnicalPortError>;
}
```

`ApplicationTime` has checked conversion methods `as_decision_time`, `as_consumption_time`, `as_attempt_time`, `as_audit_time`, `as_projection_time`, `as_commit_candidate_time`. A single use-case clock frame is captured once for logically simultaneous domain facts; the durable commit time still comes from `CommitReceipt`. Domain and repository adapters do not call the wall clock. Fake time is explicit and monotonic by fixture control, not evidence that real time behavior passed.

## 4. `IdGeneratorPort`

```rust
/// Generates collision-resistant typed identifiers without deriving identity from display data.
pub trait IdGeneratorPort: Send + Sync {
    fn new_tool_id(&self) -> Result<ToolId, TechnicalPortError>;
    fn new_definition_id(&self) -> Result<FormalToolDefinitionId, TechnicalPortError>;
    fn new_evolution_fact_id(&self) -> Result<EvolutionFactId, TechnicalPortError>;
    fn new_binding_id(&self) -> Result<CapabilityBindingId, TechnicalPortError>;
    fn new_binding_assessment_id(&self) -> Result<BindingAssessmentId, TechnicalPortError>;
    fn new_hub_snapshot_id(&self) -> Result<HubSnapshotId, TechnicalPortError>;
    fn new_binding_change_fact_id(&self) -> Result<BindingChangeFactId, TechnicalPortError>;
    fn new_invocation_id(&self) -> Result<ToolInvocationId, TechnicalPortError>;
    fn new_admission_id(&self) -> Result<InvocationAdmissionId, TechnicalPortError>;
    fn new_requirement_id(&self) -> Result<ExecutionRequirementId, TechnicalPortError>;
    fn new_authorization_assessment_id(&self) -> Result<AuthorizationAssessmentId, TechnicalPortError>;
    fn new_handoff_id(&self) -> Result<ExecutionHandoffId, TechnicalPortError>;
    fn new_handoff_attempt_id(&self) -> Result<ExecutionHandoffAttemptId, TechnicalPortError>;
    fn new_sandbox_readiness_snapshot_id(&self) -> Result<SandboxReadinessSnapshotId, TechnicalPortError>;
    fn new_source_assessment_id(&self) -> Result<ExecutionSourceAssessmentId, TechnicalPortError>;
    fn new_outcome_id(&self) -> Result<ToolInvocationOutcomeId, TechnicalPortError>;
    fn new_audit_entry_id(&self) -> Result<ToolAuditEntryId, TechnicalPortError>;
    fn new_eligibility_id(&self) -> Result<SafeHandoffEligibilityId, TechnicalPortError>;
    fn new_material_id(&self) -> Result<SafeHandoffMaterialId, TechnicalPortError>;
    fn new_submission_attempt_id(&self) -> Result<ExternalSubmissionAttemptId, TechnicalPortError>;
    fn new_definition_source_ref_id(&self) -> Result<DefinitionSourceRefId, TechnicalPortError>;
    fn new_sandbox_execution_source_ref_id(&self) -> Result<SandboxExecutionSourceRefId, TechnicalPortError>;
    fn new_bus_delivery_status_ref_id(&self) -> Result<BusDeliveryStatusRefId, TechnicalPortError>;
    fn new_observation_material_ref_id(&self) -> Result<ObservationMaterialRefId, TechnicalPortError>;
    fn new_shared_contract_authority_ref_id(&self) -> Result<SharedContractAuthorityRefId, TechnicalPortError>;
    fn new_reference_assessment_id(&self) -> Result<ReferenceAssessmentId, TechnicalPortError>;
    fn new_gap_id(&self) -> Result<ConsistencyGapId, TechnicalPortError>;
    fn new_report_id(&self) -> Result<ReferenceConsistencyReportId, TechnicalPortError>;
}
```

Deterministic projection/diff/diagnostic/guidance/event-candidate IDs use the Step 6/8 canonical derivation functions and are not generated here. External IDs/refs always come from their named Port and are never generated by L2. The generator cannot derive IDs from tool name, capability ID, prompt, locator or timestamp alone.

## 5. `ReadVisibilityResolverPort`

```rust
/// Resolves whether one actor/consumer may receive one L2-owned safe read surface.
pub trait ReadVisibilityResolverPort: Send + Sync {
    fn resolve<'a>(
        &'a self,
        input: &'a VisibilityResolutionInput,
    ) -> PortFuture<'a, Result<VisibilityDecision, ApplicationError>>;
}
```

`VisibilityResolutionInput` exact fields: `subject_ref`, `actor_ref`, `consumer_context`, `owner_scope_ref`, `actor_authority_ref`, `requested_view_class`, `read_at`. The Query service obtains `owner_scope_ref` from the relevant local store before calling the resolver; the resolver cannot query Hub registry, Runtime execution state, authorization provider, marketplace listing or external body. It may use only configured actor-authority adapter plus formal L2 owner/scope refs.

Result mapping:

| Input condition | `ConsumptionVisibility` | Public behavior |
|---|---|---|
| Attributable actor/consumer and formal scope permits safe view | `Visible` | Construct named response view |
| Subject absent before sensitive scope detail is exposed | `NotFound` | Not-found/anti-enumeration mapping |
| Formal scope denies this view | `Forbidden` | May share anti-enumeration protocol code, typed internally |
| Required authority/scope source unavailable | `Unavailable` | Fail closed; no fallback visible |
| Local view is visible but declared source watermark is stale | `Stale` | Return only where Query contract permits explicit stale surface |

The resolver does not implement effective tool execution authorization. Query calls have no UoW, do not persist the decision and do not refresh any projection.

## 6. `IdempotencyStore`

```rust
/// Atomic technical sidecar for Command, Consumer and Job replay semantics.
pub trait IdempotencyStore: Send + Sync {
    fn get<'a>(
        &'a self,
        scope: &'a IdempotencyScope,
        key: &'a IdempotencyKey,
    ) -> PortFuture<'a, Result<Option<Loaded<IdempotencyRecord>>, RepositoryError>>;

    fn reserve<'a>(
        &'a self,
        record: IdempotencyRecord,
        uow: &'a dyn ToolsUnitOfWork,
    ) -> PortFuture<'a, Result<IdempotencyReserveResult, RepositoryError>>;

    fn save_record<'a>(
        &'a self,
        record: IdempotencyRecord,
        expected_version: ExpectedVersion,
        uow: &'a dyn ToolsUnitOfWork,
    ) -> PortFuture<'a, Result<ExpectedVersion, RepositoryError>>;

    fn store_command_result<'a>(
        &'a self,
        result: StoredCommandResult,
        uow: &'a dyn ToolsUnitOfWork,
    ) -> PortFuture<'a, Result<StoredCommandResultRef, RepositoryError>>;

    fn store_consumer_receipt<'a>(
        &'a self,
        receipt: ConsumerReceipt,
        uow: &'a dyn ToolsUnitOfWork,
    ) -> PortFuture<'a, Result<ConsumerReceiptRef, RepositoryError>>;

    fn store_job_report<'a>(
        &'a self,
        report: JobReport,
        uow: &'a dyn ToolsUnitOfWork,
    ) -> PortFuture<'a, Result<JobReportRef, RepositoryError>>;

    fn get_command_result<'a>(
        &'a self,
        result_ref: &'a StoredCommandResultRef,
    ) -> PortFuture<'a, Result<Option<StoredCommandResult>, RepositoryError>>;

    fn get_consumer_receipt<'a>(
        &'a self,
        receipt_ref: &'a ConsumerReceiptRef,
    ) -> PortFuture<'a, Result<Option<ConsumerReceipt>, RepositoryError>>;

    fn get_job_report<'a>(
        &'a self,
        report_ref: &'a JobReportRef,
    ) -> PortFuture<'a, Result<Option<JobReport>, RepositoryError>>;
}
```

```rust
/// Result of an atomic idempotency reservation attempt.
pub enum IdempotencyReserveResult {
    /// This unit of work inserted the reservation and receives its valid compare token.
    Reserved(Loaded<IdempotencyRecord>),
    /// A persisted record already owns the scoped key.
    Existing(Loaded<IdempotencyRecord>),
}
```

`Existing` is not automatically a successful duplicate. Application calls `IdempotencyRecord::classify_duplicate`: equal digest + committed typed result => replay; equal digest + claimed => in-flight/awaiting; different digest/channel/operation/actor/source => conflict; aborted => explicit recovery policy in Step 13. A fresh reservation must use the `ExpectedVersion` returned in `Reserved` when saving committed state; it cannot assume version zero/one or perform a second load to invent the token.

The result/receipt/report and completed idempotency record are written in the same UoW as their referenced local facts. `StoredCommandResult` includes the exact closed `StoredCommandValue` snapshot plus attributable refs; typed replay never reconstructs a historical Command value from later mutable truth. Typed replay failure never falls back to re-running a Command/Consumer/Job or scanning truth.

## 7. Stop review

| Review item | Result | Gap / correction |
|---|---|---|
| UoW ownership and transaction token are explicit | pass | repository adapters never self-commit |
| Commit-unknown has same-authority resolution | pass | no blind retry |
| Clock/ID cover every generated Step 6 field without entering domain | pass | deterministic derived IDs excluded from generator |
| Visibility input/read source and fail-closed behavior are complete | pass | no external policy/registry truth |
| Idempotency reserve returns the valid initial version | pass | avoids guessed create version |
| Stored result/receipt/report have paired reads | pass | duplicate replay need not rerun |
| Every async trait remains object-safe and runtime-neutral | pass | `PortFuture` + `Send + Sync` |
