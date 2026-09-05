# Step 14. 配置引用与外部依赖绑定

> 对应 SOP：`standards/document/详细设计讨论流程_SOP.md` Step 14
> 对应书写规范：`standards/document/详细设计书写规范.md` §5.13
> 粒度参考：`projects/L1-governance/design-calibration/03_ddd_step_14_config_external_binding.md`（仅借鉴表格、审计和回填粒度）
> 状态：`completed / pass_with_upstream_and_design_blockers / stop_review`
> 模式：`full-restart + single-agent-serial`
> 正式正文：本文件完成后仍不直接写入；正式 `03-详细设计.md` 只在 Step 19 装配。

## 1. Step 状态与边界

| 项目 | 结论 |
|---|---|
| 当前 Step | Step 14：配置引用与外部依赖绑定 |
| 输入 | Step 3 constraints、Step 4 file layout、Step 5 module contracts、Step 6 object contracts、Step 7 Port / Adapter contracts、Step 11 persistence、Step 12 error / recovery、Step 13 concurrency / idempotency、02 §11 配置影响轮廓 |
| 输出 | 本文件；未来正式 `03` §5.13 回填草稿 |
| 目标 | 让实现者知道哪些层读取配置、validated ref 如何注入、外部关系如何分类，以及依赖不可用时何时暂停、使用测试 fake 或保持 blocked |
| 不做 | 不写完整配置手册、文件格式、环境变量、secret、endpoint、transport route、DB / queue / scheduler 产品、数值默认值或生产 readiness |
| 当前门禁 | `L2M-UP-001~008`、`L2M-DDD-001~007`、`scope_supersede_gap` 继续开放；24 个 outbound semantic event candidate 继续 `Blocked(L2M-UP-005)` |
| 停审 | 配置读取面、绑定表、依赖分类、builder 顺序、不可用策略和前序审计完成后停审；不得在本文件内装配正式 03 |

本 Step 只描述代码绑定点。配置不得改变执行主语、truth owner、状态矩阵、body-free、screening owner、Query no-write、幂等 / CAS / unknown fence 或依赖分类。

## 2. 输入与采用边界

| 输入 | 本 Step 承接 | 明确不继承 |
|---|---|---|
| `03_ddd_step_03_constraints.md` | planned Rust 2024、Core-only compile、运行期 / 事件协作不进入 Cargo、目标实现仓仍缺失 | 旧 README 的 Rust facade、UDS、gRPC、supervisord、固定端口 |
| `03_ddd_step_04_file_layout.md` | `infra/config.rs`、`infra/runtime_builder.rs`、各 store / blocked seam 文件职责；七个 planned library crate | 物理 binary、transport、DB、broker、scheduler |
| `03_ddd_step_05_module_contracts.md` | 七个业务责任轴横跨七个实现 crate；`infra` 负责装配，application 只持有 Port | 新业务模块、mega service、generic provider |
| `03_ddd_step_06_object_contracts.md` | `MemberRuntimeConfigRef`、`MemberStoreConfigRef`、`MemberAdapterConfigRef`、`MemberRuntimeBuilderState`、`MemberAdapterAvailability`、`MemberInfraStoreState`、`BlockedSeamState` | raw config、secret、endpoint、topic、cron、adapter instance 或 external body |
| `03_ddd_step_07_trait_port_adapter_contracts.md` | CP01~CP07 Store、owner-specific resolver、host / Runtime / publication / observation handoff、Clock / ID / digest、UoW、idempotency / result Port | member-specific publisher / outbox；Step 7 已明确不存在其 public Port |
| Step 11~13 | Store version、同一 UoW、typed replay、retention / freshness / retry 的配置绑定需求；Query no-write 和 unknown fence | 具体数据库、锁、hash crate、retry 数值或 transport acknowledgement |
| `02-概要设计.md` §11 | runtime / source / handoff / projection / job / registry 的配置影响类别 | 通过配置改写 domain policy 或 external owner |
| `L1-governance` Step 14 | 配置表、依赖表、回填审计的粒度 | Governance 的 outbox、publisher、GRC、topic 与 truth model |

## 3. SOP 问题逐项回答

| 问题 | L2-member 结论 |
|---|---|
| 哪些模块需要读取配置？ | 只有 `infra/config.rs` 读取并校验 raw config；`infra/runtime_builder.rs` 消费 validated refs 并装配 Store、technical Port、source / handoff seam。`api`、`worker`、`jobs` 只接收已校验的边界参数、registry posture 或 job runner参数；`application` 只接收 Port / typed policy input；`domain`、`contracts` 不读配置。 |
| 配置项类型、默认值和读取位置是什么？ | 本 Step 固定逻辑类别、读取模块和默认口径，不伪造具体数值。完整类型字段、profile merge、环境变量、secret source、timeout / retry / retention / batch 数值由未来 `04-配置设计.md` 定义。 |
| 哪些外部依赖需通过 adapter 注入？ | host / member-service、Runtime、Work / Identity / Governance / Tools / Method / Conversation / Artifact / Observability 等 owner-specific source 或 handoff 均经 application-owned Port，由 `infra` 注入 adapter 或 blocked seam；L0-bus 只作为 event collaboration seam。 |
| 超时、重试、降级策略是什么？ | 本地 Store 不可用时禁止业务写；source / handoff `Blocked`、`Waiting`、`Unknown` 必须原样保留并映射为既有 typed outcome；VersionConflict、commit unknown、missing carrier 不由 adapter 静默重试。具体 timeout、backoff、retry 次数留 `04`。 |
| 哪些细节留给配置设计文档？ | 文件格式、key 完整路径、环境变量、profile merge、secret / credential ref 来源、endpoint、transport topic / route、DB / queue 产品、数值默认值、cron、health probe、运维告警和部署矩阵。 |
| 哪些跨仓 Rust 编译期依赖走本地 path？ | 仅 `core-contracts = { path = "../quantalithos-core/crates/contracts" }`。它只复用已正式存在的 Core shared primitive；不以此推出 member-specific event schema。 |
| 哪些运行期 / 事件依赖通过何种关系表达？ | runtime、host、source、handoff 通过 owner-specific Port / adapter；event 通过 inbound Consumer / committed-fact ref 与 blocked semantic candidate；projection 通过本地 read / rebuild Port；测试通过同 Port fake。它们均不进 Cargo。 |
| 依赖仓库不存在如何处理？ | Core contracts 缺失时暂停依赖真实类型的实现；运行期、事件、handoff 或 sibling 仓缺失时，P0 只能使用明确标注的 fixture / deterministic fake 进行契约测试，正式路径保持 blocked / waiting，不私造 sibling DTO 或 positive integration。 |

## 4. 配置读取与注入边界

### 4.1 唯一 raw-config 入口

```text
raw source (file / environment / future host input)
  -> infra::config::load
  -> infra::config::validate_and_redact
  -> MemberRuntimeConfigRef + typed section refs + provenance
  -> infra::runtime_builder
  -> application Port / typed boundary parameter injection
```

- `infra/config.rs` 是唯一读取 raw config 的 planned 文件；它输出 body-free `MemberRuntimeConfigRef`、`MemberStoreConfigRef`、`MemberAdapterConfigRef`、redacted issue refs 和 validated section posture。
- `infra/runtime_builder.rs` 是唯一把 config ref 绑定到 concrete local adapter、blocked seam 或 test fake 的 composition root。
- `api`、`worker`、`jobs` 不重新读取文件或环境变量，不保留 raw config；entry-local selector（如 future profile selector）只能传给 `infra/config.rs`。
- `application` 不依赖 `infra` config schema；它只接受 Step 7 Port、`MemberOperationContext`、typed boundary / job 参数和显式 policy input。
- `domain` 与 `contracts` 不读取配置，也不接收 adapter handle、secret、URL、topic、cron、retry policy body 或部署拓扑。

### 4.2 validated ref 的最小语义

| ref / carrier | 允许内容 | 禁止内容 | Ready 含义 |
|---|---|---|---|
| `MemberRuntimeConfigRef` | 本次 composition 选中的 opaque validated ref | raw config、secret、endpoint、path、topic、image digest、container / sandbox policy | 只标识已校验配置，不代表 external runtime / host 可用 |
| `MemberStoreConfigRef` | 一个 logical Store section 的 opaque ref | DB 产品、DDL、连接串、cache / queue 参数、共享外部 truth | 只标识 Store 绑定候选，不代表 durable persistence 已选定 |
| `MemberAdapterConfigRef` | 一个 owner-specific adapter slot 的 opaque ref | provider body、URL、credential、SDK response、transport route | 只标识可注入 slot，不代表 owner 接受或 side effect 完成 |
| `MemberAdapterAvailability` | slot、validated ref、有限 availability state、redacted issue | adapter instance、health proof、delivery / acceptance proof | `Enabled` 只代表可装配，`Unavailable` 不改写 local truth |
| `BlockedSeamState` | blocker ID、seam family、scope、safe reason | 默认成功、伪造 schema、外部 body、delivery receipt | 只能是 pending / blocked / waiting / unknown |

## 5. 配置引用表

下表中的类型是**逻辑类别或 planned typed section**；`04-配置设计.md` 才决定最终字段名、格式和数值。`local / deterministic` 仅表示可用于 P0 contract / application test 的保守姿态，不是已运行事实。

| 配置类别 / 引用 | 逻辑类型 | 读取模块 | 当前默认口径 | 详细配置文档位置 |
|---|---|---|---|---|
| runtime profile 与 provenance | `MemberRuntimeProfileRef` / `MemberRuntimeConfigRef` | `infra/config.rs`, `infra/runtime_builder.rs` | 选择一个经校验的 profile；缺失或冲突 fail closed | `04` runtime profile / provenance |
| CP01~CP05 local truth Store | `MemberStoreConfigRef`（按 Store kind 分开） | `infra/runtime_builder.rs`, local truth / continuation stores | P0 可由 deterministic local implementation 承接；不锁 DB 产品 | `04` store sections |
| CP06 mirror / support Store | `MemberStoreConfigRef` | `infra/runtime_builder.rs`, `support_truth_store.rs` | 未绑定时 resolution / refresh 保持 blocked 或 not-available | `04` mirror store |
| CP07 projection Store | `MemberStoreConfigRef` | `infra/runtime_builder.rs`, `projection_store.rs` | 未绑定时 Query 返回 stale / not-ready；不由 Query rebuild | `04` projection store |
| continuation attempt / gap Store | `MemberStoreConfigRef` | `infra/runtime_builder.rs`, `continuation_store.rs` | 仅承接 local attempt / gap；不等于 broker / outbox | `04` continuation |
| idempotency / typed result Store | `MemberStoreConfigRef` | `infra/runtime_builder.rs`, `idempotency_store.rs` | 未绑定时 write channel 不进入 mutation；duplicate 缺 carrier fail closed | `04` idempotency / result |
| Clock adapter slot | `MemberAdapterConfigRef` | `infra/clock_id.rs`, builder | 测试使用 deterministic fake；运行态 adapter 需正式绑定 | `04` technical adapters |
| ID generator adapter slot | `MemberAdapterConfigRef` | `infra/clock_id.rs`, builder | 测试使用 deterministic fake；失败不得构造 partial object | `04` technical adapters |
| digest adapter / canonical implementation slot | `MemberAdapterConfigRef` | `infra/runtime_builder.rs`, application injection | 只有 Step 8 canonical input 可用时计算；缺失 fail closed | `04` digest |
| command boundary limits | `MemberCommandBoundaryConfig` | `infra/config.rs` → `api` / application | 仅提供已校验的大小 / cardinality posture；数值待 `04` | `04` command boundary |
| query page / read consistency limits | `MemberQueryBoundaryConfig` | `infra/config.rs` → `api` / read services | Query 仍 no-write；page / freshness 数值待 `04` | `04` query / projection |
| idempotency / reservation retention | `MemberIdempotencyConfig` | `infra/config.rs`, idempotency adapter / maintenance job | 只决定清理窗口类别；不得删除未完成 relation 或改变 replay 语义 | `04` idempotency |
| Consumer dedup posture | `MemberConsumerDedupConfig` | `infra/config.rs`, worker composition | 只提供 source identity / retention posture；不替代 envelope identity | `04` Consumer |
| projection freshness / activation | `MemberProjectionConfig` | `infra/config.rs`, read model / rebuild job | `available` 仍需 committed resolution 与 watermark；阈值待 `04` | `04` projection |
| job batch / parallelism | `MemberJobConfig` | `infra/config.rs`, `jobs` / `worker` | P0 测试可使用 deterministic 单并发；不能声明 scheduler 行为 | `04` jobs |
| job retry / timeout category | `MemberJobRetryConfig` | `infra/config.rs`, job wrapper | 仅给出策略类别；unknown / conflict 不得盲重试 | `04` retry / timeout |
| host collaboration adapter slot | `MemberAdapterConfigRef` | builder → `HostCollaborationPort` | `L2M-UP-001/006` 未闭合时 blocked-aware slot | `04` host binding |
| Runtime entry / material adapter slot | `MemberAdapterConfigRef` | builder → Runtime Ports | `L2M-UP-003/004` 未闭合时 blocked-aware slot | `04` Runtime binding |
| owner-specific source resolver slots | `MemberAdapterConfigRef` 集合 | builder → CP06 / CP02 source Ports | 每个 owner 独立；不建立 generic resolver hub | `04` source binding |
| publication / observation handoff slots | `MemberAdapterConfigRef` | builder → `PublicationHandoffPort` / `ObservationHandoffPort` | 只形成 local attempt / gap；24 event candidate 不激活 | `04` handoff binding |
| API / worker / Job registry posture | `MemberRegistryConfig` | `infra/config.rs` → entry registry | 只控制 logical registration；不选择 route、process 或 listener | `04` registry |
| optional capability outlet / projection activation | `MemberFeaturePosture` | builder → read model | 只允许在正式 source / consumer contract 存在时启用；默认可裁剪 | `04` feature posture |

## 6. section 到代码绑定表

| section | 校验责任 | 注入目标 | 允许的使用方式 | 禁止的使用方式 |
|---|---|---|---|---|
| profile / provenance | `infra::config` | builder state、redacted issues | 记录选中的 config ref 与来源类别 | 让 domain 读取 profile 或用 provenance 代替 owner truth |
| local Store sections | `infra::runtime_builder` | CP01~CP07 Store、UoW、idempotency / result Port | 创建 concrete local implementation 或明确 unavailable marker | 暗含 DB、共享外部 truth、跨 Store 事务 |
| source resolver sections | builder | 每个 owner-specific resolver Port | 注入 source-specific adapter 或 blocked seam | generic provider、任意 URL / provider key、默认 source |
| host / Runtime handoff sections | builder | host / Runtime / publication / observation Port | 交给 application 形成 typed attempt / gap | 将 local `submitted` 改写为 external accepted / delivered / observed |
| technical sections | builder | Clock、ID、digest Port | 在 factory 前注入；失败 fail closed | domain 自己生成 ID、用时间或 trace 代替 version / digest |
| boundary sections | builder → api / worker / jobs | 已验证的边界参数 | 限制输入大小、分页或 runner 资源 | 关闭 metadata / idempotency、绕过 body gate |
| freshness / activation sections | builder → query / jobs | typed freshness / activation posture | 只影响 read surface 与 rebuild cadence 类别 | Query 写 Store、以 config 直接声明 current / available |
| registry sections | builder → logical registry | `MemberApiRegistryState`、`MemberWorkerRegistryState`、`MemberJobRunnerRegistryState` | 注册 / 禁用 logical entry | 创建 server、listener、scheduler、health 或 process topology |

## 7. 禁止配置化边界

| 不得由配置改变的内容 | 原因 | 违反时处理 |
|---|---|---|
| `ProjectMemberRef + GlobalMemberRef` 执行主语及 matching guard | CP01 与 `L2M-UP-008` 的身份 / subject invariant | validation reject，并回开 owner / scope 设计 |
| Runtime loop / context / plan / outcome、host lifecycle / registry / health、image supply | 外部 owner truth 不在 member | validation reject；保留 blocked seam |
| LLM reasoning、memory、checkpoint、tool execution、capability registry、MCP/A2A/API adapter | 不属于本仓职责 | 不提供配置入口；发现需求则回退范围 |
| screening rule taxonomy、allowlist / denylist、authorization、approval truth | member 只消费正式 safe result | config 不得写本地裁决；unknown 保守阻断 |
| body-free / forbidden-body 规则、secret / raw body / definition / complete log / evidence body | 安全与数据归属边界 | validation reject；不允许 debug / feature flag 绕过 |
| Command / Consumer / Job metadata、idempotency key、digest、typed replay、CAS version | 协议和并发不变量 | validation reject；不得关闭或降级为 best effort |
| Query no-write、projection / mirror 单向写边界 | 防止读路径修复 truth | 入口拒绝该配置；不得让 Query 触发 refresh / rebuild / reconcile |
| `Blocked` / `Waiting` / `Unknown` / `Stale` / `Gap` 的显式状态与 unknown-side-effect fence | 未证明依赖不能配置放行 | 保持保守 outcome；不得 default-pass |
| 24 个 outbound semantic candidates 的 blocked 状态 | `L2M-UP-005` 未提供 exact carrier / route | 不生成 event、publisher、outbox、topic、DLQ 或 delivery receipt |
| Core-only compile 分类 | 运行期 / event / ref 关系不能被环境开关改成 Cargo dependency | implementation gate reject；仅 core-contracts path 可保留 |
| local truth / external effect / downstream acceptance 的语义 | 防止配置把 `attempt` 变成 delivered / accepted / observed | 保留 local marker；外部结论必须由 owner feedback 提供 |

## 8. 外部依赖绑定表

超时、重试和批量字段只写策略类别，具体值留给 `04`。`fake` 是测试装配，不是关闭上游 blocker 的证据。

| 依赖 / 关系 | 绑定位置 | 使用接口 / 载体 | 超时 / 重试类别 | 不可用时处理 |
|---|---|---|---|---|
| member-local truth Store | `infra/local_truth_store.rs` | CP01~CP05 Store + `MemberUnitOfWork` | local transaction policy；不静默重试 version conflict | no write；返回 `DependencyUnavailable` / `Blocked` |
| mirror / support Store | `infra/support_truth_store.rs` | `ExternalContextMirrorStore`、CP06 read | source refresh policy；不以旧 snapshot伪装 current | resolution / refresh `Waiting`、`Stale` 或 `NotAvailable` |
| projection Store | `infra/projection_store.rs` | projection / visibility / rebuild Port | rebuild continuation policy | Query 返回 stale / not-ready；不由 Query 修复 |
| continuation Store | `infra/continuation_store.rs` | attempt / gap / feedback successor | handoff continuation policy | 保存允许的 gap；unknown 不盲重发 |
| idempotency / typed result Store | `infra/idempotency_store.rs` | reservation、Command / Consumer / Job typed carrier replay | retention policy；duplicate 只 typed replay | unavailable -> 不进入 mutation；missing carrier -> consistency defect |
| Clock / ID / digest technical adapters | `infra/clock_id.rs` 或明确 technical adapter | `MemberClockPort`、`MemberIdGeneratorPort`、`MemberDigestPort` | technical availability；不以 retry 生成第二 ID | fail closed；不构造 partial object / reservation |
| `L0-bus` event collaboration | `worker` / blocked event seam / future adapter slot | inbound Consumer boundary、committed-fact ref；24 outbound candidate仍 blocked | redelivery / dedup posture由 owner contract决定 | unsupported / blocked receipt；不定义 topic、ack、route、publisher 或 outbox |
| `L2-runtime` | `infra/blocked_seams.rs` → Runtime Ports | `RuntimeContractResolverPort`、`RuntimeEntryPort`、`RuntimeMaterialSourcePort` | source / handoff policy（数值待 `04`） | `L2M-UP-003/004` 下 blocked / waiting / unknown；不创建 Runtime run |
| `L2-member-service` host seam | `infra/blocked_seams.rs` → CP01 Ports | `HostCollaborationPort`、host feedback logical carrier | host feedback / continuation policy | `L2M-UP-001/006` 下 blocked；不声明 registration / session / health |
| `L2-member-images` supply ref | builder 的 ref / availability slot | pinned component release / entry ref（待 sibling 合同） | 不在 member 选择 image retry | `L2M-UP-002` 下 waiting / not available；不复制 manifest / image truth |
| `L1-work` | CP06 source resolver slot | `WorkContextResolverPort`、`ProjectMemberRef` safe snapshot | source resolution policy | blocked / waiting；不保存 Work body |
| `L1-identity` | CP01 / CP06 source resolver slot | `IdentityContextResolverPort`、`GlobalMemberRef` safe anchor | source resolution / event redelivery类别 | credential / identity unknown -> reject / blocked；不复制 Identity truth |
| `L1-governance` | CP06 source resolver slot | `GovernancePolicyContextResolverPort` / screening safe result | policy source refresh类别 | `L2M-UP-007` 下 blocked；不建本地 policy / approval |
| `L2-tools` / method source | CP06 / CP07 resolver slot | `ToolContractContextResolverPort`、`MethodDefinitionContextResolverPort` | source resolution类别 | safe outlet `NotAvailable` / `Stale`；不建 registry / invocation |
| `L1-conversation` | CP02~CP05 event / ref seam | body-free context ref / committed-fact consumer | source redelivery / resolver类别 | body 不入 member；Query / trace degraded or gap |
| `L1-artifact` / evidence | CP04 / CP05 source / ref seam | safe evidence summary ref | source availability类别 | unresolved reference；不保存 evidence body / verdict |
| `L4-observability` | CP05 observation handoff / inbound signal seam | `ObservationHandoffPort`、safe signal ref | handoff retry类别 | local attempt / gap；不声明 observed/backend status |
| downstream publication target | CP04 `PublicationHandoffPort` | `MemberPublicationSubmission`、typed submission ref | handoff continuation类别 | `Blocked` / `Unknown`；不声明 delivered / accepted |
| downstream observation target | CP05 `ObservationHandoffPort` | `MemberObservationSubmission`、typed submission ref | handoff continuation类别 | `Blocked` / `Unknown`；trace 保留 local posture |
| `L0-sdk` | downstream read consumer | public contracts / query response ref | 由 SDK owner决定 | 不反向依赖 member；缺失不阻塞核心 local composition |

## 9. 编译期与运行期依赖分类

### 9.1 唯一 planned Cargo path dependency

| 依赖仓库 | 全局类型 | 本地路径 | Cargo 引用方式 | 使用位置 | 不可用时处理 |
|---|---|---|---|---|---|
| `quantalithos-core` | compile dependency | `/home/aris/Projects/quantalithos-core` | `core-contracts = { path = "../quantalithos-core/crates/contracts" }`，未来 root `Cargo.toml` 的 workspace dependency | 先由 `contracts` 使用；其他 crate 仅在对象 / carrier 明确需要时通过 workspace alias 引用 | 目标仓或 crate 缺失时暂停依赖真实 Core 类型的实现；不得 shadow 或用 sibling DTO替代 |

### 9.2 不进入 Cargo 的关系

| 关系类别 | 项目 | 表达方式 | 禁止误读 |
|---|---|---|---|
| runtime / host | Runtime、member-service、Work、Identity、Governance、Tools / Method | owner-specific Port、resolver、blocked adapter、safe ref | 不得写成 path dependency 或 local package |
| event collaboration | L0-bus、Conversation、Observability source | Consumer、committed-fact ref、redelivery / dedup carrier；outbound candidates保持 blocked | 不得写 topic、route、ack、publisher、outbox 或 delivery proof |
| handoff / downstream | host、Runtime、publication、observation、archive-like target | local attempt / gap + handoff Port | 不得把 submission ref写成 accepted / delivered / observed |
| ref / supply | member-images、L0-sdk、Artifact / evidence | typed ref、pinned availability posture、downstream read consumption | 不得复制 image / artifact / SDK truth |
| fake | 所有 Port 的 deterministic test double | `tests/` 或 test-only fixture assembly | fake 不关闭 blocker、不产生 integration evidence、不写运行态默认 |

## 10. Runtime builder 装配顺序

```text
MemberConfigLoader.load(profile selector)
  -> validate raw sections and provenance (infra/config.rs)
  -> produce MemberRuntimeConfigRef / StoreConfigRef / AdapterConfigRef
  -> create MemberRuntimeBuilderState::for_config
  -> validate invariant-safe combinations and pending blocker gates
  -> assemble logical local Store slots
  -> assemble MemberUnitOfWork and idempotency / typed-result stores
  -> assemble Clock / ID / digest technical Ports
  -> assemble owner-specific source resolvers (or BlockedSeamState)
  -> assemble host / Runtime / publication / observation handoff slots
  -> assemble application services from application-owned Ports
  -> assemble API / worker / jobs logical registries
  -> mark builder Ready only for local composition exposure
  -> expose facade / entry bindings with validated parameters
```

装配规则：

1. 所有 mandatory local Store、UoW、idempotency / typed result 和 technical Port 必须有明确 availability marker；缺失时不暴露可写 facade。
2. `L2M-UP-001~008` 对应的 external slot 可以被装配为 `BlockedSeamState`；`Ready` 只表示本地 builder 完成，不表示 host、Runtime、Bus、source owner 或 downstream 可用。
3. `api`、`worker`、`jobs` 只接收 facade / named service 和 validated boundary posture，不持有 raw config，也不直接访问 Store / adapter implementation。
4. application service 只通过 Step 7 Port 调用；domain factory 只接收显式 typed input，不读取 config。
5. builder 不得把 `MemberAdapterAvailability::Enabled` 解释为 external acceptance、delivery、observed、healthy 或 image ready。
6. optional capability outlet、projection activation 和 handoff slot 的启用不能改变 core command acceptance、subject guard、state machine 或 Query no-write。

## 11. 不可用、fake 与 blocked seam 处理

| 场景 | 允许的装配 | 禁止的装配 / 结论 |
|---|---|---|
| `core-contracts` 仓 / crate 不存在 | 暂停依赖真实 Core type 的实现；可继续做纯文档或无该类型的静态校验 | 不复制 Core type，不用字符串替代 shared ref |
| local Store / UoW 不存在 | 实现阶段暂停写路径；测试可用标注为 test-only 的 deterministic fake | 不把 Query / fake 当 durable truth，不宣称持久化已可用 |
| source owner contract 未闭合 | 注入 `BlockedSeamState`，保留 blocked / waiting / unknown outcome；测试可用 source-specific fake 验证 fail-closed | 不创建 generic resolver、不私造 sibling DTO、不 default-pass |
| host / Runtime / handoff contract 未闭合 | 保留 local decision / material / attempt / gap；测试可模拟 `Blocked`、`Waiting`、`Unknown` | 不声明 IPC / runtime run / delivery / acceptance / observed |
| L0-bus member-specific event schema未闭合 | 只保留 Consumer boundary 与 blocked outbound candidate | 不创建 publisher、outbox、topic、route、DLQ、ack 或 delivery receipt |
| optional outlet / projection source 未闭合 | 禁用或返回 `NotAvailable` / `Stale` / `Gap` | 不把 outlet availability 变成 authorization / registry / execution readiness |

## 12. 前序 Step 回填审计

| 前序 Step | 审计结论 | 回填决定 |
|---|---|---|
| Step 3 constraints | Core-only compile 与 runtime / event / ref / adapter / fake 分类保持一致 | 不回填；正式 §5.13 引用唯一 Core path |
| Step 4 file layout | `infra/config.rs`、`infra/runtime_builder.rs`、local / support / projection / continuation store 和 blocked seam 文件足以承接本 Step | 不新增 crate / binary / config crate |
| Step 5 module contracts | `infra` 负责绑定；application / domain 不读取 raw config | 不回填职责；正式文档只写边界结论 |
| Step 6 object contracts | config ref、availability、builder state、blocked seam 均保持 body-free | 不新增 raw config 字段或 adapter instance |
| Step 7 Port contracts | 所有 source / handoff / technical / Store relation均有 application-owned injection point；无 member publisher / outbox Port | 不创建被历史 README 暗示的 event publisher |
| Step 8 protocol contracts | Command / Query / Consumer / Job metadata 与 blocked event candidate 的绑定不被配置改写 | transport-neutral；24 candidate仍 `Blocked(L2M-UP-005)` |
| Step 9 function flows | builder 只提供 flow 所需 Port / typed params；不改变 reserve → mutation → carrier → complete → commit顺序 | 不回填 flow |
| Step 11 persistence | Store / UoW / CAS / replay / no-write 语义与配置 retention / availability分类一致 | 数值、产品、DDL留 `04` |
| Step 12 error / recovery | unavailable、unknown、missing carrier、conflict 的 conservative mapping 可由 config posture承接 | 不将 retry config写成自动恢复证据 |
| Step 13 concurrency / idempotency | reservation、digest、typed replay、CAS、retention 类别有明确 binding；Query仍 no-write | 不回填 exact key / digest 算法；由 Step 8/13既有契约承接 |

## 13. 正式 §5.13 回填草稿

> 本段仅是 Step 19 装配时的候选正文；不会把本校准文件的现场探测、用户门禁、测试结果或未确认数值带入正式文档。

详细设计只定义 member 代码需要读取的配置绑定点和依赖注入位置，不替代 `04-配置设计.md`。`infra/config.rs` 负责读取、校验和脱敏，生成 `MemberRuntimeConfigRef`、`MemberStoreConfigRef`、`MemberAdapterConfigRef` 与 provenance；`infra/runtime_builder.rs` 将其绑定到 local Store、UoW、idempotency / typed-result、Clock、ID、digest、owner-specific resolver 及 host / Runtime / handoff Port。`application` 只接收 Port 和 validated typed parameter，`domain` 与 `contracts` 不读取配置。

唯一 planned Rust 编译期 sibling dependency 是：

```toml
core-contracts = { path = "../quantalithos-core/crates/contracts" }
```

Runtime、host、Bus、Work、Identity、Governance、Tools / Method、Conversation、Artifact、Observability、member-service、member-images、SDK 和 downstream 关系均通过 Port、resolver、Consumer、typed ref、handoff、projection 或 test fake 表达，不进入 Cargo。配置不得改变 `ProjectMemberRef + GlobalMemberRef`、truth owner、body-free、screening rule owner、Query no-write、状态迁移、幂等 / CAS、unknown fence 或 `L2M-UP-005` blocked 语义。具体 key、文件 / 环境变量、secret、endpoint、transport binding、产品选择、timeout / retry / retention / batch 数值和部署 profile 留给 `04-配置设计.md`。

## 14. 待确认与回开条件

| ID | 待确认项 | 当前保守口径 | 回开触发 |
|---|---|---|---|
| `L2M-DDD14-001` | `04-配置设计.md` 的完整 key、格式、profile 与数值 | 本 Step 只保留逻辑类别和读取模块 | 进入 04 时展开；不得在 03 伪造 |
| `L2M-DDD14-002` | host / member-service credential、IPC 与 lifecycle binding | 只保留 `MemberAdapterConfigRef` + blocked seam | `L2M-UP-001/006` 发布 exact contract |
| `L2M-DDD14-003` | Runtime entry / material mapping | 只保留 Runtime Port 与 blocked outcome | `L2M-UP-003/004` 关闭 |
| `L2M-DDD14-004` | Core member-specific event schema / route | 24 candidate 固定 blocked | `L2M-UP-005` 关闭后重开 Step 8、9、14 |
| `L2M-DDD14-005` | screening rule taxonomy / source binding | owner-specific resolver，unknown fail closed | `L2M-UP-007` 关闭 |
| `L2M-DDD14-006` | image pinned release / entry shape | member 只持 availability / ref | `L2M-UP-002` 与 member-service 合同闭合 |
| `L2M-DDD14-007` | durable Store、transport、scheduler、parallelism 产品 | 不锁定产品；P0 测试使用 deterministic fake | 新的技术 authority 或 04 / 07 决策 |
| `L2M-DDD14-008` | `Ready` 的外部语义 | 仅 local composition ready | 任何试图声明 host / Runtime / Bus / downstream readiness 时回开 Step 6、12、14 |

## 15. 完成门禁与停审记录

| 门禁 | 结果 | 证据 |
|---|---|---|
| raw config 的唯一读取模块明确 | pass | §4：仅 `infra/config.rs` 读取 raw config |
| validated ref 到 builder / Port 注入明确 | pass | §4、§6、§10 |
| 配置引用表覆盖 Store、technical、boundary、idempotency、projection、job、resolver、handoff、registry | pass | §5 |
| 禁止配置化边界完整 | pass | §7；不改变 owner、state、security、history、pending |
| 外部依赖均可回指 Step 7 Port / Consumer / handoff / projection / fake | pass | §8、§9 |
| 唯一 Cargo path dependency明确 | pass | §9.1，仅 `core-contracts` |
| 运行期 / 事件 / ref 关系未伪装成 package dependency | pass | §9.2；L0-bus 与 24 event candidate无 publisher / outbox / route |
| unavailable / fake / blocked 行为明确 | pass_with_upstream_blockers | §11；`L2M-UP-001~008` 和 `L2M-UP-005` 仍开放 |
| 未写完整配置手册、数值或实现事实 | pass | §1、§5、§13；目标实现仓仍 planned / missing |
| formal §5.13 回填可装配 | pass_for_step_19 | §13 提供去现场化候选正文 |

### 停审结论

Step 14 的配置读取边界、依赖分类、绑定位置和不可用策略已完成。`Ready` 仅代表 member-local composition；不表示任何 external owner、Bus、Runtime、host、downstream 或 image 可用。`L2M-UP-001~008`、`L2M-DDD-001~007`、`scope_supersede_gap` 和 `L2M-UP-005` 保持开放。按 full-03 授权，下一步可读取 Step 15 输入并创建其独立中间产物；本 Step 在此停审。
