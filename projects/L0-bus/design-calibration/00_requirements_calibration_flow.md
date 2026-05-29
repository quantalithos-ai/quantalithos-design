# L0-bus 需求文档校准工作台

> 对应文档: `projects/L0-bus/00-需求文档.md`
> 对应 SOP: `standards/document/需求文档讨论流程_SOP.md`
> 创建日期: 2026-05-29
> 当前目标: 按最新需求 SOP 校准 `L0-bus`，并允许它依赖已经稳定的上游仓库结论。

---

## 1. 本轮校准原则

- `L0-bus` 可以依赖已经稳定的 `L0-core` 设计结论，不重新定义 Event、Error、TraceContext、Metadata、ActorRef 等基础契约。
- `L0-core` 是 `L0-bus` 的直接稳定上游；`L1-identity`、`L3-method-library` 可作为已经讨论稳定的下游 / 相邻消费样本，但不反向定义 bus 需求。
- 旧 `00-需求文档.md`、`01-架构设计.md`、`02-概要设计.md`、`03-详细设计.md`、`05-测试方案.md`、`06-验收标准.md` 只能作为旧事实和问题诊断输入，不能直接视为新版需求基线。
- 本轮先按 Step 逐个生成中间产物，最后在 Step 17 删除旧 `00-需求文档.md` 并按新文件标准重建正式需求文档。
- 每个 Step 必须独立落盘、独立更新本文状态，不合并 Step。

---

## 2. 稳定上游与可参考对象

| 对象 | 当前状态 | 本轮使用方式 |
|---|---|---|
| `L0-core` | 已完成 `00`~`07` 深度校准 | 作为直接稳定上游，承接共享契约、事件包络基础、错误、trace、metadata、配置和 evidence 口径 |
| `L1-identity` | 已完成深度校准 | 作为下游事件发布 / 订阅消费样本，不反向定义 bus 基础语义 |
| `L3-method-library` | 已完成深度校准 | 作为方法资产事件消费样本，不反向定义 bus 基础语义 |
| 旧 `L0-bus` 文档 | 未按最新 SOP 校准 | 作为旧口径诊断和可迁移事实来源 |

---

## 3. Step 状态表

| Step | 主题 | 状态 | 中间产物 |
|---|---|---|---|
| Step 1 | 与上游文档的关系声明 | 已完成 | `design-calibration/00_req_step_01_upstream_relation.md` |
| Step 2 | 本仓定位与边界 | 已完成 | `design-calibration/00_req_step_02_position_boundary.md` |
| Step 3 | 背景与问题定义 | 已完成 | `design-calibration/00_req_step_03_problem_context.md` |
| Step 4 | 目标与非目标 | 已完成 | `design-calibration/00_req_step_04_goals_non_goals.md` |
| Step 5 | 用户与角色 | 已完成 | `design-calibration/00_req_step_05_users_roles.md` |
| Step 6 | 使用方与依赖 | 已完成 | `design-calibration/00_req_step_06_consumers_dependencies.md` |
| Step 7 | 核心能力闭环 | 已完成 | `design-calibration/00_req_step_07_core_capability_loop.md` |
| Step 8 | 用户故事 | 已完成 | `design-calibration/00_req_step_08_user_stories.md` |
| Step 9 | 功能需求 | 已完成 | `design-calibration/00_req_step_09_functional_requirements.md` |
| Step 10 | 业务规则与边界约束 | 已完成 | `design-calibration/00_req_step_10_rules_boundary_constraints.md` |
| Step 11 | 数据需求与数据归属 | 已完成 | `design-calibration/00_req_step_11_data_requirements_ownership.md` |
| Step 12 | 接口与依赖 | 已完成 | `design-calibration/00_req_step_12_interfaces_dependencies.md` |
| Step 13 | 非功能需求 | 已完成 | `design-calibration/00_req_step_13_non_functional_requirements.md` |
| Step 14 | 验收标准 | 已完成 | `design-calibration/00_req_step_14_acceptance_criteria.md` |
| Step 15 | 风险与待确认事项 | 已完成 | `design-calibration/00_req_step_15_risks_open_questions.md` |
| Step 16 | 需求追溯矩阵 | 已完成 | `design-calibration/00_req_step_16_traceability_matrix.md` |
| Step 17 | 正式整理为 `00-需求文档.md` | 已完成 | `design-calibration/00_req_step_17_formal_document_assembly.md` |

---

## 4. 关键决策结果

| 编号 | 问题 | 本轮结论 |
|---|---|---|
| D-001 | 旧文档中的 NATS / Redis / Kafka / InMem 四后端是否仍作为 P0 需求 | 否。当前 P0 是 adapter boundary + default verifiable path，完整 Redis / Kafka 等后端适配后移到 P1/P2。 |
| D-002 | 旧文档中的 Python / TypeScript client 是否属于 `L0-bus` | 否。高层 client 与开发者体验归 `L0-sdk`，`L0-bus` 只提供 transport view / transport contract 边界。 |
| D-003 | 旧文档中的 147 事件目录是否仍作为 bus 需求输入 | 只作为事件规模和消费样本输入；事件 schema 真相由 `L0-core` 承接。 |
| D-004 | `architecture/bus-draft` 是否作为权威设计 | 否。它是历史草案和候选事实来源，不高于 `L0-core` 与本轮新版 `00-需求文档.md`。 |

---

## 5. 下一步

需求文档校准已完成。

本轮完成内容：

- 已完成 Step 1 ~ Step 17 全部中间产物。
- 已删除并重建 `projects/L0-bus/00-需求文档.md`。
- 后续可以进入 `L0-bus` 架构设计讨论。
