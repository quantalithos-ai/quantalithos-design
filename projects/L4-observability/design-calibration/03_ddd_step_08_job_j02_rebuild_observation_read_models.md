# L4-observability 03-详细设计 Step 08 - S08-G Job J02 `RebuildObservationReadModels`

> 对应 SOP: `standards/document/详细设计讨论流程_SOP.md` Step 08
> 状态: `defined_with_affected_open`；不是 implementation/runtime complete
> 回填目标: 正式 `03-详细设计.md` §7；仅在 Step 19 装配

## 1. Protocol identity and boundary

J02 rebuilds only committed Observability read models and diagnostic summaries from bounded observation
facts and validated reference/projection inputs. It never repairs source truth, reruns commands, changes
business state, or treats a rebuilt view as evidence of source correctness.

| item | exact contract |
|---|---|
| public protocol | `ObservationJobRequest<RebuildObservationReadModelsJobInput>` |
| internal operation | `ObservationJobOperation::RebuildObservationReadModels` |
| entry callable | `ObservationOperationsJobService::rebuild_observation_read_models(RebuildObservationReadModelsInput)` |
| work-key variant | `ObservationJobWorkKey::ProjectionScope(ObservationProjectionScope)` |
| planned material | target policy snapshot, complete scopes, visibility input, source/reference cursors and captured versions |
| Step 09 flow | `RebuildObservationReadModelsFlow` |

## 2. Input/output schema

```rust
pub struct RebuildObservationReadModelsJobInput {
    pub target_ref: MaintenanceTargetRef,
    pub scopes: Vec<ObservationProjectionScope>,
    pub replay_scope_ref: Option<ReplayScopeRef>,
    pub diagnostic_visibility_scope_ref: VisibilityScopeRef,
    pub source_cursor: Option<ObservationCursor>,
}

pub struct RebuildObservationReadModelsJobOutput {
    pub read_model_refs: ObservationReadModelRefSet,
    pub diagnostic_summary_refs: DiagnosticSummaryRefSet,
    pub maintenance_refs: ProjectionMaintenanceRefSet,
    pub progress_refs: RebuildProgressViewRefSet,
    pub gap_refs: GapStateRefSet,
}
```

Scopes must be non-empty, canonical sorted/unique and compatible with `target_ref`. A replay scope is an
approved target-bound relation, not an authorization boolean; its membership and no-write relation are
validated before plan creation. `source_cursor` is a request minimum/source fence, never a row version or
permission to skip missing members. The visibility scope is a typed policy input, not caller-supplied final
visibility.

## 3. Candidate, work key and planned material

The start UoW captures a complete `ObservationProjectionScope` item for each scope, the target policy
snapshot, replay approval when present, observation/reference dependency namespace requirements, source
cursor and repository versions. `ProjectionScope` is globally unique across executions; a view ref,
maintenance ref or scope hash cannot replace it.

```text
reserve -> load target/scopes and complete source boundary
  -> materialize immutable ProjectionScope items
  -> create Draft report and commit start
  -> acquire each global scope claim/fence
```

The plan must not relist scope membership on resume, replace a source cursor with current configuration,
or rebuild a missing planned snapshot from current rows.

## 4. Item flow and write set

```text
claim ProjectionScope
  -> read complete committed source/reference bundle at captured fence
  -> evaluate owning derived-maintenance policy
  -> replace/read-model and diagnostic projection atomically with maintenance progress
  -> append H11 record/outbox follower when an accepted transition exists
  -> classify item and release claim
```

The flow may write `ObservationReadModel`, `DiagnosticSummary`, `ProjectionMaintenanceState`, progress
and local gap/degraded projections. It cannot write receipt/source/safety/business truth. `Fresh` requires
complete bound members, source/reference watermark parity and current marker proof; successful execution or
empty result alone cannot mark Fresh. Any source boundary incompleteness becomes stale/degraded/failed by
the owning matrix, never a truncated successful view.

## 5. Report, replay and error matrix

| condition | item/report behavior | forbidden shortcut |
|---|---|---|
| invalid target/scope/replay relation | reject before plan | default scope or infer target from route |
| duplicate terminal request | exact stored Job report replay | rerun rebuild |
| missing source member/reference | affected/gap or typed failure per owner | omit member and mark Fresh |
| source fence/CAS conflict | retryable or blocked item | overwrite newer projection |
| policy blocked/no-write | blocked item with typed association | create progress/success marker |
| accepted replacement | success/partial item with exact refs | report invents refs |
| commit unknown/corrupt plan | nonterminal/manual | rebuild from current truth |

The terminal report folds every planned scope exactly once. Output sets are copied from the fold and do not
become a second projection truth. Duplicate replay validates the stored plan/report digest and returns the
original `job_run_id`; it acquires no claim and performs no write.

## 6. Redaction and no-backwrite

Telemetry allows operation, target kind, scope kind, finite maintenance state, freshness, gap presence and
bounded counts. It excludes scope member values, source body, diagnostic text, cursor values, provider data,
credentials and actor/source identifiers as labels. J02 does not write source/business truth, external
acceptance, evidence, retention or report verdict.

## 7. Step 09 handoff and affected

| item | contract |
|---|---|
| flow chain | Job assembler -> Operations Job façade -> immutable plan -> claimed scope item -> projection writer -> report/result |
| transaction | start UoW; per-item fenced replace/record UoW; terminal report/result UoW |
| publication | only local H11/derived followers from accepted post-state; J01 publishes later |
| affected | `S08-G-J02-SCOPE-CARDINALITY-01`, `S08-G-J02-SOURCE-BUNDLE-01`, `S08-G-J02-FRESHNESS-MAPPER-01` remain `open_internal_affected` |
| status | `defined_with_affected_open`; not runtime-ready |
| implementation/evidence | not implemented, tested or run; no commit/run_id/evidence alias/signoff |
