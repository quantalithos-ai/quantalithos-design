# Step 8. 定义 API / Command / Query / Event / Job 协议契约

## 1. Step 状态

- 状态：[x] 已确认
- 所属文档：`projects/L0-bus/03-详细设计.md`
- 本步目标：定义 L0-bus 需要实现的 API、Command、Query、Inbound Event、Outbound Event 和 Operations Job 协议契约。
- 本步不直接修改正式 `03-详细设计.md`，只形成中间产物。

---

## 2. 本步输入

| 输入 | 关键结论 | 本步使用方式 |
|---|---|---|
| `standards/document/详细设计讨论流程_SOP.md` Step 8 | 每个协议独立成小节，必须写签名、路由 / topic、schema、错误、幂等与审计 | 约束本文件结构 |
| `standards/document/详细设计书写规范.md` §5.7 | 协议总表、单协议固定结构、JSON / Rust DTO / Event 写法 | 约束正式文档回填 |
| `projects/L0-bus/02-概要设计.md` §7 | 已确认 Command、Query、Inbound Event、Outbound Event、Job 名称和边界 | 决定协议清单 |
| `projects/L0-bus/design-calibration/03_ddd_step_05_module_contracts_axis.md` | 已确认 `contracts / api / worker / jobs / application` 分工 | 决定 DTO、handler、consumer、job 所属模块 |
| `projects/L0-bus/design-calibration/03_ddd_step_06_object_contracts.md` | 已确认领域对象、状态和边界规则 | 决定协议字段不能携带 payload body / secret / 后端私有正文 |
| `projects/L0-bus/design-calibration/03_ddd_step_07_trait_port_adapter_contracts.md` | 已确认 repository / port / adapter 契约 | 决定处理方和后续 Step 9 处理流承接 |

---

## 3. SOP 问题回答

### 3.1 本轮需要定义哪些 API / Command / Query / Event / Job？

| 类别 | 协议 |
|---|---|
| Command API | `AcceptPublication`、`RecordDeliveryFeedback`、`RequestRetry`、`MoveDeliveryToDeadLetter`、`PrepareReplay` |
| Query API | `GetPublicationAcceptance`、`GetDeliveryStatus`、`ListDeliveryHistory`、`GetTransportView`、`GetFailureSummary`、`GetBusAuditTrail`、`GetBackendHealthView` |
| Inbound Event Consumer | `ConsumeCommittedOutboxFact`、`ConsumeBackendDeliverySignal`、`ConsumeTimeoutSignal` |
| Outbound Event | `PublicationAcceptedEvent`、`PublicationRejectedEvent`、`DeliveryStateChangedEvent`、`FeedbackRecordedEvent`、`DeadLetterCreatedEvent`、`ReplayPreparationReadyEvent`、`TransportViewUpdatedEvent`、`FailureMaterialAvailableEvent`、`BackendCapabilityChangedEvent` |
| Operations Job | `RunOutboxRelay`、`RunDeliveryProgression`、`RunRetryCycle`、`RunReadOutputProjection`、`RebuildReadProjection`、`CheckBackendCapability` |

### 3.2 每个协议的调用方、处理方、传输方式是什么？

本步在 §7.1 的协议总表中统一列出。简化原则：

- Command / Query 使用 HTTP JSON 作为 P0 外部同步接口。
- Inbound Event Consumer 使用 event bus / poll source envelope 作为输入形态。
- Outbound Event 使用 event bus topic 作为输出形态。
- Operations Job 使用 CLI / scheduler trigger 作为 P0 触发形态。

### 3.3 外部接口使用 HTTP、RPC、event bus 还是其他方式？

| 协议类别 | P0 传输方式 | 说明 |
|---|---|---|
| Command API | HTTP JSON | P0 先稳定 REST-like route，RPC / SDK convenience 不进入本仓 P0 |
| Query API | HTTP JSON | 查询不改写真相，返回 view / page / consistency marker |
| Inbound Event Consumer | event bus envelope 或 poll source page | `ConsumeCommittedOutboxFact` 可以由 `OutboxFactSourcePort` poll；后端 / timeout signal 可以由 consumer 接收 |
| Outbound Event | event bus topic | schema 采用版本化 JSON payload，CloudEvent envelope 字段复用 L0-core contract |
| Operations Job | CLI / scheduler trigger | job 输入用 JSON arg / job config，具体二进制参数在实施计划落地 |

### 3.4 请求、响应、事件或 job 输入输出 schema 是什么？

本步在每个协议独立小节中给出 JSON schema 示例。Rust DTO 放在 `crates/contracts`，字段与 JSON 示例一一对应。完整序列化实现细节由编码阶段按 `serde` 落地。

### 3.5 每个协议失败时映射成什么错误？

错误映射按本步 §7.2 的公共错误类别统一使用：

| 错误类别 | HTTP 映射 | Event / Job 映射 | 说明 |
|---|---|---|---|
| `ValidationError` | `400` | rejected / failed result | 字段缺失、格式错误、非法状态 |
| `NotFoundError` | `404` | skipped / not_found result | 查询对象不存在或 job 目标不存在 |
| `ConflictError` | `409` | duplicate / conflict result | 幂等冲突、版本冲突、状态冲突 |
| `BoundaryViolationError` | `422` | rejected result | payload body、secret、后端私有正文越界 |
| `DependencyError` | `503` | retryable failure | 后端、source、publisher、store 暂时不可用 |
| `InternalError` | `500` | failed result | 未分类内部错误 |

### 3.6 哪些协议需要幂等键或审计记录？

| 协议类别 | 幂等键 | 审计 |
|---|---|---|
| Command API | 写命令必须有 `idempotency_key`，Query 不需要 | 写命令必须写 audit |
| Inbound Event Consumer | 必须有 `event_id + source_ref + idempotency_key` | 成功或拒绝都应写 audit |
| Outbound Event | 使用 `event_id` 和 source fact reference | 发布记录必须可审计或可追踪 |
| Operations Job | 使用 `job_run_id`、cursor 和目标 ID 组合 | job summary 必须可审计 |

---

## 4. 当前文档问题诊断

| 问题 | 影响 | 本步处理 |
|---|---|---|
| 旧版详细设计接口主语与新版概要设计不一致 | 代码实现会走回 envelope / callback 旧路线 | 本步只使用新版 `AcceptPublication`、delivery、feedback、recovery、projection 主线 |
| 概要设计只给输入 / 输出骨架，没有固定 route / topic | 实现者无法直接建 handler / consumer / job | 本步补 HTTP route、event topic、job name |
| DTO 与领域对象边界容易混淆 | 可能把 protocol DTO 当 domain object | 本步明确 DTO 属于 `contracts`，domain object 仍由 Step 6 定义 |
| outbound event 容易携带 payload body 或 secret | 破坏 bus 边界和安全约束 | 本步在所有 event schema 中只使用 ref / summary / status |
| Query 可能隐式触发 projection rebuild | 查询会产生隐藏写副作用 | 本步规定 Query 返回 consistency marker，不自动修写真相 |

---

## 5. 改动前后对比

| 维度 | 改动前 | 改动后 |
|---|---|---|
| 协议清单 | 概要设计只列骨架 | 详细设计列全 Command / Query / Event / Job 协议 |
| 传输方式 | 未固定 | P0 固定 HTTP JSON、event bus topic、CLI / scheduler trigger |
| route / topic | 未固定 | 每个协议都有 route、topic 或 job name |
| schema | 只有输入输出名称 | 每个协议都有 JSON schema 示例 |
| 错误映射 | 只描述异常边界 | 每个协议写错误类别映射 |
| 幂等审计 | 散落在流程说明中 | 每个协议明确幂等键与审计要求 |

---

## 6. 设计取舍

### 6.1 Command / Query 是否 P0 使用 HTTP JSON

| 方案 | 说明 | 结论 |
|---|---|---|
| 方案 A：P0 使用 HTTP JSON | 易实现、易测试、易被其他服务调用 | 推荐 |
| 方案 B：P0 使用 gRPC | 类型强，但会增加 proto 生成和 SDK 工具链负担 | 不采用 |
| 方案 C：只提供 Rust crate API | 对同语言调用方便，但无法作为独立服务入口 | 不采用 |

推荐方案 A。L0-bus 可以作为服务运行，HTTP JSON 是 P0 最低摩擦入口；未来如果需要 gRPC，可在协议稳定后追加 adapter。

### 6.2 Event schema 是否直接复用 CloudEvent envelope

| 方案 | 说明 | 结论 |
|---|---|---|
| 方案 A：本仓重新定义完整 CloudEvent | 会重复 L0-core 契约 | 不采用 |
| 方案 B：只定义 bus event payload，envelope 引用 L0-core contract | 推荐 |
| 方案 C：不定义事件 payload | 实现者无法发布 / 订阅 | 不采用 |

推荐方案 B。`event_id`、`source`、`trace` 等 envelope 字段复用 L0-core；本仓只定义 data payload。

### 6.3 Job 是否作为 HTTP API 暴露

| 方案 | 说明 | 结论 |
|---|---|---|
| 方案 A：所有 job 都提供 HTTP trigger | 运维方便，但会扩大 API 面 | 不采用为 P0 默认 |
| 方案 B：P0 使用 CLI / scheduler trigger，后续可加 ops API | 推荐 |
| 方案 C：job 只由内部 loop 触发 | 不利于受控 rebuild / check | 不采用 |

推荐方案 B。`jobs` 模块先提供清晰 job input / output，触发方式可以由 CLI、scheduler 或后续 ops API 适配。

---

## 7. 结构化中间产物

### 7.1 协议总表

| 名称 | 类别 | 调用方 / 发布方 | 处理方 / 订阅方 | 传输方式 | 是否需要处理流 |
|---|---|---|---|---|---|
| `AcceptPublication` | Command API | publisher / upstream service | `BusCommandApi` -> `PublicationAcceptanceService` | `POST /v1/bus/publications` | 是 |
| `RecordDeliveryFeedback` | Command API | subscriber / backend adapter / operator | `DeliveryFeedbackApi` -> `FeedbackRecordingService` | `POST /v1/bus/deliveries/{delivery_id}/feedback` | 是 |
| `RequestRetry` | Command API | operator / recovery automation | `RecoveryOperationsApi` -> `RecoveryOrchestrationService` | `POST /v1/bus/deliveries/{delivery_id}/retry-requests` | 是 |
| `MoveDeliveryToDeadLetter` | Command API | operator / recovery automation | `RecoveryOperationsApi` -> `RecoveryOrchestrationService` | `POST /v1/bus/deliveries/{delivery_id}/dead-letter` | 是 |
| `PrepareReplay` | Command API | operator / governance-approved workflow | `RecoveryOperationsApi` -> `ReplayPreparationService` | `POST /v1/bus/dead-letters/{dead_letter_id}/replay-preparations` | 是 |
| `GetPublicationAcceptance` | Query API | publisher / operator | `BusQueryApi` -> `ReadOutputService` | `GET /v1/bus/publications/{publication_id}` | 通用只读流 |
| `GetDeliveryStatus` | Query API | publisher / subscriber / operator | `BusQueryApi` -> `ReadOutputService` | `GET /v1/bus/deliveries/{delivery_id}` | 通用只读流 |
| `ListDeliveryHistory` | Query API | operator / observability | `BusQueryApi` -> `ReadOutputService` | `GET /v1/bus/deliveries/{delivery_id}/history` | 通用只读流 |
| `GetTransportView` | Query API | SDK / consumer / operator | `BusQueryApi` -> `ReadOutputService` | `GET /v1/bus/transport-views/{transport_view_id}` | 通用只读流 |
| `GetFailureSummary` | Query API | operator / governance | `BusQueryApi` -> `ReadOutputService` | `GET /v1/bus/failure-summaries/{failure_summary_id}` | 通用只读流 |
| `GetBusAuditTrail` | Query API | operator / audit viewer | `BusQueryApi` -> `ReadOutputService` | `GET /v1/bus/audit-trail` | 通用只读流 |
| `GetBackendHealthView` | Query API | operator / observability | `BusQueryApi` -> `ReadOutputService` | `GET /v1/bus/backends/{backend_id}/health` | 通用只读流 |
| `ConsumeCommittedOutboxFact` | Inbound Event Consumer | L0-core outbox source | `OutboxRelayConsumer` -> `PublicationAcceptanceService` | `core.outbox.committed.v1` / poll source | 是 |
| `ConsumeBackendDeliverySignal` | Inbound Event Consumer | transport backend adapter | `BackendSignalConsumer` -> `FeedbackRecordingService` | `bus.backend.delivery_signal.v1` | 是 |
| `ConsumeTimeoutSignal` | Inbound Event Consumer | scheduler / timeout source | `TimeoutSignalConsumer` -> `FeedbackRecordingService` | `bus.delivery.timeout.v1` | 是 |
| `PublicationAcceptedEvent` | Outbound Event | L0-bus | delivery worker / read output / observability | `bus.publication.accepted.v1` | 通用发布流 |
| `PublicationRejectedEvent` | Outbound Event | L0-bus | publisher / operator / observability | `bus.publication.rejected.v1` | 通用发布流 |
| `DeliveryStateChangedEvent` | Outbound Event | L0-bus | read output / observability / operator | `bus.delivery.state_changed.v1` | 通用发布流 |
| `FeedbackRecordedEvent` | Outbound Event | L0-bus | recovery worker / read output / observability | `bus.feedback.recorded.v1` | 通用发布流 |
| `DeadLetterCreatedEvent` | Outbound Event | L0-bus | governance / operator / observability | `bus.dead_letter.created.v1` | 通用发布流 |
| `ReplayPreparationReadyEvent` | Outbound Event | L0-bus | operator / governance / replay executor | `bus.replay_preparation.ready.v1` | 通用发布流 |
| `TransportViewUpdatedEvent` | Outbound Event | L0-bus | SDK / consumer / observability | `bus.transport_view.updated.v1` | 通用发布流 |
| `FailureMaterialAvailableEvent` | Outbound Event | L0-bus | governance / operator / observability | `bus.failure_material.available.v1` | 通用发布流 |
| `BackendCapabilityChangedEvent` | Outbound Event | L0-bus | operator / observability | `bus.backend.capability_changed.v1` | 通用发布流 |
| `RunOutboxRelay` | Operations Job | scheduler / CLI | `OutboxRelayJobRunner` | job `bus.run_outbox_relay` | 是 |
| `RunDeliveryProgression` | Operations Job | scheduler / CLI | `DeliveryProgressionJobRunner` | job `bus.run_delivery_progression` | 是 |
| `RunRetryCycle` | Operations Job | scheduler / CLI | `RetryCycleJobRunner` | job `bus.run_retry_cycle` | 是 |
| `RunReadOutputProjection` | Operations Job | scheduler / CLI | `ReadOutputProjectionJobRunner` | job `bus.run_read_output_projection` | 是 |
| `RebuildReadProjection` | Operations Job | operator / CLI | `ProjectionRebuildJobRunner` | job `bus.rebuild_read_projection` | 是 |
| `CheckBackendCapability` | Operations Job | scheduler / CLI | `BackendCapabilityJobRunner` | job `bus.check_backend_capability` | 是 |

### 7.2 公共协议约定

#### 7.2.1 公共 HTTP 请求头

| Header | 类型 | 作用 | 是否必需 |
|---|---|---|---|
| `x-actor-id` | `ActorId` | 上游安全层注入的 actor 标识 | 是 |
| `x-actor-kind` | `ActorKind` | actor 类型，例如 `member` / `service` / `system` | 是 |
| `x-trace-id` | `TraceId` | 链路追踪 ID | 是 |
| `x-idempotency-key` | `IdempotencyKey` | 写命令幂等键 | Command 必需 |
| `x-request-id` | `RequestId` | 请求 ID | 建议 |

#### 7.2.2 公共响应 envelope

```json
{
  "request_id": "req_01",
  "trace_id": "trace_01",
  "status": "ok",
  "data": {},
  "error": null,
  "consistency": {
    "marker": "committed",
    "version": "v1"
  }
}
```

#### 7.2.3 公共错误响应

```json
{
  "request_id": "req_01",
  "trace_id": "trace_01",
  "status": "error",
  "data": null,
  "error": {
    "code": "boundary_violation",
    "message": "payload body is not accepted by bus protocol",
    "retryable": false,
    "details_ref": "error_ref_01"
  },
  "consistency": null
}
```

#### 7.2.4 Rust DTO 公共类型引用

```rust
/// HTTP handler 从 gateway headers 解析得到的 actor 上下文。
pub struct ActorContext {
    /// Actor 唯一标识。
    pub actor_id: ActorId,
    /// Actor 类型。
    pub actor_kind: ActorKind,
}

/// Command API 的公共元数据。
pub struct CommandMetadata {
    /// 请求 ID。
    pub request_id: RequestId,
    /// 链路追踪引用。
    pub trace_ref: TraceContextRef,
    /// 幂等键。
    pub idempotency_key: IdempotencyKey,
}

/// Job 运行公共元数据。
pub struct JobMetadata {
    /// Job run 唯一标识。
    pub job_run_id: JobRunId,
    /// 链路追踪引用。
    pub trace_ref: TraceContextRef,
    /// 触发来源。
    pub trigger_source: JobTriggerSource,
}
```

说明：

- `ActorContext`、`CommandMetadata`、`JobMetadata` 的具体来源由 api / worker / jobs adapter 解析。
- 本仓不做身份校验，只消费上游安全层注入的 actor / trace / request metadata。
- Event envelope 复用 L0-core contract；本步只定义 bus event payload。

### 7.3 Command API 协议

#### 7.3.1 `AcceptPublication`

##### 用途

接收发布材料引用，校验 core contract ref 和 payload boundary，创建 `PublicationAcceptance`。

`AcceptPublicationCommand` 不接收 `transport_semantic`。平台级传递语义由 PH-03 基于 accepted material 与 backend capability 派生，不能由调用方输入。

##### 函数签名 / 路由

| 项 | 内容 |
|---|---|
| 函数签名 | `accept_publication(command: AcceptPublicationCommand, actor: ActorContext, meta: CommandMetadata) -> Result<PublicationAcceptanceResult, ApiError>` |
| HTTP / RPC / Event 名称 | `POST /v1/bus/publications` |
| 调用方 | publisher / upstream service |
| 处理方 | `BusCommandApi` -> `PublicationAcceptanceService` |

##### 请求 schema

```json
{
  "source_system": "l2-process",
  "source_record_ref": "process_event_01",
  "core_event_ref": "core_event_contract_01",
  "payload_ref": "artifact_ref_01",
  "payload_kind": "artifact_ref",
  "payload_digest": "sha256:...",
  "delivery_mode": "at_least_once",
  "target_scope": {
    "project_id": "project_01",
    "topic": "workitem.events"
  }
}
```

##### 响应 schema

```json
{
  "publication_id": "pub_01",
  "acceptance_status": "accepted",
  "rejection_reason_ref": null,
  "audit_ref": "audit_01"
}
```

##### Rust DTO

```rust
/// 接收发布材料的命令 DTO。
pub struct AcceptPublicationCommand {
    /// 来源系统。
    pub source_system: SourceSystem,
    /// 来源记录引用。
    pub source_record_ref: SourceRecordRef,
    /// 指向 L0-core 中已定义事件契约的引用。
    pub core_event_ref: CoreEventRef,
    /// payload 引用，禁止携带 payload body。
    pub payload_ref: PayloadRef,
    /// payload 类型。
    pub payload_kind: PayloadKind,
    /// payload 摘要。
    pub payload_digest: PayloadDigest,
    /// 平台投递语义请求值；P0 只允许 at_least_once。
    pub delivery_mode: DeliveryMode,
    /// 目标范围。
    pub target_scope: TargetScope,
}
```

##### 错误映射

| 错误 | 映射 | 说明 |
|---|---|---|
| `ValidationError` | `400` | 必填字段缺失或枚举值非法 |
| `BoundaryViolationError` | `422` | 请求携带 payload body、secret 或后端私有参数 |
| `ConflictError` | `409` | 幂等键冲突或同来源记录重复接入 |
| `DependencyError` | `503` | repository / publisher 暂时不可用 |

字段约束：

| 字段 | 约束 |
|---|---|
| `core_event_ref` | 必填，缺失时 `AcceptPublication` 必须 rejected / validation error，不得形成 accepted truth |
| `delivery_mode` | P0 只允许协议值 `at_least_once`，映射到领域 `DeliveryMode::AtLeastOnce` |
| `transport_semantic` | 禁止出现在 request 中；若出现应按非法字段或边界违规处理 |

##### 幂等与审计要求

- 必须提供 `x-idempotency-key`。
- 成功、拒绝和冲突都必须形成 audit entry 或可追踪错误引用。
- 不得在 audit 中保存 payload body。

#### 7.3.2 `RecordDeliveryFeedback`

##### 用途

记录 subscriber、backend adapter 或 operator 提交的 delivery feedback，形成 bus 级 feedback result。

##### 函数签名 / 路由

| 项 | 内容 |
|---|---|
| 函数签名 | `record_delivery_feedback(command: RecordDeliveryFeedbackCommand, actor: ActorContext, meta: CommandMetadata) -> Result<FeedbackRecordResult, ApiError>` |
| HTTP / RPC / Event 名称 | `POST /v1/bus/deliveries/{delivery_id}/feedback` |
| 调用方 | subscriber / backend adapter / operator |
| 处理方 | `DeliveryFeedbackApi` -> `FeedbackRecordingService` |

##### 请求 schema

```json
{
  "delivery_id": "delivery_01",
  "attempt_id": "attempt_01",
  "feedback_kind": "ack",
  "feedback_reason": "subscriber_processed",
  "observed_at": "2026-05-29T10:00:00Z",
  "external_feedback_ref": "subscriber_ack_01"
}
```

##### 响应 schema

```json
{
  "feedback_id": "feedback_01",
  "delivery_id": "delivery_01",
  "feedback_status": "recorded",
  "delivery_status": "completed",
  "audit_ref": "audit_02"
}
```

##### Rust DTO

```rust
/// 记录 delivery feedback 的命令 DTO。
pub struct RecordDeliveryFeedbackCommand {
    /// Delivery ID。
    pub delivery_id: DeliveryId,
    /// Attempt ID。
    pub attempt_id: AttemptId,
    /// Feedback 类型。
    pub feedback_kind: FeedbackKind,
    /// Feedback 原因。
    pub feedback_reason: FeedbackReason,
    /// 外部观察时间。
    pub observed_at: Timestamp,
    /// 外部 feedback 引用。
    pub external_feedback_ref: ExternalFeedbackRef,
}
```

##### 错误映射

| 错误 | 映射 | 说明 |
|---|---|---|
| `ValidationError` | `400` | feedback kind 或时间格式非法 |
| `NotFoundError` | `404` | delivery 或 attempt 不存在 |
| `ConflictError` | `409` | 重复 feedback 或状态不可迁移 |
| `BoundaryViolationError` | `422` | feedback 中携带业务 payload body |

##### 幂等与审计要求

- 必须提供 `x-idempotency-key`。
- 重复 feedback 返回已有结果，不重复写状态。
- fail / timeout feedback 只能形成恢复候选，不生成治理决策。

#### 7.3.3 `RequestRetry`

##### 用途

针对失败或可恢复 delivery 创建或更新 retry plan。

##### 函数签名 / 路由

| 项 | 内容 |
|---|---|
| 函数签名 | `request_retry(command: RequestRetryCommand, actor: ActorContext, meta: CommandMetadata) -> Result<RetryPlanResult, ApiError>` |
| HTTP / RPC / Event 名称 | `POST /v1/bus/deliveries/{delivery_id}/retry-requests` |
| 调用方 | operator / recovery automation |
| 处理方 | `RecoveryOperationsApi` -> `RecoveryOrchestrationService` |

##### 请求 schema

```json
{
  "delivery_id": "delivery_01",
  "failure_material_ref": "failure_material_01",
  "retry_policy_ref": "retry_policy_01",
  "requested_reason": "transient_backend_failure",
  "max_attempts": 3
}
```

##### 响应 schema

```json
{
  "retry_plan_id": "retry_01",
  "delivery_id": "delivery_01",
  "retry_status": "scheduled",
  "next_run_at": "2026-05-29T10:05:00Z",
  "audit_ref": "audit_03"
}
```

##### Rust DTO

```rust
/// 请求 retry plan 的命令 DTO。
pub struct RequestRetryCommand {
    /// Delivery ID。
    pub delivery_id: DeliveryId,
    /// 失败材料引用。
    pub failure_material_ref: FailureMaterialRef,
    /// Retry policy 引用。
    pub retry_policy_ref: RetryPolicyRef,
    /// 请求 retry 的原因。
    pub requested_reason: RetryRequestReason,
    /// 最大尝试次数。
    pub max_attempts: AttemptLimit,
}
```

##### 错误映射

| 错误 | 映射 | 说明 |
|---|---|---|
| `NotFoundError` | `404` | delivery 或 failure material 不存在 |
| `ConflictError` | `409` | delivery 状态不允许 retry 或已有 active retry plan |
| `ValidationError` | `400` | retry policy 引用或次数非法 |

##### 幂等与审计要求

- 建议提供 `x-idempotency-key`，operator 重试请求必须可去重。
- 成功创建、拒绝创建和取消创建都必须写 audit。

#### 7.3.4 `MoveDeliveryToDeadLetter`

##### 用途

将不可继续 retry 的 delivery 移入 DLQ，并保存 failure material。

##### 函数签名 / 路由

| 项 | 内容 |
|---|---|
| 函数签名 | `move_delivery_to_dead_letter(command: MoveDeliveryToDeadLetterCommand, actor: ActorContext, meta: CommandMetadata) -> Result<DeadLetterResult, ApiError>` |
| HTTP / RPC / Event 名称 | `POST /v1/bus/deliveries/{delivery_id}/dead-letter` |
| 调用方 | operator / recovery automation |
| 处理方 | `RecoveryOperationsApi` -> `RecoveryOrchestrationService` |

##### 请求 schema

```json
{
  "delivery_id": "delivery_01",
  "failure_material_ref": "failure_material_01",
  "dead_letter_reason": "retry_exhausted",
  "operator_note_ref": "note_ref_01"
}
```

##### 响应 schema

```json
{
  "dead_letter_id": "dlq_01",
  "delivery_id": "delivery_01",
  "dead_letter_status": "created",
  "failure_material_ref": "failure_material_01",
  "audit_ref": "audit_04"
}
```

##### Rust DTO

```rust
/// 将 delivery 移入 dead letter 的命令 DTO。
pub struct MoveDeliveryToDeadLetterCommand {
    /// Delivery ID。
    pub delivery_id: DeliveryId,
    /// 失败材料引用。
    pub failure_material_ref: FailureMaterialRef,
    /// DLQ 原因。
    pub dead_letter_reason: DeadLetterReason,
    /// 操作者备注引用。
    pub operator_note_ref: Option<OperatorNoteRef>,
}
```

##### 错误映射

| 错误 | 映射 | 说明 |
|---|---|---|
| `NotFoundError` | `404` | delivery 或 failure material 不存在 |
| `ConflictError` | `409` | 当前状态不允许进入 DLQ |
| `BoundaryViolationError` | `422` | 操作者备注携带正文而非引用 |

##### 幂等与审计要求

- 建议提供 `x-idempotency-key`。
- DLQ 创建必须写 audit，并发布 `DeadLetterCreatedEvent`。
- `FailureMaterial` 不得包含治理决策正文。

#### 7.3.5 `PrepareReplay`

##### 用途

基于 dead letter、审计链和审批引用创建 replay preparation。

##### 函数签名 / 路由

| 项 | 内容 |
|---|---|
| 函数签名 | `prepare_replay(command: PrepareReplayCommand, actor: ActorContext, meta: CommandMetadata) -> Result<ReplayPreparationResult, ApiError>` |
| HTTP / RPC / Event 名称 | `POST /v1/bus/dead-letters/{dead_letter_id}/replay-preparations` |
| 调用方 | operator / governance-approved workflow |
| 处理方 | `RecoveryOperationsApi` -> `ReplayPreparationService` |

##### 请求 schema

```json
{
  "dead_letter_id": "dlq_01",
  "audit_chain_ref": "audit_chain_01",
  "approval_ref": "approval_01",
  "replay_reason": "operator_approved_replay"
}
```

##### 响应 schema

```json
{
  "replay_preparation_id": "replay_prep_01",
  "dead_letter_id": "dlq_01",
  "replay_preparation_status": "ready",
  "audit_ref": "audit_05"
}
```

##### Rust DTO

```rust
/// 准备 replay 前置材料的命令 DTO。
pub struct PrepareReplayCommand {
    /// Dead letter ID。
    pub dead_letter_id: DeadLetterId,
    /// 审计链引用。
    pub audit_chain_ref: AuditChainRef,
    /// 审批引用。
    pub approval_ref: ApprovalRef,
    /// replay 原因。
    pub replay_reason: ReplayReason,
}
```

##### 错误映射

| 错误 | 映射 | 说明 |
|---|---|---|
| `NotFoundError` | `404` | dead letter 或 audit chain 不存在 |
| `ConflictError` | `409` | replay preparation 已存在或状态不允许 |
| `ValidationError` | `400` | approval ref 或 replay reason 非法 |

##### 幂等与审计要求

- 建议提供 `x-idempotency-key`。
- replay preparation 只表示准备完成，不表示 replay 已执行。
- 成功后发布 `ReplayPreparationReadyEvent`。

### 7.4 Query API 协议

#### 7.4.1 `GetPublicationAcceptance`

| 项 | 内容 |
|---|---|
| 用途 | 查询 publication acceptance 结果 |
| 函数签名 | `get_publication_acceptance(query: GetPublicationAcceptanceQuery, actor: ActorContext) -> Result<PublicationAcceptanceView, ApiError>` |
| HTTP / RPC / Event 名称 | `GET /v1/bus/publications/{publication_id}` |
| 调用方 | publisher / operator |
| 处理方 | `BusQueryApi` -> `ReadOutputService` |

请求 schema：

```json
{
  "publication_id": "pub_01"
}
```

响应 schema：

```json
{
  "publication_id": "pub_01",
  "acceptance_status": "accepted",
  "source_record_ref": "process_event_01",
  "core_event_ref": "core_event_contract_01",
  "core_event_envelope_ref": null,
  "payload_ref": "artifact_ref_01",
  "delivery_mode": "at_least_once",
  "target_scope": {
    "project_id": "project_01",
    "topic": "workitem.events"
  },
  "audit_ref": "audit_01"
}
```

Rust DTO：

```rust
/// 查询 publication acceptance 的 query DTO。
pub struct GetPublicationAcceptanceQuery {
    /// Publication ID。
    pub publication_id: PublicationId,
}
```

错误映射与要求：

| 项 | 内容 |
|---|---|
| 错误映射 | `404 NotFoundError`、`503 DependencyError`、`500 InternalError` |
| 幂等 | 不需要 |
| 审计 | 只读访问可记录 access audit，不改写真相 |

#### 7.4.2 `GetDeliveryStatus`

| 项 | 内容 |
|---|---|
| 用途 | 查询 delivery 当前状态 |
| 函数签名 | `get_delivery_status(query: GetDeliveryStatusQuery, actor: ActorContext) -> Result<DeliveryStatusView, ApiError>` |
| HTTP / RPC / Event 名称 | `GET /v1/bus/deliveries/{delivery_id}` |
| 调用方 | publisher / subscriber / operator |
| 处理方 | `BusQueryApi` -> `ReadOutputService` |

请求 schema：

```json
{
  "delivery_id": "delivery_01"
}
```

响应 schema：

```json
{
  "delivery_id": "delivery_01",
  "publication_id": "pub_01",
  "delivery_status": "completed",
  "current_attempt_id": "attempt_01",
  "last_feedback_id": "feedback_01",
  "consistency_marker": "committed"
}
```

Rust DTO：

```rust
/// 查询 delivery 状态的 query DTO。
pub struct GetDeliveryStatusQuery {
    /// Delivery ID。
    pub delivery_id: DeliveryId,
}
```

错误映射与要求：

| 项 | 内容 |
|---|---|
| 错误映射 | `404 NotFoundError`、`503 DependencyError`、`500 InternalError` |
| 幂等 | 不需要 |
| 审计 | 可记录只读 access audit |

#### 7.4.3 `ListDeliveryHistory`

| 项 | 内容 |
|---|---|
| 用途 | 分页查询 delivery history |
| 函数签名 | `list_delivery_history(query: ListDeliveryHistoryQuery, actor: ActorContext) -> Result<DeliveryHistoryPage, ApiError>` |
| HTTP / RPC / Event 名称 | `GET /v1/bus/deliveries/{delivery_id}/history` |
| 调用方 | operator / observability |
| 处理方 | `BusQueryApi` -> `ReadOutputService` |

请求 schema：

```json
{
  "delivery_id": "delivery_01",
  "page_size": 50,
  "page_cursor": "cursor_01"
}
```

响应 schema：

```json
{
  "delivery_id": "delivery_01",
  "items": [
    {
      "history_id": "history_01",
      "from_status": "dispatched",
      "to_status": "completed",
      "reason": "feedback_ack",
      "occurred_at": "2026-05-29T10:00:00Z"
    }
  ],
  "next_cursor": null
}
```

Rust DTO：

```rust
/// 查询 delivery history 的 query DTO。
pub struct ListDeliveryHistoryQuery {
    /// Delivery ID。
    pub delivery_id: DeliveryId,
    /// 分页请求。
    pub page: PageRequest,
}
```

错误映射与要求：

| 项 | 内容 |
|---|---|
| 错误映射 | `400 ValidationError`、`404 NotFoundError`、`503 DependencyError` |
| 幂等 | 不需要 |
| 审计 | 可记录只读 access audit |

#### 7.4.4 `GetTransportView`

| 项 | 内容 |
|---|---|
| 用途 | 查询 SDK / consumer 面向的 transport view |
| 函数签名 | `get_transport_view(query: GetTransportViewQuery, actor: ActorContext) -> Result<TransportView, ApiError>` |
| HTTP / RPC / Event 名称 | `GET /v1/bus/transport-views/{transport_view_id}` |
| 调用方 | SDK / consumer / operator |
| 处理方 | `BusQueryApi` -> `ReadOutputService` |

请求 schema：

```json
{
  "transport_view_id": "transport_view_01"
}
```

响应 schema：

```json
{
  "transport_view_id": "transport_view_01",
  "delivery_id": "delivery_01",
  "transport_status": "completed",
  "transport_semantic": "at_least_once",
  "projection_version": "projection_v1",
  "consistency_marker": "committed"
}
```

Rust DTO：

```rust
/// 查询 transport view 的 query DTO。
pub struct GetTransportViewQuery {
    /// Transport view ID。
    pub transport_view_id: TransportViewId,
}
```

错误映射与要求：

| 项 | 内容 |
|---|---|
| 错误映射 | `404 NotFoundError`、`409 ConflictError` for stale marker、`503 DependencyError` |
| 幂等 | 不需要 |
| 审计 | 不改写真相；projection missing 时返回 not ready / consistency marker |

#### 7.4.5 `GetFailureSummary`

| 项 | 内容 |
|---|---|
| 用途 | 查询 failure summary projection |
| 函数签名 | `get_failure_summary(query: GetFailureSummaryQuery, actor: ActorContext) -> Result<FailureSummaryView, ApiError>` |
| HTTP / RPC / Event 名称 | `GET /v1/bus/failure-summaries/{failure_summary_id}` |
| 调用方 | operator / governance |
| 处理方 | `BusQueryApi` -> `ReadOutputService` |

请求 schema：

```json
{
  "failure_summary_id": "failure_summary_01"
}
```

响应 schema：

```json
{
  "failure_summary_id": "failure_summary_01",
  "delivery_id": "delivery_01",
  "failure_material_ref": "failure_material_01",
  "failure_kind": "transport_failure",
  "governance_decision_ref": null
}
```

Rust DTO：

```rust
/// 查询 failure summary 的 query DTO。
pub struct GetFailureSummaryQuery {
    /// Failure summary ID。
    pub failure_summary_id: FailureSummaryId,
}
```

错误映射与要求：

| 项 | 内容 |
|---|---|
| 错误映射 | `404 NotFoundError`、`503 DependencyError` |
| 幂等 | 不需要 |
| 审计 | 返回 failure material ref，不返回治理决策正文 |

#### 7.4.6 `GetBusAuditTrail`

| 项 | 内容 |
|---|---|
| 用途 | 查询 bus audit trail |
| 函数签名 | `get_bus_audit_trail(query: GetBusAuditTrailQuery, actor: ActorContext) -> Result<BusAuditTrailView, ApiError>` |
| HTTP / RPC / Event 名称 | `GET /v1/bus/audit-trail` |
| 调用方 | operator / audit viewer |
| 处理方 | `BusQueryApi` -> `ReadOutputService` |

请求 schema：

```json
{
  "record_ref": "delivery_01",
  "event_kind": "delivery_state_changed",
  "page_size": 50,
  "page_cursor": "cursor_01"
}
```

响应 schema：

```json
{
  "items": [
    {
      "audit_id": "audit_01",
      "record_ref": "delivery_01",
      "event_kind": "delivery_state_changed",
      "actor_ref": "member_01",
      "occurred_at": "2026-05-29T10:00:00Z"
    }
  ],
  "next_cursor": null
}
```

Rust DTO：

```rust
/// 查询 bus audit trail 的 query DTO。
pub struct GetBusAuditTrailQuery {
    /// 审计过滤条件。
    pub filter: AuditFilter,
    /// 分页请求。
    pub page: PageRequest,
}
```

错误映射与要求：

| 项 | 内容 |
|---|---|
| 错误映射 | `400 ValidationError`、`503 DependencyError` |
| 幂等 | 不需要 |
| 审计 | audit query 自身可记录 access audit，但不得修改被查询 audit |

#### 7.4.7 `GetBackendHealthView`

| 项 | 内容 |
|---|---|
| 用途 | 查询 backend capability / health 只读视图 |
| 函数签名 | `get_backend_health_view(query: GetBackendHealthViewQuery, actor: ActorContext) -> Result<BackendHealthView, ApiError>` |
| HTTP / RPC / Event 名称 | `GET /v1/bus/backends/{backend_id}/health` |
| 调用方 | operator / observability |
| 处理方 | `BusQueryApi` -> `ReadOutputService` |

请求 schema：

```json
{
  "backend_id": "backend_01"
}
```

响应 schema：

```json
{
  "backend_id": "backend_01",
  "backend_kind": "in_memory",
  "capability_status": "available",
  "last_checked_at": "2026-05-29T10:00:00Z",
  "secret_ref": null
}
```

Rust DTO：

```rust
/// 查询 backend health view 的 query DTO。
pub struct GetBackendHealthViewQuery {
    /// Backend ID。
    pub backend_id: BackendId,
}
```

错误映射与要求：

| 项 | 内容 |
|---|---|
| 错误映射 | `404 NotFoundError`、`503 DependencyError` |
| 幂等 | 不需要 |
| 审计 | 不返回 secret 明文，只返回能力状态 |

### 7.5 Inbound Event Consumer 协议

#### 7.5.1 `ConsumeCommittedOutboxFact`

| 项 | 内容 |
|---|---|
| 用途 | 消费 L0-core 已提交 outbox fact，转换为 bus publication material |
| 函数签名 | `consume_committed_outbox_fact(input: CommittedOutboxFactInput, actor: ActorContext, meta: EventMetadata) -> Result<OutboxRelayResult, ConsumerError>` |
| HTTP / RPC / Event 名称 | `core.outbox.committed.v1` / `OutboxFactSourcePort.poll_committed()` |
| 调用方 / 发布方 | L0-core outbox source |
| 处理方 / 订阅方 | `OutboxRelayConsumer` -> `PublicationAcceptanceService` |

输入 schema：

```json
{
  "event_id": "event_01",
  "source_ref": "l0_core_outbox",
  "core_event_envelope_ref": "core_event_01",
  "core_event_ref": "core_event_contract_01",
  "committed_fact_ref": "outbox_fact_01",
  "source_system": "l0-core",
  "source_record_ref": "core_record_01",
  "payload_ref": "artifact_ref_01",
  "payload_kind": "artifact_ref",
  "payload_digest": "sha256:...",
  "delivery_mode": "at_least_once",
  "target_scope": {
    "project_id": "project_01",
    "topic": "workitem.events"
  },
  "idempotency_key": "idem_01"
}
```

输出 schema：

```json
{
  "publication_id": "pub_01",
  "relay_status": "accepted",
  "audit_ref": "audit_06"
}
```

Rust DTO：

```rust
/// 已提交 outbox fact 输入 DTO。
pub struct CommittedOutboxFactInput {
    /// 事件 ID。
    pub event_id: EventId,
    /// 来源引用。
    pub source_ref: EventSourceRef,
    /// L0-core event envelope 引用。
    pub core_event_envelope_ref: CoreEventEnvelopeRef,
    /// L0-core 事件契约引用，由 outbox source adapter 从 envelope metadata 中解析或补齐。
    pub core_event_ref: CoreEventRef,
    /// 已提交 fact 引用。
    pub committed_fact_ref: CommittedOutboxFactRef,
    /// 来源系统。
    pub source_system: SourceSystem,
    /// 来源记录引用。
    pub source_record_ref: SourceRecordRef,
    /// payload 引用。
    pub payload_ref: PayloadRef,
    /// payload 类型。
    pub payload_kind: PayloadKind,
    /// payload 摘要。
    pub payload_digest: PayloadDigest,
    /// 平台投递语义请求值；P0 只允许 at_least_once。
    pub delivery_mode: DeliveryMode,
    /// 目标范围。
    pub target_scope: TargetScope,
    /// 幂等键。
    pub idempotency_key: IdempotencyKey,
}
```

outbox fact 到 `PublicationMaterial` 的映射规则：

| 输入字段 | 领域字段 | 规则 |
|---|---|---|
| `core_event_ref` | `PublicationMaterial.core_event_ref` | 必填；这是正式 core 事件契约引用 |
| `core_event_envelope_ref` | `PublicationMaterial.core_event_envelope_ref` | 必填；这是已提交 envelope 实例引用，只用于来源追溯和审计 |
| `delivery_mode` | `PublicationMaterial.delivery_mode` | 必填；P0 只允许 `at_least_once` |
| `target_scope` | `PublicationMaterial.target_scope` | 必填；后续 `TransportSemantic::derive(...)` 需要它与订阅范围匹配 |
| `payload_ref` / `payload_kind` / `payload_digest` | `PublicationMaterial` payload 字段 | 必填；只保存引用、类型和摘要，不读取 payload body |

`core_event_envelope_ref` 不能被当成 `core_event_ref` 使用。若 outbox source adapter 无法从 envelope metadata 中解析或补齐 `core_event_ref`，本 consumer 必须返回 validation / rejected result，不得形成 accepted publication truth。

错误、幂等与审计：

| 项 | 内容 |
|---|---|
| 错误映射 | validation -> rejected；duplicate -> existing result；dependency -> retryable failure |
| 幂等 | `event_id + source_ref + idempotency_key` |
| 审计 | accepted / rejected / duplicate 都必须可追踪 |

字段约束：

| 字段 | 约束 |
|---|---|
| `core_event_ref` | 必填，缺失或无法从 envelope metadata 解析时不得 accepted |
| `core_event_envelope_ref` | 必填，仅表示已提交 envelope 实例，不得替代 `core_event_ref` |
| `delivery_mode` | P0 只允许协议值 `at_least_once`，映射到领域 `DeliveryMode::AtLeastOnce` |
| `target_scope` | 必填，必须可映射为领域 `SubscriberScope` |

#### 7.5.2 `ConsumeBackendDeliverySignal`

| 项 | 内容 |
|---|---|
| 用途 | 消费后端 delivery signal，并归一化为 bus feedback / delivery result |
| 函数签名 | `consume_backend_delivery_signal(input: BackendDeliverySignalInput, actor: ActorContext, meta: EventMetadata) -> Result<BackendSignalResult, ConsumerError>` |
| HTTP / RPC / Event 名称 | `bus.backend.delivery_signal.v1` |
| 调用方 / 发布方 | transport backend adapter |
| 处理方 / 订阅方 | `BackendSignalConsumer` -> `FeedbackRecordingService` |

输入 schema：

```json
{
  "event_id": "event_02",
  "source_ref": "backend_adapter_01",
  "delivery_id": "delivery_01",
  "attempt_id": "attempt_01",
  "backend_capability_ref": "backend_capability_01",
  "backend_status": "delivered",
  "backend_result_ref": "backend_result_01",
  "idempotency_key": "idem_02"
}
```

输出 schema：

```json
{
  "delivery_id": "delivery_01",
  "attempt_id": "attempt_01",
  "normalized_result": "ack",
  "feedback_id": "feedback_02",
  "audit_ref": "audit_07"
}
```

Rust DTO：

```rust
/// 后端 delivery signal 输入 DTO。
pub struct BackendDeliverySignalInput {
    /// 事件 ID。
    pub event_id: EventId,
    /// 来源引用。
    pub source_ref: EventSourceRef,
    /// Delivery ID。
    pub delivery_id: DeliveryId,
    /// Attempt ID。
    pub attempt_id: AttemptId,
    /// 后端能力引用。
    pub backend_capability_ref: BackendCapabilityRef,
    /// 后端状态摘要。
    pub backend_status: BackendStatus,
    /// 后端结果引用，禁止保存私有响应正文。
    pub backend_result_ref: BackendResultRef,
    /// 幂等键。
    pub idempotency_key: IdempotencyKey,
}
```

错误、幂等与审计：

| 项 | 内容 |
|---|---|
| 错误映射 | unknown delivery -> ignored or audited dead signal；invalid backend status -> rejected；dependency -> retryable |
| 幂等 | `event_id + source_ref + idempotency_key` |
| 审计 | 归一化前后必须保留引用链，不保存后端私有正文 |

#### 7.5.3 `ConsumeTimeoutSignal`

| 项 | 内容 |
|---|---|
| 用途 | 消费 timeout signal，形成 bus 级 timeout feedback |
| 函数签名 | `consume_timeout_signal(input: DeliveryTimeoutSignalInput, actor: ActorContext, meta: EventMetadata) -> Result<TimeoutRecordResult, ConsumerError>` |
| HTTP / RPC / Event 名称 | `bus.delivery.timeout.v1` |
| 调用方 / 发布方 | scheduler / clock source |
| 处理方 / 订阅方 | `TimeoutSignalConsumer` -> `FeedbackRecordingService` |

输入 schema：

```json
{
  "event_id": "event_03",
  "source_ref": "scheduler_01",
  "delivery_id": "delivery_01",
  "attempt_id": "attempt_01",
  "timeout_reason": "dispatch_timeout",
  "occurred_at": "2026-05-29T10:00:00Z",
  "idempotency_key": "idem_03"
}
```

输出 schema：

```json
{
  "delivery_id": "delivery_01",
  "feedback_id": "feedback_03",
  "feedback_status": "timeout_recorded",
  "recovery_candidate": true,
  "audit_ref": "audit_08"
}
```

Rust DTO：

```rust
/// Delivery timeout signal 输入 DTO。
pub struct DeliveryTimeoutSignalInput {
    /// 事件 ID。
    pub event_id: EventId,
    /// 来源引用。
    pub source_ref: EventSourceRef,
    /// Delivery ID。
    pub delivery_id: DeliveryId,
    /// Attempt ID。
    pub attempt_id: AttemptId,
    /// Timeout 原因。
    pub timeout_reason: TimeoutReason,
    /// 发生时间。
    pub occurred_at: Timestamp,
    /// 幂等键。
    pub idempotency_key: IdempotencyKey,
}
```

错误、幂等与审计：

| 项 | 内容 |
|---|---|
| 错误映射 | unknown delivery -> audited no-op；state conflict -> conflict result；dependency -> retryable |
| 幂等 | `event_id + source_ref + idempotency_key` |
| 审计 | timeout 是 bus 级反馈，不代表业务失败正文 |

### 7.6 Outbound Event 协议

#### 7.6.1 Outbound event 公共版本策略

| 项 | 内容 |
|---|---|
| Envelope | 复用 L0-core event envelope / CloudEvent contract |
| Payload version | topic 后缀使用 `.v1`，payload 内也保留 `schema_version` |
| 兼容原则 | v1 字段只允许向后兼容新增，不允许改变既有字段语义 |
| 禁止字段 | payload body、secret、后端私有响应正文、治理决策正文 |

#### 7.6.2 `PublicationAcceptedEvent`

| 项 | 内容 |
|---|---|
| Event 名称 | `bus.publication.accepted.v1` |
| 发布方 | `OutboxPublisherService` |
| 订阅方 | delivery worker、read output、observability |
| 版本策略 | additive-only v1 |

```json
{
  "schema_version": "v1",
  "publication_id": "pub_01",
  "core_event_ref": "core_event_contract_01",
  "core_event_envelope_ref": null,
  "source_record_ref": "process_event_01",
  "payload_ref": "artifact_ref_01",
  "delivery_mode": "at_least_once",
  "target_scope": {
    "project_id": "project_01",
    "topic": "workitem.events"
  },
  "audit_ref": "audit_01"
}
```

#### 7.6.3 `PublicationRejectedEvent`

| 项 | 内容 |
|---|---|
| Event 名称 | `bus.publication.rejected.v1` |
| 发布方 | `OutboxPublisherService` |
| 订阅方 | publisher、operator、observability |
| 版本策略 | additive-only v1 |

```json
{
  "schema_version": "v1",
  "publication_id": "pub_01",
  "source_record_ref": "process_event_01",
  "rejection_reason_ref": "reject_reason_01",
  "audit_ref": "audit_02"
}
```

#### 7.6.4 `DeliveryStateChangedEvent`

| 项 | 内容 |
|---|---|
| Event 名称 | `bus.delivery.state_changed.v1` |
| 发布方 | `OutboxPublisherService` |
| 订阅方 | read output、observability、operator |
| 版本策略 | additive-only v1 |

```json
{
  "schema_version": "v1",
  "delivery_id": "delivery_01",
  "from_status": "dispatched",
  "to_status": "completed",
  "history_ref": "history_01",
  "audit_ref": "audit_03"
}
```

#### 7.6.5 `FeedbackRecordedEvent`

| 项 | 内容 |
|---|---|
| Event 名称 | `bus.feedback.recorded.v1` |
| 发布方 | `OutboxPublisherService` |
| 订阅方 | recovery worker、read output、observability |
| 版本策略 | additive-only v1 |

```json
{
  "schema_version": "v1",
  "feedback_id": "feedback_01",
  "delivery_id": "delivery_01",
  "feedback_kind": "ack",
  "feedback_status": "recorded",
  "audit_ref": "audit_04"
}
```

#### 7.6.6 `DeadLetterCreatedEvent`

| 项 | 内容 |
|---|---|
| Event 名称 | `bus.dead_letter.created.v1` |
| 发布方 | `OutboxPublisherService` |
| 订阅方 | governance、operator、observability |
| 版本策略 | additive-only v1 |

```json
{
  "schema_version": "v1",
  "dead_letter_id": "dlq_01",
  "delivery_id": "delivery_01",
  "failure_material_ref": "failure_material_01",
  "audit_ref": "audit_05"
}
```

#### 7.6.7 `ReplayPreparationReadyEvent`

| 项 | 内容 |
|---|---|
| Event 名称 | `bus.replay_preparation.ready.v1` |
| 发布方 | `OutboxPublisherService` |
| 订阅方 | operator、governance、replay executor |
| 版本策略 | additive-only v1 |

```json
{
  "schema_version": "v1",
  "replay_preparation_id": "replay_prep_01",
  "dead_letter_id": "dlq_01",
  "approval_ref": "approval_01",
  "audit_ref": "audit_06"
}
```

#### 7.6.8 `TransportViewUpdatedEvent`

| 项 | 内容 |
|---|---|
| Event 名称 | `bus.transport_view.updated.v1` |
| 发布方 | `OutboxPublisherService` |
| 订阅方 | SDK、consumer、observability |
| 版本策略 | additive-only v1 |

```json
{
  "schema_version": "v1",
  "transport_view_id": "transport_view_01",
  "delivery_id": "delivery_01",
  "projection_version": "projection_v1",
  "consistency_marker": "committed"
}
```

#### 7.6.9 `FailureMaterialAvailableEvent`

| 项 | 内容 |
|---|---|
| Event 名称 | `bus.failure_material.available.v1` |
| 发布方 | `OutboxPublisherService` |
| 订阅方 | governance、operator、observability |
| 版本策略 | additive-only v1 |

```json
{
  "schema_version": "v1",
  "failure_material_ref": "failure_material_01",
  "delivery_id": "delivery_01",
  "failure_kind": "transport_failure",
  "audit_ref": "audit_07"
}
```

#### 7.6.10 `BackendCapabilityChangedEvent`

| 项 | 内容 |
|---|---|
| Event 名称 | `bus.backend.capability_changed.v1` |
| 发布方 | `OutboxPublisherService` |
| 订阅方 | operator、observability |
| 版本策略 | additive-only v1 |

```json
{
  "schema_version": "v1",
  "backend_id": "backend_01",
  "backend_kind": "in_memory",
  "capability_status": "available",
  "checked_at": "2026-05-29T10:00:00Z"
}
```

#### 7.6.11 Outbound event 错误、幂等与审计要求

| 项 | 内容 |
|---|---|
| 错误映射 | publisher dependency failure -> retryable publish failure；schema violation -> non-retryable publish rejection |
| 幂等 | `event_id + source_record_ref + schema_version` |
| 审计 | publish receipt 必须可追踪，失败必须保留 retry evidence |

### 7.7 Operations Job 协议

#### 7.7.1 `RunOutboxRelay`

| 项 | 内容 |
|---|---|
| 用途 | 扫描 L0-core 已提交 outbox fact 并接入 bus |
| 函数签名 | `run_outbox_relay(job: RunOutboxRelayJob, actor: ActorContext, meta: JobMetadata) -> Result<OutboxRelayJobResult, JobError>` |
| Job 名称 | `bus.run_outbox_relay` |
| 触发方式 | scheduler / CLI |
| 处理方 | `OutboxRelayJobRunner` |

输入 schema：

```json
{
  "job_run_id": "job_run_01",
  "cursor": "outbox_cursor_01",
  "batch_size": 100,
  "dry_run": false
}
```

输出 schema：

```json
{
  "job_run_id": "job_run_01",
  "scanned": 100,
  "accepted": 98,
  "rejected": 2,
  "next_cursor": "outbox_cursor_02"
}
```

幂等与审计：

| 项 | 内容 |
|---|---|
| 幂等 | `job_run_id + cursor`；单条 fact 仍使用 event id / idempotency key |
| 审计 | job summary 需要记录 scanned / accepted / rejected |
| 错误 | source unavailable -> retryable；schema violation -> rejected item |

#### 7.7.2 `RunDeliveryProgression`

| 项 | 内容 |
|---|---|
| 用途 | 扫描可推进 delivery 并执行后端投递 |
| 函数签名 | `run_delivery_progression(job: RunDeliveryProgressionJob, actor: ActorContext, meta: JobMetadata) -> Result<DeliveryProgressionResult, JobError>` |
| Job 名称 | `bus.run_delivery_progression` |
| 触发方式 | scheduler / CLI |
| 处理方 | `DeliveryProgressionJobRunner` |

输入 schema：

```json
{
  "job_run_id": "job_run_02",
  "cursor": "delivery_cursor_01",
  "batch_size": 50,
  "backend_id": "backend_01"
}
```

输出 schema：

```json
{
  "job_run_id": "job_run_02",
  "scanned": 50,
  "dispatched": 45,
  "skipped": 5,
  "next_cursor": "delivery_cursor_02"
}
```

幂等与审计：

| 项 | 内容 |
|---|---|
| 幂等 | `job_run_id + delivery_id + attempt_id` |
| 审计 | 每个状态变化写 audit；job summary 记录批次结果 |
| 错误 | backend unavailable -> retryable；state conflict -> skipped with audit |

#### 7.7.3 `RunRetryCycle`

| 项 | 内容 |
|---|---|
| 用途 | 扫描到期 retry plan 并触发新 delivery attempt |
| 函数签名 | `run_retry_cycle(job: RunRetryCycleJob, actor: ActorContext, meta: JobMetadata) -> Result<RetryCycleResult, JobError>` |
| Job 名称 | `bus.run_retry_cycle` |
| 触发方式 | scheduler / CLI |
| 处理方 | `RetryCycleJobRunner` |

输入 schema：

```json
{
  "job_run_id": "job_run_03",
  "cursor": "retry_cursor_01",
  "batch_size": 50,
  "now": "2026-05-29T10:00:00Z"
}
```

输出 schema：

```json
{
  "job_run_id": "job_run_03",
  "scanned": 50,
  "retried": 20,
  "exhausted": 3,
  "next_cursor": "retry_cursor_02"
}
```

幂等与审计：

| 项 | 内容 |
|---|---|
| 幂等 | `retry_plan_id + attempt_index` |
| 审计 | retry scheduled / executed / exhausted 均记录 |
| 错误 | backend unavailable -> retryable；retry exhausted -> non-retryable result |

#### 7.7.4 `RunReadOutputProjection`

| 项 | 内容 |
|---|---|
| 用途 | 基于已提交 truth / audit 增量更新只读投影 |
| 函数签名 | `run_read_output_projection(job: RunReadOutputProjectionJob, actor: ActorContext, meta: JobMetadata) -> Result<ProjectionJobResult, JobError>` |
| Job 名称 | `bus.run_read_output_projection` |
| 触发方式 | scheduler / CLI |
| 处理方 | `ReadOutputProjectionJobRunner` |

输入 schema：

```json
{
  "job_run_id": "job_run_04",
  "audit_cursor": "audit_cursor_01",
  "batch_size": 100,
  "projection_kinds": ["transport_view", "failure_summary"]
}
```

输出 schema：

```json
{
  "job_run_id": "job_run_04",
  "scanned": 100,
  "updated": 80,
  "skipped": 20,
  "next_audit_cursor": "audit_cursor_02"
}
```

幂等与审计：

| 项 | 内容 |
|---|---|
| 幂等 | `projection_key + source_audit_sequence` |
| 审计 | projection write receipt 可追踪 |
| 错误 | projection store unavailable -> retryable；source truth missing -> skipped with marker |

#### 7.7.5 `RebuildReadProjection`

| 项 | 内容 |
|---|---|
| 用途 | 受控重建只读投影，不改写 bus truth |
| 函数签名 | `rebuild_read_projection(job: RebuildReadProjectionJob, actor: ActorContext, meta: JobMetadata) -> Result<ProjectionRebuildResult, JobError>` |
| Job 名称 | `bus.rebuild_read_projection` |
| 触发方式 | operator / CLI |
| 处理方 | `ProjectionRebuildJobRunner` |

输入 schema：

```json
{
  "job_run_id": "job_run_05",
  "rebuild_scope": {
    "projection_kinds": ["transport_view"],
    "from_cursor": "truth_cursor_01"
  },
  "replace_mode": "batch_replace",
  "dry_run": false
}
```

输出 schema：

```json
{
  "job_run_id": "job_run_05",
  "rebuilt": 1000,
  "failed": 0,
  "projection_version": "projection_v2"
}
```

幂等与审计：

| 项 | 内容 |
|---|---|
| 幂等 | `job_run_id + rebuild_scope` |
| 审计 | rebuild start / finish / failure 必须记录 |
| 错误 | version conflict -> conflict；store unavailable -> retryable |

#### 7.7.6 `CheckBackendCapability`

| 项 | 内容 |
|---|---|
| 用途 | 检查 backend capability 并更新 backend health view |
| 函数签名 | `check_backend_capability(job: CheckBackendCapabilityJob, actor: ActorContext, meta: JobMetadata) -> Result<BackendCapabilityCheckResult, JobError>` |
| Job 名称 | `bus.check_backend_capability` |
| 触发方式 | scheduler / CLI |
| 处理方 | `BackendCapabilityJobRunner` |

输入 schema：

```json
{
  "job_run_id": "job_run_06",
  "backend_id": "backend_01",
  "backend_kind": "in_memory",
  "capability_ref": "backend_capability_01"
}
```

输出 schema：

```json
{
  "job_run_id": "job_run_06",
  "backend_id": "backend_01",
  "capability_status": "available",
  "checked_at": "2026-05-29T10:00:00Z"
}
```

幂等与审计：

| 项 | 内容 |
|---|---|
| 幂等 | `job_run_id + backend_id` |
| 审计 | capability check result 必须可追踪 |
| 错误 | backend unavailable -> degraded status；secret unavailable -> dependency error |

### 7.8 全局 API / Command / Query / Event / Job 索引

| 名称 | 类别 | 所属模块 | 协议定义位置 | 处理流位置 |
|---|---|---|---|---|
| `AcceptPublication` | Command API | `api` / `contracts` | 本文件 §7.3.1 | Step 9 |
| `RecordDeliveryFeedback` | Command API | `api` / `contracts` | 本文件 §7.3.2 | Step 9 |
| `RequestRetry` | Command API | `api` / `contracts` | 本文件 §7.3.3 | Step 9 |
| `MoveDeliveryToDeadLetter` | Command API | `api` / `contracts` | 本文件 §7.3.4 | Step 9 |
| `PrepareReplay` | Command API | `api` / `contracts` | 本文件 §7.3.5 | Step 9 |
| `GetPublicationAcceptance` | Query API | `api` / `contracts` | 本文件 §7.4.1 | Step 9 通用只读流 |
| `GetDeliveryStatus` | Query API | `api` / `contracts` | 本文件 §7.4.2 | Step 9 通用只读流 |
| `ListDeliveryHistory` | Query API | `api` / `contracts` | 本文件 §7.4.3 | Step 9 通用只读流 |
| `GetTransportView` | Query API | `api` / `contracts` | 本文件 §7.4.4 | Step 9 通用只读流 |
| `GetFailureSummary` | Query API | `api` / `contracts` | 本文件 §7.4.5 | Step 9 通用只读流 |
| `GetBusAuditTrail` | Query API | `api` / `contracts` | 本文件 §7.4.6 | Step 9 通用只读流 |
| `GetBackendHealthView` | Query API | `api` / `contracts` | 本文件 §7.4.7 | Step 9 通用只读流 |
| `ConsumeCommittedOutboxFact` | Inbound Event Consumer | `worker` / `contracts` | 本文件 §7.5.1 | Step 9 |
| `ConsumeBackendDeliverySignal` | Inbound Event Consumer | `worker` / `contracts` | 本文件 §7.5.2 | Step 9 |
| `ConsumeTimeoutSignal` | Inbound Event Consumer | `worker` / `contracts` | 本文件 §7.5.3 | Step 9 |
| `PublicationAcceptedEvent` | Outbound Event | `contracts` / publisher | 本文件 §7.6.2 | Step 9 通用发布流 |
| `PublicationRejectedEvent` | Outbound Event | `contracts` / publisher | 本文件 §7.6.3 | Step 9 通用发布流 |
| `DeliveryStateChangedEvent` | Outbound Event | `contracts` / publisher | 本文件 §7.6.4 | Step 9 通用发布流 |
| `FeedbackRecordedEvent` | Outbound Event | `contracts` / publisher | 本文件 §7.6.5 | Step 9 通用发布流 |
| `DeadLetterCreatedEvent` | Outbound Event | `contracts` / publisher | 本文件 §7.6.6 | Step 9 通用发布流 |
| `ReplayPreparationReadyEvent` | Outbound Event | `contracts` / publisher | 本文件 §7.6.7 | Step 9 通用发布流 |
| `TransportViewUpdatedEvent` | Outbound Event | `contracts` / publisher | 本文件 §7.6.8 | Step 9 通用发布流 |
| `FailureMaterialAvailableEvent` | Outbound Event | `contracts` / publisher | 本文件 §7.6.9 | Step 9 通用发布流 |
| `BackendCapabilityChangedEvent` | Outbound Event | `contracts` / publisher | 本文件 §7.6.10 | Step 9 通用发布流 |
| `RunOutboxRelay` | Operations Job | `jobs` / `contracts` | 本文件 §7.7.1 | Step 9 |
| `RunDeliveryProgression` | Operations Job | `jobs` / `contracts` | 本文件 §7.7.2 | Step 9 |
| `RunRetryCycle` | Operations Job | `jobs` / `contracts` | 本文件 §7.7.3 | Step 9 |
| `RunReadOutputProjection` | Operations Job | `jobs` / `contracts` | 本文件 §7.7.4 | Step 9 |
| `RebuildReadProjection` | Operations Job | `jobs` / `contracts` | 本文件 §7.7.5 | Step 9 |
| `CheckBackendCapability` | Operations Job | `jobs` / `contracts` | 本文件 §7.7.6 | Step 9 |

---

## 8. 回填草稿

正式 `03-详细设计.md` 的 §7 和 §6 按以下方式回填：

```md
## 7. API / Command / Query / Event / Job 协议契约

### 7.1 协议总表

从 `design-calibration/03_ddd_step_08_protocol_contracts.md` §7.1 摘录。

### 7.2 公共协议约定

从 `design-calibration/03_ddd_step_08_protocol_contracts.md` §7.2 摘录。

### 7.3 Command API 协议

从 `design-calibration/03_ddd_step_08_protocol_contracts.md` §7.3 摘录。

### 7.4 Query API 协议

从 `design-calibration/03_ddd_step_08_protocol_contracts.md` §7.4 摘录。

### 7.5 Inbound Event Consumer 协议

从 `design-calibration/03_ddd_step_08_protocol_contracts.md` §7.5 摘录。

### 7.6 Outbound Event 协议

从 `design-calibration/03_ddd_step_08_protocol_contracts.md` §7.6 摘录。

### 7.7 Operations Job 协议

从 `design-calibration/03_ddd_step_08_protocol_contracts.md` §7.7 摘录。

## 6. 全局对象 / Trait / API 索引

### 6.3 API / Command / Query / Event / Job 索引

从 `design-calibration/03_ddd_step_08_protocol_contracts.md` §7.8 摘录。
```

说明：

- 正式文档若完全摘录本文件已有章节，不重复写回填草稿中的内容。
- Step 9 必须按 §7.8 中标记的处理流位置继续展开函数级数据流。
- Step 12 需要把本步错误映射细化为正式错误类型和异常分支。

---

## 9. 待确认事项

| 待确认事项 | 方案 | 推荐 | 原因 |
|---|---|---|---|
| Command / Query P0 是否固定 HTTP JSON | A. 固定 HTTP JSON；B. 改为 gRPC；C. 仅 crate API | 推荐 A | P0 最易实现和测试，后续可追加 gRPC adapter |
| Job 是否提供 HTTP trigger | A. P0 提供；B. P0 只提供 CLI / scheduler；C. 只内部 loop | 推荐 B | 降低 API 面，仍支持运维触发 |
| Outbound event 是否定义完整 CloudEvent envelope | A. 本仓完整定义；B. 只定义 payload，envelope 复用 L0-core；C. 不定义 schema | 推荐 B | 避免重复 L0-core 契约，同时保证 bus payload 清晰 |
| Query projection missing 是否自动 rebuild | A. 自动 rebuild；B. 返回 consistency marker；C. 返回 500 | 推荐 B | Query 不应产生隐藏写副作用 |
| `MoveDeliveryToDeadLetter` / `PrepareReplay` 是否必须幂等键 | A. 必须；B. 建议；C. 不需要 | 推荐 B | operator 场景需要去重，但可由 `delivery_id + target state` 辅助约束 |

---

## 10. 进入下一步条件

```text
所有需要实现的协议入口已有明确签名、route / topic / job name、schema、错误映射和处理方。
Command / Query / Event / Job 已能回指 Step 6 对象和 Step 7 port。
可以进入 Step 9,逐接口定义函数级处理流。
```
