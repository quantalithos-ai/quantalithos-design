# L2-tools Step 6 模块附录: application / infra / entry stable carriers

> 状态: completed / pass
> 主文件: `03_ddd_step_06_object_contracts.md`
> Authority: `03_ddd_step_05_module_contracts.md`;正式 `02-概要设计.md` §7 / §8 / §12
> 作用: 闭口后续 Port、协议与 flow 必需的稳定工程 carrier；它们不增加业务 identity，也不允许 api / worker / jobs / infra 拥有 domain truth。

## 1. Non-core carrier closure decisions

| Carrier | Planned module | Why Step 6 must close it | Business-truth rule |
|---|---|---|---|
| `StoredCommandResult` | application | Duplicate replay needs a typed stable result | Refers to committed truth; does not replace it |
| `IdempotencyRecord` | application | Key/digest lifecycle and conflict must precede repository design | Technical sidecar with channel/operation scope |
| `VisibilityDecision` | application | Every Query needs a no-write, fail-closed visibility result | Does not create actor/authorization policy truth |
| `EntryDisposition` | contracts/application | All entries need one stable mapping | Describes entry result only |
| `AdapterAvailability` | infra | Blocked/unavailable/unsupported must be distinguishable | Does not define external system readiness |
| `ProjectionWriteResult` | application/infra | Rebuild and stale/conflict behavior needs typed result | Does not change source truth |
| `ConsumerReceipt` | contracts/worker | Dedup/quarantine/gap response must be stable | Not broker delivery/ack/DLQ truth |
| `JobReport` | contracts/jobs | Job result/cursor/watermark must be stable | Not scheduler/run/evidence truth |
| `ConsumerMetadata` / `ConsumerClaim` | application/worker boundary | Envelope precheck and one bounded receipt UoW need typed identity | Technical claim; not source delivery truth |

`EntryDisposition`, `ConsumerReceipt` and `JobReport` public schemas are fixed in the contracts annex. This annex fixes application/infra ownership and functions that use them.

## 2. `StoredCommandResult`

| Field | Type | Source / invariant |
|---|---|---|
| `operation` | `ToolCommandKind` | Entry dispatch; closed enum |
| `idempotency_scope` | `IdempotencyScope` | Channel + operation + actor authority |
| `idempotency_key` | `IdempotencyKey` | Validated `CommandMetadata` |
| `request_digest` | `CanonicalRequestDigest` | Protocol canonical encoder over semantic request and stable metadata frame |
| `disposition` | `EntryDisposition` | Committed application result mapping |
| `value` | `Option<StoredCommandValue>` | Exact closed typed value staged for accepted / awaiting results; absent for error-only dispositions |
| `result_refs` | `CommandResultRefSet` | Re-readable local truth/fact/view refs |
| `error_ref` | `Option<StoredErrorRef>` | Required only for replayable rejected/unavailable outcomes allowed by operation policy |
| `error` | `Option<StoredApplicationError>` | Exact closed body-free error snapshot for replayable committed error branches; symmetric with `error_ref` |
| `committed_version` | `CommittedVersion` | Repository-returned subject version, or the UoW candidate watermark for append-only target sets |
| `committed_at` | `CommitTime` | Persistence-authority `ToolsUnitOfWork.commit_candidate()`; confirmed by the matching receipt before response/replay |

| Callable | Contract |
|---|---|
| `stage_committed(...) -> Result<Self, ApplicationError>` | Result refs and repository-returned versions exist in the same UoW; the stored value carries that UoW's immutable candidate stamp and remains non-visible on rollback |
| `matches_digest(&CanonicalRequestDigest)` | Constant semantic equality; timestamp/transport headers excluded |
| `replay(&CommitConfirmation) -> Result<StoredCommandReplay, IntegrityError>` | Returns exact stored disposition, refs, error ref and version only when the persistence authority confirms the matching candidate; never reruns domain logic |
| `conflicts_with(&CanonicalRequestDigest)` | Same scoped key and different digest |

`StoredCommandValue` is a closed application carrier with these variants: `ToolContract(ToolContractView)`, `CompatibilityImpact(ToolCompatibilityImpactView)`, `CapabilityBinding(CapabilityBindingView)`, `ToolInvocation(ToolInvocationView)`, `ExecutionPrecondition(ExecutionPreconditionView)`, `ExecutionHandoff(ExecutionHandoffCommandView)`, `OutcomeAudit(OutcomeAuditView)`, `SafeExternalHandoff(SafeExternalHandoffView)`, and `ConsistencyGap(ConsistencyGapView)`. `operation` fixes which variant is legal, so two Commands sharing a view cannot be replayed under another operation. Every variant is an immutable body-free snapshot using the Step 8 public schema; it is not a transport serialization or a second domain truth.

`StoredApplicationError` contains `ToolErrorCode`, `ProtocolErrorClass`, code-owned `SafeErrorMessage`, `RetryHint`, typed subject refs, gap refs and correlation ref. It is populated only for an error branch whose assessment/gap/phase marker was committed and therefore must be replayable. It cannot contain raw backend/provider text, request/result body, stack trace, secret, evidence, transport status or arbitrary map. `ProtocolError::from_stored_application_error` is a pure exact mapping; missing/mismatched error snapshots are integrity failures.

## 3. `ConsumerMetadata` and `ConsumerClaim`

```rust
/// Application metadata derived from a validated inbound envelope.
pub struct ConsumerMetadata {
    pub consumer: ToolInboundConsumerName,
    pub scope: IdempotencyScope,
    pub idempotency_key: IdempotencyKey,
    pub source_authority_ref: SourceAuthorityRef,
    pub source_event_id: SourceEventId,
    pub deduplication_key: DeduplicationKey,
    pub correlation_ref: CorrelationRef,
    pub trace_context: TraceContext,
    pub request_digest: CanonicalRequestDigest,
}

/// Stable replay identity captured before any observational dependency call.
pub struct ConsumerReplayFrame {
    pub consumer: ToolInboundConsumerName,
    pub scope: IdempotencyScope,
    pub idempotency_key: IdempotencyKey,
    pub request_digest: CanonicalRequestDigest,
    pub source_event_id: SourceEventId,
    pub deduplication_key: DeduplicationKey,
}

/// Result of the read-only Consumer gate before a durable claim is acquired.
pub enum ConsumerPrecheck {
    /// No committed or in-flight record exists; the caller may reserve a claim.
    Ready(ConsumerReplayFrame),
    /// A committed receipt exists and can be returned without re-running work.
    Replay(ConsumerReceipt),
}

/// Durable claim frame used by one inbound receipt completion.
pub struct ConsumerClaim {
    pub scope: IdempotencyScope,
    pub key: IdempotencyKey,
    pub digest: CanonicalRequestDigest,
    pub lease_ref: IdempotencyLeaseRef,
    pub expected_version: ExpectedVersion,
}
```

`ConsumerMetadata::from_envelope(...)` is pure after envelope/source/actor validation and excludes
`received_at` from the digest. It derives `scope` and `idempotency_key` from the closed tuple
`(consumer, source_authority_ref, source_event_id, deduplication_key)`; it never reads transport
headers or creates an actor authority. `precheck_consumer_replay(...)` reads
`IdempotencyStore::get` before an observational Port call and returns `ConsumerPrecheck::Ready`,
exact replay, digest conflict, or in-flight error. Every Consumer then acquires a durable claim in
a phase-1 local UoW before any Port or reverse lookup. This closes the concurrent observational-call
race. `IF-03` keeps the same claim across its formal `CF-11` re-entry; ordinary Consumers continue
from the phase-1 claim into a read/Port phase and a phase-2 local-effects UoW.

`ConsumerReceipt::accepted(...)`, `ConsumerReceipt::gap_recorded(...)`, `rejected(...)` and
`quarantined(...)` are the only receipt factories. `receipt_for_effect(...)` is a pure mapper that
chooses `accepted` when no blocking gap exists and `gap_recorded` otherwise; it cannot invent a
new disposition or transport acknowledgment. `receipt_for_command_result(...)` is the corresponding
closed mapper for `IF-03`; it accepts only an exact committed/replayed `CF-11` disposition and refs,
maps accepted/error/conflict branches to the named receipt factories, and rejects transient or
uncommitted results without producing a receipt.

There is no raw response body, serialized transport response or external receipt. An API adapter maps the stored closed value back to the exact protocol generic type and verifies all stored refs against it; it does not rebuild a historical response from current mutable truth. `CommittedVersion` is a closed union of an adapter-returned versioned-subject stamp and a transaction-watermark stamp; application never guesses either value. Candidate/receipt mismatch, operation/value mismatch, a visible result without a committed idempotency record, or a result ref whose target cannot be attributed is an integrity failure rather than a replay fallback.

Stop review: every replay field is committed and exact even after later subject mutation; same-key/different-digest cannot overwrite; pass after Step 9 controlled typed-snapshot correction.

## 3. `IdempotencyRecord`

| Field | Type | Source / invariant |
|---|---|---|
| `scope` | `IdempotencyScope` | Entry kind, command/consumer/job kind and actor/source authority |
| `key` | `IdempotencyKey` | Metadata/envelope/job input |
| `request_digest` | `CanonicalRequestDigest` | Canonical protocol encoder |
| `state` | `IdempotencyRecordState` | Repository/UoW transition only |
| `lease_ref` | `Option<IdempotencyLeaseRef>` | Local operation-phase claim acquired transactionally and persisted across an explicitly designed multi-UoW flow; not distributed scheduler truth |
| `stored_result_ref` | `Option<StoredCommandResultRef>` | Required for committed command replay |
| `consumer_receipt_ref` | `Option<ConsumerReceiptRef>` | Required for committed consumer replay |
| `job_report_ref` | `Option<JobReportRef>` | Required for committed job replay |
| `created_at` | `DecisionTime` | Clock at claim |
| `committed_at` | `Option<CommitTime>` | UoW candidate time staged with `Committed`; valid externally only after matching commit confirmation |

| Variant | English rustdoc | Allowed destination |
|---|---|---|
| `Claimed` | `/// The scoped key and canonical digest are durably reserved for one local operation phase.` | `Committed`, `Aborted` |
| `Committed` | `/// A replayable local result was committed for the scoped key and digest.` | none |
| `Aborted` | `/// The local unit of work ended without a committed replay result.` | none; a new claim follows explicit expiry/recovery policy |

Functions: `claim(...)`; `continue_claim(IdempotencyLeaseRef, OperationPhase, DecisionTime)`; `commit_command_result(StoredCommandResultRef, CommitCandidate)`; `commit_consumer_receipt(ConsumerReceiptRef, CommitCandidate)`; `commit_job_report(JobReportRef, CommitCandidate)`; `abort(LocalAbortReason)`; `classify_duplicate(scope, key, digest) -> DuplicateClassification`. `continue_claim` is allowed only for a flow whose durable phase marker and claim digest/operation/actor match; it never steals an active/ambiguous claim. A `Committed` transition is staged in the same UoW as its referenced result and becomes externally valid only when that exact candidate is confirmed. The classification is `Replay`, `InFlight`, or `DigestConflict`; it never silently treats an aborted/different digest or an unconfirmed candidate as success.

For `CF-10`, the committed `ExecutionHandoff` is the durable pre-call marker; for `CF-12` / outbound continuation, `ExternalSubmissionAttempt::Prepared` is the marker; for `IF-03`, the Consumer claim itself fences one deterministic formal `CF-11` re-entry and carries no external-call authority. Only these named flows may leave an idempotency record `Claimed` after a successful phase commit. Recovery may resume before a side-effecting Port call only when its named marker proves `call_not_started`; after call start/result ambiguity, the claim remains in-flight and opens an integrity gap/manual-owner path rather than repeating the external side effect. `IF-03` recovery may re-enter only the same derived `CF-11` key, which must replay a committed result before the Consumer receipt is completed.

Stop review: key scope, digest, result variant and lifecycle are exact; idempotency is technical sidecar truth, not a business aggregate; pass.

## 4. `VisibilityDecision`

| Field | Type | Source / invariant |
|---|---|---|
| `subject_ref` | `TypedSubjectRef` | Query body |
| `actor_ref` | `ActorRef` | `QueryMetadata.actor` |
| `consumer_context` | `ConsumerContext` | `QueryMetadata.consumer` |
| `owner_scope_ref` | `OwnerScopeRef` | Local subject read / formal owner mapping |
| `state` | `ConsumptionVisibility` | Application resolver result |
| `basis_refs` | `VisibilityBasisRefSet` | Actor authority and local owner/scope refs |
| `decided_at` | `DecisionTime` | Query operation clock; not persisted as policy truth by default |

Functions: `visible(...)`; `not_found(...)`; `forbidden(...)`; `unavailable(...)`; `stale(...)`; `permits_projection()`; `public_disposition()`. `NotFound` and `Forbidden` may map to the same external anti-enumeration surface where required, but remain distinct typed application decisions. `Unavailable` never falls back to visible.

Stop review: the decision consumes attributable actor/consumer and local owner scope; it neither evaluates effective authorization nor writes subject/projection state; pass.

## 5. `AdapterAvailability`

| Field | Type | Source / invariant |
|---|---|---|
| `adapter_kind` | `ExternalAdapterKind` | Composition root |
| `capability` | `AdapterCapability` | Named Port operation |
| `state` | `AdapterAvailabilityState` | Binding/probe/config validation result |
| `blocked_reason` | `Option<AdapterBlockedReason>` | Required for blocked/unsupported; safe enum/ref only |
| `authority_ref` | `Option<ExternalAuthorityRef>` | Formal dependency binding if resolved |
| `assessed_at` | `ConsumptionTime` | Clock at local check |

| Variant | English rustdoc | Port behavior |
|---|---|---|
| `Available` | `/// A configured adapter can accept the named local Port operation.` | The call may be attempted; no external success implied |
| `Unavailable` | `/// The configured adapter cannot currently accept the local Port operation.` | Typed unavailable error |
| `Blocked` | `/// A required external authority, schema, mapping or route is not formally closed.` | Typed blocker error; fail closed |
| `Unsupported` | `/// No configured adapter supports the named operation or contract version.` | Deterministic unsupported error |

Factories are `available`, `unavailable`, `blocked`, `unsupported`; `permits_call()` is true only for `Available`. No health score, retry loop, provider lifecycle or readiness claim exists.

Stop review: local adapter-call availability is not external system readiness; every blocker remains visible; pass.

## 6. `ProjectionWriteResult`

| Field | Type | Source / invariant |
|---|---|---|
| `projection_key` | `ProjectionKey` | Projection/report identity |
| `requested_watermark` | `LocalTruthWatermark` | Builder input |
| `stored_watermark` | `Option<LocalTruthWatermark>` | Projection store result |
| `stored_version` | `Option<ProjectionVersion>` | Successful/current store result |
| `state` | `ProjectionWriteState` | Compare-and-replace outcome |
| `gap_refs` | `ConsistencyGapRefSet` | Conflicting/unavailable build or store gaps |

| Variant | English rustdoc | Meaning |
|---|---|---|
| `Applied` | `/// The projection snapshot was stored at the requested source watermark.` | New version returned |
| `AlreadyCurrent` | `/// An equivalent or newer snapshot is already stored.` | No write; idempotent success |
| `StaleInput` | `/// The requested source watermark is older than the stored snapshot.` | No overwrite |
| `Conflict` | `/// Equal ordering inputs produce conflicting projection content or versions.` | Gap and typed conflict |
| `Unavailable` | `/// The projection store could not complete the local write.` | Source truth unchanged |

Functions: `applied`; `already_current`; `stale_input`; `conflict`; `unavailable`; `requires_retry()`; `changed_projection()`. The adapter cannot return `Applied` without a stored watermark/version.

Stop review: source watermark ordering and write result symmetry are exact; no stale write can replace a newer projection; pass.

## 7. Entry modules cannot own truth

| Module | Allowed responsibility | Must call | Forbidden direct behavior |
|---|---|---|---|
| `api` | Parse/version/validate Command and Query DTO, map application result/error | `application` command/query service traits | Domain construction beyond public mapper, repository access, external Port call, policy decision |
| `worker` | Validate envelope, isolate source, call inbound consumer service, serialize `ConsumerReceipt` | `application` consumer service and idempotency boundary | Direct relation/outcome/gap overwrite, broker retry/DLQ ownership, source body persistence |
| `jobs` | Validate `JobMetadata`, call bounded job service, serialize `JobReport` | `application` job service, repositories/ports through application | Scheduler/run truth, core subject repair, fabricated evidence or success |
| `infra` | Implement application-owned traits and map local/external failures | Named Port / Repository contracts | Domain branching, hidden last-known-good, external lifecycle ownership |

Entry handler structs may contain service trait objects, mapper and safe error encoder only. They have no business state, repository transaction, direct SDK/HTTP/RPC client or raw provider response fields.

## 8. Module Gate

| Check | Result |
|---|---|
| Four application carriers and two infra carriers have exact fields/functions/states | pass |
| Worker/jobs carriers have exact public schema in contracts annex and ownership here | pass |
| Idempotency result, receipt and report variants are mutually exclusive and replayable | pass |
| Visibility is no-write and cannot become authorization policy truth | pass |
| Adapter/projection technical state cannot become external/domain truth | pass |
| api/worker/jobs/infra forbidden direct behaviors are explicit | pass |
| Step 7 can define repositories, UoW, external Ports and fakes without inventing a carrier | pass |
