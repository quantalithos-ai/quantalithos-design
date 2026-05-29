# L0-bus 架构设计校准工作台

> 对应文档: `projects/L0-bus/01-架构设计.md`
> 对应 SOP: `standards/document/架构设计讨论流程_SOP.md`
> 创建日期: 2026-05-29
> 当前目标: 按最新架构 SOP 重新校准 `L0-bus`，并采用“结构化中间产物完整落盘、回填草稿引用已有章节”的方式减少重复正文。

---

## 1. 本轮校准原则

- 新版 `projects/L0-bus/00-需求文档.md` 是本轮架构设计的直接需求基线。
- `L0-core` 是 `L0-bus` 的直接稳定上游；`L0-bus` 只消费 Event、Error、TraceContext、Metadata、ActorRef 等共享契约，不重新定义。
- 旧 `01-架构设计.md`、`02-概要设计.md`、`03-详细设计.md`、`05-测试方案.md`、`06-验收标准.md` 只能作为旧事实和问题诊断输入，不能直接视为新版架构基线。
- 本轮先按 Step 逐个生成中间产物，最后在 Step 16 删除旧 `01-架构设计.md` 并按新文件标准重建正式架构设计文档。
- 每个 Step 必须独立落盘、独立更新本文状态，不合并 Step。
- 结构化中间产物必须完整；如果回填草稿完全引用结构化章节，只写清引用来源，正式文档生成时再摘录、裁剪和润色。

---

## 2. 稳定上游与可参考对象

| 对象 | 当前状态 | 本轮使用方式 |
|---|---|---|
| `projects/L0-bus/00-需求文档.md` | 已按新版需求 SOP 完成重建 | 作为本轮架构设计的直接需求基线 |
| `projects/L0-core/00~07` | 已完成深度校准 | 作为直接稳定上游，承接共享契约、事件包络、错误、trace、metadata、配置和 evidence 口径 |
| `architecture/仓库拆分方案.md` | 全局仓拆分基线 | 用于确认 `L0-bus` 在 L0 层的位置和依赖方向 |
| `standards/document/全局项目依赖关系与裁剪规则.md` | 已建立全局依赖裁剪规则 | 用于 Step 7 裁剪 `L0-bus` 的跨仓依赖子图 |
| `architecture/bus-draft/*` | 历史草案 | 仅作为候选事实来源，不高于新版需求基线和稳定上游 |
| 旧 `01-架构设计.md` | 未按最新 SOP 校准 | 作为旧口径诊断和可迁移事实来源 |

---

## 3. Step 状态表

| Step | 主题 | 状态 | 中间产物 |
|---|---|---|---|
| Step 1 | 确认需求基线 | 已完成 | `design-calibration/01_arch_step_01_requirements_baseline.md` |
| Step 2 | 明确架构目标与约束 | 已完成 | `design-calibration/01_arch_step_02_arch_goals_constraints.md` |
| Step 3 | 职责边界 | 已完成 | `design-calibration/01_arch_step_03_responsibility_boundary.md` |
| Step 4 | 系统边界与上下文 | 已完成 | `design-calibration/01_arch_step_04_system_context.md` |
| Step 5 | 限界上下文与子域划分 | 已完成 | `design-calibration/01_arch_step_05_bounded_context.md` |
| Step 6 | 容器与部署视图 | 已完成 | `design-calibration/01_arch_step_06_container_deployment.md` |
| Step 7 | 依赖方向与层间约束 | 已完成 | `design-calibration/01_arch_step_07_dependency_direction.md` |
| Step 8 | 数据所有权与一致性策略 | 已完成 | `design-calibration/01_arch_step_08_data_ownership_consistency.md` |
| Step 9 | 关键交互与通信方式 | 已完成 | `design-calibration/01_arch_step_09_interactions_communication.md` |
| Step 10 | 关键技术选型 | 已完成 | `design-calibration/01_arch_step_10_technology_choices.md` |
| Step 11 | 备选方案与取舍 | 已完成 | `design-calibration/01_arch_step_11_alternatives_tradeoffs.md` |
| Step 12 | 横切关注点 | 已完成 | `design-calibration/01_arch_step_12_cross_cutting.md` |
| Step 13 | 演进路线 | 已完成 | `design-calibration/01_arch_step_13_evolution_roadmap.md` |
| Step 14 | 风险与待确认事项 | 已完成 | `design-calibration/01_arch_step_14_risks_open_questions.md` |
| Step 15 | ADR 与需求追溯 | 已完成 | `design-calibration/01_arch_step_15_adr_traceability.md` |
| Step 16 | 整理正式文档 | 已完成 | `design-calibration/01_arch_step_16_formal_document_assembly.md` |

---

## 4. 当前已知关键口径

| 编号 | 口径 | 说明 |
|---|---|---|
| D-001 | `L0-bus` 架构必须承接新版 `00-需求文档.md` | 旧架构文档不能绕过需求重校准结论 |
| D-002 | `L0-bus` 不重新定义 `L0-core` 契约 | Event / Error / TraceContext / Metadata / ActorRef 等由 `L0-core` 提供 |
| D-003 | `L0-bus` 当前 P0 是事件传递主干和默认可验证路径 | 完整 Redis / Kafka / Filter DSL / DLQ UI / 多租户 / effectively-once 后移 |
| D-004 | `architecture/bus-draft` 是候选事实来源 | 可迁移有效事实，但不作为权威上位设计 |

---

## 5. 下一步

架构设计校准已完成。Step 1 ~ Step 16 均已重新执行，正式 `01-架构设计.md` 已删除旧版后按新文件标准重建。
