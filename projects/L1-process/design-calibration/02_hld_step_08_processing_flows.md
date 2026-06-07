# Step 8. 关键处理流 / 重要函数数据流

> 对应 SOP: `standards/document/概要设计讨论流程_SOP.md` Step 8
> 回填章节: `02-概要设计.md` §8 关键处理流 / 重要函数数据流
> 生成日期: 2026-06-05
> 状态: 已完成

---

## 1. 本步目标

基于 Step 6 关键对象和 Step 7 接口骨架,说明关键 command、query、event consumer 和 operations job 如何经过 application service、domain object、repository / projection / outbox 形成处理流。

本步只写概要级数据流、事务内外边界和关键对象关系,不写完整伪代码、SQL、错误码全集、重试参数或完整 Rust 签名。

---

## 2. 本步输入

| 输入 | 状态 | 用途 |
|---|---|---|
| `02_hld_step_07_api_interface_skeleton.md` | 已完成 | 提供需要覆盖的 Command / Query / Consumer / Event / Job 骨架 |
| `02_hld_step_06_key_objects.md` + 五个对象附录 | 已完成 | 提供处理流必须反查的对象 |
| `02_hld_step_05_components_boundary.md` | 已完成 | 提供主要组成部分归属 |
| `01_arch_step_09_interactions_communication.md` | 已完成 | 提供同步、异步、后台边界 |
| `00_req_step_09_functional_requirements.md` | 已完成 | 提供核心能力闭环 FR-PROC-001~008 |

---

## 3. 通用处理流骨架

```text
+====================== L1-process generic flow ======================+
| Inbound command / query / event / job                                |
|        | validate actor / metadata / idempotency / dedup             |
|        v                                                             |
| Application service / consumer / job service                         |
|        | load Process truth / snapshot / projection as needed         |
|        v                                                             |
| Domain object + policy                                               |
|        | decide accepted / rejected / pending / stale / handoff       |
|        v                                                             |
| Repository / projection / outbox / trace boundary                    |
|        | emit result, event intent, trace, marker, or report          |
+=====================================================================+
```

关键设计点:

- Command 成功表示 Process-owned truth 已在同步边界内成立。
- Query 只能读取 truth / projection / trace / report,不得隐式创建或修复对象。
- Inbound Event Consumer 只能写 snapshot / reference / pending feedback / stale marker,不得绕过 Process policy 直接推进主线。
- Operations Job 只能维护派生、快照、outbox、对账、handoff 或 recovery marker,不得静默修正业务 truth。
- Outbound Event 从 committed Process truth / marker 生成,发布失败不回滚主真相。

---

## 4. Command 处理流

#### SyncRuntimeProcessShape 处理流

```text
+====================== SyncRuntimeProcessShape ======================+
| command: MethodDefinitionRef + ExternalVersionRef + sync intent       |
|        v                                                             |
| ProcessShapeSyncService reserves idempotency                         |
|        v                                                             |
| load MethodDefinitionSnapshot / resolver summary                     |
|        v                                                             |
| ShapeDefinitionPolicy validates source version and body exclusion     |
|        v                                                             |
| RuntimeProcessShape::from_definition(MethodDefinitionSnapshot snap,  |
|                                      ActorRef actor)                 |
|        v                                                             |
| save RuntimeProcessShape + snapshot marker + trace + outbox           |
+=====================================================================+
```

关键设计点:runtime shape 是 Process-owned executable index,不是 method-library 定义正文副本;定义来源不可用时只能 unresolved / retry,不能自造 shape。

#### AdoptProcessProfile 处理流

```text
+======================== AdoptProcessProfile ========================+
| command: WorkContextRef + RuntimeProcessShapeRef + tailoring intent   |
|        v                                                             |
| ProcessProfileCommandService reserves idempotency                    |
|        v                                                             |
| load RuntimeProcessShape + WorkContextSnapshot                       |
|        v                                                             |
| ProfileTailoringPolicy checks adoption / tailoring boundary          |
|        v                                                             |
| ProcessProfile::adopt(RuntimeProcessShapeRef shape_ref,             |
|                       WorkContextRef work_context_ref, ActorRef)     |
|        v                                                             |
| save ProcessProfile + ProfileChangeRecord + audit + outbox           |
+=====================================================================+
```

关键设计点:profile adopt 表达项目采用过程语境,不改变 Project、Backlog、WorkItem 或 MethodProfile truth。

#### StartProcessInstance 处理流

```text
+======================== StartProcessInstance =======================+
| command: ProcessProfileRef + WorkContextRef + start intent            |
|        v                                                             |
| ProcessInstanceCommandService reserves idempotency                   |
|        v                                                             |
| load ProcessProfile + RuntimeProcessShape + WorkContextSnapshot      |
|        v                                                             |
| InstanceProgressionPolicy validates start preconditions              |
|        v                                                             |
| ProcessInstance::start(ProcessProfileRef profile_ref,               |
|                        RuntimeProcessShapeRef shape_ref, ActorRef)   |
| Activity / Token / Gateway initial position created                  |
|        v                                                             |
| save instance + initial activity/token + trace + outbox               |
+=====================================================================+
```

关键设计点:ProcessInstance 只能由显式 command 建立;Query、workspace projection 或 conversation context 不能隐式创建实例。

#### AdvanceProcessActivity 处理流

```text
+======================= AdvanceProcessActivity ======================+
| command: ProcessInstanceRef + ActivityRef + ActivityProgressionIntent |
|        v                                                             |
| ActivityProgressionService reserves idempotency                      |
|        v                                                             |
| load ProcessInstance + Activity + Token + Gateway                    |
|        v                                                             |
| ActivityFeedbackPolicy / GatewayRoutingPolicy validates progression  |
|        v                                                             |
| map ActivityProgressionIntentRef to Activity.ready/start/complete/... |
| map flow-control intent to Token / Gateway state change               |
|        v                                                             |
| save activity + token/gateway + progression record + trace + outbox   |
+=====================================================================+
```

关键设计点:该流只推进 Process 节点和流控位置;WorkItem lifecycle、runtime execution step 和 tool call 不属于本仓 truth。

#### RecordActivityFeedback 处理流

```text
+======================== RecordActivityFeedback =====================+
| command: ActivityRef + RuntimeFeedbackRef + FeedbackSummary           |
|        v                                                             |
| ActivityProgressionService reserves idempotency                      |
|        v                                                             |
| load Activity + RuntimeFeedbackRef resolution state                  |
|        v                                                             |
| ActivityFeedbackPolicy checks feedback source / current activity     |
|        v                                                             |
| Activity::record_feedback(RuntimeFeedbackRef feedback_ref,           |
|                           FeedbackSummary summary, ActorRef actor)   |
|        v                                                             |
| save activity feedback marker + progression record + trace + outbox   |
+=====================================================================+
```

关键设计点:feedback 可以由 runtime / member-service 异步送达,但正式绑定必须经过 Process policy;本仓不保存 runtime log、reasoning trace 或 execution body。

#### OpenWaitingGate 处理流

```text
+========================== OpenWaitingGate ==========================+
| command: ProcessInstanceRef + ActivityRef + WaitReason + dependency   |
|        v                                                             |
| WaitingGateCoordinationService reserves idempotency                  |
|        v                                                             |
| load ProcessInstance + current Activity / Gateway                    |
|        v                                                             |
| WaitingGatePolicy validates pause reason and dependency ref          |
|        v                                                             |
| WaitingGate::open(ActivityRef activity_ref, WaitReason reason,       |
|                   ExternalDependencyRef dependency_ref, ActorRef)    |
| PauseContext::from_waiting_gate(WaitingGateRef gate_ref)             |
|        v                                                             |
| save gate + pause context + change record + trace + outbox            |
+=====================================================================+
```

关键设计点:Process 拥有等待意图和暂停语境,不拥有 governance decision、artifact evidence 或 runtime result truth。

#### ResumeWaitingGate 处理流

```text
+========================= ResumeWaitingGate =========================+
| command: WaitingGateRef + ResumeEvidenceRef + resume intent           |
|        v                                                             |
| WaitingGateCoordinationService reserves idempotency                  |
|        v                                                             |
| load WaitingGate + PauseContext + external decision/evidence marker  |
|        v                                                             |
| WaitingGatePolicy validates resume evidence                          |
|        v                                                             |
| WaitingGate::resume(ResumeEvidenceRef evidence_ref, ActorRef actor)  |
| Token::move_from_waiting(ProcessPosition target_position)            |
|        v                                                             |
| save gate + token + change record + trace + outbox                    |
+=====================================================================+
```

关键设计点:resume 必须引用正式外部依据;外部 decision changed consumer 只能标记 resumable,不得自动替代该 command。

#### CreateProcessCheckpoint 处理流

```text
+====================== CreateProcessCheckpoint ======================+
| command: ProcessInstanceRef + CheckpointReason + position summary     |
|        v                                                             |
| ProcessRecoveryService reserves idempotency                          |
|        v                                                             |
| load ProcessInstance + Activity / Token position                     |
|        v                                                             |
| RecoveryContinuityPolicy checks checkpoint boundary                  |
|        v                                                             |
| ProcessCheckpoint::capture(ProcessInstanceRef instance_ref,          |
|                            ProcessPositionSummary summary, ActorRef) |
|        v                                                             |
| save checkpoint + recovery history + trace / audit                    |
+=====================================================================+
```

关键设计点:checkpoint 保存恢复语境摘要和引用,不保存 runtime micro checkpoint、agent reasoning 或 tool state。

#### StartRecoveryAttempt 处理流

```text
+======================= StartRecoveryAttempt ========================+
| command: ProcessCheckpointRef + RecoveryReason + operator context     |
|        v                                                             |
| ProcessRecoveryService reserves idempotency                          |
|        v                                                             |
| load checkpoint + current ProcessInstance recovery state             |
|        v                                                             |
| RecoveryContinuityPolicy validates same-instance continuation        |
|        v                                                             |
| RecoveryAttempt::start(ProcessCheckpointRef checkpoint_ref,          |
|                        RecoveryReason reason, ActorRef actor)        |
|        v                                                             |
| save recovery attempt + recovery history + trace + outbox             |
+=====================================================================+
```

关键设计点:recovery attempt 必须沿同一实例链路继续;失败或重试不能创建第二份 Process truth。

#### BindProcessTimebox 处理流

```text
+========================= BindProcessTimebox ========================+
| command: ProcessInstanceRef + ProcessTimeboxRef + rhythm reason       |
|        v                                                             |
| ProcessRhythmService reserves idempotency                            |
|        v                                                             |
| load ProcessInstance + WorkContextSnapshot / timebox marker          |
|        v                                                             |
| ProcessRhythmPolicy validates timing boundary                        |
|        v                                                             |
| ProcessTimeboxBinding::bind(ProcessTimeboxRef timebox_ref,           |
|                             ProcessInstanceRef instance_ref)         |
| ProcessStageState::align_to_timebox(ProcessTimeboxRef timebox_ref)   |
|        v                                                             |
| save timing state + trace + outbox                                   |
+=====================================================================+
```

关键设计点:timebox 绑定只表达过程节奏语境;Iteration、commitment 和 Backlog truth 仍归 `L1-work`。

---

## 5. Query 处理流

#### Process query 通用读路径

```text
+======================== Process query read path ====================+
| query: subject ref + filters/page + ActorContext + QueryMetadata      |
|        v                                                             |
| AuthorizedProcessQueryService validates visibility                   |
|        v                                                             |
| read Process truth / projection / trace / report                     |
|        v                                                             |
| if projection stale or missing: return freshness / degraded surface   |
|        v                                                             |
| no truth mutation, no snapshot refresh, no projection rebuild         |
+=====================================================================+
```

关键设计点:`GetRuntimeProcessShape`、`GetProcessProfile`、`GetProcessInstance`、`GetActivityStatus`、`GetWaitingGate` 和 `GetRecoveryStatus` 使用该只读骨架。

#### GetProcessTimeline 处理流

```text
+========================== GetProcessTimeline =======================+
| query: ProcessInstanceRef + page/filter + ActorContext                |
|        v                                                             |
| AuthorizedProcessQueryService validates timeline visibility          |
|        v                                                             |
| read ProcessTraceRecord + ActivityProgressionRecord + gate history   |
|        v                                                             |
| map to ProcessTimelineView with freshness / visibility markers       |
|        v                                                             |
| no repair, no handoff, no outbox                                      |
+=====================================================================+
```

关键设计点:timeline 是消费视图和追溯面,不是第二份 Process truth;不可用时返回 degraded / stale surface。

#### GetProcessProgressSummary 处理流

```text
+====================== GetProcessProgressSummary ====================+
| query: ProcessInstanceRef or WorkContextRef + ActorContext            |
|        v                                                             |
| load ProcessReadModel + DerivedProcessViewState                      |
|        v                                                             |
| if read model stale: include stale marker                            |
|        v                                                             |
| return ProcessProgressSummary                                        |
|        v                                                             |
| no workspace aggregation write                                       |
+=====================================================================+
```

关键设计点:summary 可以供 workspace / conversation 消费,但不拥有 workspace dashboard 或 conversation fact truth。

---

## 6. Inbound Event Consumer 处理流

#### ConsumeMethodDefinitionChanged 处理流

```text
+==================== ConsumeMethodDefinitionChanged =================+
| event envelope: event id + MethodDefinitionRef + source version       |
|        v                                                             |
| ProcessInboundConsumer reserves dedup                                |
|        v                                                             |
| MethodDefinitionSnapshot::from_source(MethodDefinitionRef ref,       |
|                                       ExternalVersionRef version)     |
|        v                                                             |
| save snapshot + ReferenceResolutionState                             |
|        v                                                             |
| mark affected RuntimeProcessShape / ProcessProfile views stale       |
+=====================================================================+
```

关键设计点:method changed 事件只刷新快照和 stale marker;shape 是否重新成立必须经 `SyncRuntimeProcessShape` 或后台 shape sync 判断。

#### ConsumeWorkContextChanged 处理流

```text
+======================= ConsumeWorkContextChanged ===================+
| event envelope: event id + WorkContextRef + ProcessTimeboxRef         |
|        v                                                             |
| reserve dedup                                                        |
|        v                                                             |
| WorkContextSnapshot::from_work_event(WorkContextRef ref,             |
|                                      ProcessTimeboxRef timebox_ref)  |
|        v                                                             |
| save snapshot + ReferenceResolutionState                             |
|        v                                                             |
| mark timing / summary / profile views stale                          |
+=====================================================================+
```

关键设计点:Work 事件只提供项目和 timebox 语境;Process 不写 Project、Iteration、Commitment 或 Backlog truth。

#### ConsumeGovernanceDecisionChanged 处理流

```text
+=================== ConsumeGovernanceDecisionChanged ================+
| event envelope: event id + GovernanceDecisionRef + outcome marker     |
|        v                                                             |
| reserve dedup                                                        |
|        v                                                             |
| update GovernanceDecisionRef resolution state                        |
|        v                                                             |
| if linked waiting gate exists: mark gate resumable / stale            |
|        v                                                             |
| no automatic WaitingGate::resume                                     |
+=====================================================================+
```

关键设计点:governance event 不替代 resume command;它只让等待语境获得可引用依据或 unresolved / rejected marker。

#### ConsumeRuntimeActivityFeedback 处理流

```text
+=================== ConsumeRuntimeActivityFeedback ==================+
| event envelope: event id + ActivityRef + RuntimeFeedbackRef           |
|        v                                                             |
| reserve dedup                                                        |
|        v                                                             |
| RuntimeFeedbackRef::from_event(ActivityRef activity_ref,             |
|                                ExternalFeedbackRef source_ref)       |
|        v                                                             |
| save pending feedback marker + ReferenceResolutionState              |
|        v                                                             |
| mark activity status stale; do not progress activity directly         |
+=====================================================================+
```

关键设计点:runtime feedback event 可以形成 pending marker;正式 activity progression 仍要通过 `RecordActivityFeedback` / policy 绑定。

---

## 7. Operations Job 处理流

#### PublishProcessOutbox 处理流

```text
+======================== PublishProcessOutbox =======================+
| job input: outbox range + run metadata + system actor                 |
|        v                                                             |
| load pending ProcessOutboxRecord                                     |
|        v                                                             |
| publish outbound event through bus boundary                          |
|        v                                                             |
| ProcessOutboxRecord::mark_published(OutboxPublicationRef ref)        |
| or ProcessOutboxRecord::mark_failed(OutboxFailureReason reason)      |
+=====================================================================+
```

关键设计点:outbox 发布是异步传播,失败只改变 publication state,不得回滚已成立 Process truth。

#### RebuildProcessProjections 处理流

```text
+===================== RebuildProcessProjections =====================+
| job input: projection set + process / work context scope              |
|        v                                                             |
| read committed Process truth + trace + snapshot summaries             |
|        v                                                             |
| ProcessReadModel::from_truth(ProcessTruthSnapshot snapshot)          |
| ProcessTimelineView / ProcessProgressSummary rebuild from same truth |
|        v                                                             |
| DerivedProcessViewState::mark_fresh(ProcessTruthCursor cursor)       |
+=====================================================================+
```

关键设计点:projection rebuild 只能从 committed Process truth / trace / snapshots 重建;不能从旧 projection 或外部正文反推业务事实。

#### RefreshExternalContextSnapshots 处理流

```text
+================== RefreshExternalContextSnapshots ==================+
| job input: reference scope + source filters + run metadata            |
|        v                                                             |
| load stale ReferenceResolutionState records                          |
|        v                                                             |
| resolve allowed external summaries through runtime seams             |
|        v                                                             |
| save MethodDefinitionSnapshot / WorkContextSnapshot / ActorSnapshot  |
|        v                                                             |
| mark affected derived views stale                                    |
+=====================================================================+
```

关键设计点:snapshot refresh 只更新摘要、引用状态和 stale marker;不复制 method、work、identity、artifact、runtime 或 conversation 正文。

#### RunProcessReconciliation 处理流

```text
+======================= RunProcessReconciliation ====================+
| job input: reconciliation scope + run metadata                        |
|        v                                                             |
| compare truth cursor, projection state, outbox state, reference state |
|        v                                                             |
| ReconciliationReport::from_check(ProcessReconciliationCheck check)   |
|        v                                                             |
| save report and mark affected derived/reference states               |
|        v                                                             |
| no automatic Process truth repair                                    |
+=====================================================================+
```

关键设计点:对账报告暴露漂移和维护需求,不能直接修正 ProcessInstance、Activity、WaitingGate 或 checkpoint truth。

#### PrepareProcessTraceHandoff 处理流

```text
+===================== PrepareProcessTraceHandoff ====================+
| job input: trace scope + observability/archive target                 |
|        v                                                             |
| load ProcessTraceRecord + ProcessAuditTrail                          |
|        v                                                             |
| ProcessTraceRecord::prepare_handoff(TraceHandoffTargetRef target)    |
|        v                                                             |
| save handoff marker + optional ProcessTraceAvailable outbox          |
|        v                                                             |
| no observability / archive body stored                               |
+=====================================================================+
```

关键设计点:handoff 只交接引用和 marker;观测正文、归档 package 和长期存储归下游。

#### MaintainRecoveryAttempts 处理流

```text
+====================== MaintainRecoveryAttempts =====================+
| job input: recovery scope + retry / expiry policy                     |
|        v                                                             |
| load pending / failed RecoveryAttempt records                         |
|        v                                                             |
| RecoveryContinuityPolicy checks retry / expiry boundary              |
|        v                                                             |
| mark retryable / failed / expired recovery marker                    |
|        v                                                             |
| save RecoveryHistoryRecord + maintenance report                      |
+=====================================================================+
```

关键设计点:maintenance job 只能推进 recovery marker 或 report,不得创建新 ProcessInstance 或覆盖 checkpoint chain。

---

## 8. 处理流与对象 / 接口对应关系

| 处理流 | 覆盖接口 | 关键对象 |
|---|---|---|
| `SyncRuntimeProcessShape` | `SyncRuntimeProcessShape`、method definition refresh 后续同步 | `RuntimeProcessShape`、`MethodDefinitionSnapshot`、`ShapeDefinitionPolicy` |
| `AdoptProcessProfile` | `AdoptProcessProfile`、`UpdateProcessProfileTailoring` | `ProcessProfile`、`ProfileChangeRecord`、`ProfileTailoringPolicy` |
| `StartProcessInstance` | `StartProcessInstance` | `ProcessInstance`、`Activity`、`Token`、`Gateway` |
| `AdvanceProcessActivity` | `AdvanceProcessActivity`、`RecordActivityFeedback` 的绑定后推进变体 | `Activity`、`Token`、`Gateway`、`ActivityProgressionRecord` |
| `OpenWaitingGate` / `ResumeWaitingGate` | `OpenWaitingGate`、`ResumeWaitingGate` | `WaitingGate`、`PauseContext`、`WaitingGateChangeRecord` |
| `CreateProcessCheckpoint` / `StartRecoveryAttempt` | checkpoint / recovery command | `ProcessCheckpoint`、`RecoveryAttempt`、`RecoveryHistoryRecord` |
| `BindProcessTimebox` | `BindProcessTimebox`、`UpdateProcessStageState` | `ProcessStageState`、`ProcessTimeboxBinding` |
| Process query read path | shape / profile / instance / activity / gate / recovery queries | `ProcessReadModel`、`ActivityStatusView`、`DerivedProcessViewState` |
| `GetProcessTimeline` / `GetProcessProgressSummary` | timeline / summary / trace queries | `ProcessTimelineView`、`ProcessProgressSummary`、`ProcessTraceRecord` |
| external context consumers | method / work / identity / governance / artifact / conversation / runtime events | `ReferenceResolutionState`、snapshot / ref objects |
| `PublishProcessOutbox` | outbox publication job | `ProcessOutboxRecord` |
| `RebuildProcessProjections` | projection rebuild job | `ProcessReadModel`、`ProcessTimelineView`、`ProcessProgressSummary` |
| `RunProcessReconciliation` | reconciliation job | `ReconciliationReport`、`DerivedProcessViewState`、`ReferenceResolutionState` |
| trace / archive handoff | handoff jobs | `ProcessTraceRecord`、`TraceHandoffRef` |
| `MaintainRecoveryAttempts` | recovery maintenance job | `RecoveryAttempt`、`RecoveryHistoryRecord` |

---

## 9. 未展开处理流的取舍说明

| 未独立展开项 | 处理方式 | 理由 |
|---|---|---|
| `UpdateProcessProfileTailoring` | 归入 `AdoptProcessProfile` 变体 | 同样经过 profile load、tailoring policy、change record、outbox |
| `CompleteRecoveryAttempt` | 归入 recovery command 变体 | 与 start recovery 共用 checkpoint / continuity 骨架,状态细节留 Step 9 |
| `UpdateProcessStageState` | 归入 `BindProcessTimebox` 变体 | 都属于 timing / rhythm 显式变更 |
| identity / artifact / conversation changed consumer | 归入 snapshot / reference refresh consumer 骨架 | 只更换 snapshot/ref 类型,不改变主流程 |
| 简单 truth query | 归入通用读路径 | 不含 projection fallback 或 stale 状态 |
| 具体错误分支 | 留到 Step 10 | 本步只写改变主流程骨架的失败状态 |
| Outbound Event publish payload dispatch | 留到详细设计 | 本步只定义 outbox publication 主流程和事件类别 |

---

## 10. 当前文档问题诊断

| 旧 `02-概要设计.md` 内容 | 问题 | 本轮处理 |
|---|---|---|
| Template -> Profile -> Instance 叙事缺少写路径边界 | 不知道哪些是 command,哪些是同步判断 | 本步拆成 shape sync、profile adopt、instance start |
| Activity / Token / Gateway 与 runtime 执行混写 | 容易把 runtime 微步写入 Process truth | 本步拆出 activity progression 和 runtime feedback pending / bind |
| waiting_gate -> governance 流程像同步调用链 | 容易由 Process 自造 decision 或自动 resume | 本步区分 open / consumer marker / resume command |
| checkpoint / recovery 只作为概念解释 | 不能承接 recovery command 与 maintenance job | 本步拆出 checkpoint、recovery attempt 和 maintenance job |
| timeline / trace / summary 没有 no-write 规则 | Query / projection 可能反写 truth | 本步明确 query no-write 和 projection rebuild only from committed truth |

---

## 11. 回填草稿

正式 `02-概要设计.md` 后续整理时:

- §8 “关键处理流 / 重要函数数据流”引用本文件 §3 的通用处理流。
- §8 摘录 §4~§7 的关键处理流图,可按篇幅压缩同构变体。
- §8 保留 §8 的接口 / 对象映射表,作为详细设计补函数签名、事务和测试矩阵的入口。

---

## 12. 进入下一步条件

- 已明确关键 command 如何经 application service、domain object、repository、trace 和 outbox 成立。
- 已明确 query stale / projection fallback 的只读边界。
- 已明确会改写本地状态的 inbound event consumer 不直接推进核心 Process truth。
- 已明确影响传播可靠性和查询一致性的 operations job 主流程。
- 未写完整伪代码、SQL、错误码全集或重试实现。
- 可以进入 Step 9 “状态机与状态流转”。
