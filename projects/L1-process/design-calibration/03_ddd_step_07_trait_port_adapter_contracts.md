# Step 7. 逐模块定义 Trait / Port / Adapter 契约

### 1. Step 状态

- 状态:[x] 已确认
- 对应 SOP:`standards/document/详细设计讨论流程_SOP.md` Step 7
- 回填章节:`03-详细设计.md` §5 模块实现契约中的 Trait / Port / Adapter 契约;§6 全局对象 / Trait / API 索引

### 2. 本步输入

- 上一步中间产物:
  - `projects/L1-process/design-calibration/03_ddd_step_05_module_contracts.md`
  - `projects/L1-process/design-calibration/03_ddd_step_06_object_contracts.md`
- 上游正式文档:
  - `projects/L1-process/01-架构设计.md`
  - `projects/L1-process/02-概要设计.md` §5 / §7 / §8 / §12
- 概要设计校准来源:
  - `projects/L1-process/design-calibration/02_hld_step_07_api_interface_skeleton.md`
  - `projects/L1-process/design-calibration/02_hld_step_08_processing_flows.md`
  - `projects/L1-process/design-calibration/02_hld_step_12_detailed_design_handoff.md`
- 规范输入:
  - `standards/document/详细设计书写规范.md` §5.5 / §5.6
  - `standards/document/设计真相源闭环与可落码性标准.md`

### 3. SOP 问题回答

1. 哪些模块需要定义 trait / port?

   回答:`application` 模块定义所有 repository、transaction、idempotency、operation result store、external resolver、publisher、handoff、clock 和 id generator port。`contracts` 不定义 trait。`domain` 不定义 repository / external client trait。`infra` 只实现 `application` trait。`api`、`worker`、`jobs` 只调用 application service 或 runner,不得直接调用 infra adapter 的写方法。

2. 哪些模块负责实现这些 trait / port?

   回答:`infra` 负责实现 repository、projection store、reference store、idempotency store、operation result store、source resolver、publisher、handoff adapter、clock 和 id generator。实现文件与 Step 4 文件布局一致:`repositories.rs`、`projection_stores.rs`、`reference_stores.rs`、`outbox_store.rs`、`idempotency_store.rs`、`source_resolvers.rs`、`publishers.rs`、`handoff_adapters.rs`、`clock_id.rs`。

3. repository、outbox、projection、external client 的函数签名是什么?

   回答:本 Step 以 Rust trait 片段给出完整参数类型、返回类型和错误类型。写 repository 必须接收 `&mut dyn UnitOfWorkHandle` 和 `expected_version: StorageVersion` 或明确为 append-only;读取必须提供带版本读取口径 `Versioned<T>`。外部 resolver 只返回 snapshot / ref / marker,不得返回外部正文。

4. 每个 trait 函数的参数类型、返回类型、错误类型是什么?

   回答:所有 trait 函数必须返回 `Result<_, RepositoryError>`、`Result<_, ResolverError>`、`Result<_, PublishError>`、`Result<_, HandoffError>`、`Result<_, UnitOfWorkError>` 或 `Result<_, IdempotencyError>` 中的正式错误类型。不得使用裸字符串或 `anyhow::Error` 作为设计契约。

5. 哪些依赖只能通过 trait 访问,不能直接跨层调用?

   回答:`application` 访问持久化、外部仓来源、bus publisher、observability / archive handoff、clock、id generator 和 idempotency store 都只能通过本 Step trait。`domain` 不访问这些 trait。`api`、`worker`、`jobs` 不绕过 application service 写 repository。

### 4. 当前文档问题诊断

| 位置 | 当前问题 | 本步处理 |
|---|---|---|
| `02-概要设计.md` §5 | 已点名 repository / port / adapter,但没有函数签名 | 本 Step 补 trait 级签名和实现方 |
| `02-概要设计.md` §7 / §8 | Command / Query / Consumer / Job 只给处理骨架 | 本 Step 给 application services 可调用的 repository / external seam |
| Step 6 对象契约 | 对象已定义,但没有保存 / 查询版本口径 | 本 Step 固定 `Versioned<T>` 与 optimistic save |
| 幂等 duplicate result | 概要只要求 same key same digest 返回既有 result surface | 本 Step 增加 `OperationResultRepository`,避免只有 `result_ref` 无读取面 |
| 相邻仓依赖 | 容易误写成 Cargo dependency 或直接 client | 本 Step 明确只通过 resolver / publisher / handoff port,不引入 sibling path dependency |

### 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| repository 契约 | 只有名字 | 带 `Versioned<T>`、`StorageVersion`、`UnitOfWorkHandle` 的 trait | 支撑事务和并发 |
| duplicate replay | 只有 `ApplicationResultRef` | 增加 operation result store 读取完整 result / receipt surface | 防止实现者自行重构 result |
| external source | 只知道来源仓 | 每个来源仓一个 resolver port,返回 snapshot / marker | 不保存外部正文 |
| outbox publish | 只知道 job | publisher port + outbox repository + publish outcome | 支撑 retry / failed 状态 |
| handoff | 只知道 target boundary | trace / archive handoff port + receipt / error | 不把 observability / archive 作为编译期依赖 |

### 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| A. repository trait 直接返回 entity | 签名短 | 更新时无法获得 optimistic version | 不采用 |
| B. repository trait 返回 `Versioned<T>` | 可 1:1 实现 expected version 保存 | 签名更重 | 采用 |
| C. duplicate replay 由当前 truth 重算 result | 少一个 store | 可能和原 result receipt / refs 不一致 | 不采用 |
| D. duplicate replay 读取 `OperationResultRepository` | command / consumer / job result surface 闭环 | 需要持久化 result / receipt DTO | 采用 |
| E. application 直接依赖外部仓 client | 调用直观 | 违反 sibling repo 运行期边界 | 不采用 |
| F. resolver port 返回 snapshot / ref / marker | 边界清晰 | 需要 adapter 维护 source mapping | 采用 |

### 7. 结构化中间产物

#### 7.1 Trait / Port / Adapter 总表

| 名称 | 类型 | 定义位置 | 实现位置 | 作用 | 关键函数 |
|---|---|---|---|---|---|
| `UnitOfWork` | transaction port | `application/src/unit_of_work.rs` | `infra/src/repositories.rs` | 管理 command / consumer / job 写事务 | `begin`、`commit`、`rollback` |
| `IdempotencyRepository` | technical repository | `application/src/idempotency.rs` | `infra/src/idempotency_store.rs` | command / event / job 幂等 | `reserve_command`、`complete`、`mark_conflict` |
| `OperationResultRepository` | technical repository | `application/src/idempotency.rs` | `infra/src/idempotency_store.rs` | duplicate result / receipt replay | `save_result`、`get_result` |
| `ProcessShapeRepository` | truth repository | `application/src/ports.rs` | `infra/src/repositories.rs` | runtime shape truth / body-free shape summary | `get`、`save`、`find_by_definition_version`、`get_start_bootstrap_summary`、`get_gateway_route_set` |
| `ProcessProfileRepository` | truth repository | `application/src/ports.rs` | `infra/src/repositories.rs` | profile truth | `get`、`save`、`find_active_by_project` |
| `ProcessInstanceRepository` | truth repository | `application/src/ports.rs` | `infra/src/repositories.rs` | instance truth | `get`、`save`、`list_by_profile` |
| `ActivityRepository` | truth repository | `application/src/ports.rs` | `infra/src/repositories.rs` | activity truth / progression | `get`、`save`、`list_by_instance` |
| `TokenGatewayRepository` | truth repository | `application/src/ports.rs` | `infra/src/repositories.rs` | token / gateway flow state | `get_token`、`save_token`、`get_gateway`、`save_gateway` |
| `WaitingGateRepository` | truth repository | `application/src/ports.rs` | `infra/src/repositories.rs` | waiting gate / pause context | `get_gate`、`save_gate`、`find_open_by_instance` |
| `CheckpointRepository` | truth repository | `application/src/ports.rs` | `infra/src/repositories.rs` | checkpoint truth | `get`、`save`、`latest_for_instance` |
| `RecoveryRepository` | truth repository | `application/src/ports.rs` | `infra/src/repositories.rs` | recovery attempt / history | `get_attempt`、`save_attempt`、`append_history` |
| `RhythmRepository` | truth repository | `application/src/ports.rs` | `infra/src/repositories.rs` | stage / timebox binding | `get_stage`、`save_stage`、`get_binding`、`save_binding` |
| `TraceRepository` | append / handoff repository | `application/src/ports.rs` | `infra/src/repositories.rs` | trace / audit / handoff records | `append_trace`、`append_audit_record`、`save_handoff_ref` |
| `ProcessOutboxRepository` | outbox repository | `application/src/ports.rs` | `infra/src/outbox_store.rs` | outbox record persistence with outbound payload snapshot | `append`、`list_pending`、`save_state` |
| `ProjectionRepository` | projection repository | `application/src/ports.rs` | `infra/src/projection_stores.rs` | read model / timeline / summary / view state | `upsert_read_model`、`find_timeline`、`mark_view_state` |
| `ReferenceSnapshotRepository` | snapshot repository | `application/src/ports.rs` | `infra/src/reference_stores.rs` | external snapshot / reference state | `upsert_method_snapshot`、`upsert_work_snapshot`、`upsert_runtime_feedback_summary`、`upsert_reference_state` |
| `ReconciliationReportRepository` | report repository | `application/src/ports.rs` | `infra/src/projection_stores.rs` | reconciliation report | `save_report`、`get_report` |
| `MethodDefinitionResolverPort` | external resolver | `application/src/ports.rs` | `infra/src/source_resolvers.rs` | method definition snapshot | `resolve_definition` |
| `WorkContextResolverPort` | external resolver | `application/src/ports.rs` | `infra/src/source_resolvers.rs` | work context snapshot | `resolve_work_context` |
| `ActorCapabilityResolverPort` | external resolver | `application/src/ports.rs` | `infra/src/source_resolvers.rs` | actor capability snapshot | `resolve_actor_capability` |
| `GovernanceDecisionResolverPort` | external resolver | `application/src/ports.rs` | `infra/src/source_resolvers.rs` | governance decision marker | `resolve_decision` |
| `ArtifactEvidenceResolverPort` | external resolver | `application/src/ports.rs` | `infra/src/source_resolvers.rs` | artifact evidence marker | `resolve_evidence` |
| `RuntimeFeedbackResolverPort` | external resolver | `application/src/ports.rs` | `infra/src/source_resolvers.rs` | runtime feedback marker / body-free summary | `resolve_feedback` |
| `ConversationContextResolverPort` | external resolver | `application/src/ports.rs` | `infra/src/source_resolvers.rs` | conversation context marker | `resolve_context` |
| `ProcessOutboxPublisherPort` | publisher port | `application/src/ports.rs` | `infra/src/publishers.rs` | outbound event publish | `publish` |
| `TraceHandoffPort` | handoff port | `application/src/ports.rs` | `infra/src/handoff_adapters.rs` | observability handoff | `deliver_trace` |
| `ArchiveHandoffPort` | handoff port | `application/src/ports.rs` | `infra/src/handoff_adapters.rs` | archive handoff | `deliver_archive` |
| `ClockPort` | technical port | `application/src/ports.rs` | `infra/src/clock_id.rs` | 时间来源 | `now` |
| `IdGeneratorPort` | technical port | `application/src/ports.rs` | `infra/src/clock_id.rs` | id 来源 | `new_*` |

#### 7.2 调用方 / 实现方关系表

| 调用方 | 可调用 trait | 不得调用 |
|---|---|---|
| Command service | truth repository、snapshot repository、trace repository、outbox repository、idempotency、operation result store、resolver、clock、id generator | infra concrete store、external SDK、publisher loop |
| Query service | truth repository、projection repository、trace repository、reference snapshot repository、read visibility policy | write repository、outbox publisher、snapshot resolver |
| Consumer service | idempotency、reference snapshot repository、truth repository stale marker、projection repository、resolver、trace / outbox repository | command handler、query handler、external sibling repo crate |
| Outbox service | outbox repository、publisher port、clock | command repository mutation beyond outbox state |
| Projection service | truth repository、trace repository、projection repository、reference snapshot repository | creating new process truth |
| Trace service | trace repository、handoff ports、clock、id generator | observability / archive concrete client |
| API handler | application command / query service | repository adapter、domain object mutation |
| Worker runner | application consumer / outbox / projection service | repository adapter direct writes |
| Job runner | application projection / reference / reconciliation / recovery / trace service | domain object direct mutation without service transaction |

#### 7.3 application shared helper / error types

以下类型属于 `application` 内部技术契约。若 Step 8 需要把其中字段暴露给 public protocol,必须在 Step 8 重新给出 contracts DTO schema。

```rust
/// Entity with the storage version used for optimistic concurrency.
pub struct Versioned<T> {
    /// Loaded entity.
    pub entity: T,
    /// Version observed when the entity was loaded.
    pub version: StorageVersion,
}

/// Opaque optimistic concurrency version owned by the process persistence adapter.
pub struct StorageVersion {
    /// Monotonic version value assigned by the persistence adapter.
    pub value: u64,
}

/// Application-local page returned by repository list functions.
pub struct Page<T> {
    /// Items in this page.
    pub items: Vec<T>,
    /// Page information returned by the repository.
    pub page_info: PageInfo,
}

/// Application-local page request used by repository list functions.
pub struct PageRequest {
    /// Cursor from the previous page.
    pub cursor: Option<PageCursor>,
    /// Maximum number of items requested.
    pub limit: u16,
}

/// Page metadata for application repository reads.
pub struct PageInfo {
    /// Cursor for the next page when more data exists.
    pub next_cursor: Option<PageCursor>,
    /// Whether another page can be requested.
    pub has_more: bool,
}

/// Opaque cursor used by repository list functions.
pub struct PageCursor {
    /// Stable cursor value produced by the repository adapter.
    pub value: String,
}
```

| 类型 | 归属 | 字段 / 变体 | 使用边界 |
|---|---|---|---|
| `Versioned<T>` | `application::ports` | `entity: T`;`version: StorageVersion` | repository read |
| `StorageVersion` | `application::ports` | `value: u64` | optimistic save |
| `PageRequest` | `application::ports` | `cursor: Option<PageCursor>`;`limit: u16` | list repository |
| `Page<T>` | `application::ports` | `items`;`page_info` | list repository |
| `PageInfo` | `application::ports` | `next_cursor`;`has_more` | list repository |
| `PageCursor` | `application::ports` | `value: String` | list repository |
| `RepositoryError` | `application::errors` | `NotFound`;`Conflict`;`StorageUnavailable`;`InvalidFilter`;`SerializationFailed` | repository adapter |
| `ResolverError` | `application::errors` | `NotFound`;`UnsupportedVersion`;`SourceUnavailable`;`DigestMismatch`;`InvalidPayload`;`BodyNotAllowed` | external resolver |
| `PublishError` | `application::errors` | `Retryable(PublishFailureRef)`;`Permanent(PublishFailureRef)`;`InvalidEvent` | publisher port |
| `HandoffError` | `application::errors` | `Retryable(HandoffFailureRef)`;`Permanent(HandoffFailureRef)`;`InvalidTarget` | handoff port |
| `UnitOfWorkError` | `application::errors` | `BeginFailed`;`CommitFailed`;`RollbackFailed` | transaction port |
| `IdempotencyError` | `application::errors` | `Conflict`;`StoreUnavailable`;`ResultMissing`;`DigestMismatch` | idempotency repository |

```rust
/// Error returned by process repositories.
pub enum RepositoryError {
    /// The requested entity was not found.
    NotFound,
    /// The expected storage version did not match the current storage version.
    Conflict,
    /// The underlying store is unavailable.
    StorageUnavailable,
    /// The caller supplied an unsupported filter or scope.
    InvalidFilter,
    /// The stored representation could not be serialized or deserialized.
    SerializationFailed,
}

/// Error returned by external source resolvers.
pub enum ResolverError {
    /// The referenced external object does not exist or is not visible.
    NotFound,
    /// The source event or source version is not supported.
    UnsupportedVersion,
    /// The external source is temporarily unavailable.
    SourceUnavailable,
    /// The supplied digest does not match the resolved summary.
    DigestMismatch,
    /// The source payload is invalid for the process boundary.
    InvalidPayload,
    /// The resolver received body content that must not cross into process.
    BodyNotAllowed,
}
```

#### 7.4 Unit of Work 契约

```rust
/// Starts and controls process write transactions.
pub trait UnitOfWork {
    /// Opens a new unit of work for one command, consumer, or job transaction.
    async fn begin(&self) -> Result<Box<dyn UnitOfWorkHandle>, UnitOfWorkError>;
}

/// Transaction handle passed to repositories participating in one write.
pub trait UnitOfWorkHandle {
    /// Commits all writes made through this unit of work.
    async fn commit(self: Box<Self>) -> Result<(), UnitOfWorkError>;

    /// Rolls back all writes made through this unit of work.
    async fn rollback(self: Box<Self>) -> Result<(), UnitOfWorkError>;
}
```

约束:

- command / consumer / job 写路径必须在一个 `UnitOfWorkHandle` 内保存 truth、trace、outbox、projection marker、idempotency completion 和 operation result / receipt。
- query 路径不得打开 write unit of work。
- `application` 只持有 trait,不得依赖 infra transaction 类型。
- service 中需要把 `Box<dyn UnitOfWorkHandle>` 绑定为可变局部变量后以 `&mut dyn UnitOfWorkHandle` 传给 repository;提交或回滚时消费该 boxed handle。

#### 7.5 Idempotency 与 Operation Result 契约

```rust
/// Idempotency reservation result for a command, event, or job request.
pub enum IdempotencyReservation {
    /// The caller may execute the request and must complete the reservation.
    Reserved(IdempotencyRecordRef),
    /// The same operation, key, and digest completed earlier; load the stored result.
    Duplicate(ApplicationResultRef),
    /// The same operation and key were used with a different digest.
    Conflict(IdempotencyConflictRef),
}

/// Repository for idempotency reservations and completion records.
pub trait IdempotencyRepository {
    /// Reserves a command idempotency key or returns the existing completion state.
    async fn reserve_command(
        &self,
        operation: ProcessCommandKind,
        key: IdempotencyKey,
        digest: RequestDigest,
        metadata: CommandMetadata,
        uow: &mut dyn UnitOfWorkHandle,
    ) -> Result<IdempotencyReservation, IdempotencyError>;

    /// Reserves an inbound event dedup key or returns the existing completion state.
    async fn reserve_event(
        &self,
        operation: ProcessInboundEventKind,
        key: EventDedupKey,
        digest: EventDigest,
        metadata: EventMetadata,
        uow: &mut dyn UnitOfWorkHandle,
    ) -> Result<IdempotencyReservation, IdempotencyError>;

    /// Reserves an operations job idempotency key or returns the existing completion state.
    async fn reserve_job(
        &self,
        operation: ProcessJobKind,
        key: JobIdempotencyKey,
        digest: JobDigest,
        metadata: JobMetadata,
        uow: &mut dyn UnitOfWorkHandle,
    ) -> Result<IdempotencyReservation, IdempotencyError>;

    /// Marks a reservation as completed with a stored result reference.
    async fn complete(
        &self,
        reservation_ref: IdempotencyRecordRef,
        result_ref: ApplicationResultRef,
        uow: &mut dyn UnitOfWorkHandle,
    ) -> Result<(), IdempotencyError>;

    /// Marks a reservation as conflicted when the same operation key is used with a different digest.
    async fn mark_conflict(
        &self,
        key: ProcessIdempotencyKey,
        conflict_ref: IdempotencyConflictRef,
        uow: &mut dyn UnitOfWorkHandle,
    ) -> Result<(), IdempotencyError>;
}

/// Stored command result variants used for command duplicate replay.
pub enum StoredProcessCommandResult {
    /// Result of SyncRuntimeProcessShape.
    RuntimeShape(RuntimeProcessShapeCommandResult),
    /// Result of AdoptProcessProfile or UpdateProcessProfileTailoring.
    ProcessProfile(ProcessProfileCommandResult),
    /// Result of StartProcessInstance.
    ProcessInstance(ProcessInstanceCommandResult),
    /// Result of AdvanceProcessActivity or RecordActivityFeedback.
    ActivityProgression(ActivityProgressionCommandResult),
    /// Result of OpenWaitingGate or ResumeWaitingGate.
    WaitingGate(WaitingGateCommandResult),
    /// Result of CreateProcessCheckpoint.
    ProcessCheckpoint(ProcessCheckpointCommandResult),
    /// Result of StartRecoveryAttempt or CompleteRecoveryAttempt.
    RecoveryAttempt(RecoveryAttemptCommandResult),
    /// Result of BindProcessTimebox or UpdateProcessStageState.
    ProcessTiming(ProcessTimingCommandResult),
}

/// Stored operation result variants used by idempotency duplicate replay.
pub enum StoredProcessOperationResult {
    /// Stored result of a command operation.
    Command(StoredProcessCommandResult),
    /// Stored receipt of an inbound consumer operation.
    Consumer(ConsumerReceipt),
    /// Stored receipt of an operations job run.
    Job(JobRunReceipt),
}

/// Repository for storing and loading operation result surfaces.
pub trait OperationResultRepository {
    /// Stores a completed operation result in the same transaction as idempotency completion.
    async fn save_result(
        &self,
        result_ref: ApplicationResultRef,
        result: StoredProcessOperationResult,
        uow: &mut dyn UnitOfWorkHandle,
    ) -> Result<(), RepositoryError>;

    /// Loads a completed operation result for duplicate replay.
    async fn get_result(
        &self,
        result_ref: ApplicationResultRef,
    ) -> Result<Option<StoredProcessOperationResult>, RepositoryError>;
}
```

闭环规则:

- same operation + same key + same digest 的 duplicate 必须通过 `OperationResultRepository::get_result(result_ref)` 返回原 result / receipt surface。
- command duplicate 必须读取 `StoredProcessOperationResult::Command`,consumer duplicate 必须读取 `StoredProcessOperationResult::Consumer`,job duplicate 必须读取 `StoredProcessOperationResult::Job`;variant 不匹配时按 Step 12 映射为 `ProcessApiError::IdempotencyResultMissing`、job dependency unavailable 或等价 consumer quarantine / alert,不得跨类型重构。
- same operation + same key + different digest 必须返回 conflict,不得进入 domain transition。
- same raw key but different operation is not duplicate;store uniqueness is scoped by `ProcessIdempotencyOperation`.
- result store 缺失时按 Step 12 映射为 `ProcessApiError::IdempotencyResultMissing` 或 job dependency unavailable,不得从当前 truth、当前 marker 或 job counter 临时重算。

#### 7.6 Truth Repository 契约

##### 7.6.1 `ProcessShapeRepository`

```rust
/// Repository for runtime process shapes.
pub trait ProcessShapeRepository {
    /// Loads a shape by process-owned reference.
    async fn get(
        &self,
        shape_ref: RuntimeProcessShapeRef,
    ) -> Result<Option<Versioned<RuntimeProcessShape>>, RepositoryError>;

    /// Finds a shape by external method definition and version.
    async fn find_by_definition_version(
        &self,
        definition_ref: MethodDefinitionRef,
        version_ref: MethodDefinitionVersionRef,
    ) -> Result<Option<Versioned<RuntimeProcessShape>>, RepositoryError>;

    /// Loads the body-free route set for a gateway in the indexed runtime shape summary.
    async fn get_gateway_route_set(
        &self,
        gateway_ref: GatewayRef,
    ) -> Result<Option<GatewayRouteSet>, RepositoryError>;

    /// Loads the body-free start-node bootstrap summary for one runtime shape.
    async fn get_start_bootstrap_summary(
        &self,
        shape_ref: RuntimeProcessShapeRef,
        start_node_ref: ShapeNodeRef,
    ) -> Result<Option<ProcessStartBootstrapSummary>, RepositoryError>;

    /// Saves a shape using optimistic concurrency.
    async fn save(
        &self,
        shape: RuntimeProcessShape,
        expected_version: StorageVersion,
        uow: &mut dyn UnitOfWorkHandle,
    ) -> Result<StorageVersion, RepositoryError>;
}
```

##### 7.6.2 `ProcessProfileRepository`

```rust
/// Repository for adopted process profiles.
pub trait ProcessProfileRepository {
    /// Loads a profile by reference.
    async fn get(
        &self,
        profile_ref: ProcessProfileRef,
    ) -> Result<Option<Versioned<ProcessProfile>>, RepositoryError>;

    /// Finds the active profile for an external project reference.
    async fn find_active_by_project(
        &self,
        project_ref: ProjectRef,
    ) -> Result<Option<Versioned<ProcessProfile>>, RepositoryError>;

    /// Saves a profile using optimistic concurrency.
    async fn save(
        &self,
        profile: ProcessProfile,
        expected_version: StorageVersion,
        uow: &mut dyn UnitOfWorkHandle,
    ) -> Result<StorageVersion, RepositoryError>;

    /// Appends a profile change record in the same transaction as the profile change.
    async fn append_change_record(
        &self,
        record: ProfileChangeRecord,
        uow: &mut dyn UnitOfWorkHandle,
    ) -> Result<(), RepositoryError>;
}
```

##### 7.6.3 `ProcessInstanceRepository`

```rust
/// Repository for process instances.
pub trait ProcessInstanceRepository {
    /// Loads a process instance by reference.
    async fn get(
        &self,
        instance_ref: ProcessInstanceRef,
    ) -> Result<Option<Versioned<ProcessInstance>>, RepositoryError>;

    /// Lists process instances for one profile.
    async fn list_by_profile(
        &self,
        profile_ref: ProcessProfileRef,
        page: PageRequest,
    ) -> Result<Page<Versioned<ProcessInstance>>, RepositoryError>;

    /// Lists process instances for one work context.
    async fn list_by_work_context(
        &self,
        work_context_ref: WorkContextRef,
        page: PageRequest,
    ) -> Result<Page<Versioned<ProcessInstance>>, RepositoryError>;

    /// Saves a process instance using optimistic concurrency.
    async fn save(
        &self,
        instance: ProcessInstance,
        expected_version: StorageVersion,
        uow: &mut dyn UnitOfWorkHandle,
    ) -> Result<StorageVersion, RepositoryError>;
}
```

##### 7.6.4 `ActivityRepository`

```rust
/// Repository for process activities and progression records.
pub trait ActivityRepository {
    /// Loads an activity by reference.
    async fn get(
        &self,
        activity_ref: ActivityRef,
    ) -> Result<Option<Versioned<Activity>>, RepositoryError>;

    /// Lists activities for an instance.
    async fn list_by_instance(
        &self,
        instance_ref: ProcessInstanceRef,
        page: PageRequest,
    ) -> Result<Page<Versioned<Activity>>, RepositoryError>;

    /// Saves an activity using optimistic concurrency.
    async fn save(
        &self,
        activity: Activity,
        expected_version: StorageVersion,
        uow: &mut dyn UnitOfWorkHandle,
    ) -> Result<StorageVersion, RepositoryError>;

    /// Appends an activity progression record.
    async fn append_progression_record(
        &self,
        record: ActivityProgressionRecord,
        uow: &mut dyn UnitOfWorkHandle,
    ) -> Result<(), RepositoryError>;
}
```

##### 7.6.5 `TokenGatewayRepository`

```rust
/// Repository for process token and gateway flow-control state.
pub trait TokenGatewayRepository {
    /// Loads a token by reference.
    async fn get_token(
        &self,
        token_ref: ProcessTokenRef,
    ) -> Result<Option<Versioned<Token>>, RepositoryError>;

    /// Lists active or waiting tokens for an instance.
    async fn list_tokens_by_instance(
        &self,
        instance_ref: ProcessInstanceRef,
        page: PageRequest,
    ) -> Result<Page<Versioned<Token>>, RepositoryError>;

    /// Saves a token using optimistic concurrency.
    async fn save_token(
        &self,
        token: Token,
        expected_version: StorageVersion,
        uow: &mut dyn UnitOfWorkHandle,
    ) -> Result<StorageVersion, RepositoryError>;

    /// Loads a gateway by reference.
    async fn get_gateway(
        &self,
        gateway_ref: GatewayRef,
    ) -> Result<Option<Versioned<Gateway>>, RepositoryError>;

    /// Saves a gateway using optimistic concurrency.
    async fn save_gateway(
        &self,
        gateway: Gateway,
        expected_version: StorageVersion,
        uow: &mut dyn UnitOfWorkHandle,
    ) -> Result<StorageVersion, RepositoryError>;
}
```

##### 7.6.6 `WaitingGateRepository`

```rust
/// Repository for waiting gates, pause contexts, and gate change records.
pub trait WaitingGateRepository {
    /// Loads a waiting gate by reference.
    async fn get_gate(
        &self,
        waiting_gate_ref: WaitingGateRef,
    ) -> Result<Option<Versioned<WaitingGate>>, RepositoryError>;

    /// Finds currently open gates for an instance.
    async fn find_open_by_instance(
        &self,
        instance_ref: ProcessInstanceRef,
        page: PageRequest,
    ) -> Result<Page<Versioned<WaitingGate>>, RepositoryError>;

    /// Saves a waiting gate using optimistic concurrency.
    async fn save_gate(
        &self,
        gate: WaitingGate,
        expected_version: StorageVersion,
        uow: &mut dyn UnitOfWorkHandle,
    ) -> Result<StorageVersion, RepositoryError>;

    /// Saves the pause context associated with a waiting gate.
    async fn save_pause_context(
        &self,
        context: PauseContext,
        uow: &mut dyn UnitOfWorkHandle,
    ) -> Result<(), RepositoryError>;

    /// Appends a waiting gate change record.
    async fn append_change_record(
        &self,
        record: WaitingGateChangeRecord,
        uow: &mut dyn UnitOfWorkHandle,
    ) -> Result<(), RepositoryError>;
}
```

##### 7.6.7 `CheckpointRepository`

```rust
/// Repository for process checkpoints.
pub trait CheckpointRepository {
    /// Loads a checkpoint by reference.
    async fn get(
        &self,
        checkpoint_ref: ProcessCheckpointRef,
    ) -> Result<Option<Versioned<ProcessCheckpoint>>, RepositoryError>;

    /// Loads the latest checkpoint for a process instance.
    async fn latest_for_instance(
        &self,
        instance_ref: ProcessInstanceRef,
    ) -> Result<Option<Versioned<ProcessCheckpoint>>, RepositoryError>;

    /// Saves a checkpoint using optimistic concurrency.
    async fn save(
        &self,
        checkpoint: ProcessCheckpoint,
        expected_version: StorageVersion,
        uow: &mut dyn UnitOfWorkHandle,
    ) -> Result<StorageVersion, RepositoryError>;
}
```

##### 7.6.8 `RecoveryRepository`

```rust
/// Repository for recovery attempts and recovery history.
pub trait RecoveryRepository {
    /// Loads a recovery attempt by reference.
    async fn get_attempt(
        &self,
        attempt_ref: RecoveryAttemptRef,
    ) -> Result<Option<Versioned<RecoveryAttempt>>, RepositoryError>;

    /// Lists pending recovery attempts in a scope.
    async fn list_pending_attempts(
        &self,
        scope: RecoveryMaintenanceScope,
        page: PageRequest,
    ) -> Result<Page<Versioned<RecoveryAttempt>>, RepositoryError>;

    /// Saves a recovery attempt using optimistic concurrency.
    async fn save_attempt(
        &self,
        attempt: RecoveryAttempt,
        expected_version: StorageVersion,
        uow: &mut dyn UnitOfWorkHandle,
    ) -> Result<StorageVersion, RepositoryError>;

    /// Appends a recovery history record.
    async fn append_history(
        &self,
        record: RecoveryHistoryRecord,
        uow: &mut dyn UnitOfWorkHandle,
    ) -> Result<(), RepositoryError>;
}
```

##### 7.6.9 `RhythmRepository`

```rust
/// Repository for process stage state and timebox bindings.
pub trait RhythmRepository {
    /// Loads a stage state by reference.
    async fn get_stage(
        &self,
        stage_ref: ProcessStageRef,
    ) -> Result<Option<Versioned<ProcessStageState>>, RepositoryError>;

    /// Saves a stage state using optimistic concurrency.
    async fn save_stage(
        &self,
        stage: ProcessStageState,
        expected_version: StorageVersion,
        uow: &mut dyn UnitOfWorkHandle,
    ) -> Result<StorageVersion, RepositoryError>;

    /// Loads a timebox binding by reference.
    async fn get_binding(
        &self,
        binding_ref: ProcessTimeboxBindingRef,
    ) -> Result<Option<Versioned<ProcessTimeboxBinding>>, RepositoryError>;

    /// Finds the active timebox binding for an instance.
    async fn find_active_binding(
        &self,
        instance_ref: ProcessInstanceRef,
    ) -> Result<Option<Versioned<ProcessTimeboxBinding>>, RepositoryError>;

    /// Saves a timebox binding using optimistic concurrency.
    async fn save_binding(
        &self,
        binding: ProcessTimeboxBinding,
        expected_version: StorageVersion,
        uow: &mut dyn UnitOfWorkHandle,
    ) -> Result<StorageVersion, RepositoryError>;
}
```

#### 7.7 Trace / Outbox / Projection / Snapshot Repository 契约

##### 7.7.1 `TraceRepository`

```rust
/// Repository for process trace, audit trail, and handoff references.
pub trait TraceRepository {
    /// Appends a trace record from a committed truth change.
    async fn append_trace(
        &self,
        record: ProcessTraceRecord,
        uow: &mut dyn UnitOfWorkHandle,
    ) -> Result<(), RepositoryError>;

    /// Loads trace records for a subject.
    async fn list_trace_records(
        &self,
        subject_ref: ProcessTraceSubjectRef,
        page: PageRequest,
    ) -> Result<Page<ProcessTraceRecord>, RepositoryError>;

    /// Lists committed trace records that are eligible for handoff preparation.
    async fn list_trace_records_for_handoff(
        &self,
        scope: TraceHandoffScope,
    ) -> Result<Page<ProcessTraceRecord>, RepositoryError>;

    /// Appends a trace record reference to an audit trail.
    async fn append_audit_record(
        &self,
        audit_subject_ref: ProcessAuditSubjectRef,
        record_ref: ProcessTraceRecordRef,
        uow: &mut dyn UnitOfWorkHandle,
    ) -> Result<(), RepositoryError>;

    /// Saves a trace handoff record and state.
    async fn save_handoff_ref(
        &self,
        handoff_record: TraceHandoffRecord,
        uow: &mut dyn UnitOfWorkHandle,
    ) -> Result<(), RepositoryError>;

    /// Lists already prepared or failed handoff records for a scope.
    async fn list_handoff_refs(
        &self,
        scope: TraceHandoffScope,
        page: PageRequest,
    ) -> Result<Page<TraceHandoffRecord>, RepositoryError>;
}
```

##### 7.7.2 `ProcessOutboxRepository`

```rust
/// Repository for process outbox records.
pub trait ProcessOutboxRepository {
    /// Appends a new outbox record from a committed process truth change.
    ///
    /// The record must already contain trace context, optional visibility marker,
    /// and outbound payload snapshot captured in the accepted transition transaction.
    async fn append(
        &self,
        record: ProcessOutboxRecord,
        uow: &mut dyn UnitOfWorkHandle,
    ) -> Result<(), RepositoryError>;

    /// Loads an outbox record by reference.
    async fn get(
        &self,
        outbox_ref: ProcessOutboxRef,
    ) -> Result<Option<Versioned<ProcessOutboxRecord>>, RepositoryError>;

    /// Lists pending or retry-pending outbox records in publication order.
    async fn list_pending(
        &self,
        scope: ProcessOutboxScope,
        page: PageRequest,
    ) -> Result<Page<Versioned<ProcessOutboxRecord>>, RepositoryError>;

    /// Saves an outbox record state using optimistic concurrency.
    async fn save_state(
        &self,
        record: ProcessOutboxRecord,
        expected_version: StorageVersion,
        uow: &mut dyn UnitOfWorkHandle,
    ) -> Result<StorageVersion, RepositoryError>;
}
```

##### 7.7.3 `ProjectionRepository`

```rust
/// Repository for process read models, timeline views, summaries, and freshness state.
pub trait ProjectionRepository {
    /// Upserts a process read model derived from committed truth.
    async fn upsert_read_model(
        &self,
        read_model: ProcessReadModel,
        uow: &mut dyn UnitOfWorkHandle,
    ) -> Result<(), RepositoryError>;

    /// Loads a read model by process instance.
    async fn find_read_model(
        &self,
        instance_ref: ProcessInstanceRef,
    ) -> Result<Option<ProcessReadModel>, RepositoryError>;

    /// Upserts a timeline view.
    async fn upsert_timeline(
        &self,
        timeline: ProcessTimelineView,
        uow: &mut dyn UnitOfWorkHandle,
    ) -> Result<(), RepositoryError>;

    /// Loads a timeline view by instance.
    async fn find_timeline(
        &self,
        instance_ref: ProcessInstanceRef,
    ) -> Result<Option<ProcessTimelineView>, RepositoryError>;

    /// Upserts a progress summary.
    async fn upsert_progress_summary(
        &self,
        summary: ProcessProgressSummary,
        uow: &mut dyn UnitOfWorkHandle,
    ) -> Result<(), RepositoryError>;

    /// Searches process read models using projection filters.
    async fn search_instances(
        &self,
        filter: ProcessSearchFilter,
        page: PageRequest,
    ) -> Result<Page<ProcessReadModel>, RepositoryError>;

    /// Saves a derived view state marker.
    async fn save_view_state(
        &self,
        view_state: DerivedProcessViewState,
        uow: &mut dyn UnitOfWorkHandle,
    ) -> Result<(), RepositoryError>;

    /// Loads a derived view state marker.
    async fn get_view_state(
        &self,
        view_state_ref: DerivedProcessViewStateRef,
    ) -> Result<Option<DerivedProcessViewState>, RepositoryError>;
}
```

##### 7.7.4 `ReferenceSnapshotRepository`

```rust
/// Repository for external context snapshots and resolution states.
pub trait ReferenceSnapshotRepository {
    /// Saves or replaces a method definition snapshot summary.
    async fn upsert_method_snapshot(
        &self,
        snapshot: MethodDefinitionSnapshot,
        uow: &mut dyn UnitOfWorkHandle,
    ) -> Result<(), RepositoryError>;

    /// Loads a method definition snapshot by definition and version.
    async fn get_method_snapshot(
        &self,
        definition_ref: MethodDefinitionRef,
        version_ref: MethodDefinitionVersionRef,
    ) -> Result<Option<MethodDefinitionSnapshot>, RepositoryError>;

    /// Saves or replaces a work context snapshot summary.
    async fn upsert_work_snapshot(
        &self,
        snapshot: WorkContextSnapshot,
        uow: &mut dyn UnitOfWorkHandle,
    ) -> Result<(), RepositoryError>;

    /// Saves or replaces an actor capability snapshot summary.
    async fn upsert_actor_capability_snapshot(
        &self,
        snapshot: ActorCapabilitySnapshot,
        uow: &mut dyn UnitOfWorkHandle,
    ) -> Result<(), RepositoryError>;

    /// Saves or replaces a governance decision marker summary.
    async fn upsert_governance_decision_marker(
        &self,
        marker: GovernanceDecisionRef,
        uow: &mut dyn UnitOfWorkHandle,
    ) -> Result<(), RepositoryError>;

    /// Saves or replaces an artifact evidence marker summary.
    async fn upsert_artifact_evidence_marker(
        &self,
        marker: ArtifactEvidenceMarker,
        uow: &mut dyn UnitOfWorkHandle,
    ) -> Result<(), RepositoryError>;

    /// Saves or replaces a runtime feedback marker summary.
    async fn upsert_runtime_feedback_marker(
        &self,
        marker: RuntimeFeedbackRef,
        uow: &mut dyn UnitOfWorkHandle,
    ) -> Result<(), RepositoryError>;

    /// Saves or replaces a body-free runtime feedback summary.
    async fn upsert_runtime_feedback_summary(
        &self,
        summary: RuntimeFeedbackSummary,
        uow: &mut dyn UnitOfWorkHandle,
    ) -> Result<(), RepositoryError>;

    /// Loads a body-free runtime feedback summary by summary reference.
    async fn get_runtime_feedback_summary(
        &self,
        summary_ref: RuntimeFeedbackSummaryRef,
    ) -> Result<Option<RuntimeFeedbackSummary>, RepositoryError>;

    /// Saves or replaces a conversation context marker summary.
    async fn upsert_conversation_context_marker(
        &self,
        marker: ConversationContextRef,
        uow: &mut dyn UnitOfWorkHandle,
    ) -> Result<(), RepositoryError>;

    /// Saves a generic external reference resolution state.
    async fn upsert_reference_state(
        &self,
        state: ReferenceResolutionState,
        uow: &mut dyn UnitOfWorkHandle,
    ) -> Result<(), RepositoryError>;

    /// Loads a generic external reference resolution state.
    async fn get_reference_state(
        &self,
        reference_ref: ExternalContextRef,
    ) -> Result<Option<ReferenceResolutionState>, RepositoryError>;
}
```

##### 7.7.5 `ReconciliationReportRepository`

```rust
/// Repository for reconciliation reports.
pub trait ReconciliationReportRepository {
    /// Saves a reconciliation report.
    async fn save_report(
        &self,
        report: ReconciliationReport,
        uow: &mut dyn UnitOfWorkHandle,
    ) -> Result<(), RepositoryError>;

    /// Loads a reconciliation report by reference.
    async fn get_report(
        &self,
        report_ref: ReconciliationReportRef,
    ) -> Result<Option<ReconciliationReport>, RepositoryError>;

    /// Lists reconciliation reports for a scope.
    async fn list_reports(
        &self,
        scope: ProcessReconciliationScopeRef,
        page: PageRequest,
    ) -> Result<Page<ReconciliationReport>, RepositoryError>;
}
```

#### 7.8 External Resolver Port 契约

Resolver 只能形成本仓允许保存的 snapshot / ref / summary / marker。任何 resolver 如果收到或解析到外部正文,必须返回 `ResolverError::BodyNotAllowed` 或丢弃正文后只返回正式 summary 字段。具体 event DTO 字段由 Step 8 定义。

```rust
/// Resolves method-library definitions into process-owned snapshot summaries.
pub trait MethodDefinitionResolverPort {
    /// Resolves a method definition snapshot summary without returning definition body.
    async fn resolve_definition(
        &self,
        definition_ref: MethodDefinitionRef,
        version_ref: MethodDefinitionVersionRef,
        source_digest: Option<SourceDigest>,
    ) -> Result<MethodDefinitionSnapshot, ResolverError>;
}

/// Resolves work context references into process-owned snapshot summaries.
pub trait WorkContextResolverPort {
    /// Resolves project, work, iteration, or timebox context into a work snapshot summary.
    async fn resolve_work_context(
        &self,
        work_context_ref: WorkContextRef,
        source_version_ref: Option<SourceVersionRef>,
    ) -> Result<WorkContextSnapshot, ResolverError>;
}

/// Resolves actor capability summaries from identity.
pub trait ActorCapabilityResolverPort {
    /// Resolves actor capabilities without storing identity body.
    async fn resolve_actor_capability(
        &self,
        actor_ref: ActorRef,
        source_version_ref: Option<SourceVersionRef>,
    ) -> Result<ActorCapabilitySnapshot, ResolverError>;
}

/// Resolves governance decision markers used by waiting gates.
pub trait GovernanceDecisionResolverPort {
    /// Resolves a governance decision reference into a resumable or non-resumable marker.
    async fn resolve_decision(
        &self,
        decision_ref: ExternalDecisionRef,
        source_digest: Option<SourceDigest>,
    ) -> Result<GovernanceDecisionRef, ResolverError>;
}

/// Resolves artifact evidence markers used by checkpoint and recovery flows.
pub trait ArtifactEvidenceResolverPort {
    /// Resolves an artifact evidence reference into a process-visible marker.
    async fn resolve_evidence(
        &self,
        evidence_ref: ArtifactEvidenceRef,
        source_digest: Option<SourceDigest>,
    ) -> Result<ArtifactEvidenceMarker, ResolverError>;
}

/// Resolves runtime feedback markers used by activity progression.
pub trait RuntimeFeedbackResolverPort {
    /// Resolves runtime feedback without returning execution logs or tool-call body.
    async fn resolve_feedback(
        &self,
        feedback_ref: ExternalRuntimeFeedbackRef,
        activity_ref: ActivityRef,
        source_digest: Option<SourceDigest>,
    ) -> Result<RuntimeFeedbackResolution, ResolverError>;
}

/// Body-free runtime feedback resolution returned by runtime/member resolvers.
pub struct RuntimeFeedbackResolution {
    /// Process-visible feedback marker.
    pub runtime_feedback_ref: RuntimeFeedbackRef,
    /// Body-free feedback summary used by ActivityFeedbackPolicy.
    pub feedback_summary: RuntimeFeedbackSummary,
}

/// Resolves conversation context markers used by trace and query surfaces.
pub trait ConversationContextResolverPort {
    /// Resolves a conversation context reference without returning conversation body.
    async fn resolve_context(
        &self,
        conversation_ref: ConversationRef,
        context_kind: ConversationContextKind,
        source_version_ref: Option<SourceVersionRef>,
    ) -> Result<ConversationContextRef, ResolverError>;
}
```

Resolver 归属规则:

- `ConfiguredMethodDefinitionResolverAdapter`、`ConfiguredWorkContextResolverAdapter`、`ConfiguredActorCapabilityResolverAdapter`、`ConfiguredGovernanceDecisionResolverAdapter`、`ConfiguredArtifactEvidenceResolverAdapter`、`ConfiguredRuntimeFeedbackResolverAdapter`、`ConfiguredConversationContextResolverAdapter` 归 `infra/src/source_resolvers.rs`。
- fake resolver 必须能注入 `Resolved`、`Unresolved`、`Stale`、`Invalid`、`Unavailable` 五类 resolution 结果,用于 service tests。
- resolver 不得通过 Cargo path dependency 直接依赖 sibling implementation crate;只接收 / 返回本仓 contracts refs 和 summary。

#### 7.9 Publisher / Handoff Port 契约

```rust
/// Publisher for outbound process events built from process outbox records.
pub trait ProcessOutboxPublisherPort {
    /// Publishes one outbound event derived from an outbox record.
    async fn publish(
        &self,
        event: ProcessOutboundEventEnvelope,
    ) -> Result<PublicationReceipt, PublishError>;
}

/// Handoff port for delivering process trace material to observability.
pub trait TraceHandoffPort {
    /// Delivers a prepared trace handoff reference to the configured target.
    async fn deliver_trace(
        &self,
        handoff_ref: TraceHandoffRef,
        target_ref: TraceHandoffTargetRef,
        metadata: JobMetadata,
    ) -> Result<TraceHandoffReceipt, HandoffError>;
}

/// Handoff port for delivering process archive material to archive.
pub trait ArchiveHandoffPort {
    /// Delivers a prepared archive handoff reference to the configured target.
    async fn deliver_archive(
        &self,
        handoff_ref: TraceHandoffRef,
        target_ref: ArchiveHandoffTargetRef,
        metadata: JobMetadata,
    ) -> Result<ArchiveHandoffReceipt, HandoffError>;
}
```

发布 / 交接闭环:

- `ProcessOutboxPublisherPort::publish` 的输入必须来自 Step 8 outbound event DTO,不得由 publisher adapter 从 domain object 临时拼 payload。
- `ProcessOutboxService` 构造 `ProcessOutboundEventEnvelope` 时只能复制 `ProcessOutboxRecord.event_kind`、`truth_ref`、`trace_context`、`visibility_marker` 和 `payload_snapshot`;不得在 publish job 中重新加载 current truth 来重算 payload。
- publish 成功返回 `PublicationReceipt`,application 再调用 `ProcessOutboxRecord::mark_published(...)` 并保存。
- publish retryable failure 映射 `OutboxRetryReason`,permanent failure 映射 `OutboxFailureReason`。
- handoff port 成功只返回 receipt / external ref marker,不得把 observability ledger 或 archive package 正文写入本仓。

#### 7.10 Clock / Id Generator 契约

```rust
/// Clock used by application services and jobs.
pub trait ClockPort {
    /// Returns the current timestamp for process records.
    fn now(&self) -> Timestamp;
}

/// Id generator used by application services.
pub trait IdGeneratorPort {
    /// Creates a runtime process shape id.
    fn new_runtime_shape_id(&self) -> RuntimeProcessShapeId;

    /// Creates a process profile id.
    fn new_process_profile_id(&self) -> ProcessProfileId;

    /// Creates a process instance id.
    fn new_process_instance_id(&self) -> ProcessInstanceId;

    /// Creates a process token set reference.
    fn new_process_token_set_ref(&self) -> ProcessTokenSetRef;

    /// Creates an activity id.
    fn new_activity_id(&self) -> ActivityId;

    /// Creates a process token id.
    fn new_process_token_id(&self) -> ProcessTokenId;

    /// Creates a gateway id.
    fn new_gateway_id(&self) -> GatewayId;

    /// Creates an activity progression record id.
    fn new_activity_progression_id(&self) -> ActivityProgressionId;

    /// Creates a process outbox id.
    fn new_process_outbox_id(&self) -> ProcessOutboxId;

    /// Creates a process trace id.
    fn new_process_trace_id(&self) -> ProcessTraceId;

    /// Creates an application result reference.
    fn new_application_result_ref(&self) -> ApplicationResultRef;
}
```

约束:

- domain 工厂不得直接生成 id 或 timestamp;id / time 由 application 通过 port 提供后传入 domain。
- fake id generator 必须支持 deterministic sequence,用于 contract / service tests。

#### 7.11 Infra Adapter 矩阵

| Adapter | 文件 | 实现 trait | 数据来源 / 输出 | 必须支持的 fake 行为 |
|---|---|---|---|---|
| `InMemoryUnitOfWork` | `infra/src/repositories.rs` | `UnitOfWork` / `UnitOfWorkHandle` | in-memory staged writes | commit / rollback assertions |
| `InMemoryIdempotencyStore` | `infra/src/idempotency_store.rs` | `IdempotencyRepository`、`OperationResultRepository` | in-memory maps | duplicate / conflict / missing result |
| `InMemoryProcessShapeRepository` | `infra/src/repositories.rs` | `ProcessShapeRepository` | shape map + version map + body-free start bootstrap summaries + gateway route summaries | version conflict;missing start summary;gateway mismatch |
| `InMemoryProcessProfileRepository` | `infra/src/repositories.rs` | `ProcessProfileRepository` | profile map + change records | active profile lookup |
| `InMemoryProcessInstanceRepository` | `infra/src/repositories.rs` | `ProcessInstanceRepository` | instance map | list by profile / work context |
| `InMemoryActivityRepository` | `infra/src/repositories.rs` | `ActivityRepository` | activity map + progression records | list by instance |
| `InMemoryTokenGatewayRepository` | `infra/src/repositories.rs` | `TokenGatewayRepository` | token / gateway maps | flow state conflict |
| `InMemoryWaitingGateRepository` | `infra/src/repositories.rs` | `WaitingGateRepository` | gate / pause / change maps | open gate lookup |
| `InMemoryCheckpointRepository` | `infra/src/repositories.rs` | `CheckpointRepository` | checkpoint map | latest checkpoint lookup |
| `InMemoryRecoveryRepository` | `infra/src/repositories.rs` | `RecoveryRepository` | attempt / history maps | pending scope scan |
| `InMemoryRhythmRepository` | `infra/src/repositories.rs` | `RhythmRepository` | stage / binding maps | active binding lookup |
| `InMemoryTraceRepository` | `infra/src/repositories.rs` | `TraceRepository` | trace / audit / handoff maps | handoff scope scan |
| `InMemoryOutboxStore` | `infra/src/outbox_store.rs` | `ProcessOutboxRepository` | outbox map + ordered index + payload snapshot storage | pending ordered scan;payload snapshot retained verbatim |
| `InMemoryProjectionStore` | `infra/src/projection_stores.rs` | `ProjectionRepository`、`ReconciliationReportRepository` | projection maps | stale / failed view state |
| `InMemoryReferenceStore` | `infra/src/reference_stores.rs` | `ReferenceSnapshotRepository` | snapshot / state maps | missing / stale / invalid refs |
| `ConfiguredSourceResolvers` | `infra/src/source_resolvers.rs` | all resolver ports | configured fixtures or runtime endpoint | resolved / unavailable / digest mismatch |
| `FakeProcessPublisher` | `infra/src/publishers.rs` | `ProcessOutboxPublisherPort` | outbound event capture | success / retryable / permanent failure |
| `FakeHandoffAdapters` | `infra/src/handoff_adapters.rs` | `TraceHandoffPort`、`ArchiveHandoffPort` | handoff capture | success / retryable / permanent failure |
| `SystemClock` / `FixedClock` | `infra/src/clock_id.rs` | `ClockPort` | system or fixed time | deterministic timestamps |
| `SequenceIdGenerator` | `infra/src/clock_id.rs` | `IdGeneratorPort` | deterministic sequence | stable refs in tests |

#### 7.12 Step 8 前向引用闭合表

本 Step 允许在 trait 签名中前向引用协议 DTO / scope / receipt 类型,但这些类型的字段级 schema 不在本 Step 展开。它们必须在 Step 8 正式闭合;若 Step 8 未闭合,实现阶段必须暂停,不得由 agent 自行补字段。

| 前向引用类型 | 当前用途 | 必须在 Step 8 闭合的内容 |
|---|---|---|
| `RuntimeProcessShapeCommandResult` | `StoredProcessCommandResult::RuntimeShape` | result 字段、result_ref、receipt、duplicate 返回面 |
| `ProcessProfileCommandResult` | `StoredProcessCommandResult::ProcessProfile` | profile command result 字段和 duplicate surface |
| `ProcessInstanceCommandResult` | `StoredProcessCommandResult::ProcessInstance` | instance command result 字段和 initial refs |
| `ActivityProgressionCommandResult` | `StoredProcessCommandResult::ActivityProgression` | activity progression result 字段 |
| `WaitingGateCommandResult` | `StoredProcessCommandResult::WaitingGate` | waiting gate result 字段 |
| `ProcessCheckpointCommandResult` | `StoredProcessCommandResult::ProcessCheckpoint` | checkpoint result 字段 |
| `RecoveryAttemptCommandResult` | `StoredProcessCommandResult::RecoveryAttempt` | recovery result 字段 |
| `ProcessTimingCommandResult` | `StoredProcessCommandResult::ProcessTiming` | timing result 字段 |
| `ConsumerReceipt` | `StoredProcessOperationResult::Consumer` | inbound consumer duplicate replay receipt 字段和 disposition |
| `JobRunReceipt` | `StoredProcessOperationResult::Job` | operations job duplicate replay receipt 字段和 counters |
| `CommandMetadata` / `EventMetadata` / `JobMetadata` | idempotency / resolver / handoff metadata | actor、trace、request id、idempotency / dedup key、run id |
| public page DTO | query / job request and response | public request / response field names and mapping to `PageRequest` / `PageInfo` |
| `ProcessOutboxScope` | outbox pending scan | filter fields and ordering |
| `TraceHandoffScope` | trace handoff pending scan | filter fields and state set |
| `RecoveryMaintenanceScope` | recovery maintenance scan | filter fields and retry / expiry boundary |
| `ProcessSearchFilter` | projection search | allowed filters and stale behavior |
| `ProcessOutboundEventEnvelope` | publisher input | envelope metadata, event kind, payload, truth ref |
| `PublicationReceipt` | publish success | publication_ref、published_at、downstream ack marker |
| `TraceHandoffReceipt` / `ArchiveHandoffReceipt` | handoff success | receipt_ref、external_ref、delivered_at |
| `PublishFailureRef` / `HandoffFailureRef` | retryable / permanent errors | failure kind、retryable flag、reason ref |
| `ArchiveHandoffTargetRef` | archive handoff port | target identity, destination kind, retention / package ref boundary |
| `ArtifactEvidenceMarker` | artifact resolver result / reference marker repository input | evidence ref、evidence kind、resolution state;no artifact body |

#### 7.13 禁止跨越的接缝

| 禁止事项 | 正确做法 |
|---|---|
| `application` 直接使用 SQL / HTTP / bus client | 通过本 Step port trait |
| `domain` 调 repository 或 resolver | application 先加载对象 / snapshot,再调用 domain |
| `api` / `worker` / `jobs` 直接写 repository | 调用 application service / runner |
| resolver 返回外部正文 | 返回 snapshot / ref / marker |
| duplicate replay 从当前 truth / marker / counter 重算 result | 通过 `OperationResultRepository` 读取 stored result / receipt |
| repository 保存不带 expected version 的 mutable truth | 使用 `Versioned<T>` 读取和 `StorageVersion` 保存 |
| outbox publisher 从 repository 自行拼事件 | application outbox service 从 `ProcessOutboxRecord` 已保存的 payload snapshot 复制 Step 8 event DTO 生成 envelope |

### 8. 回填草稿

> 校准来源:
> - `design-calibration/03_ddd_step_07_trait_port_adapter_contracts.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“Trait / Port / Adapter 总表”“Truth Repository 契约”“External Resolver Port 契约”“Publisher / Handoff Port 契约”和“Infra Adapter 矩阵”小节,了解跨层依赖如何落到 `application` trait 与 `infra` adapter。

## 5.x Trait / Port / Adapter 契约

`application` 模块定义所有 repository、transaction、idempotency、operation result store、external resolver、publisher、handoff、clock 和 id generator port。`infra` 模块实现这些 trait。`domain` 不定义 repository / external client trait,也不访问持久化、bus、外部仓或 handoff adapter。

所有 mutable truth repository 读取返回 `Versioned<T>`,保存接收 `expected_version: StorageVersion` 和 `&mut dyn UnitOfWorkHandle`。所有写 command / consumer / job 必须在一个 unit of work 中保存 truth、trace、outbox、projection marker、idempotency completion 和 operation result / receipt。幂等 duplicate replay 必须读取 `OperationResultRepository`,不得从当前 truth、当前 marker 或 job counter 临时重算 result。

外部 resolver port 只返回本仓允许保存的 snapshot / ref / marker,不得返回 method、work、identity、governance、artifact、runtime 或 conversation 正文。outbox publisher 和 trace / archive handoff 只承接已形成的 public DTO / handoff ref,不得自行改写 Process truth。outbound event payload 是 `ProcessOutboxRecord.payload_snapshot` 的 committed transition snapshot,不是 publish job 按当前 repository 状态重算的 view。

### 9. 待确认事项

| 待确认项 | 当前处理 | 后续 Step |
|---|---|---|
| Operation result DTO 字段全集 | 本 Step 只定义 `StoredProcessCommandResult` 和 `StoredProcessOperationResult` variants,并在 7.12 列为前向引用 | Step 8 定义 request / result / receipt schema |
| Event / Job metadata 具体字段 | 本 Step 只引用 `CommandMetadata`、`EventMetadata`、`JobMetadata`,并在 7.12 列为前向引用 | Step 8 定义协议字段 |
| Page / scope public DTO | 本 Step 定义 application helper 和 repository scope,并在 7.12 列为前向引用 | Step 8 定义 query / job public DTO |
| Persistence table / index | 本 Step 只定义 repository trait | Step 11 定义持久化结构和事务一致性 |
| 错误到 API / job error 映射 | 本 Step 定义 port error variants | Step 12 定义全局错误恢复口径 |

### 10. 进入下一步条件

```text
所有跨模块、跨层、跨外部系统的实现接缝已有明确 trait / port / adapter 契约。
Step 8 可以基于这些 trait 定义 API / Command / Query / Event / Job 协议契约。
```
