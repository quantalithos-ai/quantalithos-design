# L2-tools 03 详细设计 Step 14: 配置引用与外部依赖绑定

> 对应 SOP: `standards/document/详细设计讨论流程_SOP.md` Step 14
> 对标粒度: `projects/L1-governance/design-calibration/03_ddd_step_14_config_external_binding.md`
> 正式文档: `projects/L2-tools/03-详细设计.md`（Step 19 前保持 write-closed）
> 模式: `full-restart / single-agent-serial`

## 0. Step 开工确认

| 项目 | 记录 |
|---|---|
| 前序门禁 | Step 13 `completed / pass`；key/digest、CAS、semantic unique、Prepared/unknown fence 和 late-material 规则已闭合。 |
| 直接输入 | 正式 02 §11 配置影响轮廓；Step 3 constraints；Step 4 file layout；Step 5 module contracts；Step 6 object carriers；Step 7 Store/Port/adapter seams；Step 8 protocol inventory；Step 9 flow cards；Step 10 state matrix；Step 11 persistence；Step 12 error/recovery；Step 13 concurrency/idempotency。 |
| 固定实现骨架 | `contracts`、`domain`、`application`、`infra`、`api`、`worker`、`jobs` 七个 planned member；`infra/config.rs` 和 `infra/runtime_builder.rs` 是配置与装配唯一主轴。 |
| 固定外部 Port | `SharedContractAuthorityPort`、`HubControlledSourcePort`、`InvocationCallerPort`、`AuthorizationConsumptionPort`、`SandboxExecutionPort`、`ExecutionSourceIntakePort`、`SafeEventCollaborationPort`；不新增第八个 external Port。 |
| 物理产品 | 未选择 database、cache、broker、scheduler、HTTP/RPC framework、async executor、secret platform、telemetry backend 或 external registry。 |
| 实现仓事实 | 计划目标 `/home/aris/Projects/quantalithos-tools` 当前不存在；本 Step 只写 planned binding，不声称已有 manifest、adapter、build 或 readiness。 |
| 外部 blocker | `L2T-UP-001~009` 原样继承；配置存在、endpoint 可达、fake 返回成功或 sibling 仓存在都不能关闭 blocker。 |
| 正式回填 | 本 Step 只写中间产物；正式 §13 仅在 Step 19 依据本文件及后续 Step 15~18 结论整体装配。 |
| 提交 | 未获用户授权，不提交 commit。 |

## 1. 本步目标与边界

本 Step 把“实现需要读取什么配置”和“配置如何变成可调用的依赖”收束成可落码的
composition contract。实现者完成本 Step 后应能回答：

1. 哪些 config candidate 由 `infra/config.rs` 读取、校验并转换为哪些 typed refs。
2. 哪些模块可以看到 `ToolsRuntimeConfig`，哪些模块只能收到 Port/Store/typed parameter。
3. 七个 Store、`ToolsUnitOfWorkManager`、`IdempotencyStore`、`ClockPort`、`IdGeneratorPort`、`ProjectionStore` 如何装配并共享一致性能力。
4. 七个 external Port 如何分别绑定 adapter、formal authority、blocked adapter、fake 和后续 durable implementation。
5. compile-time、runtime、event collaboration、handoff/export、downstream 五类依赖如何裁剪。
6. 配置缺失、合同 blocked、adapter unavailable、timeout、retryable failure 和 side-effect unknown 各自落在哪个安全 surface。

本 Step 不写完整配置手册。以下内容留给后续 `04-配置设计.md` 或实施阶段：配置文件格式、环境变量名称、profile 合并优先级、secret 注入机制、endpoint/route 的实际值、timeout/retry/retention 的具体数值、cron/scheduler 表达式、部署拓扑、迁移脚本和运维告警阈值。

本 Step 也不把任何相邻 owner 吸收进 L2-tools：agent loop、LLM planning、runtime orchestration、capability registry truth、effective authorization、Sandbox isolation/execution truth、Bus delivery/retry/DLQ、Observability store/retention、marketplace listing 和 SDK client 均在边界外。

## 2. SOP 问题回答

| SOP 问题 | 收口回答 |
|---|---|
| 哪些模块读取配置？ | 只有 `infra/config.rs`、`infra/runtime_builder.rs`、entry wiring（`api`/`worker`/`jobs`）和具体 infra adapter/store wrapper 读取配置；`contracts`、`domain` 不读取，`application` 不持有原始 config object。 |
| 配置项的类型、默认口径和读取位置是什么？ | 配置先进入 `ToolsConfigCandidate`，经 validator 变成 `ToolsRuntimeConfig`；默认只允许是“显式 fixture/fake、显式 disabled 或标准安全类别”，不允许默认生成 identity、allow、readiness、delivered 或 outcome。具体数值交给 04。 |
| 哪些外部依赖通过 adapter 注入？ | Core shared contract 通过唯一 compile candidate；Hub/Auth/Sandbox/source/collaboration 通过七个 application-owned Port；Bus/Observability 只通过 safe material/status/handoff collaboration；SDK 只作 future consumer。 |
| 超时、重试、降级怎么表达？ | 只绑定 typed categories：`TimeoutClass`、`RetryClass`、`DegradedSurfaceClass`。Step 12/13 已规定 unknown/manual 和 no-blind-retry；本 Step 不填具体数字。 |
| 哪些细节留给配置设计？ | 文件/环境变量/secret/profile/具体 endpoint、topic/route、数值、部署和 scheduler 细节全部留给 04/实施。 |
| 哪些跨仓 Rust 依赖进 Cargo？ | 仅允许实际检索到的 `core-contracts` path candidate；Core 以外 sibling 不进入 Cargo。Tools-specific Core schema 仍受 `L2T-UP-008` 阻塞。 |
| 运行期/事件协作怎么表达？ | runtime 用 resolver/Port/fake；event 用 safe event envelope、publisher/feedback Port、local attempt 和独立 status ref；handoff/export 用 target ref + adapter registry，不把目标 ref 当 adapter ref。 |
| 依赖仓不存在或合同未闭口怎么办？ | 生产 profile 安装 full trait 的显式 blocked adapter；测试 profile 可安装 deterministic fake；不得静默使用 fake、local registry、host fallback、旧 cache 或空值冒充正式依赖。 |

## 3. 当前材料诊断与设计取舍

### 3.1 Historical material / conflict audit

| 材料 | 冲突 | 本 Step 处理 |
|---|---|---|
| 旧 `README.md` | Python 同进程、builtin/MCP、member-images 等旧装配线与当前 Rust workspace 和 tool-contract boundary 冲突。 | `historical_material`；不恢复旧 config key、registry、plugin 或 provider。 |
| 旧正式 `03-详细设计.md` | PostgreSQL/Redis/NATS、RPC/HTTP、executor、registry、policy 等未获当前 authority。 | `historical_material`；不把产品名、连接串或旧 adapter 当作配置事实。 |
| 正式 02 §11 | 只给配置影响轮廓，没有 typed config candidate、builder 阶段和 adapter availability 语义。 | 本 Step 补齐 typed candidate、binding、builder、fallback 和 failure surface；不反写 02。 |
| Step 7 infra annex | 已定义 application-owned traits、blocked adapter、fake/durable parity，但把 config schema 留给本 Step。 | 本 Step 只绑定现有 trait，不能新增第二套 Port。 |
| Step 13 | retention/retry 数值留后续配置，unknown 不得盲重试。 | 本 Step 只固定读取点和类别，不放宽重入规则。 |
| 目标实现仓 | `/home/aris/Projects/quantalithos-tools` 不存在。 | 所有路径均标 `planned`；不能声称代码、Cargo、构建或测试存在。 |

### 3.2 设计取舍

| 议题 | 选择 | 原因 |
|---|---|---|
| config ownership | `infra/config.rs` 持有 raw candidate 和 validated runtime surface | 配置是装配输入，不是 public protocol 或 domain truth。 |
| application 是否看到 config | 只注入 Port/Store/UoW/typed policy parameter | 避免 application 依赖 infra schema，也避免 config 绕过 domain invariant。 |
| domain 是否读取 config | 不读取 | 状态、owner、fail-closed、forbidden-body 和 history 必须环境无关。 |
| production fallback | open seam 使用显式 blocked adapter；local truth 需要 durable-capable adapter | 空实现、cache 或 memory fallback 不能冒充 accepted truth。 |
| test fallback | deterministic fake 复现完整 typed resolution/error/unknown 结果 | fake 证明 L2 behavior，不证明 provider/route/readiness。 |
| external target identity | target ref 与 adapter ref 分离 | target 是业务/协作定位，adapter ref 是 composition 选择，不能互相推导。 |
| physical route | Step 8 semantic event name/schema 保持唯一；Step 14 只绑定 topic-neutral key 到 adapter config | 防止 transport route 改变事件语义或成为第二 schema authority。 |

## 4. Typed config candidate 与 validated runtime surface

### 4.1 类型层次

以下是 planned Rust 类型边界，不是当前实现仓已有类型。所有 public config type 必须在实现时使用英文 Rustdoc，禁止带 raw body、secret plaintext、URL、SQL、topic credential 或外部 response body 的字段。

```rust
/// Untrusted configuration input before cross-section validation.
pub struct ToolsConfigCandidate {
    pub profile: ToolsProfileCandidate,
    pub boundary: ToolsBoundaryConfigCandidate,
    pub stores: ToolsStoreConfigCandidate,
    pub idempotency: ToolsIdempotencyConfigCandidate,
    pub projection: ToolsProjectionConfigCandidate,
    pub jobs: ToolsJobConfigCandidate,
    pub adapters: ToolsAdapterConfigCandidate,
    pub handoff: ToolsHandoffConfigCandidate,
    pub clock_id: ToolsClockIdConfigCandidate,
    pub features: ToolsFeatureConfigCandidate,
}

/// Validated infra-local references injected by the runtime builder.
pub struct ToolsRuntimeConfig {
    pub profile_ref: ToolsProfileRef,
    pub config_ref: ToolsConfigRef,
    pub boundary: ValidatedToolsBoundary,
    pub stores: ValidatedToolsStoreRefs,
    pub idempotency: ValidatedToolsIdempotency,
    pub projection: ValidatedToolsProjection,
    pub jobs: ValidatedToolsJobs,
    pub adapters: ValidatedToolsAdapterRefs,
    pub handoff: ValidatedToolsHandoff,
    pub clock_id: ValidatedToolsClockId,
    pub features: ValidatedToolsFeatures,
}
```

`ToolsConfigCandidate` 可以包含来源定位和 redacted issue reference，但不能携带业务正文。`ToolsRuntimeConfig` 只包含已验证的 typed refs、limits、categories、feature gates 和 capability markers；它不能携带 `ToolId`、current definition、binding relation、invocation admission、outcome、audit、external status 或任何可改变 truth 的值。

### 4.2 Config loader / validator error surface

```rust
/// Identifies a safe configuration issue without exposing secret or backend text.
pub enum ToolsConfigIssueKind {
    MissingRequiredSection,
    InvalidTypedValue,
    CrossSectionConflict,
    UnsupportedCapability,
    BlockedExternalContract,
    UnsafeOverrideAttempt,
    MissingUnitOfWorkCapability,
    MissingReplaySurface,
}

/// Safe validation result returned by infra composition.
pub struct ToolsConfigValidationError {
    pub issue_kind: ToolsConfigIssueKind,
    pub section_ref: ToolsConfigSectionRef,
    pub issue_code: ToolsConfigIssueCode,
}
```

`ToolsConfigValidationError` 只暴露稳定 code、section ref 和修复方向。底层 parser/OS/backend error 只能在 Step 15 的 body-free diagnostic mapping 中使用；不得进入 protocol、domain error、audit material 或外部 event。

### 4.3 Candidate 到 validated ref 的规则

| Candidate 来源 | Validated 结果 | 允许条件 | 禁止推断 |
|---|---|---|---|
| profile selector | `ToolsProfileRef` | profile 名称和来源已校验 | profile 名称不产生 actor/authority/truth |
| store adapter ref | `ToolsStoreAdapterRef` | adapter 声明支持所需 logical store、version、UoW capability | endpoint/文件存在不等于原子能力 |
| external adapter ref | `ToolsAdapterConfigRef` + `AdapterAvailabilityMarker` | operation/version/body policy/authority mode 通过 validator | configured endpoint 不等于 `PortResolution::Available` |
| target ref | `ToolsTargetRef` | target class 与 event/handoff contract 对齐 | target ref 不生成 adapter ref、route 或 delivered 状态 |
| feature flag | `ValidatedToolsFeature` | 只控制外围 route/job/event projection enablement | 不得关闭核心 gate、audit、outcome、idempotency 或 no-write |
| timeout/retry candidate | typed category | category 与调用类别相容 | 不得把 unknown 变 retryable 或覆盖 Step 12/13 |
| page/batch candidate | bounded typed limit | 非零、有界、scope/cursor 规则通过验证 | 不得扩展 UoW、跳过 gap 或改变 query semantics |

## 5. 配置引用表

默认值在本表中只表示逻辑默认类别；`04-配置设计.md` 必须给出具体值、格式和 profile 规则。`P0 fake` 明确指测试/fixture profile，不是生产默认实现。

| 配置 section / binding | Typed candidate / validated type | 读取模块 | 注入 / 影响位置 | 逻辑默认 | 04 承接 |
|---|---|---|---|---|---|
| `profile` | `ToolsProfileCandidate` -> `ToolsProfileRef` | `infra/config.rs` | `runtime_builder` 选择 profile | explicit profile;未指定时拒绝或使用受控 fixture profile | profile/source |
| `config identity` | `ToolsConfigRefCandidate` -> `ToolsConfigRef` | `infra/config.rs` | validation issue attribution | loader-issued ref | identity/source |
| `boundary.command` | `ToolsCommandBoundaryCandidate` -> `ValidatedCommandBoundary` | `api/command_handlers.rs` wiring | command body/page/metadata pre-validation | safe bounded category | command boundary |
| `boundary.query` | `ToolsQueryBoundaryCandidate` -> `ValidatedQueryBoundary` | `api/query_handlers.rs` wiring | page/filter/read-time category | safe bounded category | query boundary |
| `boundary.consumer` | `ToolsConsumerBoundaryCandidate` -> `ValidatedConsumerBoundary` | `worker/consumers.rs` | envelope/schema/body validation | strict envelope gate | consumer boundary |
| `boundary.job` | `ToolsJobBoundaryCandidate` -> `ValidatedJobBoundary` | `jobs` entries | job request decoding and bounded scope | strict typed request | job boundary |
| `stores.contract` | `ToolsStoreBindingCandidate` -> `ToolContractStoreRef` | `infra/runtime_builder.rs` | `ToolContractStore` adapter | durable-capable;P0 fake only test profile | store.contract |
| `stores.binding` | `ToolsStoreBindingCandidate` -> `CapabilityBindingStoreRef` | `infra/runtime_builder.rs` | `CapabilityBindingStore` adapter | durable-capable;P0 fake only test profile | store.binding |
| `stores.invocation` | `ToolsStoreBindingCandidate` -> `ToolInvocationStoreRef` | `infra/runtime_builder.rs` | `ToolInvocationStore` adapter | durable-capable;P0 fake only test profile | store.invocation |
| `stores.handoff` | `ToolsStoreBindingCandidate` -> `ExecutionHandoffStoreRef` | `infra/runtime_builder.rs` | `ExecutionHandoffStore` adapter | durable-capable;P0 fake only test profile | store.handoff |
| `stores.outcome_audit` | `ToolsStoreBindingCandidate` -> `OutcomeAuditStoreRef` | `infra/runtime_builder.rs` | atomic outcome/audit adapter | pair-atomic capability required | store.outcomeAudit |
| `stores.submission` | `ToolsStoreBindingCandidate` -> `ExternalSubmissionStoreRef` | `infra/runtime_builder.rs` | material/attempt/status ref adapter | append/CAS capability required | store.submission |
| `stores.projection` | `ToolsStoreBindingCandidate` -> `ProjectionStoreRef` | `infra/runtime_builder.rs` | projection/reference/report adapter | explicit stale/rebuilding surface | store.projection |
| `stores.uow` | `ToolsUowCapabilityCandidate` -> `ValidatedToolsUowCapability` | `infra/runtime_builder.rs` | `ToolsUnitOfWorkManager` | one shared local authority | transaction capability |
| `idempotency.command` | `ToolsRetentionCategory` + store ref | `infra/idempotency_store.rs` | Command claim/result replay | replay obligation preserved | idempotency.command |
| `idempotency.consumer` | `ToolsRetentionCategory` + store ref | `worker` / idempotency adapter | Consumer claim/receipt | source redelivery obligation preserved | idempotency.consumer |
| `idempotency.continuation` | `ToolsRetentionCategory` + store ref | `worker` / submission adapter | OF claim/attempt | side-effect marker obligation preserved | idempotency.continuation |
| `idempotency.job` | `ToolsRetentionCategory` + store ref | `jobs` / idempotency adapter | Job claim/report | report replay obligation preserved | idempotency.job |
| `projection.freshness` | `ToolsFreshnessPolicyCandidate` -> `ValidatedFreshnessPolicy` | `application` query wiring | stale/rebuilding/read surface only | explicit category, no hidden refresh | projection.freshness |
| `projection.rebuild` | `ToolsProjectionJobCandidate` -> `ValidatedProjectionJobConfig` | `jobs/rebuild_tool_derived_views.rs` | bounded target/page/watermark | bounded page | projection.rebuild |
| `jobs.batch` | `ToolsBatchLimitCandidate` -> `ToolsBatchLimit` | `jobs/*`, `worker/*` | bounded slices | bounded category | jobs.batch |
| `jobs.parallelism` | `ToolsParallelismCandidate` -> `ToolsParallelism` | `jobs/*`, `worker/*` | runner scheduling only | deterministic single-worker fixture | jobs.parallelism |
| `jobs.retry` | `ToolsRetryClassCandidate` -> `ToolsRetryClass` | job/adapter wrapper | retry category only | no blind retry | jobs.retry |
| `jobs.timeout` | `ToolsTimeoutClassCandidate` -> `ToolsTimeoutClass` | job/adapter wrapper | timeout classification | category only | jobs.timeout |
| `adapters.core` | `ToolsAdapterConfigRefCandidate` -> `CoreAuthorityAdapterRef` | `infra/source_resolvers.rs` | `SharedContractAuthorityPort` | candidate/blocked until schema verified | adapter.core |
| `adapters.hub` | `ToolsAdapterConfigRefCandidate` -> `HubAdapterRef` | `infra/source_resolvers.rs` | `HubControlledSourcePort` | blocked-aware | adapter.hub |
| `adapters.authorization` | `ToolsAdapterConfigRefCandidate` -> `AuthorizationAdapterRef` | `infra/source_resolvers.rs` | `AuthorizationConsumptionPort` | blocked until owner/source/schema closure | adapter.authorization |
| `adapters.sandbox` | `ToolsAdapterConfigRefCandidate` -> `SandboxAdapterRef` | `infra/source_resolvers.rs` | `SandboxExecutionPort` and source intake | blocked until mapping/receipt closure | adapter.sandbox |
| `adapters.collaboration` | `ToolsAdapterConfigRefCandidate` -> `CollaborationAdapterRef` | `infra/publishers.rs` | `SafeEventCollaborationPort` | route-blocked until Bus/Obs contract closure | adapter.collaboration |
| `adapters.visibility` | `ToolsAdapterConfigRefCandidate` -> `VisibilityResolverRef` | `infra/runtime_builder.rs` | `ReadVisibilityResolverPort` | deterministic fake or formal resolver | adapter.visibility |
| `adapters.registry` | `ToolsAdapterConfigRefCandidate` -> `AdapterRegistryRef` | `infra/runtime_builder.rs` | operation/version/authority validation | registry is composition metadata, not domain registry | adapter.registry |
| `handoff.targets` | `ToolsTargetRefSetCandidate` -> `ToolsTargetRefSet` | `infra/handoff_adapters.rs` | safe-material continuation target selection | explicit target set;empty means no target, not success | handoff.targets |
| `handoff.timeout/retry` | typed categories | `worker` continuation wrapper | local attempt disposition | unknown/manual preserved | handoff policy |
| `clock.adapter` | `ToolsAdapterConfigRefCandidate` -> `ClockAdapterRef` | `infra/clock_id.rs` | `ClockPort` | deterministic fake in tests | clock |
| `id_generator.adapter` | `ToolsAdapterConfigRefCandidate` -> `IdGeneratorAdapterRef` | `infra/clock_id.rs` | `IdGeneratorPort` | deterministic fake in tests | id |
| `features.outbound_events` | `ToolsFeatureCandidate` -> `OutboundEventFeature` | `runtime_builder` / worker | enables named OF continuation | disabled means no attempt, not altered local truth | features.events |
| `features.projection_events` | `ToolsFeatureCandidate` -> `ProjectionEventFeature` | `runtime_builder` / worker | optional derived event only | projection truth still maintained if job enabled | features.projection |
| `features.external_status_refresh` | `ToolsFeatureCandidate` -> `ExternalStatusRefreshFeature` | `jobs` | enables JF-04 only | disabled leaves refs unknown/stale, no core failure | features.status |

## 6. Config section 到代码绑定

| Section | 唯一读取者 | 绑定对象 | 允许影响 | 明确不能影响 |
|---|---|---|---|---|
| profile/config identity | `infra/config.rs` | `ToolsConfigRef`, issue attribution | 选择已定义 profile | actor、owner、truth、schema semantics |
| boundary | entry wiring | validated limits and validation categories | reject oversized/malformed/unbounded input | metadata/idempotency/body/visibility requirements |
| seven stores | `infra/runtime_builder.rs` | seven Store trait objects | adapter selection、capability validation | logical Store ownership、key、state、atomic pair |
| UoW | `infra/runtime_builder.rs` | `ToolsUnitOfWorkManager` | local transaction capability | distributed transaction、external receipt、commit semantics |
| idempotency | `infra/idempotency_store.rs` | scope/key/digest retention categories | sidecar retention/cleanup scheduling | key derivation、digest fields、duplicate result meaning |
| projection | `infra/projection_store.rs` + jobs | `ProjectionStore`, freshness policy | rebuild page/watermark/read surface | query write、truth repair、current fallback |
| jobs | `jobs`/`worker` runners | typed runner parameters | bounded page, category, concurrency | command truth, run identity, evidence truth |
| adapters | `infra/*` adapters | named application Port impls | adapter source/operation/version selection | provider authority, allow/deny, route success |
| handoff | `infra/handoff_adapters.rs` | target set and handoff adapter registry | safe-material destination attempt | outcome, delivered, observed, external lifecycle |
| clock/id | `infra/clock_id.rs` | `ClockPort`, `IdGeneratorPort` | technical value production | semantic identity, current revision, source timestamp authority |
| features | builder/entry registration | route/job/derived-event enablement | optional peripheral capability | core command acceptance, safety gates, immutable history |

Application constructors receive only the relevant trait objects and typed parameters. A constructor that accepts `ToolsRuntimeConfig`, `ToolsConfigCandidate`, endpoint strings, secret refs or raw section maps is a design violation and must be corrected before implementation.

## 7. Store、UoW、Clock/ID、Projection、Idempotency 绑定

### 7.1 Logical store binding matrix

| Logical surface | Application trait | Adapter requirement | UoW participation | Version / key rule | Config failure surface |
|---|---|---|---|---|---|
| contract/history | `ToolContractStore` | current bundle + immutable definition/evolution append | all contract Commands | `Loaded<T>.expected_version`; semantic `(tool_id, revision)` | owning command unavailable; no partial current switch |
| binding/source | `CapabilityBindingStore` | relation, snapshot, assessment, change fact | binding Commands/Consumers | relation CAS + semantic current key | blocked/unavailable/gap; no local registry fallback |
| invocation/admission | `ToolInvocationStore` | immutable invocation and admission read/write | Submit/Precondition flows | invocation identity + immutable anchor | no-execution unavailable/rejected surface |
| execution handoff | `ExecutionHandoffStore` | requirement, auth/readiness, handoff, attempt | precondition/handoff phase UoWs | attempt CAS; Prepared/unknown fence | blocked/unavailable/manual |
| outcome/audit | `OutcomeAuditStore` | source assessment + atomic outcome/audit pair | AcceptSource/no-execution | terminal invocation pair + append semantic key | consistency defect; no single-sided outcome |
| safe submission | `ExternalSubmissionStore` | eligibility/material/attempt/status refs | safe-material phase-1 and phase-2 | `(material,event,target)` + attempt CAS | local ineligible/route-blocked/unknown |
| projection/reference | `ProjectionStore` | gap/report/ref/projection with watermark | owning job slices only | source watermark monotonicity + page digest | stale/rebuilding/unavailable/failed |

`infra/reference_store.rs` may implement reference-related methods, but it must not define an eighth application Store trait. Every Store adapter must expose the same semantic uniqueness, expected-version, page cursor and body-free error behavior to durable and fake implementations.

### 7.2 UoW assembly and capability validation

`ToolsUnitOfWorkManager` is built once per runtime composition and is the only transaction authority for participating local stores. Builder validation must prove:

- the seven Store adapters that participate in one atomic family point to the same local transaction authority;
- `OutcomeAuditStore::insert_outcome_audit_pair` is indivisible at the logical contract level;
- commit candidate, receipt and `resolve_commit` support the Step 11/12 unknown semantics;
- Store adapters do not start hidden transactions, retries or compensating writes;
- `IdempotencyStore` and typed stored result/receipt/report storage can participate in the required local ordering;
- projection/reference writes cannot be used to satisfy a core truth write;
- an adapter lacking a required capability is rejected as `MissingUnitOfWorkCapability`, not silently downgraded.

### 7.3 Clock and ID binding

`ClockPort` and `IdGeneratorPort` are separate application technical ports. Builder must inject them independently. Domain factories receive explicit time/ID values or factory calls from application; they never read a config clock, database default, endpoint identity or wall-clock directly. A generated ID is never included in the canonical request digest (Step 13), and a clock adapter cannot generate semantic identity or external source revision.

### 7.4 Projection and idempotency binding

Projection configuration can select a projection adapter, freshness category, rebuild scope and bounded page. It cannot cause a Query to rebuild, use live truth fallback, or overwrite Contract/Binding/Invocation/Outcome/Audit. Idempotency configuration can select a sidecar adapter and retention category, but cannot alter namespace, digest inclusion/exclusion, duplicate replay, in-flight, Prepared, unknown or missing-result behavior. Retention must be rejected if it would expire a required replay surface before its obligation is discharged; exact duration belongs to 04.

## 8. `infra/config.rs` 与 `infra/runtime_builder.rs` 装配顺序

### 8.1 Loader / validator sequence

```text
ConfigSource::load
  -> parse candidate (no business body, no secret plaintext)
  -> attach ConfigSourceRef / redacted issue refs
  -> validate section-local typed values
  -> validate cross-section invariants and forbidden overrides
  -> validate store/UoW/idempotency capabilities
  -> validate adapter operation/version/authority/body policy
  -> validate enabled event/target/feature completeness
  -> produce ToolsRuntimeConfig or typed ToolsConfigValidationError
```

The loader does not call domain services, query external providers for truth, or resolve current Tool/Binding/Invocation state. A configuration source may select an adapter, but only an actual typed Port response can produce `PortResolution::Available`.

### 8.2 Runtime builder sequence

```text
ToolsRuntimeBuilder::from_validated_config
  -> build local Store adapter registry
  -> build one ToolsUnitOfWorkManager
  -> build IdempotencyStore and typed result/receipt/report sidecar
  -> build ClockPort and IdGeneratorPort separately
  -> build ReadVisibilityResolverPort
  -> build SharedContractAuthorityPort / Hub / Authorization adapters
  -> build SandboxExecutionPort / ExecutionSourceIntakePort adapters
  -> build SafeEventCollaborationPort and handoff target registry
  -> build domain/application services from owned traits
  -> build API command/query bundles
  -> build Worker consumer/continuation/projection bundles
  -> build Job runners with typed request/batch/watermark parameters
  -> run final facade and forbidden-boundary audit
  -> expose Ready runtime bundle
```

Builder rules:

1. No entry bundle is exposed before all required local Store/UoW/idempotency/clock/ID slots are valid.
2. Open external seams bind a full production blocked adapter, never a null, panic, silent no-op or test fake.
3. A disabled peripheral feature may omit its peripheral runner only when core command semantics remain unchanged and the disabled surface is explicit.
4. `api`/`worker`/`jobs` receive application facades only; they do not receive Store or external Port handles.
5. `domain` receives no `ToolsRuntimeConfig`, adapter registry, endpoint, target, secret or feature flag.
6. Final validation checks that event key bindings are total for every enabled OF branch and that target refs do not imply route/delivery.

### 8.3 Entry-local binding

Entry arguments may select config source/profile and supply one complete typed protocol envelope. They must not define alternate `run_id`, actor, scope, target, idempotency key, trace ID, schema version or cursor fields already owned by `CommandMetadata`, `QueryMetadata`, `InboundEventEnvelope` or `JobMetadata`. Flag/environment conflict is a validation error; precedence and names are 04 concerns.

## 9. 13/11/5/4/4 protocol family binding

| Family | Config read at | Injected surface | Config may control | Config may not control |
|---|---|---|---|---|
| 13 Commands | API/application composition | command boundary, Stores, UoW, idempotency, Clock/ID, applicable external Ports | input bounds, adapter selection, timeout/retry category | command metadata requirement, owner, identity, state transition, fail-closed, outcome/audit pair |
| 11 Queries | API/application composition | visibility resolver, Store/Projection read adapters, page/freshness policy | page/read category, projection selector | Query write/rebuild, visibility bypass, live fallback, external body |
| 5 Consumers | Worker composition | envelope validator, idempotency, applicable source/collaboration Port, Stores | source adapter selection, dedup category, bounded page | source authority, receipt semantics, direct core write, body acceptance |
| 4 Outbound continuations | Worker/application composition | submission Store, collaboration Port, target registry, idempotency | enabled event branch, target set, retry category | event semantic payload, material gates, delivered/observed truth, second call after Prepared/unknown |
| 4 Jobs | Jobs composition | job boundary, idempotency, Projection/Store, conditional source Port | batch/parallelism/timeout/retry category, scope selector | job truth repair, run identity fabrication, cursor semantics, evidence/readiness |

## 10. 七个 external Port 的 adapter/config seam

### 10.1 Shared rules

All external adapter implementations are application-trait implementations in `infra`; they perform one logical call, validate authority/correlation/schema/body policy, and map only typed outcomes. `PortResolution::{Available,Unavailable,Blocked,Unsupported,Conflicting,Unverifiable}` is reserved for expected semantic resolution; `PortCallError` represents adapter/protocol failure. A configured endpoint or adapter health marker never upgrades a blocked seam to available.

### 10.2 Port binding table

| Port | Adapter file (planned) | Config inputs | Positive precondition | Current production binding | Test fallback | Forbidden responsibility |
|---|---|---|---|---|---|---|
| `SharedContractAuthorityPort` | `infra/source_resolvers.rs` | Core authority candidate, family, expected revision, adapter ref | Tools-specific schema/package/revision verified by Core | `CandidateOnly`/`Blocked` under `L2T-UP-008` | fake candidate/resolved/conflict for local branch tests | copying Core schema, inventing package/type, changing local owner |
| `HubControlledSourcePort` | `infra/source_resolvers.rs` | Hub adapter ref, capability candidate, source revision/profile, timeout category | formal Hub authority, ref, revision and safe summary symmetry | blocked/unavailable-aware until source contract closes | fake snapshot/clue resolution; no registry readiness claim | local registry, name lookup, relation mutation, authorization |
| `InvocationCallerPort` | `application/invocation_service.rs` (application implementation) | caller profile, safe boundary category, visibility/context adapter refs | one canonical `SubmitToolInvocationRequest` mapping | logical server seam; SDK client absent under `L2T-UP-009` | direct application facade fake | caller-specific semantic fork, runtime loop/planning, raw prompt/body |
| `AuthorizationConsumptionPort` | `infra/source_resolvers.rs` | owner/source adapter ref, result selector, contract revision, timeout category | formal owner/source/schema/freshness | `Blocked(AuthorizationContractOpen)` under `L2T-UP-001~002` | typed allow/constrained/deny only in isolated fake tests | policy evaluation, self-authorization, default allow |
| `SandboxExecutionPort` | `infra/source_resolvers.rs` | Sandbox adapter ref, carrier/mapping profile, handoff target, timeout/retry category | formal mapping and receipt boundary | `Blocked` under `L2T-UP-003~004`; no host fallback | fake readiness/local disposition/unknown | isolation truth, run lifecycle, receipt, cleanup, capture body |
| `ExecutionSourceIntakePort` | `infra/source_resolvers.rs` | source adapter ref, source/mapping revision, envelope validator | formal source authority/correlation/mapping | `Blocked` under `L2T-UP-003~004` | fake source mapping/blocked/conflict | direct outcome inference, raw capture, external delivery truth |
| `SafeEventCollaborationPort` | `infra/publishers.rs` | publisher adapter ref, event key binding, target ref, route contract candidate, timeout/retry category | Bus/Obs producer/source/route contract closed | route/source `Blocked` under `L2T-UP-004~006` | fake submitted/rejected/route-blocked/status refs | delivery/retry/DLQ/observation store, local outcome rollback |

### 10.3 Port-specific call and retry fence

| Port operation class | Call phase | Retry category allowed | Unknown handling | Degraded surface |
|---|---|---|---|---|
| compile/runtime observational resolver | before local UoW | bounded policy may classify retryable adapter failure | no local truth until resolution known | unavailable/blocked/unverifiable assessment |
| Sandbox handoff side effect | after committed Prepared marker | no generic retry; only named recovery | `SideEffectOutcomeUnknown`, manual owner | handoff attempt unknown; no accepted/run claim |
| source intake | before local outcome UoW | redelivery/idempotency at Consumer layer, not blind Port repeat | source mapping unknown/gap | no normalized outcome |
| safe event submit | after committed material/attempt marker | no repeat from Prepared/unknown | `SubmissionOutcomeUnknown`, manual owner | local attempt unknown/route blocked |
| Bus/Observation status resolve | observational or inbound validation | category-specific bounded retry may be configured | independent status remains unknown | status ref unavailable/stale/gap |
| visibility resolver | before Query view construction | query retry category only if no write/side effect | visibility unavailable | Query unavailable/not visible |

## 11. 依赖分类与跨仓核验

### 11.1 分类规则

| 依赖类别 | L2 表达 | 可否进入 Cargo | 真相/副作用边界 |
|---|---|---:|---|
| compile-time | `core-contracts` only, exact type reuse | 允许（仅 candidate，逐 type 验证） | Core is shared contract authority; Tools schema missing remains blocked |
| runtime | application-owned resolver/caller/execution Port + adapter | 禁止 sibling Cargo | provider result is consumed/reflected, not owned |
| event collaboration | semantic event envelope + publisher/feedback Port + local attempt/status refs | 禁止 sibling Cargo | delivery/observed remains external |
| handoff/export | target refs + adapter registry + one-call fence | 禁止 sibling Cargo | local material/attempt first; external acceptance not inferred |
| downstream client | public protocol/guidance only | 禁止反向依赖 | SDK client is future consumer, not server dependency |

### 11.2 当前 workspace 路径核验

| 路径 / owner | 当前 filesystem observation | 设计状态 | 处理 |
|---|---|---|---|
| `/home/aris/Projects/quantalithos-core/crates/contracts` | present | compile candidate | 可记录 planned `core-contracts = { path = "../quantalithos-core/crates/contracts" }`；不得宣称 L2 manifest/build 已存在。 |
| `/home/aris/Projects/quantalithos-tools` | absent | planned target | 不扫描源码、不声称 Cargo/build/test/branch。 |
| `/home/aris/Projects/quantalithos-bus` | present | event owner input only | 不进 Cargo；仍需 Tools-specific producer/route 合同，`L2T-UP-005~006` 不关闭。 |
| `/home/aris/Projects/quantalithos-sdk` | present | future consumer input only | 不进 Cargo，不声称 tools client、coverage 或联调。 |
| `/home/aris/Projects/quantalithos-capability-hub` | absent in current workspace | runtime seam blocked | 使用 blocked adapter/fake，不能用 local registry。 |
| `/home/aris/Projects/quantalithos-sandbox` | absent in current workspace | runtime seam blocked | `L2T-UP-003~004` 保留；不能用 host/direct fallback。 |
| `/home/aris/Projects/quantalithos-runtime` | absent in current workspace | caller/runtime consumer seam | 只保留 canonical inbound contract，不反向依赖。 |
| `/home/aris/Projects/quantalithos-observability` | absent in current workspace | event/handoff seam blocked | 不伪造 producer/source/route/observed readiness。 |

Filesystem presence is an input fact only; it does not prove formal authority, semantic compatibility, frozen baseline, provider availability or implementation readiness. `L2T-UP-007` remains open because the workspace is not a frozen commit baseline.

### 11.3 Core dependency candidate

Planned workspace root may contain the following candidate only after target repository creation and exact type audit:

```toml
[workspace.dependencies]
core-contracts = { path = "../quantalithos-core/crates/contracts" }
```

Member manifests may use `core-contracts.workspace = true` only for types verified by Step 6/implementation preflight. No local alias or copied Tools-specific type may be presented as Core authority. Private git tag/rev is a later release decision, not a current fact.

## 12. Durable / fake / blocked adapter fallback matrix

| Dependency surface | Durable implementation requirement | Fake/fixture allowance | Open-contract production behavior | Invalid fallback |
|---|---|---|---|---|
| seven local Stores + UoW | one authority, CAS/unique/page/pair atomicity, typed errors | deterministic in-memory fake for contract/domain/application tests | startup composition rejected if required capability absent | cache/file/temp store presented as formal truth |
| IdempotencyStore | atomic claim + typed result/receipt/report replay | same atomic winner model and scripted unknown | no mutation if sidecar unavailable | rerun flow or current-truth reconstruction |
| Clock/ID | typed monotonic/unique contract as required by adapter, explicit failures | deterministic sequence/time | entry unavailable before mutation if missing | domain-generated ID or DB implicit timestamp |
| Visibility resolver | actor/scope result with no policy ownership | scripted visible/not-visible/unavailable | query unavailable or not visible | default allow / scope bypass |
| Core authority | exact package/type/revision compatibility | candidate-only and blocked/resolved branch fixtures | `CandidateOnly`/`Blocked` under `L2T-UP-008` | copy/invent Tools schema |
| Hub/Auth/Sandbox/source | formal authority, revision, correlation, body-free mapping | typed branch fake only | blocked/unavailable/gap/fail-closed | local registry, default allow, host execution |
| Collaboration publisher/status | semantic event identity, target/route contract, one-call fence | submitted/rejected/unknown/status fake | route-blocked/local degradation; local truth unchanged | call twice, claim delivered/observed |
| Projection/report | watermark monotonicity, stale/rebuild/read surface | deterministic stale/rebuilding/failure fake | query degraded; job report failed/partial | live fallback or source repair |
| SDK | public server contract consumer only | contract mapper fixture | no client binding in L2 | SDK package as server Cargo dependency |

Fakes must expose the same public error and resolution variants as durable adapters. They may seed explicitly invalid historical fixtures only in integrity/recovery tests, labeled as invalid fixture; no fake helper may make an impossible state a supported production transition.

## 13. Timeout、retry、degraded surface 类别

本 Step 只确定类别和读取位置，不填具体数字。类别不能覆盖 Step 12/13 的 unknown/manual fence。

### 13.1 Timeout categories

| Category | Applies to | Mapping |
|---|---|---|
| `NoExternalCall` | pure domain, local validation, Query mapper | no timeout and no retry |
| `LocalStore` | Store/UoW/sidecar | `RepositoryError::Unavailable` or `UnitOfWorkError`; no partial write |
| `ObservationalPort` | Core/Hub/Auth readiness/status/visibility read | `PortCallError::Timeout` -> unavailable/blocked assessment |
| `SideEffectPort` | Sandbox handoff / safe event submit | timeout with call proof -> local failure; ambiguity -> side-effect unknown |
| `JobSlice` | bounded Job item/runner | item retry category or partial report; does not repair truth |

### 13.2 Retry categories

| Category | Eligible cases | Ineligible cases |
|---|---|---|
| `None` | deterministic validation, conflict, forbidden body, terminal state | all deterministic rejection |
| `SameInputBounded` | explicitly retryable observational read or transport redelivery with same scope/key/digest | changed digest/key, semantic conflict |
| `ClaimContinuation` | named durable phase continuation with same claim/lease/phase | stealing/renewing ambiguous claim |
| `ManualResolution` | commit unknown, Prepared side-effect, side-effect/submission unknown | automatic worker retry |
| `JobItemRetry` | bounded item failure where Step 12 marks retryable | whole-job truth repair or scope expansion |

### 13.3 Degraded surface categories

| Surface | Public/local meaning | What it never means |
|---|---|---|
| `Blocked` | formal owner/contract/mapping/route not closed | provider failure or success |
| `Unavailable` | dependency cannot answer now | allow, accepted, delivered or observed |
| `Stale` | persisted view/ref older than requested watermark | current truth or automatic refresh |
| `Rebuilding` | projection/job maintenance in progress | query permission to write |
| `GapRecorded` | attributable missing/conflicting material tracked | repaired truth or evidence/signoff |
| `Unknown` | outcome/call/status cannot be proven | failure, success or retry permission |
| `Partial` | bounded Job has mixed item dispositions | all items succeeded or core truth repaired |

## 14. 25 条不可配置化红线

| ID | 不可配置化边界 | 原因 | 违规处理 |
|---|---|---|---|
| `NC-L2T-001` | L2-tools 对 Tool identity、definition、canonical invocation、semantic outcome、ToolAuditEntry 的 truth ownership | profile 不能产生第二套工具合同 | validator reject，必要时回到 00/01 |
| `NC-L2T-002` | Core compile、Hub/Runtime/Sandbox runtime、Bus/Observability event collaboration 的依赖裁剪 | 配置不能新增 sibling package 或第四依赖类型 | dependency gate reject |
| `NC-L2T-003` | Stable `ToolId`、definition identity、revision identity 的生成规则 | endpoint、文件名、provider identity 不能成为本地 truth | config reject；使用 domain factory |
| `NC-L2T-004` | current definition 只能由 formal establish/assess/adopt/retire flow 变化 | feature/adapter availability 不能切 pointer | config reject；走 owning Command |
| `NC-L2T-005` | Binding 的 active/explicit-unbound/history 语义 | 缺 config 不等于 unbound | config reject；保留 relation/gap |
| `NC-L2T-006` | Hub visibility/inventory 不得当 authorization | exposure 不是 effective decision | fail closed；不设 allow fallback |
| `NC-L2T-007` | caller/carrier 共用一个 canonical invocation/result/error 语义 | adapter profile 不能分叉协议 | schema validation reject |
| `NC-L2T-008` | raw prompt/request/capture/provider response/secret/external body 禁入任何本地 surface | 加密、debug、audit profile 都不能解除 forbidden-body | reject before adapter call |
| `NC-L2T-009` | admission 必须先于真实执行，rejected/unavailable 不翻为 accepted | 防止配置旁路安全门禁 | fail closed |
| `NC-L2T-010` | authorization 缺失/stale/conflict/unverifiable 必须 fail closed | default allow/local role/旧 allow 都不具 authority | blocked/rejected/no-execution |
| `NC-L2T-011` | requirement、authorization decision、Sandbox requirement 分权 | 工具风险声明不能变 effective decision | reject unsafe config |
| `NC-L2T-012` | Sandbox-required 不得 host/direct bypass | adapter disabled/timeout 不能取消 isolation | blocked/no-execution |
| `NC-L2T-013` | local handoff/attempt 不等于 external accepted/run/receipt | endpoint 可达不拥有外部 lifecycle | preserve local attempt only |
| `NC-L2T-014` | source 必须经过 authority/correlation/mapping assessment 才能 normalized outcome | mapping profile 不能把 unknown/raw 变 success | gap/unverifiable |
| `NC-L2T-015` | 每个 invocation 只有一个 immutable terminal outcome | 迟到材料/观测不能覆盖历史 | append assessment/gap only |
| `NC-L2T-016` | Outcome 与 ToolAuditEntry 在同一 L2 boundary 原子收口 | audit disabled/best-effort 破坏追溯 | UoW capability reject |
| `NC-L2T-017` | safe handoff 四项合取：minimal、body-free、redacted、correlated | 配置只能收紧，不能关闭条件 | material ineligible |
| `NC-L2T-018` | local outcome/audit first；submission/delivery/observation 不参与终态 | 禁止跨 owner 强一致事务 | local truth first |
| `NC-L2T-019` | Bus delivery 与 Observation status 分离 | 一方不能替代另一方 | separate refs/gap |
| `NC-L2T-020` | Query no-write、Consumer clue no-core-write、Job no-subject-repair |外围自动修复不能夺取写权 | route/runner reject |
| `NC-L2T-021` | gap resolution 先由 subject owner 提供 formal repair，再由 L2 验证 | 不能 auto-resolve 或伪造 evidence | remain pending/gap |
| `NC-L2T-022` | projection/report stale/unavailable 不得替代 core truth | old cache/external body 不是 current | explicit degraded read |
| `NC-L2T-023` | 状态词表、合法迁移、append-only/immutable 纪律 | 环境改变会破坏历史解释 | domain invariant reject |
| `NC-L2T-024` | logical/candidate/pending/blocked/fake 不等于 implementation ready | 配置与 skeleton 不是 provider/schema/route 证据 | readiness claim forbidden |
| `NC-L2T-025` | Runtime planning/orchestration/retry/recovery、Sandbox recovery、Bus retry/DLQ/replay 不归 L2 | 配置不能吸收相邻 owner 主线 | scope gate reject |

配置可以收紧边界、禁用外围能力、降低可用性或使某个 flow 显式 blocked；不能放宽以上任何红线。任何试图通过 profile、feature flag、emergency mode、debug mode、adapter override 或 fallback policy 绕过红线的实现都必须在 validator 阶段拒绝。

## 15. 配置失败与跨边界影响矩阵

| 失败位置 | 允许 surface | 必须保持不变 | 禁止伪装 |
|---|---|---|---|
| loader/parser | runtime composition blocked / invalid config | no unvalidated default | service ready |
| cross-section validator | typed config error with section ref | domain semantics untouched | silently choose one conflicting value |
| Store/UoW capability | affected owning flow unavailable | no half-state | memory/cache truth |
| Idempotency sidecar | no mutation or replay defect surface | same key/digest required | rerun/current truth reconstruction |
| Core/Hub/Auth adapter | candidate/blocked/unavailable/gap | no local authority substitution | default allow/registry fallback |
| Sandbox/source adapter | blocked/no-execution/unknown | no host bypass/outcome inference | accepted/receipt/run claim |
| collaboration adapter | route-blocked/local failure/unknown attempt | outcome/audit unchanged | delivered/observed claim |
| visibility adapter | query not-visible/unavailable | no scope bypass | default visible |
| projection adapter | stale/rebuilding/unavailable/failed | no truth repair | live fallback |
| job runner config | delayed/partial/failed report | bounded scope and cursor | job repairs subject or fabricates run/evidence |

## 16. 前序回填与 cross-step closure audit

### 16.1 正式章节回填草稿

Step 19 正式 `03-详细设计.md` §13 只吸收以下结论：

```text
L2-tools 配置由 infra/config.rs 读取并校验，由 infra/runtime_builder.rs 转换为
ToolsRuntimeConfig。contracts/domain 不读配置，application 只接收 application-owned
Store/UoW/technical/external Port 和 typed boundary parameter。七个 logical Store、
ToolsUnitOfWorkManager、IdempotencyStore、ClockPort、IdGeneratorPort、ProjectionStore
必须在同一 validated composition 中装配；缺少 CAS、semantic unique、outcome/audit
pair-atomic、stored replay 或 UoW capability 时拒绝启动受影响 flow。

唯一 compile-time dependency candidate 是可实际检索到的 core-contracts path；Hub、Auth、
Sandbox、Runtime、Bus、Observability 通过 Port/resolver/event/handoff/fake 表达，SDK 是
future consumer。开放合同绑定显式 blocked adapter，测试才可使用 deterministic fake；
configured endpoint/fake success 不等于 authority、mapping、route、readiness 或 external
delivery。timeout/retry 只使用 typed category，Prepared、commit/call unknown 不盲重试。
配置不能改变 owner、canonical identity、fail-closed、Sandbox requirement、forbidden-body、
local-truth-first、immutable history、external-status separation、Query no-write 或任何
NC-L2T-001~025 红线。
```

### 16.2 前序闭环审计

| 前序 Step | 审计结论 | 是否回填 |
|---|---|---|
| Step 3 constraints | Core-only compile、runtime/event/handoff 分类和 backend-neutral 纪律一致 | 不需要 |
| Step 4 file layout | `infra/config.rs`、`infra/runtime_builder.rs`、`source_resolvers.rs`、`publishers.rs`、`clock_id.rs` 文件职责可承接 | 不需要 |
| Step 5 modules | 配置 owner 在 infra；application/domain ownership 未漂移 | 不需要 |
| Step 6 objects | 未新增业务 object；candidate/validated config 是 infra technical carrier | 不需要 |
| Step 7 ports | 七个 external Port 一一绑定；未新增 Port、provider 或 route | 不需要 |
| Step 8 protocols | 13/11/5/4/4 的 metadata、event key、job envelope 有唯一读取/注入点 | 不需要 |
| Step 9 flows | 每个 side effect、resolver、Store、Job 的 config 读取和 phase fence 可回指 | 不需要 |
| Step 10 states | 配置只能影响 availability/degraded surface，不改变状态集合/迁移 | 不需要 |
| Step 11 persistence | Store/UoW/sidecar/pair atomicity/cursor/watermark capability 有启动校验 | 不需要 |
| Step 12 error/recovery | timeout/retry/degraded categories 维持 typed mapping、unknown/manual/no-blind-retry | 不需要 |
| Step 13 concurrency | key/digest/retention、Prepared/unknown、Job cursor 与 config binding 不冲突 | 不需要 |
| Historical audit | README/旧 03 产品和 registry/executor 语义未回流 | 不需要 |

### 16.3 Step 14 closure checks

| 检查项 | 结果 | 证据 |
|---|---|---|
| 配置读取模块唯一且 domain/contracts 不读配置 | pass | §§4, 6, 8 |
| typed candidate -> validated runtime surface 可落码 | pass | §4 |
| seven Store + UoW + clock/ID + projection/idempotency 绑定完整 | pass | §7 |
| 13/11/5/4/4 protocol family 有入口绑定 | pass | §9 |
| 七个 external Port 各有 adapter/config/fallback seam | pass | §10, §12 |
| compile/runtime/event/handoff/downstream 分类正确 | pass | §11 |
| Core path candidate 实况与目标仓 absent 事实分离 | pass | §11.2~11.3 |
| durable/fake/blocked fallback 不伪造 readiness | pass | §12 |
| timeout/retry/degraded 无具体数值伪造且保留 unknown fence | pass | §13 |
| 25 条不可配置化红线完整 | pass | §14 |
| L2T-UP-001~009 未被配置或 fake 关闭 | pass | §§10~12, 16.2 |
| 正式 03 未写入 | pass | Step 19 前 write-closed |

## 17. 待确认事项与持续 blocker

| ID | Owner | 当前状态 | 本 Step 可否自行解决 | 影响 |
|---|---|---|---|---|
| `L2T-UP-001` | Authorization owner | open | 否 | positive authorization provider/source/result |
| `L2T-UP-002` | Authorization taxonomy/source owner | open | 否 | high-risk/source matrix and positive allow/deny |
| `L2T-UP-003` | Sandbox owner | open | 否 | invocation-to-generic execution/source mapping |
| `L2T-UP-004` | Sandbox/Bus handoff owners | open | 否 | receipt/feedback/cleanup/route |
| `L2T-UP-005` | Observability producer/source owner | open | 否 | safe material producer/source family |
| `L2T-UP-006` | Observability workspace/formal-chain owner | open | 否 | route/readiness/evidence declaration |
| `L2T-UP-007` | workspace/release owner | open | 否 | frozen baseline and implementation attribution |
| `L2T-UP-008` | Core owner | open | 否 | Tools-specific shared schema/package/revision |
| `L2T-UP-009` | SDK owner | open | 否 | tools-specific client and compatibility seam |

These blockers do not prevent local negative, blocked, assessment, replay, query-no-write, projection and deterministic fake design. They block positive provider/mapping/route/receipt/observation/SDK/readiness claims. No new blocker was discovered in Step 14.

Step 14-specific open decisions for later documents:

| Item | Later owner | Boundary |
|---|---|---|
| config file/ENV/profile syntax and precedence | `04-配置设计.md` | no new authority or duplicate metadata |
| concrete timeout/retry/retention/batch values | `04` / operations | preserve category and unknown/manual rules |
| durable backend and migration | implementation/07 | preserve logical Store/UoW contract |
| physical topic/route/secret binding | `04` + upstream event owner | semantic event key/schema cannot change |
| deployment readiness/evidence | `05~07` and upstream owners | fake or current workspace input is not evidence |

## 18. Stop review and Step 15 handoff

| Check | Result |
|---|---|
| config candidate, validated surface and error type | pass |
| config section -> code/module/typed injection | pass |
| seven Store/UoW/clock/ID/projection/idempotency binding | pass |
| builder and entry assembly order | pass |
| seven external Port adapter/config seams | pass |
| dependency classification and filesystem fact audit | pass |
| durable/fake/blocked fallback parity | pass |
| timeout/retry/degraded category mapping | pass |
| 25 non-configurable redlines | pass |
| historical material / blocker audit | pass; `L2T-UP-001~009` remain open |
| formal document write | closed until Step 19 |

```text
step_status = completed / pass
current_module = config_external_binding:typed_candidates_and_builder_seams
gate_status = pass
gate_reason = typed config candidate, infra-only validated runtime surface, seven Store/UoW/technical bindings, seven blocked-aware external Port seams, dependency classification, fallback and 25 non-configurable boundaries are closed without inventing provider/schema/route/readiness
next_allowed_action = create 03_ddd_step_15_observability_audit.md
formal_document_write_allowed = false
next_formal_document_allowed = false
commit_required = false
```
