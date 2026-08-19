# L2-runtime 02 概要 Step 8: 关键处理流 / 重要函数数据流

> 创建日期: 2026-08-07
> 状态: done
> 当前模式: full-restart
> 回填位置: `02-概要设计.md` 第 8 章

## 0. Step 开工确认

| 项目 | 记录 |
|---|---|
| 输入 | Step 7 API / 接口骨架、Step 6 关键对象、Step 5 组成部分与边界、01 架构交互语义 |
| 目标 | 以概要粒度收稳关键 Command、Query、Inbound Event Consumer、Outbound Event 和 Operations Job 的处理流、关键对象使用、事务内外边界与失败分支 |
| 禁止 | 完整函数调用链、伪代码、SQL / DDL、协议字段级时序、错误码全集、retry 参数、未闭合上游正向实现 |

## 1. 通用处理流骨架

### 1.1 Command 写路径

```text
Command
  │
  ▼
Inbound / Command Acceptance
  - 校验 ActorContext、scope、CommandMetadata 与 IdempotencyKey
  - 解析 typed source / correlation，不从 display text 推断权限
  │
  ▼
Application Service
  - 读取当前 local truth 与外部 SourceAvailability
  - 形成显式 policy / guard decision
  │
  ▼
Domain Object / Repository Port
  - 通过对象方法产生新 decision / history / state anchor
  - 在单一本地提交边界内记录可回链事实
  │
  ▼
Result / Outbox Candidate / Projection
  - 返回已提交结果或 blocked / unknown
  - 已提交事实才可生成 outbound event candidate
```

关键设计点：
- Command 的同步部分负责合法性、幂等和本地写入语义；长时等待、外部反馈和投影重建不伪装成同步完成。
- Runtime domain 只写自己的 truth；外部执行、approval、sandbox、artifact、observability 和 provider control 通过 seam 消费。
- commit-unknown、外部副作用 unknown 和 source unknown 进入显式 unknown / blocked 分支，不能从调用 repository 推导成功。
- 详细设计继续展开事务隔离、错误码、持久化协议和具体 port contract。

### 1.2 Query 读路径

```text
Query
  │
  ▼
Inbound / Query Boundary
  - 校验 ActorContext 与 ReadScope
  - 解析 freshness 要求
  │
  ▼
Application Query Service
  - 读取 Safe Runtime View / ProjectionState
  - 识别 stale、degraded、rebuilding、unknown
  │
  ▼
Projection / Read Model
  - 从 committed RuntimeHistoryEntry 重建或读取
  │
  ▼
Result / Safe View
  - 返回 SafeRuntimeView、SafeHandoffMaterial 或显式 unavailable
```

关键设计点：
- Query 无 domain mutation 权限；视图落后、来源缺失或不可证明时把降级姿态返回给消费者。
- Query 不暴露 forbidden body、raw model response、provider secret、治理正文或 observed truth。
- 简单视图读取不再重复绘制独立图；带裁剪、freshness、ProjectionNotReady 的查询走上述边界。

### 1.3 Inbound Event Consumer 路径

```text
Inbound Event
  │
  ▼
Consumer
  - 验证 EventEnvelope、EventId、CorrelationId、来源 authority
  - 执行 idempotency / identity / ordering 判定
  │
  ▼
Application Incorporation Service
  - 将外部 feedback / availability / acknowledgement 转换为本地 reference record
  - late / duplicate / out-of-order 只追加关联事实或 ignored
  │
  ▼
Domain Record / Decision
  - 追加 ActionFeedbackRecord、SourceAvailability、HandoffGap 或新 recovery / progress decision
  │
  ▼
Local History / Projection / Outbound Event Candidate
  - 提交本地事实后再派生 view / event
```

关键设计点：
- Event consumer 不把外部 event 当作 Runtime owner truth；只记录来源、快照、反馈和本地接纳结果。
- 不允许用迟到反馈覆盖已提交 outcome、action decision、checkpoint 或 history。
- 外部事件合同未闭合时，consumer 只存在 candidate / blocked seam，不声明可运行 readiness。

### 1.4 Operations Job 路径

```text
Operations Job
  │
  ▼
Job Runner
  - 读取已提交 RuntimeHistoryEntry / checkpoint / gap / projection state
  - 建立 JobRunContext 与 correlation
  │
  ▼
Application Continuation / Reconciliation Service
  - 形成新 recovery / progress / projection decision
  - 不把 job 作为同步 admission 的替代
  │
  ▼
Domain Object / Projection / Outbound Candidate
  - 追加 immutable local fact 或可重建 projection
  │
  ▼
Job Result
  - completed / waiting / blocked / degraded / unknown
```

关键设计点：
- Job 只基于已持久化事实工作，不能通过猜测补齐外部 receipt、delivery、observed 或 acceptance。
- Recovery job 遇到 unknown side effect 时转 manual_review / blocked；handoff reconciliation 只能消费新可验证事实。
- 详细设计继续展开调度、锁、租约、重入和作业失败记录。

## 2. 关键处理流覆盖清单

| 接口 / 任务 | 主要组成部分 | 是否独立处理流 | 理由 |
|---|---|---:|---|
| `AcceptRuntimeTrigger` | Runtime Entry & Control | yes | P0 admission，决定是否可创建 run |
| `ApplyRuntimeControl` | Runtime Entry & Control | yes | control / resume / cancel 改写 local run decision |
| `RequestSafeRuntimeView` | Runtime Entry & Control / Safe Runtime Views | yes | actor / freshness / degraded query 边界 |
| `EvaluateRunProgress` | Run & Goal-Plan | yes | P0 next-step decision 与 history commit |
| `ComposeWorkingContext` | Context & Memory Mediation | yes | source selection、预算与 omission 影响主线 |
| `ConsumeMemoryAvailability` | Context & Memory Mediation | yes | inbound event 改写 source availability / local record |
| `StartModelTurn` + `ConsumeModelAdapterResult` | Model Decision | yes（合并语义链，分开提交边界） | model intent、adapter pending、classification 共同决定下一步 |
| `ProposeAction` + `EvaluateActionPreconditions` | Action & Delegation | yes | action choice 与 fail-closed guard 必须分层 |
| `ConsumeToolOrSandboxFeedback` | Action & Delegation | yes | 外部 feedback / side-effect marker 会影响 recovery |
| `ProposeDelegation` | Action & Delegation | yes | parent / child context、admission 与 incorporation 边界 |
| `PrepareRuntimeCheckpoint` + `CommitRuntimeCheckpoint` | Checkpoint / Recovery / Handoff | yes | stable point 与 commit-unknown 主线 |
| `RequestRecoveryDecision` + `ResumeRecoveryContinuation` | Checkpoint / Recovery / Handoff | yes | recovery 新决定和异步 continuation |
| `FinalizeRuntimeOutcome` | Checkpoint / Recovery / Handoff | yes | local outcome first |
| `CreateHandoffCandidate` + `ConsumeHandoffAcknowledgement` | Checkpoint / Recovery / Handoff | yes | candidate / submitted / acknowledged / gap 分离 |
| `ResolveSourceReference` / `CaptureSourceSnapshot` | External Truth Views | yes | owner / version / completeness / fail-closed |
| `RebuildSafeRuntimeViews` | Safe Runtime Views | yes | projection consistency与可重建性 |
| 其他简单 Query、Outbound Event | 对应组成部分 | no，走通用路径 | 仅读取已定义 projection 或传播已提交 safe fact，不新增事务语义 |

## 3. 关键处理流

### 3.1 `AcceptRuntimeTrigger` 处理流

```text
AcceptRuntimeTrigger Command
  │
  ▼
RuntimeCommandAcceptance
  - 读取 RuntimeTriggerContext
  - 校验 ActorContext、scope、source 与幂等键
  │
  ▼
RuntimeControlService
  - 读取 SourceAvailability / PreconditionSummary
  - 调用 RuntimeAdmissionDecision.decide(RuntimeTriggerContext trigger, PreconditionSummary preconditions)
  │
  ▼
RuntimeAdmissionDecision / ControlledRun
  - accepted 才调用 ControlledRun.create(RuntimeAdmissionDecision admission, RuntimeTriggerContext trigger)
  - waiting / blocked / rejected 不创建可推进 run
  │
  ▼
RuntimeHistoryEntry / RuntimeRunAccepted 或 AdmissionBlocked
```

关键设计点：
- `accepted` 只表示 Runtime admission，不表示 governance approval、tool execution 或外部 readiness。
- actor / scope / goal refs 必须有 typed source；unknown 前置只能 waiting / blocked。
- 详细设计继续展开 admission transaction、重复请求返回和错误码。

### 3.2 `ApplyRuntimeControl` 处理流

```text
ApplyRuntimeControl Command
  │
  ▼
RuntimeControlService
  - 读取 ControlledRun、GoalPlanWorkspace、SideEffectMarker
  - 判定 pause / cancel / resume intent 的允许范围
  │
  ▼
RunProgressDecision
  - 调用 RunProgressDecision.decide(ControlledRun run, GoalPlanWorkspace workspace, DecisionInputs inputs)
  - resume 需要 stable checkpoint / recovery guard
  │
  ▼
ControlledRun.apply_progress(RunProgressDecision decision) / RuntimeHistoryEntry.append(...)
  │
  ▼
ControlResult / RuntimeProgressCommitted
```

关键设计点：
- control 不绕过本地 history，也不直接更改外部 action。
- cancel 只改变 Runtime local posture；未知外部副作用仍由 SideEffectMarker 围栏。
- 详细设计继续展开控制命令与并发版本冲突。

### 3.3 `RequestSafeRuntimeView` 处理流

```text
RequestSafeRuntimeView Query
  │
  ▼
RuntimeQueryService
  - 校验 ActorContext / ReadScope / FreshnessRequirement
  │
  ▼
SafeViewProjectionService
  - 读取 ProjectionState、RuntimeHistoryEntry、SourceAvailability
  - 调用 SafeRuntimeView.rebuild(ControlledRun run, List<RuntimeHistoryEntry> history, List<SourceAvailability> availability)
  │
  ▼
SafeRuntimeView / ViewUnavailable
```

关键设计点：
- projection 只从 committed local history 重建，不能把 view 反写为 truth。
- stale / degraded / unknown 作为 query surface 保留；不得伪造 current。
- 详细设计继续展开读取权限、分页 / freshness cursor 和 projection rebuild consistency。

### 3.4 `EvaluateRunProgress` 处理流

```text
EvaluateRunProgress Command
  │
  ▼
RunCoordinator
  - 读取 ControlledRun、GoalPlanWorkspace、当前 Context / Model / Action / Outcome refs
  - 校验 source、version、pending dependencies
  │
  ▼
RunProgressDecision
  - 调用 RunProgressDecision.decide(ControlledRun run, GoalPlanWorkspace workspace, DecisionInputs inputs)
  - next_candidates 只产生可评估候选，不隐式推进
  │
  ▼
ControlledRun.apply_progress(RunProgressDecision decision)
  - GoalPlanWorkspace.record_progress(RunProgressDecision decision)
  - RuntimeHistoryEntry.append(RuntimeFactKind fact_kind, TypedRef fact_ref, RuntimeCorrelation correlation, Optional<TypedRef> causation_ref)
  │
  ▼
RunProgressDecision / RuntimeProgressCommitted / Safe Runtime projection candidate
```

关键设计点：
- 缺依赖不能写 completed；terminal / blocked / waiting 必须保留具体姿态。
- progress decision 与 history 是 immutable append；late feedback 形成新 decision。
- 详细设计继续展开 optimistic version、事务边界和 candidate ordering。

### 3.5 `ComposeWorkingContext` 处理流

```text
ComposeWorkingContext Command
  │
  ▼
ContextCompositionService
  - 读取 MemoryCandidate、SourceSnapshot、SourceAvailability 与 ContextConstraints
  - 调用 ContextCompositionDecision.decide(RunId run_id, List<MemoryCandidate> candidates, ContextConstraints constraints)
  │
  ▼
ContextCompositionDecision
  - accepted / partial 才调用 WorkingContext.compose(ContextCompositionDecision decision, List<ContextSegmentRef> segment_refs, ContextBudget budget)
  - 记录 MemoryUseRecord.record(...)
  │
  ▼
WorkingMemory / WorkingContext / CompositionBlocked
```

关键设计点：
- 组合只消费安全 ref / snapshot，不接管 durable memory body、index 或 retention。
- partial 只能按明确缺口继续；unknown source 不得进入 accepted context。
- 详细设计继续展开排序、预算、冲突、裁剪和窗口版本。

### 3.6 `StartModelTurn` / `ConsumeModelAdapterResult` 处理流

```text
StartModelTurn Command
  │
  ▼
ModelDecisionService
  - 校验 ModelIntent.requires_context() 与 WorkingContext.frozen 状态
  - 创建 ModelTurn.start(ModelIntent intent, WorkingContext context, TurnSequence sequence)
  │
  ▼
ModelTurn / ModelSubmissionCandidate
  - adapter seam pending 时停在 submitted candidate / blocked
  │
  ▼
ConsumeModelAdapterResult Inbound Event
  - 校验 EventEnvelope、turn identity、correlation、ordering
  │
  ▼
ModelDecisionService
  - 调用 ModelDecision.derive(ModelTurn turn, ModelOutputClassification classification, SafeDecisionSummary summary)
  - 创建 SafeDecisionSummary.create(ModelDecision decision, SafeReasonCategory category, List<SourceReference> source_refs, RedactionProfile redaction_profile)
  │
  ▼
ModelDecision / SafeDecisionSummary / RuntimeModelDecisionClassified
```

关键设计点：
- Runtime 只拥有 logical intent / disposition；route、secret、quota、cost、raw response 在 adapter owner。
- turn 为 unknown 或 late 时不自动转成 action；必须重新形成可回链决定。
- 详细设计继续展开 adapter result mapping、turn concurrency 和 redaction contract。

### 3.7 `ProposeAction` / `EvaluateActionPreconditions` 处理流

```text
ProposeAction Command
  │
  ▼
ActionOrchestrationService
  - 读取 ModelDecision、GoalPlanWorkspace、SourceAvailability
  - 调用 ActionDecision.propose(RunId run_id, ActionKind action_kind, TypedRef target_ref, List<SourceReference> source_refs)
  │
  ▼
ActionDecision (proposed)
  │
  ▼
EvaluateActionPreconditions Command
  - 汇总 capability / governance / sandbox / tools typed inputs
  - 调用 ActionPreconditionDecision.evaluate(ActionDecision action, PreconditionInputs inputs)
  │
  ▼
ActionPreconditionDecision / RuntimeActionProposed 或 ActionBlocked
```

关键设计点：
- action choice 与 execution 分离；`allowed` 只允许交给 external dispatch seam。
- 任一 required owner input missing / stale / conflict / unknown 都是 waiting / denied / unknown，不能 local allow。
- 详细设计继续展开 precondition precedence、canonical action mapping 和 outbox / event commit boundary。

### 3.8 `ConsumeToolOrSandboxFeedback` 处理流

```text
ConsumeToolOrSandboxFeedback Inbound Event
  │
  ▼
ActionFeedbackConsumer
  - 验证 external source authority、EventId、ActionDecisionRef、correlation 与 ordering
  │
  ▼
ActionFeedbackRecord
  - 调用 ActionFeedbackRecord.record(ActionDecision action, FeedbackKind feedback_kind, Optional<TypedRef> receipt_ref, List<SourceReference> source_refs)
  - 创建 / 更新 SideEffectMarker 只能形成新事实，不清除 unknown fence
  │
  ▼
ControlledRun / RecoveryCoordinator
  - known feedback 可形成新的 RunProgressDecision / RecoveryDecision
  - duplicate / late / out-of-order 形成 ignored / linked-new-fact
  │
  ▼
RuntimeHistoryEntry / RuntimeActionFeedbackRecorded / Recovery candidate
```

关键设计点：
- receipt / capture / cleanup / execution truth 仍由 Tools / Sandbox owner；Runtime 只接收可验证引用与分类。
- acknowledged / delivered 不自动成为 completed；unknown effect 需要 recovery fence。
- 详细设计继续展开 event dedupe、ordering key、feedback incorporation transaction。

### 3.9 `ProposeDelegation` 处理流

```text
ProposeDelegation Command
  │
  ▼
ActionOrchestrationService
  - 检查 parent run scope、child scope / budget、最小 input refs
  │
  ▼
Delegation.propose(RunId parent_run_id, RuntimeScope scope, List<TypedRef> input_refs)
  - 调用 RuntimeAdmissionDecision.decide(RuntimeTriggerContext trigger, PreconditionSummary preconditions)
  │
  ▼
Delegation / RuntimeAdmissionDecision
  - accepted 才允许 child run candidate
  │
  ▼
Child admission event / Delegation pending
```

关键设计点：
- parent / child 不共享 mutable body；child result 通过安全引用回到 parent incorporation。
- delegation 不拥有 member-service、container 或 image 生命周期。
- 详细设计继续展开 child identity、budget / scope enforcement 和 result incorporation。

### 3.10 `PrepareRuntimeCheckpoint` / `CommitRuntimeCheckpoint` 处理流

```text
PrepareRuntimeCheckpoint Command
  │
  ▼
RecoveryCoordinator
  - 读取 ControlledRun、RuntimeHistoryEntry、SideEffectMarker
  - 调用 RuntimeCheckpoint.prepare(ControlledRun run, List<TypedRef> state_refs, HistoryCursor history_cursor, List<SideEffectMarkerId> side_effect_refs)
  │
  ▼
RuntimeCheckpoint (preparing)
  │
  ▼
CommitRuntimeCheckpoint Command
  - 在待确认的本地 persistence / transaction seam 尝试提交
  │
  ▼
RuntimeCheckpoint (committed / unknown) / RuntimeCheckpointCommitted candidate
```

关键设计点：
- stable 只在本地提交结果可证明时成立；commit-unknown 必须显式 unknown。
- checkpoint 仅保存可重建 anchors、history cursor 和副作用围栏，不保存外部正文。
- 详细设计继续展开事务、并发版本、提交未知查询与恢复策略。

### 3.11 `RequestRecoveryDecision` / `ResumeRecoveryContinuation` 处理流

```text
RequestRecoveryDecision Command
  │
  ▼
RecoveryCoordinator
  - 读取 stable checkpoint、SideEffectMarker、ActionFeedbackRecord 与当前 local truth
  - 调用 RecoveryDecision.decide(ControlledRun run, Optional<RuntimeCheckpoint> checkpoint, List<SideEffectMarker> markers, RecoveryInputs inputs)
  │
  ▼
RecoveryDecision (resume / restart / wait / block / manual_review)
  │
  ▼
ResumeRecoveryContinuation Job
  - 仅对 permits_resume() 的决定继续
  - 追加新 RunProgressDecision，不修改旧 history / outcome
  │
  ▼
ControlledRun / GoalPlanWorkspace / RuntimeHistoryEntry / RecoveryBlocked
```

关键设计点：
- unknown side effect、无 stable point 或来源不完整时 fail-closed；manual_review 是显式姿态。
- restart 不是补偿执行；retry 是否安全由 SideEffectMarker 和 owner contract 决定。
- 详细设计继续展开 job lease、re-entry、recovery transaction 和 manual review handoff。

### 3.12 `FinalizeRuntimeOutcome` 处理流

```text
FinalizeRuntimeOutcome Command
  │
  ▼
RunCoordinator / RecoveryCoordinator
  - 校验 run 当前状态、terminal checkpoint、未闭合 side-effect / gap
  │
  ▼
RuntimeOutcome.finalize(RunId run_id, OutcomeDisposition disposition, SafeDecisionSummaryRef summary_ref, Optional<CheckpointId> terminal_checkpoint_ref, List<SourceReference> source_refs)
  │
  ▼
RuntimeOutcome / RuntimeHistoryEntry
  - 计算 HandoffEligibility，不生成 external verdict
  │
  ▼
RuntimeOutcomeCommitted / Handoff candidate 或 OutcomeBlocked
```

关键设计点：
- local outcome 先成立；handoff eligibility、attempt、delivery、observed、acceptance 分层。
- pending / unknown 不得压平为 succeeded；未闭 gap 可以使 handoff ineligible。
- 详细设计继续展开终态 guard、并发提交和 outcome-to-handoff mapping。

### 3.13 `CreateHandoffCandidate` / `ConsumeHandoffAcknowledgement` 处理流

```text
CreateHandoffCandidate Command
  │
  ▼
SafeMaterialAssembler
  - 读取 RuntimeOutcome、SafeDecisionSummary、allowed refs、source availability
  - 调用 SafeHandoffMaterial.create(RuntimeOutcome outcome, HandoffPurpose purpose, List<TypedRef> allowed_refs, List<SourceReference> source_refs, RedactionProfile redaction_profile)
  │
  ▼
HandoffAttempt.create(RuntimeOutcome outcome, TypedRef target_ref, SafeHandoffMaterial material)
  - status = candidate
  │
  ▼
Outbound handoff seam / RuntimeHandoffAttempted
  │
  ▼
ConsumeHandoffAcknowledgement Inbound Event
  - 校验 attempt identity / event ordering
  - acknowledged / rejected / unknown 形成新 HandoffAttempt / HandoffGap 事实
```

关键设计点：
- candidate / submitted / acknowledged 是不同状态；acknowledged 不等于业务完成。
- material body-free、可重放、带稳定 correlation / idempotency 语境；外部 delivery / observed 归 owner。
- 详细设计继续展开 outbox 关系、ack dedupe、gap reconciliation 和 redaction contract。

### 3.14 `ResolveSourceReference` / `CaptureSourceSnapshot` 处理流

```text
ResolveSourceReference Query
  │
  ▼
ExternalTruthResolutionService
  - 校验 owner kind、object identity、version / digest
  │
  ▼
SourceReference / SourceAvailability
  │
  ▼
SourceReference / SourceUnavailable

CaptureSourceSnapshot Command
  │
  ▼
ExternalTruthResolutionService
  - 仅记录 source version、digest、captured_at、completeness、redaction profile
  │
  ▼
SourceSnapshot / SnapshotPending
```

关键设计点：
- ref / snapshot 是消费视图，不是外部 owner body 副本；digest 不代表 content。
- unavailable / partial / stale / unknown 不能形成未经约束的正向决定。
- 详细设计继续展开 freshness、source conflict、snapshot retention 和 adapter seam。

### 3.15 `RebuildSafeRuntimeViews` 处理流

```text
RebuildSafeRuntimeViews Operations Job
  │
  ▼
SafeViewProjectionService
  - 读取 RuntimeHistoryEntry、SafeDecisionSummary、SourceAvailability、ProjectionState
  │
  ▼
SafeRuntimeView.rebuild(ControlledRun run, List<RuntimeHistoryEntry> history, List<SourceAvailability> availability)
  - 形成 ProjectionState.create(HistoryCursor source_cursor, ProjectionStatus status, Boolean rebuildable)
  │
  ▼
SafeRuntimeView / ProjectionState / ProjectionGap
  - 可选生成 SafeRuntimeViewUpdated
```

关键设计点：
- projection 只从 local truth 重建，不能给 run / outcome / external observed 反写状态。
- rebuilding / stale / degraded / unknown 必须可见，不能伪装 current。
- 详细设计继续展开 cursor、并发重建、投影幂等和 gap recovery。

## 4. 未展开处理流的取舍说明

| 未单独绘制接口 | 原因 | 仍由何处覆盖 |
|---|---|---|
| `GetRunProgress` | 与通用 Query 读路径相同，仅读取 local projection | §1.2、Step 7 Query 表 |
| `ResolveMemoryCandidates` | 只读取 pending candidate / availability，不写 Runtime truth | §1.2、§3.5、Step 7 Query 表 |
| `GetModelDecision` | 只读取 safe summary | §1.2、Step 7 Query 表 |
| `ReadSafeHandoffMaterial` | 只读 body-free material | §1.2、§3.13、Step 7 Query 表 |
| 简单 Outbound Events | 传播已提交对象引用，无独立 domain mutation | §1.3、Step 7 Outbound Event 表 |
| `RefreshSourceAvailability` | 只刷新 source view，关键 fail-closed 已在 §3.14 覆盖 | §1.4、§3.14、Step 7 Job 表 |
| `ReevaluatePendingActionGuards` / `ExpireStaleWorkingContext` | continuation 细节不改变主线结构 | §1.4、Step 7 Job 表、Step 10 异常边界 |

## 5. 按主要组成部分处理流归属停审

| 组成部分 | 接口覆盖 | 对象引用 | 跨部分接缝 | 越层检查 | 结论 |
|---|---|---|---|---|---|
| Runtime Entry & Control | admission / control / safe query 有独立流 | Step 6 对象均已定义 | Run、Safe View seam 明确 | 未写鉴权实现 / 协议细节 | pass |
| Run & Goal-Plan | progress / projection job 有独立流 | run、workspace、decision、history 已定义 | Context / Model / Action / Outcome refs 明确 | 未写完整调用链 / DDL | pass |
| Context & Memory Mediation | composition / memory event 有独立流 | working / candidate / use record 已定义 | External source seam pending 已标注 | 未拥有 durable body | pass_with_pending_memory |
| Model Decision | turn + result 消费有独立流 | intent / turn / decision / summary 已定义 | adapter candidate pending | 未写 route / raw response | pass_with_pending_adapter |
| Action & Delegation | choice / guard / feedback / delegation 有独立流 | action、delegation、feedback、marker 已定义 | Tools / capability / governance / sandbox typed seam | 未写 execution | pass_with_pending_upstream |
| Checkpoint / Recovery / Handoff | checkpoint / recovery / outcome / handoff 有独立流 | 所需对象均已定义 | persistence / outbound ack pending | 未拥有 delivery / observed | pass_with_pending_contract |
| External Truth Views | source resolve / snapshot 有独立流 | refs / snapshot / availability 已定义 | owner / adapter classification 清楚 | 未复制 body | pass_with_pending_upstream |
| Safe Runtime Views | rebuild job 有独立流 | view / projection / history 已定义 | local history first | 未反写 source truth | pass |

## 6. 跨处理流一致性审计

| 审计项 | 结果 | 说明 |
|---|---|---|
| 接口覆盖 | pass | 关键 P0 Command、会改写 local state 的 Inbound Event、影响一致性的 Job 均有独立处理流；简单 Query / Event 有明确取舍。 |
| 对象引用 | pass | 处理流中出现的 RuntimeTriggerContext、ControlledRun、WorkingContext、ModelTurn、ActionDecision、RuntimeCheckpoint、RuntimeOutcome、SafeRuntimeView 等均已在 Step 6 定义。 |
| 跨部分接缝 | pass_with_pending_upstream | Tools / Sandbox / Governance / Model / Memory / Observability 正向 seam 仍 candidate / blocked / fail-closed。 |
| 事务边界 | pass_with_pending_contract | 本地 commit first、outbound after commit、checkpoint commit-unknown 已点名；具体事务协议留 03。 |
| history / ordering | pass | 所有 feedback / recovery / projection 更新均追加新事实，不逆写；event identity / correlation / causation 有入口。 |
| action / execution separation | pass | Propose / precondition / feedback / side-effect marker 分层。 |
| projection read-only | pass | query / rebuild 不拥有 mutation，stale / degraded / gap 明确可见。 |
| 未展开接口理由 | pass | 每个未独立绘制接口已列出覆盖位置与原因。 |
| unresolved flow conflict | none | 未发现处理流引用未定义对象、跨部分无人接缝或同步 / 异步语义冲突。 |

## 7. 回填草稿

第 8 章应按通用写路径、读路径、事件消费路径、Job 路径，再按 P0 / 高风险接口装配独立 ASCII 处理流。正式正文只保留流程结构、关键设计点、对象 / 接口对应和未展开取舍；函数参数保持概要类型名，不下沉实现调用链。

## 8. 待确认事项与持续 blocker

| 编号 | 待确认 / blocker | 影响处理流 | 当前安全姿态 |
|---|---|---|---|
| `L2R-UP-001~004` | Tool / capability / governance / sandbox action mapping、receipt、feedback、cleanup 未闭合 | §3.7、§3.8、§3.11 | blocked / fail-closed |
| `L2R-UP-005` | durable memory query / snapshot / retention 未闭合 | §3.5、§3.14 | ref-only / unavailable |
| `L2R-UP-006` | model adapter owner / semantic result 未闭合 | §3.6 | candidate / blocked |
| `L2R-UP-007~008` | Core / Bus / Observability runtime-specific seam 与 readiness 未闭合 | §3.8、§3.13、§3.15 | event / ref seam only |
| `L2R-CP-001` | checkpoint persistence / commit-unknown 未闭合 | §3.10、§3.11 | explicit unknown / blocked |

## 9. Step 8 自检与门禁

| 检查项 | 结果 |
|---|---|
| 已建立通用 Command / Query / Event / Job 处理流骨架 | pass |
| P0 Command 均有独立处理流 | pass |
| 会改写 local state 的 Inbound Event 均有独立处理流 | pass |
| 影响一致性或传播可靠性的 Operations Job 均有独立处理流 | pass |
| 每个处理流点名的对象均已在 Step 6 定义 | pass |
| 关键函数参数使用 `TypeName param_name`，未写完整签名 / 实现 | pass |
| 事务、history、ordering、local truth first 和外部 seam 边界已审计 | pass_with_pending_contract |
| 未展开处理流均有明确原因 | pass |
| 未伪造上游 readiness、receipt、delivery、observed 或测试证据 | pass |

**Step 8 结论：** `done`。允许进入 Step 9 状态定义与状态流转；必须先更新文档 flow、项目执行台账并创建 Step 9 中间产物。正式 `02-概要设计.md` 仍不得装配，且不能进入 Step 10。
