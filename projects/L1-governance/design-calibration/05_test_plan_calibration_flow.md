# L1-governance 05 测试方案校准工作台

> 对应 SOP: `standards/document/测试方案讨论流程_SOP.md`
> 中间产物规范: `standards/document/设计文档讨论中间产物规范.md`
> 书写规范: `standards/document/测试方案书写规范.md`
> 目标正式文档: `projects/L1-governance/05-测试方案.md`
> 创建日期: 2026-06-09
> 当前状态: Step 15 框架已写入;等待用户审查后进入 15.2 正文填充

---

## 1. 本轮目标

按测试方案 SOP 将新版 `00-需求文档.md`、`01-架构设计.md`、`02-概要设计.md`、`03-详细设计.md` 和 `04-配置设计.md` 中已经收稳的测试输入转译成正式 `05-测试方案.md`。

正式 `05-测试方案.md` 必须在 Step 15 由 Step 1~14 中间产物装配生成。本轮不得从旧 `05-测试方案.md`、旧 `06-验收标准.md` 或实现侧假设直接生成测试用例。测试方案必须先确认测试输入边界,再逐步收敛测试目标、测试对象、测试切口、分层策略、覆盖矩阵、用例、数据、环境、自动化门禁、专项测试、缺陷复验、进出准则、证据归档和残余风险。

## 2. 权威输入

| 输入 | 权威级别 | 用途 |
|---|---|---|
| `projects/L1-governance/00-需求文档.md` | 正式上游 | 需求边界、FR / BR、核心闭环、非功能、数据归属、验收方向 |
| `projects/L1-governance/01-架构设计.md` | 正式上游 | 架构边界、依赖裁剪、数据所有权、横切约束、产品中立和风险红线 |
| `projects/L1-governance/02-概要设计.md` | 正式上游 | 组件、关键对象、API 骨架、处理流、状态、异常、配置影响和详细设计交接 |
| `projects/L1-governance/03-详细设计.md` | 直接输入 | 模块、对象、协议、flow、状态矩阵、事务、错误、幂等、配置、观测和测试切口 |
| `projects/L1-governance/design-calibration/03_ddd_step_16_test_cuts.md` | 直接输入 | 最小测试切口、模块 / 接口 / 状态 / 一致性 / 配置 / 观测测试入口 |
| `projects/L1-governance/04-配置设计.md` | 直接输入 | 配置 profile、配置项、加载校验、敏感配置、失效降级和测试 / 验收承接 |
| `projects/L1-governance/05-测试方案.md` | 旧 / 待重建草案 | 只作为历史诊断输入;不得覆盖新版 `00`~`04` |
| `projects/L1-governance/06-验收标准.md` | 旧 / 待重建草案 | 只作为验收方向输入;正式 evidence / veto 口径需后续重建 |

## 3. Step 状态表

| Step | 主题 | 中间产物 | 状态 |
|---|---|---|---|
| Step 1 | 确认测试输入边界 | `05_test_plan_step_01_input_boundary.md` | [x] 已完成 |
| Step 2 | 明确测试目标、范围和非范围 | `05_test_plan_step_02_scope.md` | [x] 已完成 |
| Step 3 | 抽取测试对象与测试切口 | `05_test_plan_step_03_test_objects_cuts.md` | [x] 已完成 |
| Step 4 | 制定测试策略与分层 | `05_test_plan_step_04_strategy_layers.md` | [x] 已完成 |
| Step 5 | 建立需求追溯与覆盖矩阵 | `05_test_plan_step_05_traceability_coverage.md` | [x] 已完成 |
| Step 6 | 设计测试场景与用例矩阵 | `05_test_plan_step_06_cases.md` | [x] 已完成 |
| Step 7 | 设计测试数据 | `05_test_plan_step_07_test_data.md` | [x] 已完成 |
| Step 8 | 设计测试环境与配置矩阵 | `05_test_plan_step_08_environment_config.md` | [x] 已完成 |
| Step 9 | 设计自动化与 CI/CD 门禁 | `05_test_plan_step_09_automation_gates.md` | [x] 已完成 |
| Step 10 | 设计专项测试与非功能验证 | `05_test_plan_step_10_nonfunctional.md` | [x] 已完成 |
| Step 11 | 定义缺陷管理与复验规则 | `05_test_plan_step_11_defects_retest.md` | [x] 已完成 |
| Step 12 | 定义进入准则与退出准则 | `05_test_plan_step_12_entry_exit.md` | [x] 已完成 |
| Step 13 | 定义测试报告与证据归档 | `05_test_plan_step_13_evidence.md` | [x] 已完成 |
| Step 14 | 定义回归策略与残余风险 | `05_test_plan_step_14_regression_risks.md` | [x] 已完成 |
| Step 15 | 整理正式测试方案文档 | `05_test_plan_step_15_formal_document_assembly.md` | [~] 框架已写入 |

## 4. 执行纪律

- 每个 Step 独立生成中间产物,不得合并 Step。
- 每个 Step 完成后暂停,由用户审查后再进入下一 Step。
- 正式 `05-测试方案.md` 必须在 Step 15 由已完成的 Step 中间产物装配,不得提前直接重写正式文档。
- 旧 `05-测试方案.md` 和旧 `06-验收标准.md` 只能作为历史诊断或方向输入,不得覆盖新版 `00`~`04`。
- 每个 P0 测试切口必须回指正式设计真相源,不得自行发明字段、状态、接口、错误、证据口径或 phase boundary。
- 测试方案不得替代详细设计补对象 schema、port、DTO、状态矩阵、事务规则、配置项或错误定义。
- 长内容按 Step 或章节分批写入;单次写入以 100~300 行为宜,内容复杂时分多批写完整,不得为了满足行数压缩内容。
- 若测试设计发现上游设计缺口,必须进入待确认事项;缺口影响 1:1 落码或可验证性时,后续应回写对应正式设计文档。

## 5. 当前已知边界

| 边界 | 结论 |
|---|---|
| 正式文档生成时机 | Step 15 前不重写正式 `05-测试方案.md` |
| 旧测试方案 | 历史草稿,包含旧 GovernanceRequest / Gate / Decision / RiskAcceptance 口径,不得作为当前测试真相源 |
| 旧验收标准 | 历史草稿,可提示验收关注方向,但 evidence / veto 需在新版 `06` 重建 |
| 测试对象来源 | 优先从 `03-详细设计.md` 和 `03_ddd_step_16_test_cuts.md` 抽取 |
| 配置测试来源 | 优先从 `04-配置设计.md` §12 及配置 Step 中间产物抽取 |
| 产品选型 | DB / bus / search / external GRC 等产品未锁定,测试方案采用 fake / controlled / disabled / product-neutral 接缝 |
| 验收证据 | 由测试方案定义 evidence 产出面,由后续 `06-验收标准.md` 裁决 |

## 6. 下一步

Step 15.2 将填充正式 `05-测试方案.md` §1~§3。进入 15.2 前需要用户确认当前框架、每章校准来源、延伸阅读、待填内容清单和 15.2~15.9 分批写入计划。
