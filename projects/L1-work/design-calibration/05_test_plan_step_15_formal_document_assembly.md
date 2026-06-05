# Step 15. 整理正式测试方案文档

> 本步将 Step 1~14 的中间产物装配为正式 `projects/L1-work/05-测试方案.md`。本步只整理正式文档和自审结果,不新增测试范围、用例、字段、状态、配置项或验收裁决。

## 1. Step 状态

| 字段 | 内容 |
|---|---|
| Step | 15 |
| 状态 | 已完成 |
| 回填章节 | `projects/L1-work/05-测试方案.md` 全文 |
| 生成日期 | 2026-06-04 |

## 2. 本步输入

| 输入 | 用途 |
|---|---|
| `05_test_plan_step_01_input_boundary.md` | 正式 §1 与上游文档的关系声明 |
| `05_test_plan_step_02_scope.md` | 正式 §2 本次测试目标与范围 |
| `05_test_plan_step_03_test_objects_cuts.md` | 正式 §3 测试对象与测试切口 |
| `05_test_plan_step_04_strategy_layers.md` | 正式 §4 测试策略与分层 |
| `05_test_plan_step_05_traceability_coverage.md` | 正式 §5 需求追溯与覆盖矩阵 |
| `05_test_plan_step_06_cases_matrix.md` | 正式 §6 测试场景与用例设计 |
| `05_test_plan_step_07_test_data.md` | 正式 §7 测试数据设计 |
| `05_test_plan_step_08_environment_config.md` | 正式 §8 测试环境与配置矩阵 |
| `05_test_plan_step_09_automation_gates.md` | 正式 §9 自动化与 CI/CD 门禁 |
| `05_test_plan_step_10_special_non_functional.md` | 正式 §10 专项测试与非功能验证 |
| `05_test_plan_step_11_defects_retest.md` | 正式 §11 缺陷管理与复验规则 |
| `05_test_plan_step_12_entry_exit.md` | 正式 §12 进入准则与退出准则 |
| `05_test_plan_step_13_reports_evidence.md` | 正式 §13 测试报告与证据归档 |
| `05_test_plan_step_14_regression_risks.md` | 正式 §14 回归策略与残余风险 |
| `测试方案书写规范.md` | 15 章主链、校准来源、编号、证据和报告要求 |
| `测试方案讨论流程_SOP.md` Step 15 | 装配问题、执行约束和进入下一步条件 |

## 3. SOP 问题回答

| SOP 问题 | 本步回答 |
|---|---|
| 正式文档是否按 15 章主链组织? | 是。正式 `05-测试方案.md` 使用 §1~§15 主链,章节名与书写规范一致。 |
| 是否保留了所有 P0 测试对象、场景、数据、环境、门禁和证据? | 是。正式文档保留 P0 测试对象、`TC-WORK-*` 用例族、`DS-WORK-*` 数据集、环境矩阵、自动化 suite、`EV-WORK-*` 证据和退出门禁。 |
| 是否删除了 SOP 问题原文和讨论语气? | 是。正式文档只保留结论、矩阵、清单和校准来源,不粘贴 SOP 问题回答。 |
| 是否所有未确认项都进入残余风险? | 是。P1/P2、生产化、secret provider、config center、旧性能候选、retention 和外围增强均进入 §14。 |
| P0 用例是否都回指详细设计对象、协议、状态或错误契约? | 是。§3 / §5 / §6 均以 `03` 设计契约、状态和协议为依据,未新增字段或状态。 |
| 是否存在旧状态名、旧字段名、口语名或 phase 越界断言? | 已清理旧草案中的 Sprint Planning、artifact.approved、`WORK_PROMOTE_NOT_ELIGIBLE`、`accepted + todo` 等旧口径;正式文档使用新版 `TC-WORK-*` 和正式状态 / error surface。 |
| 是否能被 `06-验收标准.md` 直接消费? | 是。§5 / §12 / §13 / §14 提供 `AC-WORK-*`、`EV-WORK-*`、退出准则、证据归档和残余风险移交。 |

## 4. 当前文档问题诊断

| 文档 / 位置 | 当前问题 | 本步处理 |
|---|---|---|
| 旧 `05-测试方案.md` | 旧版草案基于旧对象和旧流程,含 Sprint Planning、artifact.approved、旧性能硬阈值和旧报告路径 | 删除旧文档内容,按 Step 1~14 重建 |
| 旧章节结构 | 未按新版测试方案书写规范 15 章主链组织 | 正式文档改为 §1~§15 |
| 旧用例编号 | 使用 `TC-001` 等临时编号 | 改为 `TC-WORK-*` |
| 旧证据路径 | 使用 `[待定: CI artifacts / reports/work-test]` | 改为 `artifacts/test/<run_id>`、`reports/runs/<run_id>`、`reports/acceptance` |
| 旧性能阈值 | 把 `100ms / 300ms` 写成硬阈值 | 改为观察候选,不作为 P0 release 硬阈值 |

## 5. 改动前后对比

| 维度 | 改动前 | 改动后 |
|---|---|---|
| 事实源 | 旧 `03/04` 和旧测试草案混合 | 明确新版 `00/01/02/03/04` 为事实源 |
| 章节结构 | 12 章旧结构 | 15 章规范主链 |
| 用例编号 | `TC-001` 等临时编号 | `TC-WORK-*` |
| 证据编号 | 未形成稳定 `EV` 编号 | `EV-WORK-*` |
| 自动化 | 泛化 CI 描述 | PR / main / nightly / release suite 和脚本路径明确 |
| 报告路径 | 待定 | run-scoped artifacts / reports / acceptance |
| 风险边界 | 部分风险散文表达 | S / A / B / C、退出阻断、残余风险和移交明确 |
| 上游影响 | 可能隐含重定义需求 / 设计 | 无上游回写;只承接既有设计 |

## 6. 测试设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A: 在旧 `05` 上局部修补 | 改动少 | 旧对象、旧编号和旧路径残留风险高 | 不采用 |
| 方案 B: 删除旧内容,按 Step 1~14 重建正式文档 | 事实源清晰,可追溯 | 写入量较大,需要自审 | 采用 |
| 方案 C: 把 Step 1~14 原文完整粘贴 | 保留全部细节 | 正式文档过长且混入讨论语气 | 不采用 |

采用方案 B。

原因:

- 旧正式文档已经不能承接新版 `00/01/02/03/04`。
- 正式 `05` 需要成为新版 `06` 和 `07` 的输入,必须清理旧编号、旧状态和旧路径。
- 细节仍保留在 `design-calibration` 中,正式文档只保留可执行主链和定位入口。

## 7. 结构化中间产物

### 7.1 正式章节到校准来源映射

| 正式章节 | 校准来源 |
|---|---|
| §1 与上游文档的关系声明 | `design-calibration/05_test_plan_step_01_input_boundary.md` |
| §2 本次测试目标与范围 | `design-calibration/05_test_plan_step_02_scope.md` |
| §3 测试对象与测试切口 | `design-calibration/05_test_plan_step_03_test_objects_cuts.md` |
| §4 测试策略与分层 | `design-calibration/05_test_plan_step_04_strategy_layers.md` |
| §5 需求追溯与覆盖矩阵 | `design-calibration/05_test_plan_step_05_traceability_coverage.md` |
| §6 测试场景与用例设计 | `design-calibration/05_test_plan_step_06_cases_matrix.md` |
| §7 测试数据设计 | `design-calibration/05_test_plan_step_07_test_data.md` |
| §8 测试环境与配置矩阵 | `design-calibration/05_test_plan_step_08_environment_config.md` |
| §9 自动化与 CI/CD 门禁 | `design-calibration/05_test_plan_step_09_automation_gates.md` |
| §10 专项测试与非功能验证 | `design-calibration/05_test_plan_step_10_special_non_functional.md` |
| §11 缺陷管理与复验规则 | `design-calibration/05_test_plan_step_11_defects_retest.md` |
| §12 进入准则与退出准则 | `design-calibration/05_test_plan_step_12_entry_exit.md` |
| §13 测试报告与证据归档 | `design-calibration/05_test_plan_step_13_reports_evidence.md` |
| §14 回归策略与残余风险 | `design-calibration/05_test_plan_step_14_regression_risks.md` |
| §15 参考 | `design-calibration/05_test_plan_step_15_formal_document_assembly.md` |

### 7.2 自审清单

| 检查项 | 结果 | 说明 |
|---|---|---|
| 15 章主链完整 | 通过 | §1~§15 均已存在 |
| 每章有校准来源 | 通过 | §1~§15 均有 `> 校准来源` |
| P0 覆盖矩阵存在 | 通过 | §5 |
| P0 用例族存在 | 通过 | §6 |
| P0 数据、环境、门禁存在 | 通过 | §7 / §8 / §9 |
| 证据归档存在 | 通过 | §13 |
| 残余风险存在 | 通过 | §14 |
| 不写验收裁决 | 通过 | §12~§14 均只提供证据和移交 |
| 不新增字段 / 状态 / 配置项 | 通过 | 本文只引用上游已有对象和配置口径 |
| 旧性能数字未作硬阈值 | 通过 | §10 / §14 |
| 旧 `latest` 路径未作正式证据 | 通过 | §9 / §12 / §13 / §14 |

### 7.3 装配输出

| 输出 | 状态 |
|---|---|
| `projects/L1-work/05-测试方案.md` | 已重建 |
| `projects/L1-work/design-calibration/05_test_plan_step_15_formal_document_assembly.md` | 已生成 |
| `projects/L1-work/design-calibration/05_test_plan_calibration_flow.md` | 待本步更新 |

## 8. 对上游设计的影响判定

| 测试结论 | 是否影响上游设计 | 影响类型 | 回写位置 | 处理状态 |
|---|---|---|---|---|
| 正式 `05` 按 Step 1~14 装配,未新增字段、状态、协议、错误、配置项或验收裁决 | 否 | 正式文档装配 | 无 | 无回写 |
| 旧草案内容被新版测试主链替换 | 否 | 文档事实源更新 | 无 | 无回写 |
| P1/P2 和残余风险进入 §14,未升级为 P0 硬门禁 | 否 | 范围裁剪 | 无 | 无回写 |

## 9. 回填草稿

已回填到正式 `projects/L1-work/05-测试方案.md` 全文。

正式文档采用:

```text
1. 与上游文档的关系声明
2. 本次测试目标与范围
3. 测试对象与测试切口
4. 测试策略与分层
5. 需求追溯与覆盖矩阵
6. 测试场景与用例设计
7. 测试数据设计
8. 测试环境与配置矩阵
9. 自动化与 CI/CD 门禁
10. 专项测试与非功能验证
11. 缺陷管理与复验规则
12. 进入准则与退出准则
13. 测试报告与证据归档
14. 回归策略与残余风险
15. 参考
```

## 10. 待确认事项

无阻塞进入后续 `06-验收标准.md` 校准的设计待确认事项。

人工审核时建议重点确认:

| 审核点 | 期望 |
|---|---|
| 正式文档结构 | 是否接受 15 章主链和每章校准来源 |
| 旧草案替换 | 是否接受删除旧 Sprint Planning / artifact.approved / 临时路径口径 |
| P0 范围 | 是否确认当前 P0 不包括 production-like、secret provider、config center 和旧性能硬阈值 |
| 证据边界 | 是否确认 `EV-WORK-*` 和 run-scoped report 可供新版 `06` 消费 |

## 11. 进入下一步条件

| 条件 | 状态 |
|---|---|
| 正式 `05-测试方案.md` 已按 15 章主链装配 | 通过 |
| 每章校准来源已保留 | 通过 |
| P0 用例、数据、环境、门禁、报告和风险已可追溯 | 通过 |
| 未把执行结果写入测试方案 | 通过 |
| 未写验收裁决 | 通过 |
| 可作为新版 `06-验收标准.md` 和 `07-实施计划.md` 输入 | 通过 |
