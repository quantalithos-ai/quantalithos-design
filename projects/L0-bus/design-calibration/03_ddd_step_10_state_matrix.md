# Step 10. 定义状态机与转换矩阵

## 1. Step 状态

- 状态：[x] 已确认
- 所属文档：`projects/L0-bus/03-详细设计.md`
- 本步目标：定义代码必须遵守的状态集合、状态转换图、状态转换矩阵、非法转换处理和状态副作用。
- 本步不直接修改正式 `03-详细设计.md`，只形成中间产物。

---

## 2. 本步输入

| 输入 | 关键结论 | 本步使用方式 |
|---|---|---|
| `standards/document/详细设计讨论流程_SOP.md` Step 10 | 必须输出状态集合表、状态转换图、状态转换矩阵、非法转换处理表 | 约束本文件结构 |
| `standards/document/详细设计书写规范.md` §5.9 | 状态名必须与 enum 变体一致，触发函数必须可回指对象函数或处理流 | 约束正式文档回填格式 |
| `projects/L0-bus/02-概要设计.md` §9 | 已确认状态机范围和禁止迁移口径 | 作为上游状态机边界 |
| `projects/L0-bus/design-calibration/03_ddd_step_06_object_contracts.md` | 已定义状态 enum、成员函数和允许来源 / 去向 | 作为本步状态名和触发函数真相来源 |
| `projects/L0-bus/design-calibration/03_ddd_step_09_function_flows.md` | 已定义每个处理流的状态副作用 | 用于确定哪些处理流触发状态转换 |

---

## 3. SOP 问题回答

### 3.1 当前仓有哪些正式状态机？

| 状态机 | 所属对象 | 状态 enum | 是否正式状态机 | 说明 |
|---|---|---|---|---|
| Publication acceptance 状态机 | `PublicationAcceptance` | `PublicationAcceptanceStatus` | 是 | 发布材料接入判定 |
| Delivery 生命周期状态机 | `DeliveryRecord` | `DeliveryStatus` | 是 | bus 拥有的 delivery truth |
| Feedback 结果状态集合 | `FeedbackResult` | `FeedbackStatus` | 是，但无多步迁移 | bus 级反馈归一化结果，一次生成即终态 |
| Retry plan 状态机 | `RetryPlan` | `RetryPlanStatus` | 是 | retry 是否仍可执行 |
| Dead letter 状态机 | `DeadLetterEntry` | `DeadLetterStatus` | 是 | DLQ 处置状态 |
| Replay preparation 状态机 | `ReplayPreparation` | `ReplayPreparationStatus` | 是 | replay 前置材料状态 |
| Read projection 状态机 | `TransportViewProjection` / `FailureSummaryProjection` | `ProjectionStatus` | 是 | 只读投影可读性状态 |
| Backend capability | `BackendCapabilityRef` / `BackendCapabilityPolicy` | 无状态 enum | 否 | P0 不新增 `BackendCapabilityStatus` |

### 3.2 每个状态机的状态集合是什么？

状态集合在 §7.2~§7.8 分别展开。状态名严格使用 Step 6 的 Rust enum 变体：

- `Pending / Accepted / Rejected`
- `Scheduled / Dispatching / Delivered / Failed / DeadLettered / Completed`
- `Ack / Fail / Timeout / Duplicate`
- `Scheduled / Exhausted / Cancelled`
- `Open / Reviewing / Closed`
- `Draft / Ready / Rejected / Superseded`
- `Building / Active / Stale / Rebuilding`

### 3.3 哪些函数会触发状态转换？

触发函数必须来自 Step 6 的对象函数或 Step 9 的处理流入口。核心触发函数包括：

| 对象 | 触发函数 |
|---|---|
| `PublicationAcceptance` | `accept(ActorContext actor, Timestamp occurred_at, AuditRef audit_ref)`、`reject(PublicationRejectReason reason, ActorContext actor, AuditRef audit_ref)` |
| `DeliveryRecord` | `start_attempt(BackendCapabilityRef capability_ref, Timestamp occurred_at)`、`mark_delivered(DeliveryAttempt attempt, ActorContext actor)`、`mark_failed(FailureReason reason, ActorContext actor)`、`mark_completed(FeedbackResult feedback, ActorContext actor)`、`mark_dead_lettered(DeadLetterId dead_letter_id, ActorContext actor)` |
| `FeedbackResult` | `FeedbackResult::ack(...)`、`FeedbackResult::fail(...)`、`FeedbackResult::timeout(...)`、duplicate factory |
| `RetryPlan` | `RetryPlan::create(...)`、`mark_exhausted(ActorContext actor)`、`cancel(ActorContext actor, RecoveryReason reason)` |
| `DeadLetterEntry` | `DeadLetterEntry::from_failed_delivery(...)`、`start_review(ActorContext actor)`、`close(ActorContext actor, CloseReason reason)` |
| `ReplayPreparation` | `ReplayPreparation::prepare(...)`、`mark_ready(ReplayApprovalRef approval_ref, ActorContext actor)`、`reject(ReplayRejectReason reason, ActorContext actor)` |
| Projection | `mark_stale(AuditRef source_audit_ref)`、projection derive / rebuild 写入流程 |

### 3.4 每个转换的前置条件、副作用和错误是什么？

本步在 §7.2~§7.8 的转换矩阵中逐项列出。前置条件至少包含：

- 当前状态必须匹配 From。
- 触发函数的领域参数必须合法。
- application 必须在同一事务中写入对应 truth / history / audit。
- 不得让 backend raw status、projection 或 capability check 直接反写 delivery truth。

### 3.5 非法转换应该返回什么错误，是否写审计？

| 非法类型 | 错误类型 | 是否写审计 |
|---|---|---|
| 领域状态非法迁移 | `DomainError::InvalidStateTransition` | 写路径可写 rejected / conflict audit，由 Step 12 细化 |
| 幂等重复导致重复迁移 | 返回已有结果或 `ApplicationError::IdempotencyConflict` | 可写 duplicate audit |
| backend raw status 越界 | `BoundaryViolationError` / `DomainError::BoundaryViolation` | 必须写边界违规 audit |
| projection 反写真相 | `DomainError::ReadOnlyProjectionViolation` | 必须写边界违规 audit |
| 终态 reopen | `DomainError::TerminalStateReopenRejected` | 可写 conflict audit |

---

## 4. 当前文档问题诊断

| 问题 | 影响 | 本步处理 |
|---|---|---|
| Step 9 使用了 `draft / dispatched / timed_out` 等流程口语 | 与 Step 6 的 enum 变体不完全一致 | 本步统一使用 Step 6 enum 变体，并在矩阵中映射 `timed_out` 为 `FeedbackStatus::Timeout` + `DeliveryStatus::Failed` |
| 概要设计中提到 `DeliveryStatus.failed -> scheduled` 用于 retry | Step 6 enum 允许来源 / 去向支持该方向，但 Step 9 的 `RunRetryCycle` 更偏向由 retry 创建新 attempt | 本步保留 `Failed -> Scheduled` 作为 retry reschedule 迁移，但标注必须由 `RequestRetry` / `RunRetryCycle` 控制 |
| FeedbackStatus 是状态集合但没有多步生命周期 | 可能被误写成可迁移状态机 | 本步定义为一次生成即终态的状态集合 |
| ProjectionStatus 只读但仍有状态 | 可能被误认为能影响 delivery | 本步明确 projection 状态不能反写 bus truth |
| Backend capability check 会产生 health view | 可能被误加为 bus truth 状态机 | 本步明确 P0 不新增 `BackendCapabilityStatus` |

---

## 5. 改动前后对比

| 维度 | 改动前 | 改动后 |
|---|---|---|
| 状态名 | 概要 / Step 9 中存在口语化状态名 | 全部收敛为 Step 6 Rust enum 变体 |
| 状态流转 | 只有流程中的状态副作用 | 每个状态机都有 ASCII 图和转换矩阵 |
| 非法迁移 | 只列禁止迁移清单 | 每类非法迁移有错误类型和审计建议 |
| Feedback | 与 delivery 状态混写 | 独立定义为一次生成即终态的反馈结果集合 |
| Projection | 只说明不反写真相 | 明确 projection 状态流转和反写禁止 |

---

## 6. 设计取舍

### 6.1 timeout 是否新增 `DeliveryStatus::TimedOut`

| 方案 | 说明 | 结论 |
|---|---|---|
| 方案 A：新增 `TimedOut` | 能区分 timeout 和其他 failed | 不采用，本步不能暗改 Step 6 enum |
| 方案 B：timeout 表达为 `FeedbackStatus::Timeout`，delivery 进入 `DeliveryStatus::Failed` | 符合 Step 6 enum 和概要设计恢复口径 | 推荐 |
| 方案 C：timeout 不改 delivery 状态 | 会导致恢复判断缺少失败状态 | 不采用 |

推荐方案 B。timeout 是 feedback 归一化结果，delivery 主生命周期只需要进入 `Failed` 以便恢复链处理。

### 6.2 retry 是否允许 `DeliveryStatus::Failed -> Scheduled`

| 方案 | 说明 | 结论 |
|---|---|---|
| 方案 A：允许，由 retry plan 控制 | 符合 Step 6 `Failed` 允许去向和概要设计恢复图 | 推荐 |
| 方案 B：不允许，只新建 delivery | 会改变概要设计中 retry 继续推进同一 delivery 的口径 | 不采用 |
| 方案 C：允许直接 `Failed -> Dispatching` | 绕过 scheduled 阶段和 retry plan | 不采用 |

推荐方案 A。`Failed -> Scheduled` 只能由 retry 相关处理流触发，不能由普通 feedback 或 backend signal 直接触发。

### 6.3 FeedbackStatus 是否写转换矩阵

| 方案 | 说明 | 结论 |
|---|---|---|
| 方案 A：写完整 From / To 矩阵 | 会伪造不存在的生命周期 | 不采用 |
| 方案 B：写生成矩阵，From 为 `New`，To 为四种结果 | 推荐 |
| 方案 C：完全不写 | 实现者仍需知道 duplicate / timeout 如何处理 | 不采用 |

推荐方案 B。`FeedbackResult` 是事实结果，一次生成即终态。

---

## 7. 结构化中间产物

### 7.1 状态机总览

| 状态机 | 状态 enum | 拥有对象 | 主要触发流 | 是否影响 bus truth |
|---|---|---|---|---|
| Publication acceptance | `PublicationAcceptanceStatus` | `PublicationAcceptance` | `AcceptPublicationFlow`、`ConsumeCommittedOutboxFactFlow` | 是 |
| Delivery lifecycle | `DeliveryStatus` | `DeliveryRecord` | `RunDeliveryProgressionFlow`、`RecordDeliveryFeedbackFlow`、`ConsumeBackendDeliverySignalFlow`、`ConsumeTimeoutSignalFlow`、recovery flows | 是 |
| Feedback result | `FeedbackStatus` | `FeedbackResult` | `RecordDeliveryFeedbackFlow`、`ConsumeBackendDeliverySignalFlow`、`ConsumeTimeoutSignalFlow` | 是 |
| Retry plan | `RetryPlanStatus` | `RetryPlan` | `RequestRetryFlow`、`RunRetryCycleFlow` | 是 |
| Dead letter | `DeadLetterStatus` | `DeadLetterEntry` | `MoveDeliveryToDeadLetterFlow`、operator review flow | 是 |
| Replay preparation | `ReplayPreparationStatus` | `ReplayPreparation` | `PrepareReplayFlow` | 是 |
| Read projection | `ProjectionStatus` | `TransportViewProjection`、`FailureSummaryProjection` | `RunReadOutputProjectionFlow`、`RebuildReadProjectionFlow` | 否，只读投影 |

### 7.2 Publication acceptance 状态机

#### 7.2.1 状态集合

| 状态 | 作用 | 是否终态 | 允许的关键操作 |
|---|---|---|---|
| `Pending` | 接入判定尚未完成，不能进入 delivery 主线 | 否 | `accept(...)`、`reject(...)` |
| `Accepted` | 发布材料已被 bus 接受，可以进入 delivery 主线 | 是 | 只允许读取、派生 delivery schedule 材料 |
| `Rejected` | 发布材料已被拒绝，不能进入 delivery 主线 | 是 | 只允许读取、审计和错误返回 |

#### 7.2.2 状态转换图

```text
New PublicationAcceptance
  |
  v
Pending
  | accept(actor, occurred_at, audit_ref)
  v
Accepted

Pending
  | reject(reason, actor, audit_ref)
  v
Rejected
```

关键说明：

- `Accepted` 和 `Rejected` 都是接入判定终态。
- `Rejected` 不得进入 delivery 主线。
- 接入判定必须写 audit。

#### 7.2.3 状态转换矩阵

| From | To | 触发函数 | 前置条件 | 副作用 | 非法时错误 |
|---|---|---|---|---|---|
| `New` | `Pending` | `PublicationAcceptance::start_pending(PublicationMaterial material, ActorContext actor)` | material 已通过基本格式校验 | 创建接入事实 | `DomainError::InvalidPublicationMaterial` |
| `Pending` | `Accepted` | `accept(&mut self, ActorContext actor, Timestamp occurred_at, AuditRef audit_ref)` | payload boundary 通过；transport semantic 可形成 | 写 `accepted_at`、audit、可发布 `PublicationAcceptedEvent` | `DomainError::InvalidStateTransition` |
| `Pending` | `Rejected` | `reject(&mut self, PublicationRejectReason reason, ActorContext actor, AuditRef audit_ref)` | 有明确拒绝原因 | 写 `reject_reason`、audit、可发布 `PublicationRejectedEvent` | `DomainError::InvalidStateTransition` |

#### 7.2.4 非法转换处理

| 非法转换 | 处理方式 | 是否写审计 / 事件 |
|---|---|---|
| `Accepted -> Rejected` | 返回 `DomainError::InvalidStateTransition` | 可写 conflict audit，不发布 rejected event |
| `Rejected -> Accepted` | 返回 `DomainError::InvalidStateTransition` | 可写 conflict audit，不进入 delivery |
| `Accepted -> Pending` / `Rejected -> Pending` | 返回 `DomainError::TerminalStateReopenRejected` | 可写 conflict audit |
| `Rejected -> DeliveryStatus::Scheduled` | 返回 `DomainError::PublicationRejectedCannotScheduleDelivery` | 必须写边界违规 audit |

### 7.3 Delivery 生命周期状态机

#### 7.3.1 状态集合

| 状态 | 作用 | 是否终态 | 允许的关键操作 |
|---|---|---|---|
| `Scheduled` | Delivery 已计划，尚未开始投递 | 否 | `start_attempt(...)`、`mark_failed(...)` |
| `Dispatching` | Delivery 正在交给后端传输能力推进 | 否 | `mark_delivered(...)`、`mark_failed(...)` |
| `Delivered` | Delivery 已到达订阅方或等待反馈 | 否 | `mark_completed(...)`、`mark_failed(...)` |
| `Failed` | Delivery 投递或反馈失败，等待恢复判断 | 否 | retry reschedule、`mark_dead_lettered(...)` |
| `DeadLettered` | Delivery 已进入死信，后续只能通过受控恢复链处理 | 是 | 只允许读取、审计、replay preparation 前置检查 |
| `Completed` | Delivery 已完成，是正常终止状态 | 是 | 只允许读取、审计 |

#### 7.3.2 状态转换图

```text
New DeliveryRecord
  |
  v
Scheduled
  | start_attempt(capability_ref, occurred_at)
  v
Dispatching
  | mark_delivered(attempt, actor)
  v
Delivered
  | mark_completed(feedback_ack, actor)
  v
Completed

Scheduled
  | mark_failed(reason, actor)
  v
Failed

Dispatching
  | mark_failed(reason, actor)
  v
Failed

Delivered
  | mark_failed(reason, actor)
  v
Failed

Failed
  | retry reschedule by RequestRetry / RunRetryCycle
  v
Scheduled

Failed
  | mark_dead_lettered(dead_letter_id, actor)
  v
DeadLettered
```

关键说明：

- `Completed` 和 `DeadLettered` 是 delivery 终态，不能被普通 feedback 或 backend signal 重新打开。
- timeout 不新增 `DeliveryStatus::TimedOut`，而是 `FeedbackStatus::Timeout` + `DeliveryStatus::Failed`。
- backend raw status 必须经 adapter / policy 归一化后才能触发 delivery 转换。

#### 7.3.3 状态转换矩阵

| From | To | 触发函数 | 前置条件 | 副作用 | 非法时错误 |
|---|---|---|---|---|---|
| `New` | `Scheduled` | `DeliveryRecord::schedule(TransportSemantic semantic, SubscriberRef subscriber_ref, IdempotencyKey key)` | publication 已 `Accepted`；semantic 需要 durable delivery | 创建 delivery truth | `DomainError::PublicationNotAccepted` |
| `Scheduled` | `Dispatching` | `start_attempt(&mut self, BackendCapabilityRef capability_ref, Timestamp occurred_at)` | backend capability ref 可用；无 active attempt | 创建 `DeliveryAttempt`，写 history / audit | `DomainError::InvalidStateTransition` |
| `Scheduled` | `Failed` | `mark_failed(&mut self, FailureReason reason, ActorContext actor)` | 调度前发现不可投递或能力缺失 | 写 failure history / audit | `DomainError::InvalidStateTransition` |
| `Dispatching` | `Delivered` | `mark_delivered(&mut self, DeliveryAttempt attempt, ActorContext actor)` | attempt 已经由 backend result 归一化为 delivered | 写 delivered history / audit | `DomainError::InvalidStateTransition` |
| `Dispatching` | `Failed` | `mark_failed(&mut self, FailureReason reason, ActorContext actor)` | backend failure、timeout 或 dispatch failure 已归一化 | 写 failure history / audit，形成 recovery candidate | `DomainError::InvalidStateTransition` |
| `Delivered` | `Completed` | `mark_completed(&mut self, FeedbackResult feedback, ActorContext actor)` | `feedback.status == Ack` | 写 completed history / audit，发布 state changed event | `DomainError::FeedbackDoesNotCompleteDelivery` |
| `Delivered` | `Failed` | `mark_failed(&mut self, FailureReason reason, ActorContext actor)` | `FeedbackStatus::Fail` 或业务反馈失败引用 | 写 failure history / audit | `DomainError::InvalidStateTransition` |
| `Failed` | `Scheduled` | retry reschedule in `RequestRetryFlow` / `RunRetryCycleFlow` | 有 active `RetryPlanStatus::Scheduled` 且未耗尽 | 创建新 attempt 前置状态，写 retry audit | `DomainError::RetryNotAllowed` |
| `Failed` | `DeadLettered` | `mark_dead_lettered(&mut self, DeadLetterId dead_letter_id, ActorContext actor)` | `RecoveryEligibilityPolicy.can_dead_letter(...)` 通过 | 创建 DLQ，写 failure material / audit | `DomainError::DeadLetterNotAllowed` |

#### 7.3.4 非法转换处理

| 非法转换 | 处理方式 | 是否写审计 / 事件 |
|---|---|---|
| `Completed -> Dispatching` | 返回 `DomainError::TerminalStateReopenRejected` | 可写 conflict audit，不发布 delivery event |
| `DeadLettered -> Dispatching` | 返回 `DomainError::TerminalStateReopenRejected` | 必须写边界违规 audit |
| `Failed -> Completed` | 返回 `DomainError::InvalidStateTransition` | 可写 conflict audit |
| `Scheduled -> Completed` | 返回 `DomainError::InvalidStateTransition` | 不发布 completed event |
| backend raw status -> `DeliveryStatus::*` | 返回 `DomainError::BackendStatusNotNormalized` | 必须写边界违规 audit |
| late ack on `Failed` / `DeadLettered` | 返回 conflict / duplicate result，由 Step 12 细化 | 可写 late feedback audit |

### 7.4 Feedback 结果状态集合

#### 7.4.1 状态集合

| 状态 | 作用 | 是否终态 | 允许的关键操作 |
|---|---|---|---|
| `Ack` | 订阅方确认处理成功 | 是 | 推动 delivery `Delivered -> Completed` |
| `Fail` | 订阅方或投递链路返回失败 | 是 | 推动 delivery 进入 `Failed` |
| `Timeout` | Delivery 超过允许等待时间 | 是 | 推动 delivery 进入 `Failed` |
| `Duplicate` | 重复 delivery 或重复 feedback 被识别 | 是 | 返回已有结果，不修改 delivery |

#### 7.4.2 状态生成图

```text
Feedback input
  |
  +-- ack signal / command ------> Ack
  |
  +-- fail signal / command -----> Fail
  |
  +-- timeout signal ------------> Timeout
  |
  +-- idempotency duplicate -----> Duplicate
```

关键说明：

- `FeedbackStatus` 不是多步生命周期，一次生成即终态。
- `Duplicate` 不得改写 delivery 当前状态。
- `Timeout` 不新增 delivery timeout 状态，只推动 delivery 进入 `Failed`。

#### 7.4.3 状态生成矩阵

| From | To | 触发函数 | 前置条件 | 副作用 | 非法时错误 |
|---|---|---|---|---|---|
| `New` | `Ack` | `FeedbackResult::ack(DeliveryId delivery_id, ActorContext actor)` | delivery 可接受 ack；幂等未命中 | 可推动 `DeliveryStatus::Delivered -> Completed` | `DomainError::FeedbackNotAllowed` |
| `New` | `Fail` | `FeedbackResult::fail(DeliveryId delivery_id, FeedbackReason reason, ActorContext actor)` | reason 合法；幂等未命中 | 可推动 delivery 进入 `Failed` | `DomainError::FeedbackNotAllowed` |
| `New` | `Timeout` | `FeedbackResult::timeout(DeliveryId delivery_id, TimeoutReason reason, Timestamp occurred_at)` | timeout signal 合法；幂等未命中 | 可推动 delivery 进入 `Failed` | `DomainError::FeedbackNotAllowed` |
| `IdempotencyHit` | `Duplicate` | duplicate factory from `IdempotencyAnchor` | scope + key 命中已有结果 | 不改写 delivery | `ApplicationError::IdempotencyConflict` |

#### 7.4.4 非法转换处理

| 非法转换 | 处理方式 | 是否写审计 / 事件 |
|---|---|---|
| `Duplicate -> DeliveryStatus::Completed` | 返回已有结果，不改写 delivery | 可写 duplicate audit |
| `Ack` on `Failed` / `DeadLettered` | 返回 conflict / late feedback result | 可写 late feedback audit |
| `Fail` on `Completed` | 返回 conflict / ignored result | 可写 conflict audit |
| `Timeout` on terminal delivery | 返回 conflict / ignored result | 可写 timeout conflict audit |

### 7.5 Retry plan 状态机

#### 7.5.1 状态集合

| 状态 | 作用 | 是否终态 | 允许的关键操作 |
|---|---|---|---|
| `Scheduled` | 重试已计划，等待下一次尝试 | 否 | 执行 retry attempt、`mark_exhausted(...)`、`cancel(...)` |
| `Exhausted` | 重试次数已经耗尽，需要进入 dead-letter 判断 | 是 | 只允许读取和 DLQ 判断 |
| `Cancelled` | 重试计划已被取消，不得继续派发 | 是 | 只允许读取和审计 |

#### 7.5.2 状态转换图

```text
New RetryPlan
  |
  v
Scheduled
  | mark_exhausted(actor)
  v
Exhausted

Scheduled
  | cancel(actor, reason)
  v
Cancelled

Scheduled
  | retry attempt still has remaining attempts
  v
Scheduled
```

关键说明：

- retry attempt 后仍有剩余次数时，状态保持 `Scheduled`，只更新 attempt metadata。
- `Exhausted` 不自动进入 DLQ，必须由 `MoveDeliveryToDeadLetterFlow` 控制。
- `Cancelled` 不得继续触发 backend dispatch。

#### 7.5.3 状态转换矩阵

| From | To | 触发函数 | 前置条件 | 副作用 | 非法时错误 |
|---|---|---|---|---|---|
| `New` | `Scheduled` | `RetryPlan::create(DeliveryRecord delivery, FailureReason reason, RetryPolicyRef policy_ref)` | delivery 为 `Failed`；failure material 合法 | 创建 retry plan，写 audit | `DomainError::RetryNotAllowed` |
| `Scheduled` | `Scheduled` | `RetryPlan.mark_attempted(AttemptId attempt_id, BackendDeliveryResult result)` | 仍有剩余次数 | 更新 attempt metadata，保留 scheduled | `DomainError::RetryNotAllowed` |
| `Scheduled` | `Exhausted` | `mark_exhausted(&mut self, ActorContext actor)` | 已无剩余次数 | 写 exhausted audit，进入 DLQ 判断候选 | `DomainError::InvalidStateTransition` |
| `Scheduled` | `Cancelled` | `cancel(&mut self, ActorContext actor, RecoveryReason reason)` | cancel reason 合法 | 写 cancelled audit | `DomainError::InvalidStateTransition` |

#### 7.5.4 非法转换处理

| 非法转换 | 处理方式 | 是否写审计 / 事件 |
|---|---|---|
| `Exhausted -> Scheduled` | 返回 `DomainError::TerminalStateReopenRejected` | 可写 conflict audit |
| `Cancelled -> Scheduled` | 返回 `DomainError::TerminalStateReopenRejected` | 可写 conflict audit |
| `Exhausted -> Dispatching` | 返回 `DomainError::RetryExhaustedCannotDispatch` | 必须写恢复边界违规 audit |
| direct `RetryPlan` create on non-`Failed` delivery | 返回 `DomainError::RetryNotAllowed` | 可写 rejected recovery audit |

### 7.6 Dead letter 状态机

#### 7.6.1 状态集合

| 状态 | 作用 | 是否终态 | 允许的关键操作 |
|---|---|---|---|
| `Open` | 死信条目已打开，等待处理 | 否 | `start_review(...)`、`close(...)`、prepare replay 前置检查 |
| `Reviewing` | 死信条目正在审查 | 否 | `close(...)`、prepare replay 前置检查 |
| `Closed` | 死信条目已关闭 | 是 | 只允许读取和审计 |

#### 7.6.2 状态转换图

```text
New DeadLetterEntry
  |
  v
Open
  | start_review(actor)
  v
Reviewing
  | close(actor, reason)
  v
Closed

Open
  | close(actor, reason)
  v
Closed
```

关键说明：

- `Open` 是 DLQ 初始状态。
- `Closed` 后不得再创建新的 replay preparation。
- replay preparation 不等于 DLQ 关闭，二者由业务操作显式控制。

#### 7.6.3 状态转换矩阵

| From | To | 触发函数 | 前置条件 | 副作用 | 非法时错误 |
|---|---|---|---|---|---|
| `New` | `Open` | `DeadLetterEntry::from_failed_delivery(DeliveryRecord delivery, FailureMaterial material)` | delivery 为 `Failed`；failure material 合法 | 创建 DLQ 和 failure material | `DomainError::DeadLetterNotAllowed` |
| `Open` | `Reviewing` | `start_review(&mut self, ActorContext actor)` | actor 有操作权限引用；entry 未关闭 | 写 reviewing audit | `DomainError::InvalidStateTransition` |
| `Open` | `Closed` | `close(&mut self, ActorContext actor, CloseReason reason)` | close reason 合法 | 写 closed audit | `DomainError::InvalidStateTransition` |
| `Reviewing` | `Closed` | `close(&mut self, ActorContext actor, CloseReason reason)` | close reason 合法 | 写 closed audit | `DomainError::InvalidStateTransition` |

#### 7.6.4 非法转换处理

| 非法转换 | 处理方式 | 是否写审计 / 事件 |
|---|---|---|
| `Closed -> Open` | 返回 `DomainError::TerminalStateReopenRejected` | 可写 conflict audit |
| `Closed -> Reviewing` | 返回 `DomainError::TerminalStateReopenRejected` | 可写 conflict audit |
| non-`Failed` delivery -> `Open` | 返回 `DomainError::DeadLetterNotAllowed` | 必须写 recovery boundary audit |
| `Open / Reviewing -> Dispatching` | 返回 `DomainError::DeadLetterCannotDispatchDirectly` | 必须写边界违规 audit |

### 7.7 Replay preparation 状态机

#### 7.7.1 状态集合

| 状态 | 作用 | 是否终态 | 允许的关键操作 |
|---|---|---|---|
| `Draft` | 重放准备材料仍是草稿，不能执行 replay | 否 | `mark_ready(...)`、`reject(...)`、supersede |
| `Ready` | 重放准备材料已满足前置条件，可以进入后续 replay 执行边界 | 是 | 只允许读取、交给后续 replay executor |
| `Rejected` | 重放准备被拒绝 | 是 | 只允许读取和审计 |
| `Superseded` | 重放准备被新的准备材料替代 | 是 | 只允许读取和审计 |

#### 7.7.2 状态转换图

```text
New ReplayPreparation
  |
  v
Draft
  | mark_ready(approval_ref, actor)
  v
Ready

Draft
  | reject(reason, actor)
  v
Rejected

Draft
  | supersede(new_preparation_ref, actor)
  v
Superseded
```

关键说明：

- `Ready` 只表示 replay 前置材料完成，不表示 replay 已执行。
- replay preparation 必须依赖 dead letter、audit chain 和 approval ref。
- `Ready` 不得直接反向修改 delivery truth。

#### 7.7.3 状态转换矩阵

| From | To | 触发函数 | 前置条件 | 副作用 | 非法时错误 |
|---|---|---|---|---|---|
| `New` | `Draft` | `ReplayPreparation::prepare(DeadLetterEntry entry, ActorContext actor)` | dead letter 存在；audit chain 可验证 | 创建 replay preparation draft | `DomainError::ReplayPreparationNotAllowed` |
| `Draft` | `Ready` | `mark_ready(&mut self, ReplayApprovalRef approval_ref, ActorContext actor)` | approval ref 合法；audit chain 完整 | 写 ready audit，发布 `ReplayPreparationReadyEvent` | `DomainError::InvalidStateTransition` |
| `Draft` | `Rejected` | `reject(&mut self, ReplayRejectReason reason, ActorContext actor)` | reject reason 合法 | 写 rejected audit | `DomainError::InvalidStateTransition` |
| `Draft` | `Superseded` | `supersede(&mut self, ReplayPreparationRef new_ref, ActorContext actor)` | replacement ref 合法 | 写 superseded audit | `DomainError::InvalidStateTransition` |

#### 7.7.4 非法转换处理

| 非法转换 | 处理方式 | 是否写审计 / 事件 |
|---|---|---|
| `Ready -> Draft` | 返回 `DomainError::TerminalStateReopenRejected` | 可写 conflict audit |
| `Rejected -> Ready` | 返回 `DomainError::TerminalStateReopenRejected` | 可写 conflict audit |
| `Superseded -> Ready` | 返回 `DomainError::TerminalStateReopenRejected` | 可写 conflict audit |
| `Ready -> DeliveryStatus::Dispatching` | 返回 `DomainError::ReplayPreparationIsNotExecutor` | 必须写边界违规 audit |

### 7.8 Read projection 状态机

#### 7.8.1 状态集合

| 状态 | 作用 | 是否终态 | 允许的关键操作 |
|---|---|---|---|
| `Building` | 投影正在构建，通常不能作为稳定查询结果 | 否 | derive、upsert、mark stale |
| `Active` | 投影可被正常查询 | 否 | read、mark stale |
| `Stale` | 投影落后于 bus truth，查询必须返回一致性标记 | 否 | rebuild |
| `Rebuilding` | 投影正在重建 | 否 | replace batch、mark stale |

#### 7.8.2 状态转换图

```text
New Projection
  |
  v
Building
  | derive / upsert success
  v
Active
  | mark_stale(source_audit_ref)
  v
Stale
  | rebuild start
  v
Rebuilding
  | replace_batch success
  v
Active

Building
  | source truth changes before complete
  v
Stale

Rebuilding
  | rebuild source changed / partial failure
  v
Stale
```

关键说明：

- projection 状态不影响 bus truth。
- Query 遇到 `Stale` 返回 consistency marker，不自动 rebuild。
- `ProjectionStatus::* -> DeliveryStatus::*` 永远非法。

#### 7.8.3 状态转换矩阵

| From | To | 触发函数 | 前置条件 | 副作用 | 非法时错误 |
|---|---|---|---|---|---|
| `New` | `Building` | projection constructor / derive start | source audit 可读 | 创建 projection record | `DomainError::ProjectionSourceMissing` |
| `Building` | `Active` | projection upsert success | projection payload 通过 read-only policy | 可被 Query 正常读取 | `DomainError::ProjectionWriteRejected` |
| `Building` | `Stale` | `mark_stale(&mut self, AuditRef source_audit_ref)` | source truth 已变化 | Query 返回 stale marker | `DomainError::InvalidStateTransition` |
| `Active` | `Stale` | `mark_stale(&mut self, AuditRef source_audit_ref)` | source audit sequence 新于 projection version | Query 返回 stale marker | `DomainError::InvalidStateTransition` |
| `Stale` | `Rebuilding` | rebuild start in `RebuildReadProjectionFlow` | operator / job 触发 rebuild | 写 rebuild audit | `DomainError::InvalidStateTransition` |
| `Rebuilding` | `Active` | `ReadProjectionRepository.replace_batch(ProjectionBatch batch, UnitOfWorkHandle uow)` | batch 完整且版本匹配 | 替换 projection version | `DomainError::ProjectionVersionConflict` |
| `Rebuilding` | `Stale` | rebuild failed or source changed | 新 source audit 到达或 batch 部分失败 | 保持 stale marker | `DomainError::ProjectionRebuildFailed` |

#### 7.8.4 非法转换处理

| 非法转换 | 处理方式 | 是否写审计 / 事件 |
|---|---|---|
| `ProjectionStatus::* -> DeliveryStatus::*` | 返回 `DomainError::ReadOnlyProjectionViolation` | 必须写边界违规 audit |
| `Active -> Building` | 返回 `DomainError::InvalidStateTransition` | 可写 conflict audit |
| `Stale -> Active` without rebuild | 返回 `DomainError::ProjectionRebuildRequired` | 可写 projection conflict audit |
| projection write contains payload body / secret | 返回 `BoundaryViolationError` | 必须写边界违规 audit |

### 7.9 状态名标准化映射

本表用于把概要设计或 Step 9 中出现的流程口语映射为正式 Rust enum 变体。正式 `03-详细设计.md` 只能使用右侧状态名。

| 流程口语 / 旧表述 | 正式 enum 变体 | 说明 |
|---|---|---|
| `draft` for publication acceptance | `PublicationAcceptanceStatus::Pending` | 接入判定初始状态 |
| `accepted` | `PublicationAcceptanceStatus::Accepted` | 接入成功终态 |
| `rejected` | `PublicationAcceptanceStatus::Rejected` | 接入拒绝终态 |
| `scheduled` | `DeliveryStatus::Scheduled` 或 `RetryPlanStatus::Scheduled` | 需根据对象区分 |
| `dispatched` | `DeliveryStatus::Dispatching` | Step 6 正式状态名是 `Dispatching` |
| `delivered` | `DeliveryStatus::Delivered` | 后端已到达或等待反馈 |
| `timed_out` | `FeedbackStatus::Timeout` + `DeliveryStatus::Failed` | 不新增 `DeliveryStatus::TimedOut` |
| `dead_lettered` | `DeliveryStatus::DeadLettered` | delivery 主生命周期终态 |
| `created` for dead letter | `DeadLetterStatus::Open` | DLQ 初始状态 |
| `ready` | `ReplayPreparationStatus::Ready` | replay preparation 就绪 |
| `current` for projection | `ProjectionStatus::Active` | 可读 projection |
| `stale` | `ProjectionStatus::Stale` | 过期 projection |

### 7.10 跨状态机禁止规则

| 禁止规则 | 说明 | 错误类型 | 是否写审计 |
|---|---|---|---|
| `PublicationAcceptanceStatus::Rejected` 不得创建 `DeliveryStatus::Scheduled` | 被拒绝发布材料不能进入 delivery 主线 | `DomainError::PublicationRejectedCannotScheduleDelivery` | 是 |
| `FeedbackStatus::Duplicate` 不得修改 `DeliveryStatus` | 重复反馈只返回已有结果 | `ApplicationError::DuplicateFeedbackIgnored` | 可选 |
| backend raw status 不得直接写 `DeliveryStatus` | 必须经 `TransportBackendPort.normalize_signal(...)` | `DomainError::BackendStatusNotNormalized` | 是 |
| `RetryPlanStatus::Exhausted` 不得继续 dispatch | 必须进入 DLQ 判断 | `DomainError::RetryExhaustedCannotDispatch` | 是 |
| `DeadLetterStatus::Closed` 不得创建新的 replay preparation | 关闭的 DLQ 已终止处置 | `DomainError::DeadLetterClosed` | 可选 |
| `ReplayPreparationStatus::Ready` 不得直接写 `DeliveryStatus::Dispatching` | preparation 不是 replay executor | `DomainError::ReplayPreparationIsNotExecutor` | 是 |
| `ProjectionStatus::*` 不得反写任何 bus truth 状态 | projection 只读 | `DomainError::ReadOnlyProjectionViolation` | 是 |
| `CheckBackendCapabilityFlow` 不得修改 `DeliveryStatus` | capability check 只更新 health view / audit | `DomainError::BackendCapabilityCannotMutateDelivery` | 是 |

### 7.11 处理流与状态转换反查表

| 处理流 | 状态转换 | 触发对象 / 函数 | 备注 |
|---|---|---|---|
| `AcceptPublicationFlow` | `Pending -> Accepted` / `Pending -> Rejected` | `PublicationAcceptance.accept(...)` / `PublicationAcceptance.reject(...)` | payload boundary 决定 accepted 或 rejected |
| `ConsumeCommittedOutboxFactFlow` | `Pending -> Accepted` / `Pending -> Rejected` | `PublicationAcceptance.accept(...)` / `PublicationAcceptance.reject(...)` | 与 command 接入复用规则 |
| `RunOutboxRelayFlow` | 多条 publication acceptance 转换 | `PublicationAcceptanceService.accept_from_outbox_fact(...)` | job 本身不新增状态 |
| `RunDeliveryProgressionFlow` | `Scheduled -> Dispatching`、`Dispatching -> Delivered / Failed` | `DeliveryRecord.start_attempt(...)`、`mark_delivered(...)`、`mark_failed(...)` | 后端结果必须归一化 |
| `RecordDeliveryFeedbackFlow` | `Delivered -> Completed / Failed`；生成 `FeedbackStatus::*` | `FeedbackResult::*`、`DeliveryRecord.mark_completed(...)` / `mark_failed(...)` | duplicate 不改写 delivery |
| `ConsumeBackendDeliverySignalFlow` | `Dispatching -> Delivered / Failed`；生成 `FeedbackStatus::*` | `TransportBackendPort.normalize_signal(...)`、`DeliveryRecord` methods | raw backend status 不落库 |
| `ConsumeTimeoutSignalFlow` | `Dispatching -> Failed`；生成 `FeedbackStatus::Timeout` | `FeedbackResult::timeout(...)`、`DeliveryRecord.mark_failed(...)` | 不新增 delivery timeout 状态 |
| `RequestRetryFlow` | `New -> RetryPlanStatus::Scheduled`；可触发 `DeliveryStatus::Failed -> Scheduled` | `RetryPlan::create(...)` | 不调用 backend |
| `RunRetryCycleFlow` | `RetryPlanStatus::Scheduled -> Scheduled / Exhausted`；`DeliveryStatus::Scheduled -> Dispatching` | `RetryPlan.mark_attempted(...)`、`mark_exhausted(...)`、`DeliveryRecord.start_attempt(...)` | exhausted 不自动进 DLQ |
| `MoveDeliveryToDeadLetterFlow` | `DeliveryStatus::Failed -> DeadLettered`；`New -> DeadLetterStatus::Open` | `DeliveryRecord.mark_dead_lettered(...)`、`DeadLetterEntry::from_failed_delivery(...)` | 不触发 replay 执行 |
| `PrepareReplayFlow` | `New -> Draft -> Ready / Rejected / Superseded` | `ReplayPreparation::prepare(...)`、`mark_ready(...)`、`reject(...)` | ready 不是 replay execution |
| `RunReadOutputProjectionFlow` | `Building -> Active`、`Active -> Stale` | projection derive / `mark_stale(...)` | 不改写 truth |
| `RebuildReadProjectionFlow` | `Stale -> Rebuilding -> Active / Stale` | `ReadProjectionRepository.replace_batch(...)` | 受控重建 |
| `CheckBackendCapabilityFlow` | 无 bus truth 状态变化 | `TransportBackendPort.check_capability(...)` | 只更新 backend health projection |
| `QueryReadOnlyFlow` | 无状态变化 | `ReadOnlyOutputPolicy.allows_read(...)` | 不写事务 |
| `OutboundEventPublishFlow` | 无 truth 状态变化 | `OutboxPublisherPort.publish(...)` | publish failure 不回滚 truth |

### 7.12 状态迁移实现约束

| 约束 | 实现要求 |
|---|---|
| 状态变更必须由对象成员函数触发 | application service 不得直接改 `status` 字段 |
| 每次 delivery 状态变化必须写 history | `DeliveryHistoryEntry::transition(...)` 与 truth 写入同事务 |
| 终态不得 reopen | `Completed`、`DeadLettered`、`Accepted`、`Rejected` 等终态不允许回退 |
| raw backend status 必须归一化 | 只能通过 `TransportBackendPort.normalize_signal(...)` 输出 bus result |
| Query 不触发状态变化 | Query 遇到 stale / missing projection 返回 consistency marker |
| Projection 不反写真相 | projection 状态变化只能影响 read output |

---

## 8. 回填草稿

正式 `03-详细设计.md` 的 §9 按以下方式回填：

```md
## 9. 状态机与转换矩阵

### 9.1 状态机总览

从 `design-calibration/03_ddd_step_10_state_matrix.md` §7.1 摘录。

### 9.2 Publication acceptance 状态机

从 `design-calibration/03_ddd_step_10_state_matrix.md` §7.2 摘录。

### 9.3 Delivery 生命周期状态机

从 `design-calibration/03_ddd_step_10_state_matrix.md` §7.3 摘录。

### 9.4 Feedback 结果状态集合

从 `design-calibration/03_ddd_step_10_state_matrix.md` §7.4 摘录。

### 9.5 Retry plan 状态机

从 `design-calibration/03_ddd_step_10_state_matrix.md` §7.5 摘录。

### 9.6 Dead letter 状态机

从 `design-calibration/03_ddd_step_10_state_matrix.md` §7.6 摘录。

### 9.7 Replay preparation 状态机

从 `design-calibration/03_ddd_step_10_state_matrix.md` §7.7 摘录。

### 9.8 Read projection 状态机

从 `design-calibration/03_ddd_step_10_state_matrix.md` §7.8 摘录。

### 9.9 跨状态机禁止规则

从 `design-calibration/03_ddd_step_10_state_matrix.md` §7.9~§7.12 摘录。
```

说明：

- 正式文档必须使用 Step 6 enum 变体名，不使用 Step 9 的流程口语。
- Step 11 需要以本步转换矩阵为输入，继续定义事务、锁和一致性。
- Step 12 需要以本步非法转换表为输入，继续定义错误模型和异常分支。
- Step 16 需要以本步转换矩阵为输入，继续定义状态转换测试。

---

## 9. 待确认事项

| 待确认事项 | 方案 | 推荐 | 原因 |
|---|---|---|---|
| 是否新增 `DeliveryStatus::TimedOut` | A. 新增；B. 不新增，用 `FeedbackStatus::Timeout` + `DeliveryStatus::Failed` | 推荐 B | 符合 Step 6 enum，避免暗改对象契约 |
| retry attempt 成功但仍需等待 feedback 时 RetryPlan 是否新增 `Running` | A. 新增；B. 保持 `Scheduled` 并更新 attempt metadata；C. 改由 DeliveryStatus 表达 | 推荐 B | Step 6 未定义 `Running`，retry plan 只表达计划是否有效 |
| backend capability 是否新增状态机 | A. 新增 `BackendCapabilityStatus`；B. 不新增，只更新 backend health projection | 推荐 B | P0 不把能力检查变成 bus truth 状态机 |
| Query stale projection 是否自动触发 `Rebuilding` | A. 自动触发；B. 返回 consistency marker，由 job / operator 触发 rebuild | 推荐 B | Query 不应产生隐藏写副作用 |
| `DeadLetterStatus::Closed` 后是否允许 PrepareReplay | A. 允许；B. 不允许；C. 需要 governance override | 推荐 B | closed 表示 DLQ 处置终止；override 需要另行设计 |

---

## 10. 进入下一步条件

```text
所有正式状态机已列出状态集合、ASCII 状态转换图、转换矩阵和非法转换处理。
状态名已经统一为 Step 6 Rust enum 变体。
每个触发函数都能回指 Step 6 对象函数或 Step 9 处理流。
可以进入 Step 11,定义持久化、事务与一致性契约。
```
