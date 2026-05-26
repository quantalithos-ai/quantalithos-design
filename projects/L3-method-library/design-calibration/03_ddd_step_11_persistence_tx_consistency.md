# Step 11. 定义持久化、事务与一致性契约

## 1. Step 状态

- 状态：[x] 已确认
- 对应 SOP：`standards/document/详细设计讨论流程_SOP.md` Step 11
- 回填章节：`03-详细设计.md` §10 数据持久化、事务与一致性契约

---

## 2. 本步输入

| 输入 | 内容 |
|---|---|
| Step 7 Port 契约 | 已确认 `UnitOfWork`、repository、outbound port、support port 的 trait 边界 |
| Step 9 处理流 | 已确认每个 Command / Query / Event / Job 的事务位置和关键调用链 |
| Step 10 状态机 | 已确认 `MethodContentLifecycle`、`OutboxStatus`、`IdempotencyStatus`、`JobRunStatus` |
| 旧 `03-详细设计.md` §16 / §17 / §27 | 已有数据与存储、事务一致性、repository 函数草稿 |

已确认结论：

```text
本步不生成 SQL migration。
本步把存储对象、repository、事务边界和一致性规则收稳为实现契约。
MethodContent write model、version、supersede、audit、outbox、snapshot metadata 是本仓必须维护的 P0 数据。
projection / checkpoint / dead-letter 是可恢复的运行支撑数据,不能反写 Definition truth。
跨仓对象只保存引用,不得保存外部模块正文真相。
```

依赖的前序 Step：

```text
Step 1~10 已确认范围、实现约束、文件布局、对象、port、协议、逐接口处理流和状态机。
```

---

## 3. SOP 问题回答

1. 哪些数据对象由本仓拥有？

   回答：本仓 P0 拥有 `MethodContent`、`ContentRef / PublishedContentRef`、`ContentVersion`、`SupersedeLink`、`LifecycleHistoryEntry`、`AuditRecord`、`OutboxEvent`、`IdempotencyRecord`、`DefinitionSnapshot` metadata、`ContentSummaryView`、`DefinitionTraceView`、`ProjectionCheckpoint`、`InboundDeadLetter`、`JobRunRecord`。其中 write model / append-only / reliable record 是强一致数据；projection / checkpoint / dead-letter 是可恢复运行数据。

2. 哪些只是引用、快照或投影？

   回答：`ApprovedGateRef`、`ActorContext` 中的 actor ref、artifact evidence refs、object storage blob ref、downstream consumer ref 都只是跨仓引用。`DefinitionSnapshot` 是发布后的同步制品,metadata 归本仓,payload 正文在 object storage。`ContentSummaryView` 和 `DefinitionTraceView` 是投影,可重建,不能作为 Definition truth。

3. repository 函数如何命名，参数和返回是什么？

   回答：repository 函数沿用 Step 7 口径。写路径函数必须显式接收 `UnitOfWorkTx tx`；查询 / scan 必须接收 `PageRequest` 或 `BatchSize`；所有 fallible 函数返回 `Result<T, MethodLibraryError>`；repository 不实现状态机、不生成业务事件、不调用外部系统。

4. 哪些处理流需要事务，事务内必须完成哪些写入？

   回答：所有 Command、入站事件 projection、会写 checkpoint / projection / job_run 的 Operations Job 需要事务。create/update/submit/publish/deprecate/retire/supersede 必须把 write model、lifecycle history、audit、idempotency result 以及必要的 version/snapshot/outbox 同事务提交。Query 不开启写事务。

5. 是否需要乐观锁、行锁、版本号、outbox 或 projection？

   回答：需要。`method_contents.revision` 用于乐观锁；publish / retire / supersede 等关键状态迁移应 `get_for_update`；`method_content_versions` 用唯一约束保护 `(content_family_id, version)`；所有跨仓事件通过 outbox；projection 最终一致并可由 write model / outbox 重建。

6. 如果事件发布或 projection 更新失败，如何恢复？

   回答：L0-bus 发布失败只更新 `outbox_events.status` 为 retryable failure 或 dead-letter,不回滚已提交的 MethodContent truth。projection 更新失败不反写 truth,只保留 checkpoint 不推进或记录失败,后续通过 `RebuildReadModels` 恢复。snapshot payload 写入失败阻断 publish；若 payload 写入成功但 DB commit 失败,允许产生 orphan blob,由清理任务处理或忽略。

---

## 4. 当前文档问题诊断

| 位置 | 当前问题 | 影响 |
|---|---|---|
| 旧 `03-详细设计.md` §16 | 表结构草稿很全,但包含偏 SQL / schema 细节 | 当前尚未开发,正式 §10 应先固定实现契约,不写迁移脚本 |
| 旧 §16 / §17 | 数据分层、事务、一致性拆成两章 | 新版详细设计 §10 应集中回答持久化 + 事务 + 一致性 |
| 旧 §27 | repository 函数清单较全,但和存储对象 / 事务边界分离 | 实现者需要把 repository 映射到具体数据所有权和处理流 |
| Step 9 | 每个处理流有事务摘要,但没有同事务写入对象清单 | 需要汇总成事务边界表 |
| Step 10 | 状态机已确认,但未定义状态字段如何持久化和一致性校验 | 需要把状态字段、revision、outbox status、job status 纳入数据契约 |

---

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 数据章节定位 | 像数据库设计 + 事务说明 | 作为持久化、事务、一致性实现契约 | 开发前不强制 migration,但必须能指导代码 |
| 数据所有权 | 分散在表结构和红线中 | 先用数据所有权表明确 truth / ref / projection | 防止跨仓真相污染 |
| 存储对象 | 表字段较细 | 保留存储对象、主键、唯一键、索引、版本字段 | 足以指导 repository 和 schema,不过度绑定 SQL |
| repository | 旧 §27 是全局清单 | 本步按数据层和事务要求汇总关键函数 | 让应用服务知道哪些函数必须带 tx |
| 一致性 | 分散在 §16.12~§17 | 集中形成事务边界表和一致性策略表 | 支撑 Step 12/13 继续展开错误与并发 |
| projection | 点名可重建 | 明确不反写 truth、失败不推进 checkpoint | 防止 query / job 顺手修数据 |

---

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 本步直接写完整 SQL DDL | 实现时可直接复制 | 当前尚未进入开发,DDL 容易过早固化实现细节 | 不采用 |
| 只写 repository trait,不写存储对象 | 更贴近代码接口 | 无法判断数据所有权、索引和一致性要求 | 不采用 |
| 写实现契约级存储表 + repository + 事务边界 | 可指导代码和初始 schema,不过早写 migration | 后续开发仍需转成具体 DDL | 采用 |
| Command 事务内直接发布 bus | 实时性好 | 外部失败会污染本地事务 | 不采用 |
| Command 同事务写 outbox,relay 异步发布 | 本地强一致,跨仓最终一致,可重试 | 下游有延迟 | 采用 |

---

## 7. 结构化中间产物

### 7.1 数据分层与所有权图

```text
[Command / Inbound Event / Operations Job]
        |
        v
[UnitOfWork transaction]
        |
        +-- write model
        |     method_contents
        |     method_content_references
        |     method_content_versions
        |     supersede_links
        |
        +-- append-only / audit
        |     lifecycle_history_entries
        |     audit_records
        |
        +-- reliable records
        |     outbox_events
        |     idempotency_records
        |
        +-- sync metadata
              definition_snapshots

[Async / recoverable side]
        |
        +-- projection
        |     content_summary_projection
        |     definition_trace_projection
        |
        +-- operations
              projection_checkpoints
              inbound_dead_letters
              job_runs

[External refs only]
        |
        +-- governance gate ref
        +-- object storage blob ref
        +-- artifact / actor / downstream refs
```

关键说明：

- `method_contents` 是 Definition truth 的主表,projection 不是 truth。
- `outbox_events` 与业务写入同事务,但 bus 发布在事务外。
- `definition_snapshots` 保存 metadata；snapshot payload 正文在 object storage。
- 跨仓对象只能保存 ref,不得保存外部模块正文。

### 7.2 数据所有权实现表

| 数据对象 | 拥有模块 | 写入方 | 读取方 | 一致性要求 |
|---|---|---|---|---|
| `MethodContent` | method-library | command service / seed job | command / query / job | write model 强一致;revision 乐观锁 |
| `ContentRef` / `PublishedContentRef` | method-library | create/update/publish | reference validation / trace / query | 与 source content 写事务一致 |
| `ContentVersion` | method-library | publish / supersede / seed | version query / snapshot / trace | `(content_family_id, version)` 唯一 |
| `SupersedeLink` | method-library | supersede | trace / impact analysis | old content 唯一;与 old/new 状态同事务 |
| `LifecycleHistoryEntry` | method-library | lifecycle-changing command | trace / audit | append-only;与 lifecycle 变化同事务 |
| `AuditRecord` | method-library | command / job / inbound handler | trace / audit query | append-only;P0 写路径强审计 |
| `OutboxEvent` | method-library | publish/deprecate/retire/supersede/replay source | outbox relay / replay / trace | 与业务变更同事务写入;发布最终一致 |
| `IdempotencyRecord` | method-library | command / job / inbound handler | retry / recovery | `(scope, key)` 唯一;同 key 不同 hash 冲突 |
| `DefinitionSnapshot` metadata | method-library | publish / supersede / seed | snapshot query / event / downstream resync | 与 published 状态同事务提交 |
| `SnapshotPayload` | object storage | snapshot service | snapshot export / downstream resync | 外部存储;本仓保存 `SnapshotBlobRef` |
| `ContentSummaryView` | method-library projection | projection builder / rebuild job | list / get query | 最终一致;可重建;不反写真相 |
| `DefinitionTraceView` | method-library projection | projection builder / rebuild job | trace query | 最终一致;可重建;不替代 audit/outbox 原始记录 |
| `ProjectionCheckpoint` | method-library operations | rebuild / replay job | operations / recovery | 成功处理后推进;失败不跳跃 |
| `InboundDeadLetter` | method-library operations | inbound event failure path | operations / replay | 保存失败快照;不改 truth |
| `JobRunRecord` | method-library operations | operations job service | operations / retry | 记录 job 结果;不替代 checkpoint |
| `ApprovedGateRef` | governance | command payload / governance port | publish / audit | 本仓只保存 ref,不保存治理裁决正文 |
| `ActorContext` / actor ref | gateway / identity | gateway headers | audit / command / query | 本仓消费可信上下文,不校验身份 |

### 7.3 表 / collection / projection 契约表

| 存储对象 | 用途 | 主键 / 唯一键 | 关键索引 | 版本字段 |
|---|---|---|---|---|
| `method_contents` | 保存 MethodContent write model | PK `content_id` | `(kind,lifecycle_state,updated_at)`、`content_family_id`、`fingerprint` | `revision` |
| `method_content_references` | 保存普通引用和 published 引用 | PK `reference_id`;unique `(source_content_id,target_content_id,target_version)` | `source_content_id`、`target_content_id` | 无 |
| `method_content_versions` | 保存 published version history | PK `content_version_id`;unique `(content_family_id,version)`、`(content_id,version)` | `content_id`、`content_family_id` | `version` |
| `supersede_links` | 保存替代链 | PK `supersede_link_id`;unique `old_content_id` | `new_content_id`、`content_family_id` | 无 |
| `lifecycle_history_entries` | 追加生命周期历史 | PK `history_entry_id` | `(content_id,created_at)`、`request_id` | 无 |
| `audit_records` | 追加审计记录 | PK `audit_id` | `trace_id`、`action`、`created_at` | 无 |
| `outbox_events` | 保存待发布 / 已发布事件 | PK `outbox_event_id`;unique `idempotency_key` | `(status,next_retry_at)`、`aggregate_id`、`event_type` | `schema_version` |
| `idempotency_records` | 保存幂等执行记录 | PK `(scope,idempotency_key)` | `(scope,status,updated_at)` | `request_hash` |
| `definition_snapshots` | 保存 snapshot metadata | PK `snapshot_id`;unique `(content_id,version,fingerprint)` | `content_id`、`version` | `schema_version` |
| `content_summary_projection` | 列表 / 摘要读模型 | PK `content_id` | `(kind,lifecycle_state,updated_at)` | `projection_version` 或 checkpoint ref |
| `definition_trace_projection` | trace 读模型 | PK `content_id` | `updated_at` | `projection_version` |
| `projection_checkpoints` | projection / replay 进度 | PK `checkpoint_name` | `(status,updated_at)` | `last_processed_event_id` |
| `inbound_dead_letters` | 入站失败事件快照 | PK `dead_letter_id` | `(source_module,event_type,replay_status)` | 无 |
| `job_runs` | operations job 执行记录 | PK `job_run_id`;unique `(job_name,scope_hash,idempotency_key)` | `(job_name,status,started_at)` | 无 |

说明：

- 表名是实现契约建议,不是 migration 文件。
- 字段细节可在开发时转成 DDL,但主键、唯一键、索引意图和版本字段不能丢。
- P1 `method_plugins` / `method_configurations` 只保留后置表方向,不进入 P0 必实现闭环。

### 7.4 Repository 函数契约表

| 函数签名 | 作用 | 锁 / 事务要求 | 返回 | 错误 |
|---|---|---|---|---|
| `UnitOfWork.begin(RequestMeta meta)` | 开启本地事务 | 写路径必用 | `Result<UnitOfWorkTx, MethodLibraryError>` | `PERSISTENCE_UNAVAILABLE` |
| `UnitOfWorkTx.commit()` | 提交事务 | 所有本地写入完成后调用 | `Result<(), MethodLibraryError>` | `TRANSACTION_COMMIT_FAILED` |
| `MethodContentRepository.get_for_update(UnitOfWorkTx tx, ContentId content_id)` | 写路径带锁读取 aggregate | publish / retire / supersede 必用 | `Result<Option<MethodContent>, MethodLibraryError>` | `METHOD_CONTENT_NOT_FOUND` / persistence error |
| `MethodContentRepository.insert(UnitOfWorkTx tx, MethodContent content)` | 插入新 content | command tx 内 | `Result<(), MethodLibraryError>` | `CONTENT_VERSION_CONFLICT` / persistence error |
| `MethodContentRepository.save(UnitOfWorkTx tx, MethodContent content, Revision expected_revision)` | 乐观锁保存 aggregate | command tx 内;校验 revision | `Result<Revision, MethodLibraryError>` | `REVISION_CONFLICT` |
| `MethodContentReferenceRepository.replace_refs(UnitOfWorkTx tx, ContentId source_content_id, Vec<ContentRef> refs)` | 原子替换草稿引用 | create/update tx 内 | `Result<(), MethodLibraryError>` | `REFERENCE_INVALID` |
| `MethodContentReferenceRepository.replace_published_refs(UnitOfWorkTx tx, ContentId source_content_id, Vec<PublishedContentRef> refs)` | 固化 published 引用 | publish tx 内 | `Result<(), MethodLibraryError>` | `REFERENCE_NOT_PUBLISHED` |
| `MethodContentVersionRepository.insert(UnitOfWorkTx tx, MethodContentVersionRecord record)` | 写入版本记录 | publish / supersede tx 内 | `Result<(), MethodLibraryError>` | `CONTENT_VERSION_CONFLICT` |
| `SupersedeLinkRepository.insert(UnitOfWorkTx tx, SupersedeLink link)` | 写入替代链 | supersede tx 内 | `Result<(), MethodLibraryError>` | `SUPERSEDE_CONFLICT` |
| `LifecycleHistoryRepository.append(UnitOfWorkTx tx, LifecycleHistoryEntry entry)` | 追加生命周期历史 | lifecycle 变化 tx 内 | `Result<(), MethodLibraryError>` | persistence error |
| `AuditRepository.append(UnitOfWorkTx tx, AuditRecord record)` | 追加审计记录 | P0 写路径 tx 内 | `Result<(), MethodLibraryError>` | `AUDIT_APPEND_FAILED` |
| `OutboxRepository.append(UnitOfWorkTx tx, OutboxEvent event)` | 写入待发布事件 | publish/deprecate/retire/supersede tx 内 | `Result<(), MethodLibraryError>` | `OUTBOX_APPEND_FAILED` |
| `OutboxRepository.load_pending(BatchSize limit, Timestamp now)` | 扫描待发布事件 | relay 只读/claim 流程;必须限批 | `Result<Vec<OutboxEvent>, MethodLibraryError>` | persistence error |
| `OutboxRepository.mark_publishing(OutboxEventId event_id, Timestamp now)` | 标记发布中 | relay 状态事务 | `Result<(), MethodLibraryError>` | `OUTBOX_STATUS_CONFLICT` |
| `OutboxRepository.mark_published(OutboxEventId event_id, Timestamp now)` | 标记发布成功 | bus ack 后 | `Result<(), MethodLibraryError>` | `OUTBOX_STATUS_CONFLICT` |
| `OutboxRepository.mark_retryable_failure(OutboxEventId event_id, FailureReason reason, Timestamp next_retry_at)` | 标记可重试失败 | bus failure 后 | `Result<(), MethodLibraryError>` | `OUTBOX_STATUS_CONFLICT` |
| `IdempotencyRepository.try_begin(UnitOfWorkTx tx, IdempotencyKey key, IdempotencyScope scope, RequestHash request_hash)` | 创建或复用幂等记录 | command/job/inbound tx 内 | `Result<IdempotencyBeginResult, MethodLibraryError>` | `IDEMPOTENCY_CONFLICT` |
| `IdempotencyRepository.mark_completed(UnitOfWorkTx tx, IdempotencyKey key, ResultRef response_ref)` | 标记成功并保存结果引用 | command/job/inbound tx 内 | `Result<(), MethodLibraryError>` | `IDEMPOTENCY_STATUS_CONFLICT` |
| `DefinitionSnapshotRepository.insert(UnitOfWorkTx tx, DefinitionSnapshot snapshot)` | 保存 snapshot metadata | publish tx 内 | `Result<(), MethodLibraryError>` | `SNAPSHOT_BUILD_FAILED` |
| `DefinitionSnapshotRepository.get(SnapshotId snapshot_id)` | 读取 snapshot metadata | query 只读 | `Result<Option<DefinitionSnapshot>, MethodLibraryError>` | `SNAPSHOT_NOT_FOUND` |
| `ContentSummaryProjectionRepository.upsert(ContentSummaryView view)` | 更新摘要投影 | rebuild/projection tx 或批处理内 | `Result<(), MethodLibraryError>` | `PROJECTION_UPDATE_FAILED` |
| `DefinitionTraceProjectionRepository.upsert(DefinitionTraceView view)` | 更新 trace 投影 | rebuild/projection tx 或批处理内 | `Result<(), MethodLibraryError>` | `PROJECTION_UPDATE_FAILED` |
| `ProjectionCheckpointRepository.advance(CheckpointName name, OutboxEventId last_processed_event_id, Timestamp now)` | 推进 checkpoint | 仅成功处理后 | `Result<(), MethodLibraryError>` | `CHECKPOINT_CONFLICT` |
| `JobRunRepository.start(UnitOfWorkTx tx, JobRun job_run)` | 创建 job run | job tx 内 | `Result<(), MethodLibraryError>` | `JOB_REQUEST_INVALID` |
| `JobRunRepository.complete(UnitOfWorkTx tx, JobRunId job_run_id, JobResult result)` | 完成 job run | job tx 内 | `Result<(), MethodLibraryError>` | `JOB_STATUS_CONFLICT` |

### 7.5 事务边界表

| 场景 | 开始位置 | 提交位置 | 回滚条件 | 同事务内必须完成 |
|---|---|---|---|---|
| `CreateMethodContentDraftFlow` | `MethodContentCommandService.create_draft(...)` | 插入 content、refs、audit、idempotency result 后 | payload/kind 不匹配、boundary violation、insert/audit/idempotency 失败 | `method_contents`、`method_content_references`、`audit_records`、`idempotency_records` |
| `UpdateMethodContentDraftFlow` | `MethodContentCommandService.update_draft(...)` | 保存 content、refs、audit、idempotency result 后 | not found、非 draft、revision conflict、refs 替换失败 | `method_contents`、`method_content_references`、`audit_records`、`idempotency_records` |
| `SubmitMethodContentForReviewFlow` | `MethodContentCommandService.submit_for_review(...)` | 保存 lifecycle、history、audit、idempotency result 后 | 非 draft、revision conflict、history/audit 失败 | `method_contents`、`lifecycle_history_entries`、`audit_records`、`idempotency_records` |
| `PublishMethodContentFlow` | `MethodContentCommandService.publish(...)` | published 状态、version、snapshot metadata、audit、outbox、idempotency result 后 | gate invalid、reference invalid、fingerprint/snapshot/outbox/audit 失败 | `method_contents`、`method_content_versions`、`method_content_references`、`definition_snapshots`、`lifecycle_history_entries`、`audit_records`、`outbox_events`、`idempotency_records` |
| `DeprecateMethodContentFlow` | `MethodContentCommandService.deprecate(...)` | deprecated 状态、history、audit、outbox、idempotency result 后 | 非 published、revision conflict、outbox/audit 失败 | `method_contents`、`lifecycle_history_entries`、`audit_records`、`outbox_events`、`idempotency_records` |
| `RetireMethodContentFlow` | `MethodContentCommandService.retire(...)` | retired 状态、history、audit、outbox、idempotency result 后 | 非 published/deprecated、revision conflict、outbox/audit 失败 | `method_contents`、`lifecycle_history_entries`、`audit_records`、`outbox_events`、`idempotency_records` |
| `SupersedeMethodContentFlow` | `MethodContentCommandService.supersede(...)` | old/new 状态、link、version、snapshot、audit、outbox、idempotency result 后 | old/new not found、revision conflict、kind mismatch、gate invalid、outbox/audit 失败 | old/new `method_contents`、`supersede_links`、`method_content_versions`、`definition_snapshots`、`lifecycle_history_entries`、`audit_records`、`outbox_events`、`idempotency_records` |
| `HandleGovernanceGateApprovedFlow` | inbound event service | idempotency record 和 gate projection upsert 后 | payload hash conflict、projection upsert 失败 | `idempotency_records`、gate projection / optional inbound record |
| `OutboxRelayService.relay_pending_events(...)` | relay 每个 event 状态推进 | mark_published 或 mark_retryable_failure 后 | bus publish failed 只回滚当前 status update 或标记 retryable | `outbox_events.status` 单事件状态更新 |
| `SeedInitialMethodAssetsFlow` | job service / command service | 每个 command 自己提交;job_run 结束提交 | command 失败、dry_run 禁止写入、job_run 更新失败 | command 事务 + `job_runs` |
| `ReplayDefinitionEventsFlow` | job service | 当前 batch bus publish 成功并 checkpoint advance 后 | bus failure、checkpoint 失败 | `job_runs`、`projection_checkpoints` 或 replay cursor |
| `RebuildReadModelsFlow` | job service | projection upsert 和 checkpoint advance 后 | projection upsert 失败、checkpoint conflict | projection tables、`projection_checkpoints`、`job_runs` |

### 7.6 一致性策略表

| 主题 | 策略 | 恢复方式 |
|---|---|---|
| write model | 本地强一致;Command 通过 `UnitOfWork` 同事务写入 | 事务失败整体回滚 |
| lifecycle history / audit | 与业务状态变化同事务追加 | append 失败时 P0 command 整体失败 |
| snapshot metadata | publish / supersede 成功时必须同事务保存 metadata | metadata 写失败阻断 publish |
| snapshot payload | object storage 保存 payload,DB 保存 ref | payload 写失败阻断 publish;DB commit 失败后的 orphan blob 可清理或忽略 |
| outbox | 与业务变更同事务写 pending event | relay 重试 / dead-letter / replay |
| bus publish | 事务外最终一致 | `OutboxRelayService` 重试;不回滚 truth |
| projection | 最终一致、可重建 | `RebuildReadModels` 从 write model / outbox 重建 |
| downstream sync | 最终一致 | downstream replay / snapshot resync |
| query | 只读,不修复数据 | 返回 not found / stale / unavailable,由 command 或 operations job 修复 |
| idempotency | `(scope,idempotency_key)` 唯一,request_hash 校验 | 同 key 同 hash 返回既有结果;不同 hash 返回冲突 |
| optimistic lock | `method_contents.revision` 控制并发修改 | `REVISION_CONFLICT`,调用方重新读取后重试 |
| job checkpoint | 成功后推进,失败不跳跃 | resume 从 last successful cursor 继续 |

### 7.7 数据设计红线

| 红线 | 说明 |
|---|---|
| 不保存下游 Use truth | process instance、work item、identity member profile 不属于本仓 |
| 不用 projection 反写 truth | projection 只能从 write model / outbox 重建 |
| 不允许 write model 提交但 outbox 缺失 | publish/deprecate/retire/supersede 必须同事务写 outbox |
| 不把 bus publish 放入 command 事务 | 外部依赖失败不能污染本地强一致提交 |
| 不绕过 revision 保存 MethodContent | 修改已有 content 必须校验 expected_revision 或加锁 |
| 不用跨仓数据库外键 | governance / artifact / identity / object storage 只能保存 ref |
| 不在 repository 实现状态机 | 状态迁移由 domain object / application service 决定 |
| 不在 query 中写库修复 | Query 只读,恢复走 Operations Job 或 Command |

---

## 8. 回填草稿

可直接回填到 `03-详细设计.md` 的起草结构：

````md
## 10. 数据持久化、事务与一致性契约

### 10.1 数据分层与所有权图

```text
[Command / Inbound Event / Operations Job]
        |
        v
[UnitOfWork transaction]
        |
        +-- write model
        +-- append-only / audit
        +-- reliable records
        +-- sync metadata

[Async / recoverable side]
        |
        +-- projection
        +-- operations

[External refs only]
```

### 10.2 数据所有权实现表

| 数据对象 | 拥有模块 | 写入方 | 读取方 | 一致性要求 |
|---|---|---|---|---|

### 10.3 表 / collection / projection 契约表

| 存储对象 | 用途 | 主键 / 唯一键 | 关键索引 | 版本字段 |
|---|---|---|---|---|

说明:
- 本章不生成 migration。
- 表名、主键、唯一键、索引意图和版本字段是实现契约。

### 10.4 Repository 函数契约表

| 函数签名 | 作用 | 锁 / 事务要求 | 返回 | 错误 |
|---|---|---|---|---|

### 10.5 事务边界表

| 场景 | 开始位置 | 提交位置 | 回滚条件 | 同事务内必须完成 |
|---|---|---|---|---|

### 10.6 一致性策略表

| 主题 | 策略 | 恢复方式 |
|---|---|---|

### 10.7 数据设计红线

| 红线 | 说明 |
|---|---|
````

---

## 9. 待确认事项

- `job_runs` 是否第一批必须落库,还是只保留 operations record 契约。当前建议落库,否则 job resume / audit 不清楚。
- `HandleGovernanceGateApprovedFlow` 的 gate projection 是否第一版实现。当前建议作为可选入站 projection,不阻塞 P0 publish。
- projection 是否由 outbox event 驱动还是直接从 write model batch rebuild。当前建议两者都允许,但 checkpoint 必须可恢复。
- snapshot payload 写入 object storage 与 DB transaction 的精确顺序需要实现期根据 adapter 能力确认；本文先固定失败语义。

---

## 10. 进入下一步条件

- 数据所有权和跨仓引用边界已经确认。
- P0 存储对象、主键 / 唯一键、关键索引和版本字段已经确认。
- 关键 repository 函数、事务要求、返回和错误已经确认。
- 每个 P0 写路径的事务边界和同事务写入对象已经确认。
- outbox、snapshot、projection、downstream sync 的一致性和恢复规则已经确认。
- 可以进入 Step 12 定义错误模型、异常分支与恢复口径。
