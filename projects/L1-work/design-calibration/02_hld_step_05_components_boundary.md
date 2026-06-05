# Step 5. 主要组成部分、职责与边界

> 对应 SOP: `standards/document/概要设计讨论流程_SOP.md` Step 5
> 回填章节: `02-概要设计.md` §5 主要组成部分、职责与边界
> 生成日期: 2026-06-03
> 状态: 已完成

---

## 1. 本步目标

在 Step 4 已经区分业务主要组成部分与实现分层的基础上,收稳 `L1-work` 的主要组成部分、各自职责、不承担职责、包含的代码主体 / 模块和对象发现线索。

本步建立 Step 6 的对象候选池,但不展开对象字段、状态集合、成员函数、工厂函数、接口 schema、repository 函数或事务细节。

---

## 2. 本步输入

| 输入 | 状态 | 用途 |
|---|---|---|
| `02_hld_step_03_constraints.md` | 已完成 | 提供 Work truth、正式工作全集、promote、派生只读和配置不可越界约束 |
| `02_hld_step_04_code_subject_framework.md` | 已完成 | 提供业务主要组成部分、代码主体骨架和实现分层区别 |
| `01-架构设计.md` §4 / §6 / §8 / §9 / §10 | 已完成 | 提供职责边界、上下文划分、依赖方向、数据所有权和通信方式 |
| 旧 `02-概要设计.md` | 未按最新 SOP 校准 | 作为旧对象线索和串层问题诊断输入 |

---

## 3. SOP 问题回答

### 3.1 当前概要设计层面，本仓应被划分为哪些主要组成部分？

当前概要设计层面,`L1-work` 划分为 10 个主要组成部分:

1. `Work truth core`
2. `Project subject management`
3. `Project member responsibility`
4. `Formal work universe`
5. `Work decomposition / promote boundary`
6. `Dependency / blocker coordination`
7. `Iteration commitment`
8. `Work consumption / trace`
9. `Derived consumption support`
10. `Local reference / snapshot / projection support`

这些是业务结构主语,不是代码目录、外部系统、类名或函数名。每个主要组成部分后续都可以跨越 Inbound、Application Services、Domain Model、Ports、Persistence、Projection、Outbox、Operations 等实现分层。

### 3.2 每个主要组成部分分别承担什么职责？

| 组成部分 | 核心职责 | 主要代码主体 | 不承担什么 |
|---|---|---|---|
| `Work truth core` | 保护项目工作事实统一 truth 边界、核心不变量、一致性和 outbox 成立口径 | `WorkTruthPolicy`、`WorkTruthRepository`、`WorkOutboxRepository`、`WorkAuditTrail` | 不定义 identity、conversation、process、artifact、runtime、workspace 或 archive truth |
| `Project subject management` | 让软件项目作为正式工作对象成立、关闭、归档和被引用 | `ProjectCommandService`、`Project`、`ProjectLifecyclePolicy`、`ProjectRepository` | 不拥有 workspace project view、process instance 或 runtime context |
| `Project member responsibility` | 表达 GlobalMember 在项目内的承担事实、状态和可承担性 | `ProjectMemberCommandService`、`ProjectMember`、`MemberResponsibilityPolicy`、`MemberReferencePort` | 不拥有 GlobalMember 生命周期、role truth 或工具权限裁决 |
| `Formal work universe` | 维护 Backlog、WorkItem、child WorkItem 的正式工作全集 | `WorkItemCommandService`、`Backlog`、`WorkItem`、`ChildWorkItem`、`FormalWorkPolicy`、`BacklogAvailabilityPolicy` | 不吸收个人 checklist、PlanItem、tool step、chat suggestion 或 runtime step |
| `Work decomposition / promote boundary` | 将外部建议、计划项或执行步骤显式升级为正式工作 | `WorkFormalizationService`、`PromotePolicy`、`PromoteResult`、`SourceWorkRef`、`PromoteSourceResolverPort` | 不拥有 ImplementationPlan 正文、artifact body 或 runtime progress |
| `Dependency / blocker coordination` | 表达正式工作之间依赖、阻塞、解除依据和影响解释 | `DependencyBlockerService`、`WorkDependency`、`WorkBlocker`、`DependencyGraphPolicy` | 不生成治理裁决、不保存证据正文、不形成不可解释关系 |
| `Iteration commitment` | 从正式工作全集中形成当前承诺范围 | `IterationCommitmentService`、`Iteration`、`IterationCommitment`、`IterationCommitmentPolicy` | 不等同 Backlog 全集、process planning、review 节奏或 board sprint view |
| `Work consumption / trace` | 提供授权查询、相邻仓消费、审计复盘和追溯交接 | `AuthorizedWorkQueryService`、`WorkTraceService`、`WorkTraceRecord`、`ArchiveHandoffPort` | 不拥有全局观测日志、长期归档包正文或 workspace 聚合 truth |
| `Derived consumption support` | 维护看板、投影、任务摘要、对账和维护报告 | `WorkDerivedMaintenanceService`、`WorkProjectionRebuildJob`、`DerivedWorkViewState`、`WorkProjectionRepository` | 不生成新业务事实,不阻塞核心 truth 成立 |
| `Local reference / snapshot / projection support` | 承载外部引用、展示快照、解析状态和本地影子投影 | `ExternalReferenceRefreshJob`、`ExternalReferenceSnapshotRepository`、`ReferenceResolutionState` | 不保存外部正文,不替代来源仓 truth |

### 3.3 哪些内容虽然相关，但必须由相邻部分或边界外能力承担？

| 相关内容 | 归属 | 本仓正确处理方式 |
|---|---|---|
| GlobalMember、role、actor 生命周期 | `L1-identity` / `L0-core` | 保存 actor / member 引用和项目内承担事实 |
| conversation fact、chat suggestion、trace / handoff 正文 | `L1-conversation` | 只保存 conversation context 引用、来源摘要或 promote 来源引用 |
| TaskDefinition、WorkProductDefinition、ProcessTemplate、ViewProfile | `L3-method-library` | 保存定义引用或目录级快照 |
| process planning、review、Activity、checkpoint | `L1-process` | 只作为节奏、候选或引用输入,不得维护 Backlog truth |
| Gate、Policy、Control、Approval 裁决 | `L1-governance` | 只保存治理结论引用或摘要 |
| Artifact、evidence、baseline、ImplementationPlan 正文 | `L1-artifact` | 只保存完成依据、promote 来源或摘要引用 |
| agent loop、tool invocation、runtime progress | `L2-runtime` | 只接收明确 promote 需求或正式执行上下文引用 |
| workspace board、project view、dashboard 聚合 | `L1-workspace` | 只消费 Work truth 或派生视图 |

### 3.4 哪些候选对象必须进入 Step 6 独立成节展开？

Step 6 必须从本步对象候选池中正式筛选并独立展开以下对象候选:

- truth / state: `Project`、`ProjectMember`、`Backlog`、`WorkItem`、`ChildWorkItem`、`WorkDependency`、`WorkBlocker`、`Iteration`、`IterationCommitment`、`PromoteResult`、`DerivedWorkViewState`、`ReferenceResolutionState`
- policy / invariant: `WorkTruthPolicy`、`ProjectLifecyclePolicy`、`MemberResponsibilityPolicy`、`FormalWorkPolicy`、`BacklogAvailabilityPolicy`、`PromotePolicy`、`DependencyGraphPolicy`、`IterationCommitmentPolicy`、`CompletionEvidencePolicy`、`DerivedWorkViewPolicy`
- projection / read model: `ProjectBoardView`、`MemberWorkView`、`IterationSummaryView`、`WorkSearchProjection`、`ReconciliationReport`
- reference / boundary: `SourceWorkRef`、`ExternalEvidenceRef`、`MemberCapabilitySnapshot`、`MethodDefinitionSnapshot`
- audit / history: `WorkTraceRecord`、`WorkAuditTrail`、`WorkOutboxRecord`、`PromoteDecisionRecord`、`DependencyChangeRecord`、`IterationChangeRecord`

Repository、port、adapter、trigger、DTO、HTTP body、CloudEvent schema、database table 和 job runner 不在 Step 6 当领域对象展开;它们后续进入 Step 7、Step 8 或详细设计。

---

## 4. 结构化中间产物

### 4.1 对象发现维度表

| 组成部分 | Truth / State | Policy / Invariant | Projection / Read model | Reference / Boundary | Audit / History | Step 6 必须独立展开 |
|---|---|---|---|---|---|---|
| `Work truth core` | unified truth state 线索 | `WorkTruthPolicy` | - | - | `WorkAuditTrail`、`WorkOutboxRecord` | `WorkTruthPolicy`、`WorkAuditTrail`、`WorkOutboxRecord` |
| `Project subject management` | `Project` | `ProjectLifecyclePolicy` | project summary 线索 | project external refs | project change 线索 | `Project`、`ProjectLifecyclePolicy` |
| `Project member responsibility` | `ProjectMember` | `MemberResponsibilityPolicy` | member work view 线索 | `MemberCapabilitySnapshot` | responsibility change 线索 | `ProjectMember`、`MemberResponsibilityPolicy`、`MemberCapabilitySnapshot` |
| `Formal work universe` | `Backlog`、`WorkItem`、`ChildWorkItem` | `FormalWorkPolicy`、`BacklogAvailabilityPolicy` | backlog view 线索 | method / conversation refs | work change 线索 | `Backlog`、`WorkItem`、`ChildWorkItem`、`FormalWorkPolicy`、`BacklogAvailabilityPolicy` |
| `Work decomposition / promote boundary` | `PromoteResult` | `PromotePolicy` | promote queue 线索 | `SourceWorkRef` | `PromoteDecisionRecord` | `PromoteResult`、`PromotePolicy`、`SourceWorkRef`、`PromoteDecisionRecord` |
| `Dependency / blocker coordination` | `WorkDependency`、`WorkBlocker` | `DependencyGraphPolicy`、`CompletionEvidencePolicy` | dependency view 线索 | `ExternalEvidenceRef` | `DependencyChangeRecord` | `WorkDependency`、`WorkBlocker`、`DependencyGraphPolicy`、`ExternalEvidenceRef`、`DependencyChangeRecord` |
| `Iteration commitment` | `Iteration`、`IterationCommitment` | `IterationCommitmentPolicy` | `IterationSummaryView` | process / governance refs | `IterationChangeRecord` | `Iteration`、`IterationCommitment`、`IterationCommitmentPolicy`、`IterationSummaryView` |
| `Work consumption / trace` | trace state 线索 | trace access policy 线索 | query view 线索 | archive / observability refs | `WorkTraceRecord` | `WorkTraceRecord` |
| `Derived consumption support` | `DerivedWorkViewState` | `DerivedWorkViewPolicy` | `ProjectBoardView`、`MemberWorkView`、`WorkSearchProjection`、`ReconciliationReport` | projection source refs | rebuild history 线索 | `DerivedWorkViewState`、`DerivedWorkViewPolicy`、`ProjectBoardView`、`MemberWorkView`、`WorkSearchProjection`、`ReconciliationReport` |
| `Local reference / snapshot / projection support` | `ReferenceResolutionState` | reference validity 线索 | external reference projection 线索 | `MethodDefinitionSnapshot`、source refs | refresh history 线索 | `ReferenceResolutionState`、`MethodDefinitionSnapshot` |

### 4.2 各部分交互总图

```text
+====================================================================+
|                        L1-work component flow                       |
+====================================================================+
|                                                                    |
|  Project subject management                                        |
|       | establishes project anchor                                  |
|       v                                                            |
|  +-------------------+        +----------------------------------+ |
|  | Work truth core   |<-------| Project member responsibility    | |
|  +---------+---------+        +----------------------------------+ |
|            ^                                                       |
|            | formal work belongs to project and members             |
|  +---------+---------+                                             |
|  | Formal work universe |<---- Work decomposition / promote         |
|  +---------+---------+                                             |
|            |                                                       |
|            +----> Dependency / blocker coordination                |
|            |                                                       |
|            +----> Iteration commitment                             |
|            |                                                       |
|            v                                                       |
|  Work consumption / trace ---- handoff ----> observability/archive  |
|            ^                                                       |
|            | read / rebuild                                        |
|  Derived consumption support <---- Local reference / snapshot       |
|                                                                    |
+====================================================================+
```

关键说明:

- 图只表达主要组成部分之间的大体交互和交接方向,不表达协议字段、函数调用链、详细时序或数据库结构。
- `Work truth core` 是中心边界,但业务操作通过 project、member、formal work、promote、dependency、iteration、trace 和 derived support 承接。
- Derived support 和 Local reference / snapshot support 只能支撑读取、解释、对账和降级显示,不能反写真相。
- Observability / Archive 只作为交接方向出现,不是本仓内部主要组成部分。

---

## 5. 各主要组成部分

### 5.1 Work truth core

职责:维护 Work truth 的统一边界、不变量、一致性和 outbox 成立口径。
代码主体: `WorkTruthPolicy`、`WorkTruthRepository`、`WorkOutboxRepository`、`WorkAuditTrail`、`WorkOutboxRecord`。
对象发现: truth 聚合线索由 Project / member / work / dependency / iteration 承担;`WorkTruthPolicy`、`WorkAuditTrail`、`WorkOutboxRecord` 进入 Step 6。
不承担:不定义 identity、conversation、process、artifact、runtime、workspace、archive truth。
接缝:接收所有核心组成部分的已成立变化,为消费、追溯、派生和 outbox 提供统一来源。

### 5.2 Project subject management

职责:让软件项目作为正式工作对象成立、关闭、归档和被引用。
代码主体: `ProjectCommandService`、`Project`、`ProjectLifecyclePolicy`、`ProjectRepository`。
对象发现: `Project` 和 `ProjectLifecyclePolicy` 进入 Step 6;project summary 留给 projection。
不承担:不拥有 workspace project view、process instance、runtime context 或 conversation topic。
接缝:向 Work truth core 提交 project truth;为 member、work item、iteration 和 trace 提供项目锚点。

### 5.3 Project member responsibility

职责:表达 GlobalMember 在项目内的承担事实、状态、可承担性和变化记录。
代码主体: `ProjectMemberCommandService`、`ProjectMember`、`MemberResponsibilityPolicy`、`MemberReferencePort`。
对象发现: `ProjectMember`、`MemberResponsibilityPolicy`、`MemberCapabilitySnapshot` 进入 Step 6。
不承担:不拥有 GlobalMember 生命周期、role truth、actor lifecycle 或工具权限裁决。
接缝:消费 identity / core 引用;为 work assignment、iteration commitment 和 authorized query 提供项目内承担边界。

### 5.4 Formal work universe

职责:维护 Backlog、WorkItem 和 child WorkItem 的正式工作全集和协作级任务边界。
代码主体: `WorkItemCommandService`、`Backlog`、`WorkItem`、`ChildWorkItem`、`FormalWorkPolicy`、`BacklogAvailabilityPolicy`、`WorkItemRepository`。
对象发现: `Backlog`、`WorkItem`、`ChildWorkItem`、`FormalWorkPolicy`、`BacklogAvailabilityPolicy` 进入 Step 6。
不承担:不吸收 personal checklist、PlanItem、tool step、runtime step 或 chat suggestion。
接缝:接收 project/member 边界和 promote 结果;向 dependency、iteration、trace、derived support 输出正式工作事实。

### 5.5 Work decomposition / promote boundary

职责:将外部建议、计划项或执行步骤显式升级为正式 WorkItem / child WorkItem,并保留来源与拒绝口径。
代码主体: `WorkFormalizationService`、`PromotePolicy`、`PromoteResult`、`SourceWorkRef`、`PromoteSourceResolverPort`。
对象发现: `PromoteResult`、`PromotePolicy`、`SourceWorkRef`、`PromoteDecisionRecord` 进入 Step 6。
不承担:不拥有 ImplementationPlan 正文、artifact body、runtime progress 或 conversation suggestion 正文。
接缝:从 conversation / artifact / runtime / process 等边界接收来源引用,只把显式升级结果交给 Formal work universe。

### 5.6 Dependency / blocker coordination

职责:表达正式工作之间依赖、阻塞、解除依据和影响解释。
代码主体: `DependencyBlockerService`、`WorkDependency`、`WorkBlocker`、`DependencyGraphPolicy`、`DependencyRepository`。
对象发现: `WorkDependency`、`WorkBlocker`、`DependencyGraphPolicy`、`ExternalEvidenceRef`、`DependencyChangeRecord` 进入 Step 6。
不承担:不生成 governance 裁决、不保存 evidence 正文、不把外部对象当成 Work truth。
接缝:读取 Formal work universe 的正式工作对象,引用 governance / artifact / process 依据,向 iteration 和 trace 输出影响解释。

### 5.7 Iteration commitment

职责:从正式工作全集中形成和维护当前承诺范围。
代码主体: `IterationCommitmentService`、`Iteration`、`IterationCommitment`、`IterationCommitmentPolicy`、`IterationRepository`。
对象发现: `Iteration`、`IterationCommitment`、`IterationCommitmentPolicy`、`IterationSummaryView`、`IterationChangeRecord` 进入 Step 6。
不承担:不等同 Backlog 全集、process planning、review activity 或 workspace board sprint view。
接缝:从 Formal work universe 选择候选,受 Project member responsibility 和 Dependency / blocker coordination 影响,向 consumption / trace 输出承诺事实。

### 5.8 Work consumption / trace

职责:提供授权查询、相邻仓消费、审计复盘、工作事实追溯和归档 / 观测交接。
代码主体: `AuthorizedWorkQueryService`、`WorkTraceService`、`WorkTraceRecord`、`ArchiveHandoffPort`、`ObservabilityHandoffPort`。
对象发现: `WorkTraceRecord` 进入 Step 6;query DTO、handoff port 和 read model 留给 Step 7 / 详细设计。
不承担:不拥有 workspace 聚合 truth、全局 metrics、全局日志或长期归档包正文。
接缝:读取 Work truth core 和 derived views,向 SDK、workspace、archive、observability 提供受控消费或交接。

### 5.9 Derived consumption support

职责:维护看板、投影、任务摘要、成员工作视图、搜索索引、对账结果和维护报告。
代码主体: `WorkDerivedMaintenanceService`、`WorkProjectionRebuildJob`、`DerivedWorkViewState`、`WorkProjectionRepository`。
对象发现: `DerivedWorkViewState`、`DerivedWorkViewPolicy`、`ProjectBoardView`、`MemberWorkView`、`WorkSearchProjection`、`ReconciliationReport` 进入 Step 6。
不承担:不生成新业务事实,不阻塞核心 truth 成立,不决定任务状态。
接缝:从 Work truth core 和 Local reference / snapshot support 重建派生视图,向 consumption 提供只读结果。

### 5.10 Local reference / snapshot / projection support

职责:承载外部引用、展示快照、解析状态和本地影子投影。
代码主体: `ExternalReferenceRefreshJob`、`ExternalReferenceSnapshotRepository`、`ReferenceResolutionState`、member / method / conversation / process / governance / artifact / runtime adapters。
对象发现: `ReferenceResolutionState`、`MethodDefinitionSnapshot`、`MemberCapabilitySnapshot` 进入 Step 6;其他 source refs 按字段类型或详细设计处理。
不承担:不保存外部正文,不替代来源仓生命周期或 truth。
接缝:为 promote、dependency、iteration、consumption、derived support 提供引用解析、旧快照和未解析状态。

---

## 6. 总体边界说明与 Step 6 门禁

- Step 5 的对象发现线索只是候选池,不等于最终对象定义。
- Step 6 必须从本文件 §4.1 和 §5 逐项筛选正式关键对象。
- API、repository、port、trigger、DTO、数据库表、HTTP 请求体和 job runner 默认不作为 Step 6 领域对象展开。
- 如果 Step 8 处理流或 Step 9 状态机使用了某个对象,必须能在 Step 6 找到正式对象骨架。

---

## 7. 当前文档问题诊断

| 旧 `02-概要设计.md` 内容 | 问题 | 本轮处理 |
|---|---|---|
| Project / Backlog / WorkItem / Iteration 直接作为解释主线 | 缺少主要组成部分和对象发现维度 | 改为 10 个业务组成部分,再沉淀对象候选池 |
| ImplementationPlan 与 WorkItem 边界反复解释 | 容易让 Work 拥有执行计划正文 | 独立成 promote boundary,只承接显式升级结果和来源引用 |
| 看板、投影和报告混入核心主线 | 派生能力容易成为第二 truth | 独立为 Derived consumption support,并声明只读可重建 |
| 外部仓线索混入 Work 内部对象 | 容易打穿数据归属 | 用 Local reference / snapshot support 限定为引用、快照和解析状态 |

---

## 8. 回填草稿

正式 `02-概要设计.md` 后续整理时:

- §5 “主要组成部分、职责与边界”引用本文件 §3.2 的组成部分总表和 §4.1 的对象发现维度表。
- §5 引用本文件 §4.2 的各部分交互总图。
- §5 按本文件 §5 的 10 个主要组成部分生成正式章节。
- Step 6 “关键对象轮廓”必须引用本文件 §6 的门禁,从对象候选池正式筛选。

---

## 9. 进入下一步条件

- 已明确本仓由哪些主要组成部分构成、各自承担什么和不承担什么。
- 已明确各组成部分包含哪些代码主体 / 模块,且后续展开位置没有悬空。
- 已形成对象发现维度表和每个组成部分的对象发现线索。
- 对象字段、状态、成员函数和工厂函数细节仍保留给 Step 6 独立展开。
