# Step 17. 正式整理为 `00-需求文档.md`

> 对应 SOP: `standards/document/需求文档讨论流程_SOP.md` Step 17
> 产物文档: `projects/L0-bus/00-需求文档.md`
> 生成日期: 2026-05-29

---

## 1. 本步目标

把 Step 1 ~ Step 16 已确认的中间产物整理为正式 `00-需求文档.md`。本步只做重组、润色、编号统一和交叉引用补齐，不新增未经讨论的新需求结论。

---

## 2. 执行动作

| 动作 | 结果 |
|---|---|
| 删除旧 `projects/L0-bus/00-需求文档.md` | 已执行 |
| 按新文件标准重建正式需求文档 | 已执行 |
| 每个正式章节添加 `design-calibration` 来源 | 已执行 |
| 移除旧口径中的 26 仓、四后端全 P0、三语言 client、`04-实施计划.md` 链路 | 已执行 |
| 保留 Step 1 ~ Step 16 的核心编号 | 已执行 |

---

## 3. 回填来源索引

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
| §10 业务规则与边界约束 | `00_req_step_10_rules_boundary_constraints.md` |
| §11 数据需求与数据归属 | `00_req_step_11_data_requirements_ownership.md` |
| §12 接口与依赖 | `00_req_step_12_interfaces_dependencies.md` |
| §13 非功能需求 | `00_req_step_13_non_functional_requirements.md` |
| §14 验收标准 | `00_req_step_14_acceptance_criteria.md` |
| §15 风险与待确认事项 | `00_req_step_15_risks_open_questions.md` |
| §16 需求追溯矩阵 | `00_req_step_16_traceability_matrix.md` |

---

## 4. 正式文档收口结论

新版 `00-需求文档.md` 已把 `L0-bus` 收敛为：

> 基于 `L0-core` 共享契约的跨仓事件传递、订阅推进、失败恢复和总线级留痕主干仓。

正式文档明确：

- `L0-bus` 不重新定义 Event、Error、TraceContext、Metadata、ActorRef。
- `L0-bus` 不保存业务 payload 正文、raw secret、governance decision body 或 observability long-term log body。
- 当前 P0 主闭环是契约化输入、transport semantic、delivery、结果留痕、失败恢复和只读输出。
- Outbox relay boundary 与 backend adapter boundary 是 P0-min 支撑边界。
- Redis / Kafka 完整适配、Filter DSL、DLQ UI、多租户和 effectively-once 是后续增强，不进入当前 P0。

---

## 5. 进入下一阶段条件

- Step 1 ~ Step 16 的中间产物均已存在。
- `00-需求文档.md` 已按正式结构重建。
- 正式文档每个章节均标注了校准来源。
- 正式文档没有新增未经中间产物讨论的新结论。
