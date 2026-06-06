# Step 17. 正式整理为 `00-需求文档.md`

> 对应 SOP: `standards/document/需求文档讨论流程_SOP.md` Step 17
> 回填章节: `00-需求文档.md` 全文
> 生成日期: 2026-06-06

---

## 1. 本步目标

把 Step 1~Step 16 已确认并可回填的全部结论,按正式需求文档结构整理成 `projects/L1-governance/00-需求文档.md`。本步只做重组、摘录、统一术语和交叉引用,不新增未经讨论的新需求。

---

## 2. 本步输入

| 输入 | 当前状态 | 本步使用方式 |
|---|---|---|
| `design-calibration/00_req_step_01_upstream_relation.md` | 已完成 | 回填正式 §1 |
| `design-calibration/00_req_step_02_position_boundary.md` | 已完成 | 回填正式 §2 |
| `design-calibration/00_req_step_03_problem_context.md` | 已完成 | 回填正式 §3 |
| `design-calibration/00_req_step_04_goals_non_goals.md` | 已完成 | 回填正式 §4 |
| `design-calibration/00_req_step_05_users_roles.md` | 已完成 | 回填正式 §5 |
| `design-calibration/00_req_step_06_consumers_dependencies.md` | 已完成 | 回填正式 §6 |
| `design-calibration/00_req_step_07_core_capability_loop.md` | 已完成 | 回填正式 §7 |
| `design-calibration/00_req_step_08_user_stories.md` | 已完成 | 回填正式 §8 |
| `design-calibration/00_req_step_09_functional_requirements.md` | 已完成 | 回填正式 §9 |
| `design-calibration/00_req_step_10_business_rules_boundaries.md` | 已完成 | 回填正式 §10 |
| `design-calibration/00_req_step_11_data_ownership.md` | 已完成 | 回填正式 §11 |
| `design-calibration/00_req_step_12_interfaces_dependencies.md` | 已完成 | 回填正式 §12 |
| `design-calibration/00_req_step_13_non_functional_requirements.md` | 已完成 | 回填正式 §13 |
| `design-calibration/00_req_step_14_acceptance_criteria.md` | 已完成 | 回填正式 §14 |
| `design-calibration/00_req_step_15_risks_open_questions.md` | 已完成 | 回填正式 §15 |
| `design-calibration/00_req_step_16_traceability_matrix.md` | 已完成 | 回填正式 §16 |
| 旧 `projects/L1-governance/00-需求文档.md` | 已删除后重建 | 不做局部修补,只作为历史输入已在 Step 1~16 被裁剪 |

---

## 3. 动作记录

| 动作 | 结果 |
|---|---|
| 删除旧 `00-需求文档.md` | 已完成 |
| 按正式 16 章结构重建新版 `00-需求文档.md` | 已完成 |
| 每章添加 `design-calibration` 校准来源块 | 已完成 |
| 保留旧文档有价值线索 | 已通过 Step 1~16 裁剪后回填 |
| 移除旧 13 节结构、旧接口名、旧硬指标和旧实现候选口径 | 已完成;旧指标仅作为“不继承 / 候选”说明出现 |

---

## 4. 正式章节来源映射

| 正式章节 | 来源中间产物 |
|---|---|
| §1 与上游文档的关系声明 | `00_req_step_01_upstream_relation.md` |
| §2 本仓定位与边界 | `00_req_step_02_position_boundary.md` |
| §3 背景与问题定义 | `00_req_step_03_problem_context.md` |
| §4 目标与非目标 | `00_req_step_04_goals_non_goals.md` |
| §5 用户与角色 | `00_req_step_05_users_roles.md` |
| §6 使用方与依赖 | `00_req_step_06_consumers_dependencies.md` |
| §7 核心能力闭环 | `00_req_step_07_core_capability_loop.md` |
| §8 用户故事 | `00_req_step_08_user_stories.md` |
| §9 功能需求 | `00_req_step_09_functional_requirements.md` |
| §10 业务规则与边界约束 | `00_req_step_10_business_rules_boundaries.md` |
| §11 数据需求与数据归属 | `00_req_step_11_data_ownership.md` |
| §12 接口与依赖 | `00_req_step_12_interfaces_dependencies.md` |
| §13 非功能需求 | `00_req_step_13_non_functional_requirements.md` |
| §14 验收标准 | `00_req_step_14_acceptance_criteria.md` |
| §15 风险与待确认事项 | `00_req_step_15_risks_open_questions.md` |
| §16 需求追溯矩阵 | `00_req_step_16_traceability_matrix.md` |

---

## 5. 组装口径

| 项 | 本步口径 |
|---|---|
| 正式文档结构 | 使用最新需求文档规范的 16 章正式目录 |
| 旧文档处理 | 删除后重建,不做局部修补 |
| 内容来源 | 只摘录 Step 1~16 已确认结论 |
| 推理过程 | 不进入正式正文,保留在中间产物中 |
| 旧接口 / 事件 / 功能名 | 不作为需求层正式协议,仅作为历史线索已被能力级口径吸收 |
| 旧性能数字 | 不进入硬验收,只作为后续候选目标说明 |
| API / Command / Event / 状态机 / 存储 | 不在正式需求文档定稿,后移概要 / 详细 / 配置 / 实施 / 测试文档 |

---

## 6. 自检结论

| 检查项 | 当前结论 |
|---|---|
| 正式文档是否逐章标注校准来源 | 通过 |
| 正式文档是否覆盖 Step 1~16 | 通过 |
| 是否仍使用旧 `US-001` / `F-001` / `BR-001` 编号作为正式编号 | 未作为正式编号使用 |
| 是否把旧 P95 / 30s / SLA / PostgreSQL 写成需求硬基线 | 否;仅作为候选目标或不继承说明出现 |
| 是否写入 API 路径、DTO schema、handler / service / repository、事务或表结构 | 否 |
| 是否保留 process / work / artifact / conversation / identity / method-library / runtime / capability / observability / workspace / external GRC 边界 | 通过 |

---

## 7. 后续进入条件

- 正式 `00-需求文档.md` 已重建完成。
- 需求追溯矩阵无孤儿功能、孤儿规则、孤儿数据归属或孤儿验收项。
- 可进入 `01-架构设计.md` 校准流程。
