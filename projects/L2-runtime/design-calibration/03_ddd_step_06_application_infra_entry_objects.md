# L2-runtime Step 6 deep object contracts: application, infra and entry carriers

> 状态: done
> 当前 Step: 6
> 批次: 6.13 Application services; 6.14 transaction/idempotency; 6.15 infra builder/adapters; 6.16 API/worker/job entry carriers
> 说明: 本文件定义 planned Rust object shape，不表示目标实现仓、具体 async runtime、transport、database、broker 或 scheduler 已存在

## 1. Application operation carriers

### 1.1 `OperationContext`

```rust
pub struct OperationContext {
    pub request_id: RequestId,
    pub operation: OperationName,
    pub actor_ref: ActorRef,
    pub scope: RuntimeScope,
    pub correlation: RuntimeCorrelation,
    pub idempotency: IdempotencyOperation,
    pub config_snapshot_ref: ConfigSnapshotRef,
    pub expected_versions: AggregateVersionSet,
    pub uow: UnitOfWork,
    pub started_at: Timestamp,
}

pub struct IdempotencyOperation {
    pub key: IdempotencyKey,
    pub request_digest: RequestDigest,
    pub reservation: IdempotencyReservation,
}

impl OperationContext {
    pub async fn begin(metadata: CommandMetadata, config_snapshot_ref: ConfigSnapshotRef, expected_versions: AggregateVersionSet, idempotency_port: &dyn IdempotencyPort, uow_port: &dyn UnitOfWorkPort, clock: &dyn ClockPort) -> Result<OperationStart, ApplicationError>;
    pub fn expected_version(&self, aggregate_id: AggregateId) -> Result<AggregateVersion, ApplicationError>;
    pub fn require_scope(&self, candidate: &RuntimeScope) -> Result<(), ApplicationError>;
    pub async fn commit(self, stored_result: StoredOperationResult, idempotency_port: &dyn IdempotencyPort, uow_port: &dyn UnitOfWorkPort) -> Result<CommittedOperation, ApplicationError>;
    pub async fn rollback(self, uow_port: &dyn UnitOfWorkPort, cause: &ApplicationError) -> Result<(), ApplicationError>;
}

pub enum OperationStart {
    Proceed(OperationContext),
    Replay(StoredOperationResult),
    Conflict { existing_digest: RequestDigest },
    Blocked { reason: SafeReason },
}
```

Application code must branch on `OperationStart` before domain mutation. Same key/digest replays the stored result; same key/different digest conflicts. UoW identity never enters domain objects or public events.

### 1.2 `AggregateVersionSet`

```rust
pub struct AggregateVersionSet {
    pub run: Option<RunVersion>,
    pub workspace: Option<WorkspaceVersion>,
    pub memory: Option<MemoryWindowVersion>,
    pub context: Option<ContextVersion>,
    pub model_turn: Option<ModelTurnVersion>,
    pub action: Option<ActionDecisionVersion>,
    pub side_effect: Option<SideEffectVersion>,
    pub delegation: Option<DelegationVersion>,
    pub checkpoint: Option<CheckpointVersion>,
    pub outcome: Option<OutcomeVersion>,
    pub handoff_attempt: Option<HandoffAttemptVersion>,
    pub handoff_gap: Option<HandoffGapVersion>,
    pub projection: Option<ProjectionVersion>,
}

impl AggregateVersionSet {
    pub fn empty() -> Self;
    pub fn from_command(expectation: CommandVersionExpectation) -> Result<Self, ProtocolError>;
    pub fn require_for(&self, kind: AggregateKind) -> Result<AggregateVersion, ApplicationError>;
    pub fn matches(&self, current: &AggregateVersionSet) -> bool;
}
```

Versions stay separately typed at repository boundaries. `AggregateVersion` is a checked wrapper used only for carrier lookup, not a license to compare unrelated aggregate counters.

### 1.3 Stored operation result

```rust
pub struct StoredOperationResult {
    pub stored_result_ref: StoredResultRef,
    pub operation: OperationName,
    pub request_digest: RequestDigest,
    pub result_kind: StoredResultKind,
    pub result_ref: TypedRef,
    pub committed_versions: AggregateVersionSet,
    pub committed_at: Timestamp,
}

pub enum StoredResultKind {
    Admission,
    Control,
    Progress,
    Context,
    WorkingMemory,
    ModelTurn,
    ModelDecision,
    Action,
    ActionGuard,
    Delegation,
    Feedback,
    CheckpointPrepared,
    CheckpointCommitted,
    Recovery,
    Outcome,
    Handoff,
    SourceSnapshot,
}

impl StoredOperationResult {
    pub fn new(stored_result_ref: StoredResultRef, operation: OperationName, request_digest: RequestDigest, result_kind: StoredResultKind, result_ref: TypedRef, committed_versions: AggregateVersionSet, committed_at: Timestamp) -> Result<Self, ApplicationError>;
    pub fn validate_for_replay(&self, operation: OperationName, digest: RequestDigest) -> Result<(), ApplicationError>;
}
```

Stored result points to committed local result; it is not a second copy of domain state, adapter receipt or external evidence.

## 2. Common service dependency groups

```rust
pub struct TechnicalDependencies {
    pub clock: Arc<dyn ClockPort>,
    pub ids: Arc<dyn IdGeneratorPort>,
    pub digest: Arc<dyn DigestPort>,
    pub idempotency: Arc<dyn IdempotencyPort>,
    pub uow: Arc<dyn UnitOfWorkPort>,
}

pub struct RunTruthDependencies {
    pub runs: Arc<dyn RunRepositoryPort>,
    pub workspaces: Arc<dyn GoalPlanRepositoryPort>,
    pub history: Arc<dyn HistoryRepositoryPort>,
}

pub struct ContextTruthDependencies {
    pub contexts: Arc<dyn ContextRepositoryPort>,
    pub memory_use: Arc<dyn MemoryUseRepositoryPort>,
    pub source_markers: Arc<dyn SourceReferenceRepositoryPort>,
}

pub struct ActionTruthDependencies {
    pub actions: Arc<dyn ActionRepositoryPort>,
    pub preconditions: Arc<dyn ActionPreconditionRepositoryPort>,
    pub attempts: Arc<dyn ActionAttemptRepositoryPort>,
    pub side_effects: Arc<dyn SideEffectRepositoryPort>,
    pub delegations: Arc<dyn DelegationRepositoryPort>,
    pub feedback: Arc<dyn FeedbackRepositoryPort>,
}

pub struct RecoveryTruthDependencies {
    pub checkpoints: Arc<dyn CheckpointRepositoryPort>,
    pub recovery: Arc<dyn RecoveryRepositoryPort>,
    pub continuations: Arc<dyn RecoveryContinuationRepositoryPort>,
    pub outcomes: Arc<dyn OutcomeRepositoryPort>,
}

pub struct HandoffTruthDependencies {
    pub handoff: Arc<dyn HandoffRepositoryPort>,
    pub outbox: Arc<dyn OutboxRepositoryPort>,
    pub projections: Arc<dyn ProjectionStorePort>,
}
```

Each field is injected at composition root. Service constructors validate required references but do not call external availability or perform I/O. Repository traits are defined independently in Step 7.

## 3. Command application services

### 3.1 Admission and control

```rust
pub struct AdmissionApplicationService {
    technical: TechnicalDependencies,
    truth: RunTruthDependencies,
    governance: Arc<dyn GovernancePreconditionPort>,
    sources: Arc<dyn SourceResolverPort>,
    config: Arc<dyn RuntimeConfigSnapshotPort>,
}

impl AdmissionApplicationService {
    pub fn new(technical: TechnicalDependencies, truth: RunTruthDependencies, governance: Arc<dyn GovernancePreconditionPort>, sources: Arc<dyn SourceResolverPort>, config: Arc<dyn RuntimeConfigSnapshotPort>) -> Result<Self, BuildError>;
    pub async fn accept(&self, command: AcceptRuntimeTrigger) -> Result<AdmissionResult, ApplicationError>;
}

pub struct ControlApplicationService {
    technical: TechnicalDependencies,
    truth: RunTruthDependencies,
    checkpoints: Arc<dyn CheckpointRepositoryPort>,
    side_effects: Arc<dyn SideEffectRepositoryPort>,
    config: Arc<dyn RuntimeConfigSnapshotPort>,
}

impl ControlApplicationService {
    pub fn new(technical: TechnicalDependencies, truth: RunTruthDependencies, checkpoints: Arc<dyn CheckpointRepositoryPort>, side_effects: Arc<dyn SideEffectRepositoryPort>, config: Arc<dyn RuntimeConfigSnapshotPort>) -> Result<Self, BuildError>;
    pub async fn apply(&self, command: ApplyRuntimeControl) -> Result<ControlResult, ApplicationError>;
}
```

Admission commits decision, optional run/workspace, history, outbox snapshot and stored result in one local UoW. Control loads run/checkpoint/effect guard at expected versions and never cancels an already submitted external effect.

### 3.2 Progress and context/memory

```rust
pub struct RunProgressApplicationService {
    technical: TechnicalDependencies,
    truth: RunTruthDependencies,
    sources: Arc<dyn SourceResolverPort>,
    side_effects: Arc<dyn SideEffectRepositoryPort>,
    definitions: Arc<dyn DefinitionResolverPort>,
    config: Arc<dyn RuntimeConfigSnapshotPort>,
}

impl RunProgressApplicationService {
    pub fn new(technical: TechnicalDependencies, truth: RunTruthDependencies, sources: Arc<dyn SourceResolverPort>, side_effects: Arc<dyn SideEffectRepositoryPort>, definitions: Arc<dyn DefinitionResolverPort>, config: Arc<dyn RuntimeConfigSnapshotPort>) -> Result<Self, BuildError>;
    pub async fn evaluate(&self, command: EvaluateRunProgress) -> Result<ProgressResult, ApplicationError>;
}

pub struct ContextCompositionApplicationService {
    technical: TechnicalDependencies,
    truth: RunTruthDependencies,
    context_truth: ContextTruthDependencies,
    sources: Arc<dyn SourceResolverPort>,
    memory: Arc<dyn MemoryRetrievalPort>,
    policies: Arc<dyn ContextPolicyPort>,
    config: Arc<dyn RuntimeConfigSnapshotPort>,
}

impl ContextCompositionApplicationService {
    pub fn new(technical: TechnicalDependencies, truth: RunTruthDependencies, context_truth: ContextTruthDependencies, sources: Arc<dyn SourceResolverPort>, memory: Arc<dyn MemoryRetrievalPort>, policies: Arc<dyn ContextPolicyPort>, config: Arc<dyn RuntimeConfigSnapshotPort>) -> Result<Self, BuildError>;
    pub async fn compose(&self, command: ComposeWorkingContext) -> Result<ContextCompositionResult, ApplicationError>;
    pub async fn record_working_memory(&self, command: RecordWorkingMemory) -> Result<WorkingMemoryResult, ApplicationError>;
}
```

Progress creates a new immutable decision and updates run/workspace versions in one UoW. Composition resolves snapshots before UoW, then revalidates version/freshness inside decision input; all considered candidates receive `MemoryUseRecord` in the same UoW as the new context/window.

### 3.3 Model turn and classification

```rust
pub struct ModelTurnApplicationService {
    technical: TechnicalDependencies,
    truth: RunTruthDependencies,
    contexts: Arc<dyn ContextRepositoryPort>,
    turns: Arc<dyn ModelTurnRepositoryPort>,
    decisions: Arc<dyn ModelDecisionRepositoryPort>,
    model: Arc<dyn ModelDecisionPort>,
    config: Arc<dyn RuntimeConfigSnapshotPort>,
}

impl ModelTurnApplicationService {
    pub fn new(technical: TechnicalDependencies, truth: RunTruthDependencies, contexts: Arc<dyn ContextRepositoryPort>, turns: Arc<dyn ModelTurnRepositoryPort>, decisions: Arc<dyn ModelDecisionRepositoryPort>, model: Arc<dyn ModelDecisionPort>, config: Arc<dyn RuntimeConfigSnapshotPort>) -> Result<Self, BuildError>;
    pub async fn start(&self, command: StartModelTurn) -> Result<ModelTurnResult, ApplicationError>;
    pub async fn classify(&self, command: ClassifyModelResult) -> Result<ModelClassificationResult, ApplicationError>;
    pub async fn consume_result(&self, event: EventEnvelope<ModelResultAvailable>) -> Result<ModelResultIncorporation, ApplicationError>;
}
```

`start` commits intent/turn/submission candidate before calling `ModelDecisionPort`; a post-call unknown produces a new unknown marker transaction. `classify` and `consume_result` share domain mapping but keep command/event idempotency and error surfaces separate.

### 3.4 Action and delegation

```rust
pub struct ActionApplicationService {
    technical: TechnicalDependencies,
    run_truth: RunTruthDependencies,
    action_truth: ActionTruthDependencies,
    model_decisions: Arc<dyn ModelDecisionRepositoryPort>,
    governance: Arc<dyn GovernancePreconditionPort>,
    capabilities: Arc<dyn CapabilityExposurePort>,
    invocation: Arc<dyn InvocationCallerPort>,
    config: Arc<dyn RuntimeConfigSnapshotPort>,
}

impl ActionApplicationService {
    pub fn new(technical: TechnicalDependencies, run_truth: RunTruthDependencies, action_truth: ActionTruthDependencies, model_decisions: Arc<dyn ModelDecisionRepositoryPort>, governance: Arc<dyn GovernancePreconditionPort>, capabilities: Arc<dyn CapabilityExposurePort>, invocation: Arc<dyn InvocationCallerPort>, config: Arc<dyn RuntimeConfigSnapshotPort>) -> Result<Self, BuildError>;
    pub async fn propose(&self, command: ProposeAction) -> Result<ActionProposalResult, ApplicationError>;
    pub async fn evaluate_preconditions(&self, command: EvaluateActionPreconditions) -> Result<ActionPreconditionResult, ApplicationError>;
    pub async fn submit(&self, command: SubmitActionCandidate) -> Result<ActionSubmissionResult, ApplicationError>;
}

pub struct DelegationApplicationService {
    technical: TechnicalDependencies,
    run_truth: RunTruthDependencies,
    action_truth: ActionTruthDependencies,
    contexts: Arc<dyn ContextRepositoryPort>,
    child_runtime: Arc<dyn ChildRuntimePort>,
    config: Arc<dyn RuntimeConfigSnapshotPort>,
}

impl DelegationApplicationService {
    pub fn new(technical: TechnicalDependencies, run_truth: RunTruthDependencies, action_truth: ActionTruthDependencies, contexts: Arc<dyn ContextRepositoryPort>, child_runtime: Arc<dyn ChildRuntimePort>, config: Arc<dyn RuntimeConfigSnapshotPort>) -> Result<Self, BuildError>;
    pub async fn propose(&self, command: ProposeDelegation) -> Result<DelegationResult, ApplicationError>;
    pub async fn submit(&self, command: SubmitDelegationCandidate) -> Result<DelegationSubmissionResult, ApplicationError>;
    pub async fn incorporate_result(&self, event: EventEnvelope<ChildRuntimeResultAvailable>) -> Result<ChildResultIncorporation, ApplicationError>;
}
```

`submit` is named independently from propose/evaluate because it crosses an external effect boundary. If formal Tools/child contracts are pending, builder injects a blocked adapter and the service returns typed `Blocked/PendingContract`; Runtime never binds or calls a Sandbox Port directly.

### 3.5 Feedback and reflection

```rust
pub struct FeedbackApplicationService {
    technical: TechnicalDependencies,
    run_truth: RunTruthDependencies,
    action_truth: ActionTruthDependencies,
    config: Arc<dyn RuntimeConfigSnapshotPort>,
}

impl FeedbackApplicationService {
    pub fn new(technical: TechnicalDependencies, run_truth: RunTruthDependencies, action_truth: ActionTruthDependencies, config: Arc<dyn RuntimeConfigSnapshotPort>) -> Result<Self, BuildError>;
    pub async fn incorporate_action(&self, command: IncorporateActionFeedback) -> Result<FeedbackResult, ApplicationError>;
    pub async fn consume_action(&self, event: EventEnvelope<ExternalActionFeedback>) -> Result<FeedbackEventResult, ApplicationError>;
}

pub struct ReflectionApplicationService {
    technical: TechnicalDependencies,
    run_truth: RunTruthDependencies,
    action_truth: ActionTruthDependencies,
    contexts: Arc<dyn ContextRepositoryPort>,
    reflections: Arc<dyn ReflectionRepositoryPort>,
    config: Arc<dyn RuntimeConfigSnapshotPort>,
}

impl ReflectionApplicationService {
    pub fn new(technical: TechnicalDependencies, run_truth: RunTruthDependencies, action_truth: ActionTruthDependencies, contexts: Arc<dyn ContextRepositoryPort>, reflections: Arc<dyn ReflectionRepositoryPort>, config: Arc<dyn RuntimeConfigSnapshotPort>) -> Result<Self, BuildError>;
    pub async fn reflect(&self, command: RequestReflectionDecision) -> Result<ReflectionResult, ApplicationError>;
}
```

Feedback records duplicate/late/out-of-order events before deciding whether marker/progress changes. Reflection creates a new record and cannot expose model hidden reasoning.

### 3.6 Checkpoint, recovery and outcome

```rust
pub struct RecoveryApplicationService {
    technical: TechnicalDependencies,
    run_truth: RunTruthDependencies,
    context_truth: ContextTruthDependencies,
    action_truth: ActionTruthDependencies,
    recovery_truth: RecoveryTruthDependencies,
    leases: Arc<dyn LeasePort>,
    checkpoint_commit: Arc<dyn CheckpointCommitPort>,
    config: Arc<dyn RuntimeConfigSnapshotPort>,
}

impl RecoveryApplicationService {
    pub fn new(technical: TechnicalDependencies, run_truth: RunTruthDependencies, context_truth: ContextTruthDependencies, action_truth: ActionTruthDependencies, recovery_truth: RecoveryTruthDependencies, leases: Arc<dyn LeasePort>, checkpoint_commit: Arc<dyn CheckpointCommitPort>, config: Arc<dyn RuntimeConfigSnapshotPort>) -> Result<Self, BuildError>;
    pub async fn prepare_checkpoint(&self, command: PrepareRuntimeCheckpoint) -> Result<CheckpointPrepareResult, ApplicationError>;
    pub async fn commit_checkpoint(&self, command: CommitRuntimeCheckpoint) -> Result<CheckpointCommitResult, ApplicationError>;
    pub async fn request_recovery(&self, command: RequestRecoveryDecision) -> Result<RecoveryResult, ApplicationError>;
    pub async fn resume_continuation(&self, job: ResumeRecoveryContinuation) -> Result<RecoveryContinuationResult, ApplicationError>;
}

pub struct OutcomeApplicationService {
    technical: TechnicalDependencies,
    run_truth: RunTruthDependencies,
    action_truth: ActionTruthDependencies,
    recovery_truth: RecoveryTruthDependencies,
    config: Arc<dyn RuntimeConfigSnapshotPort>,
}

impl OutcomeApplicationService {
    pub fn new(technical: TechnicalDependencies, run_truth: RunTruthDependencies, action_truth: ActionTruthDependencies, recovery_truth: RecoveryTruthDependencies, config: Arc<dyn RuntimeConfigSnapshotPort>) -> Result<Self, BuildError>;
    pub async fn finalize(&self, command: FinalizeRuntimeOutcome) -> Result<OutcomeResult, ApplicationError>;
}
```

Checkpoint prepare is local-only. Checkpoint commit uses a separate pending physical port and maps unknown receipt to `CommitUnknown`. Outcome transaction commits outcome/run/history/outbox/stored result before any handoff call.

### 3.7 Handoff and source capture

```rust
pub struct HandoffApplicationService {
    technical: TechnicalDependencies,
    run_truth: RunTruthDependencies,
    recovery_truth: RecoveryTruthDependencies,
    handoff_truth: HandoffTruthDependencies,
    handoff_submission: Arc<dyn HandoffSubmissionPort>,
    config: Arc<dyn RuntimeConfigSnapshotPort>,
}

impl HandoffApplicationService {
    pub fn new(technical: TechnicalDependencies, run_truth: RunTruthDependencies, recovery_truth: RecoveryTruthDependencies, handoff_truth: HandoffTruthDependencies, handoff_submission: Arc<dyn HandoffSubmissionPort>, config: Arc<dyn RuntimeConfigSnapshotPort>) -> Result<Self, BuildError>;
    pub async fn create_candidate(&self, command: CreateHandoffCandidate) -> Result<HandoffResult, ApplicationError>;
    pub async fn submit_candidate(&self, command: SubmitHandoffCandidate) -> Result<HandoffSubmissionResult, ApplicationError>;
    pub async fn consume_acknowledgement(&self, event: EventEnvelope<HandoffAcknowledged>) -> Result<HandoffAcknowledgementResult, ApplicationError>;
}

pub struct SourceCaptureApplicationService {
    technical: TechnicalDependencies,
    source_markers: Arc<dyn SourceReferenceRepositoryPort>,
    resolver: Arc<dyn SourceResolverPort>,
    history: Arc<dyn HistoryRepositoryPort>,
    config: Arc<dyn RuntimeConfigSnapshotPort>,
}

impl SourceCaptureApplicationService {
    pub fn new(technical: TechnicalDependencies, source_markers: Arc<dyn SourceReferenceRepositoryPort>, resolver: Arc<dyn SourceResolverPort>, history: Arc<dyn HistoryRepositoryPort>, config: Arc<dyn RuntimeConfigSnapshotPort>) -> Result<Self, BuildError>;
    pub async fn capture(&self, command: CaptureSourceSnapshot) -> Result<SourceSnapshotResult, ApplicationError>;
    pub async fn consume_change(&self, event: EventEnvelope<ExternalTruthChanged>) -> Result<SourceChangeResult, ApplicationError>;
}
```

Candidate creation and external submission are separate operations. Source capture persists metadata/safe refs only and maps unavailable/pending owner contracts without inventing snapshots.

## 4. Query, consumer and job services

### 4.1 `RuntimeQueryApplicationService`

```rust
pub struct RuntimeQueryApplicationService {
    projections: Arc<dyn ProjectionStorePort>,
    runs: Arc<dyn RunRepositoryPort>,
    workspaces: Arc<dyn GoalPlanRepositoryPort>,
    history: Arc<dyn HistoryRepositoryPort>,
    contexts: Arc<dyn ContextRepositoryPort>,
    model_decisions: Arc<dyn ModelDecisionRepositoryPort>,
    action_truth: ActionTruthDependencies,
    recovery_truth: RecoveryTruthDependencies,
    handoff_truth: HandoffTruthDependencies,
    source_markers: Arc<dyn SourceReferenceRepositoryPort>,
    visibility: Arc<dyn ReadVisibilityPort>,
    clock: Arc<dyn ClockPort>,
}

impl RuntimeQueryApplicationService {
    pub fn new(projections: Arc<dyn ProjectionStorePort>, runs: Arc<dyn RunRepositoryPort>, workspaces: Arc<dyn GoalPlanRepositoryPort>, history: Arc<dyn HistoryRepositoryPort>, contexts: Arc<dyn ContextRepositoryPort>, model_decisions: Arc<dyn ModelDecisionRepositoryPort>, action_truth: ActionTruthDependencies, recovery_truth: RecoveryTruthDependencies, handoff_truth: HandoffTruthDependencies, source_markers: Arc<dyn SourceReferenceRepositoryPort>, visibility: Arc<dyn ReadVisibilityPort>, clock: Arc<dyn ClockPort>) -> Result<Self, BuildError>;
    pub async fn request_safe_runtime_view(&self, query: RequestSafeRuntimeView) -> Result<SafeRuntimeViewResult, QueryError>;
    pub async fn get_run_progress(&self, query: GetRunProgress) -> Result<ProgressViewResult, QueryError>;
    pub async fn resolve_memory_candidates(&self, query: ResolveMemoryCandidates) -> Result<MemoryCandidatePageResult, QueryError>;
    pub async fn get_model_decision(&self, query: GetModelDecision) -> Result<ModelDecisionViewResult, QueryError>;
    pub async fn get_action_status(&self, query: GetActionStatus) -> Result<ActionStatusViewResult, QueryError>;
    pub async fn get_delegation_status(&self, query: GetDelegationStatus) -> Result<DelegationStatusViewResult, QueryError>;
    pub async fn get_checkpoint_status(&self, query: GetCheckpointStatus) -> Result<CheckpointStatusViewResult, QueryError>;
    pub async fn get_runtime_outcome(&self, query: GetRuntimeOutcome) -> Result<OutcomeViewResult, QueryError>;
    pub async fn get_handoff_status(&self, query: GetHandoffStatus) -> Result<HandoffStatusViewResult, QueryError>;
    pub async fn resolve_source_reference(&self, query: ResolveSourceReference) -> Result<SourceReferenceViewResult, QueryError>;
    pub async fn read_safe_handoff_material(&self, query: ReadSafeHandoffMaterial) -> Result<HandoffMaterialViewResult, QueryError>;
    pub async fn list_runtime_history(&self, query: ListRuntimeHistory) -> Result<RuntimeHistoryPageResult, QueryError>;
}
```

The 12 query methods have independent read surfaces and result types. Query service never opens UoW, stores idempotency mutation or calls external write adapters.

### 4.2 `RuntimeEventConsumerService`

```rust
pub struct RuntimeEventConsumerService {
    feedback: Arc<FeedbackApplicationService>,
    model: Arc<ModelTurnApplicationService>,
    handoff: Arc<HandoffApplicationService>,
    sources: Arc<SourceCaptureApplicationService>,
    progress: Arc<RunProgressApplicationService>,
    event_inbox: Arc<dyn EventInboxPort>,
    config: Arc<dyn RuntimeConfigSnapshotPort>,
}

impl RuntimeEventConsumerService {
    pub fn new(feedback: Arc<FeedbackApplicationService>, model: Arc<ModelTurnApplicationService>, handoff: Arc<HandoffApplicationService>, sources: Arc<SourceCaptureApplicationService>, progress: Arc<RunProgressApplicationService>, event_inbox: Arc<dyn EventInboxPort>, config: Arc<dyn RuntimeConfigSnapshotPort>) -> Result<Self, BuildError>;
    pub async fn consume_tool_or_sandbox_feedback(&self, event: EventEnvelope<ExternalActionFeedback>) -> Result<ConsumerReceipt, ConsumerError>;
    pub async fn consume_governance_decision(&self, event: EventEnvelope<GovernanceDecisionChanged>) -> Result<ConsumerReceipt, ConsumerError>;
    pub async fn consume_model_adapter_result(&self, event: EventEnvelope<ModelResultAvailable>) -> Result<ConsumerReceipt, ConsumerError>;
    pub async fn consume_memory_availability(&self, event: EventEnvelope<MemoryAvailabilityChanged>) -> Result<ConsumerReceipt, ConsumerError>;
    pub async fn consume_handoff_acknowledgement(&self, event: EventEnvelope<HandoffAcknowledged>) -> Result<ConsumerReceipt, ConsumerError>;
    pub async fn consume_external_truth_change(&self, event: EventEnvelope<ExternalTruthChanged>) -> Result<ConsumerReceipt, ConsumerError>;
}
```

Each consumer has its own schema and target application service. Inbox reservation, local fact commit and consumer receipt share the event operation transaction where the persistence contract permits; duplicate/late/out-of-order are successful typed dispositions, not silent drops.

### 4.3 `RuntimeOperationsJobService`

```rust
pub struct RuntimeOperationsJobService {
    recovery: Arc<RecoveryApplicationService>,
    actions: Arc<ActionApplicationService>,
    contexts: Arc<ContextCompositionApplicationService>,
    handoff: Arc<HandoffApplicationService>,
    source_capture: Arc<SourceCaptureApplicationService>,
    projections: Arc<ProjectionApplicationService>,
    leases: Arc<dyn LeasePort>,
    job_state: Arc<dyn JobStateRepositoryPort>,
    config: Arc<dyn RuntimeConfigSnapshotPort>,
}

impl RuntimeOperationsJobService {
    pub fn new(recovery: Arc<RecoveryApplicationService>, actions: Arc<ActionApplicationService>, contexts: Arc<ContextCompositionApplicationService>, handoff: Arc<HandoffApplicationService>, source_capture: Arc<SourceCaptureApplicationService>, projections: Arc<ProjectionApplicationService>, leases: Arc<dyn LeasePort>, job_state: Arc<dyn JobStateRepositoryPort>, config: Arc<dyn RuntimeConfigSnapshotPort>) -> Result<Self, BuildError>;
    pub async fn resume_recovery(&self, job: ResumeRecoveryContinuation) -> Result<RecoveryJobReport, JobError>;
    pub async fn rebuild_run_projection(&self, job: RebuildRunProjection) -> Result<ProjectionJobReport, JobError>;
    pub async fn rebuild_safe_runtime_views(&self, job: RebuildSafeRuntimeViews) -> Result<ProjectionJobReport, JobError>;
    pub async fn reconcile_handoff_gaps(&self, job: ReconcileHandoffGaps) -> Result<HandoffJobReport, JobError>;
    pub async fn refresh_source_availability(&self, job: RefreshSourceAvailability) -> Result<SourceRefreshJobReport, JobError>;
    pub async fn reevaluate_pending_action_guards(&self, job: ReevaluatePendingActionGuards) -> Result<ActionGuardJobReport, JobError>;
    pub async fn expire_stale_working_context(&self, job: ExpireStaleWorkingContext) -> Result<ContextExpiryJobReport, JobError>;
}
```

Job entry methods have independent cursor/report types. The service validates enablement and lease before reads; each page commit advances a durable cursor. A report is an operational local record, never test evidence or readiness proof.

## 5. Projection and publisher application services

```rust
pub struct ProjectionApplicationService {
    projections: Arc<dyn ProjectionStorePort>,
    history: Arc<dyn HistoryRepositoryPort>,
    leases: Arc<dyn LeasePort>,
    clock: Arc<dyn ClockPort>,
    config: Arc<dyn RuntimeConfigSnapshotPort>,
}

impl ProjectionApplicationService {
    pub fn new(projections: Arc<dyn ProjectionStorePort>, history: Arc<dyn HistoryRepositoryPort>, leases: Arc<dyn LeasePort>, clock: Arc<dyn ClockPort>, config: Arc<dyn RuntimeConfigSnapshotPort>) -> Result<Self, BuildError>;
    pub async fn rebuild_run(&self, job: RebuildRunProjection) -> Result<ProjectionJobReport, JobError>;
    pub async fn rebuild_views(&self, job: RebuildSafeRuntimeViews) -> Result<ProjectionJobReport, JobError>;
}

pub struct OutboxPublisherApplicationService {
    outbox: Arc<dyn OutboxRepositoryPort>,
    publisher: Arc<dyn EventPublisherPort>,
    leases: Arc<dyn LeasePort>,
    clock: Arc<dyn ClockPort>,
    config: Arc<dyn RuntimeConfigSnapshotPort>,
}

impl OutboxPublisherApplicationService {
    pub fn new(outbox: Arc<dyn OutboxRepositoryPort>, publisher: Arc<dyn EventPublisherPort>, leases: Arc<dyn LeasePort>, clock: Arc<dyn ClockPort>, config: Arc<dyn RuntimeConfigSnapshotPort>) -> Result<Self, BuildError>;
    pub async fn publish_page(&self, request: PublishOutboxPage) -> Result<OutboxPublishReport, PublishError>;
}
```

Projection consumes committed history. Publisher sends commit-time snapshots already stored in outbox; it does not reconstruct payload from current truth or mark observed/accepted.

## 6. Infra configuration and builder objects

### 6.1 `RuntimeConfigSnapshot`

```rust
pub struct RuntimeConfigSnapshot {
    pub snapshot_ref: ConfigSnapshotRef,
    pub config_schema_version: SchemaVersion,
    pub profile: RuntimeProfile,
    pub policy_versions: RuntimePolicyVersionSet,
    pub adapter_slots: AdapterSlotConfigSet,
    pub job_controls: JobControlSet,
    pub validation: ConfigValidationSummary,
    pub loaded_at: Timestamp,
}

pub enum RuntimeProfileKind {
    Api,
    Worker,
    Jobs,
    TestFake,
}

/// The only owner of immutable typed policy values consumed by Runtime.
pub struct RuntimeProfile {
    pub kind: RuntimeProfileKind,
    pub scope: RuntimeScopeProfile,
    pub context: ContextCompositionProfile,
    pub working_memory: WorkingMemoryProfile,
    pub model_decision: ModelDecisionProfile,
    pub action_guard: ActionGuardProfile,
    pub delegation: DelegationProfile,
    pub checkpoint_recovery: CheckpointRecoveryProfile,
    pub handoff_projection: HandoffProjectionProfile,
    pub idempotency: IdempotencyProfile,
}

pub struct RuntimePolicyVersionSet {
    pub scope: SchemaVersion,
    pub context: SchemaVersion,
    pub working_memory: SchemaVersion,
    pub model_decision: SchemaVersion,
    pub action_guard: SchemaVersion,
    pub delegation: SchemaVersion,
    pub checkpoint_recovery: SchemaVersion,
    pub handoff_projection: SchemaVersion,
    pub idempotency: SchemaVersion,
}

pub struct ConfigValidationSummary {
    pub schema_version: SchemaVersion,
    pub source_fingerprint: RequestDigest,
    pub validated_at: Timestamp,
    pub issue_count: RecordCount,
}

impl RuntimeConfigSnapshot {
    pub fn validate_for(&self, profile: RuntimeProfileKind) -> Result<(), ConfigError>;
    pub fn require_slot(&self, slot: AdapterSlot) -> Result<&AdapterSlotConfig, ConfigError>;
    pub fn job_control(&self, operation: JobOperation) -> Result<&JobControl, ConfigError>;
}
```

Exact keys, sources, defaults and environment bindings are Step 14/04 responsibilities. Snapshot identity is captured at command/job start; config does not mutate an in-flight domain decision.

### 6.2 Adapter slot and state

```rust
pub struct AdapterSlotConfig {
    pub slot: AdapterSlot,
    pub requirement: SlotRequirement,
    pub contract_ref: Option<AdapterContractRef>,
    pub expected_schema: Option<SchemaVersion>,
    pub activation: SlotActivation,
    pub blocker_ref: Option<BlockerRef>,
}

pub enum AdapterSlot {
    Governance,
    DefinitionResolver,
    SourceResolver,
    DurableMemory,
    CapabilityExposure,
    InvocationCaller,
    ModelContextMaterializer,
    ModelDecision,
    ChildRuntime,
    CheckpointCommit,
    HandoffSubmission,
    EventPublisher,
    ProjectionStore,
}

pub enum SlotRequirement {
    Required,
    Optional,
}

pub enum SlotActivation {
    Disabled,
    Blocked,
    Candidate,
}

pub struct AdapterSlotConfigSet {
    pub governance: AdapterSlotConfig,
    pub definition_resolver: AdapterSlotConfig,
    pub source_resolver: AdapterSlotConfig,
    pub durable_memory: AdapterSlotConfig,
    pub capability_exposure: AdapterSlotConfig,
    pub invocation_caller: AdapterSlotConfig,
    pub model_context_materializer: AdapterSlotConfig,
    pub model_decision: AdapterSlotConfig,
    pub child_runtime: AdapterSlotConfig,
    pub checkpoint_commit: AdapterSlotConfig,
    pub handoff_submission: AdapterSlotConfig,
    pub event_publisher: AdapterSlotConfig,
    pub projection_store: AdapterSlotConfig,
}

pub struct JobControlSet {
    pub rebuild_safe_runtime_views: JobControl,
    pub refresh_source_snapshots: JobControl,
    pub compact_working_memory: JobControl,
    pub resume_eligible_runs: JobControl,
    pub reconcile_unknown_effects: JobControl,
    pub reconcile_handoff_gaps: JobControl,
    pub publish_runtime_outbox: JobControl,
}

pub struct AdapterRuntimeState {
    pub slot: AdapterSlot,
    pub adapter_ref: AdapterRef,
    pub availability: AdapterAvailabilityState,
    pub contract_ref: Option<AdapterContractRef>,
    pub schema_version: Option<SchemaVersion>,
    pub reason: SafeReason,
    pub checked_at: Timestamp,
}

impl AdapterSlotConfig {
    pub fn validate(&self) -> Result<(), ConfigError>;
    pub fn permits_candidate_binding(&self) -> bool;
}

impl AdapterRuntimeState {
    pub fn blocked(slot: AdapterSlot, adapter_ref: AdapterRef, reason: SafeReason, now: Timestamp) -> Self;
    pub fn validate_against(&self, config: &AdapterSlotConfig) -> Result<(), BuildError>;
    pub fn permits_positive_call(&self) -> bool;
}
```

No adapter slot stores provider secret/route/quota/cost. `Candidate` is not ready; positive call also requires implementation-time qualification, which this design cannot assert.

### 6.3 Builder and facade

```rust
pub struct RuntimeBuilder {
    config: RuntimeConfigSnapshot,
    technical: Option<TechnicalDependencies>,
    repositories: Option<RuntimeRepositorySet>,
    slots: RuntimeDependencySlots,
}

pub struct RuntimeRepositorySet {
    pub run_truth: RunTruthDependencies,
    pub context_truth: ContextTruthDependencies,
    pub action_truth: ActionTruthDependencies,
    pub recovery_truth: RecoveryTruthDependencies,
    pub handoff_truth: HandoffTruthDependencies,
    pub model_turns: Arc<dyn ModelTurnRepositoryPort>,
    pub model_decisions: Arc<dyn ModelDecisionRepositoryPort>,
    pub reflections: Arc<dyn ReflectionRepositoryPort>,
    pub jobs: Arc<dyn JobStateRepositoryPort>,
    pub inbox: Arc<dyn EventInboxPort>,
}

pub struct RuntimeDependencySlots {
    pub governance: Option<Arc<dyn GovernancePreconditionPort>>,
    pub definition_resolver: Option<Arc<dyn DefinitionResolverPort>>,
    pub source_resolver: Option<Arc<dyn SourceResolverPort>>,
    pub durable_memory: Option<Arc<dyn MemoryRetrievalPort>>,
    pub capability_exposure: Option<Arc<dyn CapabilityExposurePort>>,
    pub invocation_caller: Option<Arc<dyn InvocationCallerPort>>,
    pub model_context_materializer: Option<Arc<dyn ModelContextMaterializerPort>>,
    pub model_decision: Option<Arc<dyn ModelDecisionPort>>,
    pub child_runtime: Option<Arc<dyn ChildRuntimePort>>,
    pub checkpoint_commit: Option<Arc<dyn CheckpointCommitPort>>,
    pub handoff_submission: Option<Arc<dyn HandoffSubmissionPort>>,
    pub event_publisher: Option<Arc<dyn EventPublisherPort>>,
    pub projection_store: Option<Arc<dyn ProjectionStorePort>>,
}

pub struct RuntimeApplicationFacade {
    pub admission: Arc<AdmissionApplicationService>,
    pub control: Arc<ControlApplicationService>,
    pub progress: Arc<RunProgressApplicationService>,
    pub context: Arc<ContextCompositionApplicationService>,
    pub model: Arc<ModelTurnApplicationService>,
    pub action: Arc<ActionApplicationService>,
    pub delegation: Arc<DelegationApplicationService>,
    pub feedback: Arc<FeedbackApplicationService>,
    pub reflection: Arc<ReflectionApplicationService>,
    pub recovery: Arc<RecoveryApplicationService>,
    pub outcome: Arc<OutcomeApplicationService>,
    pub handoff: Arc<HandoffApplicationService>,
    pub sources: Arc<SourceCaptureApplicationService>,
    pub queries: Arc<RuntimeQueryApplicationService>,
    pub consumers: Arc<RuntimeEventConsumerService>,
    pub jobs: Arc<RuntimeOperationsJobService>,
}

impl RuntimeBuilder {
    pub fn new(config: RuntimeConfigSnapshot) -> Result<Self, ConfigError>;
    pub fn with_technical(self, technical: TechnicalDependencies) -> Self;
    pub fn with_repositories(self, repositories: RuntimeRepositorySet) -> Self;
    pub fn with_dependency_slots(self, slots: RuntimeDependencySlots) -> Self;
    pub fn validate(self) -> Result<ValidatedRuntimeBuilder, BuildError>;
}

impl ValidatedRuntimeBuilder {
    pub fn build_facade(self) -> Result<RuntimeApplicationFacade, BuildError>;
}
```

Missing required local repository/technical slots fail build. Pending external seams bind explicit blocked adapters when the profile permits degraded startup; they do not bind fakes in non-test profiles. API/worker/jobs receive only the facade.

## 7. API, worker and job entry carriers

### 7.1 API handlers

```rust
pub struct RuntimeCommandHandler {
    facade: Arc<RuntimeApplicationFacade>,
    mapper: Arc<dyn CommandProtocolMapper>,
}

pub struct RuntimeQueryHandler {
    facade: Arc<RuntimeApplicationFacade>,
    mapper: Arc<dyn QueryProtocolMapper>,
}

impl RuntimeCommandHandler {
    pub fn new(facade: Arc<RuntimeApplicationFacade>, mapper: Arc<dyn CommandProtocolMapper>) -> Result<Self, BuildError>;
    pub async fn handle(&self, envelope: CommandEnvelope) -> Result<CommandResponseEnvelope, EntryError>;
}

impl RuntimeQueryHandler {
    pub fn new(facade: Arc<RuntimeApplicationFacade>, mapper: Arc<dyn QueryProtocolMapper>) -> Result<Self, BuildError>;
    pub async fn handle(&self, envelope: QueryEnvelope) -> Result<QueryResponseEnvelope, EntryError>;
}
```

Transport/route is not chosen. Mappers validate schema/metadata/body-free constraints and dispatch a finite operation enum; handlers never read repository or construct domain objects directly.

### 7.2 Worker consumers

```rust
pub struct RuntimeEventWorker {
    facade: Arc<RuntimeApplicationFacade>,
    mapper: Arc<dyn EventProtocolMapper>,
    acknowledgement: Arc<dyn EventAcknowledgementPort>,
}

impl RuntimeEventWorker {
    pub fn new(facade: Arc<RuntimeApplicationFacade>, mapper: Arc<dyn EventProtocolMapper>, acknowledgement: Arc<dyn EventAcknowledgementPort>) -> Result<Self, BuildError>;
    pub async fn handle(&self, envelope: RawEventEnvelope) -> Result<EventWorkerDisposition, EntryError>;
}

pub enum EventWorkerDisposition {
    Applied { receipt: ConsumerReceipt },
    Duplicate { receipt: ConsumerReceipt },
    Quarantined { receipt: ConsumerReceipt },
    RetryableInfrastructureFailure { reason: SafeReason },
    DeadLetterCandidate { reason: SafeReason },
    BlockedContract { blocker_ref: BlockerRef },
}
```

Acknowledgement occurs only after a durable consumer disposition. Broker-specific retry/dead-letter semantics remain an adapter concern and are not selected here.

### 7.3 Job runner

```rust
pub struct RuntimeJobRunner {
    facade: Arc<RuntimeApplicationFacade>,
    mapper: Arc<dyn JobProtocolMapper>,
}

pub struct JobRunContext {
    pub job_id: JobId,
    pub operation: JobOperation,
    pub lease: LeaseClaim,
    pub cursor: Option<JobCursor>,
    pub page_limit: PageLimit,
    pub config_snapshot_ref: ConfigSnapshotRef,
    pub correlation: RuntimeCorrelation,
    pub started_at: Timestamp,
}

impl RuntimeJobRunner {
    pub fn new(facade: Arc<RuntimeApplicationFacade>, mapper: Arc<dyn JobProtocolMapper>) -> Result<Self, BuildError>;
    pub async fn run(&self, request: JobRequestEnvelope) -> Result<JobReportEnvelope, EntryError>;
}

impl JobRunContext {
    pub async fn claim(metadata: JobMetadata, config_snapshot_ref: ConfigSnapshotRef, page_limit: PageLimit, leases: &dyn LeasePort, clock: &dyn ClockPort) -> Result<Self, JobError>;
    pub fn validate_cursor(&self, state: &JobStateRecord) -> Result<(), JobError>;
}
```

No scheduler/container/member-service lifecycle is owned here. Job runner handles a supplied request and returns a local report; activation/cadence binding is deferred to configuration design.

## 8. Job state and report carriers

```rust
pub struct JobStateRecord {
    pub job_state_id: JobStateId,
    pub operation: JobOperation,
    pub partition: JobPartition,
    pub cursor: Option<JobCursor>,
    pub status: JobStateStatus,
    pub lease_ref: Option<LeaseRef>,
    pub last_report_ref: Option<JobReportRef>,
    pub version: JobStateVersion,
    pub updated_at: Timestamp,
}

pub enum JobStateStatus {
    Waiting,
    Running,
    CompletedPage,
    Blocked,
    Failed,
    Unknown,
}

pub struct JobPageOutcome {
    pub scanned_count: RecordCount,
    pub processed_count: RecordCount,
    pub changed_count: RecordCount,
    pub skipped_count: RecordCount,
    pub blocked_count: RecordCount,
    pub next_cursor: Option<JobCursor>,
    pub reason: Option<SafeReason>,
}

impl JobStateRecord {
    pub fn create(job_state_id: JobStateId, operation: JobOperation, partition: JobPartition, now: Timestamp) -> Result<Self, DomainError>;
    pub fn claim(&mut self, lease_ref: LeaseRef, expected: JobStateVersion, now: Timestamp) -> Result<(), DomainError>;
    pub fn complete_page(&mut self, outcome: &JobPageOutcome, report_ref: JobReportRef, expected: JobStateVersion, now: Timestamp) -> Result<(), DomainError>;
    pub fn block(&mut self, reason: SafeReason, expected: JobStateVersion, now: Timestamp) -> Result<(), DomainError>;
    pub fn fail(&mut self, reason: SafeReason, expected: JobStateVersion, now: Timestamp) -> Result<(), DomainError>;
}

impl JobPageOutcome {
    pub fn validate_counts(&self) -> Result<(), DomainError>;
    pub fn has_more(&self) -> bool;
}
```

Counts and report refs are planned runtime operation records, not fabricated run IDs, test results, evidence aliases or readiness reports.

## 9. Object-to-file and validation audit

| Object group | Planned file | Constructor validation | Flow use | Primary test seam |
|---|---|---|---|---|
| operation/version/stored result | `application/operation_context.rs`, `application/idempotency.rs` | metadata/digest/version/UoW | every Command | replay/conflict/rollback/commit-unknown fake |
| service dependency groups | `application/services/*`, `application/ports/*` | required typed ports | per-use-case | constructor missing port; no concrete infra dependency |
| 13 command services | individual service files from Step 4 | required port bundle/config | 17 public Command + internal submissions/reflection | spy/fake ordering and UoW assertions |
| query service | `application/services/query_service.rs` | read ports/visibility | 12 Query | each read surface; no write/UoW |
| consumer service | `application/services/consumer_service.rs` | inbox + target services | 6 consumers | duplicate/late/quarantine/ack ordering |
| job service | `application/services/job_service.rs` | lease/state/config | 7 jobs | disabled/lease/cursor/page resume |
| projection/publisher | projection/job services | cursor/outbox snapshot | rebuild/outbound | current truth not used for old outbox |
| config/slot/state | `infra/config.rs`, adapters | profile/contract/schema/activation | builder and every external call | pending blocked; no Ready claim |
| builder/facade | `infra/runtime_builder.rs`, `application/facade.rs` | complete local slots; blocked external seam | all entries | test fake profile only; production fake forbidden |
| API handler | `api/command_handlers.rs`, `api/query_handlers.rs` | protocol mapper | command/query | finite dispatch; no direct repository |
| worker | `worker/consumers.rs` | mapper/ack port | 6 events | ack only after durable disposition |
| job runner/state | `jobs/runners.rs`, `infra/repositories.rs` | lease/cursor/counts | 7 jobs | resume page; partition isolation |

## 10. Batch gate

| Check | Result |
|---|---|
| Every application service has concrete typed dependency fields and complete public signatures | pass |
| Command, Query, Event and Job entry objects are separate | pass |
| UoW, idempotency, stored result and expected versions are explicit | pass |
| Builder cannot silently bind fake/ready external adapters | pass |
| No concrete runtime/transport/DB/broker/scheduler/provider SDK is selected | pass |
| Entry carriers cannot access repositories or mutate domain directly | pass |
| Operational report/state is not represented as evidence/readiness | pass |

```text
next_allowed_action = rebuild_step_06_index_and_run_no_shorthand_audit
```
