# Step 11. 定义持久化、事务与一致性契约

## 1. Step 状态

- 状态: `[x] 已完成`
- 对应 SOP: `standards/document/详细设计讨论流程_SOP.md` Step 11
- 回填章节: `projects/L1-conversation/03-详细设计.md` §10 数据持久化、事务与一致性契约

---

## 2. 本步输入

| 输入 | 内容 | 本步使用方式 |
|---|---|---|
| `01-架构设计.md` | L1-conversation 的 truth center、outbox、projection 和跨仓引用边界 | 确认数据所有权和外部 truth 不落本仓 |
| `03_ddd_step_07_trait_port_adapter_contracts.md` | repository、UnitOfWork、IdempotencyRepository、publisher、handoff port | 作为持久化函数全集 |
| `03_ddd_step_09_function_flows.md` | 每个 Command / Consumer / Job 的事务边界 | 作为事务场景来源 |
| `03_ddd_step_10_state_matrix.md` | 状态转换和非法转换 | 作为锁、版本和恢复要求来源 |
| `standards/document/详细设计书写规范.md` §5.10 | 所有权表、collection 表、repository 表、事务表和一致性策略表 | 作为输出格式约束 |

已确认约束:

```text
P0 不强制写数据库迁移脚本。
本步写实现契约,不指定必须使用 PostgreSQL / SQLite / in-memory。
所有写入型 flow 必须通过 UnitOfWork。
command / consumer 写 truth 与 outbox 必须同事务。
publish / handoff 外部调用不得包在 DB 事务内。
projection、cursor、snapshot 是派生或本地快照,不能反向改 truth。
```

---

## 3. SOP 问题回答

### 3.1 哪些数据对象由本仓拥有？

本仓拥有 Conversation truth、conversation-local scope、fact、manifestation、trace、review、handoff intent、outbox、idempotency 和本地派生 projection。

| 拥有类别 | 数据对象 |
|---|---|
| Conversation truth | `ConversationSpace`、`ParticipantScope`、`VisibilityScope`、`ScopeChangeRecord` |
| Conversation fact truth | `ConversationFact`、`FactAppendReceipt` |
| Cross-domain manifestation truth | `CrossDomainManifestation` |
| Trace / review / handoff truth | `ConversationTraceContext`、`ReviewAnchor`、`TraceHandoffRecord`、`ArchiveHandoffRecord` |
| Publication truth | `ConversationOutboxRecord` |
| Technical truth | `IdempotencyRecord`、`UnitOfWork` transaction marker |
| Derived local state | `ConversationReadModel`、`ConversationChangeCursor`、`SearchIndexProjection`、`ChangeCursorProjection`、`ConversationProjectionState`、`ExternalReferenceProjection`、`ExternalFactSnapshot` |

### 3.2 哪些只是引用、快照或投影？

| 类型 | 对象 | 约束 |
|---|---|---|
| 外部 truth 引用 | `ActorRef`、`WorkFactRef`、`GovernanceDecisionRef`、`ArtifactVersionRef`、`RuntimeResultRef`、`BridgeEventRef` | 不拥有生命周期,不直接依赖对应 crate |
| 外部事实引用 | `ExternalFactRef` | 只保存 ref、source version、digest,不保存来源正文 |
| 安全快照 | `ExternalFactSnapshot` | 本仓拥有快照记录,但不拥有外部 truth |
| 派生投影 | read model、search projection、change cursor projection、external reference projection | 可重建,不能反向改 truth |
| 交接结果引用 | `ObservabilityReceiptRef`、`ArchivePackageRef`、`PublishedEventRef` | 只保存外部结果 ref,不保存外部正文或包体 |

### 3.3 repository 函数如何命名，参数和返回是什么？

Repository 函数沿用 Step 7:

| Repository | 函数命名规则 | 参数规则 | 返回规则 |
|---|---|---|---|
| `SpaceScopeRepository` | `get_*`、`get_*_for_update`、`save_scope_bundle`、`list_spaces` | 写入必须带 `UnitOfWorkHandle` | 写入返回 `Version` |
| `ConversationFactRepository` | `append_fact`、`save_fact_state`、`get_fact`、`get_fact_for_update`、`list_*` | append / save 必须带 `UnitOfWorkHandle` | 读取返回 `Option` / `Page` |
| `ManifestationRepository` | `insert_manifestation`、`get_manifestation`、`find_by_external_fact` | insert 必须带 `UnitOfWorkHandle` | 读取返回 `Option` / `Vec` |
| `TraceRepository` | `save_*`、`get_*`、`get_*_for_update`、`list_pending_*` | handoff state 更新必须先 `get_*_for_update` | 写入返回 `Version` |
| `ProjectionRepository` | `upsert_*`、`get_*`、`list_*`、`delete_*` | upsert / delete 必须带 `UnitOfWorkHandle` | 派生读取可返回 `Option` |
| `ExternalReferenceRepository` | `upsert_snapshot`、`upsert_reference_projection`、`list_reference_projections` | snapshot / projection 写入必须带 `UnitOfWorkHandle` | 读取返回 `Option` / `Page` |
| `ConversationOutboxRepository` | `enqueue`、`list_pending`、`list_committed_since`、`get_for_update`、`save_state` | outbox 状态推进必须锁定 record | 写入返回 `Version` |
| `IdempotencyRepository` | `reserve`、`complete`、`mark_conflict`、`find` | reserve / complete / conflict 必须带 `UnitOfWorkHandle` | reserve 返回 reservation |

### 3.4 哪些处理流需要事务，事务内必须完成哪些写入？

| 处理流类型 | 是否需要事务 | 同事务内必须完成 |
|---|---|---|
| Command 写 truth | 是 | idempotency reserve、domain truth 保存、trace / receipt / handoff 保存、outbox enqueue、idempotency complete |
| Inbound consumer 写本地 truth / projection | 是 | consumer idempotency、projection / snapshot / manifestation / fact 保存、outbox enqueue、idempotency complete |
| Query | 否 | 不写状态,只读 projection / truth / visibility |
| Outbound event publish function | 否 | 不改 DB,只调用 publisher port |
| Publish outbox job | 是,每条 outbox 独立事务 | 外部 publish 后锁定 outbox,保存 publication state |
| Projection rebuild job | 是,按 space / consumer / projection 分批事务 | upsert projection / cursor / read model,保存 projection state |
| Handoff delivery job | 是,每条 handoff 独立事务 | 外部 handoff 后锁定 handoff,保存 handoff state |
| Cursor cleanup job | 是,按批次事务 | 删除 expired cursor,写 job evidence |

### 3.5 是否需要乐观锁、行锁、版本号、outbox 或 projection？

需要。规则如下:

| 机制 | 使用位置 | 目的 |
|---|---|---|
| 乐观锁 / `Version` | space、scope、fact、manifestation、trace、projection、outbox 写入 | 防止并发覆盖 |
| `get_for_update` 行锁语义 | space close、fact retract、handoff delivery、outbox publish | 防止同一记录并发状态迁移 |
| `IdempotencyRepository` | command、consumer、job | 防止重复请求 / 重复事件 / job 重跑 |
| outbox | command / consumer 成功写 truth 后 | 保证 truth commit 与待发布事件同事务 |
| projection state | read model、search、cursor、reference projection | 暴露 freshness、failed、disabled |
| source position / sequence | fact append sequence、outbox sequence、projection source position | 防止 cursor / projection 倒退 |

### 3.6 如果事件发布或 projection 更新失败，如何恢复？

| 失败类型 | 恢复口径 |
|---|---|
| outbox 发布失败 | 不回滚 truth;`PublishConversationOutboxFlow` 将 outbox 标为 `RetryPending` 或 `Failed` |
| projection rebuild 失败 | 不回滚 truth;`ConversationProjectionState` 标为 `Failed`,query 暴露 degraded marker |
| external resolver 失败 | 不补造来源 truth;reference / manifestation 标为 `Unresolved` |
| handoff delivery 失败 | 不回滚 trace / fact truth;handoff 标为 `RetryPending` 或 `Failed` |
| cursor cleanup 失败 | 本批事务回滚;下次 job 可重跑 |
| idempotency complete 失败 | 同事务回滚;重复请求通过 reservation / conflict 处理 |

## 4. 当前文档问题诊断

| 问题 | 影响 | 本步处理 |
|---|---|---|
| Step 7 已有 repository 函数,但缺少统一持久化所有权视图 | 实现者不知道哪些数据是 truth、projection、snapshot | 本步补数据所有权表 |
| Step 9 事务分散在 45 个处理流里 | 容易漏掉 outbox / idempotency / projection state 同事务要求 | 本步按场景聚合事务边界 |
| Step 10 状态转换要求锁和版本,但未说明存储机制 | 状态迁移实现可能并发覆盖 | 本步补乐观锁、行锁和 sequence 要求 |
| publish / handoff 是外部调用 | 若放进 DB 事务会造成长事务和重复副作用 | 本步明确外部调用不包在 DB 事务内 |
| projection / snapshot 可重建 | 若当作 truth 会导致反向写源 | 本步明确派生恢复和补偿口径 |

## 5. 设计取舍

| 议题 | 方案 | 取舍 |
|---|---|---|
| 是否指定具体数据库 | A. 指定 PostgreSQL;B. 只写 repository / collection 契约 | 采用 B。P0 尚未要求迁移脚本,实现可以先用 in-memory 或 durable adapter |
| outbox 与 truth 是否同事务 | A. 同事务;B. 异步补写 outbox | 采用 A。command / consumer 成功必须原子写 truth 和待发布 outbox |
| publish / handoff 外部调用是否包事务 | A. 包在同一事务;B. 外部调用后短事务写状态 | 采用 B。避免长事务和外部副作用锁住本仓 |
| projection 更新失败是否回滚 truth | A. 回滚 truth;B. 标记 projection failed / stale | 采用 B。projection 是派生状态 |
| snapshot 是否等同外部 truth | A. 等同;B. 只保存安全快照和 digest | 采用 B。外部 truth 仍由来源仓拥有 |
## 6. 结构化中间产物

### 6.1 数据所有权实现表

| 数据对象 | 拥有模块 | 写入方 | 读取方 | 一致性要求 |
|---|---|---|---|---|
| `ConversationSpace` | `domain/space.rs` | space command service | command、query、job | space id 唯一,状态迁移需版本保护 |
| `ParticipantScope` | `domain/scope.rs` | scope command service | append、query、visibility service | 同一 space 只有当前 active scope;更新写 `ScopeChangeRecord` |
| `VisibilityScope` | `domain/scope.rs` | visibility command service | append、query、manifestation、projection | 更新必须使 read model / cursor / reference projection stale |
| `ScopeChangeRecord` | `domain/scope.rs` | space / scope command service | query、trace、projection | 追加式 history;旧 applied record 可 superseded |
| `ConversationFact` | `domain/fact.rs` | fact append / consumer service | query、trace、projection、search | append sequence 单调;retract / quarantine 需锁定 fact |
| `FactAppendReceipt` | `domain/fact.rs` | fact append service | command response、audit | outcome 不可变;幂等 key 唯一 |
| `CrossDomainManifestation` | `domain/manifestation.rs` | manifestation service / consumer | query、trace、projection | 不保存 source body;source version / digest 可校验 |
| `ConversationTraceContext` | `domain/trace.rs` | fact / manifestation / trace service | query、handoff job | trace refs 追加或封存需版本保护 |
| `ReviewAnchor` | `domain/trace.rs` | review command service | query、reports | 稳定定位点,不改治理裁决 |
| `TraceHandoffRecord` | `domain/trace.rs` | handoff command / job | handoff job、query、reports | delivery state 需锁定更新 |
| `ArchiveHandoffRecord` | `domain/trace.rs` | archive command / job | archive job、query、reports | package ref 只保存引用 |
| `ConversationOutboxRecord` | `domain/truth.rs` | command / consumer / publish job | publish job、cursor job、reports | truth 写入和 enqueue 同事务;publish state 独立推进 |
| `ConversationProjectionState` | `domain/projection.rs` | consumer / projection job | query、ops | freshness 必须暴露;source position 只能前进 |
| `ConversationReadModel` | `domain/projection.rs` | rebuild job | query | 派生可重建,不可反写 truth |
| `ConversationChangeCursor` | `domain/projection.rs` | query / cursor job / cleanup job | query、poll changes | sequence 只能前进;expired / invalidated 不可续读 |
| `SearchIndexProjection` | `domain/projection.rs` | search rebuild job | search query | refs only,不保存 fact body |
| `ChangeCursorProjection` | `domain/projection.rs` | cursor maintenance job | poll changes | 从 outbox log 派生 |
| `ExternalFactSnapshot` | `domain/manifestation.rs` | resolver / refresh job | query、manifestation | 安全快照,不拥有外部 truth |
| `ExternalReferenceProjection` | `domain/reference.rs` | consumer / refresh job | query、reports | 只保存 external refs、snapshot refs、resolution state |
| `IdempotencyRecord` | `application/idempotency.rs` | command / consumer / job service | same operation | key + operation 唯一;complete 与业务写入同事务 |

### 6.2 存储对象 / collection / projection 契约表

| 存储对象 | 用途 | 主键 / 唯一键 | 关键索引 | 版本字段 |
|---|---|---|---|---|
| `conversation_spaces` | 保存 `ConversationSpace` | `space_id` | `owner_ref`、`lifecycle_state` | `version` |
| `participant_scopes` | 保存当前和历史 participant scope | `participant_scope_id` | `space_id`、`scope_version`、`scope_state` | `version` |
| `visibility_scopes` | 保存 visibility scope | `visibility_scope_id` | `space_id`、`scope_version`、`scope_state` | `version` |
| `scope_change_records` | 追加式 scope history | `scope_change_id` | `space_id`、`scope_kind`、`change_state` | `version` |
| `conversation_facts` | 保存 fact truth | `fact_id` | `space_id`、`append_sequence`、`fact_state` | `version` |
| `fact_append_receipts` | 保存 append outcome 和幂等结果 | `append_receipt_id` | `space_id`、`idempotency_key`、`fact_id` | 不变或 `version` |
| `cross_domain_manifestations` | 保存显化记录 | `manifestation_id` | `space_id`、`external_fact_ref`、`manifestation_state` | `version` |
| `external_fact_snapshots` | 保存安全快照 | `snapshot_id` | `external_fact_ref`、`source_digest`、`captured_at` | `version` |
| `external_reference_projections` | 保存 external refs / snapshot refs 聚合 | `external_reference_projection_id` | `space_id`、`resolution_state` | `version` |
| `conversation_trace_contexts` | 保存 trace refs 和 retention state | `trace_context_id` | `space_id`、`retention_state` | `version` |
| `review_anchors` | 保存 review anchor | `review_anchor_id` | `space_id`、`target_ref`、`anchor_kind` | `version` |
| `trace_handoff_records` | 保存 trace handoff intent / state | `trace_handoff_id` | `trace_context_id`、`handoff_state`、`destination_ref` | `version` |
| `archive_handoff_records` | 保存 archive handoff intent / state | `archive_handoff_id` | `space_id`、`trace_context_id`、`handoff_state` | `version` |
| `conversation_outbox_records` | 保存待发布 / 已发布事件 | `outbox_record_id` | `space_id`、`outbox_sequence`、`publication_state`、`event_kind` | `version` |
| `conversation_read_models` | 授权读取视图 | `space_id + consumer_ref` | `projection_state_id`、`source_position` | `version` |
| `conversation_change_cursors` | consumer 增量位置 | `cursor_id` | `space_id + consumer_ref`、`cursor_state`、`last_outbox_sequence` | `version` |
| `search_index_projections` | search refs projection | `search_projection_id` | `space_id`、`source_position` | `version` |
| `change_cursor_projections` | outbox change stream projection | `change_cursor_projection_id` | `space_id`、`source_position` | `version` |
| `conversation_projection_states` | projection freshness state | `projection_state_id` | `space_id + projection_kind`、`freshness_state` | `version` |
| `idempotency_records` | command / consumer / job 幂等 | `idempotency_key + operation` | `result_ref`、`completed_at`、`conflict_ref` | `version` |

说明:

- 表名是实现契约层命名建议,不是强制 DDL。
- in-memory adapter 必须保留相同唯一键、索引语义和版本语义。
- durable adapter 可以合并物理表,但 repository 行为必须保持等价。

### 6.3 Repository 函数表

| 函数签名 | 作用 | 锁 / 事务要求 | 返回 | 错误 |
|---|---|---|---|---|
| `SpaceScopeRepository.get_space(space_id)` | 只读读取 space | 无写锁 | `Option<ConversationSpace>` | `RepositoryError` |
| `SpaceScopeRepository.get_space_for_update(space_id, uow)` | 写事务读取 space | 必须持有 `UnitOfWorkHandle` | `Option<ConversationSpace>` | `RepositoryError` |
| `SpaceScopeRepository.save_scope_bundle(bundle, uow)` | 原子保存 space / scope / change | 同事务写 bundle 内所有对象 | `Version` | `RepositoryError` |
| `SpaceScopeRepository.list_spaces(scope, page)` | job 分页列 space | 只读 | `Page<ConversationSpace>` | `RepositoryError` |
| `ConversationFactRepository.append_fact(fact, receipt, uow)` | 保存 fact 和 receipt | 与 trace / outbox / idempotency 同事务 | `Version` | `RepositoryError` |
| `ConversationFactRepository.save_fact_state(fact, uow)` | 保存 fact 状态变化 | retract / quarantine 必须锁定 fact | `Version` | `RepositoryError` |
| `ConversationFactRepository.get_fact_for_update(fact_id, uow)` | 写事务读取 fact | 行锁语义 | `Option<ConversationFact>` | `RepositoryError` |
| `ConversationFactRepository.list_fact_refs(space_id, page)` | 分页读取 fact refs | 只读 | `Page<ConversationFactRef>` | `RepositoryError` |
| `ConversationFactRepository.list_facts(space_id, page)` | job / consistency 分页读取 facts | 只读 | `Page<ConversationFact>` | `RepositoryError` |
| `ManifestationRepository.insert_manifestation(manifestation, uow)` | 保存 manifestation | 与 snapshot / outbox 同事务 | `Version` | `RepositoryError` |
| `ManifestationRepository.get_manifestation_for_update(manifestation_id, uow)` | 写事务读取 manifestation | 行锁语义 | `Option<CrossDomainManifestation>` | `RepositoryError` |
| `TraceRepository.save_trace_context(trace_context, uow)` | 保存 trace context | 与 fact / manifestation / handoff intent 同事务 | `Version` | `RepositoryError` |
| `TraceRepository.save_review_anchor(review_anchor, uow)` | 保存 review anchor | 与 outbox / idempotency 同事务 | `Version` | `RepositoryError` |
| `TraceRepository.save_trace_handoff(handoff, uow)` | 保存 trace handoff | command 或 job 短事务 | `Version` | `RepositoryError` |
| `TraceRepository.get_trace_handoff_for_update(handoff_id, uow)` | 锁定 trace handoff | job 状态推进前必须调用 | `Option<TraceHandoffRecord>` | `RepositoryError` |
| `TraceRepository.save_archive_handoff(handoff, uow)` | 保存 archive handoff | command 或 job 短事务 | `Version` | `RepositoryError` |
| `TraceRepository.get_archive_handoff_for_update(handoff_id, uow)` | 锁定 archive handoff | job 状态推进前必须调用 | `Option<ArchiveHandoffRecord>` | `RepositoryError` |
| `ProjectionRepository.upsert_read_model(read_model, uow)` | 保存 read model | 与 projection state 同事务 | `Version` | `RepositoryError` |
| `ProjectionRepository.save_projection_state(state, uow)` | 保存 freshness state | 与相关 projection 同事务 | `Version` | `RepositoryError` |
| `ProjectionRepository.save_change_cursor(cursor, uow)` | 保存 cursor | sequence 只能前进 | `Version` | `RepositoryError` |
| `ProjectionRepository.delete_change_cursor(cursor_id, uow)` | 删除 expired cursor | 只删派生 cursor | `Version` | `RepositoryError` |
| `ProjectionRepository.upsert_search_projection(projection, uow)` | 保存 search projection | refs only | `Version` | `RepositoryError` |
| `ProjectionRepository.upsert_change_cursor_projection(projection, uow)` | 保存 change projection | 与 cursor updates 同事务 | `Version` | `RepositoryError` |
| `ExternalReferenceRepository.upsert_snapshot(snapshot, uow)` | 保存 safe snapshot | 与 manifestation / reference projection 同事务或 refresh 事务 | `Version` | `RepositoryError` |
| `ExternalReferenceRepository.upsert_reference_projection(projection, uow)` | 保存 reference projection | 与 snapshot / projection state 同事务 | `Version` | `RepositoryError` |
| `ConversationOutboxRepository.enqueue(outbox, uow)` | 写待发布 outbox | 必须与 truth 写入同事务 | `Version` | `RepositoryError` |
| `ConversationOutboxRepository.get_for_update(outbox_record_id, uow)` | 锁定 outbox | publish state 推进前必须调用 | `Option<ConversationOutboxRecord>` | `RepositoryError` |
| `ConversationOutboxRepository.save_state(outbox, uow)` | 保存 publication state | 外部 publish 后短事务 | `Version` | `RepositoryError` |
| `IdempotencyRepository.reserve(key, operation, uow)` | 预留幂等键 | 与业务写入同事务开始阶段 | `IdempotencyReservation` | `IdempotencyError` |
| `IdempotencyRepository.complete(reservation, result_ref, uow)` | 完成幂等记录 | 与业务写入同事务结束阶段 | `()` | `IdempotencyError` |

### 6.4 事务边界表

| 场景 | 开始位置 | 提交位置 | 回滚条件 | 同事务内必须完成 |
|---|---|---|---|---|
| `CreateConversationSpaceFlow` | handler 校验后 `UnitOfWork.begin()` | `save_scope_bundle`、`outbox.enqueue`、`idempotency.complete` 后 | domain invalid、repository failure、outbox failure、idempotency conflict | idempotency reserve、space / participant / visibility / scope change、outbox、idempotency complete |
| `CloseConversationSpaceFlow` | command service 进入写流程 | 保存 close scope change 与 outbox 后 | space missing、invalid state、repository failure | lock space、close state、scope change、outbox、idempotency complete |
| `UpdateParticipantScopeFlow` | command service 进入写流程 | scope bundle 与 outbox 保存后 | invalid participant、scope conflict、repository failure | idempotency、participant scope、scope change、outbox |
| `UpdateVisibilityScopeFlow` | command service 进入写流程 | visibility scope、projection stale、outbox 保存后 | invalid visibility rule、repository failure | idempotency、visibility scope、scope change、projection state stale、outbox |
| `AppendConversationFactFlow` | command service 进入 append | fact、receipt、trace、outbox 保存后 | append policy reject、payload boundary violation、repository failure | idempotency、fact、receipt、trace context、outbox |
| `RetractConversationFactFlow` | lock fact 后 | fact state、trace、outbox 保存后 | fact missing、terminal fact、repository failure | idempotency、fact state、retraction receipt、trace、outbox |
| `ManifestExternalFactFlow` | command service 进入 manifestation | snapshot、manifestation、fact / trace / outbox 保存后 | resolver failure when required、visibility reject、repository failure | idempotency、safe snapshot、manifestation、optional fact、trace、outbox |
| `CreateReviewAnchorFlow` | command service 进入 review | review anchor 与 outbox 保存后 | target missing、not visible、repository failure | idempotency、review anchor、outbox |
| `RequestTraceHandoffFlow` | handoff command service | handoff record 与 outbox 保存后 | trace missing、handoff not allowed、repository failure | idempotency、trace handoff record、outbox |
| `RequestArchiveHandoffFlow` | archive handoff command service | archive handoff record 与 outbox 保存后 | trace / space missing、retention invalid、repository failure | idempotency、archive handoff record、outbox |
| Inbound source consumer | consumer envelope 校验后 | projection / snapshot / fact / manifestation / outbox 保存后 | invalid envelope、quarantine、repository failure | event idempotency、local reference / manifestation / fact / projection state、outbox where needed |
| Query API | 不开启写事务 | 不适用 | repository failure、visibility denied | 无写入;必须重新检查 visibility |
| Outbound event publish function | 不开启 DB 事务 | 不适用 | publish validation / transport failure | 无 DB 写入 |
| `PublishConversationOutboxFlow` | 外部 publish 完成后,每条 outbox 开短事务 | `save_state` 后 | locked record missing、invalid state、repository failure | lock outbox、mark published / retry / failed、save state |
| Read model rebuild job | 每个 space / consumer 开事务 | read model 与 projection state 保存后 | visibility failure、repository failure、state transition failure | upsert read model、projection state begin / complete / fail |
| Search rebuild job | 每个 space 开事务 | search projection 与 projection state 保存后 | read model stale policy、repository failure | upsert search projection、projection state |
| Cursor maintenance job | 每个 space 开事务 | cursor projection 和 cursor updates 保存后 | outbox gap、sequence regression、repository failure | upsert change cursor projection、save affected cursors |
| Snapshot refresh job | 每个 reference projection 开事务 | snapshot / reference projection 保存后 | resolver failure 可写 unresolved;repository failure 回滚 | upsert snapshot when success、mark unresolved when failure、upsert reference projection |
| Trace handoff delivery job | 外部 handoff 完成后,每条 handoff 开短事务 | handoff state 保存后 | locked record missing、state invalid、repository failure | lock trace handoff、mark handed off / retry / failed、save handoff |
| Archive handoff delivery job | 外部 archive delivery 完成后,每条 handoff 开短事务 | handoff state 保存后 | locked record missing、state invalid、repository failure | lock archive handoff、mark archived / retry / failed、save handoff |
| Cursor cleanup job | cleanup batch 开事务 | delete expired cursors 后 | active cursor delete attempt、repository failure | delete expired derived cursors only |

### 6.5 一致性策略表

| 一致性对象 | 策略 | 失败时处理 |
|---|---|---|
| truth + outbox | command / consumer 写 truth 时必须同事务 enqueue outbox | outbox enqueue 失败则 truth 写入回滚 |
| truth + idempotency | reserve、business write、complete 必须在同一 UnitOfWork 中闭合 | complete 失败则本次事务回滚,重复请求重新检查 idempotency |
| fact append sequence | `ConversationFactSequence` 单调递增,同一 space 内唯一 | sequence conflict 返回 repository / concurrency error |
| outbox sequence | `ConversationOutboxSequence` 单调递增,支撑 cursor projection | sequence gap 标记 cursor stale,不补造 fact |
| state transitions | 状态更新必须遵守 Step 10 矩阵 | 非法转换返回 `DomainError::InvalidStateTransition` |
| projection source position | projection `source_position` 只能前进 | regression 返回 domain / repository error |
| cursor position | cursor fact / outbox sequence 只能前进 | regression 返回 `DomainError::SequenceRegression` |
| visibility change | visibility scope 更新必须 stale read model / cursor / reference projection | projection stale 保存失败则整个 visibility command 回滚 |
| external snapshot | snapshot digest 必须匹配 source digest | mismatch 写 evidence,不更新 fresh snapshot |
| publish / handoff | 外部调用完成后再短事务写状态 | 状态写失败由 job 重跑检查外部 idempotency / published ref |
| in-memory adapter | 必须模拟唯一键、版本和锁语义 | 测试必须覆盖冲突 / 重跑 |
| durable adapter | 可以物理合表,但 repository 行为必须等价 | adapter test 必须验证事务和锁语义 |

### 6.6 恢复与补偿表

| 场景 | 恢复方式 | 不允许的做法 |
|---|---|---|
| command 事务中 repository failure | 回滚整个 UnitOfWork,调用方重试或返回错误 | 部分保存 truth 后再补 outbox |
| outbox publish transport failure | outbox 标为 `RetryPending`;重跑 publish job | 回滚 fact / scope / manifestation |
| outbox publish permanent failure | outbox 标为 `Failed`,写 operations evidence | 静默丢弃 outbox |
| projection rebuild failure | projection state 标为 `Failed`,query 暴露 degraded marker | 把 projection failed 写成 truth failed |
| source resolver failure | reference / manifestation 标为 `Unresolved` | 复制或补造来源正文 |
| handoff transient failure | handoff 标为 `RetryPending` | 删除 handoff intent |
| handoff permanent failure | handoff 标为 `Failed`,operations 承接 | 反写 Conversation fact 失败 |
| cursor expired | cleanup job 删除 derived cursor | 删除 fact、outbox 或 read model truth |
| idempotency conflict | `mark_conflict` 并返回冲突结果 | 继续执行业务写入 |

## 7. 回填草稿

> 本节不重复粘贴 §6 的完整表。正式 `03-详细设计.md` 生成 §10 时,应从本文件 §6 摘录。

正式文档 §10 建议采用以下结构:

```text
## 10. 数据持久化、事务与一致性契约

### 10.1 数据所有权实现表
引用: design-calibration/03_ddd_step_11_persistence_transaction_consistency.md §6.1

### 10.2 存储对象 / collection / projection 契约
引用: design-calibration/03_ddd_step_11_persistence_transaction_consistency.md §6.2

### 10.3 Repository 函数表
引用: design-calibration/03_ddd_step_11_persistence_transaction_consistency.md §6.3

### 10.4 事务边界表
引用: design-calibration/03_ddd_step_11_persistence_transaction_consistency.md §6.4

### 10.5 一致性策略与恢复补偿
引用: design-calibration/03_ddd_step_11_persistence_transaction_consistency.md §6.5 ~ §6.6
```

正式回填时必须保留:

| 正式章节 | 必须保留内容 |
|---|---|
| §10.1 | truth / projection / snapshot / external ref 的所有权区分 |
| §10.2 | collection 主键、唯一键、关键索引、版本字段 |
| §10.3 | repository 函数的锁 / 事务要求 |
| §10.4 | command、consumer、publish job、projection job、handoff job 的事务边界 |
| §10.5 | outbox 同事务、外部调用短事务、projection 异步补偿、source unresolved 规则 |

## 8. 待确认事项

本步无阻塞性待确认事项。以下事项留给后续 Step 或实现仓适配:

| 事项 | 当前口径 | 后续承接 |
|---|---|---|
| 具体数据库 | 本步不指定;in-memory 和 durable adapter 必须遵守同一 repository 语义 | 实施计划 / 代码实现 |
| 物理表是否合并 | 可以合并,但 repository 行为和唯一键语义不能变 | 实施计划 / adapter 设计 |
| 具体版本字段类型 | 本步只要求 `Version` 语义 | Step 13 并发幂等 |
| retry backoff 参数 | 本步只定义 retry state 和补偿口径 | Step 13 / Step 14 |

## 9. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| 数据所有权明确 | 通过 | truth、projection、snapshot、external ref 已区分 |
| 存储对象契约明确 | 通过 | 主键、唯一键、索引、版本字段已列出 |
| repository 函数事务要求明确 | 通过 | 每类 repository 的写锁 / UnitOfWork 要求已列出 |
| 事务边界明确 | 通过 | Command、Consumer、Query、Publish、Projection、Handoff、Cleanup 均覆盖 |
| 一致性和补偿规则明确 | 通过 | outbox、projection、resolver、handoff、cursor、idempotency 失败口径已列出 |
| 可进入 Step 12 错误模型 | 通过 | 下一步可把本步的 failure / conflict / retry 口径落成错误类型和恢复分支 |
