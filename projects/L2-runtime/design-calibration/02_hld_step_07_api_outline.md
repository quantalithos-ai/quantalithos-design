# L2-runtime 02 概要 Step 7: API / 接口骨架

> 创建日期: 2026-08-07
> 状态: done
> 当前模式: full-restart
> 回填位置: `02-概要设计.md` 第 7 章

## 0. Step 开工确认

| 项目 | 记录 |
|---|---|
| 输入 | Step 6 关键对象轮廓、Step 5 主要组成部分与边界、01 架构交互 / 通信语义、Step 3 接口与幂等约束 |
| 目标 | 按主要组成部分收稳 Command、Query、Inbound Event Consumer、Outbound Event、Operations Job 的正式接口骨架，并为 Step 8 处理流提供承接入口 |
| 禁止 | HTTP / RPC path、完整 JSON / proto schema、完整 topic / event field、函数调用链、外部 owner 正向实现、将内部 helper 或 repository 当公共 API |

## 1. 接口分类说明

| 类别 | 本仓语义 | 真相写入 / 读取 | 失败姿态 |
|---|---|---|---|
| Command API | 同步受理 trigger、control、resume、action choice、checkpoint、handoff candidate 等显式用例 | 可写 Runtime local truth；外部 owner 只通过 typed seam | reject / waiting / blocked / unknown；不得先返回成功再补合法性 |
| Query API | 读取 Safe Runtime Views、local outcome、progress、source availability 和 gap | 只读 projection / committed local truth，不改写源 | stale / degraded / unavailable / unknown 可见 |
| Inbound Event Consumer | 接收已成立的外部 feedback、governance / sandbox / tools / model 结果或下游 control fact | 通过 idempotent consumer 写入新 local record / decision，不覆盖旧事实 | duplicate / late / out-of-order 只链接新事实或 ignored |
| Outbound Event | 传播 Runtime 已提交的 safe fact、outcome、attempt / gap 或 availability change | 事件只代表本地已提交事实；delivery 独立 | delivery failure 形成 gap / pending，不回滚 local truth |
| Operations Job | 承接 recovery continuation、projection rebuild、handoff retry evaluation、stale / gap reconciliation | 依赖已持久化事实，可追加 local decision / projection record | job 失败保持 blocked / degraded / retry_pending；unknown 不盲执行 |

所有 Command 输入都显式带 `CommandMetadata`，需要改变或创建 Runtime truth 的入口还带 `ActorContext` 与 `IdempotencyKey`。Query 是否需要 `ActorContext` 由读取范围决定，但不会获得 mutation 权限。Inbound Event 输入使用 `EventEnvelope`、稳定 `EventId`、`CorrelationId` 和可选幂等键；事件只在来源 owner / authority 可验证时被接纳。Outbound Event 仅携带 body-free safe references / summaries。Operations Job 使用 `JobRunContext`，不是替代同步合法性判断的异步入口。

## 2. 按主要组成部分组织的接口骨架

### 2.1 Runtime Entry & Control

| 接口 | 类别 | 承接对象 / 能力 | 输入骨架 | 输出骨架 | 读写边界 |
|---|---|---|---|---|---|
| `AcceptRuntimeTrigger` | Command | `RuntimeTriggerContext`、`RuntimeAdmissionDecision` | `ActorContext actor`, `RuntimeTriggerContext trigger`, `CommandMetadata metadata`, `IdempotencyKey idempotency_key` | `RuntimeAdmissionDecision`、`ControlledRunRef` 或 `AdmissionBlocked` | 写 admission / accepted run；不写 principal / product truth |
| `ApplyRuntimeControl` | Command | `ControlledRun`、`RunProgressDecision` | `ActorContext actor`, `RunControlIntent intent`, `CommandMetadata metadata`, `IdempotencyKey idempotency_key` | `RunProgressDecision`、`ControlledRunRef` | 写 local control decision；不直接改变 external execution |
| `RequestSafeRuntimeView` | Query | `SafeRuntimeView` | `ActorContext actor`, `RunQueryRef run_ref`, `ReadScope scope`, `FreshnessRequirement freshness` | `SafeRuntimeView` 或 `ViewUnavailable` | 只读 projection；actor 仅限定可见范围 |

边界：入口只负责 formal admission / control / query；不得解析 display text 取得 actor、scope、method body 或 approval truth。

### 2.2 Run & Goal-Plan

| 接口 | 类别 | 承接对象 / 能力 | 输入骨架 | 输出骨架 | 读写边界 |
|---|---|---|---|---|---|
| `EvaluateRunProgress` | Command | `GoalPlanWorkspace`、`RunProgressDecision` | `ActorContext actor`, `RunRef run_ref`, `ProgressInputs inputs`, `CommandMetadata metadata`, `IdempotencyKey idempotency_key` | `RunProgressDecision`、`ControlledRunRef` | 写新 progress decision / history；不拥有 Work / Process truth |
| `GetRunProgress` | Query | `ControlledRun`、`GoalPlanWorkspace` | `ActorContext actor`, `RunQueryRef run_ref`, `ReadScope scope` | `SafeRuntimeView` 或 `ProgressView` | 只读 committed local truth / projection |
| `RebuildRunProjection` | Operations Job | `RuntimeHistoryEntry`、`ProjectionState` | `JobRunContext context`, `RunRef run_ref`, `HistoryCursor from_cursor` | `ProjectionState`、`SafeRuntimeView` 或 `ProjectionGap` | 从 local history 重建；不反写 domain truth |

边界：progress command 只能从 source-anchored inputs 形成新决定；query 不把 projection status 当业务终态。

### 2.3 Context & Memory Mediation

| 接口 | 类别 | 承接对象 / 能力 | 输入骨架 | 输出骨架 | 读写边界 |
|---|---|---|---|---|---|
| `ComposeWorkingContext` | Command | `MemoryCandidate`、`ContextCompositionDecision`、`WorkingContext` | `ActorContext actor`, `RunRef run_ref`, `ContextCompositionRequest request`, `CommandMetadata metadata`, `IdempotencyKey idempotency_key` | `ContextCompositionDecision`、`WorkingContext` 或 `CompositionBlocked` | 写 working context / use records；不写 durable body |
| `RecordWorkingMemory` | Command | `WorkingMemory`、`MemoryCandidate` | `ActorContext actor`, `RunRef run_ref`, `MemoryCandidate candidate`, `CommandMetadata metadata`, `IdempotencyKey idempotency_key` | `WorkingMemoryRef`、`MemoryUseRecord` 或 `MemoryUnavailable` | 写 bounded run-scoped working state；不成为 durable memory owner |
| `ResolveMemoryCandidates` | Query | `MemoryCandidate`、`SourceAvailability` | `ActorContext actor`, `MemoryQuery query`, `ReadScope scope` | `List<MemoryCandidate>`、`SourceAvailability` | 只读外部 candidate seam；owner pending 时返回 unavailable / pending |
| `ConsumeMemoryAvailability` | Inbound Event Consumer | `SourceAvailability`、`SourceSnapshot` | `EventEnvelope<MemoryAvailabilityChanged> envelope`, `EventId event_id`, `CorrelationId correlation_id`, `Optional<IdempotencyKey> idempotency_key` | `SourceAvailability`、`MemoryAvailabilityRecord` | 只追加 availability / source record；不复制 memory body |

边界：Context 组合是 Runtime decision；durable memory 查询、索引、retention、删除和写入均归外部 owner。

### 2.4 Model Decision

| 接口 | 类别 | 承接对象 / 能力 | 输入骨架 | 输出骨架 | 读写边界 |
|---|---|---|---|---|---|
| `StartModelTurn` | Command | `ModelIntent`、`ModelTurn` | `ActorContext actor`, `ModelIntent intent`, `WorkingContext context`, `CommandMetadata metadata`, `IdempotencyKey idempotency_key` | `ModelTurnRef`、`ModelSubmissionCandidate` 或 `ModelTurnBlocked` | 写 intent / turn；provider route / secret 由 adapter owner 处理 |
| `ClassifyModelResult` | Command | `ModelTurn`、`ModelDecision`、`SafeDecisionSummary` | `ActorContext actor`, `ModelTurnRef turn_ref`, `ModelResultReference result_ref`, `CommandMetadata metadata`, `IdempotencyKey idempotency_key` | `ModelDecision`、`SafeDecisionSummary` | 写 provider-neutral classification；不保存 raw response |
| `GetModelDecision` | Query | `ModelDecision`、`SafeDecisionSummary` | `ActorContext actor`, `ModelTurnRef turn_ref`, `ReadScope scope` | `SafeDecisionSummary` 或 `DecisionUnavailable` | 只读 safe summary / local history |
| `ConsumeModelAdapterResult` | Inbound Event Consumer | `ModelTurn`、`ModelDecision` | `EventEnvelope<ModelResultAvailable> envelope`, `EventId event_id`, `CorrelationId correlation_id`, `Optional<IdempotencyKey> idempotency_key` | `ModelDecision`、`ModelResultIncorporationRecord` 或 `ModelResultPending` | 接纳可验证语义结果为新事实；late / duplicate 不逆写 |

边界：`ModelSubmissionCandidate` 是 adapter seam 的候选，不是 route 或 provider readiness；没有 adapter owner 时只能 blocked / unavailable。

### 2.5 Action & Delegation Orchestration

| 接口 | 类别 | 承接对象 / 能力 | 输入骨架 | 输出骨架 | 读写边界 |
|---|---|---|---|---|---|
| `ProposeAction` | Command | `ActionDecision` | `ActorContext actor`, `RunRef run_ref`, `ActionProposalInput input`, `CommandMetadata metadata`, `IdempotencyKey idempotency_key` | `ActionDecision` | 写 action choice；不表示执行、批准或隔离成功 |
| `EvaluateActionPreconditions` | Command | `ActionPreconditionDecision` | `ActorContext actor`, `ActionDecisionRef action_ref`, `PreconditionInputs inputs`, `CommandMetadata metadata`, `IdempotencyKey idempotency_key` | `ActionPreconditionDecision` | 写 guard result；capability / governance / sandbox truth 只通过 typed seam |
| `ProposeDelegation` | Command | `Delegation`、child admission | `ActorContext actor`, `RunRef parent_run_ref`, `DelegationInput input`, `CommandMetadata metadata`, `IdempotencyKey idempotency_key` | `Delegation`、`RuntimeAdmissionDecision` | 写 bounded child candidate；不拥有 member / container lifecycle |
| `IncorporateActionFeedback` | Command | `ActionFeedbackRecord`、`ControlledRun` | `ActorContext actor`, `ActionFeedbackInput input`, `CommandMetadata metadata`, `IdempotencyKey idempotency_key` | `ActionFeedbackRecord`、`RunProgressDecision` 或 `FeedbackPending` | 写新 feedback / progress；不覆盖既有 outcome |
| `ConsumeToolOrSandboxFeedback` | Inbound Event Consumer | `ActionFeedbackRecord`、`SideEffectMarker` | `EventEnvelope<ExternalActionFeedback> envelope`, `EventId event_id`, `CorrelationId correlation_id`, `Optional<IdempotencyKey> idempotency_key` | `ActionFeedbackRecord`、`SideEffectMarker` 或 `FeedbackUnknown` | 消费外部 feedback 引用；tools execution / sandbox capture / cleanup 不归 Runtime |
| `PublishActionDecision` | Outbound Event | `ActionDecision`、`ActionPreconditionDecision` | 已提交 `ActionDecision`、safe refs、`EventMetadata metadata` | `RuntimeActionProposed` | 传播本地决定；不宣称 external dispatch |

边界：只有 `allowed` 的前置结果才可生成 dispatch candidate；`allowed` 不等于已执行，unknown / pending 必须 fail-closed。

### 2.6 Checkpoint, Recovery & Handoff

| 接口 | 类别 | 承接对象 / 能力 | 输入骨架 | 输出骨架 | 读写边界 |
|---|---|---|---|---|---|
| `PrepareRuntimeCheckpoint` | Command | `RuntimeCheckpoint` | `ActorContext actor`, `RunRef run_ref`, `CheckpointInput input`, `CommandMetadata metadata`, `IdempotencyKey idempotency_key` | `RuntimeCheckpoint`（preparing）或 `CheckpointBlocked` | 写候选检查点；不宣称已提交 stable |
| `CommitRuntimeCheckpoint` | Command | `RuntimeCheckpoint`、`ControlledRun` | `ActorContext actor`, `CheckpointRef checkpoint_ref`, `CommitContext commit_context`, `CommandMetadata metadata`, `IdempotencyKey idempotency_key` | committed / unknown `RuntimeCheckpoint` | 仅本地提交语义；事务 / commit-unknown 物理合同 pending |
| `RequestRecoveryDecision` | Command | `RecoveryDecision`、`SideEffectMarker` | `ActorContext actor`, `RunRef run_ref`, `RecoveryInput input`, `CommandMetadata metadata`, `IdempotencyKey idempotency_key` | `RecoveryDecision` | 写新 recovery decision；不得盲重试外部副作用 |
| `FinalizeRuntimeOutcome` | Command | `RuntimeOutcome`、`SafeDecisionSummary` | `ActorContext actor`, `RunRef run_ref`, `OutcomeInput input`, `CommandMetadata metadata`, `IdempotencyKey idempotency_key` | `RuntimeOutcome` 或 `OutcomeBlocked` | 写 local outcome；不写 observed / acceptance / verdict |
| `CreateHandoffCandidate` | Command | `SafeHandoffMaterial`、`HandoffAttempt` | `ActorContext actor`, `RuntimeOutcomeRef outcome_ref`, `HandoffRequest request`, `CommandMetadata metadata`, `IdempotencyKey idempotency_key` | `SafeHandoffMaterial`、`HandoffAttempt`（candidate） | 仅生成 outbound candidate；不宣称 delivered |
| `ConsumeHandoffAcknowledgement` | Inbound Event Consumer | `HandoffAttempt`、`HandoffGap` | `EventEnvelope<HandoffAcknowledged> envelope`, `EventId event_id`, `CorrelationId correlation_id`, `Optional<IdempotencyKey> idempotency_key` | `HandoffAttempt`、`HandoffGap` 或 `AcknowledgementUnknown` | 仅追加交接事实；acknowledged 不改写 local outcome |
| `PublishRuntimeOutcome` | Outbound Event | `RuntimeOutcome`、`SafeHandoffMaterial` | 已提交 `RuntimeOutcome`、safe refs、`EventMetadata metadata` | `RuntimeOutcomeCommitted` | 传播本地终局；delivery / observed 独立 |
| `ResumeRecoveryContinuation` | Operations Job | `RecoveryDecision`、`RuntimeCheckpoint` | `JobRunContext context`, `RecoveryRef recovery_ref`, `Optional<CheckpointRef> checkpoint_ref` | `ControlledRunRef`、新 `RunProgressDecision` 或 `RecoveryBlocked` | 只基于已提交事实继续；unknown effect 转 manual_review / blocked |
| `ReconcileHandoffGaps` | Operations Job | `HandoffAttempt`、`HandoffGap` | `JobRunContext context`, `RunRef run_ref`, `GapQuery gap_query` | `HandoffGap`、`HandoffReconciliationRecord` | 读取可验证 acknowledgement；不能自行制造外部事实 |

边界：checkpoint、recovery、outcome、handoff attempt / gap 是 Runtime local truth；artifact / evidence / report body、delivery、observed 和 acceptance 由外部 owner 负责。

### 2.7 External Truth Views

| 接口 | 类别 | 承接对象 / 能力 | 输入骨架 | 输出骨架 | 读写边界 |
|---|---|---|---|---|---|
| `ResolveSourceReference` | Query | `SourceReference`、`SourceAvailability` | `ActorContext actor`, `TypedSourceQuery query`, `ReadScope scope` | `SourceReference`、`SourceAvailability` 或 `SourceUnavailable` | 只读 typed ref；不返回外部正文 |
| `CaptureSourceSnapshot` | Command | `SourceSnapshot` | `ActorContext actor`, `SourceReference source_ref`, `SnapshotRequest request`, `CommandMetadata metadata`, `IdempotencyKey idempotency_key` | `SourceSnapshot` 或 `SnapshotPending` | 写本地 snapshot metadata / digest；不持有 owner 写权 |
| `ConsumeExternalTruthChange` | Inbound Event Consumer | `SourceAvailability`、`SourceSnapshot` | `EventEnvelope<ExternalTruthChanged> envelope`, `EventId event_id`, `CorrelationId correlation_id`, `Optional<IdempotencyKey> idempotency_key` | `SourceAvailability`、`SourceChangeRecord` 或 `SourceChangeUnknown` | 追加 ref / freshness / availability；不复制 source body |
| `RefreshSourceAvailability` | Operations Job | `SourceAvailability` | `JobRunContext context`, `SourceReference source_ref`, `FreshnessRequirement freshness` | `SourceAvailability` | 不能把设计文件、fake 或本地 ping 当 readiness evidence |

边界：External Truth Views 维护 Runtime 的消费视图，而非 external registry、policy、tool、artifact、memory 或 observability truth。

### 2.8 Safe Runtime Views

| 接口 | 类别 | 承接对象 / 能力 | 输入骨架 | 输出骨架 | 读写边界 |
|---|---|---|---|---|---|
| `ReadSafeRuntimeView` | Query | `SafeRuntimeView`、`ProjectionState` | `ActorContext actor`, `RunQueryRef run_ref`, `ReadScope scope`, `FreshnessRequirement freshness` | `SafeRuntimeView` 或 `ViewUnavailable` | 只读可重建投影；stale / degraded 显式返回 |
| `ReadSafeHandoffMaterial` | Query | `SafeHandoffMaterial` | `ActorContext actor`, `HandoffMaterialRef material_ref`, `ReadScope scope` | `SafeHandoffMaterial` 或 `MaterialUnavailable` | 只读 body-free candidate |
| `PublishSafeRuntimeViewUpdated` | Outbound Event | `ProjectionState`、`SafeRuntimeView` | 已提交投影状态、safe refs、`EventMetadata metadata` | `SafeRuntimeViewUpdated` | 传播 projection 变化；不宣称 observed |
| `RebuildSafeRuntimeViews` | Operations Job | `SafeRuntimeView`、`ProjectionState`、`RuntimeHistoryEntry` | `JobRunContext context`, `RunRef run_ref`, `HistoryCursor from_cursor` | `ProjectionState`、`SafeRuntimeView` 或 `ProjectionGap` | 只从 local history 重建，不能写 domain source |

边界：safe view 只能暴露已提交本地事实、safe summary、typed refs 和可见 gap；projection 不具备 domain mutation 能力。

## 3. Command API 骨架表

| API | 输入骨架 | 输出骨架 | 主要处理 | 写入结果 |
|---|---|---|---|---|
| `AcceptRuntimeTrigger` | `ActorContext actor`; `RuntimeTriggerContext trigger`; `CommandMetadata metadata`; `IdempotencyKey idempotency_key` | `RuntimeAdmissionDecision`; `ControlledRunRef` / `AdmissionBlocked` | 校验 actor / scope / source / 幂等语境并形成 admission | `RuntimeAdmissionDecision`；accepted 时创建 `ControlledRun` |
| `ApplyRuntimeControl` | `ActorContext actor`; `RunControlIntent intent`; `CommandMetadata metadata`; `IdempotencyKey idempotency_key` | `RunProgressDecision`; `ControlledRunRef` | 对 pause / cancel / resume intent 做本地受理与 guard | 新 control / progress decision、history |
| `EvaluateRunProgress` | `ActorContext actor`; `RunRef run_ref`; `ProgressInputs inputs`; `CommandMetadata metadata`; `IdempotencyKey idempotency_key` | `RunProgressDecision`; `ControlledRunRef` | 基于 source-anchored facts 评估下一姿态 | 新 progress decision、history |
| `ComposeWorkingContext` | `ActorContext actor`; `ContextCompositionRequest request`; `CommandMetadata metadata`; `IdempotencyKey idempotency_key` | `ContextCompositionDecision`; `WorkingContext` / `CompositionBlocked` | 筛选候选、应用约束、形成 bounded context | working context、memory use records |
| `RecordWorkingMemory` | `ActorContext actor`; `MemoryCandidate candidate`; `CommandMetadata metadata`; `IdempotencyKey idempotency_key` | `WorkingMemoryRef`; `MemoryUseRecord` | 校验 candidate 后加入 run window | working memory 新版本 |
| `StartModelTurn` | `ActorContext actor`; `ModelIntent intent`; `WorkingContext context`; `CommandMetadata metadata`; `IdempotencyKey idempotency_key` | `ModelTurnRef`; `ModelSubmissionCandidate` / `ModelTurnBlocked` | 冻结上下文并登记 adapter candidate | `ModelIntent`、`ModelTurn` |
| `ClassifyModelResult` | `ActorContext actor`; `ModelTurnRef turn_ref`; `ModelResultReference result_ref`; `CommandMetadata metadata`; `IdempotencyKey idempotency_key` | `ModelDecision`; `SafeDecisionSummary` | 将语义结果归类为有限 disposition | `ModelDecision`、summary、history |
| `ProposeAction` | `ActorContext actor`; `ActionProposalInput input`; `CommandMetadata metadata`; `IdempotencyKey idempotency_key` | `ActionDecision` | 选择 tool / delegation / feedback / no-action | `ActionDecision` |
| `EvaluateActionPreconditions` | `ActorContext actor`; `ActionDecisionRef action_ref`; `PreconditionInputs inputs`; `CommandMetadata metadata`; `IdempotencyKey idempotency_key` | `ActionPreconditionDecision` | 汇总 capability / governance / sandbox / source 前置 | guard decision |
| `ProposeDelegation` | `ActorContext actor`; `DelegationInput input`; `CommandMetadata metadata`; `IdempotencyKey idempotency_key` | `Delegation`; `RuntimeAdmissionDecision` | 建立 bounded child candidate | delegation、child admission |
| `IncorporateActionFeedback` | `ActorContext actor`; `ActionFeedbackInput input`; `CommandMetadata metadata`; `IdempotencyKey idempotency_key` | `ActionFeedbackRecord`; `RunProgressDecision` / `FeedbackPending` | 做 identity / ordering / causation 检查并追加事实 | feedback、side-effect / progress history |
| `PrepareRuntimeCheckpoint` | `ActorContext actor`; `CheckpointInput input`; `CommandMetadata metadata`; `IdempotencyKey idempotency_key` | `RuntimeCheckpoint` / `CheckpointBlocked` | 检查 stable candidate 与 side-effect fence | preparing checkpoint |
| `CommitRuntimeCheckpoint` | `ActorContext actor`; `CheckpointRef checkpoint_ref`; `CommitContext commit_context`; `CommandMetadata metadata`; `IdempotencyKey idempotency_key` | committed / unknown `RuntimeCheckpoint` | 按待确认 persistence seam 提交或显式 unknown | checkpoint status / history |
| `RequestRecoveryDecision` | `ActorContext actor`; `RecoveryInput input`; `CommandMetadata metadata`; `IdempotencyKey idempotency_key` | `RecoveryDecision` | 评估 resume / restart / wait / block / manual_review | recovery decision |
| `FinalizeRuntimeOutcome` | `ActorContext actor`; `OutcomeInput input`; `CommandMetadata metadata`; `IdempotencyKey idempotency_key` | `RuntimeOutcome` / `OutcomeBlocked` | 在 local truth first 前提下形成终局 | local outcome、history |
| `CreateHandoffCandidate` | `ActorContext actor`; `HandoffRequest request`; `CommandMetadata metadata`; `IdempotencyKey idempotency_key` | `SafeHandoffMaterial`; `HandoffAttempt` | 检查 outcome eligibility 并生成 candidate | handoff material / attempt |
| `CaptureSourceSnapshot` | `ActorContext actor`; `SourceReference source_ref`; `SnapshotRequest request`; `CommandMetadata metadata`; `IdempotencyKey idempotency_key` | `SourceSnapshot` / `SnapshotPending` | 记录版本、digest、完整性和裁剪状态 | snapshot metadata |

## 4. Query API 骨架表

| API | 输入骨架 | 输出骨架 | 读取来源 | 边界 |
|---|---|---|---|---|
| `RequestSafeRuntimeView` | `ActorContext actor`; `RunQueryRef run_ref`; `ReadScope scope`; `FreshnessRequirement freshness` | `SafeRuntimeView` / `ViewUnavailable` | `SafeRuntimeView`、`ProjectionState` | 只读；stale / degraded / unknown 不隐藏 |
| `GetRunProgress` | `ActorContext actor`; `RunQueryRef run_ref`; `ReadScope scope` | `ProgressView` / `SafeRuntimeView` | `ControlledRun`、`GoalPlanWorkspace`、history projection | 不读取 Work / Process body |
| `ResolveMemoryCandidates` | `ActorContext actor`; `MemoryQuery query`; `ReadScope scope` | `List<MemoryCandidate>`、`SourceAvailability` | memory ref / candidate seam | durable owner pending 时 unavailable / pending |
| `GetModelDecision` | `ActorContext actor`; `ModelTurnRef turn_ref`; `ReadScope scope` | `SafeDecisionSummary` / `DecisionUnavailable` | local decision / safe summary | 不暴露 raw model output / hidden reasoning |
| `ResolveSourceReference` | `ActorContext actor`; `TypedSourceQuery query`; `ReadScope scope` | `SourceReference`、`SourceAvailability` / `SourceUnavailable` | External Truth Views | 不返回 forbidden external body |
| `ReadSafeHandoffMaterial` | `ActorContext actor`; `HandoffMaterialRef material_ref`; `ReadScope scope` | `SafeHandoffMaterial` / `MaterialUnavailable` | safe handoff projection | candidate 不等于 submitted / delivered |

## 5. Inbound Event Consumer 骨架表

| Consumer | 来源 | 输入骨架 | 本地结果 | 边界 |
|---|---|---|---|---|
| `ConsumeToolOrSandboxFeedback` | `L2-tools` / `L4-sandbox` event seam | `EventEnvelope<ExternalActionFeedback>`; `EventId event_id`; `CorrelationId correlation_id`; `Optional<IdempotencyKey> idempotency_key` | `ActionFeedbackRecord`、`SideEffectMarker` 或 `FeedbackUnknown` | 不拥有执行 / capture / cleanup truth；late / duplicate 不逆写 |
| `ConsumeGovernanceDecision` | `L1-governance` event seam | `EventEnvelope<GovernanceDecisionChanged>`; event / correlation / optional idempotency | `SourceAvailability` / governance reference、blocked / progress decision | 不生成 approval / policy truth |
| `ConsumeModelAdapterResult` | model adapter candidate seam | `EventEnvelope<ModelResultAvailable>`; event / correlation / optional idempotency | `ModelDecision`、`SafeDecisionSummary` 或 pending | adapter 未闭合时保持 blocked |
| `ConsumeMemoryAvailability` | durable memory owner seam | `EventEnvelope<MemoryAvailabilityChanged>`; event / correlation / optional idempotency | `SourceAvailability`、`MemoryAvailabilityRecord` | 不写 durable memory body |
| `ConsumeHandoffAcknowledgement` | downstream / handoff seam | `EventEnvelope<HandoffAcknowledged>`; event / correlation / optional idempotency | `HandoffAttempt`、`HandoffGap` 或 unknown | acknowledged 不改写 local outcome |
| `ConsumeExternalTruthChange` | Hub / Method / Artifact / Observability owner seam | `EventEnvelope<ExternalTruthChanged>`; event / correlation / optional idempotency | `SourceSnapshot` / `SourceAvailability` / change record | source body、observed truth 不进入 Runtime |

## 6. Outbound Event 骨架表

| Event | 产生来源 | 主要消费者 | 说明 |
|---|---|---|---|
| `RuntimeRunAccepted` | `RuntimeAdmissionDecision` + accepted `ControlledRun` | Bus / downstream runtime consumer | 表示本地已接纳，不表示已执行 |
| `RuntimeProgressCommitted` | `RunProgressDecision`、`RuntimeHistoryEntry` | projections / continuation consumers | 仅传播已提交 local fact |
| `RuntimeModelDecisionClassified` | `ModelDecision`、`SafeDecisionSummary` | Action orchestration / views | 仅传播 provider-neutral disposition / refs |
| `RuntimeActionProposed` | `ActionDecision`、`ActionPreconditionDecision` | Tools / capability / sandbox adapter seam | proposed / guard result 不等于 execution |
| `RuntimeActionFeedbackRecorded` | `ActionFeedbackRecord`、`SideEffectMarker` | Run / recovery / projections | 外部反馈已本地接纳，receipt body 不出仓 |
| `RuntimeCheckpointCommitted` | committed `RuntimeCheckpoint` | recovery / projection jobs | 只在稳定提交事实成立时传播；unknown 单独标记 |
| `RuntimeOutcomeCommitted` | `RuntimeOutcome` | handoff / artifact / observability consumers | local outcome 与 delivery / observed 分层 |
| `RuntimeHandoffAttempted` | `HandoffAttempt`、`SafeHandoffMaterial` | downstream handoff consumer | candidate / submitted / acknowledged 姿态明确 |
| `RuntimeHandoffGapOpened` | `HandoffGap` | reconciliation / observability consumer | gap 不等于失败 verdict |
| `RuntimeSourceAvailabilityChanged` | `SourceAvailability` | context / model / action guards | available / pending / stale / unknown 不压平 |
| `SafeRuntimeViewUpdated` | `SafeRuntimeView`、`ProjectionState` | SDK / member / product query consumers | 只读投影更新，不是 observed truth |

## 7. Operations Job 骨架表

| Job | 输入来源 | 输出结果 | 边界 |
|---|---|---|---|
| `ResumeRecoveryContinuation` | 已提交 `RecoveryDecision`、`RuntimeCheckpoint`、`SideEffectMarker` | 新 `RunProgressDecision` / `ControlledRunRef` / `RecoveryBlocked` | 不能在 unknown side effect 下盲重试 |
| `RebuildRunProjection` | `RuntimeHistoryEntry`、`ProjectionState` | `SafeRuntimeView`、`ProjectionState` / `ProjectionGap` | 只读 history 重建，不反写 domain source |
| `RebuildSafeRuntimeViews` | local history、safe summaries、availability | `SafeRuntimeView`、`ProjectionState` | stale / rebuilding / degraded 显式可见 |
| `ReconcileHandoffGaps` | `HandoffAttempt`、`HandoffGap`、可验证 acknowledgement ref | `HandoffReconciliationRecord` / updated gap | 不制造 delivery / observed / acceptance 事实 |
| `RefreshSourceAvailability` | `SourceReference`、freshness policy | `SourceAvailability` | 不以 fake / design file / ping 声明 readiness |
| `ReevaluatePendingActionGuards` | `ActionDecision`、新 source / governance / sandbox refs | 新 `ActionPreconditionDecision` | 原 decision immutable；unknown 仍 fail-closed |
| `ExpireStaleWorkingContext` | `WorkingContext`、`WorkingMemory`、clock / policy refs | `ContextCompositionDecision` / degraded memory state | 不删除 durable memory 或改变 owner retention |

## 8. 各主要组成部分接口归属停审

| 组成部分 | 接口是否承接对象能力 | 类别与读写是否正确 | 是否误收内部 helper / 外部 owner truth | 结论 |
|---|---|---|---|---|
| Runtime Entry & Control | yes | Command / Query 正确 | no；trigger protocol / auth implementation 留外部或 Step 3 | pass |
| Run & Goal-Plan | yes | Command / Query / Job 正确 | no；projection rebuild 不写源 | pass |
| Context & Memory Mediation | yes | Command / Query / Inbound Event 正确 | no；durable memory body / index 未进入 | pass_with_pending_memory |
| Model Decision | yes | Command / Query / Inbound Event 正确 | no；adapter route / raw body 未进入 | pass_with_pending_adapter |
| Action & Delegation Orchestration | yes | Command / Inbound Event / Outbound Event 正确 | no；tools execution / capability registry / sandbox truth 未进入 | pass_with_pending_upstream |
| Checkpoint, Recovery & Handoff | yes | Command / Inbound Event / Outbound Event / Job 正确 | no；delivery / observed / persistence physical contract pending | pass_with_pending_contract |
| External Truth Views | yes | Query / Command / Inbound Event / Job 正确 | no；外部正文和 readiness 未进入 | pass_with_pending_upstream |
| Safe Runtime Views | yes | Query / Outbound Event / Job 正确 | no；projection 只读 | pass |

## 9. 跨接口一致性审计

| 审计项 | 结果 | 说明 |
|---|---|---|
| Command / Query / Event / Job 分类 | pass | Command 改写 local truth；Query 只读；Event 传播已成立事实；Job 处理 continuation / rebuild / reconciliation。 |
| 对象承接覆盖 | pass | Step 6 全部对象均有至少一个正式入口或被明确作为内部结果 / event payload 引用。 |
| actor / metadata / idempotency | pass | 所有 mutation command 显式包含 `ActorContext`、`CommandMetadata`、`IdempotencyKey`；Query 显式判断 actor；event 使用 envelope + event / correlation identity。 |
| source / owner separation | pass_with_pending_upstream | 外部 owner 仅 typed ref / snapshot / availability / adapter seam；开放 seam 不伪造正向 schema。 |
| local truth first | pass | outbound / delivery / observed / acknowledgement 通过独立 Event / feedback / gap，不反写已提交 outcome。 |
| sync / async / job separation | pass | 同步合法性与受理不下沉后台；事实传播异步；长时 continuation / rebuild / reconcile 用 Job。 |
| idempotency / late handling | pass | Command 与 event 都有稳定 identity；late / duplicate / out-of-order 只追加或 ignored。 |
| 接口命名与语言 | pass | 使用语言中立类型和语义名；不推断 Python / Rust / HTTP / RPC。 |
| unresolved interface conflict | none | 尚无接口分类或对象承接冲突；上游未闭口项列为 pending，不是正向接口事实。 |

## 10. 回填草稿

第 7 章应按“接口分类说明 -> Command -> Query -> Inbound Event Consumer -> Outbound Event -> Operations Job”的顺序装配上述已审计表格。正式正文只保留接口名称、归属、输入 / 输出骨架、读写性质和边界；本文件的讨论、旧材料污染审计及 blocker 继续留在 calibration。

## 11. 待确认事项与持续 blocker

| 编号 | 待确认 / blocker | 影响接口 | 当前安全姿态 |
|---|---|---|---|
| `L2R-UP-001~004` | Tools / capability / governance / sandbox action mapping、receipt、feedback、cleanup 正向合同未闭合 | `EvaluateActionPreconditions`、`ConsumeToolOrSandboxFeedback`、`RuntimeActionProposed`、recovery jobs | pending / blocked / fail-closed |
| `L2R-UP-005` | durable memory retrieval / snapshot / retention owner 未闭合 | `ResolveMemoryCandidates`、`ComposeWorkingContext`、`ConsumeMemoryAvailability` | pending / unavailable allowed |
| `L2R-UP-006` | model adapter owner / route / semantic result contract 未闭合 | `StartModelTurn`、`ConsumeModelAdapterResult` | adapter candidate / blocked |
| `L2R-UP-007~008` | Runtime-specific Core / Bus / Observability contract 和 implementation readiness 未闭合 | event envelope、outbound events、source availability、safe view propagation | event / ref seam only; no readiness claim |
| `L2R-CP-001` | checkpoint persistence / transaction / commit-unknown physical contract 未闭合 | `CommitRuntimeCheckpoint`、`ResumeRecoveryContinuation` | blocked / unknown explicit |
| `L2R-ENTRY-001` | member / product entry lifecycle 未校准 | `AcceptRuntimeTrigger` actor / product boundary | external entry pending |

## 12. Step 7 自检与门禁

| 检查项 | 结果 |
|---|---|
| 已按八个主要组成部分标注接口归属并承接 Step 6 对象能力 | pass |
| Command / Query / Inbound Event / Outbound Event / Operations Job 表均已按实际存在情况输出 | pass |
| mutation Command 的 actor、metadata、幂等信息已显式判断 | pass |
| Query 的 actor / read-only 边界已显式判断 | pass |
| Event Consumer 的 envelope、event id、correlation、幂等信息已显式判断 | pass |
| 输出未下沉 HTTP / RPC / JSON / proto / topic schema | pass |
| 未把内部 helper、repository 或外部 owner truth 当公共 API | pass |
| 所有对象入口覆盖、接口分类、同步 / 异步 / Job 语义和 local truth first 通过审计 | pass |
| pending / blocker 保持 candidate / blocked / fail-closed | pass |

**Step 7 结论：** `done`。允许进入 Step 8 关键处理流；必须先更新文档 flow、项目执行台账并创建 Step 8 中间产物。正式 `02-概要设计.md` 仍不得装配，且不能进入 Step 9。
