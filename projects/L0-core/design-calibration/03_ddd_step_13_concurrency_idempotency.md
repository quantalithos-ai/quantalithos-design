# Step 13. 定义并发、幂等与重入保护

> 本文件是 `projects/L0-core/03-详细设计.md` 的 Step 13 中间产物。
> 本步只收稳并发更新、重复请求、重复事件、job 重跑和部分失败时的保护方式。
> 本步不实现分布式锁服务,不引入在线 HTTP / RPC server,不改写正式 `03-详细设计.md`。
> 正式 `03-详细设计.md` 仍在 Step 19 统一回填,本文件不替代正式详细设计。

## 1. Step 状态

- 状态: [x] 已确认
- 对应 SOP: `standards/document/详细设计讨论流程_SOP.md` Step 13
- 回填章节: `projects/L0-core/03-详细设计.md` §12 并发、幂等与重入保护

---

## 2. 本步输入

| 输入 | 内容 | 本步使用方式 |
|---|---|---|
| Step 8 协议契约 | Command / Query / Event / Job 均已列出幂等要求 | 固定幂等键来源 |
| Step 9 函数级处理流 | 每个 flow 的事务切口、version conflict 和 outbox relay 逻辑 | 固定冲突资源和重入来源 |
| Step 11 持久化、事务与一致性 | repository、UnitOfWork、outbox、projection、snapshot 恢复口径 | 固定锁、版本、唯一键和事务策略 |
| Step 12 错误模型 | `Conflict`、`PreconditionFailed`、`Port` 等错误映射 | 固定失败错误和调用方处理 |

已确认结论:

```text
Command / Job 写路径必须携带 IdempotencyKey。
重复请求 payload 一致时返回既有 receipt;payload 不一致时返回 ApplicationError::Conflict。
definition / baseline / snapshot / fact 等真相更新使用 expected_version / aggregate_version 乐观锁。
outbox relay 不依赖外部 bus ack;重复发布必须依赖 CloudEvent id 与业务幂等 key。
projection rebuild 和 snapshot derive 允许重跑,但必须用 job_id / rebuild_id / snapshot fingerprint 防止重复结果污染。
```

---

## 3. 本步写作策略

本步按“并发冲突 -> 幂等键 -> 重入保护 -> 测试切口”展开:

```text
先找会并发修改的资源 -> 再固定幂等键来源 -> 再定义重复进入的处理结果 -> 最后映射到测试
```

写作约束:

- 只写会真实影响实现的并发、幂等和重入场景。
- 幂等键必须能从 command、event、job 参数或存储唯一键计算出来。
- 不把 query 读重试误写成写路径幂等。
- 不把 outbox 事件投递失败写成 truth 回滚。
- 不引入跨进程分布式锁作为 P0 前提;文件型 adapter 可以用进程级文件锁和原子提交实现同一契约。
- 幂等记录必须保存 payload fingerprint,避免同一 idempotency key 被不同请求复用。

---

## 4. 分章节写入计划

| 章节 | 状态 | 主题 |
|---|---|---|
| 13.1 | [x] | 并发、幂等和重入口径总览 |
| 13.2 | [x] | SOP 问题回答 |
| 13.3 | [x] | 并发场景表 |
| 13.4 | [x] | 幂等键表 |
| 13.5 | [x] | 重入保护表 |
| 13.6 | [x] | 测试切口映射 |
| 13.7 | [x] | 回补对象、port 和存储契约 |

---

## 5. SOP 问题回答

### 5.1 哪些处理流可能并发修改同一资源？

| 处理流 | 冲突资源 | 原因 |
|---|---|---|
| `UpdateContractDraftFlow` / `SubmitContractForReviewFlow` / `PublishContractBaselineFlow` / `UpdateContractLifecycleFlow` | 同一个 `ContractDefinition` | 都会读取并保存 definition 生命周期、版本、指纹或发布状态 |
| `PublishContractBaselineFlow` | 同一个 definition 的 current released baseline | 同一 definition 不能并发形成多个当前 released baseline |
| `DeriveReleaseSnapshotJobFlow` | 同一个 `ContractReleaseBaseline` / `ContractReleaseSnapshot` | 同一 baseline 重复派生可能生成重复 snapshot metadata |
| `PublishContractFactJobFlow` / `OutboxRelayFlow` | 同一个 `ContractFactRecord` / `FactOutboxEvent` | fact 状态和 outbox 状态可能被重复整理或重复发布 |
| `RebuildContractIndexJobFlow` | 同一 projection 水位和 projection 批次 | 多个 rebuild 可能互相覆盖水位 |
| `ValidateContractChangeJobFlow` | 同一 definition / baseline 的 compatibility trace | 重复校验可能生成重复兼容追溯 |

### 5.2 哪些接口、事件或 job 可能被重复调用？

| 类别 | 可能重复的对象 | 处理原则 |
|---|---|---|
| Command | 5 个写 command | 同一 idempotency key + 同一 payload fingerprint 返回既有 receipt |
| Query | 8 个 query | 不需要幂等键;重复读取只返回当前 view 或 stale view |
| Outbound Event | 7 个 CloudEvent | 使用 CloudEvent `id` + 业务幂等 key 去重;重复 publish 不创建新业务事实 |
| Operations Job | 5 个 job + `OutboxRelayWorker` | 使用 `JobRunId`、显式 `IdempotencyKey`、业务目标 ID 或 `rebuild_id` 去重 |

### 5.3 幂等键来自请求、事件、job 参数还是数据库唯一约束？

| 场景 | 幂等键来源 |
|---|---|
| Command API | `CommandMetadata.request.idempotency_key` |
| Operations Job | `JobRunId` + 显式 `IdempotencyKey`;缺省时由业务目标组合生成 |
| Outbound Event | CloudEvent `id` + 事件业务幂等 key |
| outbox 记录 | `outbox_events.idempotency_key` 唯一约束 |
| projection rebuild | `ProjectionRebuildId` + `ProjectionName` |
| snapshot derive | `baseline_id + job_id` 或 `snapshot_id + fingerprint` |
| truth 更新 | `expected_version` / `aggregate_version` 乐观锁,不是业务幂等键 |

### 5.4 重复请求应该返回既有结果、跳过、覆盖还是报错？

| 重复类型 | 处理结果 |
|---|---|
| 同一 idempotency key + 同一 payload fingerprint 已完成 | 返回既有 receipt |
| 同一 idempotency key + 不同 payload fingerprint | 返回 `ApplicationError::Conflict` |
| 同一 idempotency key 正在处理中 | 返回 `ApplicationError::Conflict`,调用方稍后用同一 key 重试 |
| 重复 CloudEvent publish | 跳过或幂等覆盖 delivery 状态,不得创建新 truth |
| 重复 projection rebuild 且 rebuild_id 相同 | 允许覆盖同一批次结果,最终水位不倒退 |
| 重复 job 且目标结果已存在 | 返回既有 job receipt 或跳过已完成部分 |

### 5.5 并发冲突如何测试？

| 测试方向 | 必须覆盖 |
|---|---|
| 乐观锁 | 两个 update 使用同一 `expected_version`,后提交者返回 `Conflict` |
| 幂等 replay | 同一 command 重复提交同一 payload,第二次返回同一 receipt |
| 幂等冲突 | 同一 idempotency key 提交不同 payload,返回 `Conflict` |
| outbox relay | 同一 outbox event 被重复 fetch / publish,最终只标记一次 published |
| projection rebuild | 旧 rebuild 后提交时不得覆盖新 rebuild 水位 |
| job 重跑 | snapshot / validation / fact publish 重跑不会生成重复 truth |

---

## 6. 当前问题诊断

| 问题 | 影响 | 本步修正 |
|---|---|---|
| Step 8 / 9 已要求幂等,但 Step 6 没有正式幂等记录对象 | 实现者只能临时把幂等塞进 audit 或 outbox | 本步回补 `IdempotencyRecord`、`IdempotencyDecision` 等支撑对象 |
| Step 7 没有幂等 repository port | application service 无法判断 replay / conflict / in progress | 本步回补 `IdempotencyRepository` |
| Step 11 没有 `idempotency_records` 存储对象 | 幂等记录无法持久化,重复请求无法返回既有 receipt | 本步回补存储对象、唯一键和事务要求 |
| outbox 幂等和 command 幂等容易混淆 | 可能错误复用 outbox 当 command 幂等 ledger | 本步明确 command/job 幂等使用 `IdempotencyRepository`,event 幂等使用 outbox + CloudEvent |
| projection rebuild 并发未单独收口 | 可能旧 rebuild 覆盖新水位 | 本步固定 `ProjectionRebuildId` 和 watermark 不倒退规则 |

---

## 7. 改动前后对比

| 维度 | 改动前 | 改动后 |
|---|---|---|
| Command 幂等 | 只要求携带 `IdempotencyKey` | 有 `IdempotencyRecord`、payload fingerprint、receipt replay 和 conflict 规则 |
| Job 幂等 | 写了 `JobRunId` / `IdempotencyKey` | 固定每类 job 的业务幂等键和重跑结果 |
| Event 幂等 | 每个 event 有业务 key | 明确事件去重属于 outbox / CloudEvent,不替代 command 幂等 |
| 并发控制 | 分散在 expected version 和事务表中 | 集中列出冲突资源、控制方式、失败错误和测试切口 |
| 重入保护 | Step 11 有恢复口径 | 本步补齐 replay、rebuild、repeat job、mark 状态失败后的重入策略 |

---

## 8. 设计取舍

| 决策点 | 方案 A | 方案 B | 推荐 | 原因 |
|---|---|---|---|---|
| Command 幂等是否只依赖业务唯一键 | 只靠 definition_id、baseline_id 等唯一约束 | 增加 `IdempotencyRecord` | B | 唯一键无法判断 payload 是否相同,也无法返回既有 receipt |
| 幂等记录是否保存完整 payload | 保存完整请求 payload | 只保存 canonical payload fingerprint | B | 避免复制正文或敏感输入,同时能判断 key 复用冲突 |
| 重复处理中请求如何返回 | 阻塞等待 | 返回 `Conflict`,调用方稍后重试 | B | 当前没有常驻在线 server 和等待通道,阻塞会复杂化 CLI / job |
| outbox publish 成功但 mark published 失败后是否重新 publish | 重新 publish 同一 CloudEvent | 允许重放同一事件,只要保持同一 CloudEvent id | A | L0-core 无法确认外部 bus 是否已接收,重复 publish 必须保持同一事件 ID |
| projection rebuild 并发用全局锁还是水位 | 全局锁 | `ProjectionRebuildId` + watermark 不倒退 | B | 文件型和数据库型 adapter 都可实现,也支持后续增量 rebuild |

---

## 9. 结构化中间产物

### 9.1 并发与幂等总览

```text
[Command / Job input]
  | includes IdempotencyKey / JobRunId
  v
[UnitOfWork]
  | open transaction or equivalent atomic boundary
  v
[IdempotencyRepository]
  | reserve(scope, key, operation, payload_fingerprint)
  |-- replay completed receipt
  |-- reject payload mismatch
  |-- reject in-progress duplicate
  v
[Repository]
  | expected_version / unique constraint
  v
[truth + audit + outbox]
  | same transaction
  v
[IdempotencyRepository]
  | complete(scope, key, receipt)
```

关键说明:

- 幂等保护发生在 application service 边界,不进入 domain object。
- 乐观锁负责保护同一资源并发更新,幂等记录负责保护同一调用重复进入。
- outbox relay 是最终一致边界,不参与 command receipt replay。

### 9.2 并发场景表

| 场景 | 冲突资源 | 控制方式 | 失败错误 | 测试切口 |
|---|---|---|---|---|
| 两个草稿更新同时修改同一 definition | `ContractDefinition.aggregate_version` | `get_for_update` + `save(expected_version)` | `ApplicationError::Conflict` | 两个 update 使用同一 version,后者失败 |
| 更新草稿与提交评审并发 | `ContractDefinition.lifecycle` / `aggregate_version` | 写事务 + expected version | `ApplicationError::Conflict` 或 `PreconditionFailed` | update 后 submit 使用旧 version |
| 提交评审与发布基线并发 | `ContractDefinition.lifecycle` / gate / fingerprint | lifecycle 状态机 + expected version | `PreconditionFailed` / `Conflict` | 未进入 in_review 发布失败 |
| 两个发布请求同时发布同一 definition | current baseline 唯一约束 | definition 锁 + current baseline 唯一键 | `ApplicationError::Conflict` | 并发 publish 只生成一个 released baseline |
| 生命周期迁移与发布并发 | `ContractDefinition.lifecycle` | expected version + 状态矩阵 | `Conflict` / `PreconditionFailed` | retire 与 publish 交错 |
| 快照派生 job 重复运行 | `ContractReleaseSnapshot` / snapshot asset | `baseline_id + job_id` 幂等键 + fingerprint 校验 | `Conflict` / `Port` | 重跑不生成重复 ready snapshot |
| 兼容性校验 job 重复运行 | `CompatibilityTraceIndex` | `definition_id + job_id` 幂等键 + trace index upsert | `Conflict` / `Port` | 重跑返回既有 validation receipt |
| projection 重建 job 并发 | `projection_watermarks` | `ProjectionRebuildId` + watermark 不倒退 | `ApplicationError::Conflict` 或 `Port` | 旧 rebuild 不能覆盖新水位 |
| fact publish job 与 relay 并发 | `ContractFactRecord` / `FactOutboxEvent` | fact 状态乐观锁 + outbox event 唯一键 | `Conflict` / `Port` | 同一 fact 只形成一个 outbox 事件 |
| outbox relay 多 worker 并发 | 同一 `FactOutboxEvent` | fetch pending 后单条 mark 事务 + CloudEvent id 幂等 | `Port` 或跳过已处理 | 两个 worker 处理同一 event 不重复完成 |

### 9.3 幂等键表

| 接口 / Job / Event | 幂等键 | 幂等窗口 | 重复请求处理 |
|---|---|---|---|
| `CreateContractDraft` | `CommandMetadata.request.idempotency_key` + payload fingerprint | 永久保留或随资源保留 | 同 payload 返回既有 `ContractChangeReceipt`;不同 payload 返回 `Conflict` |
| `UpdateContractDraft` | `CommandMetadata.request.idempotency_key` + `definition_id` + payload fingerprint | 至少覆盖资源生命周期 | 同 payload 返回既有 receipt;旧 version 重放返回既有 receipt |
| `SubmitContractForReview` | `idempotency_key` + `definition_id` + payload fingerprint | 至少覆盖资源生命周期 | 同 payload 返回既有 `ContractReviewReceipt` |
| `PublishContractBaseline` | `idempotency_key` + `definition_id` + `expected_definition_version` + payload fingerprint | 永久保留发布追溯 | 同 payload 返回既有 `ContractBaselineReceipt`;不同 gate / fingerprint 返回 `Conflict` |
| `UpdateContractLifecycle` | `idempotency_key` + `definition_id` + target lifecycle + payload fingerprint | 永久保留生命周期追溯 | 同 payload 返回既有 `ContractLifecycleReceipt` |
| `ContractDraftChanged` | `definition_id + version + change_kind` | outbox 保留期 | 重复 event 使用同一 CloudEvent `id`,publisher 幂等处理 |
| `ContractReviewSubmitted` | `definition_id + lifecycle_state + version` | outbox 保留期 | 重复 publish 不创建新事件 |
| `ContractBaselinePublished` | `baseline_id + fingerprint` | outbox 保留期 | 重复 publish 保持同一 event id |
| `ContractLifecycleChanged` | `definition_id + previous_state + new_state` | outbox 保留期 | 重复 publish 保持同一 event id |
| `ContractCompatibilityStatusChanged` | `definition_id + compatibility_status + trace_index_id` | outbox 保留期 | 重复 publish 保持同一 event id |
| `ContractSnapshotReady` | `snapshot_id + fingerprint` | outbox 保留期 | 重复 publish 保持同一 event id |
| `ContractFactPublished` | `fact_id + outbox_event_id` | outbox 保留期 | 重复 publish 保持同一 event id |
| `ValidateContractChangeJob` | `definition_id + job_id` 或显式 `idempotency_key` | job history 保留期 | 同 payload 返回既有 output;不同 payload 返回 `Conflict` |
| `DeriveReleaseSnapshotJob` | `baseline_id + job_id` 或显式 `idempotency_key` | snapshot 生命周期 | 同 payload 返回既有 snapshot receipt;asset 已存在则校验 fingerprint |
| `RebuildContractIndexJob` | `scope + job_id` 或显式 `idempotency_key` | projection 水位保留期 | 同 rebuild id 可重跑;旧 rebuild 不覆盖新水位 |
| `RecalculateFingerprintJob` | `target + algorithm + job_id` 或显式 `idempotency_key` | job history 保留期 | 同 payload 返回既有 output;不同 algorithm 返回 `Conflict` |
| `PublishContractFactJob` | `fact_id + job_id` 或显式 `idempotency_key` | fact 生命周期 | 同 fact 已 queued / published 时跳过重复整理 |
| `OutboxRelayWorker` | `run_id` + 单条 CloudEvent `id` | outbox 保留期 | worker run 可重复,单条 event 幂等 mark |

### 9.4 重入保护表

| 场景 | 重入来源 | 保护方式 | 恢复方式 |
|---|---|---|---|
| Command 提交后客户端超时重试 | CLI / gateway retry | `IdempotencyRepository` replay completed receipt | 使用同一 idempotency key 重试 |
| Command 进行中重复进入 | 并发客户端或脚本重复调用 | idempotency record `Reserved` 状态返回 `Conflict` | 稍后重试同一 key |
| Command 成功但 outbox append 失败 | port failure | truth / audit / outbox 同事务回滚,幂等记录不完成 | 修复依赖后同 key 重试 |
| Command 成功且 receipt 已完成 | 客户端重复提交 | 返回既有 receipt,不重复写 truth | 无需恢复 |
| Outbox publish 成功但 mark published 失败 | relay crash / mark port failure | 保留 pending 或 failed;下一轮用同一 CloudEvent id 重发 | relay replay 或人工标记 |
| Outbox publish 失败 | publisher unavailable | mark failed 或保留 pending,不中断 truth | `replay_outbox` |
| Snapshot asset 写成功但 metadata 失败 | 事务前外部资产写入成功 | metadata 不写 ready,asset 标记 orphan candidate | 重跑 job 或清理 orphan |
| Projection replace 部分失败 | projection store failure | 批次事务失败,旧 projection 保留 | 重跑 rebuild job |
| Projection 旧 rebuild 后提交 | 并发 rebuild | watermark 比较禁止倒退 | 丢弃旧 rebuild 或返回 conflict |
| Fact publish job 重跑 | scheduler retry | fact 状态和 outbox 唯一键判断已处理 | 返回既有 receipt 或跳过 |

### 9.5 测试切口映射表

| 测试切口 | 需要断言 |
|---|---|
| command idempotent replay | 第二次相同 key + payload 不新增 definition / audit / outbox,返回同一 receipt |
| command idempotency conflict | 同 key 不同 payload 返回 `ApplicationError::Conflict` |
| command in-progress duplicate | 同 key 正在处理时返回 `ApplicationError::Conflict` |
| optimistic lock conflict | expected version 旧值保存失败,事务回滚 |
| current baseline uniqueness | 并发 publish 只允许一个 current released baseline |
| outbox duplicate relay | 同一 CloudEvent id 重复 publish 不新增业务事件 |
| relay mark failure | mark 失败后 outbox 仍可被 replay |
| snapshot derive rerun | 重跑后 fingerprint 一致才复用 asset / metadata |
| projection rebuild ordering | 新 watermark 不被旧 rebuild 覆盖 |
| job idempotent rerun | 同 `JobRunId` 重跑返回既有 job output 或跳过已完成写入 |

---

## 10. 回补对象、port 和存储契约

本步必须回补三个前序中间产物:

| 回补位置 | 回补内容 | 原因 |
|---|---|---|
| Step 6 对象实现契约 | `IdempotencyRecord`、`IdempotencyStatus`、`IdempotencyDecision`、`RequestPayloadFingerprint`、`IdempotencyScope`、`OperationName` | application service 需要可编码的幂等对象 |
| Step 7 Trait / Port / Adapter 契约 | `IdempotencyRepository` | application service 需要 reserve / complete / replay 边界 |
| Step 9 函数级处理流 | Command / Job 统一幂等调用外壳 | 处理流需要明确 reserve / replay / complete 的调用位置 |
| Step 11 持久化、事务与一致性 | `idempotency_records` 存储对象和事务要求 | 重复请求必须跨进程 / 跨运行保留结果 |

最小函数契约:

```rust
/// 幂等记录仓储端口,用于写路径 reserve、replay 和完成记录。
pub trait IdempotencyRepository {
    /// 预占幂等键或返回既有处理结果。
    async fn reserve(
        &self,
        scope: IdempotencyScope,
        key: IdempotencyKey,
        operation: OperationName,
        payload_fingerprint: RequestPayloadFingerprint,
        request_id: RequestId,
        now: Timestamp,
    ) -> Result<IdempotencyDecision, PortError>;

    /// 将幂等记录标记为完成,并保存可 replay 的 receipt。
    async fn complete(
        &self,
        scope: IdempotencyScope,
        key: IdempotencyKey,
        receipt: Receipt,
        completed_at: Timestamp,
    ) -> Result<(), PortError>;
}
```

实现约束:

- `reserve(...)` 必须在写路径事务内调用,或由 adapter 提供等效唯一键原子预占。
- `complete(...)` 必须和 truth / audit / outbox 成功写入处于同一事务边界。
- 如果事务回滚,幂等记录不得进入 completed。
- `payload_fingerprint` 只根据 canonical command / job payload 计算,不得包含 trace id、request id 或 actor session。

---

## 11. 回填草稿

正式 `03-详细设计.md` 回填时应遵守:

```text
1. §12 先写总体原则,再写并发场景表、幂等键表、重入保护表。
2. Command / Job 幂等必须引用 IdempotencyRepository,不能只写“带 idempotency key”。
3. Event 幂等必须引用 CloudEvent id、业务幂等 key 和 outbox 状态,不能复用 command 幂等记录。
4. expected_version 只解决并发更新,不替代请求幂等。
5. 每个并发和重入场景必须能映射到 Step 16 测试切口。
```

建议正式文档 §12 结构:

| 正式章节位置 | 回填内容 |
|---|---|
| `12.1 并发与幂等总体原则` | 三类保护机制和总览图 |
| `12.2 并发场景表` | 冲突资源、控制方式、失败错误、测试切口 |
| `12.3 幂等键表` | command / event / job 幂等键和重复处理 |
| `12.4 重入保护表` | retry、replay、rebuild、worker crash 处理 |
| `12.5 实现补充契约` | `IdempotencyRepository` 与 storage 约束 |

---

## 12. 待确认事项

| 待确认项 | 备选方案 | 推荐方案 | 推荐理由 | 当前状态 |
|---|---|---|---|---|
| 是否新增幂等记录对象 | A. 不新增,只靠唯一键; B. 新增 `IdempotencyRecord` | B | 必须支持 payload fingerprint 和 receipt replay | 已按 B 作为本轮口径 |
| 幂等记录是否保存完整 payload | A. 保存完整 payload; B. 保存 canonical fingerprint | B | 避免复制正文,同时可判断冲突 | 已按 B 作为本轮口径 |
| 重复处理中请求是否等待 | A. 等待完成; B. 返回 `Conflict` 后稍后重试 | B | 当前无在线等待通道,实现更稳定 | 已按 B 作为本轮口径 |
| projection rebuild 并发是否全局串行 | A. 全局锁; B. rebuild id + watermark | B | 支撑文件和数据库 adapter,避免不必要串行 | 已按 B 作为本轮口径 |

---

## 13. 进入下一步条件

Step 13 完成后必须满足:

- 所有真实并发修改资源已经列出。
- Command / Event / Job 的幂等键来源已经固定。
- 重复请求、重复事件、重复 job 的处理结果已经明确。
- `expected_version` 和 `IdempotencyKey` 的职责已经分清。
- outbox、snapshot、projection 的重入恢复已经承接 Step 11 / 12。
- Step 6 / 7 / 9 / 11 中缺失的幂等对象、port、处理流外壳和存储契约已经回补。
- 可以进入 Step 14 “定义配置引用与外部依赖绑定”。
