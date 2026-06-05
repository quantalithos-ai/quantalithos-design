# Step 7. 依赖方向与层间约束

> 对应 SOP: `standards/document/架构设计讨论流程_SOP.md` Step 7
> 回填章节: `01-架构设计.md` §8 依赖方向与层间约束
> 生成日期: 2026-06-02
> 状态: 已完成

---

## 1. 本步目标

明确 `L1-work` 内部有哪些正式架构责任层 / 依赖角色,这些角色之间允许怎样依赖,哪些外部能力必须通过正式边界进入,以及跨仓关系应如何从全局依赖基线中裁剪。

本步只讨论依赖方向和层间规则,不重写限界上下文、容器部署、接口协议、数据库细节、代码目录、handler / service / repository 调用链或事件字段。

---

## 2. 本步输入

| 输入 | 状态 | 用途 |
|---|---|---|
| `01_arch_step_05_bounded_context_subdomains.md` | 已完成 | 提供核心语义、支撑上下文和本地影子层划分 |
| `01_arch_step_06_container_deployment.md` | 已完成 | 提供同步入口、异步输入、后台维护、真相承载和派生承载的运行承接角色 |
| `00_req_step_06_consumers_dependencies.md` | 已完成 | 提供需求层仓际依赖裁剪和禁止依赖关系 |
| `00_req_step_12_interfaces_dependencies.md` | 已完成 | 提供能力级接口面与外部依赖边界 |
| `standards/document/全局项目依赖关系与裁剪规则.md` | 已完成 | 提供全局依赖类型、裁剪表和 ASCII 图格式 |
| 旧 `01-架构设计.md` §7 | 未按最新 SOP 校准 | 作为旧依赖方向问题诊断输入 |

---

## 3. SOP 问题回答

### 3.1 本仓内部层次如何划分？

本章中的“层次”不是代码目录、crate、模块或运行进程,而是架构责任层 / 依赖角色。`L1-work` 应收敛为五类依赖角色:

- `Work 核心语义角色`:承载项目工作事实真相、项目内承担、正式工作全集、依赖阻塞、Iteration 承诺子集、promote 结果和追溯规则。
- `Work 编排 / 承接角色`:承接正式输入、变更、查询、promote、维护触发和异步输入,并把外部输入转换为核心可接受的变化、引用或快照。
- `外部能力接缝角色`:承接来自 identity、method-library、conversation、process、governance、artifact、runtime、workspace、member-service、SDK、archive 等外部能力的正式边界。
- `派生消费辅助角色`:承接看板、投影、任务摘要、对账、维护报告和变化感知,只能从 Work 真相派生。
- `技术承载角色`:承载真相存储、派生承载、事件协作和运行支撑,但不拥有业务语义定义权。

### 3.2 允许哪些依赖方向？

允许的依赖方向是外层依赖内层、接缝依赖正式边界、派生依赖核心真相、技术承载依赖核心规则或正式承载契约。核心语义角色只允许依赖 `L0-core` 级共享契约和本仓内部语义规则,不得依赖下游消费方、外部来源仓、事件主题、数据库产品、看板展示或维护报告。

### 3.3 禁止哪些反向依赖？

禁止下游消费方、Runtime 执行过程、Workspace 聚合视图、Conversation 建议、Process planning、Governance 裁决、Artifact 正文、派生投影或技术存储反向定义 Work 真相。也禁止把 `L1-identity`、`L3-method-library`、`L1-conversation`、`L1-process`、`L1-governance`、`L1-artifact`、`L2-runtime`、`L2-member-service`、`L1-workspace`、`L4-archive` 或 `L0-bus` 等运行期或事件协作关系写成编译期源码依赖。

### 3.4 外部系统通过哪些正式边界接入？

外部能力必须通过 `外部能力接缝角色` 进入,并由 `Work 编排 / 承接角色` 转换为核心语义可接受的引用、快照、正式变化、promote 结果或消费视图。任何外部对象都不能直接写 `Work 核心语义角色`,也不能绕过核心真相把数据放入派生视图。

### 3.5 本仓在全局依赖基线中涉及哪些跨仓依赖边？

本仓直接涉及:

- `L0-core`:唯一编译期依赖。
- `L0-bus`:事件协作主干。
- `L1-identity`:ProjectMember 项目内承担事实的成员来源。
- `L3-method-library`:任务、工作产物、流程模板和视图定义来源。
- `L1-conversation`:工作上下文显化与 formalize 来源协作。
- `L1-process`、`L1-governance`、`L1-artifact`:流程节奏、治理结论、完成依据和计划来源协作。
- `L2-runtime`:执行推进与 plan item promote 协作。
- `L0-sdk`、`L1-workspace`、`L2-member-service`、`L4-archive`:消费 Work 事实或快照的下游边界。
- `L4-observability`:观测、审计和维护状态消费边界。

`L5` 产品和 `L6` 生态项目不进入当前架构主链;它们通常应通过 `L0-sdk` 或正式外部边界间接消费。

### 3.6 哪些依赖必须倒置？

成员来源、方法定义、对话来源、流程节奏、治理结论、产物依据、runtime promote、事件总线、存储、投影、对账和归档能力都必须通过正式边界倒置到 `Work 编排 / 承接角色` 或 `技术承载角色`,不能让这些外部或技术对象直接进入核心语义。核心语义只声明自己需要的引用、快照、正式变化、追溯和边界规则,外部适配和技术实现服从这些规则。

---

## 4. 当前文档问题诊断

| 旧架构内容 | 问题 | 本轮处理 |
|---|---|---|
| 依赖图写 `api -> application -> domain -> infra(Postgres / Bus / Projection)` | 这是代码实现层和技术承载混图,不是架构依赖角色 | 改为核心语义、编排承接、外部接缝、派生辅助、技术承载 |
| 图中直接列 `Project / WorkItem / Iteration` | 语义对象清单不应进入依赖方向图 | 对象线索保留到概要 / 详细设计,本章只写依赖角色 |
| `subscriptions 不直接改 DB,走 application 用例` | 方向有价值,但表述偏实现 | 转译为异步输入必须经编排承接和核心语义,不得绕过核心写真相 |
| `WorkItem.done 判据依赖 artifact 事件` | 容易把 artifact 事件当作核心依赖 | 改为完成依据引用 / 快照经正式接缝进入,artifact 正文不归 Work |
| `ProjectRepo / EventPublisher / BoardReadModel` 等接口点 | 属于概要 / 详细设计或实现接口 | 本步只保留依赖倒置结论,不写接口名 |
| 跨仓依赖未严格区分编译期、运行期、事件协作 | 后续实现可能把运行关系写成 Cargo dependency | 按全局依赖裁剪规则输出三张表和裁剪图 |

---

## 5. 改动前后对比

| 维度 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 层次主语 | API / application / domain / infra | 架构责任层 / 依赖角色 | 本章讨论依赖保护,不是代码组织 |
| 核心保护 | Work 对象、投影、事件和存储容易混在一起 | 核心语义只被正式承接角色依赖,派生不得反写 | 防止第二 truth |
| 外部来源 | identity / process / governance / artifact 可被看作直接依赖 | 外部来源只通过引用 / 快照 / 正式结论边界进入 | 防止来源真相漂移 |
| 下游消费 | workspace / runtime / member-service 可反推核心 | 下游只能经正式边界消费或协作 | 防止消费需求统治核心模型 |
| 跨仓依赖 | 未区分依赖类型 | `L0-core` 编译期,其他按运行期 / 事件协作处理 | 防止实现阶段依赖失控 |

---

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A: 按代码分层写 api / application / domain / infra | 对开发者熟悉 | 会提前进入概要 / 详细设计,且无法表达跨仓依赖红线 | 不采用 |
| 方案 B: 按核心语义、编排承接、外部接缝、派生辅助、技术承载写依赖角色 | 能保护 Work 真相,并承接 Step 5 / Step 6 结论 | 后续仍需在概要设计映射到代码主体 | 采用 |
| 方案 C: 把所有上下游仓都画成直接依赖 | 看似完整 | 会把运行期和事件协作误写为源码依赖 | 不采用 |
| 方案 D: 只写 `L0-core` 和 `L0-bus`,忽略下游消费方 | 图更简单 | 会遗漏 workspace、runtime、member-service、archive 等反向依赖风险 | 不采用 |

---

## 7. 结构化中间产物

### 7.1 依赖方向图

```text
+====================================================================+
|                         L1-work 依赖边界                           |
|                                                                    |
|   +---------------------------+       +--------------------------+ |
|   | 外部能力接缝角色          |       | 技术承载角色             | |
|   | external capability seams |       | storage / event support  | |
|   +-------------+-------------+       +-------------+------------+ |
|                 | 边界接入                          | 允许依赖    |
|                 v                                   v             |
|        +--------+-----------------------------------+------+      |
|        | Work 编排 / 承接角色                              |      |
|        | formal intake / consume / promote / maintain      |      |
|        +----------------------+----------------------------+      |
|                               | 允许依赖                          |
|                               v                                   |
|        +----------------------+----------------------------+      |
|        | Work 核心语义角色                                 |      |
|        | project work truth / rules / trace                |      |
|        +----------------------+----------------------------+      |
|                               ^                                   |
|                               | 允许依赖                          |
|        +----------------------+----------------------------+      |
|        | 派生消费辅助角色                                   |      |
|        | projection / board / reconciliation / report      |      |
|        +---------------------------------------------------+      |
|                                                                    |
+====================================================================+
```

图示说明:

- 箭头只表示允许依赖或边界接入,不表示运行调用顺序、协议时序或代码调用链。
- `Work 核心语义角色` 是被保护的中心,外部来源、下游消费、技术承载和派生辅助都不能反向定义它。
- `派生消费辅助角色` 可以依赖核心真相和授权范围,但不得形成第二 truth。
- `技术承载角色` 只服从正式承载契约,不决定业务语义、状态流转或数据归属。

### 7.2 层间约束表

| 架构责任层 / 依赖角色 | 允许依赖 | 禁止依赖 | 说明 |
|---|---|---|---|
| `Work 核心语义角色` | `L0-core` 共享契约和本仓内部语义规则 | 下游消费方、来源仓正文、外部平台对象、事件主题、数据库产品、派生投影、看板展示、维护报告 | 保护项目工作事实、成员承担、正式工作全集、Iteration 和 promote 规则不被外部反向定义。 |
| `Work 编排 / 承接角色` | 核心语义角色、正式外部接缝、正式承载边界 | 绕过核心直接写存储;把外部事实原文变成本仓 truth;把下游展示状态写入核心 | 承接输入和消费,但必须把外部能力转换为核心允许的引用、快照、正式变化或维护材料。 |
| `外部能力接缝角色` | 正式边界、编排 / 承接角色、必要的运行期协作对象 | 直接依赖核心存储结构;直接改变核心语义;越过授权范围输出事实 | 外部能力只能通过受控接缝进入或消费,不能打穿核心。 |
| `派生消费辅助角色` | 核心语义角色、授权范围和正式派生规则 | 生成新业务事实;覆盖核心事实;绕过项目可见性或追溯规则向下游输出 | 投影、看板、任务摘要、对账和维护报告都只是消费辅助,可重建且不得反写。 |
| `技术承载角色` | 核心定义的正式状态、派生规则和承载契约 | 决定业务状态、成员承担、正式化语义、Iteration 承诺或完成依据含义 | 存储、事件、索引、缓存等技术选择只能支撑架构,不能定义架构。 |

### 7.3 依赖倒置结论

| 需要倒置的依赖 | 倒置方式 | 保护目标 |
|---|---|---|
| `L1-identity` 成员 / actor 来源 | 核心只保存 GlobalMember / Actor 引用和项目内承担快照,解析与同步经正式接缝进入 | 防止身份生命周期进入 Work 真相 |
| `L3-method-library` 定义来源 | 核心只保存任务、工作产物、流程模板和视图定义引用或目录快照 | 防止方法定义正文转移给 Work |
| `L1-conversation` 对话来源 | 对话建议、handoff 和上下文只作为 formalize 来源引用进入 | 防止 conversation fact 正文直接写成 WorkItem |
| `L1-process` 流程节奏 | planning / review / timing 只作为节奏引用或快照进入 | 防止 process planning 直接维护 Backlog / Iteration 真相 |
| `L1-governance` 治理结论 | Gate / Policy / Approval 以正式结论引用进入 | 防止治理裁决正文或决策生命周期进入 Work |
| `L1-artifact` 完成依据和计划来源 | Artifact / evidence / baseline / ImplementationPlan 只以引用或摘要进入 | 防止产物正文和执行计划正文进入 Work |
| `L2-runtime` promote 来源 | Runtime 只能通过正式 promote 边界输入来源引用和升级需求 | 防止 plan item progress 或 tool step 直接进入 Backlog |
| `L0-bus` 事件协作 | 事件协作通过正式发布 / 消费边界承接 | 防止 event topic / relay 机制定义核心语义 |
| 存储 / 投影 / 缓存 / 归档 | 作为技术承载或消费交接实现,服从核心定义 | 防止技术产品或派生结果成为 truth source |

### 7.4 本仓依赖裁剪表

| 关联项目 | 全局关系 | 本仓角色 | 依赖类型 | 是否进入当前文档主链 | 裁剪理由 |
|---|---|---|---|---|---|
| `L0-core` | `L1-work` 编译期依赖 `L0-core` | 依赖方 | 编译期 | 是 | 共享 ID、ActorRef、TraceContext、Error、CloudEvents、metadata 和通用契约是 Work 真相表达前置。 |
| `L0-bus` | `L1-work` 通过 `L0-bus` 事件协作 | 协作方 | 事件协作 | 是 | Work 事实变化需要跨仓发布 / 消费,但 bus 不写成源码依赖。 |
| `L0-sdk` | `L0-sdk` 运行期封装 L1+ API | 被依赖方 | 运行期 | 是 | SDK 是上层产品和外部调用方默认接入面,不能反向定义 Work 核心。 |
| `L1-identity` | `L1-work` 运行期引用 identity 成员锚点 | 依赖方 | 运行期 | 是 | ProjectMember 需要 GlobalMember / actor 边界,但不接管成员生命周期。 |
| `L1-conversation` | conversation 与 work 在项目协作上下文中互相消费 | 协作方 | 事件协作 / 运行期 | 是 | 对话来源可 formalize 到 Work,Work 事实也可在对话中显化。 |
| `L3-method-library` | Work 消费方法定义和模板引用 | 依赖方 | 运行期 | 是 | 方法化项目工作需要 task / work product / template / view profile 定义来源。 |
| `L1-process` | process 与 work 围绕项目和 iteration 协作 | 协作方 | 运行期 | 是 | 流程节奏影响 planning / review timing,Work 提供项目事实锚点。 |
| `L1-governance` | governance 与 work 围绕项目高风险变更协作 | 协作方 | 运行期 | 是 | Gate / Policy / Approval 结论影响高风险项目变化和工作拆分边界。 |
| `L1-artifact` | artifact 与 work 围绕 evidence / baseline / plan 引用协作 | 协作方 | 运行期 | 是 | Work 完成依据、证据回链和 promote 来源需要 artifact 边界。 |
| `L1-workspace` | workspace 只读消费 L1 真相域查询 / 投影 | 被依赖方 | 运行期 | 是 | 项目工作台需要 Work 事实作为视图来源,但 workspace 不反写真相。 |
| `L2-runtime` | runtime 围绕 WorkItem 推进执行并提出 promote 需求 | 协作方 | 运行期 | 是 | ImplementationPlan / PlanItem promote 边界需要 runtime 侧输入。 |
| `L2-member-service` | member-service 订阅身份、项目成员和 policy 事件 | 被依赖方 | 事件协作 | 是 | 容器编排需要 ProjectMember 承担事实。 |
| `L4-archive` | archive 消费 L1 domain snapshot / export 能力,并承接 trace / archive handoff 材料 | 被依赖方 | 下游消费 / 追溯交接 | 是 | 项目归档和恢复需要 Work 事实快照与追溯材料。 |
| `L4-observability` | observability 消费 audit / trace / metrics material | 被依赖方 | 事件协作 | 是 | Work 关键变化、边界异常和维护状态需要可观察。 |
| `L5` 产品入口 | 产品经 SDK 消费 L1 能力 | 被依赖方 | 运行期 | 否 | 当前架构主链不逐个展开产品仓,应经 SDK 或正式边界消费。 |
| `L6` 生态入口 | 生态经 SDK / public APIs 消费能力 | 被依赖方 | 运行期 / 事件协作 | 否 | 当前 Work 架构主链不直接依赖生态仓。 |

### 7.5 本仓依赖类型分类表

| 依赖类型 | 关联项目 | 本仓如何使用 / 提供能力 | 后续文档落点 |
|---|---|---|---|
| 编译期依赖 | `L0-core` | 使用共享 ID、ActorRef、TraceContext、Error、CloudEvents、metadata 和通用契约 | 详细设计 / 实施计划 |
| 事件协作 / 追溯交接依赖 | `L0-bus`、`L1-conversation`、`L2-member-service`、`L4-observability`、`L4-archive` | 通过事件协作传播或消费项目工作事实变化、成员承担变化、trace / audit 材料和 archive handoff 材料 | 架构设计 / 测试方案 / 验收标准 |
| 运行期依赖 | `L1-identity`、`L3-method-library`、`L1-process`、`L1-governance`、`L1-artifact`、`L2-runtime` | 运行时消费成员、定义、流程节奏、治理结论、证据依据和执行推进边界 | 架构设计 / 详细设计 |
| 下游消费 / 运行期提供 | `L0-sdk`、`L1-workspace`、`L4-archive`、`L5` / `L6` 经正式边界 | 向 SDK、workspace、archive 和上层入口提供项目工作事实能力、快照来源或 export 来源 | 架构设计 / 实施计划 |

`L4-archive` 的双角色必须显式区分:handoff / 回链是事件协作 / 追溯交接,snapshot / export 读取是下游消费 / 运行期提供。`L4-observability` 只作为 trace、audit 和维护状态消费目标出现,不得作为 Work 运行期上游来源。

### 7.6 本仓禁止依赖表

| 禁止依赖 | 禁止原因 | 正确协作方式 |
|---|---|---|
| `L1-work -> L1-identity` 编译期依赖 | 会把 GlobalMember 真相和 Work 真相耦合 | 使用 `L0-core` 共享引用,运行期 / 事件协作对齐 |
| `L1-work -> L1-conversation` 编译期依赖 | 会把对话真相引入工作事实仓 | 使用引用边界和事件 / 查询协作 |
| `L1-work -> L3-method-library` 编译期依赖 | 会把方法定义源码并入 Work | 通过正式定义读取边界消费 |
| `L1-work -> L1-process` / `L1-governance` / `L1-artifact` 编译期依赖 | 会破坏 L1 真相域平权并形成循环风险 | 运行期边界或事件协作 |
| `L1-work -> L2-runtime` / `L2-member-service` 编译期依赖 | 会让 L1 反向依赖运行层 | 运行期 / 事件协作,由 L2 消费 Work 事实 |
| `L1-work -> L1-workspace` 编译期依赖 | Workspace 是聚合视图,不能成为 Work 核心依赖 | Workspace 只读消费 Work 查询、投影或事件协作结果 |
| `L1-work -> L0-bus` 编译期依赖到业务实现 | Bus 是事件协作主干,但不应成为 Work 业务核心实现依赖 | 通过正式事件协作边界接入 |
| `L5/L6` 产品或生态仓绕过 `L0-sdk` 直接绑定 `L1-work` 源码 | 会破坏 SDK 统一接入层和依赖裁剪规则 | 经 SDK 或正式 API 边界消费 |
| 派生视图 / 对账材料 -> Work 真相反写 | 派生结构可延迟和重建,不能成为第二 truth | 从核心真相派生,必要时重建派生结果 |
| 存储 / 缓存 / 投影产品 -> 核心语义 | 技术产品不能定义业务状态、承诺范围或完成依据含义 | 技术承载服从核心规则和正式承载契约 |

### 7.7 依赖裁剪图

#### 依赖裁剪图: L1-work

```text
Global baseline
  |
  | crop only L1-work related edges
  v
                         +----------------+
                         | L1-identity    |
                         +--------+-------+
                                  | [runtime]
                                  v
+-----------+ [compile]   +-------+-------+   [runtime] +-------------------+
| L0-core   +------------>| L1-work       |<------------+ L3-method-library |
+-----------+             +-------+-------+             +-------------------+
                                  ^
                                  | [event]
                              +---+----+
                              | L0-bus |
                              +---+----+
                                  |
        +-------------------------+-------------------------+
        | [runtime/event] related collaboration and consumers|
        v                                                   v
 process / governance / artifact / conversation / runtime / workspace
 member-service / archive / observability / SDK
```

图示说明:

- 本图只展示 `L1-work` 相关依赖,不展示全 27 仓。
- `[compile]` 只有 `L0-core`,可进入后续 Cargo / package dependency 讨论。
- `[runtime]` 和 `[event]` 不得写成 package dependency,只能进入正式边界、adapter、event 或 projection 讨论。
- 箭头表达依赖 / 消费 / 协作方向,不表达调用顺序、接口时序或事件传播顺序。

### 7.8 依赖边界说明

`L1-work` 的依赖方向以保护项目工作事实真相为中心:外部来源可以提供引用、快照、节奏、结论、依据或 promote 来源,下游可以消费授权工作事实,技术承载可以支撑存储和派生,但它们都不能反向定义核心语义。`L0-core` 是唯一可进入编译期的共享契约基线,其余跨仓关系必须按运行期或事件协作处理。这个边界让后续概要设计可以继续展开代码主体骨架,但不会把 identity 生命周期、conversation 建议、process planning、governance 裁决、artifact 正文、runtime 执行步骤、workspace 聚合视图或技术产品提前写进 Work 核心。

---

## 8. 回填草稿

正式 `01-架构设计.md` 后续整理时:

- §8 “依赖方向与层间约束”直接摘录并整理本文件 §7.1、§7.2、§7.3、§7.4、§7.5、§7.6、§7.7 和 §7.8。
- 不在本 Step 重复粘贴完整正式章节,后续 Step 16 从结构化中间产物摘录生成正式文档。

---

## 9. 待确认事项

### 9.1 待确认项处理建议

| 待确认项 | 备选方案 | 推荐方案 | 推荐理由 | 当前状态 |
|---|---|---|---|---|
| 内部依赖主结构是否按代码层表达 | A. 按 api / application / domain / infra;B. 按架构责任层 / 依赖角色;C. 两者混写 | B | 本章目标是保护依赖方向和核心语义,不是定义源码组织 | 已确认采用 B |
| 除 `L0-core` 外是否允许其他仓进入编译期依赖 | A. 允许;B. 禁止,只保留运行期 / 事件协作;C. 逐仓待定 | B | 对齐全局依赖裁剪规则,防止 L1 / L2 / L3 仓源码耦合 | 已确认采用 B |
| `L0-bus` 是否写成 Work 编译期依赖 | A. 是;B. 否,只作为事件协作依赖;C. 待实施决定 | B | bus 是事件协作主干,不得因协作关系变成 Work 核心源码依赖 | 已确认采用 B |
| 派生视图、看板、对账是否允许反写 Work 真相 | A. 允许;B. 禁止;C. 只允许维护任务修复 | B | 派生结果可重建可延迟,不能成为第二 truth | 已确认采用 B |

### 9.2 本 Step 未确认事项

本步不新增阻塞 Step 8 的待确认事项。具体接口协议、事件 schema、repository / port 命名、Cargo 依赖写法、存储产品和事务一致性留到后续 Step 或后续设计文档。

---

## 10. 进入下一步条件

- 已明确内部架构责任层 / 依赖角色。
- 已明确允许依赖方向、禁止反向依赖和依赖倒置边界。
- 已从全局依赖基线裁剪出 `L1-work` 的相关依赖边。
- 已区分编译期、运行期和事件协作依赖。
- 未把源码目录、运行单元、协议对象、数据库对象或调用链写成本章主结构。
- 可以进入 Step 8“数据所有权与一致性策略”。
