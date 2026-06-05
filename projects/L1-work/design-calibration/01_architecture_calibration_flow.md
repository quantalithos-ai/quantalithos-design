# L1-work 架构设计校准工作台

> 对应文档: `projects/L1-work/01-架构设计.md`
> 对应 SOP: `standards/document/架构设计讨论流程_SOP.md`
> 创建日期: 2026-06-02
> 当前目标: 按最新架构 SOP 校准 `L1-work`,承接已完成的新版 `00-需求文档.md`。

---

## 1. 本轮校准原则

- 架构设计必须承接新版 `00-需求文档.md`,不能回到旧版 Project / Backlog / WorkItem / Iteration 实现草案作为架构主线。
- `L1-work` 是项目工作事实真相仓,不是 identity 成员真相仓、conversation 真相仓、method-library 定义仓、process 执行引擎、governance 决策仓、artifact 正文仓、runtime 执行仓或 workspace 聚合视图仓。
- 本轮架构校准允许依赖已经稳定的 `L0-core`、`L0-bus`、`L0-sdk`、`L1-identity`、`L1-conversation` 和 `L3-method-library` 结论。
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
| `projects/L1-identity/00~07` | 已完成深度校准 | 承接 GlobalMember、actor、role 和成员生命周期引用 |
| `projects/L1-conversation/00~07` | 已完成深度校准 | 承接 conversation space、conversation fact、trace / handoff 和授权查询来源 |
| `projects/L3-method-library/00~07` | 已完成深度校准 | 承接 role / task / work product / process template / view profile 定义来源 |
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
| D-ARCH-WORK-001 | 是否以旧 `01-架构设计.md` 作为正式基线局部修补 | 否。旧文档作为历史输入,正式文档在 Step 16 删除旧文件后重建。 |
| D-ARCH-WORK-002 | 架构主线是否继续以旧 Project / Backlog / WorkItem / Iteration 实现细节为第一层结构 | 否。它们是重要领域线索,但架构主线应先从项目工作事实边界、职责、上下文、依赖方向和数据所有权展开。 |
| D-ARCH-WORK-003 | 是否允许 process / governance / artifact / runtime / workspace 反向定义 Work 架构 | 否。它们是协作方或消费方,不是 Work 真相所有者。 |
| D-ARCH-WORK-004 | 是否允许 conversation suggestion、runtime plan item 或 ImplementationPlan step 直接进入 Backlog | 否。必须经过显式 promote / formalize 边界后才能成为正式 WorkItem 或 child WorkItem。 |
| D-ARCH-WORK-005 | 是否继承旧 P95、规模和 PostgreSQL / 递归 CTE 作为架构硬约束 | 否。旧指标和技术方案作为后续技术选型 / 测试候选输入,不在 Step 2 升级为硬约束。 |
| D-ARCH-WORK-006 | 是否把 ProjectMember 写成 identity 生命周期职责 | 否。ProjectMember 是 Work 的项目内承担事实,GlobalMember / actor / role 生命周期仍属 identity / core。 |
| D-ARCH-WORK-007 | 是否把 ImplementationPlan promote 写成 Work 拥有执行计划 | 否。Work 只承接显式 formalize 后的正式工作事实,不拥有 ImplementationPlan 正文或 runtime 执行推进。 |
| D-ARCH-WORK-008 | 系统上下文图是否逐个展开所有相关仓 | 否。图中聚合相关上下文对象,表中展开各仓关系,以控制图复杂度并保留正式边界。 |
| D-ARCH-WORK-009 | `Project`、`ProjectMember`、`Backlog`、`WorkItem`、`Iteration` 是否拆成多个核心子域 | 否。它们共同归入一个 `项目工作事实真相核心`,避免形成多个 Work truth center。 |
| D-ARCH-WORK-010 | `promote / formalize` 是否需要单独表达为内部上下文 | 是。它是保护 runtime / artifact / Work 边界的关键支撑上下文,但不拥有外部计划或执行正文。 |
| D-ARCH-WORK-011 | 看板、投影、对账和维护报告是否属于核心子域 | 否。它们属于派生消费辅助和本地投影层,只能从 Work 真相派生,不得反写真相。 |
| D-ARCH-WORK-012 | P0 是否强制同步入口、异步输入和后台维护派生独立部署 | 否。P0 可同部署,但逻辑运行职责必须分离,后续可按吞吐、隔离、恢复、观测或对账压力拆分。 |
| D-ARCH-WORK-013 | 是否在容器 / 部署视图中锁定 PostgreSQL、outbox、projection 或缓存 | 否。Step 6 只保留真相存储承载、派生视图 / 对账承载和事件协作交接边界,具体产品和机制后移。 |
| D-ARCH-WORK-014 | `L1-work` 是否允许除 `L0-core` 之外的编译期仓依赖 | 否。`L0-core` 是唯一编译期依赖;identity、method-library、conversation、process、governance、artifact、runtime、workspace、member-service、archive 和 SDK 均走运行期或事件协作。 |
| D-ARCH-WORK-015 | `L0-bus` 是否写成 Work 编译期依赖 | 否。`L0-bus` 是事件协作依赖,不得因事件协作关系写成 Work 业务核心源码依赖。 |
| D-ARCH-WORK-016 | 派生视图、看板、对账和维护报告是否允许反写 Work 真相 | 否。它们只能从核心真相派生,可重建、可延迟,不得成为第二 truth。 |
| D-ARCH-WORK-017 | ImplementationPlan / PlanItem 是否进入 Work 正式真相 | 否。Work 只保存引用和显式 promote 后的正式 Work 结果,不拥有计划正文或运行进度。 |
| D-ARCH-WORK-018 | 外部快照延迟是否影响全部 Work 真相成立 | 否。只影响依赖该快照的判断或消费解释,必须表达快照状态,不得复制外部正文补齐。 |
| D-ARCH-WORK-019 | Work 核心真相变更是否可以后台补写后再视为成功 | 否。核心真相变更必须在同步边界明确成立、失败、拒绝或暂不可处理,不能伪同步完成。 |
| D-ARCH-WORK-020 | runtime / artifact / conversation 来源是否可以直接创建 child WorkItem | 否。必须经过显式 formalize / promote,Work 只拥有升级后的正式结果。 |
| D-ARCH-WORK-021 | 投影、看板、对账是否阻塞核心写入 | 否。它们后台最终一致,可延迟和重建,不得阻塞核心真相成立。 |
| D-ARCH-WORK-022 | formalize / promote 是否只是后续详细设计细节 | 否。它是保护正式工作全集和 child WorkItem 不被外部计划 / 对话 / runtime 来源污染的架构级技术机制。 |
| D-ARCH-WORK-023 | PostgreSQL、递归 CTE、物化视图和 outbox 是否在架构技术选型中锁定 | 否。本轮只锁真相承载、关系约束、只读派生、事件最终一致和后台延后承接等机制,具体产品和实现后移。 |
| D-ARCH-WORK-024 | 旧 P95 / 容量数字是否作为当前架构选型或硬约束 | 否。旧指标仅作为后续测试 / 验收 / 容量验证候选输入,当前缺正式负载模型。 |
| D-ARCH-WORK-025 | 除 `L0-core` 外是否允许引入编译期仓依赖以简化实现 | 否。依赖纪律是关键架构机制,其他仓通过运行期、引用、快照或事件协作进入。 |
| D-ARCH-WORK-026 | 是否采用外部主导路径,由 process / workspace / runtime / conversation / artifact 主导 Work truth | 否。Work 必须保持独立项目工作事实真相仓定位,外部仓只能通过正式边界协作。 |
| D-ARCH-WORK-027 | 是否采用 Graph-first / DAG-first 作为主组织核心 | 否。复杂关系和无环约束必须支持,但图或递归查询实现不能反向定义 Work truth。 |
| D-ARCH-WORK-028 | 完整事件溯源 / CQRS 是否作为 P0 主体架构 | 暂不采用为 P0 必选。当前只确认追溯、事件协作和派生重建机制,后续需 ADR 级再评估。 |
| D-ARCH-WORK-029 | Projection / Board 是否可以成为主组织核心 | 否。看板、投影和任务摘要只能从 Work 真相派生,不得形成第二 truth。 |
| D-ARCH-WORK-030 | 横切关注点是否按通用非功能模板机械填充 | 否。只保留持续作用于 Work 主线的安全、正式升级、审计、可观测、韧性、性能和配置约束。 |
| D-ARCH-WORK-031 | 配置是否可以改变 Work 真相归属、formalize / promote、派生不反写或依赖类型 | 否。配置只能选择已被正式设计允许的运行行为,不得绕过架构边界。 |
| D-ARCH-WORK-032 | 具体监控字段、告警阈值、配置项和压测指标是否进入架构横切章节 | 否。架构层只定义可见状态、保护目标和结构性预算口径,具体实现后移。 |
| D-ARCH-WORK-033 | 外部仓主体横切要求是否由 Work 架构定义 | 否。Work 只定义与自身边界相关的交接约束,不替 identity / process / governance / artifact / runtime 等仓定义主体横切要求。 |
| D-ARCH-WORK-034 | 当前阶段是否必须一次性锁定复杂关系实现、数据库产品、投影产品和容量数字 | 否。当前阶段先让 Work truth、正式升级、数据归属、派生不反写和事件 / 后台承接边界成立。 |
| D-ARCH-WORK-035 | 复杂关系、看板投影、引用生命周期、事件追溯、归档观测和容量隔离是否属于当前架构主线必做 | 否。它们是后续触发式演进方向,必须由边界、规模、一致性、恢复或消费压力触发。 |
| D-ARCH-WORK-036 | 后续演进是否可以重新打开已排除的外部主体职责 | 否。identity、conversation、method、process、governance、artifact、runtime、workspace、observability 和 archive 主体职责不作为 Work 演进项。 |
| D-ARCH-WORK-037 | 风险与待确认事项是否合并为一个问题清单 | 否。风险与待确认事项必须拆开,分别说明阻塞性和缺失确认。 |
| D-ARCH-WORK-038 | 旧实现 / 技术 / 指标回流是否删除不提 | 否。作为非阻塞风险显式保留,防止后续设计回到旧口径。 |
| D-ARCH-WORK-039 | API、状态、关系实现、产品选型和容量数字是否在风险 Step 直接定论 | 否。作为待确认事项挂起到概要 / 详细 / 测试 / 实施阶段。 |
| D-ARCH-WORK-040 | ADR 索引是否伪造正式 ADR 编号 | 否。当前只建立 ADR 决策候选索引,不伪造已评审 ADR 文件或编号。 |
| D-ARCH-WORK-041 | 需求追溯是否沿用旧 Project / PostgreSQL / DAG / P95 来源 | 否。追溯矩阵以新版 `00-需求文档.md` 和 Step 1~14 已收稳架构结论为来源。 |
| D-ARCH-WORK-042 | 正式架构文档是否在旧 `01-架构设计.md` 上局部修补 | 否。Step 16 删除旧文件后按 18 章正式结构重建,每章引用具体校准来源。 |
| D-ARCH-WORK-043 | Step 16 是否可以新增架构结论 | 否。Step 16 只做重组、摘录、压缩、术语统一和交叉引用统一。 |

---

## 5. 下一步

当前已完成 Step 1 ~ Step 16。

本轮架构校准已经完成:

```text
已重建 projects/L1-work/01-架构设计.md
```
