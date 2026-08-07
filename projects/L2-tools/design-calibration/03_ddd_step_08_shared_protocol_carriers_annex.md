# L2-tools Step 8 协议附录: shared public carriers

> 状态: completed / pass
> 主文件: `03_ddd_step_08_protocol_contracts.md`
> Public owner: `tools-contracts`
> Blocker: `L2T-UP-008` means these remain L2-owned until exact Core types are resolved and proven semantically equivalent.

## 1. Protocol identity and version

```rust
/// Version of one L2 Tools public protocol schema.
pub struct ToolProtocolSchemaVersion(pub u16);

/// Closed logical name of a Command protocol.
pub enum ToolCommandName {
    EstablishToolContract,
    AssessToolDefinitionChange,
    AdoptToolDefinitionRevision,
    RetireToolContract,
    DeclareCapabilityBinding,
    ReplaceCapabilityBinding,
    InvalidateCapabilityBinding,
    SubmitToolInvocation,
    EvaluateExecutionPreconditions,
    PrepareExecutionHandoff,
    AcceptExecutionSource,
    PrepareSafeExternalHandoff,
    RecordConsistencyGapResolution,
}

/// Closed logical name of a Query protocol.
pub enum ToolQueryName {
    GetToolContract,
    CompareToolDefinitionRevisions,
    GetCapabilityBinding,
    GetToolInvocation,
    GetExecutionPreconditionView,
    GetOutcomeAudit,
    GetReferenceConsistencyReport,
    SearchToolContracts,
    CompareToolContracts,
    GetToolDiagnostic,
    GetToolConsumerGuidance,
}

/// Closed logical name of an inbound Consumer protocol.
pub enum ToolInboundConsumerName {
    ConsumeHubCapabilityChangeClue,
    ConsumeAuthorizationResultChangeClue,
    ConsumeSandboxExecutionSource,
    ConsumeBusDeliveryStatusFeedback,
    ConsumeObservationStatusFeedback,
}

/// Closed logical name of an outbound semantic Event protocol.
pub enum ToolOutboundEventName {
    ToolContractChanged,
    CapabilityBindingChanged,
    ToolOutcomeAuditMaterialAvailable,
    ToolConsistencyGapChanged,
}

/// Closed logical name of an operations Job protocol.
pub enum ToolJobName {
    CheckCapabilityBindingConsistency,
    CheckReferenceIntegrity,
    RebuildToolDerivedViews,
    RefreshExternalStatusRefs,
}
```

Every enum and variant above receives the obvious one-sentence English `///` in source. Version `1` is the only current schema; unknown higher/lower versions are rejected or quarantined according to entry family. Variant names are semantic authority; adapters cannot dispatch arbitrary strings.

## 2. Actor, consumer and trace carriers

```rust
/// Attributable actor at a public L2 entry boundary.
pub struct ActorContext {
    pub actor_ref: ActorRef,
    pub authority_ref: ActorAuthorityRef,
    pub actor_kind: ActorKind,
    pub scope_refs: ActorScopeRefSet,
}

/// Declares why and for whom a safe read surface is requested.
pub struct ConsumerContext {
    pub consumer_ref: ConsumerRef,
    pub consumer_kind: ToolConsumerKind,
    pub requested_scope: ConsumerScopeRef,
}

/// Attributable system/operator actor allowed to invoke an operations Job.
pub struct SystemActorContext {
    pub actor_ref: ActorRef,
    pub authority_ref: ActorAuthorityRef,
    pub actor_kind: SystemActorKind,
    pub operation_scope: JobOperationScope,
}

/// Body-free trace lineage shared across one logical operation.
pub struct TraceContext {
    pub trace_ref: TraceRef,
    pub parent_span_ref: Option<SpanRef>,
    pub sampling_hint: TraceSamplingHint,
}
```

`ActorKind` variants: `Participant`, `Integration`, `System`, `Operator`. `SystemActorKind`: `System`, `Operator`. `ToolConsumerKind`: `Runtime`, `DirectCaller`, `Management`, `FutureSdk`, `Operations`. These markers identify the caller class but do not grant visibility or execution authority. `TraceSamplingHint` is `Default` or `SuppressOptionalTelemetry`; it cannot suppress Tool audit or required safe logs.

All ID/ref newtypes wrap a validated non-empty bounded string with exact case-preserving UTF-8 semantics. They do not use `Display`, debug text, trimmed or case-folded content for equality/digest. Ref-set carriers are sorted/deduplicated `Vec<T>` with a maximum safe count supplied by validated configuration; overflow rejects instead of truncating required refs.

## 3. Entry metadata

```rust
/// Metadata shared by all truth-changing Commands.
pub struct CommandMetadata {
    pub actor: ActorContext,
    pub request_id: RequestId,
    pub correlation_ref: CorrelationRef,
    pub trace_context: TraceContext,
    pub idempotency_key: IdempotencyKey,
    pub submitted_at: SubmittedAt,
}

/// Metadata shared by all no-write Queries.
pub struct QueryMetadata {
    pub actor: ActorContext,
    pub request_id: RequestId,
    pub correlation_ref: CorrelationRef,
    pub trace_context: TraceContext,
    pub consumer: ConsumerContext,
    pub read_at: ReadTime,
}

/// Metadata shared by all operations Jobs.
pub struct JobMetadata {
    pub system_actor: SystemActorContext,
    pub job_key: JobRunKey,
    pub correlation_ref: CorrelationRef,
    pub trace_context: TraceContext,
    pub requested_at: RequestedAt,
    pub source_watermark: LocalTruthWatermark,
}
```

`submitted_at`, `read_at` and `requested_at` record caller/entry admission time; application captures its own authoritative clock frame before constructing domain facts. `JobRunKey` is a stable idempotency input, not an actual scheduler/run/evidence ID. Command digest includes command name, schema version, semantic body, actor authority/ref and idempotency scope; excludes submitted time and transport headers. Query has no idempotency key. Job digest includes job name/body/system authority/key/requested watermark; excludes requested time.

## 4. Command response surface

```rust
/// Public result of one committed or deterministically classified Command.
pub struct ToolCommandResponse<T> {
    pub command: ToolCommandName,
    pub schema_version: ToolProtocolSchemaVersion,
    pub disposition: EntryDisposition,
    pub value: Option<T>,
    pub result_refs: CommandResultRefSet,
    pub committed_version: Option<CommittedVersion>,
    pub gap_refs: ConsistencyGapRefSet,
    pub correlation_ref: CorrelationRef,
}
```

Payload symmetry:

| Disposition | `value` | `result_refs` | committed version | Error channel |
|---|---|---|---|---|
| `Accepted` | required | required | required for versioned mutation; otherwise commit watermark ref | none |
| `DuplicateReplay` | exact stored value | exact stored refs | exact stored value | none |
| `Awaiting` | required typed current view | required | committed local version/ref required | none |
| `Rejected` | absent | optional existing-subject refs only | absent | `ProtocolError` preferred for deterministic invalid input/state |
| `Unavailable` | absent | optional blocker/gap refs | absent | `ProtocolError` with retry hint |
| `Conflict` | absent | existing conflict refs only | absent | `ProtocolError` |

Specific Command protocols use a concrete `T`; no untyped JSON/map/value is allowed. A handler returns `Result<ToolCommandResponse<T>, ProtocolError>` at the public boundary. For duplicate replay, application loads a `StoredCommandResult` whose closed `StoredCommandValue` variant contains the exact original `T` snapshot and verifies operation/schema/ref/candidate symmetry; it never recreates an old response from current mutable truth.

## 5. Query response and page surface

```rust
/// Closed disposition of one public Query response.
pub enum QueryDisposition {
    Found,
    Empty,
    NotFound,
    NotVisible,
    Stale,
    Rebuilding,
    Unavailable,
    Failed,
}

/// Public status shared by single and paged Query results.
pub struct QuerySurface {
    pub disposition: QueryDisposition,
    pub visibility: ConsumptionVisibility,
    pub freshness: Option<FreshnessState>,
    pub source_watermark: Option<LocalTruthWatermark>,
    pub gap_refs: ConsistencyGapRefSet,
}

/// Public result of one single-subject Query.
pub struct ToolQueryResponse<T> {
    pub query: ToolQueryName,
    pub schema_version: ToolProtocolSchemaVersion,
    pub surface: QuerySurface,
    pub value: Option<T>,
    pub correlation_ref: CorrelationRef,
}

/// Public opaque cursor bound to a filter and source watermark.
pub struct PageCursor(pub String);

/// Public bounded page request; actor/consumer metadata is not repeated here.
pub struct PageRequest {
    pub cursor: Option<PageCursor>,
    pub limit: PageLimit,
}

/// Public page response with explicit freshness and visibility.
pub struct ToolPageResponse<T> {
    pub query: ToolQueryName,
    pub schema_version: ToolProtocolSchemaVersion,
    pub surface: QuerySurface,
    pub items: Vec<T>,
    pub next_cursor: Option<PageCursor>,
    pub correlation_ref: CorrelationRef,
}
```

Single payload symmetry: `Found` requires value; `Stale` may include a value only for Queries whose annex explicitly allows stale-safe reads; all other dispositions require no value. Page symmetry: `Found` requires non-empty items; `Empty` requires empty items and visible/available surface; stale may contain items only where specified; non-visible/unavailable/failed/rebuilding require empty items. Repository cursor is never exposed directly: application validates/encodes an opaque public cursor containing logical operation, schema, filter digest, stable sort position and source watermark.

`NotFound` and `NotVisible` may share a transport status for anti-enumeration, but remain distinct typed surfaces inside the protocol mapper. Truth views use `freshness=None`; derived/report/projection views require a value. Queries never trigger refresh, rebuild, gap resolution or external calls.

## 6. Inbound envelope and receipt

```rust
/// Versioned attributable envelope for one inbound safe payload.
pub struct InboundEventEnvelope<T> {
    pub source_event_id: SourceEventId,
    pub deduplication_key: DeduplicationKey,
    pub source_actor: ActorContext,
    pub source_authority_ref: SourceAuthorityRef,
    pub contract_version: ToolProtocolSchemaVersion,
    pub correlation_ref: CorrelationRef,
    pub trace_context: TraceContext,
    pub ordering_key: Option<OrderingKey>,
    pub source_sequence: Option<SourceSequence>,
    pub emitted_at: ExternalEventTime,
    pub received_at: ReceivedAt,
    pub payload: T,
}

/// Local receipt for one inbound event; never an external broker receipt.
pub struct ConsumerReceipt {
    pub consumer: ToolInboundConsumerName,
    pub source_event_id: SourceEventId,
    pub deduplication_key: DeduplicationKey,
    pub disposition: ConsumerDisposition,
    pub local_result_refs: LocalResultRefSet,
    pub gap_refs: ConsistencyGapRefSet,
    pub retry_hint: RetryHint,
    pub correlation_ref: CorrelationRef,
}
```

`ConsumerDisposition` variants: `Accepted`, `Duplicate`, `Rejected`, `Quarantined`, `GapRecorded`. There is no delayed state in the current boundary: an in-flight idempotency winner maps to a typed unavailable/retry-same-input error rather than an unstored receipt. Missing source identity/version/correlation rejects; unsupported version rejects; authority/order/digest/body conflict quarantines with a typed local gap marker where safe; open positive mapping may produce `GapRecorded`. Receipt persistence and idempotency record are in the same UoW as Consumer-owned local effects. `IF-03` is the closed exception: its formal `CF-11` Command commits/replays in its own UoW first, then a separate Consumer UoW atomically stores the receipt and Consumer idempotency completion using those committed refs.

## 7. Outbound event envelope

```rust
/// Immutable body-free semantic event constructed from committed safe material.
pub struct ToolEventEnvelope<T> {
    pub event_id: ToolEventId,
    pub event_name: ToolOutboundEventName,
    pub schema_version: ToolProtocolSchemaVersion,
    pub source_material_ref: SafeHandoffMaterialRef,
    pub source_truth_refs: LocalTruthRefSet,
    pub correlation_refs: SafeCorrelationRefSet,
    pub occurred_at: EventFactTime,
    pub payload: T,
}
```

`event_id` is deterministically derived from the versioned frame
`(event name, schema version, source material ID, canonical source truth refs)`. The source-ref
component prevents a material/source mismatch from aliasing an event identity; a collision or
non-canonical ref set is an integrity failure. `occurred_at` comes from the committed source
fact/material, not relay time. The complete body-free envelope is deterministically reconstructible
from immutable `SafeHandoffMaterial`; no raw/current truth lookup is allowed. Physical route,
delivery, retry, DLQ and observation are absent.

## 8. Job request/report surface

```rust
/// Closed disposition of one operations Job result.
pub enum JobDisposition {
    Completed,
    Partial,
    NoOpDuplicate,
    Blocked,
    Failed,
}

/// Body-free result of one bounded operations Job call.
pub struct JobReport {
    pub job: ToolJobName,
    pub job_key: JobRunKey,
    pub requested_watermark: LocalTruthWatermark,
    pub processed_watermark: LocalTruthWatermark,
    pub disposition: JobDisposition,
    pub counts: JobSafeCounts,
    pub output_refs: JobOutputRefSet,
    pub gap_refs: ConsistencyGapRefSet,
    pub next_cursor: Option<JobCursor>,
    pub correlation_ref: CorrelationRef,
}
```

`JobSafeCounts` exact fields: `examined`, `created`, `updated`, `unchanged`, `gaps_opened`, `gaps_resolved`, `failed`. `JobOutputRefSet` is the closed sorted union defined in Step 6: reference/binding assessments, gaps, reports, projections, external status refs and projection-write results. `JobCursor` binds job name/body digest/watermark/stable position. `Completed` may include a next cursor only when it means the requested bounded slice completed; caller continues explicitly. No report field is an implementation commit, actual run ID, test result, evidence alias or acceptance signoff.

## 9. Protocol error

```rust
/// Stable redacted failure at any public L2 protocol boundary.
pub struct ProtocolError {
    pub code: ToolErrorCode,
    pub class: ProtocolErrorClass,
    pub safe_message: SafeErrorMessage,
    pub retry_hint: RetryHint,
    pub subject_refs: ErrorSubjectRefSet,
    pub gap_refs: ConsistencyGapRefSet,
    pub blocker: Option<PortBlockerSummary>,
    pub correlation_ref: CorrelationRef,
}
```

`ProtocolErrorClass`: `InvalidInput`, `NotFound`, `NotVisible`, `Conflict`, `InvalidState`, `Blocked`, `Unavailable`, `IntegrityFailure`, `InternalSafeFailure`. `RetryHint`: `DoNotRetry`, `RetrySameInput`, `RetryAfterDependencyRecovery`, `ResolveConflict`, `ManualOwnerAction`. Code-specific mappings are Step 12, while every protocol annex names its allowed classes. Messages use code-owned safe templates and bounded safe identifiers only.

## 10. Public secondary-type catalog

| Family | Exact representation | Owner / rule |
|---|---|---|
| Safe name/reason/summary | validated bounded newtype, no control chars/body/secret | contracts; domain mapper may narrow, never expand |
| IDs/refs | case-preserving validated string newtype | contracts; equality is exact inner bytes |
| Revision/version/watermark/sequence/count | checked non-negative integer newtype | contracts; no free string parsing in domain |
| Ref set | sorted deduplicated bounded `Vec<typed ref>` | contracts; mixed-kind sets use a closed enum |
| Safe argument | closed enum: text, integer, canonical decimal, boolean, null, typed ref, bounded list/object of same | contracts; no bytes/prompt/provider body |
| Semantic summary | named struct/closed enum per annex | contracts; never `Map<String, Value>` |
| Timestamp | validated UTC instant carrier | contracts; external and local time types remain distinct |
| Cursor | opaque integrity-checked newtype | contracts/application mapping; no storage row address |
| Digest | fixed algorithm/version tagged bytes rendered as safe text | application computes; contracts carries |

Every concrete request/view/payload below may use only this catalog, Step 6 public carriers or another explicitly defined type in the same protocol annex. Domain-only, `Loaded<T>`, repository cursor, UoW, adapter/config/framework/backend types are forbidden in public schemas.

## 11. Shared stop review

| Review item | Result | Closure |
|---|---|---|
| Five protocol-name enums and counts exact | pass | 13/11/5/4/4 variants |
| Actor/metadata authority unique | pass | body never duplicates entry metadata |
| Command result and duplicate replay surface exact | pass | typed value/ref/version symmetry |
| Query single/page/disposition/freshness exact | pass | empty/not-visible/stale/rebuilding/unavailable explicit |
| Envelope/receipt/quarantine/dedup exact | pass | no broker receipt/DLQ claim |
| Event identity/source/material/version exact | pass | no physical route/delivery fields |
| Job report output/readability exact | pass | typed output refs; no run/test evidence |
| Error/secondary types owned and body-free | pass | no anonymous map/domain/infra type |
