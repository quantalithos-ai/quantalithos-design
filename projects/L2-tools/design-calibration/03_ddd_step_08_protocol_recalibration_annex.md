# L2-tools 03 Step 8 R-8 protocol closure recalibration annex

> Status: completed / pass
> Mode: full-restart / single-agent-serial
> Formal target: `projects/L2-tools/03-详细设计.md` §6 and §7
> Canonical schema authorities: `03_ddd_step_08_shared_protocol_carriers_annex.md`, `03_ddd_step_08_command_protocols_annex.md`, `03_ddd_step_08_query_protocols_annex.md`, `03_ddd_step_08_consumer_protocols_annex.md`, `03_ddd_step_08_event_protocols_annex.md`, and `03_ddd_step_08_job_protocols_annex.md`
> This annex is a closure audit and controlled clarification. It does not introduce a second DTO, Store, Port, state owner, route, provider, or external lifecycle.

## 0. Recalibration gate

| Item | Evidence / decision |
|---|---|
| Previous gate | R-5 module contracts, R-6 object/carrier contracts, and R-7 trait/Port/adapter contracts are `completed / pass`. |
| Reason for reopen | The existing protocol annexes were family-complete but did not provide one auditable implementation card for every `13/11/5/4/4` protocol. A caller could still infer a mapper, Store method, replay surface, or fake behavior. |
| Required result | Every protocol must close `DTO authority -> field source -> mapper/factory -> facade/handler -> Store/Port seam -> Step 9 flow -> version/error/replay -> forbidden boundary -> durable/fake parity`. |
| Direct inputs | Formal `02-概要设计.md` §7, §8, §9, §12; R-6 object/carrier annex; R-7 exact seam ledger; current Step 8 family annexes; current Step 9 flow annexes; SOP and implementability standard. |
| Historical input | Older protocol names, transport paths, registry terminology, and `HubControlledSnapshotRef` are historical only. The canonical current name is `HubSnapshotRef`. |
| External blockers | `L2T-UP-001~009` remain open. Positive authorization, Sandbox, Bus, Observability, Core, SDK, route, and provider readiness is not claimed. |
| Formal write rule | Formal `03-详细设计.md` remains write-closed. This annex and controlled corrections to intermediate files are the only permitted writes. |

## 1. Card template and authority rules

### 1.1 Card fields

Each card below uses the same fields. `Canonical DTO` always points to the already-defined schema; it is not a redefinition.

| Card field | Required proof |
|---|---|
| Canonical DTO | Exact request, response/view/payload/report type and logical schema name. |
| Caller and handler | Entry boundary, application facade, and the only handler owner. |
| Field source matrix | Caller-owned intent versus Store/Port lookup versus application-generated ID/time/version/ref. |
| Mapper/factory | Exact pure mapper and domain factory/member function; no hidden I/O. |
| Local seam | Exact Step 7 Store/Port method(s), read/write phase, UoW and version token rule. |
| Flow | One and only one Step 9 flow ID. |
| Failure/replay | Typed error classes, blocked/unavailable behavior, digest scope, and stored replay surface. |
| Forbidden surface | Body, route, lifecycle, ownership, or fallback that this protocol cannot carry. |
| Parity/reopen | Durable/fake equivalence and the condition that reopens Step 6/7/8/9. |

### 1.2 Single-source and construction rules

1. Public DTO schemas remain owned by `contracts::*`; domain objects remain owned by their Step 6 module. Application mapping is the only boundary between them.
2. A field is caller-owned only when it expresses semantic intent, a stable subject/ref, a safe reason, or a bounded candidate. Stored versions, commit watermarks, outcome/audit IDs, local attempt IDs, result refs, and freshness are never caller intent.
3. A `Ref` locates an immutable local fact; a `Summary` is body-free; an `Assessment` is an L2 judgment. The mapper must reject near-name substitution.
4. Every Command/Consumer/Job digest excludes transport headers and arrival time. Consumer digest scope is `(consumer, source_authority_ref, source_event_id, deduplication_key)` plus canonical payload; `received_at` is excluded.
5. Duplicate replay reads the stored typed value/error/receipt/report. It never rebuilds a historical response from mutable current truth and never re-calls an external Port.
6. Query cards prove zero UoW, zero writes, zero refresh/rebuild, and zero external Port calls. Event cards prove immutable safe-material source and the prepared-attempt fence.

### 1.3 Common application callable surfaces

```rust
ToolCommandUseCases::execute(
    request: ToolCommandRequest,
    metadata: CommandMetadata,
) -> Result<ToolCommandResponse<Value>, ProtocolError>;

ToolQueryUseCases::execute(
    request: ToolQueryRequest,
    metadata: QueryMetadata,
) -> Result<ToolQueryResponse<Value>, ProtocolError>;

InboundConsumerUseCases::consume(
    input: ToolInboundConsumerInput,
) -> Result<ConsumerReceipt, ProtocolError>;

SafeMaterialContinuationUseCases::continue_material(
    input: SafeMaterialContinuationInput,
) -> Result<ExternalSubmissionAttemptView, ProtocolError>;

ToolJobUseCases::run(
    request: ToolJobRequest,
    metadata: JobMetadata,
) -> Result<JobReport, ProtocolError>;
```

Entries decode a closed logical protocol version, validate the matching metadata/envelope, call exactly one facade, and encode the typed result. Entries never access a Store, Port, UoW, domain object, route, broker receipt, scheduler lease, or raw body.

## 2. Command closure cards

### 2.0 Command common contract

| Item | Closed rule |
|---|---|
| Logical name | `tools.command.<snake_case_operation>.v1`. |
| Request authority | `CommandMetadata` supplies actor, request/correlation/trace, idempotency key and submitted time; request body never repeats them. |
| Result authority | `ToolCommandResponse<T>` with `StoredCommandValue` snapshot, `CommandResultRefSet`, committed version/watermark, and gap refs. |
| Precheck | `CommandMetadata::validate` -> canonical digest -> `IdempotencyStore::get`; equal committed digest replays; differing digest conflicts; in-flight claim does not invoke external work. |
| UoW | One local UoW for each atomic local write set. `ExpectedVersion` comes only from `Loaded<T>` returned by the same Store authority. |
| Error storage | A committed semantic rejection that owns a local outcome/audit/gap is stored as `StoredApplicationError` plus `StoredCommandResultRef`; pre-write invalid input may return `ProtocolError` without a write. |
| Fake parity | Fake facade, Stores, Ports, clock and ID generator use the same digest, unique-key, version, commit-resolution, blocked and body-rejection rules as durable adapters. |

### 2.1 `CF-01 EstablishToolContract`

| Card item | Exact closure |
|---|---|
| Canonical DTO | `EstablishToolContractRequest` -> `ToolCommandResponse<ToolContractView>`; `tools.command.establish_tool_contract.v1`; schema authority: Command annex §4, view authority §2. |
| Caller/handler | `api::CommandHandler` or management entry -> `ToolCommandUseCases::execute(EstablishToolContract, CommandMetadata)` -> `contract::EstablishToolContractService`. |
| Field sources | `identity`, `initial_revision`, `definition`, `definition_source`, `binding_mode`, `establishment_reason` are caller intent; `tool_id` when generated, definition/source/fact IDs, authoritative source ref, decision time, and committed version come from `IdGeneratorPort`, `SharedContractAuthorityPort`, `ClockPort`, and Store commit. |
| Mapper/factory | `DefinitionSourceRef::from_authority`; `FormalToolDefinition::formalize` then `promote_to_current`; `ToolContract::establish`; `ToolContractEvolutionFact::record`; `map_contract_view(ContractViewInput::established)`. |
| Store/Port seam | Pre-read `ToolContractStore::get_contract/get_definition`; no-UoW `SharedContractAuthorityPort::resolve`; one UoW `create_contract`, `insert_definition`, `append_evolution_fact`, `IdempotencyStore::store_command_result/save_record`. |
| Flow/version | `CF-01`; first revision only; all three truth rows and replay snapshot commit together. |
| Failure/replay | Existing identity/revision -> `Conflict`; invalid body/revision -> `InvalidInput`; authority blocked/unavailable/unverifiable -> `Blocked/Unavailable` with zero truth writes; equal committed digest -> exact `ToolContractView` replay; commit unknown -> same-authority `resolve_commit`. |
| Forbidden/parity | No Binding creation, invocation, registry copy, provider body, transport route, or event publication. Durable/fake must agree on generated-ID collision, source echo, rollback invisibility and replay. |
| Reopen | Reopen Step 6/7/8 if a new target field, source authority, Store method, or result variant is required. |

### 2.2 `CF-02 AssessToolDefinitionChange`

| Card item | Exact closure |
|---|---|
| Canonical DTO | `AssessToolDefinitionChangeRequest` -> `ToolCommandResponse<ToolCompatibilityImpactView>`; `tools.command.assess_tool_definition_change.v1`; Command annex §5. |
| Caller/handler | API/management -> `ToolCommandUseCases::execute(AssessToolDefinitionChange, CommandMetadata)` -> contract evolution service. |
| Field sources | Caller supplies `tool_id`, candidate revision/semantic definition, source candidate, protected consumer scope and reason; current/base definition, authoritative source ref, candidate/impact IDs, assessment time and commit version are local lookup/Port/application fields. |
| Mapper/factory | `DefinitionSourceRef::from_authority`; `FormalToolDefinition::formalize(Candidate)`; `ToolCompatibilityImpact::assess`; `map_compatibility_impact_view`. |
| Store/Port seam | Pre-read `ToolContractStore::get_current_bundle/get_definition`; no-UoW `SharedContractAuthorityPort::resolve`; one UoW `insert_definition`, `append_compatibility_impact`, and stored replay. |
| Flow/version | `CF-02`; candidate remains immutable `Candidate`; current pointer and contract version do not change. |
| Failure/replay | Missing/retired tool, duplicate candidate, malformed empty scope or body -> `NotFound/Conflict/InvalidInput`; authority open -> `Blocked/Unavailable`; equal append only when canonical source/basis matches; duplicate command replays exact impact view. |
| Forbidden/parity | Cannot adopt revision, mark projections stale, enumerate provider consumers, or store raw definition/body. Fake must reproduce canonical empty-scope and impact conflict rules. |
| Reopen | Reopen if compatibility class, protected-scope basis, impact key, or candidate Store method changes. |

### 2.3 `CF-03 AdoptToolDefinitionRevision`

| Card item | Exact closure |
|---|---|
| Canonical DTO | `AdoptToolDefinitionRevisionRequest` -> `ToolCommandResponse<ToolContractView>`; `tools.command.adopt_tool_definition_revision.v1`; Command annex §6. |
| Caller/handler | Management/API -> command facade -> contract evolution application service. |
| Field sources | Caller supplies tool/candidate revision, impact ref, expected semantic current revision, optional migration closure ref and reason; loaded current/candidate/impact values, Store expected versions, evolution fact ID/time, stale page watermark and result refs are application/Store-derived. |
| Mapper/factory | `verify_optional_migration_closure`; `ToolContract::adopt_revision`; definition `mark_superseded/promote_to_current`; `ToolContractEvolutionFact::record`; `map_contract_view(ContractViewInput::adopted)`. |
| Store/Port seam | Pre-read `ToolContractStore::get_current_bundle/get_definition/get_compatibility_impact`; conditional no-UoW `ProjectionStore::get_consistency_report`; one UoW saves old definition, candidate, contract, appends fact, `ProjectionStore::mark_affected_stale`, creates continuation gap, stores replay. |
| Flow/version | `CF-03`; semantic `expected_current_revision` is not persistence `ExpectedVersion`; all CAS writes use loaded tokens and one UoW. |
| Failure/replay | Drift, missing/mismatched impact or closure, incompatible report, stale projection or CAS conflict -> typed `Conflict/InvalidState/IntegrityFailure`; no partial switch. Equal command digest replays exact stored view and gap refs. |
| Forbidden/parity | No consumer migration execution, Runtime refresh, current-truth reconstruction, event publication, or invocation-anchor rewrite. Fake must reproduce three-token atomic rollback and bounded stale-page continuation. |
| Reopen | Reopen if adoption requires a new closure state, Store write, projection disposition, or response field. |

### 2.4 `CF-04 RetireToolContract`

| Card item | Exact closure |
|---|---|
| Canonical DTO | `RetireToolContractRequest` -> `ToolCommandResponse<ToolContractView>`; `tools.command.retire_tool_contract.v1`; Command annex §7. |
| Caller/handler | Management/API -> command facade -> contract lifecycle service. |
| Field sources | Caller supplies tool, closed `Request` or `Complete` action, reason and (for complete) `ImpactClosureRef`; loaded lifecycle/version, fact/decision IDs, time, stale page and replay refs are application/Store-derived. |
| Mapper/factory | `ToolContract::request_retirement` or `complete_retirement`; `ToolContractEvolutionFact::record`; `map_contract_view(ContractViewInput::retired_transition)`. |
| Store/Port seam | Pre-read `ToolContractStore::get_current_bundle`; complete-only no-UoW `ProjectionStore::get_consistency_report`; one UoW `save_contract`, `append_evolution_fact`, `mark_affected_stale`, gap/replay writes. |
| Flow/version | `CF-04`; `Active -> RetirementPending -> Retired`; no delete/resurrect. |
| Failure/replay | Wrong lifecycle, missing/stale/partial closure, version conflict or report mismatch -> `InvalidState/Conflict/Unavailable`; equal action/digest replays; differing action under same key conflicts. |
| Forbidden/parity | No external lifecycle claim, consumer shutdown, registry deletion, route change, or invocation-anchor mutation. Fake and durable agree on closure freshness and CAS behavior. |
| Reopen | Reopen if retirement adds a state, closure owner, source report field, or stale propagation method. |

### 2.5 `CF-05 DeclareCapabilityBinding`

| Card item | Exact closure |
|---|---|
| Canonical DTO | `DeclareCapabilityBindingRequest` -> `ToolCommandResponse<CapabilityBindingView>`; `tools.command.declare_capability_binding.v1`; Command annex §8. |
| Caller/handler | Management/API -> command facade -> binding declaration service. |
| Field sources | Caller supplies tool, closed `Bound(candidate)` or `ExplicitUnbound(reason)`, and reason; contract/current relation, Hub authority/result, binding/snapshot/assessment/fact IDs, time and versions are lookup/Port/application fields. |
| Mapper/factory | Bound: `HubCapabilityRef::resolve`, `HubControlledSnapshot::from_port`; both: `CapabilityBinding::declare`, `CapabilityBindingAssessment::assess`, `CapabilityBindingChangeFact::record`, `map_binding_view`. |
| Store/Port seam | Pre-read `ToolContractStore::get_contract`, `CapabilityBindingStore::find_current_by_tool`; Bound-only no-UoW `HubControlledSourcePort::resolve_snapshot`; one UoW `create_binding`, optional `append_snapshot`, `append_assessment`, `append_change_fact`, replay. |
| Flow/version | `CF-05`; first relation mode must equal `ToolContract.initial_binding_mode`; explicit-unbound makes no Hub call/ref/snapshot. |
| Failure/replay | Existing current, mode mismatch, candidate/result mismatch, blocked/unavailable/unverifiable Hub -> `Conflict/InvalidInput/Blocked/Unavailable`, zero relation write; equal command replays exact binding view. |
| Forbidden/parity | No registry mutation, capability discovery by name, cached allow, or invocation-anchor rewrite. Fake must preserve explicit-unbound bypass and result symmetry. |
| Reopen | Reopen if Hub candidate/result fields, binding assessment state, or relation uniqueness method changes. |

### 2.6 `CF-06 ReplaceCapabilityBinding`

| Card item | Exact closure |
|---|---|
| Canonical DTO | `ReplaceCapabilityBindingRequest` -> `ToolCommandResponse<CapabilityBindingView>`; `tools.command.replace_capability_binding.v1`; Command annex §9. |
| Caller/handler | Management/API -> command facade -> binding replacement service. |
| Field sources | Caller supplies current binding ID, closed replacement target and reason; old loaded relation/version, Hub resolution, successor ID, snapshots/assessments/change fact IDs and time come from Store/Port/application. |
| Mapper/factory | `CapabilityBinding::replace`; bound candidate maps through `HubCapabilityRef::resolve`/`HubControlledSnapshot::from_port`; `CapabilityBindingAssessment::assess`; `CapabilityBindingChangeFact::record`; `map_binding_view`. |
| Store/Port seam | Pre-read `CapabilityBindingStore::get_binding`; bound-only no-UoW Hub resolution; one UoW CAS-saves old relation, creates successor, appends optional snapshot/assessment/change fact and replay. |
| Flow/version | `CF-06`; old relation becomes terminal with explicit successor; one current-by-tool constraint is evaluated atomically. |
| Failure/replay | Non-active old state, same ID, candidate/result mismatch, Hub blocker, version/uniqueness conflict -> zero partial replacement; equal digest replays successor view. |
| Forbidden/parity | No null-to-unbound inference, old anchor rewrite, or partial two-current relation. Fake tracks old/new identity and same CAS/uniqueness semantics. |
| Reopen | Reopen if successor identity, replacement state, or atomic Store method is not representable by Step 6/7. |

### 2.7 `CF-07 InvalidateCapabilityBinding`

| Card item | Exact closure |
|---|---|
| Canonical DTO | `InvalidateCapabilityBindingRequest` -> `ToolCommandResponse<CapabilityBindingView>`; `tools.command.invalidate_capability_binding.v1`; Command annex §10. |
| Caller/handler | Management/API -> command facade -> binding lifecycle service. |
| Field sources | Caller supplies binding ID and typed reason; loaded relation/version, invalidation time, change fact ID, affected-gap/stale refs and replay refs are application/Store-derived. |
| Mapper/factory | `CapabilityBinding::invalidate`; `CapabilityBindingChangeFact::record`; `map_binding_view`. |
| Store/Port seam | Pre-read `CapabilityBindingStore::get_binding`; one UoW CAS-save relation, append change fact, append gap/stale markers where applicable, store replay. No external Port. |
| Flow/version | `CF-07`; active relation -> invalidated terminal relation; historical identity remains addressable. |
| Failure/replay | Missing/terminal/invalid reason/version conflict -> `NotFound/InvalidState/Conflict`; same key replays historical view even if a successor later exists. |
| Forbidden/parity | No delete, explicit-unbound creation, Hub repair, or old invocation mutation. Durable/fake agree on terminal uniqueness and replay. |
| Reopen | Reopen if invalidation needs a new transition or gap owner. |

### 2.8 `CF-08 SubmitToolInvocation`

| Card item | Exact closure |
|---|---|
| Canonical DTO | `SubmitToolInvocationRequest` -> `ToolCommandResponse<ToolInvocationView>` or committed `StoredApplicationError`; `tools.command.submit_tool_invocation.v1`; Command annex §11. |
| Caller/handler | API/direct caller and `InvocationCallerPort::submit` -> same command facade; no SDK-specific handler. |
| Field sources | Caller supplies tool, optional expected semantic definition revision, bounded operation/arguments/output class and caller/work refs; actor/trace/correlation, contract/definition/binding bundle, invocation/admission/outcome/audit IDs, time/version and safe rejection reason are application/Store-derived. |
| Mapper/factory | `InvocationContextRefs::from_metadata`; `ToolInvocation::submit`; `InvocationContractAnchor::anchor`; `InvocationAdmission::admit/reject`; optional `OutcomeAuditPair`; `map_invocation_view`. |
| Store/Port seam | Pre-read `ToolContractStore::get_current_bundle`, `CapabilityBindingStore::find_current_by_tool/get_latest_assessment_for_binding`; one UoW creates invocation/admission, optional indivisible no-execution pair, stores typed result/error and idempotency. |
| Flow/version | `CF-08`; expected definition revision is semantic drift guard, not Store expected version; accepted anchor is immutable. |
| Failure/replay | Invalid body/context/revision -> pre-write `InvalidInput`; non-active contract, absent/noncurrent binding or conservative assessment -> committed rejected/unavailable admission + no-execution pair/error; same digest replays exact stored value/error. |
| Forbidden/parity | No execution, planning, Runtime orchestration, LLM/provider body, Sandbox call, or policy decision. Fake direct caller/API inputs must yield identical digest/result. |
| Reopen | Reopen if invocation admission requires a new field, object state, pair method, or caller-specific fallback. |

### 2.9 `CF-09 EvaluateExecutionPreconditions`

| Card item | Exact closure |
|---|---|
| Canonical DTO | `EvaluateExecutionPreconditionsRequest` -> `ToolCommandResponse<ExecutionPreconditionView>` or committed no-execution error; `tools.command.evaluate_execution_preconditions.v1`; Command annex §12. |
| Caller/handler | API/management -> command facade -> precondition service. |
| Field sources | Caller supplies invocation ID, explicit authorization selector (if needed), and optional requested carrier; invocation anchor/definition/requirement basis, authority/readiness results, assessment IDs, no-execution outcome/audit IDs, times and versions are application/Store/Port-derived. |
| Mapper/factory | `ExecutionRequirement::derive`; `AuthorizationConsumptionAssessment::from_resolution`; `SandboxReadinessSnapshot::from_resolution`; `map_precondition_view`; no-execution pair factories when denied/blocked. |
| Store/Port seam | Pre-read invocation/contract/binding/handoff stores; no-UoW `AuthorizationConsumptionPort::consume_result` and/or `SandboxExecutionPort::resolve_readiness`; one UoW appends assessments/snapshot/gaps, optional outcome/audit pair, replay. |
| Flow/version | `CF-09`; external resolution occurs before local assessment UoW; deny/blocked is fail-closed and replayable. |
| Failure/replay | Wrong admission/terminal invocation/selector-carrier misuse -> no write; missing/blocked/unavailable/conflicting source or unusable constraint -> committed no-execution error/pair; equal digest replays without a second Port call. |
| Forbidden/parity | No self-authorization, policy evaluation, Sandbox run/readiness inference, host fallback, or authorization provider body. Fake must exercise allow/constrained/deny and all blocked branches with equal local mapping. |
| Reopen | Reopen if requirement class, selector, source assessment, or no-execution pair changes. |

### 2.10 `CF-10 PrepareExecutionHandoff`

| Card item | Exact closure |
|---|---|
| Canonical DTO | `PrepareExecutionHandoffRequest` -> `ToolCommandResponse<ExecutionHandoffCommandView>` or typed uncertain error; `tools.command.prepare_execution_handoff.v1`; Command annex §13. |
| Caller/handler | API/runtime integration -> command facade -> handoff service; Runtime does not own the handoff state. |
| Field sources | Caller supplies invocation ID and exact requirement/auth/readiness refs; canonical safe execution summary, handoff/attempt IDs, prepared marker, local response/failure and times come from application/Port/Store. |
| Mapper/factory | `ExecutionHandoff::prepare`; `ExecutionHandoffAttempt::prepare`; `ExecutionHandoffAttempt::record_*` transition; `map_handoff_command_view`. |
| Store/Port seam | Pre-read exact invocation/precondition bundle; phase-1 UoW creates handoff/attempt `Prepared` and idempotency claim; commit; exactly one `SandboxExecutionPort::submit_handoff`; phase-2 UoW CAS-saves attempt, optional no-execution pair/gap, stored result. |
| Flow/version | `CF-10`; prepared marker is durable before the only side-effecting call; `SideEffectOutcomeUnknown` never auto-retries. |
| Failure/replay | Invalid refs or blocked precondition -> no attempt/no-execution branch; proven local rejection -> terminal attempt; ambiguous call -> `CallOutcomeUnknown` and manual owner; duplicate/prepared/unknown re-entry makes zero second calls. |
| Forbidden/parity | No host/direct execution, run/receipt/capture lifecycle, route/retry/DLQ, or external body. Fake call counter keyed by attempt ID must reject a second call and match durable state transitions. |
| Reopen | Reopen if attempt phase, Port response, uncertainty, or handoff view needs a new state/field/method. |

### 2.11 `CF-11 AcceptExecutionSource`

| Card item | Exact closure |
|---|---|
| Canonical DTO | `AcceptExecutionSourceRequest` -> `ToolCommandResponse<OutcomeAuditView>` or committed safe error; `tools.command.accept_execution_source.v1`; Command annex §14. |
| Caller/handler | Direct formal source adapter or `IF-03` Consumer re-entry -> same command service; Consumer never calls the source Port itself. |
| Field sources | Caller/envelope supplies invocation and typed source candidate (event ID/version/authority/external ref/correlation/class/safe semantic input); handoff/precondition, source assessment/outcome/audit IDs, time/version and gap refs are application/Store/Port-derived. |
| Mapper/factory | `ExecutionSourceIntakeRequest::from_candidate`; `ExecutionSourceIntakePort::map_source`; `map_execution_source_resolution`; one of four `ToolInvocationOutcome::*`; `ToolAuditEntry::record`; `OutcomeAuditPair`; `map_outcome_audit_view`. |
| Store/Port seam | Pre-read invocation/handoff and existing pair; no-UoW source Port; one UoW `append_source_assessment`, `insert_outcome_audit_pair` when accepted, gaps, stored result/error. |
| Flow/version | `CF-11`; source event/version/authority/correlation are part of command digest; outcome/audit pair is indivisible. |
| Failure/replay | Forbidden body or envelope mismatch -> zero write; blocked/missing/conflicting/unverifiable mapping -> assessment/gap/error only; equal terminal pair replays; different terminal basis is `TerminalConflict/IntegrityCritical`. |
| Forbidden/parity | No raw capture/result/error body, Sandbox run truth, delivery/observation status, or source overwrite. Direct and IF-03 fake paths must use identical mapping and pair conflict behavior. |
| Reopen | Reopen if source semantic union, assessment symmetry, pair insertion or Consumer re-entry result carrier changes. |

### 2.12 `CF-12 PrepareSafeExternalHandoff`

| Card item | Exact closure |
|---|---|
| Canonical DTO | `PrepareSafeExternalHandoffRequest` -> `ToolCommandResponse<SafeExternalHandoffView>`; `tools.command.prepare_safe_external_handoff.v1`; Command annex §15. |
| Caller/handler | API/management -> command facade -> safe-handoff service; continuation worker receives only canonical committed material input. |
| Field sources | Caller supplies closed source selector, target class and sensitivity context; exact immutable source, four-gate assessment, eligibility/material/attempt IDs, local truth refs, time and commit versions are application/Store-derived. |
| Mapper/factory | `SafeHandoffEligibility::evaluate`; `SafeHandoffMaterial::prepare`; `SafeMaterialContinuationInput::from_committed_material`; `map_safe_external_handoff_view`. Event mapping and submit belong only to `OF-01~04`. |
| Store/Port seam | Pre-read exact source via named Stores; ineligible one-UoW eligibility/gap/error; eligible phase-1 UoW commits claim + eligibility + material; continuation uses `ExternalSubmissionStore::find_attempt_for_event/create_attempt/save_attempt` and `SafeEventCollaborationPort::submit`; phase-2 stores final view/error. |
| Flow/version | `CF-12`; truth/material commit precedes external continuation; local attempt state never means delivered/observed. |
| Failure/replay | Missing/wrong source or failed safety gate -> ineligible/error, no material; route blocked/local failure -> material survives with local attempt/gap; unknown side effect leaves claim incomplete/manual; duplicate never submits again. |
| Forbidden/parity | No event route/topic, external lifecycle, raw payload, rollback of committed source truth, or second collaboration call. Fake continuation and durable adapter share material/event identity and prepared-fence behavior. |
| Reopen | Reopen if source union, safety gate, material field, continuation key, or phase boundary changes. |

### 2.13 `CF-13 RecordConsistencyGapResolution`

| Card item | Exact closure |
|---|---|
| Canonical DTO | `RecordConsistencyGapResolutionRequest` -> `ToolCommandResponse<ConsistencyGapView>` or committed pending/error; `tools.command.record_consistency_gap_resolution.v1`; Command annex §16. |
| Caller/handler | Management/operations -> command facade -> integrity service. |
| Field sources | Caller supplies gap ID, typed owner/subject/locator/revision evidence and reason; gap state/version, evidence ref, owner re-read result, decision ref, time and replay refs are application/Store/Port-derived. |
| Mapper/factory | `GapResolutionEvidenceRef::from_input`; `ConsistencyGap::request_resolution/resolve`; typed subject router to existing Store/Port read; `GapResolutionDecisionRef::verified`; `map_gap_view`. |
| Store/Port seam | Pre-read `ProjectionStore::get_gap`; phase-1 UoW Open -> Pending; no-UoW owner verification through the existing subject Store/Port; phase-2 UoW CAS-saves gap and stores result/error. |
| Flow/version | `CF-13`; `Open -> ResolutionPending -> Resolved`; subject truth never changes. |
| Failure/replay | Body/alias/run/signoff evidence is unrepresentable; owner mismatch/blocked/unavailable/unverified leaves Pending with safe error; terminal/superseded/version conflict is typed; same key replays exact gap view/error. |
| Forbidden/parity | No source repair, evidence body, test/run/signoff claim, automatic retry or invented owner endpoint. Fake subject router must mirror durable verification and CAS outcomes. |
| Reopen | Reopen if a new subject kind, verification Port, evidence field, or transition is needed. |

## 3. Command cross-card audit

| Audit | Result / evidence |
|---|---|
| 13-to-13 DTO mapping | Pass. Every Command annex request has exactly one card and one `CF-*` flow. |
| Field provenance | Pass. Caller, Store, Port, application-generated and commit-derived fields are separated; no `ExpectedVersion` or result ID is caller-owned. |
| Seam closure | Pass. Every card names the existing Step 7 method set; no new Store/Port method is introduced. |
| Replay | Pass. `StoredCommandValue`/`StoredApplicationError` are the only historical result authority; external calls are never replayed. |
| Boundary | Pass. No agent loop, LLM planning, Runtime orchestration, capability registry truth, Sandbox isolation truth, Observability store, marketplace, or SDK client enters a protocol. |
| Reopen rule | Pass. Missing field/method/state cannot be filled by an implementation agent; it reopens the owning earlier Step. |

## 4. Query closure cards

### 4.0 Query common contract

| Item | Closed rule |
|---|---|
| Logical name | `tools.query.<snake_case_operation>.v1`. |
| Request authority | `QueryMetadata` supplies actor, consumer, request/correlation/trace and read time; request owns only target/filter/page. |
| Visibility order | Validate metadata -> read local owner/collection scope -> `ReadVisibilityResolverPort::resolve` -> read the exact Store bundle/page. No external authorization call. |
| Response authority | `ToolQueryResponse<T>` or `ToolPageResponse<T>` with explicit `QuerySurface`; `NotFound`, `NotVisible`, `Unavailable`, `Rebuilding`, and `Failed` never carry an inferred value. |
| Freshness | Truth views use `freshness=None`; D1 views carry source watermark/freshness from the same read. Stale is not silently converted to current. |
| Replay/read repeat | Queries have no idempotency claim and no stored historical result. Repeated equal reads may differ only by an explicitly returned local watermark; no write or external call is allowed. |
| Fake parity | Durable and fake Stores return the same bundle/page identity, watermark, cursor digest, visibility disposition and corruption errors; fake insertion order cannot define public order. |

### 4.1 `QF-01 GetToolContract`

| Card item | Exact closure |
|---|---|
| Canonical DTO | `GetToolContractRequest { tool_id }` -> `ToolQueryResponse<ToolContractView>`; `tools.query.get_tool_contract.v1`; Query annex §3. |
| Caller/handler | API Query handler -> `ToolQueryUseCases::execute(GetToolContract, QueryMetadata)` -> contract query service. |
| Field sources | Caller supplies `tool_id`; owner scope, contract/current-definition bundle, evolution head, committed version, gap refs and visibility come from local Store/visibility resolver. |
| Mapper/factory | Pure `map_contract_view(ContractViewInput)`; no domain factory and no source refresh. |
| Store/Port seam | `ToolContractStore::get_contract_owner_scope`, `ReadVisibilityResolverPort::resolve`, `ToolContractStore::get_current_bundle`; no UoW/Port write. |
| Flow/surface | `QF-01`; symmetric bundle -> `Found`; missing owner -> `NotFound`; forbidden -> `NotVisible`; Store/resolver failure -> `Unavailable`. |
| Failure/replay | Bundle identity/version mismatch -> `IntegrityFailure`; no value for non-readable surfaces; repeated query is a fresh read, not historical replay. |
| Forbidden/parity | No Hub/Core source resolve, authorization decision, Runtime status, refresh, repair, or raw definition body. Fake must preserve owner-first visibility and bundle symmetry. |
| Reopen | Reopen if the current bundle fields, visibility input, or mapper source changes. |

### 4.2 `QF-02 CompareToolDefinitionRevisions`

| Card item | Exact closure |
|---|---|
| Canonical DTO | `CompareToolDefinitionRevisionsRequest { tool_id, base_revision, target_revision }` -> `ToolQueryResponse<ToolContractDiffView>`; `tools.query.compare_tool_definition_revisions.v1`; Query annex §4. |
| Caller/handler | API Query handler -> query facade -> direct definition comparison service. |
| Field sources | Caller supplies tool and directional revision pair; both definitions, optional matching impact, read watermark and stable diff ID are Store/application-derived. |
| Mapper/factory | Pure `ToolContractDiffSummary::compare`; `map_compatibility_impact_view`/diff mapper; no persistence factory. |
| Store/Port seam | `ToolContractStore::get_definition_comparison_bundle`; visibility resolver over contract owner; zero UoW and zero external Port. |
| Flow/surface | `QF-02`; equal pair/invalid pair -> `InvalidInput`; absent side -> `NotFound`; valid pair -> `Found/Fresh` at bundle watermark. |
| Failure/replay | Pair/impact/watermark mismatch -> `IntegrityFailure`; Store/visibility failure -> `Unavailable`; never saves or approves the computed diff. |
| Forbidden/parity | Must not call `ProjectionStore::get_diff_summary`, adopt a revision, or infer provider/consumer impact beyond stored local semantics. Fake preserves directional pair and pure-compute behavior. |
| Reopen | Reopen if direct comparison needs a new object field or a write/projection fallback. |

### 4.3 `QF-03 GetCapabilityBinding`

| Card item | Exact closure |
|---|---|
| Canonical DTO | `GetCapabilityBindingRequest { selector, assessment }` -> `ToolQueryResponse<CapabilityBindingView>`; `tools.query.get_capability_binding.v1`; Query annex §5. |
| Caller/handler | API Query handler -> binding query service. |
| Field sources | Caller supplies explicit `ByBindingId`/`CurrentByToolId` and assessment selection; relation, owner scope, selected assessment/snapshot, visible gaps, version and visibility are local reads. `None` means no assessment requested, not unbound. |
| Mapper/factory | Pure `map_binding_view(BindingViewInput)` with exact relation/snapshot/assessment symmetry. |
| Store/Port seam | `CapabilityBindingStore::get_binding` or `find_current_by_tool`, `get_binding_owner_scope`, selected assessment/snapshot reads, `ReadVisibilityResolverPort::resolve`, bounded `ProjectionStore::list_gaps`; no Hub Port. |
| Flow/surface | `QF-03`; missing selector subject -> `NotFound`; explicit-unbound is a visible binding value; non-visible/unavailable are typed no-value surfaces. |
| Failure/replay | Alien assessment/snapshot, multiple current relations, or incomplete ref set -> `IntegrityFailure`; no latest-by-arrival fallback. |
| Forbidden/parity | No Hub refresh, relation mutation, invocation-anchor rewrite, capability registry body, or null-to-unbound inference. Durable/fake share selector and exact-assessment rules. |
| Reopen | Reopen if selector, assessment selection, binding view, or gap page changes. |

### 4.4 `QF-04 GetToolInvocation`

| Card item | Exact closure |
|---|---|
| Canonical DTO | `GetToolInvocationRequest { invocation_id }` -> `ToolQueryResponse<ToolInvocationView>`; `tools.query.get_tool_invocation.v1`; Query annex §6. |
| Caller/handler | API Query handler -> invocation query service. |
| Field sources | Caller supplies invocation ID; owner scope, invocation read bundle, immutable admission, optional local outcome ref, gaps and visibility are Store/resolver-derived. |
| Mapper/factory | Pure `map_invocation_view(InvocationViewInput)`; no outcome synthesis. |
| Store/Port seam | `ToolInvocationStore::get_invocation_owner_scope`, `ReadVisibilityResolverPort::resolve`, `ToolInvocationStore::get_invocation_read_bundle`; optional local gap read only. |
| Flow/surface | `QF-04`; visible invocation without outcome returns value with `outcome_ref=None`; missing/not-visible/unavailable use explicit surfaces. |
| Failure/replay | Bundle/admission/outcome-ref mismatch -> `IntegrityFailure`; no result/error body is reconstructed; repeated query has no command replay semantics. |
| Forbidden/parity | No Runtime/Sandbox body/status, execution recovery, external lookup or admission change. Fake uses the same immutable bundle and missing-outcome behavior. |
| Reopen | Reopen if invocation bundle or outcome-ref ownership changes. |

### 4.5 `QF-05 GetExecutionPreconditionView`

| Card item | Exact closure |
|---|---|
| Canonical DTO | `GetExecutionPreconditionViewRequest { invocation_id }` -> `ToolQueryResponse<ExecutionPreconditionView>`; `tools.query.get_execution_precondition_view.v1`; Query annex §7. |
| Caller/handler | API Query handler -> precondition query service. |
| Field sources | Caller supplies invocation ID; invocation admission context, requirement, authorization assessment, Sandbox readiness snapshot, latest handoff/attempt, optional no-execution outcome, gaps and one watermark come from local bundles. |
| Mapper/factory | Pure `map_precondition_view(PreconditionViewInput)`; no Port resolution or assessment factory. |
| Store/Port seam | Invocation owner/bundle reads, visibility resolver, `ExecutionHandoffStore::get_precondition_read_bundle`, `OutcomeAuditStore::get_outcome_audit_pair` only for local no-execution ref; zero external Port. |
| Flow/surface | `QF-05`; no evaluation yet is `Found` with optional fields empty and admission context; invalid refs -> `IntegrityFailure`. |
| Failure/replay | Incomparable local read frame, alien requirement/assessment/readiness/handoff/attempt/outcome -> integrity; unavailable -> no-value `Unavailable`. |
| Forbidden/parity | No authorization/Sandbox refresh, allow inference, Runtime planning or handoff mutation. Fake/durable bundles must agree on optional-empty symmetry. |
| Reopen | Reopen if a precondition component or local bundle method is added/removed. |

### 4.6 `QF-06 GetOutcomeAudit`

| Card item | Exact closure |
|---|---|
| Canonical DTO | `GetOutcomeAuditRequest { invocation_id }` -> `ToolQueryResponse<OutcomeAuditView>`; `tools.query.get_outcome_audit.v1`; Query annex §8. |
| Caller/handler | API Query handler -> outcome/audit query service. |
| Field sources | Caller supplies invocation ID; indivisible outcome/audit pair, source assessment, eligibility/material/attempt, Bus/Observation refs, gaps, safe-handoff state and visibility are local Store reads. |
| Mapper/factory | Pure `map_outcome_audit_view(OutcomeAuditViewInput)`; pair must be atomic before mapping. |
| Store/Port seam | Invocation/bundle read; `OutcomeAuditStore::get_outcome_audit_pair`; `ExternalSubmissionStore::find_eligibility/get_material/find_attempt_for_event`; bounded `ProjectionStore::list_gaps`; no feedback Port. |
| Flow/surface | `QF-06`; existing nonterminal invocation without pair -> visible `Empty`; complete pair -> `Found`; half pair/conflicting refs -> integrity. |
| Failure/replay | Missing local peripheral rows remain explicit optional refs; conflicting latest status is degraded typed view or integrity per mapper, never inferred success. |
| Forbidden/parity | No external delivery/observation refresh, result/error/audit body, or attempt mutation. Fake pair atomicity and optional-status semantics match durable. |
| Reopen | Reopen if pair, material, attempt, or external-status source mapping changes. |

### 4.7 `QF-07 GetReferenceConsistencyReport`

| Card item | Exact closure |
|---|---|
| Canonical DTO | `GetReferenceConsistencyReportRequest { scope, requested_watermark }` -> `ToolQueryResponse<ReferenceConsistencyReportView>`; `tools.query.get_reference_consistency_report.v1`; Query annex §9. |
| Caller/handler | API/operations Query handler -> projection query service. |
| Field sources | Caller supplies bounded inspection scope and optional watermark; deterministic report key, report row, assessment/gap refs, counts, state, generated time and source watermark are ProjectionStore-derived. |
| Mapper/factory | Pure `map_reference_consistency_report_view`; no report generation. |
| Store/Port seam | Visibility resolver over scope; `ProjectionStore::get_consistency_report`; zero UoW and zero source Port. |
| Flow/surface | `QF-07`; Current/Partial -> `Found` with explicit gaps; Stale -> `Stale` with safe report; Failed -> no report body beyond safe refs; missing -> `Empty`. |
| Failure/replay | Scope overreach, key/watermark/schema mismatch -> `InvalidInput/IntegrityFailure`; no automatic rebuild or gap resolution. |
| Forbidden/parity | No scan of assessments/gaps, external integrity check, evidence/run/signoff claim, or report refresh. Fake key and state mapping equal durable. |
| Reopen | Reopen if report key, watermark comparability, or projection state changes. |

### 4.8 `QF-08 SearchToolContracts`

| Card item | Exact closure |
|---|---|
| Canonical DTO | `SearchToolContractsRequest { filter, page }` -> `ToolPageResponse<ToolContractSearchItem>`; `tools.query.search_tool_contracts.v1`; Query annex §10. |
| Caller/handler | API Query handler -> search projection service. |
| Field sources | Caller supplies safe text, operation/lifecycle/binding filters and bounded page request; canonical filter digest, visibility, projection rows, source watermark, item freshness and opaque cursor are application/ProjectionStore-derived. |
| Mapper/factory | Filter canonicalizer; pure `map_contract_search_item`; public cursor encoder/decoder validates operation/schema/filter digest/watermark. |
| Store/Port seam | Collection visibility resolver; `ProjectionStore::search_tool_contracts` with repository page/cursor; no T1 fallback, UoW or external Port. |
| Flow/surface | `QF-08`; visible empty -> `Empty` with no items; fresh -> `Found`; stale projection/page -> `Stale`; rebuilding/unavailable/failed -> empty items/no cursor. |
| Failure/replay | Unsafe text, enum/limit/cursor mismatch -> typed invalid/cursor error; row identity/order/watermark mismatch -> integrity; no truncation of required refs. |
| Forbidden/parity | No provider inventory, raw definitions, marketplace, policy, Runtime/SDK plan, or hidden list scan. Durable/fake stable order is `(normalized label, tool_id)` and cursor digest identical. |
| Reopen | Reopen if filter field, public order, cursor frame, or projection method changes. |

### 4.9 `QF-09 CompareToolContracts`

| Card item | Exact closure |
|---|---|
| Canonical DTO | `CompareToolContractsRequest { tool_id, base_revision, target_revision, requested_watermark }` -> `ToolQueryResponse<ToolContractDiffView>`; `tools.query.compare_tool_contracts.v1`; Query annex §11. |
| Caller/handler | API Query handler -> D1 diff read service. |
| Field sources | Caller supplies tool/revision pair/watermark; deterministic `ToolContractDiffKey`, stored projection, freshness and source watermark come from ProjectionStore. |
| Mapper/factory | Pure stored-diff-to-view mapper; never calls direct comparison factory. |
| Store/Port seam | Visibility resolver; `ProjectionStore::get_diff_summary`; zero UoW/external Port. |
| Flow/surface | `QF-09`; missing projection -> `Empty`; fresh -> `Found`; stale may return safe value with `Stale`; rebuilding/unavailable/failed carry no value. |
| Failure/replay | Pair/key/schema/watermark mismatch -> integrity; no projection rebuild or fallback to `QF-02`. |
| Forbidden/parity | No direct computation, adoption, mutation, provider/consumer enumeration or current-truth fallback. Fake/durable distinguish this protocol from QF-02 exactly. |
| Reopen | Reopen if D1 diff key, freshness or stored-view schema changes. |

### 4.10 `QF-10 GetToolDiagnostic`

| Card item | Exact closure |
|---|---|
| Canonical DTO | `GetToolDiagnosticRequest { subject_ref, requested_watermark }` -> `ToolQueryResponse<ToolDiagnosticView>`; `tools.query.get_tool_diagnostic.v1`; Query annex §12. |
| Caller/handler | API/operations Query handler -> diagnostic projection service. |
| Field sources | Caller supplies typed subject and optional watermark; deterministic diagnostic key, stored summary, local attempt/assessment/gap safe summaries, freshness and watermark come from ProjectionStore/local read authority. |
| Mapper/factory | Pure `map_tool_diagnostic_view`; current v1 is repository-first, not live aggregation. |
| Store/Port seam | Subject visibility resolver; `ProjectionStore::get_diagnostic_summary`; no UoW, source Port, live recovery or rebuild. |
| Flow/surface | `QF-10`; missing -> `Empty`; fresh/stale -> corresponding safe value; rebuilding/unavailable/failed -> no value. |
| Failure/replay | Unknown subject kind/key/watermark/schema mismatch -> invalid/integrity; no body or backend detail leaks. |
| Forbidden/parity | Diagnostic is not health/readiness, Runtime recovery, policy decision, evidence, or external lifecycle. Fake key/freshness behavior matches durable. |
| Reopen | Reopen if direct-derivation mode is ever enabled or diagnostic fields/Store method change. |

### 4.11 `QF-11 GetToolConsumerGuidance`

| Card item | Exact closure |
|---|---|
| Canonical DTO | `GetToolConsumerGuidanceRequest { tool_id, definition_revision, consumer_kind, requested_watermark }` -> `ToolQueryResponse<ToolConsumerGuidanceView>`; `tools.query.get_tool_consumer_guidance.v1`; Query annex §13. |
| Caller/handler | API/future SDK consumer -> Query facade -> guidance projection service; SDK client is not owned by L2. |
| Field sources | Caller supplies tool, optional revision, consumer kind and watermark; metadata consumer must match; resolved revision/key, guidance projection, freshness, gaps and watermark are local projection/visibility fields. |
| Mapper/factory | Pure `map_consumer_guidance_view`; no plan/client/auth/readiness factory. |
| Store/Port seam | `ToolContractStore::get_contract_owner_scope`, visibility resolver, `ProjectionStore::get_consumer_guidance`; zero UoW/external Port. |
| Flow/surface | `QF-11`; consumer mismatch -> invalid; missing projection -> `Empty`; fresh/stale/rebuilding/unavailable/failed map explicitly. |
| Failure/replay | Revision/key/consumer/watermark/freshness mismatch or executable material -> integrity; repeated query is no-write. |
| Forbidden/parity | No SDK wrapper/code, Runtime plan, LLM planning, authorization decision, Sandbox readiness or marketplace listing. Fake/durable consumer equality and projection key must match. |
| Reopen | Reopen if consumer guidance fields, SDK seam, or projection key changes. |

## 5. Query cross-card audit

| Audit | Result / evidence |
|---|---|
| 11-to-11 DTO mapping | Pass. Each Query annex schema has one card and one `QF-*` flow. |
| Direct/projection compare split | Pass. QF-02 computes a directional direct diff; QF-09 reads a D1 stored diff and never falls back. |
| Zero-write proof | Pass. No card begins a UoW, calls an external Port, refreshes a source, rebuilds a projection, or resolves a gap. |
| Visibility/freshness | Pass. Owner/collection visibility precedes reads; stale, rebuilding, unavailable, failed, empty and not-visible are distinct. |
| Cursor/page | Pass. Public cursor is opaque and bound to operation/schema/filter/watermark; repository cursor never leaks. |
| Reopen rule | Pass. Missing view field, projection key, page method, or degradation state reopens the owning object/Port/protocol Step. |

## 6. Inbound Consumer closure cards

### 6.0 Consumer common contract

| Item | Closed rule |
|---|---|
| Logical name | `tools.inbound.<snake_case_event>.v1`; physical source/topic/group/ack remains outside L2. |
| Envelope authority | `InboundEventEnvelope<T>` owns source event ID, dedup key, source actor/authority, schema, correlation/trace, ordering and times. Payload never repeats them. |
| Digest/idempotency | Scope is `(consumer, source_authority_ref, source_event_id, deduplication_key)`; canonical payload participates; `received_at` does not. Equal committed input replays exact receipt; different digest conflicts. |
| Phase fence | Validate envelope/body -> phase-1 claim UoW commit -> named observational Port or formal Command -> phase-2 local effects + receipt + claim completion. `IF-03` uses a separate CF-11 UoW. |
| Receipt | `ConsumerReceipt` is a local result, never broker acknowledgement, retry count, DLQ locator, run ID, or delivery receipt. In-flight claim returns retry-same-input, not a fabricated delayed receipt. |
| Fake parity | Durable and fake adapters preserve source/authority/version/correlation/body guards, one-page bounded reverse lookup, claim phases, append equality and no duplicate external calls. |

### 6.1 `IF-01 ConsumeHubCapabilityChangeClue`

| Card item | Exact closure |
|---|---|
| Canonical DTO | `InboundEventEnvelope<HubCapabilityChangeCluePayload>` -> `ConsumerReceipt`; `tools.inbound.consume_hub_capability_change_clue.v1`; Consumer annex §3. |
| Caller/handler | Worker source adapter -> `InboundConsumerUseCases::consume` -> Hub clue consumer service. |
| Field sources | Payload supplies typed capability ref, previous/current revision, change class and safe summary; envelope supplies source authority/event/correlation/order/time; local affected-binding page, snapshot/assessment/gap IDs/time are Store/Port/application fields. |
| Mapper/factory | `HubCapabilityChangeClueInput::from_validated_envelope`; `HubControlledSnapshot::from_port`; `CapabilityBindingAssessment::assess`; gap factory; `receipt_for_effect`. |
| Store/Port seam | Phase-1 `IdempotencyStore::reserve`/commit; no-UoW `HubControlledSourcePort::validate_change_clue`; bounded `CapabilityBindingStore::list_bindings_by_hub_capability`; phase-2 `CapabilityBindingStore::append_snapshot/append_assessment`, `ProjectionStore::create_gap`, receipt/result completion. |
| Flow/version | `IF-01`; one bounded reverse page; next page is a typed propagation gap and Job continuation, not an unbounded Consumer loop. |
| Failure/replay | Unsupported/unauthorized/body conflict -> reject/quarantine; blocked source with attributable clue -> gap/assessment; unavailable before effect -> rollback and retry hint; equal committed envelope -> exact duplicate receipt, zero Port calls. |
| Forbidden/parity | No Binding replace/invalidate, Hub registry mutation, old anchor rewrite, broker ack/DLQ, or raw capability body. Fake and durable use same clue/result symmetry and page continuation. |
| Reopen | Reopen if clue payload, source Port method, reverse lookup key, local result ref, or receipt disposition changes. |

### 6.2 `IF-02 ConsumeAuthorizationResultChangeClue`

| Card item | Exact closure |
|---|---|
| Canonical DTO | `InboundEventEnvelope<AuthorizationResultChangeCluePayload>` -> `ConsumerReceipt`; `tools.inbound.consume_authorization_result_change_clue.v1`; Consumer annex §4. |
| Caller/handler | Worker source adapter -> consumer facade -> authorization clue service. |
| Field sources | Payload supplies external result ID, subject ref, revision, change class and safe summary; envelope supplies authority/event/correlation/time; assessment/gap IDs and consumed time are local. |
| Mapper/factory | `AuthorizationResultChangeClueInput::from_validated_envelope`; `ReferenceValidityAssessment::from_blocked_resolution`; gap factory; `receipt_for_effect`. |
| Store/Port seam | Phase-1 claim; no-UoW `AuthorizationConsumptionPort::validate_change_clue`; bounded `ExecutionHandoffStore::list_authorization_assessments_by_result`; phase-2 `ProjectionStore::append_reference_assessment/create_gap`, receipt and claim completion. |
| Flow/version | `IF-02`; source owner remains open under `L2T-UP-001/002`; v1 records conservative blocked assessment/gap, never an allow. |
| Failure/replay | Missing attribution -> reject/blocked with no target write; blocked/unverifiable attributable clue -> GapRecorded; equal digest replays exact receipt; differing digest quarantines/conflicts. |
| Forbidden/parity | No authorization decision, policy evaluation, prior assessment rewrite, evidence body, or source refresh fallback. Fake must expose the same blocked production path and safe negative mappings. |
| Reopen | Reopen when authorization owner/schema/source is closed or payload requires a positive decision field. |

### 6.3 `IF-03 ConsumeSandboxExecutionSource`

| Card item | Exact closure |
|---|---|
| Canonical DTO | `InboundEventEnvelope<SandboxExecutionSourcePayload>` -> `ConsumerReceipt`; `tools.inbound.consume_sandbox_execution_source.v1`; Consumer annex §5. |
| Caller/handler | Worker source adapter -> Consumer facade; derives integration `CommandMetadata` and re-enters only `CF-11`. |
| Field sources | Payload supplies invocation/external execution ref/handoff correlation/source class/revision/safe semantic input; envelope supplies source event/version/authority/correlation/time; CF-11 supplies source assessment/outcome/audit IDs and stored result refs. |
| Mapper/factory | `AcceptExecutionSourceRequest::from_validated_envelope`; `InboundEventEnvelope::derive_integration_command_metadata`; CF-11 canonical source mapping/outcome/audit factories; `receipt_for_command_result`. |
| Store/Port seam | Phase-1 Consumer claim commit; CF-11 owns no-UoW `ExecutionSourceIntakePort::map_source` and its own local UoW; separate phase-2 Consumer UoW stores exact receipt and completes claim. |
| Flow/version | `IF-03`; Consumer and CF-11 UoWs cannot be merged; same derived command key replays CF-11 after crash without a second source mapping call. |
| Failure/replay | Transient CF-11 result leaves claim incomplete and no receipt; committed command error/value maps exact refs; duplicate envelope replays receipt without CF-11 re-entry. |
| Forbidden/parity | Consumer never calls source Port directly, writes outcome/audit, accepts a run/receipt, or infers outcome from source presence. Fake direct/consumer paths share command digest and pair semantics. |
| Reopen | Reopen if derived metadata, command result carrier, source semantic union, or two-UoW boundary changes. |

### 6.4 `IF-04 ConsumeBusDeliveryStatusFeedback`

| Card item | Exact closure |
|---|---|
| Canonical DTO | `InboundEventEnvelope<BusDeliveryStatusFeedbackPayload>` -> `ConsumerReceipt`; `tools.inbound.consume_bus_delivery_status_feedback.v1`; Consumer annex §6. |
| Caller/handler | Worker feedback adapter -> consumer facade -> Bus status consumer. |
| Field sources | Payload supplies local attempt ID, external locator/ref, closed safe status and feedback revision; envelope supplies source authority/event/correlation/time; formal Bus authority/attempt/correlation validation and status/gap IDs are Port/application-derived. |
| Mapper/factory | `BusDeliveryFeedbackRequest::ValidateInbound`; `BusDeliveryStatusRef::from_safe_resolution`; gap factory; `receipt_for_effect`. |
| Store/Port seam | Phase-1 claim; `ExternalSubmissionStore::get_attempt`; no-UoW `SafeEventCollaborationPort::resolve_bus_delivery`; phase-2 `ExternalSubmissionStore::append_bus_status`, `ProjectionStore::create_gap`, receipt completion. |
| Flow/version | `IF-04`; status is an independent local reference; it never changes submission attempt/outcome/audit. |
| Failure/replay | Mismatched attempt/locator/revision -> quarantine/conflict, no append; blocked/unavailable attributable source -> gap; equal envelope replays exact receipt. |
| Forbidden/parity | No Bus delivery truth, broker ack, route polling, retry/DLQ, or local SubmittedLocally -> delivered inference. Fake and durable validate same status authority and attempt symmetry. |
| Reopen | Reopen when Bus producer/source/route/feedback contract closes or status fields change. |

### 6.5 `IF-05 ConsumeObservationStatusFeedback`

| Card item | Exact closure |
|---|---|
| Canonical DTO | `InboundEventEnvelope<ObservationStatusFeedbackPayload>` -> `ConsumerReceipt`; `tools.inbound.consume_observation_status_feedback.v1`; Consumer annex §7. |
| Caller/handler | Worker feedback adapter -> consumer facade -> Observation status consumer. |
| Field sources | Payload supplies attempt, optional locator/material ref, closed observation status, source and route revisions; envelope supplies authority/event/correlation/time; formal observation validation and status/gap IDs are Port/application-derived. |
| Mapper/factory | `ObservationFeedbackRequest::ValidateInbound`; `ObservationMaterialRef::from_safe_resolution`; gap factory; `receipt_for_effect`. |
| Store/Port seam | Phase-1 claim; `ExternalSubmissionStore::get_attempt`; no-UoW `SafeEventCollaborationPort::resolve_observation`; phase-2 `append_observation_status`, `ProjectionStore::create_gap`, receipt completion. |
| Flow/version | `IF-05`; observation status remains independent from Bus status and local attempt/outcome/audit. |
| Failure/replay | Route/source/attempt mismatch -> quarantine/conflict; blocked/unavailable attributable feedback -> typed gap; equal digest replays receipt with zero Port calls. |
| Forbidden/parity | No observability store, body/retention/evidence/alert, observed-result claim, or Runtime recovery. Fake/durable preserve absent-material and route revision checks. |
| Reopen | Reopen when Observability producer/source/route/status contract closes or the payload needs a new field. |

## 7. Outbound Event closure cards

### 7.0 Event common contract

| Item | Closed rule |
|---|---|
| Logical name | `tools.event.<snake_case_event>.v1`; semantic event is transport-neutral. |
| Source authority | One committed immutable `SafeHandoffMaterial` class and exact `source_truth_refs`; pure mapper creates event envelope. |
| Identity | `ToolEventId::derive(event_name, schema_version, material_id, canonical_source_truth_refs)`; same material/event/target reuses identity; semantic change requires new schema version. |
| Fence | `ExternalSubmissionAttempt::prepare(...)` persists event ID/name/schema/material/target before phase-1 commit; exactly one `SafeEventCollaborationPort::submit` after commit; phase 2 records local disposition. Prepared/unknown never authorize automatic resubmit. |
| Payload | Body-free safe summaries and typed refs only; no route/topic/partition/retry/DLQ/receipt/observation/delivery field. |
| Fake parity | Fake collaboration tracks `(material_id,event_id,target_class)`, rejects a second call, and returns the same local disposition/unknown mapping as the blocked/durable adapter. |

### 7.1 `OF-01 ToolContractChanged`

| Card item | Exact closure |
|---|---|
| Canonical DTO | `ToolEventEnvelope<ToolContractChangedPayload>`; `tools.event.tool_contract_changed.v1`; Event annex §3. |
| Caller/handler | Worker -> `SafeMaterialContinuationUseCases::continue_material(SafeMaterialContinuationInput)` -> event mapper -> continuation service. |
| Field sources | Material carries committed evolution fact ref, change kind, revision pair/lifecycle/reason summary; event ID/schema/material/correlation/time are derived; no current contract reread. |
| Mapper/factory | `map_tool_semantic_event_from_material` closed `ContractChange` branch; `ToolContractChangedPayload` mapper; `ExternalSubmissionAttempt::prepare`. |
| Store/Port seam | `ExternalSubmissionStore::get_material/find_attempt_for_event/create_attempt/save_attempt`; phase-1/2 UoW; one collaboration submit. |
| Flow/version | `OF-01`; event source is exact evolution fact -> material -> envelope. |
| Failure/replay | Missing/material-source mismatch/schema mismatch -> integrity/blocked, no attempt; existing terminal/prepared/unknown attempt returns stored/manual view, zero Port calls; submit ambiguity -> `SubmissionOutcomeUnknown`. |
| Forbidden/parity | No full definition, provider/consumer list, contract mutation, route/delivery claim, or hidden retry. Fake and durable event identity/source symmetry match. |
| Reopen | Reopen if evolution material fields, event payload/source identity, attempt method, or collaboration result changes. |

### 7.2 `OF-02 CapabilityBindingChanged`

| Card item | Exact closure |
|---|---|
| Canonical DTO | `ToolEventEnvelope<CapabilityBindingChangedPayload>`; `tools.event.capability_binding_changed.v1`; Event annex §4. |
| Caller/handler | Worker continuation -> closed material class mapper -> collaboration continuation. |
| Field sources | Material carries either formal Binding change fact or binding-scoped gap, never both; payload subject branch, mode/reason, event identity and refs are derived from that immutable source. |
| Mapper/factory | Closed `FormalChange`/`ConsistencyGap` mapper; `ToolEventId::derive`; `ExternalSubmissionAttempt::prepare`. |
| Store/Port seam | Same ExternalSubmissionStore/continuation UoWs and one collaboration submit as OF-01; no Binding Store write or Hub Port read. |
| Flow/version | `OF-02`; source variant is exclusive and successor ID appears only for replacement. |
| Failure/replay | Subject/source mismatch, illegal gap transition or event collision -> integrity/no attempt; duplicate/prepared/unknown -> stored/manual no call; local route failure maps attempt/gap only. |
| Forbidden/parity | No relation mutation, Hub registry lookup, invocation anchor rewrite, delivery/observation state, or route selection. Fake preserves exclusive subject variants. |
| Reopen | Reopen if formal/gap source union or payload variant changes. |

### 7.3 `OF-03 ToolOutcomeAuditMaterialAvailable`

| Card item | Exact closure |
|---|---|
| Canonical DTO | `ToolEventEnvelope<ToolOutcomeAuditMaterialAvailablePayload>`; `tools.event.tool_outcome_audit_material_available.v1`; Event annex §5. |
| Caller/handler | Worker continuation -> outcome/audit material mapper -> collaboration continuation. |
| Field sources | Material carries exact indivisible outcome/audit pair refs, invocation/anchor/source/gap refs and target; payload never carries result/error/audit body. |
| Mapper/factory | `map_tool_semantic_event_from_material` `OutcomeAudit` branch; payload symmetry validator; `ExternalSubmissionAttempt::prepare`. |
| Store/Port seam | Material/attempt reads and writes plus one `SafeEventCollaborationPort::submit`; no OutcomeAuditStore mutation after material commit. |
| Flow/version | `OF-03`; pair and material refs must match exactly before attempt creation. |
| Failure/replay | Missing/half pair, material/eligibility mismatch or source refs mismatch -> integrity/no attempt; duplicate terminal/prepared/unknown -> no call; local submit ambiguity stays manual. |
| Forbidden/parity | No raw result/error/audit body, outcome update, external delivery/observation/acceptance claim. Fake enforces pair atomicity and exact source refs. |
| Reopen | Reopen if pair schema, material class, payload field, or attempt source changes. |

### 7.4 `OF-04 ToolConsistencyGapChanged`

| Card item | Exact closure |
|---|---|
| Canonical DTO | `ToolEventEnvelope<ToolConsistencyGapChangedPayload>`; `tools.event.tool_consistency_gap_changed.v1`; Event annex §6. |
| Caller/handler | Worker continuation -> gap material mapper -> collaboration continuation. |
| Field sources | Material carries one committed gap transition and exact subject/basis/evidence locator refs; previous/current state, impact, event identity and time derive from material. |
| Mapper/factory | Closed gap transition validator; `ToolEventId::derive`; `ExternalSubmissionAttempt::prepare`. |
| Store/Port seam | ExternalSubmissionStore material/attempt methods, phase fences, one collaboration submit; no `ProjectionStore::save_gap` in continuation. |
| Flow/version | `OF-04`; only allowed gap transitions are encoded; event does not resolve/repair the gap. |
| Failure/replay | Illegal transition/source mismatch/collision -> integrity/no attempt; existing attempt/manual state replays without call; route blocked/unknown remains local attempt/gap. |
| Forbidden/parity | No evidence body, health claim, gap repair, route/retry/DLQ/observation lifecycle. Fake/durable transition validation and attempt identity match. |
| Reopen | Reopen if gap transition set, material source refs, event payload, or collaboration method changes. |

## 8. Operations Job closure cards

### 8.0 Job common contract

| Item | Closed rule |
|---|---|
| Logical name | `tools.job.<snake_case_action>.v1`; physical scheduler, cron, lease, queue, run, retry and deployment binding are outside this protocol. |
| Entry authority | One-shot binary -> `ToolJobUseCases::run(ToolJobRequest, JobMetadata)`. `JobMetadata` owns system actor, job key, correlation/trace, requested time and source watermark. |
| Slice | `JobSlice { cursor, limit }` is positive and bounded. Cursor binds job name, body digest, schema, watermark and stable position; no unbounded all-scan. |
| Writes | Only named assessment/gap/report/projection/status refs are allowed. Jobs never repair core subjects, execute invocations, adopt definitions, or publish events. |
| Replay | Same `(job, system authority, job key, body digest)` returns the stored `JobReport` as `NoOpDuplicate`; no rescan or external Port call. Different digest under same key conflicts. |
| Fake parity | Durable/fake use identical stable target ordering, cursor validation, per-target UoW/commit resolution, output refs/counts, partial/blocked mapping, and no-repair boundary. |

### 8.1 `JF-01 CheckCapabilityBindingConsistency`

| Card item | Exact closure |
|---|---|
| Canonical DTO | `CheckCapabilityBindingConsistencyRequest { scope, slice }` -> `JobReport`; `tools.job.check_capability_binding_consistency.v1`; Job annex §3. |
| Caller/handler | One-shot operations binary -> job facade -> binding consistency service. |
| Field sources | Caller supplies bounded tool IDs/state set/explicit-unbound flag/cursor/limit; JobMetadata supplies operation scope and watermark; bindings, Hub candidate/result, assessment/gap/report IDs and counts are Store/Port/application-derived. |
| Mapper/factory | Stable target planner `(tool_id,binding_id)`; `HubControlledSourceRequest` for bound rows; `CapabilityBindingAssessment::assess`; gap/report constructors; `JobReport` mapper. |
| Store/Port seam | `CapabilityBindingStore` bounded binding read/page; bound-only `HubControlledSourcePort::resolve_snapshot`; target-level UoW appends snapshot/assessment/gap; `ProjectionStore` report; `IdempotencyStore::store_job_report`. |
| Flow/version | `JF-01`; explicit-unbound is checked locally with no Hub call; blocked Hub produces typed partial/blocked report, never an active bound relation. |
| Failure/replay | Missing/unavailable source -> per-target gap and `Partial/Blocked`; local commit unknown resolves before next target; duplicate report replays exact counts/output refs/cursor. |
| Forbidden/parity | No Binding declaration/replacement/invalidation, registry scan, relation repair, or global unbounded scan. Fake preserves target order and explicit-unbound bypass. |
| Reopen | Reopen if binding scope, Hub source method, report output ref, or target ordering changes. |

### 8.2 `JF-02 CheckReferenceIntegrity`

| Card item | Exact closure |
|---|---|
| Canonical DTO | `CheckReferenceIntegrityRequest { inspection_scope, target_kinds, slice }` -> `JobReport`; `tools.job.check_reference_integrity.v1`; Job annex §4. |
| Caller/handler | Operations binary -> job facade -> reference integrity service. |
| Field sources | Caller supplies bounded scope, typed target-kind set, cursor/limit; JobMetadata supplies source watermark/scope; typed subject refs, matching Store/Port result, assessment/gap/report refs and counts are application-derived. |
| Mapper/factory | Stable target order `(kind ordinal, subject ref, assessed ref)`; `ReferenceValidityAssessment::from_resolution`; gap/report factory; JobReport mapper. |
| Store/Port seam | Named Stores read at requested watermark; matching existing external Port by closed target kind; target-level UoW appends assessment/gap; ProjectionStore writes report; stored report replay. |
| Flow/version | `JF-02`; absence during bounded scan does not close a gap; unknown/unavailable source remains explicit. |
| Failure/replay | Authority mismatch, source blocked/unavailable, stale read or local conflict -> typed assessment/gap and partial report; no subject mutation; duplicate does not rescan. |
| Forbidden/parity | No external registry truth, evidence/run/signoff, source repair, or inferred validity from missing data. Fake and durable target ordering and conservative mapping match. |
| Reopen | Reopen if target kind enum, inspection scope, source selection, or assessment/report fields change. |

### 8.3 `JF-03 RebuildToolDerivedViews`

| Card item | Exact closure |
|---|---|
| Canonical DTO | `RebuildToolDerivedViewsRequest { scope, slice }` -> `JobReport`; `tools.job.rebuild_tool_derived_views.v1`; Job annex §5. |
| Caller/handler | Operations binary -> job facade -> projection rebuild service. |
| Field sources | Caller supplies bounded tool/view/consumer/revision scope and slice; watermark, complete truth bundle, projection identity/write result, gap refs and counts derive from local Stores/application. |
| Mapper/factory | Stable union target planner; pure Step 6 projectors for search/diff/diagnostic/guidance/report; compare-write mapper to projection Store. |
| Store/Port seam | Truth Store bundle reads at requested watermark; `ProjectionStore` compare-write per target; no external Port; target-level UoW then final durable report UoW as defined by Step 9. |
| Flow/version | `JF-03`; `Applied`/`AlreadyCurrent` are local projection dispositions; stale/conflict/unavailable is explicit partial/failed output. |
| Failure/replay | Missing complete source bundle or watermark conflict -> typed target output/gap; no fallback to live aggregation; duplicate report never rebuilds. |
| Forbidden/parity | No contract/binding/invocation/outcome mutation, Runtime/SDK discovery, scheduler state, or hidden refresh. Fake projector and compare-write semantics match durable. |
| Reopen | Reopen if a view kind, projector input bundle, projection key, compare-write method, or report output ref changes. |

### 8.4 `JF-04 RefreshExternalStatusRefs`

| Card item | Exact closure |
|---|---|
| Canonical DTO | `RefreshExternalStatusRefsRequest { scope, slice }` -> `JobReport`; `tools.job.refresh_external_status_refs.v1`; Job annex §6. |
| Caller/handler | Operations binary -> job facade -> status refresh service. |
| Field sources | Caller supplies bounded attempt IDs/status families/unknown-or-stale flag/cursor/limit; JobMetadata supplies source watermark/scope; attempt/event identity, feedback result, status/gap refs and counts derive from Store/Port/application. |
| Mapper/factory | Stable target order `(attempt_id, status-family ordinal)`; `BusDeliveryFeedbackRequest::ResolveStored` or `ObservationFeedbackRequest::ResolveStored`; status/gap constructors; JobReport mapper. |
| Store/Port seam | `ExternalSubmissionStore` reads attempts/material/event identity; one bounded no-UoW feedback Port call per target; target-level UoW appends Bus/Observation ref/gap; stored report replay. |
| Flow/version | `JF-04`; Bus and Observation are independent families; local `SubmittedLocally` is never promoted to delivered/observed. |
| Failure/replay | Formal route/source open -> blocked/partial gap, no invented polling; locator/attempt/correlation mismatch -> integrity gap; duplicate does not call feedback Port. |
| Forbidden/parity | No attempt/outcome/audit mutation, observability store, delivery retry, route/DLQ, or external lifecycle truth. Fake/durable feedback mode and call count match. |
| Reopen | Reopen if status family, feedback method, attempt key, or output/report schema changes. |

## 9. Full protocol closure matrix

The matrix is intentionally compact only at the index level. The detailed cards above are the implementation evidence for every row; a row without a card is a gate failure.

| Family | Protocol | DTO authority | Flow | Primary local seam | External seam | Replay/duplicate surface | Status |
|---|---|---|---|---|---|---|---|
| Command | `EstablishToolContract` | Command annex §4 | `CF-01` | contract Store + UoW | Shared Contract Authority | Stored command value/error | closed |
| Command | `AssessToolDefinitionChange` | Command annex §5 | `CF-02` | contract Store + UoW | Shared Contract Authority | Stored command value/error | closed |
| Command | `AdoptToolDefinitionRevision` | Command annex §6 | `CF-03` | contract Store + ProjectionStore | none | Stored command value/error | closed |
| Command | `RetireToolContract` | Command annex §7 | `CF-04` | contract Store + ProjectionStore | none | Stored command value/error | closed |
| Command | `DeclareCapabilityBinding` | Command annex §8 | `CF-05` | binding Store | Hub source | Stored command value/error | closed |
| Command | `ReplaceCapabilityBinding` | Command annex §9 | `CF-06` | binding Store | Hub source | Stored command value/error | closed |
| Command | `InvalidateCapabilityBinding` | Command annex §10 | `CF-07` | binding Store + gaps | none | Stored command value/error | closed |
| Command | `SubmitToolInvocation` | Command annex §11 | `CF-08` | invocation/outcome Stores | caller ingress only | Stored command value/error | closed |
| Command | `EvaluateExecutionPreconditions` | Command annex §12 | `CF-09` | handoff/outcome Stores | Authorization/Sandbox readiness | Stored command value/error | closed |
| Command | `PrepareExecutionHandoff` | Command annex §13 | `CF-10` | handoff/attempt Stores | Sandbox handoff | Stored command value/error | closed |
| Command | `AcceptExecutionSource` | Command annex §14 | `CF-11` | outcome/audit Stores | source intake | Stored command value/error | closed |
| Command | `PrepareSafeExternalHandoff` | Command annex §15 | `CF-12` | eligibility/material Stores | collaboration via OF | Stored command value/error | closed |
| Command | `RecordConsistencyGapResolution` | Command annex §16 | `CF-13` | ProjectionStore gap CAS | typed owner read | Stored command value/error | closed |
| Query | `GetToolContract` | Query annex §3 | `QF-01` | contract bundle read | none | no stored replay | closed |
| Query | `CompareToolDefinitionRevisions` | Query annex §4 | `QF-02` | definition bundle read | none | no stored replay | closed |
| Query | `GetCapabilityBinding` | Query annex §5 | `QF-03` | binding/assessment read | none | no stored replay | closed |
| Query | `GetToolInvocation` | Query annex §6 | `QF-04` | invocation bundle read | none | no stored replay | closed |
| Query | `GetExecutionPreconditionView` | Query annex §7 | `QF-05` | precondition bundle read | none | no stored replay | closed |
| Query | `GetOutcomeAudit` | Query annex §8 | `QF-06` | outcome/audit pair read | none | no stored replay | closed |
| Query | `GetReferenceConsistencyReport` | Query annex §9 | `QF-07` | ProjectionStore report read | none | no stored replay | closed |
| Query | `SearchToolContracts` | Query annex §10 | `QF-08` | ProjectionStore page read | none | no stored replay | closed |
| Query | `CompareToolContracts` | Query annex §11 | `QF-09` | ProjectionStore diff read | none | no stored replay | closed |
| Query | `GetToolDiagnostic` | Query annex §12 | `QF-10` | ProjectionStore diagnostic read | none | no stored replay | closed |
| Query | `GetToolConsumerGuidance` | Query annex §13 | `QF-11` | ProjectionStore guidance read | none | no stored replay | closed |
| Consumer | `ConsumeHubCapabilityChangeClue` | Consumer annex §3 | `IF-01` | snapshot/assessment/gap Store | Hub clue validation | ConsumerReceipt | closed |
| Consumer | `ConsumeAuthorizationResultChangeClue` | Consumer annex §4 | `IF-02` | assessment/gap Store | authorization clue validation | ConsumerReceipt | closed |
| Consumer | `ConsumeSandboxExecutionSource` | Consumer annex §5 | `IF-03` | CF-11 result + receipt | source intake through CF-11 | ConsumerReceipt + command result | closed |
| Consumer | `ConsumeBusDeliveryStatusFeedback` | Consumer annex §6 | `IF-04` | Bus status/gap Store | Bus feedback | ConsumerReceipt | closed |
| Consumer | `ConsumeObservationStatusFeedback` | Consumer annex §7 | `IF-05` | observation/gap Store | observation feedback | ConsumerReceipt | closed |
| Event | `ToolContractChanged` | Event annex §3 | `OF-01` | submission attempt Store | collaboration submit | ExternalSubmissionAttempt | closed |
| Event | `CapabilityBindingChanged` | Event annex §4 | `OF-02` | submission attempt Store | collaboration submit | ExternalSubmissionAttempt | closed |
| Event | `ToolOutcomeAuditMaterialAvailable` | Event annex §5 | `OF-03` | submission attempt Store | collaboration submit | ExternalSubmissionAttempt | closed |
| Event | `ToolConsistencyGapChanged` | Event annex §6 | `OF-04` | submission attempt Store | collaboration submit | ExternalSubmissionAttempt | closed |
| Job | `CheckCapabilityBindingConsistency` | Job annex §3 | `JF-01` | assessment/gap/report Store | Hub source | JobReport | closed |
| Job | `CheckReferenceIntegrity` | Job annex §4 | `JF-02` | assessment/gap/report Store | typed source Ports | JobReport | closed |
| Job | `RebuildToolDerivedViews` | Job annex §5 | `JF-03` | projection compare-write | none | JobReport | closed |
| Job | `RefreshExternalStatusRefs` | Job annex §6 | `JF-04` | status/gap/report Store | Bus/Observation feedback | JobReport | closed |

## 10. Cross-protocol closure audit

| Audit item | Result / evidence |
|---|---|
| Count and identity | Pass: exactly `13/11/5/4/4`; no protocol was added, merged, or renamed. |
| DTO authority | Pass: each public DTO/view/payload/report points to one existing Step 8 family annex; no duplicate secondary type is introduced here. |
| Field provenance | Pass: all fields are caller intent, envelope/metadata authority, Store/Port lookup, application-generated, or commit-derived; no implementation-agent choice remains. |
| Protocol -> object -> seam -> flow | Pass: every row has Step 6 object/card, Step 7 method family, and one Step 9 flow ID. |
| Version strategy | Pass: logical v1 names are transport-neutral; semantic field/identity/source changes require a new schema version; unknown versions reject/quarantine. |
| Error/replay | Pass: typed `ProtocolError`, stored command/consumer/job surfaces, exact event attempt identity, and no external re-call on duplicate/prepared/unknown. |
| Query discipline | Pass: all Queries are zero-write, zero-refresh, zero-external-Port; page cursors are opaque and scope/watermark-bound. |
| Consumer discipline | Pass: receipt is local; source event metadata is envelope authority; `IF-03` is the only formal Command re-entry and uses independent UoWs. |
| Event discipline | Pass: safe material is committed before continuation; prepared marker precedes one collaboration call; local submission never means delivery/observation. |
| Job discipline | Pass: each Job is a bounded deterministic slice; reports contain typed output refs, not run/evidence/signoff facts; no subject repair. |
| Boundary | Pass: no agent loop, LLM planning, runtime orchestration, capability registry truth, Sandbox isolation truth, Observability store, marketplace, or SDK client is merged. |
| Blockers | Pass: `L2T-UP-001~009` remain explicit; positive external readiness is blocked/fail-closed rather than invented. |

## 11. R-8 stop review and reopen gate

| Gate | Result |
|---|---|
| Every protocol has an independent card | Pass: 37 cards (`13 + 11 + 5 + 4 + 4`). |
| Every card has DTO, field source, mapper/factory, seam, flow, errors/replay, forbidden boundary, parity and reopen condition | Pass. |
| No second DTO/object/Store/Port authority introduced | Pass; this annex only references existing canonical authorities. |
| L1-governance granularity calibration | Pass; per-protocol cards and cross-family matrices now exist rather than family-only summary. |
| Formal document write permission | Not granted; formal 03 remains write-closed until Step 19. |
| Next recalibration | R-9 function-flow cards must audit every `CF/QF/IF/OF/JF` against these protocol cards and reject any invented callable/field/state. |

```text
batch = R-8_exact_protocol_closure
batch_status = completed
gate_status = pass
gate_reason = all 37 public protocols have one canonical DTO authority, caller/handler, field provenance, pure mapper/factory, exact Store/Port seam, Step 9 flow, version/error/replay behavior, forbidden boundary, fake/durable parity, and reopen condition; no new business or external truth was introduced
formal_document_write_allowed = false
next_allowed_action = create_R-9_function_flow_recalibration_annex
next_formal_document_allowed = false
commit_required = false
```
