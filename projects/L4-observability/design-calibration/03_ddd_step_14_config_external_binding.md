# L4-observability 03-详细设计 Step 14 · 配置引用与外部依赖绑定

> 本文件是 `03-详细设计.md` 的 Step 14 讨论中间产物。
> 本轮采用 `full-restart`，旧同名文件仅作为 historical material 诊断输入，不承接旧结论。
> 正式 `03-详细设计.md` 只能在 Step 19 装配，本 Step 不修改正式文档。

## 1. Step 状态

| 项 | 当前值 |
|---|---|
| 当前正式文档 | `03-详细设计.md` |
| 当前 Step | Step 14 配置引用与外部依赖绑定 |
| 当前模式 | `full-restart` |
| 用户确认 | 已收到用户“继续”，允许从 Step 13 进入 Step 14 |
| 写入状态 | `completed_design_record_with_affected_open` |
| 自检状态 | `pass_with_affected_open` |
| gate_status | `pass_with_affected_open` |
| gate_reason | typed config、validated binding、snapshot/intent/token传播、runtime assembly与60协议覆盖均已形成可落码记录；inherited affected仍开放，不能视为已被`04`消费 |
| blocker | 未发现新的上游 blocker；inherited upstream/internal affected 继续登记 |
| next_allowed_action | `continue_M2_step_15;stop_after_step_15_before_step_16` |
| downstream targeted repair | R1 `CFG-BLK-07-01` repaired on 2026-07-14；R2 `CFG-BLK-09-01` repaired on 2026-07-15，raw transport/actor-policy/schedule binding保持infra-only，worker/jobs slice改为locator-free metadata并增加prebuilt registrar；不新增raw key/default/source、business protocol或builder stage |

本文件中的 `pass` 只表示设计中间产物通过静态闭环审查，不表示实现已完成、配置已部署、adapter 已连通、测试已执行或验收已签署。

## 2. 本步目标与非目标

### 2.1 目标

1. 明确 `contracts`、`domain`、`application`、`infra`、`api`、`worker`、`jobs` 中谁可以读取哪一层配置。
2. 把概要设计中的配置影响轮廓收敛为 typed config section、代码读取位置、注入对象、默认语义和失败口径。
3. 把 Step 07 的 repository、resolver、publisher、handoff、export、clock、id、UoW 和 availability port 绑定到 product-neutral adapter。
4. 承接 Step 13 留下的 digest profile、reservation retention、claim lease、heartbeat、retry、backoff、jitter、exhaustion、batch 和 probe capability 配置点，同时保持并发与重入 invariant 不可配置关闭。
5. 区分编译期 Rust dependency、运行期 dependency、事件协作、handoff / export 和 fake / controlled seam。
6. 给出 runtime composition root 的可落码装配顺序、validation boundary 和 disabled / degraded / unavailable 行为。

### 2.2 非目标

- 不写配置文件格式、完整 key 命名、环境变量名、secret provider、endpoint、topic、bucket、path 或产品参数。
- 不在本 Step 决定所有 duration、limit、retention days、cron、parallelism 和容量的最终数值；数值范围与环境 profile 由重建后的 `04-配置设计.md` 收口。
- 不新增 public Command / Query / Event / Job DTO，不改变 Step 08 protocol surface。
- 不改变 Step 10 状态机、Step 11 transaction order、Step 12 recovery class 或 Step 13 idempotency / fencing / external token 语义。
- 不选定 OTel、Prometheus、Grafana、TimescaleDB、数据库、broker、object store、search、alert 或 GRC 产品。
- 不实现代码，不修改 Cargo 文件，不创建实现仓，不伪造 commit、真实 `run_id`、真实 evidence alias、测试结果、验收签署或 final verdict。
- 不进入 Step 15 日志、指标、trace 和审计埋点设计。

## 3. 输入材料与采用方式

| 输入 | 采用方式 |
|---|---|
| `standards/document/详细设计讨论流程_SOP.md` Step 14 | 约束问题、产物、回填、cross-repo dependency 和进入下一步条件 |
| `standards/document/详细设计书写规范.md` 5.13 | 约束正式章节必须有配置引用表、外部依赖绑定表和跨仓 Rust 依赖表 |
| 正式 `01-架构设计.md` §5 / §7 / §8 / §11 / §13 | 承接系统边界、运行单元、依赖裁剪、产品中立和 fail-closed 架构口径 |
| 正式 `02-概要设计.md` §4 / §5 / §10 / §11 / §12 | 承接七模块骨架、异常轮廓、配置影响轮廓和详细设计承接项 |
| Step 03 / Step 04 | 承接唯一 compile-time sibling dependency、本地 path 写法、实现单元与 config / runtime builder 文件位置 |
| Step 05 | 承接模块依赖方向和 `infra + application -> entry` 的 config / external binding 接缝 |
| Step 06 | 承接 product-neutral `AdapterFamily` 使用点、availability carrier、entry / job stable carrier |
| Step 07 | 承接全部 application-owned port 名称、调用方向、fake / durable parity 和 external result schema |
| Step 08 / Step 09 | 承接 protocol 到 entry / service flow 的参数来源，避免 config 私自改变 DTO 或函数流 |
| Step 10 / Step 11 / Step 12 | 承接状态、持久化、事务、错误分类、commit unknown 和 dependency recovery |
| Step 13 | 承接 canonical digest、reservation、claim / fence、retry、outbox、external intent / probe 的配置后移项 |
| L1-governance / L1-artifact / L1-identity Step 14 | 仅参考配置表、builder、disabled / degraded 和停审粒度，不复制业务 truth |
| 旧 Step 14 | 仅用于 historical diagnosis；旧对象、旧接口、旧自动门禁均不沿用 |

### 3.1 真相源优先级

```text
当前正式 00 / 01 / 02
  -> 当前轮 03 Step 01~13
  -> Step 14 当前重建结论
  -> 旧正式 03 / 旧 Step 14 / README 只作 historical material
```

若 Step 14 发现配置需求必须改变业务 truth owner、public protocol、状态机或 transaction order，必须回退对应上游 Step，而不是用 runtime flag 覆盖冲突。本轮未发现需要回退上游正式文档的 blocker。

## 4. 分批写入计划

| 批次 | 内容 | 状态 | 停审检查 |
|---|---|---|---|
| `14.0` | 状态、输入、SOP 回答、historical diagnosis、原则 | done | 范围不扩展到完整配置手册 |
| `14.1` | 配置 ownership、读取边界、类型骨架、禁止配置化清单 | done | raw config / secret 不越过 infra |
| `14.2` | 逐 section 配置引用表、默认语义、使用点 | done | 所有配置都有 owner、consumer、缺失行为 |
| `14.3` | 外部依赖、adapter mode、timeout / retry / degraded、capability binding | done | 每个 external port 都有 binding 和 failure surface |
| `14.4` | cross-repo 分类、runtime builder、entry / job binding | done | compile-time 与 runtime / event dependency 不混淆 |
| `14.5` | 前序回填、后续承接、回填草稿、自检、门禁 | done | 不修改正式 `03`，完成后等待用户确认 |

## 5. SOP 问题回答

### 5.1 哪些模块需要读取配置?

只有 `infra::config`、`infra::runtime_builder` 和三个 entry composition root 可以读取经过分层限制的配置：

- `infra::config` 读取 raw sources，负责 parse、type、range、cross-field、redline 和 sensitive-ref validation。
- `infra::runtime_builder` 只接收 validated config，构造 repository、UoW、clock、id generator、resolver、publisher、delivery/entry technical adapter、availability probe、application façade、existing context factory和two prebuilt registrars。
- `api` composition root 只接收 validated API entry slice、assigned façade与context factory；handler 不读 env / file。
- `worker` composition root 只接收 locator-free consumer / loop slice、assigned façade/context factory与inbound registrar；consumer 和 loop body不读 env / file，不查transport/policy locator。
- `jobs` composition root 只接收 locator-free dispatch/schedule slice、assigned façade/context factory与schedule registrar。Application Job start flow使用builder注入的safe execution parameters与binding catalog，把单次request相关配置冻结进immutable plan；entry与runner body都不读取target catalog、schedule locator或动态配置，也不补造Job request。

`contracts`、`domain`、application service、repository trait、resolver trait 和 protocol DTO 都不得读取 raw config。Domain 只接收已验证的 policy input、safe summary、scope、limit result 或 formal capability outcome，不知道 profile、endpoint、adapter mode、retry schedule 或 secret ref。

### 5.2 配置项的类型、默认值和读取位置是什么?

本 Step 在 §9~§12 定义 typed section 和配置引用表。默认语义分三类：

1. **固定 invariant**：body-free、redaction-first、Query no-write、Job no-source-repair、stable token、probe fail-closed 等没有可关闭默认值。
2. **安全代码基线**：缺少部署覆盖时可使用 bounded、non-zero、fail-closed 的代码默认；具体数值由 `04-配置设计.md` 写成唯一真相源并由 Step 16 验证。
3. **无默认必须显式绑定**：durable store、external endpoint / route / target、secret ref、real adapter mode、external capability declaration 缺失时 fail startup、disabled 或 unavailable，不得静默换 fake。

### 5.3 哪些外部依赖需要通过 adapter 注入?

Step 07 的全部 external / technical port 都通过 `infra` adapter 注入：

- repository / projection / idempotency / stored result / outbox / job execution / UoW；
- `ObservationSourceSummaryResolver`；
- `RuntimeSandboxSummaryResolver`；
- `GovernanceArtifactEvidenceResolver`；
- `SubjectObservationResolver`；
- `ObservationEventPublisher`；
- `ReportHandoffDeliveryPort`；
- `PeripheralExportDeliveryPort`；
- `AdapterAvailabilityProbe`；
- `ClockPort` 与 `IdGeneratorPort`。

Entry 只获得 application façade，不直接获得上述 adapter 或 repository。

### 5.4 外部依赖的超时、重试和降级策略是什么?

- Timeout 是单次 adapter attempt 的上限，不证明 external side effect 未发生；timeout after send 仍按 `Unknown` / probe 流程处理。
- Resolver 的 retry 只能由 Step 12 recovery class 和 Job / worker policy共同允许；Query 不 inline retry / repair / write。
- Publisher、handoff、export 重试必须复用 Step 13 stable token 与 exact stored material；`Unknown` / `Unsupported` 不得映射成未执行。
- Repository / UoW commit timeout 走 `CommitOutcomeUnknown`，不能按普通 retry 重新执行 mutation。
- Disabled / misconfigured / unavailable 必须形成 formal availability 或 typed error；不得静默使用 fake success。
- Retry exhaustion 只能把 outbox / item / report推进到现有 terminal classification，不改变业务 truth，也不执行 `Failed -> Pending`。

### 5.5 哪些配置细节留给 `04-配置设计.md`?

完整 key、文件格式、source precedence、env mapping、profile 名称、secret provider、endpoint、topic / route、target、duration 数值、limit 数值、retention days、cron、parallelism、jitter 算法参数、migration mode、hot reload、change audit 和 rollback 由 `04` 重建。Step 14 固定 code owner、typed shape、必填性、使用点、不变量和失败语义。

### 5.6 哪些跨仓 Rust 编译期依赖需要本地 path dependency?

只有 `quantalithos-core` 的 `core-contracts`：

```toml
[workspace.dependencies]
core-contracts = { path = "../quantalithos-core/crates/contracts" }
```

实际需要共享 actor、safe ref、metadata、page、error 或 event envelope 的 member 使用 `core-contracts.workspace = true`。当前不新增 `core-domain`、`core-application`、`core-infra`、`core-jobs` 或其他 sibling crate。

### 5.7 哪些运行期 / 事件依赖通过 adapter / event / projection / fake 表达?

Bus、Governance、Artifact、Identity、Runtime、Sandbox、Archive、SDK、Console、dashboard、alert、external audit / GRC 及所有产品候选，都只能通过 event envelope、outbox publisher、safe-summary resolver、reference snapshot、handoff / export adapter、public query projection 或 formal fake / controlled adapter表达，不能进入 Cargo dependency。

### 5.8 依赖仓不存在时如何处理?

- `quantalithos-core` 或真实 `core-contracts` path 不可用：暂停依赖真实类型的实现，不能复制一份 shadow contract。
- 目标实现仓 `quantalithos-observability` 不存在：不阻塞当前 design；Step 17 / `07-实施计划.md` 必须设 implementation precondition。
- 运行期 sibling repo 不存在：不阻塞本 Step；通过 Step 07 port + fake / controlled fixture 做 contract development，真实 integration boundary 标记 unavailable / pending。
- fake 只能在明确允许的 local / test profile 使用，并必须返回 formal result；不能默认 resolved / published / delivered。

## 6. Historical material 诊断与当前缺口

### 6.1 旧 Step 14 诊断

| 旧内容 | 问题 | 当前处理 |
|---|---|---|
| 全文仅 69 行 | 没有配置 ownership、typed section、读取点、默认语义、外部依赖表、builder、cross-repo 表或 failure strategy | 整份替换 |
| `RedactionPort::decide` | 当前 Step 07 没有该 port，redaction-first 是 domain/application guard，不是可插拔放行 adapter | 删除旧接口，改为不可关闭 redline + validated policy input |
| `MetricPoint::validate_labels` | `MetricPoint` 属于旧 schema-first historical material；当前对象为 `SafeSignal` 等 body-free truth | 删除旧对象引用 |
| `ReportWriterPort` | 容易把 report handoff 写成报告 truth / signoff 生成器；当前已拆为 repository + handoff / export delivery port | 改用 Step 07 精确 trait |
| “fake/controlled/durable/disabled adapter refs”一句话 | 未定义 profile 限制、failure surface、capability、timeout、retry 或 fake parity | 在 §13~§15 完整闭合 |
| “only L0-core compile dependency” | 未写真实 path、Cargo 位置、member 使用方式和不可用处理 | 在 §16 补完整 cross-repo 表 |
| `gate_status=pass` 且直接允许 Step 15 | 未经过本轮 full-restart，也违反逐 Step 用户确认纪律 | 当前完成后停在 `wait_user_confirmation_before_step_15` |

### 6.2 当前 Step 06~13 缺口

| 缺口 | 风险 | 本 Step 处理 |
|---|---|---|
| `AdapterFamily` 被 policy / port 使用但未给出 finite enum | 无法实现 availability probe 的稳定 key，也可能用产品名 / 字符串私补 | §8 定义 contracts-owned finite enum，并最小回填 Step 06 / 07 |
| `AdapterAvailabilityState` 在 Step 06 误写为 infra carrier | Step 07 application port 无法引用 infra type，违反依赖倒置 | 改为 application boundary carrier；infra 只构造返回值 |
| exact config key、section 和读取 owner 被后移 | 实现者会在 entry / domain 直接读 env 或把所有配置塞进一个 map | §9~§12 定义 validated shell 与 section |
| Step 13 后移 retention / lease / heartbeat / retry / batch 参数 | claim、outbox、Job resume 和 external call 无法落码 | §11 / §14 定义 typed parameter与不可绕过语义 |
| external adapter capability 未绑定 | `Unknown` / `Unsupported` 容易被错误当作 NotPublished / NotDelivered | §13 定义 capability declaration 与启动校验 |
| entry-local 和 runtime-global 参数未分离 | 重入可能读取新配置并改变 immutable plan | §12 固定 Job start snapshot 和 plan binding |

上述缺口都可在当前详细设计 Step 内闭合，不要求重写正式 `00/01/02`，因此不是上游 blocker。

## 7. 设计原则与红线

| 原则 | 实现约束 |
|---|---|
| Config is wiring, not truth | 配置只选择 adapter、bounded policy input、limit 和 schedule，不创建或修改业务 truth |
| Validate before assembly | raw config 必须先 parse / type / range / cross-field / redline validation，失败时不构造 application façade |
| Fail closed | 缺失安全 policy、capability、store、route 或 sensitive ref 时拒绝 / disabled / unavailable，不猜默认成功 |
| Product neutral | application / domain / contracts 不出现 provider SDK、endpoint、topic、bucket、product-specific health body |
| Stable execution snapshot | Job start 后影响候选集、retry、lease、batch、target 的配置 snapshot 绑定 immutable plan；resume 不热读新值 |
| No secret propagation | raw secret 只存在于 infra adapter memory boundary，不进入 typed application config、DTO、truth、report、log、metric、trace 或 evidence |
| Formal outcomes only | adapter mode / raw status / error string不能直接决定业务结果；必须映射为 Step 07 / 12 formal result / error |
| Fake parity | fake / controlled adapter 实现相同 port、unique、CAS、fence、probe 和 failure classification，不暴露 private map |
| No silent fallback | 缺少 real dependency 不得自动换 fake、in-memory store、default route 或 local filesystem success |
| No invariant switches | 不能配置关闭 body-free、redaction-first、actor、visibility、idempotency、no-write、retention protection、token / probe 或 transaction order |

## 8. 配置读取与类型 ownership 边界

### 8.1 模块读取矩阵

| 模块 | 可读取 | 注入方式 | 禁止读取 / 持有 |
|---|---|---|---|
| `contracts` | 无配置 | 不适用 | profile、adapter mode、endpoint、timeout、secret、store binding |
| `domain` | 无配置 | application 传入已验证 policy input / formal outcome | raw config、runtime profile、retry、adapter health、产品类型 |
| `application` | 无 raw config | constructor 注入 Step 07 ports；每次调用接收 typed operation context / validated policy input | env、file、secret、endpoint、topic、infra config struct |
| `infra::config` | raw code default / file / env / secret ref locator | parse 为 validated shell | 把 raw secret/body 写入 shell / issue / evidence |
| `infra::runtime_builder` | validated runtime config + infra-private resolved material | 构造 adapter、repository、façade、context factory、availability registry、safe slices与registrars | 修改 domain invariant、依赖entry crate、生成 business result |
| `api` composition root | validated API entry slice | route / handler catalog + application façade/context factory | repository、resolver、publisher、UoW、raw env |
| `worker` composition root | locator-free worker entry slice + inbound registrar | exact Consumer catalog + group registration + application façade/context factory | transport/policy locator、private registry、直接 adapter call、raw env、truth write bypass |
| `jobs` composition root | locator-free jobs slice + schedule registrar + current Job DTO | exact Job catalog + group registration + application façade/context factory | schedule locator、target catalog、raw config、snapshot/request assembly、resume时重读动态config、伪造scheduler / acceptance run id |

### 8.2 三层配置形态

```text
RawObservabilityConfig
  - infra-private deserialization shape
  - may contain source locations and sensitive references
  - never passed to application/domain/entry handlers
        |
        | parse + type + range + cross-field + redline validation
        v
ValidatedObservabilityConfig
  - immutable typed runtime assembly input
  - contains refs and bounded values,never raw secrets
        |
        +--> ApiEntryConfig / WorkerEntryConfig / JobsEntryConfig
        +--> repositories / UoW / clock / id / external adapters
        +--> adapter availability registry
        |
        v
JobExecutionConfigSnapshot
  - execution-local immutable subset persisted/bound with plan digest
  - never changes during resume/finalize
```

`RawObservabilityConfig` 是 infra-private serialization implementation detail，本 Step 不固定其 serde layout。`ValidatedObservabilityConfig` 和 section 类型是代码绑定契约；`04` 可以选择文件格式和 source precedence，但不得改变 ownership 或字段语义。

### 8.3 `AdapterFamily` 与 availability owner 回填

`AdapterFamily` 被 domain `AdapterBoundaryPolicy` 和 application `AdapterAvailabilityProbe` 共同引用，因此 owner 必须是低依赖层的 product-neutral shared type，而不是 `infra` 私有 enum。当前固定定义在 `contracts`：

```rust
/// Product-neutral adapter family used by boundary policies and runtime probes.
pub enum AdapterFamily {
    ObservationStore,
    ProjectionStore,
    IdempotencyStore,
    JobExecutionStore,
    ObservationSourceResolver,
    RuntimeSandboxResolver,
    GovernanceArtifactEvidenceResolver,
    SubjectObservationResolver,
    EventPublisher,
    ReportHandoffDelivery,
    PeripheralExportDelivery,
    Clock,
    IdGenerator,
}
```

| family | 绑定对象 | 业务 truth 边界 |
|---|---|---|
| `ObservationStore` | truth / marker / history / outbox repository + UoW | store 只持久化本仓 truth，不定义 truth |
| `ProjectionStore` | source index、projection、diagnostic、reference / progress store | projection 不替代 source truth |
| `IdempotencyStore` | reservation + stored result repositories | replay authority 是 durable result，不是 cache |
| `JobExecutionStore` | immutable plan、claim、fence、report repositories | lease / claim 不是业务 truth |
| 四个 resolver family | Step 07 safe-summary resolvers | 只返回 body-free formal resolution |
| `EventPublisher` | `ObservationEventPublisher` | Published 不等于 downstream consumed |
| `ReportHandoffDelivery` | `ReportHandoffDeliveryPort` | receipt 不等于 signoff / verdict |
| `PeripheralExportDelivery` | `PeripheralExportDeliveryPort` | external product 不成为 truth owner |
| `Clock` / `IdGenerator` | `ClockPort` / `IdGeneratorPort` | time / id 不可由 handler、repository或fake私造 |

`AdapterAvailabilityScope` / `AdapterAvailabilityState` / `AdapterAvailabilityKind` 是 application port boundary carrier；`infra` 负责构造，但不拥有其语义。`require_available` 返回 `ApplicationError::AdapterDisabled` 或对应 typed unavailable error，不能返回 `InfraError` 给 application：

```rust
/// Family-level or exact external-effect availability scope.
pub struct AdapterAvailabilityScope {
    pub adapter_family: AdapterFamily,
    pub effect_binding_ref: Option<ExternalEffectBindingRef>,
}

/// Product-neutral availability snapshot returned through an application port.
pub struct AdapterAvailabilityState {
    pub scope: AdapterAvailabilityScope,
    pub availability: AdapterAvailabilityKind,
    pub diagnostic_ref: Option<DiagnosticSummaryRef>,
}

/// Runtime availability classification without provider details.
pub enum AdapterAvailabilityKind {
    Available,
    Degraded,
    Unavailable,
    Misconfigured,
}
```

`None` binding只允许non-target adapter或family aggregate；publisher/handoff/export operation必须使用`Some(effect_binding_ref)`的exact scope。Family aggregate不能授权具体target调用。Availability snapshot不持久推进external lifecycle，不证明adapter call成功，也不授权domain transition。Query可以读取已有availability surface，但不得因probe写projection/reference/truth。

### 8.4 Config 类型归属

| 类型族 | owner / 文件 | visibility | consumer |
|---|---|---|---|
| `RawObservabilityConfig` | `observability-infra::config` | infra private | config loader only |
| `ValidatedObservabilityConfig` | `observability-infra::config` | infra public to composition roots | runtime builder |
| section configs | `observability-infra::config` | infra + entry composition root | specific adapter / builder stage |
| `AdapterFamily` | `observability-contracts` | cross-module shared | domain boundary policy + application probe |
| availability scope/state/kind | `observability-application::ports::runtime` | application boundary | infra implementation + entry surface；external effect支持exact binding scope |
| executable config parameters | `observability-application::runtime` | application / infra / jobs | config identity、bounded limit/duration、retry、claim lease、external capability |
| `JobExecutionConfigSnapshot` | `observability-application::jobs` | application / jobs | immutable plan builder / resume validator |
| raw credential / endpoint material | infra adapter private | adapter process memory only | concrete adapter constructor |

### 8.5 禁止配置化边界

| 禁止项 | 禁止形态 | 正确处理 |
|---|---|---|
| observation truth owner | `truth_owner = external` / provider mode改变owner | 修改需求 / 架构，不是改配置 |
| raw body admission | `allow_raw_body=true`、debug bypass | validator直接拒绝 |
| redaction-first | `redaction_enabled=false` | 无此开关；policy basis缺失则拒绝启动 / 请求 |
| body-free evidence | `store_evidence_body=true` | 无此字段；只允许 ref / digest / visibility |
| Query no-write | `query_refresh_on_miss=true` | 无此字段；返回 stale / unavailable / not-found surface |
| Consumer / Job source write | `repair_source=true` | 无此字段；记录 no-write violation / blocked report |
| retention hold / active protection | `force_release=true` | 必须走正式 Command、policy、version和state transition |
| gap semantics | `suppressed_means_resolved=true` | validator拒绝；Suppressed仍不是Resolved |
| handoff / export truth | `delivered_means_accepted=true` | receipt只表示transport / delivery fact |
| final evidence | 配置真实 run id、evidence alias、signoff、verdict | 设计和运行配置均不得伪造 |
| idempotency scope | 配置 operation / actor / key组成 | 由 Step 13 finite namespace 固定 |
| digest include / exclude | 热配置字段集合或算法 | 版本化代码契约；变更需 protocol / migration 决策 |
| claim fencing | `fencing=false`、token reset | 无此开关；durable monotonic token 必须成立 |
| external unknown | `unknown_as_not_sent=true` | `Unknown/Unsupported` fail closed / manual |
| failed outbox reopening | `reset_failed_to_pending=true` | selector直接读取 typed retryable Failed；无状态回退 |
| non-core Cargo dependency | config 动态启用 sibling crate | runtime adapter / event / fake，不进入 Cargo |

## 9. Typed configuration contract

### 9.1 Executable parameter and infra binding types

可被 application 执行、持久化或进入 plan digest 的 `ConfigBindingRef`、`ExternalEffectBindingRef`、`PositiveDurationMillis`、`PositiveLimit`、`RetryBackoffConfig`、`RetryPolicyConfig`、`ClaimLeaseConfig`、`ProbeCapability`、`StableTokenCapability`、`ExternalEffectPhase` 和 `ExternalEffectCapabilityConfig` 归 `observability-application::runtime`。`RuntimeProfileClass`、`StoreAdapterMode`、`ExternalAdapterMode`、`AdapterBindingRef`、`CredentialRef` 与 `ExternalAdapterBindingConfig` 归 `observability-infra::config`。两组类型都不进入wire/public transport DTO，也不固定raw serde key或文件格式；application-only builder/snapshot carrier可以引用前一组。

```rust
/// Body-free identity of one validated configuration revision.
pub struct ConfigBindingRef(pub BodyFreeRef);

/// Body-free identity of one immutable external destination binding revision.
pub struct ExternalEffectBindingRef(pub BodyFreeRef);

/// Positive duration represented in milliseconds after parsing.
pub struct PositiveDurationMillis(pub u64);

/// Positive bounded item count used by pages,plans,and loops.
pub struct PositiveLimit(pub u32);

/// Positive byte-size limit used before payload parsing.
pub struct PositiveByteSize(pub u64);

/// Runtime class used to validate adapter modes,not a business profile.
pub enum RuntimeProfileClass {
    LocalTest,
    IntegrationLike,
    RuntimeLike,
}

/// Store implementation selected at the composition root.
pub enum StoreAdapterMode {
    InMemory,
    Durable,
}

/// Product-neutral external adapter mode.
pub enum ExternalAdapterMode {
    Fake,
    Controlled,
    Endpoint,
    Disabled,
}

/// Whether the external target can answer a stable-token probe.
pub enum ProbeCapability {
    Supported,
    Unsupported,
}

/// Whether the target formally deduplicates repeated calls by stable token.
pub enum StableTokenCapability {
    Enforced,
    NotGuaranteed,
}

/// Backoff parameters for additional attempts after one known failure.
pub struct RetryBackoffConfig {
    pub initial_delay: PositiveDurationMillis,
    pub maximum_delay: PositiveDurationMillis,
    pub multiplier_milli: u32,
    pub jitter_ratio_milli: u16,
}

/// Retry policy whose count excludes the first attempt.
pub struct RetryPolicyConfig {
    pub max_additional_attempts: u32,
    pub backoff: RetryBackoffConfig,
}

/// Durable claim lease and heartbeat parameters.
pub struct ClaimLeaseConfig {
    pub lease_duration: PositiveDurationMillis,
    pub heartbeat_interval: PositiveDurationMillis,
}

/// Finite external-effect phase with independent idempotency and probe semantics.
pub enum ExternalEffectPhase {
    Publication,
    HandoffPreparation,
    HandoffDelivery,
    ExportPreparation,
    ExportDelivery,
}

/// Capability declaration validated before wiring one external-effect phase.
pub struct ExternalEffectCapabilityConfig {
    pub phase: ExternalEffectPhase,
    pub stable_token: StableTokenCapability,
    pub probe: ProbeCapability,
}

/// Opaque product-neutral endpoint,fixture,or controlled-seam binding.
pub struct AdapterBindingRef(pub String);

/// Opaque credential reference resolved only inside infra adapter memory.
pub struct CredentialRef(pub String);

/// Opaque durable-store binding resolved only by infra.
pub struct StoreBindingRef(pub String);

/// Opaque validated policy binding resolved before application invocation.
pub struct PolicyBindingRef(pub String);

/// Opaque inbound or outbound transport binding.
pub struct TransportBindingRef(pub String);

/// Opaque scheduler binding for one operations job.
pub struct ScheduleBindingRef(pub String);

/// Required compatible persistent schema revision.
pub struct StoreSchemaRevision(pub u64);

/// One product-neutral runtime adapter binding.
pub struct ExternalAdapterBindingConfig {
    pub mode: ExternalAdapterMode,
    pub binding_ref: Option<AdapterBindingRef>,
    pub credential_ref: Option<CredentialRef>,
    pub call_timeout: PositiveDurationMillis,
    pub effect_capabilities: Vec<ExternalEffectCapabilityConfig>,
}
```

Validation invariants:

| Type | Validation |
|---|---|
| `ConfigBindingRef` | 指向一个可恢复的validated config revision；不包含path、secret、run id或evidence alias |
| `ExternalEffectBindingRef` | 唯一绑定external adapter + route/target + provider idempotency namespace revision；不包含raw endpoint/topic/credential；任一retained outbox/intent/plan引用期间不可重绑定或丢失解析能力 |
| `PositiveDurationMillis` | value > 0；不得使用负值、零值、overflow 或“无限”字符串绕过 timeout / lease |
| `PositiveLimit` | value > 0 且不超过 `04` 定义的 hard maximum；超界拒绝，不截断后继续 |
| `PositiveByteSize` | value > 0 且不超过实现hard maximum；limit只用于pre-parse reject，不能允许截断body后继续 |
| `RetryBackoffConfig` | `maximum_delay >= initial_delay`；`multiplier_milli >= 1000`；`jitter_ratio_milli <= 1000` |
| `RetryPolicyConfig` | `max_additional_attempts=0` 表示不自动重试；attempt count 不进入 request / plan / external token digest |
| `ClaimLeaseConfig` | `heartbeat_interval < lease_duration`；local clock 不能单独把 claim 标 Expired，durable adapter 决定 state |
| `Fake` | 仅允许 `LocalTest`；必须有 body-free fixture binding，credential absent |
| `Controlled` | 仅允许 `LocalTest` / `IntegrationLike`；需要 controlled binding，结果必须映射 formal outcome |
| `Endpoint` | 需要 binding；protected endpoint 需要 credential ref；raw value 仅在 infra adapter memory 中解析 |
| `Disabled` | adapter binding / credential absent；调用返回 `AdapterDisabled` / formal unavailable，不是success no-op；external target metadata可保留opaque effect ref供outbox/plan compatibility，但capability只能声明`NotGuaranteed/Unsupported` |
| effect capability | resolver 不填写；publisher必须且只声明Publication；handoff必须声明Preparation + Delivery；export必须声明Preparation + Delivery；phase canonical sorted/unique，不能配置虚假能力 |

### 9.2 Digest profile and compatibility binding

`core-contracts` 当前没有 `RequestDigest` 或 `DigestSummary`。它们与以下 helper 归 `observability-contracts::refs`：

```rust
/// Version of one canonical serialization and digest profile.
pub struct DigestProfileVersion(pub u16);

/// Lowercase hexadecimal digest value.
pub struct DigestValue(pub String);

/// Digest of one normalized command,event,or job input.
pub struct RequestDigest {
    pub profile_version: DigestProfileVersion,
    pub digest_value: DigestValue,
}

/// Digest of body-free material,stored payload,or structured outcome.
pub struct DigestSummary {
    pub profile_version: DigestProfileVersion,
    pub digest_value: DigestValue,
}
```

`DigestProfileVersion(1)` 固定为 Step 13 canonical rules + deterministic JSON object encoding + SHA-256 + 64 lowercase hexadecimal characters。这里的“JSON”只是 canonical byte model，不要求 public transport 使用 JSON，也不允许直接对未验证 raw request body hash。

```rust
/// Runtime compatibility gate for versioned digest material.
pub struct DigestCompatibilityConfig {
    pub write_profile: DigestProfileVersion,
    pub readable_profiles: Vec<DigestProfileVersion>,
}
```

| Rule | Contract |
|---|---|
| write profile | P0 只能是 v1；未知值启动失败，不允许 provider 自选 hash |
| readable profiles | canonical sorted / unique，必须包含 write profile；P0 至少包含 v1 |
| retention compatibility | 任何 retained reservation、stored result、outbox payload、plan、intent 或 report 仍引用某 profile 时，不得从 readable set 移除 |
| include / exclude | 由 Step 13 finite operation tables固定，不是 config list |
| migration | 增加 v2 必须先支持 dual-read，再切 write，最后在旧 durable material过期且完成迁移审计后移除 v1 |
| fake parity | entry、fake、durable adapter 对同一 golden vector产生完全相同 bytes / digest |

配置变更不能把 v1 row 按 v2 重新计算后覆盖，也不能用当前 config 重建 missing stored digest；missing / unknown profile 是 consistency failure。

### 9.3 Root validated config

```rust
/// Validated immutable input to the observability runtime builder.
pub struct ValidatedObservabilityConfig {
    pub config_ref: ConfigBindingRef,
    pub profile: RuntimeProfileClass,
    pub technical: TechnicalRuntimeConfig,
    pub boundary: BoundaryConfig,
    pub safety: SafetyBindingConfig,
    pub stores: StoreBindingConfig,
    pub digest: DigestCompatibilityConfig,
    pub idempotency: IdempotencyRetentionConfig,
    pub projection: ProjectionRuntimeConfig,
    pub execution: ExecutionRuntimeConfig,
    pub external: ExternalBindingSet,
    pub entries: EntryBindingConfig,
}
```

| Section | Minimum typed content | Primary consumer |
|---|---|---|
| `technical` | clock / id-generator mode and binding | clock/id constructors |
| `boundary` | request body limit、page default/max、query read timeout、schema allowlist refs | API / worker / jobs composition roots |
| `safety` | redaction policy binding、source family allowlist、safe label policy、visibility policy、body-free scanner binding | infra validators + application constructor parameters |
| `stores` | store modes / refs、migration compatibility、transaction timeout | repositories、projection stores、UoW manager |
| `digest` | write / readable profile | operation context factory、payload / result serializer、intent digest builder |
| `idempotency` | Command / Consumer / Job retention、reserved reconciliation age | idempotency + stored result adapters |
| `projection` | source-set hard limit、rebuild / refresh / gap / rollup batch baselines、freshness policy bindings | projection reader / jobs entry |
| `execution` | claim lease、parallelism cap、per-family retry policies、job timeout / candidate hard limit | worker / jobs composition roots |
| `external` | resolver、publisher、handoff、export bindings + capability declarations | infra adapter constructors / availability registry |
| `entries` | enabled protocol surfaces、consumer bindings、job schedule refs、loop cadence | API / worker / jobs roots only |

Section schema如下。所有 `Vec` 都必须canonical sorted / unique；map通过有typed key的entry list表达，禁止free-form nested map在实现中私补。

```rust
/// Clock implementation selected by one validated runtime profile.
pub enum ClockAdapterMode {
    System,
    Fixed,
}

/// Identifier implementation selected by one validated runtime profile.
pub enum IdGeneratorAdapterMode {
    Runtime,
    Deterministic,
}

/// Base technical adapters required before application assembly.
pub struct TechnicalRuntimeConfig {
    pub clock_mode: ClockAdapterMode,
    pub clock_binding_ref: Option<AdapterBindingRef>,
    pub id_generator_mode: IdGeneratorAdapterMode,
    pub id_generator_binding_ref: Option<AdapterBindingRef>,
}

/// Protocol-bound limits applied before an application call.
pub struct BoundaryConfig {
    pub max_request_body_bytes: PositiveByteSize,
    pub default_page_limit: PositiveLimit,
    pub max_page_limit: PositiveLimit,
    pub query_read_timeout: PositiveDurationMillis,
    pub accepted_inbound_schema_versions: Vec<SchemaVersion>,
}

/// Required product-neutral safety policy bindings.
pub struct SafetyBindingConfig {
    pub redaction_policy_ref: PolicyBindingRef,
    pub source_family_allowlist: Vec<SourceFamilyKind>,
    pub safe_label_policy_ref: PolicyBindingRef,
    pub correlation_mapping_policy_ref: PolicyBindingRef,
    pub visibility_policy_ref: PolicyBindingRef,
    pub body_free_scanner_policy_ref: PolicyBindingRef,
}

/// One local logical-store implementation binding.
pub struct StoreAdapterBindingConfig {
    pub mode: StoreAdapterMode,
    pub binding_ref: Option<StoreBindingRef>,
}

/// Store and transaction bindings required by Step 11 semantics.
pub struct StoreBindingConfig {
    pub observation: StoreAdapterBindingConfig,
    pub projection: StoreAdapterBindingConfig,
    pub idempotency_result: StoreAdapterBindingConfig,
    pub job_execution: StoreAdapterBindingConfig,
    pub transaction_timeout: PositiveDurationMillis,
    pub required_schema_revision: StoreSchemaRevision,
}

/// Retention windows for technical replay and reconciliation material.
pub struct IdempotencyRetentionConfig {
    pub command_reservation: PositiveDurationMillis,
    pub consumer_dedup: PositiveDurationMillis,
    pub job_reservation: PositiveDurationMillis,
    pub reserved_reconciliation_age: PositiveDurationMillis,
    pub external_intent: PositiveDurationMillis,
}

/// Bounded projection and maintenance settings.
pub struct ProjectionRuntimeConfig {
    pub max_source_items_per_capture: PositiveLimit,
    pub max_relation_closure_items: PositiveLimit,
    pub default_rebuild_batch: PositiveLimit,
    pub default_refresh_batch: PositiveLimit,
    pub default_gap_scan_batch: PositiveLimit,
    pub default_rollup_batch: PositiveLimit,
    pub freshness_policy_ref: PolicyBindingRef,
}

/// Executable worker and operations-job limits.
pub struct ExecutionRuntimeConfig {
    pub claim_lease: ClaimLeaseConfig,
    pub max_parallelism: PositiveLimit,
    pub max_plan_items: PositiveLimit,
    pub resolver_retry: RetryPolicyConfig,
    pub publication_retry: RetryPolicyConfig,
    pub handoff_retry: RetryPolicyConfig,
    pub export_retry: RetryPolicyConfig,
    pub job_timeout: PositiveDurationMillis,
}

/// All product-neutral runtime dependency bindings.
pub struct ExternalBindingSet {
    pub observation_source: ExternalAdapterBindingConfig,
    pub runtime_sandbox: ExternalAdapterBindingConfig,
    pub governance_artifact: ExternalAdapterBindingConfig,
    pub subject_context: ExternalAdapterBindingConfig,
    pub event_publisher: ExternalAdapterBindingConfig,
    pub outbound_event_targets: Vec<OutboundEventTargetBindingConfig>,
    pub report_handoff_targets: Vec<ReportHandoffTargetBindingConfig>,
    pub peripheral_export_targets: Vec<PeripheralExportTargetBindingConfig>,
}
```

Cross-field validation:

| Validation | Required rule |
|---|---|
| technical profile | Fixed / Deterministic only in LocalTest；RuntimeLike requires System / Runtime bindings |
| page limits | `default_page_limit <= max_page_limit` |
| store mode | InMemory only in LocalTest；Durable requires binding ref；runtime-like observation + idempotency/result must share one atomic UoW capability |
| job store | every enabled Job requires immutable plan、global work claim、monotonic fence and report persistence capability |
| retention | job reservation must cover nonterminal plan/claim/report lifetime；external intent must cover probe/manual window；cleanup cannot delete unresolved material |
| projection bounds | candidate/source/closure overflow fails whole start/item boundary；never truncate and mark complete/fresh |
| external family | each binding's capability phases must exactly match family requirements in §14.2 |

Application constructor只接收从这些 section解析出的 existing policy input、executable parameter或port，不持有 `ValidatedObservabilityConfig` 或任何 infra section。

### 9.4 External target catalog、entry binding and validated slices

```rust
/// Infra-only raw binding for one enabled inbound consumer.
pub struct InboundConsumerBindingConfig {
    pub operation: ObservationInboundConsumerOperation,
    pub producer_family: ObservationProducerFamily,
    pub transport_binding_ref: TransportBindingRef,
    pub accepted_schema_versions: Vec<SchemaVersion>,
    pub actor_mapping_policy_ref: PolicyBindingRef,
}

/// Infra-only target revision for one outbound event.
pub struct OutboundEventTargetBindingConfig {
    pub event_name: ObservationOutboundEventName,
    pub effect_binding_ref: ExternalEffectBindingRef,
    pub transport_binding_ref: TransportBindingRef,
}

/// One report consumer and its immutable external target binding revision.
pub struct ReportHandoffTargetBindingConfig {
    pub consumer_ref: ReportConsumerRef,
    pub effect_binding_ref: ExternalEffectBindingRef,
    pub adapter: ExternalAdapterBindingConfig,
}

/// One peripheral consumer and its immutable external target binding revision.
pub struct PeripheralExportTargetBindingConfig {
    pub consumer_ref: PeripheralConsumerRef,
    pub effect_binding_ref: ExternalEffectBindingRef,
    pub adapter: ExternalAdapterBindingConfig,
}

/// Infra-only raw scheduler binding for an operations job.
pub struct JobScheduleBindingConfig {
    pub operation: ObservationJobOperation,
    pub schedule_binding_ref: ScheduleBindingRef,
}

/// Entry bindings validated as part of the root configuration.
pub struct EntryBindingConfig {
    pub enabled_commands: Vec<ObservationCommandOperation>,
    pub enabled_queries: Vec<ObservationQueryOperation>,
    pub inbound_consumers: Vec<InboundConsumerBindingConfig>,
    pub enabled_jobs: Vec<ObservationJobOperation>,
    pub job_schedules: Vec<JobScheduleBindingConfig>,
    pub outbox_loop_cadence: PositiveDurationMillis,
    pub outbox_loop_candidate_limit: PositiveLimit,
}

/// API-only immutable configuration slice.
pub struct ValidatedApiEntryConfig {
    pub enabled_commands: Vec<ObservationCommandOperation>,
    pub enabled_queries: Vec<ObservationQueryOperation>,
    pub max_request_body_bytes: PositiveByteSize,
    pub default_page_limit: PositiveLimit,
    pub max_page_limit: PositiveLimit,
    pub query_read_timeout: PositiveDurationMillis,
}

/// Worker-only immutable configuration slice.
pub struct ValidatedWorkerEntryConfig {
    pub inbound_consumers: Vec<ValidatedInboundConsumerRegistration>,
    pub outbox_loop_cadence: PositiveDurationMillis,
    pub outbox_candidate_limit: PositiveLimit,
}

/// Jobs-only immutable configuration slice.
pub struct ValidatedJobsEntryConfig {
    pub enabled_jobs: Vec<ObservationJobOperation>,
    pub job_schedules: Vec<ValidatedJobScheduleRegistration>,
    pub job_timeout: PositiveDurationMillis,
}

/// Typed subject whose external destination is selected before an effect is planned.
pub enum ExternalEffectBindingSubject {
    OutboundEvent(ObservationOutboundEventName),
    ReportConsumer(ReportConsumerRef),
    PeripheralConsumer(PeripheralConsumerRef),
}

/// Application-visible binding entry without endpoint,route,or credential material.
pub struct ExternalEffectBindingEntry {
    pub subject: ExternalEffectBindingSubject,
    pub family: AdapterFamily,
    pub effect_binding_ref: ExternalEffectBindingRef,
    pub call_timeout: PositiveDurationMillis,
    pub capabilities: Vec<ExternalEffectCapabilityConfig>,
}

/// Immutable application catalog derived from validated infra configuration.
pub struct ExternalEffectBindingCatalog {
    pub entries: Vec<ExternalEffectBindingEntry>,
}
```

`InboundConsumerBindingConfig`与`JobScheduleBindingConfig`只存在于`infra::config`的validated root和runtime builder内部。Step 07 R2定义的`ValidatedInboundConsumerRegistration`只保留operation、producer family和accepted schema versions；`ValidatedJobScheduleRegistration`只保留operation。二者的当前唯一文件owner是`infra::runtime_builder`中的technical registration seam，不得增加到raw locator/material的getter、conversion或private registry key。

Derivation必须保持一一对应：每个enabled Consumer恰有一个raw binding、一个成功解析的transport/actor-policy pair、一个safe registration item和一个registrar private slot；每个scheduled Job恰有一个raw schedule binding、一个成功解析的trigger、一个safe registration item和一个registrar private slot。`enabled_jobs`可包含未scheduled但operator-callable的Job；`job_schedules`不得包含disabled/unknown/duplicate operation。Canonical sort按finite operation discriminator，不按raw ref或source array index。

Step 06 / 08 已定义的 finite/support type 在 config validator 中按下表使用；本 Step 不重新定义variant，也不把raw JSON shape、source precedence或默认值从未来 `04` 抢回：

| Validated field | Definition source | Required typed validation | Canonical output |
|---|---|---|---|
| `boundary.accepted_inbound_schema_versions` | Step 06 `SchemaVersion` | non-empty、sorted/unique、只允许binary-supported subset；P0 supported set=`{V1}` | `Vec<SchemaVersion>`；P0有效candidate为`[V1]` |
| `safety.source_family_allowlist` | Step 06 `SourceFamilyKind` | non-empty、sorted/unique、成员只能来自9个exact variants；不生成`Other`/string passthrough | selected finite set；不改变Step 08 per-Consumer compatibility |
| `entries.enabled_queries` | Step 06 `ObservationQueryOperation` | sorted/unique subset of 14 exact variants；public name必须通过API static map total映射 | application-owned enum vector；无parallel config enum |
| `entries.inbound_consumers[].operation` / `producer_family` | Step 06 + Step 08 static map | operation unique；producer必须等于下表required family；不得按transport或payload覆盖 | one validated binding per enabled operation |
| `entries.inbound_consumers[].accepted_schema_versions` | Step 06 `SchemaVersion` | non-empty sorted/unique subset of root accepted set and binary-supported set；P0每个enabled binding只能`[V1]` | worker slice保留exact enum values |
| report / peripheral target `consumer_ref` | Step 06 typed newtypes | inner `BodyFreeRef` valid；各subject family内unique；wrapper owner与catalog variant相等 | typed subject key；不含destination locator/material |

Current P0 Consumer / producer mapping是validator的compile-time total table：

| `ObservationInboundConsumerOperation` | Required `ObservationProducerFamily` |
|---|---|
| `ConsumeBusObservationMaterial` | `Bus` |
| `ConsumeSourceAuditMaterial` | `SourceOwner` |
| `ConsumeIdentityObservationContext` | `Identity` |
| `ConsumeGovernanceAuditContext` | `Governance` |
| `ConsumeArtifactEvidenceContext` | `Artifact` |
| `ConsumeRuntimeSignalSummary` | `Runtime` |
| `ConsumeSandboxSignalSummary` | `Sandbox` |
| `ConsumeArchiveHandoffFeedback` | `Archive` |
| `ConsumeReportConsumerFeedback` | `ReportConsumer` |

Root schema set、Consumer schema set、static producer map、concrete binding descriptor和runtime envelope必须形成同一个交集。Unknown schema / family、empty schema set、operation duplicate、producer mismatch、consumer-ref wrapper mismatch或duplicate target均是`InvalidConfiguration` / `EntryBindingIncomplete`，发生在worker/API/catalog暴露前；不得fallback v1、first enum、generic producer、current target或Disabled success。

`ExternalBindingSet` owns all outbound/report/export target mappings。`EntryBindingConfig` owns onlyentry dispatch、inbound transport和schedule触发，不包含outbound target。`ExternalEffectBindingCatalog` is keyed uniquely by `(subject variant,typed subject ref/name)` and is injected into application services；infra separately retains `effect_binding_ref -> concrete adapter + raw route/target + credential`。Application-visible entries contain onlybody-free ref、family、timeout和capability，不含`AdapterBindingRef`、`TransportBindingRef`、`CredentialRef`或concrete adapter。Catalog lookup contract is:

```rust
pub fn require(
    &self,
    subject: ExternalEffectBindingSubject,
    family: AdapterFamily,
    phase: ExternalEffectPhase,
) -> Result<&ExternalEffectBindingEntry, ApplicationError>;
```

Catalog lookup只验证safe metadata，不执行health probe。A configured target may retain an entry while its concrete adapter isDisabled/Unavailable,so accepted outbox can freeze destination identity；exact call preflight then returns`AdapterDisabled`/family-specific unavailable。Missing subject maps to`AdapterDisabled` at operation boundary（enabled outbound route应在startup totality check更早失败）；duplicate subject、family mismatch或missing phase是validated-config invariant break and maps to`PersistenceInvariantViolation`。A schedule is optional and only triggers a Job；an enabled Job remains callable with a valid Step 08 request when no schedule exists。Candidate bounds come from the explicit Step 08 Job input plus application execution/projection hard limits；entry config cannot fill or rewrite a required protocol field。

### 9.5 Job execution config snapshot

影响一个 Job work-set、claim、retry或external side effect 的配置必须在 start phase 冻结，而不是在每次 item attempt 热读：

```rust
/// Finite execution setting frozen for one accepted operations job.
pub enum JobConfigBinding {
    CandidateLimit(PositiveLimit),
    MaxParallelism(PositiveLimit),
    ClaimLease(ClaimLeaseConfig),
    ResolverRetry(RetryPolicyConfig),
    PublicationRetry(RetryPolicyConfig),
    HandoffRetry(RetryPolicyConfig),
    ExportRetry(RetryPolicyConfig),
    ExternalEffect {
        effect_binding_ref: ExternalEffectBindingRef,
        family: AdapterFamily,
        call_timeout: PositiveDurationMillis,
        capabilities: Vec<ExternalEffectCapabilityConfig>,
    },
}

/// Immutable config material required to resume one job plan.
pub struct JobExecutionConfigSnapshot {
    pub config_ref: ConfigBindingRef,
    pub operation_name: ObservationJobOperation,
    pub bindings: Vec<JobConfigBinding>,
}
```

`bindings` 按 enum discriminator + canonical field bytes排序。Non-external kind只能出现一次；`ExternalEffect`可出现多次但`effect_binding_ref`必须唯一，且family/call timeout/capability必须与application catalog完全一致。每个 Job 只冻结会改变其候选集或执行策略的 relevant bindings，避免无关配置变化改变 request / plan digest。

| Job | Required frozen bindings |
|---|---|
| `PublishObservationOutbox` | candidate limit、parallelism、claim lease、publication retry、plan内所有distinct per-item external effect binding + call timeout + publisher capability |
| `RebuildObservationReadModels` | candidate limit、parallelism、claim lease |
| `RebuildSignalRollups` | candidate limit、parallelism、claim lease |
| `RefreshReferenceSnapshots` | candidate limit、parallelism、claim lease、resolver retry |
| `ScanObservationGaps` | candidate limit、parallelism、claim lease |
| `CoordinateObservationReplay` | candidate limit、parallelism、claim lease |
| `PrepareReportHandoffDelivery` | claim lease、handoff external effect binding + call timeout、handoff retry、prepare / deliver capability |
| `PrepareExternalAuditExportDelivery` | claim lease、export external effect binding + call timeout、export retry、prepare / deliver capability |
| `RebuildPeripheralViews` | candidate limit、parallelism、claim lease |

Snapshot 的 canonical digest必须进入 `ObservationJobExecutionPlan.plan_digest`，完整 snapshot随plan durable保存。Duplicate terminal replay不读取当前配置；Draft resume必须加载原 snapshot；若 snapshot missing / corrupt / unknown profile，则 manual consistency failure，不能用 current config 补造。

## 10. Runtime、boundary 与 store 配置引用表

| 配置项 | 类型 | 读取模块 | 默认值 / 缺失行为 | 详细配置文档位置 |
|---|---|---|---|---|
| `runtime.config_ref` | `ConfigBindingRef` | `infra::config`;`runtime_builder` | 必填；每个 validated snapshot 有稳定ref | `04-配置设计.md` config identity |
| `runtime.profile_class` | `RuntimeProfileClass` | `infra::config`;composition roots | 必填；不得由 binary 名猜测 | runtime profile |
| `runtime.clock_mode` | system / fixed typed binding | `infra::clock_id`;builder | runtime-like 必须system binding；fixed仅local/test | clock adapter |
| `runtime.id_generator_mode` | runtime / deterministic typed binding | `infra::clock_id`;builder | runtime-like 必须runtime binding；deterministic仅local/test | id generator |
| `boundary.max_request_body_bytes` | positive byte limit | API / worker pre-parser | `04` 提供 bounded baseline；缺失fail startup | API / event boundary |
| `boundary.default_page_limit` | `PositiveLimit` | API query mapper | `04` 提供；必须<=max | query paging |
| `boundary.max_page_limit` | `PositiveLimit` | API / repository page guard | `04` 提供；超界reject，不截断 | query paging |
| `boundary.query_read_timeout` | `PositiveDurationMillis` | API query wrapper | `04` 提供；timeout只返回 unavailable，不触发write | query timeout |
| `boundary.inbound_schema_profiles` | canonical schema-version set | worker schema router | 必填；unknown version=`UnsupportedSchema`且不parse body | event schema |
| `stores.observation` | store mode + binding ref | repositories / UoW builder | local/test可explicit in-memory；runtime-like durable必填 | truth / transaction store |
| `stores.projection` | store mode + binding ref | projection / source-index builder | 同上；不得silent fallback到in-memory | projection store |
| `stores.idempotency_result` | store mode + binding ref | idempotency / result builder | 必须与accepted write有同UoW原子能力；缺失fail startup | idempotency store |
| `stores.job_execution` | store mode + binding ref | plan / claim / report builder | 必须durable claim + monotonic fence；不支持则Job disabled | job execution store |
| `stores.transaction_timeout` | `PositiveDurationMillis` | UoW adapter | `04` 提供；timeout after commit request=`CommitOutcomeUnknown` | transaction section |
| `stores.required_schema_revision` | typed revision marker | runtime builder / migration validator | 必填；mismatch fail startup，不自动修truth | migration section |
| `digest.write_profile` | `DigestProfileVersion` | digest builder | v1 | digest compatibility |
| `digest.readable_profiles` | version set | result / payload / plan loaders | `{v1}`；不得移除仍被引用版本 | digest compatibility |

Store binding只选择 Step 07 port implementation。它不能改变 logical store、owner、unique key、version、cursor、source fence、claim fence、transaction ordering或 recovery classification。

## 11. Safety、projection 与 retention 配置引用表

| 配置项 | 类型 | 读取模块 | 默认值 / 缺失行为 | 详细配置文档位置 |
|---|---|---|---|---|
| `safety.redaction_policy_binding` | `PolicyBindingRef` | infra validator；application constructor | 必填；缺失fail closed | safety / redaction |
| `safety.source_family_allowlist` | finite `SourceFamilyKind` set | API / worker mapper | 必填；unknown family reject / quarantine | intake source policy |
| `safety.safe_label_policy_binding` | `PolicyBindingRef` | safe-signal validator | 必填；不允许任意/high-cardinality label | safe signal policy |
| `safety.correlation_mapping_binding` | `PolicyBindingRef` | boundary correlation mapper | 必填；只映射 typed body-free refs | correlation mapping |
| `safety.visibility_policy_binding` | `PolicyBindingRef` | query / resolver result mapper | 必填；not-visible不得变missing/success | visibility policy |
| `safety.body_free_scanner_binding` | `PolicyBindingRef` | intake / resolver / fixture validator | 必填；无disabled mode | forbidden body validation |
| `projection.max_source_items_per_capture` | `PositiveLimit` | `ObservationProjectionSourceReader` adapter | `04` 提供；超界item failure，不截断 | projection safety limit |
| `projection.max_relation_closure_items` | `PositiveLimit` | membership planner | `04` 提供；unbounded closure rollback accepted write | projection relation limit |
| `projection.default_rebuild_batch` | `PositiveLimit` | application Job start planner | `04` 提供；Job DTO显式limit时只能收窄 | rebuild jobs |
| `projection.default_refresh_batch` | `PositiveLimit` | application Job start planner | `04` 提供；start phase冻结 | reference refresh jobs |
| `projection.default_gap_scan_batch` | `PositiveLimit` | application Job start planner | `04` 提供；不得漏报后宣称complete | gap scan jobs |
| `projection.default_rollup_batch` | `PositiveLimit` | application Job start planner | `04` 提供；只处理stored `SafeSignal` | rollup jobs |
| `projection.freshness_policy_binding` | `PolicyBindingRef` | query / projection assembler | 必填；只分类fresh/stale，不inline rebuild | projection freshness |
| `retention.command_reservation` | positive duration | idempotency store | `04` 必填；覆盖caller retry + commit unknown窗口 | idempotency retention |
| `retention.consumer_dedup` | positive duration | idempotency store / worker | `04` 必填；覆盖producer/broker redelivery窗口 | consumer dedup retention |
| `retention.job_reservation` | positive duration | idempotency / job store | `04` 必填；覆盖plan、resume、finalize和terminal replay窗口 | job retention |
| `retention.reserved_reconciliation_age` | positive duration | operations reconciliation selector | `04` 提供；到龄不等于rollback / expired success | reservation reconciliation |
| `retention.external_intent` | positive duration | intent / delivery stores | `04` 必填；覆盖probe和manual classification窗口 | external intent retention |

`retention.*` 只控制本仓 technical reservation / plan / intent material的保留，不授权删除 source truth，也不替代 `RetentionMarker` / `ActiveReferenceProtection` 的业务 guard。

## 12. Execution、external 与 entry 配置引用表

| 配置项 | 类型 | 读取模块 | 默认值 / 缺失行为 | 详细配置文档位置 |
|---|---|---|---|---|
| `execution.claim_lease` | `ClaimLeaseConfig` | job execution adapter / runners | `04` 必填；invalid fail startup | claim / fencing |
| `execution.max_parallelism` | `PositiveLimit` | application publication / maintenance service | 安全基线为1；`04` 可在hard cap内提高；accepted Job冻结 | worker / jobs concurrency |
| `execution.max_plan_items` | `PositiveLimit` | Job start planner | `04` 必填；超界rollback start，不建partial plan | job plan limit |
| `execution.resolver_retry` | `RetryPolicyConfig` | resolver wrapper / relevant Job | 默认0次additional attempt | resolver retry |
| `execution.publication_retry` | `RetryPolicyConfig` | publication service / worker | 默认0；`04` 可启用known-failure same-token retry | outbox retry |
| `execution.handoff_retry` | `RetryPolicyConfig` | handoff Job wrapper | 默认0；Unknown/Unsupported永不自动retry | handoff retry |
| `execution.export_retry` | `RetryPolicyConfig` | export Job wrapper | 默认0；Unknown/Unsupported永不自动retry | export retry |
| `execution.job_timeout` | positive duration | jobs root invocation wrapper | `04` 提供；只允许在safe phase boundary协作yield并返回in-progress，不取消in-flight adapter call、不改plan/item state、不证明rollback | job invocation budget |
| `external.observation_source` | `ExternalAdapterBindingConfig` | source resolver builder | 缺失=Unavailable；不得fake success | source resolver |
| `external.runtime_sandbox` | same | runtime/sandbox resolver builder | 缺失=Unavailable | runtime / sandbox resolver |
| `external.governance_artifact` | same | evidence resolver builder | 缺失=Unavailable / fail closed per flow | evidence resolver |
| `external.subject_context` | same | subject resolver builder | 缺失=Unavailable / degraded | identity / subject resolver |
| `external.event_publisher` | same + effect capability | publisher builder | binding缺失=publisher disabled；truth仍committed/outbox pending | event publisher |
| `external.outbound_event_targets` | event -> effect binding + infra transport ref | publisher registry / application safe catalog builder | 每个enabled outbound event exact one；missing/duplicate fail publisher assembly；raw route不进entry/application | outbound event targets |
| `external.report_handoff` | same + effect capability | handoff builder | binding缺失=Job blocked/unavailable | report handoff |
| `external.peripheral_export` | same + effect capability | export builder | disabled默认允许外围能力不注册，但不得返回delivered | export delivery |
| `entries.api_enabled_surfaces` | finite operation set | API root | 核心surface集合由protocol固定；配置只可按部署禁用，不改schema | API routing |
| `entries.consumer_bindings` | event-name -> binding ref map | worker root | enabled consumer必须exact binding；缺失fail worker startup | inbound consumer |
| `entries.outbox_loop_cadence` | positive duration | worker root | `04` 提供；只影响调度，不改变eligibility | outbox loop |
| `entries.job_schedule_refs` | job operation -> schedule ref | jobs / scheduler root | 可为空表示无自动schedule；operator invocation仍需完整DTO | job scheduling |

完整数值、profile override、source precedence、hot reload policy和deployment-specific enablement由 `04` 负责；本表已经固定每项的代码 owner、必填性与失效语义。

## 13. 外部依赖绑定表

### 13.1 Store、UoW 与 technical adapter

| 依赖 | 绑定位置 | 使用接口 | 超时 / 重试 | 降级策略 |
|---|---|---|---|---|
| observation truth store | `infra::observation_repositories`;builder | `ObservationIntakeRepository`;`CorrelationSignalRepository`;`AuditEvidenceRepository`;`ReportHandoffRepository`;`PeripheralDeliveryRepository`;`RetentionGuardRepository`;`ReferenceMaintenanceRepository` | transaction timeout；mutation 不做 adapter-local blind retry，按 Step 12 known rollback / commit unknown分类 | startup-required；不可用时写入口不开始UoW，不切in-memory，不写外部truth |
| projection / source-index store | `infra::projection_stores`;builder | `ObservationProjectionSourceReader`;`ObservationProjectionMembershipPlanner`;`ObservationProjectionStore` | bounded capture / transaction timeout；fence/CAS conflict由application reload | Query返回stale/degraded/unavailable；不得inline rebuild或把旧view标Fresh |
| idempotency / stored-result store | `infra::idempotency_store`;`result_store` | `ObservationIdempotencyRepository`;`ObservationStoredResultRepository` | reserve / commit timeout按commit unknown；不得绕过reservation重跑 | accepted mutation要求与truth write同UoW原子；不支持则对应写surface不得启动 |
| outbox store | `infra::outbox_store` | `ObservationOutboxRepository` | repository timeout按Step 12；publication retry不改变stored row identity | publisher不可用时保留Pending / typed Failed和exact payload，truth不回滚 |
| job execution / report store | `infra::job_execution_store`;`job_report_store` | `ObservationJobExecutionRepository`;`ObservationJobReportRepository` | claim lease / heartbeat；CAS/fence conflict reload；commit unknown先probe | 不支持global work key、monotonic fence或plan durability时禁用所有operations Job，不用进程锁替代 |
| UoW manager | `infra::unit_of_work` | `ObservationUnitOfWorkManager`;`ObservationUnitOfWork` | transaction timeout只限制等待；timeout after submit=`CommitOutcomeUnknown` | begin失败零写；commit未知停下probe；不把partial store success冒充原子提交 |
| system / fixed clock | `infra::clock_id` | `ClockPort` | 不做业务重试；startup probe | runtime-like不可用则startup失败；fixed clock只用于local/test，时间不替代version/cursor/fence |
| runtime / deterministic id generator | `infra::clock_id` | `IdGeneratorPort` | 不做业务重试；生成失败在mutation前返回dependency unavailable | runtime-like不可用则startup失败；不得由handler/repository/path/hash/time拼ref |
| digest / serializer implementation | `application::operation_context`;`infra::serialization` | Step 13 canonical profile + Step 09 context factory | deterministic failure不重试 | profile不兼容startup失败；stored bytes/digest不从current truth重建 |
| adapter availability registry | `infra::runtime_builder`;`adapter_registry` | `AdapterAvailabilityProbe` | health timeout只更新family或exact-binding snapshot；不触发domain write | 返回Available/Degraded/Unavailable/Misconfigured；target call用exact binding scope；不把Assembled或health 2xx当业务成功 |

### 13.2 Resolver adapter

| 依赖 | 绑定位置 | 使用接口 | Timeout / retry authority | Formal outcome / degradation | 禁止 fallback |
|---|---|---|---|---|---|
| observation source / source audit | `infra::source_resolvers` | `ObservationSourceSummaryResolver` | `external.observation_source.call_timeout`;sync Command默认零additional retry，Consumer/Job按frozen resolver policy | `Resolved` / `NotVisible` / `Stale` / `Unresolved` / `Unavailable`;按flow delayed/gap/degraded/rejected | 读取或保存source body；unavailable当not-found |
| runtime / sandbox safe signal | same | `RuntimeSandboxSummaryResolver` | binding timeout；reference refresh Job可按原plan retry | safe signal summary或formal unavailable/stale；不裁决execution status | 调provider raw logs/metrics/traces直接入仓；从runtime cache猜truth |
| governance / artifact evidence | same | `GovernanceArtifactEvidenceResolver` | binding timeout；高风险body-free gate默认fail closed | body-free digest/ref + visibility；unavailable驱动delayed/gap/blocked | 保存governance decision / artifact/evidence body；opaque ref当已验证 |
| identity / subject context | same | `SubjectObservationResolver` | binding timeout；refresh Job frozen retry | body-free subject summary + freshness；unavailable显式degraded/unresolved | 保存identity profile/body；用missing掩盖not-visible |

Resolver wrapper只可对**已知在external acceptance前失败**的只读调用按 frozen policy重试。每次调用必须使用相同 typed ref和visibility context；不得在retry时改变source、扩大scope、读取raw body或把最后一次provider message作为formal classification。同步 Query默认单次调用；timeout返回当前请求的unavailable surface，不触发reference写、gap写或retry job。

### 13.3 Publisher、handoff 与 export adapter

| 依赖 | 绑定位置 | 使用接口 | Timeout / retry authority | Degradation / recovery | 禁止 fallback |
|---|---|---|---|---|---|
| event transport / bus | `infra::event_publishers` | `ObservationEventPublisher.publish`;`probe_publication` | call timeout；known pre-accept failure可按frozen publication policy same-token retry；timeout/unknown先probe | adapter disabled时outbox继续可见；Published probe只local finalize；Unknown/Unsupported manual | 重建payload、换token、Failed->Pending、回滚accepted truth、把Published当consumed |
| report / archive / acceptance handoff | `infra::handoff_delivery` | `ReportHandoffDeliveryPort` four phase calls | prepare/deliver分别timeout；known abort proof后same-token retry；unknown先对应phase probe | unavailable/unsupported -> handoff Job blocked/failed/indeterminate；local handoff truth保留 | fallback target/path、new intent、receipt当signoff/final verdict/真实run id |
| dashboard / alert / external audit / GRC export | `infra::peripheral_export_delivery` | `PeripheralExportDeliveryPort` four phase calls | prepare/deliver分别timeout；same rules with export policy | disabled可不注册schedule，但显式调用返回AdapterDisabled；existing preparation/view保留 | 外围产品状态反写truth、package body入仓、Delivered无formal result |

External effect retry has two independent gates:

1. Step 12 recovery class必须允许当前phase重试。
2. Frozen `RetryPolicyConfig`仍有additional attempt budget。

两者都满足仍不能覆盖 Step 13 probe规则。Call timeout、connection close、worker cancellation或lease expiry都不构成“external未接收”的formal abort proof。

### 13.4 Adapter requirement class

| Requirement class | Families | Startup / runtime behavior |
|---|---|---|
| startup-required | observation store、idempotency/result atomic group、UoW、clock、id generator、digest profile、safety validators | missing / incompatible时不装配write façade；不得partial fake startup |
| enabled-job-required | projection/source index、job execution/report store | 任一operations Job enabled时必须满足plan/claim/fence/report契约；否则该Job registry拒绝启动 |
| operation-required | four resolver families | runtime可装配为Unavailable；调用flow按formal resolution / Step 12 recovery处理 |
| propagation-required | event publisher | write façade可在outbox durable时运行；publisher worker disabled/unavailable必须可见且不得丢弃outbox |
| explicit peripheral | report handoff、peripheral export | disabled可阻止对应Job/route；不得影响无关core truth，也不得返回fake success |

## 14. Adapter mode、capability 与 failure binding

### 14.1 Adapter mode strategy

| Mode | Allowed profile | Required binding | Required behavior | Forbidden behavior |
|---|---|---|---|---|
| `Fake` | `LocalTest` only | explicit body-free fixture ref；credential absent | 实现相同Step 07 port，按fixture返回formal outcomes，支持spy/fault injection | default Resolved/Published/Delivered；private map bypass；不模拟CAS/fence/probe |
| `Controlled` | `LocalTest` / `IntegrationLike` | controlled seam ref；credential按seam要求 | 可明确产生success/not-visible/stale/unavailable/retryable/permanent/unknown/unsupported | 用panic、string或HTTP code越过formal mapping；当production endpoint |
| `Endpoint` | `IntegrationLike` / `RuntimeLike` | endpoint binding；protected target需要credential ref | provider-specific details封装在infra，输出body-free formal result | raw URL/secret/response body进入application/domain/log/report |
| `Disabled` | any,仅对非startup-required family | no binding / credential | availability=Unavailable；调用返回`AdapterDisabled`或formal unavailable | no-op success；自动fallback fake；生成receipt/marker |

In-memory store不是external `Fake`。它是 `StoreAdapterMode::InMemory`，只允许local/test，仍必须通过共享repository conformance suite验证unique、CAS、UoW rollback invisibility、cursor、source fence、claim/fence、stored replay和probe-result persistence。

### 14.2 Capability binding matrix

| Family / phase | Required stable token | Probe capability | Allowed automatic repeat |
|---|---|---|---|
| EventPublisher / Publication | caller始终传`ObservationPublicationToken`;target `Enforced`或`NotGuaranteed`需如实声明 | `Supported`优先；`Unsupported`允许但availability至少Degraded | known abort proof；或Supported probe=`NotPublished`；始终same token/payload |
| ReportHandoff / Preparation | caller传`HandoffPreparationToken` | phase-specific Supported/Unsupported | known abort proof或`NotPrepared`;same token/material |
| ReportHandoff / Delivery | caller传`HandoffDeliveryToken` | phase-specific | known abort proof或`NotDelivered`;same token/preparation |
| PeripheralExport / Preparation | caller传`ExportPreparationToken` | phase-specific | known abort proof或`NotPrepared`;same token/material |
| PeripheralExport / Delivery | caller传`ExportDeliveryToken` | phase-specific | known abort proof或`NotDelivered`;same token/package |

`StableTokenCapability::NotGuaranteed`不允许移除token参数；它表示target不承诺dedup。该phase如果同时`ProbeCapability::Unsupported`，first attempt仍可由显式flow执行，但任何ambiguous outcome必须manual，自动additional attempts必须为0。Config validator将配置期望与concrete adapter implementation descriptor比对；runtime config不能把不支持的provider谎报为Supported / Enforced。

### 14.3 Timeout and retry semantics

| Cut | Timeout means | Retry key/material | Exhaustion result |
|---|---|---|---|
| resolver | current read attempt没有formal result | same typed ref / visibility / source version context | formal unavailable / item FailedRetryable或terminal report classification |
| repository begin/read | current local operation failed beforeaccepted commit | reload according to Step 12；no mutation replay assumption | dependency unavailable / job item failure |
| commit | commit outcome may beunknown | probe reservation/result/owner/marker before anyrepeat | `CommitOutcomeUnknown` / manual if ambiguity remains |
| claim heartbeat | renew did not confirmownership | reload durable claim/plan；old token不可复用 | item stops；fresh claimant may resume only afterformal Expired/Released |
| publication | target acceptance unknown unlessformal failure/probe | same publication token + exact snapshot | Failed/DeadLettered only fromformal classification；Unknown manual |
| handoff/export prepare | external preparation may exist | same preparation token + exact local material | Job indeterminate/manual onUnknown/Unsupported |
| handoff/export deliver | external delivery may exist | same delivery token + exact preparation/package | local finalize-only ifDelivered；manual onUnknown/Unsupported |

Retry counter、sleep schedule、worker id、attempt ref、claim token和wall-clock attempt time属于operations metadata，不进入request digest、plan item input digest、publication token或external material digest。

### 14.4 Failure and degradation mapping

| Failure family | Detection owner | Required surface | Forbidden fallback |
|---|---|---|---|
| malformed / out-of-range config | `infra::config` | `RuntimeAssemblyError::InvalidConfiguration`;no façade | use zero/unbounded/default string |
| missing required binding / credential ref | config validator / secret boundary | startup failure或optional adapterUnavailable | read raw env in handler；fallback fake |
| incompatible store capability | runtime builder conformance probe | startup / enabled-job failure | use process mutex、best-effort multi-store write |
| optional adapter disabled | availability registry | `Unavailable` + `ApplicationError::AdapterDisabled` on call | success no-op |
| adapter health degraded | adapter probe | `Degraded` + formal operation result | mutate domain state based onhealth alone |
| resolver timeout/unavailable | resolver mapper | `SafeResolution::Unavailable` or typed unavailable | map toNotFound / NotVisible / Resolved |
| publication known failure | publisher mapper | typed Failed marker;policy decidesfuture eligible retry | rollbacktruth；clear failure；new payload |
| publication ambiguous | publisher/probe | `ProbeBeforeRetry`;Unknown/Unsupported manual | blind resend |
| handoff/export known failure | delivery mapper | phase-local failure + report item classification | final verdict / fake receipt |
| config changes during active Job | application plan loader / service | current execution continues original snapshot；new request uses new config ref | entry读取catalog、mutate existing plan / relist candidates |
| adapter implementation descriptor mismatch | runtime builder | Misconfigured / startup fail forrequired family | trust config capability claim |

## 15. Event and route binding

### 15.1 Inbound consumer binding

Each enabled binding contains `(consumer operation,producer family,transport binding ref,accepted schema versions,actor mapping policy ref)`。Transport name、subscription、credential和ack policy留在infra / `04`;Step 08 envelope与payload不因transport改变。

Producer family不是deployment choice。以下Runtime source说明只是binding/availability语境，exact enum仍由 §9.4 static table决定；例如统一source-audit入口固定`SourceOwner` producer，而payload `SourceFamilyKind`再按Step 08限制为Governance / Artifact / Runtime / Sandbox。

| Consumer | Runtime source | Required binding | Disabled / unavailable behavior |
|---|---|---|---|
| `ConsumeBusObservationMaterial` | `L0-bus` / trusted material producer | exact bus material binding + schema allowlist + system actor mapping | entry disabled或Delayed/Unavailable；不得绕过resolver补raw body |
| `ConsumeSourceAuditMaterial` | governance / artifact / runtime / source audit producer | producer-family-specific audit binding | unsupported beforepayload parse；unavailable不生成audit projection |
| `ConsumeIdentityObservationContext` | `L1-identity` event collaboration | identity context binding | disabled时on-demand resolver可仍Unavailable；不补identity truth |
| `ConsumeGovernanceAuditContext` | `L1-governance` | governance audit binding | unavailable -> delayed/gap/not-visible perflow |
| `ConsumeArtifactEvidenceContext` | `L1-artifact` | artifact evidence binding | unavailable -> delayed/gap；不保存evidence body |
| `ConsumeRuntimeSignalSummary` | `L2-runtime` / capability producer | runtime signal binding | disabled -> observation gap/degraded；不裁决execution truth |
| `ConsumeSandboxSignalSummary` | `L4-sandbox` | sandbox signal binding | disabled -> sandbox observation degraded；不接管sandbox truth |
| `ConsumeArchiveHandoffFeedback` | `L4-archive` / report handoff consumer | archive feedback binding | disabled/unavailable -> handoff remainspending/indeterminate；不伪造delivered |
| `ConsumeReportConsumerFeedback` | report / external audit / dashboard consumer | consumer-family feedback binding | disabled -> local delivery state unchanged；feedback absence不是failure/success proof |

Binding rules:

- `source_event_ref` secondary uniqueness仍是 Step 13 `(consumer_operation,producer_family,source_event_ref)`，不能配置为transport offset。
- Enabled binding必须提供唯一 producer family和actor mapping；ambiguous / duplicate map启动失败。
- Schema allowlist只选择Step 08已定义版本；配置不能新增字段、忽略required field或把unknown version降级成v1。
- Ack / redelivery只发生在consumer receipt formal outcome之后；config不能把transport ack当accepted receipt。
- Disabled consumer不消费、不ack、不写local marker；不会自动改用polling resolver或fake。

### 15.2 Outbound route binding

`ExternalBindingSet.outbound_event_targets` defines `ObservationOutboundEventName -> (ExternalEffectBindingRef,TransportBindingRef)`。所有enabled event必须total mapped；route只决定transport destination，不改变event name、schema、subject、payload bytes或token semantics。

| Outbound event | Binding requirement | Missing behavior |
|---|---|---|
| `ObservationReceiptChanged` | required when its accepted flows and publisher worker are enabled | publisher worker startup fails / remainsdisabled；stored outbox retained |
| `SafetyDispositionChanged` | same | same |
| `SafeSignalRecorded` | same | same |
| `AuditProjectionAppended` | same | same |
| `EvidenceLinkageChanged` | same | same |
| `ReportHandoffChanged` | same | same |
| `RetentionMarkerChanged` | same | same |
| `NoWriteViolationRecorded` | same | same |
| `GapStateChanged` | same | same |
| `ReferenceSnapshotChanged` | same | same |
| `DerivedProjectionChanged` | required when derived event emission is enabled | projection remainscommitted；no fabricated publication |
| `PeripheralDeliveryChanged` | required when peripheral event emission is enabled | delivery truth remainslocal；no fallback route |

`TransportBindingRef` and raw topic / route never enter `ObservationOutboxPayloadSnapshot`,payload digest,public DTO,domain object or application service。Accepted flow从safe catalog取得`effect_binding_ref`并存入snapshot；infra用该ref解析historical adapter + route。Route changes create a new binding ref and affect onlyfuture accepted snapshots。Old Pending/Failed/ambiguous publication继续解析old ref；不得用current route重定向。`04`必须定义activation、old-binding retention、rollback和compatibility checks。

### 15.3 API and Job dispatch binding

| Entry | Reads | Injected executable surface | Forbidden access |
|---|---|---|---|
| API command root | enabled command set、boundary limits、static command route map | `ObservationTruthWriteService` façade + operation context / digest factory | repositories、external adapters、outbound target catalog、UoW、raw config |
| API query root | enabled query set、page/read timeout、static query route map | `ObservationReadService` façade | rebuild/repair service、repository write、availability-triggered write |
| Worker consumer root | consumer bindings、schema profiles、loop controls | `ObservationInboundEventService` façade | domain factory direct call、repository/adapter bypass |
| Worker publisher root | outbox cadence、candidate limit、publication snapshot policy | `ObservationPublicationService` façade | direct outbox repository + publisher pair outsideapplication flow |
| Jobs root | enabled jobs、schedule refs、entry invocation budget | `ObservationMaintenanceService` / publication façade | snapshot factory、target catalog、direct repository/resolver/delivery/UoW、resume config hot read |

Schedule ref is only a trigger binding. Job idempotency key、actor、operation、scope、target、cursor、consumer and replay scope仍来自Step 08 Job metadata/input；schedule time、scheduler attempt和host identity不进入digest，也不构成真实 acceptance `run_id`。

## 16. Cross-repo Rust dependency binding

### 16.1 Binding table

| 依赖仓库 / 边界 | 全局依赖类型 | 本地路径 / 现实状态 | Cargo 引用方式 / 协作方式 | 使用位置 | 不可用时处理 |
|---|---|---|---|---|---|
| `quantalithos-core` | compile-time shared contracts | `/home/aris/Projects/quantalithos-core`，已发现；`core-contracts` package / `core_contracts` lib已核实 | workspace root only: `core-contracts = { path = "../quantalithos-core/crates/contracts" }`;member按需`workspace = true` | actor / idempotency / safe ref / metadata等已存在shared types | path/package/type缺失则暂停相关实现；不得复制shadow contract |
| `quantalithos-bus` | runtime event collaboration | `/home/aris/Projects/quantalithos-bus`，已发现 | no Cargo dependency；inbound binding、outbox publisher、stable event envelope、fake / controlled seam | 9 Consumer中的bus/source event；12 outbound event发布 | input挂起、publisherUnavailable、outbox保留；不接管bus ack/retry/DLQ truth |
| `quantalithos-identity` | runtime / event / safe-ref source | `/home/aris/Projects/quantalithos-identity`，已发现 | no Cargo dependency；`SubjectObservationResolver`、identity consumer binding、fixture | subject context、actor / identity observation gap | unresolved/degraded/gap；不补identity truth |
| `quantalithos-governance` | runtime / event / audit context | `/home/aris/Projects/quantalithos-governance`，已发现 | no Cargo dependency；evidence resolver、governance audit event、handoff / outbound event | audit projection、body-free evidence、report context | blocked/degraded/not-visible；不补Governance decision |
| `quantalithos-artifact` | runtime / evidence source | `/home/aris/Projects/quantalithos-artifact`，当前未发现 | no Cargo dependency；`GovernanceArtifactEvidenceResolver`、artifact event、fixture | evidence linkage、reference snapshot、handoff input | contract/fake可继续；real integration pending；不导入artifact/evidence body |
| `quantalithos-runtime` | runtime / event observation source | `/home/aris/Projects/quantalithos-runtime`，当前未发现 | no Cargo dependency；runtime resolver、signal event、fixture | safe runtime signal、diagnostic / gap | explicit unavailable/degraded；不裁决execution truth |
| `quantalithos-sandbox` | runtime / event observation source | `/home/aris/Projects/quantalithos-sandbox`，当前未发现 | no Cargo dependency；sandbox resolver、signal event、fixture | sandbox safe signal / safety context | explicit degraded/gap；不接管sandbox control truth |
| `quantalithos-archive` | runtime handoff / feedback consumer | `/home/aris/Projects/quantalithos-archive`，当前未发现 | no Cargo dependency；`ReportHandoffDeliveryPort`、archive feedback event、fake / controlled seam | retention-aware handoff、delivery lifecycle | handoff pending/blocked/indeterminate；不生成archive package truth |
| `quantalithos-sdk` | downstream API consumer | `/home/aris/Projects/quantalithos-sdk`，已发现 | no Cargo dependency；public protocol / API only | read / diagnostic consumption | downstream unavailable不影响truth；SDK实现不进入本仓 |
| `quantalithos-console` / L5 console | downstream UI consumer | `/home/aris/Projects/quantalithos-console`，当前未发现 | no Cargo dependency；public query / event surface | read / diagnostic / progress view | display unavailable only；不写projection/truth |
| report / acceptance systems | runtime handoff consumer | 无统一 sibling repo | no Cargo dependency；`ReportHandoffDeliveryPort` + explicit target binding | report handoff / evidence-index input | unavailable -> blocked/pending；不得伪造run/evidence/signoff |
| dashboard / alert / external audit / GRC | peripheral runtime consumer | product-specific，当前不选型 | no Cargo dependency；`PeripheralExportDeliveryPort` + product-neutral config | peripheral export / feedback | optional disabled/degraded；不得反写truth |
| target implementation repo | implementation target | `/home/aris/Projects/quantalithos-observability`，当前未发现 | not a dependency；由Step 17 / `07`创建或确认workspace | all implementation modules | 不阻塞design；阻塞正式implementation kickoff |

### 16.2 Cargo binding rule

```toml
[workspace.dependencies]
core-contracts = { path = "../quantalithos-core/crates/contracts" }
```

- 当前阶段只允许本地 path dependency，不要求public crates.io发布。
- 中期可迁移到private git tag / immutable rev，但必须在 `07-实施计划.md` 定义pin、验证、rollback和boundary impact；本 Step 不预设远程URL或伪造rev。
- `observability-contracts` 是本仓member dependency，不是跨仓替代品；sibling不得通过复制其源码或path反向依赖实现细节来绕过事件 / runtime boundary。
- 任何新增non-core sibling Cargo dependency都构成design blocker，必须回开Step 03/04/05/14及架构依赖裁剪，而不是直接修改Cargo。
- External SDK / product crate如果未来需要作为infra-only technical dependency，必须经ADR、安全审查和implementation plan显式批准；不得让provider types越过infra。当前不预支任何此类crate。

### 16.3 Missing repository decision

| Missing class | Design continuation | Implementation gate |
|---|---|---|
| compile-time `core-contracts` missing / incompatible | 不可用shadow type继续 | 阻塞相关member编译与实现 |
| runtime producer / consumer repo missing | 以Step 07 formal port、typed event contract和body-free fake继续 | real integration boundary保持pending，不声称已连通 |
| target observability repo missing | 设计可推进到Step 17 | `07`必须创建/确认workspace、toolchain和path dependency后才实施 |
| external product unselected | 保持Endpoint binding abstract，Controlled seam验证contract | 选型前不写provider-specific code / config / evidence |

## 17. Runtime builder and composition roots

### 17.1 Logical builder contract

`infra::runtime_builder` 不依赖 `api`、`worker` 或 `jobs`。它输出five application service handles、existing context factory、availability probe、三个validated entry slices和two prebuilt registrars；入口crate只实现finite handler/catalog并做最终all-or-nothing composition。

```rust
/// Runtime components constructed without depending on entry crates.
pub struct BuiltObservabilityRuntime {
    pub truth_write_service: Arc<dyn ObservationTruthWriteService>,
    pub read_service: Arc<dyn ObservationReadService>,
    pub inbound_event_service: Arc<dyn ObservationInboundEventService>,
    pub maintenance_service: Arc<dyn ObservationMaintenanceService>,
    pub publication_service: Arc<dyn ObservationPublicationService>,
    pub operation_context_factory: Arc<dyn ObservationOperationContextFactory>,
    pub availability_probe: Arc<dyn AdapterAvailabilityProbe>,
    pub api_entry: ValidatedApiEntryConfig,
    pub worker_entry: ValidatedWorkerEntryConfig,
    pub jobs_entry: ValidatedJobsEntryConfig,
    pub inbound_consumer_registrar: Arc<dyn InboundConsumerRegistrar>,
    pub job_schedule_registrar: Arc<dyn JobScheduleRegistrar>,
}

/// Builds one immutable runtime assembly from a validated config snapshot.
pub trait ObservabilityRuntimeBuilder {
    async fn build(
        &self,
        config: ValidatedObservabilityConfig,
    ) -> Result<BuiltObservabilityRuntime, RuntimeAssemblyError>;
}
```

`operation_context_factory`是Step 07既有application-owned context factory，不是第六个业务façade；API/worker/jobs构造existing service bundle时必须使用该同一assembly handle，不得自行生成actor/idempotency/source identity。`Arc`只表达共享immutable service、context factory或one-assembly registrar handle；不允许entry通过downcast取得concrete repository / adapter。`InboundConsumerRegistrar`、`JobScheduleRegistrar`及其object-safe boxed-Future签名以Step 07 R2为唯一definition。Registrar携带同一`ConfigBindingRef`对应的pre-resolved private slots，但公开面只有safe registrations和all-or-nothing `register_all`；不能lookup binding、resolve locator、调用adapter业务能力或返回private cause。

### 17.2 Startup-only runtime assembly error

`RuntimeAssemblyError` belongs to `observability-infra::runtime_builder`。它只表示process assembly尚未形成可调用runtime，不是application operation failure，也不是business rejection、Job report outcome、验收结果或evidence。

```rust
/// Body-free correlation identity for one startup assembly issue.
pub struct RuntimeAssemblyIssueRef(pub BodyFreeRef);

/// Startup-only failure returned before a complete runtime is exposed.
pub enum RuntimeAssemblyError {
    ConfigSourceUnavailable {
        issue_ref: RuntimeAssemblyIssueRef,
    },
    InvalidConfiguration {
        config_ref: Option<ConfigBindingRef>,
        issue_ref: RuntimeAssemblyIssueRef,
    },
    SensitiveReferenceUnavailable {
        config_ref: ConfigBindingRef,
        adapter_family: AdapterFamily,
        issue_ref: RuntimeAssemblyIssueRef,
    },
    StoreCompatibilityMismatch {
        config_ref: ConfigBindingRef,
        adapter_family: AdapterFamily,
        issue_ref: RuntimeAssemblyIssueRef,
    },
    AdapterConstructionFailed {
        config_ref: ConfigBindingRef,
        adapter_family: AdapterFamily,
        effect_binding_ref: Option<ExternalEffectBindingRef>,
        issue_ref: RuntimeAssemblyIssueRef,
    },
    RequiredCapabilityMissing {
        config_ref: ConfigBindingRef,
        adapter_family: AdapterFamily,
        effect_binding_ref: Option<ExternalEffectBindingRef>,
        phase: Option<ExternalEffectPhase>,
        issue_ref: RuntimeAssemblyIssueRef,
    },
    EntryBindingIncomplete {
        config_ref: ConfigBindingRef,
        issue_ref: RuntimeAssemblyIssueRef,
    },
}
```

| Variant | Detection boundary | Required behavior | Forbidden content / mapping |
|---|---|---|---|
| `ConfigSourceUnavailable` | raw source load before validated identity | no adapter/service construction；process startup fails | raw path/value、secret、provider body；不得映射`InvalidRequest` |
| `InvalidConfiguration` | parse/type/range/cross-field/redline/digest validation | reject complete candidate；no partial config | raw config dump、free-text secret、default-and-continue |
| `SensitiveReferenceUnavailable` | infra-only secret/endpoint resolution | required surface fails assembly；optional explicit adapter may remainUnavailable only when no enabled surface requires it | secret value、credential body、fake fallback |
| `StoreCompatibilityMismatch` | schema/atomic UoW/unique/CAS/fence capability check | no affected façade/Job registry | process mutex或best-effort write替代 |
| `AdapterConstructionFailed` | concrete adapter creation | exact family/binding remains unassembled；no partial handle escape | provider error body、endpoint、credential、downcast handle |
| `RequiredCapabilityMissing` | declared-vs-implementation phase capability comparison | enabled external surface fails assembly or remains explicitlydisabled according requirement class | capability谎报、Unsupported当negative success |
| `EntryBindingIncomplete` | final totality或stage 13 prepare/arm check for enabled command/query/consumer/job/route | corresponding composition root is not exposed；本次prepared registrations全部revoke/join | register partial route/loop/schedule then fail on first call；输出private registration cause |

`RuntimeAssemblyIssueRef`只是startup诊断关联标识，不是真实evidence alias、验收签署或run id。Safe diagnostic detail可以在后续Step 15定义日志/metric字段，但error本身不得携带raw source value。Builder必须返回完整`BuiltObservabilityRuntime`或一个error，不能返回partial runtime + warnings。Assembly完成后的repository/resolver/publisher/delivery错误继续使用Step 07/12 `ApplicationError`与formal outcome，不复用本enum。

### 17.3 Assembly order

| Order | Builder stage | Input | Output | Stop condition / invariant |
|---:|---|---|---|---|
| 1 | load raw sources | code baseline、file/env refs、entry selector | `RawObservabilityConfig` | source precedence由`04`固定；不记录raw value为evidence |
| 2 | parse / type / range | raw config | typed candidate | unknown key/type/range/overflow -> invalid config；不构造adapter |
| 3 | cross-field / profile / redline validate | typed candidate | compatible candidate | fake/runtime、store atomicity、limit、retention、lease/retry、route/capability不兼容 -> fail |
| 4 | establish config identity | explicit stable config revision + redacted normalized material | `ConfigBindingRef` / validated source summary | ref不是evidence alias/run id；secret/body不参与application-visible material |
| 5 | resolve sensitive refs in infra | endpoint / credential refs | adapter-private memory material | raw secret不得进入validated section、issue、report或service constructor |
| 6 | validate store schema / capability | store bindings、required revision | store/UoW constructors | schema mismatch、no atomic idempotency/result、no fence -> required surface fail |
| 7 | construct base technical adapters | store、clock、id、digest configs | repositories、UoW、clock/id、digest factories | fake/durable conformance assumptions不能靠config豁免 |
| 8 | construct external / entry technical adapters | resolver / publisher / delivery / inbound transport / actor-policy / scheduler bindings | concrete infra adapters + private entry handles + implementation descriptors | descriptor必须与declared mode/capability一致；schedule必须能转交完整existing Job request；no silent fallback |
| 9 | build availability registry | all adapter descriptors / safe probes | `AdapterAvailabilityProbe` implementation | snapshot body-free；health不等于operation success |
| 10 | assemble application services and context factory | Step 07 ports + validated policy inputs + executable parameters + safe external binding catalog | five application service handles + one existing operation-context factory with application-owned snapshot factory | application不持有infra config、transport/credential ref或concrete adapter；entry不得自行补actor/idempotency/source identity；catalog只含safe binding metadata |
| 11 | derive entry slices and prebuilt registrars | validated root + service availability + private entry handles | API slice；locator-free worker/jobs slices；two one-assembly registrars | exact raw-binding/private-slot/safe-item totality；slice不能扩大root权限或改protocol schema |
| 12 | return built runtime | services、probe、entry slices、registrars | `BuiltObservabilityRuntime` | assembled只表示wiring ready；registrar尚未证明root active、adapter healthy、event delivered或business accepted |
| 13 | entry-local composition | assigned façades + assigned slice + assigned registrar | routes；all-or-nothing registered Consumer set / Job schedule set；one-shot runners | entry只提交finite handler catalog并持有opaque handle；不得接收locator/private registry/repository/adapter/UoW；failure leaves zero exposed root |

### 17.4 Entry-local constructor boundary

| Root | Receives from infra | Performs locally | Must not perform |
|---|---|---|---|
| `api` | truth/read services、availability、API slice | static route registration、request limits、response/error mapping | adapter construction、env read、repository access |
| `worker` | inbound/publication services、availability、locator-free worker slice、inbound registrar | build exact 9-slot handler catalog；`register_all`；retain opaque registered set；receipt/ack mapping | read transport/actor-policy ref、construct/lookup adapter、direct publish/repository pair、domain transition |
| `jobs` | maintenance/publication services、availability、locator-free jobs slice、schedule registrar | build exact 9-slot Job handler catalog；`register_all`；retain opaque scheduled set；one-shot/report/exit mapping | read schedule ref、synthesize Job metadata/input、snapshot creation、target catalog、adapter/repository calls、current config reread onresume |

Stage 13先构造所有required handler，再以safe metadata做operation/producer/schema/enablement exact match，最后调用registrar的group registration。Registrar必须在返回`Ok`前完成prepare-all / totality / arm-all语义；任一失败撤销并等待本次全部item，不得让event/Job callback在失败root中存活。Consumer callback只收到bounded move-only envelope frame、safe mapped actor和finite metadata；Job callback只收到现有九类`ObservationJobRequest<T>`对应的complete invocation。Schedule不得补造actor、idempotency key、scope、target、cursor、consumer、input、真实run或evidence identity。

### 17.5 Runtime activation and reconfiguration

- P0 runtime config is immutable after assembly。Change requires a new validated assembly / process activation;本 Step不支持in-place adapter swap。
- New assembly can serve new requests only after all startup-required validation passes。Old assembly may drain existing requests according to `04` activation policy。
- Accepted Job is pinned to its `JobExecutionConfigSnapshot`;process restart / new config cannot mutate its plan。Resume must be able to resolve the persisted snapshot and compatible adapter binding revision。
- An external route / endpoint revision with ambiguous in-flight intent cannot be retired until the old binding can still probe / finalize or operations explicitly classifies it manual。Config rollback不得丢失old binding identity。
- Activation / rollback does not rewrite domain state、reservation、outbox payload、plan、intent、receipt或report。

## 18. Validation boundary matrix

### 18.1 从 raw source 到 external call 的验证边界

| Boundary | Input owner | Validator / code position | Validated output | Failure surface | Writes / side effects allowed |
|---|---|---|---|---|---|
| raw source load | deployment / config source | `infra::config::loader` | `RawObservabilityConfig` | `ConfigSourceUnavailable` | none；不得构造adapter或记录raw value |
| parse / type / range | infra raw config | `infra::config::parser` | typed candidate | `InvalidConfiguration` | none；unknown key/type/overflow不截断继续 |
| finite support type / static map | typed candidate | schema/family/operation/typed-ref validator | canonical enum sets + exact Consumer producer pairs | `InvalidConfiguration` / `EntryBindingIncomplete` | none；unknown/fallback/alias/duplicate不进入entry slice |
| profile / cross-field / redline | typed candidate | `infra::config::validator` | compatible candidate | `InvalidConfiguration` | none；不能用warning绕过fake/runtime、body-free、limit、retention或fence规则 |
| config identity / digest compatibility | compatible candidate | config identity + digest validator | `ConfigBindingRef`;`ValidatedObservabilityConfig` | `InvalidConfiguration` | only body-free startup issue ref；no business/evidence write |
| external target totality | validated `external` section + enabled surfaces | external catalog validator | unique typed subject mappings | `InvalidConfiguration` / `EntryBindingIncomplete` | none；不能把missing route延迟到first accepted mutation |
| secret / endpoint reference resolution | validated infra refs | infra secret boundary | adapter-private resolved material | `SensitiveReferenceUnavailable` | process memory only；不得写config snapshot/log/report |
| store schema / atomicity / fence capability | store binding + required revision | runtime builder capability gate | qualified repository/UoW constructors | `StoreCompatibilityMismatch` | startup probe only；不得写business row或自动migration |
| external implementation descriptor | binding + declared phases | adapter constructor / descriptor matcher | exact adapter registry entries | `AdapterConstructionFailed` / `RequiredCapabilityMissing` | optional safe health probe only；不得发送payload |
| safe catalog projection | infra target registry | runtime builder | `ExternalEffectBindingCatalog` | `InvalidConfiguration` | no external call；drop transport/credential/provider detail |
| application service assembly | Step 07 ports + safe policy/execution inputs/catalog | runtime builder | five service façades | assembly error；no partial runtime | constructors only；no domain transition or durable acceptance |
| entry-safe projection / registrar construction | validated entries + enabled service availability + resolved private entry handles | `infra::runtime_builder` technical registration seam | API slice；locator-free worker/jobs slices；prebuilt registrars | `EntryBindingIncomplete` | constructors only；no callback active；drop locator/material/private back-reference |
| entry group registration | assigned safe slice + registrar + finite handler catalog | worker/jobs composition root | opaque registered Consumer / schedule set | `EntryBindingIncomplete` | prepare/arm only；failure revoke/join all；zero business write/external payload |
| accepted event binding freeze | committed local change + safe catalog | truth/consumer/Job application service inside accepted UoW | outbox snapshot with exact `effect_binding_ref` | `AdapterDisabled` or `PersistenceInvariantViolation`;whole UoW rollback | local outbox append only；no publish in accepted UoW |
| Job start config freeze | Job DTO + execution parameters + safe catalog | publication/maintenance service start UoW | plan-embedded `JobExecutionConfigSnapshot` + digest | application validation/consistency failure；start rollback | reservation/plan/report/config snapshot only；no external call before commit |
| Job resume compatibility | stored plan/config snapshot | plan loader + digest validator | original executable snapshot | manual consistency failure | no relist、no current-config substitution、no external call |
| external effect preflight | stored snapshot/intent + plan config + token | application service + infra adapter registry | exact historical adapter destination | typed unavailable/manual or invariant failure | call only after token/binding/material equality and phase gate pass |
| new runtime activation | complete newly built runtime | process composition root | new assembly eligible fornew work | startup failure keeps old assembly policy | no old durable material rewrite；drain/rollback specifics deferred to`04` |

### 18.2 Required、disabled、degraded 与 unavailable 判定

| Situation | Assembly decision | Operation decision | Truth / durable material decision |
|---|---|---|---|
| startup-required store/clock/id/safety binding missing | fail complete runtime assembly | no façade call exists | zero business write |
| optional resolver explicitly disabled and no enabled startup-required flow depends on it | runtime may assemble with exactUnavailable state | resolver call returnsformal disabled/unavailable | existing snapshot/truth unchanged；gap/degraded write only through accepted flow |
| enabled Consumer lacks transport/schema/actor mapping | corresponding worker root is not returned | no consume/no ack | no local marker |
| publisher unavailable but durable outbox store qualified | write façade may accept and append exact snapshot；publisher root unavailable/disabled is visible | no publish until exact binding recovers | Pending/typed Failed snapshot retained；truth not rolled back |
| one handoff/export target unavailable | family aggregate may beDegraded；exact binding scope isUnavailable | onlythat consumer Job blocked/unavailable | unrelated targets and core truth continue |
| capability says probeUnsupported | assembly allowed only where matrix permits；availability at leastDegraded for ambiguous recovery | first call may run；ambiguous repeat stopsmanual | intent/outbox/report retained；Unsupported never becomesNot* |
| old binding cannot be resolved after activation | new work may use new binding；old work fails compatibility preflight | no reroute/no external call | old snapshot/intent/plan retained untilmanual classification or compatible binding restoration |
| health probe saysAvailable | no change to assembly truth | call still requires token/material/state guards | does not markPublished/Prepared/Delivered/Accepted |

### 18.3 R2 entry registration failure matrix

| Failure | Detection | Required result | Forbidden recovery |
|---|---|---|---|
| raw Consumer binding has no exact transport or actor-policy implementation | stage 8/11 descriptor match | `RequiredCapabilityMissing` or `EntryBindingIncomplete` before runtime exposure | safe item without private slot；first-delivery failure |
| safe Consumer item / private slot / handler operation differs | stage 11/13 totality | `EntryBindingIncomplete`;revoke/join whole group | route by free text、first matching handler、partial enabled subset |
| scheduler cannot carry complete existing Job request | stage 8 capability check | `RequiredCapabilityMissing`;no schedule registrar slot | synthesize metadata/input from config or schedule |
| scheduled operation absent from enabled Job set or handler catalog | stage 11/13 totality | `EntryBindingIncomplete`;zero active schedule | implicit enable、default handler、operator-only handler reused silently |
| prepare or arm fails after earlier item prepared | registrar group transaction | revoke/join every item from this attempt；`EntryBindingIncomplete` | return warning/partial handle；leave active callback |
| callback later returns Worker/Job failure | runtime invocation | existing receipt/ack/dead-letter or Job response/exit mapping | reuse startup error、rewrite business truth、leak private cause |

`Disabled` is an explicit configuration choice；`Unavailable` is a runtime inability；`Misconfigured` is validated/descriptor incompatibility；`Degraded` means a formal subset or uncertain recovery capability。These values must not be collapsed into one bool or used as business state transitions。

## 19. 前序回填与 definition/use 审计

### 19.1 本 Step 实际回填

| 前序 Step / 文件 | 实际修改 | 为什么必须在 Step 14 回填 | 当前结论 |
|---|---|---|---|
| Step 06 `03_ddd_step_06_object_contracts.md` | finite `AdapterFamily`;application-owned availability scope/state；digest value family；plan内完整config snapshot；五类token增加`effect_binding_ref` | config/adapter type必须有低依赖owner，plan/token不能只在本Step文字出现 | done |
| Step 07 `03_ddd_step_07_trait_port_adapter_contracts.md` | outbox stored snapshot增加binding；availability probe接受exact scope；publisher/delivery adapter按old binding解析且禁止fallback | port输入必须携带实现adapter选择所需的opaque identity | done |
| Step 08 `03_ddd_step_08_protocol_contracts.md` | `ObservationOutboxSnapshotInput`增加binding；明确它不是public transport字段 | accepted flow需要可构造stored snapshot，同时不能泄漏deployment route | done |
| Step 09 `03_ddd_step_09_function_flows.md` | accepted mutation按event解析binding；publisher token复制snapshot ref；handoff/export Job start按consumer冻结binding/config snapshot | 字段必须有唯一来源、冻结时点与调用顺序 | done |
| Step 10 `03_ddd_step_10_state_matrix.md` | no schema/state change | binding是coordination/config identity，不新增业务状态或`Failed -> Pending` | verified_no_change |
| Step 11 `03_ddd_step_11_persistence_transaction_consistency.md` | outbox/intent/plan config landing；transaction ordering；PCI；recovery；区分publication snapshot与四类intent store | config切换后的resume必须从durable source恢复exact destination | done |
| Step 12 `03_ddd_step_12_error_recovery.md` | no runtime taxonomy change；startup-only error留在infra | assembly failure不应污染public/application operation error；existing unavailable/manual/consistency classes足够 | verified_no_change |
| Step 13 `03_ddd_step_13_concurrency_idempotency.md` | plan digest纳入config snapshot；五类token、总幂等、重入矩阵和测试切口纳入binding | stable token若不固定destination revision，same-token retry仍可能发到new target | done |

### 19.2 `19.R2 / CFG-BLK-09-01` targeted definition/use repair

| File / contract | R2 change | Preserved boundary | Conclusion |
|---|---|---|---|
| Step 05 module contract | registrar/raw binding/handler catalog/opaque handle owner唯一化 | seven crates、dependency direction、truth owner不变 | done |
| Step 07 technical seam | object-safe registrar、finite Consumer/Job handler catalog、bounded invocation carrier、group registration | application port/façade、public DTO、error taxonomy不变 | done |
| Step 14 current file | raw binding保持infra-only；validated slice使用safe item；BuiltRuntime新增existing context-factory handle与two registrars；stage count仍13 | no new key/default/source/business protocol/state/store | done |
| Step 17 handoff | 增加exact files、definition/use和planned test closure | no phase/boundary/commit/evidence fabrication | done |
| formal `03` | 同步§5/§6/§13/§15/§16的唯一code truth | 60 protocol、27 state、UoW/idempotency/durable schema不变 | done_in_19_R2 |
| current `04` Step08/09 | Step08明确opaque registrar为allowed safe capability；Step09重审D05/D21 | formal `04`仍只在Step15装配；Step10仍需用户确认 | consumed_and_pass |

R2没有修改Step 08 public protocol文件，因为existing九类Consumer envelope和九类`ObservationJobRequest<T>`已经完整，新增类型只是infra-entry internal dispatch carrier。也没有修改Step 09 function flow、Step 10 state、Step 11 persistence、Step 12 business recovery或Step 13 idempotency：registration发生在operation开始前，不创建business UoW、reservation、state、row、outbox或Job identity。

正式`03-详细设计.md`随后已由Step19 `19.R2`同步§5/§6/§13/§15/§16并重跑全文门禁。以上仍是闭合definition/use的最小同步，不重开Step 06~13的业务scope、状态机、事务owner或幂等key，也不表示实现或测试完成。

### 19.3 五类 external token 传播链

| Effect phase | Binding selection point | Durable source | Token rule | Adapter resolution | Rotation / recovery rule |
|---|---|---|---|---|---|
| Publication | accepted mutation按`OutboundEvent(event_name)` lookup | `ObservationOutboxPayloadSnapshot.effect_binding_ref`；publication plan config snapshot | token逐字段复制binding/event/outbox/payload digest/schema | infra registry按token ref解析publisher + route | new route只影响new snapshot；old Pending/Failed/Unknown必须old ref |
| Handoff preparation | Job start按`ReportConsumer(consumer_ref)` lookup | plan config snapshot + preparation intent | token含intent/binding/handoff/input/consumer/material digest | handoff registry exact binding | unknown先same-token probe；old target不可用则manual |
| Handoff delivery | matching preparation已local finalize | delivery intent copies preparation binding | delivery token不得换binding/preparation | same historical handoff adapter target | target rotation不重定向existing preparation |
| Export preparation | Job start按`PeripheralConsumer(consumer_ref)` lookup | plan config snapshot + export preparation intent | token含intent/binding/preparation/view/consumer/material digest | export registry exact binding | unknown/unsupported保持indeterminate/manual |
| Export delivery | matching export preparation已local finalize | delivery intent copies export preparation binding | delivery token不得换binding/package identity | same historical export target | no current-default fallback；known delivered只local finalize |

All five token families carry only body-free refs/digests。`effect_binding_ref` identifies destination/idempotency namespace revision but does not expose endpoint、topic、path、credential或provider response。Credential rotation may preserve the ref only when destination and external idempotency namespace remain identical and old token remains resolvable；otherwise create a new ref。

### 19.4 Surface coverage

| Surface family | Count | Config / binding closure |
|---|---:|---|
| Command | 16 | enabled set、boundary/safety policy、accepted outbox binding totality；config不改变DTO/schema/idempotency scope |
| Query | 14 | page/read timeout/visibility policy；strict no-write，availability probe不触发refresh/repair |
| Inbound Consumer | 9 | exact producer/transport/schema/actor mapping；disabled不consume/ack/write |
| Outbound Event | 12 | enabled producer flow到exact event target total mapping；snapshot冻结binding和payload |
| Operations Job | 9 | each required frozen binding listed in§9.5；resume loadsplan snapshot，schedule不成为input truth |
| Resolver / publisher / delivery ports | 8 external families / 5 effect phases | timeout、retry authority、formal degradation、capability和fake parity均有binding |

### 19.5 五协议族 typed binding / snapshot / intent / token closure index

本表是 Step 14 的实现审计入口。表中的 `binding source` 指向 validated
configuration 或 immutable local material；它不允许实现者直接读取 raw config、endpoint、topic、credential
或 provider response。`not_applicable` 是显式 no-write / no-external-effect 结论，不得由实现改成隐式默认值。

| 协议族 | 数量 | Typed binding source | Freeze / persistence point | Intent / token use | Old-binding and no-write rule | 当前结论 |
|---|---:|---|---|---|---|---|
| Command C01-C16 | 16 | API static route + validated boundary/safety policy；需要外部 effect 的 C07/C14 从 typed subject catalog 解析 exact `ExternalEffectBindingRef` | accepted mutation 在同一 local UoW 冻结 outbox snapshot；C07/C14 的 intent 在对应 Job/phase start 冻结 | C07/C14 后续 handoff/export phase 使用 immutable intent/token；其他 Command 不凭配置直接外呼 | route/config 不能改 DTO、digest、truth owner 或 Query boundary；old snapshot/intent 不读 current route | `pass_with_affected_open`；UoW/result/secondary owner affected 保留 |
| Query Q01-Q14 | 14 | API static query route + validated page/read timeout/visibility policy + exact availability read scope | 不创建 plan、config snapshot、intent、token 或 write UoW；每次读取 current committed surface | `not_applicable`；availability read 不能触发 refresh/rebuild/repair | raw config 不进入 query；disabled/stale/unavailable 只映射 read surface，不写 marker、gap、audit 或 stored result | `pass_with_affected_open`；query carrier/visibility affected 保留 |
| Inbound Consumer I01-I09 | 9 | worker static consumer binding：exact producer family、schema set、system actor mapping、transport-safe binding ref | startup 只组装 locator-free handler；每次 envelope 使用 validated binding，local receipt/marker 在 accepted UoW 落地 | 默认不创建 external effect token；若协议显式产生 local outbox，沿同一 accepted snapshot binding 规则；不由 consumer 选 target | unknown schema/family 在 payload 前 fail closed；disabled 不 consume/ack/write；current route 不替换历史 source/event identity；I05 payload/binding affected 保留 | `pass_with_affected_open`；I05、consumer action/outbox surface affected 保留 |
| Outbound Event E01-E12 | 12 | accepted source mutation 按 typed event catalog 解析 exact `ExternalEffectBindingRef`；infra 仅按 ref 解析 concrete adapter | typed encoder 在 accepted local UoW 冻结 immutable payload snapshot、schema version、binding；J01 start 冻结 publication config | J01 使用 `ObservationPublicationToken(effect_binding_ref,event_ref,outbox_ref,payload_digest,schema_version)`；每次 retry 复用同 token | new route 只影响 new snapshot；old Pending/Failed/Unknown 必须解析 old ref；payload 缺失/损坏禁止从 current truth 重建 | `pass_with_affected_open`；producer schema/binding and external phase affected 保留 |
| Operations Job J01-J09 | 9 | jobs locator-free entry + validated job execution parameters + exact consumer/target catalog | start UoW 冻结 relevant `JobExecutionConfigSnapshot`、canonical plan/work-set、item binding；resume 只加载原 snapshot | J01 publication token；J07/J08 handoff/export preparation/delivery intent tokens；其他 Job 只使用 local plan/claim material | schedule 只触发 Job；resume 不热读 current config、不 relist、不换 target；old binding unresolved -> manual/consistency，不 fallback | `pass_with_affected_open`；H13/report-ref/external-phase affected 保留 |
| **Total** | **60** | **16 + 14 + 9 + 12 + 9** 个协议均有 typed binding source 或显式 no-write boundary | **accepted UoW / Job start / phase intent 的冻结点均已登记** | **publication、handoff、export 的 token identity 与 binding 传播已登记** | **无 raw config 穿透、无 current-route 重定向、无 telemetry/health 代替 binding truth** | **`60/60 recorded_with_affected_open`；`0/60` 无条件完成** |

本表不关闭 inherited affected：`S08-E-I05-PAYLOAD-SCHEMA-01`、
`S08-E-I05-PRODUCER-EVENT-BINDING-01`、`R06.6-F2-H13-UPSTREAM`、
`R06-F-AFFECT-UOW-01`、`S08-RECOVERY-CLASS-OWNER-01`、
`R07-EXTERNAL-PHASE-LINK-01`、`R07-EXTERNAL-PHASE-RETRY-ACCOUNTING-01`、
`S08-CONSUMER-OUTBOX-SURFACE-01`、`S08-CONSUMER-INDETERMINATE-COMPLETION-01`、
`S08-JOB-REPORT-REF-OWNER-01`、`S08-M1-SECONDARY-TYPE-OWNER-01` 与
`03-RPR-S09-PER-FLOW` 仍由指定 owner/Step 承接。`04` 只能继续定义 key、format、source precedence、numeric
values、secret provider、retention physical storage 和 change audit，不能反向改写本表的 ownership、snapshot、intent、token、probe 或 no-write 语义。

## 20. 后续承接边界

| 后续位置 | 必须承接 | 不得改写 |
|---|---|---|
| Step 15 可观测性与审计埋点 | startup stage/error variant、config ref、family、safe binding ref、timeout/retry/probe/finalize signal；字段必须redacted/body-free | telemetry不是config truth、retry authority、adapter health proof、business truth、evidence或signoff；不得记录raw endpoint/secret/body |
| Step 16 测试切口 | profile/mode validation、redline、digest golden vector、catalog totality、entry isolation、registrar totality/revoke/no-locator/no-synthesized-request、store capability、per-binding availability、snapshot/intent/plan persistence、route rotation、old-binding recovery、Unknown/Unsupported | 不得声称测试已执行；fake/controlled/durable必须共享formal outcome和binding invariants |
| Step 17 实施承接 | config/runtime/entry-registration module files、builder stage、adapter registry、finite handler catalog、snapshot factory、repository schema impact和implementation precondition | 不创建实现commit/run/evidence；目标仓不存在仍是implementation kickoff gate |
| Step 18 风险 | external capability真实性、old binding retention、secret rotation、activation rollback、missing sibling integration | 不把未选产品或数值猜测写成已确认事实 |
| Step 19 正式`03`装配 | 把本文件§8~§20压缩到正式§13并保留校准来源 | 不在正式正文新增本Step未确认的key/value/provider |
| `04-配置设计.md` full-restart | exact key、format、source precedence、env mapping、secret provider、numeric defaults/ranges、profile override、activation/rollback、old-binding retention、schedule与change audit | 不改变本Step ownership、typed shape、no-invariant-switch、snapshot/token/probe语义 |
| `05/06/07` | tests/acceptance/implementation boundaries eventually trace to config/error/binding contracts | 不伪造执行结果、验收签署、commit、run id或evidence alias |

本节只是handoff inventory，不表示已进入Step 16、Step 17或`04`。本轮用户已授权继续 M2；完成本 Step 后只进入
Step 15，Step 15 完成后必须停在 Step 16 前。正式 `03` 仍冻结到 Step 19。

## 21. 正式文档回填草稿

正式`03-详细设计.md`只能在Step 19装配。其§13至少保留下列结构和粒度：

```md
## 13. 配置引用与外部依赖绑定

> 校准来源：
> - `design-calibration/03_ddd_step_14_config_external_binding.md`
>
> 延伸阅读：
> - 建议继续阅读中间产物的typed config、external binding、runtime builder、validation matrix与前序回填审计。

### 13.1 配置ownership与typed section
写入raw/validated/job snapshot三层、模块读取矩阵、禁止配置化边界和digest compatibility。

### 13.2 配置引用表
保留runtime/boundary/store、safety/projection/retention、execution/external/entry三组表；每项有类型、读取模块、默认/缺失行为和`04`位置。

### 13.3 外部依赖与adapter binding
写入store/UoW、resolver、publisher/handoff/export、availability的binding、timeout/retry/degradation和capability phase。

### 13.4 External effect binding与Job snapshot
写入safe catalog、五类token传播、outbox/intent/plan durable landing、old-binding retention、no current-route fallback。

### 13.5 Cross-repo dependency
只列`core-contracts` compile-time path dependency；其余按event/resolver/handoff/export/API/fake表达。

### 13.6 Runtime builder与validation
写入complete-or-error assembly、startup-only error、raw binding infra-only、locator-free entry slice、prebuilt registrar、all-or-nothing registration、activation与validation boundary matrix。
```

正式正文不能压缩为“配置从环境变量读取、adapter通过DI注入”，也不能恢复旧Step 14的产品化对象、fake默认成功、entry读raw config、current route重定向old token或只按family布尔健康判断target。

## 22. 待确认事项与 blocker

| 项目 | 当前结论 | 是否阻塞 Step 14 |
|---|---|---|
| 当前正式`00/01/02` truth/ownership与本Step冲突 | 未发现新的冲突；Observability仍只拥有观测/审计投影和technical coordination，不拥有source/business truth | 否 |
| 旧正式`03`、旧Step 14、README | historical material；旧schema/product/自动门禁不继承 | 否 |
| exact key、duration、limit、retention、cron、parallelism、source precedence | 由full-restart `04`定义；当前已固定type/owner/failure/redline | 否 |
| external provider / dashboard / GRC / archive产品尚未选择 | 保持product-neutral Endpoint/Controlled binding；不预支SDK或Cargo dependency | 否 |
| 部分runtime sibling repo当前未发现 | formal ports/events/fakes可继续；real integration保持pending | 否，不阻塞design |
| `/home/aris/Projects/quantalithos-observability`当前未发现 | Step 17 / `07` implementation kickoff precondition | 否，不阻塞当前design |
| `core-contracts`本地path/类型现实基线 | path/package已核实；不存在`RequestDigest`/`DigestSummary`，故由`observability-contracts::refs`拥有本地digest family | 否 |
| old external binding retention的物理存储/secret provider | `04`/implementation必须定义；当前语义已固定为active/ambiguous material期间不可丢失 | 否 |
| 真实实现commit、run id、evidence alias、测试结果、验收签署 | 本Step不需要且禁止伪造 | 否 |

当前未发现新的上游 blocker。inherited upstream/internal affected 仍开放；若后续发现必须新增non-core compile-time sibling dependency、配置开关改变truth owner/state/transaction，必须回开上游设计，不得在`04`或实现中私补。

## 23. 最终自检

| 检查项 | 当前结论 |
|---|---|
| 是否读取Step 14 SOP、书写规范5.13、Step 05/07/13、正式01/02和cross-repo输入 | pass |
| 是否把旧Step 14降级为historical material并按full-restart重建 | pass |
| 是否回答SOP八个问题 | pass，§5 |
| 是否输出完整配置引用表 | pass，§10~§12 |
| 是否输出store/resolver/publisher/handoff/export外部依赖绑定表 | pass，§13 |
| 是否输出cross-repo Rust dependency表、本地path/Cargo写法和不可用处理 | pass，§16 |
| 6个downstream-audit support type是否有唯一definition并在config侧lossless使用 | pass；Step 06 owner + §9.4 / §15.1 / §18.1 use contract，未在本Step复制enum定义 |
| raw config是否只在infra，entry/application/domain是否无raw/secret/target catalog | pass，§8/§9/§15/§17 |
| typed config、默认/缺失、读取点、redline是否可落码 | pass，§9~§12 |
| timeout/retry/degraded/disabled/capability是否逐family/phase闭合 | pass，§13/§14/§18 |
| Job config snapshot是否随plan持久化且resume不读current config | pass，§9.5/§18/§19 |
| publication/handoff/export五类token是否固定binding且old route不可重定向 | pass，§15/§18/§19 |
| availability是否支持exact target binding且不成为operation success | pass，§8.3/§13/§18 |
| startup-only error是否与runtime/public error分离 | pass，§17.2 |
| raw binding -> safe item -> registrar private slot -> finite handler -> opaque handle是否可落码且无locator/material回流 | pass_after_R2，§9.4 / §17 / §18.3 / §19.4 |
| 16 Command/14 Query/9 Consumer/12 Outbound/9 Job binding surface是否覆盖 | pass，§19.4 |
| Step 06/07/08/09/11/13实际回填是否记录且Step 10/12无伪改动 | pass，§19.1 |
| 是否保持body-free、no truth writeback、Query no-write、no signoff/no fake evidence | pass_with_affected_open |
| targeted repair是否只要求同步formal `03`而未进入新Step | pass；R2由current `04` Step09触发，formal同步归Step19 repair record |
| 是否伪造实现/测试/验收事实 | no |
| Markdown fence、definition/use、命名/数量、trailing whitespace、`git diff --check` | pass；相关7个Step文件fence均为偶数，binding/token/plan/availability定义使用扫描闭合，无尾随空白，`git diff --check`无输出 |
| 是否发现新的上游blocker | 未发现；inherited affected 仍开放 |

## 24. 门禁

| gate_status | gate_reason | next_allowed_action |
|---|---|---|
| `pass_with_affected_open` | typed config/binding、60协议覆盖、snapshot/intent/token传播、runtime validation 与 old-binding/no-write边界已形成；inherited affected 未关闭，不能声明已被`04`消费或实现可用 | `continue_M2_step_15;stop_after_step_15_before_step_16` |
