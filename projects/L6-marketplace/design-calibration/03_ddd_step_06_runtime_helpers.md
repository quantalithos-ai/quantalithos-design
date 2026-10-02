# Step6 稳定application/infra/entry对象小循环

## 思考、诊断与取舍

能力：可信上下文authority、application通用runner/typedfacade、runtime资格与entry decode。不能把Core metadata字段复制到domain，也不能使用native async trait的dyn对象；选择generic P:MarketPorts单一注入，CoreContextRecord保存唯一Core字段，domain引用localrecordref。infra实际连接字段与config默认留Step14，但稳定配置/资格carrier现在闭口；拒绝所有helper机械延期与fake生产兜底。

## capability映射与闭口决策

| 模块 | 功能 | 对象 | 当前闭口 / 后续 |
|---|---|---|---|
| application | Core context、replay、三Entry | CoreContextRecord/ExecutionResult/CommandRunner/JobRunner/ReadFacade/MarketplaceApplication | 字段与泛型依赖闭口；Step7 typedports、Step8 49methods |
| infra | 运行装配/owner资格 | RuntimeConfig/AdapterBinding/RuntimeAssembly | 稳定字段闭口；Step14具体config defaults/secret加载 |
| api | 同步可信入口 | ApiCommandEntry/ApiQueryEntry | typed单Envelope，不生成businesskey/trace；Step8 routes |
| worker | 12内部job | MarketWorkerContext/WorkerJobEntry | key源Core request，fence单authority；Step9claim/save/report |
| web | UI异步姿态 | WebAsyncSurface | contracts镜像，非truthstate；无实现 |

### ContextMetadata

```rust
/// Represents the finite ContextMetadata surface without owning upstream truth.
pub enum ContextMetadata {
    /// Carries Command with core_contracts::metadata::CommandMetadata.
    Command(core_contracts::metadata::CommandMetadata),
    /// Carries Worker with core_contracts::metadata::RequestMetadata.
    Worker(core_contracts::metadata::RequestMetadata),
}
```

| 变体 | Rustdoc语义 | 来源 / 去向 |
|---|---|---|
| Command(core_contracts::metadata::CommandMetadata) | Carries Command. | 唯一Core metadata存储，query只请求内临时Context不持久化、不写audit |
| Worker(core_contracts::metadata::RequestMetadata) | Carries Worker. | 唯一Core metadata存储，query只请求内临时Context不持久化、不写audit |

归属：application；唯一Core metadata存储，query只请求内临时Context不持久化、不写audit


### CoreContextRecord

```rust
/// Carries CoreContextRecord with explicit sources and no upstream body.
pub struct CoreContextRecord {
    /// Carries context_ref; see the source and invariant table.
    pub context_ref: MarketContextRef,
    /// Carries actor; see the source and invariant table.
    pub actor: core_contracts::actor::ActorContext,
    /// Carries metadata; see the source and invariant table.
    pub metadata: ContextMetadata,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| context_ref | `MarketContextRef` | 同acceptedUoW存入OperationStore；domain ActorReference/SharedMetadataReference指向此record。不可另造key/trace/actorID；读到缺record=IntegrityFailure |
| actor | `core_contracts::actor::ActorContext` | 同acceptedUoW存入OperationStore；domain ActorReference/SharedMetadataReference指向此record。不可另造key/trace/actorID；读到缺record=IntegrityFailure |
| metadata | `ContextMetadata` | 同acceptedUoW存入OperationStore；domain ActorReference/SharedMetadataReference指向此record。不可另造key/trace/actorID；读到缺record=IntegrityFailure |

归属：application；同acceptedUoW存入OperationStore；domain ActorReference/SharedMetadataReference指向此record。不可另造key/trace/actorID；读到缺record=IntegrityFailure


### MarketWorkerContext

```rust
/// Carries MarketWorkerContext with explicit sources and no upstream body.
pub struct MarketWorkerContext {
    /// Carries actor; see the source and invariant table.
    pub actor: core_contracts::actor::ActorContext,
    /// Carries request; see the source and invariant table.
    pub request: core_contracts::metadata::RequestMetadata,
    /// Carries fence; see the source and invariant table.
    pub fence: DispatchFence,
    /// Carries cursor; see the source and invariant table.
    pub cursor: Option<MarketSourceCursor>,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| actor | `core_contracts::actor::ActorContext` | worker-internal。key唯一request.idempotency_key必须Some；workref唯一fence.work_ref，请求work_ref必须相等；cursor是本地maintenance input不与querypage混用；job actor仍formal scope |
| request | `core_contracts::metadata::RequestMetadata` | worker-internal。key唯一request.idempotency_key必须Some；workref唯一fence.work_ref，请求work_ref必须相等；cursor是本地maintenance input不与querypage混用；job actor仍formal scope |
| fence | `DispatchFence` | worker-internal。key唯一request.idempotency_key必须Some；workref唯一fence.work_ref，请求work_ref必须相等；cursor是本地maintenance input不与querypage混用；job actor仍formal scope |
| cursor | `Option<MarketSourceCursor>` | worker-internal。key唯一request.idempotency_key必须Some；workref唯一fence.work_ref，请求work_ref必须相等；cursor是本地maintenance input不与querypage混用；job actor仍formal scope |

归属：contracts；worker-internal。key唯一request.idempotency_key必须Some；workref唯一fence.work_ref，请求work_ref必须相等；cursor是本地maintenance input不与querypage混用；job actor仍formal scope


### CommandEnvelope<T>

```rust
/// Carries CommandEnvelope<T> with explicit sources and no upstream body.
pub struct CommandEnvelope<T> {
    /// Carries body; see the source and invariant table.
    pub body: T,
    /// Carries actor; see the source and invariant table.
    pub actor: core_contracts::actor::ActorContext,
    /// Carries meta; see the source and invariant table.
    pub meta: core_contracts::metadata::CommandMetadata,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| body | `T` | actor可信gateway注入，不接JSON用户自证；body无重复actor/key/trace/page，missing key拒绝写 |
| actor | `core_contracts::actor::ActorContext` | actor可信gateway注入，不接JSON用户自证；body无重复actor/key/trace/page，missing key拒绝写 |
| meta | `core_contracts::metadata::CommandMetadata` | actor可信gateway注入，不接JSON用户自证；body无重复actor/key/trace/page，missing key拒绝写 |

归属：contracts；actor可信gateway注入，不接JSON用户自证；body无重复actor/key/trace/page，missing key拒绝写


### QueryEnvelope<T>

```rust
/// Carries QueryEnvelope<T> with explicit sources and no upstream body.
pub struct QueryEnvelope<T> {
    /// Carries body; see the source and invariant table.
    pub body: T,
    /// Carries actor; see the source and invariant table.
    pub actor: core_contracts::actor::ActorContext,
    /// Carries meta; see the source and invariant table.
    pub meta: core_contracts::metadata::QueryMetadata,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| body | `T` | page/consistency唯一meta；Query无write-key依赖、不持久context |
| actor | `core_contracts::actor::ActorContext` | page/consistency唯一meta；Query无write-key依赖、不持久context |
| meta | `core_contracts::metadata::QueryMetadata` | page/consistency唯一meta；Query无write-key依赖、不持久context |

归属：contracts；page/consistency唯一meta；Query无write-key依赖、不持久context


### JobEnvelope<T>

```rust
/// Carries JobEnvelope<T> with explicit sources and no upstream body.
pub struct JobEnvelope<T> {
    /// Carries body; see the source and invariant table.
    pub body: T,
    /// Carries context; see the source and invariant table.
    pub context: MarketWorkerContext,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| body | `T` | internaltyped worker only；meta frozenperlocaljoboperation，跨lease新operationkey但external originalintent固定 |
| context | `MarketWorkerContext` | internaltyped worker only；meta frozenperlocaljoboperation，跨lease新operationkey但external originalintent固定 |

归属：contracts；internaltyped worker only；meta frozenperlocaljoboperation，跨lease新operationkey但external originalintent固定


### ReplayDisposition

```rust
/// Represents the finite ReplayDisposition surface without owning upstream truth.
pub enum ReplayDisposition {
    /// Fresh is a local classification.
    Fresh,
    /// OriginalReplayed is a local classification.
    OriginalReplayed,
}
```

| 变体 | Rustdoc语义 | 来源 / 去向 |
|---|---|---|
| Fresh | Fresh is a local classification. | 瞬时返回分类无独立生命周期；replay非domain transition，原payload不增加/改写replayed字段 |
| OriginalReplayed | OriginalReplayed is a local classification. | 瞬时返回分类无独立生命周期；replay非domain transition，原payload不增加/改写replayed字段 |

归属：application；瞬时返回分类无独立生命周期；replay非domain transition，原payload不增加/改写replayed字段


### ExecutionResult<T>

```rust
/// Carries ExecutionResult<T> with explicit sources and no upstream body.
pub struct ExecutionResult<T> {
    /// Carries value; see the source and invariant table.
    pub value: T,
    /// Carries disposition; see the source and invariant table.
    pub disposition: ReplayDisposition,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| value | `T` | originalvalue完全原值；currentactor/disclosure先检查，再存储lookup；headers可说明replay，不修改payload |
| disposition | `ReplayDisposition` | originalvalue完全原值；currentactor/disclosure先检查，再存储lookup；headers可说明replay，不修改payload |

归属：application；originalvalue完全原值；currentactor/disclosure先检查，再存储lookup；headers可说明replay，不修改payload


### CommandRunner<P>

```rust
/// Carries CommandRunner<P> with explicit sources and no upstream body.
pub struct CommandRunner<P> {
    /// Carries ports; see the source and invariant table.
    pub ports: P,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| ports | `P` | P:MarketPorts generic，nativeasynctraits不用dyn；scope/key/fingerprint/replay/UoW共同outerprotocol，不能替代49flow |

归属：application；P:MarketPorts generic，nativeasynctraits不用dyn；scope/key/fingerprint/replay/UoW共同outerprotocol，不能替代49flow


### JobRunner<P>

```rust
/// Carries JobRunner<P> with explicit sources and no upstream body.
pub struct JobRunner<P> {
    /// Carries ports; see the source and invariant table.
    pub ports: P,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| ports | `P` | P:MarketPorts，同workclaim/原intent/完整report守卫，外call不得在DBtx |

归属：application；P:MarketPorts，同workclaim/原intent/完整report守卫，外call不得在DBtx


### ReadFacade<P>

```rust
/// Carries ReadFacade<P> with explicit sources and no upstream body.
pub struct ReadFacade<P> {
    /// Carries ports; see the source and invariant table.
    pub ports: P,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| ports | `P` | P:MarketPorts，currentScope和readonlytyped读取；不save/refresh/schedule |

归属：application；P:MarketPorts，currentScope和readonlytyped读取；不save/refresh/schedule


### MarketplaceApplication<P>

```rust
/// Carries MarketplaceApplication<P> with explicit sources and no upstream body.
pub struct MarketplaceApplication<P> {
    /// Carries ports; see the source and invariant table.
    pub ports: P,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| ports | `P` | P:MarketPorts；公开49显式typed methods在Step8；不接受JSON selector反射，entry仅此facade |

归属：application；P:MarketPorts；公开49显式typed methods在Step8；不接受JSON selector反射，entry仅此facade


### RuntimeConfig

2026-10-02 binding细化：完整代码读取/缺失/默认/entry与assembly见[Step14§7](03_ddd_step_14_config_bindings.md)。本对象只validatedrefs，raw文件配置和秘密不入domain；Bound必须正式资格，不由配置自称。validate_runtime_config/assemble_runtime为infra纯装配callable，不是新business protocol。

```rust
/// Carries RuntimeConfig with explicit sources and no upstream body.
pub struct RuntimeConfig {
    /// Carries api_bind; see the source and invariant table.
    pub api_bind: std::net::SocketAddr,
    /// Carries postgres_config_ref; see the source and invariant table.
    pub postgres_config_ref: String,
    /// Carries sdk_profile_ref; see the source and invariant table.
    pub sdk_profile_ref: String,
    /// Carries owner_bindings; see the source and invariant table.
    pub owner_bindings: Vec<AdapterBinding>,
    /// Carries worker_batch_limit; see the source and invariant table.
    pub worker_batch_limit: u32,
    /// Carries lease_millis; see the source and invariant table.
    pub lease_millis: u64,
    /// Carries default_locale; see the source and invariant table.
    pub default_locale: DisplayLocale,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| api_bind | `std::net::SocketAddr` | 来自validated config loader：batch>0、lease>0，正式默认/SLO待Step14+Q-MP01；生产bind不继承demo9090/0.0.0.0；secret只外部configref，不日志/response |
| postgres_config_ref | `String` | 来自validated config loader：batch>0、lease>0，正式默认/SLO待Step14+Q-MP01；生产bind不继承demo9090/0.0.0.0；secret只外部configref，不日志/response |
| sdk_profile_ref | `String` | 来自validated config loader：batch>0、lease>0，正式默认/SLO待Step14+Q-MP01；生产bind不继承demo9090/0.0.0.0；secret只外部configref，不日志/response |
| owner_bindings | `Vec<AdapterBinding>` | 来自validated config loader：batch>0、lease>0，正式默认/SLO待Step14+Q-MP01；生产bind不继承demo9090/0.0.0.0；secret只外部configref，不日志/response |
| worker_batch_limit | `u32` | 来自validated config loader：batch>0、lease>0，正式默认/SLO待Step14+Q-MP01；生产bind不继承demo9090/0.0.0.0；secret只外部configref，不日志/response |
| lease_millis | `u64` | 来自validated config loader：batch>0、lease>0，正式默认/SLO待Step14+Q-MP01；生产bind不继承demo9090/0.0.0.0；secret只外部configref，不日志/response |
| default_locale | `DisplayLocale` | 来自validated config loader：batch>0、lease>0，正式默认/SLO待Step14+Q-MP01；生产bind不继承demo9090/0.0.0.0；secret只外部configref，不日志/response |

归属：infra；来自validated config loader：batch>0、lease>0，正式默认/SLO待Step14+Q-MP01；生产bind不继承demo9090/0.0.0.0；secret只外部configref，不日志/response


### DisplayLocale

```rust
/// Represents the finite DisplayLocale surface without owning upstream truth.
pub enum DisplayLocale {
    /// En is a local classification.
    En,
    /// Zh is a local classification.
    Zh,
}
```

| 变体 | Rustdoc语义 | 来源 / 去向 |
|---|---|---|
| En | En is a local classification. | defaultEn，display-only，无key/ref/业务state变化 |
| Zh | Zh is a local classification. | defaultEn，display-only，无key/ref/业务state变化 |

归属：contracts；defaultEn，display-only，无key/ref/业务state变化


### AdapterKind

```rust
/// Represents the finite AdapterKind surface without owning upstream truth.
pub enum AdapterKind {
    /// Source is a local classification.
    Source,
    /// Publisher is a local classification.
    Publisher,
    /// Material is a local classification.
    Material,
    /// Governance is a local classification.
    Governance,
    /// Scope is a local classification.
    Scope,
    /// Receiver is a local classification.
    Receiver,
    /// Notice is a local classification.
    Notice,
    /// Observation is a local classification.
    Observation,
}
```

| 变体 | Rustdoc语义 | 来源 / 去向 |
|---|---|---|
| Source | Source is a local classification. | 无Billing/Archive/Bus slot |
| Publisher | Publisher is a local classification. | 无Billing/Archive/Bus slot |
| Material | Material is a local classification. | 无Billing/Archive/Bus slot |
| Governance | Governance is a local classification. | 无Billing/Archive/Bus slot |
| Scope | Scope is a local classification. | 无Billing/Archive/Bus slot |
| Receiver | Receiver is a local classification. | 无Billing/Archive/Bus slot |
| Notice | Notice is a local classification. | 无Billing/Archive/Bus slot |
| Observation | Observation is a local classification. | 无Billing/Archive/Bus slot |

归属：infra；无Billing/Archive/Bus slot


### AdapterBindingDisposition

```rust
/// Represents the finite AdapterBindingDisposition surface without owning upstream truth.
pub enum AdapterBindingDisposition {
    /// Bound is a local classification.
    Bound,
    /// Blocked is a local classification.
    Blocked,
    /// Disabled is a local classification.
    Disabled,
}
```

| 变体 | Rustdoc语义 | 来源 / 去向 |
|---|---|---|
| Bound | Bound is a local classification. | 启动时资格分类非健康/approval状态机；Bound只配置齐备，不证明ownerready |
| Blocked | Blocked is a local classification. | 启动时资格分类非健康/approval状态机；Bound只配置齐备，不证明ownerready |
| Disabled | Disabled is a local classification. | 启动时资格分类非健康/approval状态机；Bound只配置齐备，不证明ownerready |

归属：infra；启动时资格分类非健康/approval状态机；Bound只配置齐备，不证明ownerready


### AdapterBinding

```rust
/// Carries AdapterBinding with explicit sources and no upstream body.
pub struct AdapterBinding {
    /// Carries kind; see the source and invariant table.
    pub kind: AdapterKind,
    /// Carries configuration_ref; see the source and invariant table.
    pub configuration_ref: String,
    /// Carries consumer_contract_ref; see the source and invariant table.
    pub consumer_contract_ref: Option<OwnerConsumerContractRef>,
    /// Carries disposition; see the source and invariant table.
    pub disposition: AdapterBindingDisposition,
    /// Carries failure_ref; see the source and invariant table.
    pub failure_ref: OptionalSafeFailureRef,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| kind | `AdapterKind` | Bound必须exactconsumer+SDKoperation正向资格；否则Blocked不能生产fakefallback |
| configuration_ref | `String` | Bound必须exactconsumer+SDKoperation正向资格；否则Blocked不能生产fakefallback |
| consumer_contract_ref | `Option<OwnerConsumerContractRef>` | Bound必须exactconsumer+SDKoperation正向资格；否则Blocked不能生产fakefallback |
| disposition | `AdapterBindingDisposition` | Bound必须exactconsumer+SDKoperation正向资格；否则Blocked不能生产fakefallback |
| failure_ref | `OptionalSafeFailureRef` | Bound必须exactconsumer+SDKoperation正向资格；否则Blocked不能生产fakefallback |

归属：infra；Bound必须exactconsumer+SDKoperation正向资格；否则Blocked不能生产fakefallback


### RuntimeAssembly<P>

```rust
/// Carries RuntimeAssembly<P> with explicit sources and no upstream body.
pub struct RuntimeAssembly<P> {
    /// Carries application; see the source and invariant table.
    pub application: MarketplaceApplication<P>,
    /// Carries config; see the source and invariant table.
    pub config: RuntimeConfig,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| application | `MarketplaceApplication<P>` | validatedbuilder输出，P具体infraMarketPorts实现；API/Worker只取得facade，PG与SDKhandles不泄漏 |
| config | `RuntimeConfig` | validatedbuilder输出，P具体infraMarketPorts实现；API/Worker只取得facade，PG与SDKhandles不泄漏 |

归属：infra；validatedbuilder输出，P具体infraMarketPorts实现；API/Worker只取得facade，PG与SDKhandles不泄漏


### ApiCommandEntry<T>

```rust
/// Carries ApiCommandEntry<T> with explicit sources and no upstream body.
pub struct ApiCommandEntry<T> {
    /// Carries envelope; see the source and invariant table.
    pub envelope: CommandEnvelope<T>,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| envelope | `CommandEnvelope<T>` | trustedboundary注入Core，decode长度/字段/enum及meta完整；调用typedfacademethod不直repo |

归属：api；trustedboundary注入Core，decode长度/字段/enum及meta完整；调用typedfacademethod不直repo


### ApiQueryEntry<T>

```rust
/// Carries ApiQueryEntry<T> with explicit sources and no upstream body.
pub struct ApiQueryEntry<T> {
    /// Carries envelope; see the source and invariant table.
    pub envelope: QueryEnvelope<T>,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| envelope | `QueryEnvelope<T>` | 只readonly facade，rawactor/hidden存在不泄漏 |

归属：api；只readonly facade，rawactor/hidden存在不泄漏


### WorkerJobEntry<T>

```rust
/// Carries WorkerJobEntry<T> with explicit sources and no upstream body.
pub struct WorkerJobEntry<T> {
    /// Carries envelope; see the source and invariant table.
    pub envelope: JobEnvelope<T>,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| envelope | `JobEnvelope<T>` | scheduler envelope到typedmethod；lease/cursor不能自证externalnotcommit |

归属：worker；scheduler envelope到typedmethod；lease/cursor不能自证externalnotcommit


### WebAsyncSurface<T>

```rust
/// Carries WebAsyncSurface<T> with explicit sources and no upstream body.
pub struct WebAsyncSurface<T> {
    /// Carries data; see the source and invariant table.
    pub data: Option<T>,
    /// Carries read_marker; see the source and invariant table.
    pub read_marker: Option<ReadMarker>,
    /// Carries pending; see the source and invariant table.
    pub pending: bool,
    /// Carries error; see the source and invariant table.
    pub error: Option<MarketError>,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| data | `Option<T>` | TypeScript mirror；取消旧请求防覆盖，仅UI临时状态，不独立domain状态机，预期loading/empty/failed明示 |
| read_marker | `Option<ReadMarker>` | TypeScript mirror；取消旧请求防覆盖，仅UI临时状态，不独立domain状态机，预期loading/empty/failed明示 |
| pending | `bool` | TypeScript mirror；取消旧请求防覆盖，仅UI临时状态，不独立domain状态机，预期loading/empty/failed明示 |
| error | `Option<MarketError>` | TypeScript mirror；取消旧请求防覆盖，仅UI临时状态，不独立domain状态机，预期loading/empty/failed明示 |

归属：web；TypeScript mirror；取消旧请求防覆盖，仅UI临时状态，不独立domain状态机，预期loading/empty/failed明示


### ReadWindow

```rust
/// Carries ReadWindow with explicit sources and no upstream body.
pub struct ReadWindow {
    /// Carries limit; see the source and invariant table.
    pub limit: u32,
    /// Carries after; see the source and invariant table.
    pub after: Option<RepositoryCursor>,
    /// Carries upper; see the source and invariant table.
    pub upper: MarketSourceCursor,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| limit | `u32` | 内部boundedscan，limit由validatedpolicy/batch；固定upper，去重稳定subject order；非Corequerypage第二authority |
| after | `Option<RepositoryCursor>` | 内部boundedscan，limit由validatedpolicy/batch；固定upper，去重稳定subject order；非Corequerypage第二authority |
| upper | `MarketSourceCursor` | 内部boundedscan，limit由validatedpolicy/batch；固定upper，去重稳定subject order；非Corequerypage第二authority |

归属：application；内部boundedscan，limit由validatedpolicy/batch；固定upper，去重稳定subject order；非Corequerypage第二authority


### TransactionRef

```rust
/// Carries TransactionRef with explicit sources and no upstream body.
pub struct TransactionRef {
    /// Carries token; see the source and invariant table.
    pub token: String,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| token | `String` | opaque事务诊断token不供caller业务truth，Tx handle唯一具体infra；不是新的持久状态 |

归属：application；opaque事务诊断token不供caller业务truth，Tx handle唯一具体infra；不是新的持久状态


### UowMode

```rust
/// Represents the finite UowMode surface without owning upstream truth.
pub enum UowMode {
    /// ReadOnly is a local classification.
    ReadOnly,
    /// ReadWrite is a local classification.
    ReadWrite,
}
```

| 变体 | Rustdoc语义 | 来源 / 去向 |
|---|---|---|
| ReadOnly | ReadOnly is a local classification. | transaction建立时模式，readonly stores写调用拒绝；非业务lifecycle |
| ReadWrite | ReadWrite is a local classification. | transaction建立时模式，readonly stores写调用拒绝；非业务lifecycle |

归属：application；transaction建立时模式，readonly stores写调用拒绝；非业务lifecycle


## 完整公开构造 / 成员签名

| 类型 | callable | 输入来源 / 输出 / 副作用 |
|---|---|---|
| CoreContextRecord | `pub fn from_command(context_ref: MarketContextRef, actor: ActorContext, meta: CommandMetadata) -> Result<Self, MarketError>` | contextIDport+trustedCore；missingkey拒绝；不额外生成trace |
| CoreContextRecord | `pub fn from_job(context_ref: MarketContextRef, context: MarketWorkerContext) -> Result<Self, MarketError>` | work/fence/selector一致；key唯一request；frozenrecord |
| CommandRunner/JobRunner/ReadFacade/MarketplaceApplication | `pub fn new(ports: P) -> Self` | P:MarketPorts，dependency唯一注入；49callable Step8逐签名 |
| RuntimeConfig | `pub fn validate(&self) -> Result<(), MarketError>` | finite非空slots与数字范围，不能豁免body/approval/visibility |
| RuntimeAssembly | `pub async fn build(config: RuntimeConfig, ports: P) -> Result<Self, MarketError>` | onlyvalidatedrefs/binding；production blocked adapter阻止对应positive，非全局伪ready |
| ApiCommandEntry | `pub fn from_trusted(envelope: CommandEnvelope<T>) -> Result<Self, MarketError>` | boundarytrustedactor+完整meta，decode字段+缺key拒绝；无DB |
| ApiQueryEntry | `pub fn from_trusted(envelope: QueryEnvelope<T>) -> Result<Self, MarketError>` | page/consistency唯一meta，只readonly |
| WorkerJobEntry | `pub fn from_trusted(envelope: JobEnvelope<T>) -> Result<Self, MarketError>` | system/operator stillscoped，bodyworkref=fenceworkref |
| WebAsyncSurface | 无业务factory或mutation | 本地渲染loaded/error；不保留owner secret/body |

## 模块内停审

metadata authority没有复制；genericports不依赖具体PG/SDK；runtimeBound不是运行结果，finite classifications排除独立lifecycle。稳定carriers已定义，Step7/8/9必须同boundary承接，不伪实现或连接证据。
