# L4-observability 03-详细设计 Step 08 - S08-G Job J08 `PrepareExternalAuditExport`

> 对应 SOP: `standards/document/详细设计讨论流程_SOP.md` Step 08
> 状态: `defined_with_affected_open`；不是 implementation/runtime complete
> 回填目标: 正式 `03-详细设计.md` §7；仅在 Step 19 装配

## 1. Protocol identity and name-collision boundary

J08 prepares and optionally advances the local external-audit export delivery phases. The public Job name
intentionally matches Command C14, but the typed Job wrapper, input trait, assembler method and internal
operation are distinct. No free-text dispatch may route C14 and J08 together.

| item | exact contract |
|---|---|
| public protocol | `ObservationJobRequest<PrepareExternalAuditExportJobInput>` |
| public name | `PrepareExternalAuditExport` |
| internal operation | `ObservationJobOperation::PrepareExternalAuditExportDelivery` |
| entry callable | `ObservationOperationsJobService::prepare_external_audit_export_delivery(PrepareExternalAuditExportDeliveryInput)` |
| work-key variant | `ObservationJobWorkKey::ExternalExport(ExternalAuditExportPreparationRef)` |
| planned material | preparation ref, consumer/view/evidence input snapshot, policy basis, historical binding and phase capabilities |
| Step 09 flow | `PrepareExternalAuditExportDeliveryFlow` |

The command `PrepareExternalAuditExportRequest` implements only the Command body trait; this Job input
implements only the Job input body trait. The shared public name is not a shared DTO or route.

## 2. Input/output schema

```rust
pub struct PrepareExternalAuditExportJobInput {
    pub export_scope_ref: ExternalAuditExportScopeRef,
    pub consumer_ref: PeripheralConsumerRef,
    pub preparation_ref: ExternalAuditExportPreparationRef,
}

pub struct PrepareExternalAuditExportJobOutput {
    pub preparation_refs: ExternalAuditExportPreparationRefSet,
    pub delivery_refs: PeripheralDeliveryRefSet,
    pub delivery_results: PeripheralDeliveryResultSet,
    pub failed_preparation_refs: ExternalAuditExportPreparationRefSet,
    pub gap_refs: GapStateRefSet,
}
```

The public input carries no endpoint, credential, package body, provider export id, report verdict or
acceptance result. The exact export view/evidence-index input, consumer catalog snapshot, visibility,
freshness, retention/protection and gap revisions are loaded by the application and frozen in plan material.

## 3. Candidate, work-key and policy boundary

The global `ExternalExport` key is the stable local preparation identity. A package ref, delivery ref,
external identifier or current view lookup cannot replace it. Before an item is claimed, the flow validates
P10 no-write, P14 preparation and delivery decisions, retention/protection and exact consumer/view relation.
Preparation and delivery use separate phase capability and stable-token records.

The plan is immutable. Resume uses the original preparation/view/evidence snapshots and historical binding;
it never replaces them with current config or current projection truth.

## 4. Item flow and external boundary

```text
claim ExternalExport
  -> load exact preparation/view/consumer/evidence relation
  -> evaluate export-preparation decision
  -> persist Prepared / Blocked / Pending local state
  -> if permitted, invoke exact export-preparation/delivery phase
  -> consume result only through PeripheralDeliveryState owner
  -> append H9/E12 followers and classify item
```

J08 may prepare a body-free export handoff, but it does not create or transfer an evidence body. External
provider result is mapped to the existing local `PeripheralDeliveryResult`/failure owner; it is not copied
as raw text. `Delivered` means local delivery state recorded the result, never external audit acceptance.

## 5. Error, replay and completion matrix

| condition | behavior | forbidden shortcut |
|---|---|---|
| C14/J08 name or input trait mismatch | protocol/invariant rejection | dispatch by string or alias |
| missing preparation/view/evidence relation | blocked/failed before external call | construct preparation from consumer only |
| policy blocked/retention hold | local blocked preparation, no delivery call | bypass P10/P14 |
| preparation accepted | local preparation ref/state | claim audit export accepted |
| delivery positive/retryable/permanent | exact local result/state and item association | infer from provider message |
| outcome unknown | same-token probe/manual | blind resend |
| terminal duplicate | exact stored report replay | rerun preparation/delivery |
| report/result persistence unknown | no completion | fabricate export result |

J08's report preserves preparation and delivery refs separately and includes gap refs only from owner-backed
relations. No report field is an external audit verdict, signoff or evidence authenticity proof.

## 6. Redaction and truth boundary

Telemetry permits J08/phase/state/result/block/gap tokens, presence flags and bounded counts. It excludes
package bytes, evidence body, provider response, endpoint, credential, external id, full refs, digest bytes,
actor and raw trace. J08 does not write source/business truth, archive truth, report verdict or retention
cleanup.

## 7. Step 09 handoff and affected

| item | contract |
|---|---|
| flow chain | typed Job dispatch -> immutable ExternalExport plan -> claim -> preparation -> delivery -> local H9/fold/report |
| collision | `S08-EXPORT-NAME-COLLISION-01=open_internal_affected`; C14 and J08 have separate traits, wrappers and operations |
| external phase | `R07-EXTERNAL-PHASE-LINK-01` and `R07-EXTERNAL-PHASE-RETRY-ACCOUNTING-01` remain downstream open |
| affected | `S08-G-J08-PREPARATION-SOURCE-01`, `S08-G-J08-VIEW-RELATION-01`, `S08-G-J08-EXTERNAL-PHASE-ACCOUNTING-01` remain open |
| status | `defined_with_affected_open`; not runtime-ready |
| implementation/evidence | not implemented, tested or run; no commit/run_id/evidence alias/signoff |
