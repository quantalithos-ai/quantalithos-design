# Step 7. API / 接口骨架

> 对应 SOP: `standards/document/概要设计讨论流程_SOP.md` Step 7
> 回填章节: `02-概要设计.md` §7 API / 接口骨架
> 生成日期: 2026-07-08
> 状态: completed_wait_user_review
> 所属流程: `02_hld_calibration_flow.md`
> 本 Step 口径: 从 Step 5 主要组成部分、Step 6 关键对象和新版 `00/01` 的交互 / 数据边界中收敛正式接口骨架;只点名 Command、Query、Inbound Event Consumer、Outbound Event、Operations Job 和 external / infrastructure port 的输入输出骨架、读写性质、主要处理与边界,不写 HTTP path、RPC / SDK 方法、topic、完整 DTO / event schema、repository 函数、事务、错误码、配置或测试。

---

## 1. Step 开工确认

| 检查项 | 结论 |
|---|---|
| 用户是否已确认进入 Step 7 | 是。用户在 Step 6 审查点后回复“同意”,允许进入 Step 7。 |
| 项目级台账是否允许进入 Step 7 | 是。`project_execution_ledger.md` 记录 Step 6 已完成并等待用户确认,用户确认后允许进入 Step 7。 |
| 文档级 flow 是否允许进入 Step 7 | 是。`02_hld_calibration_flow.md` 记录 Step 7 `blocked_by_step_6_review`,用户确认后可进入。 |
| 是否已读取 Step 6 主控文件和对象附录 | 是。Step 6 提供正式关键对象、对象能力、Step 8 / Step 9 反查清单和 ports / API 后移口径。 |
| 是否已读取概要 SOP Step 7 | 是。Step 7 必须输出接口分类说明、按主要组成部分组织的接口骨架表、五类接口骨架表、接口归属停审记录和跨接口一致性审计。 |
| 是否已读取概要书写规范 §4.7 | 是。正式 §7 必须按 Command / Query / Inbound Event Consumer / Outbound Event / Operations Job 分类;本轮额外记录 external / infrastructure port 骨架,用于承接 sandbox 的关键运行接缝。 |
| 是否发现阻塞 Step 7 的上游 blocker | 否。backend 组合、policy 来源矩阵、handoff ack 协议、material retention、failure taxonomy、profile、SLO、DB / object store / event bus 产品仍是后续待确认,不阻塞概要接口骨架。 |

---

## 2. 本步目标

本步把 `L4-sandbox` 已收稳的主要组成部分和关键对象转成后续 Step 8 flow、Step 9 状态机和 `03-详细设计.md` 可以继续展开的正式接口骨架。

本步要回答:

- 哪些用例入口会改写 execution isolation truth、capture / handoff truth、failure / cleanup / redline truth。
- 哪些读取入口只返回 projection、status view、summary view、audit trace 或 derived view。
- 哪些外部事件只可转成本地 refs、snapshot、pending / stale marker、handoff state、control fact 或 maintenance marker。
- 哪些已提交 sandbox fact 需要向调用方、artifact、observability、runtime、runner、安全调查或 bus 消费面传播。
- 哪些后台任务负责 lease / orphan / cleanup / reaper、event relay、projection rebuild、reference refresh、derived maintenance 和 reconciliation。
- 哪些外部 / 基础设施 port 是概要层必须点名的接缝,避免详细设计重新发明 backend、policy、handoff、observability、event、investigation 或 persistence 边界。

本步不定义完整协议、DTO、event payload、topic、HTTP path、RPC method、port trait 方法全集、repository、事务、错误码、鉴权实现、配置 key、测试用例、真实 evidence 或实施 boundary。

---

## 3. 本步输入

| 输入 | 状态 | 用途 |
|---|---|---|
| `02_hld_step_01_upstream_boundary.md` | 已完成 | 提供上游承接、旧材料隔离和本文必须回答的问题。 |
| `02_hld_step_02_goals_scope.md` | 已完成 | 提供本轮 `02` 可实现结构骨架和接口深度边界。 |
| `02_hld_step_03_constraints.md` | 已完成 | 提供正式入口不可旁路、coherent boundary、policy fail-closed、capture / handoff 分层、非 happy path 核心化、同步 / 异步 / 后台分离和依赖裁剪门禁。 |
| `02_hld_step_04_code_subject_framework.md` | 已完成 | 提供 Inbound / Operations、Application Services、Domain Model、Ports / Persistence / Projection / Handoff 的代码主体骨架。 |
| `02_hld_step_05_components_boundary.md` | 已完成 | 提供六个主要组成部分、capability、代码主体 / 模块、接缝和 Step 7 展开位置。 |
| `02_hld_step_06_key_objects.md` 和 4 个对象附录 | 已完成 | 提供接口输入 / 输出 / 写入结果必须承接的对象主语、status view、guard、audit 和 event relay 对象。 |
| `projects/L4-sandbox/00-需求文档.md` §12 / §14 / §16 | 当前正式需求基线 | 提供能力级接口面、验收红线和 FR / BR / AC / VF 追溯。 |
| `projects/L4-sandbox/01-架构设计.md` §9 / §10 / §15 / §16 | 当前正式架构基线 | 提供数据归属、一致性策略、关键交互、通信方式、风险和追溯矩阵。 |
| `standards/document/概要设计讨论流程_SOP.md` | 已读取 Step 7 | 约束本 Step 问题、输出和停审记录。 |
| `standards/document/概要设计书写规范.md` | 已读取 §4.7 | 约束接口分类说明和五类接口表格格式。 |
| `projects/L1-artifact/design-calibration/02_hld_step_07_api_interface_skeleton.md` | 已读取 | 参考 Step 7 单文件高粒度接口骨架、归属映射和边界写法。 |
| `projects/L1-governance/design-calibration/02_hld_step_07_api_interface_skeleton.md` | 已读取 | 参考 Command / Query / Event / Job 分类、上下文和幂等要求写法。 |
| 旧 `projects/L4-sandbox/README.md` / 旧 `02-概要设计.md` | historical_material | 仅用于审计旧 `SandboxService`、旧事件名、Docker/gVisor、old API / SDK / allowlist / audit 线索回流风险。 |

---

## 4. Step 内计划

| 顺序 | 动作 | 状态 | 产物 / 门禁 |
|---:|---|---|---|
| 1 | 读取项目台账、`02` flow、Step 6 主控文件和对象附录、Step 1~5、正式 `00/01`、概要 SOP Step 7 和书写规范 §4.7。 | done | 确认用户已允许进入 Step 7,正式 `02` 不修改。 |
| 2 | 从 Step 5 各组成部分 capability 和 Step 6 对象能力中梳理接口候选。 | done | 区分 Command、Query、Inbound Event Consumer、Outbound Event、Operations Job 和 port。 |
| 3 | 诊断旧 README / 旧 `02` 的旧 service、旧事件、旧 backend / SDK / allowlist 线索。 | done | 旧内容只作为 historical material,不继承旧 API 名或后端协议。 |
| 4 | 回答 Step 7 SOP 问题。 | done | 明确接口读写类别、上下文 / 幂等要求和对象承接关系。 |
| 5 | 输出接口分类说明、按组成部分接口表、五类接口骨架表和 external / infrastructure port 骨架表。 | done | 满足正式 §7 回填输入要求,且补足后续详细设计 port 边界。 |
| 6 | 输出接口归属停审记录、跨接口一致性审计、设计取舍、回填草稿和自检。 | done | Step 8 可继续按关键接口展开处理流。 |
| 7 | 更新 `02_hld_calibration_flow.md` 和项目台账,并停在用户审查点。 | done | 不创建 Step 8 文件,不修改正式 `02-概要设计.md`。 |

---

## 5. SOP 问题回答

### 5.1 哪些接口属于 Command,负责改写真相?

Command 只覆盖会改写 sandbox-owned truth、decision、fact、guard state、audit 或 handoff / relay record 的正式用例入口。当前 Command 包括:

- `OpenControlledExecutionContext`: 改写 `ControlledExecutionContext`、`ExecutionContextResolution`、`ExecutionEnvironmentIdentity` 和 intake audit。
- `EstablishExecutionBoundary`: 改写 `BoundaryRequirementSet`、`BoundaryEstablishmentDecision`、`CoherentBoundary`、`IsolationEnvironmentHandle` 和 boundary audit。
- `EvaluatePolicyExecution`: 改写 `PolicyApplicabilitySnapshot`、`PolicyExecutionDecision`、`HighRiskActionDecision` 和 policy audit。
- `StartControlledExecutionRun`: 改写 `ControlledExecutionRun` 和 run lifecycle audit。
- `RecordCaptureResult`: 改写 `CaptureFact`、`CapturedMaterialRef`、`ObservabilityMaterial` 和 capture audit。
- `OpenMaterialHandoff`: 改写 `HandoffFact`、`SandboxEventRelayRecord` 和 handoff audit。
- `SubmitSandboxControl`: 改写 `ControlFact` 和 control audit。
- `ClassifySandboxFailure`: 改写 `FailureClassification` 和 failure audit。
- `EvaluateCleanupReadiness`: 改写 `CleanupGuard`、`CleanupReadinessView` 可重建来源和 cleanup audit。
- `RecordRedlineContainment`: 改写 `RedlineContainment`、`RedlineContainmentView` 可重建来源和 security audit。

Command 不包括 query、preview、trend、backend comparison、projection rebuild、event relay publish、repository 方法、backend SDK 调用或下游 artifact / observability / runtime truth 写入。

### 5.2 哪些接口属于 Query,只读取投影或只读视图?

Query 只读取 Step 6 已定义的 status view、summary view、projection、derived view、audit trace 或 reconciliation report。当前 Query 包括:

- `GetSandboxExecutionStatus`
- `GetBoundaryStatus`
- `GetPolicyDecisionSummary`
- `GetCaptureSummary`
- `GetMaterialHandoffStatus`
- `GetFailureControlStatus`
- `GetCleanupReadiness`
- `GetRedlineContainmentStatus`
- `GetSandboxReadProjection`
- `GetDerivedInspectPreviewTrend`
- `GetBackendCapabilityComparison`
- `GetSandboxReconciliationReport`
- `GetSandboxAuditTrace`

Query 可以返回 stale、degraded、unavailable、pending 或 not-visible 结果,但不得补写 truth、刷新 refs、重建 projection、触发 handoff、解除 cleanup guard 或推进 redline containment。

### 5.3 哪些外部事实需要通过 Inbound Event Consumer 进入本仓?

需要通过 Inbound Event Consumer 进入本仓的外部事实包括:

- identity / work / runner / tool / runtime / policy refs 或 safe summary 的变化。
- backend capability、workspace summary 或 isolation backend lifecycle signal 的变化。
- policy / authorization / approval / capability summary 的变化或失效。
- artifact / runtime / runner / observability 等下游 handoff ack / failed / pending / retryable 状态。
- control signal、kill / cancel / cleanup request、安全交接状态和 investigation handoff 状态。
- bus / relay 发布反馈、projection stale signal、derived maintenance trigger。

Consumer 输入必须携带 event envelope、source event id、source ref、schema version、dedup key 和 trace context。Consumer 不得直接复制外部正文,也不得绕过 Command 直接宣布受理、policy accepted、artifact formalized、observability stored 或 investigation completed。

### 5.4 哪些已提交事实需要通过 Outbound Event 对外传播?

需要传播的已提交事实包括:

- 受控执行语境 accepted / rejected / pending / unresolved。
- boundary requirement / decision / established / failed / released。
- policy accepted / rejected / blocked / pending / fail-closed。
- controlled run preparing / running / completed / failed / terminated。
- capture complete / partial / failed / unavailable。
- material handoff pending / delivered / failed / retryable。
- failure classification、control fact、cleanup guard、lease / orphan / reaper 和 redline containment 变化。
- projection / derived view freshness、reconciliation finding 和 event relay state。

Outbound Event 只能传播 sandbox 已成立 truth 或维护状态。发布失败不得回滚核心 truth;下游 ack / failed 只能通过 Inbound Event 或 Job 更新 handoff / cleanup / containment 相关状态。

### 5.5 哪些恢复、发布、重建、对账动作属于 Operations Job,而不是业务 command?

Operations Job 负责基于已持久化事实做后台维护、传播、重建、对账和保守回收。当前 Job 包括:

- `PublishSandboxEventRelay`
- `RefreshSandboxReferenceStates`
- `RefreshBackendCapabilitySummaries`
- `RetryPendingMaterialHandoffs`
- `RunLeaseOrphanReaper`
- `EvaluatePendingCleanupGuards`
- `MaintainRedlineContainmentHandoffs`
- `RebuildSandboxReadProjections`
- `MaintainDerivedInspectPreviewTrend`
- `RunSandboxReconciliation`

Job 不作为业务 command,不创建新的受控执行语境,不启动未受理执行,不修复核心 truth,不绕过 cleanup guard,不解除 redline,不生成真实 evidence、run_id、验收签署或 implementation boundary。

### 5.6 Command 输入骨架是否需要 `ActorContext`、`CommandMetadata`、`IdempotencyKey`?

需要。所有 Command 输入都必须显式携带 `ActorContext`、`CommandMetadata`、`IdempotencyKey` 和 trace context；系统内部或后台触发的 Command 使用经校验的 core `ActorKind::System` actor context，仍必须携带 command metadata、幂等键和 trace context。Sandbox 不创建 `Maintenance` actor kind；缺失或 actor kind 不匹配时不得进入 truth 写路径。

### 5.7 Query 输入骨架是否需要 `ActorContext`?

需要。所有 Query 输入都必须携带 `ActorContext` 和 `QueryMetadata`,用于可见性、读取一致性、分页 / scope、trace 关联和 stale / degraded surface 表达。Query 不携带 idempotency key,也不打开写路径。

### 5.8 Event Consumer 输入骨架是否需要 event id、幂等键或 envelope?

需要。所有 Inbound Event Consumer 输入必须携带 event envelope、source event id、source ref、schema version、dedup key、observed-at marker 和 trace context。重复、乱序、unsupported version 或外部来源不可用时,只能形成 ignored-duplicate、pending、stale、failed、retryable 或 reconciliation finding,不得回滚或伪造核心 truth。

### 5.9 每个接口属于哪个主要组成部分,承接哪个对象或对象能力?

本文件 §7 将接口按六个主要组成部分组织。每个接口必须回指 Step 6 对象或对象能力:

- intake 接口回指 `ControlledExecutionContext`、`ExecutionEnvironmentIdentity`、`ExecutionContextResolution`、`ControlledExecutionIntakeGuard`。
- boundary 接口回指 `BoundaryRequirementSet`、`BackendCapabilitySummary`、`BoundaryEstablishmentDecision`、`CoherentBoundary`、`IsolationEnvironmentHandle`。
- policy 接口回指 `PolicyApplicabilitySnapshot`、`PolicyExecutionDecision`、`HighRiskActionDecision`、`PolicyApplicabilityGuard`、`FailClosedPolicyGuard`。
- capture / handoff 接口回指 `ControlledExecutionRun`、`CaptureFact`、`CapturedMaterialRef`、`ObservabilityMaterial`、`HandoffFact`、`SandboxEventRelayRecord`。
- failure / safety 接口回指 `FailureClassification`、`ControlFact`、`LeaseRecord`、`OrphanRecoveryRecord`、`CleanupGuard`、`RedlineContainment`。
- local derived 接口回指 `ReferenceResolutionState`、`SandboxReadProjection`、`DerivedInspectPreviewTrendState`、`DerivedInspectPreviewTrendView`、`BackendCapabilityComparisonView`、`SandboxReconciliationReport`。

### 5.10 是否存在接口无人承接、对象能力没有入口、接口类别混淆或跨组成部分越界?

当前没有 unresolved 冲突。需要持续保护的边界是:

- `StartControlledExecutionRun` 不是 tools semantic execution 或 runtime agent loop。
- `EstablishExecutionBoundary` 和 `IsolationBackendPort` 不把后端产品写成业务 truth。
- `EvaluatePolicyExecution` 不生成 policy definition、approval、allowlist 或 capability truth。
- `OpenMaterialHandoff` 不宣布 artifact、runtime result、runner UI 或 observability store truth。
- `SubmitSandboxControl` 不执行业务 replay 或 runtime recover。
- `GetDerivedInspectPreviewTrend`、`GetBackendCapabilityComparison` 和 `GetSandboxReconciliationReport` 只读,不得成为隐式修复或写入入口。
- `PublishSandboxEventRelay` 是 Operations Job,不是业务 command;发布失败不回滚 truth。

### 5.11 每个主要组成部分的接口骨架完成后是否通过停审?

本文件 §14 提供逐组成部分停审记录。当前六个组成部分均通过 Step 7 停审:接口能力有对象承接,读写类别清楚,ports 只表达外部 / 基础设施接缝,未把内部 helper、repository、DTO、backend SDK、HTTP body、event payload 或 topic 写成概要 API。

---

## 6. 接口分类说明

| 接口类别 | 读写性质 | 主要用途 | 必须携带的上下文 | 不得做什么 |
|---|---|---|---|---|
| Command API | 改写 sandbox truth / decision / fact / guard state / audit / handoff record | 正式受理、边界建立、policy 裁定、运行承接、capture、handoff、failure、control、cleanup、redline | `ActorContext` 或 `SystemActorContext`;`CommandMetadata`;`IdempotencyKey`;trace context | 不写 HTTP path、DTO schema、下游 truth、backend SDK 响应或外部正文。 |
| Query API | 只读 | 读取 status view、summary view、projection、derived view、audit trace 和 reconciliation report | `ActorContext`;`QueryMetadata`;scope / pagination / consistency hint | 不写 truth、不刷新 refs、不修复 projection、不触发 handoff / cleanup / redline。 |
| Inbound Event Consumer | 写 refs / snapshot / pending / stale / handoff state / control fact / maintenance marker | 承接外部 safe summary、backend capability、handoff ack、control signal、安全交接和维护触发 | event envelope;source event id;source ref;schema version;dedup key;trace context | 不直接复制外部正文,不绕过 Command 生成核心 success。 |
| Outbound Event | 输出已成立 fact 或维护状态 | 向调用方、artifact、runtime、runner、observability、bus、安全调查和派生消费面传播变化 | event ref;truth ref;change kind;trace context | 不携带原始外部正文,不让发布失败回滚 truth。 |
| Operations Job | 后台维护 / 发布 / 重试 / 重建 / 对账 / 保守回收 | event relay、reference refresh、backend summary refresh、handoff retry、lease / orphan / cleanup / redline、projection / derived / reconciliation | `JobMetadata`;system / operator actor;job idempotency key;trace context | 不作为业务 command,不修复核心 truth,不伪造 run_id / evidence / 验收。 |
| External / Infrastructure Port | 外部能力 / 基础设施接缝 | refs 解析、policy summary、backend capability、isolation backend、material / observability / event / investigation handoff、truth persistence | port request context;typed refs;trace context;capability / safety summary | 不形成编译期 sibling 依赖,不引入后端产品 truth,不暴露完整 SDK / repository 方法。 |

---

## 7. 按主要组成部分组织的接口骨架表

| 主要组成部分 | Command | Query | Inbound Event Consumer | Outbound Event | Operations Job | External / Infrastructure Port | 承接对象 / 能力 |
|---|---|---|---|---|---|---|---|
| `Controlled execution intake and identity` | `OpenControlledExecutionContext` | `GetSandboxExecutionStatus`;`GetSandboxAuditTrace` | `ConsumeCallerContextReferenceChanged` | `SandboxExecutionContextChanged` | `RefreshSandboxReferenceStates` | `ContextReferenceResolverPort`;`SandboxTruthPersistencePort` | context、identity、resolution、intake guard、audit trace。 |
| `Boundary establishment and enforcement` | `EstablishExecutionBoundary` | `GetBoundaryStatus`;`GetBackendCapabilityComparison` | `ConsumeBackendCapabilitySummaryChanged`;`ConsumeIsolationBackendLifecycleSignal` | `SandboxBoundaryChanged` | `RefreshBackendCapabilitySummaries` | `BackendCapabilityPort`;`IsolationBackendPort`;`SandboxTruthPersistencePort` | boundary requirements、decision、coherent boundary、backend summary、handle。 |
| `Policy execution decision` | `EvaluatePolicyExecution` | `GetPolicyDecisionSummary` | `ConsumePolicySummaryChanged` | `SandboxPolicyDecisionChanged` | `RefreshSandboxReferenceStates` | `PolicySummaryPort`;`ContextReferenceResolverPort`;`SandboxTruthPersistencePort` | policy snapshot、decision、high-risk action、fail-closed guard。 |
| `Execution capture and material handoff` | `StartControlledExecutionRun`;`RecordCaptureResult`;`OpenMaterialHandoff` | `GetCaptureSummary`;`GetMaterialHandoffStatus` | `ConsumeMaterialHandoffStatusChanged`;`ConsumeObservabilityHandoffStatusChanged` | `SandboxRunChanged`;`SandboxCaptureChanged`;`SandboxMaterialHandoffChanged` | `RetryPendingMaterialHandoffs`;`PublishSandboxEventRelay` | `MaterialHandoffPort`;`ObservabilityMaterialPort`;`EventRelayPort`;`SandboxTruthPersistencePort` | run、capture、material refs、observability material、handoff、relay record。 |
| `Failure control and safety closure` | `SubmitSandboxControl`;`ClassifySandboxFailure`;`EvaluateCleanupReadiness`;`RecordRedlineContainment` | `GetFailureControlStatus`;`GetCleanupReadiness`;`GetRedlineContainmentStatus` | `ConsumeSandboxControlRequested`;`ConsumeInvestigationHandoffStatusChanged`;`ConsumeIsolationBackendLifecycleSignal` | `SandboxFailureChanged`;`SandboxControlChanged`;`SandboxCleanupChanged`;`SandboxRedlineContainmentChanged` | `RunLeaseOrphanReaper`;`EvaluatePendingCleanupGuards`;`MaintainRedlineContainmentHandoffs` | `InvestigationHandoffPort`;`IsolationBackendPort`;`EventRelayPort`;`SandboxTruthPersistencePort` | failure、control、lease、orphan、cleanup guard、redline containment。 |
| `Local reference, projection and derived support` | - | `GetSandboxReadProjection`;`GetDerivedInspectPreviewTrend`;`GetBackendCapabilityComparison`;`GetSandboxReconciliationReport`;`GetSandboxAuditTrace` | `ConsumeSandboxTruthRelayFeedback`;`ConsumeCallerContextReferenceChanged`;`ConsumeBackendCapabilitySummaryChanged` | `SandboxProjectionChanged`;`SandboxDerivedViewChanged`;`SandboxReconciliationFindingAvailable` | `RebuildSandboxReadProjections`;`MaintainDerivedInspectPreviewTrend`;`RunSandboxReconciliation`;`RefreshSandboxReferenceStates` | `ContextReferenceResolverPort`;`BackendCapabilityPort`;`EventRelayPort`;`SandboxProjectionPersistencePort` | reference state、read projection、derived state / view、comparison、reconciliation、audit / relay。 |

---

## 8. Command API 骨架表

所有 Command 输入骨架中的 `command_context` 均表示 `ActorContext` or `SystemActorContext` + `CommandMetadata` + `IdempotencyKey` + trace context。本表只写概要对象骨架,不定义 DTO 字段表、错误码、事务或 handler 调用链。

| API | 输入骨架 | 输出骨架 | 主要处理 | 写入结果 |
|---|---|---|---|---|
| `OpenControlledExecutionContext` | `ExecutionSourceRefSet`;`ExecutionResponsibilityContext`;`ContextRefSummarySet`;`ControlledExecutionIntakeGuardRef`;`command_context` | `ControlledExecutionOpenResult` | 解析调用方 refs、校验最小受理前提、创建 accepted / rejected / pending / unresolved 语境和 execution identity。 | `ControlledExecutionContext`;`ExecutionContextResolution`;`ExecutionEnvironmentIdentity`;`ContextReferenceResolution`;`SandboxAuditTrace` |
| `EstablishExecutionBoundary` | `ControlledExecutionContextRef`;`ExecutionEnvironmentIdentityRef`;显式 resource / filesystem / network / process / workspace requirements;`BackendCapabilitySummaryRef`;`command_context` | `BoundaryEstablishmentResult` | 结合 builder 注入的同代 profile / template / runtime generation 合成 boundary requirement,校验 backend capability,调用 isolation backend 接缝并形成 established / rejected / pending / failed 裁定;不得读取后序 policy。 | `BoundaryRequirementSet`;`BoundaryEstablishmentDecision`;`CoherentBoundary`;`IsolationEnvironmentHandle`;`LeaseRecord`;`SandboxAuditTrace` |
| `EvaluatePolicyExecution` | `ControlledExecutionContextRef`;`BoundaryRequirementSetRef`;`PolicySourceRefSet`;`AuthorizationSummary`;`HighRiskActionMarkerSet`;`command_context` | `PolicyExecutionDecisionResult` | 承接给定 policy / authorization 摘要,判断适用性、高风险动作和 fail-closed 裁定。 | `PolicyApplicabilitySnapshot`;`PolicyExecutionDecision`;`HighRiskActionDecision`;`SandboxAuditTrace` |
| `StartControlledExecutionRun` | `ControlledExecutionContextRef`;`CoherentBoundaryRef`;`IsolationEnvironmentHandleRef`;`PolicyExecutionDecisionRef`;`LaunchRequestSummary`;`command_context` | `ControlledExecutionRunResult` | 在已成立 context、boundary 和 policy 下启动或准备受控执行,不解释 tools 语义或 runtime loop。 | `ControlledExecutionRun`;`SandboxAuditTrace` |
| `RecordCaptureResult` | `ControlledExecutionRunRef`;`ExecutionOutputSummary`;`CapturedMaterialRefSet`;`ObservabilityMaterial`;`CaptureFailureReason?`;`command_context` | `CaptureCommandResult` | 记录 complete / partial / failed / unavailable capture,形成候选材料和观测材料引用。 | `CaptureFact`;`CapturedMaterialRef`;`ObservabilityMaterial`;`SandboxAuditTrace` |
| `OpenMaterialHandoff` | `CaptureFactRef`;`CapturedMaterialRefSet`;`ObservabilityMaterialRef`;`HandoffTargetRefSet`;`command_context` | `MaterialHandoffCommandResult` | 为 captured output、candidate material 和 observability material 创建显式 handoff fact 和 event relay 记录。 | `HandoffFact`;`SandboxEventRelayRecord`;`SandboxAuditTrace` |
| `SubmitSandboxControl` | `ControlledExecutionContextRef`;`SandboxControlKind`;`ControlSourceContext`;`ControlConflictGuardRef`;`command_context` | `SandboxControlCommandResult` | 收束 kill、cancel、cleanup、deny、timeout 或 investigation-like control,处理重复和冲突。 | `ControlFact`;`FailureClassification?`;`SandboxAuditTrace` |
| `ClassifySandboxFailure` | `ControlledExecutionContextRef`;`ControlledExecutionRunRef?`;`FailureSourceMarkerSet`;`PolicyExecutionDecisionRef?`;`CaptureFactRef?`;`command_context` | `FailureClassificationResult` | 将 deny、timeout、backend failure、resource exceeded、capture / handoff failure、orphan 或 redline 信号归并为稳定失败分类。 | `FailureClassification`;`SandboxAuditTrace` |
| `EvaluateCleanupReadiness` | `ControlledExecutionContextRef`;`CaptureFactRef`;`HandoffFactRef`;`InvestigationHandoffSummary`;`CleanupSafetyGuardRef`;`command_context` | `CleanupReadinessCommandResult` | 判断 cleanup allowed / blocked / pending,保护 capture / audit / investigation material。 | `CleanupGuard`;`CleanupReadinessView`;`SandboxAuditTrace` |
| `RecordRedlineContainment` | `ControlledExecutionContextRef`;`CoherentBoundaryRef`;`SecurityRedlineKind`;`RedlineContainmentGuardRef`;`InvestigationHandoffSummary?`;`command_context` | `RedlineContainmentCommandResult` | 记录 security redline 检测、containment、调查交接和 release / terminal 语义。 | `RedlineContainment`;`RedlineContainmentView`;`SandboxAuditTrace` |

---

## 9. Query API 骨架表

所有 Query 输入骨架中的 `query_context` 均表示 `ActorContext` + `QueryMetadata` + scope / pagination / consistency hint + trace context。Query 可以返回 stale、degraded、unavailable 或 not-visible,但不得写 truth、refresh marker、handoff 状态或 cleanup / redline 状态。

| API | 输入骨架 | 输出骨架 | 读取来源 | 边界 |
|---|---|---|---|---|
| `GetSandboxExecutionStatus` | `ControlledExecutionContextRef`;`query_context` | `SandboxExecutionStatusView` | `ControlledExecutionContext`;`ExecutionEnvironmentIdentity`;`ExecutionContextResolution`;`SandboxReadProjection` | 只读执行语境、受理、身份和归责状态;不重新解析 refs。 |
| `GetBoundaryStatus` | `CoherentBoundaryRef` or `ControlledExecutionContextRef`;`query_context` | `BoundaryStatusView` | `CoherentBoundary`;`BoundaryEstablishmentDecision`;`BackendCapabilitySummary`;`SandboxReadProjection` | 只读 established / rejected / pending / failed 状态;不触发 backend 建立。 |
| `GetPolicyDecisionSummary` | `PolicyExecutionDecisionRef` or `ControlledExecutionContextRef`;`query_context` | `PolicyDecisionSummaryView` | `PolicyExecutionDecision`;`PolicyApplicabilitySnapshot`;`HighRiskActionDecision` | 只读给定 policy 的执行裁定;不读取 policy DSL / approval 正文。 |
| `GetCaptureSummary` | `CaptureFactRef` or `ControlledExecutionRunRef`;`query_context` | `CaptureSummaryView` | `CaptureFact`;`CapturedMaterialRef`;`ObservabilityMaterial`;`SandboxReadProjection` | 只读 capture summary 和 material refs;不宣布 formal artifact truth。 |
| `GetMaterialHandoffStatus` | `HandoffFactRef` or `ControlledExecutionContextRef`;`query_context` | `MaterialHandoffStatusView` | `HandoffFact`;`SandboxEventRelayRecord`;`SandboxReadProjection` | 只读 pending / delivered / failed / retryable 状态;不重试 handoff。 |
| `GetFailureControlStatus` | `ControlledExecutionContextRef` or `FailureClassificationRef`;`query_context` | `FailureControlStatusView` | `FailureClassification`;`ControlFact`;`SandboxReadProjection` | 只读 failure / control 状态;不提交 control signal。 |
| `GetCleanupReadiness` | `ControlledExecutionContextRef` or `CleanupGuardRef`;`query_context` | `CleanupReadinessView` | `CleanupGuard`;`CaptureFact`;`HandoffFact`;`RedlineContainment`;`SandboxReadProjection` | 只读 allowed / blocked / pending;不放行 cleanup。 |
| `GetRedlineContainmentStatus` | `ControlledExecutionContextRef` or `RedlineContainmentRef`;`query_context` | `RedlineContainmentView` | `RedlineContainment`;`InvestigationHandoffSummary`;`SandboxReadProjection` | 只读 redline containment;不解除 containment 或关闭调查。 |
| `GetSandboxReadProjection` | `ControlledExecutionContextRef`;`projection scope`;`query_context` | `SandboxReadProjection` | `SandboxProjectionReadModels`;committed sandbox truth | projection stale / degraded 时显式返回,不伪造 fresh。 |
| `GetDerivedInspectPreviewTrend` | `DerivedInspectPreviewTrendStateRef` or `ControlledExecutionContextRef`;`derived kind`;`query_context` | `DerivedInspectPreviewTrendView` | `DerivedInspectPreviewTrendState`;`DerivedInspectPreviewTrendReadModels`;safe summaries | inspect / preview / trend 只读,不驱动核心状态迁移。 |
| `GetBackendCapabilityComparison` | `BackendCapabilitySummaryRefSet`;`comparison scope`;`query_context` | `BackendCapabilityComparisonView` | `BackendCapabilitySummary`;`BoundaryEstablishmentDecision`;derived comparison view | 只读比较,不选择正式后端或替代 boundary decision。 |
| `GetSandboxReconciliationReport` | `SandboxReconciliationScopeRef` or `SandboxReconciliationReportRef`;`query_context` | `SandboxReconciliationReport` | reconciliation report;truth refs;projection refs;relay refs | 只读对账报告,不自动修复核心 truth。 |
| `GetSandboxAuditTrace` | `SandboxTraceSubjectRef`;`page cursor`;`query_context` | `SandboxAuditTraceView` | `SandboxAuditTrace`;`SandboxEventRelayRecord`;audit projection | 不替代 observability store,不暴露外部正文。 |

---

## 10. Inbound Event Consumer 骨架表

所有 Consumer 输入骨架都必须携带 event envelope、source event id、source ref、schema version、dedup key、observed-at marker 和 trace context。Consumer 典型写入结果是 reference state、snapshot / summary marker、handoff state、control fact、stale marker 或 relay feedback,不得直接生成核心 success。

| Consumer | 来源 | 输入骨架 | 本地结果 | 边界 |
|---|---|---|---|---|
| `ConsumeCallerContextReferenceChanged` | `L1-identity`;`L1-work`;`L2-tools`;`L2-runtime`;`L2-member-service`;`L5-runner` | context ref changed envelope + typed source ref + safe summary ref + source version | `ReferenceResolutionState`;`ContextReferenceResolution`;related projection stale marker | 不保存 identity / work / tool / runtime / runner 正文。 |
| `ConsumePolicySummaryChanged` | governance / capability / tools policy sources | policy / authorization summary envelope + policy source ref + summary ref + source version | `PolicyApplicabilitySnapshot` stale marker;`ReferenceResolutionState`;policy view stale marker | 不拥有 policy definition、approval、allowlist、capability 或 DSL truth。 |
| `ConsumeBackendCapabilitySummaryChanged` | isolation backend / backend capability source | capability summary envelope + backend ref + workspace ref + source version | `BackendCapabilitySummary`;`ReferenceResolutionState`;`BoundaryStatusView` stale marker;comparison stale marker | 后端 capability 摘要只服务边界判断,不决定业务 truth。 |
| `ConsumeIsolationBackendLifecycleSignal` | isolation backend | backend lifecycle envelope + isolation handle ref + backend lifecycle summary + signal kind | `LeaseRecord` marker;`OrphanRecoveryRecord?`;`FailureClassification?`;boundary / cleanup stale marker | 不拥有 backend lifecycle truth;异常只能触发 sandbox 收束或待确认。 |
| `ConsumeMaterialHandoffStatusChanged` | `L1-artifact`;`L2-runtime`;`L5-runner`;downstream material consumers | handoff status envelope + handoff target ref + ack / failed / pending / retryable status | `HandoffFact` status update;`MaterialHandoffStatusView` stale marker;`CleanupGuard` reevaluation marker | 下游 ack 不让 sandbox 宣布下游 formal truth。 |
| `ConsumeObservabilityHandoffStatusChanged` | `L4-observability`;`L0-bus` / observability relay | observability handoff envelope + observability material ref + delivery status | `SandboxEventRelayRecord`;`HandoffFact` observability status;projection stale marker | observability store truth 外部拥有;失败不掩盖 capture failure。 |
| `ConsumeSandboxControlRequested` | calling systems / operator control boundary / bus | control request envelope + controlled execution context ref + control kind + source context | `ControlFact`;`ControlConflictGuard` evaluation marker;failure / cleanup stale marker | 控制成为 sandbox fact,但不执行业务 replay 或 runtime recover。 |
| `ConsumeInvestigationHandoffStatusChanged` | security investigation / safety handoff boundary | investigation envelope + redline / cleanup / failure refs + investigation summary | `RedlineContainment` handoff status;`CleanupGuard` investigation summary;`ReferenceResolutionState` | 不拥有 investigation lifecycle 或 operator UI 正文。 |
| `ConsumeSandboxTruthRelayFeedback` | event relay / bus publication feedback | relay feedback envelope + event relay record ref + delivered / failed / retryable status | `SandboxEventRelayRecord`;`SandboxReconciliationReport` marker | 发布反馈不回滚已成立 sandbox truth。 |

---

## 11. Outbound Event 骨架表

Outbound Event 只能从已提交 sandbox truth change、handoff state change、maintenance state 或 derived state 形成。事件 payload 后续由详细设计闭口,本步只给输出骨架和边界。

| Event | 产生来源 | 主要消费者 | 说明 |
|---|---|---|---|
| `SandboxExecutionContextChanged` | `ControlledExecutionContext`;`ExecutionEnvironmentIdentity`;`ExecutionContextResolution` | tools、runtime、member-service、runner、observability、audit consumers | 传播 accepted / rejected / pending / unresolved 和责任语境 refs,不携带外部正文。 |
| `SandboxBoundaryChanged` | `BoundaryEstablishmentDecision`;`CoherentBoundary`;`IsolationEnvironmentHandle` | runtime、member-service、runner、observability、安全审查 | 传播 established / rejected / failed / released 和边界摘要,不携带后端 SDK 响应。 |
| `SandboxPolicyDecisionChanged` | `PolicyExecutionDecision`;`HighRiskActionDecision` | tools、runtime、member-service、runner、governance consumers、observability | 传播 accepted / rejected / blocked / pending / fail-closed,不携带 policy DSL / approval body。 |
| `SandboxRunChanged` | `ControlledExecutionRun` | runtime、tools、member-service、runner、observability | 传播 preparing / running / completed / failed / terminated,不等于 runtime ExecutionInstance truth。 |
| `SandboxCaptureChanged` | `CaptureFact`;`CapturedMaterialRef`;`ObservabilityMaterial` | artifact、runtime、runner、observability、audit consumers | 传播 complete / partial / failed / unavailable 和 material refs,不宣布 formal artifact truth。 |
| `SandboxMaterialHandoffChanged` | `HandoffFact`;`SandboxEventRelayRecord` | artifact、runtime、runner、observability、bus consumers | 传播 handoff pending / delivered / failed / retryable,下游 ownership 不迁移。 |
| `SandboxFailureChanged` | `FailureClassification` | runtime、tools、member-service、runner、observability、安全审查 | 传播 failure kind / status / source markers,不等于 runtime result。 |
| `SandboxControlChanged` | `ControlFact` | runtime、member-service、runner、observability、audit consumers | 传播 kill / cancel / cleanup / deny / timeout / investigation control fact。 |
| `SandboxCleanupChanged` | `CleanupGuard`;`LeaseRecord`;`OrphanRecoveryRecord` | observability、artifact、runtime、security investigation、SRE consumers | 传播 cleanup allowed / blocked / pending / completed、lease / orphan / reaper 状态。 |
| `SandboxRedlineContainmentChanged` | `RedlineContainment` | security investigation、observability、artifact、runtime、SRE consumers | 传播 detected / contained / handoff-pending / released / terminal,红线不是 advisory-only。 |
| `SandboxProjectionChanged` | `SandboxReadProjection` | SDK / console / observability read consumers | 传播 projection fresh / stale / rebuilding / degraded,派生变化不代表新 truth。 |
| `SandboxDerivedViewChanged` | `DerivedInspectPreviewTrendState`;`DerivedInspectPreviewTrendView` | runner / console / SRE / security read consumers | 传播 inspect / preview / trend freshness,不反写核心。 |
| `SandboxReconciliationFindingAvailable` | `SandboxReconciliationReport` | SRE、observability、audit consumers | 传播对账发现,不自动修复 truth。 |

---

## 12. Operations Job 骨架表

Operations Job 必须携带 `JobMetadata`、system / operator actor、job idempotency key、trace context 和 run attempt marker。这里的 run attempt marker 只是作业执行标记,不是测试 run_id、验收 evidence 或实施签署。

| Job | 输入来源 | 输出结果 | 边界 |
|---|---|---|---|
| `PublishSandboxEventRelay` | `SandboxEventRelayRecord` pending / failed / retryable records;outbound event cursor | publication report;updated `SandboxEventRelayRecord`;relay stale marker | 发布失败不得回滚 sandbox truth;不定义 topic / outbox payload。 |
| `RefreshSandboxReferenceStates` | tracked external refs;source filters;stale markers | refreshed `ReferenceResolutionState`;context / policy / read projection stale markers | 不复制外部正文,不替代正式 intake / policy command。 |
| `RefreshBackendCapabilitySummaries` | backend refs;workspace refs;capability source cursor | refreshed `BackendCapabilitySummary`;comparison stale marker;boundary pending marker | 不选择正式后端,不改变已成立 boundary truth。 |
| `RetryPendingMaterialHandoffs` | `HandoffFact` pending / failed / retryable;handoff target refs | handoff retry report;updated `HandoffFact`;`SandboxEventRelayRecord` | 重试只处理交接,不宣布下游 artifact / observability truth。 |
| `RunLeaseOrphanReaper` | `LeaseRecord` expiring / expired;isolation handle refs;backend lifecycle summary | `OrphanRecoveryRecord`;updated `LeaseRecord`;cleanup / redline marker | reaper 受 cleanup guard 和 redline containment 约束,不得先删证据。 |
| `EvaluatePendingCleanupGuards` | `CleanupGuard` pending;capture / handoff / investigation summaries | updated `CleanupGuard`;`CleanupReadinessView`;cleanup event marker | 只评估和记录 allowed / blocked / pending,不绕过材料保留。 |
| `MaintainRedlineContainmentHandoffs` | `RedlineContainment` handoff-pending;investigation summary refs | updated `RedlineContainment`;investigation handoff record;event relay marker | 不拥有 investigation lifecycle,不自动解除 containment。 |
| `RebuildSandboxReadProjections` | committed sandbox truth cursor;projection stale markers | rebuilt `SandboxReadProjection`;status views;projection freshness event | 只从 committed truth 重建,不修复核心 truth。 |
| `MaintainDerivedInspectPreviewTrend` | capture / handoff / failure / usage refs;derived stale markers | updated `DerivedInspectPreviewTrendState`;`DerivedInspectPreviewTrendView`;derived event marker | preview / trend 只读,不驱动 capture / handoff / cleanup。 |
| `RunSandboxReconciliation` | truth refs;projection refs;handoff / relay refs;derived refs | `SandboxReconciliationReport`;finding events;degraded marker | 对账只报告或标记,修复必须走正式 Command / Job 规则。 |

---

## 13. External / Infrastructure Port 骨架表

这些 port 是概要层必须点名的外部 / 基础设施接缝。它们不是领域对象,也不是编译期 sibling 依赖;详细设计再展开 trait、adapter、SDK、fake / durable parity、错误映射和协议 envelope。

| Port | 输入骨架 | 输出骨架 | 服务对象 / 接口 | 边界 |
|---|---|---|---|---|
| `ContextReferenceResolverPort` | identity / work / runner / tool / runtime / policy / investigation refs;resolver context;trace context | `ContextRefSummarySet`;`ReferenceResolutionState`;unresolved / stale markers | `OpenControlledExecutionContext`;`RefreshSandboxReferenceStates`;Query read surface | 只返回 refs / safe summary / missing markers,不保存或返回外部正文。 |
| `PolicySummaryPort` | policy source refs;authorization context;boundary requirement summary;trace context | `PolicyApplicabilitySnapshot` seed;policy missing / conflicted / unsupported markers | `EvaluatePolicyExecution`;`ConsumePolicySummaryChanged` | 不拥有 policy definition、approval、allowlist、capability 或 DSL truth。 |
| `BackendCapabilityPort` | backend refs;workspace refs;boundary requirement summary;capability query context | `BackendCapabilitySummary`;backend unsupported / stale / unavailable markers | `EstablishExecutionBoundary`;`RefreshBackendCapabilitySummaries`;`GetBackendCapabilityComparison` | 能力摘要只服务 coherent boundary 判断,不定义 backend product lifecycle。 |
| `IsolationBackendPort` | `BoundaryRequirementSet`;`ExecutionEnvironmentIdentityRef`;launch / lifecycle control summary;trace context | `IsolationEnvironmentHandle`;backend lifecycle summary;establish / release failure markers | `EstablishExecutionBoundary`;`StartControlledExecutionRun`;`RunLeaseOrphanReaper` | 承接真实隔离环境能力,但不得让 backend SDK raw response 成为 domain truth。 |
| `MaterialHandoffPort` | `CaptureFactRef`;`CapturedMaterialRefSet`;handoff target refs;trace context | handoff accepted / failed / retryable summary;handoff target refs | `OpenMaterialHandoff`;`RetryPendingMaterialHandoffs` | 下游 artifact / runtime / runner truth 外部拥有;ack 只影响 handoff fact。 |
| `ObservabilityMaterialPort` | `ObservabilityMaterialRef`;audit / trace / metric material summary;trace context | observability handoff summary;delivery / failed markers | `OpenMaterialHandoff`;`ConsumeObservabilityHandoffStatusChanged` | observability store truth 外部拥有,不能替代 sandbox capture / audit fact。 |
| `EventRelayPort` | outbound event ref;truth ref;change kind;trace context | relay accepted / delivered / failed / retryable summary | `PublishSandboxEventRelay`;all outbound events;projection stale consumers | bus / outbox / topic 细节后移;发布失败不回滚 truth。 |
| `InvestigationHandoffPort` | redline / failure / cleanup refs;material refs;investigation summary;trace context | investigation handoff accepted / pending / failed summary | `RecordRedlineContainment`;`MaintainRedlineContainmentHandoffs`;`EvaluateCleanupReadiness` | 不拥有 investigation case lifecycle、operator UI 或安全裁决正文。 |
| `SandboxTruthPersistencePort` | sandbox truth objects;write context;idempotency key;trace context | persisted truth refs;conflict / duplicate markers | all Command;relevant Operations Job | 不在概要层定义 repository 方法、表结构、事务或 DB 产品。 |
| `SandboxProjectionPersistencePort` | projection / derived / reconciliation objects;job context;trace context | persisted projection refs;freshness / rebuild markers | Query;projection / derived Jobs | Projection 可重建且只读,不得反写核心 truth。 |

---

## 14. 接口归属停审记录

| 主要组成部分 | 结论 | 说明 |
|---|---|---|
| `Controlled execution intake and identity` | pass | `OpenControlledExecutionContext`、`GetSandboxExecutionStatus`、`ConsumeCallerContextReferenceChanged` 和 `ContextReferenceResolverPort` 均回指 context / identity / resolution / guard 对象;未保存外部正文或建立第二入口。 |
| `Boundary establishment and enforcement` | pass | `EstablishExecutionBoundary`、`GetBoundaryStatus`、backend capability consumer / refresh job 和 `IsolationBackendPort` 均承接 coherent boundary 与 backend capability 可落实性;未锁定 Docker/gVisor/k8s 或 host-run fallback。 |
| `Policy execution decision` | pass | `EvaluatePolicyExecution`、policy summary consumer 和 `PolicySummaryPort` 均承接 given policy summary 与 fail-closed;未生成 policy source truth。 |
| `Execution capture and material handoff` | pass | run、capture、handoff Command / Query / Event / Job 与 material / observability / event ports 均承接 Step 6 capture / handoff 对象;未宣布 artifact、runtime result、runner UI 或 observability store truth。 |
| `Failure control and safety closure` | pass | control、failure、cleanup、redline Command / Query / Consumer / Job 均承接 failure / control / lease / cleanup / redline 对象;未推进 runtime recover、business replay 或 cleanup 先删证据。 |
| `Local reference, projection and derived support` | pass | read projection、derived view、backend comparison、reconciliation 和 reference refresh 均只读 / 后台维护;未把 query、preview、trend、comparison 或 reconciliation 写成核心 mutation path。 |

---

## 15. 跨接口一致性审计表

| 审计项 | 结果 | 说明 |
|---|---|---|
| Command / Query / Event / Job 分类是否清楚 | pass | 写 truth 的入口均在 Command;只读入口均在 Query;外部变化经 Consumer;传播经 Outbound Event;维护经 Operations Job。 |
| 每个接口是否有 Step 6 对象承接 | pass | §7 和 §8~§13 均回指 context、boundary、policy、run / capture / handoff、failure / cleanup / redline、projection / derived / audit 对象。 |
| 是否存在对象能力没有接口入口 | pass | 关键对象至少有 Command、Query、Consumer、Job 或 port 入口;纯 guard 通过相邻 Command / Job 使用。 |
| 是否把内部 helper 当正式 API | pass | application service、repository、handler、adapter、DTO、SDK raw response 未写成 API;port 只作接缝骨架。 |
| 是否越过相邻仓 truth 边界 | pass | tools、runtime、member-service、identity、work、artifact、observability、policy source、investigation 均只以 refs、summary、material、handoff 或 event 协作。 |
| 是否违反 `L0-core` 唯一编译期依赖 | pass | 所有 sibling 和 backend 接缝均以 runtime / event / refs / summary / port 表达,未写 package dependency。 |
| policy 是否 fail-closed | pass | `EvaluatePolicyExecution`、`ConsumePolicySummaryChanged` 和 `PolicySummaryPort` 均显式保留 missing / conflicted / unsupported / stale 的保守语义。 |
| boundary 是否避免 silent degrade | pass | `EstablishExecutionBoundary` 和 `IsolationBackendPort` 输出 rejected / pending / failed,不得将能力不足写成 established。 |
| capture / handoff 是否迁移 ownership | pass | capture、handoff、material port 和 events 均只传播 candidate material / handoff fact,不宣布下游 formal truth。 |
| cleanup / redline 是否保守 | pass | cleanup 和 redline 入口、consumer、job、port 都受 guard / investigation summary 约束。 |
| query / derived 是否只读 | pass | query、projection、derived、comparison、reconciliation 均明确不写核心 truth。 |
| 是否提前进入详细设计 | pass | 未写 HTTP path、topic、DTO / event schema、完整 port trait、repository、DDL、事务、配置 key、测试或实施 boundary。 |

---

## 16. Step 8 / Step 9 反查清单

### 16.1 Step 8 关键处理流候选

| 预计处理流 | Step 7 入口 | 必须使用的 Step 6 对象 |
|---|---|---|
| 受控执行请求受理 / 拒绝 | `OpenControlledExecutionContext` | `ControlledExecutionContext`;`ExecutionContextResolution`;`ExecutionEnvironmentIdentity`;`ControlledExecutionIntakeGuard`;`SandboxAuditTrace` |
| refs / safe summary 解析与刷新 | `ConsumeCallerContextReferenceChanged`;`RefreshSandboxReferenceStates`;`ContextReferenceResolverPort` | `ContextReferenceResolution`;`ReferenceResolutionState`;`ExternalBodyExclusionGuard` |
| boundary requirement 合成与建立 | `EstablishExecutionBoundary`;`BackendCapabilityPort`;`IsolationBackendPort` | `BoundaryRequirementSet`;`BackendCapabilitySummary`;`BoundaryEstablishmentDecision`;`CoherentBoundary`;`IsolationEnvironmentHandle` |
| policy snapshot 与 fail-closed 裁定 | `EvaluatePolicyExecution`;`ConsumePolicySummaryChanged`;`PolicySummaryPort` | `PolicyApplicabilitySnapshot`;`PolicyExecutionDecision`;`HighRiskActionDecision`;`PolicyApplicabilityGuard`;`FailClosedPolicyGuard` |
| 受控执行运行承接 | `StartControlledExecutionRun`;`IsolationBackendPort` | `ControlledExecutionRun`;`CoherentBoundary`;`IsolationEnvironmentHandle`;`PolicyExecutionDecision` |
| capture 和候选材料收口 | `RecordCaptureResult` | `CaptureFact`;`CapturedMaterialRef`;`ObservabilityMaterial`;`CaptureCompletenessGuard` |
| material / observability handoff | `OpenMaterialHandoff`;`RetryPendingMaterialHandoffs`;`MaterialHandoffPort`;`ObservabilityMaterialPort` | `HandoffFact`;`HandoffOwnershipGuard`;`SandboxEventRelayRecord`;`MaterialHandoffStatusView` |
| failure / control 收束 | `SubmitSandboxControl`;`ClassifySandboxFailure`;`ConsumeSandboxControlRequested` | `FailureClassification`;`ControlFact`;`ControlConflictGuard`;`FailureControlStatusView` |
| lease / orphan / cleanup / reaper | `RunLeaseOrphanReaper`;`EvaluateCleanupReadiness`;`EvaluatePendingCleanupGuards` | `LeaseRecord`;`OrphanRecoveryRecord`;`CleanupGuard`;`CleanupSafetyGuard`;`CleanupReadinessView` |
| redline containment 与 investigation handoff | `RecordRedlineContainment`;`MaintainRedlineContainmentHandoffs`;`InvestigationHandoffPort` | `RedlineContainment`;`RedlineContainmentGuard`;`RedlineContainmentView`;`ReferenceResolutionState` |
| projection / derived / reconciliation 维护 | `RebuildSandboxReadProjections`;`MaintainDerivedInspectPreviewTrend`;`RunSandboxReconciliation` | `SandboxReadProjection`;`DerivedInspectPreviewTrendState`;`DerivedInspectPreviewTrendView`;`SandboxReconciliationReport`;`DerivedReadOnlyGuard` |
| event relay 发布与反馈 | `PublishSandboxEventRelay`;`ConsumeSandboxTruthRelayFeedback`;`EventRelayPort` | `SandboxEventRelayRecord`;`SandboxAuditTrace`;`SandboxReconciliationReport` |

### 16.2 Step 9 状态触发接口

| 状态主题 | 主要触发接口 |
|---|---|
| intake accepted / rejected / pending / unresolved | `OpenControlledExecutionContext`;`ConsumeCallerContextReferenceChanged` |
| execution identity active / closed / invalidated | `OpenControlledExecutionContext`;后续 Step 8 identity close / invalidate flow |
| boundary required / established / rejected / pending / failed / released | `EstablishExecutionBoundary`;`ConsumeBackendCapabilitySummaryChanged`;`ConsumeIsolationBackendLifecycleSignal` |
| policy accepted / rejected / blocked / pending / fail-closed | `EvaluatePolicyExecution`;`ConsumePolicySummaryChanged` |
| controlled run preparing / running / completed / failed / terminated | `StartControlledExecutionRun`;`RecordCaptureResult`;`SubmitSandboxControl`;`ConsumeIsolationBackendLifecycleSignal` |
| capture complete / partial / failed / unavailable | `RecordCaptureResult` |
| handoff pending / delivered / failed / retryable | `OpenMaterialHandoff`;`ConsumeMaterialHandoffStatusChanged`;`RetryPendingMaterialHandoffs` |
| failure / control stable / conflict / terminal | `ClassifySandboxFailure`;`SubmitSandboxControl`;`ConsumeSandboxControlRequested` |
| lease active / expiring / expired / orphaned / recovered | `EstablishExecutionBoundary`;`RunLeaseOrphanReaper`;`ConsumeIsolationBackendLifecycleSignal` |
| cleanup allowed / blocked / pending / completed | `EvaluateCleanupReadiness`;`EvaluatePendingCleanupGuards`;`ConsumeInvestigationHandoffStatusChanged` |
| redline detected / contained / handoff-pending / released / terminal | `RecordRedlineContainment`;`MaintainRedlineContainmentHandoffs`;`ConsumeInvestigationHandoffStatusChanged` |
| reference resolved / unresolved / stale / invalid / unavailable | `ConsumeCallerContextReferenceChanged`;`RefreshSandboxReferenceStates`;`ContextReferenceResolverPort` |
| derived fresh / stale / rebuilding / failed / unavailable | `RebuildSandboxReadProjections`;`MaintainDerivedInspectPreviewTrend`;`RunSandboxReconciliation`;truth / relay stale events |

---

## 17. 当前文档问题诊断

| 风险来源 | 问题 | 本轮处理 |
|---|---|---|
| 旧 README / 旧 `02` 的 `SandboxService` / provider / backend API 线索 | 容易把后端 adapter 或旧 trait 误写成正式 API 主语。 | 改为 Command / Query / Event / Job / Port 分类,后端只通过 `BackendCapabilityPort` 和 `IsolationBackendPort` 表达接缝。 |
| 旧事件名和 audit event 想象 | 容易把 topic / event payload / observability store 当成 truth。 | 本步只点名 outbound event 骨架和 `SandboxEventRelayRecord`,payload / topic 留给详细设计。 |
| 旧 allowlist / capability lookup | 容易把 policy source truth 写进 sandbox。 | `PolicySummaryPort` 只返回 refs、summary 和缺失 / 冲突 / unsupported markers。 |
| 旧 output / audit / artifact 混写 | 容易让 capture 直接变成 Artifact 或 evidence truth。 | `RecordCaptureResult` 与 `OpenMaterialHandoff` 分离,query / event 均标注不迁移 ownership。 |
| 旧 retry / replay / cleanup 主线 | 容易把 replay 写成业务重放,cleanup 写成运维脚本。 | `SubmitSandboxControl`、`RunLeaseOrphanReaper`、`EvaluateCleanupReadiness` 和 redline jobs 都作为 sandbox 正式接口 / 作业骨架。 |
| 外围 inspect / preview / trend | 容易变成隐藏写源。 | 全部归 Query / Operations Job / derived port,并由 `DerivedReadOnlyGuard` 保护。 |

---

## 18. 本步设计取舍

| 取舍 | 结论 | 理由 |
|---|---|---|
| 是否只输出五类接口,不写 ports | 不采用 | sandbox 的可落码边界高度依赖 backend、policy、material、observability、event、investigation 和 persistence 接缝;不点名 port 会导致 `03` 重新发明边界。 |
| 是否把 port trait 方法写全 | 不采用 | 完整 trait / method / error 属于详细设计,当前只写 port 的输入输出骨架和边界。 |
| 是否把 `StartControlledExecutionRun` 合并进 `EvaluatePolicyExecution` | 不采用 | policy 裁定与真实执行承接必须分离,防止 policy accepted 被误解为执行完成。 |
| 是否让 Inbound Event 直接建立核心 truth | 不允许 | 外部事实只能更新 refs、snapshot、handoff state、control fact 或 stale marker;核心写入必须走 Command / Job 规则。 |
| 是否把 event relay 发布作为 Command | 不采用 | 发布基于已成立 truth,属于 Operations Job;发布失败不回滚 truth。 |
| 是否为每个查询建独立处理流 | 暂不决定 | Step 8 再判断哪些 Query 需要独立 flow;当前仅收稳入口骨架。 |
| 是否使用旧 `SandboxExecution / Session / Command / Policy / Output` 命名接口 | 不采用 | 旧对象词未经当前对象 formalization,且混入 runtime / tools / policy / artifact 风险。 |

---

## 19. 回填草稿

正式 `02-概要设计.md` 后续整理时:

- §7 “API / 接口骨架”引用本文件 §6 的接口分类说明。
- §7 可摘录 §7 的按主要组成部分接口骨架表,作为正式章节总览。
- §7 必须摘录 §8~§12 的 Command、Query、Inbound Event Consumer、Outbound Event 和 Operations Job 骨架表,可按篇幅压缩说明文本,但不得删除读写边界。
- §7 应保留 §13 的 external / infrastructure port 骨架摘要,避免 `03` 因缺 port 边界重问 isolation backend、policy、handoff、observability、event、investigation 和 persistence 接缝。
- §7 不应搬入本文件 §17 的旧材料诊断全文,但应保留“旧 `SandboxService` / backend / event / API 线索为 historical material”的一句边界说明。
- Step 8 必须从本文件 §16 选择关键 Command / Consumer / Job / Query 展开处理流,不得发明 Step 7 未定义的正式入口。

---

## 20. 待确认事项

| 待确认项 | 当前处理 | 后续落点 |
|---|---|---|
| 是否需要拆分 `OpenControlledExecutionContext` 与 execution identity bind 为两个 Command | 当前合并为一个概要 Command,因为两者共同完成正式受理入口;Step 8 可拆处理流阶段。 | Step 8 / `03` |
| `StartControlledExecutionRun` 是否同步启动还是只记录准备状态 | 当前只表达正式受控执行承接入口,不规定同步 / worker / backend 调用形态。 | Step 8 / `03` / `04` / `07` |
| handoff ack / failed / retryable 具体协议 | 当前只定义 consumer / job / handoff status 骨架。 | `03` / `04` / `05` / `06` |
| backend capability matrix、正式 / 测试承载边界和 fake parity | 当前只定义 `BackendCapabilityPort` / `IsolationBackendPort` 概要 port。 | `03` / `04` / `05` / `07` |
| event / outbox / topic / retry / ordering 机制 | 当前只定义 outbound event、relay record 和 publish job。 | `03` / `05` / `07` |
| failure taxonomy、control conflict、redline release 条件 | 当前只定义接口和对象入口,不锁完整状态矩阵。 | Step 9 / Step 10 / `03` |

本步不新增阻塞 Step 8 的上游 blocker。上述待确认项均按概要层可接受挂起处理,不得在 Step 8 或正式 §7 伪装成已确认协议、产品、测试或实施结论。

---

## 21. 自检与进入下一步条件

| 检查项 | 结果 |
|---|---|
| 已明确 Command / Query / Inbound Event Consumer / Outbound Event / Operations Job 分类 | pass |
| 已按主要组成部分标注接口归属 | pass |
| 每个接口均回指 Step 6 对象或对象能力 | pass |
| Command 输入已显式要求 `ActorContext` / `SystemActorContext`、`CommandMetadata`、`IdempotencyKey` 和 trace context | pass |
| Query 输入已显式要求 `ActorContext` 和 `QueryMetadata` | pass |
| Event Consumer 输入已显式要求 envelope、source event id、source ref、schema version、dedup key 和 trace context | pass |
| 已额外输出 external / infrastructure port 骨架并说明其不是领域对象或编译期依赖 | pass |
| 已完成接口归属停审记录 | pass |
| 已完成跨接口一致性审计 | pass |
| 已输出 Step 8 / Step 9 反查清单 | pass |
| 未写 HTTP path、RPC method、topic、完整 DTO / event schema、repository 函数、事务、配置 key、测试或实施 boundary | pass |
| 未修改正式 `projects/L4-sandbox/02-概要设计.md` | pass |
| 是否可以进入 Step 8 | 需要用户审查并明确确认后,才能进入 Step 8 `关键处理流 / 重要函数数据流`。 |

进入下一步条件:

```text
Step 7 `API / 接口骨架` 已完成,gate_status = pass_wait_review。
等待用户审查本文件。
用户确认后,才能进入 Step 8 `关键处理流 / 重要函数数据流`。
```
