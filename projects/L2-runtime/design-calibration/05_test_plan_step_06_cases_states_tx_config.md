# L2-runtime Step 6 Annex D：States、事务、一致性、错误、配置与安全用例

> Parent：`05_test_plan_step_06_cases.md`
> 正式来源：`03-详细设计.md` §§9~14；`04-配置设计.md` §§5~12
> 状态：`completed_as_step_06_annex`
> 本 annex 只定义 planned cases/oracles；不选择 DB/broker/scheduler，不执行测试，不产生证据

## D1. SM-01~SM-31 通用参数化规则

每个 `TC-SMxx-001` 必须由同一 state harness 展开以下 partitions，不能只执行一条 happy path：

```text
L = formal 03 §9 为该 SM 列出的全部合法 transition rows
S = canonical source variants in the state/disposition/posture type
T = canonical target variants in the same type
I = (S x T) - L

for each edge in L:
  construct exact guard/trigger -> transition succeeds
  assert canonical target + typed version increment + required write set + history append
for each edge in I:
  invoke owner method -> DomainError::IllegalStateTransition
  assert version/history/write/call journals unchanged
for every versioned edge:
  stale expected version -> RepositoryError::VersionConflict or DomainError::VersionMismatch
for every replayable trigger:
  same identity+digest -> exact result; different digest -> conflict
for every Unknown target:
  fence/reconciliation ref required; ordinary retry cannot close it
```

`FactoryPhase`、`DomainState`、`Disposition`、`Posture` 各自在自己的类型内测试，禁止用一种轴的 variant 替代另一轴。`Ready` 不是 adapter/source canonical variant；`Completed` 只允许 continuation/job page 的正式语境。

## D2. 31 个 canonical state owning cases

| Case / subject | Legal partition to enumerate | Special illegal/fail-closed assertions | Companion Flow | Planned EV |
|---|---|---|---|---|
| `TC-SM01-001` admission | factory -> Accepted/Rejected/Waiting/Blocked/Unknown | pending/unknown -> Accepted 禁止；negative decision 不得带 run/workspace；terminal rewrite 禁止 | C01 | `EV-UNIT-601` |
| `TC-SM02-001` controlled run | factory->Active；Active->Waiting/Blocked/Paused；Paused->Active；cancel chain；nonterminal->Terminal/Unknown->ManualReview | negative admission 不建 Active；lease alone 不 resume；unknown ordinary retry；handoff ACK 改 run；terminal rewrite | C02/C03/C14/C15 | `EV-UNIT-602` |
| `TC-SM03-001` goal-plan workspace | factory->Created->Initializing->Active；Active->Waiting/Blocked；nonterminal->Frozen/Superseded | `PlanEvaluationDisposition::Ready` 不是 workspace state；proposal Accepted != Active；missing dependency 不保持 Active；no in-place overwrite | C01/C03 | `EV-UNIT-603` |
| `TC-SM04-001` working context | assembling->Assembled->Frozen；assembled/frozen->Degraded/Expired | unsafe/body-bearing mandatory input 禁止；Assembled 不可直接 model use；Degraded 不冒充 complete；frozen no in-place refresh | C04/C06 | `EV-UNIT-604` |
| `TC-SM05-001` working memory | factory->Open；Open->Compacting->Open；->Frozen/Degraded/Unavailable | commit unknown 不产生新 authoritative Open；no durable availability inference/silent delete/unavailable success | C04/C05/J03 | `EV-UNIT-605` |
| `TC-SM06-001` model turn | factory->Created->ContextBound->SubmissionCandidate->Submitted->Classified；negative Rejected/Failed/Unknown | unbound submit；candidate=provider success；raw result persistence；Unknown new submit | C06/C07/E01 | `EV-UNIT-606` |
| `TC-SM07-001` action decision | Proposed->Guarded->SubmissionCandidate；->Blocked/Cancelled/Superseded；candidate->Unknown | proposal=Allowed；stale checked versions submit；cancel submitted effect；Unknown ordinary retry；no Executed variant | C08/C09/internal submit | `EV-UNIT-607` |
| `TC-SM08-001` side-effect marker | candidate->AttemptRecorded->Submitted->FeedbackIncorporated/Failed；->CancelledBeforeSubmit/Unknown | external call before attempt record；ACK/status alone transition；cleanup pending=Failed；Unknown clear/retry | internal submit/C11/J05 | `EV-UNIT-608` |
| `TC-SM09-001` delegation | proposed->candidate->submitted->ChildAccepted->ResultAvailable->Incorporated；negative rejected/cancelled/failed/unknown | member/container lifecycle variants absent；child result cannot finalize parent；unknown resubmit forbidden；incorporate once | C10/E03 | `EV-UNIT-609` |
| `TC-SM10-001` feedback disposition | received->Apply/RecordOnly/IgnoreDuplicate/quarantine/mismatch/manual | late cannot Apply/overwrite；duplicate cannot create second fact；unknown not success/failure | C11/E02 | `EV-UNIT-610` |
| `TC-SM11-001` checkpoint | preparing->Prepared->CommitPending->Committed；pending->CommitUnknown；Committed->Superseded | Prepared != physical committed/resumable；mismatch receipt；unknown->Committed without proof；delete old checkpoint | C12/C13 | `EV-UNIT-611` |
| `TC-SM12-001` recovery/continuation | decision->Resume/RestartFromStable/ReconcileOnly/WaitForFact/Blocked/Cancel/ManualReview；waiting->claimed->applied->completed；negative blocked/manual/unknown | unknown effect -> Resume forbidden；decision immutable；lease loss continues/repeat apply/new key retry forbidden | C14/J04 | `EV-UNIT-612` |
| `TC-SM13-001` local outcome | factory -> Succeeded/Partial/Blocked/Failed/Cancelled/Unknown | nonterminal finalize；open fence Succeeded；second different outcome；handoff/ACK state mutation | C15 | `EV-UNIT-613` |
| `TC-SM14-001` handoff attempt/gap | factory->Candidate->Submitted->Acknowledged；negative rejected/blocked/unknown；gap Open->Reconciling->Closed/Unknown | Candidate=Delivered；ACK=Accepted；new identity ordinary republish；time/projection self-close | C16/E06/J06 | `EV-UNIT-614` |
| `TC-SM15-001` source availability | any->Available/PendingContract/Unavailable/Unknown；Available->Stale；Available/Stale->Degraded；negative->Available with new proof | Partial != second availability state；Available != readiness；stale/current substitution；fake/ping/design file closes blocker | C17/E04/J02 | `EV-UNIT-615` |
| `TC-SM16-001` projection | Empty->Rebuilding->Current；Current->Stale->Rebuilding/Degraded/Unknown | Current without contiguous watermark；projection authorizes/writes domain；gap skipped | O06/J01/Q12 | `EV-UNIT-616` |
| `TC-SM17-001` adapter | binding Disabled->Blocked/Candidate；candidate availability->PendingContract/Blocked/Unavailable/Degraded | `Ready` unrepresentable；Candidate/Bound=qualification；fake/design/ping closes blocker | builder/C06/C09 | `EV-UNIT-617` |
| `TC-SM18-001` job lease/page | Available->Claimed->Renewed->Released/Expired/Unknown；Waiting->Running->CompletedPage/Blocked/Failed/Unknown | stale epoch writes；cursor advance before page/report commit；lease loss continues page | J01~J07 | `EV-UNIT-618` |
| `TC-SM19-001` plan revision | Candidate->Validated->Accepted->Active；negative Rejected/Blocked；Active->Superseded | Accepted=Active；two current revisions；in-place repair/delete；base mismatch accepted | C03/proposal | `EV-UNIT-619` |
| `TC-SM20-001` working plan item | NotStarted->Eligible->InProgress->Waiting/Blocked/LocallyVerified/Failed/Unknown；nonterminal->Superseded | array order/external start inference；Unknown->LocallyVerified；external success inferred；old superseded mutation | C03/E04 | `EV-UNIT-620` |
| `TC-SM21-001` plan proposal | Draft->Submitted->Validated->Accepted；preterminal->Rejected/Blocked/Superseded | direct active revision mutation；base mismatch；Accepted=Active | reflection/progress | `EV-UNIT-621` |
| `TC-SM22-001` model input binding | Candidate->Bound；candidate/bound->Blocked/Unknown/Released/Expired | content field/missing binding；digest/version mismatch；Released=provider success；expired reuse | C06 | `EV-UNIT-622` |
| `TC-SM23-001` materialization | Resolving->Resolved/Degraded/Pending/Rejected/Unknown；Resolved->Released/Expired | durable body/log/event；Pending model call；Released=execution；mandatory omission resolved | C06 | `EV-UNIT-623` |
| `TC-SM24-001` reflection | factory->Recorded->Applied；Recorded->Blocked/Manual/Superseded | hidden reasoning/direct plan activation；stale/unknown source Applied；mutate old decision | reflection | `EV-UNIT-624` |
| `TC-SM25-001` runtime wakeup | Pending->Claimed->ConsumedForStep；Claimed->Coalesced/ObservedNoResume/RunTerminal/Quarantined | claim=consume；unknown event dropped；duplicate makes new step；no T3 anchor | event/loop | `EV-UNIT-625` |
| `TC-SM26-001` loop activation | Claimed->Executing->Yielded/Completed；Executing->LeaseLost/Unknown | two active leases/activations；run lifecycle state reuse；continue after lease loss；unbounded budget | loop engine | `EV-UNIT-626` |
| `TC-SM27-001` loop step | Prepared->Invoking->Applied；Invoking->Yielded/ReconciliationRequired/Unknown | two service calls in one step；T2 before T1；current-state rebuild in T3；Unknown success | T1/T2/T3 | `EV-UNIT-627` |
| `TC-SM28-001` local continuation | Pending->Claimed->Consumed；pending/claimed->StaleNoop/Quarantined | continuation grants external retry；stale cursor moves current backward；lease mismatch consume | C14/J04 | `EV-UNIT-628` |
| `TC-SM29-001` hard yield | Open->Resolved/Superseded/Quarantined | self-wakeup spin/time-only resolve；unmatched fact resolve；old yield rewrite | loop engine | `EV-UNIT-629` |
| `TC-SM30-001` operation reservation | Reserved->ResultStored；Reserved->ReconciliationRequired->Released | result without local commit；different digest replay；expiry permits duplicate domain fact；unknown ordinary re-execution | all mutations | `EV-UNIT-630` |
| `TC-SM31-001` action attempt | factory->Recorded->Submitted；Recorded->Rejected/Blocked/Unknown | call before record；`Executed`/cleanup/Sandbox success variants；Unknown new submit/key | internal submit | `EV-UNIT-631` |

## D3. UoW、crash window、replay 与 concurrency cases

| Case | Fault schedule / actors | Required journal oracle | Forbidden result | Planned EV |
|---|---|---|---|---|
| `TC-UOW-001` | fail each write before local commit for single-UoW Commands | reservation/domain/history/outbox/result all committed or none visible；rollback receipt known | partial result/fact/outbox | `EV-FAULT-641` |
| `TC-UOW-002` | UoW-1 known commit, crash before external call | candidate/attempt/binding retained and same step resumable under lease | new identity/candidate or assumed call | `EV-FAULT-642` |
| `TC-UOW-003` | external call accepted/unknown, crash before UoW-2 | same external identity + local fence; next action status-only reconcile | second submit or success inference | `EV-FAULT-643` |
| `TC-UOW-004` | UoW-2 commit unknown after external response | owner status and local commit reconciled independently under same identity | response treated as committed local truth | `EV-FAULT-644` |
| `TC-UOW-005` | inbox fact/receipt/history commit failure/unknown | ACK zero until known commit; unresolved inbox/fence retained | ACK then lost fact; reapply effect blindly | `EV-FAULT-645` |
| `TC-UOW-006` | outbox source fact commit/rollback then publisher retry | outbox snapshot exists iff source UoW committed; exact bytes/ID on replay | regenerate from current truth/receipt as observed | `EV-FAULT-646` |
| `TC-UOW-007` | job page item/report/cursor failure at every boundary | complete page+report+cursor or prior cursor authoritative；same page digest replay | cursor skip/partial current page | `EV-FAULT-647` |
| `TC-REPLAY-001` | Commands same/different digest | exact stored typed result / `IdempotencyConflict` | second fact/call | `EV-FAULT-648` |
| `TC-REPLAY-002` | Events duplicate/collision/late/out-of-order | exact receipt / quarantine / predecessor gap | target reverse-write | `EV-FAULT-649` |
| `TC-REPLAY-003` | Jobs same page/different digest + lease epoch race | exact page report or conflict；one live epoch wins | stale page commit | `EV-FAULT-650` |
| `TC-REPLAY-004` | two writers same aggregate expected version | exactly one CAS winner；loser `VersionConflict`；history sequence contiguous | LWW/merge/two truths | `EV-FAULT-651` |
| `TC-REPLAY-005` | two outcome/handoff/attempt creators | unique run/material/action key produces one owner row | duplicate outcome/effect | `EV-FAULT-652` |
| `TC-REPLAY-006` | reservation retention expiry with permanent uniqueness proof | expired reservation does not permit duplicate domain fact/effect | replay safety dependent only on TTL | `EV-FAULT-653` |

## D4. Error mapping and recovery cases

| Case | Input partition | Exact assertions | Planned EV |
|---|---|---|---|
| `TC-ERR-001` | every `DomainError` variant | deterministic `PublicErrorCode`/operation posture and finite recovery action；correlation+SafeReason only；no raw body/secret/path | `EV-CON-661` |
| `TC-ERR-002` | every `RepositoryError` plus visibility/existence ordering | NotVisible before NotFound；VersionConflict/CursorInvalid/OrderingConflict distinct；Corrupt/Unknown never re-executes mutation | `EV-CON-662` |
| `TC-ERR-003` | `CommitError::Conflict/KnownFailure/Unknown` at pre/post-effect phases | known pre-effect may bounded local retry only where declared；Unknown always fence/reconcile/manual；no success | `EV-FAULT-663` |
| `TC-ERR-004` | every `ExternalBoundaryError` | PendingContract/Unconfigured/Unavailable/Rejected/SchemaMismatch/ScopeMismatch/TimeoutBeforeAcceptance/UnknownAfterSubmission remain distinct；phase-valid call counts | `EV-CON-664` |
| `TC-ERR-005` | all `ConfigError` and `BuildError` variants | stable safe path/category; zero raw input/secret; Invalid/Blocked/Bound exact; no facade on invalid/required blocked | `EV-CON-665` |
| `TC-ERR-006` | late/collision/lease/cursor/stored-result corruption | QuarantineEvent/stop/manual actions exact；no reverse-write/stale commit/re-execution | `EV-FAULT-666` |
| `TC-ERR-007` | recovery vocabulary source scan/service table | every failure selects one of finite recovery actions；bare/unphased retry rejected by static/contract check | `EV-STATIC-667` |

## D5. CFG-T01~CFG-T15 owning cases

| Case / slice | Partitions and operation | Required oracle | Planned EV |
|---|---|---|---|
| `TC-CFG01-001` selector | zero/one/multiple sources；unknown env；normal vs CI/TestFake fixture/assertion | only exactly one allowed source advances V0；no default discovery；locator/body absent from diagnostics | `EV-CFG-671` |
| `TC-CFG02-001` strict document | bounded/unreadable/empty/truncated/non-UTF8；malformed/comment/trailing；duplicates all depths；exact 12 roots；unknown/case/legacy/derived key/null | exact existing ConfigError/stage/safe path；whole reject；no partial typed output or LWW | `EV-CFG-672` |
| `TC-CFG03-001` 153 leaves | per leaf valid type/enum/ref/schema/count/weight/duration/null/array；missing/zero/negative/fraction/overflow/duplicate/boundary | all 153 identities partitioned；exact typed target or error；no coercion/default/clamp/dedupe/owner body | `EV-CFG-673` |
| `TC-CFG04-001` 39 derived | independently vary each source leaf relation; attempt external derived keys | exact 39 semantics assembled and fingerprinted；derived keys externally forbidden；no missing/extra identity | `EV-CFG-674` |
| `TC-CFG05-001` CFG-01~12 | valid and each cross-field relation invalid, including bounds/retention/authority/policy | whole-document reject with stable issues；facade/external call zero；all 12 relations independently covered | `EV-CFG-675` |
| `TC-CFG06-001` 4x4 profile | environment x Api/Worker/Jobs/TestFake, authority/job/fake combinations | exact accept/reject matrix；Api/Worker jobs Disabled；fake only CI/TestFake；no fake leak | `EV-CFG-676` |
| `TC-CFG07-001` 13x5 slots | each canonical key; Disabled/Blocked/Candidate valid tuples + all invalid tuples/owner/schema/blocker/direction/`ready` | 13 identities x 5 leaves exact；Disabled zero calls；Blocked finite negative；Candidate compatibility only；no Sandbox slot/Ready | `EV-CFG-677` |
| `TC-CFG08-001` 7x6 jobs | each job key; activation/blocker/positive bounds/static retry/profile/slot; page > bound; lease/fault/replay | 7 identities x 6 leaves exact；negative no lease/page；fault stops/preserves cursor；operation/retry derived, JSON keys forbidden | `EV-CFG-678` |
| `TC-CFG09-001` secret/security | forbidden keys and secret-shaped value/ref/path/endpoint/route/quota/cost across JSON/snapshot/log/error/event/report | whole reject；zero raw secret/path/body/full sensitive ref；minimal diagnostics; Runtime secret leaf count = 0 | `EV-STATIC-679` |
| `TC-CFG10-001` V0~V12/build | inject failure at each V stage, local dependency missing, slot mismatch, fake forbidden, direction violation, publication conflict | no snapshot before V12；no partial publication/call；Invalid/Blocked/Bound exact；Bound != readiness；constructor I/O zero | `EV-CFG-680` |
| `TC-CFG11-001` capture/by-ref | Command/Query/Event/Continuation/InternalLoop/Job page/replay capture; missing/mismatch historical ref; attempt mid-operation change | one immutable snapshot per operation/page；recorded ref on replay；SnapshotNotFound fail closed before mutation/call/ACK/lease；no recapture | `EV-CFG-681` |
| `TC-CFG12-001` cold change | canonical diff/review; replacement success/failure/Unknown; prior doc rollback revalidation | candidate cannot mutate old/captured truth；old serves only by deployment-owner fact；Unknown manual/reconcile；rollback is new cold attempt | `EV-CFG-682` |
| `TC-CFG13-001` CF-A01~18 | execute each startup/config failure A01 through A18 at its first stage | fail-fast/no facade/no external effect；safe body-free signal only；exact recovery ceiling; all 18 identities | `EV-CFG-683` |
| `TC-CFG14-001` CF-B01~18 | under valid snapshot inject each runtime dependency/fault B01 through B18 | path-specific Blocked/Waiting/Degraded/Unknown; exact zero-call/status-only/cursor/fence rules；all 18 identities | `EV-FAULT-684` |
| `TC-CFG15-001` blockers | for `L2R-UP-001~008`, CP-001, ENTRY-001, IMPL-001 try fake/design/ping/ref/candidate/Bound as proof | all 11 remain open/blocked until formal closure+real qualification；zero positive EV/readiness/pass | `EV-STATIC-685` |

## D6. Observation, redaction and truth-state cases

| Case | Operation / material | Assertions | Planned EV |
|---|---|---|---|
| `TC-OBS-001` | construct `RuntimeObservation` for every phase/disposition/gap/recovery | allowed low-cardinality phase/ref/status/error-category fields only; correlation retained | `EV-UNIT-691` |
| `TC-OBS-002` | inject hidden reasoning, raw model/tool/Sandbox/Artifact/report body and high-cardinality user/provider values | redaction before serialization；forbidden values absent from object bytes/log/error/event/report | `EV-STATIC-692` |
| `TC-OBS-003` | observation/event handoff Accepted/Rejected/Unknown | only local candidate/attempt/gap changes；domain truth unchanged；never Observed/evidence/readiness | `EV-FAULT-693` |
| `TC-SEC-001` | scan all persistence write payloads and outbox snapshots | no secret/raw external body/hidden reasoning/capture/Artifact/Evidence body | `EV-STATIC-694` |
| `TC-SEC-002` | scan all public/query/error/report candidate serialization | body-free safe refs/fingerprints only；no endpoint/route/credential/full sensitive ref | `EV-STATIC-695` |
| `TC-SEC-003` | attempt owner write through Ports/repositories/source graph | no external owner mutation trait/method; spy owner state unchanged | `EV-STATIC-696` |
| `TC-TRUTH-001` | feed planned/fake/blocked/not_run/raw result into report/evidence status mapper | exact status retained; cannot map to pass/positive_qualified/ready/accepted | `EV-STATIC-697` |
| `TC-SOURCE-001` | validate requirement/design/CUT/TC/EV source manifest | every canonical identity resolves current formal source; historical alias rejected | `EV-STATIC-698` |

## D7. Annex 停审

| Denominator | Result |
|---|---|
| states | 31/31 independent parameterized owning cases |
| every state legal/nonlisted/stale/replay/unknown rules | mandatory harness contract |
| UoW/crash cases | 7/7 critical windows |
| replay/concurrency cases | 6/6 identity/race families |
| error/recovery cases | 7/7 layer/phase families |
| config slices | 15/15；includes 12/153/39/13x5/7x6/V0~V12/CF-A/B/11 blockers |
| observation/security/source truth | 8/8 redline families |
| physical DB/broker/scheduler qualification | blocked/not claimed |
| actual execution/evidence | none |
