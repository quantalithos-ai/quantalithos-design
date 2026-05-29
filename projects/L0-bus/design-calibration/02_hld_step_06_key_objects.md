## Step 6. 关键对象轮廓

### 1. Step 状态

- 状态：[x] 已确认
- 对应 SOP：`standards/document/概要设计讨论流程_SOP.md` Step 6
- 回填章节：`projects/L0-bus/02-概要设计.md` §6 关键对象轮廓

### 2. 本步输入

- 上游文档：
  - `projects/L0-bus/00-需求文档.md`
  - `projects/L0-bus/01-架构设计.md`
  - `projects/L0-bus/design-calibration/02_hld_step_04_code_subject_framework.md`
  - `projects/L0-bus/design-calibration/02_hld_step_05_components_boundary.md`
- 已确认结论：
  - Step 5 已确认六个主要组成部分，并补充对象发现维度表。
  - 本步必须从 Step 5 的对象候选池出发，完成对象正式化筛选。
  - 本步按对象组织，不按主要组成部分嵌套，也不把多个正式对象合并成对象组。
  - API、repository、port、trigger、DTO 的完整契约留给 Step 7 和详细设计。
  - 本步只写概要设计层字段、状态、成员函数和工厂函数骨架，不写完整 Rust 签名、数据库列、JSON / proto schema 或实现代码。

### 3. SOP 问题回答

1. 哪些对象如果不在概要设计层点名，详细设计会重新发明主语？

   回答：必须点名 publication、delivery、feedback、recovery、audit、projection、backend capability 相关对象。特别是 `DeliveryAttempt`、`FeedbackResult`、`IdempotencyAnchor`、`DeliveryHistoryEntry`、`FailureMaterial` 不能再合并进对象组，因为它们后续会分别承接字段、状态、函数、幂等、历史和边界规则。

2. Step 5 的对象候选池中，哪些候选对象正式进入本步独立展开？

   回答：正式进入本步的对象包括：`PublicationMaterial`、`PublicationAcceptance`、`TransportSemantic`、`PayloadBoundaryGuard`、`DeliveryRecord`、`DeliveryAttempt`、`DeliveryLifecycle`、`FeedbackResult`、`IdempotencyAnchor`、`DeliveryHistoryEntry`、`RetryPlan`、`DeadLetterEntry`、`ReplayPreparation`、`FailureMaterial`、`RecoveryEligibilityPolicy`、`BusAuditEntry`、`TransportViewProjection`、`FailureSummaryProjection`、`ReadOnlyOutputPolicy`、`BackendCapabilityRef`、`BackendCapabilityPolicy`。

3. Step 5 的对象候选池中，哪些名称只是字段类型、DTO、port、repository、API、trigger 或实现细节，不应作为关键对象展开？

   回答：`CoreEventRef`、`PayloadRef`、`OutboxFactRef`、`IdempotencyKey`、`RecordRef`、`RetryPolicyRef`、`AuditChainRef`、`ReplayApprovalRef`、`BackendDeliveryRef` 作为字段类型或引用类型出现，不在本步独立成节。`BusCommandApi`、`DeliveryFeedbackApi`、`RecoveryOperationsApi`、`BusQueryApi`、`OutboxRelayTrigger`、`DeliveryWorkerTrigger`、`ReadOutputWorkerTrigger`、各 repository、`TransportBackendPort`、`ClockPort`、`IdGeneratorPort`、`UnitOfWork` 留给 Step 7 或详细设计。

4. 每个对象属于哪个主要组成部分？

   回答：每个对象通过基本信息表中的“所属部分”回指 Step 5 的六个主要组成部分。跨部分对象按主责任归口，例如 `DeliveryHistoryEntry` 归“结果反馈与幂等留痕”，`BusAuditEntry` 归“审计、历史与只读输出”。

5. 每个对象是什么类型？

   回答：本步使用 domain aggregate / record、domain value object、state rule、policy / guard、projection、reference object、audit record、history record 等类型。Application service、API、repository、port 不作为领域对象展开。

6. 每个对象至少需要哪些关键字段骨架？

   回答：只保留详细设计必须承接的关键字段，例如 id、status、reference、actor、trace、timestamp、history ref、audit ref、backend capability ref。不列完整字段全集。

7. 每个关键字段分别是什么类型，且每个字段的作用是什么？

   回答：字段表统一使用 `字段 / 类型 / 作用` 三列，类型使用概要设计层类型名，例如 `DeliveryId`、`PublicationId`、`FeedbackStatus`、`ActorContext`。

8. 哪些对象存在状态集合，且每个状态的作用是什么？

   回答：`PublicationAcceptance`、`DeliveryRecord`、`FeedbackResult`、`RetryPlan`、`DeadLetterEntry`、`ReplayPreparation`、`TransportViewProjection`、`FailureSummaryProjection` 存在状态集合。完整状态流转由 Step 9 统一收口。

9. 每个对象有哪些成员函数骨架，且每个函数的作用是什么？

   回答：成员函数只表达对象自身的不变量判断、状态变化和边界判断，不写返回类型和实现体。

10. 每个对象有哪些工厂函数骨架，且每个工厂函数的作用是什么？

    回答：工厂函数用于从 command、已提交 fact、feedback、delivery、audit 或持久化记录构造对象。

11. 每个成员函数 / 工厂函数的参数分别是什么类型？

    回答：函数参数必须写成 `TypeName param_name`，不得写裸参数名。

12. 哪些对象虽然已经在 Step 5 被列为代码主体 / 模块，但仍必须在本步独立展开对象骨架？

    回答：所有 Step 5 标记为 `Step 6 必须独立展开` 的对象都必须独立成节。本次不再把 `DeliveryAttempt`、`FeedbackResult`、`IdempotencyAnchor`、`RetryPlan`、`DeadLetterEntry`、`ReplayPreparation`、`FailureMaterial`、projection 和 policy 合并成组合表。

13. Step 8 处理流或 Step 9 状态机预计会使用哪些对象，它们是否已经在本步正式定义？

    回答：Step 8 / Step 9 会使用 `PublicationAcceptance`、`DeliveryRecord`、`DeliveryAttempt`、`FeedbackResult`、`IdempotencyAnchor`、`RetryPlan`、`DeadLetterEntry`、`ReplayPreparation`、`BusAuditEntry`、`DeliveryHistoryEntry`、`TransportViewProjection`、`FailureSummaryProjection` 等对象。本步必须全部定义。

14. 哪些字段、函数或结构已经属于详细设计，不应在本步写完整？

    回答：完整 Rust struct / enum、derive、trait 约束、repository trait、DTO schema、错误枚举全集、数据库字段、索引、事务代码、序列化字段名和 adapter 私有参数都不在本步展开。

### 4. 当前文档问题诊断

| 位置 | 当前问题 | 影响 |
|---|---|---|
| 旧 Step 6 §7.6 | `DeliveryAttempt`、`FeedbackResult`、`IdempotencyAnchor` 被合并成一个对象组 | 详细设计无法逐对象承接字段、状态、函数和禁止事项 |
| 旧 Step 6 §7.7 | `RetryPlan`、`DeadLetterEntry`、`ReplayPreparation` 被合并成一个对象组 | 失败恢复状态和 replay 前置条件不够稳定 |
| 旧 Step 6 §7.8 / §7.9 | failure、audit、history、projection、backend ref 多个正式对象被压缩成组合表 | 只读输出、审计和后端能力边界容易被误解 |
| 旧 Step 6 | 没有对象候选池筛选说明 | 看不出哪些候选对象被正式化，哪些只是字段类型或端口 |
| 旧 Step 6 | 缺少 Step 8 / Step 9 反查清单 | 处理流和状态机可能继续隐式发明对象 |

### 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 对象来源 | 从 Step 5 名称清单直接抽取 | 先基于对象发现维度形成候选池，再筛选正式对象 | 避免靠名词感觉抽象 |
| 对象粒度 | 多个正式对象合并成对象组 | 每个正式对象独立成节 | 支撑详细设计一比一承接 |
| 非对象处理 | API / port / repository 边界说明不够系统 | 单独列入候选池筛选说明 | 避免把接口或端口误写成领域对象 |
| 后续反查 | 没有反查 Step 8 / Step 9 | 增加对象反查清单 | 防止处理流和状态机隐式新增对象 |
| 字段和函数 | 部分对象没有独立字段 / 函数表 | 每个对象按需给字段、状态、成员函数、工厂函数、禁止事项 | 符合新版规范 |

### 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A：保留旧版组合表 | 文档较短 | 不满足对象独立成节要求，详细设计仍需重做对象判断 | 不采用 |
| 方案 B：把 Step 5 所有名称都展开成对象 | 最完整 | 会把 API、port、repository、字段类型、实现细节都误写成领域对象 | 不采用 |
| 方案 C：从 Step 5 候选池筛选正式对象，未来代码主体对象独立成节，端口和 DTO 留给后续章节 | 粒度稳定，能支撑详细设计 | 文档较长 | 采用 |

### 7. 结构化中间产物

#### 7.1 对象候选池筛选说明

| 候选名称 | 来源维度 | 筛选结论 | 原因 |
|---|---|---|---|
| `PublicationMaterial` | reference / boundary | 正式关键对象 | 发布材料引用和禁止正文边界需要稳定 |
| `PublicationAcceptance` | truth / state | 正式关键对象 | bus 接入事实和 accepted / rejected 状态需要稳定 |
| `TransportSemantic` | value object / boundary | 正式关键对象 | 平台传递语义不能由后端裸参数替代 |
| `PayloadBoundaryGuard` | policy / invariant | 正式关键对象 | 禁止正文边界需要集中判断 |
| `DeliveryRecord` | truth / state | 正式关键对象 | delivery 真相和生命周期核心对象 |
| `DeliveryAttempt` | truth / history | 正式关键对象 | 单次投递尝试影响失败、重试和审计 |
| `DeliveryLifecycle` | policy / state rule | 正式关键对象 | 状态迁移规则不能散落在 worker 中 |
| `FeedbackResult` | truth / state | 正式关键对象 | ack / fail / timeout / duplicate 是 bus 级结果事实 |
| `IdempotencyAnchor` | truth / invariant | 正式关键对象 | 支撑 delivery / feedback 幂等 |
| `DeliveryHistoryEntry` | history | 正式关键对象 | delivery 状态变化必须可追溯 |
| `RetryPlan` | truth / state | 正式关键对象 | retry 是否等待、耗尽或取消需要稳定 |
| `DeadLetterEntry` | truth / state | 正式关键对象 | DLQ 是 recovery 和 replay 的前置材料 |
| `ReplayPreparation` | truth / state | 正式关键对象 | replay 前置链必须可审计 |
| `FailureMaterial` | read material / boundary | 正式关键对象 | failure material 不能被误当 governance decision |
| `RecoveryEligibilityPolicy` | policy / invariant | 正式关键对象 | retry / DLQ / replay 允许性需要集中判断 |
| `BusAuditEntry` | audit | 正式关键对象 | 关键状态变化必须留痕 |
| `TransportViewProjection` | projection | 正式关键对象 | 面向 SDK / consumer 的只读视图 |
| `FailureSummaryProjection` | projection | 正式关键对象 | 面向 governance / operator 的只读失败摘要 |
| `ReadOnlyOutputPolicy` | policy / invariant | 正式关键对象 | 防止 projection 反写 truth |
| `BackendCapabilityRef` | reference / boundary | 正式关键对象 | 后端能力只保存引用和版本，不保存 secret |
| `BackendCapabilityPolicy` | policy / invariant | 正式关键对象 | 防止后端能力差异泄漏成平台语义 |
| `CoreEventRef` / `PayloadRef` / `OutboxFactRef` | reference field | 字段类型 | 在 `PublicationMaterial` 中作为字段表达 |
| `IdempotencyKey` / `RecordRef` | field / key | 字段类型 | 在幂等对象和接口中使用，不独立展开 |
| `RetryPolicyRef` / `AuditChainRef` / `ReplayApprovalRef` | reference field | 字段类型 | 在 recovery 对象中作为字段表达 |
| `BackendDeliveryRef` | reference field | 字段类型 | 在 `DeliveryAttempt` 中表达，不保存后端响应正文 |
| `BusCommandApi` / `DeliveryFeedbackApi` / `RecoveryOperationsApi` / `BusQueryApi` | API | 留给 Step 7 | 属于接口骨架，不是领域对象 |
| repository / port / trigger / `UnitOfWork` | port / infra | 留给 Step 7 / 详细设计 | 属于端口和实现边界，不作为本步领域对象 |

#### 7.2 关键对象分布表

| 主要组成部分 | 关键对象 |
|---|---|
| 发布材料接入与传递语义形成 | `PublicationMaterial`、`PublicationAcceptance`、`TransportSemantic`、`PayloadBoundaryGuard` |
| 订阅 delivery 推进 | `DeliveryRecord`、`DeliveryAttempt`、`DeliveryLifecycle` |
| 结果反馈与幂等留痕 | `FeedbackResult`、`IdempotencyAnchor`、`DeliveryHistoryEntry` |
| 失败恢复与重放准备 | `RetryPlan`、`DeadLetterEntry`、`ReplayPreparation`、`FailureMaterial`、`RecoveryEligibilityPolicy` |
| 审计、历史与只读输出 | `BusAuditEntry`、`TransportViewProjection`、`FailureSummaryProjection`、`ReadOnlyOutputPolicy` |
| 存储、引用与后端适配边界 | `BackendCapabilityRef`、`BackendCapabilityPolicy` |

本章默认不画对象分布图。上表已经能表达对象归属，额外画图容易误读成类图、ER 图或实现依赖图。

#### 7.3 `PublicationMaterial`

| 项 | 内容 |
|---|---|
| 所属部分 | 发布材料接入与传递语义形成 |
| 对象类型 | domain value object / reference object |
| 主要责任 | 表达发布方提交给 bus 的材料引用、契约引用和上下文，不保存业务正文 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `publication_id` | `PublicationId` | 标识一次发布材料 |
| `core_event_ref` | `CoreEventRef` | 指向 `L0-core` 契约事件 |
| `payload_ref` | `PayloadRef` | 指向发布方 payload 正文 |
| `outbox_fact_ref` | `OptionalOutboxFactRef` | 指向已提交 outbox fact |
| `actor` | `ActorContext` | 表达发布发起者 |
| `trace_ref` | `TraceContextRef` | 关联跨仓 trace |

| 状态 | 作用 |
|---|---|
| 无独立状态 | 是否可接入由 `PublicationAcceptance` 表达 |

| 成员函数 | 作用 |
|---|---|
| `has_core_contract()` | 判断是否具备 core 契约引用 |
| `has_payload_reference()` | 判断是否只保存 payload 引用而不是正文 |
| `is_from_outbox()` | 判断材料是否来自 outbox relay |

| 工厂函数 | 作用 |
|---|---|
| `PublicationMaterial::from_publish_command(PublishMaterialCommand command, ActorContext actor, CommandMetadata meta)` | 从发布命令构造发布材料 |
| `PublicationMaterial::from_outbox_fact(CommittedOutboxFact fact, ActorContext actor, CommandMetadata meta)` | 从已提交 outbox fact 构造发布材料 |

| 禁止事项 | 说明 |
|---|---|
| 保存 payload body | bus 只持有 `PayloadRef` |
| 重新定义 core event | 只能引用 `CoreEventRef` |

#### 7.4 `PublicationAcceptance`

| 项 | 内容 |
|---|---|
| 所属部分 | 发布材料接入与传递语义形成 |
| 对象类型 | domain record |
| 主要责任 | 记录发布材料是否被 bus 接受，以及拒绝原因 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `acceptance_id` | `PublicationAcceptanceId` | 标识接入事实 |
| `publication_id` | `PublicationId` | 关联发布材料 |
| `status` | `PublicationAcceptanceStatus` | 表达 pending / accepted / rejected |
| `reject_reason` | `OptionalPublicationRejectReason` | 记录拒绝原因 |
| `accepted_at` | `OptionalTimestamp` | 记录接入成功时间 |
| `audit_ref` | `AuditRef` | 关联审计条目 |

| 状态 | 作用 |
|---|---|
| `pending` | 接入校验尚未完成 |
| `accepted` | 材料可进入传递链 |
| `rejected` | 材料被拒绝且不能进入传递链 |

| 成员函数 | 作用 |
|---|---|
| `accept(ActorContext actor, Timestamp occurred_at)` | 标记材料被接受 |
| `reject(PublicationRejectReason reason, ActorContext actor)` | 标记材料被拒绝 |
| `is_accepted()` | 判断是否可进入 delivery 推进 |

| 工厂函数 | 作用 |
|---|---|
| `PublicationAcceptance::start(PublicationMaterial material, ActorContext actor)` | 开始接入判定 |
| `PublicationAcceptance::rehydrate(PersistedPublicationAcceptance row)` | 从持久化记录重建 |

| 禁止事项 | 说明 |
|---|---|
| 跳过审计 | 接受或拒绝都必须关联审计 |
| rejected 后进入 delivery | 被拒绝材料不能进入传递链 |

#### 7.5 `TransportSemantic`

| 项 | 内容 |
|---|---|
| 所属部分 | 发布材料接入与传递语义形成 |
| 对象类型 | domain value object |
| 主要责任 | 表达与具体后端无关的平台级传递语义 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `semantic_id` | `TransportSemanticId` | 标识一组传递语义 |
| `publication_id` | `PublicationId` | 关联发布材料 |
| `delivery_mode` | `DeliveryMode` | 表达 at-least-once 等平台语义 |
| `target_scope` | `SubscriberScope` | 表达订阅目标范围 |
| `backend_capability_ref` | `BackendCapabilityRef` | 指向后端能力引用 |

| 状态 | 作用 |
|---|---|
| 无独立状态 | 作为值对象随接入和 delivery 使用 |

| 成员函数 | 作用 |
|---|---|
| `requires_durable_record()` | 判断是否需要持久化 delivery 记录 |
| `matches_scope(SubscriberScope scope)` | 判断订阅范围是否匹配 |
| `uses_backend(BackendCapabilityRef capability_ref)` | 判断是否绑定某后端能力引用 |

| 工厂函数 | 作用 |
|---|---|
| `TransportSemantic::derive(PublicationMaterial material, BackendCapabilityRef capability_ref)` | 从发布材料和后端能力引用推导平台语义 |

| 禁止事项 | 说明 |
|---|---|
| 保存后端裸参数 | 只保存平台语义和能力引用 |
| 表达业务路由正文 | 业务语义由发布方或业务域承担 |

#### 7.6 `PayloadBoundaryGuard`

| 项 | 内容 |
|---|---|
| 所属部分 | 发布材料接入与传递语义形成 |
| 对象类型 | policy / guard |
| 主要责任 | 判断发布材料是否试图把业务正文或禁止正文带入 bus |

| 字段 | 类型 | 作用 |
|---|---|---|
| `forbidden_body_policy_ref` | `ForbiddenBodyPolicyRef` | 指向禁止正文策略口径 |

| 状态 | 作用 |
|---|---|
| 无独立状态 | 只表达允许性判断 |

| 成员函数 | 作用 |
|---|---|
| `rejects_body(PublicationMaterial material)` | 判断发布材料是否携带禁止正文 |
| `allows_reference(PayloadRef payload_ref)` | 判断 payload 引用是否可接受 |

| 工厂函数 | 作用 |
|---|---|
| `PayloadBoundaryGuard::default_for_bus()` | 创建 bus 默认禁止正文检查策略 |

| 禁止事项 | 说明 |
|---|---|
| 解析 payload body | guard 只判断边界，不解释业务正文 |
| 替代安全入口 | 认证和授权实现不在本对象内完成 |

#### 7.7 `DeliveryRecord`

| 项 | 内容 |
|---|---|
| 所属部分 | 订阅 delivery 推进 |
| 对象类型 | domain aggregate / record |
| 主要责任 | 保存 bus 拥有的 delivery 真相、目标订阅方、状态和尝试摘要 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `delivery_id` | `DeliveryId` | 标识一次 delivery |
| `publication_id` | `PublicationId` | 关联发布材料 |
| `subscriber_ref` | `SubscriberRef` | 标识目标订阅方 |
| `status` | `DeliveryStatus` | 表达 delivery 生命周期状态 |
| `attempt_count` | `AttemptCount` | 记录尝试次数 |
| `idempotency_key` | `IdempotencyKey` | 支撑 delivery 幂等 |
| `last_attempt_ref` | `OptionalDeliveryAttemptRef` | 关联最近一次尝试 |

| 状态 | 作用 |
|---|---|
| `scheduled` | 已计划 delivery，尚未开始投递 |
| `dispatching` | 正在交给后端推进 |
| `delivered` | 已交付给订阅方或等待反馈 |
| `failed` | 投递或反馈失败，等待恢复判断 |
| `dead_lettered` | 已进入死信 |
| `completed` | delivery 完成 |

| 成员函数 | 作用 |
|---|---|
| `start_attempt(BackendCapabilityRef capability_ref, Timestamp occurred_at)` | 开始一次投递尝试 |
| `mark_delivered(DeliveryAttempt attempt, ActorContext actor)` | 标记投递已送达 |
| `mark_failed(FailureReason reason, ActorContext actor)` | 标记投递失败 |
| `mark_completed(FeedbackResult feedback, ActorContext actor)` | 根据 ack 反馈标记完成 |
| `can_transition_to(DeliveryStatus target_status)` | 判断状态转移是否允许 |

| 工厂函数 | 作用 |
|---|---|
| `DeliveryRecord::schedule(TransportSemantic semantic, SubscriberRef subscriber_ref, IdempotencyKey key)` | 基于传递语义创建 delivery |
| `DeliveryRecord::rehydrate(PersistedDeliveryRecord row)` | 从持久化记录重建 |

| 禁止事项 | 说明 |
|---|---|
| 保存订阅方业务结果正文 | 只保存总线级结果和引用 |
| 直接调用 MQ SDK | 后端调用必须经 `TransportBackendPort` |
| completed 后重新 dispatch | 重放必须走 replay preparation |

#### 7.8 `DeliveryAttempt`

| 项 | 内容 |
|---|---|
| 所属部分 | 订阅 delivery 推进 |
| 对象类型 | domain record |
| 主要责任 | 表达一次后端投递尝试及其归一化结果引用 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `attempt_id` | `DeliveryAttemptId` | 标识一次尝试 |
| `delivery_id` | `DeliveryId` | 关联 delivery |
| `attempt_no` | `AttemptNo` | 表示第几次尝试 |
| `backend_ref` | `OptionalBackendDeliveryRef` | 关联后端投递结果引用 |
| `started_at` | `Timestamp` | 记录尝试开始时间 |
| `finished_at` | `OptionalTimestamp` | 记录尝试结束时间 |

| 状态 | 作用 |
|---|---|
| 无独立生命周期 | 结果通过 `DeliveryRecord` 和 `FeedbackResult` 推进 |

| 成员函数 | 作用 |
|---|---|
| `finish(BackendDeliveryResult result, Timestamp occurred_at)` | 记录后端投递结果引用和结束时间 |
| `is_finished()` | 判断尝试是否结束 |

| 工厂函数 | 作用 |
|---|---|
| `DeliveryAttempt::start(DeliveryRecord delivery, BackendCapabilityRef capability_ref)` | 为 delivery 创建一次投递尝试 |
| `DeliveryAttempt::rehydrate(PersistedDeliveryAttempt row)` | 从持久化记录重建 |

| 禁止事项 | 说明 |
|---|---|
| 保存后端完整私有响应正文 | 只能保存归一化结果或引用 |
| 直接改变 delivery 最终状态 | delivery 状态由 `DeliveryRecord` / `DeliveryLifecycle` 处理 |

#### 7.9 `DeliveryLifecycle`

| 项 | 内容 |
|---|---|
| 所属部分 | 订阅 delivery 推进 |
| 对象类型 | state rule / policy |
| 主要责任 | 约束 delivery 状态迁移，防止 worker 直接改状态 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `allowed_transitions_ref` | `DeliveryTransitionRuleRef` | 指向允许迁移规则 |

| 状态 | 作用 |
|---|---|
| 无独立状态 | 规则对象不持有业务状态 |

| 成员函数 | 作用 |
|---|---|
| `can_transition(DeliveryStatus from_status, DeliveryStatus to_status)` | 判断状态迁移是否允许 |
| `rejects_reopen(DeliveryRecord delivery)` | 判断是否拒绝完成后重新打开 |
| `requires_history(DeliveryStatus from_status, DeliveryStatus to_status)` | 判断迁移是否必须写 history |

| 工厂函数 | 作用 |
|---|---|
| `DeliveryLifecycle::default_for_bus()` | 创建默认 delivery 生命周期规则 |

| 禁止事项 | 说明 |
|---|---|
| 直接保存状态 | 状态保存在 `DeliveryRecord` |
| 根据后端裸状态直接迁移 | 后端状态必须先归一化 |

#### 7.10 `FeedbackResult`

| 项 | 内容 |
|---|---|
| 所属部分 | 结果反馈与幂等留痕 |
| 对象类型 | domain record |
| 主要责任 | 表达 ack / fail / timeout / duplicate 等 bus 级反馈结果 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `feedback_id` | `FeedbackId` | 标识一次反馈 |
| `delivery_id` | `DeliveryId` | 关联 delivery |
| `status` | `FeedbackStatus` | 表达 ack / fail / timeout / duplicate |
| `reason` | `OptionalFeedbackReason` | 记录失败、超时或重复原因 |
| `received_at` | `Timestamp` | 记录反馈接收时间 |
| `actor` | `ActorContext` | 表达反馈发起者或系统 actor |

| 状态 | 作用 |
|---|---|
| `ack` | 订阅方确认处理成功 |
| `fail` | 订阅方或 delivery 失败 |
| `timeout` | delivery 超时 |
| `duplicate` | 重复反馈或重复 delivery 被识别 |

| 成员函数 | 作用 |
|---|---|
| `is_success()` | 判断是否为成功反馈 |
| `is_failure()` | 判断是否应进入失败恢复候选 |
| `is_duplicate()` | 判断是否为重复反馈 |

| 工厂函数 | 作用 |
|---|---|
| `FeedbackResult::ack(DeliveryId delivery_id, ActorContext actor)` | 创建 ack 反馈 |
| `FeedbackResult::fail(DeliveryId delivery_id, FeedbackReason reason, ActorContext actor)` | 创建 fail 反馈 |
| `FeedbackResult::timeout(DeliveryId delivery_id, TimeoutReason reason)` | 创建 timeout 反馈 |
| `FeedbackResult::duplicate(DeliveryId delivery_id, IdempotencyKey key)` | 创建 duplicate 反馈 |

| 禁止事项 | 说明 |
|---|---|
| 表达订阅方业务补偿逻辑 | 本对象只表达 bus 级反馈结果 |
| 生成治理决策 | fail 只能进入 failure material 或 recovery |

#### 7.11 `IdempotencyAnchor`

| 项 | 内容 |
|---|---|
| 所属部分 | 结果反馈与幂等留痕 |
| 对象类型 | domain value object / record |
| 主要责任 | 识别重复 delivery、重复 outbox relay 或重复 feedback |

| 字段 | 类型 | 作用 |
|---|---|---|
| `anchor_id` | `IdempotencyAnchorId` | 标识幂等锚点 |
| `scope` | `IdempotencyScope` | 表达 publication / delivery / feedback 等作用域 |
| `key` | `IdempotencyKey` | 保存幂等键 |
| `bound_record_ref` | `RecordRef` | 关联已处理记录 |
| `created_at` | `Timestamp` | 记录锚点创建时间 |

| 状态 | 作用 |
|---|---|
| 无独立状态 | 是否重复由 key 与 bound record 判断 |

| 成员函数 | 作用 |
|---|---|
| `matches(IdempotencyKey key)` | 判断给定 key 是否匹配 |
| `is_bound_to(RecordRef record_ref)` | 判断锚点是否已绑定某记录 |

| 工厂函数 | 作用 |
|---|---|
| `IdempotencyAnchor::bind(IdempotencyScope scope, IdempotencyKey key, RecordRef record_ref)` | 创建并绑定幂等锚点 |

| 禁止事项 | 说明 |
|---|---|
| 接管业务副作用幂等 | 本对象只处理 bus 级幂等 |
| 用 payload body 作为幂等依据 | 幂等依据必须来自 key 或引用 |

#### 7.12 `DeliveryHistoryEntry`

| 项 | 内容 |
|---|---|
| 所属部分 | 结果反馈与幂等留痕 |
| 对象类型 | history record |
| 主要责任 | 记录 delivery 生命周期变化和原因 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `history_id` | `DeliveryHistoryId` | 标识历史条目 |
| `delivery_id` | `DeliveryId` | 关联 delivery |
| `from_status` | `DeliveryStatus` | 原状态 |
| `to_status` | `DeliveryStatus` | 目标状态 |
| `reason` | `HistoryReason` | 记录迁移原因 |
| `occurred_at` | `Timestamp` | 记录发生时间 |

| 状态 | 作用 |
|---|---|
| 无独立状态 | 历史条目 append-only |

| 成员函数 | 作用 |
|---|---|
| `describes_transition(DeliveryStatus from_status, DeliveryStatus to_status)` | 判断条目是否描述某次迁移 |

| 工厂函数 | 作用 |
|---|---|
| `DeliveryHistoryEntry::transition(DeliveryId delivery_id, DeliveryStatus from_status, DeliveryStatus to_status, HistoryReason reason)` | 创建状态迁移历史 |

| 禁止事项 | 说明 |
|---|---|
| 覆盖当前状态 | 当前状态由 `DeliveryRecord` 保存 |
| 允许关键状态变化无 history | 关键状态变化必须留痕 |

#### 7.13 `RetryPlan`

| 项 | 内容 |
|---|---|
| 所属部分 | 失败恢复与重放准备 |
| 对象类型 | domain value object / record |
| 主要责任 | 表达失败后的重试计划、等待时间和剩余次数 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `retry_plan_id` | `RetryPlanId` | 标识重试计划 |
| `delivery_id` | `DeliveryId` | 关联 delivery |
| `next_attempt_at` | `Timestamp` | 表示下次尝试时间 |
| `remaining_attempts` | `AttemptCount` | 表示剩余次数 |
| `status` | `RetryPlanStatus` | 表达 scheduled / exhausted / cancelled |

| 状态 | 作用 |
|---|---|
| `scheduled` | 等待重试 |
| `exhausted` | 重试次数耗尽 |
| `cancelled` | 重试被取消 |

| 成员函数 | 作用 |
|---|---|
| `mark_exhausted(ActorContext actor)` | 标记重试耗尽 |
| `cancel(ActorContext actor, RecoveryReason reason)` | 取消重试计划 |
| `has_remaining_attempts()` | 判断是否仍可重试 |

| 工厂函数 | 作用 |
|---|---|
| `RetryPlan::create(DeliveryRecord delivery, FailureReason reason, RetryPolicyRef policy_ref)` | 基于失败 delivery 创建重试计划 |

| 禁止事项 | 说明 |
|---|---|
| 隐式绕过 dead-letter | 重试耗尽必须进入 DLQ 判断 |
| 保存 retry 算法完整参数 | 具体参数进入详细设计和配置设计 |

#### 7.14 `DeadLetterEntry`

| 项 | 内容 |
|---|---|
| 所属部分 | 失败恢复与重放准备 |
| 对象类型 | domain record |
| 主要责任 | 表达进入 DLQ 的失败材料和后续处置状态 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `dead_letter_id` | `DeadLetterId` | 标识死信条目 |
| `delivery_id` | `DeliveryId` | 关联 delivery |
| `failure_reason` | `FailureReason` | 记录失败原因 |
| `history_ref` | `DeliveryHistoryRef` | 关联 delivery 历史 |
| `audit_chain_ref` | `AuditChainRef` | 关联审计链 |
| `status` | `DeadLetterStatus` | 表达 open / reviewing / closed |

| 状态 | 作用 |
|---|---|
| `open` | 死信待处理 |
| `reviewing` | 死信正在审查 |
| `closed` | 死信关闭 |

| 成员函数 | 作用 |
|---|---|
| `start_review(ActorContext actor)` | 标记进入审查 |
| `close(ActorContext actor, CloseReason reason)` | 关闭死信 |
| `has_trusted_chain()` | 判断是否具备 history 和 audit chain |

| 工厂函数 | 作用 |
|---|---|
| `DeadLetterEntry::from_failed_delivery(DeliveryRecord delivery, FailureMaterial material)` | 从失败 delivery 和失败材料创建死信 |

| 禁止事项 | 说明 |
|---|---|
| 缺失 history / audit | DLQ 必须保留可信追溯链 |
| 直接触发 replay | replay 必须先形成 `ReplayPreparation` |

#### 7.15 `ReplayPreparation`

| 项 | 内容 |
|---|---|
| 所属部分 | 失败恢复与重放准备 |
| 对象类型 | domain record |
| 主要责任 | 表达 replay 前的准备材料和前置条件结果 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `replay_id` | `ReplayPreparationId` | 标识重放准备 |
| `dead_letter_id` | `DeadLetterId` | 关联死信条目 |
| `status` | `ReplayPreparationStatus` | 表达 draft / ready / rejected / superseded |
| `audit_chain_ref` | `AuditChainRef` | 关联审计链 |
| `approval_ref` | `OptionalReplayApprovalRef` | 关联外部允许重放的批准引用 |

| 状态 | 作用 |
|---|---|
| `draft` | 重放材料草稿 |
| `ready` | 重放材料满足前置条件 |
| `rejected` | 重放准备被拒绝 |
| `superseded` | 重放材料被新材料替代 |

| 成员函数 | 作用 |
|---|---|
| `mark_ready(ReplayApprovalRef approval_ref, ActorContext actor)` | 标记重放准备已满足前置条件 |
| `reject(ReplayRejectReason reason, ActorContext actor)` | 拒绝重放准备 |
| `requires_trusted_chain()` | 声明必须具备 DLQ / history / audit chain |

| 工厂函数 | 作用 |
|---|---|
| `ReplayPreparation::prepare(DeadLetterEntry entry, ActorContext actor)` | 从死信材料创建 replay preparation |

| 禁止事项 | 说明 |
|---|---|
| 绕过 dead-letter | 不能从普通 failed delivery 直接 replay |
| 直接执行治理审批 | 只能保存 approval reference，不生成治理决策 |

#### 7.16 `FailureMaterial`

| 项 | 内容 |
|---|---|
| 所属部分 | 失败恢复与重放准备 |
| 对象类型 | read material / domain record |
| 主要责任 | 表达可输出给治理、运维或观测方的 bus 失败事实 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `failure_material_id` | `FailureMaterialId` | 标识失败材料 |
| `delivery_id` | `DeliveryId` | 关联 delivery |
| `failure_reason` | `FailureReason` | 记录失败原因 |
| `dead_letter_ref` | `OptionalDeadLetterRef` | 关联死信条目 |
| `audit_ref` | `AuditRef` | 关联审计条目 |

| 状态 | 作用 |
|---|---|
| 无独立状态 | 状态由 delivery / DLQ / replay preparation 表达 |

| 成员函数 | 作用 |
|---|---|
| `is_governance_decision()` | 必须始终判定为 false，用于表达边界 |
| `has_dead_letter()` | 判断是否已经关联死信 |

| 工厂函数 | 作用 |
|---|---|
| `FailureMaterial::from_feedback(FeedbackResult feedback, DeliveryHistoryEntry history)` | 从失败反馈和历史创建失败材料 |
| `FailureMaterial::from_dead_letter(DeadLetterEntry entry, BusAuditEntry audit)` | 从死信和审计创建失败材料 |

| 禁止事项 | 说明 |
|---|---|
| 生成 governance decision | 只表达 bus 失败事实 |
| 保存 payload body | 不保存业务正文 |

#### 7.17 `RecoveryEligibilityPolicy`

| 项 | 内容 |
|---|---|
| 所属部分 | 失败恢复与重放准备 |
| 对象类型 | policy |
| 主要责任 | 判断 retry、dead-letter、replay preparation 是否允许 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `policy_ref` | `RecoveryPolicyRef` | 指向恢复策略口径 |

| 状态 | 作用 |
|---|---|
| 无独立状态 | 只表达允许性判断 |

| 成员函数 | 作用 |
|---|---|
| `can_retry(DeliveryRecord delivery, RetryPlan plan)` | 判断是否允许 retry |
| `can_dead_letter(DeliveryRecord delivery, FailureMaterial material)` | 判断是否允许进入 DLQ |
| `can_prepare_replay(DeadLetterEntry entry, AuditChainRef audit_chain_ref)` | 判断是否允许 replay preparation |

| 工厂函数 | 作用 |
|---|---|
| `RecoveryEligibilityPolicy::from_config(RecoveryPolicyConfigRef config_ref)` | 从配置引用创建恢复判断策略 |

| 禁止事项 | 说明 |
|---|---|
| 直接执行恢复 | policy 只判断允许性 |
| 绕过审计链 | replay 允许性必须检查 audit chain |

#### 7.18 `BusAuditEntry`

| 项 | 内容 |
|---|---|
| 所属部分 | 审计、历史与只读输出 |
| 对象类型 | audit record |
| 主要责任 | 记录总线级发布、delivery、feedback、recovery、projection 的审计事实 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `audit_id` | `AuditEntryId` | 标识审计条目 |
| `subject_ref` | `SubjectRef` | 关联被审计对象 |
| `action` | `AuditAction` | 表达审计动作 |
| `actor` | `ActorContext` | 表达操作者或系统 actor |
| `occurred_at` | `Timestamp` | 记录发生时间 |
| `trace_ref` | `TraceContextRef` | 关联跨仓 trace |

| 状态 | 作用 |
|---|---|
| 无独立状态 | 审计条目 append-only |

| 成员函数 | 作用 |
|---|---|
| `is_for_subject(SubjectRef subject_ref)` | 判断审计条目是否属于某对象 |

| 工厂函数 | 作用 |
|---|---|
| `BusAuditEntry::record(SubjectRef subject_ref, AuditAction action, ActorContext actor)` | 创建审计条目 |

| 禁止事项 | 说明 |
|---|---|
| 允许关键状态变化无审计 | 关键状态变化必须关联审计 |
| 保存业务正文 | 审计只记录引用和动作 |

#### 7.19 `TransportViewProjection`

| 项 | 内容 |
|---|---|
| 所属部分 | 审计、历史与只读输出 |
| 对象类型 | projection |
| 主要责任 | 面向 SDK / consumer 提供只读传递视图 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `view_id` | `TransportViewId` | 标识传递视图 |
| `delivery_id` | `DeliveryId` | 关联 delivery |
| `status` | `ProjectionStatus` | 表达 building / active / stale / rebuilding |
| `version` | `ProjectionVersion` | 表示投影版本 |
| `source_audit_ref` | `AuditRef` | 指向来源审计 |

| 状态 | 作用 |
|---|---|
| `building` | 投影正在构建 |
| `active` | 投影可被查询 |
| `stale` | 投影落后于 bus truth |
| `rebuilding` | 投影正在重建 |

| 成员函数 | 作用 |
|---|---|
| `mark_stale(AuditRef source_audit_ref)` | 标记投影过期 |
| `is_active()` | 判断投影是否可作为正常查询结果 |

| 工厂函数 | 作用 |
|---|---|
| `TransportViewProjection::derive(DeliveryRecord delivery, BusAuditEntry audit)` | 从 delivery 和审计派生视图 |

| 禁止事项 | 说明 |
|---|---|
| 反写 `DeliveryRecord` | projection 只能从 truth 派生 |
| 作为 SDK client | client 体验属于 `L0-sdk` |

#### 7.20 `FailureSummaryProjection`

| 项 | 内容 |
|---|---|
| 所属部分 | 审计、历史与只读输出 |
| 对象类型 | projection |
| 主要责任 | 面向 governance / operator 提供只读失败摘要 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `summary_id` | `FailureSummaryId` | 标识失败摘要 |
| `failure_material_id` | `FailureMaterialId` | 关联失败材料 |
| `status` | `ProjectionStatus` | 表达投影状态 |
| `source_dead_letter_ref` | `OptionalDeadLetterRef` | 指向来源死信 |
| `source_audit_ref` | `AuditRef` | 指向来源审计 |

| 状态 | 作用 |
|---|---|
| `building` | 投影正在构建 |
| `active` | 投影可被查询 |
| `stale` | 投影落后于 bus truth |
| `rebuilding` | 投影正在重建 |

| 成员函数 | 作用 |
|---|---|
| `mark_stale(AuditRef source_audit_ref)` | 标记摘要过期 |
| `is_governance_decision()` | 必须始终判定为 false |

| 工厂函数 | 作用 |
|---|---|
| `FailureSummaryProjection::derive(FailureMaterial material, BusAuditEntry audit)` | 从失败材料和审计派生摘要 |

| 禁止事项 | 说明 |
|---|---|
| 等同 governance decision | 它只是失败事实摘要 |
| 保存 payload body | 不保存业务正文 |

#### 7.21 `ReadOnlyOutputPolicy`

| 项 | 内容 |
|---|---|
| 所属部分 | 审计、历史与只读输出 |
| 对象类型 | policy |
| 主要责任 | 约束只读输出和 projection 写入不得反写 bus truth |

| 字段 | 类型 | 作用 |
|---|---|---|
| `policy_ref` | `ReadOnlyPolicyRef` | 指向只读输出策略口径 |

| 状态 | 作用 |
|---|---|
| 无独立状态 | 只表达允许性判断 |

| 成员函数 | 作用 |
|---|---|
| `allows_projection_write(ProjectionWriteIntent intent)` | 判断写入是否只影响 projection |
| `rejects_truth_write(ProjectionWriteIntent intent)` | 判断是否试图反写真相 |

| 工厂函数 | 作用 |
|---|---|
| `ReadOnlyOutputPolicy::default_for_projection()` | 创建默认只读输出策略 |

| 禁止事项 | 说明 |
|---|---|
| 修改 bus truth | policy 必须拒绝只读输出反写 |
| 承担观测长期存储规则 | 长期存储属于 observability |

#### 7.22 `BackendCapabilityRef`

| 项 | 内容 |
|---|---|
| 所属部分 | 存储、引用与后端适配边界 |
| 对象类型 | reference object |
| 主要责任 | 表达后端能力引用和版本，不保存后端 secret 或完整私有配置 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `capability_id` | `BackendCapabilityId` | 标识后端能力 |
| `backend_kind` | `BackendKind` | 表示后端类型 |
| `profile_ref` | `BackendProfileRef` | 指向环境 profile |
| `capability_version` | `CapabilityVersion` | 表示能力版本 |

| 状态 | 作用 |
|---|---|
| 无独立状态 | 能力可用性由 adapter status 或运行状态视图表达 |

| 成员函数 | 作用 |
|---|---|
| `is_kind(BackendKind backend_kind)` | 判断后端类型 |
| `matches_profile(BackendProfileRef profile_ref)` | 判断是否指向某 profile |

| 工厂函数 | 作用 |
|---|---|
| `BackendCapabilityRef::from_profile(BackendProfileRef profile_ref, BackendKind backend_kind)` | 从配置引用生成后端能力引用 |

| 禁止事项 | 说明 |
|---|---|
| 保存 raw secret | 只能保存 profile reference |
| 表达后端完整配置 | 具体配置进入配置设计和 adapter |

#### 7.23 `BackendCapabilityPolicy`

| 项 | 内容 |
|---|---|
| 所属部分 | 存储、引用与后端适配边界 |
| 对象类型 | policy |
| 主要责任 | 判断平台传递语义是否可映射到后端能力 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `capability_ref` | `BackendCapabilityRef` | 指向要判断的后端能力 |

| 状态 | 作用 |
|---|---|
| 无独立状态 | 只表达允许性判断 |

| 成员函数 | 作用 |
|---|---|
| `allows_mapping(TransportSemantic semantic, BackendCapabilityRef capability_ref)` | 判断平台语义是否可映射到后端能力 |
| `rejects_raw_backend_leak(TransportSemantic semantic)` | 判断是否有后端裸参数泄漏 |

| 工厂函数 | 作用 |
|---|---|
| `BackendCapabilityPolicy::from_capability(BackendCapabilityRef capability_ref)` | 从后端能力引用创建映射策略 |

| 禁止事项 | 说明 |
|---|---|
| 让后端差异改变平台语义 | 后端差异只能在 adapter 边界内表达 |
| 保存后端 secret | 只能读取能力引用 |

#### 7.24 对象边界一致性结论

| 边界 | 对象层口径 |
|---|---|
| bus truth | `PublicationAcceptance`、`DeliveryRecord`、`FeedbackResult`、`IdempotencyAnchor`、`RetryPlan`、`DeadLetterEntry`、`ReplayPreparation`、`BusAuditEntry`、`DeliveryHistoryEntry` |
| snapshot / projection | `TransportViewProjection`、`FailureSummaryProjection` |
| reference | `PublicationMaterial` 中的 core / payload / outbox 引用、`BackendCapabilityRef` |
| forbidden body | business payload body、raw secret、governance decision body、observability long-term log body 不成为对象字段 |
| policy / invariant | `PayloadBoundaryGuard`、`DeliveryLifecycle`、`RecoveryEligibilityPolicy`、`ReadOnlyOutputPolicy`、`BackendCapabilityPolicy` 只表达规则和允许性判断 |

#### 7.25 与 Step 8 / Step 9 的对象反查清单

| 后续章节 | 将使用的对象 | 本步定义情况 |
|---|---|---|
| Step 8 `AcceptPublication` | `PublicationMaterial`、`PublicationAcceptance`、`TransportSemantic`、`PayloadBoundaryGuard`、`BusAuditEntry` | 已独立定义 |
| Step 8 `RunDeliveryProgression` | `DeliveryRecord`、`DeliveryAttempt`、`DeliveryLifecycle`、`BackendCapabilityRef`、`DeliveryHistoryEntry`、`BusAuditEntry` | 已独立定义 |
| Step 8 `RecordDeliveryFeedback` | `FeedbackResult`、`IdempotencyAnchor`、`DeliveryRecord`、`DeliveryHistoryEntry`、`BusAuditEntry` | 已独立定义 |
| Step 8 recovery flows | `RetryPlan`、`DeadLetterEntry`、`ReplayPreparation`、`FailureMaterial`、`RecoveryEligibilityPolicy` | 已独立定义 |
| Step 8 read output flows | `TransportViewProjection`、`FailureSummaryProjection`、`ReadOnlyOutputPolicy`、`BusAuditEntry` | 已独立定义 |
| Step 9 状态机 | `PublicationAcceptance`、`DeliveryRecord`、`FeedbackResult`、`RetryPlan`、`DeadLetterEntry`、`ReplayPreparation`、projection 对象 | 已独立定义 |

### 8. 回填草稿

正式 `02-概要设计.md` §6 “关键对象轮廓”直接摘录并润色本文件：

- §7.1 “对象候选池筛选说明”
- §7.2 “关键对象分布表”
- §7.3 ~ §7.23 关键对象独立小节
- §7.24 “对象边界一致性结论”
- §7.25 “与 Step 8 / Step 9 的对象反查清单”

不在本 Step 重复粘贴完整正式章节正文。Step 14 生成正式文档时，再统一补充校准来源、延伸阅读、正式文档语气和章节衔接。

### 9. 待确认事项

- 无阻塞进入 Step 7 的待确认事项。
- 详细设计需要进一步决定每个对象的完整 Rust struct / enum、错误类型、repository trait、serde schema 和持久化模型。
- Step 8 需要基于本文件重新复核处理流，不得再把 `RequestRetry`、`MoveDeliveryToDeadLetter`、`PrepareReplay` 合并为一个模糊处理流。

### 10. 进入下一步条件

- 已从 Step 5 对象候选池完成对象正式化筛选。
- 已明确哪些候选对象正式进入 Step 6，哪些只是字段类型、接口、端口或实现细节。
- 已为每个正式对象独立成节，给出基本信息、字段、状态、成员函数、工厂函数和禁止事项。
- 已避免把多个未来代码主体对象压缩成组合表。
- 已明确 projection、reference、policy、forbidden body 的边界。
- 已反查 Step 8 / Step 9 将使用的对象均已在本步定义。
- 已足以进入 Step 7 “API / 接口骨架”，并支撑后续重检 Step 8 / Step 9。
