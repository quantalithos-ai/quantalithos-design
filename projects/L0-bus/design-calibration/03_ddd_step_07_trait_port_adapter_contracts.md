# Step 7. 逐模块定义 Trait / Port / Adapter 契约

## 1. Step 状态

- 状态：[x] 已确认
- 所属文档：`projects/L0-bus/03-详细设计.md`
- 本步目标：定义 L0-bus 各模块的 trait / port / adapter 契约，明确实现方、调用方、函数签名、参数类型、返回类型和错误类型。
- 本步不直接修改正式 `03-详细设计.md`，只形成中间产物。

---

## 2. 本步输入

| 输入 | 关键结论 | 本步使用方式 |
|---|---|---|
| `standards/document/详细设计讨论流程_SOP.md` Step 7 | 必须输出 Trait / Port / Adapter 契约表、trait Rust 契约片段、实现方 / 调用方关系表 | 约束本文件结构 |
| `standards/document/详细设计书写规范.md` §5.5 / §5.6 | trait 必须给出参数类型、返回类型、错误类型，且按模块回填 | 约束正式文档回填格式 |
| `projects/L0-bus/design-calibration/03_ddd_step_05_module_contracts_axis.md` | 已确认 `contracts / domain / application / infra / api / worker / jobs` 模块主轴 | 决定 trait 定义位置和实现位置 |
| `projects/L0-bus/design-calibration/03_ddd_step_06_object_contracts.md` | 已确认 domain 对象和状态 enum | 决定 repository / port 的参数对象 |
| `projects/L0-bus/02-概要设计.md` §7.8 / §8 | 已确认 repository、transport port、outbox port、处理流引用的接缝 | 决定 port 名称和函数族 |
| `projects/L0-bus/01-架构设计.md` | 已确认依赖方向和事件 / 调用边界 | 约束 application 只能依赖 trait，不能依赖 infra 实现 |

---

## 3. SOP 问题回答

### 3.1 哪些模块需要定义 trait / port？

| 模块 | 是否定义 trait / port | 原因 |
|---|---|---|
| `contracts` | 否 | 只定义跨入口 / 跨仓 DTO、Event、Job、View，不定义行为 trait |
| `domain` | 否 | 只定义领域对象、状态、policy 和领域错误，不定义外部依赖 port |
| `application` | 是 | 定义 repository、transport、outbox、time、id、unit of work 等边界 trait |
| `infra` | 不定义业务 port，定义 adapter 实现 | 实现 application trait，并负责 wiring、config、in-memory default path |
| `api` | 不定义 port | 只调用 application service，不直接持有 repository / backend adapter |
| `worker` | 不定义 port | 只调用 application service 或 runner，不直接调用 infra 细节 |
| `jobs` | 不定义 port | 一次性 job 入口只复用 application service 和 infra runtime |

### 3.2 哪些模块负责实现这些 trait / port？

| trait / port 类别 | 定义模块 | 默认实现模块 | 说明 |
|---|---|---|---|
| repository trait | `application` | `infra` | P0 提供 in-memory default path，后续可追加 durable store adapter |
| outbox fact source port | `application` | `infra` | 从 L0-core 已提交 outbox fact 或本地测试源读取 |
| outbound event publisher port | `application` | `infra` | 将本仓已提交事实发布到外部 event bus 或测试 sink |
| transport backend port | `application` | `infra` | 屏蔽 MQ / backend 差异，只暴露 bus 平台语义 |
| technical port | `application` | `infra` | 时间、ID、事务边界和 cursor/checkpoint 基础能力 |

### 3.3 repository、outbox、projection、external client 的函数签名是什么？

本步在 §7.3~§7.6 给出 Rust 契约片段。函数签名只固定实现需要的参数类型、返回类型和错误类型；完整 DTO / request / response JSON 或 proto 留给 Step 8。

### 3.4 每个 trait 函数的参数类型、返回类型、错误类型是什么？

本步采用以下写法：

```rust
/// <trait 作用说明>
pub trait ExamplePort {
    /// <函数作用说明>
    async fn run(&self, input: InputType, actor: ActorContext) -> Result<OutputType, PortError>;
}
```

参数必须写成 `参数名: 类型名`，返回必须写 `Result<返回类型, 错误类型>`。如果函数不返回业务值，使用 `Result<(), 错误类型>`。

### 3.5 哪些依赖只能通过 trait 访问，不能直接跨层调用？

```text
api / worker / jobs
  |
  v
application service
  |
  v
application trait / port
  |
  v
infra adapter implementation
  |
  v
store / backend / event bus / clock / id generator
```

关键说明：

- `application` 不允许依赖 `infra`，只能依赖本模块定义的 trait。
- `api / worker / jobs` 不允许绕过 application service 直接调用 repository 或 backend adapter。
- `domain` 不允许依赖任何 repository、port、adapter、config 或 runtime builder。
- 具体数据库、MQ、event bus SDK 只能出现在 `infra` adapter 内。

---

## 4. 当前文档问题诊断

| 问题 | 影响 | 本步处理 |
|---|---|---|
| 旧版详细设计仍围绕 envelope / routing / callback schema 等旧口径 | 与新版 publication / delivery / feedback / recovery 主线不一致 | 不复用旧接口名，直接承接新版概要设计 |
| 概要设计同时出现 `FeedbackRepository`、`IdempotencyRepository`、`DeadLetterRepository`、`RecoveryRepository` 等名称 | 实现时容易拆分过细或职责重叠 | 本步给出 canonical port 名称和归属 |
| `BusStorePort` 在概要设计中作为持久化边界出现，但 Step 7 未区分 application port 与 infra store adapter | 可能导致 application 同时依赖 repository 和 generic store | 本步把 application 对外使用的持久化边界收敛为 repository trait，generic store 细节后移 Step 11 |
| `TransportBackendPort` 只在概要设计中作为边界名出现 | 实现者不知道 dispatch、signal normalize、capability check 如何拆函数 | 本步补齐关键函数 |
| `OutboxFactSourcePort` 和 `OutboxPublisherPort` 的方向不同 | 容易把 core outbox 消费与本仓 outbound event 发布混在一起 | 本步分成 source port 与 publisher port |

---

## 5. 改动前后对比

| 维度 | 改动前 | 改动后 |
|---|---|---|
| port 定义位置 | 概要设计只列边界名 | 明确全部 trait 定义在 `crates/application` |
| adapter 实现位置 | 只说由 infra 实现 | 明确 `crates/infra` 提供 in-memory / source / publisher / backend / technical adapter |
| repository 粒度 | `FeedbackRepository`、`IdempotencyRepository`、`DeadLetterRepository`、`RecoveryRepository` 名称并存 | 保留 `FeedbackRepository` 和 `IdempotencyRepository`，将 retry / DLQ / replay 收敛进 `RecoveryRepository` |
| generic store | `BusStorePort` 与 repository 并列出现 | application 不直接使用 `BusStorePort`，store backend 留给 Step 11 的 infra 持久化契约 |
| 函数签名 | 处理流中只出现函数名 | 本步给出参数类型、返回类型和错误类型 |
| 跨层调用 | 只描述方向 | 明确哪些调用必须经 trait，哪些调用被禁止 |

---

## 6. 设计取舍

### 6.1 repository 是否按业务对象拆分

| 方案 | 说明 | 结论 |
|---|---|---|
| 方案 A：每个 domain object 一个 repository | `PublicationAcceptanceRepository`、`DeliveryRecordRepository`、`RetryPlanRepository` 等全拆 | 不采用，接口数量过多，处理流会被存储细节淹没 |
| 方案 B：按 bus truth 聚合边界拆分 | publication、delivery、feedback、idempotency、recovery、audit、projection | 推荐，能贴合主要处理流和事务边界 |
| 方案 C：只保留一个 `BusStorePort` | 所有读写通过 generic store | 不采用，会隐藏业务语义，难以表达 optimistic locking 和只读 projection 边界 |

推荐方案 B。它既保留了 implementation 需要的清晰函数，也不会把每个领域对象都升级成独立 repository。

### 6.2 `DeadLetterRepository` 是否独立存在

| 方案 | 说明 | 结论 |
|---|---|---|
| 方案 A：独立 `DeadLetterRepository` | 专门保存 DLQ | 不采用，DLQ 与 retry、replay、failure material 在恢复闭环中强相关 |
| 方案 B：合并到 `RecoveryRepository` | 统一管理 retry plan、dead letter、replay preparation、failure material | 推荐 |

推荐方案 B。`DeadLetterEntry` 仍是独立 domain object，但持久化入口归入 `RecoveryRepository`，避免恢复链路被拆碎。

### 6.3 `BusStorePort` 是否保留为 application trait

| 方案 | 说明 | 结论 |
|---|---|---|
| 方案 A：application service 直接调用 `BusStorePort` | repository 之下再暴露 generic store | 不采用，会让 use case 依赖底层存储抽象 |
| 方案 B：application 只调用 repository trait，`BusStorePort` 作为 infra 内部 store adapter 或 Step 11 细化项 | repository 是 application port，store 是 infra 持久化实现细节 | 推荐 |

推荐方案 B。正式文档可以保留 `BusStorePort` 作为 infra 持久化能力说明，但不要让 application service 直接使用它。

### 6.4 `OutboxFactSourcePort` 与 `OutboxPublisherPort` 是否合并

| 方案 | 说明 | 结论 |
|---|---|---|
| 方案 A：合并成 `OutboxPort` | 一个接口同时读取 core outbox 和发布 bus event | 不采用，方向和一致性语义不同 |
| 方案 B：拆成 source port 与 publisher port | source 消费上游已提交事实，publisher 发布本仓已提交事实 | 推荐 |

推荐方案 B。这样能避免把“输入事实来源”和“输出事件发布”混为同一个能力。

---

## 7. 结构化中间产物

### 7.1 Trait / Port / Adapter 总览

| 名称 | 类型 | 定义位置 | 默认实现位置 | 作用 | 关键函数 |
|---|---|---|---|---|---|
| `PublicationRepository` | repository port | `crates/application/src/ports/publication.rs` | `crates/infra/src/repositories/publication_memory.rs` | 保存和读取发布接入事实 | `insert` / `get` / `get_for_update` |
| `DeliveryRepository` | repository port | `crates/application/src/ports/delivery.rs` | `crates/infra/src/repositories/delivery_memory.rs` | 保存 delivery、attempt 和 history 相关 truth | `get_for_update` / `save` / `find_schedulable` / `scan_truth` |
| `FeedbackRepository` | repository port | `crates/application/src/ports/feedback.rs` | `crates/infra/src/repositories/feedback_memory.rs` | 保存 feedback result 和失败查询材料 | `insert` / `find_by_delivery` / `get_failure` |
| `IdempotencyRepository` | repository port | `crates/application/src/ports/idempotency.rs` | `crates/infra/src/repositories/idempotency_memory.rs` | 保存和查询 bus 幂等锚点 | `find` / `bind` / `mark_conflict` |
| `RecoveryRepository` | repository port | `crates/application/src/ports/recovery.rs` | `crates/infra/src/repositories/recovery_memory.rs` | 保存 retry、DLQ、replay 和 failure material | `save_retry_plan` / `find_due_retry` / `save_dead_letter` / `save_replay_preparation` |
| `AuditTrailRepository` | repository port | `crates/application/src/ports/audit.rs` | `crates/infra/src/repositories/audit_memory.rs` | append-only 保存审计、history 和 audit chain | `append` / `scan_committed` / `list` / `load_chain` |
| `ReadProjectionRepository` | repository port | `crates/application/src/ports/projection.rs` | `crates/infra/src/repositories/projection_memory.rs` | 保存和读取 transport / failure / backend health 只读投影 | `upsert_transport_view` / `get_transport_view` / `replace_batch` |
| `OutboxFactSourcePort` | inbound source port | `crates/application/src/ports/outbox_source.rs` | `crates/infra/src/outbox/core_source_memory.rs` | 读取 L0-core 已提交 outbox fact | `poll_committed` / `ack_consumed` |
| `OutboxPublisherPort` | outbound publisher port | `crates/application/src/ports/outbox_publisher.rs` | `crates/infra/src/outbox/publisher_memory.rs` | 发布本仓已提交 bus fact / projection event | `publish` / `publish_batch` |
| `TransportBackendPort` | outbound backend port | `crates/application/src/ports/transport.rs` | `crates/infra/src/transport/in_memory_backend.rs` | 映射平台传递语义到后端投递能力 | `dispatch` / `normalize_signal` / `check_capability` |
| `UnitOfWork` | technical port | `crates/application/src/ports/unit_of_work.rs` | `crates/infra/src/uow/memory_unit_of_work.rs` | 管理写路径事务边界 | `begin` / `commit` / `rollback` |
| `ClockPort` | technical port | `crates/application/src/ports/clock.rs` | `crates/infra/src/time/system_clock.rs` | 提供可替换时间来源 | `now` |
| `IdGeneratorPort` | technical port | `crates/application/src/ports/id_generator.rs` | `crates/infra/src/id/uuid_generator.rs` | 生成 bus 内部 record id | `next_record_id` |

### 7.2 模块间 trait 调用图

```text
api / worker / jobs
  |
  v
application services
  |
  +-- PublicationRepository
  +-- DeliveryRepository
  +-- FeedbackRepository
  +-- IdempotencyRepository
  +-- RecoveryRepository
  +-- AuditTrailRepository
  +-- ReadProjectionRepository
  +-- OutboxFactSourcePort
  +-- OutboxPublisherPort
  +-- TransportBackendPort
  +-- UnitOfWork / ClockPort / IdGeneratorPort
  |
  v
infra adapters
  |
  +-- in-memory store / future durable store
  +-- core outbox source adapter
  +-- event publisher adapter
  +-- transport backend adapter
  +-- system clock / id generator
```

关键说明：

- `application services` 只依赖 trait，不依赖 `infra adapters` 具体类型。
- `infra adapters` 可以依赖 `application` 中的 trait definition，但不能反向调用 `api / worker / jobs`。
- `domain` 不出现在图中，是因为 domain 只被 application 调用，不感知 port。
- in-memory adapter 是 P0 默认实现，不阻止后续 durable store / MQ adapter 扩展。

### 7.3 `application` 模块:repository port 契约

#### `PublicationRepository`

| 项 | 内容 |
|---|---|
| 类型 | repository port |
| 定义位置 | `crates/application/src/ports/publication.rs` |
| 调用方 | `PublicationAcceptanceService`、`OutboxRelayService` |
| 实现方 | `InMemoryPublicationRepository`，后续 durable adapter |
| 事务要求 | 写入必须发生在 `UnitOfWorkHandle` 绑定的写事务内 |

```rust
/// 发布接入事实仓储端口。
///
/// 用于保存和读取 `PublicationAcceptance`，并以 `Version` 支撑乐观并发控制。
pub trait PublicationRepository {
    /// 插入一条新的发布接入事实。
    async fn insert(
        &self,
        acceptance: PublicationAcceptance,
        uow: UnitOfWorkHandle,
    ) -> Result<Version, RepositoryError>;

    /// 按发布记录 ID 读取接入事实。
    async fn get(
        &self,
        publication_id: PublicationId,
    ) -> Result<Option<PublicationAcceptance>, RepositoryError>;

    /// 在写事务中锁定并读取接入事实。
    async fn get_for_update(
        &self,
        publication_id: PublicationId,
        uow: UnitOfWorkHandle,
    ) -> Result<Option<PublicationAcceptance>, RepositoryError>;
}
```

| 函数签名 | 作用 | 参数说明 | 返回 | 错误类型 |
|---|---|---|---|---|
| `insert(acceptance: PublicationAcceptance, uow: UnitOfWorkHandle)` | 保存新接入事实 | `acceptance` 是领域对象；`uow` 是事务句柄 | `Version` | `RepositoryError` |
| `get(publication_id: PublicationId)` | 只读查询接入事实 | `publication_id` 是发布记录 ID | `Option<PublicationAcceptance>` | `RepositoryError` |
| `get_for_update(publication_id: PublicationId, uow: UnitOfWorkHandle)` | 写事务内读取并锁定 | `uow` 绑定当前事务 | `Option<PublicationAcceptance>` | `RepositoryError` |

#### `DeliveryRepository`

| 项 | 内容 |
|---|---|
| 类型 | repository port |
| 定义位置 | `crates/application/src/ports/delivery.rs` |
| 调用方 | `DeliveryProgressionService`、`FeedbackRecordingService`、`RecoveryOrchestrationService`、`ProjectionRebuildService` |
| 实现方 | `InMemoryDeliveryRepository`，后续 durable adapter |
| 事务要求 | `save` 必须带 `expected_version`，状态推进必须可审计 |

```rust
/// Delivery 真相仓储端口。
///
/// 用于读取、锁定、保存和扫描 `DeliveryRecord`，不直接调用后端投递 SDK。
pub trait DeliveryRepository {
    /// 在写事务中锁定并读取 delivery。
    async fn get_for_update(
        &self,
        delivery_id: DeliveryId,
        uow: UnitOfWorkHandle,
    ) -> Result<Option<DeliveryRecord>, RepositoryError>;

    /// 保存 delivery 当前真相。
    async fn save(
        &self,
        delivery: DeliveryRecord,
        expected_version: Version,
        uow: UnitOfWorkHandle,
    ) -> Result<Version, RepositoryError>;

    /// 扫描可推进的 delivery。
    async fn find_schedulable(
        &self,
        cursor: DeliveryScanCursor,
        limit: PageLimit,
    ) -> Result<Vec<DeliveryRecord>, RepositoryError>;

    /// 扫描 truth，用于只读投影重建。
    async fn scan_truth(
        &self,
        cursor: TruthScanCursor,
        limit: PageLimit,
    ) -> Result<TruthScanPage<DeliveryRecord>, RepositoryError>;

    /// 读取 delivery history。
    async fn load_history(
        &self,
        delivery_id: DeliveryId,
        page: PageRequest,
    ) -> Result<DeliveryHistoryPage, RepositoryError>;
}
```

| 函数签名 | 作用 | 参数说明 | 返回 | 错误类型 |
|---|---|---|---|---|
| `get_for_update(delivery_id: DeliveryId, uow: UnitOfWorkHandle)` | 写路径读取并锁定 delivery | `delivery_id` 是 delivery ID | `Option<DeliveryRecord>` | `RepositoryError` |
| `save(delivery: DeliveryRecord, expected_version: Version, uow: UnitOfWorkHandle)` | 保存 delivery truth | `expected_version` 防止并发覆盖 | `Version` | `RepositoryError` |
| `find_schedulable(cursor: DeliveryScanCursor, limit: PageLimit)` | 扫描待推进 delivery | `cursor` 是扫描游标 | `Vec<DeliveryRecord>` | `RepositoryError` |
| `scan_truth(cursor: TruthScanCursor, limit: PageLimit)` | 扫描 truth 用于 projection rebuild | `limit` 是批大小 | `TruthScanPage<DeliveryRecord>` | `RepositoryError` |
| `load_history(delivery_id: DeliveryId, page: PageRequest)` | 查询 delivery 历史 | `page` 是分页参数 | `DeliveryHistoryPage` | `RepositoryError` |

#### `FeedbackRepository`

| 项 | 内容 |
|---|---|
| 类型 | repository port |
| 定义位置 | `crates/application/src/ports/feedback.rs` |
| 调用方 | `FeedbackRecordingService`、`RecoveryOrchestrationService` |
| 实现方 | `InMemoryFeedbackRepository`，后续 durable adapter |
| 事务要求 | feedback 写入必须与 idempotency anchor、history、audit 在同一提交边界内协调 |

```rust
/// Feedback 结果仓储端口。
///
/// 用于保存 bus 级反馈结果，并为恢复流程提供失败材料入口。
pub trait FeedbackRepository {
    /// 插入一条 feedback result。
    async fn insert(
        &self,
        feedback: FeedbackResult,
        uow: UnitOfWorkHandle,
    ) -> Result<Version, RepositoryError>;

    /// 按 delivery ID 查询 feedback。
    async fn find_by_delivery(
        &self,
        delivery_id: DeliveryId,
        page: PageRequest,
    ) -> Result<FeedbackResultPage, RepositoryError>;

    /// 获取可用于恢复判断的失败 feedback。
    async fn get_failure(
        &self,
        delivery_id: DeliveryId,
    ) -> Result<Option<FeedbackResult>, RepositoryError>;
}
```

| 函数签名 | 作用 | 参数说明 | 返回 | 错误类型 |
|---|---|---|---|---|
| `insert(feedback: FeedbackResult, uow: UnitOfWorkHandle)` | 保存反馈结果 | `feedback` 是 bus 级结果，不是业务补偿结论 | `Version` | `RepositoryError` |
| `find_by_delivery(delivery_id: DeliveryId, page: PageRequest)` | 分页读取 feedback | `page` 是分页参数 | `FeedbackResultPage` | `RepositoryError` |
| `get_failure(delivery_id: DeliveryId)` | 为 DLQ / replay 获取失败材料入口 | `delivery_id` 是 delivery ID | `Option<FeedbackResult>` | `RepositoryError` |

#### `IdempotencyRepository`

| 项 | 内容 |
|---|---|
| 类型 | repository port |
| 定义位置 | `crates/application/src/ports/idempotency.rs` |
| 调用方 | 所有 Command / Event Consumer 写路径 |
| 实现方 | `InMemoryIdempotencyRepository`，后续 durable adapter |
| 事务要求 | `bind` 必须与业务 truth 写入保持同一提交边界或可恢复一致 |

```rust
/// 幂等锚点仓储端口。
///
/// 用于保存和查询 `IdempotencyAnchor`，避免重复事件或重复命令反复改写真相。
pub trait IdempotencyRepository {
    /// 查询已有幂等锚点。
    async fn find(
        &self,
        scope: IdempotencyScope,
        key: IdempotencyKey,
    ) -> Result<Option<IdempotencyAnchor>, RepositoryError>;

    /// 绑定新的幂等锚点。
    async fn bind(
        &self,
        anchor: IdempotencyAnchor,
        uow: UnitOfWorkHandle,
    ) -> Result<(), RepositoryError>;

    /// 记录幂等冲突。
    async fn mark_conflict(
        &self,
        scope: IdempotencyScope,
        key: IdempotencyKey,
        conflict: IdempotencyConflict,
        uow: UnitOfWorkHandle,
    ) -> Result<(), RepositoryError>;
}
```

| 函数签名 | 作用 | 参数说明 | 返回 | 错误类型 |
|---|---|---|---|---|
| `find(scope: IdempotencyScope, key: IdempotencyKey)` | 查询重复请求或重复事件 | `scope` 限定幂等范围 | `Option<IdempotencyAnchor>` | `RepositoryError` |
| `bind(anchor: IdempotencyAnchor, uow: UnitOfWorkHandle)` | 写入新的锚点 | `anchor` 指向本地 record ref | `()` | `RepositoryError` |
| `mark_conflict(scope: IdempotencyScope, key: IdempotencyKey, conflict: IdempotencyConflict, uow: UnitOfWorkHandle)` | 记录同 key 不同内容冲突 | `conflict` 是冲突摘要，不含 payload body | `()` | `RepositoryError` |

#### `RecoveryRepository`

| 项 | 内容 |
|---|---|
| 类型 | repository port |
| 定义位置 | `crates/application/src/ports/recovery.rs` |
| 调用方 | `RecoveryOrchestrationService`、`ReplayPreparationService`、`RetryWorkerService` |
| 实现方 | `InMemoryRecoveryRepository`，后续 durable adapter |
| 事务要求 | retry、DLQ、replay preparation 和 failure material 必须保留可审计引用链 |

```rust
/// 恢复闭环仓储端口。
///
/// 统一保存 retry plan、dead letter、replay preparation 和 failure material。
pub trait RecoveryRepository {
    /// 保存 retry plan。
    async fn save_retry_plan(
        &self,
        retry_plan: RetryPlan,
        expected_version: Option<Version>,
        uow: UnitOfWorkHandle,
    ) -> Result<Version, RepositoryError>;

    /// 查找到期可执行的 retry plan。
    async fn find_due_retry(
        &self,
        cursor: RetryScanCursor,
        limit: PageLimit,
        now: Timestamp,
    ) -> Result<Vec<RetryPlan>, RepositoryError>;

    /// 保存 dead letter entry。
    async fn save_dead_letter(
        &self,
        entry: DeadLetterEntry,
        material: FailureMaterial,
        uow: UnitOfWorkHandle,
    ) -> Result<Version, RepositoryError>;

    /// 按 ID 读取 dead letter entry。
    async fn get_dead_letter(
        &self,
        dead_letter_id: DeadLetterId,
    ) -> Result<Option<DeadLetterEntry>, RepositoryError>;

    /// 保存 replay preparation。
    async fn save_replay_preparation(
        &self,
        preparation: ReplayPreparation,
        uow: UnitOfWorkHandle,
    ) -> Result<Version, RepositoryError>;

    /// 读取 failure material。
    async fn get_failure_material(
        &self,
        failure_material_id: FailureMaterialId,
    ) -> Result<Option<FailureMaterial>, RepositoryError>;
}
```

| 函数签名 | 作用 | 参数说明 | 返回 | 错误类型 |
|---|---|---|---|---|
| `save_retry_plan(retry_plan: RetryPlan, expected_version: Option<Version>, uow: UnitOfWorkHandle)` | 创建或更新 retry plan | `expected_version` 为 `None` 时表示新建 | `Version` | `RepositoryError` |
| `find_due_retry(cursor: RetryScanCursor, limit: PageLimit, now: Timestamp)` | 扫描到期 retry | `now` 来自 `ClockPort` | `Vec<RetryPlan>` | `RepositoryError` |
| `save_dead_letter(entry: DeadLetterEntry, material: FailureMaterial, uow: UnitOfWorkHandle)` | 保存 DLQ 与失败材料 | `material` 只保存 bus 失败材料 | `Version` | `RepositoryError` |
| `get_dead_letter(dead_letter_id: DeadLetterId)` | 读取 DLQ | `dead_letter_id` 是 DLQ ID | `Option<DeadLetterEntry>` | `RepositoryError` |
| `save_replay_preparation(preparation: ReplayPreparation, uow: UnitOfWorkHandle)` | 保存 replay 前置材料 | `preparation` 不代表 replay 已执行 | `Version` | `RepositoryError` |
| `get_failure_material(failure_material_id: FailureMaterialId)` | 读取失败材料 | 返回材料引用和摘要，不含 payload body | `Option<FailureMaterial>` | `RepositoryError` |

#### `AuditTrailRepository`

| 项 | 内容 |
|---|---|
| 类型 | repository port |
| 定义位置 | `crates/application/src/ports/audit.rs` |
| 调用方 | 所有写路径、projection job、query service |
| 实现方 | `InMemoryAuditTrailRepository`，后续 durable adapter |
| 事务要求 | `append` 只能追加，不允许覆盖或删除 |

```rust
/// Bus 审计轨迹仓储端口。
///
/// 以 append-only 方式保存 `BusAuditEntry`，同时支撑 audit chain 和 projection scan。
pub trait AuditTrailRepository {
    /// 追加一条审计记录。
    async fn append(
        &self,
        entry: BusAuditEntry,
        uow: UnitOfWorkHandle,
    ) -> Result<AuditSequence, RepositoryError>;

    /// 扫描已提交审计记录。
    async fn scan_committed(
        &self,
        cursor: AuditCursor,
        limit: PageLimit,
    ) -> Result<AuditScanPage, RepositoryError>;

    /// 按过滤条件分页查询审计记录。
    async fn list(
        &self,
        filter: AuditFilter,
        page: PageRequest,
    ) -> Result<BusAuditTrailView, RepositoryError>;

    /// 读取审计链。
    async fn load_chain(
        &self,
        chain_ref: AuditChainRef,
    ) -> Result<AuditChain, RepositoryError>;
}
```

| 函数签名 | 作用 | 参数说明 | 返回 | 错误类型 |
|---|---|---|---|---|
| `append(entry: BusAuditEntry, uow: UnitOfWorkHandle)` | 追加审计记录 | `entry` 是 append-only 事实 | `AuditSequence` | `RepositoryError` |
| `scan_committed(cursor: AuditCursor, limit: PageLimit)` | 给 projection job 扫描已提交记录 | `cursor` 是审计游标 | `AuditScanPage` | `RepositoryError` |
| `list(filter: AuditFilter, page: PageRequest)` | 查询审计视图 | `filter` 是查询条件 | `BusAuditTrailView` | `RepositoryError` |
| `load_chain(chain_ref: AuditChainRef)` | 加载 replay 前置审计链 | `chain_ref` 是审计链引用 | `AuditChain` | `RepositoryError` |

#### `ReadProjectionRepository`

| 项 | 内容 |
|---|---|
| 类型 | repository port |
| 定义位置 | `crates/application/src/ports/projection.rs` |
| 调用方 | `ReadOutputService`、`ProjectionRebuildService`、query service |
| 实现方 | `InMemoryReadProjectionRepository`，后续 durable adapter |
| 事务要求 | projection 不反写真相，replace batch 必须可审计 |

```rust
/// 只读投影仓储端口。
///
/// 保存 transport view、failure summary 和 backend health view，禁止修改 bus truth。
pub trait ReadProjectionRepository {
    /// 写入或更新 transport view projection。
    async fn upsert_transport_view(
        &self,
        projection: TransportViewProjection,
        uow: UnitOfWorkHandle,
    ) -> Result<ProjectionVersion, RepositoryError>;

    /// 写入或更新 failure summary projection。
    async fn upsert_failure_summary(
        &self,
        projection: FailureSummaryProjection,
        uow: UnitOfWorkHandle,
    ) -> Result<ProjectionVersion, RepositoryError>;

    /// 写入或更新 backend health view。
    async fn upsert_backend_health(
        &self,
        view: BackendHealthView,
        uow: UnitOfWorkHandle,
    ) -> Result<ProjectionVersion, RepositoryError>;

    /// 读取 transport view。
    async fn get_transport_view(
        &self,
        key: ProjectionKey,
    ) -> Result<Option<TransportView>, RepositoryError>;

    /// 读取 failure summary。
    async fn get_failure_summary(
        &self,
        key: ProjectionKey,
    ) -> Result<Option<FailureSummaryView>, RepositoryError>;

    /// 用批次替换 projection，用于受控重建。
    async fn replace_batch(
        &self,
        batch: ProjectionBatch,
        uow: UnitOfWorkHandle,
    ) -> Result<ProjectionReplaceReceipt, RepositoryError>;
}
```

| 函数签名 | 作用 | 参数说明 | 返回 | 错误类型 |
|---|---|---|---|---|
| `upsert_transport_view(projection: TransportViewProjection, uow: UnitOfWorkHandle)` | 写 transport 只读视图 | `projection` 从 truth / audit 派生 | `ProjectionVersion` | `RepositoryError` |
| `upsert_failure_summary(projection: FailureSummaryProjection, uow: UnitOfWorkHandle)` | 写 failure summary | 不得生成 governance decision | `ProjectionVersion` | `RepositoryError` |
| `upsert_backend_health(view: BackendHealthView, uow: UnitOfWorkHandle)` | 写 backend health view | `view` 不包含 secret | `ProjectionVersion` | `RepositoryError` |
| `get_transport_view(key: ProjectionKey)` | 查询 transport view | `key` 是 projection key | `Option<TransportView>` | `RepositoryError` |
| `get_failure_summary(key: ProjectionKey)` | 查询失败摘要 | 返回只读摘要 | `Option<FailureSummaryView>` | `RepositoryError` |
| `replace_batch(batch: ProjectionBatch, uow: UnitOfWorkHandle)` | projection rebuild 批量替换 | `batch` 是受控重建批次 | `ProjectionReplaceReceipt` | `RepositoryError` |

### 7.4 `application` 模块:source / publisher / backend port 契约

#### `OutboxFactSourcePort`

| 项 | 内容 |
|---|---|
| 类型 | inbound source port |
| 定义位置 | `crates/application/src/ports/outbox_source.rs` |
| 调用方 | `OutboxRelayService`、`RunOutboxRelay` |
| 实现方 | `CoreOutboxFactSourceAdapter`、`InMemoryOutboxFactSourceAdapter` |
| 边界 | 只能读取 L0-core 已提交 fact，不读取业务 payload body |

```rust
/// 上游已提交 outbox fact 来源端口。
///
/// 用于从 L0-core outbox 或测试源读取已提交事实，驱动 bus publication acceptance。
pub trait OutboxFactSourcePort {
    /// 拉取一批已提交 outbox fact。
    async fn poll_committed(
        &self,
        cursor: OutboxCursor,
        limit: PageLimit,
    ) -> Result<CommittedOutboxFactPage, SourcePortError>;

    /// 标记 fact 已被 bus 消费。
    async fn ack_consumed(
        &self,
        fact_ref: CommittedOutboxFactRef,
        marker: ConsumerMarker,
    ) -> Result<(), SourcePortError>;
}
```

| 函数签名 | 作用 | 参数说明 | 返回 | 错误类型 |
|---|---|---|---|---|
| `poll_committed(cursor: OutboxCursor, limit: PageLimit)` | 拉取已提交 fact | `cursor` 是上游 outbox 游标 | `CommittedOutboxFactPage` | `SourcePortError` |
| `ack_consumed(fact_ref: CommittedOutboxFactRef, marker: ConsumerMarker)` | 标记已消费 | `marker` 是 bus consumer 标识 | `()` | `SourcePortError` |

#### `OutboxPublisherPort`

| 项 | 内容 |
|---|---|
| 类型 | outbound publisher port |
| 定义位置 | `crates/application/src/ports/outbox_publisher.rs` |
| 调用方 | `OutboxPublisherService`、写路径提交后事件发布流程 |
| 实现方 | `InMemoryOutboxPublisherAdapter`，后续 event bus adapter |
| 边界 | 只能发布本仓已提交事实或只读材料，不携带 payload body |

```rust
/// 本仓 outbound event 发布端口。
///
/// 用于发布 bus 已提交事实或只读投影更新事件，禁止携带业务 payload 正文。
pub trait OutboxPublisherPort {
    /// 发布单个 outbound event。
    async fn publish(
        &self,
        event: BusOutboundEvent,
        trace: TraceContextRef,
    ) -> Result<PublishReceipt, PublisherPortError>;

    /// 批量发布 outbound event。
    async fn publish_batch(
        &self,
        batch: BusOutboundEventBatch,
        trace: TraceContextRef,
    ) -> Result<PublishBatchReceipt, PublisherPortError>;
}
```

| 函数签名 | 作用 | 参数说明 | 返回 | 错误类型 |
|---|---|---|---|---|
| `publish(event: BusOutboundEvent, trace: TraceContextRef)` | 发布单个事件 | `event` 来自已提交 bus fact | `PublishReceipt` | `PublisherPortError` |
| `publish_batch(batch: BusOutboundEventBatch, trace: TraceContextRef)` | 批量发布事件 | `batch` 是待发布事件批次 | `PublishBatchReceipt` | `PublisherPortError` |

#### `TransportBackendPort`

| 项 | 内容 |
|---|---|
| 类型 | outbound backend port |
| 定义位置 | `crates/application/src/ports/transport.rs` |
| 调用方 | `DeliveryProgressionService`、`RetryWorkerService`、`BackendCapabilityService` |
| 实现方 | `InMemoryTransportBackendAdapter`，后续 MQ adapter |
| 边界 | 只接收 `TransportSemantic` 和 bus attempt，不暴露后端私有参数 |

```rust
/// 传输后端能力端口。
///
/// 用于把 bus 平台级传递语义映射到具体后端投递能力，并归一化后端返回。
pub trait TransportBackendPort {
    /// 执行一次后端投递。
    async fn dispatch(
        &self,
        semantic: TransportSemantic,
        attempt: DeliveryAttempt,
        context: BackendDispatchContext,
    ) -> Result<BackendDeliveryResult, TransportPortError>;

    /// 归一化后端 delivery signal。
    async fn normalize_signal(
        &self,
        signal: BackendDeliverySignal,
        capability_ref: BackendCapabilityRef,
    ) -> Result<BackendDeliveryResult, TransportPortError>;

    /// 检查后端能力。
    async fn check_capability(
        &self,
        capability_ref: BackendCapabilityRef,
    ) -> Result<BackendCapabilityReport, TransportPortError>;
}
```

| 函数签名 | 作用 | 参数说明 | 返回 | 错误类型 |
|---|---|---|---|---|
| `dispatch(semantic: TransportSemantic, attempt: DeliveryAttempt, context: BackendDispatchContext)` | 执行投递 | `semantic` 是平台语义；`attempt` 是本次尝试 | `BackendDeliveryResult` | `TransportPortError` |
| `normalize_signal(signal: BackendDeliverySignal, capability_ref: BackendCapabilityRef)` | 把后端信号归一化为 bus 结果 | `signal` 是后端 signal DTO | `BackendDeliveryResult` | `TransportPortError` |
| `check_capability(capability_ref: BackendCapabilityRef)` | 检查后端能力 | `capability_ref` 不能包含 secret 明文 | `BackendCapabilityReport` | `TransportPortError` |

### 7.5 `application` 模块:technical port 契约

#### `UnitOfWork`

| 项 | 内容 |
|---|---|
| 类型 | technical port |
| 定义位置 | `crates/application/src/ports/unit_of_work.rs` |
| 调用方 | 所有写路径 application service |
| 实现方 | `InMemoryUnitOfWork`，后续 durable transaction adapter |
| 边界 | 只表达事务生命周期，不暴露数据库事务对象 |

```rust
/// 写路径事务边界端口。
///
/// 用于统一管理 begin、commit 和 rollback，避免 application service 泄漏具体数据库事务类型。
pub trait UnitOfWork {
    /// 开启一个写事务。
    async fn begin(
        &self,
        purpose: UnitOfWorkPurpose,
        actor: ActorContext,
    ) -> Result<UnitOfWorkHandle, UnitOfWorkError>;

    /// 提交写事务。
    async fn commit(
        &self,
        handle: UnitOfWorkHandle,
    ) -> Result<CommitReceipt, UnitOfWorkError>;

    /// 回滚写事务。
    async fn rollback(
        &self,
        handle: UnitOfWorkHandle,
        reason: RollbackReason,
    ) -> Result<(), UnitOfWorkError>;
}
```

| 函数签名 | 作用 | 参数说明 | 返回 | 错误类型 |
|---|---|---|---|---|
| `begin(purpose: UnitOfWorkPurpose, actor: ActorContext)` | 开启写事务 | `purpose` 标记用例目的 | `UnitOfWorkHandle` | `UnitOfWorkError` |
| `commit(handle: UnitOfWorkHandle)` | 提交事务 | `handle` 是事务句柄 | `CommitReceipt` | `UnitOfWorkError` |
| `rollback(handle: UnitOfWorkHandle, reason: RollbackReason)` | 回滚事务 | `reason` 是回滚原因 | `()` | `UnitOfWorkError` |

#### `ClockPort`

```rust
/// 时间来源端口。
///
/// 用于让 application service 在测试和生产环境中使用一致的时间抽象。
pub trait ClockPort {
    /// 返回当前时间。
    fn now(&self) -> Timestamp;
}
```

| 函数签名 | 作用 | 参数说明 | 返回 | 错误类型 |
|---|---|---|---|---|
| `now()` | 获取当前时间 | 无 | `Timestamp` | 无 |

#### `IdGeneratorPort`

```rust
/// Bus 记录 ID 生成端口。
///
/// 用于生成 publication、delivery、attempt、feedback、audit、recovery 和 projection 等内部记录 ID。
pub trait IdGeneratorPort {
    /// 生成指定类型的记录 ID。
    fn next_record_id(&self, kind: BusRecordKind) -> Result<RecordId, IdGenerationError>;
}
```

| 函数签名 | 作用 | 参数说明 | 返回 | 错误类型 |
|---|---|---|---|---|
| `next_record_id(kind: BusRecordKind)` | 生成内部记录 ID | `kind` 是记录类型 | `RecordId` | `IdGenerationError` |

### 7.6 `infra` 模块:adapter 实现契约

#### Adapter 总表

| Adapter 名称 | 实现的 trait / port | 文件位置 | 构造参数 | 作用 |
|---|---|---|---|---|
| `InMemoryPublicationRepository` | `PublicationRepository` | `crates/infra/src/repositories/publication_memory.rs` | `SharedMemoryStore store` | P0 保存 publication acceptance |
| `InMemoryDeliveryRepository` | `DeliveryRepository` | `crates/infra/src/repositories/delivery_memory.rs` | `SharedMemoryStore store` | P0 保存 delivery truth / history |
| `InMemoryFeedbackRepository` | `FeedbackRepository` | `crates/infra/src/repositories/feedback_memory.rs` | `SharedMemoryStore store` | P0 保存 feedback result |
| `InMemoryIdempotencyRepository` | `IdempotencyRepository` | `crates/infra/src/repositories/idempotency_memory.rs` | `SharedMemoryStore store` | P0 保存幂等锚点 |
| `InMemoryRecoveryRepository` | `RecoveryRepository` | `crates/infra/src/repositories/recovery_memory.rs` | `SharedMemoryStore store` | P0 保存 retry / DLQ / replay |
| `InMemoryAuditTrailRepository` | `AuditTrailRepository` | `crates/infra/src/repositories/audit_memory.rs` | `SharedMemoryStore store` | P0 保存 append-only audit |
| `InMemoryReadProjectionRepository` | `ReadProjectionRepository` | `crates/infra/src/repositories/projection_memory.rs` | `SharedMemoryStore store` | P0 保存只读投影 |
| `InMemoryOutboxFactSourceAdapter` | `OutboxFactSourcePort` | `crates/infra/src/outbox/core_source_memory.rs` | `SharedOutboxSource source` | P0 模拟 core outbox fact 来源 |
| `InMemoryOutboxPublisherAdapter` | `OutboxPublisherPort` | `crates/infra/src/outbox/publisher_memory.rs` | `SharedPublishedEventSink sink` | P0 保存已发布事件结果 |
| `InMemoryTransportBackendAdapter` | `TransportBackendPort` | `crates/infra/src/transport/in_memory_backend.rs` | `BackendProfile profile` | P0 模拟后端投递和 capability check |
| `InMemoryUnitOfWork` | `UnitOfWork` | `crates/infra/src/uow/memory_unit_of_work.rs` | `SharedMemoryStore store` | P0 提供内存事务边界 |
| `SystemClockAdapter` | `ClockPort` | `crates/infra/src/time/system_clock.rs` | 无 | 生产默认时间来源 |
| `FixedClockAdapter` | `ClockPort` | `crates/infra/src/time/fixed_clock.rs` | `Timestamp fixed_now` | 测试时间来源 |
| `UuidIdGeneratorAdapter` | `IdGeneratorPort` | `crates/infra/src/id/uuid_generator.rs` | 无 | 生产默认 ID 生成 |
| `DeterministicIdGeneratorAdapter` | `IdGeneratorPort` | `crates/infra/src/id/deterministic_generator.rs` | `IdSequence sequence` | 测试可重复 ID 生成 |

#### Adapter 构造约束

```text
RuntimeBuilder
  |
  +-- load RuntimeConfig
  |
  +-- construct SharedMemoryStore / future durable store
  |
  +-- construct repositories
  |
  +-- construct source / publisher / transport / clock / id / uow adapters
  |
  v
ApplicationServiceBundle
```

关键说明：

- adapter constructor 的完整配置对象由 Step 14 定义。
- `RuntimeBuilder` 只负责 wiring，不承载业务规则。
- P0 默认实现必须能在没有外部 MQ / DB 的情况下完成主线测试。
- future durable store adapter 必须实现同一组 application trait，不改变 application service 签名。

### 7.7 实现方 / 调用方关系表

| trait / port | 主要调用方 | 默认实现方 | 禁止调用 |
|---|---|---|---|
| `PublicationRepository` | `PublicationAcceptanceService`、`OutboxRelayService` | `InMemoryPublicationRepository` | `api` / `worker` / `jobs` 直接调用 |
| `DeliveryRepository` | `DeliveryProgressionService`、`FeedbackRecordingService`、`RecoveryOrchestrationService`、`ProjectionRebuildService` | `InMemoryDeliveryRepository` | `TransportBackendPort` adapter 反向调用 |
| `FeedbackRepository` | `FeedbackRecordingService`、`RecoveryOrchestrationService` | `InMemoryFeedbackRepository` | domain object 直接调用 |
| `IdempotencyRepository` | Command service、event consumer service | `InMemoryIdempotencyRepository` | handler 在 application 外自行判断幂等 |
| `RecoveryRepository` | `RecoveryOrchestrationService`、`ReplayPreparationService`、`RetryWorkerService` | `InMemoryRecoveryRepository` | query API 直接修改 retry / DLQ |
| `AuditTrailRepository` | 所有写服务、query service、projection service | `InMemoryAuditTrailRepository` | 任何实现覆盖或删除 audit entry |
| `ReadProjectionRepository` | `ReadOutputService`、query service、projection job | `InMemoryReadProjectionRepository` | projection 反写真相 repository |
| `OutboxFactSourcePort` | `OutboxRelayService`、`RunOutboxRelay` | `InMemoryOutboxFactSourceAdapter` | 读取未提交业务状态 |
| `OutboxPublisherPort` | `OutboxPublisherService`、post-commit publisher | `InMemoryOutboxPublisherAdapter` | 发布 payload body / secret / 后端私有响应正文 |
| `TransportBackendPort` | `DeliveryProgressionService`、`RetryWorkerService`、`BackendCapabilityService` | `InMemoryTransportBackendAdapter` | worker 直接调用具体 MQ SDK |
| `UnitOfWork` | 所有写路径 application service | `InMemoryUnitOfWork` | repository 自行开启不受控事务 |
| `ClockPort` | service、policy factory、job runner | `SystemClockAdapter` / `FixedClockAdapter` | domain object 直接读取系统时间 |
| `IdGeneratorPort` | service、factory wrapper | `UuidIdGeneratorAdapter` / `DeterministicIdGeneratorAdapter` | domain object 直接生成随机 ID |

### 7.8 严格跨层访问规则

| 规则 | 正例 | 反例 |
|---|---|---|
| `api` 只能调用 application service | `BusCommandApi.accept_publication()` 调用 `PublicationAcceptanceService.accept()` | `BusCommandApi` 直接调用 `PublicationRepository.insert()` |
| `worker` 只能调用 application service / runner | `DeliveryWorker` 调用 `DeliveryProgressionService.progress()` | `DeliveryWorker` 直接调用 MQ SDK |
| `jobs` 只能复用 application service 和 infra runtime | `RebuildProjectionJob` 调用 `ProjectionRebuildService.rebuild()` | job 直接扫描底层数据库表 |
| `application` 只能依赖 trait | service 持有 `Arc<dyn DeliveryRepository>` | service 持有 `InMemoryDeliveryRepository` |
| `domain` 不能依赖 port | `DeliveryRecord.start_attempt()` 只改自身状态 | `DeliveryRecord` 调用 `ClockPort.now()` |
| outbound event 只能通过 publisher port | `OutboxPublisherPort.publish(event, trace)` | 写路径直接调用外部 event bus SDK |

### 7.9 `application service` 字段注入骨架

本步不展开 service 函数处理流，但需要说明 service 如何依赖 trait，供 Step 9 继续写函数级处理流。

```rust
/// 发布接入应用服务依赖集合。
pub struct PublicationAcceptanceServiceDeps {
    /// 发布接入事实仓储。
    pub publication_repository: Arc<dyn PublicationRepository>,
    /// 幂等锚点仓储。
    pub idempotency_repository: Arc<dyn IdempotencyRepository>,
    /// 审计轨迹仓储。
    pub audit_repository: Arc<dyn AuditTrailRepository>,
    /// 事务边界端口。
    pub unit_of_work: Arc<dyn UnitOfWork>,
    /// 时间来源端口。
    pub clock: Arc<dyn ClockPort>,
    /// ID 生成端口。
    pub id_generator: Arc<dyn IdGeneratorPort>,
}

/// Delivery 推进应用服务依赖集合。
pub struct DeliveryProgressionServiceDeps {
    /// Delivery truth 仓储。
    pub delivery_repository: Arc<dyn DeliveryRepository>,
    /// 后端传输能力端口。
    pub transport_backend: Arc<dyn TransportBackendPort>,
    /// 审计轨迹仓储。
    pub audit_repository: Arc<dyn AuditTrailRepository>,
    /// 事务边界端口。
    pub unit_of_work: Arc<dyn UnitOfWork>,
    /// 时间来源端口。
    pub clock: Arc<dyn ClockPort>,
}

/// 恢复编排应用服务依赖集合。
pub struct RecoveryOrchestrationServiceDeps {
    /// Delivery truth 仓储。
    pub delivery_repository: Arc<dyn DeliveryRepository>,
    /// Feedback 结果仓储。
    pub feedback_repository: Arc<dyn FeedbackRepository>,
    /// 恢复闭环仓储。
    pub recovery_repository: Arc<dyn RecoveryRepository>,
    /// 审计轨迹仓储。
    pub audit_repository: Arc<dyn AuditTrailRepository>,
    /// 后端传输能力端口。
    pub transport_backend: Arc<dyn TransportBackendPort>,
    /// 事务边界端口。
    pub unit_of_work: Arc<dyn UnitOfWork>,
    /// 时间来源端口。
    pub clock: Arc<dyn ClockPort>,
}
```

说明：

- 上述 struct 是 Step 7 的依赖注入骨架，service 的公开函数由 Step 9 定义。
- 使用 `Arc<dyn Trait>` 表示 runtime 可注入 adapter；是否额外使用泛型由实现阶段根据测试便利性决定。
- 不把 `infra` 具体类型放进 service deps，避免破坏依赖方向。

### 7.10 全局 Trait / Port / Adapter 索引

| 名称 | 类型 | 所属模块 | 定义位置 |
|---|---|---|---|
| `PublicationRepository` | repository port | `application` | `crates/application/src/ports/publication.rs` |
| `DeliveryRepository` | repository port | `application` | `crates/application/src/ports/delivery.rs` |
| `FeedbackRepository` | repository port | `application` | `crates/application/src/ports/feedback.rs` |
| `IdempotencyRepository` | repository port | `application` | `crates/application/src/ports/idempotency.rs` |
| `RecoveryRepository` | repository port | `application` | `crates/application/src/ports/recovery.rs` |
| `AuditTrailRepository` | repository port | `application` | `crates/application/src/ports/audit.rs` |
| `ReadProjectionRepository` | repository port | `application` | `crates/application/src/ports/projection.rs` |
| `OutboxFactSourcePort` | inbound source port | `application` | `crates/application/src/ports/outbox_source.rs` |
| `OutboxPublisherPort` | outbound publisher port | `application` | `crates/application/src/ports/outbox_publisher.rs` |
| `TransportBackendPort` | outbound backend port | `application` | `crates/application/src/ports/transport.rs` |
| `UnitOfWork` | technical port | `application` | `crates/application/src/ports/unit_of_work.rs` |
| `ClockPort` | technical port | `application` | `crates/application/src/ports/clock.rs` |
| `IdGeneratorPort` | technical port | `application` | `crates/application/src/ports/id_generator.rs` |
| `InMemoryPublicationRepository` | adapter | `infra` | `crates/infra/src/repositories/publication_memory.rs` |
| `InMemoryDeliveryRepository` | adapter | `infra` | `crates/infra/src/repositories/delivery_memory.rs` |
| `InMemoryFeedbackRepository` | adapter | `infra` | `crates/infra/src/repositories/feedback_memory.rs` |
| `InMemoryIdempotencyRepository` | adapter | `infra` | `crates/infra/src/repositories/idempotency_memory.rs` |
| `InMemoryRecoveryRepository` | adapter | `infra` | `crates/infra/src/repositories/recovery_memory.rs` |
| `InMemoryAuditTrailRepository` | adapter | `infra` | `crates/infra/src/repositories/audit_memory.rs` |
| `InMemoryReadProjectionRepository` | adapter | `infra` | `crates/infra/src/repositories/projection_memory.rs` |
| `InMemoryOutboxFactSourceAdapter` | adapter | `infra` | `crates/infra/src/outbox/core_source_memory.rs` |
| `InMemoryOutboxPublisherAdapter` | adapter | `infra` | `crates/infra/src/outbox/publisher_memory.rs` |
| `InMemoryTransportBackendAdapter` | adapter | `infra` | `crates/infra/src/transport/in_memory_backend.rs` |
| `InMemoryUnitOfWork` | adapter | `infra` | `crates/infra/src/uow/memory_unit_of_work.rs` |
| `SystemClockAdapter` / `FixedClockAdapter` | adapter | `infra` | `crates/infra/src/time/*.rs` |
| `UuidIdGeneratorAdapter` / `DeterministicIdGeneratorAdapter` | adapter | `infra` | `crates/infra/src/id/*.rs` |

---

## 8. 回填草稿

正式 `03-详细设计.md` 的 §5 和 §6 按以下方式回填：

```md
#### 5.5.4 Trait / Port / Adapter 契约

从 `design-calibration/03_ddd_step_07_trait_port_adapter_contracts.md` §7.3~§7.5 摘录 application trait 契约。

#### 5.7.4 Trait / Port / Adapter 契约

从 `design-calibration/03_ddd_step_07_trait_port_adapter_contracts.md` §7.6 摘录 infra adapter 实现契约。

## 6. 全局对象 / Trait / API 索引

### 6.2 Trait / Port / Adapter 索引

从 `design-calibration/03_ddd_step_07_trait_port_adapter_contracts.md` §7.10 摘录。
```

说明：

- 如果正式文档对应小节完全引用本文件已有章节，不重复粘贴中间产物全文，只写明摘录来源。
- Step 9 写 application service 函数级处理流时，需要引用本步的 service deps 和 port 函数。
- Step 11 写持久化、事务与一致性时，需要继续细化 `UnitOfWork`、repository adapter、lock 和 optimistic version。

---

## 9. 待确认事项

| 待确认事项 | 方案 | 推荐 | 原因 |
|---|---|---|---|
| 是否保留独立 `FeedbackRepository` | A. 合并到 `DeliveryRepository`；B. 独立保留；C. 合并到 `RecoveryRepository` | 推荐 B | feedback 是独立 bus 级结果，既服务 delivery 状态，也服务 recovery 材料，独立端口更清晰 |
| 是否保留 `IdempotencyRepository` | A. 合并到各业务 repository；B. 独立保留；C. 只放内存缓存 | 推荐 B | 幂等锚点跨 Command / Event Consumer / Job，独立端口更利于一致性和测试 |
| `BusStorePort` 是否进入 application trait | A. 进入；B. 不进入，留给 infra / Step 11；C. 删除所有提及 | 推荐 B | application 应使用业务 repository，generic store 属于持久化实现细节 |
| `TransportBackendPort.normalize_signal()` 是否必须存在 | A. 必须存在；B. signal consumer 自行归一化；C. 由 domain policy 归一化 | 推荐 A | 后端 signal 归一化依赖后端 adapter 能力，但输出必须是 bus 结果 |
| service deps 使用 `Arc<dyn Trait>` 还是泛型 | A. `Arc<dyn Trait>`；B. 泛型；C. 两者都写 | 推荐 A | 文档契约更直观，便于 runtime wiring；实现阶段可在局部测试中使用泛型优化 |

---

## 10. 进入下一步条件

```text
所有跨模块、跨层、跨外部系统的实现接缝已有明确 trait / port / adapter 契约。
trait 函数已写明参数类型、返回类型和错误类型。
application 与 infra 的依赖方向已明确。
可以进入 Step 8,定义 API / Command / Query / Event / Job 协议契约。
```
