# Step 1. 与上游文档的关系声明

> 对应 SOP: `standards/document/需求文档讨论流程_SOP.md` Step 1
> 回填章节: `00-需求文档.md` §1 与上游文档的关系声明
> 生成日期: 2026-06-05

---

## 1. 本步目标

先校准 `L1-process` 需求文档的语义来源,明确它承接哪些上游结论,而不是重新定义共享契约、事件总线、SDK 接入、identity 成员、conversation truth、work truth、method definition、governance decision、artifact truth 或 runtime execution。

---

## 2. 本步输入

| 输入 | 当前状态 | 本步使用方式 |
|---|---|---|
| `projects/L1-process/README.md` | 旧版仓定位材料 | 作为旧口径诊断输入,识别仍可保留的使命、依赖和开放问题 |
| `projects/L1-process/00-需求文档.md` | 旧版需求文档 | 作为旧需求诊断输入,不作为新版正式基线 |
| `projects/L1-process/01-架构设计.md` ~ `06-验收标准.md` | 旧版下游文档 | 作为后续一致性诊断输入,本步只判断需求来源关系 |
| `domain/process/README.md` | 旧过程域详细设计 | 作为 ProcessTemplate / ProcessProfile / ProcessInstance、Activity、Token、checkpoint、gate wait、不变量和历史边界线索 |
| `projects/L0-core/00-需求文档.md` ~ `07-实施计划.md` | 已完成深度校准 | 作为直接稳定上游,承接共享 ID、ActorRef、TraceContext、Error、CloudEvents、metadata、配置和 evidence 口径 |
| `projects/L0-bus/00-需求文档.md` ~ `07-实施计划.md` | 已完成深度校准 | 作为事件协作上游,承接发布、订阅、ack、retry、dead-letter、replay 和报告证据口径 |
| `projects/L0-sdk/00-需求文档.md` ~ `07-实施计划.md` | 已完成深度校准 | 作为 L5/L6 与外部调用方接入 process 能力的默认封装边界输入 |
| `projects/L1-identity/00-需求文档.md` ~ `07-实施计划.md` | 已完成深度校准 | 作为 GlobalMember、actor、角色和成员生命周期来源 |
| `projects/L1-conversation/00-需求文档.md` ~ `07-实施计划.md` | 已完成深度校准 | 作为对话事实、conversation space、trace / handoff 和显化过程上下文的相邻真相来源 |
| `projects/L1-work/00-需求文档.md` ~ `07-实施计划.md` | 已完成深度校准 | 作为 Project、ProjectMember、Backlog、WorkItem、Iteration 和 ProcessTimeboxRef 协作边界来源 |
| `projects/L3-method-library/00-需求文档.md` ~ `07-实施计划.md` | 已完成深度校准 | 作为 ProcessTemplateDef、TaskDefinition、RoleDefinition、WorkProductDefinition、ViewProfile 等定义真相来源 |
| `product/最终目的.md` | 产品叙事上游 | 承接关键节点强制人类、过程可观察和人机协作需要规则推进的产品动机 |
| `product/六域模型.md` | 领域模型上游 | 承接 Process 是六域之一、回答“按什么规矩推进”的领域位置 |
| `architecture/仓库拆分方案.md` | 全局分层上游 | 承接 `quantalithos-process` 在 L1 六域服务层的位置和相邻仓关系 |
| `architecture/架构设计.md` | 全局架构上游 | 承接 process 与 identity、conversation、work、governance、artifact、runtime、workspace 等仓的架构协作位置 |
| `architecture/adr/0007-checkpoint-persistence-in-process.md` | Accepted ADR | 承接 Instance 级 checkpoint 归属 process 的边界 |
| `architecture/adr/0008-activity-completion-policy.md` | Accepted ADR | 承接 Activity completion policy 与 WorkItem 状态独立的边界 |
| `architecture/adr/0010-template-rigidity-levels.md` | Proposed ADR | 作为模板刚度分层的候选输入,后续风险与待确认事项中标注状态 |
| `architecture/adr/0011-process-nesting.md` | Proposed ADR | 作为 SubProcess / CallActivity 边界的候选输入,后续风险与待确认事项中标注状态 |
| `standards/document/全局项目依赖关系与裁剪规则.md` | 依赖裁剪基线 | 承接总依赖关系,并在后续 Step 6 / Step 12 裁剪出 `L1-process` 自己的部分 |

---

## 3. SOP 问题回答

### 3.1 本文承接哪些上游文档？

本文直接承接六类上游:

1. 已稳定基础仓结论:`L0-core`、`L0-bus`、`L0-sdk` 的 `00`~`07`。
2. 已稳定相邻领域结论:`L1-identity`、`L1-conversation`、`L1-work`、`L3-method-library` 的正式文档。
3. 全局产品与架构结论:`product/最终目的.md`、`product/六域模型.md`、`architecture/仓库拆分方案.md`、`architecture/架构设计.md`。
4. 已有 process 相关 ADR:ADR-0007、ADR-0008、ADR-0010、ADR-0011。
5. 历史过程域草案:`domain/process/README.md`、旧 `projects/L1-process/README.md`、旧 `00-需求文档.md`。
6. 全局依赖基线:`standards/document/全局项目依赖关系与裁剪规则.md`。

其中 `L0-core`、`L0-bus`、`L0-sdk` 提供基础协作能力;`L3-method-library` 提供流程模板和任务定义真相;`L1-work` 提供项目工作事实和 Iteration / ProcessTimeboxRef 边界;`L1-identity`、`L1-conversation` 提供 actor 与对话上下文边界。旧 process 文档提供历史领域线索,但不直接作为新版需求权威。

### 3.2 承接的是上游哪一部分主题？

本仓承接的主题是:在六域模型中把“按什么规矩推进”落为过程执行真相仓,负责把模板定义的运行时索引、项目裁剪后的过程 Profile、具体 ProcessInstance、Activity 推进、Token / Gateway、checkpoint、waiting gate 和恢复能力收束为可被 work、governance、artifact、conversation、runtime、member-service、workspace 和观测 / 归档能力消费的需求基线。

具体承接关系如下:

| 上游主题 | `L1-process` 承接方式 |
|---|---|
| `product/最终目的.md` 的关键节点强制人类与过程可观察 | 转译为过程执行、checkpoint、waiting gate 和可追溯推进需求 |
| `product/六域模型.md` 的 Process 域 | 转译为 ProcessTemplate 索引、ProcessProfile、ProcessInstance、Activity、Token / Gateway 等仓级需求来源 |
| `L0-core` 的共享契约 | 使用统一 ID、ActorRef、TraceContext、Error、CloudEvents、metadata 和 evidence 口径 |
| `L0-bus` 的事件语义 | 通过事件发布和消费与 work、governance、artifact、conversation、runtime、member-service、workspace 等仓协作 |
| `L0-sdk` 的 client 封装边界 | 面向 L5/L6 和外部调用方时优先通过 SDK 暴露 process 能力 |
| `L1-identity` 的成员真相 | process 只引用 actor / role / member,不拥有成员生命周期真相 |
| `L1-conversation` 的对话真相 | process 可被显化为 conversation 上下文或引用 trace / handoff,不拥有对话正文和可见性真相 |
| `L1-work` 的项目工作真相 | process 只引用 Project / WorkItem / Iteration / ProcessTimeboxRef 相关事实,不维护 Backlog 或 WorkItem truth |
| `L3-method-library` 的方法定义真相 | process 消费 ProcessTemplateDef / TaskDefinition snapshot 或发布事件,建立运行时索引,不拥有定义正文 |
| ADR-0007 | Instance 级 checkpoint 是 process 业务数据,reasoning trace 只保存引用 |
| ADR-0008 | Activity 与 WorkItem 状态机独立;completion policy 配置化,不让 process 接管 WorkItem truth |
| ADR-0010 / ADR-0011 | 作为刚度分层和流程嵌套候选输入,在后续风险与设计阶段继续收敛 |
| `domain/process/README.md` 的旧详细设计 | 作为三段式、BPMN / SPEM / 29110、checkpoint、Token、Gate wait 和开放问题线索 |

### 3.3 本文为什么不是重新定义该主题？

因为 `L1-process` 的主题不是重新定义“协作系统如何工作”,也不是重新定义成员、对话、项目工作、方法资产、治理、产物、运行时或事件基础设施。它只把已经成立的产品、架构、ADR 和已完成子项目结论,收束为 process 仓的外部可见需求边界。

本文不得重新定义:

- `L0-core` 的 ID、Error、TraceContext、CloudEvents、metadata 和 evidence。
- `L0-bus` 的 publish / subscribe / ack / retry / dead-letter / replay 语义。
- `L0-sdk` 的 client facade 和多语言接入口径。
- `L1-identity` 的 GlobalMember、Actor、Role 和成员生命周期真相。
- `L1-conversation` 的 conversation space、participant scope、conversation fact、trace / handoff 和授权查询真相。
- `L1-work` 的 Project、ProjectMember、Backlog、WorkItem、Iteration 和承诺子集真相。
- `L3-method-library` 的 ProcessTemplateDef、TaskDefinition、RoleDefinition、WorkProductDefinition、ViewProfile 等定义真相。
- `L1-governance` 的 Gate、Policy、approval 和 decision 真相。
- `L1-artifact` 的 Artifact 正文、evidence 正文或 baseline 归属。
- `L2-runtime`、`L2-member-service` 的实际执行、容器调度和 LLM / tool loop 真相。
- `L1-workspace` 的聚合视图和 UI 局部状态。

### 3.4 本文在当前仓里承担什么细化作用？

本文承担 `L1-process` 的仓级需求基线作用。它需要回答:

- Process 仓作为过程执行真相仓要做什么。
- ProcessTemplate 运行时索引、ProcessProfile、ProcessInstance、Activity、Token / Gateway、Checkpoint 和 waiting gate 等需求概念如何在过程执行层收束。
- 它与 method-library、work、governance、artifact、identity、conversation、runtime、member-service、workspace、observability、archive 的边界如何避免混写。
- 哪些旧版事实可以保留,哪些旧版假设需要后移或重新裁剪。
- 后续架构、概要、详细、配置、测试、验收、实施计划应围绕哪些需求结论展开。

---

## 4. 当前文档问题诊断

| 位置 | 当前表现 | 问题 | 处理口径 |
|---|---|---|---|
| 文档头部 | 写“严格遵循 13 节结构”,下游为 `04-实施计划.md` | 最新主链是 `00`~`07`,且 `04` 应为配置设计、`07` 才是实施计划 | Step 17 重建正式文档时统一改为新版主链 |
| 文档头部 | 前置文档只列 `product/最终目的.md`、`product/六域模型.md`、`domain/process/README.md` 和 ADR | 漏掉已完成的 `L0-core`、`L0-bus`、`L0-sdk`、`L1-identity`、`L1-conversation`、`L1-work`、`L3-method-library` | 正式 §1 补充稳定上游和相邻真相来源 |
| README | 技术栈写 `Python + PostgreSQL` | 这是旧实现倾向,不能在需求阶段直接确认 | 后续架构 / 详细设计 / 实施计划重新评估 |
| §1 | 标题为“与 `product/` 的关系声明” | 来源过窄,无法表达跨仓稳定结论和旧文档的降级关系 | 正式 §1 改为“与上游文档的关系声明” |
| §2 | 直接把 BPMN 2.0 / SPEM / 29110 / Temporal 写成需求背景 | 标准线索有价值,但需求阶段需先区分产品问题、领域边界和实现模式 | 后续 Step 3 / Step 4 / Step 9 再裁剪 |
| §3 | 目标直接写 Template / Profile / Instance 三聚合、checkpoint、P95、恢复时间 | 方向有价值,但已混合目标、功能、非功能和实现证据 | 后续 Step 4、Step 7、Step 13 再收敛 |
| §4 | 角色矩阵混合 Owner、Runtime、Governance、Artifact / Work、SRE | 用户角色和系统使用方混在一起 | Step 5 / Step 6 分开收敛 |
| §6 | 功能清单包含 BPMN 引擎、Checkpoint、Gate、Artifact outputs、WorkItem 交汇、嵌套、刚度 | 候选功能有价值,但需要先经过核心闭环、依赖裁剪和 ADR 状态判断 | 后续 Step 7~Step 12 逐步收敛 |
| 旧文档整体 | 没有 `design-calibration` 来源标注 | 不符合最新正式文档追溯要求 | Step 17 重建正式文档时逐章标注校准来源 |
| `domain/process/README.md` | 包含完整字段、状态机、实现算法和不变量 | 细节丰富但层级偏详细设计,不应直接压入需求来源声明 | 作为历史领域输入,后续按 Step 分批裁剪 |

---

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 来源层级 | 主要从 `product/`、`domain/process/README.md` 和 ADR 出发 | 从稳定 L0/L1/L3 上游 + 产品 / 架构 / ADR / 旧草案共同收敛 | Process 的边界依赖 method-library、work、identity、conversation 等已稳定结论 |
| 来源章节名称 | 与 `product/` 的关系声明 | 与上游文档的关系声明 | 需求来源不只来自 product |
| 旧 domain README 级别 | 近似作为详细设计权威 | 作为历史领域输入和不变量线索 | 避免结构体、状态机和实现字段直接进入需求 |
| 技术栈 | Python + PostgreSQL 在 README 中作为仓定位 | 技术栈后移,需求阶段只保留候选输入 | 避免旧实现倾向覆盖新版架构选择 |
| 文档链 | `00` -> `01` -> `02` -> `03` -> `04-实施计划` | `00` -> `01` -> `02` -> `03` -> `04-配置设计` -> `05` -> `06` -> `07-实施计划` | 对齐当前文档主链 |
| 相邻仓来源 | work / governance / artifact / runtime 等混在功能和依赖描述中 | 先声明稳定上游和相邻真相来源,后续 Step 6 / Step 12 再裁剪依赖 | 防止 Step 1 滑入边界、接口和依赖设计 |

---

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A: 直接沿用旧 `00-需求文档.md` 做局部修补 | 快,保留旧内容多 | 旧章节结构、旧文档链、旧实现假设和未追溯来源会残留 | 不采用 |
| 方案 B: 以稳定上游正式文档、产品 / 架构 / ADR 为来源,旧 process 文档作为候选事实逐步裁剪 | 边界清楚,能对齐最新 SOP 和已完成子项目设计 | 需要逐 Step 重做需求 | 采用 |
| 方案 C: 以 `domain/process/README.md` 为权威直接生成新版需求 | 细节丰富,能快速获得对象和不变量 | 会把字段、状态机、实现规则提前带入需求阶段,并可能覆盖已稳定相邻仓口径 | 不采用 |

---

## 7. 结构化中间产物

### 7.1 上游文档来源结论

| 来源文档 | 承接内容 | 权威级别 |
|---|---|---|
| `projects/L0-core/00-需求文档.md` ~ `07-实施计划.md` | ID、ActorRef、TraceContext、Error、CloudEvents、metadata、配置和 evidence 基线 | 直接稳定上游 |
| `projects/L0-bus/00-需求文档.md` ~ `07-实施计划.md` | 事件发布、订阅、ack、retry、dead-letter、replay 和报告证据口径 | 直接稳定上游 |
| `projects/L0-sdk/00-需求文档.md` ~ `07-实施计划.md` | 面向 L5/L6 和外部调用方的 process client 封装入口 | 稳定接入层上游 |
| `projects/L1-identity/00-需求文档.md` ~ `07-实施计划.md` | GlobalMember、actor、role 和成员生命周期引用来源 | 稳定相邻真相域 |
| `projects/L1-conversation/00-需求文档.md` ~ `07-实施计划.md` | conversation space、conversation fact、trace / handoff 和显化过程上下文来源 | 稳定相邻真相域 |
| `projects/L1-work/00-需求文档.md` ~ `07-实施计划.md` | Project、ProjectMember、Backlog、WorkItem、Iteration、ProcessTimeboxRef 协作边界 | 稳定相邻真相域 |
| `projects/L3-method-library/00-需求文档.md` ~ `07-实施计划.md` | ProcessTemplateDef、TaskDefinition、RoleDefinition、WorkProductDefinition、ViewProfile 等定义来源 | 稳定定义来源 |
| `product/最终目的.md` | 关键节点强制人类、过程可观察、人机协作需要规则推进的产品叙事 | 产品输入 |
| `product/六域模型.md` | Process 是六域之一、回答“按什么规矩推进”、三段式的领域位置 | 领域模型输入 |
| `architecture/仓库拆分方案.md` | `quantalithos-process` 的 L1 六域服务层位置和仓际关系 | 全局架构输入 |
| `architecture/架构设计.md` | Process 与 identity、conversation、work、governance、artifact、runtime、workspace 等仓的架构协作位置 | 全局架构输入 |
| `architecture/adr/0007-checkpoint-persistence-in-process.md` | Instance 级 checkpoint 归属 process | Accepted ADR |
| `architecture/adr/0008-activity-completion-policy.md` | Activity completion policy 与 WorkItem 状态独立 | Accepted ADR |
| `architecture/adr/0010-template-rigidity-levels.md` | Template 刚度与 ExecutionMode 候选方向 | Proposed ADR / 候选输入 |
| `architecture/adr/0011-process-nesting.md` | SubProcess / CallActivity 和父子 Instance 生命周期候选方向 | Proposed ADR / 候选输入 |
| `domain/process/README.md` | ProcessTemplate / ProcessProfile / ProcessInstance、Activity、Token、checkpoint、gate wait、状态和不变量线索 | 历史领域输入 |
| `projects/L1-process/README.md` | 仓使命、主要对齐、关键依赖、旧目录结构、维护纪律 | 旧仓定位输入 |
| `projects/L1-process/00-需求文档.md` | 旧版需求结构、目标、功能清单、验收和风险 | 旧需求输入 |
| `standards/document/全局项目依赖关系与裁剪规则.md` | 总依赖关系和后续按本仓裁剪的格式约束 | 依赖基线输入 |

### 7.2 承接主题结论

`L1-process` 承接的不是方法定义、项目工作事实、治理决策、产物正文、对话事实、成员生命周期或 runtime 执行,而是过程执行真相。它的需求主线应围绕以下主题展开:

| 主题 | 说明 |
|---|---|
| ProcessTemplate 运行时索引 | 从 method-library 的 ProcessTemplateDef / TaskDefinition 同步而来,用于执行,不是定义真相 |
| ProcessProfile | 面向项目或执行上下文裁剪后的过程形态,表达 profile 生效和冻结边界 |
| ProcessInstance | 具体运行的一次过程,表达当前状态、推进位置、父子关系和恢复边界 |
| Activity / Token / Gateway | 表达过程推进、并发 / 分支控制、等待和完成语义 |
| Checkpoint / Recovery | 表达 Instance 级恢复点和恢复能力,reasoning trace 只保存引用 |
| Waiting gate | 表达流程需要治理决策时的等待意图,不拥有 Gate 决策真相 |
| Activity / WorkItem 交汇 | 通过 completion policy 和引用协作,不接管 WorkItem 状态机 |
| 跨仓事实引用 | 引用 identity、conversation、work、governance、artifact、runtime、observability、archive 的事实或定义,不拥有其正文真相 |

### 7.3 收束说明结论

```text
Product narrative + Six-domain model + ADRs
  |
  v
L0-core + L0-bus + L0-sdk
  |
  v
L1-identity + L1-conversation + L1-work + L3-method-library
  |
  v
L1-process
  owns process execution truth
  |
  +-- consumes method definitions without owning definition truth
  +-- references work / governance / artifact / runtime facts without owning their truth
  +-- publishes process and activity facts for adjacent domains to consume
```

本图只表达需求来源和承接方向,不表达具体表结构、Rust struct、handler、outbox、projection、数据库约束或事件处理伪代码。

---

## 8. 回填草稿

以下内容供 Step 17 重建正式 `00-需求文档.md` 时回填到 §1。

```md
## 1. 与上游文档的关系声明

> 校准来源：
> - `design-calibration/00_req_step_01_upstream_relation.md`
>
> 延伸阅读：
> - 建议继续阅读上述中间产物的“结构化中间产物”“当前文档问题诊断”和“设计取舍”小节，了解本章上游来源和承接边界如何收敛。

本文承接已经稳定的 `L0-core`、`L0-bus`、`L0-sdk`、`L1-identity`、`L1-conversation`、`L1-work` 和 `L3-method-library` 设计结论，以及 `product/最终目的.md`、`product/六域模型.md`、全局架构、ADR 和旧 process 领域文档中的相关输入。本文不重新定义共享契约、事件协作、SDK 接入、GlobalMember、conversation truth、work truth、method definition、governance decision、artifact truth 或 runtime execution；这些由对应上游或相邻仓承载。本文只把“按什么规矩推进”收束为 `L1-process` 的仓级需求基线。

| 来源文档 | 承接内容 |
|---|---|
| `projects/L0-core/00-需求文档.md` ~ `07-实施计划.md` | ID、ActorRef、TraceContext、Error、CloudEvents、metadata、配置和 evidence 基线 |
| `projects/L0-bus/00-需求文档.md` ~ `07-实施计划.md` | 事件发布、订阅、ack、retry、dead-letter、replay 和报告证据口径 |
| `projects/L0-sdk/00-需求文档.md` ~ `07-实施计划.md` | 面向 L5/L6 和外部调用方的 process client 封装入口 |
| `projects/L1-identity/00-需求文档.md` ~ `07-实施计划.md` | GlobalMember、actor、role 和成员生命周期引用来源 |
| `projects/L1-conversation/00-需求文档.md` ~ `07-实施计划.md` | conversation space、conversation fact、trace / handoff 和显化过程上下文来源 |
| `projects/L1-work/00-需求文档.md` ~ `07-实施计划.md` | Project、ProjectMember、Backlog、WorkItem、Iteration、ProcessTimeboxRef 协作边界 |
| `projects/L3-method-library/00-需求文档.md` ~ `07-实施计划.md` | ProcessTemplateDef、TaskDefinition、RoleDefinition、WorkProductDefinition、ViewProfile 等定义来源 |
| `product/最终目的.md` | 关键节点强制人类、过程可观察、人机协作需要规则推进的产品叙事 |
| `product/六域模型.md` | Process 是六域之一、回答“按什么规矩推进”、三段式的领域位置 |
| `architecture/仓库拆分方案.md` | `quantalithos-process` 的 L1 六域服务层位置和仓际关系 |
| `architecture/adr/0007-checkpoint-persistence-in-process.md` | Instance 级 checkpoint 归属 process |
| `architecture/adr/0008-activity-completion-policy.md` | Activity completion policy 与 WorkItem 状态独立 |
| `architecture/adr/0010-template-rigidity-levels.md` | Template 刚度与 ExecutionMode 候选方向 |
| `architecture/adr/0011-process-nesting.md` | SubProcess / CallActivity 和父子 Instance 生命周期候选方向 |
| `domain/process/README.md` | ProcessTemplate / ProcessProfile / ProcessInstance、Activity、Token、checkpoint、gate wait、状态和不变量线索 |
| `standards/document/全局项目依赖关系与裁剪规则.md` | 总依赖关系和后续按本仓裁剪的格式约束 |

旧 `README.md` 和旧 `00-需求文档.md` 中可保留“ProcessTemplate / ProcessProfile / ProcessInstance 三段式、Activity、Token / Gateway、checkpoint、waiting_gate、Activity / WorkItem completion policy、模板刚度、流程嵌套”等事实线索；但旧的 13 节结构、缺少 `04-配置设计.md` / `07-实施计划.md` 的文档链、`Python + PostgreSQL` 技术栈假设，以及把详细字段和实现约束直接带入需求的口径不直接继承，后续章节将按新版需求 SOP 重新收束。
```

---

## 9. 待确认事项

| 编号 | 待确认事项 | 方案 A | 方案 B | 推荐 |
|---|---|---|---|---|
| Q-001 | `domain/process/README.md` 的权威级别 | 作为正式需求直接继承 | 作为历史领域输入和候选事实 | 推荐 B。原因是它包含大量详细设计、字段和实现约束,不能高于新版需求 SOP 与已完成上游正式文档 |
| Q-002 | 旧版 BPMN / SPEM / 29110 / Temporal 目标是否直接进入新版需求 | 直接继承为 P0 需求和规则 | 后续在 Step 4、Step 9、Step 10、Step 13 逐条裁剪 | 推荐 B。原因是 Step 1 只确认来源,不做目标、功能、规则和非功能裁决 |
| Q-003 | 旧版 `Python + PostgreSQL` 技术栈是否作为需求前提 | 直接继承 | 后移到架构、详细设计和实施计划重新评估 | 推荐 B。原因是需求阶段只写外部可见行为,不锁定实现技术栈 |
| Q-004 | ADR-0010 / ADR-0011 是否作为已定真相 | 作为 Accepted 直接继承 | 作为 Proposed 候选输入,后续标注风险和待确认 | 推荐 B。原因是文件状态仍为 Proposed,不能高于 Accepted ADR 和正式上游文档 |

当前建议:接受上述推荐后进入 Step 2。

---

## 10. 进入下一步条件

- 已明确 `L1-process` 的稳定上游包括 `L0-core`、`L0-bus`、`L0-sdk`、`L1-identity`、`L1-conversation`、`L1-work` 和 `L3-method-library`。
- 已明确本文承接产品叙事、六域模型、全局架构和 ADR,但不重新定义这些上游主题。
- 已明确旧 `domain/process/README.md`、旧 `README.md` 和旧 `00-需求文档.md` 是候选输入,不是新版需求权威。
- 已明确旧 `Python + PostgreSQL` 技术栈假设不在需求阶段直接继承。
- 已识别旧文档中需要后续清理的旧口径。
- 已准备进入 Step 2,讨论 `L1-process` 的本仓定位与边界。
