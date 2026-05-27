# L0-core 01-架构设计校准流程

> 本文件是 `projects/L0-core/01-架构设计.md` 的 SOP 校准工作台。
> 它记录每个 Step 的中间产物位置、状态和回填章节。
> 本目录中的内容是中间产物,不替代正式 `01-架构设计.md`。

---

## 一、执行依据

| 类型 | 文档 |
|---|---|
| 架构设计书写规范 | `standards/document/架构设计书写规范.md` |
| 架构设计讨论 SOP | `standards/document/架构设计讨论流程_SOP.md` |
| 中间产物规范 | `standards/document/设计文档讨论中间产物规范.md` |
| 项目文档总约定 | `projects/README.md` |
| 子项目强制规范 | `standards/子项目遵循规范清单.md` §一 L0 共享契约层 |
| 当前需求文档 | `projects/L0-core/00-需求文档.md` |
| 待校准架构设计 | `projects/L0-core/01-架构设计.md` |

---

## 二、状态总览

```text
[ ] 未开始
[~] 讨论中
[x] 已确认
```

| Step | 状态 | 主题 | 中间产物 | 回填章节 |
|---|---|---|---|---|
| Step 1 | [x] | 确认需求基线 | `01_arch_step_01_requirements_baseline.md` | §1 / §3 / §16 |
| Step 2 | [x] | 明确架构目标与约束 | `01_arch_step_02_arch_goals_constraints.md` | §2 / §3 |
| Step 3 | [x] | 职责边界 | `01_arch_step_03_responsibility_boundary.md` | §4 |
| Step 4 | [x] | 系统边界与上下文 | `01_arch_step_04_system_context.md` | §5 |
| Step 5 | [x] | 限界上下文与子域划分 | `01_arch_step_05_bounded_context.md` | §6 |
| Step 6 | [x] | 容器与部署视图 | `01_arch_step_06_container_deployment.md` | §7 |
| Step 7 | [x] | 依赖方向与层间约束 | `01_arch_step_07_dependency_direction.md` | §8 |
| Step 8 | [x] | 数据所有权与一致性策略 | `01_arch_step_08_data_ownership_consistency.md` | §9 |
| Step 9 | [x] | 关键交互与通信方式 | `01_arch_step_09_interactions_communication.md` | §10 |
| Step 10 | [x] | 关键技术选型 | `01_arch_step_10_technology_choices.md` | §11 |
| Step 11 | [x] | 备选方案与取舍 | `01_arch_step_11_alternatives_tradeoffs.md` | §12 |
| Step 12 | [x] | 横切关注点 | `01_arch_step_12_cross_cutting.md` | §13 |
| Step 13 | [x] | 演进路线 | `01_arch_step_13_evolution_roadmap.md` | §14 |
| Step 14 | [x] | 风险与待确认事项 | `01_arch_step_14_risks_open_questions.md` | §15 |
| Step 15 | [x] | ADR 与需求追溯 | `01_arch_step_15_adr_traceability.md` | §16 / §17 |
| Step 16 | [x] | 整理正式文档 | `01_arch_step_16_formal_document_assembly.md` | 全文 |

---

## 三、本轮校准总目标

本轮不是扩写旧版 `01-架构设计.md`,而是基于已收稳的 `00-需求文档.md` 重新校准 `L0-core` 的架构边界。

目标输出:

```text
1. 明确 L0-core 在架构层是跨仓共享契约来源,不是 proto 工具链仓、SDK 发布仓、bus 实现或业务域服务。
2. 明确本仓系统边界、职责边界、数据所有权、依赖方向和关键交互。
3. 明确哪些上游标准、草案和事件目录是输入来源,哪些不是运行时外部依赖。
4. 清除旧版 26 仓、下游 25 仓、三语言 binding 作为核心职责、CI 指标作为架构目标等过期口径。
5. 形成可继续驱动 `02-概要设计.md` 和 `03-详细设计.md` 的架构基线。
```

---

## 四、执行纪律

- 每个 Step 必须先形成中间产物,不得直接改正式 `01-架构设计.md`。
- 每个 Step 必须逐项回答 SOP 的“应问的问题”。
- 每个 Step 必须包含当前文档问题诊断和改动前后对比。
- 架构阶段不得写 Rust struct、proto 字段、handler、repository、DDL、测试用例或实施命令。
- 产图 Step 必须使用 `架构设计书写规范.md` 的 ASCII 图统一格式。
- Step 状态从 `[~]` 改为 `[x]` 后,才能进入下一 Step。
- 未确认事项不得写成正式架构结论。
- 每个 Step 到达“待确认事项”时,必须列出 2~3 个可选方案,并给出推荐方案与推荐理由;用户确认后,再把该项收口为已确认结论。
