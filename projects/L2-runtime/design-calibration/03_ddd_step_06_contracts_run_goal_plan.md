# L2-runtime Step 6 deep object contracts: contracts + run/goal-plan

> 状态: done
> 当前 Step: 6
> 批次: 6.1 contracts shared vocabulary; 6.2 run/admission/control; 6.3 goal-plan/progress/history
> 禁止: `...`、未标类型的 `refs/sources/repos`、把 DTO/view/carrier 当 domain truth

## 1. Contract object rules

每个 public type 必须标识 owner、可见性、序列化边界、缺失行为和 forbidden body。contracts crate 不读取 I/O，不执行 domain transition；domain crate 只能接收这些 typed values，不直接承担外部 wire serialization。

## 2. Shared identity/value objects

### 2.1 `RuntimeScope`

```rust
/// Identifies the runtime authorization boundary inherited from a formal entry source.
pub struct RuntimeScope {
    /// Stable opaque scope identity; never derived from display text.
    pub scope_id: ScopeId,
    /// Optional parent scope used to prove child delegation containment.
    pub parent_scope_id: Option<ScopeId>,
    /// Boundary kind that determines which child and read operations are legal.
    pub boundary: ScopeBoundary,
    /// Formal source that established the scope.
    pub source_ref: SourceReference,
}
```

```rust
pub enum ScopeBoundary {
    /// Top-level scope received from a formal entry authority.
    Root,
    /// Child scope constrained by parent and delegation budget.
    Child { parent_scope_id: ScopeId, delegation_id: DelegationId },
    /// Read-only projection scope that cannot mutate runtime truth.
    ReadOnly { parent_scope_id: ScopeId },
}
```

Required functions:

```rust
impl RuntimeScope {
    pub fn new(scope_id: ScopeId, parent_scope_id: Option<ScopeId>, boundary: ScopeBoundary, source_ref: SourceReference) -> Result<Self, DomainError>;
    pub fn contains(&self, candidate_scope_id: ScopeId) -> bool;
    pub fn derive_child(&self, child_scope_id: ScopeId, delegation_id: DelegationId) -> Result<Self, DomainError>;
    pub fn permits_write(&self) -> bool;
    pub fn validate_source(&self) -> Result<(), DomainError>;
}
```

Invariants: root has no parent; child parent must equal current scope; read-only cannot write; source owner/scope/version must validate; empty IDs or cross-scope child returns `ScopeViolation`.

### 2.2 `RuntimeCorrelation`

```rust
/// Carries stable causation and correlation identity across one runtime operation.
pub struct RuntimeCorrelation {
    pub correlation_id: CorrelationId,
    pub run_id: Option<RunId>,
    pub turn_id: Option<ModelTurnId>,
    pub decision_id: Option<DecisionId>,
    pub action_id: Option<ActionDecisionId>,
    pub delegation_id: Option<DelegationId>,
    pub causation_ref: Option<TypedRef>,
}
```

```rust
impl RuntimeCorrelation {
    pub fn for_run(correlation_id: CorrelationId, run_id: RunId, causation_ref: Option<TypedRef>) -> Result<Self, DomainError>;
    pub fn for_turn(&self, turn_id: ModelTurnId) -> Result<Self, DomainError>;
    pub fn for_action(&self, action_id: ActionDecisionId) -> Result<Self, DomainError>;
    pub fn for_delegation(&self, delegation_id: DelegationId) -> Result<Self, DomainError>;
    pub fn matches_event(&self, event: &EventCorrelation) -> bool;
}
```

Invariant: one child identity may be added only when parent correlation has the same run; mismatch is `CorrelationMismatch`; correlation IDs are never regenerated during retry/replay.

### 2.3 `CommandMetadata`

```rust
/// Metadata required before a mutating Runtime command can enter application orchestration.
pub struct CommandMetadata {
    pub request_id: RequestId,
    pub operation: OperationName,
    pub schema_version: SchemaVersion,
    pub idempotency_key: IdempotencyKey,
    pub request_digest: RequestDigest,
    pub actor_ref: ActorRef,
    pub scope: RuntimeScope,
    pub correlation: RuntimeCorrelation,
    pub causation_ref: Option<TypedRef>,
    pub occurred_at: Timestamp,
    pub config_snapshot_ref: ConfigSnapshotRef,
}
```

```rust
impl CommandMetadata {
    pub fn validate(&self) -> Result<(), ProtocolError>;
    pub fn canonical_digest_input(&self, body_free_payload: BodyFreeCanonicalValue) -> Result<CanonicalCommandInput, ProtocolError>;
    pub fn verify_digest(&self, computed: RequestDigest) -> Result<(), ProtocolError>;
}
```

Invariant: `request_digest` covers operation/schema/typed refs/scope/semantic enum values, excludes trace/transport headers/body; missing actor/scope/idempotency/correlation rejects before UoW.

### 2.4 `QueryMetadata`

```rust
/// Metadata required by a non-mutating Runtime query.
pub struct QueryMetadata {
    pub request_id: RequestId,
    pub operation: OperationName,
    pub actor_ref: ActorRef,
    pub read_scope: ReadScope,
    pub freshness_requirement: FreshnessRequirement,
    pub correlation: RuntimeCorrelation,
}
```

```rust
impl QueryMetadata {
    pub fn validate(&self) -> Result<(), ProtocolError>;
    pub fn validate_visibility(&self, requested: &RuntimeScope) -> Result<(), ProtocolError>;
}
```

Invariant: Query cannot carry mutation idempotency or UoW; `NotVisible` must not be downgraded to `NotFound` if doing so leaks existence.

### 2.5 `SourceReference`

```rust
/// References external owner truth without copying its body into Runtime.
pub struct SourceReference {
    pub source_ref_id: SourceReferenceId,
    pub owner_ref: OwnerRef,
    pub object_ref: TypedRef,
    pub scope: RuntimeScope,
    pub version: SourceVersion,
    pub freshness: FreshnessClaim,
}
```

```rust
impl SourceReference {
    pub fn validate_authority(&self) -> Result<(), SourceError>;
    pub fn validate_scope(&self, scope: &RuntimeScope) -> Result<(), SourceError>;
    pub fn require_fresh(&self, requirement: FreshnessRequirement) -> Result<(), SourceError>;
    pub fn canonical_digest_input(&self) -> BodyFreeCanonicalValue;
}
```

Invariant: owner/object/scope/version are typed and non-empty; freshness is a claim requiring resolver verification, not proof of current data.

### 2.6 `SafeReason` and `IdempotencyReservation`

```rust
/// A body-free reason that can be exposed through protocol, history, view or audit material.
pub struct SafeReason {
    pub category: SafeReasonCategory,
    pub code: SafeReasonCode,
    pub redaction: RedactionMarker,
    pub source_ref: Option<SourceReference>,
}

impl SafeReason {
    pub fn new(category: SafeReasonCategory, code: SafeReasonCode, redaction: RedactionMarker, source_ref: Option<SourceReference>) -> Result<Self, DomainError>;
    pub fn validate_body_free(&self) -> Result<(), DomainError>;
}

/// Local reservation that binds one operation key to one canonical request digest.
pub struct IdempotencyReservation {
    pub operation: OperationName,
    pub key: IdempotencyKey,
    pub request_digest: RequestDigest,
    pub status: IdempotencyStatus,
    pub stored_result_ref: Option<TypedRef>,
    pub expires_at: Timestamp,
}

impl IdempotencyReservation {
    pub fn reserve(operation: OperationName, key: IdempotencyKey, digest: RequestDigest, expires_at: Timestamp) -> Result<Self, DomainError>;
    pub fn replay_or_conflict(&self, digest: RequestDigest) -> Result<IdempotencyDisposition, DomainError>;
    pub fn complete(&mut self, result_ref: TypedRef) -> Result<(), DomainError>;
}
```

`SafeReason` rejects body/secret/hidden rationale. Reservation accepts same digest only; different digest is conflict; expired reservation cannot silently become new operation without explicit policy.

## 3. Admission and control domain objects

### 3.1 `RuntimeTriggerContext`

```rust
/// Immutable, body-free input used to evaluate runtime admission.
pub struct RuntimeTriggerContext {
    pub actor_ref: ActorRef,
    pub scope: RuntimeScope,
    pub goal_refs: Vec<TypedRef>,
    pub source_ref: SourceReference,
    pub precondition_refs: Vec<TypedRef>,
    pub idempotency_key: IdempotencyKey,
    pub metadata: CommandMetadata,
}

impl RuntimeTriggerContext {
    pub fn create(actor_ref: ActorRef, scope: RuntimeScope, goal_refs: Vec<TypedRef>, source_ref: SourceReference, precondition_refs: Vec<TypedRef>, idempotency_key: IdempotencyKey, metadata: CommandMetadata) -> Result<Self, DomainError>;
    pub fn validate_scope(&self) -> Result<(), DomainError>;
    pub fn canonical_digest_input(&self) -> BodyFreeCanonicalValue;
}
```

Invariant: source and goals share allowed scope; prompt/body absent; metadata operation is `AcceptRuntimeTrigger`.

### 3.2 `RuntimeAdmissionDecision`

```rust
/// Local decision that determines whether a controlled run may be created.
pub struct RuntimeAdmissionDecision {
    pub decision_id: DecisionId,
    pub trigger_digest: RequestDigest,
    pub disposition: AdmissionDisposition,
    pub reason: SafeReason,
    pub source_refs: Vec<SourceReference>,
    pub decided_at: Timestamp,
}

pub enum AdmissionDisposition {
    Accepted,
    Rejected,
    Waiting,
    Blocked,
}

impl RuntimeAdmissionDecision {
    pub fn decide(trigger: &RuntimeTriggerContext, preconditions: &PreconditionSummary, id: DecisionId, now: Timestamp) -> Result<Self, DomainError>;
    pub fn permits_run_creation(&self) -> bool;
    pub fn to_history_fact(&self, run_id: Option<RunId>, correlation: RuntimeCorrelation) -> Result<RuntimeHistoryEntry, DomainError>;
}
```

Invariant: missing/unknown precondition cannot produce `Accepted`; non-accepted decision has no run creation ref.

### 3.3 `ControlledRun`

```rust
/// Primary local lifecycle aggregate for one runtime execution scope.
pub struct ControlledRun {
    pub run_id: RunId,
    pub scope: RuntimeScope,
    pub status: RunStatus,
    pub goal_plan_workspace_id: GoalPlanWorkspaceId,
    pub current_decision_id: Option<DecisionId>,
    pub stable_checkpoint_id: Option<CheckpointId>,
    pub terminal_outcome_id: Option<OutcomeId>,
    pub version: RunVersion,
    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}

pub enum RunStatus {
    Active,
    Waiting { reason: SafeReason },
    Blocked { reason: SafeReason },
    Cancelled { reason: SafeReason },
    Completed { outcome_id: OutcomeId },
    Failed { reason: SafeReason },
    Unknown { fence: FenceRef },
    ManualReview { decision_id: DecisionId },
}

impl ControlledRun {
    pub fn create(run_id: RunId, workspace_id: GoalPlanWorkspaceId, admission: &RuntimeAdmissionDecision, trigger: &RuntimeTriggerContext, now: Timestamp) -> Result<Self, DomainError>;
    pub fn apply_control(&mut self, intent: &RuntimeControlIntent, guard: &ControlGuard, now: Timestamp) -> Result<RunTransition, DomainError>;
    pub fn apply_progress(&mut self, decision: &RunProgressDecision, now: Timestamp) -> Result<RunTransition, DomainError>;
    pub fn attach_checkpoint(&mut self, checkpoint_id: CheckpointId, expected: RunVersion) -> Result<(), DomainError>;
    pub fn finalize_outcome(&mut self, outcome_id: OutcomeId, disposition: OutcomeDisposition, expected: RunVersion, now: Timestamp) -> Result<(), DomainError>;
    pub fn mark_unknown(&mut self, fence: FenceRef, now: Timestamp) -> Result<(), DomainError>;
    pub fn is_terminal(&self) -> bool;
}
```

Invariant: `create` requires accepted admission; terminal/unknown status cannot be overwritten by delivery; every mutation increments `RunVersion`; `Completed` requires outcome ID; `Unknown` requires fence.

### 3.4 `RuntimeControlIntent` and guard

```rust
pub enum RuntimeControlKind {
    Pause,
    Cancel,
    Resume,
    Stop,
}

pub struct RuntimeControlIntent {
    pub run_id: RunId,
    pub kind: RuntimeControlKind,
    pub reason: SafeReason,
    pub checkpoint_ref: Option<CheckpointId>,
    pub expected_version: RunVersion,
}

pub struct ControlGuard {
    pub actor_ref: ActorRef,
    pub scope: RuntimeScope,
    pub stable_checkpoint: Option<RuntimeCheckpoint>,
    pub unresolved_effects: Vec<SideEffectMarker>,
    pub source_refs: Vec<SourceReference>,
}

impl RuntimeControlIntent {
    pub fn validate(&self) -> Result<(), DomainError>;
    pub fn validate_against(&self, run: &ControlledRun, guard: &ControlGuard) -> Result<(), DomainError>;
}
```

Resume requires stable committed checkpoint and no unknown effect fence; cancel/stop changes local posture only.

## 4. Goal/plan objects

### 4.1 `WorkingPlanItem`

```rust
pub enum WorkingItemKind {
    Goal,
    Step,
    ConstraintCheck,
    Reflection,
    HandoffCandidate,
}

pub enum ItemProgress {
    NotStarted,
    Ready,
    InProgress,
    Waiting { reason: SafeReason },
    Blocked { reason: SafeReason },
    Succeeded,
    Failed { reason: SafeReason },
}

pub struct WorkingPlanItem {
    pub item_ref: TypedRef,
    pub kind: WorkingItemKind,
    pub dependency_refs: Vec<TypedRef>,
    pub progress: ItemProgress,
    pub source_ref: SourceReference,
    pub source_version: SourceVersion,
    pub ordering_key: PlanOrderingKey,
}

impl WorkingPlanItem {
    pub fn from_source(item_ref: TypedRef, kind: WorkingItemKind, dependency_refs: Vec<TypedRef>, source_ref: SourceReference, source_version: SourceVersion, ordering_key: PlanOrderingKey) -> Result<Self, DomainError>;
    pub fn validate_dependencies(&self, available: &HashSet<TypedRef>) -> Result<(), DomainError>;
    pub fn apply_progress(&mut self, progress: ItemProgress) -> Result<(), DomainError>;
    pub fn is_candidate(&self) -> bool;
}
```

Method/process body is never a field. `Succeeded` means a Runtime-local verified item fact, not external method completion.

### 4.2 `GoalPlanWorkspace`

```rust
pub enum GoalPlanProgress {
    Created,
    Evaluating,
    Ready,
    Partial,
    Waiting,
    Blocked,
}

pub struct GoalPlanWorkspace {
    pub workspace_id: GoalPlanWorkspaceId,
    pub run_id: RunId,
    pub goal_refs: Vec<TypedRef>,
    pub plan_items: Vec<WorkingPlanItem>,
    pub constraint_refs: Vec<TypedRef>,
    pub progress: GoalPlanProgress,
    pub source_refs: Vec<SourceReference>,
    pub version: WorkspaceVersion,
    pub updated_at: Timestamp,
}

impl GoalPlanWorkspace {
    pub fn create(workspace_id: GoalPlanWorkspaceId, run_id: RunId, goal_refs: Vec<TypedRef>, constraint_refs: Vec<TypedRef>, source_refs: Vec<SourceReference>, now: Timestamp) -> Result<Self, DomainError>;
    pub fn add_item(&mut self, item: WorkingPlanItem, expected: WorkspaceVersion) -> Result<(), DomainError>;
    pub fn next_candidates(&self, cursor: PlanCursor, limit: PageLimit) -> Result<Page<WorkingPlanItem>, DomainError>;
    pub fn record_progress(&mut self, decision: &RunProgressDecision, expected: WorkspaceVersion, now: Timestamp) -> Result<(), DomainError>;
    pub fn reconcile_dependencies(&mut self, available: &HashSet<TypedRef>, expected: WorkspaceVersion) -> Result<DependencyReconciliation, DomainError>;
    pub fn terminal_eligibility(&self, inputs: &DecisionInputs) -> Result<TerminalEligibility, DomainError>;
}
```

Invariant: run-scoped; item refs unique; workspace version increments on mutation; progress cannot be `Ready` while unresolved required dependencies exist; empty goal refs is invalid.

### 4.3 `DecisionInputs` and progress decision

```rust
pub struct DecisionInputs {
    pub current_fact_refs: Vec<TypedRef>,
    pub source_snapshots: Vec<SourceSnapshot>,
    pub constraint_refs: Vec<TypedRef>,
    pub unresolved_effect_refs: Vec<SideEffectMarkerId>,
    pub candidate_page: Page<WorkingPlanItem>,
    pub requested_terminal: bool,
}

pub enum ProgressDisposition {
    Continue,
    WaitForInput,
    Blocked,
    Reflect,
    ProduceAction,
    Delegate,
    PrepareCheckpoint,
    TerminalCandidate,
}

pub struct RunProgressDecision {
    pub decision_id: DecisionId,
    pub run_id: RunId,
    pub workspace_id: GoalPlanWorkspaceId,
    pub disposition: ProgressDisposition,
    pub selected_item_refs: Vec<TypedRef>,
    pub reason: SafeReason,
    pub source_refs: Vec<SourceReference>,
    pub decided_at: Timestamp,
}

impl DecisionInputs {
    pub fn validate_for_run(&self, run: &ControlledRun, workspace: &GoalPlanWorkspace) -> Result<(), DomainError>;
    pub fn has_unknown_source(&self) -> bool;
}
impl RunProgressDecision {
    pub fn decide(run: &ControlledRun, workspace: &GoalPlanWorkspace, inputs: &DecisionInputs, id: DecisionId, now: Timestamp) -> Result<Self, DomainError>;
    pub fn is_terminal(&self) -> bool;
    pub fn to_history_fact(&self, correlation: RuntimeCorrelation) -> Result<RuntimeHistoryEntry, DomainError>;
}
```

Terminal candidate requires explicit policy proof; unknown source/effect or missing dependency changes disposition to `WaitForInput`/`Blocked`, never `TerminalCandidate`.

## 5. History and application carriers

### 5.1 `RuntimeHistoryEntry`

```rust
pub enum RuntimeFactKind {
    Admission,
    Control,
    Progress,
    ContextComposed,
    MemoryUsed,
    ModelTurn,
    ModelDecision,
    ActionGuard,
    ActionAttempt,
    Feedback,
    Delegation,
    Checkpoint,
    Recovery,
    Outcome,
    Handoff,
    Projection,
    Availability,
    Error,
}

pub struct RuntimeHistoryEntry {
    pub entry_id: HistoryEntryId,
    pub run_id: RunId,
    pub sequence: HistorySequence,
    pub fact_kind: RuntimeFactKind,
    pub fact_ref: TypedRef,
    pub causation_ref: Option<TypedRef>,
    pub correlation: RuntimeCorrelation,
    pub source_refs: Vec<SourceReference>,
    pub committed_at: Timestamp,
}

impl RuntimeHistoryEntry {
    pub fn append(entry_id: HistoryEntryId, run_id: RunId, sequence: HistorySequence, fact_kind: RuntimeFactKind, fact_ref: TypedRef, causation_ref: Option<TypedRef>, correlation: RuntimeCorrelation, source_refs: Vec<SourceReference>, committed_at: Timestamp) -> Result<Self, DomainError>;
    pub fn relates_to(&self, correlation: &RuntimeCorrelation) -> bool;
    pub fn validate_append_order(&self, previous: Option<&RuntimeHistoryEntry>) -> Result<(), DomainError>;
}
```

History is append-only; fact body is external/typed ref. Sequence must be strictly monotonic per run; correlation and causation cannot be empty for event-derived facts.

### 5.2 Application carriers

```rust
pub struct GoalPlanRepositoryPortCarrier {
    pub run_id: RunId,
    pub workspace_id: GoalPlanWorkspaceId,
    pub cursor: PlanCursor,
    pub expected_version: WorkspaceVersion,
}

pub struct OperationContext {
    pub metadata: CommandMetadata,
    pub config_snapshot_ref: ConfigSnapshotRef,
    pub expected_versions: HashMap<AggregateId, AggregateVersion>,
    pub uow_ref: UnitOfWorkRef,
}

impl OperationContext {
    pub fn begin(metadata: CommandMetadata, config_snapshot_ref: ConfigSnapshotRef, uow_ref: UnitOfWorkRef) -> Result<Self, ApplicationError>;
    pub fn with_expected_version(&mut self, aggregate: AggregateId, version: AggregateVersion) -> Result<(), ApplicationError>;
    pub fn require_version(&self, aggregate: AggregateId) -> Result<AggregateVersion, ApplicationError>;
}
```

These carriers are not truth owners; they cannot be serialized to public event as aggregate state.

## 6. Step 6.1~6.3 audit

| audit | result |
|---|---|
| every shared value has typed fields and complete functions | pass |
| every enum lists variants and payload semantics | pass |
| run/admission/control objects have version/state/guard/error source | pass |
| goal-plan objects exclude method/process body and prove terminal eligibility | pass |
| history is append-only with sequence/correlation/causation | pass |
| public carrier cannot become domain truth | pass |

```text
next_allowed_action = create_step_06_context_memory_model_batch
```
