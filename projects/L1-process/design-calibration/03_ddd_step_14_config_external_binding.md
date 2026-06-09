# L1-process 03 DDD Step 14 配置引用与外部依赖绑定

> SOP: `standards/document/详细设计讨论流程_SOP.md` Step 14
> 书写规范: `standards/document/详细设计书写规范.md` §5.13
> 上游输入: `projects/L1-process/01-架构设计.md` §8;`projects/L1-process/02-概要设计.md` §11
> 直接输入:
> - `projects/L1-process/design-calibration/03_ddd_step_03_constraints.md`
> - `projects/L1-process/design-calibration/03_ddd_step_04_file_layout.md`
> - `projects/L1-process/design-calibration/03_ddd_step_05_module_contracts.md`
> - `projects/L1-process/design-calibration/03_ddd_step_07_trait_port_adapter_contracts.md`
> - `projects/L1-process/design-calibration/03_ddd_step_08_protocol_contracts.md`
> - `projects/L1-process/design-calibration/03_ddd_step_13_concurrency_idempotency.md`
> 创建日期: 2026-06-06
> 状态: Completed

---

## 1. Step 状态

本 Step 已完成。

---

## 2. 本步输入

| 输入 | 用途 | 结论 |
|---|---|---|
| Step 3 constraints | 编译期依赖与运行期依赖分类 | 唯一 Cargo path dependency 是 `core-contracts`;相邻仓只能通过 adapter / event / handoff / fake |
| Step 4 file layout | `infra/config.rs`、`runtime_builder.rs`、adapter 文件位置 | 配置根归 `infra`;application / domain / contracts 不读取配置 |
| Step 5 module contracts | 模块依赖方向 | `infra` 负责 config binding 和 runtime assembly |
| Step 7 ports | repository、resolver、publisher、handoff、clock、id generator trait | 配置项必须最终装配成这些 trait object / generic port |
| Step 8 protocol | topic、job DTO、scope、page、retry limit、retention duration 类型 | 配置必须与 public DTO / topic mapping 一致 |
| Step 13 idempotency | retention / cleanup / retry backoff open item | 本 Step 固定配置绑定点,完整配置手册后续由 `04-配置设计.md` 展开 |

---

## 3. SOP 问题回答

1. 哪些模块需要读取配置?

   回答:只有 `infra`、`api`、`worker`、`jobs` 入口装配层读取 `ProcessRuntimeConfig` 或子配置。`application` service 只接收已装配的 repository / resolver / publisher / handoff / clock / id generator port。`domain` 和 `contracts` 不读取配置。

2. 配置项的类型、默认值和读取位置是什么?

   回答:本 Step 定义 `ProcessRuntimeConfig` 的 store、boundary、idempotency、projection、jobs、external、outbox、handoff、features、clock/id 子配置引用表。P0 / local 默认使用 in-memory / fake / deterministic adapter;production 详细默认值在 `04-配置设计.md` 给出。

3. 哪些外部依赖需要通过 adapter 注入?

   回答:method-library、work、identity、governance、artifact、runtime、conversation 通过 source resolver adapter 注入。event bus 通过 publisher / worker adapter 注入。observability / archive 通过 handoff adapter 注入。core contracts 是唯一编译期依赖,不是运行期 adapter。

4. 外部依赖的超时、重试、降级策略是什么?

   回答:resolver timeout / retry 映射 `ResolverError::SourceUnavailable`、`DigestMismatch`、`BodyNotAllowed`。publisher retryable / permanent failure 映射 outbox `RetryPending` / `Failed`。handoff retryable / permanent failure 映射 handoff failed marker。具体 timeout/backoff 数值在配置设计中定义。

5. 哪些配置细节应留给配置设计文档?

   回答:环境变量名、JSON / TOML 示例、secret 来源、profile 合并、数值默认值、runtime deployment endpoint、TLS、credential rotation、retention duration 具体值、retry backoff 具体曲线和 config validation error detail 留给 `04-配置设计.md`。

6. 哪些跨仓 Rust 编译期依赖需要通过本地 path dependency 引入?

   回答:只有 `/home/aris/Projects/quantalithos-core/crates/contracts` 的 `core-contracts`。当前目标实现仓 root `Cargo.toml` 使用 `core-contracts = { path = "../quantalithos-core/crates/contracts" }`。其他相邻仓不得进入 Cargo dependency。

7. 哪些运行期依赖或事件协作依赖需要通过 adapter / event / projection / fake 表达?

   回答:`quantalithos-method-library`、`quantalithos-work`、`quantalithos-identity`、`quantalithos-governance`、`quantalithos-artifact`、`quantalithos-runtime`、`quantalithos-conversation`、`quantalithos-workspace`、`quantalithos-observability`、`quantalithos-archive` 和 event bus 均通过 adapter / event / projection / fake 表达。

8. 依赖仓库不存在时,当前实现应暂停、使用 fixture / fake,还是等待对应仓库完成?

   回答:编译期 `core-contracts` 不存在时暂停实现。运行期 / 事件依赖不存在时,不暂停核心 Process 实现;使用 contracts DTO、fake resolver、fake publisher、fake handoff 和 fixture seed 覆盖 P0 行为。需要真实 integration 时由实施计划或配置设计再设门禁。

---

## 4. 当前文档问题诊断

| 来源 | 问题 | 本 Step 收口 |
|---|---|---|
| Step 13 | idempotency / dedup / job retention 只说明由 Step 14 配置 | 补 `ProcessIdempotencyConfig` 字段和绑定位置 |
| Step 7 | resolver / publisher / handoff adapter 有 trait,但没有 config section | 补 `ProcessExternalConfig`、`ProcessOutboxConfig`、`ProcessHandoffConfig` |
| Step 4 | `infra/config.rs` 有位置,但没有 root config 对象 | 补 `ProcessRuntimeConfig` 根对象 |
| Step 3 | 相邻仓分类已有,但 Step 14 需按 SOP 输出跨仓依赖表 | 补编译期 / 运行期 / 事件 / handoff 表 |
| `04-配置设计.md` | 当前尚未生成 | 本 Step 只写代码绑定点,正式配置手册后续生成 |

---

## 5. 设计取舍

| 议题 | 方案 | 取舍 |
|---|---|---|
| 配置读取位置 | A. 各模块自行读取;B. `infra` / entry 读取并注入 port | 采用 B。保持 domain / application 可测试 |
| 相邻仓依赖 | A. Cargo path dependency;B. runtime adapter / event / fake | 采用 B,除 `core-contracts` 外全部不得编译期依赖 |
| P0 adapter 默认 | A. 真实服务 endpoint 必填;B. in-memory / fake 可运行 | 采用 B。实现仓可先完成 contract / service tests |
| Retention / backoff 数值 | A. Step 14 固定数值;B. Step 14 固定字段和读取位置,数值交给配置设计 | 采用 B。避免详细设计变成配置手册 |
| Config object ownership | A. contracts 暴露;B. infra-local config | 采用 B。配置不是 public protocol |

---

## 6. 结构化中间产物

### 6.1 配置根对象

`ProcessRuntimeConfig` 归 `crates/infra/src/config.rs`,由 `ProcessRuntimeBuilder` 读取和校验。

```rust
/// Runtime configuration root for the Process implementation.
pub struct ProcessRuntimeConfig {
    /// Store and transaction configuration.
    pub store: ProcessStoreConfig,
    /// API / query boundary configuration.
    pub boundary: ProcessBoundaryConfig,
    /// Idempotency and deduplication configuration.
    pub idempotency: ProcessIdempotencyConfig,
    /// Projection and read model configuration.
    pub projection: ProcessProjectionConfig,
    /// Operations job configuration.
    pub jobs: ProcessJobConfig,
    /// External source resolver configuration.
    pub external: ProcessExternalConfig,
    /// Outbox publisher and event topic configuration.
    pub outbox: ProcessOutboxConfig,
    /// Trace and archive handoff configuration.
    pub handoff: ProcessHandoffConfig,
    /// Feature flags for optional derived capabilities.
    pub features: ProcessFeatureConfig,
    /// Clock and id generation configuration.
    pub runtime: ProcessRuntimeAdapterConfig,
}
```

Config ownership rules:

- `infra/config.rs` owns config structs and validation.
- `infra/runtime_builder.rs` converts config into concrete adapters and service assembly.
- `application` receives trait objects / generic ports,not `ProcessRuntimeConfig`.
- `domain` and `contracts` do not import config structs.

Config helper schema:

```rust
/// Store adapter kind selected by runtime configuration.
pub enum ProcessStoreAdapterKind {
    /// In-memory store for local development and P0 tests.
    InMemory,
    /// Durable store configured by the deployment profile.
    Durable,
}

/// Projection adapter kind selected by runtime configuration.
pub enum ProcessProjectionAdapterKind {
    /// In-memory projection store for local development and P0 tests.
    InMemory,
    /// Durable projection store configured by the deployment profile.
    Durable,
}

/// Byte size limit used by API boundary validators.
pub struct ByteSize {
    /// Size in bytes.
    pub bytes: u64,
}

/// Retry policy config used by jobs, resolver adapters, publisher, and handoff.
pub struct RetryPolicyConfig {
    /// Maximum retry attempts.
    pub max_attempts: RetryLimit,
    /// Backoff profile.
    pub backoff: RetryBackoffConfig,
}

/// Backoff config for retry loops.
pub struct RetryBackoffConfig {
    /// Initial backoff duration.
    pub initial_delay: RetentionDuration,
    /// Maximum backoff duration.
    pub max_delay: RetentionDuration,
    /// Multiplier applied by adapters that implement exponential backoff.
    pub multiplier: u16,
}

/// External adapter mode and endpoint binding.
pub struct ExternalAdapterConfig {
    /// Adapter mode.
    pub adapter_kind: ExternalAdapterKind,
    /// Endpoint, fixture, or controlled seam reference, depending on adapter kind.
    pub endpoint_ref: Option<ExternalEndpointRef>,
    /// Credential reference, not raw secret material.
    pub credential_ref: Option<CredentialRef>,
}

/// External adapter mode.
pub enum ExternalAdapterKind {
    /// Fake adapter seeded by test fixtures.
    Fake,
    /// Controlled local or integration seam with explicit success / failure injection.
    Controlled,
    /// Runtime endpoint adapter.
    Endpoint,
    /// Disabled adapter that returns SourceUnavailable.
    Disabled,
}

/// Handoff target configuration.
pub struct HandoffTargetConfig {
    /// Adapter mode and endpoint binding.
    pub adapter: ExternalAdapterConfig,
    /// Destination reference passed into handoff ports.
    pub destination_ref: HandoffDestinationRef,
}

/// Topic mapping for outbound process events.
pub struct ProcessTopicMapConfig {
    /// Runtime shape changed topic.
    pub runtime_shape_changed: TopicName,
    /// Process profile changed topic.
    pub process_profile_changed: TopicName,
    /// Process instance changed topic.
    pub process_instance_changed: TopicName,
    /// Activity progressed topic.
    pub activity_progressed: TopicName,
    /// Waiting gate changed topic.
    pub waiting_gate_changed: TopicName,
    /// Process checkpoint created topic.
    pub checkpoint_created: TopicName,
    /// Recovery attempt changed topic.
    pub recovery_attempt_changed: TopicName,
    /// Process timing changed topic.
    pub process_timing_changed: TopicName,
    /// Process trace available topic.
    pub process_trace_available: TopicName,
    /// Derived process view changed topic.
    pub derived_view_changed: TopicName,
}

/// Clock adapter kind.
pub enum ClockKind {
    /// System clock.
    System,
    /// Fixed clock for deterministic tests.
    Fixed,
}

/// Id generator adapter kind.
pub enum IdGeneratorKind {
    /// Deterministic sequence generator.
    Sequence,
    /// Runtime generator configured by deployment.
    Runtime,
}
```

External adapter kind validation:

| adapter_kind | endpoint_ref | credential_ref | Runtime meaning | Failure mapping |
|---|---|---|---|---|
| `Fake` | optional fixture ref only | must be absent unless fixture explicitly requires ref | deterministic fake adapter seeded by tests;must emit fake marker where observable | fake failure only when fixture injects failure |
| `Controlled` | required controlled seam ref | optional credential ref | integration-like configured local seam;may return controlled success,unavailable,retryable failure or permanent failure | explicit unavailable / retry / failed marker;must not fallback to fake success |
| `Endpoint` | required endpoint ref | required when endpoint profile says protected | runtime endpoint adapter selected by staging / production-like profile | dependency unavailable / retry / failed marker according to port |
| `Disabled` | must be absent | must be absent | adapter intentionally disabled by profile | SourceUnavailable / rejected job / degraded query surface according to caller |

`Controlled` is not a production endpoint. It exists so `integration-like` can validate resolver / publisher / handoff seams and failure mapping without requiring real sibling services. Implementation must parse `controlled` as a first-class `ExternalAdapterKind` value, not as `Endpoint` and not as `Fake`.

| Helper type | 归属 | 字段 / 变体说明 | 禁止事项 |
|---|---|---|---|
| `ExternalEndpointRef` | `infra/config.rs` | opaque endpoint / fixture / controlled seam identifier | 不保存 raw URL secret |
| `CredentialRef` | `infra/config.rs` | opaque credential reference | 不保存 raw secret / token |
| `HandoffDestinationRef` | `infra/config.rs` | observability / archive destination ref | 不保存外部正文 |
| `TopicName` | `infra/config.rs` | event bus topic string | 必须匹配 Step 8 stable topic |

### 6.2 配置引用表

| 配置项 | 类型 | 读取模块 | 默认值 | 详细配置文档位置 |
|---|---|---|---|---|
| `ProcessRuntimeConfig.store.adapter_kind` | `ProcessStoreAdapterKind` | `infra/config.rs`;`runtime_builder.rs` | `InMemory` for P0 / local test | `04-配置设计.md` store section |
| `ProcessRuntimeConfig.store.transaction_timeout` | `RetentionDuration` | `infra/repositories.rs`;`unit_of_work` adapter | 配置设计给出 | store / transaction section |
| `ProcessRuntimeConfig.store.enable_optimistic_conflict_assertions` | `bool` | `infra/repositories.rs` | `true` | store policy |
| `ProcessRuntimeConfig.boundary.max_command_body_bytes` | `ByteSize` | `api/command_handlers.rs` | 配置设计给出 | boundary section |
| `ProcessRuntimeConfig.boundary.max_page_limit` | `PageLimit` | `api/query_handlers.rs`;repository list adapters | 配置设计给出 | boundary / query section |
| `ProcessRuntimeConfig.boundary.query_read_timeout` | `RetentionDuration` | `api/query_handlers.rs`;query service wiring | 配置设计给出 | query section |
| `ProcessRuntimeConfig.idempotency.command_retention` | `RetentionDuration` | `infra/idempotency_store.rs` | 覆盖 command retry / commit unknown window | idempotency section |
| `ProcessRuntimeConfig.idempotency.event_dedup_retention` | `RetentionDuration` | `infra/idempotency_store.rs`;`worker/consumers.rs` | 覆盖 event redelivery window | idempotency section |
| `ProcessRuntimeConfig.idempotency.job_retention` | `RetentionDuration` | `infra/idempotency_store.rs`;`jobs/*` | 覆盖 scheduler rerun window | idempotency section |
| `ProcessRuntimeConfig.idempotency.reserved_record_max_age` | `RetentionDuration` | `infra/idempotency_store.rs`;reconciliation / cleanup job | 配置设计给出 | idempotency cleanup |
| `ProcessRuntimeConfig.projection.adapter_kind` | `ProcessProjectionAdapterKind` | `infra/projection_stores.rs`;`runtime_builder.rs` | `InMemory` for P0 / local test | projection section |
| `ProcessRuntimeConfig.projection.stale_threshold` | `RetentionDuration` | `application/query_service.rs` via builder parameter | 配置设计给出 | projection freshness |
| `ProcessRuntimeConfig.projection.rebuild_batch_size` | `PageLimit` | `jobs/projection_rebuild.rs`;`projection_service.rs` | 配置设计给出 | projection jobs |
| `ProcessRuntimeConfig.jobs.default_batch_size` | `PageLimit` | `jobs/*`;job services | 配置设计给出 | jobs section |
| `ProcessRuntimeConfig.jobs.max_parallelism` | `u16` | `worker/*`;`jobs/*` | `1` for P0 fake unless config overrides | jobs section |
| `ProcessRuntimeConfig.jobs.job_timeout` | `RetentionDuration` | `jobs/*` | 配置设计给出 | jobs section |
| `ProcessRuntimeConfig.jobs.retry_backoff` | `RetryBackoffConfig` | `jobs/*`;worker loops | 配置设计给出 | retry section |
| `ProcessRuntimeConfig.external.method_library` | `ExternalAdapterConfig` | `infra/source_resolvers.rs` | `Fake` | external adapters |
| `ProcessRuntimeConfig.external.work` | `ExternalAdapterConfig` | `infra/source_resolvers.rs` | `Fake` | external adapters |
| `ProcessRuntimeConfig.external.identity` | `ExternalAdapterConfig` | `infra/source_resolvers.rs` | `Fake` | external adapters |
| `ProcessRuntimeConfig.external.governance` | `ExternalAdapterConfig` | `infra/source_resolvers.rs` | `Fake` | external adapters |
| `ProcessRuntimeConfig.external.artifact` | `ExternalAdapterConfig` | `infra/source_resolvers.rs` | `Fake` | external adapters |
| `ProcessRuntimeConfig.external.runtime` | `ExternalAdapterConfig` | `infra/source_resolvers.rs` | `Fake` | external adapters |
| `ProcessRuntimeConfig.external.conversation` | `ExternalAdapterConfig` | `infra/source_resolvers.rs` | `Fake` | external adapters |
| `ProcessRuntimeConfig.external.resolver_timeout` | `RetentionDuration` | all controlled / endpoint resolver adapters | 配置设计给出 | external adapters |
| `ProcessRuntimeConfig.external.resolver_retry` | `RetryPolicyConfig` | resolver adapters when enabled | no retry in P0 fake unless controlled / endpoint adapter is enabled | external retry |
| `ProcessRuntimeConfig.outbox.publisher` | `ExternalAdapterConfig` | `infra/publishers.rs` | `Fake` | outbox / bus adapter |
| `ProcessRuntimeConfig.outbox.publish_batch_size` | `PageLimit` | `worker/outbox_publisher.rs`;`jobs` | 配置设计给出 | outbox section |
| `ProcessRuntimeConfig.outbox.publish_retry` | `RetryPolicyConfig` | publisher worker / job | 配置设计给出 | outbox retry |
| `ProcessRuntimeConfig.outbox.topic_map` | `ProcessTopicMapConfig` | `infra/publishers.rs`;`worker/outbox_publisher.rs` | Step 8 `.v1` topics | event topic mapping |
| `ProcessRuntimeConfig.handoff.trace_target` | `HandoffTargetConfig` | `infra/handoff_adapters.rs` | `Fake` | handoff section |
| `ProcessRuntimeConfig.handoff.archive_target` | `HandoffTargetConfig` | `infra/handoff_adapters.rs` | `Fake` | handoff section |
| `ProcessRuntimeConfig.handoff.delivery_timeout` | `RetentionDuration` | handoff adapters | 配置设计给出 | handoff section |
| `ProcessRuntimeConfig.handoff.delivery_retry` | `RetryPolicyConfig` | handoff jobs | 配置设计给出 | handoff retry |
| `ProcessRuntimeConfig.features.derived_views_enabled` | `bool` | `runtime_builder.rs`;query / projection wiring | `true` for P0 | feature section |
| `ProcessRuntimeConfig.features.search_enabled` | `bool` | `runtime_builder.rs`;query handler | `false` until search adapter exists | feature section |
| `ProcessRuntimeConfig.runtime.clock_kind` | `ClockKind` | `infra/clock_id.rs`;`runtime_builder.rs` | `Fixed` in tests;`System` in runtime profile | runtime section |
| `ProcessRuntimeConfig.runtime.id_generator_kind` | `IdGeneratorKind` | `infra/clock_id.rs`;`runtime_builder.rs` | `Sequence` for P0 fake | runtime section |

### 6.3 Config section 注入表

| Config section | 读取位置 | 注入对象 | 不变量 |
|---|---|---|---|
| `store` | `infra/runtime_builder.rs` | UnitOfWork、truth repositories、trace / outbox / projection / reference stores | save 必须实现 `StorageVersion` conflict |
| `boundary` | `api/*handlers.rs`;`runtime_builder.rs` | command / query validators、page limit guard | 不改变 DTO schema |
| `idempotency` | `infra/idempotency_store.rs` | `IdempotencyRepository`、`OperationResultRepository` cleanup policy | 不允许清理未 reconcile 的 completed result |
| `projection` | `infra/projection_stores.rs`;`jobs/projection_rebuild.rs` | projection repositories、rebuild job service | projection 不反写真相 |
| `jobs` | `jobs/*`;`worker/*` | job runners、batch loop、parallelism controller | job duplicate 仍由 idempotency store 控制 |
| `external` | `infra/source_resolvers.rs` | fake / controlled / endpoint / disabled source resolver adapters | resolver 不返回外部正文 |
| `outbox` | `infra/publishers.rs`;`worker/outbox_publisher.rs` | fake / bus publisher、topic mapper、retry policy | publisher 不拼 domain payload |
| `handoff` | `infra/handoff_adapters.rs`;`jobs/*handoff*` | trace / archive handoff adapters | handoff 不保存 observability / archive body |
| `features` | `infra/runtime_builder.rs` | optional service / adapter wiring | feature flag 不得改变 truth ownership |
| `runtime` | `infra/clock_id.rs` | `ClockPort`、`IdGeneratorPort` | deterministic tests use fixed clock / sequence ids |

### 6.4 外部依赖绑定表

| 依赖 | 绑定位置 | 使用接口 | 超时 / 重试 | 降级策略 |
|---|---|---|---|---|
| Method library source | `infra/source_resolvers.rs` | `MethodDefinitionResolverPort::resolve_definition` | `external.resolver_timeout`;retry by `external.resolver_retry` | `ResolverError::SourceUnavailable`;command retry / consumer delayed / job partial |
| Work source | `infra/source_resolvers.rs` | `WorkContextResolverPort::resolve_work_context` | same resolver policy | unavailable marker / delayed receipt;do not mutate Work truth |
| Identity source | `infra/source_resolvers.rs` | `ActorCapabilityResolverPort::resolve_actor_capability` | same resolver policy | capability unavailable / query not authorized surface;no identity body |
| Governance source | `infra/source_resolvers.rs` | `GovernanceDecisionResolverPort::resolve_decision` | same resolver policy | waiting gate marker delayed / noop;no automatic resume |
| Artifact source | `infra/source_resolvers.rs` | `ArtifactEvidenceResolverPort::resolve_evidence` | same resolver policy | evidence marker unavailable / quarantine on body |
| Runtime source | `infra/source_resolvers.rs` | `RuntimeFeedbackResolverPort::resolve_feedback` | same resolver policy | delayed / quarantine;no execution log body |
| Conversation source | `infra/source_resolvers.rs` | `ConversationContextResolverPort::resolve_context` | same resolver policy | conversation marker unavailable;no conversation body |
| Event bus publisher | `infra/publishers.rs`;`worker/outbox_publisher.rs` | `ProcessOutboxPublisherPort::publish` | `outbox.publish_retry` | retryable -> outbox `RetryPending`;permanent -> `Failed` |
| Inbound event bus subscriber | `worker/consumers.rs` | `InboundEventEnvelope<T>` handlers | worker retry policy;event dedup retention | invalid -> quarantine;source unavailable -> delayed |
| Observability handoff | `infra/handoff_adapters.rs`;`jobs` | `TraceHandoffPort::deliver_trace` | `handoff.delivery_timeout`;`handoff.delivery_retry` | failed marker;no observability body stored |
| Archive handoff | `infra/handoff_adapters.rs`;`jobs` | `ArchiveHandoffPort::deliver_archive` | same handoff policy | failed marker;only archive package ref stored |
| Store adapter | `infra/repositories.rs` | all repository traits + `UnitOfWork` | `store.transaction_timeout` | repository error mapping;no partial commit |
| Clock source | `infra/clock_id.rs` | `ClockPort::now` | not retryable | fixed clock for tests;system clock for runtime |
| Id generator | `infra/clock_id.rs` | `IdGeneratorPort` | not retryable | sequence / deterministic fake;no domain-local id generation |

### 6.5 跨仓 Rust 依赖绑定表

| 依赖仓库 | 全局依赖类型 | 本地路径 | Cargo 引用方式 / 协作方式 | 使用位置 | 不可用时处理 |
|---|---|---|---|---|---|
| `quantalithos-core` | 编译期依赖 | `/home/aris/Projects/quantalithos-core` | `core-contracts = { path = "../quantalithos-core/crates/contracts" }` in workspace root | contracts、domain、application、infra、api、worker、jobs as needed | 暂停依赖 core shared type 的实现 |
| `quantalithos-bus` | 事件协作 / runtime adapter | `/home/aris/Projects/quantalithos-bus` | no Cargo dependency;adapter / fake publisher / subscriber | worker consumer、outbox publisher | use fake publisher / fake envelope seed |
| `quantalithos-method-library` | runtime resolver | `/home/aris/Projects/quantalithos-method-library` | no Cargo dependency;`MethodDefinitionResolverPort` | shape sync、snapshot refresh、method event consumer | use configured fake resolver |
| `quantalithos-work` | runtime / event dependency | `/home/aris/Projects/quantalithos-work` | no Cargo dependency;`WorkContextResolverPort` and `work.context.changed.v1` | profile adoption、timebox binding、work consumer | use fake resolver / event fixture |
| `quantalithos-identity` | runtime resolver | `/home/aris/Projects/quantalithos-identity` | no Cargo dependency;`ActorCapabilityResolverPort` | actor capability snapshot、authorization policy input | use fake actor capability resolver |
| `quantalithos-governance` | runtime / event dependency | `/home/aris/Projects/quantalithos-governance` | no Cargo dependency;`GovernanceDecisionResolverPort` and event fixture | waiting gate decision marker | use fake decision resolver |
| `quantalithos-artifact` | runtime / event dependency | `/home/aris/Projects/quantalithos-artifact` | no Cargo dependency;`ArtifactEvidenceResolverPort` and event fixture | checkpoint / recovery evidence marker | use fake evidence resolver |
| `quantalithos-runtime` | runtime / event dependency | `/home/aris/Projects/quantalithos-runtime` | no Cargo dependency;`RuntimeFeedbackResolverPort` and event fixture | activity feedback marker | use fake runtime feedback resolver |
| `quantalithos-conversation` | runtime / event dependency | `/home/aris/Projects/quantalithos-conversation` | no Cargo dependency;`ConversationContextResolverPort` and event fixture | conversation context marker、timeline | use fake conversation resolver |
| `quantalithos-workspace` | downstream consumer | `/home/aris/Projects/quantalithos-workspace` | no Cargo dependency;outbound event / query consumption | progress dashboard consumption | no implementation dependency;verify via event fixture |
| `quantalithos-observability` | handoff sink | `/home/aris/Projects/quantalithos-observability` | no Cargo dependency;`TraceHandoffPort` | trace handoff job | fake handoff adapter |
| `quantalithos-archive` | handoff sink | `/home/aris/Projects/quantalithos-archive` | no Cargo dependency;`ArchiveHandoffPort` | archive handoff job | fake archive adapter |

### 6.6 Topic / route binding table

| Protocol | Stable name | Config binding | Rule |
|---|---|---|---|
| inbound method event | `method.definition.changed.v1` | `external.method_library` / worker subscription | topic name must match Step 8 |
| inbound work event | `work.context.changed.v1` | `external.work` / worker subscription | no Work Cargo dependency |
| inbound identity event | `identity.actor_capability.changed.v1` | `external.identity` / worker subscription | trusted source actor only in consumer |
| inbound governance event | `governance.decision.changed.v1` | `external.governance` / worker subscription | no automatic resume |
| inbound artifact event | `artifact.evidence.changed.v1` | `external.artifact` / worker subscription | no artifact body |
| inbound runtime event | `runtime.activity_feedback.v1` | `external.runtime` / worker subscription | no execution body |
| inbound conversation event | `conversation.context.changed.v1` | `external.conversation` / worker subscription | no conversation body |
| outbound process events | Step 8 `process.*.v1` topics | `outbox.topic_map` | breaking payload change requires new topic suffix |
| command / query RPC | Step 8 RPC names | API route / RPC adapter config | transport path may change,DTO must not |
| jobs | Step 8 job names | scheduler / jobs runner config | job input DTO owns scope and idempotency key |

### 6.7 Config validation rules

| Rule | Failure handling |
|---|---|
| `store.adapter_kind = Durable` without durable store settings | startup config validation error |
| `boundary.max_page_limit` lower than 1 | startup config validation error |
| idempotency retention shorter than configured retry / redelivery window | startup config validation error |
| outbox publisher enabled without topic mapping for every `ProcessOutboxEventKind` | startup config validation error |
| handoff target enabled without destination ref / endpoint | startup config validation error |
| resolver / publisher / handoff adapter configured as `Controlled` but missing controlled endpoint ref | startup config validation error |
| resolver adapter configured as real endpoint but missing endpoint / credential reference | startup config validation error |
| `integration-like` profile uses `Fake` for a seam that is declared controlled in the profile | startup config validation error;profile must not hide configured seam failure behind fake success |
| feature flag tries to change truth ownership or enable cross-repo Cargo dependency | startup config validation error / design violation |
| config includes raw source body allow-list | reject config;Process never stores external body |

---

## 7. 回填草稿

> 校准来源:
> - `design-calibration/03_ddd_step_14_config_external_binding.md`
>
> 延伸阅读:
> - Step 3 compile/runtime dependency constraints
> - Step 7 port / adapter contracts
> - Step 8 protocol names and topics
> - Step 13 idempotency retention requirements

`03-详细设计.md` §13 必须写入本 Step 的配置引用表、外部依赖绑定表和跨仓 Rust 依赖绑定表。`ProcessRuntimeConfig` 归 `infra/config.rs`,由 `ProcessRuntimeBuilder` 读取并装配 repository、resolver、publisher、handoff、clock 和 id generator adapters。除 `core-contracts` 外,任何相邻仓不得成为 Cargo dependency;运行期依赖、事件协作、下游消费和 handoff 均通过 application port、infra adapter、event DTO、fixture 或 fake 表达。完整配置文件格式、环境变量、secret、profile 合并和数值默认值由后续 `04-配置设计.md` 展开。

---

## 8. 待确认事项

- 无阻塞 Step 15 的待确认事项。
- `04-配置设计.md` 当前尚未生成;本 Step 只固定代码绑定点和 config root 字段。
- Step 15 必须把 config validation、adapter failure、retry / fallback 的日志、指标、trace 和审计切口补齐。
- Step 16 必须加入 config validation、fake adapter wiring、forbidden Cargo dependency scan 和 external body redaction scan 的测试切口。

---

## 9. 完成检查

| 检查项 | 结果 | 说明 |
|---|---|---|
| 配置读取模块明确 | 通过 | `infra` / entry only |
| 外部依赖绑定到 port / adapter | 通过 | resolver、publisher、handoff、store、clock/id 均闭合 |
| 跨仓 Rust dependency 明确 | 通过 | only `core-contracts` |
| 运行期依赖未写成 Cargo dependency | 通过 | 全部 adapter / event / fake |
| retention / retry binding 承接 Step 13 | 通过 | idempotency、outbox、handoff、job config |
| 可进入 Step 15 observability / audit | 通过 | 下一步补日志、指标、trace、审计 |
