# Step 3. 职责边界

> 对应 SOP: `standards/document/架构设计讨论流程_SOP.md` Step 3
> 回填章节: `01-架构设计.md` §4 职责边界
> 生成日期: 2026-06-02
> 状态: 已完成

---

## 1. 本步目标

明确 `L1-work` 在全局职责分工中的承担范围，收稳“做什么 / 不做什么 / 易混淆职责 / 边界红线”。

---

## 2. 本步输入

| 输入 | 状态 | 用途 |
|---|---|---|
| `01_arch_step_01_requirement_baseline.md` | 已完成 | 提供架构需求基线、数据归属和依赖方向前提 |
| `01_arch_step_02_goals_constraints.md` | 已完成 | 提供架构目标、不可变约束、取舍和非目标 |
| `00-需求文档.md` §2 / §6 / §10 / §11 / §14 | 已完成 | 提供本仓边界、依赖、规则、数据归属和验收底线 |
| 旧 `01-架构设计.md` §4 / §5 | 未按最新 SOP 校准 | 作为旧“做什么 / 不做什么 / 子域”问题诊断输入 |

---

## 3. SOP 问题回答

### 3.1 这个仓具体做什么？

`L1-work` 正式承担以下职责:

- 承载项目工作事实真相边界。
- 维护 Project 作为正式软件项目工作对象的项目锚点。
- 维护 ProjectMember 作为 GlobalMember 在项目内承担工作的事实。
- 维护 Backlog、WorkItem 和 child WorkItem 组成的正式协作级工作全集。
- 表达正式工作之间的依赖、阻塞、解除依据和协作关系。
- 维护 Iteration 作为正式工作全集中的时间窗口承诺子集。
- 承接 conversation suggestion、runtime plan item 或 ImplementationPlan step 进入正式 WorkItem / child WorkItem 的显式 promote / formalize 边界。
- 为成员、审计者和相邻仓提供项目工作事实的授权消费和追溯基础。
- 维护从 Work 真相派生的看板、投影、对账和维护报告等辅助结构。

### 3.2 这个仓具体不做什么？

`L1-work` 明确不承担以下职责:

- 不做 GlobalMember、actor、role 生命周期、认证或授权裁决。
- 不做 conversation truth、聊天消息、trace / handoff 正文或 Chat UI。
- 不做 TaskDefinition、WorkProductDefinition、ProcessTemplateDef、ViewProfile 等方法定义。
- 不做 Activity、ProcessInstance、checkpoint 或流程推进状态。
- 不做 Gate、Policy、Control、Approval 等治理裁决。
- 不做 Artifact、evidence、baseline、ImplementationPlan 正文或产物生命周期。
- 不做 Runtime agent loop、tool invocation、plan item progress 或执行步骤推进。
- 不做 PersonalWorkspace、ProjectWorkspace、dashboard、inbox 或跨域聚合视图。
- 不做全局 archive / observability 主体架构。

### 3.3 哪些能力看起来相关但必须属于其他仓？

最容易混淆的职责包括:

- “成员是谁、是否有效、角色是什么”属于 `L1-identity` / `L0-core`,Work 只记录项目内承担。
- “对话里提出了什么建议”属于 `L1-conversation`,Work 只接收显式 formalize 后的正式工作事实。
- “任务定义、标准步骤和工作产物定义是什么”属于 `L3-method-library`,Work 只引用定义并记录项目执行事实。
- “流程什么时候 planning、review 或 checkpoint”属于 `L1-process`,Work 只维护 Backlog 和 Iteration 真相。
- “高风险变更是否被批准”属于 `L1-governance`,Work 只引用治理结论。
- “完成依据、证据和计划正文是什么”属于 `L1-artifact`,Work 只保存完成依据引用 / 摘要和 promote 来源引用。
- “plan item 如何执行推进”属于 `L2-runtime`,Work 只接收符合条件的 promote 请求或结果。
- “项目首页如何展示工作状态”属于 `L1-workspace`,Work 只提供可消费的工作事实。

### 3.4 哪些行为绝不能隐式发生？

- 查询项目或看板不能隐式创建 Project、ProjectMember、WorkItem、child WorkItem 或 Iteration。
- conversation suggestion、chat text 或 discussion mention 不能隐式创建正式 WorkItem。
- runtime plan item、tool step 或 local checklist 不能隐式写入 Backlog。
- process planning / review / Activity 推进不能隐式维护 Backlog 或 Iteration 真相。
- artifact evidence、governance decision 或 workspace view 不能隐式改变 Work 正式任务真相。
- projection、board、对账、维护报告或索引重建不能隐式修复、覆盖或删除业务事实。
- ProjectMember 变化不能隐式改变 GlobalMember 生命周期或 role definition。

### 3.5 哪些边界如果不写清，后续设计最容易串线？

最容易串线的边界:

- Project vs conversation topic / ProcessInstance / workspace project view / runtime context。
- ProjectMember vs GlobalMember / RoleDefinition。
- Backlog / WorkItem vs conversation suggestion / personal checklist / runtime plan item。
- child WorkItem vs ImplementationPlan step / tool execution step。
- Iteration vs process planning timing / board filter。
- done / completion reference vs artifact evidence body / governance decision body。
- Work derived view vs Work truth。

---

## 4. 当前文档问题诊断

| 旧架构内容 | 问题 | 本轮处理 |
|---|---|---|
| §4 “做什么 / 不做什么”把 Project、DAG、看板、process、governance、artifact、conversation 关系混写 | 把职责、数据归属、依赖和实现候选混在一章 | 改为按职责归属表收敛,不写接口、事件名或技术机制 |
| §5 子域直接列 Project、Planning、Assignment、View | 子域划分提前进入 Step 5 内容 | Step 3 只判断这些能力是否属于本仓职责,不做子域拆分 |
| ProjectMember 目标容易被写成 identity 的成员管理 | 会打穿 GlobalMember / ProjectMember 双层边界 | 改为“项目内承担事实”,不拥有成员生命周期 |
| ImplementationPlan promote 容易被写成 Work 拥有执行计划 | 会让 Work 接管 artifact / runtime 边界 | 改为显式 promote / formalize 边界,不拥有计划正文和执行推进 |

---

## 5. 改动前后对比

| 维度 | 旧口径 | 新口径 |
|---|---|---|
| 做什么 | Project lifecycle、ProjectMember、Backlog / WorkItem、Iteration、board | Work 真相、项目锚点、项目内承担、正式工作全集、依赖阻塞、承诺子集、promote 边界、授权消费和追溯 |
| 不做什么 | GlobalMember、流程编排、Gate 决策、Artifact 正文、Conversation group | 扩展为 identity、conversation、method-library、process、governance、artifact、runtime、workspace、archive / observability 主体职责均不承载 |
| 易混淆职责 | 未集中表达 | 单独列出 Project / ProjectMember / Backlog / child WorkItem / Iteration / completion / derived view 等混淆点 |
| 边界红线 | 分散在规则和依赖章节 | 集中列出不得隐式发生和不得反写的红线 |

---

## 6. 结构化中间产物

### 6.1 职责边界表

| 职责项 | 类型 | 说明 |
|---|---|---|
| 项目工作事实真相边界承载 | 做 | 这是本仓区别于 process、runtime、workspace 和 conversation 的核心职责。 |
| Project 正式项目锚点维护 | 做 | 若不由本仓承载,WorkItem、Iteration 和 ProjectMember 都会失去稳定归属。 |
| ProjectMember 项目内承担事实维护 | 做 | 本仓只表达项目内承担,不接管平台成员生命周期。 |
| Backlog / WorkItem / child WorkItem 正式工作全集维护 | 做 | 这是保护协作级任务不被个人步骤或对话建议污染的核心职责。 |
| 工作依赖、阻塞和解除依据表达 | 做 | 这是成员按共同项目事实协作和审计解释的基础。 |
| Iteration 承诺子集维护 | 做 | 本仓必须表达当前时间窗口内承诺完成的正式工作集合。 |
| promote / formalize 边界承接 | 做 | 本仓只接收显式升级后的正式工作事实,不拥有执行计划正文。 |
| 项目工作事实授权消费与追溯基础 | 做 | 下游和审计需要围绕同一份 Work 真相理解项目状态。 |
| 派生辅助结构维护 | 做 | 看板、投影、对账和维护报告可以服务消费,但只能从 Work 真相派生。 |
| GlobalMember、actor、role 生命周期 | 不做 | 该职责属于 `L1-identity` / `L0-core`,否则 Work 会接管身份真相。 |
| Conversation truth 与 Chat UI | 不做 | 该职责属于 `L1-conversation` / `L5-chat`,否则对话事实会污染工作事实。 |
| 方法定义和标准步骤定义 | 不做 | 该职责属于 `L3-method-library`,Work 只消费定义引用。 |
| Process 执行和 Activity 状态 | 不做 | 该职责属于 `L1-process`,否则流程推进会反向写 Backlog。 |
| Governance 裁决 | 不做 | Gate、Policy、Control、Approval 结论属于 `L1-governance`。 |
| Artifact / evidence / baseline / ImplementationPlan 正文 | 不做 | 正文和生命周期属于 `L1-artifact` 或 runtime / artifact 边界。 |
| Runtime 执行推进 | 不做 | agent loop、tool invocation 和 plan item progress 属于 `L2-runtime` / `L2-tools`。 |
| Workspace 聚合视图 | 不做 | 个人 / 项目工作台聚合属于 `L1-workspace`,Work 只提供事实来源。 |
| Project 与外部项目视图边界 | 易混淆职责 | 若不区分,后续会把 workspace project view 或 process instance 当成 Project truth。 |
| ProjectMember 与 GlobalMember 边界 | 易混淆职责 | 若不区分,后续会把项目承担和平台成员生命周期混为一体。 |
| WorkItem / child WorkItem 与执行步骤边界 | 易混淆职责 | 若不区分,个人 checklist、plan item 和 tool step 会污染正式任务。 |
| Iteration 与 process planning 边界 | 易混淆职责 | process 可以提供节奏或时机,但不能拥有承诺子集真相。 |
| 完成依据引用与 evidence 正文边界 | 易混淆职责 | Work 可保存完成依据引用 / 摘要,但不拥有 evidence body。 |
| 派生视图与业务事实边界 | 易混淆职责 | projection / board / report 只能辅助消费,不能成为第二 truth。 |

### 6.2 做 / 不做清单

| 分类 | 内容 |
|---|---|
| 做 | Work 真相边界;Project;ProjectMember;Backlog / WorkItem / child WorkItem;依赖阻塞;Iteration;promote / formalize;授权消费与追溯;派生辅助 |
| 不做 | Identity 生命周期;Conversation truth / Chat UI;Method definition;Process execution;Governance decision;Artifact / evidence / ImplementationPlan body;Runtime execution;Workspace aggregation;Archive / Observability 主体 |

### 6.3 边界红线清单

- 不得将 GlobalMember、RoleDefinition 或 actor lifecycle 写成 Work 真相。
- 不得将 conversation suggestion、discussion text、chat UI action 直接写成正式 WorkItem。
- 不得将 runtime plan item、tool execution step 或 local checklist 直接写入 Backlog。
- 不得将 Process Activity 推进、planning timing 或 board filter 写成 Iteration 真相。
- 不得将 Governance decision、Artifact evidence body 或 workspace aggregation 反写 Work 正式任务真相。
- 不得让 query、projection rebuild、board、对账或 report generation 写业务真相。
- 不得让 ProjectMember 变化隐式改变 GlobalMember 生命周期。
- 不得让 promote 边界吞入 ImplementationPlan 正文或 runtime execution progress。

---

## 7. 回填草稿

正式 `01-架构设计.md` 后续整理时,本步内容应回填到:

- §4 职责边界:回填“职责边界表”“做 / 不做清单”和“边界红线清单”。

---

## 8. 待确认事项

本步不新增阻塞性待确认事项。后续 Step 4 需要把这些职责边界转换为正式系统上下文关系,但不应改变本步职责归属。

---

## 9. 进入下一步条件

- 已明确本仓做什么、不做什么和易混淆职责。
- 已列出边界红线。
- 未重画系统上下文图。
- 未提前展开子域、数据所有权、接口协议或容器部署。
- 可以进入 Step 4“系统边界与上下文”。
