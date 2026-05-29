# Step 14. 定义配置引用与外部依赖绑定

## 1. Step 状态

- 状态：[x] 已确认
- 所属文档：`projects/L0-bus/03-详细设计.md`
- 本步目标：定义 L0-bus 代码实现需要读取哪些配置、配置如何注入 runtime / adapter / job / policy，以及外部依赖如何绑定到 port、adapter、event、projection 或本地 path dependency。
- 本步不直接修改正式 `03-详细设计.md`，只形成中间产物。

---

## 2. 本步输入

| 输入 | 关键结论 | 本步使用方式 |
|---|---|---|
| `standards/document/详细设计讨论流程_SOP.md` Step 14 | 必须输出配置引用表、外部依赖绑定表、跨仓 Rust 依赖绑定表 | 约束本文件结构 |
| `standards/document/详细设计书写规范.md` §5.13 | 本章只写代码绑定点，不写完整配置手册；运行期依赖不得写成 Cargo path dependency | 约束正式文档回填 |
| `projects/L0-bus/01-架构设计.md` | 已确认 `L0-core` 编译期依赖、MQ backend / store 运行期依赖、ports and adapters、in-memory default path | 决定依赖类型 |
| `projects/L0-bus/02-概要设计.md` §11 | 已确认配置影响轮廓、禁止配置化边界、详细设计承接方向 | 决定配置对象和禁止项 |
| `projects/L0-bus/design-calibration/03_ddd_step_03_coding_runtime_constraints.md` | 已确认 `core-contracts` 本地 path dependency，运行期依赖不进 Cargo path | 决定跨仓依赖写法 |
| `projects/L0-bus/design-calibration/03_ddd_step_04_units_file_layout.md` | 已确认 workspace 多 crate 和 `crates/infra/src/config.rs`、runtime builder 等落点 | 决定配置文件落点 |
| `projects/L0-bus/design-calibration/03_ddd_step_07_trait_port_adapter_contracts.md` | 已定义 repository、source、publisher、transport、clock、id generator、unit of work 等 port | 决定外部依赖注入点 |
| `projects/L0-bus/design-calibration/03_ddd_step_13_concurrency_idempotency.md` | 已定义 retry、timeout、source ack、publisher retry、projection 并发等行为 | 决定 retry / timeout / batch / cursor 配置绑定 |

---

## 3. SOP 问题回答

### 3.1 哪些模块需要读取配置？

| 模块 / crate | 是否直接读取配置 | 读取方式 | 说明 |
|---|---|---|---|
| `contracts` | 否 | 不读取 | 只定义 DTO / event / job schema，不绑定运行环境 |
| `domain` | 否 | 不读取 | 领域对象和状态机保持纯粹；policy 只接收已构造参数 |
| `application` | 间接 | 构造函数注入 `RuntimePolicySet`、port trait 和已校验策略 | 不读取文件，不解析 JSON |
| `infra` | 是 | `ConfigLoader`、`ConfigValidator`、`RuntimeBuilder` 读取并校验 | 配置读取、adapter 构造和 in-memory default path 落在本层 |
| `api` | 是，入口级 | 接收 `ApiConfig` 和 application service | 只绑定 timeout、request limit、handler profile，不读 domain 配置 |
| `worker` | 是，入口级 | 接收 `WorkerConfig` 和 consumer service | 绑定 source、backend signal、timeout consumer、worker profile |
| `jobs` | 是，入口级 | 接收 `JobConfig` 和 job runner | 绑定 batch、cursor、retry、projection rebuild、backend capability check |
| `tests` | 是，测试级 | 使用 fixture config / in-memory config | 验证默认路径、配置校验和禁止配置化边界 |

### 3.2 配置项的类型、默认值和读取位置是什么？

本步只定义代码绑定点，不写完整 JSON 配置手册。默认配置遵循 P0 可验证路径：in-memory store、in-memory backend、in-memory source / publisher、deterministic clock / id generator 可替换。

| 配置组 | 类型 | 读取位置 | 默认值口径 |
|---|---|---|---|
| `RuntimeConfig` | root config struct | `bus_infra::config::ConfigLoader` | 聚合各子配置 |
| `StoreConfig` | store adapter config | `bus_infra::runtime_builder::RuntimeBuilder` | `InMemory` |
| `BackendConfig` | transport backend config | `bus_infra::transport` adapter constructor | `InMemory` |
| `OutboxSourceConfig` | inbound source config | `bus_infra::outbox` source adapter | `InMemory` / fixture source |
| `PublisherConfig` | outbound publisher config | `bus_infra::outbox` publisher adapter | `InMemory` sink |
| `ApiConfig` | inbound API config | `bus_api` bootstrap | local HTTP JSON profile，具体框架后续实现决定 |
| `WorkerConfig` | worker loop config | `bus_worker` bootstrap | disabled by default or explicit run profile |
| `JobConfig` | operations job config | `bus_jobs` bootstrap | command-line job profile + safe batch default |
| `ProjectionConfig` | read projection config | projection job / repository constructor | in-memory projection store |
| `RecoveryPolicyConfig` | retry / DLQ / replay policy config | policy factory | conservative retry / no implicit DLQ |
| `SecurityBoundaryConfig` | secret ref / privileged operation references | validator / adapter constructor | ref-only，禁止 raw secret |

### 3.3 哪些外部依赖需要通过 adapter 注入？

| 外部依赖 | 注入位置 | 使用 port / adapter |
|---|---|---|
| L0-core shared contracts | Cargo path dependency | `core-contracts` |
| L0-core committed outbox source | `infra` source adapter -> `application` port | `OutboxFactSourcePort` |
| bus store / persistence | `infra` repository adapter | repository ports + `UnitOfWork` |
| transport backend / MQ backend | `infra` transport adapter | `TransportBackendPort` |
| outbound event bus / publisher | `infra` publisher adapter | `OutboxPublisherPort` |
| clock source | `infra` technical adapter | `ClockPort` |
| ID generator | `infra` technical adapter | `IdGeneratorPort` |
| secret reference resolver | `infra` adapter constructor | config ref / backend capability ref，不进入 domain |
| observability / governance / SDK consumers | event / query / projection 协作 | outbound events、Query API、read-only projection |

### 3.4 外部依赖的超时、重试、降级策略是什么？

| 依赖 | 超时 | 重试 | 降级 |
|---|---|---|---|
| outbox source | poll timeout | source unavailable 时 job retry | 无 source 时 relay job 返回 retryable，不写 bus truth |
| transport backend | dispatch / normalize / health check timeout | backend unavailable 形成 retry candidate | P0 使用 in-memory backend；生产 backend 不可用时不改变 transport semantic |
| outbound publisher | publish timeout | retryable failure 写 evidence 后重试 | rejected schema / boundary 进入人工修复 |
| store / repository | operation timeout | unavailable 可重试，version conflict 由调用方处理 | P0 in-memory；store 不可用时拒绝新状态 |
| projection store | operation timeout | projection job item retry | Query 返回旧 projection / stale marker，不自动 rebuild |
| secret reference resolver | resolution timeout | 按 adapter policy 有限重试 | 不允许回退到 raw secret |
| clock / id generator | 不建议运行期远程依赖 | 测试使用 deterministic fake | 不可用时启动失败或 job 失败 |

### 3.5 哪些配置细节应留给配置设计文档？

| 留给配置说明 / 配置设计的内容 | 本步只定义什么 |
|---|---|
| 完整 JSON 示例、字段注释、环境变量名 | 只定义 `RuntimeConfig` / 子 config 的代码绑定点 |
| 具体 HTTP / MQ / DB 产品参数 | 只定义 adapter config 注入点 |
| 生产 backend endpoint、topic、credential provider | 只定义 ref / profile / secret reference 边界 |
| 具体 retry interval、backoff、batch size 数值 | 只定义 `RetryPolicyConfig`、`JobConfig`、`PublisherConfig` 挂载点 |
| 热更新、配置 reload、部署挂载方式 | 只定义启动时 loader / validator / builder |
| 具体运维告警阈值 | 留给可观测性、测试、验收或运维文档 |

### 3.6 哪些跨仓 Rust 编译期依赖需要通过本地 path dependency 引入？

当前只确认一个编译期依赖：

| 依赖仓库 | crate / package | 本地路径 | Cargo 引用 |
|---|---|---|---|
| `quantalithos-core` | package `core-contracts` / lib crate `core_contracts` | `/home/aris/Projects/quantalithos-core/crates/contracts` | `core-contracts = { path = "../quantalithos-core/crates/contracts" }` |

不在本步扩大到 `core-domain`、`core-application` 或其他 core crate。

### 3.7 哪些运行期依赖或事件协作依赖需要通过 adapter / event / projection / fake 表达？

| 关系 | 表达方式 |
|---|---|
| MQ / transport backend | `TransportBackendPort` + `BackendConfig` + in-memory / fake adapter |
| durable bus store | repository ports + `UnitOfWork` + `StoreConfig` + in-memory adapter |
| 发布方仓 | committed outbox fact / command DTO / source ref，不依赖源码 |
| 订阅方仓 | delivery target ref / backend signal / feedback result，不依赖源码 |
| observability | query / projection / outbound event 消费，不依赖源码 |
| governance | approval ref / audit chain ref / failure material ref，不依赖源码 |
| SDK | Query API / event schema / projection contract，不反向依赖 SDK |

### 3.8 依赖仓库不存在时，当前实现应暂停、使用 fixture / fake，还是等待对应仓库完成？

| 依赖 | 不可用时处理 |
|---|---|
| `quantalithos-core/crates/contracts` | 暂停真实实现；不得复制 core 类型；可用 fixture 只服务文档或测试草案 |
| MQ / production backend | 使用 in-memory transport adapter / fake backend，不阻塞 P0 |
| durable store 产品 | 使用 in-memory repository / UnitOfWork default path，不阻塞 P0 |
| 发布方仓 | 使用 committed outbox fact fixture / source adapter fake |
| 订阅方仓 | 使用 backend signal fixture / in-memory subscriber fake |
| observability / governance / SDK | 不阻塞 P0；通过 event / projection / refs 预留协作边界 |

---

## 4. 当前文档问题诊断

| 问题 | 影响 | 本步处理 |
|---|---|---|
| 概要设计只给配置影响轮廓，没有代码绑定点 | 实现者不知道配置在哪个 crate 读取、传给谁 | 本步定义 `infra` loader / validator / runtime builder 和入口 config |
| Step 3 已确认 `core-contracts` path dependency，但 Step 14 尚未写入跨仓依赖表 | 实现者可能扩大 core 编译期依赖 | 本步只保留 `core-contracts` |
| 运行期依赖容易被误写成 Cargo dependency | 会造成 domain / application 直接依赖 MQ / DB SDK | 本步明确 MQ、store、publisher、source 都走 port / adapter |
| in-memory default path 已被多处提及，但配置入口未集中 | P0 难以启动和测试 | 本步定义默认 `InMemory` profile 和 fake / fixture 策略 |
| 禁止配置化边界尚未落到 validator / builder | 配置可能绕过 payload、secret、projection、audit 红线 | 本步要求 `ConfigValidator` 和 `RuntimeBuilder` 拒绝违规配置 |

---

## 5. 改动前后对比

| 维度 | 改动前 | 改动后 |
|---|---|---|
| 配置读取 | 只知道哪些能力受配置影响 | 明确只有 `infra`、入口 bootstrap、job / worker 读取配置 |
| Domain 与配置 | 概要中说不直接读取 | 详细设计明确 domain object 零配置依赖，policy 由 factory 构造 |
| 外部依赖 | 架构层列出依赖类型 | 详细设计映射到 port / adapter / event / projection / fake |
| 编译期依赖 | Step 3 / 4 已提到 core | Step 14 给出正式跨仓 Rust 依赖绑定表 |
| 运行期依赖 | 容易混入 Cargo.toml | 明确不得写 Cargo path dependency |
| 配置细节 | 容易提前写完整 JSON | 本步只写代码绑定点，完整填写说明留给 04 配置说明 |

---

## 6. 设计取舍

### 6.1 配置读取放在哪一层

| 方案 | 说明 | 结论 |
|---|---|---|
| 方案 A：各模块自己读取配置 | 简单直接，但配置会散落到 domain / application / adapter | 不采用 |
| 方案 B：`infra` 统一 loader / validator / runtime builder，入口只接收已校验 config | 推荐 |
| 方案 C：只用环境变量，不定义 config struct | 难以测试和审计配置边界 | 不采用 |

推荐方案 B。它能保证 domain 纯粹，并让禁止配置化边界集中校验。

### 6.2 是否在详细设计中写完整 JSON 配置示例

| 方案 | 说明 | 结论 |
|---|---|---|
| 方案 A：写完整 JSON | 直观，但会替代 04 配置说明 | 不采用 |
| 方案 B：只写 config struct / binding / 默认 profile，JSON 示例留给 04 | 推荐 |
| 方案 C：完全不写配置对象 | 实现者不知道如何装配 adapter | 不采用 |

推荐方案 B。本步是详细设计中的代码绑定契约，不是配置手册。

### 6.3 运行期依赖是否进入 Cargo dependency

| 方案 | 说明 | 结论 |
|---|---|---|
| 方案 A：MQ / DB SDK 直接进入 application / domain | 会破坏 ports and adapters | 不采用 |
| 方案 B：运行期依赖只在 `infra` adapter 中出现，application 只依赖 port trait | 推荐 |
| 方案 C：暂时完全不定义运行期依赖 | 无法实现默认可验证路径 | 不采用 |

推荐方案 B。P0 可以用 in-memory adapter，后续生产 adapter 只替换 infra。

### 6.4 缺失生产后端时是否阻塞 P0

| 方案 | 说明 | 结论 |
|---|---|---|
| 方案 A：等待生产 MQ / durable store 完成 | 会阻塞核心闭环验证 | 不采用 |
| 方案 B：使用 in-memory default path / fake / fixture，保持同语义 | 推荐 |
| 方案 C：临时把后端语义写死进 domain | 会污染 transport semantic | 不采用 |

推荐方案 B。它符合架构已确认的 default verifiable path。

---

## 7. 结构化中间产物

### 7.1 配置与依赖注入图

```text
RuntimeConfig JSON / fixture / test profile
  |
  v
ConfigLoader
  |
  v
ConfigValidator
  |-- reject forbidden config boundary
  v
RuntimeBuilder
  |
  +-- build repositories / UnitOfWork from StoreConfig
  +-- build TransportBackendPort from BackendConfig
  +-- build OutboxFactSourcePort from OutboxSourceConfig
  +-- build OutboxPublisherPort from PublisherConfig
  +-- build policy set from PolicyConfig
  +-- build Api / Worker / Job entrypoints from entry configs
  v
Application services
```

关键说明：

- `domain` 不读取配置文件，也不依赖 `RuntimeConfig`。
- `application` 只接收已构造 port、policy 和 profile，不解析 JSON。
- `infra` 负责 loader、validator、runtime builder 和 adapter 构造。
- 禁止配置化边界必须在 `ConfigValidator` 和 `RuntimeBuilder` 双重限制。

### 7.2 配置引用表

| 配置项 | 类型 | 读取模块 | 默认值 | 详细配置文档位置 |
|---|---|---|---|---|
| `RuntimeConfig.store` | `StoreConfig` | `bus_infra::runtime_builder` | `StoreKind::InMemory` | 后续 `04-配置说明.md` |
| `RuntimeConfig.backend` | `BackendConfig` | `bus_infra::transport` | `BackendKind::InMemory` | 后续 `04-配置说明.md` |
| `RuntimeConfig.outbox_source` | `OutboxSourceConfig` | `bus_infra::outbox::source` | `OutboxSourceKind::InMemoryFixture` | 后续 `04-配置说明.md` |
| `RuntimeConfig.publisher` | `PublisherConfig` | `bus_infra::outbox::publisher` | `PublisherKind::InMemorySink` | 后续 `04-配置说明.md` |
| `RuntimeConfig.api` | `ApiConfig` | `bus_api` bootstrap | local HTTP JSON profile | 后续 `04-配置说明.md` |
| `RuntimeConfig.worker` | `WorkerConfig` | `bus_worker` bootstrap | explicit run profile required | 后续 `04-配置说明.md` |
| `RuntimeConfig.jobs` | `JobConfig` | `bus_jobs` bootstrap | CLI args + safe batch default | 后续 `04-配置说明.md` |
| `RuntimeConfig.projection` | `ProjectionConfig` | `bus_infra::projection` / jobs | in-memory projection store | 后续 `04-配置说明.md` |
| `RuntimeConfig.recovery_policy` | `RecoveryPolicyConfig` | policy factory | conservative retry, no implicit DLQ | 后续 `04-配置说明.md` |
| `RuntimeConfig.security_boundary` | `SecurityBoundaryConfig` | `ConfigValidator` / adapter constructor | ref-only, raw secret rejected | 后续 `04-配置说明.md` |
| `RuntimeConfig.clock` | `ClockConfig` | `bus_infra::technical` | system clock; tests can use deterministic fake | 后续 `04-配置说明.md` |
| `RuntimeConfig.id_generator` | `IdGeneratorConfig` | `bus_infra::technical` | deterministic fake allowed in tests | 后续 `04-配置说明.md` |

### 7.3 Config struct 契约

```rust
/// L0-bus 运行时配置根对象。
///
/// 只用于启动和装配，不得传入 domain object。
pub struct RuntimeConfig {
    /// Store 和 UnitOfWork adapter 配置。
    pub store: StoreConfig,
    /// Transport backend adapter 配置。
    pub backend: BackendConfig,
    /// L0-core outbox source adapter 配置。
    pub outbox_source: OutboxSourceConfig,
    /// Outbound event publisher adapter 配置。
    pub publisher: PublisherConfig,
    /// API 入口配置。
    pub api: ApiConfig,
    /// Worker 入口配置。
    pub worker: WorkerConfig,
    /// Operations job 配置。
    pub jobs: JobConfig,
    /// Projection 读模型配置。
    pub projection: ProjectionConfig,
    /// Recovery policy 配置引用。
    pub recovery_policy: RecoveryPolicyConfig,
    /// 安全边界和 secret reference 配置。
    pub security_boundary: SecurityBoundaryConfig,
    /// Clock adapter 配置。
    pub clock: ClockConfig,
    /// ID generator adapter 配置。
    pub id_generator: IdGeneratorConfig,
}

/// Store adapter 配置。
pub struct StoreConfig {
    /// Store 类型。
    pub kind: StoreKind,
    /// 连接引用；P0 in-memory 可为空。
    pub connection_ref: Option<ConnectionRef>,
}

/// Transport backend adapter 配置。
pub struct BackendConfig {
    /// 后端类型。
    pub kind: BackendKind,
    /// 后端能力 profile 引用。
    pub capability_profile_ref: BackendProfileRef,
    /// secret 引用，不保存 raw secret。
    pub secret_ref: Option<SecretRef>,
    /// 后端调用 timeout profile。
    pub timeout_profile: TimeoutProfileRef,
}

/// Operations job 配置。
pub struct JobConfig {
    /// 单批处理数量。
    pub batch_size: PageLimit,
    /// job cursor profile。
    pub cursor_profile: CursorProfileRef,
    /// job item retry profile。
    pub retry_profile: RetryProfileRef,
}
```

必须提供的函数：

| 函数签名 | 作用 | 关键规则 |
|---|---|---|
| `ConfigLoader::load(ConfigSource source) -> Result<RuntimeConfig, ConfigError>` | 从文件、fixture 或测试 profile 加载配置 | 不在 domain 层调用 |
| `ConfigValidator::validate(RuntimeConfig config) -> Result<ValidatedRuntimeConfig, ConfigError>` | 校验配置和禁止配置化边界 | 拒绝 raw secret、payload body enabled、projection truth write enabled 等 |
| `RuntimeBuilder::build(ValidatedRuntimeConfig config) -> Result<RuntimeGraph, ConfigError>` | 构造 repository、adapter、service 和入口 | 不把 config object 传给 domain object |
| `RuntimeBuilder::build_policy_set(ValidatedRuntimeConfig config) -> Result<RuntimePolicySet, ConfigError>` | 构造 `PayloadBoundaryGuard`、`RecoveryEligibilityPolicy` 等 policy | policy 接收已校验参数或 ref |

### 7.4 `ConfigError` 契约

```rust
/// 配置错误。
///
/// 用于表达加载、校验、禁止配置化边界和依赖绑定失败。
pub enum ConfigError {
    /// 配置来源不存在或不可读。
    SourceUnavailable,
    /// 配置格式非法。
    InvalidFormat,
    /// 必填配置缺失。
    MissingRequiredField,
    /// 配置值不兼容当前 P0 范围。
    UnsupportedProfile,
    /// 配置尝试开启禁止配置化边界。
    ForbiddenBoundaryOverride,
    /// secret 引用缺失或解析失败。
    SecretReferenceInvalid,
    /// 跨仓本地依赖路径不存在。
    LocalDependencyMissing,
}
```

### 7.5 禁止配置化校验表

| 禁止配置项 / 行为 | 检测位置 | 失败错误 | 说明 |
|---|---|---|---|
| 允许保存 payload body | `ConfigValidator` | `ConfigError::ForbiddenBoundaryOverride` | bus 只能保存 payload ref / digest |
| 允许保存 backend private body | `ConfigValidator` / backend adapter constructor | `ForbiddenBoundaryOverride` | 后端结果必须归一化 |
| 关闭关键 audit / history | `ConfigValidator` | `ForbiddenBoundaryOverride` | 状态变化必须可追溯 |
| projection 反写 truth | `ConfigValidator` / `ReadOnlyOutputPolicy` | `ForbiddenBoundaryOverride` | projection 只读 |
| replay 绕过 DLQ / audit chain | `ConfigValidator` / policy factory | `ForbiddenBoundaryOverride` | replay preparation 不是 executor |
| backend raw status 直接写 delivery | backend adapter constructor | `ForbiddenBoundaryOverride` | 必须通过 normalize |
| raw secret 写入配置正文 | `ConfigLoader` / `ConfigValidator` | `SecretReferenceInvalid` | 只能保存 `SecretRef` |
| `CheckBackendCapability` 自动改写 delivery truth | `ConfigValidator` | `ForbiddenBoundaryOverride` | capability check 只更新 health view / audit |

### 7.6 外部依赖绑定表

| 依赖 | 绑定位置 | 使用接口 | 超时 / 重试 | 降级策略 |
|---|---|---|---|---|
| L0-core committed outbox source | `bus_infra::outbox::source` | `OutboxFactSourcePort.poll_committed` / `ack_consumed` | poll timeout；source unavailable job retry | fixture / in-memory source |
| Bus store / persistence | `bus_infra::repositories` / `bus_infra::uow` | repository ports + `UnitOfWork` | operation timeout；unavailable retry | in-memory store default |
| Transport backend / MQ backend | `bus_infra::transport` | `TransportBackendPort.dispatch` / `normalize_signal` / `check_capability` | dispatch / signal / health timeout；backend unavailable retry candidate | in-memory backend default |
| Outbound event publisher | `bus_infra::outbox::publisher` | `OutboxPublisherPort.publish` / `publish_batch` | publish timeout；retryable evidence | in-memory sink default |
| Projection store | `bus_infra::projection` | `ReadProjectionRepository` | operation timeout；projection job retry | stale marker / in-memory projection |
| Clock source | `bus_infra::technical` | `ClockPort.now` | local call | deterministic fake in tests |
| ID generator | `bus_infra::technical` | `IdGeneratorPort.next_id` | local call | deterministic fake in tests |
| Secret reference resolver | backend / publisher adapter constructor | `SecretRef` resolution | resolution timeout；no raw fallback | startup failure or adapter disabled |
| Observability consumer | outbound event / logs / metrics | events, projection, audit | 不由本仓调用 | 不阻塞 bus truth |
| Governance consumer | refs / query / audit chain | approval ref, audit chain ref, failure material ref | 不由本仓直接调用 | missing approval leads conflict |
| SDK consumer | HTTP JSON / event schema | Query API, outbound events | 不由本仓调用 | 不阻塞 P0 |

### 7.7 跨仓 Rust 依赖绑定表

| 依赖仓库 | 全局依赖类型 | 本地路径 | Cargo 引用方式 / 协作方式 | 使用位置 | 不可用时处理 |
|---|---|---|---|---|---|
| `quantalithos-core` | 编译期依赖 | `/home/aris/Projects/quantalithos-core` | `core-contracts = { path = "../quantalithos-core/crates/contracts" }` | 根 `Cargo.toml` `[workspace.dependencies]`；`contracts` / `application` / `api` / `worker` / `jobs` 按需 `workspace = true` | 暂停真实实现；不得复制 core 类型 |
| MQ backend | 运行期依赖 | 不适用 | 通过 `TransportBackendPort` + `BackendConfig` + in-memory / production adapter 协作 | `infra` adapter | 使用 in-memory adapter，不阻塞 P0 |
| Bus store | 运行期依赖 | 不适用 | 通过 repository ports + `StoreConfig` + `UnitOfWork` 协作 | `infra` repositories / uow | 使用 in-memory store，不阻塞 P0 |
| 发布方仓 | 事件协作依赖 | 不适用 | committed outbox fact、publish command、source ref | `worker` / `contracts` | 使用 fixture source |
| 订阅方仓 | 事件协作依赖 | 不适用 | backend signal、feedback command、delivery target ref | `api` / `worker` / `infra` | 使用 fixture / in-memory backend |
| Observability / governance / SDK | 运行期或事件协作依赖 | 不适用 | Query API、projection、outbound event、audit material | `api` / `contracts` / `infra` projection | 不阻塞 P0 |

### 7.8 RuntimeBuilder 输出契约

| 输出对象 | 来源配置 | 作用 |
|---|---|---|
| `RuntimeGraph.publication_service` | store、policy、publisher config | 处理 publication acceptance |
| `RuntimeGraph.delivery_service` | store、backend、worker config | 处理 delivery progression |
| `RuntimeGraph.feedback_service` | store、api / worker config | 处理 feedback / signal / timeout |
| `RuntimeGraph.recovery_service` | store、recovery policy、job config | 处理 retry / DLQ / replay preparation |
| `RuntimeGraph.read_output_service` | projection、store、query config | 处理 projection 和 read-only output |
| `RuntimeGraph.api_handlers` | api config + services | 暴露 HTTP JSON handler |
| `RuntimeGraph.worker_handlers` | worker config + services + source / backend adapters | 消费 outbox fact、backend signal、timeout |
| `RuntimeGraph.job_runners` | job config + services | 运行 operations jobs |

---

## 8. 回填草稿

正式 `03-详细设计.md` 的 §13 按以下方式回填：

```md
## 13. 配置引用与外部依赖绑定

### 13.1 配置与依赖注入图

从 `design-calibration/03_ddd_step_14_config_dependencies.md` §7.1 摘录。

### 13.2 配置引用表

从 `design-calibration/03_ddd_step_14_config_dependencies.md` §7.2 摘录。

### 13.3 Config struct 与 ConfigError 契约

从 `design-calibration/03_ddd_step_14_config_dependencies.md` §7.3~§7.4 摘录。

### 13.4 禁止配置化校验表

从 `design-calibration/03_ddd_step_14_config_dependencies.md` §7.5 摘录。

### 13.5 外部依赖绑定表

从 `design-calibration/03_ddd_step_14_config_dependencies.md` §7.6 摘录。

### 13.6 跨仓 Rust 依赖绑定表

从 `design-calibration/03_ddd_step_14_config_dependencies.md` §7.7 摘录。

### 13.7 RuntimeBuilder 输出契约

从 `design-calibration/03_ddd_step_14_config_dependencies.md` §7.8 摘录。
```

说明：

- 正式文档不写完整 JSON 配置示例。
- 正式文档必须明确：只有 `core-contracts` 是 P0 编译期 path dependency。
- 正式文档必须明确：MQ backend、bus store、publisher、source、observability、governance、SDK 都不是 Cargo path dependency。
- 后续 `04-配置说明.md` 应继续定义 JSON 示例、字段说明、默认值和部署填写方式。

---

## 9. 待确认事项

| 待确认事项 | 方案 | 推荐 | 原因 |
|---|---|---|---|
| 是否现在创建完整 `04-配置说明.md` | A. 现在创建；B. 详细设计 Step 14 只定义绑定点，后续单独创建 04；C. 不需要配置说明 | 推荐 B | 详细设计不替代配置说明，但必须为 04 提供实现绑定输入 |
| 是否扩大 core 编译期依赖到 `core-domain` / `core-application` | A. 扩大；B. 只保留 `core-contracts`；C. 临时复制类型 | 推荐 B | bus 当前只需要共享契约，扩大依赖会提高耦合 |
| API / worker 是否立即固定具体 HTTP / async runtime 框架 | A. 固定；B. Step 14 只写 config 和 entry binding，具体框架实施阶段选择；C. 不提供 API / worker 配置 | 推荐 B | P0 需要绑定点，不需要在设计中提前锁死框架 |
| production MQ / durable store 不存在时是否阻塞 P0 | A. 阻塞；B. 使用 in-memory default path；C. 临时绕过 store | 推荐 B | 架构已确认默认可验证路径，不能绕过 store 语义 |
| raw secret 是否允许通过配置文件直接填写 | A. 允许；B. 禁止，只允许 `SecretRef`；C. 测试环境允许 | 推荐 B | 测试也应使用 fake secret ref，不能培养错误实现习惯 |

---

## 10. 进入下一步条件

```text
实现者知道哪些模块读取哪些配置，以及外部依赖如何绑定到代码。
配置读取、配置校验、runtime builder、adapter 注入、跨仓 path dependency、运行期依赖和事件协作依赖均已定义。
可以进入 Step 15,定义可观测性与审计埋点契约。
```
