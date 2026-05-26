# Step 9. 逐接口定义函数级处理流

## 1. Step 状态

- 状态：[x] 已确认
- 对应 SOP：`standards/document/详细设计讨论流程_SOP.md` Step 9
- 回填章节：`03-详细设计.md` §8 逐接口函数级处理流

---

## 2. 本步输入

| 输入 | 内容 |
|---|---|
| Step 5 模块主轴 | 已确认 `api` / `worker` 只能调用 application service,不能直连 repository |
| Step 6 对象契约 | 已确认 Command / Query / Event / Job DTO、`MethodContent`、snapshot、outbox、projection、job record 等对象 |
| Step 7 Port 契约 | 已确认 `UnitOfWork`、repository、outbound port、support port 的 trait 方向 |
| Step 8 协议契约 | 已确认 P0 Command / Query / Event / Inbound / Job 协议清单、HTTP JSON 优先、RPC 可选映射 |
| `03-详细设计.md` 旧 §10~§14 | 已有数据流草稿,但需要按新版 §8 重排为逐接口函数级处理流 |

已确认结论：

```text
Step 9 不重新定义协议 schema。
Step 9 负责把 Step 8 中“需要处理流”的协议逐项落成函数级调用链。
每个处理流必须能回指 Step 5~7 的模块、对象、trait 和 Step 8 的协议契约。
Command / Job 写路径必须说明事务边界、幂等、audit/outbox/checkpoint。
Query 必须说明只读来源和一致性字段,不得写 truth。
Outbound Event 必须通过 outbox relay 发布,不能绕过 outbox。
```

依赖的前序 Step：

```text
Step 1~8 已确认上游输入、范围、runtime、文件布局、模块契约、对象契约、port 契约和协议契约。
```

---

## 3. SOP 问题回答

1. 哪些协议必须拥有函数级处理流？

   回答：Step 8 标记为 P0 且“需要 Step 9 处理流”的协议都必须拥有处理流。包括 7 个 Command、6 个 Query、4 类基础 Outbound Event、5 类 Inbound / External Dependency 和 4 个 Operations Job。P1 协议只保留索引,不在本步展开完整处理流。

2. 每个处理流的入口函数是什么？

   回答：HTTP / RPC 入口先进入 `api` handler,handler 只解析 DTO 和 Gateway context,随后调用 application service。Command 入口是 `MethodContentCommandService.*`；Query 入口是 `MethodContentQueryService.*` 或 `ViewProfileResolveService.resolve_view_profile(...)`；Outbound Event 入口是 `OutboxRelayService.relay_pending_events(...)`；Operations Job 入口是 `MethodLibraryJobService.*`。

3. 入口函数调用哪些 application service、domain method、repository 和 outbox？

   回答：Command 调用 idempotency、`UnitOfWork`、write repository、domain aggregate / policy、audit、snapshot、outbox。Query 调用 projection / read repository / snapshot store,不调用 outbox。Event relay 调用 outbox repository 和 `BusPublisherPort`。Job 调用 job repository、checkpoint、command service、outbox、projection、fingerprint 或 replay port,但不得绕过 domain 规则直接改 write model。

4. 事务在哪里开始，在哪里提交，哪些错误触发回滚？

   回答：Command 和会写 checkpoint / projection / job_run 的 Job 在 application service 内通过 `UnitOfWork.begin(RequestMeta meta)` 开启事务；所有业务写入、audit、outbox、idempotency result 必须在同一事务提交。domain validation、revision conflict、repository error、snapshot 构造失败、outbox append 失败都触发回滚。外部 bus 发布不在 Command 事务内发生。

5. 哪些状态会被修改，哪些事件会被写入？

   回答：create/update/submit/publish/deprecate/retire/supersede 会修改 `MethodContentLifecycle` 或 revision。publish/supersede 生成 snapshot 和 published event；deprecate/retire 生成 lifecycle event；fingerprint 重算只在发现不一致时生成 `fingerprint_changed` 事件或 mismatch report,第一版不自动改 truth。

6. 每个处理流至少需要哪些测试切口？

   回答：每个处理流至少需要一个正向测试和一个异常测试。Command 重点测试状态迁移、revision conflict、幂等冲突和 outbox 同事务；Query 重点测试只读、not found、分页和一致性字段；Event relay 重点测试 bus 成功、失败重试和不重复发布；Job 重点测试 dry_run、resume/checkpoint、幂等和不得绕过 command/domain 规则。

---

## 4. 当前文档问题诊断

| 位置 | 当前问题 | 影响 |
|---|---|---|
| `03-详细设计.md` §10~§14 | Command / Query / Event / Job 的协议、处理流、错误码和测试混写 | 实现者难以按接口逐个编码和验证 |
| `03-详细设计.md` §4.2~§4.5 | 只有主路径总图,缺逐接口入口函数和对象调用 | 不能 1:1 还原 service / repository / domain 调用 |
| `03-详细设计.md` §26 / §27 | 有函数签名和 port,但没有把它们串成每个接口的处理流 | 对象契约与实际用例之间缺桥 |
| 旧 Command 章节 | publish 流较清楚,create/update/submit/deprecate/retire/supersede 差异不够明确 | 容易所有 command 共用一套粗流程,遗漏状态副作用 |
| 旧 Event 章节 | outbox event schema 与 relay/replay 流混在一起 | 可能误把事件创建和事件发布放进同一事务 |
| 旧 Operations Job 章节 | job 有总路径,但没有说明哪些 job 复用 command service、哪些只读、哪些只写 projection | 实现时容易直接 insert 或反写 truth |

---

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 处理流组织 | 按 Command / Query / Event 大类写长段落 | 每个协议一个独立处理流小节 | 支撑逐接口编码、测试和验收 |
| 调用粒度 | 多为自然语言步骤 | 明确 `对象.函数(Type 参数名)` 调用链 | 符合详细设计可实现契约要求 |
| 事务边界 | 事务规则分散在多个章节 | 每个处理流标注 tx begin / commit / rollback | 避免 write model、audit、outbox 不一致 |
| Event 发布 | schema 与 relay 流混写 | Command 只 append outbox,relay 单独发布 | 保持可靠事件发布边界 |
| Job 实现 | operations 总路径 | 每个 job 标明是否复用 command service、checkpoint、dry_run | 防止 job 绕过 domain / lifecycle |
| 测试切口 | 测试点分散 | 每个处理流给正向和异常测试切口 | 后续测试方案可直接引用 |

---

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 只写 5 类通用处理流 | 文档短 | 实现者仍要从协议推导每个接口差异 | 不采用 |
| 每个接口完整展开到所有 repository 调用 | 信息最完整 | 本步会过早侵入 Step 11 持久化细节,文档极长 | 不采用 |
| 每个接口独立小节 + 公共骨架 + 差异调用表 | 可编码,又避免重复 | 正式回填时仍需保持索引清楚 | 采用 |
| Command 内直接发布 L0-bus 事件 | 延迟低 | 外部失败会污染本地事务,破坏可靠发布 | 不采用 |
| Command append outbox,relay 异步发布 | 本地事务可靠,可重试 | 下游最终一致 | 采用 |

---

## 7. 结构化中间产物

### 7.1 处理流统一规则

```text
Inbound adapter
  | parse DTO + GatewayHeaders
  | call application service
  v
Application service
  | enforce idempotency / read policy
  | tx begin when write path
  | call domain object / domain service
  | call repository / outbox / snapshot / projection port
  | tx commit or rollback
  v
Response DTO / Event Ack / Job Result
```

关键说明：

- `api` handler 只做协议转换,不承载业务规则。
- `worker` runner 只触发 job / relay,不直接改 write model。
- 所有写 truth 的路径必须进入 application service 和 domain method。
- Query 只读,不创建 audit / outbox / lifecycle history。
- 图中 `tx` 表示 application service 通过 `UnitOfWork` 控制事务边界。

### 7.2 处理流总表

| 处理流 | 对应协议 | 入口函数 | 主要事务 | 状态变化 | 测试切口 |
|---|---|---|---|---|---|
| `CreateMethodContentDraftFlow` | `CreateMethodContentDraft` | `MethodContentCommandService.create_draft(CreateMethodContentDraftCommand command, ActorContext actor, RequestMeta meta)` | content + audit + idempotency | new -> draft | 创建成功;幂等冲突;payload/kind 不匹配 |
| `UpdateMethodContentDraftFlow` | `UpdateMethodContentDraft` | `MethodContentCommandService.update_draft(UpdateMethodContentDraftCommand command, ActorContext actor, RequestMeta meta)` | content + audit + idempotency | draft revision +1 | 更新成功;非 draft 失败;revision conflict |
| `SubmitMethodContentForReviewFlow` | `SubmitMethodContentForReview` | `MethodContentCommandService.submit_for_review(SubmitMethodContentForReviewCommand command, ActorContext actor, RequestMeta meta)` | content + lifecycle history + audit + idempotency | draft -> in_review | 提交成功;非法状态;重复提交 |
| `PublishMethodContentFlow` | `PublishMethodContent` | `MethodContentCommandService.publish(PublishMethodContentCommand command, ActorContext actor, RequestMeta meta)` | content + version + snapshot + audit + outbox + idempotency | draft/in_review -> published | 发布成功;gate invalid;reference invalid;outbox rollback |
| `DeprecateMethodContentFlow` | `DeprecateMethodContent` | `MethodContentCommandService.deprecate(DeprecateMethodContentCommand command, ActorContext actor, RequestMeta meta)` | content + audit + outbox + idempotency | published -> deprecated | 废弃成功;非 published 失败 |
| `RetireMethodContentFlow` | `RetireMethodContent` | `MethodContentCommandService.retire(RetireMethodContentCommand command, ActorContext actor, RequestMeta meta)` | content + audit + outbox + idempotency | published/deprecated -> retired | 退役成功;已 retired 重入 |
| `SupersedeMethodContentFlow` | `SupersedeMethodContent` | `MethodContentCommandService.supersede(SupersedeMethodContentCommand command, ActorContext actor, RequestMeta meta)` | old content + new content + link + snapshot + audit + outbox + idempotency | old -> superseded, new -> published | 替代成功;双 revision conflict;gate invalid |
| `GetMethodContentFlow` | `GetMethodContent` | `MethodContentQueryService.get_method_content(GetMethodContentQuery query, ActorContext actor, RequestMeta meta)` | 无写事务 | 无 | 查到;not found;visibility denied |
| `ListMethodContentsFlow` | `ListMethodContents` | `MethodContentQueryService.list_method_contents(ListMethodContentsQuery query, ActorContext actor, RequestMeta meta)` | 无写事务 | 无 | 分页成功;limit 超限 |
| `GetMethodContentVersionFlow` | `GetMethodContentVersion` | `MethodContentQueryService.get_method_content_version(GetMethodContentVersionQuery query, ActorContext actor, RequestMeta meta)` | 无写事务 | 无 | 版本查到;version not found |
| `ExportDefinitionSnapshotFlow` | `ExportDefinitionSnapshot` | `DefinitionSnapshotService.export_snapshot(ExportDefinitionSnapshotQuery query, ActorContext actor, RequestMeta meta)` | 无写事务 | 无 | 导出成功;fingerprint mismatch;blob 不可用 |
| `ResolveViewProfileFlow` | `ResolveViewProfile` | `ViewProfileResolveService.resolve_view_profile(ResolveViewProfileQuery query, ActorContext actor, RequestMeta meta)` | 无写事务 | 无 | 解析成功;profile 不存在;scope 不匹配 |
| `GetDefinitionTraceFlow` | `GetDefinitionTrace` | `MethodContentQueryService.get_definition_trace(GetDefinitionTraceQuery query, ActorContext actor, RequestMeta meta)` | 无写事务 | 无 | trace 成功;分页;projection stale |
| `PublishedEventRelayFlow` | `method_library.content.published` | `OutboxRelayService.relay_pending_events(RelayOutboxEventsJobRequest job, RequestMeta meta)` | outbox status update | outbox pending -> delivered/retryable | 发布成功;bus failure;重复 relay |
| `DeprecatedEventRelayFlow` | `method_library.content.deprecated` | `OutboxRelayService.relay_pending_events(RelayOutboxEventsJobRequest job, RequestMeta meta)` | outbox status update | outbox pending -> delivered/retryable | 发布成功;bus failure |
| `RetiredEventRelayFlow` | `method_library.content.retired` | `OutboxRelayService.relay_pending_events(RelayOutboxEventsJobRequest job, RequestMeta meta)` | outbox status update | outbox pending -> delivered/retryable | 发布成功;bus failure |
| `FingerprintChangedEventRelayFlow` | `method_library.content.fingerprint_changed` | `OutboxRelayService.relay_pending_events(RelayOutboxEventsJobRequest job, RequestMeta meta)` | outbox status update | outbox pending -> delivered/retryable | 发布成功;event_id 幂等 |
| `ValidateGovernanceGateFlow` | `governance.publish_gate.approved` | `PublishGovernanceService.validate_publish_gate(MethodContent content, ApprovedGateRef gate_ref, ActorContext actor, RequestMeta meta)` | 无写事务 | 无 | gate 有效;gate 无效;governance 不可用 |
| `HandleGovernanceGateApprovedFlow` | `handle_governance_gate_approved` | `GovernanceInboundService.handle_governance_gate_approved(GovernanceGateApprovedEvent event, RequestMeta meta)` | event idempotency + gate projection | gate projection upsert | 入站成功;重复事件;payload hash conflict |
| `SnapshotPayloadFlow` | `object_storage.snapshot_payload` | `DefinitionSnapshotService.build_snapshot(MethodContent content, SnapshotSchemaVersion schema_version, ActorContext actor, RequestMeta meta)` | command 事务内保存 metadata,外部 payload 通过 port | 无 lifecycle 变化 | snapshot 成功;payload put failed |
| `BusPublishResultFlow` | `l0_bus.publish_result` | `OutboxRelayService.handle_bus_publish_result(BusPublishResult result, RequestMeta meta)` | outbox status update | outbox status update | ack 成功;retryable failure |
| `DownstreamReplayRequestFlow` | `downstream.replay_request` | `MethodLibraryJobService.replay_definition_events(ReplayDefinitionEventsJobRequest request, ActorContext actor, RequestMeta meta)` | job_run + checkpoint | 无 truth 变化 | replay 成功;cursor invalid |
| `SeedInitialMethodAssetsFlow` | `SeedInitialMethodAssets` | `MethodLibraryJobService.seed_initial_method_assets(SeedInitialMethodAssetsJobRequest request, ActorContext actor, RequestMeta meta)` | job_run + command transactions | draft/published by command | seed 成功;dry_run;重复 seed |
| `ReplayDefinitionEventsFlow` | `ReplayDefinitionEvents` | `MethodLibraryJobService.replay_definition_events(ReplayDefinitionEventsJobRequest request, ActorContext actor, RequestMeta meta)` | job_run + checkpoint | 无 truth 变化 | replay 成功;consumer filter;resume |
| `RecalculateFingerprintFlow` | `RecalculateFingerprint` | `MethodLibraryJobService.recalculate_fingerprint(RecalculateFingerprintJobRequest request, ActorContext actor, RequestMeta meta)` | job_run + report,可选 outbox | 默认无 truth 变化 | mismatch report;dry_run;hash failure |
| `RebuildReadModelsFlow` | `RebuildReadModels` | `MethodLibraryJobService.rebuild_read_models(RebuildReadModelsJobRequest request, ActorContext actor, RequestMeta meta)` | projection + checkpoint | projection rebuild | rebuild 成功;中断 resume;不得改 truth |

### 7.3 Command 通用骨架

#### 函数级调用图: Command write path

```text
[HTTP/RPC Command Handler]
  | call ActorContext::from_gateway_headers(GatewayHeaders headers)
  | call RequestMeta::from_http_request(HttpRequest request)
  | call MethodContentCommandService.<command>(CommandDto command, ActorContext actor, RequestMeta meta)
  v
[MethodContentCommandService]
  | tx UnitOfWork.begin(RequestMeta meta)
  | call IdempotencyRepository.try_begin(UnitOfWorkTx tx, IdempotencyKey key, IdempotencyScope scope, RequestHash request_hash)
  | call repository / domain / policy / snapshot / outbox
  | tx UnitOfWorkTx.commit()
  v
[Command Response DTO]
```

关键伪代码骨架：

```rust
// [MethodContentCommandService.<command>(CommandDto command, ActorContext actor, RequestMeta meta)]
// Command 写路径的统一入口:校验幂等、开启事务、调用领域对象、写 audit/outbox、提交事务。
async fn handle_command(command: CommandDto, actor: ActorContext, meta: RequestMeta) -> Result<ResponseDto, MethodLibraryError> {
    // [UnitOfWork.begin(RequestMeta meta)]
    // 开启本次写路径事务,后续 write model、audit、outbox、idempotency result 必须同事务提交。
    let mut tx = unit_of_work.begin(meta.clone()).await?;

    // [IdempotencyRepository.try_begin(UnitOfWorkTx tx, IdempotencyKey key, IdempotencyScope scope, RequestHash request_hash)]
    // 根据幂等键和请求 hash 防止重复执行或同 key 不同 payload。
    idempotency_repository.try_begin(&mut tx, meta.idempotency_key(), command.scope(), meta.request_hash()).await?;

    // [具体领域调用]
    // 每个 Command 在独立小节中定义差异调用。

    // [UnitOfWorkTx.commit()]
    // 提交全部本地写入;如果中途返回 Err,调用方必须回滚或由 UnitOfWork drop rollback。
    tx.commit().await?;

    Ok(response)
}
```

### 7.4 P0 Command 独立处理流

#### 7.4.1 `CreateMethodContentDraftFlow`

| 项 | 内容 |
|---|---|
| 入口函数 | `MethodContentCommandService.create_draft(CreateMethodContentDraftCommand command, ActorContext actor, RequestMeta meta)` |
| 目标 | 创建新的 draft MethodContent,不发布事件 |
| 事务 | `MethodContentRepository.insert` + `AuditRepository.append` + `IdempotencyRepository.mark_completed` |
| 状态副作用 | new -> draft,revision 初始化 |
| 事件副作用 | 无 outbox |

```text
[Command Handler]
  | call create_draft(CreateMethodContentDraftCommand command, ActorContext actor, RequestMeta meta)
  v
[MethodContentCommandService]
  | tx begin
  | call MethodContent::create_draft(CreateMethodContentDraftCommand command, ActorContext actor, Timestamp now)
  | call MethodContent.ensure_payload_matches_kind()
  | call MethodContent.ensure_definition_boundary()
  v
[Repositories]
  | save MethodContentRepository.insert(UnitOfWorkTx tx, MethodContent content)
  | append AuditRepository.append(UnitOfWorkTx tx, AuditRecord record)
  | complete IdempotencyRepository.mark_completed(UnitOfWorkTx tx, IdempotencyKey key, ResultRef response_ref)
  | tx commit
```

关键调用：

| 调用 | 作用 |
|---|---|
| `Clock.now()` | 生成创建时间 |
| `IdGenerator.new_content_id()` | 生成 `ContentId` |
| `MethodContent::create_draft(CreateMethodContentDraftCommand command, ActorContext actor, Timestamp now)` | 构造 draft aggregate |
| `MethodContentRepository.insert(UnitOfWorkTx tx, MethodContent content)` | 持久化新 aggregate |

错误映射：`IDEMPOTENCY_KEY_REQUIRED`、`IDEMPOTENCY_CONFLICT`、`BOUNDARY_VIOLATION`、`PAYLOAD_KIND_MISMATCH`、`CONTENT_VERSION_CONFLICT`。

测试切口：创建 draft 成功；同幂等键同 payload 返回既有结果；payload 与 kind 不匹配失败；repository insert 失败触发回滚。

#### 7.4.2 `UpdateMethodContentDraftFlow`

| 项 | 内容 |
|---|---|
| 入口函数 | `MethodContentCommandService.update_draft(UpdateMethodContentDraftCommand command, ActorContext actor, RequestMeta meta)` |
| 目标 | 更新 draft 内容和引用 |
| 事务 | 带锁读取 content,保存 content,替换 refs,写 audit,完成幂等 |
| 状态副作用 | lifecycle 不变,revision +1 |
| 事件副作用 | 无 outbox |

```text
[MethodContentCommandService]
  | tx begin
  | call MethodContentRepository.get_for_update(UnitOfWorkTx tx, ContentId content_id)
  | call MethodContent.update_draft(UpdateMethodContentDraftCommand command, ActorContext actor)
  | call BoundaryGuard.ensure_definition_boundary(MethodContentPayload payload)
  | call MethodContentReferenceRepository.replace_refs(UnitOfWorkTx tx, ContentId source_content_id, Vec<ContentRef> refs)
  | save MethodContentRepository.save(UnitOfWorkTx tx, MethodContent content, Revision expected_revision)
  | append AuditRepository.append(UnitOfWorkTx tx, AuditRecord record)
  | tx commit
```

关键调用：

| 调用 | 作用 |
|---|---|
| `MethodContentRepository.get_for_update(UnitOfWorkTx tx, ContentId content_id)` | 锁定待更新 aggregate |
| `MethodContent.update_draft(UpdateMethodContentDraftCommand command, ActorContext actor)` | 校验 draft 状态并更新 payload |
| `MethodContentRepository.save(UnitOfWorkTx tx, MethodContent content, Revision expected_revision)` | 通过 revision 乐观锁保存 |

错误映射：`METHOD_CONTENT_NOT_FOUND`、`REVISION_CONFLICT`、`PUBLISHED_CONTENT_IMMUTABLE`、`LIFECYCLE_TRANSITION_NOT_ALLOWED`、`BOUNDARY_VIOLATION`。

测试切口：draft 更新成功；published content 更新失败；expected_revision 不匹配失败；refs 原子替换失败回滚 content。

#### 7.4.3 `SubmitMethodContentForReviewFlow`

| 项 | 内容 |
|---|---|
| 入口函数 | `MethodContentCommandService.submit_for_review(SubmitMethodContentForReviewCommand command, ActorContext actor, RequestMeta meta)` |
| 目标 | 将 draft 提交为 in_review |
| 事务 | content + lifecycle history + audit + idempotency |
| 状态副作用 | draft -> in_review |
| 事件副作用 | 无 outbox |

```text
[MethodContentCommandService]
  | tx begin
  | call MethodContentRepository.get_for_update(UnitOfWorkTx tx, ContentId content_id)
  | call MethodContent.submit_for_review(ActorContext actor)
  | append LifecycleHistoryRepository.append(UnitOfWorkTx tx, LifecycleHistoryEntry entry)
  | append AuditRepository.append(UnitOfWorkTx tx, AuditRecord record)
  | save MethodContentRepository.save(UnitOfWorkTx tx, MethodContent content, Revision expected_revision)
  | tx commit
```

错误映射：`METHOD_CONTENT_NOT_FOUND`、`REVISION_CONFLICT`、`LIFECYCLE_TRANSITION_NOT_ALLOWED`。

测试切口：draft 提交成功；in_review 重复提交返回状态冲突；revision conflict 失败。

#### 7.4.4 `PublishMethodContentFlow`

| 项 | 内容 |
|---|---|
| 入口函数 | `MethodContentCommandService.publish(PublishMethodContentCommand command, ActorContext actor, RequestMeta meta)` |
| 目标 | 发布 definition,生成 version、fingerprint、snapshot 和 outbox event |
| 事务 | content + version + published refs + snapshot metadata + audit + outbox + idempotency |
| 状态副作用 | draft/in_review -> published |
| 事件副作用 | `method_library.content.published` + kind-specific published event |

```text
[MethodContentCommandService]
  | tx begin
  | call MethodContentRepository.get_for_update(UnitOfWorkTx tx, ContentId content_id)
  | call PublishGovernanceService.validate_publish_gate(MethodContent content, ApprovedGateRef gate_ref, ActorContext actor, RequestMeta meta)
  | call ReferenceValidationService.validate_published_refs(MethodContent content, Vec<ContentRef> refs)
  | call FingerprintHasher.hash_canonical_bytes(CanonicalBytes bytes, FingerprintAlgorithm algorithm)
  | call MethodContent.publish(ApprovedGateRef gate_ref, ContentVersion version, CanonicalFingerprint fingerprint, ActorContext actor)
  | call DefinitionSnapshotService.build_snapshot(MethodContent content, SnapshotSchemaVersion schema_version, ActorContext actor, RequestMeta meta)
  | save MethodContentRepository.save(UnitOfWorkTx tx, MethodContent content, Revision expected_revision)
  | insert MethodContentVersionRepository.insert(UnitOfWorkTx tx, MethodContentVersionRecord record)
  | insert DefinitionSnapshotRepository.insert(UnitOfWorkTx tx, DefinitionSnapshot snapshot)
  | append OutboxRepository.append(UnitOfWorkTx tx, OutboxEvent event)
  | append AuditRepository.append(UnitOfWorkTx tx, AuditRecord record)
  | tx commit
```

错误映射：`METHOD_CONTENT_NOT_FOUND`、`REVISION_CONFLICT`、`PUBLISH_GATE_REQUIRED`、`PUBLISH_GATE_INVALID`、`REFERENCE_NOT_PUBLISHED`、`FINGERPRINT_BUILD_FAILED`、`SNAPSHOT_BUILD_FAILED`。

测试切口：publish 成功且 outbox 同事务写入；gate invalid 回滚；reference 未 published 失败；snapshot 构造失败不保存 published 状态。

#### 7.4.5 `DeprecateMethodContentFlow`

| 项 | 内容 |
|---|---|
| 入口函数 | `MethodContentCommandService.deprecate(DeprecateMethodContentCommand command, ActorContext actor, RequestMeta meta)` |
| 目标 | 标记 published definition 为 deprecated |
| 事务 | content + lifecycle history + audit + outbox + idempotency |
| 状态副作用 | published -> deprecated |
| 事件副作用 | `method_library.content.deprecated` |

```text
[MethodContentCommandService]
  | tx begin
  | call MethodContentRepository.get_for_update(UnitOfWorkTx tx, ContentId content_id)
  | call MethodContent.deprecate(DeprecateMethodContentCommand command, ActorContext actor)
  | save MethodContentRepository.save(UnitOfWorkTx tx, MethodContent content, Revision expected_revision)
  | append OutboxRepository.append(UnitOfWorkTx tx, OutboxEvent event)
  | append AuditRepository.append(UnitOfWorkTx tx, AuditRecord record)
  | tx commit
```

错误映射：`METHOD_CONTENT_NOT_FOUND`、`REVISION_CONFLICT`、`LIFECYCLE_TRANSITION_NOT_ALLOWED`。

测试切口：published 废弃成功；draft 废弃失败；outbox append 失败回滚状态。

#### 7.4.6 `RetireMethodContentFlow`

| 项 | 内容 |
|---|---|
| 入口函数 | `MethodContentCommandService.retire(RetireMethodContentCommand command, ActorContext actor, RequestMeta meta)` |
| 目标 | 将 definition 退役,阻止新的引用和使用 |
| 事务 | content + lifecycle history + audit + outbox + idempotency |
| 状态副作用 | published/deprecated -> retired |
| 事件副作用 | `method_library.content.retired` |

```text
[MethodContentCommandService]
  | tx begin
  | call MethodContentRepository.get_for_update(UnitOfWorkTx tx, ContentId content_id)
  | call MethodContent.retire(RetireMethodContentCommand command, ActorContext actor)
  | save MethodContentRepository.save(UnitOfWorkTx tx, MethodContent content, Revision expected_revision)
  | append OutboxRepository.append(UnitOfWorkTx tx, OutboxEvent event)
  | append AuditRepository.append(UnitOfWorkTx tx, AuditRecord record)
  | tx commit
```

错误映射：`METHOD_CONTENT_NOT_FOUND`、`REVISION_CONFLICT`、`LIFECYCLE_TRANSITION_NOT_ALLOWED`。

测试切口：deprecated 退役成功；已 retired 重复操作幂等返回或冲突按错误模型确认；退役事件 payload 包含 `retire_policy`。

#### 7.4.7 `SupersedeMethodContentFlow`

| 项 | 内容 |
|---|---|
| 入口函数 | `MethodContentCommandService.supersede(SupersedeMethodContentCommand command, ActorContext actor, RequestMeta meta)` |
| 目标 | 用新 definition 替代旧 definition,并发布替代链 |
| 事务 | old content + new content + supersede link + version + snapshot + audit + outbox + idempotency |
| 状态副作用 | old published/deprecated -> superseded,new draft/in_review -> published |
| 事件副作用 | old lifecycle event + new published event + possible fingerprint_changed |

```text
[MethodContentCommandService]
  | tx begin
  | call MethodContentRepository.get_for_update(UnitOfWorkTx tx, ContentId old_content_id)
  | call MethodContentRepository.get_for_update(UnitOfWorkTx tx, ContentId new_content_id)
  | call PublishGovernanceService.validate_publish_gate(MethodContent new_content, ApprovedGateRef gate_ref, ActorContext actor, RequestMeta meta)
  | call MethodContent.supersede_by(ContentId next_content_id, ActorContext actor)
  | call MethodContent.publish(ApprovedGateRef gate_ref, ContentVersion version, CanonicalFingerprint fingerprint, ActorContext actor)
  | insert SupersedeLinkRepository.insert(UnitOfWorkTx tx, SupersedeLink link)
  | insert DefinitionSnapshotRepository.insert(UnitOfWorkTx tx, DefinitionSnapshot snapshot)
  | append OutboxRepository.append(UnitOfWorkTx tx, OutboxEvent old_event)
  | append OutboxRepository.append(UnitOfWorkTx tx, OutboxEvent new_event)
  | tx commit
```

错误映射：`METHOD_CONTENT_NOT_FOUND`、`REVISION_CONFLICT`、`PUBLISH_GATE_INVALID`、`LIFECYCLE_TRANSITION_NOT_ALLOWED`、`REFERENCE_INVALID`。

测试切口：替代成功且 old/new 同事务；old revision conflict 失败；new gate invalid 失败；重复 supersede 幂等处理。

### 7.5 P0 Query 独立处理流

#### Query 通用调用图

```text
[HTTP/RPC Query Handler]
  | call ActorContext::from_gateway_headers(GatewayHeaders headers)
  | call RequestMeta::from_http_request(HttpRequest request)
  | call QueryService.<query>(QueryDto query, ActorContext actor, RequestMeta meta)
  v
[Query Service]
  | enforce read_mode / visibility
  | read projection / repository / snapshot store
  v
[Query Response DTO]
```

关键说明：

- Query 不调用 `UnitOfWork.begin` 写事务。
- Query 不写 `AuditRecord`、`OutboxEvent`、`IdempotencyRecord`。
- Query 可以读取 projection,但 response 必须带 consistency 信息。

#### 7.5.1 `GetMethodContentFlow`

| 项 | 内容 |
|---|---|
| 入口函数 | `MethodContentQueryService.get_method_content(GetMethodContentQuery query, ActorContext actor, RequestMeta meta)` |
| 关键调用 | `ContentSummaryProjectionRepository.get_content_summary(GetMethodContentQuery query)` / `MethodContentRepository.get(ContentId content_id)` |
| 事务 | 无写事务 |
| 一致性 | 返回 projection/source 标记和 revision/fingerprint |
| 错误映射 | `METHOD_CONTENT_NOT_FOUND`、`VISIBILITY_DENIED` |
| 测试切口 | published 读取成功;authoring read_mode 读取 draft;not found |

#### 7.5.2 `ListMethodContentsFlow`

| 项 | 内容 |
|---|---|
| 入口函数 | `MethodContentQueryService.list_method_contents(ListMethodContentsQuery query, ActorContext actor, RequestMeta meta)` |
| 关键调用 | `ContentSummaryProjectionRepository.list(PageRequest page, MethodContentFilter filter)` |
| 事务 | 无写事务 |
| 一致性 | 返回 page cursor 和 projection checkpoint |
| 错误映射 | `PAGE_LIMIT_EXCEEDED`、`FILTER_INVALID` |
| 测试切口 | 分页成功;limit 超限;按 kind/lifecycle 筛选 |

#### 7.5.3 `GetMethodContentVersionFlow`

| 项 | 内容 |
|---|---|
| 入口函数 | `MethodContentQueryService.get_method_content_version(GetMethodContentVersionQuery query, ActorContext actor, RequestMeta meta)` |
| 关键调用 | `MethodContentVersionRepository.get(ContentId content_id, ContentVersion version)` |
| 事务 | 无写事务 |
| 一致性 | 返回 version record 的 fingerprint 和 snapshot_ref |
| 错误映射 | `CONTENT_VERSION_NOT_FOUND` |
| 测试切口 | 指定版本读取成功;不存在版本失败 |

#### 7.5.4 `ExportDefinitionSnapshotFlow`

| 项 | 内容 |
|---|---|
| 入口函数 | `DefinitionSnapshotService.export_snapshot(ExportDefinitionSnapshotQuery query, ActorContext actor, RequestMeta meta)` |
| 关键调用 | `DefinitionSnapshotRepository.get(SnapshotId snapshot_id)` -> `ObjectStoragePort.get_snapshot_payload(SnapshotBlobRef blob_ref, RequestMeta meta)` |
| 事务 | 无写事务 |
| 一致性 | 必须校验 snapshot fingerprint 与 response payload 一致 |
| 错误映射 | `SNAPSHOT_NOT_FOUND`、`FINGERPRINT_MISMATCH`、`OBJECT_STORAGE_UNAVAILABLE` |
| 测试切口 | snapshot 导出成功;hash 校验失败;object storage 不可用 |

#### 7.5.5 `ResolveViewProfileFlow`

| 项 | 内容 |
|---|---|
| 入口函数 | `ViewProfileResolveService.resolve_view_profile(ResolveViewProfileQuery query, ActorContext actor, RequestMeta meta)` |
| 关键调用 | `MethodContentRepository.find_published_by_kind(MethodContentKind::ViewProfile)` -> `ViewProfilePolicy.resolve(ResolveViewProfileQuery query, Vec<ViewProfile> candidates)` |
| 事务 | 无写事务 |
| 一致性 | 返回命中的 ViewProfile version / fingerprint |
| 错误映射 | `METHOD_CONTENT_NOT_FOUND`、`REFERENCE_INVALID`、`SCOPE_NOT_SUPPORTED` |
| 测试切口 | 解析成功;role/object_kind 不匹配;只读无副作用 |

#### 7.5.6 `GetDefinitionTraceFlow`

| 项 | 内容 |
|---|---|
| 入口函数 | `MethodContentQueryService.get_definition_trace(GetDefinitionTraceQuery query, ActorContext actor, RequestMeta meta)` |
| 关键调用 | `DefinitionTraceProjectionRepository.get_trace(ContentId content_id, PageRequest page)` |
| 事务 | 无写事务 |
| 一致性 | 返回 trace projection checkpoint;必要时标记 stale |
| 错误映射 | `METHOD_CONTENT_NOT_FOUND`、`PAGE_LIMIT_EXCEEDED` |
| 测试切口 | trace 成功;分页;projection stale 时返回 consistency |

### 7.6 P0 Outbound Event / outbox relay 处理流

#### 函数级调用图: Outbox relay

```text
[Worker / Job Trigger]
  | call OutboxRelayService.relay_pending_events(RelayOutboxEventsJobRequest job, RequestMeta meta)
  v
[OutboxRelayService]
  | call OutboxRepository.load_pending(BatchSize limit, Timestamp now)
  | call OutboxEvent.mark_in_progress(Timestamp now)
  | save OutboxRepository.mark_in_progress(OutboxEventId event_id, Timestamp now)
  | call BusPublisherPort.publish(Topic topic, DefinitionEventEnvelope event, RequestMeta meta)
  | save OutboxRepository.mark_published(OutboxEventId event_id, Timestamp now)
```

关键伪代码：

```rust
// [OutboxRelayService.relay_pending_events(RelayOutboxEventsJobRequest job, RequestMeta meta)]
// 发布已经持久化的 outbox event;不得在这里构造新的业务事件。
async fn relay_pending_events(job: RelayOutboxEventsJobRequest, meta: RequestMeta) -> Result<RelayOutboxEventsJobResult, MethodLibraryError> {
    // [OutboxRepository.load_pending(BatchSize limit, Timestamp now)]
    // 加载可发布事件,并限制批量大小。
    let events = outbox_repository.load_pending(job.batch_size(), clock.now()).await?;

    for event in events {
        // [BusPublisherPort.publish(Topic topic, DefinitionEventEnvelope event, RequestMeta meta)]
        // 将已持久化事件发布到 L0-bus。
        match bus_publisher.publish(event.topic(), event.envelope(), meta.clone()).await {
            Ok(_) => outbox_repository.mark_published(event.event_id(), clock.now()).await?,
            Err(reason) => outbox_repository.mark_retryable_failure(event.event_id(), reason, clock.now()).await?,
        }
    }

    Ok(result)
}
```

| Event flow | event_type | topic | payload 差异 | 测试切口 |
|---|---|---|---|---|
| `PublishedEventRelayFlow` | `method_library.content.published` | `method-library.definition.events` | `content_id`、`kind`、`version`、`fingerprint`、`snapshot_ref` | 发布成功;kind-specific event 同步生成或同 outbox 承载 |
| `DeprecatedEventRelayFlow` | `method_library.content.deprecated` | `method-library.lifecycle.events` | `reason`、`effective_at` | bus failure 后 retryable |
| `RetiredEventRelayFlow` | `method_library.content.retired` | `method-library.lifecycle.events` | `reason`、`retire_policy` | 重复 relay 不重复消费 |
| `FingerprintChangedEventRelayFlow` | `method_library.content.fingerprint_changed` | `method-library.definition.events` | `old_fingerprint`、`new_fingerprint`、`snapshot_ref` | event_id 幂等;下游可 resync |

#### 7.6.1 `PublishedEventRelayFlow`

| 项 | 内容 |
|---|---|
| 入口函数 | `OutboxRelayService.relay_pending_events(RelayOutboxEventsJobRequest job, RequestMeta meta)` |
| outbox 来源 | `PublishMethodContentFlow` / `SupersedeMethodContentFlow` / `SeedInitialMethodAssetsFlow` |
| event_type | `method_library.content.published` |
| topic | `method-library.definition.events` |
| 关键调用 | `BusPublisherPort.publish(Topic topic, DefinitionEventEnvelope event, RequestMeta meta)` |
| 测试切口 | 发布成功;bus failure 标记 retryable;重复 event_id 不重复消费 |

#### 7.6.2 `DeprecatedEventRelayFlow`

| 项 | 内容 |
|---|---|
| 入口函数 | `OutboxRelayService.relay_pending_events(RelayOutboxEventsJobRequest job, RequestMeta meta)` |
| outbox 来源 | `DeprecateMethodContentFlow` |
| event_type | `method_library.content.deprecated` |
| topic | `method-library.lifecycle.events` |
| 关键调用 | `OutboxEvent.mark_delivered(Timestamp now)` / `OutboxEvent.mark_retryable_failure(FailureReason reason, Timestamp now)` |
| 测试切口 | deprecated event payload 完整;bus failure 可重试 |

#### 7.6.3 `RetiredEventRelayFlow`

| 项 | 内容 |
|---|---|
| 入口函数 | `OutboxRelayService.relay_pending_events(RelayOutboxEventsJobRequest job, RequestMeta meta)` |
| outbox 来源 | `RetireMethodContentFlow` |
| event_type | `method_library.content.retired` |
| topic | `method-library.lifecycle.events` |
| 关键调用 | `BusPublisherPort.publish(Topic topic, DefinitionEventEnvelope event, RequestMeta meta)` |
| 测试切口 | retired event payload 包含 retire_policy;重复 relay 不重复发布 |

#### 7.6.4 `FingerprintChangedEventRelayFlow`

| 项 | 内容 |
|---|---|
| 入口函数 | `OutboxRelayService.relay_pending_events(RelayOutboxEventsJobRequest job, RequestMeta meta)` |
| outbox 来源 | `RecalculateFingerprintFlow` 或 `SupersedeMethodContentFlow` |
| event_type | `method_library.content.fingerprint_changed` |
| topic | `method-library.definition.events` |
| 关键调用 | `DefinitionEventEnvelope::from_outbox_event(OutboxEvent event)` |
| 测试切口 | old/new fingerprint 正确;下游可通过 snapshot_ref resync |

### 7.7 P0 Inbound / External Dependency 处理流

关键说明：

- governance 是外部证据来源,不是本仓身份校验或审批策略实现。
- object storage 保存 snapshot payload,不成为 MethodContent truth。
- L0-bus 只接收 outbox relay 发布的事件,Command 不直接调用 bus。

#### 7.7.1 `ValidateGovernanceGateFlow`

| 项 | 内容 |
|---|---|
| 入口函数 | `PublishGovernanceService.validate_publish_gate(MethodContent content, ApprovedGateRef gate_ref, ActorContext actor, RequestMeta meta)` |
| 关键调用 | `GovernancePort.validate_approved_gate(ApprovedGateRef gate_ref, ContentId content_id, ActorContext actor, RequestMeta meta)` -> `GateValidationResult.ensure_valid()` |
| 事务 | 无写事务 |
| 使用方 | `PublishMethodContentFlow` / `SupersedeMethodContentFlow` |
| 测试切口 | gate valid;gate target mismatch;governance unavailable |

#### 7.7.2 `HandleGovernanceGateApprovedFlow`

| 项 | 内容 |
|---|---|
| 入口函数 | `GovernanceInboundService.handle_governance_gate_approved(GovernanceGateApprovedEvent event, RequestMeta meta)` |
| 关键调用 | `RequestMeta::from_event_envelope(InboundEventEnvelope envelope)` -> `IdempotencyRepository.try_begin(UnitOfWorkTx tx, IdempotencyKey key, IdempotencyScope scope, RequestHash request_hash)` -> `GateProjectionRepository.upsert(UnitOfWorkTx tx, GovernanceGateProjection projection)` |
| 事务 | event idempotency + gate projection |
| 使用方 | 可选入站 projection,不作为 P0 publish 必选依赖 |
| 测试切口 | 重复 event;payload hash conflict;projection upsert |

#### 7.7.3 `SnapshotPayloadFlow`

| 项 | 内容 |
|---|---|
| 入口函数 | `DefinitionSnapshotService.build_snapshot(MethodContent content, SnapshotSchemaVersion schema_version, ActorContext actor, RequestMeta meta)` |
| 关键调用 | `DefinitionSnapshot::from_content(MethodContent content, CanonicalFingerprint fingerprint, SnapshotSchemaVersion schema_version, Timestamp now)` -> `ObjectStoragePort.put_snapshot_payload(SnapshotPayload payload, ObjectKey object_key, RequestMeta meta)` |
| 事务 | snapshot metadata 在 command tx 内,object storage payload 通过 port 写入 |
| 使用方 | `PublishMethodContentFlow` / `SupersedeMethodContentFlow` / snapshot export |
| 测试切口 | payload 保存成功;object storage failure 导致 command rollback |

#### 7.7.4 `BusPublishResultFlow`

| 项 | 内容 |
|---|---|
| 入口函数 | `OutboxRelayService.handle_bus_publish_result(BusPublishResult result, RequestMeta meta)` |
| 关键调用 | `OutboxRepository.mark_published(OutboxEventId event_id, Timestamp now)` 或 `OutboxRepository.mark_retryable_failure(OutboxEventId event_id, FailureReason reason, Timestamp now)` |
| 事务 | outbox status update |
| 使用方 | `OutboxRelayService.relay_pending_events(...)` 内部处理 adapter result |
| 测试切口 | ack 成功;失败重试;unknown event_id |

#### 7.7.5 `DownstreamReplayRequestFlow`

| 项 | 内容 |
|---|---|
| 入口函数 | `MethodLibraryJobService.replay_definition_events(ReplayDefinitionEventsJobRequest request, ActorContext actor, RequestMeta meta)` |
| 关键调用 | 同 `ReplayDefinitionEventsFlow` |
| 事务 | job_run + checkpoint |
| 使用方 | 下游 cold start / drift recovery / operator replay |
| 测试切口 | replay range 正确;consumer filter;cursor invalid |

### 7.8 P0 Operations Job 独立处理流

#### 7.8.1 `SeedInitialMethodAssetsFlow`

```text
[Job Trigger]
  | call seed_initial_method_assets(SeedInitialMethodAssetsJobRequest request, ActorContext actor, RequestMeta meta)
  v
[MethodLibraryJobService]
  | call JobRunRepository.start(JobRun job_run)
  | for each seed asset
  |   call MethodContentCommandService.create_draft(CreateMethodContentDraftCommand command, ActorContext actor, RequestMeta meta)
  |   if publish
  |     call MethodContentCommandService.publish(PublishMethodContentCommand command, ActorContext actor, RequestMeta meta)
  | call JobRunRepository.complete(JobRunId job_run_id, JobResult result)
```

约束：seed 必须复用 command service,不得直接 insert write model。`dry_run=true` 只生成 preview 和 conflict report,不写 content/outbox。

测试切口：seed 完整成功；重复 seed 由幂等和唯一约束处理；dry_run 不写任何 truth；部分失败记录 failure_reason。

#### 7.8.2 `ReplayDefinitionEventsFlow`

```text
[Job Trigger / downstream replay request]
  | call replay_definition_events(ReplayDefinitionEventsJobRequest request, ActorContext actor, RequestMeta meta)
  v
[MethodLibraryJobService]
  | call ReplayCursor::from_request(ReplayDefinitionEventsJobRequest request)
  | call OutboxRepository.load_delivered_or_pending_for_replay(ReplayCursor cursor, BatchSize limit)
  | call BusPublisherPort.publish(Topic topic, DefinitionEventEnvelope event, RequestMeta meta)
  | call ProjectionCheckpointRepository.advance(CheckpointName name, OutboxEventId last_processed_event_id, Timestamp now)
```

约束：replay 复用原始 `event_id`,不得构造新业务事件,不得改变 MethodContent truth。

测试切口：从 cursor 重放成功；consumer filter 生效；bus failure 保留 cursor；resume 从 checkpoint 继续。

#### 7.8.3 `RecalculateFingerprintFlow`

```text
[Job Trigger]
  | call recalculate_fingerprint(RecalculateFingerprintJobRequest request, ActorContext actor, RequestMeta meta)
  v
[MethodLibraryJobService]
  | call MethodContentRepository.find_published_by_kind(MethodContentKind kind)
  | call CanonicalPayloadBuilder.build(MethodContent content, SnapshotSchemaVersion schema_version)
  | call FingerprintHasher.hash_canonical_bytes(CanonicalBytes bytes, FingerprintAlgorithm algorithm)
  | compare CanonicalFingerprint current vs recomputed
  | if mismatch and not dry_run
  |   append OutboxRepository.append(UnitOfWorkTx tx, OutboxEvent fingerprint_changed_event)
  | call JobRunRepository.complete(JobRunId job_run_id, JobResult result)
```

约束：第一版默认 `dry_run=true`。即使发现 mismatch,也不自动修改 published truth；如需修复,必须单独走治理后的 command。

测试切口：无 mismatch 返回空报告；有 mismatch 返回 report；dry_run 不写 outbox；hash 失败进入 job failure。

#### 7.8.4 `RebuildReadModelsFlow`

```text
[Job Trigger]
  | call rebuild_read_models(RebuildReadModelsJobRequest request, ActorContext actor, RequestMeta meta)
  v
[MethodLibraryJobService]
  | call ProjectionCheckpointRepository.load(CheckpointName name)
  | scan MethodContentRepository.scan_for_projection(ReplayCursor cursor, BatchSize limit)
  | build ContentSummaryView / DefinitionTraceView
  | call ContentSummaryProjectionRepository.upsert(ContentSummaryView view)
  | call DefinitionTraceProjectionRepository.upsert(DefinitionTraceView view)
  | call ProjectionCheckpointRepository.advance(CheckpointName name, OutboxEventId last_processed_event_id, Timestamp now)
```

约束：projection 可重建,不得反向覆盖 write model。`dry_run=true` 只统计将重建的对象数量和差异摘要。

测试切口：全量重建成功；中断后 resume；projection upsert 失败不推进 checkpoint；rebuild 不改变 MethodContent revision。

---

## 8. 回填草稿

可直接回填到 `03-详细设计.md` 的起草结构：

````md
## 8. 逐接口函数级处理流

### 8.1 处理流统一规则

```text
Inbound adapter
  | parse DTO + GatewayHeaders
  | call application service
  v
Application service
  | enforce idempotency / read policy
  | tx begin when write path
  | call domain object / domain service
  | call repository / outbox / snapshot / projection port
  | tx commit or rollback
  v
Response DTO / Event Ack / Job Result
```

### 8.2 处理流总表

| 处理流 | 对应协议 | 入口函数 | 主要事务 | 状态变化 | 测试切口 |
|---|---|---|---|---|---|

### 8.3 P0 Command 处理流

每个 Command 独立小节展开:
- 入口与目标
- 函数级调用图
- 关键伪代码
- 事务边界
- 错误映射
- 状态与事件副作用
- 测试切口

### 8.4 P0 Query 处理流

每个 Query 独立小节展开:
- 入口与目标
- 函数级调用图
- 读取来源
- 错误映射
- 一致性字段
- 测试切口

### 8.5 P0 Outbound Event / outbox relay 处理流

每个基础 event 独立小节展开:
- event_type / topic
- outbox 创建来源
- relay 调用链
- retry / dead-letter 规则
- event_id 幂等
- 测试切口

### 8.6 P0 Inbound / External Dependency 处理流

按 dependency / inbound reference 展开:
- governance gate validation
- optional governance gate event projection
- object storage snapshot payload
- L0-bus publish result
- downstream replay request

### 8.7 P0 Operations Job 处理流

每个 Job 独立小节展开:
- 触发方式
- 函数级调用图
- 是否复用 command service
- checkpoint / dry_run / resume
- 错误恢复
- 测试切口
````

---

## 9. 待确认事项

- `GovernanceInboundService.handle_governance_gate_approved(...)` 是否第一版实现。当前建议保留为可选入站 projection,但 P0 publish 不依赖它。
- `RecalculateFingerprintFlow` 在 `dry_run=false` 时是否允许写 `fingerprint_changed` outbox。当前建议只写 mismatch report,事件写入需要单独治理确认。
- `OutboxRelayService.handle_bus_publish_result(...)` 是否作为显式函数暴露,还是只在 relay loop 内部处理 adapter result。当前建议正式文档写成内部处理流,不作为外部 API。
- Query 是否记录 query audit。当前建议第一版不记录,避免 Query 产生写副作用。

---

## 10. 进入下一步条件

- P0 Command / Query / Event / Inbound / Job 均已有独立处理流入口。
- 每个处理流都能回指 Step 6 对象契约、Step 7 port 契约和 Step 8 协议契约。
- Command / Job 的事务、幂等、audit/outbox/checkpoint 已明确。
- Query 的只读来源、一致性字段和禁止写入规则已明确。
- Outbound Event 的 outbox relay 边界已明确。
- 可以进入 Step 10 定义状态机与转换矩阵。
