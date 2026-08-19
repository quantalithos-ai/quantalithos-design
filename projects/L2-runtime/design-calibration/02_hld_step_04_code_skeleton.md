# L2-runtime 02 概要 Step 4: 代码主体框架映射

> 创建日期: 2026-08-07
> 状态: done
> 当前模式: full-restart
> 回填位置: `02-概要设计.md` 第 4 章

## 0. Step 开工确认

| 项目 | 记录 |
|---|---|
| 输入 | Step 2 目标 / 深度、Step 3 硬约束、正式架构八语境与五运行承载角色 |
| 目标 | 把架构语境转译为后续可展开的业务主要组成部分和实现分层，点名必要代码主体骨架 |
| 禁止 | crate / package / directory / file、语言语法、完整 trait / struct、DB table、HTTP path、topic、deployment |

## 1. 问题回答与映射取舍

| 问题 | 回答 |
|---|---|
| 架构语境映射到哪些代码主体？ | 每个语境映射一个业务主要组成部分，并包含 application coordinator / domain object or policy / port or projection 等语言中立主体；不把语境名直接当代码目录。 |
| Inbound / Operations 属于哪些主体？ | Runtime Entry & Control 的 command / query acceptance，Feedback consumption 的 inbound event，Recovery / projection / handoff continuation 的 operations job trigger。 |
| Application Services 属于哪些主体？ | RunCoordinator、ContextCompositionService、ModelDecisionService、ActionOrchestrationService、RecoveryCoordinator、ExternalTruthResolutionService、SafeViewProjectionService。 |
| Domain Model 属于哪些主体？ | ControlledRun、GoalPlanWorkspace、WorkingContext / WorkingMemory、ModelIntent / Decision / Turn、ActionDecision / Delegation、RuntimeCheckpoint / RecoveryDecision / RuntimeOutcome、owner-anchored refs / snapshots、safe view semantics。 |
| Ports / Persistence / Projection 属于哪些主体？ | RuntimeStateRepositoryPort、external truth resolver / model / tools / governance / sandbox / memory ports、committed fact handoff port、Safe Runtime Views；public schema pending 时只是 candidate boundary。 |
| 必须先点名什么？ | 八个业务组成部分、七个 application services、核心 aggregate / record families、external ports、state repository responsibility、safe projector / handoff service；否则 Step 5 会回到旧模块或外部 owner。 |

## 2. 架构模块到代码主体映射图

```text
L2-runtime
|
+-- 1. Runtime Entry & Control
|   +-- RuntimeCommandAcceptance
|   +-- RuntimeQueryService
|   `-- RuntimeControlService
|
+-- 2. Run & Goal-Plan
|   +-- RunCoordinator
|   +-- ControlledRun
|   `-- GoalPlanWorkspace
|
+-- 3. Context & Memory Mediation
|   +-- ContextCompositionService
|   +-- WorkingContext / WorkingMemory
|   `-- SourceResolverPort / DurableMemoryPort [candidate]
|
+-- 4. Model Decision
|   +-- ModelDecisionService
|   +-- ModelIntent / ModelDecision / ModelTurn
|   `-- ModelAdapterPort [candidate / blocked]
|
+-- 5. Action & Delegation Orchestration
|   +-- ActionOrchestrationService
|   +-- ActionDecision / Delegation
|   `-- Tools / Governance / Sandbox Ports [candidate / blocked]
|
+-- 6. Checkpoint, Recovery & Handoff
|   +-- RecoveryCoordinator
|   +-- RuntimeCheckpoint / RecoveryDecision / RuntimeOutcome
|   +-- HandoffAttempt / HandoffGap
|   `-- RuntimeStateRepositoryPort / FactHandoffPort [candidate]
|
+-- 7. External Truth Views
|   +-- ExternalTruthResolutionService
|   +-- SourceReference / SourceSnapshot / SourceAvailability
|   `-- Owner-specific Resolver Ports
|
`-- 8. Safe Runtime Views
    +-- SafeViewProjectionService
    +-- RuntimeStatusView / RuntimeOutcomeView
    `-- SafeMaterialAssembler / ProjectionContinuation
```

关键说明：
- 八个一级名称是业务主要组成部分，严格承接正式架构语境；二级名称是后续 Step 的代码主体候选，不是已实现类或目录。
- `[candidate / blocked]` 表示语义边界可命名，但正向 owner contract / schema / route 未闭口，不能声明可用。
- 图不表达代码文件、crate、调用顺序、物理持久化或部署拓扑。
- 外部 owner 只以 Port / Resolver 边界出现，不成为 Runtime 内部业务组成部分。

## 3. 实现分层视图

```text
External trigger / query / feedback / operations trigger
                         |
                         v
+----------------------------------------------------------+
| Inbound / Operations                                     |
| command acceptance | safe query | feedback | continuation|
+-----------------------------+----------------------------+
                              |
                              v
+----------------------------------------------------------+
| Application Services                                     |
| run | context | model | action | recovery | resolve | view|
+-----------------------------+----------------------------+
                              |
                              v
+----------------------------------------------------------+
| Domain Model                                             |
| controlled run | working context | decisions | checkpoint|
| outcome | handoff attempt/gap | source-use invariants     |
+-------------+-------------------------------+------------+
              |                               |
              v                               v
+---------------------------+   +---------------------------+
| Ports / Persistence       |   | Projection / Handoff      |
| state repo | owner ports  |   | safe views | material     |
| adapter / event candidates|   | continuation / local gap  |
+---------------------------+   +---------------------------+
```

关键说明：
- Inbound 只承接并验证输入，不拥有 local truth；Application 协调 use case；Domain 持有规则与状态语义。
- Ports / Persistence 表达依赖倒置和本地状态承载责任，不选择 DB、queue、protocol 或 provider。
- Projection / Handoff 只从 committed truth 派生，不反写 domain；外部 delivery / observed / accepted 保持独立。
- 实现分层横切八个业务组成部分，不能用分层名替代业务职责名。

## 4. 业务主要组成部分与实现分层关系

| 项 | 说明 |
|---|---|
| 业务主要组成部分 | 八个来自架构语境的业务结构主语，回答 Runtime “做什么语义、拥有什么边界”。 |
| Inbound / Operations | 放置 command / query / feedback / continuation 的入口承接骨架，回答输入如何进入 application。 |
| Application Services | 放置 use case coordination、提交边界选择和 port 调用编排，不拥有外部 truth。 |
| Domain Model | 放置 Runtime-owned truth、state、decision、policy / invariant、history 语义。 |
| Ports / Persistence | 放置 external owner dependency inversion 与 Runtime state carrier responsibility；不代表具体 adapter / DB 已实现。 |
| Projection / Handoff | 放置 safe views、safe material、local attempt / gap 和 continuation；无写源权。 |
| 二者关系 | 一个业务组成部分可以横跨多个实现分层；一个实现分层也会承载多个组成部分。前者按业务边界评审，后者按代码依赖责任评审。 |

## 5. 架构语境到主体类型映射

| 业务组成部分 | Inbound / Operations | Application | Domain | Ports / Persistence / Projection |
|---|---|---|---|---|
| Entry & Control | command / query acceptance | RuntimeControlService | acceptance / rejection decision candidate | principal / source resolver candidates |
| Run & Goal-Plan | run trigger / control | RunCoordinator | ControlledRun、GoalPlanWorkspace | RuntimeStateRepositoryPort |
| Context & Memory | composition request / continuation | ContextCompositionService | WorkingContext、WorkingMemory、source-use decision | SourceResolverPort、DurableMemoryPort candidate |
| Model Decision | model result feedback | ModelDecisionService | ModelIntent、ModelDecision、ModelTurn | ModelAdapterPort candidate |
| Action & Delegation | action / child feedback | ActionOrchestrationService | ActionDecision、Delegation、incorporation decision | Tools / Governance / Sandbox / Child Ports candidates |
| Checkpoint / Recovery / Handoff | resume / recovery / handoff continuation | RecoveryCoordinator | RuntimeCheckpoint、RecoveryDecision、RuntimeOutcome、HandoffAttempt / Gap | StateRepository / FactHandoff Ports candidates |
| External Truth Views | change / availability feedback | ExternalTruthResolutionService | SourceReference、Snapshot、Availability / Gap | owner-specific resolver ports |
| Safe Runtime Views | query / projection continuation | SafeViewProjectionService | safe projection semantics | RuntimeStatusView、OutcomeView、SafeMaterialAssembler |

## 6. 关键判断

- “Run & Goal-Plan”等八个名称是业务主要组成部分；“Inbound / Application / Domain / Ports / Projection”是实现分层，二者不得混用。
- `Service`、`Coordinator`、`Port`、`View` 只表明主体角色，不承诺面向对象语言、框架、进程或文件布局。
- `RuntimeStateRepositoryPort` 只表达本地 truth 必须有持久化抽象责任，不承诺数据库、事务、event sourcing 或 checkpoint 已可恢复。
- `FactHandoffPort`、Tools / Sandbox / Observability 等边界保持 candidate / blocked，直到 `L2R-UP-001~008` 对应 owner contract 闭口。
- 本 Step 不引入通用 `ExecutionInstance` 主聚合；ControlledRun 是否作为聚合根及其详细结构必须在 Step 5 / 6 从 capability / consistency 继续验证。

## 7. 回填草稿

正式第 4 章回填第 2、3 节两张 ASCII 图、第 4 节关系表和第 6 节关键判断。第 1、5 节的推导与映射明细留在 calibration，供 Step 5 逐部分展开。

## 8. 自检与门禁

| 检查 | 结果 |
|---|---|
| 两张必画图和关键说明齐全 | pass |
| 八业务组成部分承接正式架构且未增加外部系统为内部主体 | pass |
| 业务组成部分与实现分层明确分开 | pass |
| 必要 services / domain candidates / ports / views 已点名 | pass |
| pending ports 显式标 candidate / blocked | pass |
| 未写目录、文件、语言、完整 trait / struct、DB / API / topic | pass |
| 未提前创建 Step 5 文件或修改正式 02 | pass |

```text
gate_status = pass
next_allowed_action = create_02_hld_step_05_main_parts
formal_02_write_allowed = false
future_step_files_allowed = false_until_step_05_start
```
