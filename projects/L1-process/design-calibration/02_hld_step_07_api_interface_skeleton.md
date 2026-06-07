# Step 7. API / 接口骨架

> 对应 SOP: `standards/document/概要设计讨论流程_SOP.md` Step 7
> 回填章节: `02-概要设计.md` §7 API / 接口骨架
> 生成日期: 2026-06-05
> 状态: 已完成

---

## 1. 本步目标

把 `L1-process` 的正式入口按 Command、Query、Inbound Event Consumer、Outbound Event 和 Operations Job 分类,明确每类接口的输入骨架、输出骨架、读写性质和边界。

本步不写 HTTP path、RPC method、完整 JSON / proto schema、CloudEvent 字段全集、错误码、repository trait、事务细节或 handler 调用链。接口名称用于概要层锚定,详细字段、协议 envelope、错误映射和 port trait 留给 `03-详细设计.md`。

---

## 2. 本步输入

| 输入 | 状态 | 用途 |
|---|---|---|
| `02_hld_step_06_key_objects.md` + 五个对象附录 | 已完成 | 提供接口必须承接的对象主语 |
| `02_hld_step_05_components_boundary.md` | 已完成 | 提供主要组成部分和职责边界 |
| `01_arch_step_08_data_ownership_consistency.md` | 已完成 | 提供 truth / snapshot / reference / derived 分层 |
| `01_arch_step_09_interactions_communication.md` | 已完成 | 提供同步、异步和后台承接口径 |
| `00_req_step_09_functional_requirements.md` | 已完成 | 提供 FR-PROC-001~008 能力闭环 |
| `00_req_step_12_interfaces_dependencies.md` | 已完成 | 提供能力级接口面和依赖边界 |

---

## 3. SOP 问题回答

### 3.1 哪些接口属于 Command,负责改写真相?

Command 只覆盖会改写 Process-owned truth、history、trace、outbox 或维护 marker 的用例入口。它们必须经过 actor、metadata、幂等和 policy 判断,不能由 Query、Consumer 或 Job 隐式替代。

| Command 组 | 负责改写的 Process-owned 主语 |
|---|---|
| Runtime shape / profile command | `RuntimeProcessShape`、`ProcessProfile`、`ProfileChangeRecord` |
| Instance execution command | `ProcessInstance`、`Activity`、`Token`、`Gateway`、`ActivityProgressionRecord` |
| Waiting / recovery command | `WaitingGate`、`PauseContext`、`ProcessCheckpoint`、`RecoveryAttempt`、`WaitingGateChangeRecord`、`RecoveryHistoryRecord` |
| Timing / trace command | `ProcessStageState`、`ProcessTimeboxBinding`、`ProcessTraceRecord`、`ProcessAuditTrail` |

### 3.2 哪些接口属于 Query,只读取投影或只读视图?

Query 只读取 truth summary、projection、trace、snapshot 或 degraded surface。Query 不得打开写事务,不得创建 ProcessInstance、不得修复 projection,不得刷新外部引用。

### 3.3 哪些外部事实需要通过 Inbound Event Consumer 进入本仓?

进入本仓的外部事实包括 method definition 变更、work 语境变更、identity actor / capability 变更、governance decision 变更、artifact evidence 变更、runtime / member-service feedback、conversation context 变更。Consumer 只能更新本地 snapshot / reference / pending feedback / stale marker,不能绕过 Command 直接推进核心 Process truth。

### 3.4 哪些已提交事实需要通过 Outbound Event 对外传播?

需要传播的事实包括 runtime shape / profile 变化、instance lifecycle 变化、activity 进展、waiting gate 变化、checkpoint / recovery 变化、timing / rhythm 变化、trace 可用性、derived view freshness 变化。Outbound Event 只能来自已成立 truth 或维护状态,发布失败不得回滚 truth。

### 3.5 哪些恢复、发布、重建、对账动作属于 Operations Job,而不是业务 command?

outbox 发布、projection rebuild、external snapshot refresh、reconciliation、trace / archive handoff、recovery maintenance 属于 Operations Job。Job 可以维护派生面、快照、报告、handoff marker 或 failed marker,不得静默改写业务 truth。

### 3.6 Command 输入骨架是否需要 `ActorContext`、`CommandMetadata`、`IdempotencyKey`?

需要。所有 Command 输入都必须携带 `ActorContext`、`CommandMetadata` 和 `CommandMetadata.request.idempotency_key`。缺失时不得进入 Process truth 写路径。

### 3.7 Query 输入骨架是否需要 `ActorContext`?

需要。所有 Query 输入都必须携带 `ActorContext` 和 `QueryMetadata`,用于授权、可见性、分页、consistency hint 和审计关联。

### 3.8 Event Consumer 输入骨架是否需要 event id、幂等键或 envelope?

需要。所有 Inbound Event Consumer 输入都必须携带来源 envelope、source event id、source ref、schema version、trace context 和 dedup key 语义。重复、乱序或 unsupported version 必须有正式处置面,不能直接写核心 truth。

---

## 4. 接口分类说明

| 接口类别 | 读写性质 | 主要用途 | 必须携带的上下文 | 不得做什么 |
|---|---|---|---|---|
| Command | 改写 Process truth / history / trace / outbox | shape、profile、instance、activity、gate、recovery、timing 的正式变化 | `ActorContext`、`CommandMetadata`、idempotency key、trace context | 不保存相邻仓正文;不绕过 policy |
| Query | 只读 | 读取 Process truth summary、timeline、summary、activity status、trace、reconciliation surface | `ActorContext`、`QueryMetadata`、page / consistency hint | 不写 truth、projection、snapshot、outbox |
| Inbound Event Consumer | 写 snapshot / reference / pending feedback / stale marker | 承接 method / work / identity / governance / artifact / runtime / conversation 外部事实 | event envelope、source event id、source ref、dedup key、trace context | 不直接推进实例主线;不自造外部 truth |
| Outbound Event | 输出已成立事实或维护状态 | 向 work、conversation、workspace、observability、archive、SDK 消费面传播 Process 事实 | outbox event id、truth ref、trace context | 不携带 method / work / runtime / conversation 正文 |
| Operations Job | 后台维护 / 派生 / 对账 / 交接 | publish、rebuild、refresh、reconcile、handoff、recovery maintenance | job metadata、system / operator actor、job idempotency key | 不作为业务 command;不静默修正 Process truth |

---

## 5. Command API 骨架表

所有 Command 输入中的 `context` 均表示 `ActorContext` + `CommandMetadata` + idempotency key + trace context。本表只写输入骨架,不定义 DTO 字段表。

| Command | 输入骨架 | 输出骨架 | 写入对象 | 主要组成部分 | 边界 |
|---|---|---|---|---|---|
| `SyncRuntimeProcessShape` | method definition ref + source version + shape sync intent + context | `RuntimeProcessShapeCommandResult` | `RuntimeProcessShape`、`MethodDefinitionSnapshot`、`ProcessOutboxRecord` | Runtime shape management | 从 method-library 来源形成可执行 shape,不保存定义正文 |
| `AdoptProcessProfile` | project / work context ref + runtime shape ref + tailoring intent + context | `ProcessProfileCommandResult` | `ProcessProfile`、`ProfileChangeRecord`、`ProcessAuditTrail`、`ProcessOutboxRecord` | Profile adoption management | 表达项目采用语境,不拥有 Project truth |
| `UpdateProcessProfileTailoring` | profile ref + tailoring change + reason + context | `ProcessProfileCommandResult` | `ProcessProfile`、`ProfileChangeRecord`、`ProcessAuditTrail`、`ProcessOutboxRecord` | Profile adoption management | 已运行实例受影响时只标记需显式处理,不静默重写实例 |
| `StartProcessInstance` | profile ref + work context ref + start intent + context | `ProcessInstanceCommandResult` | `ProcessInstance`、`Activity`、`Token`、`Gateway`、`ProcessTraceRecord`、`ProcessOutboxRecord` | Process execution management | 显式建立实例,不得由 Query 或外部事件隐式创建 |
| `AdvanceProcessActivity` | process instance ref + activity ref + structured progression intent + expected position + context | `ActivityProgressionCommandResult` | `Activity`、`Token`、`Gateway`、`ActivityProgressionRecord`、`ProcessTraceRecord`、`ProcessOutboxRecord` | Process execution management | 只推进 Process 节点位置,不创建 WorkItem 或 runtime step |
| `RecordActivityFeedback` | activity ref + runtime / member feedback ref + feedback summary + context | `ActivityProgressionCommandResult` | `Activity`、`ActivityProgressionRecord`、`RuntimeFeedbackRef`、`ProcessTraceRecord` | Process execution management | 只绑定反馈摘要和引用,不保存 execution log / tool call 正文 |
| `OpenWaitingGate` | process instance ref + activity / gateway ref + wait reason + external dependency ref + context | `WaitingGateCommandResult` | `WaitingGate`、`PauseContext`、`WaitingGateChangeRecord`、`ProcessTraceRecord`、`ProcessOutboxRecord` | Gate coordination | 表达等待意图,不生成 governance decision |
| `ResumeWaitingGate` | waiting gate ref + resume evidence / decision ref + context | `WaitingGateCommandResult` | `WaitingGate`、`PauseContext`、`WaitingGateChangeRecord`、`Token`、`ProcessTraceRecord` | Gate coordination | 必须引用正式外部依据;不得后台静默恢复 |
| `CreateProcessCheckpoint` | process instance ref + checkpoint reason + cursor / position summary + context | `ProcessCheckpointCommandResult` | `ProcessCheckpoint`、`ProcessTraceRecord`、`ProcessAuditTrail` | Checkpoint and recovery | 保存恢复语境摘要,不保存 runtime micro checkpoint |
| `StartRecoveryAttempt` | checkpoint ref + recovery reason + actor / operator context | `RecoveryAttemptCommandResult` | `RecoveryAttempt`、`RecoveryHistoryRecord`、`ProcessTraceRecord` | Checkpoint and recovery | 恢复必须沿同一实例链路,不得创建第二份 truth |
| `CompleteRecoveryAttempt` | recovery attempt ref + outcome + context | `RecoveryAttemptCommandResult` | `RecoveryAttempt`、`RecoveryHistoryRecord`、`ProcessTraceRecord`、`ProcessOutboxRecord` | Checkpoint and recovery | 成功恢复后只推进正式 recovery state,不覆盖历史 |
| `BindProcessTimebox` | process instance / profile ref + process timebox ref + rhythm reason + context | `ProcessTimingCommandResult` | `ProcessStageState`、`ProcessTimeboxBinding`、`ProcessTraceRecord`、`ProcessOutboxRecord` | Process timing and rhythm | 只表达节奏绑定,不拥有 Work Iteration truth |
| `UpdateProcessStageState` | process instance ref + stage target + rhythm reason + context | `ProcessTimingCommandResult` | `ProcessStageState`、`ProcessTraceRecord`、`ProcessOutboxRecord` | Process timing and rhythm | 不把 planning / review 写成 Work backlog 变更 |

---

## 6. Query API 骨架表

所有 Query 输入中的 `context` 均表示 `ActorContext` + `QueryMetadata`。Query 可以返回 stale / degraded / missing / not visible surface,但不得修复状态。

| Query | 输入骨架 | 输出骨架 | 读取来源 | 主要组成部分 | 边界 |
|---|---|---|---|---|---|
| `GetRuntimeProcessShape` | runtime shape ref + context | `RuntimeProcessShapeView` | shape truth + method snapshot summary | Runtime shape management | 不读取 method definition 正文 |
| `GetProcessProfile` | process profile ref + context | `ProcessProfileView` | profile truth + tailoring summary | Profile adoption management | 不读取 Project truth 正文 |
| `GetProcessInstance` | process instance ref + context | `ProcessInstanceView` | instance truth + activity summary | Process execution management | 不推进 activity |
| `GetActivityStatus` | activity ref + context | `ActivityStatusView` | activity truth / projection + feedback refs | Process execution management | 不拉取 runtime log 正文 |
| `GetWaitingGate` | waiting gate ref + context | `WaitingGateView` | waiting gate truth + pause context | Gate coordination | 不查询 governance decision 正文 |
| `GetRecoveryStatus` | process instance / recovery attempt ref + context | `RecoveryStatusView` | checkpoint / recovery truth + history | Checkpoint and recovery | 不执行恢复 |
| `GetProcessTimeline` | process instance ref + page / filter + context | `ProcessTimelineView` | trace / history / projection | Process consumption and traceability | 只读 timeline,可返回 stale 标记 |
| `GetProcessProgressSummary` | process instance or work context ref + context | `ProcessProgressSummary` | process read model / projection | Process consumption and traceability | 不汇总成 workspace truth |
| `SearchProcessInstances` | work context / profile / state filters + page + context | `ProcessSearchResultPage` | projection / read model | Process consumption and traceability | projection stale 时返回 freshness surface |
| `GetProcessTrace` | trace subject ref + page + context | `ProcessTraceView` | `ProcessTraceRecord` / `ProcessAuditTrail` | Process consumption and traceability | 不替代 observability ledger |
| `GetReconciliationReport` | reconciliation scope / report ref + context | `ReconciliationReportView` | reconciliation report / derived state | Derived maintenance and reconciliation | 只读报告,不修复 truth |

---

## 7. Inbound Event Consumer 骨架表

所有 Consumer 输入都必须携带来源 envelope、source event id、source ref、schema version、dedup key 语义和 trace context。Consumer 写入通常是 snapshot、reference state、pending feedback 或 projection stale marker。

| Consumer | 来源 | 输入骨架 | 写入结果 | 主要组成部分 | 边界 |
|---|---|---|---|---|---|
| `ConsumeMethodDefinitionChanged` | `L3-method-library` | definition changed envelope + definition ref + source version | `MethodDefinitionSnapshot`、`ReferenceResolutionState`、shape stale marker | Runtime shape management / External context mirror support | 不保存 method definition 正文 |
| `ConsumeWorkContextChanged` | `L1-work` | project / work / iteration / timebox changed envelope + work context ref | `WorkContextSnapshot`、`ReferenceResolutionState`、process view stale marker | Process timing and rhythm / External context mirror support | 不写 Project、WorkItem、Iteration truth |
| `ConsumeIdentityActorCapabilityChanged` | `L1-identity` | actor / capability changed envelope + actor / member ref | `ActorCapabilitySnapshot`、`ReferenceResolutionState` | External context mirror support | 不拥有 GlobalMember lifecycle |
| `ConsumeGovernanceDecisionChanged` | `L1-governance` | decision changed envelope + governance decision ref | `GovernanceDecisionRef` resolution marker、waiting gate stale / resumable marker | Gate coordination | 不复制 decision 正文;不自动 resume |
| `ConsumeArtifactEvidenceChanged` | `L1-artifact` | evidence / baseline changed envelope + evidence ref | reference state / evidence summary marker | External context mirror support | 不保存 artifact / evidence 正文 |
| `ConsumeRuntimeActivityFeedback` | `L2-runtime` / `L2-member-service` | feedback envelope + runtime feedback ref + activity ref | `RuntimeFeedbackRef`、pending feedback marker、activity stale marker | Process execution management | 不保存 execution body;正式推进仍按 command / policy |
| `ConsumeConversationContextChanged` | `L1-conversation` | conversation context envelope + context ref | `ConversationContextRef` resolution marker、timeline stale marker | Process consumption and traceability | 不保存 conversation fact 或 message body |

---

## 8. Outbound Event 骨架表

Outbound Event 只能从已提交 Process truth change、维护状态变化或 handoff intent 形成。事件 payload 后续由详细设计定义,本步只给输出骨架和边界。

| Event | 触发来源 | 输出骨架 | 主要消费方 | 边界 |
|---|---|---|---|---|
| `RuntimeProcessShapeChanged` | `RuntimeProcessShape` 成立 / 更新 | shape ref + change kind + source version + trace context | SDK、workspace、process consumers | 不携带 method definition 正文 |
| `ProcessProfileChanged` | `ProcessProfile` adopt / tailoring change | profile ref + profile state + work context ref + trace context | work、workspace、conversation | 不改 Project truth |
| `ProcessInstanceChanged` | instance start / pause / resume / close / cancel | instance ref + lifecycle / position summary + trace context | work、conversation、workspace、archive | 不携带 activity execution body |
| `ActivityProgressed` | Activity / Token / Gateway progression | activity ref + process instance ref + progression state + trace context | runtime、work、conversation、workspace | 不创建 WorkItem 或 runtime step |
| `WaitingGateChanged` | waiting gate open / resume / cancel | waiting gate ref + wait / resume state + dependency ref + trace context | governance、conversation、workspace | 不包含 decision 正文 |
| `ProcessCheckpointCreated` | checkpoint created | checkpoint ref + instance ref + checkpoint kind + trace context | archive、observability、recovery tooling | 不包含 runtime micro checkpoint |
| `RecoveryAttemptChanged` | recovery started / completed / failed | recovery attempt ref + outcome + checkpoint ref + trace context | observability、archive、workspace | 不覆盖历史 chain |
| `ProcessTimingChanged` | stage / timebox binding change | process instance ref + timebox ref + rhythm state + trace context | work、workspace、conversation | 不拥有 Work Iteration truth |
| `ProcessTraceAvailable` | trace / audit handoff ready | trace subject ref + trace ref + handoff ref + trace context | observability、archive、conversation | 不替代 observability ledger |
| `DerivedProcessViewChanged` | derived freshness / rebuild state change | view ref + freshness state + source cursor | workspace、SDK、conversation | 派生变化不代表新业务 truth |

---

## 9. Operations Job 骨架表

Operations Job 必须携带 job metadata、system / operator actor、job idempotency key 和 run id。Job 只能维护派生、快照、outbox、对账、handoff 或 recovery marker。

| Job | 输入骨架 | 输出骨架 | 允许写入 | 主要组成部分 | 边界 |
|---|---|---|---|---|---|
| `PublishProcessOutbox` | outbox range / page + run metadata | publication report | `ProcessOutboxRecord.publication_state` | Process truth core | 发布失败不回滚 Process truth |
| `RebuildProcessProjections` | projection set + process / work context scope + run metadata | rebuild report | `ProcessReadModel`、`ProcessTimelineView`、`ProcessProgressSummary`、`DerivedProcessViewState` | Derived maintenance and reconciliation | 只从 committed truth / trace 重建 |
| `RefreshExternalContextSnapshots` | reference scope + source filters + run metadata | refresh report | `MethodDefinitionSnapshot`、`WorkContextSnapshot`、`ActorCapabilitySnapshot`、`ReferenceResolutionState` | External context mirror support | 不复制外部正文 |
| `RunProcessReconciliation` | reconciliation scope + cursor / report target + run metadata | `ReconciliationReport` | reconciliation report / derived marker | Derived maintenance and reconciliation | 只报告或标记,不直接修正业务 truth |
| `PrepareProcessTraceHandoff` | trace scope + observability target + run metadata | handoff report | trace handoff marker / optional outbox | Process consumption and traceability | 不保存 observability 正文 |
| `PrepareProcessArchiveHandoff` | instance / checkpoint / recovery scope + archive target + run metadata | archive handoff report | archive handoff marker / optional outbox | Process consumption and traceability | 不保存 archive package 正文 |
| `MaintainRecoveryAttempts` | recovery scope + retry / expiry policy + run metadata | recovery maintenance report | `RecoveryAttempt` maintenance marker、`RecoveryHistoryRecord` | Checkpoint and recovery | 不创建新 ProcessInstance;不覆盖 checkpoint |

---

## 10. 接口到主要组成部分映射

| 主要组成部分 | Command | Query | Consumer | Outbound Event | Job |
|---|---|---|---|---|---|
| Process truth core | 所有 truth command 间接经过 | - | - | 所有 truth event 经 outbox | `PublishProcessOutbox` |
| Runtime shape management | `SyncRuntimeProcessShape` | `GetRuntimeProcessShape` | `ConsumeMethodDefinitionChanged` | `RuntimeProcessShapeChanged` | `RefreshExternalContextSnapshots` |
| Profile adoption management | `AdoptProcessProfile`、`UpdateProcessProfileTailoring` | `GetProcessProfile` | work / method context consumer | `ProcessProfileChanged` | reconciliation / refresh jobs |
| Process execution management | `StartProcessInstance`、`AdvanceProcessActivity`、`RecordActivityFeedback` | `GetProcessInstance`、`GetActivityStatus` | `ConsumeRuntimeActivityFeedback` | `ProcessInstanceChanged`、`ActivityProgressed` | projection rebuild |
| Gate coordination | `OpenWaitingGate`、`ResumeWaitingGate` | `GetWaitingGate` | `ConsumeGovernanceDecisionChanged` | `WaitingGateChanged` | reconciliation / refresh jobs |
| Checkpoint and recovery | `CreateProcessCheckpoint`、`StartRecoveryAttempt`、`CompleteRecoveryAttempt` | `GetRecoveryStatus` | runtime / work context consumer | `ProcessCheckpointCreated`、`RecoveryAttemptChanged` | `MaintainRecoveryAttempts`、archive handoff |
| Process timing and rhythm | `BindProcessTimebox`、`UpdateProcessStageState` | progress / timeline queries | `ConsumeWorkContextChanged` | `ProcessTimingChanged` | projection rebuild |
| Process consumption and traceability | trace handoff related command only if detailed design keeps sync entry | `GetProcessTimeline`、`GetProcessProgressSummary`、`GetProcessTrace` | `ConsumeConversationContextChanged` | `ProcessTraceAvailable` | trace / archive handoff |
| Derived maintenance and reconciliation | - | `GetReconciliationReport` | stale marker consumers | `DerivedProcessViewChanged` | `RebuildProcessProjections`、`RunProcessReconciliation` |
| External context mirror support | - | snapshot-backed queries | all external context consumers | derived / stale event only | `RefreshExternalContextSnapshots` |

---

## 11. 当前文档问题诊断

| 旧 `02-概要设计.md` 内容 | 问题 | 本轮处理 |
|---|---|---|
| 把 Template / Profile / Instance 解释为新人概念,但没有接口分类 | 无法支撑详细设计拆 command / query / event / job | 本步按正式接口类别重建骨架 |
| 旧交互图把 method-library、work、governance、artifact、runtime 混在主流程中 | 容易误解为同步调用链或编译期依赖 | 本步区分 Command、Consumer、Outbound Event 和 Job |
| checkpoint / recovery 只有概念解释 | 后续无法判断哪些是业务 command、哪些是 maintenance job | 本步拆出 checkpoint / recovery command 与 `MaintainRecoveryAttempts` job |
| timeline / trace / summary 容易混入 truth 写路径 | 派生 / 追溯与主 truth 边界不清 | 本步把它们列为 Query / Outbound / Job,并标注 no-write |
| 外部正文对象在交互叙事中出现 | 有保存 method / runtime / conversation / artifact 正文的风险 | 所有接口骨架都写明 ref / summary / snapshot 边界 |

---

## 12. 设计取舍

| 取舍 | 结论 | 理由 |
|---|---|---|
| 是否在概要层点名 Command / Query / Event / Job | 点名 | SOP Step 7 允许点名接口骨架,有助于 Step 8 / Step 9 反查 |
| 是否写 HTTP path / topic / DTO schema | 不写 | 这些属于详细设计协议契约 |
| 是否让 Inbound Event 直接推进实例 | 不允许 | 外部事实只能经 snapshot / pending marker / stale marker,核心推进仍需 policy |
| 是否让 Job 修复业务 truth | 不允许 | Job 只能维护派生、快照、对账、handoff 和 recovery maintenance marker |
| 是否保留高级 Query | 保留骨架但标注只读 / 可 stale | 支撑消费面,不阻塞核心 truth |

---

## 13. 回填草稿

正式 `02-概要设计.md` 后续整理时:

- §7 “API / 接口骨架”引用本文件 §4 的接口分类说明。
- §7 摘录 §5~§9 五张骨架表,必要时压缩外围增强 Query 和 Job。
- §7 保留 §10 的接口到主要组成部分映射。
- 详细设计必须基于这些骨架继续定义正式 command / query / event / job DTO、错误码、幂等结果、repository / port 和事务边界。

---

## 14. 进入下一步条件

- 已明确本仓接口按 Command / Query / Inbound Event Consumer / Outbound Event / Operations Job 分类。
- 已显式说明 Command 需要 `ActorContext`、`CommandMetadata` 和 idempotency key。
- 已显式说明 Query 需要 `ActorContext` 和 `QueryMetadata`。
- 已显式说明 Event Consumer 需要 envelope、source event id、source ref、dedup key 和 trace context。
- 已明确 Job 不得作为业务 command 或 truth repair 入口。
- 未写入 HTTP path、完整 DTO schema、topic 名称、repository 函数或事务细节。
- 可以进入 Step 8 “关键处理流 / 重要函数数据流”。
