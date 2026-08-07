# L2-tools Step 8 协议附录: 13 Command protocols

> 状态: completed / pass
> 主文件: `03_ddd_step_08_protocol_contracts.md`
> Public owner: `contracts::commands` and reusable safe views in `contracts::views`
> Entry: `api` or canonical `InvocationCallerPort`;handler calls application Command facade only

## 1. Command definition batch

| # | Command | Owner module | Primary target | External Port | Step 9 flow | Stop |
|---:|---|---|---|---|---|---|
| 1 | `EstablishToolContract` | contract | contract/first definition/evolution | shared authority | `CF-01` | pass |
| 2 | `AssessToolDefinitionChange` | contract | candidate definition/impact | shared authority | `CF-02` | pass |
| 3 | `AdoptToolDefinitionRevision` | contract | current pointer/definition/evolution | none | `CF-03` | pass |
| 4 | `RetireToolContract` | contract | lifecycle/evolution | none | `CF-04` | pass |
| 5 | `DeclareCapabilityBinding` | binding | relation/snapshot/assessment/change | Hub source | `CF-05` | pass |
| 6 | `ReplaceCapabilityBinding` | binding | old/new relation/change | Hub source | `CF-06` | pass |
| 7 | `InvalidateCapabilityBinding` | binding | relation/change | none | `CF-07` | pass |
| 8 | `SubmitToolInvocation` | invocation | invocation/anchor/admission/optional no-execution pair | caller ingress only | `CF-08` | pass |
| 9 | `EvaluateExecutionPreconditions` | precondition | requirement/auth/readiness/optional no-execution pair | auth + Sandbox readiness | `CF-09` | pass |
| 10 | `PrepareExecutionHandoff` | handoff | handoff/attempt/optional no-execution pair | Sandbox handoff | `CF-10` | pass |
| 11 | `AcceptExecutionSource` | outcome | source assessment/outcome/audit | source intake | `CF-11` | pass |
| 12 | `PrepareSafeExternalHandoff` | safe handoff | eligibility/material/submission attempt | collaboration | `CF-12` | pass |
| 13 | `RecordConsistencyGapResolution` | integrity | gap lifecycle | formal source re-read ports as applicable | `CF-13` | pass |

Every handler signature is logically `handle(Request, CommandMetadata) -> Result<ToolCommandResponse<Value>, ProtocolError>`. Logical name is `tools.command.<snake_case_operation>.v1`. Schema version, metadata, actor, idempotency and trace are not repeated in request bodies.

## 2. Reusable public Command/Query view schemas

These are contracts-owned DTOs, not direct serialization of domain objects.

```rust
pub struct ToolContractView {
    pub tool_id: ToolId,
    pub current_revision: DefinitionRevision,
    pub lifecycle: ToolContractLifecycleSummary,
    pub definition: FormalDefinitionSafeSummary,
    pub initial_binding_mode: BindingMode,
    pub evolution_head_ref: Option<EvolutionFactRef>,
    pub version: CommittedVersion,
    pub visibility: ConsumptionVisibility,
}

pub struct CapabilityBindingView {
    pub binding_id: CapabilityBindingId,
    pub tool_id: ToolId,
    pub mode: BindingMode,
    pub lifecycle: BindingLifecycleSummary,
    pub capability_ref: Option<HubCapabilityRefSummary>,
    pub selected_assessment: Option<BindingAssessmentSummary>,
    pub source_summary: Option<HubCapabilitySafeSummary>,
    pub gap_refs: ConsistencyGapRefSet,
    pub version: CommittedVersion,
    pub visibility: ConsumptionVisibility,
}

pub struct ToolInvocationView {
    pub invocation_id: ToolInvocationId,
    pub anchor: InvocationContractAnchorSummary,
    pub intent: CanonicalIntentSafeSummary,
    pub context: InvocationContextRefSummary,
    pub admission: InvocationAdmissionSummary,
    pub outcome_ref: Option<ToolInvocationOutcomeRef>,
    pub gap_refs: ConsistencyGapRefSet,
    pub visibility: ConsumptionVisibility,
}

pub struct ExecutionPreconditionView {
    pub invocation_id: ToolInvocationId,
    pub requirement: Option<ExecutionRequirementSummary>,
    pub authorization: Option<AuthorizationAssessmentSummary>,
    pub sandbox_readiness: Option<SandboxReadinessSummary>,
    pub handoff: Option<ExecutionHandoffSummary>,
    pub latest_attempt: Option<ExecutionHandoffAttemptSummary>,
    pub no_execution_outcome_ref: Option<ToolInvocationOutcomeRef>,
    pub gap_refs: ConsistencyGapRefSet,
    pub visibility: ConsumptionVisibility,
}

pub struct OutcomeAuditView {
    pub invocation_id: ToolInvocationId,
    pub outcome: ToolInvocationOutcomeSummary,
    pub audit: ToolAuditSafeSummary,
    pub safe_handoff: SafeHandoffStateSummary,
    pub bus_delivery_status: Option<BusDeliveryStatusSummary>,
    pub observation_status: Option<ObservationMaterialStatusSummary>,
    pub gap_refs: ConsistencyGapRefSet,
    pub visibility: ConsumptionVisibility,
}

pub struct ConsistencyGapView {
    pub gap_id: ConsistencyGapId,
    pub scope: ConsistencyGapScope,
    pub subject_refs: GapSubjectRefSet,
    pub gap_class: ConsistencyGapClass,
    pub impact: GapImpactClass,
    pub state: ConsistencyGapState,
    pub basis_refs: GapBasisRefSet,
    pub resolution_evidence_ref: Option<GapResolutionEvidenceRefSummary>,
    pub resolution_decision_ref: Option<GapResolutionDecisionRef>,
    pub detected_at: DetectionTime,
    pub resolved_at: Option<DecisionTime>,
    pub version: CommittedVersion,
}
```

Every public field has an English rustdoc in source. Summary schemas are closed:

| Summary | Exact fields |
|---|---|
| `ToolContractLifecycleSummary` | `state`, `established_at`, optional `retirement_reason`, optional `retired_at` |
| `FormalDefinitionSafeSummary` | `definition_id`, `tool_id`, `revision`, `revision_state`, invocation/outcome semantic summaries, execution-requirement basis, source-ref summary |
| `BindingLifecycleSummary` | lifecycle state, optional replacement binding ref, optional invalidation reason |
| `BindingAssessmentSummary` | assessment ref/state, snapshot ref, basis refs, consumed time |
| `InvocationContractAnchorSummary` | tool ID, definition revision, binding mode, optional binding assessment ref, anchored time |
| `CanonicalIntentSafeSummary` | operation selector, safe argument object, expected output class |
| `InvocationContextRefSummary` | caller ref, actor ref, optional work ref, trace/correlation refs, sufficiency |
| `InvocationAdmissionSummary` | admission ref/state, safe reason, basis refs, decision time |
| `ExecutionRequirementSummary` | requirement ref and four requirement classes/basis refs/time |
| `AuthorizationAssessmentSummary` | assessment ref/state, optional result-ref summary, typed constraint summary, consumed time |
| `SandboxReadinessSummary` | snapshot ref/authority/carrier/mapping state/safe summary/observed time |
| `ExecutionHandoffSummary` | handoff ref/requirement/auth/readiness refs, state, correlation ref |
| `ExecutionHandoffAttemptSummary` | attempt ref/handoff/invocation, local state, optional safe response/failure, attempted time |
| `ToolInvocationOutcomeSummary` | outcome ref/class, result XOR error safe summary, basis ref, recorded time |
| `ToolAuditSafeSummary` | audit ref, contract/judgment/outcome/source/gap refs, actor/correlation/time |
| `SafeHandoffStateSummary` | target-specific eligibility/material/latest local attempt refs and states |
| External status summaries | ref ID, authority, attempt ref, optional external ref, safe status, consumed time |

No summary contains raw intent/result/error/audit/provider/evidence/secret body. Domain-to-view mappers perform exact enum/ref conversion; public views never import domain-only types by crate dependency.

Pure mapper signatures used by Step 9 are fixed as follows; every input is an already-loaded domain object/ref/version and every function performs zero I/O:

```rust
pub fn map_contract_view(input: ContractViewInput) -> Result<ToolContractView, MappingError>;
pub fn map_binding_view(input: BindingViewInput) -> Result<CapabilityBindingView, MappingError>;
pub fn map_invocation_view(input: InvocationViewInput) -> Result<ToolInvocationView, MappingError>;
pub fn map_precondition_view(input: PreconditionViewInput) -> Result<ExecutionPreconditionView, MappingError>;
pub fn map_outcome_audit_view(input: OutcomeAuditViewInput) -> Result<OutcomeAuditView, MappingError>;
pub fn map_gap_view(input: GapViewInput) -> Result<ConsistencyGapView, MappingError>;
pub fn map_compatibility_impact_view(
    impact: &ToolCompatibilityImpact,
    impact_ref: CompatibilityImpactRef,
) -> Result<ToolCompatibilityImpactView, MappingError>;
pub fn map_handoff_command_view(
    precondition: ExecutionPreconditionView,
    handoff: &ExecutionHandoff,
    handoff_version: CommittedVersion,
    attempt: Option<&ExecutionHandoffAttempt>,
) -> Result<ExecutionHandoffCommandView, MappingError>;
pub fn map_safe_external_handoff_view(input: SafeExternalHandoffViewInput)
    -> Result<SafeExternalHandoffView, MappingError>;
```

The `*ViewInput` carriers are pure mapper inputs owned by `application::mapping`; they contain exactly the corresponding domain objects, selected refs/gaps/external-status refs, `ConsumptionVisibility`, and adapter-issued committed version/watermark required by the public fields above. The public `contracts` crate still exposes only the resulting views. Inputs contain no repository object, `Loaded<T>`, Port, UoW, config or external body. `MappingError` is limited to identity/ref/version/payload-symmetry and forbidden-body failures and maps to `IntegrityFailure`.

## 3. Shared Command intent carriers

```rust
pub enum ToolIdentityIntent {
    Generate,
    UseProvided(ToolId),
}

pub struct FormalDefinitionIntent {
    pub invocation_semantics: InvocationSemanticsInput,
    pub outcome_semantics: OutcomeSemanticsInput,
    pub execution_requirements: ExecutionRequirementBasisInput,
}

pub struct DefinitionSourceInput {
    pub authority_candidate: ContractAuthorityCandidateRef,
    pub source_locator: ExternalLocatorSummary,
    pub source_revision: ExternalRevisionRef,
    pub shared_contract_family: Option<SharedContractFamily>,
}

pub enum CapabilityBindingTargetInput {
    Bound(HubCapabilityCandidateInput),
    ExplicitUnbound(ExplicitUnboundReason),
}

pub struct HubCapabilityCandidateInput {
    pub authority_candidate: HubAuthorityCandidateRef,
    pub capability_id: ExternalCapabilityId,
    pub capability_revision: ExternalRevisionRef,
    pub locator: ExternalLocatorSummary,
}
```

All enums/variants and fields receive English rustdoc. `FormalDefinitionIntent` safe summaries are named bounded structures, not implementation schema or arbitrary maps. `CapabilityBindingTargetInput::Bound` always has a candidate; `ExplicitUnbound` never does. A source input is only a candidate until its named Port validates authority and revision.

## 4. `EstablishToolContract`

```rust
pub struct EstablishToolContractRequest {
    pub identity: ToolIdentityIntent,
    pub initial_revision: DefinitionRevision,
    pub definition: FormalDefinitionIntent,
    pub definition_source: DefinitionSourceInput,
    pub binding_mode: BindingMode,
    pub establishment_reason: ContractEstablishmentReason,
}
```

| Request field | Target/source | Missing/invalid behavior |
|---|---|---|
| `identity` | `ToolContract.tool_id`;provided or `IdGeneratorPort` | invalid/provided duplicate => conflict; generator failure => unavailable |
| `initial_revision` | first definition/current pointer | must be first allowed revision; invalid => reject |
| `definition` | `FormalToolDefinition` semantic fields | invalid/body-bearing => reject |
| `definition_source` | Shared authority Port -> `DefinitionSourceRef` | blocked/unverifiable => no writes, blocked |
| `binding_mode` | `ToolContract.initial_binding_mode`; live Binding is read separately | explicit closed variant required |
| `establishment_reason` | first evolution fact reason | absent/unsafe => reject |

Result: `ToolCommandResponse<ToolContractView>`. Atomic target set: contract + first current definition + established evolution fact + stored result/idempotency record. Allowed error classes: invalid input, conflict, blocked, unavailable, integrity failure. Audit: local evolution fact and required operation log; no Tool invocation audit. Flow `CF-01`.

## 5. `AssessToolDefinitionChange`

```rust
pub struct AssessToolDefinitionChangeRequest {
    pub tool_id: ToolId,
    pub candidate_revision: DefinitionRevision,
    pub candidate_definition: FormalDefinitionIntent,
    pub candidate_source: DefinitionSourceInput,
    pub protected_consumer_scope: ProtectedConsumerScopeInput,
    pub assessment_reason: DefinitionAssessmentReason,
}

pub enum ProtectedConsumerScopeInput {
    Enumerated(ConsumerReferenceSummarySet),
    FormallyEmpty(ProtectedConsumerScopeBasisRef),
}

pub struct ToolCompatibilityImpactView {
    pub impact_ref: CompatibilityImpactRef,
    pub tool_id: ToolId,
    pub base_revision: DefinitionRevision,
    pub candidate_revision: DefinitionRevision,
    pub impact_class: CompatibilityImpactClass,
    pub affected_consumers: ConsumerReferenceSummarySet,
    pub assessed_at: AssessmentTime,
}
```

Application loads current definition, validates candidate source, constructs/inserts immutable candidate and appends impact. `Enumerated` must be non-empty, sorted and deduplicated; an empty set is represented only by `FormallyEmpty` with an attributable local scope-basis ref. Result: `ToolCommandResponse<ToolCompatibilityImpactView>`. It never changes current revision or contract version. Allowed errors: not found, invalid input, conflict, blocked/unavailable, integrity failure. Flow `CF-02`.

## 6. `AdoptToolDefinitionRevision`

```rust
pub struct AdoptToolDefinitionRevisionRequest {
    pub tool_id: ToolId,
    pub candidate_revision: DefinitionRevision,
    pub impact_ref: CompatibilityImpactRef,
    pub expected_current_revision: DefinitionRevision,
    pub migration_closure_ref: Option<ConsumerMigrationClosureRef>,
    pub adoption_reason: DefinitionAdoptionReason,
}
```

`expected_current_revision` is a semantic guard, not repository `ExpectedVersion`. The stored impact must match exact base/candidate pair; compatible requires no migration ref, conditionally compatible requires a `ConsumerMigrationClosureRef` whose exact impact/pair/protected-set/current-report/watermark is verified through `ProjectionStore::get_consistency_report`; incompatible/unverifiable rejects. The closure is not migration evidence or test signoff. Result: `ToolCommandResponse<ToolContractView>`. Atomic target set: old/current definition states, contract pointer, adoption evolution fact, affected-projection stale marks, stored replay. Allowed errors: not found, conflict/stale current, invalid state, integrity failure. Flow `CF-03`.

## 7. `RetireToolContract`

```rust
pub enum ToolRetirementAction {
    Request {
        reason: ContractRetirementReason,
    },
    Complete {
        impact_closure_ref: ImpactClosureRef,
        reason: RetirementCompletionReason,
    },
}

pub struct RetireToolContractRequest {
    pub tool_id: ToolId,
    pub action: ToolRetirementAction,
}
```

Request action maps `Active -> RetirementPending`; Complete maps pending -> retired only after formal impact closure validation. No delete/resurrect action exists. Result: `ToolCommandResponse<ToolContractView>`. Atomic target: contract lifecycle + evolution fact + affected-projection stale + stored replay. Allowed errors: not found, invalid state, conflict, unverifiable closure, unavailable. Flow `CF-04`.

`ImpactClosureRef` carries the same `tool_id`, protected-consumer-set digest, `ReferenceConsistencyReportKey`, required comparable source watermark and body-free closure basis refs. Application validates it through `ProjectionStore::get_consistency_report`; only a matching `Current` report with no open blocking / integrity-critical retirement-scope gap permits completion. This is local impact verification, not a migration result, run/test evidence or external signoff.

## 8. `DeclareCapabilityBinding`

```rust
pub struct DeclareCapabilityBindingRequest {
    pub tool_id: ToolId,
    pub target: CapabilityBindingTargetInput,
    pub declaration_reason: BindingDeclarationReason,
}
```

The first relation declared for a tool must match `ToolContract.initial_binding_mode`; later formal replacement may change the live mode without rewriting that establishment field. For `Bound`, application validates contract, sends the candidate fields to the Hub source Port, and only then constructs the formal Hub ref/snapshot/accepted or conservative assessment from a symmetric result; only a verifiable accepted bound source may create an active bound relation. For explicit-unbound, no Hub call/ref/snapshot occurs. Result: `ToolCommandResponse<CapabilityBindingView>`. Atomic target: relation + applicable snapshot/assessment + change fact + stored replay. Existing current relation conflicts. Allowed errors: not found, invalid input, conflict, blocked/unavailable/unverifiable source. Flow `CF-05`.

## 9. `ReplaceCapabilityBinding`

```rust
pub struct ReplaceCapabilityBindingRequest {
    pub binding_id: CapabilityBindingId,
    pub replacement: CapabilityBindingTargetInput,
    pub replacement_reason: BindingReplacementReason,
}
```

Application loads current relation/version; validates the new bound source candidate when applicable; transitions old relation through replacement and creates a new relation ID. The replacement change fact names the old subject and explicit successor ID. Result view is the new current binding and its accepted assessment. Atomic target: old relation terminal state + new relation + snapshot/assessment when bound + one replacement change fact + stale affected projections + stored replay. No null-to-unbound or partial replacement. Allowed errors: not found, invalid state/input, conflict, blocked/unavailable. Flow `CF-06`.

## 10. `InvalidateCapabilityBinding`

```rust
pub struct InvalidateCapabilityBindingRequest {
    pub binding_id: CapabilityBindingId,
    pub reason: BindingInvalidationReason,
}
```

Result: `ToolCommandResponse<CapabilityBindingView>` showing invalidated historical relation. Atomic target: relation + invalidation change fact + affected projections/gap candidate + stored replay. It does not delete, create explicit-unbound, change old invocation anchors or repair Hub truth. Errors: not found, invalid state, conflict, unavailable. Flow `CF-07`.

## 11. `SubmitToolInvocation`

```rust
pub struct FormalInvocationIntent {
    pub operation: ToolOperationSelector,
    pub arguments: SafeArgumentObject,
    pub expected_output_class: ToolExpectedOutputClass,
}

pub struct InvocationContextInput {
    pub caller_ref: CallerRef,
    pub work_ref: Option<WorkRef>,
}

pub struct SubmitToolInvocationRequest {
    pub tool_id: ToolId,
    pub expected_definition_revision: Option<DefinitionRevision>,
    pub intent: FormalInvocationIntent,
    pub context: InvocationContextInput,
}
```

Actor/trace/correlation come from metadata and application builds `InvocationContextRefs`. It loads exact current contract/definition/binding assessment and creates immutable anchor. `expected_definition_revision`, when present, fails on drift; it is not an expected persistence version. Safe arguments are bounded typed values only. Result: `ToolCommandResponse<ToolInvocationView>` with disposition Accepted/Awaiting for admitted paths, or public `ProtocolError` plus stored no-execution outcome/audit for rejected/unavailable semantic branches according to Step 9 mapping. Atomic target includes invocation + admission, and for terminal pre-execution rejection the outcome/audit pair, plus idempotency replay. Errors: not found, not visible as applicable, invalid intent/context, conflict, blocked/unavailable. Flow `CF-08`.

## 12. `EvaluateExecutionPreconditions`

```rust
pub enum AuthorizationResultSelector {
    ResolveCurrentForInvocation,
    ByExternalResultId(ExternalAuthorizationResultId),
}

pub struct EvaluateExecutionPreconditionsRequest {
    pub invocation_id: ToolInvocationId,
    pub authorization_selector: Option<AuthorizationResultSelector>,
    pub requested_carrier: Option<ExecutionCarrierClass>,
}
```

The selector locates a formal result through `AuthorizationConsumptionPort`; it is not a decision input. `requested_carrier` may narrow a supported carrier but cannot bypass Sandbox/isolation requirements. Application derives requirement, consumes authorization when applicable, resolves Sandbox readiness when applicable and persists immutable assessments. Accepted deny or conservative blocking state atomically creates a no-execution outcome/audit. Result: `ToolCommandResponse<ExecutionPreconditionView>`. Errors: not found, invalid state/input, blocked/unavailable, conflict, integrity failure. Flow `CF-09`.

## 13. `PrepareExecutionHandoff`

```rust
pub struct PreconditionSelection {
    pub requirement_ref: ExecutionRequirementRef,
    pub authorization_assessment_ref: Option<AuthorizationAssessmentRef>,
    pub sandbox_readiness_ref: Option<SandboxReadinessSnapshotRef>,
}

pub struct PrepareExecutionHandoffRequest {
    pub invocation_id: ToolInvocationId,
    pub selection: PreconditionSelection,
}

pub struct ExecutionHandoffCommandView {
    pub precondition: ExecutionPreconditionView,
    pub handoff_ref: ExecutionHandoffRef,
    pub handoff_state: HandoffState,
    pub attempt_ref: Option<ExecutionHandoffAttemptRef>,
    pub attempt_state: Option<HandoffAttemptState>,
}
```

All selected refs must match invocation/anchor/current evaluation. Application derives canonical safe execution summary; caller cannot submit it. Eligible handoff triggers exactly one local Sandbox Port call and appends one attempt. Blocked/invalidated/call-unavailable branches create the appropriate local attempt or no-execution outcome/audit according to flow, never host fallback. Result: `ToolCommandResponse<ExecutionHandoffCommandView>`. Errors: not found, invalid state/ref, conflict, blocked/unavailable, port contract violation. Flow `CF-10`.

## 14. `AcceptExecutionSource`

```rust
pub enum ExecutionSourceSemanticInput {
    Succeeded(ToolResultSafeSummary),
    ToolFailed(ToolErrorSafeSummary),
    ExecutionFailed(ToolErrorSafeSummary),
    CaptureFailed(ToolErrorSafeSummary),
}

pub struct ExecutionSourceCandidateInput {
    pub source_event_id: SourceEventId,
    pub contract_version: ToolProtocolSchemaVersion,
    pub source_authority_ref: SourceAuthorityRef,
    pub external_execution_ref: ExternalSandboxExecutionRef,
    pub handoff_correlation_ref: CorrelationRef,
    pub source_class: ExecutionSourceClass,
    pub source_revision: ExternalRevisionRef,
    pub semantic_input: ExecutionSourceSemanticInput,
}

pub struct AcceptExecutionSourceRequest {
    pub invocation_id: ToolInvocationId,
    pub candidate: ExecutionSourceCandidateInput,
}
```

The same request is constructed by the Sandbox source consumer or a formal direct source adapter. Envelope `source_event_id` and `contract_version` are therefore explicit candidate fields and enter the canonical Command digest; neither is derived from request metadata. `ExecutionSourceIntakePort` validates/mapping-normalizes authority, correlation, version and safe summary; application constructs source ref/assessment and exactly one terminal outcome/audit pair. Mapping blocked/rejected/missing/conflicting/unverifiable persists only assessment/gap/consumer result, not a guessed outcome. Result: `ToolCommandResponse<OutcomeAuditView>`. Duplicate equal pair replays; different terminal pair is conflict/gap. Errors: not found, invalid source/body, conflict, blocked/unavailable, terminal integrity failure. Flow `CF-11`.

## 15. `PrepareSafeExternalHandoff`

```rust
pub struct SensitivityContextInput {
    pub data_classification: SafeDataClassification,
    pub redaction_profile_ref: RedactionProfileRef,
    pub required_correlation_classes: CorrelationClassSet,
}

pub enum SafeExternalHandoffSourceInput {
    ContractChange {
        evolution_fact_ref: EvolutionFactRef,
    },
    BindingFormalChange {
        change_fact_ref: BindingChangeFactRef,
    },
    BindingConsistencyGap {
        gap_id: ConsistencyGapId,
        binding_id: CapabilityBindingId,
    },
    OutcomeAudit {
        outcome_id: ToolInvocationOutcomeId,
        audit_entry_id: ToolAuditEntryId,
    },
    ConsistencyGap {
        gap_id: ConsistencyGapId,
    },
}

pub struct PrepareSafeExternalHandoffRequest {
    pub source: SafeExternalHandoffSourceInput,
    pub target: ExternalCollaborationClass,
    pub sensitivity: SensitivityContextInput,
}

pub struct SafeExternalHandoffView {
    pub eligibility_ref: SafeHandoffEligibilityRef,
    pub eligibility_state: SafeHandoffEligibilityState,
    pub material_ref: Option<SafeHandoffMaterialRef>,
    pub attempt_ref: Option<ExternalSubmissionAttemptRef>,
    pub attempt_state: Option<ExternalSubmissionAttemptState>,
    pub gap_refs: ConsistencyGapRefSet,
}
```

The closed source selector maps exactly to the four event material classes: Contract change;Binding formal change or binding-scoped gap;Outcome/Audit;general consistency gap. Application loads the exact immutable source and never rebuilds an event from current mutable truth. A binding-scoped gap selector must match the gap subjects and is distinct from the general gap event selector. Sensitivity input selects a formally bound redaction profile; it cannot relax minimal/body-free/redaction/correlation checks. Ineligible/unverifiable returns committed eligibility with no material/attempt. Eligible produces immutable material, commits it locally, then calls collaboration Port and records local attempt in a separate post-truth UoW; Step 9 distinguishes these commits. Result: `ToolCommandResponse<SafeExternalHandoffView>`. Local route failure does not roll back source truth/material. Errors: not found, invalid input/ref, blocked/unavailable post-truth, conflict. Flow `CF-12`.

## 16. `RecordConsistencyGapResolution`

```rust
pub struct GapResolutionEvidenceInput {
    pub owner_authority_ref: ExternalAuthorityRef,
    pub subject_ref: TypedSubjectRef,
    pub resolution_locator: ExternalLocatorSummary,
    pub owner_revision: ExternalRevisionRef,
}

pub struct RecordConsistencyGapResolutionRequest {
    pub gap_id: ConsistencyGapId,
    pub evidence: GapResolutionEvidenceInput,
    pub resolution_reason: GapResolutionReason,
}
```

The request carries a locator, never evidence body/alias/signature/run/test result. Application first moves Open -> ResolutionPending with a typed evidence ref, then re-reads the formal subject owner through the relevant existing store/Port and creates a local `GapResolutionDecisionRef`; only verified repair moves to Resolved. A newer precise gap may supersede. Result: `ToolCommandResponse<ConsistencyGapView>`. It never repairs the subject. Errors: not found, invalid state/ref, unverifiable/blocked owner, conflict, unavailable. Flow `CF-13`.

## 17. DTO-to-object construction closure

| Command | Target objects | Caller fields complete | Lookup/derived/system fields | Missing behavior |
|---|---|---|---|---|
| Establish | contract/definition/evolution | identity mode, revision, semantics, source, mode, reason | IDs/time/resolved source/version | no partial writes |
| Assess change | candidate/impact | tool/candidate/source/consumer refs/reason | base definition, IDs/time | unverifiable impact or no writes |
| Adopt | contract/definitions/evolution | exact revision pair, impact, closure/reason | loaded version/time/change ID | conflict/reject |
| Retire | contract/evolution | action/reason/closure | loaded version/time/change ID | invalid state/no write |
| Declare/replace/invalidate | binding/snapshot/assessment/change | target/reason | Hub resolution, IDs/time/version | blocked/conflict/no partial relation |
| Submit | invocation/context/anchor/admission/(outcome/audit) | tool/expected revision/intent/caller/work | actor/trace/correlation, contract/binding reads, IDs/time | reject/no-execution or unavailable |
| Evaluate | requirement/auth/readiness/(outcome/audit) | invocation/selectors | definition, Port results, IDs/time | fail closed/no execution |
| Handoff | handoff/attempt/(outcome/audit) | invocation + exact local refs | canonical summary, Port result, IDs/time | block/no host fallback |
| Accept source | source ref/assessment/outcome/audit | invocation + candidate safe semantics | mapping, IDs/time | assessment/gap only |
| Safe handoff | eligibility/material/attempt | closed immutable source selector/target/sensitivity | exact source truth reads, IDs/time, Port result | no material when ineligible |
| Gap resolution | gap/evidence/decision | gap + owner locator/reason | formal re-read, local decision/time/version | remains pending/open |

No target field is left for an implementation agent to invent. Public near-name rules: source candidate != source ref; result selector != authorization decision; expected current revision != repository expected version; outcome ref != audit ref; eligibility ref != material ref != submission attempt ref.

## 18. Command family stop review

| Review item | Result | Closure |
|---|---|---|
| 13 independent protocols present | pass | sections 4~16 |
| Every request/result secondary type has schema | pass | shared + per-protocol definitions |
| DTO constructs all Step 6 target fields | pass | construction audit complete |
| IDs/time/versions/authority sources exact | pass | application/store/Port only |
| Errors, idempotency and audit behavior named | pass | typed class per protocol; stored replay all Commands |
| Blocked positive paths remain conservative | pass | no provider/mapping/route readiness claim |
| Each protocol maps to one Step 9 flow | pass | `CF-01~13` |
| No transport/backend/domain-only type leaks | pass | logical names + contracts-owned carriers |
