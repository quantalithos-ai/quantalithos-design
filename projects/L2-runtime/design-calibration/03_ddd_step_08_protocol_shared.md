# L2-runtime Step 8 protocol contracts: shared public types

> 状态: done
> 当前 Step: 8
> 用途: 为 17 Command、12 Query、6 Inbound Event、6 Outbound Event、7 Operations Job 提供可复用但类型闭合的 envelope/page/error 基础

## 1. Protocol boundary

Public protocols carry typed identities, versions, safe summaries and source references. They do not carry prompt/body, provider raw output, tool schema body, approval/policy body, artifact/report/evidence body, member lifecycle state or observability backend payload. All public schema versions are explicit and all mutation requests carry body-free request digest and idempotency key.

## 2. Command envelope and metadata

```rust
/// Common metadata for one Runtime mutation command.
pub struct CommandMetadata {
    /// Caller-generated stable request identity.
    pub request_id: RequestId,
    /// Public operation name used in digest and replay lookup.
    pub operation: OperationName,
    /// Version of the command schema.
    pub schema_version: SchemaVersion,
    /// Stable key for retry/replay protection.
    pub idempotency_key: IdempotencyKey,
    /// Digest over the canonical body-free command value.
    pub request_digest: RequestDigest,
    /// Formal actor reference supplied by the entry boundary.
    pub actor_ref: ActorRef,
    /// Runtime scope inherited from the formal entry source.
    pub scope: RuntimeScope,
    /// Correlation and causation identity for local history.
    pub correlation: RuntimeCorrelation,
    /// Optional direct causation reference.
    pub causation_ref: Option<TypedRef>,
    /// Caller event/request time.
    pub occurred_at: Timestamp,
    /// Optional tracing context; never part of domain digest.
    pub trace_context: Option<TraceContext>,
}

impl CommandMetadata {
    /// Validates operation, schema, actor, scope, correlation and key presence.
    pub fn validate(&self) -> Result<(), ProtocolError>;
    /// Builds canonical digest input after forbidden-body validation.
    pub fn canonical_digest_input(&self, payload: BodyFreeCanonicalValue) -> Result<BodyFreeCanonicalValue, ProtocolError>;
    /// Verifies the supplied digest against a computed digest.
    pub fn verify_digest(&self, computed: RequestDigest) -> Result<(), ProtocolError>;
}
```

`trace_context` is observability metadata only. A missing actor/scope/correlation/idempotency key fails before UoW. Same operation/key with same digest replays a stored local result; same key with a different digest is `IdempotencyConflict`.

## 3. Query envelope and metadata

```rust
/// Metadata for a non-mutating Runtime query.
pub struct QueryMetadata {
    /// Caller-generated read request identity.
    pub request_id: RequestId,
    /// Query operation name.
    pub operation: OperationName,
    /// Formal actor reference used by visibility policy.
    pub actor_ref: ActorRef,
    /// Read-only visibility scope.
    pub read_scope: ReadScope,
    /// Required freshness posture for the returned view.
    pub freshness_requirement: FreshnessRequirement,
    /// Correlation identity for query diagnostics.
    pub correlation: RuntimeCorrelation,
}

impl QueryMetadata {
    /// Validates operation, actor, read scope and correlation.
    pub fn validate(&self) -> Result<(), ProtocolError>;
    /// Validates that a requested Runtime scope is visible under read policy.
    pub fn validate_visibility(&self, requested: &RuntimeScope) -> Result<(), ProtocolError>;
}
```

Query metadata has no mutation idempotency key and cannot open a UoW. `NotVisible` remains distinguishable from `NotFound` internally so the handler cannot leak existence.

## 4. Event envelope and receipt

```rust
/// Inbound or outbound event envelope with source and ordering identity.
pub struct EventEnvelope<T> {
    /// Stable event identity for inbox dedupe.
    pub event_id: EventId,
    /// Explicit event kind.
    pub event_kind: EventKind,
    /// Event payload schema version.
    pub schema_version: SchemaVersion,
    /// Owner that produced the event payload.
    pub source_owner: OwnerRef,
    /// Typed reference to the source fact.
    pub source_ref: TypedRef,
    /// Runtime correlation and optional causation.
    pub correlation: RuntimeCorrelation,
    /// Direct causation reference when supplied by the owner.
    pub causation_ref: Option<TypedRef>,
    /// Source occurrence time.
    pub occurred_at: Timestamp,
    /// Stable stream ordering key.
    pub ordering_key: OrderingKey,
    /// Typed body-free event payload.
    pub payload: T,
}

/// Durable local disposition for one consumed event.
pub struct EventReceipt {
    /// Input event identity.
    pub event_id: EventId,
    /// Consumer handling disposition.
    pub disposition: EventDisposition,
    /// Correlation copied from the envelope.
    pub correlation: RuntimeCorrelation,
    /// Optional local fact created by incorporation.
    pub linked_fact_ref: Option<TypedRef>,
    /// Optional safe reason for non-acceptance.
    pub reason: Option<SafeReason>,
}

pub enum EventDisposition {
    Accepted,
    Duplicate,
    Late,
    OutOfOrder,
    Rejected,
    Blocked,
    Unknown,
}

impl<T: BodyFreePayload> EventEnvelope<T> {
    /// Validates source, schema, correlation, ordering and body-free payload rules.
    pub fn validate(&self, expected_kind: EventKind, expected_schema: SchemaVersion) -> Result<(), ProtocolError>;
    /// Computes the stable event digest used by inbox dedupe.
    pub fn digest_input(&self) -> BodyFreeCanonicalValue;
}

impl EventReceipt {
    /// Validates that receipt identity and correlation match the consumed event.
    pub fn validate_for<T>(&self, envelope: &EventEnvelope<T>) -> Result<(), ProtocolError> where T: BodyFreePayload;
}
```

Receipt acceptance means Runtime incorporated or durably classified the event. It never means source delivery, external execution, observability or business acceptance.

## 5. Job envelope, lease and page report

```rust
/// Input metadata for one bounded operations job invocation.
pub struct JobMetadata {
    /// Stable job invocation identity.
    pub job_id: JobId,
    /// Explicit operations job name.
    pub operation: JobOperation,
    /// Lease key for the job partition.
    pub lease_key: LeaseKey,
    /// Optional continuation cursor.
    pub cursor: Option<JobCursor>,
    /// Optional requesting actor for manual jobs.
    pub requested_by: Option<ActorRef>,
    /// Correlation identity for job records.
    pub correlation: RuntimeCorrelation,
    /// Configuration snapshot captured at job start.
    pub config_snapshot_ref: ConfigSnapshotRef,
}

/// Result for one bounded job page.
pub struct JobPageReport {
    /// Job invocation identity.
    pub job_id: JobId,
    /// Operation name.
    pub operation: JobOperation,
    /// Number of records scanned.
    pub scanned_count: RecordCount,
    /// Number of records accepted for local processing.
    pub processed_count: RecordCount,
    /// Number of records changed.
    pub changed_count: RecordCount,
    /// Number of records skipped as duplicate or already current.
    pub skipped_count: RecordCount,
    /// Number of records blocked or quarantined.
    pub blocked_count: RecordCount,
    /// Cursor after the committed page.
    pub next_cursor: Option<JobCursor>,
    /// Overall page disposition.
    pub disposition: JobPageDisposition,
    /// Body-free per-record error references.
    pub error_refs: Vec<TypedRef>,
    /// Lease and configuration identities used by the page.
    pub lease_ref: LeaseRef,
    pub config_snapshot_ref: ConfigSnapshotRef,
}

pub enum JobPageDisposition {
    Completed,
    Partial,
    Waiting,
    Blocked,
    Degraded,
    Unknown,
}

impl JobMetadata {
    /// Validates operation, lease key, cursor and config snapshot.
    pub fn validate(&self) -> Result<(), ProtocolError>;
}

impl JobPageReport {
    /// Validates count arithmetic and cursor advancement.
    pub fn validate_counts(&self) -> Result<(), ProtocolError>;
    /// Returns whether another page is required.
    pub fn has_more(&self) -> bool;
}
```

Job report is an operational local record only. It is not a test result, evidence artifact, acceptance verdict or readiness claim.

## 6. Shared page, visibility and error types

```rust
/// Body-free query envelope with freshness and projection posture.
pub struct QueryViewEnvelope<T> {
    /// Typed view payload.
    pub view: T,
    /// Visibility result after actor/scope policy.
    pub visibility: VisibilityMarker,
    /// Freshness claim for the view.
    pub freshness: FreshnessClaim,
    /// Projection identity and cursor.
    pub projection: ProjectionMarker,
    /// Optional source cursor/watermark.
    pub source_cursor: Option<ProjectionCursor>,
    /// Optional degraded reason.
    pub degraded: Option<SafeReason>,
    /// Query correlation identity.
    pub correlation: RuntimeCorrelation,
}

/// A typed page that exposes cursor and freshness semantics.
pub struct Page<T> {
    /// Items in stable source order.
    pub items: Vec<T>,
    /// Cursor for the next page.
    pub next_cursor: Option<QueryCursor>,
    /// Optional committed source watermark.
    pub source_watermark: Option<RunVersion>,
    /// Freshness claim for this page.
    pub freshness: FreshnessClaim,
    /// Page posture.
    pub status: PageStatus,
}

pub enum PageStatus {
    Current,
    Empty,
    Stale,
    Rebuilding,
    Degraded,
    NotVisible,
}

pub enum ProtocolError {
    InvalidRequest,
    MissingRequiredField,
    SchemaMismatch,
    DigestMismatch,
    IdempotencyConflict,
    VisibilityDenied,
    NotVisible,
    CursorInvalid,
    ForbiddenBody,
    UnsupportedVariant,
}

pub enum ApplicationError {
    Domain(DomainError),
    Repository(RepositoryError),
    Transaction(TransactionError),
    Commit(CommitError),
    ExternalPending { blocker_ref: BlockerRef },
    ExternalUnavailable { reason: SafeReason },
    ExternalUnknown { fence_ref: FenceRef },
    VersionConflict { aggregate: AggregateId },
    Idempotency(IdempotencyError),
}

impl<T> QueryViewEnvelope<T> {
    /// Returns true only when visibility and freshness satisfy the query.
    pub fn satisfies(&self, requirement: FreshnessRequirement) -> bool;
}

impl<T> Page<T> {
    /// Validates cursor and item count consistency.
    pub fn validate(&self, limit: PageLimit) -> Result<(), ProtocolError>;
}
```

## 7. Protocol inventory and conflict record

| Family | Canonical count | Source of truth | Note |
|---|---:|---|---|
| Command | 17 | current `02_hld_step_07_api_outline.md` per-item Command table | grouped old tables and historical 03 text undercounted to 15; record as `historical_material` |
| Query | 12 | current 02 HLD Query inventory | each has independent view result |
| Inbound Event | 6 | current 02 HLD consumer table | one event kind per source/ordering contract |
| Outbound Event | 6 | current detailed-design safe event family set | 02 grouped 11 names are historical aliases/materialization variants, not extra public families |
| Operations Job | 7 | current 02 HLD Job table | each has independent input/report/cursor |

The 17 Commands are: `AcceptRuntimeTrigger`, `ApplyRuntimeControl`, `EvaluateRunProgress`, `ComposeWorkingContext`, `RecordWorkingMemory`, `StartModelTurn`, `ClassifyModelResult`, `ProposeAction`, `EvaluateActionPreconditions`, `ProposeDelegation`, `IncorporateActionFeedback`, `PrepareRuntimeCheckpoint`, `CommitRuntimeCheckpoint`, `RequestRecoveryDecision`, `FinalizeRuntimeOutcome`, `CreateHandoffCandidate`, `CaptureSourceSnapshot`.

`SubmitActionCandidate`, `ConsumeChildResult`, `ReconcileHandoffGap`, and `RequestReflectionDecision` remain internal application/event/job operations. They are typed in Step 6/7 and Step 9 but are not additional public Command entries.
