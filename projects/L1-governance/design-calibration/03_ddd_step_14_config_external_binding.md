# Step 14. 配置引用与外部依赖绑定

> 对应 SOP: `standards/document/详细设计讨论流程_SOP.md` Step 14

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 14 配置引用与外部依赖绑定 |
| 当前状态 | 已完成;待用户审查 |
| 输入基线 | 需求、架构、概要、Step 1~13 详细设计校准文档 |
| 输出文件 | `projects/L1-governance/design-calibration/03_ddd_step_14_config_external_binding.md` |
| 停审方式 | 按配置边界、配置引用表、外部依赖绑定、跨仓依赖表、runtime builder 绑定顺序分批写入;完成后做跨 Step 3~13 闭环审计 |

## 2. 本步目标

本 Step 定义 Governance 实现需要读取哪些配置、这些配置如何绑定到代码模块、外部依赖如何通过 adapter / port 注入,以及跨仓依赖如何保持架构裁剪。

实现侧必须能从本 Step 判断:

- 哪些模块允许读取 `GovernanceRuntimeConfig` 或更底层配置。
- `GovernanceRuntimeConfig` 中的 store / adapter refs 分别绑定到哪些 concrete adapter。
- 哪些配置只是 code binding point,完整文件格式、环境变量和数值默认值必须留给 `04-配置设计.md`。
- 哪些外部系统通过 resolver、publisher、handoff、export、event 或 fake 协作。
- 哪个 sibling repo 可以进入 Cargo path dependency。
- 哪些边界不得被配置开关改变。
- 依赖仓不存在或上游契约未闭合时,实现应使用 fake、暂停还是等待后续 integration。

本步不定义完整配置手册、部署 profile 合并规则、环境变量名、secret 管理、TLS、具体 endpoint、数据库 / queue / cache / search 产品、cron 表达式、timeout / retry / retention 数值、告警阈值或生产运维流程。这些由 `04-配置设计.md`、实施计划和运维手册承接。

## 3. 输入材料

| 输入 | 状态 | 本 Step 用途 |
|---|---|---|
| `03_ddd_step_03_constraints.md` | 已完成 | 固定 Rust workspace、唯一编译期依赖、运行期 / 事件 / handoff 依赖不得进 Cargo |
| `03_ddd_step_04_file_layout.md` | 已完成 | 固定 `infra/config.rs`、`infra/runtime_builder.rs`、adapter 文件职责和 crate dependency matrix |
| `03_ddd_step_05_module_contracts.md` | 已完成 | 固定 `infra` 负责 config binding 和 runtime assembly,application 只依赖 port |
| `03_ddd_step_06_object_contracts.md` | 已完成 | 提供 `GovernanceRuntimeConfig`、config refs、adapter availability marker、store/resolver/publisher/handoff adapter state |
| `03_ddd_step_07_trait_port_adapter_contracts.md` | 已完成 | 提供 repository、UnitOfWork、Clock、IdGenerator、resolver、publisher、handoff、external GRC、adapter registry port |
| `03_ddd_step_08_protocol_contracts.md` | 已完成 | 提供 outbound topic key、event schema version、job metadata / input / response |
| `03_ddd_step_09_function_flows.md` | 已完成 | 提供 command / consumer / publish / maintenance / handoff job 的 adapter 调用位置 |
| `03_ddd_step_11_persistence_transaction_consistency.md` | 已完成 | 提供 logical store、transaction、outbox snapshot、projection/reference/idempotency consistency |
| `03_ddd_step_12_error_recovery.md` | 已完成 | 提供 resolver / publisher / handoff / config unavailable 的错误映射 |
| `03_ddd_step_13_concurrency_idempotency.md` | 已完成 | 提供 idempotency retention、duplicate replay、job retry / reentry 的配置绑定需求 |

## 4. 分批写入计划

| 批次 | 内容 | 状态 |
|---|---|---|
| 14.1 | 文件骨架、SOP 问题回答、配置边界与当前诊断 | [x] 已写入 |
| 14.2 | 配置引用表、config section 到代码绑定、禁止配置化边界 | [x] 已写入 |
| 14.3 | 外部依赖绑定表、运行期 adapter / event / handoff / fake 策略 | [x] 已写入 |
| 14.4 | 跨仓 Rust 依赖绑定、runtime builder 顺序、前序审计和回填草稿 | [x] 已写入 |

## 5. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 哪些模块需要读取配置? | 只有 `infra`、`api`、`worker`、`jobs` 入口装配层读取 runtime config 或其加载后的 validated refs。`infra/config.rs` 负责 config load / validate;`infra/runtime_builder.rs` 负责把 refs 装配成 concrete adapters。`application` 只接收 Step 7 port trait / service 参数;`domain` 和 `contracts` 不读取配置。 |
| 配置项的类型、默认值和读取位置是什么? | 本 Step 定义配置绑定项名称、类型占位、读取模块和默认口径。P0 / local 默认使用 in-memory / fake / deterministic adapter。完整配置文件格式、环境变量、profile 合并和数值默认值留给 `04-配置设计.md`。 |
| 哪些外部依赖需要通过 adapter 注入? | identity、method-library、process、work、artifact/evidence、runtime、conversation、observability signal 通过 `ExternalGovernanceSourceResolverPort` 或 inbound event consumer 注入。bus 通过 `GovernanceOutboxPublisherPort` 注入。observability / archive / external GRC 通过 handoff / export ports 注入。Clock、IdGenerator、store、projection、reference、outbox、idempotency、stored result 通过 infra adapter 注入。 |
| 外部依赖的超时、重试、降级策略是什么? | resolver unavailable 映射为 dependency unavailable、delayed、failed reference 或 degraded query surface;publisher failure 只更新 outbox publication state / job report;handoff/export failure 只保存 failed marker / report;store unavailable 不进入业务写。具体 timeout / retry / backoff 数值由配置设计定义。 |
| 哪些配置细节应留给配置设计文档? | 文件格式、env var、profile 合并、secret / credential source、endpoint、topic 到 transport topic 的绑定、timeout / retry / retention 数值、cron / schedule、batch size 默认值、health probe 和 validation error 文案。 |
| 哪些跨仓 Rust 编译期依赖需要通过本地 path dependency 引入? | 只有 `quantalithos-core/crates/contracts` 的 `core-contracts`,workspace root 使用 `core-contracts = { path = "../quantalithos-core/crates/contracts" }`。其他 sibling repo 不进入 Cargo dependency。 |
| 哪些运行期依赖或事件协作依赖需要通过 adapter / event / projection / fake 表达? | `quantalithos-bus`、`quantalithos-identity`、`quantalithos-process`、`quantalithos-work`、`quantalithos-artifact`、`quantalithos-method-library`、`quantalithos-runtime`、`quantalithos-conversation`、`quantalithos-observability`、`quantalithos-archive`、`quantalithos-sdk` 和 external GRC 系统均通过 adapter / event / handoff / export / API / fake 表达。 |
| 依赖仓库不存在时,当前实现应暂停、使用 fixture / fake,还是等待对应仓库完成? | 编译期 `core-contracts` 不存在时暂停。运行期、事件、handoff、export 依赖不存在时,核心 Governance P0 使用 fake adapter / fixture seed。若正式设计要求读取上游 typed projection / event schema,但上游 contract 未闭合,应暂停回设计收敛,不得在实现侧私造 sibling DTO。 |

## 6. 当前文档问题诊断

| 位置 | 当前问题 | 本步处理 |
|---|---|---|
| Step 6 `GovernanceRuntimeConfig` | 已定义 body-free validated refs,但不展开具体 config binding items | 本 Step 说明 refs 背后的代码绑定项,不把 raw config 写进对象 |
| Step 8 topic map | 已定义 topic-neutral `GovernanceOutboundTopicKey`,但未绑定 deployment transport topic | 本 Step 规定 publisher config 承接 transport binding,Step 8 topic key 不等于 raw bus topic secret |
| Step 13 retention | 幂等、dedup、job retention 只说由 config 规定 | 本 Step 固定 idempotency / event / job retention 配置绑定点 |
| Step 9 handoff/export | target validation 依赖 adapter registry,但未说明 config / target binding | 本 Step 绑定 handoff / external GRC target config 和 adapter availability |
| sibling repos | 本地存在多个仓,实现侧容易误加 Cargo path dependency | 本 Step 再次按编译期 / 运行期 / event / handoff / downstream 分类 |
| `04-配置设计.md` | 当前详细设计校准尚未生成正式配置设计 | 本 Step 只给代码绑定点和待配置设计补充项 |

## 7. 设计取舍

| 议题 | 方案 | 取舍 |
|---|---|---|
| Config ownership | A. contracts 暴露 config;B. infra-local config refs / validated config | 采用 B。配置不是 public protocol,contracts 不携带 runtime config |
| Config 内容粒度 | A. Step 14 写完整配置手册;B. Step 14 写代码绑定点,数值和格式交给 `04` | 采用 B。避免详细设计锁死部署产品 |
| Application 是否持有 config object | A. service 持有 `GovernanceRuntimeConfig`;B. builder 注入 trait / typed parameters | 采用 B。application 不依赖 infra config schema |
| Domain policy 是否读取 config | A. domain 读取 policy config;B. application 加载正式 truth / snapshot 后传入 domain guard | 采用 B。domain 保持纯对象 / policy |
| P0 adapter 默认 | A. 真实 service endpoint 必填;B. in-memory / fake / deterministic adapter 可运行 | 采用 B。支持 contract / application / job tests 先闭环 |
| Sibling repo 使用方式 | A. 本地存在就 Cargo path 引入;B. 除 core-contracts 外全部通过 port/event/fake | 采用 B。保持 L1 平权和边界裁剪 |

## 8. 配置引用表

| 配置项 | 类型 | 读取模块 | 默认值 | 详细配置文档位置 |
|---|---|---|---|---|
| `GovernanceRuntimeConfig.profile_ref` | `GovernanceRuntimeProfileRef` | `infra/config.rs`, `infra/runtime_builder.rs` | `local` / fixture profile for P0 | `04-配置设计.md` runtime profile |
| `GovernanceRuntimeConfig.config_ref` | `GovernanceInfraConfigRef` | `infra/config.rs` | generated / selected validated config ref | config identity |
| `GovernanceRuntimeConfig.truth_store_ref` | `GovernanceStoreConfigRef` | `infra/runtime_builder.rs`, `infra/repositories.rs` | in-memory truth store for P0 | store section |
| `GovernanceRuntimeConfig.projection_store_ref` | `GovernanceStoreConfigRef` | `infra/runtime_builder.rs`, `infra/projection_stores.rs` | in-memory projection store for P0 | projection section |
| `GovernanceRuntimeConfig.reference_store_ref` | `GovernanceStoreConfigRef` | `infra/runtime_builder.rs`, `infra/reference_stores.rs` | in-memory reference store for P0 | reference section |
| `GovernanceRuntimeConfig.outbox_store_ref` | `GovernanceStoreConfigRef` | `infra/runtime_builder.rs`, `infra/outbox_store.rs` | in-memory outbox store for P0 | outbox store section |
| `GovernanceRuntimeConfig.idempotency_store_ref` | `GovernanceStoreConfigRef` | `infra/runtime_builder.rs`, `infra/idempotency_store.rs`, `infra/result_store.rs` | in-memory idempotency/result store for P0 | idempotency/result section |
| `GovernanceRuntimeConfig.source_resolver_refs` | `GovernanceAdapterConfigRefSet` | `infra/source_resolvers.rs` | fake resolver refs for P0 | external resolver section |
| `GovernanceRuntimeConfig.publisher_ref` | `GovernanceAdapterConfigRef` | `infra/publishers.rs`, `worker/outbox_publisher.rs`, `jobs` | fake publisher for P0 | outbound publisher section |
| `GovernanceRuntimeConfig.trace_handoff_target_refs` | `TraceHandoffTargetRefSet` | `infra/handoff_adapters.rs`, `jobs` | `handoff.traceTargets[]` fake target set for P0 | handoff trace target section |
| `GovernanceRuntimeConfig.archive_handoff_target_refs` | `TraceHandoffTargetRefSet` | `infra/handoff_adapters.rs`, `jobs` | `handoff.archiveTargets[]` fake target set for P0 | handoff archive target section |
| `GovernanceRuntimeConfig.external_grc_adapter_ref` | `Option<GovernanceAdapterConfigRef>` | `infra/external_grc.rs`, `jobs` | `None` unless export enabled | external GRC export section |
| `GovernanceRuntimeConfig.external_grc_target_ref` | `Option<TraceHandoffTargetRef>` | `infra/external_grc.rs`, `jobs` | `None` unless export enabled | external GRC target section |
| `GovernanceRuntimeConfig.clock_adapter_ref` | `GovernanceAdapterConfigRef` | `infra/clock_id.rs`, `runtime_builder.rs` | deterministic fake clock in tests;system/runtime adapter otherwise | clock adapter section |
| `GovernanceRuntimeConfig.id_generator_ref` | `GovernanceAdapterConfigRef` | `infra/clock_id.rs`, `runtime_builder.rs` | deterministic fake id generator in tests;runtime adapter otherwise | id generator section |
| `GovernanceBoundaryConfig.max_command_body_bytes` | `ByteSize` | `api/command_handlers.rs` | config design gives value | API boundary section |
| `GovernanceBoundaryConfig.max_page_limit` | `GovernancePageLimit` | `api/query_handlers.rs`, repository list adapters, jobs | config design gives value | page/query section |
| `GovernanceBoundaryConfig.query_read_timeout` | `Duration` | `api/query_handlers.rs`, query service wiring | config design gives value | query section |
| `GovernanceIdempotencyConfig.command_retention` | `Duration` | `infra/idempotency_store.rs` | covers client retry / commit unknown window | idempotency section |
| `GovernanceIdempotencyConfig.event_dedup_retention` | `Duration` | `infra/idempotency_store.rs`, `worker/consumers.rs` | covers bus redelivery window | event dedup section |
| `GovernanceIdempotencyConfig.job_retention` | `Duration` | `infra/idempotency_store.rs`, `jobs` | covers scheduler rerun window | job idempotency section |
| `GovernanceIdempotencyConfig.reserved_record_max_age` | `Duration` | `infra/idempotency_store.rs`, reconciliation / operational audit | config design gives value | idempotency cleanup section |
| `GovernanceProjectionConfig.stale_threshold` | `Duration` | `application/query_service.rs` via typed parameter | config design gives value | projection freshness section |
| `GovernanceProjectionConfig.rebuild_batch_size` | `GovernancePageLimit` | `jobs/rebuild_projections.rs` | config design gives value | projection jobs section |
| `GovernanceJobConfig.default_batch_size` | `GovernancePageLimit` | `jobs/*`, worker loops | config design gives value | jobs section |
| `GovernanceJobConfig.max_parallelism` | `NonZeroUsize` | `worker/*`, `jobs/*` | `1` for deterministic P0 fake unless config overrides | jobs section |
| `GovernanceJobConfig.retry_policy` | `RetryPolicyConfig` | `jobs/*`, resolver / publisher / handoff wrappers | config design gives value | retry section |
| `GovernanceJobConfig.job_timeout` | `Duration` | `jobs/*` | config design gives value | jobs timeout section |
| `GovernanceOutboxConfig.publish_batch_size` | `GovernancePageLimit` | `worker/outbox_publisher.rs`, `jobs/publish_outbox.rs` | config design gives value | outbox publisher section |
| `GovernanceOutboxConfig.publish_retry_policy` | `RetryPolicyConfig` | publisher wrapper / job runner | config design gives value | outbox retry section |
| `GovernanceOutboxConfig.transport_topic_bindings` | `TopicBindingConfig` | `infra/publishers.rs` | fake topic binding in P0 | bus topic binding section |
| `GovernanceHandoffConfig.trace_targets` | `TraceHandoffTargetRefSet` | `infra/handoff_adapters.rs`, adapter registry | fake target set for P0 | `handoff.traceTargets[]` |
| `GovernanceHandoffConfig.archive_targets` | `TraceHandoffTargetRefSet` | `infra/handoff_adapters.rs`, adapter registry | fake target set for P0 | `handoff.archiveTargets[]` |
| `GovernanceExternalGrcConfig.enabled` | `bool` | `infra/external_grc.rs`, job registry | `false` unless adapter ref and target ref are present and config enables | external GRC section |
| `GovernanceExternalGrcConfig.target_ref` | `Option<TraceHandoffTargetRef>` | `infra/external_grc.rs`, job registry | `None` unless export enabled | `externalGrc.targetRef` |
| `GovernanceFeatureConfig.emit_trace_available_event_from_handoff` | `bool` | handoff job service / outbox append helper | `false` unless explicitly enabled | feature section |
| `GovernanceFeatureConfig.derived_view_events_enabled` | `bool` | projection job / outbox append helper | `true` only when Step 8 outbound mapping is enabled | feature section |

`GovernanceBoundaryConfig`、`GovernanceIdempotencyConfig`、`GovernanceProjectionConfig`、`GovernanceJobConfig`、`GovernanceOutboxConfig`、`GovernanceHandoffConfig`、`GovernanceExternalGrcConfig` 和 `GovernanceFeatureConfig` 是 `04-配置设计.md` 需要正式展开的 config sections。本 Step 只声明它们的代码绑定点;这些 section 不进入 public `contracts`。

## 9. Config section 到代码绑定

| Config section | 读取位置 | 注入对象 / 影响点 | 不变量 |
|---|---|---|---|
| runtime profile / config identity | `infra/config.rs`, `runtime_builder.rs` | `GovernanceRuntimeConfig`, `GovernanceRuntimeBuilderState` | profile 不改变 domain state matrix |
| truth store | `infra/repositories.rs` | all Governance truth repositories, `GovernanceUnitOfWorkManager` | 不改变 truth 归属和 logical schema |
| projection store | `infra/projection_stores.rs` | `GovernanceProjectionRepository`, query freshness surface | query 不 rebuild,projection 不反写真相 |
| reference store | `infra/reference_stores.rs` | `ReferenceSnapshotRepository` | 不保存 sibling body |
| outbox store | `infra/outbox_store.rs` | `GovernanceOutboxRepository` | publisher failure 不回滚 accepted truth |
| idempotency/result store | `infra/idempotency_store.rs`, `infra/result_store.rs` | `GovernanceIdempotencyRepository`, `StoredGovernanceResultRepository` | stored result 必须能 replay duplicate |
| boundary | `api/command_handlers.rs`, `api/query_handlers.rs`, worker/job entry validators | request body/page validation | 不绕过 metadata、actor、idempotency、visibility |
| idempotency retention | `infra/idempotency_store.rs` | cleanup / duplicate window / commit unknown audit | retention 不得删除未对账 result |
| jobs | `jobs/*`, `worker/*` | runner batch、parallelism、retry wrapper、timeout | job 不修复 business truth |
| external resolvers | `infra/source_resolvers.rs` | `ExternalGovernanceSourceResolverPort` | 只返回 ref、summary、snapshot、state |
| publisher / topic binding | `infra/publishers.rs` | `GovernanceOutboxPublisherPort` and transport mapping | topic binding 不改变 Step 8 event kind / payload schema |
| handoff / archive | `infra/handoff_adapters.rs` | `GovernanceTraceHandoffPort`, `GovernanceArchiveHandoffPort`, adapter registry | 不保存 package body / external ledger body |
| external GRC | `infra/external_grc.rs` | `ExternalGrcExportPort`, job registry | external GRC 不反写 Governance truth |
| clock / id | `infra/clock_id.rs` | `ClockPort`, `IdGeneratorPort` | domain / handler 不拼 id;time 不由 DB default 隐式产生 |
| features | `runtime_builder.rs`, service registration | route/job/event enablement | feature flag 只能禁用外围能力,不得改变核心 accepted truth 语义 |

## 10. 禁止配置化边界

| 禁止配置化项 | 禁止原因 | 违规处理 |
|---|---|---|
| 改变 Governance truth 归属 | 破坏需求 / 架构数据所有权 | config validation reject |
| 允许保存 process/work/artifact/method/runtime/identity/conversation/observability/archive/external GRC 正文 | 破坏外部正文排除边界 | config validation reject |
| 关闭 command metadata / idempotency key 要求 | 破坏 Step 8 / Step 13 protocol | config validation reject |
| 关闭 accepted command trace / audit / outbox / stored result 写入 | 破坏追溯、事件传播和 duplicate replay | config validation reject |
| 让 query、projection rebuild、reconciliation、handoff、external GRC export 写 core truth | 破坏 derived / operations job 边界 | config validation reject |
| 通过 config 放宽 active policy / shared rule / gate / decision / nonconformity 状态矩阵 | 破坏 domain invariant | config validation reject |
| 通过 config 绕过 actor visibility、capability snapshot、scope guard | 破坏安全边界 | config validation reject |
| 将 non-core sibling repo 配为 Cargo dependency | 破坏 L1 平权和依赖裁剪 | implementation gate reject |
| 把 raw secret、URL、topic、SQL、HTTP response body 写入 Step 6 infra objects | 破坏 body-free config object 规则 | config validation reject / design correction |
| external GRC disabled 时阻断 Governance core command | external GRC 只是 export target,不是 truth 前置 | config validation reject |

## 11. 外部依赖绑定表

| 依赖 | 绑定位置 | 使用接口 | 超时 / 重试 | 降级策略 |
|---|---|---|---|---|
| local truth store | `infra/repositories.rs` | truth repositories + `GovernanceUnitOfWorkManager` | `store.transaction_timeout`;retry only by application policy | unavailable -> no write,return dependency unavailable |
| projection store | `infra/projection_stores.rs` | `GovernanceProjectionRepository` | projection timeout / rebuild retry policy | query returns stale/degraded/missing surface |
| reference store | `infra/reference_stores.rs` | `ReferenceSnapshotRepository` | store timeout / refresh retry | command dependency unavailable;job failed ref |
| outbox store | `infra/outbox_store.rs` | `GovernanceOutboxRepository` | store timeout / publish job retry | publish job partial/failed;truth unchanged |
| idempotency/result store | `infra/idempotency_store.rs`, `infra/result_store.rs` | `GovernanceIdempotencyRepository`, `StoredGovernanceResultRepository` | retention + store timeout | unavailable -> no mutation;duplicate missing -> consistency defect |
| L0-bus / event transport | `infra/publishers.rs` | `GovernanceOutboxPublisherPort.publish` | outbox publish retry policy | mark outbox failed/dead-lettered;truth not rolled back |
| L1-identity | `infra/source_resolvers.rs`, inbound consumer | `resolve_actor_capability`, `ConsumeIdentityActorCapabilityChanged` | resolver timeout / event redelivery window | unresolved actor -> command rejected/delayed or failed reference marker |
| L3-method-library | `infra/source_resolvers.rs`, inbound consumer | `resolve_method_policy`, `resolve_method_control`, method consumers | timeout / retry | unresolved method snapshot -> policy/control command rejected/delayed |
| L1-process | `infra/source_resolvers.rs`, inbound consumer | `resolve_process_context`, `ConsumeProcessGovernanceContextChanged` | timeout / retry | process context stale/unresolved -> degraded query / failed reference |
| L1-work | `infra/source_resolvers.rs`, inbound consumer | `resolve_work_context`, `ConsumeWorkGovernanceContextChanged` | timeout / retry | work context stale/unresolved -> degraded query / failed reference |
| L1-artifact / evidence | `infra/source_resolvers.rs`, inbound consumer | `resolve_evidence_summary`, `ConsumeArtifactEvidenceChanged` | timeout / retry | evidence unresolved -> control/compliance/nonconformity command rejected/delayed |
| L2-runtime | `infra/source_resolvers.rs`, inbound consumer | `resolve_runtime_signal`, `ConsumeRuntimeSignalRecorded` | timeout / retry | runtime signal unresolved -> input/pending marker or failed reference |
| L1-conversation | inbound consumer / source resolver family | `ConsumeConversationContextChanged` / body-free context ref | event redelivery / resolver retry | conversation body never saved;decision/trace views degraded |
| L4-observability signals | inbound consumer / resolver family | `ConsumeObservabilityAlertRaised` | event redelivery / resolver retry | alert body not saved;nonconformity/dashboard may be stale |
| L4-observability handoff | `infra/handoff_adapters.rs` | `GovernanceTraceHandoffPort` | handoff timeout / retry policy | failed handoff marker / job report;local trace retained |
| L4-archive | `infra/handoff_adapters.rs` | `GovernanceArchiveHandoffPort` | handoff timeout / retry policy | failed archive marker;archive package body not saved |
| external GRC system | `infra/external_grc.rs` | `ExternalGrcExportPort` | export timeout / retry policy | disabled -> job rejected;failure -> failed marker/report;no Governance truth change |
| system clock | `infra/clock_id.rs` | `ClockPort.now` | no retry unless adapter unavailable | deterministic fake for tests;unavailable -> dependency unavailable |
| id generation | `infra/clock_id.rs` | `IdGeneratorPort.new_*` | no retry unless adapter unavailable | deterministic fake for tests;unavailable -> reject/unavailable before mutation |
| adapter registry | `infra/runtime_builder.rs`, `infra/adapter_registry.rs` | `GovernanceAdapterRegistryPort` | health / availability check policy | disabled/unavailable target -> rejected job or failed marker |

## 12. Outbound topic / schema binding

Step 8 defines topic-neutral keys. Step 14 binds those keys to runtime publisher config. The binding must be total for all enabled outbound events.

| Event kind | Step 8 topic key | Config binding requirement | Disabled behavior |
|---|---|---|---|
| `GovernanceContextChanged` | `governance.context.changed.v1` | publisher config maps key to transport topic / route | startup validation fails if command outbox enabled |
| `GateChanged` | `governance.gate.changed.v1` | same | startup validation fails if command outbox enabled |
| `GovernanceDecisionChanged` | `governance.decision.changed.v1` | same | startup validation fails if command outbox enabled |
| `ApprovalResponsibilityChanged` | `governance.approval.changed.v1` | same | startup validation fails if command outbox enabled |
| `PolicyEffectiveFactChanged` | `governance.policy.effective.changed.v1` | same | startup validation fails if policy outbox enabled |
| `SharedRuleSetChanged` | `governance.shared-rule-set.changed.v1` | same | startup validation fails if shared rule outbox enabled |
| `PolicyConflictChanged` | `governance.policy-conflict.changed.v1` | same | startup validation fails if conflict outbox enabled |
| `ControlApplicabilityChanged` | `governance.control-applicability.changed.v1` | same | startup validation fails if control outbox enabled |
| `ComplianceConclusionChanged` | `governance.compliance-conclusion.changed.v1` | same | startup validation fails if compliance outbox enabled |
| `NonconformityChanged` | `governance.nonconformity.changed.v1` | same | startup validation fails if nonconformity outbox enabled |
| `GovernanceTraceAvailable` | `governance.trace.available.v1` | required only when trace available emission feature is enabled | feature disabled -> no trace available outbox append |
| `DerivedGovernanceViewChanged` | `governance.derived-view.changed.v1` | required only when derived view event feature is enabled | feature disabled -> projection state still saved,no event append |

Publisher config must not change `GovernanceOutboxEventKind`, schema version, payload DTO, outbox subject or source cursor. It only maps the Step 8 topic-neutral key to a transport route and adapter credentials.

## 13. Cross-repo Rust dependency binding

| 依赖仓库 | 全局依赖类型 | 本地路径 | Cargo 引用方式 / 协作方式 | 使用位置 | 不可用时处理 |
|---|---|---|---|---|---|
| `quantalithos-core` | 编译期依赖 | `/home/aris/Projects/quantalithos-core` | `core-contracts = { path = "../quantalithos-core/crates/contracts" }`;member crate 使用 workspace dependency | contracts / domain / application / infra shared actor、metadata、trace、page、timestamp、shared refs | 暂停需要 core contracts 的实现 |
| `quantalithos-bus` | event transport dependency | `/home/aris/Projects/quantalithos-bus` | 不进 Cargo;通过 `GovernanceOutboxPublisherPort` / fake publisher | outbound event publish、inbound event worker | P0 fake;正式 bus binding 缺失则回设计 |
| `quantalithos-identity` | runtime / event dependency | `/home/aris/Projects/quantalithos-identity` | 不进 Cargo;通过 resolver / inbound event DTO / fake snapshot | actor capability、visibility、approval | P0 fake;正式 typed event 缺失则回设计 |
| `quantalithos-method-library` | runtime / event dependency | `/home/aris/Projects/quantalithos-method-library` | 不进 Cargo;通过 method policy/control resolver and events | policy effective fact、control applicability | P0 fake;method snapshot schema 缺失则回设计 |
| `quantalithos-process` | runtime / event dependency | `/home/aris/Projects/quantalithos-process` | 不进 Cargo;通过 process context resolver and events | governed subject、context, gate/decision consumers | P0 fake;typed projection/event 缺失则回设计 |
| `quantalithos-work` | runtime / event dependency | `/home/aris/Projects/quantalithos-work` | 不进 Cargo;通过 work context resolver and events | governed subject、nonconformity source | P0 fake;typed projection/event 缺失则回设计 |
| `quantalithos-artifact` | runtime / evidence dependency | `/home/aris/Projects/quantalithos-artifact` | 不进 Cargo;通过 artifact/evidence resolver and events | control review、AIIA / SoA、verification evidence | P0 fake;artifact body never imported |
| `quantalithos-runtime` | runtime / event dependency | `/home/aris/Projects/quantalithos-runtime` | 不进 Cargo;through runtime signal event/resolver | runtime signal input、observability-triggered governance | P0 fake |
| `quantalithos-conversation` | event / context dependency | `/home/aris/Projects/quantalithos-conversation` | 不进 Cargo;through conversation context event/resolver | decision context、trace/degraded view | P0 fake;conversation body never imported |
| `quantalithos-observability` | inbound signal / handoff dependency | `/home/aris/Projects/quantalithos-observability` | 不进 Cargo;through observability alert event and `GovernanceTraceHandoffPort` | observability alert consumer、trace handoff | P0 fake handoff |
| `quantalithos-archive` | handoff / downstream dependency | `/home/aris/Projects/quantalithos-archive` | 不进 Cargo;through `GovernanceArchiveHandoffPort` | archive handoff job | P0 fake archive adapter |
| `quantalithos-sdk` | downstream client | `/home/aris/Projects/quantalithos-sdk` | 不进 Cargo;SDK consumes public contracts/API | clients / release coordination | not blocking Governance P0 |
| external GRC system | export target | deployment-specific | 不进 Cargo;through `ExternalGrcExportPort` | external GRC export job | disabled by default;fake for tests |

## 14. Runtime builder 绑定顺序

```text
GovernanceConfigLoader.load(profile)
  -> GovernanceConfigValidator.validate(...)
  -> GovernanceRuntimeConfig::from_validated_refs(...)
  -> GovernanceRuntimeBuilderState::for_config(...)
  -> validate invariant-safe config combinations
  -> build store registry and store adapters
  -> build UnitOfWorkManager
  -> build idempotency / stored result repository
  -> build source resolver / publisher / handoff / external GRC adapters
  -> build ClockPort / IdGeneratorPort
  -> build application services from Step 7 ports
  -> build API handlers / worker consumers / job runners
  -> mark builder Ready and expose facade
```

Runtime builder rules:

- `GovernanceRuntimeBuilder` lives in `infra/runtime_builder.rs`.
- `infra/config.rs` owns config loading, validation, redacted issue refs and conversion to `GovernanceRuntimeConfig`.
- `application` service constructors receive Step 7 port traits, typed policy parameters or generic adapters,not raw config objects.
- `domain` receives only explicit factory / policy method inputs,never config or adapter handles.
- `api` / `worker` / `jobs` may receive boundary / runner parameters already validated by `infra`.
- fake runtime must allow deterministic clock, id generator, resolver, publisher and handoff results for tests.
- `handoff.traceTargets[]`、`handoff.archiveTargets[]` 和 `externalGrc.targetRef` are target refs,not adapter refs;runtime builder must preserve them as target sets / optional target and must not synthesize `GovernanceAdapterConfigRef` from them.
- `clockId.clockAdapterRef` and `clockId.idGeneratorRef` are separate adapter refs;runtime builder must inject ClockPort and IdGeneratorPort separately and must not synthesize a combined clock/id adapter ref.
- builder cannot expose facade unless all blocking slots are enabled or intentionally disabled by a rule that does not affect core command acceptance.

## 15. 前序契约回填审计

| 前序 Step | 审计结论 | 是否需要回填 |
|---|---|---|
| Step 3 constraints | 唯一 Cargo path dependency 与运行期 / event / handoff 隔离已与本 Step 一致 | 不需要 |
| Step 4 file layout | `infra/config.rs`、`runtime_builder.rs`、adapter file responsibilities 已能承接本 Step | 不需要 |
| Step 5 module contracts | `infra` config binding / runtime assembly 职责已一致,application/domain 不读配置 | 不需要 |
| Step 6 object contracts | `GovernanceRuntimeConfig`、config refs、availability marker、adapter state 已闭合;本 Step 未新增 raw config object | 不需要 |
| Step 7 ports | resolver、publisher、handoff、external GRC、adapter registry、Clock、IdGenerator、repositories 均有注入点 | 不需要 |
| Step 8 protocol | topic-neutral keys、job metadata、job inputs 已有绑定点;transport binding 留本 Step/配置设计 | 不需要 |
| Step 9 flows | adapter / publisher / handoff / export 调用位置已闭合;本 Step 提供 config / availability 来源 | 不需要 |
| Step 13 idempotency | retention / duplicate window 由本 Step 固定 config binding,数值留 `04` | 不需要 |

## 16. 回填草稿

> 校准来源:
> - `projects/L1-governance/design-calibration/03_ddd_step_14_config_external_binding.md`
>
> 延伸阅读:
> - Step 6 `GovernanceRuntimeConfig` / adapter availability marker
> - Step 7 resolver / publisher / handoff / adapter registry ports
> - Step 8 outbound topic map and job metadata
> - Step 13 idempotency / duplicate retention rules

### 5.13 配置引用与外部依赖绑定

Governance 详细设计只定义代码需要读取的配置绑定点、读取模块、默认口径和 adapter 注入位置,不替代 `04-配置设计.md`。完整配置文件格式、环境变量、profile 合并、secret 管理、endpoint、topic transport binding、timeout / retry / retention 数值、cron 和部署矩阵必须由配置设计给出。

`GovernanceRuntimeConfig` 是 infra-local validated config surface,归属 `infra/config.rs`,由 `GovernanceRuntimeBuilder` 转换为 repository、UnitOfWork、projection、reference、outbox、idempotency/result、resolver、publisher、handoff、external GRC、clock 和 id generator adapters。`application` 只依赖 Step 7 port trait;`domain` 和 `contracts` 不读取配置。

配置不得改变 Governance truth 归属、外部正文排除、command metadata / idempotency 必填、accepted trace / audit / outbox / stored result、query no-write、job no-truth-repair、状态矩阵、actor visibility / capability guard 和唯一编译期依赖纪律。违反这些边界的配置必须在 validation 阶段 reject。

唯一编译期 dependency 是:

```toml
core-contracts = { path = "../quantalithos-core/crates/contracts" }
```

其他依赖只能通过 adapter、event、handoff、export、API、projection 或 fake 表达,不得进入 Cargo dependency。

## 17. 待确认事项

| 编号 | 待确认项 | 当前口径 | 影响 |
|---|---|---|---|
| GVN-DDD14-OPEN-001 | `04-配置设计.md` 是否新建并按配置 SOP 展开 | 当前尚未生成;本 Step 只提供详细设计绑定点 | 后续配置设计任务 |
| GVN-DDD14-OPEN-002 | timeout / retry / retention / batch / parallelism 默认数值 | 本 Step 不写数值,只写字段与读取位置 | 配置设计 / implementation defaults |
| GVN-DDD14-OPEN-003 | durable store、bus、projection、search、idempotency 产品选择 | P0 默认 in-memory / fake,不锁定 PostgreSQL、NATS、Redis、Elastic 等产品 | durable adapter phase |
| GVN-DDD14-OPEN-004 | external GRC export 默认是否启用 | 当前默认 disabled unless config and adapter ref enable it | external GRC job tests / deployment profile |
| GVN-DDD14-OPEN-005 | trace available / derived view changed outbound event 是否默认启用 | 当前由 feature config 控制,enabled 后 topic binding 必须完整 | outbox tests / publisher config |

## 18. 进入下一步条件

| 条件 | 结论 |
|---|---|
| 配置读取模块是否明确 | 通过 |
| 配置引用表是否覆盖 store、boundary、idempotency、projection、jobs、outbox、external、handoff、external GRC、clock/id、features | 通过 |
| 外部依赖是否全部绑定到 Step 7 port / adapter / event / fake | 通过 |
| 跨仓 Rust 编译期依赖是否只有 `core-contracts` | 通过 |
| 禁止配置化边界是否列出 | 通过 |
| topic-neutral key 到 transport binding 的职责是否明确 | 通过 |
| 是否仍需实现侧自行补 config schema / adapter binding | 不需要;具体数值和文件格式留给 `04-配置设计.md` |

下一步进入 Step 15:可观测性与审计埋点契约。
