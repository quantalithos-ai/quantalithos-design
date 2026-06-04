# Step 8. 定义 API / Command / Query / Event / Job 协议契约

## 1. Step 状态

- 状态: `[x] 已确认`
- 对应 SOP: `standards/document/详细设计讨论流程_SOP.md` Step 8
- 回填章节: `projects/L1-conversation/03-详细设计.md` §7 API / Command / Query / Event / Job 协议契约 / §6 全局 API 索引

---

## 2. 本步输入

| 输入 | 内容 | 本步使用方式 |
|---|---|---|
| `02_hld_step_07_api_interface_skeleton.md` | Command、Query、Inbound Consumer、Outbound Event、Operations Job 骨架 | 作为协议全集来源 |
| `03_ddd_step_05_module_contracts_axis.md` | 模块主轴和 handler / worker / job 归属 | 确定处理方模块 |
| `03_ddd_step_06_object_contracts.md` | Domain 对象、状态 enum、字段和工厂函数 | 确认协议能构造或影响哪些对象 |
| `03_ddd_step_07_trait_port_adapter_contracts.md` | repository、resolver、publisher、handoff、technical port | 确认协议依赖哪些 port,但不写处理流 |
| `standards/document/详细设计书写规范.md` §5.7 | 协议总表、单协议小节、schema、错误映射、幂等与审计格式 | 作为本步输出格式 |

已确认结论:

```text
Command API 写入本仓 truth 或 handoff intent,由 api handler 调 application service。
Query API 只读取 truth / projection / read model,不得写 truth。
Inbound Event Consumer 消化来源事实,由 worker consumer 调 application service。
Outbound Event 只来自已提交 truth / outbox / handoff / projection state。
Operations Job 只维护投影、快照、outbox、handoff、对账或清理派生状态。
```

依赖的前序 Step:

```text
Step 5 已确认 `api / worker / jobs` 入口归属。
Step 6 已确认协议会构造或影响的 domain 对象。
Step 7 已确认协议处理时可用的 repository / resolver / publisher / handoff port。
```

---

## 3. SOP 问题回答

### 3.1 本轮需要定义哪些 API / Command / Query / Event / Job？

本轮定义 45 个协议入口或传播契约:

| 类别 | 数量 | 名称 |
|---|---:|---|
| Command API | 10 | `CreateConversationSpace`、`CloseConversationSpace`、`UpdateParticipantScope`、`UpdateVisibilityScope`、`AppendConversationFact`、`RetractConversationFact`、`ManifestExternalFact`、`CreateReviewAnchor`、`RequestTraceHandoff`、`RequestArchiveHandoff` |
| Query API | 11 | `GetConversationReadModel`、`ListConversationFacts`、`GetConversationFact`、`GetConversationChangeCursor`、`PollConversationChanges`、`SearchConversationHistory`、`GetCrossDomainManifestation`、`GetConversationTraceContext`、`GetReviewAnchor`、`GetConversationProjectionState`、`GetExternalReferenceProjection` |
| Inbound Event Consumer | 6 | `ConsumeWorkContextChanged`、`ConsumeGovernanceFactCommitted`、`ConsumeArtifactFactCommitted`、`ConsumeRuntimeResultCommitted`、`ConsumeBridgeMappedFactReceived`、`ConsumeIdentityActorChanged` |
| Outbound Event | 9 | `ConversationSpaceChangedEvent`、`ConversationScopeChangedEvent`、`ConversationFactAppendedEvent`、`ConversationFactRetractedEvent`、`CrossDomainManifestationChangedEvent`、`ConversationChangeAvailableEvent`、`TraceHandoffRequestedEvent`、`ArchiveHandoffRequestedEvent`、`ConversationProjectionStateChangedEvent` |
| Operations Job | 9 | `PublishConversationOutbox`、`RebuildConversationReadModels`、`RebuildConversationSearchIndex`、`MaintainConversationChangeCursors`、`RefreshExternalReferenceSnapshots`、`DeliverTraceHandoff`、`DeliverArchiveHandoff`、`ValidateConversationConsistency`、`CleanupExpiredConversationCursors` |

### 3.2 每个协议的调用方、处理方、传输方式是什么？

| 类别 | 调用方 / 发布方 | 处理方 / 订阅方 | 传输方式 |
|---|---|---|---|
| Command API | trusted service / internal operator / upstream application | `crates/api` handler -> `crates/application` service | HTTP-compatible route 或 internal RPC |
| Query API | SDK / Chat / Workspace / Runtime / internal operator | `crates/api` handler -> query service | HTTP-compatible route 或 internal RPC |
| Inbound Event Consumer | source truth center / event collaboration boundary | `crates/worker` consumer -> application service | event topic |
| Outbound Event | conversation outbox publisher | downstream consumers / handoff subscribers | event topic |
| Operations Job | scheduler / operator / CI-like maintenance runner | `crates/jobs` binary -> application service | job command |

### 3.3 请求、响应、事件或 job 输入输出 schema 是什么？

回答:见 §7.3~§7.7。每个协议独立给出函数签名 / route / topic / job name、最小 JSON schema、字段映射和构造闭环。

### 3.4 每个输入契约会构造或影响哪些 Domain 对象？

回答:见每个协议的“DTO 到 Domain 构造闭环”。若协议只读取对象,则写“读取对象”;若协议只传播已提交事实,则写“来源对象”。

### 3.5 字段缺失时如何处理？

| 字段类别 | 缺失处理 |
|---|---|
| Command 必填字段 | reject,返回 `ProtocolError::MissingRequiredField` |
| Command `idempotency_key` | reject,写入 protocol audit |
| Query visibility / consumer 字段 | reject 或 `NotVisible`,不得返回未裁剪数据 |
| Inbound Event `event_id` / `event_envelope_ref` / `idempotency_key` | reject 或 quarantine,不得写 truth |
| Outbound Event committed truth ref | 不允许生成 event |
| Job `job_run_id` / `scope` | reject job input,输出 failed job result |
| 外部引用不可解析 | 记录 `ReferenceResolutionState::Unresolved` 或 delayed marker |

### 3.6 每个协议失败时映射成什么错误？

| 错误类型 | 适用协议 | 说明 |
|---|---|---|
| `ProtocolError` | Command / Query / Consumer / Event / Job 入参 | schema、字段、metadata、version、visibility marker 错误 |
| `ApplicationError` | Command / Query / Consumer / Job 处理方 | use case 编排错误 |
| `DomainError` | Command / Consumer / Job domain 构造或状态转换 | 领域规则、状态、policy、不变量错误 |
| `RepositoryError` | 需要 repository 的协议 | 持久化读写失败 |
| `ResolverError` | inbound consumer / manifestation / snapshot refresh | 外部引用解析失败 |
| `PublishError` | outbound event / outbox job | 发布失败 |
| `HandoffError` | trace / archive handoff job | 交接失败 |
| `JobError` | operations job | job 输入、执行、证据生成失败 |

### 3.7 哪些协议需要幂等键或审计记录？

| 协议类别 | 幂等要求 | 审计要求 |
|---|---|---|
| Command API | 必须通过 `CommandMetadata.request.idempotency_key` 携带幂等键 | 写 command audit、domain audit 和 outbox |
| Query API | 不要求写幂等,但可携带 `RequestId` | 写只读访问 audit 按配置 / policy 决定 |
| Inbound Event Consumer | 必须用 event id + source ref + idempotency key | 写 consumer audit 和 stale / quarantine marker |
| Outbound Event | event id 必须来自 outbox / id generator | 写 publish evidence |
| Operations Job | 必须携带 `JobRunId` 和 job idempotency key | 写 job evidence、report ref、failure marker |

---

## 4. 当前文档问题诊断

| 位置 | 当前问题 | 影响 |
|---|---|---|
| 旧版 `03-详细设计.md` | 仍把 stream / AG-UI / turn mapping 当接口主线 | 会把 Conversation truth 协议退化为 UI 推送协议 |
| `02-概要设计.md` §7 | 只有接口骨架,没有 schema、route、topic、字段映射和构造闭环 | 实现者需要自行发明 DTO 字段 |
| Step 6 | domain 对象字段已收稳,但还没有协议字段来源 | 可能出现 DTO 缺字段或字段混同 |
| Step 7 | port 已收稳,但还不知道哪些协议触发哪些 port | Step 9 处理流缺入口 |

---

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 接口主线 | 概要级接口名 | 45 个协议契约 | 支撑完整 P0 闭环 |
| schema 粒度 | 输入 / 输出骨架 | 最小 JSON schema + Rust DTO 名 + route / topic / job name | 实现者可直接建 DTO |
| 字段闭环 | 未证明 | 每个协议写目标对象、必填字段、派生字段、缺失处理 | 避免实现 agent 自行补字段 |
| error mapping | 未定义 | 按 Protocol / Application / Domain / Repository / Resolver / Publish / Handoff / Job 分类 | 支撑处理流和测试 |
| 幂等审计 | 只在概要提及 | 按协议类别明确 | 支撑 Step 13 和实施计划 |

---

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A: 只给协议总表,不写每个协议 schema | 文件短 | 不满足 SOP“每个协议独立成节”和 DTO 构造闭环要求 | 不采用 |
| 方案 B: 每个协议独立成节,写最小 schema、字段映射和构造闭环 | 可实现、可复核、可回指 Step 9 | 文件较长 | 采用 |
| 方案 C: 直接锁死具体 HTTP 框架 / event bus SDK | 实现更直接 | 过早绑定技术产品,违背配置和 adapter 边界 | 不采用 |
| 方案 D: 将 inbound consumer 当 command 处理 | 入口统一 | 混淆同步命令、异步消费和来源事件幂等 | 不采用 |

推荐方案:方案 B。

原因:

- Step 8 是避免后续实现冲突的关键:协议字段必须能构造 Step 6 对象。
- 每个协议独立成节,后续 Step 9 才能逐接口写函数级处理流。
- route / topic / job name 使用稳定逻辑名,但不绑定具体框架 SDK。

---

## 7. 结构化中间产物

### 7.1 协议总表

| 名称 | 类别 | 调用方 / 发布方 | 处理方 / 订阅方 | 传输方式 | 是否需要处理流 |
|---|---|---|---|---|---|
| `CreateConversationSpace` | Command | trusted service / operator | `api::command_handlers` -> space scope service | `POST /conversation/spaces` | 是 |
| `CloseConversationSpace` | Command | trusted service / operator | `api::command_handlers` -> space scope service | `POST /conversation/spaces/{space_id}:close` | 是 |
| `UpdateParticipantScope` | Command | trusted service / operator | `api::command_handlers` -> participant scope service | `POST /conversation/spaces/{space_id}/participants:update` | 是 |
| `UpdateVisibilityScope` | Command | trusted service / operator | `api::command_handlers` -> visibility scope service | `POST /conversation/spaces/{space_id}/visibility:update` | 是 |
| `AppendConversationFact` | Command | trusted service / runtime / bridge adapter | `api::command_handlers` -> fact append service | `POST /conversation/spaces/{space_id}/facts` | 是 |
| `RetractConversationFact` | Command | trusted service / operator | `api::command_handlers` -> fact append service | `POST /conversation/spaces/{space_id}/facts/{fact_id}:retract` | 是 |
| `ManifestExternalFact` | Command | trusted service / source consumer | `api::command_handlers` -> manifestation service | `POST /conversation/spaces/{space_id}/manifestations` | 是 |
| `CreateReviewAnchor` | Command | trusted service / operator | `api::command_handlers` -> trace review service | `POST /conversation/spaces/{space_id}/review-anchors` | 是 |
| `RequestTraceHandoff` | Command | trusted service / operator | `api::command_handlers` -> trace review service | `POST /conversation/trace-handoffs` | 是 |
| `RequestArchiveHandoff` | Command | trusted service / operator | `api::command_handlers` -> trace review service | `POST /conversation/archive-handoffs` | 是 |
| `GetConversationReadModel` | Query | SDK / Chat / Workspace | `api::query_handlers` -> authorized query service | `GET /conversation/spaces/{space_id}/read-model` | 是 |
| `ListConversationFacts` | Query | SDK / Chat / Workspace | `api::query_handlers` -> authorized query service | `GET /conversation/spaces/{space_id}/facts` | 是 |
| `GetConversationFact` | Query | SDK / Chat / Workspace | `api::query_handlers` -> authorized query service | `GET /conversation/facts/{fact_id}` | 是 |
| `GetConversationChangeCursor` | Query | SDK / Chat / Workspace | `api::query_handlers` -> authorized query service | `GET /conversation/spaces/{space_id}/cursors/{consumer_ref}` | 是 |
| `PollConversationChanges` | Query | SDK / Chat / Workspace / Runtime | `api::query_handlers` -> authorized query service | `POST /conversation/spaces/{space_id}:poll-changes` | 是 |
| `SearchConversationHistory` | Query | SDK / Chat / Workspace | `api::query_handlers` -> authorized query service | `GET /conversation/spaces/{space_id}/search` | 是 |
| `GetCrossDomainManifestation` | Query | SDK / Chat / Workspace / reports | `api::query_handlers` -> authorized query service | `GET /conversation/manifestations/{manifestation_id}` | 是 |
| `GetConversationTraceContext` | Query | trusted service / operator / reports | `api::query_handlers` -> trace review service | `GET /conversation/traces/{trace_context_id}` | 是 |
| `GetReviewAnchor` | Query | trusted service / operator / reports | `api::query_handlers` -> trace review service | `GET /conversation/review-anchors/{review_anchor_id}` | 是 |
| `GetConversationProjectionState` | Query | operator / SDK / reports | `api::query_handlers` -> derived maintenance service | `GET /conversation/spaces/{space_id}/projection-state` | 是 |
| `GetExternalReferenceProjection` | Query | SDK / Chat / Workspace / reports | `api::query_handlers` -> authorized query service | `GET /conversation/spaces/{space_id}/external-references` | 是 |
| `ConsumeWorkContextChanged` | Inbound Event Consumer | L1-work / L0-bus | `worker::consumers` -> external reference service | `topic: work.context.changed` | 是 |
| `ConsumeGovernanceFactCommitted` | Inbound Event Consumer | L1-governance / L0-bus | `worker::consumers` -> manifestation service | `topic: governance.fact.committed` | 是 |
| `ConsumeArtifactFactCommitted` | Inbound Event Consumer | L1-artifact / L0-bus | `worker::consumers` -> external reference service | `topic: artifact.fact.committed` | 是 |
| `ConsumeRuntimeResultCommitted` | Inbound Event Consumer | L2-runtime | `worker::consumers` -> fact append service | `topic: runtime.result.committed` | 是 |
| `ConsumeBridgeMappedFactReceived` | Inbound Event Consumer | L6-bridges | `worker::consumers` -> fact append / manifestation service | `topic: bridge.mapped_fact.received` | 是 |
| `ConsumeIdentityActorChanged` | Inbound Event Consumer | L1-identity | `worker::consumers` -> projection maintenance service | `topic: identity.actor.changed` | 是 |
| `ConversationSpaceChangedEvent` | Outbound Event | conversation outbox | downstream consumers | `topic: conversation.space.changed` | 是 |
| `ConversationScopeChangedEvent` | Outbound Event | conversation outbox | downstream consumers | `topic: conversation.scope.changed` | 是 |
| `ConversationFactAppendedEvent` | Outbound Event | conversation outbox | downstream consumers | `topic: conversation.fact.appended` | 是 |
| `ConversationFactRetractedEvent` | Outbound Event | conversation outbox | downstream consumers | `topic: conversation.fact.retracted` | 是 |
| `CrossDomainManifestationChangedEvent` | Outbound Event | conversation outbox | downstream consumers | `topic: conversation.manifestation.changed` | 是 |
| `ConversationChangeAvailableEvent` | Outbound Event | conversation outbox | SDK / Chat / Workspace / Runtime | `topic: conversation.change.available` | 是 |
| `TraceHandoffRequestedEvent` | Outbound Event | conversation outbox | Observability / reports | `topic: conversation.trace_handoff.requested` | 是 |
| `ArchiveHandoffRequestedEvent` | Outbound Event | conversation outbox | Archive / reports | `topic: conversation.archive_handoff.requested` | 是 |
| `ConversationProjectionStateChangedEvent` | Outbound Event | projection maintenance | Operations / reports / readers | `topic: conversation.projection_state.changed` | 是 |
| `PublishConversationOutbox` | Operations Job | scheduler / operator | `jobs::outbox_publisher` | `job: publish-conversation-outbox` | 是 |
| `RebuildConversationReadModels` | Operations Job | scheduler / operator | `jobs::projection_rebuild` | `job: rebuild-conversation-read-models` | 是 |
| `RebuildConversationSearchIndex` | Operations Job | scheduler / operator | `jobs::projection_rebuild` | `job: rebuild-conversation-search-index` | 是 |
| `MaintainConversationChangeCursors` | Operations Job | scheduler / operator | `jobs::cursor_maintenance` | `job: maintain-conversation-change-cursors` | 是 |
| `RefreshExternalReferenceSnapshots` | Operations Job | scheduler / operator | `jobs::snapshot_refresh` | `job: refresh-external-reference-snapshots` | 是 |
| `DeliverTraceHandoff` | Operations Job | scheduler / operator | `jobs::handoff_delivery` | `job: deliver-trace-handoff` | 是 |
| `DeliverArchiveHandoff` | Operations Job | scheduler / operator | `jobs::handoff_delivery` | `job: deliver-archive-handoff` | 是 |
| `ValidateConversationConsistency` | Operations Job | scheduler / operator | `jobs::consistency_validation` | `job: validate-conversation-consistency` | 是 |
| `CleanupExpiredConversationCursors` | Operations Job | scheduler / operator | `jobs::cursor_cleanup` | `job: cleanup-expired-conversation-cursors` | 是 |

### 7.2 通用协议信封

#### Command envelope

```json
{
  "command": {},
  "actor": "ActorContext",
  "metadata": "CommandMetadata"
}
```

Command envelope 的 `metadata` 使用 `core-contracts::CommandMetadata`。Command 幂等键权威字段是 `metadata.request.idempotency_key`;所有同步写 Command 必须要求该字段为 `Some(IdempotencyKey)`。Command trace 权威字段是 `metadata.request.trace_id`。本仓 envelope 不再定义顶层 `idempotency_key` 或 `trace_ref`,否则会与 core metadata 形成双真相。

#### Query envelope

```json
{
  "query": {},
  "consumer": "ConsumerContext",
  "metadata": "QueryMetadata"
}
```

Query envelope 的 `metadata` 使用 `core-contracts::QueryMetadata`。分页与一致性偏好来自 `metadata.page` 和 `metadata.consistency`;本仓 envelope 不再定义顶层 `page` 或 `consistency`。

#### Inbound event envelope

`InboundEventEnvelope<T>` 归属 `conversation-contracts/src/events.rs`,是所有 inbound consumer 的正式公共 DTO。具体 payload 类型仍由各 consumer 小节定义。

```rust
/// Generic inbound event envelope owned by conversation contracts.
pub struct InboundEventEnvelope<T> {
    /// Source event id used for deduplication.
    pub event_id: EventId,
    /// Reference to the original source envelope, not the payload body.
    pub event_envelope_ref: EventEnvelopeRef,
    /// Stable source system/object pointer for routing and deduplication.
    pub event_source_ref: EventSourceRef,
    /// Idempotency key supplied by the event bridge or derived from event id + source ref.
    pub idempotency_key: IdempotencyKey,
    /// Event occurrence time from the source envelope.
    pub occurred_at: Timestamp,
    /// Trace reference propagated from the source envelope.
    pub trace_ref: TraceContextRef,
    /// Typed event payload.
    pub payload: T,
}
```

| 字段 | 类型 | 字段来源 | 缺失处理 |
|---|---|---|---|
| `event_id` | `EventId` | source envelope | quarantine, no truth write |
| `event_envelope_ref` | `EventEnvelopeRef` | source envelope metadata | quarantine, no truth write |
| `event_source_ref` | `EventSourceRef` | source system + source object | quarantine, no truth write |
| `idempotency_key` | `IdempotencyKey` | source envelope or deterministic bridge derivation | quarantine, no truth write |
| `occurred_at` | `Timestamp` | source envelope timestamp | quarantine, no truth write |
| `trace_ref` | `TraceContextRef` | source envelope trace id | quarantine with generated diagnostic trace only if source trace absent |
| `payload` | `T` | typed source event payload | payload validation decides quarantine / delayed / reject |

`event_envelope_ref` 不得等同于 `event_id`、`ConversationOutboxRecordId` 或 source payload ref。consumer dedup digest 包含 operation、`event_id`、`event_source_ref`、schema version 和 payload digest,排除 transport retry counter。

#### Inbound consumer receipt

`ConsumerReceipt` 归属 `conversation-contracts/src/events.rs`,是所有 inbound consumer 的正式返回 DTO。它不得由 application service 临时替换成 bool、裸 result id 或 source-specific receipt。

```rust
/// Outcome category returned by inbound event consumers.
pub enum ConsumerReceiptOutcome {
    /// The event changed local state or markers.
    Accepted,
    /// The event was already processed with the same digest.
    Duplicate,
    /// The event was rejected into quarantine because its envelope or payload is not safe to process.
    Quarantined,
    /// The event was valid but cannot be fully applied until a required reference resolves.
    Delayed,
    /// The event caused no local change.
    NoOp,
}

/// Receipt returned by inbound event consumers.
pub struct ConsumerReceipt {
    /// Source event id from the inbound event envelope.
    pub event_id: EventId,
    /// Source envelope reference for audit and dead-letter replay.
    pub event_envelope_ref: EventEnvelopeRef,
    /// Source system and object reference that produced the event.
    pub event_source_ref: EventSourceRef,
    /// Deduplication key used by the consumer.
    pub idempotency_key: IdempotencyKey,
    /// Consumer outcome.
    pub outcome: ConsumerReceiptOutcome,
    /// Application result reference when the consumer produced a durable local result.
    pub result_ref: Option<CommandResultRef>,
    /// Quarantine marker written for invalid envelope or unsafe payload.
    pub quarantine_ref: Option<QuarantineRecordRef>,
    /// Projection or reference state marker changed by the consumer.
    pub projection_state_ref: Option<ConversationProjectionStateId>,
    /// Trace context used for logs and audit.
    pub trace_ref: TraceContextRef,
}
```

| outcome | 必填字段 | 业务写入规则 |
|---|---|---|
| `Accepted` | `result_ref` or `projection_state_ref` 至少一个 | 可以写 local snapshot / manifestation / fact / projection marker / outbox |
| `Duplicate` | 原 `event_id`、`event_source_ref`、`idempotency_key`、`result_ref` if stored | 不重放 domain transition |
| `Quarantined` | `quarantine_ref` | 不写 business truth;可写 quarantine marker / safe diagnostic |
| `Delayed` | `projection_state_ref` or unresolved marker ref | 不补造外部 truth;等待 reference refresh |
| `NoOp` | envelope refs and trace | 不写 business truth |

#### Outbound event envelope

```json
{
  "event_id": "ConversationEventId",
  "schema_version": "1",
  "space_id": "ConversationSpaceId",
  "committed_truth_ref": "ConversationTruthRef",
  "visibility_marker": "VisibilityMarker",
  "occurred_at": "Timestamp",
  "trace_ref": "TraceContextRef",
  "payload": {}
}
```

| 字段 | 类型 | 字段来源 | schema 定义 | 缺失时行为 |
|---|---|---|---|---|
| `committed_truth_ref` | `ConversationTruthRef` | `ConversationOutboxRecord.truth_ref` | Step 6 §7.2.4,归属 `conversation-contracts/src/refs.rs` | 不生成 outbound event |
| `visibility_marker` | `VisibilityMarker` | outbox visibility scope / scope snapshot / publish suppression marker | Step 6 §7.2.4,归属 `conversation-contracts/src/refs.rs` | 不生成 outbound event 或进入 suppressed marker |

`committed_truth_ref` 必须是同一 `ConversationTruthRef` shared type,不得在 `contracts/events.rs` 或 `domain/outbox.rs` 复制 domain-only mirror。它只能指向已提交 conversation truth object,不得指向 read model、projection state、search index、change cursor view、payload body 或外部 source body。

#### Job envelope

```json
{
  "job_run_id": "JobRunId",
  "job_metadata": "JobMetadata",
  "idempotency_key": "IdempotencyKey",
  "scope": {},
  "batch_size": "BatchSize",
  "trace_ref": "TraceContextRef"
}
```

#### Job shared DTO / receipt / error schema

`JobMetadata`、Operations Job input DTO、`JobRunReceipt`、`JobRunStatus`、`ConversationJobKind`、`JobTriggerKind` 和 `JobError` 归属 `crates/contracts/src/jobs.rs`。core-contracts 当前只提供 `JobRunId`、`BatchSize`、`PageRequest`、`IdempotencyKey`、`Timestamp` 等通用值对象;conversation 不得假设 core 已存在 `JobMetadata`、`JobRunReceipt` 或 `JobError`。

```rust
/// Conversation operations job kind.
pub enum ConversationJobKind {
    PublishConversationOutbox,
    RebuildConversationReadModels,
    RebuildConversationSearchIndex,
    MaintainConversationChangeCursors,
    RefreshExternalReferenceSnapshots,
    DeliverTraceHandoff,
    DeliverArchiveHandoff,
    ValidateConversationConsistency,
    CleanupExpiredConversationCursors,
}

/// Describes why a job run was started.
pub enum JobTriggerKind {
    Scheduler,
    Operator,
    Recovery,
    Backfill,
}

/// Metadata shared by conversation operations jobs.
pub struct JobMetadata {
    /// Job kind being executed.
    pub job_kind: ConversationJobKind,
    /// Trigger source.
    pub trigger_kind: JobTriggerKind,
    /// Optional actor that requested or approved the run.
    pub requested_by: Option<ActorRef>,
    /// Safe reason or ticket reference.
    pub reason_ref: Option<ExternalReferenceRef>,
    /// Time when the run was scheduled or requested.
    pub scheduled_at: Timestamp,
}

/// Final status carried by a job run receipt.
pub enum JobRunStatus {
    Running,
    Succeeded,
    PartialFailure,
    Failed,
}

/// Receipt returned by conversation operations jobs.
pub struct JobRunReceipt {
    pub job_run_id: JobRunId,
    pub job_kind: ConversationJobKind,
    pub status: JobRunStatus,
    pub trace_ref: TraceContextRef,
    pub started_at: Timestamp,
    pub completed_at: Option<Timestamp>,
    pub processed_count: u32,
    pub succeeded_count: u32,
    pub retry_count: u32,
    pub failed_count: u32,
    pub published_outbox_record_ids: Vec<ConversationOutboxRecordId>,
    pub failed_outbox_record_ids: Vec<ConversationOutboxRecordId>,
    pub rebuilt_space_ids: Vec<ConversationSpaceId>,
    pub rebuilt_consumer_refs: Vec<ConsumerRef>,
    pub projection_error_refs: Vec<ProjectionErrorRef>,
    pub indexed_fact_refs: Vec<ConversationFactRef>,
    pub indexed_manifestation_refs: Vec<CrossDomainManifestationRef>,
    pub advanced_cursor_refs: Vec<ConversationChangeCursorRef>,
    pub stale_cursor_refs: Vec<ConversationChangeCursorRef>,
    pub invalid_cursor_refs: Vec<ConversationChangeCursorRef>,
    pub refreshed_external_fact_refs: Vec<ExternalFactRef>,
    pub unresolved_external_fact_refs: Vec<ExternalFactRef>,
    pub digest_mismatch_refs: Vec<ExternalFactRef>,
    pub delivered_trace_handoff_ids: Vec<TraceHandoffRecordId>,
    pub trace_handoff_retry_ids: Vec<TraceHandoffRecordId>,
    pub trace_handoff_failed_ids: Vec<TraceHandoffRecordId>,
    pub external_receipt_refs: Vec<ObservabilityReceiptRef>,
    pub archived_handoff_ids: Vec<ArchiveHandoffRecordId>,
    pub archive_handoff_retry_ids: Vec<ArchiveHandoffRecordId>,
    pub archive_handoff_failed_ids: Vec<ArchiveHandoffRecordId>,
    pub archive_package_refs: Vec<ArchivePackageRef>,
    pub validation_report_ref: Option<ExternalReferenceRef>,
    pub issue_count: u32,
    pub suggested_repair_refs: Vec<ExternalReferenceRef>,
    pub cleaned_cursor_refs: Vec<ConversationChangeCursorRef>,
    pub skipped_cursor_refs: Vec<ConversationChangeCursorRef>,
    pub cleanup_evidence_ref: Option<DiagnosticRef>,
    pub diagnostic_refs: Vec<DiagnosticRef>,
}

/// Error returned by a conversation operations job before or with a receipt.
pub enum JobError {
    InvalidInput { diagnostic_ref: Option<DiagnosticRef> },
    MissingOutbox { outbox_record_id: ConversationOutboxRecordId },
    MissingVisibilityScope { space_id: ConversationSpaceId },
    MissingTraceContext { trace_context_id: ConversationTraceContextId },
    MissingTraceHandoff { trace_handoff_id: TraceHandoffRecordId },
    MissingArchiveHandoff { archive_handoff_id: ArchiveHandoffRecordId },
    RepositoryFailure { retryable: bool, diagnostic_ref: Option<DiagnosticRef> },
    ResolverFailure { retryable: bool, diagnostic_ref: Option<DiagnosticRef> },
    PublishFailure { retryable: bool, diagnostic_ref: Option<DiagnosticRef> },
    HandoffFailure { retryable: bool, diagnostic_ref: Option<DiagnosticRef> },
    PartialFailure { receipt: JobRunReceipt },
}
```

字段与状态约束:

- `JobMetadata.job_kind` 必须与具体 job DTO 类型一致;不一致时返回 `JobError::InvalidInput`。
- `JobMetadata` 不重复保存 `job_run_id`、`idempotency_key` 或 `trace_ref`;这些字段属于 job envelope / job input 顶层。
- `JobRunReceipt::started(job_run_id, job_kind, trace_ref, started_at)` 创建 `status = Running`、计数为 0、`completed_at = None` 的临时 receipt builder;返回前必须调用 `completed(completed_at)` 或 `failed(completed_at)`。
- `completed(...)` 规则: `failed_count == 0` 时 `status = Succeeded`;`processed_count > 0 && failed_count > 0` 或存在 retry refs 时 `status = PartialFailure`;`processed_count == failed_count && failed_count > 0` 时 `status = Failed`。
- 对外返回的 `JobRunReceipt.status` 不得保持 `Running`。
- handoff job 必须使用 `count_handoff_delivered(...)`、`count_handoff_retry(...)`、`count_handoff_failed(...)`、`count_archive_delivered(...)`、`count_archive_retry(...)`、`count_archive_failed(...)` 更新对应 ids、count 和 receipt refs。
- `JobRunReceipt` 只保存 ref、count、safe diagnostic 和 marker;不得保存 outbox payload body、trace payload body、external response body、archive package body、secret 或 token。
- `JobError::PartialFailure.receipt` 必须携带已完成的 `JobRunReceipt`;直接缺少必填 job 输入时返回 `InvalidInput` 并可写 failed job receipt,不得进入 domain / adapter。

#### Context / metadata / visibility DTO 归属

| 类型 | 正式归属 | 最小 schema / 口径 | 不得混同 |
|---|---|---|---|
| `CommandMetadata` | `core-contracts` re-export | `request: RequestMetadata`、`reason: Option<ChangeReason>`、`external_ref: Option<ExternalReferenceRef>` | 不在 conversation command 顶层重复 idempotency / trace |
| `QueryMetadata` | `core-contracts` re-export | `request: RequestMetadata`、`page: Option<PageRequest>`、`consistency: QueryConsistency` | 不在 query envelope 顶层重复 page / consistency |
| `ActorContext` / `ActorRef` | `core-contracts` re-export | core actor context / actor ref | 不复制 identity truth |
| `TraceContextRef` | `conversation-contracts` alias / wrapper over core `TraceId` | 只保存 `TraceId` | 不创建第二 trace truth |
| `ManifestationState` | `contracts/refs.rs` shared enum | command result / outbound event / domain manifestation 共享 | 不创建 domain-only mirror enum |
| `ReferenceResolutionState` | `contracts/refs.rs` shared enum | inbound consumer / reference projection / refresh job 共享 | 不创建 domain-only mirror enum |
| `BridgeTargetMode` | `contracts/refs.rs` shared enum | bridge inbound payload / consumer flow 分支选择共享 | 不从 fact kind 或 routing rule 隐式推导 |
| `InboundEventEnvelope<T>` | `contracts/events.rs` generic DTO | inbound consumer 公共 envelope | 不依赖 domain crate |
| `ConsumerReceipt` | `contracts/events.rs` DTO | inbound consumer 返回 receipt | duplicate / quarantine / delayed 都有正式字段 |
| `EventId` / `EventEnvelopeRef` / `EventSourceRef` | `contracts/refs.rs` newtype | inbound source envelope / receipt / source event ref | event id != envelope ref != outbox record ref |
| `ManifestationPolicyRef` | `contracts/refs.rs` value object | source consumer 选择显化策略 | 只引用 policy,不携带策略正文 |
| `PolicyId` / `DiagnosticRef` | `contracts/refs.rs` newtype | policy lookup / quarantine safe diagnostic | 不携带 policy body、raw payload 或 secret |
| `VisibilityImpact` | `contracts/refs.rs` enum | identity actor changed 等事件的 projection stale 策略 | unknown 必须 conservative stale |
| `SystemActorRef` | `conversation-contracts` wrapper over core `ActorRef` | `actor_ref: ActorRef`,且 `actor_ref.actor_kind == ActorKind::System` | 不接受 human / AI actor 伪装系统 actor |
| `ConsumerContext` | `conversation-contracts` | `consumer_ref: ConsumerRef`、`actor_ref: Option<ActorRef>`、`visibility_scope_ref: Option<VisibilityScopeId>`、`purpose_ref: Option<ExternalReferenceRef>` | 不承载 request id、trace、page 或 consistency |
| `ConversationOwnerRef` | `conversation-contracts/src/refs.rs` | `owner_kind: ConversationOwnerKind`、`external_ref: ExternalReferenceRef` | 不保存 owner lifecycle 或 owner body |
| `ConversationParticipantRef` | `conversation-contracts/src/refs.rs` | `actor_ref: ActorRef`、`participant_role: ConversationParticipantRole` | 不复制 identity member truth |
| `ConversationParticipantRole` | `conversation-contracts/src/refs.rs` | `Owner | Maintainer | Member | Observer` | conversation-local role,不是全局 RBAC |
| `ConsumerRef` | `conversation-contracts/src/refs.rs` | `consumer_kind: ConsumerKind`、`external_ref: ExternalReferenceRef`、`actor_ref: Option<ActorRef>` | consumer != actor,除非 actor_ref 明确存在 |
| `VisibilityLevel` | `conversation-contracts/src/visibility.rs` | `Private < Participants < Project < Workspace < Public` | 分类值,不是 lifecycle state |
| `VisibilityRuleSet` | `conversation-contracts/src/visibility.rs` | `maximum_visibility: VisibilityLevel`、read / append / manifestation / review rule set | 不放在 domain crate 中让 contracts 反向依赖 domain |
| `CommandReasonRef` | `conversation-contracts/src/refs.rs` | `reason_code: CommandReasonCode`、`supporting_ref: Option<ExternalReferenceRef>` | 不重复 request id、trace、idempotency |
| `ScopeChangeReason` | `conversation-contracts/src/refs.rs` | `reason_ref: CommandReasonRef`、`reason_kind: ScopeChangeReasonKind` | 不保存正文说明 |
| `SpaceCloseReason` | `conversation-contracts/src/refs.rs` | `reason_ref: CommandReasonRef`、`close_mode: SpaceCloseMode` | close mode 与 request.close_mode 必须一致 |
| `RestrictionReason` | `conversation-contracts/src/refs.rs` | `reason_ref: CommandReasonRef`、`restriction_kind: RestrictionKind` | 不保存正文说明或外部 source body |
| `VisibilityRestrictionReason` | `conversation-contracts/src/refs.rs` | `reason_ref: CommandReasonRef`、`restriction_kind: VisibilityRestrictionKind` | 不保存正文说明或外部 source body |
| `ScopeSnapshotRef` | `conversation-contracts/src/refs.rs` | `scope_kind: ScopeKind`、`space_id`、可选 participant / visibility scope id、`scope_version` | 不嵌入完整 scope body |
| `SpaceCloseMode` | `conversation-contracts/src/refs.rs` | `ReadOnly | Closed | Archived` | `Archived` 必须携带 archive intent |
| `ReviewAnchorKind` / `ReviewTargetRef` / `ReviewReasonRef` | `conversation-contracts/src/refs.rs` | review anchor public request / result 共享值对象;完整 schema 见 Step 6 §7.2.3 | 不保存 review report body 或 target body |
| `ObservabilityDestinationRef` / `HandoffReason` / `ArchiveScope` / `TraceRetentionPolicyRef` | `conversation-contracts/src/refs.rs` | trace / archive handoff public request 共享值对象;完整 schema 见 Step 6 §7.2.3 | 不保存 adapter config、credential、archive body 或 trace payload body |
| `TraceHandoffPayloadRef` / `ObservabilityReceiptRef` / `ArchivePackageRef` | `conversation-contracts/src/refs.rs` | handoff payload、delivery receipt、archive package 引用;完整 schema 见 Step 6 §7.2.3 | 只保存 ref、digest、marker,不保存外部 response body |
| `ArchiveDestinationRef` / `TraceHandoffScope` / `ArchiveHandoffScope` | `conversation-contracts/src/refs.rs` | handoff job destination / repository scope 过滤;完整 schema 见 Step 6 §7.2.3 | 不保存 adapter config、credential、archive body 或 trace payload body |
| `TraceHandoffState` / `ArchiveHandoffState` | `conversation-contracts/src/refs.rs` shared enum | command result / outbound event / domain handoff record 共享 | 不创建 domain-only mirror enum |
| `RetentionDuration` / `RetentionWindow` / `TraceRetentionRuleSet` / `TraceHandoffRuleSet` / `TraceRedactionRuleSet` / `BodyExclusionRuleSet` | `conversation-contracts/src/refs.rs` 或同层 value module | trace retention / handoff / redaction / forbidden body 纯数据 rule set;完整 schema 见 Step 6 §7.2.3;`RetentionDuration` 是本地秒级正整数 newtype | 不引用当前 core baseline 不存在的 `Duration`,也不放在 domain crate 中让 contracts 反向依赖 domain |
| `JobMetadata` / `JobRunReceipt` / `JobRunStatus` / `ConversationJobKind` / `JobTriggerKind` / `JobError` | `conversation-contracts/src/jobs.rs` | operations job metadata、receipt 和 public job error DTO;完整 schema 见本节 `Job shared DTO / receipt / error schema` | 不假设 core 已有同名 schema,不放在 application-local 类型中 |
| `ConversationTruthRef` / `ConversationTruthObjectRef` / `ConversationTruthRefKind` | `conversation-contracts/src/refs.rs` | outbox truth ref 与 outbound envelope `committed_truth_ref`;完整 schema 见 Step 6 §7.2.4 | 不创建 domain-only mirror;不得指向 derived view |
| `RetractionReasonRef` | `conversation-contracts/src/refs.rs` | fact retracted event 公开撤回原因 ref;完整 schema 见 Step 6 §7.2.4 | 不暴露 deleted payload、正文说明或 raw reason body |
| `ConversationSpaceScope` / `ConsumerScope` / `SearchIndexProfileRef` / `ConsistencyValidationProfileRef` / `ReportOutputRef` | `conversation-contracts/src/refs.rs` 或同层 value module | operations job scope、configured profile 和 report output refs;完整 schema 见 Step 6 §7.2.5 | 不写裸字符串、空 struct、repository-local filter、report body、adapter config 或 secret |

上述值对象字段级 schema 以 `03_ddd_step_06_object_contracts.md` §7.2.1 / §7.2.2 / §7.2.3 / §7.2.4 / §7.2.5 为准。协议层不得用裸字符串占位替代这些类型。

公开协议 surface 的传递类型归属规则:

- Command result、Query view / page、Inbound Event envelope / payload / receipt、Outbound Event payload、Operations Job input / output / report 中出现的 enum / ref / helper / receipt 必须归属 `conversation-contracts` 或 `core-contracts`,或写明 domain 到 public DTO 的正式映射;不得让 public contracts 直接依赖 domain-only 类型。
- `ManifestExternalFactResult.manifestation_state`、`CrossDomainManifestationChangedEvent.manifestation_state` 统一使用 `contracts/refs.rs::ManifestationState`。
- external reference projection、refresh job、inbound source consumer 中公开的 resolution state 统一使用 `contracts/refs.rs::ReferenceResolutionState`。
- `BridgeMappedFactReceivedEvent.target_mode` 统一使用 `contracts/refs.rs::BridgeTargetMode`;`ConsumeBridgeMappedFactReceivedFlow` 只能按该字段选择 append fact 或 manifest external fact 分支。
- `InboundEventEnvelope<T>` 和 `ConsumerReceipt` 是 PH-05 consumer Step 1 public DTO;contract tests 必须覆盖 envelope 必填字段、accepted、duplicate、quarantined、delayed 和 no-op receipt surface。
- `JobMetadata`、`JobRunReceipt` 和 `JobError` 是 PH-06 job public DTO;contract tests 必须覆盖 invalid input、success receipt、partial failure receipt、handoff retry refs 和 handoff failed refs。
- 各 inbound consumer 的 payload JSON 示例只表达 payload 字段;`event_id`、`event_envelope_ref`、`event_source_ref`、`idempotency_key`、`occurred_at` 和 `trace_ref` 只能出现在 `InboundEventEnvelope<T>`。
- PH-06 `CreateReviewAnchor`、`RequestTraceHandoff` 和 `RequestArchiveHandoff` 的 request 依赖类型、result DTO 字段类型、outbound handoff event 字段类型必须复用 Step 6 §7.2.3 的 contracts shared schema;不得在 `commands.rs`、`events.rs`、`domain/trace.rs` 或 application service 中各自复制第二套字段。

#### Command result DTO

```json
{
  "CommandReceipt": {
    "request_id": "RequestId",
    "idempotency_key": "IdempotencyKey",
    "command_kind": "ConversationCommandKind",
    "outcome": "accepted | duplicate",
    "completed_at": "Timestamp"
  },
  "ConversationSpaceCommandResult": {
    "space_id": "ConversationSpaceId",
    "scope_change_ref": "Option<ScopeChangeRecordRef>",
    "outbox_record_ref": "Option<ConversationOutboxRecordId>",
    "projection_state_ref": "Option<ConversationProjectionStateId>",
    "result_ref": "CommandResultRef",
    "receipt": "CommandReceipt"
  },
  "ParticipantScopeCommandResult": {
    "space_id": "ConversationSpaceId",
    "participant_scope_id": "ParticipantScopeId",
    "scope_change_ref": "ScopeChangeRecordRef",
    "outbox_record_ref": "Option<ConversationOutboxRecordId>",
    "projection_state_ref": "Option<ConversationProjectionStateId>",
    "result_ref": "CommandResultRef",
    "receipt": "CommandReceipt"
  },
  "VisibilityScopeCommandResult": {
    "space_id": "ConversationSpaceId",
    "visibility_scope_id": "VisibilityScopeId",
    "scope_change_ref": "ScopeChangeRecordRef",
    "outbox_record_ref": "Option<ConversationOutboxRecordId>",
    "projection_state_ref": "Option<ConversationProjectionStateId>",
    "result_ref": "CommandResultRef",
    "receipt": "CommandReceipt"
  },
  "ReviewAnchorCommandResult": {
    "review_anchor_id": "ReviewAnchorId",
    "space_id": "ConversationSpaceId",
    "trace_context_id": "ConversationTraceContextId",
    "outbox_record_ref": "Option<ConversationOutboxRecordId>",
    "result_ref": "CommandResultRef",
    "receipt": "CommandReceipt"
  },
  "TraceHandoffCommandResult": {
    "trace_handoff_id": "TraceHandoffRecordId",
    "trace_context_id": "ConversationTraceContextId",
    "destination_ref": "ObservabilityDestinationRef",
    "handoff_state": "TraceHandoffState",
    "outbox_record_ref": "Option<ConversationOutboxRecordId>",
    "result_ref": "CommandResultRef",
    "receipt": "CommandReceipt"
  },
  "ArchiveHandoffCommandResult": {
    "archive_handoff_id": "ArchiveHandoffRecordId",
    "space_id": "ConversationSpaceId",
    "trace_context_id": "ConversationTraceContextId",
    "archive_scope": "ArchiveScope",
    "retention_policy_ref": "TraceRetentionPolicyRef",
    "handoff_state": "ArchiveHandoffState",
    "outbox_record_ref": "Option<ConversationOutboxRecordId>",
    "result_ref": "CommandResultRef",
    "receipt": "CommandReceipt"
  }
}
```

`CommandResultRef`、`CommandReceipt` 和 `ConversationCommandKind` 属于 contracts DTO / ref。application service 必须在 request validate 后、reserve 前按规范化 command 内容计算 `RequestDigest`,并调用 `IdempotencyRepository.reserve(key, operation, request_digest, uow)`。application service 可以将 `CommandResultRef` 的值映射为本地 `IdempotencyResultRef`,但 `contracts` crate 不得依赖 `application/idempotency.rs`。

Duplicate command 只能在同 key 同 request digest 时返回既有 `result_ref` 和原 refs,且 `receipt.outcome = duplicate`。缺失 `metadata.request.idempotency_key` 或同 key 不同 digest 时返回 `ProtocolError::MissingRequiredField` / `ApplicationError::Conflict`,不得返回 command result。

#### 7.2.1 `ManifestExternalFactResult`

`ManifestExternalFactResult` 是 `ManifestExternalFact` 的正式 command result DTO,归属 `crates/contracts/src/commands.rs`。它不得由 application service 临时替换成 `FactAppendReceipt`、`CrossDomainManifestation` 或裸 id tuple。

```rust
/// Result returned after manifesting an external fact into a conversation space.
pub struct ManifestExternalFactResult {
    /// Manifestation record created or reused by the command.
    pub manifestation_id: CrossDomainManifestationId,
    /// Space where the external fact was manifested.
    pub space_id: ConversationSpaceId,
    /// External fact reference that was manifested.
    pub external_fact_ref: ExternalFactRef,
    /// Safe snapshot reference used by this manifestation when available.
    pub snapshot_ref: Option<ExternalFactSnapshotRef>,
    /// Local conversation fact created from the manifestation when available.
    pub manifested_fact_id: Option<ConversationFactId>,
    /// Visibility scope applied to the manifestation.
    pub visibility_scope_id: VisibilityScopeId,
    /// Current manifestation state.
    pub manifestation_state: ManifestationState,
    /// Outbox record written for the manifestation when a local change was committed.
    pub outbox_record_ref: Option<ConversationOutboxRecordId>,
    /// Trace context created for the command.
    pub trace_context_id: ConversationTraceContextId,
    /// Stable command result reference for idempotency duplicates.
    pub result_ref: CommandResultRef,
    /// Shared command receipt.
    pub receipt: CommandReceipt,
}
```

```json
{
  "manifestation_id": "CrossDomainManifestationId",
  "space_id": "ConversationSpaceId",
  "external_fact_ref": "ExternalFactRef",
  "snapshot_ref": "Option<ExternalFactSnapshotRef>",
  "manifested_fact_id": "Option<ConversationFactId>",
  "visibility_scope_id": "VisibilityScopeId",
  "manifestation_state": "ManifestationState",
  "outbox_record_ref": "Option<ConversationOutboxRecordId>",
  "trace_context_id": "ConversationTraceContextId",
  "result_ref": "CommandResultRef",
  "receipt": "CommandReceipt"
}
```

| 字段 | 类型 | 字段来源 | 可空 / 缺失口径 |
|---|---|---|---|
| `manifestation_id` | `CrossDomainManifestationId` | `CrossDomainManifestation.manifestation_id` | 必填 |
| `space_id` | `ConversationSpaceId` | request / manifestation | 必填 |
| `external_fact_ref` | `ExternalFactRef` | request / resolver result | 必填 |
| `snapshot_ref` | `Option<ExternalFactSnapshotRef>` | `ExternalFactSnapshot.snapshot_id` or unresolved path | unresolved 可为空 |
| `manifested_fact_id` | `Option<ConversationFactId>` | `ConversationFact.fact_id` when local fact committed | unresolved path 可为空 |
| `visibility_scope_id` | `VisibilityScopeId` | resolved visibility scope | 必填 |
| `manifestation_state` | `ManifestationState` | `CrossDomainManifestation.manifestation_state` | 必填 |
| `outbox_record_ref` | `Option<ConversationOutboxRecordId>` | `ConversationOutboxRecord.outbox_id` | duplicate / unresolved no-write path 可返回既有值或空 |
| `trace_context_id` | `ConversationTraceContextId` | `ConversationTraceContext.trace_context_id` | 必填 |
| `result_ref` | `CommandResultRef` | command result builder / idempotency result | 必填 |
| `receipt` | `CommandReceipt` | command receipt builder | 必填 |

Duplicate `ManifestExternalFact` 必须在 same key + same digest 时返回已保存的 `ManifestExternalFactResult`,其中 `receipt.outcome = duplicate`,且不得重新解析外部来源、重建 snapshot、重写 manifestation、fact、trace 或 outbox。Unresolved path 若 policy 允许写 unresolved manifestation,`manifestation_state = Unresolved`,`snapshot_ref = None`,`manifested_fact_id = None`;若 policy 不允许 unresolved manifestation,返回 `ApplicationError::ExternalReferenceUnresolved`,不返回 result DTO。

#### 7.2.2 `ReviewAnchorCommandResult`

`ReviewAnchorCommandResult` 是 `CreateReviewAnchor` 的正式 command result DTO,归属 `crates/contracts/src/commands.rs`。它不得由 application service 临时替换成 `ReviewAnchor`、`ConversationTraceContext`、outbox id tuple 或裸 `ReviewAnchorId`。

```rust
/// Result returned after creating a review anchor.
pub struct ReviewAnchorCommandResult {
    /// Review anchor created or reused by the command.
    pub review_anchor_id: ReviewAnchorId,
    /// Space that owns the review anchor.
    pub space_id: ConversationSpaceId,
    /// Trace context linked to the review anchor.
    pub trace_context_id: ConversationTraceContextId,
    /// Outbox record written for the review anchor when a local change was committed.
    pub outbox_record_ref: Option<ConversationOutboxRecordId>,
    /// Stable command result reference for idempotency duplicates.
    pub result_ref: CommandResultRef,
    /// Shared command receipt.
    pub receipt: CommandReceipt,
}
```

```json
{
  "review_anchor_id": "ReviewAnchorId",
  "space_id": "ConversationSpaceId",
  "trace_context_id": "ConversationTraceContextId",
  "outbox_record_ref": "Option<ConversationOutboxRecordId>",
  "result_ref": "CommandResultRef",
  "receipt": "CommandReceipt"
}
```

| 字段 | 类型 | 字段来源 | 可空 / 缺失口径 |
|---|---|---|---|
| `review_anchor_id` | `ReviewAnchorId` | `ReviewAnchor.review_anchor_id` | 必填 |
| `space_id` | `ConversationSpaceId` | request / `ReviewAnchor.space_id` | 必填 |
| `trace_context_id` | `ConversationTraceContextId` | `ConversationTraceContext.trace_context_id` | 必填 |
| `outbox_record_ref` | `Option<ConversationOutboxRecordId>` | `ConversationOutboxRecord.outbox_record_id` | duplicate 可返回既有值;无 outbox 写入时为空 |
| `result_ref` | `CommandResultRef` | command result builder / idempotency result | 必填 |
| `receipt` | `CommandReceipt` | command receipt builder | 必填 |

Duplicate `CreateReviewAnchor` 必须在 same key + same digest 时返回已保存的 `ReviewAnchorCommandResult`,其中 `receipt.outcome = duplicate`,且不得重新创建 review anchor、trace context 或 outbox。目标不可见、target not found、缺失 idempotency key 或同 key 不同 digest 时返回错误,不得返回 result DTO。

#### 7.2.3 `TraceHandoffCommandResult`

`TraceHandoffCommandResult` 是 `RequestTraceHandoff` 的正式 command result DTO,归属 `crates/contracts/src/commands.rs`。它表达“handoff intent 已提交”,不表达外部交付完成,不得替代 `TraceHandoffRequestedEvent` 或 `ObservabilityReceiptRef`。

```rust
/// Result returned after requesting trace handoff.
pub struct TraceHandoffCommandResult {
    /// Trace handoff record created or reused by the command.
    pub trace_handoff_id: TraceHandoffRecordId,
    /// Trace context being handed off.
    pub trace_context_id: ConversationTraceContextId,
    /// Observability destination selected for this handoff.
    pub destination_ref: ObservabilityDestinationRef,
    /// Current handoff intent state.
    pub handoff_state: TraceHandoffState,
    /// Outbox record written for the handoff request when a local change was committed.
    pub outbox_record_ref: Option<ConversationOutboxRecordId>,
    /// Stable command result reference for idempotency duplicates.
    pub result_ref: CommandResultRef,
    /// Shared command receipt.
    pub receipt: CommandReceipt,
}
```

```json
{
  "trace_handoff_id": "TraceHandoffRecordId",
  "trace_context_id": "ConversationTraceContextId",
  "destination_ref": "ObservabilityDestinationRef",
  "handoff_state": "TraceHandoffState",
  "outbox_record_ref": "Option<ConversationOutboxRecordId>",
  "result_ref": "CommandResultRef",
  "receipt": "CommandReceipt"
}
```

| 字段 | 类型 | 字段来源 | 可空 / 缺失口径 |
|---|---|---|---|
| `trace_handoff_id` | `TraceHandoffRecordId` | `TraceHandoffRecord.trace_handoff_id` | 必填 |
| `trace_context_id` | `ConversationTraceContextId` | request / `TraceHandoffRecord.trace_context_id` | 必填 |
| `destination_ref` | `ObservabilityDestinationRef` | request or configured default | 必填 after resolution |
| `handoff_state` | `TraceHandoffState` | `TraceHandoffRecord.handoff_state` | 必填;initial request 为 `Pending` |
| `outbox_record_ref` | `Option<ConversationOutboxRecordId>` | `ConversationOutboxRecord.outbox_record_id` | duplicate 可返回既有值;无 outbox 写入时为空 |
| `result_ref` | `CommandResultRef` | command result builder / idempotency result | 必填 |
| `receipt` | `CommandReceipt` | command receipt builder | 必填 |

Duplicate `RequestTraceHandoff` 必须在 same key + same digest 时返回已保存的 `TraceHandoffCommandResult`,其中 `receipt.outcome = duplicate`,且不得重新创建 handoff intent、payload ref、trace context 或 outbox,也不得触发外部 handoff delivery。缺少 trace context、缺少 destination 且无配置默认、缺失 idempotency key 或同 key 不同 digest 时返回错误,不得返回 result DTO。

#### 7.2.4 `ArchiveHandoffCommandResult`

`ArchiveHandoffCommandResult` 是 `RequestArchiveHandoff` 的正式 command result DTO,归属 `crates/contracts/src/commands.rs`。它表达“archive handoff intent 已提交”,不表达 archive package 已生成或交付完成。

```rust
/// Result returned after requesting archive handoff.
pub struct ArchiveHandoffCommandResult {
    /// Archive handoff record created or reused by the command.
    pub archive_handoff_id: ArchiveHandoffRecordId,
    /// Space covered by the archive handoff.
    pub space_id: ConversationSpaceId,
    /// Trace context used to build the archive handoff.
    pub trace_context_id: ConversationTraceContextId,
    /// Archive scope resolved for this handoff.
    pub archive_scope: ArchiveScope,
    /// Retention policy selected for this archive handoff.
    pub retention_policy_ref: TraceRetentionPolicyRef,
    /// Current archive handoff intent state.
    pub handoff_state: ArchiveHandoffState,
    /// Outbox record written for the archive request when a local change was committed.
    pub outbox_record_ref: Option<ConversationOutboxRecordId>,
    /// Stable command result reference for idempotency duplicates.
    pub result_ref: CommandResultRef,
    /// Shared command receipt.
    pub receipt: CommandReceipt,
}
```

```json
{
  "archive_handoff_id": "ArchiveHandoffRecordId",
  "space_id": "ConversationSpaceId",
  "trace_context_id": "ConversationTraceContextId",
  "archive_scope": "ArchiveScope",
  "retention_policy_ref": "TraceRetentionPolicyRef",
  "handoff_state": "ArchiveHandoffState",
  "outbox_record_ref": "Option<ConversationOutboxRecordId>",
  "result_ref": "CommandResultRef",
  "receipt": "CommandReceipt"
}
```

| 字段 | 类型 | 字段来源 | 可空 / 缺失口径 |
|---|---|---|---|
| `archive_handoff_id` | `ArchiveHandoffRecordId` | `ArchiveHandoffRecord.archive_handoff_id` | 必填 |
| `space_id` | `ConversationSpaceId` | request / trace context / `ArchiveHandoffRecord.space_id` | 必填 after resolution |
| `trace_context_id` | `ConversationTraceContextId` | request or derived trace context for space archive | 必填 after resolution |
| `archive_scope` | `ArchiveScope` | request or derived space scope | 必填 after resolution |
| `retention_policy_ref` | `TraceRetentionPolicyRef` | request or configured default | 必填 after resolution |
| `handoff_state` | `ArchiveHandoffState` | `ArchiveHandoffRecord.handoff_state` | 必填;initial request 为 `Pending` |
| `outbox_record_ref` | `Option<ConversationOutboxRecordId>` | `ConversationOutboxRecord.outbox_record_id` | duplicate 可返回既有值;无 outbox 写入时为空 |
| `result_ref` | `CommandResultRef` | command result builder / idempotency result | 必填 |
| `receipt` | `CommandReceipt` | command receipt builder | 必填 |

Duplicate `RequestArchiveHandoff` 必须在 same key + same digest 时返回已保存的 `ArchiveHandoffCommandResult`,其中 `receipt.outcome = duplicate`,且不得重新创建 archive handoff intent、archive scope、trace context、retention policy ref 或 outbox,也不得生成 archive package。缺少 space / trace context、缺少 retention policy 且无配置默认、scope 不足、缺失 idempotency key 或同 key 不同 digest 时返回错误,不得返回 result DTO。

### 7.3 Command API 协议契约

#### 7.3.1 `CreateConversationSpace`

| 项 | 内容 |
|---|---|
| 函数签名 | `handle_create_conversation_space(CreateConversationSpaceRequest request) -> Result<ConversationSpaceCommandResult, ApiError>` |
| HTTP / RPC / Event 名称 | `POST /conversation/spaces` |
| 调用方 | trusted service / operator |
| 处理方 | `ConversationSpaceCommandHandler` -> `ConversationSpaceCommandService` |

```json
{
  "space_kind": "project | personal | system | manifestation",
  "owner_ref": "ConversationOwnerRef",
  "initial_participants": ["ConversationParticipantRef"],
  "default_visibility": "VisibilityLevel",
  "reason_ref": "CommandReasonRef"
}
```

| 输入字段 | 类型 | 目标对象字段 | 字段来源 | 缺失处理 |
|---|---|---|---|---|
| `space_kind` | `ConversationSpaceKind` | `ConversationSpace.space_kind` | request | reject unknown kind;reject inconsistent `space_kind` / `owner_ref.owner_kind` pair |
| `owner_ref` | `ConversationOwnerRef` | `ConversationSpace.owner_ref` | request;schema 见 Step 6 §7.2.1 | reject missing `owner_kind` or `external_ref` |
| `initial_participants` | `Vec<ConversationParticipantRef>` | `ParticipantScope.participants` | request;schema 见 Step 6 §7.2.1 | reject empty unless system space;reject duplicate actor |
| `default_visibility` | `VisibilityLevel` | `VisibilityScope.default_visibility` | request;ordered enum | derive project default;reject unknown level |
| `actor` | `ActorContext` | `ConversationSpace.created_by` | command envelope | reject |
| `metadata.request.idempotency_key` | `IdempotencyKey` | idempotency record | `CommandMetadata.request` | reject |
| `reason_ref` | `CommandReasonRef` | initial `ScopeChangeReason.reason_ref` | request;schema 见 Step 6 §7.2.1 | reject missing `reason_code` |

| 输入契约 | 目标 Domain 对象 | 必填字段是否齐全 | 派生字段来源 | 不得混同的字段 | 缺失时行为 |
|---|---|---|---|---|---|
| `CreateConversationSpaceRequest` | `ConversationSpace`、`ParticipantScope`、`VisibilityScope`、`ScopeChangeRecord` | 是 | ids / versions / timestamps 来自 `IdGeneratorPort` / `ClockPort` | `owner_ref` != actor;participant scope != visibility scope | reject or derive default visibility |

Create-space 初始 `ScopeChangeRecord` 的正式口径:

- `changed_by` 来自 `request.actor.actor_ref`。
- `change_reason` 为 `ScopeChangeReason { reason_ref: request.reason_ref, reason_kind: ScopeChangeReasonKind::InitialCreate }`。
- `scope_kind = ScopeKind::Space`。
- `previous_scope_ref` 使用 `ScopeSnapshotRef { scope_kind: Space, space_id, participant_scope_id: None, visibility_scope_id: None, scope_version: None }`,表示预创建占位,不代表已有持久化 space。
- `new_scope_ref` 使用同一 `space_id`、两个 scope id 为 `None`;PH-02 下 `scope_version = None`。
- `ConversationOutboxRecord::from_scope_change(...)` 必须生成 `ConversationOutboxEventKind::SpaceChanged`,对应 `ConversationSpaceChangedEvent`。

#### 7.3.2 `CloseConversationSpace`

| 项 | 内容 |
|---|---|
| 函数签名 | `handle_close_conversation_space(CloseConversationSpaceRequest request) -> Result<ConversationSpaceCommandResult, ApiError>` |
| HTTP / RPC / Event 名称 | `POST /conversation/spaces/{space_id}:close` |
| 调用方 | trusted service / operator |
| 处理方 | `ConversationSpaceCommandHandler` -> `ConversationSpaceCommandService` |

```json
{
  "space_id": "ConversationSpaceId",
  "close_mode": "read_only | closed | archived",
  "close_reason": "SpaceCloseReason",
  "archive_intent_ref": "ArchiveIntentRef"
}
```

| 输入字段 | 类型 | 目标对象字段 | 字段来源 | 缺失处理 |
|---|---|---|---|---|
| `space_id` | `ConversationSpaceId` | lookup key | route / request | reject |
| `close_mode` | `SpaceCloseMode` | `ConversationSpace.lifecycle_state` | request;`ReadOnly | Closed | Archived` | derive `closed`;reject unknown mode |
| `close_reason` | `SpaceCloseReason` | `ScopeChangeRecord.change_reason` | request;`close_reason.close_mode` must equal request `close_mode` | reject |
| `archive_intent_ref` | `Option<ArchiveIntentRef>` | archive state evidence | request | required when mode archived |

| 输入契约 | 目标 Domain 对象 | 必填字段是否齐全 | 派生字段来源 | 不得混同的字段 | 缺失时行为 |
|---|---|---|---|---|---|
| `CloseConversationSpaceRequest` | `ConversationSpace`、`ConversationTruthState`、`ScopeChangeRecord` | 是 | previous scope snapshots from repository | close mode != archive delivery result | reject missing reason or required archive intent |

#### 7.3.3 `UpdateParticipantScope`

| 项 | 内容 |
|---|---|
| 函数签名 | `handle_update_participant_scope(UpdateParticipantScopeRequest request) -> Result<ParticipantScopeCommandResult, ApiError>` |
| HTTP / RPC / Event 名称 | `POST /conversation/spaces/{space_id}/participants:update` |
| 调用方 | trusted service / operator |
| 处理方 | `ParticipantScopeCommandHandler` -> `ParticipantScopeCommandService` |

```json
{
  "space_id": "ConversationSpaceId",
  "expected_scope_version": "ScopeVersion",
  "add_participants": ["ConversationParticipantRef"],
  "remove_participants": ["ConversationParticipantRef"],
  "change_reason": "ScopeChangeReason"
}
```

| 输入字段 | 类型 | 目标对象字段 | 字段来源 | 缺失处理 |
|---|---|---|---|---|
| `space_id` | `ConversationSpaceId` | `ParticipantScope.space_id` | route / request | reject |
| `expected_scope_version` | `ScopeVersion` | concurrency guard | request | reject conflict-prone update |
| `add_participants` | `Vec<ConversationParticipantRef>` | `ParticipantScope.participants` | request;schema 见 Step 6 §7.2.1 | empty allowed if remove non-empty;reject duplicate actor |
| `remove_participants` | `Vec<ConversationParticipantRef>` | `ParticipantScope.participants` | request;match by `actor_ref` | empty allowed if add non-empty |
| `change_reason` | `ScopeChangeReason` | `ScopeChangeRecord.change_reason` | request;`ParticipantAdded | ParticipantRemoved | PolicyRestriction | Recovery` | reject |

| 输入契约 | 目标 Domain 对象 | 必填字段是否齐全 | 派生字段来源 | 不得混同的字段 | 缺失时行为 |
|---|---|---|---|---|---|
| `UpdateParticipantScopeRequest` | `ParticipantScope`、`ScopeChangeRecord` | 是 | previous / new snapshot refs from repository / id generator | participant scope != identity membership truth | reject no-op unless reason permits audit-only |

`UpdateParticipantScopeRequest` 保留 `add_participants[] + remove_participants[]` 批量 DTO 口径。一次命令允许同时 add 和 remove 多个 participant,但必须满足:

- `add_participants` 与 `remove_participants` 合并后至少一项非空。
- 同一 `actor_ref` 不得在同一命令中同时出现于 add 和 remove。
- add 列表内部和 remove 列表内部不得有重复 `actor_ref`。
- application service 必须将一次命令合成为一个 `ScopeChangeRecord`,并通过 `ScopeMutationBundle::participant_changed(...)` 原子保存。
- scope version 对一次命令只递增一次;不得按 participant 项数生成多个版本或多个 `ScopeChangeRecord`。

#### 7.3.4 `UpdateVisibilityScope`

| 项 | 内容 |
|---|---|
| 函数签名 | `handle_update_visibility_scope(UpdateVisibilityScopeRequest request) -> Result<VisibilityScopeCommandResult, ApiError>` |
| HTTP / RPC / Event 名称 | `POST /conversation/spaces/{space_id}/visibility:update` |
| 调用方 | trusted service / operator |
| 处理方 | `VisibilityScopeCommandHandler` -> `VisibilityScopeCommandService` |

```json
{
  "space_id": "ConversationSpaceId",
  "expected_scope_version": "ScopeVersion",
  "visibility_rules": "VisibilityRuleSet",
  "change_reason": "ScopeChangeReason",
  "invalidate_existing_cursors": true
}
```

| 输入字段 | 类型 | 目标对象字段 | 字段来源 | 缺失处理 |
|---|---|---|---|---|
| `space_id` | `ConversationSpaceId` | `VisibilityScope.space_id` | route / request | reject |
| `expected_scope_version` | `ScopeVersion` | concurrency guard | request | reject |
| `visibility_rules` | `VisibilityRuleSet` from `conversation-contracts/src/visibility.rs` | `VisibilityScope.visibility_rules` | request;schema 见 Step 6 §7.2.1 | reject missing rule sets,invalid target fields,body-bearing inline rules,or sealed expansion |
| `change_reason` | `ScopeChangeReason` | `ScopeChangeRecord.change_reason` | request;`VisibilityNarrowed | VisibilitySealed | PolicyRestriction | Recovery` | reject |
| `invalidate_existing_cursors` | `bool` | cursor invalidation intent | request | default true |

| 输入契约 | 目标 Domain 对象 | 必填字段是否齐全 | 派生字段来源 | 不得混同的字段 | 缺失时行为 |
|---|---|---|---|---|---|
| `UpdateVisibilityScopeRequest` | `VisibilityScope`、`ScopeChangeRecord`、`ConversationChangeCursor` | 是 | affected cursors from projection repository | visibility scope != authentication result | reject missing visibility rules |

#### 7.3.5 `AppendConversationFact`

| 项 | 内容 |
|---|---|
| 函数签名 | `handle_append_conversation_fact(AppendConversationFactRequest request) -> Result<FactAppendReceipt, ApiError>` |
| HTTP / RPC / Event 名称 | `POST /conversation/spaces/{space_id}/facts` |
| 调用方 | trusted service / runtime / bridge adapter |
| 处理方 | `ConversationFactCommandHandler` -> `ConversationFactAppendService` |

```json
{
  "space_id": "ConversationSpaceId",
  "fact_kind": "ConversationFactKind",
  "source_ref": "FactSourceRef",
  "visibility_scope_id": "Option<VisibilityScopeId>",
  "payload_ref": "ConversationFactPayloadRef",
  "payload_digest": "Option<PayloadDigest>"
}
```

| 输入字段 | 类型 | 目标对象字段 | 字段来源 | 缺失处理 |
|---|---|---|---|---|
| `space_id` | `ConversationSpaceId` | `ConversationFact.space_id` | route / request | reject |
| `fact_kind` | `ConversationFactKind` | `ConversationFact.fact_kind` | request | reject |
| `source_ref` | `FactSourceRef` | `ConversationFact.source_ref` | request or consumer derived | reject |
| `visibility_scope_id` | `Option<VisibilityScopeId>` | `ConversationFact.visibility_scope_id` | request guard or default/current space scope | derive default if absent; `ApplicationError::NotVisible` if provided value mismatches current space visibility scope |
| `payload_ref` | `ConversationFactPayloadRef` | `ConversationFact.payload_ref` | request | reject |
| `payload_digest` | `Option<PayloadDigest>` | audit / idempotency evidence | request | required / optional / forbidden follows `ConversationFactPayloadRef.digest_requirement` |

| 输入契约 | 目标 Domain 对象 | 必填字段是否齐全 | 派生字段来源 | 不得混同的字段 | 缺失时行为 |
|---|---|---|---|---|---|
| `AppendConversationFactRequest` | `ConversationFact`、`FactSourceRef`、`FactAppendReceipt`、`ConversationTraceContext` | 是 | fact id / sequence / receipt id / timestamp from technical ports | payload_ref != payload body;source_ref != actor truth | reject missing source or forbidden payload |

#### 7.3.6 `RetractConversationFact`

| 项 | 内容 |
|---|---|
| 函数签名 | `handle_retract_conversation_fact(RetractConversationFactRequest request) -> Result<FactAppendReceipt, ApiError>` |
| HTTP / RPC / Event 名称 | `POST /conversation/spaces/{space_id}/facts/{fact_id}:retract` |
| 调用方 | trusted service / operator |
| 处理方 | `ConversationFactCommandHandler` -> `ConversationFactAppendService` |

```json
{
  "space_id": "ConversationSpaceId",
  "fact_id": "ConversationFactId",
  "retraction_reason": "FactRetractionReason",
  "visibility_scope_id": "Option<VisibilityScopeId>"
}
```

| 输入字段 | 类型 | 目标对象字段 | 字段来源 | 缺失处理 |
|---|---|---|---|---|
| `space_id` | `ConversationSpaceId` | lookup guard | route / request | reject |
| `fact_id` | `ConversationFactId` | `ConversationFact.fact_id` | route / request | reject |
| `retraction_reason` | `FactRetractionReason` | fact state transition reason | request | reject |
| `visibility_scope_id` | `Option<VisibilityScopeId>` | visibility guard | request guard or fact | derive from fact if absent; `ApplicationError::NotVisible` if provided value mismatches fact visibility scope |

| 输入契约 | 目标 Domain 对象 | 必填字段是否齐全 | 派生字段来源 | 不得混同的字段 | 缺失时行为 |
|---|---|---|---|---|---|
| `RetractConversationFactRequest` | `ConversationFact`、`FactAppendReceipt`、`ConversationTraceContext` | 是 | current fact from repository;receipt / trace ids from technical ports | retraction != deletion | reject missing reason or invisible fact |

`ConversationFactCommandHandler` 和 `ConversationFactAppendService` 只承载 `AppendConversationFact` / `RetractConversationFact` 的 append / retract 路径,不得承载 `ManifestExternalFact`。

#### 7.3.7 `ManifestExternalFact`

| 项 | 内容 |
|---|---|
| 函数签名 | `handle_manifest_external_fact(ManifestExternalFactRequest request) -> Result<ManifestExternalFactResult, ApiError>` |
| HTTP / RPC / Event 名称 | `POST /conversation/spaces/{space_id}/manifestations` |
| 调用方 | trusted service / source consumer |
| 处理方 | `ManifestationCommandHandler` -> `ConversationManifestationService` |

```json
{
  "space_id": "ConversationSpaceId",
  "external_fact_ref": "ExternalFactRef",
  "source_version_ref": "ExternalSourceVersionRef",
  "visibility_scope_id": "Option<VisibilityScopeId>",
  "snapshot_ref": "ExternalFactSnapshotRef",
  "manifestation_reason": "ManifestationReason"
}
```

| 输入字段 | 类型 | 目标对象字段 | 字段来源 | 缺失处理 |
|---|---|---|---|---|
| `space_id` | `ConversationSpaceId` | `CrossDomainManifestation.space_id` | route / request | reject |
| `external_fact_ref` | `ExternalFactRef` | `CrossDomainManifestation.external_fact_ref` | request or consumer derived | reject |
| `source_version_ref` | `ExternalSourceVersionRef` | `CrossDomainManifestation.source_version_ref` | request / resolver | derive from resolver or unresolved |
| `visibility_scope_id` | `Option<VisibilityScopeId>` | `CrossDomainManifestation.visibility_scope_id` | request guard or default/current space scope | derive default if absent; `ApplicationError::NotVisible` if provided value mismatches current space visibility scope |
| `snapshot_ref` | `Option<ExternalFactSnapshotRef>` | `CrossDomainManifestation.snapshot_ref` | request / resolver | allow unresolved if policy permits |
| `manifestation_reason` | `ManifestationReason` | audit / trace reason | request | reject |

| 输入契约 | 目标 Domain 对象 | 必填字段是否齐全 | 派生字段来源 | 不得混同的字段 | 缺失时行为 |
|---|---|---|---|---|---|
| `ManifestExternalFactRequest` | `CrossDomainManifestation`、`ExternalFactSnapshot`、`ConversationFact`、`ConversationTraceContext` | 是 if external ref present | snapshot may come from `ExternalFactResolverPort` | external_fact_ref != snapshot_ref;source_version_ref != digest | unresolved marker or reject by policy |

#### 7.3.8 `CreateReviewAnchor`

| 项 | 内容 |
|---|---|
| 函数签名 | `handle_create_review_anchor(CreateReviewAnchorRequest request) -> Result<ReviewAnchorCommandResult, ApiError>` |
| HTTP / RPC / Event 名称 | `POST /conversation/spaces/{space_id}/review-anchors` |
| 调用方 | trusted service / operator |
| 处理方 | `ReviewCommandHandler` -> `ConversationTraceReviewService` |

```json
{
  "space_id": "ConversationSpaceId",
  "anchor_kind": "ReviewAnchorKind",
  "target_ref": "ReviewTargetRef",
  "reason_ref": "ReviewReasonRef"
}
```

| 输入字段 | 类型 | 目标对象字段 | 字段来源 | 缺失处理 |
|---|---|---|---|---|
| `space_id` | `ConversationSpaceId` | `ReviewAnchor.space_id` | route / request | reject |
| `anchor_kind` | `ReviewAnchorKind` | `ReviewAnchor.anchor_kind` | request;schema 见 Step 6 §7.2.3 | reject unknown kind;unsupported pair 返回 `ProtocolError::InvalidCommand` |
| `target_ref` | `ReviewTargetRef` | `ReviewAnchor.target_ref` | request;schema 见 Step 6 §7.2.3 | reject missing target field,ambiguous target,unsupported target pair,target not found or not visible |
| `reason_ref` | `ReviewReasonRef` | `ReviewAnchor.reason_ref` | request;schema 见 Step 6 §7.2.3 | reject missing reason |
| `actor` | `ActorContext` | `ReviewAnchor.created_by` | command envelope | reject |

`CreateReviewAnchorRequest` 当前只允许两组 pair:

| `anchor_kind` | `target_ref.target_kind` | 加载对象 | Domain factory |
|---|---|---|---|
| `ReviewAnchorKind::Fact` | `ReviewTargetKind::Fact` | `ConversationFact` | `ReviewAnchor::for_fact(...)` |
| `ReviewAnchorKind::Manifestation` | `ReviewTargetKind::Manifestation` | `CrossDomainManifestation` | `ReviewAnchor::for_manifestation(...)` |

`ReviewTargetKind::ScopeChange`、`TraceContext`、`TraceHandoff`、`ArchiveHandoff` 和 `ProjectionState` 在本协议中不得作为 create review anchor 写路径输入;`ReviewAnchorKind::ScopeChange`、`TraceHandoff`、`ArchiveHandoff` 和 `ProjectionIssue` 只作为 shared enum 预留。调用方传入这些 target / anchor pair 时返回 `ProtocolError::InvalidCommand`,不得查 repository、不得创建 anchor、trace 或 outbox。

| 输入契约 | 目标 Domain 对象 | 必填字段是否齐全 | 派生字段来源 | 不得混同的字段 | 缺失时行为 |
|---|---|---|---|---|---|
| `CreateReviewAnchorRequest` | `ReviewAnchor`、`ConversationTraceContext` | 是 for fact / manifestation target only | anchor id / timestamp from technical ports | review anchor != governance decision;scope change / trace / handoff / projection target != current create anchor path | reject unsupported target pair,target not found or not visible |

#### 7.3.9 `RequestTraceHandoff`

| 项 | 内容 |
|---|---|
| 函数签名 | `handle_request_trace_handoff(RequestTraceHandoffRequest request) -> Result<TraceHandoffCommandResult, ApiError>` |
| HTTP / RPC / Event 名称 | `POST /conversation/trace-handoffs` |
| 调用方 | trusted service / operator |
| 处理方 | `HandoffCommandHandler` -> `ConversationTraceReviewService` |

```json
{
  "trace_context_id": "ConversationTraceContextId",
  "destination_ref": "Option<ObservabilityDestinationRef>",
  "handoff_reason": "HandoffReason"
}
```

| 输入字段 | 类型 | 目标对象字段 | 字段来源 | 缺失处理 |
|---|---|---|---|---|
| `trace_context_id` | `ConversationTraceContextId` | `TraceHandoffRecord.trace_context_id` | request | reject |
| `destination_ref` | `Option<ObservabilityDestinationRef>` | `TraceHandoffRecord.destination_ref` | request / config default;schema 见 Step 6 §7.2.3 | derive default;reject if absent and no configured default |
| `handoff_reason` | `HandoffReason` | audit reason | request;schema 见 Step 6 §7.2.3 | reject |

| 输入契约 | 目标 Domain 对象 | 必填字段是否齐全 | 派生字段来源 | 不得混同的字段 | 缺失时行为 |
|---|---|---|---|---|---|
| `RequestTraceHandoffRequest` | `TraceHandoffRecord`、`ConversationOutboxRecord` | 是 | payload_ref from trace material builder;ids from technical ports | request handoff != deliver handoff | reject missing trace context |

#### 7.3.10 `RequestArchiveHandoff`

| 项 | 内容 |
|---|---|
| 函数签名 | `handle_request_archive_handoff(RequestArchiveHandoffRequest request) -> Result<ArchiveHandoffCommandResult, ApiError>` |
| HTTP / RPC / Event 名称 | `POST /conversation/archive-handoffs` |
| 调用方 | trusted service / operator |
| 处理方 | `HandoffCommandHandler` -> `ConversationTraceReviewService` |

```json
{
  "space_id": "ConversationSpaceId",
  "trace_context_id": "ConversationTraceContextId",
  "archive_scope": "Option<ArchiveScope>",
  "retention_policy_ref": "Option<TraceRetentionPolicyRef>"
}
```

| 输入字段 | 类型 | 目标对象字段 | 字段来源 | 缺失处理 |
|---|---|---|---|---|
| `space_id` | `ConversationSpaceId` | `ArchiveHandoffRecord.space_id` | request / trace context | derive from trace or reject |
| `trace_context_id` | `ConversationTraceContextId` | handoff source and retention state target | request | reject |
| `archive_scope` | `Option<ArchiveScope>` | `ArchiveHandoffRecord.archive_scope` | request;schema 见 Step 6 §7.2.3 | derive space scope;reject if missing `space_id` or default scope disallowed |
| `retention_policy_ref` | `Option<TraceRetentionPolicyRef>` | `ArchiveHandoffRecord.retention_policy_ref` | request / config default;schema 见 Step 6 §7.2.3 | derive default;reject if absent and no configured default |

| 输入契约 | 目标 Domain 对象 | 必填字段是否齐全 | 派生字段来源 | 不得混同的字段 | 缺失时行为 |
|---|---|---|---|---|---|
| `RequestArchiveHandoffRequest` | `ConversationTraceContext`、`ArchiveHandoffRecord`、`ConversationOutboxRecord` | 是 | archive scope may derive to `ArchiveScope::Space`;archive package ref absent until delivery job | archive request != archive package;public request != close-flow archive | reject missing trace context or insufficient scope |

当前 PH-06 public `RequestArchiveHandoffRequest.trace_context_id` 必填。whole-space archive request 可以使用 `ArchiveScope::Space`,但仍必须提供 trace context,以便 `ConversationTraceContext.retention_state` 与 archive handoff intent 在同一 UoW 进入 `HandoffPending`。不允许 service 在缺少 `trace_context_id` 时临时查找或创建 trace context;`ArchiveHandoffRecord::from_space_close(...)` 仅供 close flow 等内部路径使用。

### 7.4 Query API 协议契约

#### 7.4.0 Query request / view DTO 字段级 schema

HLD `02_hld_step_07_api_interface_skeleton.md` 中的 `*Query` 是语义入口名;本 DDD Step 8 的正式 Rust DTO 名统一为 `*Request`。实现侧必须落 `GetConversationReadModelRequest`、`ListConversationFactsRequest` 和 `GetConversationProjectionStateRequest`,不得同时新增一套 `*Query` struct。

Query API 的公共 envelope 为 `QueryEnvelope { query, consumer: ConsumerContext, metadata: QueryMetadata }`。下列 request DTO 只保存 query body 字段;`consumer_ref` 可以在 request body 中显式给出,也可以由 envelope `ConsumerContext.consumer_ref` 派生。分页与一致性只能来自 core `QueryMetadata.page` / `QueryMetadata.consistency`,不得在 query body 中另设 `page`、`page_token` 或 `consistency` 顶层字段。`PollConversationChangesRequest.limit` 是 cursor poll 的最大返回条数,不承载 page token 或 consistency;它必须使用 `PageLimit`,不得使用 job `BatchSize`。

落码归属:

- `GetConversationReadModelRequest`、`ListConversationFactsRequest`、`GetConversationChangeCursorRequest`、`PollConversationChangesRequest`、`SearchConversationHistoryRequest`、`GetConversationProjectionStateRequest` 属于 `contracts/queries.rs`。
- `ConversationReadModelView`、`ConversationFactView`、`ConversationFactPage`、`ConversationChangeCursorView`、`ConversationChangePage`、`ConversationSearchResultPage`、`ConversationProjectionStateView` 属于 `contracts/views.rs`。
- 这些 DTO 只能依赖 `contracts/refs.rs`、`contracts/visibility.rs` 和 core `QueryMetadata` / `PageToken` 等公共类型,不得依赖 `domain` crate。
- `ConversationFactView.fact_state` 使用 `contracts/refs.rs::ConversationFactState`;domain `ConversationFact` 复用同一个 shared enum,不得让 `contracts/views.rs` 依赖 domain-local enum。
- `PollConversationChangesRequest.limit` 使用 `PageLimit`;`BatchSize` 只用于 job / outbox publish / rebuild batch,不得用于 public query request。

```rust
/// Request body for GetConversationReadModel.
pub struct GetConversationReadModelRequest {
    /// Space to read.
    pub space_id: ConversationSpaceId,
    /// Optional consumer override; absent means use QueryEnvelope.consumer.consumer_ref.
    pub consumer_ref: Option<ConsumerRef>,
}

/// Request body for ListConversationFacts.
pub struct ListConversationFactsRequest {
    /// Space to list facts from.
    pub space_id: ConversationSpaceId,
    /// Optional consumer override; absent means use QueryEnvelope.consumer.consumer_ref.
    pub consumer_ref: Option<ConsumerRef>,
    /// Whether formally retracted facts may appear as retracted markers.
    pub include_retracted: bool,
}

/// Request body for GetConversationChangeCursor.
pub struct GetConversationChangeCursorRequest {
    /// Space whose cursor is requested.
    pub space_id: ConversationSpaceId,
    /// Consumer that owns the cursor.
    pub consumer_ref: ConsumerRef,
    /// Optional cursor id; absent means derive by space and consumer.
    pub cursor_id: Option<ConversationChangeCursorId>,
    /// Initial fact sequence used only when no cursor exists.
    pub from_sequence: Option<ConversationFactSequence>,
}

/// Request body for PollConversationChanges.
pub struct PollConversationChangesRequest {
    /// Space whose changes are polled.
    pub space_id: ConversationSpaceId,
    /// Consumer that owns the cursor.
    pub consumer_ref: ConsumerRef,
    /// Cursor to resume from.
    pub cursor_id: ConversationChangeCursorId,
    /// Maximum change entries to return.
    pub limit: PageLimit,
}

/// Request body for SearchConversationHistory.
pub struct SearchConversationHistoryRequest {
    /// Space whose history is searched.
    pub space_id: ConversationSpaceId,
    /// Consumer used for result authorization.
    pub consumer_ref: Option<ConsumerRef>,
    /// Search text accepted by the query boundary.
    pub query_text: SearchQueryText,
}

/// Request body for GetConversationProjectionState.
pub struct GetConversationProjectionStateRequest {
    /// Space whose projection state is requested.
    pub space_id: ConversationSpaceId,
    /// Projection kind to inspect.
    pub projection_kind: ConversationProjectionKind,
}
```

| DTO | 字段 | 类型 | 来源 | 缺失 / 非法处理 |
|---|---|---|---|---|
| `GetConversationReadModelRequest` | `space_id` | `ConversationSpaceId` | route / request body | 缺失返回 `ProtocolError::MissingRequiredField` |
| `GetConversationReadModelRequest` | `consumer_ref` | `Option<ConsumerRef>` | request body 或 envelope consumer | 两者都缺失返回 `ProtocolError::MissingRequiredField`;两者都存在但不一致返回 `ApplicationError::NotVisible` |
| `ListConversationFactsRequest` | `space_id` | `ConversationSpaceId` | route / request body | 缺失返回 `ProtocolError::MissingRequiredField` |
| `ListConversationFactsRequest` | `consumer_ref` | `Option<ConsumerRef>` | request body 或 envelope consumer | 两者都缺失返回 `ProtocolError::MissingRequiredField`;两者都存在但不一致返回 `ApplicationError::NotVisible` |
| `ListConversationFactsRequest` | `include_retracted` | `bool` | request body | 缺省为 `false`;不得绕过 visibility |
| `GetConversationChangeCursorRequest` | `space_id` | `ConversationSpaceId` | route / request body | 缺失返回 `ProtocolError::MissingRequiredField` |
| `GetConversationChangeCursorRequest` | `consumer_ref` | `ConsumerRef` | request body | 缺失返回 `ProtocolError::MissingRequiredField` |
| `GetConversationChangeCursorRequest` | `cursor_id` | `Option<ConversationChangeCursorId>` | request body | 缺省时按 `space_id + consumer_ref` 稳定派生;若存在但不匹配派生 cursor owner,返回 `ApplicationError::NotVisible` |
| `GetConversationChangeCursorRequest` | `from_sequence` | `Option<ConversationFactSequence>` | request body | 只在 cursor row 缺失时用于初始 cursor;缺省为 `ConversationFactSequence(0)` |
| `PollConversationChangesRequest` | `space_id` | `ConversationSpaceId` | route / request body | 缺失返回 `ProtocolError::MissingRequiredField` |
| `PollConversationChangesRequest` | `consumer_ref` | `ConsumerRef` | request body | 缺失返回 `ProtocolError::MissingRequiredField` |
| `PollConversationChangesRequest` | `cursor_id` | `ConversationChangeCursorId` | request body | 缺失返回 `ProtocolError::MissingRequiredField`;必须与 repository cursor owner 一致 |
| `PollConversationChangesRequest` | `limit` | `PageLimit` | request body 或 query default | 缺省使用 config default `PageLimit`;不得使用 `BatchSize` |
| `SearchConversationHistoryRequest` | `space_id` | `ConversationSpaceId` | route / request body | 缺失返回 `ProtocolError::MissingRequiredField` |
| `SearchConversationHistoryRequest` | `consumer_ref` | `Option<ConsumerRef>` | request body 或 envelope consumer | 两者都缺失返回 `ProtocolError::MissingRequiredField`;两者都存在但不一致返回 `ApplicationError::NotVisible` |
| `SearchConversationHistoryRequest` | `query_text` | `SearchQueryText` | request body | 缺失、trim 后为空或超出 `SearchQueryText` 上限返回 `ProtocolError::InvalidQuery` |
| `GetConversationProjectionStateRequest` | `space_id` | `ConversationSpaceId` | route / request body | 缺失返回 `ProtocolError::MissingRequiredField` |
| `GetConversationProjectionStateRequest` | `projection_kind` | `ConversationProjectionKind` | request body | 缺失或未知返回 `ProtocolError::InvalidQuery` |

```rust
/// DTO returned by GetConversationReadModel after visibility filtering.
pub struct ConversationReadModelView {
    /// Stable authorized read model id.
    pub read_model_id: ConversationReadModelId,
    /// Space represented by the view.
    pub space_id: ConversationSpaceId,
    /// Consumer used for visibility filtering.
    pub consumer_ref: ConsumerRef,
    /// Visible fact refs only.
    pub visible_fact_refs: Vec<ConversationFactRef>,
    /// Visible manifestation refs only.
    pub visible_manifestation_refs: Vec<CrossDomainManifestationRef>,
    /// Optional cursor ref for incremental reads.
    pub cursor_ref: Option<ConversationChangeCursorRef>,
    /// Projection freshness and failure marker.
    pub projection_state: ConversationProjectionStateView,
    /// Whether no visible fact or manifestation refs are present.
    pub is_empty: bool,
}

/// DTO returned for a single visible fact.
pub struct ConversationFactView {
    /// Stable fact id.
    pub fact_id: ConversationFactId,
    /// Space that owns the fact.
    pub space_id: ConversationSpaceId,
    /// Fact category.
    pub fact_kind: ConversationFactKind,
    /// Traceable source ref; never source body.
    pub source_ref: FactSourceRef,
    /// Visibility scope that was checked before returning the view.
    pub visibility_scope_id: VisibilityScopeId,
    /// Payload reference; never payload body.
    pub payload_ref: ConversationFactPayloadRef,
    /// Append sequence within the space.
    pub append_sequence: ConversationFactSequence,
    /// Current fact state.
    pub fact_state: ConversationFactState,
    /// True when the view is only a retracted marker.
    pub is_retracted_marker: bool,
}

/// Paged visible facts result.
pub struct ConversationFactPage {
    /// Space listed by this page.
    pub space_id: ConversationSpaceId,
    /// Consumer used for visibility filtering.
    pub consumer_ref: ConsumerRef,
    /// Visible fact views in page order.
    pub items: Vec<ConversationFactView>,
    /// Next core page token if more items exist.
    pub next_page_token: Option<PageToken>,
    /// Whether the repository returned more visible or hidden candidates.
    pub has_more: bool,
    /// Projection freshness and failure marker for the read path.
    pub projection_state: ConversationProjectionStateView,
    /// True when `items` is empty after visibility filtering.
    pub is_empty: bool,
}

/// DTO returned by GetConversationChangeCursor.
pub struct ConversationChangeCursorView {
    /// Stable cursor reference.
    pub cursor_ref: ConversationChangeCursorRef,
    /// Current cursor state.
    pub cursor_state: ConversationChangeCursorState,
    /// Last consumed fact sequence.
    pub last_fact_sequence: ConversationFactSequence,
    /// Last consumed outbox sequence.
    pub last_outbox_sequence: ConversationOutboxSequence,
    /// Projection freshness and failure marker for the change cursor projection.
    pub projection_state: ConversationProjectionStateView,
    /// True when the cursor was synthesized because no committed cursor row exists.
    pub is_initial: bool,
}

/// Paged change entries result.
pub struct ConversationChangePage {
    /// Stable cursor reference used to produce the page.
    pub cursor_ref: ConversationChangeCursorRef,
    /// Visible change entries in outbox order.
    pub changes: Vec<ConversationChangeCursorEntry>,
    /// Next outbox sequence a caller can use after this page.
    pub next_outbox_sequence: ConversationOutboxSequence,
    /// Next fact sequence covered by the visible entries.
    pub next_fact_sequence: ConversationFactSequence,
    /// Whether more change entries may exist after this page.
    pub has_more: bool,
    /// Projection freshness and failure marker for the change cursor projection.
    pub projection_state: ConversationProjectionStateView,
    /// True when `changes` is empty after visibility filtering.
    pub is_empty: bool,
}

/// Paged search result for authorized conversation history.
pub struct ConversationSearchResultPage {
    /// Space searched by the query.
    pub space_id: ConversationSpaceId,
    /// Consumer used for result authorization.
    pub consumer_ref: ConsumerRef,
    /// Query text accepted by the query boundary.
    pub query_text: SearchQueryText,
    /// Authorized fact refs returned by search.
    pub fact_refs: Vec<ConversationFactRef>,
    /// Authorized manifestation refs returned by search.
    pub manifestation_refs: Vec<CrossDomainManifestationRef>,
    /// Next core page token if the search adapter can continue.
    pub next_page_token: Option<PageToken>,
    /// Whether more search hits may exist after this page.
    pub has_more: bool,
    /// Projection freshness and failure marker for the search projection.
    pub projection_state: ConversationProjectionStateView,
    /// True when no authorized hits remain after filtering.
    pub is_empty: bool,
}

/// Query-visible projection freshness and failure marker.
pub struct ConversationProjectionStateView {
    /// Projection state id when a committed state exists.
    pub projection_state_id: Option<ConversationProjectionStateId>,
    /// Space represented by the projection state.
    pub space_id: ConversationSpaceId,
    /// Projection kind represented by the state.
    pub projection_kind: ConversationProjectionKind,
    /// Freshness state; missing state is exposed as Stale.
    pub freshness_state: ProjectionFreshnessState,
    /// Source position covered by the projection, when known.
    pub source_position: Option<ConversationSourcePosition>,
    /// Last rebuild ref, if any.
    pub last_rebuild_ref: Option<ProjectionRebuildRef>,
    /// Last error ref, if any.
    pub last_error_ref: Option<ProjectionErrorRef>,
    /// True when no committed projection state row exists.
    pub is_empty_state: bool,
    /// True when reads are degraded because state is Stale, Failed, Rebuilding, Disabled, or empty.
    pub is_degraded: bool,
}
```

| View DTO | 字段 | 类型 | 来源 / 构造规则 | 约束 |
|---|---|---|---|---|
| `ConversationReadModelView` | `read_model_id` | `ConversationReadModelId` | `ConversationReadModel.read_model_id` or `ConversationReadModelId::for_consumer(space_id, consumer_ref)` | 空 view 也必须稳定 |
| `ConversationReadModelView` | `space_id` | `ConversationSpaceId` | request / read model | 必须一致 |
| `ConversationReadModelView` | `consumer_ref` | `ConsumerRef` | resolved consumer | 必须完成可见性裁剪 |
| `ConversationReadModelView` | `visible_fact_refs` | `Vec<ConversationFactRef>` | authorized read model | 不含不可见 fact |
| `ConversationReadModelView` | `visible_manifestation_refs` | `Vec<CrossDomainManifestationRef>` | authorized read model | 不含不可见 manifestation |
| `ConversationReadModelView` | `cursor_ref` | `Option<ConversationChangeCursorRef>` | authorized read model cursor | 只输出 ref,不推进 cursor |
| `ConversationReadModelView` | `projection_state` | `ConversationProjectionStateView` | `ConversationProjectionStateView::from_state_or_empty(...)` | stale / failed / empty 不得隐藏 |
| `ConversationReadModelView` | `is_empty` | `bool` | `visible_fact_refs.is_empty() && visible_manifestation_refs.is_empty()` | not visible 被过滤后可为 true |
| `ConversationFactView` | `fact_id` | `ConversationFactId` | `ConversationFact.fact_id` | 必填 |
| `ConversationFactView` | `space_id` | `ConversationSpaceId` | `ConversationFact.space_id` | 必须匹配 query space |
| `ConversationFactView` | `fact_kind` | `ConversationFactKind` | `ConversationFact.fact_kind` | 不映射 UI message type |
| `ConversationFactView` | `source_ref` | `FactSourceRef` | `ConversationFact.source_ref` | 不含 source body |
| `ConversationFactView` | `visibility_scope_id` | `VisibilityScopeId` | `ConversationFact.visibility_scope_id` | 必须已通过 visibility guard |
| `ConversationFactView` | `payload_ref` | `ConversationFactPayloadRef` | `ConversationFact.payload_ref` | 不含 payload body |
| `ConversationFactView` | `append_sequence` | `ConversationFactSequence` | `ConversationFact.append_sequence` | 只读 |
| `ConversationFactView` | `fact_state` | `ConversationFactState` | `ConversationFact.fact_state` | `Retracted` 仅在 `include_retracted = true` 时可返回 marker |
| `ConversationFactView` | `is_retracted_marker` | `bool` | `fact_state == Retracted` | marker 不恢复正文 |
| `ConversationFactPage` | `items` | `Vec<ConversationFactView>` | visibility-filtered facts | 不含不可见 facts |
| `ConversationFactPage` | `next_page_token` | `Option<PageToken>` | `PageInfo.next_page_token` from `application::ports::Page<ConversationFactRef>` | 使用 core-contracts `PageToken`;`PageInfo` schema 见 Step 7 §7.3.0 |
| `ConversationFactPage` | `has_more` | `bool` | `PageInfo.has_more` from `application::ports::Page<ConversationFactRef>` | 隐藏项被过滤后仍可为 true |
| `ConversationFactPage` | `projection_state` | `ConversationProjectionStateView` | read model projection state | stale / failed / empty 不得隐藏 |
| `ConversationFactPage` | `is_empty` | `bool` | `items.is_empty()` | 空页不表示 space 不存在 |
| `ConversationChangeCursorView` | `cursor_ref` | `ConversationChangeCursorRef` | `ConversationChangeCursorRef::from_cursor(cursor)` | 必须包含 `cursor_id`、`space_id`、`consumer_ref` |
| `ConversationChangeCursorView` | `cursor_state` | `ConversationChangeCursorState` | cursor | expired / invalidated 必须显式暴露 |
| `ConversationChangeCursorView` | `last_fact_sequence` | `ConversationFactSequence` | cursor | initial cursor 缺省为 `ConversationFactSequence(0)` 或 request `from_sequence` |
| `ConversationChangeCursorView` | `last_outbox_sequence` | `ConversationOutboxSequence` | cursor | initial cursor 使用 `ConversationOutboxSequence(0)` |
| `ConversationChangeCursorView` | `projection_state` | `ConversationProjectionStateView` | change cursor projection state | stale / failed / empty 不得隐藏 |
| `ConversationChangeCursorView` | `is_initial` | `bool` | cursor row 是否缺失 | initial view 不写 cursor row |
| `ConversationChangePage` | `cursor_ref` | `ConversationChangeCursorRef` | loaded cursor | 必须匹配 request cursor owner |
| `ConversationChangePage` | `changes` | `Vec<ConversationChangeCursorEntry>` | visibility-filtered change entries | 不含 payload body;不含不可见 entries |
| `ConversationChangePage` | `next_outbox_sequence` | `ConversationOutboxSequence` | `max(changes.outbox_sequence)` 或 cursor 原值 | 空页保持 cursor 原 outbox sequence |
| `ConversationChangePage` | `next_fact_sequence` | `ConversationFactSequence` | `max(changes.fact_sequence)` 或 cursor 原值 | 空页保持 cursor 原 fact sequence |
| `ConversationChangePage` | `has_more` | `bool` | repository page / `limit` has-more probe | P0 若 repository 返回 `limit` 条可置 true;后续可用 PageInfo 收敛 |
| `ConversationChangePage` | `projection_state` | `ConversationProjectionStateView` | change cursor projection state | stale / failed / empty 不得隐藏 |
| `ConversationChangePage` | `is_empty` | `bool` | `changes.is_empty()` | 空页不表示 cursor 缺失 |
| `ConversationSearchResultPage` | `space_id` | `ConversationSpaceId` | request | 必填 |
| `ConversationSearchResultPage` | `consumer_ref` | `ConsumerRef` | resolved consumer | 必须完成授权过滤 |
| `ConversationSearchResultPage` | `query_text` | `SearchQueryText` | request | 不回显 payload body |
| `ConversationSearchResultPage` | `fact_refs` | `Vec<ConversationFactRef>` | authorized search hits | 不含不可见 facts |
| `ConversationSearchResultPage` | `manifestation_refs` | `Vec<CrossDomainManifestationRef>` | authorized search hits | 不含不可见 manifestations |
| `ConversationSearchResultPage` | `next_page_token` | `Option<PageToken>` | search adapter / `QueryMetadata.page` result | 无下一页时为 `None` |
| `ConversationSearchResultPage` | `has_more` | `bool` | search adapter result | 不由 `fact_refs.is_empty()` 推导 |
| `ConversationSearchResultPage` | `projection_state` | `ConversationProjectionStateView` | search projection state | stale / failed / empty 不得隐藏 |
| `ConversationSearchResultPage` | `is_empty` | `bool` | `fact_refs.is_empty() && manifestation_refs.is_empty()` | 空页不表示 index 不存在 |
| `ConversationProjectionStateView` | `projection_state_id` | `Option<ConversationProjectionStateId>` | state row | empty marker 时为 `None` |
| `ConversationProjectionStateView` | `space_id` | `ConversationSpaceId` | request | 必填 |
| `ConversationProjectionStateView` | `projection_kind` | `ConversationProjectionKind` | request / state | 必须一致 |
| `ConversationProjectionStateView` | `freshness_state` | `ProjectionFreshnessState` | state row;missing state -> `Stale` | 不得把 missing state 标成 `Fresh` |
| `ConversationProjectionStateView` | `source_position` | `Option<ConversationSourcePosition>` | state row | missing state 时为 `None` |
| `ConversationProjectionStateView` | `last_rebuild_ref` | `Option<ProjectionRebuildRef>` | state row | 可为空 |
| `ConversationProjectionStateView` | `last_error_ref` | `Option<ProjectionErrorRef>` | state row | failed 时应保留 |
| `ConversationProjectionStateView` | `is_empty_state` | `bool` | state row 是否缺失 | 缺失不触发 rebuild |
| `ConversationProjectionStateView` | `is_degraded` | `bool` | `freshness_state != Fresh || is_empty_state` | query 只暴露 marker |

Read model / view 转换边界:

- `ConversationReadModel` 属于 `domain/projection.rs`,由 `ProjectionRepository.get_read_model(...)` 读取,并在 `VisibilityPolicy.filter_read_model(...)` 后进入 query response 构造。
- `ConversationReadModelView` 属于 `contracts/views.rs`,只表示 public query response DTO。
- `ConversationReadModelView::from_authorized(...)` 的输入必须是已授权的 `ConversationReadModel` 加 `ConversationProjectionState` / `ConversationProjectionStateView` 相关信息;不得让 repository 直接返回 `ConversationReadModelView`。
- read model row 缺失时,service 使用 `ConversationReadModel::empty_for_consumer(space_id, consumer_ref)` 形成内部空 read model,再映射为 `ConversationReadModelView::empty_for_consumer(...)` 或等价 public empty view。
- `ConversationChangeCursorView::from_cursor(...)` 的输入必须是 `domain/cursor.rs::ConversationChangeCursor` 加 `ConversationProjectionStateView`;repository 不得直接返回 `ConversationChangeCursorView`。
- `ConversationChangePage::from_visible(...)` 的输入必须是已完成 visibility 过滤的 `Vec<ConversationChangeCursorEntry>`、当前 cursor 和 change cursor projection state;不得包含 full fact payload 或 outbox payload body。
- `ConversationSearchResultPage::from_authorized(...)` 的输入必须是已授权 search hits、resolved consumer、search projection state 和 page metadata;不得让 search adapter 直接返回 public response DTO。

Query error / empty surface 口径:

- `GetConversationReadModel` 读取到 space / visibility scope 缺失时返回 `ApplicationError::NotFound`。
- `GetConversationReadModel` 中目标 consumer 无可见 facts 或 read model 缺失时返回 `ConversationReadModelView::empty_for_consumer(...)`,不写 projection。
- `GetConversationFact` 对单个不可见 fact 返回 `ApplicationError::NotVisible`,不得返回 empty fact。
- `ListConversationFacts` 对不可见 facts 做过滤;若过滤后为空,返回 `ConversationFactPage { items: [], is_empty: true, ... }`。
- `GetConversationChangeCursor` 找不到 cursor row 时返回 initial `ConversationChangeCursorView { is_initial: true, ... }`;不得写入 cursor row。
- `PollConversationChanges` 找不到 cursor row 返回 `ApplicationError::NotFound`;cursor expired / invalidated 返回对应 marker 或 `ApplicationError::InvalidCursor`,不得静默从零开始。
- `SearchConversationHistory` 无命中或命中过滤后为空时返回 `ConversationSearchResultPage { fact_refs: [], manifestation_refs: [], is_empty: true, ... }`。
- `GetConversationProjectionState` 找不到 state row 时返回 `ConversationProjectionStateView::empty_stale(space_id, projection_kind)`,不得返回 `Fresh`。
- Query 读取 stale / failed / rebuilding / disabled projection 时只暴露 `ConversationProjectionStateView`,不得在 query flow 中触发 rebuild 或修改 state。

#### 7.4.1 `GetConversationReadModel`

| 项 | 内容 |
|---|---|
| 函数签名 | `handle_get_conversation_read_model(GetConversationReadModelRequest request, ConsumerContext consumer_context, QueryMetadata metadata) -> Result<ConversationReadModelView, ApiError>` |
| HTTP / RPC / Event 名称 | `GET /conversation/spaces/{space_id}/read-model` |
| 调用方 | SDK / Chat / Workspace / Runtime |
| 处理方 | `ConversationQueryHandler` -> `AuthorizedConversationQueryService` |

```json
{
  "space_id": "ConversationSpaceId",
  "consumer_ref": "ConsumerRef"
}
```

| 输入契约 | 读取对象 | 必填字段是否齐全 | 派生字段来源 | 不得混同的字段 | 缺失时行为 |
|---|---|---|---|---|---|
| `GetConversationReadModelRequest` | `ConversationReadModel`、`VisibilityScope`、`ExternalReferenceProjection` | 是 | consumer from query envelope if omitted;consistency from `QueryMetadata.consistency` | consumer_ref != actor_ref unless explicitly same | reject missing space or consumer |

#### 7.4.2 `ListConversationFacts`

| 项 | 内容 |
|---|---|
| 函数签名 | `handle_list_conversation_facts(ListConversationFactsRequest request, ConsumerContext consumer_context, QueryMetadata metadata) -> Result<ConversationFactPage, ApiError>` |
| HTTP / RPC / Event 名称 | `GET /conversation/spaces/{space_id}/facts` |
| 调用方 | SDK / Chat / Workspace |
| 处理方 | `ConversationQueryHandler` -> `AuthorizedConversationQueryService` |

```json
{
  "space_id": "ConversationSpaceId",
  "consumer_ref": "ConsumerRef",
  "include_retracted": false
}
```

| 输入契约 | 读取对象 | 必填字段是否齐全 | 派生字段来源 | 不得混同的字段 | 缺失时行为 |
|---|---|---|---|---|---|
| `ListConversationFactsRequest` | `ConversationFact` refs、`ConversationReadModel` | 是 | page from `QueryMetadata.page` or config default | include_retracted != bypass visibility | reject missing consumer |

#### 7.4.3 `GetConversationFact`

| 项 | 内容 |
|---|---|
| 函数签名 | `handle_get_conversation_fact(GetConversationFactRequest request) -> Result<ConversationFactView, ApiError>` |
| HTTP / RPC / Event 名称 | `GET /conversation/facts/{fact_id}` |
| 调用方 | SDK / Chat / Workspace |
| 处理方 | `ConversationQueryHandler` -> `AuthorizedConversationQueryService` |

```json
{
  "fact_id": "ConversationFactId",
  "consumer_ref": "ConsumerRef"
}
```

| 输入契约 | 读取对象 | 必填字段是否齐全 | 派生字段来源 | 不得混同的字段 | 缺失时行为 |
|---|---|---|---|---|---|
| `GetConversationFactRequest` | `ConversationFact`、`VisibilityScope`、`ExternalFactSnapshot` | 是 | space resolved from fact | fact_id != payload_ref | `NotVisible` or not found |

#### 7.4.4 `GetConversationChangeCursor`

| 项 | 内容 |
|---|---|
| 函数签名 | `handle_get_conversation_change_cursor(GetConversationChangeCursorRequest request) -> Result<ConversationChangeCursorView, ApiError>` |
| HTTP / RPC / Event 名称 | `GET /conversation/spaces/{space_id}/change-cursor` |
| 调用方 | SDK / Chat / Workspace / Runtime |
| 处理方 | `ConversationQueryHandler` -> `AuthorizedConversationQueryService` |

```json
{
  "space_id": "ConversationSpaceId",
  "consumer_ref": "ConsumerRef",
  "cursor_id": "Option<ConversationChangeCursorId>",
  "from_sequence": "Option<ConversationFactSequence>"
}
```

| 输入契约 | 读取对象 | 必填字段是否齐全 | 派生字段来源 | 不得混同的字段 | 缺失时行为 |
|---|---|---|---|---|---|
| `GetConversationChangeCursorRequest` | `ConversationChangeCursor`、`VisibilityScope`、`ConversationProjectionState` | 是 | cursor may be derived from space + consumer;`from_sequence` default is `ConversationFactSequence(0)` | cursor_id != fact sequence;from_sequence != outbox sequence | create initial cursor view or reject by policy |

#### 7.4.5 `PollConversationChanges`

| 项 | 内容 |
|---|---|
| 函数签名 | `handle_poll_conversation_changes(PollConversationChangesRequest request) -> Result<ConversationChangePage, ApiError>` |
| HTTP / RPC / Event 名称 | `GET /conversation/spaces/{space_id}/changes` |
| 调用方 | SDK / Chat / Workspace / Runtime |
| 处理方 | `ConversationQueryHandler` -> `AuthorizedConversationQueryService` |

```json
{
  "space_id": "ConversationSpaceId",
  "consumer_ref": "ConsumerRef",
  "cursor_id": "ConversationChangeCursorId",
  "limit": "PageLimit"
}
```

| 输入契约 | 读取对象 | 必填字段是否齐全 | 派生字段来源 | 不得混同的字段 | 缺失时行为 |
|---|---|---|---|---|---|
| `PollConversationChangesRequest` | `ChangeCursorProjection`、`ConversationOutboxRecord`、`VisibilityScope` | 是 | `PageLimit` default from config | change event != full fact payload;PageLimit != BatchSize | stale / expired cursor marker |

#### 7.4.6 `SearchConversationHistory`

| 项 | 内容 |
|---|---|
| 函数签名 | `handle_search_conversation_history(SearchConversationHistoryRequest request, ConsumerContext consumer_context, QueryMetadata metadata) -> Result<ConversationSearchResultPage, ApiError>` |
| HTTP / RPC / Event 名称 | `GET /conversation/spaces/{space_id}/search` |
| 调用方 | SDK / Chat / Workspace |
| 处理方 | `ConversationQueryHandler` -> `AuthorizedConversationQueryService` |

```json
{
  "space_id": "ConversationSpaceId",
  "consumer_ref": "ConsumerRef",
  "query_text": "SearchQueryText"
}
```

| 输入契约 | 读取对象 | 必填字段是否齐全 | 派生字段来源 | 不得混同的字段 | 缺失时行为 |
|---|---|---|---|---|---|
| `SearchConversationHistoryRequest` | `SearchIndexProjection`、`ConversationReadModel` | 是 | page from `QueryMetadata.page` or config default | search result != truth | stale projection marker |

#### 7.4.7 `GetCrossDomainManifestation`

| 项 | 内容 |
|---|---|
| 函数签名 | `handle_get_cross_domain_manifestation(GetCrossDomainManifestationRequest request) -> Result<CrossDomainManifestationView, ApiError>` |
| HTTP / RPC / Event 名称 | `GET /conversation/manifestations/{manifestation_id}` |
| 调用方 | SDK / Chat / Workspace / reports |
| 处理方 | `ConversationQueryHandler` -> `AuthorizedConversationQueryService` |

```json
{
  "manifestation_id": "CrossDomainManifestationId",
  "consumer_ref": "ConsumerRef"
}
```

| 输入契约 | 读取对象 | 必填字段是否齐全 | 派生字段来源 | 不得混同的字段 | 缺失时行为 |
|---|---|---|---|---|---|
| `GetCrossDomainManifestationRequest` | `CrossDomainManifestation`、`ExternalFactSnapshot`、`VisibilityScope` | 是 | snapshot loaded from snapshot repo | manifestation_id != external_fact_ref | NotVisible / unresolved marker |

#### 7.4.8 `GetConversationTraceContext`

| 项 | 内容 |
|---|---|
| 函数签名 | `handle_get_conversation_trace_context(GetConversationTraceContextRequest request) -> Result<ConversationTraceContextView, ApiError>` |
| HTTP / RPC / Event 名称 | `GET /conversation/traces/{trace_context_id}` |
| 调用方 | trusted service / operator / reports |
| 处理方 | `ConversationQueryHandler` -> `ConversationTraceReviewService` |

```json
{
  "trace_context_id": "ConversationTraceContextId",
  "actor_ref": "ActorRef"
}
```

| 输入契约 | 读取对象 | 必填字段是否齐全 | 派生字段来源 | 不得混同的字段 | 缺失时行为 |
|---|---|---|---|---|---|
| `GetConversationTraceContextRequest` | `ConversationTraceContext`、`VisibilityPolicy` | 是 | actor may come from query envelope | trace context != global trace store | reject not authorized |

#### 7.4.9 `GetReviewAnchor`

| 项 | 内容 |
|---|---|
| 函数签名 | `handle_get_review_anchor(GetReviewAnchorRequest request) -> Result<ReviewAnchorView, ApiError>` |
| HTTP / RPC / Event 名称 | `GET /conversation/review-anchors/{review_anchor_id}` |
| 调用方 | trusted service / operator / reports |
| 处理方 | `ConversationQueryHandler` -> `ConversationTraceReviewService` |

```json
{
  "review_anchor_id": "ReviewAnchorId",
  "actor_ref": "ActorRef"
}
```

| 输入契约 | 读取对象 | 必填字段是否齐全 | 派生字段来源 | 不得混同的字段 | 缺失时行为 |
|---|---|---|---|---|---|
| `GetReviewAnchorRequest` | `ReviewAnchor`、`ConversationTraceContext` | 是 | actor may come from envelope | review anchor != governance decision | reject not visible |

#### 7.4.10 `GetConversationProjectionState`

| 项 | 内容 |
|---|---|
| 函数签名 | `handle_get_conversation_projection_state(GetConversationProjectionStateRequest request, ActorContext actor, QueryMetadata metadata) -> Result<ConversationProjectionStateView, ApiError>` |
| HTTP / RPC / Event 名称 | `GET /conversation/spaces/{space_id}/projection-state` |
| 调用方 | operator / SDK / reports |
| 处理方 | `ConversationQueryHandler` -> `ConversationDerivedMaintenanceService` |

```json
{
  "space_id": "ConversationSpaceId",
  "projection_kind": "ConversationProjectionKind",
  "actor_ref": "ActorRef"
}
```

| 输入契约 | 读取对象 | 必填字段是否齐全 | 派生字段来源 | 不得混同的字段 | 缺失时行为 |
|---|---|---|---|---|---|
| `GetConversationProjectionStateRequest` | `ConversationProjectionState` | 是 | actor may come from envelope | projection state != truth state | empty state or not found marker |

#### 7.4.11 `GetExternalReferenceProjection`

| 项 | 内容 |
|---|---|
| 函数签名 | `handle_get_external_reference_projection(GetExternalReferenceProjectionRequest request) -> Result<ExternalReferenceProjectionView, ApiError>` |
| HTTP / RPC / Event 名称 | `GET /conversation/spaces/{space_id}/external-references` |
| 调用方 | SDK / Chat / Workspace / reports |
| 处理方 | `ConversationQueryHandler` -> `AuthorizedConversationQueryService` |

```json
{
  "space_id": "ConversationSpaceId",
  "consumer_ref": "ConsumerRef",
  "include_unresolved": true
}
```

| 输入契约 | 读取对象 | 必填字段是否齐全 | 派生字段来源 | 不得混同的字段 | 缺失时行为 |
|---|---|---|---|---|---|
| `GetExternalReferenceProjectionRequest` | `ExternalReferenceProjection`、`ExternalFactSnapshot` | 是 | consumer may come from envelope | external reference projection != source truth | return empty / unresolved marker |

### 7.5 Inbound Event Consumer 协议契约

本节所有函数签名均使用 `InboundEventEnvelope<T>` 承载 source envelope metadata。下列 JSON 示例只描述 `payload` 字段,不得把 `event_id`、`event_envelope_ref`、`event_source_ref`、`idempotency_key`、`occurred_at` 或 `trace_ref` 复制进 payload struct。consumer 的 duplicate / quarantine / delayed / no-op 返回面统一使用 §6.3 `ConsumerReceipt`。

#### 7.5.1 `ConsumeWorkContextChanged`

| 项 | 内容 |
|---|---|
| 函数签名 | `consume_work_context_changed(InboundEventEnvelope<WorkContextChangedEvent> event) -> Result<ConsumerReceipt, ConsumerError>` |
| HTTP / RPC / Event 名称 | `topic: work.context.changed` |
| 调用方 | L1-work / L0-bus |
| 处理方 | `ConversationInboundConsumer` -> `ExternalReferenceIngestionService` |

```json
{
  "work_context_ref": "ExternalSourceObjectRef",
  "source_version_ref": "ExternalSourceVersionRef",
  "source_digest": "ExternalSourceDigest",
  "affected_space_refs": ["ConversationSpaceId"]
}
```

| 输入字段 | 类型 | 目标对象字段 | 字段来源 | 缺失处理 |
|---|---|---|---|---|
| `work_context_ref` | `ExternalSourceObjectRef` | `ExternalFactRef.source_object_ref` | 来源事件 | quarantine |
| `source_version_ref` | `ExternalSourceVersionRef` | `ExternalFactRef.source_version_ref` | 来源事件 | quarantine |
| `source_digest` | `ExternalSourceDigest` | `ExternalFactRef.source_digest` | 来源事件 | quarantine |
| `affected_space_refs` | `Vec<ConversationSpaceId>` | `ExternalReferenceProjection.space_id` | 来源事件或查表 | delayed marker |

| 输入契约 | 目标 Domain 对象 | 必填字段是否齐全 | 派生字段来源 | 不得混同的字段 | 缺失时行为 |
|---|---|---|---|---|---|
| `WorkContextChangedEvent` | `ExternalFactRef`、`ExternalReferenceProjection`、`ReferenceResolutionState` | 是 | `source_system = work` from consumer config | work ref != conversation fact payload | quarantine / stale marker |

#### 7.5.2 `ConsumeGovernanceFactCommitted`

| 项 | 内容 |
|---|---|
| 函数签名 | `consume_governance_fact_committed(InboundEventEnvelope<GovernanceFactCommittedEvent> event) -> Result<ConsumerReceipt, ConsumerError>` |
| HTTP / RPC / Event 名称 | `topic: governance.fact.committed` |
| 调用方 | L1-governance / L0-bus |
| 处理方 | `ConversationInboundConsumer` -> `ManifestationIngestionService` |

```json
{
  "governance_fact_ref": "ExternalSourceObjectRef",
  "source_version_ref": "ExternalSourceVersionRef",
  "source_digest": "ExternalSourceDigest",
  "target_space_id": "ConversationSpaceId",
  "manifestation_policy_ref": "ManifestationPolicyRef"
}
```

| 输入字段 | 类型 | 目标对象字段 | 字段来源 | 缺失处理 |
|---|---|---|---|---|
| `governance_fact_ref` | `ExternalSourceObjectRef` | `ExternalFactRef.source_object_ref` | 来源事件 | quarantine |
| `target_space_id` | `ConversationSpaceId` | `CrossDomainManifestation.space_id` | 来源事件或 routing rule | delayed marker |
| `source_version_ref` | `ExternalSourceVersionRef` | `CrossDomainManifestation.source_version_ref` | 来源事件 | quarantine |
| `source_digest` | `ExternalSourceDigest` | `ExternalFactRef.source_digest` | 来源事件 | quarantine |

| 输入契约 | 目标 Domain 对象 | 必填字段是否齐全 | 派生字段来源 | 不得混同的字段 | 缺失时行为 |
|---|---|---|---|---|---|
| `GovernanceFactCommittedEvent` | `ExternalFactRef`、`ExternalFactSnapshot`、`CrossDomainManifestation` | 是 | snapshot from `ExternalFactResolverPort` | governance fact != governance decision body | quarantine / unresolved manifestation |

#### 7.5.3 `ConsumeArtifactFactCommitted`

| 项 | 内容 |
|---|---|
| 函数签名 | `consume_artifact_fact_committed(InboundEventEnvelope<ArtifactFactCommittedEvent> event) -> Result<ConsumerReceipt, ConsumerError>` |
| HTTP / RPC / Event 名称 | `topic: artifact.fact.committed` |
| 调用方 | L1-artifact / L0-bus |
| 处理方 | `ConversationInboundConsumer` -> `ExternalReferenceIngestionService` |

```json
{
  "artifact_fact_ref": "ExternalSourceObjectRef",
  "artifact_version_ref": "ExternalSourceVersionRef",
  "artifact_digest": "ExternalSourceDigest",
  "affected_space_refs": ["ConversationSpaceId"]
}
```

| 输入字段 | 类型 | 目标对象字段 | 字段来源 | 缺失处理 |
|---|---|---|---|---|
| `artifact_fact_ref` | `ExternalSourceObjectRef` | `ExternalFactRef.source_object_ref` | 来源事件 | quarantine |
| `artifact_version_ref` | `ExternalSourceVersionRef` | `ExternalFactRef.source_version_ref` | 来源事件 | quarantine |
| `artifact_digest` | `ExternalSourceDigest` | `ExternalFactRef.source_digest` | 来源事件 | quarantine |
| `affected_space_refs` | `Vec<ConversationSpaceId>` | `ExternalReferenceProjection.space_id` | 来源事件或 lookup | delayed marker |

| 输入契约 | 目标 Domain 对象 | 必填字段是否齐全 | 派生字段来源 | 不得混同的字段 | 缺失时行为 |
|---|---|---|---|---|---|
| `ArtifactFactCommittedEvent` | `ExternalFactRef`、`ExternalReferenceProjection`、`ReferenceResolutionState` | 是 | `source_system = artifact` from consumer config | artifact body != safe snapshot ref | quarantine / unresolved marker |

#### 7.5.4 `ConsumeRuntimeResultCommitted`

| 项 | 内容 |
|---|---|
| 函数签名 | `consume_runtime_result_committed(InboundEventEnvelope<RuntimeResultCommittedEvent> event) -> Result<ConsumerReceipt, ConsumerError>` |
| HTTP / RPC / Event 名称 | `topic: runtime.result.committed` |
| 调用方 | L2-runtime |
| 处理方 | `ConversationInboundConsumer` -> `ConversationFactAppendService` |

```json
{
  "space_id": "ConversationSpaceId",
  "fact_kind": "ConversationFactKind",
  "runtime_result_ref": "RuntimeResultRef",
  "result_payload_ref": "ConversationFactPayloadRef",
  "payload_digest": "Option<PayloadDigest>",
  "source_version_ref": "ExternalSourceVersionRef",
  "system_actor_ref": "SystemActorRef"
}
```

| 输入字段 | 类型 | 目标对象字段 | 字段来源 | 缺失处理 |
|---|---|---|---|---|
| `space_id` | `ConversationSpaceId` | `ConversationFact.space_id` | 来源事件 | quarantine |
| `fact_kind` | `ConversationFactKind` | `ConversationFact.fact_kind` | 来源事件;must be `RuntimeResult` | reject if not `RuntimeResult` |
| `runtime_result_ref` | `RuntimeResultRef` | `FactSourceRef.runtime_result_ref` | 来源事件 | quarantine |
| `result_payload_ref` | `ConversationFactPayloadRef` | `ConversationFact.payload_ref` | 来源事件 | reject if forbidden body |
| `payload_digest` | `Option<PayloadDigest>` | append digest evidence / idempotency digest input | 来源事件 | required / optional / forbidden follows `result_payload_ref.digest_requirement`;missing required or mismatch -> quarantine |
| `system_actor_ref` | `SystemActorRef` | system actor for policy | 来源事件或 config | delayed marker |

| 输入契约 | 目标 Domain 对象 | 必填字段是否齐全 | 派生字段来源 | 不得混同的字段 | 缺失时行为 |
|---|---|---|---|---|---|
| `RuntimeResultCommittedEvent` | `FactSourceRef`、`ConversationFact`、`FactAppendReceipt`、`ConversationTraceContext` | 是 | `fact_kind` from event and must equal `RuntimeResult`;`FactSourceRef::from_runtime_result(RuntimeResultRef result_ref, ActorRef actor)`; participant / visibility from repository;`payload_digest` follows `result_payload_ref.digest_requirement` | runtime result ref != reasoning process; result payload ref != payload body;payload digest != payload body | quarantine / reject |

Runtime result append path uses `system_actor_ref` as a trusted source actor. The actor must satisfy `SystemActorRef` / `ActorKind::System`, but it does not need to be present in `ParticipantScope.participants`. `FactAppendPolicy.assert_append_allowed(...)` must still require active space, appendable participant scope, open visibility scope, allowed fact kind, allowed source, payload digest validation, and forbidden-body rejection.

#### 7.5.5 `ConsumeBridgeMappedFactReceived`

| 项 | 内容 |
|---|---|
| 函数签名 | `consume_bridge_mapped_fact_received(InboundEventEnvelope<BridgeMappedFactReceivedEvent> event) -> Result<ConsumerReceipt, ConsumerError>` |
| HTTP / RPC / Event 名称 | `topic: bridge.mapped_fact.received` |
| 调用方 | L6-bridges |
| 处理方 | `ConversationInboundConsumer` -> `ConversationFactAppendService` 或 `ManifestationIngestionService` |

```json
{
  "space_id": "ConversationSpaceId",
  "target_mode": "BridgeTargetMode",
  "fact_kind": "ConversationFactKind",
  "bridge_fact_ref": "ExternalSourceObjectRef",
  "mapped_payload_ref": "ConversationFactPayloadRef",
  "payload_digest": "Option<PayloadDigest>",
  "source_version_ref": "ExternalSourceVersionRef",
  "source_digest": "ExternalSourceDigest",
  "actor_ref": "ActorRef"
}
```

| 输入字段 | 类型 | 目标对象字段 | 字段来源 | 缺失处理 |
|---|---|---|---|---|
| `space_id` | `ConversationSpaceId` | `ConversationFact.space_id` 或 `CrossDomainManifestation.space_id` | 来源事件 / routing rule | quarantine |
| `target_mode` | `BridgeTargetMode` | flow branch | bridge mapping metadata | quarantine |
| `fact_kind` | `ConversationFactKind` | `ConversationFact.fact_kind` | bridge mapping metadata;must be `BridgeMapped` when target_mode is `AppendFact` | reject if target append and kind mismatch |
| `bridge_fact_ref` | `ExternalSourceObjectRef` | `BridgeSourceRef.bridge_fact_ref` then `FactSourceRef.bridge_source_ref` 或 `ExternalFactRef.source_object_ref` | 来源事件 | quarantine |
| `mapped_payload_ref` | `ConversationFactPayloadRef` | `ConversationFact.payload_ref` | bridge adapter | reject if forbidden body |
| `payload_digest` | `Option<PayloadDigest>` | append digest evidence / idempotency digest input | bridge adapter | required / optional / forbidden follows `mapped_payload_ref.digest_requirement`;missing required or mismatch -> quarantine |
| `source_version_ref` | `ExternalSourceVersionRef` | `ExternalFactRef.source_version_ref` | 来源事件 | quarantine |
| `source_digest` | `ExternalSourceDigest` | `ExternalFactRef.source_digest` | 来源事件 | quarantine |
| `actor_ref` | `ActorRef` | `FactSourceRef.actor_ref` / audit actor | bridge mapping metadata 或 source actor resolver | quarantine |

| 输入契约 | 目标 Domain 对象 | 必填字段是否齐全 | 派生字段来源 | 不得混同的字段 | 缺失时行为 |
|---|---|---|---|---|---|
| `BridgeMappedFactReceivedEvent` | `FactSourceRef`、`ConversationFact` 或 `ExternalFactRef`、`CrossDomainManifestation` | 是 | `target_mode` and `fact_kind` from bridge mapping metadata;append target must use `BridgeMapped`;`actor_ref` from bridge mapping metadata or source actor resolver;append path `payload_digest` follows `mapped_payload_ref.digest_requirement` | bridge payload ref != external platform body;target mode != fact kind;payload digest != bridge platform body | quarantine / reject |

Bridge append path uses `actor_ref` as a trusted integration source actor. The actor must satisfy `ActorKind::Integration`, but it does not need to be present in `ParticipantScope.participants`. This exception applies only when `target_mode = AppendFact` and `fact_kind = BridgeMapped`; manifestation mode follows manifestation policy and must not create a conversation fact through the append policy.

#### 7.5.6 `ConsumeIdentityActorChanged`

| 项 | 内容 |
|---|---|
| 函数签名 | `consume_identity_actor_changed(InboundEventEnvelope<IdentityActorChangedEvent> event) -> Result<ConsumerReceipt, ConsumerError>` |
| HTTP / RPC / Event 名称 | `topic: identity.actor.changed` |
| 调用方 | L1-identity |
| 处理方 | `ConversationInboundConsumer` -> `ConversationDerivedMaintenanceService` |

```json
{
  "actor_ref": "ActorRef",
  "actor_version_ref": "ExternalSourceVersionRef",
  "affected_space_refs": ["ConversationSpaceId"],
  "visibility_impact": "VisibilityImpact"
}
```

| 输入字段 | 类型 | 目标对象字段 | 字段来源 | 缺失处理 |
|---|---|---|---|---|
| `actor_ref` | `ActorRef` | participant / consumer relation lookup key | 来源事件 | quarantine |
| `actor_version_ref` | `ExternalSourceVersionRef` | actor snapshot freshness marker | 来源事件 | stale marker |
| `affected_space_refs` | `Vec<ConversationSpaceId>` | `ConversationProjectionState.space_id` via projection key | 来源事件或 lookup | delayed marker |
| `visibility_impact` | `VisibilityImpact` | projection stale reason | 来源事件 | conservative stale marker |

| 输入契约 | 目标 Domain 对象 | 必填字段是否齐全 | 派生字段来源 | 不得混同的字段 | 缺失时行为 |
|---|---|---|---|---|---|
| `IdentityActorChangedEvent` | `ConversationProjectionState`、`ConversationReadModel` stale marker、`ExternalReferenceProjection` stale marker | 是 | actor snapshot from `ActorResolverPort` | actor changed != participant scope command | quarantine / stale marker |

### 7.6 Outbound Event 协议契约

#### 7.6.1 `ConversationSpaceChangedEvent`

| 项 | 内容 |
|---|---|
| 函数签名 | `publish_conversation_space_changed(ConversationOutboxRecord outbox) -> Result<PublishedEventRef, PublishError>` |
| HTTP / RPC / Event 名称 | `topic: conversation.space.changed` |
| 调用方 | conversation outbox publisher |
| 处理方 | Chat / Workspace / Runtime / reports |

```json
{
  "event_id": "EventId",
  "event_version": "v1",
  "space_id": "ConversationSpaceId",
  "space_kind": "ConversationSpaceKind",
  "lifecycle_state": "ConversationSpaceLifecycleState",
  "owner_ref": "ConversationOwnerRef",
  "scope_change_ref": "ScopeChangeRecordRef",
  "committed_at": "Timestamp"
}
```

| 输入契约 | 来源 Domain 对象 | 必填字段是否齐全 | 派生字段来源 | 不得混同的字段 | 缺失时行为 |
|---|---|---|---|---|---|
| `ConversationSpaceChangedEvent` | `ConversationSpace`、`ScopeChangeRecord`、`ConversationOutboxRecord` | 是 | event id from outbox / id generator | owner_ref != participant ref | 不生成 event |

版本策略:v1 只表达 space 生命周期、类型和 owner 引用;新增字段必须向后兼容,不得删除 `space_id`、`lifecycle_state` 和 `scope_change_ref`。

#### 7.6.2 `ConversationScopeChangedEvent`

| 项 | 内容 |
|---|---|
| 函数签名 | `publish_conversation_scope_changed(ConversationOutboxRecord outbox) -> Result<PublishedEventRef, PublishError>` |
| HTTP / RPC / Event 名称 | `topic: conversation.scope.changed` |
| 调用方 | conversation outbox publisher |
| 处理方 | Chat / Workspace / Runtime / projection maintenance |

```json
{
  "event_id": "EventId",
  "event_version": "v1",
  "space_id": "ConversationSpaceId",
  "scope_change_ref": "ScopeChangeRecordRef",
  "participant_scope_state": "ParticipantScopeState",
  "visibility_scope_state": "VisibilityScopeState",
  "visibility_marker": "VisibilityMarker",
  "committed_at": "Timestamp"
}
```

| 输入契约 | 来源 Domain 对象 | 必填字段是否齐全 | 派生字段来源 | 不得混同的字段 | 缺失时行为 |
|---|---|---|---|---|---|
| `ConversationScopeChangedEvent` | `ParticipantScope`、`VisibilityScope`、`ScopeChangeRecord`、`ConversationOutboxRecord` | 是 | visibility marker from policy | participant scope != identity membership truth | 不生成 event |

版本策略:v1 下游必须把该事件视为 read model stale 信号,不得从 payload 还原完整参与人列表。

#### 7.6.3 `ConversationFactAppendedEvent`

| 项 | 内容 |
|---|---|
| 函数签名 | `publish_conversation_fact_appended(ConversationOutboxRecord outbox) -> Result<PublishedEventRef, PublishError>` |
| HTTP / RPC / Event 名称 | `topic: conversation.fact.appended` |
| 调用方 | conversation outbox publisher |
| 处理方 | Chat / Workspace / Runtime / Bridges / projection maintenance |

```json
{
  "event_id": "EventId",
  "event_version": "v1",
  "space_id": "ConversationSpaceId",
  "fact_id": "ConversationFactId",
  "fact_kind": "ConversationFactKind",
  "fact_state": "ConversationFactState",
  "payload_ref": "ConversationFactPayloadRef",
  "append_sequence": "ConversationFactSequence",
  "visibility_marker": "VisibilityMarker",
  "committed_at": "Timestamp"
}
```

| 输入契约 | 来源 Domain 对象 | 必填字段是否齐全 | 派生字段来源 | 不得混同的字段 | 缺失时行为 |
|---|---|---|---|---|---|
| `ConversationFactAppendedEvent` | `ConversationFact`、`FactAppendReceipt`、`ConversationOutboxRecord` | 是 | visibility marker from scope / policy | payload_ref != payload body | 不生成 event |

版本策略:v1 只传播 fact ref、payload ref、sequence 和可见性 marker,不得携带 runtime reasoning 或 bridge 原文。

#### 7.6.4 `ConversationFactRetractedEvent`

| 项 | 内容 |
|---|---|
| 函数签名 | `publish_conversation_fact_retracted(ConversationOutboxRecord outbox) -> Result<PublishedEventRef, PublishError>` |
| HTTP / RPC / Event 名称 | `topic: conversation.fact.retracted` |
| 调用方 | conversation outbox publisher |
| 处理方 | Chat / Workspace / Runtime / projection maintenance |

```json
{
  "event_id": "EventId",
  "event_version": "v1",
  "space_id": "ConversationSpaceId",
  "fact_id": "ConversationFactId",
  "fact_state": "ConversationFactState",
  "retraction_reason_ref": "RetractionReasonRef",
  "trace_context_id": "ConversationTraceContextId",
  "committed_at": "Timestamp"
}
```

| 输入契约 | 来源 Domain 对象 | 必填字段是否齐全 | 派生字段来源 | 不得混同的字段 | 缺失时行为 |
|---|---|---|---|---|---|
| `ConversationFactRetractedEvent` | `ConversationFact`、`ConversationTraceContext`、`ConversationOutboxRecord` | 是 | trace context from fact trace repository | retraction reason != deleted payload | 不生成 event |

| 字段 | 类型 | 字段来源 | schema 定义 | 缺失时行为 |
|---|---|---|---|---|
| `retraction_reason_ref` | `RetractionReasonRef` | `RetractionReasonRef::from_fact_retraction_reason(&fact.retraction_reason)` | Step 6 §7.2.4,归属 `conversation-contracts/src/refs.rs` | 不生成 event |

`retraction_reason_ref` 只暴露 `reason_kind` 和 safe `CommandReasonRef`。它不得携带被撤回 payload、原始 reason body、request id、trace 或 idempotency。

版本策略:v1 下游必须停止把目标 fact 当作 fresh readable fact,但不得删除审计引用。

#### 7.6.5 `CrossDomainManifestationChangedEvent`

| 项 | 内容 |
|---|---|
| 函数签名 | `publish_cross_domain_manifestation_changed(ConversationOutboxRecord outbox) -> Result<PublishedEventRef, PublishError>` |
| HTTP / RPC / Event 名称 | `topic: conversation.manifestation.changed` |
| 调用方 | conversation outbox publisher |
| 处理方 | Chat / Workspace / Runtime / reports |

```json
{
  "event_id": "EventId",
  "event_version": "v1",
  "space_id": "ConversationSpaceId",
  "manifestation_id": "CrossDomainManifestationId",
  "external_fact_ref": "ExternalFactRef",
  "snapshot_ref": "ExternalFactSnapshotRef",
  "manifestation_state": "ManifestationState",
  "source_version_ref": "ExternalSourceVersionRef",
  "committed_at": "Timestamp"
}
```

| 输入契约 | 来源 Domain 对象 | 必填字段是否齐全 | 派生字段来源 | 不得混同的字段 | 缺失时行为 |
|---|---|---|---|---|---|
| `CrossDomainManifestationChangedEvent` | `CrossDomainManifestation`、`ExternalFactSnapshot`、`ConversationOutboxRecord` | 是 | snapshot ref optional if unresolved | external_fact_ref != source payload | 不生成 event |

版本策略:v1 可表达 manifested、stale、revoked 和 unresolved,但只携带外部引用和安全快照引用。

#### 7.6.6 `ConversationChangeAvailableEvent`

| 项 | 内容 |
|---|---|
| 函数签名 | `publish_conversation_change_available(ConversationOutboxRecord outbox) -> Result<PublishedEventRef, PublishError>` |
| HTTP / RPC / Event 名称 | `topic: conversation.change.available` |
| 调用方 | conversation outbox publisher |
| 处理方 | SDK / Chat / Workspace / Runtime |

```json
{
  "event_id": "EventId",
  "event_version": "v1",
  "space_id": "ConversationSpaceId",
  "outbox_record_id": "ConversationOutboxRecordId",
  "outbox_sequence": "ConversationOutboxSequence",
  "change_kind": "ConversationOutboxEventKind",
  "visibility_marker": "VisibilityMarker",
  "committed_at": "Timestamp"
}
```

| 输入契约 | 来源 Domain 对象 | 必填字段是否齐全 | 派生字段来源 | 不得混同的字段 | 缺失时行为 |
|---|---|---|---|---|---|
| `ConversationChangeAvailableEvent` | `ConversationOutboxRecord`、`ChangeCursorProjection` | 是 | sequence from outbox repository | change event != full fact event | 不生成 event |

版本策略:v1 是轻量通知事件;消费者必须通过 Query API 按 cursor / visibility 拉取实际视图。

#### 7.6.7 `TraceHandoffRequestedEvent`

| 项 | 内容 |
|---|---|
| 函数签名 | `publish_trace_handoff_requested(ConversationOutboxRecord outbox) -> Result<PublishedEventRef, PublishError>` |
| HTTP / RPC / Event 名称 | `topic: conversation.trace_handoff.requested` |
| 调用方 | conversation outbox publisher |
| 处理方 | Observability / reports |

```json
{
  "event_id": "EventId",
  "event_version": "v1",
  "trace_handoff_id": "TraceHandoffRecordId",
  "trace_context_id": "ConversationTraceContextId",
  "handoff_payload_ref": "TraceHandoffPayloadRef",
  "handoff_state": "TraceHandoffState",
  "destination_ref": "ObservabilityDestinationRef",
  "requested_at": "Timestamp"
}
```

| 输入契约 | 来源 Domain 对象 | 必填字段是否齐全 | 派生字段来源 | 不得混同的字段 | 缺失时行为 |
|---|---|---|---|---|---|
| `TraceHandoffRequestedEvent` | `TraceHandoffRecord`、`ConversationTraceContext`、`ConversationOutboxRecord` | 是 | payload ref from trace handoff builder | trace handoff != observability receipt | 不生成 event |

版本策略:v1 只表达交接请求,实际交付结果由 `DeliverTraceHandoff` job 推进 handoff state。

#### 7.6.8 `ArchiveHandoffRequestedEvent`

| 项 | 内容 |
|---|---|
| 函数签名 | `publish_archive_handoff_requested(ConversationOutboxRecord outbox) -> Result<PublishedEventRef, PublishError>` |
| HTTP / RPC / Event 名称 | `topic: conversation.archive_handoff.requested` |
| 调用方 | conversation outbox publisher |
| 处理方 | Archive / reports |

```json
{
  "event_id": "EventId",
  "event_version": "v1",
  "archive_handoff_id": "ArchiveHandoffRecordId",
  "space_id": "ConversationSpaceId",
  "archive_scope": "ArchiveScope",
  "archive_package_ref": "Option<ArchivePackageRef>",
  "handoff_state": "ArchiveHandoffState",
  "requested_at": "Timestamp"
}
```

| 输入契约 | 来源 Domain 对象 | 必填字段是否齐全 | 派生字段来源 | 不得混同的字段 | 缺失时行为 |
|---|---|---|---|---|---|
| `ArchiveHandoffRequestedEvent` | `ArchiveHandoffRecord`、`ConversationTraceContext`、`ConversationOutboxRecord` | 是 | archive package ref may be null before delivery | archive package ref != archive package body | 不生成 event |

版本策略:v1 允许 `archive_package_ref` 在 pending 阶段为空;完成交付由 job 更新 record 并重新传播状态。

#### 7.6.9 `ConversationProjectionStateChangedEvent`

| 项 | 内容 |
|---|---|
| 函数签名 | `publish_conversation_projection_state_changed(ConversationProjectionState state) -> Result<PublishedEventRef, PublishError>` |
| HTTP / RPC / Event 名称 | `topic: conversation.projection_state.changed` |
| 调用方 | projection maintenance service / jobs |
| 处理方 | Operations / reports / read consumers |

```json
{
  "event_id": "EventId",
  "event_version": "v1",
  "projection_state_id": "ConversationProjectionStateId",
  "space_id": "ConversationSpaceId",
  "projection_kind": "ConversationProjectionKind",
  "freshness_state": "ProjectionFreshnessState",
  "source_position": "ConversationSourcePosition",
  "last_error_ref": "ProjectionErrorRef",
  "changed_at": "Timestamp"
}
```

| 输入契约 | 来源 Domain 对象 | 必填字段是否齐全 | 派生字段来源 | 不得混同的字段 | 缺失时行为 |
|---|---|---|---|---|---|
| `ConversationProjectionStateChangedEvent` | `ConversationProjectionState` | 是 | event id from id generator | projection state != truth lifecycle | 不生成 event |

版本策略:v1 只表达派生状态 freshness,不得让下游把 projection 当作第二 truth。

### 7.7 Operations Job 协议契约

#### 7.7.1 `PublishConversationOutbox`

| 项 | 内容 |
|---|---|
| 函数签名 | `run_publish_conversation_outbox(PublishConversationOutboxJob job) -> Result<JobRunReceipt, JobError>` |
| HTTP / RPC / Event 名称 | `job: publish-conversation-outbox` |
| 调用方 | scheduler / operator |
| 处理方 | `ConversationOutboxPublishJob` -> `ConversationOutboxPublisherPort` |

```json
{
  "job_run_id": "JobRunId",
  "job_metadata": "JobMetadata",
  "idempotency_key": "IdempotencyKey",
  "batch_size": "BatchSize",
  "max_retry_count": "RetryLimit",
  "trace_ref": "TraceContextRef"
}
```

| 输入契约 | 目标 Domain 对象 | 必填字段是否齐全 | 派生字段来源 | 不得混同的字段 | 缺失时行为 |
|---|---|---|---|---|---|
| `PublishConversationOutboxJob` | `ConversationOutboxRecord` publication state | 是 | pending page from outbox repository | publish success != truth commit | failed job receipt |

输出:`JobRunReceipt` 必须包含 published count、failed count、retry count 和 failed record refs。

| 字段 | 类型 | 必填 | 来源 / 校验 | 不得混同 |
|---|---|---:|---|---|
| `job_run_id` | `JobRunId` | 是 | job runner 生成或 scheduler 传入 | 不等于 outbox record id |
| `job_metadata` | `JobMetadata` | 是 | Job shared DTO,见 §6 | 不等于 command metadata |
| `idempotency_key` | `IdempotencyKey` | 是 | job run 幂等键 | 不等于 event id |
| `batch_size` | `BatchSize` | 是 | job 读取 pending outbox 的批量上限 | 不等于 `RetryLimit`、`PageLimit` |
| `max_retry_count` | `RetryLimit` | 是 | `RetryLimit::new(value)` 校验 `value > 0`;非法返回 `JobError::InvalidInput` | 不等于 `BatchSize`、rate limit、page limit |
| `trace_ref` | `TraceContextRef` | 是 | job log / receipt trace | 不等于 published event id |

`RetryLimit` 的字段级 schema、`RetryCount`、`RetryReason`、`OutboxFailureReason` 和 `PublishError` 映射见 Step 6 §7.2.4 与 Step 7 §7.5.3.0。`max_retry_count` 缺失或非法时,job 不得开始 publish,必须返回 failed job receipt 或 `JobError::InvalidInput`。

#### 7.7.2 `RebuildConversationReadModels`

| 项 | 内容 |
|---|---|
| 函数签名 | `run_rebuild_conversation_read_models(RebuildConversationReadModelsJob job) -> Result<JobRunReceipt, JobError>` |
| HTTP / RPC / Event 名称 | `job: rebuild-conversation-read-models` |
| 调用方 | scheduler / operator |
| 处理方 | `ConversationProjectionRebuildJob` -> `ConversationDerivedMaintenanceService` |

```json
{
  "job_run_id": "JobRunId",
  "job_metadata": "JobMetadata",
  "idempotency_key": "IdempotencyKey",
  "space_scope": "ConversationSpaceScope",
  "consumer_scope": "ConsumerScope",
  "source_position": "ConversationSourcePosition",
  "trace_ref": "TraceContextRef"
}
```

| 输入契约 | 目标 Domain 对象 | 必填字段是否齐全 | 派生字段来源 | 不得混同的字段 | 缺失时行为 |
|---|---|---|---|---|---|
| `RebuildConversationReadModelsJob` | `ConversationReadModel`、`ConversationProjectionState` | 是 | visible refs from fact / manifestation repositories | read model != conversation truth | failed / stale projection marker |

输出:`JobRunReceipt` 必须包含 rebuilt space count、consumer count、freshness state 和 projection error refs。

#### 7.7.3 `RebuildConversationSearchIndex`

| 项 | 内容 |
|---|---|
| 函数签名 | `run_rebuild_conversation_search_index(RebuildConversationSearchIndexJob job) -> Result<JobRunReceipt, JobError>` |
| HTTP / RPC / Event 名称 | `job: rebuild-conversation-search-index` |
| 调用方 | scheduler / operator |
| 处理方 | `ConversationSearchRebuildJob` -> `ConversationDerivedMaintenanceService` |

```json
{
  "job_run_id": "JobRunId",
  "job_metadata": "JobMetadata",
  "idempotency_key": "IdempotencyKey",
  "space_scope": "ConversationSpaceScope",
  "source_position": "ConversationSourcePosition",
  "index_profile_ref": "SearchIndexProfileRef",
  "trace_ref": "TraceContextRef"
}
```

| 输入契约 | 目标 Domain 对象 | 必填字段是否齐全 | 派生字段来源 | 不得混同的字段 | 缺失时行为 |
|---|---|---|---|---|---|
| `RebuildConversationSearchIndexJob` | `SearchIndexProjection`、`ConversationProjectionState` | 是 | refs from read model / fact repository | search index != payload store | failed projection marker |

输出:`JobRunReceipt` 必须包含 indexed fact refs count、indexed manifestation refs count 和 failure refs。

#### 7.7.4 `MaintainConversationChangeCursors`

| 项 | 内容 |
|---|---|
| 函数签名 | `run_maintain_conversation_change_cursors(MaintainConversationChangeCursorsJob job) -> Result<JobRunReceipt, JobError>` |
| HTTP / RPC / Event 名称 | `job: maintain-conversation-change-cursors` |
| 调用方 | scheduler / operator |
| 处理方 | `ConversationCursorMaintenanceJob` -> `ConversationDerivedMaintenanceService` |

```json
{
  "job_run_id": "JobRunId",
  "job_metadata": "JobMetadata",
  "idempotency_key": "IdempotencyKey",
  "space_scope": "ConversationSpaceScope",
  "cursor_scope": "ConsumerScope",
  "outbox_position": "ConversationOutboxSequence",
  "trace_ref": "TraceContextRef"
}
```

| 输入契约 | 目标 Domain 对象 | 必填字段是否齐全 | 派生字段来源 | 不得混同的字段 | 缺失时行为 |
|---|---|---|---|---|---|
| `MaintainConversationChangeCursorsJob` | `ChangeCursorProjection`、`ConversationChangeCursor`、`ConversationProjectionState` | 是 | outbox sequence from outbox repository | cursor position != fact truth | failed / stale cursor marker |

输出:`JobRunReceipt` 必须包含 advanced cursor count、stale cursor count 和 invalid cursor refs。

#### 7.7.5 `RefreshExternalReferenceSnapshots`

| 项 | 内容 |
|---|---|
| 函数签名 | `run_refresh_external_reference_snapshots(RefreshExternalReferenceSnapshotsJob job) -> Result<JobRunReceipt, JobError>` |
| HTTP / RPC / Event 名称 | `job: refresh-external-reference-snapshots` |
| 调用方 | scheduler / operator |
| 处理方 | `ConversationSnapshotRefreshJob` -> `ExternalFactResolverPort` |

```json
{
  "job_run_id": "JobRunId",
  "job_metadata": "JobMetadata",
  "idempotency_key": "IdempotencyKey",
  "space_scope": "ConversationSpaceScope",
  "source_system_filter": "ExternalSourceSystem",
  "max_snapshot_age": "RetentionDuration",
  "trace_ref": "TraceContextRef"
}
```

| 输入契约 | 目标 Domain 对象 | 必填字段是否齐全 | 派生字段来源 | 不得混同的字段 | 缺失时行为 |
|---|---|---|---|---|---|
| `RefreshExternalReferenceSnapshotsJob` | `ExternalFactSnapshot`、`ReferenceResolutionState`、`ExternalReferenceProjection` | 是 | refs from external reference repository | snapshot ref != source body | unresolved marker / failed job receipt |

输出:`JobRunReceipt` 必须包含 refreshed snapshot count、unresolved refs 和 digest mismatch refs。

`max_snapshot_age` 使用 Step 6 §7.2.3 定义的 conversation-local `RetentionDuration { seconds: u64 }`;当前 core baseline 不提供 `Duration`,实现侧不得新增伪 core duration 或第二套通用 duration。

#### 7.7.6 `DeliverTraceHandoff`

| 项 | 内容 |
|---|---|
| 函数签名 | `run_deliver_trace_handoff(DeliverTraceHandoffJob job) -> Result<JobRunReceipt, JobError>` |
| HTTP / RPC / Event 名称 | `job: deliver-trace-handoff` |
| 调用方 | scheduler / operator |
| 处理方 | `TraceHandoffDeliveryJob` -> `TraceHandoffPort` |

```json
{
  "job_run_id": "JobRunId",
  "job_metadata": "JobMetadata",
  "idempotency_key": "IdempotencyKey",
  "trace_handoff_scope": "TraceHandoffScope",
  "destination_ref": "ObservabilityDestinationRef",
  "batch_size": "BatchSize",
  "trace_ref": "TraceContextRef"
}
```

| 输入契约 | 目标 Domain 对象 | 必填字段是否齐全 | 派生字段来源 | 不得混同的字段 | 缺失时行为 |
|---|---|---|---|---|---|
| `DeliverTraceHandoffJob` | `TraceHandoffRecord` handoff state | 是 | pending handoff page from trace repository | trace delivery receipt != trace truth | retry / failed handoff marker |

输出:`JobRunReceipt` 必须包含 delivered handoff refs、retry refs、failed refs 和 external receipt refs。

字段闭环:

| 字段 | 类型 | 来源 / 规则 | 缺失时行为 |
|---|---|---|---|
| `job_run_id` | `JobRunId` | scheduler / operator 生成 | `JobError::InvalidInput` |
| `job_metadata` | `JobMetadata` | `job_kind = DeliverTraceHandoff` | `JobError::InvalidInput` |
| `idempotency_key` | `IdempotencyKey` | job 调用方生成 | `JobError::InvalidInput` |
| `trace_handoff_scope` | `TraceHandoffScope` | 调用方 scope;空 scope 表示所有 eligible pending trace handoff | `JobError::InvalidInput` |
| `destination_ref` | `ObservabilityDestinationRef` | adapter 目标 guard;必须匹配待交接记录的 `destination_ref` | mismatch 跳过并记 failed diagnostic |
| `batch_size` | `BatchSize` | 转换为 repository `PageRequest.limit` | `JobError::InvalidInput` |
| `trace_ref` | `TraceContextRef` | job run audit trace | `JobError::InvalidInput` |

#### 7.7.7 `DeliverArchiveHandoff`

| 项 | 内容 |
|---|---|
| 函数签名 | `run_deliver_archive_handoff(DeliverArchiveHandoffJob job) -> Result<JobRunReceipt, JobError>` |
| HTTP / RPC / Event 名称 | `job: deliver-archive-handoff` |
| 调用方 | scheduler / operator |
| 处理方 | `ArchiveHandoffDeliveryJob` -> `ArchiveHandoffPort` |

```json
{
  "job_run_id": "JobRunId",
  "job_metadata": "JobMetadata",
  "idempotency_key": "IdempotencyKey",
  "archive_handoff_scope": "ArchiveHandoffScope",
  "archive_destination_ref": "ArchiveDestinationRef",
  "batch_size": "BatchSize",
  "trace_ref": "TraceContextRef"
}
```

| 输入契约 | 目标 Domain 对象 | 必填字段是否齐全 | 派生字段来源 | 不得混同的字段 | 缺失时行为 |
|---|---|---|---|---|---|
| `DeliverArchiveHandoffJob` | `ArchiveHandoffRecord` handoff state | 是 | pending handoff page from trace repository | archive package ref != archive package body | retry / failed handoff marker |

输出:`JobRunReceipt` 必须包含 archived refs、retry refs、failed refs 和 archive package refs。

字段闭环:

| 字段 | 类型 | 来源 / 规则 | 缺失时行为 |
|---|---|---|---|
| `job_run_id` | `JobRunId` | scheduler / operator 生成 | `JobError::InvalidInput` |
| `job_metadata` | `JobMetadata` | `job_kind = DeliverArchiveHandoff` | `JobError::InvalidInput` |
| `idempotency_key` | `IdempotencyKey` | job 调用方生成 | `JobError::InvalidInput` |
| `archive_handoff_scope` | `ArchiveHandoffScope` | 调用方 scope;空 scope 表示所有 eligible pending archive handoff | `JobError::InvalidInput` |
| `archive_destination_ref` | `ArchiveDestinationRef` | archive adapter 目标;传入 `ArchiveHandoffPort.deliver_archive_handoff(...)` | `JobError::InvalidInput` |
| `batch_size` | `BatchSize` | 转换为 repository `PageRequest.limit` | `JobError::InvalidInput` |
| `trace_ref` | `TraceContextRef` | job run audit trace | `JobError::InvalidInput` |

#### 7.7.8 `ValidateConversationConsistency`

| 项 | 内容 |
|---|---|
| 函数签名 | `run_validate_conversation_consistency(ValidateConversationConsistencyJob job) -> Result<JobRunReceipt, JobError>` |
| HTTP / RPC / Event 名称 | `job: validate-conversation-consistency` |
| 调用方 | scheduler / operator |
| 处理方 | `ConversationConsistencyValidationJob` -> `ConversationDerivedMaintenanceService` |

```json
{
  "job_run_id": "JobRunId",
  "job_metadata": "JobMetadata",
  "idempotency_key": "IdempotencyKey",
  "space_scope": "ConversationSpaceScope",
  "validation_profile_ref": "ConsistencyValidationProfileRef",
  "report_output_ref": "ReportOutputRef",
  "trace_ref": "TraceContextRef"
}
```

| 输入契约 | 目标 Domain 对象 | 必填字段是否齐全 | 派生字段来源 | 不得混同的字段 | 缺失时行为 |
|---|---|---|---|---|---|
| `ValidateConversationConsistencyJob` | `ConversationProjectionState` diagnostic marker、`ExternalReferenceProjection` diagnostic marker | 是 | report output from job config | consistency report != automatic repair | failed job receipt |

输出:`JobRunReceipt` 必须包含 report ref、checked scope、issue count 和 suggested repair refs。

#### 7.7.9 `CleanupExpiredConversationCursors`

| 项 | 内容 |
|---|---|
| 函数签名 | `run_cleanup_expired_conversation_cursors(CleanupExpiredConversationCursorsJob job) -> Result<JobRunReceipt, JobError>` |
| HTTP / RPC / Event 名称 | `job: cleanup-expired-conversation-cursors` |
| 调用方 | scheduler / operator |
| 处理方 | `ConversationCursorCleanupJob` -> `ConversationDerivedMaintenanceService` |

```json
{
  "job_run_id": "JobRunId",
  "job_metadata": "JobMetadata",
  "idempotency_key": "IdempotencyKey",
  "cursor_scope": "ConsumerScope",
  "retention_policy_ref": "TraceRetentionPolicyRef",
  "expired_before": "Timestamp",
  "trace_ref": "TraceContextRef"
}
```

| 输入契约 | 目标 Domain 对象 | 必填字段是否齐全 | 派生字段来源 | 不得混同的字段 | 缺失时行为 |
|---|---|---|---|---|---|
| `CleanupExpiredConversationCursorsJob` | `ConversationChangeCursor`、`ChangeCursorProjection` cleanup marker | 是 | retention window from policy / config | cursor cleanup != fact deletion | failed job receipt |

输出:`JobRunReceipt` 必须包含 cleaned cursor count、skipped cursor refs 和 cleanup evidence ref。

### 7.8 DTO / Event / Job 到 Domain 构造闭环汇总表

| 协议组 | 输入契约 | 目标 Domain 对象 | 必填字段闭环 | 派生 / 查表来源 | 失败处理 |
|---|---|---|---|---|---|
| Space command | `CreateConversationSpaceCommand` | `ConversationSpace`、`ParticipantScope`、`VisibilityScope`、`ConversationTruthState`、`ScopeChangeRecord` | 闭合 | actor from envelope; IDs from generator | reject |
| Space lifecycle command | `CloseConversationSpaceCommand` | `ConversationSpace`、`ConversationTruthState`、`ScopeChangeRecord` | 闭合 | current space from repository | reject / conflict |
| Scope command | `UpdateParticipantScopeCommand` / `UpdateVisibilityScopeCommand` | `ParticipantScope`、`VisibilityScope`、`ScopeChangeRecord` | 闭合 | current scope from repository; actor from envelope | reject / conflict |
| Fact command | `AppendConversationFactCommand` | `ConversationFact`、`FactSourceRef`、`FactAppendReceipt`、`ConversationTraceContext`、`ConversationOutboxRecord` | 闭合 | space / participant / visibility from repositories | reject / duplicate |
| Retraction command | `RetractConversationFactCommand` | `ConversationFact` state、`ConversationTraceContext`、`ConversationOutboxRecord` | 闭合 | current fact from repository | reject / not found |
| Manifest command | `ManifestExternalFactCommand` | `ExternalFactRef`、`ExternalFactSnapshot`、`CrossDomainManifestation`、`ConversationFact` | 闭合 | safe snapshot from resolver; visibility from repository | unresolved / reject |
| Review command | `CreateReviewAnchorCommand` | `ReviewAnchor`、`ConversationTraceContext`、`ConversationOutboxRecord` | 闭合 for fact / manifestation target only | target fact / manifestation lookup;scope change / trace / handoff / projection target pair rejected before lookup | reject / not found |
| Trace handoff command | `RequestTraceHandoffCommand` | `TraceHandoffRecord`、`ConversationOutboxRecord` | 闭合 | trace context from repository | reject / not found |
| Archive handoff command | `RequestArchiveHandoffCommand` | `ArchiveHandoffRecord`、`ConversationOutboxRecord` | 闭合 | trace context / space / retention policy lookup | reject / not found |
| Query APIs | `*QueryRequest` | `ConversationReadModel`、`ConversationFact`、`CrossDomainManifestation`、`ConversationTraceContext`、`ConversationProjectionState` | 闭合 | repository / projection store | not visible / stale / not found |
| Inbound consumers | `InboundEventEnvelope<T>` | `ExternalFactRef`、`ExternalFactSnapshot`、`ConversationFact`、`CrossDomainManifestation`、`ProjectionState` | 闭合 | source config, resolver, routing rule | quarantine / delayed / unresolved |
| Outbound events | `ConversationOutboxRecord` / `ConversationProjectionState` | event payload | 闭合 | committed truth / outbox / projection state | do not publish |
| Operations jobs | `*Job` | projection / outbox / handoff / snapshot states | 闭合 | repository page, config, resolver, handoff port | failed job receipt |

### 7.9 错误映射汇总表

| 协议类别 | 主要错误 | 映射规则 | 对外响应 / 记录 |
|---|---|---|---|
| Command API | `ProtocolError::MissingRequiredField` | 缺少 schema 必填字段、actor、metadata 或 `metadata.request.idempotency_key` | 4xx / command audit |
| Command API | `ProtocolError::InvalidCommand` | command 字段齐全但 target pair、mode、operation 或当前 boundary 不支持 | 4xx / command audit |
| Command API | `ApplicationError::Conflict` | 幂等冲突、版本冲突、状态已变化 | 409 / idempotency conflict |
| Command API | `DomainError` | space、scope、visibility、manifestation、handoff 规则不满足 | 4xx / domain audit |
| Command API | `RepositoryError` | 写入 truth、outbox、trace 或 projection 失败 | 5xx / retryable marker |
| Query API | `ProtocolError::InvalidQuery` | page、cursor、consumer、consistency marker 非法 | 4xx / read audit |
| Query API | `ApplicationError::NotVisible` | 读取目标不在可见范围内 | 403 或 empty view marker |
| Query API | `RepositoryError` | projection / truth 读取失败 | 5xx / stale marker |
| Inbound Event Consumer | `ProtocolError::InvalidEnvelope` | event id、source ref、envelope ref、idempotency key 缺失 | quarantine |
| Inbound Event Consumer | `ResolverError` | 来源引用不可解析或 digest 不一致 | unresolved / delayed marker |
| Inbound Event Consumer | `DomainError` | 来源事件不能构造合法 fact / manifestation | quarantine |
| Outbound Event | `PublishError` | event bus / publisher 失败 | outbox retry / failed marker |
| Operations Job | `JobError::InvalidInput` | job run id、scope、metadata 或 idempotency key 缺失 | failed job receipt |
| Operations Job | `JobError::PartialFailure` | 部分 projection、snapshot、handoff 或 publish 失败 | job evidence + retry refs |

### 7.10 幂等与审计矩阵

| 协议 / Job / Event | 幂等键 | 幂等窗口 | 审计 / 证据 | 重复请求处理 |
|---|---|---|---|---|
| `CreateConversationSpace` | `CommandMetadata.request.idempotency_key` | command retention window | command audit + outbox ref | 返回已创建 space result |
| `CloseConversationSpace` | `CommandMetadata.request.idempotency_key` | command retention window | command audit + scope change ref | 返回已有 lifecycle result |
| `UpdateParticipantScope` | `CommandMetadata.request.idempotency_key` | command retention window | command audit + scope change ref | 返回已有 participant result |
| `UpdateVisibilityScope` | `CommandMetadata.request.idempotency_key` | command retention window | command audit + scope change ref | 返回已有 visibility result |
| `AppendConversationFact` | `CommandMetadata.request.idempotency_key` | command retention window | command audit + append receipt | 返回 duplicate receipt |
| `RetractConversationFact` | `CommandMetadata.request.idempotency_key` | command retention window | command audit + trace ref | 返回已有 retraction result |
| `ManifestExternalFact` | `CommandMetadata.request.idempotency_key` | command retention window | command audit + manifestation ref | 返回已有 manifestation result |
| `CreateReviewAnchor` | `CommandMetadata.request.idempotency_key` | command retention window | command audit + review anchor ref | 返回已有 anchor result |
| `RequestTraceHandoff` | `CommandMetadata.request.idempotency_key` | handoff retention window | command audit + handoff ref | 返回已有 handoff intent |
| `RequestArchiveHandoff` | `CommandMetadata.request.idempotency_key` | archive retention window | command audit + archive handoff ref | 返回已有 archive intent |
| Query APIs | request id optional | read audit policy | read audit if enabled | no write; may return cached read marker |
| Inbound consumers | event id + source ref + `IdempotencyKey` | consumer retention window | consumer audit + quarantine / accepted marker | skip already consumed event |
| Outbound events | outbox record id + event id | outbox retention window | publish evidence | do not publish duplicate |
| Operations jobs | job run id + `IdempotencyKey` | job retention window | job evidence / report ref | return existing job receipt |

## 8. 回填草稿

正式 `03-详细设计.md` 的 §7 直接引用本文件 §7.1~§7.10 摘录生成,不在本 Step 重复粘贴全文。

建议回填结构:

```text
## 7. API / Command / Query / Event / Job 协议契约

### 7.1 协议总表
引用 `design-calibration/03_ddd_step_08_protocol_contracts.md` §7.1。

### 7.2 通用协议信封
引用 `design-calibration/03_ddd_step_08_protocol_contracts.md` §7.2。

### 7.3 Command API 协议契约
引用 `design-calibration/03_ddd_step_08_protocol_contracts.md` §7.3。

### 7.4 Query API 协议契约
引用 `design-calibration/03_ddd_step_08_protocol_contracts.md` §7.4。

### 7.5 Inbound Event Consumer 协议契约
引用 `design-calibration/03_ddd_step_08_protocol_contracts.md` §7.5。

### 7.6 Outbound Event 协议契约
引用 `design-calibration/03_ddd_step_08_protocol_contracts.md` §7.6。

### 7.7 Operations Job 协议契约
引用 `design-calibration/03_ddd_step_08_protocol_contracts.md` §7.7。

### 7.8 DTO / Event / Job 到 Domain 构造闭环
引用 `design-calibration/03_ddd_step_08_protocol_contracts.md` §7.8。

### 7.9 错误映射、幂等与审计
引用 `design-calibration/03_ddd_step_08_protocol_contracts.md` §7.9~§7.10。
```

§6 全局 API 索引只摘录本文件 §7.1 中的名称、类别、协议定义位置和处理流位置;不得在 §6 新增协议定义。

## 9. 待确认事项

当前 Step 8 没有阻塞性待确认事项。以下点进入 Step 9 / Step 11 继续细化,但不影响协议契约进入下一步:

| 事项 | 推荐处理 | 原因 |
|---|---|---|
| 每个 Command 的具体事务边界 | Step 9 写处理流,Step 11 写事务表 | Step 8 只定义协议输入输出和构造闭环 |
| 每个 Query 的降级视图形态 | Step 9 写 read flow,Step 12 写错误恢复 | 避免在协议层提前绑定 read model rendering |
| projection rebuild 的内部批处理算法 | Step 9 / Step 11 细化 | Step 8 只锁 job contract |
| event bus 具体技术产品 | Step 14 配置与依赖绑定再定 | 当前只能写 topic 逻辑名和版本策略 |

## 10. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| 所有协议入口都有签名、route / topic / job 名称 | 已满足 | §7.3~§7.7 覆盖 45 个协议 |
| 每个 Command / Event / Job 能回指目标或来源 Domain 对象 | 已满足 | §7.8 汇总闭环 |
| 字段缺失处理已经明确 | 已满足 | 单协议闭环表和 §7.9 已说明 |
| 错误映射已经明确 | 已满足 | §7.9 |
| 幂等与审计要求已经明确 | 已满足 | §7.10 |
| 未把来源正文、runtime 推理过程、bridge 原文或 archive package body 写入协议 payload | 已满足 | Inbound / Outbound / Job 小节均有限制 |

结论:Step 8 可以进入 Step 9,继续逐接口定义函数级处理流。
