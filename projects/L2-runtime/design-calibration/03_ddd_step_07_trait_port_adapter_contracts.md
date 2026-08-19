# L2-runtime 03 详细设计 Step 7: 逐 Port / Adapter / Fake 实现契约

> 创建日期: 2026-08-09
> 状态: in_progress
> 当前模式: controlled_reopen
> 直接输入: Step 6 四个对象契约 annex
> 本 Step 目标: 让实现 Agent 不需要猜每个 Port 的读面、写面、版本、游标、事务参与、错误映射和 fake 行为

## 0. 小循环顺序

| 批次 | Port 组 | 对应能力 | 状态 |
|---:|---|---|---|
| 7.1 | technical + local truth repositories | CAP-01~03 | done |
| 7.2 | source/context/memory/model repositories and adapters | CAP-04~06 | done |
| 7.3 | governance/capability/tools/sandbox/child/action/feedback | CAP-07~09 | done |
| 7.4 | checkpoint/recovery/outcome/handoff/projection/event/job | CAP-10~12 | done |
| 7.5 | adapter availability, builder binding and fake contract audit | cross-cut | in_progress |

所有 Port 均为 planned trait-shaped contract。`async` 只出现在 application/infra/event/job I/O seam；domain validator 不得通过 Port 读取数据。未闭合上游只返回 `PendingContract`、`Blocked`、`Unavailable` 或 `Unknown`，不得由 fake 伪造正向资格。

## 1. Common method contract

每个方法必须能回答：caller；authority/owner；read/write surface；scope；version/cursor/ordering；UoW；错误；fake。方法参数不得使用未类型化集合或 `Any`。

### 1.1 Technical Ports

```rust
/// Provides one monotonic operation timestamp; it owns no persisted time truth.
pub trait ClockPort: Send + Sync {
    /// Returns the current timestamp used for a domain decision.
    fn now(&self) -> Timestamp;
}

/// Allocates typed local identities without deriving IDs from display text.
pub trait IdGeneratorPort: Send + Sync {
    /// Allocates one identity of the requested kind.
    fn next_id(&self, kind: IdKind) -> Result<TypedId, TechnicalError>;
}

/// Computes deterministic digests over body-free canonical values.
pub trait DigestPort: Send + Sync {
    /// Computes the request or state digest.
    fn digest(&self, value: BodyFreeCanonicalValue) -> Result<RequestDigest, DigestError>;
}

/// Provides a bounded transaction handle for one local mutation.
pub trait UnitOfWorkPort: Send + Sync {
    /// Opens a transaction for one operation identity.
    async fn begin(&self, metadata: OperationMetadata) -> Result<UnitOfWork, TransactionError>;
    /// Commits all enlisted local writes and returns known or unknown status.
    async fn commit(&self, uow: UnitOfWork) -> Result<CommitReceipt, CommitError>;
    /// Rolls back uncommitted local writes; unknown rollback is explicit.
    async fn rollback(&self, uow: UnitOfWork, cause: RollbackCause) -> Result<RollbackReceipt, RollbackError>;
}

/// Reserves command identity and stores replayable local results.
pub trait IdempotencyPort: Send + Sync {
    /// Reserves operation/key/digest before domain mutation.
    async fn reserve(&self, operation: OperationName, key: IdempotencyKey, digest: RequestDigest, uow: &UnitOfWork) -> Result<IdempotencyReservation, IdempotencyError>;
    /// Reads a previously stored result without mutating domain truth.
    async fn get_stored_result(&self, operation: OperationName, key: IdempotencyKey) -> Result<Option<StoredOperationResult>, IdempotencyError>;
    /// Stores the committed result in the caller's transaction.
    async fn store_result(&self, reservation: IdempotencyReservation, result: StoredOperationResult, uow: &UnitOfWork) -> Result<(), CommitError>;
}

/// Claims a continuation/job partition; it does not authorize external side effects.
pub trait LeasePort: Send + Sync {
    /// Claims a lease for a bounded duration.
    async fn claim(&self, key: LeaseKey, ttl: LeaseTtl, owner: LeaseOwner) -> Result<LeaseClaim, LeaseError>;
    /// Renews only a matching live claim.
    async fn renew(&self, claim: LeaseClaim, ttl: LeaseTtl) -> Result<LeaseClaim, LeaseError>;
    /// Releases a matching claim and returns the release disposition.
    async fn release(&self, claim: LeaseClaim) -> Result<LeaseReleaseReceipt, LeaseError>;
}

/// Reads an immutable validated configuration snapshot for operation capture.
/// Reloading publishes a new snapshot; it never mutates a snapshot already
/// captured by an in-flight command, event consumer, query, or job page.
pub trait RuntimeConfigSnapshotPort: Send + Sync {
    fn current_snapshot(&self) -> Result<RuntimeConfigSnapshot, ConfigError>;
    fn snapshot_by_ref(
        &self,
        snapshot_ref: ConfigSnapshotRef,
    ) -> Result<RuntimeConfigSnapshot, ConfigError>;
}
```

| Port | Caller | Authority | Read/write | Version/cursor | UoW | Error mapping | Fake |
|---|---|---|---|---|---|---|---|
| `ClockPort` | all services | local clock source | read time | none | none | `ClockUnavailable` only for fallible wrapper | fixed sequence or injected timestamp |
| `IdGeneratorPort` | command/event/job services | local ID allocator | allocate ID | uniqueness guarantee | outside UoW but reservation required | `IdUnavailable` -> blocked | deterministic per-kind queue; exhaustion is failure |
| `DigestPort` | protocol/application/domain | canonicalization rule | read input, return digest | schema version in input | none | `DigestMismatch`/`DigestUnavailable` | deterministic hash; rejects forbidden body |
| `UnitOfWorkPort` | mutating application services | Runtime persistence boundary | begin/commit/rollback | UoW identity + commit disposition | owns transaction | unknown commit never mapped to success | in-memory atomic log with injectable unknown commit |
| `IdempotencyPort` | every Command and consumer | Runtime operation identity | reservation/result write; replay read | key + operation + digest | reserve/store enlisted | same digest replay; different digest conflict | map keyed by operation/key; explicit conflict |
| `LeasePort` | jobs/recovery/continuation | local job lease owner | claim/renew/release | lease token + expiry | separate lease store | lost lease -> stop page | deterministic claim expiry and owner mismatch |

## 2. Runtime truth repository Ports

```rust
/// Reads and version-checks the local run aggregate.
pub trait RunRepositoryPort: Send + Sync {
    /// Reads a run at a caller-selected read version.
    async fn get(&self, run_id: RunId, version: ReadVersion, scope: ReadScope) -> Result<ControlledRun, RepositoryError>;
    /// Reads a run while reserving its expected version for mutation.
    async fn get_for_update(&self, run_id: RunId, expected: RunVersion, scope: RuntimeScope) -> Result<ControlledRun, RepositoryError>;
    /// Persists one domain transition in the supplied UoW.
    async fn save(&self, run: ControlledRun, expected: RunVersion, uow: &UnitOfWork) -> Result<CommitReceipt, CommitError>;
    /// Returns bounded candidates with stable checkpoint and known effect fence only.
    async fn list_resume_eligible(&self, cursor: RecoveryCursor, limit: PageLimit, scope: RuntimeScope) -> Result<Page<RunRecoveryCandidate>, RepositoryError>;
}

/// Persists run-scoped goal/plan working state.
pub trait GoalPlanRepositoryPort: Send + Sync {
    /// Loads a workspace for a read-only decision input.
    async fn get(&self, workspace_id: GoalPlanWorkspaceId, version: ReadVersion, scope: ReadScope) -> Result<GoalPlanWorkspace, RepositoryError>;
    /// Loads a workspace with an expected version for mutation.
    async fn get_for_update(&self, workspace_id: GoalPlanWorkspaceId, expected: WorkspaceVersion, scope: RuntimeScope) -> Result<GoalPlanWorkspace, RepositoryError>;
    /// Saves the complete working workspace transition.
    async fn save(&self, workspace: GoalPlanWorkspace, expected: WorkspaceVersion, uow: &UnitOfWork) -> Result<CommitReceipt, CommitError>;
    /// Pages candidate items using an opaque plan cursor.
    async fn list_candidates(&self, run_id: RunId, cursor: PlanCursor, limit: PageLimit, scope: ReadScope) -> Result<Page<WorkingPlanItem>, RepositoryError>;
}

/// Appends immutable local facts and pages them for projections/replay.
pub trait HistoryRepositoryPort: Send + Sync {
    /// Appends one fact at a strictly increasing run sequence.
    async fn append(&self, entry: RuntimeHistoryEntry, expected_sequence: HistorySequence, uow: &UnitOfWork) -> Result<AppendReceipt, CommitError>;
    /// Reads committed history under visibility and cursor constraints.
    async fn list_by_run(&self, run_id: RunId, cursor: HistoryCursor, limit: PageLimit, scope: ReadScope) -> Result<Page<RuntimeHistoryEntry>, RepositoryError>;
    /// Reads facts for one correlation without changing order.
    async fn list_by_correlation(&self, correlation: RuntimeCorrelation, cursor: HistoryCursor, limit: PageLimit, scope: ReadScope) -> Result<Page<RuntimeHistoryEntry>, RepositoryError>;
    /// Finds the local history entry that anchors a typed fact reference.
    async fn find_fact(&self, fact_ref: TypedRef, scope: ReadScope) -> Result<Option<RuntimeHistoryEntry>, RepositoryError>;
}

/// Stores model/decision and reflection facts owned by Runtime.
pub trait DecisionRepositoryPort: Send + Sync {
    /// Reads one provider-neutral model decision.
    async fn get_model_decision(&self, decision_id: DecisionId, scope: ReadScope) -> Result<ModelDecision, RepositoryError>;
    /// Appends a model decision with expected turn version.
    async fn append_model_decision(&self, decision: ModelDecision, expected: ModelTurnVersion, uow: &UnitOfWork) -> Result<AppendReceipt, CommitError>;
    /// Reads one reflection decision by its immutable identity.
    async fn get_reflection(&self, decision_id: ReflectionDecisionId, scope: ReadScope) -> Result<ReflectionDecision, RepositoryError>;
    /// Appends one reflection decision without updating prior facts.
    async fn append_reflection(&self, decision: ReflectionDecision, uow: &UnitOfWork) -> Result<AppendReceipt, CommitError>;
}

/// Stores Runtime action choices and versioned precondition decisions.
pub trait ActionRepositoryPort: Send + Sync {
    /// Reads one action choice under read visibility.
    async fn get(&self, action_id: ActionDecisionId, version: ReadVersion, scope: ReadScope) -> Result<ActionDecision, RepositoryError>;
    /// Reads one action choice for a guarded mutation.
    async fn get_for_update(&self, action_id: ActionDecisionId, expected: ActionDecisionVersion, scope: RuntimeScope) -> Result<ActionDecision, RepositoryError>;
    /// Saves one action choice transition in the caller transaction.
    async fn save(&self, action: ActionDecision, expected: ActionDecisionVersion, uow: &UnitOfWork) -> Result<CommitReceipt, CommitError>;
}

/// Appends immutable action guard decisions.
pub trait ActionPreconditionRepositoryPort: Send + Sync {
    /// Reads the newest guard decision for an action.
    async fn get_latest(&self, action_id: ActionDecisionId, scope: ReadScope) -> Result<Option<ActionPreconditionDecision>, RepositoryError>;
    /// Appends a new guard decision without rewriting prior decisions.
    async fn append(&self, decision: ActionPreconditionDecision, uow: &UnitOfWork) -> Result<AppendReceipt, CommitError>;
}

/// Stores local side-effect uncertainty markers and unresolved-page cursors.
pub trait SideEffectRepositoryPort: Send + Sync {
    /// Reads one marker for a guarded mutation.
    async fn get_for_update(&self, marker_id: SideEffectMarkerId, expected: SideEffectVersion, scope: RuntimeScope) -> Result<SideEffectMarker, RepositoryError>;
    /// Pages unresolved markers for checkpoint/recovery decisions.
    async fn list_unresolved(&self, run_id: RunId, cursor: EffectCursor, limit: PageLimit, scope: RuntimeScope) -> Result<Page<SideEffectMarker>, RepositoryError>;
    /// Saves one marker transition in the caller transaction.
    async fn save(&self, marker: SideEffectMarker, expected: SideEffectVersion, uow: &UnitOfWork) -> Result<CommitReceipt, CommitError>;
}

/// Stores parent-child delegation lifecycle records.
pub trait DelegationRepositoryPort: Send + Sync {
    /// Reads one delegation for query or result incorporation.
    async fn get(&self, delegation_id: DelegationId, version: ReadVersion, scope: ReadScope) -> Result<Delegation, RepositoryError>;
    /// Reads one delegation for a versioned transition.
    async fn get_for_update(&self, delegation_id: DelegationId, expected: DelegationVersion, scope: RuntimeScope) -> Result<Delegation, RepositoryError>;
    /// Saves one delegation transition in the caller transaction.
    async fn save(&self, delegation: Delegation, expected: DelegationVersion, uow: &UnitOfWork) -> Result<CommitReceipt, CommitError>;
}

/// Stores source availability markers without owning source body.
pub trait SourceReferenceRepositoryPort: Send + Sync {
    /// Reads a typed source reference under visibility.
    async fn get(&self, source_ref_id: SourceReferenceId, scope: ReadScope) -> Result<SourceReference, RepositoryError>;
    /// Saves a versioned local availability marker.
    async fn save_availability(&self, availability: SourceAvailability, expected: AvailabilityVersion, uow: &UnitOfWork) -> Result<CommitReceipt, CommitError>;
}

/// Stores handoff attempt/gap lifecycle without claiming delivery.
pub trait HandoffRepositoryPort: Send + Sync {
    /// Reads one handoff attempt.
    async fn get_attempt(&self, attempt_id: HandoffAttemptId, scope: ReadScope) -> Result<HandoffAttempt, RepositoryError>;
    /// Reads one gap under expected version for reconciliation.
    async fn get_gap_for_update(&self, gap_id: HandoffGapId, expected: HandoffGapVersion, scope: RuntimeScope) -> Result<HandoffGap, RepositoryError>;
    /// Saves one attempt transition in the caller transaction.
    async fn save_attempt(&self, attempt: HandoffAttempt, expected: HandoffAttemptVersion, uow: &UnitOfWork) -> Result<CommitReceipt, CommitError>;
    /// Saves one gap transition in the caller transaction.
    async fn save_gap(&self, gap: HandoffGap, expected: HandoffGapVersion, uow: &UnitOfWork) -> Result<CommitReceipt, CommitError>;
    /// Pages open and unknown gaps with stable cursor ordering.
    async fn list_open_gaps(&self, cursor: HandoffCursor, limit: PageLimit, scope: RuntimeScope) -> Result<Page<HandoffGap>, RepositoryError>;
}

/// Stores immutable action submission attempts.
pub trait ActionAttemptRepositoryPort: Send + Sync {
    /// Reads one attempt by identity.
    async fn get(&self, attempt_id: ActionAttemptId, scope: ReadScope) -> Result<ActionSubmissionAttempt, RepositoryError>;
    /// Appends an attempt before crossing an external side-effect seam.
    async fn append(&self, attempt: ActionSubmissionAttempt, uow: &UnitOfWork) -> Result<AppendReceipt, CommitError>;
}

/// Stores memory-use records independently from memory-owner content.
pub trait MemoryUseRepositoryPort: Send + Sync {
    /// Appends one candidate disposition for a composition decision.
    async fn append(&self, record: MemoryUseRecord, uow: &UnitOfWork) -> Result<AppendReceipt, CommitError>;
    /// Pages use records for one run and composition decision.
    async fn list_by_run(&self, run_id: RunId, cursor: MemoryUseCursor, limit: PageLimit, scope: ReadScope) -> Result<Page<MemoryUseRecord>, RepositoryError>;
}

/// Stores reflection decisions and trigger records.
pub trait ReflectionRepositoryPort: Send + Sync {
    /// Appends one reflection trigger.
    async fn append_trigger(&self, trigger: ReflectionTrigger, uow: &UnitOfWork) -> Result<AppendReceipt, CommitError>;
    /// Appends one reflection decision.
    async fn append_decision(&self, decision: ReflectionDecision, uow: &UnitOfWork) -> Result<AppendReceipt, CommitError>;
}

/// Stores recovery continuation and job state carriers.
pub trait RecoveryContinuationRepositoryPort: Send + Sync {
    /// Reads one continuation under lease scope.
    async fn get_for_update(&self, continuation_id: RecoveryContinuationId, expected: ContinuationVersion, scope: RuntimeScope) -> Result<RecoveryContinuation, RepositoryError>;
    /// Saves a continuation page transition.
    async fn save(&self, continuation: RecoveryContinuation, expected: ContinuationVersion, uow: &UnitOfWork) -> Result<CommitReceipt, CommitError>;
}

/// Stores event inbox reservations and durable consumer dispositions.
pub trait EventInboxPort: Send + Sync {
    /// Reserves one source event identity before consumer mutation.
    async fn reserve(&self, event_id: EventId, source_owner: OwnerRef, digest: EventDigest, uow: &UnitOfWork) -> Result<EventInboxReservation, ConsumerError>;
    /// Stores the final consumer disposition in the same local transaction where possible.
    async fn store_receipt(&self, reservation: EventInboxReservation, receipt: ConsumerReceipt, uow: &UnitOfWork) -> Result<(), CommitError>;
}

/// Stores outbox snapshots created with local commits.
pub trait OutboxRepositoryPort: Send + Sync {
    /// Appends one commit-time event snapshot in the caller transaction.
    async fn append(&self, snapshot: CommittedEventSnapshot, uow: &UnitOfWork) -> Result<OutboxEntryId, CommitError>;
    /// Pages unpublished entries with monotonic cursor.
    async fn list_pending(&self, cursor: OutboxCursor, limit: PageLimit) -> Result<Page<OutboxEntry>, PublishError>;
}

/// Stores bounded job state and cursor/report records.
pub trait JobStateRepositoryPort: Send + Sync {
    /// Reads one job partition under expected version.
    async fn get_for_update(&self, operation: JobOperation, partition: JobPartition, expected: JobStateVersion) -> Result<JobStateRecord, RepositoryError>;
    /// Saves one page outcome and advances cursor atomically.
    async fn save_page(&self, state: JobStateRecord, expected: JobStateVersion, outcome: JobPageOutcome, uow: &UnitOfWork) -> Result<CommitReceipt, CommitError>;
}
```

| Port | Caller | Authority | Read/write | Version/cursor/ordering | UoW | Errors | Fake semantics |
|---|---|---|---|---|---|---|---|
| `RunRepositoryPort` | admission/control/progress/recovery/query | Runtime `ControlledRun` | run read/write | `RunVersion`; recovery cursor | save in caller UoW | not found, scope, version, commit unknown | map-backed aggregate with conflict injection |
| `GoalPlanRepositoryPort` | admission/progress/query | Runtime working workspace | workspace read/write; candidate page | `WorkspaceVersion`, `PlanCursor` | save in caller UoW | unresolved dependency, cursor invalid | deterministic page and version conflict |
| `HistoryRepositoryPort` | all mutations, projections, queries | Runtime append-only history | append/read only | strict `HistorySequence`, `HistoryCursor` | append in caller UoW | ordering, visibility, commit | append log rejects non-monotonic sequence |
| `DecisionRepositoryPort` | model/reflection/query | Runtime decision records | append/read; never update/delete | turn version; decision ID | append in caller UoW | duplicate, mismatch, visibility | immutable map/log; duplicate returns existing ref |

No repository stores Method body, policy body, provider output, tool execution body, artifact/report evidence or observability backend state.

## 3. Context, memory and model Ports

```rust
/// Resolves external references to safe snapshots and availability markers.
pub trait SourceResolverPort: Send + Sync {
    /// Resolves one typed source under a freshness policy.
    async fn resolve(&self, reference: SourceReference, policy: ResolvePolicy) -> Result<SourceSnapshot, SourceError>;
    /// Reads source availability without returning owner body.
    async fn availability(&self, reference: SourceReference) -> Result<SourceAvailability, SourceError>;
    /// Refreshes a source only when the expected version is still valid.
    async fn refresh(&self, reference: SourceReference, expected_version: Option<SourceVersion>, policy: ResolvePolicy) -> Result<SourceSnapshot, SourceError>;
}

/// Retrieves candidate references and records Runtime memory use.
pub trait MemoryRetrievalPort: Send + Sync {
    /// Retrieves a bounded page of typed candidates.
    async fn retrieve(&self, request: RetrievalRequest) -> Result<Page<MemoryCandidate>, MemoryError>;
    /// Reads one candidate snapshot by identity.
    async fn get_snapshot(&self, candidate_id: MemoryCandidateId, snapshot_ref: SourceSnapshotId, scope: ReadScope) -> Result<SourceSnapshot, MemoryError>;
    /// Records use in the caller transaction; does not write durable memory.
    async fn record_use(&self, record: MemoryUseRecord, uow: &UnitOfWork) -> Result<AppendReceipt, CommitError>;
}

/// Persists run-scoped context and working memory.
pub trait ContextRepositoryPort: Send + Sync {
    /// Loads mutable working memory with its expected window version.
    async fn get_working_memory(&self, run_id: RunId, expected: MemoryWindowVersion, scope: RuntimeScope) -> Result<WorkingMemory, RepositoryError>;
    /// Saves one working-memory window transition.
    async fn save_working_memory(&self, memory: WorkingMemory, expected: MemoryWindowVersion, uow: &UnitOfWork) -> Result<CommitReceipt, CommitError>;
    /// Saves one assembled or frozen context transition.
    async fn save_context(&self, context: WorkingContext, expected: ContextVersion, uow: &UnitOfWork) -> Result<CommitReceipt, CommitError>;
    /// Reads a frozen context and verifies its digest identity.
    async fn get_frozen_context(&self, context_id: WorkingContextId, digest: ContextDigest, scope: ReadScope) -> Result<WorkingContext, RepositoryError>;
}

/// Submits provider-neutral model intent and receives finite semantic result refs.
pub trait ModelDecisionPort: Send + Sync {
    /// Submits a committed local turn candidate to an adapter seam.
    async fn submit(&self, turn: ModelTurn, context: WorkingContext) -> Result<ModelSubmission, ModelAdapterError>;
    /// Retrieves a semantic result for a known submission.
    async fn get_result(&self, submission: ModelSubmissionRef) -> Result<ModelSemanticResult, ModelAdapterError>;
    /// Reports adapter contract availability for a logical selection.
    async fn availability(&self, selection: LogicalModelSelection) -> Result<ModelAdapterAvailability, ModelAdapterError>;
}

/// Persists model turn lifecycle and submission correlation.
pub trait ModelTurnRepositoryPort: Send + Sync {
    /// Reads one turn by identity.
    async fn get(&self, turn_id: ModelTurnId, scope: ReadScope) -> Result<ModelTurn, RepositoryError>;
    /// Saves one version-guarded turn transition.
    async fn save(&self, turn: ModelTurn, expected: ModelTurnVersion, uow: &UnitOfWork) -> Result<CommitReceipt, CommitError>;
    /// Finds the turn bound to a submission for result incorporation.
    async fn find_by_submission(&self, submission: ModelSubmissionRef, scope: ReadScope) -> Result<Option<ModelTurn>, RepositoryError>;
}
```

| Port | Caller | Authority | Read/write | Version/cursor | UoW | Error mapping | Adapter/fake |
|---|---|---|---|---|---|---|---|
| `SourceResolverPort` | admission/progress/context/source job/query | external owner snapshot/availability | read external safe refs; no write owner truth | source version/freshness policy | local marker write outside resolver | pending, stale, unknown, authority mismatch | fake returns explicit status; never readiness |
| `MemoryRetrievalPort` | context/query/memory jobs | memory owner candidate seam | retrieve/read refs; local use append | `MemoryCursor`, source version | `record_use` in caller UoW | durable owner pending, unavailable, budget | fake candidate pages; durable write always blocked |
| `ContextRepositoryPort` | context/model/query/jobs | Runtime working context/window | read/write Runtime local context/memory | context/window versions | writes enlisted | scope, version, commit unknown | deterministic windows and frozen digest |
| `ModelDecisionPort` | model service/model consumer/query reconciliation | model adapter contract owner | submit/read semantic result/availability | submission ref, schema version | external call after local commit | pending contract, rejected, unknown | fake finite semantic results; no raw body |
| `ModelTurnRepositoryPort` | model service/query/recovery | Runtime turn lifecycle | read/write local turn | turn version/submission identity | writes enlisted | duplicate, mismatch, unknown | immutable result lookup |

Positive model adapter qualification remains `L2R-UP-004` blocked.

## 4. Action, delegation and feedback Ports

```rust
/// Reads Governance policy/effective decision views; never writes approval truth.
pub trait GovernancePreconditionPort: Send + Sync {
    /// Reads a formal decision reference under Runtime scope.
    async fn read(&self, decision_ref: FormalDecisionRef, scope: RuntimeScope, freshness: FreshnessRequirement) -> Result<GovernancePreconditionView, GovernanceError>;
    /// Evaluates an action against an imported policy view.
    async fn evaluate(&self, action: ActionCandidate, scope: RuntimeScope, expected_policy_version: Option<SourceVersion>) -> Result<GovernancePreconditionView, GovernanceError>;
}

/// Reads capability identity/exposure/adapter descriptor views from Capability Hub.
pub trait CapabilityExposurePort: Send + Sync {
    /// Resolves a target's formal exposure without invoking it.
    async fn resolve(&self, target: TypedRef, scope: RuntimeScope, expected_schema: Option<SchemaVersion>) -> Result<CapabilityExposureView, CapabilityError>;
}

/// Consumes L2-tools action contract and creates a submission candidate only.
pub trait ToolActionPort: Send + Sync {
    /// Reads the canonical action contract for a Runtime action choice.
    async fn get_contract(&self, action_id: ActionDecisionId, target: TypedRef, scope: RuntimeScope) -> Result<ToolContractAvailability, ToolBoundaryError>;
    /// Submits a canonical intent to the Tools seam; never returns execution success.
    async fn submit(&self, intent_ref: CanonicalActionIntentRef, intent_digest: CanonicalActionDigest, scope: RuntimeScope, correlation: RuntimeCorrelation) -> Result<ActionSubmission, ToolBoundaryError>;
    /// Reads a feedback candidate by submission identity.
    async fn get_feedback(&self, submission: ActionSubmissionRef) -> Result<Option<ExternalActionFeedback>, ToolBoundaryError>;
}

/// Consumes L4-sandbox isolation requirement and creates a handoff candidate only.
pub trait SandboxHandoffPort: Send + Sync {
    /// Reads isolation requirement for an action.
    async fn get_requirement(&self, action_id: ActionDecisionId, target: TypedRef, scope: RuntimeScope) -> Result<SandboxRequirementAvailability, SandboxBoundaryError>;
    /// Submits an isolation handoff candidate; never returns isolation execution truth.
    async fn submit(&self, requirement_ref: IsolationRequirementRef, scope: RuntimeScope, correlation: RuntimeCorrelation) -> Result<SandboxSubmission, SandboxBoundaryError>;
    /// Reads a safe sandbox result ref by submission identity.
    async fn get_feedback(&self, submission: SandboxSubmissionRef) -> Result<Option<SafeSandboxResultRef>, SandboxBoundaryError>;
}

/// Creates child-runtime candidates and reads child-result refs.
pub trait ChildRuntimePort: Send + Sync {
    /// Submits a bounded child request after parent delegation is committed.
    async fn create(&self, request: ChildRunRequest) -> Result<ChildSubmission, DelegationError>;
    /// Reads a child result envelope by child run identity.
    async fn get_result(&self, child_run: ChildRunRef, delegation: DelegationId) -> Result<Option<ChildResultEnvelope>, DelegationError>;
}

/// Appends immutable feedback records and looks up ordering anchors.
pub trait FeedbackRepositoryPort: Send + Sync {
    /// Appends one incorporated or quarantined feedback record.
    async fn append(&self, feedback: ActionFeedbackRecord, expected_sequence: Option<OrderingSequence>, uow: &UnitOfWork) -> Result<AppendReceipt, CommitError>;
    /// Finds a record by source event for dedupe.
    async fn find_by_source_event(&self, source_event: EventId, scope: ReadScope) -> Result<Option<ActionFeedbackRecord>, RepositoryError>;
    /// Reads the latest record for an action marker.
    async fn latest_for_action(&self, action_id: ActionDecisionId, scope: ReadScope) -> Result<Option<ActionFeedbackRecord>, RepositoryError>;
}
```

| Port | Caller | Authority | Read/write | Version/order | UoW | Errors | Fake/blocked |
|---|---|---|---|---|---|---|---|
| `GovernancePreconditionPort` | admission/action/control | L1-governance | read decision/policy view | source version/freshness | none; local decision writes elsewhere | denied/pending/stale/unknown | fake policy views only; no approval creation |
| `CapabilityExposurePort` | action guard | L3-capability-hub | read identity/exposure/descriptor | schema version | none | not exposed/pending/incompatible | fake explicit exposure state; no registry writes |
| `ToolActionPort` | action submission/feedback reconciliation | L2-tools | read contract; write external candidate | submission/correlation identity | external call after local intent commit | pending, rejected, unknown, boundary mismatch | fake returns candidate/rejection/unknown; never completed |
| `SandboxHandoffPort` | action submission/recovery | L4-sandbox | read isolation requirement; write handoff candidate | submission/correlation identity | external call after local intent commit | pending, unavailable, unknown | fake candidate/unknown; no execution/cleanup |
| `ChildRuntimePort` | delegation service/job | child Runtime seam | write child request; read result | delegation/child refs | parent local commit before call | scope/budget/unknown | fake child refs; no member lifecycle |
| `FeedbackRepositoryPort` | feedback consumer/query/recovery | Runtime feedback record | append/read only | event ID + ordering sequence | append in UoW | duplicate/order/mismatch/commit | in-memory append log; old facts immutable |

## 5. Checkpoint, outcome, handoff, projection and event Ports

```rust
/// Stores checkpoint lifecycle without inferring physical commit proof.
pub trait CheckpointRepositoryPort: Send + Sync {
    /// Persists prepared/pending/unknown checkpoint state in a UoW.
    async fn save(&self, checkpoint: RuntimeCheckpoint, expected: CheckpointVersion, uow: &UnitOfWork) -> Result<CommitReceipt, CommitError>;
    /// Reads the newest locally committed stable checkpoint.
    async fn get_latest_stable(&self, run_id: RunId, scope: ReadScope) -> Result<Option<RuntimeCheckpoint>, RepositoryError>;
    /// Reads one checkpoint by identity.
    async fn get(&self, checkpoint_id: CheckpointId, scope: ReadScope) -> Result<RuntimeCheckpoint, RepositoryError>;
    /// Pages checkpoints whose physical commit remains unknown.
    async fn list_commit_unknown(&self, cursor: RecoveryCursor, limit: PageLimit, scope: RuntimeScope) -> Result<Page<RuntimeCheckpoint>, RepositoryError>;
}

/// Isolates the still-pending physical checkpoint commit contract.
pub trait CheckpointCommitPort: Send + Sync {
    /// Attempts one idempotent physical checkpoint commit candidate.
    async fn commit(&self, request: CheckpointCommitRequest) -> Result<CheckpointCommitReceipt, CheckpointCommitError>;
    /// Reconciles a prior unknown commit using a stable request digest.
    async fn reconcile(&self, checkpoint_id: CheckpointId, request_digest: RequestDigest) -> Result<CheckpointCommitReceipt, CheckpointCommitError>;
}

/// Stores immutable local outcomes.
pub trait OutcomeRepositoryPort: Send + Sync {
    /// Persists one terminal local outcome under expected run/outcome versions.
    async fn save(&self, outcome: RuntimeOutcome, expected: OutcomeVersion, uow: &UnitOfWork) -> Result<CommitReceipt, CommitError>;
    /// Reads the outcome for one run.
    async fn get_by_run(&self, run_id: RunId, scope: ReadScope) -> Result<Option<RuntimeOutcome>, RepositoryError>;
}

/// Stores recovery decisions and continuation records.
pub trait RecoveryRepositoryPort: Send + Sync {
    /// Appends one recovery decision; previous decisions remain immutable.
    async fn append_decision(&self, decision: RecoveryDecision, uow: &UnitOfWork) -> Result<AppendReceipt, CommitError>;
    /// Pages manual-review decisions.
    async fn list_manual_review(&self, cursor: RecoveryCursor, limit: PageLimit, scope: RuntimeScope) -> Result<Page<RecoveryDecision>, RepositoryError>;
}

/// Rebuilds safe projections solely from committed Runtime history.
pub trait ProjectionStorePort: Send + Sync {
    /// Reads a safe view with freshness and visibility markers.
    async fn read(&self, query: ProjectionQuery) -> Result<SafeRuntimeView, ProjectionError>;
    /// Starts or resumes a bounded rebuild.
    async fn begin_rebuild(&self, projection: ProjectionId, rebuild_id: ProjectionRebuildId, cursor: ProjectionCursor) -> Result<ProjectionState, ProjectionError>;
    /// Applies a committed-history page under cursor guard.
    async fn write_page(&self, page: ProjectionWritePage, expected_cursor: ProjectionCursor) -> Result<ProjectionState, ProjectionError>;
    /// Marks a view stale without mutating domain truth.
    async fn mark_stale(&self, projection: ProjectionId, source_version: RunVersion, reason: SafeReason) -> Result<ProjectionState, ProjectionError>;
}

/// Publishes commit-time event snapshots through the Bus seam.
pub trait EventPublisherPort: Send + Sync {
    /// Publishes one immutable outbox snapshot.
    async fn publish(&self, payload: CommittedEventSnapshot) -> Result<PublishReceipt, PublishError>;
    /// Pages pending outbox entries.
    async fn scan_pending(&self, cursor: OutboxCursor, limit: PageLimit) -> Result<Page<OutboxEntry>, PublishError>;
    /// Records publisher attempt state only.
    async fn mark_published(&self, entry: OutboxEntryId, receipt: PublishReceipt) -> Result<(), PublishError>;
}
```

| Port | Caller | Authority | Read/write | Version/cursor/order | UoW | Error mapping | Fake/blocked |
|---|---|---|---|---|---|---|---|
| `CheckpointRepositoryPort` | recovery/query/jobs | Runtime checkpoint lifecycle | read/write local status | checkpoint version/recovery cursor | local UoW | invalid/unknown/version | fake can return commit unknown |
| `CheckpointCommitPort` | recovery service only | pending physical persistence owner | external commit/reconcile request | request digest/idempotency | separate contract | pending/unknown/conflict | fake has deterministic committed/unknown; qualification blocked |
| `OutcomeRepositoryPort` | outcome/query/handoff | Runtime local outcome | save/read | outcome version/run identity | outcome UoW | nonterminal/version/commit | immutable outcome fake |
| `RecoveryRepositoryPort` | recovery/query/jobs | Runtime recovery decisions | append/read | decision ID/recovery cursor | append UoW | duplicate/manual review | append-only fake |
| `HandoffRepositoryPort` | handoff/query/reconcile | Runtime attempt/gap | read/write local attempt/gap | attempt/gap version/cursor | local UoW | ack mismatch/unknown/version | fake never claims delivery |
| `ProjectionStorePort` | query/projection jobs | Runtime read projection | read/rebuild/write projection | rebuild ID/cursor/source sequence | page UoW if supported | stale/degraded/gap | deterministic history replay; no external body |
| `EventPublisherPort` | outbox publisher/jobs | Bus event seam | read outbox/write publish marker | outbox cursor/event ID | publish marker contract | pending/unknown | fake captures snapshots and never observed |

## 6. Adapter wrapper and fake contract

```rust
/// Reports binding status without asserting implementation readiness.
pub trait AdapterStatusPort: Send + Sync {
    /// Returns current adapter status and blocker reason.
    fn status(&self) -> AdapterRuntimeState;
    /// Returns supported schema/capability summary.
    fn capabilities(&self) -> AdapterCapabilitySummary;
}

/// Makes an adapter unavailable when its owner contract is pending.
pub struct BlockedAdapter<T> {
    pub slot: AdapterSlot,
    pub blocker_ref: BlockerRef,
    pub reason: SafeReason,
    pub marker: PhantomData<T>,
}

impl<T> BlockedAdapter<T> {
    pub fn new(slot: AdapterSlot, blocker_ref: BlockerRef, reason: SafeReason) -> Self;
    pub fn status(&self) -> AdapterRuntimeState;
}
```

| Adapter class | Positive call condition | Blocked behavior | Fake behavior | Forbidden claim |
|---|---|---|---|---|
| Governance | formal decision/policy view contract and scope/freshness verified | returns `PendingContract`/`Unknown` | injected decision matrix only | no approval creation |
| Capability | identity/registry/exposure/descriptor contract verified | returns `PendingContract` | explicit exposure views | no registry ownership |
| Tools | L2-tools action/receipt/feedback contract verified | no submit or explicit blocked candidate | candidate/reject/unknown only | no execution/cleanup success |
| Sandbox | L4-sandbox isolation/handoff contract verified | no positive handoff | candidate/unknown only | no policy/isolation truth |
| Model | provider-neutral adapter contract verified | turn blocked/unknown | finite semantic result refs | no provider route/secret/quota/cost |
| Memory | durable owner retrieval/lifecycle contract verified | working-only/unavailable | candidate pages only | no durable body/write |
| Checkpoint | physical atomicity/commit status contract verified | commit unknown/pending | committed/rejected/unknown matrix | no persistence readiness |
| Bus/Publisher | Core/Bus event route/schema contract verified | outbox pending | captures snapshot/publish outcome | no delivered/observed |
| Handoff/Projection | downstream route/obs schema and store contract verified | gap/stale/degraded | ack candidate/projection replay | no acceptance/verdict |

## 7. Per-function closure audit

| Required question | Result |
|---|---|
| Caller is named for every Port method | pass: service/table caller column and service constructors |
| Authority/owner is explicit | pass: Runtime local vs sibling owner rows |
| Read/write surface is typed | pass: method parameters/results and table |
| Version/cursor/order is explicit | pass: expected version or typed cursor on every mutable/page method |
| Transaction participation is explicit | pass: write methods receive `&UnitOfWork`; external calls occur after local commit where required |
| Error and pending mapping is explicit | pass: typed error names and blocked/unknown semantics |
| Adapter and fake are independently defined | pass: class table plus `BlockedAdapter<T>` |
| No external truth is re-owned | pass_with_pending upstream seams |

## 8. Step 7 gate

```text
step_06 = done
step_07 = done
next_allowed_action = start_step_08_protocol_contracts_deep_rebuild
```

Step 8 must independently define every protocol and secondary public type. This file cannot substitute for wire schemas.
