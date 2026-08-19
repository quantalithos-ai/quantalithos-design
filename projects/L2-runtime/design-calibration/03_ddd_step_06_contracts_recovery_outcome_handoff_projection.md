# L2-runtime Step 6 deep object contracts: checkpoint, recovery, outcome, handoff and projection

> 状态: done
> 当前 Step: 6
> 批次: 6.10 Checkpoint; 6.11 Recovery & Outcome; 6.12 Handoff & Projection
> 持续门禁: `L2R-CP-001`, `L2R-UP-002`, `L2R-UP-006`, `L2R-UP-007`; physical commit/delivery/observed/acceptance are not positive facts until their owner contracts close

## 1. Stable-state and effect-fence inputs

### 1.1 `StableStateCandidate`

```rust
pub struct StableStateCandidate {
    pub candidate_id: StableStateCandidateId,
    pub run_id: RunId,
    pub run_version: RunVersion,
    pub workspace_id: GoalPlanWorkspaceId,
    pub workspace_version: WorkspaceVersion,
    pub working_memory_id: WorkingMemoryId,
    pub memory_window_version: MemoryWindowVersion,
    pub frozen_context_id: Option<WorkingContextId>,
    pub latest_history_sequence: HistorySequence,
    pub current_decision_refs: StableDecisionRefs,
    pub unresolved_effect_refs: Vec<SideEffectMarkerId>,
    pub source_versions: SourceVersionSet,
    pub candidate_digest: StableStateDigest,
    pub captured_at: Timestamp,
}

pub struct StableDecisionRefs {
    pub progress_decision_id: DecisionId,
    pub model_decision_id: Option<DecisionId>,
    pub action_decision_id: Option<ActionDecisionId>,
    pub reflection_decision_id: Option<ReflectionDecisionId>,
    pub recovery_decision_id: Option<RecoveryDecisionId>,
}

impl StableStateCandidate {
    pub fn capture(candidate_id: StableStateCandidateId, run: &ControlledRun, workspace: &GoalPlanWorkspace, memory: &WorkingMemory, frozen_context_id: Option<WorkingContextId>, latest_history_sequence: HistorySequence, current_decision_refs: StableDecisionRefs, unresolved_effect_refs: Vec<SideEffectMarkerId>, source_versions: SourceVersionSet, candidate_digest: StableStateDigest, now: Timestamp) -> Result<Self, DomainError>;
    pub fn validate_versions(&self, current: &AggregateVersionSet) -> Result<(), DomainError>;
    pub fn validate_history_anchor(&self, latest: &RuntimeHistoryEntry) -> Result<(), DomainError>;
    pub fn permits_prepare(&self, fence: &EffectFenceSummary) -> bool;
    pub fn canonical_digest_input(&self) -> BodyFreeCanonicalValue;
}
```

The candidate contains only stable identities, versions and digests. It never serializes working/model/tool/method/artifact body. Any unresolved unknown or irreversible effect prevents a stable-positive checkpoint.

### 1.2 `EffectFenceSummary`

```rust
pub struct EffectFenceSummary {
    pub run_id: RunId,
    pub resolved_marker_ids: Vec<SideEffectMarkerId>,
    pub unresolved_marker_ids: Vec<SideEffectMarkerId>,
    pub unknown_marker_ids: Vec<SideEffectMarkerId>,
    pub irreversible_marker_ids: Vec<SideEffectMarkerId>,
    pub disposition: EffectFenceDisposition,
    pub computed_from_history_sequence: HistorySequence,
    pub digest: EffectFenceDigest,
}

pub enum EffectFenceDisposition {
    Closed,
    Open,
    Unknown,
    ManualReviewRequired,
}

impl EffectFenceSummary {
    pub fn compute(run_id: RunId, markers: &[SideEffectMarker], history_sequence: HistorySequence, digest: EffectFenceDigest) -> Result<Self, DomainError>;
    pub fn permits_checkpoint(&self) -> bool;
    pub fn permits_resume(&self) -> bool;
    pub fn permits_restart(&self) -> bool;
    pub fn contains(&self, marker_id: SideEffectMarkerId) -> bool;
}
```

`Closed` requires every relevant marker to be resolved or cancelled before submit. Unknown or irreversible unresolved effects force manual review or waiting; a process restart cannot recompute them as closed without new facts.

## 2. Checkpoint objects

### 2.1 `RuntimeCheckpoint`

```rust
pub struct RuntimeCheckpoint {
    pub checkpoint_id: CheckpointId,
    pub run_id: RunId,
    pub candidate_id: StableStateCandidateId,
    pub stable_refs: StableCheckpointRefs,
    pub source_versions: SourceVersionSet,
    pub effect_fence_digest: EffectFenceDigest,
    pub state_digest: StableStateDigest,
    pub history_sequence: HistorySequence,
    pub status: CheckpointStatus,
    pub commit_ref: Option<CheckpointCommitRef>,
    pub version: CheckpointVersion,
    pub prepared_at: Timestamp,
    pub updated_at: Timestamp,
}

pub struct StableCheckpointRefs {
    pub run_ref: VersionedRunRef,
    pub workspace_ref: VersionedWorkspaceRef,
    pub memory_ref: VersionedMemoryWindowRef,
    pub context_ref: Option<VersionedContextRef>,
    pub decision_refs: StableDecisionRefs,
}

pub enum CheckpointStatus {
    Preparing,
    Prepared,
    CommitPending,
    Committed { commit_ref: CheckpointCommitRef },
    Invalid { reason: SafeReason },
    CommitUnknown { fence_ref: FenceRef },
    Superseded { replacement_id: CheckpointId },
}

impl RuntimeCheckpoint {
    pub fn prepare(checkpoint_id: CheckpointId, candidate: &StableStateCandidate, fence: &EffectFenceSummary, stable_refs: StableCheckpointRefs, now: Timestamp) -> Result<Self, DomainError>;
    pub fn mark_prepared(&mut self, expected: CheckpointVersion, now: Timestamp) -> Result<(), DomainError>;
    pub fn mark_commit_pending(&mut self, expected: CheckpointVersion, now: Timestamp) -> Result<(), DomainError>;
    pub fn mark_committed(&mut self, receipt: &CheckpointCommitReceipt, expected: CheckpointVersion, now: Timestamp) -> Result<(), DomainError>;
    pub fn invalidate(&mut self, reason: SafeReason, expected: CheckpointVersion, now: Timestamp) -> Result<(), DomainError>;
    pub fn mark_commit_unknown(&mut self, fence_ref: FenceRef, expected: CheckpointVersion, now: Timestamp) -> Result<(), DomainError>;
    pub fn supersede(&mut self, replacement_id: CheckpointId, expected: CheckpointVersion, now: Timestamp) -> Result<(), DomainError>;
    pub fn is_stable(&self) -> bool;
    pub fn permits_resume(&self, fence: &EffectFenceSummary) -> bool;
    pub fn to_history_fact(&self, correlation: RuntimeCorrelation) -> Result<RuntimeHistoryEntry, DomainError>;
}
```

Only `Committed` is stable. `Prepared`, `CommitPending` and a repository call success are insufficient. `CommitUnknown` cannot be superseded or retried automatically until a physical reconciliation contract exists.

### 2.2 Checkpoint commit protocol values

```rust
pub struct CheckpointCommitRequest {
    pub checkpoint_id: CheckpointId,
    pub checkpoint_version: CheckpointVersion,
    pub state_digest: StableStateDigest,
    pub expected_versions: AggregateVersionSet,
    pub idempotency_key: IdempotencyKey,
    pub request_digest: RequestDigest,
    pub correlation: RuntimeCorrelation,
}

pub struct CheckpointCommitReceipt {
    pub checkpoint_id: CheckpointId,
    pub disposition: CheckpointCommitDisposition,
    pub commit_ref: Option<CheckpointCommitRef>,
    pub committed_digest: Option<StableStateDigest>,
    pub committed_at: Option<Timestamp>,
    pub reason: Option<SafeReason>,
}

pub enum CheckpointCommitDisposition {
    Committed,
    Rejected,
    Conflict,
    Unknown,
    ContractPending,
}

impl CheckpointCommitRequest {
    pub fn from_checkpoint(checkpoint: &RuntimeCheckpoint, expected_versions: AggregateVersionSet, idempotency_key: IdempotencyKey, request_digest: RequestDigest, correlation: RuntimeCorrelation) -> Result<Self, DomainError>;
    pub fn canonical_digest_input(&self) -> BodyFreeCanonicalValue;
}

impl CheckpointCommitReceipt {
    pub fn validate_for(&self, request: &CheckpointCommitRequest) -> Result<(), DomainError>;
    pub fn proves_commit(&self) -> bool;
}
```

`proves_commit()` is true only for `Committed` with matching checkpoint ID, digest and non-empty commit ref. `L2R-CP-001` leaves the physical production/atomicity of this receipt blocked; the type does not claim an implementation.

## 3. Recovery objects

### 3.1 `RecoveryInputs`

```rust
pub struct RecoveryInputs {
    pub run_id: RunId,
    pub trigger: RecoveryTrigger,
    pub requested_mode: RecoveryRequestMode,
    pub checkpoint: Option<RuntimeCheckpoint>,
    pub effect_fence: EffectFenceSummary,
    pub current_versions: AggregateVersionSet,
    pub source_availability: Vec<SourceAvailability>,
    pub lease_ref: Option<LeaseRef>,
    pub prior_recovery_ref: Option<RecoveryDecisionId>,
}

pub enum RecoveryTrigger {
    ExplicitCommand { actor_ref: ActorRef },
    ProcessRestart { process_instance_ref: ProcessInstanceRef },
    CommitUnknown { fence_ref: FenceRef },
    SideEffectUnknown { marker_id: SideEffectMarkerId },
    ProgressStalled { decision_id: DecisionId },
    ScheduledContinuation { job_id: JobId },
}

pub enum RecoveryRequestMode {
    Resume,
    RestartFromStable,
    ReconcileOnly,
    Cancel,
    ManualReview,
}

impl RecoveryInputs {
    pub fn validate_for(&self, run: &ControlledRun) -> Result<(), DomainError>;
    pub fn stable_checkpoint(&self) -> Option<&RuntimeCheckpoint>;
    pub fn has_current_lease(&self) -> bool;
    pub fn has_unknown_fence(&self) -> bool;
}
```

Process restart is only a trigger, never proof that the prior operation failed or did not commit.

### 3.2 `RecoveryDecision`

```rust
pub struct RecoveryDecision {
    pub decision_id: RecoveryDecisionId,
    pub run_id: RunId,
    pub disposition: RecoveryDisposition,
    pub checkpoint_id: Option<CheckpointId>,
    pub expected_versions: AggregateVersionSet,
    pub effect_fence_digest: EffectFenceDigest,
    pub reason: SafeReason,
    pub source_refs: Vec<SourceReference>,
    pub supersedes: Option<RecoveryDecisionId>,
    pub decided_at: Timestamp,
}

pub enum RecoveryDisposition {
    Resume { checkpoint_id: CheckpointId },
    RestartFromStable { checkpoint_id: CheckpointId },
    ReconcileOnly { fence_ref: FenceRef },
    WaitForFact { source_refs: NonEmptyVec<SourceReference> },
    Blocked { reason: SafeReason },
    Cancel { reason: SafeReason },
    ManualReview { fence_ref: FenceRef },
}

impl RecoveryDecision {
    pub fn decide(decision_id: RecoveryDecisionId, run: &ControlledRun, inputs: &RecoveryInputs, source_refs: Vec<SourceReference>, now: Timestamp) -> Result<Self, DomainError>;
    pub fn supersede(decision_id: RecoveryDecisionId, prior: &RecoveryDecision, run: &ControlledRun, inputs: &RecoveryInputs, source_refs: Vec<SourceReference>, now: Timestamp) -> Result<Self, DomainError>;
    pub fn permits_resume(&self, checkpoint: &RuntimeCheckpoint, fence: &EffectFenceSummary) -> bool;
    pub fn permits_external_retry(&self, marker: &SideEffectMarker) -> bool;
    pub fn to_history_fact(&self, correlation: RuntimeCorrelation) -> Result<RuntimeHistoryEntry, DomainError>;
}
```

`Resume` and `RestartFromStable` require a committed checkpoint, matching state/effect digests, current expected versions and no unknown fence. `ReconcileOnly` performs no external action. Earlier decisions remain immutable.

### 3.3 `RecoveryContinuation`

```rust
pub struct RecoveryContinuation {
    pub continuation_id: RecoveryContinuationId,
    pub decision_id: RecoveryDecisionId,
    pub run_id: RunId,
    pub checkpoint_id: Option<CheckpointId>,
    pub status: ContinuationStatus,
    pub lease_ref: LeaseRef,
    pub cursor: RecoveryCursor,
    pub attempt: AttemptCount,
    pub next_eligible_at: Timestamp,
    pub last_error: Option<SafeReason>,
}

pub enum ContinuationStatus {
    Waiting,
    Claimed,
    Applied,
    Blocked,
    ManualReview,
    Completed,
}

impl RecoveryContinuation {
    pub fn schedule(continuation_id: RecoveryContinuationId, decision: &RecoveryDecision, lease_ref: LeaseRef, cursor: RecoveryCursor, next_eligible_at: Timestamp) -> Result<Self, DomainError>;
    pub fn claim(&mut self, lease_ref: LeaseRef, now: Timestamp) -> Result<(), DomainError>;
    pub fn apply(&mut self, decision: &RecoveryDecision, now: Timestamp) -> Result<(), DomainError>;
    pub fn block(&mut self, reason: SafeReason, now: Timestamp) -> Result<(), DomainError>;
    pub fn require_manual_review(&mut self, reason: SafeReason, now: Timestamp) -> Result<(), DomainError>;
    pub fn complete(&mut self, now: Timestamp) -> Result<(), DomainError>;
}
```

Continuation is an operations record, not scheduler truth. It can apply only the referenced immutable recovery decision.

## 4. Local outcome objects

### 4.1 `LocalOutcomeInputs`

```rust
pub struct LocalOutcomeInputs {
    pub run_id: RunId,
    pub requested_disposition: OutcomeDisposition,
    pub terminal_progress_decision_id: DecisionId,
    pub result_refs: Vec<TypedRef>,
    pub safe_summary_refs: Vec<TypedRef>,
    pub workspace_version: WorkspaceVersion,
    pub latest_history_sequence: HistorySequence,
    pub checkpoint_id: Option<CheckpointId>,
    pub effect_fence: EffectFenceSummary,
    pub source_refs: Vec<SourceReference>,
}

pub enum OutcomeDisposition {
    Succeeded,
    Partial,
    Blocked,
    Failed,
    Cancelled,
    Unknown,
}

impl LocalOutcomeInputs {
    pub fn validate_for(&self, run: &ControlledRun, workspace: &GoalPlanWorkspace) -> Result<(), DomainError>;
    pub fn requires_closed_fence(&self) -> bool;
    pub fn validates_terminal_progress(&self, decision: &RunProgressDecision) -> bool;
}
```

### 4.2 `RuntimeOutcome`

```rust
pub struct RuntimeOutcome {
    pub outcome_id: OutcomeId,
    pub run_id: RunId,
    pub disposition: OutcomeDisposition,
    pub terminal_progress_decision_id: DecisionId,
    pub result_refs: Vec<TypedRef>,
    pub safe_summary_refs: Vec<TypedRef>,
    pub checkpoint_id: Option<CheckpointId>,
    pub effect_fence_digest: EffectFenceDigest,
    pub source_refs: Vec<SourceReference>,
    pub version: OutcomeVersion,
    pub finalized_at: Timestamp,
}

impl RuntimeOutcome {
    pub fn finalize(outcome_id: OutcomeId, run: &ControlledRun, workspace: &GoalPlanWorkspace, terminal_decision: &RunProgressDecision, inputs: &LocalOutcomeInputs, now: Timestamp) -> Result<Self, DomainError>;
    pub fn is_terminal(&self) -> bool;
    pub fn permits_handoff_candidate(&self) -> bool;
    pub fn safe_result_refs(&self) -> Vec<TypedRef>;
    pub fn to_history_fact(&self, correlation: RuntimeCorrelation) -> Result<RuntimeHistoryEntry, DomainError>;
}
```

Outcome is immutable Runtime-local truth. Delivery, observed, artifact acceptance, approval, member lifecycle and product completion cannot change it. `Unknown` is terminal posture pending a new recovery/manual decision, not success or failure.

## 5. Handoff objects

### 5.1 `SafeHandoffMaterial`

```rust
pub struct SafeHandoffMaterial {
    pub material_id: HandoffMaterialId,
    pub run_id: RunId,
    pub outcome_id: OutcomeId,
    pub outcome_disposition: OutcomeDisposition,
    pub safe_result_refs: Vec<TypedRef>,
    pub safe_summary_refs: Vec<TypedRef>,
    pub source_refs: Vec<SourceReference>,
    pub redaction: RedactionMarker,
    pub material_digest: HandoffMaterialDigest,
    pub eligibility: HandoffEligibility,
    pub built_at: Timestamp,
}

pub enum HandoffEligibility {
    Eligible,
    Ineligible { reason: SafeReason },
    PendingContract { blocker_ref: BlockerRef },
    BlockedUnsafe { reason: SafeReason },
    Unknown { reason: SafeReason },
}

impl SafeHandoffMaterial {
    pub fn build(material_id: HandoffMaterialId, outcome: &RuntimeOutcome, safe_result_refs: Vec<TypedRef>, safe_summary_refs: Vec<TypedRef>, source_refs: Vec<SourceReference>, redaction: RedactionMarker, material_digest: HandoffMaterialDigest, policy: &HandoffEligibilityPolicy, now: Timestamp) -> Result<Self, DomainError>;
    pub fn is_eligible(&self) -> bool;
    pub fn validate_body_free(&self) -> Result<(), DomainError>;
    pub fn canonical_digest_input(&self) -> BodyFreeCanonicalValue;
}
```

No artifact/report/evidence body, evidence alias, acceptance verdict or observability payload is present. `L2R-UP-002` may force `PendingContract` even when the local outcome is committed.

### 5.2 `HandoffAttempt`

```rust
pub struct HandoffAttempt {
    pub attempt_id: HandoffAttemptId,
    pub run_id: RunId,
    pub material_id: HandoffMaterialId,
    pub material_digest: HandoffMaterialDigest,
    pub target_ref: HandoffTargetRef,
    pub status: HandoffAttemptStatus,
    pub submission_ref: Option<HandoffSubmissionRef>,
    pub acknowledgement_ref: Option<AcknowledgementRef>,
    pub correlation: RuntimeCorrelation,
    pub version: HandoffAttemptVersion,
    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}

pub enum HandoffAttemptStatus {
    Candidate,
    Submitted { submission_ref: HandoffSubmissionRef },
    Acknowledged { acknowledgement_ref: AcknowledgementRef },
    Rejected { reason: SafeReason },
    Blocked { reason: SafeReason },
    Unknown { fence_ref: FenceRef },
}

impl HandoffAttempt {
    pub fn create_candidate(attempt_id: HandoffAttemptId, material: &SafeHandoffMaterial, target_ref: HandoffTargetRef, correlation: RuntimeCorrelation, now: Timestamp) -> Result<Self, DomainError>;
    pub fn mark_submitted(&mut self, submission_ref: HandoffSubmissionRef, expected: HandoffAttemptVersion, now: Timestamp) -> Result<(), DomainError>;
    pub fn acknowledge(&mut self, acknowledgement: &HandoffAcknowledgement, expected: HandoffAttemptVersion, now: Timestamp) -> Result<(), DomainError>;
    pub fn reject(&mut self, reason: SafeReason, expected: HandoffAttemptVersion, now: Timestamp) -> Result<(), DomainError>;
    pub fn block(&mut self, reason: SafeReason, expected: HandoffAttemptVersion, now: Timestamp) -> Result<(), DomainError>;
    pub fn mark_unknown(&mut self, fence_ref: FenceRef, expected: HandoffAttemptVersion, now: Timestamp) -> Result<(), DomainError>;
    pub fn indicates_downstream_acceptance(&self) -> bool;
}
```

`indicates_downstream_acceptance()` always returns false. Acknowledgement proves only the contract-defined receipt, not business acceptance, observed status or artifact verdict.

### 5.3 `HandoffAcknowledgement` and `HandoffGap`

```rust
pub struct HandoffAcknowledgement {
    pub acknowledgement_ref: AcknowledgementRef,
    pub attempt_id: HandoffAttemptId,
    pub submission_ref: HandoffSubmissionRef,
    pub disposition: AcknowledgementDisposition,
    pub source_ref: SourceReference,
    pub occurred_at: Timestamp,
}

pub enum AcknowledgementDisposition {
    Received,
    Rejected,
    Pending,
    Unknown,
}

pub struct HandoffGap {
    pub gap_id: HandoffGapId,
    pub attempt_id: HandoffAttemptId,
    pub kind: HandoffGapKind,
    pub status: HandoffGapStatus,
    pub reason: SafeReason,
    pub opening_source_ref: SourceReference,
    pub closing_source_ref: Option<SourceReference>,
    pub acknowledgement_ref: Option<AcknowledgementRef>,
    pub version: HandoffGapVersion,
    pub opened_at: Timestamp,
    pub updated_at: Timestamp,
}

pub enum HandoffGapKind {
    SubmissionUnavailable,
    SubmissionUnknown,
    AcknowledgementMissing,
    AcknowledgementRejected,
    ContractPending,
    RoutePending,
    ObservabilityPending,
}

pub enum HandoffGapStatus {
    Open,
    Reconciling,
    Closed { acknowledgement_ref: AcknowledgementRef },
    Unknown { fence_ref: FenceRef },
}

impl HandoffAcknowledgement {
    pub fn validate_for(&self, attempt: &HandoffAttempt) -> Result<(), DomainError>;
    pub fn indicates_business_acceptance(&self) -> bool;
}

impl HandoffGap {
    pub fn open(gap_id: HandoffGapId, attempt: &HandoffAttempt, kind: HandoffGapKind, reason: SafeReason, source_ref: SourceReference, now: Timestamp) -> Result<Self, DomainError>;
    pub fn begin_reconciliation(&mut self, expected: HandoffGapVersion, now: Timestamp) -> Result<(), DomainError>;
    pub fn close(&mut self, acknowledgement: &HandoffAcknowledgement, closing_source_ref: SourceReference, expected: HandoffGapVersion, now: Timestamp) -> Result<(), DomainError>;
    pub fn mark_unknown(&mut self, fence_ref: FenceRef, expected: HandoffGapVersion, now: Timestamp) -> Result<(), DomainError>;
    pub fn can_self_close(&self) -> bool;
}
```

Both `indicates_business_acceptance()` and `can_self_close()` always return false. Gap closure requires a verified acknowledgement source; time passage, republish attempt or projection success is insufficient.

## 6. Projection and safe view objects

### 6.1 `ProjectionState`

```rust
pub struct ProjectionState {
    pub projection_id: ProjectionId,
    pub name: ProjectionName,
    pub status: ProjectionStatus,
    pub cursor: ProjectionCursor,
    pub source_run_version: Option<RunVersion>,
    pub source_history_sequence: Option<HistorySequence>,
    pub rebuild_id: Option<ProjectionRebuildId>,
    pub gap_refs: Vec<ProjectionGapRef>,
    pub version: ProjectionVersion,
    pub updated_at: Timestamp,
}

pub enum ProjectionStatus {
    Empty,
    Current,
    Stale { source_version: RunVersion },
    Rebuilding { rebuild_id: ProjectionRebuildId },
    Degraded { gap_refs: NonEmptyVec<ProjectionGapRef> },
    Unknown { reason: SafeReason },
}

impl ProjectionState {
    pub fn empty(projection_id: ProjectionId, name: ProjectionName, now: Timestamp) -> Result<Self, DomainError>;
    pub fn begin_rebuild(&mut self, rebuild_id: ProjectionRebuildId, from_cursor: ProjectionCursor, expected: ProjectionVersion, now: Timestamp) -> Result<(), DomainError>;
    pub fn advance(&mut self, rebuild_id: ProjectionRebuildId, next_cursor: ProjectionCursor, source_version: RunVersion, history_sequence: HistorySequence, expected: ProjectionVersion, now: Timestamp) -> Result<(), DomainError>;
    pub fn mark_current(&mut self, rebuild_id: ProjectionRebuildId, final_cursor: ProjectionCursor, source_version: RunVersion, history_sequence: HistorySequence, expected: ProjectionVersion, now: Timestamp) -> Result<(), DomainError>;
    pub fn mark_stale(&mut self, source_version: RunVersion, expected: ProjectionVersion, now: Timestamp) -> Result<(), DomainError>;
    pub fn mark_degraded(&mut self, gap_refs: NonEmptyVec<ProjectionGapRef>, expected: ProjectionVersion, now: Timestamp) -> Result<(), DomainError>;
    pub fn mark_unknown(&mut self, reason: SafeReason, expected: ProjectionVersion, now: Timestamp) -> Result<(), DomainError>;
    pub fn freshness(&self, required: FreshnessRequirement) -> ViewFreshness;
}
```

Projection state is rebuildable read state. It never modifies domain truth. Cursor must be monotonic for a rebuild ID; current requires a proven caught-up history sequence.

### 6.2 `SafeRuntimeView`

```rust
pub struct SafeRuntimeView {
    pub view_id: SafeRuntimeViewId,
    pub run_id: RunId,
    pub read_scope: ReadScope,
    pub run_status: SafeRunStatus,
    pub progress: SafeProgressView,
    pub current_decision_refs: SafeDecisionRefs,
    pub checkpoint: SafeCheckpointView,
    pub outcome: Option<SafeOutcomeView>,
    pub handoff: SafeHandoffView,
    pub source_availability: Vec<SafeSourceAvailabilityView>,
    pub projection_id: ProjectionId,
    pub projection_cursor: ProjectionCursor,
    pub freshness: ViewFreshness,
    pub visibility: ViewVisibility,
    pub redaction: RedactionMarker,
    pub built_at: Timestamp,
}

pub enum ViewFreshness {
    Current,
    Stale { source_version: RunVersion },
    Rebuilding,
    Degraded { gap_refs: Vec<ProjectionGapRef> },
    Unknown,
}

pub enum ViewVisibility {
    Visible,
    PartiallyVisible { hidden_field_kinds: Vec<SafeFieldKind> },
    NotVisible,
}

impl SafeRuntimeView {
    pub fn rebuild(view_id: SafeRuntimeViewId, run_id: RunId, read_scope: ReadScope, facts: NonEmptyVec<RuntimeHistoryEntry>, projection: &ProjectionState, redaction: RedactionMarker, now: Timestamp) -> Result<Self, ProjectionError>;
    pub fn is_visible(&self, scope: &ReadScope) -> bool;
    pub fn satisfies(&self, requirement: FreshnessRequirement) -> bool;
    pub fn validate_body_free(&self) -> Result<(), ProjectionError>;
    pub fn page_history_refs(&self, cursor: HistoryCursor, limit: PageLimit) -> Result<Page<TypedRef>, ProjectionError>;
}
```

Every nested `Safe*View` is a body-free protocol projection with stable typed fields defined in Step 8. `NotVisible` and `NotFound` remain distinguishable internally and are mapped according to leak-safe query policy.

### 6.3 Rebuild and reconciliation records

```rust
pub struct ProjectionRebuildRecord {
    pub rebuild_id: ProjectionRebuildId,
    pub projection_id: ProjectionId,
    pub from_cursor: ProjectionCursor,
    pub to_cursor: ProjectionCursor,
    pub processed_history_count: RecordCount,
    pub written_view_count: RecordCount,
    pub gap_refs: Vec<ProjectionGapRef>,
    pub disposition: RebuildDisposition,
    pub lease_ref: LeaseRef,
    pub started_at: Timestamp,
    pub finished_at: Option<Timestamp>,
}

pub enum RebuildDisposition {
    Running,
    Completed,
    Partial,
    Blocked,
    Failed,
    Unknown,
}

pub struct HandoffReconciliationRecord {
    pub reconciliation_id: HandoffReconciliationId,
    pub gap_id: HandoffGapId,
    pub attempt_id: HandoffAttemptId,
    pub checked_source_refs: Vec<SourceReference>,
    pub acknowledgement_ref: Option<AcknowledgementRef>,
    pub disposition: ReconciliationDisposition,
    pub reason: SafeReason,
    pub lease_ref: LeaseRef,
    pub checked_at: Timestamp,
}

pub enum ReconciliationDisposition {
    GapClosed,
    StillOpen,
    RetrySubmissionCandidate,
    ContractPending,
    ManualReview,
    Unknown,
}

impl ProjectionRebuildRecord {
    pub fn start(rebuild_id: ProjectionRebuildId, projection: &ProjectionState, lease_ref: LeaseRef, now: Timestamp) -> Result<Self, DomainError>;
    pub fn advance(&mut self, to_cursor: ProjectionCursor, processed: RecordCount, written: RecordCount, gap_refs: Vec<ProjectionGapRef>) -> Result<(), DomainError>;
    pub fn finish(&mut self, disposition: RebuildDisposition, now: Timestamp) -> Result<(), DomainError>;
}

impl HandoffReconciliationRecord {
    pub fn record(reconciliation_id: HandoffReconciliationId, gap: &HandoffGap, checked_source_refs: Vec<SourceReference>, acknowledgement_ref: Option<AcknowledgementRef>, disposition: ReconciliationDisposition, reason: SafeReason, lease_ref: LeaseRef, now: Timestamp) -> Result<Self, DomainError>;
    pub fn permits_gap_close(&self) -> bool;
    pub fn indicates_delivery(&self) -> bool;
}
```

`indicates_delivery()` always returns false. A job record reports what the Runtime checked and decided, not scheduler success, downstream delivery or observability evidence.

## 7. Object trace and minimum tests

| Object | Protocol / Flow | State subject | Minimum assertions |
|---|---|---|---|
| `StableStateCandidate` | Prepare checkpoint | Stable Candidate | digest/version/history mismatch rejected; body-free |
| `EffectFenceSummary` | checkpoint/recovery/outcome | Effect Fence | unknown blocks checkpoint/resume; restart no auto-close |
| `RuntimeCheckpoint` | Prepare/Commit | Checkpoint | prepared not stable; unknown no retry; receipt digest match |
| `CheckpointCommitReceipt` | Commit result | Commit Result | only fully matching committed receipt proves commit |
| `RecoveryInputs` | Request/continuation | Recovery Request | process restart no failure inference; lease required for job |
| `RecoveryDecision` | Request recovery | Recovery | committed checkpoint and closed fence; immutable supersession |
| `RecoveryContinuation` | Resume job | Continuation | applies referenced decision only; lease mismatch blocked |
| `RuntimeOutcome` | Finalize outcome | Outcome | terminal progress; unknown fence; delivery cannot mutate |
| `SafeHandoffMaterial` | Create handoff | Eligibility | unsafe body; pending producer/route; digest determinism |
| `HandoffAttempt` | Create/ack consumer | Handoff Attempt | acknowledgement not acceptance; unknown fence |
| `HandoffGap` | ack/reconcile job | Handoff Gap | no self-close; source match; version conflict |
| `ProjectionState` | rebuild jobs | Projection | cursor monotonic; caught-up proof; stale visible |
| `SafeRuntimeView` | Queries/outbound view event | View Freshness | visibility/redaction; degraded not current; rebuild body-free |
| `ProjectionRebuildRecord` | rebuild jobs | Rebuild | lease/cursor/page counts; partial gap visible |
| `HandoffReconciliationRecord` | reconcile job | Reconciliation | no manufactured acknowledgement/delivery |

## 8. Batch gate

| Check | Result |
|---|---|
| Prepare, commit-pending, committed and commit-unknown are distinct | pass |
| Recovery requires immutable decision, stable checkpoint and effect fence | pass |
| Local outcome cannot be changed by delivery/observed/acceptance | pass |
| Handoff material, attempt, acknowledgement and gap are distinct | pass |
| Projection/view are rebuildable and cannot write domain truth | pass |
| CP/Tools/Bus/Observability blockers remain fail-closed | pass |

```text
next_allowed_action = create_step_06_application_infra_entry_carriers
```
