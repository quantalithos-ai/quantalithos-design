# Step 17. 正式整理为 `00-需求文档.md`

> 对应 SOP: `standards/document/需求文档讨论流程_SOP.md` Step 17
> 回填章节: `projects/L0-sdk/00-需求文档.md` 全文
> 生成日期: 2026-05-30

---

## 1. 本步目标

把 Step 1~Step 16 已确认的中间产物，按 `standards/document/需求文档书写规范.md` 的正式结构重建 `projects/L0-sdk/00-需求文档.md`。本步只做重组、润色、统一术语和补齐交叉引用，不新增未经讨论的新结论。

---

## 2. 本步输入

| 输入 | 使用方式 |
|---|---|
| `00_req_step_01_upstream_relation.md` | 回填 §1 与上游文档的关系声明 |
| `00_req_step_02_position_boundary.md` | 回填 §2 本仓定位与边界 |
| `00_req_step_03_problem_context.md` | 回填 §3 背景与问题定义 |
| `00_req_step_04_goals_non_goals.md` | 回填 §4 目标与非目标 |
| `00_req_step_05_users_roles.md` | 回填 §5 用户与角色 |
| `00_req_step_06_consumers_dependencies.md` | 回填 §6 使用方与依赖 |
| `00_req_step_07_core_capability_loop.md` | 回填 §7 核心能力闭环 |
| `00_req_step_08_user_stories.md` | 回填 §8 用户故事 |
| `00_req_step_09_functional_requirements.md` | 回填 §9 功能需求 |
| `00_req_step_10_rules_boundary_constraints.md` | 回填 §10 业务规则与边界约束 |
| `00_req_step_11_data_requirements_ownership.md` | 回填 §11 数据需求与数据归属 |
| `00_req_step_12_interfaces_dependencies.md` | 回填 §12 接口与依赖 |
| `00_req_step_13_non_functional_requirements.md` | 回填 §13 非功能需求 |
| `00_req_step_14_acceptance_criteria.md` | 回填 §14 验收标准 |
| `00_req_step_15_risks_open_questions.md` | 回填 §15 风险与待确认事项 |
| `00_req_step_16_traceability_matrix.md` | 回填 §16 需求追溯矩阵 |

---

## 3. 执行动作

| 动作 | 结果 |
|---|---|
| 删除旧 `projects/L0-sdk/00-需求文档.md` | 已完成 |
| 按新版正式结构重建 `00-需求文档.md` | 已完成 |
| 每章补齐校准来源与延伸阅读 | 已完成 |
| 检查未替换占位、异常字符和 Step 状态 | 已完成 |

---

## 4. 正式文档写作约束

- 正式文档只承载收口后的结论，不写中间讨论、改动前后对比、方案取舍和待确认项推荐过程。
- 每个正式章节必须列出对应 `design-calibration` 中间产物。
- 正式章节不得新增 Step 1~16 未确认的新能力、新规则、新数据项或新验收项。
- 旧文档中的公共注册表正式发布、完整 MCP、REST / GraphQL、REPL 不得回流为当前 P0。
- `L0-sdk` 必须保持三语言官方客户端接入层定位，不得被写成 core truth、bus runtime、server facade、auth provider、UI 状态层或 runtime 执行框架。

---

## 5. 进入收尾条件

- `00-需求文档.md` 已按新版 16 章结构重建。
- 每章均有具体校准来源和延伸阅读。
- 正式文档没有异常字符、未替换占位或旧版 P0 口径残留。
- 工作台 Step 17 标记为已完成。
