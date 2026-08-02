# Step 4. 定义进入条件与退出条件

> 对应SOP: `standards/document/验收标准讨论流程_SOP.md` Step 4
> 书写规范: `standards/document/验收标准书写规范.md` §5.4
> 回填章节: `06-验收标准.md` §4 进入条件与退出条件
> 生成日期: 2026-07-14
> 状态: completed_reviewed_passed_to_step_5
> 所属流程: `06_acceptance_calibration_flow.md`
> 暂停 /恢复分件: `06_acceptance_step_04_entry_pause_resume_register.md`
> 本Step口径: 把Step 3固定基线与正式`05`测试退出、缺陷、evidence、回归 /风险规则转成可判定的正式验收进入、暂停 /恢复、decision-ready和关闭条件;不执行验收、不勾选checkbox、不生成验收项、EV、缺陷、风险接受、结论或签署,不修改旧正式`06`。

---

## 1. Step状态与Step内计划

| 检查项 | 结论 |
|---|---|
| 用户是否确认Step 3 | 是。用户已明确回复“同意”;Step 3主件 /分件和两层台账已转`passed_to_step_4`。 |
| 项目 /文档 /Step门禁 | 通过。用户已明确确认Step 4;当前允许进入Step 5,仍不得修改正式`06`。 |
| 是否读取Step 4标准 | 是。已读取验收SOP Step 4和书写规范§5.4。 |
| 是否读取直接输入 | 是。已复核Step 3主件 /登记分件、正式`05` §11~§14、测试Step 12 /13和residual分件。 |
| 是否读取粒度参考 | 是。已读取L1-governance / L1-artifact验收Step 4;只参考结构,未继承其A可接受、N/A或领域EV口径。 |
| 旧正式`06`定位 | historical material。旧三条进入 /四条退出、旧五段主线、空checkbox和“A视情况”不得继承。 |
| 是否发现上游冲突 | 是。Step 3原完整性表达存在entry / decision阶段歧义,已按SBX-ACC-ENTRY-PHASE-001定向回写并关闭。 |
| 当前实际状态 | 目标仓、immutable delivery、ENV实例、四源、RELEASE、raw / report、acceptance draft和review均不存在;正式验收为`NotEntered`。 |
| 当前状态 | Step 4主件、暂停 /恢复分件、上游定向回写和机械自检已完成并经用户确认;已放行Step 5。 |

### 1.1 Step内计划

| 计划项 | 状态 | 可审查产物 /完成门禁 |
|---|---|---|
| 恢复状态并读取标准 /上游 | done | §2~§4;Step 3放行、正式`05`硬条件和historical边界明确 |
| 校准entry / decision阶段 | done | §5~§8;FormalEntryReady与DecisionPacketComplete无循环依赖 |
| 定义正式进入条件 | done | §9.1~§9.3;AENT-SBX-001~016与前置evidence /缺陷矩阵 |
| 定义暂停 /恢复条件 | done | §9.4~§9.5;APAUSE-SBX-001~012及resume闭环 |
| 定义decision-ready /退出条件 | done | §9.6~§9.9;AEXT-SBX-001~016与三类关闭路径 |
| 形成当前readiness与追溯 | done | §9.10~§9.12;当前不进入、ABSL / EXT /后续Step映射明确 |
| 形成§4回填草稿 | done | §10;未来checkbox保留未勾选状态 |
| 自检并停审 | done_reviewed | §12~§13;用户已确认,flow /台账已转`passed_to_step_5` |

### 1.2 模块级门禁

| 模块 | 问题回答 | 诊断 | 取舍 | 结构化产物 | 回填草稿 | 自检 | gate_status | next_allowed_action |
|---|---|---|---|---|---|---|---|---|
| M1 FormalEntryReady | done | done | done | done | done | pass | pass | 由M2接续 |
| M2 Paused / Resume | done | done | done | done | done | pass | pass | 由M3接续 |
| M3 DecisionReady / Closed | done | done | done | done | done | pass | pass | 由M4接续 |
| M4 readiness / trace / upstream impact | done | done | done | done | done | pass | passed_to_step_5 | 用户已确认;由Step 5接续 |

---

## 2. 本步目标与边界

正式测试gate完成与正式验收审查是两个阶段:

```text
test design and execution
  -> four fixed source runs
  -> RELEASE aggregation + final evidence + acceptance drafts
  -> FormalEntryReady
  -> independent acceptance review
  -> pause / resume as needed
  -> DecisionReady
  -> Step 14 conclusion / signoff
  -> Closed
```

本Step必须回答:

1. 哪些immutable baseline、测试结果、evidence和handoff必须在正式验收开始前齐备。
2. 哪些缺陷、VETO预筛、identity / evidence问题使验收只能`EntryBlocked`。
3. 进入后哪些变化必须暂停,如何恢复,何时需要重新入场而不是继续旧review。
4. 正常完整评估与terminal不通过两条关闭路径各需要什么材料。
5. 哪些风险只需在进入时登记为pending,哪些必须在有条件通过前形成合法接受。
6. 当前磁盘事实对应哪个过程状态,以及为何不能勾选任何条件。

本Step不回答:

- 不定义Step 5~10逐条功能、红线、接口、一致性、NFR或evidence验收项。
- 不分配Step 11的`VETO-SBX-*`,只引用既有VF-SBX / VETO-CFG候选和未来统一索引。
- 不定义Step 12缺陷最终放行矩阵、Step 13实际风险接受或Step 14详细结论聚合 /签署角色。
- 不创建新的业务状态enum、test artifact schema、报告路径或实现代码。
- 不把进入条件失败写成产品Failed;identity /环境 /evidence缺失通常是`EntryBlocked / NotEntered`。
- 不允许用“先进入后补证据”绕过FormalEntryReady。

---

## 3. 本步输入

| 输入 | 当前状态 | 本Step用途 |
|---|---|---|
| `06_acceptance_step_03_baseline.md` | reviewed;含Step 4定向回写 | 提供FormalEntryReady / DecisionPacketComplete和§3草稿 |
| `06_acceptance_step_03_baseline_register.md` | reviewed;含Step 4定向回写 | 提供ABSL-SBX-001~040、entry / decision缺失传播和四源identity |
| 正式`05` §11 | reviewed planned baseline | 提供Failed / InfraFailed / Blocked归因、S / A / B、复验和不可接受边界 |
| 正式`05` §12 | reviewed planned baseline | 提供ENT / QENT / EXT、四源Release退出、暂停与当前readiness |
| 正式`05` §13 | reviewed planned baseline | 提供raw / report / final evidence / acceptance draft / independent review成熟度 |
| 正式`05` §14 + residual分件 | reviewed planned baseline | 提供失效 /重跑、RR-SBX-001~008和不可risk acceptance项 |
| `06_acceptance_step_02_scope.md` | reviewed | 提供ASCP-SBX-001~024、P0双轴和P1 / P2激活规则 |
| 旧正式`06` §3 / §8~§10 | historical material | 只诊断旧进入 /退出、A视情况、风险和空签署污染 |
| L1-governance / L1-artifact Step 4 | granularity reference | 参考SOP问答、进入 /退出 /暂停结构;不继承领域规则 |

---

## 4. 过程状态词汇

下列词汇只描述验收流程位置,不是Sandbox业务状态、test artifact enum或实际执行结果:

| 状态 | 唯一含义 | 允许动作 | 禁止推断 |
|---|---|---|---|
| `NotEntered` | 尚未执行或尚未通过正式进入检查 | 准备baseline / evidence / draft;运行AENT检查 | 产品Failed、验收不通过 |
| `EntryBlocked` | 已检查且至少一个mandatory AENT不满足 | 记录缺口、修复 /重跑 /重建packet | 跳过条件开始review |
| `InReview` | AENT-SBX-001~016全部满足并绑定同一entry record | 执行Step 5~14验收review | 自动等于通过 |
| `Paused` | 进入后发生APAUSE触发,旧review不能继续产生结论 | 保留材料、处置、复验、重建或resume审计 | 继续签署或消费失效证据 |
| `DecisionReady` | 满足适用AEXT且Step 14可计算唯一结论 | 形成三值结论与签署 | 尚未签署即Closed |
| `Closed` | 最终结论、签署、归档和下一阶段disposition完成 | 只允许按变更 /重开规则重新开启新批次 | 覆盖旧记录或跨baseline复用 |

图类型: 验收状态转换图
图标题: L4-sandbox正式验收进入、暂停与关闭

```text
NotEntered
  -> AENT complete: InReview
  -> AENT incomplete: EntryBlocked

EntryBlocked
  -> new valid packet + AENT recheck: InReview

InReview
  -> pause trigger: Paused
  -> all AEXT decision inputs ready: DecisionReady
  -> confirmed terminal rejection trigger: DecisionReady(not-pass route)

Paused
  -> same baseline remains valid + resume closure: InReview
  -> baseline identity changed: NotEntered(new acceptance batch)
  -> terminal rejection retained: DecisionReady(not-pass route)

DecisionReady
  -> conclusion + signoff + archive complete: Closed
```

关键说明:

- `EntryBlocked`不是测试`Blocked`的改名;它表示验收入口谓词不成立,原因可以引用测试Blocked、缺identity或缺handoff。
- baseline identity改变后不能从`Paused`直接恢复,必须以新packet重新执行全部AENT。
- terminal不通过允许提前停止剩余评估,但未评估项必须逐项披露,不得写成Passed / N/A。
- 当前未执行真实AENT检查,因此过程状态是`NotEntered`,不是伪造的`EntryBlocked`实例。

---

## 5. SOP问题回答

| SOP问题 | 回答 |
|---|---|
| 开始验收前哪些基线必须确认? | ABSL-SBX-001~028及适用029必须按Step 3固定:完整design / standards ref、送验claim、subject / build / core / harness、role-specific ENV / PROFILE / config / data / dependency、MAIN-CONTRACT / MAIN-SEAM / OPS / P0Q四源和RELEASE aggregation。任何mandatory identity缺失都不进入正式review。 |
| 哪些测试证据必须先生成? | ABSL-030~034必须完整,ABSL-035~037必须存在identity-bound draft。具体包括四源和RELEASE raw / report、final evidence index、ESLOT-001~019 runtime item、qualification packet、所有validation checks、handoff / veto / risk / open-issues draft。ABSL-038 /039独立review在进入后形成,不得预填。 |
| 哪些缺陷会阻断进入验收? | 任一open S / A、P0 Failed / InfraFailed / Blocked / missing、VF / VETO已知命中、redaction / dependency / pairing / no-static / identity / cleanup失败、未处置DesignReopen或P0 evidence invalidation均阻断。B只有在确认不影响P0、已完整登记且未触发升级时才不阻断entry。 |
| 退出验收需要哪些结论? | 正常路径要求所有mandatory Step 5~11项可判定、证据与review完整、缺陷 /复验和风险处置闭合,再由Step 14形成唯一三值结论与签署。confirmed S / VETO / P0失败可走terminal不通过路径,但剩余未评估项必须披露且不能产生任何通过声明。 |
| 哪些风险必须先接受? | 没有风险可用于绕过entry。进入时RR-SBX-001~008和适用B / conditional只登记pending / none;只有不影响P0、VF / VETO或evidence integrity的适用风险,才可在“有条件通过”之前由Step 13合法接受。S / A、execution blocker、P0失败 /缺失、identity / evidence缺口和DesignReopen永不可接受。 |

---

## 6. 当前文档与historical material问题诊断

| 位置 /材料 | 问题 | 本Step处理 |
|---|---|---|
| 旧正式`06` §3.1 | 只要求旧`02/03/05`、基础数据和旧create / isolate / run样本链 | 用AENT-SBX-001~016覆盖完整ABSL、四源、final evidence、draft和缺陷 /VETO预筛 |
| 旧正式`06` §3.2 | 只写全部P0、五条旧主线、S=0和风险清单 | 用AEXT覆盖mandatory item、review、VETO、缺陷、风险、disposition、签署和两条关闭路径 |
| 旧正式`06` §8 | A级写“视情况” | 当前正式`05`禁止open A用于P0退出或风险接受;旧口径废弃 |
| 旧正式`06` §9 / §10 | 预填风险方向、接受角色和空签署 | 风险进入时只可pending;实际接受 /签署留Step 13 /14且不得伪造 |
| L1 Step 4 | 允许A修复或正式接受,且P0可“不适用-with-reason” | 不继承。L4正式`05`要求open A=0;frozen P0不得waive / N/A |
| Step 3原§8.4 | 未显式区分entry packet与decision packet | 已按SBX-ACC-ENTRY-PHASE-001回写双阶段 |
| 当前实现 /证据事实 | 目标仓、ENV、run、report均缺失 | 当前保持NotEntered;所有未来checkbox未勾选 |

---

## 7. 改动前后对比

| 维度 | 旧 /泛化口径 | 本Step口径 | 原因 |
|---|---|---|---|
| 验收开始 | 文档和测试环境大致可用 | immutable delivery +四源Release +final evidence +四份draft +无entry blocker | 验收开始即必须可裁决 /可复验 |
| Review时机 | 未区分,可能先填review再进入 | entry前只准备draft与review责任;review内容进入后形成 | 避免循环依赖和伪审查 |
| P0结果 | 全部通过或可N/A | frozen P0不得N/A / waive;正常通过路径必须全部有效 | 对齐250条P0和双轴不可替代 |
| A级缺陷 | 视情况 /可能接受 | open A阻断entry /通过;不可risk acceptance | 对齐正式`05` §11 / §14 |
| 暂停 | 只有测试层失败 | 12类baseline、scope、evidence、defect、VETO、review、hold触发 | 防止失效packet继续签署 |
| 不通过关闭 | 未定义未评估项 | terminal route允许停止,但逐项披露not evaluated且0通过声明 | 既及时止损又保持诚实范围 |
| P1 / P2 | 容易一律忽略或阻断 | claim激活前冻结;P1独立证据,P2 / unsupported触发DesignReopen | 防止结果后选择性缩scope |

---

## 8. 验收裁决取舍

| 议题 | 采用方案 | 未采用方案 | 理由 |
|---|---|---|---|
| 是否允许测试执行未完成就进入验收 | 否;必须先有四源RELEASE和final evidence | 进入后边测边补 | 缺P0 evidence无法进行真实裁决 |
| acceptance四文件何时形成 | handoff / veto / risk / issues draft在entry前存在,final内容在review中收口 | review结束后才首次创建;或entry前预填结论 | 前者缺入口,后者伪造裁决 |
| independent review何时完成 | entry后完成,exit前必需 | entry前必须Reviewed | review本身就是验收活动 |
| open A能否有条件进入 /通过 | 不能 | 沿用L1泛化“A可接受” | L4正式`05`明确open A不参与P0退出 |
| P0项能否N/A | frozen mandatory P0不能;scope变化必须新baseline /重开 | review时标N/A跳过 | 防止250分母漂移 |
| terminal VETO后是否必须继续全部评估 | 可停止,但完整披露未评估项并只能走不通过 | 强制执行所有危险probe;或把剩余项写N/A | 安全止损且不伪造覆盖 |
| 当前是否判EntryBlocked | 否,写NotEntered且entry predicate显然未满足 | 把设计缺口当实际检查结果 | 当前没有真实acceptance batch / entry record |

---

## 9. 结构化中间产物

### 9.1 FormalEntryReady进入条件

`AENT-SBX-*`是验收过程条件ID,不是需求AC、测试ENT / EXT、EV或验收项ID。未来只有16项全部有真实来源且为满足,才可从`NotEntered / EntryBlocked`进入`InReview`。

| Condition ID | 可判定条件 | 必需来源 /证据 | 不满足时 |
|---|---|---|---|
| AENT-SBX-001 | ABSL-001~008完整,design / standards immutable ref逐文件digest一致,旧README /旧`06`未进入source set | baseline packet;source revisions;Step 3 | `EntryBlocked`;不得用当前branch / dirty HEAD替代 |
| AENT-SBX-002 | ABSL-009送验claim冻结P0、激活P1 / P2和非范围;ASCP-SBX-001~024映射一致,无未处置scope reopen | handoff draft;declaration ref;Step 2 | scope unresolved;不得从结果反推范围 |
| AENT-SBX-003 | ABSL-010~016固定target repo、subject、build /适用image、core-contracts、harness和dependency graph | build / source manifests;dependency check | 无可信test subject |
| AENT-SBX-004 | ABSL-017~023按四个mandatory role固定ENV / PROFILE / config / data / suite / dependency / redaction输入 | run contexts;config / dataset / suite manifests | 对应source不得升格 |
| AENT-SBX-005 | ABSL-024~027四个source run各自满足正式`05` EXT-SBX-C01~C10或Q01~Q08,无Failed / InfraFailed / Blocked / missing | 四源raw / reports / checks | P0-C或P0-Q不成立 |
| AENT-SBX-006 | ABSL-028 RELEASE按固定四源顺序满足EXT-SBX-P01~P10,250条P0均有唯一Passed主结果 | RELEASE context / index / `gate-results.md` | 不存在可送验测试聚合 |
| AENT-SBX-007 | ABSL-030机器raw对每个blocking invocation保留context、report.json、stdout / stderr、case / check和digest | `artifacts/test/<run_id>/...`;pairing check | raw不可信,不得手写补洞 |
| AENT-SBX-008 | ABSL-031~033具备run reports、final evidence index、ESLOT-001~019 runtime item、validation checks和完整P0Q packet | `reports/runs/<run_id>`;evidence index;qualification result | evidence incomplete |
| AENT-SBX-009 | ABSL-034~037四份identity-bound draft存在,均绑定同一RELEASE /四源digest / review version,且不预填pass /接受 /签署 | `reports/acceptance/*.md` | 无正式验收入口或范围披露 |
| AENT-SBX-010 | open S=0、open A=0;无P0 Failed / Blocked / InfraFailed / missing、无未复验修复或未处置P0 invalidation | defect refs;open issues;EXT-P06 | 阻断entry;B不得补偿 |
| AENT-SBX-011 | VF-SBX / VETO-CFG及redaction、dependency、pairing、no-static、identity、cleanup预筛无已知命中或未评估缺口 | veto draft;validation checks;EXT-P05 | 阻断entry或按安全规则停止 |
| AENT-SBX-012 | ABSL-040适用失效 / supersede均已解决;entry check时design / subject / config / data / suite / report identity未漂移 | invalidation refs;digest recheck | 使用新packet重新入场 |
| AENT-SBX-013 | test-created resource均有cleaned / contained / investigation / lab teardown disposition,artifact retention hold覆盖review窗口 | EXT-P07;qualification / cleanup reports;retention class | 不允许遗留active / orphan开始review |
| AENT-SBX-014 | 激活P1 claim时ABSL-029及对应evidence齐备;未激活P1明确NotRunConditional;P2 / production / unsupported claim未越过DesignReopen | declaration;conditional report;scope guard | claim-specific blocked或DesignReopen |
| AENT-SBX-015 | acceptance reviewer、security / operations适用review责任和final authority role已分配,具备固定raw / report只读访问;未预填review结论 | handoff responsibility refs;access precheck | 无法独立review;不得自审自签 |
| AENT-SBX-016 | entry record逐项记录AENT-001~015来源、检查时间、fixed RELEASE和结果,且16项全满足后才写`InReview` | handoff entry section或等价固定review record | 保持NotEntered / EntryBlocked |

### 9.2 进入前必须存在的材料

| 材料组 | Entry最低要求 | 不能替代 |
|---|---|---|
| machine raw | 四源 + RELEASE固定root、九schema适用文件、logs / case / check / digest | CI绿色标记、截图、手工摘要 |
| run reports | `summary.md`、`gate-results.md`、`evidence-index.md`、TC / protocol / PER coverage、redaction / dependency / report audit、suite / EV detail | 单一“all tests passed”报告 |
| P0-Q | qualification result、13 CONF、identity / redaction / cleanup / pairing、product / lab disposition | P0-C、PROFILE-06或历史candidate |
| acceptance drafts | handoff、veto checklist、risk acceptance、open issues四文件 | 空模板、静态全passed、后补路径 |
| defect / invalidation | S / A=0、B候选、原失败 /复验 / supersede refs完整 | 绿色重跑覆盖原失败 |
| scope / responsibility | frozen claim、conditional激活、review / authority roles | 从suite名、路径或结果猜测 |

### 9.3 进入阻断、Paused触发与Resume分件

完整进入阻断矩阵、`APAUSE-SBX-001~012`和局部resume /新batch规则位于`06_acceptance_step_04_entry_pause_resume_register.md`。

主规则摘要:

- 任一AENT不满足时保持`NotEntered / EntryBlocked`,不得开始正式review。
- 进入后identity、scope、P0 run或evidence真实性变化必须暂停;影响固定baseline时建立新batch并全量AENT。
- 只有raw / identity /语义均未变的derived report、cross-ref或角色访问修复可局部resume。
- confirmed VETO / S / P0 failure可转terminal不通过,但必须保留open blocker和未评估项披露。

### 9.6 DecisionReady共通退出条件

`AEXT-SBX-*`是验收过程退出条件。AEXT-001~014是任何结论都必须满足的决策完整性条件;AEXT-015 /016分别约束正常完整评估路径和terminal不通过路径。

| Condition ID | 可判定条件 | 必需来源 /后续Step | 不满足影响 |
|---|---|---|---|
| AEXT-SBX-001 | entry record有效,期间所有pause都有closed resume或明确terminal转向;fixed RELEASE /四源identity未漂移 | AENT / APAUSE records;Step 3 | 不能DecisionReady |
| AEXT-SBX-002 | frozen mandatory scope与claim逐项有最终disposition;P0不得Waived / N/A / conditional替代 | Step 2;handoff;Steps 5~11 | scope不完整 |
| AEXT-SBX-003 | Step 5~10全部mandatory验收项已登记;已评估项闭环设计 / TC / EV /条件 /影响,terminal未评估项只按AEXT-016披露 | Steps 5~10 | orphan或无终止理由的未评估项阻断 |
| AEXT-SBX-004 | entry时的P0-C / P0-Q、250条P0、ESLOT-001~019与四源 / RELEASE追溯均保留;review中发现的失效被显式传播 | formal`05`;Steps 5~10 | 不能证明原entry或当前失效依据 |
| AEXT-SBX-005 | Step 11全部VF-SBX、VETO-CFG及VETO-SBX统一索引有真实evidence和最终状态,无静态默认pass | Step 11;veto checklist | VETO不可判定 |
| AEXT-SBX-006 | final evidence index、raw / report和各check状态被原样保留并与结论一致;失败check只可成为不通过依据 | Step 10;ABSL-030~035 | evidence状态被掩盖或不可追溯 |
| AEXT-SBX-007 | ABSL-038 /039独立human / agent review均完成,争议为0或已显式进入最终不通过依据 | Step 10 /14;review files | review不完整 / Disputed |
| AEXT-SBX-008 | Step 12缺陷分类、根因、复验 /未复验理由、closure / open状态和invalidation完整,无缺陷被风险接受或隐藏 | Step 12;defect / open issues | decision packet不完整 |
| AEXT-SBX-009 | Step 13逐项裁决适用RR / B / conditional;不可接受项未混入;每个接受有authority、动作、期限来源和expiry trigger | Step 13;risk acceptance | 有条件通过不可形成;越权接受触发不通过 |
| AEXT-SBX-010 | P1激活项按claim完成;未激活P1保持NotRunConditional并披露;P2 / unsupported未被冒充current ready | Step 2 /9 /13 | claim超范围或披露不实 |
| AEXT-SBX-011 | 所有test-created resource、product disposition、containment、investigation和lab teardown最终状态明确;无未追踪active / orphan | Step 6 /11 /12;cleanup reports | 安全关闭不成立 |
| AEXT-SBX-012 | ABSL-034~037在同一fixed RELEASE上最终对账;missing / failed / blocked / invalidated / disputed和风险无遗漏 | handoff / veto / risk / issues | decision packet不完整 |
| AEXT-SBX-013 | retention guard覆盖裁决、S / A复验、P0Q disposition、调查、风险有效期和后续审计窗口;未发生提前删除 | Step 10 /13 /14 | evidence /审计关闭不成立 |
| AEXT-SBX-014 | Step 14能从固定输入计算唯一`通过 /有条件通过 /不通过`,签署角色、异议、下一阶段disposition和归档入口齐备 | Step 14 | 不能DecisionReady或Closed |
| AEXT-SBX-015 | 正常完整评估路径:全部mandatory项已评估;当前证据有效;open S / A=0;结论输入无missing | Steps 5~14 | 不能走通过 /有条件通过或完整评估关闭路径 |
| AEXT-SBX-016 | terminal不通过路径:已确认VETO / S / P0 failure或不可恢复证据失真;open blocker和剩余未评估项逐项披露,0项被写Passed / N/A | Step 11 /12 /14;open issues | 不能诚实提前关闭 |

### 9.7 三类结论与退出条件关系

| 目标结论 | 必需AEXT | 额外硬条件 | 禁止情形 |
|---|---|---|---|
| 通过 | 001~015 | 所有P0通过;VETO无命中;S / A=0;无需要接受才能放行的适用风险;review无争议 | 任一missing / Blocked / accepted risk影响目标 |
| 有条件通过 | 001~015 | P0和VETO条件同“通过”;只存在Step 13合法接受且不影响P0的B / P1 / P2 residual;条件、authority、动作和expiry完整 | S / A、P0缺口、VETO、identity / evidence缺口、execution blocker |
| 不通过-完整评估 | 001~015 | 所有mandatory项均评估;Step 14按失败 /VETO /缺陷规则聚合 | 把Failed改写成conditional |
| 不通过-terminal | 001~014 +016 | 安全 /真实性要求允许停止后续危险或无意义评估;未评估清单完整 | 形成局部“其余通过”或签署放行 |

三值结论的精确优先级、签署角色和下游disposition留Step 14。本文只保证任何路径都有足够输入,且“尽早不通过”不会牺牲事实完整性。

### 9.8 风险在进入与退出时的不同要求

| 风险类别 | Entry要求 | Exit要求 | 是否可支持有条件通过 |
|---|---|---|---:|
| RR-SBX-001~008未激活 /待裁决 | draft逐项存在,owner /影响 /trigger完整,状态pending或none | Step 13按当前claim裁决accepted / rejected / not-applicable-by-scope;记录expiry | 仅正式接受且不影响P0时可 |
| B级非P0缺陷 | 已分类、无升级触发、open issues中披露 | 修复关闭或合法接受 | 可 |
| S / A | 必须为0才能entry | 必须为0才能通过 /有条件通过 | 否 |
| P0 Failed / Blocked / missing | 必须为0才能entry | 任何时点出现都不支持放行 | 否 |
| ENV / target repo / provider / lab缺失 | execution blocker,不能entry | 不得risk accept | 否 |
| identity / evidence / redaction缺口 | integrity blocker,不能entry | 不得risk accept | 否 |
| DesignReopen | 必须先回写并重建baseline | 不得作为residual关闭 | 否 |
| P2 / production claim新出现 | entry前scope reopen | 设计未重开前只能不通过该claim | 否 |

### 9.9 条件到上游测试准则映射

| 验收条件组 | 正式`05`来源 | 本Step增加的验收语义 |
|---|---|---|
| AENT-001~004 | ENT-SBX-001~015;QENT-001~007 | 从“可启动测试”提升为“送验baseline固定” |
| AENT-005~008 | EXT-C01~C10;EXT-Q01~Q08;EXT-P01~P10;§13 | 要求测试已完成并形成可审查evidence packet |
| AENT-009 /015 /016 | §13 acceptance draft / review边界 | 区分draft、review责任和正式entry record |
| AENT-010~014 | §11 /§12.6 /§14.3~14.5 | 阻止缺陷、VETO、失效、resource和claim污染entry |
| APAUSE-001~012 | §11.4;§12.6;§14.2~14.3 | 将测试失效扩展为验收review暂停 /重新入场 |
| AEXT-001~016 | EXT-P;§13 review;§14 RR | 增加验收项裁决、VETO、risk authority、签署和terminal关闭完整性 |

### 9.10 当前Readiness

以下是磁盘事实推导,不是执行过的entry record:

| 判定面 | 当前事实 | 当前过程状态 /原因 |
|---|---|---|
| AENT-001 / design ref | 当前内容未形成统一immutable design revision | 未满足;但尚未执行真实AENT |
| AENT-002 / claim | 无实际送验declaration | 未满足 |
| AENT-003 / delivery | 目标实现仓不存在,无subject / build / core / harness packet | 未满足 |
| AENT-004 / environment | 只有七类设计,无ENV / config / data实例 | 未满足 |
| AENT-005~008 / test + evidence | 四源、RELEASE、raw、report、EV、qualification均不存在 | 未满足 |
| AENT-009 / drafts | `reports/acceptance`不存在 | 未满足 |
| AENT-010~014 / defect / veto / disposition / scope | 无实际run或acceptance batch可判定 | NotEvaluated,不得伪填0 / pass |
| AENT-015 / responsibility | 无实际review assignment或access record | 未满足 |
| AENT-016 / entry record | 不存在 | 未满足 |
| 总体过程状态 | 未执行正式验收entry check | `NotEntered`;不是Passed、InReview或Closed |

### 9.11 条件覆盖与机械闭集

| 审计对象 | 覆盖结论 |
|---|---|
| ABSL-SBX-001~040 | AENT覆盖001~037与适用040;AEXT覆盖038~040和finalized 034~037;无孤儿baseline |
| 四源 / RELEASE | AENT-005 /006 /008;APAUSE-002 /003 /004;AEXT-004 /006 /012 |
| 250 P0 / 21 slots | AENT-006 /008;AEXT-003 /004 /006;conditional 020 /021由AENT-014 /AEXT-010隔离 |
| VF / VETO | AENT-011;APAUSE-005;AEXT-005;详细VETO索引留Step 11 |
| S / A / B | AENT-010;APAUSE-005 /006;AEXT-008 /009;详细放行留Step 12 /13 |
| RR-SBX-001~008 | AENT-009 /014;AEXT-009 /010;逐项接受留Step 13 |
| security / cleanup / retention | AENT-013;APAUSE-010 /012;AEXT-011 /013 |
| review / signoff | AENT-015 /016;APAUSE-009 /011;AEXT-007 /012 /014 |

### 9.12 条件ID边界

- `AENT-SBX-001~016`只定义FormalEntryReady,不得在Step 5~14重编号或删除。
- `APAUSE-SBX-001~012`只定义review continuity guard,不是缺陷等级或测试status。
- `AEXT-SBX-001~016`只定义DecisionReady / Closed前置,不替代Step 14三值聚合。
- 后续Step可引用这些条件并增加主题验收项,不能以主题验收项绕过共同条件。
- 未来实际checkbox必须保持未勾选直到有真实固定来源;本文不创建满足实例。

---

## 10. 正式`06-验收标准.md` §4回填草稿

以下草稿只供Step 15装配。所有checkbox定义未来事实检查,当前一律保持未勾选。

### 10.1 章节来源声明草稿

```md
> 校准来源:
> - `design-calibration/06_acceptance_step_04_entry_exit.md`
> - `design-calibration/06_acceptance_step_04_entry_pause_resume_register.md`
>
> 延伸阅读:
> - 建议继续阅读主件的“FormalEntryReady进入条件”“DecisionReady共通退出条件”“当前Readiness”和分件的“进入阻断与状态传播”“Paused触发条件”“Resume与重新入场规则”,了解正式验收如何准入、暂停和关闭。
```

### 10.2 过程状态草稿

验收过程状态只使用`NotEntered`,`EntryBlocked`,`InReview`,`Paused`,`DecisionReady`,`Closed`。这些词汇不是Sandbox业务状态或test artifact status。当前没有实际送验batch或entry record,状态为`NotEntered`。

### 10.3 进入条件草稿

#### 正式基线与交付

- [ ] `AENT-SBX-001` ABSL-SBX-001~008的design / standards immutable ref与逐文件digest完整,旧README /旧`06`未进入source set。
- [ ] `AENT-SBX-002` 送验claim已冻结P0、激活P1 / P2、非范围和ASCP-SBX-001~024映射,无未处置scope reopen。
- [ ] `AENT-SBX-003` target repository、subject、build /适用image、core-contracts、test harness和dependency graph identity完整。
- [ ] `AENT-SBX-004` 四个mandatory source role的ENV / PROFILE / config / data / suite / dependency / redaction输入已分别冻结。

#### 测试结果与Evidence

- [ ] `AENT-SBX-005` MAIN-CONTRACT、MAIN-SEAM、OPS、P0Q四个source run分别满足正式`05` P0-C / P0-Q退出准则。
- [ ] `AENT-SBX-006` RELEASE按四源固定顺序满足EXT-SBX-P01~P10,250条P0均有唯一Passed主结果。
- [ ] `AENT-SBX-007` 所有blocking invocation的machine raw、logs、case / check和digest位于`artifacts/test/<run_id>`且配对完整。
- [ ] `AENT-SBX-008` run reports、final evidence index、ESLOT-SBX-001~019 runtime item、validation checks和qualification packet完整。
- [ ] `AENT-SBX-009` handoff、veto checklist、risk acceptance、open issues四份identity-bound draft已生成,无预填pass、接受或签署。

#### 缺陷、VETO、资源与责任

- [ ] `AENT-SBX-010` open S / A为0,无P0 Failed / Blocked / InfraFailed / missing、未复验修复或未处置P0 invalidation。
- [ ] `AENT-SBX-011` VF / VETO和redaction、dependency、pairing、no-static、identity、cleanup预筛无命中 /缺口。
- [ ] `AENT-SBX-012` 所有适用invalidated / superseded关系已解决,entry检查时baseline identity未漂移。
- [ ] `AENT-SBX-013` 所有test-created resource已有safe disposition,证据retention hold覆盖验收review窗口。
- [ ] `AENT-SBX-014` 激活P1有独立证据,未激活P1明确NotRunConditional,P2 / unsupported claim未绕过DesignReopen。
- [ ] `AENT-SBX-015` independent reviewer、适用security / operations reviewer和final authority role已分配且具备只读证据访问。
- [ ] `AENT-SBX-016` entry record逐项引用AENT-SBX-001~015的真实来源,全部满足后才进入`InReview`。

### 10.4 暂停与恢复草稿

进入`InReview`后,发生以下任一情形必须转`Paused`:design / claim / delivery / source identity变化;raw / report / digest / evidence integrity失效;新S / A、VETO或P0失败;缺陷重开;DesignReopen;claim升级;review追溯断裂;resource disposition恶化;review责任失效;security / compliance hold。

只有fixed baseline未变且修复仅影响derived report、review cross-ref或角色访问时,才允许局部recheck后恢复`InReview`。design、subject、core、harness、source identity、P0 run或scope变化必须建立新acceptance batch并重新执行全部AENT。confirmed VETO / S / P0 failure可转terminal不通过路径,不得恢复为通过评估。

### 10.5 退出条件草稿

#### 共通DecisionReady条件

- [ ] `AEXT-SBX-001` entry有效,所有pause均已恢复闭合或明确转terminal路径,baseline identity连续。
- [ ] `AEXT-SBX-002` frozen mandatory scope与claim逐项有disposition,P0无Waived / N/A / conditional替代。
- [ ] `AEXT-SBX-003` 全部mandatory验收项已登记;已评估项闭环到设计 / TC / evidence /条件 /影响,terminal未评估项有正式理由。
- [ ] `AEXT-SBX-004` 原entry P0双轴、250条P0、19个P0 slot和四源 / RELEASE追溯完整,review发现的失效已传播。
- [ ] `AEXT-SBX-005` 全部VF / VETO索引有真实evidence和最终状态,无静态默认pass。
- [ ] `AEXT-SBX-006` raw / report / final evidence与validation check状态原样保留且与验收结论一致。
- [ ] `AEXT-SBX-007` human / agent独立review均完成,争议为0或已作为不通过依据。
- [ ] `AEXT-SBX-008` 缺陷分类、复验 /未复验理由、closure / open和invalidation完整,无隐藏或越权接受。
- [ ] `AEXT-SBX-009` 适用RR / B / conditional逐项合法裁决,不可接受项未混入risk acceptance。
- [ ] `AEXT-SBX-010` P1 / P2结果与冻结claim一致,未补偿P0或冒充production ready。
- [ ] `AEXT-SBX-011` resource、containment、investigation和lab teardown最终disposition明确,无未追踪active / orphan。
- [ ] `AEXT-SBX-012` handoff / veto / risk / issues在同一fixed RELEASE上最终对账,无遗漏状态。
- [ ] `AEXT-SBX-013` retention guard覆盖裁决、复验、P0Q disposition、调查、风险有效期与审计窗口。
- [ ] `AEXT-SBX-014` Step 14可计算唯一三值结论,签署、异议、下一阶段disposition和归档入口齐备。

#### 路径条件

- [ ] `AEXT-SBX-015` 正常完整评估路径已评估全部mandatory项,当前证据有效,open S / A为0且结论输入无missing。
- [ ] `AEXT-SBX-016` 或terminal不通过路径已确认VETO / S / P0 failure /不可恢复证据失真,并完整披露open blocker和所有未评估项,0项伪写Passed / N/A。

进入`DecisionReady`要求AEXT-SBX-001~014全部满足,并且AEXT-SBX-015或AEXT-SBX-016恰有一条适用。`Closed`还必须完成Step 14最终结论、签署、归档和下一阶段disposition。

---

## 11. 上游影响、Blocker与待确认事项

### 11.1 上游影响判定

| 影响 | 状态 | 处理 |
|---|---|---|
| Step 3未区分entry与decision packet | resolved_by_acceptance_step_4_writeback | 已回写FormalEntryReady / DecisionPacketComplete和ABSL-024~037阶段语义 |
| 正式`05` open A不可接受与L1泛化模板冲突 | no_writeback_required | 采用L4正式`05`;不修改上游或继承L1规则 |
| terminal不通过的未评估项披露 | acceptance_process_refinement | 不改变测试schema /状态;由Step 14进一步固定结论表达 |
| entry record承载位置 | contained_by_existing_handoff_or_review_record | 不新增schema /路径;Step 10 /14细化固定章节即可 |
| 当前目标仓 /证据 /review缺失 | open_execution_blockers | 阻塞真实entry,不阻塞Step 4规则设计 |

### 11.2 Blocker状态

| Blocker | 状态 | 说明 |
|---|---|---|
| SBX-ACC-ENTRY-PHASE-001 | resolved_by_acceptance_step_4_writeback | Step 3双阶段已校准 |
| SBX-ACC-ENTRY-EXIT-001 | resolved_for_acceptance_step_4_wait_review | AENT / APAUSE / AEXT、双退出路径和readiness已通过机械自检 |
| SBX-ACC-DELIVERY-001 | open_for_delivery_baseline | 目标仓 / delivery缺失;AENT-003不满足 |
| SBX-ACC-EVIDENCE-001 | open_for_runtime_evidence | 四源 / EV / report缺失;AENT-005~009不满足 |
| SBX-ACC-P0Q-001 | open_for_p0q_execution | candidate / lab缺失;AENT-005 /006不满足 |
| SBX-ACC-DESIGN-REOPEN-001 | blocker_if_triggered | 后续验收项无正式契约时暂停并回写 |

当前没有阻塞Step 4规则收口或Step 5功能门禁设计的未解决上游冲突。开放执行blocker意味着实际状态保持NotEntered,不授权删除AENT条件。

### 11.3 后续Step必须回答但本Step不提前决定

| 待回答事项 | Owner Step |
|---|---|
| 各功能 /红线 /协议 /一致性 /NFR /evidence验收项如何逐条裁决 | Step 5~10 |
| VF / VETO-CFG如何形成VETO-SBX统一索引和terminal触发优先级 | Step 11 |
| S / A / B与复验、release disposition的精确放行矩阵 | Step 12 |
| RR-SBX-001~008逐项可接受性、authority、动作和expiry | Step 13 |
| 三值聚合、AEXT-015 /016选择、签署角色、归档和重开 | Step 14 |

---

## 12. Step自检

| 自检项 | 当前结论 |
|---|---|
| SOP五问是否逐项回答 | 通过;§5为5 /5 |
| AENT-SBX-001~016是否唯一连续 | 通过;16定义 /16唯一 |
| APAUSE-SBX-001~012是否唯一连续 | 通过;分件12定义 /12唯一 |
| AEXT-SBX-001~016是否唯一连续 | 通过;16定义 /16唯一 |
| entry / review / decision是否无循环依赖 | 通过;draft entry前,independent review /风险裁决 /签署entry后 |
| 四源 / P0-Q是否可被低profile或P1替代 | 否 |
| open S / A、P0缺口、VETO或evidence缺口是否可risk accept | 否 |
| normal / terminal不通过两条关闭路径是否诚实 | 通过;terminal必须披露未评估项且0伪Passed / N/A |
| 当前状态是否诚实 | `NotEntered`;未勾选任何未来条件 |
| 是否创建Step 5、修改正式`06`或实现产物 | 通过;均未创建 /修改 |
| 是否伪造run、EV、缺陷、风险、review、结论或签署 | 否 |

---

## 13. 停审结论与Step 5放行记录

本Step已完成机械自检并经用户明确确认。批准只表示Step 4设计可作为Step 5输入,不表示任何AENT / APAUSE / AEXT实例已满足,也不表示已进入真实验收。

1. 本Step、flow和项目台账已从`pass_wait_review`转为`passed_to_step_5`。
2. Step 5必须读取验收SOP Step 5、书写规范§5.5、Step 2范围、Step 4共同条件及正式`00/02/03/05`功能来源。
3. Step 5只允许创建`06_acceptance_step_05_function_gate.md`及必要分件,按验收主题和P0小循环逐项停审。

Step 5完成并经用户确认前,仍禁止修改正式`06`、进入Step 6、提前形成VETO /风险 /签署结论或进入`07`。

| 恢复字段 | 当前值 |
|---|---|
| current / gate | `06-验收标准.md` Step 4;`completed_reviewed_passed_to_step_5`;`passed_to_step_5` |
| next | 读取Step 5标准与功能来源,创建并完成`06_acceptance_step_05_function_gate.md`后停审 |
| prohibited | 正式正文、真实执行 / evidence、implementation ledger、boundary skeleton;`commit_required = no` |
