# L6-bridges 06 验收标准校准流程

> 2026-10-04；full-restart / single-agent-serial；用户授权全部06，05作为认可输入。全程仅当前agent串行，不使用代理/并行调用，不实现/测试/stage/commit；正式06完成立即停审，不进入07。

## 1. 当前恢复点

| Step | 模块 | 骨架 | 思考 | 写入 | 自检 | gate_status | gate_reason | next_allowed_action | source_files |
|---|---|---|---|---|---|---|---|---|---|
| 15 | confirmed_for_07_input | done | done | done | done | pass | read_07_design_recovery_entry | read_07_design_recovery_entry | 正式00~05、七上游相关06/台账、验收SOP/规范 |

## 2. 总流程计划

| Step | 名称 | 当前状态 | 输入/前序依赖 | 输出文件 | 完成门禁 | 下一步许可 |
|---|---|---|---|---|---|---|
| 1 | 输入边界 | done | 用户06授权/正式00~05/七上游 | `06_acceptance_step_01_input_boundary.md` | 八小阶段完成；来源/裁决/静态自检 | 当前Step自检后才可顺序推进；Step15后等待用户 |
| 2 | 目标范围 | done | 前一Step问题、诊断、取舍/未决；验收SOP Step2/书写§5.2 | `06_acceptance_step_02_scope.md` | 八小阶段完成；来源/裁决/静态自检 | 当前Step自检后才可顺序推进；Step15后等待用户 |
| 3 | 验收基线 | done | 前一Step问题、诊断、取舍/未决；验收SOP Step3/书写§5.3 | `06_acceptance_step_03_baseline.md` | 八小阶段完成；来源/裁决/静态自检 | 当前Step自检后才可顺序推进；Step15后等待用户 |
| 4 | 进入退出 | done | 前一Step问题、诊断、取舍/未决；验收SOP Step4/书写§5.4 | `06_acceptance_step_04_entry_exit.md` | 八小阶段完成；来源/裁决/静态自检 | 当前Step自检后才可顺序推进；Step15后等待用户 |
| 5 | 功能门禁 | done | 前一Step问题、诊断、取舍/未决；验收SOP Step5/书写§5.5 | `06_acceptance_step_05_function_gate.md` | 八小阶段完成；逐验收项微循环及跨项审查 | 当前Step自检后才可顺序推进；Step15后等待用户 |
| 6 | 边界红线 | done | 前一Step问题、诊断、取舍/未决；验收SOP Step6/书写§5.6 | `06_acceptance_step_06_boundary_gate.md` | 八小阶段完成；逐验收项微循环及跨项审查 | 当前Step自检后才可顺序推进；Step15后等待用户 |
| 7 | 接口同步 | done | 前一Step问题、诊断、取舍/未决；验收SOP Step7/书写§5.7 | `06_acceptance_step_07_interface_sync_gate.md` | 八小阶段完成；逐验收项微循环及跨项审查 | 当前Step自检后才可顺序推进；Step15后等待用户 |
| 8 | 状态事务 | done | 前一Step问题、诊断、取舍/未决；验收SOP Step8/书写§5.8 | `06_acceptance_step_08_state_tx_consistency.md` | 八小阶段完成；逐验收项微循环及跨项审查 | 当前Step自检后才可顺序推进；Step15后等待用户 |
| 9 | 非功能 | done | 前一Step问题、诊断、取舍/未决；验收SOP Step9/书写§5.9 | `06_acceptance_step_09_nonfunctional.md` | 八小阶段完成；逐验收项微循环及跨项审查 | 当前Step自检后才可顺序推进；Step15后等待用户 |
| 10 | 证据审计 | done | 前一Step问题、诊断、取舍/未决；验收SOP Step10/书写§5.10 | `06_acceptance_step_10_evidence_audit.md` | 八小阶段完成；逐验收项微循环及跨项审查 | 当前Step自检后才可顺序推进；Step15后等待用户 |
| 11 | 一票否决 | done | 前一Step问题、诊断、取舍/未决；验收SOP Step11/书写§5.11 | `06_acceptance_step_11_blockers.md` | 八小阶段完成；逐验收项微循环及跨项审查 | 当前Step自检后才可顺序推进；Step15后等待用户 |
| 12 | 缺陷放行 | done | 前一Step问题、诊断、取舍/未决；验收SOP Step12/书写§5.12 | `06_acceptance_step_12_defects_release.md` | 八小阶段完成；来源/裁决/静态自检 | 当前Step自检后才可顺序推进；Step15后等待用户 |
| 13 | 风险接受 | done | 前一Step问题、诊断、取舍/未决；验收SOP Step13/书写§5.13 | `06_acceptance_step_13_risk_acceptance.md` | 八小阶段完成；来源/裁决/静态自检 | 当前Step自检后才可顺序推进；Step15后等待用户 |
| 14 | 结论签署 | done | 前一Step问题、诊断、取舍/未决；验收SOP Step14/书写§5.14 | `06_acceptance_step_14_conclusion_signoff.md` | 八小阶段完成；来源/裁决/静态自检 | 当前Step自检后才可顺序推进；Step15后等待用户 |
| 15 | 正式装配 | done | 前一Step问题、诊断、取舍/未决；验收SOP Step15/书写§5.15 | `06_acceptance_step_15_formal_document_assembly.md` | 八小阶段完成；来源/裁决/静态自检 | 当前Step自检后才可顺序推进；Step15后等待用户 |

只在实际到达当前Step时创建文件；所有未来Step pending没有文件。Step5~11先整体骨架，再逐验收项写可审查决策记录、规范卡及局部自检；不将整个族一次填完再补思考。

## 3. 来源/权限/事实边界

00的120原编号、03对象/字段/协议/21机/wholeCAS、04配置/secret/current、05的22cuts/116TC/22EV计划与固定run schema是唯一正式设计输入。旧06/README在独立收稳后只historical_material扫描。七上游本轮复核相关06/台账，不冒称重新全文读完00~07；L5-chat未停审正文reference_only。

平台SDK/OAuth/APIKey/KMS/route/store/executor/source/producer仍adapter/config/secret seam资格，04公开资料8选段/3unavailable不是实际installation/pin/4平台通过。本轮无需新外呼，因为定义裁决规则不能释放actual资格。

```text
current_document = 06
current_step = 15
current_module = confirmed_input_only
document_status = confirmed_for_07_input
step_status = done_design_static
gate_status = pass
gate_reason = user_confirmed_06_for_07_design_only
next_allowed_action = read_07_design_recovery_entry
formal_05_user_confirmation = explicit_continue_to_06
formal_06_design_self_review = pass_design_static_external_gates_open
formal_06_user_confirmation = explicit_confirmation_2026_10_04
calibration_write_allowed = false
formal_document_write_allowed = false
formal_06_assembly_allowed = false
next_document_allowed = true
next_document_scope = 07_design_only_user_explicit_confirmation
implementation_write_allowed = false
implementation_ledger_allowed = false
test_execution_allowed = false
commit_required = false
```

## 4. 继承blocker与范围

BR-UP-001~009=open、010=reference_only；Workspace十二项open、Observability十二affected原状态以及pre_implementation_blocked/blocked/wait_design保持。保护性拒绝的local断言不是实际正向闭环；没有运行/EV实例/验收verdict/signoff/readiness。

范围基线：[06 scope](06_acceptance_scope_baseline.json)，173个原Bridges文件/4678范围外文件，lexical codepoint SHA256 recipe；正式00~04/05语义及既有calibration/draft保护不无故改动。05仅输入认可元信息同步。不得创建实施ledger/boundary或target repo。

## 5. 过程与审计

启动验收SOP1153行/书写717行已完整阅读；通则、中间产物§3.5~3.6/§4/§5.9~5.10、真相源恢复/authority/state/evidence和全局依赖326行复核。当前正式00/05及七上游阅读范围/输出截断补读以Step1记录为准。

启动patch曾因子串不占整行而verification失败；此前三个整块元信息patch已成功。暂停语义写入，检查失败没有落盘，将helper改为先取完整唯一行后apply_patch，完成剩余许可同步。未改其他项目或把工具失败当运行测试。

Step1设计静态完成：输入角色/测试计划与裁决分离、七上游实际阅读范围和blocker、05无verdict schema边界核对完成。 未运行项目测试/关闭actual资格；下一仅顺序Step2（Step15后停止）。

Step2设计静态完成：C1~C5/共享保护/实际资格与非范围映射核对，无削弱P0或新增VETO。 未运行项目测试/关闭actual资格；下一仅顺序Step3（Step15后停止）。

Step3设计静态完成：六正式设计文件实际SHA256已读取并记录；未填写实现commit/run；固定路径与05 schema及规范等价入口核对。 未运行项目测试/关闭actual资格；下一仅顺序Step4（Step15后停止）。

Step4设计静态完成：准入/正向退出/负向确证退出/暂停四种路径核对；不把process posture写成第四verdict。 未运行项目测试/关闭actual资格；下一仅顺序Step5（Step15后停止）。

Step5设计静态完成：16FR主项独立决策→卡→局部检查已串行完成，固定TC/EV数组合法；跨FR/P1/阶段/无证处理和16/16主项无孤儿静态核对errors=[]。 未运行项目测试/关闭actual资格；下一仅顺序Step6（Step15后停止）。

Step6设计静态完成：17红线逐项决策/卡/静态停审完成，实际覆盖24BR/20DR无孤儿；没有新增VETO或修改任何上游/05协议。 未运行项目测试/关闭actual资格；下一仅顺序Step7（Step15后停止）。

Step7设计静态完成：20正式协议和6shared/dependency/qualification接缝逐项停审完成；canonical覆盖/名称、阶段、固定路径及依赖类别静态检查无缺口。 未运行项目测试/关闭actual资格；下一仅顺序Step8（Step15后停止）。

Step8设计静态完成：21机+7联合门禁逐项完成；实际比对101状态/150pair/375补集计划与源hash无漂移。 未运行项目测试/关闭actual资格；下一仅顺序Step9（Step15后停止）。

Step8补集诊断口径更正：排除self为276，05封闭要求完整state×state为375；已实际重算并明确包括未列同态，errors=[]，不修改原矩阵/05。

Step9设计静态完成：16NFR及六类别独立门禁完成；无新增未来源SLA/实际值，全部未测P0明确阻正向。 未运行项目测试/关闭actual资格；下一仅顺序Step10（Step15后停止）。

Step10设计静态完成：22EV+8report项逐项停审完成；registry映射实际比对22/116/38无孤儿，不物化任何运行证据，Handoff/HumanReview原schema不改。 未运行项目测试/关闭actual资格；下一仅顺序Step11（Step15后停止）。

Step11设计静态完成：六原VETO independent检查卡与crosscoverage完成，只定义确证标准，不填写实际触发/未触发/验收结论。 未运行项目测试/关闭actual资格；下一仅顺序Step12（Step15后停止）。

Step12设计静态完成：缺陷/复验/放行合同完成，具体共享TC/EV与六变更主题回归映射，S/A/P0/VETO不条件接受；没有实际缺陷/修复/关闭。 未运行项目测试/关闭actual资格；下一仅顺序Step13（Step15后停止）。

Step13设计静态完成：风险接受未来safe合同与非豁免缺口/原10BRUP/12WS/12affected完整承接；原状态actual静态比对一致，没有实际风险接受或关闭。 未运行项目测试/关闭actual资格；下一仅顺序Step14（Step15后停止）。

Step14设计静态完成：三值裁决与七角色签署、两planned人工最终MD完整safe字段/current/hash/authority闭合；当前没有任何actual结论/assignment/signoff。 未运行项目测试/关闭actual资格；下一仅顺序Step15（Step15后停止）。

Step15设计静态完成：十五章从规范源装配，139gate/120req/116TC/22EV及191field/17construct/21machine/20protocol闭环，历史冲突后置扫描与规范/过程分离；实际格式/链接/源码指纹/范围检查已完成。最终审计元信息已收口，三层冻结为formal_stop_review。19个06 Markdown文件572表/32围栏/281相对链接复核errors=[]；范围外4678指纹相同，19新增/四既有变更/零删除。外部资格/运行/签署均不关闭，不进入07/implementation/测试/stage/commit。

2026-10-04最新用户明确认可06并授权全部07设计；本flow完成状态及旧停审行保留历史事实，06正文和校准语义不重开。当前恢复点转项目台账和07 flow；不授实施、测试、提交或实际验收权限。

<!-- EXECUTION-APPEND -->
