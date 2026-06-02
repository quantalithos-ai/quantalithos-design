# Step 8. 关键处理流 / 重要函数数据流

> 对应 SOP: `standards/document/概要设计讨论流程_SOP.md` Step 8
> 回填章节: `02-概要设计.md` §8 关键处理流 / 重要函数数据流
> 生成日期: 2026-06-01
> 状态: 已完成

---

## 1. 本步目标

在 Step 7 已收稳接口骨架后,说明关键 Command、Query、Inbound Event Consumer 和 Operations Job 如何穿过入口、application service、domain object / projection / outbox,并形成结果或派生输出。

本步只写概要设计层处理流:入口、关键 service、关键 domain / projection / outbox 动作、事务内外大体边界、主要禁止事项和详细设计承接点。本步不写完整伪代码、完整 Rust 签名、返回类型、错误码全集、retry 参数、SQL / DDL、topic / HTTP / JSON / proto 细节。

---

## 2. 本步输入

| 输入 | 状态 | 用途 |
|---|---|---|
| `02_hld_step_05_components_boundary.md` | 已完成 | 提供主要组成部分职责和边界 |
| `02_hld_step_06_key_objects.md` | 已完成 | 提供关键对象、状态和函数骨架 |
| `02_hld_step_07_api_interface_skeleton.md` | 已完成 | 提供 Command、Query、Consumer、Event、Job 骨架 |
| `01_arch_step_09_interactions_communication.md` | 已完成 | 提供同步、异步和后台承接口径 |

---

## 3. SOP 问题回答

### 3.1 每个关键 Command 的写路径如何进入 application service、domain object、repository / outbox？

Command 从同步入口进入,先完成 metadata、actor、幂等和基本输入校验,再进入对应 application service。Application service 编排读取必要 truth / reference / policy,调用 domain object 或 policy 形成正式对象变化,最后在同一 truth 写事务中保存 truth、history / trace、outbox 和幂等完成记录。投影、outbox 发布、快照刷新和 handoff 实际交付不属于 Command 同步成功前置。

### 3.2 每个关键 Query 如何读取 projection 或只读视图？

Query 从只读入口进入,先确认 actor / consumer context,再读取 read model、projection、truth repository 或 external reference projection。包含 visibility 裁剪、fallback、stale / unresolved / projection rebuilding 判断的 Query 必须画独立处理流;简单读取类 Query 可走通用只读路径并在覆盖清单中说明原因。

### 3.3 每个关键 Inbound Event 如何解析、幂等、转成本地索引或本地记录？

Inbound Event Consumer 从 event envelope 进入,必须以 event id、source ref、envelope ref 和幂等键做重复消费判断。Consumer 可以更新 external reference projection、reference resolution state、manifestation candidate、fact append input、read model stale marker 或 projection state,但不得绕过 Command policy 写入不满足 space / scope / visibility 的正式 fact,也不得复制来源正文。

### 3.4 每个关键 Operations Job 如何基于已持久化事实做发布、重建或对账？

Operations Job 从 job input 和 job metadata 进入,只能读取已持久化 truth、outbox、projection state、handoff record 或 external reference projection。Job 可以更新派生状态、发布 marker、handoff 状态、诊断报告或 cleanup evidence,但不得创建新的业务 fact、scope 或 manifestation truth。

### 3.5 哪些步骤必须在概要设计点名？

必须点名:

- actor / consumer / metadata / idempotency 的入口判断。
- space / participant / visibility / policy 的主边界检查。
- truth、history / trace、outbox 同事务写入的相对边界。
- projection、reference snapshot、handoff、outbox publisher 的异步 / 后台边界。
- stale、unresolved、invalidated、retry pending、failed 等会影响读取或传播的状态输出。

留给详细设计:

- 完整 Rust 函数签名、返回类型、错误码和异常映射。
- repository trait 函数全集、事务句柄类型、数据库表结构。
- event envelope 字段全集、topic、HTTP / RPC / JSON / proto schema。
- retry 参数、调度策略、具体 outbox publisher 实现。

---

## 4. 处理流覆盖清单

| 接口 / 接口组 | 是否画独立处理流 | 原因 |
|---|---|---|
| `CreateConversationSpace` | 是 | P0 Command,创建核心 truth 前置 |
| `CloseConversationSpace` | 是 | P0 Command,改变 space lifecycle 和 truth state |
| `UpdateParticipantScope` | 是 | P0 Command,改变参与范围和可见读取基础 |
| `UpdateVisibilityScope` | 是 | P0 Command,改变可见范围并影响 read model / cursor |
| `AppendConversationFact` | 是 | P0 Command,核心事实追加路径 |
| `RetractConversationFact` | 是 | P0 Command,改变 fact 可见 / 追溯状态 |
| `ManifestExternalFact` | 是 | P0 Command,跨域显化核心路径 |
| `CreateReviewAnchor` | 是 | P0 Command,形成复盘锚点和 trace 关系 |
| `RequestTraceHandoff` | 是 | P0 Command,形成 observability handoff intent |
| `RequestArchiveHandoff` | 是 | P0 Command,形成 archive handoff intent |
| `GetConversationReadModel` | 是 | 包含 visibility 裁剪、projection stale 和 external reference fallback |
| `ListConversationFacts` / `GetConversationFact` | 否 | 可走通用授权读路径,不引入额外状态变化 |
| `GetConversationChangeCursor` / `PollConversationChanges` | 是 | 包含 cursor resume、visibility 复核和 projection not ready 边界 |
| `SearchConversationHistory` | 是 | 包含 search projection、visibility 复核和 result ref 回链 |
| `GetCrossDomainManifestation` | 否 | 可走通用授权读路径和 external reference fallback |
| `GetConversationTraceContext` / `GetReviewAnchor` | 是 | 包含 review visibility、trace retention 和外部 handoff ref 边界 |
| `GetConversationProjectionState` | 否 | 简单只读诊断查询,不改变 truth |
| `GetExternalReferenceProjection` | 是 | 包含 reference resolution state 和 degraded display 边界 |
| 6 个 Inbound Event Consumer | 是 | 都会改写本地 projection、reference state、manifestation candidate 或 fact append input |
| 9 个 Operations Job | 是 | 都影响查询一致性、传播可靠性、handoff 状态或维护证据 |

---

## 5. 通用处理流骨架

#### 通用 Command 写路径处理流

```text
<Command API>
  │
  ▼
<Command Intake>
  - validate ActorContext actor_context
  - validate CommandMetadata command_metadata
  - reserve IdempotencyKey idempotency_key
  │
  ▼
<Application Service>
  - load required truth / reference objects
  - call Policy.assert_xxx(CommandObject command, ActorContext actor_context)
  │
  ▼
<Domain Object / History / Outbox>
  - apply domain state change
  - save truth + history + outbox in one write boundary
  │
  ▼
<Command Result>
  - committed result or rejected result
```

关键说明:

- 该图表达所有 Command 的共同写路径,具体 Command 仍在后续独立展开。
- Command 成功只表示本仓 truth 或 handoff intent 已提交,不表示 outbox 已发布或 projection 已重建。
- 图中没有表达错误码、事务句柄、repository 函数全集或具体协议 schema。

#### 通用授权 Query 读路径处理流

```text
<Query API>
  │
  ▼
<Query Intake>
  - validate ActorContext / ConsumerContext
  - validate QueryMetadata query_metadata
  │
  ▼
<Query Service>
  - load read model / projection / truth refs
  - call VisibilityPolicy.filter_read_model(ConversationReadModel read_model, ConsumerRef consumer_ref)
  │
  ▼
<Projection / Snapshot / Truth View>
  - attach stale / unresolved / not visible markers
  - never write Conversation truth
  │
  ▼
<Query Result>
  - authorized view or explicit marker
```

关键说明:

- 该图覆盖简单事实读取、显化读取和投影状态读取。
- 包含复杂 fallback 或 cursor / search 边界的 Query 仍有独立处理流。
- Query 不追加 fact、不改变 scope、不隐式显化外部事实。

#### 通用 Inbound Event Consumer 处理流

```text
<Inbound Event>
  │
  ▼
<Event Consumer>
  - validate EventEnvelopeRef event_envelope_ref
  - reserve EventId event_id + EventSourceRef event_source_ref + IdempotencyKey idempotency_key
  │
  ▼
<Application Service>
  - map source event to reference / snapshot / candidate
  - call ReferenceValidityPolicy.assert_reference_acceptable(ExternalFactRef external_fact_ref)
  │
  ▼
<Local State / Projection / Outbox>
  - update reference state, projection, manifestation candidate, or append input
  - never copy source body
  │
  ▼
<Consume Result>
  - consumed / duplicate / deferred marker
```

关键说明:

- Consumer 的核心职责是消化来源仓已提交事实或变化通知。
- Consumer 不能绕过 Command policy 写入不满足 space / scope / visibility 的 `ConversationFact`。
- 来源正文、外部平台 message body、runtime 推理过程都不得进入本仓 truth。

#### 通用 Operations Job 处理流

```text
<Operations Job>
  │
  ▼
<Job Runner>
  - validate JobMetadata job_metadata
  - load JobRunId job_run_id and scoped input
  │
  ▼
<Maintenance Service>
  - load committed truth / outbox / projection / handoff records
  - apply rebuild, publish, handoff, refresh, or diagnostic action
  │
  ▼
<Projection / Handoff / Evidence>
  - update derived state or operational marker
  - never create business fact
  │
  ▼
<Job Result>
  - completed / stale / retry / failed / diagnostic marker
```

关键说明:

- Job 只能处理已持久化事实、派生状态、outbox 或 handoff record。
- Job 失败必须留下 marker,不能伪装成成功或覆盖 truth。
- 调度策略、重试参数和 runner 实现留给详细设计。

---

## 6. Command API 处理流

#### CreateConversationSpace 处理流

```text
<CreateConversationSpace>
  │
  ▼
<Command Intake>
  - validate CreateConversationSpaceCommand command
  - reserve IdempotencyKey idempotency_key
  │
  ▼
<ConversationSpaceCommandService>
  - call ConversationTruthPolicy.assert_truth_owner(CreateConversationSpaceCommand command, ActorContext actor_context)
  - prepare initial participant and visibility boundaries
  │
  ▼
<ConversationSpace / ParticipantScope / VisibilityScope>
  - call ConversationSpace.create_project_space(ConversationOwnerRef owner_ref, ActorRef actor_ref)
  - call ParticipantScope.from_initial_participants(ConversationSpaceId space_id, Vec<ConversationParticipantRef> participants)
  - call VisibilityScope.from_participant_scope(ParticipantScope participant_scope, VisibilityLevel default_visibility)
  │
  ▼
<Truth Store / History / Outbox>
  - save space + scopes + truth state + scope change record
  - append ConversationOutboxRecord
  │
  ▼
<ConversationSpaceCommandResult>
```

关键设计点：
- 创建空间是 Conversation truth 的起点,必须同步收口 space、participant scope 和 visibility scope。
- 该流程不创建 workspace、project 或 identity member,只保存 owner / actor 引用。
- outbox 只表达已提交 truth 的传播意图,具体发布留给 `PublishConversationOutbox`。

#### CloseConversationSpace 处理流

```text
<CloseConversationSpace>
  │
  ▼
<Command Intake>
  - validate CloseConversationSpaceCommand command
  - reserve IdempotencyKey idempotency_key
  │
  ▼
<ConversationSpaceCommandService>
  - load ConversationSpace and ConversationTruthState
  - call ConversationSpace.close(ActorRef actor_ref, SpaceCloseReason reason)
  │
  ▼
<ConversationTruthState / ScopeChangeRecord>
  - mark truth read-only or closed
  - call ScopeChangeRecord.from_space_change(ConversationSpace previous_space, ConversationSpace new_space, ActorRef actor_ref)
  │
  ▼
<Truth Store / Outbox>
  - save lifecycle change + scope change record
  - append ConversationOutboxRecord
  │
  ▼
<ConversationSpaceCommandResult>
```

关键设计点：
- 关闭空间只影响本仓 Conversation lifecycle,不关闭项目、工作项或外部平台 channel。
- 关闭后的读取、追溯和交接状态由 Step 9 状态机继续收稳。
- 归档交付不在该 Command 内完成,只能形成后续 handoff intent。

#### UpdateParticipantScope 处理流

```text
<UpdateParticipantScope>
  │
  ▼
<Command Intake>
  - validate UpdateParticipantScopeCommand command
  - reserve IdempotencyKey idempotency_key
  │
  ▼
<ParticipantScopeCommandService>
  - load ConversationSpace and ParticipantScope
  - call VisibilityPolicy.assert_review_allowed(ReviewAnchor review_anchor, ActorRef actor_ref) when review-sensitive
  │
  ▼
<ParticipantScope / ScopeChangeRecord>
  - call ParticipantScope.add_participant(ConversationParticipantRef participant_ref, ActorRef actor_ref)
  - or call ParticipantScope.remove_participant(ConversationParticipantRef participant_ref, ActorRef actor_ref)
  - call ScopeChangeRecord.from_participant_scope_change(ParticipantScope previous_scope, ParticipantScope new_scope, ActorRef actor_ref)
  │
  ▼
<Truth Store / Outbox>
  - save participant scope version + scope change record
  - append ConversationOutboxRecord
  │
  ▼
<ParticipantScopeCommandResult>
```

关键设计点：
- 参与范围变化必须显式发生,Query 或投影不能隐式加入 / 移除参与者。
- 该流程只保存 participant 引用和对话域角色,不维护 Identity 生命周期。
- 受影响 read model / cursor 的失效标记可由后续派生维护承接。

#### UpdateVisibilityScope 处理流

```text
<UpdateVisibilityScope>
  │
  ▼
<Command Intake>
  - validate UpdateVisibilityScopeCommand command
  - reserve IdempotencyKey idempotency_key
  │
  ▼
<VisibilityScopeCommandService>
  - load ConversationSpace, ParticipantScope, VisibilityScope
  - call VisibilityPolicy.assert_can_append(ActorRef actor_ref, ConversationFact fact, VisibilityScope visibility_scope) for write-sensitive changes
  │
  ▼
<VisibilityScope / ConversationChangeCursor>
  - call VisibilityScope.narrow_to(VisibilityRuleSet visibility_rules, ActorRef actor_ref)
  - call ConversationChangeCursor.invalidate(ScopeChangeRecord scope_change_record)
  │
  ▼
<Truth Store / Projection State / Outbox>
  - save visibility scope version + scope change record
  - mark affected read models / cursors stale
  - append ConversationOutboxRecord
  │
  ▼
<VisibilityScopeCommandResult>
```

关键设计点：
- 可见范围变化会影响授权读取和变化感知,必须显式标记受影响 cursor / projection。
- 该流程不执行全局认证或治理裁决,只应用本仓 visibility boundary。
- 详细设计需要继续定义受影响 read model 的定位方式和并发边界。

#### AppendConversationFact 处理流

```text
<AppendConversationFact>
  │
  ▼
<Command Intake>
  - validate AppendConversationFactCommand command
  - reserve IdempotencyKey idempotency_key
  │
  ▼
<ConversationFactAppendService>
  - load ConversationSpace, ParticipantScope, VisibilityScope
  - call FactAppendPolicy.assert_append_allowed(ConversationSpace space, ParticipantScope participant_scope, VisibilityScope visibility_scope)
  - call FactAppendPolicy.assert_source_allowed(FactSourceRef source_ref)
  │
  ▼
<ConversationFact / Trace Context>
  - call ConversationFact.from_append_input(ConversationSpace space, FactSourceRef source_ref, VisibilityScope visibility_scope)
  - call ConversationTraceContext.from_fact_append(ConversationFact fact, FactAppendReceipt receipt)
  │
  ▼
<Fact History / Trace / Outbox>
  - save fact + append receipt + trace context
  - append ConversationOutboxRecord
  │
  ▼
<FactAppendReceipt>
```

关键设计点：
- 事实追加必须同时满足 space、participant、visibility、source 和 append policy。
- 该流程只保存结果性事实或引用,不保存 runtime 推理过程、tool 原始调用过程或 bridge message body。
- projection、search index 和 change cursor 更新不阻塞事实追加成功。

#### RetractConversationFact 处理流

```text
<RetractConversationFact>
  │
  ▼
<Command Intake>
  - validate RetractConversationFactCommand command
  - reserve IdempotencyKey idempotency_key
  │
  ▼
<ConversationFactAppendService>
  - load ConversationFact, VisibilityScope, ConversationTraceContext
  - call VisibilityPolicy.assert_can_read(ConsumerRef consumer_ref, ConversationFact fact, VisibilityScope visibility_scope)
  │
  ▼
<ConversationFact / Trace Context>
  - call ConversationFact.retract(ActorRef actor_ref, FactRetractionReason reason)
  - attach retraction marker to ConversationTraceContext
  │
  ▼
<Fact History / Trace / Outbox>
  - save fact state + trace update
  - append ConversationOutboxRecord
  │
  ▼
<FactAppendReceipt>
```

关键设计点：
- 撤回事实是显式状态变化,不是删除历史事实。
- 撤回不允许下游继续把该 fact 当作 fresh / visible fact 输出。
- 详细设计需要继续定义撤回权限、幂等冲突和历史保留规则。

#### ManifestExternalFact 处理流

```text
<ManifestExternalFact>
  │
  ▼
<Command Intake>
  - validate ManifestExternalFactCommand command
  - reserve IdempotencyKey idempotency_key
  │
  ▼
<ConversationManifestationService>
  - load ConversationSpace and VisibilityScope
  - call ReferenceValidityPolicy.assert_reference_acceptable(ExternalFactRef external_fact_ref)
  - call ManifestationPolicy.assert_manifestable(ExternalFactRef external_fact_ref, ConversationSpace space)
  │
  ▼
<CrossDomainManifestation / ExternalFactSnapshot>
  - call CrossDomainManifestation.from_external_fact(ConversationSpace space, ExternalFactRef external_fact_ref, VisibilityScope visibility_scope)
  - call ConversationFact.from_manifestation(CrossDomainManifestation manifestation, VisibilityScope visibility_scope)
  │
  ▼
<Manifestation Store / Fact History / Trace / Outbox>
  - save manifestation + optional snapshot + conversation fact + trace context
  - append ConversationOutboxRecord
  │
  ▼
<ManifestExternalFactResult>
```

关键设计点：
- 显化记录属于 Conversation truth,但来源事实正文和生命周期仍归来源仓。
- 来源不可解析时只能形成 rejected / unresolved / deferred 结果,不得补造来源事实。
- 具体 snapshot resolver、来源 digest 校验和错误映射留到详细设计。

#### CreateReviewAnchor 处理流

```text
<CreateReviewAnchor>
  │
  ▼
<Command Intake>
  - validate CreateReviewAnchorCommand command
  - reserve IdempotencyKey idempotency_key
  │
  ▼
<ConversationTraceReviewService>
  - load target fact / manifestation / scope change / handoff
  - call VisibilityPolicy.assert_review_allowed(ReviewAnchor review_anchor, ActorRef actor_ref)
  │
  ▼
<ReviewAnchor / ConversationTraceContext>
  - call ReviewAnchor.for_fact(ConversationFact fact, ActorRef actor_ref, ReviewReasonRef reason_ref)
  - attach review anchor to ConversationTraceContext
  │
  ▼
<Trace Store / Outbox>
  - save review anchor + trace context update
  - append ConversationOutboxRecord when downstream needs awareness
  │
  ▼
<ReviewAnchorCommandResult>
```

关键设计点：
- 复盘锚点只定位审查对象,不替代治理裁决或审计报告。
- 该流程必须经过 visibility / review policy,不能暴露不可见事实。
- 详细设计需要继续定义不同 target kind 的装配和权限细节。

#### RequestTraceHandoff 处理流

```text
<RequestTraceHandoff>
  │
  ▼
<Command Intake>
  - validate RequestTraceHandoffCommand command
  - reserve IdempotencyKey idempotency_key
  │
  ▼
<ConversationTraceReviewService>
  - load ConversationTraceContext
  - call TraceRetentionPolicy.assert_handoff_allowed(TraceHandoffRecord handoff_record)
  │
  ▼
<TraceHandoffRecord / ConversationOutboxRecord>
  - call TraceHandoffRecord.from_trace_context(ConversationTraceContext trace_context, ObservabilityDestinationRef destination_ref)
  - build outbox record for handoff requested event
  │
  ▼
<Trace Store / Outbox>
  - save trace handoff record
  - append ConversationOutboxRecord
  │
  ▼
<TraceHandoffCommandResult>
```

关键设计点：
- Command 只创建 observability handoff intent,不在同步路径完成外部交付。
- handoff payload 必须是脱敏引用或摘要,不得包含 forbidden body。
- 交付成功、重试和失败由 `DeliverTraceHandoff` 继续处理。

#### RequestArchiveHandoff 处理流

```text
<RequestArchiveHandoff>
  │
  ▼
<Command Intake>
  - validate RequestArchiveHandoffCommand command
  - reserve IdempotencyKey idempotency_key
  │
  ▼
<ConversationTraceReviewService>
  - load ConversationSpace and ConversationTraceContext
  - call TraceRetentionPolicy.choose_archive_scope(ConversationSpace space, ConversationTraceContext trace_context)
  │
  ▼
<ArchiveHandoffRecord / ConversationOutboxRecord>
  - call ArchiveHandoffRecord.from_trace_context(ConversationTraceContext trace_context, ArchiveScope archive_scope)
  - build outbox record for archive handoff requested event
  │
  ▼
<Trace Store / Outbox>
  - save archive handoff record
  - append ConversationOutboxRecord
  │
  ▼
<ArchiveHandoffCommandResult>
```

关键设计点：
- Command 只创建 archive handoff intent,不保存归档包正文。
- Archive 不反写 Conversation truth,归档失败只能改变 handoff 状态。
- 详细设计需要继续定义 archive scope、retention rule 和 package ref 的精确契约。

---

## 7. Query API 处理流

#### GetConversationReadModel 处理流

```text
<GetConversationReadModel>
  │
  ▼
<Query Intake>
  - validate ConsumerContext consumer_context
  - validate QueryMetadata query_metadata
  │
  ▼
<AuthorizedConversationQueryService>
  - load ConversationReadModel and VisibilityScope
  - load ExternalReferenceProjection for display fragments
  │
  ▼
<VisibilityPolicy / Projection State>
  - call VisibilityPolicy.filter_read_model(ConversationReadModel read_model, ConsumerRef consumer_ref)
  - attach ConversationProjectionState and ReferenceResolutionState markers
  │
  ▼
<Read Projection Result>
  - return visible facts, visible manifestations, stale / unresolved markers
```

关键设计点：
- read model 输出必须已经按 consumer visibility 裁剪。
- stale / unresolved / projection rebuilding 必须作为结果 marker 暴露,不能伪装 fresh。
- 详细设计继续定义分页、排序、一致性标记和 projection fallback 策略。

#### GetConversationChangeCursor 处理流

```text
<GetConversationChangeCursor>
  │
  ▼
<Query Intake>
  - validate ConsumerContext consumer_context
  - validate QueryMetadata query_metadata
  │
  ▼
<AuthorizedConversationQueryService>
  - load ConversationChangeCursor and VisibilityScope
  - load ConversationProjectionState for cursor projection
  │
  ▼
<ConversationChangeCursor / VisibilityPolicy>
  - call ConversationChangeCursor.can_resume(VisibilityScope visibility_scope, ConsumerRef consumer_ref)
  - attach active / stale / expired / invalidated marker
  │
  ▼
<Cursor Query Result>
  - return cursor or explicit non-resumable marker
```

关键设计点：
- cursor resume 必须重新校验 visibility,不能只信任旧 cursor token。
- cursor 状态不是 fact sequence truth,只能表达消费位置。
- 具体 cursor token 编码、过期窗口和恢复错误留给详细设计。

#### PollConversationChanges 处理流

```text
<PollConversationChanges>
  │
  ▼
<Query Intake>
  - validate ConsumerContext consumer_context
  - validate QueryMetadata query_metadata
  │
  ▼
<AuthorizedConversationQueryService>
  - load ConversationChangeCursor and ChangeCursorProjection
  - load VisibilityScope for changed facts
  │
  ▼
<ChangeCursorProjection / VisibilityPolicy>
  - call ChangeCursorProjection.cursor_for(ConsumerRef consumer_ref)
  - filter visible changes through VisibilityPolicy
  │
  ▼
<ConversationChangePage>
  - return visible change refs and next cursor marker
```

关键设计点：
- 变化感知只提示已形成且对 consumer 可见的变化。
- 该流程不返回完整 fact payload,只返回 ref、state 和 change marker。
- projection not ready、cursor expired 和 visibility changed 的处理细节留到 Step 10 / 详细设计。

#### SearchConversationHistory 处理流

```text
<SearchConversationHistory>
  │
  ▼
<Query Intake>
  - validate ConsumerContext consumer_context
  - validate QueryMetadata query_metadata
  │
  ▼
<AuthorizedConversationQueryService>
  - load SearchIndexProjection and ConversationProjectionState
  - load VisibilityScope for result filtering
  │
  ▼
<SearchIndexProjection / VisibilityPolicy>
  - call SearchIndexProjection.covers_position(ConversationSourcePosition source_position)
  - filter result refs through VisibilityPolicy
  │
  ▼
<ConversationSearchResultPage>
  - return fact / manifestation refs and projection state marker
```

关键设计点：
- 搜索结果必须回链到 `ConversationFactRef` 或 `CrossDomainManifestationRef`。
- search index 不保存 forbidden body,也不成为第二 truth。
- 排序、score、tokenization、索引产品和分页实现留给详细设计。

#### GetConversationTraceContext 处理流

```text
<GetConversationTraceContext>
  │
  ▼
<Query Intake>
  - validate ActorContext actor_context
  - validate QueryMetadata query_metadata
  │
  ▼
<ConversationTraceReviewService>
  - load ConversationTraceContext and ReviewAnchor set
  - load VisibilityScope and TraceRetentionPolicy
  │
  ▼
<Trace Context / Review Anchor>
  - call ReviewAnchor.visible_under(VisibilityScope visibility_scope, ConsumerRef consumer_ref)
  - attach trace handoff and archive handoff refs
  │
  ▼
<ConversationTraceContextView>
  - return visible trace refs, review anchors, handoff markers
```

关键设计点：
- trace query 只能输出可见引用、锚点和脱敏摘要。
- review anchor 不替代 governance decision 或全局 audit report。
- 详细设计继续定义 trace view 的裁剪规则、retention marker 和 handoff evidence。

#### GetExternalReferenceProjection 处理流

```text
<GetExternalReferenceProjection>
  │
  ▼
<Query Intake>
  - validate ConsumerContext consumer_context
  - validate QueryMetadata query_metadata
  │
  ▼
<AuthorizedConversationQueryService>
  - load ExternalReferenceProjection and ExternalFactSnapshot
  - load VisibilityScope for display fragment
  │
  ▼
<ExternalReferenceProjection / ReferenceValidityPolicy>
  - call ExternalReferenceProjection.to_read_model_fragment(VisibilityScope visibility_scope, ConsumerRef consumer_ref)
  - call ReferenceValidityPolicy.choose_degraded_view(ExternalFactRef external_fact_ref, ReferenceResolutionState resolution_state)
  │
  ▼
<ExternalReferenceProjectionView>
  - return display marker, snapshot ref, resolution state
```

关键设计点：
- external reference query 必须暴露 fresh、stale、pending、unresolved 或 invalid。
- 降级展示不能补造来源 truth,也不能输出来源正文。
- 来源 resolver、digest 校验和快照刷新触发留给 Job / 详细设计。

---

## 8. Inbound Event Consumer 处理流

#### ConsumeWorkContextChanged 处理流

```text
<ConsumeWorkContextChanged>
  │
  ▼
<Event Consumer>
  - validate WorkContextChangedEvent event
  - reserve EventId event_id + EventSourceRef event_source_ref + IdempotencyKey idempotency_key
  │
  ▼
<ConversationManifestationService>
  - map work context change to ExternalFactRef
  - call ReferenceValidityPolicy.assert_reference_acceptable(ExternalFactRef external_fact_ref)
  │
  ▼
<ExternalReferenceProjection / ReferenceResolutionState>
  - update work context display marker
  - mark related ConversationReadModel stale when needed
  │
  ▼
<Consume Result>
  - consumed / duplicate / unresolved marker
```

关键设计点：
- Work context changed 只更新引用投影或 stale marker,不创建 work truth。
- 若项目 / 工作上下文不可解析,只能形成 unresolved 状态。
- 详细设计继续定义来源版本、digest 和受影响 conversation 定位方式。

#### ConsumeGovernanceFactCommitted 处理流

```text
<ConsumeGovernanceFactCommitted>
  │
  ▼
<Event Consumer>
  - validate GovernanceFactCommittedEvent event
  - reserve EventId event_id + EventSourceRef event_source_ref + IdempotencyKey idempotency_key
  │
  ▼
<ConversationManifestationService>
  - build ExternalFactRef for governance fact
  - call ManifestationPolicy.assert_manifestable(ExternalFactRef external_fact_ref, ConversationSpace space)
  │
  ▼
<ExternalFactSnapshot / Manifestation Candidate>
  - save governance display snapshot or unresolved marker
  - create manifestation candidate when target space is known
  │
  ▼
<Consume Result>
  - consumed / candidate created / deferred marker
```

关键设计点：
- Governance 结论可以被显化,但裁决 truth 仍归 `L1-governance`。
- Consumer 不直接把治理结论正文追加为 `ConversationFact`。
- 若需要正式显化为对话事实,必须继续经过 `ManifestExternalFact` 或等价 policy 路径。

#### ConsumeArtifactFactCommitted 处理流

```text
<ConsumeArtifactFactCommitted>
  │
  ▼
<Event Consumer>
  - validate ArtifactFactCommittedEvent event
  - reserve EventId event_id + EventSourceRef event_source_ref + IdempotencyKey idempotency_key
  │
  ▼
<ConversationManifestationService>
  - build ExternalFactRef for artifact fact
  - call ReferenceValidityPolicy.assert_reference_acceptable(ExternalFactRef external_fact_ref)
  │
  ▼
<ExternalReferenceProjection / ExternalFactSnapshot>
  - update artifact reference projection
  - mark related manifestation stale when source version changes
  │
  ▼
<Consume Result>
  - consumed / stale marker / deferred marker
```

关键设计点：
- Artifact body、version body 和 evidence body 不进入 Conversation truth。
- 事件只影响引用、快照、显化状态或 read model freshness。
- 详细设计继续定义 artifact fact kind 到 display summary 的映射边界。

#### ConsumeRuntimeResultCommitted 处理流

```text
<ConsumeRuntimeResultCommitted>
  │
  ▼
<Event Consumer>
  - validate RuntimeResultCommittedEvent event
  - reserve EventId event_id + EventSourceRef event_source_ref + IdempotencyKey idempotency_key
  │
  ▼
<ConversationFactAppendService>
  - call FactSourceRef.from_runtime_result(RuntimeResultRef runtime_result_ref, ActorRef actor_ref)
  - call FactAppendPolicy.assert_source_allowed(FactSourceRef source_ref)
  │
  ▼
<Fact Append Input / ConversationFact>
  - append result fact when space / scope / visibility are explicit
  - defer as append candidate when boundary is incomplete
  │
  ▼
<Consume Result>
  - consumed / fact appended / deferred marker
```

关键设计点：
- Runtime 只能提交结果性输出,不能把推理过程、memory 或 tool 原始调用过程写入本仓。
- 若 event 缺少明确 space / visibility 边界,Consumer 必须 defer,不能补造事实归属。
- 具体同步 Command 与异步 Consumer 的幂等合并规则留给详细设计。

#### ConsumeBridgeMappedFactReceived 处理流

```text
<ConsumeBridgeMappedFactReceived>
  │
  ▼
<Event Consumer>
  - validate BridgeMappedFactReceivedEvent event
  - reserve EventId event_id + EventSourceRef event_source_ref + IdempotencyKey idempotency_key
  │
  ▼
<ConversationFactAppendService>
  - call FactSourceRef.from_bridge_mapping(BridgeSourceRef bridge_source_ref, ActorRef actor_ref)
  - call FactAppendPolicy.assert_source_allowed(FactSourceRef source_ref)
  │
  ▼
<Fact Append Input / ExternalFactSnapshot>
  - append mapped fact when conversation boundary is explicit
  - save external reference snapshot when only display context is available
  │
  ▼
<Consume Result>
  - consumed / fact appended / snapshot updated / deferred marker
```

关键设计点：
- Bridges 负责外部平台协议和 message lifecycle,Conversation 只接收正式映射结果。
- Consumer 不直接理解外部平台 message schema,也不保存 message body。
- 映射结果进入 fact history 仍需满足 space、participant 和 visibility 边界。

#### ConsumeIdentityActorChanged 处理流

```text
<ConsumeIdentityActorChanged>
  │
  ▼
<Event Consumer>
  - validate IdentityActorChangedEvent event
  - reserve EventId event_id + EventSourceRef event_source_ref + IdempotencyKey idempotency_key
  │
  ▼
<ConversationDerivedMaintenanceService>
  - map actor change to affected participant refs
  - call ReferenceValidityPolicy.requires_refresh(ReferenceResolutionState resolution_state)
  │
  ▼
<ExternalReferenceProjection / Read Model State>
  - update actor display snapshot marker
  - mark affected read models / cursors stale
  │
  ▼
<Consume Result>
  - consumed / stale marker / unresolved marker
```

关键设计点：
- Identity actor changed 不改变 member lifecycle,只影响本仓引用、展示快照和读取 freshness。
- 参与范围是否变更仍必须通过 explicit scope command 或来源边界判断。
- 详细设计继续定义 actor snapshot stale、invalid 和 removed 的差异口径。

---

## 9. Operations Job 处理流

#### PublishConversationOutbox 处理流

```text
<PublishConversationOutbox>
  │
  ▼
<Job Runner>
  - validate JobMetadata job_metadata
  - load JobRunId job_run_id and OutboxPublishBatchRef batch_ref
  │
  ▼
<ConversationOutboxPublisherService>
  - load pending ConversationOutboxRecord records
  - load VisibilityScope for each publishable truth
  │
  ▼
<ConversationOutboxRecord / Bus Publisher>
  - call ConversationOutboxRecord.can_publish(VisibilityScope visibility_scope)
  - publish committed event payload ref to bus boundary
  - call ConversationOutboxRecord.mark_published(PublishedEventRef published_ref, Timestamp published_at)
  - or call ConversationOutboxRecord.mark_retry(RetryReason retry_reason, Timestamp next_retry_at)
  │
  ▼
<Outbox Publication Result>
  - published / retry pending / suppressed / failed markers
```

关键设计点：
- outbox 发布只处理已经提交的 Conversation truth,发布失败不得回滚 truth。
- 发布前必须重新检查 visibility,不允许把 suppressed payload 发到跨仓总线。
- 该 Job 不定义 bus topic、重试参数或 envelope 字段全集,这些留给详细设计。

#### RebuildConversationReadModels 处理流

```text
<RebuildConversationReadModels>
  │
  ▼
<Job Runner>
  - validate JobMetadata job_metadata
  - load ProjectionRebuildRef rebuild_ref and ConversationSpaceId space_id
  │
  ▼
<ConversationDerivedMaintenanceService>
  - load ConversationFact range, CrossDomainManifestation range, VisibilityScope
  - load ConversationProjectionState projection_state
  - call DerivedViewPolicy.assert_rebuild_allowed(ConversationProjectionState projection_state, ProjectionRebuildReason reason)
  │
  ▼
<ConversationReadModel / ConversationProjectionState>
  - call ConversationProjectionState.begin_rebuild(ProjectionRebuildRef rebuild_ref)
  - rebuild authorized read model material from truth refs
  - call ConversationProjectionState.complete_rebuild(ConversationSourcePosition source_position)
  │
  ▼
<Read Model Rebuild Result>
  - fresh read model or failed projection marker
```

关键设计点：
- read model 重建只能从 Conversation truth、manifestation 和安全 snapshot 派生。
- 重建过程不能生成新 fact、scope change 或 manifestation truth。
- 失败时必须通过 projection state 暴露 failed / stale marker,不能返回伪 fresh 结果。

#### RebuildConversationSearchIndex 处理流

```text
<RebuildConversationSearchIndex>
  │
  ▼
<Job Runner>
  - validate JobMetadata job_metadata
  - load ProjectionRebuildRef rebuild_ref and ConversationSpaceId space_id
  │
  ▼
<ConversationDerivedMaintenanceService>
  - load ConversationReadModel read_model
  - load ConversationProjectionState search_projection_state
  - call DerivedViewPolicy.assert_rebuild_allowed(ConversationProjectionState search_projection_state, ProjectionRebuildReason reason)
  │
  ▼
<SearchIndexProjection / ConversationProjectionState>
  - call SearchIndexProjection.from_read_model(ConversationReadModel read_model)
  - call ConversationProjectionState.complete_rebuild(ConversationSourcePosition source_position)
  │
  ▼
<Search Index Rebuild Result>
  - rebuilt index refs and projection state marker
```

关键设计点：
- search index 只能保存可检索引用、允许摘要和 source position,不能成为第二正文库。
- 搜索索引不承担最终可见性裁剪,Query 输出仍必须经过 visibility 复核。
- 具体索引引擎、分词、排序和 score 算法不在概要设计层展开。

#### MaintainConversationChangeCursors 处理流

```text
<MaintainConversationChangeCursors>
  │
  ▼
<Job Runner>
  - validate JobMetadata job_metadata
  - load CursorMaintenanceScope maintenance_scope
  │
  ▼
<ConversationDerivedMaintenanceService>
  - load ConversationOutboxRecord changes after ConversationSourcePosition source_position
  - load ConversationProjectionState cursor_projection_state
  - call DerivedViewPolicy.assert_read_only(ConversationProjectionState cursor_projection_state)
  │
  ▼
<ChangeCursorProjection / ConversationChangeCursor>
  - call ChangeCursorProjection.from_change_log(ConversationSpaceId space_id, Vec<ConversationOutboxRecord> outbox_records)
  - call ChangeCursorProjection.cursor_for(ConsumerRef consumer_ref)
  - call ConversationChangeCursor.advance(ConversationFactSequence fact_sequence, ConversationOutboxSequence outbox_sequence)
  │
  ▼
<Cursor Maintenance Result>
  - updated cursor projection and stale / invalidated markers
```

关键设计点：
- cursor 维护只表达变化位置和消费进度,不绑定 SSE、WebSocket 或 AG-UI 协议。
- 可见范围变化导致的 invalidated cursor 必须保留显式状态,不能静默续读。
- 详细设计继续定义 consumer 定位、保留窗口和 cursor token 编码。

#### RefreshExternalReferenceSnapshots 处理流

```text
<RefreshExternalReferenceSnapshots>
  │
  ▼
<Job Runner>
  - validate JobMetadata job_metadata
  - load ExternalReferenceRefreshScope refresh_scope
  │
  ▼
<ConversationReferenceRefreshService>
  - load ExternalReferenceProjection projections requiring refresh
  - load ExternalFactRef external_fact_ref
  - call ReferenceValidityPolicy.assert_reference_acceptable(ExternalFactRef external_fact_ref)
  │
  ▼
<ExternalFactSnapshot / ExternalReferenceProjection>
  - call ExternalFactSnapshot.from_resolved_reference(ExternalFactRef external_fact_ref, DisplaySummaryRef display_summary_ref)
  - call ExternalReferenceProjection.update_snapshot(ExternalFactSnapshot snapshot)
  - or call ExternalReferenceProjection.mark_unresolved(ReferenceResolutionReason reason)
  │
  ▼
<Reference Refresh Result>
  - fresh / stale / unresolved / invalid projection marker
```

关键设计点：
- snapshot 刷新只拉取安全摘要、引用和 digest,不得复制来源正文或 secret。
- 来源不可解析时必须写入 unresolved / invalid marker,不能补造外部事实。
- 来源 resolver、digest 校验和刷新批次策略留给详细设计。

#### DeliverTraceHandoff 处理流

```text
<DeliverTraceHandoff>
  │
  ▼
<Job Runner>
  - validate JobMetadata job_metadata
  - load TraceHandoffBatchRef batch_ref
  │
  ▼
<ConversationTraceHandoffService>
  - load pending TraceHandoffRecord handoff_record
  - call TraceRetentionPolicy.assert_handoff_allowed(TraceHandoffRecord handoff_record)
  - call TraceRetentionPolicy.assert_no_forbidden_body(TraceHandoffPayloadRef payload_ref)
  │
  ▼
<TraceHandoffRecord / Observability Sink>
  - deliver sanitized handoff payload ref
  - call TraceHandoffRecord.mark_handed_off(ObservabilityReceiptRef receipt_ref, Timestamp handed_off_at)
  - or call TraceHandoffRecord.mark_retry(HandoffRetryReason retry_reason, Timestamp next_retry_at)
  │
  ▼
<Trace Handoff Result>
  - handed off / retry pending / failed marker
```

关键设计点：
- trace handoff 是后置交接,成功或失败都不决定 Conversation truth 是否成立。
- 交接材料必须先过 retention 和 forbidden body 规则。
- observability 只能接收 evidence / trace ref,不能反写 Conversation truth。

#### DeliverArchiveHandoff 处理流

```text
<DeliverArchiveHandoff>
  │
  ▼
<Job Runner>
  - validate JobMetadata job_metadata
  - load ArchiveHandoffBatchRef batch_ref
  │
  ▼
<ConversationArchiveHandoffService>
  - load pending ArchiveHandoffRecord archive_handoff_record
  - load TraceRetentionPolicy retention_policy
  - verify archive scope against ConversationSpaceId space_id
  │
  ▼
<ArchiveHandoffRecord / Archive Sink>
  - deliver archive package ref or archive request ref
  - call ArchiveHandoffRecord.mark_archived(ArchivePackageRef archive_package_ref, Timestamp archived_at)
  - or call ArchiveHandoffRecord.mark_retry(HandoffRetryReason retry_reason, Timestamp next_retry_at)
  │
  ▼
<Archive Handoff Result>
  - archived / retry pending / failed marker
```

关键设计点：
- archive handoff 只交付归档引用或归档请求,不把 archive 仓变成本仓 truth owner。
- 归档失败只能改变 handoff 状态和运维证据,不能删除 Conversation history。
- 归档包格式、存储位置和 retention 执行细节留给详细设计。

#### ValidateConversationConsistency 处理流

```text
<ValidateConversationConsistency>
  │
  ▼
<Job Runner>
  - validate JobMetadata job_metadata
  - load ConsistencyValidationScope validation_scope
  │
  ▼
<ConversationConsistencyValidationService>
  - load ConversationTruthState, ConversationProjectionState, ExternalReferenceProjection
  - call DerivedViewPolicy.assert_source_position_valid(ConversationSourcePosition source_position)
  - compare truth refs, projection positions, outbox states, handoff states
  │
  ▼
<Diagnostic Evidence>
  - create ConsistencyReportRef report_ref
  - mark projection or reference diagnostics when inconsistent
  │
  ▼
<Consistency Validation Result>
  - consistent / inconsistent / degraded diagnostic marker
```

关键设计点：
- consistency validation 是诊断流程,不得自动修复 truth 或覆盖 projection。
- 该 Job 必须点名 truth、projection、reference、outbox 和 handoff 的对账关系。
- 自动修复策略、报告 schema 和告警通道留给详细设计 / 测试方案。

#### CleanupExpiredConversationCursors 处理流

```text
<CleanupExpiredConversationCursors>
  │
  ▼
<Job Runner>
  - validate JobMetadata job_metadata
  - load CursorCleanupScope cleanup_scope
  │
  ▼
<ConversationCursorMaintenanceService>
  - load expired ConversationChangeCursor range
  - load VisibilityScope and retention marker
  │
  ▼
<ConversationChangeCursor / ChangeCursorProjection>
  - call ConversationChangeCursor.mark_stale(CursorStaleReason reason)
  - remove or hide expired cursor projection entries
  - keep ConversationFact and ConversationOutboxRecord untouched
  │
  ▼
<Cursor Cleanup Result>
  - cleanup evidence and expired / stale markers
```

关键设计点：
- cursor cleanup 只清理消费位置和投影条目,不得删除 fact、outbox 或 trace。
- 超过保留窗口的 cursor 必须让 consumer 重新建立读取视图。
- 详细设计继续定义 expired 与 stale 的精确判定、批次大小和清理证据格式。

---

## 10. 处理流与对象 / 接口对应关系说明

| 处理流类型 | 覆盖接口 / 作业 | 主要对象 / 投影 | 主要 service 边界 |
|---|---|---|---|
| Space / scope command | `CreateConversationSpace`、`CloseConversationSpace`、`UpdateParticipantScope`、`UpdateVisibilityScope` | `ConversationSpace`、`ParticipantScope`、`VisibilityScope`、`ScopeChangeRecord`、`ConversationOutboxRecord` | `ConversationSpaceCommandService`、`ParticipantScopeCommandService`、`VisibilityScopeCommandService` |
| Fact command | `AppendConversationFact`、`RetractConversationFact` | `ConversationFact`、`FactSourceRef`、`FactAppendPolicy`、`FactAppendReceipt`、`ConversationTraceContext` | `ConversationFactAppendService` |
| Manifestation command | `ManifestExternalFact` | `CrossDomainManifestation`、`ExternalFactRef`、`ExternalFactSnapshot`、`ManifestationPolicy`、`ReferenceValidityPolicy` | `ConversationManifestationService` |
| Trace / review command | `CreateReviewAnchor`、`RequestTraceHandoff`、`RequestArchiveHandoff` | `ConversationTraceContext`、`ReviewAnchor`、`TraceHandoffRecord`、`ArchiveHandoffRecord`、`TraceRetentionPolicy` | `ConversationTraceReviewService` |
| Authorized query | read model、cursor、search、trace、reference query | `ConversationReadModel`、`ConversationChangeCursor`、`SearchIndexProjection`、`ExternalReferenceProjection`、`VisibilityPolicy` | `AuthorizedConversationQueryService` |
| Inbound consumer | 6 个来源事件 consumer | `ExternalFactRef`、`ExternalFactSnapshot`、`ReferenceResolutionState`、`ConversationFact`、`ExternalReferenceProjection` | `ConversationManifestationService`、`ConversationFactAppendService`、`ConversationDerivedMaintenanceService` |
| Operations job | 9 个维护 / 发布 / handoff job | `ConversationOutboxRecord`、`ConversationProjectionState`、`ChangeCursorProjection`、`SearchIndexProjection`、`TraceHandoffRecord`、`ArchiveHandoffRecord` | outbox publisher、derived maintenance、reference refresh、handoff、validation 和 cursor maintenance service |

说明：
- Step 8 中所有正式对象都必须能在 Step 6 找到对象骨架；若详细设计发现新增对象,应先回补 Step 6 / Step 8 来源。
- Step 8 中所有接口名称都承接 Step 7,不得在详细设计阶段悄悄更名或新增同义接口。
- Step 8 只稳定处理流的主干和边界,完整 repository trait、事务、异常和测试矩阵由详细设计继续展开。

---

## 11. 未展开处理流的取舍说明

| 未独立展开项 | 取舍说明 |
|---|---|
| `ListConversationFacts` | 走通用授权 Query 读路径,核心差异是分页和排序,不引入额外对象状态 |
| `GetConversationFact` | 走通用授权 Query 读路径,必须经过 visibility 复核,但不改变 truth / projection |
| `GetCrossDomainManifestation` | 走通用授权 Query 读路径和 external reference fallback,关键显化写路径已在 `ManifestExternalFact` 展开 |
| `GetConversationProjectionState` | 属于只读诊断查询,不改变 projection state,不需要独立处理流 |

说明：
- 未独立展开不代表接口不重要,而是它们不引入新的写路径、状态转换或跨组件协作模式。
- 若详细设计发现某个未展开 Query 需要 fallback、projection rebuild trigger 或复杂可见性裁剪,必须回到概要 Step 8 补独立处理流。

---

## 12. 输出约束检查

| 检查项 | 结果 | 说明 |
|---|---|---|
| P0 Command 是否均有独立处理流 | 通过 | 10 个 Command 均已展开 |
| 改写本地状态的 Inbound Event Consumer 是否均有独立处理流 | 通过 | 6 个 Consumer 均已展开 |
| 影响查询一致性或传播可靠性的 Operations Job 是否均有独立处理流 | 通过 | 9 个 Job 均已展开 |
| 处理流图是否使用统一 ASCII 风格 | 通过 | 均使用 `text` 代码块、`│`、`▼` 和自上而下结构 |
| 函数调用参数是否包含类型 | 通过 | 点名函数调用均采用 `TypeName param_name` 格式 |
| 是否避免进入详细设计细节 | 通过 | 未展开 Rust 完整签名、SQL / DDL、错误码全集、topic / HTTP / JSON / proto 细节 |
| 是否能支撑 Step 9 状态机 | 通过 | 已点名 fact、scope、projection、reference、outbox、handoff、cursor 等状态来源 |

---

## 13. 回填草稿

正式 `02-概要设计.md` §8 可以按以下结构回填：

```text
## 8. 关键处理流 / 重要函数数据流

### 8.1 处理流覆盖清单
引用 `design-calibration/02_hld_step_08_processing_flows.md` §4。

### 8.2 通用处理流骨架
引用 `design-calibration/02_hld_step_08_processing_flows.md` §5。

### 8.3 Command API 处理流
摘录 `design-calibration/02_hld_step_08_processing_flows.md` §6。

### 8.4 Query API 处理流
摘录 `design-calibration/02_hld_step_08_processing_flows.md` §7。

### 8.5 Inbound Event Consumer 处理流
摘录 `design-calibration/02_hld_step_08_processing_flows.md` §8。

### 8.6 Operations Job 处理流
摘录 `design-calibration/02_hld_step_08_processing_flows.md` §9。

### 8.7 处理流与对象 / 接口对应关系
摘录 `design-calibration/02_hld_step_08_processing_flows.md` §10。

### 8.8 未展开处理流的取舍说明
摘录 `design-calibration/02_hld_step_08_processing_flows.md` §11。
```

回填时必须在 §8 开头列出本章引用来源：

- `design-calibration/02_hld_step_05_components_boundary.md`
- `design-calibration/02_hld_step_06_key_objects.md`
- `design-calibration/02_hld_step_07_api_interface_skeleton.md`
- `design-calibration/02_hld_step_08_processing_flows.md`

---

## 14. 待确认事项

当前 Step 8 无阻塞性待确认事项。

后续 Step 9 需要继续确认：

- `ConversationTruthState`、`ConversationSpace`、`ParticipantScope`、`VisibilityScope`、`ConversationFact`、`CrossDomainManifestation`、`ConversationProjectionState`、`ReferenceResolutionState`、`ConversationOutboxPublicationState`、handoff state 和 cursor state 的正式状态集合。
- `AppendConversationFact`、`ManifestExternalFact`、`PublishConversationOutbox`、`RebuildConversationReadModels`、`RefreshExternalReferenceSnapshots`、`DeliverTraceHandoff`、`DeliverArchiveHandoff` 等处理流对应的状态流转方向。
- 哪些状态可以自动恢复,哪些必须人工处理或只能通过新 Command 显式改变。

---

## 15. 进入下一步条件

Step 8 已满足进入 Step 9 的条件：

- 关键 Command、Query、Inbound Event Consumer 和 Operations Job 已全部按选择规则展开或说明未展开原因。
- 处理流中出现的关键对象可回查到 Step 6。
- 处理流中出现的接口可回查到 Step 7。
- 处理流粒度足以支撑 Step 9 状态机与后续详细设计继续展开。
