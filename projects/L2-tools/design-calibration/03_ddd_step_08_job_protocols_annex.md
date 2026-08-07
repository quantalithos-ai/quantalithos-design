# L2-tools Step 8 协议附录: 4 Operations Job protocols

> 状态: completed / pass
> 主文件: `03_ddd_step_08_protocol_contracts.md`
> Public owner: `contracts::jobs`
> Entry: four one-shot binaries -> `ToolJobUseCases`
> Global rule: one call processes one bounded deterministic slice; no scheduler/run/lease/evidence truth and no core-subject repair.

## 1. Job definition batch

| # | Job | Target material | Allowed writes | External Port | Step 9 flow | Stop |
|---:|---|---|---|---|---|---|
| 1 | `CheckCapabilityBindingConsistency` | bindings + Hub refs | snapshot/assessment/gap/report | Hub source | `JF-01` | pass |
| 2 | `CheckReferenceIntegrity` | typed T1/T2/external refs | ref assessment/gap/report | shared/source ports by ref kind | `JF-02` | pass |
| 3 | `RebuildToolDerivedViews` | committed truth at watermark | D1 projections/reports | none | `JF-03` | pass |
| 4 | `RefreshExternalStatusRefs` | local submission attempts | Bus/Observation refs/gaps | collaboration feedback | `JF-04` | pass |

Logical trigger name is `tools.job.<snake_case_action>.v1`. Each binary calls `run(Request, JobMetadata) -> Result<JobReport, ProtocolError>`. Physical scheduler/CLI/cron/retry binding is excluded.

## 2. Shared Job slice carriers

```rust
pub struct JobSlice {
    pub cursor: Option<JobCursor>,
    pub limit: JobSliceLimit,
}

pub enum ReferenceInspectionTargetKind {
    ContractSource,
    HubCapability,
    AuthorizationResult,
    SandboxReadiness,
    SandboxExecutionSource,
    BusDeliveryStatus,
    ObservationMaterial,
    SharedContractAuthority,
}

pub enum DerivedViewKind {
    ReferenceConsistencyReport,
    ToolContractSearch,
    ToolContractDiff,
    ToolDiagnostic,
    ToolConsumerGuidance,
}
```

Every enum/variant/field has English rustdoc. `JobSliceLimit` is a validated positive bounded count; no unbounded `all`. Cursor encodes job name, request-body digest, requested watermark, last stable target key and schema version. The caller must reuse the same `JobRunKey`, request body and watermark for continuation. A changed scope/watermark requires a new key/cursor.

## 3. `CheckCapabilityBindingConsistency`

```rust
pub struct CapabilityBindingConsistencyScope {
    pub tool_ids: ToolIdSet,
    pub binding_states: BindingLifecycleStateSet,
    pub include_explicit_unbound: bool,
}

pub struct CheckCapabilityBindingConsistencyRequest {
    pub scope: CapabilityBindingConsistencyScope,
    pub slice: JobSlice,
}
```

Target order is `(tool_id, binding_id)`. `tool_ids` must be explicit, non-empty, canonical-sorted,
deduplicated and bounded by `JobSliceLimit`; empty input is `InvalidInput`. The earlier statement that
empty IDs expand to all visible bindings is `historical_material`, because Step 7 provides no global
binding enumeration seam. Each target reads at most one current relation through
`CapabilityBindingStore::find_current_by_tool` and calls `HubControlledSourcePort` only for bound
mode; explicit-unbound creates/updates no Hub snapshot and is counted unchanged unless a local
invariant is broken. Allowed writes: new Hub snapshot, immutable binding assessment, typed gap
open/supersede as detection warrants, and a reference consistency report slice. It never
declares/replaces/invalidates relation. Report output refs list every new assessment/gap/report ref.
Blocked Hub source yields Partial/Blocked with gaps, not accepted-bound. Flow `JF-01`.

## 4. `CheckReferenceIntegrity`

```rust
pub struct CheckReferenceIntegrityRequest {
    pub inspection_scope: ReferenceInspectionScope,
    pub target_kinds: ReferenceInspectionTargetKindSet,
    pub slice: JobSlice,
}
```

Target order is `(target kind ordinal, typed subject ref, assessed ref)`. Application reads typed refs from named stores at `JobMetadata.source_watermark` and selects the matching existing external Port. It appends immutable `ReferenceValidityAssessment`, opens/supersedes gaps when deterministic, and writes a `ReferenceConsistencyReport` for the processed scope/watermark. It never mutates subject/ref/external owner truth and does not close a gap based only on absence during scan. Unknown/unavailable sources remain explicit. Output refs contain assessments/gaps/report. Flow `JF-02`.

## 5. `RebuildToolDerivedViews`

```rust
pub struct DerivedViewRebuildScope {
    pub tool_ids: ToolIdSet,
    pub view_kinds: DerivedViewKindSet,
    pub consumer_kinds: ToolConsumerKindSet,
    pub revision_pairs: ToolRevisionPairSet,
}

pub struct RebuildToolDerivedViewsRequest {
    pub scope: DerivedViewRebuildScope,
    pub slice: JobSlice,
}
```

Target plan is canonical stable union ordered `(view kind ordinal, tool_id, secondary key)`. Empty consumer/revision sets are valid only when their corresponding view kind is absent or application deterministically expands them from locally committed allowed keys; no Runtime/SDK/registry discovery occurs. For each target, application loads complete source bundle at requested watermark, calls pure Step 6 projector, then `ProjectionStore` compare-writes. `AlreadyCurrent` counts unchanged; `Applied` updated; stale input/conflict/unavailable creates typed output/gap and Partial/Failed as specified. The Job never blocks/mutates contract/binding/invocation/outcome. Output refs identify projection IDs/write results/gaps. Flow `JF-03`.

## 6. `RefreshExternalStatusRefs`

```rust
pub enum ExternalStatusFamily {
    BusDelivery,
    ObservationMaterial,
}

pub struct ExternalStatusRefreshScope {
    pub submission_attempt_ids: ExternalSubmissionAttemptIdSet,
    pub status_families: ExternalStatusFamilySet,
    pub only_unknown_or_stale: bool,
}

pub struct RefreshExternalStatusRefsRequest {
    pub scope: ExternalStatusRefreshScope,
    pub slice: JobSlice,
}
```

Target order is `(attempt_id, status-family ordinal)`. Empty attempt IDs mean a bounded `ExternalSubmissionStore` scan under operation scope, not external discovery. For each target, application reads local attempt/event identity, calls the appropriate feedback method on `SafeEventCollaborationPort`, validates formal authority/attempt/locator/correlation, and appends a new Bus or Observation ref/gap. It never changes attempt/outcome/audit or interprets local submitted as delivered/observed. An unbound formal source/route yields Blocked/Partial with gap/output refs and performs no polling through an invented endpoint. Flow `JF-04`.

## 7. Job report and idempotency mapping

| Job | `counts` interpretation | Required output refs | Completed condition | Partial/blocked condition |
|---|---|---|---|---|
| Binding consistency | bindings examined, snapshots/assessments/gaps created | snapshot/assessment/gap/report refs | slice targets deterministically assessed | one/more source gaps or unavailable targets |
| Reference integrity | refs examined, assessments/gaps/reports created | assessment/gap/report refs | slice targets classified | sources missing/unverifiable or target read failed safely |
| Rebuild views | targets examined/applied/current/failed | projection/write-result/gap refs | every target got Applied/AlreadyCurrent | stale/conflict/unavailable subset |
| Refresh status | attempt/family targets examined, refs/gaps created | external-status-ref/gap refs | every enabled target classified | formal source/route blocked or unavailable |

For the same `(job name, system actor authority, job key, body digest)`, a committed report replays with `NoOpDuplicate` while retaining exact original processed watermark/counts/output/gap/cursor. Duplicate does not rescan or call an external Port. Different digest under the same key conflicts. A cursor continuation is a new idempotent request only if the caller uses a distinct operation key derived/formally supplied for that slice; Step 13 fixes the exact key normalization.

## 8. Actor, failure and no-repair boundary

- Only `SystemActorKind::System` or `Operator` with matching `JobOperationScope` may invoke a Job.
- Job actor does not bypass ref authority, body-free, source isolation, visibility of scoped subjects, idempotency or state guards.
- Per-target deterministic gap does not roll back other committed target slices; Step 9/11 define target-level UoW plus final report UoW.
- A local infrastructure failure before a target commit rolls back that target; commit-unknown is resolved before continuation.
- The final report is created from durable per-target output refs/results, not from transient counters alone.
- No Job calls subject-owning Command to auto-repair, adopts a definition, changes Binding, creates invocation/outcome, retries Runtime execution or invents evidence.

## 9. Job DTO/construction closure

| Job | Required target plan fields | Repository/Port sources | Report constructibility | Missing behavior |
|---|---|---|---|---|
| Binding check | scope/slice + metadata watermark | binding store + Hub Port | typed assessment/gap/report refs | blocked/partial |
| Reference check | inspection scope/kinds/slice | named stores + matching external ports | assessment/gap/report refs | conservative assessment/partial |
| Rebuild | view/tool/consumer/revision scope/slice | truth stores + projection store | projection/write/gap refs | partial/failed; no fallback |
| Status refresh | attempts/families/slice | submission store + feedback Port | status/gap refs | blocked/partial |

## 10. Job family stop review

| Review item | Result | Closure |
|---|---|---|
| Four independent request schemas present | pass | sections 3~6 |
| Trigger, actor, scope, cursor, watermark exact | pass | shared Job carriers + per-job scope |
| Report fields and typed outputs constructible | pass | controlled `output_refs` closure |
| Idempotency/replay does not rerun work | pass | stored typed report |
| Partial/blocked/failed semantics exact | pass | per-target gap/output refs |
| No core subject repair or evidence fabrication | pass | detection/projection/ref-only writes |
| Blocked feedback/source paths remain honest | pass | no invented endpoint/polling |
| Each maps to Step 9 | pass | `JF-01~04` |
