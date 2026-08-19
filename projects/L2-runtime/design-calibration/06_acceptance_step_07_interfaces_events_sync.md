# L2-runtime 06 验收标准 Step 7：接口、事件与跨仓同步

> 对应 SOP：`standards/document/验收标准讨论流程_SOP.md` Step 7
> 回填位置：正式 `06-验收标准.md` §7
> 状态：`completed_continuous_authorized`
> 输入：formal 03 §§6~8/13~14、formal 04 slots/profiles、formal 05 protocol/entry/evidence registry
> 事实边界：本 Step 定义 future protocol decision contract；当前没有 protocol run、delivery、qualification 或 actual disposition

## 1. Protocol decision contract

Current inventory is exact and independent:

```text
17 Commands + 12 Queries + 6 inbound Events + 6 outbound Events + 7 Jobs = 48 surfaces
13 external slots = local finite seam tests; positive qualification uses separate future QUAL identities
```

```text
protocol_item_pass(item) :=
  exact formal name/schema/envelope/source authority resolves
  AND its canonical TC executes every declared valid/negative/replay/fault/unknown variant
  AND typed result/state plus write/call/phase journal matches formal Flow/UoW
  AND same-run raw artifact, owning suite report and planned EV instance are eligible
  AND all mapped AC assertions pass and all mapped applicable VF are not_triggered
```

Unknown name/variant/field, parallel historical alias, missing canonical item, hidden filter, wrong entry authority, body leak, phase promotion, unowned write, wrong ACK/replay identity or dependency-type drift makes the item non-pass. Missing/invalid evidence is `not_evaluable`, not a static failure or pass.

## 2. Dependency and collaboration model

**图类型：** dependency/evidence flow
**图标题：** Runtime 协议与跨仓资格分层

```text
                         only reviewed Core contract
                                  |
                            [compile seam]
                                  v
[Api C/Q] -----> [Runtime application/domain] <----- [Worker inbound E]
                         |          |
                  runtime/ref       +---- outbox immutable O ----> [event adapter/Bus]
                  /adapter Ports    |                                  |
                         |          +---- bounded Jobs ----------------+
                         v
        [13 external owner slots: finite local posture]
                         |
             G2 named real adapter candidate
                         |
             G3 per-slot positive qualification

same fixed run: raw case -> owning suite report -> EV detail -> acceptance review
```

关键说明：

1. `compile` 只允许经审查的 `L0-core` contract；Tools、Bus、SDK、Hub、Method、Sandbox、Governance、Observability 和 provider 都不能因验收方便变成 package dependency。
2. Inbound/Outbound Event 的 G1 证明逻辑 envelope、inbox/outbox、顺序和 replay；不证明物理 topic、Bus delivery、consumer processing 或 Observed。
3. 13 slot 的 local case 证明 Disabled/Blocked/Candidate 与 fail-closed；真实 adapter/owner/environment 必须使用独立 G2/G3 run。
4. SDK、Artifact、member/product 是 downstream/ref/handoff 边界，不是 Runtime 反向 source dependency。

| Dependency kind | Acceptance subject | Required evidence | Forbidden inference |
|---|---|---|---|
| `compile` | exact Core package/schema ref and resolved graph | build/dependency manifest + `TC-DEP-001` | sibling source/package edge |
| `runtime` | typed Port request/result/error/timeout/unknown and call journal | owning service/slot raw + non-TestFake candidate when selected | directory/ping means available |
| `event` | envelope/source/order/digest, inbox/outbox, ACK/receipt/replay | E/O/J07/UoW raw and event adapter candidate | receipt=delivery/Observed/acceptance |
| `ref` | owner/identity/version/scope/freshness/body-free carrier | source/slot/boundary raw | ref contains body or transfers ownership |
| `adapter` | builder binds exact slot contract and finite posture | config/slot/fake-leak plus G2 candidate | Bound/Candidate means qualified |
| `fake` | deterministic finite TestFake behavior only | G1 raw, fake-leak/status checks | fake is real execution/qualification/evidence source by itself |

## 3. Commands C01~C17

Every Command uses `CommandMetadata` and `OperationIdentity + request_digest`; same identity/digest replays exact typed stored result, different digest conflicts, and local commit unknown creates a fence without re-execution. Fixed paths are `service_semantics` raw/report plus the EV detail; items whose primary EV is `EV-FAULT-*` remain owned by `service_semantics` exactly as the registry states.

| ID / formal surface | Pass condition | Failure condition | Canonical TC -> EV | AC / VF refs | Seam / conclusion ceiling |
|---|---|---|---|---|---|
| C01 `AcceptRuntimeTrigger` | authority/source/scope/preconditions checked before atomic admission + optional run/workspace | invalid/denied/unknown creates run; replay diverges; entry bypass | `TC-C01-001` -> `EV-SVC-451` | AC001/006/032/035; VF008 | local command; no product entry readiness |
| C02 `ApplyRuntimeControl` | legal control CAS; resume only Committed checkpoint + closed fence; terminal immutable | Prepared/Unknown resume, stale write, terminal reopen | `TC-C02-001` -> `EV-SVC-452` | AC008/018/035; VF004 | local command; checkpoint positive separate |
| C03 `EvaluateRunProgress` | consistent run/workspace/revision heads; finite ready/wait/block/terminal-candidate and bounded writes | missing proof finalizes; implicit next step; wrong write set | `TC-C03-001` -> `EV-SVC-453` | AC001/007/008/019/035 | local command; no Work/Process completion |
| C04 `ComposeWorkingContext` | deterministic owner/freshness/order/budget/redaction; every candidate use recorded; mandatory gap closes | body/stale mandatory source selected; silent truncation; durable write | `TC-C04-001` -> `EV-SVC-454` | AC002/009/021/029/030; VF003 | runtime/ref/adapter; owner body/ready excluded |
| C05 `RecordWorkingMemory` | scoped fresh candidate, unique use, window/entry/use/history/result atomic | frozen/unknown window accepts; duplicate use; durable owner write | `TC-C05-001` -> `EV-SVC-455` | AC002/010/028/035; VF001 | local + memory ref seam; no durable qualification |
| C06 `StartModelTurn` | Frozen context; body-free binding committed before at most one model call; finite result/fence | raw/secret/route persisted; call before T1; Unknown resubmit | `TC-C06-001` -> `EV-FAULT-456` | AC003/011/012/013/025/029/032/035; VF003/004 | model runtime/adapter; real provider separate |
| C07 `ClassifyModelResult` | matching turn/submission/correlation maps finite decision + safe summary; duplicate exact | late/mismatch overwrites; raw output accepted; duplicate new decision | `TC-C07-001` -> `EV-SVC-457` | AC003/012/013/025/035; VF003 | local classification only |
| C08 `ProposeAction` | creates local no-action/tool/child/wait/reject choice; zero owner call | choice claims execution; guard/submission bypass; external call | `TC-C08-001` -> `EV-SVC-458` | AC004/014/030; VF005 | local command; no execution |
| C09 `EvaluateActionPreconditions` | all required Governance/Hub/Tools/Sandbox views current at checked versions; zero invocation | missing/stale/unknown default allow or direct Sandbox/host route | `TC-C09-001` -> `EV-SVC-459` | AC004/015/023/032; VF001/002 | runtime/ref guards; positive owner seams separate |
| C10 `ProposeDelegation` | parent-local record with immutable strict subset scope/context/allow-list/budgets | scope growth/overflow/mutable corpus; child call before record; member fields | `TC-C10-001` -> `EV-SVC-460` | AC004/016/027/033; VF001 | child adapter seam; no member/container lifecycle |
| C11 `IncorporateActionFeedback` | matching ordered fact + receipt commit; only Apply changes marker/progress once; ACK after commit | late/duplicate/collision reverse-write; ACK on unknown; outcome mutation | `TC-C11-001` -> `EV-FAULT-461` | AC004/015/025/035; VF004/005 | event-derived local command; no Tools truth write |
| C12 `PrepareRuntimeCheckpoint` | one committed anchor and closed/evident fence captured; result ends at Prepared; no physical Port call | Prepared called stable/Committed; forbidden body; unresolved effect accepted | `TC-C12-001` -> `EV-SVC-462` | AC005/017/029/034; VF003 | local prepare only |
| C13 `CommitRuntimeCheckpoint` | CommitPending before one physical call; exact matching receipt only -> Committed; unknown fenced | repository save/ACK proves durability; mismatch commits; blind retry | `TC-C13-001` -> `EV-FAULT-463` | AC005/017/018/035; VF004 | slot10 runtime/adapter; `CP-001` blocks positive |
| C14 `RequestRecoveryDecision` | immutable finite Resume/Restart/Reconcile/Wait/Blocked/Cancel/Manual from exact checkpoint/fence | Prepared/unknown blindly resumes/retries; old decision mutates | `TC-C14-001` -> `EV-SVC-464` | AC005/018/019/035; VF004 | local decision; external retry forbidden |
| C15 `FinalizeRuntimeOutcome` | terminal proof + closed fence creates exactly one outcome and terminal run atomically | nonterminal success, differing second outcome, handoff/Obs call or reverse-write | `TC-C15-001` -> `EV-SVC-465` | AC005/020/024/034/035; VF005 | local outcome only |
| C16 `CreateHandoffCandidate` | committed outcome + body-free refs/target produce material/attempt/gap locally; zero submit | body/route accepted; candidate=Delivered/Observed/Accepted; submission hidden in command | `TC-C16-001` -> `EV-SVC-466` | AC005/020/024/029/030/036; VF003/005 | ref/handoff candidate; slot11 positive separate |
| C17 `CaptureSourceSnapshot` | owner supplies safe metadata/fragments/version; exact completeness/availability retained | owner body/write; pending/unknown -> Available/ready; stale overwrites | `TC-C17-001` -> `EV-FAULT-467` | AC002/009/021/025/030/032/035/036; VF001/006 | runtime/ref/adapter; owner readiness excluded |

Command report paths are fixed as `reports/runs/<run_id>/suites/service_semantics.md` and `reports/runs/<run_id>/evidence/<evidence_id>.md`, backed by the same-run raw case path. `TC-ENTRY-001`, `TC-REPLAY-001`, `TC-UOW-001~004`, error and boundary cases remain mandatory companion evidence through their mapped AC/VF; they do not replace any C01~C17 row.

## 4. Queries Q01~Q12

All Queries validate `QueryMetadata`, perform visibility before existence-sensitive read, open no mutation UoW/reservation, call no refresh/reconcile/external adapter, and return body-free `QueryViewEnvelope<T>`. Fixed owning report is `reports/runs/<run_id>/suites/contract_protocol.md`.

| ID / formal surface | Pass condition | Failure condition | Canonical TC -> EV | AC / VF refs | Conclusion ceiling |
|---|---|---|---|---|---|
| Q01 `GetRunStatus` | exact local state/version/refs/freshness; Unknown/ManualReview preserved; visibility first | handoff/Observed field, existence leak, write/reconcile | `TC-Q01-001` -> `EV-CON-501` | AC008/034 | local view |
| Q02 `GetRunHistory` | append-only ordered safe fact page; history cursor/limit exact | body exposure, cursor invented/advanced, append/rebuild | `TC-Q02-001` -> `EV-CON-502` | AC034/035 | local history view |
| Q03 `GetGoalPlan` | local revision/items/dependencies/states/source versions only | Method/Process body or external completion; write/refresh | `TC-Q03-001` -> `EV-CON-503` | AC007/027; VF001 | working-plan view only |
| Q04 `GetWorkingContext` | ordered safe segment refs/redaction/weight/digest/version | raw fragment/body, source resolve/materialize, mutation | `TC-Q04-001` -> `EV-CON-504` | AC009/030; VF003 | local context view |
| Q05 `GetMemoryUse` | Runtime-owned use refs/dispositions/cursor only | durable body/lifecycle query/write or owner call | `TC-Q05-001` -> `EV-CON-505` | AC010/028; VF001 | local use view |
| Q06 `GetModelTurn` | turn/binding/submission/result/summary refs and exact state incl Unknown/Failed | provider route/secret/body, model/materializer call, state promotion | `TC-Q06-001` -> `EV-CON-506` | AC012/013; VF003 | local turn view |
| Q07 `GetActionState` | choice/guard/attempt/marker/feedback states and versions remain distinct | execution inference, owner call, ACK/status promotion | `TC-Q07-001` -> `EV-CON-507` | AC014/015; VF005 | local action view |
| Q08 `GetDelegationState` | local state/version/boundary digest/child/result refs under scope | member/container lookup, cross-scope leak, parent finalize | `TC-Q08-001` -> `EV-CON-508` | AC016 | local delegation view |
| Q09 `GetCheckpointState` | Prepared/CommitPending/CommitUnknown/Committed exact; physical ref only with proof | query reconciles/commits; Prepared shown stable; Unknown hidden | `TC-Q09-001` -> `EV-CON-509` | AC017/018; VF004 | local checkpoint view |
| Q10 `GetRuntimeOutcome` | optional immutable local outcome/result/summary/fence | handoff/Artifact/Obs/product call/field or acceptance inference | `TC-Q10-001` -> `EV-CON-510` | AC020/024; VF005 | local outcome view |
| Q11 `GetHandoffState` | exact local material/attempt/gap and matching ACK phase | ACK=delivery/acceptance/Observed; submit/reconcile/write | `TC-Q11-001` -> `EV-CON-511` | AC020/024; VF005 | local handoff posture |
| Q12 `GetProjectionState` | exact state/freshness/watermark/cursor; Current only with contiguous proof | query rebuild/domain synthesis/write/authorization; stale shown Current | `TC-Q12-001` -> `EV-CON-512` | AC030/036; VF005 | derived view posture only |

## 5. Inbound and outbound Events

### 5.1 Inbound E01~E06

All inbound events use `(source_owner,event_id,payload_digest)` from `EventEnvelope<T>`. Worker validates schema/source/scope/order, reserves inbox, commits fact + receipt + history/outbox, then ACKs exactly once. Same digest replays the receipt; collision/late/out-of-order/mismatch is quarantined or recorded without forbidden mutation; commit unknown yields ACK=0.

| ID / formal event | Valid/negative oracle | Failure condition | TC -> EV / report | AC / VF refs | Source seam / ceiling |
|---|---|---|---|---|---|
| E01 `ModelResultAvailable` | matching submission/turn/correlation classifies finite result; duplicate exact; raw/mismatch/late quarantine | ACK before commit, unknown resubmit, raw body persistence, late overwrite | `TC-E01-001` -> `EV-ENTRY-521`;`entry_worker_job.md` | AC003/012/013/025/035; VF003/004 | model event/adapter; no provider readiness |
| E02 `ActionFeedbackReceived` | Tools source family, matching action/marker, one applicable incorporation; raw Sandbox source rejected | direct Sandbox event accepted, duplicate/late changes marker/outcome, unknown ACK | `TC-E02-001` -> `EV-ENTRY-522`;`entry_worker_job.md` | AC004/015/025/035; VF003/004/005 | Tools event seam; no execution ownership |
| E03 `ChildResultAvailable` | matching delegation/child/scope/digest incorporated once | cross-scope/late/collision accepted; child finalizes parent; member truth imported | `TC-E03-001` -> `EV-ENTRY-523`;`entry_worker_job.md` | AC004/016/025/035; VF005 | child runtime event seam; no lifecycle readiness |
| E04 `SourceSnapshotChanged` | newer safe ref/availability appended; dependents staled; no body | late/conflict replaces current, owner body copied, source truth mutated | `TC-E04-001` -> `EV-ENTRY-524`;`entry_worker_job.md` | AC009/021/025/030/035; VF001 | ref/event seam; owner readiness excluded |
| E05 `GovernancePreconditionChanged` | read-only exact scope/version view may append local block/progress/wakeup | Runtime changes policy/approval, stale/unknown allows action, wrong scope accepted | `TC-E05-001` -> `EV-ENTRY-525`;`entry_worker_job.md` | AC015/021/023/025/035; VF001/002 | Governance event/ref seam; approval truth external |
| E06 `HandoffAcknowledgementReceived` | only matching verified ACK closes same gap by CAS; outcome/run/checkpoint immutable | mismatch/unknown closes gap; ACK=delivery/acceptance/Observed; reverse-write | `TC-E06-001` -> `EV-ENTRY-526`;`entry_worker_job.md` | AC020/024/025/035; VF005 | handoff event seam; downstream acceptance external |

### 5.2 Outbound O01~O06

Outbound events are immutable commit-time outbox snapshots. Event ID, payload digest and stored bytes are fixed in the source UoW; retry republishes exact bytes. A logical event contract can pass G1 while Bus route/schema or real delivery remains blocked; physical topic names must not be invented until Bus authority closes `L2R-UP-006/007`.

| ID / formal event | Snapshot/replay pass condition | Failure condition | TC -> EV / report | AC / VF refs | Event conclusion ceiling |
|---|---|---|---|---|---|
| O01 `RuntimeFactCommitted` | exact fact kind/run/version/correlation/safe refs from committed UoW; rollback emits none | rebuild from later head, mutable payload, uncommitted emit/body | `TC-O01-001` -> `EV-CON-531`;`contract_protocol.md` | AC034/035 | logical materialization/replay only |
| O02 `RuntimeDecisionCommitted` | immutable local decision kind/disposition/source/version; body-free | implies Governance approval; owner/hidden reason included; later mutation | `TC-O02-001` -> `EV-CON-532`;`contract_protocol.md` | AC026/027/034; VF001 | local decision event only |
| O03 `ActionSubmissionAttempted` | exact local action/attempt/marker/target/posture; `Executed` unrepresentable | receipt/attempt claims execution/isolation/cleanup; owner truth included | `TC-O03-001` -> `EV-CON-533`;`contract_protocol.md` | AC015/020/034; VF005 | attempt event only |
| O04 `RuntimeOutcomeCommitted` | one immutable local outcome/result/summary/version | delivery/acceptance/Observed/product completion field or later rewrite | `TC-O04-001` -> `EV-CON-534`;`contract_protocol.md` | AC020/024; VF005 | local outcome event only |
| O05 `HandoffAttempted` | exact material/attempt/digest/gap/local state incl Unknown | event name/status claims delivery/acceptance/Observed; new identity retry | `TC-O05-001` -> `EV-CON-535`;`contract_protocol.md` | AC020/024/036; VF005 | local handoff attempt only |
| O06 `ProjectionMarkedStale` | exact projection/source run version/history sequence/SafeReason | claims Current/rebuild/Observed; projection/domain write | `TC-O06-001` -> `EV-CON-536`;`contract_protocol.md` | AC030/036; VF005 | invalidation event only |

## 6. Operations Jobs J01~J07

Each Job identity is `(operation,partition,lease_epoch,page_digest)`. A live lease precedes bounded page read; item facts + `JobPageReport` + next cursor commit atomically. Same page/digest replays exactly; different digest conflicts; lease loss, item failure or commit unknown stops without cursor advance. Job reports are operational records, never acceptance evidence or owner truth by themselves.

| ID / formal Job | Pass condition | Failure condition | TC -> EV / report | AC / VF refs | Dependency/ceiling |
|---|---|---|---|---|---|
| J01 `RebuildSafeRuntimeViews` | contiguous committed history only; page/report/watermark/cursor atomic; gap Degraded; zero domain write | skips gap/page, stale epoch write, projection repairs domain, report=evidence | `TC-J01-001` -> `EV-JOB-541`;`entry_worker_job.md` | AC024/030/034/035/036; VF005 | local projection/store adapter; no backend readiness |
| J02 `RefreshSourceSnapshots` | per-source finite status marker/version; dependent stale facts; fault retains page/cursor | body/readiness copied, owner write, partial page advances cursor | `TC-J02-001` -> `EV-JOB-542`;`entry_worker_job.md` | AC009/021/025/032/035; VF001 | runtime/ref adapter; owner readiness excluded |
| J03 `CompactWorkingMemory` | complete partition creates new working window/decision/history/report atomically; old authoritative on unknown | durable delete/write, source history deletion, partial cursor/window commit | `TC-J03-001` -> `EV-JOB-543`;`entry_worker_job.md` | AC010/028/034/035; VF001 | local job; durable owner excluded |
| J04 `ResumeEligibleRuns` | only Committed checkpoint + closed fence schedules one local continuation; lease loss stops | Prepared/Unknown resumes, external effect retry, duplicate continuation, cursor skip | `TC-J04-001` -> `EV-JOB-544`;`entry_worker_job.md` | AC007/018/034/035; VF004 | local recovery job; physical checkpoint positive separate |
| J05 `ReconcileUnknownEffects` | same identity status-only read; verified status appends one fact; otherwise Unknown retained | submits/new key, absence=success, stale status overwrites, cursor advances on unknown commit | `TC-J05-001` -> `EV-JOB-545`;`entry_worker_job.md` | AC015/017/018/035; VF004 | runtime adapter/status seam only |
| J06 `ReconcileHandoffGaps` | matching verified status closes same gap; missing/mismatch/unknown remains open | resend/self-close/time-close; outcome rewrite; status=Observed/accepted | `TC-J06-001` -> `EV-JOB-546`;`entry_worker_job.md` | AC020/024/032/035; VF005 | handoff status seam; delivery excluded |
| J07 `PublishRuntimeOutbox` | exact stored event ID/bytes/digest; receipt/cursor phase per policy; unknown retains entry/cursor | rebuild payload, receipt=delivery/Observed, lost entry, cursor skip, new ID retry | `TC-J07-001` -> `EV-JOB-547`;`entry_worker_job.md` | AC034/035/036; VF005 | event adapter/Bus candidate; real route/delivery blocked |

## 7. External slot seam and qualification matrix

`TC-SLOT01~13-001` are G1 contract cases. They prove exact `Disabled/Blocked/Candidate` behavior, no owner write, no fake/status promotion and finite failure. They do not prove a real adapter, owner implementation, environment or positive capability. A G3 conclusion requires a separately rebaselined `TC-QUAL-SLOTnn`/QUAL EV and independent fixed run.

| Slot / owner seam | Global type | G1 local pass condition | Positive blocker / G2-G3 entry | Local TC -> EV | Forbidden conclusion |
|---|---|---|---|---|---|
| 01 governance | runtime/ref/adapter/fake | read-only current/denied/pending/unknown exact scope/version; negative zero action call | formal owner implementation/profile/env/reviewer | `TC-SLOT01-001` -> `EV-CON-446` | approval/policy ready |
| 02 definition resolver | runtime/ref/adapter/fake | body-free method/role/process ref/version; missing/stale -> wait/block | `UP-008`, immutable provenance, real adapter/owner | `TC-SLOT02-001` -> `EV-CON-447` | method body/source owned |
| 03 source resolver | runtime/ref/adapter/fake | finite availability/completeness/ref; mandatory gap closes; no body | `UP-006/008`, exact schema/source and owner env | `TC-SLOT03-001` -> `EV-CON-448` | source ready/body available |
| 04 durable memory | runtime/ref/adapter/fake | bounded retrieval/candidate/ref/gap; working fallback non-equivalent; no lifecycle write | `UP-005`, owner contract/implementation/env | `TC-SLOT04-001` -> `EV-CON-449` | durable write/delete/index ready |
| 05 capability exposure | runtime/ref/adapter/fake | identity/exposure/descriptor safe view; incompatible/pending closes; no registry write | Hub real registry/exposure implementation/env | `TC-SLOT05-001` -> `EV-CON-450` | registry/exposure ready |
| 06 invocation caller | runtime/adapter/fake | attempt before one call; finite submission status; Unknown same-identity status-only; no direct Sandbox | `UP-001/003/007`, Tools/adapter/Sandbox owner facts | `TC-SLOT06-001` -> `EV-CON-451` | executed/isolated/cleaned |
| 07 model context materializer | runtime/ref/adapter/fake | ephemeral material only; binding/digest match; pending zero model call | `UP-004/006`, real materializer/profile/env | `TC-SLOT07-001` -> `EV-CON-452` | material/provider ready |
| 08 model decision | runtime/adapter/fake | provider-neutral finite result refs; no route/secret/quota/cost/body; Unknown no resubmit | `UP-004`, real provider adapter/owner env | `TC-SLOT08-001` -> `EV-CON-453` | provider quality/route ready |
| 09 child runtime | runtime/ref/adapter/fake | strict parent scope/budget/context; record before call; result once | `ENTRY-001`, real composition authority/child impl/env | `TC-SLOT09-001` -> `EV-CON-454` | member/container/image lifecycle ready |
| 10 checkpoint commit | runtime/ref/adapter/fake | exact receipt/digest only commits; Unknown fence/status same identity | `CP-001`, physical owner contract/implementation/env | `TC-SLOT10-001` -> `EV-CON-455` | physical durability/resume ready |
| 11 handoff submission | runtime/ref/adapter/fake | attempt before call; exact ACK phase; gap retained; outcome immutable | `UP-002/007`, producer/route/owner implementation | `TC-SLOT11-001` -> `EV-CON-456` | delivered/Observed/accepted |
| 12 event publisher | event/adapter/fake | exact stored event ID/bytes/digest replay; receipt phase; unknown cursor retained | `UP-006/007`, Bus schema/route/implementation/env | `TC-SLOT12-001` -> `EV-CON-457` | Bus delivery/consumption/Observed |
| 13 projection store | runtime/ref/adapter/fake | contiguous watermark required for Current; store has no domain authority | `UP-006/007`, store/backend implementation/env | `TC-SLOT13-001` -> `EV-CON-458` | observation backend/readiness |

## 8. Entry, Worker and Jobs dispatch gates

| Surface | Formal inventory | Entry order that must be observed | Failure condition | Evidence |
|---|---|---|---|---|
| `Api` | C01~C17, Q01~Q12 | decode -> metadata/schema/scope/authority -> visibility or reservation -> application service -> safe mapper | direct repository/adapter I/O, Query opens UoW, authority after existence, raw error/body | `TC-ENTRY-001`/`TC-ENTRY-004`; `EV-ENTRY-433`/`EV-STATIC-436` |
| `Worker` | E01~E06 + wakeup/continuation | envelope -> source/schema/order -> inbox reserve -> application consumer -> fact/receipt commit -> ACK | ACK before known receipt, direct domain/repo bypass, unknown drop, collision as duplicate | `TC-ENTRY-002`; `EV-ENTRY-434` |
| `Jobs` | J01~J07 | job metadata/profile -> lease claim -> bounded page -> item facts/report/cursor UoW -> release/renew | unleased/unbounded execution, stale epoch write, cursor skip, scheduler/member lifecycle ownership | `TC-ENTRY-003`; `EV-ENTRY-435` |

`Api`、`Worker`、`Jobs` are entry surfaces, not additional domain truth owners. `TC-ENTRY-004` proves finite fake bindings are permitted only in `ci_contract/TestFake`; any non-test profile fake leak is an invalid execution and may trigger `VF-L2R-006`.

## 9. Cross-repository synchronization contract

| Blocker / seam | Runtime consumes | Local G1 evidence | G2/G3 entry fact | Until then, maximum conclusion |
|---|---|---|---|---|
| `L2R-UP-001` Tools/Sandbox action | formal request/result/receipt/status ref; normalized feedback | C09/C11, E02, J05, SLOT06, no direct Sandbox, status-only reconcile | owner contract + identifiable implementation + cleanup/isolation evidence | local orchestration/fail-closed only |
| `L2R-UP-002` handoff/observation route | safe material, attempt, ACK/status/gap | C16, E06, O05, J06, SLOT11, OBS003 | producer/route/ACK/Observed contract + independent run | local attempt/gap only |
| `L2R-UP-003` Tools shared schema/SDK | reviewed Core/schema candidate and downstream ref | DEP001, protocol schema checks | owner-versioned schema + compatible client/adapter | no Runtime shadow type or SDK package edge |
| `L2R-UP-004` model adapter | provider-neutral material/result/disposition refs | C06/C07, E01, SLOT07/08, redaction | real adapter/profile/env and provider owner fact | logical model semantics only |
| `L2R-UP-005` durable memory | retrieval/candidate/ref/gap and unavailable posture | C04/C05/Q05/J03/SLOT04 | durable owner contract/implementation/lifecycle evidence | working/m mediation only; no durable write |
| `L2R-UP-006` Core/Bus/Obs schema/route | category-level contract and event/ref seam | source/dependency/envelope/outbox checks | exact versioned schema/route authority | logical event/ref only |
| `L2R-UP-007` Sandbox/Obs implementation | finite blocked/spy result and safe carrier | BOUND/OBS/redaction and SLOT06/11/12 | authorized isolated real implementation/environment | no isolation/delivery/Observed readiness |
| `L2R-UP-008` Method immutable provenance | body-free definition/source refs/version | Q03/C03/SLOT02/03 source manifest | owner-selected immutable baseline with provenance | current dirty workspace disclosed; no immutable claim |
| `L2R-CP-001` checkpoint physical commit | matching receipt/ref/status and unknown fence | C12/C13/C14/Q09/J04/J05/SLOT10 | physical contract + implementation + independent evidence | local Prepared/Unknown/recovery decision only |
| `L2R-ENTRY-001` actor/member entry | typed actor/scope/product/child boundary refs | C01/C10/E03/SLOT09/ENTRY001 | authorized production composition and child authority | logical entry/strict subset only |
| `L2R-IMPL-001` target implementation | source/build/run/artifact/report surfaces | G0 design handoff only | locatable revision/build and all planned boundaries | no execution/evidence/readiness |
| `L2R-LANG-001` Rust/toolchain | edition/MSRV/product selection facts | source/config preflight design | verified toolchain and formal selections | planned language only; no build claim |

Synchronization rule: a blocker status change must carry owner, source version, effective time, contract/schema digest, affected protocol/slot list and re-entry decision. A directory, design file, ping, fake, `Candidate`, `Bound` or local receipt cannot close a blocker. Any owner change triggers impact analysis and a new candidate/qualification identity where required; old G1 EVs remain local-only.

## 10. Protocol/slot stop-review index

Every row below is a design stop-review, not an actual execution result. `closed_design` means the formal name, owner, TC/EV, report path and conclusion ceiling are defined; `actual=none` remains global.

| Group | IDs | Exact identity / report owner | Replay/phase gate | Dependency audit | Stop-review |
|---|---|---|---|---|---|
| Commands | C01~C05 | formal C name; `service_semantics` | operation key + digest; UoW and no external phase promotion | compile Core only; runtime/ref adapters | closed_design |
| Commands | C06~C10 | formal C name; `service_semantics` | pre-call record, model/action/child fence, unknown | provider/Tools/Hub/Sandbox are seams | closed_design |
| Commands | C11~C17 | formal C name; `service_semantics` | inbox/feedback/checkpoint/recovery/outcome/handoff phases | event/ref/adapter; CP-001 pending | closed_design |
| Queries | Q01~Q04 | formal Q name; `contract_protocol` | visibility-first, no mutation replay | local/ref read only | closed_design |
| Queries | Q05~Q08 | formal Q name; `contract_protocol` | body-free view, no owner call | memory/model/action/child refs only | closed_design |
| Queries | Q09~Q12 | formal Q name; `contract_protocol` | Unknown/Current proof; no reconcile/write | checkpoint/handoff/projection seams | closed_design |
| Inbound events | E01~E03 | formal E name; `entry_worker_job` | envelope identity, inbox, ACK-after-commit | event/runtime/ref | closed_design |
| Inbound events | E04~E06 | formal E name; `entry_worker_job` | source order, stale/gap CAS, no reverse-write | ref/event/handoff/Governance | closed_design |
| Outbound events | O01~O03 | formal O name; `contract_protocol` | commit-time immutable snapshot, exact bytes | event seam; no delivery claim | closed_design |
| Outbound events | O04~O06 | formal O name; `contract_protocol` | local outcome/handoff/stale phase only | event/ref/Obs seam | closed_design |
| Jobs | J01~J03 | formal J name; `entry_worker_job` | lease/page/report/cursor atomicity | projection/source/memory adapters | closed_design |
| Jobs | J04~J07 | formal J name; `entry_worker_job` | recovery/status/handoff/outbox same identity | checkpoint/handoff/Bus seams | closed_design |
| Slots | SLOT01~04 | exact slot identity; `contract_protocol` | Disabled/Blocked/Candidate finite posture | Governance/Method/Source/Memory refs | closed_design |
| Slots | SLOT05~09 | exact slot identity; `contract_protocol` | no owner write; strict child/model/action fence | Hub/Tools/Model/Child adapters | closed_design |
| Slots | SLOT10~13 | exact slot identity; `contract_protocol` | matching receipt, exact event bytes, contiguous projection | checkpoint/Handoff/Bus/Obs adapters | closed_design |

## 11. Cross-interface sync audit

| Audit item | Result |
|---|---|
| protocol inventory | exact `17/12/6/6/7=48`; no old 15-command or merged event alias |
| canonical mapping | each primary C/Q/E/O/J/slot case has one TC and one planned EV; companion cases remain in 177 registry |
| report path | command/service, query/event/contract, inbound/job, and slot owning suite paths fixed under same run |
| replay identities | command, query, event and job identity domains are distinct; no Query stored-result or event/package conflation |
| dependency classification | compile/runtime/event/ref/adapter/fake explicit; only Core compile candidate |
| ACK/receipt phases | inbox receipt, outbox receipt, ACK, delivery, Observed and acceptance not conflated |
| downstream scope | incomplete upstream blocks only affected positive lane; local P0 denominator unchanged |
| topic/route authority | physical topic/route not invented while Bus/Obs schema blocker open |
| orphan/duplicate | source registry and 05 checks must reject unknown, duplicate, unowned, static or cross-run rows |
| actual status | 48 surfaces and 13 slots are design-closed only; no actual protocol evidence, delivery or qualification |

## 12. 回填草稿与 Step stop-review

Formal §7 应承载 dependency/evidence flow、C/Q/E/O/J gates、entry dispatch、13 slot matrix、cross-repository blocker sync and conclusion ceilings. It must state that logical protocol acceptance never implies physical delivery, owner readiness, Observed, product readiness or SDK/package dependency.

```text
step_status = completed_continuous_authorized
protocol_surfaces = 48
external_slots = 13
primary_protocol_tc_ev = 48
primary_slot_tc_ev = 13
registry_set_diff = empty
actual_protocol_disposition = none
actual_delivery_or_qualification = none
current_process_state = not_entered
next_step = Step 8
formal_06_write_allowed = false_until_step_15
```
