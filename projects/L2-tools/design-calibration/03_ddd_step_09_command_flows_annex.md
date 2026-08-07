# L2-tools Step 9 函数流附录: 13 Command flows

> 状态: completed / pass
> 主文件: `03_ddd_step_09_function_flows.md`
> 入口: `api::ToolCommandUseCases::execute`；`CF-08` 亦由 `InvocationCallerPort::submit` 委托同一 use case
> 共同门禁: metadata/digest/idempotency/commit-resolution 规则见 Step 9 主文件；本附录仍逐流展开实际调用与副作用。

## 1. Command batch inventory

| Flow | Command | Owner | External call | Local transaction shape | Stop |
|---|---|---|---|---|---|
| `CF-01` | `EstablishToolContract` | contract | shared authority read | one UoW | pass |
| `CF-02` | `AssessToolDefinitionChange` | contract | shared authority read | one UoW | pass |
| `CF-03` | `AdoptToolDefinitionRevision` | contract | none | one UoW | pass |
| `CF-04` | `RetireToolContract` | contract | none | one UoW | pass |
| `CF-05` | `DeclareCapabilityBinding` | binding | Hub read | one UoW | pass |
| `CF-06` | `ReplaceCapabilityBinding` | binding | Hub read | one UoW | pass |
| `CF-07` | `InvalidateCapabilityBinding` | binding | none | one UoW | pass |
| `CF-08` | `SubmitToolInvocation` | invocation | none | one UoW | pass |
| `CF-09` | `EvaluateExecutionPreconditions` | precondition | authorization/readiness read | one UoW | pass |
| `CF-10` | `PrepareExecutionHandoff` | handoff | Sandbox side effect | prepared UoW + result UoW | pass |
| `CF-11` | `AcceptExecutionSource` | outcome | source mapping read | one UoW | pass |
| `CF-12` | `PrepareSafeExternalHandoff` | safe handoff | collaboration side effect | prepared UoW + result UoW | pass |
| `CF-13` | `RecordConsistencyGapResolution` | integrity | formal owner read | pending UoW + decision UoW | pass |

## 2. Per-flow conventions

- `reserve_or_replay(...)` in pseudocode expands to the exact `IdempotencyStore::get/reserve`, `IdempotencyRecord::classify_duplicate`, typed stored-result read and rollback branches shown in the Step 9 write guard. It is notation for those existing calls, not a new Port or repository function.
- `stage_command_replay(...)` expands to `StoredCommandResult::stage_committed`, `IdempotencyStore::store_command_result`, `IdempotencyRecord::commit_command_result` and `IdempotencyStore::save_record`, using the current UoW candidate.
- `commit_confirmed(...)` expands to `ToolsUnitOfWorkManager::commit`; `CommitOutcomeUnknown` calls `resolve_commit` with the same transaction ref. Only a matching receipt/candidate permits response; rolled back may re-enter reserve, unknown fails closed.
- A stale-propagation call always passes one configured-bounded `RepositoryPageRequest`. A returned next cursor creates `DerivedProjection / PropagationIncomplete / Degraded`; no Command loops over unbounded pages.
- `require_*`, `ensure_*`, `map_*`, `load_*`, `persist_*` and `*_from_*` names are application-local pure validation, selection, construction or mapping functions over the listed Step 6 values and Step 7 call results. They do not imply a hidden repository, Port, transaction or external side effect; every I/O call remains named explicitly in each graph and UoW table.
- `verify_optional_migration_closure` and `verify_retirement_closure` call the existing `ProjectionStore::get_consistency_report` once and accept only `ProjectionRead::Readable` with an exact scope/key, a comparable equal-or-newer watermark, report state `Current`, readable freshness `Fresh`, and no blocking/integrity-critical gap for the requested closure. `Missing`, readable stale/partial, rebuilding, unavailable, failed, or mismatched material fails closed and never triggers a report build.

## 3. `CF-01 EstablishToolContract`

### 3.1 Entry and target

| Item | Exact contract |
|---|---|
| Entry | `ToolCommandUseCases::execute(ToolCommandRequest::EstablishToolContract, CommandMetadata)` |
| Request/result | `EstablishToolContractRequest` -> `ToolCommandResponse<ToolContractView>` |
| Target | one `ToolContract`, first `FormalToolDefinition::Current`, one `ToolContractEvolutionFact::Established` |
| Owner/dependencies | contract application service; `SharedContractAuthorityPort`, `ToolContractStore`, UoW/idempotency/clock/ID |

### 3.2 Function call graph

```text
[Command entry]
  -> call CommandMetadata::validate + canonical_digest_frame
  -> call IdempotencyStore::get
  -> call SharedContractAuthorityPort::resolve                (no UoW)
  -> call ToolContractStore::get_contract/get_definition      (no UoW)
  -> tx begin + IdempotencyStore::reserve
  -> call DefinitionSourceRef::from_authority
  -> call FormalToolDefinition::formalize/promote_to_current
  -> call ToolContract::establish
  -> call ToolContractEvolutionFact::record
  -> create contract + insert definition + append fact
  -> stage exact ToolContractView/result + idempotency
  -> tx commit/resolve -> response
```

### 3.3 Typed pseudocode

```rust
metadata.validate()?;
let digest = canonical_digest_frame(ToolCommandName::EstablishToolContract, &request, &metadata)?;
reserve_or_replay_precheck(scope, metadata.idempotency_key, digest).await?;
let tool_id = match request.identity { Generate => ids.new_tool_id()?, UseProvided(id) => id };
ensure_none(contract_store.get_contract(&tool_id).await?)?;
ensure_none(contract_store.get_definition(&tool_id, request.initial_revision).await?)?;
let resolution = shared_authority.resolve(&SharedContractAuthorityRequest::from(&request.definition_source)).await?;
let authority = require_compatible_available(resolution)?;
let now = clock.now()?;
let source = DefinitionSourceRef::from_authority(ids.new_definition_source_ref_id()?, authority, now.as_consumption_time())?;
let mut definition = FormalToolDefinition::formalize(ids.new_definition_id()?, tool_id, request.initial_revision, request.definition, source)?;
definition.promote_to_current()?;
let contract = ToolContract::establish(tool_id, request.initial_revision, request.binding_mode, now.as_decision_time())?;
let fact = ToolContractEvolutionFact::record(ids.new_evolution_fact_id()?, &contract, Established, None, Some(request.initial_revision), metadata.actor_ref, request.establishment_reason, metadata.correlation_ref, now.as_decision_time())?;
let uow = uow_manager.begin().await?;
let claim = reserve_or_replay(&uow, scope, metadata.idempotency_key, digest).await?;
let loaded_contract = contract_store.create_contract(contract, &*uow).await?;
let definition_ref = require_appended_or_equal(contract_store.insert_definition(definition, &*uow).await?)?;
let fact_ref = require_appended_or_equal(contract_store.append_evolution_fact(fact, &*uow).await?)?;
let view = map_contract_view(ContractViewInput::established(&loaded_contract, definition_ref, fact_ref))?;
stage_command_replay(&uow, claim, StoredCommandValue::ToolContract(view.clone()), refs![tool_id, definition_ref, fact_ref]).await?;
commit_confirmed(uow).await?;
return accepted(view);
```

### 3.4 Transaction, errors, effects and tests

| Concern | Exact behavior |
|---|---|
| UoW | Authority resolution and duplicate/not-found checks precede UoW; all three truth writes and replay state are one commit. Any create/append/view/replay error rolls back. |
| Errors/reentry | Invalid first revision/body/identity -> no write; source blocked/unavailable/unverifiable -> no write; semantic identity/revision uniqueness -> conflict; equal committed key -> exact replay; commit unknown -> same-authority resolution only. |
| State/effects | `none -> Active`;first revision `Candidate -> Current`; append Established fact; no Binding, audit, event delivery or external mutation. |
| Test cuts | generated/provided identity success; invalid first revision; authority blocked; pre-existing tool/revision conflict; equal replay/digest conflict; injected append rollback; committed/rolled-back/unknown commit resolution. |

Stop review: DTO fields, source authority, object factories, three store writes, UoW, exact replay, state and tests are closed; pass.

## 4. `CF-02 AssessToolDefinitionChange`

### 4.1 Entry and target

| Item | Exact contract |
|---|---|
| Entry/result | `AssessToolDefinitionChangeRequest` -> `ToolCommandResponse<ToolCompatibilityImpactView>` |
| Target | immutable candidate definition + immutable compatibility impact; current contract/revision unchanged |
| Owner/dependencies | contract evolution service; shared authority read, contract store, UoW/idempotency/clock/ID |

### 4.2 Function call graph

```text
[Command entry]
  -> validate/dedup -> get current contract bundle + candidate revision
  -> SharedContractAuthorityPort::resolve                     (no UoW)
  -> FormalToolDefinition::formalize(Candidate)
  -> ToolCompatibilityImpact::assess
  -> tx begin/reserve
  -> insert definition + append impact + stored typed result
  -> tx commit/resolve -> response
```

### 4.3 Typed pseudocode

```rust
metadata.validate()?;
let digest = canonical_digest_frame(ToolCommandName::AssessToolDefinitionChange, &request, &metadata)?;
reserve_or_replay_precheck(scope, metadata.idempotency_key, digest).await?;
let current = require_some(contract_store.get_current_bundle(&request.tool_id).await?)?;
ensure(current.contract.value.accepts_new_invocation())?;
ensure_none(contract_store.get_definition(&request.tool_id, request.candidate_revision).await?)?;
let source_resolution = shared_authority.resolve(&SharedContractAuthorityRequest::from(&request.candidate_source)).await?;
let source = DefinitionSourceRef::from_authority(ids.new_definition_source_ref_id()?, require_compatible_available(source_resolution)?, clock.now()?.as_consumption_time())?;
let candidate = FormalToolDefinition::formalize(ids.new_definition_id()?, request.tool_id, request.candidate_revision, request.candidate_definition, source)?;
let consumers = request.protected_consumer_scope.exact_set_or_formally_empty()?;
let impact = ToolCompatibilityImpact::assess(&current.definition.value, &candidate, consumers, clock.now()?.as_assessment_time())?;
let uow = uow_manager.begin().await?;
let claim = reserve_or_replay(&uow, scope, metadata.idempotency_key, digest).await?;
let candidate_ref = require_appended_or_equal(contract_store.insert_definition(candidate, &*uow).await?)?;
let impact_ref = require_appended_or_equal(contract_store.append_compatibility_impact(impact.clone(), &*uow).await?)?;
let view = map_compatibility_impact_view(&impact, impact_ref)?;
stage_command_replay(&uow, claim, StoredCommandValue::CompatibilityImpact(view.clone()), refs![candidate_ref, impact_ref]).await?;
commit_confirmed(uow).await?;
return accepted(view);
```

### 4.4 Transaction, errors, effects and tests

| Concern | Exact behavior |
|---|---|
| UoW | Current/candidate reads and source resolution are pre-UoW; candidate+impact+stored result are atomic. No contract save occurs. |
| Errors/reentry | Missing/retired contract, existing candidate, invalid source/body, malformed empty scope or authority blocker stop before writes. Append equal is accepted only under canonical equality; conflict rolls back. |
| State/effects | New definition remains `Candidate`; append impact class; current pointer/version unchanged; no projection stale mark because no current truth changed. |
| Test cuts | compatible/conditional/incompatible/unverifiable assessments; formally empty vs illegal empty scope; source blocker; duplicate candidate conflict; exact replay/digest conflict; second append failure rolls back candidate. |

Stop review: candidate source, protected-scope semantics, current immutability, impact persistence, replay and tests are closed; pass.

## 5. `CF-03 AdoptToolDefinitionRevision`

### 5.1 Entry and target

| Item | Exact contract |
|---|---|
| Entry/result | `AdoptToolDefinitionRevisionRequest` -> `ToolCommandResponse<ToolContractView>` |
| Target | current definition -> Superseded; candidate -> Current; contract pointer; adoption fact; bounded D1 stale propagation |
| Owner/dependencies | contract evolution service; contract/projection stores, UoW/idempotency/clock/ID; no external Port |

### 5.2 Function call graph

```text
[Command entry]
  -> validate/dedup -> load contract/current/candidate/impact
  -> optional ProjectionStore::get_consistency_report         (conditional closure)
  -> ToolContract::adopt_revision + definition transitions
  -> tx begin/reserve
  -> save old + candidate + contract;append evolution fact
  -> ProjectionStore::mark_affected_stale(one bounded page)
  -> optional ConsistencyGap::detect/create(continuation)
  -> stage typed view/result -> commit/resolve
```

### 5.3 Typed pseudocode

```rust
metadata.validate()?;
let digest = canonical_digest_frame(ToolCommandName::AdoptToolDefinitionRevision, &request, &metadata)?;
reserve_or_replay_precheck(scope, metadata.idempotency_key, digest).await?;
let mut bundle = require_some(contract_store.get_current_bundle(&request.tool_id).await?)?;
ensure_eq(bundle.contract.value.current_definition_revision, request.expected_current_revision)?;
let mut candidate = require_some(contract_store.get_definition(&request.tool_id, request.candidate_revision).await?)?;
let impact = require_some(contract_store.get_compatibility_impact(&request.impact_ref).await?)?;
let closure = verify_optional_migration_closure(&impact, request.migration_closure_ref, projection_store).await?;
bundle.contract.value.adopt_revision(&candidate.value, &impact, closure.as_ref())?;
bundle.current_definition.value.mark_superseded(request.candidate_revision)?;
candidate.value.promote_to_current()?;
let now = clock.now()?;
let fact = ToolContractEvolutionFact::record(ids.new_evolution_fact_id()?, &bundle.contract.value, RevisionAdopted, Some(request.expected_current_revision), Some(request.candidate_revision), metadata.actor_ref, request.adoption_reason, metadata.correlation_ref, now.as_decision_time())?;
let uow = uow_manager.begin().await?;
let claim = reserve_or_replay(&uow, scope, metadata.idempotency_key, digest).await?;
let old_saved = contract_store.save_definition(bundle.current_definition.value, bundle.current_definition.expected_version, &*uow).await?;
let current_saved = contract_store.save_definition(candidate.value, candidate.expected_version, &*uow).await?;
let contract_saved = contract_store.save_contract(bundle.contract.value, bundle.contract.expected_version, &*uow).await?;
let fact_ref = require_appended_or_equal(contract_store.append_evolution_fact(fact, &*uow).await?)?;
let stale_page = projection_store.mark_affected_stale(&LocalTruthRef::ToolContract(request.tool_id), bundle.source_watermark, bounded_first_page(), &*uow).await?;
let gap_refs = create_propagation_gap_if_continued(&stale_page, &uow).await?;
let view = map_contract_view(ContractViewInput::adopted(&contract_saved, &current_saved, fact_ref, gap_refs.clone()))?;
stage_command_replay(&uow, claim, StoredCommandValue::ToolContract(view.clone()), refs![old_saved, current_saved, fact_ref] + gap_refs).await?;
commit_confirmed(uow).await?;
return accepted(view);
```

### 5.4 Transaction, errors, effects and tests

| Concern | Exact behavior |
|---|---|
| UoW | All three versioned mutations, adoption fact, first stale page, optional continuation gap and replay commit atomically. Closure report read is pre-UoW and its watermark/ref is included in fact/replay basis. |
| Errors/reentry | Stale semantic revision or adapter version -> conflict; missing/mismatched impact/closure -> invalid state; incompatible/unverifiable -> reject; projection conflict or any save failure rolls back the entire switch. |
| State/effects | Candidate -> Current; prior Current -> Superseded; contract current pointer changes once; D1 only becomes stale; historical invocation anchors remain unchanged. |
| Test cuts | compatible/no closure; conditional/verified closure; missing/mismatched/stale closure; incompatible/unverifiable; expected-current drift; definition version conflict; stale-page continuation gap; full rollback; exact replay. |

Stop review: revision-pair/closure guard, optimistic tokens, atomic switch, stale propagation, history/replay and tests are closed; pass.

## 6. `CF-04 RetireToolContract`

### 6.1 Entry and target

| Item | Exact contract |
|---|---|
| Entry/result | `RetireToolContractRequest` -> `ToolCommandResponse<ToolContractView>` |
| Action | `Request`: Active -> RetirementPending; `Complete`: pending -> Retired after exact impact-report verification |
| Target | contract lifecycle/reason/time + one evolution fact + bounded D1 stale propagation |
| Owner/dependencies | contract service; contract/projection stores, UoW/idempotency/clock/ID; no external Port |

### 6.2 Function call graph

```text
[Command entry]
  -> validate/dedup -> ToolContractStore::get_current_bundle
  -> Complete only: ProjectionStore::get_consistency_report   (no UoW)
  -> call ToolContract::request_retirement or complete_retirement
  -> call ToolContractEvolutionFact::record
  -> tx begin/reserve -> save contract + append fact
  -> mark_affected_stale(one bounded page) + optional continuation gap
  -> stage exact view/result -> commit/resolve
```

### 6.3 Typed pseudocode

```rust
metadata.validate()?;
let digest = canonical_digest_frame(ToolCommandName::RetireToolContract, &request, &metadata)?;
reserve_or_replay_precheck(scope, metadata.idempotency_key, digest).await?;
let mut bundle = require_some(contract_store.get_current_bundle(&request.tool_id).await?)?;
let now = clock.now()?;
let (kind, reason, closure_basis) = match request.action {
    ToolRetirementAction::Request { reason } => {
        bundle.contract.value.request_retirement(reason.clone())?;
        (RetirementRequested, ChangeReason::RetirementRequested(reason), None)
    }
    ToolRetirementAction::Complete { impact_closure_ref, reason } => {
        verify_retirement_closure(&request.tool_id, &impact_closure_ref, projection_store).await?;
        bundle.contract.value.complete_retirement(impact_closure_ref.clone(), now.as_decision_time())?;
        (Retired, ChangeReason::RetirementCompleted(reason), Some(impact_closure_ref))
    }
};
let fact = ToolContractEvolutionFact::record(ids.new_evolution_fact_id()?, &bundle.contract.value, kind, Some(bundle.current_definition.value.revision), Some(bundle.current_definition.value.revision), metadata.actor_ref, reason, metadata.correlation_ref, now.as_decision_time())?;
let uow = uow_manager.begin().await?;
let claim = reserve_or_replay(&uow, scope, metadata.idempotency_key, digest).await?;
let saved = contract_store.save_contract(bundle.contract.value, bundle.contract.expected_version, &*uow).await?;
let fact_ref = require_appended_or_equal(contract_store.append_evolution_fact(fact, &*uow).await?)?;
let stale_page = projection_store.mark_affected_stale(&LocalTruthRef::ToolContract(request.tool_id), bundle.source_watermark, bounded_first_page(), &*uow).await?;
let gap_refs = create_propagation_gap_if_continued(&stale_page, &uow).await?;
let view = map_contract_view(ContractViewInput::retired_transition(&saved, &bundle.current_definition, fact_ref, closure_basis, gap_refs.clone()))?;
stage_command_replay(&uow, claim, StoredCommandValue::ToolContract(view.clone()), refs![saved, fact_ref] + gap_refs).await?;
commit_confirmed(uow).await?;
return accepted(view);
```

### 6.4 Transaction, errors, effects and tests

| Concern | Exact behavior |
|---|---|
| UoW | Complete verifies a local current report before UoW, then lifecycle/fact/stale page/gap/replay are atomic. The report key/watermark remains a closure basis ref. |
| Errors/reentry | Request outside Active, Complete outside Pending, missing/stale/partial/failed/mismatched closure, version conflict and projection conflict reject without partial lifecycle. Same action/key replays; a different action/digest conflicts. |
| State/effects | Active -> Pending records reason; Pending -> Retired records completion time; revision remains current for history; new invocation guard is false in both non-Active states; no delete/resurrection. |
| Test cuts | request success; premature complete; verified complete; missing/blocking/stale report; duplicate request/complete; concurrent retire conflict; stale continuation gap; commit unknown. |

Stop review: both actions, closure authority, lifecycle fields, history, atomicity, replay and tests are closed; pass.

## 7. `CF-05 DeclareCapabilityBinding`

### 7.1 Entry and target

| Item | Exact contract |
|---|---|
| Entry/result | `DeclareCapabilityBindingRequest` -> `ToolCommandResponse<CapabilityBindingView>` |
| Target | one Active relation; one assessment; Bound additionally one Hub ref/snapshot; one declaration fact |
| Owner/dependencies | binding service; contract/binding stores, optional `HubControlledSourcePort`, UoW/idempotency/clock/ID |

### 7.2 Function call graph

```text
[Command entry]
  -> validate/dedup -> get active contract + find_current_by_tool(None)
  -> Bound only: HubControlledSourcePort::resolve_snapshot(candidate) (no UoW)
  -> HubCapabilityRef::resolve + HubControlledSnapshot::from_port
  -> CapabilityBinding::declare + CapabilityBindingAssessment::assess
  -> CapabilityBindingChangeFact::record
  -> tx begin/reserve -> create relation + append snapshot/assessment/fact
  -> stage binding view/result -> commit/resolve
```

### 7.3 Typed pseudocode

```rust
metadata.validate()?;
let digest = canonical_digest_frame(ToolCommandName::DeclareCapabilityBinding, &request, &metadata)?;
reserve_or_replay_precheck(scope, metadata.idempotency_key, digest).await?;
let contract = require_some(contract_store.get_contract(&request.tool_id).await?)?;
ensure(contract.value.accepts_new_invocation())?;
ensure_none(binding_store.find_current_by_tool(&request.tool_id).await?)?;
let now = clock.now()?;
let binding_id = ids.new_binding_id()?;
let (mode, capability_ref, snapshot) = match request.target {
    CapabilityBindingTargetInput::Bound(candidate) => {
        let resolution = hub_source.resolve_snapshot(&HubControlledSourceRequest::from_candidate(request.tool_id, &candidate, metadata.correlation_ref)).await?;
        let value = require_fresh_available(resolution)?;
        let formal_ref = HubCapabilityRef::resolve(value.authority_ref, value.capability_ref.identity(), value.source_revision, candidate.locator)?;
        let snapshot = HubControlledSnapshot::from_port(ids.new_hub_snapshot_id()?, &formal_ref, value, now.as_consumption_time())?;
        (BindingMode::Bound, Some(formal_ref), Some(snapshot))
    }
    CapabilityBindingTargetInput::ExplicitUnbound(reason) => {
        validate_explicit_unbound_reason(&reason)?;
        (BindingMode::ExplicitUnbound, None, None)
    }
};
ensure_eq(mode, contract.value.initial_binding_mode)?;
let binding = CapabilityBinding::declare(binding_id, request.tool_id, mode, capability_ref)?;
let assessment = CapabilityBindingAssessment::assess(ids.new_binding_assessment_id()?, &binding, snapshot.as_ref(), now.as_consumption_time());
ensure(assessment.permits_anchor())?;
let fact = CapabilityBindingChangeFact::record(ids.new_binding_change_fact_id()?, &binding, declaration_kind(mode), None, None, capability_ref_summary(&binding), metadata.actor_ref, request.declaration_reason, metadata.correlation_ref, now.as_decision_time())?;
let uow = uow_manager.begin().await?;
let claim = reserve_or_replay(&uow, scope, metadata.idempotency_key, digest).await?;
let loaded_binding = binding_store.create_binding(binding, &*uow).await?;
let snapshot_ref = append_optional_snapshot(snapshot, &uow).await?;
let assessment_ref = require_appended_or_equal(binding_store.append_assessment(assessment, &*uow).await?)?;
let fact_ref = require_appended_or_equal(binding_store.append_change_fact(fact, &*uow).await?)?;
let view = map_binding_view(BindingViewInput::declared(&loaded_binding, snapshot_ref, assessment_ref, fact_ref))?;
stage_command_replay(&uow, claim, StoredCommandValue::CapabilityBinding(view.clone()), refs![loaded_binding, assessment_ref, fact_ref] + snapshot_ref).await?;
commit_confirmed(uow).await?;
return accepted(view);
```

### 7.4 Transaction, errors, effects and tests

| Concern | Exact behavior |
|---|---|
| UoW | Hub read is pre-UoW and receives candidate fields. Relation/snapshot/assessment/change/replay are one local commit. Explicit-unbound makes no Hub call and stores no snapshot/ref. |
| Errors/reentry | Missing/non-Active contract, existing current relation, candidate/result mismatch, stale/blocked/unavailable/unverifiable Hub or illegal mode/ref symmetry -> zero target writes. Create/append conflict rolls back all. |
| State/effects | none -> Active relation; immutable accepted assessment; declaration fact. It creates no Hub truth, authorization, invocation or event delivery. |
| Test cuts | Bound accepted; explicit-unbound accepted/no Port; Hub blocker/stale/conflict; current relation conflict; mode/ref mismatch; exact replay/digest conflict; append rollback. |

Stop review: candidate-to-formal-ref construction, explicit-unbound branch, atomic target set, view/replay and tests are closed; pass.

## 8. `CF-06 ReplaceCapabilityBinding`

### 8.1 Entry and target

| Item | Exact contract |
|---|---|
| Entry/result | `ReplaceCapabilityBindingRequest` -> `ToolCommandResponse<CapabilityBindingView>` |
| Target | old relation Active -> ReplacementPending -> Replaced with successor ID; new Active relation; optional snapshot/assessment; one replacement fact; bounded stale propagation |
| Owner/dependencies | binding service; binding/projection stores, optional Hub source read, UoW/idempotency/clock/ID |

### 8.2 Function call graph

```text
[Command entry]
  -> validate/dedup -> CapabilityBindingStore::get_binding
  -> Bound only: HubControlledSourcePort::resolve_snapshot     (no UoW)
  -> old.begin_replacement(adapter token) -> old.replace(new ID,...)
  -> new assessment + replacement fact(old ID, successor ID)
  -> tx begin/reserve -> save old + create new + append snapshot/assessment/fact
  -> mark_affected_stale(one page) + optional continuation gap
  -> stage new binding view/result -> commit/resolve
```

### 8.3 Typed pseudocode

```rust
metadata.validate()?;
let digest = canonical_digest_frame(ToolCommandName::ReplaceCapabilityBinding, &request, &metadata)?;
reserve_or_replay_precheck(scope, metadata.idempotency_key, digest).await?;
let mut old = require_some(binding_store.get_binding(&request.binding_id).await?)?;
ensure(old.value.is_applicable_for_new_invocation())?;
let now = clock.now()?;
let new_id = ids.new_binding_id()?;
let (new_mode, new_ref, snapshot) = resolve_binding_target(request.replacement, old.value.tool_id, metadata.correlation_ref, hub_source, ids, now).await?;
old.value.begin_replacement(old.expected_version)?;
let (old_terminal, new_binding) = old.value.replace(new_id, new_mode, new_ref)?;
let assessment = CapabilityBindingAssessment::assess(ids.new_binding_assessment_id()?, &new_binding, snapshot.as_ref(), now.as_consumption_time());
ensure(assessment.permits_anchor())?;
let fact = CapabilityBindingChangeFact::record(ids.new_binding_change_fact_id()?, &old_terminal, Replaced, Some(new_id), previous_ref_summary(&old_terminal), capability_ref_summary(&new_binding), metadata.actor_ref, request.replacement_reason, metadata.correlation_ref, now.as_decision_time())?;
let uow = uow_manager.begin().await?;
let claim = reserve_or_replay(&uow, scope, metadata.idempotency_key, digest).await?;
let old_saved = binding_store.save_binding(old_terminal, old.expected_version, &*uow).await?;
let new_saved = binding_store.create_binding(new_binding, &*uow).await?;
let snapshot_ref = append_optional_snapshot(snapshot, &uow).await?;
let assessment_ref = require_appended_or_equal(binding_store.append_assessment(assessment, &*uow).await?)?;
let fact_ref = require_appended_or_equal(binding_store.append_change_fact(fact, &*uow).await?)?;
let stale_page = projection_store.mark_affected_stale(&LocalTruthRef::CapabilityBinding(request.binding_id), current_watermark(&old), bounded_first_page(), &*uow).await?;
let gap_refs = create_propagation_gap_if_continued(&stale_page, &uow).await?;
let view = map_binding_view(BindingViewInput::replacement(&new_saved, snapshot_ref, assessment_ref, fact_ref, gap_refs.clone()))?;
stage_command_replay(&uow, claim, StoredCommandValue::CapabilityBinding(view.clone()), refs![old_saved, new_saved, assessment_ref, fact_ref] + snapshot_ref + gap_refs).await?;
commit_confirmed(uow).await?;
return accepted(view);
```

### 8.4 Transaction, errors, effects and tests

| Concern | Exact behavior |
|---|---|
| UoW | Optional Hub read precedes UoW. Old terminal relation, new relation, source material, fact, first stale page/gap and replay commit atomically; no visible pending-only state. |
| Errors/reentry | Non-Active old state, Hub blocker/mismatch, same old/new ID, expected-version conflict or any new-relation uniqueness conflict rolls back old mutation. Existing current-by-tool constraint is evaluated as the same atomic replacement, not a second-current failure. |
| State/effects | Old records `Replaced + successor`; new becomes Active; one fact names both; old invocation anchors remain fixed; D1 stale only. |
| Test cuts | bound->bound, bound->explicit-unbound, explicit-unbound->bound; blocked Hub; non-Active old; version/unique conflict; fact successor symmetry; stale continuation; exact replay. |

Stop review: old/new identities, source branch, atomic replacement, lifecycle view, stale propagation/replay and tests are closed; pass.

## 9. `CF-07 InvalidateCapabilityBinding`

### 9.1 Entry and target

| Item | Exact contract |
|---|---|
| Entry/result | `InvalidateCapabilityBindingRequest` -> `ToolCommandResponse<CapabilityBindingView>` |
| Target | one existing Active/ReplacementPending relation -> Invalidated, one invalidation fact, bounded stale propagation and optional source-validity gap |
| Owner/dependencies | binding service; binding/projection stores, UoW/idempotency/clock/ID; no external Port |

### 9.2 Function call graph

```text
[Command entry]
  -> validate/dedup -> CapabilityBindingStore::get_binding
  -> CapabilityBinding::invalidate
  -> CapabilityBindingChangeFact::record
  -> tx begin/reserve -> save relation + append fact
  -> mark_affected_stale(one page) + optional gap
  -> map historical invalidated view + stage replay -> commit/resolve
```

### 9.3 Typed pseudocode

```rust
metadata.validate()?;
let digest = canonical_digest_frame(ToolCommandName::InvalidateCapabilityBinding, &request, &metadata)?;
reserve_or_replay_precheck(scope, metadata.idempotency_key, digest).await?;
let mut binding = require_some(binding_store.get_binding(&request.binding_id).await?)?;
let previous = capability_ref_summary(&binding.value);
binding.value.invalidate(request.reason.clone())?;
let now = clock.now()?;
let fact = CapabilityBindingChangeFact::record(ids.new_binding_change_fact_id()?, &binding.value, Invalidated, None, previous, None, metadata.actor_ref, request.reason, metadata.correlation_ref, now.as_decision_time())?;
let uow = uow_manager.begin().await?;
let claim = reserve_or_replay(&uow, scope, metadata.idempotency_key, digest).await?;
let saved = binding_store.save_binding(binding.value, binding.expected_version, &*uow).await?;
let fact_ref = require_appended_or_equal(binding_store.append_change_fact(fact, &*uow).await?)?;
let stale_page = projection_store.mark_affected_stale(&LocalTruthRef::CapabilityBinding(request.binding_id), current_watermark(&binding), bounded_first_page(), &*uow).await?;
let gap_refs = create_binding_invalidation_gaps(&saved, &stale_page, &uow).await?;
let view = map_binding_view(BindingViewInput::invalidated(&saved, fact_ref, gap_refs.clone()))?;
stage_command_replay(&uow, claim, StoredCommandValue::CapabilityBinding(view.clone()), refs![saved, fact_ref] + gap_refs).await?;
commit_confirmed(uow).await?;
return accepted(view);
```

### 9.4 Transaction, errors, effects and tests

| Concern | Exact behavior |
|---|---|
| UoW | Relation/fact/stale-page/gaps/replay are one commit. No Hub call or source repair occurs. |
| Errors/reentry | Missing or terminal relation, invalid reason, version/fact/projection conflict roll back. Same key/digest returns the stored historical invalidated view even if another current relation later exists. |
| State/effects | Active or ReplacementPending -> Invalidated with reason; no explicit-unbound relation is created; no old anchor changes; gap only explains affected future consumption/projection. |
| Test cuts | Active and pending invalidation; Replaced/Invalidated rejection; version conflict; bound vs explicit-unbound gap behavior; stale continuation; exact historical replay. |

Stop review: legal state source, reason persistence, fact/ref symmetry, no implicit replacement, replay and tests are closed; pass.

## 10. `CF-08 SubmitToolInvocation`

### 10.1 Entry and target

| Item | Exact contract |
|---|---|
| Entry | API or `InvocationCallerPort::submit`; both delegate `ToolCommandUseCases::execute` |
| Request/result | `SubmitToolInvocationRequest` -> accepted/awaiting `ToolCommandResponse<ToolInvocationView>`; semantic reject/unavailable -> committed `ProtocolError` replay |
| Target | immutable invocation + immutable admission; rejected/unavailable adds indivisible no-execution outcome/audit pair and applicable gaps |
| Owner/dependencies | invocation/admission service; contract/binding/invocation/outcome/projection stores, UoW/idempotency/clock/ID; no external Port |

### 10.2 Function call graph

```text
[API / InvocationCallerPort]
  -> CommandMetadata::validate + canonical digest + idempotency precheck
  -> ToolContractStore::get_current_bundle
  -> CapabilityBindingStore::find_current_by_tool
  -> CapabilityBindingStore::get_latest_assessment_for_binding
  -> InvocationContextRefs::from_formal_context
  -> InvocationContractAnchor::anchor
  -> ToolInvocation::canonicalize
  -> InvocationAdmission::{admit|await_precondition|reject|unavailable}
  -> optional ToolInvocationOutcome::no_execution_* + ToolAuditEntry::record
  -> tx begin/reserve
  -> insert invocation + append admission + optional gap/outcome-audit pair
  -> stage exact value or safe error -> commit/resolve
```

### 10.3 Typed pseudocode

```rust
metadata.validate()?;
let digest = canonical_digest_frame(ToolCommandName::SubmitToolInvocation, &request, &metadata)?;
reserve_or_replay_precheck(scope, metadata.idempotency_key, digest).await?;
verify_forbidden_body_free(&request.intent)?; // invalid body: deterministic zero-write rejection
let bundle = require_some(contract_store.get_current_bundle(&request.tool_id).await?)?;
if let Some(expected) = request.expected_definition_revision {
    ensure_eq(expected, bundle.current_definition.value.revision)?;
}
let relation = binding_store.find_current_by_tool(&request.tool_id).await?;
let assessment = match &relation {
    Some(binding) => binding_store.get_latest_assessment_for_binding(&binding.value.binding_id).await?,
    None => None,
};
let now = clock.now()?;
let context = InvocationContextRefs::from_formal_context(
    FormalCallerContext::from(request.context, &metadata),
    bundle.current_definition.value.required_context_classes(),
)?;
let live_mode = relation.as_ref().map(|b| b.value.mode).unwrap_or(bundle.contract.value.initial_binding_mode);
let anchor = InvocationContractAnchor::anchor(
    &bundle.contract.value,
    &bundle.current_definition.value,
    live_mode,
    relation.as_ref().map(|b| &b.value),
    assessment.as_ref(),
    now.as_consumption_time(),
)?;
let invocation = ToolInvocation::canonicalize(
    ids.new_invocation_id()?, request.intent, anchor, context, now.as_decision_time(),
)?;
let admission = decide_admission(
    ids.new_admission_id()?, &invocation, &bundle.contract.value,
    relation.as_ref().map(|b| &b.value), assessment.as_ref(),
    &bundle.current_definition.value, now.as_decision_time(),
)?; // calls exactly one InvocationAdmission factory
let terminal = if admission.requires_no_execution_outcome() {
    Some(build_no_execution_pair(
        ids.new_outcome_id()?, ids.new_audit_entry_id()?, &invocation, &admission,
        no_execution_class(&admission), metadata.actor_ref, now,
    )?)
} else { None };
let uow = uow_manager.begin().await?;
let claim = reserve_or_replay(&uow, scope, metadata.idempotency_key, digest).await?;
let invocation_ref = require_appended_or_equal(invocation_store.insert_invocation(invocation.clone(), &*uow).await?)?;
let admission_ref = require_appended_or_equal(invocation_store.append_admission(admission.clone(), &*uow).await?)?;
let gap_refs = persist_admission_gaps_if_required(&invocation, &admission, &uow).await?;
let outcome_ref = match terminal {
    Some(pair) => Some(require_inserted_or_equal(outcome_store.insert_outcome_audit_pair(pair, &*uow).await?)?.outcome_ref),
    None => None,
};
let view = map_invocation_view(InvocationViewInput::new(&invocation, &admission, outcome_ref, gap_refs.clone()))?;
if admission.requires_no_execution_outcome() {
    let error = stored_admission_error(&admission, refs![invocation_ref, admission_ref, outcome_ref] + gap_refs, metadata.correlation_ref)?;
    stage_command_error_replay(&uow, claim, error).await?;
    commit_confirmed(uow).await?;
    return Err(ProtocolError::from_stored_application_error(error));
}
stage_command_replay(&uow, claim, StoredCommandValue::ToolInvocation(view.clone()), refs![invocation_ref, admission_ref] + gap_refs).await?;
commit_confirmed(uow).await?;
return accepted_or_awaiting(view, admission.state);
```

### 10.4 Transaction, errors, effects and tests

| Concern | Exact behavior |
|---|---|
| UoW | Stable local reads precede UoW. Invocation, admission, gaps, optional outcome/audit pair and exact value/error replay are one commit. No visible invocation can lack admission; no visible no-execution outcome can lack audit. |
| Errors/reentry | Protocol/body/unknown-tool/revision mismatch before canonical invocation -> zero writes. Typed insufficient context, non-Active contract, absent/noncurrent relation or conservative assessment -> committed rejected/unavailable admission + pair + safe error. Same key replays exact value/error; other digest conflicts. |
| State/effects | New immutable invocation; admission is Admitted, AwaitingPrecondition, Rejected or Unavailable. Current live Binding mode comes only from current relation; absent relation uses initial expectation solely to explain unavailable context. Historical state never mutates. |
| Test cuts | admitted no-precondition; awaiting auth/Sandbox; insufficient context; retirement pending/retired; missing/invalidated Binding; stale assessment; expected revision drift; raw body zero-write; pair insertion conflict/rollback; API vs caller-Port semantic parity; exact error replay. |

Stop review: canonical caller parity, live Binding authority, conservative anchor, admission/no-execution atomicity, exact error replay and tests are closed; pass.

## 11. `CF-09 EvaluateExecutionPreconditions`

### 11.1 Entry and target

| Item | Exact contract |
|---|---|
| Entry/result | `EvaluateExecutionPreconditionsRequest` -> `ToolCommandResponse<ExecutionPreconditionView>` or committed deny/unavailable error |
| Target | immutable requirement; applicable authorization assessment and Sandbox readiness snapshot; terminal conservative branch adds one outcome/audit pair and gaps |
| Owner/dependencies | precondition service; invocation/contract/binding/handoff/outcome/projection stores; authorization/Sandbox readiness observational Ports; UoW/idempotency/clock/ID |

### 11.2 Function call graph

```text
[Command entry]
  -> validate/dedup -> invocation/admission + anchored definition/assessment
  -> ensure no terminal outcome
  -> ExecutionRequirement::derive
  -> authorization required: AuthorizationConsumptionPort::consume_result (no UoW)
  -> Sandbox required: SandboxExecutionPort::resolve_readiness          (no UoW)
  -> build accepted or conservative immutable assessments
  -> optional ToolInvocationOutcome::no_execution_* + ToolAuditEntry::record
  -> tx begin/reserve -> append requirement/assessments/readiness/gaps/pair
  -> map precondition view + stage exact value/error -> commit/resolve
```

### 11.3 Typed pseudocode

```rust
metadata.validate()?;
let digest = canonical_digest_frame(ToolCommandName::EvaluateExecutionPreconditions, &request, &metadata)?;
reserve_or_replay_precheck(scope, metadata.idempotency_key, digest).await?;
let invocation_bundle = require_some(invocation_store.get_invocation_read_bundle(&request.invocation_id).await?)?;
ensure(invocation_bundle.admission.permits_precondition_evaluation())?;
ensure_none(outcome_store.get_outcome_audit_pair(&request.invocation_id).await?)?;
let definition = require_some(contract_store.get_definition(
    &invocation_bundle.invocation.contract_anchor.tool_id,
    invocation_bundle.invocation.contract_anchor.definition_revision,
).await?)?;
let binding_assessment = load_anchored_binding_assessment(&invocation_bundle.invocation, binding_store).await?;
let now = clock.now()?;
let requirement = ExecutionRequirement::derive(
    ids.new_requirement_id()?, &invocation_bundle.invocation, &definition.value,
    binding_assessment.as_ref(), now.as_decision_time(),
)?;
let authorization = if requirement.requires_authorization() {
    match request.authorization_selector {
        None => Some(AuthorizationConsumptionAssessment::fail_closed(
            ids.new_authorization_assessment_id()?, request.invocation_id,
            AuthorizationGapReason::MissingSelector, now.as_consumption_time(),
        )),
        Some(selector) => Some(map_authorization_resolution(
            ids.new_authorization_assessment_id()?, &invocation_bundle.invocation, &requirement,
            authorization_port.consume_result(&AuthorizationConsumptionRequest::from(
                &invocation_bundle.invocation, &requirement, selector,
            )).await?, now.as_consumption_time(),
        )?),
    }
} else {
    ensure(request.authorization_selector.is_none())?;
    None
};
let readiness = if requirement.requires_sandbox() {
    let carrier = narrow_or_required_carrier(request.requested_carrier, &requirement)?;
    Some(map_readiness_resolution(
        ids.new_sandbox_readiness_snapshot_id()?, request.invocation_id, &requirement, carrier,
        sandbox_port.resolve_readiness(&SandboxReadinessRequest::from(
            &invocation_bundle.invocation, &requirement, carrier,
        )).await?, now.as_consumption_time(),
    )?)
} else {
    ensure_requested_carrier_does_not_add_or_bypass_requirement(request.requested_carrier, &requirement)?;
    None
};
let terminal = precondition_no_execution_pair(
    ids, &invocation_bundle, &requirement, authorization.as_ref(), readiness.as_ref(),
    metadata.actor_ref, now,
)?;
let uow = uow_manager.begin().await?;
let claim = reserve_or_replay(&uow, scope, metadata.idempotency_key, digest).await?;
let requirement_ref = require_appended_or_equal(handoff_store.append_requirement(requirement.clone(), &*uow).await?)?;
let authorization_ref = append_optional_authorization(authorization.clone(), &uow).await?;
let readiness_ref = append_optional_readiness(readiness.clone(), &uow).await?;
let gap_refs = persist_precondition_gaps(&requirement, authorization.as_ref(), readiness.as_ref(), &uow).await?;
let outcome_ref = insert_optional_no_execution_pair(terminal, &uow).await?;
let view = map_precondition_view(PreconditionViewInput::evaluated(
    request.invocation_id, requirement, authorization, readiness,
    requirement_ref, authorization_ref, readiness_ref, outcome_ref, gap_refs.clone(),
))?;
if outcome_ref.is_some() {
    let error = stored_precondition_error(&view, refs![requirement_ref, authorization_ref, readiness_ref, outcome_ref] + gap_refs, metadata.correlation_ref)?;
    stage_command_error_replay(&uow, claim, error).await?;
    commit_confirmed(uow).await?;
    return Err(ProtocolError::from_stored_application_error(error));
}
stage_command_replay(&uow, claim, StoredCommandValue::ExecutionPrecondition(view.clone()), refs![requirement_ref, authorization_ref, readiness_ref] + gap_refs).await?;
commit_confirmed(uow).await?;
return accepted(view);
```

### 11.4 Transaction, errors, effects and tests

| Concern | Exact behavior |
|---|---|
| UoW/Ports | Authorization and readiness methods are observational and run before UoW. All resulting local facts/gaps/optional terminal pair/replay are one UoW. No external result is created or mutated. |
| Errors/reentry | Wrong admission/terminal invocation/selector-carrier misuse -> zero write. Required selector absent, blocked/unavailable/conflicting/unverifiable source, accepted deny, unsupported requirement or unusable constraints -> committed no-execution and safe error. |
| State/effects | Admission remains immutable. Requirement and assessments are new time-bound facts. Positive external variants are conditional/fake-test only while blockers remain; production auth/Sandbox affected paths fail closed. |
| Test cuts | no external requirements; auth allow/constrained/deny; missing selector; auth blocked; Sandbox available/mapping-blocked/unavailable; carrier narrowing/bypass attempt; existing terminal; pair conflict; exact error replay; fake/durable parity. |

Stop review: requirement derivation, selector/carrier rules, external-read placement, fail-closed pair, replay and tests are closed; pass.

## 12. `CF-10 PrepareExecutionHandoff`

### 12.1 Entry and target

| Item | Exact contract |
|---|---|
| Entry/result | `PrepareExecutionHandoffRequest` -> `ToolCommandResponse<ExecutionHandoffCommandView>` or committed/uncertain safe error |
| Target | one handoff; eligible path one versioned local attempt; negative path one no-execution pair; no Sandbox lifecycle truth |
| Owner/dependencies | handoff service; invocation/contract/handoff/outcome/projection stores; side-effecting `SandboxExecutionPort::submit_handoff`; UoW/idempotency/clock/ID |

### 12.2 Function call graph

```text
[Command entry]
  -> validate/dedup -> load invocation/admission + selected exact preconditions
  -> ExecutionHandoff::prepare/evaluate_eligibility
  +-- Blocked/Invalidated:
  |     tx one -> reserve + create handoff + no-execution pair + exact error -> commit
  +-- Eligible:
        tx phase 1 -> reserve Claimed + create handoff + create attempt Prepared -> commit/resolve
        -> SandboxExecutionPort::submit_handoff exactly once             (no UoW)
        -> tx phase 2 -> reload claim/attempt + continue_claim
           -> save one local attempt disposition
           -> optional no-execution pair/gap
           -> complete exact result/error replay -> commit/resolve
```

### 12.3 Typed pseudocode

```rust
metadata.validate()?;
let digest = canonical_digest_frame(ToolCommandName::PrepareExecutionHandoff, &request, &metadata)?;
reserve_or_replay_precheck(scope, metadata.idempotency_key, digest).await?;
let invocation = require_some(invocation_store.get_invocation_read_bundle(&request.invocation_id).await?)?;
ensure(invocation.admission.permits_precondition_evaluation())?;
ensure_none(outcome_store.get_outcome_audit_pair(&request.invocation_id).await?)?;
let definition = require_some(contract_store.get_definition(
    &invocation.invocation.contract_anchor.tool_id,
    invocation.invocation.contract_anchor.definition_revision,
).await?)?;
let requirement = require_some(handoff_store.get_requirement(&request.invocation_id).await?)?;
ensure_ref_eq(requirement.ref_id(), request.selection.requirement_ref)?;
let authorization = load_exact_optional_authorization(request.selection.authorization_assessment_ref, handoff_store).await?;
let readiness = load_exact_optional_readiness(request.selection.sandbox_readiness_ref, handoff_store).await?;
let now = clock.now()?;
let mut handoff = ExecutionHandoff::prepare(
    ids.new_handoff_id()?, &invocation.invocation, &definition.value, &requirement,
    authorization.as_ref(), readiness.as_ref(), now.as_decision_time(),
)?;
handoff.evaluate_eligibility(&requirement, authorization.as_ref(), readiness.as_ref())?;
if handoff.state != HandoffState::Eligible {
    return commit_blocked_handoff_and_no_execution(handoff, invocation, requirement,
        authorization, readiness, metadata, digest).await;
}
let attempt = ExecutionHandoffAttempt::prepared(
    ids.new_handoff_attempt_id()?, handoff.handoff_id, request.invocation_id,
    now.as_attempt_time(),
)?;
let phase1 = uow_manager.begin().await?;
let claim = reserve_or_replay(&phase1, scope, metadata.idempotency_key, digest).await?;
let loaded_handoff = handoff_store.create_handoff(handoff.clone(), &*phase1).await?;
let loaded_attempt = handoff_store.create_handoff_attempt(attempt, &*phase1).await?;
let phase1_receipt = commit_confirmed(phase1).await?; // no Port call unless confirmed
let port_result = sandbox_port.submit_handoff(&SandboxExecutionHandoffRequest::from(
    &handoff, &invocation.invocation, &requirement, readiness.as_ref(),
)).await;
let phase2 = uow_manager.begin().await?;
let claimed = require_same_claim(idempotency_store.get(&scope, &metadata.idempotency_key).await?, digest)?;
claimed.value.continue_claim(claimed.value.lease_ref()?, OperationPhase::ExternalResult, clock.now()?.as_decision_time())?;
let mut persisted_attempt = require_some(handoff_store.get_handoff_attempt(&loaded_attempt.value.attempt_id).await?)?;
let disposition = apply_sandbox_local_result(&mut persisted_attempt.value, port_result)?;
let saved_attempt = handoff_store.save_handoff_attempt(
    persisted_attempt.value, persisted_attempt.expected_version, &*phase2,
).await?;
let gap_refs = persist_handoff_attempt_gaps(&saved_attempt.value, &phase2).await?;
if disposition.is_outcome_unknown() {
    idempotency_store.save_record(claimed.value, claimed.expected_version, &*phase2).await?;
    commit_confirmed(phase2).await?;
    return Err(protocol_side_effect_unknown(saved_attempt, gap_refs)); // claim intentionally incomplete
}
let terminal = build_attempt_no_execution_pair_if_required(
    ids, &invocation, &requirement, &saved_attempt.value, metadata.actor_ref, clock.now()?,
)?;
let outcome_ref = insert_optional_no_execution_pair(terminal, &phase2).await?;
let precondition = map_precondition_view(PreconditionViewInput::with_handoff(
    &invocation, &requirement, authorization, readiness, &loaded_handoff.value,
    &saved_attempt.value, outcome_ref, gap_refs.clone(),
))?;
let view = map_handoff_command_view(
    precondition, &loaded_handoff.value, committed_version(&phase1_receipt, loaded_handoff),
    Some(&saved_attempt.value),
)?;
if disposition.requires_no_execution() {
    let error = stored_handoff_error(&view, refs![loaded_handoff, saved_attempt, outcome_ref] + gap_refs, metadata.correlation_ref)?;
    stage_command_error_replay(&phase2, claimed, error).await?;
    commit_confirmed(phase2).await?;
    return Err(ProtocolError::from_stored_application_error(error));
}
stage_command_replay(&phase2, claimed, StoredCommandValue::ExecutionHandoff(view.clone()), refs![loaded_handoff, saved_attempt] + gap_refs).await?;
commit_confirmed(phase2).await?;
return accepted(view);
```

### 12.4 Transaction, errors, effects and tests

| Concern | Exact behavior |
|---|---|
| Phase 1 | Exact ref validation and domain eligibility precede write. Eligible handoff + Prepared attempt + durable claim commit together. Commit unknown is resolved before Port call; unresolved means no call. |
| Port/phase 2 | Exactly one call by the phase-1 claim owner, outside UoW. Phase 2 CAS-saves one local disposition, applicable gaps/pair and replay. Duplicates see Claimed and never call. Process crash or side-effect uncertainty is not auto-resumed. |
| Errors | Pre-Port blocked/invalidated creates no attempt and atomically stores no-execution error. Proven pre-call/local failure or formal local rejection creates terminal attempt + no-execution. `SideEffectOutcomeUnknown` creates uncertainty attempt/gap, no outcome, incomplete claim/manual recovery. |
| State/effects | Handoff Preparing -> Eligible/Blocked/Invalidated. Attempt Prepared -> exactly one of AttemptedLocally/LocallyFailed/CarrierUnavailable/MappingBlocked/CallOutcomeUnknown. No accepted/run/capture/receipt truth and no host fallback. |
| Test cuts | eligible local call accepted; local rejection; mapping/carrier blocked; invalid selection/correlation/body; pre-Port blocked; duplicate during phase 1/2; phase-1 commit unknown; crash marker remains claimed; side-effect unknown no retry/no outcome; phase-2 CAS conflict; no-host-fallback assertion. |

Stop review: exact selected refs, two-phase fence, one-call rule, uncertainty semantics, no-execution atomicity, replay and tests are closed; pass.

## 13. `CF-11 AcceptExecutionSource`

### 13.1 Entry and target

| Item | Exact contract |
|---|---|
| Entry | API/formal direct adapter, or `IF-03` after envelope validation; both re-enter the same Command |
| Request/result | `AcceptExecutionSourceRequest` -> `ToolCommandResponse<OutcomeAuditView>` when accepted; committed safe error when source is conservative/conflicting |
| Target | one immutable source assessment; accepted branch exactly one indivisible terminal outcome/audit pair; conservative/conflict branch one or more typed gaps and no guessed outcome |
| Owner/dependencies | outcome normalization service; invocation/handoff/outcome/projection/submission stores; observational `ExecutionSourceIntakePort`; UoW/idempotency/clock/ID |

### 13.2 Function call graph

```text
[Command entry / IF-03 formal re-entry]
  -> metadata/body/digest/idempotency precheck
  -> load invocation/admission/precondition/handoff + existing terminal pair
  -> ExecutionSourceIntakePort::map_source                     (no UoW)
  -> SandboxExecutionSourceRef::{from_sandbox|mapping_blocked}
  -> ExecutionSourceAssessment::{accept|reject|missing|conflicting|mapping_blocked|unverifiable}
  +-- conservative -> tx: append assessment + create gap + exact safe error
  +-- accepted:
        ToolInvocationOutcome::{succeeded|tool_failed|execution_failed|capture_failed}
        ToolAuditEntry::record
        tx: append assessment + insert_outcome_audit_pair + exact OutcomeAuditView/replay
  -> commit/resolve
```

### 13.3 Typed pseudocode

```rust
metadata.validate()?;
verify_forbidden_body_free(&request.candidate.semantic_input)?;
let digest = canonical_digest_frame(ToolCommandName::AcceptExecutionSource, &request, &metadata)?;
reserve_or_replay_precheck(scope, metadata.idempotency_key, digest).await?;
let invocation = require_some(invocation_store.get_invocation_read_bundle(&request.invocation_id).await?)?;
let precondition = handoff_store.get_precondition_read_bundle(&request.invocation_id).await?;
let existing_pair = outcome_store.get_outcome_audit_pair(&request.invocation_id).await?;
let intake_request = ExecutionSourceIntakeRequest::from_candidate(&request.candidate, request.invocation_id)?;
let resolution = source_intake.map_source(&intake_request).await;
let now = clock.now()?;
let (source_ref, assessment) = map_execution_source_resolution(
    ids.new_sandbox_execution_source_ref_id()?,
    ids.new_source_assessment_id()?,
    &invocation.invocation,
    precondition.as_ref(),
    &request.candidate,
    resolution,
    now.as_consumption_time(),
)?; // invokes exactly one ExecutionSourceAssessment factory
let accepted_pair = if assessment.permits_outcome_normalization() {
    let outcome = match request.candidate.semantic_input {
        ExecutionSourceSemanticInput::Succeeded(summary) => ToolInvocationOutcome::succeeded(
            ids.new_outcome_id()?, &invocation.invocation, &assessment, summary, now.as_outcome_time(),
        )?,
        ExecutionSourceSemanticInput::ToolFailed(error) => ToolInvocationOutcome::tool_failed(
            ids.new_outcome_id()?, &invocation.invocation, &assessment, error, now.as_outcome_time(),
        )?,
        ExecutionSourceSemanticInput::ExecutionFailed(error) => ToolInvocationOutcome::execution_failed(
            ids.new_outcome_id()?, &invocation.invocation, &assessment, error, now.as_outcome_time(),
        )?,
        ExecutionSourceSemanticInput::CaptureFailed(error) => ToolInvocationOutcome::capture_failed(
            ids.new_outcome_id()?, &invocation.invocation, &assessment, error, now.as_outcome_time(),
        )?,
    };
    let audit = ToolAuditEntry::record(
        ids.new_audit_entry_id()?, &invocation.invocation, &outcome,
        judgment_refs(&invocation, precondition.as_ref()), allowed_source_refs(source_ref.as_ref()),
        known_gap_refs(precondition.as_ref()), metadata.actor_ref,
        invocation.invocation.context_refs.correlation_ref, now.as_audit_time(),
    )?;
    Some(OutcomeAuditPair { outcome, audit_entry: audit })
} else { None };
ensure_existing_pair_compatible(existing_pair.as_ref(), accepted_pair.as_ref(), &assessment)?;
let uow = uow_manager.begin().await?;
let claim = reserve_or_replay(&uow, scope, metadata.idempotency_key, digest).await?;
let assessment_ref = require_appended_or_equal(
    outcome_store.append_source_assessment(assessment.clone(), &*uow).await?,
)?;
let gap_refs = persist_source_assessment_gaps(&assessment, existing_pair.as_ref(), &uow).await?;
if let Some(pair) = accepted_pair {
    let pair_ref = require_inserted_or_equal_or_terminal_conflict(
        outcome_store.insert_outcome_audit_pair(pair.clone(), &*uow).await?,
        &gap_refs,
    )?;
    let view = map_outcome_audit_view(OutcomeAuditViewInput::new_pair(
        &pair, pair_ref, assessment_ref, empty_safe_handoff(), gap_refs.clone(),
    ))?;
    stage_command_replay(&uow, claim, StoredCommandValue::OutcomeAudit(view.clone()), refs![assessment_ref, pair_ref] + gap_refs).await?;
    commit_confirmed(uow).await?;
    return accepted_or_duplicate(view, existing_pair.is_some());
}
let error = stored_source_error(&assessment, refs![assessment_ref] + gap_refs, metadata.correlation_ref)?;
stage_command_error_replay(&uow, claim, error).await?;
commit_confirmed(uow).await?;
return Err(ProtocolError::from_stored_application_error(error));
```

### 13.4 Transaction, errors, effects and tests

| Concern | Exact behavior |
|---|---|
| UoW/Port | Source mapping is observational and precedes UoW. Assessment/gaps plus optional indivisible pair plus exact value/error replay commit locally once. Mapping receives source event/version/authority/correlation/locator/safe semantic input; it owns no outcome. |
| Duplicate/terminal conflict | Same command key replays before Port. A different key yielding the exact existing terminal pair returns duplicate semantics and stores its own replay record; a different outcome/basis creates `TerminalConflict / IntegrityCritical`, never overwrites the pair. |
| Errors | Forbidden body/invalid envelope carrier is zero-write; blocked/missing/conflicting/unverifiable mapping commits assessment/gap/error only. Repository half-pair is integrity failure. No raw source/capture body is stored. |
| State/effects | Assessment is immutable. Accepted source creates one of four source-backed terminal classes; no-execution classes are impossible here. Outcome/audit are same-UoW; external delivery/observation/safe material remain absent. |
| Test cuts | four accepted semantic classes; authority/correlation/version/class mismatch; mapping blocked; missing optional source ref; same source different idempotency key; equal pair vs terminal conflict; half-pair corruption; append/pair rollback; IF-03/direct parity. |

Stop review: envelope-to-Port construction, conservative ref semantics, terminal normalization, outcome/audit indivisibility, duplicate/conflict and tests are closed; pass.

## 14. `CF-12 PrepareSafeExternalHandoff`

### 14.1 Entry and target

| Item | Exact contract |
|---|---|
| Entry/result | `PrepareSafeExternalHandoffRequest` -> `ToolCommandResponse<SafeExternalHandoffView>` |
| Source | closed selector: evolution fact;Binding fact/binding gap;outcome-audit pair;general gap |
| Target | one target-specific eligibility; eligible path one immutable material and exactly one matching `OF-01~04` continuation attempt; ineligible path no material/attempt |
| Owner/dependencies | safe-handoff service; exact source stores + submission/projection stores; event mapper + `SafeMaterialContinuationUseCases`; UoW/idempotency/clock/ID |

### 14.2 Function call graph

```text
[Command entry]
  -> validate/dedup -> load exact immutable source selected by closed enum
  -> SafeHandoffEligibility::evaluate(four target-specific checks)
  +-- Ineligible/Unverifiable:
  |     tx one -> reserve + append eligibility/gap + exact view/error -> commit
  +-- Eligible:
        SafeHandoffMaterial::prepare
        tx phase 1 -> reserve Claimed + append eligibility/material -> commit/resolve
        -> dispatch exact OF-01/02/03/04 continuation by material class
           (event mapper + durable Prepared attempt + one collaboration call)
        -> tx phase 2 -> reload same claim/material/attempt
           -> map SafeExternalHandoffView + complete value/error replay -> commit/resolve
```

### 14.3 Typed pseudocode

```rust
metadata.validate()?;
let digest = canonical_digest_frame(ToolCommandName::PrepareSafeExternalHandoff, &request, &metadata)?;
reserve_or_replay_precheck(scope, metadata.idempotency_key, digest).await?;
let source_read = load_safe_handoff_source(&request.source,
    contract_store, binding_store, outcome_store, projection_store).await?;
verify_exact_source_selector(&request.source, &source_read)?;
let now = clock.now()?;
let eligibility = SafeHandoffEligibility::evaluate(
    ids.new_eligibility_id()?, source_read.safe_source_refs(), source_read.fact_class(),
    &source_read, request.target, request.sensitivity, now.as_decision_time(),
)?;
if !eligibility.permits_material_preparation() {
    let uow = uow_manager.begin().await?;
    let claim = reserve_or_replay(&uow, scope, metadata.idempotency_key, digest).await?;
    let eligibility_ref = require_appended_or_equal(submission_store.append_eligibility(eligibility.clone(), &*uow).await?)?;
    let gap_refs = persist_eligibility_gaps(&eligibility, &uow).await?;
    let view = map_safe_external_handoff_view(SafeExternalHandoffViewInput::ineligible(
        eligibility_ref, &eligibility, gap_refs.clone(),
    ))?;
    let error = stored_safe_handoff_error(&view, refs![eligibility_ref] + gap_refs, metadata.correlation_ref)?;
    stage_command_error_replay(&uow, claim, error).await?;
    commit_confirmed(uow).await?;
    return Err(ProtocolError::from_stored_application_error(error));
}
let material = SafeHandoffMaterial::prepare(
    ids.new_material_id()?, &eligibility, source_read.body_free_summary(),
    source_read.minimal_correlation_refs(), source_read.local_truth_refs(),
    now.as_material_preparation_time(),
)?;
let phase1 = uow_manager.begin().await?;
let claim = reserve_or_replay(&phase1, scope, metadata.idempotency_key, digest).await?;
let eligibility_ref = require_appended_or_equal(submission_store.append_eligibility(eligibility.clone(), &*phase1).await?)?;
let material_ref = require_appended_or_equal(submission_store.append_material(material.clone(), &*phase1).await?)?;
commit_confirmed(phase1).await?; // material is committed before any event/collaboration work
let continuation = SafeMaterialContinuationInput::from_committed_material(
    material_ref, material.fact_class, material.target_class,
    derived_continuation_key(&material), metadata.correlation_ref,
)?;
let continuation_result = safe_material_continuation.continue_material(continuation).await;
let phase2 = uow_manager.begin().await?;
let claimed = require_same_claim(idempotency_store.get(&scope, &metadata.idempotency_key).await?, digest)?;
claimed.value.continue_claim(claimed.value.lease_ref()?, OperationPhase::ExternalResult, clock.now()?.as_decision_time())?;
let committed_material = require_some(submission_store.get_material(&material.material_id).await?)?;
let event = map_tool_semantic_event(&committed_material, &source_read)?;
let attempt = submission_store.find_attempt_for_event(
    &material.material_id, event.event_id(), material.target_class,
).await?;
let attempt = require_continuation_result_symmetric(continuation_result, attempt, &event)?;
let gap_refs = attempt_gap_refs(&attempt);
let view = map_safe_external_handoff_view(SafeExternalHandoffViewInput::completed(
    eligibility_ref, &eligibility, material_ref, &material, attempt.as_ref(), gap_refs.clone(),
))?;
if attempt.as_ref().is_some_and(|a| a.value.state == ExternalSubmissionAttemptState::SubmissionOutcomeUnknown) {
    idempotency_store.save_record(claimed.value, claimed.expected_version, &*phase2).await?;
    commit_confirmed(phase2).await?;
    return Err(protocol_side_effect_unknown(attempt, gap_refs)); // no duplicate submission, claim incomplete
}
if attempt.as_ref().is_some_and(|a| a.value.state != ExternalSubmissionAttemptState::SubmittedLocally) {
    let error = stored_safe_handoff_error(&view, refs![eligibility_ref, material_ref, attempt] + gap_refs, metadata.correlation_ref)?;
    stage_command_error_replay(&phase2, claimed, error).await?;
    commit_confirmed(phase2).await?;
    return Err(ProtocolError::from_stored_application_error(error));
}
stage_command_replay(&phase2, claimed, StoredCommandValue::SafeExternalHandoff(view.clone()), refs![eligibility_ref, material_ref, attempt] + gap_refs).await?;
commit_confirmed(phase2).await?;
return accepted(view);
```

### 14.4 Transaction, errors, effects and tests

| Concern | Exact behavior |
|---|---|
| Phase boundary | Exact immutable source is read first. Ineligible commits eligibility/error only. Eligible commits claim+eligibility+material before dispatch. The exact `OF-*` continuation exclusively owns attempt/event/Port sequencing; CF-12 never calls collaboration directly a second time. |
| Reentry | If claim exists with material but no attempt, the same process may invoke continuation only when it owns the pre-attempt phase; any persisted attempt prevents automatic second call. A terminal attempt lets phase 2 complete exact replay. Prepared/uncertain attempts remain in-flight/manual, never resubmit. |
| Errors | Missing/mismatched source, wrong Binding gap, relaxed sensitivity or failed four-gate check is invalid/ineligible. Route blocked/local failure commits post-truth attempt/gap/error without rolling back source/material. Side-effect unknown leaves claim incomplete. |
| State/effects | Eligibility Eligible/Ineligible/Unverifiable; material only for Eligible; attempt local state only. `SubmittedLocally` is not delivered/observed. Source truth never changes. |
| Test cuts | each of five selector variants/four material classes; source mismatch; all four safety checks independently fail; eligibility duplicate; crash before/after material; exact OF dispatch; route blocked/local failure/submitted/unknown; no double Port call; source truth survives peripheral failure. |

Stop review: all event sources, four-gate construction, truth-first material, single OF ownership, two-phase replay, uncertainty and tests are closed; pass.

## 15. `CF-13 RecordConsistencyGapResolution`

### 15.1 Entry and target

| Item | Exact contract |
|---|---|
| Entry/result | `RecordConsistencyGapResolutionRequest` -> `ToolCommandResponse<ConsistencyGapView>` or committed pending/error surface |
| Target | Open -> ResolutionPending -> Resolved when formal owner re-read proves repair; pending may re-enter verification with same evidence; subject truth is never changed |
| Owner/dependencies | integrity service; projection store + existing subject store or external observational Port selected by typed subject; UoW/idempotency/clock |

### 15.2 Function call graph

```text
[Command entry]
  -> validate/dedup -> ProjectionStore::get_gap
  -> GapResolutionEvidenceRef::from_input
  +-- Open:
  |     tx phase 1 -> reserve Claimed + ConsistencyGap::request_resolution/save -> commit
  +-- ResolutionPending + same evidence:
        verify accepts_resolution_verification;reuse durable claim/new command claim
  -> re-read exact formal owner via existing store/Port                (no UoW)
  +-- not verified/blocked: tx phase 2 -> keep Pending + exact safe error -> commit
  +-- verified:
        GapResolutionDecisionRef::verified
        ConsistencyGap::resolve
        tx phase 2 -> CAS save gap + exact view/result -> commit/resolve
```

### 15.3 Typed pseudocode

```rust
metadata.validate()?;
let digest = canonical_digest_frame(ToolCommandName::RecordConsistencyGapResolution, &request, &metadata)?;
reserve_or_replay_precheck(scope, metadata.idempotency_key, digest).await?;
let mut loaded_gap = require_some(projection_store.get_gap(&request.gap_id).await?)?;
let evidence = GapResolutionEvidenceRef::from_input(
    &request.evidence, &loaded_gap.value, request.resolution_reason,
)?;
let phase1_needed = match loaded_gap.value.state {
    ConsistencyGapState::Open => true,
    ConsistencyGapState::ResolutionPending => {
        loaded_gap.value.accepts_resolution_verification(&evidence)?;
        false
    }
    ConsistencyGapState::Resolved | ConsistencyGapState::Superseded => return Err(invalid_terminal_gap()),
};
if phase1_needed {
    let phase1 = uow_manager.begin().await?;
    let claim = reserve_or_replay(&phase1, scope, metadata.idempotency_key, digest).await?;
    loaded_gap.value.request_resolution(evidence.clone(), clock.now()?.as_decision_time())?;
    loaded_gap = projection_store.save_gap(
        loaded_gap.value, loaded_gap.expected_version, &*phase1,
    ).await?;
    commit_confirmed(phase1).await?;
}
let owner_resolution = verify_gap_owner_repair(
    &loaded_gap.value, &evidence,
    contract_store, binding_store, invocation_store, handoff_store,
    outcome_store, submission_store, shared_authority, hub_source,
    authorization_port, sandbox_port, source_intake, collaboration_port,
).await; // dispatches by closed subject kind to one existing read/method
let phase2 = uow_manager.begin().await?;
let claimed = require_same_claim(idempotency_store.get(&scope, &metadata.idempotency_key).await?, digest)?;
let current_gap = require_some(projection_store.get_gap(&request.gap_id).await?)?;
ensure_eq(current_gap.value.resolution_evidence_ref, Some(evidence.clone()))?;
match owner_resolution {
    Verified(basis) => {
        let decision = GapResolutionDecisionRef::verified(
            request.gap_id, &evidence, basis, clock.now()?.as_decision_time(),
        )?;
        let mut gap = current_gap.value;
        gap.resolve(decision, clock.now()?.as_decision_time())?;
        let saved = projection_store.save_gap(gap, current_gap.expected_version, &*phase2).await?;
        let view = map_gap_view(GapViewInput::from_loaded(&saved))?;
        stage_command_replay(&phase2, claimed, StoredCommandValue::ConsistencyGap(view.clone()), refs![saved]).await?;
        commit_confirmed(phase2).await?;
        return accepted(view);
    }
    NotVerified(safe_reason) | Blocked(safe_reason) | Unavailable(safe_reason) => {
        let view = map_gap_view(GapViewInput::from_loaded(&current_gap))?;
        let error = stored_gap_resolution_error(&view, safe_reason, refs![current_gap], metadata.correlation_ref)?;
        stage_command_error_replay(&phase2, claimed, error).await?;
        commit_confirmed(phase2).await?;
        return Err(ProtocolError::from_stored_application_error(error));
    }
}
```

### 15.4 Transaction, errors, effects and tests

| Concern | Exact behavior |
|---|---|
| Phase 1 | Open -> Pending plus durable evidence ref and claim commits before owner verification. Commit unknown resolves before any external read. Existing pending with same evidence may recheck; different evidence conflicts. |
| Owner read/phase 2 | Closed subject-kind router invokes only an existing store read or observational Port and compares authority/subject/revision/locator. Verified decision is deterministic and CAS-saves Resolved. Negative result leaves Pending and completes a safe error for that command key. |
| Errors/reentry | Text/body/alias/run/signoff evidence is unrepresentable. Missing/terminal gap, owner mismatch, blocked/unavailable read, evidence conflict and concurrent supersede are explicit. A later recheck needs a new command key and the same evidence ref; it never repairs the subject. |
| State/effects | Open -> ResolutionPending -> Resolved, or Open/Pending -> Superseded only by its separate owning detection path. Only gap truth/result changes; no source subject, external owner truth or evidence body is written. |
| Test cuts | local owner verified; each external owner blocked/unavailable; evidence subject/revision mismatch; pending same evidence recheck; different evidence conflict; concurrent supersede/version conflict; phase-1/2 commit unknown; fake no evidence/run/signoff assertions. |

Stop review: evidence schema, two-phase owner verification, pending reentry, CAS resolution, no-repair boundary, replay and tests are closed; pass.

## 16. Command family audit

| Audit item | Result | Closure |
|---|---|---|
| Inventory | pass | `CF-01~13` all have independent entry/graph/pseudocode/UoW/error/effect/test sections. |
| DTO -> object/Port | pass | Every caller field, generated ID/time, store read and external request source is named; no pre-resolved candidate is required. |
| UoW/commit | pass | Local atomic sets use one UoW; CF-10/12/13 named multi-phase boundaries persist their marker before external work and resolve commit unknown. |
| Side effects | pass | Only Sandbox handoff and event collaboration are side-effecting; each has durable fence, at-most-one automatic call and outcome-unknown/manual branch. |
| State | pass | All transitions use Step 6 states; immutable assessments/admissions/outcomes never flip; no external lifecycle state enters L2. |
| Exact replay | pass | Closed typed value/error snapshot + authority candidate/receipt; mutable current truth is never used to reconstruct historical result. |
| Gaps/stale | pass | Typed gap classes; bounded first-page stale propagation with explicit continuation; gap resolution never repairs subject. |
| Event reachability | pass | CF-12 closed source union covers all four material/event classes and delegates exactly one OF branch. |
| Blockers | pass | Authorization/Sandbox/Bus/Observability/Core/SDK positive readiness remains unclaimed; production affected paths block/fail closed. |
| Historical pollution | pass | No registry/policy/executor/host fallback/HTTP/RPC/database/broker/scheduler/client/run/evidence assumptions restored. |

Command Batch 1 gate: pass. Next allowed Step 9 action is `QF-01~11`; formal 03 remains write-closed.
