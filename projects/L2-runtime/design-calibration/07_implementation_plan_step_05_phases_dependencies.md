# Step 5. 设计实施阶段与依赖顺序

> 对应 SOP：`standards/document/实施计划讨论流程_SOP.md` Step 5
> 回填目标：正式 `07-实施计划.md` §5
> 本步状态：`completed / pass-designed-with-reopened-phase-graph`
> 关键修正：显式增加 `PH-03 Runtime Loop Kernel`，旧 12 Phase / 35 boundary 集合仅保留为 `historical_material`。

## 1. 本步目标与裁决

本步把 Step 4 的对象组织成可验证功能增量，而不是按 crate 或文件平铺。Runtime 的循环推进是跨能力的唯一协调点，必须在 admission、model、action、checkpoint 等专业能力前先形成独立的 loop kernel；否则实现 agent 会在多个 service 中各自递归推进、重复 reservation 或绕过 T1/T2/T3。

本步固定：

```text
13 phases
39 canonical commit boundaries (3 per phase)
39 exit gates (GATE-01~GATE-39)
117 IMPL tasks + 117 BATCH identities (3 per boundary)
```

这些是 planned identities，不是提交、实现、测试或 readiness 事实。Step 6 负责为每个 boundary 生成 exact task/batch 内容；Step 7 负责把 test/acceptance gate 绑定到它们。

## 2. 分阶段原则

| 原则 | 本项目具体规则 |
|---|---|
| dependency first | typed vocabulary -> local consistency -> loop kernel -> capability service -> entry/tooling；调用者不得先于被调用 Port/状态/事务合同 |
| loop before capability | `RuntimeLoopCursor`、`LoopSnapshot`、`LoopActivation`、`LoopStep`、`RuntimeWakeup`、`LocalContinuation`、`HardYield`、`OperationReservation` 先闭合，再实现会被 loop 调度的业务能力 |
| local truth before projection | aggregate/history/UoW/outbox 先于 query projection、publisher、handoff 和报告 |
| record before effect | model/action/checkpoint/handoff 的 attempt/marker/fence/reservation 在外部调用前落本地 |
| negative before positive | blocked/unknown/negative fake 先验证 fail-closed；Tools/Model/Memory/Sandbox/Bus/Obs/Entry 的 positive lane 独立保持 blocked |
| tests in phase | 每个 boundary 有 owning test/check 选择器；PH-13 只完成 runner/report/handoff，不首次定义业务语义 |
| no hidden phase coupling | 后续 phase 的 result、projection、receipt 或 external status 不得作为前置 phase 的隐式输入 |
| bounded increment | phase 是可验证能力增量；单批预计超过 300 行必须拆批，超过 500 行必须调整 boundary |

## 3. Phase 依赖图

#### 依赖图: L2-runtime 13-phase implementation order

```text
PH-01 Foundation & Vocabulary
          |
          v
PH-02 Local Consistency Kernel
          |
          v
PH-03 Runtime Loop Kernel (SM-25~SM-30)
          |
          v
PH-04 Admission, Run & Plan
          |
          v
PH-05 Source, Context & Working Memory
          |
          v
PH-06 Provider-neutral Model
          |
          v
PH-07 Governed Action (SM-07/08/31)
          |
          v
PH-08 Delegation, Feedback & Reflection
          |
          v
PH-09 Checkpoint & Recovery
          |
          v
PH-10 Local Outcome & Handoff
          |
          v
PH-11 Projection, Events & Jobs
          |
          v
PH-12 Composition & Entry
          |
          v
PH-13 Quality & Handoff Tooling
```

关键说明：

- 图表达可验证增量的先后关系，不表达每个函数的完整调用链。
- `PH-11` 读取 PH-04~PH-10 已提交的 local history/outbox truth；它不能反向改变这些 aggregate。
- `PH-12` 是 facade/config/entry composition，不拥有 member-service、container、image 或 product lifecycle。
- `PH-13` 生成同一 fixed run 的 raw/report/index/draft projection；它不产生 acceptance verdict 或 signoff。

## 4. 阶段总表

| Phase | 名称 | 依赖 | 核心可验证增量 | 主要设计面 | external posture | exit gate |
|---|---|---|---|---|---|---|
| `PH-01` | Foundation & Vocabulary | none（preflight） | workspace、crate/package 命名、Core candidate、scope/ref/metadata/digest/error | CAP-01；03 §3~§4 | Core 兼容与 target repo pending | `GATE-03` |
| `PH-02` | Local Consistency Kernel | PH-01 | repository/UoW/CAS/idempotency/inbox/outbox/lease/page/Unknown | TX/UOW-01~07、REPLAY-01~06、SM-18 | 仅 local deterministic/negative | `GATE-06` |
| `PH-03` | Runtime Loop Kernel | PH-02 | activation、snapshot、closed planner、T1/T2/T3、wakeup、continuation、yield、reservation | SM-25~30、CUT-02/28/31/32 | 不调用 external owner；L2R-LANG-002 影响 Rustdoc gate | `GATE-09` |
| `PH-04` | Admission, Run & Plan | PH-03 | accepted-only admission、control、goal/plan revision/item/progress、visibility-first query | CAP-02/03、C01~03、Q01~03、SM-01~03/19~21 | Governance/Method/Hub 为 ref/read-only | `GATE-12` |
| `PH-05` | Source, Context & Working Memory | PH-04 | source snapshot、retrieval、context composition、working memory/use/compaction | CAP-04/05、C04/05/17、Q04/05、J02/03、SM-04/05/15 | durable memory/body/source positive blocked | `GATE-15` |
| `PH-06` | Provider-neutral Model | PH-05 | model intent/binding/materialization/turn/result/classification、two-UoW fence | CAP-06、C06/07、Q06、E01、SM-06/17/22/23 | provider route/secret/quota/cost forbidden; UP-004 open | `GATE-18` |
| `PH-07` | Governed Action | PH-06 | five-owner guard、action attempt/marker、record-before-call、Unknown reconcile | CAP-07、C08/09、Q07、O03、SM-07/08/31 | Tools/Hub/Gov/Sandbox positive blocked; UP-001~003 | `GATE-21` |
| `PH-08` | Delegation, Feedback & Reflection | PH-07 | strict child subset、bounded budget、result-once、feedback ordering、reflection trigger | CAP-08/09、C10/11、Q08、E02/03、SM-09/10/21/24 | member lifecycle excluded; child positive conditional | `GATE-24` |
| `PH-09` | Checkpoint & Recovery | PH-08 | Prepared/Committed split、matching receipt、recovery decision、bounded continuation/reconcile | CAP-10、C12~14、Q09、J04/05、SM-11/12/28/29 | physical checkpoint blocked by CP-001 | `GATE-27` |
| `PH-10` | Local Outcome & Handoff | PH-09 | unique local outcome、safe material、attempt/ACK/gap/reconcile | CAP-11/12、C15/16、Q10/11、E06、J06、O04/05、SM-13/14 | Bus/Obs/Artifact delivery/Observed blocked | `GATE-30` |
| `PH-11` | Projection, Events & Jobs | PH-04~10 | history-only projection/rebuild、inbound invalidation、immutable outbox、bounded publisher/jobs | Q12、E04/05、O01/02/06、J01/07、SM-16/18 | Bus/Obs routes and backend remain seams | `GATE-33` |
| `PH-12` | Composition & Entry | PH-01~11 | strict config roots/snapshot/builder、13 slots/7 jobs、API/worker/jobs facade-only entry | 04 §3~§14、entry/CFG cuts、SM-17 | Entry-001; no product/member lifecycle | `GATE-36` |
| `PH-13` | Quality & Handoff Tooling | PH-01~12 | 37 CUT, 172+5 registry, 8 suites, 9 checks, fixed-run reports/index and review drafts | 05/06 §9~§14; AC/VF/NFR/EG | G2/G3 remain blocked/not_evaluated | `GATE-39` |

## 5. 每个 Phase 的可验证增量与边界

### PH-01 Foundation & Vocabulary

| 项目 | 定义 |
|---|---|
| 输入 | Step 3 preflight、03 §3~§4、Core candidate source、目录规范 |
| 新增能力 | 可解析的 workspace contract、body-free typed identity、stable metadata/reason/digest/error；没有业务 mutation |
| 输出 | 7 member manifest candidate、Core-only dependency graph candidate、CAP-01 contracts、contract/unit test skeleton |
| 不包含 | 具体 repository、loop planner、external adapter、API route、真实 binary execution |
| stop review | package/crate/path 命名、英文 Rustdoc 冲突、Core compatibility、target repo 缺失必须可见 |

### PH-02 Local Consistency Kernel

| 项目 | 定义 |
|---|---|
| 输入 | PH-01 typed identity/error/metadata |
| 新增能力 | typed repository/UnitOfWork、expected version/CAS、reservation、inbox/outbox、lease/page、status-only Unknown |
| 输出 | local deterministic adapter/fake、crash journal、replay matrix、SM-18 job lease primitive |
| 不包含 | 专业 capability service、external call、projection authority、scheduler product |
| stop review | write-set 顺序、atomicity、lease fence、same/different digest、失败保留规则闭合 |

### PH-03 Runtime Loop Kernel

| 项目 | 定义 |
|---|---|
| 输入 | PH-02 UoW/CAS/lease/reservation contracts；03 §5.3/§6.4/§9.5 |
| 新增能力 | wakeup claim、activation CAS、consistent snapshot、closed next-operation planner、T1 prepare、T2 one-service invoke、T3 apply、continuation/yield、NoProgressGuard |
| 输出 | `RuntimeLoopApplicationService`、LoopState Ports、SM-25~30 transitions、loop fault/unit/service tests |
| 不包含 | admission policy truth、model/provider call、Tools call、checkpoint physical commit、recursive scheduler |
| stop review | 一个 run 一个 active execution、一个 step 一个 service、旧 epoch拒绝、stored result replay、无 self-wakeup spin |

### PH-04 Admission, Run & Plan

| 项目 | 定义 |
|---|---|
| 输入 | PH-03 planner and service invocation contract |
| 新增能力 | accepted-only admission、control、run/goal-plan aggregates、plan dependency/progress、Q visibility-first |
| 输出 | C01~C03/Q01~Q03 named service、history writes、loop operation mappings |
| 不包含 | method body、Governance approval mutation、context/model/action call |
| stop review | rejected admission zero run、plan graph/base CAS、query zero write、operation result feeds loop only via stored result |

### PH-05 Source, Context & Working Memory

| 项目 | 定义 |
|---|---|
| 输入 | PH-04 run/plan anchor、source/ref contracts |
| 新增能力 | source snapshot availability、retrieval candidate ordering、budgeted composition、working memory window/use/exclusion/compaction |
| 输出 | C04/05/17、Q04/05、J02/03、E04 consumer contracts |
| 不包含 | durable memory body/index/lifecycle、provider materialization、external source authority |
| stop review | source version/freshness required、working-only writes、no current substitution、bounded page/lease |

### PH-06 Provider-neutral Model

| 项目 | 定义 |
|---|---|
| 输入 | PH-05 immutable context/memory refs |
| 新增能力 | model intent/binding/materialization ref、turn/submission/result/classification、provider Unknown fence |
| 输出 | C06/07、Q06、E01、SM-06/17/22/23、model adapter Port/fake |
| 不包含 | provider SDK、route/secret/quota/cost、raw prompt/response persistence、automatic retry |
| stop review | binding before call、T1/T2 split、same identity reconcile、late result cannot rewrite newer turn |

### PH-07 Governed Action

| 项目 | 定义 |
|---|---|
| 输入 | PH-06 model decision/ref and PH-02 local UoW |
| 新增能力 | five-owner guard conjunction、action choice/precondition、attempt/marker、one invocation call after commit, SM-31 |
| 输出 | C08/09/Q07/O03、action feedback input、negative Tools/Sandbox fake |
| 不包含 | tools executor、capability registry、Governance policy truth、Sandbox isolation/cleanup |
| stop review | missing/denied/stale/unknown guard => zero call; call-before-record forbidden; Unknown status-only |

### PH-08 Delegation, Feedback & Reflection

| 项目 | 定义 |
|---|---|
| 输入 | PH-07 action/feedback envelope and loop continuation |
| 新增能力 | strict parent subset, bounded child request/result, once-only feedback incorporation, reflection decision |
| 输出 | C10/11/Q08/E02/03、SM-09/10/21/24、child boundary refs |
| 不包含 | member-service container/image lifecycle、method execution body、shared mutable child state |
| stop review | parent scope subset、budget/depth finite、receipt before ACK、duplicate/late/mismatch quarantine |

### PH-09 Checkpoint & Recovery

| 项目 | 定义 |
|---|---|
| 输入 | PH-08 committed feedback/reflection and PH-02 UoW |
| 新增能力 | checkpoint candidate/prepared/commit receipt, recovery decision, matching fence, bounded continuation/resume/reconcile |
| 输出 | C12~14/Q09/J04/05、SM-11/12、recovery Port/fake |
| 不包含 | physical checkpoint backend readiness、blind retry、resume from Prepared/Unknown without proof |
| stop review | only matching receipt -> Committed; Unknown/manual fence retained; cursor/lease page cannot skip |

### PH-10 Local Outcome & Handoff

| 项目 | 定义 |
|---|---|
| 输入 | PH-09 terminal/recovery truth and immutable history |
| 新增能力 | one local outcome, terminal proof, safe body-free material, handoff attempt/ACK/gap/reconcile |
| 输出 | C15/16/Q10/11/E06/J06/O04/05、SM-13/14 |
| 不包含 | delivery/Observed/acceptance/evidence truth, Artifact body, downstream status promotion |
| stop review | local outcome precedes external handoff; ACK != delivery; gap never self-closes; exact material digest |

### PH-11 Projection, Events & Jobs

| 项目 | 定义 |
|---|---|
| 输入 | PH-04~PH-10 committed records/outbox and owner refs |
| 新增能力 | history-only projection, invalidation, contiguous cursor rebuild, immutable O01/O02/O06, bounded J01/J07 and E04/E05 consumers |
| 输出 | Q12, event materializers, projection/job adapters, replay/rebuild tests |
| 不包含 | projection writeback to domain, broker/backend truth, Observed/evidence claims |
| stop review | producer truth immutable, cursor CAS contiguous, lease loss stops, route/delivery status stays separate |

### PH-12 Composition & Entry

| 项目 | 定义 |
|---|---|
| 输入 | all prior Port/service contracts; 04 typed config and entry rules |
| 新增能力 | whole-document config parse/validate/snapshot, 13 slots/7 jobs, builder, API/worker/jobs facade-only mapping |
| 输出 | strict config objects, EntryAuthority, named handlers/consumers/runners, dependency/static scans |
| 不包含 | provider/DB/broker/framework selection, member lifecycle, TestFake in production profile, `Ready` fabrication |
| stop review | one immutable snapshot per operation, no constructor I/O, exact 17/12/6/6/7 surface, only Core compile |

### PH-13 Quality & Handoff Tooling

| 项目 | 定义 |
|---|---|
| 输入 | all implemented local contracts and formal 05/06 manifests |
| 新增能力 | exact 37 CUT/177 TC-EV registry, 8 suites, 9 checks, fixed-run raw/report/index, four acceptance drafts |
| 输出 | scripts, run-scoped artifacts/reports, mechanical evidence index, review-required handoff |
| 不包含 | real G2/G3 qualification, acceptance verdict/signoff/readiness, static evidence or cross-run merge |
| stop review | same-run/digest-bound, failed/blocked retained, no empty selector, G2/G3 separate namespaces |

## 6. Phase exit gate 预分配

| Phase | boundary gate chain | exit gate | gate meaning |
|---|---|---|---|
| PH-01 | GATE-01~03 | GATE-03 | workspace, vocabulary and only-Core candidate checks are designed; target repo/Core/Lang blockers remain explicit |
| PH-02 | GATE-04~06 | GATE-06 | local Port/UoW/replay/lease/Unknown kernel is internally coherent |
| PH-03 | GATE-07~09 | GATE-09 | loop T1/T2/T3, state 25~30, wakeup/yield/reservation are independently testable |
| PH-04 | GATE-10~12 | GATE-12 | admission/run/plan operations map to closed planner and zero-write queries |
| PH-05 | GATE-13~15 | GATE-15 | source/context/working memory is bounded and durable owner remains ref-only |
| PH-06 | GATE-16~18 | GATE-18 | model provider-neutral two-phase and Unknown fence are closed locally |
| PH-07 | GATE-19~21 | GATE-21 | action guards/attempt/SM-31 enforce record-before-call and fail-closed |
| PH-08 | GATE-22~24 | GATE-24 | delegation/feedback/reflection enforce subset, ordering and once-only incorporation |
| PH-09 | GATE-25~27 | GATE-27 | checkpoint/recovery preserves Prepared/Committed/Unknown and bounded continuation |
| PH-10 | GATE-28~30 | GATE-30 | unique local outcome and handoff/gap material are immutable and local-first |
| PH-11 | GATE-31~33 | GATE-33 | projection/events/jobs consume truth without reverse mutation |
| PH-12 | GATE-34~36 | GATE-36 | config/slot/entry composition is strict, facade-only and denominator exact |
| PH-13 | GATE-37~39 | GATE-39 | local quality tooling and review-only handoff projections are mechanically specified |

Exit gate status is always `pass-designed` at most; actual gate/run/artifact/report/evidence status remains `not_run/not_generated` until a future authorized implementation.

## 7. Phase 停审与跨 phase 审计

### 7.1 Phase stop-review checklist

每个 Phase 结束必须逐项审查：

1. 新增能力是否可以用本 Phase 的 owning CUT、TC 和 negative oracle 独立验证。
2. 所有输入是否来自已完成前置 Phase 或显式 owner ref；没有偷用后续 Phase 的 result/receipt/projection。
3. 本 Phase 的写集、状态、UoW、idempotency 和 error recovery 是否回指正式 03。
4. 外部依赖是否只以 declared `runtime/event/ref/adapter/fake` seam 出现。
5. 适用的 AC/VF/NFR/EG 和 nine checks 是否有 owner；缺失即 blocker。
6. 失败、Unknown、blocked、not-run 是否保留，不得被 phase exit 汇总成绿灯。

### 7.2 跨 phase 依赖闭环审计

| 审计关系 | 结论 |
|---|---|
| PH-01 -> PH-02 | typed IDs/errors/metadata 是所有 local records 的唯一输入；无 generic `save` |
| PH-02 -> PH-03 | UoW/CAS/lease/reservation 提供 T1/T3 和 stale fence；loop 不自建第二事务语义 |
| PH-03 -> PH-04 | planner 只调已注册 operation；admission/plan 结果以 stored result 返回，不递归调用 loop |
| PH-04 -> PH-05 | context/memory 只消费 committed run/plan/source refs；不重新定义 admission |
| PH-05 -> PH-06 | model input 绑定 context snapshot/digest；没有 current view 替代 |
| PH-06 -> PH-07 | action choice 来源于 typed model decision；guard 不将 choice 当 execution |
| PH-07 -> PH-08 | child/feedback 依赖 recorded attempt/feedback identity；无 direct call bypass |
| PH-08 -> PH-09 | recovery 只消费 committed feedback/reflection and loop cursor；不重放未知 effect |
| PH-09 -> PH-10 | outcome 只在 terminal proof/closed fence 后创建；handoff 不改变 outcome |
| PH-10 -> PH-11 | event/projection/job 只消费 immutable history/outbox；不写回 domain truth |
| PH-11 -> PH-12 | entry/builder 只组装既有 Ports/services；不添加隐藏 lifecycle or adapter truth |
| PH-12 -> PH-13 | tooling 读取 exact manifest/handlers/config；不缩分母或生成静态 evidence |

### 7.3 Blocker propagation

| blocker | first affected phase | propagation rule |
|---|---|---|
| `L2R-IMPL-001` / target repo absent | PH-01 | all phases remain planned; no implementation activation |
| `L2R-LANG-001` / `L2R-LANG-002` | PH-01/03 and any Rustdoc/build boundary | source conflict/toolchain mismatch => `wait_design`; do not choose silently |
| `L2R-UP-004` model | PH-06 | local provider-neutral/negative may proceed; positive qualification blocked |
| `L2R-UP-001~003` Tools/Hub/Sandbox | PH-07/08 | zero-call/blocked paths only; no readiness promotion |
| `L2R-UP-005` memory | PH-05 | working-only and ref-only; durable positive blocked |
| `L2R-CP-001` checkpoint | PH-09 | Prepared/Unknown/manual only; no physical qualification |
| `L2R-UP-002/006/007` Bus/Obs/route | PH-10/11/13 | local material/attempt/gap and fake only; delivery/Observed/evidence positive blocked |
| `L2R-ENTRY-001` | PH-12 | typed fixture/facade only; production entry positive blocked |

## 8. Step 门禁

| 检查 | 结论 |
|---|---|
| Phase 是可验证增量而非对象/文件清单 | `pass-designed` |
| Loop Kernel 明确独立且先于 capability | `pass` |
| SM-25~30 与 SM-31 有明确归属 | `pass` |
| 13 Phase / 39 boundary / 39 gate identity 预分配 | `pass-designed` |
| external dependency type、blocker propagation、fail-closed | `pass-designed` |
| phase stop-review 和跨 phase audit | `pass-designed` |
| actual implementation/run/evidence/commit | `none/not_started` |

```text
step_05 = completed
next_allowed_action = rebuild_step_06_tasks_batches_boundaries
formal_07_write_allowed = false
```
