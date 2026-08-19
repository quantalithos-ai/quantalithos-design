# L2-runtime Step 6 Annex B：Commands C01~C17 用例

> Parent：`05_test_plan_step_06_cases.md`
> 正式来源：`03-详细设计.md` §§7.1~7.2、8.1~8.2、9~12
> 状态：`completed_as_step_06_annex`
> 每个 row 是独立 owning case；CAP/State/UoW case 只能作为 companion，不能替代 Command identity

## B1. Command 通用断言

所有 C01~C17 base case 均执行以下四个共享变体，并保留该 Command 的独立 raw result：

| Variant | 操作 | 统一断言 |
|---|---|---|
| valid | valid `CommandMetadata` + exact command payload | typed result envelope；declared write set only；public error absent |
| replay | same `OperationIdentity + request_digest` | exact stored result ref/payload；零第二 domain fact、outbox snapshot、external call |
| collision | same identity + different digest | `IdempotencyConflict`/typed conflict；零 domain mutation/call |
| commit unknown | fault at declared local commit | no successful public result；reservation/fence/reconciliation posture retained；ordinary retry cannot duplicate truth/effect |

Malformed metadata、authority/scope mismatch、forbidden body、unknown enum/schema 必须在 UoW 与 Port call 前拒绝。所有 expected-version stale 变体返回 typed version conflict 且 write/call journal 为空。

## B2. C01~C17 可执行用例矩阵

| Case / Command | 前置条件 | 输入 / 操作与关键负向 | Expected result / state | Write and call assertions | Planned EV |
|---|---|---|---|---|---|
| `TC-C01-001` `AcceptRuntimeTrigger` | source/Governance finite views；fixed IDs | valid formal scope+nonempty goals；missing goal/source、scope conflict、source stale/pending、Governance denied/unknown | valid -> `AdmissionDisposition::Accepted` with run/workspace refs；negative -> explicit rejected/waiting/blocked/unknown and both refs absent | reservation+admission+(optional run/workspace)+history+outbox+stored result one UoW；negative no run creation；source then Governance call order only when required | `EV-SVC-451` |
| `TC-C02-001` `ApplyRuntimeControl` | Active/Paused/Unknown/Terminal run variants；checkpoint/effect fixtures | pause/resume/cancel；resume with Prepared/CommitUnknown/open fence；stale run version；terminal mutation | exact `ControlDisposition` and `ControlledRunState` legal edge；resume only from Committed+closed fence；terminal exact replay only | run/control/history/outbox/result atomic；no external cleanup call；invalid/stale has zero writes | `EV-SVC-452` |
| `TC-C03-001` `EvaluateRunProgress` | consistent run/workspace/revision/item heads | ready next item、missing dependency、invalid graph、terminal proof absent、effect fence open、base revision conflict | finite `PlanEvaluationDisposition`; next refs only for eligible items；waiting/blocked do not finalize；terminal only with proof | progress/revision/item/workspace/run/history/wakeup/outbox/result exactly per disposition；no external completion inference | `EV-SVC-453` |
| `TC-C04-001` `ComposeWorkingContext` | source/retrieval page/window + frozen config snapshot | complete composition；optional omission；mandatory missing/stale/unknown；budget edge exact/exceed；candidate order shuffle | context ref only when allowed；deterministic selected/excluded refs and digest；`Partial` only optional omission；mandatory gap Blocked/Degraded | context+every considered memory-use+window/history/outbox/result atomic；no durable write；source calls bounded by candidate set | `EV-SVC-454` |
| `TC-C05-001` `RecordWorkingMemory` | Open window expected version | valid candidate；same candidate/decision replay；frozen/degraded/unknown window；wrong scope/stale candidate；CAS conflict | valid returns entry/use refs + next version；negative explicit disposition/error with no accepted entry | window+entry+use+history+result one UoW；uniqueness `(run,candidate,decision)`；zero durable owner call | `EV-SVC-455` |
| `TC-C06-001` `StartModelTurn` | frozen context、valid intent、materializer/model spies | resolved submit; context Assembled/Expired; materializer degraded/pending/rejected/unknown; model rejected/unavailable/unknown; digest mismatch | body-free binding before submission；turn transitions only through canonical states；pending zero model call；unknown fence, no automatic new submission | UoW-1 intent/binding/turn candidate before at most one model call；UoW-2 matching submission/posture；raw material never persisted | `EV-FAULT-456` |
| `TC-C07-001` `ClassifyModelResult` | submitted turn + matching semantic result ref | each finite semantic disposition；refusal/timeout/unavailable/unknown/mismatch；duplicate/late/out-of-order/raw body | matching -> decision+safe summary+Classified；duplicate exact result；late/mismatch quarantine；raw rejected | turn/decision/summary/history/outbox/result atomic；no provider call/write；prior/newer decision unchanged on late | `EV-SVC-457` |
| `TC-C08-001` `ProposeAction` | committed model decision permitting candidate class | no-action/tool/child/wait/reject/escalation candidates；model disposition forbids; target/scope/digest/budget mismatch; superseded | only a local `ActionDecisionState::Proposed`/explicit negative; never Guarded/Submitted/Executed | action/history/outbox/result one UoW；Governance/Hub/Tools/Sandbox/model call counts all zero | `EV-SVC-458` |
| `TC-C09-001` `EvaluateActionPreconditions` | Proposed action + independent owner views | all current Allowed；each Governance/Capability/Tool/isolation/source view denied/missing/stale/pending/unknown；version changes during attach | Allowed guard only if all required current and unchanged；else Waiting/Blocked/Unknown；checked version set exact | guard/action/history/outbox/result atomic；no invocation call；direct Sandbox route is invalid/blocked | `EV-SVC-459` |
| `TC-C10-001` `ProposeDelegation` | parent run/action/context + enabled bounded policy | strict child subset valid；equal/superset scope、mutable boundary、depth/turn/action/context/duration overflow、missing goals | valid local delegation/candidate with stable boundary digest；negative rejected/blocked；no child-running claim | delegation/candidate/history/outbox/result committed before any later child call；this Command calls child Port zero times | `EV-SVC-460` |
| `TC-C11-001` `IncorporateActionFeedback` | marker/action/submission + inbox/order anchor | new matching Apply；record-only；duplicate；same ID different digest；late/out-of-order/mismatch/unknown | exact `FeedbackIncorporationDisposition`; only Apply transitions marker/progress；collision quarantine；outcome unchanged | inbox+feedback+(conditional marker/progress)+history/outbox/result commit together；ACK only after known commit | `EV-FAULT-461` |
| `TC-C12-001` `PrepareRuntimeCheckpoint` | consistent expected-version set for run/workspace/memory/context/history/effects | stable candidate valid；inconsistent head、digest mismatch、unresolved effect、forbidden material、local commit unknown | valid `RuntimeCheckpointState::Prepared`; never Committed/resumable；negative typed error/Unknown posture | checkpoint Preparing->Prepared + history/outbox/result local only；`CheckpointCommitPort` call count zero | `EV-SVC-462` |
| `TC-C13-001` `CommitRuntimeCheckpoint` | Prepared checkpoint + fixed request digest/version | matching receipt；mismatch/refusal/pending/unknown；duplicate; reconcile same/different identity | only matching receipt -> Committed + commit_ref；reject -> Invalid/Blocked；unknown -> CommitUnknown/fence | CommitPending local marker before one Port call；status/history/result after；outbox only proven Committed；no resume side effect | `EV-FAULT-463` |
| `TC-C14-001` `RequestRecoveryDecision` | run/checkpoint/effect/source/prior decisions | every finite requested mode；Committed+closed fence；Prepared/Unknown/open fence/no stable point；lease loss | Resume/Restart only eligible proof；otherwise ReconcileOnly/WaitForFact/Blocked/Cancel/ManualReview；decision immutable | decision/history/outbox/result append；continuation only local eligible；no external submit/retry | `EV-SVC-464` |
| `TC-C15-001` `FinalizeRuntimeOutcome` | run + terminal progress + effect fence | each `RuntimeOutcomeState`; nonterminal、open/unknown fence、unsafe result ref、concurrent duplicate/different outcome | exactly one immutable outcome；Succeeded/Partial require proof；run Terminal same UoW；duplicate exact replay, conflict rejects | outcome/run/history/outbox/result atomic；handoff/publisher/Obs/Artifact calls zero；downstream fields absent | `EV-SVC-465` |
| `TC-C16-001` `CreateHandoffCandidate` | committed outcome + safe refs + target/redaction policy | valid; outcome missing; forbidden body; target/scope mismatch; route pending/unknown | body-free material + stable digest + Candidate/Blocked local attempt and optional gap；no Delivered/Observed/Accepted | material/attempt/gap/history/outbox/result one UoW；this Command makes no submission call；local outcome unchanged | `EV-SVC-466` |
| `TC-C17-001` `CaptureSourceSnapshot` | source ref + resolver finite results | complete/partial/metadata-only/rejected/pending/stale/unavailable/unknown；authority/version mismatch；body-bearing response | exact `SourceAvailabilityState` + `SnapshotCompleteness`; pending/unknown never Available/readiness；body rejected | snapshot metadata/availability marker/history/outbox/result atomic；no owner body stored/write; commit unknown no positive marker | `EV-FAULT-467` |

## B3. Command 闭环与 phase 审计

| 审计项 | 结果 |
|---|---|
| C01~C17 identity | 17/17 independent base case |
| valid + replay + collision + commit-unknown | required for all 17 |
| expected-version/CAS negatives | all mutation surfaces where applicable |
| C06/C13 external two-UoW ordering | explicit |
| C08/C10/C12/C16 no-premature-call boundary | explicit zero-call |
| C11 ACK-before-commit risk | explicit prohibited |
| result/state names | canonical 03 carriers only |
| later phase promoted early | none |
| actual execution/evidence | none |
