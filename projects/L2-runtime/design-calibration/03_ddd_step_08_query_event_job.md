# L2-runtime Step 8 protocol contracts: queries, events and jobs

> 状态: done
> 当前 Step: 8
> 逐项范围: 12 Query、6 Inbound Event、6 Outbound Event、7 Operations Job

## 1. Query contracts

All Query handlers validate `QueryMetadata`, apply visibility before repository reads where possible, open no UoW, trigger no refresh/write adapter, and expose stale/degraded/rebuilding/unknown markers explicitly.

### 1.1 `GetRunStatus`

```rust
pub struct GetRunStatus { pub metadata: QueryMetadata, pub run_ref: ControlledRunRef }
pub struct RunStatusView {
    pub run_ref: ControlledRunRef,
    pub scope: RuntimeScope,
    pub status: RunStatus,
    pub version: RunVersion,
    pub current_decision_ref: Option<TypedRef>,
    pub checkpoint_ref: Option<CheckpointRef>,
    pub outcome_ref: Option<OutcomeRef>,
    pub freshness: FreshnessClaim,
}
pub struct GetRunStatusResult { pub envelope: QueryViewEnvelope<RunStatusView>, pub not_visible: bool }
```

Reads run and committed history marker; maps absent to leak-safe not-found/not-visible and unknown status remains visible as unknown.

### 1.2 `GetRunHistory`

```rust
pub struct GetRunHistory { pub metadata: QueryMetadata, pub run_ref: ControlledRunRef, pub cursor: HistoryCursor, pub limit: PageLimit, pub filter: Option<HistoryFactFilter> }
pub struct HistoryItemView {
    pub entry_ref: TypedRef,
    pub sequence: HistorySequence,
    pub fact_kind: RuntimeFactKind,
    pub causation_ref: Option<TypedRef>,
    pub correlation: RuntimeCorrelation,
    pub safe_reason: Option<SafeReason>,
    pub committed_at: Timestamp,
}
pub struct GetRunHistoryResult { pub envelope: QueryViewEnvelope<Page<HistoryItemView>> }
```

Reads append-only history using cursor/filter/scope; body refs remain body-free and page status exposes stale/degraded.

### 1.3 `GetGoalPlan`

```rust
pub struct GetGoalPlan { pub metadata: QueryMetadata, pub run_ref: ControlledRunRef, pub workspace_ref: GoalPlanWorkspaceRef }
pub struct GoalPlanView {
    pub workspace_ref: GoalPlanWorkspaceRef,
    pub run_ref: ControlledRunRef,
    pub goal_refs: Vec<TypedRef>,
    pub item_views: Vec<PlanItemView>,
    pub progress: GoalPlanProgress,
    pub constraint_refs: Vec<TypedRef>,
    pub version: WorkspaceVersion,
    pub source_refs: Vec<SourceReference>,
}
pub struct PlanItemView { pub item_ref: TypedRef, pub kind: WorkingItemKind, pub dependency_refs: Vec<TypedRef>, pub progress: ItemProgress, pub source_version: SourceVersion }
pub struct GetGoalPlanResult { pub envelope: QueryViewEnvelope<GoalPlanView> }
```

Reads working-only workspace; never reads Method/Process body or treats item success as external completion.

### 1.4 `GetWorkingContext`

```rust
pub struct GetWorkingContext { pub metadata: QueryMetadata, pub context_ref: WorkingContextRef }
pub struct WorkingContextView {
    pub context_ref: WorkingContextRef,
    pub run_ref: ControlledRunRef,
    pub composition_ref: TypedRef,
    pub segment_views: Vec<ContextSegmentView>,
    pub status: WorkingContextStatus,
    pub total_weight: ContextWeight,
    pub digest: ContextDigest,
    pub version: ContextVersion,
}
pub struct ContextSegmentView { pub segment_ref: SafeFragmentRef, pub source_ref: SourceReference, pub source_version: SourceVersion, pub kind: ContextSegmentKind, pub position: SegmentPosition, pub redaction: RedactionMarker }
pub struct GetWorkingContextResult { pub envelope: QueryViewEnvelope<WorkingContextView> }
```

Only safe fragment references and redaction markers are exposed; frozen context is immutable and degraded context remains marked.

### 1.5 `GetMemoryUse`

```rust
pub struct GetMemoryUse { pub metadata: QueryMetadata, pub run_ref: ControlledRunRef, pub cursor: MemoryUseCursor, pub limit: PageLimit }
pub struct MemoryUseView { pub use_ref: MemoryUseRef, pub candidate_ref: TypedRef, pub source_ref: SourceReference, pub decision_ref: TypedRef, pub context_ref: WorkingContextRef, pub disposition: MemoryUseDisposition, pub recorded_at: Timestamp }
pub struct GetMemoryUseResult { pub envelope: QueryViewEnvelope<Page<MemoryUseView>> }
```

Reads Runtime-owned use records only, never durable memory body.

### 1.6 `GetModelTurn`

```rust
pub struct GetModelTurn { pub metadata: QueryMetadata, pub turn_ref: ModelTurnRef }
pub struct ModelTurnView { pub turn_ref: ModelTurnRef, pub run_ref: ControlledRunRef, pub intent_ref: ModelIntentRef, pub context_ref: WorkingContextRef, pub status: ModelTurnStatus, pub submission_ref: Option<ModelSubmissionRef>, pub result_ref: Option<ModelSemanticResultRef>, pub version: ModelTurnVersion }
pub struct GetModelTurnResult { pub envelope: QueryViewEnvelope<ModelTurnView> }
```

No raw model request/response or provider route is returned.

### 1.7 `GetActionState`

```rust
pub struct GetActionState { pub metadata: QueryMetadata, pub action_ref: ActionDecisionRef }
pub struct ActionStateView { pub action_ref: ActionDecisionRef, pub run_ref: ControlledRunRef, pub candidate_kind: ActionCandidateKind, pub target_ref: TypedRef, pub decision: ActionDecisionDisposition, pub guard_ref: Option<ActionPreconditionDecisionRef>, pub marker_ref: Option<SideEffectMarkerRef>, pub source_refs: Vec<SourceReference>, pub version: ActionDecisionVersion }
pub struct GetActionStateResult { pub envelope: QueryViewEnvelope<ActionStateView> }
```

Choice, guard and effect marker are separately visible; no execution success inference.

### 1.8 `GetDelegationState`

```rust
pub struct GetDelegationState { pub metadata: QueryMetadata, pub delegation_ref: DelegationRef }
pub struct DelegationView { pub delegation_ref: DelegationRef, pub parent_run_ref: ControlledRunRef, pub child_scope: RuntimeScope, pub context_boundary_ref: ChildContextBoundaryRef, pub budget: DelegationBudget, pub status: DelegationStatus, pub child_run_ref: Option<ChildRunRef>, pub child_result_ref: Option<ChildResultRef>, pub version: DelegationVersion }
pub struct GetDelegationStateResult { pub envelope: QueryViewEnvelope<DelegationView> }
```

Child status is a ref/projection; parent completion requires explicit incorporation.

### 1.9 `GetCheckpointState`

```rust
pub struct GetCheckpointState { pub metadata: QueryMetadata, pub run_ref: ControlledRunRef, pub checkpoint_ref: Option<RuntimeCheckpointRef> }
pub struct CheckpointView { pub checkpoint_ref: Option<RuntimeCheckpointRef>, pub run_ref: ControlledRunRef, pub status: CheckpointStatus, pub state_digest: Option<StableStateDigest>, pub effect_fence_digest: Option<EffectFenceDigest>, pub history_sequence: Option<HistorySequence>, pub commit_ref: Option<CheckpointCommitRef>, pub version: Option<CheckpointVersion> }
pub struct GetCheckpointStateResult { pub envelope: QueryViewEnvelope<CheckpointView> }
```

`Prepared` and `CommitUnknown` are distinct from `Committed`; query does not qualify physical persistence.

### 1.10 `GetRuntimeOutcome`

```rust
pub struct GetRuntimeOutcome { pub metadata: QueryMetadata, pub run_ref: ControlledRunRef }
pub struct RuntimeOutcomeView { pub outcome_ref: Option<RuntimeOutcomeRef>, pub run_ref: ControlledRunRef, pub disposition: Option<OutcomeDisposition>, pub terminal_decision_ref: Option<TypedRef>, pub result_refs: Vec<TypedRef>, pub safe_summary_refs: Vec<TypedRef>, pub effect_fence_digest: Option<EffectFenceDigest>, pub finalized_at: Option<Timestamp> }
pub struct GetRuntimeOutcomeResult { pub envelope: QueryViewEnvelope<RuntimeOutcomeView> }
```

No downstream delivery/acceptance/observed field is mapped into the view.

### 1.11 `GetHandoffState`

```rust
pub struct GetHandoffState { pub metadata: QueryMetadata, pub attempt_ref: Option<HandoffAttemptRef>, pub gap_ref: Option<HandoffGapRef> }
pub struct HandoffView { pub attempt_ref: Option<HandoffAttemptRef>, pub gap_ref: Option<HandoffGapRef>, pub material_ref: Option<SafeHandoffMaterialRef>, pub attempt_status: Option<HandoffAttemptStatus>, pub gap_status: Option<HandoffGapStatus>, pub acknowledgement_ref: Option<AcknowledgementRef>, pub digest: Option<HandoffMaterialDigest>, pub freshness: FreshnessClaim }
pub struct GetHandoffStateResult { pub envelope: QueryViewEnvelope<HandoffView> }
```

Acknowledgement is a contract receipt only; an open/unknown gap remains visible.

### 1.12 `GetProjectionState`

```rust
pub struct GetProjectionState { pub metadata: QueryMetadata, pub projection_id: ProjectionId }
pub struct ProjectionStateView { pub projection_id: ProjectionId, pub name: ProjectionName, pub status: ProjectionStatus, pub cursor: ProjectionCursor, pub source_history_sequence: Option<HistorySequence>, pub source_run_version: Option<RunVersion>, pub rebuild_id: Option<ProjectionRebuildId>, pub gap_refs: Vec<ProjectionGapRef>, pub version: ProjectionVersion, pub updated_at: Timestamp }
pub struct GetProjectionStateResult { pub envelope: QueryViewEnvelope<ProjectionStateView> }
```

`Current` requires caught-up committed history; stale/rebuilding/degraded/unknown are valid result postures.

## 2. Inbound event contracts

### 2.1 `ModelResultAvailable`

```rust
pub struct ModelResultAvailable { pub submission_ref: ModelSubmissionRef, pub turn_ref: ModelTurnRef, pub result: ModelSemanticResult, pub source_event_ref: EventId }
```

Consumer: `ModelTurnApplicationService.consume_result`. Validates submission/turn/correlation/schema/body-free semantic result; duplicate links existing decision, late/out-of-order quarantines, unknown produces fenced turn. Result is `EventReceipt`.

### 2.2 `ActionFeedbackReceived`

```rust
pub struct ActionFeedbackReceived { pub action_ref: ActionDecisionRef, pub marker_ref: SideEffectMarkerRef, pub feedback: ExternalActionFeedback, pub source_event_ref: EventId }
```

Consumer: `FeedbackApplicationService.consume_action`. Validates Tools/Sandbox source owner, submission identity and ordering; appends `ActionFeedbackRecord`, then conditionally transitions marker. Does not own execution or cleanup truth.

### 2.3 `ChildResultAvailable`

```rust
pub struct ChildResultAvailable { pub delegation_ref: DelegationRef, pub child_run_ref: ChildRunRef, pub result: ChildResultEnvelope, pub source_event_ref: EventId }
```

Consumer: `DelegationApplicationService.incorporate_result`. Requires matching delegation/scope/correlation, records result once and appends parent incorporation history. Child result disposition never directly changes parent outcome.

### 2.4 `SourceSnapshotChanged`

```rust
pub struct SourceSnapshotChanged { pub source_ref: SourceReference, pub snapshot_ref: SourceSnapshotRef, pub availability: SourceAvailability, pub source_event_ref: EventId, pub change_kind: SourceChangeKind }
```

Consumer: `SourceCaptureApplicationService.consume_change`. Verifies owner/version/freshness, records new source marker and marks affected working context/projection stale. No source body is copied.

### 2.5 `GovernancePreconditionChanged`

```rust
pub struct GovernancePreconditionChanged { pub decision_ref: FormalDecisionRef, pub policy_ref: PolicyRef, pub scope: RuntimeScope, pub disposition: GovernanceDisposition, pub effective_version: SourceVersion, pub source_event_ref: EventId }
```

Consumer: action/admission service records an imported precondition view and creates new blocked/progress decision where required. It cannot create/alter Governance approval truth.

### 2.6 `HandoffAcknowledgementReceived`

```rust
pub struct HandoffAcknowledgementReceived { pub attempt_ref: HandoffAttemptRef, pub acknowledgement: HandoffAcknowledgement, pub source_event_ref: EventId }
```

Consumer: `HandoffApplicationService.consume_acknowledgement`. Requires matching attempt/submission/source; closes a gap only when acknowledgement is verified. It never changes local outcome or implies business acceptance.

## 3. Outbound event contracts

Outbound payloads are independently materialized from commit-time outbox snapshots, not rebuilt from mutable current truth.

### 3.1 `RuntimeFactCommitted`

```rust
pub struct RuntimeFactCommitted { pub fact_ref: TypedRef, pub fact_kind: RuntimeFactKind, pub run_ref: ControlledRunRef, pub version: RunVersion, pub correlation: RuntimeCorrelation, pub safe_summary_refs: Vec<TypedRef> }
```

Emitted when the local fact/history UoW commits. It does not claim Bus delivery or Observability observed.

### 3.2 `RuntimeDecisionCommitted`

```rust
pub struct RuntimeDecisionCommitted { pub decision_ref: TypedRef, pub decision_kind: DecisionKind, pub disposition: DecisionDisposition, pub source_refs: Vec<SourceReference>, pub version: DecisionVersion, pub correlation: RuntimeCorrelation }
```

Emitted after decision/history commit. It does not imply Governance approval or action authorization.

### 3.3 `ActionSubmissionAttempted`

```rust
pub struct ActionSubmissionAttempted { pub action_ref: ActionDecisionRef, pub attempt_ref: ActionAttemptRef, pub marker_ref: SideEffectMarkerRef, pub target: ActionSubmissionTarget, pub disposition: ActionAttemptStatus, pub scope: RuntimeScope, pub correlation: RuntimeCorrelation }
```

Emitted after local attempt/marker commit. It means a submission candidate was recorded, not tool execution.

### 3.4 `RuntimeOutcomeCommitted`

```rust
pub struct RuntimeOutcomeCommitted { pub outcome_ref: RuntimeOutcomeRef, pub run_ref: ControlledRunRef, pub disposition: OutcomeDisposition, pub result_refs: Vec<TypedRef>, pub safe_summary_refs: Vec<TypedRef>, pub version: OutcomeVersion, pub correlation: RuntimeCorrelation }
```

Emitted after local outcome commit. It does not imply artifact acceptance, observed status or product completion.

### 3.5 `HandoffAttempted`

```rust
pub struct HandoffAttempted { pub attempt_ref: HandoffAttemptRef, pub material_ref: SafeHandoffMaterialRef, pub gap_ref: Option<HandoffGapRef>, pub digest: HandoffMaterialDigest, pub status: HandoffAttemptStatus, pub correlation: RuntimeCorrelation }
```

Emitted after attempt candidate/blocked/gap local commit. Delivery, acknowledgement and acceptance are independent.

### 3.6 `ProjectionMarkedStale`

```rust
pub struct ProjectionMarkedStale { pub projection_id: ProjectionId, pub source_run_version: RunVersion, pub history_sequence: HistorySequence, pub reason: SafeReason, pub correlation: RuntimeCorrelation }
```

Emitted after a committed fact makes a projection known stale. It does not claim rebuild/current or Observability observed.

## 4. Operations job contracts

### 4.1 `RebuildSafeRuntimeViews`

```rust
pub struct RebuildSafeRuntimeViews { pub metadata: JobMetadata, pub projection_id: ProjectionId, pub run_ref: ControlledRunRef, pub from_cursor: ProjectionCursor, pub source_watermark: Option<RunVersion> }
pub struct ProjectionJobReport { pub base: JobPageReport, pub rebuild_id: ProjectionRebuildId, pub projection_state_ref: ProjectionStateRef, pub view_refs: Vec<SafeRuntimeViewRef>, pub gap_refs: Vec<ProjectionGapRef> }
```

Reads committed history pages, writes projection pages under cursor, and returns rebuilding/current/stale/degraded. It cannot write domain truth.

### 4.2 `RefreshSourceSnapshots`

```rust
pub struct RefreshSourceSnapshots { pub metadata: JobMetadata, pub source_refs: Vec<SourceReference>, pub freshness: FreshnessRequirement, pub cursor: SourceCursor }
pub struct SourceRefreshReport { pub base: JobPageReport, pub availability_refs: Vec<SourceAvailabilityRef>, pub snapshot_refs: Vec<SourceSnapshotRef> }
```

Resolves each source through `SourceResolverPort`; pending/unknown/stale are recorded, never converted to available by design-file/fake/ping.

### 4.3 `CompactWorkingMemory`

```rust
pub struct CompactWorkingMemory { pub metadata: JobMetadata, pub run_ref: ControlledRunRef, pub memory_ref: WorkingMemoryRef, pub expected_window_version: MemoryWindowVersion, pub budget: MemoryBudget }
pub struct MemoryCompactionReport { pub base: JobPageReport, pub memory_ref: WorkingMemoryRef, pub new_window_version: Option<MemoryWindowVersion>, pub compaction_ref: Option<CompactionDecisionRef> }
```

Uses explicit compaction policy, preserves source history and writes new window version; commit unknown leaves old window and marks blocked/unknown.

### 4.4 `ResumeEligibleRuns`

```rust
pub struct ResumeEligibleRuns { pub metadata: JobMetadata, pub cursor: RecoveryCursor, pub limit: PageLimit, pub scope: RuntimeScope }
pub struct RecoveryJobReport { pub base: JobPageReport, pub decision_refs: Vec<RecoveryDecisionRef>, pub resumed_run_refs: Vec<ControlledRunRef>, pub manual_review_refs: Vec<RecoveryDecisionRef> }
```

Reads only candidates with committed stable checkpoint and closed fence. Each candidate gets a new recovery decision; no external action retry occurs in the scan.

### 4.5 `ReconcileUnknownEffects`

```rust
pub struct ReconcileUnknownEffects { pub metadata: JobMetadata, pub run_ref: ControlledRunRef, pub marker_cursor: EffectCursor, pub checkpoint_cursor: RecoveryCursor, pub limit: PageLimit }
pub struct UnknownEffectReport { pub base: JobPageReport, pub marker_refs: Vec<SideEffectMarkerRef>, pub checkpoint_refs: Vec<RuntimeCheckpointRef>, pub recovery_refs: Vec<RecoveryDecisionRef> }
```

Reads marker/checkpoint unknown pages and verified feedback/status queries; absence of a positive fact keeps unknown and may produce manual review.

### 4.6 `ReconcileHandoffGaps`

```rust
pub struct ReconcileHandoffGaps { pub metadata: JobMetadata, pub cursor: HandoffCursor, pub limit: PageLimit, pub scope: RuntimeScope }
pub struct HandoffReconciliationReport { pub base: JobPageReport, pub reconciliation_refs: Vec<HandoffReconciliationRef>, pub closed_gap_refs: Vec<HandoffGapRef>, pub open_gap_refs: Vec<HandoffGapRef> }
```

Reads open/unknown attempts/gaps and verified acknowledgement refs. No source means gap remains open/unknown; no self-close.

### 4.7 `PublishRuntimeOutbox`

```rust
pub struct PublishRuntimeOutbox { pub metadata: JobMetadata, pub cursor: OutboxCursor, pub limit: PageLimit }
pub struct OutboxPublishReport { pub base: JobPageReport, pub published_entry_refs: Vec<OutboxEntryRef>, pub pending_entry_refs: Vec<OutboxEntryRef>, pub unknown_entry_refs: Vec<OutboxEntryRef> }
```

Publishes stored commit-time snapshots with stable event identity. Publish/receipt unknown leaves entry pending/unknown and never creates a fresh payload from current truth.

## 5. Protocol closure audit

| Audit | Result |
|---|---|
| 12 Query requests/results have independent view schemas | pass |
| 6 inbound payloads have source identity, event ID, ordering and consumer mapping | pass |
| 6 outbound payloads have independent commit-time schemas | pass |
| 7 job requests/reports have independent cursor/lease/count fields | pass |
| Query no-write and event receipt semantics explicit | pass |
| Body-free/ref-only/redaction boundary explicit | pass |
| 17 Command count follows current 02; old 15 count recorded historical | pass |

```text
next_allowed_action = start_step_09_individual_command_query_event_job_flows
```
