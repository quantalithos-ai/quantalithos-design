# Step 4. 系统边界与上下文

> 对应 SOP: `standards/document/架构设计讨论流程_SOP.md` Step 4
> 回填章节: `01-架构设计.md` §5 系统边界与上下文
> 生成日期: 2026-06-02
> 状态: 已完成

---

## 1. 本步目标

说明 `L1-work` 在全局系统中的位置,明确它有哪些正式上下文对象、输入面、输出面以及外部边界。

本步只回答“本仓和哪些外部对象形成正式上下文关系”,不展开内部子域、容器、接口协议、事件名、DTO、数据所有权或实现组件。

---

## 2. 本步输入

| 输入 | 状态 | 用途 |
|---|---|---|
| `01_arch_step_01_requirement_baseline.md` | 已完成 | 提供架构需求基线、数据归属和依赖方向前提 |
| `01_arch_step_02_goals_constraints.md` | 已完成 | 提供架构目标、不可变约束、取舍和非目标 |
| `01_arch_step_03_responsibility_boundary.md` | 已完成 | 提供本仓做 / 不做和边界红线 |
| `00-需求文档.md` §6 / §12 / §13 / §14 | 已完成 | 提供使用方、依赖、能力接口、非功能和验收边界 |
| `standards/document/全局项目依赖关系与裁剪规则.md` | 已完成 | 提供全局依赖基线和单仓裁剪口径 |
| 旧 `01-架构设计.md` §4 | 未按最新 SOP 校准 | 作为旧系统上下文图问题诊断输入 |

---

## 3. SOP 问题回答

### 3.1 这个仓在全局系统中的位置是什么？

`L1-work` 位于 L1 领域服务层,是平台项目工作事实真相仓。它承接 `L0-core` 的共享契约和 `L0-bus` 的事件协作基础,使用 `L1-identity`、`L3-method-library`、`L1-conversation`、`L1-process`、`L1-governance`、`L1-artifact`、`L2-runtime` 等上下文对象提供的引用、定义、节奏、结论和 promote 输入,并向 SDK、workspace、process、member-service、archive 等消费方提供项目工作事实能力。

### 3.2 它有哪些正式上游？

正式上游分为五类:

- L0 底座:`L0-core` 和 `L0-bus`,提供共享契约、引用、trace、metadata 和事件协作主干。
- 成员来源:`L1-identity`,提供 GlobalMember / ActorRef / role 等成员锚点。
- 方法定义来源:`L3-method-library`,提供 role、task、work product、process template、view profile 等定义引用。
- 协作上下文来源:`L1-conversation` 和 `L2-runtime`,提供 conversation context、trace / handoff、plan item promote 需求等边界输入。
- 流程 / 治理 / 产物来源:`L1-process`、`L1-governance`、`L1-artifact`,提供 planning / review / timing、治理结论和完成依据引用。

### 3.3 它有哪些正式下游？

正式下游包括:

- `L0-sdk`,作为默认 client / integration access 封装面。
- `L1-workspace`,消费项目工作事实形成个人 / 项目聚合视图。
- `L1-process`,消费 Project、WorkItem、Iteration 等工作锚点组织流程执行。
- `L1-governance` 和 `L1-artifact`,消费工作事实、风险变化、完成依据和证据回链。
- `L2-runtime` 和 `L2-member-service`,消费正式 WorkItem、ProjectMember 和项目承担上下文。
- `L4-archive` / `L4-observability`,消费追溯、归档、导出和观测材料。

### 3.4 它从外部接收哪些输入面？

`L1-work` 从外部接收以下输入面:

- 共享契约与事件协作基础。
- GlobalMember、ActorRef、role 和成员生命周期引用。
- 方法定义、任务定义、工作产物定义和流程模板定义引用。
- conversation context、trace / handoff 和对话中提出的工作正式化来源引用。
- process planning / review / timing 和流程实例引用。
- governance Gate / Policy / Approval 结论引用。
- artifact evidence / baseline / ImplementationPlan / PlanItem 来源引用。
- runtime promote 需求和执行结果中可 formalize 的来源引用。

这些输入面进入本仓后只能形成 Work 自身真相、快照、引用或派生消费结果,不得复制相邻仓正文。

### 3.5 它向外部提供哪些输出面？

`L1-work` 向外部提供以下输出面:

- Project、ProjectMember、Backlog、WorkItem、child WorkItem、Iteration 和工作追溯能力。
- 项目工作事实查询、引用和消费视图。
- 项目、成员承担、工作拆分、依赖阻塞、Iteration、promote、完成依据等变化输出。
- 供 process、governance、artifact、runtime、workspace、member-service、archive 和 SDK 消费的稳定项目工作事实边界。
- 对账、维护和派生结果的可解释材料。

这些输出面不得让消费方反向定义 Work 真相。

### 3.6 哪些外部系统或相邻仓构成正式上下文边界？

正式上下文边界包括:

- `L0-core` / `L0-bus`: L0 底座依赖。
- `L1-identity`: GlobalMember、ActorRef、role 和成员生命周期来源。
- `L3-method-library`: 方法、任务、工作产物、流程模板和视图定义来源。
- `L1-conversation` / `L2-runtime`: 对话上下文和执行计划 promote 协作来源。
- `L1-process` / `L1-governance` / `L1-artifact`: 流程节奏、治理结论和完成依据 / 计划来源。
- `L0-sdk` / `L1-workspace` / `L2-member-service`: 默认访问、视图消费和成员容器编排消费方。
- `L4-observability` / `L4-archive`: 追溯、观测、归档和导出消费方。

### 3.7 依赖失效时,本仓的降级口径是什么？

`L0-core` 契约不稳定时,不得新增或擅自补造共享引用语义。`L0-bus` 不可用时,本仓已形成的 Work 真相不得丢失,对外变化输出和跨仓协作可以挂起或延迟。`L1-identity`、`L3-method-library`、`L1-process`、`L1-governance`、`L1-artifact`、`L1-conversation` 或 `L2-runtime` 不可用时,本仓只能保留既有引用、快照或未解析状态,不得补造成员、定义、流程、治理、产物、对话或运行时正文。下游消费方不可用时,不得反向改变 Work 真相;观测或归档不可用时,本仓保留可追溯接缝,但不接管全局长期存储职责。

---

## 4. 当前文档问题诊断

| 旧架构内容 | 问题 | 本轮处理 |
|---|---|---|
| 系统上下文图把 Owner / PM / AI Members 画成输入对象 | 角色不属于系统上下文对象 | 改为画正式仓、外部能力和消费边界 |
| 图中过早写 `ProjectMember`、`Backlog`、`WorkItem`、`Iteration` 等内部对象 | Step 4 不展开内部子域或对象结构 | 后移到 Step 5 限界上下文与子域划分 |
| process / governance / artifact / conversation 关系缺少依赖类型和真相边界 | 容易让相邻仓反写 Work 真相或被写成编译期依赖 | 改为正式上下文输入 / 输出面,不写 package dependency |
| 可用性约束直接写 PostgreSQL 和 SLA | 提前进入容器、部署和技术选型 | 后移到容器 / 部署、技术选型和横切关注点 |

---

## 5. 改动前后对比

| 维度 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 中心主语 | Project / WorkItem / Iteration 聚合 | `L1-work` 项目工作事实真相仓 | 系统上下文应先表达仓级系统位置 |
| 图中对象 | 用户角色、内部对象、相邻仓混画 | L0 底座、identity、method-library、conversation/runtime、process/governance/artifact、SDK/workspace/member-service、observability/archive | 对齐系统上下文图对象规则 |
| 上游表达 | identity、process、governance、artifact 作为泛外部依赖 | 按成员来源、定义来源、协作来源、流程 / 治理 / 产物来源分类 | 避免依赖和真相归属混淆 |
| 下游表达 | 看板 / 依赖图等读模型 | SDK、workspace、process、governance、artifact、runtime、member-service、archive 分面消费 | 区分产品视图、相邻仓消费和横切消费 |
| 降级口径 | 外部依赖 SLA | 按 L0、成员、定义、协作来源、下游、观测 / 归档分别处理 | 支撑后续一致性和风险章节 |

---

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A: 沿用旧图,只替换文字 | 改动小 | 角色、内部对象和实现线索仍会混入上下文图 | 不采用 |
| 方案 B: 图中聚合相关上下文对象,表中展开每个仓 | 图清晰,符合对象数量约束,能表达关键输入 / 输出 / 依赖 | 单图不展示所有相邻仓细节 | 采用 |
| 方案 C: 把所有相关 L0~L6 仓逐个画入系统上下文图 | 覆盖完整 | 图过载,会把系统上下文图变成全局依赖矩阵 | 不采用 |
| 方案 D: 只画 L0、identity、workspace | 主图更简洁 | 会丢失 method-library、process、governance、artifact、runtime promote 和 archive 等关键边界 | 不采用 |

---

## 7. 结构化中间产物

### 7.1 系统上下文图

```text
+------------------------+     +------------------------+     +------------------------+
| L0-core / L0-bus       |     | L1-identity            |     | L3-method-library      |
| shared base            |     | member refs            |     | definition refs        |
+-----------+------------+     +-----------+------------+     +-----------+------------+
            |                              |                              |
            | 输入 / 依赖                  | 输入                         | 输入
            v                              v                              v
        +---+-------------------------------------------------------------------+---+
        |                              L1-work                                   |
        |                    project work fact truth repository                  |
        +---+-----------------------------+-----------------------------+---------+
            |                             ^                             |
            | 输入 / 输出                 | 输入                         | 输出
            v                             |                             v
+-----------+------------+     +----------+-------------+     +----------+-------------+
| L1-conversation /      |     | L1-process / governance|     | L0-sdk / L1-workspace |
| L2-runtime             |     | / artifact             |     | / member-service      |
| context and promote    |     | timing/control/evidence|     | consumers             |
+-----------+------------+     +----------+-------------+     +----------+-------------+
            |                                                           |
            | 输出                                                      | 输出
            v                                                           v
        +---+-------------------------------------------------------------------+---+
        |                    L4-observability / L4-archive                       |
        |                       trace, audit, archive consume                    |
        +-----------------------------------------------------------------------+
```

该图仅表达本仓与正式上下文对象之间的边界关系与输入/输出方向，不表达接口、事件、实现组件或运行时顺序。

图示说明:

- `L0-core` / `L0-bus` 是本仓成立的底座依赖,但不拥有 Work 真相。
- `L1-identity` 和 `L3-method-library` 提供成员与定义引用,其正文真相不得进入本仓。
- `L1-conversation` / `L2-runtime` 提供上下文和 promote 协作来源,不能直接写 Backlog。
- `L1-process` / `L1-governance` / `L1-artifact` 提供节奏、控制和完成依据边界,不能反写 Work 真相。
- `L0-sdk`、`L1-workspace`、`L2-member-service`、`L4-observability` 和 `L4-archive` 消费 Work 事实,不改变本仓业务事实。

### 7.2 上下游与输入 / 输出面表

| 对象 | 关系方向 | 关系类型 | 输入/输出面 | 说明 |
|---|---|---|---|---|
| `L0-core` | 输入 | 依赖 | 共享 ID、ActorRef、TraceContext、Error、metadata、通用契约 | 本仓依赖统一引用和追溯口径,不得重新定义 L0 契约。 |
| `L0-bus` | 输入 / 输出 | 依赖 | 平台事件协作主干、变化输出和跨仓协作边界 | Bus 不拥有 Work 真相,但承载跨仓协作和下游感知。 |
| `L1-identity` | 输入 | 来源 | GlobalMember、ActorRef、role 和成员生命周期引用 | Work 只保存 ProjectMember 项目内承担事实,不拥有成员生命周期。 |
| `L3-method-library` | 输入 | 来源 | role、task、work product、process template、view profile 定义引用 | Work 只消费定义引用,不保存定义正文。 |
| `L1-conversation` | 输入 / 输出 | 协作 | conversation context、trace / handoff 和工作相关对话上下文 | Work 可回链对话上下文,但不保存 conversation 正文。 |
| `L2-runtime` | 输入 / 输出 | 协作 | plan item promote 需求和正式 WorkItem 执行上下文 | Runtime 执行推进不归 Work,Work 只承接显式 formalize 后的事实。 |
| `L1-process` | 输入 / 输出 | 协作 | planning / review / timing、流程实例引用和工作锚点 | Process 可以消费工作锚点,但不能拥有 Backlog 或 Iteration 真相。 |
| `L1-governance` | 输入 / 输出 | 治理依赖 | Gate / Policy / Approval 结论引用和高风险工作变化上下文 | Governance 裁决不归 Work,Work 只引用治理结论。 |
| `L1-artifact` | 输入 / 输出 | 协作 | evidence / baseline / ImplementationPlan / PlanItem 来源引用和完成依据 | Artifact 正文不归 Work,Work 只保存引用或摘要。 |
| `L0-sdk` | 输出 | 消费 | 默认 client / integration access | SDK 封装消费路径,不反写 Work 真相。 |
| `L1-workspace` | 输出 | 消费 | 个人 / 项目视图、dashboard 和 inbox 聚合所需工作事实 | Workspace 只聚合视图,不拥有 Work 真相。 |
| `L2-member-service` | 输出 | 消费 | ProjectMember 和项目承担上下文 | member-service 用于容器编排和运行上下文,不改变 Work 真相。 |
| `L4-observability` | 输出 | 消费 | trace、audit、运行观察和风险材料 | 观测系统消费追溯材料,不改变业务事实。 |
| `L4-archive` | 输出 | 消费 | 归档、导出和长期留存材料 | Archive 负责长期归档和恢复策略,Work 保留交接边界。 |

### 7.3 依赖失效降级口径

| 对象 | 失效情况 | 架构口径 |
|---|---|---|
| `L0-core` | 共享契约、引用或 trace 口径不稳定 | 不新增正式契约语义,不得自行补造共享类型。 |
| `L0-bus` | 事件协作主干不可用 | 已形成 Work 真相不得丢失;变化输出、跨仓协作和下游通知可挂起或延迟。 |
| `L1-identity` | GlobalMember / ActorRef 暂不可解析 | 保留既有引用和 ProjectMember 快照;不得补造成员生命周期结论。 |
| `L3-method-library` | 定义引用暂不可解析 | 保留引用缺失或未解析状态;不得复制或推断定义正文。 |
| `L1-conversation` / `L2-runtime` | 对话上下文或 promote 来源暂不可解析 | 保留来源引用或待 formalize 状态;不得直接创建正式 WorkItem。 |
| `L1-process` / `L1-governance` / `L1-artifact` | 流程、治理或产物来源暂不可解析 | 挂起相关高风险变化、完成依据或承诺调整;不得补造外部结论。 |
| `L0-sdk` / `L1-workspace` / `L2-member-service` | 下游消费方不可用 | 不改变 Work 真相,只影响对应消费面体验或运行上下文。 |
| `L4-observability` / `L4-archive` | 观测或归档消费不可用 | 本仓保留追溯接缝和交接材料,不接管全局长期存储职责。 |

### 7.4 边界说明结论

`L1-work` 的系统上下文围绕“底座依赖、成员来源、定义来源、协作输入、控制 / evidence 输入、工作事实输出和追溯交接”展开。进入主图的对象都是会影响 Work 真相成立、项目内承担、正式工作全集、Iteration 承诺子集或消费追溯的正式上下文对象;用户角色、内部对象、接口名、事件名和 DTO 不进入本章。`L1-identity`、`L3-method-library`、`L1-process`、`L1-governance`、`L1-artifact`、`L1-conversation` 和 `L2-runtime` 只通过引用、快照或正式协作边界参与,不把正文真相转移给 Work。`L0-sdk`、`L1-workspace`、`L2-member-service`、`L4-observability` 和 `L4-archive` 可以消费 Work 事实,但不得反向定义本仓业务事实。

---

## 8. 回填草稿

正式 `01-架构设计.md` 后续整理时:

- §5 “系统边界与上下文”直接摘录并整理本文件 §7.1、§7.2、§7.4。
- §13 “横切关注点”或 §15 “风险与待确认事项”可摘录本文件 §7.3 的依赖失效降级口径。
- 不在本 Step 重复粘贴完整正式章节,后续 Step 16 从结构化中间产物摘录生成正式文档。

---

## 9. 待确认事项

### 9.1 待确认项处理建议

| 待确认项 | 备选方案 | 推荐方案 | 推荐理由 | 当前状态 |
|---|---|---|---|---|
| 系统上下文图是否逐个展开所有相关 L1 / L2 / L4 仓 | A. 逐个展开;B. 在图中聚合、表中展开;C. 只保留 L0 / identity / workspace | B | Step 4 需要控制图对象数量,同时不能丢失 process、governance、artifact、runtime、archive 等边界 | 已确认采用 B |
| 是否把 `L1-process`、`L1-governance`、`L1-artifact` 视为双向协作对象 | A. 是;B. 只视为上游;C. 只视为下游 | A | 它们既提供节奏 / 控制 / evidence 输入,也消费 Work 锚点和工作事实 | 已确认采用 A |
| 是否把 `L1-conversation` 和 `L2-runtime` 画成同一协作来源组 | A. 是;B. 分开画;C. 不画 runtime | A | 两者都围绕上下文 / promote / formalize 边界协作,表中可区分 | 已确认采用 A |
| 是否在 Step 4 图中写接口名、事件名或协议名 | A. 写;B. 不写 | B | 架构 SOP 明确 Step 4 不表达接口协议、事件名、DTO 或实现组件 | 已确认采用 B |

### 9.2 本 Step 未确认事项

本步不新增阻塞 Step 5 的待确认事项。具体子域划分、容器部署、依赖方向、数据所有权、通信方式和技术选型留到后续 Step 独立收敛。

---

## 10. 进入下一步条件

- 已明确 `L1-work` 在全局系统中的位置。
- 已画出正式上下文对象图,且图中未出现角色、文档来源对象、接口名、事件名或内部模块。
- 已明确上游、下游、输入面、输出面和依赖失效口径。
- 未提前展开内部子域、容器部署、数据所有权或接口协议。
- 可以进入 Step 5“限界上下文与子域划分”。
