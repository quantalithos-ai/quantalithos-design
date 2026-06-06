# 01 架构设计校准工作台

> 对应正式文档: `projects/L1-process/01-架构设计.md`
> 对应 SOP: `standards/document/架构设计讨论流程_SOP.md`
> 书写规范: `standards/document/架构设计书写规范.md`
> 前置基线: `projects/L1-process/00-需求文档.md`
> 生成日期: 2026-06-05

---

## 1. 工作台说明

本工作台用于按架构设计 SOP 逐步重建 `L1-process` 的架构设计。当前旧版 `01-架构设计.md` 仍保留早期 Draft 口径,包含 Python、PostgreSQL、旧日期、旧 ADR 状态和旧文档链等内容;新版架构讨论不得直接继承旧正文,只能把其中仍与新版需求基线一致的线索作为历史输入。

正式 `01-架构设计.md` 将在 Step 16 完成后删除旧文件并按新版结构重建。正式章节必须逐章引用具体 `design-calibration/01_arch_step_*.md` 中间产物,不得只写“详见 design-calibration”。

---

## 2. 输入边界

| 输入 | 用途 |
|---|---|
| `projects/L1-process/00-需求文档.md` | 当前架构设计的直接需求基线 |
| `projects/L1-process/design-calibration/00_req_step_*.md` | 追溯需求校准过程、风险和取舍 |
| `standards/document/架构设计讨论流程_SOP.md` | 控制 Step 顺序和中间产物结构 |
| `standards/document/架构设计书写规范.md` | 控制正式架构文档结构 |
| `standards/document/设计文档讨论中间产物规范.md` | 控制分批写入、校准来源和追溯纪律 |
| 旧 `projects/L1-process/01-架构设计.md` | 历史输入和问题诊断来源,不作为新版架构真相源直接继承 |

---

## 3. 执行纪律

- 严格按 Step 1~Step 16 顺序推进,不得合并 Step。
- 每个 Step 独立生成 `design-calibration/01_arch_step_*.md`。
- 每个 Step 只回答该 Step 的架构问题,不得提前写详细设计、字段 schema、数据库表、handler 伪代码或测试用例。
- 长文档采用分批写入;预计超过 300 行时拆分。
- 不确定项进入风险与待确认事项,不得脑补为架构事实。
- 正式 `01-架构设计.md` 只在 Step 16 汇总重建。

---

## 4. Step 状态表

| Step | 名称 | 输出文件 | 状态 |
|---|---|---|---|
| Step 1 | 确认需求基线 | `01_arch_step_01_requirement_baseline.md` | 已完成 |
| Step 2 | 明确架构目标与约束 | `01_arch_step_02_goals_constraints.md` | 已完成 |
| Step 3 | 职责边界 | `01_arch_step_03_responsibility_boundary.md` | 已完成 |
| Step 4 | 系统边界与上下文 | `01_arch_step_04_system_context.md` | 已完成 |
| Step 5 | 限界上下文与子域划分 | `01_arch_step_05_bounded_context_subdomains.md` | 已完成 |
| Step 6 | 容器 / 部署架构 | `01_arch_step_06_container_deployment.md` | 已完成 |
| Step 7 | 依赖方向与层间约束 | `01_arch_step_07_dependency_direction.md` | 已完成 |
| Step 8 | 数据所有权与一致性策略 | `01_arch_step_08_data_ownership_consistency.md` | 已完成 |
| Step 9 | 关键交互与通信方式 | `01_arch_step_09_interactions_communication.md` | 已完成 |
| Step 10 | 关键技术选型 | `01_arch_step_10_technology_choices.md` | 已完成 |
| Step 11 | 备选方案与取舍 | `01_arch_step_11_alternatives_tradeoffs.md` | 已完成 |
| Step 12 | 横切关注点 | `01_arch_step_12_cross_cutting_concerns.md` | 已完成 |
| Step 13 | 演进路线 | `01_arch_step_13_evolution_path.md` | 已完成 |
| Step 14 | 风险与待确认事项 | `01_arch_step_14_risks_open_questions.md` | 已完成 |
| Step 15 | ADR 与需求追溯 | `01_arch_step_15_adr_traceability.md` | 已完成 |
| Step 16 | 整理正式文档 | `01_arch_step_16_formal_document_assembly.md` | 已完成 |

---

## 5. 当前结论

Step 1 已确认新版 `00-需求文档.md` 足以支撑进入架构目标与约束讨论。Step 2 已把需求基线转译为架构目标、不可变约束、当前阶段可接受取舍和架构非目标。Step 3 已收敛做 / 不做 / 易混淆职责和边界红线。Step 4 已收敛系统上下文图、上下游输入 / 输出面和依赖失效降级口径。Step 5 已收敛核心子域、支撑子域、本地索引 / 投影 / 引用边界和统一语言。Step 6 已收敛同步入口、异步消费、后台处理、正式状态存储和基础设施依赖等运行承载角色。Step 7 已收敛内部依赖角色、允许方向、禁止依赖、倒置边界和跨仓依赖裁剪。Step 8 已收敛正式真相、快照 / 投影、引用关系、禁止正文和一致性策略。Step 9 已收敛同步请求、异步事件 / 回调、后台延后承接和失败降级口径。Step 10 已收敛正式承接边界、依赖倒置、本地索引 / 快照 / ref、持久化 Process truth、checkpoint / recovery 连续性、同步 / 异步 / 后台分离、projection 隔离、幂等 / 顺序保护、可靠传播 / handoff、显式外部状态标记和 traceability / evidence 等架构层技术机制。Step 11 已确认当前采用独立 Process truth + 正式边界协作主线,并放弃单体流程引擎中心、直接依赖相邻仓源码、完整 BPMN engine 优先、全同步闭环、全事件化最终一致、直接暴露核心写模型、外部正文入仓和下游确认作为主真相前置等替代路径。Step 12 已收敛安全边界、审计与可追溯、可观测性、韧性 / 恢复能力、性能 / 容量约束、配置与变更控制六类横切关注点。Step 13 已收敛当前主线成立阶段、协作可靠性增强阶段、过程表达力增强阶段、治理联动增强阶段和规模与运维治理阶段,并明确可接受债务与触发条件。Step 14 已拆分正式风险和待确认事项,明确哪些风险阻塞、哪些事项不阻塞正式架构整理但会阻塞后续对应 detailed boundary 自行补设计。Step 15 已把关键需求、约束和风险与架构承接结果显式追溯,并建立长期 ADR 索引。Step 16 已删除旧版 `01-架构设计.md` 并按新版 18 章结构重建正式架构文档;旧 Python、PostgreSQL、旧性能硬目标、旧 ADR 状态和旧文档链未被继承为新版架构真相源。

---

## 6. 下一步

架构设计校准流程 Step 1~Step 16 已完成。下一阶段可进入 `02-概要设计.md` 的讨论 / 重建,但 API、状态机、checkpoint 机制、存储实现、证据 schema、marker schema、产品级技术选择和外围增强版本范围必须按 §15 待确认事项继续闭合,不得由实现阶段自行补真相源。
