# Step 7. 逐模块定义 Trait / Port / Adapter 契约

## 1. Step 状态

- 状态：[x] 已确认
- 对应 SOP：`standards/document/详细设计讨论流程_SOP.md` Step 7
- 回填章节：`03-详细设计.md` §5 模块实现契约 / §6 全局对象、Trait、API 索引

---

## 2. 本步输入

| 输入 | 内容 |
|---|---|
| Step 5 模块主轴 | 已确认 `application::ports` 是 port trait 定义中心,`infra::*` 是 adapter 实现中心 |
| Step 6 对象契约 | 已确认 `MethodContent`、`DefinitionSnapshot`、`OutboxEvent`、projection、P1 对象等类型主语 |
| Step 4 文件布局 | 已确认 `method_library_application/src/ports/` 与 `method_library_infra/src/` 的代码落点 |
| `03-详细设计.md` 现有 §27 | 已有 repository / port 函数清单,需要重排为模块接缝契约 |
| 架构设计依赖方向 | application 依赖 port trait,不依赖 infra concrete adapter;domain 不依赖 port |

已确认结论：

```text
Step 7 只收稳跨层接缝。
repository / outbound / support 能力必须通过 application::ports trait 访问。
infra 只实现 port,不拥有业务决策。
handler、worker、job runner 不得绕过 application service 直接调用 repository 改写 truth。
```

依赖的前序 Step：

```text
Step 1~6 已确认上游输入、范围、实现约束、文件布局、模块主轴和对象契约。
```

---

## 3. SOP 问题回答

1. 哪些模块需要定义 trait / port？

   回答：本轮 P0 只在 `application::ports` 定义 trait / port,包括 `UnitOfWork`、write model repository、append-only repository、reliable record repository、snapshot repository、projection repository、operations repository、outbound port 和 support port。Domain 不定义外部 port;API / Worker 不定义业务 port;Infra 不定义业务 trait,只提供实现。

2. 哪些模块负责实现这些 trait / port？

   回答：`infra::persistence` 实现 PostgreSQL transaction、write model、audit、outbox、idempotency、snapshot metadata、projection、checkpoint 等 repository;`infra::outbound_adapters` 实现 governance、L0-bus、object storage 等 outbound port;support port 可由 infra 或测试实现提供,但调用方仍只能依赖 trait。

3. repository、outbox、projection、external client 的函数签名是什么？

   回答：函数签名以现有 §27 为基准,统一使用 `Result<T, MethodLibraryError>`。写路径 repository 函数必须显式接收 `UnitOfWorkTx`;query / scan 函数必须分页;outbox relay 必须复用已持久化 `OutboxEvent`;external client 只能处理外部通信,不能写本仓 truth。

4. 每个 trait 函数的参数类型、返回类型、错误类型是什么？

   回答：本步在 7.3 和 7.4 中给出关键 port 的完整签名样式。所有 fallible 函数统一返回 `MethodLibraryError`;涉及 I/O 的函数建议 `async fn`;若目标实现需要 trait object,可在代码层选择 `async_trait` 或等价方式。

5. 哪些依赖只能通过 trait 访问，不能直接跨层调用？

   回答：PostgreSQL、L0-bus、object storage、governance、clock、ID generator、fingerprint hasher、feature flag、observability、projection store 都只能通过 port trait 访问。Application service 不依赖 infra concrete adapter;domain 不依赖任何 port;API / worker 的业务处理必须先进入 application service。

---

## 4. 当前文档问题诊断

| 位置 | 当前问题 | 影响 |
|---|---|---|
| `03-详细设计.md` §27 | port 函数已经较全,但仍是全局长清单 | 不利于看清定义方、实现方、调用方关系 |
| `03-详细设计.md` §26 / §27 | application service 和 repository port 相邻 | 容易让实现者把 service 编排逻辑下沉到 repository |
| `03-详细设计.md` §27.10 | support port 只有函数清单,缺少“唯一来源”红线 | 可能出现直接调用系统时间、随机 ID 或临时 hash 的实现 |
| Step 5 模块表 | 已说明 `infra` 实现 `application::ports`,但未列具体 adapter | 实现者仍不清楚 `Postgres*`、`L0*`、`ObjectStorage*` 放哪里 |
| Step 6 对象契约 | 已剥离 repository / port | 需要本步补上对象之外的跨层接缝 |

---

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| Port 组织方式 | §27 全局列 repository / port | 按 port 分组 + 定义方 / 实现方 / 调用方组织 | 让依赖方向和代码落点清楚 |
| Trait 签名 | 多数是表格签名 | 保留表格,并补代表性 Rust trait 片段 | 支撑实现者 1:1 转写 |
| Adapter 归属 | 有建议文件,但缺实现映射总览 | 增加 adapter implementation map | 避免 handler / worker 直接调用 infra |
| 事务边界 | `UnitOfWorkTx` 已出现,但使用规则分散 | 明确写路径 repository 必须接收 `UnitOfWorkTx` | 保证 command / audit / outbox 同事务 |
| Support port | 函数清单存在 | 明确 Clock / IdGenerator / FingerprintHasher 是唯一来源 | 保持可测试性和一致性 |
| P1 port | 和 P0 repository 连续出现 | 单独标注 P1 repository 不进入 P0 必经路径 | 保持 P0 / P1 分离 |

---

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 所有 port trait 放 infra crate | 实现集中 | application 会反向依赖 infra,破坏依赖方向 | 不采用 |
| repository trait 和实现放同一模块 | 文件少 | 测试替身、事务边界和依赖倒置不清楚 | 不采用 |
| application::ports 定义 trait,infra 实现 adapter | 依赖方向清晰,便于测试替身 | 初始文件数量更多 | 采用 |
| API / Worker 允许直接调用 repository | 少一层 service | 绕过幂等、audit、状态机、outbox 编排 | 不采用 |

---

## 7. 结构化中间产物

### 7.1 Port 分组总表

| 分组 | Trait / Port | 定义位置 | 实现位置 | 主要调用方 | 主要责任 |
|---|---|---|---|---|---|
| 事务端口 | `UnitOfWork`、`UnitOfWorkTx` | `method_library_application/src/ports/unit_of_work.rs` | `infra::persistence::postgres` | command / job service | 管理同事务写入边界 |
| write model repository | `MethodContentRepository`、`MethodContentReferenceRepository`、`MethodContentVersionRepository`、`SupersedeLinkRepository` | `application::ports::repositories` | `infra::persistence::postgres` | command / validation / job service | 保存 MethodContent truth 和关系 |
| append-only repository | `LifecycleHistoryRepository`、`AuditRepository` | `application::ports::repositories` | `infra::persistence::postgres` | command / trace query service | 追加历史和审计 |
| reliable record repository | `OutboxRepository`、`IdempotencyRepository` | `application::ports::repositories` | `infra::persistence::postgres` | command service / outbox relay | 支撑事件可靠发布和幂等 |
| snapshot repository | `DefinitionSnapshotRepository` | `application::ports::repositories` | `infra::persistence::postgres` | publish / query / operations service | 保存 snapshot metadata |
| projection repository | `ContentSummaryProjectionRepository`、`DefinitionTraceProjectionRepository`、`ProjectionCheckpointRepository` | `application::ports::repositories` | `infra::persistence::postgres` | query / rebuild service | 管理可重建读模型和 checkpoint |
| operations repository | `InboundDeadLetterRepository`、`JobRunRepository` | `application::ports::repositories` | `infra::persistence::postgres` | worker / operations service | 保存失败事件和 job run 状态 |
| outbound port | `GovernancePort`、`BusPublisherPort`、`ObjectStoragePort` | `application::ports::outbound` | `infra::outbound_adapters` | publish / outbox relay / snapshot service | 隔离外部系统 |
| support port | `Clock`、`IdGenerator`、`FingerprintHasher`、`FeatureFlagPort`、`ObservabilityPort` | `application::ports::support` | infra / test adapter | 全部 application service | 时间、ID、hash、开关、观测 |
| P1 repository | `MethodPluginRepository`、`MethodConfigurationRepository` | `application::ports::repositories` | `infra::persistence::postgres` | P1 service | 保存 P1 plugin / configuration |

### 7.2 调用 / 实现关系图

#### Port 关系图: application 依赖 trait,infra 实现 adapter

```text
[api handlers]
      | call service
      v
[application services]
      | use trait
      v
[application::ports]
      ^ impl
      |
[infra::persistence] + [infra::outbound_adapters]

[worker runners]
      | call service
      v
[application services]
      | use trait
      v
[application::ports]
      ^ impl
      |
[infra adapters]
```

关键说明：

- 图表达依赖倒置关系,不表达具体函数处理流。
- `application services` 只能依赖 `application::ports` trait,不能依赖 `infra::*` concrete type。
- `api handlers` 和 `worker runners` 的业务路径必须进入 application service,不得直接调用 repository 改写 truth。
- Binary bootstrap 可以装配 concrete adapter,但 handler / runner 内部不能绕过 service。

### 7.3 P0 Trait 契约表

| Trait / Port | 关键函数签名 | 返回 | 约束 |
|---|---|---|---|
| `UnitOfWork` | `begin(RequestMeta meta)` | `Result<UnitOfWorkTx, MethodLibraryError>` | 写路径必须显式开启事务 |
| `UnitOfWorkTx` | `commit()` / `rollback()` / `is_active()` | `Result<(), MethodLibraryError>` / `bool` | 不承载业务规则 |
| `MethodContentRepository` | `get_for_update(UnitOfWorkTx tx, ContentId content_id)` | `Result<Option<MethodContent>, MethodLibraryError>` | 写路径带锁读取 |
| `MethodContentRepository` | `insert(UnitOfWorkTx tx, MethodContent content)` | `Result<(), MethodLibraryError>` | 不覆盖已有 content |
| `MethodContentRepository` | `save(UnitOfWorkTx tx, MethodContent content, Revision expected_revision)` | `Result<Revision, MethodLibraryError>` | 必须校验 revision |
| `MethodContentReferenceRepository` | `replace_refs(UnitOfWorkTx tx, ContentId source_content_id, Vec<ContentRef> refs)` | `Result<(), MethodLibraryError>` | 原子替换普通引用 |
| `MethodContentReferenceRepository` | `replace_published_refs(UnitOfWorkTx tx, ContentId source_content_id, Vec<PublishedContentRef> refs)` | `Result<(), MethodLibraryError>` | publish 时固化版本和 fingerprint |
| `MethodContentVersionRepository` | `insert(UnitOfWorkTx tx, MethodContentVersionRecord record)` | `Result<(), MethodLibraryError>` | version record 不生成 fingerprint |
| `SupersedeLinkRepository` | `insert(UnitOfWorkTx tx, SupersedeLink link)` | `Result<(), MethodLibraryError>` | 不自行修改 lifecycle |
| `AuditRepository` | `append(UnitOfWorkTx tx, AuditRecord record)` | `Result<(), MethodLibraryError>` | append-only |
| `OutboxRepository` | `append(UnitOfWorkTx tx, OutboxEvent event)` | `Result<(), MethodLibraryError>` | 与 write model 同事务 |
| `OutboxRepository` | `load_pending(BatchSize limit, Timestamp now)` | `Result<Vec<OutboxEvent>, MethodLibraryError>` | 必须有批量上限 |
| `OutboxRepository` | `mark_published(OutboxEventId event_id, Timestamp now)` | `Result<(), MethodLibraryError>` | 只推进 outbox 状态 |
| `IdempotencyRepository` | `try_begin(UnitOfWorkTx tx, IdempotencyKey key, IdempotencyScope scope, RequestHash request_hash)` | `Result<IdempotencyBeginResult, MethodLibraryError>` | 同 key 不同 hash 返回冲突 |
| `DefinitionSnapshotRepository` | `insert(UnitOfWorkTx tx, DefinitionSnapshot snapshot)` | `Result<(), MethodLibraryError>` | 只保存 snapshot metadata |
| `ContentSummaryProjectionRepository` | `upsert(ContentSummaryView view)` | `Result<(), MethodLibraryError>` | 不反写 truth |
| `DefinitionTraceProjectionRepository` | `upsert(DefinitionTraceView view)` | `Result<(), MethodLibraryError>` | 不替代原始记录 |
| `ProjectionCheckpointRepository` | `advance(CheckpointName name, OutboxEventId last_processed_event_id, Timestamp now)` | `Result<(), MethodLibraryError>` | 只能推进到已处理成功位置 |
| `GovernancePort` | `validate_approved_gate(ApprovedGateRef gate_ref, ContentId content_id, ActorContext actor, RequestMeta meta)` | `Result<GateValidationResult, MethodLibraryError>` | 只校验证据,不实现治理策略 |
| `BusPublisherPort` | `publish(Topic topic, DefinitionEventEnvelope event, RequestMeta meta)` | `Result<PublishAck, MethodLibraryError>` | 只能由 relay / replay 调用 |
| `ObjectStoragePort` | `put_snapshot_payload(SnapshotPayload payload, ObjectKey object_key, RequestMeta meta)` | `Result<SnapshotBlobRef, MethodLibraryError>` | payload 不是 write model truth |
| `Clock` | `now()` | `Timestamp` | 唯一当前时间来源 |
| `IdGenerator` | `new_content_id()` / `new_outbox_event_id()` / `new_snapshot_id()` | ID newtype | 唯一 ID 来源 |
| `FingerprintHasher` | `hash_canonical_bytes(CanonicalBytes bytes, FingerprintAlgorithm algorithm)` | `Result<CanonicalFingerprint, MethodLibraryError>` | 只做 hash,不决定 canonical 字段集合 |

### 7.4 Rust Trait 契约片段

```rust
/// 管理 command、event、job 写路径中的数据库事务边界。
///
/// 该端口只负责开启、提交和回滚事务,不承载业务规则。
pub trait UnitOfWork {
    /// 开启一次事务,并绑定请求追踪元信息。
    async fn begin(&self, meta: RequestMeta) -> Result<UnitOfWorkTx, MethodLibraryError>;
}

/// 读写 MethodContent write model 的 repository port。
///
/// 实现方必须通过乐观锁保护 revision,不得在 repository 内部决定 lifecycle 迁移。
pub trait MethodContentRepository {
    /// 在事务内带锁读取 MethodContent 聚合。
    async fn get_for_update(
        &self,
        tx: &mut UnitOfWorkTx,
        content_id: ContentId,
    ) -> Result<Option<MethodContent>, MethodLibraryError>;

    /// 插入新的 MethodContent 聚合。
    async fn insert(
        &self,
        tx: &mut UnitOfWorkTx,
        content: MethodContent,
    ) -> Result<(), MethodLibraryError>;

    /// 按 expected_revision 保存 MethodContent 聚合,并返回新 revision。
    async fn save(
        &self,
        tx: &mut UnitOfWorkTx,
        content: MethodContent,
        expected_revision: Revision,
    ) -> Result<Revision, MethodLibraryError>;
}

/// 保存并推进 outbox event 状态的 repository port。
///
/// 该端口不决定业务事件是否应该产生;事件只能由 application service / factory 创建后传入。
pub trait OutboxRepository {
    /// 在同一业务事务内追加待发布事件。
    async fn append(
        &self,
        tx: &mut UnitOfWorkTx,
        event: OutboxEvent,
    ) -> Result<(), MethodLibraryError>;

    /// 加载可发布的 pending / retryable events。
    async fn load_pending(
        &self,
        limit: BatchSize,
        now: Timestamp,
    ) -> Result<Vec<OutboxEvent>, MethodLibraryError>;

    /// 标记事件已经成功发布到 L0-bus。
    async fn mark_published(
        &self,
        event_id: OutboxEventId,
        now: Timestamp,
    ) -> Result<(), MethodLibraryError>;
}

/// 隔离 L0-bus 发布协议的 outbound port。
///
/// 只能由 outbox relay 或 replay job 调用,command service 不得直接调用。
pub trait BusPublisherPort {
    /// 发布 definition event 到指定 topic。
    async fn publish(
        &self,
        topic: Topic,
        event: DefinitionEventEnvelope,
        meta: RequestMeta,
    ) -> Result<PublishAck, MethodLibraryError>;
}
```

说明：

- 上述片段是 trait 契约样式,不是完整文件内容。
- 目标实现如果需要 trait object,可用 `async_trait` 或等价方案转写。
- 所有 public trait 和 method 必须写中文 rustdoc;返回 `Result` 的 method 必须在正式代码中补 `# Errors`。

### 7.5 Adapter 实现映射

| Adapter | 实现的 Port | 建议位置 | 禁止事项 |
|---|---|---|---|
| `PostgresUnitOfWork` | `UnitOfWork` | `method_library_infra/src/persistence/postgres/unit_of_work.rs` | 不承载业务规则 |
| `PostgresMethodContentRepository` | `MethodContentRepository` | `infra::persistence::postgres` | 不实现 lifecycle 状态机 |
| `PostgresOutboxRepository` | `OutboxRepository` | `infra::persistence::postgres` | 不创建业务事件 |
| `PostgresIdempotencyRepository` | `IdempotencyRepository` | `infra::persistence::postgres` | 不替代 command handler 的幂等策略 |
| `PostgresSnapshotRepository` | `DefinitionSnapshotRepository` | `infra::persistence::postgres` | 不保存 snapshot payload 大正文 |
| `PostgresProjectionRepository` | projection repositories | `infra::persistence::postgres` | 不反写 write model |
| `GateDecisionClient` | `GovernancePort` | `method_library_infra/src/governance/gate_decision_client.rs` | 不实现 governance policy |
| `L0EventPublisher` | `BusPublisherPort` | `method_library_infra/src/bus/l0_event_publisher.rs` | 不绕过 outbox relay |
| `ObjectStorageBlobRefAdapter` | `ObjectStoragePort` | `method_library_infra/src/blob/object_storage_blob_ref.rs` | 不决定 MethodContent 状态 |
| `SystemClock` / `DeterministicClock` | `Clock` | infra / test support | 不在业务代码直接调用系统时间 |
| `UuidIdGenerator` / `DeterministicIdGenerator` | `IdGenerator` | infra / test support | 不在 handler 中临时生成裸 String ID |
| `CanonicalFingerprintHasher` | `FingerprintHasher` | infra / application support | 不决定 canonical 字段集合 |

### 7.6 P1 Port 处理

| P1 Port | 本轮处理方式 | P0 边界 |
|---|---|---|
| `MethodPluginRepository` | 保留 trait 契约位置,不进入 P0 必实现闭环 | 不读取或复制 MethodContent payload |
| `MethodConfigurationRepository` | 保留 trait 契约位置,不进入 P0 必实现闭环 | 不反向修改 MethodPlugin 或 MethodContent |
| P1 package blob port | 复用 `ObjectStoragePort.put_package_blob(...)` | P1 关闭时不影响 snapshot payload |
| P1 feature flag | 通过 `FeatureFlagPort.ensure_enabled(FeatureFlag flag)` | P1 disabled 时不得阻塞 P0 command / query / outbox |

### 7.7 Port 红线

- repository 不得实现 lifecycle 状态机。
- repository 不得发布 event 或调用 outbound port。
- outbound port 不得写本仓数据库。
- `BusPublisherPort` 不得由 command service 直接调用,必须经 outbox relay / replay job。
- `ObjectStoragePort` 不得把 payload 正文写入 `method_contents`。
- projection repository 可以清空重建,但不能作为 write model 来源。
- support port 是时间、ID、hash、feature flag、observability 的唯一入口。
- P1 repository / port 不得阻塞 P0 command / query / outbox 主链。

---

## 8. 回填草稿

可直接回填到 `03-详细设计.md` 的起草结构：

````md
### 5.x Trait / Port / Adapter 契约

#### Port 分组总览

| 分组 | Trait / Port | 定义位置 | 实现位置 | 主要调用方 | 主要责任 |
|---|---|---|---|---|---|

#### Port 关系图: application 依赖 trait,infra 实现 adapter

```text
[api handlers]
      | call service
      v
[application services]
      | use trait
      v
[application::ports]
      ^ impl
      |
[infra::persistence] + [infra::outbound_adapters]
```

关键说明：
- application service 只依赖 port trait。
- infra 只实现 adapter。
- handler / runner 不得直接调用 repository 改写 truth。

#### Trait 契约片段

```rust
/// 读写 MethodContent write model 的 repository port。
pub trait MethodContentRepository {
    /// 在事务内带锁读取 MethodContent 聚合。
    async fn get_for_update(
        &self,
        tx: &mut UnitOfWorkTx,
        content_id: ContentId,
    ) -> Result<Option<MethodContent>, MethodLibraryError>;
}
```

#### Adapter 实现映射

| Adapter | 实现的 Port | 建议位置 | 禁止事项 |
|---|---|---|---|
````

同步写入 §6 全局索引：

```md
### 6.x Trait / Port 索引

| Trait / Port | 类型 | 定义位置 | 实现位置 | 展开章节 |
|---|---|---|---|---|
```

---

## 9. 待确认事项

- `UnitOfWorkTx` 在正式 Rust 代码中是 concrete transaction wrapper、trait object,还是泛型事务上下文,需要目标实现仓结合数据库库选择。
- 是否第一版即实现 P1 `MethodPluginRepository` / `MethodConfigurationRepository`,还是只在正式文档保留 P1 索引。
- API binary bootstrap 是否允许直接依赖 infra crate 做依赖装配;建议允许 bootstrap wiring,但禁止 handler 业务逻辑直接调用 infra。

---

## 10. 进入下一步条件

- port 分组和定义位置已经确认。
- repository / outbound / support port 的调用方与实现方已经确认。
- 关键 trait 函数签名、参数类型、返回类型和错误类型已经确认。
- adapter 映射已经确认。
- handler / worker 不绕过 application service 的红线已经确认。
- 可以进入 Step 8 定义 API / Command / Query / Event / Job 协议契约。
