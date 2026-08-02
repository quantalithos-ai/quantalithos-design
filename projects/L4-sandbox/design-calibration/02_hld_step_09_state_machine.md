# Step 9. 状态定义与状态流转

> 对应 SOP: `standards/document/概要设计讨论流程_SOP.md` Step 9
> 回填章节: `02-概要设计.md` §9 状态定义与状态流转
> 生成日期: 2026-07-08
> 状态: completed_wait_user_review
> 所属流程: `02_hld_calibration_flow.md`
> 本 Step 口径: 围绕 Step 6 已正式化关键对象和 Step 8 已确认的 12 条关键处理流,收敛会影响 sandbox 受控执行隔离闭环成立的正式状态主题、状态含义、允许迁移、禁止迁移和状态传播关系。本步允许点名对象状态、触发接口 / Consumer / Job 与下游只读 / relay 影响,但不写状态机代码、数据库状态列、错误码全集、topic / outbox payload、事务脚本、补偿脚本、配置 key 或测试结果。

---

## 1. Step 开工确认

| 检查项 | 结论 |
|---|---|
| 用户是否已确认进入 Step 9 | 是。Step 8 审查点后用户已明确回复“同意”。 |
| 项目级台账是否允许进入 Step 9 | 是。`project_execution_ledger.md` 已将恢复点停在 `02-概要设计.md` Step 8,用户确认后允许进入 Step 9。 |
| 文档级 flow 是否允许进入 Step 9 | 是。`02_hld_calibration_flow.md` 已记录 Step 8 `pass_wait_review`,进入 Step 9 的门禁已满足。 |
| 是否已读取 Step 6 关键对象附录 | 是。A/B/C/D 四个附录已提供精确状态候选、对象责任和 guard 边界。 |
| 是否已读取 Step 7 接口骨架 | 是。Step 7 已提供会触发状态迁移的 Command / Query / Consumer / Job / Port 骨架。 |
| 是否已读取 Step 8 关键处理流 | 是。Step 8 §17 已提供状态主题与处理流反查清单。 |
| 是否已读取概要 SOP Step 9 与书写规范 §4.9 | 是。必须输出状态定义表、状态流转图、允许 / 禁止迁移、传播关系、状态归属停审和跨状态一致性审计。 |
| 是否发现阻塞 Step 9 的上游 blocker | 否。policy 来源矩阵、handoff ack 协议、failure taxonomy 细化、projection rebuild 机制和 retention 细节仍待后续阶段继续展开,但不阻塞概要层状态机收稳。 |

---

## 2. 本步目标

本步把 Step 6 的关键对象状态候选和 Step 8 的处理流触发关系收束为可继续落到 `03-详细设计.md` 的正式状态机口径。

本步要回答:

- 本仓是否存在正式状态机,是单一全局状态机还是多个并行状态机。
- 哪些状态属于核心 truth,哪些属于 guard / lifecycle,哪些属于 read projection / relay / derived state。
- 每个状态是否允许进入正常主线,还是只用于拒绝、降级、交接、调查、回收或只读展示。
- 哪些接口、Consumer 或 Job 会触发状态迁移,哪些迁移必须显式禁止。
- 状态变化如何影响 audit trace、event relay、projection stale marker、derived rebuild、handoff status 和只读汇总面。
- 每个状态主题属于哪个主要组成部分和哪个关键对象,是否存在跨组成部分同名 / 近义混淆。

本步不新增 Step 6 未正式化的关键对象,不新增 Step 8 未出现的状态主语,不把 tools semantic execution、runtime agent loop、member host lifecycle、artifact truth、observability store、policy definition / approval / allowlist / capability truth 混入 sandbox 状态机。

---

## 3. 本步输入

| 输入 | 状态 | 用途 |
|---|---|---|
| `02_hld_step_06_key_objects.md` | 已完成 | 提供 Step 9 必须回指的对象分组、反查主题和禁止事项。 |
| `02_hld_step_06_key_objects_intake_boundary.md` | 已完成 | 提供 intake、identity、context resolution、boundary、backend capability 和 isolation handle 的状态集合。 |
| `02_hld_step_06_key_objects_policy_capture.md` | 已完成 | 提供 policy snapshot / decision、高风险动作、run、capture、material、observability 和 handoff 状态集合。 |
| `02_hld_step_06_key_objects_failure_safety.md` | 已完成 | 提供 failure、control、lease、orphan、cleanup 和 redline 状态集合。 |
| `02_hld_step_06_key_objects_projection_audit.md` | 已完成 | 提供 reference、projection、derived、reconciliation、audit trace、relay 和 summary view 状态集合。 |
| `02_hld_step_07_api_interface_skeleton.md` | 已完成 | 提供状态触发接口、Consumer、Job 和 port 接缝骨架。 |
| `02_hld_step_08_processing_flows.md` | 已完成 | 提供 12 条关键处理流和 Step 9 状态机反查清单。 |
| `projects/L4-sandbox/00-需求文档.md` §7 / §9 / §11 / §14 / §16 | 当前正式需求基线 | 约束 execution isolation truth、FR / BR / AC / VF 和边界红线。 |
| `projects/L4-sandbox/01-架构设计.md` §4 / §6 / §8 / §9 / §10 / §15 / §16 | 当前正式架构基线 | 约束核心 / 支撑子域、数据所有权、通信分层、fail-closed 和 cleanup / redline 承接。 |
| `standards/document/概要设计讨论流程_SOP.md` Step 9 | 已读取 | 约束本步必须输出状态表、图、迁移清单、停审和一致性审计。 |
| `standards/document/概要设计书写规范.md` §4.9 | 已读取 | 约束状态定义表写法、ASCII 图格式和传播关系图。 |
| L1 artifact / governance Step 9 样例 | 已读取 | 参考“多并行状态机 + 传播关系 + 停审记录”的粒度。 |
| 旧 `README.md` / 旧 `02-概要设计.md` | historical_material | 仅用于诊断旧单线叙事、旧对象词和旧 retry / cleanup 主线污染风险。 |

---

## 4. Step 内计划

| 顺序 | 动作 | 状态 | 产物 / 门禁 |
|---:|---|---|---|
| 1 | 读取台账、flow、Step 6 附录、Step 7 / 8、正式 `00/01` 和 Step 9 标准。 | done | 确认用户已允许进入 Step 9,正式 `02` 不修改。 |
| 2 | 从 Step 8 §17 反查清单提炼状态主题,按主要组成部分和对象家族分组。 | done | 形成 6 组并行状态机,避免拼装单一全局状态机。 |
| 3 | 回答 Step 9 SOP 问题。 | done | 明确正式状态、触发动作、允许 / 禁止迁移、传播关系和归属边界。 |
| 4 | 输出状态定义表和状态流转 ASCII 图。 | done | 每个状态都能回指 Step 6 对象和 Step 8 触发流。 |
| 5 | 输出允许迁移、禁止迁移、传播关系、状态归属停审和跨状态一致性审计。 | done | 保证 Step 10 / `03` 不会重新发明状态机。 |
| 6 | 更新 flow 和项目级台账,并停在用户审查点。 | done | Step 9 已进入 wait review,未跨到 Step 10。 |

---

## 5. SOP 问题回答

### 5.1 本仓有哪些影响主线成立的正式状态?

`L4-sandbox` 存在正式状态机,但不是单一全局状态机。当前概要层收稳 6 组并行状态主题:

1. `Intake / identity / intake-reference` 状态: `ControlledExecutionContext`、`ExecutionEnvironmentIdentity`、`ExecutionContextResolution`、`ContextReferenceResolution`。
2. `Boundary / capability / environment lifecycle` 状态: `CoherentBoundary`、`BoundaryEstablishmentDecision`、`BackendCapabilitySummary`、`IsolationEnvironmentHandle`。
3. `Policy / high-risk launch decision` 状态: `PolicyApplicabilitySnapshot`、`PolicyExecutionDecision`、`HighRiskActionDecision`。
4. `Run / capture / material handoff` 状态: `ControlledExecutionRun`、`CaptureFact`、`CapturedMaterialRef`、`ObservabilityMaterial`、`HandoffFact`。
5. `Failure / control / cleanup / redline` 状态: `FailureClassification`、`ControlFact`、`LeaseRecord`、`OrphanRecoveryRecord`、`CleanupGuard`、`RedlineContainment`。
6. `Reference refresh / projection / derived / reconciliation / relay / read surface` 状态: `ReferenceResolutionState`、`DerivedInspectPreviewTrendState`、`SandboxReadProjection`、`SandboxReconciliationReport`、`SandboxAuditTrace`、`SandboxEventRelayRecord`、`SandboxExecutionStatusView`、`PolicyDecisionSummaryView`。

`BoundaryStatusView`、`CaptureSummaryView`、`MaterialHandoffStatusView`、`FailureControlStatusView`、`CleanupReadinessView` 和 `RedlineContainmentView` 属于只读镜像,不在 Step 9 单独再建第二套独立 truth 状态机;它们通过源对象状态传播得到查询态。

### 5.2 每个状态的含义是什么,哪些可以进入正常主线?

可以作为核心正常主线前提或主线中间态的正式状态只有:

- `ControlledExecutionContext::Accepted`
- `ExecutionEnvironmentIdentity::Active`
- `ExecutionContextResolution::Resolved`
- `ContextReferenceResolution::Complete`
- `CoherentBoundary::Established`
- `BoundaryEstablishmentDecision::Established`
- `BackendCapabilitySummary::Fresh`
- `IsolationEnvironmentHandle::Active`
- `PolicyApplicabilitySnapshot::Applicable`
- `PolicyExecutionDecision::Accepted`
- `HighRiskActionDecision::Allowed`
- `ControlledExecutionRun::Preparing` / `Running` / `Completed`
- `CaptureFact::Complete`

属于受限主线、降级主线、保守收束或只读态的状态包括:

- intake pending / unresolved / rejected。
- capability stale / unknown / unsupported。
- policy missing / conflicted / stale、decision pending / blocked / fail-closed。
- capture partial / failed / unavailable,material handoff pending / failed / retryable。
- failure classified / terminal、control conflicted、lease expiring / expired、cleanup pending / blocked、redline detected / contained / handoff-pending。
- projection stale / rebuilding / degraded / unavailable、derived failed / unavailable、relay failed / retryable / dead-letter。

### 5.3 哪些接口、事件或动作会触发状态迁移?

- Command 触发核心 truth 状态迁移: `OpenControlledExecutionContext`、`EstablishExecutionBoundary`、`EvaluatePolicyExecution`、`StartControlledExecutionRun`、`RecordCaptureResult`、`OpenMaterialHandoff`、`SubmitSandboxControl`、`ClassifySandboxFailure`、`EvaluateCleanupReadiness`、`RecordRedlineContainment`。
- Inbound Event Consumer 只触发 refs、snapshot、handle lifecycle、handoff、control request、investigation summary、relay feedback 或 stale marker 迁移: `ConsumeCallerContextReferenceChanged`、`ConsumeBackendCapabilitySummaryChanged`、`ConsumeIsolationBackendLifecycleSignal`、`ConsumePolicySummaryChanged`、`ConsumeMaterialHandoffStatusChanged`、`ConsumeObservabilityHandoffStatusChanged`、`ConsumeSandboxControlRequested`、`ConsumeInvestigationHandoffStatusChanged`、`ConsumeSandboxTruthRelayFeedback`。
- Operations Job 只触发 relay、refresh、retry、projection rebuild、derived maintenance、reconciliation 和 reaper 迁移: `RefreshSandboxReferenceStates`、`RefreshBackendCapabilitySummaries`、`RetryPendingMaterialHandoffs`、`PublishSandboxEventRelay`、`RunLeaseOrphanReaper`、`EvaluatePendingCleanupGuards`、`MaintainRedlineContainmentHandoffs`、`RebuildSandboxReadProjections`、`MaintainDerivedInspectPreviewTrend`、`RunSandboxReconciliation`。
- Query 不触发持久状态迁移;`GetSandboxReadProjection`、`GetDerivedInspectPreviewTrend`、`GetBackendCapabilityComparison`、`GetSandboxReconciliationReport` 只暴露当前状态。

### 5.4 哪些迁移明确允许,哪些迁移明确禁止?

允许迁移见 §10。当前口径坚持:

- core truth 只能沿正式受理 -> 边界成立 -> policy 裁定 -> run -> capture / handoff 或 failure / cleanup / redline 收束推进。
- read / derived / relay 状态只能跟随已成立 truth 传播或维护,不得反写核心 truth。
- cleanup、orphan recovery 和 redline 只能在 guard 明确允许时推进 release / completed / released。

禁止迁移见 §11。当前明确禁止:

- `Rejected`、`Closed`、`Released`、`Terminal`、`DeadLetter` 等终态在同一事实上被静默复活。
- `FailClosed`、`Blocked`、`Rejected` 被 query、view、consumer 反馈或 relay 成功隐式改写为 `Accepted`。
- `CaptureFact`、`HandoffFact`、`SandboxEventRelayRecord` 的失败被静默回滚为未发生。
- projection / derived / comparison / reconciliation 结果直接改写 context、boundary、policy、run、capture、cleanup 或 redline truth。

### 5.5 状态变化如何影响 outbox、projection、下游感知或只读供给?

- 所有核心 truth 变化必须记录 `SandboxAuditTrace`,并可选打开 `SandboxEventRelayRecord`。
- `ControlledExecutionContext`、`CoherentBoundary`、`PolicyExecutionDecision`、`ControlledExecutionRun`、`CaptureFact`、`FailureClassification`、`CleanupGuard`、`RedlineContainment` 的变更会使 `SandboxReadProjection` 进入 `Stale` 或 `Degraded`。
- `CaptureFact`、`CapturedMaterialRef`、`ObservabilityMaterial`、`HandoffFact` 的变化会驱动 handoff status view、cleanup blocking 和 relay。
- `ReferenceResolutionState`、`BackendCapabilitySummary`、`PolicyApplicabilitySnapshot`、`SandboxEventRelayRecord` 的变化会驱动 derived rebuild、comparison、reconciliation 和 visible degraded surface。
- `SandboxExecutionStatusView`、`PolicyDecisionSummaryView` 只是只读汇总,不能触发反向状态推进。

### 5.6 每个状态属于哪个主要组成部分或关键对象?

状态归属见 §13。所有正式状态都能回指 Step 6 已定义对象,没有新增未 formalize 的状态承载主语。

### 5.7 状态触发接口和处理流是否已在 Step 7 / Step 8 定义?

是。Step 9 仅使用 Step 8 §17 反查清单中的状态主题和触发处理流。若后续发现缺口,必须回退修正 Step 6 / Step 8,而不是在 Step 9 或正式 `02` 中隐式发明新状态主语。

### 5.8 是否存在同名 / 近义状态跨组成部分语义冲突?

存在近义词,但当前已显式拆开:

- `PendingResolution`、`PendingCapability`、`PendingAuthorization`、`PendingInput`、`PendingEvidence`、`PendingInvestigation` 都不是同一件事,分别归 intake、boundary、policy、failure、cleanup。
- `Rejected`、`Blocked`、`FailClosed` 也不是同义词: `Rejected` 是明示拒绝,`Blocked` 是高风险动作或前置 guard 阻断,`FailClosed` 是策略缺失 / 冲突 / 不支持导致保守拒绝。
- `Released` 既出现在 `CoherentBoundary` 也出现在 `RedlineContainment`,但前者表示环境边界生命周期释放,后者表示安全 containment 解除,两者 owner 和触发流不同。

### 5.9 每个主要组成部分的状态集合完成后是否通过停审?

是。§14 已逐主要组成部分记录停审结论:状态对象已归属、触发接口 / 处理流可反查、允许 / 禁止迁移清晰、传播关系没有跨仓越界。

---

## 6. 当前文档问题诊断

| 风险来源 | 问题 | 本轮处理 |
|---|---|---|
| 旧 README / 旧 `02` 的单线 service 叙事 | 容易把 sandbox 状态机压缩成“调后端执行 -> 成功 / 失败”。 | 改为 6 组并行状态机,显式拆出 intake、boundary、policy、run、capture、failure、cleanup、redline 和 read / relay。 |
| capture / handoff / artifact 混写 | 容易让 `CaptureFact` 直接升级为 artifact truth 或 evidence truth。 | `CaptureFact`、`CapturedMaterialRef`、`ObservabilityMaterial`、`HandoffFact` 分别承载不同状态,并用 `HandoffOwnershipGuard` 防止 ownership 漂移。 |
| cleanup / reaper / redline 被当作运维脚本 | 容易让非 happy path 变成旁路行为,不形成正式状态。 | `LeaseRecord`、`OrphanRecoveryRecord`、`CleanupGuard`、`RedlineContainment` 都作为一等状态主体 formalize。 |
| view / relay / comparison 反写 truth | 容易让 query、preview、comparison、event feedback 成为隐藏写源。 | `SandboxReadProjection`、`DerivedInspectPreviewTrendState`、`SandboxReconciliationReport`、`SandboxExecutionStatusView`、`PolicyDecisionSummaryView` 均明确为只读或派生状态。 |
| 旧 policy / allowlist 叙事 | 容易把 sandbox 写成 policy truth owner。 | `PolicyApplicabilitySnapshot` 和 `PolicyExecutionDecision` 只消费给定摘要,并用 `FailClosedPolicyGuard` 固化保守失败边界。 |

---

## 7. 状态机拆分原则

### 7.1 状态层级划分

| 层级 | 承载对象 | 说明 |
|---|---|---|
| 核心 truth 状态 | `ControlledExecutionContext`;`ExecutionEnvironmentIdentity`;`CoherentBoundary`;`PolicyExecutionDecision`;`ControlledExecutionRun`;`CaptureFact`;`FailureClassification`;`ControlFact`;`CleanupGuard`;`RedlineContainment` | 决定 sandbox 主线是否成立、是否继续、是否失败或是否允许收束。 |
| 边界 / lifecycle / guard 状态 | `ExecutionContextResolution`;`ContextReferenceResolution`;`BoundaryEstablishmentDecision`;`BackendCapabilitySummary`;`IsolationEnvironmentHandle`;`PolicyApplicabilitySnapshot`;`HighRiskActionDecision`;`LeaseRecord`;`OrphanRecoveryRecord`;`CapturedMaterialRef`;`ObservabilityMaterial`;`HandoffFact` | 为核心 truth 提供建立、验证、交接、清理和保守回收语义。 |
| 只读 / 派生 / 传播状态 | `ReferenceResolutionState`;`DerivedInspectPreviewTrendState`;`SandboxReadProjection`;`SandboxReconciliationReport`;`SandboxAuditTrace`;`SandboxEventRelayRecord`;`SandboxExecutionStatusView`;`PolicyDecisionSummaryView` | 跟随 truth 变化而变化,不反写主线。 |

### 7.2 不单独建模的只读视图

以下对象在 Step 9 不再额外建立独立 truth 状态机,原因是它们只镜像源对象状态:

- `BoundaryStatusView`
- `CaptureSummaryView`
- `MaterialHandoffStatusView`
- `FailureControlStatusView`
- `CleanupReadinessView`
- `RedlineContainmentView`

它们的 visible status 由源状态在 §12 传播关系中统一说明。

### 7.3 状态触发来源约束

- 核心 truth 状态只能由 Step 7 Command 或 Step 8 明确点名的 Consumer / Job 触发。
- Consumer 只能刷新摘要、来源状态、lifecycle marker、handoff feedback、relay feedback 或 stale marker,不得直接创建核心 success。
- Query 不允许触发任何持久状态迁移。
- Job 只能基于已持久化 truth、refs 或 pending record 推动传播、刷新、重建、回收或对账。

---

## 8. 状态定义表

### 8.1 Intake / Identity / Intake Reference

| 状态主体 | 状态 | 含义 | 是否可进入正常主线 | 主要触发 |
|---|---|---|---|---|
| `ControlledExecutionContext` | `PendingResolution` | 已收下请求,但必需 refs / summary / 责任链仍待闭口。 | 否 | `OpenControlledExecutionContext`;`ConsumeCallerContextReferenceChanged` |
| `ControlledExecutionContext` | `Accepted` | 已形成正式受控执行语境,允许进入 boundary / policy 判断。 | 是 | `OpenControlledExecutionContext` |
| `ControlledExecutionContext` | `Rejected` | 不满足最小语境或明确拒绝条件。 | 否 | `OpenControlledExecutionContext` |
| `ControlledExecutionContext` | `Unresolved` | 必需外部 refs 不可解析、冲突或待人工介入。 | 否 | `OpenControlledExecutionContext`;`ConsumeCallerContextReferenceChanged` |
| `ControlledExecutionContext` | `Closed` | 当前语境已终止、清理或归档为只读。 | 否 | cleanup / reaper / redline 收束 |
| `ExecutionEnvironmentIdentity` | `Active` | 执行环境身份已成立,可被 boundary、policy、capture 和 failure 回指。 | 是 | `OpenControlledExecutionContext`;identity bind |
| `ExecutionEnvironmentIdentity` | `Closed` | 执行环境生命周期已正常收束。 | 否 | cleanup / normal close |
| `ExecutionEnvironmentIdentity` | `Invalidated` | 责任链或 refs 被确认失效,后续执行不得继续。 | 否 | ref invalidation / redline / close |
| `ExecutionContextResolution` | `Resolved` | 必需 refs 和 safe summary 足以支撑正式受理。 | 是 | resolver 完成;`OpenControlledExecutionContext` |
| `ExecutionContextResolution` | `Partial` | 非核心摘要缺失,允许停留在 pending / degraded 判断。 | 受限 | resolver 完成 |
| `ExecutionContextResolution` | `Unresolved` | 必需 refs 缺失或暂不可解析。 | 否 | resolver 完成;ref change |
| `ExecutionContextResolution` | `Conflicted` | refs 或摘要冲突,不得继续执行。 | 否 | resolver 完成;ref change |
| `ContextReferenceResolution` | `Complete` | intake 所需 refs 已解析到 safe summary。 | 是 | resolver 完成 |
| `ContextReferenceResolution` | `Stale` | refs 仍存在,但 safe summary 可能过期。 | 受限 | ref change / refresh marker |
| `ContextReferenceResolution` | `Unavailable` | 来源不可用,当前无法闭合 intake。 | 否 | resolver / source unavailable |
| `ContextReferenceResolution` | `Invalid` | 引用格式、归属或边界不合法。 | 否 | resolver / guard 拒绝 |

### 8.2 Boundary / Capability / Environment Lifecycle

| 状态主体 | 状态 | 含义 | 是否可进入正常主线 | 主要触发 |
|---|---|---|---|---|
| `CoherentBoundary` | `Required` | 边界需求已形成,尚未正式建立。 | 否 | `EstablishExecutionBoundary` |
| `CoherentBoundary` | `Established` | resource / filesystem / network / process 等必需限制已共同成立。 | 是 | `EstablishExecutionBoundary` |
| `CoherentBoundary` | `Rejected` | 需求不允许或不可满足。 | 否 | `EstablishExecutionBoundary` |
| `CoherentBoundary` | `PendingCapability` | 缺能力摘要或 workspace 摘要,只能等待。 | 否 | `EstablishExecutionBoundary`;capability change |
| `CoherentBoundary` | `Failed` | 建立过程中失败或无法验证。 | 否 | `EstablishExecutionBoundary`;backend lifecycle signal |
| `CoherentBoundary` | `Released` | 边界已收束或环境已释放。 | 否 | cleanup / release |
| `BoundaryEstablishmentDecision` | `Established` | 正式裁定当前边界可以建立。 | 是 | `EstablishExecutionBoundary` |
| `BoundaryEstablishmentDecision` | `Rejected` | 正式裁定当前边界不可建立。 | 否 | `EstablishExecutionBoundary` |
| `BoundaryEstablishmentDecision` | `PendingCapability` | 需要等待更完整 capability summary。 | 否 | `EstablishExecutionBoundary`;capability refresh |
| `BoundaryEstablishmentDecision` | `Unsupported` | 后端明确不支持必需限制。 | 否 | `EstablishExecutionBoundary`;capability refresh |
| `BoundaryEstablishmentDecision` | `Failed` | 建立动作或验证动作失败。 | 否 | `EstablishExecutionBoundary`;backend failure |
| `BackendCapabilitySummary` | `Fresh` | 可用于当前边界裁定。 | 是 | `RefreshBackendCapabilitySummaries`;consumer update |
| `BackendCapabilitySummary` | `Stale` | 摘要过期,只能 refresh 或 pending。 | 受限 | consumer update;time drift |
| `BackendCapabilitySummary` | `Unknown` | 缺失能力信息,不得 permissive fallback。 | 否 | probe missing / initial state |
| `BackendCapabilitySummary` | `Unsupported` | 已知不支持必需边界能力。 | 否 | probe result / consumer update |
| `IsolationEnvironmentHandle` | `Created` | 后端环境已创建,但尚未进入运行。 | 受限 | `EstablishExecutionBoundary` |
| `IsolationEnvironmentHandle` | `Active` | 环境可用于已授权受控执行。 | 是 | `StartControlledExecutionRun`;lifecycle signal |
| `IsolationEnvironmentHandle` | `ReleasePending` | 等待 cleanup guard 放行或后端释放完成。 | 受限 | cleanup / reaper / redline |
| `IsolationEnvironmentHandle` | `Released` | 环境已释放。 | 否 | cleanup / reaper / normal release |
| `IsolationEnvironmentHandle` | `OrphanSuspected` | sandbox truth 与后端 lifecycle 不一致。 | 否 | `RunLeaseOrphanReaper`;backend lifecycle signal |

### 8.3 Policy / High-Risk Launch Decision

| 状态主体 | 状态 | 含义 | 是否可进入正常主线 | 主要触发 |
|---|---|---|---|---|
| `PolicyApplicabilitySnapshot` | `Applicable` | 给定 policy / authorization 摘要足以进行执行裁定。 | 是 | `EvaluatePolicyExecution`;policy summary consumer |
| `PolicyApplicabilitySnapshot` | `Missing` | 必需 policy 或 authorization 缺失。 | 否 | `EvaluatePolicyExecution`;policy summary consumer |
| `PolicyApplicabilitySnapshot` | `Conflicted` | policy 输入互相冲突。 | 否 | `EvaluatePolicyExecution`;policy summary consumer |
| `PolicyApplicabilitySnapshot` | `Unsupported` | 当前动作或后端不支持对应策略。 | 否 | `EvaluatePolicyExecution`;capability change |
| `PolicyApplicabilitySnapshot` | `Stale` | 摘要过期,不得直接继续。 | 受限 | policy summary change;reference refresh |
| `PolicyExecutionDecision` | `Accepted` | sandbox 裁定允许继续执行。 | 是 | `EvaluatePolicyExecution` |
| `PolicyExecutionDecision` | `Rejected` | policy 或 authorization 明示拒绝。 | 否 | `EvaluatePolicyExecution` |
| `PolicyExecutionDecision` | `Blocked` | 高风险动作或前置条件阻断。 | 否 | `EvaluatePolicyExecution`;high-risk evaluation |
| `PolicyExecutionDecision` | `Pending` | 等待 policy / authorization / capability 摘要。 | 否 | `EvaluatePolicyExecution`;policy summary consumer |
| `PolicyExecutionDecision` | `FailClosed` | 缺失、冲突、不支持或不可解析导致保守失败。 | 否 | `EvaluatePolicyExecution`;`ConsumePolicySummaryChanged` |
| `HighRiskActionDecision` | `Allowed` | 当前高风险动作在给定 policy 内。 | 是 | `EvaluatePolicyExecution` |
| `HighRiskActionDecision` | `Blocked` | 动作越界或未授权,必须阻断。 | 否 | `EvaluatePolicyExecution`;redline / policy reevaluation |
| `HighRiskActionDecision` | `PendingAuthorization` | 还缺授权摘要。 | 否 | `EvaluatePolicyExecution`;policy summary consumer |
| `HighRiskActionDecision` | `Unsupported` | 当前边界或后端无法安全执行该动作。 | 否 | `EvaluatePolicyExecution`;capability change |

### 8.4 Run / Capture / Material Handoff

| 状态主体 | 状态 | 含义 | 是否可进入正常主线 | 主要触发 |
|---|---|---|---|---|
| `ControlledExecutionRun` | `Preparing` | context、boundary 和 policy 已成立,准备启动。 | 是 | `StartControlledExecutionRun` |
| `ControlledExecutionRun` | `Running` | 已在正式隔离边界内执行。 | 是 | `StartControlledExecutionRun`;backend lifecycle signal |
| `ControlledExecutionRun` | `Completed` | 运行完成,等待或已进入 capture / handoff。 | 是 | `RecordCaptureResult`;run completion signal |
| `ControlledExecutionRun` | `Failed` | 运行失败,需 failure classification。 | 否 | `ClassifySandboxFailure`;backend signal |
| `ControlledExecutionRun` | `Terminated` | 被 control、cleanup 或 redline 终止。 | 否 | `SubmitSandboxControl`;`RecordRedlineContainment` |
| `CaptureFact` | `Complete` | 所需输出和材料已捕获。 | 是 | `RecordCaptureResult` |
| `CaptureFact` | `Partial` | 部分捕获完成,需显式暴露缺口。 | 受限 | `RecordCaptureResult` |
| `CaptureFact` | `Failed` | 捕获失败,必须进入 failure / control 语义。 | 否 | `RecordCaptureResult` |
| `CaptureFact` | `Unavailable` | 材料当前不可用或读取面降级。 | 否 | `RecordCaptureResult`;late read failure |
| `CapturedMaterialRef` | `Captured` | 候选材料已被 sandbox 捕获。 | 受限 | `RecordCaptureResult` |
| `CapturedMaterialRef` | `HandoffPending` | 已准备交接但尚未确认。 | 受限 | `OpenMaterialHandoff`;retry job |
| `CapturedMaterialRef` | `HandoffFailed` | 下游交接失败。 | 否 | handoff consumer / retry exhaustion |
| `CapturedMaterialRef` | `HandoffAccepted` | 下游确认接收,但不迁移 formal truth ownership。 | 受限 | handoff consumer |
| `CapturedMaterialRef` | `RetentionBlocked` | cleanup guard 阻止删除或释放。 | 否 | `EvaluateCleanupReadiness`;cleanup guard reevaluate |
| `ObservabilityMaterial` | `Prepared` | usage / audit / trace / metric 材料已准备。 | 受限 | `RecordCaptureResult`;failure / cleanup audit |
| `ObservabilityMaterial` | `HandoffPending` | 等待 observability 侧接收。 | 受限 | `OpenMaterialHandoff`;retry job |
| `ObservabilityMaterial` | `HandoffFailed` | 观测材料交接失败。 | 否 | observability handoff consumer |
| `ObservabilityMaterial` | `HandoffRecorded` | 已记录交接事实,不代表 observability store truth。 | 受限 | observability handoff consumer |
| `HandoffFact` | `Pending` | 交接已发起但未确认。 | 受限 | `OpenMaterialHandoff` |
| `HandoffFact` | `Delivered` | 下游已确认接收。 | 受限 | `ConsumeMaterialHandoffStatusChanged`;`ConsumeObservabilityHandoffStatusChanged` |
| `HandoffFact` | `Failed` | 交接失败,需后续处理。 | 否 | handoff consumer |
| `HandoffFact` | `Retryable` | 交接失败但允许重试。 | 受限 | handoff consumer;retry job |
| `HandoffFact` | `BlockedByCleanupGuard` | cleanup guard 当前阻断删除或释放。 | 否 | `EvaluateCleanupReadiness`;investigation summary change |

### 8.5 Failure / Control / Cleanup / Redline

| 状态主体 | 状态 | 含义 | 是否可进入正常主线 | 主要触发 |
|---|---|---|---|---|
| `FailureClassification` | `PendingInput` | 还缺 material、backend 或 control 反馈。 | 否 | `ClassifySandboxFailure`;consumer feedback |
| `FailureClassification` | `Classified` | 已形成稳定失败分类。 | 否 | `ClassifySandboxFailure` |
| `FailureClassification` | `Superseded` | 后续 control 或 redline 改变了失败解释。 | 否 | `SubmitSandboxControl`;`RecordRedlineContainment` |
| `FailureClassification` | `Terminal` | 失败已作为终态收束。 | 否 | cleanup / redline / final control |
| `ControlFact` | `Accepted` | 控制动作已作为正式事实受理。 | 否 | `SubmitSandboxControl`;`ConsumeSandboxControlRequested` |
| `ControlFact` | `IgnoredDuplicate` | 重复控制信号已被收束。 | 否 | `SubmitSandboxControl`;consumer dedupe |
| `ControlFact` | `Conflicted` | 与现有状态冲突,必须显式记录。 | 否 | `SubmitSandboxControl` |
| `ControlFact` | `Completed` | 控制动作执行完成。 | 否 | control execution result |
| `ControlFact` | `Failed` | 控制执行失败。 | 否 | control execution result |
| `LeaseRecord` | `Active` | 当前 lease 有效。 | 受限 | boundary establish / handle create |
| `LeaseRecord` | `Expiring` | 即将过期,需要后台检查。 | 受限 | reaper schedule / time drift |
| `LeaseRecord` | `Expired` | 已过期,可能触发 orphan / cleanup。 | 否 | `RunLeaseOrphanReaper` |
| `LeaseRecord` | `Released` | 对应环境已释放。 | 否 | cleanup / reaper success |
| `LeaseRecord` | `OrphanSuspected` | lease 与后端状态不一致。 | 否 | backend lifecycle signal;reaper |
| `OrphanRecoveryRecord` | `Suspected` | 发现可能存在孤儿环境。 | 否 | `RunLeaseOrphanReaper` |
| `OrphanRecoveryRecord` | `Confirmed` | 已确认孤儿环境。 | 否 | reaper confirmation |
| `OrphanRecoveryRecord` | `Recovering` | 正在保守回收。 | 否 | reaper recovery action |
| `OrphanRecoveryRecord` | `Recovered` | 已回收并留存审计。 | 否 | reaper success |
| `OrphanRecoveryRecord` | `Failed` | 回收失败,需后续 containment 或人工处理。 | 否 | reaper failure |
| `CleanupGuard` | `PendingEvidence` | 等待 capture / handoff / audit 材料安全交接。 | 否 | `EvaluateCleanupReadiness`;handoff change |
| `CleanupGuard` | `PendingInvestigation` | 等待调查或安全交接状态。 | 否 | `EvaluateCleanupReadiness`;investigation change |
| `CleanupGuard` | `Blocked` | cleanup 当前被阻断。 | 否 | `EvaluateCleanupReadiness`;reevaluate job |
| `CleanupGuard` | `Allowed` | cleanup 可以继续。 | 受限 | `EvaluateCleanupReadiness`;reevaluate job |
| `CleanupGuard` | `Completed` | cleanup 已完成并保留 trace。 | 否 | cleanup execution complete |
| `RedlineContainment` | `Detected` | 已识别红线信号。 | 否 | `RecordRedlineContainment` |
| `RedlineContainment` | `Contained` | 已保守阻断或隔离影响。 | 否 | containment action |
| `RedlineContainment` | `HandoffPending` | 等待安全调查交接。 | 否 | `MaintainRedlineContainmentHandoffs`;investigation summary |
| `RedlineContainment` | `Released` | 在调查或安全条件满足后解除 containment。 | 否 | `RecordRedlineContainment`;maintain handoff |
| `RedlineContainment` | `Terminal` | 以安全终态收束。 | 否 | redline final decision |

### 8.6 Reference / Projection / Derived / Relay / Read Surface

| 状态主体 | 状态 | 含义 | 是否可进入正常主线 | 主要触发 |
|---|---|---|---|---|
| `ReferenceResolutionState` | `Resolved` | 长期跟踪的外部 refs 和摘要可用。 | 受限 | `RefreshSandboxReferenceStates`;consumer update |
| `ReferenceResolutionState` | `Stale` | refs 或摘要过期,需要刷新。 | 受限 | consumer update;truth / policy change |
| `ReferenceResolutionState` | `Unresolved` | 必需外部 refs 不可解析。 | 否 | refresh / consumer failure |
| `ReferenceResolutionState` | `Invalid` | refs 越界或不合法。 | 否 | guard / resolver |
| `ReferenceResolutionState` | `Unavailable` | 外部来源暂不可用。 | 否 | refresh / consumer |
| `DerivedInspectPreviewTrendState` | `Fresh` | inspect / preview / trend 材料可读。 | 不适用 | `MaintainDerivedInspectPreviewTrend` |
| `DerivedInspectPreviewTrendState` | `Stale` | 来源变化后待重建。 | 不适用 | truth change;reference stale |
| `DerivedInspectPreviewTrendState` | `Rebuilding` | 正在后台重建。 | 不适用 | derived maintenance job |
| `DerivedInspectPreviewTrendState` | `Failed` | 重建或读取失败。 | 不适用 | derived maintenance job |
| `DerivedInspectPreviewTrendState` | `Unavailable` | 来源或依赖不可用。 | 不适用 | reference unavailable / source missing |
| `SandboxReadProjection` | `Fresh` | read projection 与核心 truth 同步。 | 不适用 | `RebuildSandboxReadProjections` |
| `SandboxReadProjection` | `Stale` | truth 变化后待刷新。 | 不适用 | any core truth change |
| `SandboxReadProjection` | `Rebuilding` | 正在重建投影。 | 不适用 | projection rebuild job |
| `SandboxReadProjection` | `Degraded` | 可读但不完整。 | 不适用 | missing view / stale refs / partial handoff |
| `SandboxReadProjection` | `Unavailable` | 投影不可用。 | 不适用 | rebuild failure / missing projection |
| `SandboxReconciliationReport` | `Clean` | 未发现对账问题。 | 不适用 | `RunSandboxReconciliation` |
| `SandboxReconciliationReport` | `IssuesFound` | 发现 projection / handoff / relay 不一致。 | 不适用 | `RunSandboxReconciliation` |
| `SandboxReconciliationReport` | `Degraded` | 依赖不可用导致对账降级。 | 不适用 | `RunSandboxReconciliation` |
| `SandboxReconciliationReport` | `Failed` | 对账执行失败。 | 不适用 | `RunSandboxReconciliation` |
| `SandboxAuditTrace` | `Recorded` | trace 已记录。 | 不适用 | all core commands / jobs |
| `SandboxAuditTrace` | `Linked` | trace 已关联到正式主体。 | 不适用 | post-persist link |
| `SandboxAuditTrace` | `RelayPending` | 等待 event / observability relay。 | 不适用 | relay open |
| `SandboxAuditTrace` | `RelayFailed` | relay 失败,但 trace truth 保留。 | 不适用 | relay failure |
| `SandboxEventRelayRecord` | `Pending` | 已成立 fact 待传播。 | 不适用 | `OpenMaterialHandoff`;`PublishSandboxEventRelay` |
| `SandboxEventRelayRecord` | `Published` | 已发布或已交接。 | 不适用 | relay publish / feedback |
| `SandboxEventRelayRecord` | `Failed` | 传播失败。 | 不适用 | relay publish / feedback |
| `SandboxEventRelayRecord` | `Retryable` | 可重试失败。 | 不适用 | relay publish / feedback |
| `SandboxEventRelayRecord` | `DeadLetter` | 不可重试或进入人工处理。 | 不适用 | relay exhaustion |
| `SandboxExecutionStatusView` | `VisiblePending` | intake 或前置解析未完成。 | 不适用 | source view assemble |
| `SandboxExecutionStatusView` | `VisibleReady` | context、boundary、policy 前置已满足。 | 不适用 | source view assemble |
| `SandboxExecutionStatusView` | `VisibleRunning` | 当前正在受控执行。 | 不适用 | source view assemble |
| `SandboxExecutionStatusView` | `VisibleCompleted` | 执行和 capture 主线完成。 | 不适用 | source view assemble |
| `SandboxExecutionStatusView` | `VisibleFailed` | failure / control / cleanup / redline 主线生效。 | 不适用 | source view assemble |
| `SandboxExecutionStatusView` | `VisibleDegraded` | 读取面降级。 | 不适用 | source view assemble;projection degraded |
| `PolicyDecisionSummaryView` | `Accepted` | 查询面看到 policy 允许执行。 | 不适用 | `from_policy_decision(...)` |
| `PolicyDecisionSummaryView` | `Rejected` | 查询面看到 policy 明示拒绝。 | 不适用 | `from_policy_decision(...)` |
| `PolicyDecisionSummaryView` | `Blocked` | 查询面看到高风险动作或 guard 阻断。 | 不适用 | `from_policy_decision(...)` |
| `PolicyDecisionSummaryView` | `Pending` | 查询面看到 policy 仍待闭口。 | 不适用 | `from_policy_decision(...)` |
| `PolicyDecisionSummaryView` | `FailClosed` | 查询面看到保守拒绝。 | 不适用 | `from_policy_decision(...)` |

---

## 9. 状态流转 ASCII 图

### 9.1 Intake / Identity / Intake Reference

```text
+====================================================================+
|             Intake / Identity / Intake Reference Flow             |
+====================================================================+
| ControlledExecutionContext                                        |
|   PendingResolution -- resolve+guard_accept --> Accepted -- close --> Closed |
|          |                          |                               |
|          | guard_reject             | refs invalidated / cleanup    |
|          v                          v                               |
|       Rejected                 Unresolved -- ref_refresh --> Accepted |
|                                     |                               |
|                                     +-- guard_reject --> Rejected   |
|                                                                    |
| ExecutionEnvironmentIdentity                                       |
|   Active -- close --> Closed                                       |
|      |                                                             |
|      +-- invalidate_identity --> Invalidated                       |
|                                                                    |
| ExecutionContextResolution                                         |
|   Partial / Unresolved / Conflicted -- resolve_refs --> Resolved   |
|                                                                    |
| ContextReferenceResolution                                         |
|   Stale / Unavailable -- refresh_refs --> Complete                 |
|         \-- detect_invalid --> Invalid                             |
+====================================================================+
```

关键说明:

- `ControlledExecutionContext::Accepted` 的前提是 `ExecutionContextResolution::Resolved` 且 `ControlledExecutionIntakeGuard` 通过。
- `ExecutionEnvironmentIdentity` 只有在 `ControlledExecutionContext::Accepted` 后才允许 `Active`。
- `Unresolved` 和 `Unavailable` 代表等待或人工介入,不能被 query 或 consumer 自动解释为 success。
- `Rejected`、`Closed`、`Invalidated` 都是阻断继续执行的状态。

### 9.2 Boundary / Capability / Handle / Lease

```text
+====================================================================+
|             Boundary / Capability / Handle Lifecycle Flow         |
+====================================================================+
| BackendCapabilitySummary                                           |
|   Unknown / Stale -- refresh_capability --> Fresh                  |
|      |                                  \--> Unsupported           |
|      +-- capability_missing ------------> Unknown                  |
|                                                                    |
| BoundaryEstablishmentDecision                                      |
|   PendingCapability -- capability_ready --> Established            |
|          |                         |                               |
|          | unsupported             | backend establish failed      |
|          v                         v                               |
|      Unsupported / Rejected ----> Failed                           |
|                                                                    |
| CoherentBoundary                                                   |
|   Required -- establish --> Established -- release --> Released    |
|      |              |                \-- boundary_lost --> Failed  |
|      |              +-- reject --> Rejected                        |
|      +-- wait_capability --> PendingCapability -- retry --> Established |
|                                                                    |
| IsolationEnvironmentHandle / LeaseRecord                           |
|   Created -- activate --> Active -- request_release --> ReleasePending |
|      |                        |                     \--> Released   |
|      |                        +-- suspect_orphan --> OrphanSuspected|
|      +-- release_before_run --> Released                            |
|   Lease: Active -> Expiring -> Expired -> Released / OrphanSuspected |
+====================================================================+
```

关键说明:

- `CoherentBoundary::Established` 必须与 `BoundaryEstablishmentDecision::Established`、`BackendCapabilitySummary::Fresh` 和非空 `IsolationEnvironmentHandle` 同时成立。
- `Unsupported` 不允许被静默映射为 `Established`;只能走 `Rejected`、`PendingCapability` 或 `Failed`。
- `IsolationEnvironmentHandle::OrphanSuspected` 和 `LeaseRecord::OrphanSuspected` 需要由 `RunLeaseOrphanReaper` 继续收束。
- `Released` 是边界 / handle 生命周期收束,不代表 policy、capture、cleanup 或 redline 也自动完成。

### 9.3 Policy / High-Risk Launch Decision

```text
+====================================================================+
|                 Policy / High-Risk Decision Flow                  |
+====================================================================+
| PolicyApplicabilitySnapshot                                        |
|   Missing / Conflicted / Stale -- refresh_summary --> Applicable   |
|            \-------------------- unsupported ------------------> Unsupported |
|                                                                    |
| PolicyExecutionDecision                                            |
|   Pending -- evaluate --> Accepted                                 |
|      |           |             \-- high_risk_block --> Blocked     |
|      |           +-- reject --> Rejected                           |
|      +-- fail_closed_guard --> FailClosed                          |
|                                                                    |
| HighRiskActionDecision                                             |
|   PendingAuthorization -- auth_ready --> Allowed                   |
|          |                       \-- out_of_scope --> Blocked       |
|          +-- backend_unsupported -----------------> Unsupported     |
+====================================================================+
```

关键说明:

- `PolicyExecutionDecision::Accepted` 不等于执行已启动,它只允许进入 `ControlledExecutionRun::Preparing`。
- `Blocked` 和 `FailClosed` 都会阻断 launch,但语义不同:前者是动作或 guard 阻断,后者是策略不完备导致保守失败。
- `HighRiskActionDecision` 只能细化 launch 边界,不能单独替代 `PolicyExecutionDecision` 成为主裁定。

### 9.4 Run / Capture / Material Handoff

```text
+====================================================================+
|                 Run / Capture / Material Handoff Flow             |
+====================================================================+
| ControlledExecutionRun                                             |
|   Preparing -- launch --> Running -- complete --> Completed        |
|      |                       |                 \                   |
|      | launch_failed         | failure_signal   \-- capture_open   |
|      v                       v                                      |
|    Failed                Failed / Terminated                        |
|                                                                    |
| CaptureFact                                                         |
|   <record_capture_result> --> Complete / Partial / Failed / Unavailable |
|                                                                    |
| CapturedMaterialRef                                                 |
|   Captured -- open_handoff --> HandoffPending -- ack --> HandoffAccepted |
|      |                            |                   \            |
|      | cleanup_block              | failed             \-> RetentionBlocked |
|      v                            v                                    |
| RetentionBlocked              HandoffFailed -- retry --> HandoffPending |
|                                                                    |
| ObservabilityMaterial / HandoffFact                                 |
|   Prepared -> HandoffPending -> HandoffRecorded / HandoffFailed     |
|   Pending -> Delivered / Failed / Retryable / BlockedByCleanupGuard |
+====================================================================+
```

关键说明:

- `CaptureFact` 是单次运行的正式 capture 结果,不能被 handoff ack 或 observability ack 反向改写。
- `CapturedMaterialRef::HandoffAccepted` 只表示下游确认接收,不表示 sandbox 拥有下游 formal truth。
- `HandoffFact::BlockedByCleanupGuard` 说明 cleanup 还不能删除材料或释放环境。
- `ControlledExecutionRun::Completed` 与 `CaptureFact::Complete` 相关,但不是同一状态主体。

### 9.5 Failure / Control / Cleanup / Redline

```text
+====================================================================+
|              Failure / Control / Cleanup / Redline Flow           |
+====================================================================+
| FailureClassification                                               |
|   PendingInput -- classify --> Classified -- finalize --> Terminal |
|                             \-- supersede --> Superseded -> Terminal|
|                                                                    |
| ControlFact                                                         |
|   Accepted -- execute --> Completed / Failed                       |
|      |                                                             |
|      +-- duplicate --> IgnoredDuplicate                            |
|      +-- conflict --> Conflicted                                   |
|                                                                    |
| OrphanRecoveryRecord                                                |
|   Suspected -> Confirmed -> Recovering -> Recovered / Failed       |
|                                                                    |
| CleanupGuard                                                        |
|   PendingEvidence / PendingInvestigation -> Blocked / Allowed      |
|                                   Blocked -- reevaluate --> Allowed |
|                                   Allowed -- cleanup_done --> Completed |
|                                                                    |
| RedlineContainment                                                  |
|   Detected -> Contained -> HandoffPending -> Released / Terminal   |
|                    \---------------------------> Terminal           |
+====================================================================+
```

关键说明:

- `FailureClassification`、`ControlFact`、`CleanupGuard` 和 `RedlineContainment` 是并行收束链,不是一条串行单链。
- `ControlFact::Accepted` 可能推动 `ControlledExecutionRun::Terminated`,但不能自动跳过 cleanup guard。
- `CleanupGuard::Allowed` 只是允许 cleanup 继续,不等于 cleanup 已完成。
- `RedlineContainment` 在 `Detected` 之后至少要进入 `Contained` 或 `Terminal`,不能停留在 advisory-only 提示。

### 9.6 Reference / Projection / Relay / Read Surface

```text
+====================================================================+
|           Reference / Projection / Relay / Read Surface Flow      |
+====================================================================+
| ReferenceResolutionState                                           |
|   Unresolved / Unavailable / Stale -- refresh --> Resolved         |
|        \--------------------------- invalid ----------------> Invalid |
|                                                                    |
| SandboxReadProjection                                               |
|   Fresh -- truth_changed --> Stale -- rebuild --> Rebuilding       |
|      ^                          |                    |              |
|      |                          +-- partial_source --> Degraded     |
|      +--------- rebuild_ok <----+                    \-> Unavailable |
|                                                                    |
| DerivedInspectPreviewTrendState                                     |
|   Fresh -> Stale -> Rebuilding -> Fresh / Failed / Unavailable     |
|                                                                    |
| SandboxEventRelayRecord / SandboxAuditTrace                         |
|   Pending -> Published / Failed / Retryable / DeadLetter           |
|   Recorded -> Linked -> RelayPending -> Linked / RelayFailed       |
|                                                                    |
| SandboxExecutionStatusView                                          |
|   VisiblePending -> VisibleReady -> VisibleRunning -> VisibleCompleted |
|      \------------------------------ failure ------------------> VisibleFailed |
|      \------------------------------ degraded -----------------> VisibleDegraded |
+====================================================================+
```

关键说明:

- `ReferenceResolutionState` 是长期刷新状态,与 intake 时一次性 `ContextReferenceResolution` 分工不同。
- `SandboxReadProjection` 和 `DerivedInspectPreviewTrendState` 都只能通过 rebuild / maintenance job 变回 `Fresh`。
- `SandboxEventRelayRecord::DeadLetter` 不允许在同一 record 上直接回到 `Pending`;若要重新传播,必须创建新 relay record。
- `SandboxExecutionStatusView` 只是组装出来的 visible surface,不能替代各对象真实状态。

---

## 10. 允许迁移清单

| 状态主体 | 允许的核心迁移 | 触发接口 / flow | 限制条件 |
|---|---|---|---|
| `ControlledExecutionContext` | `PendingResolution -> Accepted`;`PendingResolution -> Rejected`;`PendingResolution -> Unresolved`;`Unresolved -> Accepted`;`Accepted -> Closed`;`Unresolved -> Closed` | `OpenControlledExecutionContext`;`ConsumeCallerContextReferenceChanged`;cleanup / reaper close | `Accepted` 必须同时满足 resolved refs 和 intake guard。 |
| `ExecutionEnvironmentIdentity` | `Active -> Closed`;`Active -> Invalidated` | context close;ref invalidation;redline / cleanup close | 不允许先于 `ControlledExecutionContext::Accepted` 建立。 |
| `ExecutionContextResolution` | `Partial -> Resolved`;`Unresolved -> Resolved`;`Conflicted -> Resolved` | resolver refresh;caller ref change | `Resolved` 必须来自正式 resolver 输出。 |
| `ContextReferenceResolution` | `Stale -> Complete`;`Unavailable -> Complete`;`Stale -> Invalid`;`Unavailable -> Invalid` | resolver refresh | 只表达 intake refs。 |
| `BackendCapabilitySummary` | `Unknown -> Fresh`;`Unknown -> Unsupported`;`Stale -> Fresh`;`Stale -> Unsupported`;`Fresh -> Stale` | `RefreshBackendCapabilitySummaries`;capability consumer | `Fresh` 需要 probe / summary 可回链。 |
| `BoundaryEstablishmentDecision` | `PendingCapability -> Established`;`PendingCapability -> Rejected`;`PendingCapability -> Unsupported`;`PendingCapability -> Failed` | `EstablishExecutionBoundary`;capability refresh | 不允许凭假设跳过 pending。 |
| `CoherentBoundary` | `Required -> PendingCapability`;`Required -> Established`;`Required -> Rejected`;`Required -> Failed`;`PendingCapability -> Established`;`Established -> Released`;`Established -> Failed` | `EstablishExecutionBoundary`;backend lifecycle signal;release flow | `Established` 必须所有边界维度共同成立。 |
| `IsolationEnvironmentHandle` | `Created -> Active`;`Created -> Released`;`Active -> ReleasePending`;`Active -> OrphanSuspected`;`ReleasePending -> Released`;`OrphanSuspected -> ReleasePending`;`OrphanSuspected -> Released` | `StartControlledExecutionRun`;`RunLeaseOrphanReaper`;cleanup | 不泄漏后端原始句柄。 |
| `PolicyApplicabilitySnapshot` | `Missing -> Applicable`;`Conflicted -> Applicable`;`Stale -> Applicable`;`Applicable -> Stale`;`Applicable -> Unsupported` | `EvaluatePolicyExecution`;`ConsumePolicySummaryChanged`;reference refresh | 只能消费给定摘要。 |
| `PolicyExecutionDecision` | `Pending -> Accepted`;`Pending -> Rejected`;`Pending -> Blocked`;`Pending -> FailClosed`;`Accepted -> Blocked`;`Accepted -> FailClosed` | `EvaluatePolicyExecution`;`ConsumePolicySummaryChanged` | `Accepted -> Blocked / FailClosed` 只允许在 run 启动前重判。 |
| `HighRiskActionDecision` | `PendingAuthorization -> Allowed`;`PendingAuthorization -> Blocked`;`PendingAuthorization -> Unsupported`;`Allowed -> Blocked` | `EvaluatePolicyExecution`;policy / capability update | `Allowed -> Blocked` 只允许在 launch 前重判。 |
| `ControlledExecutionRun` | `Preparing -> Running`;`Preparing -> Failed`;`Preparing -> Terminated`;`Running -> Completed`;`Running -> Failed`;`Running -> Terminated` | `StartControlledExecutionRun`;backend signal;`SubmitSandboxControl`;`RecordRedlineContainment` | 不允许绕过 established boundary 和 accepted policy。 |
| `CaptureFact` | `<created> -> Complete / Partial / Failed / Unavailable` | `RecordCaptureResult` | capture result 在同一 fact 上单次定格。 |
| `CapturedMaterialRef` | `Captured -> HandoffPending`;`Captured -> RetentionBlocked`;`HandoffPending -> HandoffAccepted`;`HandoffPending -> HandoffFailed`;`HandoffAccepted -> RetentionBlocked`;`HandoffFailed -> HandoffPending` | `OpenMaterialHandoff`;handoff consumer;retry job;cleanup readiness | `HandoffAccepted` 不迁移 truth ownership。 |
| `ObservabilityMaterial` | `Prepared -> HandoffPending`;`HandoffPending -> HandoffRecorded`;`HandoffPending -> HandoffFailed`;`HandoffFailed -> HandoffPending` | `OpenMaterialHandoff`;observability status consumer;retry job | 观测交接不能反写 capture truth。 |
| `HandoffFact` | `Pending -> Delivered`;`Pending -> Failed`;`Pending -> Retryable`;`Pending -> BlockedByCleanupGuard`;`Retryable -> Pending`;`Retryable -> Delivered`;`BlockedByCleanupGuard -> Pending` | handoff consumers;retry job;cleanup reevaluate | `BlockedByCleanupGuard` 解除需明确 guard 放行。 |
| `FailureClassification` | `PendingInput -> Classified`;`Classified -> Superseded`;`Classified -> Terminal`;`Superseded -> Terminal` | `ClassifySandboxFailure`;`SubmitSandboxControl`;`RecordRedlineContainment` | `Classified` 需 stable source markers。 |
| `ControlFact` | `Accepted -> Completed`;`Accepted -> Failed`;`Accepted -> IgnoredDuplicate`;`Accepted -> Conflicted` | `SubmitSandboxControl`;`ConsumeSandboxControlRequested` | 重复和冲突必须显式落为 control fact。 |
| `LeaseRecord` | `Active -> Expiring`;`Expiring -> Expired`;`Active -> Released`;`Expired -> Released`;`Expired -> OrphanSuspected`;`OrphanSuspected -> Released` | time evaluation;`RunLeaseOrphanReaper`;backend lifecycle signal | 过期环境不得继续托管外运行。 |
| `OrphanRecoveryRecord` | `Suspected -> Confirmed`;`Confirmed -> Recovering`;`Recovering -> Recovered`;`Recovering -> Failed` | `RunLeaseOrphanReaper` | 不绕过 cleanup guard。 |
| `CleanupGuard` | `PendingEvidence -> Blocked`;`PendingEvidence -> Allowed`;`PendingInvestigation -> Blocked`;`PendingInvestigation -> Allowed`;`Blocked -> Allowed`;`Allowed -> Completed` | `EvaluateCleanupReadiness`;`EvaluatePendingCleanupGuards`;investigation status consumer | `Allowed` 仍需 cleanup 执行成功才能 `Completed`。 |
| `RedlineContainment` | `Detected -> Contained`;`Contained -> HandoffPending`;`Contained -> Terminal`;`HandoffPending -> Released`;`HandoffPending -> Terminal` | `RecordRedlineContainment`;`MaintainRedlineContainmentHandoffs`;investigation status consumer | `Released` 需 guard 明确允许。 |
| `ReferenceResolutionState` | `Stale -> Resolved`;`Unresolved -> Resolved`;`Unavailable -> Resolved`;`Resolved -> Stale`;`Resolved -> Unavailable`;`Unresolved -> Invalid` | `RefreshSandboxReferenceStates`;consumers | 只影响 refresh / read surface。 |
| `DerivedInspectPreviewTrendState` | `Fresh -> Stale`;`Stale -> Rebuilding`;`Rebuilding -> Fresh`;`Rebuilding -> Failed`;`Rebuilding -> Unavailable`;`Failed -> Rebuilding` | truth change;`MaintainDerivedInspectPreviewTrend` | 不反写核心 truth。 |
| `SandboxReadProjection` | `Fresh -> Stale`;`Stale -> Rebuilding`;`Rebuilding -> Fresh`;`Rebuilding -> Degraded`;`Rebuilding -> Unavailable`;`Degraded -> Rebuilding`;`Degraded -> Fresh` | truth change;`RebuildSandboxReadProjections` | Query 只读不能直接 refresh。 |
| `SandboxReconciliationReport` | `Degraded -> Clean`;`Degraded -> IssuesFound`;`Clean -> IssuesFound`;`IssuesFound -> Clean`;`Failed -> Degraded` | `RunSandboxReconciliation` | 对账只报告,不自动修正 truth。 |
| `SandboxAuditTrace` | `Recorded -> Linked`;`Linked -> RelayPending`;`RelayPending -> Linked`;`RelayPending -> RelayFailed`;`RelayFailed -> RelayPending` | all write flows;relay publish job | trace truth 不因 relay 失败消失。 |
| `SandboxEventRelayRecord` | `Pending -> Published`;`Pending -> Failed`;`Pending -> Retryable`;`Failed -> Retryable`;`Retryable -> Pending`;`Retryable -> DeadLetter`;`Failed -> DeadLetter` | `PublishSandboxEventRelay`;relay feedback consumer | 发布失败不回滚 source fact。 |
| `SandboxExecutionStatusView` | `VisiblePending -> VisibleReady`;`VisibleReady -> VisibleRunning`;`VisibleRunning -> VisibleCompleted`;`VisibleRunning -> VisibleFailed`;`VisibleCompleted -> VisibleDegraded`;`VisibleReady -> VisibleDegraded`;`VisibleFailed -> VisibleDegraded` | source view assemble;projection rebuild | 只是 visible 汇总。 |
| `PolicyDecisionSummaryView` | `Pending -> Accepted / Rejected / Blocked / FailClosed`;`Accepted -> Blocked`;`Accepted -> FailClosed` | `from_policy_decision(...)` | 只镜像源 decision。 |

---

## 11. 禁止迁移清单

| 状态主体 | 禁止的核心迁移 | 原因 |
|---|---|---|
| `ControlledExecutionContext` | `Rejected -> Accepted`;`Closed -> *` | 拒绝和关闭都不能在同一 context 上静默复活。 |
| `ExecutionEnvironmentIdentity` | `Closed -> Active`;`Invalidated -> Active` | 责任链失效后必须重开新 context。 |
| `ExecutionContextResolution` | `Resolved -> Unresolved / Conflicted` 作为继续执行前提 | 长期变化应落到 `ReferenceResolutionState`,不回写 intake 结论。 |
| `CoherentBoundary` | `Rejected / Failed / Released -> Established` | 同一边界事实不能在无新建立动作下复活。 |
| `BoundaryEstablishmentDecision` | `Unsupported -> Established` 无新 capability summary | 不支持不能被假设为支持。 |
| `BackendCapabilitySummary` | `Unknown -> Fresh` 无 probe / summary 来源 | 禁止凭推测补 capability。 |
| `IsolationEnvironmentHandle` | `Released -> Active` | 已释放环境不能在同一 handle 上复用。 |
| `PolicyApplicabilitySnapshot` | `Missing / Conflicted / Unsupported -> Applicable` 无新 summary | 只能由外部摘要刷新解决。 |
| `PolicyExecutionDecision` | `Rejected / Blocked / FailClosed -> Accepted` 无新 snapshot + 新裁定 | 禁止 query、consumer 反馈或 relay 成功隐式放行。 |
| `HighRiskActionDecision` | `Blocked / Unsupported -> Allowed` 无新 authorization / capability | 高风险动作不能默认放行。 |
| `ControlledExecutionRun` | `Completed -> Running`;`Failed -> Running`;`Terminated -> Running` | 同一 run 不能重启。 |
| `CaptureFact` | `Failed / Unavailable -> Complete`;`Partial -> Complete` 在同一 fact 上 | capture result 是单次正式事实,补料需通过新 material ref 或后续设计的显式版本化。 |
| `CapturedMaterialRef` | `HandoffAccepted -> Captured`;`RetentionBlocked -> Captured` | 交接和保留状态不能被静默回滚。 |
| `ObservabilityMaterial` | `HandoffRecorded -> Prepared` | 已记录交接后不能假装未交接。 |
| `HandoffFact` | `Delivered -> Pending`;`Failed -> Delivered` 无新 retry | ack 和 failure 都必须显式回链。 |
| `FailureClassification` | `Terminal -> Classified`;`Superseded -> Classified` | 终态或被替代解释不能回滚。 |
| `ControlFact` | `Completed -> Accepted`;`Failed -> Accepted` | 同一 control fact 不重放。 |
| `LeaseRecord` | `Released -> Active`;`OrphanSuspected -> Active` | 释放或疑似孤儿都需新 lifecycle。 |
| `OrphanRecoveryRecord` | `Recovered -> Recovering`;`Failed -> Recovering` 在同一 record 上 | 需要新 recovery record。 |
| `CleanupGuard` | `Completed -> Allowed / Pending / Blocked` | cleanup 完成后 guard 不可回退。 |
| `RedlineContainment` | `Detected -> Released`;`Terminal -> *`;`Released -> Contained` | 红线必须先 containment,终态不可复活。 |
| `ReferenceResolutionState` | `Invalid -> Resolved` 在同一 invalid 事实上 | 越界 / 非法引用需新 ref set 或新 context。 |
| `DerivedInspectPreviewTrendState` | `Unavailable -> Fresh` 无 rebuild | 派生材料恢复必须走 maintenance。 |
| `SandboxReadProjection` | `Unavailable -> Fresh` 无 rebuild | 读投影不能跳过重建。 |
| `SandboxReconciliationReport` | `Failed -> Clean` 无新对账运行 | 对账结果不能被手工洗白。 |
| `SandboxAuditTrace` | `RelayFailed -> Recorded` | relay 失败不擦除 trace 历史。 |
| `SandboxEventRelayRecord` | `DeadLetter -> Pending` | dead-letter record 终止,重发需新 record。 |
| `SandboxExecutionStatusView` | `VisibleFailed -> VisibleRunning` | 只读汇总不能重写历史执行态。 |
| `PolicyDecisionSummaryView` | `FailClosed -> Accepted` 无源 decision 更新 | summary 只镜像真相。 |

---

## 12. 状态传播关系

### 12.1 传播总览图

```text
+====================================================================+
|                  Sandbox State Propagation Graph                  |
+====================================================================+
| Core truth / guard state changes                                   |
|   ControlledExecutionContext                                        |
|   CoherentBoundary                                                  |
|   PolicyExecutionDecision                                           |
|   ControlledExecutionRun                                            |
|   CaptureFact / HandoffFact                                         |
|   FailureClassification / ControlFact                               |
|   CleanupGuard / RedlineContainment                                 |
|          |                                                          |
|          +--> SandboxAuditTrace: Recorded -> Linked -> RelayPending |
|          |                                                          |
|          +--> SandboxEventRelayRecord: Pending -> Published/Failed  |
|          |                                                          |
|          +--> SandboxReadProjection: Stale -> Rebuilding -> Fresh   |
|          |           |                                              |
|          |           +--> SandboxExecutionStatusView                |
|          |                                                          |
|          +--> DerivedInspectPreviewTrendState: Stale -> Rebuilding  |
|          |           |                                              |
|          |           +--> DerivedInspectPreviewTrendView            |
|          |                                                          |
|          +--> Material / cleanup / policy summary views             |
|          |       MaterialHandoffStatusView                          |
|          |       FailureControlStatusView                           |
|          |       CleanupReadinessView                               |
|          |       RedlineContainmentView                             |
|          |       PolicyDecisionSummaryView                          |
|          |                                                          |
|          +--> SandboxReconciliationReport                           |
+====================================================================+
```

### 12.2 传播明细

| 源状态变化 | 必需传播对象 | 传播语义 | 禁止行为 |
|---|---|---|---|
| intake / identity 变化 | `SandboxAuditTrace`;`SandboxReadProjection`;`SandboxExecutionStatusView` | 审计受理、拒绝、关闭和 visible pending / ready。 | 不向外补造 identity / work 正文。 |
| boundary / handle / lease 变化 | `SandboxAuditTrace`;`SandboxEventRelayRecord`;`SandboxReadProjection`;`CleanupReadinessView`;`SandboxReconciliationReport` | 暴露 established / failed / released / orphan 风险。 | 不把 backend SDK raw response 当作 truth。 |
| policy / high-risk 变化 | `SandboxAuditTrace`;`PolicyDecisionSummaryView`;`SandboxReadProjection`;`SandboxExecutionStatusView` | 暴露 accepted / rejected / blocked / fail-closed 和 visible ready / failed。 | 不生成 policy definition / approval truth。 |
| run / capture / handoff 变化 | `SandboxAuditTrace`;`SandboxEventRelayRecord`;`CaptureSummaryView`;`MaterialHandoffStatusView`;`SandboxReadProjection`;`DerivedInspectPreviewTrendState` | 推动 read projection stale、derived rebuild、handoff query 状态和 relay。 | 不把 handoff success 解释为 artifact / observability truth。 |
| failure / control 变化 | `SandboxAuditTrace`;`SandboxEventRelayRecord`;`FailureControlStatusView`;`SandboxExecutionStatusView`;`SandboxReconciliationReport` | 形成 visible failed、control status 和 failure traceability。 | 不推进 runtime recover / business replay。 |
| cleanup / orphan / redline 变化 | `SandboxAuditTrace`;`CleanupReadinessView`;`RedlineContainmentView`;`SandboxReadProjection`;`SandboxEventRelayRecord` | 阻断 release、保守回收、调查交接和 visible failed / degraded。 | 不允许 cleanup 先删证据,不允许 redline advisory-only。 |
| reference / projection / relay 变化 | `SandboxReadProjection`;`DerivedInspectPreviewTrendView`;`SandboxExecutionStatusView`;`SandboxReconciliationReport` | 只读面和传播面显式 stale / degraded / issues-found。 | 不反写核心 truth。 |

关键说明:

- `SandboxAuditTrace` 是所有核心状态的统一审计传播锚点,但不是全局状态机。
- `SandboxEventRelayRecord` 只能传播已成立事实;发布失败只影响 relay / view / reconciliation,不回滚 source fact。
- read-side 状态变化永远跟随 truth 或 pending record 发生,不允许由 query 自主推进。

---

## 13. 按主要组成部分组织的状态归属表

| 主要组成部分 | 正式状态主体 | 只读镜像 / 派生状态 | 主要触发接口 / flow | 明确不拥有 |
|---|---|---|---|---|
| `Controlled execution intake and identity` | `ControlledExecutionContext`;`ExecutionEnvironmentIdentity`;`ExecutionContextResolution`;`ContextReferenceResolution` | `SandboxExecutionStatusView` | `OpenControlledExecutionContext`;`ConsumeCallerContextReferenceChanged` | identity truth、work truth、runtime execution truth |
| `Boundary establishment and enforcement` | `CoherentBoundary`;`BoundaryEstablishmentDecision`;`BackendCapabilitySummary`;`IsolationEnvironmentHandle` | `BoundaryStatusView`;`BackendCapabilityComparisonView` | `EstablishExecutionBoundary`;`ConsumeBackendCapabilitySummaryChanged`;`ConsumeIsolationBackendLifecycleSignal`;`RefreshBackendCapabilitySummaries` | backend product lifecycle、host / cluster truth |
| `Policy execution decision` | `PolicyApplicabilitySnapshot`;`PolicyExecutionDecision`;`HighRiskActionDecision` | `PolicyDecisionSummaryView` | `EvaluatePolicyExecution`;`ConsumePolicySummaryChanged` | policy definition、approval、allowlist、capability truth |
| `Execution capture and material handoff` | `ControlledExecutionRun`;`CaptureFact`;`CapturedMaterialRef`;`ObservabilityMaterial`;`HandoffFact` | `CaptureSummaryView`;`MaterialHandoffStatusView`;部分 `SandboxEventRelayRecord` | `StartControlledExecutionRun`;`RecordCaptureResult`;`OpenMaterialHandoff`;`RetryPendingMaterialHandoffs`;`PublishSandboxEventRelay` | artifact truth、observability store truth、runtime result truth |
| `Failure control and safety closure` | `FailureClassification`;`ControlFact`;`LeaseRecord`;`OrphanRecoveryRecord`;`CleanupGuard`;`RedlineContainment` | `FailureControlStatusView`;`CleanupReadinessView`;`RedlineContainmentView` | `SubmitSandboxControl`;`ClassifySandboxFailure`;`EvaluateCleanupReadiness`;`RecordRedlineContainment`;`RunLeaseOrphanReaper`;`EvaluatePendingCleanupGuards`;`MaintainRedlineContainmentHandoffs` | runtime recover、investigation lifecycle、artifact retention truth |
| `Local reference, projection and derived support` | `ReferenceResolutionState`;`DerivedInspectPreviewTrendState`;`SandboxReadProjection`;`SandboxReconciliationReport`;`SandboxAuditTrace`;`SandboxEventRelayRecord` | `DerivedInspectPreviewTrendView`;`SandboxExecutionStatusView`;`PolicyDecisionSummaryView`;comparison / reconciliation read surfaces | `RefreshSandboxReferenceStates`;`RebuildSandboxReadProjections`;`MaintainDerivedInspectPreviewTrend`;`RunSandboxReconciliation`;`PublishSandboxEventRelay`;`ConsumeSandboxTruthRelayFeedback` | external body truth、query write source、bus truth |

---

## 14. 逐组成部分停审记录

| 组成部分 | 停审检查点 | 结论 | 备注 |
|---|---|---|---|
| `Controlled execution intake and identity` | 状态已归属对象;触发流可反查;拒绝 / unresolved / close 不混淆 | pass | `Accepted` 前置条件清楚,无匿名成功路径。 |
| `Boundary establishment and enforcement` | capability、decision、boundary、handle、lease 分层清楚 | pass | `Unsupported` 和 `Failed` 未被压成同一个 success-like 状态。 |
| `Policy execution decision` | applicable / accepted / blocked / fail-closed 区分清楚 | pass | policy 只消费摘要,未拥有 policy truth。 |
| `Execution capture and material handoff` | run、capture、material、observability、handoff 分层清楚 | pass | handoff 不迁移 ownership,失败不会回滚 capture truth。 |
| `Failure control and safety closure` | failure、control、cleanup、redline 都有独立状态收束 | pass | cleanup guard 和 redline 仍是一等状态机,不是脚本注释。 |
| `Local reference, projection and derived support` | refresh / projection / relay / read surface 不反写核心 truth | pass | view / derived / comparison 都是只读传播态。 |

---

## 15. 跨状态一致性审计

| 审计项 | 结论 | 说明 |
|---|---|---|
| 是否存在单一全局状态机误导 | pass | 当前明确是 6 组并行状态机,`SandboxExecutionStatusView` 不是全局真相。 |
| `Accepted`、`Established`、`Allowed`、`Completed` 是否被混成一类 | pass | 它们分别归 intake、boundary、high-risk decision 和 run / cleanup / control 语义。 |
| `Rejected`、`Blocked`、`FailClosed` 是否语义清晰 | pass | 分别表示明示拒绝、高风险阻断、策略不完备保守失败。 |
| capture / handoff / relay 是否可能反向成为下游 truth | pass | `CapturedMaterialRef`、`ObservabilityMaterial`、`HandoffFact`、`SandboxEventRelayRecord` 都只表达交接 / 传播状态。 |
| cleanup / reaper 是否会绕过证据保护 | pass | `CleanupGuard`、`CapturedMaterialRef::RetentionBlocked`、`HandoffFact::BlockedByCleanupGuard`、`RedlineContainment` 都保留阻断语义。 |
| redline 是否仍可 advisory-only | pass | `Detected -> Contained / Terminal` 是强制路径,不允许仅记日志。 |
| projection / derived / comparison / reconciliation 是否能反写核心 truth | pass | 全部归只读传播态,需要修复必须回到正式 flow。 |
| relay 失败是否会回滚已成立 truth | pass | `SandboxEventRelayRecord` 失败只影响传播和 read surface,不回滚 source fact。 |
| ref stale / unavailable 是否会直接撤销已成立核心 truth | pass | 长期变化落在 `ReferenceResolutionState`、projection 和 degraded surface,不隐式回滚 intake / boundary / capture truth。 |
| 是否出现跨调用方第二套 control / policy / execution 语义 | pass | 状态主体全部绑定到统一 Command / Consumer / Job,未为 tools、runtime、runner、member 另起状态机。 |

---

## 16. Step 10 承接与反查清单

| Step 10 要展开的异常 / 边界主题 | Step 9 已稳定的状态基础 | Step 10 需要补什么 |
|---|---|---|
| launch 前 policy 变化与重判 | `PolicyApplicabilitySnapshot`;`PolicyExecutionDecision`;`HighRiskActionDecision` | 说明何时允许 `Accepted -> Blocked / FailClosed`,何时只能创建新裁定版本。 |
| boundary established 后 handle lifecycle 丢失 | `CoherentBoundary`;`IsolationEnvironmentHandle`;`LeaseRecord`;`OrphanRecoveryRecord` | 说明 `Established -> Failed`、`Active -> OrphanSuspected` 的异常路径和告警语义。 |
| capture partial / unavailable 与 cleanup pending evidence | `CaptureFact`;`CapturedMaterialRef`;`CleanupGuard` | 说明哪些 partial 允许继续 handoff,哪些必须先阻断 cleanup。 |
| handoff failed / retryable 与 relay failure 叠加 | `HandoffFact`;`ObservabilityMaterial`;`SandboxEventRelayRecord` | 说明 handoff 与 relay 失败如何组合暴露,但不回滚 capture truth。 |
| control conflict 与 failure supersede | `ControlFact`;`FailureClassification` | 说明冲突优先级、最终 terminal 触发条件和审计解释。 |
| redline containment 与 cleanup / orphan 并发 | `RedlineContainment`;`CleanupGuard`;`OrphanRecoveryRecord` | 说明 redline 未收束时 release / cleanup 的禁止路径。 |
| projection degraded / unavailable 的 query 语义 | `SandboxReadProjection`;`DerivedInspectPreviewTrendState`;`SandboxExecutionStatusView` | 说明读侧降级、不可用和重建中的返回口径。 |
| reconciliation issues 与 truth 不修复原则 | `SandboxReconciliationReport` | 说明 issues-found 何时只是告警,何时需要回到正式 flow 修复。 |

---

## 17. 回填 `02-概要设计.md` §9 草稿

正式 `02-概要设计.md` 在 Step 14 才能重建。当前可回填的 §9 草稿骨架如下:

1. 先写一段总述:
   `L4-sandbox` 采用并行状态机,而不是单一全局执行状态。状态机围绕 intake / identity、boundary、policy、run / capture / handoff、failure / cleanup / redline、reference / projection / relay 六组对象展开。
2. 再放状态定义表:
   至少摘录 `ControlledExecutionContext`、`CoherentBoundary`、`PolicyExecutionDecision`、`ControlledExecutionRun`、`CaptureFact`、`HandoffFact`、`FailureClassification`、`CleanupGuard`、`RedlineContainment`、`SandboxReadProjection`、`SandboxEventRelayRecord`。
3. 再放 3 组关键状态图:
   intake / boundary / policy 总图,run / capture / failure 总图,projection / relay / read surface 总图。
4. 再列允许 / 禁止迁移:
   重点写 `Rejected / FailClosed / Blocked / Released / Terminal / DeadLetter` 不可静默复活。
5. 最后补状态传播关系:
   说明 truth 变化如何传播到 audit、relay、projection、summary view 和 degraded surface,同时强调 read-side 不反写 truth。

---

## 18. 自检

| 自检项 | 结果 | 说明 |
|---|---|---|
| 是否明确本仓存在正式状态机 | 是 | 已明确为 6 组并行状态机。 |
| 是否每个状态都能回指 Step 6 对象 | 是 | 未新增新主语。 |
| 是否每个核心迁移都能回指 Step 7 / Step 8 触发 | 是 | 允许迁移表均已标注接口 / flow。 |
| 是否单独列出允许迁移和禁止迁移 | 是 | 见 §10 和 §11。 |
| 是否提供状态传播关系图 | 是 | 见 §12。 |
| 是否按主要组成部分标注状态归属并停审 | 是 | 见 §13 和 §14。 |
| 是否把 query、derived、comparison 或 view 写成核心 truth | 否 | 已明确只读 / 派生边界。 |
| 是否写了状态机代码、DB 列、错误码、topic、配置 key 或测试结果 | 否 | 保持在概要层。 |
| 是否修改正式 `projects/L4-sandbox/02-概要设计.md` | 否 | 正式文档仍待 Step 14 重建。 |

---

## 19. 当前结论

`02-概要设计.md` Step 9 `状态定义与状态流转` 已完成当前中间产物收敛。下一允许动作是:

1. 保持 `02_hld_calibration_flow.md` 和 `project_execution_ledger.md` 停在 Step 9 `completed_wait_user_review`。
2. 停在用户审查点。
3. 只有在用户再次明确确认后,才允许进入 Step 10 `异常与边界场景轮廓`。
