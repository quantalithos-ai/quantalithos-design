# Step 9. 逐接口定义函数级处理流

## 1. Step 状态

- 状态: `[x] 已完成`
- 对应 SOP: `standards/document/详细设计讨论流程_SOP.md` Step 9
- 回填章节: `projects/L1-conversation/03-详细设计.md` §8 逐接口函数级处理流

---

## 2. 本步输入

| 输入 | 内容 | 本步使用方式 |
|---|---|---|
| `03_ddd_step_08_protocol_contracts.md` | 45 个 Command / Query / Event / Job 协议、schema、错误映射和幂等矩阵 | 作为处理流全集和 DTO 构造闭环来源 |
| `03_ddd_step_05_module_contracts_axis.md` | 模块主轴和入口归属 | 确定 handler、service、worker、job 的归属 |
| `03_ddd_step_06_object_contracts.md` | domain 对象、成员函数、工厂函数、状态 enum | 确定每个处理流可调用的领域函数 |
| `03_ddd_step_07_trait_port_adapter_contracts.md` | repository、resolver、publisher、handoff、technical port | 确定每个处理流可调用的端口 |
| `standards/document/详细设计书写规范.md` §5.8 | 处理流总表、ASCII 调用图、伪代码、事务、错误、测试格式 | 作为输出格式约束 |

已确认约束:

```text
Command API 可以写 Conversation truth、trace、handoff intent 和 outbox。
Query API 只读 truth / projection / read model,不得写 truth。
Inbound Event Consumer 只能消化来源事实,不得复制来源正文或绕过本仓 policy。
Outbound Event 只能来自已提交 truth / outbox / projection state。
Operations Job 只能维护投影、outbox、快照、handoff、对账或清理派生状态。
```

---

## 3. SOP 问题回答

### 3.1 哪些协议必须拥有函数级处理流？

Step 8 已把 45 个协议全部标记为需要处理流。本步逐一展开:

| 类别 | 数量 | 处理流范围 |
|---|---:|---|
| Command API | 10 | 创建 / 关闭 space、更新 scope、追加 / 撤回 fact、显化外部事实、创建复盘锚点、请求 trace / archive handoff |
| Query API | 11 | 读取 read model、fact、cursor、change、search、manifestation、trace、review anchor、projection state、external reference projection |
| Inbound Event Consumer | 6 | work / governance / artifact / runtime / bridge / identity 来源事件消费 |
| Outbound Event | 9 | space / scope / fact / manifestation / change / handoff / projection state 对外事件发布 |
| Operations Job | 9 | outbox 发布、投影重建、搜索索引、游标维护、快照刷新、handoff 交付、对账和清理 |

### 3.2 每个处理流的入口函数是什么？

回答:见 §7.1 处理流总表。入口分为 `api::command_handlers`、`api::query_handlers`、`worker::consumers`、`outbox publisher` 和 `jobs::*`。

### 3.3 入口函数调用哪些 application service、domain method、repository 和 outbox？

回答:每个处理流在 §7.2~§7.6 的调用图和伪代码中标明。Command / Consumer / Job 必须显式写 `UnitOfWork.begin()`、repository、domain 工厂 / 成员函数、outbox 或 job evidence。

### 3.4 入口 DTO 在哪一步被校验、派生、转换或用于构造 Domain 对象？

| DTO 类别 | 校验位置 | 派生 / 转换位置 | 目标对象 |
|---|---|---|---|
| Command DTO | handler 校验 envelope 和必填字段;service 校验幂等 | application service 读取 repository 后调用 domain 工厂 / 成员函数 | space、scope、fact、manifestation、trace、handoff、outbox |
| Query DTO | handler 校验 page / cursor / consumer;query service 校验 visibility | query service 读取 projection / truth 后调用 policy 裁剪 | read model、fact view、change page、trace view |
| Inbound Event DTO | consumer 校验 envelope、event id、source ref、idempotency key | consumer service 从来源事件提取 ref / snapshot / source | external ref、snapshot、fact、manifestation、projection stale marker |
| Outbound Event DTO | publisher 校验 outbox / projection state | publisher 从 committed truth / outbox 构造 event payload | published event evidence |
| Job DTO | job runner 校验 job run id、scope、idempotency key | job service 读取批次或投影后调用 domain 函数 | projection、snapshot、handoff、outbox、job receipt |

### 3.5 如果构造目标对象所需字段缺失，处理流如何返回错误或恢复？

| 缺失类型 | 处理方式 |
|---|---|
| 同步 Command 必填字段缺失 | handler 返回 `ProtocolError::MissingRequiredField`,不进入事务 |
| Command 构造对象所需 repository 数据缺失 | application service 返回 `ApplicationError::NotFound` 或 `ApplicationError::Conflict`,事务回滚 |
| Inbound Event envelope / source ref / idempotency 缺失 | consumer 写 quarantine marker,不写 truth |
| 来源引用暂不可解析 | 写 `ReferenceResolutionState::Pending` 或 `Unresolved`,不复制来源正文 |
| Query 可见性不足 | 返回 `ApplicationError::NotVisible` 或 empty authorized view |
| Outbound Event 缺 committed truth ref | 不发布,保存 outbox failed marker |
| Job scope / job_run_id 缺失 | 返回 failed job receipt,不处理批次 |

### 3.6 事务在哪里开始，在哪里提交，哪些错误触发回滚？

| 流类型 | 事务开始 | 提交位置 | 回滚条件 |
|---|---|---|---|
| Command API | 幂等 reserve 成功后 | truth / trace / outbox 保存和幂等 complete 后 | domain error、repository error、outbox append failure、version conflict |
| Query API | 不开启写事务 | 不适用 | 不适用 |
| Inbound Event Consumer | event 幂等 reserve 成功后 | 本地 snapshot / projection / fact / outbox 保存和幂等 complete 后 | invalid source、domain error、repository error |
| Outbound Event | outbox record lock 后 | publish evidence 和 outbox state 保存后 | publisher error、outbox state conflict |
| Operations Job | job 幂等 reserve 成功后;批处理可每 item 一个事务 | job receipt / evidence 保存后 | job input invalid、domain error、repository error、external port error |

### 3.7 哪些状态会被修改，哪些事件会被写入？

| 流类型 | 状态变化 | 事件 / 证据副作用 |
|---|---|---|
| Command API | space lifecycle、scope state、fact state、manifestation state、trace / archive handoff state | `ConversationOutboxRecord` |
| Query API | 无 truth 状态变化 | 可选 read audit |
| Inbound Event Consumer | external reference resolution、projection freshness、fact append、manifestation state | consumer audit、outbox 或 stale marker |
| Outbound Event | outbox publication state | publish evidence |
| Operations Job | projection freshness、outbox publication、handoff state、cursor state、snapshot resolution | job receipt、report ref、diagnostic marker |

### 3.8 每个处理流至少需要哪些测试切口？

| 流类型 | 最小测试切口 |
|---|---|
| Command API | happy path、missing field、idempotent duplicate、domain reject、outbox rollback |
| Query API | authorized read、not visible、stale / unresolved marker、pagination / cursor |
| Inbound Event Consumer | valid event、duplicate event、invalid envelope、resolver failure、quarantine |
| Outbound Event | publish success、publish failure retry、payload redaction、duplicate publish |
| Operations Job | valid batch、empty batch、partial failure、idempotent rerun、evidence output |

---

## 4. 当前文档问题诊断

| 位置 | 当前问题 | 影响 |
|---|---|---|
| 旧版 `03-详细设计.md` | 仍以 Turn / StreamEvents / AG-UI 推送为主要处理流 | 会让实现偏向 UI 消息流,而不是 Conversation truth center |
| Step 8 | 已有协议 schema 和构造闭环,但没有函数级调用链 | 实现者仍需自行判断事务边界、repository 调用和 outbox 时机 |
| Step 6 | 对象函数已定义,但未说明在哪个接口调用 | 可能出现对象函数闲置或被错误调用 |
| Step 7 | port 已定义,但未绑定到具体处理流 | 可能出现直接跨层调用或绕过 adapter |

---

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 处理流覆盖 | 只有概要级处理流 | 45 个协议逐一给出入口、调用图、伪代码、事务、错误、状态、测试 | 满足 1:1 落码 |
| DTO 构造 | Step 8 已说明字段闭环 | Step 9 明确字段进入 domain 工厂 / 成员函数的具体位置 | 防止实现 agent 自行补设计 |
| 事务边界 | 仅原则说明 | 每个写流显式写 tx begin / commit / rollback | 支撑 Step 11 |
| outbox / event | 只知道事件名 | 明确在哪个处理流 append / publish / mark failed | 支撑 outbox 实现 |
| 测试切口 | 仅类别级 | 每个 flow 给出最小测试切口 | 支撑 Step 16 |

---

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A: 只写 Command 和 Job,Query / Event 使用通用流 | 文件短 | 不满足“每个接口一个独立处理流” | 不采用 |
| 方案 B: 45 个协议逐一成节,每节写调用图、伪代码、事务、错误和测试 | 可实现、可复核、能回指 Step 8 | 文件较长 | 采用 |
| 方案 C: 把多个 Query 合并为一个查询模板 | 重复少 | 会隐藏 visibility、cursor、trace、projection 的差异 | 不采用 |
| 方案 D: 直接绑定具体 HTTP / event bus / scheduler 框架 | 更贴近代码 | 过早绑定技术产品,不符合 adapter 边界 | 不采用 |

推荐方案:方案 B。

原因:

- Step 9 是实现前最后一次证明 DTO、domain、repository、事务、event 和测试切口闭合的步骤。
- L1-conversation 的协议类型多,合并处理流会掩盖 fact、manifestation、trace、projection、handoff 之间的不同状态副作用。
- 每个 flow 独立成节后,后续 Step 10~16 可以逐项回指,避免后续实现 agent 再次提出“对象有但 flow 不知道怎么用”的阻塞。

---

## 7. 结构化中间产物

### 7.1 处理流总表

| 处理流 | 对应协议 | 入口函数 | 主要事务 | 状态变化 | 测试切口 |
|---|---|---|---|---|---|
| `CreateConversationSpaceFlow` | `CreateConversationSpace` | `handle_create_conversation_space(CreateConversationSpaceRequest request)` | 单写事务 | space / scope / truth 初始成立 | create success、missing actor、duplicate key、outbox rollback |
| `CloseConversationSpaceFlow` | `CloseConversationSpace` | `handle_close_conversation_space(CloseConversationSpaceRequest request)` | 单写事务 | space lifecycle / scope change | close success、already closed、not found、outbox rollback |
| `UpdateParticipantScopeFlow` | `UpdateParticipantScope` | `handle_update_participant_scope(UpdateParticipantScopeRequest request)` | 单写事务 | participant scope / scope change | update success、invalid participant、duplicate key、version conflict |
| `UpdateVisibilityScopeFlow` | `UpdateVisibilityScope` | `handle_update_visibility_scope(UpdateVisibilityScopeRequest request)` | 单写事务 | visibility scope / projection stale | update success、not visible rule、projection stale、outbox rollback |
| `AppendConversationFactFlow` | `AppendConversationFact` | `handle_append_conversation_fact(AppendConversationFactRequest request)` | 单写事务 | fact appended / trace context / outbox | append success、policy reject、duplicate receipt、forbidden payload |
| `RetractConversationFactFlow` | `RetractConversationFact` | `handle_retract_conversation_fact(RetractConversationFactRequest request)` | 单写事务 | fact retracted / trace context / outbox | retract success、already terminal、not found、not authorized |
| `ManifestExternalFactFlow` | `ManifestExternalFact` | `handle_manifest_external_fact(ManifestExternalFactRequest request)` | 单写事务 | manifestation / optional fact / trace / outbox | manifest success、resolver unresolved、visibility reject、no body copy |
| `CreateReviewAnchorFlow` | `CreateReviewAnchor` | `handle_create_review_anchor(CreateReviewAnchorRequest request)` | 单写事务 | review anchor / trace context / outbox | anchor success、target missing、visibility reject、outbox rollback |
| `RequestTraceHandoffFlow` | `RequestTraceHandoff` | `handle_request_trace_handoff(RequestTraceHandoffRequest request)` | 单写事务 | trace handoff pending / outbox | handoff requested、trace missing、retention reject、duplicate |
| `RequestArchiveHandoffFlow` | `RequestArchiveHandoff` | `handle_request_archive_handoff(RequestArchiveHandoffRequest request)` | 单写事务 | archive handoff pending / outbox | archive requested、scope invalid、policy reject、duplicate |
| `GetConversationReadModelFlow` | `GetConversationReadModel` | `handle_get_conversation_read_model(GetConversationReadModelRequest request, ConsumerContext consumer_context, QueryMetadata metadata)` | 只读 | 无 | authorized read、not visible、stale marker |
| `ListConversationFactsFlow` | `ListConversationFacts` | `handle_list_conversation_facts(ListConversationFactsRequest request, ConsumerContext consumer_context, QueryMetadata metadata)` | 只读 | 无 | page success、visibility filter、invalid page |
| `GetConversationFactFlow` | `GetConversationFact` | `handle_get_conversation_fact(GetConversationFactRequest request)` | 只读 | 无 | found visible、not visible、not found |
| `GetConversationChangeCursorFlow` | `GetConversationChangeCursor` | `handle_get_conversation_change_cursor(GetConversationChangeCursorRequest request)` | 只读 | 无 | cursor found、cursor missing、stale projection |
| `PollConversationChangesFlow` | `PollConversationChanges` | `handle_poll_conversation_changes(PollConversationChangesRequest request)` | 只读 | 无 | changes visible、empty page、cursor invalid |
| `SearchConversationHistoryFlow` | `SearchConversationHistory` | `handle_search_conversation_history(SearchConversationHistoryRequest request, ConsumerContext consumer_context, QueryMetadata metadata)` | 只读 | 无 | search success、stale index、visibility filter |
| `GetCrossDomainManifestationFlow` | `GetCrossDomainManifestation` | `handle_get_cross_domain_manifestation(GetCrossDomainManifestationRequest request)` | 只读 | 无 | visible manifestation、unresolved marker、not visible |
| `GetConversationTraceContextFlow` | `GetConversationTraceContext` | `handle_get_conversation_trace_context(GetConversationTraceContextRequest request)` | 只读 | 无 | trace visible、retention expired、not authorized |
| `GetReviewAnchorFlow` | `GetReviewAnchor` | `handle_get_review_anchor(GetReviewAnchorRequest request)` | 只读 | 无 | anchor visible、target hidden、not found |
| `GetConversationProjectionStateFlow` | `GetConversationProjectionState` | `handle_get_conversation_projection_state(GetConversationProjectionStateRequest request, ActorContext actor, QueryMetadata metadata)` | 只读 | 无 | fresh、stale、failed projection |
| `GetExternalReferenceProjectionFlow` | `GetExternalReferenceProjection` | `handle_get_external_reference_projection(GetExternalReferenceProjectionRequest request)` | 只读 | 无 | projection visible、unresolved refs、empty |
| `ConsumeWorkContextChangedFlow` | `ConsumeWorkContextChanged` | `consume_work_context_changed(InboundEventEnvelope<WorkContextChangedEvent> event)` | consumer 写事务 | reference projection stale / updated | valid event、duplicate、quarantine |
| `ConsumeGovernanceFactCommittedFlow` | `ConsumeGovernanceFactCommitted` | `consume_governance_fact_committed(InboundEventEnvelope<GovernanceFactCommittedEvent> event)` | consumer 写事务 | manifestation candidate / snapshot / outbox | manifest candidate、unresolved、duplicate |
| `ConsumeArtifactFactCommittedFlow` | `ConsumeArtifactFactCommitted` | `consume_artifact_fact_committed(InboundEventEnvelope<ArtifactFactCommittedEvent> event)` | consumer 写事务 | reference projection stale / updated | valid artifact ref、digest mismatch、quarantine |
| `ConsumeRuntimeResultCommittedFlow` | `ConsumeRuntimeResultCommitted` | `consume_runtime_result_committed(InboundEventEnvelope<RuntimeResultCommittedEvent> event)` | consumer 写事务 | fact appended / trace / outbox | result fact、forbidden reasoning body、duplicate |
| `ConsumeBridgeMappedFactReceivedFlow` | `ConsumeBridgeMappedFactReceived` | `consume_bridge_mapped_fact_received(InboundEventEnvelope<BridgeMappedFactReceivedEvent> event)` | consumer 写事务 | fact or manifestation / outbox | mapped fact、no platform body、invalid mapping |
| `ConsumeIdentityActorChangedFlow` | `ConsumeIdentityActorChanged` | `consume_identity_actor_changed(InboundEventEnvelope<IdentityActorChangedEvent> event)` | consumer 写事务 | read model / projection stale | actor change、projection stale、duplicate |
| `ConversationSpaceChangedPublishFlow` | `ConversationSpaceChangedEvent` | `publish_conversation_space_changed(ConversationOutboxRecord outbox)` | outbox 状态事务 | outbox publication | published、publish failed、duplicate |
| `ConversationScopeChangedPublishFlow` | `ConversationScopeChangedEvent` | `publish_conversation_scope_changed(ConversationOutboxRecord outbox)` | outbox 状态事务 | outbox publication | published、redaction marker、publish failed |
| `ConversationFactAppendedPublishFlow` | `ConversationFactAppendedEvent` | `publish_conversation_fact_appended(ConversationOutboxRecord outbox)` | outbox 状态事务 | outbox publication | published、payload ref only、publish failed |
| `ConversationFactRetractedPublishFlow` | `ConversationFactRetractedEvent` | `publish_conversation_fact_retracted(ConversationOutboxRecord outbox)` | outbox 状态事务 | outbox publication | published、downstream stale、publish failed |
| `CrossDomainManifestationChangedPublishFlow` | `CrossDomainManifestationChangedEvent` | `publish_cross_domain_manifestation_changed(ConversationOutboxRecord outbox)` | outbox 状态事务 | outbox publication | published、snapshot ref only、unresolved |
| `ConversationChangeAvailablePublishFlow` | `ConversationChangeAvailableEvent` | `publish_conversation_change_available(ConversationOutboxRecord outbox)` | outbox 状态事务 | outbox publication | lightweight event、cursor pull、publish failed |
| `TraceHandoffRequestedPublishFlow` | `TraceHandoffRequestedEvent` | `publish_trace_handoff_requested(ConversationOutboxRecord outbox)` | outbox 状态事务 | outbox publication | published、payload ref only、publish failed |
| `ArchiveHandoffRequestedPublishFlow` | `ArchiveHandoffRequestedEvent` | `publish_archive_handoff_requested(ConversationOutboxRecord outbox)` | outbox 状态事务 | outbox publication | published、package ref optional、publish failed |
| `ConversationProjectionStateChangedPublishFlow` | `ConversationProjectionStateChangedEvent` | `publish_conversation_projection_state_changed(ConversationProjectionState state)` | publish evidence | projection event published | fresh event、failed event、publish failure |
| `PublishConversationOutboxFlow` | `PublishConversationOutbox` | `run_publish_conversation_outbox(PublishConversationOutboxJob job)` | 每 outbox 一事务 | outbox publication state | publish batch、partial failure、rerun |
| `RebuildConversationReadModelsFlow` | `RebuildConversationReadModels` | `run_rebuild_conversation_read_models(RebuildConversationReadModelsJob job)` | 每 space / consumer 一事务 | read model / projection state | rebuild success、empty scope、failed marker |
| `RebuildConversationSearchIndexFlow` | `RebuildConversationSearchIndex` | `run_rebuild_conversation_search_index(RebuildConversationSearchIndexJob job)` | 每 space 一事务 | search projection / projection state | indexed refs、no body copy、failed marker |
| `MaintainConversationChangeCursorsFlow` | `MaintainConversationChangeCursors` | `run_maintain_conversation_change_cursors(MaintainConversationChangeCursorsJob job)` | 每 cursor scope 一事务 | cursor / cursor projection | advance success、invalid cursor、rerun |
| `RefreshExternalReferenceSnapshotsFlow` | `RefreshExternalReferenceSnapshots` | `run_refresh_external_reference_snapshots(RefreshExternalReferenceSnapshotsJob job)` | 每 ref 一事务 | snapshot / resolution state / projection | refreshed、unresolved、digest mismatch |
| `DeliverTraceHandoffFlow` | `DeliverTraceHandoff` | `run_deliver_trace_handoff(DeliverTraceHandoffJob job)` | 每 handoff 一事务 | trace handoff state | delivered、retry、failed |
| `DeliverArchiveHandoffFlow` | `DeliverArchiveHandoff` | `run_deliver_archive_handoff(DeliverArchiveHandoffJob job)` | 每 handoff 一事务 | archive handoff state | archived、retry、failed |
| `ValidateConversationConsistencyFlow` | `ValidateConversationConsistency` | `run_validate_conversation_consistency(ValidateConversationConsistencyJob job)` | report 写事务 | diagnostic marker | report success、issue found、no auto repair |
| `CleanupExpiredConversationCursorsFlow` | `CleanupExpiredConversationCursors` | `run_cleanup_expired_conversation_cursors(CleanupExpiredConversationCursorsJob job)` | 每 cursor 批次一事务 | cursor cleanup marker | cleaned、skipped active、rerun |

### 7.2 Command API 处理流

#### 7.2.1 `CreateConversationSpaceFlow`

##### 入口与目标

| 项 | 内容 |
|---|---|
| 对应协议 | `CreateConversationSpace` |
| 入口函数 | `handle_create_conversation_space(CreateConversationSpaceRequest request) -> Result<ConversationSpaceCommandResult, ApiError>` |
| Application service | `ConversationSpaceCommandService.create_space(...)` |
| 目标对象 | `ConversationSpace`、`ParticipantScope`、`VisibilityScope`、`ConversationTruthState`、`ScopeChangeRecord`、`ConversationOutboxRecord` |

##### 函数级调用图

```text
[api::command_handlers]
  | call handle_create_conversation_space(CreateConversationSpaceRequest request)
  v
[ConversationSpaceCommandService]
  | validate command envelope and CommandMetadata.request.idempotency_key
  | tx begin
  | call IdempotencyRepository.reserve(IdempotencyKey key, IdempotencyOperation operation, RequestDigest request_digest, UnitOfWorkHandle uow)
  | call ConversationSpace::create_*_space(...)
  | call ParticipantScope::from_initial_participants(...)
  | call VisibilityScope::from_participant_scope(...)
  | call ConversationTruthState::open_for_space(...)
  v
[Repository + Outbox]
  | save scope bundle
  | enqueue ConversationSpaceChangedEvent outbox
  | complete idempotency
  | tx commit
```

##### 关键伪代码

```rust
// [CreateConversationSpaceRequest.validate()]
// 校验 actor、metadata.request.idempotency_key、owner_ref、space_kind 和 initial_participants。
request.validate()?;
let key = request.metadata.request.idempotency_key.clone().ok_or(ProtocolError::MissingRequiredField)?;
let request_digest = RequestDigest::from_command(&request)?;

// [UnitOfWork.begin()]
// 开启创建 space 的写事务。
let uow = unit_of_work.begin().await?;

// [IdempotencyRepository.reserve(IdempotencyKey key, IdempotencyOperation operation, RequestDigest request_digest, UnitOfWorkHandle uow)]
// 预留命令幂等键。
let reservation = idempotency.reserve(key.clone(), IdempotencyOperation::CreateConversationSpace, request_digest.clone(), uow.clone()).await?;

// [ConversationSpace::create_project_space(ConversationOwnerRef owner_ref, ActorRef actor)]
// 根据 space_kind 调用 project / personal / system 对应工厂。
let space = ConversationSpace::create_project_space(request.owner_ref, request.actor.actor_ref)?;

// [ParticipantScope::from_initial_participants(ConversationSpaceId space_id, Vec<ConversationParticipantRef> participants)]
// 建立初始参与范围。
let participant = ParticipantScope::from_initial_participants(space.space_id, request.initial_participants)?;

// [VisibilityScope::from_participant_scope(&ParticipantScope scope, VisibilityLevel default_visibility)]
// 从参与范围生成默认可见范围。
let visibility = VisibilityScope::from_participant_scope(&participant, request.default_visibility)?;
let initial_visibility_scope_id = visibility.visibility_scope_id.clone();

// [ConversationTruthState::open_for_space(ConversationSpaceId space_id, ActorRef actor)]
// 建立本仓 truth 初始状态。
let truth = ConversationTruthState::open_for_space(space.space_id, request.actor.actor_ref);

// [ScopeChangeRecord::from_initial_space_creation(&ConversationSpace space, ActorRef actor, ScopeChangeReason reason)]
// create-space 初始 history 使用 ScopeKind::Space;reason_ref 来自 request.reason_ref。
let initial_scope_change = ScopeChangeRecord::from_initial_space_creation(
    &space,
    request.actor.actor_ref,
    ScopeChangeReason {
        reason_ref: request.reason_ref,
        reason_kind: ScopeChangeReasonKind::InitialCreate,
    },
)?;

// [ScopeMutationBundle::created(ConversationSpace space, ParticipantScope participant, VisibilityScope visibility, ConversationTruthState truth, ScopeChangeRecord scope_change)]
// 聚合创建结果和显式初始 scope change。
let bundle = ScopeMutationBundle::created(space, participant, visibility, truth, initial_scope_change);

let committed_at = clock.now();

// [ConversationOutboxRecord::from_scope_change(ScopeChangeRecord change, VisibilityScopeId visibility_scope_id, Timestamp committed_at)]
// 初始 scope_change.scope_kind = Space,因此入队 SpaceChanged outbox;cursor metadata 使用默认 visibility scope 和 committed_at。
let outbox = ConversationOutboxRecord::from_scope_change(bundle.scope_change.clone(), initial_visibility_scope_id, committed_at)?;

// [SpaceScopeRepository.save_scope_bundle(ScopeMutationBundle bundle, UnitOfWorkHandle uow)]
// 保存 space、scope、truth 和初始变化记录。
space_scope_repo.save_scope_bundle(bundle, uow.clone()).await?;
outbox_repo.enqueue(outbox, uow.clone()).await?;

// [IdempotencyRepository.complete(IdempotencyReservation reservation, IdempotencyResultRef result_ref, UnitOfWorkHandle uow)]
// 完成幂等记录。
idempotency.complete(reservation, result_ref, uow.clone()).await?;
unit_of_work.commit(uow).await?;
```

##### 事务、错误、状态与测试

| 项 | 内容 |
|---|---|
| 事务边界 | `reserve` 后开始写对象,scope bundle、outbox、幂等 complete 同事务提交 |
| 回滚错误 | missing field、domain invalid、repository failure、outbox enqueue failure、idempotency conflict |
| 状态副作用 | `ConversationSpaceLifecycleState::Active`、participant active、visibility open、truth open |
| 事件副作用 | `ConversationSpaceChangedEvent` 对应 outbox |
| 测试切口 | create project space、missing idempotency rejected、duplicate key returns previous result、outbox failure rolls back |

#### 7.2.2 `CloseConversationSpaceFlow`

##### 入口与目标

| 项 | 内容 |
|---|---|
| 对应协议 | `CloseConversationSpace` |
| 入口函数 | `handle_close_conversation_space(CloseConversationSpaceRequest request) -> Result<ConversationSpaceCommandResult, ApiError>` |
| Application service | `ConversationSpaceCommandService.close_space(...)` |
| 目标对象 | `ConversationSpace`、`ConversationTruthState`、`ScopeChangeRecord`、`ConversationOutboxRecord` |

##### 函数级调用图

```text
[api::command_handlers]
  | call handle_close_conversation_space(CloseConversationSpaceRequest request)
  v
[ConversationSpaceCommandService]
  | validate actor, close_reason, idempotency
  | tx begin
  | reserve idempotency
  | call SpaceScopeRepository.get_space_for_update(...)
  | call ConversationSpace.close(ActorRef actor, SpaceCloseReason reason)
  v
[Repository + Outbox]
  | save scope bundle
  | enqueue space changed outbox
  | complete idempotency
  | tx commit
```

##### 关键伪代码

```rust
// [CloseConversationSpaceRequest.validate()]
// 校验 space_id、actor、close_reason 和 metadata.request.idempotency_key。
request.validate()?;
let key = request.metadata.request.idempotency_key.clone().ok_or(ProtocolError::MissingRequiredField)?;
let request_digest = RequestDigest::from_command(&request)?;

// [UnitOfWork.begin()]
// 开启关闭 space 的写事务。
let uow = unit_of_work.begin().await?;

// [IdempotencyRepository.reserve(IdempotencyKey key, IdempotencyOperation operation, RequestDigest request_digest, UnitOfWorkHandle uow)]
let reservation = idempotency.reserve(key.clone(), IdempotencyOperation::CloseConversationSpace, request_digest.clone(), uow.clone()).await?;

// [SpaceScopeRepository.get_space_for_update(ConversationSpaceId space_id, UnitOfWorkHandle uow)]
// 锁定 space。
let mut space = space_scope_repo.get_space_for_update(request.space_id, uow.clone()).await?.ok_or(ApplicationError::NotFound)?;

// [ConversationSpace.close(ActorRef actor, SpaceCloseReason reason)]
// 校验生命周期并按 close_mode 进入 ReadOnly / Closed / Archived。
let scope_change = space.close(request.actor.actor_ref, request.close_reason)?;

let committed_at = clock.now();

// [ConversationOutboxRecord::from_scope_change(ScopeChangeRecord change, VisibilityScopeId visibility_scope_id, Timestamp committed_at)]
// 关闭事件必须来自已应用的 scope change;cursor metadata 使用当前 space 的默认 visibility scope 和 committed_at。
let outbox = ConversationOutboxRecord::from_scope_change(scope_change.clone(), space.default_visibility_scope_id, committed_at)?;

// [SpaceScopeRepository.save_scope_bundle(ScopeMutationBundle bundle, UnitOfWorkHandle uow)]
space_scope_repo.save_scope_bundle(ScopeMutationBundle::space_changed(space, scope_change), uow.clone()).await?;
outbox_repo.enqueue(outbox, uow.clone()).await?;
idempotency.complete(reservation, result_ref, uow.clone()).await?;
unit_of_work.commit(uow).await?;
```

##### 事务、错误、状态与测试

| 项 | 内容 |
|---|---|
| 事务边界 | 锁定 space 后修改 lifecycle,保存 scope change 和 outbox 同事务提交 |
| 回滚错误 | space not found、already archived、domain transition invalid、outbox failure |
| 状态副作用 | 只持久化 `ConversationSpace.lifecycle_state` 的 ReadOnly / Closed / Archived 变化;PH-02 不在本 flow 持久化 `ConversationTruthState`、`ParticipantScopeState` 或 `VisibilityScopeState`;append 阻断由 space lifecycle 口径检查 |
| 事件副作用 | `ConversationSpaceChangedEvent` |
| 测试切口 | close active space、close missing space、close archived rejected、duplicate close idempotent |

#### 7.2.3 `UpdateParticipantScopeFlow`

##### 入口与目标

| 项 | 内容 |
|---|---|
| 对应协议 | `UpdateParticipantScope` |
| 入口函数 | `handle_update_participant_scope(UpdateParticipantScopeRequest request) -> Result<ParticipantScopeCommandResult, ApiError>` |
| Application service | `ParticipantScopeCommandService.update_participants(...)` |
| 目标对象 | `ParticipantScope`、`ScopeChangeRecord`、`ConversationOutboxRecord` |

##### 函数级调用图

```text
[api::command_handlers]
  | call handle_update_participant_scope(UpdateParticipantScopeRequest request)
  v
[ParticipantScopeCommandService]
  | validate participant add/remove set
  | tx begin
  | reserve idempotency
  | load participant scope
  | call ParticipantScope.apply_participant_update(...)
  v
[Repository + Outbox]
  | save scope bundle
  | enqueue scope changed outbox
  | complete idempotency
  | tx commit
```

##### 关键伪代码

```rust
// [UpdateParticipantScopeRequest.validate()]
// 校验 space_id、add_participants、remove_participants、change_reason、actor 和 metadata.request.idempotency_key。
request.validate()?;
let key = request.metadata.request.idempotency_key.clone().ok_or(ProtocolError::MissingRequiredField)?;
let request_digest = RequestDigest::from_command(&request)?;

let uow = unit_of_work.begin().await?;
let reservation = idempotency.reserve(key.clone(), IdempotencyOperation::UpdateParticipantScope, request_digest.clone(), uow.clone()).await?;

// [SpaceScopeRepository.get_participant_scope(ConversationSpaceId space_id)]
// 读取当前参与范围。
let mut scope = space_scope_repo.get_participant_scope(request.space_id).await?.ok_or(ApplicationError::NotFound)?;

// [ParticipantScope.apply_participant_update(Vec<ConversationParticipantRef> add_participants, Vec<ConversationParticipantRef> remove_participants, ActorRef actor, ScopeChangeReason reason)]
// 一次命令可包含多个 add/remove,但必须合成为一个 scope change,scope version 递增一次。
let scope_change = scope.apply_participant_update(
    request.add_participants,
    request.remove_participants,
    request.actor.actor_ref,
    request.change_reason,
)?;

let visibility = space_scope_repo.get_visibility_scope(request.space_id).await?.ok_or(ApplicationError::NotFound)?;
let committed_at = clock.now();

// [ConversationOutboxRecord::from_scope_change(ScopeChangeRecord change, VisibilityScopeId visibility_scope_id, Timestamp committed_at)]
let outbox = ConversationOutboxRecord::from_scope_change(scope_change.clone(), visibility.visibility_scope_id, committed_at)?;

// [SpaceScopeRepository.save_scope_bundle(ScopeMutationBundle bundle, UnitOfWorkHandle uow)]
space_scope_repo.save_scope_bundle(ScopeMutationBundle::participant_changed(scope, scope_change), uow.clone()).await?;
outbox_repo.enqueue(outbox, uow.clone()).await?;
idempotency.complete(reservation, result_ref, uow.clone()).await?;
unit_of_work.commit(uow).await?;
```

##### 事务、错误、状态与测试

| 项 | 内容 |
|---|---|
| 事务边界 | participant scope 批量变更、单个 scope change、outbox 和幂等 complete 同事务 |
| 回滚错误 | participant invalid、scope closed、duplicate actor、same actor add/remove conflict、repository failure |
| 状态副作用 | participant scope version 对一次命令递增一次;必要时 previous change superseded |
| 事件副作用 | `ConversationScopeChangedEvent` |
| 测试切口 | add participant、remove participant、scope closed rejected、duplicate idempotent |

#### 7.2.4 `UpdateVisibilityScopeFlow`

##### 入口与目标

| 项 | 内容 |
|---|---|
| 对应协议 | `UpdateVisibilityScope` |
| 入口函数 | `handle_update_visibility_scope(UpdateVisibilityScopeRequest request) -> Result<VisibilityScopeCommandResult, ApiError>` |
| Application service | `VisibilityScopeCommandService.update_visibility(...)` |
| 目标对象 | `VisibilityScope`、`ScopeChangeRecord`、`ConversationProjectionState`、`ConversationOutboxRecord` |

##### 函数级调用图

```text
[api::command_handlers]
  | call handle_update_visibility_scope(UpdateVisibilityScopeRequest request)
  v
[VisibilityScopeCommandService]
  | validate visibility rule update
  | tx begin
  | reserve idempotency
  | load current visibility scope
  | call VisibilityScope.narrow_to(...)
  | call ConversationProjectionState.mark_stale(...)
  v
[Repository + Outbox]
  | save visibility scope and projection stale marker
  | enqueue scope changed outbox
  | complete idempotency
  | tx commit
```

##### 关键伪代码

```rust
// [UpdateVisibilityScopeRequest.validate()]
// 校验 visibility_rules、space_id、actor 和 metadata.request.idempotency_key。
request.validate()?;
let key = request.metadata.request.idempotency_key.clone().ok_or(ProtocolError::MissingRequiredField)?;
let request_digest = RequestDigest::from_command(&request)?;

let uow = unit_of_work.begin().await?;
let reservation = idempotency.reserve(key.clone(), IdempotencyOperation::UpdateVisibilityScope, request_digest.clone(), uow.clone()).await?;

// [SpaceScopeRepository.get_visibility_scope(ConversationSpaceId space_id)]
let mut visibility = space_scope_repo.get_visibility_scope(request.space_id).await?.ok_or(ApplicationError::NotFound)?;

// [VisibilityScope.narrow_to(VisibilityRuleSet rules, ActorRef actor)]
// 可见范围更新必须由 domain 判断是否允许扩张或只允许收窄。
let scope_change = visibility.narrow_to(request.visibility_rules, request.actor.actor_ref)?;

// [ConversationProjectionState::initial(ConversationSpaceId space_id, ConversationProjectionKind kind, ConversationSourcePosition source_position)]
// 若已有 projection state 则 mark_stale;若不存在则创建 stale 初始状态。
let mut state = projection_state_for(request.space_id, ConversationProjectionKind::ReadModel).await?;
state.mark_stale(ProjectionStaleReason::VisibilityScopeChanged)?;

let committed_at = clock.now();
let outbox = ConversationOutboxRecord::from_scope_change(scope_change.clone(), visibility.visibility_scope_id, committed_at)?;
space_scope_repo.save_scope_bundle(ScopeMutationBundle::visibility_changed(visibility, scope_change), uow.clone()).await?;
projection_repo.save_projection_state(state, uow.clone()).await?;
outbox_repo.enqueue(outbox, uow.clone()).await?;
idempotency.complete(reservation, result_ref, uow.clone()).await?;
unit_of_work.commit(uow).await?;
```

##### 事务、错误、状态与测试

| 项 | 内容 |
|---|---|
| 事务边界 | visibility scope、projection stale marker、outbox 同事务 |
| 回滚错误 | invalid visibility rule、sealed scope、projection save failure、outbox failure |
| 状态副作用 | visibility scope version 递增;read model / cursor / reference projection stale |
| 事件副作用 | `ConversationScopeChangedEvent`、可选 `ConversationProjectionStateChangedEvent` |
| 测试切口 | visibility narrowed、sealed rejected、projection marked stale、outbox rollback |

#### 7.2.5 `AppendConversationFactFlow`

##### 入口与目标

| 项 | 内容 |
|---|---|
| 对应协议 | `AppendConversationFact` |
| 入口函数 | `handle_append_conversation_fact(AppendConversationFactRequest request) -> Result<FactAppendReceipt, ApiError>` |
| Application service | `ConversationFactAppendService.append_fact(...)` |
| 目标对象 | `ConversationFact`、`FactSourceRef`、`FactAppendPolicy`、`FactAppendReceipt`、`ConversationTraceContext`、`ConversationOutboxRecord` |

##### 函数级调用图

```text
[api::command_handlers]
  | call handle_append_conversation_fact(AppendConversationFactRequest request)
  v
[ConversationFactAppendService]
  | validate source and payload ref
  | tx begin
  | reserve idempotency
  | load space, participant scope, visibility scope
  | call FactAppendPolicy.assert_append_allowed(...)
  | call FactAppendPolicy.assert_fact_kind_allowed(...)
  | call ConversationFact::from_append_input(...)
  | call FactAppendReceipt::accepted(...)
  | call ConversationTraceContext::from_fact_append(...)
  v
[Repository + Outbox]
  | append fact and receipt
  | save trace context
  | enqueue fact appended outbox
  | complete idempotency
  | tx commit
```

##### 关键伪代码

```rust
// [AppendConversationFactRequest.validate()]
// 校验 space_id、source、payload_ref、actor、metadata 和 metadata.request.idempotency_key。
request.validate()?;
let key = request.metadata.request.idempotency_key.clone().ok_or(ProtocolError::MissingRequiredField)?;
let request_digest = RequestDigest::from_command(&request)?;

let uow = unit_of_work.begin().await?;
let reservation = idempotency.reserve(key.clone(), IdempotencyOperation::AppendConversationFact, request_digest.clone(), uow.clone()).await?;

// [SpaceScopeRepository.get_space_for_update(ConversationSpaceId space_id, UnitOfWorkHandle uow)]
let space = space_scope_repo.get_space_for_update(request.space_id, uow.clone()).await?.ok_or(ApplicationError::NotFound)?;
let participant = space_scope_repo.get_participant_scope(request.space_id).await?.ok_or(ApplicationError::NotFound)?;
let visibility = space_scope_repo.get_visibility_scope(request.space_id).await?.ok_or(ApplicationError::NotFound)?;
if let Some(requested_visibility_scope_id) = request.visibility_scope_id.clone() {
    if requested_visibility_scope_id != visibility.visibility_scope_id {
        return Err(ApplicationError::NotVisible);
    }
}

// [FactSourceRef::from_actor(ActorRef actor)]
// 根据 actor / runtime / bridge / system 来源创建可追溯 source ref。
let source = FactSourceRef::from_actor(request.actor.actor_ref);

// [FactAppendPolicy::for_space(&ConversationSpace space, &VisibilityScope visibility)]
let policy = FactAppendPolicy::for_space(&space, &visibility);
policy.assert_append_allowed(&space, &participant, &visibility)?;
policy.assert_fact_kind_allowed(request.fact_kind)?;

// [ConversationFact::from_append_input(&ConversationSpace space, ConversationFactKind fact_kind, FactSourceRef source, &VisibilityScope visibility, ConversationFactPayloadRef payload_ref)]
let fact = ConversationFact::from_append_input(&space, request.fact_kind, source, &visibility, request.payload_ref)?;

let committed_at = clock.now();

// [FactAppendReceipt::accepted(&ConversationFact fact, IdempotencyKey key, Timestamp recorded_at)]
let receipt = FactAppendReceipt::accepted(&fact, key.clone(), committed_at);

// [ConversationTraceContext::from_fact_append(&ConversationFact fact, &FactAppendReceipt receipt)]
let trace = ConversationTraceContext::from_fact_append(&fact, &receipt)?;
let outbox = ConversationOutboxRecord::from_fact_append(fact.clone(), receipt.clone(), committed_at)?;

fact_repo.append_fact(fact, receipt.clone(), uow.clone()).await?;
trace_repo.save_trace_context(trace, uow.clone()).await?;
outbox_repo.enqueue(outbox, uow.clone()).await?;
idempotency.complete(reservation, receipt.result_ref(), uow.clone()).await?;
unit_of_work.commit(uow).await?;
```

##### 事务、错误、状态与测试

| 项 | 内容 |
|---|---|
| 事务边界 | fact、receipt、trace context、outbox、幂等 complete 同事务 |
| 回滚错误 | forbidden payload、space cannot accept fact、participant missing、visibility reject、outbox failure |
| 状态副作用 | `ConversationFactState::Accepted`;trace context created;projection 后续 stale |
| 事件副作用 | `ConversationFactAppendedEvent`、`ConversationChangeAvailableEvent` |
| 测试切口 | append actor fact、policy rejected receipt、duplicate returns duplicate receipt、forbidden body rejected |

#### 7.2.6 `RetractConversationFactFlow`

##### 入口与目标

| 项 | 内容 |
|---|---|
| 对应协议 | `RetractConversationFact` |
| 入口函数 | `handle_retract_conversation_fact(RetractConversationFactRequest request) -> Result<FactAppendReceipt, ApiError>` |
| Application service | `ConversationFactAppendService.retract_fact(...)` |
| 目标对象 | `ConversationFact` state、`ConversationTraceContext`、`ConversationOutboxRecord` |

##### 函数级调用图

```text
[api::command_handlers]
  | call handle_retract_conversation_fact(RetractConversationFactRequest request)
  v
[ConversationFactAppendService]
  | validate fact_id, reason, actor, idempotency
  | tx begin
  | reserve idempotency
  | call ConversationFactRepository.get_fact_for_update(...)
  | call ConversationFact.retract(ActorRef actor, FactRetractionReason reason)
  v
[Repository + Outbox]
  | save updated fact
  | save trace context
  | enqueue fact retracted outbox
  | complete idempotency
  | tx commit
```

##### 关键伪代码

```rust
// [RetractConversationFactRequest.validate()]
request.validate()?;
let uow = unit_of_work.begin().await?;
let key = request.metadata.request.idempotency_key.clone().ok_or(ProtocolError::MissingRequiredField)?;
let request_digest = RequestDigest::from_command(&request)?;
let reservation = idempotency.reserve(key.clone(), IdempotencyOperation::RetractConversationFact, request_digest.clone(), uow.clone()).await?;

// [ConversationFactRepository.get_fact_for_update(ConversationFactId fact_id, UnitOfWorkHandle uow)]
let mut fact = fact_repo.get_fact_for_update(request.fact_id, uow.clone()).await?.ok_or(ApplicationError::NotFound)?;
if let Some(requested_visibility_scope_id) = request.visibility_scope_id.clone() {
    if requested_visibility_scope_id != fact.visibility_scope_id {
        return Err(ApplicationError::NotVisible);
    }
}

// [ConversationFact.retract(ActorRef actor, FactRetractionReason reason)]
fact.retract(request.actor.actor_ref, request.reason)?;

let committed_at = clock.now();

// [FactAppendReceipt::retracted(&ConversationFact fact, IdempotencyKey key, Timestamp recorded_at)]
// 撤回也必须保留 receipt 和 trace。
let receipt = FactAppendReceipt::retracted(&fact, key.clone(), committed_at);
let trace = ConversationTraceContext::from_fact_append(&fact, &receipt)?;
let outbox = ConversationOutboxRecord::from_fact_retraction(fact.clone(), receipt.clone(), committed_at)?;

fact_repo.save_fact_state(fact, uow.clone()).await?;
trace_repo.save_trace_context(trace, uow.clone()).await?;
outbox_repo.enqueue(outbox, uow.clone()).await?;
idempotency.complete(reservation, receipt.result_ref(), uow.clone()).await?;
unit_of_work.commit(uow).await?;
```

##### 事务、错误、状态与测试

| 项 | 内容 |
|---|---|
| 事务边界 | fact lock、state update、trace、outbox、幂等 complete 同事务 |
| 回滚错误 | fact not found、already terminal、actor not allowed、repository failure |
| 状态副作用 | `ConversationFactState::Retracted`;受限读取场景使用 `ConversationFactState::VisibilityRestricted` |
| 事件副作用 | `ConversationFactRetractedEvent`、`ConversationChangeAvailableEvent` |
| 测试切口 | retract committed fact、missing fact、double retract rejected / idempotent、trace retained |

#### 7.2.7 `ManifestExternalFactFlow`

##### 入口与目标

| 项 | 内容 |
|---|---|
| 对应协议 | `ManifestExternalFact` |
| 入口函数 | `handle_manifest_external_fact(ManifestExternalFactRequest request) -> Result<ManifestExternalFactResult, ApiError>` |
| Application service | `CrossDomainManifestationService.manifest_external_fact(...)` |
| 目标对象 | `ExternalFactRef`、`ExternalFactSnapshot`、`CrossDomainManifestation`、`ConversationFact`、`ConversationTraceContext`、`ConversationOutboxRecord` |

##### 函数级调用图

```text
[api::command_handlers]
  | call handle_manifest_external_fact(ManifestExternalFactRequest request)
  v
[CrossDomainManifestationService]
  | validate external ref and visibility
  | tx begin
  | reserve idempotency
  | load space and visibility scope
  | call ExternalFactResolverPort.load_safe_snapshot(...)
  | call CrossDomainManifestation::from_snapshot(...)
  | call ConversationFact::from_manifestation(...)
  v
[Repository + Outbox]
  | save snapshot, manifestation, fact, trace
  | enqueue manifestation changed outbox
  | complete idempotency
  | tx commit
```

##### 关键伪代码

```rust
// [ManifestExternalFactRequest.validate()]
request.validate()?;
let uow = unit_of_work.begin().await?;
let key = request.metadata.request.idempotency_key.clone().ok_or(ProtocolError::MissingRequiredField)?;
let request_digest = RequestDigest::from_command(&request)?;
let reservation = idempotency.reserve(key.clone(), IdempotencyOperation::ManifestExternalFact, request_digest.clone(), uow.clone()).await?;

let space = space_scope_repo.get_space_for_update(request.space_id, uow.clone()).await?.ok_or(ApplicationError::NotFound)?;
let visibility = space_scope_repo.get_visibility_scope(request.space_id).await?.ok_or(ApplicationError::NotFound)?;
if let Some(requested_visibility_scope_id) = request.visibility_scope_id.clone() {
    if requested_visibility_scope_id != visibility.visibility_scope_id {
        return Err(ApplicationError::NotVisible);
    }
}

// [ManifestationPolicy::default_policy()]
let policy = ManifestationPolicy::default_policy();
policy.assert_manifestable(&request.external_fact_ref, &space)?;

// [ExternalFactResolverPort.load_safe_snapshot(ExternalFactRef external_fact_ref, VisibilityScope visibility)]
// 只加载安全快照,不得复制来源正文。
let snapshot = external_resolver.load_safe_snapshot(request.external_fact_ref.clone(), visibility.clone()).await?;
policy.assert_snapshot_allowed(&snapshot, &visibility)?;

// [CrossDomainManifestation::from_snapshot(ExternalFactRef external_fact_ref, ExternalFactSnapshot snapshot, &VisibilityScope visibility)]
let manifestation = CrossDomainManifestation::from_snapshot(request.external_fact_ref, snapshot.clone(), &visibility)?;

// [ConversationFact::from_manifestation(CrossDomainManifestation manifestation, &VisibilityScope visibility)]
let fact = ConversationFact::from_manifestation(manifestation.clone(), &visibility)?;
let trace = ConversationTraceContext::from_manifestation(&manifestation)?;
let committed_at = clock.now();
let outbox = ConversationOutboxRecord::from_manifestation(manifestation.clone(), Some(fact.clone()), committed_at)?;

external_ref_repo.upsert_snapshot(snapshot, uow.clone()).await?;
manifestation_repo.insert_manifestation(manifestation, uow.clone()).await?;
fact_repo.append_fact(fact, FactAppendReceipt::accepted(&fact, key.clone(), clock.now()), uow.clone()).await?;
trace_repo.save_trace_context(trace, uow.clone()).await?;
outbox_repo.enqueue(outbox, uow.clone()).await?;
idempotency.complete(reservation, result_ref, uow.clone()).await?;
unit_of_work.commit(uow).await?;
```

##### 事务、错误、状态与测试

| 项 | 内容 |
|---|---|
| 事务边界 | snapshot、manifestation、optional fact、trace、outbox 同事务 |
| 回滚错误 | unsupported source、resolver failure、snapshot forbidden、visibility reject、repository failure |
| 状态副作用 | `ManifestationState::Manifested` 或 unresolved marker;fact committed if manifestable |
| 事件副作用 | `CrossDomainManifestationChangedEvent`、可选 `ConversationFactAppendedEvent` |
| 测试切口 | manifest safe snapshot、resolver unresolved、source body not stored、visibility reject |

#### 7.2.8 `CreateReviewAnchorFlow`

##### 入口与目标

| 项 | 内容 |
|---|---|
| 对应协议 | `CreateReviewAnchor` |
| 入口函数 | `handle_create_review_anchor(CreateReviewAnchorRequest request) -> Result<ReviewAnchorCommandResult, ApiError>` |
| Application service | `ConversationTraceReviewService.create_review_anchor(...)` |
| 目标对象 | `ReviewAnchor`、`ConversationTraceContext`、`ConversationOutboxRecord` |

##### 函数级调用图

```text
[api::command_handlers]
  | call handle_create_review_anchor(CreateReviewAnchorRequest request)
  v
[ConversationTraceReviewService]
  | validate target and reason
  | tx begin
  | reserve idempotency
  | load target fact / manifestation / scope change
  | call ReviewAnchor::for_fact(...) or for_manifestation(...) or for_scope_change(...)
  | call VisibilityPolicy.assert_review_allowed(...)
  v
[Repository + Outbox]
  | save review anchor
  | enqueue review / scope related outbox
  | complete idempotency
  | tx commit
```

##### 关键伪代码

```rust
// [CreateReviewAnchorRequest.validate()]
request.validate()?;
let uow = unit_of_work.begin().await?;
let key = request.metadata.request.idempotency_key.clone().ok_or(ProtocolError::MissingRequiredField)?;
let request_digest = RequestDigest::from_command(&request)?;
let reservation = idempotency.reserve(key.clone(), IdempotencyOperation::CreateReviewAnchor, request_digest.clone(), uow.clone()).await?;

// [ReviewAnchor::for_fact(&ConversationFact fact, ActorRef actor, ReviewReasonRef reason_ref)]
// 根据 target_kind 选择 fact、manifestation 或 scope change 工厂。
let anchor = match request.target {
    ReviewTarget::Fact(fact_id) => ReviewAnchor::for_fact(&fact_repo.get_fact(fact_id).await?.ok_or(ApplicationError::NotFound)?, request.actor.actor_ref, request.reason_ref)?,
    ReviewTarget::Manifestation(manifestation_id) => ReviewAnchor::for_manifestation(&manifestation_repo.get_manifestation(manifestation_id).await?.ok_or(ApplicationError::NotFound)?, request.actor.actor_ref, request.reason_ref)?,
    ReviewTarget::ScopeChange(change) => ReviewAnchor::for_scope_change(&change, request.actor.actor_ref, request.reason_ref)?,
};

// [VisibilityPolicy.assert_review_allowed(&ReviewAnchor anchor, ActorRef actor)]
VisibilityPolicy::default_policy().assert_review_allowed(&anchor, request.actor.actor_ref)?;

// [TraceRepository.save_review_anchor(ReviewAnchor review_anchor, UnitOfWorkHandle uow)]
trace_repo.save_review_anchor(anchor.clone(), uow.clone()).await?;
let visibility = space_scope_repo.get_visibility_scope(request.space_id).await?.ok_or(ApplicationError::NotFound)?;
let committed_at = clock.now();
let outbox = ConversationOutboxRecord::from_review_anchor(anchor.clone(), visibility.visibility_scope_id, committed_at)?;
outbox_repo.enqueue(outbox, uow.clone()).await?;
idempotency.complete(reservation, anchor.result_ref(), uow.clone()).await?;
unit_of_work.commit(uow).await?;
```

##### 事务、错误、状态与测试

| 项 | 内容 |
|---|---|
| 事务边界 | anchor 保存、outbox 和幂等 complete 同事务 |
| 回滚错误 | target not found、review not allowed、repository failure、outbox failure |
| 状态副作用 | 新增 review anchor;不改变治理裁决或事实状态 |
| 事件副作用 | review anchor 可通过 `ConversationChangeAvailableEvent` 通知 |
| 测试切口 | anchor fact、anchor manifestation、not visible rejected、target missing |

#### 7.2.9 `RequestTraceHandoffFlow`

##### 入口与目标

| 项 | 内容 |
|---|---|
| 对应协议 | `RequestTraceHandoff` |
| 入口函数 | `handle_request_trace_handoff(RequestTraceHandoffRequest request) -> Result<TraceHandoffCommandResult, ApiError>` |
| Application service | `ConversationTraceReviewService.request_trace_handoff(...)` |
| 目标对象 | `TraceHandoffRecord`、`ConversationOutboxRecord` |

##### 函数级调用图

```text
[api::command_handlers]
  | call handle_request_trace_handoff(RequestTraceHandoffRequest request)
  v
[ConversationTraceReviewService]
  | validate destination and trace context
  | tx begin
  | reserve idempotency
  | load trace context
  | call TraceRetentionPolicy.assert_retention_allowed(...)
  | call TraceHandoffRecord::from_trace_context(...)
  v
[Repository + Outbox]
  | save trace handoff
  | enqueue trace handoff requested outbox
  | complete idempotency
  | tx commit
```

##### 关键伪代码

```rust
request.validate()?;
let uow = unit_of_work.begin().await?;
let key = request.metadata.request.idempotency_key.clone().ok_or(ProtocolError::MissingRequiredField)?;
let request_digest = RequestDigest::from_command(&request)?;
let reservation = idempotency.reserve(key.clone(), IdempotencyOperation::RequestTraceHandoff, request_digest.clone(), uow.clone()).await?;

// [TraceRepository.get_trace_context(ConversationTraceContextId trace_context_id)]
let trace_context = trace_repo.get_trace_context(request.trace_context_id).await?.ok_or(ApplicationError::NotFound)?;

// [TraceRetentionPolicy::default_policy()]
let policy = TraceRetentionPolicy::default_policy();
policy.assert_retention_allowed(&trace_context)?;

// [TraceHandoffRecord::from_trace_context(&ConversationTraceContext trace_context, ObservabilityDestinationRef destination_ref)]
let handoff = TraceHandoffRecord::from_trace_context(&trace_context, request.destination_ref)?;
let visibility = space_scope_repo.get_visibility_scope(trace_context.space_id).await?.ok_or(ApplicationError::NotFound)?;
let committed_at = clock.now();
let outbox = ConversationOutboxRecord::from_trace_handoff(handoff.clone(), trace_context.space_id, visibility.visibility_scope_id, committed_at)?;

trace_repo.save_trace_handoff(handoff.clone(), uow.clone()).await?;
outbox_repo.enqueue(outbox, uow.clone()).await?;
idempotency.complete(reservation, handoff.result_ref(), uow.clone()).await?;
unit_of_work.commit(uow).await?;
```

##### 事务、错误、状态与测试

| 项 | 内容 |
|---|---|
| 事务边界 | handoff intent 与 outbox 同事务;实际外部交付不在本 Command 内 |
| 回滚错误 | trace missing、retention reject、payload forbidden、outbox failure |
| 状态副作用 | `TraceHandoffState::Pending` |
| 事件副作用 | `TraceHandoffRequestedEvent` |
| 测试切口 | request handoff、missing trace、retention denied、duplicate idempotent |

#### 7.2.10 `RequestArchiveHandoffFlow`

##### 入口与目标

| 项 | 内容 |
|---|---|
| 对应协议 | `RequestArchiveHandoff` |
| 入口函数 | `handle_request_archive_handoff(RequestArchiveHandoffRequest request) -> Result<ArchiveHandoffCommandResult, ApiError>` |
| Application service | `ConversationTraceReviewService.request_archive_handoff(...)` |
| 目标对象 | `ArchiveHandoffRecord`、`ConversationOutboxRecord` |

##### 函数级调用图

```text
[api::command_handlers]
  | call handle_request_archive_handoff(RequestArchiveHandoffRequest request)
  v
[ConversationTraceReviewService]
  | validate archive scope and retention policy
  | tx begin
  | reserve idempotency
  | load trace context or space
  | call TraceRetentionPolicy.choose_archive_scope(...)
  | call ArchiveHandoffRecord::from_trace_context(...) or from_space_close(...)
  v
[Repository + Outbox]
  | save archive handoff
  | enqueue archive handoff requested outbox
  | complete idempotency
  | tx commit
```

##### 关键伪代码

```rust
request.validate()?;
let uow = unit_of_work.begin().await?;
let key = request.metadata.request.idempotency_key.clone().ok_or(ProtocolError::MissingRequiredField)?;
let request_digest = RequestDigest::from_command(&request)?;
let reservation = idempotency.reserve(key.clone(), IdempotencyOperation::RequestArchiveHandoff, request_digest.clone(), uow.clone()).await?;

let trace_context = trace_repo.get_trace_context(request.trace_context_id).await?.ok_or(ApplicationError::NotFound)?;
let space = space_scope_repo.get_space_for_update(request.space_id, uow.clone()).await?.ok_or(ApplicationError::NotFound)?;

// [TraceRetentionPolicy::default_policy()]
let policy = TraceRetentionPolicy::default_policy();
let archive_scope = policy.choose_archive_scope(&space, &trace_context);

// [ArchiveHandoffRecord::from_trace_context(&ConversationTraceContext trace_context, ArchiveScope archive_scope, TraceRetentionPolicyRef retention_policy_ref)]
let handoff = ArchiveHandoffRecord::from_trace_context(&trace_context, archive_scope, request.retention_policy_ref)?;
let visibility = space_scope_repo.get_visibility_scope(request.space_id).await?.ok_or(ApplicationError::NotFound)?;
let committed_at = clock.now();
let outbox = ConversationOutboxRecord::from_archive_handoff(handoff.clone(), visibility.visibility_scope_id, committed_at)?;

trace_repo.save_archive_handoff(handoff.clone(), uow.clone()).await?;
outbox_repo.enqueue(outbox, uow.clone()).await?;
idempotency.complete(reservation, handoff.result_ref(), uow.clone()).await?;
unit_of_work.commit(uow).await?;
```

##### 事务、错误、状态与测试

| 项 | 内容 |
|---|---|
| 事务边界 | archive handoff intent 与 outbox 同事务;archive package 由 job 后续交付 |
| 回滚错误 | trace / space missing、archive scope invalid、retention policy missing、outbox failure |
| 状态副作用 | `ArchiveHandoffState::Pending` |
| 事件副作用 | `ArchiveHandoffRequestedEvent` |
| 测试切口 | request archive handoff、invalid scope rejected、package ref absent while pending、duplicate idempotent |

### 7.3 Query API 处理流

#### 7.3.1 `GetConversationReadModelFlow`

##### 入口与目标

| 项 | 内容 |
|---|---|
| 对应协议 | `GetConversationReadModel` |
| 入口函数 | `handle_get_conversation_read_model(GetConversationReadModelRequest request, ConsumerContext consumer_context, QueryMetadata metadata) -> Result<ConversationReadModelView, ApiError>` |
| Application service | `AuthorizedConversationQueryService.get_read_model(request, consumer_context, metadata)` |
| 读取对象 | `ConversationReadModel`、`VisibilityScope`、`ConversationProjectionState` |

##### 函数级调用图

```text
[api::query_handlers]
  | call handle_get_conversation_read_model(GetConversationReadModelRequest request, ConsumerContext consumer_context, QueryMetadata metadata)
  v
[AuthorizedConversationQueryService]
  | validate query metadata and consumer
  | call ProjectionRepository.get_read_model(...)
  | call SpaceScopeRepository.get_visibility_scope(...)
  | call VisibilityPolicy.filter_read_model(...)
  v
[Result Builder]
  | return authorized read model with freshness marker
```

##### 关键伪代码

```rust
// [GetConversationReadModelRequest.validate()]
request.validate()?;

// [ConsumerContext.resolve_consumer(GetConversationReadModelRequest request)]
let consumer_ref = request.resolve_consumer(consumer_context)?;

// [ProjectionRepository.get_read_model(ConversationSpaceId space_id, ConsumerRef consumer)]
let read_model = projection_repo.get_read_model(request.space_id, consumer_ref).await?;

// ProjectionRepository returns domain::ConversationReadModel, not contracts::ConversationReadModelView.
// If the row is missing, the service constructs an internal empty read model before DTO mapping.

// [SpaceScopeRepository.get_visibility_scope(ConversationSpaceId space_id)]
let visibility = space_scope_repo.get_visibility_scope(request.space_id).await?.ok_or(ApplicationError::NotFound)?;

// [VisibilityPolicy.filter_read_model(ConversationReadModel read_model, ConsumerRef consumer)]
let authorized = VisibilityPolicy::default_policy().filter_read_model(read_model.unwrap_or_else(|| ConversationReadModel::empty_for_consumer(request.space_id, consumer_ref)), consumer_ref)?;

// [ProjectionRepository.get_projection_state(ConversationSpaceId space_id, ConversationProjectionKind kind)]
let state = projection_repo.get_projection_state(request.space_id, ConversationProjectionKind::ReadModel).await?;
Ok(ConversationReadModelView::from_authorized(authorized, state, visibility, request.space_id, consumer_ref))
```

##### 事务、错误、状态与测试

| 项 | 内容 |
|---|---|
| 事务边界 | 只读,不开写事务 |
| 错误映射 | invalid consumer -> `ProtocolError`;visibility missing -> `NotFound`;not visible -> empty authorized view |
| 状态副作用 | 无 |
| 事件副作用 | 无;可选 read audit 不属于 truth |
| 测试切口 | authorized read、empty read model、stale projection marker、not visible filtered |

#### 7.3.2 `ListConversationFactsFlow`

##### 入口与目标

| 项 | 内容 |
|---|---|
| 对应协议 | `ListConversationFacts` |
| 入口函数 | `handle_list_conversation_facts(ListConversationFactsRequest request, ConsumerContext consumer_context, QueryMetadata metadata) -> Result<ConversationFactPage, ApiError>` |
| Application service | `AuthorizedConversationQueryService.list_facts(request, consumer_context, metadata)` |
| 读取对象 | `ConversationFactRepository` fact refs、`VisibilityScope`、`VisibilityPolicy` |

##### 函数级调用图

```text
[api::query_handlers]
  | call handle_list_conversation_facts(ListConversationFactsRequest request, ConsumerContext consumer_context, QueryMetadata metadata)
  v
[AuthorizedConversationQueryService]
  | validate page and consumer
  | call ConversationFactRepository.list_fact_refs(...)
  | load each fact if needed
  | call VisibilityPolicy.assert_can_read(...)
  v
[Result Builder]
  | return visible page only
```

##### 关键伪代码

```rust
request.validate()?;

// [ConsumerContext.resolve_consumer(ListConversationFactsRequest request)]
let consumer_ref = request.resolve_consumer(consumer_context)?;

// [QueryMetadata.page_or_default()]
let page = metadata.page.clone().unwrap_or_else(default_fact_page_request);

// [ConversationFactRepository.list_fact_refs(ConversationSpaceId space_id, PageRequest page)]
let refs = fact_repo.list_fact_refs(request.space_id, page).await?;

// [SpaceScopeRepository.get_visibility_scope(ConversationSpaceId space_id)]
let visibility = space_scope_repo.get_visibility_scope(request.space_id).await?.ok_or(ApplicationError::NotFound)?;
let policy = VisibilityPolicy::default_policy();

let mut visible = Vec::new();
for fact_ref in refs.items {
    // [ConversationFactRepository.get_fact(ConversationFactId fact_id)]
    let fact = fact_repo.get_fact(fact_ref.fact_id).await?.ok_or(ApplicationError::NotFound)?;
    if policy.assert_can_read(consumer_ref, &fact, &visibility).is_ok() {
        visible.push(ConversationFactView::from_fact(fact, request.include_retracted)?);
    }
}
let state = projection_repo.get_projection_state(request.space_id, ConversationProjectionKind::ReadModel).await?;
// refs.page_info is application::ports::PageInfo; map it to the public page fields.
Ok(ConversationFactPage::from_visible(request.space_id, consumer_ref, visible, refs.page_info, state))
```

##### 事务、错误、状态与测试

| 项 | 内容 |
|---|---|
| 事务边界 | 只读 |
| 错误映射 | invalid page -> `ProtocolError`;repository failure -> `RepositoryError`;not visible facts filtered |
| 状态副作用 | 无 |
| 事件副作用 | 无 |
| 测试切口 | page success、invisible facts filtered、invalid page rejected、repository failure mapped |

#### 7.3.3 `GetConversationFactFlow`

##### 入口与目标

| 项 | 内容 |
|---|---|
| 对应协议 | `GetConversationFact` |
| 入口函数 | `handle_get_conversation_fact(GetConversationFactRequest request) -> Result<ConversationFactView, ApiError>` |
| Application service | `AuthorizedConversationQueryService.get_fact(...)` |
| 读取对象 | `ConversationFact`、`VisibilityScope`、`ExternalFactSnapshot` |

##### 函数级调用图

```text
[api::query_handlers]
  | call handle_get_conversation_fact(GetConversationFactRequest request)
  v
[AuthorizedConversationQueryService]
  | validate fact id and consumer
  | call ConversationFactRepository.get_fact(...)
  | call VisibilityPolicy.assert_can_read(...)
  | optional load external snapshot marker
  v
[Result Builder]
  | return visible fact view
```

##### 关键伪代码

```rust
request.validate()?;

// [ConversationFactRepository.get_fact(ConversationFactId fact_id)]
let fact = fact_repo.get_fact(request.fact_id).await?.ok_or(ApplicationError::NotFound)?;

// [SpaceScopeRepository.get_visibility_scope(ConversationSpaceId space_id)]
let visibility = space_scope_repo.get_visibility_scope(fact.space_id).await?.ok_or(ApplicationError::NotFound)?;

// [VisibilityPolicy.assert_can_read(ConsumerRef consumer, &ConversationFact fact, &VisibilityScope visibility)]
VisibilityPolicy::default_policy().assert_can_read(request.consumer_ref, &fact, &visibility)?;

Ok(ConversationFactView::from_fact(fact))
```

##### 事务、错误、状态与测试

| 项 | 内容 |
|---|---|
| 事务边界 | 只读 |
| 错误映射 | fact missing -> `NotFound`;not visible -> `NotVisible`;repository failure -> `RepositoryError` |
| 状态副作用 | 无 |
| 事件副作用 | 无 |
| 测试切口 | visible fact、not visible rejected、missing fact、retracted fact marker |

#### 7.3.4 `GetConversationChangeCursorFlow`

##### 入口与目标

| 项 | 内容 |
|---|---|
| 对应协议 | `GetConversationChangeCursor` |
| 入口函数 | `handle_get_conversation_change_cursor(GetConversationChangeCursorRequest request) -> Result<ConversationChangeCursorView, ApiError>` |
| Application service | `AuthorizedConversationQueryService.get_change_cursor(...)` |
| 读取对象 | `ConversationChangeCursor`、`ConversationProjectionState` |

##### 函数级调用图

```text
[api::query_handlers]
  | call handle_get_conversation_change_cursor(GetConversationChangeCursorRequest request)
  v
[AuthorizedConversationQueryService]
  | validate consumer and cursor request
  | call ProjectionRepository.get_change_cursor(...)
  | call ProjectionRepository.get_projection_state(...)
  v
[Result Builder]
  | return cursor with freshness marker
```

##### 关键伪代码

```rust
request.validate()?;

// [ProjectionRepository.get_change_cursor(ConversationSpaceId space_id, ConsumerRef consumer)]
let cursor = projection_repo.get_change_cursor(request.space_id, request.consumer_ref).await?;

let initial_sequence = request.from_sequence.unwrap_or(ConversationFactSequence(0));

// [ConversationChangeCursor::start_from(ConversationSpaceId space_id, ConsumerRef consumer, ConversationFactSequence sequence)]
let cursor = cursor.unwrap_or_else(|| ConversationChangeCursor::start_from(request.space_id, request.consumer_ref, initial_sequence));

// [ProjectionRepository.get_projection_state(ConversationSpaceId space_id, ConversationProjectionKind kind)]
let state = projection_repo.get_projection_state(request.space_id, ConversationProjectionKind::ChangeCursor).await?;
Ok(ConversationChangeCursorView::from_cursor(cursor, ConversationProjectionStateView::from_state_or_empty(request.space_id, ConversationProjectionKind::ChangeCursor, state)))
```

##### 事务、错误、状态与测试

| 项 | 内容 |
|---|---|
| 事务边界 | 只读;不会推进 cursor |
| 错误映射 | invalid sequence -> `ProtocolError`;repository failure -> `RepositoryError` |
| 状态副作用 | 无 |
| 事件副作用 | 无 |
| 测试切口 | existing cursor、initial cursor、stale projection marker、invalid sequence |

#### 7.3.5 `PollConversationChangesFlow`

##### 入口与目标

| 项 | 内容 |
|---|---|
| 对应协议 | `PollConversationChanges` |
| 入口函数 | `handle_poll_conversation_changes(PollConversationChangesRequest request) -> Result<ConversationChangePage, ApiError>` |
| Application service | `AuthorizedConversationQueryService.poll_changes(...)` |
| 读取对象 | `ConversationChangeCursor`、`ChangeCursorProjection`、`ConversationChangeCursorEntry`、`VisibilityScope` |

##### 函数级调用图

```text
[api::query_handlers]
  | call handle_poll_conversation_changes(PollConversationChangesRequest request)
  v
[AuthorizedConversationQueryService]
  | validate cursor, page, consumer
  | load cursor and visibility scope
  | read persisted change cursor projection entries after cursor
  | filter by visibility
  v
[Result Builder]
  | return change page and next cursor token
```

##### 关键伪代码

```rust
request.validate()?;

// [ProjectionRepository.get_change_cursor(ConversationSpaceId space_id, ConsumerRef consumer)]
let cursor = projection_repo.get_change_cursor(request.space_id, request.consumer_ref).await?.ok_or(ApplicationError::NotFound)?;

// [SpaceScopeRepository.get_visibility_scope(ConversationSpaceId space_id)]
let visibility = space_scope_repo.get_visibility_scope(request.space_id).await?.ok_or(ApplicationError::NotFound)?;

// [ProjectionRepository.list_change_entries_after(ConversationSpaceId space_id, ConversationOutboxSequence after, PageLimit limit)]
// P0 用 change cursor projection 提供变化引用,不返回完整 payload。
let changes = projection_repo.list_change_entries_after(request.space_id, cursor.last_outbox_sequence, request.limit).await?;
let visible = filter_visible_changes(changes, &visibility, request.consumer_ref)?;
let state = projection_repo.get_projection_state(request.space_id, ConversationProjectionKind::ChangeCursor).await?;
Ok(ConversationChangePage::from_visible(
    visible,
    cursor,
    ConversationProjectionStateView::from_state_or_empty(request.space_id, ConversationProjectionKind::ChangeCursor, state),
    request.limit,
))
```

##### 事务、错误、状态与测试

| 项 | 内容 |
|---|---|
| 事务边界 | 只读;不推进 cursor,推进由 job 维护 |
| 错误映射 | cursor missing -> `NotFound`;invalid token -> `ProtocolError`;repository failure -> `RepositoryError` |
| 状态副作用 | 无 |
| 事件副作用 | 无 |
| 测试切口 | changes visible、empty page、invalid cursor、visibility filter |

#### 7.3.6 `SearchConversationHistoryFlow`

##### 入口与目标

| 项 | 内容 |
|---|---|
| 对应协议 | `SearchConversationHistory` |
| 入口函数 | `handle_search_conversation_history(SearchConversationHistoryRequest request, ConsumerContext consumer_context, QueryMetadata metadata) -> Result<ConversationSearchResultPage, ApiError>` |
| Application service | `AuthorizedConversationQueryService.search_history(request, consumer_context, metadata)` |
| 读取对象 | `SearchIndexProjection`、`ConversationReadModel`、`VisibilityScope` |

##### 函数级调用图

```text
[api::query_handlers]
  | call handle_search_conversation_history(SearchConversationHistoryRequest request, ConsumerContext consumer_context, QueryMetadata metadata)
  v
[AuthorizedConversationQueryService]
  | validate query text and page
  | call ProjectionRepository.get_search_projection(...)
  | call ProjectionRepository.get_read_model(...)
  | filter search hits through authorized read model
  v
[Result Builder]
  | return fact / manifestation refs only
```

##### 关键伪代码

```rust
request.validate()?;

let consumer_ref = request.resolve_consumer(consumer_context)?;
let page = metadata.page.clone().unwrap_or_else(default_search_page_request);

// [ProjectionRepository.get_search_projection(ConversationSpaceId space_id)]
let search_projection = projection_repo.get_search_projection(request.space_id).await?;

// [ProjectionRepository.get_read_model(ConversationSpaceId space_id, ConsumerRef consumer)]
let read_model = projection_repo.get_read_model(request.space_id, consumer_ref).await?;

// [DerivedViewPolicy.choose_degraded_read(&ConversationProjectionState projection_state)]
// stale / failed 搜索投影必须返回显式 marker,不得伪装 fresh。
let results = search_index.search(search_projection, request.query_text, page).await?;
let authorized = authorize_search_hits(results, read_model, consumer_ref)?;
let state = projection_repo.get_projection_state(request.space_id, ConversationProjectionKind::Search).await?;
Ok(ConversationSearchResultPage::from_authorized(
    request.space_id,
    consumer_ref,
    request.query_text,
    authorized,
    ConversationProjectionStateView::from_state_or_empty(request.space_id, ConversationProjectionKind::Search, state),
))
```

##### 事务、错误、状态与测试

| 项 | 内容 |
|---|---|
| 事务边界 | 只读 |
| 错误映射 | invalid query -> `ProtocolError`;stale index -> degraded marker;repository failure -> `RepositoryError` |
| 状态副作用 | 无 |
| 事件副作用 | 无 |
| 测试切口 | search success、stale index marker、invisible hit filtered、empty search |

#### 7.3.7 `GetCrossDomainManifestationFlow`

##### 入口与目标

| 项 | 内容 |
|---|---|
| 对应协议 | `GetCrossDomainManifestation` |
| 入口函数 | `handle_get_cross_domain_manifestation(GetCrossDomainManifestationRequest request) -> Result<CrossDomainManifestationView, ApiError>` |
| Application service | `AuthorizedConversationQueryService.get_manifestation(...)` |
| 读取对象 | `CrossDomainManifestation`、`ExternalFactSnapshot`、`VisibilityScope` |

##### 函数级调用图

```text
[api::query_handlers]
  | call handle_get_cross_domain_manifestation(GetCrossDomainManifestationRequest request)
  v
[AuthorizedConversationQueryService]
  | validate manifestation id and consumer
  | call ManifestationRepository.get_manifestation(...)
  | call VisibilityPolicy through manifestation.visible_to(...)
  | optional call ExternalReferenceRepository.get_snapshot(...)
  v
[Result Builder]
  | return safe manifestation view
```

##### 关键伪代码

```rust
request.validate()?;

// [ManifestationRepository.get_manifestation(CrossDomainManifestationId manifestation_id)]
let manifestation = manifestation_repo.get_manifestation(request.manifestation_id).await?.ok_or(ApplicationError::NotFound)?;

// [SpaceScopeRepository.get_visibility_scope(ConversationSpaceId space_id)]
let visibility = space_scope_repo.get_visibility_scope(manifestation.space_id).await?.ok_or(ApplicationError::NotFound)?;

// [CrossDomainManifestation.visible_to(ConsumerRef consumer, &VisibilityPolicy policy)]
if !manifestation.visible_to(request.consumer_ref, &VisibilityPolicy::default_policy()) {
    return Err(ApplicationError::NotVisible.into());
}

// [ExternalReferenceRepository.get_snapshot(ExternalFactSnapshotId snapshot_id)]
let snapshot = load_optional_safe_snapshot(&external_ref_repo, manifestation.snapshot_ref).await?;
Ok(CrossDomainManifestationView::from_safe_parts(manifestation, snapshot, visibility))
```

##### 事务、错误、状态与测试

| 项 | 内容 |
|---|---|
| 事务边界 | 只读 |
| 错误映射 | manifestation missing -> `NotFound`;not visible -> `NotVisible`;snapshot missing -> unresolved marker |
| 状态副作用 | 无 |
| 事件副作用 | 无 |
| 测试切口 | visible manifestation、unresolved snapshot marker、revoked marker、not visible rejected |

#### 7.3.8 `GetConversationTraceContextFlow`

##### 入口与目标

| 项 | 内容 |
|---|---|
| 对应协议 | `GetConversationTraceContext` |
| 入口函数 | `handle_get_conversation_trace_context(GetConversationTraceContextRequest request) -> Result<ConversationTraceContextView, ApiError>` |
| Application service | `ConversationTraceReviewService.get_trace_context(...)` |
| 读取对象 | `ConversationTraceContext`、`VisibilityPolicy` |

##### 函数级调用图

```text
[api::query_handlers]
  | call handle_get_conversation_trace_context(GetConversationTraceContextRequest request)
  v
[ConversationTraceReviewService]
  | validate trace id and actor
  | call TraceRepository.get_trace_context(...)
  | check retention and visibility
  v
[Result Builder]
  | return ref-only trace view
```

##### 关键伪代码

```rust
request.validate()?;

// [TraceRepository.get_trace_context(ConversationTraceContextId trace_context_id)]
let trace_context = trace_repo.get_trace_context(request.trace_context_id).await?.ok_or(ApplicationError::NotFound)?;

// [TraceRetentionPolicy::default_policy()]
let retention = TraceRetentionPolicy::default_policy();
retention.assert_retention_allowed(&trace_context)?;

// [VisibilityPolicy.default_policy()]
// trace 输出只包含引用和摘要 marker,不得输出隐藏事实正文。
let view = ConversationTraceContextView::from_ref_only(trace_context, request.actor_ref)?;
Ok(view)
```

##### 事务、错误、状态与测试

| 项 | 内容 |
|---|---|
| 事务边界 | 只读 |
| 错误映射 | trace missing -> `NotFound`;retention expired -> expired marker;actor not allowed -> `NotVisible` |
| 状态副作用 | 无 |
| 事件副作用 | 无 |
| 测试切口 | trace visible、expired trace marker、hidden fact not leaked、missing trace |

#### 7.3.9 `GetReviewAnchorFlow`

##### 入口与目标

| 项 | 内容 |
|---|---|
| 对应协议 | `GetReviewAnchor` |
| 入口函数 | `handle_get_review_anchor(GetReviewAnchorRequest request) -> Result<ReviewAnchorView, ApiError>` |
| Application service | `ConversationTraceReviewService.get_review_anchor(...)` |
| 读取对象 | `ReviewAnchor`、`ConversationTraceContext`、`VisibilityPolicy` |

##### 函数级调用图

```text
[api::query_handlers]
  | call handle_get_review_anchor(GetReviewAnchorRequest request)
  v
[ConversationTraceReviewService]
  | validate anchor id and actor
  | call TraceRepository.get_review_anchor(...)
  | call VisibilityPolicy.assert_review_allowed(...)
  v
[Result Builder]
  | return review anchor view
```

##### 关键伪代码

```rust
request.validate()?;

// [TraceRepository.get_review_anchor(ReviewAnchorId review_anchor_id)]
let anchor = trace_repo.get_review_anchor(request.review_anchor_id).await?.ok_or(ApplicationError::NotFound)?;

// [VisibilityPolicy.assert_review_allowed(&ReviewAnchor anchor, ActorRef actor)]
VisibilityPolicy::default_policy().assert_review_allowed(&anchor, request.actor_ref)?;

Ok(ReviewAnchorView::from_anchor(anchor))
```

##### 事务、错误、状态与测试

| 项 | 内容 |
|---|---|
| 事务边界 | 只读 |
| 错误映射 | anchor missing -> `NotFound`;review not allowed -> `NotVisible` |
| 状态副作用 | 无 |
| 事件副作用 | 无 |
| 测试切口 | anchor visible、hidden target rejected、missing anchor、anchor does not expose governance body |

#### 7.3.10 `GetConversationProjectionStateFlow`

##### 入口与目标

| 项 | 内容 |
|---|---|
| 对应协议 | `GetConversationProjectionState` |
| 入口函数 | `handle_get_conversation_projection_state(GetConversationProjectionStateRequest request, ActorContext actor, QueryMetadata metadata) -> Result<ConversationProjectionStateView, ApiError>` |
| Application service | `ConversationDerivedMaintenanceService.get_projection_state(request, actor, metadata)` |
| 读取对象 | `ConversationProjectionState` |

##### 函数级调用图

```text
[api::query_handlers]
  | call handle_get_conversation_projection_state(GetConversationProjectionStateRequest request, ActorContext actor, QueryMetadata metadata)
  v
[ConversationDerivedMaintenanceService]
  | validate projection kind and actor
  | call ProjectionRepository.get_projection_state(...)
  v
[Result Builder]
  | return freshness / error marker
```

##### 关键伪代码

```rust
request.validate()?;

// [ProjectionRepository.get_projection_state(ConversationSpaceId space_id, ConversationProjectionKind kind)]
let state = projection_repo.get_projection_state(request.space_id, request.projection_kind).await?;

Ok(ConversationProjectionStateView::from_state_or_empty(request.space_id, request.projection_kind, state))
```

##### 事务、错误、状态与测试

| 项 | 内容 |
|---|---|
| 事务边界 | 只读 |
| 错误映射 | invalid projection kind -> `ProtocolError`;missing state -> empty state marker |
| 状态副作用 | 无 |
| 事件副作用 | 无 |
| 测试切口 | fresh state、stale state、failed state、missing state marker |

#### 7.3.11 `GetExternalReferenceProjectionFlow`

##### 入口与目标

| 项 | 内容 |
|---|---|
| 对应协议 | `GetExternalReferenceProjection` |
| 入口函数 | `handle_get_external_reference_projection(GetExternalReferenceProjectionRequest request) -> Result<ExternalReferenceProjectionView, ApiError>` |
| Application service | `AuthorizedConversationQueryService.get_external_reference_projection(...)` |
| 读取对象 | `ExternalReferenceProjection`、`ExternalFactSnapshot`、`ReferenceResolutionState` |

##### 函数级调用图

```text
[api::query_handlers]
  | call handle_get_external_reference_projection(GetExternalReferenceProjectionRequest request)
  v
[AuthorizedConversationQueryService]
  | validate space and consumer
  | call ExternalReferenceRepository.get_reference_projection(...)
  | filter refs by visibility
  | attach unresolved / stale markers
  v
[Result Builder]
  | return ref-only projection view
```

##### 关键伪代码

```rust
request.validate()?;

// [ExternalReferenceRepository.get_reference_projection(ConversationSpaceId space_id)]
let projection = external_ref_repo.get_reference_projection(request.space_id).await?;

// [ExternalReferenceProjection::for_space(ConversationSpaceId space_id)]
let projection = projection.unwrap_or_else(|| ExternalReferenceProjection::for_space(request.space_id));

// [ReferenceValidityPolicy::default_policy()]
// 输出 ref、snapshot ref 和 resolution marker,不拉取来源正文。
let view = ExternalReferenceProjectionView::from_projection(projection, request.include_unresolved, ReferenceValidityPolicy::default_policy())?;
Ok(view)
```

##### 事务、错误、状态与测试

| 项 | 内容 |
|---|---|
| 事务边界 | 只读 |
| 错误映射 | repository failure -> `RepositoryError`;hidden refs filtered;unresolved refs return marker |
| 状态副作用 | 无 |
| 事件副作用 | 无 |
| 测试切口 | ref projection visible、include unresolved、empty projection、no source body loaded |

### 7.4 Inbound Event Consumer 处理流

#### 7.4.1 `ConsumeWorkContextChangedFlow`

##### 入口与目标

| 项 | 内容 |
|---|---|
| 对应协议 | `ConsumeWorkContextChanged` |
| 入口函数 | `consume_work_context_changed(InboundEventEnvelope<WorkContextChangedEvent> event) -> Result<ConsumerReceipt, ConsumerError>` |
| Application service | `ExternalReferenceIngestionService.consume_work_context_changed(...)` |
| 目标对象 | `ExternalFactRef`、`ExternalReferenceProjection`、`ReferenceResolutionState` |

##### 函数级调用图

```text
[worker::consumers]
  | call consume_work_context_changed(InboundEventEnvelope<WorkContextChangedEvent> event)
  v
[ExternalReferenceIngestionService]
  | validate envelope and reserve event idempotency
  | tx begin
  | call ExternalFactRef::from_work_fact(...)
  | call ExternalReferenceProjection.attach_reference(...)
  | mark related projections stale
  v
[Repository]
  | upsert reference projection
  | save projection state
  | complete idempotency
  | tx commit
```

##### 关键伪代码

```rust
// [InboundEventEnvelope.validate()]
event.validate()?;
let request_digest = RequestDigest::from_event(&event)?;
let uow = unit_of_work.begin().await?;
let reservation = idempotency.reserve(event.idempotency_key, IdempotencyOperation::ConsumeWorkContextChanged, request_digest.clone(), uow.clone()).await?;

// [ExternalFactRef::from_work_fact(WorkFactRef work_fact_ref, ExternalSourceVersionRef version_ref)]
let external_ref = ExternalFactRef::from_work_fact(event.payload.work_context_ref, event.payload.source_version_ref)?;

// [ExternalReferenceRepository.get_reference_projection(ConversationSpaceId space_id)]
let mut projection = external_ref_repo.get_reference_projection(event.payload.space_id).await?.unwrap_or_else(|| ExternalReferenceProjection::for_space(event.payload.space_id));

// [ExternalReferenceProjection.attach_reference(ExternalFactRef external_fact_ref)]
projection.attach_reference(external_ref)?;

// [ConversationProjectionState.mark_stale(ProjectionStaleReason reason)]
let mut state = load_or_initial_projection_state(event.payload.space_id, ConversationProjectionKind::ExternalReference).await?;
state.mark_stale(ProjectionStaleReason::ExternalSourceChanged)?;

external_ref_repo.upsert_reference_projection(projection, uow.clone()).await?;
projection_repo.save_projection_state(state, uow.clone()).await?;
idempotency.complete(reservation, event.result_ref(), uow.clone()).await?;
unit_of_work.commit(uow).await?;
```

##### 事务、错误、状态与测试

| 项 | 内容 |
|---|---|
| 事务边界 | reference projection、projection state、幂等 complete 同事务 |
| 错误映射 | invalid envelope -> quarantine;missing work ref -> quarantine;repository failure -> retry |
| 状态副作用 | external reference projection 更新;projection stale |
| 事件副作用 | consumer audit;不产生 conversation fact |
| 测试切口 | valid work event、duplicate event skipped、missing source quarantined、no work body copied |

#### 7.4.2 `ConsumeGovernanceFactCommittedFlow`

##### 入口与目标

| 项 | 内容 |
|---|---|
| 对应协议 | `ConsumeGovernanceFactCommitted` |
| 入口函数 | `consume_governance_fact_committed(InboundEventEnvelope<GovernanceFactCommittedEvent> event) -> Result<ConsumerReceipt, ConsumerError>` |
| Application service | `ManifestationIngestionService.consume_governance_fact_committed(...)` |
| 目标对象 | `ExternalFactRef`、`ExternalFactSnapshot`、`CrossDomainManifestation`、`ConversationOutboxRecord` |

##### 函数级调用图

```text
[worker::consumers]
  | call consume_governance_fact_committed(InboundEventEnvelope<GovernanceFactCommittedEvent> event)
  v
[ManifestationIngestionService]
  | validate envelope and reserve event idempotency
  | tx begin
  | call ExternalFactRef::from_governance_decision(...)
  | call ExternalFactResolverPort.load_safe_snapshot(...)
  | call CrossDomainManifestation::from_snapshot(...)
  v
[Repository + Outbox]
  | save snapshot and manifestation
  | enqueue manifestation changed outbox
  | complete idempotency
  | tx commit
```

##### 关键伪代码

```rust
event.validate()?;
let request_digest = RequestDigest::from_event(&event)?;
let uow = unit_of_work.begin().await?;
let reservation = idempotency.reserve(event.idempotency_key, IdempotencyOperation::ConsumeGovernanceFactCommitted, request_digest.clone(), uow.clone()).await?;

// [ExternalFactRef::from_governance_decision(GovernanceDecisionRef decision_ref, ExternalSourceVersionRef version_ref)]
let external_ref = ExternalFactRef::from_governance_decision(event.payload.governance_fact_ref, event.payload.source_version_ref)?;

// [SpaceScopeRepository.get_visibility_scope(ConversationSpaceId space_id)]
let visibility = space_scope_repo.get_visibility_scope(event.payload.target_space_id).await?.ok_or(ApplicationError::NotFound)?;

// [ExternalFactResolverPort.load_safe_snapshot(ExternalFactRef external_fact_ref, VisibilityScope visibility)]
let snapshot = external_resolver.load_safe_snapshot(external_ref.clone(), visibility.clone()).await?;

// [CrossDomainManifestation::from_snapshot(ExternalFactRef external_fact_ref, ExternalFactSnapshot snapshot, &VisibilityScope visibility)]
let manifestation = CrossDomainManifestation::from_snapshot(external_ref, snapshot.clone(), &visibility)?;
let committed_at = clock.now();
let outbox = ConversationOutboxRecord::from_manifestation(manifestation.clone(), None, committed_at)?;

external_ref_repo.upsert_snapshot(snapshot, uow.clone()).await?;
manifestation_repo.insert_manifestation(manifestation, uow.clone()).await?;
outbox_repo.enqueue(outbox, uow.clone()).await?;
idempotency.complete(reservation, event.result_ref(), uow.clone()).await?;
unit_of_work.commit(uow).await?;
```

##### 事务、错误、状态与测试

| 项 | 内容 |
|---|---|
| 事务边界 | snapshot、manifestation、outbox、幂等 complete 同事务 |
| 错误映射 | resolver failure -> unresolved marker or retry;invalid target space -> quarantine |
| 状态副作用 | `ManifestationState::Manifested` 或 unresolved marker |
| 事件副作用 | `CrossDomainManifestationChangedEvent` outbox |
| 测试切口 | governance event manifested、resolver unavailable、duplicate skipped、decision body not stored |

#### 7.4.3 `ConsumeArtifactFactCommittedFlow`

##### 入口与目标

| 项 | 内容 |
|---|---|
| 对应协议 | `ConsumeArtifactFactCommitted` |
| 入口函数 | `consume_artifact_fact_committed(InboundEventEnvelope<ArtifactFactCommittedEvent> event) -> Result<ConsumerReceipt, ConsumerError>` |
| Application service | `ExternalReferenceIngestionService.consume_artifact_fact_committed(...)` |
| 目标对象 | `ExternalFactRef`、`ExternalReferenceProjection`、`ReferenceResolutionState` |

##### 函数级调用图

```text
[worker::consumers]
  | call consume_artifact_fact_committed(InboundEventEnvelope<ArtifactFactCommittedEvent> event)
  v
[ExternalReferenceIngestionService]
  | validate artifact ref and digest
  | tx begin
  | reserve idempotency
  | call ExternalFactRef::from_artifact_version(...)
  | call ExternalReferenceProjection.attach_reference(...)
  v
[Repository]
  | upsert reference projection
  | save projection stale marker
  | complete idempotency
  | tx commit
```

##### 关键伪代码

```rust
event.validate()?;
let request_digest = RequestDigest::from_event(&event)?;
let uow = unit_of_work.begin().await?;
let reservation = idempotency.reserve(event.idempotency_key, IdempotencyOperation::ConsumeArtifactFactCommitted, request_digest.clone(), uow.clone()).await?;

// [ExternalFactRef::from_artifact_version(ArtifactVersionRef artifact_version_ref)]
let external_ref = ExternalFactRef::from_artifact_version(event.payload.artifact_fact_ref)?;

let mut projection = external_ref_repo.get_reference_projection(event.payload.space_id).await?.unwrap_or_else(|| ExternalReferenceProjection::for_space(event.payload.space_id));
projection.attach_reference(external_ref)?;

let mut state = load_or_initial_projection_state(event.payload.space_id, ConversationProjectionKind::ExternalReference).await?;
state.mark_stale(ProjectionStaleReason::ExternalSourceChanged)?;

external_ref_repo.upsert_reference_projection(projection, uow.clone()).await?;
projection_repo.save_projection_state(state, uow.clone()).await?;
idempotency.complete(reservation, event.result_ref(), uow.clone()).await?;
unit_of_work.commit(uow).await?;
```

##### 事务、错误、状态与测试

| 项 | 内容 |
|---|---|
| 事务边界 | projection、state、幂等 complete 同事务 |
| 错误映射 | digest mismatch -> quarantine;missing artifact ref -> quarantine |
| 状态副作用 | external reference projection stale / updated |
| 事件副作用 | consumer audit;不创建 fact |
| 测试切口 | artifact ref ingested、digest mismatch quarantined、duplicate skipped、artifact body not stored |

#### 7.4.4 `ConsumeRuntimeResultCommittedFlow`

##### 入口与目标

| 项 | 内容 |
|---|---|
| 对应协议 | `ConsumeRuntimeResultCommitted` |
| 入口函数 | `consume_runtime_result_committed(InboundEventEnvelope<RuntimeResultCommittedEvent> event) -> Result<ConsumerReceipt, ConsumerError>` |
| Application service | `ConversationFactAppendService.consume_runtime_result(...)` |
| 目标对象 | `FactSourceRef`、`ConversationFact`、`FactAppendReceipt`、`ConversationTraceContext`、`ConversationOutboxRecord` |

##### 函数级调用图

```text
[worker::consumers]
  | call consume_runtime_result_committed(InboundEventEnvelope<RuntimeResultCommittedEvent> event)
  v
[ConversationFactAppendService]
  | validate runtime result ref and payload ref
  | tx begin
  | reserve event idempotency
  | load space, participant scope, visibility scope
  | call FactSourceRef::from_runtime_result(...)
  | call ConversationFact::from_append_input(...)
  v
[Repository + Outbox]
  | append fact, receipt, trace
  | enqueue fact appended outbox
  | complete idempotency
  | tx commit
```

##### 关键伪代码

```rust
event.validate()?;
let request_digest = RequestDigest::from_event(&event)?;
let uow = unit_of_work.begin().await?;
let reservation = idempotency.reserve(event.idempotency_key, IdempotencyOperation::ConsumeRuntimeResultCommitted, request_digest.clone(), uow.clone()).await?;

let space = space_scope_repo.get_space_for_update(event.payload.space_id, uow.clone()).await?.ok_or(ApplicationError::NotFound)?;
let participant = space_scope_repo.get_participant_scope(event.payload.space_id).await?.ok_or(ApplicationError::NotFound)?;
let visibility = space_scope_repo.get_visibility_scope(event.payload.space_id).await?.ok_or(ApplicationError::NotFound)?;

// [FactSourceRef::from_runtime_result(RuntimeResultRef result_ref, ActorRef actor)]
let source = FactSourceRef::from_runtime_result(event.payload.runtime_result_ref, event.payload.system_actor_ref.into())?;
source.assert_result_only()?;

let policy = FactAppendPolicy::for_space(&space, &visibility);
policy.assert_append_allowed(&space, &participant, &visibility)?;
policy.assert_fact_kind_allowed(event.payload.fact_kind)?;
if event.payload.fact_kind != ConversationFactKind::RuntimeResult {
    return Err(ProtocolError::InvalidEnvelope.into());
}
let fact = ConversationFact::from_append_input(&space, event.payload.fact_kind, source, &visibility, event.payload.result_payload_ref)?;
let committed_at = clock.now();
let receipt = FactAppendReceipt::accepted(&fact, event.idempotency_key, committed_at);
let trace = ConversationTraceContext::from_fact_append(&fact, &receipt)?;
let outbox = ConversationOutboxRecord::from_fact_append(fact.clone(), receipt.clone(), committed_at)?;

fact_repo.append_fact(fact, receipt, uow.clone()).await?;
trace_repo.save_trace_context(trace, uow.clone()).await?;
outbox_repo.enqueue(outbox, uow.clone()).await?;
idempotency.complete(reservation, event.result_ref(), uow.clone()).await?;
unit_of_work.commit(uow).await?;
```

##### 事务、错误、状态与测试

| 项 | 内容 |
|---|---|
| 事务边界 | fact、receipt、trace、outbox、幂等 complete 同事务 |
| 错误映射 | reasoning body present -> reject/quarantine;space missing -> retry/quarantine;policy reject -> rejected receipt |
| 状态副作用 | fact committed;trace created |
| 事件副作用 | `ConversationFactAppendedEvent` |
| 测试切口 | runtime result fact、reasoning body rejected、duplicate skipped、policy reject |

#### 7.4.5 `ConsumeBridgeMappedFactReceivedFlow`

##### 入口与目标

| 项 | 内容 |
|---|---|
| 对应协议 | `ConsumeBridgeMappedFactReceived` |
| 入口函数 | `consume_bridge_mapped_fact_received(InboundEventEnvelope<BridgeMappedFactReceivedEvent> event) -> Result<ConsumerReceipt, ConsumerError>` |
| Application service | `ConversationFactAppendService.consume_bridge_mapped_fact(...)` |
| 目标对象 | `FactSourceRef`、`ConversationFact` 或 `ExternalFactRef`、`CrossDomainManifestation` |

##### 函数级调用图

```text
[worker::consumers]
  | call consume_bridge_mapped_fact_received(InboundEventEnvelope<BridgeMappedFactReceivedEvent> event)
  v
[ConversationFactAppendService]
  | validate bridge mapping metadata
  | tx begin
  | reserve event idempotency
  | choose append or manifestation mode
  | call FactSourceRef::from_bridge_mapping(...) or ExternalFactRef::from_bridge_event(...)
  v
[Repository + Outbox]
  | save fact or manifestation
  | enqueue changed outbox
  | complete idempotency
  | tx commit
```

##### 关键伪代码

```rust
event.validate()?;
let request_digest = RequestDigest::from_event(&event)?;
let uow = unit_of_work.begin().await?;
let reservation = idempotency.reserve(event.idempotency_key, IdempotencyOperation::ConsumeBridgeMappedFactReceived, request_digest.clone(), uow.clone()).await?;

if event.payload.target_mode == BridgeTargetMode::AppendFact {
    let space = space_scope_repo.get_space_for_update(event.payload.space_id, uow.clone()).await?.ok_or(ApplicationError::NotFound)?;
    let participant = space_scope_repo.get_participant_scope(event.payload.space_id).await?.ok_or(ApplicationError::NotFound)?;
    let visibility = space_scope_repo.get_visibility_scope(event.payload.space_id).await?.ok_or(ApplicationError::NotFound)?;

    // [FactSourceRef::from_bridge_mapping(BridgeSourceRef source_ref, ActorRef actor)]
    let source = FactSourceRef::from_bridge_mapping(event.payload.bridge_fact_ref.into(), event.payload.actor_ref)?;
    let policy = FactAppendPolicy::for_space(&space, &visibility);
    policy.assert_append_allowed(&space, &participant, &visibility)?;
    policy.assert_fact_kind_allowed(event.payload.fact_kind)?;
    if event.payload.fact_kind != ConversationFactKind::BridgeMapped {
        return Err(ProtocolError::InvalidEnvelope.into());
    }
    let fact = ConversationFact::from_append_input(&space, event.payload.fact_kind, source, &visibility, event.payload.mapped_payload_ref)?;
    let committed_at = clock.now();
    let receipt = FactAppendReceipt::accepted(&fact, event.idempotency_key, committed_at);
    fact_repo.append_fact(fact.clone(), receipt.clone(), uow.clone()).await?;
    outbox_repo.enqueue(ConversationOutboxRecord::from_fact_append(fact, receipt, committed_at)?, uow.clone()).await?;
} else {
    // [ExternalFactRef::from_bridge_event(BridgeEventRef bridge_event_ref)]
    let external_ref = ExternalFactRef::from_bridge_event(event.payload.bridge_fact_ref.into())?;
    let space = space_scope_repo.get_space_for_update(event.payload.space_id, uow.clone()).await?.ok_or(ApplicationError::NotFound)?;
    let visibility = space_scope_repo.get_visibility_scope(event.payload.space_id).await?.ok_or(ApplicationError::NotFound)?;
    let manifestation = CrossDomainManifestation::from_external_fact(&space, external_ref, &visibility)?;
    manifestation_repo.insert_manifestation(manifestation.clone(), uow.clone()).await?;
    let committed_at = clock.now();
    outbox_repo.enqueue(ConversationOutboxRecord::from_manifestation(manifestation, None, committed_at)?, uow.clone()).await?;
}

idempotency.complete(reservation, event.result_ref(), uow.clone()).await?;
unit_of_work.commit(uow).await?;
```

##### 事务、错误、状态与测试

| 项 | 内容 |
|---|---|
| 事务边界 | append / manifestation 分支各自与 outbox、幂等 complete 同事务 |
| 错误映射 | invalid mapping -> quarantine;platform body present -> reject;target space missing -> quarantine |
| 状态副作用 | fact committed 或 manifestation manifested / unresolved |
| 事件副作用 | fact appended 或 manifestation changed outbox |
| 测试切口 | append mode、manifest mode、platform body rejected、duplicate skipped |

#### 7.4.6 `ConsumeIdentityActorChangedFlow`

##### 入口与目标

| 项 | 内容 |
|---|---|
| 对应协议 | `ConsumeIdentityActorChanged` |
| 入口函数 | `consume_identity_actor_changed(InboundEventEnvelope<IdentityActorChangedEvent> event) -> Result<ConsumerReceipt, ConsumerError>` |
| Application service | `ConversationDerivedMaintenanceService.consume_identity_actor_changed(...)` |
| 目标对象 | `ConversationProjectionState`、read model stale marker、reference projection stale marker |

##### 函数级调用图

```text
[worker::consumers]
  | call consume_identity_actor_changed(InboundEventEnvelope<IdentityActorChangedEvent> event)
  v
[ConversationDerivedMaintenanceService]
  | validate actor ref and affected spaces
  | tx begin
  | reserve event idempotency
  | call ActorResolverPort.resolve_actor(...)
  | mark affected projections stale
  v
[Repository]
  | save projection state markers
  | complete idempotency
  | tx commit
```

##### 关键伪代码

```rust
event.validate()?;
let request_digest = RequestDigest::from_event(&event)?;
let uow = unit_of_work.begin().await?;
let reservation = idempotency.reserve(event.idempotency_key, IdempotencyOperation::ConsumeIdentityActorChanged, request_digest.clone(), uow.clone()).await?;

// [ActorResolverPort.resolve_actor(ActorRef actor, TraceContextRef trace_ref)]
let actor_snapshot = actor_resolver.resolve_actor(event.payload.actor_ref, event.trace_ref).await?;

for space_id in event.payload.affected_space_refs {
    // [ProjectionRepository.get_projection_state(ConversationSpaceId space_id, ConversationProjectionKind kind)]
    let mut state = load_or_initial_projection_state(space_id, ConversationProjectionKind::ReadModel).await?;
    state.mark_stale(ProjectionStaleReason::ActorChanged)?;
    projection_repo.save_projection_state(state, uow.clone()).await?;
}

idempotency.complete(reservation, actor_snapshot.result_ref(), uow.clone()).await?;
unit_of_work.commit(uow).await?;
```

##### 事务、错误、状态与测试

| 项 | 内容 |
|---|---|
| 事务边界 | affected projection stale markers 与幂等 complete 同事务 |
| 错误映射 | actor unresolved -> stale anyway with unresolved marker;invalid envelope -> quarantine |
| 状态副作用 | read model / reference projection stale |
| 事件副作用 | 可选 `ConversationProjectionStateChangedEvent` |
| 测试切口 | actor changed marks stale、actor resolver unavailable、duplicate skipped、identity truth not modified |

### 7.5 Outbound Event Publish 处理流

#### 7.5.1 `ConversationSpaceChangedPublishFlow`

##### 入口与目标

| 项 | 内容 |
|---|---|
| 对应协议 | `ConversationSpaceChangedEvent` |
| 入口函数 | `publish_conversation_space_changed(ConversationOutboxRecord outbox) -> Result<PublishedEventRef, PublishError>` |
| Application service | `ConversationOutboxPublishService.publish_space_changed(...)` |
| 目标对象 | `ConversationOutboxRecord`、`PublishedEventRef` |

##### 函数级调用图

```text
[jobs::outbox_publisher]
  | dispatch SpaceChanged outbox
  v
[ConversationOutboxPublishService]
  | validate event kind and payload ref
  | build ConversationSpaceChangedEvent
  | call ConversationOutboxPublisherPort.publish(...)
  v
[Event Boundary]
  | publish topic conversation.space.changed
  | return PublishedEventRef
```

##### 关键伪代码

```rust
outbox.assert_event_kind(ConversationOutboxEventKind::SpaceChanged)?;
outbox.assert_committed_truth_ref()?;
let event = ConversationSpaceChangedEvent::from_outbox(&outbox)?;
event.assert_no_forbidden_body()?;

// [ConversationOutboxPublisherPort.publish(ConversationOutboxRecord outbox, TraceContextRef trace_ref)]
let published_ref = outbox_publisher.publish(outbox, trace_ref).await?;
Ok(published_ref)
```

##### 事务、错误、状态与测试

| 项 | 内容 |
|---|---|
| 事务边界 | 发布函数自身不持有数据库事务;outbox state 由 `PublishConversationOutboxFlow` 推进 |
| 错误映射 | wrong event kind -> `PublishError::InvalidEventKind`;payload missing -> `PublishError::PayloadMissing`;transport failure -> retry |
| 状态副作用 | 无直接 truth 变更 |
| 事件副作用 | 发布 `conversation.space.changed` |
| 测试切口 | event kind mismatch、payload redaction、publish success、publish transport failure |

#### 7.5.2 `ConversationScopeChangedPublishFlow`

##### 入口与目标

| 项 | 内容 |
|---|---|
| 对应协议 | `ConversationScopeChangedEvent` |
| 入口函数 | `publish_conversation_scope_changed(ConversationOutboxRecord outbox) -> Result<PublishedEventRef, PublishError>` |
| Application service | `ConversationOutboxPublishService.publish_scope_changed(...)` |
| 目标对象 | `ConversationOutboxRecord`、`VisibilityMarker`、`PublishedEventRef` |

##### 函数级调用图

```text
[jobs::outbox_publisher]
  | dispatch ScopeChanged outbox
  v
[ConversationOutboxPublishService]
  | validate scope-change truth ref
  | preserve visibility marker
  | build ConversationScopeChangedEvent
  v
[Event Boundary]
  | publish topic conversation.scope.changed
  | return PublishedEventRef
```

##### 关键伪代码

```rust
outbox.assert_event_kind(ConversationOutboxEventKind::ScopeChanged)?;
outbox.assert_truth_ref_kind(ConversationTruthRefKind::ScopeChange)?;
let event = ConversationScopeChangedEvent::from_outbox(&outbox)?;
event.assert_visibility_marker_present()?;

let published_ref = outbox_publisher.publish(outbox, trace_ref).await?;
Ok(published_ref)
```

##### 事务、错误、状态与测试

| 项 | 内容 |
|---|---|
| 事务边界 | 无本地事务;发布结果交给 outbox job 记录 |
| 错误映射 | missing visibility marker -> non-retry publish failure;transport failure -> retry |
| 状态副作用 | 无 |
| 事件副作用 | 发布 `conversation.scope.changed` |
| 测试切口 | scope marker present、participant details not expanded、publish retry、wrong truth ref rejected |

#### 7.5.3 `ConversationFactAppendedPublishFlow`

##### 入口与目标

| 项 | 内容 |
|---|---|
| 对应协议 | `ConversationFactAppendedEvent` |
| 入口函数 | `publish_conversation_fact_appended(ConversationOutboxRecord outbox) -> Result<PublishedEventRef, PublishError>` |
| Application service | `ConversationOutboxPublishService.publish_fact_appended(...)` |
| 目标对象 | `ConversationOutboxRecord`、`ConversationFactRef`、`FactAppendReceiptRef` |

##### 函数级调用图

```text
[jobs::outbox_publisher]
  | dispatch FactAppended outbox
  v
[ConversationOutboxPublishService]
  | validate fact truth ref
  | preserve payload_ref only
  | build ConversationFactAppendedEvent
  v
[Event Boundary]
  | publish topic conversation.fact.appended
  | return PublishedEventRef
```

##### 关键伪代码

```rust
outbox.assert_event_kind(ConversationOutboxEventKind::FactAppended)?;
outbox.assert_truth_ref_kind(ConversationTruthRefKind::ConversationFact)?;
let event = ConversationFactAppendedEvent::from_outbox(&outbox)?;
event.assert_payload_ref_only()?;
event.assert_visibility_marker_present()?;

let published_ref = outbox_publisher.publish(outbox, trace_ref).await?;
Ok(published_ref)
```

##### 事务、错误、状态与测试

| 项 | 内容 |
|---|---|
| 事务边界 | 无本地事务;fact 已经由 append flow 提交 |
| 错误映射 | body present -> non-retry publish failure;payload ref missing -> failed;transport failure -> retry |
| 状态副作用 | 无 |
| 事件副作用 | 发布 `conversation.fact.appended` |
| 测试切口 | payload ref only、visibility marker、forbidden body rejected、transport retry |

#### 7.5.4 `ConversationFactRetractedPublishFlow`

##### 入口与目标

| 项 | 内容 |
|---|---|
| 对应协议 | `ConversationFactRetractedEvent` |
| 入口函数 | `publish_conversation_fact_retracted(ConversationOutboxRecord outbox) -> Result<PublishedEventRef, PublishError>` |
| Application service | `ConversationOutboxPublishService.publish_fact_retracted(...)` |
| 目标对象 | `ConversationOutboxRecord`、`ConversationFactRef`、`ConversationTraceContextRef` |

##### 函数级调用图

```text
[jobs::outbox_publisher]
  | dispatch FactRetracted outbox
  v
[ConversationOutboxPublishService]
  | validate retracted fact truth ref
  | include trace context ref
  | build ConversationFactRetractedEvent
  v
[Event Boundary]
  | publish topic conversation.fact.retracted
  | return PublishedEventRef
```

##### 关键伪代码

```rust
outbox.assert_event_kind(ConversationOutboxEventKind::FactRetracted)?;
outbox.assert_truth_ref_kind(ConversationTruthRefKind::ConversationFact)?;
let event = ConversationFactRetractedEvent::from_outbox(&outbox)?;
event.assert_retraction_reason_ref_present()?;
event.assert_no_deleted_payload()?;

let published_ref = outbox_publisher.publish(outbox, trace_ref).await?;
Ok(published_ref)
```

##### 事务、错误、状态与测试

| 项 | 内容 |
|---|---|
| 事务边界 | 无本地事务;retraction state 已在 command flow 提交 |
| 错误映射 | missing reason ref -> failed;deleted payload included -> failed;transport failure -> retry |
| 状态副作用 | 无 |
| 事件副作用 | 发布 `conversation.fact.retracted` |
| 测试切口 | retraction reason ref、payload absent、trace context ref、publish retry |

#### 7.5.5 `CrossDomainManifestationChangedPublishFlow`

##### 入口与目标

| 项 | 内容 |
|---|---|
| 对应协议 | `CrossDomainManifestationChangedEvent` |
| 入口函数 | `publish_cross_domain_manifestation_changed(ConversationOutboxRecord outbox) -> Result<PublishedEventRef, PublishError>` |
| Application service | `ConversationOutboxPublishService.publish_manifestation_changed(...)` |
| 目标对象 | `ConversationOutboxRecord`、`CrossDomainManifestationRef`、`ExternalFactSnapshotRef` |

##### 函数级调用图

```text
[jobs::outbox_publisher]
  | dispatch ManifestationChanged outbox
  v
[ConversationOutboxPublishService]
  | validate manifestation truth ref
  | keep external fact ref only
  | build CrossDomainManifestationChangedEvent
  v
[Event Boundary]
  | publish topic conversation.manifestation.changed
  | return PublishedEventRef
```

##### 关键伪代码

```rust
outbox.assert_event_kind(ConversationOutboxEventKind::ManifestationChanged)?;
outbox.assert_truth_ref_kind(ConversationTruthRefKind::CrossDomainManifestation)?;
let event = CrossDomainManifestationChangedEvent::from_outbox(&outbox)?;
event.assert_external_reference_only()?;

let published_ref = outbox_publisher.publish(outbox, trace_ref).await?;
Ok(published_ref)
```

##### 事务、错误、状态与测试

| 项 | 内容 |
|---|---|
| 事务边界 | 无本地事务;manifestation truth 已提交 |
| 错误映射 | source body present -> failed;missing external ref -> failed;transport failure -> retry |
| 状态副作用 | 无 |
| 事件副作用 | 发布 `conversation.manifestation.changed` |
| 测试切口 | unresolved manifestation event、snapshot ref optional、source body absent、publish retry |

#### 7.5.6 `ConversationChangeAvailablePublishFlow`

##### 入口与目标

| 项 | 内容 |
|---|---|
| 对应协议 | `ConversationChangeAvailableEvent` |
| 入口函数 | `publish_conversation_change_available(ConversationOutboxRecord outbox) -> Result<PublishedEventRef, PublishError>` |
| Application service | `ConversationOutboxPublishService.publish_change_available(...)` |
| 目标对象 | `ConversationOutboxRecord`、`ChangeCursorProjection` |

##### 函数级调用图

```text
[jobs::outbox_publisher]
  | dispatch ChangeAvailable outbox
  v
[ConversationOutboxPublishService]
  | validate outbox sequence and visibility marker
  | build lightweight change notification
  | publish without fact payload
  v
[Event Boundary]
  | publish topic conversation.change.available
  | return PublishedEventRef
```

##### 关键伪代码

```rust
outbox.assert_event_kind(ConversationOutboxEventKind::ChangeAvailable)?;
outbox.assert_outbox_sequence_present()?;
let event = ConversationChangeAvailableEvent::from_outbox(&outbox)?;
event.assert_lightweight_notification()?;

let published_ref = outbox_publisher.publish(outbox, trace_ref).await?;
Ok(published_ref)
```

##### 事务、错误、状态与测试

| 项 | 内容 |
|---|---|
| 事务边界 | 无本地事务;cursor projection 由 `MaintainConversationChangeCursorsFlow` 维护 |
| 错误映射 | missing sequence -> failed;full payload included -> failed;transport failure -> retry |
| 状态副作用 | 无 |
| 事件副作用 | 发布 `conversation.change.available` |
| 测试切口 | lightweight payload、sequence present、full payload rejected、consumer pulls query later |

#### 7.5.7 `TraceHandoffRequestedPublishFlow`

##### 入口与目标

| 项 | 内容 |
|---|---|
| 对应协议 | `TraceHandoffRequestedEvent` |
| 入口函数 | `publish_trace_handoff_requested(ConversationOutboxRecord outbox) -> Result<PublishedEventRef, PublishError>` |
| Application service | `ConversationOutboxPublishService.publish_trace_handoff_requested(...)` |
| 目标对象 | `ConversationOutboxRecord`、`TraceHandoffRecordRef` |

##### 函数级调用图

```text
[jobs::outbox_publisher]
  | dispatch TraceHandoffRequested outbox
  v
[ConversationOutboxPublishService]
  | validate trace handoff truth ref
  | keep handoff payload ref only
  | build TraceHandoffRequestedEvent
  v
[Event Boundary]
  | publish topic conversation.trace_handoff.requested
  | return PublishedEventRef
```

##### 关键伪代码

```rust
outbox.assert_event_kind(ConversationOutboxEventKind::TraceHandoffRequested)?;
outbox.assert_truth_ref_kind(ConversationTruthRefKind::TraceHandoff)?;
let event = TraceHandoffRequestedEvent::from_outbox(&outbox)?;
event.assert_handoff_payload_ref_only()?;

let published_ref = outbox_publisher.publish(outbox, trace_ref).await?;
Ok(published_ref)
```

##### 事务、错误、状态与测试

| 项 | 内容 |
|---|---|
| 事务边界 | 无本地事务;handoff delivery 由 `DeliverTraceHandoffFlow` 另行推进 |
| 错误映射 | missing handoff payload ref -> failed;observability receipt present -> failed;transport failure -> retry |
| 状态副作用 | 无 |
| 事件副作用 | 发布 `conversation.trace_handoff.requested` |
| 测试切口 | handoff request only、receipt absent、payload redacted、publish retry |

#### 7.5.8 `ArchiveHandoffRequestedPublishFlow`

##### 入口与目标

| 项 | 内容 |
|---|---|
| 对应协议 | `ArchiveHandoffRequestedEvent` |
| 入口函数 | `publish_archive_handoff_requested(ConversationOutboxRecord outbox) -> Result<PublishedEventRef, PublishError>` |
| Application service | `ConversationOutboxPublishService.publish_archive_handoff_requested(...)` |
| 目标对象 | `ConversationOutboxRecord`、`ArchiveHandoffRecordRef` |

##### 函数级调用图

```text
[jobs::outbox_publisher]
  | dispatch ArchiveHandoffRequested outbox
  v
[ConversationOutboxPublishService]
  | validate archive handoff truth ref
  | allow empty package ref while pending
  | build ArchiveHandoffRequestedEvent
  v
[Event Boundary]
  | publish topic conversation.archive_handoff.requested
  | return PublishedEventRef
```

##### 关键伪代码

```rust
outbox.assert_event_kind(ConversationOutboxEventKind::ArchiveHandoffRequested)?;
outbox.assert_truth_ref_kind(ConversationTruthRefKind::ArchiveHandoff)?;
let event = ArchiveHandoffRequestedEvent::from_outbox(&outbox)?;
event.assert_archive_package_ref_optional_before_delivery()?;

let published_ref = outbox_publisher.publish(outbox, trace_ref).await?;
Ok(published_ref)
```

##### 事务、错误、状态与测试

| 项 | 内容 |
|---|---|
| 事务边界 | 无本地事务;archive package ref 由 delivery job 写入 handoff record |
| 错误映射 | archive package body present -> failed;wrong truth ref -> failed;transport failure -> retry |
| 状态副作用 | 无 |
| 事件副作用 | 发布 `conversation.archive_handoff.requested` |
| 测试切口 | pending package ref optional、archive body absent、wrong truth ref rejected、publish retry |

#### 7.5.9 `ConversationProjectionStateChangedPublishFlow`

##### 入口与目标

| 项 | 内容 |
|---|---|
| 对应协议 | `ConversationProjectionStateChangedEvent` |
| 入口函数 | `publish_conversation_projection_state_changed(ConversationProjectionState state) -> Result<PublishedEventRef, PublishError>` |
| Application service | `ConversationProjectionPublishService.publish_state_changed(...)` |
| 目标对象 | `ConversationProjectionState`、`PublishedEventRef` |

##### 函数级调用图

```text
[Projection Maintenance]
  | call publish_conversation_projection_state_changed(ConversationProjectionState state)
  v
[ConversationProjectionPublishService]
  | validate projection state is derived
  | build freshness event
  | call ConversationOutboxPublisherPort.publish_projection_state_changed(...)
  v
[Event Boundary]
  | publish topic conversation.projection_state.changed
  | return PublishedEventRef
```

##### 关键伪代码

```rust
state.assert_derived_state()?;
let event = ConversationProjectionStateChangedEvent::from_projection_state(&state)?;
event.assert_not_truth_lifecycle()?;

// [ConversationOutboxPublisherPort.publish_projection_state_changed(ConversationProjectionState state, TraceContextRef trace_ref)]
let published_ref = outbox_publisher.publish_projection_state_changed(state, trace_ref).await?;
Ok(published_ref)
```

##### 事务、错误、状态与测试

| 项 | 内容 |
|---|---|
| 事务边界 | 发布函数不改 projection state;state 已由 consumer / job 保存 |
| 错误映射 | invalid projection state -> failed;truth state leaked -> failed;transport failure -> retry or evidence failure |
| 状态副作用 | 无 |
| 事件副作用 | 发布 `conversation.projection_state.changed` |
| 测试切口 | stale event、failed event、truth state not leaked、transport failure evidence |

### 7.6 Operations Job 处理流

#### 7.6.1 `PublishConversationOutboxFlow`

##### 入口与目标

| 项 | 内容 |
|---|---|
| 对应协议 | `PublishConversationOutbox` |
| 入口函数 | `run_publish_conversation_outbox(PublishConversationOutboxJob job) -> Result<JobRunReceipt, JobError>` |
| Application service | `ConversationOutboxPublishJob.run(...)` |
| 目标对象 | `ConversationOutboxRecord` publication state |

##### 函数级调用图

```text
[jobs::outbox_publisher]
  | call run_publish_conversation_outbox(PublishConversationOutboxJob job)
  v
[ConversationOutboxPublishJob]
  | validate job and reserve job idempotency
  | list pending outbox records
  | publish each record outside DB transaction
  | tx per record to mark published, retry, or failed
  v
[Repository + Publisher]
  | ConversationOutboxPublisherPort.publish(...)
  | ConversationOutboxRecord.mark_published / mark_retry / mark_failed
  | ConversationOutboxRepository.save_state(...)
```

##### 关键伪代码

```rust
job.validate()?;
let pending = outbox_repo.list_pending(job.batch_size).await?;
let mut receipt = JobRunReceipt::started(job.job_run_id);

for candidate in pending {
    let publish_result = outbox_publisher.publish(candidate.clone(), job.trace_ref).await;

    let uow = unit_of_work.begin().await?;
    let mut outbox = outbox_repo.get_for_update(candidate.outbox_record_id, uow.clone()).await?.ok_or(JobError::MissingOutbox)?;

    match publish_result {
        Ok(published_ref) => {
            outbox.mark_published(published_ref, clock.now())?;
            receipt.count_published(outbox.outbox_record_id);
        }
        Err(error) if error.is_retryable() && outbox.retry_count() < job.max_retry_count => {
            outbox.mark_retry(RetryReason::from_publish_error(error), job.next_retry_at(clock.now()))?;
            receipt.count_retry(outbox.outbox_record_id);
        }
        Err(error) => {
            outbox.mark_failed(OutboxFailureReason::from_publish_error(error), job.actor_ref())?;
            receipt.count_failed(outbox.outbox_record_id);
        }
    }

    outbox_repo.save_state(outbox, uow.clone()).await?;
    unit_of_work.commit(uow).await?;
}

Ok(receipt.completed(clock.now()))
```

##### 事务、错误、状态与测试

| 项 | 内容 |
|---|---|
| 事务边界 | 每条 outbox 独立事务;外部 publish 不包在 DB 事务内 |
| 错误映射 | transient publish -> retry;non-retry publish -> failed;missing locked record -> job failed evidence |
| 状态副作用 | `Pending` / `RetryPending` -> `Published`、`RetryPending` 或 `Failed` |
| 事件副作用 | 触发 §7.5 对应 event publish |
| 测试切口 | all success、partial retry、permanent failure、duplicate job does not double mark |

#### 7.6.2 `RebuildConversationReadModelsFlow`

##### 入口与目标

| 项 | 内容 |
|---|---|
| 对应协议 | `RebuildConversationReadModels` |
| 入口函数 | `run_rebuild_conversation_read_models(RebuildConversationReadModelsJob job) -> Result<JobRunReceipt, JobError>` |
| Application service | `ConversationProjectionRebuildJob.rebuild_read_models(...)` |
| 目标对象 | `ConversationReadModel`、`ConversationProjectionState` |

##### 函数级调用图

```text
[jobs::projection_rebuild]
  | call run_rebuild_conversation_read_models(RebuildConversationReadModelsJob job)
  v
[ConversationDerivedMaintenanceService]
  | list spaces by job scope
  | resolve consumers by consumer scope
  | list visible fact refs
  | call ConversationReadModel::from_visible_facts(...)
  v
[ProjectionRepository]
  | upsert read model
  | complete projection rebuild state
```

##### 关键伪代码

```rust
job.validate()?;
let mut receipt = JobRunReceipt::started(job.job_run_id);
let spaces = space_scope_repo.list_spaces(job.space_scope, job.page_request()).await?;

for space in spaces.items {
    let consumers = job.consumer_scope.expand_for_space(space.space_id)?;
    for consumer in consumers {
        let fact_refs = fact_repo.list_fact_refs(space.space_id, job.fact_page()).await?;
        let mut state = load_or_initial_projection_state(space.space_id, ConversationProjectionKind::ReadModel).await?;
        state.begin_rebuild(job.rebuild_ref())?;

        // [ConversationReadModel::from_visible_facts(&ConversationSpace space, Vec<ConversationFactRef> fact_refs, ConsumerRef consumer)]
        let read_model = ConversationReadModel::from_visible_facts(&space, fact_refs.items, consumer)?;

        let uow = unit_of_work.begin().await?;
        projection_repo.upsert_read_model(read_model, uow.clone()).await?;
        state.complete_rebuild(job.source_position)?;
        projection_repo.save_projection_state(state, uow.clone()).await?;
        unit_of_work.commit(uow).await?;
        receipt.count_rebuilt(space.space_id, consumer);
    }
}

Ok(receipt.completed(clock.now()))
```

##### 事务、错误、状态与测试

| 项 | 内容 |
|---|---|
| 事务边界 | 每个 space / consumer 的 read model 与 projection state 同事务 |
| 错误映射 | invalid scope -> job reject;repository failure -> failed projection marker;visibility failure -> skip with evidence |
| 状态副作用 | read model upsert;projection `Rebuilding` -> `Fresh` 或 `Failed` |
| 事件副作用 | 可发布 `ConversationProjectionStateChangedEvent` |
| 测试切口 | single consumer rebuild、multi consumer rebuild、visibility filtered、projection failure exposed |

#### 7.6.3 `RebuildConversationSearchIndexFlow`

##### 入口与目标

| 项 | 内容 |
|---|---|
| 对应协议 | `RebuildConversationSearchIndex` |
| 入口函数 | `run_rebuild_conversation_search_index(RebuildConversationSearchIndexJob job) -> Result<JobRunReceipt, JobError>` |
| Application service | `ConversationSearchRebuildJob.rebuild_search_index(...)` |
| 目标对象 | `SearchIndexProjection`、`ConversationProjectionState` |

##### 函数级调用图

```text
[jobs::projection_rebuild]
  | call run_rebuild_conversation_search_index(RebuildConversationSearchIndexJob job)
  v
[ConversationDerivedMaintenanceService]
  | list spaces by job scope
  | read existing read models
  | call SearchIndexProjection::from_read_model(...)
  | merge indexed refs without payload body
  v
[ProjectionRepository]
  | upsert search projection
  | complete projection state
```

##### 关键伪代码

```rust
job.validate()?;
let mut receipt = JobRunReceipt::started(job.job_run_id);
let spaces = space_scope_repo.list_spaces(job.space_scope, job.page_request()).await?;

for space in spaces.items {
    let read_models = projection_repo.list_read_models(space.space_id, job.page_request()).await?;
    let mut projection = SearchIndexProjection::empty_for_space(space.space_id);

    for read_model in read_models.items {
        let candidate = SearchIndexProjection::from_read_model(&read_model)?;
        for fact_ref in candidate.indexed_fact_refs {
            projection.attach_fact_ref(fact_ref)?;
        }
        for manifestation_ref in candidate.indexed_manifestation_refs {
            projection.attach_manifestation_ref(manifestation_ref)?;
        }
    }

    let mut state = load_or_initial_projection_state(space.space_id, ConversationProjectionKind::Search).await?;
    state.begin_rebuild(job.rebuild_ref())?;

    let uow = unit_of_work.begin().await?;
    projection_repo.upsert_search_projection(projection, uow.clone()).await?;
    state.complete_rebuild(job.source_position)?;
    projection_repo.save_projection_state(state, uow.clone()).await?;
    unit_of_work.commit(uow).await?;
    receipt.count_indexed(space.space_id);
}

Ok(receipt.completed(clock.now()))
```

##### 事务、错误、状态与测试

| 项 | 内容 |
|---|---|
| 事务边界 | 每个 space 的 search projection 与 projection state 同事务 |
| 错误映射 | stale read model -> degraded / failed marker;body copy detected -> job failed;repository failure -> failed marker |
| 状态副作用 | search projection upsert;projection state fresh / failed |
| 事件副作用 | 可发布 `ConversationProjectionStateChangedEvent` |
| 测试切口 | empty space index、refs only、stale read model handling、failure marker exposed |

#### 7.6.4 `MaintainConversationChangeCursorsFlow`

##### 入口与目标

| 项 | 内容 |
|---|---|
| 对应协议 | `MaintainConversationChangeCursors` |
| 入口函数 | `run_maintain_conversation_change_cursors(MaintainConversationChangeCursorsJob job) -> Result<JobRunReceipt, JobError>` |
| Application service | `ConversationCursorMaintenanceJob.maintain_cursors(...)` |
| 目标对象 | `ChangeCursorProjection`、`ConversationChangeCursor`、`ConversationProjectionState` |

##### 函数级调用图

```text
[jobs::cursor_maintenance]
  | call run_maintain_conversation_change_cursors(MaintainConversationChangeCursorsJob job)
  v
[ConversationDerivedMaintenanceService]
  | list committed outbox records with cursor metadata after position
  | call ChangeCursorProjection::from_change_log(...)
  | advance consumer cursors when allowed
  v
[ProjectionRepository]
  | upsert change cursor projection
  | save changed cursors
  | save projection state
```

##### 关键伪代码

```rust
job.validate()?;
let mut receipt = JobRunReceipt::started(job.job_run_id);
let spaces = space_scope_repo.list_spaces(job.space_scope, job.page_request()).await?;

for space in spaces.items {
    let outbox_records = outbox_repo.list_committed_since(space.space_id, job.outbox_position, job.page_limit()).await?;
    let projection = ChangeCursorProjection::from_change_log(space.space_id, outbox_records)?;
    let consumers = job.cursor_scope.expand_for_space(space.space_id)?;

    let uow = unit_of_work.begin().await?;
    for consumer in consumers {
        let mut cursor = projection_repo.get_change_cursor(space.space_id, consumer).await?.unwrap_or_else(|| ConversationChangeCursor::start_from(space.space_id, consumer, ConversationFactSequence::zero()));
        if let Some(cursor_ref) = projection.cursor_for(consumer) {
            cursor.advance(cursor_ref.fact_sequence, cursor_ref.outbox_sequence)?;
            projection_repo.save_change_cursor(cursor, uow.clone()).await?;
            receipt.count_cursor_advanced(space.space_id, consumer);
        }
    }

    projection_repo.upsert_change_cursor_projection(projection, uow.clone()).await?;
    unit_of_work.commit(uow).await?;
}

Ok(receipt.completed(clock.now()))
```

##### 事务、错误、状态与测试

| 项 | 内容 |
|---|---|
| 事务边界 | 每个 space 的 cursor projection 和 cursor advances 同事务 |
| 错误映射 | invalid cursor scope -> reject;outbox gap -> stale cursor marker;repository failure -> failed job receipt |
| 状态副作用 | cursor position 前进;change cursor projection upsert |
| 事件副作用 | 无直接 event;可触发 projection state changed evidence |
| 测试切口 | advances cursor、outbox gap marks stale、new cursor starts from zero、no fact deletion |

#### 7.6.5 `RefreshExternalReferenceSnapshotsFlow`

##### 入口与目标

| 项 | 内容 |
|---|---|
| 对应协议 | `RefreshExternalReferenceSnapshots` |
| 入口函数 | `run_refresh_external_reference_snapshots(RefreshExternalReferenceSnapshotsJob job) -> Result<JobRunReceipt, JobError>` |
| Application service | `ConversationSnapshotRefreshJob.refresh_external_references(...)` |
| 目标对象 | `ExternalFactSnapshot`、`ExternalReferenceProjection`、`ReferenceResolutionState` |

##### 函数级调用图

```text
[jobs::snapshot_refresh]
  | call run_refresh_external_reference_snapshots(RefreshExternalReferenceSnapshotsJob job)
  v
[ExternalReferenceIngestionService]
  | list reference projections by scope
  | resolve each external fact ref
  | load safe snapshot only
  | mark unresolved on resolver failure
  v
[ExternalReferenceRepository]
  | upsert snapshot
  | upsert reference projection
```

##### 关键伪代码

```rust
job.validate()?;
let mut receipt = JobRunReceipt::started(job.job_run_id);
let projections = external_ref_repo.list_reference_projections(job.space_scope, job.page_request()).await?;

for mut projection in projections.items {
    let visibility = space_scope_repo.get_visibility_scope(projection.space_id).await?.ok_or(JobError::MissingVisibilityScope)?;
    let uow = unit_of_work.begin().await?;

    for external_ref in projection.external_fact_refs.clone() {
        match external_resolver.load_safe_snapshot(external_ref.clone(), visibility.clone()).await {
            Ok(snapshot) => {
                projection.attach_snapshot(snapshot.snapshot_ref())?;
                external_ref_repo.upsert_snapshot(snapshot, uow.clone()).await?;
                receipt.count_snapshot_refreshed(external_ref);
            }
            Err(error) => {
                projection.mark_unresolved(ReferenceResolutionReason::from_resolver_error(error))?;
                receipt.count_unresolved(external_ref);
            }
        }
    }

    external_ref_repo.upsert_reference_projection(projection, uow.clone()).await?;
    unit_of_work.commit(uow).await?;
}

Ok(receipt.completed(clock.now()))
```

##### 事务、错误、状态与测试

| 项 | 内容 |
|---|---|
| 事务边界 | 每个 reference projection 的 snapshot refs 与 projection state 同事务 |
| 错误映射 | resolver failure -> unresolved marker;digest mismatch -> digest mismatch evidence;repository failure -> failed job |
| 状态副作用 | snapshot upsert;reference projection fresh / unresolved |
| 事件副作用 | 无 conversation fact event |
| 测试切口 | refresh snapshot、resolver failure unresolved、digest mismatch evidence、source body not stored |

#### 7.6.6 `DeliverTraceHandoffFlow`

##### 入口与目标

| 项 | 内容 |
|---|---|
| 对应协议 | `DeliverTraceHandoff` |
| 入口函数 | `run_deliver_trace_handoff(DeliverTraceHandoffJob job) -> Result<JobRunReceipt, JobError>` |
| Application service | `TraceHandoffDeliveryJob.deliver_trace_handoffs(...)` |
| 目标对象 | `TraceHandoffRecord` handoff state |

##### 函数级调用图

```text
[jobs::handoff_delivery]
  | call run_deliver_trace_handoff(DeliverTraceHandoffJob job)
  v
[TraceHandoffDeliveryJob]
  | list pending trace handoffs
  | load trace context
  | call TraceHandoffPort.deliver_trace_handoff(...)
  | tx per handoff to mark handed off, retry, or failed
  v
[TraceRepository]
  | save trace handoff state
```

##### 关键伪代码

```rust
job.validate()?;
let mut receipt = JobRunReceipt::started(job.job_run_id);
let handoffs = trace_repo.list_pending_trace_handoffs(job.trace_handoff_scope, job.page_request()).await?;

for candidate in handoffs.items {
    let trace_context = trace_repo.get_trace_context(candidate.trace_context_id).await?.ok_or(JobError::MissingTraceContext)?;
    let delivery = trace_handoff_port.deliver_trace_handoff(candidate.clone(), trace_context).await;

    let uow = unit_of_work.begin().await?;
    let mut handoff = trace_repo.get_trace_handoff_for_update(candidate.trace_handoff_id, uow.clone()).await?.ok_or(JobError::MissingHandoff)?;

    match delivery {
        Ok(receipt_ref) => {
            handoff.mark_handed_off(receipt_ref, clock.now())?;
            receipt.count_handoff_delivered(handoff.trace_handoff_id);
        }
        Err(error) if error.is_retryable() && job.retry_policy.allows_trace_retry(&handoff) => {
            handoff.mark_retry(HandoffRetryReason::from_error(error), job.next_retry_at(clock.now()))?;
            receipt.count_handoff_retry(handoff.trace_handoff_id);
        }
        Err(error) => {
            handoff.mark_failed(HandoffFailureReason::from_error(error), job.actor_ref())?;
            receipt.count_handoff_failed(handoff.trace_handoff_id);
        }
    }

    trace_repo.save_trace_handoff(handoff, uow.clone()).await?;
    unit_of_work.commit(uow).await?;
}

Ok(receipt.completed(clock.now()))
```

##### 事务、错误、状态与测试

| 项 | 内容 |
|---|---|
| 事务边界 | 外部 handoff 不包在 DB 事务内;每条 handoff state 独立事务 |
| 错误映射 | transient handoff -> retry;permanent handoff -> failed;missing trace -> failed job evidence |
| 状态副作用 | `Pending` / `RetryPending` -> `HandedOff`、`RetryPending` 或 `Failed` |
| 事件副作用 | 无反写 truth event;job receipt 暴露 external receipt ref |
| 测试切口 | delivered、retryable failure、permanent failure、missing trace context |

#### 7.6.7 `DeliverArchiveHandoffFlow`

##### 入口与目标

| 项 | 内容 |
|---|---|
| 对应协议 | `DeliverArchiveHandoff` |
| 入口函数 | `run_deliver_archive_handoff(DeliverArchiveHandoffJob job) -> Result<JobRunReceipt, JobError>` |
| Application service | `ArchiveHandoffDeliveryJob.deliver_archive_handoffs(...)` |
| 目标对象 | `ArchiveHandoffRecord` handoff state |

##### 函数级调用图

```text
[jobs::handoff_delivery]
  | call run_deliver_archive_handoff(DeliverArchiveHandoffJob job)
  v
[ArchiveHandoffDeliveryJob]
  | list pending archive handoffs
  | load trace context for package material
  | call ArchiveHandoffPort.deliver_archive_handoff(...)
  | tx per handoff to mark archived, retry, or failed
  v
[TraceRepository]
  | save archive handoff state
```

##### 关键伪代码

```rust
job.validate()?;
let mut receipt = JobRunReceipt::started(job.job_run_id);
let handoffs = trace_repo.list_pending_archive_handoffs(job.archive_handoff_scope, job.page_request()).await?;

for candidate in handoffs.items {
    let trace_context = trace_repo.get_trace_context(candidate.trace_context_id).await?.ok_or(JobError::MissingTraceContext)?;
    let delivery = archive_handoff_port.deliver_archive_handoff(candidate.clone(), trace_context).await;

    let uow = unit_of_work.begin().await?;
    let mut handoff = trace_repo.get_archive_handoff_for_update(candidate.archive_handoff_id, uow.clone()).await?.ok_or(JobError::MissingHandoff)?;

    match delivery {
        Ok(package_ref) => {
            handoff.mark_archived(package_ref, clock.now())?;
            receipt.count_archive_delivered(handoff.archive_handoff_id);
        }
        Err(error) if error.is_retryable() && job.retry_policy.allows_archive_retry(&handoff) => {
            handoff.mark_retry(HandoffRetryReason::from_error(error), job.next_retry_at(clock.now()))?;
            receipt.count_archive_retry(handoff.archive_handoff_id);
        }
        Err(error) => {
            handoff.mark_failed(HandoffFailureReason::from_error(error), job.actor_ref())?;
            receipt.count_archive_failed(handoff.archive_handoff_id);
        }
    }

    trace_repo.save_archive_handoff(handoff, uow.clone()).await?;
    unit_of_work.commit(uow).await?;
}

Ok(receipt.completed(clock.now()))
```

##### 事务、错误、状态与测试

| 项 | 内容 |
|---|---|
| 事务边界 | 外部 archive delivery 不包在 DB 事务内;每条 archive state 独立事务 |
| 错误映射 | transient archive error -> retry;permanent archive error -> failed;missing trace -> failed job evidence |
| 状态副作用 | `Pending` / `RetryPending` -> `Archived`、`RetryPending` 或 `Failed` |
| 事件副作用 | 无本仓 truth event;job receipt 暴露 archive package refs |
| 测试切口 | archived、retryable archive failure、permanent failure、archive package body not stored |

#### 7.6.8 `ValidateConversationConsistencyFlow`

##### 入口与目标

| 项 | 内容 |
|---|---|
| 对应协议 | `ValidateConversationConsistency` |
| 入口函数 | `run_validate_conversation_consistency(ValidateConversationConsistencyJob job) -> Result<JobRunReceipt, JobError>` |
| Application service | `ConversationConsistencyValidationJob.validate(...)` |
| 目标对象 | `ConversationProjectionState` diagnostic evidence、`ExternalReferenceProjection` diagnostic evidence |

##### 函数级调用图

```text
[jobs::consistency_validation]
  | call run_validate_conversation_consistency(ValidateConversationConsistencyJob job)
  v
[ConversationConsistencyValidationJob]
  | list spaces by scope
  | compare truth refs, read models, cursor projection, search projection
  | compare external reference projection with snapshots
  | produce report evidence only
  v
[JobRunReceipt]
  | return report ref, issue count, suggested repair refs
```

##### 关键伪代码

```rust
job.validate()?;
let mut receipt = JobRunReceipt::started(job.job_run_id);
let spaces = space_scope_repo.list_spaces(job.space_scope, job.page_request()).await?;

for space in spaces.items {
    let facts = fact_repo.list_facts(space.space_id, job.fact_page()).await?;
    let read_models = projection_repo.list_read_models(space.space_id, job.page_request()).await?;
    let search_projection = projection_repo.get_search_projection(space.space_id).await?;
    let reference_projection = external_ref_repo.get_reference_projection(space.space_id).await?;

    let issues = consistency_checker.compare(space, facts.items, read_models.items, search_projection, reference_projection)?;
    receipt.record_consistency_issues(issues);
}

receipt.attach_report_ref(job.report_output_ref);
Ok(receipt.completed(clock.now()))
```

##### 事务、错误、状态与测试

| 项 | 内容 |
|---|---|
| 事务边界 | 只读 job;不自动修复、不写 truth |
| 错误映射 | missing projection -> issue evidence;repository failure -> failed job;invalid profile -> reject |
| 状态副作用 | 无直接状态变更;只输出 diagnostic evidence |
| 事件副作用 | 无 |
| 测试切口 | clean report、missing read model issue、stale cursor issue、no automatic repair |

#### 7.6.9 `CleanupExpiredConversationCursorsFlow`

##### 入口与目标

| 项 | 内容 |
|---|---|
| 对应协议 | `CleanupExpiredConversationCursors` |
| 入口函数 | `run_cleanup_expired_conversation_cursors(CleanupExpiredConversationCursorsJob job) -> Result<JobRunReceipt, JobError>` |
| Application service | `ConversationCursorCleanupJob.cleanup_expired_cursors(...)` |
| 目标对象 | `ConversationChangeCursor` derived state |

##### 函数级调用图

```text
[jobs::cursor_cleanup]
  | call run_cleanup_expired_conversation_cursors(CleanupExpiredConversationCursorsJob job)
  v
[ConversationCursorCleanupJob]
  | list expired cursors by consumer scope
  | validate retention window
  | delete derived cursor state only
  v
[ProjectionRepository]
  | delete change cursor
  | return cleanup evidence
```

##### 关键伪代码

```rust
job.validate()?;
let mut receipt = JobRunReceipt::started(job.job_run_id);
let cursors = projection_repo.list_expired_change_cursors(job.cursor_scope, job.expired_before, job.page_request()).await?;

let uow = unit_of_work.begin().await?;
for cursor in cursors.items {
    if cursor.cursor_state == ConversationChangeCursorState::Expired {
        projection_repo.delete_change_cursor(cursor.cursor_id, uow.clone()).await?;
        receipt.count_cursor_cleaned(cursor.cursor_id);
    } else {
        receipt.count_cursor_skipped(cursor.cursor_id);
    }
}
unit_of_work.commit(uow).await?;

Ok(receipt.completed(clock.now()))
```

##### 事务、错误、状态与测试

| 项 | 内容 |
|---|---|
| 事务边界 | 单批 cursor cleanup 事务;失败则本批回滚 |
| 错误映射 | invalid retention window -> reject;repository failure -> failed job;active cursor -> skipped |
| 状态副作用 | 删除过期派生 cursor;不删除 fact、outbox、read model truth |
| 事件副作用 | 无 |
| 测试切口 | expired cleaned、active skipped、invalid window rejected、facts untouched |

## 8. 回填草稿

> 本节不重复粘贴 §7 的完整处理流。正式 `03-详细设计.md` 生成 §8 时,应从下列中间产物章节摘录并压缩为正式文本。

正式文档 §8 建议采用以下结构:

```text
## 8. 逐接口函数级处理流

### 8.1 处理流总表
引用: design-calibration/03_ddd_step_09_function_flows.md §7.1

### 8.2 Command API 处理流
引用: design-calibration/03_ddd_step_09_function_flows.md §7.2

### 8.3 Query API 处理流
引用: design-calibration/03_ddd_step_09_function_flows.md §7.3

### 8.4 Inbound Event Consumer 处理流
引用: design-calibration/03_ddd_step_09_function_flows.md §7.4

### 8.5 Outbound Event Publish 处理流
引用: design-calibration/03_ddd_step_09_function_flows.md §7.5

### 8.6 Operations Job 处理流
引用: design-calibration/03_ddd_step_09_function_flows.md §7.6
```

正式回填时必须保留的设计结论:

| 正式章节 | 必须回填的内容 | 来源 |
|---|---|---|
| §8.1 | 45 个处理流总表,覆盖 Command、Query、Inbound Consumer、Outbound Event、Job | 本文件 §7.1 |
| §8.2 | 10 个 Command API 的入口、事务、outbox、状态和测试切口 | 本文件 §7.2 |
| §8.3 | 11 个 Query API 的只读边界、可见性裁剪、projection stale 暴露 | 本文件 §7.3 |
| §8.4 | 6 个 Inbound Consumer 的幂等、quarantine / retry、source truth 不复制规则 | 本文件 §7.4 |
| §8.5 | 9 个 Outbound Event 的 publish flow,明确 publish 不等于 truth commit | 本文件 §7.5 |
| §8.6 | 9 个 Operations Job 的批处理、事务、projection、handoff 和 cleanup 规则 | 本文件 §7.6 |

本步对前序 Step 的回写:

| 回写目标 | 回写内容 | 原因 |
|---|---|---|
| `03_ddd_step_06_object_contracts.md` | `ArchiveHandoffRecord` 补 `trace_context_id: ConversationTraceContextId`,并调整 `from_space_close(...)` 参数 | `DeliverArchiveHandoffFlow` 必须能从 archive handoff 找到 trace context |
| `03_ddd_step_07_trait_port_adapter_contracts.md` | 补批量读取、cursor cleanup、change projection、handoff pending list、projection state publish 等 port 函数 | Step 9 job 处理流必须能回指真实 port 契约 |
| `03_ddd_step_09_function_flows.md` | 修正 `PollConversationChangesFlow` 和 `ConsumeBridgeMappedFactReceivedFlow` 的缺失引用 | 避免调用不存在的 `change_projection_repo` / `space_snapshot` |

## 9. 待确认事项

本步无阻塞性待确认事项。以下为进入后续 Step 时必须继续复核的实现注意项:

| 注意项 | 当前口径 | 后续复核位置 |
|---|---|---|
| job evidence / report 输出 | `JobRunReceipt` 承载 report ref、issue count、failed refs;不在 Step 9 新增独立 report repository | Step 14 审计 / 日志 / 可观测性与 Step 16 测试切口 |
| projection state changed event | projection state 事件不走 truth outbox,由 `ConversationOutboxPublisherPort.publish_projection_state_changed(...)` 发布 | Step 11 事务一致性与 Step 14 审计 |
| publish 外部调用事务 | publish / handoff 外部调用不包在 DB 事务内,只把结果状态写回本仓 repository | Step 11 事务一致性与 Step 13 并发幂等 |
| batch job 分页 | Step 9 只定义 page / limit 语义,不锁具体分页游标实现 | Step 13 并发幂等与 Step 15 配置 |

## 10. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| 每个协议都有处理流 | 通过 | 10 Command、11 Query、6 Inbound Consumer、9 Outbound Event、9 Job 均已覆盖 |
| 每个处理流都有 ASCII 调用图 | 通过 | 每个 flow 均包含 `text` 代码块图 |
| 每个处理流都有伪代码 | 通过 | 伪代码标明入口 DTO、domain factory、repository / port 调用 |
| 事务边界明确 | 通过 | 写流程、publish job、handoff job、只读 query、cleanup job 已分别说明 |
| 错误映射明确 | 通过 | 每个 flow 均列出 protocol / repository / resolver / publish / job 错误处理 |
| 状态副作用明确 | 通过 | truth state、projection state、outbox publication、handoff state、cursor cleanup 已区分 |
| 测试切口明确 | 通过 | 每个 flow 均列出最小测试切口 |
| 可进入 Step 10 状态矩阵 | 通过 | 下一步可基于本文件涉及的状态变化整理状态机和状态流转矩阵 |
