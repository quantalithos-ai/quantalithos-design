# L2-tools Step 9 函数流附录: 11 Query flows

> 状态: completed / pass
> 主文件: `03_ddd_step_09_function_flows.md`
> 入口: `api::ToolQueryUseCases::handle`
> 共同门禁: `QueryMetadata` 校验、visibility resolver、response symmetry 见 Step 8 shared/query annex；所有 Query 固定为零 UoW、零写入、零 external Port、零 refresh/rebuild/repair。

## 1. Query batch inventory

| Flow | Query | Read class | Main read | Result shape | Stop |
|---|---|---|---|---|---|
| `QF-01` | `GetToolContract` | T1 | current contract bundle | single truth view | pass |
| `QF-02` | `CompareToolDefinitionRevisions` | T1 direct | two definitions + impact | computed fresh single view | pass |
| `QF-03` | `GetCapabilityBinding` | T1 | relation + selected assessment | single truth view | pass |
| `QF-04` | `GetToolInvocation` | T2 | invocation read bundle | single truth view | pass |
| `QF-05` | `GetExecutionPreconditionView` | T2 | invocation + precondition bundle | single truth view | pass |
| `QF-06` | `GetOutcomeAudit` | T2 | pair + local submission refs | empty or single truth view | pass |
| `QF-07` | `GetReferenceConsistencyReport` | D1 | deterministic report key | derived single view | pass |
| `QF-08` | `SearchToolContracts` | D1 | scoped projection page | derived page | pass |
| `QF-09` | `CompareToolContracts` | D1 | deterministic diff key | derived single view | pass |
| `QF-10` | `GetToolDiagnostic` | D1 | deterministic diagnostic key | derived single view | pass |
| `QF-11` | `GetToolConsumerGuidance` | D1 | deterministic guidance key | derived single view | pass |

## 2. Per-flow conventions

- `resolve_visibility(...)` expands only to `QueryMetadata::validate`, `QueryMetadata::visibility_input` and `ReadVisibilityResolverPort::resolve`. It is an application-owned read-boundary decision, not authorization policy truth and not an external runtime Port.
- `query_response(...)` and `query_page_response(...)` are pure `application::mapping` constructors. They enforce Step 8 disposition/value/freshness/watermark/cursor symmetry and cannot read, write or refresh anything.
- `require_some`, `ensure_*`, `map_*`, `derive_*`, `canonical_*`, `encode_*` and `*_key` names below are pure validation/selection/mapping or deterministic typed construction over request fields and named store results. Every repository call is shown explicitly.
- A subject Query first reads only the owner-scope locator needed for visibility. `NotFound`, `Forbidden` or resolver `Unavailable` stops before value/bundle reads. Collection Query visibility derives from its typed requested scope and metadata, never from returned rows.
- Repository `NotFound` maps according to each protocol (`NotFound` for addressable T1/T2 subject, `Empty` for optional result/D1 material). `RepositoryError` never falls back to another store or live external system.

## 3. `QF-01 GetToolContract`

### 3.1 Entry and target

| Item | Exact contract |
|---|---|
| Entry/result | `ToolQueryUseCases::handle(GetToolContractRequest, QueryMetadata)` -> `ToolQueryResponse<ToolContractView>` |
| Reads | `ToolContractStore::get_contract_owner_scope`, then `get_current_bundle` |
| Mapper | `ToolContractView::project` through the Step 8 pure view mapper |
| State/effects | none; truth view uses `freshness=None` and never resolves definition source |

### 3.2 Function call graph

```text
[Query entry]
  -> QueryMetadata::validate + request.validate
  -> ToolContractStore::get_contract_owner_scope
  -> ReadVisibilityResolverPort::resolve
     -> NotFound/Forbidden/Unavailable: typed empty surface, stop
  -> ToolContractStore::get_current_bundle
  -> validate contract/current-definition/evolution-head/watermark symmetry
  -> ToolContractView::project
  -> ToolQueryResponse::Found(value, freshness=None)
```

### 3.3 Typed pseudocode

```rust
metadata.validate()?;
request.validate()?;
let owner_scope = match contract_store.get_contract_owner_scope(&request.tool_id).await? {
    Some(scope) => scope,
    None => return query_response::not_found(ToolQueryName::GetToolContract, metadata.correlation_ref),
};
let visibility = resolve_visibility(&metadata, owner_scope, TypedSubjectRef::ToolContract(request.tool_id)).await?;
if !visibility.value_permitted() {
    return query_response::from_visibility(ToolQueryName::GetToolContract, visibility, metadata.correlation_ref);
}
let bundle = match contract_store.get_current_bundle(&request.tool_id).await? {
    Some(bundle) => bundle,
    None => return Err(integrity_missing_visible_contract(request.tool_id, metadata.correlation_ref)),
};
ensure_current_bundle_symmetric(&bundle, request.tool_id)?;
let view = ToolContractView::project(
    &bundle.contract.value, &bundle.current_definition.value,
    bundle.evolution_head, visibility.consumption_visibility(),
)?;
return query_response::found_truth(
    ToolQueryName::GetToolContract, view, bundle.source_watermark, metadata.correlation_ref,
);
```

### 3.4 Errors, effects and tests

| Concern | Exact behavior |
|---|---|
| Errors | invalid metadata/ID -> invalid input; owner missing -> `NotFound`; forbidden stays `NotVisible`; resolver/store unavailable -> `Unavailable`; visible owner with missing/mismatched current bundle -> integrity failure. |
| Effects | zero UoW/store write/external call; no source authority resolution, gap repair or projection fallback. |
| Test cuts | found active/pending/retired lifecycle; owner missing; not visible; resolver unavailable; missing current definition; pointer mismatch; evolution head optional; store failure; assert no writes/external calls. |

Stop review: owner seed, visibility, exact bundle, pure view mapping, error surface and zero-effect tests are closed; pass.

## 4. `QF-02 CompareToolDefinitionRevisions`

### 4.1 Entry and target

| Item | Exact contract |
|---|---|
| Entry/result | `CompareToolDefinitionRevisionsRequest` -> `ToolQueryResponse<ToolContractDiffView>` |
| Reads | owner scope; base definition; target definition; optional matching impact |
| Domain call | `ToolContractDiffSummary::compare` with one adapter-issued comparable read watermark |
| Boundary | computes a fresh direct diff; never reads/writes D1 diff projection and never adopts a revision |

### 4.2 Function call graph

```text
[Query entry]
  -> validate directional pair
  -> get_contract_owner_scope -> visibility resolve
  -> ToolContractStore::get_definition_comparison_bundle
  -> validate same-tool/directional-pair/optional-impact/common-watermark
  -> ToolContractDiffSummary::compare
  -> map ToolContractDiffView(Fresh) -> Found
```

### 4.3 Typed pseudocode

```rust
metadata.validate()?;
request.validate_directional_pair()?;
let owner_scope = match contract_store.get_contract_owner_scope(&request.tool_id).await? {
    Some(scope) => scope,
    None => return query_response::not_found(ToolQueryName::CompareToolDefinitionRevisions, metadata.correlation_ref),
};
let visibility = resolve_visibility(&metadata, owner_scope, TypedSubjectRef::ToolContract(request.tool_id)).await?;
if !visibility.value_permitted() {
    return query_response::from_visibility(ToolQueryName::CompareToolDefinitionRevisions, visibility, metadata.correlation_ref);
}
let bundle = match contract_store.get_definition_comparison_bundle(
    &request.tool_id, request.base_revision, request.target_revision,
).await? {
    Some(bundle) => bundle,
    None => return query_response::not_found(ToolQueryName::CompareToolDefinitionRevisions, metadata.correlation_ref),
};
ensure_definition_pair(&bundle.base_definition.value, &bundle.target_definition.value, request.tool_id,
    request.base_revision, request.target_revision)?;
ensure_optional_impact_pair(bundle.matching_impact.as_ref(),
    &bundle.base_definition.value, &bundle.target_definition.value)?;
let diff = ToolContractDiffSummary::compare(
    &bundle.base_definition.value, &bundle.target_definition.value,
    bundle.matching_impact.as_ref(), bundle.source_watermark,
)?;
let view = map_contract_diff_view(&diff, FreshnessState::Fresh)?;
return query_response::found_derived(
    ToolQueryName::CompareToolDefinitionRevisions, view, bundle.source_watermark,
    visibility.consumption_visibility(), metadata.correlation_ref,
);
```

### 4.4 Errors, effects and tests

| Concern | Exact behavior |
|---|---|
| Errors | equal/invalid revision pair -> invalid input; either definition missing -> `NotFound`; impact pair mismatch or incomparable read frame -> integrity failure; store/resolver failure -> unavailable/typed internal safe failure. |
| Effects | zero writes; stable diff ID is deterministic; reversed pair is a distinct identity; no D1 read/write, impact creation, approval or adoption. |
| Test cuts | changed/empty diff; impact present/absent; missing base/target; reverse pair; mismatched impact; incomparable watermark; visibility branches; assert `ProjectionStore` and UoW untouched. |

Stop review: directional DTO, two-definition source, optional impact, deterministic fresh diff, zero-effect boundary and tests are closed; pass.

## 5. `QF-03 GetCapabilityBinding`

### 5.1 Entry and target

| Item | Exact contract |
|---|---|
| Entry/result | `GetCapabilityBindingRequest` -> `ToolQueryResponse<CapabilityBindingView>` |
| Selection | `ByBindingId` or `CurrentByToolId`; assessment is `LatestApplicable`, `Exact` or `None` |
| Reads | relation, owner scope, selected assessment/snapshot, bounded subject gaps |
| Boundary | no Hub call and no new assessment/snapshot; explicit-unbound remains a formal relation |

### 5.2 Function call graph

```text
[Query entry]
  -> validate selector/assessment
  -> CapabilityBindingStore::get_binding | find_current_by_tool
  -> CapabilityBindingStore::get_binding_owner_scope
  -> ReadVisibilityResolverPort::resolve
  -> get_latest_assessment_for_binding | get_assessment | none
  -> get_snapshot when assessment references one
  -> ProjectionStore::list_gaps(one bounded binding scope)
  -> CapabilityBindingView::project -> Found
```

### 5.3 Typed pseudocode

```rust
metadata.validate()?;
request.validate()?;
let binding = match request.selector {
    CapabilityBindingSelector::ByBindingId(ref id) => binding_store.get_binding(id).await?,
    CapabilityBindingSelector::CurrentByToolId(ref id) => binding_store.find_current_by_tool(id).await?,
};
let binding = match binding {
    Some(value) => value,
    None => return query_response::not_found(ToolQueryName::GetCapabilityBinding, metadata.correlation_ref),
};
ensure_selector_matches_binding(&request.selector, &binding.value)?;
let owner_scope = require_some(binding_store.get_binding_owner_scope(&binding.value.binding_id).await?)?;
let visibility = resolve_visibility(
    &metadata, owner_scope, TypedSubjectRef::CapabilityBinding(binding.value.binding_id),
).await?;
if !visibility.value_permitted() {
    return query_response::from_visibility(ToolQueryName::GetCapabilityBinding, visibility, metadata.correlation_ref);
}
let assessment = match request.assessment {
    BindingAssessmentSelection::LatestApplicable => binding_store
        .get_latest_assessment_for_binding(&binding.value.binding_id).await?,
    BindingAssessmentSelection::Exact(ref assessment_ref) => binding_store.get_assessment(assessment_ref).await?,
    BindingAssessmentSelection::None => None,
};
ensure_selected_assessment_matches(assessment.as_ref(), &binding.value, &request.assessment)?;
let snapshot = match assessment.as_ref().and_then(|a| a.snapshot_ref.as_ref()) {
    Some(snapshot_ref) => binding_store.get_snapshot(snapshot_ref).await?,
    None => None,
};
ensure_assessment_snapshot_symmetric(assessment.as_ref(), snapshot.as_ref())?;
let gap_page = projection_store.list_gaps(
    ConsistencyGapQueryScope::binding(binding.value.binding_id),
    one_page_for_subject(binding.value.binding_id),
).await?;
let gap_refs = require_complete_bounded_subject_gaps(gap_page)?;
let view = CapabilityBindingView::project(
    &binding.value, assessment.as_ref(), snapshot.as_ref(), gap_refs,
    visibility.consumption_visibility(),
)?;
return query_response::found_truth(
    ToolQueryName::GetCapabilityBinding, view, None, metadata.correlation_ref,
);
```

### 5.4 Errors, effects and tests

| Concern | Exact behavior |
|---|---|
| Errors | selector missing -> `NotFound`; owner-scope absence, exact assessment/binding mismatch, snapshot mismatch or incomplete bounded gap surface -> integrity failure; resolver/store error -> unavailable/safe failure. |
| Effects | none; terminal binding is readable only by exact ID; current-by-tool excludes terminal history; `None` assessment does not mean explicit-unbound. |
| Test cuts | bound/explicit-unbound; exact ID terminal history; current selection; latest/exact/none assessment; missing exact assessment; conflicting latest ordering; snapshot mismatch; gap page overflow; visibility branches; no Hub call/write. |

Stop review: selector semantics, selected assessment/snapshot identity, visible gaps, explicit-unbound and zero-Hub boundary are closed; pass.

## 6. `QF-04 GetToolInvocation`

### 6.1 Entry and target

| Item | Exact contract |
|---|---|
| Entry/result | `GetToolInvocationRequest` -> `ToolQueryResponse<ToolInvocationView>` |
| Reads | invocation owner scope, then `ToolInvocationStore::get_invocation_read_bundle` |
| Mapper | invocation + matching immutable admission + optional local outcome ref + visibility |
| Boundary | missing outcome remains `None`; no Runtime/Sandbox lookup or terminal inference |

### 6.2 Function call graph

```text
[Query entry]
  -> validate -> get_invocation_owner_scope
  -> ReadVisibilityResolverPort::resolve
  -> ToolInvocationStore::get_invocation_read_bundle
  -> validate invocation/admission/outcome-ref/watermark symmetry
  -> ToolInvocationView::project -> Found
```

### 6.3 Typed pseudocode

```rust
metadata.validate()?;
request.validate()?;
let owner_scope = match invocation_store.get_invocation_owner_scope(&request.invocation_id).await? {
    Some(scope) => scope,
    None => return query_response::not_found(ToolQueryName::GetToolInvocation, metadata.correlation_ref),
};
let visibility = resolve_visibility(
    &metadata, owner_scope, TypedSubjectRef::ToolInvocation(request.invocation_id),
).await?;
if !visibility.value_permitted() {
    return query_response::from_visibility(ToolQueryName::GetToolInvocation, visibility, metadata.correlation_ref);
}
let bundle = match invocation_store.get_invocation_read_bundle(&request.invocation_id).await? {
    Some(bundle) => bundle,
    None => return Err(integrity_missing_visible_invocation(request.invocation_id, metadata.correlation_ref)),
};
ensure_invocation_bundle_symmetric(&bundle, request.invocation_id)?;
let view = ToolInvocationView::project(
    &bundle.invocation, &bundle.admission, bundle.outcome_ref,
    visibility.consumption_visibility(),
)?;
return query_response::found_truth(
    ToolQueryName::GetToolInvocation, view, bundle.source_watermark,
    metadata.correlation_ref,
);
```

### 6.4 Errors, effects and tests

| Concern | Exact behavior |
|---|---|
| Errors | missing owner -> `NotFound`; visible owner/missing bundle, admission mismatch or alien outcome ref -> integrity failure; not-visible/unavailable are typed surfaces. |
| Effects | zero writes/Port calls; reads no outcome body, external attempt lifecycle, Sandbox capture or Runtime state. |
| Test cuts | admitted/rejected/awaiting admission; outcome ref present/absent; owner missing; visibility branches; admission mismatch; alien outcome ref; store failure; assert no external/UoW use. |

Stop review: local bundle identity, immutable admission, optional outcome ref, no terminal inference and test surface are closed; pass.

## 7. `QF-05 GetExecutionPreconditionView`

### 7.1 Entry and target

| Item | Exact contract |
|---|---|
| Entry/result | `GetExecutionPreconditionViewRequest` -> `ToolQueryResponse<ExecutionPreconditionView>` |
| Reads | invocation owner/bundle, then optional `ExecutionHandoffStore::get_precondition_read_bundle` |
| Mapper | exact requirement, selected authorization/readiness, latest handoff/attempt, optional no-execution outcome ref |
| Empty-evaluation rule | an existing visible invocation without evaluation returns `Found` with an `ExecutionPreconditionView` whose optional evaluation fields are empty; it is not Query `Empty`/`NotFound` |

### 7.2 Function call graph

```text
[Query entry]
  -> validate -> ToolInvocationStore::get_invocation_owner_scope
  -> ReadVisibilityResolverPort::resolve
  -> ToolInvocationStore::get_invocation_read_bundle
  -> ExecutionHandoffStore::get_precondition_read_bundle
     +-- none: map empty-evaluation view from invocation/admission context
     +-- some: validate requirement/auth/readiness/handoff/attempt/outcome-ref symmetry
  -> map_precondition_view -> Found
```

### 7.3 Typed pseudocode

```rust
metadata.validate()?;
request.validate()?;
let owner_scope = match invocation_store.get_invocation_owner_scope(&request.invocation_id).await? {
    Some(scope) => scope,
    None => return query_response::not_found(
        ToolQueryName::GetExecutionPreconditionView, metadata.correlation_ref,
    ),
};
let visibility = resolve_visibility(
    &metadata, owner_scope, TypedSubjectRef::ToolInvocation(request.invocation_id),
).await?;
if !visibility.value_permitted() {
    return query_response::from_visibility(
        ToolQueryName::GetExecutionPreconditionView, visibility, metadata.correlation_ref,
    );
}
let invocation = match invocation_store.get_invocation_read_bundle(&request.invocation_id).await? {
    Some(bundle) => bundle,
    None => return Err(integrity_missing_visible_invocation(
        request.invocation_id, metadata.correlation_ref,
    )),
};
ensure_invocation_bundle_symmetric(&invocation, request.invocation_id)?;
let precondition = handoff_store.get_precondition_read_bundle(&request.invocation_id).await?;
let (input, watermark) = match precondition {
    None => (
        PreconditionViewInput::not_evaluated(
            request.invocation_id, &invocation.admission,
            visibility.consumption_visibility(),
        )?,
        invocation.source_watermark,
    ),
    Some(bundle) => {
        ensure_precondition_bundle_symmetric(
            &bundle, &invocation.invocation, &invocation.admission,
        )?;
        ensure_comparable_watermarks(invocation.source_watermark, bundle.source_watermark)?;
        (
            PreconditionViewInput::from_read_bundle(
                request.invocation_id, &bundle,
                visibility.consumption_visibility(),
            )?,
            bundle.source_watermark,
        )
    }
};
let view = map_precondition_view(input)?;
return query_response::found_truth(
    ToolQueryName::GetExecutionPreconditionView, view, watermark,
    metadata.correlation_ref,
);
```

### 7.4 Errors, effects and tests

| Concern | Exact behavior |
|---|---|
| Errors | invocation missing -> `NotFound`; visible invocation without matching admission, alien requirement/assessment/readiness/handoff/attempt/outcome ref, or incomparable local read frame -> integrity failure; store/resolver unavailable -> `Unavailable`. |
| Effects | zero writes and no authorization/Sandbox Port calls; stale or blocked stored assessments remain visible conservative summaries and are never refreshed by Query. |
| Test cuts | never evaluated `Found` with empty optionals; requirement only; auth/readiness present; eligible/blocked/invalidated handoff; each attempt terminal and outcome-unknown; no-execution ref; alien ref/mismatched watermark; visibility/error branches; no refresh/write. |

Stop review: existing-invocation empty evaluation, exact bundle symmetry, conservative assessment visibility, no-execution ref and zero-refresh boundary are closed; pass.

## 8. `QF-06 GetOutcomeAudit`

### 8.1 Entry and target

| Item | Exact contract |
|---|---|
| Entry/result | `GetOutcomeAuditRequest` -> `ToolQueryResponse<OutcomeAuditView>` |
| Reads | invocation owner/bundle; atomic outcome/audit pair; closed-target local eligibility/material/attempt/status reads; bounded gaps |
| Empty rule | visible invocation with no pair -> `Empty`; store half-pair -> integrity failure and no partial value |
| Boundary | only committed local refs are shown; no Bus/Observability/Sandbox feedback Port and no external-state inference |

### 8.2 Function call graph

```text
[Query entry]
  -> validate -> invocation owner -> visibility resolve
  -> ToolInvocationStore::get_invocation_read_bundle
  -> OutcomeAuditStore::get_outcome_audit_pair
     +-- none: Empty
     +-- serialization half-pair: integrity failure
  -> for each closed ExternalCollaborationClass target:
       ExternalSubmissionStore::find_eligibility
       -> find_material_for_eligibility
       -> derive deterministic event identity
       -> find_attempt_for_event
       -> get_latest_bus_status / get_latest_observation_status as applicable
  -> ProjectionStore::list_gaps(one bounded invocation scope)
  -> map_outcome_audit_view -> Found
```

### 8.3 Typed pseudocode

```rust
metadata.validate()?;
request.validate()?;
let owner_scope = match invocation_store.get_invocation_owner_scope(&request.invocation_id).await? {
    Some(scope) => scope,
    None => return query_response::not_found(ToolQueryName::GetOutcomeAudit, metadata.correlation_ref),
};
let visibility = resolve_visibility(
    &metadata, owner_scope, TypedSubjectRef::ToolInvocation(request.invocation_id),
).await?;
if !visibility.value_permitted() {
    return query_response::from_visibility(ToolQueryName::GetOutcomeAudit, visibility, metadata.correlation_ref);
}
let invocation = match invocation_store.get_invocation_read_bundle(&request.invocation_id).await? {
    Some(bundle) => bundle,
    None => return Err(integrity_missing_visible_invocation(
        request.invocation_id, metadata.correlation_ref,
    )),
};
ensure_invocation_bundle_symmetric(&invocation, request.invocation_id)?;
let pair = match outcome_store.get_outcome_audit_pair(&request.invocation_id).await? {
    Some(pair) => pair,
    None => {
        ensure_eq(invocation.outcome_ref, None)?;
        return query_response::empty_visible(
            ToolQueryName::GetOutcomeAudit, visibility.consumption_visibility(),
            Some(invocation.source_watermark), metadata.correlation_ref,
        );
    }
};
ensure_outcome_audit_pair_symmetric(&pair, &invocation.invocation, invocation.outcome_ref)?;
let source_key = SafeHandoffSourceKey::outcome_audit(
    pair.outcome.outcome_id, pair.audit_entry.audit_entry_id,
)?;
let mut handoff_reads = Vec::new();
for target in ExternalCollaborationClass::closed_values() {
    let eligibility = submission_store.find_eligibility(&source_key, target).await?;
    let material = match eligibility.as_ref() {
        Some(value) => submission_store.find_material_for_eligibility(&value.eligibility_id).await?,
        None => None,
    };
    ensure_eligibility_material_symmetric(eligibility.as_ref(), material.as_ref(), &source_key, target)?;
    let attempt = match material.as_ref() {
        Some(value) => {
            let event = map_tool_semantic_event_from_material(value)?;
            submission_store.find_attempt_for_event(
                &value.material_id, &event.event_id, target,
            ).await?
        }
        None => None,
    };
    ensure_attempt_material_symmetric(attempt.as_ref(), material.as_ref(), target)?;
    let bus_status = match attempt.as_ref().filter(|a| target.accepts_bus_status()) {
        Some(value) => submission_store.get_latest_bus_status(&value.value.attempt_id).await?,
        None => None,
    };
    let observation_status = match attempt.as_ref().filter(|a| target.accepts_observation_status()) {
        Some(value) => submission_store.get_latest_observation_status(&value.value.attempt_id).await?,
        None => None,
    };
    ensure_external_status_refs_symmetric(
        attempt.as_ref(), bus_status.as_ref(), observation_status.as_ref(), target,
    )?;
    handoff_reads.push(SafeHandoffRead::new(
        target, eligibility, material, attempt, bus_status, observation_status,
    )?);
}
let gap_page = projection_store.list_gaps(
    ConsistencyGapQueryScope::invocation(request.invocation_id),
    one_page_for_subject(request.invocation_id),
).await?;
let gap_refs = require_complete_bounded_subject_gaps(gap_page)?;
let view = map_outcome_audit_view(OutcomeAuditViewInput::from_query(
    &pair, handoff_reads, gap_refs, visibility.consumption_visibility(),
)?)?;
return query_response::found_truth(
    ToolQueryName::GetOutcomeAudit, view, None, metadata.correlation_ref,
);
```

### 8.4 Errors, effects and tests

| Concern | Exact behavior |
|---|---|
| Errors | missing invocation -> `NotFound`; missing pair -> visible `Empty`; half pair, pair/outcome-ref mismatch, material without eligibility, attempt/event mismatch, conflicting latest external refs or incomplete bounded gap page -> integrity failure/degraded typed surface, never partial inference. |
| Effects | zero writes/UoW/external calls; eligibility/material/attempt/status are local immutable/versioned refs only. `SubmittedLocally`, delivered and observed remain independent. |
| Test cuts | six terminal outcome classes; nonterminal empty; repository half-pair; outcome-ref mismatch; no safe handoff; each closed target; eligibility-only/material-only/prepared/terminal attempt; route blocked/outcome unknown; Bus/Observation ref absent/present/stale/conflicting; gap overflow; assert no external Port. |

Stop review: atomic pair/empty distinction, bounded closed-target expansion, external-ref layering, integrity failures and zero-external boundary are closed; pass.

## 9. `QF-07 GetReferenceConsistencyReport`

### 9.1 Entry and target

| Item | Exact contract |
|---|---|
| Entry/result | `GetReferenceConsistencyReportRequest` -> `ToolQueryResponse<ReferenceConsistencyReportView>` |
| Key | canonical inspection-scope digest + `Exact(requested_watermark)` or `LatestCompleted` + fixed report schema version |
| Read | `ProjectionStore::get_consistency_report` -> `ProjectionRead<ReferenceConsistencyReport>` |
| Boundary | reads an already-built D1 report only; never scans assessments/gaps or starts a report Job |

### 9.2 Function call graph

```text
[Query entry]
  -> validate/canonicalize ReferenceInspectionScope
  -> map local owner scope -> ReadVisibilityResolverPort::resolve
  -> ReferenceConsistencyReportKey::new(scope, watermark selector, schema)
  -> ProjectionStore::get_consistency_report
     +-- Missing: Empty
     +-- Readable Current/Partial + Fresh: Found
     +-- Readable Stale or carrier Stale: Stale with safe value
     +-- report Failed or carrier Failed: Failed, no value
     +-- Rebuilding/Unavailable: matching no-value surface
```

### 9.3 Typed pseudocode

```rust
metadata.validate()?;
request.scope.validate()?;
let canonical_scope = request.scope.canonicalize()?;
let owner_scope = local_owner_scope_for_inspection(&canonical_scope, &metadata.consumer.requested_scope)?;
let visibility = resolve_visibility(
    &metadata, owner_scope, TypedSubjectRef::ReferenceInspection(canonical_scope.digest()),
).await?;
if !visibility.value_permitted() {
    return query_response::from_visibility(
        ToolQueryName::GetReferenceConsistencyReport, visibility, metadata.correlation_ref,
    );
}
let selector = match request.requested_watermark {
    Some(value) => ProjectionWatermarkSelector::Exact(value),
    None => ProjectionWatermarkSelector::LatestCompleted,
};
let key = ReferenceConsistencyReportKey::new(
    canonical_scope.clone(), selector, REPORT_SCHEMA_V1,
)?;
let read = projection_store.get_consistency_report(&key).await?;
match read {
    ProjectionRead::Missing => query_response::empty_visible(
        ToolQueryName::GetReferenceConsistencyReport,
        visibility.consumption_visibility(), None, metadata.correlation_ref,
    ),
    ProjectionRead::Readable { value, source_watermark, freshness, gap_refs } => {
        ensure_report_key_and_surface_symmetric(
            &value, &key, source_watermark, freshness, &gap_refs,
        )?;
        match (value.state, freshness) {
            (DerivedReportState::Current, ReadableFreshness::Fresh)
            | (DerivedReportState::Partial, ReadableFreshness::Fresh) => {
                let view = map_consistency_report_view(&value)?;
                query_response::found_derived(
                    ToolQueryName::GetReferenceConsistencyReport, view, source_watermark,
                    visibility.consumption_visibility(), metadata.correlation_ref,
                )
            }
            (DerivedReportState::Current, ReadableFreshness::Stale)
            | (DerivedReportState::Partial, ReadableFreshness::Stale)
            | (DerivedReportState::Stale, _) => {
                let view = map_consistency_report_view(&value)?;
                query_response::stale_derived(
                    ToolQueryName::GetReferenceConsistencyReport, view, source_watermark,
                    visibility.consumption_visibility(), union_gap_refs(value.gap_refs, gap_refs)?,
                    metadata.correlation_ref,
                )
            }
            (DerivedReportState::Failed, _) => query_response::failed_no_value(
                ToolQueryName::GetReferenceConsistencyReport, Some(source_watermark),
                visibility.consumption_visibility(), union_gap_refs(value.gap_refs, gap_refs)?,
                metadata.correlation_ref,
            ),
        }
    }
    ProjectionRead::Rebuilding { source_watermark, gap_refs } => query_response::rebuilding(
        ToolQueryName::GetReferenceConsistencyReport, source_watermark,
        visibility.consumption_visibility(), gap_refs, metadata.correlation_ref,
    ),
    ProjectionRead::Unavailable { source_watermark, gap_refs } => query_response::unavailable(
        ToolQueryName::GetReferenceConsistencyReport, source_watermark,
        visibility.consumption_visibility(), gap_refs, metadata.correlation_ref,
    ),
    ProjectionRead::Failed { source_watermark, gap_refs } => query_response::failed_no_value(
        ToolQueryName::GetReferenceConsistencyReport, source_watermark,
        visibility.consumption_visibility(), gap_refs, metadata.correlation_ref,
    ),
}
```

### 9.4 Errors, effects and tests

| Concern | Exact behavior |
|---|---|
| Errors | invalid/overbroad scope or incomparable exact watermark -> invalid input; resolver failure -> unavailable; key/value/scope/watermark/state/payload mismatch -> integrity failure; repository technical failure has typed safe mapping. |
| Effects | zero writes/UoW/external calls; `LatestCompleted` resolves a persisted index only; `Partial` exposes its gap refs and never means complete closure. |
| Test cuts | exact/latest current; partial; stale report/read surface; object/carrier failed; missing; rebuilding; unavailable; scope/key/watermark mismatch; not visible; assert no assessment scan/rebuild call. |

Stop review: deterministic key, persisted latest resolution, all D1 states, payload symmetry and no-build boundary are closed; pass.

## 10. `QF-08 SearchToolContracts`

### 10.1 Entry and target

| Item | Exact contract |
|---|---|
| Entry/result | `SearchToolContractsRequest` -> `ToolPageResponse<ToolContractSearchItem>` |
| Scope/key | canonical safe filter + consumer requested scope + projection schema; initial page uses `LatestCompleted`, cursor binds resolved watermark/filter/sort position |
| Read | `ProjectionStore::search_tool_contracts` -> `ProjectionPageRead<ToolContractSearchProjection>` |
| Boundary | D1 search only; no T1 list scan, provider inventory, marketplace, policy or authorization search |

### 10.2 Function call graph

```text
[Query entry]
  -> validate/canonicalize safe filter + PageRequest
  -> map collection owner scope -> ReadVisibilityResolverPort::resolve
  -> decode/validate public cursor or select LatestCompleted
  -> construct ToolContractSearchScope + RepositoryPageRequest
  -> ProjectionStore::search_tool_contracts
     +-- Readable page: validate scope/filter/order/watermark/item freshness
         -> map items + opaque next cursor -> Found/Empty/Stale
     +-- Rebuilding/Unavailable/Failed: no-item matching surface
```

### 10.3 Typed pseudocode

```rust
metadata.validate()?;
request.filter.validate()?;
request.page.validate()?;
let filter = request.filter.canonicalize()?;
let filter_digest = canonical_search_filter_digest(&filter)?;
let owner_scope = local_owner_scope_for_search(&metadata.consumer.requested_scope, &filter)?;
let visibility = resolve_visibility(
    &metadata, owner_scope, TypedSubjectRef::ToolContractSearch(
        canonical_search_scope_digest(&metadata.consumer.requested_scope, filter_digest)?,
    ),
).await?;
if !visibility.value_permitted() {
    return query_page_response::from_visibility(
        ToolQueryName::SearchToolContracts, visibility, metadata.correlation_ref,
    );
}
let cursor = decode_search_cursor(
    request.page.cursor.as_ref(), ToolQueryName::SearchToolContracts,
    filter_digest, SEARCH_PROJECTION_SCHEMA_V1,
)?;
let watermark_selector = cursor.as_ref()
    .map(|value| ProjectionWatermarkSelector::Exact(value.source_watermark))
    .unwrap_or(ProjectionWatermarkSelector::LatestCompleted);
let scope = ToolContractSearchScope::new(
    metadata.consumer.requested_scope, filter.clone(), filter_digest,
    watermark_selector, SEARCH_PROJECTION_SCHEMA_V1,
)?;
let repository_page = RepositoryPageRequest::from_public(
    cursor, request.page.limit, filter_digest,
)?;
match projection_store.search_tool_contracts(scope.clone(), repository_page).await? {
    ProjectionPageRead::Readable { page, freshness, gap_refs } => {
        ensure_search_page_symmetric(&scope, &filter, &page, freshness, &gap_refs)?;
        ensure_stable_unique_order(&page.items, SearchOrder::SafeLabelThenToolId)?;
        let items = page.items.iter()
            .map(map_contract_search_item)
            .collect::<Result<Vec<_>, MappingError>>()?;
        let aggregate = aggregate_readable_freshness(
            freshness, items.iter().map(|item| item.freshness),
        )?;
        let next_cursor = encode_search_cursor(
            page.next_cursor, filter_digest, page.source_watermark,
            SEARCH_CURSOR_SCHEMA_V1,
        )?;
        query_page_response::readable(
            ToolQueryName::SearchToolContracts, items, next_cursor,
            page.source_watermark, aggregate, visibility.consumption_visibility(),
            gap_refs, metadata.correlation_ref,
        )
    }
    ProjectionPageRead::Rebuilding { source_watermark, gap_refs } => query_page_response::rebuilding(
        ToolQueryName::SearchToolContracts, source_watermark,
        visibility.consumption_visibility(), gap_refs, metadata.correlation_ref,
    ),
    ProjectionPageRead::Unavailable { source_watermark, gap_refs } => query_page_response::unavailable(
        ToolQueryName::SearchToolContracts, source_watermark,
        visibility.consumption_visibility(), gap_refs, metadata.correlation_ref,
    ),
    ProjectionPageRead::Failed { source_watermark, gap_refs } => query_page_response::failed(
        ToolQueryName::SearchToolContracts, source_watermark,
        visibility.consumption_visibility(), gap_refs, metadata.correlation_ref,
    ),
}
```

### 10.4 Errors, effects and tests

| Concern | Exact behavior |
|---|---|
| Errors | unsafe text/unknown enum/zero or excessive limit -> invalid input; cursor operation/schema/filter/watermark mismatch -> cursor invalid; row/filter/identity/order/watermark mismatch -> integrity failure; non-readable surfaces expose no items/cursor. |
| Effects | none; visible readable empty page maps `Empty`; any stale row or stale carrier maps outer `Stale`; next cursor preserves the exact resolved watermark. |
| Test cuts | fresh nonempty/empty; stable tie order; stale item/carrier; initial latest and continued exact watermark; cursor tamper/filter reuse; rebuilding/unavailable/failed; not visible; prohibited inventory fields unsearchable; no T1 fallback/write. |

Stop review: collection visibility, safe filter, stable page/cursor, aggregate freshness, all no-item states and no-fallback boundary are closed; pass.

## 11. `QF-09 CompareToolContracts`

### 11.1 Entry and target

| Item | Exact contract |
|---|---|
| Entry/result | `CompareToolContractsRequest` -> `ToolQueryResponse<ToolContractDiffView>` |
| Key | tool + directional revision pair + `Exact`/`LatestCompleted` watermark + fixed diff schema |
| Read | `ProjectionStore::get_diff_summary` -> `ProjectionRead<ToolContractDiffSummary>` |
| Boundary | stored D1 diff only; never invokes direct comparator or T1 definition reads |

### 11.2 Function call graph

```text
[Query entry]
  -> validate pair -> get_contract_owner_scope -> visibility resolve
  -> ToolContractDiffKey::new(pair, watermark selector, schema)
  -> ProjectionStore::get_diff_summary
     -> Missing/Readable/Rebuilding/Unavailable/Failed exact mapping
  -> validate pair/key/watermark/freshness -> map ToolContractDiffView
```

### 11.3 Typed pseudocode

```rust
metadata.validate()?;
request.validate_directional_pair()?;
let owner_scope = match contract_store.get_contract_owner_scope(&request.tool_id).await? {
    Some(scope) => scope,
    None => return query_response::not_found(ToolQueryName::CompareToolContracts, metadata.correlation_ref),
};
let visibility = resolve_visibility(
    &metadata, owner_scope, TypedSubjectRef::ToolContract(request.tool_id),
).await?;
if !visibility.value_permitted() {
    return query_response::from_visibility(ToolQueryName::CompareToolContracts, visibility, metadata.correlation_ref);
}
let selector = request.requested_watermark
    .map(ProjectionWatermarkSelector::Exact)
    .unwrap_or(ProjectionWatermarkSelector::LatestCompleted);
let key = ToolContractDiffKey::new(
    request.tool_id, request.base_revision, request.target_revision,
    selector, DIFF_SCHEMA_V1,
)?;
match projection_store.get_diff_summary(&key).await? {
    ProjectionRead::Missing => query_response::empty_visible(
        ToolQueryName::CompareToolContracts, visibility.consumption_visibility(),
        None, metadata.correlation_ref,
    ),
    ProjectionRead::Readable { value, source_watermark, freshness, gap_refs } => {
        ensure_diff_key_and_surface_symmetric(&value, &key, source_watermark, freshness, &gap_refs)?;
        let view = map_contract_diff_view(&value, freshness.into())?;
        query_response::readable_derived(
            ToolQueryName::CompareToolContracts, view, source_watermark,
            freshness, visibility.consumption_visibility(), gap_refs,
            metadata.correlation_ref,
        )
    }
    ProjectionRead::Rebuilding { source_watermark, gap_refs } => query_response::rebuilding(
        ToolQueryName::CompareToolContracts, source_watermark,
        visibility.consumption_visibility(), gap_refs, metadata.correlation_ref,
    ),
    ProjectionRead::Unavailable { source_watermark, gap_refs } => query_response::unavailable(
        ToolQueryName::CompareToolContracts, source_watermark,
        visibility.consumption_visibility(), gap_refs, metadata.correlation_ref,
    ),
    ProjectionRead::Failed { source_watermark, gap_refs } => query_response::failed_no_value(
        ToolQueryName::CompareToolContracts, source_watermark,
        visibility.consumption_visibility(), gap_refs, metadata.correlation_ref,
    ),
}
```

### 11.4 Errors, effects and tests

| Concern | Exact behavior |
|---|---|
| Errors | invalid/equal pair -> invalid input; absent tool owner -> `NotFound`; absent projection -> visible `Empty`; key/pair/watermark/freshness mismatch -> integrity failure; repository/resolver failures typed. |
| Effects | zero writes/UoW/external calls; no direct definition lookup, comparison, impact lookup or projection creation. Reversed pair remains a different key. |
| Test cuts | fresh/stale stored diff; missing; exact/latest; reversed pair; pair/key/watermark mismatch; rebuilding/unavailable/failed; visibility branches; assert contract definition and projection write methods untouched. |

Stop review: near-name separation from `QF-02`, exact D1 key/state, no direct compute fallback and zero-effect tests are closed; pass.

## 12. `QF-10 GetToolDiagnostic`

### 12.1 Entry and target

| Item | Exact contract |
|---|---|
| Entry/result | `GetToolDiagnosticRequest` -> `ToolQueryResponse<ToolDiagnosticView>` |
| Owner seed | closed subject-kind router calls an existing contract, Binding or invocation owner-scope read before projection access |
| Key/read | subject + `Exact`/`LatestCompleted` watermark + fixed diagnostic schema -> `ProjectionStore::get_diagnostic_summary` |
| Boundary | stored D1 diagnostic only; no live local aggregation, dependency health probe, Runtime recovery instruction or repair |

### 12.2 Function call graph

```text
[Query entry]
  -> validate closed ToolDiagnosticSubjectRef
  -> route to existing subject owner-scope read
  -> ReadVisibilityResolverPort::resolve
  -> ToolDiagnosticKey::new(subject, watermark selector, schema)
  -> ProjectionStore::get_diagnostic_summary
     -> Missing/Readable/Rebuilding/Unavailable/Failed exact mapping
  -> validate subject/key/watermark/freshness -> map ToolDiagnosticView
```

### 12.3 Typed pseudocode

```rust
metadata.validate()?;
request.subject_ref.validate()?;
let owner_scope = match request.subject_ref {
    ToolDiagnosticSubjectRef::Tool(tool_id) => contract_store.get_contract_owner_scope(&tool_id).await?,
    ToolDiagnosticSubjectRef::Binding(binding_id) => binding_store.get_binding_owner_scope(&binding_id).await?,
    ToolDiagnosticSubjectRef::Invocation(invocation_id)
    | ToolDiagnosticSubjectRef::OutcomeByInvocation(invocation_id) => {
        invocation_store.get_invocation_owner_scope(&invocation_id).await?
    }
};
let owner_scope = match owner_scope {
    Some(scope) => scope,
    None => return query_response::not_found(ToolQueryName::GetToolDiagnostic, metadata.correlation_ref),
};
let visibility = resolve_visibility(
    &metadata, owner_scope, TypedSubjectRef::ToolDiagnostic(request.subject_ref.clone()),
).await?;
if !visibility.value_permitted() {
    return query_response::from_visibility(ToolQueryName::GetToolDiagnostic, visibility, metadata.correlation_ref);
}
let selector = request.requested_watermark
    .map(ProjectionWatermarkSelector::Exact)
    .unwrap_or(ProjectionWatermarkSelector::LatestCompleted);
let key = ToolDiagnosticKey::new(request.subject_ref.clone(), selector, DIAGNOSTIC_SCHEMA_V1)?;
match projection_store.get_diagnostic_summary(&key).await? {
    ProjectionRead::Missing => query_response::empty_visible(
        ToolQueryName::GetToolDiagnostic, visibility.consumption_visibility(),
        None, metadata.correlation_ref,
    ),
    ProjectionRead::Readable { value, source_watermark, freshness, gap_refs } => {
        ensure_diagnostic_key_and_surface_symmetric(
            &value, &key, source_watermark, freshness, &gap_refs,
        )?;
        let view = map_tool_diagnostic_view(&value)?;
        query_response::readable_derived(
            ToolQueryName::GetToolDiagnostic, view, source_watermark,
            freshness, visibility.consumption_visibility(), gap_refs,
            metadata.correlation_ref,
        )
    }
    ProjectionRead::Rebuilding { source_watermark, gap_refs } => query_response::rebuilding(
        ToolQueryName::GetToolDiagnostic, source_watermark,
        visibility.consumption_visibility(), gap_refs, metadata.correlation_ref,
    ),
    ProjectionRead::Unavailable { source_watermark, gap_refs } => query_response::unavailable(
        ToolQueryName::GetToolDiagnostic, source_watermark,
        visibility.consumption_visibility(), gap_refs, metadata.correlation_ref,
    ),
    ProjectionRead::Failed { source_watermark, gap_refs } => query_response::failed_no_value(
        ToolQueryName::GetToolDiagnostic, source_watermark,
        visibility.consumption_visibility(), gap_refs, metadata.correlation_ref,
    ),
}
```

### 12.4 Errors, effects and tests

| Concern | Exact behavior |
|---|---|
| Errors | invalid/unknown subject kind -> invalid input; missing owner -> `NotFound`; projection missing -> visible `Empty`; subject/key/watermark/freshness mismatch -> integrity failure; resolver/store errors typed. |
| Effects | zero writes/UoW/external calls; diagnostic safe summaries do not become health/readiness, recovery/retry/resume authority or observability truth. |
| Test cuts | tool/Binding/invocation/outcome subject routing; fresh/stale; missing; exact/latest; subject/key mismatch; rebuilding/unavailable/failed; not visible; assert no live bundle aggregation, external probe or write. |

Stop review: closed subject routing, exact stored diagnostic surface, health/recovery exclusions and zero-effect tests are closed; pass.

## 13. `QF-11 GetToolConsumerGuidance`

### 13.1 Entry and target

| Item | Exact contract |
|---|---|
| Entry/result | `GetToolConsumerGuidanceRequest` -> `ToolQueryResponse<ToolConsumerGuidanceView>` |
| Authority guard | `QueryMetadata.consumer.consumer_kind` must exactly equal request `consumer_kind` |
| Key/read | tool + `Exact(revision)` or persisted `BuiltCurrent` revision selector + consumer kind + watermark selector + fixed guidance schema |
| Boundary | stored D1 guidance only; no SDK client/code, Runtime plan, authorization decision, Sandbox readiness or live-current fallback |

### 13.2 Function call graph

```text
[Query entry]
  -> validate consumer equality/tool/revision
  -> ToolContractStore::get_contract_owner_scope
  -> ReadVisibilityResolverPort::resolve
  -> ToolConsumerGuidanceKey::new(revision selector, watermark selector, schema)
  -> ProjectionStore::get_consumer_guidance
     -> Missing/Readable/Rebuilding/Unavailable/Failed exact mapping
  -> validate tool/revision/consumer/key/watermark/freshness -> Found/Stale
```

### 13.3 Typed pseudocode

```rust
metadata.validate()?;
request.validate()?;
ensure_eq(metadata.consumer.consumer_kind, request.consumer_kind)?;
let owner_scope = match contract_store.get_contract_owner_scope(&request.tool_id).await? {
    Some(scope) => scope,
    None => return query_response::not_found(
        ToolQueryName::GetToolConsumerGuidance, metadata.correlation_ref,
    ),
};
let visibility = resolve_visibility(
    &metadata, owner_scope, TypedSubjectRef::ToolConsumerGuidance(
        request.tool_id, request.consumer_kind,
    ),
).await?;
if !visibility.value_permitted() {
    return query_response::from_visibility(
        ToolQueryName::GetToolConsumerGuidance, visibility, metadata.correlation_ref,
    );
}
let revision_selector = request.definition_revision
    .map(GuidanceRevisionSelector::Exact)
    .unwrap_or(GuidanceRevisionSelector::BuiltCurrent);
let watermark_selector = request.requested_watermark
    .map(ProjectionWatermarkSelector::Exact)
    .unwrap_or(ProjectionWatermarkSelector::LatestCompleted);
let key = ToolConsumerGuidanceKey::new(
    request.tool_id, revision_selector, request.consumer_kind,
    watermark_selector, GUIDANCE_SCHEMA_V1,
)?;
match projection_store.get_consumer_guidance(&key).await? {
    ProjectionRead::Missing => query_response::empty_visible(
        ToolQueryName::GetToolConsumerGuidance,
        visibility.consumption_visibility(), None, metadata.correlation_ref,
    ),
    ProjectionRead::Readable { value, source_watermark, freshness, gap_refs } => {
        ensure_guidance_key_and_surface_symmetric(
            &value, &key, source_watermark, freshness, &gap_refs,
        )?;
        ensure_eq(value.consumer_kind, request.consumer_kind)?;
        if let Some(exact_revision) = request.definition_revision {
            ensure_eq(value.definition_revision, exact_revision)?;
        }
        ensure_guidance_is_semantic_only(&value)?;
        query_response::readable_derived(
            ToolQueryName::GetToolConsumerGuidance, value, source_watermark,
            freshness, visibility.consumption_visibility(), gap_refs,
            metadata.correlation_ref,
        )
    }
    ProjectionRead::Rebuilding { source_watermark, gap_refs } => query_response::rebuilding(
        ToolQueryName::GetToolConsumerGuidance, source_watermark,
        visibility.consumption_visibility(), gap_refs, metadata.correlation_ref,
    ),
    ProjectionRead::Unavailable { source_watermark, gap_refs } => query_response::unavailable(
        ToolQueryName::GetToolConsumerGuidance, source_watermark,
        visibility.consumption_visibility(), gap_refs, metadata.correlation_ref,
    ),
    ProjectionRead::Failed { source_watermark, gap_refs } => query_response::failed_no_value(
        ToolQueryName::GetToolConsumerGuidance, source_watermark,
        visibility.consumption_visibility(), gap_refs, metadata.correlation_ref,
    ),
}
```

### 13.4 Errors, effects and tests

| Concern | Exact behavior |
|---|---|
| Errors | metadata/request consumer mismatch -> invalid input; missing tool owner -> `NotFound`; projection missing -> visible `Empty`; exact revision/key/consumer/watermark/freshness mismatch or forbidden executable material -> integrity failure. |
| Effects | none; `BuiltCurrent` returns the revision captured by the persisted projection key and never live-resolves current truth. SDK remains a future consumer, not a generated client contract. |
| Test cuts | every consumer kind; metadata mismatch; exact and built-current revision; exact/latest watermark; fresh/stale/missing/rebuilding/unavailable/failed; key/revision/consumer mismatch; forbidden code/plan/decision/readiness fields; no definition/binding live read beyond owner seed. |

Stop review: consumer authority equality, persisted revision semantics, D1 state mapping, semantic-only output and no-client/no-live-fallback boundary are closed; pass.

## 14. Query family audit

| Audit item | Result | Closure |
|---|---|---|
| Inventory | pass | `QF-01~11` all have independent entry/graph/pseudocode/error/effect/test sections. |
| Visibility order | pass | Subject/collection owner seed precedes resolver; value/page is read only after visibility permits. |
| T1/T2 constructibility | pass | Contract, comparison, Binding, invocation and precondition use named common-snapshot bundles or exact existing reads. |
| Outcome integrity | pass | Missing pair is `Empty`; half pair/mismatch never yields a partial view. |
| D1 state surface | pass after controlled Step 7 correction | `ProjectionRead`/`ProjectionPageRead` express missing, readable fresh/stale, rebuilding, unavailable and failed without payload ambiguity. |
| Watermark/latest | pass | Exact selectors remain exact; `LatestCompleted`/`BuiltCurrent` resolve persisted indices only and return resolved watermark/revision. |
| Page/cursor | pass | Public cursor binds operation/schema/filter/sort/watermark; stale aggregation and visible empty page are explicit. |
| Near-name flows | pass | `QF-02` direct fresh computation and `QF-09` stored D1 read cannot fall back to each other. |
| No effects | pass | All 11 flows use zero UoW, zero store write, zero external Port and no refresh/rebuild/repair. |
| Blockers | pass | No Runtime/Sandbox/Authorization/Hub/Bus/Observability/Core/SDK positive readiness or client is inferred. |
| Tests | pass | Every flow names positive, visibility/empty, integrity/failure and no-effect cuts. |

Query Batch 2 gate: pass. Next allowed Step 9 action is `IF-01~05`; formal 03 remains write-closed.
