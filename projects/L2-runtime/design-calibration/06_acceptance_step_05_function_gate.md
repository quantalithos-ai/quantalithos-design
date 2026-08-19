# L2-runtime 06 验收标准 Step 5：功能验收门禁

> 对应 SOP：`standards/document/验收标准讨论流程_SOP.md` Step 5
> 回填位置：正式 `06-验收标准.md` §5
> 状态：`completed_continuous_authorized`
> 输入：formal 00 AC001~020、formal 03 CAP/Flow/SM/UoW、formal 05 canonical 177 registry
> 事实边界：本 Step 定义 future P0 functional decision contract；所有 EV 均为 planned identity，当前无 actual disposition

## 1. 本步目标与 authority

功能验收唯一主语是 `AC-L2R-001~020`：001~005 是五个跨能力聚合闭环，006~020 是 20 个核心 FR 的明细裁决。每个 AC 必须闭环到正式设计对象/Flow、`05_test_plan_step_13_evidence_registry.md` 中全部 mapped TC/EV、同 run report 和明确裁决影响。

Registry 是 mapping authority，不是 evidence。本文列出的 TC/EV 集合必须与 registry 精确相等；不得只挑代表 case、只看 aggregate、按前缀推断或借 G1 SLOT case 证明 G2/G3 positive qualification。

## 2. Common functional decision contract

```text
functional_ac_pass(AC) :=
  AC belongs to formal AC-L2R-001..020
  AND every registry row mapped to AC exists in one valid fixed G1 run
  AND each row has eligible raw artifact + owning suite report + EV detail
  AND all declared valid/negative/replay/fault/unknown variants satisfy exact oracle
  AND state/result/write/call/phase/idempotency assertions all pass
  AND every mapped applicable VF is not_triggered
  AND no blocked/fake/planned/aggregate/ACK/receipt is promoted beyond its phase

functional_ac_failed(AC) :=
  eligible evidence proves any required oracle false
  OR any required mapped row/variant is failed, missing, invalid or ineligible
  OR a mapped applicable VF is triggered
```

`not_evaluable` is used only when the acceptance package cannot validly decide the AC; it is not pass and cannot support pass/conditional pass for an applicable P0 AC. Every row additionally resolves through:

```text
reports/runs/<run_id>/evidence/<evidence_id>.md
reports/runs/<run_id>/suites/<owning_suite>.md
artifacts/test/<run_id>/suites/<owning_suite>/cases/<case_id>.json
```

## 3. Five aggregate functional loops

| AC | Formal design contract | G1 pass condition | Failure condition / positive ceiling | Mapped rows | Decision impact |
|---|---|---|---|---:|---|
| `AC-L2R-001` | C1；CAP-02/03；Loop kernel；Admission/ControlledRun/GoalPlanWorkspace；SM01~03/19/20 | formal trigger 经 authority/source/scope 校验原子建立 admission、run、workspace；goal/plan 可进行一个有界 T1/T2/T3 step；invalid/missing/conflict 只拒绝/等待且 zero unauthorized run | 无主体/scope/source 创建 run；跨 step 多调用；hard-yield 自旋；aggregate 缺 child。只裁 local loop，不裁 product scheduler | 11 | P0 fail；owner/source transfer 可触发 VF |
| `AC-L2R-002` | C2；CAP-04/05；Context/WorkingMemory；source/memory mediation；SM04/05/15/22/23 | 按 owner/ref/scope/freshness/budget 决定 selected/excluded/order/digest 并 freeze；working memory use/compaction 有版本与原子性；mandatory gap 显式 Blocked/Degraded | source/body/candidate 被当 truth；mandatory stale 仍 Frozen；working fallback 冒充 durable write/readiness。真实 durable owner 另走 G3 slot04 | 8 | P0 fail；owner/body leak 可触发 VF |
| `AC-L2R-003` | C3；CAP-06；ModelIntent/Binding/Turn/Decision/SafeSummary；SM06/17/22/23 | provider-neutral intent/context binding 先于最多一次 call；finite result/refusal/timeout/unavailable/unknown/mismatch 精确分类；safe summary body-free | provider route/secret/raw body/hidden reasoning进入 truth；Unknown resubmit；result mismatch覆盖 turn。真实 provider/model quality 另走 G2/G3 | 8 | P0 fail；secret/body/unknown promotion 可触发 VF |
| `AC-L2R-004` | C4；CAP-07/08/09；Action/Guard/Attempt/Delegation/Feedback；SM07~10/31 | choice 分为 no-action/Tool/child/wait/reject；五 owner guard 全 current 才允许 candidate；attempt before call；child strict subset；feedback once | choice=executed；default allow/host fallback；scope expansion；late/duplicate 二次应用。Tools/Sandbox/child real execution 另行 qualification | 15 | P0 fail；fail-open/owner takeover/unknown retry 可触发 VF |
| `AC-L2R-005` | C5；CAP-09~12；Checkpoint/Recovery/Reflection/Outcome/Handoff；SM11~14/21/24 | stable facts + closed fence 形成 Prepared/Committed 分层、finite recovery/reflection、新 immutable outcome、body-free handoff candidate/gap/projection | Prepared=Committed；unknown blind retry；second outcome；ACK/delivery/Observed反写 local truth。physical durability/delivery/Observed 另行 qualification | 16 | P0 fail；unknown/status promotion 可触发 VF |

Aggregate `TC-E2E-001~005` 只从同一 run 的完整 child raw result 派生，不执行新业务流。任一 child missing/failed/blocked/infra/invalid/cancelled 都使 aggregate non-pass；aggregate pass 也不能替代本表 mapped raw rows。

## 4. Detailed functional gates AC006~020

### 4.1 Admission, run, goal and plan

| AC | Formal design / requirement | Pass condition | Failure condition | Rows | Positive/non-scope ceiling |
|---|---|---|---|---:|---|
| `AC-L2R-006` | FR001；CAP-02；`AcceptRuntimeTrigger`；AdmissionDecision/ControlledRun；SM01 | formal actor/scope/goal source、authority-before-existence、idempotency 全成立才原子创建 run/workspace；匿名、cross-scope、denied/pending/unknown 零 run | 非法输入进入 Active；visibility/authority 顺序反转；same-key different digest不冲突；entry直写 repo | 5 | 不证明 member/product entry readiness |
| `AC-L2R-007` | FR002/003；CAP-03；`EvaluateRunProgress/GetGoalPlan/ResumeEligibleRuns`；SM03/19/20/26/27/29 | plan revision validation/CAS activation、dependency eligibility、Waiting/Blocked/Unknown/hard-yield、查询和恢复均显式；one bounded loop operation | Accepted直接等于Active；array order推进；外部完成推导 local progress；spin；stale epoch写入；Method/Process truth反写 | 16 | 只裁 goal/plan working truth，不裁 Work/Process completion |
| `AC-L2R-008` | FR004；CAP-02/03；run/control/loop states；`GetRunStatus` | Active/Waiting/Blocked/Paused/Cancelled/Completed/Failed/Unknown 和 terminal immutability 可区分；resume需 Committed+closed fence；query no-write | Unknown压平成 success/failure；terminal重开；ACK/lease改变 run；Prepared resume；hidden existence leak | 10 | 不证明 scheduler/entry product readiness |

### 4.2 Context and memory

| AC | Formal design / requirement | Pass condition | Failure condition | Rows | Positive/non-scope ceiling |
|---|---|---|---|---:|---|
| `AC-L2R-009` | FR005/006；CAP-04；`CaptureSourceSnapshot/ComposeWorkingContext/GetWorkingContext/RefreshSourceSnapshots`；SM04/15 | 每 source 有 owner/scope/version/freshness/completeness/ref；deterministic precedence/budget；optional omission vs mandatory gap 分离；forbidden body拒绝 | stale/unknown冒充 Available；mandatory gap仍 model-ready；body持久化；query refresh；owner source被本地写入 | 10 | source owner readiness/正文不在 G1 |
| `AC-L2R-010` | FR007/008；CAP-05；`RecordWorkingMemory/GetMemoryUse/CompactWorkingMemory`；SM05 | working entry/use/window/version 有唯一性、CAS、原子 compaction；episodic/semantic 仅 retrieval/candidate/ref/gap；unavailable保留 | working与durable混同；Runtime写/删durable body/index；commit unknown启用新 window；query触发owner调用 | 7 | durable memory positive qualification=slot04，仅 local mediation可判 pass |

### 4.3 Provider-neutral model decision

| AC | Formal design / requirement | Pass condition | Failure condition | Rows | Positive/non-scope ceiling |
|---|---|---|---|---:|---|
| `AC-L2R-011` | FR009/010；CAP-06；ModelIntent/Candidate/Selection/Binding；SM17/22/23 | intent/candidate/selection 回指 goal/context/constraint/source version；binding digest exact；provider-neutral finite adapter posture；Pending zero model call | 固定 provider route/endpoint/secret/quota/cost进入 contract；expired/mismatch binding复用；Candidate/Bound=future readiness | 9 | provider selection quality、route/quota/cost不裁决 |
| `AC-L2R-012` | FR011；CAP-06；ModelTurn/Result/Disposition；`StartModelTurn/ClassifyModelResult/GetModelTurn/E01`；SM06 | result/refusal/timeout/unavailable/unknown/mismatch 全部保留 typed disposition 与 matching turn；duplicate exact；late/mismatch quarantine | Unknown普通重投；raw result保存；late覆盖 decision；mismatch被接受；query反向materialize/call | 8 | 不证明真实 provider availability/quality |
| `AC-L2R-013` | FR012；CAP-06/12 safe carrier；DecisionSummary/Observation | summary 只含 safe refs、source/version、finite disposition/error category；hidden reasoning/secret/raw provider/tool body 经 persistence/query/event/report 全面拒绝 | hidden CoT、credential、endpoint、raw body、full sensitive ref 出现在任一 carrier；redaction后仍泄漏 | 12 | 可证明本地安全载体，不证明 Obs backend/Artifact evidence ready |

### 4.4 Action, Tools and sub-agent orchestration

| AC | Formal design / requirement | Pass condition | Failure condition | Rows | Positive/non-scope ceiling |
|---|---|---|---|---:|---|
| `AC-L2R-014` | FR013；CAP-07；ActionChoice/Decision；`ProposeAction/GetActionState`；SM07 | no-action/Tool/child/wait/reject 明确；proposal、guard、submission candidate 与 execution phase 分离；zero external call during choice | choice或candidate写为Executed；proposal直接提交；query推断执行；unknown phase被抹平 | 5 | 不证明 Tool/child 实际执行 |
| `AC-L2R-015` | FR014/015；CAP-07/09；guards、attempt/marker、Tools normalized outcome；SM07/08/31 | Governance/Hub/Tools/Sandbox required views exact current；缺失/denied/pending/unknown zero invocation；attempt/marker先提交；feedback finite once；status-only reconcile same identity | default allow/host fallback/direct Sandbox；call-before-record；Unknown新key重试；receipt=execution/cleanup；Runtime写owner truth | 18 | G1只证明 consumer/orchestration；Tools/Sandbox real execution需 G2/G3 slots01/05/06 |
| `AC-L2R-016` | FR016；CAP-08；DelegationBoundary/ChildResult；`ProposeDelegation/GetDelegationState/E03`；SM09 | parent ref、strict subset scope/context/action allow-list、depth/turn/duration/budget固定 immutable digest；local record before child；result exactly-once | child scope扩大、mutable corpus、overflow、cross-scope、duplicate/late二次合入；member/container/image字段进入 | 8 | 不证明 member-service/container/image lifecycle 或真实 child readiness |

### 4.5 Checkpoint, recovery, reflection and handoff

| AC | Formal design / requirement | Pass condition | Failure condition | Rows | Positive/non-scope ceiling |
|---|---|---|---|---:|---|
| `AC-L2R-017` | FR017；CAP-10；Checkpoint/StablePoint/EffectFence；`Prepare/Commit/GetCheckpoint/Reconcile`；SM11 | checkpoint绑定 exact run/version/history/context/plan/turn/action markers，材料最小且 body-free；Prepared/CommitPending/CommitUnknown/Committed distinct；matching proof only commits | unresolved effect仍stable；Prepared当durable；mismatch receipt commits；forbidden body；旧 checkpoint被原地改写 | 8 | physical durability/resumability需 slot10 qualification |
| `AC-L2R-018` | FR018；CAP-02/10；RecoveryDecision/Continuation；SM12/28 + UoW crash windows | resume/retry/restart/reconcile/wait/block/cancel/manual由 checkpoint+fence+phase决定；unknown effect same identity status-only；lease/cursor/CAS防 stale write | commit/effect Unknown盲重试或跳过；新 identity 重投；stale cursor回滚；Prepared resume；配置把 Unknown改 success | 21 | external owner reconcile positive能力另行 qualification |
| `AC-L2R-019` | FR019；CAP-03/09；ReflectionRecord/Proposal/Decision；SM19~21/24 | 只基于 committed immutable anchors形成新 candidate/proposal/decision；source refs/version可追溯；apply/supersede显式；旧 turn/history/decision不变 | uncommitted/stale/unknown source Apply；hidden reasoning保存；reflection直接激活plan或改旧事实 | 9 | future analytics/learning body不在当前 P0 |
| `AC-L2R-020` | FR020；CAP-11/12；Outcome/HandoffAttempt/Gap/Projection；SM13/14 | one immutable local outcome + terminal run；handoff candidate/attempt/ACK/gap、delivery、Observed、downstream acceptance phase严格分层；matching ACK仅更新允许 gap/attempt | nonterminal/open fence success；second differing outcome；ACK/receipt/report/Observed反写 outcome/checkpoint/run；Candidate=Delivered | 18 | G1只裁 local outcome/phase separation；delivery/Observed/acceptance需各 owner evidence |

## 5. Exact TC/EV mapping

以下集合由 current 177-row registry 逐行解析。`mapped rows` 数量与前表必须一致；每个 EV 当前仍为 `planned_not_generated`。

### 5.1 AC001~010 exact mapping

| AC | Exact canonical TC set | Exact planned EV set | Owning suite reports |
|---|---|---|---|
| `AC-L2R-001` | `TC-SM01-001`,`TC-SM02-001`,`TC-SM03-001`,`TC-SM19-001`,`TC-SM20-001`,`TC-CAP02-001`,`TC-CAP03-001`,`TC-C01-001`,`TC-C03-001`,`TC-LOOP-001`,`TC-E2E-001` | `EV-UNIT-601`,`EV-UNIT-602`,`EV-UNIT-603`,`EV-UNIT-619`,`EV-UNIT-620`,`EV-SVC-402`,`EV-SVC-404`,`EV-SVC-451`,`EV-SVC-453`,`EV-SVC-420`,`EV-E2E-001` | `unit_state`,`service_semantics`,`local_e2e` |
| `AC-L2R-002` | `TC-SM04-001`,`TC-SM05-001`,`TC-CAP04-001`,`TC-CAP05-001`,`TC-C04-001`,`TC-C05-001`,`TC-C17-001`,`TC-E2E-002` | `EV-UNIT-604`,`EV-UNIT-605`,`EV-SVC-405`,`EV-SVC-406`,`EV-SVC-454`,`EV-SVC-455`,`EV-FAULT-467`,`EV-E2E-002` | `unit_state`,`service_semantics`,`local_e2e` |
| `AC-L2R-003` | `TC-SM06-001`,`TC-SM22-001`,`TC-SM23-001`,`TC-CAP06-001`,`TC-C06-001`,`TC-C07-001`,`TC-E01-001`,`TC-E2E-003` | `EV-UNIT-606`,`EV-UNIT-622`,`EV-UNIT-623`,`EV-SVC-407`,`EV-FAULT-456`,`EV-SVC-457`,`EV-ENTRY-521`,`EV-E2E-003` | `unit_state`,`service_semantics`,`entry_worker_job`,`local_e2e` |
| `AC-L2R-004` | `TC-SM07-001`,`TC-SM08-001`,`TC-SM09-001`,`TC-SM10-001`,`TC-CAP07-001`,`TC-CAP07-002`,`TC-CAP08-001`,`TC-CAP09-001`,`TC-C08-001`,`TC-C09-001`,`TC-C10-001`,`TC-C11-001`,`TC-E02-001`,`TC-E03-001`,`TC-E2E-004` | `EV-UNIT-607`,`EV-UNIT-608`,`EV-UNIT-609`,`EV-UNIT-610`,`EV-SVC-408`,`EV-FAULT-409`,`EV-SVC-410`,`EV-FAULT-411`,`EV-SVC-458`,`EV-SVC-459`,`EV-SVC-460`,`EV-FAULT-461`,`EV-ENTRY-522`,`EV-ENTRY-523`,`EV-E2E-004` | `unit_state`,`service_semantics`,`entry_worker_job`,`local_e2e` |
| `AC-L2R-005` | `TC-SM11-001`,`TC-SM12-001`,`TC-SM13-001`,`TC-SM14-001`,`TC-SM21-001`,`TC-SM24-001`,`TC-CAP09-002`,`TC-CAP10-001`,`TC-CAP11-001`,`TC-CAP12-001`,`TC-C12-001`,`TC-C13-001`,`TC-C14-001`,`TC-C15-001`,`TC-C16-001`,`TC-E2E-005` | `EV-UNIT-611`,`EV-UNIT-612`,`EV-UNIT-613`,`EV-UNIT-614`,`EV-UNIT-621`,`EV-UNIT-624`,`EV-SVC-412`,`EV-FAULT-413`,`EV-SVC-414`,`EV-FAULT-415`,`EV-SVC-462`,`EV-FAULT-463`,`EV-SVC-464`,`EV-SVC-465`,`EV-SVC-466`,`EV-E2E-005` | `unit_state`,`service_semantics`,`local_e2e` |
| `AC-L2R-006` | `TC-SM01-001`,`TC-CAP02-001`,`TC-C01-001`,`TC-ENTRY-001`,`TC-E2E-001` | `EV-UNIT-601`,`EV-SVC-402`,`EV-SVC-451`,`EV-ENTRY-433`,`EV-E2E-001` | `unit_state`,`service_semantics`,`entry_worker_job`,`local_e2e` |
| `AC-L2R-007` | `TC-LOOP-002`,`TC-LOOP-003`,`TC-SM03-001`,`TC-SM19-001`,`TC-SM20-001`,`TC-SM26-001`,`TC-SM27-001`,`TC-SM29-001`,`TC-Q03-001`,`TC-SLOT02-001`,`TC-CAP03-001`,`TC-C03-001`,`TC-LOOP-001`,`TC-J04-001`,`TC-LOOP-004`,`TC-E2E-001` | `EV-UNIT-421`,`EV-UNIT-422`,`EV-UNIT-603`,`EV-UNIT-619`,`EV-UNIT-620`,`EV-UNIT-626`,`EV-UNIT-627`,`EV-UNIT-629`,`EV-CON-503`,`EV-CON-447`,`EV-SVC-404`,`EV-SVC-453`,`EV-SVC-420`,`EV-JOB-544`,`EV-FAULT-423`,`EV-E2E-001` | `unit_state`,`contract_protocol`,`service_semantics`,`entry_worker_job`,`fault_replay_consistency`,`local_e2e` |
| `AC-L2R-008` | `TC-LOOP-003`,`TC-SM02-001`,`TC-SM26-001`,`TC-Q01-001`,`TC-CAP02-002`,`TC-C02-001`,`TC-C03-001`,`TC-ENTRY-001`,`TC-LOOP-006`,`TC-E2E-001` | `EV-UNIT-422`,`EV-UNIT-602`,`EV-UNIT-626`,`EV-CON-501`,`EV-SVC-403`,`EV-SVC-452`,`EV-SVC-453`,`EV-ENTRY-433`,`EV-FAULT-425`,`EV-E2E-001` | `unit_state`,`contract_protocol`,`service_semantics`,`entry_worker_job`,`fault_replay_consistency`,`local_e2e` |
| `AC-L2R-009` | `TC-SM04-001`,`TC-SM15-001`,`TC-Q04-001`,`TC-SLOT03-001`,`TC-CAP04-001`,`TC-C04-001`,`TC-C17-001`,`TC-E04-001`,`TC-J02-001`,`TC-E2E-002` | `EV-UNIT-604`,`EV-UNIT-615`,`EV-CON-504`,`EV-CON-448`,`EV-SVC-405`,`EV-SVC-454`,`EV-FAULT-467`,`EV-ENTRY-524`,`EV-JOB-542`,`EV-E2E-002` | `unit_state`,`contract_protocol`,`service_semantics`,`entry_worker_job`,`local_e2e` |
| `AC-L2R-010` | `TC-SM05-001`,`TC-Q05-001`,`TC-SLOT04-001`,`TC-CAP05-001`,`TC-C05-001`,`TC-J03-001`,`TC-E2E-002` | `EV-UNIT-605`,`EV-CON-505`,`EV-CON-449`,`EV-SVC-406`,`EV-SVC-455`,`EV-JOB-543`,`EV-E2E-002` | `unit_state`,`contract_protocol`,`service_semantics`,`entry_worker_job`,`local_e2e` |

每个 suite ID 解析为 `reports/runs/<run_id>/suites/<suite>.md`；每个 EV 还必须解析为对应 evidence detail 和 same-run raw case artifact。表中没有列出的 suite 不得被人工添加来替代缺失 owning report。

### 5.2 AC011~020 exact mapping

| AC | Exact canonical TC set | Exact planned EV set | Owning suite reports |
|---|---|---|---|
| `AC-L2R-011` | `TC-SM17-001`,`TC-SM22-001`,`TC-SM23-001`,`TC-SLOT07-001`,`TC-SLOT08-001`,`TC-CAP06-001`,`TC-C06-001`,`TC-BOUND-003`,`TC-E2E-003` | `EV-UNIT-617`,`EV-UNIT-622`,`EV-UNIT-623`,`EV-CON-452`,`EV-CON-453`,`EV-SVC-407`,`EV-FAULT-456`,`EV-STATIC-440`,`EV-E2E-003` | `unit_state`,`contract_protocol`,`service_semantics`,`security_source_boundary`,`local_e2e` |
| `AC-L2R-012` | `TC-SM06-001`,`TC-Q06-001`,`TC-SLOT08-001`,`TC-CAP06-001`,`TC-C06-001`,`TC-C07-001`,`TC-E01-001`,`TC-E2E-003` | `EV-UNIT-606`,`EV-CON-506`,`EV-CON-453`,`EV-SVC-407`,`EV-FAULT-456`,`EV-SVC-457`,`EV-ENTRY-521`,`EV-E2E-003` | `unit_state`,`contract_protocol`,`service_semantics`,`entry_worker_job`,`local_e2e` |
| `AC-L2R-013` | `TC-SM06-001`,`TC-Q06-001`,`TC-SLOT07-001`,`TC-SLOT08-001`,`TC-CAP06-001`,`TC-C06-001`,`TC-C07-001`,`TC-E01-001`,`TC-BOUND-003`,`TC-OBS-002`,`TC-SEC-002`,`TC-E2E-003` | `EV-UNIT-606`,`EV-CON-506`,`EV-CON-452`,`EV-CON-453`,`EV-SVC-407`,`EV-FAULT-456`,`EV-SVC-457`,`EV-ENTRY-521`,`EV-STATIC-440`,`EV-STATIC-692`,`EV-STATIC-695`,`EV-E2E-003` | `unit_state`,`contract_protocol`,`service_semantics`,`entry_worker_job`,`security_source_boundary`,`local_e2e` |
| `AC-L2R-014` | `TC-SM07-001`,`TC-Q07-001`,`TC-CAP07-001`,`TC-C08-001`,`TC-E2E-004` | `EV-UNIT-607`,`EV-CON-507`,`EV-SVC-408`,`EV-SVC-458`,`EV-E2E-004` | `unit_state`,`contract_protocol`,`service_semantics`,`local_e2e` |
| `AC-L2R-015` | `TC-SM07-001`,`TC-SM08-001`,`TC-SM31-001`,`TC-Q07-001`,`TC-O03-001`,`TC-SLOT01-001`,`TC-SLOT05-001`,`TC-SLOT06-001`,`TC-CAP07-001`,`TC-CAP07-002`,`TC-CAP09-001`,`TC-C09-001`,`TC-C11-001`,`TC-E02-001`,`TC-E05-001`,`TC-J05-001`,`TC-BOUND-004`,`TC-E2E-004` | `EV-UNIT-607`,`EV-UNIT-608`,`EV-UNIT-631`,`EV-CON-507`,`EV-CON-533`,`EV-CON-446`,`EV-CON-450`,`EV-CON-451`,`EV-SVC-408`,`EV-FAULT-409`,`EV-FAULT-411`,`EV-SVC-459`,`EV-FAULT-461`,`EV-ENTRY-522`,`EV-ENTRY-525`,`EV-JOB-545`,`EV-FAULT-441`,`EV-E2E-004` | `unit_state`,`contract_protocol`,`service_semantics`,`entry_worker_job`,`security_source_boundary`,`local_e2e` |
| `AC-L2R-016` | `TC-SM09-001`,`TC-Q08-001`,`TC-SLOT09-001`,`TC-CAP08-001`,`TC-C10-001`,`TC-E03-001`,`TC-BOUND-005`,`TC-E2E-004` | `EV-UNIT-609`,`EV-CON-508`,`EV-CON-454`,`EV-SVC-410`,`EV-SVC-460`,`EV-ENTRY-523`,`EV-STATIC-442`,`EV-E2E-004` | `unit_state`,`contract_protocol`,`service_semantics`,`entry_worker_job`,`security_source_boundary`,`local_e2e` |
| `AC-L2R-017` | `TC-SM11-001`,`TC-Q09-001`,`TC-SLOT10-001`,`TC-CAP10-001`,`TC-C12-001`,`TC-C13-001`,`TC-J05-001`,`TC-E2E-005` | `EV-UNIT-611`,`EV-CON-509`,`EV-CON-455`,`EV-FAULT-413`,`EV-SVC-462`,`EV-FAULT-463`,`EV-JOB-545`,`EV-E2E-005` | `unit_state`,`contract_protocol`,`service_semantics`,`entry_worker_job`,`local_e2e` |
| `AC-L2R-018` | `TC-SM02-001`,`TC-SM12-001`,`TC-SM28-001`,`TC-Q09-001`,`TC-SLOT10-001`,`TC-CAP02-002`,`TC-CAP10-001`,`TC-C02-001`,`TC-C13-001`,`TC-C14-001`,`TC-J04-001`,`TC-J05-001`,`TC-LOOP-004`,`TC-LOOP-006`,`TC-UOW-002`,`TC-UOW-003`,`TC-UOW-004`,`TC-ERR-003`,`TC-ERR-007`,`TC-CFG14-001`,`TC-E2E-005` | `EV-UNIT-602`,`EV-UNIT-612`,`EV-UNIT-628`,`EV-CON-509`,`EV-CON-455`,`EV-SVC-403`,`EV-FAULT-413`,`EV-SVC-452`,`EV-FAULT-463`,`EV-SVC-464`,`EV-JOB-544`,`EV-JOB-545`,`EV-FAULT-423`,`EV-FAULT-425`,`EV-FAULT-642`,`EV-FAULT-643`,`EV-FAULT-644`,`EV-FAULT-663`,`EV-STATIC-667`,`EV-FAULT-684`,`EV-E2E-005` | `unit_state`,`contract_protocol`,`service_semantics`,`entry_worker_job`,`fault_replay_consistency`,`config_builder`,`local_e2e` |
| `AC-L2R-019` | `TC-SM19-001`,`TC-SM20-001`,`TC-SM21-001`,`TC-SM24-001`,`TC-CAP03-001`,`TC-CAP09-002`,`TC-C03-001`,`TC-C14-001`,`TC-E2E-005` | `EV-UNIT-619`,`EV-UNIT-620`,`EV-UNIT-621`,`EV-UNIT-624`,`EV-SVC-404`,`EV-SVC-412`,`EV-SVC-453`,`EV-SVC-464`,`EV-E2E-005` | `unit_state`,`service_semantics`,`local_e2e` |
| `AC-L2R-020` | `TC-SM13-001`,`TC-SM14-001`,`TC-Q10-001`,`TC-Q11-001`,`TC-O03-001`,`TC-O04-001`,`TC-O05-001`,`TC-SLOT11-001`,`TC-CAP11-001`,`TC-CAP12-001`,`TC-C15-001`,`TC-C16-001`,`TC-E06-001`,`TC-J06-001`,`TC-REPLAY-005`,`TC-BOUND-007`,`TC-OBS-003`,`TC-E2E-005` | `EV-UNIT-613`,`EV-UNIT-614`,`EV-CON-510`,`EV-CON-511`,`EV-CON-533`,`EV-CON-534`,`EV-CON-535`,`EV-CON-456`,`EV-SVC-414`,`EV-FAULT-415`,`EV-SVC-465`,`EV-SVC-466`,`EV-ENTRY-526`,`EV-JOB-546`,`EV-FAULT-652`,`EV-FAULT-444`,`EV-FAULT-693`,`EV-E2E-005` | `unit_state`,`contract_protocol`,`service_semantics`,`entry_worker_job`,`fault_replay_consistency`,`security_source_boundary`,`local_e2e` |

## 6. Per-AC stop-review record

| AC | Formal requirement/design | Registry rows exact | Pass/failure decidable | Report/raw path fixed | Positive ceiling explicit | Stop-review |
|---|---|---:|---|---|---|---|
| `AC-L2R-001` | C1、FR001~004、CAP02/03/loop | 11 | yes | yes | local loop only | closed_design |
| `AC-L2R-002` | C2、FR005~008、CAP04/05 | 8 | yes | yes | no durable owner readiness | closed_design |
| `AC-L2R-003` | C3、FR009~012、CAP06 | 8 | yes | yes | no provider readiness | closed_design |
| `AC-L2R-004` | C4、FR013~016、CAP07~09 | 15 | yes | yes | no real execution | closed_design |
| `AC-L2R-005` | C5、FR017~020、CAP09~12 | 16 | yes | yes | no durability/delivery/Observed | closed_design |
| `AC-L2R-006` | FR001、CAP02/C01/entry | 5 | yes | yes | no member/product entry | closed_design |
| `AC-L2R-007` | FR002/003、CAP03/loop | 16 | yes | yes | no Work/Process truth | closed_design |
| `AC-L2R-008` | FR004、run/control/loop | 10 | yes | yes | no scheduler readiness | closed_design |
| `AC-L2R-009` | FR005/006、CAP04/source | 10 | yes | yes | no source body/readiness | closed_design |
| `AC-L2R-010` | FR007/008、CAP05/memory | 7 | yes | yes | slot04 separate | closed_design |
| `AC-L2R-011` | FR009/010、CAP06/binding | 9 | yes | yes | no provider routing/quality | closed_design |
| `AC-L2R-012` | FR011、CAP06/turn | 8 | yes | yes | no real provider availability | closed_design |
| `AC-L2R-013` | FR012、safe summary/carrier | 12 | yes | yes | no Obs/Artifact readiness | closed_design |
| `AC-L2R-014` | FR013、CAP07/action choice | 5 | yes | yes | no execution | closed_design |
| `AC-L2R-015` | FR014/015、guards/attempt/feedback | 18 | yes | yes | slots01/05/06 separate | closed_design |
| `AC-L2R-016` | FR016、CAP08/delegation | 8 | yes | yes | no member/container lifecycle | closed_design |
| `AC-L2R-017` | FR017、CAP10/checkpoint | 8 | yes | yes | slot10 separate | closed_design |
| `AC-L2R-018` | FR018、recovery/UoW/fence | 21 | yes | yes | no blind external retry | closed_design |
| `AC-L2R-019` | FR019、reflection/plan proposal | 9 | yes | yes | no analytics/learning body | closed_design |
| `AC-L2R-020` | FR020、outcome/handoff/gap | 18 | yes | yes | no delivery/Observed/acceptance | closed_design |

`closed_design` 表示验收门禁定义闭合，不表示任何 AC 已实际通过。未来每个 AC 必须使用 exact package 重做 evidence review；不得把本表的 yes/closed 当作 actual test or acceptance result。

## 7. Cross-functional decision audit

| Audit item | Result / rule |
|---|---|
| AC coverage | AC001~020 exactly once as decision subjects；no orphan core FR |
| mapped registry rows | row counts `11/8/8/15/16/5/16/10/10/7/9/8/12/5/18/8/8/21/9/18` match parsed authority |
| evidence completeness | exact TC and EV sets listed；all still M0 planned |
| aggregate use | E2E001~005 derived only；never replaces raw mapped rows |
| duplicate evidence | reuse across AC is allowed as multi-assertion evidence；one raw owner remains unchanged；no status copied |
| failure conflict | any required row non-pass prevents that AC pass；VF trigger takes hard precedence |
| P1/P2 pollution | none；four peripheral FR do not enter current denominator without rebaseline |
| positive seam | G1 finite behavior separated from G2/G3 real qualification |
| report paths | every EV -> evidence detail + owning suite report + raw case under same run |
| historical aliases | old TC/EV/suite denominators absent from current gate |

## 8. 回填草稿与 Step stop-review

Formal §5 应写共同裁决合同、五个聚合闭环、十五个明细门禁、exact TC/EV mapping 和 positive conclusion ceilings。可将 exact mapping 表保留为本章明细，不得压缩成“详见 05”而失去 AC 到 evidence 的直接闭环。

```text
step_status = completed_continuous_authorized
functional_ac_subjects = 20
functional_mapping_rows_by_ac = 11/8/8/15/16/5/16/10/10/7/9/8/12/5/18/8/8/21/9/18
actual_functional_disposition = none
current_process_state = not_entered
next_step = Step 6
formal_06_write_allowed = false_until_step_15
```
