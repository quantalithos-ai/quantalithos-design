# Step 12：进入准则与退出准则

## 1. Step 状态

2026-10-02；full-restart / single-agent；completed / selfcheck_done / stop_review；`gate_status=pass`（准则设计）。输入Step7～11；输出测试分scope进入/退出checklist、blocking分类、当前未满足项。所有运行checklist未勾选，设计完成不等测试退出。

Step内计划：scope分层→进入条件→退出/证据门禁→未满足及模糊项审计；完成。

### Step内计划与门禁字段

| 计划项 | 状态 | 可审查产物/门禁 |
|---|---|---|
| 读取输入与前序结论 | done | §2；前序：05_test_plan_step_11_defects_retest.md（含诊断、取舍、未确认项） |
| SOP逐问题回答 | done | §3，回答所有适用问题 |
| 当前/历史材料诊断 | done | §4，不继承historical truth |
| 设计取舍 | done | §6，采用/未采用理由 |
| 结构化产物 | done | §7，来源/失败/证明上限闭合 |
| 复杂度判断 | done | 主控内分单元/表，无需新增业务附录 |
| 回填草稿 | done | §8；只候选，正式写入等Step15 |
| 自检/下一步 | done | §9/10，实际资格与运行结果不伪填 |

`gate_status=pass`；`gate_reason`=本Step设计审查完成，执行仍not-run；`next_allowed_action`=§10下一Step阅读/设计；`source_files`=§2列出的正式输入与前序文件。上述done不表示实际环境、测试、evidence或owner签核通过。

## 2. 本步输入

[Step7](05_test_plan_step_07_test_data.md)、[Step8](05_test_plan_step_08_environment_config.md)、[Step9](05_test_plan_step_09_automation_gates.md)、[Step10](05_test_plan_step_10_nonfunctional.md)、[Step11](05_test_plan_step_11_defects_retest.md)、00AC/VETO、03/04 baseline；SOP Step12/书写规范§5.12。

## 3. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 冻结哪些文档？ | 当前00～04正式和05用户确认后的design refs/schema/state/TC/EV/DS/script registry；实现baseline需未来真实仓/commit或等效immutable来源，当前没有。 |
| 环境/数据？ | test profile/实际PG/browser/provider姿态可审查，全部13DS及subcase可重复；formal scope另要exact资格。 |
| 自动化？ | 11suite及6checks/4reports实际可运行、工具自身负例通过，不能凭本文planned路径开始验收。 |
| 必须通过什么？ | 对声明scope全部expected manifest；完整local release为98TC全部subcase、全部VETO/11suite/checks。 |
| 哪些阻退出？ | S/当前scope未通过P0、unexpected blocked/unavailable/not_run、invalid EV/缺raw/report，外部资格若在scope内也阻。 |

## 4. 当前文档问题诊断

只有“P0全部通过”不足以区分受控局部与正式owner集成；正确拒绝分支的pass不表示缺少positive资格可忽略。当前没有代码/测试工具，本轮只能定义门禁，不填写通过勾选。

## 5. 改动前后对比

| 前 | 后 | 原因 |
|---|---|---|
| 全项目pass概念 | local-contract/formal-integration分scope、exact manifest | 不扩大证明范围 |
| 模糊准备好 | 可检查基线/资源/数据/脚本/报告条件 | 进入和退出可落码 |

## 6. 测试设计取舍

采用声明scope与证明上限、不可用显式阻断，不采用跳过被阻塞case后计算通过率。planned设计checklist本轮全部未勾；expected拒绝/CommitUnknown等负向case可pass断言，而实际case无法运行/qualification未满足为blocked/unavailable；两者不得混用。

## 7. 结构化中间产物

### 7.1 测试scope与门禁

| scope | 允许证明 | 进入附加条件 | 不允许外推 |
|---|---|---|---|
| local-contract | pure/domain/application/typed fake/actual PG/API/Worker/Web/tools本地语义 | 本地进入checklist全部满足；test隔离资源 | formal owner/生产approval/install/payment/notice/evidence/readiness |
| formal-integration（selected） | exact owner/SDK operation/schema/consumer/scope/material/probe在该run成立 | 正式非生产资格+actual consumer支持+获准data及contract baseline | 未测type/版本/其他owner、全项目ready |
| capacity-candidate | 固定声明workload的raw样本/趋势 | 获准profile/资源/数据，明确无硬阈值 | 生产SLO/送达率/retention成立 |

P0设计以local-contract为自动化范围；formal positive继续blocked，不能通过所有拒绝用例就宣称完整marketplace核心集成验收成立。release gate是送验材料准备，不是deployment readiness或06 verdict。

### 7.2 进入准则（未来执行，当前全未满足/未执行）

- [ ] 00～04正式来源及05用户确认，schema/state/error/TC/DS/suite/EV registry版本固定，无未处理本地P0设计冲突。
- [ ] 实际实现baseline与依赖Core/SDK exports可定位；未创建实现仓不能用planned路径代替。
- [ ] test profile严格JSON validated，七字段/八slot姿态记录；没有生产fake/secret/bypass。
- [ ] 每expected TC/subcase有可重复DS/seed/isolated namespace和安全cleanup，readonly数据先冻结。
- [ ] actual PG/extension/多连接、测试API/Worker/browser/provider满足本scope所需资源；缺实际PG不能替换为fake。
- [ ] 11suite gate/6check/4report脚本按Step9实际可运行；schema/fixture/report generator自身负例已覆盖。
- [ ] run_id、同run artifacts/reports roots、expected suite/subcase manifest明确，无latest/跨run/symlink逃逸。
- [ ] raw/log/report capture可用且redaction/integrity checker有效，失败仍有report；敏感输入不归档。
- [ ] scope/blockers/owner qualification/ref/current contract/测试责任人明确；formal-integration还需exact正式资格与data授权。

这些是将来可判定条件，不声明当前准入通过。外部缺口对local typed负例允许作为输入；对formal positive则阻进入。

### 7.3 退出准则（未来执行，当前全未满足/未执行）

- [ ] 声明scope的expected TC及所有required subcase完整执行；完整local release为98TC/11suite，49入口/43对象/14carrier/222pair/17ports/146methods/33canonical/七paged参数化集合无遗漏。
- [ ] 五VETO全部负例断言通过，无S或当前scope阻断A/未通过P0；不存在unavailable/blocked/not_run被计为pass。
- [ ] C/J/query/replay/PG/Worker/Web与工具各层证据满足其证明上限，不用fake或smoke替代actual PG/API/browser等必要层。
- [ ] 原失败与fresh复验记录完整，flaky未择优覆盖；缺陷关闭按Step11，未关闭项仍显式open/deferred。
- [ ] case raw、redacted日志、suite/run JSON/MD与EV索引同run配对、strict schema/hash/redaction/coverage检查通过；无静态造证据。
- [ ] 所有expected EV指向实际全部required subcase及有效report，不挑passed，不混入tooling synthetic负例。
- [ ] 外部positive资格在本scope内时全部正式确认并绑定exact refs；scope外的blocked/future不删除、不外推ready。
- [ ] candidate性能仅sampled/trend；未确认Q-MP-01不填写生产数值pass或自动硬化threshold。
- [ ] 剩余非P0风险有明确责任/范围/正式接受authority；当前没有risk acceptance，S不可接受。
- [ ] reports/acceptance仅生成可审查交接draft，06正式裁决/owner signoff和用户确认单独处理。

### 7.4 当前缺口与阻断语义

| 当前事实 | 状态 | 不能执行的动作 |
|---|---|---|
| 实现仓/commit/lock/gate/check/report未创建 | planned / waiting_07 | 不填真实baseline/run/pass |
| actual PG/browser/provider及test资源未运行核验 | waiting | 不宣称suite exits或environment ready |
| MP-UP/SRC/Q、owner/SDK exact positive资格未闭合 | pending/blocked/affected/future | 不将controlled branch当正式qualification |
| 05设计已由Step15装配/静态自检，仍待用户确认 | design completed / stop_review | 不跨到06/07或实现 |
| evidence/verdict/signoff/readiness不存在 | not_created | 不代填验收或署名 |

静态审计：进入/退出条件均可判定，无“基本完成/通常成功”；负向pass与实际blocked分开，scope不能用于删除mandatory P0。设计门禁pass只准下一设计Step。

## 8. 回填草稿

正式§12采用scope表、全部未勾选运行checklist和当前事实说明。实际执行checklist留未来report，不在设计文档制造执行状态。

## 9. 待确认事项

05用户最终确认、未来正式实施/测试授权、owner/test资源及风险authority均未提供；不扩展本轮权限。详细设计影响判定：测试门禁没有新增domain对象/状态/config，scope只是报告管理标签。

## 10. 进入下一步条件

进入/退出条件无模糊项且不越证明上限，设计门禁pass。下一读SOP Step13/规范§5.13、闭环证据标准，定义strict machine schema、自引用摘要、raw/report配对与成熟度；不提交commit。
