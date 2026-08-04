# L4-observability 03-详细设计 Step 08 - S08-G Job J04 `RefreshReferenceSnapshots`

> 对应 SOP: `standards/document/详细设计讨论流程_SOP.md` Step 08
> 状态: `defined_with_affected_open`；不是 implementation/runtime complete
> 回填目标: 正式 `03-详细设计.md` §7；仅在 Step 19 装配

## 1. Protocol identity and truth boundary

J04 refreshes local body-free `ReferenceSnapshotState` through the approved resolver boundary. It does not
own Identity/Governance/Artifact/Runtime/Sandbox source truth, external object lifecycle, provider body,
authenticity verdict or evidence alias. A `Resolved` local snapshot is a safe observation projection only.

| item | exact contract |
|---|---|
| public protocol | `ObservationJobRequest<RefreshReferenceSnapshotsJobInput>` |
| internal operation | `ObservationJobOperation::RefreshReferenceSnapshots` |
| entry callable | `ObservationOperationsJobService::refresh_reference_snapshots(RefreshReferenceSnapshotsInput)` |
| work-key variant | `ObservationJobWorkKey::ReferenceSnapshot(ReferenceSnapshotStateRef)` |
| planned material | canonical snapshot-state ref, subject/state snapshot, freshness policy, source version and reference cursor |
| Step 09 flow | `RefreshReferenceSnapshotsFlow` |

## 2. Input/output schema

```rust
pub struct RefreshReferenceSnapshotsJobInput {
    pub scope: ObservationReferenceRefreshScope,
    pub freshness_policy_ref: ReferenceFreshnessPolicyRef,
    pub snapshot_refs: Vec<ReferenceSnapshotStateRef>,
}

pub struct RefreshReferenceSnapshotsJobOutput {
    pub refreshed_snapshot_refs: ReferenceSnapshotStateRefSet,
    pub stale_snapshot_refs: ReferenceSnapshotStateRefSet,
    pub unresolved_snapshot_refs: ReferenceSnapshotStateRefSet,
    pub reference_refresh_record_refs: ReferenceRefreshRecordRefSet,
    pub progress_refs: RebuildProgressViewRefSet,
    pub gap_refs: GapStateRefSet,
}
```

Only current canonical `ReferenceSnapshotStateRef` is accepted; historical `ReferenceSnapshotRef` has no
decoder or alias. The snapshot list is sorted/unique. Empty expansion has an explicit scope meaning and is
frozen into the plan; resume never re-reads current configuration or selects a new head.

## 3. Candidate, resolver and claim boundary

Each item captures the complete local subject/state relation, source-version relation, P15 freshness policy
basis, reference cursor and repository version. The resolver receives a typed body-free reference and
trusted context only. It may return finite `Resolved`, `Stale`, `Unresolved`, `Invalid` or `Unavailable`
outcomes according to the canonical resolver contract; it must not expose provider body or locator.

`ReferenceSnapshot` work-key uniqueness prevents two executions from refreshing the same local state. A
claim/fence protects local snapshot/state/record writes; it does not authorize an external source mutation
and does not prove the external source accepted anything.

## 4. Item flow and UoW

```text
claim ReferenceSnapshotStateRef
  -> load exact planned state/policy/source relation
  -> evaluate P15 freshness and P17 maintenance authorization
  -> resolver call with body-free typed request
  -> map SafeResolution<T> to owner transition/new-snapshot branch
  -> append H10 refresh record and E10 follower when changed
  -> save item/report/result and release claim under CAS
```

An in-place transition and a required-new-snapshot creation are distinct branches. The flow cannot fabricate
an old-row transition for a new identity, preserve unusable summary/version fields by guessing, or mark
`Fresh` from a successful resolver call alone. The accepted post-state, policy bases and reference cursor
must be from one coherent boundary.

## 5. Replay and failure matrix

| condition | item/report behavior | prohibited shortcut |
|---|---|---|
| invalid/foreign snapshot ref | reject before plan | cast subject/external ref or choose latest |
| resolver `Resolved` | exact local state transition if P15/P17 permits | declare external object active/authentic |
| resolver stale/unresolved/invalid | exact state/reason and optional gap refs | collapse all to failure or missing |
| resolver unavailable | retryable/blocked owner outcome | synthesize `Unresolved` or clear current state |
| CAS/fence conflict | retryable/blocked | overwrite newer snapshot |
| duplicate terminal request | exact stored report replay | refresh again |
| commit/result unknown | probe original identities; no terminal action | rebuild from current source |

Result-before-completion and exact stored replay reuse the shared Job carrier. Publication of E10, if any,
is later performed by J01 from its immutable snapshot; J04 never publishes directly.

## 6. Redaction and no-backwrite

Telemetry permits finite resolver/state/reason/presence tokens, source availability class, gap presence and
bounded counts. It excludes safe summary body, source/provider response, locator, credentials, full refs,
digest bytes, actor and raw trace. J04 does not write external source truth, business truth, evidence,
retention or report handoff.

## 7. Step 09 handoff and affected

| item | contract |
|---|---|
| flow chain | assembler -> immutable snapshot plan -> claim -> resolver -> state/record/follower -> report |
| state boundary | local reference lifecycle remains distinct from projection freshness |
| affected | `S08-G-J04-SNAPSHOT-CARDINALITY-01`, `S08-G-J04-RESOLVER-OUTCOME-MAPPER-01`, `S08-G-J04-NEW-SNAPSHOT-PROOF-01` remain `open_internal_affected` |
| status | `defined_with_affected_open`; not runtime-ready |
| implementation/evidence | not implemented, tested or run; no commit/run_id/evidence alias/signoff |
