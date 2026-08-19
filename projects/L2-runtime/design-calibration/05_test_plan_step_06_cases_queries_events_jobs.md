# L2-runtime Step 6 Annex C：Queries、Events 与 Jobs 用例

> Parent：`05_test_plan_step_06_cases.md`
> 正式来源：`03-详细设计.md` §§7.3~7.6、8.3~8.6、10、12~14
> 状态：`completed_as_step_06_annex`
> 所有用例均为 planned identity；真实 broker、scheduler、delivery、observed 和 evidence 不在本文声称

## C1. Queries Q01~Q12

每个 Query owning case 都必须同时执行 `visible-present`、`visible-missing`、`hidden`、`stale/degraded/unknown`、invalid cursor/limit（适用时）五类变体。共同断言：`ReadVisibilityPort` 先于 existence-sensitive read；UoW begin/write/refresh/reconcile/external-call/operation-reservation 计数全部为 0；返回 `QueryViewEnvelope<T>` 且 body-free。

| Case / Query | Fixture / operation | Exact view assertions | Negative / no-write assertions | Planned EV |
|---|---|---|---|---|
| `TC-Q01-001` `GetRunStatus` | run + history head in Active/Waiting/Blocked/Unknown/ManualReview/Terminal variants | `ControlledRunRef/RuntimeScope/ControlledRunState/RunVersion` exact；decision/checkpoint/outcome optional refs and freshness retained | no handoff/observed field；hidden -> NotVisible before repo existence；Unknown not flattened | `EV-CON-501` |
| `TC-Q02-001` `GetRunHistory` | append-only facts, cursor/filter/limit/page watermark | repository-owned next cursor；sequence/fact kind/causation/correlation/SafeReason/committed_at stable and redacted | caller cursor cannot skip/advance；invalid -> CursorConflict；no append/rebuild/body | `EV-CON-502` |
| `TC-Q03-001` `GetGoalPlan` | workspace/revision/item refs across states and cross-run fixture | local goal/revision/item/dependency/state/progress/source-version exact；evaluation remains disposition, not workspace state | no Method/Role/Process body or external work completion；cross-run NotVisible/ProtocolMismatch | `EV-CON-503` |
| `TC-Q04-001` `GetWorkingContext` | immutable context with ordered safe segment refs, redaction, digest | segment order/source/version/kind/position/redaction + total weight/digest/version exact；Expired/Degraded visible | no source resolution/refresh/model materialization/raw fragment body | `EV-CON-504` |
| `TC-Q05-001` `GetMemoryUse` | paged local use records with candidate/source/decision/context refs | exact use disposition/order/cursor; only Runtime-owned use records | no durable-memory body/lifecycle call; invalid cursor fail closed | `EV-CON-505` |
| `TC-Q06-001` `GetModelTurn` | turn/binding/submission/result/decision-summary refs in all states | exact `ModelTurnState`, refs and safe summary availability；Unknown/Failed retained | model/materializer/provider calls zero；no raw material/route/secret/quota/cost | `EV-CON-506` |
| `TC-Q07-001` `GetActionState` | Proposed/Guarded/Candidate/Unknown action with optional marker/attempt/feedback | owner-separated action/guard/attempt/marker states and versions；missing marker legal for Proposed | no execution inference；no Governance/Hub/Tools/Sandbox calls | `EV-CON-507` |
| `TC-Q08-001` `GetDelegationState` | delegation/boundary/child/result refs within and across scope | local `DelegationState`, version, boundary digest and refs exact | no child/member/container lookup；cross-scope NotVisible | `EV-CON-508` |
| `TC-Q09-001` `GetCheckpointState` | explicit/latest checkpoint in Prepared/CommitPending/CommitUnknown/Committed | states remain distinct; physical commit ref only when proven; fence retained | `CheckpointCommitPort::reconcile` zero calls；Prepared never presented stable | `EV-CON-509` |
| `TC-Q10-001` `GetRuntimeOutcome` | no outcome and each immutable local outcome state | optional outcome, result/safe-summary refs, fence exact | no handoff/Artifact/Observability/product call or external acceptance field | `EV-CON-510` |
| `TC-Q11-001` `GetHandoffState` | attempt/gap/material/ack refs in Candidate/Submitted/Acknowledged/Blocked/Unknown | local attempt/gap state and matching ack ref exact；open/unknown gap visible | ACK not acceptance/delivery/observed；no submission/reconcile call | `EV-CON-511` |
| `TC-Q12-001` `GetProjectionState` | store returns Empty/Current/Stale/Rebuilding/Degraded/Unknown with watermark/cursor | exact store posture and freshness; Current only with store proof | no synthesis from domain tables；no rebuild/domain write/authorization | `EV-CON-512` |

## C2. Inbound Events E01~E06

Every event case uses `(source_owner,event_id,payload_digest)` and variants: valid new event、same ID+same digest、same ID+different digest、late、out-of-order、schema/source mismatch、local commit unknown. Common oracle: inbox reservation first；fact+receipt+history/outbox in known commit；ACK only after known receipt；unknown retains unresolved receipt/fence and ACK count 0。

| Case / Event | Fixture / operation | Valid result assertions | Negative / phase assertions | Planned EV |
|---|---|---|---|---|
| `TC-E01-001` `ModelResultAvailable` | submitted turn + semantic result ref + ordering anchor | matching result classified into turn/decision/safe summary; receipt stores exact source/digest | late/mismatch quarantined; raw body rejected; duplicate exact receipt; unknown no ACK/no new submission | `EV-ENTRY-521` |
| `TC-E02-001` `ActionFeedbackReceived` | marker/action/submission + normalized Tools source | applicable feedback may transition marker/progress once; immutable feedback retained | raw Sandbox source rejected; late/mismatch/collision never positive marker/outcome; commit unknown no ACK | `EV-ENTRY-522` |
| `TC-E03-001` `ChildResultAvailable` | delegation + child scope/correlation + result ref | `Delegation::incorporate_once`; parent history/outbox and receipt committed | scope/correlation mismatch quarantine；duplicate once；child disposition never finalizes parent | `EV-ENTRY-523` |
| `TC-E04-001` `SourceSnapshotChanged` | source marker version + newer/same/older/conflict owner versions | newer safe availability/snapshot ref appended; dependent context/projection stale facts as declared | no owner body; duplicate/late/conflict explicit; stale event cannot replace current marker | `EV-ENTRY-524` |
| `TC-E05-001` `GovernancePreconditionChanged` | formal decision/policy ref + scope/effective version + affected action/run | read-only safe view may append new block/progress fact and wakeup | no approval/policy truth creation; wrong scope/stale/unknown fail closed; no action submit in consumer | `EV-ENTRY-525` |
| `TC-E06-001` `HandoffAcknowledgementReceived` | attempt/gap + expected digest/source + ACK | only matching verified ack closes same gap via CAS; reconciliation/history/receipt committed | mismatch/late/unknown leaves gap open; local outcome/run/checkpoint unchanged; ACK != accepted | `EV-ENTRY-526` |

## C3. Outbound Events O01~O06

Every outbound case materializes inside the owning fact UoW and then faults publication separately. Common assertions: event ID/digest/payload derive from immutable commit-time snapshot；publisher retry reuses exact bytes/identity；rejection/unknown changes only local publication posture according to policy；receipt never means delivered/observed/downstream accepted；payload is never rebuilt from current truth。

| Case / Event | Producing fixture / operation | Snapshot schema assertions | Fault / no-promotion assertions | Planned EV |
|---|---|---|---|---|
| `TC-O01-001` `RuntimeFactCommitted` | commit representative fact kinds and later mutate current aggregate | fact ref/kind/run/version/correlation/safe refs exactly as commit-time | later state does not alter snapshot; commit rollback yields no outbox event | `EV-CON-531` |
| `TC-O02-001` `RuntimeDecisionCommitted` | commit each decision kind/disposition/source refs | immutable decision ref/kind/disposition/source/version body-free | approval/authorization/hidden reason fields schema-rejected; no owner truth | `EV-CON-532` |
| `TC-O03-001` `ActionSubmissionAttempted` | committed attempt/marker with target and each `OperationPosture` | local action/attempt/marker/target/posture exact | `Executed`/cleanup-complete/Sandbox success unrepresentable; call-before-record impossible | `EV-CON-533` |
| `TC-O04-001` `RuntimeOutcomeCommitted` | immutable outcome with safe refs | outcome ref/run/state/result refs/safe summary refs exact | delivery/acceptance/observed/product completion fields absent; downstream cannot rewrite | `EV-CON-534` |
| `TC-O05-001` `HandoffAttempted` | candidate/submission posture + optional gap | material/attempt/digest/local state/gap exact | event name does not assert delivery；unknown retains same identity; no observed field | `EV-CON-535` |
| `TC-O06-001` `ProjectionMarkedStale` | committed fact invalidates projection at known history sequence | projection ID/source run version/history sequence/SafeReason exact | does not claim rebuild/current and never writes domain truth | `EV-CON-536` |

## C4. Jobs J01~J07

Every Job owning case uses `(operation,partition,lease_epoch,page_digest)` and variants: known page success、empty page、lease loss before/within commit、stale epoch、item failure、page conflict、commit unknown、same-page replay、different digest collision。Common oracle: claim live lease before read；bounded page；item facts+`JobPageReport`+next cursor atomic；unknown/loss stops runner and retains last committed cursor；no unbounded loop。

| Case / Job | Fixture / operation | Page success assertions | Fault/replay assertions | Planned EV |
|---|---|---|---|---|
| `TC-J01-001` `RebuildSafeRuntimeViews` | contiguous/gapped history pages + projection CAS/store | safe views from committed history only；watermark/cursor contiguous；page/report/cursor atomic | gap -> Degraded+gap ref；CAS/lease/unknown preserves cursor；zero domain writes | `EV-JOB-541` |
| `TC-J02-001` `RefreshSourceSnapshots` | source ref page + resolver finite availability results | expected version used; per-source marker/disposition; dependent contexts/projections marked stale as facts | pending/stale/unknown explicit；no body fallback/readiness；fault retains cursor and exact page identity | `EV-JOB-542` |
| `TC-J03-001` `CompactWorkingMemory` | Open window partition + retained/removed refs | complete partition creates new version/window+decision/history/report atomically | conflict/unknown keeps old window authoritative；no durable delete/retention call | `EV-JOB-543` |
| `TC-J04-001` `ResumeEligibleRuns` | candidates with Committed/Prepared/Unknown checkpoints and open/closed fences | only Committed+closed fence schedules one local continuation with immutable recovery decision | max attempts=1；unknown/manual isolated；no external submit/retry；lease loss stops | `EV-JOB-544` |
| `TC-J05-001` `ReconcileUnknownEffects` | unknown action/checkpoint markers + status-only spies | query same submission/checkpoint/request identity；verified status appends feedback/receipt; otherwise retains unknown | never `submit`/new effect/key；status mismatch quarantined；cursor advances only known page commit | `EV-JOB-545` |
| `TC-J06-001` `ReconcileHandoffGaps` | open/unknown gaps + matching/mismatch/missing ACK/status | matching verified ref may close same gap; reconciliation/report/cursor atomic | no self-close/resend/observed claim；missing/unknown remains open; outcome unchanged | `EV-JOB-546` |
| `TC-J07-001` `PublishRuntimeOutbox` | ordered immutable outbox snapshots + publisher finite receipts | publish exact stored event ID/digest/payload; known policy advances cursor and records receipt | unknown retains same snapshot/cursor posture; no payload regeneration/delivery/observed claim | `EV-JOB-547` |

## C5. Protocol identity and phase audit

| Denominator / rule | Result |
|---|---|
| Queries | 12/12 independent owning cases; every one visibility-first and zero-write/call |
| inbound Events | 6/6 independent owning cases; every one inbox/dedupe/collision/ACK-after-commit |
| outbound Events | 6/6 independent owning cases; every one immutable snapshot/exact republish |
| Jobs | 7/7 independent owning cases; every one lease/page/report/cursor/replay/fault |
| protocol total in this annex | 31/31 |
| later phase promoted early | none |
| real broker/scheduler/backend claim | none |
| actual execution/evidence | none |
