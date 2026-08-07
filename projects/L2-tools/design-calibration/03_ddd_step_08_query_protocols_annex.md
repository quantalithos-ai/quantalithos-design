# L2-tools Step 8 协议附录: 11 Query protocols

> 状态: completed / pass
> 主文件: `03_ddd_step_08_protocol_contracts.md`
> Public owner: `contracts::queries` / `contracts::views`
> Entry: `api`;handler calls `ToolQueryUseCases` only
> Global rule: no UoW, no write, no external Port, no refresh/rebuild/repair.

## 1. Query definition batch

| # | Query | Read owner | Response | Repository key/scope | Step 9 flow | Stop |
|---:|---|---|---|---|---|---|
| 1 | `GetToolContract` | T1 | contract view | `tool_id` | `QF-01` | pass |
| 2 | `CompareToolDefinitionRevisions` | T1 direct | fresh computed diff | `(tool_id, base, target)` | `QF-02` | pass |
| 3 | `GetCapabilityBinding` | T1 | binding view | binding ID or current-by-tool | `QF-03` | pass |
| 4 | `GetToolInvocation` | T2 | invocation view | `invocation_id` | `QF-04` | pass |
| 5 | `GetExecutionPreconditionView` | T2 | precondition view | `invocation_id` | `QF-05` | pass |
| 6 | `GetOutcomeAudit` | T2 | outcome/audit view | `invocation_id` | `QF-06` | pass |
| 7 | `GetReferenceConsistencyReport` | D1 | report view | scope + watermark | `QF-07` | pass |
| 8 | `SearchToolContracts` | D1 | page of search items | filter digest + cursor | `QF-08` | pass |
| 9 | `CompareToolContracts` | D1 | stored diff view | diff key | `QF-09` | pass |
| 10 | `GetToolDiagnostic` | D1/local reads | diagnostic view | subject + watermark/schema | `QF-10` | pass |
| 11 | `GetToolConsumerGuidance` | D1/local reads | guidance view | tool/revision/consumer + watermark | `QF-11` | pass |

Every logical name is `tools.query.<snake_case_operation>.v1`. Handler signature is `handle(Request, QueryMetadata) -> Result<ToolQueryResponse<Value>, ProtocolError>` or `ToolPageResponse<Value>` for search.

## 2. Public derived/read view schemas

```rust
pub struct ToolContractDiffView {
    pub diff_id: ToolContractDiffSummaryId,
    pub tool_id: ToolId,
    pub base_revision: DefinitionRevision,
    pub target_revision: DefinitionRevision,
    pub change_summary: DefinitionSemanticChangeSummary,
    pub impact_ref: Option<CompatibilityImpactRef>,
    pub source_watermark: LocalTruthWatermark,
    pub freshness: FreshnessState,
}

pub struct ReferenceConsistencyReportView {
    pub report_id: ReferenceConsistencyReportId,
    pub scope: ReferenceInspectionScope,
    pub assessment_refs: ReferenceAssessmentRefSet,
    pub gap_refs: ConsistencyGapRefSet,
    pub counts: ReferenceConsistencyCounts,
    pub source_watermark: LocalTruthWatermark,
    pub state: DerivedReportState,
    pub generated_at: ProjectionTime,
}

pub struct ToolContractSearchItem {
    pub projection_id: ToolContractSearchProjectionId,
    pub tool_id: ToolId,
    pub definition_revision: DefinitionRevision,
    pub search_summary: ToolSearchSafeSummary,
    pub binding_summary: BindingModeSafeSummary,
    pub lifecycle: ToolContractLifecycleSummary,
    pub source_watermark: LocalTruthWatermark,
    pub freshness: FreshnessState,
}

pub struct ToolDiagnosticView {
    pub diagnostic_id: ToolDiagnosticSummaryId,
    pub subject_ref: ToolDiagnosticSubjectRef,
    pub local_state: ToolLocalStateSafeSummary,
    pub assessments: ExternalAssessmentSafeSummary,
    pub attempts: LocalAttemptSafeSummary,
    pub gap_refs: ConsistencyGapRefSet,
    pub source_watermark: LocalTruthWatermark,
    pub freshness: FreshnessState,
}

pub struct ToolConsumerGuidanceView {
    pub guidance_id: ToolConsumerGuidanceViewId,
    pub tool_id: ToolId,
    pub definition_revision: DefinitionRevision,
    pub consumer_kind: ToolConsumerKind,
    pub invocation_guidance: CanonicalInvocationGuidanceSummary,
    pub precondition_guidance: ExecutionPreconditionGuidanceSummary,
    pub binding_guidance: BindingModeSafeSummary,
    pub gap_refs: ConsistencyGapRefSet,
    pub source_watermark: LocalTruthWatermark,
    pub freshness: FreshnessState,
}
```

Secondary summary fields are exact:

| Type | Fields / closed meaning |
|---|---|
| `DefinitionSemanticChangeSummary` | changed invocation selectors, argument shape classes, outcome classes, execution requirement classes; safe bounded sets only |
| `ReferenceConsistencyCounts` | total/valid/stale/conflicting/missing/unverifiable/open-gap counts |
| `ToolSearchSafeSummary` | normalized safe label, operation selectors, safe semantic tags; no implementation/provider inventory |
| `ToolLocalStateSafeSummary` | subject kind/id, local lifecycle/decision/terminal markers and committed version refs |
| `ExternalAssessmentSafeSummary` | latest applicable assessment refs/states by authority family; no external body |
| `LocalAttemptSafeSummary` | latest execution-handoff/submission attempt refs/states/times; no external lifecycle |
| `CanonicalInvocationGuidanceSummary` | allowed operation selectors, safe argument shape summaries, output class summaries |
| `ExecutionPreconditionGuidanceSummary` | declared authorization/isolation/carrier requirement classes; never a current allow/readiness decision |

## 3. `GetToolContract`

```rust
pub struct GetToolContractRequest {
    pub tool_id: ToolId,
}
```

Application reads owner scope, resolves visibility, then `ToolContractStore::get_current_bundle`; mapper constructs `ToolContractView`. `Found` requires a symmetric contract/current definition bundle. `NotFound`, `NotVisible`, `Unavailable` carry no value. Truth view has `freshness=None`; source-ref gaps are fields in view/gap refs, not a projection freshness marker. No source resolver call. Flow `QF-01`.

## 4. `CompareToolDefinitionRevisions`

```rust
pub struct CompareToolDefinitionRevisionsRequest {
    pub tool_id: ToolId,
    pub base_revision: DefinitionRevision,
    pub target_revision: DefinitionRevision,
}
```

Both revisions are read directly from `ToolContractStore`; visibility derives from the contract owner scope. Application invokes pure `ToolContractDiffSummary::compare`, using stored matching impact if present. Stable diff ID derives from `(tool, base, target, diff schema)`. The response `ToolQueryResponse<ToolContractDiffView>` is `Found` with `Fresh` at the read watermark, or not-found/not-visible/unavailable. It does not save the computed diff or approve/adopt target. Pair order is directional. Flow `QF-02`.

## 5. `GetCapabilityBinding`

```rust
pub enum CapabilityBindingSelector {
    ByBindingId(CapabilityBindingId),
    CurrentByToolId(ToolId),
}

pub enum BindingAssessmentSelection {
    LatestApplicable,
    Exact(BindingAssessmentRef),
    None,
}

pub struct GetCapabilityBindingRequest {
    pub selector: CapabilityBindingSelector,
    pub assessment: BindingAssessmentSelection,
}
```

Selection is explicit: `None` means no assessment summary requested, not explicit-unbound. Application reads relation, owner scope, selected assessment/snapshot and visible gaps; it never calls Hub or creates a new assessment. Invalid exact assessment symmetry is an integrity failure. Response uses `CapabilityBindingView`; current-by-tool excludes terminal historical relations but includes explicit-unbound. Flow `QF-03`.

## 6. `GetToolInvocation`

```rust
pub struct GetToolInvocationRequest {
    pub invocation_id: ToolInvocationId,
}
```

Reads owner scope and `ToolInvocationStore::get_invocation_read_bundle`; maps invocation, immutable admission and optional local outcome ref. It never reads Runtime/Sandbox body/status or infers terminal state. Missing outcome remains `None`; gaps are explicit. Response `ToolQueryResponse<ToolInvocationView>`. Flow `QF-04`.

## 7. `GetExecutionPreconditionView`

```rust
pub struct GetExecutionPreconditionViewRequest {
    pub invocation_id: ToolInvocationId,
}
```

After invocation visibility resolution, reads `ExecutionHandoffStore::get_precondition_read_bundle` and optional no-execution outcome ref. The bundle contains exact requirement, selected authorization assessment, Sandbox readiness snapshot, latest handoff/attempt and one watermark. It does not call authorization/Sandbox or update stale assessments. If invocation exists but no evaluation exists, response is `Found` with an empty optional precondition view and admission context; public value remains `ExecutionPreconditionView`, not `NotFound`. Flow `QF-05`.

## 8. `GetOutcomeAudit`

```rust
pub struct GetOutcomeAuditRequest {
    pub invocation_id: ToolInvocationId,
}
```

Reads the indivisible local outcome/audit pair plus locally stored eligibility/material/attempt and optional Bus/Observation refs. Outcome/audit missing for an existing nonterminal invocation yields `Empty`; a half pair yields integrity failure, never partial. External status unknown/route-blocked is represented in view, not used to change local disposition. No external feedback Port call. Flow `QF-06`.

## 9. `GetReferenceConsistencyReport`

```rust
pub struct GetReferenceConsistencyReportRequest {
    pub scope: ReferenceInspectionScope,
    pub requested_watermark: Option<LocalTruthWatermark>,
}
```

Repository key is deterministic `(canonical scope digest, requested watermark or latest completed watermark, report schema version)`. Scope visibility is resolved before report read. `Current` maps `Found`; `Partial` maps `Found` with explicit gaps; `Stale` maps `Stale` and may include the safe report; `Failed` maps `Failed` with no report body beyond safe failure/gap refs. Missing maps `Empty`, not automatic rebuild. Flow `QF-07`.

## 10. `SearchToolContracts`

```rust
pub struct ToolContractSearchFilter {
    pub safe_text: Option<SearchSafeText>,
    pub operation_selectors: ToolOperationSelectorSet,
    pub lifecycle_states: ToolContractLifecycleStateSet,
    pub binding_modes: BindingModeSet,
}

pub struct SearchToolContractsRequest {
    pub filter: ToolContractSearchFilter,
    pub page: PageRequest,
}
```

Filter canonicalization preserves safe-text Unicode normalization defined by the contracts validator and sorts enum sets; it never searches provider inventory, raw definition, policy, marketplace or authorization. Stable order is `(normalized safe label, tool_id)`. Page visibility is resolved from Query actor/consumer/scope before any results; repository page maps to public cursor with filter digest/watermark. Fresh results return `Found`/`Empty`; any stale item or stale store surface makes page `Stale` and keeps item-level freshness; rebuilding/unavailable/failed return no items. No fallback to T1 list scan. Flow `QF-08`.

## 11. `CompareToolContracts`

```rust
pub struct CompareToolContractsRequest {
    pub tool_id: ToolId,
    pub base_revision: DefinitionRevision,
    pub target_revision: DefinitionRevision,
    pub requested_watermark: Option<LocalTruthWatermark>,
}
```

This protocol intentionally differs from §4: it reads an existing `ProjectionStore::get_diff_summary` by deterministic `ToolContractDiffKey` and never computes or saves a diff. It serves peripheral consumers that need explicit D1 freshness. Missing is `Empty`; Fresh is `Found`; stale may return `Stale` with value; rebuilding/unavailable/failed return corresponding no-value surface. It never falls back to `CompareToolDefinitionRevisions`. Flow `QF-09`.

## 12. `GetToolDiagnostic`

```rust
pub struct GetToolDiagnosticRequest {
    pub subject_ref: ToolDiagnosticSubjectRef,
    pub requested_watermark: Option<LocalTruthWatermark>,
}
```

The diagnostic key is deterministic `(subject, requested/latest watermark, diagnostic schema version)`. Application may construct a fresh diagnostic from a complete local read set only when the protocol is configured for direct derivation; current v1 fixes repository-first behavior: it reads stored `ToolDiagnosticSummary` only. Stale may be returned with value; rebuilding/unavailable/failed carry no value. Diagnostic never means health/readiness or Runtime recovery instruction. Flow `QF-10`.

## 13. `GetToolConsumerGuidance`

```rust
pub struct GetToolConsumerGuidanceRequest {
    pub tool_id: ToolId,
    pub definition_revision: Option<DefinitionRevision>,
    pub consumer_kind: ToolConsumerKind,
    pub requested_watermark: Option<LocalTruthWatermark>,
}
```

`QueryMetadata.consumer.consumer_kind` must equal request `consumer_kind`; mismatch rejects rather than choosing one. Optional revision means current at projection-build time, not a live current lookup fallback. Key is `(tool, resolved revision, consumer kind, requested/latest watermark, guidance schema)`. Fresh/stale/rebuilding/unavailable/failed mapping follows D1 rules. Output contains semantic guidance only; no SDK client/code, Runtime plan, authorization decision or Sandbox readiness. Flow `QF-11`.

## 14. Query response/source closure

| Query | Response fields all sourced | Empty/not-visible | Stale/degraded | Write/external guard |
|---|---|---|---|---|
| Get contract | current bundle + visibility/gaps | explicit | truth source gaps in view | no source call |
| Compare definitions | two definitions + matching impact + watermark | missing pair | computed fresh only | no save/adopt |
| Get binding | relation + selected assessment/snapshot/gaps | explicit | assessment state, not projection stale | no Hub call |
| Get invocation | invocation/admission/outcome ref | explicit | gap refs | no Runtime/Sandbox call |
| Get precondition | local read bundle | empty evaluation explicit | stored conservative states | no Auth/Sandbox call |
| Get outcome/audit | atomic pair + local handoff/external refs | no outcome explicit | external unknown/gaps | no feedback call |
| Report | report key | empty | partial/stale/failed exact | no rebuild |
| Search | projection scope/page | visible empty | page+item freshness | no T1 fallback |
| Compare contracts | diff projection key | empty | stale/rebuilding/unavailable | no direct compute fallback |
| Diagnostic | diagnostic key | empty | stale/rebuilding/unavailable | no live aggregation/recovery |
| Guidance | guidance key | empty | stale/rebuilding/unavailable | no client/plan/auth generation |

## 15. Query family stop review

| Review item | Result | Closure |
|---|---|---|
| 11 independent protocols present | pass | sections 3~13 |
| Every request and view has field schema | pass | no type-name-only response |
| Repository key/source exact | pass | T1/T2 bundle or D1 deterministic key |
| Public/repository page mapping exact | pass | opaque scoped cursor, watermark/freshness |
| Empty/not-visible/stale/rebuilding/unavailable/failed exact | pass | per-protocol mapping named |
| Near-name compare protocols do not overlap silently | pass | direct fresh compute vs D1 read only |
| Query actor/consumer unique source | pass | metadata; one explicit equality guard in guidance |
| No Query writes/refreshes/calls external systems | pass | all flows no UoW and no Port call |
| Each maps to Step 9 | pass | `QF-01~11` |
