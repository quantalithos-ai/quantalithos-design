# L1-work 需求文档校准工作台

> 对应文档: `projects/L1-work/00-需求文档.md`
> 对应 SOP: `standards/document/需求文档讨论流程_SOP.md`
> 创建日期: 2026-06-02
> 当前目标: 按最新需求 SOP 校准 `L1-work`，并允许它依赖已经稳定的 `L0-core`、`L0-bus`、`L0-sdk`、`L1-identity`、`L1-conversation` 和 `L3-method-library` 结论。

---

## 1. 本轮校准原则

- `L1-work` 可以依赖已经稳定的 `L0-core`、`L0-bus`、`L0-sdk`、`L1-identity`、`L1-conversation` 和 `L3-method-library` 设计结论，不重新定义共享契约、事件协作、SDK 接入、GlobalMember、对话事实或方法定义。
- `L1-work` 是项目工作事实域，不是 process 执行引擎、governance 决策仓、artifact 正文仓、conversation 真相仓、identity 成员真相仓或 method-library 定义仓。
- 旧 `00-需求文档.md`、`01-架构设计.md`、`02-概要设计.md`、`03-详细设计.md`、`05-测试方案.md`、`06-验收标准.md` 只能作为旧事实和问题诊断输入，不能直接视为新版需求基线。
- 旧 `domain/work/README.md` 是重要历史领域输入和不变量线索，但它包含大量详细设计与实现字段，不能高于新版 SOP 和已完成上游正式文档。
- 本轮先按 Step 逐个生成中间产物，最后在 Step 17 删除旧 `00-需求文档.md` 并按新文件标准重建正式需求文档。
- 每个 Step 必须独立落盘、独立更新本文状态，不合并 Step。

---

## 2. 稳定上游与可参考对象

| 对象 | 当前状态 | 本轮使用方式 |
|---|---|---|
| `L0-core` | 已完成 `00`~`07` 深度校准 | 作为直接稳定上游，承接共享 ID、ActorRef、TraceContext、Error、CloudEvents、metadata、配置和 evidence 口径 |
| `L0-bus` | 已完成 `00`~`07` 深度校准 | 作为事件协作上游，承接发布、订阅、ack、retry、dead-letter、replay 和报告证据口径 |
| `L0-sdk` | 已完成 `00`~`07` 深度校准 | 作为 L5/L6 与外部调用方默认接入方式，后续接口需求应考虑 SDK 封装边界 |
| `L1-identity` | 已完成深度校准 | 作为 GlobalMember、actor、角色和成员生命周期来源，`L1-work` 只拥有 ProjectMember 项目内分配事实 |
| `L1-conversation` | 已完成 `00`~`07` 深度校准 | 作为 conversation space、conversation fact、trace / handoff 和授权查询来源，`L1-work` 只引用或显化工作相关对话上下文 |
| `L3-method-library` | 已完成深度校准 | 作为 role / task / work product / process template / view profile 等定义来源，`L1-work` 只消费定义引用并记录项目执行事实 |
| `product/最终目的.md` | 产品叙事上游 | 承接“工作对象是软件项目”和人机协作需要项目承载的产品动机 |
| `product/六域模型.md` | 领域模型上游 | 承接 Work 是六域之一、Project 是 SoI、ProjectMember / Backlog / WorkItem / Iteration 的领域位置 |
| `architecture/仓库拆分方案.md` | 全局分层上游 | 承接 `quantalithos-work` 在 L1 六域服务层的位置和相邻仓关系 |
| `architecture/adr/0004-global-vs-project-member.md` | 已有 ADR | 承接 GlobalMember 与 ProjectMember 的双层 Member 边界 |
| `architecture/adr/0008-activity-completion-policy.md` | 已有 ADR | 承接 WorkItem 完成与 Process Activity 完成的关系口径 |
| `architecture/adr/0009-viewprofile-in-method-library.md` | 已有 ADR | 承接 ViewProfile / 方法定义归属 method-library 的边界 |
| `domain/work/README.md` | 旧工作域详细设计 | 作为 Project、ProjectMember、Backlog、WorkItem、Iteration、不变量和历史边界线索 |
| 旧 `L1-work` 文档 | 未按最新 SOP 校准 | 作为旧口径诊断和可迁移事实来源 |

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
| Step 10 | 业务规则与边界约束 | 已完成 | `design-calibration/00_req_step_10_business_rules_boundaries.md` |
| Step 11 | 数据需求与数据归属 | 已完成 | `design-calibration/00_req_step_11_data_ownership.md` |
| Step 12 | 接口与依赖 | 已完成 | `design-calibration/00_req_step_12_interfaces_dependencies.md` |
| Step 13 | 非功能需求 | 已完成 | `design-calibration/00_req_step_13_non_functional_requirements.md` |
| Step 14 | 验收标准 | 已完成 | `design-calibration/00_req_step_14_acceptance_criteria.md` |
| Step 15 | 风险与待确认事项 | 已完成 | `design-calibration/00_req_step_15_risks_open_questions.md` |
| Step 16 | 需求追溯矩阵 | 已完成 | `design-calibration/00_req_step_16_traceability_matrix.md` |
| Step 17 | 正式整理为 `00-需求文档.md` | 已完成 | `../00-需求文档.md` |

---

## 4. 当前已收敛的关键决策

| 编号 | 问题 | 本轮结论 |
|---|---|---|
| D-001 | 是否从旧版 `00-需求文档.md` 直接局部修补 | 否。旧文档作为输入，正式文档在 Step 17 删除旧文件后按新文件标准重建。 |
| D-002 | `domain/work/README.md` 是否作为新版需求权威直接继承 | 否。它是历史领域输入和不变量线索，不高于新版 SOP 与已完成上游正式文档。 |
| D-003 | `L1-work` 是否重新定义 GlobalMember、actor 或 role | 否。GlobalMember、actor、role 生命周期由 `L1-identity` 与 `L0-core` 承载，`L1-work` 只细化 ProjectMember 项目内分配事实。 |
| D-004 | `L1-work` 是否重新定义 conversation trace / handoff | 否。Conversation truth、trace / handoff 和对话事实由 `L1-conversation` 承载，`L1-work` 只引用或显化与工作事实相关的上下文。 |
| D-005 | `L1-work` 是否重新定义 task / work product / process template 定义 | 否。定义来源在 `L3-method-library`，`L1-work` 记录项目执行事实和实例化后的工作状态。 |
| D-006 | Step 1 来源口径 | `L1-work` 的需求来源是产品 / 架构 / ADR / 稳定子项目正式文档 / 旧领域设计共同收敛，而不是只继承旧 product 与 `domain/work/README.md`。 |
| D-007 | `L1-work` 的一句话定位 | `L1-work` 是项目工作事实真相仓，负责收束 Project、ProjectMember、Backlog、WorkItem、child WorkItem、Iteration 与 ImplementationPlan promote 边界。 |
| D-008 | `L1-work` 的非职责口径 | 它不是身份真相仓、对话真相仓、方法定义仓、流程执行引擎、治理决策仓、产物正文仓、运行时执行仓或 workspace 聚合视图仓。 |
| D-009 | Step 3 的问题主线 | 问题主线收敛为“缺少统一项目工作事实会导致项目状态、正式任务、执行步骤和相邻仓协作多真相”，不把性能指标、状态机目标或接口依赖写成背景问题。 |
| D-010 | Step 4 的目标口径 | 目标收敛为项目工作事实主题、项目成员承担、正式工作项、Iteration 承诺子集和 ImplementationPlan promote 边界；性能、状态机细节、接口和规则后移。 |
| D-011 | Step 5 的角色口径 | 人类角色收敛为项目发起 / 管理者、项目协调 / 技术负责人、项目成员 / 执行者和审计 / 观察者；系统角色只写内部系统调用方和运维 / 后台任务，不把 process / governance / artifact 等仓际依赖写成角色。 |
| D-012 | Step 6 的依赖口径 | `L1-work` 的编译期依赖只允许 `L0-core`；`L0-bus` 是事件协作主干；identity 是 ProjectMember 闭环强前置；process / governance / artifact / conversation / runtime / workspace 等按运行期或事件协作裁剪，不写成 package dependency。 |
| D-013 | Step 7 的核心能力闭环 | 核心闭环收敛为“项目主语成立 -> 项目内承担成立 -> 正式工作全集成立 -> 承诺子集成立 -> 项目工作事实可消费可追溯成立”；ImplementationPlan promote 是正式工作全集边界的一部分，不把 runtime 执行放入核心闭环。 |
| D-014 | Step 8 的用户故事口径 | 用户故事按核心闭环 C-1~C-5 组织，核心故事覆盖项目主语、项目内承担、正式工作全集、Iteration 承诺子集和可消费可追溯；自动解除阻塞、容量趋势、tool_scope / policy override、跨项目依赖等作为外围增强，不把接口名、功能名或边界外仓能力写成正式故事。 |
| D-015 | Step 9 的功能需求口径 | 功能需求按业务能力归并为项目工作主语成立、项目内成员承担表达、正式工作全集收束、正式工作拆分与升级边界、正式工作依赖与阻塞表达、Iteration 承诺子集形成、项目工作事实消费与追溯、项目工作事实维护与对账；高级看板、自动化维护建议、容量趋势、项目内工具能力调整和跨项目依赖只作为外围增强。 |
| D-016 | Step 10 的规则口径 | 规则按不变量、禁止行为、显式变化、边界约束、治理约束和审计约束收敛；核心约束是 Work 只拥有项目工作事实，Backlog 只保存正式协作级工作，child WorkItem 不等同于个人步骤，Iteration 是承诺子集，conversation / process / artifact / runtime / workspace 等不得反向污染 Work 真相。 |
| D-017 | Step 11 的数据归属口径 | `L1-work` 只拥有项目工作事实真相：Project、ProjectMember、Backlog 正式工作全集、WorkItem、child WorkItem、依赖 / 阻塞关系、Iteration 承诺子集、promote 后结果和工作事实追溯记录；GlobalMember、conversation、method-library、process、governance、artifact、ImplementationPlan、runtime、workspace 等只可作为快照或引用进入，正文禁止保存。 |
| D-018 | Step 12 的接口与依赖口径 | 接口只写能力级边界：项目工作事实变更、查询、事件输出、维护对账和消费快照；外部输入来自 core 共享契约、bus 事件协作、identity 成员事实、method-library 定义、conversation 上下文、process 节奏、governance 结论、artifact 完成依据和 runtime promote 需求。除 `L0-core` 外，其他关系不得写成编译期依赖。 |
| D-019 | Step 13 的非功能口径 | 非功能按性能、可用性、安全、审计 / 可追溯、幂等 / 一致性、可观测性六类收敛；旧 `CreateWorkItem P95 < 100ms`、`GetProjectBoard P95 < 300ms`、`10w 项目 x 50 WorkItem` 只作为后续架构和测试阶段候选目标，不在需求层直接定为已验证硬指标。 |
| D-020 | Step 14 的验收口径 | 验收按核心能力闭环、功能能力、规则 / 边界、数据归属和非功能五类收敛；一票否决只覆盖核心闭环断裂、正式工作事实污染、相邻仓边界打穿、关键变化不可追溯和依赖裁剪失效，不把测试步骤、接口调用、证据路径或旧候选性能数字写成需求层硬验收。 |
| D-021 | Step 15 的风险与待确认口径 | 风险收敛为后续最容易重新串线的 Work / 相邻仓边界、数据正文入仓、候选性能指标误升级、外围增强误入核心和后续 Agent 自行补设计；待确认事项只保留 API / 状态机 / evidence 类型 / 治理前置 / 性能候选 / 外围增强版本 / 存储实现等后续设计细化问题，不把已收口的前序 Q 表重新打开。 |
| D-022 | Step 16 的追溯矩阵口径 | 主追溯矩阵以功能需求为主轴，连接核心闭环、用户故事、业务规则、数据归属和验收标准；核心功能 FR-WORK-001~FR-WORK-008 全部闭合，外围增强 FR-WORK-E01~E05 保留为后续能力线索并按 Step 15 挂起，不新增前文未确认项。 |
| D-023 | Step 17 的正式文档重建口径 | 旧 `00-需求文档.md` 已删除并按新文件标准重建；正式文档逐章标注 `design-calibration` 校准来源，只摘录和收口 Step 1~16 已确认结论，不新增未经讨论的新需求。 |

---

## 5. 下一步

当前已完成:

```text
Step 1. 与上游文档的关系声明
Step 2. 本仓定位与边界
Step 3. 背景与问题定义
Step 4. 目标与非目标
Step 5. 用户与角色
Step 6. 使用方与依赖
Step 7. 核心能力闭环
Step 8. 用户故事
Step 9. 功能需求
Step 10. 业务规则与边界约束
Step 11. 数据需求与数据归属
Step 12. 接口与依赖
Step 13. 非功能需求
Step 14. 验收标准
Step 15. 风险与待确认事项
Step 16. 需求追溯矩阵
Step 17. 正式整理为 `00-需求文档.md`
```

需求校准状态:

```text
Step 1~Step 17 已完成。
```

后续建议:

- 可进入 `01-架构设计.md` 校准流程。
- 后续文档必须阅读本工作台和 `design-calibration/00_req_step_*.md` 中被正式文档引用的中间产物。
- 不得绕过本文已收敛的 Work / identity / conversation / process / governance / artifact / runtime / workspace 边界。
