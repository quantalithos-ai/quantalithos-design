# L2-tools Step 8 协议附录: 4 Outbound Event protocols

> 状态: completed / pass
> 主文件: `03_ddd_step_08_protocol_contracts.md`
> Public owner: `contracts::events`
> Producer: application safe-material mapper;submission: worker/application continuation -> `SafeEventCollaborationPort`
> Blockers: `L2T-UP-004~007`;logical schemas are exact, physical route/delivery/observation readiness is not claimed.

## 1. Event definition batch

| # | Event | Required material class | Exact source truth | Primary logical consumers | Step 9 flow | Stop |
|---:|---|---|---|---|---|---|
| 1 | `ToolContractChanged` | `ContractChange` | evolution fact | Runtime/event collaborators | `OF-01` | pass |
| 2 | `CapabilityBindingChanged` | `BindingChange` | binding change fact or binding-scoped gap fact | Runtime/event collaborators | `OF-02` | pass |
| 3 | `ToolOutcomeAuditMaterialAvailable` | `OutcomeAudit` | outcome/audit pair | Bus/logical Observability collaborators | `OF-03` | pass |
| 4 | `ToolConsistencyGapChanged` | `ConsistencyGap` | gap lifecycle fact/view | operations/event collaborators | `OF-04` | pass |

Each protocol uses `ToolEventEnvelope<Payload>` from the shared annex, schema version `1`, and logical name `tools.event.<snake_case_event>.v1`. A payload is derived only from the referenced immutable `SafeHandoffMaterial` and its committed source refs. An event is not formed directly from a mutable current aggregate or external response.

All four material classes are created through `PrepareSafeExternalHandoff` using its closed source selector. The Command performs target/sensitivity/four-gate evaluation; the `OF-*` continuation consumes only the resulting committed material. Owning Contract/Binding/Gap Commands never auto-create or auto-publish material.

## 2. Closed event union and source mapping

```rust
/// Closed semantic event envelope accepted by the collaboration Port.
pub enum ToolSemanticEventEnvelope {
    ToolContractChanged(ToolEventEnvelope<ToolContractChangedPayload>),
    CapabilityBindingChanged(ToolEventEnvelope<CapabilityBindingChangedPayload>),
    ToolOutcomeAuditMaterialAvailable(
        ToolEventEnvelope<ToolOutcomeAuditMaterialAvailablePayload>,
    ),
    ToolConsistencyGapChanged(ToolEventEnvelope<ToolConsistencyGapChangedPayload>),
}
```

Every variant has English rustdoc naming its formal material class. Exact event ID derivation:

```text
ToolEventId = digest-v1(
  event_name || schema_version || material_id || canonical_source_truth_refs
)
```

The digest is deterministic and collision errors fail closed. `ExternalSubmissionAttempt` stores the exact event ID/name/schema before the first Port call. Reentry for the same material/event/version reuses the same event ID; a new schema version creates a distinct ID and attempt identity.

## 3. `ToolContractChanged`

```rust
pub struct ToolContractChangedPayload {
    pub tool_id: ToolId,
    pub evolution_fact_ref: EvolutionFactRef,
    pub change_kind: ContractEvolutionKind,
    pub previous_revision: Option<DefinitionRevision>,
    pub current_revision: Option<DefinitionRevision>,
    pub lifecycle_state: ToolContractLifecycleState,
    pub change_reason: ChangeReasonSafeSummary,
}
```

Source chain: committed `ToolContractEvolutionFact` -> target-specific eligible `SafeHandoffMaterial::ContractChange` -> payload mapper. Revision pair/kind/lifecycle must satisfy the Step 6 evolution fact symmetry. Establish/adopt/retirement changes are representable; no full definition, implementation/provider data or consumer list appears. `occurred_at` is evolution fact time. Missing/mismatched source ref is an integrity error and no attempt is created. Flow `OF-01`.

## 4. `CapabilityBindingChanged`

```rust
pub enum CapabilityBindingChangeEventSubject {
    FormalChange {
        change_fact_ref: BindingChangeFactRef,
        binding_id: CapabilityBindingId,
        successor_binding_id: Option<CapabilityBindingId>,
        tool_id: ToolId,
        change_kind: BindingChangeKind,
        previous_ref: Option<HubCapabilityRefSummary>,
        current_ref: Option<HubCapabilityRefSummary>,
    },
    ConsistencyGap {
        gap_ref: ConsistencyGapRef,
        binding_id: CapabilityBindingId,
        tool_id: ToolId,
        gap_class: ConsistencyGapClass,
        impact: GapImpactClass,
        state: ConsistencyGapState,
    },
}

pub struct CapabilityBindingChangedPayload {
    pub subject: CapabilityBindingChangeEventSubject,
    pub binding_mode: BindingMode,
    pub change_reason: ChangeReasonSafeSummary,
}
```

Formal relation changes derive from committed `CapabilityBindingChangeFact`; `successor_binding_id` is present only for `Replaced`, so the event can identify both the historical relation and the newly active relation. A binding-scoped gap event derives from committed gap truth and does not claim a relation change. The two enum branches cannot be mixed. Payload contains typed safe ref summaries only, no Hub descriptor/registry body, authorization meaning or old invocation anchor rewrite. `occurred_at` is the fact/gap detection or resolution time. Flow `OF-02`.

## 5. `ToolOutcomeAuditMaterialAvailable`

```rust
pub struct ToolOutcomeAuditMaterialAvailablePayload {
    pub invocation_id: ToolInvocationId,
    pub outcome_id: ToolInvocationOutcomeId,
    pub audit_entry_id: ToolAuditEntryId,
    pub outcome_class: ToolOutcomeClass,
    pub contract_anchor_ref: InvocationContractAnchorRef,
    pub source_refs: AllowedSourceRefSet,
    pub known_gap_refs: ConsistencyGapRefSet,
    pub target_class: ExternalCollaborationClass,
}
```

Source chain requires the committed indivisible outcome/audit pair and an eligible `OutcomeAudit` safe material whose source refs match exactly. No result/error/audit/source body appears; outcome class and refs are sufficient to locate L2 truth subject to visibility. `target_class` identifies the material evaluation target but does not declare a route. Local `SubmittedLocally` only means the Port call returned; event payload contains no delivery/observation state. Flow `OF-03`.

## 6. `ToolConsistencyGapChanged`

```rust
pub struct ToolConsistencyGapChangedPayload {
    pub gap_id: ConsistencyGapId,
    pub scope: ConsistencyGapScope,
    pub subject_refs: GapSubjectRefSet,
    pub gap_class: ConsistencyGapClass,
    pub impact: GapImpactClass,
    pub previous_state: Option<ConsistencyGapState>,
    pub current_state: ConsistencyGapState,
    pub resolution_evidence_ref: Option<GapResolutionEvidenceRefSummary>,
}
```

Allowed transitions are create Open (`previous_state=None`), Open -> ResolutionPending, pending -> Resolved, and open/pending -> Superseded. Evidence field is a typed locator summary only and appears only for pending/resolved/superseded when Step 6 symmetry permits; no body, alias, run, test or signature. Event does not assert the subject is healthy beyond the exact gap state. Flow `OF-04`.

## 7. Formation/submission/version contract

```text
committed L2 source truth
  -> SafeHandoffEligibility for exact target
  -> immutable SafeHandoffMaterial with one fact class
  -> pure event mapper validates source/material symmetry
  -> deterministic ToolSemanticEventEnvelope v1
  -> create ExternalSubmissionAttempt::Prepared with event ID/name/schema
  -> commit prepared attempt
  -> call SafeEventCollaborationPort with material ref + exact event
  -> save one local attempt terminal disposition
```

- Payload fields are closed for v1. Adding an optional field that does not change meaning still requires schema compatibility review; changing required fields, identity, source or meaning requires a new version.
- Unknown event versions are never silently decoded as v1.
- The full semantic envelope is reconstructible from immutable material and committed refs using the versioned pure mapper; no second payload store/outbox truth is introduced.
- Port/adapter cannot rebuild from current truth, choose a payload variant, add a topic-specific body or modify correlation/source refs.
- Physical route, codec, topic, partition, retry, DLQ, replay and external receipt remain binding/recovery concerns, not event schema fields.

## 8. Event-to-source closure

| Event | Material class match | Source fields complete | Body-free | Local attempt binding | Result |
|---|---|---|---|---|---|
| Contract changed | exact | evolution fact supplies all fields | yes | event identity stored | pass |
| Binding changed | exact | exclusive formal-change/gap branch | yes | event identity stored | pass |
| Outcome/audit available | exact | atomic pair + material target | yes | event identity stored | pass |
| Gap changed | exact | gap state/basis/evidence locator | yes | event identity stored | pass |

## 9. Event family stop review

| Review item | Result | Closure |
|---|---|---|
| Four independent event schemas present | pass | sections 3~6 |
| Closed Port union and deterministic ID exact | pass | adapter cannot interpret generic summary |
| Exact committed source and material class required | pass | no current-truth rebuild |
| Version strategy and unknown-version behavior exact | pass | v1 closed; semantic changes versioned |
| Attempt binds event ID/name/schema durably | pass | controlled existing-object field correction |
| Body/delivery/route/observation boundaries intact | pass | no readiness claim |
| Each maps to Step 9 | pass | `OF-01~04` |
