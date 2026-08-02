# L4-sandbox 实施计划 Step 9 定义Spike、风险与待确认事项

> 对应SOP: `standards/document/实施计划讨论流程_SOP.md` Step 9
> 书写规范: `standards/document/实施计划书写规范.md` §5.9
> 回填章节: `07-实施计划.md` §9 Spike、风险与待确认事项
> 创建日期: 2026-07-17
> 状态: completed_reviewed_passed_to_step_10
> 分件: `07_implementation_plan_step_09_risk_spike_register.md`;`07_implementation_plan_step_09_boundary_risk_matrix.md`
> 本Step口径: 将正式`01/03/04/05/06`与已审查Step 3 /5~8中的实施不确定性收敛为有界Spike、风险和待确认事项,并绑定14个phase、32个commit boundary及future gate。本Step不重新定义schema、port、state、config、TC、AC / VETO,不执行Spike,不接受风险,也不创建正式`07`、implementation ledger、boundary skeleton、目标仓代码、commit、run、evidence、测试 /验收结果、review或签署。

---

## 1. Step状态与三层开工门禁

| 门禁层 | 检查结果 | 裁决 |
|---|---|---|
| 项目级台账 | 原恢复点为`07 / Step 8 / completed_pending_user_review`;用户已明确“同意”。 | passed_for_step_9 |
| 文档级flow | Step 1~8已依次审查传递;Step 9是唯一合法下一步。 | passed_for_step_9 |
| Step级输入 | 正式`01/03/04/05/06`和已审查Step 3 /5~8可共同给出风险来源、phase / boundary、依赖、门禁和不可接受闭集。 | passed_for_risk_planning |
| 正式文档写入 | 本Step只形成§9回填草稿;正式`07`只能由Step 13装配。 | forbidden_in_step_9 |
| ledger / skeleton实例 | Step 6已定义schema;实例仍只能在Step 13与正式`07`同步创建。 | forbidden_until_step_13 |
| runtime事实 | 当前无实现、Spike run、风险关闭、risk acceptance、environment、candidate、evidence、review或签署。 | absent_not_adjudicated |
| 下游Step | 用户已确认Step 9,Step 10获得一次性放行。 | passed_to_step_10 |

当前恢复点:

```text
current_document = `07-实施计划.md`
current_step = Step 9 `定义Spike、风险与待确认事项`
current_module = `implementation_spikes_risks_open_questions_review`
gate_status = completed_reviewed_passed_to_step_10
next_allowed_action = 由Step 10承接;若变更控制审计发现风险转换冲突则回退本Step
formal_07_created = no
implementation_ledger_created = no
planned_boundary_skeleton_created = no
implementation_repo_exists = no
```

### 1.1 Step内计划

| 顺序 | 动作 | 状态 | 完成门禁 |
|---:|---|---|---|
| 1 | 回写Step 8审查通过,读取Step 9规范、指定正式章节和参考仓Step 9。 | done | 唯一恢复点和最小规范输出明确 |
| 2 | 区分已由正式`03~06`关闭的旧待确认项、现实前置、技术可行性不确定项和future residual。 | done | 不复活historical问题,不把future claim变current blocker |
| 3 | 建立15个Spike、20个风险和18个待确认事项的完整登记。 | done | 每项有owner、输出 /缓解、截止点与默认安全处置 |
| 4 | 对HDO、14个phase和32个boundary逐项反查。 | done | 无orphan,不改变Step 5 /6顺序 |
| 5 | 固定blocker / conditional / DesignReopen / risk acceptance转换和上游回写规则。 | done | 实现者无需现场决定如何处置风险 |
| 6 | 形成正式§9草稿、自检并停在Step 9。 | done | 不进入Step 10 |

## 2. 本步目标、输入与权威边界

### 2.1 本步目标

1. 前置识别会导致返工、延期、安全失真、truth污染、evidence伪造或设计回写的实施不确定性。
2. 只把需要最小实验才能回答的技术问题登记为Spike,并固定问题、最小实验、输出、owner、停止条件和最迟关闭boundary。
3. 为风险固定概率 /影响、trigger、owner、缓解、fallback、升级条件和exact截止点。
4. 为外部决策输入固定decision owner、所需decision artifact、截止boundary和未确认时的默认安全处置。
5. 把`wait_design`、`dependency_wait`、`fix_gate_failure`、`Blocked`、`NotRunConditional`、DisclosureOnly、MandatoryBlocker、DesignReopen和Prohibited路由统一为可执行规则;其中`dependency_wait`是原因分类,台账动作固定映射为`handoff`。
6. 对HDO、14 phase和32 boundary做风险反查,为Step 13 planned skeleton预留完整风险refs。

### 2.2 输入表

| 输入 | 当前状态 | 本Step用途 | 不得改写 |
|---|---|---|---|
| 正式`01` §15 / §17 | reviewed architecture | 架构红线、旧待确认项、ADR长期决定与阻塞转换 | 独立isolation truth、coherent boundary、fail-closed、only-core和职责边界 |
| 正式`03` §16~§17 | reviewed detailed design | 实施前检查、target / core /product / fake parity风险及设计回写owner | 七crate、55协议、30个owner-level state machines /31个Step 10 canonical status enum entries /39个Step 6 shared status declarations、38错误、port / flow / UoW契约 |
| 正式`04` §12.13 / §14 | reviewed config design | blocker层级、profile / material / product residual和future trigger | S00~S08、I001~I101、40组、D01~D44、PROFILE-01~07 |
| 正式`05` §11~§14 | reviewed test design | S / A / B、Blocked / InfraFailed / conditional、复验、证据失效与残余风险 | 254 TC、16 suite、7 gate、17 script、21 slot、九schema |
| 正式`06` §11~§14 | reviewed acceptance design | 17 VETO、risk route / RAQ、不可接受闭集、最终结论分权 | VETO predicate、风险接受资格、三值裁决与签署边界 |
| Step 3 | completed_reviewed | PRE-SBX-001~013、repo / tool / baseline现实核验和最迟关闭点 | 已登记现实事实与前置owner |
| Step 5 | completed_reviewed | HDO、PH-01~14、PH-QP和phase依赖 | phase数量、顺序、P0-C /P0-Q正交关系 |
| Step 6 | completed_reviewed | 32 boundary、closure profile、Gate和planned skeleton schema | boundary数量、顺序、allowed / forbidden scope |
| Step 7 | completed_reviewed | exact suite / gate / artifact / report / review及失败传播 | G0~G4成熟度与不得伪造事实 |
| Step 8 | completed_reviewed | 配置、ENV / PROFILE、fake / candidate、material、CI和依赖不可用处置 | 9 /40 /101 /44 /10 /23 /7 /14 /32准备结论 |
| L1-governance / L1-artifact Step 9 | granularity reference | 参考主件结构、boundary绑定和回写触发粒度 | 不继承其领域对象、编号、阶段数或自动跨Step规则 |

权威优先级固定为: 正式`01/03/04/05/06` -> 已审查Step 3 /5~8 -> 本Step风险编排。若风险处理需要新增或改变owner契约,必须回写对应正式文档并使受影响downstream结论失效;本Step不能通过风险文字补设计。

### 2.3 已关闭旧问题与当前开放项分判

| 来源事项 | 当前分判 | 理由 /承接 |
|---|---|---|
| 架构层API / DTO / state / storage / handoff细节未定 | closed_by_current_03_to_06 | 新版正式`03~06`已经闭合当前P0 callable surface、状态、配置、测试和验收;不得按旧`01`重新挂起 |
| Docker /gVisor /Firecracker、旧seccomp /AppArmor清单和旧P95 /SLA | historical_material | 只保留候选 /差异线索;不成为Spike问题或实现默认 |
| design baseline、HDO、目标仓、Rust / core compatibility | open_before_handoff_or_01A | 现实输入尚未形成,只阻塞HDO /01A |
| canonical JSON和Shell rule | open_before_02C_or_02D | 只阻塞exact tooling boundary,不阻塞前序contract /persistence设计 |
| candidate /provider /material /lab | open_before_13A_or_13B | 不阻塞P0-C;P0-Q保持Blocked +0 launch |
| CI binding与真实source invocation | open_before_future_execution | 不阻塞14A local fixture capability;禁止CI /source claim |
| P06完整composition | inactive_conditional | `NotRunConditional`;不得补P0 |
| P07 /production | inactive_future | 当前activation reject;任何请求触发DesignReopen |
| retention物理carrier /TTL、fleet /soak、alert /rollout | disclosure_or_future_trigger | current只保留condition guard /proof ceiling;权威claim形成后转MandatoryBlocker或DesignReopen |

## 3. SOP 6项问题回答

| SOP问题 | 回答 |
|---|---|
| 1. 哪些技术点需要先做Spike? | 只对bootstrap /core shared surface、RFC 8785、Shell规则、config assembly、Context->Boundary->Policy->Run source closure、fake parity、cleanup race、Query finder、Consumer /Event snapshot、Job stored report、source role、P0-Q packet /lifecycle和no-static report generation做15个有界Spike。产品选择本身是decision input,测试执行本身是正式gate,二者都不是Spike。 |
| 2. 哪些风险会阻塞某个阶段? | HDO /baseline /target /core阻塞01A;canonical与Shell分别阻塞02C /02D;设计闭口、truth /安全 /redaction /idempotency风险阻塞其exact capability boundary;P0-Q输入阻塞13A /13B;role /pairing /static evidence阻塞12B /14A~14C。P06 /P07和future ops claim不反向阻塞当前P0。 |
| 3. 哪些待确认事项会影响提交边界或验收门禁? | 18项decision input覆盖baseline /repo /toolchain、canonical /Shell、candidate /template /provider /lab、CI /fixed source /acceptance authority、retention、P06 /P07、real product /runbook和Step 13 skeleton承接。每项均有exact deadline和默认安全处置。 |
| 4. 每个Spike的输出是什么? | 输出只能是decision note、mapping / source matrix、closure checklist、fixture corpus、call-budget / race schedule、stored report mapping或report-generation audit。每项都必须能由review确认问题已回答,不得只留口头结论或把正式测试结果当Spike输出。 |
| 5. 每个风险的处理方式和截止点是什么? | 分件登记20项风险,逐项给出P / I、trigger、owner、mitigation、fallback / escalation和deadline;boundary分件将其反查到HDO、14 phase与32 boundary。没有无限期“后续确认”。 |
| 6. 哪些风险需要回写上游设计? | 任何scope / ownership、field / DTO / ref / state / error / port / flow / UoW、config / profile / material、TC / ENV / gate / schema、AC / VETO /risk authority或phase /boundary契约缺口都回写其正式owner。实现者不得以private mapper、local enum、fake map、script default或手写report补口。 |

## 4. 当前材料问题诊断

| 诊断ID | 当前问题 | 影响 | 本Step处理 |
|---|---|---|---|
| `DIAG-SBX-09-01` | 风险分散在正式`01/03/04/05/06`与Step 3 /5~8,状态层级和deadline不统一。 | 实现agent可能无法判断何时暂停、等待依赖或回写设计。 | 建立15 /20 /18登记和统一转换词汇。 |
| `DIAG-SBX-09-02` | Step 6有32 boundary,但开放前置主要聚合在少数表中。 | planned skeleton若只复制全局风险,会反复要求设计者解释exact blocker。 | 建立32 /32 boundary风险矩阵。 |
| `DIAG-SBX-09-03` | 旧架构待确认项与新版`03~06`已闭口结论并存。 | 可能复活已关闭schema /state问题或把历史产品当current truth。 | 明确closed / historical / current-open / future-trigger四分法。 |
| `DIAG-SBX-09-04` | Spike、实现、测试执行和product decision容易混用。 | 可能用scratch结果宣称boundary完成或资格通过。 | Spike限定为有界closure experiment,无Build / Test / Evidence证明力。 |
| `DIAG-SBX-09-05` | risk acceptance在正式`06`有严格资格,实施计划若写“接受风险继续”会越权。 | S /A、VETO、P0 /evidence缺口可能被错误放行。 | risk acceptance不是实施fallback;只路由future实际authority,当前0 accepted。 |
| `DIAG-SBX-09-06` | 正式`04/05/06`下游动态状态仍停在Step 8待审。 | 项目恢复点与上游文档状态不一致。 | 记为动态状态冲突;仅受控回写Step 9进度和变更记录,不改契约。 |

没有发现要求回写正式`01/03/04/05/06`契约才能完成Step 9的冲突。`DIAG-SBX-09-06`只涉及下游进度,不是schema、profile、TC、AC或VETO owner冲突。

## 5. 改动前后对比与设计取舍

### 5.1 改动前后对比

| 关注点 | Step 9前 | Step 9后 |
|---|---|---|
| Spike | 技术不确定性散落在前置 /boundary说明 | 15项,每项有问题、最小实验、输出、owner、deadline和失败动作 |
| 风险 | 正式文档各自按领域登记 | 20项实施风险统一P / I、trigger、mitigation、fallback和exact gate |
| 待确认 | 多owner输入分散,部分只写future | 18项decision input均有owner、artifact、deadline和默认安全处置 |
| Boundary | 32项已有scope /gate /dependency,无统一risk refs | HDO +32 /32逐项绑定SP /R /OQ和转换动作 |
| 历史问题 | 旧`01`待确认与新版闭口项易混 | 已关闭不重开,historical不成为事实,future claim按trigger转换 |
| 风险接受 | 可能被误读为实施继续手段 | S /A、VETO、P0、前置、evidence均Prohibited /MandatoryBlocker |
| 实现者责任 | 可能需现场判断缺口归类 | 只二次核验和报告;设计者预先固定owner与next action |

### 5.2 设计取舍

| 方案 | 优点 | 风险 /缺点 | 结论 |
|---|---|---|---|
| 所有开放项都做Spike | 看似保守 | 用实验替代owner决策和正式测试,范围失控 | 不采用 |
| 只对“需要实验才能回答”的技术问题做Spike | 输出可判定,不越权 | 需要严格区分decision input | 采用 |
| 风险只绑定phase | 文档较短 | 无法知道哪个boundary必须停 | 不采用 |
| 主登记 + 32-boundary矩阵 | 可读且可落入skeleton | 需要双向计数审计 | 采用 |
| 未决产品全部阻塞P0 | 避免任何外部不确定 | 错误耦合P0-C与P0-Q /future | 不采用 |
| exact scope路由 | P0-C继续,13A /13B与future claim诚实阻塞 | 状态规则更严格 | 采用 |
| 以risk acceptance作为fallback | 推进快 | 越过正式`06`,可放行不可接受项 | 禁止 |

## 6. 结构化中间产物

### 6.1 产物拆分

| 产物 | 文件 | 核心内容 | 状态 |
|---|---|---|---|
| 主件 | 本文件 | 输入、分类、转换、上游回写、正式§9草稿与停审 | completed_pending_user_review |
| Spike / Risk / OQ登记 | `07_implementation_plan_step_09_risk_spike_register.md` | 15 Spike、20 Risk、18 OQ及关闭记录要求 | completed_supporting_register |
| Boundary风险矩阵 | `07_implementation_plan_step_09_boundary_risk_matrix.md` | HDO、14 phase、32 boundary风险绑定与传播算法 | completed_supporting_register |

三个文件共同构成Step 9中间产物。正式§9保留可执行主表与分件入口;Step 13 skeleton必须消费全ID,不得压缩成“遇到风险暂停”。

### 6.2 分类判定算法

```text
for each implementation uncertainty:
  if the current formal owner contract is missing or conflicting:
    classify = design_blocker
    gate_status = blocked
    next_allowed_action = wait_design

  else if a bounded experiment is required to choose among design-compatible mechanisms:
    classify = spike
    require question + minimum experiment + output + owner + deadline

  else if an external owner must decide a product, authority, environment or identity:
    classify = open_question
    require decision artifact + deadline + default safe disposition

  else if a failure mode can occur during implementation or execution:
    classify = risk
    require probability + impact + trigger + mitigation + fallback + escalation

  if the item concerns inactive P1 / P2 without a current claim:
    preserve NotRunConditional or DisclosureOnly

  if the item requests P07 / production / unsupported public or config semantics:
    require DesignReopen

  never classify test execution, acceptance adjudication or product selection itself as a Spike
```

### 6.3 Blocker与风险转换

| 当前事实 / trigger | 转换 | 影响范围 | 恢复条件 |
|---|---|---|---|
| 设计字段 /source /flow不唯一 | `blocked / wait_design` | exact boundary及依赖其输出的后序planned boundaries | owner正式文档 + calibration回写,新baseline,重复Design Gate |
| target /core /外部tool /required harness缺失 | `dependency_wait`;台账`blocked / handoff` | exact Activation Gate | 真实依赖可定位并通过precheck;不伪造ready |
| Spike未形成reviewed closure record | blocker at deadline | 绑定boundary | 输出符合登记schema;结论为supports /writeback /wait dependency之一 |
| OQ超过deadline未确认 | 执行该项default safe disposition | 绑定boundary /source | actual decision ref与owner /baseline可定位 |
| P0-Q packet任一identity缺失 | source `Blocked` | `13A/13B`,后序RELEASE | 完整同一P05 /ENV-05 immutable packet;probe /launch在此前为0 |
| P06未激活 | `NotRunConditional` | GATE-P1 only | future正式activation与完整composition |
| P07 /production被请求 | DesignReopen | 正式`00~07`及后续资格 | 重建scope、security、config、test、acceptance和implementation baseline |
| S /A、VF /VETO、P0 Failed /Blocked或evidence缺口 | Prohibited / MandatoryBlocker | gate /source /release /acceptance | 修复、按L-R1~L-R5复验或补前置;不能risk accept |
| 非P0 residual且RAQ全满足 | future AcceptanceCandidate | acceptance process only | actual authority /owner /deadline /review;本Step不预判Accepted |

### 6.4 Risk acceptance边界

- 当前`reports/acceptance/risk-acceptance.md`不存在,无fixed RELEASE、actual owner /acceptor、deadline、review或Accepted记录。
- 本Step所有风险只处于designed catalog状态;不得写`Accepted`、`NotApplicableByScope`、`accepted_set = empty`或“风险已关闭”。
- target repo、suite / CI、ENV-02~05、candidate、provider、lab和mandatory source缺失是blocker,不是可接受风险。
- 17 VETO任一非`NotTriggered`、open S / A、P0-C /P0-Q缺口、identity /raw /report /digest /pairing /redaction /no-static /review缺口全部禁止接受。
- 只有future正式`06`流程认定的非P0 residual才可能成为AcceptanceCandidate;实施计划只能提供follow-up boundary /runbook入口,不能选择acceptor或改写gate。

### 6.5 需要回写上游设计的触发

| 触发 | 首要回写owner | 级联复核 | 不允许的实现侧处理 |
|---|---|---|---|
| Sandbox职责扩入tools semantics、runtime loop、member lifecycle或下游truth | 正式`00/01`;必要时`02` | `03~07`受影响范围全部重开 | 增加business trait /compile dependency后再补文档 |
| 对象字段、DTO /ref kind、state /error、port /repository、function flow、UoW /idempotency不闭合 | 正式`03`对应章节和calibration | `04/05/06/07`受影响owner /boundary | private field /enum /mapper、scan、常量version、重算stored result |
| source /profile /item /domain /material /adapter mode /generation语义缺失 | 正式`04`;若需public runtime surface先回`03` | `05/06/07`配置与环境门禁 | implicit default、raw env /file fallback、private mode enum |
| 新场景 /断言、ENV /PROFILE、suite /gate、script /schema /path不闭合 | 正式`05`;契约缺失先回更上游 | `06/07`evidence /acceptance mapping | 临时TC、同义report路径、static result |
| AC /VETO predicate、risk route、decision /review /signature authority不闭合 | 正式`06`;底层行为缺口先回`03~05` | `07` gate /handoff与future acceptance | generator默认裁决、手工VETO、self-acceptance |
| phase、boundary、allowed scope、required checks或single-current规则不闭合 | 当前`07`对应Step 5~9;Step 13后回正式`07` | implementation ledger与所有受影响skeleton | 实现agent临场新增 /合并boundary或并行current |
| candidate选择要求新SDK-facing port、callback、hot swap、dynamic source或shared material cache | 正式`03/04`及架构ADR | `05/06/07`资格链 | 在13A adapter内顺手扩surface |
| P07 /production进入scope | 正式`00~04` full DesignReopen | 重建`05/06/07`和future ops | 把P06 /P05结果升级为production evidence |

上游回写后必须同步项目台账、对应文档flow和Step文件,记录失效范围与新的design baseline。只在对话中确认或只修改implementation ledger不能关闭设计blocker。

### 6.6 跨对象审计摘要

| 审计对象 | 设计数量 | 已登记 /映射 | 结论 |
|---|---:|---:|---|
| SOP问题 | 6 | 6 | answered |
| Spike | 15 | 15 | 每项有最小实验、输出、owner、deadline |
| Risk | 20 | 20 | 每项有P /I、trigger、mitigation、fallback、deadline |
| Open Question | 18 | 18 | 每项有decision owner、artifact、deadline、默认处置 |
| HDO | 1 | 1 | 风险入口完整 |
| Phase | 14 | 14 | proof ceiling和phase完成禁语完整 |
| Commit Boundary | 32 | 32 | 全量SP /R /OQ refs和未关闭动作完整 |
| 17 VETO | 17 | 17 | 通过正式`06`不可接受闭集与风险族映射,不预判disposition |
| 254 TC /16 suite /7 gate /21 slot /九schema | 正式Step 7已闭合 | 风险owner绑定12B /13B /14A~14C | 无新编号 /结果 |

## 7. 正式`07` §9回填草稿

以下内容只作为Step 13装配输入。正式§9必须保留全ID、影响phase /boundary、处理方式和截止点;详细字段继续引用两个Step 9分件,不得把planned closure写成已执行事实。

> 校准来源:
> - `design-calibration/07_implementation_plan_step_09_spikes_risks_open_questions.md`
> - `design-calibration/07_implementation_plan_step_09_risk_spike_register.md`
> - `design-calibration/07_implementation_plan_step_09_boundary_risk_matrix.md`
>
> 延伸阅读:
> - 建议继续阅读主件的“分类判定算法”“Blocker与风险转换”“Risk acceptance边界”“需要回写上游设计的触发”,风险登记分件的完整Spike / Risk / OQ表,以及boundary分件的32 /32风险矩阵,了解每项不确定性如何绑定future gate。

### 9.1 风险处理原则

实施不确定性分为Spike、Risk和Open Question。Spike只回答需要有界实验验证的技术可行性问题,不替代正式实现 /测试;Risk固定trigger、缓解、fallback和升级;Open Question由外部decision owner在exact boundary前关闭。设计缺口走`blocked / wait_design`;现实依赖缺失记`dependency_wait`原因并走`blocked / handoff`;当前allowed scope可修复门禁失败走`blocked / fix_gate_failure`;P0-Q identity缺失保持`Blocked + 0 launch`,P06保持`NotRunConditional`,P07 /production进入scope必须DesignReopen。

### 9.2 Spike主表

| Spike | 问题组 | 影响Boundary | 必需输出 | 最迟关闭 |
|---|---|---|---|---|
| `SP-SBX-IMP-001~002` | bootstrap /core shared surface | `01A`,`02A` | decision note、workspace /type mapping、compatibility checklist | `01A` /`02A` Design Gate前 |
| `SP-SBX-IMP-003~004` | RFC 8785与Shell规则 | `02C`,`02D`,`14A~14B` | 选择记录、fixture、approved lint /safe failure规则 | `02C` /`02D` Activation前 |
| `SP-SBX-IMP-005~008` | config assembly、command source closure、fake parity、safety race | `03A~08B`,`11C`,`12B` | constructor graph、source matrix、parity fixture、race /disposition表 | 各首个owner boundary前;`12B`全量关闭 |
| `SP-SBX-IMP-009~011` | Query /Consumer /Event /Job可落码闭环 | `09A~11C` | 13 Query source、9 /13 mapping、10 Job stored report /UoW矩阵 | 各boundary Design Gate前 |
| `SP-SBX-IMP-012` | P0-C source role separation | `12B`,`14A` | role identity与three-source fixture | `12B` Evidence Gate前 |
| `SP-SBX-IMP-013~014` | P0-Q immutable packet与lifecycle disposition | `13A`,`13B` | packet /identity negative cases、product /lab disposition | `13A` /`13B` Activation /Design前 |
| `SP-SBX-IMP-015` | no-static gate /report /evidence /draft | `14A~14C` | generation audit、pairing /EV denial与draft-only checklist | `14A` Design前;`14C`提交前全量关闭 |

### 9.3 风险主表

| Risk组 | 影响面 | 处理方式 | 截止点 |
|---|---|---|---|
| `R-SBX-IMP-001~003` | HDO、repo /core、baseline /boundary漂移 | HDO + exact precheck;缺设计`blocked / wait_design`,缺现实依赖记`dependency_wait`并`blocked / handoff` | `01A`及每boundary开工前 |
| `R-SBX-IMP-004~011` | scope /依赖、fake、config、identity /boundary /policy、redaction、truth分层、no-write /no-repair、stored replay | dependency /scope /parity /redaction /write /call-budget gate;命中S /VETO即阻断 | 各owner boundary Test /Handoff Gate |
| `R-SBX-IMP-012` | P0-Q candidate /provider /lab | exact P05 packet,anti-substitution,0-launch preflight | `13A/13B`前 |
| `R-SBX-IMP-013~015` | source role、static evidence、CI /execution成熟度 | fixed identity /pairing /blocked propagation /no-static;能力与执行分层 | `12B`,`14A~14C`及future source前 |
| `R-SBX-IMP-016~018` | P06 /P07、ops physical claim、risk acceptance误用 | conditional /DisclosureOnly /DesignReopen;正式`06`不可接受闭集 | current handoff披露;future claim前 |
| `R-SBX-IMP-019~020` | identity失效与historical污染 | baseline固定、结果失效 /复验、current-only required reads | 每boundary /fixed run前 |

### 9.4 待确认事项主表

| OQ组 | 决策面 | 最迟关闭 | 未确认处置 |
|---|---|---|---|
| `OQ-SBX-IMP-001~005` | baseline /repo /Rust /core /canonical /Shell | HDO、`01A`,`02C`,`02D`前 | `wait_design`或`dependency_wait`原因 + `handoff`;当前scope工具修复可走`fix_gate_failure` |
| `OQ-SBX-IMP-006~009` | candidate /template /provider /material /lab | `13A/13B` Activation前 | P0-Q Blocked,probe /launch=0 |
| `OQ-SBX-IMP-010~012` | CI /fixed source /acceptance authority | future真实source /FormalEntry /DecisionReady前 | 只保留fixture /draft能力,无run /review /裁决claim |
| `OQ-SBX-IMP-013~017` | retention、P06 /P07、real products、soak /alert /rollout | current handoff披露;future claim前 | condition guard /NotRunConditional /DisclosureOnly或DesignReopen |
| `OQ-SBX-IMP-018` | Step 13 skeleton风险ref | Step 13 HDO前 | 缺映射不得移交实现 |

### 9.5 Risk acceptance与设计回写

风险接受不是implementation fallback。S /A、VF /VETO、P0 Failed /Blocked /InfraFailed、target /suite /CI /ENV /candidate /provider /lab前置缺失,以及identity /raw /report /digest /pairing /redaction /no-static /review缺口均不可接受。发现schema、source、state、port、config、TC、AC /VETO或boundary无法1:1落码时,必须暂停并回写正式owner,固定新baseline后重跑受影响Design Gate;实现agent不得自行补真相源。

## 8. Blocker、待确认事项与上游影响

### 8.1 开放但不阻塞Step 9设计停审的现实前置

| 前置 / blocker | Exact boundary / gate | 当前状态 | 未关闭时处理 |
|---|---|---|---|
| design baseline / HDO-SBX-00 | HDO /`01A` Activation | open_before_handoff | `wait_design`;不创建目标仓 |
| target repo /Rust /core exact compatibility | `01A` | open_before_bootstrap | 设计冲突`wait_design`;现实依赖`dependency_wait`原因 + `handoff`;当前scope toolchain修复`fix_gate_failure` |
| RFC 8785实现 /verifier | `02C`;`14B`复用 | open_before_schema_writer | `02C`不激活 |
| Shell规则与lint | `02D`;`14A~14C`复用 | open_before_script | script boundary不激活 /提交 |
| candidate /template /provider /material /lab | `13A/13B` | open_before_p0q | source Blocked,probe /launch=0 |
| CI binding /source authority | future source execution | open_before_real_execution | 只做local fixture,无CI /source claim |
| acceptance actual authority /review | future FormalEntry /DecisionReady | absent_not_adjudicated | 14C只产draft,无risk acceptance /verdict /signature |
| retention /soak /alert /rollout physical input | current disclosure;future claim | open_conditional | condition guard /DisclosureOnly;不发明数值 |
| PROFILE-06 | GATE-P1 | inactive_conditional | `NotRunConditional`;不补P0 |
| PROFILE-07 | DesignReopen | inactive_future | current activation reject |

### 8.2 动态状态冲突与受控回写

| Blocker ID | 冲突 | 处理 | 契约影响 |
|---|---|---|---|
| `SBX-IMP-DOWNSTREAM-STATUS-STEP9-001` | 正式`04/05/06`及对应flow仍把`07`写为Step 8待审,与Step 9已完成待审的恢复点冲突。 | 只回写三份正式文档的下游进度 /变更记录、对应flow、`07` flow和项目台账。 | 不改配置key /profile /material、TC /ENV /suite /gate、AC /VETO /risk route或runtime事实。 |

### 8.3 Blocker裁决

- 没有发现必须回写正式`01/03/04/05/06`契约才能完成Step 9的上游blocker。
- 旧`01`中的API / state /storage等待确认项已由新版正式`03~06`闭合,不应重新挂起。
- 当前开放项只阻塞exact future boundary、source或claim,不阻塞Step 9设计审查;不得将其写为ready /closed /accepted。
- tools /runtime /member-service仓缺失不阻塞P0-C,也不允许把其semantic execution、agent loop或lifecycle移入Sandbox。
- 若后续Spike发现owner契约缺口,该结论必须是`requires_design_writeback`,并使受影响boundary保持blocked;Spike本身不能补设计。

## 9. 复杂度、经验复核与停审

### 9.1 分批与复杂度判断

Step 9按主件、风险登记和boundary矩阵拆分。原因是15 Spike +20 Risk +18 OQ的完整字段与32 boundary反查无法在单一文件中兼顾正式章节可读性和planned skeleton可落码性。分件只有一个主件入口和统一全ID,不形成第二风险真相源。

### 9.2 可落码性经验复核

| 复核项 | 结论 |
|---|---|
| 是否把字段 /DTO /port缺口留给实现者 | 否;统一`wait_design`回owner |
| Spike是否可能无限探索或替代正式实现 | 否;15 /15有最小实验、输出、deadline和停止规则 |
| 每个风险是否可定位到phase /boundary | 是;20 /20进入HDO、boundary或future trigger |
| 每个OQ是否有owner /deadline /默认处置 | 是;18 /18 |
| 32 skeleton能否直接消费风险refs | 是;32 /32 exact映射 |
| P0-C是否被candidate /real product错误阻塞 | 否;现实packet只阻塞13A /13B或future claim |
| fake /controlled是否可能冒充P0-Q | 已阻断;P05 exact identity,缺失Blocked +0 launch |
| S /VETO /P0 /evidence风险能否被接受 | 否;Prohibited /MandatoryBlocker |
| historical材料是否可能回流 | Design /Scope Gate持续绑定R-020 |
| 运行事实是否被预填 | 否;Spike /risk /OQ全为designed catalog |

### 9.3 自检

| 自检项 | 结果 |
|---|---|
| SOP问题 | 6 /6 answered |
| Spike | 15 /15;明确输出和最迟关闭boundary |
| Risk | 20 /20;P /I、trigger、owner、mitigation、fallback、deadline完整 |
| Open Question | 18 /18;decision owner、artifact、deadline、默认处置完整 |
| Phase风险 | 14 /14 |
| Boundary风险 | 32 /32 |
| HDO风险 | 1 /1 |
| blocker / conditional / DesignReopen转换 | 已闭合 |
| 上游设计回写owner | `00/01/03/04/05/06/07`均有触发入口 |
| risk acceptance越权 | 无;当前0 accepted / reviewed / signed |
| 阻塞Step 9的上游契约冲突 | 无 |
| 正式`07` /implementation ledger /skeleton | 未创建;留Step 13 |
| 代码 /commit /Spike run /run_id /EV /结果 /review /签署 | 均未创建 |

### 9.4 进入Step 10条件

| 条件 | 状态 | 说明 |
|---|---|---|
| Spike均有输出 /owner /deadline | passed_design | 15 /15 |
| Risk均有阶段 /处理 /截止点 | passed_design | 20 /20 |
| OQ均有decision owner /默认处置 | passed_design | 18 /18 |
| 会阻塞实施的事项已分类 | passed_design | `wait_design` /`dependency_wait` + `handoff` /`fix_gate_failure` /Blocked /DesignReopen明确 |
| 32 boundary风险反查完整 | passed_design | 32 /32,无orphan |
| 上游回写触发完整 | passed_design | 实现侧不得私补契约 |
| 用户确认Step 9 | passed | 用户已明确“同意”,Step 10获得一次性放行 |

```text
step_9_result = completed_reviewed_passed_to_step_10
current_document = `07-实施计划.md`
current_step = Step 9 `定义Spike、风险与待确认事项`
current_module = `implementation_spikes_risks_open_questions_review`
gate_status = completed_reviewed_passed_to_step_10
spike_count = 15_of_15_designed_not_executed
risk_count = 20_of_20_designed_not_accepted
open_question_count = 18_of_18_open_with_deadline
phase_risk_count = 14_of_14
boundary_risk_count = 32_of_32
next_allowed_action = 由Step 10承接;若变更控制审计发现风险转换冲突则回退本Step
formal_07_created = no
implementation_ledger_created = no
planned_boundary_skeleton_created = no
executed_spike = 0
accepted_risk = 0
real_test_execution = not_started
real_evidence_created = no
allow_step_10_discussion = yes_one_step_authorized
commit_required = no
```
