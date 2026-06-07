# L1-process 03 DDD Step 10 状态机与转换矩阵

> SOP: `standards/document/详细设计讨论流程_SOP.md` Step 10
> 书写规范: `standards/document/详细设计书写规范.md` §5.9
> 上游输入: `projects/L1-process/02-概要设计.md` §9
> 直接输入:
> - `projects/L1-process/design-calibration/03_ddd_step_06_object_contracts.md`
> - `projects/L1-process/design-calibration/03_ddd_step_08_protocol_contracts.md`
> - `projects/L1-process/design-calibration/03_ddd_step_09_function_flows.md`
> 创建日期: 2026-06-05
> 状态: Completed

---

## 1. Step 状态

本 Step 已完成。

---

## 2. 本步输入

| 输入 | 用途 | 结论 |
|---|---|---|
| `02-概要设计.md` §9 | 状态集合和核心迁移摘要 | 承接 15 个正式状态主题 |
| Step 6 对象契约 | enum 变体、对象函数、domain error | 状态名不得增删;矩阵触发函数必须回指 Step 6 |
| Step 8 协议契约 | public state enum、query / consumer / job result 状态 | 区分 domain 状态机与 protocol disposition |
| Step 9 函数流 | command / consumer / job 触发点 | 补齐事务流中会调用的状态转换 |

---

## 3. SOP 问题回答

1. 当前仓有哪些正式状态机?

   回答:正式 domain 状态机为 `RuntimeProcessShapeState`、`ProcessProfileState`、`ProcessInstanceState`、`ActivityState`、`TokenState`、`GatewayState`、`WaitingGateState`、`CheckpointState`、`RecoveryAttemptState`、`StageState`、`TimeboxBindingState`、`ProjectionFreshnessState`、`ReferenceResolutionLifecycleState`、`TraceHandoffState`、`OutboxPublicationState` 和 `ReconciliationResultState`。`ProcessProgressState` 是 projection summary 派生状态,不允许由 command 直接迁移。

2. 每个状态机的状态集合是什么?

   回答:状态集合完全采用 Step 6 enum 变体。本 Step 只展开转换矩阵,不新增 enum 变体。

3. 哪些函数会触发状态转换?

   回答:对象成员函数、factory、Step 9 command flow、consumer marker flow 和 operations job flow 会触发转换。Query 只读取状态并映射 `ProcessViewStatus`,不得触发 domain 状态转换。

4. 每个转换的前置条件、副作用和错误是什么?

   回答:每个状态机在本 Step 以集合表、ASCII 图和矩阵列出。非法转换统一返回 `DomainError::InvalidStateTransition`,除非矩阵明确使用 `ReferenceResolutionFailed`、`RecoveryForkViolation`、`BoundaryViolation` 或 `ExternalBodyRejected`。

5. 非法转换应该返回什么错误,是否写审计?

   回答:domain object 内非法迁移返回 `DomainError::InvalidStateTransition` 且不写 truth、trace、audit、outbox。application service 在 transaction 内捕获该错误后 rollback。审计只记录已成立的 truth change 或显式 rejected command receipt,不得把失败迁移写成成功 trace。

---

## 4. 当前文档问题诊断

| 来源 | 问题 | 本 Step 收口 |
|---|---|---|
| Step 6 `ProcessInstance` 方法表 | `CompleteRecoveryAttemptFlow` 需要 `Recovering -> Running`,但对象方法未命名 | 已回填 `ProcessInstance.complete_recovery(&RecoveryAttempt, ActorRef)` |
| Step 9 governance consumer | 写了“Mark matching gates as decision-resolved marker only if Step 10 state matrix allows” | 本 Step 明确 consumer 可调用 `WaitingGate.attach_decision(...)` 使 `Waiting -> DecisionResolved`,但不得调用 `WaitingGate.resume(...)` |
| Step 8 protocol dispositions | `ProcessViewStatus`、`ConsumerDisposition`、`JobDisposition` 容易被误当 domain 状态 | 本 Step 单独列 protocol 状态映射,禁止反推核心 truth |
| Step 6 `ProcessProgressState` | 允许来源 / 去向为 projection builder | 本 Step 定义为派生 summary state,不是 command 状态机 |

---

## 5. 状态机总表

| 状态机 | 承载对象 | 状态集合 | 触发来源 | 是否核心 truth |
|---|---|---|---|---|
| `RuntimeProcessShapeState` | `RuntimeProcessShape` | `DraftIndexed` / `Active` / `Stale` / `Invalid` / `Retired` | shape command、method definition consumer | 是 |
| `ProcessProfileState` | `ProcessProfile` | `Proposed` / `Active` / `Suspended` / `Retired` | profile command | 是 |
| `ProcessInstanceState` | `ProcessInstance` | `NotStarted` / `Running` / `Waiting` / `Recovering` / `Completed` / `Cancelled` / `Failed` | instance / gate / recovery command | 是 |
| `ActivityState` | `Activity` | `Planned` / `Ready` / `InProgress` / `WaitingFeedback` / `Completed` / `Skipped` / `Failed` | progression command、feedback command | 是 |
| `TokenState` | `Token` | `Active` / `Waiting` / `Consumed` / `Terminated` | progression / gate command | 是 |
| `GatewayState` | `Gateway` | `PendingDecision` / `RouteSelected` / `Joined` / `Invalid` | progression command | 是 |
| `WaitingGateState` | `WaitingGate` | `Waiting` / `DecisionResolved` / `Resumed` / `Cancelled` / `Expired` | gate command、governance consumer、maintenance job | 是 |
| `CheckpointState` | `ProcessCheckpoint` | `Available` / `Superseded` / `Invalid` / `Expired` | checkpoint command、maintenance job | 是 |
| `RecoveryAttemptState` | `RecoveryAttempt` | `Pending` / `Applied` / `Failed` / `Abandoned` | recovery command、maintenance job | 是 |
| `StageState` | `ProcessStageState` | `Pending` / `Active` / `Paused` / `Completed` / `Skipped` | rhythm command | 是 |
| `TimeboxBindingState` | `ProcessTimeboxBinding` | `Active` / `Stale` / `Released` / `Invalid` | rhythm command、work context consumer | 是,但只拥有 binding |
| `ProjectionFreshnessState` | `DerivedProcessViewState` | `Fresh` / `Stale` / `Rebuilding` / `Failed` / `Disabled` | truth change marker、projection job | 否,派生维护 |
| `ReferenceResolutionLifecycleState` | `ReferenceResolutionState` | `Resolved` / `Unresolved` / `Stale` / `Invalid` / `Unavailable` | inbound consumer、refresh job、resolver | 否,external ref marker |
| `TraceHandoffState` | `TraceHandoffRecord` | `Prepared` / `Delivered` / `Failed` / `Cancelled` | trace / archive handoff job | 否,交接 marker |
| `OutboxPublicationState` | `ProcessOutboxRecord` | `Pending` / `Published` / `Failed` / `RetryPending` | outbox factory、publish job | 否,发布状态 |
| `ReconciliationResultState` | `ReconciliationReport` | `Clean` / `HasIssues` / `Failed` / `Partial` | reconciliation job | 否,report 状态 |

---

## 6. 核心 truth 状态机

### 6.1 `RuntimeProcessShapeState`

#### 状态集合

| 状态 | 作用 | 是否终态 | 允许的关键操作 |
|---|---|---|---|
| `DraftIndexed` | 已从 method definition snapshot 建立本地 shape,但尚不可采用 | 否 | `activate`、`mark_invalid`、`retire` |
| `Active` | 可被 `ProcessProfile` 采用 | 否 | `mark_stale`、`mark_invalid`、`retire` |
| `Stale` | 来源 definition 过期,需要重新校验 | 否 | `activate`、`mark_invalid`、`retire` |
| `Invalid` | 来源不能形成合法 runtime shape | 否 | `retire` |
| `Retired` | 已退役,普通路径不可恢复 | 是 | 无 |

#### 状态转换图

```text
factory
  |
  v
DraftIndexed --activate--> Active --mark_stale--> Stale --activate--> Active
     |             |             |
     |             |             +--mark_invalid--> Invalid
     |             +--mark_invalid--> Invalid
     +--mark_invalid--> Invalid

DraftIndexed / Active / Stale / Invalid --retire--> Retired
```

#### 状态转换矩阵

| From | To | 触发函数 | 前置条件 | 副作用 | 非法时错误 |
|---|---|---|---|---|---|
| factory | `DraftIndexed` | `RuntimeProcessShape::from_definition(shape_id, snapshot, actor)` | `snapshot.snapshot_state.resolution_state = Resolved`;不保存 definition body | 创建 shape;可写 `ProcessTruthChange::RuntimeShapeChanged` | `DomainError::ReferenceResolutionFailed` / `DomainError::ExternalBodyRejected` |
| `DraftIndexed` / `Stale` | `Active` | `RuntimeProcessShape.activate(&MethodDefinitionSnapshot, ActorRef)` | snapshot definition/version 与 shape 匹配;source digest 可校验 | 更新 `source_snapshot_ref`;写 trace / outbox | `DomainError::InvalidStateTransition` |
| `Active` | `Stale` | `RuntimeProcessShape.mark_stale(ReferenceStaleReason)` | method definition consumer 发现 source version 更新或 stale marker | affected profile / projection 可标记 stale | `DomainError::InvalidStateTransition` |
| `DraftIndexed` / `Active` / `Stale` | `Invalid` | `RuntimeProcessShape.mark_invalid(ShapeInvalidReason)` | definition snapshot invalid 或 policy 拒绝 | 写 invalid trace;后续 profile adoption 拒绝 | `DomainError::InvalidStateTransition` |
| `DraftIndexed` / `Active` / `Stale` / `Invalid` | `Retired` | `RuntimeProcessShape.retire(ShapeRetireReason, ActorRef)` | actor 有退役权限;不得保留 active adoption intent | 写 retire trace / outbox | `DomainError::InvalidStateTransition` |

---

### 6.2 `ProcessProfileState`

#### 状态集合

| 状态 | 作用 | 是否终态 | 允许的关键操作 |
|---|---|---|---|
| `Proposed` | 待采用 profile | 否 | `activate`、`retire` |
| `Active` | 可启动 instance 并作为 process context | 否 | `switch_to`、`suspend`、`retire` |
| `Suspended` | 暂停使用,不可启动新 instance | 否 | `activate`、`retire` |
| `Retired` | 已退役 | 是 | 无 |

#### 状态转换图

```text
factory
  |
  v
Proposed --activate--> Active --suspend--> Suspended --activate--> Active
    |                  |  |
    |                  |  +--switch_to--> Active
    |                  +--retire--> Retired
    +--retire----------------------> Retired

Suspended --retire--> Retired
```

#### 状态转换矩阵

| From | To | 触发函数 | 前置条件 | 副作用 | 非法时错误 |
|---|---|---|---|---|---|
| factory | `Proposed` | `ProcessProfile::propose(profile_id, project_ref, shape_ref, actor)` | shape ref 可解析;project ref 只保存引用 | 创建 profile | `DomainError::ReferenceResolutionFailed` |
| `Proposed` / `Suspended` | `Active` | `ProcessProfile.activate(&RuntimeProcessShape, ActorRef)` | shape state 必须为 `Active`;actor 有 adoption 权限 | 创建 `ProfileChangeRecord`;写 audit / outbox | `DomainError::InvalidStateTransition` |
| `Active` | `Active` | `ProcessProfile.switch_to(&RuntimeProcessShape, ProfileChangeReason, ActorRef)` | next shape state 为 `Active`;reason 必填 | 更新 `shape_ref`;创建 change record | `DomainError::InvalidStateTransition` |
| `Active` | `Suspended` | `ProcessProfile.suspend(ProfileChangeReason, ActorRef)` | reason 必填;不得影响已运行 instance truth | 创建 change record;query/projection stale | `DomainError::InvalidStateTransition` |
| `Proposed` / `Active` / `Suspended` | `Retired` | `ProcessProfile.retire(ProfileChangeReason, ActorRef)` | reason 必填;不得作为新 instance profile | 创建 retire change record;写 outbox | `DomainError::InvalidStateTransition` |

---

### 6.3 `ProcessInstanceState`

#### 状态集合

| 状态 | 作用 | 是否终态 | 允许的关键操作 |
|---|---|---|---|
| `NotStarted` | instance 已创建但未运行 | 否 | `start`、`cancel` |
| `Running` | 可推进活动 | 否 | `advance`、`complete`、`cancel`;`pause_for_gate` / `mark_recovering` 为 PH-04 reserved |
| `Waiting` | 等待 external resume condition | 否 | PH-04 reserved:`resume_from_gate`、`mark_recovering`、`cancel` |
| `Recovering` | 正在同一 instance 上恢复 | 否 | PH-04 reserved:`complete_recovery`、`cancel`;失败 outcome 可转 `Failed` |
| `Completed` | 成功完成 | 是 | 无 |
| `Cancelled` | 显式取消 | 是 | 无 |
| `Failed` | 失败终态 | 是 | 无 |

#### 状态转换图

```text
factory
  |
  v
NotStarted --start--> Running --pause_for_gate--> Waiting --resume_from_gate--> Running
    |                    |  |                         |
    |                    |  +--mark_recovering--------+--> Recovering --complete_recovery--> Running
    |                    |                                         |
    |                    +--complete--> Completed                  +--failed outcome--> Failed
    |                    +--cancel----------------------------------------> Cancelled
    +--cancel------------------------------------------------------------> Cancelled

Waiting --cancel--> Cancelled
Recovering --cancel--> Cancelled
```

#### 状态转换矩阵

| From | To | 触发函数 | 前置条件 | 副作用 | 非法时错误 |
|---|---|---|---|---|---|
| factory | `NotStarted` | `ProcessInstance::create(process_instance_id, profile, project_ref, token_set_ref, actor)` | profile state 为 `Active`;project ref 只保存引用 | 创建 instance 初始 truth | `DomainError::InvalidStateTransition` / `DomainError::BoundaryViolation` |
| `NotStarted` | `Running` | `ProcessInstance.start(&ProcessProfile, ActivityRef, ActorRef)` | profile 仍为 `Active`;初始 token / activity 已建立 | 设置 current activity;写 trace / outbox `ProcessInstanceChanged`;不创建 `ActivityProgressionRecord` | `DomainError::InvalidStateTransition` |
| `Running` | `Running` | `ProcessInstance.advance(ActivityRef, ActorRef)` | current activity / token position 与 request expected position 匹配 | 只更新 `current_activity_ref`;`ActivityProgressionRecord` 由同 flow 在 activity outcome 和 token / gateway flow-control truth 都完成后构造 | `DomainError::InvalidStateTransition` |
| `Running` | `Waiting` | `ProcessInstance.pause_for_gate(&WaitingGate, ActorRef)` | PH-04 reserved;gate 属于同一 instance 且 state 为 `Waiting` | 写 waiting change record;token `Active -> Waiting` | `DomainError::InvalidStateTransition` |
| `Waiting` | `Running` | `ProcessInstance.resume_from_gate(&WaitingGate, ActorRef)` | PH-04 reserved;gate state 为 `Resumed`;token 可恢复 | 写 waiting change record;token `Waiting -> Active` | `DomainError::InvalidStateTransition` |
| `NotStarted` / `Running` / `Waiting` | `Recovering` | `ProcessInstance.mark_recovering(&ProcessCheckpoint, ActorRef)` | PH-04 reserved;checkpoint `Available`;同一 instance;不会 fork recovery | 写 recovery history;创建 recovery attempt | `DomainError::RecoveryForkViolation` / `DomainError::InvalidStateTransition` |
| `Recovering` | `Running` | `ProcessInstance.complete_recovery(&RecoveryAttempt, ActorRef)` | PH-04 reserved;recovery attempt state 为 `Applied`;attempt 属于同一 instance | 写 recovery history;不得创建新 instance | `DomainError::RecoveryForkViolation` / `DomainError::InvalidStateTransition` |
| `Recovering` | `Failed` | `CompleteRecoveryAttemptFlow` after `RecoveryAttempt.mark_failed(...)` | PH-04 reserved;recovery outcome 为 `Failed`;failure reason 必填;policy 判定不可继续 | 写 recovery history / outbox | `DomainError::InvalidStateTransition` |
| `Running` | `Completed` | `ProcessInstance.complete(ActorRef)` | 当前活动 / token 已无未完成阻塞 | domain 只改变 instance truth;application 基于 committed `ProcessTruthChange::InstanceChanged` 生成 trace / outbox | `DomainError::InvalidStateTransition` |
| `NotStarted` / `Running` / `Waiting` / `Recovering` | `Cancelled` | `ProcessInstance.cancel(ProcessCancelReason, ActorRef)` | reason 必填;actor 有权限 | domain 只改变 instance truth 并终止 active/waiting token 的正式 flow-control 语义;application 基于 committed `ProcessTruthChange::InstanceChanged` 生成 trace / outbox | `DomainError::InvalidStateTransition` |

---

### 6.4 `ActivityState`

#### 状态集合

| 状态 | 作用 | 是否终态 | 允许的关键操作 |
|---|---|---|---|
| `Planned` | 已计划但不可行动 | 否 | `ready`、`skip`、`fail` |
| `Ready` | 可开始 | 否 | `assign`、`start`、`skip`、`fail` |
| `InProgress` | 执行中 | 否 | `attach_feedback`、`complete`、`skip`、`fail` |
| `WaitingFeedback` | 等待 runtime/member feedback | 否 | `complete`、`fail` |
| `Completed` | 已完成 | 是 | 无 |
| `Skipped` | 已跳过 | 是 | 无 |
| `Failed` | 已失败 | 是 | 无 |

#### 状态转换图

```text
factory
  |
  v
Planned --ready--> Ready --start--> InProgress --attach_feedback--> WaitingFeedback
   |        |          |                  |                         |
   |        |          |                  +--complete---------------> Completed
   |        |          +--skip---------------------------------------> Skipped
   |        +--skip--------------------------------------------------> Skipped
   +--skip-----------------------------------------------------------> Skipped

Planned / Ready / InProgress / WaitingFeedback --fail--> Failed
WaitingFeedback --complete--> Completed
InProgress --skip--> Skipped
```

#### 状态转换矩阵

| From | To | 触发函数 | 前置条件 | 副作用 | 非法时错误 |
|---|---|---|---|---|---|
| factory | `Planned` | `Activity::from_shape_node(activity_id, process_instance_id, shape_node_ref, activity_kind)` | shape node 属于 adopted runtime shape | 创建 activity | `DomainError::BoundaryViolation` |
| `Planned` | `Ready` | `Activity.ready(ActivityProgressionId, ActorRef)` | owning instance 为 `Running`;progression id 由 application 生成 | 返回 `ActivityTransitionOutcome`;完整 progression record 由 application flow 后置构造 | `DomainError::InvalidStateTransition` |
| `Ready` | `Ready` | `Activity.assign(ActivityProgressionId, ActorRef, ActorRef)` | assignee ref 可解析;不改变 identity truth;progression id 由 application 生成 | 更新 assignee;返回 `ActivityTransitionOutcome`;完整 progression record 由 application flow 后置构造 | `DomainError::ReferenceResolutionFailed` |
| `Ready` | `InProgress` | `Activity.start(ActivityProgressionId, ActorRef)` | assignee / actor policy 满足;progression id 由 application 生成 | 返回 `ActivityTransitionOutcome`;完整 progression record 由 application flow 后置构造 | `DomainError::InvalidStateTransition` |
| `InProgress` | `WaitingFeedback` | `Activity.attach_feedback(ActivityProgressionId, RuntimeFeedbackRef)` | feedback matches activity;只保存 ref;progression id 由 application 生成 | 绑定 feedback ref;返回 `ActivityTransitionOutcome`;record 使用空 token / gateway truth | `DomainError::ReferenceResolutionFailed` |
| `InProgress` / `WaitingFeedback` | `Completed` | `Activity.complete(ActivityProgressionId, ActivityCompletionReason, ActorRef)` | completion reason 和 policy 满足;consumer 不得直接调用;progression id 由 application 生成 | 返回 `ActivityTransitionOutcome`;application 在 flow-control truth 完成后写 progression record / outbox `ActivityProgressed` | `DomainError::InvalidStateTransition` |
| `Planned` / `Ready` / `InProgress` | `Skipped` | `Activity.skip(ActivityProgressionId, ActivitySkipReason, ActorRef)` | skip reason 合法;不会留下 active token;progression id 由 application 生成 | 返回 `ActivityTransitionOutcome`;application 在 flow-control truth 完成后写 progression record | `DomainError::InvalidStateTransition` |
| `Planned` / `Ready` / `InProgress` / `WaitingFeedback` | `Failed` | `Activity.fail(ActivityProgressionId, ActivityFailureReason, ActorRef)` | failure reason 必填;progression id 由 application 生成 | 返回 `ActivityTransitionOutcome`;application 在 flow-control truth 完成后写 progression record;可触发 instance recovery policy | `DomainError::InvalidStateTransition` |

---

### 6.5 `TokenState`

#### 状态集合

| 状态 | 作用 | 是否终态 | 允许的关键操作 |
|---|---|---|---|
| `Active` | 可推进 | 否 | `move_to`、`wait_at`、`consume`、`terminate` |
| `Waiting` | 阻塞于等待点 | 否 | `resume_at`、`consume`、`terminate` |
| `Consumed` | 正常路径已消费 | 是 | 无 |
| `Terminated` | 取消或失败终止 | 是 | 无 |

#### 状态转换图

```text
factory -> Active --move_to--> Active
             |  |  |
             |  |  +--wait_at--> Waiting --resume_at--> Active
             |  +--consume----------------------------> Consumed
             +--terminate-----------------------------> Terminated

Waiting --consume--> Consumed
Waiting --terminate--> Terminated
```

#### 状态转换矩阵

| From | To | 触发函数 | 前置条件 | 副作用 | 非法时错误 |
|---|---|---|---|---|---|
| factory | `Active` | `Token::start_at(token_id, process_instance_id, start_node_ref)` | start node 属于 runtime shape | 创建 token | `DomainError::BoundaryViolation` |
| `Active` | `Active` | `Token.move_to(ShapeNodeRef)` | next node 合法;expected position 匹配 | 更新 position | `DomainError::InvalidStateTransition` |
| `Active` | `Waiting` | `Token.wait_at(ShapeNodeRef)` | wait node 对应 opened gate | 更新 position;gate open transaction 保存 | `DomainError::InvalidStateTransition` |
| `Waiting` | `Active` | `Token.resume_at(ShapeNodeRef)` | gate state 为 `Resumed`;resume node 合法 | 更新 position | `DomainError::InvalidStateTransition` |
| `Active` / `Waiting` | `Consumed` | `Token.consume()` | normal route consumed token | 标记 consumed | `DomainError::InvalidStateTransition` |
| `Active` / `Waiting` | `Terminated` | `Token.terminate(TokenTerminationReason)` | instance cancelled / failed 或 route invalid | 标记 terminated | `DomainError::InvalidStateTransition` |

---

### 6.6 `GatewayState`

#### 状态集合

| 状态 | 作用 | 是否终态 | 允许的关键操作 |
|---|---|---|---|
| `PendingDecision` | 等待路线选择 | 否 | `select_route`、`mark_invalid` |
| `RouteSelected` | 已选路线 | 否 | `join_tokens`、`mark_invalid` |
| `Joined` | 已完成合流 | 是 | 无 |
| `Invalid` | 不可用 | 是 | 无 |

#### 状态转换图

```text
factory -> PendingDecision --select_route--> RouteSelected --join_tokens--> Joined
               |                         |
               +--mark_invalid----------+--mark_invalid--> Invalid
factory for pure join gateway ---------------------------> Joined
```

#### 状态转换矩阵

| From | To | 触发函数 | 前置条件 | 副作用 | 非法时错误 |
|---|---|---|---|---|---|
| factory | `PendingDecision` | `Gateway::from_shape_node(gateway_id, shape_node_ref, gateway_kind)` | gateway kind 需要 route decision | 创建 gateway | `DomainError::BoundaryViolation` |
| factory | `Joined` | `Gateway::from_shape_node(...)` for already-joinable gateway | gateway kind 不需要显式 decision 且 tokens satisfied | 创建 joined marker | `DomainError::BoundaryViolation` |
| `PendingDecision` | `RouteSelected` | `Gateway.select_route(GatewayRouteRef, GatewayDecisionReason, ActorRef)` | route 属于 gateway;decision reason 合法 | 设置 `Gateway.selected_route_ref = Some(route_ref)`;token 进入 next path | `DomainError::InvalidStateTransition` |
| `RouteSelected` | `Joined` | `Gateway.join_tokens(TokenSet)` | required incoming tokens complete | 消费 / 合并 token;保留既有 `selected_route_ref` | `DomainError::InvalidStateTransition` |
| `PendingDecision` / `RouteSelected` | `Invalid` | `Gateway.mark_invalid(GatewayInvalidReason)` | route / shape / decision invalid | 标记 invalid;清空 `selected_route_ref`;可触发 activity / instance failure policy | `DomainError::InvalidStateTransition` |

---

### 6.7 `WaitingGateState`

#### 状态集合

| 状态 | 作用 | 是否终态 | 允许的关键操作 |
|---|---|---|---|
| `Waiting` | 等待外部恢复依据 | 否 | `attach_decision`、`cancel`、`expire` |
| `DecisionResolved` | 已有匹配 external decision,尚未恢复 | 否 | `resume`、`cancel`、`expire` |
| `Resumed` | 已恢复 | 是 | 无 |
| `Cancelled` | 已取消 | 是 | 无 |
| `Expired` | 已过期 | 是 | 无 |

#### 状态转换图

```text
factory -> Waiting --attach_decision--> DecisionResolved --resume--> Resumed
             |                              |
             +--cancel---------------------+--cancel--> Cancelled
             +--expire---------------------+--expire--> Expired
```

#### 状态转换矩阵

| From | To | 触发函数 | 前置条件 | 副作用 | 非法时错误 |
|---|---|---|---|---|---|
| factory | `Waiting` | `WaitingGate::open_for_activity(waiting_gate_id, process_instance_id, activity_ref, pause_context)` | activity 属于 running instance;pause context requirement 完整 | 保存 gate / pause context;instance `Running -> Waiting`;token `Active -> Waiting` | `DomainError::InvalidStateTransition` |
| `Waiting` | `DecisionResolved` | `WaitingGate.attach_decision(GovernanceDecisionRef, ActorRef)` | decision ref 与 `PauseContext.resume_requirement_ref` 匹配;consumer 只允许到本状态 | 保存 decision ref;写 marker;不恢复 instance / token | `DomainError::ReferenceResolutionFailed` / `DomainError::InvalidStateTransition` |
| `DecisionResolved` | `Resumed` | `WaitingGate.resume(ResumeReason, ActorRef)` | explicit `ResumeWaitingGateRequest`;actor context present;gate 未过期 | instance `Waiting -> Running`;token `Waiting -> Active`;写 outbox | `DomainError::InvalidStateTransition` |
| `Waiting` / `DecisionResolved` | `Cancelled` | `WaitingGate.cancel(WaitingCancelReason, ActorRef)` | reason 必填 | 写 waiting change record;可取消 token / instance | `DomainError::InvalidStateTransition` |
| `Waiting` / `DecisionResolved` | `Expired` | `WaitingGate.expire(WaitingExpireReason)` | retention / time policy 判定过期 | 写 expired marker;不得自动 cancel instance | `DomainError::InvalidStateTransition` |

---

### 6.8 `CheckpointState`

#### 状态集合

| 状态 | 作用 | 是否终态 | 允许的关键操作 |
|---|---|---|---|
| `Available` | 可用于同一 instance 恢复 | 否 | `mark_superseded`、`invalidate`、`expire`、`can_resume` |
| `Superseded` | 被新 checkpoint 替代 | 是 | 无 |
| `Invalid` | 无效 | 是 | 无 |
| `Expired` | 过期 | 是 | 无 |

#### 状态转换图

```text
factory -> Available --mark_superseded--> Superseded
              |  |
              |  +--invalidate--> Invalid
              +-----expire------> Expired
```

#### 状态转换矩阵

| From | To | 触发函数 | 前置条件 | 副作用 | 非法时错误 |
|---|---|---|---|---|---|
| factory | `Available` | `ProcessCheckpoint::capture(checkpoint_id, &ProcessInstance, Option<ActivityRef>, CheckpointEvidenceRef)` | instance 非终态;activity 属于 instance;evidence ref 可验证 | 创建 checkpoint;写 recovery history / trace | `DomainError::ReferenceResolutionFailed` |
| `Available` | `Superseded` | `ProcessCheckpoint.mark_superseded(ProcessCheckpointRef)` | next checkpoint 属于同一 instance;不会 fork | 设置 `superseded_by` | `DomainError::RecoveryForkViolation` / `DomainError::InvalidStateTransition` |
| `Available` | `Invalid` | `ProcessCheckpoint.invalidate(CheckpointInvalidReason)` | evidence invalid 或 boundary violation | 标记 invalid;拒绝后续 recovery | `DomainError::InvalidStateTransition` |
| `Available` | `Expired` | `ProcessCheckpoint.expire(CheckpointExpireReason)` | retention policy 到期 | 标记 expired | `DomainError::InvalidStateTransition` |

---

### 6.9 `RecoveryAttemptState`

#### 状态集合

| 状态 | 作用 | 是否终态 | 允许的关键操作 |
|---|---|---|---|
| `Pending` | 待应用 | 否 | `mark_applied`、`mark_failed`、`abandon` |
| `Applied` | 已应用 | 是 | 无 |
| `Failed` | 应用失败 | 否 | `abandon` |
| `Abandoned` | 已放弃 | 是 | 无 |

#### 状态转换图

```text
factory -> Pending --mark_applied--> Applied
              |  |
              |  +--mark_failed--> Failed --abandon--> Abandoned
              +-----abandon--------------------------> Abandoned
```

#### 状态转换矩阵

| From | To | 触发函数 | 前置条件 | 副作用 | 非法时错误 |
|---|---|---|---|---|---|
| factory | `Pending` | `RecoveryAttempt::start(recovery_attempt_id, process_instance_id, checkpoint_ref, actor)` | checkpoint `Available`;same instance;无 active conflicting attempt | 创建 attempt;instance `非终态 -> Recovering` | `DomainError::RecoveryForkViolation` |
| `Pending` | `Applied` | `RecoveryAttempt.mark_applied(ActorRef)` | checkpoint can_resume;recovery outcome 为 `Applied` | 写 history;随后 instance `Recovering -> Running` | `DomainError::InvalidStateTransition` |
| `Pending` | `Failed` | `RecoveryAttempt.mark_failed(RecoveryFailureReason)` | failure reason 必填 | 写 failure reason / history;instance 可按 policy 转 `Failed` 或保持 `Recovering` 待维护 | `DomainError::InvalidStateTransition` |
| `Pending` / `Failed` | `Abandoned` | `RecoveryAttempt.abandon(RecoveryAbandonReason, ActorRef)` | abandon reason 必填;不会创建替代 instance | 写 history;maintenance job 可写 outbox | `DomainError::InvalidStateTransition` |

---

### 6.10 `StageState`

#### 状态集合

| 状态 | 作用 | 是否终态 | 允许的关键操作 |
|---|---|---|---|
| `Pending` | 阶段未进入 | 否 | `activate`、`skip` |
| `Active` | 阶段进行中 | 否 | `pause`、`complete`、`skip` |
| `Paused` | 阶段暂停 | 否 | `activate`、`complete`、`skip` |
| `Completed` | 阶段完成 | 是 | 无 |
| `Skipped` | 阶段跳过 | 是 | 无 |

#### 状态转换图

```text
factory -> Pending --activate--> Active --pause--> Paused --activate--> Active
              |                  |  |
              |                  |  +--complete--> Completed
              |                  +--complete------> Completed
              +--skip----------------------------------------------> Skipped
Active / Paused --skip----------------------------------------------> Skipped
```

#### 状态转换矩阵

| From | To | 触发函数 | 前置条件 | 副作用 | 非法时错误 |
|---|---|---|---|---|---|
| factory | `Pending` | `ProcessStageState::from_profile_stage(stage_id, process_instance_id, stage_ref)` | stage ref 属于 adopted profile | 创建 stage state | `DomainError::BoundaryViolation` |
| `Pending` / `Paused` | `Active` | `ProcessStageState.activate(ActorRef)` | rhythm policy 允许进入 / 恢复 | 写 timing trace / outbox | `DomainError::InvalidStateTransition` |
| `Active` | `Paused` | `ProcessStageState.pause(StagePauseReason, ActorRef)` | reason 必填;不得暂停终态 stage | 写 timing trace | `DomainError::InvalidStateTransition` |
| `Active` / `Paused` | `Completed` | `ProcessStageState.complete(StageCompletionReason, ActorRef)` | completion reason 合法 | 写 timing trace / outbox | `DomainError::InvalidStateTransition` |
| `Pending` / `Active` / `Paused` | `Skipped` | `ProcessStageState.skip(StageSkipReason, ActorRef)` | skip reason 合法 | 写 timing trace / outbox | `DomainError::InvalidStateTransition` |

---

### 6.11 `TimeboxBindingState`

#### 状态集合

| 状态 | 作用 | 是否终态 | 允许的关键操作 |
|---|---|---|---|
| `Active` | binding 生效 | 否 | `mark_stale`、`release`、`mark_invalid` |
| `Stale` | 外部 timebox 过期 | 否 | refresh to active、`release`、`mark_invalid` |
| `Released` | 已解除 | 是 | 无 |
| `Invalid` | 不可用 | 是 | 无 |

#### 状态转换图

```text
factory -> Active --mark_stale--> Stale --refresh/rebind--> Active
             |  |                  |  |
             |  +--release--------+--release--> Released
             +--mark_invalid------+--mark_invalid--> Invalid
```

#### 状态转换矩阵

| From | To | 触发函数 | 前置条件 | 副作用 | 非法时错误 |
|---|---|---|---|---|---|
| factory | `Active` | `ProcessTimeboxBinding::bind(binding_id, process_timebox_ref, external_timebox_ref, actor)` | external timebox ref 可解析;不保存 Work truth | 创建 binding;写 timing trace | `DomainError::ReferenceResolutionFailed` |
| `Active` | `Stale` | `ProcessTimeboxBinding.mark_stale(ReferenceStaleReason)` | work context consumer 或 refresh job 发现 source stale | 标记相关 view stale | `DomainError::InvalidStateTransition` |
| `Stale` | `Active` | `ProcessTimeboxBinding.mark_active(&WorkContextSnapshot)` | external timebox ref 重新 resolved;policy 允许继续使用 | 清除 stale marker;写 timing trace | `DomainError::ReferenceResolutionFailed` |
| `Active` / `Stale` | `Released` | `ProcessTimeboxBinding.release(TimeboxReleaseReason, ActorRef)` | reason 必填 | 解除 binding;不改 Work Iteration truth | `DomainError::InvalidStateTransition` |
| `Active` / `Stale` | `Invalid` | `ProcessTimeboxBinding.mark_invalid(TimeboxInvalidReason)` | source invalid 或 boundary violation | 标记 invalid;后续 rhythm command 拒绝 | `DomainError::InvalidStateTransition` |

---

## 7. 派生、引用、发布、交接和报告状态机

### 7.1 `ProjectionFreshnessState`

#### 状态集合

| 状态 | 作用 | 是否终态 | 允许的关键操作 |
|---|---|---|---|
| `Fresh` | projection 已追上 cursor | 否 | `mark_stale`、`mark_rebuilding`、`disable` |
| `Stale` | projection 落后 committed truth | 否 | `mark_rebuilding`、`mark_fresh`、`disable` |
| `Rebuilding` | 正在重建 | 否 | `mark_fresh`、`mark_failed`、`disable` |
| `Failed` | 重建或刷新失败 | 否 | `mark_rebuilding`、`mark_stale`、`disable` |
| `Disabled` | 被配置或运维禁用 | 否 | `mark_rebuilding` |

#### 状态转换图

```text
factory -> Fresh --mark_stale--> Stale --mark_rebuilding--> Rebuilding --mark_fresh--> Fresh
             |                       ^                         |
             +--mark_rebuilding------+                         +--mark_failed--> Failed
             |                                                 ^     |
             +--disable-----------------------------------------+-----+--mark_stale--> Stale

Fresh / Stale / Rebuilding / Failed --disable--> Disabled --mark_rebuilding--> Rebuilding
```

#### 状态转换矩阵

| From | To | 触发函数 | 前置条件 | 副作用 | 非法时错误 |
|---|---|---|---|---|---|
| factory | `Fresh` | `DerivedProcessViewState::for_projection(view_state_id, projection_kind, cursor_ref)` | cursor 来自 committed truth | 创建 view state | `DomainError::BoundaryViolation` |
| `Fresh` / `Failed` | `Stale` | `DerivedProcessViewState.mark_stale(ProjectionStaleReason)` | truth change、reference change 或 stale marker | query 返回 degraded marker | `DomainError::InvalidStateTransition` |
| `Fresh` / `Stale` / `Failed` / `Disabled` | `Rebuilding` | `DerivedProcessViewState.mark_rebuilding()` | rebuild job 已取得 lease;disabled 需要 operations policy 允许 | job receipt scanned / changed | `DomainError::InvalidStateTransition` |
| `Rebuilding` / `Stale` | `Fresh` | `DerivedProcessViewState.mark_fresh(ProcessTruthCursorRef)` | builder 成功;cursor 不回退 | 更新 source cursor;query 可 `Available` | `DomainError::InvalidStateTransition` |
| `Rebuilding` | `Failed` | `DerivedProcessViewState.mark_failed(ProjectionFailureReason)` | builder 失败且 reason 必填 | query `Degraded` 或 `Unavailable` | `DomainError::InvalidStateTransition` |
| `Fresh` / `Stale` / `Rebuilding` / `Failed` | `Disabled` | `DerivedProcessViewState.disable(ProjectionDisabledReason)` | operations policy 禁用 | query `Unavailable`;job 不继续重建 | `DomainError::InvalidStateTransition` |

---

### 7.2 `ReferenceResolutionLifecycleState`

#### 状态集合

| 状态 | 作用 | 是否终态 | 允许的关键操作 |
|---|---|---|---|
| `Resolved` | 外部 ref 已解析为本地 snapshot ref | 否 | `mark_stale`、`mark_invalid`、`mark_unavailable` |
| `Unresolved` | 尚未解析 | 否 | `mark_resolved`、`mark_invalid`、`mark_unavailable` |
| `Stale` | snapshot 旧于外部来源 | 否 | `mark_resolved`、`mark_invalid`、`mark_unavailable` |
| `Invalid` | 外部 ref 对本 boundary 非法 | 是 | 无 |
| `Unavailable` | 外部 source 暂不可达 | 否 | `mark_resolved`、`mark_unresolved`、`mark_stale` |

#### 状态转换图

```text
factory -> Unresolved --mark_resolved--> Resolved --mark_stale--> Stale --mark_resolved--> Resolved
              |                            |                       |
              |                            +--mark_unavailable-----+--> Unavailable
              +--mark_unavailable--------------------------------------> Unavailable

Resolved / Unresolved / Stale / Unavailable --mark_invalid--> Invalid
Unavailable --mark_unresolved--> Unresolved
Unavailable --mark_stale-------> Stale
```

#### 状态转换矩阵

| From | To | 触发函数 | 前置条件 | 副作用 | 非法时错误 |
|---|---|---|---|---|---|
| factory | `Unresolved` | `ReferenceResolutionState::unresolved(reference_state_id, reference_ref, reason)` | reason 必填;reference_ref 不含正文 | 创建 unresolved marker | `DomainError::ExternalBodyRejected` |
| `Unresolved` / `Stale` / `Unavailable` | `Resolved` | `ReferenceResolutionState.mark_resolved(ExternalSnapshotRef)` | resolver 返回 snapshot ref;digest / version 校验通过 | 保存 snapshot ref;可让 policy 通过 | `DomainError::ReferenceResolutionFailed` |
| `Resolved` | `Stale` | `ReferenceResolutionState.mark_stale(ReferenceStaleReason)` | source version 更新或 snapshot 过期 | projection / query degraded marker | `DomainError::InvalidStateTransition` |
| `Resolved` / `Unresolved` / `Stale` / `Unavailable` | `Invalid` | `ReferenceResolutionState.mark_invalid(ReferenceInvalidReason)` | ref 不属于 Process boundary 或 digest mismatch permanent | 后续 command policy 拒绝 | `DomainError::ReferenceResolutionFailed` |
| `Resolved` / `Unresolved` / `Stale` | `Unavailable` | `ReferenceResolutionState.mark_unavailable(ReferenceUnavailableReason)` | resolver / source temporary unavailable | consumer delayed 或 query degraded | `DomainError::ReferenceResolutionFailed` |
| `Unavailable` | `Unresolved` | `ReferenceResolutionState.mark_unresolved(ReferenceUnresolvedReason)` | source 可达但 ref 仍无法解析 | 保留 unresolved reason | `DomainError::ReferenceResolutionFailed` |

---

### 7.3 `TraceHandoffState`

#### 状态集合

| 状态 | 作用 | 是否终态 | 允许的关键操作 |
|---|---|---|---|
| `Prepared` | 已形成 handoff material ref | 否 | `mark_delivered`、`mark_failed`、cancel path |
| `Delivered` | 已交付 | 是 | 无 |
| `Failed` | 交付失败,可重试或取消 | 否 | `mark_delivered`、cancel path |
| `Cancelled` | 已取消 | 是 | 无 |

#### 状态转换图

```text
prepare -> Prepared --mark_delivered--> Delivered
              |  |
              |  +--mark_failed--> Failed --mark_delivered--> Delivered
              +-----cancel-------------------------------> Cancelled
Failed --cancel------------------------------------------> Cancelled
```

#### 状态转换矩阵

| From | To | 触发函数 | 前置条件 | 副作用 | 非法时错误 |
|---|---|---|---|---|---|
| factory | `Prepared` | `ProcessTraceRecord.prepare_handoff(TraceHandoffRef, TraceHandoffTargetRef)` / `TraceHandoffRecord::prepare(...)` | trace record 来自 committed truth;target ref 不要求外部正文 | 创建 handoff marker | `DomainError::ExternalBodyRejected` |
| `Prepared` / `Failed` | `Delivered` | `TraceHandoffRecord.mark_delivered(...)` / `mark_archived(...)` | handoff port 返回 receipt / external ref;不保存 observability / archive body | 保存 receipt marker、external handoff ref 或 archive package ref | `DomainError::InvalidStateTransition` |
| `Prepared` | `Failed` | `TraceHandoffRecord.mark_failed(...)` | handoff port 返回 retryable/permanent failure | job receipt failed_count 增加 | `DomainError::InvalidStateTransition` |
| `Prepared` / `Failed` | `Cancelled` | `TraceHandoffRecord.cancel(HandoffCancelReason, ActorRef)` | operations policy 允许取消;reason 必填 | 不再投递;不回滚 Process truth | `DomainError::InvalidStateTransition` |

---

### 7.4 `OutboxPublicationState`

#### 状态集合

| 状态 | 作用 | 是否终态 | 允许的关键操作 |
|---|---|---|---|
| `Pending` | 待发布 | 否 | `mark_published`、`mark_retry`、`mark_failed` |
| `Published` | 已发布 | 是 | 无 |
| `Failed` | 发布失败 | 否 | `mark_retry` |
| `RetryPending` | 等待重试 | 否 | `mark_published`、`mark_failed` |

#### 状态转换图

```text
from_truth_change -> Pending --mark_published--> Published
                       |  |
                       |  +--mark_retry--> RetryPending --mark_published--> Published
                       |                         |
                       +--mark_failed------------+--mark_failed--> Failed

Failed --mark_retry--> RetryPending
```

#### 状态转换矩阵

| From | To | 触发函数 | 前置条件 | 副作用 | 非法时错误 |
|---|---|---|---|---|---|
| factory | `Pending` | `ProcessOutboxRecord::from_truth_change(outbox_id, ProcessTruthChange)` | truth change 已提交;event kind 映射存在 | 创建 outbox;不影响 command truth 成立 | `DomainError::BoundaryViolation` |
| `Pending` / `RetryPending` | `Published` | `ProcessOutboxRecord.mark_published(OutboxPublicationRef)` | publisher 返回 publication ref;event envelope 由 truth ref 构造 | 设置 `publication_ref`;job changed_count +1 | `DomainError::InvalidStateTransition` |
| `Pending` / `Failed` | `RetryPending` | `ProcessOutboxRecord.mark_retry(OutboxRetryReason)` | publisher failure retryable 或 operator retry | 保存 retry reason marker;不回滚 truth | `DomainError::InvalidStateTransition` |
| `Pending` / `RetryPending` | `Failed` | `ProcessOutboxRecord.mark_failed(OutboxFailureReason)` | publisher failure permanent 或 retry exhausted | 保存 failure reason;job partial failure | `DomainError::InvalidStateTransition` |

---

### 7.5 `ReconciliationResultState`

#### 状态集合

| 状态 | 作用 | 是否终态 | 允许的关键操作 |
|---|---|---|---|
| `Clean` | 无问题 | 否 | `add_issue`、`mark_failed`、mark partial path |
| `HasIssues` | 有问题 | 否 | `mark_failed`、mark partial path |
| `Failed` | 失败 | 是 | 无 |
| `Partial` | 部分完成 | 否 | `mark_failed` |

#### 状态转换图

```text
factory -> Clean --add_issue--> HasIssues
             |         |          |
             |         |          +--partial--> Partial --mark_failed--> Failed
             |         +--partial--------------------------> Partial
             +--mark_failed-------------------------------> Failed
HasIssues --mark_failed-----------------------------------> Failed
```

#### 状态转换矩阵

| From | To | 触发函数 | 前置条件 | 副作用 | 非法时错误 |
|---|---|---|---|---|---|
| factory | `Clean` | `ReconciliationReport::for_scope(report_id, scope_ref)` | scope valid;report 不修复 truth | 创建 report | `DomainError::BoundaryViolation` |
| `Clean` | `HasIssues` | `ReconciliationReport.add_issue(ReconciliationIssueRef)` | issue ref 来自 reconciliation scan | 添加 issue ref | `DomainError::InvalidStateTransition` |
| `Clean` / `HasIssues` | `Partial` | `RunProcessReconciliationFlow` partial result path | 部分 source / repository unavailable;已有 report | 保存 partial marker;job `PartialFailure` | `DomainError::InvalidStateTransition` |
| `Clean` / `HasIssues` / `Partial` | `Failed` | `ReconciliationReport.mark_failed(ReconciliationFailureReason)` | failure reason 必填 | 保存 failure marker;job report ref | `DomainError::InvalidStateTransition` |

---

## 8. Projection summary 和 protocol 状态

### 8.1 `ProcessProgressState`

`ProcessProgressState` 只由 projection builder 从 committed `ProcessInstanceState`、`WaitingGateState`、`RecoveryAttemptState` 和 `StageState` 派生。Command、consumer、job 不得直接以 `ProcessProgressSummary` 作为 truth 写入目标。

| 派生状态 | 来源状态 | 触发函数 | 副作用 | 非法时错误 |
|---|---|---|---|---|
| `NotStarted` | `ProcessInstanceState::NotStarted` | `ProcessProgressSummary::from_read_model(...)` | query summary 可见 | `DomainError::BoundaryViolation` |
| `InProgress` | `ProcessInstanceState::Running` 且无 waiting / recovery marker | `ProcessProgressSummary::from_read_model(...)` | query summary 可见 | `DomainError::BoundaryViolation` |
| `Waiting` | `ProcessInstanceState::Waiting` 或 active `WaitingGateState::Waiting` / `DecisionResolved` | `ProcessProgressSummary.mark_waiting(WaitingGateRef)` | query summary 可见 | `DomainError::BoundaryViolation` |
| `Recovering` | `ProcessInstanceState::Recovering` 或 `RecoveryAttemptState::Pending` | `ProcessProgressSummary.mark_recovering(RecoveryAttemptRef)` | query summary 可见 | `DomainError::BoundaryViolation` |
| `Completed` | `ProcessInstanceState::Completed` | `ProcessProgressSummary.mark_completed()` | query summary 可见 | `DomainError::BoundaryViolation` |
| `Blocked` | projection detects unresolved required external context or failed required activity marker | projection builder guarded path | degraded marker required | `DomainError::BoundaryViolation` |

### 8.2 `ProcessViewStatus`

`ProcessViewStatus` 是 query response surface,不是 domain 状态机。

| Status | 来源 | 必须携带的 marker | 禁止事项 |
|---|---|---|---|
| `Available` | subject visible 且 projection/read model 可服务 | 无 | 不得掩盖 stale required ref |
| `NotVisible` | read visibility policy 返回 hidden / filtered-to-empty | `ProcessVisibilityMarker` | 不得返回 hidden truth body |
| `Missing` | repository 无 subject 或 cursor 不存在 | 无 | 不得伪造 empty object |
| `Degraded` | projection stale / rebuilding 或 reference unresolved / stale / unavailable | `ProcessDegradedMarker` 或 `ProjectionStatusMarker` | 不得静默返回 available |
| `Unavailable` | projection disabled / failed 且无 fallback | `ProjectionStatusMarker` | 不得触发 rebuild 或修复 truth |

### 8.3 `ConsumerDisposition`

`ConsumerDisposition` 是 inbound event receipt surface。Consumer 允许写 snapshot / reference / marker,不得推进 core command 状态,例外仅为本 Step 明确的 `WaitingGate.attach_decision(...)` marker transition。

| Disposition | 来源 | 允许写入 | 禁止事项 |
|---|---|---|---|
| `Accepted` | envelope valid,source isolated,dedup 通过 | snapshot、reference state、stale marker、pending feedback、decision-resolved marker | 不得 start / complete / resume instance |
| `Duplicate` | event idempotency same key + same digest | 复用既有 receipt | 不得重放 resolver 或 domain transition |
| `Quarantined` | body rejected、digest mismatch、source boundary violation | quarantine marker | 不得保存外部正文 |
| `Delayed` | source temporarily unavailable | delayed marker | 不得写 success marker |
| `Noop` | event 与本仓 subject 无匹配或不改变 marker | noop marker | 不得伪造 truth change |

### 8.4 `JobDisposition`

`JobDisposition` 是 job receipt surface。Job 可修改其专属维护状态,不得静默修复核心 Process truth。

| Disposition | 来源 | 允许写入 | 禁止事项 |
|---|---|---|---|
| `Completed` | 全部 item 成功或无 item | job receipt、projection/report/handoff/outbox 状态 | 不得声明未执行 item 成功 |
| `PartialFailure` | per-item job 部分失败但生成 report | failed item marker、report ref | 不得 rollback 已成功 item |
| `Rejected` | input invalid 或 idempotency conflict | rejected error / receipt | 不得开始 item mutation |
| `Delayed` | dependency temporarily unavailable | delayed receipt | 不得写 permanent failed marker |

---

## 9. 跨状态传播规则

| 触发状态变化 | 必须传播 | 不得传播 |
|---|---|---|
| `RuntimeProcessShapeState::Active/Stale/Invalid/Retired` | `ProcessTruthChange::RuntimeShapeChanged`;affected profile / projection stale marker | method definition body |
| `ProcessProfileState` 变化 | `ProfileChangeRecord`;audit;outbox `ProcessProfileChanged`;derived view stale | Project truth |
| `ProcessInstanceState` 变化 | trace / audit;outbox `ProcessInstanceChanged`;summary stale | Work item / runtime queue truth |
| `ActivityState` 变化 | `ActivityProgressionRecord`;outbox `ActivityProgressed`;timeline stale | runtime execution body |
| `WaitingGateState` 变化 | `WaitingGateChangeRecord`;outbox `WaitingGateChanged`;pause context retained | governance decision truth |
| `CheckpointState` / `RecoveryAttemptState` 变化 | `RecoveryHistoryRecord`;outbox `RecoveryAttemptChanged` when attempt state changed | new process instance fork |
| `StageState` / `TimeboxBindingState` 变化 | timing trace;outbox event `ProcessOutboxEventKind::ProcessTimingChanged`;derived stale | Work Iteration truth |
| `ProjectionFreshnessState` 变化 | query marker / job receipt | Process truth mutation |
| `ReferenceResolutionLifecycleState` 变化 | reference marker;affected projection stale | external source body |
| `OutboxPublicationState` 变化 | job receipt / publication marker | rollback committed truth |
| `TraceHandoffState` 变化 | handoff receipt / marker | observability or archive body |

---

## 10. 非法转换处理表

| 非法场景 | 检测位置 | 错误 | 事务 / 审计口径 |
|---|---|---|---|
| 任何终态对象被普通 command 迁移 | domain object member function | `DomainError::InvalidStateTransition` | rollback;不写 trace / outbox |
| `Retired` shape / profile 普通激活 | `RuntimeProcessShape.activate` / `ProcessProfile.activate` | `DomainError::InvalidStateTransition` | rollback |
| `Completed` / `Cancelled` / `Failed` instance 回到 `Running` | `ProcessInstance` methods | `DomainError::InvalidStateTransition` | rollback;恢复重开必须另立设计 |
| recovery 试图创建第二份 instance | `RecoveryContinuityPolicy` / `ProcessInstance.complete_recovery` | `DomainError::RecoveryForkViolation` | rollback;不保存 attempt success |
| consumer 直接 complete activity 或 resume gate | `ProcessConsumerService` guard | `DomainError::BoundaryViolation` 或 `ConsumerDisposition::Quarantined` | 不写 command truth;可写 quarantine/noop |
| projection rebuild 写 core truth | `DerivedProcessViewPolicy.assert_rebuild_does_not_write_truth()` | `DomainError::BoundaryViolation` | job failed / report |
| outbox `Published -> Pending/Failed/RetryPending` | `ProcessOutboxRecord` methods | `DomainError::InvalidStateTransition` | 不改 publication state |
| trace handoff delivered 后再次失败或取消 | `TraceHandoffRecord` methods | `DomainError::InvalidStateTransition` | 不改 marker |
| reference `Invalid -> any` | `ReferenceResolutionState` methods | `DomainError::InvalidStateTransition` | 必须创建新 reference state 才能重新解析 |
| stale / degraded query 自动修复 projection | query service | `DomainError::BoundaryViolation` 或 query `Unavailable` | Query read only,不打开 write tx |

---

## 11. 回填草稿

> 校准来源:
> - `design-calibration/03_ddd_step_10_state_matrix.md`

`03-详细设计.md` §9 必须写入本 Step 的状态机总表、每个状态机的状态集合、ASCII 图、转换矩阵和非法转换处理表。正式状态名必须完全沿用 Step 6 enum 变体。`ProcessViewStatus`、`ConsumerDisposition`、`JobDisposition` 和 `ProcessProgressState` 必须标注为 protocol / projection 状态,不得与 core domain truth 状态机混用。

---

## 12. 待确认事项

无。

---

## 13. 进入下一步条件

- 已覆盖 Step 6 所有状态 enum。
- 已为每个状态机写出 ASCII 图和转换矩阵。
- 已明确非法转换错误。
- 已区分 domain truth 状态、派生维护状态和 protocol disposition。
- 已回填 `ProcessInstance.complete_recovery(...)` 方法口径,闭合 Step 9 recovery flow。
