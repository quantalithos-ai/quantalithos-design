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
| Command API | 必须显式携带 `IdempotencyKey` | 写 command audit、domain audit 和 outbox |
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
  "metadata": "CommandMetadata",
  "idempotency_key": "IdempotencyKey",
  "trace_ref": "TraceContextRef"
}
```

#### Query envelope

```json
{
  "query": {},
  "consumer": "ConsumerContext",
  "metadata": "QueryMetadata",
  "page": "PageRequest",
  "consistency": "ReadConsistency"
}
```

#### Inbound event envelope

```json
{
  "event_id": "EventId",
  "event_envelope_ref": "EventEnvelopeRef",
  "event_source_ref": "EventSourceRef",
  "idempotency_key": "IdempotencyKey",
  "occurred_at": "Timestamp",
  "trace_ref": "TraceContextRef",
  "payload": {}
}
```

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
| `space_kind` | `ConversationSpaceKind` | `ConversationSpace.space_kind` | request | reject |
| `owner_ref` | `ConversationOwnerRef` | `ConversationSpace.owner_ref` | request | reject |
| `initial_participants` | `Vec<ConversationParticipantRef>` | `ParticipantScope.participants` | request | reject empty unless system space |
| `default_visibility` | `VisibilityLevel` | `VisibilityScope.default_visibility` | request | derive project default |
| `actor` | `ActorContext` | `ConversationSpace.created_by` | command envelope | reject |
| `idempotency_key` | `IdempotencyKey` | idempotency record | command envelope | reject |

| 输入契约 | 目标 Domain 对象 | 必填字段是否齐全 | 派生字段来源 | 不得混同的字段 | 缺失时行为 |
|---|---|---|---|---|---|
| `CreateConversationSpaceRequest` | `ConversationSpace`、`ParticipantScope`、`VisibilityScope`、`ScopeChangeRecord` | 是 | ids / versions / timestamps 来自 `IdGeneratorPort` / `ClockPort` | `owner_ref` != actor;participant scope != visibility scope | reject or derive default visibility |

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
| `close_mode` | `SpaceCloseMode` | `ConversationSpace.lifecycle_state` | request | derive `closed` |
| `close_reason` | `SpaceCloseReason` | `ScopeChangeRecord.change_reason` | request | reject |
| `archive_intent_ref` | `Option<ArchiveIntentRef>` | archive state evidence | request | optional unless mode archived |

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
| `add_participants` | `Vec<ConversationParticipantRef>` | `ParticipantScope.participants` | request | empty allowed if remove non-empty |
| `remove_participants` | `Vec<ConversationParticipantRef>` | `ParticipantScope.participants` | request | empty allowed if add non-empty |
| `change_reason` | `ScopeChangeReason` | `ScopeChangeRecord.change_reason` | request | reject |

| 输入契约 | 目标 Domain 对象 | 必填字段是否齐全 | 派生字段来源 | 不得混同的字段 | 缺失时行为 |
|---|---|---|---|---|---|
| `UpdateParticipantScopeRequest` | `ParticipantScope`、`ScopeChangeRecord` | 是 | previous / new snapshot refs from repository / id generator | participant scope != identity membership truth | reject no-op unless reason permits audit-only |

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
| `visibility_rules` | `VisibilityRuleSet` | `VisibilityScope.visibility_rules` | request | reject |
| `change_reason` | `ScopeChangeReason` | `ScopeChangeRecord.change_reason` | request | reject |
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
| 处理方 | `FactCommandHandler` -> `ConversationFactAppendService` |

```json
{
  "space_id": "ConversationSpaceId",
  "fact_kind": "ConversationFactKind",
  "source_ref": "FactSourceRef",
  "visibility_scope_id": "VisibilityScopeId",
  "payload_ref": "ConversationFactPayloadRef",
  "payload_digest": "PayloadDigest"
}
```

| 输入字段 | 类型 | 目标对象字段 | 字段来源 | 缺失处理 |
|---|---|---|---|---|
| `space_id` | `ConversationSpaceId` | `ConversationFact.space_id` | route / request | reject |
| `fact_kind` | `ConversationFactKind` | `ConversationFact.fact_kind` | request | reject |
| `source_ref` | `FactSourceRef` | `ConversationFact.source_ref` | request or consumer derived | reject |
| `visibility_scope_id` | `VisibilityScopeId` | `ConversationFact.visibility_scope_id` | request or default scope | derive default if absent |
| `payload_ref` | `ConversationFactPayloadRef` | `ConversationFact.payload_ref` | request | reject |
| `payload_digest` | `PayloadDigest` | audit / idempotency evidence | request | reject if payload_ref requires digest |

| 输入契约 | 目标 Domain 对象 | 必填字段是否齐全 | 派生字段来源 | 不得混同的字段 | 缺失时行为 |
|---|---|---|---|---|---|
| `AppendConversationFactRequest` | `ConversationFact`、`FactSourceRef`、`FactAppendReceipt`、`ConversationTraceContext` | 是 | fact id / sequence / receipt id / timestamp from technical ports | payload_ref != payload body;source_ref != actor truth | reject missing source or forbidden payload |

#### 7.3.6 `RetractConversationFact`

| 项 | 内容 |
|---|---|
| 函数签名 | `handle_retract_conversation_fact(RetractConversationFactRequest request) -> Result<FactAppendReceipt, ApiError>` |
| HTTP / RPC / Event 名称 | `POST /conversation/spaces/{space_id}/facts/{fact_id}:retract` |
| 调用方 | trusted service / operator |
| 处理方 | `FactCommandHandler` -> `ConversationFactAppendService` |

```json
{
  "space_id": "ConversationSpaceId",
  "fact_id": "ConversationFactId",
  "retraction_reason": "FactRetractionReason",
  "visibility_scope_id": "VisibilityScopeId"
}
```

| 输入字段 | 类型 | 目标对象字段 | 字段来源 | 缺失处理 |
|---|---|---|---|---|
| `space_id` | `ConversationSpaceId` | lookup guard | route / request | reject |
| `fact_id` | `ConversationFactId` | `ConversationFact.fact_id` | route / request | reject |
| `retraction_reason` | `FactRetractionReason` | fact state transition reason | request | reject |
| `visibility_scope_id` | `VisibilityScopeId` | visibility guard | request or fact | derive from fact |

| 输入契约 | 目标 Domain 对象 | 必填字段是否齐全 | 派生字段来源 | 不得混同的字段 | 缺失时行为 |
|---|---|---|---|---|---|
| `RetractConversationFactRequest` | `ConversationFact`、`FactAppendReceipt`、`ConversationTraceContext` | 是 | current fact from repository;receipt / trace ids from technical ports | retraction != deletion | reject missing reason or invisible fact |

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
  "visibility_scope_id": "VisibilityScopeId",
  "snapshot_ref": "ExternalFactSnapshotRef",
  "manifestation_reason": "ManifestationReason"
}
```

| 输入字段 | 类型 | 目标对象字段 | 字段来源 | 缺失处理 |
|---|---|---|---|---|
| `space_id` | `ConversationSpaceId` | `CrossDomainManifestation.space_id` | route / request | reject |
| `external_fact_ref` | `ExternalFactRef` | `CrossDomainManifestation.external_fact_ref` | request or consumer derived | reject |
| `source_version_ref` | `ExternalSourceVersionRef` | `CrossDomainManifestation.source_version_ref` | request / resolver | derive from resolver or unresolved |
| `visibility_scope_id` | `VisibilityScopeId` | `CrossDomainManifestation.visibility_scope_id` | request / default | derive default |
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
| `anchor_kind` | `ReviewAnchorKind` | `ReviewAnchor.anchor_kind` | request | reject |
| `target_ref` | `ReviewTargetRef` | `ReviewAnchor.target_ref` | request | reject |
| `reason_ref` | `ReviewReasonRef` | `ReviewAnchor.reason_ref` | request | reject |
| `actor` | `ActorContext` | `ReviewAnchor.created_by` | command envelope | reject |

| 输入契约 | 目标 Domain 对象 | 必填字段是否齐全 | 派生字段来源 | 不得混同的字段 | 缺失时行为 |
|---|---|---|---|---|---|
| `CreateReviewAnchorRequest` | `ReviewAnchor`、`ConversationTraceContext` | 是 | anchor id / timestamp from technical ports | review anchor != governance decision | reject target not found or not visible |

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
  "destination_ref": "ObservabilityDestinationRef",
  "handoff_reason": "HandoffReason"
}
```

| 输入字段 | 类型 | 目标对象字段 | 字段来源 | 缺失处理 |
|---|---|---|---|---|
| `trace_context_id` | `ConversationTraceContextId` | `TraceHandoffRecord.trace_context_id` | request | reject |
| `destination_ref` | `ObservabilityDestinationRef` | `TraceHandoffRecord.destination_ref` | request / config default | derive default or reject |
| `handoff_reason` | `HandoffReason` | audit reason | request | reject |

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
  "archive_scope": "ArchiveScope",
  "retention_policy_ref": "TraceRetentionPolicyRef"
}
```

| 输入字段 | 类型 | 目标对象字段 | 字段来源 | 缺失处理 |
|---|---|---|---|---|
| `space_id` | `ConversationSpaceId` | `ArchiveHandoffRecord.space_id` | request / trace context | derive from trace or reject |
| `trace_context_id` | `Option<ConversationTraceContextId>` | handoff source | request | optional if archive whole space |
| `archive_scope` | `ArchiveScope` | `ArchiveHandoffRecord.archive_scope` | request | derive space scope or reject |
| `retention_policy_ref` | `TraceRetentionPolicyRef` | `ArchiveHandoffRecord.retention_policy_ref` | request / config default | derive default or reject |

| 输入契约 | 目标 Domain 对象 | 必填字段是否齐全 | 派生字段来源 | 不得混同的字段 | 缺失时行为 |
|---|---|---|---|---|---|
| `RequestArchiveHandoffRequest` | `ArchiveHandoffRecord`、`ConversationOutboxRecord` | 是 | archive package ref absent until delivery job | archive request != archive package | reject insufficient scope |

### 7.4 Query API 协议契约

#### 7.4.1 `GetConversationReadModel`

| 项 | 内容 |
|---|---|
| 函数签名 | `handle_get_conversation_read_model(GetConversationReadModelRequest request) -> Result<ConversationReadModelView, ApiError>` |
| HTTP / RPC / Event 名称 | `GET /conversation/spaces/{space_id}/read-model` |
| 调用方 | SDK / Chat / Workspace / Runtime |
| 处理方 | `ConversationQueryHandler` -> `AuthorizedConversationQueryService` |

```json
{
  "space_id": "ConversationSpaceId",
  "consumer_ref": "ConsumerRef",
  "consistency": "ReadConsistency"
}
```

| 输入契约 | 读取对象 | 必填字段是否齐全 | 派生字段来源 | 不得混同的字段 | 缺失时行为 |
|---|---|---|---|---|---|
| `GetConversationReadModelRequest` | `ConversationReadModel`、`VisibilityScope`、`ExternalReferenceProjection` | 是 | consumer from query envelope if omitted | consumer_ref != actor_ref unless explicitly same | reject missing space or consumer |

#### 7.4.2 `ListConversationFacts`

| 项 | 内容 |
|---|---|
| 函数签名 | `handle_list_conversation_facts(ListConversationFactsRequest request) -> Result<ConversationFactPage, ApiError>` |
| HTTP / RPC / Event 名称 | `GET /conversation/spaces/{space_id}/facts` |
| 调用方 | SDK / Chat / Workspace |
| 处理方 | `ConversationQueryHandler` -> `AuthorizedConversationQueryService` |

```json
{
  "space_id": "ConversationSpaceId",
  "consumer_ref": "ConsumerRef",
  "page": "PageRequest",
  "include_retracted": false
}
```

| 输入契约 | 读取对象 | 必填字段是否齐全 | 派生字段来源 | 不得混同的字段 | 缺失时行为 |
|---|---|---|---|---|---|
| `ListConversationFactsRequest` | `ConversationFact` refs、`ConversationReadModel` | 是 | page default from config | include_retracted != bypass visibility | reject missing consumer |

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
  "cursor_id": "ConversationChangeCursorId"
}
```

| 输入契约 | 读取对象 | 必填字段是否齐全 | 派生字段来源 | 不得混同的字段 | 缺失时行为 |
|---|---|---|---|---|---|
| `GetConversationChangeCursorRequest` | `ConversationChangeCursor`、`VisibilityScope`、`ConversationProjectionState` | 是 | cursor may be derived from space + consumer | cursor_id != fact sequence | create empty cursor view or reject by policy |

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
  "limit": "BatchSize"
}
```

| 输入契约 | 读取对象 | 必填字段是否齐全 | 派生字段来源 | 不得混同的字段 | 缺失时行为 |
|---|---|---|---|---|---|
| `PollConversationChangesRequest` | `ChangeCursorProjection`、`ConversationOutboxRecord`、`VisibilityScope` | 是 | limit default from config | change event != full fact payload | stale / expired cursor marker |

#### 7.4.6 `SearchConversationHistory`

| 项 | 内容 |
|---|---|
| 函数签名 | `handle_search_conversation_history(SearchConversationHistoryRequest request) -> Result<ConversationSearchResultPage, ApiError>` |
| HTTP / RPC / Event 名称 | `GET /conversation/spaces/{space_id}/search` |
| 调用方 | SDK / Chat / Workspace |
| 处理方 | `ConversationQueryHandler` -> `AuthorizedConversationQueryService` |

```json
{
  "space_id": "ConversationSpaceId",
  "consumer_ref": "ConsumerRef",
  "query_text": "SearchQueryText",
  "page": "PageRequest"
}
```

| 输入契约 | 读取对象 | 必填字段是否齐全 | 派生字段来源 | 不得混同的字段 | 缺失时行为 |
|---|---|---|---|---|---|
| `SearchConversationHistoryRequest` | `SearchIndexProjection`、`ConversationReadModel` | 是 | page default from config | search result != truth | stale projection marker |

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
| 函数签名 | `handle_get_conversation_projection_state(GetConversationProjectionStateRequest request) -> Result<ConversationProjectionStateView, ApiError>` |
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

#### 7.5.1 `ConsumeWorkContextChanged`

| 项 | 内容 |
|---|---|
| 函数签名 | `consume_work_context_changed(InboundEventEnvelope<WorkContextChangedEvent> event) -> Result<ConsumerReceipt, ConsumerError>` |
| HTTP / RPC / Event 名称 | `topic: work.context.changed` |
| 调用方 | L1-work / L0-bus |
| 处理方 | `ConversationInboundConsumer` -> `ExternalReferenceIngestionService` |

```json
{
  "event_id": "EventId",
  "event_envelope_ref": "EventEnvelopeRef",
  "event_source_ref": "EventSourceRef",
  "idempotency_key": "IdempotencyKey",
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
  "event_id": "EventId",
  "event_envelope_ref": "EventEnvelopeRef",
  "event_source_ref": "EventSourceRef",
  "idempotency_key": "IdempotencyKey",
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
  "event_id": "EventId",
  "event_envelope_ref": "EventEnvelopeRef",
  "event_source_ref": "EventSourceRef",
  "idempotency_key": "IdempotencyKey",
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
  "event_id": "EventId",
  "event_envelope_ref": "EventEnvelopeRef",
  "event_source_ref": "EventSourceRef",
  "idempotency_key": "IdempotencyKey",
  "space_id": "ConversationSpaceId",
  "runtime_result_ref": "RuntimeResultRef",
  "result_payload_ref": "ConversationFactPayloadRef",
  "source_version_ref": "ExternalSourceVersionRef",
  "system_actor_ref": "SystemActorRef"
}
```

| 输入字段 | 类型 | 目标对象字段 | 字段来源 | 缺失处理 |
|---|---|---|---|---|
| `space_id` | `ConversationSpaceId` | `ConversationFact.space_id` | 来源事件 | quarantine |
| `runtime_result_ref` | `RuntimeResultRef` | `FactSourceRef.source_object_ref` | 来源事件 | quarantine |
| `result_payload_ref` | `ConversationFactPayloadRef` | `ConversationFact.payload_ref` | 来源事件 | reject if forbidden body |
| `system_actor_ref` | `SystemActorRef` | system actor for policy | 来源事件或 config | delayed marker |

| 输入契约 | 目标 Domain 对象 | 必填字段是否齐全 | 派生字段来源 | 不得混同的字段 | 缺失时行为 |
|---|---|---|---|---|---|
| `RuntimeResultCommittedEvent` | `FactSourceRef`、`ConversationFact`、`FactAppendReceipt`、`ConversationTraceContext` | 是 | participant / visibility from repository | runtime result != reasoning process | quarantine / reject |

#### 7.5.5 `ConsumeBridgeMappedFactReceived`

| 项 | 内容 |
|---|---|
| 函数签名 | `consume_bridge_mapped_fact_received(InboundEventEnvelope<BridgeMappedFactReceivedEvent> event) -> Result<ConsumerReceipt, ConsumerError>` |
| HTTP / RPC / Event 名称 | `topic: bridge.mapped_fact.received` |
| 调用方 | L6-bridges |
| 处理方 | `ConversationInboundConsumer` -> `ConversationFactAppendService` 或 `ManifestationIngestionService` |

```json
{
  "event_id": "EventId",
  "event_envelope_ref": "EventEnvelopeRef",
  "event_source_ref": "EventSourceRef",
  "idempotency_key": "IdempotencyKey",
  "space_id": "ConversationSpaceId",
  "bridge_fact_ref": "ExternalSourceObjectRef",
  "mapped_payload_ref": "ConversationFactPayloadRef",
  "source_version_ref": "ExternalSourceVersionRef",
  "source_digest": "ExternalSourceDigest"
}
```

| 输入字段 | 类型 | 目标对象字段 | 字段来源 | 缺失处理 |
|---|---|---|---|---|
| `space_id` | `ConversationSpaceId` | `ConversationFact.space_id` 或 `CrossDomainManifestation.space_id` | 来源事件 / routing rule | quarantine |
| `bridge_fact_ref` | `ExternalSourceObjectRef` | `FactSourceRef.source_object_ref` 或 `ExternalFactRef.source_object_ref` | 来源事件 | quarantine |
| `mapped_payload_ref` | `ConversationFactPayloadRef` | `ConversationFact.payload_ref` | bridge adapter | reject if forbidden body |
| `source_digest` | `ExternalSourceDigest` | `ExternalFactRef.source_digest` | 来源事件 | quarantine |

| 输入契约 | 目标 Domain 对象 | 必填字段是否齐全 | 派生字段来源 | 不得混同的字段 | 缺失时行为 |
|---|---|---|---|---|---|
| `BridgeMappedFactReceivedEvent` | `FactSourceRef`、`ConversationFact` 或 `ExternalFactRef`、`CrossDomainManifestation` | 是 | target mode from bridge mapping metadata | bridge payload ref != external platform body | quarantine / reject |

#### 7.5.6 `ConsumeIdentityActorChanged`

| 项 | 内容 |
|---|---|
| 函数签名 | `consume_identity_actor_changed(InboundEventEnvelope<IdentityActorChangedEvent> event) -> Result<ConsumerReceipt, ConsumerError>` |
| HTTP / RPC / Event 名称 | `topic: identity.actor.changed` |
| 调用方 | L1-identity |
| 处理方 | `ConversationInboundConsumer` -> `ConversationDerivedMaintenanceService` |

```json
{
  "event_id": "EventId",
  "event_envelope_ref": "EventEnvelopeRef",
  "event_source_ref": "EventSourceRef",
  "idempotency_key": "IdempotencyKey",
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
  "archive_package_ref": "ArchivePackageRef",
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
  "max_snapshot_age": "Duration",
  "trace_ref": "TraceContextRef"
}
```

| 输入契约 | 目标 Domain 对象 | 必填字段是否齐全 | 派生字段来源 | 不得混同的字段 | 缺失时行为 |
|---|---|---|---|---|---|
| `RefreshExternalReferenceSnapshotsJob` | `ExternalFactSnapshot`、`ReferenceResolutionState`、`ExternalReferenceProjection` | 是 | refs from external reference repository | snapshot ref != source body | unresolved marker / failed job receipt |

输出:`JobRunReceipt` 必须包含 refreshed snapshot count、unresolved refs 和 digest mismatch refs。

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
  "trace_ref": "TraceContextRef"
}
```

| 输入契约 | 目标 Domain 对象 | 必填字段是否齐全 | 派生字段来源 | 不得混同的字段 | 缺失时行为 |
|---|---|---|---|---|---|
| `DeliverTraceHandoffJob` | `TraceHandoffRecord` handoff state | 是 | pending handoff page from trace repository | trace delivery receipt != trace truth | retry / failed handoff marker |

输出:`JobRunReceipt` 必须包含 delivered handoff refs、retry refs、failed refs 和 external receipt refs。

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
  "trace_ref": "TraceContextRef"
}
```

| 输入契约 | 目标 Domain 对象 | 必填字段是否齐全 | 派生字段来源 | 不得混同的字段 | 缺失时行为 |
|---|---|---|---|---|---|
| `DeliverArchiveHandoffJob` | `ArchiveHandoffRecord` handoff state | 是 | pending handoff page from trace repository | archive package ref != archive package body | retry / failed handoff marker |

输出:`JobRunReceipt` 必须包含 archived refs、retry refs、failed refs 和 archive package refs。

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
| Review command | `CreateReviewAnchorCommand` | `ReviewAnchor`、`ConversationTraceContext`、`ConversationOutboxRecord` | 闭合 | target fact / manifestation / scope change lookup | reject / not found |
| Trace handoff command | `RequestTraceHandoffCommand` | `TraceHandoffRecord`、`ConversationOutboxRecord` | 闭合 | trace context from repository | reject / not found |
| Archive handoff command | `RequestArchiveHandoffCommand` | `ArchiveHandoffRecord`、`ConversationOutboxRecord` | 闭合 | trace context / space / retention policy lookup | reject / not found |
| Query APIs | `*QueryRequest` | `ConversationReadModel`、`ConversationFact`、`CrossDomainManifestation`、`ConversationTraceContext`、`ConversationProjectionState` | 闭合 | repository / projection store | not visible / stale / not found |
| Inbound consumers | `InboundEventEnvelope<T>` | `ExternalFactRef`、`ExternalFactSnapshot`、`ConversationFact`、`CrossDomainManifestation`、`ProjectionState` | 闭合 | source config, resolver, routing rule | quarantine / delayed / unresolved |
| Outbound events | `ConversationOutboxRecord` / `ConversationProjectionState` | event payload | 闭合 | committed truth / outbox / projection state | do not publish |
| Operations jobs | `*Job` | projection / outbox / handoff / snapshot states | 闭合 | repository page, config, resolver, handoff port | failed job receipt |

### 7.9 错误映射汇总表

| 协议类别 | 主要错误 | 映射规则 | 对外响应 / 记录 |
|---|---|---|---|
| Command API | `ProtocolError::MissingRequiredField` | 缺少 schema 必填字段、actor、metadata 或 idempotency key | 4xx / command audit |
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
| `CreateConversationSpace` | command `IdempotencyKey` | command retention window | command audit + outbox ref | 返回已创建 space result |
| `CloseConversationSpace` | command `IdempotencyKey` | command retention window | command audit + scope change ref | 返回已有 lifecycle result |
| `UpdateParticipantScope` | command `IdempotencyKey` | command retention window | command audit + scope change ref | 返回已有 participant result |
| `UpdateVisibilityScope` | command `IdempotencyKey` | command retention window | command audit + scope change ref | 返回已有 visibility result |
| `AppendConversationFact` | command `IdempotencyKey` | command retention window | command audit + append receipt | 返回 duplicate receipt |
| `RetractConversationFact` | command `IdempotencyKey` | command retention window | command audit + trace ref | 返回已有 retraction result |
| `ManifestExternalFact` | command `IdempotencyKey` | command retention window | command audit + manifestation ref | 返回已有 manifestation result |
| `CreateReviewAnchor` | command `IdempotencyKey` | command retention window | command audit + review anchor ref | 返回已有 anchor result |
| `RequestTraceHandoff` | command `IdempotencyKey` | handoff retention window | command audit + handoff ref | 返回已有 handoff intent |
| `RequestArchiveHandoff` | command `IdempotencyKey` | archive retention window | command audit + archive handoff ref | 返回已有 archive intent |
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
