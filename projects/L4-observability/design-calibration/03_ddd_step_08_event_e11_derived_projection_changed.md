# L4-observability 03-详细设计 Step 08 - S08-F Event E11 `DerivedProjectionChanged`

> 对应 SOP: `standards/document/详细设计讨论流程_SOP.md` Step 08
> 状态: `defined_with_affected_open`；不是 implementation/runtime complete
> 回填目标: 正式 `03-详细设计.md` §7；仅在 Step 19 装配

## 1. Purpose, source and truth boundary

E11 发布一个已提交的 Observability 派生投影或维护状态变更。它让 read model、diagnostic、rollup、
maintenance 和 replay coordinator 的下游投影可以按 committed revision 增量处理；它不发布 source
truth、业务 truth、原始 telemetry、external provider body、report verdict 或执行完成证明。

| item | exact contract |
|---|---|
| public name / code | `DerivedProjectionChanged` / `0x050b` |
| payload | `DerivedProjectionChangedPayload` |
| source | accepted domain transition / creation post-state from one local UoW |
| subject | one tagged `DerivedProjectionSubject`; never a nullable union of unrelated refs |
| follower | `ObservationOutboxFollowerSeed::DerivedProjectionChanged` |
| publication | only J01 `PublishObservationOutbox` consumes the immutable stored pair |
| Step 09 reservation | `ProduceDerivedProjectionChangedFlow` |

The event is emitted only when the owning object has an accepted transition or accepted creation with a
changed post-state. A failed policy evaluation, stale decision, no-op, pre-UoW validation error, rollback,
or `ProjectionMaintenanceState` query does not create E11.

## 2. Tagged subject schema

The tagged subject is the only way to distinguish the five supported derived surfaces. A set of nullable
`read_model_ref`, `diagnostic_ref`, `maintenance_ref`, `rollup_ref` and `replay_ref` fields is forbidden:
such a shape permits multiple subjects and creates a second state machine in the wire contract.

```rust
/// Exactly one committed derived/projection subject changed in this event.
pub enum DerivedProjectionSubject {
    ObservationReadModel {
        read_model_ref: ObservationReadModelRef,
        scope: ObservationProjectionScope,
    },
    DiagnosticSummary {
        summary_ref: DiagnosticSummaryRef,
        scope: DiagnosticScopeRef,
    },
    ProjectionMaintenance {
        maintenance_ref: ProjectionMaintenanceRef,
        target_ref: MaintenanceTargetRef,
    },
    RollupRebuild {
        rebuild_ref: RollupRebuildRef,
        window_ref: SignalRollupWindowRef,
    },
    ReplayCoordination {
        coordination_ref: ReplayCoordinationRef,
        target_ref: MaintenanceTargetRef,
    },
}

/// Body-free committed post-state notification for one derived subject.
pub struct DerivedProjectionChangedPayload {
    pub subject: DerivedProjectionSubject,
    pub state: DerivedProjectionState,
    pub freshness: Option<DiagnosticFreshnessState>,
    pub progress_ref: Option<RebuildProgressViewRef>,
    pub affected_gap_refs: GapStateRefSet,
    pub committed_at: ObservedAt,
}

impl ObservationOutboundPayload for DerivedProjectionChangedPayload {
    const EVENT: ObservationOutboundEventName =
        ObservationOutboundEventName::DerivedProjectionChanged;
}
```

`DerivedProjectionState` is a Step 08 protocol mapping surface, not a new domain state owner. Its tagged
variants must map losslessly to the owning current type:

| subject tag | state source | allowed optional fields | forbidden interpretation |
|---|---|---|---|
| `ObservationReadModel` | committed `ObservationReadModel` / projection maintenance post-state | freshness, progress, gaps according to the point snapshot | source fact or business state |
| `DiagnosticSummary` | committed `DiagnosticSummary` post-state | diagnostic freshness, progress, gaps | control command or diagnosis of external system |
| `ProjectionMaintenance` | `ProjectionMaintenanceState` transition/post-state | progress, dual-watermark-derived freshness, gaps | projection correctness or source repair |
| `RollupRebuild` | `RollupRebuildState` transition/post-state | progress, rollup freshness, gaps | raw metric/trace truth or completed source scan |
| `ReplayCoordination` | `ReplayCoordinationState` transition/post-state | progress/gaps only where the owner supplies them | replay authorization, source mutation or execution result |

The exact enum members and wire discriminators must be taken from the current contracts/domain owner. E11
does not add `Other`, `Unknown`, free-text state, or a second `Cancelled` mapping. `RollupRebuildKind::Cancelled`
must remain either an explicitly supported tagged variant from the owner or a typed unsupported/consistency
branch; it must not silently become `Completed`.

## 3. Field authority and presence matrix

| field | sole source | validation | forbidden fallback |
|---|---|---|---|
| `subject` | accepted transition subject and owning post-state | tag, identity, target/scope relation and event subject must agree | payload-first ref selection, current lookup, event-name inference |
| `state` | owning post-state | exact state/subject compatibility | boolean success, timestamp, error text |
| `freshness` | persisted projection/rollup marker or owning view post-state | required only for tags whose owner exposes it; independent from lifecycle state | `Completed`/`Resolved` => `Fresh`, successful read, row version |
| `progress_ref` | same-UoW committed progress relation when present | target/subject and revision equality | minting progress on read, latest progress lookup, count-derived ref |
| `affected_gap_refs` | accepted post-state relation | canonical sorted/unique set; empty is valid only when source proves no affected gaps | gap count, unrelated gap, current latest gap |
| `committed_at` | trusted clock value captured by the accepted UoW | equal to record/outbox committed time | repository timestamp, provider time, event publication time |

Presence is state-specific and exhaustive. `None` means the owning contract explicitly has no value at this
committed revision; it never means “not loaded”. If a required field is missing, the follower fails closed
and the source UoW does not append a partial E11.

## 4. Construction, cursor and immutable snapshot

The only legal construction path is:

```text
accepted derived-object transition or creation
  -> validate tagged subject against before/after and policy basis
  -> read same-UoW post-state and exact projection/maintenance relation
  -> allocate one tagged Observation cursor
  -> construct typed E11 V1 envelope
  -> encode and freeze ObservationOutboxPayloadSnapshot
  -> append outbox record + follower in the same UoW
  -> commit source state, records, stored result and outbox atomically
```

The protocol envelope uses the shared `ObservationOutboundEventEnvelope<T>` and the application durable
`ObservationOutboxPayloadSnapshot`. E11's immutable snapshot retains event name, schema version, subject,
committed cursor, canonical bytes, digest and historical effect binding. J01 never rehydrates E11 from
current read models or current configuration.

One accepted transition produces at most one E11 for the same `(operation, subject, committed cursor)`.
Exact replay returns the original stored result and does not produce another event. A mixed UoW uses one
Observation cursor; a reference namespace or maintenance namespace must be carried by the owner-approved
tagged cursor and cannot be replaced by a generic integer.

## 5. Subscriber and error boundary

Permitted subscriber classes are read-model projector, diagnostic projector, rollup progress projector,
maintenance progress reader and replay coordination observer. Subscribers may update only their own derived
projection. They must not call source-owner writers, change retention, create evidence, close a gap without
its policy decision, or turn replay coordination into source execution.

| condition | required behavior |
|---|---|
| subject/post-state mismatch | typed invariant error; whole source UoW rollback |
| illegal state/presence combination | fail closed; no outbox pair |
| missing progress/gap relation required by owner | typed consistency/affected boundary; no synthetic ref |
| encoder/schema/size failure | rollback source transition and follower staging |
| publication known failure | local derived truth remains committed; J01 records publication failure |
| publication outcome unknown | probe the same token; never blind resend or rebuild payload |
| missing/corrupt stored snapshot | consistency/manual recovery; never read current truth to reconstruct |

Log, metric and trace fields are limited to event/schema discriminator, subject tag, finite state/reason,
presence flags, cursor namespace and bounded counts. Full refs, digest bytes, actor, source event, raw
telemetry, provider detail, topic, endpoint, credential and report body are excluded.

## 6. Affected and closure

| check | conclusion |
|---|---|
| tagged subject and no nullable parallel state machine | complete at design level |
| five subject-to-owner mappings | recorded; owner-specific state matrices remain downstream affected |
| source/post-state/cursor authority | recorded with same-UoW requirement |
| publication/replay boundary | reuses shared immutable snapshot and J01 |
| local affected | `S08-F-E11-FLOW-CARDINALITY-01=open_internal_affected`; Step 09 must enumerate creation/transition/no-op branches per tag |
| downstream affected | Step 10/11/12/13/14/15 consumers remain open and are not duplicated here |
| status | `defined_with_affected_open`; not runtime-ready |
| implementation/evidence | not implemented, tested or run; no commit/run_id/evidence alias/signoff |
