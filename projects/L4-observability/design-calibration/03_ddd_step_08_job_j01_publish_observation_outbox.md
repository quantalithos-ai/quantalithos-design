# L4-observability 03-详细设计 Step 08 - S08-G Job J01 `PublishObservationOutbox`

> 对应 SOP: `standards/document/详细设计讨论流程_SOP.md` Step 08
> 状态: `defined_with_affected_open`；不是 implementation/runtime complete
> 回填目标: 正式 `03-详细设计.md` §7；仅在 Step 19 装配

## 1. Protocol identity and responsibility boundary

J01 是唯一允许发布 Observability outbound outbox snapshot 的 Operations Job。它只维护本地
`OutboxPublicationState`、publication receipt/failure/dead-letter marker 与 Job report；不拥有源
observation truth，不回滚 owner UoW，不重建事件 payload，不承担 transport ack 的业务含义。

| item | exact contract |
|---|---|
| public protocol | `ObservationJobRequest<PublishObservationOutboxJobInput>` |
| public name | `PublishObservationOutbox` |
| internal operation | `ObservationJobOperation::PublishObservationOutbox` |
| entry callable | `ObservationOperationsJobService::publish_observation_outbox(PublishObservationOutboxInput)` |
| work-key variant | `ObservationJobWorkKey::Outbox(OutboxRecordRef)` |
| planned material | exact outbox ref + immutable payload snapshot + historical binding + source/cursor guard |
| Step 09 flow | `PublishObservationOutboxFlow` |

The public request, metadata, response and stored report reuse the shared Step 08 Job carriers. This card
owns only J01-specific input/output and item mapping; it does not redeclare `ObservationJobRequest`,
`ObservationJobReportSurface` or `ObservationJobResponse`.

## 2. Input and output schema

```rust
/// Candidate selector for one bounded publication plan.
pub struct PublishObservationOutboxJobInput {
    pub cursor: Option<OutboxCursor>,
    pub limit: PositiveLimit,
    pub event_filter: Vec<ObservationOutboundEventName>,
}

/// Body-free operation output; report owns counts and terminal outcome.
pub struct PublishObservationOutboxJobOutput {
    pub scanned_outbox_refs: OutboxRecordRefSet,
    pub published_outbox_refs: OutboxRecordRefSet,
    pub retryable_outbox_refs: OutboxRecordRefSet,
    pub failed_outbox_refs: OutboxRecordRefSet,
    pub dead_letter_refs: DeadLetterRefSet,
}
```

Input validation is exhaustive: `limit` must satisfy `PositiveLimit` and the runtime/hard plan bound;
the event filter is canonical sorted/unique and may be empty only when the explicit contract means “all
registered outbound event names”; cursor namespace must be an outbox cursor. The request cannot contain
topic, endpoint, credential, provider, attempt count, worker cadence, current route or arbitrary event text.

Output sets are derived from the terminal item fold, canonical sorted/unique and disjoint by outcome. An
item that remains pending is represented only in the shared report, never placed in a success/failure set.
`dead_letter_refs` is non-empty only when the exact outbox item outcome carries the existing
`PublicationDeadLetter` association. Output does not expose payload bytes, publication token, claim/fence,
provider receipt or external run identity.

| public job outcome | output rule | report rule |
|---|---|---|
| `Completed` | all scanned items terminal and output sets complete; retryable/failed/dead-letter empty | report counts prove no pending/failure/block |
| `PartiallyCompleted` | successful and terminal failure sets may coexist; no pending items | report fold preserves each item association |
| `FailedRetryable` | output may be absent or partial; unprocessed items remain pending | typed report failure, never synthetic success |
| `FailedPermanent` | preserve known item sets; unresolved items stay pending | exact report-level failure association |
| `Blocked` | no unsupported item is silently classified; blocked refs remain in report | guard/no-write/dependency association required |

## 3. Candidate materialization and claim contract

```text
validated request + runtime CandidateLimit/PublicationRetry
  -> reserve idempotency and load/replay stored Job result
  -> bounded eligible outbox scan using cursor/filter/limit
  -> freeze exact Outbox work keys and immutable plan material
  -> persist plan + Draft report
  -> acquire one global claim per OutboxRecordRef
```

Each item must capture `ObservationOutboxPayloadSnapshot`, `OutboxRecordRef`, event name/schema, committed
cursor, payload digest, historical `ExternalEffectBindingRef`, stable publication token material and the
repository version needed for CAS. The item cannot contain only an event ref or current outbox pointer.
The global work key is `Outbox(outbox_ref)`, not `(execution_ref, ordinal)`.

Claim/fence proves authority for local marker and item classification writes only. It does not prove external
exactly-once, provider acceptance or source truth rollback. A stale claim, binding mismatch, snapshot digest
mismatch or changed outbox version stops before any external call.

## 4. Item execution and external phase

```text
load exact planned outbox record/snapshot/binding
  -> validate snapshot bytes, schema, digest and stable token
  -> outside local UoW call publisher with exact stored bytes
  -> on unknown outcome probe the same token
  -> short UoW revalidate claim/fence and outbox version
  -> mark Published / Failed / DeadLettered
  -> classify item and fold report
```

The publisher receives the immutable stored snapshot and historical binding. It cannot query current truth,
current config or current event DTO to rebuild the payload. `PublicationFailureKind::OutcomeUnknown` is not
automatically retryable; it requires probe/manual classification. A retryable failure may reenter only with
the same plan material, binding and stable token under a fresh valid claim and frozen retry budget.

J01 publication marker failure never rolls back the source observation transition that created the outbox
record. A known committed local marker with later ack/dead-letter failure remains durable and is reported as
transport recovery work, not as an owner-truth failure.

## 5. Transaction, replay and error matrix

| phase/condition | local write ceiling | result/action |
|---|---|---|
| invalid request/filter/cursor | none | protocol/application error; no plan |
| idempotency duplicate with valid stored report | none | exact stored Job response with `Replayed`; no scan/publish |
| reservation conflict/in-flight | none | typed conflict/in-flight surface; no plan or claim |
| candidate snapshot missing/corrupt | no item mutation | consistency/manual report; no current-truth rebuild |
| publisher positive result + matching probe | one marker CAS | `Published` item |
| known retryable result | one `Failed` marker CAS | `FailedRetryable` item if budget remains |
| known permanent result | one `Failed` marker CAS | `FailedPermanent` item |
| valid dead-letter transition | one `DeadLettered` marker CAS | exact dead-letter association |
| commit or external outcome unknown | no guessed terminal action | probe/manual or blocked report |
| report/result save failure | prior committed marker remains; no reservation completion | report recovery; never rerun blindly |

Terminal Job replay loads the exact `StoredObservationResult(JobReport)` and validates job name, request
digest, plan/report digest, output and item fold. It does not relist outbox rows, republish bytes, mint a
new plan, or overwrite the original `job_run_id` correlation.

## 6. Redaction, audit and no-backwrite

Allowed log/metric/trace/audit fields: J01/event/schema/outcome/failure-class tokens, bounded counts,
presence flags and redacted local ref categories. Forbidden: payload bytes, provider response, topic,
endpoint, credential, stable token, digest bytes/hex, source body, raw trace, actor identity and external
run id. Audit records describe local publication marker transitions only.

J01 does not write source/business truth, evidence, retention, report verdict or external acceptance. The
only outbound effect is the exact already-frozen snapshot sent through the selected historical binding.

## 7. Step 09 handoff and affected

| handoff item | current contract |
|---|---|
| entry -> assembler -> service | exact named Job assembler and Operations Job façade |
| plan -> claim | immutable `Outbox` work key and global claim/fence |
| external call | exact stored snapshot + stable token; prepare/probe/retry phases remain explicit |
| result -> report | `ObservationPublicationItemResult` -> owner-qualified item association -> lossless fold |
| completion | save stored Job result before reservation completion; known commit only |
| affected | `S08-G-J01-CANDIDATE-CARDINALITY-01`, `S08-G-J01-PUBLICATION-RETRY-ACCOUNTING-01`, `S08-G-J01-PROBE-OWNER-01` remain `open_internal_affected`; shared `S08-EXPORT-NAME-COLLISION-01` is not applicable to J01 |
| status | `defined_with_affected_open`; not runtime-ready |
| implementation/evidence | not implemented, tested or run; no commit/run_id/evidence alias/signoff |
