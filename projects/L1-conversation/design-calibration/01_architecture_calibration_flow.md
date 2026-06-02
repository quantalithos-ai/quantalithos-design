# L1-conversation 架构设计校准工作台

> 对应文档: `projects/L1-conversation/01-架构设计.md`
> 对应 SOP: `standards/document/架构设计讨论流程_SOP.md`
> 创建日期: 2026-06-01
> 当前目标: 按最新架构 SOP 校准 `L1-conversation`,承接已完成的新版 `00-需求文档.md`。

---

## 1. 本轮校准原则

- 架构设计必须承接新版 `00-需求文档.md`,不能回到旧版“Conversation 四形态 + Turn kind + AG-UI 17”作为架构主线。
- `L1-conversation` 是平台对话真相仓,不是 Chat UI、Workspace 聚合视图、Bridges 外部平台适配、Runtime 推理系统、Governance 决策系统、Artifact 正文仓或 Identity 生命周期仓。
- 本轮架构校准允许依赖已经稳定的 `L0-core`、`L0-bus`、`L0-sdk`、`L1-identity` 结论。
- 旧 `01-架构设计.md` 只作为历史输入和问题诊断来源,正式架构文档将在 Step 16 删除旧文件后按新文件标准重建。
- 每个 Step 必须独立落盘、独立更新本文状态,不得合并 Step。

---

## 2. 稳定输入

| 输入 | 当前状态 | 本轮使用方式 |
|---|---|---|
| `00-需求文档.md` | 已按需求 SOP 重建 | 作为架构需求基线 |
| `design-calibration/00_req_step_01_upstream_relation.md` ~ `00_req_step_17_formal_document_assembly.md` | 已完成 | 用于追溯需求结论来源 |
| `projects/L0-core/00~07` | 已完成深度校准 | 承接共享 ID、Error、ActorRef、TraceContext、metadata、配置和 evidence |
| `projects/L0-bus/00~07` | 已完成深度校准 | 承接事件协作、订阅、投递、重放、死信和报告证据 |
| `projects/L0-sdk/00~07` | 已完成深度校准 | 承接默认下游接入封装和 client surface |
| `projects/L1-identity/00~07` | 已完成深度校准 | 承接成员、actor、角色和生命周期引用 |
| 旧 `01-架构设计.md` | 未按最新 SOP 校准 | 仅作为历史草案和问题诊断输入 |

---

## 3. Step 状态表

| Step | 主题 | 状态 | 中间产物 |
|---|---|---|---|
| Step 1 | 确认需求基线 | 已完成 | `design-calibration/01_arch_step_01_requirement_baseline.md` |
| Step 2 | 明确架构目标与约束 | 已完成 | `design-calibration/01_arch_step_02_goals_constraints.md` |
| Step 3 | 职责边界 | 已完成 | `design-calibration/01_arch_step_03_responsibility_boundary.md` |
| Step 4 | 系统边界与上下文 | 已完成 | `design-calibration/01_arch_step_04_system_context.md` |
| Step 5 | 限界上下文与子域划分 | 已完成 | `design-calibration/01_arch_step_05_bounded_context_subdomains.md` |
| Step 6 | 容器与部署视图 | 已完成 | `design-calibration/01_arch_step_06_container_deployment.md` |
| Step 7 | 依赖方向与层间约束 | 已完成 | `design-calibration/01_arch_step_07_dependency_direction.md` |
| Step 8 | 数据所有权与一致性策略 | 已完成 | `design-calibration/01_arch_step_08_data_ownership_consistency.md` |
| Step 9 | 关键交互与通信方式 | 已完成 | `design-calibration/01_arch_step_09_interactions_communication.md` |
| Step 10 | 关键技术选型 | 已完成 | `design-calibration/01_arch_step_10_technology_choices.md` |
| Step 11 | 备选方案与取舍 | 已完成 | `design-calibration/01_arch_step_11_alternatives_tradeoffs.md` |
| Step 12 | 横切关注点 | 已完成 | `design-calibration/01_arch_step_12_cross_cutting_concerns.md` |
| Step 13 | 演进路线 | 已完成 | `design-calibration/01_arch_step_13_evolution_path.md` |
| Step 14 | 风险与待确认事项 | 已完成 | `design-calibration/01_arch_step_14_risks_open_questions.md` |
| Step 15 | ADR 与需求追溯 | 已完成 | `design-calibration/01_arch_step_15_adr_traceability.md` |
| Step 16 | 整理正式文档 | 已完成 | `design-calibration/01_arch_step_16_formal_document_assembly.md` |

---

## 4. 当前已收敛的关键决策

| 编号 | 问题 | 本轮结论 |
|---|---|---|
| D-ARCH-001 | 是否以旧 `01-架构设计.md` 作为正式基线局部修补 | 否。旧文档作为历史输入,正式文档在 Step 16 删除旧文件后重建。 |
| D-ARCH-002 | 架构主线是否继续以四形态、Turn kind、AG-UI 作为第一层结构 | 否。它们可以后续作为设计候选线索,架构主线应先从对话真相边界、职责、上下文、依赖方向和数据所有权展开。 |
| D-ARCH-003 | 是否允许 Chat / Workspace / Bridges / Runtime 反向定义 Conversation 架构 | 否。它们是使用方或协作方,不是 Conversation 真相所有者。 |

---

## 5. 下一步

当前已完成 Step 1、Step 2、Step 3、Step 4、Step 5、Step 6、Step 7、Step 8、Step 9、Step 10、Step 11、Step 12、Step 13、Step 14、Step 15 和 Step 16。

下一步进入:

```text
架构设计校准已完成,可以进入概要设计校准。
```
