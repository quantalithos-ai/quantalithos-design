# L5-chat 05 测试方案校准流程

> 2026-10-01；full-restart / single-agent-serial。
> 授权：用户“现在完成全部05”。只完成05 Step1～15及原路径正式05，完成即停审，不进入06。
> 当前：Step15 done / formal_stop_review；gate_status pass_with_upstream_blockers；implementation not_started。
> 仅本项目设计/校准/台账；不执行应用测试，不生成真实run/artifact/EV，不提交commit。

## 1. 顺序计划

| Step | 主题 | 产物 | 状态 | gate |
|---|---|---|---|---|
| 1 | 与上游文档的关系声明 | 05_test_plan_step_01_upstream_boundary.md | done | pass_with_upstream_blockers |
| 2 | 本次测试目标与范围 | 05_test_plan_step_02_scope.md | done | pass_with_upstream_blockers |
| 3 | 测试对象与测试切口 | 05_test_plan_step_03_test_objects_cuts.md | done | pass_with_upstream_blockers |
| 4 | 测试策略与分层 | 05_test_plan_step_04_strategy_layers.md | done | pass_with_upstream_blockers |
| 5 | 需求追溯与覆盖矩阵 | 05_test_plan_step_05_traceability_coverage.md | done | pass_with_upstream_blockers |
| 6 | 测试场景与用例设计 | 05_test_plan_step_06_cases.md | done | pass_with_upstream_blockers |
| 7 | 测试数据设计 | 05_test_plan_step_07_test_data.md | done | pass_with_upstream_blockers |
| 8 | 测试环境与配置矩阵 | 05_test_plan_step_08_environment_config.md | done | pass_with_upstream_blockers |
| 9 | 自动化与CI/CD门禁 | 05_test_plan_step_09_automation_gates.md | done | pass_with_upstream_blockers |
| 10 | 专项测试与非功能验证 | 05_test_plan_step_10_nonfunctional.md | done | pass_with_upstream_blockers |
| 11 | 缺陷管理与复验规则 | 05_test_plan_step_11_defects_retest.md | done | pass_with_upstream_blockers |
| 12 | 进入准则与退出准则 | 05_test_plan_step_12_entry_exit.md | done | pass_with_upstream_blockers |
| 13 | 测试报告与证据归档 | 05_test_plan_step_13_evidence.md | done | pass_with_upstream_blockers |
| 14 | 回归策略与残余风险 | 05_test_plan_step_14_regression_risks.md | done | pass_with_upstream_blockers |
| 15 | 参考 | 05_test_plan_step_15_formal_document_assembly.md | done | pass_with_upstream_blockers |

## 2. 执行纪律

先读取前序产物与台账，再回答问题、诊断、对比、取舍、结构化输出、复杂度审查、回填、自检。复杂Step3/5/6/7/9/13按协议族、状态主体、配置切口及证据种类小循环；本cut自检完成才处理下cut。未来Step只有计划，不预建。每patch≤180行。

## 3. 输入与边界

当前00～04及03 Step16是契约源；旧05/README只historical_material。测试SOP/书写规范、中间产物§5.10、真相源§2.15/§7为流程与证据约束。各owner00～07沿用03/04阅读记录；Governance05仅参考逐cut用例与EV-CAND结构，不复制后端事务。L6-bridges只边界参考。

43协议、17主体/12enum、14CONC、15错误、12CUT-CFG、14全局cut必须有明确覆盖。fixture、正式SDK integration、真实native/AT各自门禁；配置示例不是生产预算。

## 4. 阻塞与下一动作

CHAT-UP001～009、WS-UP001～008、CHAT-BASE001及native批准、生产预算、版本/来源/发布/质量继续open/blocked。BASE001引用00真实AC-NFR001～007及NFR001～024，不造AC-NFR008～024。06未校准，只用00§14实际AC与七条否决方向。
Step15 done / formal_stop_review。gate只说明测试设计完整；implementation ledger及boundary skeleton仅正式07完成创建。planned TC/EV不是执行结果。

## 5. 完成与停审记录

Step1～15依序完成、前序local gate成立再建立下一文件；十五章正式05在旧路径删除重建。216个planned TC族（协议86、状态51、配置24、并发14、错误15、安全10、AT5、报告7、真实层4），16suite/16planned EV，每EV对应实际注册TC集合；参数instance分母将由源row/guard/负向变体冻结，不是当前执行覆盖率。

17份05文件静态审查：章节/10节Step结构、围栏/表格列、相对链接、43协议/17状态、TC注册与EV分区、实际AC-NFR001～007、git diff --check通过。审查修复host-unit TS/Rust双入口、报告machine首次redaction与final derived检查、LocalPage.limit与逐字段/retry参数；全部回填原Step和正式05，无待回写本地缺口。

10类跨文档复核位于Step15 §7/正式§15.2。CHAT-UP/WS-UP/BASE/native/质量/版本/来源/归档继续open/blocked。正式05停审，下一动作仅用户审阅；获授权06后读验收SOP/书写规范与当前05/00实际AC。无实现仓/代码/安装/编译/应用测试/run/证据/acceptance/readiness或commit。
