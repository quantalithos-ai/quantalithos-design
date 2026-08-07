# L2-tools Step 6 模块附录: Capability Binding 与受控来源对象契约

> 状态: completed / pass
> 主文件: `03_ddd_step_06_object_contracts.md`
> Authority: 正式 `02-概要设计.md` §6.3 / §12.2.2
> 作用: 补齐六个对象的 exact 字段、callable、分类与模块停审；不复制 Hub registry truth。

## 1. Capability 到对象

| Capability | Owner object | Rule |
|---|---|---|
| 声明 / 替换 / 失效 relation | `CapabilityBinding` | Owning Command only; bound and explicit-unbound are formal choices |
| 消费时点评估 | `CapabilityBindingAssessment` | New immutable assessment per consumption time |
| 保存 Hub 安全摘要 | `HubControlledSnapshot` | Body-free point-in-time snapshot, no lifecycle ownership |
| 稳定读取 | `CapabilityBindingView` | Relation + selected assessment + gaps |
| 定位 Hub capability | `HubCapabilityRef` | Typed authority/id/revision, no name-only resolution |
| 记录 relation 变化 | `CapabilityBindingChangeFact` | Append-only in same UoW as relation mutation |

## 2. `CapabilityBinding`

| Field | Type | Required source / guard |
|---|---|---|
| `binding_id` | `CapabilityBindingId` | Application ID generator |
| `tool_id` | `ToolId` | Existing active contract |
| `mode` | `BindingMode` | Command closed variant |
| `capability_ref` | `Option<HubCapabilityRef>` | Required for `Bound`, forbidden for `ExplicitUnbound` |
| `lifecycle_state` | `BindingLifecycleState` | Domain factory / owning transition |
| `replacement_binding_id` | `Option<CapabilityBindingId>` | Required only after atomic replacement; points to the new active relation |
| `invalidation_reason` | `Option<BindingInvalidationReason>` | Required only after invalidation |
| `version` | `ExpectedVersion` | Repository version |

| Callable | Preconditions | Result / error |
|---|---|---|
| `declare(CapabilityBindingId, ToolId, BindingMode, Option<HubCapabilityRef>)` | No current relation for tool; mode/ref symmetric | Active relation; `InvalidBindingMode`, `DuplicateRelation` |
| `begin_replacement(&mut self, ExpectedVersion)` | Active and expected version matches | `ReplacementPending`; `VersionConflict` |
| `replace(self, CapabilityBindingId, BindingMode, Option<HubCapabilityRef>)` | Pending; new relation validates | Old relation `Replaced` with successor ID, new active relation |
| `invalidate(&mut self, BindingInvalidationReason)` | Active or pending | `Invalidated` with reason; no deletion |
| `is_applicable_for_new_invocation()` | none | True only active; assessment still required for bound mode |

| Variant | English rustdoc | Allowed destination |
|---|---|---|
| `Active` | `/// The formal relation may be assessed for new consumption.` | `ReplacementPending`, `Invalidated` |
| `ReplacementPending` | `/// A replacement was requested but the new relation is not committed.` | `Replaced`, `Invalidated` |
| `Replaced` | `/// A newer formal relation supersedes this historical relation.` | none |
| `Invalidated` | `/// The relation is no longer applicable to new consumption.` | none |

Stop review: `None` never implies unbound; Hub cannot mutate relation; pass.

## 3. `CapabilityBindingAssessment`

| Field | Type | Source |
|---|---|---|
| `assessment_id` | `BindingAssessmentId` | ID generator |
| `binding_id` | `CapabilityBindingId` | Relation under assessment |
| `snapshot_ref` | `Option<HubSnapshotRef>` | Hub resolver result when bound |
| `assessment_state` | `BindingAssessmentState` | Domain validation of mode, subject, authority, revision, freshness |
| `basis_refs` | `Vec<BindingBasisRef>` | Binding / snapshot / gap refs; deduplicated |
| `consumed_at` | `ConsumptionTime` | Application clock |

Callables: `assess(&CapabilityBinding, Option<&HubControlledSnapshot>, ConsumptionTime) -> Self`; `permits_anchor() -> bool`; `requires_gap() -> bool`; `gap_class() -> Option<ConsistencyGapClass>`; `matches_binding(CapabilityBindingId) -> bool`. `ExplicitUnbound` creates `AcceptedExplicitUnbound`; bound without verified snapshot yields conservative state. `gap_class()` returns `None` for accepted states and the exact missing/stale/conflicting/unverifiable classifier for conservative states.

| Variant | English rustdoc | Effect |
|---|---|---|
| `AcceptedBound` | `/// The bound relation and Hub snapshot are verifiable at this consumption time.` | May anchor invocation |
| `AcceptedExplicitUnbound` | `/// The formal relation explicitly declares that no Hub capability is bound.` | May anchor unbound mode; not authorization |
| `Missing` | `/// A required relation or snapshot is missing.` | Blocks affected use |
| `Stale` | `/// The consumed snapshot does not satisfy the current relation revision.` | Blocks affected use |
| `Conflicting` | `/// Relation, authority, subject or revision inputs conflict.` | Blocks affected use |
| `Unverifiable` | `/// The source cannot be proven to be the formal Hub boundary.` | Fail closed |

Stop review: per-time fact, no in-place flip, no auth meaning; pass.

## 4. `HubControlledSnapshot`

| Field | Type | Source / guard |
|---|---|---|
| `snapshot_id` | `HubSnapshotId` | Application ID generator or external formal snapshot ref under protocol rule |
| `authority_ref` | `HubAuthorityRef` | `HubControlledSourcePort` |
| `capability_ref` | `HubCapabilityRef` | Port result; subject must match request |
| `source_revision` | `ExternalRevisionRef` | Port result |
| `safe_summary` | `HubCapabilitySafeSummary` | Port mapping; body-free allowlist of fields |
| `observed_at` | `ConsumptionTime` | Application clock at response consumption |
| `resolution_state` | `ExternalReferenceState` | Resolver outcome |

Callables: `from_port(...) -> Result<Self, DomainError>`; `matches(&HubCapabilityRef) -> bool`; `supports_assessment() -> bool`; `to_stale_assessment(SourceChangeRef) -> ReferenceValidityAssessment`. Snapshot is immutable; later clues create a new snapshot / assessment.

Stop review: no provider, descriptor, inventory or registry body; pass.

## 5. `CapabilityBindingView`

| Field | Type | Source |
|---|---|---|
| `binding_id`, `tool_id`, `mode` | typed IDs / enum | Current formal relation |
| `selected_assessment` | `Option<BindingAssessmentSummary>` | Exact requested / latest applicable assessment chosen by repository rule |
| `source_summary` | `Option<HubCapabilitySafeSummary>` | Snapshot referenced by selected assessment |
| `gap_refs` | `Vec<ConsistencyGapRef>` | Gap repository for subject |
| `visibility` | `ConsumptionVisibility` | Application read visibility decision |

`project(...) -> Result<Self, ProjectionError>` requires assessment/snapshot reference symmetry. `is_current_for(ConsumptionTime)` and `is_explicit_unbound()` are pure. Query never creates an assessment or fetches Hub body. Stop review: pass.

## 6. `HubCapabilityRef`

| Field | Type | Source / guard |
|---|---|---|
| `authority_ref` | `HubAuthorityRef` | Formal configured adapter plus returned authority identity |
| `capability_id` | `ExternalCapabilityId` | Hub controlled source, never display name |
| `capability_revision` | `ExternalRevisionRef` | Hub result |
| `locator` | `ExternalLocatorSummary` | Body-free resolver locator |

Callables: `resolve(HubAuthorityRef, ExternalCapabilityId, ExternalRevisionRef, ExternalLocatorSummary) -> Result<Self, DomainError>`; `matches_authority`; `matches_subject`; `same_revision`. No `from_name` or inventory fallback exists. Stop review: pass.

## 7. `CapabilityBindingChangeFact`

| Field | Type | Source |
|---|---|---|
| `change_fact_id` | `BindingChangeFactId` | ID generator before commit |
| `binding_id` | `CapabilityBindingId` | Subject relation |
| `successor_binding_id` | `Option<CapabilityBindingId>` | Required only for `Replaced`; identifies the newly active relation without changing the old subject identity |
| `change_kind` | `BindingChangeKind` | Owning Command closed mapping |
| `previous_ref`, `current_ref` | `Option<HubCapabilityRefSummary>` | Pre/post relation snapshots |
| `actor_ref`, `reason`, `correlation_ref` | typed metadata | Command metadata / request |
| `recorded_at` | `DecisionTime` | Clock |

| Variant | English rustdoc | Symmetry rule |
|---|---|---|
| `DeclaredBound` | `/// Records creation of a formal bound relation.` | previous none, current some |
| `DeclaredExplicitUnbound` | `/// Records creation of an explicit-unbound relation.` | both refs none, mode in subject is explicit |
| `Replaced` | `/// Records atomic replacement of one formal relation by another.` | old subject ID + required successor ID; previous/current follow old/new modes |
| `Invalidated` | `/// Records formal invalidation without deleting relation history.` | previous may exist, current none |

Factory `record(...)` validates kind/ref symmetry, requires `successor_binding_id != binding_id` only for `Replaced`, and forbids a successor for declaration/invalidation. Only committed change facts may form `CapabilityBindingChanged` material. Stop review: pass after Step 9 replacement-identity correction.

## 8. Module Gate

| Check | Result |
|---|---|
| Six objects map to all relation/source capabilities | pass |
| Mode/ref and assessment/snapshot symmetry exact | pass |
| Hub source is runtime Port, not Cargo/domain owner | pass |
| Consumer clue cannot mutate relation or old anchors | pass |
| Missing / stale / conflict never becomes unbound or valid | pass |
| Fields and callables have one source | pass |
