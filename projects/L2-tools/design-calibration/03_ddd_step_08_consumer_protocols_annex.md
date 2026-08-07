# L2-tools Step 8 协议附录: 5 Inbound Consumer protocols

> 状态: completed / pass
> 主文件: `03_ddd_step_08_protocol_contracts.md`
> Public owner: `contracts::consumers`
> Entry: `worker`;logical event envelope v1;physical source/topic/group/ack binding remains Step 14/04
> Blockers: `L2T-UP-001~006`

## 1. Consumer definition batch

| # | Consumer | Formal source | Local target/effect | Port | Step 9 flow | Stop |
|---:|---|---|---|---|---|---|
| 1 | `ConsumeHubCapabilityChangeClue` | Hub | snapshot/assessment/gap | Hub source | `IF-01` | pass |
| 2 | `ConsumeAuthorizationResultChangeClue` | authorization owner pending | ref assessment/gap | authorization | `IF-02` | pass |
| 3 | `ConsumeSandboxExecutionSource` | Sandbox | source candidate/gap/formal Accept command | source intake | `IF-03` | pass |
| 4 | `ConsumeBusDeliveryStatusFeedback` | Bus conditional | delivery status ref/gap | collaboration feedback | `IF-04` | pass |
| 5 | `ConsumeObservationStatusFeedback` | Observability conditional | observation material ref/gap | collaboration feedback | `IF-05` | pass |

All signatures are `consume(InboundEventEnvelope<Payload>) -> Result<ConsumerReceipt, ProtocolError>`. Logical name is `tools.inbound.<snake_case_event>.v1`. Consumer idempotency scope is `(consumer name, source authority, source event ID, dedup key)` and digest is the canonical envelope/payload semantic frame excluding `received_at`.

## 2. Common envelope gate and receipt mapping

Processing precedence before any payload effect:

```text
required envelope fields
  -> supported schema version
  -> trusted source actor kind + exact source authority binding
  -> payload type and forbidden-body validation
  -> canonical digest + idempotency replay precheck
  -> ordering key/sequence validation when source contract requires it
  -> phase-1 local UoW: reserve and commit one technical Consumer claim
  -> named Port validation/mapping
  -> phase-2 local UoW: assessment/ref/gap effect
  -> store typed ConsumerReceipt + completed idempotency record in the same phase-2 UoW
```

All five Consumers use the phase-1 claim fence. `IF-01/02/04/05` perform their observational Port and bounded reverse lookup after the claim, then use a separate phase-2 UoW for local facts, receipt and claim completion. `IF-03` is the formal Command re-entry exception: after phase-1 claim commit it derives deterministic integration `CommandMetadata` and invokes `CF-11`; `CF-11` owns its own UoW and commits or exactly replays the source assessment/outcome/audit result. Only then does a separate Consumer phase-2 UoW store the receipt and complete the Consumer claim. A crash between the two `IF-03` commits re-enters the same derived Command key, obtains exact `CF-11` replay, and completes the receipt; it never repeats source normalization or creates a second outcome. The Consumer and Command cannot share a UoW across an application-service call.

| Condition | Receipt/error | Local effect |
|---|---|---|
| Same key + same digest + committed | `ConsumerDisposition::Duplicate` exact replay | none |
| Same key + different digest | conflict/quarantine ProtocolError | optional integrity gap, zero target write |
| Unsupported version/payload kind | `Rejected`, no retry | receipt only where envelope identity is valid |
| Authority/order/correlation/forbidden-body conflict | `Quarantined`, manual owner action | safe gap where constructible; no target truth |
| Positive mapping contract open | `GapRecorded` | typed gap/ref assessment only |
| Adapter unavailable/timeout | ProtocolError with dependency retry hint | transaction rollback; no receipt unless deterministic blocked response is committed |
| Valid clue/source/feedback | `Accepted` | exact local effects below |

There is no public `Delayed` receipt in v1. An existing in-flight reservation returns a retry-same-input ProtocolError. Broker acknowledgment, retry count, dead-letter locator and delivery receipt are absent.

## 3. `ConsumeHubCapabilityChangeClue`

```rust
pub struct HubCapabilityChangeCluePayload {
    pub capability_ref: HubCapabilityRefSummary,
    pub previous_revision: Option<ExternalRevisionRef>,
    pub current_revision: ExternalRevisionRef,
    pub change_class: HubCapabilityChangeClass,
    pub safe_summary: HubCapabilitySafeSummary,
}
```

`HubCapabilityChangeClass` variants: `SemanticsChanged`, `AvailabilityChanged`, `Withdrawn`, `Correction`. Payload does not repeat source authority/event/correlation/trace/time. Port validates clue and returns a formal safe snapshot resolution. Local effect: append `HubControlledSnapshot`, append a per-affected-binding assessment where exact refs are locally known, and open/refresh typed gap; never replace/invalidate Binding or old anchor. Withdrawn is a clue, not an automatic local relation mutation. Receipt result refs list snapshot/assessment/gap refs. Flow `IF-01`.

## 4. `ConsumeAuthorizationResultChangeClue`

```rust
pub struct AuthorizationResultChangeCluePayload {
    pub external_result_id: ExternalAuthorizationResultId,
    pub subject_ref: ExternalAuthorizationSubjectRef,
    pub result_revision: ExternalRevisionRef,
    pub change_class: AuthorizationResultChangeClass,
    pub safe_change_summary: AuthorizationResultChangeSafeSummary,
}
```

`AuthorizationResultChangeClass`: `Revised`, `Withdrawn`, `Corrected`, `FreshnessChanged`. It carries no decision/evidence/policy body. The Port validates authority/subject/revision if the source contract is closed. Current production behavior under `L2T-UP-001~002` is `GapRecorded` with a blocked `ReferenceValidityAssessment`/gap when enough typed identity exists; otherwise deterministic rejected/blocked error. It never changes an earlier `AuthorizationConsumptionAssessment` or substitutes for synchronous `consume_result`. Flow `IF-02`.

## 5. `ConsumeSandboxExecutionSource`

```rust
pub struct SandboxExecutionSourcePayload {
    pub invocation_id: ToolInvocationId,
    pub external_execution_ref: ExternalSandboxExecutionRef,
    pub handoff_correlation_ref: CorrelationRef,
    pub source_class: ExecutionSourceClass,
    pub source_revision: ExternalRevisionRef,
    pub semantic_input: ExecutionSourceSemanticInput,
}
```

The safe `semantic_input` union is identical to the Command annex and carries normalized safe result/error summary only. Worker/application maps the validated envelope + payload to the `AcceptExecutionSourceRequest` candidate and invokes the same internal Command service under deterministic integration `CommandMetadata` derived from envelope source/correlation/idempotency. `CF-11` exclusively calls `ExecutionSourceIntakePort::map_source`; the Consumer must not pre-call that Port or write `OutcomeAuditStore` directly. The formal Command result/error refs become receipt refs. Mapping blocked is committed by `CF-11` as assessment/gap only. After any committed/replayed Command result, a distinct Consumer UoW commits the exact receipt and Consumer idempotency record; a transient Command failure leaves the Consumer claim incomplete and no receipt is fabricated. Delivery, run locator or semantic input presence never means accepted/outcome. Flow `IF-03`.

## 6. `ConsumeBusDeliveryStatusFeedback`

```rust
pub struct BusDeliveryStatusFeedbackPayload {
    pub submission_attempt_id: ExternalSubmissionAttemptId,
    pub external_submission_locator: ExternalSubmissionLocator,
    pub external_delivery_ref: Option<ExternalBusDeliveryRef>,
    pub delivery_status: BusDeliverySafeStatus,
    pub feedback_revision: ExternalRevisionRef,
}
```

`BusDeliverySafeStatus`: `Unknown`, `Referenced`, `Stale`, `Conflicting`, `Unverifiable`; there is intentionally no generic `Succeeded/Failed` local state because L2 does not own Bus lifecycle. Collaboration Port validates formal Bus authority, attempt/locator/correlation and revision. Application appends `BusDeliveryStatusRef` and applicable gap; it does not update `ExternalSubmissionAttempt`, outcome or audit. If feedback contract is unavailable, production does not enable a positive consumer binding. Flow `IF-04`.

## 7. `ConsumeObservationStatusFeedback`

```rust
pub struct ObservationStatusFeedbackPayload {
    pub submission_attempt_id: ExternalSubmissionAttemptId,
    pub external_submission_locator: Option<ExternalSubmissionLocator>,
    pub external_material_ref: Option<ExternalObservationMaterialRef>,
    pub observation_status: ObservationSafeStatus,
    pub source_revision: ExternalRevisionRef,
    pub route_revision: ExternalRevisionRef,
}
```

`ObservationSafeStatus`: `RouteBlocked`, `Unknown`, `Referenced`, `Stale`, `Conflicting`, `Unverifiable`. There is no observation body, store locator, retention, evidence or alert state. Collaboration Port validates formal observation source/route, attempt/correlation and revision. Application appends `ObservationMaterialRef`/gap only; it cannot claim observed or drive Runtime recovery. Under `L2T-UP-005~006`, positive binding remains disabled/blocked. Flow `IF-05`.

## 8. DTO/effect closure

| Consumer | Required object fields supplied | System/lookup fields | Missing/blocked behavior | Core truth mutation |
|---|---|---|---|---|
| Hub clue | typed ref/revisions/change/safe summary | source authority/envelope time, IDs/clock, affected binding reads | reject/quarantine/gap | none |
| Auth clue | result/subject/revision/change | authority, IDs/clock | blocked gap or reject | none |
| Sandbox source | invocation/execution/correlation/class/revision/semantic safe input | formal mapping, ref/assessment/outcome/audit IDs/time | assessment/gap only | via formal Accept command only |
| Bus feedback | attempt/locator/ref/status/revision | formal authority, ID/time | disabled/blocked/gap | none |
| Obs feedback | attempt/locator/material/status/source/route revision | formal authority, ID/time | disabled/blocked/gap | none |

## 9. Consumer family stop review

| Review item | Result | Closure |
|---|---|---|
| Five independent payloads present | pass | sections 3~7 |
| Payload never duplicates envelope fields | pass | authority/event/correlation/trace/time remain envelope authority |
| Trusted source actor gates exact | pass | no authority/body/idempotency/state bypass |
| Receipt/dedup/quarantine/in-flight mapping exact | pass | no delayed/broker/DLQ fabrication |
| Consumer-to-object construction complete | pass | IDs/time/authority from application/Port |
| Subject write boundary exact | pass | clues/feedback no core mutation; source uses formal Command |
| Positive blocked seams honest | pass | auth/Sandbox/Bus/Obs remain conditional |
| Each maps to Step 9 | pass | `IF-01~05` |
