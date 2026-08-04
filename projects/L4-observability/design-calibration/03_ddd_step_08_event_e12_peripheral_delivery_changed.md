# L4-observability 03-详细设计 Step 08 - S08-F Event E12 `PeripheralDeliveryChanged`

> 对应 SOP: `standards/document/详细设计讨论流程_SOP.md` Step 08
> 状态: `defined_with_affected_open`；不是 implementation/runtime complete
> 回填目标: 正式 `03-详细设计.md` §7；仅在 Step 19 装配

## 1. Purpose and non-owner boundary

E12 发布 Observability 本地外围交付生命周期的已提交变化。它同时能够表达 export preparation
变化和 peripheral delivery 变化，但两者必须由 tagged subject 明确分开。它不拥有外围消费者的
acceptance、报告 truth、证据 body、archive truth、provider response、endpoint、credential、业务 truth
或 signoff。

`ExternalAuditExportPreparation` 表示本地 body-free material 是否已准备以及准备阻塞原因；
`PeripheralDeliveryState` 表示本地 delivery boundary 已记录的状态和有限 adapter result。`Delivered`
只表示本地 delivery result 已被记录，不表示外部系统接受或报告正确。

| item | exact contract |
|---|---|
| public name / code | `PeripheralDeliveryChanged` / `0x050c` |
| payload | `PeripheralDeliveryChangedPayload` |
| source | accepted H9 preparation/delivery transition or same-UoW post-state |
| subject | `PeripheralDeliverySubject` tagged `Preparation` or `Delivery` |
| follower | `ObservationOutboxFollowerSeed::PeripheralDeliveryChanged` |
| publication | only J01 consumes the immutable stored pair |
| Step 09 reservation | `ProducePeripheralDeliveryChangedFlow` |

## 2. Public payload schema

```rust
pub struct PeripheralDeliveryChangedPayload {
    pub subject: PeripheralDeliverySubject,
    pub visibility: VisibilitySurface,
    pub delivery_kind: Option<PeripheralDeliveryKind>,
    pub delivery_result: Option<PeripheralDeliveryResult>,
    pub block_reason: Option<PeripheralBlockReason>,
    pub export_failure_reason: Option<ExportFailureReason>,
    pub consumer_ref: PeripheralConsumerRef,
    pub dashboard_view_ref: Option<DashboardAlertExportViewRef>,
    pub preparation_ref: ExternalAuditExportPreparationRef,
    pub gap_refs: GapStateRefSet,
    pub changed_at: ObservedAt,
}

impl ObservationOutboundPayload for PeripheralDeliveryChangedPayload {
    const EVENT: ObservationOutboundEventName =
        ObservationOutboundEventName::PeripheralDeliveryChanged;
}
```

The payload is a body-free projection of the local post-state. It does not expose external effect binding,
stable token, endpoint, provider response, raw error, report body or archive package. The exact enum variants
and wire discriminators remain owned by `contracts::metadata` / `domain::peripheral`; this event does not
create aliases or free-text reason fields.

## 3. Tagged subject and presence matrix

```rust
pub enum PeripheralDeliverySubject {
    Preparation {
        preparation_ref: ExternalAuditExportPreparationRef,
    },
    Delivery {
        delivery_ref: PeripheralDeliveryRef,
        preparation_ref: ExternalAuditExportPreparationRef,
    },
}
```

| subject | required relation | permitted fields | forbidden interpretation |
|---|---|---|---|
| `Preparation` | preparation post-state, consumer/view/evidence input relation | `export_failure_reason` when blocked/failed; delivery fields absent | external export started or accepted |
| `Delivery` | delivery post-state and exact preparation relation | delivery kind/result/block; preparation ref required | external consumer acceptance/signoff |

Cross-field rules are exhaustive:

- `Preparation` cannot carry `delivery_kind`, `delivery_result` or `delivery_ref`.
- `Delivery` cannot carry an `export_failure_reason` that belongs only to preparation; a delivery failure
  uses the canonical `PeripheralDeliveryResult`/failure owner.
- `delivery_result` is present only for a post-state branch that records a result; a blocked/prepared state
  has explicit absence.
- `block_reason` is present only for a blocked state and must match the owner-selected policy branch.
- `dashboard_view_ref` is present only when the same post-state proves the view relation; it is never minted
  by E12 and never derived from `consumer_ref` alone.
- `gap_refs` is a canonical set. An empty set is a valid no-gap relation only when the post-state owner
  proves it; missing lookup is not equivalent to empty.

`VisibilitySurface` is local read/policy output. It is not accepted from an external consumer as authority
and cannot be used to overwrite preparation or delivery state.

## 4. Source mapping and two-phase boundary

Preparation and delivery are separate phases and separate owner transitions:

```text
loaded evidence/view/consumer input
  -> P14 preparation decision
  -> ExternalAuditExportPreparation transition/post-state
  -> optional E12 Preparation event

committed Prepared + ready/degraded preparation
  -> P14 delivery decision
  -> PeripheralDeliveryState transition/post-state
  -> optional E12 Delivery event
```

An adapter call can occur only after the appropriate local preparation/delivery state transition is
authorized by its owner and committed through the application flow. The adapter result is consumed by
`PeripheralDeliveryState::record_delivery`; E12 copies the resulting local post-state and does not
re-evaluate policy. A preparation change does not imply delivery, and a delivery result does not imply
external acceptance.

The source mapper must receive the accepted transition and same-UoW post-state. It may not use current
repository lookup, latest delivery row, provider text, or a transition plus a different transaction's row.

## 5. UoW, idempotency and publication

```text
accepted preparation or delivery transition
  -> validate tagged subject, consumer/view/preparation relation and presence matrix
  -> allocate one Observation cursor for all record-bearing local changes
  -> encode typed E12 V1 envelope
  -> append immutable snapshot + Pending outbox pair in the same UoW
  -> save stored result / H9 record where applicable
  -> commit local truth once
  -> J01 publishes exact retained bytes and binding/token
```

No-change, rejected policy, pre-UoW invalid input, rollback and terminal duplicate do not emit E12. A
duplicate accepted operation replays its original stored result and event refs; it does not call the
external adapter or mint a second outbox pair. Publication failure never rolls back the committed local
preparation/delivery state. Publication unknown probes the same stable token before any retry.

## 6. Error, redaction and no-backwrite

| condition | required behavior |
|---|---|
| preparation/delivery subject mismatch | typed relation/invariant error; no partial event |
| policy basis or state stale | reject transition; do not publish a guessed post-state |
| missing view/consumer/gap relation | typed missing/consistency boundary; no latest/first fallback |
| illegal optional-field combination | encoder/factory failure; whole UoW rollback |
| local outbox/encoder failure | rollback local transition and follower staging |
| known external delivery failure | preserve local state; map result/failure into local report/job item |
| unknown external delivery outcome | probe exact token; no blind resend |
| corrupted snapshot | manual/consistency recovery; no current-truth rebuild |

Telemetry permits only event/schema, tagged subject, finite state/result/reason, presence flags and bounded
counts. Full consumer/delivery/preparation/view/gap refs, actor/trace/digest, provider detail, endpoint,
credential, report body and evidence alias are excluded from labels and raw fields.

E12 never writes external consumer truth, archive truth, report verdict, evidence, retention, source truth or
business truth. A downstream consumer may build its own projection only within its own authority boundary.

## 7. Affected and closure

| check | conclusion |
|---|---|
| preparation/delivery separation | complete at design level |
| tagged subject and field presence | complete at design level; exact owner variant matrix remains referenced |
| H9/source/post-state mapping | same-UoW and no-rebuild rule recorded |
| J01 publication/replay | shared immutable snapshot boundary recorded |
| local affected | `S08-F-E12-FLOW-CARDINALITY-01=open_internal_affected`; Step 09 must enumerate preparation, delivery, blocked, retryable and no-change branches |
| downstream affected | Step 10/11/12/13/14/15 owners remain open |
| status | `defined_with_affected_open`; not runtime-ready |
| implementation/evidence | not implemented, tested or run; no commit/run_id/evidence alias/signoff |
