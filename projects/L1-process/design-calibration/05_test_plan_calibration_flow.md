# L1-process 05 测试方案校准流程

> SOP: `standards/document/测试方案讨论流程_SOP.md`
> 书写规范: `standards/document/测试方案书写规范.md`
> 目标文档: `projects/L1-process/05-测试方案.md`
> 上游输入: `00-需求文档.md`;`01-架构设计.md`;`02-概要设计.md`;`03-详细设计.md`;`04-配置设计.md`
> 创建日期: 2026-06-06
> 状态: Completed

---

## 1. 流程状态

| Step | 文件 | 状态 | 说明 |
|---|---|---|---|
| Step 1 | `05_test_plan_step_01_input_boundary.md` | Completed | 已确认输入边界和旧版 05 作废 |
| Step 2 | `05_test_plan_step_02_scope.md` | Completed | 已收敛测试目标、范围和非范围 |
| Step 3 | `05_test_plan_step_03_test_objects_cuts.md` | Completed | 已抽取测试对象和测试切口 |
| Step 4 | `05_test_plan_step_04_strategy_layers.md` | Completed | 已定义测试策略和分层 |
| Step 5 | `05_test_plan_step_05_traceability_coverage.md` | Completed | 已建立需求 / 规则、测试场景、用例和证据追溯 |
| Step 6 | `05_test_plan_step_06_cases_matrix.md` | Completed | 已形成 P0 用例矩阵和闭环表 |
| Step 7 | `05_test_plan_step_07_test_data.md` | Completed | 已定义测试数据集、隔离和清理规则 |
| Step 8 | `05_test_plan_step_08_environment_config.md` | Completed | 已定义测试环境与配置矩阵 |
| Step 9 | `05_test_plan_step_09_automation_gates.md` | Completed | 已定义自动化套件、门禁和脚本约束 |
| Step 10 | `05_test_plan_step_10_nonfunctional_special.md` | Completed | 已定义专项测试与非功能验证 |
| Step 11 | `05_test_plan_step_11_defect_retest.md` | Completed | 已定义缺陷分级与复验规则 |
| Step 12 | `05_test_plan_step_12_entry_exit.md` | Completed | 已定义进入准则与退出准则 |
| Step 13 | `05_test_plan_step_13_reports_evidence.md` | Completed | 已定义报告与证据归档 |
| Step 14 | `05_test_plan_step_14_regression_risk.md` | Completed | 已定义回归策略与残余风险 |
| Step 15 | `05_test_plan_step_15_formal_document_assembly.md` | Completed | 正式文档已装配 |

---

## 2. 执行纪律

- 正式 `05-测试方案.md` 已按 SOP 要求先删除旧文件,不得在旧版内容上追加。
- 所有测试结论必须来自本目录 `05_test_plan_step_*.md` 中间产物。
- 每个正式章节必须在开头列出具体校准来源文件。
- 不得沿用旧版 `Template / Profile / ProcessInstance` 测试口径;新版事实以 `03-详细设计.md` 和 `04-配置设计.md` 为准。
- 不得自行补 DTO、字段、状态、错误、事件或 evidence schema;发现缺口必须进入待确认事项或残余风险。

---

## 3. 当前输入事实

| 来源 | 状态 | 对 05 的约束 |
|---|---|---|
| `00-需求文档.md` | 已重建 | 提供 Process truth center、数据归属、非目标和验收红线 |
| `01-架构设计.md` | 已重建 | 提供上下游边界、依赖方向和跨仓协作类型 |
| `02-概要设计.md` | 已重建 | 提供主要组成部分、关键对象、处理流和状态边界 |
| `03-详细设计.md` | 已装配 | 提供模块、协议、函数流、状态机、事务、错误、幂等、观测和最小测试切口 |
| `04-配置设计.md` | 已装配 | 提供配置 profile、配置项、敏感配置、校验和配置测试交接 |
| `06-验收标准.md` | 已同步 | 消费 `05` 的 EV 编号、证据路径、suite 和缺陷 / 风险口径 |
| `07-实施计划.md` | 待生成 | 当前不安排 phase / commit,只提供测试门禁输入 |

---

## 4. 正式文档装配完成检查

正式 `05-测试方案.md` 已在以下条件同时满足后装配:

- Step 1~14 均为 Completed。
- P0 测试范围、用例、数据、环境、门禁、证据和残余风险均有中间产物。
- 每个正式章节可回指具体 `05_test_plan_step_*.md`。
- 正式文档不复用旧版 `TC-001`、`2026-05-15` 和未校准的旧测试目标;calibration 诊断段落中允许引用旧词说明废弃原因。
