# Step 13. 定义并发、幂等与重入保护

## 1. Step 状态

- 状态：[x] 已确认
- 对应 SOP：`standards/document/详细设计讨论流程_SOP.md` Step 13
- 回填章节：`03-详细设计.md` §12 并发、幂等与重入保护

---

## 2. 本步输入

| 输入 | 内容 |
|---|---|
| Step 8 协议契约 | 已确认 Command / Job 必须携带 `x-idempotency-key`;Outbound Event 使用 `event_id`;Inbound Event 使用外部 `event_id + payload_hash`;Query 默认不要求幂等 |
| Step 9 处理流 | 已确认 Command 写路径、outbox relay、governance inbound、seed / replay / recalculate / rebuild job 的函数级处理流 |
| Step 10 状态机 | 已确认 `MethodContentLifecycle`、`OutboxStatus`、`IdempotencyStatus`、`JobRunStatus` 的状态集合和转换矩阵 |
| Step 11 事务与一致性 | 已确认 `revision` 乐观锁、`content_family_id + version` 唯一约束、supersede link 唯一约束、outbox、checkpoint 和 projection 一致性边界 |
| Step 12 错误模型 | 已确认并发、幂等、outbox、checkpoint、job dry_run 等错误码与恢复口径 |
| 旧 `03-详细设计.md` | 已有事务、幂等、并发、一致性散落说明,需要收敛成新版 §12 |

已确认结论：

```text
并发保护不是单一机制,而是三层保护:
1. 请求层: idempotency key + request_hash 防重复执行
2. 资源层: revision / row lock / unique constraint 防并发覆盖
3. worker 层: outbox claim / checkpoint compare-and-swap / job scope 防重复发布和重复推进

Query 只读,不要求幂等键,也不能通过写库来修复并发或 stale projection。
dry_run job 不写 truth、outbox 或正式 checkpoint。
```

依赖的前序 Step：

```text
Step 1~12 已确认范围、协议、处理流、状态机、事务一致性和错误恢复口径。
```

---

## 3. SOP 问题回答

1. 哪些处理流可能并发修改同一资源？

   回答：`UpdateMethodContentDraft`、`SubmitMethodContentForReview`、`PublishMethodContent`、`DeprecateMethodContent`、`RetireMethodContent` 会并发修改同一个 `MethodContent`；`SupersedeMethodContent` 会同时修改 old/new 两个 `MethodContent`、`supersede_links` 和 `method_content_versions`；多个 publish / supersede 会争抢同一 `content_family_id + version`；多个 outbox relay worker 会争抢同一 `OutboxEvent`；多个 replay / rebuild job 会争抢同一 checkpoint。

2. 哪些接口、事件或 job 可能被重复调用？

   回答：所有 Command、Operations Job、Inbound Event 和 Outbox relay 都可能重复。Command 可能因客户端超时重试；Inbound Event 可能因上游重投；Outbox relay 可能因 worker 崩溃或 bus ack 不确定重试；Replay / Rebuild / Seed job 可能被人工或调度重复触发。Query 虽然可重复调用,但它只读,不需要幂等记录。

3. 幂等键来自请求、事件、job 参数还是数据库唯一约束？

   回答：Command / Job 的主幂等键来自 `x-idempotency-key` 和 canonical request hash；Inbound Event 的幂等键来自 `source + event_id + payload_hash`；Outbound Event 的幂等键来自 outbox `event_id`；资源唯一性由数据库唯一约束兜底,例如 `(content_family_id, version)`、`old_content_id` supersede link、`job_name + scope_hash + idempotency_key`。

4. 重复请求应该返回既有结果、跳过、覆盖还是报错？

   回答：同 key 同 hash 且已成功的 Command / Job 返回既有结果或结果引用；同 key 不同 hash 返回 `IDEMPOTENCY_CONFLICT`；同 key 同 hash 仍在处理中返回 `IDEMPOTENCY_STATUS_CONFLICT` 或等价的处理中响应；Inbound Event 同 event_id 同 payload_hash 直接 ack / skip；Outbound replay 复用原 `event_id`,不得覆盖或生成新事件；任何重复请求都不得覆盖已经提交的 truth。

5. 并发冲突如何测试？

   回答：至少覆盖同 revision 双更新、同 family/version 双发布、同 old_content 双 supersede、同 outbox event 多 worker claim、同 checkpoint 多 job 推进、同 idempotency key 不同 body、重复 inbound event、dry_run job 尝试写 truth/checkpoint 等测试切口。

---

## 4. 当前文档问题诊断

| 位置 | 当前问题 | 影响 |
|---|---|---|
| 旧 `03-详细设计.md` 事务 / 一致性章节 | 已提到 revision、idempotency、outbox、checkpoint,但分散在多个章节 | 实现者需要跨章节拼接并发和幂等规则 |
| 旧 Command 处理流 | 每个 Command 都有 `expected_revision`,但缺少集中并发场景矩阵 | 难以统一测试并发覆盖与冲突错误 |
| 旧 Operations Job 章节 | 写了 checkpoint / dry_run / resume,但缺少重入保护总表 | 容易出现 job 重跑时重复推进 checkpoint 或写入 truth |
| 旧 outbox relay 章节 | 有 retry / replay,但没有明确多 worker claim 语义 | 容易多个 worker 同时发布同一 event |
| 旧幂等说明 | 有同 key 同 hash / 不同 hash 规则,但没有按接口列出幂等键来源和重复行为 | API、worker、event consumer 实现可能各自解释 |

---

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 并发规则 | 分散在 Command、事务、测试章节 | 集中为并发场景表 | 每个冲突资源、控制方式和错误都可测试 |
| 幂等规则 | 只给通用描述 | 按 Command / Job / Event 分别定义幂等键、窗口和重复处理 | 实现 handler、repository、worker 时不需要猜 |
| 重入保护 | 隐含在 retry / resume 文本中 | 单独定义重入来源、保护方式和恢复方式 | 支撑 worker crash、客户端超时、调度重复触发 |
| outbox 多 worker | 只写状态推进 | 明确 claim / lease / status compare-and-swap | 防止重复发布和卡死 publishing |
| dry_run | 分散写“不写 checkpoint” | 明确 dry_run 不写 truth / outbox / 正式 checkpoint | 防止演练污染正式数据 |
| Query | 重复调用未单独说明 | 明确 Query 只读,不需要幂等记录 | 保持读写边界 |

---

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 只依赖 `x-idempotency-key` 防重复 | API 实现简单 | 无法防 revision 覆盖、version 冲突、outbox 多 worker 争抢 | 不采用 |
| 只依赖数据库唯一约束 | 底层可靠 | 不能返回既有结果,也不能区分同 key 不同 payload | 不采用 |
| 请求幂等 + 资源并发控制 + worker 重入保护三层组合 | 覆盖 Command、Event、Job 和 worker 场景 | 实现上需要更多 repository 契约和测试 | 采用 |
| 重复请求直接覆盖最新状态 | 调用方体验看似简单 | 会破坏 MethodContent truth 和审计链 | 不采用 |
| 同 key 同 hash 返回既有结果,同 key 不同 hash 报错 | 语义稳定,便于审计和排障 | 需要保存 result_ref / request_hash | 采用 |
| outbox relay 发布前不 claim,失败后靠下游去重 | 实现少 | 本仓会重复向 bus 发布,难以控制 retry 和状态 | 不采用 |
| outbox 使用状态 CAS + worker lease claim | 可并发 relay,可恢复 publishing 卡死 | 需要 lease 字段或等价实现 | 采用 |

---

## 7. 结构化中间产物

### 7.1 三层保护关系图

```text
Client / Worker / Event Source
        |
        v
[Request Idempotency]
  - x-idempotency-key + request_hash
  - source event_id + payload_hash
  - job scope_hash
        |
        v
[Resource Concurrency]
  - MethodContent.revision
  - row lock for publish / retire / supersede
  - unique(content_family_id, version)
  - unique(old_content_id) for supersede link
        |
        v
[Worker Reentry Protection]
  - outbox status claim + lease
  - checkpoint compare-and-swap
  - job_run status transition
  - dry_run write guard
        |
        v
Committed truth / outbox / projection / job result
```

关键说明：

- idempotency 防止同一请求重复执行,但不能代替 `revision`、唯一约束或状态机。
- `revision` 和唯一约束保护 Definition truth,不能由 outbox / checkpoint 代替。
- outbox、projection、checkpoint 是可靠执行层,不能反向改写 `MethodContent` truth。

### 7.2 Command 并发控制骨架

```text
[API Handler]
  | parse Command DTO + ActorContext + RequestMeta
  v
[MethodContentCommandService.<command>(Command, ActorContext, RequestMeta)]
  | begin UnitOfWork
  | try_begin IdempotencyRepository.try_begin(UnitOfWorkTx tx,
  |                                           IdempotencyKey key,
  |                                           IdempotencyScope scope,
  |                                           RequestHash request_hash)
  | get_for_update / load aggregate
  | check MethodContent.ensure_revision(Revision expected_revision)
  | call domain lifecycle method
  | save aggregate with expected_revision
  | append audit / snapshot / outbox if needed
  | mark idempotency succeeded with ResultRef
  v
[UnitOfWorkTx.commit()]
```

关键说明：

- 幂等记录必须与 Command 结果同事务提交。
- `get_for_update` 用于 publish / deprecate / retire / supersede 等关键状态迁移。
- `save(..., expected_revision)` 必须校验 revision,冲突返回 `REVISION_CONFLICT`。

### 7.3 并发场景表

| 场景 | 冲突资源 | 控制方式 | 失败错误 | 测试切口 |
|---|---|---|---|---|
| 两个 `UpdateMethodContentDraft` 同时更新同一 draft | `method_contents.content_id` / `revision` | `expected_revision` + repository 乐观锁 | `REVISION_CONFLICT` | 两个请求基于 revision=1,只允许一个保存成功 |
| `UpdateMethodContentDraft` 与 `SubmitMethodContentForReview` 并发 | 同一 `MethodContent` lifecycle / revision | `get_for_update` 或 save revision check + lifecycle guard | `REVISION_CONFLICT` 或 `LIFECYCLE_TRANSITION_NOT_ALLOWED` | update 和 submit 交错执行,后提交者失败 |
| `PublishMethodContent` 与 draft 更新 / submit 并发 | 同一 `MethodContent` lifecycle / revision | 写路径锁定 aggregate + expected_revision | `REVISION_CONFLICT` / `LIFECYCLE_TRANSITION_NOT_ALLOWED` | publish 期间另一个写请求不能覆盖 published 状态 |
| 两个 `PublishMethodContent` 使用同一 `content_family_id + version` | `method_content_versions` 唯一键 | unique `(content_family_id, version)` | `CONTENT_VERSION_CONFLICT` | 并发发布同版本只允许一个成功 |
| `DeprecateMethodContent` 与 `RetireMethodContent` 并发 | 同一 published content lifecycle / revision | 写路径锁定 + revision check | `REVISION_CONFLICT` 或 `LIFECYCLE_TRANSITION_NOT_ALLOWED` | 一个成功后另一个必须按新状态重新判断 |
| 两个 `SupersedeMethodContent` 替代同一 old content | `old_content_id` / `supersede_links.old_content_id` | old content lock + unique old_content_id | `SUPERSEDE_CONFLICT` / `REVISION_CONFLICT` | old content 只能被一个 new content 替代 |
| `SupersedeMethodContent` 与 `PublishMethodContent` 发布同一 new version | `new_content_id` / `content_family_id + version` | new content revision + version unique | `CONTENT_VERSION_CONFLICT` / `REVISION_CONFLICT` | new definition 不允许被重复发布成同版本 |
| 多个 outbox relay worker claim 同一 event | `outbox_events.event_id` / `status` | status compare-and-swap + worker lease | `OUTBOX_STATUS_CONFLICT` | 两个 worker 同时 claim,只有一个进入 publishing |
| bus ack 不确定后 relay 重试同一 event | `outbox_events.event_id` | event_id 稳定 + mark_published 幂等 | `OUTBOX_STATUS_CONFLICT` 可跳过 | 重复 ack 不产生新 outbox event |
| 多个 replay job 推进同一 consumer checkpoint | `projection_checkpoints.checkpoint_name` | checkpoint compare-and-swap,只允许单调推进 | `CHECKPOINT_CONFLICT` | 两个 job 从同 cursor 推进,后者重读 checkpoint |
| 多个 rebuild job 更新同一 projection | projection row + checkpoint | projection upsert by key + checkpoint CAS | `CHECKPOINT_CONFLICT` / `PROJECTION_UPDATE_FAILED` | 并发 rebuild 不反写 write model |
| seed job 重复创建同一资产版本 | seed asset identity / version unique | seed scope hash + content family/version unique | `CONTENT_VERSION_CONFLICT` 或幂等返回 | 重复 seed 不生成重复 published definition |

### 7.4 幂等键表

| 接口 / Job / Event | 幂等键 | 幂等窗口 | 重复请求处理 |
|---|---|---|---|
| P0 Command 通用 | `IdempotencyScope(command_name + target_id_or_family) + x-idempotency-key + request_hash` | 至少覆盖业务审计保留期;实现可设 retention,但不能早于 result_ref 可用期 | 同 key 同 hash 成功则返回既有 `ResultRef`;processing 返回 `IDEMPOTENCY_STATUS_CONFLICT`;同 key 不同 hash 返回 `IDEMPOTENCY_CONFLICT` |
| `CreateMethodContentDraft` | `command_name + content_family_id_or_client_request_id + x-idempotency-key + request_hash` | 同 Command 通用 | 不重复创建 draft;返回既有 `content_id` |
| `UpdateMethodContentDraft` | `command_name + content_id + x-idempotency-key + request_hash` | 同 Command 通用 | 不重复 bump revision;返回既有 revision / result |
| `PublishMethodContent` | `command_name + content_id + version + x-idempotency-key + request_hash` | 同 Command 通用 | 不重复写 version / snapshot / outbox;返回既有 publish result |
| `DeprecateMethodContent` / `RetireMethodContent` | `command_name + content_id + x-idempotency-key + request_hash` | 同 Command 通用 | 不重复写 lifecycle history / outbox |
| `SupersedeMethodContent` | `command_name + old_content_id + new_content_id + new_version + x-idempotency-key + request_hash` | 同 Command 通用 | 不重复创建 supersede link、version、snapshot 和 outbox |
| Query | 无 | 无 | 只读重复调用,不写幂等记录 |
| Outbound Event relay | `outbox_event_id / event_id` | 永久或至少覆盖 downstream replay 窗口 | 已 published 则跳过;retry 复用原 event_id,不得生成新 event |
| Inbound governance event | `source_module + external_event_id + payload_hash` | 至少覆盖上游重投窗口 | 同 event_id 同 hash ack / skip;同 event_id 不同 hash 写 dead-letter 或返回 `IDEMPOTENCY_CONFLICT` |
| `SeedInitialMethodAssets` job | `job_name + scope_hash(asset_set,kinds,publish,dry_run) + x-idempotency-key` | 至少覆盖 seed 结果审计期 | 同 key 同 scope 返回既有 job result;子 Command 使用 deterministic seed key 防重复资产 |
| `ReplayDefinitionEvents` job | `job_name + scope_hash(consumer,from_cursor,event_types,batch_size,dry_run) + x-idempotency-key` | 至少覆盖 replay 运行和下游补偿窗口 | 同 key 同 scope 返回既有 result / progress;replay 复用原 event_id |
| `RecalculateFingerprint` job | `job_name + scope_hash(content_ids,kind,canonical_schema_version,dry_run) + x-idempotency-key` | 至少覆盖 mismatch report 可查询期 | 同 key 同 scope 返回既有 report;dry_run 不写 outbox |
| `RebuildReadModels` job | `job_name + scope_hash(projection_names,from_cursor,batch_size,dry_run) + x-idempotency-key` | 至少覆盖 rebuild 运行和 checkpoint 恢复窗口 | 同 key 同 scope 返回既有 result;dry_run 不推进正式 checkpoint |

### 7.5 重入保护表

| 场景 | 重入来源 | 保护方式 | 恢复方式 |
|---|---|---|---|
| 客户端超时后重试 Command | HTTP/RPC timeout,调用方不确定结果 | `IdempotencyRepository.try_begin(...)` + `request_hash` + result_ref | 同 key 同 hash 返回既有结果;如无记录则重新执行并由 revision / unique 兜底 |
| Command 执行中重复提交 | 同 key 同 hash 仍为 `Processing` | `IdempotencyStatus::Processing` 阻止第二次进入业务写入 | 返回 `IDEMPOTENCY_STATUS_CONFLICT` 或处理中响应,调用方稍后查询 / 重试 |
| Command 失败后原 key 重试 | `IdempotencyStatus::Failed` | failed 作为终态,不自动覆盖原失败记录 | 调用方修正原因后使用新 idempotency key |
| 同 key 不同 body | 客户端复用幂等键 | `request_hash` 不匹配 | 返回 `IDEMPOTENCY_CONFLICT`,必须换 key |
| outbox worker crash 于 `Publishing` | worker 进程中断或 bus ack 未返回 | `claim_pending` 使用 status CAS + `lease_until` | lease 过期后其他 worker 可重新 claim;event_id 不变 |
| outbox event 已发布后重复 relay | worker 重试或 replay | `OutboxStatus::Published` + event_id 去重 | 跳过或返回已发布,不得新建 event |
| inbound governance event 重投 | 上游 event bus 至少一次投递 | `source + event_id + payload_hash` 去重 | 同 hash ack;不同 hash dead-letter |
| replay job 重跑 | downstream 反复请求补偿或 job 中断后 resume | checkpoint CAS + 原 event_id replay | 从最新 checkpoint 继续;冲突时重读 checkpoint |
| rebuild projection 重跑 | scheduler 重复触发或人工重试 | projection upsert by key + checkpoint CAS | 已处理对象可覆盖 projection,但不改 truth |
| seed job 重跑 | bootstrap 重复执行 | job scope 幂等 + deterministic child command key + version unique | 已存在资产跳过或返回既有结果 |
| dry_run job 重跑 | 人工反复演练 | dry_run scope 独立;禁止写 truth/outbox/checkpoint | 返回 report;若发生写入尝试则 `JOB_DRY_RUN_WRITE_FORBIDDEN` |

### 7.6 Repository / Port 契约补充

| 契约 | 函数签名 | 作用 |
|---|---|---|
| 幂等开始 | `IdempotencyRepository.try_begin(UnitOfWorkTx tx, IdempotencyKey key, IdempotencyScope scope, RequestHash request_hash) -> Result<IdempotencyBeginResult, MethodLibraryError>` | 创建 processing 记录或返回既有状态;同 key 不同 hash 返回冲突 |
| 幂等完成 | `IdempotencyRepository.mark_completed(UnitOfWorkTx tx, IdempotencyKey key, IdempotencyScope scope, ResultRef response_ref, Timestamp now) -> Result<(), MethodLibraryError>` | 与业务写入同事务保存结果引用 |
| 幂等失败 | `IdempotencyRepository.mark_failed(UnitOfWorkTx tx, IdempotencyKey key, IdempotencyScope scope, FailureReason reason, Timestamp now) -> Result<(), MethodLibraryError>` | 记录失败结果;不替代 structured log |
| outbox claim | `OutboxRepository.claim_pending(BatchSize limit, WorkerId worker_id, Timestamp now, LeaseDuration lease) -> Result<Vec<OutboxEvent>, MethodLibraryError>` | 原子 claim pending / retryable_due / expired publishing event |
| outbox 发布成功 | `OutboxRepository.mark_published(OutboxEventId event_id, WorkerId worker_id, Timestamp now) -> Result<(), MethodLibraryError>` | 只有持有 lease 的 worker 可标记成功 |
| checkpoint 推进 | `ProjectionCheckpointRepository.advance_if_current(CheckpointName name, Option<OutboxEventId> expected_cursor, OutboxEventId next_cursor, Timestamp now) -> Result<(), MethodLibraryError>` | compare-and-swap 推进 checkpoint,防止并发跳跃 |
| job 开始 | `JobRunRepository.start_once(UnitOfWorkTx tx, JobName job_name, JobScopeHash scope_hash, IdempotencyKey key, Timestamp now) -> Result<JobRunStartResult, MethodLibraryError>` | 防止同 job scope 被同 key 重复启动 |

说明：

- 上表是对 Step 7 / Step 11 repository 契约的并发语义补充,不是新增业务对象。
- `claim_pending` 可以在实现中拆成 `load_pending + mark_publishing`,但必须保证原子 claim 语义。
- 如果第一版不引入显式 `WorkerId / LeaseDuration`,也必须有等价的状态 CAS 和超时恢复策略。

### 7.7 实现红线

| 红线 | 说明 |
|---|---|
| 不允许无 `expected_revision` 覆盖写 `MethodContent` | 所有修改既有 content 的 Command 必须携带 revision |
| 不允许用 idempotency 替代业务校验 | 同 key 命中前仍需确认 scope / hash 合法 |
| 不允许同 key 不同 body 继续执行 | 必须返回 `IDEMPOTENCY_CONFLICT` |
| 不允许重复发布时生成新 event_id | replay / retry 必须复用原 outbox event_id |
| 不允许 outbox 多 worker 无 claim 发布 | relay 必须有 status CAS 或 lease |
| 不允许 checkpoint 跳过失败项 | 只有 batch 成功处理后才能推进 |
| 不允许 dry_run 写 truth、outbox 或正式 checkpoint | dry_run 只能生成临时 report |
| 不允许 Query 写幂等记录或修复数据 | Query 保持只读 |

---

## 8. 回填草稿

可直接回填到 `03-详细设计.md` 的起草结构：

````md
## 12. 并发、幂等与重入保护

### 12.1 三层保护模型

```text
[Request Idempotency] -> [Resource Concurrency] -> [Worker Reentry Protection]
```

本仓通过三层机制处理重复请求、并发修改和 worker 重入:

1. 请求层通过 `IdempotencyKey + RequestHash` 防止重复执行。
2. 资源层通过 `revision`、row lock 和唯一约束防止并发覆盖。
3. worker 层通过 outbox claim、checkpoint CAS 和 job status 防止重复发布与重复推进。

### 12.2 并发场景表

| 场景 | 冲突资源 | 控制方式 | 失败错误 | 测试切口 |
|---|---|---|---|---|

### 12.3 幂等键表

| 接口 / Job / Event | 幂等键 | 幂等窗口 | 重复请求处理 |
|---|---|---|---|

### 12.4 重入保护表

| 场景 | 重入来源 | 保护方式 | 恢复方式 |
|---|---|---|---|

### 12.5 Repository / Port 并发契约补充

| 契约 | 函数签名 | 作用 |
|---|---|---|

### 12.6 实现红线

| 红线 | 说明 |
|---|---|
````

---

## 9. 待确认事项

- outbox claim 第一版是否显式落 `worker_id / lease_until`,还是只用 status CAS + `updated_at` 超时恢复。当前建议保留 lease 语义,实现可用字段等价表达。
- `IdempotencyStatus::Processing` 的重复请求返回 409,还是返回 202 + 查询入口。当前建议第一版返回 `IDEMPOTENCY_STATUS_CONFLICT`,后续异步接口再扩展 202。
- `IdempotencyStatus::Failed` 是否对同 key 同 hash 返回既有失败,还是允许重新执行。当前建议 failed 为终态,修正后使用新 key。
- Seed job 的子 Command 幂等键是否统一由 `seed asset identity + action + version` 派生。当前建议采用 deterministic child key,避免 parent job 重跑创建重复资产。

---

## 10. 进入下一步条件

- 并发场景表已经覆盖 Command、outbox relay、inbound event、operations job 和 projection / checkpoint。
- 幂等键表已经说明 Command、Query、Outbound Event、Inbound Event、Operations Job 的 key 来源和重复行为。
- 重入保护表已经覆盖客户端超时、worker crash、event 重投、job resume、dry_run 重跑。
- 并发冲突错误已能映射到 Step 12 错误模型。
- 每个关键并发 / 幂等场景都能转化为 Step 16 测试切口。
- 可以进入 Step 14 定义配置引用与外部依赖绑定。
