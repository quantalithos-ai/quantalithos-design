# L6-bridges 05 测试方案校准流程

2026-10-04后续认可：用户“现在完成全部06”确认05为06输入；下方历史停审/下一阅读记录保持当时事实，05所有语义/装配/运行权限仍false，当前恢复入口移至06 flow。

> 2026-10-04；用户明确确认04并授权全部05。full-restart / single-agent-serial；只写本项目设计/calibration/台账，不使用代理或并行工具，不实现/运行项目测试/stage/commit。
> 正式05仅在Step15装配，完成立即停审；旧05/06/README只在独立结论收稳后作historical_material冲突扫描。

## 1. 当前恢复点

| Step | 模块 | 骨架 | 思考 | 写入 | 自检 | gate_status | gate_reason | next_allowed_action | source_files |
|---|---|---|---|---|---|---|---|---|---|
| 15 | formal_stop_review | done | done | done | done | blocked | authorized_stop_after_formal05 | wait_for_user_confirmation_of_05 | 05 Step15；正式00~04；测试SOP/规范及实际静态审计 |

## 2. 总流程计划

| Step | 名称 | 当前状态 | 输入/阅读 | 输出文件 | 完成门禁 |
|---|---|---|---|---|---|
| 1 | 输入边界 | done | 正式00~04、七上游相关05/台账 | `05_test_plan_step_01_input_boundary.md` | 本步问题→诊断→取舍→结构化→草稿→实际自检；逐切口停审 |
| 2 | 目标范围 | done | 前序Step结论/未决；测试SOP Step2及书写§5.2 | `05_test_plan_step_02_scope.md` | 本步问题→诊断→取舍→结构化→草稿→实际自检；逐切口停审 |
| 3 | 对象与切口 | done | 前序Step结论/未决；测试SOP Step3及书写§5.3 | `05_test_plan_step_03_objects_cuts.md` | 本步问题→诊断→取舍→结构化→草稿→实际自检；逐切口停审 |
| 4 | 策略与分层 | done | 前序Step结论/未决；测试SOP Step4及书写§5.4 | `05_test_plan_step_04_strategy_layers.md` | 本步问题→诊断→取舍→结构化→草稿→实际自检；逐切口停审 |
| 5 | 追溯覆盖 | done | 前序Step结论/未决；测试SOP Step5及书写§5.5 | `05_test_plan_step_05_traceability.md` | 本步问题→诊断→取舍→结构化→草稿→实际自检；逐切口停审 |
| 6 | 场景用例 | done | 前序Step结论/未决；测试SOP Step6及书写§5.6 | `05_test_plan_step_06_cases.md` | 本步问题→诊断→取舍→结构化→草稿→实际自检；逐切口停审 |
| 7 | 测试数据 | done | 前序Step结论/未决；测试SOP Step7及书写§5.7 | `05_test_plan_step_07_test_data.md` | 本步问题→诊断→取舍→结构化→草稿→实际自检；逐切口停审 |
| 8 | 环境配置 | done | 前序Step结论/未决；测试SOP Step8及书写§5.8 | `05_test_plan_step_08_environment_config.md` | 本步问题→诊断→取舍→结构化→草稿→实际自检；逐切口停审 |
| 9 | 自动化门禁 | done | 前序Step结论/未决；测试SOP Step9及书写§5.9 | `05_test_plan_step_09_automation_gates.md` | 本步问题→诊断→取舍→结构化→草稿→实际自检；逐切口停审 |
| 10 | 专项验证 | done | 前序Step结论/未决；测试SOP Step10及书写§5.10 | `05_test_plan_step_10_nonfunctional.md` | 本步问题→诊断→取舍→结构化→草稿→实际自检；逐切口停审 |
| 11 | 缺陷复验 | done | 前序Step结论/未决；测试SOP Step11及书写§5.11 | `05_test_plan_step_11_defects_retest.md` | 本步问题→诊断→取舍→结构化→草稿→实际自检；逐切口停审 |
| 12 | 进入退出 | done | 前序Step结论/未决；测试SOP Step12及书写§5.12 | `05_test_plan_step_12_entry_exit.md` | 本步问题→诊断→取舍→结构化→草稿→实际自检；逐切口停审 |
| 13 | 报告证据 | done | 前序Step结论/未决；测试SOP Step13及书写§5.13 | `05_test_plan_step_13_evidence.md` | 本步问题→诊断→取舍→结构化→草稿→实际自检；逐切口停审 |
| 14 | 回归风险 | done | 前序Step结论/未决；测试SOP Step14及书写§5.14 | `05_test_plan_step_14_regression_risks.md` | 本步问题→诊断→取舍→结构化→草稿→实际自检；逐切口停审 |
| 15 | 正式装配 | done / formal_stop_review | 前序Step结论/未决；测试SOP Step15及书写§5.15 | `05_test_plan_step_15_formal_document_assembly.md` | 来源/合同/格式/范围实际审查完成，正式05冻结等待用户确认 |

未来文件不提前创建；每步先骨架和八项内计划。逐切口闭合：设计来源→场景→TC断言→DS前置→suite/gate→planned EV/AC，记录局部停止复核后才推进。Step5只候选追溯，Step6逐切口展开，不先造整表再补来源/数据/证据。

## 3. 来源与边界

00的16FR/24BR/20DR/16NFR/38AC/6VETO、01/02责任边界、03§15十一target/§9状态/§10 UoW/§16构造、04配置82项/22CF/27F/12切口是正式输入。旧06没有当前正式验收资格，以00 AC提供未来06方向。

平台SDK、OAuth、API Key、KMS、路由/DB/Bus/executor继续adapter/config/secret seam资格核验；平台公开合同不证明pin、账号、测试或投递。四平台差异不得被同一fake吞平。L5-chat未停审内容reference_only。

脚本若确认采用，先在本项目03§4/15及对应Step4/16登记完整planned路径/类型/参数/I/O/失败合同；不创建脚本或实施boundary。报告DTO必须可编码、可验证、不能把planned登记或未运行case写成passed；所有runtime路径都是计划。

## 4. 三层门禁

```text
current_document = 05
current_step = 15
current_module = formal_stop_review
document_status = formal_stop_review
step_status = formal_stop_review
gate_status = blocked
gate_reason = authorized_stop_after_formal05
next_allowed_action = wait_for_user_confirmation_of_05
formal_04_user_confirmation = explicit_continue_to_05
formal_05_design_self_review = pass_design_static_external_gates_open
formal_05_user_confirmation = explicit_continue_to_06
calibration_write_allowed = false
formal_document_write_allowed = false
formal_05_assembly_allowed = false
next_document_allowed = false
implementation_write_allowed = false
implementation_ledger_allowed = false
test_execution_allowed = false
commit_required = false
```

## 5. 事实与阻塞

BR-UP-001~009=open、010=reference_only；WS-UP-001~008/006-S/WS-LOCAL-001~003继承open；Observability十二affected继承原状态及pre_implementation_blocked/blocked/wait_design。局部mock通过不能解除actual owner/driver/producer/storage/config/secret资格。

planned TC/DS/suite/EV并非run、artifact、report、evidence实例；07正式完成前不建实施台账或boundary skeleton。仅synthetic内存canary，不使用真实消息/账号/token/secret/敏感审批。

范围基线：[05基线](05_test_plan_scope_baseline.json)，150原Bridges/4678范围外；使用其中lexical codepoint recipe，不能与04的en排序digest直接对比。

## 6. 执行与审计记录

启动阅读已完整完成测试SOP1245行、书写规范882行、全局依赖326行；通则/中间产物/真相源按适用条款复核。实际章节和截断补读/限制见Step1；不冒称本轮重读七项目全部00~07。
04认可仅元信息同步，历史停审段保持当时事实。所有Step审计是设计静态检查，不是项目编译、测试结果或验收裁决。

完成：Step1~15及正式15章，116 P0 TC/22cut/22DS/13suite/7planned脚本/22planned EV、9root/34defs harnessschema、21机/150pair/191field与120原需求编号闭合。TEST-03-001只本项目03§4.4/15与Step4/16必要测试职责反校准，04只用户输入认可；其他正式输入不重开。Step15后置historical冲突、独立微循环不足的本次补正及实际工具失败/修复记录已具名保留。

实际设计静态审计与改动路径见Step15§7.4：scope 150→173、23新增+8既有修改，范围外4678文件聚合hash与本轮基线一致；00~02/README/旧06/draft保护hash不变。15章动态正文source_match、120原ID/116TC/22EV双向关联、21机101labels/150allowedpair/375未列候选、191field及构造/Query/public/phase原列复核，errors=[]；diff-check通过、cached空。schema只完成JSON/字段/ref/pattern静态审查，AJV2020不可用且未安装/执行；harness/项目测试均not_run，不冒称测试通过。

当前三层formal_stop_review/blocked，所有写入及运行权限关闭；formal_05_user_confirmation=waiting。下一阅读必须先获得用户确认05及06授权，才读验收SOP/书写规范、00 AC/正式05与必要owner材料；目前不进入06/07，不创建实施ledger/boundary，不需提交。
