# L2-runtime 06 验收标准 Step 8：状态机、事务与一致性

> 对应 SOP：`standards/document/验收标准讨论流程_SOP.md` Step 8
> 回填位置：正式 `06-验收标准.md` §8
> 状态：`completed_continuous_authorized`
> 输入：formal 03 §§8~12、formal 05 state/UoW/replay cases 与 177 registry、Step 5~7 已闭合裁决
> 事实边界：本 Step 定义 future state/transaction decision contract；当前没有 state run、fault injection、artifact、evidence 或 actual disposition

## 1. 本步目标与裁决合同

本步不重新定义状态，也不选择数据库、broker、scheduler、隔离级别或物理 checkpoint store。唯一可用状态主语是 formal 03 §9 的 31 个 canonical state subjects；旧 18-state 索引、口语状态、`Ready`、`Executed`、`Delivered`、`Observed` 或 downstream acceptance 不得混入 Runtime 本地状态。

```text
state_tx_pass(subject_or_window) :=
  exact formal subject/variant/trigger/guard resolves
  AND every declared legal transition succeeds with exact target and side effects
  AND every non-listed transition is rejected without write/call/history drift
  AND expected-version/CAS, identity/digest, order and phase assertions pass
  AND commit-known/unknown, rollback, lease, cursor, inbox/outbox and replay postures remain distinct
  AND canonical TC raw + owning suite report + planned EV instance are eligible in one fixed run
  AND mapped AC pass and mapped applicable VF are not_triggered
```

缺 evidence 为 `not_evaluable/not_decidable`，不是静态 failure，也绝不能推导 pass。任一非法迁移被接受、partial commit、LWW、stale epoch write、cursor skip、ACK-before-commit、outbox payload rebuild、unknown blind retry 或 phase promotion 均为 P0 failure；命中 `VF-L2R-004/005` 时为不可风险接受的一票否决方向。

## 2. 状态、事务与恢复裁决流

**图类型：** state/transaction decision flow
**图标题：** Runtime 状态变更与外部副作用分阶段裁决

```text
formal trigger + expected version + identity/digest
                         |
                    [T1 local UoW]
 reservation + aggregate transition + history + outbox/result
                         |
                known commit? ---- no ----> Unknown/Fence/Reconcile
                    | yes                         |
                    v                             +-- no blind retry
          optional external T2 call
                    |
        accepted/rejected/timeout/unknown
                    |
                    v
                  [T3]
 typed posture + cursor/receipt/fact under CAS; exact identity only
                    |
                    v
       query/projection may expose phase, never promote it
```

关键说明：

1. 一个 local UoW 的 reservation、domain record、history、stored result 和 outbox 必须全有或全无；外部调用不能塞进同一伪事务。
2. `Unknown` 表示结果不可确定，必须保留 fence 并按相同 identity 做 status-only reconcile；它不是 retryable failure 或 success。
3. inbox receipt、outbox publish receipt、ACK、delivery、Observed 和 acceptance 是不同 phase，后者不得反写 local run/outcome/checkpoint truth。
4. `L2R-CP-001` 继续阻塞物理 checkpoint durability/atomicity qualification；本步可以闭合 local logical contract，但不能形成 production readiness。

## 3. SM01~SM10：核心运行与行动状态

所有 state owning raw 固定由 `unit_state` suite 产出，report 为 `reports/runs/<run_id>/suites/unit_state.md`，EV detail 为 `reports/runs/<run_id>/evidence/<evidence_id>.md`。

| State / formal subject | 必须成立的合法迁移与副作用 | 必须拒绝的非法迁移 / phase 越界 | Trigger Flow | TC -> EV | AC / VF |
|---|---|---|---|---|---|
| SM01 admission | factory -> Accepted/Rejected/Waiting/Blocked/Unknown；Accepted 才可同 UoW 建 run/workspace | pending/unknown -> Accepted；negative 携带 run；terminal rewrite | C01 | `TC-SM01-001` -> `EV-UNIT-601` | AC001/006；VF008 |
| SM02 controlled run | factory->Active；Active->Waiting/Blocked/Paused；Paused->Active；cancel/terminal/manual edges exact | negative admission 建 Active；lease 自动 resume；Unknown 普通重试；ACK 改 run；terminal reopen | C02/C03/C14/C15 | `TC-SM02-001` -> `EV-UNIT-602` | AC001/008/018/035；VF004 |
| SM03 goal-plan workspace | Created->Initializing->Active；Active->Waiting/Blocked；nonterminal->Frozen/Superseded | `Ready` 当 workspace state；Accepted=Active；missing dep 仍 Active；in-place overwrite | C01/C03 | `TC-SM03-001` -> `EV-UNIT-603` | AC001/007 |
| SM04 working context | Assembling->Assembled->Frozen；Assembled/Frozen->Degraded/Expired；version/history exact | unsafe/body mandatory input；Assembled 直接 model use；Degraded=complete；Frozen 原地 refresh | C04/C06 | `TC-SM04-001` -> `EV-UNIT-604` | AC002/009/030 |
| SM05 working memory | factory->Open；Open->Compacting->Open；->Frozen/Degraded/Unavailable；new window atomic | unknown commit 激活新 Open；durable readiness/delete inference；unavailable=success | C04/C05/J03 | `TC-SM05-001` -> `EV-UNIT-605` | AC002/010/028；VF001 |
| SM06 model turn | Created->ContextBound->SubmissionCandidate->Submitted->Classified；Rejected/Failed/Unknown exact | unbound submit；candidate=provider success；raw result persist；Unknown new submission | C06/C07/E01 | `TC-SM06-001` -> `EV-UNIT-606` | AC003/012/013；VF003/004 |
| SM07 action decision | Proposed->Guarded->SubmissionCandidate；->Blocked/Cancelled/Superseded；candidate->Unknown | proposal=Allowed；stale checked versions submit；cancel submitted effect；`Executed` variant | C08/C09/internal submit | `TC-SM07-001` -> `EV-UNIT-607` | AC004/014/015；VF002 |
| SM08 side-effect marker | Candidate->AttemptRecorded->Submitted->FeedbackIncorporated/Failed；pre-submit cancel/Unknown exact | call before record；ACK/status alone advances；cleanup pending=Failed；Unknown cleared/retried | internal submit/C11/J05 | `TC-SM08-001` -> `EV-UNIT-608` | AC004/015/035；VF004 |
| SM09 delegation | Proposed->Candidate->Submitted->ChildAccepted->ResultAvailable->Incorporated；negative exact | member/container state；child finalizes parent；Unknown resubmit；double incorporation | C10/E03 | `TC-SM09-001` -> `EV-UNIT-609` | AC004/016 |
| SM10 feedback disposition | Received->Apply/RecordOnly/IgnoreDuplicate/Quarantine/Mismatch/Manual | late Apply/overwrite；duplicate second fact；unknown flattened | C11/E02 | `TC-SM10-001` -> `EV-UNIT-610` | AC004/025/035；VF005 |

## 4. SM11~SM20：恢复、结果、外部接缝与计划状态

| State / formal subject | 必须成立的合法迁移与副作用 | 必须拒绝的非法迁移 / phase 越界 | Trigger Flow | TC -> EV | AC / VF |
|---|---|---|---|---|---|
| SM11 checkpoint | Preparing->Prepared->CommitPending->Committed；CommitPending->CommitUnknown；Committed->Superseded | Prepared=durable/resumable；mismatch receipt commits；Unknown 无 proof 提升；old delete | C12/C13 | `TC-SM11-001` -> `EV-UNIT-611` | AC005/017/035；VF004 |
| SM12 recovery/continuation | finite decision；Pending->Claimed->Applied->Completed；Blocked/Manual/Unknown explicit | unknown effect -> Resume；decision mutate；lease loss continue；new-key effect retry | C14/J04 | `TC-SM12-001` -> `EV-UNIT-612` | AC005/018/035；VF004 |
| SM13 local outcome | factory -> Succeeded/Partial/Blocked/Failed/Cancelled/Unknown；unique run outcome | nonterminal/open fence success；different second outcome；handoff/ACK mutates outcome | C15 | `TC-SM13-001` -> `EV-UNIT-613` | AC005/020/024；VF005 |
| SM14 handoff attempt/gap | Candidate->Submitted->Acknowledged；negative exact；Open->Reconciling->Closed/Unknown | Candidate=Delivered；ACK=Accepted/Observed；new identity republish；time/projection self-close | C16/E06/J06 | `TC-SM14-001` -> `EV-UNIT-614` | AC005/020/024/035；VF005 |
| SM15 source availability | Available/PendingContract/Unavailable/Unknown；Available->Stale/Degraded；new proof may restore | Partial second axis；Available=readiness；stale/current swap；fake/ping closes blocker | C17/E04/J02 | `TC-SM15-001` -> `EV-UNIT-615` | AC009/021/032；VF006 |
| SM16 projection | Empty/Stale/Degraded->Rebuilding->Current；Current->Stale；gap->Degraded/Unknown | Current without contiguous watermark；domain write/authorize；cursor skip/regress；lease-loss advance | O06/J01/Q12 | `TC-SM16-001` -> `EV-UNIT-616` | AC024/030/036；VF005 |
| SM17 adapter | Disabled/Blocked/Candidate binding；availability PendingContract/Blocked/Unavailable/Degraded/Candidate | `Ready`；Candidate/Bound=qualified；fake/design/ping closes blocker；blocked positive call | builder/C06/C09 | `TC-SM17-001` -> `EV-UNIT-617` | AC011/023/032；VF006 |
| SM18 job lease/page | lease claim/renew/release/expire；Waiting->Running->CompletedPage/Blocked/Failed/Unknown | stale epoch write；cursor before page/report commit；lease loss continues；Unknown=Completed | J01~J07 | `TC-SM18-001` -> `EV-UNIT-618` | AC032/035；VF004 |
| SM19 plan revision | Candidate->Validated->Accepted->Active；negative；Active->Superseded | Accepted=Active；two current revisions；in-place repair/delete；base mismatch accepted | C03/proposal | `TC-SM19-001` -> `EV-UNIT-619` | AC001/007/019 |
| SM20 working plan item | NotStarted->Eligible->InProgress->Waiting/Blocked/LocallyVerified/Failed/Unknown；->Superseded | array order/external start inference；Unknown->LocallyVerified；owner success inferred；old mutation | C03/E04 | `TC-SM20-001` -> `EV-UNIT-620` | AC001/007/019 |

## 5. SM21~SM31：proposal、loop、reservation 与 attempt 状态

| State / formal subject | 必须成立的合法迁移与副作用 | 必须拒绝的非法迁移 / phase 越界 | Trigger Flow | TC -> EV | AC / VF |
|---|---|---|---|---|---|
| SM21 plan proposal | Draft->Submitted->Validated->Accepted；preterminal->Rejected/Blocked/Superseded | direct active revision mutation；base mismatch；Accepted=Active | reflection/progress | `TC-SM21-001` -> `EV-UNIT-621` | AC005/019 |
| SM22 model input binding | Candidate->Bound；->Blocked/Unknown/Released/Expired | content field；digest/version mismatch；Released=provider success；expired reuse | C06 | `TC-SM22-001` -> `EV-UNIT-622` | AC003/011/032；VF003 |
| SM23 materialization | Resolving->Resolved/Degraded/Pending/Rejected/Unknown；Resolved->Released/Expired | durable body/log/event；Pending model call；Released=execution；mandatory omission resolved | C06 | `TC-SM23-001` -> `EV-UNIT-623` | AC003/011/032；VF003 |
| SM24 reflection | factory->Recorded->Applied；Recorded->Blocked/Manual/Superseded | hidden reasoning；direct plan activation；stale/unknown source Applied；old decision mutate | reflection | `TC-SM24-001` -> `EV-UNIT-624` | AC005/019；VF003 |
| SM25 runtime wakeup | Pending->Claimed->ConsumedForStep；Claimed->Coalesced/ObservedNoResume/RunTerminal/Quarantined | claim=consume；unknown dropped；duplicate creates step；no T3 anchor | event/loop | `TC-SM25-001` -> `EV-UNIT-625` | AC025/035 |
| SM26 loop activation | Claimed->Executing->Yielded/Completed；Executing->LeaseLost/Unknown | two live activations；run state reuse；lease loss continue；unbounded budget | loop engine | `TC-SM26-001` -> `EV-UNIT-626` | AC007/008/031 |
| SM27 loop step | Prepared->Invoking->Applied；Invoking->Yielded/ReconciliationRequired/Unknown | two service calls；T2 before T1；T3 rebuild current truth；Unknown=success | T1/T2/T3 | `TC-SM27-001` -> `EV-UNIT-627` | AC007/034/035 |
| SM28 local continuation | Pending->Claimed->Consumed；->StaleNoop/Quarantined | external retry grant；stale cursor backwards；lease mismatch consume | C14/J04 | `TC-SM28-001` -> `EV-UNIT-628` | AC018/035；VF004 |
| SM29 hard yield | Open->Resolved/Superseded/Quarantined | self-wakeup spin；time-only/unmatched fact resolve；old yield rewrite | loop engine | `TC-SM29-001` -> `EV-UNIT-629` | AC007/035 |
| SM30 operation reservation | Reserved->ResultStored；Reserved->ReconciliationRequired->Released | result without commit；different digest replay；TTL permits duplicate fact/effect；unknown re-execution | all mutation flows | `TC-SM30-001` -> `EV-UNIT-630` | AC034/035；VF004 |
| SM31 action attempt | factory->Recorded->Submitted；Recorded->Rejected/Blocked/Unknown | call before record；`Executed`/cleanup/Sandbox success variant；Unknown new submit/key | internal submit | `TC-SM31-001` -> `EV-UNIT-631` | AC015/035；VF004 |

## 6. UoW 与 crash-window 门禁

这些 raw 固定由 `fault_replay_consistency` suite 产出，report 为 `reports/runs/<run_id>/suites/fault_replay_consistency.md`。

| TC -> EV | Fault schedule | 通过条件 | 失败条件 / 裁决影响 |
|---|---|---|---|
| `TC-UOW-001` -> `EV-FAULT-641` | single-UoW Command 每个 write 前故障 | reservation/domain/history/outbox/result 全提交或全不可见；known rollback | partial public fact/result/outbox；AC034/035 fail，VF004 direction |
| `TC-UOW-002` -> `EV-FAULT-642` | UoW-1 committed，external call 前 crash | candidate/attempt/binding retained；same identity 可恢复 | 新 identity/candidate、假定已调用；AC018/034/035 fail |
| `TC-UOW-003` -> `EV-FAULT-643` | external accepted/unknown，UoW-2 前 crash | stable external identity + local fence；status-only reconcile | second submit 或 success inference；VF004 |
| `TC-UOW-004` -> `EV-FAULT-644` | external response 后 UoW-2 commit unknown | owner status 与 local commit 独立核对；same identity | response 直接当 local committed truth；VF004 |
| `TC-UOW-005` -> `EV-FAULT-645` | inbox fact/receipt/history commit failure/unknown | known commit 前 ACK=0；receipt/fence retained | ACK 后丢 fact；blind reapply；AC025/034/035，VF004/005 |
| `TC-UOW-006` -> `EV-FAULT-646` | source UoW commit/rollback + publisher retry | outbox iff source committed；same bytes/ID/digest replay | 从 current truth 重建；receipt=Observed；AC024/034/035，VF005 |
| `TC-UOW-007` -> `EV-FAULT-647` | job item/report/cursor 每边界 fault | whole page+report+cursor 或 prior cursor authoritative；same page replay | cursor skip 或 partial current page；AC034/035，VF004 |

## 7. Replay、CAS、lease、cursor 与唯一性门禁

| TC -> EV | Concurrency/replay subject | 通过条件 | 失败条件 / 裁决影响 |
|---|---|---|---|
| `TC-REPLAY-001` -> `EV-FAULT-648` | Commands same/different digest | same digest exact stored typed result；different digest conflict；zero second call/fact | second mutation/call；VF004 |
| `TC-REPLAY-002` -> `EV-FAULT-649` | Events duplicate/collision/late/order gap | exact receipt / quarantine / predecessor gap；target unchanged when non-applicable | reverse-write/second apply；VF004/005 |
| `TC-REPLAY-003` -> `EV-FAULT-650` | Jobs page digest + lease epoch race | exact report replay or conflict；only live epoch commits | stale page/cursor commit；VF004 |
| `TC-REPLAY-004` -> `EV-FAULT-651` | two writers same expected version | one CAS winner；loser VersionConflict；history contiguous | LWW/merge/two truths；VF004 |
| `TC-REPLAY-005` -> `EV-FAULT-652` | outcome/handoff/attempt concurrent creators | unique run/material/action key yields one owner row | duplicate outcome/effect；AC020/034/035，VF004/005 |
| `TC-REPLAY-006` -> `EV-FAULT-653` | reservation retention expiry | permanent uniqueness proof preserves prior result identity | TTL alone permits duplicate fact/effect；VF004 |

Companion cases `TC-LPORT-002/003` (`EV-FAULT-431/432`)、`TC-LOOP-004~006` (`EV-FAULT-423~425`) and `TC-ERR-002/003/006/007` (`EV-CON-662`,`EV-FAULT-663/666`,`EV-STATIC-667`) are mandatory registry rows for AC018/025/032/034/035 and VF004/005/008. They verify repository conflict types, inbox/outbox/history uniqueness, lease-loss stop, hard yield, typed commit unknown and finite recovery vocabulary; they cannot be dropped because the primary SM/UoW case passed.

## 8. Record/UoW consistency matrix

| Consistency family | Authoritative record/guard | Atomic or ordering invariant | Unknown/recovery ceiling |
|---|---|---|---|
| run/plan | `RunVersion`,`WorkspaceVersion`, strict history sequence | decision + changed aggregate + result + history + outbox one local UoW | reload/reconcile; no LWW or inferred progress |
| context/memory | context/window version + immutable use identity | composition/window/use/history atomic；frozen context immutable | prior committed window/context authoritative |
| model/action/delegation | turn/action/marker/delegation version + submission digest | local candidate before external call；posture in later UoW | same identity status-only; no blind submit |
| feedback/event | inbox `(source,event_id,digest)` + target CAS/order | receipt + applicable fact + target change + history/outbox before ACK | ACK=0 on commit unknown；quarantine/retain fence |
| checkpoint/recovery | checkpoint version + state/fence digest | Prepared local；matching physical receipt only commits；decision append-only | CommitUnknown/Manual/Reconcile；no Resume |
| outcome/handoff | unique outcome per run；attempt/gap typed versions | outcome terminal atomic；handoff later and local-first | ACK only exact attempt/gap；no outcome rewrite |
| outbox | immutable event ID/payload bytes/digest | source fact and snapshot same commit；publisher changes status only | same bytes republish；receipt not delivery/Observed |
| projection | projection version + contiguous history cursor | derived page/view/report/cursor atomic；domain read-only | Stale/Degraded/Unknown；never Current without catch-up |
| job | operation+partition, lease token/epoch, job version/cursor | one live runner；page side effects/report/cursor atomic | stop immediately；next runner reloads committed cursor |

## 9. State / transaction item stop-review

| Group | Exact denominator | Formal names and triggers | Evidence binding | Side-effect/phase audit | Stop-review |
|---|---:|---|---|---|---|
| SM01~10 | 10 | formal enum variants + C/E/internal flows | 10 exact TC/EV; `unit_state` | illegal edges, versions, history and external-call ceiling explicit | closed_design |
| SM11~20 | 10 | checkpoint/recovery/outcome/handoff/source/projection/adapter/job/plan | 10 exact TC/EV; `unit_state` | Committed/ACK/Current/Candidate phase boundaries explicit | closed_design |
| SM21~31 | 11 | proposal/binding/materialization/reflection/loop/continuation/reservation/attempt | 11 exact TC/EV; `unit_state` | loop T1/T2/T3, lease, no retry and no hidden phase explicit | closed_design |
| UoW | 7 | local/external/event/outbox/job crash windows | 7 exact TC/EV; `fault_replay_consistency` | all-or-none, ACK, immutable snapshot and cursor exact | closed_design |
| replay/concurrency | 6 | command/event/job/CAS/unique/retention | 6 exact TC/EV; `fault_replay_consistency` | same/different digest, one winner, stale epoch and TTL explicit | closed_design |
| companion consistency | 13 | LPORT/LOOP/ERR rows from canonical registry | exact existing registry rows; no new identities | typed recovery and boundary coverage retained | closed_design |

## 10. 跨状态一致性门禁审计

| 审计项 | 结论 | 缺口 / 修正 |
|---|---|---|
| canonical state denominator | 31/31 independent；旧 18-state 仅 historical | none |
| name/phase drift | `Ready/Executed/Delivered/Observed/Accepted downstream` 不可写入 local state | none |
| legal + illegal edges | every SM owning case parameterizes all listed and non-listed pairs | actual execution absent |
| CAS/LWW | typed expected versions；one winner；no store LWW/implicit merge | physical store qualification pending |
| UoW atomicity | 7/7 crash windows cover local, external, inbox, outbox and job page | `L2R-CP-001/L2R-IMPL-001` block actual proof |
| lease/cursor | operation+partition fencing, monotonic cursor, lost lease stop | scheduler/store product not selected |
| inbox/outbox | receipt/ACK and immutable snapshot replay exact；no exactly-once delivery claim | Bus/physical route pending |
| replay identities | Command/Event/Job domains separate；same/different digest explicit | none |
| unknown posture | fence/reconcile/manual; no ordinary retry/success | none |
| evidence path | one fixed run raw + owning suite + EV detail; registry is not evidence | actual evidence none |
| G1/G3 boundary | local logical pass cannot qualify physical checkpoint/store/Bus/owner seams | positive lanes blocked |

## 11. 回填草稿与 Step stop-review

Formal §8 应先给出状态/事务裁决合同和 T1/T2/T3 flow，再逐项列出 SM01~31，随后收口 7 UoW、6 replay/concurrency、record consistency matrix 与 cross-state audit。所有 row 必须保留 exact TC/EV 与 report owner；不得把 `L2R-CP-001` 或 implementation absence 写成 local denominator skip，也不得把 logical pass 写成 physical durability/readiness。

```text
step_status = completed_continuous_authorized
canonical_state_subjects = 31
state_primary_tc_ev = 31
uow_crash_windows = 7
replay_concurrency_families = 6
actual_state_tx_evidence = none
physical_checkpoint_store_qualification = blocked_by_L2R_CP_001_and_IMPL_001
current_process_state = not_entered
next_step = Step 9
formal_06_write_allowed = false_until_step_15
```
