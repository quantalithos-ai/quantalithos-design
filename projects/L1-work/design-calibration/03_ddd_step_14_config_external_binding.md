# Step 14. 定义配置引用与外部依赖绑定

### 1. Step 状态

- 状态:[x] 已确认
- 对应 SOP:`standards/document/详细设计讨论流程_SOP.md` Step 14
- 回填章节:`03-详细设计.md` §5.13 配置引用与外部依赖绑定 / §3 实现约束 / §5 模块实现契约

### 2. 本步输入

| 输入 | 内容 | 本步使用方式 |
|---|---|---|
| `00-需求文档.md` §6 / §12 | 唯一编译期依赖、运行期 / 事件协作依赖分类 | 固定依赖类型和禁止 package dependency |
| `01-架构设计.md` §8 / §13 | 依赖方向、配置不得改变架构主线 | 固定禁止配置化边界 |
| `02_hld_step_11_configuration_impact.md` | 配置影响轮廓和禁止配置化边界 | 提炼代码绑定点 |
| `03_ddd_step_03_constraints.md` | `core-contracts` path dependency 和 sibling repo 纪律 | 固定跨仓 Rust dependency 表 |
| `03_ddd_step_05_module_contracts.md` | `infra` config / runtime builder 归属 | 固定读取模块 |
| `03_ddd_step_07_trait_port_adapter_contracts.md` | repository、resolver、publisher、handoff、technical port | 固定 adapter 注入点 |
| `03_ddd_step_13_concurrency_idempotency.md` | idempotency / dedup retention open item | 固定进入配置项 |

### 3. 分批写入记录

本 Step 按 `设计文档讨论中间产物规范.md` §3.4 分批写入:

| 批次 | 内容 | 状态 |
|---|---|---|
| 14.1 | 文件骨架、SOP 问题回答、配置边界诊断 | [x] |
| 14.2 | 配置引用表、禁止配置化边界、runtime builder 绑定 | [x] |
| 14.3 | 外部依赖绑定表、跨仓 Rust 依赖绑定表 | [x] |
| 14.4 | 前序回填、回填草稿、待确认事项和进入下一步条件 | [x] |

### 4. SOP 问题回答

1. 哪些模块需要读取配置?

   回答:只有 `infra`、`api`、`worker`、`jobs` 入口装配层读取 `WorkRuntimeConfig` 或其子配置。`application` 只接收已装配的 port / service 参数;`domain`、`contracts` 不读取配置。

2. 配置项的类型、默认值和读取位置是什么?

   回答:本 Step 只定义配置项名称、Rust 类型占位、读取模块和默认口径。完整文件格式、环境变量、profile 合并、密钥来源和数值默认值留给 `04-配置设计.md`。

3. 哪些外部依赖需要通过 adapter 注入?

   回答:identity、method-library、conversation / runtime / artifact / governance source、evidence、process timebox、bus publisher、observability handoff、archive handoff、clock、id generator、store、projection、idempotency 和 outbox 都通过 Step 7 application port / infra adapter 注入。

4. 外部依赖的超时、重试、降级策略是什么?

   回答:超时和重试策略由对应 config section 传给 adapter。resolver 不可用时 command 返回 unresolved / temporarily unavailable,consumer / job 写 failed / unresolved marker 或 retry;publisher failure 只更新 outbox failed marker;handoff failure 写 job report / marker;query 不触发修复。

5. 哪些配置细节应留给配置设计文档?

   回答:配置文件格式、环境变量名、profile 合并顺序、secret 管理、具体 timeout / retry 数值、retention 数值、adapter endpoint 结构、部署环境矩阵、迁移参数和告警阈值留给 `04-配置设计.md`。

6. 哪些跨仓 Rust 编译期依赖需要通过本地 path dependency 引入?

   回答:只有 `quantalithos-core/crates/contracts` 的 package `core-contracts`,目标引用为 `core-contracts = { path = "../quantalithos-core/crates/contracts" }`。

7. 哪些运行期依赖或事件协作依赖需要通过 adapter / event / projection / fake 表达?

   回答:`L0-bus`、`L1-identity`、`L1-conversation`、`L3-method-library`、`L1-process`、`L1-governance`、`L1-artifact`、`L2-runtime`、`L4-observability`、`L4-archive`、`L1-workspace`、`L0-sdk` 均不得进入 Cargo dependency,只能通过 port、event、query、handoff、projection 或 fake 表达。

8. 依赖仓库不存在时,当前实现应暂停、使用 fixture / fake,还是等待对应仓库完成?

   回答:编译期 `core-contracts` 不存在时暂停。运行期 / 事件 / handoff 依赖不存在时,P0 实现使用 fake adapter 和 typed local DTO / ref;若设计要求读取上游正式 typed projection 但上游契约未定义,则暂停并回设计仓收敛。

### 5. 当前文档问题诊断

| 位置 | 当前问题 | 本步处理 |
|---|---|---|
| Step 6 `WorkRuntimeConfig` | 只有 `store` / `projection` / `external` 三个字段,不足以承接 boundary、idempotency、job、outbox、handoff、feature | 本 Step 回填完整 config section |
| HLD Step 11 | 明确配置影响,但不定义配置项清单和默认值 | 本 Step 只定义代码读取项和绑定点,不写完整配置手册 |
| Step 11 / 13 open item | `projects.owner_ref` 唯一性、dedup 保留期还未闭合 | 固定为 `WorkStoreConfig.project_owner_uniqueness` 和 `WorkIdempotencyConfig.*_retention` |
| 外部依赖 | 多个 sibling repo 本地存在,实现侧容易写成 Cargo path dependency | 本 Step 再次按编译期 / 运行期 / 事件 / handoff 分类 |
| `04-配置设计.md` | 当前项目目录没有正式配置设计文档 | 本 Step 只给详细设计绑定点,并把完整配置文档标为后续必要输入 |

### 6. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 配置 root | `WorkRuntimeConfig { store, projection, external }` | 拆为 store / boundary / idempotency / projection / jobs / external / outbox / handoff / features | 避免实现侧把 job / outbox / handoff 配置散落 |
| owner 唯一性 | Step 11 / 13 open | `WorkStoreConfig.project_owner_uniqueness` | 给 repository conflict 来源 |
| dedup 保留期 | Step 13 open | `WorkIdempotencyConfig` | 支撑幂等与 event dedup adapter |
| 外部依赖绑定 | Step 7 有 port,但未列 timeout / retry / degradation | 本 Step 按 adapter 绑定外部依赖 | 支撑 infra config / runtime builder |
| 跨仓依赖 | Step 3 已裁剪 | 本 Step 按实现绑定再次固定 | 防止后续 implementation 误加 dependency |

### 7. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 在详细设计中写完整配置手册 | 实现者一眼可配 | 越过 `04-配置设计.md`,容易提前锁部署细节 | 不采用 |
| 详细设计只写配置绑定点 | 不抢配置文档职责,但能指导代码结构 | 需要后续配置设计补默认值和文件格式 | 采用 |
| domain 直接读取 policy config | 简化 policy 调用 | 破坏 domain 纯对象边界 | 不采用 |
| application 持有 config object | 参数传递少 | application 会依赖 infra config schema | 不采用 |
| infra runtime builder 读取并注入已验证参数 / adapter | 依赖方向清晰 | builder 需要较完整 assembly | 采用 |

### 8. 结构化中间产物

#### 8.1 配置引用表

| 配置项 | 类型 | 读取模块 | 默认值 | 详细配置文档位置 |
|---|---|---|---|---|
| `WorkRuntimeConfig.store.adapter_kind` | `WorkStoreAdapterKind` | `infra/config.rs`、`runtime_builder.rs` | `InMemory` for P0 / local test | `04-配置设计.md` store section |
| `WorkRuntimeConfig.store.transaction_timeout` | `Duration` | `infra/repositories.rs` | 配置设计给出 | `04-配置设计.md` store section |
| `WorkRuntimeConfig.store.project_owner_uniqueness` | `ProjectOwnerUniquenessPolicy` | `infra/repositories.rs` | `NotUnique` | `04-配置设计.md` store policy |
| `WorkRuntimeConfig.boundary.max_command_body_bytes` | `ByteSize` | `api/command_handlers.rs` | 配置设计给出 | `04-配置设计.md` boundary section |
| `WorkRuntimeConfig.boundary.max_page_limit` | `PageLimit` | `api/query_handlers.rs`、`infra` list adapters | 配置设计给出 | `04-配置设计.md` boundary section |
| `WorkRuntimeConfig.boundary.query_read_timeout` | `Duration` | `api/query_handlers.rs`、query service adapter wiring | 配置设计给出 | `04-配置设计.md` query section |
| `WorkRuntimeConfig.idempotency.command_retention` | `Duration` | `infra/idempotency_store.rs` | 覆盖客户端 retry window | `04-配置设计.md` idempotency section |
| `WorkRuntimeConfig.idempotency.event_dedup_retention` | `Duration` | `infra/idempotency_store.rs`、`worker/consumers.rs` | 覆盖 event redelivery window | `04-配置设计.md` idempotency section |
| `WorkRuntimeConfig.idempotency.reserved_record_max_age` | `Duration` | `infra/idempotency_store.rs`、reconciliation job | 配置设计给出 | `04-配置设计.md` idempotency section |
| `WorkRuntimeConfig.projection.adapter_kind` | `WorkProjectionAdapterKind` | `infra/projection_stores.rs` | `InMemory` for P0 / local test | `04-配置设计.md` projection section |
| `WorkRuntimeConfig.projection.stale_threshold` | `Duration` | `application/query_service.rs` via runtime builder parameter | 配置设计给出 | `04-配置设计.md` projection section |
| `WorkRuntimeConfig.projection.replace_scope` | `ProjectionReplaceScope` | `infra/projection_stores.rs` | `ProjectProjectionSet` | `04-配置设计.md` projection section |
| `WorkRuntimeConfig.jobs.default_batch_size` | `BatchSize` | `jobs/*`、job services | 配置设计给出 | `04-配置设计.md` jobs section |
| `WorkRuntimeConfig.jobs.max_parallelism` | `NonZeroUsize` | `worker/*`、`jobs/*` | `1` for P0 fake unless config overrides | `04-配置设计.md` jobs section |
| `WorkRuntimeConfig.jobs.retry_limit` | `RetryLimit` | `jobs/*`、worker runner | 配置设计给出 | `04-配置设计.md` retry section |
| `WorkRuntimeConfig.jobs.job_timeout` | `Duration` | `jobs/*` | 配置设计给出 | `04-配置设计.md` jobs section |
| `WorkRuntimeConfig.external.identity` | `ExternalAdapterConfig` | `infra/source_resolvers.rs` | `Fake` | `04-配置设计.md` external adapters |
| `WorkRuntimeConfig.external.method_library` | `ExternalAdapterConfig` | `infra/source_resolvers.rs` | `Fake` | `04-配置设计.md` external adapters |
| `WorkRuntimeConfig.external.source_work` | `ExternalAdapterConfig` | `infra/source_resolvers.rs` | `Fake` | `04-配置设计.md` external adapters |
| `WorkRuntimeConfig.external.evidence` | `ExternalAdapterConfig` | `infra/source_resolvers.rs` | `Fake` | `04-配置设计.md` external adapters |
| `WorkRuntimeConfig.external.process_timebox` | `ExternalAdapterConfig` | `infra/source_resolvers.rs` | `Fake` | `04-配置设计.md` external adapters |
| `WorkRuntimeConfig.outbox.publish_batch_size` | `BatchSize` | `worker/outbox_publisher.rs`、`jobs` | 配置设计给出 | `04-配置设计.md` outbox section |
| `WorkRuntimeConfig.outbox.publish_retry` | `RetryPolicyConfig` | `worker/outbox_publisher.rs` | 配置设计给出 | `04-配置设计.md` outbox section |
| `WorkRuntimeConfig.outbox.publisher` | `ExternalAdapterConfig` | `infra/publishers.rs` | `Fake` | `04-配置设计.md` outbox / bus adapter |
| `WorkRuntimeConfig.handoff.trace_target` | `HandoffTargetConfig` | `infra/handoff_adapters.rs` | `Fake` | `04-配置设计.md` handoff section |
| `WorkRuntimeConfig.handoff.archive_target` | `HandoffTargetConfig` | `infra/handoff_adapters.rs` | `Fake` | `04-配置设计.md` handoff section |
| `WorkRuntimeConfig.features.derived_views_enabled` | `bool` | `runtime_builder.rs`、query service wiring | `true` for P0 | `04-配置设计.md` feature section |
| `WorkRuntimeConfig.features.advanced_search_enabled` | `bool` | `runtime_builder.rs`、query handler | `false` unless P0 search contract exists | `04-配置设计.md` feature section |

#### 8.2 配置 section 到代码绑定

| Config section | 读取位置 | 注入对象 | 不变量 |
|---|---|---|---|
| `store` | `infra/config.rs` -> `runtime_builder.rs` | repository adapters、UnitOfWork | 不改变 Step 11 logical schema |
| `boundary` | `api/routes.rs` / `command_handlers.rs` / `query_handlers.rs` | handler validation parameters | 不绕过 `ActorContext` / metadata / visibility |
| `idempotency` | `infra/idempotency_store.rs` | `IdempotencyRepository` adapter | 不允许缺 idempotency key 的写路径 |
| `projection` | `infra/projection_stores.rs` | `ProjectionRepository` adapter and query marker policy | 不允许 query rebuild 或 projection 反写真相 |
| `jobs` | `jobs/*` / `worker/*` | job runner / worker loop parameters | 不允许 job 修 business truth |
| `external` | `infra/source_resolvers.rs` | resolver port implementations | 不保存外部正文 |
| `outbox` | `infra/publishers.rs` / `worker/outbox_publisher.rs` | publisher adapter and retry policy | publisher failure 不回滚 truth |
| `handoff` | `infra/handoff_adapters.rs` | trace / archive handoff adapters | 不写 observability / archive long-term body |
| `features` | `runtime_builder.rs` | service / route enablement | 只能影响派生 / 外围能力,不能改变核心 truth |

#### 8.3 禁止配置化边界

| 禁止配置化项 | 禁止原因 | 违规处理 |
|---|---|---|
| 改变 Work truth 归属 | 会让 Project / WorkItem / Iteration 真相漂移 | config validation reject |
| 允许保存相邻仓正文 | 违反数据归属 | config validation reject |
| 允许 event 直接创建 WorkItem | 破坏 formalize / promote 边界 | config validation reject |
| 关闭 command metadata / idempotency key 要求 | 破坏 Step 8 / 13 协议 | config validation reject |
| 关闭核心 accepted truth audit / outbox | 破坏追溯和传播 | config validation reject |
| 让 query / projection / reconciliation 写业务 truth | 破坏派生只读 | config validation reject |
| 把非 core sibling repo 配成 Cargo dependency | 破坏依赖裁剪 | implementation gate reject |
| 配置绕过 visibility / actor 校验 | 破坏安全边界 | config validation reject |

#### 8.4 外部依赖绑定表

| 依赖 | 绑定位置 | 使用接口 | 超时 / 重试 | 降级策略 |
|---|---|---|---|---|
| local store | `infra/repositories.rs` | repository traits + `UnitOfWork` | `store.transaction_timeout`;retry by service policy | store unavailable -> `TemporarilyUnavailable` / job failed |
| projection store | `infra/projection_stores.rs` | `ProjectionRepository` / `WorkTruthSnapshotRepository` | projection timeout / rebuild job retry | query returns stale / failed / missing surface |
| idempotency store | `infra/idempotency_store.rs` | `IdempotencyRepository` | retention + store timeout | unavailable -> no write,return `TemporarilyUnavailable` |
| L0-bus event publish | `infra/publishers.rs` | `WorkOutboxPublisherPort.publish` | outbox publish retry | mark outbox failed;truth not rolled back |
| L1-identity | `infra/source_resolvers.rs` | `MemberReferencePort` / identity event consumer | external adapter timeout / retry | unresolved member -> command reject or failed reference marker |
| L3-method-library | `infra/source_resolvers.rs` | `MethodDefinitionResolverPort` / method event consumer | timeout / retry | unresolved definition -> formalize reject or stale snapshot |
| L1-conversation / L2-runtime / artifact / governance source | `infra/source_resolvers.rs` | `SourceWorkResolverPort` / inbound events | timeout / retry | source unresolved -> pending / rejected promote path;no source body copy |
| governance / artifact evidence | `infra/source_resolvers.rs` | `EvidenceResolverPort` | timeout / retry | evidence unresolved -> command reject / failed ref |
| L1-process | `infra/source_resolvers.rs` | `ProcessTimeboxResolverPort` | timeout / retry | timebox unresolved -> iteration open reject / failed ref |
| L4-observability | `infra/handoff_adapters.rs` | `TraceHandoffPort` | handoff timeout / retry | job failed marker;Work trace retained locally |
| L4-archive | `infra/handoff_adapters.rs` | `ArchiveHandoffPort` | handoff timeout / retry | archive handoff failed marker;Work truth retained |
| system clock | `infra/clock_id.rs` | `ClockPort.now` | no retry unless adapter unavailable | fixed clock in fake;adapter failure -> `TemporarilyUnavailable` |
| id generation | `infra/clock_id.rs` | `IdGeneratorPort.next_*` | no retry unless adapter unavailable | deterministic fake;adapter failure -> reject / unavailable |

#### 8.5 跨仓 Rust 依赖绑定表

| 依赖仓库 | 全局依赖类型 | 本地路径 | Cargo 引用方式 / 协作方式 | 使用位置 | 不可用时处理 |
|---|---|---|---|---|---|
| `quantalithos-core` | 编译期依赖 | `/home/aris/Projects/quantalithos-core` | `core-contracts = { path = "../quantalithos-core/crates/contracts" }` | contracts / domain / application / infra 共享 metadata / actor / trace / page / id | 暂停需要 core 类型的实现 |
| `quantalithos-bus` | 事件协作依赖 | `/home/aris/Projects/quantalithos-bus` | 不进 Cargo;通过 `WorkOutboxPublisherPort` / fake publisher | worker / infra publisher | P0 使用 fake;若正式 bus event schema 缺失则回设计 |
| `quantalithos-identity` | 运行期依赖 | `/home/aris/Projects/quantalithos-identity` | 不进 Cargo;通过 `MemberReferencePort` / identity event DTO / fake | member / reference adapters | P0 使用 fake;正式 typed projection 缺失则回设计 |
| `quantalithos-conversation` | 事件 / source 协作依赖 | `/home/aris/Projects/quantalithos-conversation` | 不进 Cargo;通过 `SourceWorkResolverPort` / conversation event | promote / source adapters | P0 使用 fake;source schema 缺失则回设计 |
| `quantalithos-method-library` | 运行期依赖 | `/home/aris/Projects/quantalithos-method-library` | 不进 Cargo;通过 `MethodDefinitionResolverPort` / snapshot fake | formal work / method adapters | P0 使用 fake;definition snapshot 缺失则回设计 |
| `L1-process` | 运行期依赖 | 待创建 | 不进 Cargo;通过 `ProcessTimeboxResolverPort` / fake | iteration adapters | P0 使用 fake |
| `L1-governance` | 运行期 / evidence 依赖 | 待创建 | 不进 Cargo;通过 `EvidenceResolverPort` / source summary | dependency / blocker / completion | P0 使用 fake |
| `L1-artifact` | evidence / source 依赖 | 待创建 | 不进 Cargo;通过 `EvidenceResolverPort` / `SourceWorkResolverPort` | completion / promote | P0 使用 fake |
| `L2-runtime` | event source dependency | 待创建 | 不进 Cargo;通过 inbound event / `SourceWorkResolverPort` | promote intake | P0 使用 fake |
| `L1-workspace` | 下游消费 | 待创建 | 不进 Cargo;通过 Work Query / outbox event | query / SDK consumers | 不阻塞本仓 P0 |
| `L0-sdk` | 下游 client | `/home/aris/Projects/quantalithos-sdk` | 不进 Cargo;SDK 消费 Work contracts/API | external client | 不阻塞本仓 P0 |
| `L4-observability` | handoff consumer | 待创建 | 不进 Cargo;通过 `TraceHandoffPort` | trace handoff job | P0 使用 fake handoff |
| `L4-archive` | handoff / downstream consumer | 待创建 | 不进 Cargo;通过 `ArchiveHandoffPort` / Work Query export | archive handoff job | P0 使用 fake handoff |

#### 8.6 Runtime builder 绑定顺序

```text
WorkRuntimeConfig::load_and_validate(...)
  -> build store / projection / idempotency / outbox adapters
  -> build external resolver / publisher / handoff adapters from config
  -> build ClockPort / IdGeneratorPort adapters
  -> assemble application services with application port traits
  -> expose api handlers / worker consumers / job runners
```

Runtime builder 规则:

- `WorkRuntimeBuilder` 只在 `infra/runtime_builder.rs` 装配 concrete adapters。
- `application` service struct 只接收 trait object / generic port,不接收 `WorkRuntimeConfig`。
- `domain` object / policy 不接收 config;policy 参数必须由 application service 作为 typed input 传入。
- fake runtime 必须可由 config 或 test fixture 固定 id / clock / resolver result。

### 9. 前序契约回填记录

| 回填文件 | 回填内容 | 原因 |
|---|---|---|
| `03_ddd_step_06_object_contracts.md` | `WorkRuntimeConfig` 补 boundary / idempotency / jobs / outbox / handoff / features 子配置;新增 config section 表 | Step 14 需要 runtime config 字段级绑定点 |
| `03_ddd_step_11_persistence_transaction_consistency.md` | DDD11-OPEN-002 / 003 更新为配置绑定口径 | owner uniqueness / row lock 不再悬空 |
| `03_ddd_step_13_concurrency_idempotency.md` | DDD13-OPEN-001 / 002 / 003 更新为配置绑定口径 | dedup retention / owner uniqueness / row lock 不再悬空 |
| `03_ddd_calibration_flow.md` | Step 13 标为已确认,Step 14 标为待审核 | 反映当前进度 |

### 10. 回填草稿

> 校准来源:
> - `design-calibration/03_ddd_step_14_config_external_binding.md`
>
> 延伸阅读:
> - 建议继续阅读本中间产物的“配置引用表”“外部依赖绑定表”“跨仓 Rust 依赖绑定表”和“Runtime builder 绑定顺序”小节。

#### 5.13 配置引用与外部依赖绑定

L1-work 详细设计只定义代码需要读取的配置项、读取模块、默认口径和 adapter 绑定点,不替代 `04-配置设计.md`。完整配置文件格式、环境变量、profile 合并、secret 管理、具体 timeout / retry / retention 数值和部署矩阵必须由配置设计给出。

`WorkRuntimeConfig` 是本仓配置根对象,归属 `infra/config.rs`,由 `WorkRuntimeBuilder` 读取并装配 repository、projection、idempotency、resolver、publisher、handoff、clock 和 id generator adapters。`application` 只依赖 Step 7 的 trait;`domain` 和 `contracts` 不读取配置。

配置不得改变 Work truth 归属、外部正文排除、formalize / promote 边界、metadata / idempotency 必填、核心 audit / outbox、query no-write、projection 不反写和唯一编译期依赖纪律。违反这些边界的配置必须在 validation 阶段 reject。

唯一编译期 dependency 是:

```toml
core-contracts = { path = "../quantalithos-core/crates/contracts" }
```

其他依赖只能通过 adapter、event、handoff、query、projection 或 fake 表达,不得进入 Cargo dependency。

### 11. 待确认事项

| 编号 | 待确认项 | 当前口径 | 影响 |
|---|---|---|---|
| DDD14-OPEN-001 | `04-配置设计.md` 是否需要新建 | 当前项目目录缺正式配置设计文档;本 Step 只提供详细设计绑定点 | 配置 SOP 后续需补完整配置设计 |
| DDD14-OPEN-002 | 具体 timeout / retry / retention 默认数值 | 本 Step 不写数值 | `04-配置设计.md` |
| DDD14-OPEN-003 | durable store / bus / external adapter 产品选择 | 当前 P0 默认 fake / in-memory;不锁 PostgreSQL、NATS、Redis、Elastic 等产品 | 实施计划 / durable adapter 设计 |
| DDD14-OPEN-004 | `advanced_search_enabled` P0 是否打开 | 默认 false unless P0 search contract exists | Step 16 / Step 17 验证与实施承接 |

### 12. 进入下一步条件

- [x] 配置引用表已覆盖 store、boundary、idempotency、projection、jobs、external、outbox、handoff、features。
- [x] 外部依赖绑定表已覆盖 repository、projection、idempotency、bus、identity、method、source、evidence、process、observability、archive、clock、id。
- [x] 跨仓 Rust 依赖绑定表确认只有 `core-contracts` 是 Cargo path dependency。
- [x] 禁止配置化边界已列出,并规定违规配置 validation reject。
- [x] 实现者知道配置由 `infra/config.rs` 读取、由 `runtime_builder.rs` 注入,domain / contracts 不读配置。
