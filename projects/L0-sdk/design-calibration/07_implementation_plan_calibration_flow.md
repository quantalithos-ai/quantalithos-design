# L0-sdk 07-实施计划校准流程

> 本文件是 `projects/L0-sdk/07-实施计划.md` 的 SOP 校准工作台。
> 它记录每个 Step 的中间产物位置、状态、回填章节和当前处理状态。
> 本目录中的内容是中间产物,不替代正式 `07-实施计划.md`。
>
> 本轮状态说明:
> - 当前 `projects/L0-sdk/07-实施计划.md` 尚不存在。
> - 正式 `07-实施计划.md` 不在 Step 1~12 创建或修改;Step 13 统一按新文件标准创建。
> - 本轮严格按 Step 独立执行,不合并 Step。

---

## 一、执行依据

| 类型 | 文档 |
|---|---|
| 实施计划书写规范 | `standards/document/实施计划书写规范.md` |
| 实施计划讨论 SOP | `standards/document/实施计划讨论流程_SOP.md` |
| 中间产物规范 | `standards/document/设计文档讨论中间产物规范.md` |
| 当前需求文档 | `projects/L0-sdk/00-需求文档.md` |
| 当前架构设计 | `projects/L0-sdk/01-架构设计.md` |
| 当前概要设计 | `projects/L0-sdk/02-概要设计.md` |
| 当前详细设计 | `projects/L0-sdk/03-详细设计.md` |
| 当前配置设计 | `projects/L0-sdk/04-配置设计.md` |
| 当前测试方案 | `projects/L0-sdk/05-测试方案.md` |
| 当前验收标准 | `projects/L0-sdk/06-验收标准.md` |

---

## 二、状态总览

```text
[ ] 未开始
[~] 讨论中
[x] 已确认
```

| Step | 状态 | 主题 | 中间产物 | 回填章节 |
|---|---|---|---|---|
| Step 1 | [x] | 确认实施输入边界 | `07_implementation_plan_step_01_input_boundary.md` | §1 与上游文档的关系声明 |
| Step 2 | [x] | 明确实施目标、范围和非范围 | `07_implementation_plan_step_02_scope.md` | §2 实施目标与范围 |
| Step 3 | [x] | 收稳前置条件与阅读清单 | `07_implementation_plan_step_03_prerequisites_reading.md` | §3 实施前置条件与阅读清单 |
| Step 4 | [x] | 抽取实施对象与交付物 | `07_implementation_plan_step_04_deliverables.md` | §4 实施对象与交付物清单 |
| Step 5 | [x] | 设计实施阶段与依赖顺序 | `07_implementation_plan_step_05_phases_dependencies.md` | §5 实施阶段与依赖顺序 |
| Step 6 | [x] | 拆分阶段任务、编写顺序与提交边界 | `07_implementation_plan_step_06_tasks_commits.md` | §6 阶段任务拆分、编写顺序与提交边界 |
| Step 7 | [x] | 嵌入测试与验收门禁 | `07_implementation_plan_step_07_tests_acceptance_gates.md` | §7 测试与验收门禁嵌入 |
| Step 8 | [x] | 定义配置、环境与外部依赖准备 | `07_implementation_plan_step_08_config_env_dependencies.md` | §8 配置、环境与外部依赖准备 |
| Step 9 | [x] | 定义 Spike、风险与待确认事项 | `07_implementation_plan_step_09_spikes_risks.md` | §9 Spike、风险与待确认事项 |
| Step 10 | [x] | 定义回退、暂停与变更控制 | `07_implementation_plan_step_10_rollback_change_control.md` | §10 回退、暂停与变更控制 |
| Step 11 | [x] | 定义提交、评审与交付纪律 | `07_implementation_plan_step_11_commit_review_delivery.md` | §11 提交、评审与交付纪律 |
| Step 12 | [x] | 定义实施完成判定 | `07_implementation_plan_step_12_completion_criteria.md` | §12 实施完成判定 |
| Step 13 | [x] | 整理正式实施计划文档 | `07_implementation_plan_step_13_formal_document_assembly.md` | 全文 |

---

## 三、本轮校准总目标

本轮目标不是复述详细设计,而是把已经收稳的 `00~06` 转换为实现者可执行的编码路径。

目标输出:

```text
1. 明确实施者必须先读哪些正式文档和哪些 design-calibration 中间产物。
2. 明确目标实现仓、稳定上游、path dependency、编码规范和提交规范。
3. 按可验证功能增量规划实施阶段,不按对象、文件或函数拆任务。
4. 每个阶段都包含输入、输出、编写顺序、测试门禁、验收门禁和 commit boundary。
5. 明确 scripts、artifacts/test/<run_id>、reports/runs/<run_id>、reports/acceptance 的交付要求。
6. 明确风险、暂停、回退、变更和完成判定。
```

---

## 四、执行纪律

- 每个 Step 必须先形成中间产物,不得直接创建或修改正式 `07-实施计划.md`。
- 每个 Step 必须逐项回答 SOP 的“应问的问题”。
- 每个 Step 必须包含当前文档问题诊断和改动前后对比。
- 每个 Step 必须包含实施设计取舍。
- 每个 Step 必须包含至少一个结构化产物: 表、清单、矩阵、ASCII 图或回填草稿。
- 每个 Step 如涉及图示,必须遵守实施计划 ASCII 图统一格式。
- Step 状态从 `[~]` 改为 `[x]` 后,才能进入下一 Step。
- 正式 `07-实施计划.md` 必须在 Step 13 按新文件标准创建。
- 允许参考已收稳的 `L0-core`、`L0-bus`、`L1-identity` 和 `L3-method-library` 前序中间产物,但不能机械搬运其他子项目的实施阶段。
