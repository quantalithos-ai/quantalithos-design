# Step 7. 逐模块定义 Trait / Port / Adapter 契约

### 1. Step 状态

- 状态:[x] 已确认
- 对应 SOP:`standards/document/详细设计讨论流程_SOP.md` Step 7
- 回填章节:`03-详细设计.md` §5 模块实现契约中的 Trait / Port / Adapter 契约 / §6 全局对象与 Trait 索引

### 2. 本步输入

| 输入 | 内容 | 本步使用方式 |
|---|---|---|
| `03_ddd_step_05_module_contracts.md` | 模块主轴、依赖方向、trait 归属门禁 | 固定 trait 定义位置和实现方 |
| `03_ddd_step_06_object_contracts.md` | contracts shared type、domain object、application service object | 为 trait 参数、返回和错误类型提供对象来源 |
| `02_hld_step_07_api_interface_skeleton.md` | Command / Query / Consumer / Event / Job 骨架 | 确认需要哪些 repository、resolver、publisher、handoff port |
| `02_hld_step_08_processing_flows.md` | 概要级处理流 | 提取每条处理流需要读取 / 写入 / 发布 / 交接的接缝 |
| `03_ddd_step_03_constraints.md` | Rust 2024、源码英文、唯一编译期 sibling dependency | Rust code block 使用英文 rustdoc;只复用 `core-contracts` |
| `standards/document/设计真相源闭环与可落码性标准.md` | 可落码性和 trait 闭环标准 | 防止 trait 只有名称没有函数签名 |

### 3. 分批写入记录

本 Step 按 `设计文档讨论中间产物规范.md` §3.4 分批写入:

| 批次 | 内容 | 状态 |
|---|---|---|
| 7.1 | 文件骨架、SOP 问题回答、trait / port 总览、调用方 / 实现方矩阵、共享 helper | [x] |
| 7.2 | application repository trait 契约 | [x] |
| 7.3 | external resolver / publisher / handoff / technical port 契约 | [x] |
| 7.4 | infra adapter 契约、依赖只能经 trait 访问清单、闭环表和回填草稿 | [x] |

### 4. SOP 问题回答

1. 哪些模块需要定义 trait / port?

   回答:
   - `application` 需要定义全部 repository、projection、reference snapshot、outbox、idempotency、unit of work、external resolver、publisher、handoff、clock、id generator trait。
   - `infra` 只实现这些 trait,不反向定义业务 port。
   - `api`、`worker`、`jobs` 不定义业务 port,只通过 runtime builder 获得 application service。
   - `contracts` 和 `domain` 不定义 repository / adapter trait;`domain` policy 只接收已加载对象和 snapshot。

2. 哪些模块负责实现这些 trait / port?

   回答:`infra` 的 `repositories.rs`、`projection_stores.rs`、`reference_stores.rs`、`outbox_store.rs`、`idempotency_store.rs`、`source_resolvers.rs`、`publishers.rs`、`handoff_adapters.rs`、`clock_id.rs` 负责实现。P0 可提供 in-memory / fake adapter,后续 durable adapter 仍必须实现同一 application trait。

3. repository、outbox、projection、external client 的函数签名是什么?

   回答:本 Step §8~§11 给出 Rust trait snippet。所有函数均写参数、返回和错误类型。写入类 repository 必须显式接收 `&UnitOfWorkHandle`;external client 以 resolver / publisher / handoff port 表达,不得在 application 中直接使用 HTTP / bus / SDK concrete client。

4. 每个 trait 函数的参数类型、返回类型、错误类型是什么?

   回答:repository 使用 `Result<T, RepositoryError>`;external resolver / publisher / handoff 使用 `Result<T, PortError>`;unit of work 使用 `Result<T, UnitOfWorkError>`;idempotency 使用 `Result<T, IdempotencyError>`;clock / id generator 使用 `Result<T, PortError>`。service 层才把这些错误映射为 `ApplicationError`。

5. 哪些依赖只能通过 trait 访问,不能直接跨层调用?

   回答:DB / projection store / idempotency store / event bus / identity / conversation / method-library / process / governance / artifact / runtime / observability / archive / system clock / id generator 全部只能通过 `application` trait 访问。`application` 禁止直接依赖 `infra` concrete adapter 或 sibling repo crate。

### 5. 当前文档问题诊断

| 位置 | 当前问题 | 本步处理 |
|---|---|---|
| Step 6 `application` service object | 已列出 repository / resolver 主要依赖,但未给 trait 函数 | 本 Step 补完整 trait 和函数签名 |
| Step 6 projection DTO 边界 | view DTO 不得作为 truth,但 projection store 接口未定 | 本 Step 明确 projection port 只读 / replace / freshness 语义 |
| HLD Event Consumer | 只写“刷新快照 / reference state” | 本 Step 定义 snapshot repository、resolver port 和 consumer 可写边界 |
| HLD Operations Job | 只写“发布 outbox / 重建 projection / handoff” | 本 Step 定义 outbox publisher、projection repository、trace / archive handoff port |
| 外部依赖 | 多个 sibling repo 存在,容易误写 Cargo dependency | 本 Step 固定只能经 resolver / publisher / handoff trait 访问 |

### 6. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| repository | 只有对象和处理流中出现的读写动作 | 固定 application repository trait、函数签名和 UoW 参数 | 支撑实现者 1:1 落 `ports.rs` |
| projection | 只说明 read model 可滞后 / 可重建 | 固定 projection store port 和 `Page<T>` helper | 防止 query / rebuild 对分页、freshness 二次发明 |
| external seam | 只说明不保存外部正文 | 固定 identity / method / source / evidence / process resolver port | 防止 runtime 依赖混入 Cargo |
| outbox / handoff | 只说明发布失败不回滚 truth | 固定 outbox repository、publisher、trace / archive handoff port | 支撑 worker / jobs 实现 |
| technical port | UoW / id / clock / idempotency 只有 helper object | 固定 trait、reservation、duplicate / conflict 口径 | 支撑 command / job 幂等闭环 |

### 7. 结构化中间产物

#### 7.1 Trait / Port / Adapter 总览

| 名称 | 类型 | 定义位置 | 实现位置 | 作用 | 关键函数 |
|---|---|---|---|---|---|
| `ProjectRepository` | repository trait | `application/src/ports.rs` | `infra/src/repositories.rs` | Project truth 读写 | `get`、`save`、`list_by_owner` |
| `ProjectMemberRepository` | repository trait | `application/src/ports.rs` | `infra/src/repositories.rs` | ProjectMember truth 读写 | `get`、`get_by_member`、`save` |
| `BacklogRepository` | repository trait | `application/src/ports.rs` | `infra/src/repositories.rs` | Backlog truth 和正式工作集合关系 | `get_by_project`、`save`、`contains_formal_work` |
| `WorkItemRepository` | repository trait | `application/src/ports.rs` | `infra/src/repositories.rs` | WorkItem / ChildWorkItem truth 读写 | `get_formal_work`、`save_work_item`、`save_child_work_item` |
| `PromoteRepository` | repository trait | `application/src/ports.rs` | `infra/src/repositories.rs` | PromoteResult 和 decision history | `get`、`save`、`append_decision` |
| `DependencyRepository` | repository trait | `application/src/ports.rs` | `infra/src/repositories.rs` | Dependency / blocker truth 与 graph snapshot | `get_dependency`、`save_dependency`、`list_active_for_work` |
| `IterationRepository` | repository trait | `application/src/ports.rs` | `infra/src/repositories.rs` | Iteration / commitment truth | `get_iteration`、`save_iteration`、`save_commitment` |
| `AuditRepository` | repository trait | `application/src/ports.rs` | `infra/src/repositories.rs` | trace / audit trail 持久化 | `append_trace`、`append_audit`、`list_trace_records` |
| `WorkOutboxRepository` | repository trait | `application/src/ports.rs` | `infra/src/outbox_store.rs` | outbox record 存取和发布状态 | `enqueue`、`list_pending`、`mark_published` |
| `ProjectionRepository` | projection port | `application/src/ports.rs` | `infra/src/projection_stores.rs` | public read view 与 freshness state | `get_board_view`、`replace_project_views`、`mark_stale` |
| `ReferenceSnapshotRepository` | repository trait | `application/src/ports.rs` | `infra/src/reference_stores.rs` | 本地 external snapshot / resolution state | `save_member_snapshot`、`get_reference_state` |
| `IdempotencyRepository` | technical repository | `application/src/idempotency.rs` | `infra/src/idempotency_store.rs` | command / event / job 幂等保护 | `reserve`、`complete`、`mark_conflict` |
| `CommandResultRepository` | technical repository | `application/src/results.rs` | `infra/src/command_result_store.rs` | command duplicate result replay | `save_result`、`get_result` |
| `UnitOfWork` / `UnitOfWorkHandle` | technical port | `application/src/unit_of_work.rs` | `infra/src/repositories.rs` | 本地事务边界 | `begin`、`commit`、`rollback` |
| `IdGeneratorPort` | technical port | `application/src/ports.rs` | `infra/src/clock_id.rs` | Work-owned id 生成 | `next_project_id`、`next_work_item_id` 等 |
| `ClockPort` | technical port | `application/src/ports.rs` | `infra/src/clock_id.rs` | 时间戳来源 | `now` |
| `ActorMemberResolverPort` | external resolver port | `application/src/ports.rs` | `infra/src/source_resolvers.rs` | query actor 到 identity member ref 的安全解析 | `resolve_actor_member` |
| `MemberReferencePort` | external resolver port | `application/src/ports.rs` | `infra/src/source_resolvers.rs` | identity member capability summary | `resolve_member_capability` |
| `MethodDefinitionResolverPort` | external resolver port | `application/src/ports.rs` | `infra/src/source_resolvers.rs` | method definition snapshot | `resolve_definition` |
| `SourceWorkResolverPort` | external resolver port | `application/src/ports.rs` | `infra/src/source_resolvers.rs` | conversation / runtime / artifact / governance 来源摘要 | `resolve_source_work` |
| `EvidenceResolverPort` | external resolver port | `application/src/ports.rs` | `infra/src/source_resolvers.rs` | completion / blocker evidence 验证 | `resolve_evidence` |
| `ProcessTimeboxResolverPort` | external resolver port | `application/src/ports.rs` | `infra/src/source_resolvers.rs` | process timebox summary | `resolve_timebox` |
| `WorkOutboxPublisherPort` | publisher port | `application/src/ports.rs` | `infra/src/publishers.rs` | outbound event 发布 | `publish` |
| `TraceHandoffPort` | handoff port | `application/src/ports.rs` | `infra/src/handoff_adapters.rs` | observability trace handoff | `prepare_trace_handoff` |
| `ArchiveHandoffPort` | handoff port | `application/src/ports.rs` | `infra/src/handoff_adapters.rs` | archive handoff marker | `prepare_archive_handoff` |

#### 7.2 调用方 / 实现方关系矩阵

| Trait / Port | 主要调用方 | 实现方 | 允许被谁直接持有 | 禁止 |
|---|---|---|---|---|
| truth repository traits | application command / query / job service | infra repository adapters | application service struct | domain / contracts / api / worker / jobs 直接持有 |
| projection repository | query service、derived maintenance service | infra projection store | application service struct | query handler 直接读 store |
| reference snapshot repository | consumer service、reference refresh job、command service | infra reference store | application service struct | external adapter 直接写 truth |
| idempotency repository | command / consumer / job service | infra idempotency store | application service struct | handler 自行判重 |
| unit of work | command / consumer / job service | infra transaction adapter | application service struct | repository 自行开启不可见事务 |
| resolver ports | command / consumer / job service | infra resolver adapters | application service struct | Cargo 依赖 sibling repo |
| publisher / handoff ports | outbox / trace / archive service | infra publisher / handoff adapters | application service struct | domain 直接发布 event |
| clock / id ports | application service | infra clock / id adapter | application service struct | domain 访问系统时间或随机数 |

#### 7.3 共享 helper 与错误边界

```rust
/// A repository page returned before public query mapping.
pub struct Page<T> {
    /// Items returned by repository read.
    pub items: Vec<T>,
    /// Cursor metadata for the next repository read.
    pub page_info: PageInfo,
}

/// Cursor metadata for repository page reads.
pub struct PageInfo {
    /// Token for the next page.
    pub next_page_token: Option<PageToken>,
    /// Whether more repository items may exist.
    pub has_more: bool,
}

/// Classifies persistence and local store failures before service mapping.
pub enum RepositoryError {
    /// The requested record does not exist.
    NotFound,
    /// The expected optimistic version did not match the stored version.
    VersionConflict,
    /// The local transaction boundary rejected the operation.
    TransactionRejected,
    /// The store is unavailable or failed for a technical reason.
    StoreUnavailable,
}

/// Classifies external resolver, publisher, and handoff failures.
pub enum PortError {
    /// The referenced external object could not be resolved.
    NotFound,
    /// The external reference exists but cannot be used by this operation.
    Rejected,
    /// The external dependency is temporarily unavailable.
    Unavailable,
    /// The external dependency returned an invalid or unsupported response.
    InvalidResponse,
}
```

| Helper / Error | 定义位置 | 使用方 | 约束 |
|---|---|---|---|
| `Page<T>` | `application/src/ports.rs` | repository read / query service | 不是 public DTO;Step 8 必须映射到 query response page 字段 |
| `PageInfo` | `application/src/ports.rs` | repository read / query service | `next_page_token` 复用 core `PageToken` |
| `RepositoryError` | `application/src/errors.rs` 或 `ports.rs` | repository trait | 不直接暴露给 API consumer |
| `PortError` | `application/src/errors.rs` 或 `ports.rs` | resolver / publisher / handoff port | application service 映射为 `ApplicationError` |

#### 7.4 repository trait 通用约束

| 约束 | 正式口径 |
|---|---|
| 定义位置 | 全部 repository trait 定义在 `application/src/ports.rs` |
| 实现位置 | fake / durable adapter 实现在 `infra` 对应文件 |
| 事务参数 | create / save / append / enqueue / replace / mark 等写函数必须接收 `&UnitOfWorkHandle` |
| 乐观锁 | 更新既有 truth 的 save 函数必须接收 `expected_version: Version`;创建函数使用 `Version` 返回值表达初始版本 |
| 版本读取闭环 | 任一 flow 调用 `save(..., expected_version, &uow)` 时,`expected_version` 来源必须在同一设计中闭合:来自 public request、前置 create 返回值,或 repository 带 version 的读取函数;service 内部级联更新不得使用未定义的临时 version |
| 查询分页 | repository 内部分页使用 `Page<T>` 和 core `PageRequest` / `PageToken`;public query page DTO 留给 Step 8 |
| 错误类型 | repository 不返回 `ApplicationError`;由 application service 做错误映射 |
| 外部正文 | repository 不保存 identity / conversation / method / process / governance / artifact / runtime 正文 |

### 8. Repository Trait 契约

#### 8.1 `ProjectRepository`

```rust
/// Stores Work-owned project truth.
pub trait ProjectRepository {
    /// Loads a project by stable Work identity.
    async fn get(&self, project_ref: ProjectRef) -> Result<Option<Project>, RepositoryError>;

    /// Lists projects owned by the same external owner.
    async fn list_by_owner(
        &self,
        owner_ref: ProjectOwnerRef,
        page: PageRequest,
    ) -> Result<Page<Project>, RepositoryError>;

    /// Creates a project inside the current unit of work.
    async fn create(
        &self,
        project: Project,
        uow: &UnitOfWorkHandle,
    ) -> Result<Version, RepositoryError>;

    /// Saves a project lifecycle change inside the current unit of work.
    async fn save(
        &self,
        project: Project,
        expected_version: Version,
        uow: &UnitOfWorkHandle,
    ) -> Result<Version, RepositoryError>;
}
```

| 函数 | 参数 | 返回 | 错误 | 调用方 | 约束 |
|---|---|---|---|---|---|
| `get` | `ProjectRef` | `Option<Project>` | `RepositoryError` | command / query service | not found 返回 `None`,由 service 映射 |
| `list_by_owner` | `ProjectOwnerRef`、`PageRequest` | `Page<Project>` | `RepositoryError` | query / reconciliation job | 不读取 owner 正文 |
| `create` | `Project`、`&UnitOfWorkHandle` | `Version` | `RepositoryError` | `CreateProject` | 同一 UoW 内还要创建 Backlog、audit、outbox |
| `save` | `Project`、`expected_version`、`&UnitOfWorkHandle` | `Version` | `RepositoryError` | lifecycle command | version conflict 不得覆盖 |

#### 8.2 `ProjectMemberRepository`

```rust
/// Stores project-local member responsibility truth.
pub trait ProjectMemberRepository {
    /// Loads a project member responsibility by Work identity.
    async fn get(
        &self,
        member_ref: ProjectMemberRef,
    ) -> Result<Option<ProjectMember>, RepositoryError>;

    /// Loads a project-local responsibility for an identity member.
    async fn get_by_member(
        &self,
        project_ref: ProjectRef,
        member_ref: GlobalMemberRef,
    ) -> Result<Option<ProjectMember>, RepositoryError>;

    /// Lists active or historical responsibilities for one project.
    async fn list_by_project(
        &self,
        project_ref: ProjectRef,
        page: PageRequest,
    ) -> Result<Page<ProjectMember>, RepositoryError>;

    /// Lists all Work-owned project responsibilities for one identity member.
    async fn list_by_member(
        &self,
        member_ref: GlobalMemberRef,
        page: PageRequest,
    ) -> Result<Page<ProjectMember>, RepositoryError>;

    /// Creates a responsibility record inside the current unit of work.
    async fn create(
        &self,
        project_member: ProjectMember,
        uow: &UnitOfWorkHandle,
    ) -> Result<Version, RepositoryError>;

    /// Saves a responsibility state change inside the current unit of work.
    async fn save(
        &self,
        project_member: ProjectMember,
        expected_version: Version,
        uow: &UnitOfWorkHandle,
    ) -> Result<Version, RepositoryError>;
}
```

| 函数 | 参数 | 返回 | 错误 | 调用方 | 约束 |
|---|---|---|---|---|---|
| `get` | `ProjectMemberRef` | `Option<ProjectMember>` | `RepositoryError` | update responsibility / query | 不解析 identity 正文 |
| `get_by_member` | `ProjectRef`、`GlobalMemberRef` | `Option<ProjectMember>` | `RepositoryError` | assign / authorization | 用于防重复承担 |
| `list_by_project` | `ProjectRef`、`PageRequest` | `Page<ProjectMember>` | `RepositoryError` | query / projection rebuild | 可返回 released 历史,过滤口径 Step 8 |
| `list_by_member` | `GlobalMemberRef`、`PageRequest` | `Page<ProjectMember>` | `RepositoryError` | identity member consumer stale scope | 只枚举 Work-owned ProjectMember truth;不得解析 identity 正文;稳定排序 |
| `create` / `save` | truth、version / UoW | `Version` | `RepositoryError` | command service | 写入与 audit / outbox 同 UoW |

#### 8.3 `BacklogRepository`

```rust
/// Stores backlog truth and formal work membership.
pub trait BacklogRepository {
    /// Loads a backlog by Work identity.
    async fn get(&self, backlog_ref: BacklogRef) -> Result<Option<Backlog>, RepositoryError>;

    /// Loads the backlog that owns a project.
    async fn get_by_project(
        &self,
        project_ref: ProjectRef,
    ) -> Result<Option<Backlog>, RepositoryError>;

    /// Loads the project backlog with its optimistic version for internal linked updates.
    async fn get_by_project_with_version(
        &self,
        project_ref: ProjectRef,
    ) -> Result<Option<(Backlog, Version)>, RepositoryError>;

    /// Checks whether a formal work ref belongs to the backlog.
    async fn contains_formal_work(
        &self,
        backlog_ref: BacklogRef,
        work_ref: FormalWorkRef,
    ) -> Result<bool, RepositoryError>;

    /// Creates a backlog inside the current unit of work.
    async fn create(
        &self,
        backlog: Backlog,
        uow: &UnitOfWorkHandle,
    ) -> Result<Version, RepositoryError>;

    /// Saves backlog availability changes inside the current unit of work.
    async fn save(
        &self,
        backlog: Backlog,
        expected_version: Version,
        uow: &UnitOfWorkHandle,
    ) -> Result<Version, RepositoryError>;

    /// Adds a formal work ref to a backlog membership set.
    async fn add_formal_work(
        &self,
        backlog_ref: BacklogRef,
        work_ref: FormalWorkRef,
        uow: &UnitOfWorkHandle,
    ) -> Result<(), RepositoryError>;
}
```

| 函数 | 参数 | 返回 | 错误 | 调用方 | 约束 |
|---|---|---|---|---|---|
| `get_by_project` | `ProjectRef` | `Option<Backlog>` | `RepositoryError` | create work / query | Project 不存在由 service 判定 |
| `get_by_project_with_version` | `ProjectRef` | `Option<(Backlog, Version)>` | `RepositoryError` | project archive linked update | 仅供需要立即 `save(backlog, expected_version, &uow)` 的内部级联写路径;返回 version 是 optimistic save 的唯一正式来源 |
| `contains_formal_work` | `BacklogRef`、`FormalWorkRef` | `bool` | `RepositoryError` | iteration / dependency policy | 只查 membership,不查外部 plan |
| `add_formal_work` | `BacklogRef`、`FormalWorkRef`、UoW | `()` | `RepositoryError` | create work / promote accept | 必须与 work truth 创建同 UoW |

#### 8.4 `WorkItemRepository`

```rust
/// Stores formal work item and child work item truth.
pub trait WorkItemRepository {
    /// Loads a formal work record by a unified formal work reference.
    async fn get_formal_work(
        &self,
        work_ref: FormalWorkRef,
    ) -> Result<Option<FormalWorkRecord>, RepositoryError>;

    /// Loads a formal work record by reference together with its optimistic version.
    async fn get_formal_work_with_version(
        &self,
        work_ref: FormalWorkRef,
    ) -> Result<Option<(FormalWorkRecord, Version)>, RepositoryError>;

    /// Loads the project and projection scope for a formal work reference.
    async fn get_formal_work_scope(
        &self,
        work_ref: FormalWorkRef,
    ) -> Result<Option<FormalWorkScope>, RepositoryError>;

    /// Loads a root work item.
    async fn get_work_item(
        &self,
        work_item_id: WorkItemId,
    ) -> Result<Option<WorkItem>, RepositoryError>;

    /// Loads a child work item.
    async fn get_child_work_item(
        &self,
        child_work_item_id: ChildWorkItemId,
    ) -> Result<Option<ChildWorkItem>, RepositoryError>;

    /// Lists formal work refs in a backlog.
    async fn list_by_backlog(
        &self,
        backlog_ref: BacklogRef,
        page: PageRequest,
    ) -> Result<Page<FormalWorkRef>, RepositoryError>;

    /// Creates a root work item inside the current unit of work.
    async fn create_work_item(
        &self,
        work_item: WorkItem,
        uow: &UnitOfWorkHandle,
    ) -> Result<Version, RepositoryError>;

    /// Creates a child work item inside the current unit of work.
    async fn create_child_work_item(
        &self,
        child_work_item: ChildWorkItem,
        uow: &UnitOfWorkHandle,
    ) -> Result<Version, RepositoryError>;

    /// Saves a formal work lifecycle change inside the current unit of work.
    async fn save_formal_work(
        &self,
        record: FormalWorkRecord,
        expected_version: Version,
        uow: &UnitOfWorkHandle,
    ) -> Result<Version, RepositoryError>;
}

/// Repository-loaded formal work truth.
pub enum FormalWorkRecord {
    /// A root work item record.
    WorkItem(WorkItem),
    /// A child work item record.
    ChildWorkItem(ChildWorkItem),
}

/// Repository-derived scope for relation policy and projection invalidation.
pub struct FormalWorkScope {
    /// Formal work reference that was resolved.
    pub work_ref: FormalWorkRef,
    /// Project that owns the formal work through backlog membership.
    pub project_ref: ProjectRef,
    /// Owning backlog.
    pub backlog_ref: BacklogRef,
    /// Assignee whose member-work view is affected, when known.
    pub assignee_ref: Option<ProjectMemberRef>,
}
```

| 函数 | 参数 | 返回 | 错误 | 调用方 | 约束 |
|---|---|---|---|---|---|
| `get_formal_work` | `FormalWorkRef` | `Option<FormalWorkRecord>` | `RepositoryError` | lifecycle / dependency / iteration / query | 统一 root / child 读取 |
| `get_formal_work_with_version` | `FormalWorkRef` | `Option<(FormalWorkRecord, Version)>` | `RepositoryError` | iteration work mark / membership write paths | 仅供需要立即 `save_formal_work(record, expected_version, &uow)` 的写路径;返回 version 是 formal work optimistic save 的唯一正式来源 |
| `get_formal_work_scope` | `FormalWorkRef` | `Option<FormalWorkScope>` | `RepositoryError` | dependency / blocker command、projection stale 构造 | 只读 scope 解析;不得从 `FormalWorkRef` 字符串推断 project;root work 由 backlog membership 得到 project / backlog / assignee;child work 必须经 parent root / membership 得到 project / backlog,无法稳定得到 assignee 时返回 `assignee_ref = None` |
| `list_by_backlog` | `BacklogRef`、`PageRequest` | `Page<FormalWorkRef>` | `RepositoryError` | query / projection rebuild | 只返回正式工作引用 |
| `create_*` | work truth、UoW | `Version` | `RepositoryError` | create / promote accept | 不保存 source body |
| `save_formal_work` | `FormalWorkRecord`、version、UoW | `Version` | `RepositoryError` | lifecycle command | 必须按实际 variant 保存 |

#### 8.5 `PromoteRepository`

```rust
/// Stores promote decisions and their audit history.
pub trait PromoteRepository {
    /// Loads a promote result by Work identity.
    async fn get(
        &self,
        promote_result_ref: PromoteResultRef,
    ) -> Result<Option<PromoteResult>, RepositoryError>;

    /// Finds the latest promote result for a source reference.
    async fn find_latest_by_source(
        &self,
        source_ref: SourceWorkRef,
    ) -> Result<Option<PromoteResult>, RepositoryError>;

    /// Creates a promote result inside the current unit of work.
    async fn create(
        &self,
        result: PromoteResult,
        uow: &UnitOfWorkHandle,
    ) -> Result<Version, RepositoryError>;

    /// Saves a promote decision state change inside the current unit of work.
    async fn save(
        &self,
        result: PromoteResult,
        expected_version: Version,
        uow: &UnitOfWorkHandle,
    ) -> Result<Version, RepositoryError>;

    /// Appends a promote decision history record.
    async fn append_decision(
        &self,
        decision: PromoteDecisionRecord,
        uow: &UnitOfWorkHandle,
    ) -> Result<(), RepositoryError>;

    /// Saves an inbound runtime promote request marker without creating promote truth.
    async fn save_pending_intake(
        &self,
        intake: PendingPromoteIntake,
        uow: &UnitOfWorkHandle,
    ) -> Result<(), RepositoryError>;
}
```

| 函数 | 参数 | 返回 | 错误 | 调用方 | 约束 |
|---|---|---|---|---|---|
| `get` | `PromoteResultRef` | `Option<PromoteResult>` | `RepositoryError` | review promote / trace visibility | 不读取 source body;query visibility 对 missing / pending promote fail-closed |
| `find_latest_by_source` | `SourceWorkRef` | `Option<PromoteResult>` | `RepositoryError` | request promote / dedup semantic check | 不读取 source body |
| `append_decision` | `PromoteDecisionRecord`、UoW | `()` | `RepositoryError` | review promote | 与 result save / work create 同 UoW |
| `save_pending_intake` | `PendingPromoteIntake`、UoW | `()` | `RepositoryError` | runtime promote consumer | 不创建 `PromoteResult`,不 enqueue promote result event |

#### 8.6 `DependencyRepository`

```rust
/// Stores dependency and blocker truth for formal work.
pub trait DependencyRepository {
    /// Loads a dependency relation.
    async fn get_dependency(
        &self,
        dependency_ref: WorkDependencyRef,
    ) -> Result<Option<WorkDependency>, RepositoryError>;

    /// Loads a work blocker.
    async fn get_blocker(
        &self,
        blocker_ref: WorkBlockerRef,
    ) -> Result<Option<WorkBlocker>, RepositoryError>;

    /// Lists active dependency and blocker refs for a formal work record.
    async fn list_active_for_work(
        &self,
        work_ref: FormalWorkRef,
        page: PageRequest,
    ) -> Result<Page<DependencyOrBlockerRef>, RepositoryError>;

    /// Loads the graph snapshot needed by dependency policy.
    async fn load_graph_snapshot(
        &self,
        project_ref: ProjectRef,
    ) -> Result<DependencyGraphSnapshot, RepositoryError>;

    /// Creates a dependency relation inside the current unit of work.
    async fn create_dependency(
        &self,
        dependency: WorkDependency,
        uow: &UnitOfWorkHandle,
    ) -> Result<Version, RepositoryError>;

    /// Saves a dependency relation state change.
    async fn save_dependency(
        &self,
        dependency: WorkDependency,
        expected_version: Version,
        uow: &UnitOfWorkHandle,
    ) -> Result<Version, RepositoryError>;

    /// Creates a blocker inside the current unit of work.
    async fn create_blocker(
        &self,
        blocker: WorkBlocker,
        uow: &UnitOfWorkHandle,
    ) -> Result<Version, RepositoryError>;

    /// Saves a blocker state change.
    async fn save_blocker(
        &self,
        blocker: WorkBlocker,
        expected_version: Version,
        uow: &UnitOfWorkHandle,
    ) -> Result<Version, RepositoryError>;

    /// Appends dependency or blocker history.
    async fn append_change(
        &self,
        change: DependencyChangeRecord,
        uow: &UnitOfWorkHandle,
    ) -> Result<(), RepositoryError>;
}

// DependencyGraphSnapshot is domain-owned; see Step 6 `domain/dependency.rs`.
```

| 函数 | 参数 | 返回 | 错误 | 调用方 | 约束 |
|---|---|---|---|---|---|
| `get_dependency` / `get_blocker` | relation ref | `Option<WorkDependency>` / `Option<WorkBlocker>` | `RepositoryError` | update relation / trace visibility | query visibility 只读取 formal work refs,不得暴露 cause / evidence body |
| `load_graph_snapshot` | `ProjectRef` | `DependencyGraphSnapshot` | `RepositoryError` | dependency graph policy | 不含 governance 正文 |
| `append_change` | `DependencyChangeRecord`、UoW | `()` | `RepositoryError` | dependency / blocker command | 不替代当前 truth |

#### 8.7 `IterationRepository`

```rust
/// Stores Work-owned iteration and commitment truth.
pub trait IterationRepository {
    /// Loads an iteration by Work identity.
    async fn get_iteration(
        &self,
        iteration_ref: IterationRef,
    ) -> Result<Option<Iteration>, RepositoryError>;

    /// Loads the current commitment for an iteration.
    async fn get_commitment(
        &self,
        iteration_ref: IterationRef,
    ) -> Result<Option<IterationCommitment>, RepositoryError>;

    /// Loads the current commitment together with its optimistic version.
    async fn get_commitment_with_version(
        &self,
        iteration_ref: IterationRef,
    ) -> Result<Option<(IterationCommitment, Version)>, RepositoryError>;

    /// Lists iterations for a project.
    async fn list_by_project(
        &self,
        project_ref: ProjectRef,
        page: PageRequest,
    ) -> Result<Page<Iteration>, RepositoryError>;

    /// Creates an iteration inside the current unit of work.
    async fn create_iteration(
        &self,
        iteration: Iteration,
        uow: &UnitOfWorkHandle,
    ) -> Result<Version, RepositoryError>;

    /// Saves an iteration lifecycle change.
    async fn save_iteration(
        &self,
        iteration: Iteration,
        expected_version: Version,
        uow: &UnitOfWorkHandle,
    ) -> Result<Version, RepositoryError>;

    /// Creates or replaces an iteration commitment.
    async fn save_commitment(
        &self,
        commitment: IterationCommitment,
        expected_version: Option<Version>,
        uow: &UnitOfWorkHandle,
    ) -> Result<Version, RepositoryError>;

    /// Appends iteration history.
    async fn append_change(
        &self,
        change: IterationChangeRecord,
        uow: &UnitOfWorkHandle,
    ) -> Result<(), RepositoryError>;
}
```

| 函数 | 参数 | 返回 | 错误 | 调用方 | 约束 |
|---|---|---|---|---|---|
| `get_commitment` | `IterationRef` | `Option<IterationCommitment>` | `RepositoryError` | commit / update / query | no commitment 返回 `None`;不提供 optimistic version |
| `get_commitment_with_version` | `IterationRef` | `Option<(IterationCommitment, Version)>` | `RepositoryError` | lifecycle close / immediate commitment save path | 仅供需要紧随其后 `save_commitment(commitment, Some(version), &uow)` 的写路径;返回 version 是 close path commitment optimistic save 的唯一正式来源 |
| `save_commitment` | `IterationCommitment`、`Option<Version>`、UoW | `Version` | `RepositoryError` | commit / update | `None` 只用于首次创建 |
| `append_change` | `IterationChangeRecord`、UoW | `()` | `RepositoryError` | iteration commands | 与 state change 同 UoW |

#### 8.8 `AuditRepository`

```rust
/// Stores Work trace and audit records.
pub trait AuditRepository {
    /// Loads the audit trail for a Work subject.
    async fn get_audit_trail(
        &self,
        subject_ref: WorkAuditSubjectRef,
    ) -> Result<Option<WorkAuditTrail>, RepositoryError>;

    /// Appends a trace record inside the current unit of work.
    async fn append_trace(
        &self,
        record: WorkTraceRecord,
        uow: &UnitOfWorkHandle,
    ) -> Result<(), RepositoryError>;

    /// Creates or updates an audit trail inside the current unit of work.
    async fn save_audit_trail(
        &self,
        audit_trail: WorkAuditTrail,
        expected_version: Option<Version>,
        uow: &UnitOfWorkHandle,
    ) -> Result<Version, RepositoryError>;

    /// Lists trace records for a subject.
    async fn list_trace_records(
        &self,
        subject_ref: WorkTraceSubjectRef,
        page: PageRequest,
    ) -> Result<Page<WorkTraceRecord>, RepositoryError>;

    /// Loads one trace record by Work trace id for handoff visibility resolution.
    async fn get_trace_record(
        &self,
        trace_id: WorkTraceId,
    ) -> Result<Option<WorkTraceRecord>, RepositoryError>;

    /// Loads a trace handoff marker by external handoff ref for trace query visibility.
    async fn get_trace_handoff_marker(
        &self,
        handoff_ref: TraceHandoffRef,
    ) -> Result<Option<TraceHandoffMarker>, RepositoryError>;

    /// Saves a trace handoff marker inside the current unit of work.
    async fn save_trace_handoff_marker(
        &self,
        marker: TraceHandoffMarker,
        uow: &UnitOfWorkHandle,
    ) -> Result<(), RepositoryError>;

    /// Saves an archive handoff marker inside the current unit of work.
    async fn save_archive_handoff_marker(
        &self,
        marker: ArchiveHandoffMarker,
        uow: &UnitOfWorkHandle,
    ) -> Result<(), RepositoryError>;
}
```

| 函数 | 参数 | 返回 | 错误 | 调用方 | 约束 |
|---|---|---|---|---|---|
| `append_trace` | `WorkTraceRecord`、UoW | `()` | `RepositoryError` | command / consumer / handoff job | 不写 observability 正文 |
| `save_audit_trail` | `WorkAuditTrail`、`Option<Version>`、UoW | `Version` | `RepositoryError` | command / consumer | `None` 只用于新 subject |
| `list_trace_records` | `WorkTraceSubjectRef`、`PageRequest` | `Page<WorkTraceRecord>` | `RepositoryError` | query / handoff job | page helper 非 public DTO |
| `get_trace_record` | `WorkTraceId` | `Option<WorkTraceRecord>` | `RepositoryError` | trace visibility / handoff job | 只读 trace metadata;不得返回 observability log body |
| `get_trace_handoff_marker` | `TraceHandoffRef` | `Option<TraceHandoffMarker>` | `RepositoryError` | trace visibility | 只读 marker;marker missing 在 query 授权中映射 `NotVisible` |
| `save_trace_handoff_marker` | `TraceHandoffMarker`、UoW | `()` | `RepositoryError` | trace handoff job | 只保存 handoff ref,不写 observability 正文 |
| `save_archive_handoff_marker` | `ArchiveHandoffMarker`、UoW | `()` | `RepositoryError` | archive handoff job | 只保存 archive handoff ref,不写 archive 长期正文 |

#### 8.9 `WorkOutboxRepository`

```rust
/// Stores Work outbox records and publication state.
pub trait WorkOutboxRepository {
    /// Enqueues a committed Work outbox record inside the current unit of work.
    async fn enqueue(
        &self,
        record: WorkOutboxRecord,
        uow: &UnitOfWorkHandle,
    ) -> Result<(), RepositoryError>;

    /// Loads pending outbox records for publication.
    async fn list_pending(
        &self,
        page: PageRequest,
    ) -> Result<Page<WorkOutboxRecord>, RepositoryError>;

    /// Loads one outbox record.
    async fn get(
        &self,
        outbox_id: WorkOutboxId,
    ) -> Result<Option<WorkOutboxRecord>, RepositoryError>;

    /// Marks an outbox record as published.
    async fn mark_published(
        &self,
        outbox_id: WorkOutboxId,
        publication_ref: OutboxPublicationRef,
        expected_version: Version,
        uow: &UnitOfWorkHandle,
    ) -> Result<Version, RepositoryError>;

    /// Marks an outbox record as failed and retryable.
    async fn mark_failed(
        &self,
        outbox_id: WorkOutboxId,
        reason: OutboxFailureReason,
        expected_version: Version,
        uow: &UnitOfWorkHandle,
    ) -> Result<Version, RepositoryError>;

    /// Marks a failed outbox record as pending when retry policy accepts it.
    async fn mark_pending_for_retry(
        &self,
        outbox_id: WorkOutboxId,
        reason: OutboxRetryReason,
        expected_version: Version,
        uow: &UnitOfWorkHandle,
    ) -> Result<Version, RepositoryError>;
}
```

| 函数 | 参数 | 返回 | 错误 | 调用方 | 约束 |
|---|---|---|---|---|---|
| `enqueue` | `WorkOutboxRecord`、UoW | `()` | `RepositoryError` | command / consumer service | 与 truth 写入同 UoW |
| `list_pending` | `PageRequest` | `Page<WorkOutboxRecord>` | `RepositoryError` | outbox publisher job / worker | 不锁定 bus topic |
| `mark_published` / `mark_failed` | outbox id、publication / reason、version、UoW | `Version` | `RepositoryError` | publish job | 发布状态失败不回滚 truth |
| `mark_pending_for_retry` | outbox id、retry reason、version、UoW | `Version` | `RepositoryError` | publish retry job / worker | 只允许 failed record 重新进入 pending |

#### 8.10 `ProjectionRepository`

```rust
/// Stores derived Work read views and their freshness state.
pub trait ProjectionRepository {
    /// Loads a project board view and freshness marker.
    async fn get_project_board_view(
        &self,
        project_ref: ProjectRef,
    ) -> Result<Option<ProjectBoardViewProjection>, RepositoryError>;

    /// Loads member work view and freshness marker.
    async fn get_member_work_view(
        &self,
        member_ref: ProjectMemberRef,
    ) -> Result<Option<MemberWorkViewProjection>, RepositoryError>;

    /// Loads iteration summary view and freshness marker.
    async fn get_iteration_summary_view(
        &self,
        iteration_ref: IterationRef,
    ) -> Result<Option<IterationSummaryViewProjection>, RepositoryError>;

    /// Searches the work projection.
    async fn search_work(
        &self,
        project_ref: ProjectRef,
        criteria: WorkSearchCriteria,
        page: PageRequest,
    ) -> Result<Page<WorkSearchProjection>, RepositoryError>;

    /// Loads freshness state for a derived Work view.
    async fn get_freshness_state(
        &self,
        view_ref: DerivedWorkViewRef,
    ) -> Result<Option<DerivedWorkViewState>, RepositoryError>;

    /// Lists freshness states for reconciliation or inspection.
    async fn list_freshness_states(
        &self,
        scope_ref: WorkReconciliationScopeRef,
        page: PageRequest,
    ) -> Result<Page<DerivedWorkViewState>, RepositoryError>;

    /// Lists already-existing public view refs whose projection source index depends on an identity member.
    async fn list_views_affected_by_member(
        &self,
        member_ref: GlobalMemberRef,
        page: PageRequest,
    ) -> Result<Page<DerivedWorkViewRef>, RepositoryError>;

    /// Lists already-existing public view refs whose projection source index depends on a method definition.
    async fn list_views_affected_by_method(
        &self,
        definition_ref: MethodDefinitionRef,
        page: PageRequest,
    ) -> Result<Page<DerivedWorkViewRef>, RepositoryError>;

    /// Replaces project-scoped derived views after a rebuild from truth.
    async fn replace_project_views(
        &self,
        views: ProjectProjectionBatch,
        source_cursor: WorkTruthCursor,
        uow: &UnitOfWorkHandle,
    ) -> Result<(), RepositoryError>;

    /// Marks affected derived views stale after a truth or snapshot change.
    async fn mark_stale(
        &self,
        affected: Vec<DerivedWorkViewRef>,
        source_cursor: WorkTruthCursor,
        uow: &UnitOfWorkHandle,
    ) -> Result<(), RepositoryError>;

    /// Marks selected derived views as rebuilding at the given source cursor.
    async fn mark_rebuilding(
        &self,
        affected: Vec<DerivedWorkViewRef>,
        source_cursor: WorkTruthCursor,
        uow: &UnitOfWorkHandle,
    ) -> Result<(), RepositoryError>;

    /// Marks selected derived views as failed without modifying business truth.
    async fn mark_failed(
        &self,
        affected: Vec<DerivedWorkViewRef>,
        source_cursor: WorkTruthCursor,
        reason: ProjectionFailureReason,
        uow: &UnitOfWorkHandle,
    ) -> Result<(), RepositoryError>;
}

/// Internal projection wrapper used before public query DTO mapping.
pub struct ProjectBoardViewProjection {
    /// Public board view DTO.
    pub view: ProjectBoardView,
    /// Derived freshness state.
    pub freshness: DerivedWorkViewState,
}

/// Internal projection wrapper used before public query DTO mapping.
pub struct MemberWorkViewProjection {
    /// Public member work view DTO.
    pub view: MemberWorkView,
    /// Derived freshness state.
    pub freshness: DerivedWorkViewState,
}

/// Internal projection wrapper used before public query DTO mapping.
pub struct IterationSummaryViewProjection {
    /// Public iteration summary view DTO.
    pub view: IterationSummaryView,
    /// Derived freshness state.
    pub freshness: DerivedWorkViewState,
}

/// A batch of project-scoped derived views rebuilt from committed truth.
pub struct ProjectProjectionBatch {
    /// Project board views to replace.
    pub board_views: Vec<ProjectBoardView>,
    /// Member work views to replace.
    pub member_views: Vec<MemberWorkView>,
    /// Iteration summary views to replace.
    pub iteration_views: Vec<IterationSummaryView>,
    /// Search projection records to replace.
    pub search_records: Vec<WorkSearchProjection>,
}
```

| 函数 | 参数 | 返回 | 错误 | 调用方 | 约束 |
|---|---|---|---|---|---|
| `get_*_view` | ref | `Option<*Projection>` | `RepositoryError` | query service | projection 不存在由 query 映射 empty / stale surface |
| `search_work` | `ProjectRef`、criteria、page | `Page<WorkSearchProjection>` | `RepositoryError` | query service | 只读;不得触发 rebuild |
| `list_freshness_states` | `WorkReconciliationScopeRef`、`PageRequest` | `Page<DerivedWorkViewState>` | `RepositoryError` | reconciliation job | 只读,不得修复 projection |
| `list_views_affected_by_member` | `GlobalMemberRef`、`PageRequest` | `Page<DerivedWorkViewRef>` | `RepositoryError` | identity member consumer stale scope | 只返回已存在且属于 Step 8 §9.2 public identity 的 view refs;不得临时派生 ad hoc ref |
| `list_views_affected_by_method` | `MethodDefinitionRef`、`PageRequest` | `Page<DerivedWorkViewRef>` | `RepositoryError` | method definition consumer stale scope | 只返回已存在且 source index 依赖该 definition 的 public view refs;空页表示无 view 可标脏 |
| `replace_project_views` | `ProjectProjectionBatch`、cursor、UoW | `()` | `RepositoryError` | rebuild job | 只能从 committed truth 构造 |
| `mark_stale` | affected views、cursor、UoW | `()` | `RepositoryError` | command / consumer service | stale 不代表新 truth |
| `mark_rebuilding` / `mark_failed` | affected views、cursor、reason、UoW | `()` | `RepositoryError` | rebuild job | failed / rebuilding marker 不反写真相 |

`mark_stale(...)` 的 `affected` 只能包含 Step 8 §9.2 已正式定义的 public `DerivedWorkViewRef`。当前 P0 只有 project board、member work、iteration summary、work search 四类 derived view identity。PromoteResult 和 PendingPromoteIntake 没有 public query / projection identity,不得临时派生 `promote-*` 或 `intake-*` view ref。Consumer / refresh job 如果需要按外部 ref 标脏,必须先通过 `ProjectionRepository.list_views_affected_by_*` 或已定义 truth repository scope 读取面枚举 existing public view refs;枚举为空时只保存 reference / snapshot state,不得自行构造 view ref。

#### 8.11 `ReferenceSnapshotRepository`

```rust
/// Stores local snapshots and resolution state for external references.
pub trait ReferenceSnapshotRepository {
    /// Loads resolution state for an external reference.
    async fn get_reference_state(
        &self,
        reference_ref: ExternalReferenceRef,
    ) -> Result<Option<ReferenceResolutionState>, RepositoryError>;

    /// Saves reference resolution state inside the current unit of work.
    async fn save_reference_state(
        &self,
        state: ReferenceResolutionState,
        expected_version: Option<Version>,
        uow: &UnitOfWorkHandle,
    ) -> Result<Version, RepositoryError>;

    /// Loads a member capability snapshot.
    async fn get_member_snapshot(
        &self,
        member_ref: GlobalMemberRef,
    ) -> Result<Option<MemberCapabilitySnapshot>, RepositoryError>;

    /// Saves a member capability snapshot.
    async fn save_member_snapshot(
        &self,
        snapshot: MemberCapabilitySnapshot,
        expected_version: Option<Version>,
        uow: &UnitOfWorkHandle,
    ) -> Result<Version, RepositoryError>;

    /// Loads a method definition snapshot.
    async fn get_method_snapshot(
        &self,
        definition_ref: MethodDefinitionRef,
    ) -> Result<Option<MethodDefinitionSnapshot>, RepositoryError>;

    /// Saves a method definition snapshot.
    async fn save_method_snapshot(
        &self,
        snapshot: MethodDefinitionSnapshot,
        expected_version: Option<Version>,
        uow: &UnitOfWorkHandle,
    ) -> Result<Version, RepositoryError>;

    /// Lists stale external references for refresh jobs.
    async fn list_stale_references(
        &self,
        page: PageRequest,
    ) -> Result<Page<ExternalReferenceRef>, RepositoryError>;

    /// Marks a reference as failed while preserving the last successful snapshot.
    async fn mark_reference_failed(
        &self,
        reference_ref: ExternalReferenceRef,
        reason: ReferenceFailureReason,
        occurred_at: Timestamp,
        expected_version: Option<Version>,
        uow: &UnitOfWorkHandle,
    ) -> Result<Version, RepositoryError>;
}
```

| 函数 | 参数 | 返回 | 错误 | 调用方 | 约束 |
|---|---|---|---|---|---|
| `get_reference_state` | `ExternalReferenceRef` | `Option<ReferenceResolutionState>` | `RepositoryError` | command / consumer / refresh job | 不解析外部正文 |
| `save_reference_state` | state、version、UoW | `Version` | `RepositoryError` | consumer / refresh job | 与 snapshot save 同 UoW |
| `get_member_snapshot` / `save_member_snapshot` | member snapshot | `Option` / `Version` | `RepositoryError` | assign / identity consumer | 不保存 identity body |
| `get_method_snapshot` / `save_method_snapshot` | method snapshot | `Option` / `Version` | `RepositoryError` | formalize / method consumer | 不保存 method body |
| `list_stale_references` | `PageRequest` | `Page<ExternalReferenceRef>` | `RepositoryError` | refresh job | 只驱动 resolver,不修 business truth |
| `mark_reference_failed` | reference、failure reason、timestamp、version、UoW | `Version` | `RepositoryError` | refresh job / consumer | 保留旧快照,只更新 resolution state |

#### 8.12 truth snapshot read helpers

projection rebuild / reconciliation 需要从 committed Work truth 重建 derived view,不能从旧 projection 反推。该读取面仍属于 repository port,不定义新 truth。

```rust
/// Reads committed Work truth snapshots for rebuild and reconciliation.
pub trait WorkTruthSnapshotRepository {
    /// Loads project-scoped truth for projection rebuild.
    async fn load_project_truth_snapshot(
        &self,
        project_ref: ProjectRef,
    ) -> Result<ProjectWorkTruthSnapshot, RepositoryError>;

    /// Loads cursor state used by reconciliation.
    async fn load_truth_cursor(
        &self,
        project_ref: ProjectRef,
    ) -> Result<WorkTruthCursor, RepositoryError>;
}
```

| 函数 | 参数 | 返回 | 错误 | 调用方 | 约束 |
|---|---|---|---|---|---|
| `load_project_truth_snapshot` | `ProjectRef` | `ProjectWorkTruthSnapshot` | `RepositoryError` | rebuild job | snapshot 只读,字段闭环在 Step 8 / 11 |
| `load_truth_cursor` | `ProjectRef` | `WorkTruthCursor` | `RepositoryError` | rebuild / reconciliation | cursor 不能替代 optimistic version |

### 9. External Resolver / Publisher / Handoff Port 契约

#### 9.1 resolver port 通用约束

| 约束 | 正式口径 |
|---|---|
| 定义位置 | `application/src/ports.rs` |
| 实现位置 | `infra/src/source_resolvers.rs` |
| 编译期依赖 | 不得依赖 identity / conversation / method-library / process / governance / artifact / runtime crate |
| 返回内容 | 只返回 safe summary / snapshot input / verification result,不得返回外部正文 |
| 错误类型 | `PortError` |
| 写入职责 | resolver 不写 repository;consumer / service 在 UoW 内保存 snapshot / reference state |

#### 9.2 `ActorMemberResolverPort`

```rust
/// Resolves the current query actor into an identity member ref without exposing identity body.
pub trait ActorMemberResolverPort {
    /// Resolves a trusted gateway actor context to the GlobalMemberRef used by Work visibility checks.
    async fn resolve_actor_member(
        &self,
        actor: &ActorContext,
    ) -> Result<QueryActorMemberRef, PortError>;
}
```

| 函数 | 参数 | 返回 | 错误 | 调用方 | 约束 |
|---|---|---|---|---|---|
| `resolve_actor_member` | `ActorContext` | `QueryActorMemberRef` | `PortError` | `AuthorizedWorkQueryService` | 只返回 `ActorRef` + `GlobalMemberRef`;不得返回 identity / role / credential body;query path 的 `PortError::NotFound` / `Rejected` 映射 `NotVisible`,`PortError::Unavailable` 映射 `TemporarilyUnavailable` |

#### 9.3 `MemberReferencePort`

```rust
/// Resolves identity member capability summaries without owning identity truth.
pub trait MemberReferencePort {
    /// Resolves capabilities for a member responsibility check.
    async fn resolve_member_capability(
        &self,
        member_ref: GlobalMemberRef,
    ) -> Result<MemberCapabilitySnapshotInput, PortError>;
}

/// Safe input used to construct a member capability snapshot.
pub struct MemberCapabilitySnapshotInput {
    /// Referenced identity member.
    pub member_ref: GlobalMemberRef,
    /// Capability references available to Work responsibility checks.
    pub capability_refs: CapabilityRefSet,
}
```

| 函数 | 参数 | 返回 | 错误 | 调用方 | 约束 |
|---|---|---|---|---|---|
| `resolve_member_capability` | `GlobalMemberRef` | `MemberCapabilitySnapshotInput` | `PortError` | assign / resume / refresh job | 不返回 GlobalMember body |

#### 9.4 `MethodDefinitionResolverPort`

```rust
/// Resolves method-library definition summaries for formal work policy.
pub trait MethodDefinitionResolverPort {
    /// Resolves a method definition summary.
    async fn resolve_definition(
        &self,
        definition_ref: MethodDefinitionRef,
    ) -> Result<MethodDefinitionSnapshotInput, PortError>;
}

/// Safe input used to construct a method definition snapshot.
pub struct MethodDefinitionSnapshotInput {
    /// Referenced method definition.
    pub definition_ref: MethodDefinitionRef,
    /// Definition category used by Work policy.
    pub definition_kind: MethodDefinitionKind,
}
```

| 函数 | 参数 | 返回 | 错误 | 调用方 | 约束 |
|---|---|---|---|---|---|
| `resolve_definition` | `MethodDefinitionRef` | `MethodDefinitionSnapshotInput` | `PortError` | formalize / method consumer / refresh job | 不保存 method definition body |

#### 9.5 `SourceWorkResolverPort`

```rust
/// Resolves external work sources into safe summaries.
pub trait SourceWorkResolverPort {
    /// Resolves a source work reference for formalization or promotion checks.
    async fn resolve_source_work(
        &self,
        source_ref: SourceWorkRef,
    ) -> Result<SourceWorkResolution, PortError>;
}

/// Safe resolution result for external work sources.
pub struct SourceWorkResolution {
    /// Source reference that was resolved.
    pub source_ref: SourceWorkRef,
    /// Summary that is safe for Work policy.
    pub source_summary: ExternalSourceSummary,
    /// Resolution state to persist locally.
    pub reference_state: ReferenceResolutionState,
}
```

| 函数 | 参数 | 返回 | 错误 | 调用方 | 约束 |
|---|---|---|---|---|---|
| `resolve_source_work` | `SourceWorkRef` | `SourceWorkResolution` | `PortError` | create work / promote / runtime promote consumer / refresh job | conversation / runtime / artifact 正文不得进入 Work truth |

#### 9.6 `EvidenceResolverPort`

```rust
/// Resolves external evidence references for completion and blocker decisions.
pub trait EvidenceResolverPort {
    /// Verifies whether evidence can support a Work operation.
    async fn resolve_evidence(
        &self,
        evidence_ref: ExternalEvidenceRef,
    ) -> Result<EvidenceResolution, PortError>;
}

/// Safe resolution result for external evidence.
pub struct EvidenceResolution {
    /// Evidence reference that was checked.
    pub evidence_ref: ExternalEvidenceRef,
    /// Verified state after resolution.
    pub verified_state: EvidenceVerifiedState,
    /// Resolution state to persist locally.
    pub reference_state: ReferenceResolutionState,
}
```

| 函数 | 参数 | 返回 | 错误 | 调用方 | 约束 |
|---|---|---|---|---|---|
| `resolve_evidence` | `ExternalEvidenceRef` | `EvidenceResolution` | `PortError` | complete work / resolve blocker / dependency satisfied / artifact consumer | 不下载 artifact / evidence body |

#### 9.7 `ProcessTimeboxResolverPort`

```rust
/// Resolves process timebox references for Work-owned iterations.
pub trait ProcessTimeboxResolverPort {
    /// Resolves a process timebox summary.
    async fn resolve_timebox(
        &self,
        timebox_ref: ProcessTimeboxRef,
    ) -> Result<ProcessTimeboxResolution, PortError>;
}

/// Safe resolution result for a process timebox.
pub struct ProcessTimeboxResolution {
    /// Process timebox reference.
    pub timebox_ref: ProcessTimeboxRef,
    /// Safe timebox summary used for iteration validation.
    pub summary: ProcessTimeboxSummary,
}
```

| 函数 | 参数 | 返回 | 错误 | 调用方 | 约束 |
|---|---|---|---|---|---|
| `resolve_timebox` | `ProcessTimeboxRef` | `ProcessTimeboxResolution` | `PortError` | open iteration / refresh job | process 不拥有 iteration truth |

`ProcessTimeboxResolution.summary` 必须使用 Step 6 定义的 `ProcessTimeboxSummary`。`FakeProcessTimeboxResolverPort` 的 resolved fixture 至少要能表达:

- `summary.timebox_ref == requested timebox_ref`;
- `summary.project_ref` 用于校验 `OpenIterationRequest.project_ref`;
- `summary.can_open_iteration == true` 才允许 `OpenIterationFlow` 继续;
- `summary.source_digest` 必填,用于证明 resolver 输出来自 Process safe summary snapshot。

该 summary 在 `OpenIterationFlow` 中只作为 validation input,不得保存到 `Iteration` truth,不得包含 Process timebox 正文、planning body、stage body 或 execution body。Process timebox 的 `ReferenceResolutionState` 只能由 `ConsumeProcessTimingChangedFlow` 或 `RefreshExternalReferenceSnapshotsJob` 按 reference / snapshot 口径写入;`OpenIterationFlow` 不写 reference state。

#### 9.8 `WorkOutboxPublisherPort`

```rust
/// Publishes committed Work outbox records through a runtime publisher boundary.
pub trait WorkOutboxPublisherPort {
    /// Publishes one committed outbox record.
    async fn publish(
        &self,
        record: WorkOutboxRecord,
    ) -> Result<OutboxPublicationRef, PortError>;
}
```

| 函数 | 参数 | 返回 | 错误 | 调用方 | 约束 |
|---|---|---|---|---|---|
| `publish` | `WorkOutboxRecord` | `OutboxPublicationRef` | `PortError` | `PublishWorkOutbox` worker / job | publisher 不修改 repository;mark 由 service 调 outbox repo |

#### 9.9 `TraceHandoffPort`

```rust
/// Prepares Work trace records for observability handoff.
pub trait TraceHandoffPort {
    /// Creates a handoff reference for trace records.
    async fn prepare_trace_handoff(
        &self,
        intent: TraceHandoffIntent,
    ) -> Result<TraceHandoffRef, PortError>;
}
```

| 函数 | 参数 | 返回 | 错误 | 调用方 | 约束 |
|---|---|---|---|---|---|
| `prepare_trace_handoff` | `TraceHandoffIntent` | `TraceHandoffRef` | `PortError` | `PrepareWorkTraceHandoff` job | 不替代 global observability log |

#### 9.10 `ArchiveHandoffPort`

```rust
/// Prepares Work archive handoff markers without owning archive storage.
pub trait ArchiveHandoffPort {
    /// Creates an archive handoff reference.
    async fn prepare_archive_handoff(
        &self,
        intent: ArchiveHandoffIntent,
    ) -> Result<ArchiveHandoffRef, PortError>;
}
```

| 函数 | 参数 | 返回 | 错误 | 调用方 | 约束 |
|---|---|---|---|---|---|
| `prepare_archive_handoff` | `ArchiveHandoffIntent` | `ArchiveHandoffRef` | `PortError` | `PrepareArchiveHandoff` job | archive 长期正文不属于 Work |

### 10. Technical Port 契约

#### 10.1 `UnitOfWork` / `UnitOfWorkHandle`

```rust
/// Creates local transaction boundaries for Work application services.
pub trait UnitOfWork {
    /// Starts a local transaction boundary.
    async fn begin(&self) -> Result<UnitOfWorkHandle, UnitOfWorkError>;

    /// Commits the current transaction boundary.
    async fn commit(&self, handle: UnitOfWorkHandle) -> Result<(), UnitOfWorkError>;

    /// Rolls back the current transaction boundary.
    async fn rollback(&self, handle: UnitOfWorkHandle) -> Result<(), UnitOfWorkError>;
}

/// Opaque local transaction handle passed to repository writes.
pub struct UnitOfWorkHandle {
    /// Stable handle id for logging and fake adapter assertions.
    pub handle_id: UnitOfWorkId,
}

/// Classifies local transaction boundary failures.
pub enum UnitOfWorkError {
    /// The transaction could not be started.
    BeginFailed,
    /// The transaction could not be committed.
    CommitFailed,
    /// The transaction could not be rolled back.
    RollbackFailed,
}
```

| 函数 | 参数 | 返回 | 错误 | 调用方 | 约束 |
|---|---|---|---|---|---|
| `begin` | 无 | `UnitOfWorkHandle` | `UnitOfWorkError` | command / consumer / job service | handler 不直接开启事务 |
| `commit` | `UnitOfWorkHandle` | `()` | `UnitOfWorkError` | application service | commit 后 handle 不得再用于写入 |
| `rollback` | `UnitOfWorkHandle` | `()` | `UnitOfWorkError` | application service | rollback 不发布 outbox |

#### 10.2 `IdGeneratorPort`

```rust
/// Generates Work-owned identifiers.
pub trait IdGeneratorPort {
    /// Generates a project id.
    fn next_project_id(&self) -> Result<ProjectId, PortError>;

    /// Generates a backlog id.
    fn next_backlog_id(&self) -> Result<BacklogId, PortError>;

    /// Generates a project member id.
    fn next_project_member_id(&self) -> Result<ProjectMemberId, PortError>;

    /// Generates a root work item id.
    fn next_work_item_id(&self) -> Result<WorkItemId, PortError>;

    /// Generates a child work item id.
    fn next_child_work_item_id(&self) -> Result<ChildWorkItemId, PortError>;

    /// Generates a promote result id.
    fn next_promote_result_id(&self) -> Result<PromoteResultId, PortError>;

    /// Generates a dependency id.
    fn next_work_dependency_id(&self) -> Result<WorkDependencyId, PortError>;

    /// Generates a blocker id.
    fn next_work_blocker_id(&self) -> Result<WorkBlockerId, PortError>;

    /// Generates an iteration id.
    fn next_iteration_id(&self) -> Result<IterationId, PortError>;

    /// Generates an iteration commitment id.
    fn next_iteration_commitment_id(&self) -> Result<IterationCommitmentId, PortError>;

    /// Generates a promote decision history id.
    fn next_promote_decision_id(&self) -> Result<PromoteDecisionId, PortError>;

    /// Generates a dependency or blocker change history id.
    fn next_dependency_change_id(&self) -> Result<DependencyChangeId, PortError>;

    /// Generates an iteration change history id.
    fn next_iteration_change_id(&self) -> Result<IterationChangeId, PortError>;

    /// Generates an outbox id.
    fn next_outbox_id(&self) -> Result<WorkOutboxId, PortError>;

    /// Generates a trace id.
    fn next_trace_id(&self) -> Result<WorkTraceId, PortError>;

    /// Generates an application result id.
    fn next_result_id(&self) -> Result<ResultId, PortError>;
}
```

| 函数族 | 返回 | 调用方 | 约束 |
|---|---|---|---|
| `next_*_id` | Work-owned id | command / consumer / job service | domain 不访问随机数或系统 ID |
| `next_result_id` | `ResultId` | command / job service before result store save | result id 只用于 `ApplicationResultRef`;不得作为业务 truth id 或 optimistic version |

#### 10.3 `ClockPort`

```rust
/// Provides timestamps for application services.
pub trait ClockPort {
    /// Returns the current timestamp.
    fn now(&self) -> Result<Timestamp, PortError>;
}
```

| 函数 | 参数 | 返回 | 错误 | 调用方 | 约束 |
|---|---|---|---|---|---|
| `now` | 无 | `Timestamp` | `PortError` | command / consumer / job service | domain object 接收 timestamp 或 trace ref,不直接读系统时间 |

#### 10.4 `IdempotencyRepository`

```rust
/// Stores idempotency state for commands, event consumers, and jobs.
pub trait IdempotencyRepository {
    /// Reads an idempotency record for duplicate recovery and commit-status audit.
    async fn get(
        &self,
        key: IdempotencyKey,
        operation: OperationName,
    ) -> Result<Option<IdempotencyRecord>, IdempotencyError>;

    /// Reserves an idempotency key for an operation and canonical request digest.
    async fn reserve(
        &self,
        key: IdempotencyKey,
        operation: OperationName,
        request_digest: RequestDigest,
        uow: &UnitOfWorkHandle,
    ) -> Result<IdempotencyReservation, IdempotencyError>;

    /// Completes a reservation with the stable application result reference.
    async fn complete(
        &self,
        reservation: IdempotencyReservation,
        result_ref: ApplicationResultRef,
        uow: &UnitOfWorkHandle,
    ) -> Result<(), IdempotencyError>;

    /// Marks an idempotency key as conflicted.
    async fn mark_conflict(
        &self,
        conflict: IdempotencyConflict,
        uow: &UnitOfWorkHandle,
    ) -> Result<(), IdempotencyError>;
}

/// Result of reserving an idempotency key.
pub enum IdempotencyReservation {
    /// This request may execute the operation.
    Reserved(IdempotencyRecord),
    /// The same digest already completed and should return the stored result.
    Duplicate(ApplicationResultRef),
    /// The same key was used with a different request digest.
    Conflict(IdempotencyConflict),
}

/// Records a conflicting idempotency request.
pub struct IdempotencyConflict {
    /// Idempotency key that collided.
    pub idempotency_key: IdempotencyKey,
    /// Operation protected by the key.
    pub operation: OperationName,
    /// Digest stored for the existing request.
    pub existing_digest: RequestDigest,
    /// Digest presented by the new request.
    pub incoming_digest: RequestDigest,
}

/// Classifies idempotency storage failures.
pub enum IdempotencyError {
    /// The same key is already in-flight.
    AlreadyReserved,
    /// The same key was used with a different digest.
    Conflict,
    /// The idempotency store failed.
    StoreUnavailable,
}
```

| 函数 | 参数 | 返回 | 错误 | 调用方 | 约束 |
|---|---|---|---|---|---|
| `get` | key、operation | `Option<IdempotencyRecord>` | `IdempotencyError` | duplicate recovery / commit-status audit | 只读;不得创建或完成 record |
| `reserve` | key、operation、digest、UoW | `IdempotencyReservation` | `IdempotencyError` | command / consumer / job service | digest 必须来自 canonical payload |
| `complete` | reservation、result ref、UoW | `()` | `IdempotencyError` | service success path | duplicate 必须返回同一 result ref |
| `mark_conflict` | conflict、UoW | `()` | `IdempotencyError` | conflict path | 不执行 business truth 写入 |

#### 10.5 `CommandResultRepository`

```rust
/// Stores public command result surfaces for idempotency duplicate replay.
pub trait CommandResultRepository {
    /// Saves the command result surface under its stable application result ref.
    async fn save_result(
        &self,
        result_ref: ApplicationResultRef,
        result: StoredCommandResult,
        uow: &UnitOfWorkHandle,
    ) -> Result<(), RepositoryError>;

    /// Loads a previously saved command result surface by result ref.
    async fn get_result(
        &self,
        result_ref: ApplicationResultRef,
    ) -> Result<Option<StoredCommandResult>, RepositoryError>;
}

/// Application-local union of public command result DTOs.
pub enum StoredCommandResult {
    /// Stored result for Project command operations.
    Project(ProjectCommandResult),
    /// Stored result for Backlog command operations.
    Backlog(BacklogCommandResult),
    /// Stored result for ProjectMember command operations.
    ProjectMember(ProjectMemberCommandResult),
    /// Stored result for WorkItem and ChildWorkItem command operations.
    WorkItem(WorkItemCommandResult),
    /// Stored result for Promote command operations.
    Promote(PromoteCommandResult),
    /// Stored result for Dependency command operations.
    Dependency(DependencyCommandResult),
    /// Stored result for Blocker command operations.
    Blocker(BlockerCommandResult),
    /// Stored result for Iteration command operations.
    Iteration(IterationCommandResult),
}
```

| 函数 | 参数 | 返回 | 错误 | 调用方 | 约束 |
|---|---|---|---|---|---|
| `save_result` | result ref、stored command result、UoW | `()` | `RepositoryError` | command success path | 必须与 truth / trace / outbox / stale marker 和 `IdempotencyRepository.complete(...)` 同一 UoW;必须先于 idempotency complete 调用 |
| `get_result` | result ref | `Option<StoredCommandResult>` | `RepositoryError` | command duplicate replay / commit-status audit | read-only;不得重建 truth;不得重放 domain transition |

正式口径:

- `ApplicationResultRef` 是指向 `CommandResultRepository` 中 stored result surface 的稳定指针;`IdempotencyRepository` 只保存这个指针,不保存完整 result DTO。
- `StoredCommandResult` 保存的是成功写路径原始 `Applied` result surface。duplicate replay 读取后只把返回 receipt 的 `idempotency` surface 改为 `Duplicate`,必须保留原 `result_ref`、primary ref、state、`trace_ref`、`outbox_record_refs` 和 `applied_version`。
- service 必须按当前 operation 匹配期望 variant。`ApplicationResultRef.operation` 与 variant / command 不匹配,或 `get_result(result_ref)` 返回 `None`,均映射 `ApplicationError::DuplicateResultMissing`。
- duplicate replay 禁止从当前 Project / Backlog / Work truth 重新构造 result,也禁止再次调用 domain factory / transition。

### 11. Infra Adapter 契约

#### 11.1 adapter 实现总表

| Adapter | 文件 | 实现 trait | 状态 | 约束 |
|---|---|---|---|---|
| `InMemoryProjectRepository` | `infra/src/repositories.rs` | `ProjectRepository` | P0 fake | 必须支持 version conflict 测试 |
| `InMemoryProjectMemberRepository` | `infra/src/repositories.rs` | `ProjectMemberRepository` | P0 fake | 不解析 identity |
| `InMemoryBacklogRepository` | `infra/src/repositories.rs` | `BacklogRepository` | P0 fake | formal work membership 可断言 |
| `InMemoryWorkItemRepository` | `infra/src/repositories.rs` | `WorkItemRepository` | P0 fake | root / child 统一 ref 读取 |
| `InMemoryPromoteRepository` | `infra/src/repositories.rs` | `PromoteRepository` | P0 fake | source duplicate 语义可测 |
| `InMemoryDependencyRepository` | `infra/src/repositories.rs` | `DependencyRepository` | P0 fake | graph snapshot 可测 cycle / orphan |
| `InMemoryIterationRepository` | `infra/src/repositories.rs` | `IterationRepository` | P0 fake | commitment create / update version 可测 |
| `InMemoryAuditRepository` | `infra/src/repositories.rs` | `AuditRepository` | P0 fake | trace list 可分页 |
| `InMemoryWorkOutboxRepository` | `infra/src/outbox_store.rs` | `WorkOutboxRepository` | P0 fake | pending / mark published / failed 可测 |
| `InMemoryProjectionRepository` | `infra/src/projection_stores.rs` | `ProjectionRepository`、`WorkTruthSnapshotRepository` | P0 fake | replace 只能由 service 调用 |
| `InMemoryReferenceSnapshotRepository` | `infra/src/reference_stores.rs` | `ReferenceSnapshotRepository` | P0 fake | stale refs 可分页 |
| `InMemoryIdempotencyRepository` | `infra/src/idempotency_store.rs` | `IdempotencyRepository` | P0 fake | duplicate / conflict 按 digest 判定 |
| `InMemoryCommandResultRepository` | `infra/src/command_result_store.rs` | `CommandResultRepository` | P0 fake | 按 `ApplicationResultRef` 保存 / 读取 stored result surface;支持 missing 注入 |
| `InMemoryUnitOfWork` | `infra/src/repositories.rs` | `UnitOfWork` | P0 fake | 测试可断言 commit / rollback |
| `DeterministicWorkIdGenerator` | `infra/src/clock_id.rs` | `IdGeneratorPort` | P0 fake | fixture 可预测 |
| `FixedClock` | `infra/src/clock_id.rs` | `ClockPort` | P0 fake | fixture 可预测 |
| `FakeActorMemberResolverPort` | `infra/src/source_resolvers.rs` | `ActorMemberResolverPort` | P0 fake | 可配置 actor -> `GlobalMemberRef` 映射和 denied / unavailable |
| `FakeMemberReferencePort` | `infra/src/source_resolvers.rs` | `MemberReferencePort` | P0 fake | 返回 safe input |
| `FakeMethodDefinitionResolverPort` | `infra/src/source_resolvers.rs` | `MethodDefinitionResolverPort` | P0 fake | 返回 safe input |
| `FakeSourceWorkResolverPort` | `infra/src/source_resolvers.rs` | `SourceWorkResolverPort` | P0 fake | 可模拟 unresolved / rejected |
| `FakeEvidenceResolverPort` | `infra/src/source_resolvers.rs` | `EvidenceResolverPort` | P0 fake | 可模拟 verified / rejected |
| `FakeProcessTimeboxResolverPort` | `infra/src/source_resolvers.rs` | `ProcessTimeboxResolverPort` | P0 fake | 不改 process truth |
| `FakeWorkOutboxPublisher` | `infra/src/publishers.rs` | `WorkOutboxPublisherPort` | P0 fake | 可模拟 publish failure |
| `FakeTraceHandoffAdapter` | `infra/src/handoff_adapters.rs` | `TraceHandoffPort` | P0 fake | 只返回 handoff ref |
| `FakeArchiveHandoffAdapter` | `infra/src/handoff_adapters.rs` | `ArchiveHandoffPort` | P0 fake | 只返回 handoff ref |

#### 11.2 adapter 约束

| 约束 | 正式口径 |
|---|---|
| 不改 domain 不变量 | adapter 只保存 / 读取已由 application + domain 判断过的对象 |
| 不生成业务 decision | resolver / publisher / handoff adapter 不判断 promote、completion、dependency、iteration policy |
| 不混入外部正文 | fake adapter 也不得把 conversation / artifact / method 等正文写进 Work truth |
| fake 可预测 | fake id / clock / resolver 必须支持 fixture 和 contract test 可重复断言 |
| durable adapter 后续替换 | durable adapter 必须实现同一 trait,不得改变 application service 签名 |

### 12. 只能通过 Trait 访问的依赖清单

| 依赖 / 能力 | 允许访问方式 | 禁止访问方式 | 设计原因 |
|---|---|---|---|
| 本地 truth store | repository trait | application 直接访问 DB client | 保持 application 与 infra 解耦 |
| projection store | `ProjectionRepository` | query handler 直接访问 projection adapter | query no-write 和 stale surface 由 service 统一处理 |
| idempotency store | `IdempotencyRepository` | handler 自行判重 | duplicate / conflict 必须覆盖 command、event、job |
| command result store | `CommandResultRepository` | service 从当前 truth 现算 duplicate result | duplicate 必须返回已保存 result surface,不得重放 domain transition |
| transaction boundary | `UnitOfWork` | repository 隐式开启不可见事务 | 多 repository / outbox / audit 同 UoW |
| event bus | `WorkOutboxPublisherPort` | domain 直接 publish | truth commit 与 publish failure 解耦 |
| identity | `ActorMemberResolverPort` / `MemberReferencePort` / event consumer snapshot | Cargo 依赖 identity crate 或解释 role / credential body | L1-work 不拥有 GlobalMember truth;query 只消费 actor -> `GlobalMemberRef` 安全映射和 ProjectMember responsibility |
| method-library | `MethodDefinitionResolverPort` / snapshot | Cargo 依赖 method crate | L1-work 不保存 method definition body |
| conversation / runtime / artifact / governance source | `SourceWorkResolverPort` / inbound event | Cargo 依赖 sibling crate 或保存正文 | promote 必须从 ref / summary 开始 |
| artifact / governance evidence | `EvidenceResolverPort` | 直接下载 evidence body | completion / blocker 只持 evidence ref |
| process timebox | `ProcessTimeboxResolverPort` | process 直接维护 iteration | Iteration truth 属于 Work |
| observability | `TraceHandoffPort` | 写 observability log store | Work 只提供 handoff |
| archive | `ArchiveHandoffPort` | 写 archive long-term body | archive 长期正文不属于 Work |
| system time / id | `ClockPort` / `IdGeneratorPort` | domain 调用系统时间或随机数 | domain 保持纯对象判断 |

### 13. 处理流到 Port 闭环表

| 处理流 | 必需 repository / port | 写入 UoW | 外部 port | outbox / projection / handoff |
|---|---|---|---|---|
| `CreateProject` | `ProjectRepository`、`BacklogRepository`、`AuditRepository`、`WorkOutboxRepository`、`ProjectionRepository`、`IdempotencyRepository`、`CommandResultRepository` | 是 | `IdGeneratorPort`、`ClockPort` | enqueue `ProjectChanged`;mark project views stale |
| `UpdateProjectLifecycle` | `ProjectRepository`、`BacklogRepository`、`AuditRepository`、`WorkOutboxRepository`、`ProjectionRepository`、`IdempotencyRepository`、`CommandResultRepository` | 是 | `ClockPort` | enqueue `ProjectChanged`;archive 联动 backlog |
| `UpdateBacklogAvailability` | `BacklogRepository`、`AuditRepository`、`WorkOutboxRepository`、`ProjectionRepository`、`IdempotencyRepository`、`CommandResultRepository` | 是 | `ClockPort` | enqueue backlog / project view changed |
| `AssignProjectMember` | `ProjectRepository`、`ProjectMemberRepository`、`ReferenceSnapshotRepository`、`AuditRepository`、`WorkOutboxRepository`、`ProjectionRepository`、`IdempotencyRepository`、`CommandResultRepository` | 是 | `MemberReferencePort`、`IdGeneratorPort`、`ClockPort` | enqueue `ProjectMemberChanged`;mark member views stale |
| `CreateWorkItem` | `ProjectRepository`、`BacklogRepository`、`WorkItemRepository`、`ReferenceSnapshotRepository`、`AuditRepository`、`WorkOutboxRepository`、`ProjectionRepository`、`IdempotencyRepository`、`CommandResultRepository` | 是 | `SourceWorkResolverPort`、`MethodDefinitionResolverPort`、`IdGeneratorPort`、`ClockPort` | enqueue `WorkItemChanged`;mark board / search stale |
| `CreateChildWorkItem` | `WorkItemRepository`、`BacklogRepository`、`AuditRepository`、`WorkOutboxRepository`、`ProjectionRepository`、`IdempotencyRepository`、`CommandResultRepository` | 是 | `SourceWorkResolverPort`、`IdGeneratorPort`、`ClockPort` | enqueue `WorkItemChanged` |
| `UpdateWorkItemLifecycle` | `WorkItemRepository`、`ReferenceSnapshotRepository`、`AuditRepository`、`WorkOutboxRepository`、`ProjectionRepository`、`IdempotencyRepository`、`CommandResultRepository` | 是 | `EvidenceResolverPort`、`ClockPort` | enqueue `WorkItemChanged`;mark views stale |
| `RequestWorkPromotion` | `PromoteRepository`、`ReferenceSnapshotRepository`、`AuditRepository`、`WorkOutboxRepository`、`IdempotencyRepository`、`CommandResultRepository` | 是 | `SourceWorkResolverPort`、`IdGeneratorPort`、`ClockPort` | enqueue `PromoteResultRecorded`;no projection stale |
| `ReviewWorkPromotion` | `PromoteRepository`、`WorkItemRepository`、`BacklogRepository`、`AuditRepository`、`WorkOutboxRepository`、`ProjectionRepository`、`IdempotencyRepository`、`CommandResultRepository` | 是 | `SourceWorkResolverPort`、`IdGeneratorPort`、`ClockPort` | accepted path enqueue promote + work events;accept-created / bound formal work marks existing work views stale;reject no projection stale |
| `LinkWorkDependency` | `DependencyRepository`、`WorkItemRepository`、`AuditRepository`、`WorkOutboxRepository`、`ProjectionRepository`、`IdempotencyRepository`、`CommandResultRepository` | 是 | `IdGeneratorPort`、`ClockPort` | enqueue `WorkDependencyChanged`;`WorkItemRepository.get_formal_work_scope(downstream)` 提供 graph project scope;mark downstream project-board + resolvable member-work stale |
| `OpenWorkBlocker` / `ResolveWorkBlocker` | `DependencyRepository`、`WorkItemRepository`、`ReferenceSnapshotRepository`、`AuditRepository`、`WorkOutboxRepository`、`ProjectionRepository`、`IdempotencyRepository`、`CommandResultRepository` | 是 | `EvidenceResolverPort`、`IdGeneratorPort`、`ClockPort` | enqueue `WorkBlockerChanged`;`WorkItemRepository.get_formal_work_scope(blocked_work_ref)` 提供 stale project / member scope |
| `OpenIteration` | `ProjectRepository`、`IterationRepository`、`AuditRepository`、`WorkOutboxRepository`、`ProjectionRepository`、`IdempotencyRepository`、`CommandResultRepository` | 是 | `ProcessTimeboxResolverPort`、`IdGeneratorPort`、`ClockPort` | enqueue `IterationChanged`;resolver summary validation only;does not write process timebox reference state |
| `CommitIterationScope` / `UpdateIterationCommitment` | `IterationRepository`、`WorkItemRepository`、`BacklogRepository`、`AuditRepository`、`WorkOutboxRepository`、`ProjectionRepository`、`IdempotencyRepository`、`CommandResultRepository` | 是 | `ClockPort` | enqueue `IterationChanged`;mark iteration / member views stale |
| `GetProjectWorkFacts` / `GetBacklog` / `GetWorkItem` / `ListMemberWork` / `GetIterationSummary` / `SearchWork` / `GetWorkTrace` / `GetProjectBoardView` | project / member / backlog / work / promote / dependency / iteration / audit repo、`ProjectionRepository` when view-backed | 否 | `ActorMemberResolverPort` | query 不触发 rebuild;visibility 先 resolve actor member,再按 ProjectMember `Active` / `Paused` 判定;denied -> `NotVisible` |
| `ConsumeIdentityMemberChanged` | `ReferenceSnapshotRepository`、`ProjectMemberRepository`、`ProjectionRepository`、`IdempotencyRepository` | 是 | `ClockPort` | `ProjectMemberRepository.list_by_member(...)` + `ProjectionRepository.list_views_affected_by_member(...)` 枚举 affected public views 后 mark stale |
| `ConsumeMethodDefinitionChanged` | `ReferenceSnapshotRepository`、`ProjectionRepository`、`IdempotencyRepository` | 是 | `ClockPort` | `ProjectionRepository.list_views_affected_by_method(...)` 枚举 affected public views 后 mark stale |
| `ConsumeRuntimePromoteRequested` | `ReferenceSnapshotRepository`、`PromoteRepository`、`IdempotencyRepository` | 是 | `SourceWorkResolverPort`、`ClockPort` | 只形成 pending intake / reference state |
| `PublishWorkOutbox` | `WorkOutboxRepository`、`IdempotencyRepository` | 是 | `WorkOutboxPublisherPort`、`ClockPort` | mark published / failed |
| `RebuildWorkProjections` | `WorkTruthSnapshotRepository`、`ProjectionRepository`、`IdempotencyRepository` | 是 | `ClockPort` | replace views + mark fresh |
| `RefreshExternalReferenceSnapshots` | `ReferenceSnapshotRepository`、`IdempotencyRepository` | 是 | resolver ports、`ClockPort` | save snapshots + mark affected views stale |
| `PrepareWorkTraceHandoff` | `AuditRepository`、`IdempotencyRepository` | 是 | `TraceHandoffPort`、`ClockPort` | save / enqueue handoff marker |
| `PrepareArchiveHandoff` | truth repositories、`AuditRepository`、`IdempotencyRepository` | 是 | `ArchiveHandoffPort`、`ClockPort` | save / enqueue archive handoff marker |

### 14. Trait / Adapter 到文件布局映射

| 文件路径 | 必须包含 | 不得包含 |
|---|---|---|
| `crates/application/src/ports.rs` | repository / resolver / publisher / handoff / id / clock trait、`Page<T>`、`PageInfo`、`RepositoryError`、`PortError` | concrete adapter、DB client、HTTP client、bus client |
| `crates/application/src/unit_of_work.rs` | `UnitOfWork`、`UnitOfWorkHandle`、`UnitOfWorkError` | durable transaction implementation |
| `crates/application/src/idempotency.rs` | `IdempotencyRepository`、`IdempotencyReservation`、`IdempotencyConflict`、`RequestDigest` | concrete store |
| `crates/application/src/results.rs` | `CommandResultRepository`、`StoredCommandResult`、duplicate receipt overlay helper | concrete store、truth reconstruction |
| `crates/infra/src/repositories.rs` | truth repository fake / durable adapters、`InMemoryUnitOfWork` | application service business flow |
| `crates/infra/src/command_result_store.rs` | command result store fake / durable adapter | domain transition、truth repository ownership |
| `crates/infra/src/projection_stores.rs` | projection adapter | domain policy |
| `crates/infra/src/reference_stores.rs` | snapshot / reference adapter | external resolver logic |
| `crates/infra/src/source_resolvers.rs` | fake / durable resolver adapter | Cargo dependency to sibling business crates unless later design explicitly permits |
| `crates/infra/src/publishers.rs` | outbox publisher adapter | truth mutation |
| `crates/infra/src/handoff_adapters.rs` | trace / archive handoff adapter | observability / archive long-term store ownership |
| `crates/infra/src/runtime_builder.rs` | trait impl assembly into application services | new business truth |

### 15. 设计取舍

| 取舍 | 结论 | 理由 |
|---|---|---|
| repository trait 放 `domain` 还是 `application` | 放 `application` | domain 不能知道 persistence,application 编排需要 port |
| 写 repository 是否必须带 UoW | 必须 | command / consumer / job 通常同时写 truth、audit、outbox、idempotency |
| read repository 是否带 UoW | 默认不带 | 普通 query 和 policy load 不需要事务句柄;Step 11 可补需要一致性读的特殊口径 |
| projection repository 是否返回 public view DTO | 可以返回 internal wrapper 持有 public DTO + freshness | Step 6 已确定 view DTO 在 contracts,projection 不是 truth |
| external resolver 是否写 snapshot repository | 不写 | resolver 只解析;保存由 application service 控制 UoW |
| idempotency reserve 是否带 request digest | 必须 | duplicate / conflict 无 digest 无法 1:1 判定 |
| Page<T> 是否作为 public Query DTO | 否 | repository helper 与 public page response 需要 Step 8 显式映射 |

### 16. 回填草稿

正式 `03-详细设计.md` §5 / §6 可引用本文件以下内容:

- §7.1 Trait / Port / Adapter 总览
- §7.2 调用方 / 实现方关系矩阵
- §7.3 共享 helper 与错误边界
- §8 repository trait 契约
- §9 external resolver / publisher / handoff port 契约
- §10 technical port 契约
- §11 infra adapter 契约
- §12 只能通过 trait 访问的依赖清单
- §13 处理流到 Port 闭环表

正式文档整理必须保留校准来源:

```text
Trait / Port / Adapter 契约来源: `projects/L1-work/design-calibration/03_ddd_step_07_trait_port_adapter_contracts.md`。
```

### 17. 待确认事项

| 待确认事项 | 影响 | 处理口径 |
|---|---|---|
| durable store 产品和 SQL / migration | repository adapter 具体实现 | Step 11 / Step 14 / 实施计划补 |

### 18. 进入下一步条件

```text
所有跨模块、跨层、跨外部系统的实现接缝已有明确 trait / port / adapter 契约。
repository、outbox、projection、external resolver、publisher、handoff、UnitOfWork、idempotency、clock 和 id generator 均有函数签名、参数、返回和错误类型。
可以进入 Step 8,定义 API / Command / Query / Event / Job 协议契约。
```
