# Step 10.6 状态族附录: 引用完整性与受控派生

> 状态: completed / pass
> Canonical inputs: Step 6 integrity/derived annex; Step 9 CF-13, QF-02/07~11, JF-01~03

## 1. `ReferenceValidityState`

| State | Meaning | Core path |
|---|---|---|
| `Valid` | authority/owner/revision/correlation verifiable | may continue applicable path |
| `Stale` | ref may not cover current revision | fail closed where blocking |
| `Conflicting` | authority/revision/identity clues conflict | fail closed |
| `Missing` | expected typed ref absent | fail closed where required |
| `Unverifiable` | formal source/authority not provable | fail closed; gap |

`ReferenceValidityAssessment::assess(...)` creates one immutable consumption snapshot; no state
transition mutates the referenced object.

## 2. `ConsistencyGapState`

```text
[ConsistencyGap]
  Open -> ResolutionPending -> Resolved
  Open -> Superseded
  ResolutionPending -> Superseded
```

| 状态 | 作用 | 终态 | 允许操作 |
|---|---|---:|---|
| `Open` | gap 当前成立，按 impact 执行 blocked/degraded。 | 否 | request_resolution, supersede |
| `ResolutionPending` | 已提交 formal evidence locator，等待 owner re-read。 | 否 | resolve, supersede |
| `Resolved` | L2 已用 formal owner re-read 验证 gap 不再成立。 | 是 | read |
| `Superseded` | 被更准确的新 gap 替代。 | 是 | read |

| From | To | Trigger / flow | Preconditions | Side effects | Illegal error |
|---|---|---|---|---|---|
| factory | `Open` | `ConsistencyGap::detect(...)` / CF-13, JF-01/02, OF-04 | non-empty typed subjects/basis; class/impact match detector | append gap; associated stored result/job report | `InvalidGapInput` |
| `Open` | `ResolutionPending` | `request_resolution(evidence_ref, time)` / CF-13 | evidence locator type matches scope/class; no terminal gap | save gap/version; no subject repair | `InvalidStateTransition` |
| `ResolutionPending` | `Resolved` | `resolve(decision_ref, time)` / CF-13 | formal owner re-read confirms same subject/authority/revision; decision ref matches evidence | save gap; stale affected reports; replay | `UnverifiableResolution` |
| `Open` / `ResolutionPending` | `Superseded` | `supersede(replacement_ref, time)` / CF-13 or bounded continuation | replacement covers same/all subjects and is newer | save old terminal + new gap in one UoW | `InvalidStateTransition` |

No Query/Job may resolve a gap without a named formal re-entry command/owner read.

## 3. `DerivedReportState` (`ReferenceConsistencyReport`)

```text
[ReferenceConsistencyReport]
  <none> -> Current | Partial | Failed
  Current -> Stale
  Partial -> Stale
```

| State | Meaning | Producing flow |
|---|---|---|
| `Current` | all declared partitions covered at stored watermark | JF-02 |
| `Partial` | missing partitions/gaps explicit | JF-02 |
| `Stale` | newer local truth exists | CF-13/stale marker or query read |
| `Failed` | report build failed without truth mutation | JF-02 |

| From | To | Trigger | Preconditions | Side effects | Illegal error |
|---|---|---|---|---|---|
| none | `Current` | `build_complete(...)` / JF-02 | all bounded partitions read at compatible watermark | write report only; output refs | `ProjectionBuildError` |
| none | `Partial` | `build_partial(...)` / JF-02 | missing partition/gap named | write report + gaps | `ProjectionBuildError` |
| none | `Failed` | `failed(...)` / JF-02 | safe failure summary | write failed report | `ProjectionBuildError` |
| `Current` / `Partial` | `Stale` | `mark_stale(watermark)` / CF-13 or projection store | newer watermark proven | replace report snapshot / stale marker | `InvalidStateTransition` |

`ReferenceConsistencyReport` never changes Contract, Binding, Invocation, Outcome or Audit.

## 4. `FreshnessState` derived materials

Applicable to `ToolContractSearchProjection`, `ToolContractDiffSummary`, `ToolDiagnosticSummary`,
and `ToolConsumerGuidanceView`.

```text
<none> -> Fresh | Rebuilding | Unavailable | Failed
Fresh -> Stale
Rebuilding -> Fresh | Stale | Failed
Unavailable -> Rebuilding
Failed -> Rebuilding
```

| State | Meaning | Allowed operation |
|---|---|---|
| `Fresh` | material covers declared watermark/revision | read |
| `Stale` | newer local truth exists | read with explicit stale; mark/rebuild |
| `Rebuilding` | bounded replacement build in progress | read prior stale or rebuilding surface |
| `Unavailable` | no readable material | query returns unavailable; job may rebuild |
| `Failed` | latest build failed | query returns failed; job may rebuild |

| From | To | Trigger | Preconditions | Side effects | Illegal error |
|---|---|---|---|---|---|
| none | `Fresh` | pure `project/compare/derive` or completed JF-03 | complete local read set + watermark | write derived material only | `ProjectionBuildError` |
| none | `Unavailable` | query/store read surface | no readable material; no truth mutation | response marker only | `InvalidProjectionInput` |
| none | `Failed` | `failed(...)` / JF-03 | typed failure summary | failed report/material | `ProjectionBuildError` |
| `Fresh` | `Stale` | `mark_stale(newer_watermark)` / CF-13 | comparable newer local watermark | bounded stale marker; optional continuation gap | `InvalidStateTransition` |
| `Stale` / `Unavailable` / `Failed` | `Rebuilding` | `begin_rebuild(scope, watermark)` / JF-03 | job scope bounded; no query write; claim unique | maintenance marker only | `InvalidStateTransition` |
| `Rebuilding` | `Fresh` | `replace_projection(completed_material)` / JF-03 | complete source read at declared watermark; compare/write token | atomic projection replace | `VersionConflict` / `ProjectionBuildError` |
| `Rebuilding` | `Stale` | `replace_projection(partial_material)` / JF-03 | partial output carries gap/older watermark | save explicit stale/partial output | `ProjectionBuildError` |
| `Rebuilding` | `Failed` | `mark_rebuild_failed(...)` / JF-03 | safe failure summary | save failed material; source truth unchanged | `ProjectionBuildError` |

Query `QF-08~11` reads these surfaces and never calls `begin_rebuild` or `mark_stale`.

## 5. `SharedAuthorityResolutionState`

| State | Meaning | Current use |
|---|---|---|
| `Resolved` | Core authority exposes verified compatible type/schema | conditional only |
| `CandidateOnly` | candidate category exists, Tools-specific schema unverified | current `L2T-UP-008` |
| `Missing` | no formal candidate | blocked |
| `Conflicting` | multiple authority/schema claims conflict | blocked |
| `Unverifiable` | authority/revision cannot be proven | blocked |

Only `SharedContractAuthorityRef::resolved(...)` with an exact package/type/revision may permit
compile reuse. JF-02 without a formal Step 7 read seam remains `Unverifiable/Blocked`; no authority
query is invented in Step 10.

## 6. Stop review and tests

| 审查项 | 结论 |
|---|---|
| validity/gap/report/projection state owners are separate | pass |
| resolved gap requires formal evidence + decision + owner re-read | pass |
| stale/rebuilding/failed never become subject lifecycle | pass |
| query remains zero-write | pass |
| Core candidate-only blocker preserved | pass |
| tests | all validity states; gap legal/illegal/resolution evidence mismatch; report current/partial/stale/failed; each freshness transition and rebuild conflict; query zero-write; authority candidate/missing/conflict/unverifiable |

```text
state_family = integrity_derived
stop_review = pass
```
