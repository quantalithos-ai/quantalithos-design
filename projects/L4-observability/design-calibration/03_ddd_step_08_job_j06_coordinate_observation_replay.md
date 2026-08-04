# L4-observability 03-详细设计 Step 08 - S08-G Job J06 `CoordinateObservationReplay`

> 对应 SOP: `standards/document/详细设计讨论流程_SOP.md` Step 08
> 状态: `defined_with_affected_open`；不是 implementation/runtime complete
> 回填目标: 正式 `03-详细设计.md` §7；仅在 Step 19 装配

## 1. Protocol identity and truth boundary

J06 coordinates observation-side replay for one approved scope target at a time. It does not execute source
repair, mutate business truth, bypass retention/no-write policy, or turn a local coordination state into an
external run or completion proof. The upstream H13 dependency remains explicitly controlled/open.

| item | exact contract |
|---|---|
| public protocol | `ObservationJobRequest<CoordinateObservationReplayJobInput>` |
| internal operation | `ObservationJobOperation::CoordinateObservationReplay` |
| entry callable | `ObservationOperationsJobService::coordinate_observation_replay(CoordinateObservationReplayInput)` |
| work-key variant | `ObservationJobWorkKey::ReplayTarget(MaintenanceTargetRefId)` |
| planned material | exact target policy snapshot, approved replay scope relation, no-write guard and retention/protection snapshot |
| Step 09 flow | `CoordinateObservationReplayFlow` |

## 2. Input/output schema

```rust
pub struct CoordinateObservationReplayJobInput {
    pub replay_scope_ref: ReplayScopeRef,
    pub target_ref: MaintenanceTargetRef,
    pub no_write_guard_ref: NoWriteTriggerContextRef,
}

pub struct CoordinateObservationReplayJobOutput {
    pub coordination_refs: ReplayCoordinationRefSet,
    pub execution_record_refs: ReplayExecutionRecordRefSet,
    pub maintenance_refs: ProjectionMaintenanceRefSet,
    pub blocked_target_refs: MaintenanceTargetRefSet,
    pub gap_refs: GapStateRefSet,
}
```

The input is a complete target-bound tuple. `replay_scope_ref` must resolve to an existing approved scope;
scope definition alone is not an H13 input. `no_write_guard_ref` is a typed boundary context, not a bool
submitted to authorize replay. Output refs describe local coordination/record/progress facts only.

## 3. Candidate and policy proof

Each item stores exact target descriptor, scope membership proof, P10 no-write decision input, P18 replay
approval snapshot, retention/active-reference lookup and source cursor/versions. `ReplayTarget` work-key
uniqueness prevents two executions from coordinating the same target concurrently. A plan item may not be
constructed from a target ID alone.

Before item mutation, the flow must prove: target is in approved scope, target/effect pair is valid, retention
and active-reference restrictions are loaded at the same boundary, and no-write policy permits the requested
observation-side effect. A claim/fence authorizes local coordination writes only; it cannot replace any of
these policy proofs.

## 4. Item flow and UoW

```text
claim ReplayTarget
  -> validate approved scope/membership + retention/protection + P10/P17/P18 inputs
  -> transition ReplayCoordinationState for one target
  -> append H13 record only when the upstream H13 accepted-result contract exists
  -> optionally stage derived-maintenance marker/follower according to exact owner
  -> fold item and release claim
```

Until `R06.6-F2-H13-UPSTREAM` is closed, J06 cannot claim that an accepted H13 record or execution result
exists. A blocked/unsupported target is a typed blocked item, not a fabricated replay record. J06 never
calls source-owner mutation ports or external provider effects.

## 5. Replay, error and report matrix

| condition | behavior | forbidden shortcut |
|---|---|---|
| scope missing/not approved | reject or blocked before item | treat scope ref as approval |
| target not in scope | typed relation mismatch | create synthetic membership |
| no-write/retention blocked | blocked item with typed policy refs | continue with local bool |
| H13 upstream capability absent | controlled affected/blocked state | fake execution record/result |
| accepted coordination transition | stored local coordination refs | call source repair |
| duplicate terminal request | exact stored report replay | re-coordinate target |
| commit/CAS unknown | probe/manual | default success/retry |

The report preserves pending targets and distinguishes `Blocked` from `FailedPermanent`. It cannot mark
source repaired, business truth updated, external run completed or acceptance obtained.

## 6. Redaction and no-backwrite

Telemetry permits target kind, finite coordination/block/recovery tokens, policy presence, gap presence and
bounded counts. It excludes target member data, scope contents, actor, guard refs, source body, provider data,
credentials and real run identifiers. J06 does not write source/business truth, evidence or retention truth.

## 7. Step 09 handoff and affected

| item | contract |
|---|---|
| flow chain | assembler -> approved target plan -> claim -> policy proof -> coordination transition -> report |
| H13 boundary | `R06.6-F2-H13-UPSTREAM=open_controlled`; no fabricated H13 record/result |
| affected | `S08-G-J06-H13-CAPABILITY-01`, `S08-G-J06-TARGET-CARDINALITY-01`, `S08-G-J06-POLICY-PROOF-01` remain open |
| status | `defined_with_affected_open`; not runtime-ready |
| implementation/evidence | not implemented, tested or run; no commit/run_id/evidence alias/signoff |
