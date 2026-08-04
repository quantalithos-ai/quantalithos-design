# L4-observability 03-详细设计 Step 08 - S08-G Job J09 `RebuildPeripheralViews`

> 对应 SOP: `standards/document/详细设计讨论流程_SOP.md` Step 08
> 状态: `defined_with_affected_open`；不是 implementation/runtime complete
> 回填目标: 正式 `03-详细设计.md` §7；仅在 Step 19 装配

## 1. Protocol identity and non-owner boundary

J09 rebuilds local `DashboardAlertExportView` and related peripheral read surfaces from committed
Observability projections. It does not write core observation truth, consumer truth, report truth, export
acceptance, evidence body, retention state or external delivery state except for explicitly owner-backed
local derived markers.

| item | exact contract |
|---|---|
| public protocol | `ObservationJobRequest<RebuildPeripheralViewsJobInput>` |
| internal operation | `ObservationJobOperation::RebuildPeripheralViews` |
| entry callable | `ObservationOperationsJobService::rebuild_peripheral_views(RebuildPeripheralViewsInput)` |
| work-key variant | `ObservationJobWorkKey::PeripheralView { consumer_ref_id, projection_scope }` |
| planned material | complete consumer snapshot, exact projection scope, view snapshot, source cursor and captured versions |
| Step 09 flow | `RebuildPeripheralViewsFlow` |

## 2. Input/output schema

```rust
pub struct RebuildPeripheralViewsJobInput {
    pub consumer_targets: Vec<PeripheralViewRebuildTarget>,
    pub source_cursor: Option<ObservationCursor>,
}

pub struct RebuildPeripheralViewsJobOutput {
    pub view_refs: DashboardAlertExportViewRefSet,
    pub delivery_refs: PeripheralDeliveryRefSet,
    pub progress_refs: RebuildProgressViewRefSet,
    pub failed_consumer_refs: PeripheralConsumerRefSet,
    pub gap_refs: GapStateRefSet,
}
```

`PeripheralViewRebuildTarget` is the application/private typed pair of complete `PeripheralConsumerRef`
and `ObservationProjectionScope`; it is not `PeripheralConsumerScopeRef`, a route, endpoint or product
string. Targets are canonical sorted/unique by the complete pair. `source_cursor` is a lower read fence,
not a freshness assertion.

## 3. Candidate and claim material

Each item stores the complete consumer policy snapshot, catalog state, projection scope, existing view
snapshot, dependency namespaces, source cursor and captured repository versions. The global work key retains
only stable consumer id plus canonical projection scope; mutable consumer state and view ref remain in the
planned material so they cannot be used as a second global identity.

Resume must use the committed plan material. It cannot relist current consumer catalog, silently drop a
retired consumer, substitute current scope, or rebuild a missing view snapshot from a partial row.

## 4. Item flow and local write boundary

```text
claim PeripheralView(consumer_ref_id, projection_scope)
  -> load complete committed observation/read/projection bundle
  -> evaluate visibility/freshness/gap/consumer policy
  -> replace DashboardAlertExportView atomically when accepted
  -> append derived E11/E12 follower only from accepted post-state
  -> classify item and release claim
```

The job may record a local degraded/gap/progress projection when the owning policy permits it. It may not
write `PeripheralDeliveryState` merely because a view was rebuilt, and it may not call an external delivery
adapter. A view being present or rebuilt does not prove the external consumer accepted or rendered it.

## 5. Error, replay and report matrix

| condition | behavior | forbidden shortcut |
|---|---|---|
| invalid consumer/scope pair | reject before plan | derive scope from consumer catalog name |
| consumer retired/disabled | blocked/skipped per typed owner policy | silently fallback to another consumer |
| incomplete source/reference bundle | degraded/gap/failed item | truncate and mark Fresh |
| visibility or retention block | blocked item with exact policy refs | override with caller visibility |
| accepted replacement | exact view/progress refs and E11/E12 as applicable | write core truth or delivery marker |
| CAS/fence conflict | retryable/blocked | overwrite newer view |
| duplicate terminal request | exact stored report replay | rebuild again |
| commit/result unknown | probe/manual | synthesize success |

The report fold preserves failed consumer refs and gap/progress refs. Public output does not expose view body,
consumer endpoint, route, credential, provider result or raw diagnostic content.

## 6. Redaction and no-backwrite

Telemetry permits consumer-kind, scope-kind, finite view/freshness/gap/recovery tokens and bounded counts.
It excludes consumer ids/full refs as labels, view body, source body, endpoint, credential, actor, trace and
provider detail. J09 does not write core observation truth, source/business truth, external acceptance,
evidence or retention cleanup.

## 7. Step 09 handoff and affected

| item | contract |
|---|---|
| flow chain | assembler -> canonical consumer/scope plan -> claim -> committed source bundle -> view replace -> fold/report |
| publication | any E11/E12 snapshot is later published only by J01 |
| peripheral identity | complete `(PeripheralConsumerRefId, ObservationProjectionScope)` pair; no unowned scope alias |
| affected | `S08-G-J09-TARGET-CARDINALITY-01`, `S08-G-J09-SOURCE-BUNDLE-01`, `S08-G-J09-FRESHNESS-VISIBILITY-MAPPER-01` remain open |
| status | `defined_with_affected_open`; not runtime-ready |
| implementation/evidence | not implemented, tested or run; no commit/run_id/evidence alias/signoff |
