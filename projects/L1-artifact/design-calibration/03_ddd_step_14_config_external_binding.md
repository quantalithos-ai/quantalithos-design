# Step 14. 配置引用与外部依赖绑定

> 对应 SOP: `standards/document/详细设计讨论流程_SOP.md` Step 14

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 14 配置引用与外部依赖绑定 |
| 当前状态 | 已完成;待用户审查 |
| 输入基线 | 正式 `00/01/02`、Step 1~13 详细设计校准文档 |
| 输出文件 | `projects/L1-artifact/design-calibration/03_ddd_step_14_config_external_binding.md` |
| 停审方式 | 按配置边界、配置引用表、外部依赖绑定、topic binding、runtime builder、前序审计和回填草稿分批写入 |

---

## 2. 本步目标

本 Step 定义 Artifact 实现需要读取哪些配置、这些配置如何绑定到代码模块、外部依赖如何通过 adapter / port / event / handoff 注入,以及跨仓依赖如何保持架构裁剪。

实现侧必须能从本 Step 判断:

- 哪些模块允许读取 `ArtifactRuntimeConfig` 或更底层 validated config。
- `ArtifactRuntimeConfig` 背后的 store / adapter / target refs 分别绑定到哪些 concrete adapter。
- 哪些配置只是 code binding point,完整文件格式、环境变量和数值默认值必须留给 `04-配置设计.md`。
- 哪些外部系统通过 resolver、inbound event、relay publisher、handoff、API consumer 或 fake 协作。
- 哪个 sibling repo 可以进入 Cargo path dependency。
- 哪些配置不得改变 Artifact truth ownership、body-free、query no-write、consumer no-truth-write、job no-truth-repair 和 relay/handoff failure semantics。
- 依赖仓不存在或上游契约未闭合时,实现应使用 fake、暂停还是等待后续 integration。

本步不定义完整配置手册、部署 profile 合并规则、环境变量名、secret 管理、TLS、具体 endpoint、数据库 / queue / object store / search 产品、cron 表达式、timeout / retry / retention 数值、告警阈值或生产运维流程。这些由 `04-配置设计.md`、实施计划和运维手册承接。

---

## 3. 输入材料

| 输入 | 状态 | 本 Step 用途 |
|---|---|---|
| `03_ddd_step_03_constraints.md` | 已完成 | 固定 Rust workspace、唯一编译期依赖和 runtime / event / handoff 依赖不得进 Cargo |
| `03_ddd_step_04_file_layout.md` | 已完成 | 固定 `infra/config.rs`、`infra/runtime_builder.rs`、adapter 文件职责和 crate dependency matrix |
| `03_ddd_step_05_module_contracts.md` | 已完成 | 固定 `infra` 负责 config binding 和 runtime assembly,application/domain/contracts 不读取配置 |
| `03_ddd_step_06_object_contracts.md` | 已完成 | 提供 object ownership、config watchpoint、policy 禁止配置化边界和 body-free red lines |
| `03_ddd_step_07_trait_port_adapter_contracts.md` | 已完成 | 提供 repository、UnitOfWork、Clock、IdGenerator、resolver、relay publisher、handoff ports 和 fake parity |
| `03_ddd_step_08_protocol_contracts.md` | 已完成 | 提供 inbound event payload、topic-neutral outbound key、job metadata / input / response |
| `03_ddd_step_09_function_flows.md` | 已完成 | 提供 command / query / consumer / relay / maintenance / handoff flow 的 adapter 调用位置 |
| `03_ddd_step_11_persistence_transaction_consistency.md` | 已完成 | 提供 logical store、transaction、relay payload snapshot、projection/reference/idempotency consistency |
| `03_ddd_step_12_error_recovery.md` | 已完成 | 提供 resolver / relay publisher / handoff / config unavailable 的错误映射 |
| `03_ddd_step_13_concurrency_idempotency.md` | 已完成 | 提供 idempotency retention、duplicate replay、relay/projection/reference/handoff reentry 的配置绑定需求 |
| `02_hld_step_11_configuration_impact.md` | 已完成 | 提供配置影响轮廓、禁止配置化边界和 RuntimeConfig / ConfigLoader / ConfigValidator 方向 |
| `L1-governance 03_ddd_step_14_config_external_binding.md` | 已参考 | 提供同类 Step 14 粒度框架,本文件按 Artifact 语义重写 |

---

## 4. 分批写入计划

| 批次 | 内容 | 状态 |
|---|---|---|
| 14.1 | 文件骨架、SOP 问题回答、当前诊断、设计取舍 | [x] 已写入 |
| 14.2 | 配置引用表、config section 到代码绑定、禁止配置化边界 | [x] 已写入 |
| 14.3 | 外部依赖绑定表、inbound/outbound/handoff/topic/fake 策略 | [x] 已写入 |
| 14.4 | 跨仓 Rust 依赖绑定、runtime builder 顺序、前序审计、回填草稿和进入下一步条件 | [x] 已写入 |

---

## 5. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 哪些模块需要读取配置? | 只有 `infra`、`api`、`worker`、`jobs` 入口装配层读取 runtime config 或已验证的 config refs。`infra/config.rs` 负责 config load / validate;`infra/runtime_builder.rs` 负责把 refs 装配成 concrete adapters。`application` 只接收 Step 7 port trait / typed policy parameters;`domain` 和 `contracts` 不读取配置。 |
| 配置项的类型、默认值和读取位置是什么? | 本 Step 定义配置绑定项名称、类型归类、读取模块和默认口径。P0 / local 默认使用 in-memory / fake / deterministic adapter。完整配置文件格式、环境变量、profile 合并和数值默认值留给 `04-配置设计.md`。 |
| 哪些外部依赖需要通过 adapter 注入? | work、process、governance、method-library、runtime/capability、external content source 通过 `ExternalArtifactSourceResolverPort` 或 inbound event consumer 注入。bus 通过 `ArtifactRelayPublisherPort` 注入。archive、observability 和 sync 通过 handoff ports 注入。Clock、IdGenerator、store、projection、reference、relay、idempotency、stored result 通过 infra adapter 注入。 |
| 外部依赖的超时、重试、降级策略是什么? | resolver unavailable 映射为 dependency unavailable、delayed、failed reference 或 degraded query surface;relay publish failure 只更新 relay item publication state / batch result;handoff failure 只保存 failed / retryable handoff record 和 job report;store unavailable 不进入业务写。具体 timeout / retry / backoff 数值由配置设计定义。 |
| 哪些配置细节应留给配置设计文档? | 文件格式、env var、profile 合并、secret / credential source、endpoint、topic 到 transport topic 的绑定、timeout / retry / retention 数值、cron / schedule、batch size 默认值、health probe 和 validation error 文案。 |
| 哪些跨仓 Rust 编译期依赖需要通过本地 path dependency 引入? | 只有 `quantalithos-core/crates/contracts` 的 `core-contracts`,workspace root 使用 `core-contracts = { path = "../quantalithos-core/crates/contracts" }`。其他 sibling repo 不进入 Cargo dependency。 |
| 哪些运行期依赖或事件协作依赖需要通过 adapter / event / projection / fake 表达? | `quantalithos-bus`、`quantalithos-governance`、`quantalithos-work`、`quantalithos-process`、`quantalithos-method-library`、`quantalithos-runtime`、`quantalithos-conversation`、`quantalithos-observability`、`quantalithos-archive`、`quantalithos-sdk`、console / sync 和 external content store 均通过 adapter / event / handoff / API / fake 表达。 |
| 依赖仓库不存在时,当前实现应暂停、使用 fixture / fake,还是等待对应仓库完成? | 编译期 `core-contracts` 不存在时暂停。运行期、事件、handoff、consumer 依赖不存在时,Artifact P0 使用 fake adapter / fixture seed。若正式设计要求读取上游 typed projection / event schema,但上游 contract 未闭合,应暂停回设计收敛,不得在实现侧私造 sibling DTO。 |

---

## 6. 当前文档问题诊断

| 位置 | 当前问题 | 本步处理 |
|---|---|---|
| Step 6 runtime seam watchpoint | Step 6 明确暂不补 `RuntimeConfig` / `ConfigError` / builder helper exact schema,等待 Step 14 判断是否需要 | 本 Step 闭合代码绑定点和读取边界,但不把 raw config object 写回 Step 6 canonical domain object;仍留具体 schema 给 `04-配置设计.md` |
| Step 8 topic map | 已定义 topic-neutral `ArtifactOutboundTopicKey`,但未绑定 deployment transport topic | 本 Step 规定 relay publisher config 承接 transport binding,Step 8 topic key 不等于 raw broker topic secret |
| Step 9 relay / handoff flows | 已定义 publish / handoff 调用位置,但未说明 adapter target 和 enablement 来源 | 本 Step 绑定 relay publisher、archive / observability / sync target config 和 adapter availability |
| Step 13 retention | 幂等、dedup、job retention 只说由 config 规定 | 本 Step 固定 idempotency / event / job retention 配置绑定点 |
| sibling repos | 本地存在多个仓,实现侧容易误加 Cargo path dependency | 本 Step 再次按编译期 / 运行期 / event / handoff / downstream 分类 |
| `04-配置设计.md` | 当前正式 04 缺失 | 本 Step 只给代码绑定点和待配置设计补充项,不替代正式配置设计 |

---

## 7. 设计取舍

| 议题 | 方案 | 取舍 |
|---|---|---|
| Config ownership | A. contracts 暴露 config;B. infra-local config refs / validated config | 采用 B。配置不是 public protocol,contracts 不携带 runtime config |
| Config 内容粒度 | A. Step 14 写完整配置手册;B. Step 14 写代码绑定点,数值和格式交给 `04` | 采用 B。避免详细设计锁死部署产品 |
| Application 是否持有 config object | A. service 持有 `ArtifactRuntimeConfig`;B. builder 注入 trait / typed parameters | 采用 B。application 不依赖 infra config schema |
| Domain policy 是否读取 config | A. domain 读取 policy config;B. application 加载正式 truth / snapshot 后传入 domain guard | 采用 B。domain 保持纯对象 / policy |
| P0 adapter 默认 | A. 真实 service endpoint 必填;B. in-memory / fake / deterministic adapter 可运行 | 采用 B。支持 contract / application / job tests 先闭环 |
| Sibling repo 使用方式 | A. 本地存在就 Cargo path 引入;B. 除 core-contracts 外全部通过 port/event/fake | 采用 B。保持 L1 平权和边界裁剪 |
| Identity direct dependency | A. Artifact 直接绑定 identity;B. actor/capability 通过 core metadata、入口上下文或相邻上下文间接承接 | 采用 B。架构基线未把 `L1-identity` 列为 Artifact 当前直接主链依赖 |

---

## 8. 配置引用表

| 配置项 | 类型 | 读取模块 | 默认值 | 详细配置文档位置 |
|---|---|---|---|---|
| `ArtifactRuntimeConfig.profile_ref` | `ArtifactRuntimeProfileRef` | `infra/config.rs`, `infra/runtime_builder.rs` | `local` / fixture profile for P0 | `04-配置设计.md` runtime profile |
| `ArtifactRuntimeConfig.config_ref` | `ArtifactInfraConfigRef` | `infra/config.rs` | generated / selected validated config ref | config identity |
| `ArtifactRuntimeConfig.truth_store_ref` | `ArtifactStoreConfigRef` | `infra/runtime_builder.rs`, `infra/repositories.rs` | in-memory truth store for P0 | store section |
| `ArtifactRuntimeConfig.projection_store_ref` | `ArtifactStoreConfigRef` | `infra/runtime_builder.rs`, `infra/projection_stores.rs` | in-memory projection store for P0 | projection section |
| `ArtifactRuntimeConfig.reference_store_ref` | `ArtifactStoreConfigRef` | `infra/runtime_builder.rs`, `infra/reference_stores.rs` | in-memory reference / mirror store for P0 | reference / mirror section |
| `ArtifactRuntimeConfig.relay_store_ref` | `ArtifactStoreConfigRef` | `infra/runtime_builder.rs`, `infra/relay_store.rs` | in-memory relay store for P0 | relay store section |
| `ArtifactRuntimeConfig.idempotency_store_ref` | `ArtifactStoreConfigRef` | `infra/runtime_builder.rs`, `infra/idempotency_store.rs`, `infra/result_store.rs` | in-memory idempotency/result store for P0 | idempotency/result section |
| `ArtifactRuntimeConfig.source_resolver_ref` | `ArtifactAdapterConfigRef` | `infra/source_resolvers.rs` | fake resolver for P0 | external resolver section |
| `ArtifactRuntimeConfig.relay_publisher_ref` | `ArtifactAdapterConfigRef` | `infra/publishers.rs`, `worker/relay_publisher.rs` | fake publisher for P0 | outbound relay publisher section |
| `ArtifactRuntimeConfig.archive_handoff_target_refs` | `ArtifactHandoffTargetRefSet` | `infra/handoff_adapters.rs`, `jobs` | fake target set for P0 | archive handoff section |
| `ArtifactRuntimeConfig.observability_handoff_target_refs` | `ArtifactHandoffTargetRefSet` | `infra/handoff_adapters.rs`, `jobs` | fake target set for P0 | observability handoff section |
| `ArtifactRuntimeConfig.sync_handoff_target_refs` | `ArtifactHandoffTargetRefSet` | `infra/handoff_adapters.rs`, `jobs` | fake target set for P0 | sync handoff section |
| `ArtifactRuntimeConfig.clock_adapter_ref` | `ArtifactAdapterConfigRef` | `infra/clock_id.rs`, `runtime_builder.rs` | deterministic fake clock in tests;system/runtime adapter otherwise | clock adapter section |
| `ArtifactRuntimeConfig.id_generator_ref` | `ArtifactAdapterConfigRef` | `infra/clock_id.rs`, `runtime_builder.rs` | deterministic fake id generator in tests;runtime adapter otherwise | id generator section |
| `ArtifactBoundaryConfig.max_command_body_bytes` | `ByteSize` | `api/command_handlers.rs` | config design gives value | API boundary section |
| `ArtifactBoundaryConfig.max_page_limit` | `ArtifactPageLimit` | `api/query_handlers.rs`, repository list adapters, jobs | config design gives value | page/query section |
| `ArtifactBoundaryConfig.query_read_timeout` | `Duration` | `api/query_handlers.rs`, query service wiring | config design gives value | query section |
| `ArtifactIdempotencyConfig.command_retention` | `Duration` | `infra/idempotency_store.rs` | covers client retry / commit unknown window | command idempotency section |
| `ArtifactIdempotencyConfig.event_dedup_retention` | `Duration` | `infra/idempotency_store.rs`, `worker/consumers.rs` | covers bus redelivery window | event dedup section |
| `ArtifactIdempotencyConfig.job_retention` | `Duration` | `infra/idempotency_store.rs`, `jobs` | covers scheduler rerun window | job idempotency section |
| `ArtifactIdempotencyConfig.reserved_record_max_age` | `Duration` | `infra/idempotency_store.rs`, reconciliation / operational audit | config design gives value | idempotency cleanup section |
| `ArtifactProjectionConfig.stale_threshold` | `Duration` | `application/query_service.rs` via typed parameter | config design gives value | projection freshness section |
| `ArtifactProjectionConfig.rebuild_batch_size` | `ArtifactPageLimit` | `jobs/rebuild_derived_views.rs` | config design gives value | projection jobs section |
| `ArtifactReferenceConfig.refresh_batch_size` | `ArtifactPageLimit` | `jobs/refresh_external_references.rs` | config design gives value | reference refresh section |
| `ArtifactReferenceConfig.stale_threshold` | `Duration` | query / command reference guards via typed parameter | config design gives value | reference freshness section |
| `ArtifactJobConfig.default_batch_size` | `ArtifactPageLimit` | `jobs/*`, worker loops | config design gives value | jobs section |
| `ArtifactJobConfig.max_parallelism` | `NonZeroUsize` | `worker/*`, `jobs/*` | `1` for deterministic P0 fake unless config overrides | jobs section |
| `ArtifactJobConfig.retry_policy` | `RetryPolicyConfig` | `jobs/*`, resolver / publisher / handoff wrappers | config design gives value | retry section |
| `ArtifactJobConfig.job_timeout` | `Duration` | `jobs/*` | config design gives value | jobs timeout section |
| `ArtifactRelayConfig.publish_batch_size` | `ArtifactPageLimit` | `worker/relay_publisher.rs` | config design gives value | relay publisher section |
| `ArtifactRelayConfig.publish_retry_policy` | `RetryPolicyConfig` | publisher wrapper / worker loop | config design gives value | relay retry section |
| `ArtifactRelayConfig.transport_topic_bindings` | `TopicBindingConfig` | `infra/publishers.rs` | fake topic binding in P0 | bus topic binding section |
| `ArtifactHandoffConfig.archive_targets` | `ArtifactHandoffTargetRefSet` | `infra/handoff_adapters.rs`, adapter registry | fake target set for P0 | `handoff.archiveTargets[]` |
| `ArtifactHandoffConfig.observability_targets` | `ArtifactHandoffTargetRefSet` | `infra/handoff_adapters.rs`, adapter registry | fake target set for P0 | `handoff.observabilityTargets[]` |
| `ArtifactHandoffConfig.sync_targets` | `ArtifactHandoffTargetRefSet` | `infra/handoff_adapters.rs`, adapter registry | fake target set for P0 | `handoff.syncTargets[]` |
| `ArtifactFeatureConfig.emit_trace_available_event_from_handoff` | `bool` | handoff job service / relay append helper | `false` unless explicitly enabled | feature section |
| `ArtifactFeatureConfig.derived_view_events_enabled` | `bool` | projection job / relay append helper | `true` only when Step 8 outbound mapping is enabled | feature section |

`ArtifactRuntimeConfig`、`ArtifactBoundaryConfig`、`ArtifactIdempotencyConfig`、`ArtifactProjectionConfig`、`ArtifactReferenceConfig`、`ArtifactJobConfig`、`ArtifactRelayConfig`、`ArtifactHandoffConfig` 和 `ArtifactFeatureConfig` 是 `04-配置设计.md` 需要正式展开的 config sections。本 Step 只声明它们的代码绑定点;这些 section 不进入 public `contracts`。

---

## 9. Config section 到代码绑定

| Config section | 读取位置 | 注入对象 / 影响点 | 不变量 |
|---|---|---|---|
| runtime profile / config identity | `infra/config.rs`, `runtime_builder.rs` | `ArtifactRuntimeConfig`, `ArtifactRuntimeBuilderState` | profile 不改变 domain state matrix |
| truth store | `infra/repositories.rs` | all Artifact truth repositories, `ArtifactUnitOfWorkManager` | 不改变 truth 归属和 logical schema |
| projection store | `infra/projection_stores.rs` | summary / read / preview / report repositories, query freshness surface | query 不 rebuild,projection 不反写真相 |
| reference / mirror store | `infra/reference_stores.rs` | `ExternalReferenceResolutionStateRepository`, mirror snapshot and refresh record repositories | 不保存 sibling body |
| relay store | `infra/relay_store.rs` | `ArtifactCommittedChangeRelayRepository` | publisher failure 不回滚 accepted truth |
| idempotency/result store | `infra/idempotency_store.rs`, `infra/result_store.rs` | `ArtifactIdempotencyRepository`, `StoredArtifactResultRepository` | stored result 必须能 replay duplicate |
| boundary | `api/command_handlers.rs`, `api/query_handlers.rs`, worker/job entry validators | request body/page validation | 不绕过 metadata、actor、idempotency、visibility |
| idempotency retention | `infra/idempotency_store.rs` | cleanup / duplicate window / commit unknown audit | retention 不得删除未对账 result |
| jobs | `jobs/*`, `worker/*` | runner batch、parallelism、retry wrapper、timeout | job 不修复 business truth |
| external resolvers | `infra/source_resolvers.rs` | `ExternalArtifactSourceResolverPort` | 只返回 ref、summary、snapshot、state |
| relay publisher / topic binding | `infra/publishers.rs` | `ArtifactRelayPublisherPort` and transport mapping | topic binding 不改变 Step 8 event kind / payload schema |
| archive / observability / sync handoff | `infra/handoff_adapters.rs` | `ArtifactArchiveHandoffPort`, `ArtifactObservabilityHandoffPort`, `ArtifactSyncHandoffPort` | 不保存 archive / observability / sync body as Artifact truth |
| clock / id | `infra/clock_id.rs` | `ClockPort`, `IdGeneratorPort` | domain / handler 不拼 id;time 不由 DB default 隐式产生 |
| features | `runtime_builder.rs`, service registration | route/job/event enablement | feature flag 只能禁用外围能力,不得改变核心 accepted truth 语义 |

---

## 10. 禁止配置化边界

| 禁止配置化项 | 禁止原因 | 违规处理 |
|---|---|---|
| 改变 Artifact truth 归属 | 破坏需求 / 架构数据所有权 | config validation reject |
| 允许保存 external content body、method definition body、runtime output body、archive package body、observability body 或 sync private copy | 破坏外部正文排除边界 | config validation reject |
| 关闭 command metadata / idempotency key 要求 | 破坏 Step 8 / Step 13 protocol | config validation reject |
| 关闭 accepted command trace / audit / relay / stored result 写入 | 破坏追溯、事件传播和 duplicate replay | config validation reject |
| 让 query、projection rebuild、reconciliation、handoff 或 relay publisher 写 core truth | 破坏 derived / operations job 边界 | config validation reject |
| 通过 config 放宽 fact / version / lineage / baseline / review / automation / consumption 状态矩阵 | 破坏 domain invariant | config validation reject |
| 通过 config 绕过 actor context、visibility、safe summary 或 external reference guard | 破坏安全边界 | config validation reject |
| 将 non-core sibling repo 配为 Cargo dependency | 破坏 L1 平权和依赖裁剪 | implementation gate reject |
| 把 raw secret、URL、topic、SQL、HTTP response body 写入 Step 6 infra objects | 破坏 body-free config object 规则 | config validation reject / design correction |
| archive / observability / sync disabled 时阻断 Artifact core command | handoff 是外围交接,不是 core truth 前置 | config validation reject |
| 通过 config 让 baseline 动态解析 current latest 成员 | baseline 只能冻结正式 version refs | config validation reject |
| 通过 config 让 automation output 直接成为 fact/version truth | automation 是 candidate-only boundary | config validation reject |

---

## 11. 外部依赖绑定表

| 依赖 | 绑定位置 | 使用接口 | 超时 / 重试 | 降级策略 |
|---|---|---|---|---|
| local truth store | `infra/repositories.rs` | truth repositories + `ArtifactUnitOfWorkManager` | `store.transaction_timeout`;retry only by application policy | unavailable -> no write,return dependency unavailable |
| projection store | `infra/projection_stores.rs` | summary / read / preview / report repositories | projection timeout / rebuild retry policy | query returns stale/degraded/missing surface |
| reference / mirror store | `infra/reference_stores.rs` | resolution state / mirror snapshot / refresh record repositories | store timeout / refresh retry | command dependency unavailable;job failed ref |
| relay store | `infra/relay_store.rs` | `ArtifactCommittedChangeRelayRepository` | store timeout / publish retry | publish batch partial/failed;truth unchanged |
| idempotency/result store | `infra/idempotency_store.rs`, `infra/result_store.rs` | `ArtifactIdempotencyRepository`, `StoredArtifactResultRepository` | retention + store timeout | unavailable -> no mutation;duplicate missing -> consistency defect |
| L0-bus / event transport | `infra/publishers.rs` | `ArtifactRelayPublisherPort.publish` | relay publish retry policy | mark relay retryable/failed;truth not rolled back |
| L1-work | `infra/source_resolvers.rs`, inbound consumer | `resolve_work_context`, `ConsumeWorkArtifactContextChanged` | resolver timeout / event redelivery window | unresolved work context -> command delayed/rejected or degraded read |
| L1-process | `infra/source_resolvers.rs`, inbound consumer | `resolve_process_context`, `ConsumeProcessArtifactContextChanged` | timeout / retry | process context stale/unresolved -> degraded query / failed reference |
| L1-governance | `infra/source_resolvers.rs`, inbound consumer | `resolve_governance_context`, `ConsumeGovernanceArtifactContextChanged` | timeout / retry | governance context unresolved -> baseline/review command delayed/rejected |
| L3-method-library | `infra/source_resolvers.rs`, inbound consumer | `resolve_artifact_definition`, `ConsumeMethodArtifactDefinitionChanged` | timeout / retry | definition unresolved -> intake/fact command delayed/rejected |
| L2-runtime / capability source | `infra/source_resolvers.rs`, inbound consumer | `resolve_automation_source`, `ConsumeRuntimeArtifactSignalRecorded` | timeout / retry | automation source unresolved -> pending/rejected automation input |
| external content source | `infra/source_resolvers.rs`, inbound consumer | `resolve_content_source`, `ConsumeExternalContentSourceChanged` | timeout / retry | content source unavailable -> pending/degraded;content body never stored |
| L1-conversation / workspace | outbound relay / read API consumer | topic-neutral events and read surface | consumer-side retry | consumes Artifact refs/views only;does not define truth |
| L4-observability | `infra/handoff_adapters.rs`, outbound relay | `ArtifactObservabilityHandoffPort`, trace available event | handoff timeout / retry policy | failed handoff record / job report;local trace retained |
| L4-archive | `infra/handoff_adapters.rs`, outbound relay | `ArtifactArchiveHandoffPort`, version/baseline events | handoff timeout / retry policy | failed archive handoff;archive package body not saved |
| sync / SDK / console | public API / handoff / outbound relay | consumable refs, read surface, sync handoff | API retry / handoff retry | downstream private copy cannot become Artifact truth |
| system clock | `infra/clock_id.rs` | `ClockPort.now` | no retry unless adapter unavailable | deterministic fake for tests;unavailable -> dependency unavailable |
| id generation | `infra/clock_id.rs` | `IdGeneratorPort.new_*` | no retry unless adapter unavailable | deterministic fake for tests;unavailable -> reject/unavailable before mutation |
| adapter registry | `infra/runtime_builder.rs`, `infra/adapter_registry.rs` | adapter availability / target validation helper | health / availability check policy | disabled/unavailable target -> rejected job or failed marker |

---

## 12. Inbound event source binding

| Consumer | Source dependency | Config binding requirement | Disabled behavior |
|---|---|---|---|
| `ConsumeWorkArtifactContextChanged` | `L1-work` event or fixture source | event source enabled, schema version accepted, resolver ref enabled | consumer entry disabled;core command still works with resolver/fake |
| `ConsumeProcessArtifactContextChanged` | `L1-process` event or fixture source | same | consumer entry disabled;process refs resolve via fake or delayed |
| `ConsumeGovernanceArtifactContextChanged` | `L1-governance` event or fixture source | same | consumer entry disabled;governance refs resolve via fake or delayed |
| `ConsumeMethodArtifactDefinitionChanged` | `L3-method-library` event or fixture source | same | consumer entry disabled;definition refs resolve via fake or delayed |
| `ConsumeRuntimeArtifactSignalRecorded` | `L2-runtime` / capability signal source | same | consumer entry disabled;automation command remains explicit |
| `ConsumeExternalContentSourceChanged` | external content source watcher / fixture source | same | consumer entry disabled;content source resolution is on-demand / degraded |

Inbound binding rules:

- Worker config selects source subscription / fixture feed and schema allowlist;it does not redefine payload DTO fields.
- `ArtifactInboundEventEnvelope.dedup_key` is mandatory for enabled consumers.
- Unsupported schema version returns the Step 12 / Step 13 receipt path;worker must not parse payload body to recover.
- Event source config must not allow consumer to create fact、version、lineage、baseline、consumable or backref truth.

---

## 13. Outbound topic / schema binding

Step 8 defines topic-neutral keys. Step 14 binds those keys to runtime publisher config. The binding must be total for all enabled outbound events.

| Event kind | Step 8 topic key | Config binding requirement | Disabled behavior |
|---|---|---|---|
| `ArtifactFactChanged` | `artifact.fact.changed` | relay publisher config maps key to transport topic / route | startup validation fails if fact relay enabled but binding missing |
| `ArtifactVersionChanged` | `artifact.version.changed` | same | startup validation fails if version relay enabled but binding missing |
| `ArtifactLineageChanged` | `artifact.lineage.changed` | same | startup validation fails if lineage relay enabled but binding missing |
| `ArtifactBaselineChanged` | `artifact.baseline.changed` | same | startup validation fails if baseline relay enabled but binding missing |
| `ArtifactReviewChanged` | `artifact.review.changed` | same | startup validation fails if review relay enabled but binding missing |
| `ConsumableArtifactReferenceChanged` | `artifact.consumable.changed` | same | startup validation fails if consumable relay enabled but binding missing |
| `ArtifactTraceAvailable` | `artifact.trace.available` | required only when trace available emission feature is enabled | feature disabled -> no trace available relay append |
| `ArtifactDerivedViewStateChanged` | `artifact.derived_view_state.changed` | required only when derived view event feature is enabled | feature disabled -> derived state still saved,no event append |

Publisher config must not change `ArtifactCommittedChange` variant, schema version, payload DTO, outbox subject or source cursor. It only maps the Step 8 topic-neutral key to a transport route and adapter credentials.

---

## 14. Cross-repo Rust dependency binding

| 依赖仓库 | 全局依赖类型 | 本地路径 | Cargo 引用方式 / 协作方式 | 使用位置 | 不可用时处理 |
|---|---|---|---|---|---|
| `quantalithos-core` | 编译期依赖 | `/home/aris/Projects/quantalithos-core` | `core-contracts = { path = "../quantalithos-core/crates/contracts" }`;member crate 使用 workspace dependency | contracts / domain / application / infra shared actor、metadata、trace、page、timestamp、shared refs | 暂停需要 core contracts 的实现 |
| `quantalithos-bus` | event transport dependency | `/home/aris/Projects/quantalithos-bus` | 不进 Cargo;通过 `ArtifactRelayPublisherPort` / fake publisher | outbound relay publish、inbound event worker | P0 fake;正式 bus binding 缺失则回设计 |
| `quantalithos-governance` | runtime / event dependency | `/home/aris/Projects/quantalithos-governance` | 不进 Cargo;通过 resolver / inbound event DTO / fake snapshot | governance context refs、baseline / review / evidence context | P0 fake;typed event 缺失则回设计 |
| `quantalithos-work` | runtime / event dependency | `/home/aris/Projects/quantalithos-work` | 不进 Cargo;通过 work context resolver and events | work context refs、consumption / baseline context | P0 fake;typed projection/event 缺失则回设计 |
| `quantalithos-process` | runtime / event dependency | `/home/aris/Projects/quantalithos-process` | 不进 Cargo;通过 process context resolver and events | process output context、activity output relations | P0 fake;typed projection/event 缺失则回设计 |
| `quantalithos-method-library` | runtime dependency | `/home/aris/Projects/quantalithos-method-library` | 不进 Cargo;通过 artifact definition resolver and events | definition refs、method / standard source context | P0 fake;method snapshot schema 缺失则回设计 |
| `quantalithos-runtime` | runtime / event dependency | `/home/aris/Projects/quantalithos-runtime` | 不进 Cargo;through runtime signal event/resolver | automation candidate-only input | P0 fake |
| `quantalithos-conversation` | downstream consumer | `/home/aris/Projects/quantalithos-conversation` | 不进 Cargo;through public API / outbound relay | artifact read / preview / trace display | not blocking Artifact P0 |
| `quantalithos-observability` | inbound signal / handoff dependency | `/home/aris/Projects/quantalithos-observability` | 不进 Cargo;through observability handoff / trace available relay | observability handoff and trace interpretation | P0 fake handoff |
| `quantalithos-archive` | handoff / downstream dependency | `/home/aris/Projects/quantalithos-archive` | 不进 Cargo;through `ArtifactArchiveHandoffPort` | archive handoff job | P0 fake archive adapter |
| `quantalithos-sdk` | downstream client | `/home/aris/Projects/quantalithos-sdk` | 不进 Cargo;SDK consumes public contracts/API | clients / release coordination | not blocking Artifact P0 |
| console / sync | downstream consumer | deployment-specific | 不进 Cargo;through public API / sync handoff | read surface / consumable refs / sync material | not blocking Artifact P0 |
| external content store | runtime / body source | deployment-specific | 不进 Cargo;through `ExternalArtifactSourceResolverPort.resolve_content_source` | content source snapshot / digest only | P0 fake;content body never imported |

`L1-identity` is not a direct Artifact current-boundary dependency in the current architecture baseline. Actor / capability / visibility context enters through core metadata, entry actor context, governance/work/process context or future security design,not a direct Artifact Cargo or resolver binding in this Step.

---

## 15. Runtime builder 绑定顺序

```text
ArtifactConfigLoader.load(profile)
  -> ArtifactConfigValidator.validate(...)
  -> ArtifactRuntimeConfig::from_validated_refs(...)
  -> ArtifactRuntimeBuilderState::for_config(...)
  -> validate invariant-safe config combinations
  -> build store registry and store adapters
  -> build ArtifactUnitOfWorkManager
  -> build idempotency / stored result repository
  -> build source resolver / relay publisher / handoff adapters
  -> build ClockPort / IdGeneratorPort
  -> build application services from Step 7 ports
  -> build API handlers / worker consumers / relay loop / job runners
  -> mark builder Ready and expose facade
```

Runtime builder rules:

- `ArtifactRuntimeBuilder` lives in `infra/runtime_builder.rs`.
- `infra/config.rs` owns config loading, validation, redacted issue refs and conversion to `ArtifactRuntimeConfig`.
- `application` service constructors receive Step 7 port traits, typed policy parameters or generic adapters,not raw config objects.
- `domain` receives only explicit factory / policy method inputs,never config or adapter handles.
- `api` / `worker` / `jobs` may receive boundary / runner parameters already validated by `infra`.
- fake runtime must allow deterministic clock, id generator, resolver, relay publisher and handoff results for tests.
- `handoff.archiveTargets[]`、`handoff.observabilityTargets[]` 和 `handoff.syncTargets[]` are target refs,not adapter refs;runtime builder must preserve them as target sets and must not synthesize `ArtifactAdapterConfigRef` from target refs.
- `clockId.clockAdapterRef` and `clockId.idGeneratorRef` are separate adapter refs;runtime builder must inject `ClockPort` and `IdGeneratorPort` separately and must not synthesize a combined clock/id adapter ref.
- builder cannot expose facade unless all blocking slots are enabled or intentionally disabled by a rule that does not affect core command acceptance.

---

## 16. Jobs entry-local binding

Jobs crate binaries read a local argument layer before they build the runtime and dispatch to application job services. This layer is not a domain truth source and must not introduce alternate job protocol metadata.

| Binding | Owner | Formal source | Rule |
|---|---|---|---|
| config source selector | `jobs` entry / `infra/config.rs` | `--config` / `ARTIFACT_CONFIG` | Optional;selects config file for current entry only |
| profile selector | `jobs` entry / `infra/config.rs` | `--profile` / `ARTIFACT_PROFILE` | Optional;selects profile for current entry only |
| job request source | `jobs` entry | `--job-request` / `ARTIFACT_JOB_REQUEST` or `--job-request-stdin` / `ARTIFACT_JOB_REQUEST_STDIN` | Exactly one;contains full `ArtifactJobRequest<T>` envelope |
| artifact output root | `jobs` entry artifact writer | `--artifact-root` / `ARTIFACT_ARTIFACT_ROOT` | Optional;default `artifacts/test/<run_id>` where `run_id` comes from request metadata |
| report output root | `jobs` entry report writer | `--report-root` / `ARTIFACT_REPORT_ROOT` | Optional;default `reports/runs/<run_id>` where `run_id` comes from request metadata |
| dry-run diagnostic selector | `jobs` entry | `--dry-run-diagnostics` / `ARTIFACT_JOB_DRY_RUN_DIAGNOSTICS` | Optional;default false;when true,validate and emit diagnostic artifacts only |

Constraints:

- `run_id`, `idempotency_key`, actor, trace id and job input must be read from `ArtifactJobRequest<T>`;jobs entry-local args must not define duplicate `--run-id`, `--scope`, `--target` or `--idempotency-key` flags.
- Each binary must validate that the decoded request generic input type matches the binary's job kind before calling the runner.
- The artifact writer consumes `ArtifactMaintenanceJobResult` / stored job report and writes future `05` raw evidence artifacts;application services do not receive local filesystem paths.
- Environment variables use the same validation and conflict rules as `04`: if flag and env for the same binding are both present with different values, the entry is rejected rather than silently choosing one.

---

## 17. 前序契约回填审计

| 前序 Step | 审计结论 | 是否需要回填 |
|---|---|---|
| Step 3 constraints | 唯一 Cargo path dependency 与运行期 / event / handoff 隔离已与本 Step 一致 | 不需要 |
| Step 4 file layout | `infra/config.rs`、`runtime_builder.rs`、adapter file responsibilities 已能承接本 Step | 不需要 |
| Step 5 module contracts | `infra` config binding / runtime assembly 职责已一致,application/domain/contracts 不读配置 | 不需要 |
| Step 6 object contracts | `RuntimeConfig` exact schema watchpoint 由本 Step 关闭为 code binding points + `04` 展开;不新增 domain object | 不需要 |
| Step 7 ports | resolver、relay publisher、handoff、Clock、IdGenerator、repositories 均有注入点 | 不需要 |
| Step 8 protocol | topic-neutral keys、inbound event payloads、job metadata 已有绑定点;transport binding 留本 Step/配置设计 | 不需要 |
| Step 9 flows | adapter / publisher / handoff 调用位置已闭合;本 Step 提供 config / availability 来源 | 不需要 |
| Step 11 persistence | logical stores、relay payload snapshot、projection/reference/idempotency consistency 已与 config binding 对齐 | 不需要 |
| Step 12 error recovery | config unavailable、resolver application failure、relay/handoff failures 已有映射;本 Step 只给 adapter binding owner | 不需要 |
| Step 13 idempotency | retention / duplicate window 由本 Step 固定 config binding,数值留 `04` | 不需要 |

---

## 18. 回填草稿

> 校准来源:
> - `projects/L1-artifact/design-calibration/03_ddd_step_14_config_external_binding.md`
>
> 延伸阅读:
> - Step 6 runtime seam watchpoint
> - Step 7 resolver / relay publisher / handoff ports
> - Step 8 inbound event payloads and outbound topic map
> - Step 13 idempotency / duplicate retention rules

### 5.13 配置引用与外部依赖绑定

Artifact 详细设计只定义代码需要读取的配置绑定点、读取模块、默认口径和 adapter 注入位置,不替代 `04-配置设计.md`。完整配置文件格式、环境变量、profile 合并、secret 管理、endpoint、topic transport binding、timeout / retry / retention 数值、cron 和部署矩阵必须由配置设计给出。

`ArtifactRuntimeConfig` 是 infra-local validated config surface,归属 `infra/config.rs`,由 `ArtifactRuntimeBuilder` 转换为 repository、UnitOfWork、projection、reference/mirror、relay、idempotency/result、resolver、publisher、handoff、clock 和 id generator adapters。`application` 只依赖 Step 7 port trait;`domain` 和 `contracts` 不读取配置。

配置不得改变 Artifact truth 归属、外部正文排除、command metadata / idempotency 必填、accepted trace / audit / relay / stored result、query no-write、consumer no-truth-write、job no-truth-repair、状态矩阵、visibility / safe summary guard 和唯一编译期依赖纪律。违反这些边界的配置必须在 validation 阶段 reject。

唯一编译期 dependency 是:

```toml
core-contracts = { path = "../quantalithos-core/crates/contracts" }
```

其他依赖只能通过 adapter、event、handoff、API、projection 或 fake 表达,不得进入 Cargo dependency。

---

## 19. 待确认事项

| 编号 | 待确认项 | 当前口径 | 影响 |
|---|---|---|---|
| ART-DDD14-OPEN-001 | `04-配置设计.md` 是否新建并按配置 SOP 展开 | 当前尚未生成;本 Step 只提供详细设计绑定点 | 后续配置设计任务 |
| ART-DDD14-OPEN-002 | timeout / retry / retention / batch / parallelism 默认数值 | 本 Step 不写数值,只写字段与读取位置 | 配置设计 / implementation defaults |
| ART-DDD14-OPEN-003 | durable store、bus、projection、search、object source 产品选择 | P0 默认 in-memory / fake,不锁定 PostgreSQL、NATS、Redis、Elastic、S3 等产品 | durable adapter phase |
| ART-DDD14-OPEN-004 | trace available / derived view changed outbound event 是否默认启用 | 当前由 feature config 控制,enabled 后 topic binding 必须完整 | relay tests / publisher config |
| ART-DDD14-OPEN-005 | external content resolver 的 production body access protocol | 当前只允许 body-free snapshot / digest,不保存 body | external content integration |

---

## 20. 进入下一步条件

| 条件 | 结论 |
|---|---|
| 配置读取模块是否明确 | 通过 |
| 配置引用表是否覆盖 store、boundary、idempotency、projection、reference、jobs、relay、external、handoff、clock/id、features | 通过 |
| 外部依赖是否全部绑定到 Step 7 port / adapter / event / fake | 通过 |
| 跨仓 Rust 编译期依赖是否只有 `core-contracts` | 通过 |
| 禁止配置化边界是否列出 | 通过 |
| topic-neutral key 到 transport binding 的职责是否明确 | 通过 |
| 是否仍需实现侧自行补 config schema / adapter binding | 不需要;具体数值和文件格式留给 `04-配置设计.md` |

下一步进入 Step 15:可观测性与审计埋点契约。
