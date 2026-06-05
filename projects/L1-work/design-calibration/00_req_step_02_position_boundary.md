# Step 2. 本仓定位与边界

> 对应 SOP: `standards/document/需求文档讨论流程_SOP.md` Step 2
> 回填章节: `00-需求文档.md` §2 本仓定位与边界
> 生成日期: 2026-06-02

---

## 1. 本步目标

建立 `L1-work` 的仓级心智：它是项目工作事实真相仓，而不是身份、对话、方法定义、流程执行、治理决策、产物正文、运行时执行或 workspace 视图仓。后续需求讨论必须以这个边界为前提，避免把相邻仓职责混入 Work。

---

## 2. 本步输入

| 输入 | 当前状态 | 本步使用方式 |
|---|---|---|
| `design-calibration/00_req_step_01_upstream_relation.md` | Step 1 已完成 | 作为来源与承接边界前提 |
| `projects/L1-work/README.md` | 旧仓定位材料 | 保留“工作域服务”“项目分配层”“Project / ProjectMember / Backlog / WorkItem / Iteration 聚合”等定位线索 |
| `projects/L1-work/00-需求文档.md` | 旧版需求文档 | 提取“软件项目生命周期业务主干”“双层 Member”“WorkItem DAG”等边界线索 |
| `projects/L1-work/02-概要设计.md` | 旧版概要设计 | 提取“项目工作事实仓”“WorkItem / child WorkItem = 团队协作事实”“ImplementationPlan = 个人或局部执行计划”等已成熟表达 |
| `architecture/adr/0004-global-vs-project-member.md` | 已接受 ADR | 固定 GlobalMember 与 ProjectMember 的边界 |
| `architecture/adr/0008-activity-completion-policy.md` | 已接受 ADR | 固定 WorkItem 状态与 Process Activity 状态独立 |
| `architecture/adr/0009-viewprofile-in-method-library.md` | 已接受 ADR | 固定 ViewProfile / 方法定义归属 method-library，L1 域不做 role 视图策略 |
| `projects/L1-identity/00-需求文档.md` ~ `07-实施计划.md` | 已完成深度校准 | 作为身份真相边界输入 |
| `projects/L1-conversation/00-需求文档.md` ~ `07-实施计划.md` | 已完成深度校准 | 作为对话真相与 trace / handoff 边界输入 |
| `projects/L3-method-library/00-需求文档.md` ~ `07-实施计划.md` | 已完成深度校准 | 作为方法定义和 view profile 边界输入 |

---

## 3. SOP 问题回答

### 3.1 本仓一句话定义是什么？

`L1-work` 是项目工作事实真相仓，负责把软件项目中的 Project、ProjectMember、Backlog、WorkItem、child WorkItem、Iteration 以及 ImplementationPlan promote 边界收束为正式、可追溯、可被相邻仓消费的工作事实。

这句话有三个限制：

- “项目工作事实”是本仓核心，不是所有项目相关对象都归本仓。
- “真相仓”表示它拥有正式工作事实，不表示它拥有身份、对话、方法、流程、治理、产物或运行时真相。
- “ImplementationPlan promote 边界”表示本仓只负责计划项升级为正式 child WorkItem 的边界，不拥有执行计划正文和执行推进。

### 3.2 为什么它需要单独成仓？

因为项目工作事实同时被 identity、conversation、process、governance、artifact、workspace、runtime、member-service 等多个仓引用。如果没有独立的 Work 真相仓，正式任务会散落在对话记录、流程节点、个人计划、产物证据和运行时上下文中，后续无法稳定回答“这个项目有哪些正式工作、谁承担、哪些进入当前迭代、哪些依赖、为什么完成”。

单独成仓的理由不是“功能多”，而是事实边界独立：

- Project / ProjectMember 是项目主语与成员承担事实，不属于 identity 的全局身份档案。
- Backlog / WorkItem / child WorkItem 是正式协作事实，不属于 conversation suggestion、process Activity 或 runtime plan item。
- Iteration 是从 Backlog 选择出的承诺子集，不是 process 的 planning 节奏节点。
- ImplementationPlan 只有在计划项进入协作、依赖、排期、验收、风险视野时，才通过 Work 的正式入口升级为 child WorkItem。

### 3.3 本仓不是什么？

`L1-work` 不是以下对象：

- 不是 identity 成员真相仓：不拥有 GlobalMember、Role、actor 生命周期。
- 不是 conversation 真相仓：不拥有 conversation space、participant scope、conversation fact、trace / handoff 正文。
- 不是 method-library 定义仓：不拥有 RoleDefinition、TaskDefinition、WorkProductDefinition、ProcessTemplateDef、ViewProfile。
- 不是 process 执行引擎：不拥有 Activity、ProcessInstance、checkpoint 和流程节奏执行。
- 不是 governance 决策仓：不拥有 Gate、Policy、Control、Approval 的决策真相。
- 不是 artifact 正文仓：不拥有 Artifact 正文、evidence 正文、baseline 正文或 implementation plan 正文。
- 不是 runtime 执行仓：不推进 agent loop、工具调用、执行步骤或计划项进度。
- 不是 workspace 聚合视图仓：不拥有个人工作台或项目工作台的跨域聚合视图。

### 3.4 最容易与哪些相邻仓或概念混淆？

最容易混淆的对象如下：

| 类型 | 对象 | 混淆点 |
|---|---|---|
| 仓 | `L1-identity` | GlobalMember 与 ProjectMember |
| 仓 | `L1-conversation` | conversation suggestion / discussion context 与正式 WorkItem |
| 仓 | `L3-method-library` | TaskDefinition / WorkProductDefinition / ViewProfile 与项目内工作实例 |
| 仓 | `L1-process` | Process Activity / planning timing 与 Backlog / Iteration |
| 仓 | `L1-governance` | Gate decision / corrective action 与 WorkItem 状态推进 |
| 仓 | `L1-artifact` | Artifact evidence / ImplementationPlan 正文与 done 判据 / promote 边界 |
| 仓 | `L2-runtime` | plan item / execution step 与 child WorkItem |
| 仓 | `L1-workspace` | ProjectWorkspace / board 聚合视图与 Work 真相 |
| 概念 | `child WorkItem` | 协作级正式子任务，不是个人执行步骤 |
| 概念 | `ImplementationPlan` | 个人或局部执行路线图，不默认进入 Backlog 真相 |

---

## 4. 当前文档问题诊断

| 位置 | 当前表现 | 问题 | 处理口径 |
|---|---|---|---|
| `00-需求文档.md` 头部 | 定位为 L1 六域服务层中的工作域服务，承载 Project / ProjectMember / Backlog / WorkItem / Iteration | 方向正确，但缺少 child WorkItem、ImplementationPlan promote 和相邻已稳定仓边界 | 正式 §2 补充项目工作事实和最易混淆边界 |
| `00-需求文档.md` §2 | 把 work 称为业务主干仓，列出 conversation、process、governance、artifact、archive 依赖 | 依赖线索有价值，但 Step 2 不能展开使用方与依赖 | 保留为边界背景，详细依赖后移 Step 6 / Step 12 |
| `00-需求文档.md` §3 | 目标包含 Project lifecycle、DAG、done 判据、性能 | 已滑入目标、规则和非功能 | 后移 Step 4、Step 10、Step 13 |
| `02-概要设计.md` §1 | 明确 `L1-work` 是“项目工作事实仓” | 这是当前最贴切的一句话定位 | 提升为需求阶段定位 |
| `02-概要设计.md` §1.3 | 明确 WorkItem / child WorkItem 与 ImplementationPlan 的区别 | 这是避免 Backlog 污染的关键边界 | 纳入 Step 2 边界对象结论 |
| `02-概要设计.md` §4 | 展开系统上下文图和外部 SLA | 对概要设计有用，但 Step 2 不能写依赖图和 SLA | 暂不回填正式需求 §2，后续 Step 6 / Step 13 再处理 |
| `domain/work/README.md` | 使用完整字段、状态机和跨域协作图解释边界 | 细节过重，不适合需求 §2 | 只吸收边界结论，不吸收字段和实现结构 |

---

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 一句话定位 | “工作域服务”“业务主干仓” | “项目工作事实真相仓” | 更准确表达 Work 拥有的是真实项目工作事实，而不是所有项目相关功能 |
| 边界对象 | Project / ProjectMember / Backlog / WorkItem / Iteration | 增加 child WorkItem、ImplementationPlan promote 边界、相邻仓混淆对象 | 当前讨论已明确 child WorkItem / plan boundary 是核心串线风险 |
| 非职责 | 旧文档列 identity、process、governance、artifact 等 | 明确排除 identity、conversation、method-library、process、governance、artifact、runtime、workspace | 对齐已完成上游，防止后续需求重新定义相邻真相 |
| 单独成仓原因 | 因为 work 是业务主干 | 因为项目工作事实需要从对话、流程、执行计划、产物证据和视图中独立出来 | “主干”太泛，无法解释为什么不能并入相邻仓 |
| 表达粒度 | 旧文档混入功能、SLA、接口和数据 | Step 2 只保留仓级边界声明 | 对齐需求规范 4.2 |

---

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A: 定位为“项目管理服务” | 易懂，接近日常产品语言 | 太泛，容易把 UI、流程、权限、报表和执行都并入本仓 | 不采用 |
| 方案 B: 定位为“项目工作事实真相仓” | 精确表达 Project / WorkItem / Iteration 等事实归属，能和相邻仓边界分开 | 需要在后续章节解释“事实”与“视图 / 计划 / 流程”的区别 | 采用 |
| 方案 C: 定位为“任务系统” | 简短，容易联想到 WorkItem | 缩窄了 Project、ProjectMember、Backlog、Iteration 和 promote 边界，且容易忽略项目主语 | 不采用 |
| 方案 D: 定位为“协作看板仓” | 突出 board / task summary 消费场景 | 会把 workspace / chat / conversation 投影视图误认为本仓核心 | 不采用 |

### 6.1 待确认问题的方案选择

#### 是否把 ImplementationPlan 纳入一句话定义？

| 方案 | 内容 | 影响 |
|---|---|---|
| 方案 A | 不提 ImplementationPlan，只写 Project / WorkItem / Iteration | 定位更短，但后续容易再次把 plan item 与 child WorkItem 混写 |
| 方案 B | 写“ImplementationPlan promote 边界”而不写 ImplementationPlan 真相 | 明确本仓管升级边界，不拥有执行计划正文 |
| 方案 C | 写“ImplementationPlan 管理” | 会误导读者认为 Work 拥有执行计划真相 |

推荐方案 B。原因是当前多次讨论的核心风险正是 plan item 与 child WorkItem 混淆；但 Work 不能因此拥有 ImplementationPlan 正文和执行推进。

#### 是否把 conversation 列入 Step 2 最易混淆对象？

| 方案 | 内容 | 影响 |
|---|---|---|
| 方案 A | 不列 conversation，留到依赖章节 | Step 2 更短，但会漏掉 conversation suggestion / discussion context 与正式 WorkItem 的边界 |
| 方案 B | 列入边界对象，但不展开依赖和接口 | 能提前保护正式工作事实不被对话建议污染 |

推荐方案 B。原因是 `L1-conversation` 已完成深度校准，Work 后续需要引用对话上下文，但不能让对话内容成为任务真相写源。

---

## 7. 结构化中间产物

### 7.1 一句话定义结论

```text
L1-work 是项目工作事实真相仓，负责把软件项目中的 Project、ProjectMember、Backlog、WorkItem、child WorkItem、Iteration 以及 ImplementationPlan promote 边界收束为正式、可追溯、可被相邻仓消费的工作事实。
```

### 7.2 非职责结论

| 非职责对象 | 结论 |
|---|---|
| `L1-identity` | `L1-work` 不拥有 GlobalMember、Role、actor 生命周期，只拥有 ProjectMember 项目内分配事实 |
| `L1-conversation` | `L1-work` 不拥有对话空间、参与范围、对话事实和 trace / handoff 正文 |
| `L3-method-library` | `L1-work` 不拥有方法定义、任务定义、工作产物定义或 ViewProfile |
| `L1-process` | `L1-work` 不拥有 Activity、ProcessInstance、checkpoint 和流程节奏执行 |
| `L1-governance` | `L1-work` 不拥有 Gate、Policy、Control、Approval 决策真相 |
| `L1-artifact` | `L1-work` 不拥有 artifact / evidence / baseline / implementation plan 正文 |
| `L2-runtime` | `L1-work` 不拥有 agent loop、工具调用、执行步骤或计划项推进 |
| `L1-workspace` | `L1-work` 不拥有个人工作台或项目工作台聚合视图 |

### 7.3 边界对象结论

| 边界对象 | 本步结论 |
|---|---|
| Project | 项目工作事实的主语 |
| ProjectMember | GlobalMember 在项目内的承担事实 |
| Backlog | 项目正式待办全集，不是个人步骤池 |
| WorkItem | 团队协作级正式工作事实 |
| child WorkItem | 从正式 WorkItem 拆出的协作级子任务，不是 ImplementationPlan 步骤 |
| Iteration | 从 Backlog 中选择出的承诺子集，不是 process planning 节点 |
| ImplementationPlan promote 边界 | 只处理 plan item 升级为 child WorkItem 的正式入口，不拥有执行计划正文 |

### 7.4 单独成仓原因结论

`L1-work` 必须单独成仓，因为 Project、ProjectMember、Backlog、WorkItem、child WorkItem 和 Iteration 是多个相邻仓共同引用的项目工作事实。如果这些事实落入 conversation、process、artifact、runtime 或 workspace，各仓会各自拥有一份不同的“任务真相”，导致项目状态、责任、依赖、排期和完成判据不可追溯。

---

## 8. 回填草稿

以下内容供 Step 17 重建正式 `00-需求文档.md` 时回填到 §2。

```md
## 2. 本仓定位与边界

> 校准来源：
> - `design-calibration/00_req_step_02_position_boundary.md`
>
> 延伸阅读：
> - 建议继续阅读上述中间产物的“SOP 问题回答”“设计取舍”和“结构化中间产物”小节，了解本仓定位、非职责和最易混淆边界如何收敛。

| 字段 | 内容 |
|---|---|
| 一句话定义 | `L1-work` 是项目工作事实真相仓，负责把软件项目中的 Project、ProjectMember、Backlog、WorkItem、child WorkItem、Iteration 以及 ImplementationPlan promote 边界收束为正式、可追溯、可被相邻仓消费的工作事实。 |
| 本仓不是什么 | 它不是身份真相仓、对话真相仓、方法定义仓、流程执行引擎、治理决策仓、产物正文仓、运行时执行仓或 workspace 聚合视图仓。 |
| 边界对象列表 | 仓：`L1-identity`；仓：`L1-conversation`；仓：`L3-method-library`；仓：`L1-process`；仓：`L1-governance`；仓：`L1-artifact`；仓：`L2-runtime`；仓：`L1-workspace`；概念：`child WorkItem`；概念：`ImplementationPlan`。 |
| 单独成仓原因 | 平台需要一处独立、稳定、可追溯的项目工作事实来源，避免正式任务散落在对话、流程、执行计划、产物证据和工作台视图中。 |

`L1-work` 需要单独存在，因为 Project、ProjectMember、Backlog、WorkItem、child WorkItem 和 Iteration 是多个相邻仓共同引用的项目工作事实。它最容易与 `L1-identity` 混淆在 GlobalMember / ProjectMember 边界上，与 `L1-conversation` 混淆在对话建议和正式任务边界上，与 `L3-method-library` 混淆在方法定义和项目执行事实边界上，也容易与 process、governance、artifact、runtime 和 workspace 在节奏、决策、证据、执行和视图边界上串线；这些边界必须分开，否则后续需求、设计、测试和实现都会出现多真相。
```

---

## 9. 待确认事项

| 编号 | 待确认事项 | 方案 A | 方案 B | 推荐 |
|---|---|---|---|---|
| Q-001 | 一句话定义是否采用“项目工作事实真相仓” | 使用旧称“工作域服务 / 业务主干仓” | 使用“项目工作事实真相仓” | 推荐 B。原因是它更能解释 Work 为什么不能并入 conversation、process、artifact 或 runtime |
| Q-002 | 是否在 Step 2 提及 ImplementationPlan | 不提，避免提前引入复杂度 | 提及 promote 边界，但明确不拥有正文和执行推进 | 推荐 B。原因是 plan item 与 child WorkItem 是当前最重要的边界风险之一 |
| Q-003 | 是否把 workspace 列入边界对象 | 后续依赖章节再说 | Step 2 列为最易混淆的聚合视图仓 | 推荐 B。原因是 Work 真相和 ProjectWorkspace / board 视图必须从需求起点分开 |

当前建议：接受上述推荐后进入 Step 3。

---

## 10. 进入下一步条件

- 已能用一句话定义 `L1-work`：项目工作事实真相仓。
- 已明确本仓不拥有 identity、conversation、method-library、process、governance、artifact、runtime、workspace 的真相。
- 已明确 child WorkItem 是协作级正式子任务，ImplementationPlan 是执行计划层对象，本仓只处理 promote 边界。
- 已明确单独成仓原因不是功能数量，而是项目工作事实需要独立、稳定、可追溯。
- 已准备进入 Step 3，讨论背景与问题定义。
