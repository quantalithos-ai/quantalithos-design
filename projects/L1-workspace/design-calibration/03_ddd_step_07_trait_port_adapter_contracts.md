# Step 7. 逐模块Trait / Port / Adapter契约

## 1. Step状态

状态：[x] completed；gate_status=pass_with_external_slots；前序已完成；formal_fill_allowed=false；仅设计，最多到Step10。

## 2. 输入

Step5/6及附录、02 §7~12、01依赖方向；详细设计SOP Step7、书写§5.5/5.6；governance Step7 application读取/visibility/结果回读/adapter与模块审计章节。

## 3. SOP问题回答

1~4：application唯一port owner，infra实现，domain无I/O，entry只调用service。5~8：本步逐端口给完整输入/输出/error以及读写配对和expected轴。9~11：跨层只能port，逐模块审查后做接缝矩阵。

## 4. 诊断

generic save或只列repository名字无法证明no-write/unknown结果/切换原子；采用只读WorkspaceReadPort与具名WorkspaceAtomicStore提交函数，所有unknown回读权威结果。异步trait需dyn对象安全，不能把native async trait直接当dyn使用。

## 5. 前后对比

此前语义/对象轮廓→本步具名合同；保留上游slot blocker，不把本地设计通过当正向集成闭合。

## 6. 取舍

逐模块/协议族/入口/状态主语小循环，先依据/问题/诊断/取舍，再合同与自检；不照搬governance业务对象。

## 7. 结构化产物

### 7.1 contracts/domain停审与application开工

contracts/domain不定义I/O trait；contracts载协议词汇，domain纯工厂/迁移/校验。应用层按scope→owner输入→store→service顺序。来源为6A局部词汇、6B对象字段与6C依赖，不复制governance Outbox/handoff。所有方法只读，除WorkspaceAtomicStore显式写面与本地IdPort随机生成；owner ports全为no-write。

| capability / 字段来源 | port | 调用方 | 实现方 | 后续 |
|---|---|---|---|---|
| scope/current actor关系 | ScopeResolverPort | ScopeService | scope_adapter | DTO scope/每流首步 |
| safe source/visibility/attention | OwnerReadPort、VisibilityPort、AttentionResolverPort | SourceRead/Query/Local | owner_source/visibility adapters | 裁剪与意图映射 |
| event identity/order/invalidations | SourceEventPort | Apply/Recovery | bus_subscription+owner适配 | 来源输入验证 |
| baseline/续读 | RecoverySourcePort | Recovery | recovery_source_adapter | 有界Advance |
| 同snapshot读/结果lookup/目标枚举 | WorkspaceReadPort | 七service按需 | store_adapter读能力 | 所有DTO/expected来源 |
| 单分区原子变更 | WorkspaceAtomicStore | 四写service | store_adapter写能力 | Step11实体schema |
| 局部ID / 页token | IdPort、WorkspaceCursorCodec | 写service / Query | runtime_builder / store_adapter内技术实现 | Step14绑定，不新文件 |

### 7.2 application typed helpers与对象安全

诊断：native async trait不能直接形成dyn对象。选定标准库boxed Send future；不因此引入未pin的宏库。所有外部slot结果必须由正式adapter验证，None只“没有对象”，不隐含allow。下列pub字段仅为application-private协作载体，不是外部反序列化schema；构造检查同表。对象support归store_ports/source_ports，不流入contracts。

```rust
/// Object-safe asynchronous port result.
pub type PortFuture<'a, T> = std::pin::Pin<Box<dyn std::future::Future<Output = Result<T, ApplicationError>> + Send + 'a>>;
```

### ApplicationError

归属：`crates/application/src/errors.rs`；内部错误，仅由Step8安全映射输出。

```rust
/// Classifies internal application failures.
pub enum ApplicationError {
    /// Reports InvalidInput without an external body.
    InvalidInput,
    /// Reports ScopeUnavailable without an external body.
    ScopeUnavailable,
    /// Reports VisibilityUnavailable without an external body.
    VisibilityUnavailable,
    /// Reports ContractBlocked without an external body.
    ContractBlocked,
    /// Reports SourceUnavailable without an external body.
    SourceUnavailable,
    /// Reports NotFound without an external body.
    NotFound,
    /// Reports Conflict without an external body.
    Conflict,
    /// Reports CursorInvalid without an external body.
    CursorInvalid,
    /// Reports SafetyBlocked without an external body.
    SafetyBlocked,
    /// Reports OutcomeUnknown without an external body.
    OutcomeUnknown,
    /// Reports StorageUnavailable without an external body.
    StorageUnavailable,
    /// Reports InvariantViolation without an external body.
    InvariantViolation,
}
```

| 变体 | Rustdoc / 作用 | 来源 / 去向 |
|---|---|---|
| `InvalidInput` | Reports InvalidInput without an external body. | 内部分类→Step8安全映射；不得直接序列化内部详情 |
| `ScopeUnavailable` | Reports ScopeUnavailable without an external body. | 内部分类→Step8安全映射；不得直接序列化内部详情 |
| `VisibilityUnavailable` | Reports VisibilityUnavailable without an external body. | 内部分类→Step8安全映射；不得直接序列化内部详情 |
| `ContractBlocked` | Reports ContractBlocked without an external body. | 内部分类→Step8安全映射；不得直接序列化内部详情 |
| `SourceUnavailable` | Reports SourceUnavailable without an external body. | 内部分类→Step8安全映射；不得直接序列化内部详情 |
| `NotFound` | Reports NotFound without an external body. | 内部分类→Step8安全映射；不得直接序列化内部详情 |
| `Conflict` | Reports Conflict without an external body. | 内部分类→Step8安全映射；不得直接序列化内部详情 |
| `CursorInvalid` | Reports CursorInvalid without an external body. | 内部分类→Step8安全映射；不得直接序列化内部详情 |
| `SafetyBlocked` | Reports SafetyBlocked without an external body. | 内部分类→Step8安全映射；不得直接序列化内部详情 |
| `OutcomeUnknown` | Reports OutcomeUnknown without an external body. | 内部分类→Step8安全映射；不得直接序列化内部详情 |
| `StorageUnavailable` | Reports StorageUnavailable without an external body. | 内部分类→Step8安全映射；不得直接序列化内部详情 |
| `InvariantViolation` | Reports InvariantViolation without an external body. | 内部分类→Step8安全映射；不得直接序列化内部详情 |

### WorkspaceSnapshot

位置：`crates/application/src/store_ports.rs`。能力：Returns one coherent committed local snapshot.

```rust
/// Returns one coherent committed local snapshot.
pub struct WorkspaceSnapshot {
    /// Validated partition input.
    partition: WorkspacePartition,
    /// Validated generation input.
    generation: Option<GenerationState>,
    /// Validated projection input.
    projection: Option<PartitionProjection>,
    /// Validated local input.
    local: Option<LocalAttentionState>,
    /// Validated invalidations input.
    invalidations: Vec<InvalidationRecord>,
}
```

| 字段 | 类型 | 来源 / 约束 / optional |
|---|---|---|
| `partition` | `WorkspacePartition` | 唯一目标/含partition version |
| `generation` | `Option<GenerationState>` | current=None则None |
| `projection` | `Option<PartitionProjection>` | 与current同世代；未构建None |
| `local` | `Option<LocalAttentionState>` | Absent不初始化 |
| `invalidations` | `Vec<InvalidationRecord>` | 同快照，完整当前目标/source安全记录 |

| 成员签名 | 参数/返回/效果 |
|---|---|
| `pub fn validate(&self) -> Result<(), ApplicationError>` | 拒绝错配/不完整；无I/O |

| 工厂签名 | 来源与初始条件 |
|---|---|
| `pub fn try_new(partition: WorkspacePartition, generation: Option<GenerationState>, projection: Option<PartitionProjection>, local: Option<LocalAttentionState>, invalidations: Vec<InvalidationRecord>) -> Result<Self, ApplicationError>` | adapter已核验数据后创建；禁止来自外部JSON直接构造 |

不变量/禁止：不宣称与owner跨系统原子；WorkspaceSnapshot内部须单一读事务，不能拼接多次无版本读。

### RecoverySnapshot

位置：`crates/application/src/store_ports.rs`。能力：Returns all local cutover preconditions.

```rust
/// Returns all local cutover preconditions.
pub struct RecoverySnapshot {
    /// Validated workspace input.
    workspace: WorkspaceSnapshot,
    /// Validated attempt input.
    attempt: RebuildAttempt,
    /// Validated candidate input.
    candidate: GenerationState,
    /// Validated candidate_projection input.
    candidate_projection: PartitionProjection,
    /// Validated active_attempts input.
    active_attempts: Vec<RebuildAttemptId>,
}
```

| 字段 | 类型 | 来源 / 约束 / optional |
|---|---|---|
| `workspace` | `WorkspaceSnapshot` | 同分区一致读 |
| `attempt` | `RebuildAttempt` | 含expected attempt |
| `candidate` | `GenerationState` | 对应candidate，非workspace current替身 |
| `candidate_projection` | `PartitionProjection` | 同候选快照 |
| `active_attempts` | `Vec<RebuildAttemptId>` | 同partition的非终态尝试，用于替代/并发检查 |

| 成员签名 | 参数/返回/效果 |
|---|---|
| `pub fn validate(&self) -> Result<(), ApplicationError>` | 拒绝错配/不完整；无I/O |

| 工厂签名 | 来源与初始条件 |
|---|---|
| `pub fn try_new(workspace: WorkspaceSnapshot, attempt: RebuildAttempt, candidate: GenerationState, candidate_projection: PartitionProjection, active_attempts: Vec<RebuildAttemptId>) -> Result<Self, ApplicationError>` | adapter已核验数据后创建；禁止来自外部JSON直接构造 |

不变量/禁止：不宣称与owner跨系统原子；WorkspaceSnapshot内部须单一读事务，不能拼接多次无版本读。

### AffectedTargetPage

位置：`crates/application/src/store_ports.rs`。能力：Returns internal partition fanout targets.

```rust
/// Returns internal partition fanout targets.
pub struct AffectedTargetPage {
    /// Validated items input.
    items: Vec<ExistingWorkspaceTargetSet>,
    /// Validated next input.
    next: Option<WorkspacePartitionId>,
}
```

| 字段 | 类型 | 来源 / 约束 / optional |
|---|---|---|
| `items` | `Vec<ExistingWorkspaceTargetSet>` | store已有目标，可空 |
| `next` | `Option<WorkspacePartitionId>` | 按本地UUID bytes唯一升序seek；None终页 |

| 成员签名 | 参数/返回/效果 |
|---|---|
| `pub fn validate(&self) -> Result<(), ApplicationError>` | 拒绝错配/不完整；无I/O |

| 工厂签名 | 来源与初始条件 |
|---|---|
| `pub fn try_new(items: Vec<ExistingWorkspaceTargetSet>, next: Option<WorkspacePartitionId>) -> Result<Self, ApplicationError>` | adapter已核验数据后创建；禁止来自外部JSON直接构造 |

不变量/禁止：不宣称与owner跨系统原子；WorkspaceSnapshot内部须单一读事务，不能拼接多次无版本读。

### SourceEvaluation

位置：`crates/application/src/source_ports.rs`。能力：Carries validated source application inputs.

```rust
/// Carries validated source application inputs.
pub struct SourceEvaluation {
    /// Validated slice input.
    slice: SourceSlice,
    /// Validated mode input.
    mode: SourceUpdateMode,
    /// Validated coverage input.
    coverage: SourceCoverage,
    /// Validated attention input.
    attention: Vec<OwnerAttentionInput>,
}
```

| 字段 | 类型 | 来源 / 约束 / optional |
|---|---|---|
| `slice` | `SourceSlice` | owner safe read |
| `mode` | `SourceUpdateMode` | 正式范围替换/delta |
| `coverage` | `SourceCoverage` | owner正式cursor/coverage映射 |
| `attention` | `Vec<OwnerAttentionInput>` | 仅owner明示，可空 |

| 成员签名 | 参数/返回/效果 |
|---|---|
| `pub fn validate(&self) -> Result<(), ApplicationError>` | 拒绝错配/不完整；无I/O |

| 工厂签名 | 来源与初始条件 |
|---|---|
| `pub fn try_new(slice: SourceSlice, mode: SourceUpdateMode, coverage: SourceCoverage, attention: Vec<OwnerAttentionInput>) -> Result<Self, ApplicationError>` | adapter已核验数据后创建；禁止来自外部JSON直接构造 |

不变量/禁止：不宣称与owner跨系统原子；WorkspaceSnapshot内部须单一读事务，不能拼接多次无版本读。

### RecoveryBatch

位置：`crates/application/src/source_ports.rs`。能力：Carries one formally bounded recovery batch.

```rust
/// Carries one formally bounded recovery batch.
pub struct RecoveryBatch {
    /// Validated baseline input.
    baseline: OwnerBaselineBasis,
    /// Validated continuation input.
    continuation: Option<OwnerBaselineContinuation>,
    /// Validated evaluations input.
    evaluations: Vec<SourceEvaluation>,
    /// Validated phase_complete input.
    phase_complete: bool,
}
```

| 字段 | 类型 | 来源 / 约束 / optional |
|---|---|---|
| `baseline` | `OwnerBaselineBasis` | owner正式baseline |
| `continuation` | `Option<OwnerBaselineContinuation>` | 未完成必Some |
| `evaluations` | `Vec<SourceEvaluation>` | 同candidate/声明范围 |
| `phase_complete` | `bool` | 仅正式proof派生，非调用方传入 |

| 成员签名 | 参数/返回/效果 |
|---|---|
| `pub fn validate(&self) -> Result<(), ApplicationError>` | 拒绝错配/不完整；无I/O |

| 工厂签名 | 来源与初始条件 |
|---|---|
| `pub fn try_new(baseline: OwnerBaselineBasis, continuation: Option<OwnerBaselineContinuation>, evaluations: Vec<SourceEvaluation>, phase_complete: bool) -> Result<Self, ApplicationError>` | adapter已核验数据后创建；禁止来自外部JSON直接构造 |

不变量/禁止：不宣称与owner跨系统原子；WorkspaceSnapshot内部须单一读事务，不能拼接多次无版本读。

### SourceRelation

归属：`crates/application/src/source_ports.rs`。

```rust
/// Classifies only owner-proven source order.
pub enum SourceRelation {
    /// Carries a proven applicable slice and coverage.
    Applicable(SourceEvaluation),
    /// Carries an owner-proven obsolete input basis.
    Late(SourceCursorBasis),
    /// Carries a proven missing-range basis.
    Gap(SourceCursorBasis),
    /// No formal comparison is available.
    Blocked,
}
```

| 变体 | Rustdoc / 作用 | 来源 / 去向 |
|---|---|---|
| `Applicable(SourceEvaluation)` | Carries a proven applicable slice and coverage. | 正式连续输入 |
| `Late(SourceCursorBasis)` | Carries an owner-proven obsolete input basis. | 不改变已领先cursor |
| `Gap(SourceCursorBasis)` | Carries a proven missing-range basis. | 不占成功键 |
| `Blocked` | No formal comparison is available. | 无owner比较合同 |

外部slot新增登记：TrustedSourceChange、TrustedSourceInvalidation、OwnerReadRequest、OwnerEventOrderingInput均属001/002/003；它们的exact envelope/schema/有效性由owner+bus正式绑定，当前不能独立编译或实现正向适配，绝不以opaque String代替。AttentionStreamRef已在6A登记。SourceRelation是本地结果分类，不定义来源顺序。

### 7.3 scope/source端口合同

#### ScopeResolverPort

位置：`crates/application/src/scope_ports.rs`。

```rust
/// Defines the ScopeResolverPort capability boundary.
pub trait ScopeResolverPort: Send + Sync {
    /// Resolves current scope without writing.
    fn resolve<'a>(&'a self, actor: &'a ActorContext, selector: &'a ScopeSelector) -> PortFuture<'a, OwnerScopeResolution>;
    /// Checks the owning decision for one local operation.
    fn authorize_operation<'a>(&'a self, actor: &'a ActorContext, scope: &'a WorkspaceScope, kind: OperationKind) -> PortFuture<'a, ()>;
}
```

| 方法 | 参数/返回/错误与效果 |
|---|---|
| `resolve<'a>(&'a self, actor: &'a ActorContext, selector: &'a ScopeSelector) -> PortFuture<'a, OwnerScopeResolution>` | 只读正式身份/project membership；System/Integration不自动绕membership；005/003未闭合ContractBlocked |
| `authorize_operation<'a>(&'a self, actor: &'a ActorContext, scope: &'a WorkspaceScope, kind: OperationKind) -> PortFuture<'a, ()>` | owning chain正式决定，不能workspace自建role规则；无正式维护决定时blocked |

#### OwnerReadPort

位置：`crates/application/src/source_ports.rs`。

```rust
/// Defines the OwnerReadPort capability boundary.
pub trait OwnerReadPort: Send + Sync {
    /// Reads an owner-safe slice.
    fn read<'a>(&'a self, actor: &'a ActorContext, scope: &'a WorkspaceScope, request: &'a OwnerReadRequest) -> PortFuture<'a, OwnerSafeReadResult>;
}
```

| 方法 | 参数/返回/错误与效果 |
|---|---|
| `read<'a>(&'a self, actor: &'a ActorContext, scope: &'a WorkspaceScope, request: &'a OwnerReadRequest) -> PortFuture<'a, OwnerSafeReadResult>` | 所有RPC只查询，无mark_read/refresh/写cache；请求/结果schema 001 blocked |

#### VisibilityPort

位置：`crates/application/src/source_ports.rs`。

```rust
/// Defines the VisibilityPort capability boundary.
pub trait VisibilityPort: Send + Sync {
    /// Validates a formal invalidation basis against exact local targets.
    fn validate_invalidation<'a>(&'a self, actor: &'a ActorContext, scope: &'a WorkspaceScope, basis: &'a InvalidationBasis, targets: &'a ExistingWorkspaceTargetSet) -> PortFuture<'a, InvalidationBasis>;
    /// Binds an owner-safe result before constructing a SourceSlice.
    fn bind_result<'a>(&'a self, actor: &'a ActorContext, scope: &'a WorkspaceScope, result: &'a OwnerSafeReadResult) -> PortFuture<'a, VisibilityBinding>;
    /// Resolves current list and scope visibility.
    fn resolve<'a>(&'a self, actor: &'a ActorContext, scope: &'a WorkspaceScope, selection: &'a ReadSelection) -> PortFuture<'a, OwnerVisibilityResolution>;
    /// Binds each source slice to current owning decisions.
    fn bind_slice<'a>(&'a self, actor: &'a ActorContext, scope: &'a WorkspaceScope, slice: &'a SourceSlice) -> PortFuture<'a, VisibilityBinding>;
    /// Binds one referenced subject.
    fn bind_subject<'a>(&'a self, actor: &'a ActorContext, scope: &'a WorkspaceScope, subject: &'a OwnerSubjectRef) -> PortFuture<'a, VisibilityBinding>;
    /// Rechecks validity at the output or cutover barrier.
    fn revalidate<'a>(&'a self, actor: &'a ActorContext, scope: &'a WorkspaceScope, bindings: &'a [VisibilityBinding]) -> PortFuture<'a, VisibilityContextRef>;
}
```

| 方法 | 参数/返回/错误与效果 |
|---|---|
| `bind_result<'a>(&'a self, actor: &'a ActorContext, scope: &'a WorkspaceScope, result: &'a OwnerSafeReadResult) -> PortFuture<'a, VisibilityBinding>` | 先读正式safe result再取对应当前binding，消除SourceSlice构造循环；错误ContractBlocked/VisibilityUnavailable |
| `validate_invalidation<'a>(&'a self, actor: &'a ActorContext, scope: &'a WorkspaceScope, basis: &'a InvalidationBasis, targets: &'a ExistingWorkspaceTargetSet) -> PortFuture<'a, InvalidationBasis>` | 同actor/scope/target/current proof；LocalDataStale不得升格安全失效 |
| `resolve<'a>(&'a self, actor: &'a ActorContext, scope: &'a WorkspaceScope, selection: &'a ReadSelection) -> PortFuture<'a, OwnerVisibilityResolution>` | 包括空页list权限；只能owning决定，不本地计算授权 |
| `bind_slice<'a>(&'a self, actor: &'a ActorContext, scope: &'a WorkspaceScope, slice: &'a SourceSlice) -> PortFuture<'a, VisibilityBinding>` | 逐subject/version绑定；不能用已有binding跳过现时决定 |
| `bind_subject<'a>(&'a self, actor: &'a ActorContext, scope: &'a WorkspaceScope, subject: &'a OwnerSubjectRef) -> PortFuture<'a, VisibilityBinding>` | Local focus/last-opened或输出ref逐项校验 |
| `revalidate<'a>(&'a self, actor: &'a ActorContext, scope: &'a WorkspaceScope, bindings: &'a [VisibilityBinding]) -> PortFuture<'a, VisibilityContextRef>` | 返回同一可用输出语境；撤销/不可证实fail-closed，003有效性合同未闭合不得输出 |

#### AttentionResolverPort

位置：`crates/application/src/source_ports.rs`。

```rust
/// Defines the AttentionResolverPort capability boundary.
pub trait AttentionResolverPort: Send + Sync {
    /// Resolves the target of explicit local intent.
    fn resolve_change<'a>(&'a self, actor: &'a ActorContext, scope: &'a WorkspaceScope, partition: WorkspacePartitionId, change: &'a LocalAttentionChange) -> PortFuture<'a, LocalChangeResolution>;
    /// Obtains an owner-proven attention relation.
    fn relate<'a>(&'a self, actor: &'a ActorContext, scope: &'a WorkspaceScope, cursor: &'a ReadCursor, item: &'a InboxItem) -> PortFuture<'a, OwnerAttentionRelation>;
}
```

| 方法 | 参数/返回/错误与效果 |
|---|---|
| `resolve_change<'a>(&'a self, actor: &'a ActorContext, scope: &'a WorkspaceScope, partition: WorkspacePartitionId, change: &'a LocalAttentionChange) -> PortFuture<'a, LocalChangeResolution>` | 正式attention identity/已见basis，不能以projection existence当权限 |
| `relate<'a>(&'a self, actor: &'a ActorContext, scope: &'a WorkspaceScope, cursor: &'a ReadCursor, item: &'a InboxItem) -> PortFuture<'a, OwnerAttentionRelation>` | 仅正式同stream/cross-generation关系；缺失返回ContractBlocked，查询该item可Unknown而非Read |

#### SourceEventPort

位置：`crates/application/src/source_ports.rs`。

```rust
/// Defines the SourceEventPort capability boundary.
pub trait SourceEventPort: Send + Sync {
    /// Validates a source change envelope.
    fn validate_change<'a>(&'a self, input: &'a ConsumeSourceChangeRequest) -> PortFuture<'a, TrustedSourceChange>;
    /// Validates a source invalidation envelope.
    fn validate_invalidation<'a>(&'a self, input: &'a ConsumeSourceInvalidationRequest) -> PortFuture<'a, TrustedSourceInvalidation>;
    /// Classifies source order using the owning contract.
    fn classify<'a>(&'a self, change: &'a TrustedSourceChange, snapshot: &'a SourceTargetSnapshot) -> PortFuture<'a, SourceRelation>;
}
```

| 方法 | 参数/返回/错误与效果 |
|---|---|
| `validate_change<'a>(&'a self, input: &'a ConsumeSourceChangeRequest) -> PortFuture<'a, TrustedSourceChange>` | 完整schema/来源/authority/digest/目标范围验证；不是公开bool trusted |
| `validate_invalidation<'a>(&'a self, input: &'a ConsumeSourceInvalidationRequest) -> PortFuture<'a, TrustedSourceInvalidation>` | 安全撤销effect必须owner proof；timeout不当tombstone |
| `classify<'a>(&'a self, change: &'a TrustedSourceChange, snapshot: &'a SourceTargetSnapshot) -> PortFuture<'a, SourceRelation>` | 同source/generation正式比较；late不倒退；gap非数值减法 |

#### RecoverySourcePort

位置：`crates/application/src/source_ports.rs`。

```rust
/// Defines the RecoverySourcePort capability boundary.
pub trait RecoverySourcePort: Send + Sync {
    /// Reads one bounded owner baseline batch.
    fn baseline<'a>(&'a self, actor: &'a ActorContext, scope: &'a WorkspaceScope, attempt: &'a RebuildAttempt, budget: u32) -> PortFuture<'a, RecoveryBatch>;
    /// Reads one authorized continuation batch.
    fn catch_up<'a>(&'a self, actor: &'a ActorContext, scope: &'a WorkspaceScope, attempt: &'a RebuildAttempt, budget: u32) -> PortFuture<'a, RecoveryBatch>;
    /// Checks complete declared source coverage.
    fn coverage<'a>(&'a self, scope: &'a WorkspaceScope, candidate: &'a PartitionProjection) -> PortFuture<'a, Vec<OwnerCoverageProof>>;
}
```

| 方法 | 参数/返回/错误与效果 |
|---|---|
| `baseline<'a>(&'a self, actor: &'a ActorContext, scope: &'a WorkspaceScope, attempt: &'a RebuildAttempt, budget: u32) -> PortFuture<'a, RecoveryBatch>` | 一次有界owner baseline；budget>0，continuation正式；不能从旧projection生成 |
| `catch_up<'a>(&'a self, actor: &'a ActorContext, scope: &'a WorkspaceScope, attempt: &'a RebuildAttempt, budget: u32) -> PortFuture<'a, RecoveryBatch>` | 需正式baseline→event接续证明；L0-bus replay preparation不等executor |
| `coverage<'a>(&'a self, scope: &'a WorkspaceScope, candidate: &'a PartitionProjection) -> PortFuture<'a, Vec<OwnerCoverageProof>>` | 声明source全覆盖，不把empty/本地offset当完成 |

端口族自检：scope先于数据输出，resolver含list/item/现时有效性；没有owner command；trusted source例外不绕scope/source隔离，authority/schema/validity缺口阻塞正向处理。跨系统决定与提交不能靠本地锁提供原子性，003必须给可用有效性/撤销合同；没有即blocked。


### 7.4 本地读取与原子提交端口

依据：CP1/3/5/6局部所有权。问题：读write分离、同key异digest、unknown与cutover CAS怎样可调用？取舍：read单独trait；原子提交只给具名用例，不暴露save(entity)。准备阶段全部在内存，成功记录与效果同commit。原子提交不在网络调用期间持有数据库事务，外部proof作为被检查的输入；driver无法满足这些语义即阻塞该实现。

### CommitOutcome<T>

归属：`crates/application/src/store_ports.rs`；不是public协议类型。

```rust
/// Distinguishes acknowledged, rolled-back, and uncertain commits.
pub enum CommitOutcome<T> {
    /// Carries the exact committed result.
    Committed(T),
    /// The transaction is authoritatively rolled back.
    NotCommitted,
    /// The commit may have taken effect.
    Unknown(CommitAttemptId),
}
```

| 变体 | Rustdoc / 作用 | 来源 / 去向 |
|---|---|---|
| `Committed(T)` | Carries the exact committed result. | 返回已提交记录；duplicate也可回原记录 |
| `NotCommitted` | The transaction is authoritatively rolled back. | 可以重新读expected再尝试，不等unknown |
| `Unknown(CommitAttemptId)` | The commit may have taken effect. | 先lookup，不直接重跑 |

### CommitResolution

归属：`crates/application/src/store_ports.rs`。

```rust
/// Classifies authoritative commit-attempt lookup.
pub enum CommitResolution {
    /// Returns the exact local operation result.
    Operation(WorkspaceOperationRecord),
    /// Returns the exact source application result.
    Source(SourceApplicationRecord),
    /// Proves that this attempt cannot still commit.
    NotCommitted,
    /// Returns a committed non-terminal gap marker.
    Gap(GapRef),
    /// No terminal outcome is known.
    Pending,
}
```

| 变体 | Rustdoc / 作用 | 来源 / 去向 |
|---|---|---|
| `Operation(WorkspaceOperationRecord)` | Returns the exact local operation result. | 含敏感ref，输出仍裁剪 |
| `Source(SourceApplicationRecord)` | Returns the exact source application result. | 含终局cursor/revision |
| `NotCommitted` | Proves that this attempt cannot still commit. | 非仅结果不存在 |
| `Gap(GapRef)` | Returns a committed non-terminal gap marker. | 仅resolve gap提交结果；无source terminal键 |
| `Pending` | No terminal outcome is known. | 保留OutcomeUnknown，不启动替代写 |

#### WorkspaceReadPort

位置：`crates/application/src/store_ports.rs`。

```rust
/// Defines the WorkspaceReadPort capability boundary.
pub trait WorkspaceReadPort: Send + Sync {
    /// Reads an existing explicit source target and all of its guards.
    fn source_snapshot<'a>(&'a self, partition: WorkspacePartitionId, generation: GenerationId) -> PortFuture<'a, Option<SourceTargetSnapshot>>;
    /// Reads every invalidation target with its compare versions.
    fn invalidation_snapshot<'a>(&'a self, targets: &'a ExistingWorkspaceTargetSet) -> PortFuture<'a, Vec<InvalidationTargetSnapshot>>;
    /// Reads persisted baseline provenance for one application reference.
    fn baseline_application<'a>(&'a self, application: ApplicationResultRef) -> PortFuture<'a, Option<BaselineApplicationBinding>>;
    /// Resolves one existing target against the formal affected selection.
    fn affected_target<'a>(&'a self, affected: &'a OwnerAffectedSelection, partition: WorkspacePartitionId) -> PortFuture<'a, Option<ExistingWorkspaceTargetSet>>;
    /// Looks up a stable partition key.
    fn find_partition<'a>(&'a self, principal: &'a ActorId, scope: &'a StableScopeKey) -> PortFuture<'a, Option<WorkspacePartition>>;
    /// Reads one coherent committed snapshot.
    fn snapshot<'a>(&'a self, partition: WorkspacePartitionId) -> PortFuture<'a, Option<WorkspaceSnapshot>>;
    /// Reads the full recovery compare set.
    fn recovery_snapshot<'a>(&'a self, partition: WorkspacePartitionId, attempt: RebuildAttemptId) -> PortFuture<'a, Option<RecoverySnapshot>>;
    /// Looks up the immutable operation result.
    fn operation<'a>(&'a self, key: &'a WorkspaceOperationKey) -> PortFuture<'a, Option<WorkspaceOperationRecord>>;
    /// Looks up a result within its authorized partition.
    fn operation_by_ref<'a>(&'a self, partition: WorkspacePartitionId, result: WorkspaceOperationRef) -> PortFuture<'a, Option<WorkspaceOperationRecord>>;
    /// Looks up a terminal source result.
    fn source_application<'a>(&'a self, key: &'a SourceApplicationKey) -> PortFuture<'a, Option<SourceApplicationRecord>>;
    /// Resolves an uncertain commit attempt.
    fn resolve_commit<'a>(&'a self, attempt: CommitAttemptId) -> PortFuture<'a, CommitResolution>;
    /// Enumerates existing affected local targets.
    fn affected_targets<'a>(&'a self, affected: &'a OwnerAffectedSelection, after: Option<WorkspacePartitionId>, limit: u32) -> PortFuture<'a, AffectedTargetPage>;
}
```

| 方法 | 参数/返回/错误与效果 |
|---|---|
| `source_snapshot<'a>(&'a self, partition: WorkspacePartitionId, generation: GenerationId) -> PortFuture<'a, Option<SourceTargetSnapshot>>` | 指定Current/Candidate及attempt完整CAS；不是默认current读 |
| `invalidation_snapshot<'a>(&'a self, targets: &'a ExistingWorkspaceTargetSet) -> PortFuture<'a, Vec<InvalidationTargetSnapshot>>` | 单分区同读事务的逐目标version；有任意缺失返回错误，不省略部分targets |
| `baseline_application<'a>(&'a self, application: ApplicationResultRef) -> PortFuture<'a, Option<BaselineApplicationBinding>>` | 内部来源回链，无业务正文输出 |
| `affected_target<'a>(&'a self, affected: &'a OwnerAffectedSelection, partition: WorkspacePartitionId) -> PortFuture<'a, Option<ExistingWorkspaceTargetSet>>` | 正式范围内单target定位，不能用有限第一页当全集 |
| `find_partition<'a>(&'a self, principal: &'a ActorId, scope: &'a StableScopeKey) -> PortFuture<'a, Option<WorkspacePartition>>` | 稳定unique key；无就None，无创建 |
| `snapshot<'a>(&'a self, partition: WorkspacePartitionId) -> PortFuture<'a, Option<WorkspaceSnapshot>>` | 原子read transaction；覆盖current/overlay/失效/coverage；缺失safe surface |
| `recovery_snapshot<'a>(&'a self, partition: WorkspacePartitionId, attempt: RebuildAttemptId) -> PortFuture<'a, Option<RecoverySnapshot>>` | 同一快照读取候选/attempt/current/active attempts，含所有expected |
| `operation<'a>(&'a self, key: &'a WorkspaceOperationKey) -> PortFuture<'a, Option<WorkspaceOperationRecord>>` | 先scope权限再输出；同key看digest，None不解决旧unknown |
| `operation_by_ref<'a>(&'a self, partition: WorkspacePartitionId, result: WorkspaceOperationRef) -> PortFuture<'a, Option<WorkspaceOperationRecord>>` | 同partition/principal；记录不可变但现时可见性仍检查 |
| `source_application<'a>(&'a self, key: &'a SourceApplicationKey) -> PortFuture<'a, Option<SourceApplicationRecord>>` | 返回原terminal/cursor/revision；不用重放domain |
| `resolve_commit<'a>(&'a self, attempt: CommitAttemptId) -> PortFuture<'a, CommitResolution>` | 必须权威；Pending与NotCommitted不可合并；schema在Step11 |
| `affected_targets<'a>(&'a self, affected: &'a OwnerAffectedSelection, after: Option<WorkspacePartitionId>, limit: u32) -> PortFuture<'a, AffectedTargetPage>` | UUID bytes升序seek；limit>0；新candidate由source安全栅栏和当前决定保护，非扫描快照全球原子 |

### ProvisionCommit

位置：`crates/application/src/store_ports.rs`。能力：Carries one validated local atomic change set.

```rust
/// Carries one validated local atomic change set.
pub struct ProvisionCommit {
    /// Checked context input.
    context: WorkspaceOperationContext,
    /// Checked partition input.
    partition: WorkspacePartition,
    /// Checked result input.
    result: WorkspaceOperationRecord,
}
```

| 字段 | 类型 | 来源 / 约束 / optional |
|---|---|---|
| `context` | `WorkspaceOperationContext` | key/digest/attempt都有 |
| `partition` | `WorkspacePartition` | tentative version0，stable unique |
| `result` | `WorkspaceOperationRecord` | Provisioned；store提交version1并校验result相等 |

| 成员签名 | 参数/返回/效果 |
|---|---|
| `pub fn validate(&self) -> Result<(), ApplicationError>` | 同partition、key/digest、版本与typed result一致；未提交不报告成功 |

| 工厂签名 | 来源与初始条件 |
|---|---|
| `pub fn try_new(context: WorkspaceOperationContext, partition: WorkspacePartition, result: WorkspaceOperationRecord) -> Result<Self, ApplicationError>` | 只能由对应service调用domain方法后构造 |

不变量/禁止：driver必须原子检查expected/unique/失效集合并写业务效果与结果；不允许先result后效果两个事务。

### LocalChangeCommit

位置：`crates/application/src/store_ports.rs`。能力：Carries one validated local atomic change set.

```rust
/// Carries one validated local atomic change set.
pub struct LocalChangeCommit {
    /// Checked context input.
    context: WorkspaceOperationContext,
    /// Checked expected_partition input.
    expected_partition: PartitionVersion,
    /// Checked expected_local input.
    expected_local: LocalReadBasis,
    /// Checked local input.
    local: LocalAttentionState,
    /// Checked result input.
    result: WorkspaceOperationRecord,
}
```

| 字段 | 类型 | 来源 / 约束 / optional |
|---|---|---|
| `context` | `WorkspaceOperationContext` | 写上下文 |
| `expected_partition` | `PartitionVersion` | 授权分区read轴 |
| `expected_local` | `LocalReadBasis` | Absent用不存在CAS，Present版本CAS |
| `local` | `LocalAttentionState` | 已验证变更，next local revision |
| `result` | `WorkspaceOperationRecord` | LocalChanged与revision同事务 |

| 成员签名 | 参数/返回/效果 |
|---|---|
| `pub fn validate(&self) -> Result<(), ApplicationError>` | 同partition、key/digest、版本与typed result一致；未提交不报告成功 |

| 工厂签名 | 来源与初始条件 |
|---|---|
| `pub fn try_new(context: WorkspaceOperationContext, expected_partition: PartitionVersion, expected_local: LocalReadBasis, local: LocalAttentionState, result: WorkspaceOperationRecord) -> Result<Self, ApplicationError>` | 只能由对应service调用domain方法后构造 |

不变量/禁止：driver必须原子检查expected/unique/失效集合并写业务效果与结果；不允许先result后效果两个事务。

### SourceApplyCommit

位置：`crates/application/src/store_ports.rs`。能力：Carries one validated local atomic change set.

```rust
/// Carries one validated local atomic change set.
pub struct SourceApplyCommit {
    /// Checked context input.
    context: SourceContext,
    /// Checked expected_partition input.
    expected_partition: PartitionVersion,
    /// Checked expected_view input.
    expected_view: ViewRevision,
    /// Checked projection input.
    projection: PartitionProjection,
    /// Checked application input.
    application: SourceApplicationRecord,
    /// Checked observed_invalidations input.
    observed_invalidations: Vec<InvalidationId>,
    /// Validated target before.
    target_before: SourceTargetSnapshot,
    /// Validated target after.
    target_after: GenerationState,
    /// Validated attempt after.
    attempt_after: Option<RebuildAttempt>,
}
```

| 字段 | 类型 | 来源 / 约束 / optional |
|---|---|---|
| `context` | `SourceContext` | trusted key/digest/attempt |
| `expected_partition` | `PartitionVersion` | 同快照分区 |
| `expected_view` | `ViewRevision` | projection旧revision |
| `projection` | `PartitionProjection` | 替换后的slice/Inbox/cursor/coverage同聚合 |
| `application` | `SourceApplicationRecord` | Applied/LateIgnored终局 |
| `observed_invalidations` | `Vec<InvalidationId>` | source与generation安全栅栏；CAS整个集合 |
| `target_before` | `SourceTargetSnapshot` | 指定target同快照，含candidate attempt CAS |
| `target_after` | `GenerationState` | 按新数据撤销候选validation后的值 |
| `attempt_after` | `Option<RebuildAttempt>` | Candidate Ready重返Validating时Some；其他None |

| 成员签名 | 参数/返回/效果 |
|---|---|
| `pub fn validate(&self) -> Result<(), ApplicationError>` | 同partition、key/digest、版本与typed result一致；未提交不报告成功 |

| 工厂签名 | 来源与初始条件 |
|---|---|
| `pub fn try_new(context: SourceContext, expected_partition: PartitionVersion, expected_view: ViewRevision, projection: PartitionProjection, application: SourceApplicationRecord, observed_invalidations: Vec<InvalidationId>, target_before: SourceTargetSnapshot, target_after: GenerationState, attempt_after: Option<RebuildAttempt>) -> Result<Self, ApplicationError>` | 只能由对应service调用domain方法后构造 |

不变量/禁止：driver必须原子检查expected/unique/失效集合并写业务效果与结果；不允许先result后效果两个事务。

### SourceGapCommit

位置：`crates/application/src/store_ports.rs`。能力：Carries one validated local atomic change set.

```rust
/// Carries one validated local atomic change set.
pub struct SourceGapCommit {
    /// Checked context input.
    context: SourceContext,
    /// Checked expected_partition input.
    expected_partition: PartitionVersion,
    /// Checked expected_view input.
    expected_view: ViewRevision,
    /// Checked projection input.
    projection: PartitionProjection,
    /// Checked gap input.
    gap: GapRef,
    /// Checked observed_invalidations input.
    observed_invalidations: Vec<InvalidationId>,
    /// Validated target before.
    target_before: SourceTargetSnapshot,
    /// Validated target after.
    target_after: GenerationState,
    /// Validated attempt after.
    attempt_after: Option<RebuildAttempt>,
}
```

| 字段 | 类型 | 来源 / 约束 / optional |
|---|---|---|
| `context` | `SourceContext` | 不占terminal success key |
| `expected_partition` | `PartitionVersion` | 同快照 |
| `expected_view` | `ViewRevision` | 旧投影revision |
| `projection` | `PartitionProjection` | 只标Gap，保留安全cursor和原items |
| `gap` | `GapRef` | 本地ID；retry已同gap复用 |
| `observed_invalidations` | `Vec<InvalidationId>` | 禁止清安全失效 |
| `target_before` | `SourceTargetSnapshot` | 完整target CAS |
| `target_after` | `GenerationState` | Gap同样使候选validation不再有效 |
| `attempt_after` | `Option<RebuildAttempt>` | 需Ready→Validating时Some |

| 成员签名 | 参数/返回/效果 |
|---|---|
| `pub fn validate(&self) -> Result<(), ApplicationError>` | 同partition、key/digest、版本与typed result一致；未提交不报告成功 |

| 工厂签名 | 来源与初始条件 |
|---|---|
| `pub fn try_new(context: SourceContext, expected_partition: PartitionVersion, expected_view: ViewRevision, projection: PartitionProjection, gap: GapRef, observed_invalidations: Vec<InvalidationId>, target_before: SourceTargetSnapshot, target_after: GenerationState, attempt_after: Option<RebuildAttempt>) -> Result<Self, ApplicationError>` | 只能由对应service调用domain方法后构造 |

不变量/禁止：driver必须原子检查expected/unique/失效集合并写业务效果与结果；不允许先result后效果两个事务。

### RecoveryCommit

位置：`crates/application/src/store_ports.rs`。能力：Carries one validated local atomic change set.

```rust
/// Carries one validated local atomic change set.
pub struct RecoveryCommit {
    /// Checked context input.
    context: WorkspaceOperationContext,
    /// Checked before input.
    before: Option<RecoverySnapshot>,
    /// Checked attempt input.
    attempt: RebuildAttempt,
    /// Checked candidate input.
    candidate: GenerationState,
    /// Checked projection input.
    projection: PartitionProjection,
    /// Checked result input.
    result: WorkspaceOperationRecord,
    /// Validated baseline bindings.
    baseline_bindings: Vec<BaselineApplicationBinding>,
}
```

| 字段 | 类型 | 来源 / 约束 / optional |
|---|---|---|
| `context` | `WorkspaceOperationContext` | 具名Request/Advance/Supersede上下文 |
| `before` | `Option<RecoverySnapshot>` | Request None并CAS非存在，其余Some |
| `attempt` | `RebuildAttempt` | tentative新状态/version |
| `candidate` | `GenerationState` | 同candidate |
| `projection` | `PartitionProjection` | 同candidate，CP5不包含 |
| `result` | `WorkspaceOperationRecord` | 持久结果与attempt状态同事务 |
| `baseline_bindings` | `Vec<BaselineApplicationBinding>` | 本批Inbox来源映射，同事务append；非baseline分支为空 |

| 成员签名 | 参数/返回/效果 |
|---|---|
| `pub fn validate(&self) -> Result<(), ApplicationError>` | 同partition、key/digest、版本与typed result一致；未提交不报告成功 |

| 工厂签名 | 来源与初始条件 |
|---|---|
| `pub fn try_new(context: WorkspaceOperationContext, before: Option<RecoverySnapshot>, attempt: RebuildAttempt, candidate: GenerationState, projection: PartitionProjection, result: WorkspaceOperationRecord, baseline_bindings: Vec<BaselineApplicationBinding>) -> Result<Self, ApplicationError>` | 只能由对应service调用domain方法后构造 |

不变量/禁止：driver必须原子检查expected/unique/失效集合并写业务效果与结果；不允许先result后效果两个事务。

### CutoverCommit

位置：`crates/application/src/store_ports.rs`。能力：Carries one validated local atomic change set.

```rust
/// Carries one validated local atomic change set.
pub struct CutoverCommit {
    /// Checked context input.
    context: WorkspaceOperationContext,
    /// Checked basis input.
    basis: CutoverBasis,
    /// Checked attempt input.
    attempt: RebuildAttempt,
    /// Checked candidate input.
    candidate: GenerationState,
    /// Checked old_current input.
    old_current: Option<GenerationState>,
    /// Checked partition input.
    partition: WorkspacePartition,
    /// Checked result input.
    result: WorkspaceOperationRecord,
}
```

| 字段 | 类型 | 来源 / 约束 / optional |
|---|---|---|
| `context` | `WorkspaceOperationContext` | Advance上下文 |
| `basis` | `CutoverBasis` | 全expected/proof/安全栅栏 |
| `attempt` | `RebuildAttempt` | tentative Completed |
| `candidate` | `GenerationState` | tentative Current |
| `old_current` | `Option<GenerationState>` | 原current若有已tentative Retired |
| `partition` | `WorkspacePartition` | tentative current candidate+next partition version |
| `result` | `WorkspaceOperationRecord` | 精确Completed结果；不修改local overlay |

| 成员签名 | 参数/返回/效果 |
|---|---|
| `pub fn validate(&self) -> Result<(), ApplicationError>` | 同partition、key/digest、版本与typed result一致；未提交不报告成功 |

| 工厂签名 | 来源与初始条件 |
|---|---|
| `pub fn try_new(context: WorkspaceOperationContext, basis: CutoverBasis, attempt: RebuildAttempt, candidate: GenerationState, old_current: Option<GenerationState>, partition: WorkspacePartition, result: WorkspaceOperationRecord) -> Result<Self, ApplicationError>` | 只能由对应service调用domain方法后构造 |

不变量/禁止：driver必须原子检查expected/unique/失效集合并写业务效果与结果；不允许先result后效果两个事务。

### InvalidationCommit

位置：`crates/application/src/store_ports.rs`。能力：Carries one validated local atomic change set.

```rust
/// Carries one validated local atomic change set.
pub struct InvalidationCommit {
    /// Checked context input.
    context: WorkspaceOperationContext,
    /// Checked expected_partition input.
    expected_partition: PartitionVersion,
    /// Checked targets input.
    targets: ExistingWorkspaceTargetSet,
    /// Checked record input.
    record: InvalidationRecord,
    /// Checked result input.
    result: WorkspaceOperationRecord,
    /// Validated before.
    before: Vec<InvalidationTargetSnapshot>,
    /// Validated after.
    after: Vec<InvalidationTargetSnapshot>,
}
```

| 字段 | 类型 | 来源 / 约束 / optional |
|---|---|---|
| `context` | `WorkspaceOperationContext` | Invalidation/SourceInvalidation |
| `expected_partition` | `PartitionVersion` | 读取版本 |
| `targets` | `ExistingWorkspaceTargetSet` | 同分区已有targets |
| `record` | `InvalidationRecord` | 明确effect和basis |
| `result` | `WorkspaceOperationRecord` | Invalidated同事务 |
| `before` | `Vec<InvalidationTargetSnapshot>` | 每目标generation/projection/attempt旧版本 |
| `after` | `Vec<InvalidationTargetSnapshot>` | domain迁移后的新值，与before集合一一匹配 |

| 成员签名 | 参数/返回/效果 |
|---|---|
| `pub fn validate(&self) -> Result<(), ApplicationError>` | 同partition、key/digest、版本与typed result一致；未提交不报告成功 |

| 工厂签名 | 来源与初始条件 |
|---|---|
| `pub fn try_new(context: WorkspaceOperationContext, expected_partition: PartitionVersion, targets: ExistingWorkspaceTargetSet, record: InvalidationRecord, result: WorkspaceOperationRecord, before: Vec<InvalidationTargetSnapshot>, after: Vec<InvalidationTargetSnapshot>) -> Result<Self, ApplicationError>` | 只能由对应service调用domain方法后构造 |

不变量/禁止：driver必须原子检查expected/unique/失效集合并写业务效果与结果；不允许先result后效果两个事务。

#### WorkspaceAtomicStore

位置：`crates/application/src/store_ports.rs`。

```rust
/// Defines the WorkspaceAtomicStore capability boundary.
pub trait WorkspaceAtomicStore: Send + Sync {
    /// Commits explicit provisioning.
    fn provision<'a>(&'a self, change: ProvisionCommit) -> PortFuture<'a, CommitOutcome<WorkspaceOperationRecord>>;
    /// Commits explicit local intent.
    fn change_local<'a>(&'a self, change: LocalChangeCommit) -> PortFuture<'a, CommitOutcome<WorkspaceOperationRecord>>;
    /// Commits a terminal source application.
    fn apply_source<'a>(&'a self, change: SourceApplyCommit) -> PortFuture<'a, CommitOutcome<SourceApplicationRecord>>;
    /// Records a non-terminal source gap.
    fn mark_gap<'a>(&'a self, change: SourceGapCommit) -> PortFuture<'a, CommitOutcome<GapRef>>;
    /// Commits one bounded recovery step.
    fn save_recovery<'a>(&'a self, change: RecoveryCommit) -> PortFuture<'a, CommitOutcome<WorkspaceOperationRecord>>;
    /// Atomically selects a validated candidate.
    fn cutover<'a>(&'a self, change: CutoverCommit) -> PortFuture<'a, CommitOutcome<WorkspaceOperationRecord>>;
    /// Commits a per-partition invalidation.
    fn invalidate<'a>(&'a self, change: InvalidationCommit) -> PortFuture<'a, CommitOutcome<WorkspaceOperationRecord>>;
}
```

| 方法 | 参数/返回/错误与效果 |
|---|---|
| `provision<'a>(&'a self, change: ProvisionCommit) -> PortFuture<'a, CommitOutcome<WorkspaceOperationRecord>>` | stable key unique与operation key unique同事务，冲突读原值 |
| `change_local<'a>(&'a self, change: LocalChangeCommit) -> PortFuture<'a, CommitOutcome<WorkspaceOperationRecord>>` | 按Absent/Present CAS；不写projection/source；无隐式command |
| `apply_source<'a>(&'a self, change: SourceApplyCommit) -> PortFuture<'a, CommitOutcome<SourceApplicationRecord>>` | Applied原子整体；LateIgnored只append record，cursor/view保持原安全值 |
| `mark_gap<'a>(&'a self, change: SourceGapCommit) -> PortFuture<'a, CommitOutcome<GapRef>>` | Gap局部状态原子写；无terminal record，无cursor推进；重入相同gap不递增无意义revision |
| `save_recovery<'a>(&'a self, change: RecoveryCommit) -> PortFuture<'a, CommitOutcome<WorkspaceOperationRecord>>` | Request insert/Advance CAS/Supersede引用校验；candidate变更同步撤销Validated；不写CP5 |
| `cutover<'a>(&'a self, change: CutoverCommit) -> PortFuture<'a, CommitOutcome<WorkspaceOperationRecord>>` | 全expected/安全栅栏比较+old/new role+partition pointer+attempt/result同事务；current可None |
| `invalidate<'a>(&'a self, change: InvalidationCommit) -> PortFuture<'a, CommitOutcome<WorkspaceOperationRecord>>` | 记录/source栅栏+目标safety/coverage或freshness效果+result同事务；DataStale不SafetyBlocked |

#### IdPort

位置：`crates/application/src/operation_context.rs`。

```rust
/// Defines the IdPort capability boundary.
pub trait IdPort: Send + Sync {
    /// Allocates a local partition identifier.
    fn partition<'a>(&'a self) -> PortFuture<'a, WorkspacePartitionId>;
    /// Allocates a local generation identifier.
    fn generation<'a>(&'a self) -> PortFuture<'a, GenerationId>;
    /// Allocates a local attempt identifier.
    fn attempt<'a>(&'a self) -> PortFuture<'a, RebuildAttemptId>;
    /// Allocates a local invalidation identifier.
    fn invalidation<'a>(&'a self) -> PortFuture<'a, InvalidationId>;
    /// Allocates a local operation identifier.
    fn operation<'a>(&'a self) -> PortFuture<'a, WorkspaceOperationRef>;
    /// Allocates a local application identifier.
    fn application<'a>(&'a self) -> PortFuture<'a, ApplicationResultRef>;
    /// Allocates a local gap identifier.
    fn gap<'a>(&'a self) -> PortFuture<'a, GapRef>;
    /// Allocates a local commit_attempt identifier.
    fn commit_attempt<'a>(&'a self) -> PortFuture<'a, CommitAttemptId>;
}
```

| 方法 | 参数/返回/错误与效果 |
|---|---|
| `partition<'a>(&'a self) -> PortFuture<'a, WorkspacePartitionId>` | UUIDv4；冲突由store拒绝；不用于推导owner ref |
| `generation<'a>(&'a self) -> PortFuture<'a, GenerationId>` | UUIDv4；冲突由store拒绝；不用于推导owner ref |
| `attempt<'a>(&'a self) -> PortFuture<'a, RebuildAttemptId>` | UUIDv4；冲突由store拒绝；不用于推导owner ref |
| `invalidation<'a>(&'a self) -> PortFuture<'a, InvalidationId>` | UUIDv4；冲突由store拒绝；不用于推导owner ref |
| `operation<'a>(&'a self) -> PortFuture<'a, WorkspaceOperationRef>` | UUIDv4；冲突由store拒绝；不用于推导owner ref |
| `application<'a>(&'a self) -> PortFuture<'a, ApplicationResultRef>` | UUIDv4；冲突由store拒绝；不用于推导owner ref |
| `gap<'a>(&'a self) -> PortFuture<'a, GapRef>` | UUIDv4；冲突由store拒绝；不用于推导owner ref |
| `commit_attempt<'a>(&'a self) -> PortFuture<'a, CommitAttemptId>` | UUIDv4；冲突由store拒绝；不用于推导owner ref |

#### WorkspaceCursorCodec

位置：`crates/application/src/store_ports.rs`。

```rust
/// Defines the WorkspaceCursorCodec capability boundary.
pub trait WorkspaceCursorCodec: Send + Sync {
    /// Encodes a confidential authenticated continuation.
    fn encode<'a>(&'a self, cursor: &'a WorkspacePageCursor) -> PortFuture<'a, WorkspacePageToken>;
    /// Decodes a validated local continuation.
    fn decode<'a>(&'a self, token: &'a WorkspacePageToken) -> PortFuture<'a, WorkspacePageCursor>;
}
```

| 方法 | 参数/返回/错误与效果 |
|---|---|
| `encode<'a>(&'a self, cursor: &'a WorkspacePageCursor) -> PortFuture<'a, WorkspacePageToken>` | 认证加密、无本地持久映射写；key/schema/version绑定Step8/14；Query no-write |
| `decode<'a>(&'a self, token: &'a WorkspacePageToken) -> PortFuture<'a, WorkspacePageCursor>` | 先限长/校验完整性再解析，错误同CursorInvalid；不能当权限 |

本地store组自检：所有mutable读面/expected/结果有配对；CP3/4同聚合，Gap不终局；unknown查权威记录，技术失败不得藏进NotCommitted。读取面的Vec不授予无限资源承诺，硬上限/driver分页执行承接Step11/14；若限额截断不能把coverage标Complete。


### 7.5 service与entry完整callable

依据6C注入字段，问题是入口DTO如何到具名服务而不绕port。取舍：同名handler/service签名一对一；actor不是请求字段，由宿主认证后注入；consumer actor为已认证transport service身份，仍须SourceEventPort核验。不提供generic dispatch，错误只用SafeReadFailure公开裁剪；application内部ApplicationError不裸透出。

#### ProvisionWorkspacePartition callable

```rust
impl CommandHandlers {
    /// Validates the typed invocation and calls its application use case.
    pub async fn provision(&self, actor: ActorContext, metadata: CommandMetadata, request: ProvisionWorkspacePartitionRequest) -> Result<WorkspaceWriteResult, SafeReadFailure>;
}
impl PartitionService {
    /// Executes ProvisionWorkspacePartition within its local capability boundary.
    pub async fn provision(&self, actor: ActorContext, metadata: CommandMetadata, request: ProvisionWorkspacePartitionRequest) -> Result<WorkspaceWriteResult, SafeReadFailure>;
}
```

metadata幂等键必填；先scope/操作权限、operation lookup；业务效果和结果原子。 request/result字段由Step8同名卡片闭合；调用图由Step9同名流闭合。

#### ChangeWorkspaceLocalState callable

```rust
impl CommandHandlers {
    /// Validates the typed invocation and calls its application use case.
    pub async fn change_local(&self, actor: ActorContext, metadata: CommandMetadata, request: ChangeWorkspaceLocalStateRequest) -> Result<WorkspaceWriteResult, SafeReadFailure>;
}
impl LocalAttentionService {
    /// Executes ChangeWorkspaceLocalState within its local capability boundary.
    pub async fn change_local(&self, actor: ActorContext, metadata: CommandMetadata, request: ChangeWorkspaceLocalStateRequest) -> Result<WorkspaceWriteResult, SafeReadFailure>;
}
```

metadata幂等键必填；先scope/操作权限、operation lookup；业务效果和结果原子。 request/result字段由Step8同名卡片闭合；调用图由Step9同名流闭合。

#### GetWorkspaceView callable

```rust
impl QueryHandlers {
    /// Validates the typed invocation and calls its application use case.
    pub async fn get_view(&self, actor: ActorContext, metadata: QueryMetadata, request: GetWorkspaceViewRequest) -> Result<WorkspaceViewResponse, SafeReadFailure>;
}
impl WorkspaceQueryService {
    /// Executes GetWorkspaceView within its local capability boundary.
    pub async fn get_view(&self, actor: ActorContext, metadata: QueryMetadata, request: GetWorkspaceViewRequest) -> Result<WorkspaceViewResponse, SafeReadFailure>;
}
```

只读：ScopeService→read/source/visibility/attention/codec，无store写；metadata的page/idem必须None。 request/result字段由Step8同名卡片闭合；调用图由Step9同名流闭合。

#### ListWorkspaceInbox callable

```rust
impl QueryHandlers {
    /// Validates the typed invocation and calls its application use case.
    pub async fn list_inbox(&self, actor: ActorContext, metadata: QueryMetadata, request: ListWorkspaceInboxRequest) -> Result<WorkspaceInboxResponse, SafeReadFailure>;
}
impl WorkspaceQueryService {
    /// Executes ListWorkspaceInbox within its local capability boundary.
    pub async fn list_inbox(&self, actor: ActorContext, metadata: QueryMetadata, request: ListWorkspaceInboxRequest) -> Result<WorkspaceInboxResponse, SafeReadFailure>;
}
```

只读：ScopeService→read/source/visibility/attention/codec，无store写；metadata的page/idem必须None。 request/result字段由Step8同名卡片闭合；调用图由Step9同名流闭合。

#### GetWorkspaceLocalState callable

```rust
impl QueryHandlers {
    /// Validates the typed invocation and calls its application use case.
    pub async fn get_local_state(&self, actor: ActorContext, metadata: QueryMetadata, request: GetWorkspaceLocalStateRequest) -> Result<WorkspaceLocalStateResponse, SafeReadFailure>;
}
impl WorkspaceQueryService {
    /// Executes GetWorkspaceLocalState within its local capability boundary.
    pub async fn get_local_state(&self, actor: ActorContext, metadata: QueryMetadata, request: GetWorkspaceLocalStateRequest) -> Result<WorkspaceLocalStateResponse, SafeReadFailure>;
}
```

只读：ScopeService→read/source/visibility/attention/codec，无store写；metadata的page/idem必须None。 request/result字段由Step8同名卡片闭合；调用图由Step9同名流闭合。

#### GetWorkspaceOperationResult callable

```rust
impl QueryHandlers {
    /// Validates the typed invocation and calls its application use case.
    pub async fn get_operation_result(&self, actor: ActorContext, metadata: QueryMetadata, request: GetWorkspaceOperationResultRequest) -> Result<WorkspaceOperationResponse, SafeReadFailure>;
}
impl WorkspaceQueryService {
    /// Executes GetWorkspaceOperationResult within its local capability boundary.
    pub async fn get_operation_result(&self, actor: ActorContext, metadata: QueryMetadata, request: GetWorkspaceOperationResultRequest) -> Result<WorkspaceOperationResponse, SafeReadFailure>;
}
```

只读：ScopeService→read/source/visibility/attention/codec，无store写；metadata的page/idem必须None。 request/result字段由Step8同名卡片闭合；调用图由Step9同名流闭合。

#### GetWorkspaceRecoveryStatus callable

```rust
impl QueryHandlers {
    /// Validates the typed invocation and calls its application use case.
    pub async fn get_recovery_status(&self, actor: ActorContext, metadata: QueryMetadata, request: GetWorkspaceRecoveryStatusRequest) -> Result<WorkspaceRecoveryResponse, SafeReadFailure>;
}
impl WorkspaceQueryService {
    /// Executes GetWorkspaceRecoveryStatus within its local capability boundary.
    pub async fn get_recovery_status(&self, actor: ActorContext, metadata: QueryMetadata, request: GetWorkspaceRecoveryStatusRequest) -> Result<WorkspaceRecoveryResponse, SafeReadFailure>;
}
```

只读：ScopeService→read/source/visibility/attention/codec，无store写；metadata的page/idem必须None。 request/result字段由Step8同名卡片闭合；调用图由Step9同名流闭合。

#### ExportWorkspaceReadModel callable

```rust
impl QueryHandlers {
    /// Validates the typed invocation and calls its application use case.
    pub async fn export_read_model(&self, actor: ActorContext, metadata: QueryMetadata, request: ExportWorkspaceReadModelRequest) -> Result<WorkspaceExportResponse, SafeReadFailure>;
}
impl WorkspaceQueryService {
    /// Executes ExportWorkspaceReadModel within its local capability boundary.
    pub async fn export_read_model(&self, actor: ActorContext, metadata: QueryMetadata, request: ExportWorkspaceReadModelRequest) -> Result<WorkspaceExportResponse, SafeReadFailure>;
}
```

只读：ScopeService→read/source/visibility/attention/codec，无store写；metadata的page/idem必须None。 request/result字段由Step8同名卡片闭合；调用图由Step9同名流闭合。

#### ConsumeSourceChange callable

```rust
impl SourceChangeConsumer {
    /// Validates the typed invocation and calls its application use case.
    pub async fn consume_change(&self, actor: ActorContext, request: ConsumeSourceChangeRequest) -> Result<SourceChangeReceipt, SafeReadFailure>;
}
impl ProjectionApplyService {
    /// Executes ConsumeSourceChange within its local capability boundary.
    pub async fn consume_change(&self, actor: ActorContext, request: ConsumeSourceChangeRequest) -> Result<SourceChangeReceipt, SafeReadFailure>;
}
```

可信source例外只改变调用身份来源，不绕source isolation/visibility/幂等/状态；局部receipt不是bus ACK。 request/result字段由Step8同名卡片闭合；调用图由Step9同名流闭合。

#### ConsumeSourceInvalidation callable

```rust
impl SourceInvalidationConsumer {
    /// Validates the typed invocation and calls its application use case.
    pub async fn consume_invalidation(&self, actor: ActorContext, request: ConsumeSourceInvalidationRequest) -> Result<SourceInvalidationPageReceipt, SafeReadFailure>;
}
impl RecoveryService {
    /// Executes ConsumeSourceInvalidation within its local capability boundary.
    pub async fn consume_invalidation(&self, actor: ActorContext, request: ConsumeSourceInvalidationRequest) -> Result<SourceInvalidationPageReceipt, SafeReadFailure>;
}
```

可信source例外只改变调用身份来源，不绕source isolation/visibility/幂等/状态；局部receipt不是bus ACK。 request/result字段由Step8同名卡片闭合；调用图由Step9同名流闭合。

#### RequestWorkspaceRecovery callable

```rust
impl RecoveryHandlers {
    /// Validates the typed invocation and calls its application use case.
    pub async fn request_recovery(&self, actor: ActorContext, metadata: RequestMetadata, request: RequestWorkspaceRecoveryRequest) -> Result<WorkspaceWriteResult, SafeReadFailure>;
}
impl RecoveryService {
    /// Executes RequestWorkspaceRecovery within its local capability boundary.
    pub async fn request_recovery(&self, actor: ActorContext, metadata: RequestMetadata, request: RequestWorkspaceRecoveryRequest) -> Result<WorkspaceWriteResult, SafeReadFailure>;
}
```

metadata幂等键必填；先scope/操作权限、operation lookup；业务效果和结果原子。 request/result字段由Step8同名卡片闭合；调用图由Step9同名流闭合。

#### AdvanceWorkspaceRecovery callable

```rust
impl RecoveryHandlers {
    /// Validates the typed invocation and calls its application use case.
    pub async fn advance_recovery(&self, actor: ActorContext, metadata: RequestMetadata, request: AdvanceWorkspaceRecoveryRequest) -> Result<WorkspaceWriteResult, SafeReadFailure>;
}
impl RecoveryService {
    /// Executes AdvanceWorkspaceRecovery within its local capability boundary.
    pub async fn advance_recovery(&self, actor: ActorContext, metadata: RequestMetadata, request: AdvanceWorkspaceRecoveryRequest) -> Result<WorkspaceWriteResult, SafeReadFailure>;
}
```

metadata幂等键必填；先scope/操作权限、operation lookup；业务效果和结果原子。 request/result字段由Step8同名卡片闭合；调用图由Step9同名流闭合。

#### SupersedeWorkspaceRecovery callable

```rust
impl RecoveryHandlers {
    /// Validates the typed invocation and calls its application use case.
    pub async fn supersede_recovery(&self, actor: ActorContext, metadata: RequestMetadata, request: SupersedeWorkspaceRecoveryRequest) -> Result<WorkspaceWriteResult, SafeReadFailure>;
}
impl RecoveryService {
    /// Executes SupersedeWorkspaceRecovery within its local capability boundary.
    pub async fn supersede_recovery(&self, actor: ActorContext, metadata: RequestMetadata, request: SupersedeWorkspaceRecoveryRequest) -> Result<WorkspaceWriteResult, SafeReadFailure>;
}
```

metadata幂等键必填；先scope/操作权限、operation lookup；业务效果和结果原子。 request/result字段由Step8同名卡片闭合；调用图由Step9同名流闭合。

#### InvalidateWorkspaceView callable

```rust
impl InvalidationHandler {
    /// Validates the typed invocation and calls its application use case.
    pub async fn invalidate_view(&self, actor: ActorContext, metadata: RequestMetadata, request: InvalidateWorkspaceViewRequest) -> Result<WorkspaceWriteResult, SafeReadFailure>;
}
impl RecoveryService {
    /// Executes InvalidateWorkspaceView within its local capability boundary.
    pub async fn invalidate_view(&self, actor: ActorContext, metadata: RequestMetadata, request: InvalidateWorkspaceViewRequest) -> Result<WorkspaceWriteResult, SafeReadFailure>;
}
```

metadata幂等键必填；先scope/操作权限、operation lookup；业务效果和结果原子。 request/result字段由Step8同名卡片闭合；调用图由Step9同名流闭合。

内部callable（不是第十五入口）：

```rust
impl ScopeService {
    /// Resolves and validates the current owning scope relation.
    pub async fn resolve(&self, actor: &ActorContext, selector: &ScopeSelector) -> Result<WorkspaceScope, ApplicationError>;
    /// Checks an owning decision for an explicit local operation.
    pub async fn authorize_operation(&self, actor: &ActorContext, scope: &WorkspaceScope, kind: OperationKind) -> Result<(), ApplicationError>;
}
impl SourceReadService {
    /// Reads and binds a safe slice without storing it.
    pub async fn read(&self, actor: &ActorContext, scope: &WorkspaceScope, request: &OwnerReadRequest) -> Result<SourceSlice, ApplicationError>;
}
```

### 7.6 Infra实现与entry模块停审

| port | infra文件/拟定adapter | 可做 / 禁止 |
|---|---|---|
| ScopeResolverPort | scope_adapter.rs / ScopeAdapter | 正式关系只读；不得字符串拼scope |
| OwnerReadPort / AttentionResolverPort | owner_source_adapter.rs / OwnerSourceAdapter | 正式safe/attention绑定；不新增upstream command |
| VisibilityPort | visibility_adapter.rs / VisibilityAdapter | 消费逐domain决定；不可统一治理授权 |
| SourceEventPort | bus_subscription.rs / SourceEventAdapter | 验证正式envelope并委托owner比较；不自造游标 |
| RecoverySourcePort | recovery_source_adapter.rs / RecoverySourceAdapter | owner baseline/continuation；无projection baseline |
| WorkspaceReadPort | store_adapter.rs / WorkspaceReadAdapter | 只读账号/能力可独立注入，无隐式修复 |
| WorkspaceAtomicStore | store_adapter.rs / WorkspaceWriteAdapter | 原子能力不足则blocked，不退化分步save |
| WorkspaceCursorCodec | store_adapter.rs / WorkspaceCursorAdapter | 无持久写的token编解码，不授予权限 |
| IdPort | runtime_builder.rs / WorkspaceIdGenerator | 仅局部随机ID，不源身份 |

adapter具体driver字段/构造参数留Step11/14，当前不得宣称已经可装配。所有adapter错误必须分类，未知提交保留Unknown。API不依赖infra；worker/jobs仅main/bin组装infra，业务handler仅service。fake是测试替代物，不能生产自动回退。

| 模块 | 停审结果 |
|---|---|
| contracts/domain | 无I/O port、无反向依赖；typed协议不引domain |
| application | 单一port owner，完整读写pair，具名service已绑定 |
| infra | 一对一适配；无owner DB/publisher；source proof正向blocked |
| api | 八入口仅service，无runtime server |
| worker | 两consumer，receipt与transport动作分离 |
| jobs | 四一次性调用，不启动恢复循环 |

### 7.7 跨模块审计与Step6承接

| 审计 | 结论 / 限制 |
|---|---|
| Step6 support/carrier | CutoverBasis/ReadInputs等domain归属正确；store helpers不外泄 |
| 完整读取面 | snapshot/recovery_snapshot/operation/application/resolve_commit/affected_targets覆盖DTO/flow/state；无读写混合port |
| 版本与原子写 | 写batch含全部expected；唯一键与结果同提交；late不退cursor；CP5不切换 |
| shared名称 | Step4 OwnerSourcePort→OwnerReadPort，VisibilityResolverPort→VisibilityPort，WorkspaceStorePort拆Read/AtomicStore；只细化主体，不新增文件 |
| 异步/注入 | std boxed Send future可dyn；service async非trait，入口不得持锁跨await |
| 外部authority | 001/002/003/004/005 exact schema仍blocked；读端口存在不代表owner已提供 |
| 结果不确定 | result不存在不是rollback；commit attempt权威查询为local技术schema，Step11继续闭合 |
| 历史污染 | 不继承governance reservation/outbox/export publisher或仓内授权policy |

本步回填§5按模块port+adapter+callable，§6只索引；public DTO交Step8，不能伪造HTTP/topic名称。这里是传输无关内部函数合同，外部binding/topic等WS-UP闭口后另审。


### 7.8 Step9/10前向审查回源补齐

发现并修正：普通snapshot只能读current，candidate事件处理需独立目标快照；失效同时触及多个generation必须带各自view CAS；baseline的Inbox来源ApplicationResultRef必须能回读已存依据，不能只分配裸ID。补充均为已有16对象的技术读写载体，不增领域状态机/入口/owner；本节同属Step7回源修订。

### SourceTargetSnapshot

位置：`crates/application/src/store_ports.rs`。能力：Reads the explicitly selected event target.

```rust
/// Reads the explicitly selected event target.
pub struct SourceTargetSnapshot {
    /// Checked workspace value.
    workspace: WorkspaceSnapshot,
    /// Checked target value.
    target: GenerationState,
    /// Checked projection value.
    projection: PartitionProjection,
    /// Checked attempt value.
    attempt: Option<RebuildAttempt>,
}
```

| 字段 | 类型 | 来源 / 约束 / optional |
|---|---|---|
| `workspace` | `WorkspaceSnapshot` | 分区/当前/失效一致快照 |
| `target` | `GenerationState` | 请求指定的已有generation |
| `projection` | `PartitionProjection` | 目标generation而非默认current |
| `attempt` | `Option<RebuildAttempt>` | Candidate必Some非终态；Current为None；Retired拒绝 |

| 成员签名 | 参数/返回/效果 |
|---|---|
| `pub fn validate(&self) -> Result<(), ApplicationError>` | 所有主语/版本一致；来源proof仍blocked |

| 工厂签名 | 来源与初始条件 |
|---|---|
| `pub fn try_new(workspace: WorkspaceSnapshot, target: GenerationState, projection: PartitionProjection, attempt: Option<RebuildAttempt>) -> Result<Self, ApplicationError>` | 来自原子读或对应recovery写batch；binding与结果/projection同事务append |

不变量/禁止：仅技术映射，不创建owner truth或新的business状态机。

### InvalidationTargetSnapshot

位置：`crates/application/src/store_ports.rs`。能力：Binds invalidation to target compare versions.

```rust
/// Binds invalidation to target compare versions.
pub struct InvalidationTargetSnapshot {
    /// Checked generation value.
    generation: GenerationState,
    /// Checked projection value.
    projection: PartitionProjection,
    /// Checked attempt value.
    attempt: Option<RebuildAttempt>,
}
```

| 字段 | 类型 | 来源 / 约束 / optional |
|---|---|---|
| `generation` | `GenerationState` | 已有目标role/safety |
| `projection` | `PartitionProjection` | 同快照expected view |
| `attempt` | `Option<RebuildAttempt>` | Candidate活跃尝试及expected，其他None |

| 成员签名 | 参数/返回/效果 |
|---|---|
| `pub fn validate(&self) -> Result<(), ApplicationError>` | 所有主语/版本一致；来源proof仍blocked |

| 工厂签名 | 来源与初始条件 |
|---|---|
| `pub fn try_new(generation: GenerationState, projection: PartitionProjection, attempt: Option<RebuildAttempt>) -> Result<Self, ApplicationError>` | 来自原子读或对应recovery写batch；binding与结果/projection同事务append |

不变量/禁止：仅技术映射，不创建owner truth或新的business状态机。

### BaselineApplicationBinding

位置：`crates/application/src/store_ports.rs`。能力：Links baseline-derived inbox items to a committed recovery result.

```rust
/// Links baseline-derived inbox items to a committed recovery result.
pub struct BaselineApplicationBinding {
    /// Checked application value.
    application: ApplicationResultRef,
    /// Checked operation value.
    operation: WorkspaceOperationRef,
    /// Checked attempt value.
    attempt: RebuildAttemptId,
    /// Checked generation value.
    generation: GenerationId,
    /// Checked baseline value.
    baseline: OwnerBaselineBasis,
    /// Checked revision value.
    revision: ViewRevision,
}
```

| 字段 | 类型 | 来源 / 约束 / optional |
|---|---|---|
| `application` | `ApplicationResultRef` | IdPort.application生成，局部命名空间全局唯一 |
| `operation` | `WorkspaceOperationRef` | 同次recovery stored result |
| `attempt` | `RebuildAttemptId` | 本次候选尝试 |
| `generation` | `GenerationId` | 候选 |
| `baseline` | `OwnerBaselineBasis` | 本批正式owner依据 |
| `revision` | `ViewRevision` | 本批提交的projection revision |

| 成员签名 | 参数/返回/效果 |
|---|---|
| `pub fn validate(&self) -> Result<(), ApplicationError>` | 所有主语/版本一致；来源proof仍blocked |

| 工厂签名 | 来源与初始条件 |
|---|---|
| `pub fn try_new(application: ApplicationResultRef, operation: WorkspaceOperationRef, attempt: RebuildAttemptId, generation: GenerationId, baseline: OwnerBaselineBasis, revision: ViewRevision) -> Result<Self, ApplicationError>` | 来自原子读或对应recovery写batch；binding与结果/projection同事务append |

不变量/禁止：仅技术映射，不创建owner truth或新的business状态机。

source_snapshot/invalidation_snapshot/baseline_application字段/返回类型已并入WorkspaceReadPort；此处对象卡提供完整typed读取结果。

SourceApplyCommit/SourceGapCommit的attempt_after字段已在原卡闭合：只有需要Ready→Validating时Some，None禁止隐式修改attempt。CutoverBasis.validate在mark_ready准备阶段以expected_attempt=旧attempt.next检查，在Ready切换阶段以expected_attempt=当前attempt检查；调用阶段由attempt.status确定，不引入可由请求绕过的bool。candidate.validate只校验basis/candidate，不自行读取或假造attempt版本。

SourceEventPort.classify的snapshot参数正式收敛为`&SourceTargetSnapshot`（不是只current的WorkspaceSnapshot）；SourceApplyCommit/SourceGapCommit均新增`target_before: SourceTargetSnapshot`、`target_after: GenerationState`，构造参数同顺序追加，含target view/role/safety/active attempt expected。Candidate应用新数据时调用GenerationState.invalidate_validation，若Ready则与attempt.revalidate同事务；此后attempt.expected版本参与CAS，不能在Superseded/切换后继续写旧candidate。Current只可在pointer未变时应用，不将Validated安全状态变更为Unverified。

InvalidationCommit新增`before: Vec<InvalidationTargetSnapshot>`、`after: Vec<InvalidationTargetSnapshot>`，同target集合且各轴逐一CAS；after由GenerationState.invalidate、PartitionProjection.invalidate、必要attempt.block产生，禁止store猜领域迁移。RecoveryCommit新增`baseline_bindings: Vec<BaselineApplicationBinding>`：baseline/catch-up形成InboxItem时每批必有对应binding；其他分支空。不复用SourceApplicationRecord terminal event key冒充baseline event；application reference跨event/baseline命名空间不可冲突。读取可经baseline_application回链真实owner proof与stored operation，不能只有字符串ID。

这些字段的Rust结构/构造同表定义作为原卡增量（不是optional未闭口占位）；Step11须定义映射表和事务/索引。Gap commit权威lookup增加Gap分支已收口，不能被误解成Source终局。service仍原七个，不新增技术service。



#### 回源增补审查

VisibilityPort的bind_result/validate_invalidation已合并§7.3唯一trait；WorkspaceReadPort的target/provenance读面已合并§7.4，不保留第二份同名trait定义。

SourceEventPort验证后取source target scope selector、authority/principal关系、canonical event字段的访问合同仍WS-UP-002/003/005，不允许从projection scope ref字符串反推。恢复Ready的CutoverBasis.expected_attempt记录**mark_ready之后拟提交的AttemptVersion**；mark_ready校验其等expected.checked_next，candidate.validate同份basis，原子save确认后Ready下一次调用才可cutover。合法候选并发数据/gap使Validated→Unverified、Ready→Validating同提交；安全失效则SafetyBlocked及非终态attempt→Blocked，不能revalidate解封。


## 8. 回填草稿

摘录§7模块port、helper、完整callable和adapter矩阵到正式§5，保留blocked slot与原子语义上限；正式03仍不装配。

## 9. 待确认

WS-UP-001~008/006-S保持open，具体正向schema/绑定仍blocked；不跨项目回写。

## 10. 下一步门禁

本步模块/接缝/读取面/版本来源/历史审计完成；允许Step8；所有external slots保持blocked，不宣称编译/集成可用。
