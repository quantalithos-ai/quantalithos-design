# L2-runtime Step 6 deep object contracts: context, memory and model

> 状态: done
> 当前 Step: 6
> 批次: 6.4 Context Composition; 6.5 Memory Mediation; 6.6 Provider-neutral Model Decision
> 边界: 只保存 Runtime-owned working state、decision、typed ref 与 safe semantic result；不保存外部正文、provider secret、route、quota、cost 或 hidden reasoning

## 1. External source views

### 1.1 `SourceSnapshot`

```rust
pub struct SourceSnapshot {
    pub snapshot_id: SourceSnapshotId,
    pub source_ref: SourceReference,
    pub captured_version: SourceVersion,
    pub captured_digest: SourceDigest,
    pub completeness: SnapshotCompleteness,
    pub safe_fragment_refs: Vec<SafeFragmentRef>,
    pub redaction: RedactionMarker,
    pub captured_at: Timestamp,
}

pub enum SnapshotCompleteness {
    Complete,
    Partial { missing_refs: Vec<TypedRef>, reason: SafeReason },
    MetadataOnly { reason: SafeReason },
    Rejected { reason: SafeReason },
    Unknown { reason: SafeReason },
}

impl SourceSnapshot {
    pub fn capture(snapshot_id: SourceSnapshotId, source_ref: SourceReference, captured_version: SourceVersion, captured_digest: SourceDigest, completeness: SnapshotCompleteness, safe_fragment_refs: Vec<SafeFragmentRef>, redaction: RedactionMarker, captured_at: Timestamp) -> Result<Self, DomainError>;
    pub fn validate_for_scope(&self, scope: &RuntimeScope) -> Result<(), DomainError>;
    pub fn permits_context_use(&self, requirement: SnapshotRequirement) -> bool;
    pub fn canonical_digest_input(&self) -> BodyFreeCanonicalValue;
}
```

Owner/source: snapshot metadata and use decision are Runtime local; `captured_version`, digest and fragment refs come from `SourceResolverPort`; referenced content stays with Governance, Artifact, Hub, Method Library, memory owner or Observability. A partial, metadata-only or unknown snapshot cannot satisfy a complete-source requirement.

### 1.2 `SourceAvailability`

```rust
pub struct SourceAvailability {
    pub availability_id: SourceAvailabilityId,
    pub source_ref_id: SourceReferenceId,
    pub owner_ref: OwnerRef,
    pub status: AvailabilityStatus,
    pub checked_version: Option<SourceVersion>,
    pub freshness_deadline: Option<Timestamp>,
    pub reason: SafeReason,
    pub observed_at: Timestamp,
    pub version: AvailabilityVersion,
}

pub enum AvailabilityStatus {
    Available,
    Unavailable,
    PendingContract,
    Stale,
    Unknown,
    Degraded,
}

impl SourceAvailability {
    pub fn record(availability_id: SourceAvailabilityId, source: &SourceReference, status: AvailabilityStatus, checked_version: Option<SourceVersion>, freshness_deadline: Option<Timestamp>, reason: SafeReason, observed_at: Timestamp) -> Result<Self, DomainError>;
    pub fn refresh(&mut self, status: AvailabilityStatus, checked_version: Option<SourceVersion>, freshness_deadline: Option<Timestamp>, reason: SafeReason, expected: AvailabilityVersion, observed_at: Timestamp) -> Result<(), DomainError>;
    pub fn satisfies(&self, requirement: FreshnessRequirement, now: Timestamp) -> bool;
    pub fn blocks_positive_use(&self, requirement: FreshnessRequirement, now: Timestamp) -> bool;
}
```

`Available` is limited to a checked source/version/freshness assertion. It is not implementation readiness, external owner health, approval, acceptance or observation evidence. `PendingContract`, `Unknown` and expired freshness fail closed.

## 2. Memory candidate and retrieval objects

### 2.1 `RetrievalRequest`

```rust
pub struct RetrievalRequest {
    pub request_id: MemoryRetrievalRequestId,
    pub run_id: RunId,
    pub scope: RuntimeScope,
    pub kinds: NonEmptyVec<MemoryKind>,
    pub query_ref: SafeQueryRef,
    pub source_constraints: Vec<SourceConstraint>,
    pub freshness: FreshnessRequirement,
    pub ordering: MemoryOrdering,
    pub cursor: Option<MemoryCursor>,
    pub limit: PageLimit,
    pub budget: MemoryBudget,
}

pub enum MemoryKind {
    Working,
    EpisodicReference,
    SemanticReference,
}

pub enum MemoryOrdering {
    RelevanceThenRecency,
    RecencyThenRelevance,
    StableSourceOrder,
}

impl RetrievalRequest {
    pub fn new(request_id: MemoryRetrievalRequestId, run_id: RunId, scope: RuntimeScope, kinds: NonEmptyVec<MemoryKind>, query_ref: SafeQueryRef, source_constraints: Vec<SourceConstraint>, freshness: FreshnessRequirement, ordering: MemoryOrdering, cursor: Option<MemoryCursor>, limit: PageLimit, budget: MemoryBudget) -> Result<Self, DomainError>;
    pub fn validate_budget(&self) -> Result<(), DomainError>;
    pub fn validate_cursor(&self) -> Result<(), DomainError>;
    pub fn canonical_digest_input(&self) -> BodyFreeCanonicalValue;
}
```

`SafeQueryRef` identifies an externally owned query/embedding/search input without storing prompt or raw query body. Episodic and semantic kinds request references only; positive retrieval stays blocked under `L2R-UP-005` until an owner contract exists.

### 2.2 `MemoryCandidate`

```rust
pub struct MemoryCandidate {
    pub candidate_id: MemoryCandidateId,
    pub run_id: RunId,
    pub kind: MemoryKind,
    pub entry_ref: TypedRef,
    pub source_ref: SourceReference,
    pub snapshot_ref: SourceSnapshotId,
    pub eligibility: MemoryEligibility,
    pub rank: CandidateRank,
    pub score: Option<BoundedScore>,
    pub estimated_weight: ContextWeight,
    pub ordering_key: MemoryOrderingKey,
}

pub enum MemoryEligibility {
    Eligible,
    ExcludedByScope { reason: SafeReason },
    ExcludedByFreshness { reason: SafeReason },
    ExcludedByBudget { reason: SafeReason },
    ExcludedByPolicy { reason: SafeReason },
    PendingSource { reason: SafeReason },
    Unknown { reason: SafeReason },
}

impl MemoryCandidate {
    pub fn from_snapshot(candidate_id: MemoryCandidateId, run_id: RunId, kind: MemoryKind, entry_ref: TypedRef, snapshot: &SourceSnapshot, eligibility: MemoryEligibility, rank: CandidateRank, score: Option<BoundedScore>, estimated_weight: ContextWeight, ordering_key: MemoryOrderingKey) -> Result<Self, DomainError>;
    pub fn validate_scope(&self, scope: &RuntimeScope) -> Result<(), DomainError>;
    pub fn is_eligible(&self) -> bool;
    pub fn can_fit(&self, remaining: ContextWeight) -> bool;
    pub fn to_context_segment(&self, segment_id: ContextSegmentId) -> Result<ContextSegment, DomainError>;
}
```

Candidate rank/score is a selection hint, not an authority or truth score. Duplicate `entry_ref + captured_version` candidates collapse before composition; unknown or pending candidates cannot be silently downgraded to eligible.

## 3. Context composition objects

### 3.1 `ContextBudget` and `ContextSegment`

```rust
pub struct ContextBudget {
    pub max_weight: ContextWeight,
    pub reserved_instruction_weight: ContextWeight,
    pub reserved_result_weight: ContextWeight,
    pub per_source_max_weight: Option<ContextWeight>,
    pub max_segments: SegmentCount,
}

pub struct ContextSegment {
    pub segment_id: ContextSegmentId,
    pub segment_ref: SafeFragmentRef,
    pub source_ref: SourceReference,
    pub source_version: SourceVersion,
    pub kind: ContextSegmentKind,
    pub weight: ContextWeight,
    pub ordering_key: ContextOrderingKey,
    pub redaction: RedactionMarker,
}

pub enum ContextSegmentKind {
    GoalReference,
    ConstraintReference,
    WorkingFactReference,
    EpisodicReference,
    SemanticReference,
    ToolFeedbackReference,
    ChildResultReference,
    RecoveryReference,
}

impl ContextBudget {
    pub fn validate(&self) -> Result<(), DomainError>;
    pub fn usable_weight(&self) -> Result<ContextWeight, DomainError>;
    pub fn permits(&self, used: ContextWeight, candidate: ContextWeight, source_used: ContextWeight, segment_count: SegmentCount) -> bool;
}

impl ContextSegment {
    pub fn new(segment_id: ContextSegmentId, segment_ref: SafeFragmentRef, source_ref: SourceReference, source_version: SourceVersion, kind: ContextSegmentKind, weight: ContextWeight, ordering_key: ContextOrderingKey, redaction: RedactionMarker) -> Result<Self, DomainError>;
    pub fn validate_source_snapshot(&self, snapshot: &SourceSnapshot) -> Result<(), DomainError>;
    pub fn canonical_digest_input(&self) -> BodyFreeCanonicalValue;
}
```

Weight is a provider-neutral bounded unit. It cannot be presented as provider token quota, billing or route capacity.

### 3.2 `ContextCompositionDecision`

```rust
pub struct ContextCompositionDecision {
    pub decision_id: DecisionId,
    pub run_id: RunId,
    pub selected: Vec<SelectedContextCandidate>,
    pub excluded: Vec<ExcludedContextCandidate>,
    pub budget: ContextBudget,
    pub used_weight: ContextWeight,
    pub disposition: CompositionDisposition,
    pub reason: SafeReason,
    pub source_refs: Vec<SourceReference>,
    pub decided_at: Timestamp,
}

pub struct SelectedContextCandidate {
    pub candidate_ref: TypedRef,
    pub segment_id: ContextSegmentId,
    pub source_ref_id: SourceReferenceId,
    pub source_version: SourceVersion,
    pub weight: ContextWeight,
    pub position: SegmentPosition,
}

pub struct ExcludedContextCandidate {
    pub candidate_ref: TypedRef,
    pub disposition: ExclusionDisposition,
    pub reason: SafeReason,
}

pub enum ExclusionDisposition {
    ScopeMismatch,
    SourceUnavailable,
    SourceStale,
    BudgetExceeded,
    Duplicate,
    PolicyDenied,
    UnsafeBody,
    Unknown,
}

pub enum CompositionDisposition {
    Accepted,
    Partial,
    Blocked,
    Rejected,
    Unknown,
}

impl ContextCompositionDecision {
    pub fn decide(decision_id: DecisionId, run_id: RunId, candidates: NonEmptyVec<MemoryCandidate>, mandatory_segments: Vec<ContextSegment>, budget: ContextBudget, policy: &ContextCompositionPolicy, now: Timestamp) -> Result<Self, DomainError>;
    pub fn permits_assembly(&self) -> bool;
    pub fn selected_segment_ids(&self) -> Vec<ContextSegmentId>;
    pub fn validate_sources(&self, snapshots: &HashMap<SourceSnapshotId, SourceSnapshot>) -> Result<(), DomainError>;
    pub fn to_history_fact(&self, correlation: RuntimeCorrelation) -> Result<RuntimeHistoryEntry, DomainError>;
}
```

Mandatory segment failure yields `Blocked` or `Rejected`; `Partial` is legal only when policy marks omitted sources optional. Stable ordering is `mandatory class -> explicit position -> source/version/ref tie-breaker`.

### 3.3 `WorkingContext`

```rust
pub struct WorkingContext {
    pub context_id: WorkingContextId,
    pub run_id: RunId,
    pub composition_id: DecisionId,
    pub segments: NonEmptyVec<ContextSegment>,
    pub budget: ContextBudget,
    pub total_weight: ContextWeight,
    pub source_refs: Vec<SourceReference>,
    pub digest: ContextDigest,
    pub status: WorkingContextStatus,
    pub version: ContextVersion,
    pub created_at: Timestamp,
    pub frozen_at: Option<Timestamp>,
}

pub enum WorkingContextStatus {
    Assembled,
    Frozen,
    Rejected { reason: SafeReason },
    Expired { reason: SafeReason },
    Degraded { reason: SafeReason },
}

impl WorkingContext {
    pub fn assemble(context_id: WorkingContextId, decision: &ContextCompositionDecision, segments: NonEmptyVec<ContextSegment>, digest: ContextDigest, now: Timestamp) -> Result<Self, DomainError>;
    pub fn freeze(&mut self, expected: ContextVersion, now: Timestamp) -> Result<(), DomainError>;
    pub fn expire(&mut self, reason: SafeReason, expected: ContextVersion, now: Timestamp) -> Result<(), DomainError>;
    pub fn mark_degraded(&mut self, reason: SafeReason, expected: ContextVersion) -> Result<(), DomainError>;
    pub fn contains(&self, segment_id: ContextSegmentId) -> bool;
    pub fn references(&self, source_ref_id: SourceReferenceId) -> bool;
    pub fn is_usable_for_model(&self) -> bool;
}
```

Only `Frozen` is model-input eligible. A frozen context never mutates in place; changed sources require a new composition decision and new context identity.

## 4. Working memory objects

### 4.1 `WorkingMemoryEntry`

```rust
pub struct WorkingMemoryEntry {
    pub entry_id: WorkingMemoryEntryId,
    pub entry_ref: TypedRef,
    pub kind: WorkingMemoryEntryKind,
    pub source_ref: SourceReference,
    pub source_version: SourceVersion,
    pub incorporated_by: DecisionId,
    pub ordering_key: MemoryOrderingKey,
    pub status: WorkingMemoryEntryStatus,
}

pub enum WorkingMemoryEntryKind {
    GoalFact,
    ProgressFact,
    ModelDecision,
    ActionFeedback,
    ChildResult,
    RecoveryFact,
    ExternalCandidate,
}

pub enum WorkingMemoryEntryStatus {
    Active,
    Superseded { replacement_ref: TypedRef },
    Excluded { reason: SafeReason },
    SourceStale { reason: SafeReason },
}

impl WorkingMemoryEntry {
    pub fn from_candidate(entry_id: WorkingMemoryEntryId, candidate: &MemoryCandidate, incorporated_by: DecisionId) -> Result<Self, DomainError>;
    pub fn supersede(&mut self, replacement_ref: TypedRef) -> Result<(), DomainError>;
    pub fn exclude(&mut self, reason: SafeReason) -> Result<(), DomainError>;
    pub fn is_active(&self) -> bool;
}
```

### 4.2 `WorkingMemory`

```rust
pub struct WorkingMemory {
    pub memory_id: WorkingMemoryId,
    pub run_id: RunId,
    pub entries: Vec<WorkingMemoryEntry>,
    pub window_version: MemoryWindowVersion,
    pub source_refs: Vec<SourceReference>,
    pub status: WorkingMemoryStatus,
    pub digest: MemoryWindowDigest,
    pub updated_at: Timestamp,
}

pub enum WorkingMemoryStatus {
    Open,
    Compacting { decision_id: DecisionId },
    Frozen,
    Degraded { reason: SafeReason },
}

impl WorkingMemory {
    pub fn create(memory_id: WorkingMemoryId, run_id: RunId, digest: MemoryWindowDigest, now: Timestamp) -> Result<Self, DomainError>;
    pub fn add(&mut self, entry: WorkingMemoryEntry, expected: MemoryWindowVersion, digest: MemoryWindowDigest, now: Timestamp) -> Result<(), DomainError>;
    pub fn begin_compaction(&mut self, decision_id: DecisionId, expected: MemoryWindowVersion) -> Result<(), DomainError>;
    pub fn apply_compaction(&mut self, decision: &CompactionDecision, expected: MemoryWindowVersion, digest: MemoryWindowDigest, now: Timestamp) -> Result<(), DomainError>;
    pub fn freeze(&mut self, expected: MemoryWindowVersion) -> Result<(), DomainError>;
    pub fn mark_degraded(&mut self, reason: SafeReason, expected: MemoryWindowVersion) -> Result<(), DomainError>;
    pub fn contains_ref(&self, entry_ref: &TypedRef) -> bool;
    pub fn active_entries(&self) -> Vec<&WorkingMemoryEntry>;
}
```

Working memory is the only memory body-equivalent state Runtime owns, and even it stores typed refs rather than durable episodic/semantic content. Window mutation is optimistic-versioned; compaction never deletes source history.

### 4.3 `CompactionDecision` and `MemoryUseRecord`

```rust
pub struct CompactionDecision {
    pub decision_id: DecisionId,
    pub run_id: RunId,
    pub input_window_version: MemoryWindowVersion,
    pub retained_entry_ids: Vec<WorkingMemoryEntryId>,
    pub superseded_entry_ids: Vec<WorkingMemoryEntryId>,
    pub excluded_entry_ids: Vec<WorkingMemoryEntryId>,
    pub reason: SafeReason,
    pub source_refs: Vec<SourceReference>,
    pub decided_at: Timestamp,
}

pub struct MemoryUseRecord {
    pub use_id: MemoryUseId,
    pub run_id: RunId,
    pub candidate_id: MemoryCandidateId,
    pub candidate_ref: TypedRef,
    pub source_ref: SourceReference,
    pub decision_id: DecisionId,
    pub context_id: WorkingContextId,
    pub disposition: MemoryUseDisposition,
    pub recorded_at: Timestamp,
}

pub enum MemoryUseDisposition {
    Incorporated,
    ExcludedByBudget,
    ExcludedByScope,
    ExcludedByFreshness,
    Duplicate,
    PendingSource,
    RejectedUnsafe,
}

impl CompactionDecision {
    pub fn decide(decision_id: DecisionId, memory: &WorkingMemory, policy: &MemoryCompactionPolicy, now: Timestamp) -> Result<Self, DomainError>;
    pub fn validate_partition(&self, memory: &WorkingMemory) -> Result<(), DomainError>;
}

impl MemoryUseRecord {
    pub fn record(use_id: MemoryUseId, candidate: &MemoryCandidate, decision: &ContextCompositionDecision, context_id: WorkingContextId, disposition: MemoryUseDisposition, now: Timestamp) -> Result<Self, DomainError>;
    pub fn is_incorporated(&self) -> bool;
    pub fn idempotency_identity(&self) -> MemoryUseIdentity;
}
```

Every candidate considered by an accepted/partial composition receives one disposition. `MemoryUseIdentity = run_id + candidate_id + decision_id`; replay cannot create a second record.

## 5. Provider-neutral model objects

### 5.1 `ModelIntent`

```rust
pub struct ModelIntent {
    pub intent_id: ModelIntentId,
    pub run_id: RunId,
    pub purpose: ModelPurpose,
    pub logical_selection: LogicalModelSelection,
    pub context_id: WorkingContextId,
    pub context_digest: ContextDigest,
    pub response_contract_ref: ResponseContractRef,
    pub budget: ModelDecisionBudget,
    pub source_refs: Vec<SourceReference>,
    pub created_at: Timestamp,
}

pub enum ModelPurpose {
    SelectNextStep,
    ClassifyFeedback,
    ProposeAction,
    ComposeDelegation,
    Reflect,
    Recover,
    SummarizeSafeOutcome,
}

pub struct LogicalModelSelection {
    pub capability_class: ModelCapabilityClass,
    pub quality_tier: LogicalQualityTier,
    pub latency_class: LogicalLatencyClass,
    pub data_boundary: ModelDataBoundary,
}

impl ModelIntent {
    pub fn create(intent_id: ModelIntentId, run_id: RunId, purpose: ModelPurpose, logical_selection: LogicalModelSelection, context: &WorkingContext, response_contract_ref: ResponseContractRef, budget: ModelDecisionBudget, source_refs: Vec<SourceReference>, now: Timestamp) -> Result<Self, DomainError>;
    pub fn validate_context(&self, context: &WorkingContext) -> Result<(), DomainError>;
    pub fn canonical_digest_input(&self) -> BodyFreeCanonicalValue;
}

impl LogicalModelSelection {
    pub fn validate(&self) -> Result<(), DomainError>;
    pub fn compatible_with(&self, availability: &ModelAdapterAvailability) -> bool;
}
```

Logical selection contains no provider, model product name, endpoint, route, secret, quota, price or billing owner. Those remain outside Runtime under `L2R-UP-004`.

### 5.2 `ModelTurn`

```rust
pub struct ModelTurn {
    pub turn_id: ModelTurnId,
    pub run_id: RunId,
    pub intent_id: ModelIntentId,
    pub context_id: WorkingContextId,
    pub context_digest: ContextDigest,
    pub status: ModelTurnStatus,
    pub submission_ref: Option<ModelSubmissionRef>,
    pub result_ref: Option<ModelSemanticResultRef>,
    pub decision_id: Option<DecisionId>,
    pub version: ModelTurnVersion,
    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}

pub enum ModelTurnStatus {
    Pending,
    SubmissionCandidate,
    Submitted,
    Classified { decision_id: DecisionId },
    Failed { reason: SafeReason },
    Blocked { reason: SafeReason },
    Unknown { fence: FenceRef },
}

impl ModelTurn {
    pub fn start(turn_id: ModelTurnId, intent: &ModelIntent, context: &WorkingContext, now: Timestamp) -> Result<Self, DomainError>;
    pub fn mark_submission_candidate(&mut self, expected: ModelTurnVersion, now: Timestamp) -> Result<(), DomainError>;
    pub fn mark_submitted(&mut self, submission_ref: ModelSubmissionRef, expected: ModelTurnVersion, now: Timestamp) -> Result<(), DomainError>;
    pub fn classify(&mut self, result_ref: ModelSemanticResultRef, decision_id: DecisionId, expected: ModelTurnVersion, now: Timestamp) -> Result<(), DomainError>;
    pub fn fail(&mut self, reason: SafeReason, expected: ModelTurnVersion, now: Timestamp) -> Result<(), DomainError>;
    pub fn block(&mut self, reason: SafeReason, expected: ModelTurnVersion, now: Timestamp) -> Result<(), DomainError>;
    pub fn mark_unknown(&mut self, fence: FenceRef, expected: ModelTurnVersion, now: Timestamp) -> Result<(), DomainError>;
    pub fn accepts_result(&self, submission_ref: &ModelSubmissionRef) -> bool;
}
```

The local turn and intent are committed before external submission. Timeout after submission without a stable result becomes `Unknown`; it is not an ordinary retry permission.

### 5.3 `ModelSubmission` and `ModelSemanticResult`

```rust
pub struct ModelSubmission {
    pub submission_ref: ModelSubmissionRef,
    pub turn_id: ModelTurnId,
    pub adapter_ref: AdapterRef,
    pub request_digest: RequestDigest,
    pub disposition: ModelSubmissionDisposition,
    pub accepted_at: Option<Timestamp>,
    pub reason: Option<SafeReason>,
}

pub enum ModelSubmissionDisposition {
    Candidate,
    AcceptedByAdapter,
    RejectedByAdapter,
    PendingContract,
    Unknown,
}

pub struct ModelSemanticResult {
    pub result_ref: ModelSemanticResultRef,
    pub submission_ref: ModelSubmissionRef,
    pub turn_id: ModelTurnId,
    pub disposition: ModelSemanticDisposition,
    pub candidate_refs: Vec<TypedRef>,
    pub requested_input_refs: Vec<TypedRef>,
    pub safe_reason: SafeReason,
    pub source_ref: SourceReference,
    pub schema_version: SchemaVersion,
    pub occurred_at: Timestamp,
}

pub enum ModelSemanticDisposition {
    ProposeAction,
    AskForInput,
    Reflect,
    Recover,
    Delegate,
    Stop,
    Blocked,
    Failed,
}

impl ModelSubmission {
    pub fn validate_for_turn(&self, turn: &ModelTurn) -> Result<(), DomainError>;
    pub fn indicates_execution_success(&self) -> bool;
}

impl ModelSemanticResult {
    pub fn validate_for_turn(&self, turn: &ModelTurn) -> Result<(), DomainError>;
    pub fn validate_body_free(&self) -> Result<(), DomainError>;
    pub fn canonical_digest_input(&self) -> BodyFreeCanonicalValue;
}
```

`indicates_execution_success()` always returns false; adapter acceptance means only that the adapter seam accepted a submission. Raw output and hidden rationale cannot be fields of `ModelSemanticResult`.

### 5.4 `ModelDecision` and safe summary

```rust
pub struct ModelDecision {
    pub decision_id: DecisionId,
    pub run_id: RunId,
    pub turn_id: ModelTurnId,
    pub result_ref: ModelSemanticResultRef,
    pub disposition: ModelDisposition,
    pub candidate_refs: Vec<TypedRef>,
    pub reason: SafeReason,
    pub source_refs: Vec<SourceReference>,
    pub decided_at: Timestamp,
}

pub enum ModelDisposition {
    ProposeAction { candidate_refs: NonEmptyVec<TypedRef> },
    AskForInput { input_refs: NonEmptyVec<TypedRef> },
    Reflect { reflection_ref: TypedRef },
    Recover { recovery_ref: TypedRef },
    Delegate { candidate_refs: NonEmptyVec<TypedRef> },
    Stop { outcome_candidate_ref: TypedRef },
    Blocked { reason: SafeReason },
    Failed { reason: SafeReason },
}

pub struct SafeDecisionSummary {
    pub summary_id: SafeDecisionSummaryId,
    pub decision_id: DecisionId,
    pub turn_id: ModelTurnId,
    pub category: SafeDecisionCategory,
    pub candidate_refs: Vec<TypedRef>,
    pub reason: SafeReason,
    pub redaction: RedactionMarker,
    pub source_refs: Vec<SourceReference>,
}

impl ModelDecision {
    pub fn from_semantic_result(decision_id: DecisionId, run_id: RunId, turn: &ModelTurn, result: &ModelSemanticResult, now: Timestamp) -> Result<Self, DomainError>;
    pub fn permits_action_proposal(&self) -> bool;
    pub fn permits_delegation_proposal(&self) -> bool;
    pub fn to_safe_summary(&self, summary_id: SafeDecisionSummaryId, redaction: RedactionMarker) -> Result<SafeDecisionSummary, DomainError>;
    pub fn to_history_fact(&self, correlation: RuntimeCorrelation) -> Result<RuntimeHistoryEntry, DomainError>;
}

impl SafeDecisionSummary {
    pub fn validate_body_free(&self) -> Result<(), DomainError>;
    pub fn visible_under(&self, scope: &ReadScope) -> bool;
}
```

Only finite semantic variants cross from adapter result to Runtime decision. A decision never implies an action has passed governance, capability, tool or sandbox guards.

### 5.5 `ModelAdapterAvailability`

```rust
pub struct ModelAdapterAvailability {
    pub adapter_ref: AdapterRef,
    pub status: AdapterAvailabilityState,
    pub supported_capability_classes: Vec<ModelCapabilityClass>,
    pub supported_data_boundaries: Vec<ModelDataBoundary>,
    pub contract_version: Option<SchemaVersion>,
    pub reason: SafeReason,
    pub checked_at: Timestamp,
}

pub enum AdapterAvailabilityState {
    Unconfigured,
    PendingContract,
    Blocked,
    Unavailable,
    Degraded,
    Candidate,
}

impl ModelAdapterAvailability {
    pub fn record(adapter_ref: AdapterRef, status: AdapterAvailabilityState, supported_capability_classes: Vec<ModelCapabilityClass>, supported_data_boundaries: Vec<ModelDataBoundary>, contract_version: Option<SchemaVersion>, reason: SafeReason, checked_at: Timestamp) -> Result<Self, DomainError>;
    pub fn supports(&self, selection: &LogicalModelSelection) -> bool;
    pub fn permits_submission_candidate(&self) -> bool;
}
```

There is intentionally no `Ready` variant. `Candidate` permits an application-level submission attempt only after configuration and qualification gates defined later; design existence cannot produce it at runtime.

## 6. Source and ownership audit

| Object | Runtime-owned fields | External input fields | Forbidden fields | Protocol / Flow / state / test anchor |
|---|---|---|---|---|
| `SourceSnapshot` | snapshot identity, completeness, captured metadata | owner/version/digest/safe fragment refs | external body, approval, observed proof | `CaptureSourceSnapshot`; source consumer; snapshot completeness; partial/unknown tests |
| `SourceAvailability` | local availability record/version | checked source version/freshness | owner readiness claim | source Query/Event/refresh job; availability state; expired tests |
| `RetrievalRequest` | run/scope/query ref/budget | memory owner response cursor | raw query/prompt | `ResolveMemoryCandidates`; retrieval Flow; cursor/budget tests |
| `MemoryCandidate` | eligibility/use hint | typed memory/source/snapshot refs | durable memory body | resolve/compose; memory candidate state; stale/scope tests |
| `ContextCompositionDecision` | selection/exclusion/ordering/reason | source snapshots/candidates | hidden reasoning | `ComposeWorkingContext`; composition state; mandatory-source tests |
| `WorkingContext` | ordered refs/digest/status/version | safe fragment/source refs | prompt/provider request | model-start Flow; context state; immutability/budget tests |
| `WorkingMemory` | run window/ref order/version | safe entry/source refs | episodic/semantic body, owner retention | `RecordWorkingMemory`; memory state; version/compaction tests |
| `MemoryUseRecord` | immutable use fact | candidate/source refs | retrieved body | compose transaction; idempotency tests |
| `ModelIntent` | logical purpose/selection/context binding | response contract ref | provider/model route/secret/quota/cost | `StartModelTurn`; turn state; selection-boundary tests |
| `ModelTurn` | local lifecycle/version/fence | submission/result refs | raw request/response | start/result consumer; turn state; late/unknown tests |
| `ModelSemanticResult` | no authority; validated adapter input | finite disposition and safe refs | raw output/hidden reasoning | model event; classify Flow; schema/body-free tests |
| `ModelDecision` | finite local decision | semantic result ref | provider truth/action authorization | `ClassifyModelResult`; decision event; mapping tests |
| `SafeDecisionSummary` | safe projection identity | decision/source refs | raw output | model query/outbound; visibility tests |
| `ModelAdapterAvailability` | local checked marker | adapter contract/capability declaration | readiness evidence/provider route | builder/model flow; availability state; pending tests |

## 7. Batch gate

| Check | Result |
|---|---|
| Source, context, memory and model public/domain objects have typed fields | pass |
| Every enum variant and payload is explicit | pass |
| Every object has construction/mutation/query signatures and error type | pass |
| Working memory is separated from durable episodic/semantic owner truth | pass |
| Model intent/result remain provider-neutral and body-free | pass |
| Unknown/pending/stale paths fail closed | pass |
| Protocol, Flow, state and test anchors are named per object | pass |

```text
next_allowed_action = create_step_06_action_delegation_feedback_batch
```
