# Step6-C 支撑载体、应用服务与入口对象

## 批次计划与依据

承接Step6-A/B与Step5七模块；参考governance的OperationContext、BuilderState与ApiEntry对象卡粒度。先domain支撑载体，再application、infra、api/worker/jobs，各组独立自检。此处仅设计，Step7闭合可调用port/service，Step8闭合外部DTO。外部slot不变成可构造本地truth。

## Domain支撑载体推导

| 能力 | 输入→对象→输出 | 必需字段/方法/状态 | 取舍 |
|---|---|---|---|
| 切换并发栅栏 | 同快照版本/proof→CutoverBasis→validate/promote | partition/attempt/candidate各轴、coverage/visibility、已见失效 | 无授权状态；不可代替现时owner决定 |
| 失效目标 | store枚举→ExistingWorkspaceTargetSet→affects | 单partition、generation/source集合 | fanout无全局事务 |
| 页绑定/读组装 | 已裁剪快照→WorkspaceReadContext/Inputs→view/cursor | principal、版本、selection、当前可见性、safe items | domain不依赖application |
| 局部意图解析 | owning resolver→LocalChangeResolution→change | scope/partition、条件attention/subject proof | 不从请求bool制造证明 |

### CutoverBasis

位置：`crates/domain/src/recovery.rs`。能力：Binds one candidate validation to local compare-and-swap axes.

```rust
/// Binds one candidate validation to local compare-and-swap axes.
pub struct CutoverBasis {
    /// Validated partition input.
    partition: WorkspacePartitionId,
    /// Validated expected partition input.
    expected_partition: PartitionVersion,
    /// Validated old current input.
    old_current: Option<GenerationId>,
    /// Validated candidate input.
    candidate: GenerationId,
    /// Validated candidate revision input.
    candidate_revision: ViewRevision,
    /// Validated attempt input.
    attempt: RebuildAttemptId,
    /// Validated expected attempt input.
    expected_attempt: AttemptVersion,
    /// Validated coverage input.
    coverage: Vec<OwnerCoverageProof>,
    /// Validated visibility input.
    visibility: Vec<VisibilityBinding>,
    /// Validated observed invalidations input.
    observed_invalidations: Vec<InvalidationId>,
}
```

| 字段 | 类型 | 来源 / 约束 / optional |
|---|---|---|
| `partition` | `WorkspacePartitionId` | 同一已存分区 |
| `expected_partition` | `PartitionVersion` | read snapshot版本 |
| `old_current` | `Option<GenerationId>` | None仅无current |
| `candidate` | `GenerationId` | 同attempt候选 |
| `candidate_revision` | `ViewRevision` | 完整projection快照 |
| `attempt` | `RebuildAttemptId` | 当前维护尝试 |
| `expected_attempt` | `AttemptVersion` | Ready验证basis绑定mark_ready后拟提交的next版本；Ready切换时与当前版本相等 |
| `coverage` | `Vec<OwnerCoverageProof>` | 全部声明source的正式coverage，非空 |
| `visibility` | `Vec<VisibilityBinding>` | 现时scope/source proof，非空 |
| `observed_invalidations` | `Vec<InvalidationId>` | 同快照失效集合；空不表示已授权 |

| 成员签名 | 参数/返回/效果 |
|---|---|
| `pub fn validate(&self, attempt: &RebuildAttempt, generation: &GenerationState) -> Result<(), DomainError>` | 版本/主语匹配；candidate未SafetyBlocked；owner决定仍须现时复核；提交比较整个失效集合与source安全栅栏 |

| 工厂签名 | 来源与初始条件 |
|---|---|
| `pub fn try_new(partition: WorkspacePartitionId, expected_partition: PartitionVersion, old_current: Option<GenerationId>, candidate: GenerationId, candidate_revision: ViewRevision, attempt: RebuildAttemptId, expected_attempt: AttemptVersion, coverage: Vec<OwnerCoverageProof>, visibility: Vec<VisibilityBinding>, observed_invalidations: Vec<InvalidationId>) -> Result<Self, DomainError>` | 逐字段验证、错误不构造；正式proof由application ports提供，不接受外部serde直入。 |

不变量/禁止：版本/主语匹配；candidate未SafetyBlocked；owner决定仍须现时复核；提交比较整个失效集合与source安全栅栏

### ExistingWorkspaceTargetSet

位置：`crates/domain/src/recovery.rs`。能力：Binds invalidation to existing local targets.

```rust
/// Binds invalidation to existing local targets.
pub struct ExistingWorkspaceTargetSet {
    /// Validated partition input.
    partition: WorkspacePartitionId,
    /// Validated generations input.
    generations: Vec<GenerationId>,
    /// Validated sources input.
    sources: Vec<SourceStreamRef>,
}
```

| 字段 | 类型 | 来源 / 约束 / optional |
|---|---|---|
| `partition` | `WorkspacePartitionId` | 已有且获准 |
| `generations` | `Vec<GenerationId>` | store枚举；非空去重 |
| `sources` | `Vec<SourceStreamRef>` | 正式影响范围映射；非空去重 |

| 成员签名 | 参数/返回/效果 |
|---|---|
| `pub fn contains(&self, generation: GenerationId) -> bool` | 纯集合判断；新增candidate必须另核对source级失效 |

| 工厂签名 | 来源与初始条件 |
|---|---|
| `pub fn try_new(partition: WorkspacePartitionId, generations: Vec<GenerationId>, sources: Vec<SourceStreamRef>) -> Result<Self, DomainError>` | 逐字段验证、错误不构造；正式proof由application ports提供，不接受外部serde直入。 |

不变量/禁止：纯集合判断；新增candidate必须另核对source级失效

### WorkspaceReadContext

位置：`crates/domain/src/read_view.rs`。能力：Binds a materialized read to one visibility context.

```rust
/// Binds a materialized read to one visibility context.
pub struct WorkspaceReadContext {
    /// Validated principal input.
    principal: ActorId,
    /// Validated partition input.
    partition: WorkspacePartitionId,
    /// Validated generation input.
    generation: GenerationId,
    /// Validated view input.
    view: ViewRevision,
    /// Validated local input.
    local: LocalReadBasis,
    /// Validated query input.
    query: QueryBinding,
    /// Validated visibility input.
    visibility: VisibilityContextRef,
}
```

| 字段 | 类型 | 来源 / 约束 / optional |
|---|---|---|
| `principal` | `ActorId` | 认证主体 |
| `partition` | `WorkspacePartitionId` | 原子读 |
| `generation` | `GenerationId` | 同原子读 |
| `view` | `ViewRevision` | 同原子读 |
| `local` | `LocalReadBasis` | Absent/Present同快照 |
| `query` | `QueryBinding` | 规范化请求 |
| `visibility` | `VisibilityContextRef` | 当前owner决定语境 |

| 成员签名 | 参数/返回/效果 |
|---|---|
| `pub fn validate(&self) -> Result<(), DomainError>` | 只物化值，版本非0，不含写能力 |

| 工厂签名 | 来源与初始条件 |
|---|---|
| `pub fn try_new(principal: ActorId, partition: WorkspacePartitionId, generation: GenerationId, view: ViewRevision, local: LocalReadBasis, query: QueryBinding, visibility: VisibilityContextRef) -> Result<Self, DomainError>` | 逐字段验证、错误不构造；正式proof由application ports提供，不接受外部serde直入。 |

不变量/禁止：只物化值，版本非0，不含写能力

### WorkspaceReadInputs

位置：`crates/domain/src/read_view.rs`。能力：Collects safe inputs for immutable view construction.

```rust
/// Collects safe inputs for immutable view construction.
pub struct WorkspaceReadInputs {
    /// Validated scope input.
    scope: WorkspaceScope,
    /// Validated basis input.
    basis: WorkspaceReadBasis,
    /// Validated items input.
    items: Vec<SafeWorkspaceItem>,
    /// Validated provenance input.
    provenance: Vec<SafeProvenance>,
    /// Validated freshness input.
    freshness: DataFreshness,
    /// Validated coverage input.
    coverage: ReadCoverage,
    /// Validated next input.
    next: Option<WorkspacePageCursor>,
}
```

| 字段 | 类型 | 来源 / 约束 / optional |
|---|---|---|
| `scope` | `WorkspaceScope` | resolver结果 |
| `basis` | `WorkspaceReadBasis` | 物化快照或显式Transient |
| `items` | `Vec<SafeWorkspaceItem>` | 001/003裁剪结果，可空 |
| `provenance` | `Vec<SafeProvenance>` | 同可见性，hidden来源不列出 |
| `freshness` | `DataFreshness` | 来源水位/失效 |
| `coverage` | `ReadCoverage` | 可见selection proof |
| `next` | `Option<WorkspacePageCursor>` | 物化才可Some |

| 成员签名 | 参数/返回/效果 |
|---|---|
| `pub fn validate(&self) -> Result<(), DomainError>` | items/next/provenance不得泄露；无proof不能Complete/Current |

| 工厂签名 | 来源与初始条件 |
|---|---|
| `pub fn try_new(scope: WorkspaceScope, basis: WorkspaceReadBasis, items: Vec<SafeWorkspaceItem>, provenance: Vec<SafeProvenance>, freshness: DataFreshness, coverage: ReadCoverage, next: Option<WorkspacePageCursor>) -> Result<Self, DomainError>` | 逐字段验证、错误不构造；正式proof由application ports提供，不接受外部serde直入。 |

不变量/禁止：items/next/provenance不得泄露；无proof不能Complete/Current

### LocalChangeResolution

位置：`crates/domain/src/local_attention.rs`。能力：Binds an explicit local change to resolved targets.

```rust
/// Binds an explicit local change to resolved targets.
pub struct LocalChangeResolution {
    /// Validated partition input.
    partition: WorkspacePartitionId,
    /// Validated scope input.
    scope: WorkspaceScope,
    /// Validated attention input.
    attention: Option<AttentionIdentityResolution>,
    /// Validated subject visibility input.
    subject_visibility: Option<VisibilityBinding>,
}
```

| 字段 | 类型 | 来源 / 约束 / optional |
|---|---|---|
| `partition` | `WorkspacePartitionId` | 已有目标 |
| `scope` | `WorkspaceScope` | 现时scope |
| `attention` | `Option<AttentionIdentityResolution>` | Read与SetDisposition必Some，其他None |
| `subject_visibility` | `Option<VisibilityBinding>` | SetFocus/LastOpened(Some)必Some；None清除无需旧内容可见 |

| 成员签名 | 参数/返回/效果 |
|---|---|
| `pub fn validate_for(&self, change: &LocalAttentionChange) -> Result<(), DomainError>` | 变体匹配；权限检查不由Option存在性单独证明 |

| 工厂签名 | 来源与初始条件 |
|---|---|
| `pub fn try_new(partition: WorkspacePartitionId, scope: WorkspaceScope, attention: Option<AttentionIdentityResolution>, subject_visibility: Option<VisibilityBinding>) -> Result<Self, DomainError>` | 逐字段验证、错误不构造；正式proof由application ports提供，不接受外部serde直入。 |

不变量/禁止：变体匹配；权限检查不由Option存在性单独证明

Domain支撑组自检：所有本地support均有字段/构造；owner slot仍阻塞正向构造；无domain→application依赖。gate=pass_with_external_slots。


## Application开工：能力到对象

| 能力 | 对象/字段 | 来源与效果 | 状态/承接 |
|---|---|---|---|
| 可信调用与幂等关联 | WorkspaceOperationContext、SourceContext | entry认证上下文+正式scope+canonical请求；不能外部反序列化 | 无持久状态；Step7 lookup/commit、Step8 metadata |
| scope/source读解析 | ScopeService、SourceReadService | owning port | 无写 |
| 分区/局部意图/来源应用 | PartitionService、LocalAttentionService、ProjectionApplyService | read+atomic+ids，受控domain变更 | 各局部轴，Step7/9 |
| 候选恢复/失效 | RecoveryService | owner baseline+read+atomic | attempt/role/safety |
| 公共查询 | WorkspaceQueryService | 只有只读ports与codec | 无AtomicStore、IdPort、publisher |

诊断：只有service名不能约束Query偷写；把IdPort注入Query也会让首次打开隐式建分区。取舍：七个具名服务、显式private依赖，不设置万能dispatch。Rust Arc/std来自标准库，trait定义在Step7；dyn异步对象安全约定也由Step7闭合。


### WorkspaceOperationContext

位置：`crates/application/src/operation_context.rs`。能力：Binds a trusted local invocation.

```rust
/// Binds a trusted local invocation.
pub struct WorkspaceOperationContext {
    /// Validated actor binding.
    actor: ActorContext,
    /// Validated metadata binding.
    metadata: RequestMetadata,
    /// Validated scope binding.
    scope: WorkspaceScope,
    /// Validated key binding.
    key: Option<WorkspaceOperationKey>,
    /// Validated digest binding.
    digest: Option<SafeInputDigest>,
    /// Validated commit_attempt binding.
    commit_attempt: Option<CommitAttemptId>,
}
```

| 字段 | 类型 | 来源 / 约束 / optional |
|---|---|---|
| `actor` | `ActorContext` | 宿主已认证主体，无role授权 |
| `metadata` | `RequestMetadata` | Core请求追踪字段；query idempotency_key必须None |
| `scope` | `WorkspaceScope` | ScopeService正式解析 |
| `key` | `Option<WorkspaceOperationKey>` | query None；write Some |
| `digest` | `Option<SafeInputDigest>` | query None；write canonical digest |
| `commit_attempt` | `Option<CommitAttemptId>` | query None；write IdPort生成 |

| 成员签名 | 参数/返回/效果 |
|---|---|
| `pub fn validate(&self) -> Result<(), ApplicationError>` | 对象不承载权限决定；拒绝metadata/key/digest/channel错配 |

| 工厂签名 | 来源与初始条件 |
|---|---|
| `pub fn from_query(actor: ActorContext, metadata: QueryMetadata, scope: WorkspaceScope) -> Result<Self, ApplicationError>` | Core page和idempotency_key均None、consistency只Eventual；key/digest/attempt为None |
| `pub fn for_write(actor: ActorContext, metadata: RequestMetadata, scope: WorkspaceScope, key: WorkspaceOperationKey, digest: SafeInputDigest, commit_attempt: CommitAttemptId) -> Result<Self, ApplicationError>` | 三Some且主体/幂等键/namespace一致，origin由entry固定 |

不变量/禁止：没有公开state setter，无授权truth；Core字段通过实际metadata成员访问，辅助方法不得猜测。

### SourceContext

位置：`crates/application/src/operation_context.rs`。能力：Binds one trusted source delivery.

```rust
/// Binds one trusted source delivery.
pub struct SourceContext {
    /// Validated actor binding.
    actor: ActorContext,
    /// Validated metadata binding.
    metadata: RequestMetadata,
    /// Validated key binding.
    key: SourceApplicationKey,
    /// Validated digest binding.
    digest: SafeInputDigest,
    /// Validated commit_attempt binding.
    commit_attempt: CommitAttemptId,
}
```

| 字段 | 类型 | 来源 / 约束 / optional |
|---|---|---|
| `actor` | `ActorContext` | 受信consumer身份，origin Operations |
| `metadata` | `RequestMetadata` | 从可信bus envelope映射，002 |
| `key` | `SourceApplicationKey` | 含partition/generation/source event身份 |
| `digest` | `SafeInputDigest` | 正式事件canonical identity/payload |
| `commit_attempt` | `CommitAttemptId` | 本地一次提交尝试 |

| 成员签名 | 参数/返回/效果 |
|---|---|
| `pub fn validate(&self) -> Result<(), ApplicationError>` | 对象不承载权限决定；拒绝metadata/key/digest/channel错配 |

| 工厂签名 | 来源与初始条件 |
|---|---|
| `pub fn from_delivery(actor: ActorContext, metadata: RequestMetadata, key: SourceApplicationKey, digest: SafeInputDigest, commit_attempt: CommitAttemptId) -> Result<Self, ApplicationError>` | 只在SourceEventPort认证验证后调用，非公开消息直接Deserialize |

不变量/禁止：没有公开state setter，无授权truth；Core字段通过实际metadata成员访问，辅助方法不得猜测。

### ScopeService

位置：`crates/application/src/scope_service.rs`。能力：Resolves scope through owning domains.

```rust
/// Resolves scope through owning domains.
pub struct ScopeService {
    /// Injected resolver dependency.
    resolver: Arc<dyn ScopeResolverPort>,
}
```

| 字段 | 类型 | 来源 / 约束 / optional |
|---|---|---|
| `resolver` | `Arc<dyn ScopeResolverPort>` | composition root注入；非请求可选 |

| 成员签名 | 参数/返回/效果 |
|---|---|
| `pub async fn resolve(&self, actor: &ActorContext, selector: &ScopeSelector) -> Result<WorkspaceScope, ApplicationError>` | 先正式resolver，无scope猜测 |
| `pub async fn authorize_operation(&self, actor: &ActorContext, scope: &WorkspaceScope, kind: OperationKind) -> Result<(), ApplicationError>` | 只消费owning操作决定，不自行裁决 |

| 工厂签名 | 来源与初始条件 |
|---|---|
| `pub fn new(resolver: Arc<dyn ScopeResolverPort>) -> Self` | 只接线，不读源、不建分区、不启动后台任务 |

不变量/禁止：各方法遵守Step5职责，依赖不得转交外层；Query无可写store与ID能力，source所有远端调用no-write。

### PartitionService

位置：`crates/application/src/partition_service.rs`。能力：Provisions only explicit local partitions.

```rust
/// Provisions only explicit local partitions.
pub struct PartitionService {
    /// Injected scope dependency.
    scope: Arc<ScopeService>,
    /// Injected read dependency.
    read: Arc<dyn WorkspaceReadPort>,
    /// Injected store dependency.
    store: Arc<dyn WorkspaceAtomicStore>,
    /// Injected ids dependency.
    ids: Arc<dyn IdPort>,
}
```

| 字段 | 类型 | 来源 / 约束 / optional |
|---|---|---|
| `scope` | `Arc<ScopeService>` | composition root注入；非请求可选 |
| `read` | `Arc<dyn WorkspaceReadPort>` | composition root注入；非请求可选 |
| `store` | `Arc<dyn WorkspaceAtomicStore>` | composition root注入；非请求可选 |
| `ids` | `Arc<dyn IdPort>` | composition root注入；非请求可选 |

| 成员签名 | 参数/返回/效果 |
|---|---|
| `pub async fn provision(&self, actor: ActorContext, metadata: CommandMetadata, request: ProvisionWorkspacePartitionRequest) -> Result<WorkspaceWriteResult, SafeReadFailure>` | ProvisionWorkspacePartition；Step7对应完整port/Step8协议，遵守上述能力边界 |

| 工厂签名 | 来源与初始条件 |
|---|---|
| `pub fn new(scope: Arc<ScopeService>, read: Arc<dyn WorkspaceReadPort>, store: Arc<dyn WorkspaceAtomicStore>, ids: Arc<dyn IdPort>) -> Self` | 只接线，不读源、不建分区、不启动后台任务 |

不变量/禁止：各方法遵守Step5职责，依赖不得转交外层；Query无可写store与ID能力，source所有远端调用no-write。

### SourceReadService

位置：`crates/application/src/source_read_service.rs`。能力：Reads safe owner inputs without mutation.

```rust
/// Reads safe owner inputs without mutation.
pub struct SourceReadService {
    /// Injected sources dependency.
    sources: Arc<dyn OwnerReadPort>,
    /// Injected visibility dependency.
    visibility: Arc<dyn VisibilityPort>,
}
```

| 字段 | 类型 | 来源 / 约束 / optional |
|---|---|---|
| `sources` | `Arc<dyn OwnerReadPort>` | composition root注入；非请求可选 |
| `visibility` | `Arc<dyn VisibilityPort>` | composition root注入；非请求可选 |

| 成员签名 | 参数/返回/效果 |
|---|---|
| `pub async fn read(&self, actor: &ActorContext, scope: &WorkspaceScope, request: &OwnerReadRequest) -> Result<SourceSlice, ApplicationError>` | OwnerReadPort.read→VisibilityPort.bind_result→SourceSlice.from_owner，no-write |

| 工厂签名 | 来源与初始条件 |
|---|---|
| `pub fn new(sources: Arc<dyn OwnerReadPort>, visibility: Arc<dyn VisibilityPort>) -> Self` | 只接线，不读源、不建分区、不启动后台任务 |

不变量/禁止：各方法遵守Step5职责，依赖不得转交外层；Query无可写store与ID能力，source所有远端调用no-write。

### ProjectionApplyService

位置：`crates/application/src/projection_apply_service.rs`。能力：Applies one source input atomically.

```rust
/// Applies one source input atomically.
pub struct ProjectionApplyService {
    /// Injected scope dependency.
    scope: Arc<ScopeService>,
    /// Injected source dependency.
    source: Arc<SourceReadService>,
    /// Injected events dependency.
    events: Arc<dyn SourceEventPort>,
    /// Injected read dependency.
    read: Arc<dyn WorkspaceReadPort>,
    /// Injected store dependency.
    store: Arc<dyn WorkspaceAtomicStore>,
    /// Injected ids dependency.
    ids: Arc<dyn IdPort>,
}
```

| 字段 | 类型 | 来源 / 约束 / optional |
|---|---|---|
| `scope` | `Arc<ScopeService>` | composition root注入；非请求可选 |
| `source` | `Arc<SourceReadService>` | composition root注入；非请求可选 |
| `events` | `Arc<dyn SourceEventPort>` | composition root注入；非请求可选 |
| `read` | `Arc<dyn WorkspaceReadPort>` | composition root注入；非请求可选 |
| `store` | `Arc<dyn WorkspaceAtomicStore>` | composition root注入；非请求可选 |
| `ids` | `Arc<dyn IdPort>` | composition root注入；非请求可选 |

| 成员签名 | 参数/返回/效果 |
|---|---|
| `pub async fn consume_change(&self, actor: ActorContext, request: ConsumeSourceChangeRequest) -> Result<SourceChangeReceipt, SafeReadFailure>` | ConsumeSourceChange；Step7对应完整port/Step8协议，遵守上述能力边界 |

| 工厂签名 | 来源与初始条件 |
|---|---|
| `pub fn new(scope: Arc<ScopeService>, source: Arc<SourceReadService>, events: Arc<dyn SourceEventPort>, read: Arc<dyn WorkspaceReadPort>, store: Arc<dyn WorkspaceAtomicStore>, ids: Arc<dyn IdPort>) -> Self` | 只接线，不读源、不建分区、不启动后台任务 |

不变量/禁止：各方法遵守Step5职责，依赖不得转交外层；Query无可写store与ID能力，source所有远端调用no-write。

### LocalAttentionService

位置：`crates/application/src/local_attention_service.rs`。能力：Changes explicit local intent only.

```rust
/// Changes explicit local intent only.
pub struct LocalAttentionService {
    /// Injected scope dependency.
    scope: Arc<ScopeService>,
    /// Injected visibility dependency.
    visibility: Arc<dyn VisibilityPort>,
    /// Injected attention dependency.
    attention: Arc<dyn AttentionResolverPort>,
    /// Injected read dependency.
    read: Arc<dyn WorkspaceReadPort>,
    /// Injected store dependency.
    store: Arc<dyn WorkspaceAtomicStore>,
    /// Injected ids dependency.
    ids: Arc<dyn IdPort>,
}
```

| 字段 | 类型 | 来源 / 约束 / optional |
|---|---|---|
| `scope` | `Arc<ScopeService>` | composition root注入；非请求可选 |
| `visibility` | `Arc<dyn VisibilityPort>` | composition root注入；非请求可选 |
| `attention` | `Arc<dyn AttentionResolverPort>` | composition root注入；非请求可选 |
| `read` | `Arc<dyn WorkspaceReadPort>` | composition root注入；非请求可选 |
| `store` | `Arc<dyn WorkspaceAtomicStore>` | composition root注入；非请求可选 |
| `ids` | `Arc<dyn IdPort>` | composition root注入；非请求可选 |

| 成员签名 | 参数/返回/效果 |
|---|---|
| `pub async fn change_local(&self, actor: ActorContext, metadata: CommandMetadata, request: ChangeWorkspaceLocalStateRequest) -> Result<WorkspaceWriteResult, SafeReadFailure>` | ChangeWorkspaceLocalState；Step7对应完整port/Step8协议，遵守上述能力边界 |

| 工厂签名 | 来源与初始条件 |
|---|---|
| `pub fn new(scope: Arc<ScopeService>, visibility: Arc<dyn VisibilityPort>, attention: Arc<dyn AttentionResolverPort>, read: Arc<dyn WorkspaceReadPort>, store: Arc<dyn WorkspaceAtomicStore>, ids: Arc<dyn IdPort>) -> Self` | 只接线，不读源、不建分区、不启动后台任务 |

不变量/禁止：各方法遵守Step5职责，依赖不得转交外层；Query无可写store与ID能力，source所有远端调用no-write。

### RecoveryService

位置：`crates/application/src/recovery_service.rs`。能力：Coordinates bounded recovery and invalidation.

```rust
/// Coordinates bounded recovery and invalidation.
pub struct RecoveryService {
    /// Injected scope dependency.
    scope: Arc<ScopeService>,
    /// Injected sources dependency.
    sources: Arc<dyn RecoverySourcePort>,
    /// Injected visibility dependency.
    visibility: Arc<dyn VisibilityPort>,
    /// Injected events dependency.
    events: Arc<dyn SourceEventPort>,
    /// Injected read dependency.
    read: Arc<dyn WorkspaceReadPort>,
    /// Injected store dependency.
    store: Arc<dyn WorkspaceAtomicStore>,
    /// Injected ids dependency.
    ids: Arc<dyn IdPort>,
}
```

| 字段 | 类型 | 来源 / 约束 / optional |
|---|---|---|
| `scope` | `Arc<ScopeService>` | composition root注入；非请求可选 |
| `sources` | `Arc<dyn RecoverySourcePort>` | composition root注入；非请求可选 |
| `visibility` | `Arc<dyn VisibilityPort>` | composition root注入；非请求可选 |
| `events` | `Arc<dyn SourceEventPort>` | composition root注入；非请求可选 |
| `read` | `Arc<dyn WorkspaceReadPort>` | composition root注入；非请求可选 |
| `store` | `Arc<dyn WorkspaceAtomicStore>` | composition root注入；非请求可选 |
| `ids` | `Arc<dyn IdPort>` | composition root注入；非请求可选 |

| 成员签名 | 参数/返回/效果 |
|---|---|
| `pub async fn consume_invalidation(&self, actor: ActorContext, request: ConsumeSourceInvalidationRequest) -> Result<SourceInvalidationPageReceipt, SafeReadFailure>` | ConsumeSourceInvalidation；Step7对应完整port/Step8协议，遵守上述能力边界 |
| `pub async fn request_recovery(&self, actor: ActorContext, metadata: RequestMetadata, request: RequestWorkspaceRecoveryRequest) -> Result<WorkspaceWriteResult, SafeReadFailure>` | RequestWorkspaceRecovery；Step7对应完整port/Step8协议，遵守上述能力边界 |
| `pub async fn advance_recovery(&self, actor: ActorContext, metadata: RequestMetadata, request: AdvanceWorkspaceRecoveryRequest) -> Result<WorkspaceWriteResult, SafeReadFailure>` | AdvanceWorkspaceRecovery；Step7对应完整port/Step8协议，遵守上述能力边界 |
| `pub async fn supersede_recovery(&self, actor: ActorContext, metadata: RequestMetadata, request: SupersedeWorkspaceRecoveryRequest) -> Result<WorkspaceWriteResult, SafeReadFailure>` | SupersedeWorkspaceRecovery；Step7对应完整port/Step8协议，遵守上述能力边界 |
| `pub async fn invalidate_view(&self, actor: ActorContext, metadata: RequestMetadata, request: InvalidateWorkspaceViewRequest) -> Result<WorkspaceWriteResult, SafeReadFailure>` | InvalidateWorkspaceView；Step7对应完整port/Step8协议，遵守上述能力边界 |

| 工厂签名 | 来源与初始条件 |
|---|---|
| `pub fn new(scope: Arc<ScopeService>, sources: Arc<dyn RecoverySourcePort>, visibility: Arc<dyn VisibilityPort>, events: Arc<dyn SourceEventPort>, read: Arc<dyn WorkspaceReadPort>, store: Arc<dyn WorkspaceAtomicStore>, ids: Arc<dyn IdPort>) -> Self` | 只接线，不读源、不建分区、不启动后台任务 |

不变量/禁止：各方法遵守Step5职责，依赖不得转交外层；Query无可写store与ID能力，source所有远端调用no-write。

### WorkspaceQueryService

位置：`crates/application/src/workspace_query_service.rs`。能力：Builds authorized read models without writes.

```rust
/// Builds authorized read models without writes.
pub struct WorkspaceQueryService {
    /// Injected scope dependency.
    scope: Arc<ScopeService>,
    /// Injected source dependency.
    source: Arc<SourceReadService>,
    /// Injected visibility dependency.
    visibility: Arc<dyn VisibilityPort>,
    /// Injected attention dependency.
    attention: Arc<dyn AttentionResolverPort>,
    /// Injected read dependency.
    read: Arc<dyn WorkspaceReadPort>,
    /// Injected cursor dependency.
    cursor: Arc<dyn WorkspaceCursorCodec>,
}
```

| 字段 | 类型 | 来源 / 约束 / optional |
|---|---|---|
| `scope` | `Arc<ScopeService>` | composition root注入；非请求可选 |
| `source` | `Arc<SourceReadService>` | composition root注入；非请求可选 |
| `visibility` | `Arc<dyn VisibilityPort>` | composition root注入；非请求可选 |
| `attention` | `Arc<dyn AttentionResolverPort>` | composition root注入；非请求可选 |
| `read` | `Arc<dyn WorkspaceReadPort>` | composition root注入；非请求可选 |
| `cursor` | `Arc<dyn WorkspaceCursorCodec>` | composition root注入；非请求可选 |

| 成员签名 | 参数/返回/效果 |
|---|---|
| `pub async fn get_view(&self, actor: ActorContext, metadata: QueryMetadata, request: GetWorkspaceViewRequest) -> Result<WorkspaceViewResponse, SafeReadFailure>` | GetWorkspaceView；Step7对应完整port/Step8协议，遵守上述能力边界 |
| `pub async fn list_inbox(&self, actor: ActorContext, metadata: QueryMetadata, request: ListWorkspaceInboxRequest) -> Result<WorkspaceInboxResponse, SafeReadFailure>` | ListWorkspaceInbox；Step7对应完整port/Step8协议，遵守上述能力边界 |
| `pub async fn get_local_state(&self, actor: ActorContext, metadata: QueryMetadata, request: GetWorkspaceLocalStateRequest) -> Result<WorkspaceLocalStateResponse, SafeReadFailure>` | GetWorkspaceLocalState；Step7对应完整port/Step8协议，遵守上述能力边界 |
| `pub async fn get_operation_result(&self, actor: ActorContext, metadata: QueryMetadata, request: GetWorkspaceOperationResultRequest) -> Result<WorkspaceOperationResponse, SafeReadFailure>` | GetWorkspaceOperationResult；Step7对应完整port/Step8协议，遵守上述能力边界 |
| `pub async fn get_recovery_status(&self, actor: ActorContext, metadata: QueryMetadata, request: GetWorkspaceRecoveryStatusRequest) -> Result<WorkspaceRecoveryResponse, SafeReadFailure>` | GetWorkspaceRecoveryStatus；Step7对应完整port/Step8协议，遵守上述能力边界 |
| `pub async fn export_read_model(&self, actor: ActorContext, metadata: QueryMetadata, request: ExportWorkspaceReadModelRequest) -> Result<WorkspaceExportResponse, SafeReadFailure>` | ExportWorkspaceReadModel；Step7对应完整port/Step8协议，遵守上述能力边界 |

| 工厂签名 | 来源与初始条件 |
|---|---|
| `pub fn new(scope: Arc<ScopeService>, source: Arc<SourceReadService>, visibility: Arc<dyn VisibilityPort>, attention: Arc<dyn AttentionResolverPort>, read: Arc<dyn WorkspaceReadPort>, cursor: Arc<dyn WorkspaceCursorCodec>) -> Self` | 只接线，不读源、不建分区、不启动后台任务 |

不变量/禁止：各方法遵守Step5职责，依赖不得转交外层；Query无可写store与ID能力，source所有远端调用no-write。

Application组自检：context可选字段具有组合约束，source context不是权限凭证；七service依赖具名且Query无写；错误/方法/DTO下一Step具名补齐，不声称此片段独立可编译。

## Infra开工：装配状态不是运行就绪证明

能力→对象：观测adapter绑定→AdapterObservation(slot/availability/failure)→RuntimeBuilder.validate_bindings。输入为组装期配置/driver观测，输出仅缺失槽位诊断，无持久状态、无readiness verdict。具体RuntimeConfig/连接池/transport构造依赖Step11/14，当前不能伪造已选driver。只闭合稳定availability carrier，不把所有infra对象机械后推。

### AdapterAvailability

```rust
/// Describes a binding observation.
pub enum AdapterAvailability {
    /// A binding is configured, not proven ready.
    Bound,
    /// A configured dependency is unavailable.
    Unavailable,
    /// The owning contract is not bound.
    ContractBlocked,
}
```

| 变体 | Rustdoc / 作用 | 来源 / 去向 |
|---|---|---|
| `Bound` | A binding is configured, not proven ready. | 装配观测；不代表实际可用 |
| `Unavailable` | A configured dependency is unavailable. | 技术故障可重试 |
| `ContractBlocked` | The owning contract is not bound. | 外部缺口，不能fake allow |

### AdapterSlot

```rust
/// Names required dependency categories.
pub enum AdapterSlot {
    /// The Scope dependency category.
    Scope,
    /// The OwnerRead dependency category.
    OwnerRead,
    /// The Visibility dependency category.
    Visibility,
    /// The Attention dependency category.
    Attention,
    /// The Recovery dependency category.
    Recovery,
    /// The Event dependency category.
    Event,
    /// The Store dependency category.
    Store,
    /// The Cursor dependency category.
    Cursor,
    /// The Ids dependency category.
    Ids,
}
```

| 变体 | Rustdoc / 作用 | 来源 / 去向 |
|---|---|---|
| `Scope` | The Scope dependency category. | 配置选定；非业务状态 |
| `OwnerRead` | The OwnerRead dependency category. | 配置选定；非业务状态 |
| `Visibility` | The Visibility dependency category. | 配置选定；非业务状态 |
| `Attention` | The Attention dependency category. | 配置选定；非业务状态 |
| `Recovery` | The Recovery dependency category. | 配置选定；非业务状态 |
| `Event` | The Event dependency category. | 配置选定；非业务状态 |
| `Store` | The Store dependency category. | 配置选定；非业务状态 |
| `Cursor` | The Cursor dependency category. | 配置选定；非业务状态 |
| `Ids` | The Ids dependency category. | 配置选定；非业务状态 |

### AdapterObservation

位置：`crates/infra/src/runtime_builder.rs`。能力：Records one adapter binding observation.

```rust
/// Records one adapter binding observation.
pub struct AdapterObservation {
    /// Observed slot.
    slot: AdapterSlot,
    /// Binding classification.
    availability: AdapterAvailability,
    /// Redacted binding cause.
    failure: Option<SafeFailureCode>,
}
```

| 字段 | 类型 | 来源 / 约束 / optional |
|---|---|---|
| `slot` | `AdapterSlot` | 组装模块固定 |
| `availability` | `AdapterAvailability` | 绑定检查结果 |
| `failure` | `Option<SafeFailureCode>` | Bound必须None，其余Some；无连接串/secret |

| 成员签名 | 参数/返回/效果 |
|---|---|
| `pub fn validate(&self) -> Result<(), ContractError>` | 检查availability/failure组合 |

| 工厂签名 | 来源与初始条件 |
|---|---|
| `pub fn try_new(slot: AdapterSlot, availability: AdapterAvailability, failure: Option<SafeFailureCode>) -> Result<Self, ContractError>` | 无I/O，只组合验证 |

不变量/禁止：单观测不是health/就绪签署。

### RuntimeBuilder

位置：`crates/infra/src/runtime_builder.rs`。能力：Checks explicit runtime dependency bindings.

```rust
/// Checks explicit runtime dependency bindings.
pub struct RuntimeBuilder {
    /// Unique binding observations.
    observations: Vec<AdapterObservation>,
}
```

| 字段 | 类型 | 来源 / 约束 / optional |
|---|---|---|
| `observations` | `Vec<AdapterObservation>` | 按slot唯一；空意味着未观测，不是全就绪 |

| 成员签名 | 参数/返回/效果 |
|---|---|
| `pub fn record(&mut self, observation: AdapterObservation) -> Result<(), ContractError>` | 不重复slot |
| `pub fn validate_bindings(&self, required: &[AdapterSlot]) -> Result<(), ApplicationError>` | required缺少或非Bound都失败；不启动服务 |

| 工厂签名 | 来源与初始条件 |
|---|---|
| `pub fn new() -> Self` | 空集合；接线不自动建持久对象 |

不变量/禁止：build具体资源承接Step14；不建立额外runtime execution对象。

Infra组自检：availability/failure已有稳定carrier；driver配置/池由后续步骤，不设空RuntimeConfig假封口；gate=pass_with_deferred_technical_binding。

## Entry开工：六入口对象承接十四用例

问题：entry若共享通用写store会绕application规则。取舍：仅持有具名service，不持有ports；API认证主体由宿主注入，worker envelope必须适配校验，jobs是一次有界操作。无HTTP route/server，无发布/outbox；command/query/consumer/operations的响应由Step8闭合。

| 模块 | 对象→能力 | 字段/状态来源 | 后续 |
|---|---|---|---|
| api | CommandHandlers两command；QueryHandlers六query | composition root服务，无持久状态 | Step7方法、Step8 schema |
| worker | SourceChangeConsumer / SourceInvalidationConsumer | 一条正式消息到一个分区子操作；无自主授权 | Step7受信event port与delivery disposition |
| jobs | RecoveryHandlers三恢复；InvalidationHandler一次失效 | 显式Operations参数，无后台循环 | Step8 result/unknown |

### CommandHandlers

位置：`crates/api/src/command_handlers.rs`。能力：Routes typed invocations to application services.

```rust
/// Routes typed invocations to application services.
pub struct CommandHandlers {
    /// Injected partition service.
    partition: Arc<PartitionService>,
    /// Injected local service.
    local: Arc<LocalAttentionService>,
}
```

| 字段 | 类型 | 来源 / 约束 / optional |
|---|---|---|
| `partition` | `Arc<PartitionService>` | 宿主/本模块composition root注入 |
| `local` | `Arc<LocalAttentionService>` | 宿主/本模块composition root注入 |

| 成员签名 | 参数/返回/效果 |
|---|---|
| `pub async fn provision(&self, actor: ActorContext, metadata: CommandMetadata, request: ProvisionWorkspacePartitionRequest) -> Result<WorkspaceWriteResult, SafeReadFailure>` | ProvisionWorkspacePartition；校验metadata，调用唯一同名application方法 |
| `pub async fn change_local(&self, actor: ActorContext, metadata: CommandMetadata, request: ChangeWorkspaceLocalStateRequest) -> Result<WorkspaceWriteResult, SafeReadFailure>` | ChangeWorkspaceLocalState；校验metadata，调用唯一同名application方法 |

| 工厂签名 | 来源与初始条件 |
|---|---|
| `pub fn new(partition: Arc<PartitionService>, local: Arc<LocalAttentionService>) -> Self` | 仅接线，无隐式spawn/调用 |

不变量/禁止：不是业务truth owner；入口对象无生命周期状态机，delivery结果不等bus ACK已发生。

### QueryHandlers

位置：`crates/api/src/query_handlers.rs`。能力：Routes typed invocations to application services.

```rust
/// Routes typed invocations to application services.
pub struct QueryHandlers {
    /// Injected query service.
    query: Arc<WorkspaceQueryService>,
}
```

| 字段 | 类型 | 来源 / 约束 / optional |
|---|---|---|
| `query` | `Arc<WorkspaceQueryService>` | 宿主/本模块composition root注入 |

| 成员签名 | 参数/返回/效果 |
|---|---|
| `pub async fn get_view(&self, actor: ActorContext, metadata: QueryMetadata, request: GetWorkspaceViewRequest) -> Result<WorkspaceViewResponse, SafeReadFailure>` | GetWorkspaceView；校验metadata，调用唯一同名application方法 |
| `pub async fn list_inbox(&self, actor: ActorContext, metadata: QueryMetadata, request: ListWorkspaceInboxRequest) -> Result<WorkspaceInboxResponse, SafeReadFailure>` | ListWorkspaceInbox；校验metadata，调用唯一同名application方法 |
| `pub async fn get_local_state(&self, actor: ActorContext, metadata: QueryMetadata, request: GetWorkspaceLocalStateRequest) -> Result<WorkspaceLocalStateResponse, SafeReadFailure>` | GetWorkspaceLocalState；校验metadata，调用唯一同名application方法 |
| `pub async fn get_operation_result(&self, actor: ActorContext, metadata: QueryMetadata, request: GetWorkspaceOperationResultRequest) -> Result<WorkspaceOperationResponse, SafeReadFailure>` | GetWorkspaceOperationResult；校验metadata，调用唯一同名application方法 |
| `pub async fn get_recovery_status(&self, actor: ActorContext, metadata: QueryMetadata, request: GetWorkspaceRecoveryStatusRequest) -> Result<WorkspaceRecoveryResponse, SafeReadFailure>` | GetWorkspaceRecoveryStatus；校验metadata，调用唯一同名application方法 |
| `pub async fn export_read_model(&self, actor: ActorContext, metadata: QueryMetadata, request: ExportWorkspaceReadModelRequest) -> Result<WorkspaceExportResponse, SafeReadFailure>` | ExportWorkspaceReadModel；校验metadata，调用唯一同名application方法 |

| 工厂签名 | 来源与初始条件 |
|---|---|
| `pub fn new(query: Arc<WorkspaceQueryService>) -> Self` | 仅接线，无隐式spawn/调用 |

不变量/禁止：不是业务truth owner；入口对象无生命周期状态机，delivery结果不等bus ACK已发生。

### SourceChangeConsumer

位置：`crates/worker/src/source_change_consumer.rs`。能力：Routes typed invocations to application services.

```rust
/// Routes typed invocations to application services.
pub struct SourceChangeConsumer {
    /// Injected apply service.
    apply: Arc<ProjectionApplyService>,
}
```

| 字段 | 类型 | 来源 / 约束 / optional |
|---|---|---|
| `apply` | `Arc<ProjectionApplyService>` | 宿主/本模块composition root注入 |

| 成员签名 | 参数/返回/效果 |
|---|---|
| `pub async fn consume_change(&self, actor: ActorContext, request: ConsumeSourceChangeRequest) -> Result<SourceChangeReceipt, SafeReadFailure>` | ConsumeSourceChange；校验metadata，调用唯一同名application方法 |

| 工厂签名 | 来源与初始条件 |
|---|---|
| `pub fn new(apply: Arc<ProjectionApplyService>) -> Self` | 仅接线，无隐式spawn/调用 |

不变量/禁止：不是业务truth owner；入口对象无生命周期状态机，delivery结果不等bus ACK已发生。

### SourceInvalidationConsumer

位置：`crates/worker/src/source_invalidation_consumer.rs`。能力：Routes typed invocations to application services.

```rust
/// Routes typed invocations to application services.
pub struct SourceInvalidationConsumer {
    /// Injected recovery service.
    recovery: Arc<RecoveryService>,
}
```

| 字段 | 类型 | 来源 / 约束 / optional |
|---|---|---|
| `recovery` | `Arc<RecoveryService>` | 宿主/本模块composition root注入 |

| 成员签名 | 参数/返回/效果 |
|---|---|
| `pub async fn consume_invalidation(&self, actor: ActorContext, request: ConsumeSourceInvalidationRequest) -> Result<SourceInvalidationPageReceipt, SafeReadFailure>` | ConsumeSourceInvalidation；校验metadata，调用唯一同名application方法 |

| 工厂签名 | 来源与初始条件 |
|---|---|
| `pub fn new(recovery: Arc<RecoveryService>) -> Self` | 仅接线，无隐式spawn/调用 |

不变量/禁止：不是业务truth owner；入口对象无生命周期状态机，delivery结果不等bus ACK已发生。

### RecoveryHandlers

位置：`crates/jobs/src/recovery_handlers.rs`。能力：Routes typed invocations to application services.

```rust
/// Routes typed invocations to application services.
pub struct RecoveryHandlers {
    /// Injected recovery service.
    recovery: Arc<RecoveryService>,
}
```

| 字段 | 类型 | 来源 / 约束 / optional |
|---|---|---|
| `recovery` | `Arc<RecoveryService>` | 宿主/本模块composition root注入 |

| 成员签名 | 参数/返回/效果 |
|---|---|
| `pub async fn request_recovery(&self, actor: ActorContext, metadata: RequestMetadata, request: RequestWorkspaceRecoveryRequest) -> Result<WorkspaceWriteResult, SafeReadFailure>` | RequestWorkspaceRecovery；校验metadata，调用唯一同名application方法 |
| `pub async fn advance_recovery(&self, actor: ActorContext, metadata: RequestMetadata, request: AdvanceWorkspaceRecoveryRequest) -> Result<WorkspaceWriteResult, SafeReadFailure>` | AdvanceWorkspaceRecovery；校验metadata，调用唯一同名application方法 |
| `pub async fn supersede_recovery(&self, actor: ActorContext, metadata: RequestMetadata, request: SupersedeWorkspaceRecoveryRequest) -> Result<WorkspaceWriteResult, SafeReadFailure>` | SupersedeWorkspaceRecovery；校验metadata，调用唯一同名application方法 |

| 工厂签名 | 来源与初始条件 |
|---|---|
| `pub fn new(recovery: Arc<RecoveryService>) -> Self` | 仅接线，无隐式spawn/调用 |

不变量/禁止：不是业务truth owner；入口对象无生命周期状态机，delivery结果不等bus ACK已发生。

### InvalidationHandler

位置：`crates/jobs/src/invalidation_handler.rs`。能力：Routes typed invocations to application services.

```rust
/// Routes typed invocations to application services.
pub struct InvalidationHandler {
    /// Injected recovery service.
    recovery: Arc<RecoveryService>,
}
```

| 字段 | 类型 | 来源 / 约束 / optional |
|---|---|---|
| `recovery` | `Arc<RecoveryService>` | 宿主/本模块composition root注入 |

| 成员签名 | 参数/返回/效果 |
|---|---|
| `pub async fn invalidate_view(&self, actor: ActorContext, metadata: RequestMetadata, request: InvalidateWorkspaceViewRequest) -> Result<WorkspaceWriteResult, SafeReadFailure>` | InvalidateWorkspaceView；校验metadata，调用唯一同名application方法 |

| 工厂签名 | 来源与初始条件 |
|---|---|
| `pub fn new(recovery: Arc<RecoveryService>) -> Self` | 仅接线，无隐式spawn/调用 |

不变量/禁止：不是业务truth owner；入口对象无生命周期状态机，delivery结果不等bus ACK已发生。

## 非core闭口与后续清单

| 组 | 当前闭口 | 命名承接/阻塞 |
|---|---|---|
| context/services/entries | 字段、构造、能力与调用边界 | Step7完整callable、ports；Step8 DTO/result |
| infra availability | enum/observation/builder | Step14配置binding与完整build；Step11 driver/原子能力 |
| local commit/read helper | 领域support与stored result | Step7 typed snapshot/commit outcome，不增加持久truth |
| public job/consumer/read carriers | 已定14用例与状态来源 | Step8按协议构造；尚未出现唯一未知job truth对象 |

## 跨组审查与回填

所有domain support位于domain文件；application仅组合，不在contracts引用domain；七服务和六入口构造无副作用。Step7具名callable已回填各service/entry卡，不保留占位成员表。状态审计：context/service/entry无持久状态，adapter availability仅当前观测，失败不泄露配置。历史审计：不继承governance publisher/handoff/Outbox、API server或万能runtime。回填正式§5非core对象卡与闭口摘要；本批gate=pass_with_named_step7_8_11_14_handoffs。

## 只读成员访问闭口（Step9回源审查）

按每个对象字段表展开只读访问。已有同名成员沿用对象卡的签名；下表补其余字段，不重复定义。service/entry的DI依赖不公开getter，不能借此穿透Query能力隔离。每个下列函数rustdoc为`/// Returns the immutable field value.`；不提供可写借用，不替代可信工厂。

| 对象 | 完整只读签名 | 约束 |
|---|---|---|
| CutoverBasis | `pub fn partition(&self) -> &WorkspacePartitionId` | 只读；实现按显式导出，非授权能力 |
| CutoverBasis | `pub fn expected_partition(&self) -> &PartitionVersion` | 只读；实现按显式导出，非授权能力 |
| CutoverBasis | `pub fn old_current(&self) -> &Option<GenerationId>` | 只读；实现按显式导出，非授权能力 |
| CutoverBasis | `pub fn candidate(&self) -> &GenerationId` | 只读；实现按显式导出，非授权能力 |
| CutoverBasis | `pub fn candidate_revision(&self) -> &ViewRevision` | 只读；实现按显式导出，非授权能力 |
| CutoverBasis | `pub fn attempt(&self) -> &RebuildAttemptId` | 只读；实现按显式导出，非授权能力 |
| CutoverBasis | `pub fn expected_attempt(&self) -> &AttemptVersion` | 只读；实现按显式导出，非授权能力 |
| CutoverBasis | `pub fn coverage(&self) -> &Vec<OwnerCoverageProof>` | 只读；实现按显式导出，非授权能力 |
| CutoverBasis | `pub fn visibility(&self) -> &Vec<VisibilityBinding>` | 只读；实现按显式导出，非授权能力 |
| CutoverBasis | `pub fn observed_invalidations(&self) -> &Vec<InvalidationId>` | 只读；实现按显式导出，非授权能力 |
| ExistingWorkspaceTargetSet | `pub fn partition(&self) -> &WorkspacePartitionId` | 只读；实现按显式导出，非授权能力 |
| ExistingWorkspaceTargetSet | `pub fn generations(&self) -> &Vec<GenerationId>` | 只读；实现按显式导出，非授权能力 |
| ExistingWorkspaceTargetSet | `pub fn sources(&self) -> &Vec<SourceStreamRef>` | 只读；实现按显式导出，非授权能力 |
| WorkspaceReadContext | `pub fn principal(&self) -> &ActorId` | 只读；实现按显式导出，非授权能力 |
| WorkspaceReadContext | `pub fn partition(&self) -> &WorkspacePartitionId` | 只读；实现按显式导出，非授权能力 |
| WorkspaceReadContext | `pub fn generation(&self) -> &GenerationId` | 只读；实现按显式导出，非授权能力 |
| WorkspaceReadContext | `pub fn view(&self) -> &ViewRevision` | 只读；实现按显式导出，非授权能力 |
| WorkspaceReadContext | `pub fn local(&self) -> &LocalReadBasis` | 只读；实现按显式导出，非授权能力 |
| WorkspaceReadContext | `pub fn query(&self) -> &QueryBinding` | 只读；实现按显式导出，非授权能力 |
| WorkspaceReadContext | `pub fn visibility(&self) -> &VisibilityContextRef` | 只读；实现按显式导出，非授权能力 |
| WorkspaceReadInputs | `pub fn scope(&self) -> &WorkspaceScope` | 只读；实现按显式导出，非授权能力 |
| WorkspaceReadInputs | `pub fn basis(&self) -> &WorkspaceReadBasis` | 只读；实现按显式导出，非授权能力 |
| WorkspaceReadInputs | `pub fn items(&self) -> &Vec<SafeWorkspaceItem>` | 只读；实现按显式导出，非授权能力 |
| WorkspaceReadInputs | `pub fn provenance(&self) -> &Vec<SafeProvenance>` | 只读；实现按显式导出，非授权能力 |
| WorkspaceReadInputs | `pub fn freshness(&self) -> &DataFreshness` | 只读；实现按显式导出，非授权能力 |
| WorkspaceReadInputs | `pub fn coverage(&self) -> &ReadCoverage` | 只读；实现按显式导出，非授权能力 |
| WorkspaceReadInputs | `pub fn next(&self) -> &Option<WorkspacePageCursor>` | 只读；实现按显式导出，非授权能力 |
| LocalChangeResolution | `pub fn partition(&self) -> &WorkspacePartitionId` | 只读；实现按显式导出，非授权能力 |
| LocalChangeResolution | `pub fn scope(&self) -> &WorkspaceScope` | 只读；实现按显式导出，非授权能力 |
| LocalChangeResolution | `pub fn attention(&self) -> &Option<AttentionIdentityResolution>` | 只读；实现按显式导出，非授权能力 |
| LocalChangeResolution | `pub fn subject_visibility(&self) -> &Option<VisibilityBinding>` | 只读；实现按显式导出，非授权能力 |
| WorkspaceOperationContext | `pub fn actor(&self) -> &ActorContext` | 只读；实现按显式导出，非授权能力 |
| WorkspaceOperationContext | `pub fn metadata(&self) -> &RequestMetadata` | 只读；实现按显式导出，非授权能力 |
| WorkspaceOperationContext | `pub fn scope(&self) -> &WorkspaceScope` | 只读；实现按显式导出，非授权能力 |
| WorkspaceOperationContext | `pub fn key(&self) -> &Option<WorkspaceOperationKey>` | 只读；实现按显式导出，非授权能力 |
| WorkspaceOperationContext | `pub fn digest(&self) -> &Option<SafeInputDigest>` | 只读；实现按显式导出，非授权能力 |
| WorkspaceOperationContext | `pub fn commit_attempt(&self) -> &Option<CommitAttemptId>` | 只读；实现按显式导出，非授权能力 |
| SourceContext | `pub fn actor(&self) -> &ActorContext` | 只读；实现按显式导出，非授权能力 |
| SourceContext | `pub fn metadata(&self) -> &RequestMetadata` | 只读；实现按显式导出，非授权能力 |
| SourceContext | `pub fn key(&self) -> &SourceApplicationKey` | 只读；实现按显式导出，非授权能力 |
| SourceContext | `pub fn digest(&self) -> &SafeInputDigest` | 只读；实现按显式导出，非授权能力 |
| SourceContext | `pub fn commit_attempt(&self) -> &CommitAttemptId` | 只读；实现按显式导出，非授权能力 |
| AdapterObservation | `pub fn slot(&self) -> &AdapterSlot` | 只读；实现按显式导出，非授权能力 |
| AdapterObservation | `pub fn availability(&self) -> &AdapterAvailability` | 只读；实现按显式导出，非授权能力 |
| AdapterObservation | `pub fn failure(&self) -> &Option<SafeFailureCode>` | 只读；实现按显式导出，非授权能力 |
| RuntimeBuilder | `pub fn observations(&self) -> &Vec<AdapterObservation>` | 只读；实现按显式导出，非授权能力 |

## 后续已闭合词汇登记（不新增生命周期）

Step7的ApplicationError、WorkspaceSnapshot/RecoverySnapshot/SourceTargetSnapshot、InvalidationTargetSnapshot、BaselineApplicationBinding与commit batches归application；字段/构造完整卡片以Step7为唯一详细来源。Step8的WriteDelivery、LocalStateSurface、SourceChangeReceipt、SourceInvalidationReceipt与PageReceipt属于contracts公开结果分类；字段/schema以Step8为准，Step10只分类不新增持久状态机。6C服务/入口成员已回填全部具名签名。完整boxed-future trait、typed source slots、Core QueryConsistency只Eventual的限制见Step7/8。
