# L0-bus 05-测试方案校准流程

> 本文件是 `projects/L0-bus/05-测试方案.md` 的 SOP 校准工作台。
> 它记录每个 Step 的中间产物位置、状态、回填章节和当前处理状态。
> 本目录中的内容是中间产物,不替代正式 `05-测试方案.md`。
>
> 本轮状态说明:
> - 当前 `projects/L0-bus/05-测试方案.md` 是 2026-05-17 旧版草案。
> - 旧版 `05` 仍围绕 envelope / routing / callback schema 展开,与新版 `00~04` 的 publication / delivery / feedback / recovery / read-only output / config 主线不一致。
> - 正式 `05-测试方案.md` 不在 Step 1~14 修改;Step 15 统一删除旧文件并按新文件标准重建。

---

## 一、执行依据

| 类型 | 文档 |
|---|---|
| 测试方案书写规范 | `standards/document/测试方案书写规范.md` |
| 测试方案讨论 SOP | `standards/document/测试方案讨论流程_SOP.md` |
| 中间产物规范 | `standards/document/设计文档讨论中间产物规范.md` |
| 当前需求文档 | `projects/L0-bus/00-需求文档.md` |
| 当前架构设计 | `projects/L0-bus/01-架构设计.md` |
| 当前概要设计 | `projects/L0-bus/02-概要设计.md` |
| 当前详细设计 | `projects/L0-bus/03-详细设计.md` |
| 当前配置设计 | `projects/L0-bus/04-配置设计.md` |
| 当前旧测试方案 | `projects/L0-bus/05-测试方案.md` |
| 当前旧验收标准 | `projects/L0-bus/06-验收标准.md` |

---

## 二、状态总览

```text
[ ] 未开始
[~] 讨论中
[x] 已确认
```

| Step | 状态 | 主题 | 中间产物 | 回填章节 |
|---|---|---|---|---|
| Step 1 | [x] | 确认测试输入边界 | `05_test_plan_step_01_input_boundary.md` | §1 与上游文档的关系声明 |
| Step 2 | [x] | 明确测试目标、范围和非范围 | `05_test_plan_step_02_scope.md` | §2 本次测试目标与范围 |
| Step 3 | [x] | 抽取测试对象与测试切口 | `05_test_plan_step_03_test_objects_slices.md` | §3 测试对象与测试切口 |
| Step 4 | [x] | 制定测试策略与分层 | `05_test_plan_step_04_strategy_layers.md` | §4 测试策略与分层 |
| Step 5 | [x] | 建立需求追溯与覆盖矩阵 | `05_test_plan_step_05_traceability_matrix.md` | §5 需求追溯与覆盖矩阵 |
| Step 6 | [x] | 设计测试场景与用例矩阵 | `05_test_plan_step_06_cases.md` | §6 测试场景与用例设计 |
| Step 7 | [x] | 设计测试数据 | `05_test_plan_step_07_test_data.md` | §7 测试数据设计 |
| Step 8 | [x] | 设计测试环境与配置矩阵 | `05_test_plan_step_08_environment_config.md` | §8 测试环境与配置矩阵 |
| Step 9 | [x] | 设计自动化与 CI/CD 门禁 | `05_test_plan_step_09_automation_ci_gates.md` | §9 自动化与 CI/CD 门禁 |
| Step 10 | [x] | 设计专项测试与非功能验证 | `05_test_plan_step_10_special_nonfunctional.md` | §10 专项测试与非功能验证 |
| Step 11 | [x] | 定义缺陷管理与复验规则 | `05_test_plan_step_11_defects_retest.md` | §11 缺陷管理与复验规则 |
| Step 12 | [x] | 定义进入准则与退出准则 | `05_test_plan_step_12_entry_exit_criteria.md` | §12 进入准则与退出准则 |
| Step 13 | [x] | 定义测试报告与证据归档 | `05_test_plan_step_13_reports_evidence.md` | §13 测试报告与证据归档 |
| Step 14 | [x] | 定义回归策略与残余风险 | `05_test_plan_step_14_regression_risks.md` | §14 回归策略与残余风险 |
| Step 15 | [x] | 整理正式测试方案文档 | `05_test_plan_step_15_formal_document_assembly.md` | 全文 |

---

## 三、本轮校准总目标

本轮不是修补旧版 `05-测试方案.md`,而是按新版 `00~04` 重新生成 L0-bus 测试方案。

目标输出:

```text
1. 05 只承接需求、架构、概要、详细和配置设计结论,不重新定义它们。
2. 05 按测试方案书写规范的 15 章主链组织。
3. 05 从 publication / delivery / feedback / recovery / read-only output / config / observability / reports 主线抽取测试对象。
4. 05 明确 P0 测试切口、用例矩阵、数据、环境、自动化门禁、专项测试和证据归档。
5. 05 为 06-验收标准提供可裁决证据。
6. 05 不写实施排期、不写部署命令、不重新定义 Rust struct / enum / trait / function。
7. 如果 05 发现必须改变 03 或 04 的设计契约,必须回到对应文档重新校准。
```

---

## 四、执行纪律

- 每个 Step 必须先形成中间产物,不得直接修改正式 `05-测试方案.md`。
- 每个 Step 必须逐项回答 SOP 的“应问的问题”。
- 每个 Step 必须包含当前文档问题诊断和改动前后对比。
- 每个 Step 必须包含测试设计取舍。
- 每个 Step 必须包含至少一个结构化产物: 表格、ASCII 图、矩阵、清单或回填草稿。
- 每个 Step 如涉及图示,必须遵守测试方案 ASCII 图统一格式。
- Step 状态从 `[~]` 改为 `[x]` 后,才能进入下一 Step。
- 正式 `05-测试方案.md` 必须在 Step 15 删除旧文件后按新文件标准重建。
- 允许参考已收稳的 `L0-core`、`L1-identity`、`L3-method-library` 和 `L0-bus` 前序中间产物,但不能机械搬运其他子项目的测试用例。
