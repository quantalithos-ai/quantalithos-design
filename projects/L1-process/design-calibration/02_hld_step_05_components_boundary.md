# Step 5. 主要组成部分、职责与边界

> 对应 SOP: `standards/document/概要设计讨论流程_SOP.md` Step 5
> 回填章节: `02-概要设计.md` §5 主要组成部分、职责与边界
> 生成日期: 2026-06-05
> 状态: 已完成

---

## 1. 本步目标

在 Step 4 已经区分业务主要组成部分与实现分层的基础上,收稳 `L1-process` 的主要组成部分、各自职责、不承担职责、包含的代码主体 / 模块和对象发现线索。

本步建立 Step 6 的对象候选池,但不展开对象字段、状态集合、成员函数、工厂函数、接口 schema、repository 函数或事务细节。

---

## 2. 本步输入

| 输入 | 状态 | 用途 |
|---|---|---|
| `02_hld_step_03_constraints.md` | 已完成 | 提供 Process truth、依赖裁剪、正文排除、派生只读和配置不可越界约束 |
| `02_hld_step_04_code_subject_framework.md` | 已完成 | 提供业务主要组成部分、代码主体骨架和实现分层区别 |
| `01-架构设计.md` §4 / §6 / §8 / §9 / §10 | 已完成 | 提供职责边界、上下文划分、依赖方向、数据所有权和通信方式 |
| 旧 `02-概要设计.md` | 未按最新 SOP 校准 | 作为旧对象线索和串层问题诊断输入 |

---

## 3. SOP 问题回答

### 3.1 当前概要设计层面,本仓应被划分为哪些主要组成部分?

当前概要设计层面,`L1-process` 划分为 10 个主要组成部分:

1. `Process truth core`
2. `Runtime shape management`
3. `Profile adoption management`
4. `Process execution management`
5. `Gate coordination`
6. `Checkpoint and recovery`
7. `Process timing and rhythm`
8. `Process consumption and traceability`
9. `Derived maintenance and reconciliation`
10. `External context mirror support`

这些是业务结构主语,不是代码目录、外部系统、类名或函数名。每个主要组成部分后续都可以跨越 Inbound、Application Services、Domain Model、Ports、Persistence、Projection、Outbox、Operations 等实现分层。

### 3.2 每个主要组成部分分别承担什么职责?

| 组成部分 | 核心职责 | 主要代码主体 | 不承担什么 |
|---|---|---|---|
| `Process truth core` | 保护过程执行事实统一 truth 边界、核心不变量、一致性和 outbox 成立口径 | `ProcessTruthPolicy`、`ProcessTruthRepository`、`ProcessOutboxRepository`、`ProcessAuditTrail` | 不定义 method-library、work、governance、artifact、runtime、identity、conversation、workspace、observability 或 archive truth |
| `Runtime shape management` | 从方法定义来源形成可执行过程形态和本地 runtime index | `ProcessShapeSyncService`、`RuntimeProcessShape`、`ShapeDefinitionPolicy`、`ProcessShapeRepository` | 不拥有 ProcessTemplateDef、TaskDefinition、RoleDefinition 或 Method Content 正文 |
| `Profile adoption management` | 表达项目采用、裁剪、切换后的过程语境 | `ProcessProfileCommandService`、`ProcessProfile`、`ProfileTailoringPolicy`、`ProcessProfileRepository` | 不拥有 Project truth、method-library profile definition truth 或 workspace view |
| `Process execution management` | 维护 ProcessInstance、Activity、Token / Gateway 的运行事实和推进边界 | `ProcessInstanceCommandService`、`ActivityProgressionService`、`ProcessInstance`、`Activity`、`Token`、`Gateway` | 不等同 WorkItem、Iteration、runtime step、agent plan item 或 tool call |
| `Gate coordination` | 表达 waiting gate、pause context、等待原因和正式恢复依据 | `WaitingGateCoordinationService`、`WaitingGate`、`PauseContext`、`WaitingGatePolicy`、`GovernanceDecisionPort` | 不生成、不替代 governance decision、Gate、Policy、Approval 或 Control truth |
| `Checkpoint and recovery` | 维护 Instance 级 checkpoint、恢复连续性和 recovery 不分叉 | `ProcessRecoveryService`、`ProcessCheckpoint`、`RecoveryAttempt`、`RecoveryContinuityPolicy`、`ProcessCheckpointRepository` | 不保存 runtime micro checkpoint、reasoning trace、archive package 或第二份过程真相 |
| `Process timing and rhythm` | 表达过程节奏、阶段和 timebox 语境 | `ProcessRhythmService`、`ProcessStageState`、`ProcessTimeboxBinding`、`ProcessRhythmPolicy` | 不拥有 Work Iteration truth、workspace sprint board 或 process planning 会议正文 |
| `Process consumption and traceability` | 提供授权查询、timeline、summary、审计复盘和 trace / archive 交接 | `AuthorizedProcessQueryService`、`ProcessTraceService`、`ProcessTraceRecord`、`ProcessAuditTrail`、`ArchiveHandoffPort` | 不拥有 workspace 聚合 truth、observability audit ledger、archive package 正文或 conversation 正文 |
| `Derived maintenance and reconciliation` | 维护 projection rebuild、snapshot refresh、reconciliation 和派生失败可见性 | `ProcessDerivedMaintenanceService`、`ProcessProjectionRebuildJob`、`ProcessReconciliationJob`、`DerivedProcessViewState` | 不生成新业务事实,不阻塞核心 truth 成立,不反写 Process truth |
| `External context mirror support` | 承载外部引用、摘要、快照、stale / unresolved / invalid marker | `ExternalContextSnapshotRefreshJob`、`ExternalContextSnapshotRepository`、`ReferenceResolutionState`、external seam ports | 不保存外部正文,不替代来源仓 lifecycle 或 truth |

### 3.3 哪些内容虽然相关,但必须由相邻部分或边界外能力承担?

| 相关内容 | 归属 | 本仓正确处理方式 |
|---|---|---|
| ProcessTemplateDef、TaskDefinition、RoleDefinition、WorkProductDefinition、ViewProfile、Method Content | `L3-method-library` | 保存 definition ref、版本摘要或 runtime shape index,不拥有定义正文 |
| Project、WorkItem、Iteration、Backlog truth | `L1-work` | 保存 work context ref / snapshot,不把过程阶段写成工作事实 |
| GlobalMember、actor lifecycle、role truth | `L1-identity` / `L0-core` | 保存 actor / member 引用和可承担摘要,不拥有身份生命周期 |
| Gate、Policy、Control、Approval、decision truth | `L1-governance` | 保存 decision ref、outcome marker 或等待恢复依据,不自造决策 |
| Artifact、Evidence、Baseline、ImplementationPlan 正文 | `L1-artifact` | 保存 artifact / evidence / baseline ref 或摘要,不保存正文 |
| runtime execution log、tool call、agent loop、micro checkpoint | `L2-runtime` / `L2-member-service` | 保存 Activity feedback summary / ref,不保存执行正文 |
| conversation fact、message body、process trace 显化正文 | `L1-conversation` | 保存 conversation context ref 或显化回链,不拥有 conversation truth |
| workspace dashboard / cross-domain progress view | `L1-workspace` | 提供只读 Process 事实或 projection,不拥有 workspace 聚合 truth |
| observability metrics、reasoning trace、audit ledger 正文 | `L4-observability` | 提供 trace / evidence handoff ref,不保存观测正文 |
| archive package / long-term archive body | `L4-archive` | 提供 snapshot / handoff ref,不保存 archive package 正文 |

### 3.4 哪些候选对象必须进入 Step 6 独立成节展开?

Step 6 必须从本步对象候选池中正式筛选并独立展开以下对象候选:

- truth / state:`RuntimeProcessShape`、`ProcessProfile`、`ProcessInstance`、`Activity`、`Token`、`Gateway`、`WaitingGate`、`PauseContext`、`ProcessCheckpoint`、`RecoveryAttempt`、`ProcessStageState`、`ProcessTimeboxBinding`、`DerivedProcessViewState`、`ReferenceResolutionState`
- policy / invariant:`ProcessTruthPolicy`、`ShapeDefinitionPolicy`、`ProfileTailoringPolicy`、`InstanceProgressionPolicy`、`ActivityFeedbackPolicy`、`GatewayRoutingPolicy`、`WaitingGatePolicy`、`RecoveryContinuityPolicy`、`ProcessRhythmPolicy`、`ReadVisibilityPolicy`、`DerivedProcessViewPolicy`
- projection / read model:`ProcessReadModel`、`ProcessTimelineView`、`ProcessProgressSummary`、`ActivityStatusView`、`ReconciliationReport`
- reference / boundary:`MethodDefinitionSnapshot`、`WorkContextSnapshot`、`ActorCapabilitySnapshot`、`GovernanceDecisionRef`、`RuntimeFeedbackRef`、`ConversationContextRef`、`TraceHandoffRef`
- audit / history:`ProcessTraceRecord`、`ProcessAuditTrail`、`ProcessOutboxRecord`、`ProfileChangeRecord`、`ActivityProgressionRecord`、`WaitingGateChangeRecord`、`RecoveryHistoryRecord`

Repository、port、adapter、trigger、DTO、HTTP body、CloudEvent schema、database table 和 job runner 不在 Step 6 当领域对象展开;它们后续进入 Step 7、Step 8 或详细设计。

---

## 4. 结构化中间产物

### 4.1 对象发现维度表

| 组成部分 | Truth / State | Policy / Invariant | Projection / Read model | Reference / Boundary | Audit / History | Step 6 必须独立展开 |
|---|---|---|---|---|---|---|
| `Process truth core` | unified process truth state 线索 | `ProcessTruthPolicy` | - | - | `ProcessAuditTrail`、`ProcessOutboxRecord` | `ProcessTruthPolicy`、`ProcessAuditTrail`、`ProcessOutboxRecord` |
| `Runtime shape management` | `RuntimeProcessShape` | `ShapeDefinitionPolicy` | shape index view 线索 | `MethodDefinitionSnapshot` | shape sync history 线索 | `RuntimeProcessShape`、`ShapeDefinitionPolicy`、`MethodDefinitionSnapshot` |
| `Profile adoption management` | `ProcessProfile` | `ProfileTailoringPolicy` | profile summary 线索 | project / method refs | `ProfileChangeRecord` | `ProcessProfile`、`ProfileTailoringPolicy`、`ProfileChangeRecord` |
| `Process execution management` | `ProcessInstance`、`Activity`、`Token`、`Gateway` | `InstanceProgressionPolicy`、`ActivityFeedbackPolicy`、`GatewayRoutingPolicy` | `ActivityStatusView` | work / runtime refs | `ActivityProgressionRecord` | `ProcessInstance`、`Activity`、`Token`、`Gateway`、`InstanceProgressionPolicy`、`ActivityFeedbackPolicy`、`GatewayRoutingPolicy` |
| `Gate coordination` | `WaitingGate`、`PauseContext` | `WaitingGatePolicy` | waiting gate view 线索 | `GovernanceDecisionRef` | `WaitingGateChangeRecord` | `WaitingGate`、`PauseContext`、`WaitingGatePolicy`、`GovernanceDecisionRef`、`WaitingGateChangeRecord` |
| `Checkpoint and recovery` | `ProcessCheckpoint`、`RecoveryAttempt` | `RecoveryContinuityPolicy` | recovery status view 线索 | checkpoint evidence refs | `RecoveryHistoryRecord` | `ProcessCheckpoint`、`RecoveryAttempt`、`RecoveryContinuityPolicy`、`RecoveryHistoryRecord` |
| `Process timing and rhythm` | `ProcessStageState`、`ProcessTimeboxBinding` | `ProcessRhythmPolicy` | rhythm summary 线索 | `ProcessTimeboxRef` / work timebox refs | rhythm change 线索 | `ProcessStageState`、`ProcessTimeboxBinding`、`ProcessRhythmPolicy` |
| `Process consumption and traceability` | trace state 线索 | `ReadVisibilityPolicy` | `ProcessReadModel`、`ProcessTimelineView`、`ProcessProgressSummary` | `TraceHandoffRef` | `ProcessTraceRecord` | `ProcessReadModel`、`ProcessTimelineView`、`ProcessProgressSummary`、`ReadVisibilityPolicy`、`ProcessTraceRecord` |
| `Derived maintenance and reconciliation` | `DerivedProcessViewState` | `DerivedProcessViewPolicy` | `ReconciliationReport` | projection source refs | rebuild / reconciliation history 线索 | `DerivedProcessViewState`、`DerivedProcessViewPolicy`、`ReconciliationReport` |
| `External context mirror support` | `ReferenceResolutionState` | reference validity 线索 | external context projection 线索 | `WorkContextSnapshot`、`ActorCapabilitySnapshot`、`RuntimeFeedbackRef`、`ConversationContextRef` | snapshot refresh history 线索 | `ReferenceResolutionState`、`WorkContextSnapshot`、`ActorCapabilitySnapshot`、`RuntimeFeedbackRef`、`ConversationContextRef` |

### 4.2 各部分交互总图

```text
+====================================================================+
|                      L1-process component flow                      |
+====================================================================+
|                                                                    |
|  Runtime shape management                                          |
|       | executable shape                                            |
|       v                                                            |
|  Profile adoption management                                       |
|       | adopted process context                                     |
|       v                                                            |
|  +---------------------+        +--------------------------------+  |
|  | Process truth core  |<-------| Process execution management   |  |
|  +----------+----------+        +---------------+----------------+  |
|             ^                                   |                   |
|             |                                   v                   |
|             |                         Gate coordination             |
|             |                                   |                   |
|             |                                   v                   |
|             |                         Checkpoint and recovery       |
|             |                                   |                   |
|             +------------ Process timing and rhythm                 |
|                                                                    |
|  Process consumption and traceability ---- handoff ----> sinks      |
|             ^                                                      |
|             | read / rebuild                                       |
|  Derived maintenance and reconciliation <---- External mirrors      |
|                                                                    |
+====================================================================+
```

关键说明:

- 图只表达主要组成部分之间的大体交互和交接方向,不表达协议字段、函数调用链、详细时序或数据库结构。
- `Process truth core` 是统一 truth 边界,但业务操作由 shape、profile、execution、gate、recovery、timing、trace 和 derived support 分别承接。
- Derived maintenance 和 External context mirrors 只能支撑读取、解释、对账、刷新和降级显示,不能反写真相。
- 图中 sinks 表示 SDK、conversation、workspace、observability、archive 等消费或交接方向,不是本仓内部主要组成部分。

---

## 5. 各主要组成部分

### 5.1 Process truth core

#### 5.1.1 本部分职责

维护 Process truth 的统一边界、不变量、一致性、审计和 outbox 成立口径。

#### 5.1.2 本部分包含的代码主体 / 模块

| 代码主体 / 模块 | 类型 | 作用 | 后续展开位置 |
|---|---|---|---|
| `ProcessTruthPolicy` | policy | 判断过程事实写入、传播和派生边界是否守住 truth 归属 | Step 6 |
| `ProcessTruthRepository` | persistence | 保存本仓核心 truth 的统一持久化入口骨架 | 详细设计 |
| `ProcessOutboxRepository` | persistence / outbox | 保存已成立 Process fact 的传播意图 | Step 7 / 详细设计 |
| `ProcessAuditTrail` | audit | 承载关键变化、判断和维护动作的审计线索 | Step 6 |
| `ProcessOutboxRecord` | event record | 记录 truth change 到 outbound event / handoff 的本地证据 | Step 6 |

#### 5.1.3 本部分对象发现线索

| 维度 | 候选对象 | Step 6 展开要求 |
|---|---|---|
| Policy / Invariant | `ProcessTruthPolicy` | Step 6 独立成节 |
| Audit / History | `ProcessAuditTrail` | Step 6 独立成节 |
| Audit / History | `ProcessOutboxRecord` | Step 6 独立成节 |

#### 5.1.4 本部分不承担什么

不定义 method-library、work、governance、artifact、runtime、identity、conversation、workspace、observability 或 archive 的 truth、正文或生命周期。

#### 5.1.5 与其他部分的接缝

接收 shape、profile、execution、gate、checkpoint、timing 等部分的已成立变化,为 consumption、traceability、derived maintenance 和 outbox 提供统一来源。

### 5.2 Runtime shape management

#### 5.2.1 本部分职责

从方法定义来源形成可执行过程形态、本地 runtime index 和定义来源可解释状态。

#### 5.2.2 本部分包含的代码主体 / 模块

| 代码主体 / 模块 | 类型 | 作用 | 后续展开位置 |
|---|---|---|---|
| `ProcessShapeSyncService` | application service | 编排方法定义来源同步和 runtime shape 成立 | Step 8 |
| `RuntimeProcessShape` | domain object | 表达可执行过程形态,不等于 method definition body | Step 6 |
| `ShapeDefinitionPolicy` | policy | 校验定义来源、版本和正文排除边界 | Step 6 |
| `ProcessShapeRepository` | persistence | 保存 runtime shape / index | 详细设计 |
| `MethodDefinitionPort` | port | 从 method-library 边界读取定义来源 ref / snapshot | Step 7 / 详细设计 |

#### 5.2.3 本部分对象发现线索

| 维度 | 候选对象 | Step 6 展开要求 |
|---|---|---|
| Truth / State | `RuntimeProcessShape` | Step 6 独立成节 |
| Policy / Invariant | `ShapeDefinitionPolicy` | Step 6 独立成节 |
| Reference / Boundary | `MethodDefinitionSnapshot` | Step 6 独立成节 |

#### 5.2.4 本部分不承担什么

不拥有 ProcessTemplateDef、TaskDefinition、RoleDefinition、WorkProductDefinition、ViewProfile 或 Method Content 正文。

#### 5.2.5 与其他部分的接缝

向 Profile adoption management 提供可采用的 runtime shape;通过 External context mirror support 承接 method definition snapshot / ref。

### 5.3 Profile adoption management

#### 5.3.1 本部分职责

表达项目采用、裁剪、切换后的过程语境,并保证 profile 依附确定的 runtime shape。

#### 5.3.2 本部分包含的代码主体 / 模块

| 代码主体 / 模块 | 类型 | 作用 | 后续展开位置 |
|---|---|---|---|
| `ProcessProfileCommandService` | application service | 编排 profile adopt / switch / retire | Step 8 |
| `ProcessProfile` | domain object | 表达项目采用和裁剪后的过程语境 | Step 6 |
| `ProfileTailoringPolicy` | policy | 判断裁剪、切换和高风险变化是否允许 | Step 6 |
| `ProcessProfileRepository` | persistence | 保存 profile truth | 详细设计 |
| `ProfileChangeRecord` | audit / history | 记录 profile 变化事实和来源 | Step 6 |

#### 5.3.3 本部分对象发现线索

| 维度 | 候选对象 | Step 6 展开要求 |
|---|---|---|
| Truth / State | `ProcessProfile` | Step 6 独立成节 |
| Policy / Invariant | `ProfileTailoringPolicy` | Step 6 独立成节 |
| Audit / History | `ProfileChangeRecord` | Step 6 独立成节 |

#### 5.3.4 本部分不承担什么

不拥有 Project truth、method-library profile definition truth、workspace view 或 governance approval truth。

#### 5.3.5 与其他部分的接缝

消费 Runtime shape management 的可执行形态;向 Process execution management 提供当前 profile 语境;高风险裁剪通过 governance ref / policy marker 协作。

### 5.4 Process execution management

#### 5.4.1 本部分职责

维护 ProcessInstance、Activity、Token / Gateway 的运行事实、推进位置和外部反馈承接口径。

#### 5.4.2 本部分包含的代码主体 / 模块

| 代码主体 / 模块 | 类型 | 作用 | 后续展开位置 |
|---|---|---|---|
| `ProcessInstanceCommandService` | application service | 编排实例开始、推进、暂停、恢复、结束或取消 | Step 8 |
| `ActivityProgressionService` | application service | 编排 Activity feedback 和节点推进 | Step 8 |
| `ProcessInstance` | domain object | 表达一次项目过程运行事实 | Step 6 |
| `Activity` | domain object | 表达过程节点和承担语境 | Step 6 |
| `Token` / `Gateway` | domain object | 表达过程流控位置和路径选择 | Step 6 |
| `InstanceProgressionPolicy` / `ActivityFeedbackPolicy` / `GatewayRoutingPolicy` | policy | 判断推进、反馈和路径选择是否合法 | Step 6 |

#### 5.4.3 本部分对象发现线索

| 维度 | 候选对象 | Step 6 展开要求 |
|---|---|---|
| Truth / State | `ProcessInstance`、`Activity`、`Token`、`Gateway` | Step 6 独立成节 |
| Policy / Invariant | `InstanceProgressionPolicy`、`ActivityFeedbackPolicy`、`GatewayRoutingPolicy` | Step 6 独立成节 |
| Projection / Read model | `ActivityStatusView` | Step 6 独立成节 |
| Audit / History | `ActivityProgressionRecord` | Step 6 独立成节 |

#### 5.4.4 本部分不承担什么

不等同 WorkItem、Iteration、runtime step、agent plan item、tool call、container lifecycle 或 execution log。

#### 5.4.5 与其他部分的接缝

消费 profile 语境;在等待点交给 Gate coordination;在恢复点交给 Checkpoint and recovery;向 timing、trace、derived maintenance 和 outbox 输出已成立过程事实。

### 5.5 Gate coordination

#### 5.5.1 本部分职责

表达 waiting gate、pause context、等待原因和正式恢复依据,并保护 waiting gate 不成为治理决策第二真相。

#### 5.5.2 本部分包含的代码主体 / 模块

| 代码主体 / 模块 | 类型 | 作用 | 后续展开位置 |
|---|---|---|---|
| `WaitingGateCoordinationService` | application service | 编排等待建立、外部依据解析和恢复触发 | Step 8 |
| `WaitingGate` | domain object | 表达过程等待意图和等待状态 | Step 6 |
| `PauseContext` | domain object | 保留等待原因、关联节点和恢复语境 | Step 6 |
| `WaitingGatePolicy` | policy | 判断等待、恢复和外部依据是否有效 | Step 6 |
| `GovernanceDecisionPort` | port | 从 governance 边界解析正式 decision ref / outcome | Step 7 / 详细设计 |

#### 5.5.3 本部分对象发现线索

| 维度 | 候选对象 | Step 6 展开要求 |
|---|---|---|
| Truth / State | `WaitingGate`、`PauseContext` | Step 6 独立成节 |
| Policy / Invariant | `WaitingGatePolicy` | Step 6 独立成节 |
| Reference / Boundary | `GovernanceDecisionRef` | Step 6 独立成节 |
| Audit / History | `WaitingGateChangeRecord` | Step 6 独立成节 |

#### 5.5.4 本部分不承担什么

不生成、不替代 governance Gate、Policy、Control、Approval 或 decision truth;不通过后台静默恢复绕过正式依据。

#### 5.5.5 与其他部分的接缝

从 Process execution management 接收等待点;通过 External context mirror support 解析 governance ref;恢复成功后把推进语境交还 execution 和 recovery。

### 5.6 Checkpoint and recovery

#### 5.6.1 本部分职责

维护 Instance 级 checkpoint、恢复连续性、恢复尝试和 recovery 不分叉边界。

#### 5.6.2 本部分包含的代码主体 / 模块

| 代码主体 / 模块 | 类型 | 作用 | 后续展开位置 |
|---|---|---|---|
| `ProcessRecoveryService` | application service | 编排 checkpoint、恢复判断和恢复结果记录 | Step 8 |
| `RecoveryMaintenanceJob` | operations job | 处理恢复维护、重试或挂起解释 | Step 7 / Step 8 |
| `ProcessCheckpoint` | domain object | 表达 Instance 级恢复事实 | Step 6 |
| `RecoveryAttempt` | domain object | 表达一次恢复尝试和结果 | Step 6 |
| `RecoveryContinuityPolicy` | policy | 判断是否保持同一 Process truth 连续 | Step 6 |

#### 5.6.3 本部分对象发现线索

| 维度 | 候选对象 | Step 6 展开要求 |
|---|---|---|
| Truth / State | `ProcessCheckpoint`、`RecoveryAttempt` | Step 6 独立成节 |
| Policy / Invariant | `RecoveryContinuityPolicy` | Step 6 独立成节 |
| Audit / History | `RecoveryHistoryRecord` | Step 6 独立成节 |

#### 5.6.4 本部分不承担什么

不保存 runtime micro checkpoint、reasoning trace、archive package、execution body 或第二份 ProcessInstance truth。

#### 5.6.5 与其他部分的接缝

围绕 Process execution management 的同一实例链工作;关键恢复动作进入 Process traceability;恢复失败暴露给 derived maintenance 和 consumption。

### 5.7 Process timing and rhythm

#### 5.7.1 本部分职责

表达过程节奏、阶段、timebox 语境和 rhythm fact,并保护它不接管 Work Iteration truth。

#### 5.7.2 本部分包含的代码主体 / 模块

| 代码主体 / 模块 | 类型 | 作用 | 后续展开位置 |
|---|---|---|---|
| `ProcessRhythmService` | application service | 编排阶段 / 节奏语境变化 | Step 8 |
| `ProcessStageState` | domain object | 表达过程阶段和阶段状态 | Step 6 |
| `ProcessTimeboxBinding` | domain object | 表达过程 timebox 与外部 timebox / iteration 引用的绑定 | Step 6 |
| `ProcessRhythmPolicy` | policy | 判断节奏变化和 timebox 绑定是否允许 | Step 6 |
| `ProcessTimeboxRef` | reference | 指向过程时间盒语境 | Step 6 |

#### 5.7.3 本部分对象发现线索

| 维度 | 候选对象 | Step 6 展开要求 |
|---|---|---|
| Truth / State | `ProcessStageState`、`ProcessTimeboxBinding` | Step 6 独立成节 |
| Policy / Invariant | `ProcessRhythmPolicy` | Step 6 独立成节 |
| Reference / Boundary | `ProcessTimeboxRef` | Step 6 独立成节 |

#### 5.7.4 本部分不承担什么

不拥有 Work Iteration truth、workspace sprint board、planning 会议正文、review 会议正文或任务承诺全集。

#### 5.7.5 与其他部分的接缝

从 Profile 和 Execution 读取过程阶段语境;通过 Work context snapshot 引用外部 Iteration / timebox;向 consumption 和 traceability 提供可解释节奏事实。

### 5.8 Process consumption and traceability

#### 5.8.1 本部分职责

提供授权查询、timeline、progress summary、审计复盘、过程事实追溯和 trace / archive 交接。

#### 5.8.2 本部分包含的代码主体 / 模块

| 代码主体 / 模块 | 类型 | 作用 | 后续展开位置 |
|---|---|---|---|
| `AuthorizedProcessQueryService` | application service | 编排授权查询和 read model 返回 | Step 7 / Step 8 |
| `ProcessTraceService` | application service | 编排追溯材料和 handoff | Step 8 |
| `ProcessReadModel` | projection / read model | 提供当前过程事实读取面 | Step 6 |
| `ProcessTimelineView` | projection / read model | 提供过程 timeline 读取面 | Step 6 |
| `ProcessProgressSummary` | projection / read model | 提供进度摘要读取面 | Step 6 |
| `ProcessTraceRecord` | audit / history | 记录关键变化和维护动作解释 | Step 6 |

#### 5.8.3 本部分对象发现线索

| 维度 | 候选对象 | Step 6 展开要求 |
|---|---|---|
| Projection / Read model | `ProcessReadModel`、`ProcessTimelineView`、`ProcessProgressSummary` | Step 6 独立成节 |
| Policy / Invariant | `ReadVisibilityPolicy` | Step 6 独立成节 |
| Reference / Boundary | `TraceHandoffRef` | Step 6 独立成节 |
| Audit / History | `ProcessTraceRecord` | Step 6 独立成节 |

#### 5.8.4 本部分不承担什么

不拥有 workspace 聚合 truth、全局 metrics、observability audit ledger、conversation 正文或 archive package 正文。

#### 5.8.5 与其他部分的接缝

读取 Process truth core 和 derived views;向 SDK、conversation、workspace、observability、archive 提供受控消费或交接。

### 5.9 Derived maintenance and reconciliation

#### 5.9.1 本部分职责

维护 projection rebuild、snapshot refresh、reconciliation、派生失败可见性和维护 evidence。

#### 5.9.2 本部分包含的代码主体 / 模块

| 代码主体 / 模块 | 类型 | 作用 | 后续展开位置 |
|---|---|---|---|
| `ProcessDerivedMaintenanceService` | application service | 编排派生维护和对账 | Step 8 |
| `ProcessProjectionRebuildJob` | operations job | 重建 read model / timeline / summary | Step 7 / Step 8 |
| `ProcessReconciliationJob` | operations job | 检查 truth、projection 和外部 snapshot 一致解释 | Step 7 / Step 8 |
| `DerivedProcessViewState` | domain / projection state | 表达派生视图 fresh / stale / rebuilding / failed 等状态 | Step 6 |
| `DerivedProcessViewPolicy` | policy | 判断派生结果可读、需重建或失败可见口径 | Step 6 |
| `ReconciliationReport` | report / evidence | 表达对账结果和维护证据 | Step 6 |

#### 5.9.3 本部分对象发现线索

| 维度 | 候选对象 | Step 6 展开要求 |
|---|---|---|
| Truth / State | `DerivedProcessViewState` | Step 6 独立成节 |
| Policy / Invariant | `DerivedProcessViewPolicy` | Step 6 独立成节 |
| Projection / Read model | `ReconciliationReport` | Step 6 独立成节 |
| Audit / History | rebuild / reconciliation history 线索 | Step 6 筛选 |

#### 5.9.4 本部分不承担什么

不生成新业务事实,不阻塞核心 truth 成立,不通过修复 projection 推进、暂停、恢复、完成或取消 Process truth。

#### 5.9.5 与其他部分的接缝

从 Process truth core、Process consumption 和 External context mirror support 读取重建来源;向 consumption 暴露 stale / rebuilding / failed 等派生状态。

### 5.10 External context mirror support

#### 5.10.1 本部分职责

承载外部引用、摘要、快照、解析状态和 stale / unresolved / invalid marker,为核心判断和派生消费提供可解释外部语境。

#### 5.10.2 本部分包含的代码主体 / 模块

| 代码主体 / 模块 | 类型 | 作用 | 后续展开位置 |
|---|---|---|---|
| `ExternalContextSnapshotRefreshJob` | operations job | 刷新外部上下文 snapshot / ref 状态 | Step 7 / Step 8 |
| `ExternalContextSnapshotRepository` | persistence / snapshot | 保存外部快照和解析状态 | 详细设计 |
| `ReferenceResolutionState` | domain / marker | 表达 resolved / unresolved / stale / invalid 等引用状态 | Step 6 |
| `WorkContextSnapshot` | snapshot | 表达项目、工作或 iteration 语境摘要 | Step 6 |
| `ActorCapabilitySnapshot` | snapshot | 表达 actor / member 可承担摘要 | Step 6 |
| `RuntimeFeedbackRef` / `ConversationContextRef` | reference | 表达外部反馈或上下文引用 | Step 6 |

#### 5.10.3 本部分对象发现线索

| 维度 | 候选对象 | Step 6 展开要求 |
|---|---|---|
| Truth / State | `ReferenceResolutionState` | Step 6 独立成节 |
| Reference / Boundary | `WorkContextSnapshot`、`ActorCapabilitySnapshot`、`RuntimeFeedbackRef`、`ConversationContextRef` | Step 6 独立成节或筛选 |
| Audit / History | snapshot refresh history 线索 | Step 6 筛选 |

#### 5.10.4 本部分不承担什么

不保存外部正文,不替代 method-library、work、identity、governance、artifact、runtime、conversation、observability 或 archive 的 truth / lifecycle。

#### 5.10.5 与其他部分的接缝

为 shape、profile、execution、gate、timing、consumption 和 maintenance 提供外部 ref / snapshot / marker;外部缺失或过期必须显式暴露为 unresolved / stale / invalid。

---

## 6. 总体边界说明与 Step 6 门禁

- Step 5 的对象发现线索只是候选池,不等于最终对象定义。
- Step 6 必须从本文件 §4.1 和 §5 逐项筛选正式关键对象。
- API、repository、port、trigger、DTO、数据库表、HTTP 请求体和 job runner 默认不作为 Step 6 领域对象展开。
- 如果 Step 8 处理流或 Step 9 状态机使用了某个对象,必须能在 Step 6 找到正式对象骨架。
- 如果某个候选对象只是字段类型或外部 ref,Step 6 必须说明它是独立 value object、shared ref,还是留给详细设计字段 schema。

---

## 7. 当前文档问题诊断

| 旧 `02-概要设计.md` 内容 | 问题 | 本轮处理 |
|---|---|---|
| Template / Profile / Instance / Activity 直接作为解释主线 | 缺少主要组成部分和对象发现维度 | 改为 10 个业务组成部分,再沉淀对象候选池 |
| planning / refinement / review / retro / gate entry 被写成节奏教学 | 容易让 Process 接管 Work Iteration、governance decision 或 meeting body | 单列 Process timing / rhythm 和 Gate coordination,并明确非职责 |
| checkpoint / recovery 与 runtime checkpoint / archive trace 解释混杂 | 容易让恢复链路保存执行正文或归档正文 | 单列 Checkpoint and recovery,并声明只维护同一 Process truth 连续性 |
| timeline、trace、progress summary 和报告混入核心主线 | 派生能力容易成为第二 truth | 单列 consumption / traceability 和 derived maintenance,并声明只读可重建 |
| 外部仓线索混入 Process 内部对象 | 容易打穿数据归属 | 用 External context mirror support 限定为引用、快照和解析状态 |

---

## 8. 回填草稿

正式 `02-概要设计.md` 后续整理时:

- §5 “主要组成部分、职责与边界”引用本文件 §3.2 的组成部分总表和 §4.1 的对象发现维度表。
- §5 引用本文件 §4.2 的各部分交互总图。
- §5 按本文件 §5 的 10 个主要组成部分生成正式章节。
- Step 6 “关键对象轮廓”必须引用本文件 §6 的门禁,从对象候选池正式筛选。

---

## 9. 待确认事项

### 9.1 待确认项处理建议

| 待确认项 | 备选方案 | 推荐方案 | 推荐理由 | 当前状态 |
|---|---|---|---|---|
| `Process timing and rhythm` 是否保持独立组成部分 | A. 独立;B. 并入 execution;C. 并入 work iteration | A | 它是正式 Process 事实且容易和 Work Iteration 混淆,独立说明更能防止串线 | 已确认采用 A |
| `External context mirror support` 是否保持独立组成部分 | A. 独立;B. 并入 derived maintenance;C. 不列为组成部分 | A | 它服务核心判断和派生解释,跨越多个外部来源,需要统一正文排除和 marker 边界 | 已确认采用 A |
| Step 6 是否展开所有 snapshot / ref | A. 全部展开;B. 只展开会承载状态、policy、projection 或跨流程关键 ref 的对象;C. 全部留给详细设计 | B | 避免把字段类型、port 输入和外部 DTO 误写成关键对象 | 推荐采用 B |

### 9.2 本 Step 未确认事项

本步不新增阻塞 Step 6 的待确认事项。Step 6 需要从候选池中筛选正式关键对象,并对仅作为字段类型、DTO、port 或 repository 的名称做剔除说明。

---

## 10. 进入下一步条件

- 已明确本仓由哪些主要组成部分构成、各自承担什么和不承担什么。
- 已明确各组成部分包含哪些代码主体 / 模块,且后续展开位置没有悬空。
- 已形成对象发现维度表和每个组成部分的对象发现线索。
- 对象字段、状态、成员函数和工厂函数细节仍保留给 Step 6 独立展开。
