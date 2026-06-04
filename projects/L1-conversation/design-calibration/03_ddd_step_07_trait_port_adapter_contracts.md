# Step 7. 逐模块定义 Trait / Port / Adapter 契约

## 1. Step 状态

- 状态: `[x] 已确认`
- 对应 SOP: `standards/document/详细设计讨论流程_SOP.md` Step 7
- 回填章节: `projects/L1-conversation/03-详细设计.md` §5 模块实现契约中的 Trait / Port / Adapter 契约 / §6 全局 Trait 索引

---

## 2. 本步输入

| 输入 | 内容 | 本步使用方式 |
|---|---|---|
| `03_ddd_step_05_module_contracts_axis.md` | 模块主轴、依赖方向、对象 / trait / handler / repository 归属 | 确认 trait 定义在 `application`,adapter 实现在 `infra` |
| `03_ddd_step_06_object_contracts.md` | domain 对象、状态、policy、projection、reference、handoff record | 决定 repository / resolver / publisher / handoff port 参数类型 |
| `projects/L1-conversation/02-概要设计.md` §7~§8 | Command / Query / Consumer / Event / Job 骨架和处理流 | 识别哪些处理流需要 port |
| `projects/L1-conversation/02-概要设计.md` §11~§12 | 配置影响和详细设计承接清单 | 确认 config / runtime builder 只在 infra 装配 |
| `standards/document/详细设计书写规范.md` §5.5 / §5.6 | trait 表、Rust 契约片段和索引格式 | 作为本步输出格式 |

已确认结论:

```text
domain 不定义 repository / external port。
application 定义所有业务 port、repository trait、UnitOfWork、ClockPort、IdGeneratorPort 和 IdempotencyRepository。
infra 实现这些 trait,并通过 runtime builder 装配给 api / worker / jobs。
api / worker / jobs 不直接调用 repository adapter 或外部系统 adapter。
```

依赖的前序 Step:

```text
Step 5 已确认模块主轴。
Step 6 已确认 domain 对象契约。
```

---

## 3. SOP 问题回答

### 3.1 哪些模块需要定义 trait / port？

| 模块 | 是否定义 trait / port | 原因 |
|---|---|---|
| `contracts` | 否 | 只定义协议 DTO、Event、Job、View 和 Error DTO,不定义行为 trait |
| `domain` | 否 | 只定义领域对象、状态、policy 和领域错误,不感知外部依赖 |
| `application` | 是 | 定义 repository、resolver、publisher、handoff、transaction、id、clock、idempotency 等边界 |
| `infra` | 不定义业务 port,只实现 adapter | 实现 application trait,承接 config、store、source resolver、publisher 和 runtime wiring |
| `api` | 否 | 只调用 application service,不直接持有 repository / adapter |
| `worker` | 否 | 只调用 application service / runner,不直接改写 domain 或 repository |
| `jobs` | 否 | 一次性 job 入口复用 application service 和 infra runtime |

### 3.2 哪些模块负责实现这些 trait / port？

| trait / port 类别 | 定义模块 | 默认实现模块 | 说明 |
|---|---|---|---|
| repository trait | `application` | `infra` | P0 可提供 in-memory default path,后续可换 durable store |
| source resolver port | `application` | `infra` | 解析 actor、work、governance、artifact、runtime、bridge 等外部引用 |
| outbox publisher port | `application` | `infra` | 发布本仓已提交 Conversation event |
| trace / archive handoff port | `application` | `infra` | 交接到 observability / archive |
| technical port | `application` | `infra` | UoW、时间、ID、幂等 |

### 3.3 repository、outbox、projection、external client 的函数签名是什么？

本步在 §7.3~§7.6 给出 Rust 契约片段。函数签名只固定参数类型、返回类型和错误类型;完整 Command / Query / Event / Job DTO 留给 Step 8。

### 3.4 每个 trait 函数的参数类型、返回类型、错误类型是什么？

本步统一使用以下写法:

```rust
/// <trait purpose>
pub trait ExamplePort {
    /// <function purpose>
    async fn run(&self, input: InputType, uow: UnitOfWorkHandle) -> Result<OutputType, PortError>;
}
```

约束:

- 参数必须写成 `name: TypeName`。
- 返回业务值时写 `Result<OutputType, ErrorType>`。
- 无业务返回值时写 `Result<(), ErrorType>`。
- Rust 片段中的 rustdoc 使用英文,便于实现仓直接转写。

### 3.5 哪些依赖只能通过 trait 访问,不能直接跨层调用？

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
  +-- store
  +-- source resolver
  +-- event publisher
  +-- trace / archive handoff target
  +-- clock / id generator
```

关键说明:

- `application` 不允许依赖 `infra`,只能依赖本模块定义的 trait。
- `api / worker / jobs` 不允许绕过 application service 直接调用 repository 或 external adapter。
- `domain` 不允许依赖任何 repository、port、adapter、config 或 runtime builder。
- 具体数据库、队列、event bus、HTTP client、search engine SDK 只能出现在 `infra` adapter 内。

---

## 4. 当前文档问题诊断

| 位置 | 当前问题 | 影响 |
|---|---|---|
| 旧版 `03-详细设计.md` | 仍围绕 stream、turn、AG-UI 和 event mapping 旧边界 | port 名称和处理对象与新版 truth center 不一致 |
| 当前 `02-概要设计.md` §7 / §8 | 已出现 repository、resolver、handoff、outbox 等边界,但未给函数签名 | 实现者仍需自行补参数、返回和错误类型 |
| Step 6 | 已定义 domain 对象,但尚未定义对象如何被持久化、解析、发布或交接 | Step 9 无法写函数级调用链 |
| 后续实现风险 | 若 api / worker / jobs 直接依赖 infra adapter | 会绕过 application 事务、幂等和领域不变量 |

---

## 5. 改动前后对比

| 维度 | 改动前 | 改动后 |
|---|---|---|
| port 定义位置 | 只在概要设计中以边界名出现 | 全部收敛到 `crates/application` |
| adapter 实现位置 | 只说由技术承载实现 | 明确由 `crates/infra` 实现 |
| repository 粒度 | 按对象或流程容易过细 | 按 truth 聚合和读写边界收敛为 8 类 repository / store port |
| source resolver | 外部仓引用解析未分层 | 统一通过 resolver port,不写 Cargo 依赖 |
| outbox / handoff | 发布、trace、archive 容易混在一起 | 分为 outbox publisher、trace handoff、archive handoff |
| technical port | ID、时间、事务、幂等散落 | 明确 UnitOfWork、ClockPort、IdGeneratorPort、IdempotencyRepository |

---

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A: 每个 domain object 一个 repository | 对象和持久化一一对应 | repository 数量过多,处理流会被存储细节淹没 | 不采用 |
| 方案 B: 按 conversation truth 聚合和读写边界拆 repository | 贴合事务边界,函数语义清晰 | 单个 repository 会覆盖多个相近对象 | 采用 |
| 方案 C: 只保留一个 generic store port | 接口少 | 隐藏业务语义,无法表达 optimistic lock、query、projection 和 handoff 差异 | 不采用 |
| 方案 D: external client 直接放 infra 并由 application 调用具体实现 | 起步快 | application 依赖 infra,违反依赖方向 | 不采用 |

推荐方案:方案 B。

原因:

- `L1-conversation` 的写路径需要 space / scope、fact、manifestation、trace、outbox 同事务协作,不能拆得过碎。
- 读路径和派生路径需要 projection / cursor / snapshot 独立边界,不能被 generic store 掩盖。
- 外部关系必须通过 port 表达,不能引入运行期仓库的 Cargo dependency。

---

## 7. 结构化中间产物

### 7.1 Trait / Port / Adapter 总览

| 名称 | 类型 | 定义位置 | 默认实现位置 | 作用 | 关键函数 |
|---|---|---|---|---|---|
| `SpaceScopeRepository` | repository port | `crates/application/src/ports.rs` | `crates/infra/src/repositories.rs` | 保存 / 读取 space、participant scope、visibility scope、scope change | `get_space_for_update` / `save_scope_bundle` |
| `ConversationFactRepository` | repository port | `crates/application/src/ports.rs` | `crates/infra/src/repositories.rs` | 保存 / 读取 conversation fact 和 append receipt | `append_fact` / `get_fact` / `list_fact_refs` |
| `ManifestationRepository` | repository port | `crates/application/src/ports.rs` | `crates/infra/src/repositories.rs` | 保存 / 读取 cross-domain manifestation | `insert_manifestation` / `get_manifestation` |
| `TraceRepository` | repository port | `crates/application/src/ports.rs` | `crates/infra/src/repositories.rs` | 保存 trace context、review anchor、trace / archive handoff record | `save_trace_context` / `save_review_anchor` |
| `ProjectionRepository` | repository port | `crates/application/src/ports.rs` | `crates/infra/src/projection_stores.rs` | 保存 read model、cursor、search、projection state | `upsert_read_model` / `get_read_model` |
| `ExternalReferenceRepository` | repository port | `crates/application/src/ports.rs` | `crates/infra/src/snapshot_stores.rs` | 保存 external snapshot、reference projection 和 resolution state | `upsert_snapshot` / `get_snapshot` |
| `ConversationOutboxRepository` | repository port | `crates/application/src/ports.rs` | `crates/infra/src/repositories.rs` | 保存和推进 conversation outbox record | `enqueue` / `list_pending` / `save_state` |
| `IdempotencyRepository` | technical repository | `crates/application/src/idempotency.rs` | `crates/infra/src/repositories.rs` | 保存 command / consumer / job 幂等记录 | `reserve` / `complete` / `mark_conflict` |
| `ActorResolverPort` | source resolver port | `crates/application/src/ports.rs` | `crates/infra/src/source_resolvers.rs` | 解析 actor / participant display snapshot | `resolve_actor` |
| `ExternalFactResolverPort` | source resolver port | `crates/application/src/ports.rs` | `crates/infra/src/source_resolvers.rs` | 解析 work / governance / artifact / runtime / bridge 来源事实 | `resolve_external_fact` / `load_safe_snapshot` |
| `ConversationOutboxPublisherPort` | publisher port | `crates/application/src/ports.rs` | `crates/infra/src/outbox_publisher.rs` | 发布本仓已提交 conversation event | `publish` / `publish_batch` |
| `TraceHandoffPort` | handoff port | `crates/application/src/ports.rs` | `crates/infra/src/handoff_adapters.rs` | 向 observability 交接 trace 材料 | `deliver_trace_handoff` |
| `ArchiveHandoffPort` | handoff port | `crates/application/src/ports.rs` | `crates/infra/src/handoff_adapters.rs` | 向 archive 交接历史材料 | `deliver_archive_handoff` |
| `UnitOfWork` | transaction port | `crates/application/src/unit_of_work.rs` | `crates/infra/src/repositories.rs` | 管理写路径事务边界 | `begin` / `commit` / `rollback` |
| `ClockPort` | technical port | `crates/application/src/ports.rs` | `crates/infra/src/clock_id.rs` | 提供可替换时间来源 | `now` |
| `IdGeneratorPort` | technical port | `crates/application/src/ports.rs` | `crates/infra/src/clock_id.rs` | 生成本仓 ID / sequence | `next_*` |

### 7.2 模块间 trait 调用图

#### 模块调用图: L1-conversation port / adapter 边界

```text
api / worker / jobs
  |
  v
application services
  |
  +-- repository ports
  +-- resolver ports
  +-- publisher / handoff ports
  +-- UnitOfWork / Idempotency / Clock / IdGenerator
  |
  v
infra adapters
  |
  +-- in-memory or durable stores
  +-- source resolver adapters
  +-- event publisher adapter
  +-- trace / archive handoff adapters
  +-- system clock / id generator
```

关键说明:

- 图表达 port / adapter 依赖方向,不表达具体 handler 处理流。
- `application services` 只依赖 trait,不依赖 concrete adapter。
- `infra adapters` 实现 trait,并由 runtime builder 注入入口模块。
- `domain` 不感知任何 port / adapter。

### 7.3 `application` 模块:repository port 契约

#### 7.3.0 `Page<T>` / `PageInfo` repository helper

`Page<T>` 和 `PageInfo` 是 application repository port 的返回包装,归属 `crates/application/src/ports.rs`。它们不是 public contracts DTO,不得序列化到 query response;query response 必须把 `PageInfo` 显式映射成 contracts view 中的 `next_page_token` 和 `has_more` 字段。

`PageRequest` 与 `PageToken` 复用 `core-contracts` 的正式类型。conversation 不重新定义请求分页类型。

```rust
/// Repository page result used by application ports.
pub struct Page<T> {
    /// Items returned for the requested page.
    pub items: Vec<T>,
    /// Cursor and flags for the next repository read.
    pub page_info: PageInfo,
}

/// Repository page metadata derived from core PageRequest and store result.
pub struct PageInfo {
    /// Token to request the next page.
    pub next_page_token: Option<PageToken>,
    /// Whether more rows exist after this page.
    pub has_more: bool,
}
```

| 类型 | 字段 | 类型 | 来源 | 约束 |
|---|---|---|---|---|
| `Page<T>` | `items` | `Vec<T>` | repository read result | 按 repository 函数约定排序;不得包含未授权过滤后的 public DTO |
| `Page<T>` | `page_info` | `PageInfo` | repository cursor state | 必填 |
| `PageInfo` | `next_page_token` | `Option<PageToken>` | core `PageToken` from store cursor | 无下一页时为 `None` |
| `PageInfo` | `has_more` | `bool` | store has-more probe 或 cursor 判断 | 简单 cursor store 可用 `next_page_token.is_some()`;若 visibility 过滤使当前 `items` 为空但后续候选仍存在,可为 `true` |

使用约束:

- repository port 返回的 `Page<T>` 只表达 committed truth / projection row 的分页读取结果,不承载 query envelope、consistency 或 consumer context。
- application query service 对 `Page<ConversationFactRef>` 做 visibility 过滤后,必须用 `refs.page_info.next_page_token` 和 `refs.page_info.has_more` 构造 `ConversationFactPage`。
- job / rebuild 使用 `Page<T>` 时不得把 `PageInfo` 写入 domain truth;它只用于继续读取下一批。

#### 7.3.1 `SpaceScopeRepository`

```rust
/// Repository port for conversation spaces, participant scopes, visibility scopes, and scope change records.
pub trait SpaceScopeRepository {
    /// Loads a conversation space without acquiring a write lock.
    async fn get_space(
        &self,
        space_id: ConversationSpaceId,
    ) -> Result<Option<ConversationSpace>, RepositoryError>;

    /// Loads a conversation space for a write transaction.
    async fn get_space_for_update(
        &self,
        space_id: ConversationSpaceId,
        uow: UnitOfWorkHandle,
    ) -> Result<Option<ConversationSpace>, RepositoryError>;

    /// Loads the active participant scope for a conversation space.
    async fn get_participant_scope(
        &self,
        space_id: ConversationSpaceId,
    ) -> Result<Option<ParticipantScope>, RepositoryError>;

    /// Loads the active visibility scope for a conversation space.
    async fn get_visibility_scope(
        &self,
        space_id: ConversationSpaceId,
    ) -> Result<Option<VisibilityScope>, RepositoryError>;

    /// Saves a space, participant scope, visibility scope, and scope change atomically.
    async fn save_scope_bundle(
        &self,
        bundle: ScopeMutationBundle,
        uow: UnitOfWorkHandle,
    ) -> Result<Version, RepositoryError>;

    /// Lists spaces covered by an operational scope.
    async fn list_spaces(
        &self,
        scope: ConversationSpaceScope,
        page: PageRequest,
    ) -> Result<Page<ConversationSpace>, RepositoryError>;
}
```

| 函数签名 | 作用 | 参数说明 | 返回 | 错误类型 |
|---|---|---|---|---|
| `get_space(space_id: ConversationSpaceId)` | 只读读取 space | `space_id` 为目标空间 | `Option<ConversationSpace>` | `RepositoryError` |
| `get_space_for_update(space_id: ConversationSpaceId, uow: UnitOfWorkHandle)` | 写事务中读取 space | `space_id` 为目标空间;`uow` 为事务句柄 | `Option<ConversationSpace>` | `RepositoryError` |
| `get_participant_scope(space_id: ConversationSpaceId)` | 读取参与范围 | `space_id` 为目标空间 | `Option<ParticipantScope>` | `RepositoryError` |
| `get_visibility_scope(space_id: ConversationSpaceId)` | 读取可见范围 | `space_id` 为目标空间 | `Option<VisibilityScope>` | `RepositoryError` |
| `save_scope_bundle(bundle: ScopeMutationBundle, uow: UnitOfWorkHandle)` | 原子保存 space / scope / change | `bundle` 为 scope 变更集合 | `Version` | `RepositoryError` |
| `list_spaces(scope: ConversationSpaceScope, page: PageRequest)` | 按运维 scope 分页列出 space | `scope` 为目标范围;`page` 为分页 | `Page<ConversationSpace>` | `RepositoryError` |

`ConversationSpaceScope` 的字段级 schema、默认空 scope 语义和 list 过滤规则见 Step 6 §7.2.5;repository adapter 不得把 scope 实现成裸字符串、空 struct 或 adapter-local filter。

`ScopeMutationBundle` 最小结构和构造约束:

| 字段 | 类型 | 说明 |
|---|---|---|
| `space` | `Option<ConversationSpace>` | space 创建或生命周期变化时必须携带 |
| `participant_scope` | `Option<ParticipantScope>` | 创建或参与范围变化时必须携带 |
| `visibility_scope` | `Option<VisibilityScope>` | 创建或可见范围变化时必须携带 |
| `truth_state` | `Option<ConversationTruthState>` | 创建 conversation truth 初始状态时必须携带 |
| `scope_change` | `ScopeChangeRecord` | 每个 bundle 必须且只能携带一个已应用的 scope change |

| 构造函数 | 必须包含 | 必须为空 | 输出约束 |
|---|---|---|---|
| `created(space, participant, visibility, truth, scope_change)` | `space`、`participant_scope`、`visibility_scope`、`truth_state`、初始 `scope_change` | 无 | 用于创建 space 的初始原子保存;`scope_change` 必须由 application service 显式构造,且 `scope_kind = Space`、`change_reason.reason_kind = InitialCreate` |
| `space_changed(space, scope_change)` | `space`、`scope_change` | `participant_scope`、`visibility_scope`、`truth_state` | 用于 close / archive / owner metadata 等 space 变化;PH-02 close flow 只持久化 `ConversationSpace.lifecycle_state` 与 scope change,不得在本 bundle 写 truth / participant / visibility state |
| `participant_changed(scope, scope_change)` | `participant_scope`、`scope_change` | `space`、`visibility_scope`、`truth_state` | 只保存参与范围变化;批量 add/remove 命令必须合成为一个 `ScopeChangeRecord`,scope version 只递增一次 |
| `visibility_changed(visibility, scope_change)` | `visibility_scope`、`scope_change` | `space`、`participant_scope`、`truth_state` | 只保存可见范围变化;projection stale marker 不在 bundle 内 |

`ScopeMutationBundle` 不承载 read model、projection state、outbox record 或 publish evidence。projection stale marker 必须通过 `ProjectionRepository` 保存,outbox 必须通过 `ConversationOutboxRepository` enqueue。

#### 7.3.2 `ConversationFactRepository`

```rust
/// Repository port for committed conversation facts and append receipts.
pub trait ConversationFactRepository {
    /// Appends a conversation fact and its receipt in the active transaction.
    async fn append_fact(
        &self,
        fact: ConversationFact,
        receipt: FactAppendReceipt,
        uow: UnitOfWorkHandle,
    ) -> Result<Version, RepositoryError>;

    /// Saves a state-only update for an existing conversation fact.
    async fn save_fact_state(
        &self,
        fact: ConversationFact,
        uow: UnitOfWorkHandle,
    ) -> Result<Version, RepositoryError>;

    /// Loads a fact by id.
    async fn get_fact(
        &self,
        fact_id: ConversationFactId,
    ) -> Result<Option<ConversationFact>, RepositoryError>;

    /// Loads a fact for a write transaction.
    async fn get_fact_for_update(
        &self,
        fact_id: ConversationFactId,
        uow: UnitOfWorkHandle,
    ) -> Result<Option<ConversationFact>, RepositoryError>;

    /// Lists fact refs in append order for a space.
    async fn list_fact_refs(
        &self,
        space_id: ConversationSpaceId,
        page: PageRequest,
    ) -> Result<Page<ConversationFactRef>, RepositoryError>;

    /// Lists facts in append order for rebuild and consistency validation.
    async fn list_facts(
        &self,
        space_id: ConversationSpaceId,
        page: PageRequest,
    ) -> Result<Page<ConversationFact>, RepositoryError>;
}
```

| 函数签名 | 作用 | 参数说明 | 返回 | 错误类型 |
|---|---|---|---|---|
| `append_fact(fact: ConversationFact, receipt: FactAppendReceipt, uow: UnitOfWorkHandle)` | 保存事实和回执 | fact、receipt、事务句柄 | `Version` | `RepositoryError` |
| `save_fact_state(fact: ConversationFact, uow: UnitOfWorkHandle)` | 保存已有事实状态变化 | fact、事务句柄 | `Version` | `RepositoryError` |
| `get_fact(fact_id: ConversationFactId)` | 读取事实 | fact id | `Option<ConversationFact>` | `RepositoryError` |
| `get_fact_for_update(fact_id: ConversationFactId, uow: UnitOfWorkHandle)` | 写事务读取事实 | fact id、事务句柄 | `Option<ConversationFact>` | `RepositoryError` |
| `list_fact_refs(space_id: ConversationSpaceId, page: PageRequest)` | 分页列出事实引用 | space id、分页参数 | `Page<ConversationFactRef>` | `RepositoryError` |
| `list_facts(space_id: ConversationSpaceId, page: PageRequest)` | 分页列出事实对象 | space id、分页参数 | `Page<ConversationFact>` | `RepositoryError` |

#### 7.3.3 `ManifestationRepository`

```rust
/// Repository port for cross-domain manifestation records.
pub trait ManifestationRepository {
    /// Inserts a new manifestation record.
    async fn insert_manifestation(
        &self,
        manifestation: CrossDomainManifestation,
        uow: UnitOfWorkHandle,
    ) -> Result<Version, RepositoryError>;

    /// Loads a manifestation by id.
    async fn get_manifestation(
        &self,
        manifestation_id: CrossDomainManifestationId,
    ) -> Result<Option<CrossDomainManifestation>, RepositoryError>;

    /// Loads a manifestation for a write transaction.
    async fn get_manifestation_for_update(
        &self,
        manifestation_id: CrossDomainManifestationId,
        uow: UnitOfWorkHandle,
    ) -> Result<Option<CrossDomainManifestation>, RepositoryError>;

    /// Finds manifestation records by external fact reference.
    async fn find_by_external_fact(
        &self,
        external_fact_ref: ExternalFactRef,
    ) -> Result<Vec<CrossDomainManifestationRef>, RepositoryError>;
}
```

| 函数签名 | 作用 | 参数说明 | 返回 | 错误类型 |
|---|---|---|---|---|
| `insert_manifestation(manifestation: CrossDomainManifestation, uow: UnitOfWorkHandle)` | 保存显化记录 | manifestation、事务句柄 | `Version` | `RepositoryError` |
| `get_manifestation(manifestation_id: CrossDomainManifestationId)` | 读取显化记录 | manifestation id | `Option<CrossDomainManifestation>` | `RepositoryError` |
| `get_manifestation_for_update(manifestation_id: CrossDomainManifestationId, uow: UnitOfWorkHandle)` | 写事务读取显化 | manifestation id、事务句柄 | `Option<CrossDomainManifestation>` | `RepositoryError` |
| `find_by_external_fact(external_fact_ref: ExternalFactRef)` | 按外部事实查显化 | external ref | `Vec<CrossDomainManifestationRef>` | `RepositoryError` |

#### 7.3.4 `TraceRepository`

```rust
/// Repository port for trace contexts, review anchors, and handoff records.
pub trait TraceRepository {
    /// Reads a trace context.
    async fn get_trace_context(
        &self,
        trace_context_id: ConversationTraceContextId,
    ) -> Result<Option<ConversationTraceContext>, RepositoryError>;

    /// Reads a review anchor.
    async fn get_review_anchor(
        &self,
        review_anchor_id: ReviewAnchorId,
    ) -> Result<Option<ReviewAnchor>, RepositoryError>;

    /// Saves or updates a conversation trace context.
    async fn save_trace_context(
        &self,
        trace_context: ConversationTraceContext,
        uow: UnitOfWorkHandle,
    ) -> Result<Version, RepositoryError>;

    /// Saves a review anchor.
    async fn save_review_anchor(
        &self,
        review_anchor: ReviewAnchor,
        uow: UnitOfWorkHandle,
    ) -> Result<Version, RepositoryError>;

    /// Saves a trace handoff record.
    async fn save_trace_handoff(
        &self,
        handoff: TraceHandoffRecord,
        uow: UnitOfWorkHandle,
    ) -> Result<Version, RepositoryError>;

    /// Saves an archive handoff record.
    async fn save_archive_handoff(
        &self,
        handoff: ArchiveHandoffRecord,
        uow: UnitOfWorkHandle,
    ) -> Result<Version, RepositoryError>;

    /// Reads and locks a trace handoff record.
    async fn get_trace_handoff_for_update(
        &self,
        handoff_id: TraceHandoffRecordId,
        uow: UnitOfWorkHandle,
    ) -> Result<Option<TraceHandoffRecord>, RepositoryError>;

    /// Reads and locks an archive handoff record.
    async fn get_archive_handoff_for_update(
        &self,
        handoff_id: ArchiveHandoffRecordId,
        uow: UnitOfWorkHandle,
    ) -> Result<Option<ArchiveHandoffRecord>, RepositoryError>;

    /// Lists trace handoff records that are ready for delivery or retry.
    async fn list_pending_trace_handoffs(
        &self,
        scope: TraceHandoffScope,
        page: PageRequest,
    ) -> Result<Page<TraceHandoffRecord>, RepositoryError>;

    /// Lists archive handoff records that are ready for delivery or retry.
    async fn list_pending_archive_handoffs(
        &self,
        scope: ArchiveHandoffScope,
        page: PageRequest,
    ) -> Result<Page<ArchiveHandoffRecord>, RepositoryError>;
}
```

| 函数签名 | 作用 | 参数说明 | 返回 | 错误类型 |
|---|---|---|---|---|
| `get_trace_context(trace_context_id: ConversationTraceContextId)` | 读取追溯上下文 | trace context id | `Option<ConversationTraceContext>` | `RepositoryError` |
| `get_review_anchor(review_anchor_id: ReviewAnchorId)` | 读取复盘锚点 | review anchor id | `Option<ReviewAnchor>` | `RepositoryError` |
| `save_trace_context(trace_context: ConversationTraceContext, uow: UnitOfWorkHandle)` | 保存追溯上下文 | trace context、事务句柄 | `Version` | `RepositoryError` |
| `save_review_anchor(review_anchor: ReviewAnchor, uow: UnitOfWorkHandle)` | 保存复盘锚点 | review anchor、事务句柄 | `Version` | `RepositoryError` |
| `save_trace_handoff(handoff: TraceHandoffRecord, uow: UnitOfWorkHandle)` | 保存 trace handoff | handoff、事务句柄 | `Version` | `RepositoryError` |
| `save_archive_handoff(handoff: ArchiveHandoffRecord, uow: UnitOfWorkHandle)` | 保存 archive handoff | handoff、事务句柄 | `Version` | `RepositoryError` |
| `get_trace_handoff_for_update(handoff_id: TraceHandoffRecordId, uow: UnitOfWorkHandle)` | 写事务读取 trace handoff | handoff id、事务句柄 | `Option<TraceHandoffRecord>` | `RepositoryError` |
| `get_archive_handoff_for_update(handoff_id: ArchiveHandoffRecordId, uow: UnitOfWorkHandle)` | 写事务读取 archive handoff | handoff id、事务句柄 | `Option<ArchiveHandoffRecord>` | `RepositoryError` |
| `list_pending_trace_handoffs(scope: TraceHandoffScope, page: PageRequest)` | 分页列出待交接 trace handoff | scope、分页参数 | `Page<TraceHandoffRecord>` | `RepositoryError` |
| `list_pending_archive_handoffs(scope: ArchiveHandoffScope, page: PageRequest)` | 分页列出待归档 handoff | scope、分页参数 | `Page<ArchiveHandoffRecord>` | `RepositoryError` |

Scope 过滤语义:

- `TraceHandoffScope`、`ArchiveHandoffScope` 属于 `contracts/refs.rs`,字段级 schema 见 Step 6 §7.2.3;repository 不得定义 application-local scope。
- 两个 list 函数只返回 `Pending` 或 retry due 的 `RetryPending` 记录;`Failed`、`Cancelled`、`HandedOff`、`Archived` 终态不得返回。
- `ready_at_or_before` 必须由 application job service 在调用前用 `ClockPort.now()` 补齐;repository 只比较字段,不得自行读取 wall clock。
- trace handoff 按 `TraceHandoffRecord.destination_ref` 匹配 destination;archive handoff 的 `ArchiveDestinationRef` 是 job-level adapter 目标,不进入 repository scope。
- 排序必须稳定:优先 `retry_marker.next_retry_at ASC NULLS FIRST`,其次创建时间或记录 id 单调字段 ASC,最后 handoff id ASC;分页在过滤和排序后应用。

#### 7.3.5 `ProjectionRepository`

```rust
/// Repository port for read models, cursors, search projections, and projection state.
pub trait ProjectionRepository {
    /// Upserts an authorized read model.
    async fn upsert_read_model(
        &self,
        read_model: ConversationReadModel,
        uow: UnitOfWorkHandle,
    ) -> Result<Version, RepositoryError>;

    /// Loads an authorized read model for a consumer.
    async fn get_read_model(
        &self,
        space_id: ConversationSpaceId,
        consumer: ConsumerRef,
    ) -> Result<Option<ConversationReadModel>, RepositoryError>;

    /// Reads a change cursor.
    async fn get_change_cursor(
        &self,
        space_id: ConversationSpaceId,
        consumer: ConsumerRef,
    ) -> Result<Option<ConversationChangeCursor>, RepositoryError>;

    /// Lists derived change entries after an outbox position.
    async fn list_change_entries_after(
        &self,
        space_id: ConversationSpaceId,
        after: ConversationOutboxSequence,
        limit: PageLimit,
    ) -> Result<Vec<ConversationChangeCursorEntry>, RepositoryError>;

    /// Saves a change cursor.
    async fn save_change_cursor(
        &self,
        cursor: ConversationChangeCursor,
        uow: UnitOfWorkHandle,
    ) -> Result<Version, RepositoryError>;

    /// Deletes an expired derived cursor without touching conversation facts.
    async fn delete_change_cursor(
        &self,
        cursor_id: ConversationChangeCursorId,
        uow: UnitOfWorkHandle,
    ) -> Result<Version, RepositoryError>;

    /// Lists expired or invalid cursors for cleanup jobs.
    async fn list_expired_change_cursors(
        &self,
        scope: ConsumerScope,
        expired_before: Timestamp,
        page: PageRequest,
    ) -> Result<Page<ConversationChangeCursor>, RepositoryError>;

    /// Reads projection freshness state.
    async fn get_projection_state(
        &self,
        space_id: ConversationSpaceId,
        kind: ConversationProjectionKind,
    ) -> Result<Option<ConversationProjectionState>, RepositoryError>;

    /// Saves projection freshness state.
    async fn save_projection_state(
        &self,
        state: ConversationProjectionState,
        uow: UnitOfWorkHandle,
    ) -> Result<Version, RepositoryError>;

    /// Reads a search projection.
    async fn get_search_projection(
        &self,
        space_id: ConversationSpaceId,
    ) -> Result<Option<SearchIndexProjection>, RepositoryError>;

    /// Saves a search projection.
    async fn upsert_search_projection(
        &self,
        projection: SearchIndexProjection,
        uow: UnitOfWorkHandle,
    ) -> Result<Version, RepositoryError>;

    /// Reads the change cursor projection for a space.
    async fn get_change_cursor_projection(
        &self,
        space_id: ConversationSpaceId,
    ) -> Result<Option<ChangeCursorProjection>, RepositoryError>;

    /// Saves a change cursor projection.
    async fn upsert_change_cursor_projection(
        &self,
        projection: ChangeCursorProjection,
        uow: UnitOfWorkHandle,
    ) -> Result<Version, RepositoryError>;

    /// Lists read models for rebuild-derived projections.
    async fn list_read_models(
        &self,
        space_id: ConversationSpaceId,
        page: PageRequest,
    ) -> Result<Page<ConversationReadModel>, RepositoryError>;
}
```

| 函数签名 | 作用 | 参数说明 | 返回 | 错误类型 |
|---|---|---|---|---|
| `upsert_read_model(read_model: ConversationReadModel, uow: UnitOfWorkHandle)` | 保存读取视图 | read model、事务句柄 | `Version` | `RepositoryError` |
| `get_read_model(space_id: ConversationSpaceId, consumer: ConsumerRef)` | 读取视图 | space、consumer | `Option<ConversationReadModel>` | `RepositoryError` |
| `get_change_cursor(space_id: ConversationSpaceId, consumer: ConsumerRef)` | 读取变化游标 | space、consumer | `Option<ConversationChangeCursor>` | `RepositoryError` |
| `list_change_entries_after(space_id: ConversationSpaceId, after: ConversationOutboxSequence, limit: PageLimit)` | 读取指定 outbox 位置后的变化条目 | space、outbox 位置、数量限制 | `Vec<ConversationChangeCursorEntry>` | `RepositoryError` |
| `save_change_cursor(cursor: ConversationChangeCursor, uow: UnitOfWorkHandle)` | 保存游标 | cursor、事务句柄 | `Version` | `RepositoryError` |
| `delete_change_cursor(cursor_id: ConversationChangeCursorId, uow: UnitOfWorkHandle)` | 删除过期派生游标 | cursor id、事务句柄 | `Version` | `RepositoryError` |
| `list_expired_change_cursors(scope: ConsumerScope, expired_before: Timestamp, page: PageRequest)` | 列出过期游标 | consumer scope、过期时间、分页 | `Page<ConversationChangeCursor>` | `RepositoryError` |
| `get_projection_state(space_id: ConversationSpaceId, kind: ConversationProjectionKind)` | 读取派生状态 | space、projection kind | `Option<ConversationProjectionState>` | `RepositoryError` |
| `save_projection_state(state: ConversationProjectionState, uow: UnitOfWorkHandle)` | 保存派生状态 | projection state、事务句柄 | `Version` | `RepositoryError` |
| `get_search_projection(space_id: ConversationSpaceId)` | 读取搜索投影 | space id | `Option<SearchIndexProjection>` | `RepositoryError` |
| `upsert_search_projection(projection: SearchIndexProjection, uow: UnitOfWorkHandle)` | 保存搜索投影 | projection、事务句柄 | `Version` | `RepositoryError` |
| `get_change_cursor_projection(space_id: ConversationSpaceId)` | 读取变化游标投影 | space id | `Option<ChangeCursorProjection>` | `RepositoryError` |
| `upsert_change_cursor_projection(projection: ChangeCursorProjection, uow: UnitOfWorkHandle)` | 保存变化游标投影 | projection、事务句柄 | `Version` | `RepositoryError` |
| `list_read_models(space_id: ConversationSpaceId, page: PageRequest)` | 分页列出读取视图 | space、分页 | `Page<ConversationReadModel>` | `RepositoryError` |

`ConsumerScope` 的字段级 schema、默认空 scope 语义和 `expand_for_space(...)` 口径见 Step 6 §7.2.5;`list_expired_change_cursors(...)` 不得把 consumer scope 扩展为 participant list 或 actor list。

`ProjectionRepository` 类型边界:

- `get_read_model(...)` 和 `list_read_models(...)` 的返回类型必须是 `domain/projection.rs::ConversationReadModel`。
- `ConversationReadModelView` 属于 `contracts/views.rs`,只允许由 application query service 或 API handler 从授权后的 `ConversationReadModel` 构造。
- 即使当前 implementation step 尚未落 `domain::ConversationReadModel`,也不得把 `ProjectionRepository` 返回类型临时改成 `ConversationReadModelView`;应先补 domain read model 对象,再实现 repository / service。
- 这样保留 `VisibilityPolicy.filter_read_model(ConversationReadModel, ConsumerRef)`、rebuild job 和 public query DTO 之间的三层边界,避免 repository adapter 直接生成 public response。

#### 7.3.6 `ExternalReferenceRepository`

```rust
/// Repository port for safe external snapshots and external reference projections.
pub trait ExternalReferenceRepository {
    /// Upserts a safe external fact snapshot.
    async fn upsert_snapshot(
        &self,
        snapshot: ExternalFactSnapshot,
        uow: UnitOfWorkHandle,
    ) -> Result<Version, RepositoryError>;

    /// Loads a snapshot by id.
    async fn get_snapshot(
        &self,
        snapshot_id: ExternalFactSnapshotId,
    ) -> Result<Option<ExternalFactSnapshot>, RepositoryError>;

    /// Upserts an external reference projection.
    async fn upsert_reference_projection(
        &self,
        projection: ExternalReferenceProjection,
        uow: UnitOfWorkHandle,
    ) -> Result<Version, RepositoryError>;

    /// Loads a reference projection for a space.
    async fn get_reference_projection(
        &self,
        space_id: ConversationSpaceId,
    ) -> Result<Option<ExternalReferenceProjection>, RepositoryError>;

    /// Lists external reference projections for snapshot refresh.
    async fn list_reference_projections(
        &self,
        scope: ConversationSpaceScope,
        page: PageRequest,
    ) -> Result<Page<ExternalReferenceProjection>, RepositoryError>;
}
```

| 函数签名 | 作用 | 参数说明 | 返回 | 错误类型 |
|---|---|---|---|---|
| `upsert_snapshot(snapshot: ExternalFactSnapshot, uow: UnitOfWorkHandle)` | 保存安全快照 | snapshot、事务句柄 | `Version` | `RepositoryError` |
| `get_snapshot(snapshot_id: ExternalFactSnapshotId)` | 读取快照 | snapshot id | `Option<ExternalFactSnapshot>` | `RepositoryError` |
| `upsert_reference_projection(projection: ExternalReferenceProjection, uow: UnitOfWorkHandle)` | 保存引用投影 | projection、事务句柄 | `Version` | `RepositoryError` |
| `get_reference_projection(space_id: ConversationSpaceId)` | 读取引用投影 | space id | `Option<ExternalReferenceProjection>` | `RepositoryError` |
| `list_reference_projections(scope: ConversationSpaceScope, page: PageRequest)` | 按 space scope 列出引用投影 | scope、分页参数 | `Page<ExternalReferenceProjection>` | `RepositoryError` |

`list_reference_projections(...)` 使用 Step 6 §7.2.5 的 `ConversationSpaceScope` 过滤 projection 所属 space;不得从 external source body、snapshot body 或 resolver response 反推 space。

#### 7.3.7 `ConversationOutboxRepository`

```rust
/// Repository port for committed conversation outbox records.
pub trait ConversationOutboxRepository {
    /// Enqueues a committed outbox record in the active transaction.
    async fn enqueue(
        &self,
        outbox: ConversationOutboxRecord,
        uow: UnitOfWorkHandle,
    ) -> Result<Version, RepositoryError>;

    /// Lists pending outbox records for publication.
    async fn list_pending(
        &self,
        limit: BatchSize,
    ) -> Result<Vec<ConversationOutboxRecord>, RepositoryError>;

    /// Lists committed outbox records after a source position for cursor rebuild.
    /// Returned records must include committed_at and cursor metadata fields.
    async fn list_committed_since(
        &self,
        space_id: ConversationSpaceId,
        after: ConversationOutboxSequence,
        limit: PageLimit,
    ) -> Result<Vec<ConversationOutboxRecord>, RepositoryError>;

    /// Loads an outbox record for a write transaction.
    async fn get_for_update(
        &self,
        outbox_record_id: ConversationOutboxRecordId,
        uow: UnitOfWorkHandle,
    ) -> Result<Option<ConversationOutboxRecord>, RepositoryError>;

    /// Saves publication state changes.
    async fn save_state(
        &self,
        outbox: ConversationOutboxRecord,
        uow: UnitOfWorkHandle,
    ) -> Result<Version, RepositoryError>;
}
```

| 函数签名 | 作用 | 参数说明 | 返回 | 错误类型 |
|---|---|---|---|---|
| `enqueue(outbox: ConversationOutboxRecord, uow: UnitOfWorkHandle)` | 入队 outbox | outbox、事务句柄 | `Version` | `RepositoryError` |
| `list_pending(limit: BatchSize)` | 列出待发布记录 | batch size | `Vec<ConversationOutboxRecord>` | `RepositoryError` |
| `list_committed_since(space_id: ConversationSpaceId, after: ConversationOutboxSequence, limit: PageLimit)` | 读取指定 outbox 位置后的已提交变化 | space、outbox 位置、数量限制 | `Vec<ConversationOutboxRecord>` | `RepositoryError`;返回 record 必须保留 `committed_at`、`visibility_scope_id`、`fact_sequence`、`fact_ref`、`manifestation_ref` |
| `get_for_update(outbox_record_id: ConversationOutboxRecordId, uow: UnitOfWorkHandle)` | 写事务读取 outbox | record id、事务句柄 | `Option<ConversationOutboxRecord>` | `RepositoryError` |
| `save_state(outbox: ConversationOutboxRecord, uow: UnitOfWorkHandle)` | 保存状态推进 | outbox、事务句柄 | `Version` | `RepositoryError` |

`ConversationOutboxRepository` 的 committed read 口径:

- `enqueue(...)` 接收的 `ConversationOutboxRecord` 必须已经由 application service / domain factory 填好 `committed_at` 与 change cursor metadata;repository 不得在 `list_committed_since(...)` 时临时生成这些字段。
- `list_pending(...)` 和 `list_committed_since(...)` 返回的是同一正式 `ConversationOutboxRecord` schema,不得为发布路径或 cursor rebuild 裁剪成不同 DTO。
- `list_committed_since(...)` 必须按 `outbox_sequence` 单调升序返回;`after` 是 exclusive lower bound。

### 7.4 `application` 模块:technical port 契约

#### 7.4.1 `UnitOfWork`

```rust
/// Transaction boundary used by write-like application flows.
pub trait UnitOfWork {
    /// Starts a new unit of work.
    async fn begin(&self) -> Result<UnitOfWorkHandle, TransactionError>;

    /// Commits the active unit of work.
    async fn commit(&self, handle: UnitOfWorkHandle) -> Result<(), TransactionError>;

    /// Rolls back the active unit of work.
    async fn rollback(&self, handle: UnitOfWorkHandle) -> Result<(), TransactionError>;
}
```

| 函数签名 | 作用 | 参数说明 | 返回 | 错误类型 |
|---|---|---|---|---|
| `begin()` | 开启事务 | 无 | `UnitOfWorkHandle` | `TransactionError` |
| `commit(handle: UnitOfWorkHandle)` | 提交事务 | 事务句柄 | `()` | `TransactionError` |
| `rollback(handle: UnitOfWorkHandle)` | 回滚事务 | 事务句柄 | `()` | `TransactionError` |

#### 7.4.2 `IdempotencyRepository`

```rust
/// Repository port for command, consumer, and job idempotency records.
pub trait IdempotencyRepository {
    /// Reserves an idempotency key for the current operation.
    async fn reserve(
        &self,
        key: IdempotencyKey,
        operation: IdempotencyOperation,
        request_digest: RequestDigest,
        uow: UnitOfWorkHandle,
    ) -> Result<IdempotencyReservation, IdempotencyError>;

    /// Marks an idempotency reservation as completed.
    async fn complete(
        &self,
        reservation: IdempotencyReservation,
        result_ref: IdempotencyResultRef,
        uow: UnitOfWorkHandle,
    ) -> Result<(), IdempotencyError>;

    /// Marks an idempotency key as conflicted.
    async fn mark_conflict(
        &self,
        key: IdempotencyKey,
        conflict: IdempotencyConflict,
        uow: UnitOfWorkHandle,
    ) -> Result<(), IdempotencyError>;

    /// Finds an existing idempotency record without changing state.
    async fn find(
        &self,
        key: IdempotencyKey,
    ) -> Result<Option<IdempotencyRecord>, IdempotencyError>;
}
```

| 函数签名 | 作用 | 参数说明 | 返回 | 错误类型 |
|---|---|---|---|---|
| `reserve(key: IdempotencyKey, operation: IdempotencyOperation, request_digest: RequestDigest, uow: UnitOfWorkHandle)` | 预留幂等键 | key、operation、规范化请求摘要、事务句柄 | `IdempotencyReservation` | `IdempotencyError` |
| `complete(reservation: IdempotencyReservation, result_ref: IdempotencyResultRef, uow: UnitOfWorkHandle)` | 标记完成 | reservation、结果引用、事务句柄 | `()` | `IdempotencyError` |
| `mark_conflict(key: IdempotencyKey, conflict: IdempotencyConflict, uow: UnitOfWorkHandle)` | 标记冲突 | key、冲突信息、事务句柄 | `()` | `IdempotencyError` |
| `find(key: IdempotencyKey)` | 只读查询幂等记录 | key | `Option<IdempotencyRecord>` | `IdempotencyError` |

幂等最小数据契约:

| 类型 | 最小字段 | 约束 |
|---|---|---|
| `RequestDigest` | `algorithm_version: DigestAlgorithmVersion`、`digest_value: String` | application service 在 validate 后按规范化 command / event / job 输入计算;不得包含 `request_id`、`requested_at`、`trace_context` 等 volatile metadata |
| `IdempotencyRecord` | `key`、`operation`、`request_digest`、`status: Reserved, Completed, Conflicted`、`result_ref: Option<IdempotencyResultRef>`、`reserved_at`、`completed_at: Option<Timestamp>`、`conflict_reason: Option<IdempotencyConflictReason>` | `key + operation + request_digest` 是 duplicate 判断真相源;同 key 不同 operation 或 digest 必须 conflict |
| `IdempotencyReservation` | `reservation_kind: ReservedNew, DuplicateCompleted, InProgress, ConflictDetected`、`record: IdempotencyRecord`、`conflict: Option<IdempotencyConflict>` | duplicate 只能返回已 completed 且 digest 相同的 record;in-progress 不得生成新业务事实;conflict detected 分支必须调用 `mark_conflict(...)` 后返回 conflict |
| `IdempotencyConflict` | `key`、`existing_operation`、`observed_operation`、`existing_request_digest`、`observed_request_digest`、`conflict_reason`、`detected_at` | `mark_conflict(...)` 的正式输入 |
| `ApplicationResultRef` | `result_kind: Command, Consumer, Job`、`result_id: String` | application 本地结果回指;command 结果可由 contracts `CommandResultRef` 映射 |
| `IdempotencyResultRef` | `operation: IdempotencyOperation`、`application_result_ref: ApplicationResultRef` | `complete(...)` 保存的幂等结果引用 |

`reserve(...)` 的比较规则:

- 未命中记录时创建 `ReservedNew`。
- 命中同 key、同 operation、同 request digest 且 completed 的记录时返回 `DuplicateCompleted`,application service 必须返回既有 result / receipt,不得重新写 scope、truth 或 outbox。
- 命中同 key、同 operation、同 request digest 但尚未 completed 的记录时返回 `InProgress` 或对应 idempotency error,不得生成新业务事实。
- 命中同 key 但 operation 或 request digest 不同的记录时返回 `ConflictDetected` reservation,application service 必须调用 `mark_conflict(...)` 后返回 conflict。

#### 7.4.3 `ClockPort` 与 `IdGeneratorPort`

```rust
/// Clock port used to avoid direct system time access in application services.
pub trait ClockPort {
    /// Returns the current timestamp.
    fn now(&self) -> Timestamp;
}

/// Id generator port for conversation domain ids and sequences.
pub trait IdGeneratorPort {
    /// Generates a new conversation space id.
    fn next_space_id(&self) -> ConversationSpaceId;

    /// Generates a new conversation fact id.
    fn next_fact_id(&self) -> ConversationFactId;

    /// Generates a new outbox record id.
    fn next_outbox_record_id(&self) -> ConversationOutboxRecordId;

    /// Generates a new monotonically comparable sequence for a space.
    fn next_fact_sequence(&self, space_id: ConversationSpaceId) -> ConversationFactSequence;
}
```

| 函数签名 | 作用 | 参数说明 | 返回 | 错误类型 |
|---|---|---|---|---|
| `now()` | 当前时间 | 无 | `Timestamp` | 不适用 |
| `next_space_id()` | 生成 space id | 无 | `ConversationSpaceId` | 不适用 |
| `next_fact_id()` | 生成 fact id | 无 | `ConversationFactId` | 不适用 |
| `next_outbox_record_id()` | 生成 outbox id | 无 | `ConversationOutboxRecordId` | 不适用 |
| `next_fact_sequence(space_id: ConversationSpaceId)` | 生成事实序列 | space id | `ConversationFactSequence` | 不适用 |

### 7.5 `application` 模块:external resolver / publisher / handoff port 契约

#### 7.5.1 `ActorResolverPort`

```rust
/// Resolves actor references into safe participant display material without owning identity truth.
pub trait ActorResolverPort {
    /// Resolves an actor reference into a safe actor snapshot.
    async fn resolve_actor(
        &self,
        actor: ActorRef,
        trace_ref: TraceContextRef,
    ) -> Result<ActorSnapshot, ResolverError>;

    /// Checks whether an actor reference is currently resolvable.
    async fn is_actor_resolvable(
        &self,
        actor: ActorRef,
    ) -> Result<bool, ResolverError>;
}
```

| 函数签名 | 作用 | 参数说明 | 返回 | 错误类型 |
|---|---|---|---|---|
| `resolve_actor(actor: ActorRef, trace_ref: TraceContextRef)` | 解析 actor 安全快照 | actor 与 trace | `ActorSnapshot` | `ResolverError` |
| `is_actor_resolvable(actor: ActorRef)` | 判断 actor 是否可解析 | actor | `bool` | `ResolverError` |

`ActorSnapshot` 的正式 schema 见 Step 6 §7.7.0,归属 `conversation-contracts/src/refs.rs` 的 resolver-facing safe DTO。`ActorResolverPort` 必须定义在 `crates/application/src/ports.rs`;默认 adapter `ConfiguredActorResolverAdapter` 定义在 `crates/infra/src/source_resolvers.rs`,实现该 port。

Actor resolver 落码口径:

| 项 | 正式口径 |
|---|---|
| port 文件 | `crates/application/src/ports.rs` |
| safe DTO | `crates/contracts/src/refs.rs::ActorSnapshot` |
| configured adapter | `crates/infra/src/source_resolvers.rs::ConfiguredActorResolverAdapter` |
| fake adapter / fixture | 同文件或测试 fixture,必须返回 `ActorSnapshot` 或 `ResolverError`,不得返回 identity crate DTO |
| 成功返回 | `ActorSnapshot { actor_ref, actor_version_ref, actor_digest, display_summary_ref, resolution_state, resolution_reason }` |
| not found / unavailable | `ResolverError` 或 `ActorSnapshot.resolution_state = Unresolved/Pending` 的明确策略;consumer flow 按 Step 9 处理 stale / quarantine marker |
| 禁止返回 | identity private profile、role assignment list、raw upstream response、secret、token、source body |

`is_actor_resolvable(...)` 是 lightweight guard,只能表达当前 actor ref 是否可解析;不得替代 `resolve_actor(...)` 的 snapshot freshness、digest 或 display summary。

#### 7.5.2 `ExternalFactResolverPort`

```rust
/// Resolves external fact references and produces safe snapshots without copying external truth.
pub trait ExternalFactResolverPort {
    /// Resolves an external fact reference into current resolution metadata.
    async fn resolve_external_fact(
        &self,
        external_fact_ref: ExternalFactRef,
        trace_ref: TraceContextRef,
    ) -> Result<ExternalFactResolution, ResolverError>;

    /// Loads a safe display snapshot for an external fact reference.
    async fn load_safe_snapshot(
        &self,
        external_fact_ref: ExternalFactRef,
        visibility: VisibilityScope,
    ) -> Result<ExternalFactSnapshot, ResolverError>;

    /// Checks whether the known snapshot digest still matches the source.
    async fn verify_digest(
        &self,
        external_fact_ref: ExternalFactRef,
        digest: ExternalSourceDigest,
    ) -> Result<DigestVerification, ResolverError>;
}
```

| 函数签名 | 作用 | 参数说明 | 返回 | 错误类型 |
|---|---|---|---|---|
| `resolve_external_fact(external_fact_ref: ExternalFactRef, trace_ref: TraceContextRef)` | 解析外部事实元信息 | external ref 与 trace | `ExternalFactResolution` | `ResolverError` |
| `load_safe_snapshot(external_fact_ref: ExternalFactRef, visibility: VisibilityScope)` | 加载安全快照 | external ref 与 visibility | `ExternalFactSnapshot` | `ResolverError` |
| `verify_digest(external_fact_ref: ExternalFactRef, digest: ExternalSourceDigest)` | 校验 digest | external ref 与摘要 | `DigestVerification` | `ResolverError` |

`ExternalFactResolution` 和 `DigestVerification` 的正式 schema 见 Step 6 §7.7.0。Port 实现必须只返回 external ref、safe display summary ref、digest、version 和 resolution marker,不得返回 source body、raw upstream response、secret、token 或外部仓私有 DTO。Digest mismatch 必须返回 `DigestVerificationState::Mismatched` 或 `ResolverError`,不得由 adapter 自动刷新 Conversation truth。

#### 7.5.3 `ConversationOutboxPublisherPort`

```rust
/// Publishes committed conversation outbox records to the event collaboration boundary.
pub trait ConversationOutboxPublisherPort {
    /// Publishes one committed outbox record.
    async fn publish(
        &self,
        outbox: ConversationOutboxRecord,
        trace_ref: TraceContextRef,
    ) -> Result<PublishedEventRef, PublishError>;

    /// Publishes a batch of committed outbox records.
    async fn publish_batch(
        &self,
        outbox_records: Vec<ConversationOutboxRecord>,
        trace_ref: TraceContextRef,
    ) -> Result<Vec<PublishedEventRef>, PublishError>;

    /// Publishes a projection state changed event that is not backed by a truth outbox record.
    async fn publish_projection_state_changed(
        &self,
        state: ConversationProjectionState,
        trace_ref: TraceContextRef,
    ) -> Result<PublishedEventRef, PublishError>;
}
```

| 函数签名 | 作用 | 参数说明 | 返回 | 错误类型 |
|---|---|---|---|---|
| `publish(outbox: ConversationOutboxRecord, trace_ref: TraceContextRef)` | 发布单条 outbox | outbox 与 trace | `PublishedEventRef` | `PublishError` |
| `publish_batch(outbox_records: Vec<ConversationOutboxRecord>, trace_ref: TraceContextRef)` | 批量发布 outbox | outbox 列表与 trace | `Vec<PublishedEventRef>` | `PublishError` |
| `publish_projection_state_changed(state: ConversationProjectionState, trace_ref: TraceContextRef)` | 发布派生状态变化事件 | projection state 与 trace | `PublishedEventRef` | `PublishError` |

#### 7.5.3.0 `PublishError`

`PublishError` 属于 `application/ports.rs`,是 `ConversationOutboxPublisherPort` 返回的 adapter error。它不是 public job DTO;publish job runner 必须把它映射为 outbox record 的 retry / failed state,并在需要返回 job surface 时转换成 `JobError` 或 `JobRunReceipt` evidence。

```rust
/// Adapter-level error returned by conversation outbox publisher.
pub enum PublishError {
    /// Outbox event kind does not match the requested publisher path.
    InvalidEventKind {
        expected: Option<ConversationOutboxEventKind>,
        actual: ConversationOutboxEventKind,
        diagnostic_ref: Option<DiagnosticRef>,
    },
    /// Required redacted payload reference is missing.
    PayloadMissing {
        outbox_record_id: ConversationOutboxRecordId,
        diagnostic_ref: Option<DiagnosticRef>,
    },
    /// Event payload violates forbidden-body policy.
    ForbiddenBody { diagnostic_ref: Option<DiagnosticRef> },
    /// Event destination is temporarily unavailable.
    TransportUnavailable { diagnostic_ref: Option<DiagnosticRef> },
    /// Publisher transport timed out.
    Timeout { diagnostic_ref: Option<DiagnosticRef> },
    /// Event destination asked the caller to retry later.
    RateLimited {
        retry_after: Option<Timestamp>,
        diagnostic_ref: Option<DiagnosticRef>,
    },
    /// Destination rejected the event permanently.
    DestinationRejected { diagnostic_ref: Option<DiagnosticRef> },
    /// Publisher adapter configuration is invalid.
    AdapterMisconfigured { diagnostic_ref: Option<DiagnosticRef> },
    /// Publisher adapter returned an unspecified permanent failure.
    PermanentPublisherError { diagnostic_ref: Option<DiagnosticRef> },
}
```

| 变体 | `is_retryable()` | retry / failure 映射 |
|---|---:|---|
| `TransportUnavailable` | 是 | `RetryReasonKind::DestinationUnavailable`;retry exhausted -> `OutboxFailureReasonKind::RetryLimitExceeded` |
| `Timeout` | 是 | `RetryReasonKind::Timeout`;retry exhausted -> `OutboxFailureReasonKind::RetryLimitExceeded` |
| `RateLimited` | 是 | `RetryReasonKind::RateLimited`;retry exhausted -> `OutboxFailureReasonKind::RetryLimitExceeded` |
| `InvalidEventKind` | 否 | `OutboxFailureReasonKind::InvalidEventKind` |
| `PayloadMissing` | 否 | `OutboxFailureReasonKind::PayloadMissing` |
| `ForbiddenBody` | 否 | `OutboxFailureReasonKind::ForbiddenBody` |
| `DestinationRejected` | 否 | `OutboxFailureReasonKind::DestinationRejected` |
| `AdapterMisconfigured` | 否 | `OutboxFailureReasonKind::AdapterMisconfigured` |
| `PermanentPublisherError` | 否 | `OutboxFailureReasonKind::PermanentPublisherError` |

约束:

- `diagnostic_ref` 只能指向安全诊断,不得保存 event body、broker response body、payload body、source body、secret 或 token。
- retryable error 只能进入 `ConversationOutboxRecord::mark_retry(...)` 分支;若 retry limit 已耗尽,必须转换为 `OutboxFailureReasonKind::RetryLimitExceeded` 后进入 `mark_failed(...)`。
- permanent error 不得进入 retry 分支。
- `InvalidEventKind`、`PayloadMissing` 和 `ForbiddenBody` 是 event builder / payload boundary 错误,不得伪装成 transport retry。

#### 7.5.3.1 `HandoffError`

`HandoffError` 属于 `application/ports.rs`,是 `TraceHandoffPort` / `ArchiveHandoffPort` 返回的 adapter error。它不是 public job DTO;job runner 必须把它映射为 handoff record 的 retry / failed state,并在需要返回 job surface 时转换成 `JobError` 或 `JobRunReceipt` evidence。

```rust
/// Adapter-level error returned by observability / archive handoff ports.
pub enum HandoffError {
    /// Destination is temporarily unavailable.
    DestinationUnavailable { diagnostic_ref: Option<DiagnosticRef> },
    /// Adapter call timed out.
    Timeout { diagnostic_ref: Option<DiagnosticRef> },
    /// Destination asked the caller to retry later.
    RateLimited {
        retry_after: Option<Timestamp>,
        diagnostic_ref: Option<DiagnosticRef>,
    },
    /// Destination rejected the handoff permanently.
    DestinationRejected { diagnostic_ref: Option<DiagnosticRef> },
    /// Archive adapter returned a package body or malformed package ref.
    InvalidArchivePackage { diagnostic_ref: Option<DiagnosticRef> },
    /// Payload or archive material violated forbidden-body policy.
    ForbiddenBody { diagnostic_ref: Option<DiagnosticRef> },
    /// Adapter configuration is invalid for this destination.
    AdapterMisconfigured { diagnostic_ref: Option<DiagnosticRef> },
}
```

| 变体 | `is_retryable()` | retry / failure 映射 |
|---|---:|---|
| `DestinationUnavailable` | 是 | `HandoffRetryReasonKind::DestinationUnavailable` |
| `Timeout` | 是 | `HandoffRetryReasonKind::Timeout` |
| `RateLimited` | 是 | `HandoffRetryReasonKind::RateLimited` |
| `DestinationRejected` | 否 | `HandoffFailureReasonKind::DestinationRejected` |
| `InvalidArchivePackage` | 否 | `HandoffFailureReasonKind::PermanentAdapterError` |
| `ForbiddenBody` | 否 | `HandoffFailureReasonKind::PayloadUnsafe` |
| `AdapterMisconfigured` | 否 | `HandoffFailureReasonKind::PermanentAdapterError` |

约束:

- `diagnostic_ref` 只能指向安全诊断,不得保存外部 response body、archive package body、payload body、secret 或 token。
- retryable error 只能进入 `mark_retry(...)` 分支;若 retry policy 已耗尽,必须转换为 `HandoffFailureReasonKind::MaxRetryExceeded` 后进入 `mark_failed(...)`。
- permanent error 不得进入 retry 分支。

#### 7.5.4 `TraceHandoffPort`

```rust
/// Delivers trace handoff material to observability without allowing reverse truth writes.
pub trait TraceHandoffPort {
    /// Delivers one trace handoff record.
    async fn deliver_trace_handoff(
        &self,
        handoff: TraceHandoffRecord,
        trace_context: ConversationTraceContext,
    ) -> Result<ObservabilityReceiptRef, HandoffError>;
}
```

| 函数签名 | 作用 | 参数说明 | 返回 | 错误类型 |
|---|---|---|---|---|
| `deliver_trace_handoff(handoff: TraceHandoffRecord, trace_context: ConversationTraceContext)` | 交接 trace 材料 | handoff record 与 trace context | `ObservabilityReceiptRef` | `HandoffError` |

#### 7.5.5 `ArchiveHandoffPort`

```rust
/// Delivers archive handoff material and receives an archive package reference.
pub trait ArchiveHandoffPort {
    /// Delivers one archive handoff record.
    async fn deliver_archive_handoff(
        &self,
        handoff: ArchiveHandoffRecord,
        trace_context: ConversationTraceContext,
        destination_ref: ArchiveDestinationRef,
    ) -> Result<ArchivePackageRef, HandoffError>;
}
```

| 函数签名 | 作用 | 参数说明 | 返回 | 错误类型 |
|---|---|---|---|---|
| `deliver_archive_handoff(handoff: ArchiveHandoffRecord, trace_context: ConversationTraceContext, destination_ref: ArchiveDestinationRef)` | 交接归档材料 | handoff record、trace context 与归档目的地 | `ArchivePackageRef` | `HandoffError` |

### 7.6 实现方 / 调用方关系表

| trait / port | 调用方 | 默认实现方 | 禁止调用 |
|---|---|---|---|
| `SpaceScopeRepository` | space / scope command service、visibility service | `InMemorySpaceScopeRepository` / future durable adapter | domain、api 直接调用 |
| `ConversationFactRepository` | fact append service、query service | `InMemoryConversationFactRepository` / future durable adapter | domain、worker 直接调用 |
| `ManifestationRepository` | manifestation service、reference refresh service | `InMemoryManifestationRepository` / future durable adapter | domain、api 直接调用 |
| `TraceRepository` | trace review service、handoff jobs | `InMemoryTraceRepository` / future durable adapter | observability / archive 反写 |
| `ProjectionRepository` | authorized query service、derived maintenance jobs | `InMemoryProjectionRepository` / future durable adapter | read model 反写 truth |
| `ExternalReferenceRepository` | manifestation service、snapshot refresh job | `InMemoryExternalReferenceRepository` / future durable adapter | source repo 直接写本仓 store |
| `ConversationOutboxRepository` | command services、outbox worker | `InMemoryConversationOutboxRepository` / future durable adapter | publisher 直接改 truth |
| `IdempotencyRepository` | command / consumer / job service | `InMemoryIdempotencyRepository` / future durable adapter | domain 直接判断 repository state |
| `ActorResolverPort` | participant / visibility / fact append flows | `ConfiguredActorResolverAdapter` | 直接依赖 identity crate |
| `ExternalFactResolverPort` | manifestation / snapshot / reference flows | `ConfiguredExternalFactResolverAdapter` | 直接依赖 work / governance / artifact / runtime / bridge crates |
| `ConversationOutboxPublisherPort` | outbox worker / publish job | `ConfiguredConversationOutboxPublisher` | command service 同步等待外部发布成功作为 truth 前置 |
| `TraceHandoffPort` | trace handoff job | `ConfiguredTraceHandoffAdapter` | observability 反写 Conversation truth |
| `ArchiveHandoffPort` | archive handoff job | `ConfiguredArchiveHandoffAdapter` | archive 反写 Conversation truth |
| `UnitOfWork` | write-like application services | `InMemoryUnitOfWork` / future durable transaction adapter | domain 开事务 |
| `ClockPort` | application services / jobs | `SystemClock` / test clock | domain 直接访问系统时间 |
| `IdGeneratorPort` | application services / factories | `UuidConversationIdGenerator` / test generator | domain 直接访问随机源 |

### 7.7 `infra` 模块 adapter 命名与职责

| adapter | 实现 trait | 文件位置 | 职责 |
|---|---|---|---|
| `InMemorySpaceScopeRepository` | `SpaceScopeRepository` | `crates/infra/src/repositories.rs` | P0 默认 space / scope 存储 |
| `InMemoryConversationFactRepository` | `ConversationFactRepository` | `crates/infra/src/repositories.rs` | P0 默认 fact / receipt 存储 |
| `InMemoryManifestationRepository` | `ManifestationRepository` | `crates/infra/src/repositories.rs` | P0 默认 manifestation 存储 |
| `InMemoryTraceRepository` | `TraceRepository` | `crates/infra/src/repositories.rs` | P0 默认 trace / review / handoff 存储 |
| `InMemoryProjectionRepository` | `ProjectionRepository` | `crates/infra/src/projection_stores.rs` | P0 默认 read model / cursor / projection 存储 |
| `InMemoryExternalReferenceRepository` | `ExternalReferenceRepository` | `crates/infra/src/snapshot_stores.rs` | P0 默认 snapshot / reference projection 存储 |
| `InMemoryConversationOutboxRepository` | `ConversationOutboxRepository` | `crates/infra/src/repositories.rs` | P0 默认 outbox 存储 |
| `InMemoryIdempotencyRepository` | `IdempotencyRepository` | `crates/infra/src/repositories.rs` | P0 默认幂等存储 |
| `ConfiguredActorResolverAdapter` | `ActorResolverPort` | `crates/infra/src/source_resolvers.rs` | identity actor resolver 适配 |
| `ConfiguredExternalFactResolverAdapter` | `ExternalFactResolverPort` | `crates/infra/src/source_resolvers.rs` | work / governance / artifact / runtime / bridge resolver 适配 |
| `ConfiguredConversationOutboxPublisher` | `ConversationOutboxPublisherPort` | `crates/infra/src/outbox_publisher.rs` | event collaboration publisher 适配 |
| `ConfiguredTraceHandoffAdapter` | `TraceHandoffPort` | `crates/infra/src/handoff_adapters.rs` | observability handoff 适配 |
| `ConfiguredArchiveHandoffAdapter` | `ArchiveHandoffPort` | `crates/infra/src/handoff_adapters.rs` | archive handoff 适配 |
| `InMemoryUnitOfWork` | `UnitOfWork` | `crates/infra/src/repositories.rs` | P0 默认事务边界 |
| `SystemClock` | `ClockPort` | `crates/infra/src/clock_id.rs` | 系统时间适配 |
| `UuidConversationIdGenerator` | `IdGeneratorPort` | `crates/infra/src/clock_id.rs` | ID / sequence 生成适配 |

### 7.8 禁止跨层调用表

| 禁止写法 | 原因 | 正确做法 |
|---|---|---|
| `domain` 调用 repository / resolver / publisher | domain 必须纯净,不感知 IO | application service 调用 trait 后把结果传给 domain |
| `application` new concrete infra adapter | 违反依赖方向 | runtime builder 注入 trait object / generic port |
| `api` 直接调用 repository | 绕过事务、幂等和 policy | api handler 调 application service |
| `worker` 直接发布 event 并改 outbox 状态 | 绕过 outbox 状态机和重试 | worker 调 outbox service |
| `jobs` 直接改 projection store | 绕过 derived policy 和 consistency | jobs 调 derived maintenance service |
| `ExternalFactResolverPort` 返回来源正文 | 会污染 Conversation truth | 只返回 ref、safe snapshot、digest、resolution marker |
| `TraceHandoffPort` / `ArchiveHandoffPort` 反写本仓 fact | 外部交接方不是 truth owner | 只返回 receipt / archive package ref |

---

## 8. 回填草稿

正式 `03-详细设计.md` §5 / §6 可引用本文件以下内容:

- §7.1 Trait / Port / Adapter 总览
- §7.2 模块间 trait 调用图
- §7.3 repository port 契约
- §7.4 technical port 契约
- §7.5 external resolver / publisher / handoff port 契约
- §7.6 实现方 / 调用方关系表
- §7.7 adapter 命名与职责
- §7.8 禁止跨层调用表

回填时应保留校准来源:

```text
本章主要引用 `design-calibration/03_ddd_step_07_trait_port_adapter_contracts.md`。
若需要查看完整 trait、port、adapter、实现方、调用方和禁止跨层调用规则,继续阅读该文件 §7.1~§7.8。
```

---

## 9. 待确认事项

| 待确认事项 | 方案 | 推荐 | 原因 |
|---|---|---|---|
| repository 是否继续拆成每个对象一个 trait | A. 全拆;B. 按聚合 / 边界拆 | 推荐 B | 保持函数清晰,避免 port 爆炸 |
| resolver 是否按来源仓拆多个 trait | A. `WorkResolverPort` 等全拆;B. 统一 `ExternalFactResolverPort` | 推荐 B | 当前 P0 只需要统一引用 / 快照边界,来源差异交给 adapter |
| technical ports 是否单独成 crate | A. 独立 crate;B. 留在 application | 推荐 B | 当前仅服务本仓 application,独立 crate 过早 |
| in-memory adapter 是否是正式 P0 默认实现 | A. 是;B. 只做测试 | 推荐 A | 便于先完成可运行闭环;durable store 由实施计划或后续 phase 承接 |

---

## 10. 进入下一步条件

```text
所有跨模块、跨层、跨外部系统的实现接缝都有明确 trait / port / adapter 契约。
每个 trait 函数都有参数类型、返回类型和错误类型。
实现者可以据此创建 application port 和 infra adapter 骨架。
可以进入 Step 8,定义 API / Command / Query / Event / Job 协议契约。
```
