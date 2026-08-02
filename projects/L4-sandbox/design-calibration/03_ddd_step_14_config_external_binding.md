# Step 14. 定义配置引用与外部依赖绑定

> 对应 SOP: `standards/document/详细设计讨论流程_SOP.md` Step 14
> 回填章节: `03-详细设计.md` §13 配置引用与外部依赖绑定
> 生成日期: 2026-07-09
> 状态: completed_wait_user_review
> 所属流程: `03_ddd_calibration_flow.md`
> 本 Step 口径: 在 Step 3 依赖裁剪、Step 4 文件布局、Step 7 port / adapter 契约、Step 8 协议契约、Step 11 持久化 / 一致性和 Step 13 并发 / 幂等口径基础上,定义 L4-sandbox 的配置读取边界、runtime config 绑定点、外部依赖注入方式和跨仓 Rust 依赖方式。本步不写完整配置手册、具体配置 key、环境变量、secret、真实 endpoint、真实 transport topic、cron、timeout / retry / retention 数值、部署 profile、测试结果、run_id、evidence alias、验收签署、实施 commit boundary 或正式 `03-详细设计.md`。

---

## 1. Step 开工确认

| 检查项 | 结论 |
|---|---|
| 用户是否已确认进入 Step 14 | 是。Step 13 审查点后用户已回复“同意”,允许进入 Step 14。 |
| 项目级台账是否允许进入 Step 14 | 是。原恢复点为 Step 13 `pass_wait_review`;用户确认后可进入本步。 |
| 文档级 flow 是否允许进入 Step 14 | 是。`03_ddd_calibration_flow.md` 原记录 Step 14 `blocked_by_step_13`,用户确认后门禁满足。 |
| 是否已读取 Step 14 SOP | 是。本步必须输出配置引用表、外部依赖绑定表和跨仓 Rust 依赖绑定表。 |
| 是否已读取详细设计书写规范 §5.13 | 是。本章只写代码绑定点,运行期 / 事件协作依赖不得写 Cargo path dependency。 |
| 是否已读取真相源闭环标准配置条目 | 是。配置不得改变 truth owner、状态矩阵、metadata / idempotency、visibility、query no-write、job no-repair、外部正文排除或 phase boundary。 |
| 是否已读取全局依赖裁剪规则 | 是。只有编译期依赖可写 Cargo path dependency,运行期 / 事件协作依赖只能通过 adapter / event / projection / fake 表达。 |
| 是否已读取上游详细设计 Step | 是。重点读取 Step 3/4/7/8/11/13,并参考 `L1-governance`、`L1-artifact` Step 14 粒度。 |
| 是否发现阻塞 Step 14 的上游 blocker | 未发现阻塞本步生成的 blocker。`04-配置设计.md` 与 `07-实施计划.md` 缺失仍是 downstream gap,不阻塞本步。 |

---

## 2. 本步目标

本步把配置与外部依赖固定到实现者可以直接装配 runtime 的粒度:

- 哪些模块允许读取 raw / validated config,哪些模块只能接收已注入的 port、typed refs 或参数。
- `SandboxRuntimeConfigSummary` 背后的 store、adapter、publisher、handoff、backend、job、idempotency 和 boundary 绑定点。
- runtime / event / handoff / backend / store 依赖如何经 Step 7 port 注入,不得进入 `domain` / `contracts`。
- outbound topic-neutral event kind 如何映射到部署 transport route,且不改变 Step 8 event kind、schema version、payload DTO 或 source cursor。
- inbound event source、schema allowlist、dedup / quarantine 与 worker enablement 如何由 config 装配,且不改变 consumer payload 或幂等语义。
- 唯一可进入 Cargo path dependency 的 sibling repo 是 `quantalithos-core` 的 `core-contracts`;其他仓、后端产品和 bus 均不得成为编译期业务依赖。
- 当外部依赖不可用时,实现应启动阻断、返回 degraded / unavailable、使用 fake / fixture,还是等待上游设计闭口。

本步不处理:

- `04-配置设计.md` 的完整配置文件结构、profile 合并、env var 名、CLI flag 名、secret / credential source、endpoint、topic 原名、cron、retry / timeout / retention / batch 数值和 validation error 文案。
- Step 15 的 log / metric / trace / audit 字段全集。
- Step 16 的测试 case 全集或真实运行结果。
- Step 17 / `07-实施计划.md` 的 phase boundary、implementation ledger 和 planned boundary skeleton。

---

## 3. 本步输入

| 输入 | 状态 | 本 Step 用途 |
|---|---|---|
| `project_execution_ledger.md` | 已读取 | 确认当前恢复点、用户门禁和 downstream gap。 |
| `03_ddd_calibration_flow.md` | 已读取 | 确认 Step 1~13 已完成,正式 `03` 仍不得修改。 |
| `03_ddd_step_03_constraints.md` | 已读取 | 固定 Rust、`core-contracts` 唯一编译期依赖、运行期 / 事件 / handoff 依赖不得进 Cargo。 |
| `03_ddd_step_04_file_layout.md` | 已读取 | 固定 `crates/infra/src/config.rs`、`runtime_builder.rs`、adapter 文件职责和 workspace 依赖位置。 |
| `03_ddd_step_05_module_contracts.md` | 已完成并承接 | 固定 `infra` 负责 config binding 与 runtime assembly,`application/domain/contracts` 不读取配置。 |
| `03_ddd_step_06_object_contracts.md` | 已读取 | 提供 `SandboxRuntimeConfigSummary`、`AdapterAvailabilityState`、`SandboxAdapterKind` 和 stable adapter outcome。 |
| `03_ddd_step_07_trait_port_adapter_contracts.md` | 已读取 | 提供 repository、UoW、Clock、IdGenerator、resolver、policy、backend、handoff、publisher、runtime builder port。 |
| `03_ddd_step_08_protocol_contracts.md` | 已读取 | 提供 Command / Query / Consumer / Outbound Event / Job 协议名、DTO、receipt、report 和 event kind。 |
| `03_ddd_step_09_function_flows.md` | 已完成并承接 | 提供 command / query / consumer / relay / maintenance / handoff flow 的 adapter 调用位置。 |
| `03_ddd_step_11_persistence_transaction_consistency.md` | 已读取 | 提供 logical store、transaction、relay、projection、stored result 和 fake / durable parity。 |
| `03_ddd_step_12_error_recovery.md` | 已完成并承接 | 提供 adapter unavailable、disabled、degraded、quarantine、dead-letter 和 config unavailable 错误映射。 |
| `03_ddd_step_13_concurrency_idempotency.md` | 已读取 | 提供 idempotency retention、duplicate replay、retry identity、reserved record 和 job rerun 绑定需求。 |
| 正式 `00/01/02` | 已读取过并在前序 Step 承接 | 提供 sandbox truth ownership、coherent boundary、policy fail-closed、capture / handoff 分层、cleanup / redline、依赖裁剪和配置不可越界。 |
| `L1-governance` / `L1-artifact` Step 14 | 已参考 | 只作为同类 Step 粒度参考,本文件按 Sandbox 语义重写。 |

---

## 4. Step 内计划

| 顺序 | 动作 | 状态 | 产物 / 门禁 |
|---:|---|---|---|
| 1 | 恢复项目级台账、文档级 flow 和 Step 13 当前文件。 | done | 确认用户已允许进入 Step 14。 |
| 2 | 读取 Step 14 SOP、详细设计书写规范 §5.13、真相源闭环标准 §2.12 和全局依赖裁剪规则。 | done | 明确配置引用表、外部依赖绑定表、跨仓 Rust 依赖绑定表为必出。 |
| 3 | 从 Step 3/4/7/8/11/13 抽取 config owner、adapter slot、topic-neutral event、job、idempotency 和外部依赖输入池。 | done | 形成本步配置和依赖候选池。 |
| 4 | 固定配置读取边界、配置引用表、config section 到代码绑定和禁止配置化边界。 | done | 防止 config 改写 sandbox truth / state / idempotency / query / job / redline。 |
| 5 | 固定外部依赖绑定表、inbound/outbound event binding、adapter availability 和降级策略。 | done | 实现者可按表装配 fake / durable adapter。 |
| 6 | 固定跨仓 Rust 依赖绑定、runtime builder 顺序、historical material / blocker、回填草稿和 Step 15 handoff。 | done | Step 15 只承接 observability / audit,不重写配置语义。 |
| 7 | 更新 `03_ddd_calibration_flow.md` 和项目级台账。 | done | 当前恢复点停在 Step 14 审查点,不跨到 Step 15。 |

---

## 5. SOP 问题回答

| SOP 问题 | 本步回答 |
|---|---|
| 哪些模块需要读取配置 | `infra/config.rs` 读取 raw config 并产出 validated refs / sanitized summary;`infra/runtime_builder.rs` 读取 validated config refs 并装配 repositories / adapters / services;`api`、`worker`、`jobs` entry 只读取本入口 local args 和 builder 产出的 validated runtime handle。`application` 只接收 Step 7 port trait、typed timeout / limit / freshness 参数或 service constructor 参数;`domain` 和 `contracts` 不读取配置。 |
| 配置项的类型、默认值和读取位置是什么 | 本步定义配置绑定项名称、类型归类、读取模块和默认口径。P0 / local 默认使用 in-memory / fake / deterministic adapter;数值默认值、env var、文件结构和 profile 合并规则留给 `04-配置设计.md`。 |
| 哪些外部依赖需要通过 adapter 注入 | context reference resolver、policy summary、backend capability、isolation backend、execution capture、material handoff、observability handoff、investigation handoff、event publisher、store、clock、id generator、adapter registry 均通过 Step 7 port / infra adapter 注入。 |
| 外部依赖的超时、重试、降级策略是什么 | store unavailable 在 mutation 前 fail;resolver / policy / capability unavailable 映射为 rejected / delayed / fail-closed / degraded;publisher failure 只更新 relay record / job report;handoff failure 只更新 handoff fact / report;backend launch / inspect / release failure 通过 formal outcome 进入 run / failure / cleanup / reaper flow。具体 timeout / retry / dead-letter / retention 数值由 `04` 定义。 |
| 哪些配置细节应留给配置设计文档 | raw key、JSON / TOML / env schema、CLI flag / env var 名、endpoint、secret、transport topic、cron、timeout、retry、backoff、retention、lease window、batch size、parallelism、profile matrix、health probe 和 validation error 文案。 |
| 哪些跨仓 Rust 编译期依赖需要通过本地 path dependency 引入 | 只有 `/home/aris/Projects/quantalithos-core/crates/contracts` 的 `core-contracts`,workspace root 使用 `core-contracts = { path = "../quantalithos-core/crates/contracts" }`;member 使用 `core-contracts.workspace = true`。 |
| 哪些运行期依赖或事件协作依赖需要通过 adapter / event / projection / fake 表达 | `quantalithos-bus`、identity、work、governance / policy、method-library / capability、tools、runtime、member-service、runner、artifact、observability、archive / investigation target、backend 产品、DB / object store / secret / OTel 等都只能通过 adapter、event、projection、handoff、safe summary、API 或 fake 表达。 |
| 依赖仓库不存在时,当前实现应暂停、使用 fixture / fake,还是等待对应仓库完成 | `core-contracts` 不存在时暂停。运行期 / event / handoff 依赖不存在时,P0 使用 fake / fixture / controlled adapter;若正式 typed payload、safe summary 或 policy summary 未闭口,必须回设计收敛,不得在实现侧私造 sibling DTO 或把 sibling repo 加进 Cargo。 |

---

## 6. 当前文档问题诊断

| 位置 | 当前问题 | 本步处理 |
|---|---|---|
| Step 6 `SandboxRuntimeConfigSummary` | 只定义 validated profile / adapter summary,未列出具体 binding sections。 | 本步定义 infra-local config section 与代码绑定,但不把 raw config 写进 domain / contracts。 |
| Step 7 `SandboxRuntimeConfigPort` | 已定义 summary loader / adapter availability checker,但未说明哪些 entry / builder 读取配置。 | 本步固定 `infra/config.rs` 与 `runtime_builder.rs` 为 config owner,entry 只读 local args + validated handle。 |
| Step 8 outbound event | 已定义 13 个 outbound event kind,未绑定 topic-neutral key 到 transport route。 | 本步用 event kind 派生 topic-neutral key,由 publisher config 绑定部署 route;不得改 event schema。 |
| Step 8 inbound consumer | 已定义 9 个 consumer envelope / payload / receipt,未绑定 source subscription / fixture feed。 | 本步定义 worker source binding,但不改变 payload DTO、dedup、schema 或 quarantine 语义。 |
| Step 13 idempotency retention | 幂等窗口和 record age 只说由配置承接。 | 本步固定 command / consumer / job / stored result retention 的 config binding point。 |
| Step 3 / Step 4 sibling repo | 多个 sibling repo 已存在,实现侧容易误加 path dependency。 | 本步再次固定只有 `core-contracts` 可进入 Cargo,其他全部为 runtime / event / handoff / fake。 |
| `04-配置设计.md` | 当前正式 `04` 缺失。 | 本步只提供代码绑定点和 `04` 承接清单,不替代正式配置设计。 |

---

## 7. 设计取舍 / 配置边界规则

| 议题 | 方案 | 取舍 |
|---|---|---|
| Config ownership | A. `contracts` 暴露 config;B. `infra` 拥有 raw / validated config,只输出 sanitized summary | 采用 B。配置不是 public protocol,下游不应依赖 sandbox runtime config schema。 |
| Application 是否持有 config object | A. service 持有 `SandboxRuntimeConfig`;B. builder 注入 port trait 和 typed 参数 | 采用 B。application 不依赖 infra config schema,只依赖 Step 7 port。 |
| Domain 是否读取 policy / boundary config | A. domain 读取 config;B. application 传入正式 truth / snapshot / typed limit | 采用 B。domain 保持对象不变量和状态迁移纯净。 |
| Backend 产品配置 | A. 详细设计锁定 Docker / gVisor / k8s;B. Step 14 只绑定 `IsolationBackendPort` 与 backend profile ref | 采用 B。产品组合留给 `04/07/ADR`,当前只要求 no weak fallback。 |
| P0 默认 adapter | A. 真 service endpoint 必填;B. fake / in-memory / deterministic adapter 可跑 contract tests | 采用 B。P0 可验证主链,但 fake 必须遵守 Step 11/13 parity。 |
| Topic binding | A. Step 14 写真实 topic 名;B. 写 topic-neutral key 到 transport route 的绑定要求 | 采用 B。避免部署细节替代协议契约。 |
| Sibling repo 使用 | A. 本地存在就 path dependency;B. 除 `core-contracts` 外全部 port / event / fake | 采用 B。保护 L4 基础设施边界和全局依赖裁剪。 |

配置通用边界:

- config 只能影响 adapter 选择、store 选择、topic route、timeout / retry / retention / batch、lease / cadence、feature enablement、degraded exposure 和 startup validation。
- config 不得改变 execution isolation truth ownership、coherent boundary 必须整体成立、policy fail-closed、capture truth / handoff truth 分层、cleanup guard、redline containment、query no-write、job no-truth-repair、external body exclusion、idempotency key / digest / stored result replay 或 phase boundary。
- `contracts/domain/application` 不读取 raw config;`api/worker/jobs` 不把 local args 转成业务捷径,只能转成正式 DTO、job input 或 runtime profile selection。

---

## 8. 配置读取边界

| 模块 / 文件 | 是否读取 raw config | 可读取内容 | 输出 / 注入对象 | 禁止事项 |
|---|---:|---|---|---|
| `crates/infra/src/config.rs` | 是 | config source、profile、adapter refs、store refs、binding refs、redacted issue refs | validated config refs、`SandboxRuntimeConfigSummary`、startup validation result | 输出 secret、raw endpoint、raw topic、external body、deployment credential。 |
| `crates/infra/src/runtime_builder.rs` | 否,只读 validated refs | validated config refs、adapter availability、store / target refs | repositories、ports、application services、entry runtime handles | 在 builder 中放宽 domain guard 或默认 allow。 |
| `crates/infra/src/*_adapters.rs` | 否,只接收 adapter-specific validated ref | backend / handoff / publisher / resolver / store adapter ref | concrete adapter instance | 让 adapter raw error string 成为 domain state。 |
| `crates/api/src/bin/sandbox-api.rs` | 只读 entry local args | config path / profile selection / diagnostics mode 等 local entry 参数 | `SandboxApiServiceSet` / handlers | 用 CLI flag 表达复杂业务 scope 或绕过 command metadata。 |
| `crates/worker/src/worker_runtime.rs` | 只读 worker local args + validated runtime handle | worker profile、consumer enablement、source subscription refs | consumer runtime、fulfillment worker、relay worker | 直接访问 repositories 或自行解析 event body。 |
| `crates/jobs/src/*` | 只读 job input + validated runtime handle | job run ref、job input path / DTO、profile selection | `SandboxJobService` / `SandboxJobReportDto` | 用 raw flag 替代 typed job spec / idempotency key。 |
| `crates/application/src/*` | 否 | service constructor typed params、Step 7 ports | command / query / consumer / job services | 读取 env、config file、transport topic、endpoint、secret。 |
| `crates/domain/src/*` | 否 | domain method inputs | truth objects、state transition、guard result | 根据 config 改变状态矩阵或 invariant。 |
| `crates/contracts/src/*` | 否 | public DTO fields only | protocol DTO / event / job / error schema | 携带 runtime config schema、adapter refs、secret、endpoint。 |

---

## 9. 配置引用表

| 配置项 | 类型 | 读取模块 | 默认值 | 详细配置文档位置 |
|---|---|---|---|---|
| `SandboxRuntimeConfig.profile_ref` | `SandboxRuntimeProfileRef` | `infra/config.rs`;`infra/runtime_builder.rs` | `local` / fixture profile for P0 | `04-配置设计.md` runtime profile section |
| `SandboxRuntimeConfig.config_ref` | `SandboxInfraConfigRef` | `infra/config.rs` | generated / selected validated config ref | config identity section |
| `SandboxRuntimeConfig.truth_store_ref` | `SandboxStoreConfigRef` | `infra/runtime_builder.rs`;`infra/truth_repositories.rs` | in-memory truth store for P0 | store section |
| `SandboxRuntimeConfig.projection_store_ref` | `SandboxStoreConfigRef` | `infra/runtime_builder.rs`;`infra/projection_repositories.rs` | in-memory projection store for P0 | projection section |
| `SandboxRuntimeConfig.derived_store_ref` | `SandboxStoreConfigRef` | `infra/runtime_builder.rs`;`infra/projection_repositories.rs` | in-memory derived store for P0 | derived / reconciliation section |
| `SandboxRuntimeConfig.reference_store_ref` | `SandboxStoreConfigRef` | `infra/runtime_builder.rs`;`infra/context_resolvers.rs`;reference repositories | in-memory reference marker store for P0 | reference state section |
| `SandboxRuntimeConfig.relay_store_ref` | `SandboxStoreConfigRef` | `infra/runtime_builder.rs`;`infra/publishers.rs` | in-memory relay store for P0 | relay store section |
| `SandboxRuntimeConfig.idempotency_store_ref` | `SandboxStoreConfigRef` | `infra/runtime_builder.rs`;`infra/idempotency_store.rs`;`infra/result_store.rs` | in-memory idempotency/result store for P0 | idempotency / stored result section |
| `SandboxRuntimeConfig.context_resolver_ref` | `SandboxAdapterConfigRef` | `infra/context_resolvers.rs` | fake resolver for P0 | context resolver section |
| `SandboxRuntimeConfig.policy_summary_ref` | `SandboxAdapterConfigRef` | `infra/policy_adapters.rs` | fake / fixture policy summary adapter for P0 | policy summary section |
| `SandboxRuntimeConfig.backend_capability_ref` | `SandboxAdapterConfigRef` | `infra/backend_capability_adapters.rs`;jobs | fake capability adapter for P0 | backend capability section |
| `SandboxRuntimeConfig.isolation_backend_ref` | `SandboxAdapterConfigRef` | `infra/isolation_backend_adapters.rs`;worker | disabled / controlled fake unless explicit backend profile enabled | isolation backend section |
| `SandboxRuntimeConfig.execution_capture_ref` | `SandboxAdapterConfigRef` | `infra/isolation_backend_adapters.rs`;worker | deterministic fake capture for P0 | execution capture section |
| `SandboxRuntimeConfig.material_handoff_ref` | `SandboxAdapterConfigRef` | `infra/handoff_adapters.rs`;jobs | fake handoff adapter for P0 | material handoff section |
| `SandboxRuntimeConfig.observability_handoff_ref` | `SandboxAdapterConfigRef` | `infra/handoff_adapters.rs`;jobs | fake observability handoff for P0 | observability handoff section |
| `SandboxRuntimeConfig.investigation_handoff_ref` | `SandboxAdapterConfigRef` | `infra/handoff_adapters.rs`;jobs | fake / disabled unless redline handoff enabled | investigation handoff section |
| `SandboxRuntimeConfig.event_publisher_ref` | `SandboxAdapterConfigRef` | `infra/publishers.rs`;`worker/event_relay_worker.rs`;jobs | fake publisher for P0 | outbound publisher section |
| `SandboxRuntimeConfig.clock_adapter_ref` | `SandboxAdapterConfigRef` | `infra/clock_id.rs`;`runtime_builder.rs` | deterministic fake clock in tests;system clock otherwise | clock adapter section |
| `SandboxRuntimeConfig.id_generator_ref` | `SandboxAdapterConfigRef` | `infra/clock_id.rs`;`runtime_builder.rs` | deterministic fake id generator in tests;runtime adapter otherwise | id generator section |
| `SandboxBoundaryConfig.max_command_body_bytes` | `ByteSize` | `api/command_handlers.rs`;worker entry validators | value from `04` | API / worker boundary section |
| `SandboxBoundaryConfig.max_query_page_limit` | `SandboxPageLimit` | `api/query_handlers.rs`;repository list adapters;jobs | value from `04` | page/query section |
| `SandboxBoundaryConfig.sync_command_timeout` | `Duration` | `api/command_handlers.rs`;command service wrapper | value from `04` | sync command timeout section |
| `SandboxBoundaryConfig.query_read_timeout` | `Duration` | `api/query_handlers.rs`;query service wrapper | value from `04` | query timeout section |
| `SandboxIdempotencyConfig.command_retention` | `Duration` | `infra/idempotency_store.rs` | covers client retry / commit unknown window | command idempotency section |
| `SandboxIdempotencyConfig.event_dedup_retention` | `Duration` | `infra/idempotency_store.rs`;`worker/*_consumers.rs` | covers event redelivery window | event dedup section |
| `SandboxIdempotencyConfig.job_retention` | `Duration` | `infra/idempotency_store.rs`;`jobs/*` | covers scheduler rerun window | job idempotency section |
| `SandboxIdempotencyConfig.stored_result_retention` | `Duration` | `infra/result_store.rs`;duplicate replay paths | at least covers related idempotency record retention | stored result section |
| `SandboxIdempotencyConfig.reserved_record_max_age` | `Duration` | `infra/idempotency_store.rs`;operational audit / reconciliation | value from `04` | idempotency cleanup section |
| `SandboxReferenceConfig.refresh_batch_size` | `SandboxPageLimit` | `jobs/reference_refresh.rs` | value from `04` | reference refresh section |
| `SandboxReferenceConfig.stale_threshold` | `Duration` | command guards;query degraded mapper;jobs | value from `04` | reference freshness section |
| `SandboxBackendCapabilityConfig.backend_profile_refs` | `Vec<SandboxOpaqueRef>` | `infra/backend_capability_adapters.rs`;jobs | explicit fixture profile set for P0 | backend profile section |
| `SandboxBackendCapabilityConfig.capability_stale_threshold` | `Duration` | boundary service;jobs | value from `04` | capability freshness section |
| `SandboxBoundaryProfileConfig.boundary_profile_ref` | `SandboxOpaqueRef` | boundary service via typed parameter;backend adapter | local strict fixture profile | boundary profile section |
| `SandboxBoundaryProfileConfig.limit_template_ref` | `SandboxOpaqueRef` | boundary service;backend adapter | local limit template fixture | resource / fs / network / process limit template section |
| `SandboxLeaseConfig.lease_profile_ref` | `SandboxOpaqueRef` | generation-scoped isolation backend adapter during boundary establishment;cleanup / reaper jobs consume persisted lease lifecycle | local lease fixture profile | lease section |
| `SandboxPolicyConfig.summary_source_ref` | `SandboxAdapterConfigRef` | `infra/policy_adapters.rs`;policy service | fake policy summary adapter | policy summary routing section |
| `SandboxPolicyConfig.freshness_threshold` | `Duration` | policy service | value from `04` | policy freshness section |
| `SandboxPolicyConfig.high_risk_summary_profile_ref` | `SandboxOpaqueRef` | policy service | local high-risk fixture profile | high-risk policy section |
| `SandboxCaptureConfig.capture_size_class_ref` | `SandboxOpaqueRef` | capture service;capture adapter | local bounded class | capture size section |
| `SandboxCaptureConfig.material_class_ref` | `SandboxOpaqueRef` | capture / handoff service | local material class | material class section |
| `SandboxCaptureConfig.observability_material_enabled` | `bool` | capture / observability handoff service | enabled only when observability handoff adapter is configured | observability material section |
| `SandboxHandoffConfig.material_target_refs` | `Vec<HandoffTargetRefDto>` | `infra/handoff_adapters.rs`;handoff service;jobs | fake target set for P0 | material handoff targets section |
| `SandboxHandoffConfig.observability_target_refs` | `Vec<HandoffTargetRefDto>` | `infra/handoff_adapters.rs`;jobs | fake target set for P0 | observability handoff targets section |
| `SandboxHandoffConfig.investigation_target_refs` | `Vec<HandoffTargetRefDto>` | `infra/handoff_adapters.rs`;redline / cleanup jobs | fake / disabled unless redline enabled | investigation handoff targets section |
| `SandboxHandoffConfig.retry_policy_ref` | `SandboxOpaqueRef` | handoff retry wrapper;jobs | value from `04` | handoff retry section |
| `SandboxRelayConfig.transport_topic_bindings` | `TopicBindingConfig` | `infra/publishers.rs` | fake topic binding for P0 | bus topic binding section |
| `SandboxRelayConfig.publish_batch_size` | `SandboxPageLimit` | `worker/event_relay_worker.rs`;`jobs/event_relay_publish.rs` | value from `04` | relay publish section |
| `SandboxRelayConfig.publish_retry_policy_ref` | `SandboxOpaqueRef` | publisher wrapper;relay job | value from `04` | relay retry / dead-letter section |
| `SandboxJobConfig.default_batch_size` | `SandboxPageLimit` | `jobs/*`;worker loops | value from `04` | jobs section |
| `SandboxJobConfig.max_parallelism` | `NonZeroUsize` | `worker/*`;`jobs/*` | `1` for deterministic P0 fake unless config overrides | jobs section |
| `SandboxJobConfig.job_timeout` | `Duration` | `jobs/*` | value from `04` | jobs timeout section |
| `SandboxJobConfig.retry_policy_ref` | `SandboxOpaqueRef` | job runner / retry wrapper | value from `04` | job retry section |
| `SandboxLeaseReaperConfig.orphan_scan_cadence_ref` | `SandboxOpaqueRef` | `jobs/lease_orphan_reaper.rs` | value from `04` | lease / orphan cadence section |
| `SandboxLeaseReaperConfig.release_adapter_target_ref` | `SandboxAdapterConfigRef` | isolation backend release wrapper | same as isolation backend unless `04` separates | backend release section |
| `SandboxCleanupConfig.evaluation_cadence_ref` | `SandboxOpaqueRef` | `jobs/cleanup_guard_evaluation.rs` | value from `04` | cleanup cadence section |
| `SandboxCleanupConfig.retention_guard_profile_ref` | `SandboxOpaqueRef` | cleanup service / reaper jobs | value from `04` | cleanup retention guard section |
| `SandboxRedlineConfig.escalation_target_refs` | `Vec<HandoffTargetRefDto>` | redline service;investigation handoff adapter | fake / disabled unless redline enabled | redline escalation section |
| `SandboxRedlineConfig.containment_handoff_enabled` | `bool` | redline service;jobs | disabled only means handoff disabled,not redline disabled | redline containment section |
| `SandboxProjectionConfig.stale_threshold` | `Duration` | query service;projection repository | value from `04` | projection freshness section |
| `SandboxProjectionConfig.rebuild_batch_size` | `SandboxPageLimit` | `jobs/projection_rebuild.rs` | value from `04` | projection rebuild section |
| `SandboxDerivedConfig.derived_batch_size` | `SandboxPageLimit` | `jobs/derived_maintenance.rs` | value from `04` | derived maintenance section |
| `SandboxDerivedConfig.comparison_scope_ref` | `SandboxOpaqueRef` | backend comparison / derived query builder | local fixture scope | derived comparison section |
| `SandboxFeatureConfig.outbound_events_enabled` | `bool` | runtime builder;relay append helper | enabled only when publisher + topic binding valid | feature section |
| `SandboxFeatureConfig.derived_events_enabled` | `bool` | derived job / relay append helper | false unless topic binding complete | feature section |
| `SandboxFeatureConfig.reconciliation_enabled` | `bool` | job registry;query service | true for fake P0 if derived store available | feature section |

以上 config sections 都属于 `04-配置设计.md` 的正式展开范围。本步只定义 code binding point,不定义 raw key、文件格式、默认数值、secret source、endpoint 或真实 transport topic。

---

## 10. Config Section 到代码绑定

| Config section | 读取位置 | 注入对象 / 影响点 | 不变量 |
|---|---|---|---|
| runtime profile / config identity | `infra/config.rs`;`runtime_builder.rs` | `SandboxRuntimeConfigSummary`;builder state | profile 不改变 domain state matrix。 |
| truth store | `infra/truth_repositories.rs` | `SandboxTruthRepository`;`SandboxUnitOfWorkManager`;audit trace repo | 不改变 sandbox truth ownership / logical schema。 |
| projection / derived store | `infra/projection_repositories.rs` | `SandboxProjectionRepository`;`SandboxDerivedRepository` | query / derived / reconciliation 不反写 core truth。 |
| reference store | `infra/context_resolvers.rs`;reference repositories | `SandboxReferenceStateRepository` | 只保存 refs / safe summary / freshness marker,不保存 sibling body。 |
| relay store | `infra/publishers.rs`;relay repository adapter | `SandboxEventRelayRepository` | publish failure 不回滚 source truth。 |
| idempotency / stored result store | `infra/idempotency_store.rs`;`infra/result_store.rs` | `SandboxIdempotencyRepository`;`SandboxStoredResultRepository` | duplicate replay 必须返回 typed stored result,不得重算。 |
| boundary / page / timeout | `api/*`;worker entry;job entry | request limit、page limit、sync timeout | 不绕过 metadata、actor、idempotency、visibility。 |
| context resolver | `infra/context_resolvers.rs` | `ContextReferenceResolverPort` | 只返回 body-free refs / summaries / marker。 |
| policy summary | `infra/policy_adapters.rs` | `PolicySummaryPort` | policy missing / conflicted / unauthorized 仍 fail-closed。 |
| backend capability | `infra/backend_capability_adapters.rs` | `BackendCapabilityPort` | capability stale / unsupported 不 silent allow。 |
| isolation backend | `infra/isolation_backend_adapters.rs` | `IsolationBackendPort`;`BackendLifecycleInspectionPort`;capture adapter | backend product 不定义 business truth。 |
| material / observability / investigation handoff | `infra/handoff_adapters.rs` | handoff ports and target registry | handoff failure 不回滚 capture/run truth;receipt 不升格为 downstream formal truth。 |
| event publisher / topic binding | `infra/publishers.rs` | `SandboxEventPublisherPort`;topic-neutral key map | topic map 不改变 event kind、schema version、payload DTO、source cursor。 |
| clock / id | `infra/clock_id.rs` | `SandboxClockPort`;`SandboxIdGeneratorPort` | domain / handler 不拼 id;时间不由 DB default 隐式产生。 |
| jobs / cadence / retry | `jobs/*`;worker loops | job runner、batch、parallelism、retry wrapper | job 不修 core truth,只写正式 marker/report。 |
| features | `runtime_builder.rs`;service registration | route / consumer / job / relay enablement | feature flag 只能禁用外围能力,不得改变 core success 语义。 |

---

## 11. 禁止配置化边界

| 禁止配置化项 | 禁止原因 | 违规处理 |
|---|---|---|
| 改变 execution isolation truth ownership | `L4-sandbox` 只拥有 isolation truth;配置不能把 policy / artifact / runtime / member truth 纳入本仓 | config validation reject / design correction |
| 跳过 `ControlledExecutionContext::Accepted` 前置条件 | actor / refs / responsibility / idempotency 是受理最小闭口 | config validation reject |
| coherent boundary 任一维度 silent degrade | resource / filesystem / network / process boundary 必须整体成立 | startup reject or command rejected;不得 fallback success |
| weak / host-run backend 伪装 formal success | 会破坏运行隔离基础定位 | adapter binding reject or explicit non-P0 fake only |
| 关闭 policy fail-closed / high-risk block | policy missing/conflicted/unsupported/unauthorized 不得放行 | config validation reject |
| 关闭 command metadata / idempotency / stored result | 破坏 Step 8/13 duplicate replay 和追溯 | config validation reject |
| 让 query、projection rebuild、derived maintenance、reconciliation 写 core truth | 破坏 read-side / job no-repair 红线 | config validation reject |
| 让 consumer 直接创建核心 success | consumer 只能写 reference / marker / feedback / stale state,不能绕过 command gate | config validation reject |
| 让 relay publish / handoff delivery failure 回滚 source truth | 破坏 no-rollback flow | config validation reject |
| cleanup / reaper 绕过 handoff、investigation、redline guard | 可能提前删除证据或释放风险环境 | config validation reject |
| redline containment 被配置为 advisory-only | 安全红线必须进入正式 containment / investigation / cleanup gate | config validation reject |
| 保存 external body、raw SDK response、raw backend output、secret、endpoint、transport topic 到 domain / contracts | 破坏 body-free 与部署隔离 | config validation reject / design correction |
| 将非 `core-contracts` sibling repo 配成 Cargo path dependency | 破坏全局依赖裁剪和 L4 边界 | implementation gate reject |
| 通过 entry local args 表达复杂业务 scope 或跳过 typed DTO | 会绕过 Step 8 protocol / Step 13 digest | entry validation reject |
| retention 删除未对账 stored result / idempotency record | duplicate missing result 会失去完整性判断 | config validation reject or manual integrity blocker |

---

## 12. 外部依赖绑定表

| 依赖 | 绑定位置 | 使用接口 | 超时 / 重试 | 降级策略 |
|---|---|---|---|---|
| local truth store | `infra/truth_repositories.rs` | `SandboxTruthRepository`;`SandboxUnitOfWorkManager`;audit trace repo | store transaction timeout;retry only by explicit application policy | unavailable -> no mutation,return dependency unavailable。 |
| projection / derived store | `infra/projection_repositories.rs` | `SandboxProjectionRepository`;`SandboxDerivedRepository` | projection timeout / rebuild retry policy | query returns stale / degraded / missing;job item failed。 |
| reference store | `infra/context_resolvers.rs`;reference repository adapter | `SandboxReferenceStateRepository` | store timeout / refresh retry | command dependency unavailable or delayed;job failed reference item。 |
| relay store | `infra/publishers.rs`;relay repository adapter | `SandboxEventRelayRepository` | store timeout / publish job retry | relay job partial / failed;source truth unchanged。 |
| idempotency / stored result store | `infra/idempotency_store.rs`;`infra/result_store.rs` | `SandboxIdempotencyRepository`;`SandboxStoredResultRepository` | retention + store timeout | unavailable -> no mutation;duplicate missing -> manual blocker。 |
| `quantalithos-bus` / event transport | `infra/publishers.rs`;worker source adapters | `SandboxEventPublisherPort.publish`;consumer source adapter | relay publish retry;event redelivery / dedup retention | mark relay retryable / dead-letter / failed;truth not rolled back。 |
| `quantalithos-identity` | `infra/context_resolvers.rs`;inbound consumer | `ContextReferenceResolverPort.resolve_context_refs`;`ConsumeCallerContextReferenceChanged` | resolver timeout / event redelivery window | unresolved actor / identity -> command rejected / delayed or degraded read。 |
| `quantalithos-work` | `infra/context_resolvers.rs`;inbound consumer | work context safe summary resolver;`ConsumeCallerContextReferenceChanged` | timeout / retry | work context stale/unresolved -> rejected / delayed / degraded。 |
| `quantalithos-tools` | resolver / inbound reference source | tool request / result safe refs only | timeout / retry | tool semantic execution not imported;missing ref -> reject / delayed。 |
| `quantalithos-runtime` | resolver;control / lifecycle consumer | runtime request / control / lifecycle safe refs | timeout / event redelivery | runtime loop truth not owned;control conflict -> formal receipt / failure marker。 |
| `quantalithos-member-service` | resolver / host binding adapter | member host sandbox binding safe summary | timeout / retry | host binding missing -> reject / pending;member lifecycle not owned。 |
| `quantalithos-runner` | API caller / downstream consumer | controlled execution request and status query | caller retry via command idempotency | runner product truth external;query visibility applies。 |
| `quantalithos-governance` / policy source | `infra/policy_adapters.rs`;inbound consumer | `PolicySummaryPort.load_policy_applicability`;`ConsumePolicySummaryChanged` | policy resolver timeout / freshness threshold | missing / stale / conflicted policy -> fail-closed,not allow。 |
| `quantalithos-method-library` / capability source | `infra/policy_adapters.rs`;reference consumer | method / capability summary safe refs | timeout / retry | missing capability/method summary -> fail-closed or degraded;no method body saved。 |
| backend products: Docker / gVisor / Firecracker / k8s / host | `infra/backend_capability_adapters.rs`;`infra/isolation_backend_adapters.rs` | `BackendCapabilityPort`;`IsolationBackendPort`;`BackendLifecycleInspectionPort` | backend operation timeout / retry / lease policy | unsupported/unavailable -> boundary rejected / pending / failed;no weak fallback success。 |
| execution capture adapter | `infra/isolation_backend_adapters.rs`;worker fulfillment | `ExecutionCapturePort.collect_capture` | capture timeout / retry class | capture failed / unavailable recorded;run not silently success。 |
| `quantalithos-artifact` | `infra/handoff_adapters.rs`;handoff feedback consumer | `MaterialHandoffPort.handoff_material`;`ConsumeMaterialHandoffStatusChanged` | handoff timeout / retry / dead-letter | handoff retryable / failed marker;capture truth unchanged;artifact body not saved。 |
| `quantalithos-observability` | `infra/handoff_adapters.rs`;observability feedback consumer | `ObservabilityMaterialPort.handoff_observability`;`ConsumeObservabilityHandoffStatusChanged` | handoff timeout / retry | observability handoff failed / pending;observability store truth external。 |
| investigation / security target | `infra/handoff_adapters.rs`;investigation feedback consumer | `InvestigationHandoffPort.handoff_investigation`;`ConsumeInvestigationHandoffStatusChanged` | handoff timeout / retry / manual escalation | redline remains contained / pending;no auto release on missing feedback。 |
| system clock | `infra/clock_id.rs` | `SandboxClockPort.now` | no retry unless adapter unavailable | deterministic fake for tests;unavailable -> dependency unavailable before mutation。 |
| id generation | `infra/clock_id.rs` | `SandboxIdGeneratorPort.next_*` | no retry unless adapter unavailable | deterministic fake for tests;unavailable -> reject/unavailable before mutation。 |
| adapter registry / availability checker | `infra/runtime_builder.rs`;`infra/config.rs` | `SandboxRuntimeConfigPort.check_adapter_availability` | startup / health check policy | disabled/unavailable target -> startup blocked,entry disabled,command rejected,job skipped or degraded per flow。 |

---

## 13. Inbound Event / Source Binding

| Consumer | Source dependency | Config binding requirement | Disabled / unavailable behavior |
|---|---|---|---|
| `ConsumeCallerContextReferenceChanged` | identity / work / tool / runtime source event or fixture feed | source enabled, schema version allowlisted, `dedup_key` required, context resolver ref configured | consumer entry disabled or delayed;command path may still use resolver/fake;no core success write。 |
| `ConsumePolicySummaryChanged` | governance / policy / capability source event or fixture feed | policy source enabled, schema version allowlisted, forbidden body marker validation enabled | consumer delayed / quarantined;policy command remains fail-closed on missing summary。 |
| `ConsumeBackendCapabilitySummaryChanged` | backend capability source / fixture feed | backend profile refs accepted, capability schema version allowlisted | boundary establishment waits / rejects / degrades;consumer does not establish boundary。 |
| `ConsumeIsolationBackendLifecycleSignal` | isolation backend lifecycle source | lifecycle source enabled, handle ref validation, schema allowlist | lifecycle signal delayed / quarantined;failure / reaper path handles missing lifecycle conservatively。 |
| `ConsumeMaterialHandoffStatusChanged` | artifact / material handoff target feedback | handoff target ref registered, schema allowlist, target match required | feedback quarantined / delayed;capture truth unchanged。 |
| `ConsumeObservabilityHandoffStatusChanged` | observability handoff target feedback | observability target ref registered, schema allowlist, target match required | feedback quarantined / delayed;observability handoff truth external。 |
| `ConsumeSandboxControlRequested` | runtime / operator / member-service control source | source authority allowlist, control signal schema, inner command idempotency binding | consumer receipt rejected / quarantined;does not bypass command expected version。 |
| `ConsumeInvestigationHandoffStatusChanged` | investigation / security target feedback | investigation target ref registered, redline / cleanup relation refs required | feedback delayed / quarantined;redline / cleanup guard not auto released。 |
| `ConsumeSandboxTruthRelayFeedback` | event bus / publisher feedback | relay record ref validation, publisher outcome schema allowlist | feedback rejected / no-op;source truth unchanged。 |

Inbound binding rules:

- Worker config selects source subscription / fixture feed and schema allowlist;it does not redefine payload DTO fields.
- `SandboxInboundEventEnvelopeDto<TPayload>.dedup_key_ref` remains mandatory for enabled consumers.
- `source_event_ref`、transport delivery count、worker batch id、trace id and retry count must not replace Step 13 idempotency key.
- Unsupported schema version, forbidden body marker, missing dedup key or target mismatch follows Step 12 / 13 receipt path;worker must not parse raw body to recover.
- Event source config must not let consumer create accepted context、boundary、policy、run、capture、cleanup or redline success truth without the formal command / domain flow.

---

## 14. Outbound Topic / Event Schema Binding

Step 8 defines outbound event kinds and payload DTO. This Step binds topic-neutral keys to runtime publisher config. Topic-neutral keys are derived from event kind and schema family;`04-配置设计.md` will define raw transport route / topic names.

| Event kind | Topic-neutral key | Config binding requirement | Disabled behavior |
|---|---|---|---|
| `SandboxExecutionContextChanged` | `sandbox.execution-context.changed.v1` | publisher config maps key to transport route when event enabled | startup validation fails if relay enabled but binding missing。 |
| `SandboxBoundaryChanged` | `sandbox.boundary.changed.v1` | same | startup validation fails if relay enabled but binding missing。 |
| `SandboxPolicyDecisionChanged` | `sandbox.policy-decision.changed.v1` | same | startup validation fails if policy event enabled but binding missing。 |
| `SandboxRunChanged` | `sandbox.run.changed.v1` | same | startup validation fails if run event enabled but binding missing。 |
| `SandboxCaptureChanged` | `sandbox.capture.changed.v1` | same | startup validation fails if capture event enabled but binding missing。 |
| `SandboxMaterialHandoffChanged` | `sandbox.material-handoff.changed.v1` | same | startup validation fails if handoff event enabled but binding missing。 |
| `SandboxFailureChanged` | `sandbox.failure.changed.v1` | same | startup validation fails if failure event enabled but binding missing。 |
| `SandboxControlChanged` | `sandbox.control.changed.v1` | same | startup validation fails if control event enabled but binding missing。 |
| `SandboxCleanupChanged` | `sandbox.cleanup.changed.v1` | same | startup validation fails if cleanup event enabled but binding missing。 |
| `SandboxRedlineContainmentChanged` | `sandbox.redline-containment.changed.v1` | same | startup validation fails if redline event enabled but binding missing。 |
| `SandboxProjectionChanged` | `sandbox.projection.changed.v1` | required only when projection event feature enabled | feature disabled -> projection state still saved,no event append。 |
| `SandboxDerivedViewChanged` | `sandbox.derived-view.changed.v1` | required only when derived event feature enabled | feature disabled -> derived state still saved,no event append。 |
| `SandboxReconciliationFindingAvailable` | `sandbox.reconciliation-finding.available.v1` | required only when reconciliation event feature enabled | feature disabled -> report still saved,no event append。 |

Publisher config must not change:

- `event_kind`
- schema version
- payload DTO fields
- source truth / state ref
- source cursor source
- event producer identity
- forbidden body exclusion

It only maps topic-neutral key to transport route and adapter credential refs. Missing binding for enabled event is startup validation error or worker relay disabled state;it must not silently drop committed relay records.

---

## 15. 跨仓 Rust 依赖绑定表

| 依赖仓库 | 全局依赖类型 | 本地路径 | Cargo 引用方式 / 协作方式 | 使用位置 | 不可用时处理 |
|---|---|---|---|---|---|
| `quantalithos-core` | 编译期依赖 | `/home/aris/Projects/quantalithos-core` | `core-contracts = { path = "../quantalithos-core/crates/contracts" }`;member 使用 `core-contracts.workspace = true` | `contracts/domain/application/infra` 中共享 actor、trace、metadata、typed ref、page、error carrier | 暂停依赖真实 core contracts 的实现。 |
| `quantalithos-bus` | event transport dependency | `/home/aris/Projects/quantalithos-bus` | 不进 Cargo;通过 `SandboxEventPublisherPort`、worker source adapter、fake publisher | outbound relay、inbound consumer、relay feedback | P0 fake;正式 bus binding 缺失则回 `04/07` 或设计收敛。 |
| `quantalithos-identity` | runtime / event dependency | `/home/aris/Projects/quantalithos-identity` | 不进 Cargo;通过 context resolver / inbound safe summary event / fake snapshot | execution environment identity、actor / responsibility context | P0 fake;正式 typed event / summary 未闭口则回设计。 |
| `quantalithos-work` | runtime / event dependency | `/home/aris/Projects/quantalithos-work` | 不进 Cargo;通过 context resolver / inbound event / fake snapshot | caller context、work anchor、visibility refs | P0 fake;work body never imported。 |
| `quantalithos-governance` | runtime / event dependency | `/home/aris/Projects/quantalithos-governance` | 不进 Cargo;through `PolicySummaryPort` / policy summary consumer | policy applicability、authorization、high-risk decision | P0 fake;missing summary => fail-closed。 |
| `quantalithos-method-library` | runtime / event dependency | `/home/aris/Projects/quantalithos-method-library` | 不进 Cargo;through policy / method / capability safe summary adapter | method/capability summary used by policy and backend comparison | P0 fake;method body never imported。 |
| `quantalithos-tools` | runtime / event dependency | 当前未发现 | 不进 Cargo;through tool request/result safe refs and fake | controlled execution request / result context | use fixture/fake;do not create path dependency。 |
| `quantalithos-runtime` | runtime / event dependency | 当前未发现 | 不进 Cargo;through runtime control / lifecycle / request refs | run start context、control requested、failure source | use fixture/fake;runtime agent loop not imported。 |
| `quantalithos-member-service` | runtime dependency | 当前未发现 | 不进 Cargo;through member host binding adapter / safe summary | host-bound execution / container lifecycle refs | use fake or wait;member lifecycle orchestration external。 |
| `quantalithos-artifact` | material handoff dependency | 当前未发现 | 不进 Cargo;through `MaterialHandoffPort` and feedback consumer | captured material / artifact handoff | fake handoff for P0;artifact truth/body external。 |
| `quantalithos-observability` | observability handoff / event dependency | 当前未发现 | 不进 Cargo;through `ObservabilityMaterialPort` and feedback consumer | audit / trace / metrics material handoff | fake handoff for P0;observability store truth external。 |
| `quantalithos-runner` | downstream runtime consumer | 当前未发现 | 不进 Cargo;runner consumes public API / SDK boundary | runner app controlled execution | not blocking sandbox P0。 |
| `quantalithos-archive` | downstream handoff / export dependency | 当前未纳入 Step 3 direct list | 不进 Cargo;future archive handoff only if configured | possible retained material archive path | not a current Step 14 core dependency;future design required。 |
| Docker / gVisor / Firecracker / k8s / host backend | runtime / infrastructure dependency | deployment-specific | 不作为业务 Cargo path dependency;through backend adapters and profiles | boundary establishment、launch、capture、inspect、release、cleanup / reaper | unsupported/unavailable -> rejected/pending/failed;no weak fallback success。 |
| DB / object store / secret provider / OTel / scheduler | runtime product dependency | deployment-specific | 不作为业务 Cargo path dependency;through infra adapters and config refs | stores、secrets、observability hooks、job scheduling | product choice deferred to `04/07/ADR`;P0 fake/in-memory。 |

---

## 16. Runtime Builder 装配顺序

```text
SandboxConfigLoader.load(profile_or_config_source)
  -> SandboxConfigValidator.validate(raw_config)
  -> redact raw endpoint / secret / topic / credential from validation issues
  -> SandboxRuntimeConfigSummary::from_validated_config(...)
  -> SandboxRuntimeBuilderState::for_config(...)
  -> validate invariant-safe config combinations
  -> build store registry and store adapters
  -> build SandboxUnitOfWorkManager
  -> build idempotency and stored result repositories
  -> build truth / projection / derived / reference / relay repositories
  -> build ContextReferenceResolverPort
  -> build PolicySummaryPort
  -> build BackendCapabilityPort and IsolationBackendPort
  -> bind SandboxLeaseConfig + clock to the generation-scoped isolation backend adapter
  -> build ExecutionCapturePort
  -> build MaterialHandoffPort / ObservabilityMaterialPort / InvestigationHandoffPort
  -> build SandboxEventPublisherPort and topic-neutral binding map
  -> build SandboxClockPort and SandboxIdGeneratorPort
  -> check adapter availability for enabled adapters
  -> allocate one runtime_generation_ref for the complete same-generation set
  -> build BoundaryEstablishmentService with SandboxBoundaryProfileConfig + runtime_generation_ref;the bound backend adapter returns the validated bounded lease window
  -> build remaining application command / query / consumer / job services from Step 7 ports
  -> build API handlers / worker runtimes / job runners
  -> atomically publish the complete service / entry set or publish zero handles
  -> mark runtime ready or blocked/degraded with sanitized reason refs
```

Runtime builder rules:

- `SandboxConfigLoader` and `SandboxConfigValidator` are infra-local;their raw schema is owned by `04-配置设计.md`.
- `SandboxRuntimeConfigSummary` is sanitized and body-free;it may expose profile / adapter status refs,not raw endpoint / secret / topic / credential.
- `application` service constructors receive Step 7 port traits and typed parameters,not raw config object.
- `BoundaryEstablishmentService` constructor receives `SandboxBoundaryProfileConfig` and the LD-24 `runtime_generation_ref`;the public boundary request does not carry policy or caller-selected config / generation refs.
- `domain` receives only explicit command / domain method inputs,never config or adapter handles.
- `api` / `worker` / `jobs` receive validated service sets and local entry parameters;they do not instantiate concrete business adapters directly.
- fake runtime must provide deterministic clock、id generator、store、resolver、policy、backend、handoff、publisher and availability outcomes for tests.
- unavailable / disabled adapter mapping must be explicit: startup blocked,entry disabled,command rejected / delayed / fail-closed,query degraded,job skipped / failed item,or relay / handoff retryable. It must not become implicit allow.

---

## 17. Historical Material / Blocker 处理

| 项目 | 状态 | Step 14 处理 |
|---|---|---|
| 旧 `README.md` Docker + gVisor / seccomp / AppArmor / old backend list | historical_material | 未继承为当前 backend 产品基线;本步只固定 abstract backend adapter 和 backend profile ref。 |
| 旧 `03-详细设计.md` 的旧 config / provider bridge / audit evidence 线索 | historical_material | 未继承旧 provider bridge;新版外部协作通过 Step 7 port、Step 8 event/job 和本步 adapter binding。 |
| 正式 `04-配置设计.md` 缺失 | open_downstream | 不阻塞 Step 14;后续进入 `04` 时必须把本步 config sections 展开为正式 schema、profile、defaults、source priority、CLI/env、secret 和 validation。 |
| 正式 `07-实施计划.md` 缺失 | open_downstream | 不阻塞 Step 14;后续完成 `07` 时必须创建 implementation ledger 和 planned boundary skeleton。 |
| `/home/aris/Projects/quantalithos-sandbox` 当前未发现 | open_for_step_17_or_07 | 不阻塞设计;不得伪造实现仓、Cargo 文件或已落地 crate。 |

未发现阻塞 Step 14 的上游 blocker。

---

## 18. 回填草稿

> 校准来源:
> - `design-calibration/03_ddd_step_14_config_external_binding.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“配置引用表”“Config section 到代码绑定”“禁止配置化边界”“外部依赖绑定表”“Inbound / Outbound binding”“跨仓 Rust 依赖绑定表”和“Runtime Builder 装配顺序”小节。

## 13. 配置引用与外部依赖绑定

L4-sandbox 的配置只影响 runtime 承载、adapter 选择、store 选择、topic route、timeout / retry / retention / batch、lease / cadence、feature enablement、degraded exposure 和 startup validation。配置不得改变 execution isolation truth ownership、coherent boundary 必须整体成立、policy fail-closed、capture truth / handoff truth 分层、cleanup guard、redline containment、query no-write、job no-truth-repair、external body exclusion、idempotency key / digest / stored replay 或 phase boundary。

### 13.1 配置读取边界

| 模块 | 读取边界 |
|---|---|
| `infra/config.rs` | 读取 raw config,输出 validated config refs 和 sanitized `SandboxRuntimeConfigSummary`。 |
| `infra/runtime_builder.rs` | 读取 validated refs,装配 stores、adapters、ports 和 application services。 |
| `api/worker/jobs` | 读取 local entry args 和 validated runtime handle,不得绕过 DTO / job input。 |
| `application` | 只接收 port trait 和 typed 参数,不读取 raw config。 |
| `domain/contracts` | 不读取配置,不携带 runtime config schema。 |

### 13.2 配置引用表

正式正文应摘录本 Step §9 的配置引用表,至少覆盖 runtime profile、truth/projection/derived/reference/relay/idempotency stores、context resolver、policy summary、backend capability、isolation backend、capture、material/observability/investigation handoff、event publisher、clock/id、boundary、idempotency、reference、capability、boundary profile、lease、policy、capture、handoff、relay、job、lease reaper、cleanup、redline、projection、derived 和 feature sections。

### 13.3 外部依赖绑定表

正式正文应摘录本 Step §12 的外部依赖绑定表。所有运行期、事件、handoff、backend 和 product 依赖必须通过 Step 7 port / adapter 注入,不得进入 `domain` / `contracts` 或 Cargo path dependency。

### 13.4 Inbound / Outbound binding

Inbound consumer config 只选择 source subscription / fixture feed、schema allowlist 和 source enablement,不得重定义 payload DTO、dedup 或 quarantine 语义。Outbound publisher config 只把 topic-neutral key 映射到 transport route,不得改变 event kind、schema version、payload DTO、source truth ref 或 source cursor。

### 13.5 跨仓 Rust 依赖

唯一当前允许的 sibling path dependency 是:

```toml
[workspace.dependencies]
core-contracts = { path = "../quantalithos-core/crates/contracts" }
```

member crate 引用时使用:

```toml
[dependencies]
core-contracts.workspace = true
```

`quantalithos-bus`、identity、work、governance / policy、method-library / capability、tools、runtime、member-service、runner、artifact、observability、archive / investigation target、backend 产品、DB / object store / secret / OTel 均不得写成 Cargo dependency。

---

## 19. Step 15 Handoff

Step 15 `定义可观测性与审计埋点契约` 必须承接:

| 承接项 | Step 15 处理要求 |
|---|---|
| config validation / adapter availability | 记录 sanitized config validation log / metric / trace,不得泄露 raw config、secret、endpoint、topic。 |
| runtime builder startup blocked / degraded | 定义 startup blocked / degraded / ready 的日志、指标和审计字段。 |
| inbound consumer disabled / quarantined | 定义 consumer source、schema、dedup、quarantine 的观测切口。 |
| relay publish retry / dead-letter | 定义 relay record、publish attempt、dead-letter / retryable 的 metric / audit,不回滚 source truth。 |
| handoff failure / retryable / delivered | 定义 material / observability / investigation handoff outcome 观测,不把外部 receipt 升格为 truth。 |
| backend capability / isolation backend availability | 定义 backend unavailable / unsupported / degraded / lifecycle lost 的日志 / metric / audit。 |
| config redline violations | 对禁止配置化边界 violation 输出 fail-fast observable,不进入业务 success flow。 |

---

## 20. 待确认事项

| 待确认项 | 当前状态 | 是否阻塞 Step 15 | 处理口径 |
|---|---|---:|---|
| 正式 `04-配置设计.md` 缺失 | open_downstream | 否 | 后续按配置 SOP 创建,并把本步 config sections 展开为 schema / defaults / env / profile。 |
| 目标实现仓未发现 | open_for_step_17_or_07 | 否 | Step 17 / `07` 记录实施前置检查;当前不伪造实现仓。 |
| backend 产品组合和 stronger isolation profile | open_for_04_07_adr | 否 | 当前只固定 abstract backend adapter 和 no weak fallback;产品选择后续 ADR / `04/07/05`。 |
| real bus / event schema registry / raw topic | open_for_04_07 | 否 | 当前只固定 topic-neutral key 和 Step 8 payload;raw transport 留给 `04`。 |
| secret provider / endpoint / credential loading | open_for_04 | 否 | 本步禁止泄露 raw secret,具体 source 留给配置设计。 |
| exact timeout / retry / lease / retention / batch 数值 | open_for_04_05_06 | 否 | 本步只定义 binding point,后续配置 / 测试 / 验收给数值或候选范围。 |

---

## 21. 自检

| 检查项 | 结论 |
|---|---|
| 是否输出配置引用表 | 通过。§9 覆盖 runtime、store、adapter、boundary、idempotency、reference、backend、policy、capture、handoff、relay、job、cleanup、redline、projection、derived、feature。 |
| 是否输出外部依赖绑定表 | 通过。§12 覆盖 stores、bus、identity、work、tools、runtime、member-service、runner、policy、method/capability、backend、capture、artifact、observability、investigation、clock、id、adapter registry。 |
| 是否输出跨仓 Rust 依赖绑定表 | 通过。§15 明确 `core-contracts` 唯一 path dependency,其他 runtime/event/handoff/product 依赖不进 Cargo。 |
| 是否说明哪些模块读取配置 | 通过。§8 明确 `infra` owns config,entry 只读 local args,`application/domain/contracts` 不读 raw config。 |
| 是否把具体配置手册留给 `04` | 通过。未写 raw key、env var、secret、endpoint、topic、cron、数值默认值。 |
| 是否防止配置改变 truth / state / idempotency / query / job / redline | 通过。§7 和 §11 列出禁止配置化边界。 |
| 是否继承旧 README / 旧 `03` 技术方案 | 未继承。旧 Docker/gVisor 和 provider bridge 只作 historical material。 |
| 是否修改正式 `03-详细设计.md` | 未修改。正式文档仍只允许 Step 19 装配。 |
| 是否创建 Step 15 文件 | 未创建。当前停审在 Step 14。 |
| 是否伪造 commit、run_id、evidence、验收签署或测试结果 | 未伪造。 |

---

## 22. 进入下一步条件

```text
Step 14 `定义配置引用与外部依赖绑定` 已完成并等待用户审查。
用户确认后,才能进入 Step 15 `定义可观测性与审计埋点契约`。

进入 Step 15 前必须读取:
1. 本文件 `03_ddd_step_14_config_external_binding.md`
2. `03_ddd_step_13_concurrency_idempotency.md`
3. `03_ddd_step_12_error_recovery.md`
4. `03_ddd_step_08_protocol_contracts.md`
5. `03_ddd_step_09_function_flows.md`
6. `03_ddd_step_11_persistence_transaction_consistency.md`
7. 详细设计 SOP Step 15
8. 详细设计书写规范 §5.14
9. 真相源闭环标准中 observability / audit / evidence / redaction / external body exclusion 相关条目
```

---

## 23. 实施计划回查修复记录

| 回查 ID | 发现位置 | 原缺口 | 修复结果 | 配置生命周期结论 |
|---|---|---|---|---|
| `SBX-IMP-BOUNDARY-POLICY-CYCLE-001` | `07` Step 6 boundary factory / generation来源复核 | 原Step 14未明确boundary service如何同时获得I039 / I040和LD-24 generation,容易误把generation塞入LD-17 summary或public DTO。 | runtime builder在完整same-generation set形成后分配generation ref,将profile / template / generation注入`BoundaryEstablishmentService`,再原子发布全部handles。 | LD-17 summary保持pre-publication sanitized carrier;LD-24 generation只存在于已发布service set。 |
