# Step 14. 定义配置引用与外部依赖绑定

## 1. Step 状态

- 状态: `[x] 已完成`
- 对应 SOP: `standards/document/详细设计讨论流程_SOP.md` Step 14
- 回填章节: `projects/L1-conversation/03-详细设计.md` §13 配置引用与外部依赖绑定

---

## 2. 本步输入

| 输入 | 内容 | 本步使用方式 |
|---|---|---|
| `02_hld_step_11_configuration_impact.md` | 配置影响轮廓和禁止配置化边界 | 作为配置绑定边界来源 |
| `03_ddd_step_03_coding_runtime_constraints.md` | Rust runtime、本地 sibling repo、path dependency 与运行期依赖约束 | 作为跨仓依赖绑定来源 |
| `03_ddd_step_04_units_file_layout.md` | `infra` / `api` / `worker` / `jobs` / scripts / reports 布局 | 作为配置读取模块来源 |
| `03_ddd_step_07_trait_port_adapter_contracts.md` | repository、resolver、publisher、handoff、technical port 契约 | 作为外部依赖注入来源 |
| `03_ddd_step_08_protocol_contracts.md` | Command / Query / Event / Job envelope 和 9 个 operations job | 作为 job config 与 entry config 来源 |
| `03_ddd_step_13_concurrency_idempotency.md` | 幂等窗口、retry、job 重入保护 | 作为 retry / retention / timeout 配置引用来源 |
| `standards/document/详细设计书写规范.md` §5.13 | 配置引用与外部依赖绑定格式 | 作为输出格式约束 |

当前没有正式 `projects/L1-conversation/04-配置设计.md`。本步只定义代码绑定点和详细配置文档应承接的位置,不补写完整配置说明、JSON 示例或默认值矩阵。

---

## 3. SOP 问题回答

### 3.1 哪些模块需要读取配置？

| 模块 | 是否直接读取配置 | 原因 |
|---|---|---|
| `crates/infra` | 是 | repository、store、resolver、publisher、handoff adapter 和 runtime builder 由配置装配 |
| `crates/api` | 是 | command / query intake 需要 profile、endpoint、metadata / auth adapter 和 error mapping 装配 |
| `crates/worker` | 是 | inbound event consumer、outbox relay 和 projection worker 需要 event source、batch、retry、timeout |
| `crates/jobs` | 是 | 9 个 operations job 需要 job profile、batch、retry、timeout、report output ref |
| `crates/application` | 间接 | 只接收已构造 repository / port / policy 参数,不读取配置源 |
| `crates/domain` | 否 | domain object、state enum 和 invariant 不直接读取配置 |
| `crates/contracts` | 否 | DTO / event / job schema 不读取运行配置 |

### 3.2 配置项的类型、默认值和读取位置是什么？

见 §6.1。默认值只写详细设计绑定口径,完整 JSON 示例、环境变量、默认值矩阵和 profile 展开必须放到待创建的 `04-配置设计.md`。

### 3.3 哪些外部依赖需要通过 adapter 注入？

需要 adapter 注入的依赖包括:

- identity actor resolver
- work / governance / artifact / runtime / bridge external fact resolver
- bus / event collaboration publisher
- inbound event source adapter
- observability trace handoff adapter
- archive handoff adapter
- storage / projection / snapshot / outbox / idempotency adapters
- clock、id generator、unit of work 技术 adapter

### 3.4 外部依赖的超时、重试、降级策略是什么？

| 依赖类别 | 超时 / 重试口径 | 降级策略 |
|---|---|---|
| resolver | 有超时;只对 transient failure 重试 | unresolved / stale marker,不补造来源 truth |
| publisher | 有超时;按 outbox retry policy 重试 | outbox `RetryPending` / `Failed`,不回滚 truth |
| handoff | 有超时;按 handoff retry policy 重试 | handoff `RetryPending` / `Failed`,不反写 fact |
| repository / store | 不做外部网络重试假设;按 adapter 错误返回 | transaction rollback 或 degraded projection marker |
| job runner | 按 job retry / idempotency 保护 | failed job receipt、report ref 或 skipped marker |

### 3.5 哪些配置细节应留给配置设计文档？

以下内容不进入本 Step:

- JSON 完整配置 demo、模块级配置 demo 和字段逐项说明。
- 环境变量名、secret 名称、密钥系统、文件路径和加载顺序。
- profile 矩阵、本地 / CI / staging / production 默认值。
- batch size、timeout、retry backoff、retention window 的具体数值。
- adapter constructor 的完整字段和部署 / 运维说明。

### 3.6 哪些跨仓 Rust 编译期依赖需要通过本地 path dependency 引入？

只有 `quantalithos-core` 的 `core-contracts`:

```toml
[workspace.dependencies]
core-contracts = { path = "../quantalithos-core/crates/contracts" }
```

其他仓库全部是运行期依赖、事件协作依赖、下游消费关系或 handoff 关系,不得写成 Cargo path dependency。

### 3.7 哪些运行期依赖或事件协作依赖需要通过 adapter / event / projection / fake 表达？

见 §6.2 和 §6.3。`L0-bus`、`L1-identity`、`L1-work`、`L1-governance`、`L1-artifact`、`L2-runtime`、`L6-bridges`、`L4-observability` 和 `L4-archive` 都必须通过 adapter、event、projection、handoff 或 fake 表达。

### 3.8 依赖仓库不存在时，当前实现应暂停、使用 fixture / fake，还是等待对应仓库完成？

| 依赖类型 | 不可用时处理 |
|---|---|
| 编译期 `core-contracts` | 暂停依赖真实类型的实现,不得复制上游类型 |
| 运行期 resolver / handoff / publisher | P0 可使用 configured fake / fixture adapter,但测试必须保留 failure / unresolved / retry 口径 |
| 事件协作 | P0 可使用 fake event source / fake publisher,不得引入对应仓源码依赖 |
| 下游消费方 | 不阻塞本仓实现;通过 contracts、query、event 和 projection surface 验证 |

## 4. 当前文档问题诊断

| 问题 | 影响 | 本步处理 |
|---|---|---|
| `04-配置设计.md` 当前不存在 | 实现者可能误以为无需配置或自行发明配置结构 | 本步明确代码绑定点,并标注详细配置文档待创建位置 |
| 概要设计只给配置影响轮廓 | 缺少配置项、读取模块和默认绑定口径 | 本步落成配置引用表 |
| Step 7 给了 adapter,但未给配置装配关系 | 实现者可能在 service / domain 内直接读取配置 | 本步明确配置只进入 infra / api / worker / jobs / runtime builder |
| Step 3 已禁止运行期依赖写 Cargo dependency | Step 14 若不复述,实现阶段容易误加 path dependency | 本步单列跨仓 Rust 依赖绑定表 |
| Job retry / retention 来自 Step 13 | 若不绑定配置,job 重跑策略无法实现 | 本步把 retry、retention、batch、timeout 作为配置引用 |

## 5. 设计取舍

| 议题 | 方案 | 取舍 |
|---|---|---|
| 是否在详细设计中写完整配置文件 | A. 写完整 JSON;B. 只写代码绑定点,完整配置留给 04 | 采用 B。符合详细设计边界,也避免在没有配置 SOP 中间产物时提前定死字段 |
| 配置读取位置 | A. domain / service 随用随读;B. loader / validator / runtime builder 统一装配 | 采用 B。保护 domain 纯净,application 只接收已构造依赖 |
| 外部来源仓依赖方式 | A. Cargo path dependency;B. resolver / event / fake adapter | 采用 B。防止来源 truth 类型进入本仓源码依赖 |
| P0 默认 store | A. 直接指定数据库;B. in-memory / future durable adapter | 采用 B。Step 11 未指定具体数据库,P0 先以 adapter 契约保证行为 |
| 不可用外部依赖 | A. 阻断全部实现;B. 编译期依赖阻断,运行期依赖可 fake / fixture | 采用 B。保证本仓可先落本地闭环,但不得伪装外部成功 |

## 6. 结构化中间产物

### 6.1 配置引用表

| 配置项 | 类型 | 读取模块 | 默认值 | 详细配置文档位置 |
|---|---|---|---|---|
| `runtime.profile` | `RuntimeProfile` | `infra::runtime_builder`、`api`、`worker`、`jobs` | `local` | 待创建 `04-配置设计.md` §运行 profile |
| `storage.truth_store` | `StoreConfig` | `infra::repositories`、`infra::runtime_builder` | `in_memory` | 待创建 `04-配置设计.md` §存储配置 |
| `storage.projection_store` | `StoreConfig` | `infra::projection_stores` | `in_memory` | 待创建 `04-配置设计.md` §派生存储配置 |
| `storage.snapshot_store` | `StoreConfig` | `infra::snapshot_stores` | `in_memory` | 待创建 `04-配置设计.md` §外部引用 / 快照存储 |
| `storage.outbox_store` | `StoreConfig` | `infra::repositories`、`worker::outbox_relay` | `in_memory` | 待创建 `04-配置设计.md` §outbox 配置 |
| `storage.idempotency_store` | `StoreConfig` | `infra::repositories`、`application::idempotency` via injected repo | `in_memory` | 待创建 `04-配置设计.md` §幂等配置 |
| `api.command_intake` | `EntryConfig` | `api::command_handlers`、`infra::runtime_builder` | enabled local adapter | 待创建 `04-配置设计.md` §入口配置 |
| `api.query_intake` | `EntryConfig` | `api::query_handlers`、`infra::runtime_builder` | enabled local adapter | 待创建 `04-配置设计.md` §入口配置 |
| `worker.inbound_event_sources` | `EventSourceConfig` | `worker::event_consumers` | fake / disabled until configured | 待创建 `04-配置设计.md` §事件输入配置 |
| `outbox.publisher` | `PublisherConfig` | `infra::outbox_publisher`、`worker::outbox_relay` | fake publisher | 待创建 `04-配置设计.md` §outbox publisher 配置 |
| `resolver.actor` | `ResolverConfig` | `infra::source_resolvers` | fake unresolved-capable adapter | 待创建 `04-配置设计.md` §identity resolver 配置 |
| `resolver.external_fact_sources` | `SourceResolverConfigMap` | `infra::source_resolvers`、`jobs::snapshot_refresh` | empty map -> unresolved | 待创建 `04-配置设计.md` §外部事实 resolver 配置 |
| `handoff.trace` | `HandoffConfig` | `infra::handoff_adapters`、`jobs::handoff_delivery` | fake handoff adapter | 待创建 `04-配置设计.md` §observability handoff 配置 |
| `handoff.archive` | `HandoffConfig` | `infra::handoff_adapters`、`jobs::handoff_delivery` | fake archive adapter | 待创建 `04-配置设计.md` §archive handoff 配置 |
| `jobs.batch_limits` | `JobBatchConfig` | `jobs::*`、`worker::outbox_relay` | safe small batch | 待创建 `04-配置设计.md` §job 配置 |
| `jobs.retry_policy` | `RetryPolicyConfig` | `jobs::*`、`worker::outbox_relay` | retry enabled for transient only | 待创建 `04-配置设计.md` §重试配置 |
| `jobs.timeout_policy` | `TimeoutPolicyConfig` | `jobs::*`、resolver / publisher / handoff adapters | required per adapter | 待创建 `04-配置设计.md` §超时配置 |
| `retention.idempotency_windows` | `RetentionWindowConfig` | `infra::repositories`、`application::idempotency` via injected repo | command / consumer / job windows required | 待创建 `04-配置设计.md` §幂等 retention 配置 |
| `retention.trace_policy` | `TraceRetentionPolicyConfig` | `infra::runtime_builder`、`jobs::handoff_delivery` | required safe retention | 待创建 `04-配置设计.md` §trace retention 配置 |
| `projection.features` | `ProjectionFeatureConfig` | `infra::projection_stores`、`jobs::projection_rebuild` | read model enabled; search optional | 待创建 `04-配置设计.md` §projection 配置 |
| `reports.output` | `ReportOutputConfig` | `jobs::consistency_validation`、scripts / reports | `reports/` | 待创建 `04-配置设计.md` §报告输出配置 |
| `security.redaction_policy` | `RedactionPolicyConfig` | `infra::handoff_adapters`、`jobs::handoff_delivery` | required; cannot disable | 待创建 `04-配置设计.md` §安全 / 脱敏配置 |

### 6.2 外部依赖绑定表

| 依赖 | 绑定位置 | 使用接口 | 超时 / 重试 | 降级策略 |
|---|---|---|---|---|
| `core-contracts` | Cargo workspace dependency | shared IDs、ActorRef、TraceContext、metadata、error refs | 不适用 | 不可用则暂停,不得复制类型 |
| Identity actor source | `ConfiguredActorResolverAdapter` | `ActorResolverPort` | resolver timeout;transient retry | actor unresolved marker;不写 identity truth |
| Work source facts | `ConfiguredExternalFactResolverAdapter` | `ExternalFactResolverPort` | resolver timeout;transient retry | unresolved / stale snapshot;不复制 work body |
| Governance fact source | `ConfiguredExternalFactResolverAdapter` | `ExternalFactResolverPort` | resolver timeout;transient retry | unresolved / digest mismatch evidence |
| Artifact source facts | `ConfiguredExternalFactResolverAdapter` | `ExternalFactResolverPort` | resolver timeout;transient retry | unresolved / safe snapshot only |
| Runtime result source | inbound consumer adapter | `ConsumeRuntimeResultCommitted` | event consumer retry by idempotency | quarantine invalid body;skip duplicate |
| Bridge mapped fact source | inbound consumer adapter | `ConsumeBridgeMappedFact` | event consumer retry by idempotency | quarantine forbidden body;skip duplicate |
| Bus / event collaboration | `ConfiguredConversationOutboxPublisher` | `ConversationOutboxPublisherPort` | publish timeout;outbox retry policy | outbox `RetryPending` / `Failed`;truth 不回滚 |
| Inbound source events | `worker::event_consumers` | 6 个 inbound consumer 协议 | consumer retry + idempotency | quarantine invalid;skip duplicate |
| Observability handoff | `ConfiguredTraceHandoffAdapter` | `TraceHandoffPort` | handoff timeout;handoff retry policy | handoff `RetryPending` / `Failed`;不反写 fact |
| Archive handoff | `ConfiguredArchiveHandoffAdapter` | `ArchiveHandoffPort` | archive timeout;handoff retry policy | archive handoff `RetryPending` / `Failed`;不反写 truth |
| Downstream SDK / Chat / Workspace / Runtime consumers | `api` / `worker` / contracts surface | Query APIs、ChangeAvailable event、projection state event | read timeout belongs to caller;publisher retry via outbox | authorized view only;stale / degraded marker |
| Store backend | `InMemory*Repository` / future durable adapter | repository traits、`UnitOfWork` | repository errors no hidden external retry | rollback / failed marker / degraded projection |
| Clock / ID generation | `SystemClock`、`UuidConversationIdGenerator` | `ClockPort`、`IdGeneratorPort` | 不适用 | test adapter 可替换;domain 不直接读系统时间 |

### 6.3 跨仓 Rust 依赖绑定表

| 依赖仓库 | 全局依赖类型 | 本地路径 | Cargo 引用方式 / 协作方式 | 使用位置 | 不可用时处理 |
|---|---|---|---|---|---|
| `quantalithos-core` | 编译期依赖 | `/home/aris/Projects/quantalithos-core` | `core-contracts = { path = "../quantalithos-core/crates/contracts" }` | `contracts`、`domain`、`application`、`infra` 的共享 ID / ActorRef / TraceContext / metadata / error | 暂停依赖真实类型的实现,不得复制 core 类型 |
| `quantalithos-bus` | 事件协作依赖 | `/home/aris/Projects/quantalithos-bus` | event publisher / event consumer adapter;不得 Cargo path dependency | outbox publisher、inbound consumer、worker fake | 使用 fake publisher / fake source;保留 retry / failed / quarantine 测试 |
| `quantalithos-identity` | 运行期 / 事件协作依赖 | `/home/aris/Projects/quantalithos-identity` | `ActorResolverPort`、identity changed consumer;不得 Cargo path dependency | actor snapshot、participant display、identity actor changed | 使用 fake actor resolver;unresolved / stale marker |
| `quantalithos-work` | 运行期 / 事件协作依赖 | `/home/aris/Projects/quantalithos-work` | `ExternalFactResolverPort`、work context event;不得 Cargo path dependency | project / work fact references、manifestation、snapshot refresh | 使用 fixture refs;source unresolved |
| `quantalithos-governance` | 运行期 / 事件协作依赖 | `/home/aris/Projects/quantalithos-governance` | `ExternalFactResolverPort`、governance fact event;不得 Cargo path dependency | governance manifestation、review context | 使用 fixture refs;digest mismatch / unresolved 可测 |
| `quantalithos-artifact` | 运行期 / 事件协作依赖 | `/home/aris/Projects/quantalithos-artifact` | `ExternalFactResolverPort`、artifact committed event;不得 Cargo path dependency | artifact ref、safe snapshot、manifestation | 使用 fixture artifact refs;不复制 artifact body |
| `quantalithos-sdk` | 下游运行期依赖 | `/home/aris/Projects/quantalithos-sdk` | 下游 client / test integration;本仓不得 Cargo path dependency | contracts surface、query / event consumption | 不阻塞本仓;通过本仓 contracts / fake client 测试 |
| `quantalithos-chat` | 下游运行期依赖 | `/home/aris/Projects/quantalithos-chat` | authorized query / SDK access;不得 Cargo path dependency | Chat 消费 read model / changes | 不阻塞本仓;验证 authorized view |
| `quantalithos-workspace` | 下游运行期 / 事件协作依赖 | `/home/aris/Projects/quantalithos-workspace` | query / projection / event collaboration;不得 Cargo path dependency | workspace project / personal view consumption | 不阻塞本仓;用 fake consumer 验证 |
| `quantalithos-runtime` | 运行期 / 事件协作依赖 | `/home/aris/Projects/quantalithos-runtime` | result committed consumer;不得 Cargo path dependency | runtime result facts、authorized read | 使用 fixture event;forbidden reasoning body quarantine |
| `quantalithos-bridges` | 运行期 / 事件协作依赖 | `/home/aris/Projects/quantalithos-bridges` | bridge mapped fact consumer;不得 Cargo path dependency | external platform mapped result | 使用 fixture bridge event;forbidden body quarantine |
| `quantalithos-observability` | handoff / 事件协作依赖 | `/home/aris/Projects/quantalithos-observability` | `TraceHandoffPort`;不得 Cargo path dependency | trace handoff delivery | 使用 fake handoff;failed / retry marker |
| `quantalithos-archive` | handoff / 运行期依赖 | `/home/aris/Projects/quantalithos-archive` | `ArchiveHandoffPort`;不得 Cargo path dependency | archive handoff delivery | 使用 fake archive adapter;archive package ref fixture |

## 7. 回填草稿

> 本节不重复粘贴 §6 的完整表。正式 `03-详细设计.md` 生成 §13 时,应从本文件 §6 摘录。

正式文档 §13 建议采用以下结构:

```text
13. 配置引用与外部依赖绑定
  13.1 设计依据与配置边界
  13.2 配置引用表
  13.3 外部依赖绑定表
  13.4 跨仓 Rust 依赖绑定表
  13.5 交给 04-配置设计继续展开的内容
```

必须引用:

| 正式章节 | 引用来源 |
|---|---|
| §13.1 | `design-calibration/03_ddd_step_14_config_dependencies.md` §2 / §3 / §5 |
| §13.2 | `design-calibration/03_ddd_step_14_config_dependencies.md` §6.1 |
| §13.3 | `design-calibration/03_ddd_step_14_config_dependencies.md` §6.2 |
| §13.4 | `design-calibration/03_ddd_step_14_config_dependencies.md` §6.3 |
| §13.5 | `design-calibration/03_ddd_step_14_config_dependencies.md` §3.5 |

## 8. 待确认事项

| 待确认项 | 备选方案 | 推荐方案 | 推荐理由 | 当前处理 |
|---|---|---|---|---|
| 是否立即创建正式 `04-配置设计.md` | A. 本 Step 同时创建;B. 详细设计 Step 14 只记录待创建位置;C. 不需要配置文档 | B | 当前任务是详细设计校准,配置设计需要按配置 SOP 独立生成 | 本步不创建 `04` |
| P0 是否指定具体数据库 / 搜索 / 消息产品 | A. 立即指定;B. 保持 adapter 契约和 in-memory 默认;C. 全部留给实现自由选择 | B | Step 11 已保持产品中立,同时需要可测试默认 adapter | 本步采用 B |
| 运行期依赖不可用时是否允许 fake | A. 不允许;B. 允许,但必须保留 failure / unresolved / retry 语义;C. fake 视为成功 | B | 可以推进本仓闭环,但不能伪装外部 truth 已成立 | 本步采用 B |

## 9. 本步完成检查

| 检查项 | 结果 | 说明 |
|---|---|---|
| 配置读取模块明确 | 通过 | §3.1 和 §6.1 区分 infra / api / worker / jobs 直接读取,application 间接读取,domain 不读取 |
| 外部依赖绑定点明确 | 通过 | §6.2 逐项映射到 port / adapter / worker / job |
| 编译期 path dependency 与运行期 / 事件协作依赖已区分 | 通过 | §6.3 只有 `core-contracts` 是 Cargo path dependency |
| 未写完整配置手册 | 通过 | 未写 JSON demo、环境变量、完整默认值矩阵或部署说明 |
| 可进入 Step 15 可观测性与审计埋点契约 | 通过 | 下一步可基于 resolver / publisher / handoff / job 绑定点展开观测与审计 |
