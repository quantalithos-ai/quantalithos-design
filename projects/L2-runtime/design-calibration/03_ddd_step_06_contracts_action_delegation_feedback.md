# L2-runtime Step 6 deep object contracts: action, delegation, feedback and reflection

> 状态: done
> 当前 Step: 6
> 批次: 6.7 Action Orchestration; 6.8 Sub-agent Delegation; 6.9 Feedback & Reflection
> 红线: Runtime owns choice/guard/attempt/incorporation only; Tools/Sandbox own execution truth, Governance owns approval/policy truth, child runtime owns child result truth

## 1. Action candidate and decision

### 1.1 `ActionCandidate`

```rust
pub struct ActionCandidate {
    pub candidate_id: ActionCandidateId,
    pub run_id: RunId,
    pub turn_id: ModelTurnId,
    pub kind: ActionCandidateKind,
    pub target_ref: TypedRef,
    pub input_ref: SafeActionInputRef,
    pub scope: RuntimeScope,
    pub budget: ActionBudget,
    pub capability_ref: Option<CapabilityIdentityRef>,
    pub source_refs: Vec<SourceReference>,
    pub candidate_digest: ActionCandidateDigest,
}

pub enum ActionCandidateKind {
    ToolInvocation,
    CapabilityInvocation,
    IsolatedInvocation,
    ChildDelegation,
    LocalReflection,
    NoExternalAction,
}

pub struct ActionBudget {
    pub max_attempts: AttemptCount,
    pub deadline: Option<Timestamp>,
    pub side_effect_class: SideEffectClass,
    pub delegation_depth_remaining: DelegationDepth,
}

impl ActionCandidate {
    pub fn from_model(candidate_id: ActionCandidateId, run_id: RunId, turn_id: ModelTurnId, kind: ActionCandidateKind, target_ref: TypedRef, input_ref: SafeActionInputRef, scope: RuntimeScope, budget: ActionBudget, capability_ref: Option<CapabilityIdentityRef>, source_refs: Vec<SourceReference>, candidate_digest: ActionCandidateDigest) -> Result<Self, DomainError>;
    pub fn validate_scope(&self, run: &ControlledRun) -> Result<(), DomainError>;
    pub fn validate_model_source(&self, decision: &ModelDecision) -> Result<(), DomainError>;
    pub fn requires_external_effect(&self) -> bool;
    pub fn requires_isolation(&self) -> bool;
    pub fn canonical_digest_input(&self) -> BodyFreeCanonicalValue;
}

impl ActionBudget {
    pub fn validate(&self) -> Result<(), DomainError>;
    pub fn consume_attempt(&self) -> Result<Self, DomainError>;
    pub fn derive_child(&self, child_depth: DelegationDepth) -> Result<DelegationBudget, DomainError>;
}
```

`SafeActionInputRef` points to an input owned by the formal action contract. Runtime does not copy tool schema/body or construct provider/MCP/A2A/API adapter truth. `max_attempts` limits local orchestration attempts and never authorizes replay of an unknown side effect.

### 1.2 `ActionDecision`

```rust
pub struct ActionDecision {
    pub action_decision_id: ActionDecisionId,
    pub run_id: RunId,
    pub model_decision_id: DecisionId,
    pub candidate: ActionCandidate,
    pub disposition: ActionDecisionDisposition,
    pub precondition_decision_id: Option<ActionPreconditionDecisionId>,
    pub side_effect_marker_id: Option<SideEffectMarkerId>,
    pub source_refs: Vec<SourceReference>,
    pub version: ActionDecisionVersion,
    pub decided_at: Timestamp,
}

pub enum ActionDecisionDisposition {
    Proposed,
    Guarded { precondition_decision_id: ActionPreconditionDecisionId },
    SubmissionCandidate { marker_id: SideEffectMarkerId },
    Cancelled { reason: SafeReason },
    Superseded { replacement_id: ActionDecisionId },
    Blocked { reason: SafeReason },
    Unknown { fence: FenceRef },
}

impl ActionDecision {
    pub fn propose(action_decision_id: ActionDecisionId, model_decision: &ModelDecision, candidate: ActionCandidate, source_refs: Vec<SourceReference>, now: Timestamp) -> Result<Self, DomainError>;
    pub fn attach_precondition(&mut self, decision: &ActionPreconditionDecision, expected: ActionDecisionVersion) -> Result<(), DomainError>;
    pub fn prepare_submission(&mut self, marker_id: SideEffectMarkerId, expected: ActionDecisionVersion) -> Result<(), DomainError>;
    pub fn cancel(&mut self, reason: SafeReason, expected: ActionDecisionVersion) -> Result<(), DomainError>;
    pub fn supersede(&mut self, replacement_id: ActionDecisionId, expected: ActionDecisionVersion) -> Result<(), DomainError>;
    pub fn block(&mut self, reason: SafeReason, expected: ActionDecisionVersion) -> Result<(), DomainError>;
    pub fn mark_unknown(&mut self, fence: FenceRef, expected: ActionDecisionVersion) -> Result<(), DomainError>;
    pub fn is_submittable(&self, guard: &ActionPreconditionDecision) -> bool;
    pub fn to_history_fact(&self, correlation: RuntimeCorrelation) -> Result<RuntimeHistoryEntry, DomainError>;
}
```

An action decision is Runtime local truth about selection. No disposition in this enum means external execution succeeded.

## 2. Guard inputs and decisions

### 2.1 `ActionPreconditionInputs`

```rust
pub struct ActionPreconditionInputs {
    pub action_id: ActionDecisionId,
    pub governance: GovernancePreconditionView,
    pub capability: CapabilityExposureView,
    pub tool_contract: Option<ToolContractAvailability>,
    pub sandbox_requirement: Option<SandboxRequirementAvailability>,
    pub source_availability: Vec<SourceAvailability>,
    pub effect_fence: EffectFenceSummary,
    pub evaluated_versions: PreconditionVersionSet,
}

pub struct GovernancePreconditionView {
    pub decision_ref: FormalDecisionRef,
    pub policy_ref: PolicyRef,
    pub scope: RuntimeScope,
    pub disposition: GovernanceDisposition,
    pub effective_version: SourceVersion,
    pub source_ref: SourceReference,
}

pub enum GovernanceDisposition {
    Allowed,
    Denied,
    Waiting,
    NotApplicable,
    Unknown,
}

pub struct CapabilityExposureView {
    pub capability_ref: CapabilityIdentityRef,
    pub exposure_ref: FormalExposureRef,
    pub adapter_descriptor_ref: AdapterDescriptorRef,
    pub status: CapabilityExposureStatus,
    pub schema_version: SchemaVersion,
    pub source_ref: SourceReference,
}

pub enum CapabilityExposureStatus {
    FormallyExposed,
    NotExposed,
    Pending,
    Incompatible,
    Unknown,
}

pub enum ToolContractAvailability {
    Available { contract_ref: ToolActionContractRef, schema_version: SchemaVersion },
    PendingContract { blocker_ref: BlockerRef },
    Unavailable { reason: SafeReason },
    Incompatible { reason: SafeReason },
    Unknown { reason: SafeReason },
}

pub enum SandboxRequirementAvailability {
    RequiredAndAvailable { requirement_ref: IsolationRequirementRef, schema_version: SchemaVersion },
    NotRequired { source_ref: SourceReference },
    PendingContract { blocker_ref: BlockerRef },
    Unavailable { reason: SafeReason },
    Unknown { reason: SafeReason },
}

impl ActionPreconditionInputs {
    pub fn validate_for(&self, action: &ActionDecision) -> Result<(), DomainError>;
    pub fn has_unknown_or_pending(&self) -> bool;
    pub fn has_denial(&self) -> bool;
    pub fn permits_external_submission(&self) -> bool;
    pub fn source_refs(&self) -> Vec<SourceReference>;
}
```

These are imported safe views, not copied Governance/Hub/Tools/Sandbox truth. `L2R-UP-001`, `L2R-UP-003`, `L2R-UP-007` map to pending/unavailable variants and cannot become `Available` through a fake.

### 2.2 `ActionPreconditionDecision`

```rust
pub struct ActionPreconditionDecision {
    pub decision_id: ActionPreconditionDecisionId,
    pub action_id: ActionDecisionId,
    pub disposition: PreconditionDisposition,
    pub checked_refs: Vec<TypedRef>,
    pub checked_versions: PreconditionVersionSet,
    pub reason: SafeReason,
    pub source_refs: Vec<SourceReference>,
    pub decided_at: Timestamp,
}

pub enum PreconditionDisposition {
    Allowed,
    Denied,
    Waiting,
    Blocked,
    Unknown,
}

impl ActionPreconditionDecision {
    pub fn evaluate(decision_id: ActionPreconditionDecisionId, action: &ActionDecision, inputs: &ActionPreconditionInputs, now: Timestamp) -> Result<Self, DomainError>;
    pub fn permits_submission(&self) -> bool;
    pub fn remains_valid(&self, current_versions: &PreconditionVersionSet) -> bool;
    pub fn require_allowed(&self) -> Result<(), DomainError>;
    pub fn to_history_fact(&self, run_id: RunId, correlation: RuntimeCorrelation) -> Result<RuntimeHistoryEntry, DomainError>;
}
```

Only `Allowed` permits a submission candidate, and only while all evaluated versions remain equal. `Unknown` cannot be mapped to `Waiting` if an effect may already exist.

## 3. Side-effect marker and submission attempt

### 3.1 `SideEffectMarker`

```rust
pub struct SideEffectMarker {
    pub marker_id: SideEffectMarkerId,
    pub run_id: RunId,
    pub action_id: ActionDecisionId,
    pub effect_class: SideEffectClass,
    pub status: SideEffectStatus,
    pub attempt_count: AttemptCount,
    pub last_attempt_id: Option<ActionAttemptId>,
    pub submission_ref: Option<ActionSubmissionRef>,
    pub feedback_ref: Option<ActionFeedbackId>,
    pub fence_ref: Option<FenceRef>,
    pub version: SideEffectVersion,
    pub updated_at: Timestamp,
}

pub enum SideEffectClass {
    None,
    ReadOnlyExternal,
    ReversibleExternal,
    IrreversibleExternal,
    UnknownExternal,
}

pub enum SideEffectStatus {
    Candidate,
    AttemptRecorded { attempt_id: ActionAttemptId },
    Submitted { submission_ref: ActionSubmissionRef },
    Completed { feedback_ref: ActionFeedbackId },
    Failed { feedback_ref: ActionFeedbackId, reason: SafeReason },
    CancelledBeforeSubmit { reason: SafeReason },
    Unknown { fence_ref: FenceRef },
}

impl SideEffectMarker {
    pub fn create(marker_id: SideEffectMarkerId, run_id: RunId, action: &ActionDecision, effect_class: SideEffectClass, now: Timestamp) -> Result<Self, DomainError>;
    pub fn record_attempt(&mut self, attempt_id: ActionAttemptId, expected: SideEffectVersion, now: Timestamp) -> Result<(), DomainError>;
    pub fn mark_submitted(&mut self, submission_ref: ActionSubmissionRef, expected: SideEffectVersion, now: Timestamp) -> Result<(), DomainError>;
    pub fn incorporate_feedback(&mut self, feedback: &ActionFeedbackRecord, expected: SideEffectVersion, now: Timestamp) -> Result<(), DomainError>;
    pub fn cancel_before_submit(&mut self, reason: SafeReason, expected: SideEffectVersion, now: Timestamp) -> Result<(), DomainError>;
    pub fn mark_unknown(&mut self, fence_ref: FenceRef, expected: SideEffectVersion, now: Timestamp) -> Result<(), DomainError>;
    pub fn permits_retry(&self, recovery: &RecoveryDecision) -> bool;
    pub fn is_resolved(&self) -> bool;
}
```

`Unknown` is a hard fence. It cannot be changed by timeout, process restart, adapter availability or a new local attempt; only verified feedback or an explicit manual recovery decision can resolve it.

### 3.2 `ActionSubmissionAttempt`

```rust
pub struct ActionSubmissionAttempt {
    pub attempt_id: ActionAttemptId,
    pub run_id: RunId,
    pub action_id: ActionDecisionId,
    pub marker_id: SideEffectMarkerId,
    pub target: ActionSubmissionTarget,
    pub intent_ref: CanonicalActionIntentRef,
    pub intent_digest: CanonicalActionDigest,
    pub guard_decision_id: ActionPreconditionDecisionId,
    pub guard_versions: PreconditionVersionSet,
    pub status: ActionAttemptStatus,
    pub submission_ref: Option<ActionSubmissionRef>,
    pub reason: Option<SafeReason>,
    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}

pub enum ActionSubmissionTarget {
    Tools { contract_ref: ToolActionContractRef },
    Sandbox { requirement_ref: IsolationRequirementRef },
    ChildRuntime { delegation_id: DelegationId },
}

pub enum ActionAttemptStatus {
    Recorded,
    Submitted,
    Rejected,
    Blocked,
    Unknown,
}

impl ActionSubmissionAttempt {
    pub fn record(attempt_id: ActionAttemptId, action: &ActionDecision, marker: &SideEffectMarker, target: ActionSubmissionTarget, intent_ref: CanonicalActionIntentRef, intent_digest: CanonicalActionDigest, guard: &ActionPreconditionDecision, now: Timestamp) -> Result<Self, DomainError>;
    pub fn attach_submission(&mut self, submission_ref: ActionSubmissionRef, now: Timestamp) -> Result<(), DomainError>;
    pub fn reject(&mut self, reason: SafeReason, now: Timestamp) -> Result<(), DomainError>;
    pub fn block(&mut self, reason: SafeReason, now: Timestamp) -> Result<(), DomainError>;
    pub fn mark_unknown(&mut self, reason: SafeReason, now: Timestamp) -> Result<(), DomainError>;
    pub fn guard_is_current(&self, current: &PreconditionVersionSet) -> bool;
}
```

The Tools-owned `CanonicalActionIntentRef` is created through the formal Tools contract. Runtime persists the attempt before calling the adapter. An attempt record is not an execution receipt.

## 4. Delegation objects

### 4.1 `DelegationBudget` and `ChildContextBoundary`

```rust
pub struct DelegationBudget {
    pub max_child_turns: TurnCount,
    pub max_child_actions: AttemptCount,
    pub max_context_weight: ContextWeight,
    pub depth_remaining: DelegationDepth,
    pub deadline: Option<Timestamp>,
}

pub struct ChildContextBoundary {
    pub boundary_id: ChildContextBoundaryId,
    pub parent_context_id: WorkingContextId,
    pub parent_context_digest: ContextDigest,
    pub allowed_segment_refs: Vec<SafeFragmentRef>,
    pub excluded_segment_refs: Vec<SafeFragmentRef>,
    pub child_scope: RuntimeScope,
    pub budget: DelegationBudget,
    pub redaction: RedactionMarker,
    pub digest: ChildContextDigest,
}

impl DelegationBudget {
    pub fn validate_against_parent(&self, parent: &ActionBudget) -> Result<(), DomainError>;
    pub fn consume_child_turn(&self) -> Result<Self, DomainError>;
    pub fn consume_child_action(&self) -> Result<Self, DomainError>;
}

impl ChildContextBoundary {
    pub fn derive(boundary_id: ChildContextBoundaryId, parent: &WorkingContext, child_scope: RuntimeScope, allowed_segment_refs: Vec<SafeFragmentRef>, excluded_segment_refs: Vec<SafeFragmentRef>, budget: DelegationBudget, redaction: RedactionMarker, digest: ChildContextDigest) -> Result<Self, DomainError>;
    pub fn contains(&self, segment_ref: &SafeFragmentRef) -> bool;
    pub fn validates_parent(&self, parent: &WorkingContext) -> bool;
    pub fn canonical_digest_input(&self) -> BodyFreeCanonicalValue;
}
```

A child receives an immutable allow-list and derived scope, never the mutable parent context or working memory. Exclusion must be explicit for every parent segment not passed to the child.

### 4.2 `Delegation`

```rust
pub struct Delegation {
    pub delegation_id: DelegationId,
    pub parent_run_id: RunId,
    pub parent_action_id: ActionDecisionId,
    pub child_scope: RuntimeScope,
    pub context_boundary_id: ChildContextBoundaryId,
    pub budget: DelegationBudget,
    pub goal_refs: NonEmptyVec<TypedRef>,
    pub status: DelegationStatus,
    pub child_submission_ref: Option<ChildSubmissionRef>,
    pub child_run_ref: Option<ChildRunRef>,
    pub child_result_ref: Option<ChildResultRef>,
    pub version: DelegationVersion,
    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}

pub enum DelegationStatus {
    Proposed,
    SubmissionCandidate,
    Submitted { submission_ref: ChildSubmissionRef },
    ChildAccepted { child_run_ref: ChildRunRef },
    ResultAvailable { result_ref: ChildResultRef },
    Incorporated { history_ref: HistoryEntryId },
    Rejected { reason: SafeReason },
    Cancelled { reason: SafeReason },
    Failed { reason: SafeReason },
    Unknown { fence_ref: FenceRef },
}

impl Delegation {
    pub fn create(delegation_id: DelegationId, parent: &ControlledRun, action: &ActionDecision, child_scope: RuntimeScope, boundary: &ChildContextBoundary, budget: DelegationBudget, goal_refs: NonEmptyVec<TypedRef>, now: Timestamp) -> Result<Self, DomainError>;
    pub fn prepare_submission(&mut self, expected: DelegationVersion, now: Timestamp) -> Result<(), DomainError>;
    pub fn mark_submitted(&mut self, submission_ref: ChildSubmissionRef, expected: DelegationVersion, now: Timestamp) -> Result<(), DomainError>;
    pub fn accept_child(&mut self, child_run_ref: ChildRunRef, expected: DelegationVersion, now: Timestamp) -> Result<(), DomainError>;
    pub fn record_result(&mut self, result_ref: ChildResultRef, expected: DelegationVersion, now: Timestamp) -> Result<(), DomainError>;
    pub fn incorporate_once(&mut self, result_ref: ChildResultRef, history_ref: HistoryEntryId, expected: DelegationVersion, now: Timestamp) -> Result<(), DomainError>;
    pub fn reject(&mut self, reason: SafeReason, expected: DelegationVersion, now: Timestamp) -> Result<(), DomainError>;
    pub fn cancel(&mut self, reason: SafeReason, expected: DelegationVersion, now: Timestamp) -> Result<(), DomainError>;
    pub fn mark_unknown(&mut self, fence_ref: FenceRef, expected: DelegationVersion, now: Timestamp) -> Result<(), DomainError>;
}
```

Child run/container/member lifecycle stays outside Runtime. Parent status does not follow child status automatically; only `incorporate_once` appends a new parent fact.

### 4.3 Child request/result carriers

```rust
pub struct ChildRunRequest {
    pub request_id: ChildRequestId,
    pub delegation_id: DelegationId,
    pub parent_run_id: RunId,
    pub child_scope: RuntimeScope,
    pub goal_refs: NonEmptyVec<TypedRef>,
    pub context_boundary_ref: ChildContextBoundaryRef,
    pub budget: DelegationBudget,
    pub correlation: RuntimeCorrelation,
    pub request_digest: RequestDigest,
}

pub struct ChildResultEnvelope {
    pub result_ref: ChildResultRef,
    pub delegation_id: DelegationId,
    pub child_run_ref: ChildRunRef,
    pub disposition: ChildResultDisposition,
    pub safe_result_refs: Vec<TypedRef>,
    pub source_ref: SourceReference,
    pub correlation: RuntimeCorrelation,
    pub occurred_at: Timestamp,
}

pub enum ChildResultDisposition {
    Succeeded,
    Partial,
    Blocked,
    Failed,
    Cancelled,
    Unknown,
}

impl ChildRunRequest {
    pub fn from_delegation(request_id: ChildRequestId, delegation: &Delegation, boundary: &ChildContextBoundary, correlation: RuntimeCorrelation, request_digest: RequestDigest) -> Result<Self, DomainError>;
    pub fn validate_body_free(&self) -> Result<(), DomainError>;
}

impl ChildResultEnvelope {
    pub fn validate_for(&self, delegation: &Delegation) -> Result<(), DomainError>;
    pub fn incorporation_identity(&self) -> ChildIncorporationIdentity;
}
```

The result envelope reports child-owned truth by ref. The parent does not reinterpret `Succeeded` as parent completion.

## 5. Feedback and ordering objects

### 5.1 `ExternalActionFeedback`

```rust
pub struct ExternalActionFeedback {
    pub feedback_ref: ExternalFeedbackRef,
    pub action_id: ActionDecisionId,
    pub submission_ref: ActionSubmissionRef,
    pub source_owner: OwnerRef,
    pub disposition: ExternalFeedbackDisposition,
    pub safe_result_ref: Option<TypedRef>,
    pub failure_ref: Option<TypedRef>,
    pub ordering: FeedbackOrdering,
    pub source_ref: SourceReference,
    pub occurred_at: Timestamp,
}

pub enum ExternalFeedbackDisposition {
    AcceptedForExecution,
    InProgress,
    Succeeded,
    Failed,
    Rejected,
    Cancelled,
    CleanupPending,
    CleanupCompleted,
    Unknown,
}

pub struct FeedbackOrdering {
    pub stream_key: OrderingKey,
    pub sequence: OrderingSequence,
    pub predecessor_ref: Option<ExternalFeedbackRef>,
}

impl ExternalActionFeedback {
    pub fn validate_contract(&self, expected_schema: SchemaVersion) -> Result<(), ProtocolError>;
    pub fn validate_body_free(&self) -> Result<(), ProtocolError>;
    pub fn canonical_digest_input(&self) -> BodyFreeCanonicalValue;
}

impl FeedbackOrdering {
    pub fn compare(&self, previous: Option<&FeedbackOrdering>) -> FeedbackOrderDisposition;
}
```

This is an inbound protocol value. Runtime cannot manufacture `Succeeded` or `CleanupCompleted`; until L2-tools/Sandbox seams close, positive variants are schema placeholders with blocked qualification, not readiness facts.

### 5.2 `ActionFeedbackRecord`

```rust
pub struct ActionFeedbackRecord {
    pub feedback_id: ActionFeedbackId,
    pub run_id: RunId,
    pub action_id: ActionDecisionId,
    pub marker_id: SideEffectMarkerId,
    pub source_event_ref: EventId,
    pub external_feedback_ref: ExternalFeedbackRef,
    pub submission_ref: ActionSubmissionRef,
    pub disposition: FeedbackDisposition,
    pub result_ref: Option<TypedRef>,
    pub ordering: FeedbackOrdering,
    pub correlation: RuntimeCorrelation,
    pub source_ref: SourceReference,
    pub recorded_at: Timestamp,
}

pub enum FeedbackDisposition {
    RecordedAccepted,
    RecordedInProgress,
    RecordedSucceeded,
    RecordedFailed,
    RecordedRejected,
    RecordedCancelled,
    RecordedCleanupPending,
    RecordedCleanupCompleted,
    RecordedUnknown,
    IgnoredDuplicate { existing_feedback_id: ActionFeedbackId },
    QuarantinedLate { latest_feedback_id: ActionFeedbackId },
    QuarantinedOutOfOrder { expected_after: Option<ExternalFeedbackRef> },
    QuarantinedMismatch { reason: SafeReason },
}

impl ActionFeedbackRecord {
    pub fn incorporate(feedback_id: ActionFeedbackId, run_id: RunId, marker: &SideEffectMarker, event_id: EventId, external: &ExternalActionFeedback, previous: Option<&ActionFeedbackRecord>, correlation: RuntimeCorrelation, now: Timestamp) -> Result<Self, DomainError>;
    pub fn event_identity(&self) -> FeedbackEventIdentity;
    pub fn is_effect_applicable(&self) -> bool;
    pub fn is_duplicate(&self) -> bool;
    pub fn is_late_or_out_of_order(&self) -> bool;
    pub fn to_history_fact(&self) -> Result<RuntimeHistoryEntry, DomainError>;
}
```

All received events produce a durable incorporation or quarantine result. Late/out-of-order records never overwrite the marker, decision, run or outcome.

### 5.3 `FeedbackIncorporationDecision`

```rust
pub struct FeedbackIncorporationDecision {
    pub decision_id: FeedbackIncorporationDecisionId,
    pub run_id: RunId,
    pub feedback_id: ActionFeedbackId,
    pub disposition: IncorporationDisposition,
    pub marker_transition: Option<SideEffectTransition>,
    pub progress_trigger: ProgressTriggerDisposition,
    pub reason: SafeReason,
    pub source_refs: Vec<SourceReference>,
    pub decided_at: Timestamp,
}

pub enum IncorporationDisposition {
    Apply,
    RecordOnly,
    IgnoreDuplicate,
    QuarantineLate,
    QuarantineOutOfOrder,
    BlockMismatch,
    ManualReview,
}

pub enum ProgressTriggerDisposition {
    EvaluateNow,
    WaitForMoreFeedback,
    NoProgressChange,
    RequireRecovery,
    RequireManualReview,
}

impl FeedbackIncorporationDecision {
    pub fn decide(decision_id: FeedbackIncorporationDecisionId, feedback: &ActionFeedbackRecord, marker: &SideEffectMarker, run: &ControlledRun, now: Timestamp) -> Result<Self, DomainError>;
    pub fn permits_marker_mutation(&self) -> bool;
    pub fn requires_new_progress_decision(&self) -> bool;
}
```

This decision is the only path from an immutable feedback record to a marker transition. It never mutates an earlier model/action/progress decision.

## 6. Reflection objects

### 6.1 `ReflectionTrigger`

```rust
pub struct ReflectionTrigger {
    pub trigger_id: ReflectionTriggerId,
    pub run_id: RunId,
    pub trigger_kind: ReflectionTriggerKind,
    pub fact_refs: NonEmptyVec<TypedRef>,
    pub unresolved_effect_refs: Vec<SideEffectMarkerId>,
    pub current_context_ref: Option<WorkingContextId>,
    pub reason: SafeReason,
    pub source_refs: Vec<SourceReference>,
}

pub enum ReflectionTriggerKind {
    ModelRequested,
    ActionFailed,
    FeedbackContradiction,
    ProgressStalled,
    SourceChanged,
    RecoveryRequested,
    ManualReviewRequested,
}

impl ReflectionTrigger {
    pub fn create(trigger_id: ReflectionTriggerId, run_id: RunId, trigger_kind: ReflectionTriggerKind, fact_refs: NonEmptyVec<TypedRef>, unresolved_effect_refs: Vec<SideEffectMarkerId>, current_context_ref: Option<WorkingContextId>, reason: SafeReason, source_refs: Vec<SourceReference>) -> Result<Self, DomainError>;
    pub fn validate_for_run(&self, run: &ControlledRun) -> Result<(), DomainError>;
    pub fn requires_recovery_guard(&self) -> bool;
}
```

### 6.2 `ReflectionDecision`

```rust
pub struct ReflectionDecision {
    pub decision_id: ReflectionDecisionId,
    pub run_id: RunId,
    pub trigger_id: ReflectionTriggerId,
    pub disposition: ReflectionDisposition,
    pub next_context_request_ref: Option<TypedRef>,
    pub next_action_candidate_ref: Option<ActionCandidateId>,
    pub recovery_request_ref: Option<TypedRef>,
    pub reason: SafeReason,
    pub source_refs: Vec<SourceReference>,
    pub decided_at: Timestamp,
}

pub enum ReflectionDisposition {
    RecomposeContext,
    ReevaluateProgress,
    ProposeAlternativeAction,
    RequestRecovery,
    WaitForInput,
    Blocked,
    ManualReview,
}

impl ReflectionDecision {
    pub fn decide(decision_id: ReflectionDecisionId, trigger: &ReflectionTrigger, run: &ControlledRun, workspace: &GoalPlanWorkspace, fence: &EffectFenceSummary, now: Timestamp) -> Result<Self, DomainError>;
    pub fn permits_new_action(&self, fence: &EffectFenceSummary) -> bool;
    pub fn to_progress_inputs(&self) -> Result<DecisionInputs, DomainError>;
    pub fn to_history_fact(&self, correlation: RuntimeCorrelation) -> Result<RuntimeHistoryEntry, DomainError>;
}
```

Reflection creates a new explicit decision. It is not hidden model reasoning and cannot authorize retry across an unknown effect fence.

## 7. Object trace and tests

| Object | Protocol / Flow | State subject | Minimum tests |
|---|---|---|---|
| `ActionCandidate` | `ProposeAction` | candidate kind/scope | model source mismatch; forbidden input body; scope escape |
| `ActionDecision` | Propose/Evaluate/Submit | Action Decision | proposed cannot mean submitted; immutable supersession; version conflict |
| `ActionPreconditionInputs` | `EvaluateActionPreconditions` | input freshness | unknown governance; pending Tools/Sandbox; changed version |
| `ActionPreconditionDecision` | Evaluate/Reevaluate job | Action Guard | allowed-only submit; unknown fail-closed; decision immutable |
| `SideEffectMarker` | Submit/Feedback/Recovery | Side Effect | record-before-submit; unknown no retry; feedback identity |
| `ActionSubmissionAttempt` | `SubmitActionCandidate` | Action Attempt | guard stale; adapter reject; timeout unknown |
| `ChildContextBoundary` | `ProposeDelegation` | Child Context | parent digest mismatch; segment leak; budget expansion |
| `Delegation` | Propose/Child result consumer | Delegation | depth zero; duplicate result; parent status independence |
| `ActionFeedbackRecord` | feedback consumer | Feedback Ordering | duplicate; late; out-of-order; mismatched submission |
| `FeedbackIncorporationDecision` | Incorporate feedback | Incorporation | quarantine no marker write; unknown manual review |
| `ReflectionTrigger` | feedback/progress/recovery | Reflection Trigger | empty facts; wrong run; unknown fence |
| `ReflectionDecision` | reflection continuation | Reflection | new decision only; no hidden reasoning; no unknown retry |

## 8. Batch gate

| Check | Result |
|---|---|
| Choice, guard, attempt, external feedback and incorporation are distinct objects | pass |
| Delegation scope/context/budget/result incorporation are explicit | pass |
| Every state enum lists payloads and illegal positive inference | pass |
| Reflection is an explicit body-free local decision | pass |
| Tools/Sandbox/Governance/Hub/child owner truth remains external | pass |
| Pending upstream contracts map to blocked/unknown, not fake readiness | pass |

```text
next_allowed_action = create_step_06_checkpoint_recovery_outcome_handoff_projection_batch
```
