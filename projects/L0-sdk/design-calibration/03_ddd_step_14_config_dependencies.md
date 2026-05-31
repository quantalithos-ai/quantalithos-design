# Step 14. 定义配置引用与外部依赖绑定

> 本文件是 `projects/L0-sdk/03-详细设计.md` 的 Step 14 中间产物。
> 本步只收稳 SDK 代码实现中的配置引用、runtime 装配入口、外部依赖注入点和跨仓依赖绑定。
> 本步不写完整 JSON 配置手册，不替代后续 `04-配置设计.md`，也不把运行期服务依赖写成 Cargo path dependency。
> 正式 `03-详细设计.md` 仍在 Step 19 统一回填，本文件不替代正式详细设计。

## 1. Step 状态

- 状态：[x] 已确认
- 对应 SOP：`standards/document/详细设计讨论流程_SOP.md` Step 14
- 回填章节：`projects/L0-sdk/03-详细设计.md` §13 配置引用与外部依赖绑定

---

## 2. 本步输入

| 输入 | 内容 | 本步使用方式 |
|---|---|---|
| `01-架构设计.md` | SDK 是官方客户端接入层；编译期依赖 `L0-core` / `L0-bus`，运行期通过 formal API / fake / fixture / event boundary 协作 | 固定依赖类型和禁止源码依赖服务仓 |
| `02-概要设计.md` §11 | 配置只能影响 source、adapter、job、policy、runner、candidate 验证和语言 profile，不得绕开安全与语义底线 | 固定配置可影响范围 |
| Step 3 编码与运行约束 | 当前目标实现仓位于 `/home/aris/Projects/quantalithos-sdk`，本地 sibling repo 依赖优先 | 固定本地路径依赖策略 |
| Step 4 实现单元与文件布局 | `crates/infra/src/config.rs`、runtime builder、`core-contracts` / `bus-contracts` path dependency | 固定配置类型和 Cargo 依赖落点 |
| Step 5 模块实现契约主轴 | `contracts`、`domain_*`、`application_services`、`application_ports`、`infra_adapters`、`client`、`cli`、`jobs` 等模块 | 固定哪些模块能读配置 |
| Step 7 Trait / Port / Adapter 契约 | source、boundary、runner、repository、projection、artifact、outbox 等 port | 固定外部依赖注入点 |
| Step 11 持久化与一致性 | repository、projection、artifact、outbox、idempotency 的本地状态边界 | 固定 store / artifact / outbox 配置绑定 |
| Step 13 并发与幂等 | command / event / job 幂等、outbox replay、projection rebuild | 固定 retry、timeout 和不可用处理口径 |

已确认结论：

```text
domain 和 application 不直接读取配置文件。
infra_adapters 负责 ConfigLoader / ConfigValidator / RuntimeBuilder 和 adapter 构造。
rust_client_facade 只接收 SdkRuntimeHandle 或构造后的 client profile，不解析原始配置。
cli_entry 和 jobs 可以读取配置源，但必须委托 RuntimeBuilder 装配 ports / services。
编译期 Rust 依赖只允许 core-contracts 和 bus-contracts 使用本地 path dependency。
L1/L2/L3/L4 服务能力、formal API、fake / fixture、bus runtime 和 runner 都是运行期或验证依赖，不能写成 Cargo path dependency。
```

---

## 3. SOP 问题回答

### 3.1 哪些模块需要读取配置？

| 模块 | 是否直接读取配置 | 读取方式 | 说明 |
|---|---|---|---|
| `contracts` | 否 | 不读取 | 只定义 DTO / event / error / package surface 契约 |
| `domain_*` | 否 | 不读取 | 领域对象、policy 和 guard 只接收已构造参数 |
| `application_services` | 否 | 构造函数注入 port、policy、profile | 不解析 JSON / env / CLI flag |
| `application_ports` | 否 | 不读取 | 只定义 trait，不绑定运行环境 |
| `infra_adapters` | 是 | `ConfigLoader`、`ConfigValidator`、`SdkRuntimeBuilder` | 唯一允许集中解析并校验配置的实现层 |
| `rust_client_facade` | 间接 | 接收 `SdkRuntimeHandle`、`ClientFacadeConfig` 派生结果 | 不直接持有 adapter 或配置源 |
| `language_package_surface` | 否 | 由生成结果和 package profile 派生 | Python / TypeScript package 不重新定义平台语义 |
| `cli_entry` | 是，入口级 | 读取 config path / profile，再调用 runtime builder | handler 内不得散落创建 adapter |
| `jobs` | 是，入口级 | 读取 job profile / run id / target，再调用 runtime builder | job runner 不直接绕过 application service |

### 3.2 配置项的类型、默认值和读取位置是什么？

| 配置项 | 类型 | 读取模块 | 默认值 | 详细配置文档位置 |
|---|---|---|---|---|
| `SdkRuntimeConfig.store` | `StoreConfig` | `infra_adapters::config` / `SdkRuntimeBuilder` | `StoreKind::InMemory` 或 local filesystem profile | 后续 `04-配置设计.md` |
| `SdkRuntimeConfig.sources` | `SourceSnapshotConfig` | source adapter builder | local sibling repo / fixture snapshot source | 后续 `04-配置设计.md` |
| `SdkRuntimeConfig.boundaries` | `BoundaryConfig` | formal / fake / bus boundary builder | fake / fixture explicit profile | 后续 `04-配置设计.md` |
| `SdkRuntimeConfig.runners` | `RunnerConfig` | runner adapter builder | local process runner profile | 后续 `04-配置设计.md` |
| `SdkRuntimeConfig.artifacts` | `ArtifactStoreConfig` | artifact store builder | `./artifacts/test` base;run 输出为 `artifacts/test/<run_id>` | 后续 `04-配置设计.md` |
| `SdkRuntimeConfig.outbox` | `OutboxConfig` | outbox adapter builder | in-memory outbox / local file outbox profile | 后续 `04-配置设计.md` |
| `SdkRuntimeConfig.projections` | `ProjectionConfig` | projection adapter builder | in-memory projection / local projection root | 后续 `04-配置设计.md` |
| `SdkRuntimeConfig.language_packages` | `LanguagePackageConfig` | generator / package builder | Rust + Python + TypeScript enabled for P0 candidate | 后续 `04-配置设计.md` |
| `SdkRuntimeConfig.policies` | `PolicyConfig` | policy factory / config validator | redaction / credential / trace / error mapping on | 后续 `04-配置设计.md` |
| `SdkRuntimeConfig.client_facade` | `ClientFacadeConfig` | client runtime constructor | no direct raw config access | 后续 `04-配置设计.md` |
| `SdkRuntimeConfig.cli` | `CliConfig` | `cli_entry` bootstrap | explicit config path or default local profile | 后续 `04-配置设计.md` |
| `SdkRuntimeConfig.jobs` | `JobConfig` | `jobs` bootstrap | explicit job run profile required | 后续 `04-配置设计.md` |

### 3.3 哪些外部依赖需要通过 adapter 注入？

| 外部依赖 | 注入位置 | 使用 port / adapter |
|---|---|---|
| `L0-core` contracts | Cargo workspace dependency | `core-contracts` package / `core_contracts` crate |
| `L0-bus` contracts | Cargo workspace dependency | `bus-contracts` package / `bus_contracts` crate |
| core snapshot source | `infra_adapters` source adapter | `CoreContractSourcePort` |
| bus semantic snapshot source | `infra_adapters` source adapter | `BusSemanticSourcePort` |
| formal API snapshot source | `infra_adapters` source adapter | `FormalApiSourcePort` |
| formal API runtime boundary | `infra_adapters` boundary adapter | `FormalApiBoundaryPort` |
| fake / fixture endpoint | `infra_adapters` boundary adapter | `FakeFixtureEndpointPort` |
| bus event runtime boundary | `infra_adapters` boundary adapter | `BusEventBoundaryPort` |
| language generator / package builder | `infra_adapters` runner adapter | `LanguageBindingGeneratorPort` / `PackageBuilderPort` |
| smoke / docs / compatibility / boundary verifier | `infra_adapters` runner adapter | runner ports |
| package artifact store | `infra_adapters` artifact adapter | `PackageArtifactStorePort` |
| SDK truth / projection / outbox store | `infra_adapters` repository adapter | repository / projection / outbox ports |

### 3.4 外部依赖的超时、重试、降级策略是什么？

| 依赖类别 | 超时 | 重试 | 降级 / 失败口径 |
|---|---|---|---|
| compile-time `core-contracts` / `bus-contracts` | 不适用 | 不适用 | 路径不可用时暂停实现，不复制类型 |
| local source snapshot | 文件 I/O 或本地读取 timeout | refresh / freshness job 可重跑 | 标记 stale / unknown，不制造 fresh truth |
| formal API runtime boundary | boundary call timeout | caller 用幂等键显式重试 | 返回 boundary error / diagnostic ref，不写 SDK truth |
| fake / fixture endpoint | fixture call timeout | smoke / docs / boundary job 可重跑 | 保留 fake marker，不得映射为 production success |
| bus event boundary | publish / subscribe timeout | caller / event client 用幂等键重试 | 不生成 bus publication / delivery truth |
| runner / package builder | process timeout | job item 可重跑 | 记录 verification failure / candidate not verified |
| artifact / projection / outbox store | I/O timeout 或版本冲突 | command / job / publisher 按幂等和版本重试 | fail fast 或保留 pending / stale marker |

### 3.5 哪些配置细节应留给配置设计文档？

| 留给 `04-配置设计.md` 的内容 | 本步只定义什么 |
|---|---|
| 完整 JSON 示例、字段注释、默认配置文件路径 | `SdkRuntimeConfig` 与子 config 的代码绑定点 |
| 每个 source / boundary / runner 的具体字段 | adapter constructor 需要的配置组名 |
| 具体 timeout 数值、retry interval、backoff、batch size | 语义策略和配置挂载点 |
| Python / TypeScript package manager 细节 | `LanguagePackageConfig` 和 runner port |
| fixture 文件目录、测试 profile、报告路径 | fake / fixture 与 evidence 边界 |
| 部署、热更新、环境变量全集 | 不在详细设计展开 |

### 3.6 哪些跨仓 Rust 编译期依赖需要通过本地 path dependency 引入？

| 依赖仓库 | crate / package | 本地路径 | Cargo 引用 |
|---|---|---|---|
| `quantalithos-core` | package `core-contracts` / lib crate `core_contracts` | `/home/aris/Projects/quantalithos-core/crates/contracts` | `core-contracts = { path = "../quantalithos-core/crates/contracts" }` |
| `quantalithos-bus` | package `bus-contracts` / lib crate `bus_contracts` | `/home/aris/Projects/quantalithos-bus/crates/contracts` | `bus-contracts = { path = "../quantalithos-bus/crates/contracts" }` |

### 3.7 哪些运行期依赖或事件协作依赖需要通过 adapter / event / projection / fake 表达？

| 关系 | 表达方式 |
|---|---|
| L1/L2/L3/L4 服务能力 | formal API / SDK runtime boundary / `ServiceCapabilityRef`，不源码依赖服务仓 |
| fake / fixture 验证目标 | `FakeFixtureEndpointPort` + fake marker + evidence |
| bus runtime / broker | `BusEventBoundaryPort` + `BusEventClientView`，不生成 bus delivery truth |
| 上游变化通知 | inbound event consumer + freshness / derived view，不复制上游正文 |
| validation runner | runner port + evidence，不把 runner pass 直接当 stable |
| projection 消费 | read-only projection port，不反写真相 |

### 3.8 依赖仓库不存在时，当前实现应暂停、使用 fixture / fake，还是等待对应仓库完成？

| 依赖 | 不可用时处理 |
|---|---|
| `/home/aris/Projects/quantalithos-core/crates/contracts` | 暂停需要真实编译的实现；不得复制 core 类型 |
| `/home/aris/Projects/quantalithos-bus/crates/contracts` | 暂停需要真实编译的实现；不得复制 bus 类型 |
| L1/L2/L3/L4 服务仓 | 不阻塞 SDK P0；使用 formal API snapshot、fixture 或将能力标记 pending / unsupported |
| fake / fixture endpoint | 不能验证最小接入时，candidate 保持 not verified |
| bus runtime / broker | 使用 fake / local event boundary 或返回 pending，不补造 bus truth |
| package registry | P0 不依赖公共 registry；使用本地 package candidate 和 artifact store |

---

## 4. 当前文档问题诊断

| 问题 | 影响 | 本步处理 |
|---|---|---|
| 概要设计只写配置影响轮廓，没有收敛到代码绑定表 | 实现者可能不知道 `ConfigLoader` / `RuntimeBuilder` 与各 adapter 的关系 | 本步明确 `infra_adapters` 是配置读取和装配正门 |
| formal API / fake / bus boundary 容易被误写成编译期依赖 | SDK 会误依赖服务仓源码或 bus runtime | 本步区分 compile-time path dependency 与 runtime adapter |
| `rust_client_facade` 容易直接持有 adapter 或原始配置 | client facade 会退化成 infra 容器 | 本步规定只接收 `SdkRuntimeHandle` 或派生 profile |
| fake / fixture 成功容易被当作生产可用 | candidate / capability support 会失真 | 本步要求 fake marker 和 evidence 不能被配置关闭 |
| Step 4 已写 path dependency，但 Step 14 尚未形成跨仓绑定总表 | 实现仓 Cargo.toml 容易被扩展到错误 crate | 本步只允许 `core-contracts` 和 `bus-contracts` |

---

## 5. 改动前后对比

| 维度 | 改动前 | 改动后 |
|---|---|---|
| 配置读取 | 只知道配置会影响 adapter / job / policy | 明确读取模块、入口、默认值口径和后续配置文档位置 |
| 依赖分类 | 架构层列了编译期 / 运行期 / 事件协作 | 详细设计映射到 Cargo path、adapter、event、projection、fake |
| runtime 装配 | `RuntimeBuilder` 在 Step 7 被提及 | Step 14 固定为配置进入 ports / services 的唯一装配入口 |
| 服务能力依赖 | formal API / fake boundary 可能混在一起 | formal source、formal boundary、fake boundary、bus boundary 分开绑定 |
| 不可用处理 | 分散在错误、幂等和状态章节 | Step 14 汇总为 pause / stale / pending / not verified / fail fast |

---

## 6. 设计取舍

| 决策点 | 方案 A | 方案 B | 推荐 | 原因 |
|---|---|---|---|---|
| 配置读取位置 | 各模块自行读取配置 | `infra_adapters` 集中 loader / validator / runtime builder | B | 能保护 domain / application 纯粹，也方便统一拒绝越界配置 |
| 运行期服务依赖 | Cargo 直接依赖服务仓 | 通过 formal API / fake / boundary adapter | B | SDK 不拥有服务端 truth，源码依赖会形成错误耦合 |
| fake / fixture 是否可复用 formal boundary | 复用同一 port | 独立 `FakeFixtureEndpointPort` | B | 独立 port 能强制 fake marker，避免伪装生产成功 |
| 是否在 Step 14 写完整 JSON | 写完整配置手册 | 只写代码绑定点，完整 schema 留给配置设计 | B | 本步属于详细设计，不应替代配置设计 |
| 编译期依赖是否扩大到 core / bus domain crate | 直接依赖 domain / application | 只依赖 contracts crate | B | 当前 P0 只确认共享契约，扩大依赖会污染边界 |

---

## 7. 结构化中间产物

### 7.1 配置与依赖注入图

```text
Config file / CLI profile / job profile
  |
  v
[ConfigLoader]
  |
  v
[ConfigValidator]
  |-- reject disabled redaction / fake-as-production / raw secret
  v
[SdkRuntimeBuilder]
  |
  +-- build source adapters       -> CoreContractSourcePort / BusSemanticSourcePort / FormalApiSourcePort
  +-- build boundary adapters     -> FormalApiBoundaryPort / FakeFixtureEndpointPort / BusEventBoundaryPort
  +-- build runner adapters       -> generator / builder / smoke / docs / compatibility / boundary verifier
  +-- build stores                -> repositories / projections / artifact store / outbox / idempotency
  +-- build policy set            -> error / trace / redaction / credential / boundary guard
  v
[Application services]
  |
  v
[SdkRuntimeHandle for client / cli / jobs]
```

关键说明：

- `domain_*` 和 `application_services` 不读取原始配置。
- `ConfigValidator` 必须拒绝绕开 redaction、credential、fake marker、freshness 和 candidate gate 的配置。
- `SdkRuntimeHandle` 暴露 application service handle，不暴露 concrete adapter。
- CLI 和 jobs 可以选择 profile，但不能在 handler 中手工拼 adapter。

### 7.2 配置引用表

| 配置项 | 类型 | 读取模块 | 默认值 | 详细配置文档位置 |
|---|---|---|---|---|
| `SdkRuntimeConfig.store` | `StoreConfig` | `infra_adapters::config` / `SdkRuntimeBuilder` | `StoreKind::InMemory` 或 local filesystem profile | 后续 `04-配置设计.md` |
| `SdkRuntimeConfig.sources` | `SourceSnapshotConfig` | source adapter builder | local sibling repo / fixture snapshot source | 后续 `04-配置设计.md` |
| `SdkRuntimeConfig.boundaries` | `BoundaryConfig` | boundary adapter builder | fake / fixture explicit profile | 后续 `04-配置设计.md` |
| `SdkRuntimeConfig.runners` | `RunnerConfig` | runner adapter builder | local process runner profile | 后续 `04-配置设计.md` |
| `SdkRuntimeConfig.artifacts` | `ArtifactStoreConfig` | artifact store builder | `./artifacts/test` base;run 输出为 `artifacts/test/<run_id>` | 后续 `04-配置设计.md` |
| `SdkRuntimeConfig.outbox` | `OutboxConfig` | outbox adapter builder | in-memory / local file outbox | 后续 `04-配置设计.md` |
| `SdkRuntimeConfig.projections` | `ProjectionConfig` | projection adapter builder | in-memory / local projection root | 后续 `04-配置设计.md` |
| `SdkRuntimeConfig.language_packages` | `LanguagePackageConfig` | generator / package builder | Rust + Python + TypeScript enabled for P0 | 后续 `04-配置设计.md` |
| `SdkRuntimeConfig.policies` | `PolicyConfig` | policy factory / config validator | secure defaults on | 后续 `04-配置设计.md` |
| `SdkRuntimeConfig.cli` | `CliConfig` | `cli_entry` bootstrap | local profile | 后续 `04-配置设计.md` |
| `SdkRuntimeConfig.jobs` | `JobConfig` | `jobs` bootstrap | explicit job run profile | 后续 `04-配置设计.md` |

### 7.3 外部依赖绑定表

| 依赖 | 绑定位置 | 使用接口 | 超时 / 重试 | 降级策略 |
|---|---|---|---|---|
| core contract source | `LocalCoreContractSourceAdapter` | `CoreContractSourcePort` | local I/O retry by job | stale / unknown，不复制 core truth |
| bus semantic source | `LocalBusSemanticSourceAdapter` | `BusSemanticSourcePort` | local I/O retry by job | stale / pending，不定义 bus truth |
| formal API source | `LocalFormalApiSourceAdapter` | `FormalApiSourcePort` | source refresh retry | capability pending / unsupported |
| formal API boundary | `FormalApiHttpBoundaryAdapter` | `FormalApiBoundaryPort` | boundary timeout + caller idempotent retry | boundary error，不写 SDK truth |
| fake / fixture endpoint | `FakeFixtureEndpointAdapter` | `FakeFixtureEndpointPort` | validation job retry | fake marker required，candidate not stable |
| bus event boundary | `BusEventBoundaryAdapter` | `BusEventBoundaryPort` | publish / subscription retry | pending / failed，不补造 bus delivery |
| language generator | `LocalLanguageBindingGenerator` | `LanguageBindingGeneratorPort` | job item retry | candidate remains not built |
| package builder | `LocalPackageBuilder` | `PackageBuilderPort` | job item retry | artifact not attached |
| validation runners | local runner adapters | smoke / docs / compatibility / boundary ports | job item retry | evidence failed / skipped |
| artifact store | `FilesystemPackageArtifactStore` | `PackageArtifactStorePort` | I/O retry by job | orphan artifact不可见，candidate not verified |
| SDK repositories | in-memory / local repository adapters | repository ports + `UnitOfWork` | command / job conflict retry | fail fast / Conflict |
| projections / outbox | projection / outbox adapters | projection ports / `SdkOutboxPort` | rebuild / publish replay | stale / pending marker |

### 7.4 跨仓依赖绑定表

| 依赖仓库 | 全局依赖类型 | 本地路径 | Cargo 引用方式 / 协作方式 | 使用位置 | 不可用时处理 |
|---|---|---|---|---|---|
| `quantalithos-core` | 编译期依赖 | `/home/aris/Projects/quantalithos-core/crates/contracts` | `core-contracts = { path = "../quantalithos-core/crates/contracts" }` | root `Cargo.toml` `[workspace.dependencies]`，contracts / domain / infra 按需使用 | 暂停真实编译实现，不复制类型 |
| `quantalithos-bus` | 编译期依赖 + 事件协作 | `/home/aris/Projects/quantalithos-bus/crates/contracts` | `bus-contracts = { path = "../quantalithos-bus/crates/contracts" }`；bus runtime 走 boundary adapter | root `Cargo.toml`；event client view / bus boundary adapter | contracts 不可用则暂停；runtime 不可用则 pending / fake |
| L1/L2/L3/L4 service repos | 运行期依赖 | `/home/aris/Projects/quantalithos-*` 可作为人工查阅位置 | 不写 Cargo path；通过 formal API / fake / fixture / projection | service client view / formal boundary | repo 不存在不阻塞 P0，能力 pending / unsupported |
| public package registries | 发布阶段依赖 | 不适用 | 当前 P0 不依赖公共 registry | package candidate 后续发布阶段 | 不可用不阻塞，本地 candidate 验证继续 |

### 7.5 配置禁止项

| 禁止配置 | 原因 | 正确表达 |
|---|---|---|
| 关闭 redaction / credential protection | 会泄露 raw secret、payload body 或生产 request / response body | 只允许选择更严格 profile |
| 把 fake success 标记为 production success | 会污染 capability support 和 candidate stable gate | 保留 fake marker，candidate 只能 not stable |
| 把 stale / unknown 配成 fresh | 会制造第二套上游 truth | 重新读取 source 或标记 stale |
| 把 L1/L2/L3/L4 服务仓写成 Cargo path dependency | 会让 SDK 拥有服务端业务 truth | formal API / fake / fixture adapter |
| 配置绕过 compatibility / evidence gate | 会让未验证 candidate 进入 stable | 通过 verification evidence 和 compatibility decision |

---

## 8. 回填草稿

正式 `03-详细设计.md` §13 建议按以下结构回填：

```text
13. 配置引用与外部依赖绑定
  13.1 配置进入系统的唯一入口
  13.2 配置引用表
  13.3 外部依赖绑定表
  13.4 跨仓依赖绑定表
  13.5 配置禁止项与不可用处理
```

回填来源：

| 正式章节 | 回填来源 |
|---|---|
| §13.1 | 本文件 §7.1 |
| §13.2 | 本文件 §7.2 |
| §13.3 | 本文件 §7.3 |
| §13.4 | 本文件 §7.4 |
| §13.5 | 本文件 §7.5 |

说明：

- 如果正式文档需要完整配置字段 schema，应只引用后续 `04-配置设计.md`，不要在 §13 展开成配置手册。
- 如果回填草稿完全引用本文件 §7 的表格和图，正式整理时直接摘录即可，本节不重复粘贴。

---

## 9. 待确认事项

| 待确认项 | 备选方案 | 推荐方案 | 推荐理由 | 当前状态 |
|---|---|---|---|---|
| P0 最小验证目标默认使用 formal API 还是 fake / fixture | A. 固定某个 formal API；B. 允许 fake / fixture explicit profile；C. 两者都必须 | B | 架构层未锁定具体服务，fake / fixture 能支撑最小可验证接入但必须保留 marker | 已按 B 写入 |
| `SdkRuntimeConfig` 是否在详细设计展开完整 JSON | A. 展开；B. 只写代码绑定点 | B | 完整 JSON 属于配置设计，Step 14 只定义实现接线 | 已按 B 写入 |
| 是否允许依赖 L1/L2/L3/L4 service crates | A. 允许；B. 禁止，走 formal API / fake adapter | B | SDK 是官方客户端层，不应源码拥有服务端 truth | 已按 B 写入 |
| `rust_client_facade` 是否能直接读取配置 | A. 允许；B. 只接收 runtime handle / profile | B | 防止 client facade 退化成 infra 容器 | 已按 B 写入 |

---

## 10. 进入下一步条件

进入 Step 15 前必须满足：

- 实现者知道哪些模块能读取配置，哪些模块不能读取配置。
- `SdkRuntimeConfig`、`ConfigLoader`、`ConfigValidator`、`SdkRuntimeBuilder` 的职责边界清楚。
- 编译期依赖只包含 `core-contracts` 和 `bus-contracts` 的本地 path dependency。
- formal API、fake / fixture、bus runtime、runner、artifact、outbox 和 projection 都已绑定到 port / adapter / fake / projection 表达。
- 配置细节已明确留给后续 `04-配置设计.md`，不在 Step 14 过度展开。
