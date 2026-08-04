# L4-observability 03-详细设计 Step 08 - S08-E Consumer I09 `ConsumeReportConsumerFeedback`

> 状态: `defined_with_affected_open`；S08-E Consumer family final protocol

## 1. Protocol identity and non-owner boundary

| item | contract |
|---|---|
| name / code | `ConsumeReportConsumerFeedback` / `0x0309` |
| producer | authenticated `ObservationProducerFamily::ReportConsumer` |
| envelope | `ObservationInboundEventEnvelope<ReportConsumerFeedbackPayload>` |
| assembler | `ObservationInboundInputAssembler::consume_report_consumer_feedback` |
| service | `ObservationInboundEventService::consume_report_consumer_feedback` |
| result | `ObservationConsumerResult` -> shared Consumer receipt |
| flow | `ConsumeReportConsumerFeedbackFlow` |

I09 records a body-free local observation of report-consumer delivery/gap feedback. The external
consumer owns its own receipt, acceptance, rendering, use, verdict and lifecycle. Observability does
not infer those truths and does not let feedback rewrite report, evidence, retention or source truth.

## 2. Public payload and field provenance

```rust
pub struct ReportConsumerFeedbackPayload {
    pub consumer_ref: PeripheralConsumerRef,
    pub delivery_ref: Option<PeripheralDeliveryRef>,
    pub delivery_result: PeripheralDeliveryResult,
    pub gap_kind: Option<GapKind>,
}

impl ObservationInboundPayload for ReportConsumerFeedbackPayload {
    const CONSUMER: ObservationInboundConsumerName =
        ObservationInboundConsumerName::ConsumeReportConsumerFeedback;
    const PRODUCER: ObservationProducerFamily = ObservationProducerFamily::ReportConsumer;
}
```

| field | authority | validation/local role | forbidden fallback |
|---|---|---|---|
| `consumer_ref` | authenticated structured consumer contract | complete consumer identity/scope/type; exact relation selector | string/product/endpoint/tenant or first catalog match |
| `delivery_ref` | optional prior Observability delivery correlation | if Some, exact `PeripheralDeliveryState` lookup and consumer relation | latest delivery, preparation ref, source event, mint replacement |
| `delivery_result` | finite feedback schema | candidate local adapter-independent result | external acceptance/verdict/free-text/provider code |
| `gap_kind` | optional finite observed gap category | independent candidate for owner-backed P12/H8 evaluation | derive from result, create gap without policy/identity |

`delivery_ref` and `gap_kind` are independent Options. A gap does not prove a delivery exists; a
failed/rejected delivery does not automatically create a gap. Consumer ref cannot be reduced to an
opaque scope alias because current `PeripheralConsumerRef` is a complete structured contract.

## 3. Callables, assembly and canonical material

```rust
fn consume_report_consumer_feedback(
    &self,
    actor_ref: ActorSafeRef,
    envelope: ObservationInboundEventEnvelope<ReportConsumerFeedbackPayload>,
) -> Result<ConsumeReportConsumerFeedbackInput, ApplicationError>;

fn consume_report_consumer_feedback<'a>(
    &'a self,
    input: ConsumeReportConsumerFeedbackInput,
) -> ApplicationServiceFuture<'a, ObservationConsumerResult>;
```

Header and trusted actor follow shared authority. Static registration requires I09/ReportConsumer
before payload decode. Assembler is zero-I/O and produces one complete Step 06 input or error.

Canonical payload order:

```text
consumer_ref
delivery_ref (Option)
delivery_result
gap_kind (Option)
```

The complete structured `consumer_ref` enters canonical bytes. Logical identity is `(I09, actor,
dedup_key)` and secondary identity is `(I09, ReportConsumer, source_event_ref)`. Both are atomically
reserved. `trace_ref`, occurred time, transport facts and generated local ids do not enter request
material.

## 4. Delivery/gap relation matrix

| delivery_ref | gap_kind | required selected behavior | forbidden behavior |
|---|---|---|---|
| Some | None | validate exact consumer/delivery/preparation/view/state relation; owner may record one delivery transition or no-change | update by consumer-only latest row |
| Some | Some | independently validate delivery transition and P12/H8 gap decision; both may share one UoW only if each has its own accepted proof | infer gap from delivery result or reuse delivery transition as gap proof |
| None | Some | only owner-approved gap observation branch; no delivery mutation | mint delivery, infer preparation/view |
| None | None | only explicit durable no-change/rejection branch | fabricate success or generic feedback marker |

`GapState::open_from_decision` and H8 require a complete target-bound P12 decision and new gap identity;
I09 payload `gap_kind` alone is insufficient. `PeripheralDeliveryState` changes only through its
canonical transition and version guard; producer feedback cannot set fields directly.

Register:

```text
S08-E-I09-DELIVERY-RELATION-01=open_internal_affected
S08-E-I09-GAP-AUTHORITY-01=open_internal_affected
S08-E-I09-DURABLE-LANDING-01=open_internal_affected
S08-E-I09-ACTION-MATRIX-01=open_internal_affected
S08-E-I09-DOWNSTREAM-WRITE-CAPABILITY-01=open_internal_affected
```

Closure defines exact lookup keys、phase/state compatibility、P12 input source、one or two selected
transitions、H8/H9/outbox cardinality and durable no-change. Frozen old Step 09 targets do not close
these owners.

## 5. UoW and follower cardinality

Only `Acquired` writes. If both a delivery transition and a gap transition are independently accepted,
they share one operation UoW/cursor but retain distinct domain decisions, expected versions and H9/H8
records. Neither transition may be inferred from the other's post-state.

```text
atomic reserve
  -> exact delivery relation/version read when delivery_ref is Some
  -> exact gap-policy inputs/decision when gap_kind is Some
  -> validate all selected transitions before first write
  -> stage selected delivery and/or gap primaries
  -> allocate one Observation cursor if record-bearing
  -> stage exact H9/H8 records and mapped outbox followers
  -> save immutable Consumer result with exact changed/outbox/gap refs
  -> mark reservation Completed
  -> commit once
```

An empty selected set is not silently committed unless the future owner defines a durable `NoOp`
surface. Known failure rolls back all selected facts. Unknown commit uses the original dual-index
probe. Replay returns exact original refs and does not inspect current delivery/gap state.

## 6. Result/error/action totality

| branch | surface | write/action rule |
|---|---|---|
| malformed consumer/ref/result/options | Ephemeral rejected | zero reserve/write; no alternate decoder |
| unsupported schema | Ephemeral unsupported | source event retained safely; no payload parse |
| missing exact delivery dependency | delayed or deterministic rejection by owner | no latest/fallback relation |
| gap policy blocked/no mutation | owner-defined stored no-change or rejection | no gap identity/H8 unless accepted P12 transition |
| accepted delivery/gap set | Stored fresh | exact refs and known commit only |
| duplicate | Stored replay | no second H8/H9/outbox/result |
| idempotency/CAS/relation conflict | typed error | no winner exposure/partial commit |
| unknown/corrupt result | no terminal completion | probe/manual only |

The I09 C-05 mapper is named, pure, total and no-wildcard after its affected closes. It consumes the
validated receipt/probe and shared recovery class; it cannot infer `Retry` from `delivery_result`,
`gap_kind`, severity or error message. Post-commit ack/dead-letter failure preserves local facts.

## 7. Redaction, telemetry and no-truth-backwrite

Telemetry permits finite protocol/producer/schema/result/gap-presence/outcome/error/recovery/action
tokens and bounded counts. Full consumer ref, delivery/gap refs, actor/source/event, trace, digest,
endpoint/product/credential/provider response/report/evidence body are forbidden as labels or raw
fields. Redacted correlation may be used only after allowlisting.

I09 does not modify consumer truth, report/handoff readiness, evidence, retention, source/business
truth or external delivery. Local `Delivered` means only the selected Observability delivery state
recorded a finite adapter-independent result; it is not consumer acceptance or signoff.

## 8. S08-E family stop review

| check | conclusion |
|---|---|
| I09 schema/input/callables | field-level, complete and constructable |
| upstream blocker | none newly found; Step 14 still owns authenticated transport binding |
| local affected | five explicit owner gaps; no hidden fallback |
| I09 status | `defined_with_affected_open`, not runtime-ready |
| Consumer family count | `9/9 defined_with_affected_open`; total `39/60`; `0/60` unconditional complete |
| actor/redaction/truth | trusted actor only; body-free; no external/business truth backwrite |
| result/replay/action | immutable stored surface; action separate; unknown no terminal completion |
| next M1 family | S08-F Outbound Event E01; Step 09 remains frozen |
| implementation/evidence | not implemented/tested/run; no commit/run_id/evidence alias/signoff |
