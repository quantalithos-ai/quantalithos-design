# L2-tools Step 6 模块附录: `contracts` shared/public carrier 契约

> 状态: completed / pass
> 主文件: `03_ddd_step_06_object_contracts.md`
> Authority: 正式 `02-概要设计.md` §7 / §12.3；`core-contracts` generic candidate inspection
> Blocker: `L2T-UP-008`
> 作用: 固定 Step 8 必须复用的 metadata、envelope、page、error、result、receipt、report 和 public marker；这些类型不是新增业务对象。

## 1. Ownership 与依赖规则

| Carrier family | Planned owner | Construction boundary | Forbidden ownership |
|---|---|---|---|
| Command / Query metadata | `contracts::metadata` | API / caller adapter validates, application consumes | Domain does not parse transport headers or authenticate actors |
| Inbound event envelope | `contracts::events` | Worker adapter validates before application service | Consumer does not own source truth or external delivery lifecycle |
| Job metadata / report | `contracts::jobs` | Job entry validates; application/jobs builds report | No actual run ID, scheduler truth or test evidence |
| Page / cursor / freshness | `contracts::pagination` | Repository read maps to public page | Projection is not business truth |
| Protocol error | `contracts::errors` | Entry maps typed application errors | No backend details, source body or secret |
| Entry / receipt disposition | `contracts::disposition` | Application returns; entry serializes | Disposition does not mutate subject truth |

The planned `contracts` crate may re-export a Core generic type only after `SharedContractAuthorityRef::Resolved`. Until then, L2-owned carrier names and fields below are authoritative; `candidate_only` is not a license to guess a Core schema.

### 1.1 Closed subject-reference carrier

```rust
/// Closed identity of one L2-owned read/reference subject.
pub enum TypedSubjectRef {
    /// One stable tool contract identity.
    ToolContract(ToolId),
    /// One formal capability Binding relation.
    CapabilityBinding(CapabilityBindingId),
    /// One canonical tool invocation.
    ToolInvocation(ToolInvocationId),
    /// One local execution handoff.
    ExecutionHandoff(ExecutionHandoffId),
    /// One local execution handoff attempt.
    ExecutionHandoffAttempt(ExecutionHandoffAttemptId),
    /// The indivisible outcome/audit truth of one invocation.
    OutcomeAudit(ToolInvocationId),
    /// One local safe-material submission attempt.
    ExternalSubmissionAttempt(ExternalSubmissionAttemptId),
    /// One local consistency-gap record.
    ConsistencyGap(ConsistencyGapId),
    /// One canonical reference-inspection scope used by a stored report.
    ReferenceInspection(ReferenceInspectionScopeDigest),
    /// One canonical safe tool-search scope.
    ToolContractSearch(ToolContractSearchScopeDigest),
    /// One closed diagnostic subject selector.
    ToolDiagnostic(ToolDiagnosticSubjectRef),
    /// One tool/consumer guidance read subject.
    ToolConsumerGuidance(ToolId, ToolConsumerKind),
}
```

An external result clue that has no local invocation identity uses
`TypedSubjectRef::ReferenceInspection(ReferenceInspectionScopeDigest)` derived from its exact
`AuthorizationAssessmentLookupScope`; the external result/subject pair remains in the typed
`GapSubjectRefSet` and is never represented by an open-ended enum variant.

`ReferenceInspectionScopeDigest::for_authorization_change(...)` and
`ReferenceInspectionScopeDigest::for_hub_capability_clue(...)` are pure, version-tagged digest
constructors over the exact typed lookup fields. They are scope identities only; they do not
assert that an external owner returned a valid result.

`TypedSubjectRef` is an identity carrier, not another business object or a global aggregate. It cannot contain an arbitrary type name, locator, display label, raw body or external ref. `GapSubjectRefSet` and `LocalTruthRefSet` are bounded sorted sets of their own closed local/external-ref unions; conversion from `TypedSubjectRef` is explicit and lossless for applicable variants.

## 2. Metadata carriers

### 2.1 `CommandMetadata`

```rust
/// Validated metadata shared by every truth-changing L2 command.
pub struct CommandMetadata {
    pub actor: ActorContext,
    pub request_id: RequestId,
    pub correlation_ref: CorrelationRef,
    pub trace_context: TraceContext,
    pub idempotency_key: IdempotencyKey,
    pub submitted_at: SubmittedAt,
}
```

`validate() -> Result<(), MetadataError>` rejects anonymous/unsupported actor kinds, empty IDs, invalid trace/correlation or missing idempotency key. `canonical_digest_frame() -> CommandMetadataDigestFrame` includes actor authority, request/correlation and idempotency scope but excludes `submitted_at` and transport-only headers so retries produce the same digest.

### 2.2 `QueryMetadata`

```rust
/// Validated read context; it never authorizes writes or refreshes.
pub struct QueryMetadata {
    pub actor: ActorContext,
    pub request_id: RequestId,
    pub correlation_ref: CorrelationRef,
    pub trace_context: TraceContext,
    pub consumer: ConsumerContext,
    pub read_at: ReadTime,
}
```

`validate()` requires an attributable actor and explicit consumer kind/scope. `visibility_input()` produces the exact `VisibilityDecision` input. No idempotency key exists because Queries are no-write; pagination cursor remains in the Query body.

### 2.3 `JobMetadata`

```rust
/// Validated input metadata for an operations job invocation.
pub struct JobMetadata {
    pub system_actor: SystemActorContext,
    pub job_key: JobRunKey,
    pub correlation_ref: CorrelationRef,
    pub trace_context: TraceContext,
    pub requested_at: RequestedAt,
    pub source_watermark: LocalTruthWatermark,
}
```

`JobRunKey` is a caller-supplied idempotency identity for planned execution, not a real run ID. `validate()` rejects user actors, an absent watermark and an unsupported job authority. `canonical_digest_frame()` excludes volatile scheduling metadata.

## 3. `InboundEventEnvelope<T>`

```rust
/// Versioned, attributable and deduplicable envelope for one inbound safe payload.
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
```

| Callable | Contract |
|---|---|
| `validate_envelope(&SupportedContractVersions)` | Verifies source ID, authority, version, correlation and optional ordering pair before payload mapping |
| `dedup_key()` | Returns `(source_authority_ref, source_event_id, deduplication_key)`; not payload hash alone |
| `ordering_position()` | Returns a comparable position only when both ordering key and sequence exist |
| `map_payload<U>(fn(T) -> Result<U, E>)` | Preserves all envelope fields and maps safe payload; raw/forbidden payload fails before application entry |
| `derive_integration_command_metadata(ToolInboundConsumerName, ToolCommandName)` | After authority/actor/version validation only; derives request ID and idempotency key from a version-tagged digest of consumer/command/source authority/source event/dedup identity, preserves actor/correlation/trace, and maps `received_at` to submitted-at |

Missing required envelope fields yields `ConsumerReceipt::Rejected`; unsupported version yields `Rejected`; attributable but conflicting/unsafe payload yields `Quarantined`; a formally supported clue with an unclosed downstream mapping may be accepted as a typed gap but cannot update core truth.

## 4. Pagination carriers

```rust
/// Opaque cursor supplied by a previous L2 page response.
pub struct PageCursor(pub String);

/// Stable read request with a bounded page size.
pub struct PageRequest {
    pub cursor: Option<PageCursor>,
    pub limit: PageLimit,
}

/// Public page that exposes read watermark and freshness explicitly.
pub struct Page<T> {
    pub items: Vec<T>,
    pub next_cursor: Option<PageCursor>,
    pub source_watermark: LocalTruthWatermark,
    pub freshness: FreshnessState,
}
```

`PageLimit` is a validated non-zero bounded integer; exact configurable maximum is deferred to `04-配置设计.md`, but exceeding the configured maximum is rejected rather than silently expanded. Cursor encoding is opaque, versioned and integrity-checked; it encodes the stable sort position, filter digest, source watermark and cursor schema version, never a database row address. `Page::empty(...)` and `map_items(...)` preserve watermark/freshness.

`FreshnessState` variants and rustdoc:

| Variant | English rustdoc |
|---|---|
| `Fresh` | `/// The derived material covers the declared source watermark.` |
| `Stale` | `/// Newer local truth exists than the material source watermark.` |
| `Rebuilding` | `/// A replacement build is in progress while the prior material remains explicitly stale.` |
| `Unavailable` | `/// No readable derived material exists for the requested scope.` |
| `Failed` | `/// The most recent derivation attempt failed without changing source truth.` |

## 5. Entry and receipt carriers

### 5.1 `EntryDisposition`

| Variant | English rustdoc | Stable meaning |
|---|---|---|
| `Accepted` | `/// The input was accepted and its named local result was committed.` | A result ref and committed version are present |
| `Rejected` | `/// The input was deterministically rejected without an external execution.` | Safe typed reason is present |
| `Awaiting` | `/// The local subject exists but awaits a named formal precondition.` | Not execution started |
| `Unavailable` | `/// A required authority, mapping, route or store was unavailable.` | Retry hint is mapped separately |
| `DuplicateReplay` | `/// An identical prior input was found and its stored result is replayed.` | Same canonical digest required |
| `Conflict` | `/// The input conflicts with an existing identity, digest, version or terminal fact.` | Never overwrite |

### 5.2 `ConsumerReceipt`

```rust
/// Local processing receipt for one inbound envelope; not an external delivery receipt.
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

| Variant | English rustdoc | Required surface |
|---|---|---|
| `Accepted` | `/// The safe clue or source was processed into named local facts or a formal follow-up command.` | local result refs |
| `Duplicate` | `/// The same source event and digest were already processed; the stored receipt is replayed.` | prior receipt ref |
| `Rejected` | `/// The envelope or payload is deterministically unsupported or invalid.` | safe reason, no retry |
| `Quarantined` | `/// The attributable input conflicts with authority, ordering, version or forbidden-body rules.` | typed gap/quarantine marker; no fabricated DLQ |
| `GapRecorded` | `/// The clue was accepted only as a typed consistency gap because its positive mapping is not closed.` | gap refs |

Factories `accepted`, `duplicate`, `rejected`, `quarantined` and `gap_recorded` enforce payload symmetry. `ConsumerReceipt` contains no broker acknowledgment, delivery status, DLQ locator, retry count or processing evidence alias.

The integration Command metadata derivation is a pure identity mapping, not an ID-generator or external call. Reprocessing the same validated envelope for the same Command produces byte-identical `RequestId`/`IdempotencyKey`; another consumer, Command, source authority, source event or dedup identity produces a different scoped key. It cannot convert a participant actor into System/Operator, and only a source actor already validated as `Integration` may re-enter `AcceptExecutionSource`.

## 6. `JobReport`

```rust
/// Body-free report returned by one operations job call.
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

| Variant | English rustdoc | Meaning |
|---|---|---|
| `Completed` | `/// The requested bounded slice was processed at the reported watermark.` | May still have a next cursor |
| `Partial` | `/// A bounded slice completed with explicitly reported gaps or unavailable partitions.` | Must carry gaps or cursor |
| `NoOpDuplicate` | `/// An identical job key and digest already completed; the stored report is replayed.` | No new writes |
| `Blocked` | `/// A required formal source, mapping or route is not available.` | No fabricated positive work |
| `Failed` | `/// Local processing failed and source truth was not silently repaired.` | Safe failure ref, not test result |

`ToolJobName` is the single public Job-name enum fixed by Step 8. The earlier local
`ToolJobKind` wording is superseded historical material and must not be implemented as a second
enum. `JobSafeCounts` is a closed struct with `examined`, `created`, `updated`, `unchanged`,
`gaps_opened`, `gaps_resolved`, `failed`; all are non-negative and sum checks are job-specific.
`JobOutputRefSet` is a sorted, deduplicated closed union of reference-assessment,
binding-assessment, gap, consistency-report, projection, external-status-ref and
projection-write-result refs; it cannot carry a subject body or evidence alias. `JobCursor` is
opaque and scoped to Job name, digest and watermark.

## 7. `ProtocolError`

```rust
/// Stable redacted error returned at an L2 protocol boundary.
pub struct ProtocolError {
    pub code: ToolErrorCode,
    pub class: ProtocolErrorClass,
    pub safe_message: SafeErrorMessage,
    pub retry_hint: RetryHint,
    pub subject_refs: ErrorSubjectRefSet,
    pub gap_refs: ConsistencyGapRefSet,
    pub correlation_ref: CorrelationRef,
}
```

`from_application_error(ApplicationError, CorrelationRef) -> Self` is an exhaustive mapping. `safe_message` is selected from code-owned templates and bounded safe parameters; it never contains raw request/result, external body, SQL/transport/backend details, secret, prompt or evidence. `RetryHint` variants are `DoNotRetry`, `RetrySameInput`, `RetryAfterDependencyRecovery`, `ResolveConflict`, `ManualOwnerAction`; exact retry ownership is closed in Step 12/13.

## 8. Module Gate

| Check | Result |
|---|---|
| All shared secondary types needed by Step 7/8 have exact fields and callable guards | pass |
| Metadata has one carrier per entry kind and no duplicated actor/pagination source | pass |
| Event dedup, ordering, quarantine and receipt fields are closed | pass |
| Page identity, stable cursor inputs, watermark and freshness are closed | pass |
| Every enum variant has English rustdoc and payload symmetry | pass |
| Candidate Core reuse remains blocked until an exact searchable schema is resolved | pass |
| No transport, broker, scheduler, database or actual run/test evidence was assumed | pass |
