# L4-observability 03-详细设计 Step 08 - S08-G Job J03 `RebuildSignalRollups`

> 对应 SOP: `standards/document/详细设计讨论流程_SOP.md` Step 08
> 状态: `defined_with_affected_open`；不是 implementation/runtime complete
> 回填目标: 正式 `03-详细设计.md` §7；仅在 Step 19 装配

## 1. Protocol identity and boundary

J03 rebuilds safe-signal rollup windows from committed `SafeSignal` and correlation projections. It does
not inspect raw logs, metrics or traces, infer missing source material, or turn a rollup into runtime truth.

| item | exact contract |
|---|---|
| public protocol | `ObservationJobRequest<RebuildSignalRollupsJobInput>` |
| internal operation | `ObservationJobOperation::RebuildSignalRollups` |
| entry callable | `ObservationOperationsJobService::rebuild_signal_rollups(RebuildSignalRollupsInput)` |
| work-key variant | `ObservationJobWorkKey::SignalRollup(SignalRollupWindowRef)` |
| planned material | window ref, scope, window kind, source cursor and captured repository/source version |
| Step 09 flow | `RebuildSignalRollupsFlow` |

## 2. Input/output schema

```rust
pub struct RebuildSignalRollupsJobInput {
    pub scope: SignalRollupScope,
    pub signal_cursor: Option<ObservationCursor>,
    pub window_refs: Vec<SignalRollupWindowRef>,
}

pub struct RebuildSignalRollupsJobOutput {
    pub rebuilt_window_refs: SignalRollupWindowRefSet,
    pub rebuild_refs: RollupRebuildRefSet,
    pub safe_signal_count: u32,
    pub progress_refs: RebuildProgressViewRefSet,
    pub gap_refs: GapStateRefSet,
}
```

`window_refs` is canonical sorted/unique; an empty list retains its explicit scope expansion semantics and
is resolved only during immutable plan materialization. `signal_cursor` is a source fence, not a proof of
freshness. `safe_signal_count` is a checked fold count, not a metric value or raw event count.

## 3. Candidate and claim material

Each `SignalRollup` item captures the exact window, scope, `RollupWindowKind`, source cursor, required
observation namespace and captured source version. A window ref is the global work identity; scope hash,
time string, cursor or current “latest window” cannot substitute for it. The plan is immutable and resume
does not expand or reorder windows.

## 4. Item flow, state and UoW

```text
claim SignalRollup(window_ref)
  -> read bounded committed SafeSignal/correlation material at source fence
  -> validate window/scope membership and rollup policy
  -> transition RollupRebuildState + SignalRollup in one local UoW
  -> append H11/follower only from accepted post-state
  -> classify item and release claim
```

No raw telemetry adapter is reachable from the item service. Empty valid input material may produce a
typed empty rollup if the domain owner permits it; missing or unreadable source is not silently treated as
empty. `Fresh`/`Completed` requires the owner’s source cursor and window coverage proof. `Cancelled` remains
reserved unless the canonical owner provides its exact protocol mapping.

## 5. Result, replay and failure matrix

| branch | item state/association | output/report |
|---|---|---|
| valid rebuild | `Succeeded` with exact window/rebuild refs | counts and refs from item fold |
| source gap/partial capture | owner-qualified gap/maintenance association | gap refs retained; no false Fresh |
| dependency unavailable | retryable/blocked per shared recovery owner | pending items remain pending |
| CAS/fence conflict | retryable or blocked | no overwrite of newer rollup |
| duplicate terminal request | exact stored report replay | no source reread/rebuild |
| commit unknown/corrupt result | manual/indeterminate | no guessed terminal response |

Job report/result is saved before reservation completion. A duplicate with a different public `JobRunId`
still returns the first stored correlation. No output field contains signal bodies, dimensions, provider
data or raw digest.

## 6. Redaction and truth boundary

Telemetry allows window kind, finite rollup/rebuild state, source-availability class, gap presence and
bounded counts. It excludes signal refs, cursor values, raw labels/values, trace IDs, source bodies and
consumer/provider details. J03 never writes source truth or business truth.

## 7. Step 09 handoff and affected

| item | contract |
|---|---|
| flow chain | exact Job assembler -> plan/window claim -> bounded SafeSignal read -> rollup transition -> fold/report |
| follower | accepted rollup/maintenance post-state only; J01 publishes any E03/E11 snapshot later |
| affected | `S08-G-J03-WINDOW-CARDINALITY-01`, `S08-G-J03-SOURCE-CURSOR-01`, `S08-G-J03-CANCELLED-SURFACE-01` remain `open_internal_affected` |
| status | `defined_with_affected_open`; not runtime-ready |
| implementation/evidence | not implemented, tested or run; no commit/run_id/evidence alias/signoff |
