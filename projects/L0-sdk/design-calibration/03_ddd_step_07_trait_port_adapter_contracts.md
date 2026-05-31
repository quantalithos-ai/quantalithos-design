# Step 7. 逐模块定义 Trait / Port / Adapter 契约

> 本文件是 `projects/L0-sdk/03-详细设计.md` 的 Step 7 中间产物。
> 本步只收稳跨模块、跨层、跨外部系统的 trait / port / adapter 契约。
> 本步不展开 Command / Query / Event / Job 完整协议 schema，不写逐接口函数级处理流，不写 DDL、配置项或测试方案。
> 正式 `03-详细设计.md` 仍在 Step 19 统一回填，本文件不替代正式详细设计。

## 1. Step 状态

- 状态：[x] 已确认
- 对应 SOP：`standards/document/详细设计讨论流程_SOP.md` Step 7
- 回填章节：`projects/L0-sdk/03-详细设计.md` §5 模块实现契约中的 Trait / Port / Adapter 契约 / §6 全局对象、Trait、API 索引

---

## 2. 本步输入

| 输入 | 内容 | 本步使用方式 |
|---|---|---|
| `03_ddd_step_04_units_file_layout.md` | 已确认 `crates/application/src/ports/`、`crates/infra/src/...`、`crates/client`、`crates/cli`、`crates/jobs` 和三语言 package 目录 | 作为 port trait、adapter、runtime builder 和 package surface 的落文件依据 |
| `03_ddd_step_05_module_contracts_axis.md` | 已确认 16 个实现职责模块和依赖方向 | 作为 trait 定义方、调用方和实现方归属依据 |
| `03_ddd_step_06_object_contracts.md` | 已确认 domain 对象、状态 enum、Rust client facade 对象和 application service 主语 | 作为 trait 方法参数、返回对象和错误类型来源 |
| `projects/L0-sdk/02-概要设计.md` §7.5 | 已列出 source、boundary、generator、runner、repository、projection 和 artifact 边界摘要 | 作为 port 名称和边界类型输入 |
| `projects/L0-sdk/01-架构设计.md` | 已确认 SDK 不拥有 core / bus / service truth，不做 auth / governance，不成为 server gateway | 约束 port 只能传引用、快照、结果和 evidence，不能复制外部 truth |
| `standards/document/详细设计书写规范.md` §5.5 / §5.6 | 要求 trait Rust 契约片段、参数类型、返回类型、错误类型、索引表 | 作为本步输出格式依据 |

已确认结论：

```text
Step 7 必须把 application 对外部依赖的访问都收敛为 application_ports 中的 trait。
infra_adapters 只能实现 port，不能被 domain 或 application 反向依赖。
Rust client facade、CLI 和 jobs 不能绕过 application service 直接调用 repository、source、runner 或 boundary adapter。
trait 函数必须写完整参数类型、返回类型和错误类型。
```

依赖的前序 Step：

```text
Step 1 已确认上游输入边界。
Step 2 已确认本轮 P0 实现范围和非范围。
Step 3 已确认编码、runtime、仓库、提交和安全边界约束。
Step 4 已确认 workspace 多 crate、三语言 package 目录和文件布局。
Step 5 已确认模块实现契约主轴和依赖方向。
Step 6 已确认对象实现契约、状态 enum 和 Rust client facade 对象。
```

---

## 3. SOP 问题回答

### 3.1 哪些模块需要定义 trait / port？

| 模块 | 是否定义 trait / port | 原因 |
|---|---|---|
| `contracts` | 否 | 只定义跨入口 DTO、View、Receipt、Error 和 Job payload，不定义行为 trait |
| `domain_semantic` | 否 | 只定义语义基线、能力模型和概念映射，不访问外部系统 |
| `domain_upstream_view` | 否 | 只定义派生视图和 freshness 状态，不直接读取 core / bus / formal API |
| `domain_service_client` | 否 | 只定义 service client view 和 capability ref，不直接调用 formal API 或 fake endpoint |
| `domain_event_client` | 否 | 只定义 event client view 和 semantic mapping，不调用 bus runtime |
| `domain_boundary_policy` | 否 | 只定义 policy / guard，不读取 credential store 或写审计 |
| `domain_package_candidate` | 否 | 只定义 candidate 和 artifact 状态，不执行构建 |
| `domain_evidence` | 否 | 只定义 evidence 和 redaction 状态，不运行 runner |
| `domain_compatibility_evolution` | 否 | 只定义 compatibility / deprecated / migration 对象，不写 ADR 或 public registry |
| `application_services` | 不定义底层 port，但调用 port | 编排 use case、事务、幂等、outbox、projection 和 evidence |
| `application_ports` | 是 | 统一定义 repository、source、boundary、generator、runner、artifact、projection、outbox、clock、id、unit of work trait |
| `infra_adapters` | 不定义业务 port，负责实现 port | 提供 in-memory / filesystem / local runner / fake boundary / formal boundary / bus boundary adapter |
| `rust_client_facade` | 不定义 port | 通过 runtime handle 调 application service，不直接依赖 infra trait |
| `language_package_surface` | 否 | Python / TypeScript 只承载 package surface，不拥有 SDK truth |
| `cli_entry` | 否 | CLI handler 只做输入转换和 runtime wiring，不直接调用 repository / runner |
| `jobs` | 否 | job binary 只调用 application service，不绕过 use case 改写真相 |

### 3.2 哪些模块负责实现这些 trait / port？

| trait / port 类别 | 定义模块 | 默认实现模块 | 说明 |
|---|---|---|---|
| technical port | `application_ports` | `infra_adapters` | 时间、ID、事务、幂等基础能力 |
| repository port | `application_ports` | `infra_adapters` | SDK 本地 truth、版本引用、candidate、evidence、compatibility 的读写边界 |
| projection port | `application_ports` | `infra_adapters` | capability、evidence、compatibility、docs example 只读视图 |
| source port | `application_ports` | `infra_adapters` | core / bus / formal API snapshot 来源 |
| boundary port | `application_ports` | `infra_adapters` | formal API、fake fixture、L0-bus event boundary |
| generator / runner port | `application_ports` | `infra_adapters` | language binding generator、package builder、smoke、docs、compatibility、boundary verifier |
| artifact / outbox port | `application_ports` | `infra_adapters` | package artifact 保存、outbox 事实输出和后续发布状态 |

### 3.3 repository、outbox、projection、external client 的函数签名是什么？

本步在 §7.3~§7.7 给出 Rust trait 契约片段和方法表。函数签名固定参数类型、返回类型和错误类型；完整 request / response JSON 或 proto 留给 Step 8。

### 3.4 每个 trait 函数的参数类型、返回类型、错误类型是什么？

统一写法如下：

```rust
/// <trait 作用说明>
pub trait ExamplePort {
    /// <函数作用说明>
    async fn run(&self, input: InputType) -> Result<OutputType, PortError>;
}
```

约束：

- 所有 I/O、repository、source、boundary、runner、artifact 和 outbox 方法必须返回 `Result<..., PortError>` 或更具体的 `RepositoryError` / `BoundaryError` / `RunnerError`。
- 写入类 repository 方法必须显式携带 `UnitOfWorkHandle`，必要时携带 `ExpectedVersion`。
- 只读 query / projection 方法不能携带 `UnitOfWorkHandle`，也不能触发 refresh、candidate 或 evidence 写入。
- external boundary 方法只能传 command / query / context / ref / redacted payload ref，不能传 raw secret 或生产 request / response body。

### 3.5 哪些依赖只能通过 trait 访问，不能直接跨层调用？

```text
rust_client_facade / cli_entry / jobs
  |
  v
application_services
  |
  v
application_ports
  |
  v
infra_adapters
  |
  +-- local store / future durable store
  +-- core / bus / formal API snapshot source
  +-- formal API / fake fixture / bus boundary
  +-- generator / builder / runner
  +-- artifact store / outbox publisher
```

关键说明：

- `application_services` 只依赖 trait，不依赖 concrete infra adapter。
- `domain_*` 不依赖 port、adapter、config、runtime builder、filesystem、network 或 runner。
- `rust_client_facade`、`cli_entry`、`jobs` 可以做 runtime wiring，但业务写入必须经过 application service。
- 任何 core / bus / formal API / fake / runner / artifact / public package 访问都必须通过 port。

---

## 4. 当前文档问题诊断

| 位置 | 当前问题 | 影响 | 本步处理 |
|---|---|---|---|
| 旧版 `03-详细设计.md` | 仍围绕 binding、wrapper、subscription、release manifest 的旧口径 | 无法支撑新版 semantic baseline、derived view、formal boundary、event client、candidate evidence 和 compatibility 主线 | 不沿用旧 port，按 Step 5/6 重新定义 |
| `02-概要设计.md` §7.5 | 只给出 port / repository / adapter 摘要，没有函数签名 | 实现者仍需猜参数、返回、错误和事务边界 | 本步补齐 trait 代码片段和方法表 |
| Step 6 `application_services` | 只登记 service 主语，未定义 service 依赖的 ports | Step 9 无法写函数级处理流 | 本步建立 service -> port dependency matrix |
| source 与 repository | 上游契约 source、SDK 本地 truth repository、projection 容易混淆 | 可能复制上游 truth 或让 projection 反写真相 | 本步拆成 source / repository / projection 三类 port |
| formal / fake boundary | formal API、fake fixture、service repo 源码容易混在一起 | SDK 可能滑向 server gateway 或伪造生产成功 | 本步拆出 `FormalApiBoundaryPort` 与 `FakeFixtureEndpointPort` |
| evidence 与 artifact | candidate artifact、runner result、evidence repository 边界不清 | verified / stable 结论可能缺证据链 | 本步拆出 runner、artifact store、evidence repository 和 projection |

---

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| port 表达 | 只有边界名 | 每个 port 有 trait 定义、函数签名、调用方、实现方和错误类型 | 支撑 1:1 实现 |
| repository 粒度 | Evidence / Candidate / VersionRef 等名称散列 | 按 SDK 本地 truth 聚合为 semantic、view、candidate、evidence、compatibility、version ref、idempotency | 避免按对象过度拆分，也不退化成 generic store |
| source 与 truth | source port 可能被误认为 repository | source 只读上游 snapshot；repository 只写 SDK 本地 truth | 防止复制 core / bus / service truth |
| boundary | formal / fake / bus boundary 只作为 adapter 名出现 | 分别定义 boundary trait，fake 必须显式返回 fake marker | 防止 fake success 被误写成生产成功 |
| runner | smoke / docs / compatibility 可能由 jobs 直接执行 | runner 全部通过 application port 编排 | job 不能绕过 evidence 记录和事务边界 |
| projection | projection 只在概要中出现 | 定义只读 projection port，禁止反写真相 | 支撑 query 和 rebuild flow |
| Rust client facade | 可能直接持有 adapter | 只能通过 runtime handle 调 application service | 避免 client facade 变成 infra 容器 |

---

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A：只列 port 名称，不写方法 | 文档短 | 实现者仍需自行补设函数和错误类型 | 不采用 |
| 方案 B：每个底层能力独立 trait，application service 使用组合依赖 | 边界清晰，便于 mock、fake、local store 和后续 durable adapter 替换 | trait 数量较多 | 采用 |
| 方案 C：application 直接依赖 infra adapter | 起步快 | 破坏依赖方向，无法稳定测试 | 不采用 |
| 方案 D：一个 `SdkStorePort` 覆盖全部 repository / projection / artifact | port 数量少 | 隐藏业务语义，难以表达乐观锁、只读 projection 和 artifact digest | 不采用 |
| 方案 E：Python / TypeScript package 也定义自己的 port | 三语言实现自由 | 会形成三套 truth 和三套边界语义 | 不采用 |

推荐方案：方案 B。

原因：

- SDK 的主要风险不是端口数量，而是三语言 drift、fake success、上游 truth 复制和 candidate evidence 不闭环。
- 独立 trait 能让 Step 9 的函数流清楚表达调用顺序，也能让 Step 16 的测试切口直接 mock port。
- `infra_adapters` 可以先提供 in-memory / filesystem / local runner 默认实现，后续再替换为 durable store 或真实边界。

---

## 7. 结构化中间产物

> 本节按 port 类别分批展开。所有 trait 默认定义在 `crates/application/src/ports/`，默认实现由 `crates/infra/src/...` 提供。

### 7.1 Trait / Port / Adapter 总览

| 名称 | 类型 | 定义位置 | 默认实现位置 | 作用 | 关键函数 |
|---|---|---|---|---|---|
| `UnitOfWork` | technical port | `crates/application/src/ports/unit_of_work.rs` | `crates/infra/src/uow/memory_unit_of_work.rs` | 管理写路径事务边界 | `begin` / `commit` / `rollback` |
| `ClockPort` | technical port | `crates/application/src/ports/clock.rs` | `crates/infra/src/time/system_clock.rs` | 提供可替换时间来源 | `now` |
| `IdGeneratorPort` | technical port | `crates/application/src/ports/id_generator.rs` | `crates/infra/src/id/uuid_generator.rs` | 生成 SDK 本地 ID | `next_baseline_id` / `next_candidate_id` / `next_evidence_id` |
| `SdkIdempotencyRepository` | repository port | `crates/application/src/ports/idempotency_repository.rs` | `crates/infra/src/repositories/idempotency_memory.rs` | 保存 command / consumer / job 幂等锚点 | `find` / `reserve` / `complete` / `mark_conflict` |
| `SemanticBaselineRepository` | repository port | `crates/application/src/ports/semantic_baseline_repository.rs` | `crates/infra/src/repositories/semantic_baseline_memory.rs` | 保存共同语义基线 | `get_current` / `get_for_update` / `save` |
| `DerivedViewRepository` | repository port | `crates/application/src/ports/derived_view_repository.rs` | `crates/infra/src/repositories/derived_view_memory.rs` | 保存派生 binding view、language view 和 freshness | `get_binding_view` / `save_binding_view` / `mark_stale_by_upstream` |
| `ServiceClientViewRepository` | repository port | `crates/application/src/ports/service_client_view_repository.rs` | `crates/infra/src/repositories/service_client_view_memory.rs` | 保存 service client view | `get_current` / `save` |
| `EventClientViewRepository` | repository port | `crates/application/src/ports/event_client_view_repository.rs` | `crates/infra/src/repositories/event_client_view_memory.rs` | 保存 bus event client view | `get_current` / `save` |
| `CandidateRepository` | repository port | `crates/application/src/ports/candidate_repository.rs` | `crates/infra/src/repositories/candidate_memory.rs` | 保存 package candidate | `insert` / `get` / `get_for_update` / `save` |
| `EvidenceRepository` | repository port | `crates/application/src/ports/evidence_repository.rs` | `crates/infra/src/repositories/evidence_memory.rs` | 保存 verification evidence | `insert` / `list_by_candidate` / `get` |
| `CompatibilityRepository` | repository port | `crates/application/src/ports/compatibility_repository.rs` | `crates/infra/src/repositories/compatibility_memory.rs` | 保存 compatibility decision、deprecated record 和 migration ref | `save_decision` / `save_deprecated_api` / `get_deprecated_api` |
| `VersionRefRepository` | repository port | `crates/application/src/ports/version_ref_repository.rs` | `crates/infra/src/repositories/version_ref_memory.rs` | 保存 core / bus / formal API 版本引用 | `upsert_upstream_ref` / `list_current` / `get_by_source` |
| `SdkCapabilityProjectionPort` | projection port | `crates/application/src/ports/capability_projection.rs` | `crates/infra/src/projections/capability_memory.rs` | 维护 SDK capability 只读视图 | `upsert_summary` / `get_summary` / `rebuild_from_truth` |
| `EvidenceProjectionPort` | projection port | `crates/application/src/ports/evidence_projection.rs` | `crates/infra/src/projections/evidence_memory.rs` | 维护 evidence 只读视图 | `upsert_evidence_view` / `list_evidence` |
| `CompatibilityProjectionPort` | projection port | `crates/application/src/ports/compatibility_projection.rs` | `crates/infra/src/projections/compatibility_memory.rs` | 维护 compatibility 只读视图 | `upsert_compatibility_view` / `get_compatibility` |
| `DocsExampleProjectionPort` | projection port | `crates/application/src/ports/docs_example_projection.rs` | `crates/infra/src/projections/docs_example_memory.rs` | 维护 docs example 验证视图 | `replace_examples` / `list_examples` |
| `CoreContractSourcePort` | source port | `crates/application/src/ports/core_contract_source.rs` | `crates/infra/src/sources/core_contract_local.rs` | 读取 `L0-core` 契约 snapshot | `fetch_snapshot` / `latest_version` |
| `BusSemanticSourcePort` | source port | `crates/application/src/ports/bus_semantic_source.rs` | `crates/infra/src/sources/bus_semantic_local.rs` | 读取 `L0-bus` 语义 snapshot | `fetch_snapshot` / `latest_version` |
| `FormalApiSourcePort` | source port | `crates/application/src/ports/formal_api_source.rs` | `crates/infra/src/sources/formal_api_local.rs` | 读取 formal API snapshot | `fetch_snapshot` / `latest_version` |
| `FormalApiBoundaryPort` | boundary port | `crates/application/src/ports/formal_api_boundary.rs` | `crates/infra/src/boundaries/formal_api_http.rs` | 调用正式服务能力边界 | `call_service` / `read_service` / `check_capability` |
| `FakeFixtureEndpointPort` | boundary port | `crates/application/src/ports/fake_fixture_endpoint.rs` | `crates/infra/src/boundaries/fake_fixture.rs` | 调用 fake / fixture 验证目标 | `call_fake` / `read_fake` / `assert_fake_marker` |
| `BusEventBoundaryPort` | boundary port | `crates/application/src/ports/bus_event_boundary.rs` | `crates/infra/src/boundaries/bus_event.rs` | 发布或订阅 bus event client 边界 | `publish_event` / `open_subscription` |
| `LanguageBindingGeneratorPort` | runner port | `crates/application/src/ports/language_binding_generator.rs` | `crates/infra/src/generators/language_binding_local.rs` | 生成语言 binding surface | `generate` |
| `PackageBuilderPort` | runner port | `crates/application/src/ports/package_builder.rs` | `crates/infra/src/builders/package_builder_local.rs` | 构建 Rust / Python / TypeScript package artifact | `build_candidate` |
| `SmokeRunnerPort` | runner port | `crates/application/src/ports/smoke_runner.rs` | `crates/infra/src/runners/smoke_runner_local.rs` | 运行三语言 smoke | `run_cross_language_smoke` |
| `DocsExampleRunnerPort` | runner port | `crates/application/src/ports/docs_example_runner.rs` | `crates/infra/src/runners/docs_example_runner_local.rs` | 运行 docs / examples 验证 | `run_examples` |
| `CompatibilityRunnerPort` | runner port | `crates/application/src/ports/compatibility_runner.rs` | `crates/infra/src/runners/compatibility_runner_local.rs` | 执行兼容检查 | `check_compatibility` |
| `BoundaryPolicyVerifierPort` | runner port | `crates/application/src/ports/boundary_policy_verifier.rs` | `crates/infra/src/runners/boundary_policy_verifier.rs` | 验证 redaction / credential / fake boundary 底线 | `verify` |
| `PackageArtifactStorePort` | artifact port | `crates/application/src/ports/package_artifact_store.rs` | `crates/infra/src/artifacts/package_artifact_store.rs` | 保存 package artifact 引用和 digest | `put_artifact` / `get_artifact` / `verify_digest` |
| `SdkOutboxPort` | outbox port | `crates/application/src/ports/sdk_outbox.rs` | `crates/infra/src/outbox/sdk_outbox_memory.rs` | 保存本仓已提交事实并驱动后续发布 | `append` / `load_pending` / `mark_published` |

### 7.2 模块间 trait 调用图

#### 模块依赖图：L0-sdk Port 定义方、调用方与实现方

```text
[rust_client_facade] -- call --> [application_services]
[cli_entry]          -- call --> [application_services]
[jobs]               -- call --> [application_services]

[application_services] -- call trait --> [application_ports]
[infra_adapters]       -- impl trait --> [application_ports]

[infra_adapters] -- read --> [L0-core contracts / snapshots]
[infra_adapters] -- read --> [L0-bus contracts / snapshots]
[infra_adapters] -- call --> [formal API boundary]
[infra_adapters] -- call --> [fake / fixture boundary]
[infra_adapters] -- call --> [local runner / builder]
[infra_adapters] -- write --> [artifact store / outbox / projections]

[domain_*] -- no direct dependency --> [application_ports]
[application_services] -- no direct dependency --> [infra_adapters]
[language_package_surface] -- no truth ownership --> [domain_*]
```

关键说明：

- `application_ports` 是 trait 定义层，不是 infra 实现层。
- `infra_adapters` 可以依赖 `application_ports` 来实现 trait，但 `application_services` 不得依赖具体 adapter 类型。
- `rust_client_facade`、`cli_entry`、`jobs` 只能调用 application service；它们不直接持有 repository、runner 或 boundary adapter。
- `language_package_surface` 的实现受 candidate artifact 和 evidence 约束，不拥有 domain truth。

### 7.3 统一 Trait / Adapter 写法

#### 7.3.1 Trait 契约固定写法

后续每个 trait 必须按以下结构展开：

````md
#### `<TraitName>`

##### Trait 定义

```rust
/// <trait 作用说明>
pub trait TraitName {
    /// <函数作用说明>
    async fn method_name(
        &self,
        input: InputType,
    ) -> Result<OutputType, PortError>;
}
```

##### 方法表

| 函数签名 | 作用 | 参数说明 | 返回 | 错误类型 |
|---|---|---|---|---|

##### 调用方 / 实现方

| 角色 | 模块 / 对象 | 说明 |
|---|---|---|

##### 不变量与禁止事项

- <约束>
````

写法要求：

- trait 代码块必须使用 `rust`。
- trait 和公开函数必须写 Rustdoc 风格中文注释。
- 函数签名必须包含参数类型、返回类型和错误类型。
- repository 方法必须显式表达 `UnitOfWorkHandle`、`ExpectedVersion` 或只读查询条件。
- external port 方法必须表达“只传引用 / 只返回结果”，不得隐式复制外部正文。
- 异步 I/O port 使用 `async fn`；纯支撑 port 如 `ClockPort`、`IdGeneratorPort` 可使用同步函数。

#### 7.3.2 Adapter 契约固定写法

adapter 不写内部实现，只写实现方映射和 wiring 边界。

| Adapter | 实现 trait | 所属文件 | P0 默认 | 禁止事项 |
|---|---|---|---|---|
| `<AdapterName>` | `<TraitName>` | `<path>` | `<in-memory / filesystem / local runner / fake>` | `<不能做什么>` |

统一约束：

- adapter 内部可以访问 filesystem、local runner、HTTP client 或 test fixture，但必须把结果映射成 application port 返回类型。
- adapter 不得直接修改 domain object 状态；状态迁移必须由 application service 调 domain 对象完成。
- adapter 不得保存 raw secret、生产 request body、生产 response body 或 payload body。
- adapter 不得把 fake / fixture 成功映射成 production success。

### 7.4 基础支撑 port 契约

#### 7.4.1 `UnitOfWork`

##### Trait 定义

```rust
/// SDK 写路径事务边界端口。
///
/// Application service 使用该端口开启、提交或回滚一次 SDK 本地 truth 写入边界。
pub trait UnitOfWork {
    /// 开启一个新的写事务边界。
    async fn begin(&self) -> Result<UnitOfWorkHandle, TransactionError>;

    /// 提交当前写事务边界。
    async fn commit(&self, handle: UnitOfWorkHandle) -> Result<(), TransactionError>;

    /// 回滚当前写事务边界。
    async fn rollback(&self, handle: UnitOfWorkHandle) -> Result<(), TransactionError>;
}
```

##### 方法表

| 函数签名 | 作用 | 参数说明 | 返回 | 错误类型 |
|---|---|---|---|---|
| `begin(&self) -> Result<UnitOfWorkHandle, TransactionError>` | 开启写事务 | 无 | `UnitOfWorkHandle` | `TransactionError` |
| `commit(&self, handle: UnitOfWorkHandle) -> Result<(), TransactionError>` | 提交写事务 | `handle` 是当前事务句柄 | `()` | `TransactionError` |
| `rollback(&self, handle: UnitOfWorkHandle) -> Result<(), TransactionError>` | 回滚写事务 | `handle` 是当前事务句柄 | `()` | `TransactionError` |

##### 调用方 / 实现方

| 角色 | 模块 / 对象 | 说明 |
|---|---|---|
| 调用方 | `application_services` | command、consumer、job 写路径 |
| 实现方 | `infra_adapters` | in-memory 或后续 durable transaction adapter |

##### 不变量与禁止事项

- query service 不得开启写事务。
- repository 写方法必须接收 `UnitOfWorkHandle`，不能自行开启隐式事务。
- `rollback` 失败不得被静默吞掉，必须进入错误与审计处理。

#### 7.4.2 `ClockPort`

##### Trait 定义

```rust
/// SDK 时间来源端口。
///
/// 用于写入审计时间、状态推进时间、evidence 时间和 job 时间戳。
pub trait ClockPort {
    /// 返回当前平台时间。
    fn now(&self) -> Timestamp;
}
```

##### 方法表

| 函数签名 | 作用 | 参数说明 | 返回 | 错误类型 |
|---|---|---|---|---|
| `now(&self) -> Timestamp` | 返回当前时间 | 无 | `Timestamp` | 不适用 |

##### 调用方 / 实现方

| 角色 | 模块 / 对象 | 说明 |
|---|---|---|
| 调用方 | `application_services`、`jobs` | 状态推进、evidence、compatibility、outbox |
| 实现方 | `infra_adapters` | `SystemClock`、test fixed clock |

##### 不变量与禁止事项

- domain 对象不得直接调用系统时间。
- 测试必须能替换为 fixed clock。

#### 7.4.3 `IdGeneratorPort`

##### Trait 定义

```rust
/// SDK 本地 ID 生成端口。
///
/// 用于生成语义基线、candidate、evidence、compatibility decision 和 outbox event ID。
pub trait IdGeneratorPort {
    /// 生成语义基线 ID。
    fn next_baseline_id(&self) -> SdkBaselineId;

    /// 生成 package candidate ID。
    fn next_candidate_id(&self) -> PackageCandidateId;

    /// 生成 verification evidence ID。
    fn next_evidence_id(&self) -> EvidenceId;

    /// 生成 compatibility decision ID。
    fn next_compatibility_decision_id(&self) -> CompatibilityDecisionId;

    /// 生成 SDK outbox event ID。
    fn next_outbox_event_id(&self) -> SdkOutboxEventId;
}
```

##### 方法表

| 函数签名 | 作用 | 参数说明 | 返回 | 错误类型 |
|---|---|---|---|---|
| `next_baseline_id(&self) -> SdkBaselineId` | 生成 semantic baseline ID | 无 | `SdkBaselineId` | 不适用 |
| `next_candidate_id(&self) -> PackageCandidateId` | 生成 candidate ID | 无 | `PackageCandidateId` | 不适用 |
| `next_evidence_id(&self) -> EvidenceId` | 生成 evidence ID | 无 | `EvidenceId` | 不适用 |
| `next_compatibility_decision_id(&self) -> CompatibilityDecisionId` | 生成 compatibility decision ID | 无 | `CompatibilityDecisionId` | 不适用 |
| `next_outbox_event_id(&self) -> SdkOutboxEventId` | 生成 outbox event ID | 无 | `SdkOutboxEventId` | 不适用 |

##### 调用方 / 实现方

| 角色 | 模块 / 对象 | 说明 |
|---|---|---|
| 调用方 | `application_services` | 创建本地 truth、evidence 和 event |
| 实现方 | `infra_adapters` | UUID / deterministic test generator |

##### 不变量与禁止事项

- ID 生成不得依赖业务字段拼接。
- 测试必须能使用 deterministic generator。

### 7.5 Repository port 契约

Repository port 只负责 SDK 本地 truth 的保存和读取。上游 core / bus / formal API 的内容只能通过 source port 读取；query read model 只能通过 projection port 读取。

#### 7.5.1 `SdkIdempotencyRepository`

##### Trait 定义

```rust
/// SDK 幂等锚点仓储端口。
///
/// 用于 command、consumer 和 job 入口在进入写路径前判断是否重复提交。
pub trait SdkIdempotencyRepository {
    /// 查找已有幂等记录。
    async fn find(
        &self,
        key: IdempotencyKey,
    ) -> Result<Option<IdempotencyRecord>, RepositoryError>;

    /// 在写事务中占用一个幂等 key。
    async fn reserve(
        &self,
        key: IdempotencyKey,
        command_digest: CommandDigest,
        uow: UnitOfWorkHandle,
    ) -> Result<IdempotencyReservation, RepositoryError>;

    /// 标记幂等请求已完成。
    async fn complete(
        &self,
        key: IdempotencyKey,
        receipt_ref: CommandReceiptRef,
        uow: UnitOfWorkHandle,
    ) -> Result<(), RepositoryError>;

    /// 标记相同 key 对应不同 command digest 的冲突。
    async fn mark_conflict(
        &self,
        key: IdempotencyKey,
        observed_digest: CommandDigest,
        uow: UnitOfWorkHandle,
    ) -> Result<(), RepositoryError>;
}
```

##### 方法表

| 函数签名 | 作用 | 参数说明 | 返回 | 错误类型 |
|---|---|---|---|---|
| `find(key: IdempotencyKey)` | 查询幂等记录 | `key` 是入口幂等键 | `Option<IdempotencyRecord>` | `RepositoryError` |
| `reserve(key: IdempotencyKey, command_digest: CommandDigest, uow: UnitOfWorkHandle)` | 占用幂等键 | `command_digest` 是规范化后的输入摘要 | `IdempotencyReservation` | `RepositoryError` |
| `complete(key: IdempotencyKey, receipt_ref: CommandReceiptRef, uow: UnitOfWorkHandle)` | 标记完成 | `receipt_ref` 指向命令回执 | `()` | `RepositoryError` |
| `mark_conflict(key: IdempotencyKey, observed_digest: CommandDigest, uow: UnitOfWorkHandle)` | 标记冲突 | `observed_digest` 是本次请求摘要 | `()` | `RepositoryError` |

##### 调用方 / 实现方

| 角色 | 模块 / 对象 | 说明 |
|---|---|---|
| 调用方 | 所有 command / consumer / job application service | 进入写路径前先检查幂等 |
| 实现方 | `infra_adapters` | in-memory，后续 durable store |

##### 不变量与禁止事项

- 相同 `IdempotencyKey` + 相同 `CommandDigest` 必须返回同一业务结果或回执引用。
- 相同 `IdempotencyKey` + 不同 `CommandDigest` 必须进入 conflict，不能覆盖旧结果。

#### 7.5.2 Semantic 和派生视图 repository

##### Trait 定义

```rust
/// SDK 共同语义基线仓储端口。
pub trait SemanticBaselineRepository {
    /// 读取当前语义基线。
    async fn get_current(&self) -> Result<Option<SdkSemanticBaseline>, RepositoryError>;

    /// 在写事务中读取并锁定当前语义基线。
    async fn get_for_update(
        &self,
        uow: UnitOfWorkHandle,
    ) -> Result<Option<SdkSemanticBaseline>, RepositoryError>;

    /// 保存语义基线并检查期望版本。
    async fn save(
        &self,
        baseline: SdkSemanticBaseline,
        expected_version: ExpectedVersion,
        uow: UnitOfWorkHandle,
    ) -> Result<Version, RepositoryError>;
}

/// SDK 派生视图仓储端口。
pub trait DerivedViewRepository {
    /// 读取派生 binding view。
    async fn get_binding_view(
        &self,
        view_id: DerivedViewId,
    ) -> Result<Option<DerivedBindingView>, RepositoryError>;

    /// 保存派生 binding view。
    async fn save_binding_view(
        &self,
        view: DerivedBindingView,
        expected_version: ExpectedVersion,
        uow: UnitOfWorkHandle,
    ) -> Result<Version, RepositoryError>;

    /// 读取某个语言的 language view。
    async fn get_language_view(
        &self,
        language_id: LanguageId,
    ) -> Result<Option<LanguageBindingView>, RepositoryError>;

    /// 保存某个语言的 language view。
    async fn save_language_view(
        &self,
        view: LanguageBindingView,
        expected_version: ExpectedVersion,
        uow: UnitOfWorkHandle,
    ) -> Result<Version, RepositoryError>;

    /// 按上游版本引用标记相关视图 stale。
    async fn mark_stale_by_upstream(
        &self,
        upstream_ref: UpstreamVersionRef,
        uow: UnitOfWorkHandle,
    ) -> Result<StaleMarkResult, RepositoryError>;
}
```

##### 方法表

| Trait | 函数签名 | 作用 | 参数说明 | 返回 | 错误类型 |
|---|---|---|---|---|---|
| `SemanticBaselineRepository` | `get_current()` | 读取当前语义基线 | 无 | `Option<SdkSemanticBaseline>` | `RepositoryError` |
| `SemanticBaselineRepository` | `get_for_update(uow: UnitOfWorkHandle)` | 写事务中读取并锁定 | `uow` 是事务句柄 | `Option<SdkSemanticBaseline>` | `RepositoryError` |
| `SemanticBaselineRepository` | `save(baseline: SdkSemanticBaseline, expected_version: ExpectedVersion, uow: UnitOfWorkHandle)` | 保存语义基线 | `expected_version` 是乐观锁版本 | `Version` | `RepositoryError` |
| `DerivedViewRepository` | `get_binding_view(view_id: DerivedViewId)` | 读取派生视图 | `view_id` 是 view ID | `Option<DerivedBindingView>` | `RepositoryError` |
| `DerivedViewRepository` | `save_binding_view(view: DerivedBindingView, expected_version: ExpectedVersion, uow: UnitOfWorkHandle)` | 保存派生视图 | `view` 是领域视图对象 | `Version` | `RepositoryError` |
| `DerivedViewRepository` | `get_language_view(language_id: LanguageId)` | 读取语言视图 | `language_id` 是语言 ID | `Option<LanguageBindingView>` | `RepositoryError` |
| `DerivedViewRepository` | `save_language_view(view: LanguageBindingView, expected_version: ExpectedVersion, uow: UnitOfWorkHandle)` | 保存语言视图 | `view` 是语言视图对象 | `Version` | `RepositoryError` |
| `DerivedViewRepository` | `mark_stale_by_upstream(upstream_ref: UpstreamVersionRef, uow: UnitOfWorkHandle)` | 标记受影响视图 stale | `upstream_ref` 是上游版本引用 | `StaleMarkResult` | `RepositoryError` |

##### 调用方 / 实现方

| 角色 | 模块 / 对象 | 说明 |
|---|---|---|
| 调用方 | `SdkSemanticBaselineService`、`ContractConsumptionService`、`QueryService` | 更新语义、刷新派生视图和查询视图 |
| 实现方 | `infra_adapters` | in-memory，后续 durable repository |

##### 不变量与禁止事项

- repository 保存的是 SDK 派生视图，不复制 core / bus / formal API 正文。
- `mark_stale_by_upstream` 只影响 SDK 本地 freshness，不修改上游版本本身。

#### 7.5.3 Client view repository

##### Trait 定义

```rust
/// 服务能力 client view 仓储端口。
pub trait ServiceClientViewRepository {
    /// 读取当前 service client view。
    async fn get_current(&self) -> Result<Option<ServiceClientView>, RepositoryError>;

    /// 保存 service client view。
    async fn save(
        &self,
        view: ServiceClientView,
        expected_version: ExpectedVersion,
        uow: UnitOfWorkHandle,
    ) -> Result<Version, RepositoryError>;
}

/// Bus event client view 仓储端口。
pub trait EventClientViewRepository {
    /// 读取当前 event client view。
    async fn get_current(&self) -> Result<Option<BusEventClientView>, RepositoryError>;

    /// 保存 event client view。
    async fn save(
        &self,
        view: BusEventClientView,
        expected_version: ExpectedVersion,
        uow: UnitOfWorkHandle,
    ) -> Result<Version, RepositoryError>;
}
```

##### 方法表

| Trait | 函数签名 | 作用 | 参数说明 | 返回 | 错误类型 |
|---|---|---|---|---|---|
| `ServiceClientViewRepository` | `get_current()` | 读取 service client view | 无 | `Option<ServiceClientView>` | `RepositoryError` |
| `ServiceClientViewRepository` | `save(view: ServiceClientView, expected_version: ExpectedVersion, uow: UnitOfWorkHandle)` | 保存 service client view | `view` 是领域视图对象 | `Version` | `RepositoryError` |
| `EventClientViewRepository` | `get_current()` | 读取 event client view | 无 | `Option<BusEventClientView>` | `RepositoryError` |
| `EventClientViewRepository` | `save(view: BusEventClientView, expected_version: ExpectedVersion, uow: UnitOfWorkHandle)` | 保存 event client view | `view` 是领域视图对象 | `Version` | `RepositoryError` |

##### 调用方 / 实现方

| 角色 | 模块 / 对象 | 说明 |
|---|---|---|
| 调用方 | `ServiceClientAssemblyService`、`EventClientAssemblyService`、`QueryService` | 组装和读取 client view |
| 实现方 | `infra_adapters` | in-memory，后续 durable repository |

##### 不变量与禁止事项

- `ServiceClientViewRepository` 不保存服务端业务 truth。
- `EventClientViewRepository` 不保存 bus delivery / retry / replay truth。

#### 7.5.4 Candidate、Evidence、Compatibility 和 Version repository

##### Trait 定义

```rust
/// Package candidate 仓储端口。
pub trait CandidateRepository {
    /// 插入新的 package candidate。
    async fn insert(
        &self,
        candidate: PackageCandidate,
        uow: UnitOfWorkHandle,
    ) -> Result<Version, RepositoryError>;

    /// 读取 package candidate。
    async fn get(
        &self,
        candidate_id: PackageCandidateId,
    ) -> Result<Option<PackageCandidate>, RepositoryError>;

    /// 写事务中读取并锁定 package candidate。
    async fn get_for_update(
        &self,
        candidate_id: PackageCandidateId,
        uow: UnitOfWorkHandle,
    ) -> Result<Option<PackageCandidate>, RepositoryError>;

    /// 保存 package candidate。
    async fn save(
        &self,
        candidate: PackageCandidate,
        expected_version: ExpectedVersion,
        uow: UnitOfWorkHandle,
    ) -> Result<Version, RepositoryError>;
}

/// Verification evidence 仓储端口。
pub trait EvidenceRepository {
    /// 插入验证证据。
    async fn insert(
        &self,
        evidence: VerificationEvidence,
        uow: UnitOfWorkHandle,
    ) -> Result<Version, RepositoryError>;

    /// 按 candidate 列出验证证据。
    async fn list_by_candidate(
        &self,
        candidate_id: PackageCandidateId,
    ) -> Result<Vec<VerificationEvidence>, RepositoryError>;

    /// 读取单条验证证据。
    async fn get(
        &self,
        evidence_id: EvidenceId,
    ) -> Result<Option<VerificationEvidence>, RepositoryError>;
}

/// Compatibility 与 deprecated 仓储端口。
pub trait CompatibilityRepository {
    /// 保存兼容判断。
    async fn save_decision(
        &self,
        decision: CompatibilityDecision,
        uow: UnitOfWorkHandle,
    ) -> Result<Version, RepositoryError>;

    /// 读取兼容判断。
    async fn get_decision(
        &self,
        decision_id: CompatibilityDecisionId,
    ) -> Result<Option<CompatibilityDecision>, RepositoryError>;

    /// 保存 deprecated API 记录。
    async fn save_deprecated_api(
        &self,
        record: DeprecatedApiRecord,
        expected_version: ExpectedVersion,
        uow: UnitOfWorkHandle,
    ) -> Result<Version, RepositoryError>;

    /// 读取 deprecated API 记录。
    async fn get_deprecated_api(
        &self,
        api_ref: SdkApiRef,
    ) -> Result<Option<DeprecatedApiRecord>, RepositoryError>;
}

/// 上游版本引用仓储端口。
pub trait VersionRefRepository {
    /// 写入或更新上游版本引用。
    async fn upsert_upstream_ref(
        &self,
        upstream_ref: UpstreamVersionRef,
        uow: UnitOfWorkHandle,
    ) -> Result<Version, RepositoryError>;

    /// 列出当前上游版本引用。
    async fn list_current(&self) -> Result<Vec<UpstreamVersionRef>, RepositoryError>;

    /// 按来源读取上游版本引用。
    async fn get_by_source(
        &self,
        source: UpstreamSourceKind,
    ) -> Result<Option<UpstreamVersionRef>, RepositoryError>;
}
```

##### 方法表

| Trait | 函数族 | 作用 | 错误类型 |
|---|---|---|---|
| `CandidateRepository` | `insert` / `get` / `get_for_update` / `save` | 保存和读取 package candidate，并支持乐观锁 | `RepositoryError` |
| `EvidenceRepository` | `insert` / `list_by_candidate` / `get` | 保存和读取 verification evidence | `RepositoryError` |
| `CompatibilityRepository` | `save_decision` / `get_decision` / `save_deprecated_api` / `get_deprecated_api` | 保存 compatibility 和 deprecated API 记录 | `RepositoryError` |
| `VersionRefRepository` | `upsert_upstream_ref` / `list_current` / `get_by_source` | 保存 core / bus / formal API 版本引用 | `RepositoryError` |

##### 调用方 / 实现方

| 角色 | 模块 / 对象 | 说明 |
|---|---|---|
| 调用方 | `PackageCandidateService`、`CandidateValidationService`、`CompatibilityGovernanceService`、`QueryService`、`jobs` | candidate、evidence、compatibility、版本引用主线 |
| 实现方 | `infra_adapters` | in-memory，后续 durable repository |

##### 不变量与禁止事项

- `EvidenceRepository` 不保存 raw request / response / secret / payload body，只保存引用、摘要和 redaction 状态。
- `CompatibilityRepository` 不替代 ADR、需求或验收，只保存 SDK compatibility decision。
- `VersionRefRepository` 不复制上游正文，只保存版本、snapshot、digest 或 ref。

### 7.6 Projection、Source 与 Boundary port 契约

#### 7.6.1 Projection port

Projection port 只维护 read model。它可以由 truth repository 重建，但不得反向修改 truth repository。

##### Trait 定义

```rust
/// SDK capability 只读投影端口。
pub trait SdkCapabilityProjectionPort {
    /// 更新 SDK capability summary。
    async fn upsert_summary(
        &self,
        summary: SdkCapabilitySummaryView,
        uow: UnitOfWorkHandle,
    ) -> Result<(), ProjectionError>;

    /// 读取 SDK capability summary。
    async fn get_summary(
        &self,
        query: GetSdkCapabilitySummaryQuery,
    ) -> Result<SdkCapabilitySummaryView, ProjectionError>;

    /// 从 truth 快照重建 capability 投影。
    async fn rebuild_from_truth(
        &self,
        input: CapabilityProjectionRebuildInput,
        uow: UnitOfWorkHandle,
    ) -> Result<ProjectionRebuildResult, ProjectionError>;
}

/// Verification evidence 只读投影端口。
pub trait EvidenceProjectionPort {
    /// 更新 evidence view。
    async fn upsert_evidence_view(
        &self,
        view: EvidenceView,
        uow: UnitOfWorkHandle,
    ) -> Result<(), ProjectionError>;

    /// 按查询条件列出 evidence view。
    async fn list_evidence(
        &self,
        query: ListEvidenceQuery,
    ) -> Result<EvidenceViewPage, ProjectionError>;
}

/// Compatibility 只读投影端口。
pub trait CompatibilityProjectionPort {
    /// 更新 compatibility view。
    async fn upsert_compatibility_view(
        &self,
        view: CompatibilityView,
        uow: UnitOfWorkHandle,
    ) -> Result<(), ProjectionError>;

    /// 读取 compatibility view。
    async fn get_compatibility(
        &self,
        query: GetCompatibilityQuery,
    ) -> Result<CompatibilityView, ProjectionError>;
}

/// Docs example 验证只读投影端口。
pub trait DocsExampleProjectionPort {
    /// 替换 docs example 验证视图集合。
    async fn replace_examples(
        &self,
        examples: Vec<DocsExampleView>,
        uow: UnitOfWorkHandle,
    ) -> Result<(), ProjectionError>;

    /// 列出 docs example 验证视图。
    async fn list_examples(
        &self,
        query: ListDocsExampleQuery,
    ) -> Result<DocsExampleViewPage, ProjectionError>;
}
```

##### 方法表

| Trait | 函数族 | 作用 | 错误类型 |
|---|---|---|---|
| `SdkCapabilityProjectionPort` | `upsert_summary` / `get_summary` / `rebuild_from_truth` | 维护 capability summary read model | `ProjectionError` |
| `EvidenceProjectionPort` | `upsert_evidence_view` / `list_evidence` | 维护 evidence read model | `ProjectionError` |
| `CompatibilityProjectionPort` | `upsert_compatibility_view` / `get_compatibility` | 维护 compatibility read model | `ProjectionError` |
| `DocsExampleProjectionPort` | `replace_examples` / `list_examples` | 维护 docs example verification read model | `ProjectionError` |

##### 调用方 / 实现方

| 角色 | 模块 / 对象 | 说明 |
|---|---|---|
| 调用方 | `QueryService`、`RebuildSdkProjections` job、写路径 application service | 查询、重建和写后投影更新 |
| 实现方 | `infra_adapters` | in-memory / file index / future durable projection |

##### 不变量与禁止事项

- query 方法不得改写 truth。
- rebuild 方法只重建 projection，不改变 semantic baseline、candidate、evidence 或 compatibility truth。

#### 7.6.2 Source port

Source port 负责读取上游 snapshot 或版本引用。它只能返回 snapshot / ref / digest，不拥有也不修改上游 truth。

##### Trait 定义

```rust
/// L0-core 契约 snapshot 来源端口。
pub trait CoreContractSourcePort {
    /// 按版本引用读取 core contract snapshot。
    async fn fetch_snapshot(
        &self,
        version_ref: UpstreamVersionRef,
    ) -> Result<CoreContractSnapshot, SourceError>;

    /// 读取最新可用 core contract 版本引用。
    async fn latest_version(&self) -> Result<UpstreamVersionRef, SourceError>;
}

/// L0-bus 语义 snapshot 来源端口。
pub trait BusSemanticSourcePort {
    /// 按版本引用读取 bus semantic snapshot。
    async fn fetch_snapshot(
        &self,
        version_ref: UpstreamVersionRef,
    ) -> Result<BusSemanticSnapshot, SourceError>;

    /// 读取最新可用 bus semantic 版本引用。
    async fn latest_version(&self) -> Result<UpstreamVersionRef, SourceError>;
}

/// Formal API snapshot 来源端口。
pub trait FormalApiSourcePort {
    /// 按版本引用读取 formal API snapshot。
    async fn fetch_snapshot(
        &self,
        version_ref: UpstreamVersionRef,
    ) -> Result<FormalApiSnapshot, SourceError>;

    /// 读取最新可用 formal API 版本引用。
    async fn latest_version(&self) -> Result<UpstreamVersionRef, SourceError>;
}
```

##### 方法表

| Trait | 函数签名 | 作用 | 参数说明 | 返回 | 错误类型 |
|---|---|---|---|---|---|
| `CoreContractSourcePort` | `fetch_snapshot(version_ref: UpstreamVersionRef)` | 读取 core contract snapshot | `version_ref` 是上游版本引用 | `CoreContractSnapshot` | `SourceError` |
| `CoreContractSourcePort` | `latest_version()` | 读取最新 core 版本引用 | 无 | `UpstreamVersionRef` | `SourceError` |
| `BusSemanticSourcePort` | `fetch_snapshot(version_ref: UpstreamVersionRef)` | 读取 bus semantic snapshot | `version_ref` 是上游版本引用 | `BusSemanticSnapshot` | `SourceError` |
| `BusSemanticSourcePort` | `latest_version()` | 读取最新 bus 版本引用 | 无 | `UpstreamVersionRef` | `SourceError` |
| `FormalApiSourcePort` | `fetch_snapshot(version_ref: UpstreamVersionRef)` | 读取 formal API snapshot | `version_ref` 是上游版本引用 | `FormalApiSnapshot` | `SourceError` |
| `FormalApiSourcePort` | `latest_version()` | 读取最新 formal API 版本引用 | 无 | `UpstreamVersionRef` | `SourceError` |

##### 调用方 / 实现方

| 角色 | 模块 / 对象 | 说明 |
|---|---|---|
| 调用方 | `ContractConsumptionService`、`CheckUpstreamFreshness` job、`RefreshDerivedBindingView` flow | 读取 snapshot 并派生 SDK 本地 view |
| 实现方 | `infra_adapters` | local file / sibling repo / future remote source adapter |

##### 不变量与禁止事项

- source port 不写 SDK truth；写入由 application service 调 repository 完成。
- source port 不复制服务仓源码，不依赖 service implementation crate。

#### 7.6.3 Boundary port

Boundary port 负责运行期调用 formal API、fake fixture 或 bus event boundary。它不保存 SDK truth，不生成 bus delivery truth，不执行 auth / governance。

##### Trait 定义

```rust
/// Formal API 服务能力边界端口。
pub trait FormalApiBoundaryPort {
    /// 调用服务能力 command 边界。
    async fn call_service(
        &self,
        command: ServiceCapabilityCall,
        context: ClientCallContext,
    ) -> Result<ServiceCapabilityCallResult, BoundaryError>;

    /// 调用服务能力 read 边界。
    async fn read_service(
        &self,
        query: ServiceCapabilityReadQuery,
        context: ClientCallContext,
    ) -> Result<ServiceCapabilityReadResult, BoundaryError>;

    /// 检查 formal API 是否支持指定 capability。
    async fn check_capability(
        &self,
        capability_ref: ServiceCapabilityRef,
    ) -> Result<BoundaryCapabilityCheck, BoundaryError>;
}

/// Fake / fixture endpoint 边界端口。
pub trait FakeFixtureEndpointPort {
    /// 调用 fake command 边界。
    async fn call_fake(
        &self,
        command: ServiceCapabilityCall,
        context: ClientCallContext,
    ) -> Result<FakeBoundaryCallResult, BoundaryError>;

    /// 调用 fake read 边界。
    async fn read_fake(
        &self,
        query: ServiceCapabilityReadQuery,
        context: ClientCallContext,
    ) -> Result<FakeBoundaryReadResult, BoundaryError>;

    /// 校验结果中存在 fake / fixture marker。
    async fn assert_fake_marker(
        &self,
        result_ref: FakeBoundaryResultRef,
    ) -> Result<(), BoundaryError>;
}

/// L0-bus event client 边界端口。
pub trait BusEventBoundaryPort {
    /// 发布 SDK 侧 bus event 请求。
    async fn publish_event(
        &self,
        command: PublishBusEventCommand,
        context: ClientCallContext,
    ) -> Result<BusEventPublishResult, BoundaryError>;

    /// 打开 event subscription 视图。
    async fn open_subscription(
        &self,
        query: OpenEventSubscriptionQuery,
        context: ClientCallContext,
    ) -> Result<EventSubscriptionView, BoundaryError>;
}
```

##### 方法表

| Trait | 函数族 | 作用 | 错误类型 |
|---|---|---|---|
| `FormalApiBoundaryPort` | `call_service` / `read_service` / `check_capability` | 接入正式 formal API 能力 | `BoundaryError` |
| `FakeFixtureEndpointPort` | `call_fake` / `read_fake` / `assert_fake_marker` | 接入 fake / fixture 验证目标并强制 fake marker | `BoundaryError` |
| `BusEventBoundaryPort` | `publish_event` / `open_subscription` | 接入 L0-bus event client 边界 | `BoundaryError` |

##### 调用方 / 实现方

| 角色 | 模块 / 对象 | 说明 |
|---|---|---|
| 调用方 | `ServiceClientAssemblyService`、`EventClientAssemblyService`、`SdkClient` 经 runtime handle | 平台能力访问和事件客户端入口 |
| 实现方 | `infra_adapters` | formal HTTP / local fake / bus boundary adapter |

##### 不变量与禁止事项

- boundary port 不执行身份校验或授权，只使用可信入口传入的 `ClientCallContext`。
- formal / fake 调用结果必须经过 `BoundaryGuard`、redaction 和 error mapping。
- fake / fixture result 必须显式保留 fake marker，不能映射成 production success。
- `BusEventBoundaryPort` 不生成 publication / delivery / retry / replay truth；这些 truth 归 `L0-bus`。

### 7.7 Generator、Runner、Artifact 与 Outbox port 契约

#### 7.7.1 Generator 与 package builder port

##### Trait 定义

```rust
/// 语言 binding 生成器端口。
///
/// 该端口根据 SDK 语义基线和派生视图生成 Rust / Python / TypeScript 的 package surface。
pub trait LanguageBindingGeneratorPort {
    /// 生成指定语言的 binding surface。
    async fn generate(
        &self,
        input: LanguageBindingGenerationInput,
    ) -> Result<LanguageBindingGenerationResult, RunnerError>;
}

/// Package candidate 构建端口。
///
/// 该端口只生成本地 artifact，不执行 public registry 发布。
pub trait PackageBuilderPort {
    /// 构建 package candidate 的语言 artifact。
    async fn build_candidate(
        &self,
        input: PackageBuildInput,
    ) -> Result<PackageBuildResult, RunnerError>;
}
```

##### 方法表

| Trait | 函数签名 | 作用 | 参数说明 | 返回 | 错误类型 |
|---|---|---|---|---|---|
| `LanguageBindingGeneratorPort` | `generate(input: LanguageBindingGenerationInput)` | 生成语言 binding surface | `input` 包含 baseline、view、language 和 output ref | `LanguageBindingGenerationResult` | `RunnerError` |
| `PackageBuilderPort` | `build_candidate(input: PackageBuildInput)` | 构建本地 package artifact | `input` 包含 candidate、语言集合和输出目录 ref | `PackageBuildResult` | `RunnerError` |

##### 调用方 / 实现方

| 角色 | 模块 / 对象 | 说明 |
|---|---|---|
| 调用方 | `PackageCandidateService`、`BuildLanguagePackages` job | 生成 candidate artifact |
| 实现方 | `infra_adapters` | local generator / cargo / python / node builder wrapper |

##### 不变量与禁止事项

- builder 只生成本地 artifact，不发布 public registry。
- generator 不定义新平台语义，只消费 `SdkSemanticBaseline`、`DerivedBindingView` 和 `LanguageBindingView`。

#### 7.7.2 Runner port

##### Trait 定义

```rust
/// 三语言 smoke runner 端口。
pub trait SmokeRunnerPort {
    /// 运行三语言 smoke 验证。
    async fn run_cross_language_smoke(
        &self,
        input: CrossLanguageSmokeInput,
    ) -> Result<CrossLanguageSmokeResult, RunnerError>;
}

/// Docs / examples runner 端口。
pub trait DocsExampleRunnerPort {
    /// 运行文档示例验证。
    async fn run_examples(
        &self,
        input: DocsExampleRunInput,
    ) -> Result<DocsExampleRunResult, RunnerError>;
}

/// Compatibility runner 端口。
pub trait CompatibilityRunnerPort {
    /// 执行兼容性检查。
    async fn check_compatibility(
        &self,
        input: CompatibilityCheckInput,
    ) -> Result<CompatibilityCheckResult, RunnerError>;
}

/// Boundary policy verifier 端口。
pub trait BoundaryPolicyVerifierPort {
    /// 验证 redaction、credential 和 fake boundary 底线。
    async fn verify(
        &self,
        input: BoundaryPolicyVerificationInput,
    ) -> Result<BoundaryPolicyVerificationResult, RunnerError>;
}
```

##### 方法表

| Trait | 函数签名 | 作用 | 参数说明 | 返回 | 错误类型 |
|---|---|---|---|---|---|
| `SmokeRunnerPort` | `run_cross_language_smoke(input: CrossLanguageSmokeInput)` | 运行 Rust / Python / TypeScript smoke | `input` 指向 candidate artifact、fixture 和 suite | `CrossLanguageSmokeResult` | `RunnerError` |
| `DocsExampleRunnerPort` | `run_examples(input: DocsExampleRunInput)` | 验证 docs / examples | `input` 指向 example set 和 candidate artifact | `DocsExampleRunResult` | `RunnerError` |
| `CompatibilityRunnerPort` | `check_compatibility(input: CompatibilityCheckInput)` | 执行兼容检查 | `input` 指向基线、候选和变更集 | `CompatibilityCheckResult` | `RunnerError` |
| `BoundaryPolicyVerifierPort` | `verify(input: BoundaryPolicyVerificationInput)` | 验证横切边界策略 | `input` 指向 policy、guard、fixture 和 expected failures | `BoundaryPolicyVerificationResult` | `RunnerError` |

##### 调用方 / 实现方

| 角色 | 模块 / 对象 | 说明 |
|---|---|---|
| 调用方 | `CandidateValidationService`、`CompatibilityGovernanceService`、`DocsExampleValidationService`、operations jobs | 验证 candidate、docs、compatibility 和 boundary policy |
| 实现方 | `infra_adapters` | local process runner / future CI runner adapter |

##### 不变量与禁止事项

- runner 返回的是验证结果和 artifact / diagnostic ref，不直接修改 candidate 状态。
- runner 结果必须由 application service 转换成 `VerificationEvidence` 或 `CompatibilityDecision`。
- runner 不得输出 raw secret、生产 request body 或生产 response body。

#### 7.7.3 Artifact 与 outbox port

##### Trait 定义

```rust
/// Package artifact store 端口。
pub trait PackageArtifactStorePort {
    /// 写入 package artifact 并返回 artifact 引用。
    async fn put_artifact(
        &self,
        artifact: PackageArtifactWrite,
    ) -> Result<PackageArtifactRef, ArtifactError>;

    /// 读取 package artifact metadata。
    async fn get_artifact(
        &self,
        artifact_ref: PackageArtifactRef,
    ) -> Result<Option<PackageArtifactMetadata>, ArtifactError>;

    /// 校验 artifact digest。
    async fn verify_digest(
        &self,
        artifact_ref: PackageArtifactRef,
        expected_digest: ArtifactDigest,
    ) -> Result<DigestVerificationResult, ArtifactError>;

    /// 按 candidate 列出 artifact。
    async fn list_by_candidate(
        &self,
        candidate_id: PackageCandidateId,
    ) -> Result<Vec<PackageArtifactMetadata>, ArtifactError>;
}

/// SDK outbox 端口。
pub trait SdkOutboxPort {
    /// 在写事务中追加已提交 SDK fact。
    async fn append(
        &self,
        event: SdkOutboxEvent,
        uow: UnitOfWorkHandle,
    ) -> Result<(), OutboxError>;

    /// 读取待发布 outbox event。
    async fn load_pending(
        &self,
        cursor: OutboxCursor,
        limit: PageLimit,
    ) -> Result<OutboxEventPage, OutboxError>;

    /// 标记 outbox event 已发布。
    async fn mark_published(
        &self,
        event_id: SdkOutboxEventId,
        published_ref: PublishedEventRef,
        uow: UnitOfWorkHandle,
    ) -> Result<(), OutboxError>;
}
```

##### 方法表

| Trait | 函数签名 | 作用 | 参数说明 | 返回 | 错误类型 |
|---|---|---|---|---|---|
| `PackageArtifactStorePort` | `put_artifact(artifact: PackageArtifactWrite)` | 保存 artifact | `artifact` 是 artifact 写入请求 | `PackageArtifactRef` | `ArtifactError` |
| `PackageArtifactStorePort` | `get_artifact(artifact_ref: PackageArtifactRef)` | 读取 artifact metadata | `artifact_ref` 是 artifact 引用 | `Option<PackageArtifactMetadata>` | `ArtifactError` |
| `PackageArtifactStorePort` | `verify_digest(artifact_ref: PackageArtifactRef, expected_digest: ArtifactDigest)` | 校验 digest | `expected_digest` 是期望摘要 | `DigestVerificationResult` | `ArtifactError` |
| `PackageArtifactStorePort` | `list_by_candidate(candidate_id: PackageCandidateId)` | 列出 candidate artifacts | `candidate_id` 是 candidate ID | `Vec<PackageArtifactMetadata>` | `ArtifactError` |
| `SdkOutboxPort` | `append(event: SdkOutboxEvent, uow: UnitOfWorkHandle)` | 追加 outbox event | `event` 是已提交 SDK fact | `()` | `OutboxError` |
| `SdkOutboxPort` | `load_pending(cursor: OutboxCursor, limit: PageLimit)` | 读取待发布 event | `cursor` 是游标；`limit` 是分页大小 | `OutboxEventPage` | `OutboxError` |
| `SdkOutboxPort` | `mark_published(event_id: SdkOutboxEventId, published_ref: PublishedEventRef, uow: UnitOfWorkHandle)` | 标记已发布 | `published_ref` 是发布引用 | `()` | `OutboxError` |

##### 调用方 / 实现方

| 角色 | 模块 / 对象 | 说明 |
|---|---|---|
| 调用方 | `PackageCandidateService`、`CandidateValidationService`、`CompatibilityGovernanceService`、outbox publish job | 保存 artifact、追加 outbox、发布状态更新 |
| 实现方 | `infra_adapters` | filesystem artifact store、in-memory outbox、future durable outbox |

##### 不变量与禁止事项

- artifact store 只保存 artifact 和 metadata，不保存 raw secret。
- outbox event 必须在同一业务写事务内 append；发布动作不得反向修改 domain object。
- outbox event 不等于 `L0-bus` delivery truth，只是 SDK 本地事实输出。

### 7.8 Adapter 实现方映射与 wiring 边界

| Adapter | 实现 trait | 所属文件 | P0 默认 | 禁止事项 |
|---|---|---|---|---|
| `MemoryUnitOfWork` | `UnitOfWork` | `crates/infra/src/uow/memory_unit_of_work.rs` | 是 | 不得隐藏 repository 写入失败 |
| `SystemClock` / `FixedClock` | `ClockPort` | `crates/infra/src/time/system_clock.rs` / `fixed_clock.rs` | 是 | domain 不得直接调用系统时间 |
| `UuidIdGenerator` / `DeterministicIdGenerator` | `IdGeneratorPort` | `crates/infra/src/id/uuid_generator.rs` / `deterministic.rs` | 是 | 不得用业务字段拼 ID |
| `InMemorySdkRepositories` | repository ports | `crates/infra/src/repositories/*.rs` | 是 | 不得同时承担 source 或 projection adapter 职责 |
| `InMemorySdkProjections` | projection ports | `crates/infra/src/projections/*.rs` | 是 | 不得反写真相 repository |
| `LocalCoreContractSourceAdapter` | `CoreContractSourcePort` | `crates/infra/src/sources/core_contract_local.rs` | 是 | 不得复制 core 正文到 SDK truth |
| `LocalBusSemanticSourceAdapter` | `BusSemanticSourcePort` | `crates/infra/src/sources/bus_semantic_local.rs` | 是 | 不得定义 bus delivery / retry truth |
| `LocalFormalApiSourceAdapter` | `FormalApiSourcePort` | `crates/infra/src/sources/formal_api_local.rs` | 是 | 不得依赖服务仓源码 |
| `FormalApiHttpBoundaryAdapter` | `FormalApiBoundaryPort` | `crates/infra/src/boundaries/formal_api_http.rs` | P0 可用 profile | 不得执行 auth / governance，不得保存 raw body |
| `FakeFixtureEndpointAdapter` | `FakeFixtureEndpointPort` | `crates/infra/src/boundaries/fake_fixture.rs` | 是 | 不得把 fake result 映射为 production success |
| `BusEventBoundaryAdapter` | `BusEventBoundaryPort` | `crates/infra/src/boundaries/bus_event.rs` | P0 可用 profile | 不得生成 bus publication / delivery truth |
| `LocalLanguageBindingGenerator` | `LanguageBindingGeneratorPort` | `crates/infra/src/generators/language_binding_local.rs` | 是 | 不得定义新 SDK 语义 |
| `LocalPackageBuilder` | `PackageBuilderPort` | `crates/infra/src/builders/package_builder_local.rs` | 是 | 不得发布 public registry |
| `LocalSmokeRunner` | `SmokeRunnerPort` | `crates/infra/src/runners/smoke_runner_local.rs` | 是 | 不得输出 raw secret 或生产 body |
| `LocalDocsExampleRunner` | `DocsExampleRunnerPort` | `crates/infra/src/runners/docs_example_runner_local.rs` | 是 | 不得把 docs pass 当成兼容 pass |
| `LocalCompatibilityRunner` | `CompatibilityRunnerPort` | `crates/infra/src/runners/compatibility_runner_local.rs` | 是 | 不得直接修改 deprecated 状态 |
| `LocalBoundaryPolicyVerifier` | `BoundaryPolicyVerifierPort` | `crates/infra/src/runners/boundary_policy_verifier.rs` | 是 | 不得允许配置关闭 redaction / credential 下限 |
| `FilesystemPackageArtifactStore` | `PackageArtifactStorePort` | `crates/infra/src/artifacts/package_artifact_store.rs` | 是 | 不得保存 secret material |
| `InMemorySdkOutbox` | `SdkOutboxPort` | `crates/infra/src/outbox/sdk_outbox_memory.rs` | 是 | 不得绕过业务事务 append |

Wiring 边界：

```text
[RuntimeBuilder]
  |
  +-- creates infra adapters
  +-- assembles application service dependencies
  +-- exposes SdkRuntimeHandle to client / cli / jobs

[SdkRuntimeHandle]
  |
  +-- does not expose repository adapters directly
  +-- exposes application service handles only
```

关键说明：

- `RuntimeBuilder` 可以在 `crates/infra` 中引用 concrete adapter。
- `SdkRuntimeHandle` 对 `crates/client` 暴露 application service handle，而不是 adapter handle。
- `cli_entry` 和 `jobs` 可以调用 `RuntimeBuilder` 组装运行时，但不能在 handler 中散落创建 adapter。

### 7.9 Application service -> port 依赖矩阵

| Application service / job | 必需 port | 说明 |
|---|---|---|
| `SdkSemanticBaselineService` | `UnitOfWork`、`ClockPort`、`IdGeneratorPort`、`SdkIdempotencyRepository`、`SemanticBaselineRepository`、`SdkCapabilityProjectionPort`、`SdkOutboxPort` | 更新共同语义基线、刷新 capability summary、输出 baseline changed fact |
| `ContractConsumptionService` | `UnitOfWork`、`ClockPort`、`SdkIdempotencyRepository`、`CoreContractSourcePort`、`BusSemanticSourcePort`、`FormalApiSourcePort`、`VersionRefRepository`、`DerivedViewRepository`、`ServiceClientViewRepository`、`EventClientViewRepository`、`SdkOutboxPort` | 消费上游 snapshot、保存版本引用、刷新派生视图和 client view |
| `ServiceClientAssemblyService` | `FormalApiBoundaryPort`、`FakeFixtureEndpointPort`、`ServiceClientViewRepository`、`EvidenceRepository`、`BoundaryPolicyVerifierPort` | 组装并调用 service client boundary，不写服务端 truth |
| `EventClientAssemblyService` | `BusEventBoundaryPort`、`EventClientViewRepository`、`EvidenceRepository` | 组装 event client boundary，不写 bus runtime truth |
| `PackageCandidateService` | `UnitOfWork`、`ClockPort`、`IdGeneratorPort`、`CandidateRepository`、`SemanticBaselineRepository`、`DerivedViewRepository`、`ServiceClientViewRepository`、`EventClientViewRepository`、`LanguageBindingGeneratorPort`、`PackageBuilderPort`、`PackageArtifactStorePort`、`SdkOutboxPort` | 生成 candidate、构建 artifact、保存本地候选事实 |
| `CandidateValidationService` | `UnitOfWork`、`ClockPort`、`IdGeneratorPort`、`CandidateRepository`、`EvidenceRepository`、`SmokeRunnerPort`、`DocsExampleRunnerPort`、`BoundaryPolicyVerifierPort`、`EvidenceProjectionPort`、`DocsExampleProjectionPort`、`SdkOutboxPort` | 运行验证、保存 evidence、更新只读投影 |
| `CompatibilityGovernanceService` | `UnitOfWork`、`ClockPort`、`IdGeneratorPort`、`CandidateRepository`、`EvidenceRepository`、`CompatibilityRepository`、`CompatibilityRunnerPort`、`CompatibilityProjectionPort`、`SdkOutboxPort` | 形成 compatibility decision、deprecated API record 和 migration ref |
| `DocsExampleValidationService` | `DocsExampleRunnerPort`、`EvidenceRepository`、`DocsExampleProjectionPort`、`PackageArtifactStorePort` | 验证 docs example 并生成 evidence / projection |
| `QueryService` | `SdkCapabilityProjectionPort`、`EvidenceProjectionPort`、`CompatibilityProjectionPort`、`DocsExampleProjectionPort`、`DerivedViewRepository`、`ServiceClientViewRepository`、`EventClientViewRepository` | 只读查询，不开写事务，不触发 refresh |
| `CheckUpstreamFreshness` job | `CoreContractSourcePort`、`BusSemanticSourcePort`、`FormalApiSourcePort`、`VersionRefRepository`、`DerivedViewRepository` | 检查 freshness，不复制上游正文 |
| `GeneratePackageCandidate` job | `PackageCandidateService` 经 runtime handle | 不直接调用 builder / repository |
| `BuildLanguagePackages` job | `PackageCandidateService` 经 runtime handle | 不直接调用 package builder |
| `RunCrossLanguageSmoke` job | `CandidateValidationService` 经 runtime handle | 不直接调用 smoke runner |
| `ValidateDocsExamples` job | `DocsExampleValidationService` 经 runtime handle | 不直接调用 docs runner |
| `CheckCompatibility` job | `CompatibilityGovernanceService` 经 runtime handle | 不直接调用 compatibility runner |
| `VerifyBoundaryPolicies` job | `CandidateValidationService` 经 runtime handle | 不直接调用 verifier |
| `RebuildSdkProjections` job | projection ports、truth repositories 经 application service | 只重建 read model，不改写真相 |

### 7.10 Step 7 统一复核

#### 7.10.1 Port 覆盖复核

| 覆盖项 | 是否覆盖 | 说明 |
|---|---|---|
| 写事务、时间、ID | 是 | `UnitOfWork`、`ClockPort`、`IdGeneratorPort` |
| 幂等 | 是 | `SdkIdempotencyRepository` |
| SDK 本地 truth repository | 是 | semantic、derived view、client view、candidate、evidence、compatibility、version ref |
| 只读 projection | 是 | capability、evidence、compatibility、docs example projection |
| 上游 source | 是 | core、bus、formal API source |
| runtime boundary | 是 | formal API、fake fixture、bus event boundary |
| generator / builder / runner | 是 | language binding、package builder、smoke、docs、compatibility、boundary verifier |
| artifact store | 是 | `PackageArtifactStorePort` |
| outbox | 是 | `SdkOutboxPort` |
| adapter mapping | 是 | §7.8 固定默认实现方和禁止事项 |
| service dependency | 是 | §7.9 固定 application service -> port 矩阵 |

#### 7.10.2 后移内容复核

| 后移内容 | 后移到 | 原因 |
|---|---|---|
| Command / Query / Event / Job JSON 或 proto schema | Step 8 | 协议字段、metadata、receipt 和 error envelope 需要统一定义 |
| 每个接口的函数调用顺序、事务提交点和错误分支 | Step 9 | 需要基于 Step 6 对象、Step 7 port 和 Step 8 协议共同展开 |
| 状态迁移矩阵 | Step 10 | Step 7 只定义 port，不定义状态来源 / 去向 |
| DDL、索引、持久化格式、事务隔离 | Step 11 | repository port 不等同具体存储实现 |
| 错误码、错误映射和恢复策略 | Step 12 | 本步只使用错误类型名，详细错误族后移 |
| 并发、幂等细则和重入保护 | Step 13 | 本步只定义 idempotency repository 方法 |
| 配置项和外部依赖绑定 | Step 14 | formal / fake / source / runner adapter 需要配置章节收口 |
| metrics、trace、audit 和 evidence export | Step 15 | 本步只定义必要 port，不定义埋点和报告格式 |
| 测试切口和 mock/fake 组合 | Step 16 | 本步提供可 mock 的 trait，测试矩阵后移 |

#### 7.10.3 禁止漂移复核

| 禁止漂移项 | 本 Step 固定口径 |
|---|---|
| application 依赖 infra | 禁止；application 只能依赖 `application_ports` trait |
| domain 依赖 port | 禁止；domain 只表达对象、状态和 policy |
| source 复制上游 truth | 禁止；source 只返回 snapshot / ref / digest |
| projection 反写真相 | 禁止；projection 只读或重建 read model |
| fake success 伪装生产成功 | 禁止；fake boundary 必须保留 fake marker |
| runner 直接改状态 | 禁止；runner 只返回 result，由 application service 生成 evidence / decision |
| jobs 绕过 application service | 禁止；jobs 通过 runtime handle 调 application service |
| language package 拥有 truth | 禁止；Python / TypeScript 只承载 package surface |

---

## 8. 回填草稿

正式 `projects/L0-sdk/03-详细设计.md` 回填时，§5 / §6 应按以下方式引用本文件：

| 正式章节 | 回填来源 | 回填方式 |
|---|---|---|
| §5 各模块 `Trait / Port / Adapter 契约` | 本文件 §7.1~§7.9 | 按 Step 5 模块拆回对应小节，不把所有 trait 堆到一个全局章节 |
| §6 全局 Trait / Port / Adapter 索引 | 本文件 §7.1、§7.10 | 摘录 trait 名称、类型、所属模块和定义位置 |
| §8 逐接口处理流 | 本文件 §7.9 | 使用 service -> port dependency matrix 作为函数流输入 |
| §10 持久化、事务与一致性 | 本文件 §7.4、§7.5、§7.7 | 引用 `UnitOfWork`、repository、outbox、artifact store 的契约 |
| §13 配置引用与外部依赖绑定 | 本文件 §7.6、§7.7、§7.8 | 引用 source、boundary、runner 和 adapter 映射 |

回填规则：

- 如果正式文档完全引用本文件已有 trait 小节，只写引用来源并摘录必要代码片段，不重复制造第二套方法名。
- 正式文档不得把 `infra_adapters` 的 adapter 反写成 application service 的依赖类型。
- 如果 Step 8 / Step 9 发现某个协议或处理流缺少 port，必须回到本 Step 增补 port，再继续后续 Step。

---

## 9. 待确认事项

| 待确认项 | 方案 | 推荐 | 原因 |
|---|---|---|---|
| repository 是否按每个 domain object 拆分 | A. 每个对象一个 repository；B. 按 SDK 本地 truth 聚合 repository；C. 一个 `SdkStorePort` 全包 | 推荐 B | B 能保持业务语义，又避免 repository 爆炸或 generic store 隐藏边界 |
| formal API source 和 formal API boundary 是否合并 | A. 合并；B. 拆分为 snapshot source 和 runtime boundary | 推荐 B | source 用于派生视图，boundary 用于运行期调用，语义和错误模型不同 |
| fake boundary 是否走同一个 `FormalApiBoundaryPort` | A. 复用 formal port；B. 单独 `FakeFixtureEndpointPort` | 推荐 B | 单独 port 能强制 fake marker，防止误判为生产成功 |
| projection 是否允许直接写 truth repository | A. 允许；B. 禁止 | 推荐 B | projection rebuild 只重建 read model，truth 只能由 application command flow 写入 |
| jobs 是否可以直接调用 runner port | A. 可以；B. 必须经 application service | 推荐 B | 需要统一 evidence、状态、事务和 outbox 记录 |

当前推荐方案已写入本 Step。若后续正式实现需要改变其中任一结论，必须先回到本文件修正，再继续 Step 8 / Step 9。

---

## 10. 进入下一步条件

进入 Step 8 的条件：

- Step 5 的实现职责模块已经映射到 port 定义方、调用方和实现方。
- Step 6 中的对象已经有对应 repository、source、boundary、runner、artifact、projection 或 outbox 接缝。
- 所有跨模块、跨层、跨外部系统的实现接缝都有明确 trait / port / adapter 契约。
- trait 函数已写参数类型、返回类型和错误类型。
- source / boundary / runner / projection / artifact / outbox 的禁止事项已经明确。

下一步：

```text
Step 8. 定义 API / Command / Query / Event / Job 协议契约

重点问题:
1. 每个 Command / Query / Event / Job 的 request / response / metadata / receipt schema 是什么?
2. 哪些协议由 Rust client、CLI、jobs 或 event consumer 调用?
3. 请求 JSON 或 proto 字段如何映射到 Step 6 对象和 Step 7 port?
4. 哪些错误进入 protocol error envelope,哪些保持内部错误?
```
