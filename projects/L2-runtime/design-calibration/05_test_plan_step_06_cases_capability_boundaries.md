# L2-runtime Step 6 Annex A：能力、Loop、外部边界与入口用例

> Parent：`05_test_plan_step_06_cases.md`
> 正式来源：`03-详细设计.md` §§3~6、8、13~15；`04-配置设计.md` §§6~12
> 状态：`completed_as_step_06_annex`
> 统一约束：所有 TC/EV 均为 planned identity；未执行、未生成证据

## A1. 通用执行模板

每个表中“操作/故障”按以下固定步骤落成自动化用例：

```text
1. 用 Step 7 fixture builder 创建明确 scope/version/digest/clock/ID。
2. 配置 fault-capable local store 与 finite spy/BlockedAdapter。
3. 调用且只调用该行 owning domain/service/entry surface。
4. 同时断言 result、canonical state、write journal、Port call journal、history/outbox。
5. 对 replay 使用相同 identity+digest；对 collision 使用相同 identity+不同 digest。
6. 对 unknown 保留 fence/reconcile ref，并断言普通 retry 的 external call count = 0。
```

任何 fake accepted 只说明 Runtime 分支正确；`positive_qualified=false` 必须保留。

## A2. CAP-01~CAP-12 owning cases

| Case | CUT / design | 前置与输入 | 操作 / 故障变体 | 必须断言 | Planned EV |
|---|---|---|---|---|---|
| `TC-CAP01-001` | CUT-01；CAP-01 | fixed clock/ID/digest；valid typed actor/scope/ref/metadata | 构造全部 shared IDs、refs、correlation、digest、SafeReason、envelope；逐项 missing/malformed/cross-scope/body-bearing | valid round-trip stable；missing/mismatch -> typed error；digest preimage body-free；error/public serialization 无 body/secret | `EV-UNIT-401` |
| `TC-CAP02-001` | CUT-03/04；CAP-02 | formal trigger + source/Governance scripted views | accept；然后对 missing/conflict/stale/denied/pending/unknown 分别调用 admission | Accepted 同 UoW 生成 decision+run+workspace+history/outbox/result；每个 negative 只有 decision/result，无 run/workspace；replay exact | `EV-SVC-402` |
| `TC-CAP02-002` | CUT-04；CAP-02 control | Active/Paused/Unknown/Terminal run fixtures + matching versions | pause/resume/cancel；resume with Prepared/CommitUnknown；stale CAS；terminal rewrite | only valid edges；resume requires Committed+closed fence；unknown/stale zero illegal mutation；terminal immutable；history append-only | `EV-SVC-403` |
| `TC-CAP03-001` | CUT-05；CAP-03 | accepted run/workspace、body-free definition refs、valid graph | initialize/evaluate/incorporate fact；invalid cycle/missing dep/base conflict | revision validated then workspace CAS activation；Accepted proposal != Active；missing -> Waiting/Blocked；no Work/Process/Method body/write | `EV-SVC-404` |
| `TC-CAP04-001` | CUT-06/20；CAP-04 | candidates with owner/scope/version/freshness/weight; frozen policy snapshot | compose under exact precedence/budget；optional omit；mandatory stale/unknown/body-bearing；same inputs shuffled | output ordering/digest deterministic；selected+excluded exhaustive；mandatory gap blocks/degrades；memory-use record per considered candidate；context freeze; no source write | `EV-SVC-405` |
| `TC-CAP05-001` | CUT-07；CAP-05 | Open working window + candidate/use refs | add/use/replay/compact；frozen/degraded/unknown window；commit unknown | unique run+candidate+decision use；working-only truth；known compaction creates new authoritative window atomically；unknown keeps old window; no durable delete/write | `EV-SVC-406` |
| `TC-CAP06-001` | CUT-08/09；CAP-06 | frozen context、intent、materializer/model finite spies | bind/materialize/submit/classify；pending/unavailable/unknown/mismatch/late/raw body | UoW-1 intent/binding/turn before one call；stable digests；finite `ModelSemanticDisposition`；UoW-2 matching refs；unknown fence/no resubmit；safe summary only | `EV-SVC-407` |
| `TC-CAP07-001` | CUT-10；CAP-07 guard | Proposed action + five owner views + checked versions | all allowed；each view missing/stale/denied/pending/unknown；version changes after guard | Allowed only with all required current views；negative -> Waiting/Blocked/Unknown；zero `InvocationCallerPort` calls；choice never Submitted/Executed | `EV-SVC-408` |
| `TC-CAP07-002` | CUT-11/31；CAP-07 submit | guarded action + unique operation identity + invocation spy | submit Accepted/Rejected/PendingContract/Unavailable/Unknown；commit fault before/after call；replay/collision | attempt+marker committed before exactly one call；finite local posture, never Executed；unknown retains fence and same identity status-only reconcile；no direct Sandbox call | `EV-FAULT-409` |
| `TC-CAP08-001` | CUT-12；CAP-08 | parent run/action/scope/context boundary/budget | valid proposal/result incorporation；scope escape、mutable allow-list、depth/action/context/duration overflow、duplicate/late child result | strict containment and immutable boundary digest；local record before child call；one incorporation；child result not parent outcome；no member/container/image fields | `EV-SVC-410` |
| `TC-CAP09-001` | CUT-13；CAP-09 | marker + ordered normalized feedback envelopes | apply/record-only/duplicate/late/out-of-order/mismatch/collision/unknown | only Apply changes marker/progress；receipt+fact commit before ACK；duplicate exact receipt；collision quarantine；late no outcome rewrite | `EV-FAULT-411` |
| `TC-CAP09-002` | CUT-14；CAP-09 reflection | committed fact anchors + prior turn/decision/source versions | create/apply reflection；uncommitted/stale/unknown source；superseding reflection | new immutable reflection/proposal/decision refs；prior turn/history/source unchanged；blocked/manual explicit；no hidden reasoning/body | `EV-SVC-412` |
| `TC-CAP10-001` | CUT-15/16；CAP-10 | consistent run/workspace/memory/context/history anchors + effects | prepare; commit matching/mismatch/reject/unknown; recover each disposition | Prepared != stable；only matching physical receipt -> Committed；unknown fence; Resume/Restart only Committed+closed fence；no blind external retry | `EV-FAULT-413` |
| `TC-CAP11-001` | CUT-17；CAP-11 | terminal progress proof + closed/open effect fence | finalize every outcome disposition；duplicate/concurrent finalize；downstream ACK after commit | one immutable local outcome/run Terminal atomically；open/unknown cannot claim success；replay exact；handoff/ACK/observed cannot mutate outcome | `EV-SVC-414` |
| `TC-CAP12-001` | CUT-18/19；CAP-12 | committed outcome + safe refs + target + projection history cursor | build/submit/reconcile handoff；rebuild projection；pending/unknown/late ACK/history gap/store fault | body-free stable material/digest；attempt/gap local-first；ACK only matching gap；projection from contiguous committed history, no domain write; no delivered/observed/acceptance claim | `EV-FAULT-415` |

## A3. Runtime loop cases

| Case | 前置 | 操作 / 故障 | 断言 | Planned EV |
|---|---|---|---|---|
| `TC-LOOP-001` | one eligible run, live lease, fixed activation/step budget | execute activation with one eligible operation | exactly one service call in T2；T1 reservation precedes T2；T3 result/cursor/history after call；activation yields/completes within bound | `EV-SVC-420` |
| `TC-LOOP-002` | two eligible operations | execute one activation/step | deterministic selector chooses one；second remains eligible；no multi-service step or current-state rebuild | `EV-UNIT-421` |
| `TC-LOOP-003` | no eligible progress, pending wake/continuation variants | repeat activation | no self-wakeup spin；explicit HardYield/no-progress disposition；only matching wake/continuation may reopen | `EV-UNIT-422` |
| `TC-LOOP-004` | claimed activation/step | lose/expire lease before T2 and before T3 in separate variants | service zero-call if lost pre-T2；post-call ambiguity -> Unknown/ReconciliationRequired；stale epoch cannot write cursor/result | `EV-FAULT-423` |
| `TC-LOOP-005` | stored reservation/result, duplicate wakeups | replay same identity+digest then collision digest | exact result replay and wake coalescing；collision quarantine；no second domain fact or external call | `EV-FAULT-424` |
| `TC-LOOP-006` | wait/block/external-unknown service result | execute T3 | explicit Yielded/ReconciliationRequired/Unknown + continuation/fence as applicable；never implicit success or immediate blind retry | `EV-FAULT-425` |

## A4. External slot numbering and negative/blocked cases

Canonical numbering is fixed here and reused by every later Step:

| No. | Slot key / Port | Owning case | Scripted input | Required assertions | Planned EV | Positive lane |
|---:|---|---|---|---|---|---|
| 01 | `governance` / `GovernancePreconditionPort` | `TC-SLOT01-001` | Disabled/Blocked/Candidate; denied/pending/unknown/stale/current view | no local approval/policy write；negative guard fail closed；exact scope/version/freshness；Disabled zero call | `EV-CON-446` | blocked by owner/implementation qualification |
| 02 | `definition_resolver` / `DefinitionResolverPort` | `TC-SLOT02-001` | body-free ref/version; missing/stale/pending | returns reference view only；plan Waiting/Blocked；Method/Role/Process body absent；no source mutation | `EV-CON-447` | blocked by `L2R-UP-008/IMPL` |
| 03 | `source_resolver` / `SourceResolverPort` | `TC-SLOT03-001` | available/partial/stale/pending/unavailable/unknown + wrong owner/version | finite availability/completeness；body-free snapshot marker；negative mandatory use closed；no readiness inference | `EV-CON-448` | blocked by `L2R-UP-006/008/IMPL` |
| 04 | `durable_memory` / `MemoryRetrievalPort` | `TC-SLOT04-001` | bounded candidate page; disabled/blocked/unavailable/unknown | working-only fallback explicitly non-equivalent；candidate/ref only；no durable body/index/retention/delete/write | `EV-CON-449` | blocked by `L2R-UP-005/IMPL` |
| 05 | `capability_exposure` / `CapabilityExposurePort` | `TC-SLOT05-001` | compatible/incompatible/pending/unknown descriptor view | identity/exposure/descriptor read only；no registry/adapter truth write；negative action guard closed | `EV-CON-450` | blocked by Hub/implementation qualification |
| 06 | `invocation_caller` / `InvocationCallerPort` | `TC-SLOT06-001` | Accepted/Rejected/PendingContract/Unavailable/Unknown | exactly one call after attempt commit；normalized refs only；no Executed/cleanup/Sandbox truth；unknown status-only | `EV-CON-451` | blocked by `L2R-UP-001/003/007` |
| 07 | `model_context_materializer` / `ModelContextMaterializerPort` | `TC-SLOT07-001` | resolved/degraded/pending/rejected/unknown; unsafe body | ephemeral material only；binding/digest match；released/expired not success；pending zero model call | `EV-CON-452` | blocked by `L2R-UP-004/006` |
| 08 | `model_decision` / `ModelDecisionPort` | `TC-SLOT08-001` | finite semantic ref outcomes + unavailable/unknown/mismatch | provider-neutral result refs；no route/secret/quota/cost/raw body；late/unknown no overwrite/resubmit | `EV-CON-453` | blocked by `L2R-UP-004/IMPL` |
| 09 | `child_runtime` / `ChildRuntimePort` | `TC-SLOT09-001` | accepted/result/failure/wait/unknown; scope mismatch | strict parent boundary；call after local record；once-only result；no member/container/image lifecycle | `EV-CON-454` | blocked by `L2R-ENTRY-001/IMPL` |
| 10 | `checkpoint_commit` / `CheckpointCommitPort` | `TC-SLOT10-001` | matching/mismatching receipt, reject, pending/unknown | matching digest/ref only commits；unknown fence/reconcile same identity；repository save/fake not durability proof | `EV-CON-455` | blocked by `L2R-CP-001/IMPL` |
| 11 | `handoff_submission` / `HandoffSubmissionPort` | `TC-SLOT11-001` | accepted/refused/pending/unknown + matching/mismatch ACK | attempt before call；gap retained；matching verified ACK only；no delivery/observed/acceptance promotion | `EV-CON-456` | blocked by `L2R-UP-002/007` |
| 12 | `event_publisher` / `EventPublisherPort` | `TC-SLOT12-001` | accepted/rejected/unknown receipt for stored snapshot | exact event ID/digest/payload replay；unknown cursor retained；receipt != delivered/observed；no payload rebuild | `EV-CON-457` | blocked by `L2R-UP-006/007` |
| 13 | `projection_store` / `ProjectionStorePort` | `TC-SLOT13-001` | Empty/Current/Stale/Rebuilding/Degraded/Unknown + CAS/gap | contiguous watermark required for Current；history-only writes；store cannot mutate/authorize domain | `EV-CON-458` | blocked by `L2R-UP-006/007` |

Slot tuple variants required for every row:

```text
Disabled + Optional + null/null/null        -> valid, zero Port/fake call
Blocked + Required/Optional + null/null/B   -> valid negative posture
Blocked + Required/Optional + ref/schema/B  -> valid negative posture
Candidate + Required/Optional + ref/schema/null -> compatibility only
all other tuples, any activation=ready      -> ConfigError, no Runtime facade
```

Candidate/Bound never means positive-ready. `TC-QUAL-SLOT01~13` may be declared only as `blocked_dependency/not_runnable` until owner contract, real adapter/profile, implementation, environment and independent evidence all exist.

## A5. Local Port, entry and dependency boundary cases

| Case | CUT | 操作 / 故障 | Exact assertions | Planned EV |
|---|---|---|---|---|
| `TC-LPORT-001` | 29 | invoke each Clock/ID/Digest/ConfigSnapshot method with fixed inputs | deterministic output; typed error; body-free digest; operation/page captures one immutable snapshot | `EV-CON-430` |
| `TC-LPORT-002` | 29/31 | repository mutation with expected version/scope/UoW; stale and commit unknown | no generic save/LWW; stale -> `VersionConflict`; unknown -> typed fence; journal has no partial public result | `EV-FAULT-431` |
| `TC-LPORT-003` | 29/32 | inbox/outbox/history/lease/cursor same/different digest and epoch variants | exact uniqueness/collision/append sequence/immutable snapshot/stale lease rules | `EV-FAULT-432` |
| `TC-ENTRY-001` | 37 | Api dispatch every Command/Query envelope under allowed/forbidden authority | facade dispatch only；authority before existence；no direct repository/adapter I/O；public errors redacted | `EV-ENTRY-433` |
| `TC-ENTRY-002` | 23/37 | Worker consumes every inbound event with commit/commit-unknown fault | receipt committed before ACK；unknown no ACK；duplicate exact receipt；collision quarantine | `EV-ENTRY-434` |
| `TC-ENTRY-003` | 25/37 | Jobs facade dispatch each J01~J07 under Jobs/Api/Worker/TestFake profiles | only Jobs/TestFake Candidate allowed；Api/Worker all jobs Disabled；lease/page bounds enforced | `EV-ENTRY-435` |
| `TC-ENTRY-004` | 37 | build TestFake and non-test entry profiles with fake registry | finite fake only in CI/TestFake；production/API/Worker/Jobs reject fake binding/leak | `EV-STATIC-436` |
| `TC-DEP-001` | 37 | inspect planned manifest/source dependency graph and forbidden imports | only `L0-core` may be compile candidate；all sibling relations runtime/event/ref/adapter/fake；no provider/Sandbox/member/marketplace/Obs backend packages | `EV-STATIC-437` |
| `TC-BOUND-001` | 20/30/36/37 | spy all external owner surfaces during local mutations | zero external owner write; only typed read/submit seam calls declared by Flow | `EV-STATIC-438` |
| `TC-BOUND-002` | 06/07/17~19 | feed candidate/snapshot/projection/receipt/summary/report as if truth | typed rejection/negative posture; no local owner state promotion | `EV-SVC-439` |
| `TC-BOUND-003` | 08/09/30 | inject provider name/route/endpoint/secret/quota/cost fields | closed-schema rejection or absent field at compile/source check; no physical route inference | `EV-STATIC-440` |
| `TC-BOUND-004` | 10/11/30/37 | Sandbox-required action with missing/unknown guards and legacy direct route | Blocked/Unknown; `InvocationCallerPort` zero if guard fails; direct Sandbox adapter zero external calls + `DirectSandboxForbidden` | `EV-FAULT-441` |
| `TC-BOUND-005` | 12/37 | child scope expansion/shared mutable context/member lifecycle payload | validation rejection; no delegation/child call; forbidden fields absent | `EV-STATIC-442` |
| `TC-BOUND-006` | 10~12/30 | attempt Runtime writes to Tools/Governance/Hub/Sandbox truth | trait/source graph has no write methods; scripted views remain unchanged | `EV-STATIC-443` |
| `TC-BOUND-007` | 17~19/24 | apply ACK/receipt/Observed/report/downstream summary after local outcome | local outcome/checkpoint/run unchanged; only matching local attempt/gap/projection fact may change | `EV-FAULT-444` |
| `TC-BOUND-008` | 30/35/37 | build each open blocker with design file/ping/fake/candidate ref as proof | remains Blocked/Invalid/Candidate; no Ready/readiness/pass state; zero positive EV | `EV-STATIC-445` |

## A6. Annex 停审

| 分母 | 结果 |
|---|---|
| CAP identities | 12/12 owning cases |
| loop semantic cases | 6/6 risk families |
| external slots | 13/13 exact numbered negative/blocked cases |
| slot evidence identity | 13/13 independent planned EV slots (`EV-CON-446~458`) |
| entry profiles | Api/Worker/Jobs/TestFake all covered |
| VF owner/fail-open/fake/dependency directions | covered by BOUND/ENTRY/DEP cases |
| real positive results | 0; all 13 qualification candidates blocked |
| unresolved phase conflict | 0 |
