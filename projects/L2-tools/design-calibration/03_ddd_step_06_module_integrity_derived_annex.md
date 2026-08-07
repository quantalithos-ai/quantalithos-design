# L2-tools Step 6 模块附录: 引用完整性与受控派生对象契约

> 状态: completed / pass
> 主文件: `03_ddd_step_06_object_contracts.md`
> Authority: 正式 `02-概要设计.md` §6.7 / §12.2.6
> Blockers: `L2T-UP-007~009`
> 作用: 补齐八个对象的 exact fields、callables、状态、派生来源与逐对象停审；不把 report、projection、diagnostic、guidance 或 external authority ref 提升为业务 truth。

## 1. Capability 到对象

| Capability | Owner object | Non-negotiable invariant |
|---|---|---|
| 在消费时点评估 typed ref | `ReferenceValidityAssessment` | Assessment is immutable and never repairs the subject or referenced owner truth. |
| 显式记录 truth / mapping / route / reference gap | `ConsistencyGap` | Gap records impact; it never becomes the missing owner fact. |
| 汇总一批 assessment / gap | `ReferenceConsistencyReport` | Report health is not subject health and may be rebuilt. |
| 提供安全的工具合同检索材料 | `ToolContractSearchProjection` | Search projection is not registry, allowlist, authorization or current-definition authority. |
| 比较两个正式 revision | `ToolContractDiffSummary` | Diff never adopts, approves or mutates a revision. |
| 聚合 body-free 诊断材料 | `ToolDiagnosticSummary` | Diagnostic is not ToolHealth, Observability truth or Runtime recovery instruction. |
| 提供消费者指导读取 | `ToolConsumerGuidanceView` | Guidance does not generate an SDK client, Runtime plan or authorization decision. |
| 记录 Core shared-contract authority resolution | `SharedContractAuthorityRef` | Candidate-only / missing cannot be treated as a resolved compile contract. |

## 2. `ReferenceValidityAssessment`

| Field | Type | Required source / guard |
|---|---|---|
| `assessment_id` | `ReferenceAssessmentId` | `IdGeneratorPort` before assessment persistence |
| `subject_ref` | `TypedSubjectRef` | Owning flow input; exact subject kind and identity required |
| `assessed_ref` | `TypedExternalRef` | Reference read from the local subject or sidecar truth |
| `authority_ref` | `Option<ExternalAuthorityRef>` | Formal resolver / source Port; absent is explicit, never inferred |
| `source_revision` | `Option<ExternalRevisionRef>` | Resolver result when available |
| `state` | `ReferenceValidityState` | Result of authority, identity, revision and freshness guards |
| `impact` | `ReferenceImpactClass` | Domain mapping from the consuming capability, not adapter severity |
| `basis_refs` | `ReferenceAssessmentBasisRefSet` | Subject version, source snapshot and authority resolution refs |
| `consumed_at` | `ConsumptionTime` | `ClockPort.now()` at the exact consumption boundary |

| Factory / callable | Preconditions | Result / effect |
|---|---|---|
| `assess_valid(...)` | Formal authority, exact subject/ref symmetry, supported revision and freshness | Immutable `Valid` assessment |
| `assess_stale(...)` | Formal source exists but freshness requirement fails | Immutable `Stale`; opens a gap when impact is blocking |
| `assess_conflicting(...)` | Authority, subject, locator or revision inputs disagree | Immutable `Conflicting`; fail closed for affected flow |
| `assess_missing(...)` | A required typed ref or authority result is absent | Immutable `Missing` |
| `assess_unverifiable(...)` | Authority or revision cannot be proven | Immutable `Unverifiable` |
| `permits_consumption(&RequiredValidity)` | none | True only when state and impact satisfy the named consumer requirement |
| `requires_gap()` | none | True for every blocking non-valid state |
| `gap_class()` | none | Exact missing/stale/conflicting/unverifiable classifier for the state |
| `matches_subject(&TypedSubjectRef)` | none | Exact kind and identity equality |

`ReferenceValidityAssessment::for_authorization_change(...)` is a closed application mapper for an
inbound result clue. It derives the `ReferenceInspection` subject from the exact result/subject
lookup scope, stores the typed external pair in `assessed_ref`, and maps Port `Blocked`,
`Unavailable`, `Conflicting` and `Unverifiable` to the corresponding immutable assessment state.
It never mutates an `AuthorizationConsumptionAssessment`.

| Variant | English rustdoc | Mutation / destination |
|---|---|---|
| `Valid` | `/// The typed reference is attributable, current enough and valid for the named consumption.` | none; a later check creates another assessment |
| `Stale` | `/// The reference is attributable but fails the required freshness boundary.` | none |
| `Conflicting` | `/// Subject, authority, locator or revision inputs conflict.` | none |
| `Missing` | `/// A required typed reference or authority result is absent.` | none |
| `Unverifiable` | `/// The reference cannot be proven against its formal authority.` | none |

Stop review: all fields have a subject, resolver, repository or clock source; validity is per consumption and cannot mutate the referenced truth; pass.

## 3. `ConsistencyGap`

| Field | Type | Required source / guard |
|---|---|---|
| `gap_id` | `ConsistencyGapId` | `IdGeneratorPort`; stable across its local lifecycle |
| `scope` | `ConsistencyGapScope` | Detecting flow / job closed enum |
| `subject_refs` | `GapSubjectRefSet` | At least one typed local or external subject ref |
| `gap_class` | `ConsistencyGapClass` | Closed mapping from the failed invariant |
| `impact` | `GapImpactClass` | Domain impact mapping: informational, degraded, blocking or integrity-critical |
| `state` | `ConsistencyGapState` | Domain transition only |
| `basis_refs` | `GapBasisRefSet` | Assessments, attempts, revisions, watermarks or source refs proving detection |
| `detected_at` | `DetectionTime` | Application clock |
| `resolution_requested_at` | `Option<DecisionTime>` | `RecordConsistencyGapResolution` flow when formal evidence is submitted |
| `resolution_evidence_ref` | `Option<GapResolutionEvidenceRef>` | Typed formal ref; no alias, body, run or signature is invented |
| `resolution_decision_ref` | `Option<GapResolutionDecisionRef>` | L2 validation fact created by the resolution Command |
| `resolved_at` | `Option<DecisionTime>` | Required only for `Resolved` / `Superseded` |
| `version` | `ExpectedVersion` | Repository read and optimistic write |

| Callable | Preconditions | State / effect |
|---|---|---|
| `detect(...) -> Result<Self, DomainError>` | Non-empty subjects and basis; gap class matches detector | Creates `Open`, version zero |
| `request_resolution(&mut self, GapResolutionEvidenceRef, DecisionTime)` | `Open`; evidence type matches subject owner and gap class | `ResolutionPending`; no subject repair |
| `resolve(&mut self, GapResolutionDecisionRef, DecisionTime)` | `ResolutionPending`; formal owner repair has been re-read and verified | `Resolved` |
| `supersede(&mut self, ConsistencyGapRef, DecisionTime)` | `Open` or `ResolutionPending`; replacement gap covers all subjects | `Superseded` |
| `blocks(&GapSensitiveOperation)` | none | Uses impact plus state; resolved/superseded do not block |
| `matches_basis(&GapBasisRefSet)` | none | Exact canonical-set equality for deduplication |
| `accepts_resolution_verification(&GapResolutionEvidenceRef)` | `ResolutionPending`;same evidence ref | Allows a later read-only owner recheck without repeating the Open -> Pending transition |

| Variant | English rustdoc | Allowed source | Allowed destination |
|---|---|---|---|
| `Open` | `/// The consistency gap is detected and has not entered verified resolution.` | `detect` | `ResolutionPending`, `Superseded` |
| `ResolutionPending` | `/// Formal repair evidence was submitted and awaits L2 verification.` | `request_resolution` | `Resolved`, `Superseded` |
| `Resolved` | `/// L2 re-read the formal owner truth and verified that the gap no longer applies.` | `resolve` | none |
| `Superseded` | `/// A newer typed gap or owner correction replaces this local gap record.` | `supersede` | none |

Stop review: closure requires a formal evidence ref, a separate L2 resolution decision and an owner re-read; a command cannot self-assert resolution; pass.

Closed gap classifiers used by Step 9 onward:

```rust
pub enum ConsistencyGapScope {
    ContractEvolution,
    CapabilityBinding,
    InvocationAdmission,
    ExecutionPrecondition,
    ExecutionSource,
    SafeExternalHandoff,
    ExternalStatus,
    ReferenceIntegrity,
    DerivedProjection,
}

pub enum ConsistencyGapClass {
    MissingReference,
    StaleReference,
    ConflictingReference,
    UnverifiableReference,
    MappingBlocked,
    RouteBlocked,
    TerminalConflict,
    PropagationIncomplete,
    CommitResolutionUnknown,
}

pub enum GapImpactClass {
    Informational,
    Degraded,
    Blocking,
    IntegrityCritical,
}
```

Every enum and variant receives English rustdoc. Scope names identify the L2 detector, not the external owner. A bounded stale-propagation continuation uses `DerivedProjection / PropagationIncomplete / Degraded`; terminal divergence uses `ExecutionSource / TerminalConflict / IntegrityCritical`; open authority/mapping/route seams use the matching scope and `UnverifiableReference`, `MappingBlocked` or `RouteBlocked`. `GapResolutionEvidenceRef::from_input(...)` deterministically derives its ID from authority, typed subject, locator and owner revision. `GapResolutionDecisionRef::verified(...)` deterministically derives its ID from gap/evidence/formal re-read basis and records no evidence body.

`ConsistencyGap::detect_propagation_incomplete(...)` is a pure factory requiring the exact
`TypedSubjectRef`, bounded page cursor, source/filter digest and detection time; it creates
`DerivedProjection / PropagationIncomplete / Degraded`. `GapSubjectRefSet::for_binding(...)` and
`GapSubjectRefSet::for_external_result(...)` are deterministic, sorted constructors and preserve
the local/external identity pair without adding an owner truth record.

## 4. `ReferenceConsistencyReport`

| Field | Type | Construction source |
|---|---|---|
| `report_id` | `ReferenceConsistencyReportId` | Deterministic report-key derivation or ID generator, mode fixed by Job protocol |
| `scope` | `ReferenceInspectionScope` | Job input / Query target |
| `assessment_refs` | `ReferenceAssessmentRefSet` | Assessment repository reads bounded by source watermark |
| `gap_refs` | `ConsistencyGapRefSet` | Gap repository reads for the same scope/watermark |
| `source_watermark` | `LocalTruthWatermark` | UoW-consistent repository watermark |
| `counts` | `ReferenceConsistencyCounts` | Pure aggregation over included refs |
| `state` | `DerivedReportState` | Coverage and read/build result only |
| `generated_at` | `ProjectionTime` | Job application clock |

| Callable | Contract |
|---|---|
| `build_complete(...) -> Result<Self, ProjectionError>` | Every planned partition completed at one compatible watermark; state `Current` |
| `build_partial(...) -> Result<Self, ProjectionError>` | Missing partitions and their gap refs are explicit; state `Partial` |
| `mark_stale(SourceWatermark)` | Returns a new report snapshot with `Stale`; does not mutate subjects |
| `failed(ReferenceInspectionScope, LocalTruthWatermark, DerivedFailureSummary, ProjectionTime)` | Creates body-free `Failed` report surface |
| `covers(&TypedSubjectRef)` / `has_open_gap()` | Pure membership / aggregation helpers |

| Variant | English rustdoc | Consumer meaning |
|---|---|---|
| `Current` | `/// The report covers its declared scope at the stored source watermark.` | May be consumed for that watermark only |
| `Partial` | `/// One or more declared partitions are absent and named as gaps.` | Must expose missing partitions |
| `Stale` | `/// Newer local truth exists than the report source watermark.` | Readable with explicit stale marker |
| `Failed` | `/// Report construction failed without changing inspected subject truth.` | Readable failure surface; never healthy |

Stop review: report identity, watermark, coverage and failure are explicit; report state cannot change any subject state; pass.

## 5. `ToolContractSearchProjection`

| Field | Type | Construction source |
|---|---|---|
| `projection_id` | `ToolContractSearchProjectionId` | Stable derivation from `tool_id` and projection schema version |
| `tool_id` | `ToolId` | Contract repository |
| `definition_revision` | `DefinitionRevision` | Contract current pointer at source watermark |
| `search_safe_summary` | `ToolSearchSafeSummary` | Formal definition safe mapper |
| `binding_summary` | `BindingModeSafeSummary` | Contract / current binding classification mapper |
| `lifecycle_summary` | `ToolContractLifecycleSummary` | Domain-to-contract mapper |
| `source_watermark` | `LocalTruthWatermark` | Projection builder repository snapshot |
| `projection_schema_version` | `ProjectionSchemaVersion` | Application constant, not config-overridable semantics |
| `freshness` | `FreshnessState` | Projection build / stale comparison result |

| Callable | Contract |
|---|---|
| `project(&ToolContract, &FormalToolDefinition, BindingModeSafeSummary, LocalTruthWatermark, ProjectionSchemaVersion)` | Exact tool/current-revision match and body-free mapper required |
| `mark_stale(LocalTruthWatermark)` | Returns a stale snapshot only when newer truth exists |
| `is_fresh_for(&LocalTruthWatermark)` | Exact comparable-watermark check |
| `matches_filter(&ToolContractSearchFilter)` | Pure match over safe indexed fields only |

`Fresh`, `Stale`, `Rebuilding`, `Unavailable`, `Failed` use the shared `FreshnessState` rustdoc from `contracts`; none is a tool lifecycle state. Search ordering is stable `(normalized_sort_key, tool_id)`, and cursor derivation is fixed in Step 8.

Stop review: projection has a deterministic identity/key and stable ordering inputs; no provider inventory, effective authorization or hidden refresh path exists; pass.

## 6. `ToolContractDiffSummary`

| Field | Type | Construction source |
|---|---|---|
| `diff_id` | `ToolContractDiffSummaryId` | Deterministic hash of tool/base/target revisions and diff schema version |
| `tool_id` | `ToolId` | Both formal definitions |
| `base_revision` | `DefinitionRevision` | Query / assessment input and repository read |
| `target_revision` | `DefinitionRevision` | Query / assessment input and repository read |
| `change_summary` | `DefinitionSemanticChangeSummary` | Pure semantic comparator over safe formal fields |
| `impact_ref` | `Option<CompatibilityImpactRef>` | Stored impact only when exact revision pair matches |
| `source_watermark` | `LocalTruthWatermark` | Repository snapshot |
| `freshness` | `FreshnessState` | Comparison material freshness |

Callables: `compare(&FormalToolDefinition, &FormalToolDefinition, Option<&ToolCompatibilityImpact>, LocalTruthWatermark) -> Result<Self, DomainError>`; `is_empty()`; `matches_pair(ToolId, DefinitionRevision, DefinitionRevision)`; `requires_impact_assessment()`. A reversed pair is a different diff identity and cannot reuse an impact ref without explicit direction validation.

Stop review: pair direction, watermark and optional impact symmetry are exact; comparison has no write, approval or adoption side effect; pass.

## 7. `ToolDiagnosticSummary`

| Field | Type | Construction source |
|---|---|---|
| `diagnostic_id` | `ToolDiagnosticSummaryId` | Deterministic subject/watermark/schema derivation |
| `subject_ref` | `ToolDiagnosticSubjectRef` | Query selector resolved to a typed L2 subject |
| `local_state` | `ToolLocalStateSafeSummary` | L2 truth repositories only |
| `assessments` | `ExternalAssessmentSafeSummary` | Stored consumption assessments only; no live pull |
| `attempts` | `LocalAttemptSafeSummary` | Stored handoff/submission attempts only |
| `gap_refs` | `ConsistencyGapRefSet` | Gap repository subject query |
| `source_watermark` | `LocalTruthWatermark` | UoW-consistent read snapshot |
| `freshness` | `FreshnessState` | Derived material state |

Callables: `derive(ToolDiagnosticSubjectRef, DiagnosticReadSet, LocalTruthWatermark) -> Result<Self, ProjectionError>`; `has_blocking_gap()`; `latest_local_attempt()`; `external_status_unknown()`; `is_safe_for_consumer(ConsumerContext)`. The object has no `healthy`, `ready`, `recover`, `retry`, `resume` or `repair` method.

Stop review: every diagnostic field is a body-free local read with an explicit watermark; Runtime cannot use this view as an orchestration checkpoint; pass.

## 8. `ToolConsumerGuidanceView`

| Field | Type | Construction source |
|---|---|---|
| `guidance_id` | `ToolConsumerGuidanceViewId` | Deterministic tool/revision/consumer-class/schema derivation |
| `tool_id` | `ToolId` | Contract read |
| `definition_revision` | `DefinitionRevision` | Current or explicitly requested formal revision |
| `consumer_class` | `ToolConsumerClass` | Query body; closed enum |
| `invocation_guidance` | `CanonicalInvocationGuidanceSummary` | Formal definition safe mapper |
| `precondition_guidance` | `ExecutionPreconditionGuidanceSummary` | Requirement basis safe mapper, not external decision |
| `binding_guidance` | `BindingModeSafeSummary` | Contract / relation mapper |
| `gap_refs` | `ConsistencyGapRefSet` | Visible subject gaps |
| `source_watermark` | `LocalTruthWatermark` | Repository snapshot |
| `freshness` | `FreshnessState` | View derivation state |

Callables: `project(&ToolContract, &FormalToolDefinition, Option<&CapabilityBinding>, ToolConsumerClass, ConsistencyGapRefSet, LocalTruthWatermark) -> Result<Self, ProjectionError>`; `supports_consumer_class()`; `has_blocking_gap()`; `is_current_for(DefinitionRevision, LocalTruthWatermark)`. Only body-free canonical semantic summaries are exposed.

Stop review: guidance has an exact consumer-class input and deterministic construction surface; it cannot generate executable client code, planning, authorization or carrier readiness; pass.

## 9. `SharedContractAuthorityRef`

| Field | Type | Required source / guard |
|---|---|---|
| `authority_ref_id` | `SharedContractAuthorityRefId` | ID generator or deterministic family locator |
| `core_authority_ref` | `CoreSharedContractAuthorityRef` | Configured compile authority candidate validated by `SharedContractAuthorityPort` |
| `contract_family` | `SharedContractFamily` | Caller request / fixed dependency inventory |
| `package_or_type_ref` | `Option<CorePackageOrTypeRef>` | Resolver result; absent until exact type exists |
| `authority_revision` | `Option<ExternalRevisionRef>` | Resolver result; no fabricated commit baseline |
| `state` | `SharedAuthorityResolutionState` | Exact resolution outcome |
| `assessed_at` | `ConsumptionTime` | Clock at resolver call |

| Factory / callable | Contract |
|---|---|
| `resolved(...)` | Package/type is searchable in the formal Core compile authority and semantics match |
| `candidate_only(...)` | A package candidate exists but Tools-specific type/schema is absent or not verified |
| `missing(...)` | No candidate for the requested family exists |
| `conflicting(...)` | Multiple candidates or semantic/version mismatch exists |
| `unverifiable(...)` | Formal authority or immutable revision cannot be proven |
| `permits_compile_reuse()` | True only for `Resolved` with package/type and compatible revision |

| Variant | English rustdoc | Current L2 use |
|---|---|---|
| `Resolved` | `/// The formal Core authority exposes a verified compatible package or type.` | Conditional; not asserted for Tools-specific schemas |
| `CandidateOnly` | `/// A compile-authority candidate exists, but the requested schema is not verified.` | Current Tools-specific default under `L2T-UP-008` |
| `Missing` | `/// No formal shared-contract candidate exists for the requested family.` | Local L2 type or blocked path, according to ownership |
| `Conflicting` | `/// Candidate authorities or schemas conflict.` | Fail closed |
| `Unverifiable` | `/// The formal authority or immutable revision cannot be proven.` | Fail closed |

Stop review: only an actually searchable, semantically verified Core type permits reuse; workspace file attribution is not a frozen commit claim; pass.

## 10. Module Gate

| Check | Result |
|---|---|
| Eight objects map to assessment, gap, report, projection, diff, diagnostic, guidance and authority-resolution capabilities | pass |
| Every identity, watermark, freshness and status field has one construction source | pass |
| Assessment and gap do not repair owner truth | pass |
| Report/projection/view state cannot become subject lifecycle or readiness | pass |
| Query-derived objects have deterministic IDs/keys and locally complete read sets | pass |
| Core candidate-only state remains blocked and does not fabricate package/type/revision authority | pass |
| No registry, authorization, Runtime recovery, Observability store, marketplace or SDK client truth was introduced | pass |
