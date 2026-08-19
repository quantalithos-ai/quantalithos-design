# L2-runtime Step 8 protocol contracts: 17 Commands

> 状态: done
> 每个 Command 独立定义 request、result、secondary public types、handler、domain 构造、UoW、错误与 replay 语义

## 1. Command common rule

Every request embeds `CommandMetadata`; mutation handlers validate metadata, compute/verify body-free digest, reserve `(operation, idempotency_key, request_digest)`, begin local UoW, and store a typed result. A replay returns the stored result without creating a second domain fact. External calls occur only after the local intent/attempt is committed when the command crosses a side-effect seam.

## 2. Admission and control

### 2.1 `AcceptRuntimeTrigger`

```rust
pub struct AcceptRuntimeTrigger {
    pub metadata: CommandMetadata,
    pub trigger_scope: RuntimeScope,
    pub goal_refs: NonEmptyVec<TypedRef>,
    pub source_ref: SourceReference,
    pub precondition_refs: Vec<TypedRef>,
}

pub struct AdmissionResult {
    pub decision_ref: TypedRef,
    pub run_ref: Option<ControlledRunRef>,
    pub workspace_ref: Option<GoalPlanWorkspaceRef>,
    pub disposition: AdmissionDisposition,
    pub reason: SafeReason,
    pub stored_result_ref: StoredResultRef,
}
```

Handler: `RuntimeCommandHandler -> AdmissionApplicationService.accept`. Domain mapping: `RuntimeTriggerContext::create -> RuntimeAdmissionDecision::decide -> ControlledRun::create` only for `Accepted`. Reads: source availability, governance precondition, idempotency reservation. Writes in one UoW: decision, optional run/workspace, history, outbox snapshot, stored result. Errors: invalid metadata, scope violation, source pending, governance denied, version conflict, commit unknown. Non-accepted results have `run_ref = None`.

### 2.2 `ApplyRuntimeControl`

```rust
pub struct ApplyRuntimeControl {
    pub metadata: CommandMetadata,
    pub run_ref: ControlledRunRef,
    pub intent: RuntimeControlIntent,
}

pub struct ControlResult {
    pub run_ref: ControlledRunRef,
    pub decision_ref: TypedRef,
    pub disposition: ControlDisposition,
    pub run_version: RunVersion,
    pub reason: SafeReason,
    pub stored_result_ref: StoredResultRef,
}

pub enum ControlDisposition {
    Applied,
    WaitingForCheckpoint,
    Blocked,
    AlreadyTerminal,
    Replayed,
}
```

`ControlApplicationService.apply` reads run/checkpoint/unresolved effects under expected version, validates scope and local posture, applies `ControlledRun::apply_control`, appends control/history, and commits result. `Resume` requires a committed checkpoint and closed effect fence. `Cancel` and `Stop` alter local posture only; no external cleanup is inferred.

## 3. Goal, context and memory

### 3.1 `EvaluateRunProgress`

```rust
pub struct EvaluateRunProgress {
    pub metadata: CommandMetadata,
    pub run_ref: ControlledRunRef,
    pub workspace_ref: GoalPlanWorkspaceRef,
    pub inputs: DecisionInputs,
}

pub struct ProgressResult {
    pub decision_ref: TypedRef,
    pub run_ref: ControlledRunRef,
    pub workspace_ref: GoalPlanWorkspaceRef,
    pub disposition: ProgressDisposition,
    pub run_version: RunVersion,
    pub workspace_version: WorkspaceVersion,
    pub next_item_refs: Vec<TypedRef>,
    pub reason: SafeReason,
    pub stored_result_ref: StoredResultRef,
}
```

Service reads run/workspace/candidate page/source snapshots/side-effect markers, validates `DecisionInputs`, calls `RunProgressDecision::decide`, applies run/workspace transitions, appends history/outbox and stores result atomically. Missing dependency/source/effect changes produce waiting or blocked; terminal candidate requires explicit proof.

### 3.2 `ComposeWorkingContext`

```rust
pub struct ComposeWorkingContext {
    pub metadata: CommandMetadata,
    pub run_ref: ControlledRunRef,
    pub request: ContextCompositionRequest,
    pub expected_memory_version: MemoryWindowVersion,
}

pub struct ContextCompositionResult {
    pub composition_ref: TypedRef,
    pub context_ref: Option<WorkingContextRef>,
    pub memory_use_refs: Vec<MemoryUseRef>,
    pub disposition: CompositionDisposition,
    pub selected_segment_refs: Vec<SafeFragmentRef>,
    pub excluded_candidate_refs: Vec<TypedRef>,
    pub reason: SafeReason,
    pub stored_result_ref: StoredResultRef,
}

pub struct ContextCompositionRequest {
    pub candidate_request: RetrievalRequest,
    pub mandatory_segment_refs: Vec<SafeFragmentRef>,
    pub budget: ContextBudget,
    pub policy_ref: TypedRef,
}
```

Reads source availability/snapshots, memory candidates and working memory at expected window version. Domain builds `ContextCompositionDecision`, `WorkingContext`, and one `MemoryUseRecord` per considered candidate. Writes context/window/use/history in one UoW. `Partial` is allowed only when optional candidates are excluded; forbidden body, stale mandatory source and durable-memory pending map to blocked/degraded.

### 3.3 `RecordWorkingMemory`

```rust
pub struct RecordWorkingMemory {
    pub metadata: CommandMetadata,
    pub run_ref: ControlledRunRef,
    pub candidate: MemoryCandidate,
    pub expected_window_version: MemoryWindowVersion,
}

pub struct WorkingMemoryResult {
    pub memory_ref: WorkingMemoryRef,
    pub entry_ref: WorkingMemoryEntryRef,
    pub use_ref: MemoryUseRef,
    pub window_version: MemoryWindowVersion,
    pub disposition: MemoryUseDisposition,
    pub reason: SafeReason,
    pub stored_result_ref: StoredResultRef,
}
```

The service loads the run-scoped window, validates candidate scope/freshness, creates `WorkingMemoryEntry` and `MemoryUseRecord`, saves the new window and records history in one UoW. It never writes episodic/semantic durable content. Duplicate candidate identity replays or returns `Duplicate`, not a second entry.

## 4. Model commands

### 4.1 `StartModelTurn`

```rust
pub struct StartModelTurn {
    pub metadata: CommandMetadata,
    pub run_ref: ControlledRunRef,
    pub intent: ModelIntent,
    pub context_ref: WorkingContextRef,
    pub expected_run_version: RunVersion,
}

pub struct ModelTurnResult {
    pub turn_ref: ModelTurnRef,
    pub intent_ref: ModelIntentRef,
    pub submission_ref: Option<ModelSubmissionRef>,
    pub disposition: ModelTurnStartDisposition,
    pub run_version: RunVersion,
    pub reason: SafeReason,
    pub stored_result_ref: StoredResultRef,
}

pub enum ModelTurnStartDisposition {
    CandidateCommitted,
    Submitted,
    Blocked,
    Unknown,
    Replayed,
}
```

The handler loads a frozen context and run, commits intent/turn/submission candidate/history first, then calls `ModelDecisionPort::submit`. A known adapter rejection marks the turn blocked/failed in a second local transaction; an unknown call or commit result marks `ModelTurn::Unknown` with a fence. No action may be proposed from a non-classified turn.

### 4.2 `ClassifyModelResult`

```rust
pub struct ClassifyModelResult {
    pub metadata: CommandMetadata,
    pub turn_ref: ModelTurnRef,
    pub result_ref: ModelSemanticResultRef,
    pub expected_turn_version: ModelTurnVersion,
}

pub struct ModelClassificationResult {
    pub decision_ref: ModelDecisionRef,
    pub summary_ref: SafeDecisionSummaryRef,
    pub disposition: ModelDisposition,
    pub turn_version: ModelTurnVersion,
    pub stored_result_ref: StoredResultRef,
}
```

Reads turn by submission/result identity, validates body-free semantic schema and expected version, maps `ModelSemanticResult` to `ModelDecision`, builds `SafeDecisionSummary`, saves turn/decision/history/outbox atomically. Duplicate result returns existing decision; late/mismatched result is quarantined and cannot alter a prior decision.

## 5. Action and delegation commands

### 5.1 `ProposeAction`

```rust
pub struct ProposeAction {
    pub metadata: CommandMetadata,
    pub run_ref: ControlledRunRef,
    pub model_decision_ref: ModelDecisionRef,
    pub candidate: ActionCandidate,
}

pub struct ActionProposalResult {
    pub action_ref: ActionDecisionRef,
    pub disposition: ActionDecisionDisposition,
    pub stored_result_ref: StoredResultRef,
}
```

Validates model decision source, candidate scope, target refs and action budget, creates an immutable `ActionDecision::Propose`, appends history/outbox and stores result. It does not call tools, sandbox or governance and cannot return execution success.

### 5.2 `EvaluateActionPreconditions`

```rust
pub struct EvaluateActionPreconditions {
    pub metadata: CommandMetadata,
    pub action_ref: ActionDecisionRef,
    pub inputs: ActionPreconditionInputs,
    pub expected_action_version: ActionDecisionVersion,
}

pub struct ActionPreconditionResult {
    pub decision_ref: ActionPreconditionDecisionRef,
    pub action_ref: ActionDecisionRef,
    pub disposition: PreconditionDisposition,
    pub checked_versions: PreconditionVersionSet,
    pub reason: SafeReason,
    pub stored_result_ref: StoredResultRef,
}
```

Reads governance, capability, tool-contract, sandbox and source views through their Ports, evaluates once, appends guard fact and updates action anchor in one UoW. Missing/pending/unknown never becomes `Allowed`.

### 5.3 `ProposeDelegation`

```rust
pub struct ProposeDelegation {
    pub metadata: CommandMetadata,
    pub parent_run_ref: ControlledRunRef,
    pub parent_action_ref: ActionDecisionRef,
    pub child_scope: RuntimeScope,
    pub context_boundary: ChildContextBoundary,
    pub budget: DelegationBudget,
    pub goal_refs: NonEmptyVec<TypedRef>,
}

pub struct DelegationProposalResult {
    pub delegation_ref: DelegationRef,
    pub child_admission_ref: Option<DecisionRef>,
    pub disposition: DelegationStatus,
    pub stored_result_ref: StoredResultRef,
}
```

Validates child scope containment, boundary digest and budget depth, creates delegation and child admission candidate, and commits parent-local records before any child call. Child runtime/member/container lifecycle is out of scope.

### 5.4 `IncorporateActionFeedback`

```rust
pub struct IncorporateActionFeedback {
    pub metadata: CommandMetadata,
    pub event_id: EventId,
    pub feedback: ExternalActionFeedback,
    pub action_ref: ActionDecisionRef,
    pub expected_marker_version: SideEffectVersion,
}

pub struct FeedbackResult {
    pub feedback_ref: ActionFeedbackRef,
    pub marker_ref: SideEffectMarkerRef,
    pub incorporation_ref: FeedbackIncorporationDecisionRef,
    pub progress_ref: Option<RunProgressDecisionRef>,
    pub disposition: IncorporationDisposition,
    pub stored_result_ref: StoredResultRef,
}
```

Validates source event, action/submission identity and ordering, appends immutable feedback record and, only for applicable dispositions, transitions marker and creates a new progress trigger. Duplicate/late/out-of-order records are durable classifications and never rewrite prior decisions/outcomes.

## 6. Checkpoint, recovery and outcome commands

### 6.1 `PrepareRuntimeCheckpoint`

```rust
pub struct PrepareRuntimeCheckpoint {
    pub metadata: CommandMetadata,
    pub run_ref: ControlledRunRef,
    pub candidate: StableStateCandidate,
    pub effect_fence: EffectFenceSummary,
}

pub struct CheckpointPrepareResult {
    pub checkpoint_ref: RuntimeCheckpointRef,
    pub status: CheckpointStatus,
    pub state_digest: StableStateDigest,
    pub stored_result_ref: StoredResultRef,
}
```

Checks version/history/fence stability, creates `RuntimeCheckpoint::Preparing`, persists it with history in a local UoW, and does not claim physical stability.

### 6.2 `CommitRuntimeCheckpoint`

```rust
pub struct CommitRuntimeCheckpoint {
    pub metadata: CommandMetadata,
    pub run_ref: ControlledRunRef,
    pub checkpoint_ref: RuntimeCheckpointRef,
    pub commit_context: CheckpointCommitContext,
    pub expected_checkpoint_version: CheckpointVersion,
}

pub struct CheckpointCommitResult {
    pub checkpoint_ref: RuntimeCheckpointRef,
    pub status: CheckpointStatus,
    pub disposition: CheckpointCommitDisposition,
    pub commit_ref: Option<CheckpointCommitRef>,
    pub reason: SafeReason,
    pub stored_result_ref: StoredResultRef,
}
```

Requires prepared checkpoint and `CheckpointCommitPort`. Matching committed receipt transitions to `Committed`; rejected/conflict transitions to invalid/blocked; unknown remains `CommitUnknown` and schedules reconciliation/manual review. It never maps a repository call to commit proof.

### 6.3 `RequestRecoveryDecision`

```rust
pub struct RequestRecoveryDecision {
    pub metadata: CommandMetadata,
    pub run_ref: ControlledRunRef,
    pub trigger: RecoveryTrigger,
    pub requested_mode: RecoveryRequestMode,
    pub checkpoint_ref: Option<RuntimeCheckpointRef>,
    pub effect_marker_refs: Vec<SideEffectMarkerRef>,
}

pub struct RecoveryResult {
    pub decision_ref: RecoveryDecisionRef,
    pub disposition: RecoveryDisposition,
    pub next_action_ref: Option<TypedRef>,
    pub stored_result_ref: StoredResultRef,
}
```

Reads current run/checkpoint/effect fence/source availability and appends one immutable recovery decision. Resume/restart require committed stable checkpoint and closed fence; unknown maps to reconcile/wait/manual review.

### 6.4 `FinalizeRuntimeOutcome`

```rust
pub struct FinalizeRuntimeOutcome {
    pub metadata: CommandMetadata,
    pub run_ref: ControlledRunRef,
    pub terminal_progress_ref: RunProgressDecisionRef,
    pub requested_disposition: OutcomeDisposition,
    pub result_refs: Vec<TypedRef>,
    pub safe_summary_refs: Vec<TypedRef>,
    pub expected_run_version: RunVersion,
    pub effect_fence: EffectFenceSummary,
}

pub struct OutcomeResult {
    pub outcome_ref: RuntimeOutcomeRef,
    pub run_ref: ControlledRunRef,
    pub disposition: OutcomeDisposition,
    pub run_version: RunVersion,
    pub stored_result_ref: StoredResultRef,
}
```

Validates terminal progress and local fence, creates immutable `RuntimeOutcome`, updates run, appends history/outbox and stores result in one UoW. Delivery, observed and acceptance cannot alter outcome.

## 7. Handoff and source command contracts

### 7.1 `CreateHandoffCandidate`

```rust
pub struct CreateHandoffCandidate {
    pub metadata: CommandMetadata,
    pub run_ref: ControlledRunRef,
    pub outcome_ref: RuntimeOutcomeRef,
    pub safe_result_refs: Vec<TypedRef>,
    pub safe_summary_refs: Vec<TypedRef>,
    pub target_ref: HandoffTargetRef,
}

pub struct HandoffResult {
    pub material_ref: SafeHandoffMaterialRef,
    pub attempt_ref: HandoffAttemptRef,
    pub gap_ref: Option<HandoffGapRef>,
    pub disposition: HandoffAttemptStatus,
    pub stored_result_ref: StoredResultRef,
}
```

Builds body-free material and candidate attempt from committed outcome. A pending route/producer creates a gap or blocked disposition; it does not claim submission/delivery.

### 7.2 `CaptureSourceSnapshot`

```rust
pub struct CaptureSourceSnapshot {
    pub metadata: CommandMetadata,
    pub source_ref: SourceReference,
    pub freshness: FreshnessRequirement,
    pub expected_source_version: Option<SourceVersion>,
}

pub struct SourceSnapshotResult {
    pub snapshot_ref: SourceSnapshotRef,
    pub availability_ref: SourceAvailabilityRef,
    pub completeness: SnapshotCompleteness,
    pub stored_result_ref: StoredResultRef,
}
```

Resolves safe snapshot metadata and records local source marker. Owner body remains external; unavailable/pending source returns a typed pending result.

## 8. Command schema audit

| Audit | Result |
|---|---|
| 17 public Commands independently named | pass |
| Every request has typed fields and complete result DTO | pass |
| Every secondary type has explicit variants/fields | pass |
| Domain construction and Port read/write mapping present | pass |
| UoW/idempotency/error/replay behavior present | pass |
| External side-effect commands separate local commit from adapter call | pass |

```text
next_allowed_action = create_step_08_query_event_job_contracts
```
