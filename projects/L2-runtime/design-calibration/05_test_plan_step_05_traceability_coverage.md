# L2-runtime 05 测试方案 Step 5：需求追溯与覆盖矩阵

> 对应 SOP：`standards/document/测试方案讨论流程_SOP.md` Step 5
> 回填位置：正式 `05-测试方案.md` §5
> 输入：正式 `00` §§9~16、正式 `03` §§5~15、Step 3 的 37 CUT、Step 4 分层结论
> 状态：`completed_continuous_authorized`
> 证据状态：本文所有 `EV-*` 均为 `planned_not_generated` 的候选证据槽，不是 artifact、report、alias、执行结果或验收事实

## 1. 本步目标、输出与约束

本 Step 建立 requirement -> design -> CUT -> case candidate -> planned evidence slot 的正向追溯，以及 CUT -> requirement/rule/design 的反向追溯。它只固定覆盖分母和后续用例入口，不提前设计 Step 6 的详细数据、操作和断言，也不产生真实证据。

| SOP 问题 | 结论 |
|---|---|
| 每个 P0 需求如何覆盖？ | `FR-L2R-001~020`、`BR-L2R-001~044`、P0 NFR、`AC-L2R-001~036`、`VF-L2R-001~008` 均有 design/CUT、case candidate 和 planned EV source。 |
| 哪些必须自动化？ | 所有 P0 local semantic、protocol identity、state、negative boundary、UoW、config、security 与 static veto 都是自动化候选；不得仅以人工确认覆盖。 |
| 哪些不进入 P0 通过分母？ | `FR-L2R-E01~E04` 是 P2 future/read-only；NFR-001~003 只做无阈值 characterization；positive qualification 当前 blocked。 |
| 证据如何编号？ | 按最早 owning layer 使用 `EV-UNIT/CON/SVC/FAULT/ENTRY/E2E/STATIC/PERF/QUAL-xxx`；Step 13 再固定 manifest 和路径。 |
| 外部 blocker 如何表达？ | 对应 local negative/blocked-aware case 仍可设计；`EV-QUAL-*` 保持 `blocked_dependency/not_runnable`，不能被 fake 或 local EV 替代。 |

## 2. 历史污染审计与覆盖口径

| 历史口径 | 当前处理 | 原因 |
|---|---|---|
| 20 个 CUT | 废弃，使用 37 个 current CUT | current 03 已有 31 states、loop、plan、binding、attempt 和完整配置生命周期 |
| 旧 TC/EV 编号和 109 EV slots | 全部废弃 | 编号不能先于 current case/oracle 推导 |
| 只算 20 FR、忽略其余规则与否决项 | 拒绝 | 44 BR、19 NFR、36 AC、8 VF 都是正式分母 |
| 把外围 FR 算作 P0 未通过 | 拒绝 | `FR-L2R-E01~E04` 已在正式 00 定位为 P2/future |
| fake accepted 关闭 positive seam | 拒绝 | fake 只能证明 Runtime local finite branch |

覆盖状态只允许：

```text
designed_local          = current design 已有可执行候选，尚未运行
designed_blocked_aware  = local negative/blocked posture 可执行，positive lane blocked
future_not_in_p0        = P2/future，不进入 P0 denominator
planned_not_generated   = 证据槽已预留，但没有真实文件或结果
blocked_dependency      = 真实正向资格依赖未闭合，不得计 pass/skip
```

## 3. FR-L2R-001~020 正向覆盖

| FR | 设计依据 / primary CUT | 必测场景候选 | Primary case candidate | Planned EV | 状态 |
|---|---|---|---|---|---|
| `FR-L2R-001` | CAP-02/C01/SM-01；CUT-03/21/26 | 正式主体受理；missing/conflict/wait/blocked/unknown 零 run | `TC-CAP02-001`;`TC-C01-001` | `EV-SVC-001` | designed_local |
| `FR-L2R-002` | CAP-03/C01/SM-03；CUT-03/05 | goal ref 建立且不复制 Work/Method body | `TC-CAP03-001` | `EV-SVC-002` | designed_local |
| `FR-L2R-003` | CAP-03/C03/SM-19~21；CUT-05/21/28 | graph/base CAS、依赖、waiting/blocked/no-next-step | `TC-C03-001`;`TC-CAP03-002` | `EV-SVC-003` | designed_local |
| `FR-L2R-004` | CAP-02/C02/C03/SM-02；CUT-04/26 | 全部 run posture、terminal freeze、unknown fence | `TC-C02-001`;`TC-SM02-001` | `EV-SVC-004` | designed_local |
| `FR-L2R-005` | CAP-04/C17/SM-15；CUT-20/21/27 | owner/ref/scope/freshness；猜 identity/body 被拒绝 | `TC-C17-001`;`TC-CAP04-001` | `EV-SVC-005` | designed_blocked_aware |
| `FR-L2R-006` | CAP-04/C04/SM-04；CUT-06/21 | deterministic precedence/budget/missing/conflict/freeze | `TC-C04-001`;`TC-CAP04-002` | `EV-SVC-006` | designed_local |
| `FR-L2R-007` | CAP-05/C05/J03/SM-05；CUT-07/25 | working window、use-once、compaction unknown | `TC-C05-001`;`TC-J03-001` | `EV-SVC-007` | designed_local |
| `FR-L2R-008` | CAP-05/MemoryRetrievalPort；CUT-07/30 | retrieval/candidate/ref/gap；无 durable write/delete truth | `TC-CAP05-002`;`TC-SLOT04-001` | `EV-SVC-008` | designed_blocked_aware |
| `FR-L2R-009` | CAP-06/C06/SM-22；CUT-08/09 | provider-neutral intent、no-model、无 physical route | `TC-C06-001`;`TC-CAP06-001` | `EV-SVC-009` | designed_blocked_aware |
| `FR-L2R-010` | CAP-06/C06/SM-17；CUT-09/30 | logical candidate/selection 与 provider truth 分离 | `TC-C06-002`;`TC-SLOT08-001` | `EV-SVC-010` | designed_blocked_aware |
| `FR-L2R-011` | CAP-06/C06/C07/E01/SM-06；CUT-08/09/23 | binding-before-call；result/refusal/timeout/unavailable/unknown/late | `TC-C07-001`;`TC-E01-001` | `EV-SVC-011` | designed_blocked_aware |
| `FR-L2R-012` | CAP-06/C07/RuntimeDecisionSummary；CUT-09/36 | safe summary、source linkage、raw/secret/hidden body 禁入 | `TC-C07-002`;`TC-OBS-001` | `EV-SVC-012` | designed_local |
| `FR-L2R-013` | CAP-07/C08/SM-07；CUT-10 | no-action/tool/child/wait/reject/escalation；choice != execution | `TC-C08-001`;`TC-CAP07-001` | `EV-SVC-013` | designed_local |
| `FR-L2R-014` | CAP-07/InvocationCallerPort/SM-08/31；CUT-11/30/31 | record-before-call、canonical request、finite result、unknown no retry | `TC-CAP07-002`;`TC-SLOT06-001` | `EV-SVC-014` | designed_blocked_aware |
| `FR-L2R-015` | CAP-07/C09；CUT-10/30/37 | owner/scope/version/freshness 五类 guard；missing/stale/unknown 零 submit | `TC-C09-001`;`TC-SLOT01-001`;`TC-SLOT05-001` | `EV-SVC-015` | designed_blocked_aware |
| `FR-L2R-016` | CAP-08/C10/E03/SM-09；CUT-12/23 | parent subset、budget、isolated context、child result once | `TC-C10-001`;`TC-E03-001` | `EV-SVC-016` | designed_blocked_aware |
| `FR-L2R-017` | CAP-10/C12/C13/SM-11；CUT-15/21 | minimal checkpoint、Prepared != Committed、matching receipt | `TC-C12-001`;`TC-C13-001` | `EV-SVC-017` | designed_blocked_aware |
| `FR-L2R-018` | CAP-10/C14/J04/J05/SM-12/28；CUT-16/25 | closed fence、finite recovery、unknown manual/reconcile、no blind retry | `TC-C14-001`;`TC-J05-001` | `EV-SVC-018` | designed_blocked_aware |
| `FR-L2R-019` | CAP-09/reflection/SM-21/24；CUT-14 | committed facts -> new candidate/decision；history immutable | `TC-CAP09-002`;`TC-SM24-001` | `EV-SVC-019` | designed_local |
| `FR-L2R-020` | CAP-11/12/C15/C16/E06；CUT-17~19/24 | one local outcome、attempt/gap/ACK 分层、no reverse-write | `TC-C15-001`;`TC-C16-001` | `EV-SVC-020` | designed_blocked_aware |

## 4. 外围 FR 单列

| FR | 当前测试边界 | 候选入口 | 状态 |
|---|---|---|---|
| `FR-L2R-E01` | plan/model strategy 只读比较，不改 run truth | future read-only fixture + CUT-05/09/22 | future_not_in_p0 |
| `FR-L2R-E02` | replay preview 不调用 model/Tool/child/Sandbox | future no-effect fixture + CUT-32 | future_not_in_p0 |
| `FR-L2R-E03` | 跨 run 安全趋势摘要，不拥有 cost/Obs truth | future projection fixture + CUT-19/36 | future_not_in_p0 |
| `FR-L2R-E04` | reflection candidate handoff，不写 Method/durable memory | future blocked handoff + CUT-14/18/30 | future_not_in_p0 |

## 5. BR-L2R-001~044 逐项覆盖

| BR | Primary CUT | 核心 oracle / case candidate | Planned EV | 状态 |
|---|---|---|---|---|
| 001 | 03/21 | subject/scope/goal/source 缺失时零 run；`TC-C01-002` | `EV-SVC-101` | designed_local |
| 002 | 04/16/26 | lifecycle/unknown 显式且 history append-only；`TC-SM02-001` | `EV-UNIT-102` | designed_local |
| 003 | 05 | workspace 回链 run/ref，no external truth copy；`TC-CAP03-001` | `EV-SVC-103` | designed_local |
| 004 | 05/13 | summary/feedback 不能隐式推进 plan；`TC-C03-002` | `EV-SVC-104` | designed_local |
| 005 | 04/26 | waiting/blocked/cancelled/failed/unknown 不压平；`TC-SM02-002` | `EV-UNIT-105` | designed_local |
| 006 | 04/17 | unavailable 不提升 completed/delivered/accepted；`TC-C15-002` | `EV-SVC-106` | designed_local |
| 007 | 01/36 | safe correlation 有、body/hidden reasoning 无；`TC-OBS-002` | `EV-STATIC-107` | designed_local |
| 008 | 03/05/37 | 无 Process/Work/Plan/Method/Artifact owner write；`TC-BOUND-001` | `EV-STATIC-108` | designed_local |
| 009 | 06/20 | source owner/ref/scope/time 必填；`TC-C04-002` | `EV-SVC-109` | designed_local |
| 010 | 01/20 | string/route/cursor/display 不可猜 identity；`TC-VOCAB-001` | `EV-UNIT-110` | designed_local |
| 011 | 06/09/36 | forbidden external/raw/secret/hidden body across writes；`TC-SEC-001` | `EV-STATIC-111` | designed_local |
| 012 | 06 | precedence/scope/freshness/budget/gap/conflict 显式；`TC-C04-001` | `EV-SVC-112` | designed_local |
| 013 | 06/07/19 | snapshot/candidate/summary/projection/report 不晋升 truth；`TC-BOUND-002` | `EV-SVC-113` | designed_local |
| 014 | 07 | working/retrieval/committed durable memory 分层；`TC-CAP05-001` | `EV-SVC-114` | designed_local |
| 015 | 07 | use/candidate/accept/reject/stale/unavailable/handoff 分列；`TC-C05-001` | `EV-SVC-115` | designed_local |
| 016 | 07/30 | durable owner pending -> retrieval/candidate/ref/gap only；`TC-SLOT04-001` | `EV-CON-116` | designed_blocked_aware |
| 017 | 08/09 | intent 来自 goal/context/constraint 而非 provider name；`TC-C06-001` | `EV-SVC-117` | designed_local |
| 018 | 09/30 | logical selection != route/secret/quota/cost；`TC-BOUND-003` | `EV-STATIC-118` | designed_local |
| 019 | 30/37 | provider registry/endpoint/secret fallback absent；`TC-DEP-001` | `EV-STATIC-119` | designed_local |
| 020 | 09/23 | run/turn/decision correlation；late result no overwrite；`TC-E01-002` | `EV-SVC-120` | designed_local |
| 021 | 09/33 | six model outcomes and mismatch distinct；`TC-C07-001` | `EV-SVC-121` | designed_local |
| 022 | 09/36 | raw response/hidden reasoning never observed truth；`TC-SEC-002` | `EV-STATIC-122` | designed_local |
| 023 | 09/36 | summary only minimal sources/reason class/status；`TC-C07-002` | `EV-SVC-123` | designed_local |
| 024 | 08/09/30 | adapter gap -> blocked/unavailable, no semantic fallback；`TC-SLOT08-001` | `EV-CON-124` | designed_blocked_aware |
| 025 | 10 | action choice links goal/plan/disposition/class；`TC-C08-001` | `EV-SVC-125` | designed_local |
| 026 | 10 | no-action/wait/tool/child/reject/escalation distinct；`TC-C08-002` | `EV-UNIT-126` | designed_local |
| 027 | 10/11 | choice never means executed/approved/sandbox success；`TC-CAP07-001` | `EV-SVC-127` | designed_local |
| 028 | 11/30 | canonical Tools request/result only, no Tool truth copy；`TC-SLOT06-001` | `EV-CON-128` | designed_blocked_aware |
| 029 | 10/30 | formal Governance result required; missing/conflict/stale/unknown block；`TC-SLOT01-001` | `EV-CON-129` | designed_blocked_aware |
| 030 | 11/30/37 | sandbox-required has no host/direct fallback；`TC-BOUND-004` | `EV-STATIC-130` | designed_local |
| 031 | 12 | parent link/scope/budget/lifecycle/isolated context；`TC-C10-001` | `EV-SVC-131` | designed_local |
| 032 | 12/37 | no mutable sharing/scope growth/member lifecycle；`TC-BOUND-005` | `EV-STATIC-132` | designed_local |
| 033 | 12/13 | child states/result incorporation distinct/once；`TC-E03-001` | `EV-SVC-133` | designed_local |
| 034 | 10~12/30 | Tools/Gov/Sandbox/Hub truth remains external；`TC-BOUND-006` | `EV-STATIC-134` | designed_local |
| 035 | 15 | stable point + minimal markers + digest；`TC-C12-001` | `EV-SVC-135` | designed_local |
| 036 | 15/36 | checkpoint body/secret/reasoning denied；`TC-SEC-003` | `EV-STATIC-136` | designed_local |
| 037 | 14/16 | resume/recovery/reflection append new decision/history；`TC-C14-001` | `EV-SVC-137` | designed_local |
| 038 | 11/15/16/31 | commit/effect unknown -> fence/reconcile/manual, zero ordinary retry；`TC-FAULT-001` | `EV-FAULT-138` | designed_local |
| 039 | 13/16/17 | late feedback creates associated fact, no outcome reverse-write；`TC-E02-002` | `EV-SVC-139` | designed_local |
| 040 | 14 | reflection from committed facts, old turn/source immutable；`TC-CAP09-002` | `EV-SVC-140` | designed_local |
| 041 | 17/18 | outcome/attempt/delivery/observed/acceptance separate；`TC-C15-003` | `EV-SVC-141` | designed_local |
| 042 | 18/36 | material/attempt/gap link outcome/source/purpose/run；`TC-C16-001` | `EV-SVC-142` | designed_local |
| 043 | 17~19/24 | receipt/ACK/Observed/report/summary cannot replace Runtime truth；`TC-BOUND-007` | `EV-STATIC-143` | designed_local |
| 044 | 30/35/37 | any open positive seam remains blocked/waiting/degraded/fail-closed；`TC-BOUND-008` | `EV-CON-144` | designed_blocked_aware |

## 6. NFR-L2R-001~019 逐项覆盖

| NFR | Primary CUT / method | Case candidate / threshold rule | Planned EV | 状态 |
|---|---|---|---|---|
| 001 | 02/06/15/19 fixed workload | local stage work does not grow from report/observed/SDK path；无数值阈值 | `EV-PERF-201` | designed_local P1 |
| 002 | 02/07~11/18 stage timing | local vs model/memory/tool/handoff wait 分解 | `EV-PERF-202` | designed_local P1 |
| 003 | 02/06/12/15 budgets | context/child/checkpoint/handoff bounds from config；缺来源即 blocked | `EV-PERF-203` | designed_blocked_aware P1 |
| 004 | 13/16/18/32 fault injection | unavailable/timeout/late 保持历史与 distinct posture | `EV-FAULT-204` | designed_local |
| 005 | 07~09/30 capability matrix | model/memory 缺失只影响依赖能力，fallback 明示非等价 | `EV-FAULT-205` | designed_blocked_aware |
| 006 | 10/11/30/37 negative boundary | Tools/Gov/Sandbox missing -> zero host/bypass | `EV-FAULT-206` | designed_blocked_aware |
| 007 | 01/06~18/36 forbidden scan | truth/checkpoint/event/handoff/report 均 body-free | `EV-STATIC-207` | designed_local |
| 008 | 10/30 guard matrix | owner/scope/freshness/version/precondition conflict fail closed | `EV-SVC-208` | designed_blocked_aware |
| 009 | 12/37 containment | child scope/context/budget/authority strict subset | `EV-SVC-209` | designed_local |
| 010 | 01~20/36 trace graph | run/goal/plan/source/turn/action/checkpoint/outcome/handoff correlated | `EV-SVC-210` | designed_local |
| 011 | 17~19/24 phase ledger | local outcome/attempt/delivery/observed/consumption independent | `EV-SVC-211` | designed_local |
| 012 | 06/14/16/20/32 history | stale/conflict/re-resolution append new fact, no overwrite | `EV-FAULT-212` | designed_local |
| 013 | 03/13/15/16/18/32 replay | duplicate trigger/feedback/checkpoint/resume/handoff no fork/effect repeat | `EV-FAULT-213` | designed_local |
| 014 | 07/20/32 identity | duplicate source read no second truth; candidate/snapshot/commit distinct | `EV-FAULT-214` | designed_local |
| 015 | 09/12/13/32 late ordering | model/tool/child late result no overwrite | `EV-FAULT-215` | designed_local |
| 016 | 16/18/36 observation carrier | low-sensitive/low-cardinality state/failure/gap material | `EV-SVC-216` | designed_local |
| 017 | 36 redaction/cardinality | redact before serialization; raw/high-cardinality content absent | `EV-STATIC-217` | designed_local |
| 018 | 18/24/36 handoff fault | event/observation attempt/gap visible without success inference | `EV-FAULT-218` | designed_blocked_aware |
| 019 | 30/37/evidence truth | planned/blocked/not_run/fake cannot become pass/readiness | `EV-STATIC-219` | designed_local |

## 7. AC-L2R-001~036 消费映射

| AC | Primary requirement / CUT source | Planned evidence source | 当前状态 |
|---|---|---|---|
| 001 | FR001~004；CUT-02~05 | EV-SVC-001~004 + future same-run aggregate `EV-E2E-001` | planned_not_generated |
| 002 | FR005~008；CUT-06/07/20 | EV-SVC-005~008 + `EV-E2E-002` | planned_not_generated |
| 003 | FR009~012；CUT-08/09/36 | EV-SVC-009~012 + `EV-E2E-003` | planned_not_generated |
| 004 | FR013~016；CUT-10~13 | EV-SVC-013~016 + `EV-E2E-004` | planned_not_generated |
| 005 | FR017~020；CUT-14~19 | EV-SVC-017~020 + `EV-E2E-005` | planned_not_generated |
| 006 | FR001 | EV-SVC-001 | planned_not_generated |
| 007 | FR002/003 | EV-SVC-002/003 | planned_not_generated |
| 008 | FR004 | EV-SVC-004 | planned_not_generated |
| 009 | FR005/006 | EV-SVC-005/006 | planned_not_generated |
| 010 | FR007/008 | EV-SVC-007/008 | planned_not_generated |
| 011 | FR009/010 | EV-SVC-009/010 | planned_not_generated |
| 012 | FR011 | EV-SVC-011 | planned_not_generated |
| 013 | FR012 | EV-SVC-012 | planned_not_generated |
| 014 | FR013 | EV-SVC-013 | planned_not_generated |
| 015 | FR014/015 | EV-SVC-014/015 | planned_not_generated |
| 016 | FR016 | EV-SVC-016 | planned_not_generated |
| 017 | FR017 | EV-SVC-017 | planned_not_generated |
| 018 | FR018 | EV-SVC-018 | planned_not_generated |
| 019 | FR019 | EV-SVC-019 | planned_not_generated |
| 020 | FR020 | EV-SVC-020 | planned_not_generated |
| 021 | BR009~016；CUT-06/07/20/30 | EV-SVC-109~116 | planned_not_generated |
| 022 | BR008/028~034；CUT-30/37 | EV-STATIC-108/119/130/132/134 | planned_not_generated |
| 023 | BR029/030/044；CUT-10/30 | EV-CON-129/144 + EV-FAULT-206 | planned_not_generated |
| 024 | BR041~043；CUT-17~19/24 | EV-SVC-141~143 | planned_not_generated |
| 025 | BR020/039；NFR015 | EV-SVC-120/139 + EV-FAULT-215 | planned_not_generated |
| 026 | data owner matrix；CUT-03~19 | EV-STATIC-108/134/143 | planned_not_generated |
| 027 | BR008~016/028~034；CUT-20/30/37 | EV-STATIC-108/134 | planned_not_generated |
| 028 | FR008/BR014~016；CUT-07/30 | EV-SVC-008/114~116 | planned_not_generated |
| 029 | BR011/022/036；NFR007/017 | EV-STATIC-111/122/136/207/217 | planned_not_generated |
| 030 | BR013/041~043；CUT-06/07/17~19 | EV-SVC-113/141~143 | planned_not_generated |
| 031 | NFR001~003 | EV-PERF-201~203 | planned_not_generated; no numeric verdict |
| 032 | NFR004~006 | EV-FAULT-204~206 | planned_not_generated |
| 033 | NFR007~009 | EV-STATIC-207 + EV-SVC-208/209 | planned_not_generated |
| 034 | NFR010~012 | EV-SVC-210/211 + EV-FAULT-212 | planned_not_generated |
| 035 | NFR013~015 | EV-FAULT-213~215 | planned_not_generated |
| 036 | NFR016~019 | EV-SVC-216 + EV-STATIC-217/219 + EV-FAULT-218 | planned_not_generated |

## 8. VF-L2R-001~008 可执行否决映射

| VF | Primary CUT | Case/static candidate | Planned EV | 状态 |
|---|---|---|---|---|
| 001 | 20/30/37 | owner-write/source graph scan + boundary spies；`TC-BOUND-001/006` | `EV-STATIC-301` | designed_local |
| 002 | 10/11/30/37 | missing/unknown guard zero call + no host fallback；`TC-BOUND-004/008` | `EV-FAULT-302` | designed_blocked_aware |
| 003 | 01/06~18/36 | write/event/report forbidden-material scan；`TC-SEC-001~003` | `EV-STATIC-303` | designed_local |
| 004 | 11/15/16/31/32 | commit/effect unknown journal proves zero ordinary retry；`TC-FAULT-001` | `EV-FAULT-304` | designed_local |
| 005 | 17~19/24 | receipt/delivery/observed/downstream cannot mutate local truth；`TC-BOUND-007` | `EV-FAULT-305` | designed_local |
| 006 | 30/37 + Step 9/13 gate | fake/planned/blocked/not_run truth-state validator | `EV-STATIC-306` | designed_local |
| 007 | 37 | dependency graph permits Core candidate only；`TC-DEP-001` | `EV-STATIC-307` | designed_local |
| 008 | all 37 | source/requirement/case/evidence denominator validator | `EV-STATIC-308` | designed_local |

## 9. CUT-L2R-01~37 反向覆盖

| CUT | Requirement / rule anchor | Design anchor | Step 6 case family | Planned EV family | Orphan |
|---|---|---|---|---|---|
| 01 VOCAB | BR001/007/010/011；NFR007/010 | CAP-01、§§6.2~6.3/7.1/11 | VOCAB | UNIT/CON/STATIC | no |
| 02 LOOP | FR003/004/018；NFR001/013 | §§5.3/8/9 SM-25~29 | LOOP | UNIT/SVC/FAULT | no |
| 03 ADMISSION | FR001/002；BR001 | CAP-02/C01/SM-01/30 | C01/CAP02 | SVC | no |
| 04 RUN-CONTROL | FR004/018；BR002/005 | CAP-02/C02/C03/SM-02 | C02/C03/SM02 | UNIT/SVC | no |
| 05 PLAN | FR002/003/019；BR003/004 | CAP-03/SM-03/19~21 | CAP03/C03/SM | UNIT/SVC | no |
| 06 CONTEXT | FR005/006；BR009~013 | CAP-04/C04/Q04/SM-04/15 | CAP04/C04/Q04 | UNIT/SVC | no |
| 07 MEMORY | FR007/008；BR013~016 | CAP-05/C05/Q05/J03/SM-05 | CAP05/C05/Q05/J03 | UNIT/SVC/JOB | no |
| 08 MODEL-BIND | FR009/011；BR017/024 | CAP-06/C06/SM-22/23 | C06/SM22/23 | UNIT/SVC | no |
| 09 MODEL-DECISION | FR009~012；BR017~024 | CAP-06/C06/C07/E01/SM-06 | CAP06/C06/C07/E01 | UNIT/SVC/WRK | no |
| 10 ACTION-GUARD | FR013/015；BR025~030 | CAP-07/C08/C09/SM-07 | C08/C09 | UNIT/SVC | no |
| 11 ACTION-SUBMIT | FR014；BR027/028/030/038 | CAP-07/SM-08/31 | CAP07/SLOT06/SM31 | SVC/FAULT | no |
| 12 DELEGATION | FR016；BR026/031~034 | CAP-08/C10/E03/SM-09 | CAP08/C10/E03 | UNIT/SVC/WRK | no |
| 13 FEEDBACK | FR011/014/016/018；BR020/033/039 | CAP-09/C11/E02/SM-10 | C11/E02 | SVC/WRK/FAULT | no |
| 14 REFLECTION | FR019；BR037/040 | CAP-09/SM-21/24 | CAP09/SM24 | UNIT/SVC | no |
| 15 CHECKPOINT | FR017/018；BR035/036/038 | CAP-10/C12/C13/SM-11 | C12/C13/SM11 | UNIT/SVC/FAULT | no |
| 16 RECOVERY | FR018/019；BR002/037~039 | CAP-10/C14/J04/J05/SM-12/28 | C14/J04/J05 | UNIT/SVC/JOB/FAULT | no |
| 17 OUTCOME | FR020；BR006/039/041/043 | CAP-11/C15/Q10/SM-13 | C15/Q10 | UNIT/SVC | no |
| 18 HANDOFF | FR020；BR041~044 | CAP-12/C16/E06/J06/Q11/SM-14 | C16/E06/J06/Q11 | SVC/WRK/JOB/FAULT | no |
| 19 PROJECTION | FR020；BR013/041/043 | CAP-12/Q12/O06/J01/SM-16 | Q12/O06/J01 | UNIT/JOB/FAULT | no |
| 20 SOURCE | FR005/008；BR009~016 | CAP-04/05/C17/E04/J02/SM-15 | C17/E04/J02 | UNIT/SVC/WRK/JOB | no |
| 21 COMMAND | FR001~020 | §§7.2/8.2 C01~C17 | C01~C17 | CON/SVC | no |
| 22 QUERY | AC007~020/030/036；VF008 | §§7.3/8.3 Q01~Q12 | Q01~Q12 | CON/SVC | no |
| 23 IN-EVENT | NFR013/015；AC025/035 | §§7.4/8.4 E01~E06 | E01~E06 | CON/WRK/FAULT | no |
| 24 OUT-EVENT | BR041~043；NFR011/018 | §§7.5/8.5 O01~O06 | O01~O06 | CON/INT/FAULT | no |
| 25 JOB | FR007/018/020；NFR003/013 | §§7.6/8.6 J01~J07 | J01~J07 | SVC/JOB/FAULT | no |
| 26 STATE-A | FR001~016；BR002/005/020/033 | §9 SM-01~10 | SM01~SM10 | UNIT | no |
| 27 STATE-B | FR005/009~020；BR035~043 | §9 SM-11~18 | SM11~SM18 | UNIT/FAULT | no |
| 28 STATE-C | FR003/006/009/011/014/018/019；BR037~040 | §9 SM-19~31 | SM19~SM31 | UNIT/FAULT | no |
| 29 LOCAL-PORT | NFR010~015；VF004/008 | §6.8.1~3、§10 | LPORT | CON/INT/FAULT | no |
| 30 EXTERNAL-PORT | FR005/008~018/020；BR016/024/028~34/044 | §6.8.4~5、§13.3 | SLOT01~13 | CON/ADAPTER/QUAL | no |
| 31 UOW | BR038/039；NFR013 | §§8.1/10 | UOW | SVC/FAULT | no |
| 32 REPLAY-CONC | NFR012~015；VF004 | §§10.3/12 | REPLAY | UNIT/FAULT | no |
| 33 ERROR | all failure semantics；VF008 | §11 | ERROR | UNIT/CON/SVC | no |
| 34 CFG-SCHEMA | NFR003/007/019；VF003/006/008 | `04` §§5/7/9 CFG-T01~05/09/13 | CFG01~05/09/13 | UNIT/CFG/STATIC | no |
| 35 CFG-RUNTIME | NFR003~006/019；BR044 | `04` §§6/7.5~7.7/9~12 | CFG06~08/10~12/14~15 | CFG/SVC/FAULT | no |
| 36 OBS-SEC | BR007/011/022/023/036/042；NFR007/010/016~019 | `03` §14 | OBS/SEC | UNIT/SVC/STATIC | no |
| 37 ENTRY-DEP | BR008/019/030/032/034/044；VF006~008 | `03` §§3~4/6.8.6/13.5 | ENTRY/DEP | CON/ENTRY/STATIC | no |

## 10. 覆盖停审与跨项审计

Step 5 的 `case candidate` / `planned evidence source` 是需求级候选槽，不是最终 runner manifest。Step 6 已完成 canonicalization：自动化、归档和正式 05 只能使用 Step 6 的 177 个 TC / 177 个 EV identity；本文件中未被 Step 6 保留的候选编号不得进入 selector、artifact、report 或验收引用。需求级 EV 可由 Step 13 通过 `requirement_refs` 聚合多个真实 raw EV，不得伪造成独立测试结果。

| 审计项 | 分母 / 结论 | 缺口 / 处理 |
|---|---|---|
| core FR | 20/20 有 primary CUT、case candidate、planned EV | none |
| peripheral FR | 4/4 单列 future_not_in_p0 | 不参与 P0 pass |
| BR | 44/44 逐项映射 | none |
| NFR | 19/19 逐项映射 | 001~003 无来源数值阈值，保持 characterization |
| AC | 36/36 有 planned evidence source | 不产生验收 verdict |
| VF | 8/8 有 executable/static veto candidate | 任一命中只供未来 06 裁决 |
| CUT | 37/37 有 requirement/rule/design 反向来源 | orphan = 0 |
| P0 自动化空洞 | 0 | human review 只做报告复核，不替代 test oracle |
| positive qualification | 13 slots/相关 owner seam 全部独立 blocked lane | `L2R-UP-001~007`、CP/ENTRY/IMPL 未闭合 |
| evidence identity | candidate slots 唯一；共享仅通过明确 source aggregation | 当前无 artifact/report/alias/run_id |
| Step 6 canonicalization | 177 TC / 177 EV；13 slot case 已有 `EV-CON-446~458` | Step 5 非 canonical 候选编号禁止进入后续门禁 |
| phase 越界 | none | local fact/attempt/receipt/delivery/observed/evidence 分层 |
| 历史 20 CUT/109 EV/旧 TC | zero inherited | removed |

## 11. 正式 §5 回填草稿

正式 §5 采用双向覆盖：20 个核心 FR、44 条 BR、19 条 NFR、36 条 AC、8 条 VF 均可追到 current design、37 个 CUT、Step 6 用例候选和 planned evidence slot；37 个 CUT 也都能反向追到需求、规则或明确的详细设计风险。4 个外围 FR 单列为 P2/future，不进入 P0 完成分母。

所有 `EV-*` 仅是 `planned_not_generated` 槽位。local/fake/blocked-aware evidence 不能关闭真实 external qualification；NFR-001~003 只形成固定 workload/profile 下的 characterization，不产生无来源数字 verdict。正式测试执行、artifact、report、evidence alias、验收裁决和 readiness 均不存在。

## 12. 进入下一步条件

```text
core_fr_coverage = 20/20
peripheral_fr_tracking = 4/4_future_not_in_p0
br_coverage = 44/44
nfr_coverage = 19/19
ac_direction_coverage = 36/36
vf_coverage = 8/8
cut_reverse_coverage = 37/37
unresolved_orphan = 0
actual_evidence_generated = false
step_status = completed_continuous_authorized
next_step = Step 6
formal_05_write_allowed = false_until_step_15
```
