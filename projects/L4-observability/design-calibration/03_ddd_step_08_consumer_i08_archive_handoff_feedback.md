# L4-observability 03-详细设计 Step 08 - S08-E Consumer I08 `ConsumeArchiveHandoffFeedback`

> 状态: `defined_with_affected_open`；不表示 archive binding、implementation 或 runtime evidence 已完成

## 1. Identity, purpose and truth boundary

| item | contract |
|---|---|
| name / code | `ConsumeArchiveHandoffFeedback` / `0x0308` |
| producer | authenticated `ObservationProducerFamily::Archive` |
| envelope | `ObservationInboundEventEnvelope<ArchiveHandoffFeedbackPayload>` |
| assembler | `ObservationInboundInputAssembler::consume_archive_handoff_feedback` |
| service | `ObservationInboundEventService::consume_archive_handoff_feedback` |
| result | `ObservationConsumerResult` and shared immutable receipt |
| reserved flow | `ConsumeArchiveHandoffFeedbackFlow` |

I08 records an observation-side, body-free feedback relation for an existing report handoff. Archive
owns archive package、storage、acceptance、retention、receipt and external lifecycle truth. A positive
feedback value is not acceptance signoff, verdict, evidence alias or proof that a report was consumed.

## 2. Public payload schema and field authority

```rust
pub struct ArchiveHandoffFeedbackPayload {
    pub archive_handoff_ref: ArchiveReportHandoffRef,
    pub handoff_ref: ReportHandoffRecordRef,
    pub delivery_result: HandoffDeliveryResult,
    pub feedback_summary_ref: Option<SafeSummaryRef>,
}

impl ObservationInboundPayload for ArchiveHandoffFeedbackPayload {
    const CONSUMER: ObservationInboundConsumerName =
        ObservationInboundConsumerName::ConsumeArchiveHandoffFeedback;
    const PRODUCER: ObservationProducerFamily = ObservationProducerFamily::Archive;
}
```

| field | authority | local use | forbidden substitution |
|---|---|---|---|
| `archive_handoff_ref` | authenticated archive body-free protocol | exact external feedback identity and relation key | package/path/provider id, local handoff ref, event ref |
| `handoff_ref` | prior Observability handoff correlation carried by archive contract | exact local `ReportHandoffRecord` lookup | latest handoff, scope/consumer search, mint new handoff |
| `delivery_result` | finite archive feedback schema | candidate adapter-independent local feedback classification | acceptance/signoff/verdict, free-text/provider status |
| `feedback_summary_ref` | optional pre-redacted safe projection | optional local feedback summary relation | archive body, response text, error body, synthetic ref |

All four values are body-free. `feedback_summary_ref=None` is an explicit absence and cannot be filled
from dead-letter、telemetry、provider response or current archive state.

## 3. Exact callables and assembly closure

```rust
fn consume_archive_handoff_feedback(
    &self,
    actor_ref: ActorSafeRef,
    envelope: ObservationInboundEventEnvelope<ArchiveHandoffFeedbackPayload>,
) -> Result<ConsumeArchiveHandoffFeedbackInput, ApplicationError>;

fn consume_archive_handoff_feedback<'a>(
    &'a self,
    input: ConsumeArchiveHandoffFeedbackInput,
) -> ApplicationServiceFuture<'a, ObservationConsumerResult>;
```

Header authority, actor, source-event identity, source/version relation, schema, dedup/time/trace follow
the shared Consumer carrier. The assembler validates only I08/Archive and decodes no other payload.
It constructs the Step 06 concrete input atomically and performs no repository or archive call.

Canonical payload order is:

```text
archive_handoff_ref
handoff_ref
delivery_result
feedback_summary_ref (Option)
```

The shared prefix is operation、actor、producer、source event、source、optional source version、schema.
dedup/time/trace/transport/provider/generated refs are excluded. One candidate set reaches atomic
reservation and replay unchanged.

## 4. Relation and durable landing contract

Current `ReportHandoffRecord::deliver` accepts a finite `HandoffDeliveryResult`, but I08 cannot call it
solely because an archive producer reports a value. The service must first prove an owner-approved
relation among `archive_handoff_ref`, the exact local handoff, its current consumer/binding/material,
and the expected feedback phase. It must also distinguish Archive feedback from the local outbound
delivery adapter result owned by J07.

| condition | required behavior | prohibited behavior |
|---|---|---|
| exact active feedback relation and eligible local handoff state | one owner-approved transition or explicit durable no-change | treating Archive response as unconditional `deliver` authority |
| unknown/foreign local handoff | typed missing/relation error or delayed dependency | create handoff or search latest by archive ref |
| duplicate identical feedback | atomic replay or exact domain no-change under original reservation | append second H4/outbox/result |
| changed result under same identities | idempotency/relation conflict | overwrite original local result |
| terminal incompatible handoff | deterministic rejection/manual consistency according to owner | reopen lifecycle or fabricate retryable state |
| safe summary absent | preserve None | derive from provider text or stored archive package |

Register:

```text
S08-E-I08-FEEDBACK-RELATION-01=open_internal_affected
S08-E-I08-DURABLE-LANDING-01=open_internal_affected
S08-E-I08-ACTION-MATRIX-01=open_internal_affected
S08-E-I08-DOWNSTREAM-WRITE-CAPABILITY-01=open_internal_affected
```

`FEEDBACK-RELATION` closes only when Step 06/07 defines the exact lookup key, phase/binding proof,
state compatibility and duplicate/conflict matrix. `DURABLE-LANDING` selects one transition/H4/follower
set or durable no-change. It cannot be inferred from the frozen Step 09 `pass` row.

## 5. UoW, result, replay and recovery

```text
atomic reserve(logical scope + I08/Archive/source event)
  -> exact feedback relation and versioned handoff load
  -> one owner-approved transition or durable no-change
  -> stage handoff + exact H4/outbox followers
  -> save immutable Consumer result
  -> mark reservation Completed
  -> commit once
  -> validate receipt
  -> invoke exact I08 C-05 mapper once
```

H4 uses the accepted `ReportHandoffTransition` plus same-UoW post-state and finite feedback origin; it
does not copy archive body or claim external acceptance. Result precedes completion. Known failure
rolls back the whole local set. Commit unknown uses both original indexes; unresolved/corrupt result
has no terminal completion and no current-truth reconstruction.

| branch | receipt / recovery |
|---|---|
| malformed/foreign input | Ephemeral rejected, zero write |
| unsupported schema | Ephemeral unsupported, zero decode/reserve |
| temporary exact relation unavailable | Ephemeral delayed under shared recovery owner |
| compatible in-flight | delayed, no second writer |
| accepted transition/no-change | Stored fresh after known commit |
| completed duplicate | exact Stored replay; original outcome/refs/error unchanged |
| conflict/CAS/terminal mismatch | typed finite error; no partial write/winner disclosure |
| commit unknown/result corrupt | probe/manual; no C-05 action |

I08 action mapping is named, pure, total and no-wildcard after its affected closes. It consumes receipt
branch/outcome/access, commit certainty, refs/error, recovery and static Archive policy. Broker action
failure never rolls back the local handoff feedback fact.

## 6. Redaction, audit and report-handoff boundary

Allowed telemetry is limited to finite I08/Archive/schema/result/error/recovery/action tokens, bounded
counts, presence and redacted refs. Archive package/body/path/provider response、credentials、digest、
report body、verdict、signoff、real run id and transport locator are forbidden in log/metric/trace/audit/
receipt/dead-letter. No ref or actor/source/event value is a metric label.

I08 may update only an explicitly selected Observability handoff feedback projection. It does not
create a report, evidence, retention hold, archive package, consumer acceptance or business truth.
`Delivered` in a local finite result means only the exact local feedback relation accepted that value.

## 7. Final review

| check | conclusion |
|---|---|
| payload/callable/input | complete and constructable at Step 08 level |
| upstream blocker | none newly found; archive transport/schema binding activation remains Step 14 |
| local affected | relation、landing、action、least-authority explicitly open |
| status | `defined_with_affected_open`, not runtime-ready |
| count after I08 | `38/60`; Consumer `8/9`; `0/60` unconditional complete |
| shared affected | recovery、outbox/quarantine/indeterminate、UoW、Step 09 flow remain open |
| implementation/evidence | not implemented/tested/run; no commit/run_id/evidence/signoff |
