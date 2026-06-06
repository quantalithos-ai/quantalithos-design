# Step 2. 本仓定位与边界

> 对应 SOP: `standards/document/需求文档讨论流程_SOP.md` Step 2
> 回填章节: `00-需求文档.md` §2 本仓定位与边界
> 生成日期: 2026-06-05

---

## 1. 本步目标

建立 `L1-process` 的仓级心智:它是过程执行真相仓,而不是方法定义、项目工作事实、治理决策、产物正文、对话事实、成员生命周期、runtime 执行或 workspace 视图仓。后续需求讨论必须以这个边界为前提,避免把相邻仓职责混入 Process。

---

## 2. 本步输入

| 输入 | 当前状态 | 本步使用方式 |
|---|---|---|
| `design-calibration/00_req_step_01_upstream_relation.md` | Step 1 已完成 | 作为来源与承接边界前提 |
| `projects/L1-process/README.md` | 旧仓定位材料 | 保留“过程域服务”“ProcessTemplate / ProcessProfile / ProcessInstance 三段式”“checkpoint / waiting_gate”等定位线索 |
| `projects/L1-process/00-需求文档.md` | 旧版需求文档 | 提取过程推进、Activity 完成、Gate 等待、恢复等需求线索 |
| `domain/process/README.md` | 旧过程域详细设计 | 提取三段式、Activity、Token / Gateway、checkpoint、event、边界和不变量线索 |
| `product/六域模型.md` | 领域模型上游 | 固定 Process 回答“按什么规矩推进”的六域位置 |
| `projects/L3-method-library/00-需求文档.md` ~ `07-实施计划.md` | 已完成深度校准 | 固定 ProcessTemplateDef / TaskDefinition 等定义真相属于 method-library |
| `projects/L1-work/00-需求文档.md` ~ `07-实施计划.md` | 已完成深度校准 | 固定 Project / Backlog / WorkItem / Iteration truth 和 ProcessTimeboxRef 边界 |
| `architecture/adr/0007-checkpoint-persistence-in-process.md` | Accepted ADR | 固定 Instance 级 checkpoint 归属 process,reasoning trace 属于 observability |
| `architecture/adr/0008-activity-completion-policy.md` | Accepted ADR | 固定 Activity 与 WorkItem 状态独立,completion policy 配置化 |
| `standards/document/全局项目依赖关系与裁剪规则.md` | 依赖裁剪基线 | 固定 `L1-process` 编译期只应直接依赖 L0-core,method-library 为运行期 / 事件同步关系 |

---

## 3. SOP 问题回答

### 3.1 本仓一句话定义是什么？

`L1-process` 是过程执行真相仓,负责把方法库发布的过程 / 任务定义转成可执行的运行时索引,并在项目上下文中维护 ProcessProfile、ProcessInstance、Activity、Token / Gateway、Checkpoint、waiting gate 意图、恢复和过程节奏等正式过程推进事实。

这句话有四个限制:

- “过程执行真相”是本仓核心,不是所有流程相关对象都归本仓。
- “方法库发布的定义”表示定义真相仍在 `L3-method-library`,process 只拥有运行时索引和执行状态。
- “项目上下文中”表示 process 可引用 Project / WorkItem / Iteration,但不拥有项目工作事实。
- “waiting gate 意图”表示 process 可以进入等待治理决策的状态,但不拥有 Gate / Policy / approval 决策真相。

### 3.2 为什么它需要单独成仓？

因为过程执行事实同时被 work、governance、artifact、conversation、runtime、member-service、workspace、observability、archive 等多个仓引用。如果没有独立的 Process 真相仓,过程状态会散落在项目任务、治理审批、产物证据、对话显化和 runtime 执行上下文中,后续无法稳定回答“当前过程运行到哪一步、哪些 Activity 正在等待、哪些 checkpoint 可恢复、哪些 gate 是过程触发的、哪些事件代表过程推进”。

单独成仓的理由不是“BPMN 功能多”,而是事实边界独立:

- ProcessTemplate 运行时索引和 ProcessTemplateDef 定义真相必须分离。
- ProcessInstance 是过程运行事实,不能退化为 Project 生命周期字段或 workspace 进度条。
- Activity 是过程节点执行事实,不能等同 WorkItem 或 runtime plan step。
- Checkpoint 是 Instance 级恢复事实,不能混入 observability 的 reasoning trace 正文。
- waiting gate 是过程等待意图,不能等同 governance 的 Gate 决策事实。

### 3.3 本仓不是什么？

`L1-process` 不是以下对象:

- 不是 method-library 定义仓:不拥有 ProcessTemplateDef、TaskDefinition、RoleDefinition、WorkProductDefinition、ViewProfile 或 Method Content 正文。
- 不是 work 项目工作事实仓:不拥有 Project、ProjectMember、Backlog、WorkItem、child WorkItem、Iteration 或承诺子集真相。
- 不是 governance 决策仓:不拥有 Gate、Policy、Control、Approval 或 decision truth。
- 不是 artifact 正文仓:不拥有 Artifact、Evidence、Baseline 或 Archive Package 正文。
- 不是 runtime 执行仓:不拥有 LLM / tool loop、runtime 微步 checkpoint、执行计划推进或工具调用事实。
- 不是 member-service 编排仓:不拥有容器生命周期、运行资源调度或 member process 管理。
- 不是 identity 成员真相仓:不拥有 GlobalMember、Actor、Role 和成员生命周期。
- 不是 conversation 真相仓:不拥有 conversation space、participant scope、conversation fact 或对话可见性。
- 不是 workspace 聚合视图仓:不拥有项目仪表盘、进度视图或跨域工作台状态。
- 不是 observability / archive 横切仓:不拥有 reasoning trace 正文、指标存储、审计总账或归档包正文。

### 3.4 最容易与哪些相邻仓或概念混淆？

最容易混淆的对象如下:

| 类型 | 对象 | 混淆点 |
|---|---|---|
| 仓 | `L3-method-library` | ProcessTemplateDef / TaskDefinition 定义真相与 process 运行时索引 |
| 仓 | `L1-work` | Project / WorkItem / Iteration truth 与 ProcessInstance / Activity / timebox |
| 仓 | `L1-governance` | waiting_gate 意图与 Gate / Policy / decision truth |
| 仓 | `L1-artifact` | Activity output reference 与 Artifact / evidence 正文 |
| 仓 | `L2-runtime` | Activity 执行请求与 runtime agent loop / plan step |
| 仓 | `L2-member-service` | Activity assignment 与 member container orchestration |
| 仓 | `L1-identity` | Actor / Role 引用与成员生命周期真相 |
| 仓 | `L1-conversation` | 过程进展显化与 conversation fact / visibility truth |
| 仓 | `L1-workspace` | Process progress projection 与 workspace 视图状态 |
| 仓 | `L4-observability` | Instance checkpoint 与 reasoning trace / metrics / logs |
| 概念 | `ProcessTemplate runtime index` | 从 method-library 定义同步来的执行索引,不是定义正文 |
| 概念 | `Activity` | 过程节点,不是 WorkItem、ImplementationPlan step 或 runtime tool step |
| 概念 | `Checkpoint` | Instance 级恢复点,不是 runtime 微步 checkpoint 或 observability trace 正文 |

---

## 4. 当前文档问题诊断

| 位置 | 当前表现 | 问题 | 处理口径 |
|---|---|---|---|
| `00-需求文档.md` 头部 | 定位为“过程域服务”,承载 ProcessTemplate / ProcessProfile / ProcessInstance 三段式 | 方向正确,但未明确 ProcessTemplate 是运行时索引,定义真相在 method-library | 正式 §2 改为“过程执行真相仓”,并补运行时索引边界 |
| `README.md` | 写 `Python + PostgreSQL(BPMN 引擎生态丰富)` | 技术栈和存储实现提前进入仓定位 | 后移架构、详细设计、实施计划重新评估 |
| `domain/process/README.md` §2.1 | 把 ProcessTemplate 写为聚合根并列出完整字段 | 历史线索有价值,但容易覆盖 method-library 的 ProcessTemplateDef 定义真相 | 需求阶段只保留 runtime index / execution copy 口径 |
| `domain/process/README.md` §6.4 | 订阅 work.project.started 自动创建 ProcessInstance | 这是旧流程候选,但 Step 2 不能确认具体事件流和自动创建规则 | 后续 Step 6 / Step 12 再裁剪接口与依赖 |
| `00-需求文档.md` §3 | 目标直接写 checkpoint、P95、恢复时间 | 已滑入目标和非功能 | 后移 Step 4 / Step 13 |
| `00-需求文档.md` §6 | 功能清单直接列 BPMN 引擎、Gate、Artifact outputs、WorkItem 交汇、嵌套、刚度 | 候选能力有价值,但混入相邻仓边界和 Proposed ADR | 后续 Step 7~Step 12 逐步收敛 |
| 旧文档整体 | Activity、Gate、WorkItem、Artifact、runtime execution 在描述中频繁交织 | 过程执行事实和相邻仓 truth 边界没有先钉住 | Step 2 先写非职责和混淆对象 |

---

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 一句话定位 | “过程域服务”“过程引擎” | “过程执行真相仓” | 更准确表达 Process 拥有的是运行时推进事实,不是方法定义或所有流程相关功能 |
| Template 口径 | ProcessTemplate 聚合根容易被读作定义真相 | ProcessTemplate runtime index / execution copy | 对齐 method-library 的 ProcessTemplateDef 定义真相 |
| Project / WorkItem 边界 | Activity 与 WorkItem 通过 completion policy 协作 | Activity 不等同 WorkItem;Process 不维护 Backlog / Iteration truth | 对齐 ADR-0008 和 L1-work 边界 |
| Gate 边界 | Activity waiting_gate 与 governance Gate 混写 | Process 只拥有 waiting gate 意图,Gate decision 属于 governance | 防止 process 接管治理决策 |
| Checkpoint 边界 | checkpoint、reasoning trace、runtime checkpoint 容易混写 | Process 只拥有 Instance 级 checkpoint;reasoning trace 和 runtime 微步 checkpoint 分离 | 对齐 ADR-0007 |
| 表达粒度 | 旧文档混入功能、SLA、接口、字段和实现 | Step 2 只保留仓级边界声明 | 对齐需求规范 4.2 |

---

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A: 定位为“BPMN 过程引擎” | 直观,贴近旧文档 | 容易把实现技术和 BPMN 模型提前锁死,并忽略 SPEM / 29110 / checkpoint / gate wait 的领域边界 | 不采用 |
| 方案 B: 定位为“过程执行真相仓” | 精确表达 ProcessInstance、Activity、Token、Checkpoint 等运行事实归属,能和相邻仓边界分开 | 需要后续章节解释“执行真相”与“定义 / 工作 / 决策 / runtime 执行”的区别 | 采用 |
| 方案 C: 定位为“项目流程服务” | 产品语言更短 | 容易把 Project lifecycle、Iteration 和 WorkItem truth 并入 process | 不采用 |
| 方案 D: 定位为“调度服务” | 突出 Activity assignment 和 runtime 协作 | 会把 L2 runtime / member-service 编排职责误并入本仓 | 不采用 |

### 6.1 待确认问题的方案选择

#### 是否沿用 `ProcessTemplate` 作为需求层主对象名？

| 方案 | 内容 | 影响 |
|---|---|---|
| 方案 A | 继续写 ProcessTemplate,不加限定 | 简短,但容易与 method-library 的 ProcessTemplateDef 混淆 |
| 方案 B | 写 ProcessTemplate runtime index / 运行时索引 | 明确 process 不拥有定义正文,但正式命名后续还需在概要 / 详细设计收敛 |
| 方案 C | 不提 ProcessTemplate,只写 Profile / Instance | 避免混淆,但无法表达 method definition 到 runtime execution 的桥 |

推荐方案 B。原因是 process 必须消费模板定义并建立执行索引,但不能因此拥有定义真相。

#### 是否把 ProcessProfile 直接写成绑定 Project？

| 方案 | 内容 | 影响 |
|---|---|---|
| 方案 A | Step 2 直接确认 1:1 绑定 Project | 与旧文档一致,但过早进入关系基数 |
| 方案 B | Step 2 只写“项目上下文中的裁剪后过程形态” | 保留边界,把 1:1 / 1:n 和生命周期细节留给后续设计 |

推荐方案 B。原因是 Step 2 只钉定位与边界,不确认字段、基数和状态机。

---

## 7. 结构化中间产物

### 7.1 一句话定义结论

```text
L1-process 是过程执行真相仓,负责把方法库发布的过程 / 任务定义转成可执行的运行时索引,并在项目上下文中维护 ProcessProfile、ProcessInstance、Activity、Token / Gateway、Checkpoint、waiting gate 意图、恢复和过程节奏等正式过程推进事实。
```

### 7.2 非职责结论

| 非职责对象 | 结论 |
|---|---|
| `L3-method-library` | `L1-process` 不拥有 ProcessTemplateDef、TaskDefinition、RoleDefinition、WorkProductDefinition、ViewProfile 或 Method Content 正文 |
| `L1-work` | `L1-process` 不拥有 Project、ProjectMember、Backlog、WorkItem、child WorkItem、Iteration 或承诺子集真相 |
| `L1-governance` | `L1-process` 不拥有 Gate、Policy、Control、Approval 或 decision truth |
| `L1-artifact` | `L1-process` 不拥有 Artifact、Evidence、Baseline 或 Archive Package 正文 |
| `L2-runtime` | `L1-process` 不拥有 LLM / tool loop、runtime 微步 checkpoint、执行计划推进或工具调用事实 |
| `L2-member-service` | `L1-process` 不拥有容器生命周期、运行资源调度或 member process 管理 |
| `L1-identity` | `L1-process` 不拥有 GlobalMember、Actor、Role 和成员生命周期 |
| `L1-conversation` | `L1-process` 不拥有 conversation space、participant scope、conversation fact 或对话可见性 |
| `L1-workspace` | `L1-process` 不拥有项目仪表盘、进度视图或跨域工作台状态 |
| `L4-observability` / `L4-archive` | `L1-process` 不拥有 reasoning trace 正文、指标存储、审计总账或归档包正文 |

### 7.3 边界对象结论

| 边界对象 | 本步结论 |
|---|---|
| ProcessTemplate runtime index | 从 method-library 定义同步而来,用于执行,不是定义正文 |
| ProcessProfile | 裁剪后、可执行的过程形态;关系基数和生命周期后续收敛 |
| ProcessInstance | 一次过程运行事实,不是 Project lifecycle 字段或 workspace 进度视图 |
| Activity | 过程节点执行事实,不是 WorkItem、ImplementationPlan step 或 runtime tool step |
| Token / Gateway | 过程流控事实,不是 runtime 调度队列 |
| Checkpoint | Instance 级恢复事实,不是 runtime 微步 checkpoint 或 reasoning trace 正文 |
| waiting gate | 过程等待治理决策的意图和状态,不是 Gate decision truth |
| ProcessTimeboxRef / process timing | 可为 Work 的 Iteration 提供节奏引用,但不维护 Iteration truth |

### 7.4 单独成仓原因结论

`L1-process` 必须单独成仓,因为 ProcessInstance、Activity、Token / Gateway、Checkpoint、waiting gate 意图和恢复事实是多个相邻仓共同消费的过程执行事实。如果这些事实落入 method-library、work、governance、artifact、runtime 或 workspace,各仓会各自拥有一份不同的“流程状态”,导致过程推进、决策等待、恢复、审计和项目协作不可追溯。

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
| 一句话定义 | `L1-process` 是过程执行真相仓，负责把方法库发布的过程 / 任务定义转成可执行的运行时索引，并在项目上下文中维护 ProcessProfile、ProcessInstance、Activity、Token / Gateway、Checkpoint、waiting gate 意图、恢复和过程节奏等正式过程推进事实。 |
| 本仓不是什么 | 它不是方法定义仓、项目工作事实仓、治理决策仓、产物正文仓、runtime 执行仓、member-service 编排仓、身份真相仓、对话真相仓、workspace 聚合视图仓、observability 或 archive 横切仓。 |
| 边界对象列表 | 仓：`L3-method-library`；仓：`L1-work`；仓：`L1-governance`；仓：`L1-artifact`；仓：`L2-runtime`；仓：`L2-member-service`；仓：`L1-identity`；仓：`L1-conversation`；仓：`L1-workspace`；仓：`L4-observability`；仓：`L4-archive`；概念：`ProcessTemplate runtime index`；概念：`Activity`；概念：`Checkpoint`；概念：`waiting gate`。 |
| 单独成仓原因 | 平台需要一处独立、稳定、可追溯的过程执行事实来源，避免流程状态散落在方法定义、项目任务、治理审批、产物证据、runtime 执行和工作台视图中。 |

`L1-process` 需要单独存在，因为 ProcessInstance、Activity、Token / Gateway、Checkpoint、waiting gate 意图和恢复事实是多个相邻仓共同消费的过程执行事实。它最容易与 `L3-method-library` 混淆在 ProcessTemplateDef / TaskDefinition 定义和运行时索引边界上，与 `L1-work` 混淆在 Project / WorkItem / Iteration truth 和 Activity / timebox 边界上，与 `L1-governance` 混淆在 waiting gate 与 Gate decision 边界上，也容易与 artifact、runtime、member-service、conversation、workspace、observability 和 archive 在产出、执行、显化、视图、观测和归档边界上串线；这些边界必须分开，否则后续需求、设计、测试和实现都会出现多真相。
```

---

## 9. 待确认事项

| 编号 | 待确认事项 | 方案 A | 方案 B | 推荐 |
|---|---|---|---|---|
| Q-001 | 一句话定义是否采用“过程执行真相仓” | 使用旧称“过程域服务 / 过程引擎” | 使用“过程执行真相仓” | 推荐 B。原因是它更能解释 Process 为什么不能并入 method-library、work、governance、runtime 或 workspace |
| Q-002 | 是否在 Step 2 使用 ProcessTemplate runtime index 口径 | 继续写 ProcessTemplate 聚合根 | 写运行时索引 / execution copy,正式命名后续收敛 | 推荐 B。原因是定义真相已经由 method-library 承载 |
| Q-003 | 是否在 Step 2 直接确认 ProcessProfile 与 Project 的 1:1 绑定 | 直接确认 | 只写项目上下文中的裁剪后过程形态 | 推荐 B。原因是 Step 2 不确认字段、基数和生命周期 |
| Q-004 | 是否把 observability / archive 列入非职责 | 后续依赖章节再说 | Step 2 列为 checkpoint / trace / evidence 容易混淆的横切边界 | 推荐 B。原因是 ADR-0007 已把 checkpoint 与 reasoning trace 边界锁定 |

当前建议:接受上述推荐后进入 Step 3。

---

## 10. 进入下一步条件

- 已能用一句话定义 `L1-process`:过程执行真相仓。
- 已明确本仓不拥有 method-library、work、governance、artifact、runtime、member-service、identity、conversation、workspace、observability、archive 的真相。
- 已明确 ProcessTemplate 在 process 需求阶段使用 runtime index / execution copy 口径,不覆盖 method-library 定义真相。
- 已明确 Activity 不是 WorkItem、ImplementationPlan step 或 runtime tool step。
- 已明确 checkpoint 是 Instance 级恢复事实,waiting gate 是等待治理决策的过程意图。
- 已准备进入 Step 3,讨论背景与问题定义。
