# L6-bridges 03 Step7：Application共用支持契约

## 1. 当前模块与边界

A0问题/诊断/取舍在主文件§3/4/6已done，当前只关闭本附录。所有路径是Step4既有责任，不是已创建实现文件；不实现、不运行测试。这里的support/helper不增加RuntimeSeamKind的23业务port；各type为Application内部，禁止wire/public page/Domain反向依赖。

## 2. Future唯一形态

计划归属`crates/application/src/ports/mod.rs`。

```rust
/// 本call内、executor-neutral且不要求Send的typed边界Future。
pub type BridgePortFuture<'call, T> = std::pin::Pin<
    Box<dyn std::future::Future<Output = Result<T, BridgePortError>> + 'call>
>;
```

所有port方法仅lifetime泛型，无associated generic方法、dyn async fn或Any；所有await在scoped call内poll，不进入detached/global/static容器。生命周期泛型方法允许dyn注入。std的Pin/Box/Future/Cell不新增产品/依赖选择；内存分配/宿主策略须受profile和未来运行门禁核验。

## 3. 有限失败与资格处置

### BridgeCallPhase

计划归属`crates/application/src/ports/mod.rs`；只标本地等待所在阶段，绝非业务终态或无效果证明。

```rust
/// 只标本地等待所在阶段，绝非业务终态或无效果证明。
pub enum BridgeCallPhase {
    /// 进入边界调用前。
    BeforeDispatch,
    /// local transaction stage。
    LocalStage,
    /// 原local commit等待。
    LocalCommit,
    /// 原owner operation交接等待。
    OwnerHandoff,
    /// 原platform effect等待。
    PlatformEffect,
    /// 原safe consumer交接等待。
    ConsumerHandoff,
}
```

| 变体 | Rustdoc / 载荷 | 允许来源 | 允许去向 |
|---|---|---|---|
| `BeforeDispatch` | 进入边界调用前。 | 所属具名typed方法/actual来源；仅结构factory不授权 | 按当前分支显式处理，不推断其他阶段成功或创建新权限 |
| `LocalStage` | local transaction stage。 | 所属具名typed方法/actual来源；仅结构factory不授权 | 按当前分支显式处理，不推断其他阶段成功或创建新权限 |
| `LocalCommit` | 原local commit等待。 | 所属具名typed方法/actual来源；仅结构factory不授权 | 按当前分支显式处理，不推断其他阶段成功或创建新权限 |
| `OwnerHandoff` | 原owner operation交接等待。 | 所属具名typed方法/actual来源；仅结构factory不授权 | 按当前分支显式处理，不推断其他阶段成功或创建新权限 |
| `PlatformEffect` | 原platform effect等待。 | 所属具名typed方法/actual来源；仅结构factory不授权 | 按当前分支显式处理，不推断其他阶段成功或创建新权限 |
| `ConsumerHandoff` | 原safe consumer交接等待。 | 所属具名typed方法/actual来源；仅结构factory不授权 | 按当前分支显式处理，不推断其他阶段成功或创建新权限 |

成员/工厂：按payload完整构造及穷尽match；无默认variant、自由文本、mutable getter、raw Error-source或自动serde。

### BridgeLocalConflict

计划归属`crates/application/src/ports/mod.rs`；有限local冲突载荷，只供Application受限处理，禁止直接公开ref。

```rust
/// 有限local冲突载荷，只供Application受限处理，禁止直接公开ref。
pub enum BridgeLocalConflict {
    /// 同subject local CAS冲突；actual=None只表示行缺失，不是rollback。
    Version {
        /// subject的typed载荷，来源按本变体约束，不接受raw材料。
        subject: BridgeViewSubjectRef,
        /// expected的typed载荷，来源按本变体约束，不接受raw材料。
        expected: LocalRevisionCondition,
        /// actual的typed载荷，来源按本变体约束，不接受raw材料。
        actual: Option<LocalRevision>,
    },
    /// 同qualified key安全含义冲突，不换key继续。
    SemanticKey {
        /// key的typed载荷，来源按本变体约束，不接受raw材料。
        key: QualifiedIdempotencyKey,
    },
    /// C04/E02原effect唯一冲突，不新建效果。
    Effect {
        /// effect的typed载荷，来源按本变体约束，不接受raw材料。
        effect: StableEffectIdentity,
    },
    /// 原action已claim/失效，不复活。
    OneUse {
        /// action的typed载荷，来源按本变体约束，不接受raw材料。
        action: ExternalActionBindingRef,
    },
    /// 共享bucket/顺序或fence条件不满足，不绕lane。
    RateReservation {
        /// scope的typed载荷，来源按本变体约束，不接受raw材料。
        scope: QualifiedLaneOrderScope,
    },
}
```

| 变体 | Rustdoc / 载荷 | 允许来源 | 允许去向 |
|---|---|---|---|
| `Version { subject: BridgeViewSubjectRef, expected: LocalRevisionCondition, actual: Option<LocalRevision> }` | 同subject local CAS冲突；actual=None只表示行缺失，不是rollback。 | 所属具名typed方法/actual来源；仅结构factory不授权 | 按当前分支显式处理，不推断其他阶段成功或创建新权限 |
| `SemanticKey { key: QualifiedIdempotencyKey }` | 同qualified key安全含义冲突，不换key继续。 | 所属具名typed方法/actual来源；仅结构factory不授权 | 按当前分支显式处理，不推断其他阶段成功或创建新权限 |
| `Effect { effect: StableEffectIdentity }` | C04/E02原effect唯一冲突，不新建效果。 | 所属具名typed方法/actual来源；仅结构factory不授权 | 按当前分支显式处理，不推断其他阶段成功或创建新权限 |
| `OneUse { action: ExternalActionBindingRef }` | 原action已claim/失效，不复活。 | 所属具名typed方法/actual来源；仅结构factory不授权 | 按当前分支显式处理，不推断其他阶段成功或创建新权限 |
| `RateReservation { scope: QualifiedLaneOrderScope }` | 共享bucket/顺序或fence条件不满足，不绕lane。 | 所属具名typed方法/actual来源；仅结构factory不授权 | 按当前分支显式处理，不推断其他阶段成功或创建新权限 |

成员/工厂：按payload完整构造及穷尽match；无默认variant、自由文本、mutable getter、raw Error-source或自动serde。

### BridgePortError

计划归属`crates/application/src/ports/mod.rs`；完整有限port调用失败；不接raw SQL/HTTP/SDK/stack/panic或Error source。

```rust
/// 完整有限port调用失败；不接raw SQL/HTTP/SDK/stack/panic或Error source。
pub enum BridgePortError {
    /// 结构校验失败，零隐式补字段。
    InvalidInput(ContractViolation),
    /// 当下责任/权限拒绝；不透漏存在性。
    Denied(SafeReasonCode),
    /// 正式binding/provider/schema/codec未建立；不生产fallback。
    NotEstablished(SafeReasonCode),
    /// 此method/mode或协议不支持，不默换action。
    Unsupported(SafeReasonCode),
    /// 当前basis/secret/source失效，停止新IO。
    Stale(SafeReasonCode),
    /// 具名CAS/semantic/effect/one-use/rate冲突；不由字符串分类。
    Conflict(BridgeLocalConflict),
    /// 调用不能取得合法typed业务结果；不是known rejection/no-effect。
    Unavailable(SafeReasonCode),
    /// 本地停止等待，阶段不提供effect proof。
    Cancelled(BridgeCallPhase),
    /// 可能已出本地/外部效果而结果未知，保原op/effect。
    Indeterminate {
        /// original的typed载荷，来源按本变体约束，不接受raw材料。
        original: OriginalOperationEffectRef,
        /// phase的typed载荷，来源按本变体约束，不接受raw材料。
        phase: BridgeCallPhase,
    },
    /// 同kind/scope/source/driver或模型不一致，fail-closed。
    InvariantViolation(SafeReasonCode),
}
```

| 变体 | Rustdoc / 载荷 | 允许来源 | 允许去向 |
|---|---|---|---|
| `InvalidInput(ContractViolation)` | 结构校验失败，零隐式补字段。 | 所属具名typed方法/actual来源；仅结构factory不授权 | 按当前分支显式处理，不推断其他阶段成功或创建新权限 |
| `Denied(SafeReasonCode)` | 当下责任/权限拒绝；不透漏存在性。 | 所属具名typed方法/actual来源；仅结构factory不授权 | 按当前分支显式处理，不推断其他阶段成功或创建新权限 |
| `NotEstablished(SafeReasonCode)` | 正式binding/provider/schema/codec未建立；不生产fallback。 | 所属具名typed方法/actual来源；仅结构factory不授权 | 按当前分支显式处理，不推断其他阶段成功或创建新权限 |
| `Unsupported(SafeReasonCode)` | 此method/mode或协议不支持，不默换action。 | 所属具名typed方法/actual来源；仅结构factory不授权 | 按当前分支显式处理，不推断其他阶段成功或创建新权限 |
| `Stale(SafeReasonCode)` | 当前basis/secret/source失效，停止新IO。 | 所属具名typed方法/actual来源；仅结构factory不授权 | 按当前分支显式处理，不推断其他阶段成功或创建新权限 |
| `Conflict(BridgeLocalConflict)` | 具名CAS/semantic/effect/one-use/rate冲突；不由字符串分类。 | 所属具名typed方法/actual来源；仅结构factory不授权 | 按当前分支显式处理，不推断其他阶段成功或创建新权限 |
| `Unavailable(SafeReasonCode)` | 调用不能取得合法typed业务结果；不是known rejection/no-effect。 | 所属具名typed方法/actual来源；仅结构factory不授权 | 按当前分支显式处理，不推断其他阶段成功或创建新权限 |
| `Cancelled(BridgeCallPhase)` | 本地停止等待，阶段不提供effect proof。 | 所属具名typed方法/actual来源；仅结构factory不授权 | 按当前分支显式处理，不推断其他阶段成功或创建新权限 |
| `Indeterminate { original: OriginalOperationEffectRef, phase: BridgeCallPhase }` | 可能已出本地/外部效果而结果未知，保原op/effect。 | 所属具名typed方法/actual来源；仅结构factory不授权 | 按当前分支显式处理，不推断其他阶段成功或创建新权限 |
| `InvariantViolation(SafeReasonCode)` | 同kind/scope/source/driver或模型不一致，fail-closed。 | 所属具名typed方法/actual来源；仅结构factory不授权 | 按当前分支显式处理，不推断其他阶段成功或创建新权限 |

成员/工厂：按payload完整构造及穷尽match；无默认variant、自由文本、mutable getter、raw Error-source或自动serde。

### BridgeQualificationOutcome<T>

计划归属`crates/application/src/ports/mod.rs`；取得的业务资格处置与调用失败分开；仅Qualified分支携合法当前typed值。

```rust
/// 取得的业务资格处置与调用失败分开；仅Qualified分支携合法当前typed值。
pub enum BridgeQualificationOutcome<T> {
    /// actual qualified来源；constructor本身不授权。
    Qualified(T),
    /// 当前依据缺失或拒绝，不能生成Established Slot。
    Blocked {
        /// reason的typed载荷，来源按本变体约束，不接受raw材料。
        reason: SafeReasonCode,
        /// checked_at的typed载荷，来源按本变体约束，不接受raw材料。
        checked_at: SafeInstant,
    },
    /// 来源不能给资格，不用旧快照放行。
    Unavailable {
        /// reason的typed载荷，来源按本变体约束，不接受raw材料。
        reason: SafeReasonCode,
        /// checked_at的typed载荷，来源按本变体约束，不接受raw材料。
        checked_at: SafeInstant,
    },
    /// 正式source宣告此能力不支持，不降为成功。
    Unsupported {
        /// reason的typed载荷，来源按本变体约束，不接受raw材料。
        reason: SafeReasonCode,
        /// checked_at的typed载荷，来源按本变体约束，不接受raw材料。
        checked_at: SafeInstant,
    },
    /// 旧资格已失效，所属J05可记局部失效；Query不写。
    Stale {
        /// reason的typed载荷，来源按本变体约束，不接受raw材料。
        reason: SafeReasonCode,
        /// checked_at的typed载荷，来源按本变体约束，不接受raw材料。
        checked_at: SafeInstant,
    },
}
```

| 变体 | Rustdoc / 载荷 | 允许来源 | 允许去向 |
|---|---|---|---|
| `Qualified(T)` | actual qualified来源；constructor本身不授权。 | 所属具名typed方法/actual来源；仅结构factory不授权 | 按当前分支显式处理，不推断其他阶段成功或创建新权限 |
| `Blocked { reason: SafeReasonCode, checked_at: SafeInstant }` | 当前依据缺失或拒绝，不能生成Established Slot。 | 所属具名typed方法/actual来源；仅结构factory不授权 | 按当前分支显式处理，不推断其他阶段成功或创建新权限 |
| `Unavailable { reason: SafeReasonCode, checked_at: SafeInstant }` | 来源不能给资格，不用旧快照放行。 | 所属具名typed方法/actual来源；仅结构factory不授权 | 按当前分支显式处理，不推断其他阶段成功或创建新权限 |
| `Unsupported { reason: SafeReasonCode, checked_at: SafeInstant }` | 正式source宣告此能力不支持，不降为成功。 | 所属具名typed方法/actual来源；仅结构factory不授权 | 按当前分支显式处理，不推断其他阶段成功或创建新权限 |
| `Stale { reason: SafeReasonCode, checked_at: SafeInstant }` | 旧资格已失效，所属J05可记局部失效；Query不写。 | 所属具名typed方法/actual来源；仅结构factory不授权 | 按当前分支显式处理，不推断其他阶段成功或创建新权限 |

成员/工厂：按payload完整构造及穷尽match；无默认variant、自由文本、mutable getter、raw Error-source或自动serde。

调用失败与业务结果分开：known owner/platform/consumer结果、LocalCommitDisposition、LocalCasDisposition仍用Step6独立载体。Err取消/timeout/不可用不自动写Rejected/RolledBack/Expired或生成NoIo/NoEffect。raw foreign error在Infra分类后立即结束引用；Application/entry不解析Display/source/message。

X审计补充取消出口：`Cancelled(phase)`只允许尚未建立原operation且未越过可能产生效果的边界。已有原operation时，Application必须返回保原operation的稳定取消/known结果，或`Indeterminate { original, phase }`；commit/owner/platform/consumer dispatch之后禁止把unknown缩成不携original的Cancelled/Unavailable。entry即使停止poll也须保留从actual claim/结果取得的unresolved集合；drop、deadline及进程停止不能删原operation。该约束不把取消宣称为NoIo/NoEffect，也不为尚未分配的operation制造占位ID。

## 4. 完整读取与分页

### BridgeLocalReadPurpose

计划归属`crates/application/src/ports/local_snapshots.rs`；具名local读用途，Query不能混用维护候选读取或事务。

```rust
/// 具名local读用途，Query不能混用维护候选读取或事务。
pub enum BridgeLocalReadPurpose {
    /// C01~06管理/prepare前置。
    Command,
    /// Q01~04当前受权已有safe slice。
    Query,
    /// E01/E02/E04当前安全source与原result。
    Ingress,
    /// E03原action/source/one-use/result。
    Callback,
    /// J01~05与qualified eligible scope。
    Maintenance,
}
```

| 变体 | Rustdoc / 载荷 | 允许来源 | 允许去向 |
|---|---|---|---|
| `Command` | C01~06管理/prepare前置。 | 所属具名typed方法/actual来源；仅结构factory不授权 | 按当前分支显式处理，不推断其他阶段成功或创建新权限 |
| `Query` | Q01~04当前受权已有safe slice。 | 所属具名typed方法/actual来源；仅结构factory不授权 | 按当前分支显式处理，不推断其他阶段成功或创建新权限 |
| `Ingress` | E01/E02/E04当前安全source与原result。 | 所属具名typed方法/actual来源；仅结构factory不授权 | 按当前分支显式处理，不推断其他阶段成功或创建新权限 |
| `Callback` | E03原action/source/one-use/result。 | 所属具名typed方法/actual来源；仅结构factory不授权 | 按当前分支显式处理，不推断其他阶段成功或创建新权限 |
| `Maintenance` | J01~05与qualified eligible scope。 | 所属具名typed方法/actual来源；仅结构factory不授权 | 按当前分支显式处理，不推断其他阶段成功或创建新权限 |

成员/工厂：按payload完整构造及穷尽match；无默认variant、自由文本、mutable getter、raw Error-source或自动serde。

### BridgeRepositoryOrder

计划归属`crates/application/src/ports/local_snapshots.rs`；稳定本地页排序，不宣平台全局或跨stream先后。

```rust
/// 稳定本地页排序，不宣平台全局或跨stream先后。
pub enum BridgeRepositoryOrder {
    /// store正式opaque local identity byte-order，稳定但不表示创建时间。
    LocalIdentity,
    /// 已保存/合格due_at下界优先，再local identity；分页固定原as_of。
    EligibleAtThenIdentity,
}
```

| 变体 | Rustdoc / 载荷 | 允许来源 | 允许去向 |
|---|---|---|---|
| `LocalIdentity` | store正式opaque local identity byte-order，稳定但不表示创建时间。 | 所属具名typed方法/actual来源；仅结构factory不授权 | 按当前分支显式处理，不推断其他阶段成功或创建新权限 |
| `EligibleAtThenIdentity` | 已保存/合格due_at下界优先，再local identity；分页固定原as_of。 | 所属具名typed方法/actual来源；仅结构factory不授权 | 按当前分支显式处理，不推断其他阶段成功或创建新权限 |

成员/工厂：按payload完整构造及穷尽match；无默认variant、自由文本、mutable getter、raw Error-source或自动serde。

### BridgeMaintenanceKind

计划归属`crates/application/src/ports/local_snapshots.rs`；已有五job的本地eligible分支，不是新operation selector。

```rust
/// 已有五job的本地eligible分支，不是新operation selector。
pub enum BridgeMaintenanceKind {
    /// J01既有intent。
    Dispatch,
    /// J02原RecoveryRecord。
    ReconcileOperation,
    /// J03原Gap。
    ReconcileGap,
    /// J04原SafeHandoff。
    RetryHandoff,
    /// J05既有qualification subject，不假造intent。
    RefreshQualification,
}
```

| 变体 | Rustdoc / 载荷 | 允许来源 | 允许去向 |
|---|---|---|---|
| `Dispatch` | J01既有intent。 | 所属具名typed方法/actual来源；仅结构factory不授权 | 按当前分支显式处理，不推断其他阶段成功或创建新权限 |
| `ReconcileOperation` | J02原RecoveryRecord。 | 所属具名typed方法/actual来源；仅结构factory不授权 | 按当前分支显式处理，不推断其他阶段成功或创建新权限 |
| `ReconcileGap` | J03原Gap。 | 所属具名typed方法/actual来源；仅结构factory不授权 | 按当前分支显式处理，不推断其他阶段成功或创建新权限 |
| `RetryHandoff` | J04原SafeHandoff。 | 所属具名typed方法/actual来源；仅结构factory不授权 | 按当前分支显式处理，不推断其他阶段成功或创建新权限 |
| `RefreshQualification` | J05既有qualification subject，不假造intent。 | 所属具名typed方法/actual来源；仅结构factory不授权 | 按当前分支显式处理，不推断其他阶段成功或创建新权限 |

成员/工厂：按payload完整构造及穷尽match；无默认variant、自由文本、mutable getter、raw Error-source或自动serde。

### BridgeRepositoryFilter

`MappingFamily`复用既有`MappingRef`的三种kind但不复制ref载荷；本Step只增加仓内筛选enum，唯一在local_snapshots.rs。

```rust
/// 区分三种仓内mapping页，防同relation cursor跨方法复用。
pub enum BridgeMappingPageKind {
    /// 账号mapping页。
    Identity,
    /// 位置mapping页。
    Location,
    /// 消息mapping页。
    Message,
}
```

| 变体 | Rustdoc / 作用 | 来源 / 去向 |
|---|---|---|
| Identity | 账号mapping页。 | list_identities；非wire selector |
| Location | 位置mapping页。 | list_locations；非wire selector |
| Message | 消息mapping页。 | list_messages；非wire selector |

计划归属`crates/application/src/ports/local_snapshots.rs`；分页完整typed筛选，来源只有具名方法keys与current context。

```rust
/// 分页完整typed筛选，来源只有具名方法keys与current context。
pub enum BridgeRepositoryFilter {
    /// 配置稳定namespace lookup。
    Installation {
        /// namespace的typed载荷，来源按本变体约束，不接受raw材料。
        namespace: InstallationNamespace,
    },
    /// 同安装relation范围。
    Binding {
        /// installation的typed载荷，来源按本变体约束，不接受raw材料。
        installation: BridgeInstallationRef,
    },
    /// 同relation三mapping。
    Mapping {
        /// binding的typed载荷，来源按本变体约束，不接受raw材料。
        binding: ExternalBindingRef,
        /// 原具名mapping方法族。
        kind: BridgeMappingPageKind,
    },
    /// 同安装external scope/action的relation反查。
    BindingExternal {
        /// 原安装。
        installation: BridgeInstallationRef,
        /// exact外部scope。
        external: ExternalScopeLocator,
        /// 原受权动作。
        action: DirectionActionKind,
    },
    /// 同安装内部target/action的relation反查。
    BindingTarget {
        /// 原安装。
        installation: BridgeInstallationRef,
        /// 正式target。
        target: BridgeInternalTargetRef,
        /// 原动作。
        action: DirectionActionKind,
    },
    /// 同relation/generation的正式actor反查。
    IdentitiesForActor {
        /// 原relation。
        binding: ExternalBindingRef,
        /// 原代际。
        generation: BindingGeneration,
        /// 去显示名的正式actor。
        actor: ActorRef,
    },
    /// 同relation/generation的target反查。
    LocationsForTarget {
        /// 原relation。
        binding: ExternalBindingRef,
        /// 原代际。
        generation: BindingGeneration,
        /// 正式target。
        target: BridgeInternalTargetRef,
    },
    /// 原安全来源版本反查known message。
    MessagesForSource {
        /// 原relation。
        binding: ExternalBindingRef,
        /// 原代际。
        generation: BindingGeneration,
        /// exact安全source/version。
        source: SafeSourceVersionRef,
    },
    /// 同原operation immutable audit页。
    AuditsForOperation { original: OriginalOperationEffectRef },
    /// same stream全部gap页。
    GapsForStream { stream: CursorNamespaceStream },
    /// 原operation的recovery页。
    RecoveriesForOperation { original: OriginalOperationEffectRef },
    /// 同binding lane页。
    LanesForBinding { binding: ExternalBindingRef },
    /// 完整qualified bound set的受影响lane页。
    LanesForBounds { bounds: QualifiedRateLimitBoundSet },
    /// 同binding既有action页。
    ActionsForBinding { binding: ExternalBindingRef },
    /// 同binding的原plan页。
    DeliveryPlans { binding: ExternalBindingRef },
    /// 同binding的原intent页。
    DeliveryIntents { binding: ExternalBindingRef },
    /// 原intent所有bounded attempt页。
    AttemptsForIntent { intent: DeliveryIntentRef },
    /// 原intent known receipt页。
    ReceiptsForIntent { intent: DeliveryIntentRef },
    /// source-target受限反查，None仅获准source范围。
    Source {
        /// source的typed载荷，来源按本变体约束，不接受raw材料。
        source: CommittedSourceVersionRef,
        /// target的typed载荷，来源按本变体约束，不接受raw材料。
        target: Option<ImmutableDeliveryTargetRef>,
    },
    /// exact local subject slice。
    Subject {
        /// subject的typed载荷，来源按本变体约束，不接受raw材料。
        subject: BridgeViewSubjectRef,
    },
    /// 原op/effect完整result/阶段范围。
    Operation {
        /// original的typed载荷，来源按本变体约束，不接受raw材料。
        original: OriginalOperationEffectRef,
    },
    /// 同namespace/stage/stream范围，不跨epoch比较。
    Stream {
        /// stream的typed载荷，来源按本变体约束，不接受raw材料。
        stream: CursorNamespaceStream,
    },
    /// 受权lane/dependency/shared下界。
    Lane {
        /// scope的typed载荷，来源按本变体约束，不接受raw材料。
        scope: QualifiedLaneOrderScope,
    },
    /// 固定qualified job scope/原as_of，不能Query触发maintenance。
    Eligible {
        /// kind的typed载荷，来源按本变体约束，不接受raw材料。
        kind: BridgeMaintenanceKind,
        /// scope的typed载荷，来源按本变体约束，不接受raw材料。
        scope: SafeScopeRef,
        /// as_of的typed载荷，来源按本变体约束，不接受raw材料。
        as_of: SafeInstant,
    },
}
```

| 变体 | Rustdoc / 载荷 | 允许来源 | 允许去向 |
|---|---|---|---|
| `Installation { namespace: InstallationNamespace }` | 配置稳定namespace lookup。 | 所属具名typed方法/actual来源；仅结构factory不授权 | 按当前分支显式处理，不推断其他阶段成功或创建新权限 |
| `Binding { installation: BridgeInstallationRef }` | 同安装relation范围。 | 所属具名typed方法/actual来源；仅结构factory不授权 | 按当前分支显式处理，不推断其他阶段成功或创建新权限 |
| `Mapping { binding: ExternalBindingRef, kind: BridgeMappingPageKind }` | 同relation具名mapping族。 | 三种list与原relation | 不跨族复用cursor |
| `BindingExternal { installation: BridgeInstallationRef, external: ExternalScopeLocator, action: DirectionActionKind }` | 同安装外部反查。 | find_bindings_for_external全部keys | 只同筛选继续页 |
| `BindingTarget { installation: BridgeInstallationRef, target: BridgeInternalTargetRef, action: DirectionActionKind }` | 同安装内部反查。 | find_bindings_for_target全部keys | 只同筛选继续页 |
| `IdentitiesForActor { binding: ExternalBindingRef, generation: BindingGeneration, actor: ActorRef }` | 同actor账号反查。 | list_identities_for_actor全部keys | 只同筛选继续页 |
| `LocationsForTarget { binding: ExternalBindingRef, generation: BindingGeneration, target: BridgeInternalTargetRef }` | 同target位置反查。 | list_locations_for_target全部keys | 只同筛选继续页 |
| `MessagesForSource { binding: ExternalBindingRef, generation: BindingGeneration, source: SafeSourceVersionRef }` | 同source消息反查。 | list_messages_for_source全部keys | 只同筛选继续页 |
| `Source { source: CommittedSourceVersionRef, target: Option<ImmutableDeliveryTargetRef> }` | source-target受限反查，None仅获准source范围。 | 所属具名typed方法/actual来源；仅结构factory不授权 | 按当前分支显式处理，不推断其他阶段成功或创建新权限 |
| `DeliveryPlans { binding: ExternalBindingRef }` | 同relation原plan页。 | list_plans_for_binding全部keys | 不能与intent页互用cursor |
| `ActionsForBinding { binding: ExternalBindingRef }` | 同relation原action页。 | list_actions_for_binding全部keys | 不跨其他binding页族 |
| `GapsForStream { stream: CursorNamespaceStream }` | 同stage/stream gap页。 | list_gaps全部keys | 不跨namespace/epoch/stream |
| `AuditsForOperation { original: OriginalOperationEffectRef }` | 同原op audit页。 | list_audits全部keys | 不跨其他Operation页族 |
| `RecoveriesForOperation { original: OriginalOperationEffectRef }` | 原op recovery页。 | list_recoveries全部keys | 不换op/effect |
| `LanesForBinding { binding: ExternalBindingRef }` | 原relation lane页。 | list_for_binding全部keys | 不跨relation |
| `LanesForBounds { bounds: QualifiedRateLimitBoundSet }` | 同完整bucket资格受影响lane页。 | list_affected_by_bounds的全bounds | 任一scope/basis/version变化拒绝旧cursor |
| `DeliveryIntents { binding: ExternalBindingRef }` | 同relation原intent页。 | list_intents_for_binding全部keys | 不能与plan页互用cursor |
| `AttemptsForIntent { intent: DeliveryIntentRef }` | 原intent attempt页。 | list_attempts原intent | 不跨receipt方法 |
| `ReceiptsForIntent { intent: DeliveryIntentRef }` | 原intent known receipt页。 | list_receipts原intent | 不跨attempt方法 |
| `Subject { subject: BridgeViewSubjectRef }` | exact local subject slice。 | 所属具名typed方法/actual来源；仅结构factory不授权 | 按当前分支显式处理，不推断其他阶段成功或创建新权限 |
| `Operation { original: OriginalOperationEffectRef }` | 原op/effect完整result/阶段范围。 | 所属具名typed方法/actual来源；仅结构factory不授权 | 按当前分支显式处理，不推断其他阶段成功或创建新权限 |
| `Stream { stream: CursorNamespaceStream }` | 同namespace/stage/stream范围，不跨epoch比较。 | 所属具名typed方法/actual来源；仅结构factory不授权 | 按当前分支显式处理，不推断其他阶段成功或创建新权限 |
| `Lane { scope: QualifiedLaneOrderScope }` | 受权lane/dependency/shared下界。 | 所属具名typed方法/actual来源；仅结构factory不授权 | 按当前分支显式处理，不推断其他阶段成功或创建新权限 |
| `Eligible { kind: BridgeMaintenanceKind, scope: SafeScopeRef, as_of: SafeInstant }` | 固定qualified job scope/原as_of，不能Query触发maintenance。 | 所属具名typed方法/actual来源；仅结构factory不授权 | 按当前分支显式处理，不推断其他阶段成功或创建新权限 |

成员/工厂：按payload完整构造及穷尽match；无默认variant、自由文本、mutable getter、raw Error-source或自动serde。

### BridgeVersioned<T>

计划归属`crates/application/src/ports/local_snapshots.rs`；完整已存model、local CAS版本和hydration来源，不是公开DTO。

```rust
/// 完整已存model、local CAS版本和hydration来源，不是公开DTO。
pub struct BridgeVersioned<T> {
    /// 完整已存对象。
    value: T,
    /// 对象local CAS轴。
    revision: LocalRevision,
    /// 实际stored来源。
    hydration: LocalHydrationBasisRef,
}
```

| 字段 | 类型 | 必填 / 可选 | 来源与约束 |
|---|---|---|---|
| value | `T` | 必填 | typed repository实际行；不得只读ref/state或owner body |
| revision | `LocalRevision` | 必填 | 同实际行；与value.local_revision及hydration.revision一致 |
| hydration | `LocalHydrationBasisRef` | 必填 | qualified same driver/schema/subject；不以factory制造 |

| 类别 | 完整签名 | 中文Rustdoc / 不变量 |
|---|---|---|
| 工厂 | `pub fn from_parts(value: T, revision: LocalRevision, hydration: LocalHydrationBasisRef) -> Result<Self, ContractViolation>` | /// 完整接纳上述全部字段，仅校结构与一致性，不生成权限/实际proof；完整model的identity/revision与hydration同主语；immutable行只读，不因wrapper存在获得修改权 |
| 只读 | `pub fn value(&self) -> &T` | /// 只读取原字段，零IO/修改；不得推导执行或公开披露资格。 |
| 只读 | `pub fn revision(&self) -> &LocalRevision` | /// 只读取原字段，零IO/修改；不得推导执行或公开披露资格。 |
| 只读 | `pub fn hydration(&self) -> &LocalHydrationBasisRef` | /// 只读取原字段，零IO/修改；不得推导执行或公开披露资格。 |

不变量/禁止：完整model的identity/revision与hydration同主语；immutable行只读，不因wrapper存在获得修改权；字段private，无mutable getter或默认Debug/Clone/serde/Error-source。纯factory不是trusted来源，实际接缝仍验证当下来源。

### BridgeLocalReadContext

计划归属`crates/application/src/ports/local_snapshots.rs`；本次受权local读取的exact namespace、scope和来源。

```rust
/// 本次受权local读取的exact namespace、scope和来源。
pub struct BridgeLocalReadContext {
    /// 已去显示名的调用主体。
    actor: ActorRef,
    /// 安装隔离。
    namespace: InstallationNamespace,
    /// 正式读取scope。
    scope: SafeScopeRef,
    /// 可解引用的local读取依据。
    access: SafeAuthorityRef,
    /// 唯一读取用途。
    purpose: BridgeLocalReadPurpose,
    /// 依据有效窗口。
    validity: SafeValidityWindow,
    /// 本次行数上限。
    max_rows: u32,
}
```

| 字段 | 类型 | 必填 / 可选 | 来源与约束 |
|---|---|---|---|
| actor | `ActorRef` | 必填 | trusted actor/current owner read；display_name=None |
| namespace | `InstallationNamespace` | 必填 | 已核安装或命令显式安装；禁止default tenant |
| scope | `SafeScopeRef` | 必填 | binding/activation/current read owner解析，不切分ref |
| access | `SafeAuthorityRef` | 必填 | 对应current qualification/正式管理授权/受信source责任链；repo再次检查 |
| purpose | `BridgeLocalReadPurpose` | 必填 | 所属typed用例；Query不允许write/eligible/probe |
| validity | `SafeValidityWindow` | 必填 | 实际qualified来源；stale/expired拒绝 |
| max_rows | `u32` | 必填 | 获准预算与profile，非零且不大于call-control上限 |

| 类别 | 完整签名 | 中文Rustdoc / 不变量 |
|---|---|---|
| 工厂 | `pub fn from_parts(actor: ActorRef, namespace: InstallationNamespace, scope: SafeScopeRef, access: SafeAuthorityRef, purpose: BridgeLocalReadPurpose, validity: SafeValidityWindow, max_rows: u32) -> Result<Self, ContractViolation>` | /// 完整接纳上述全部字段，仅校结构与一致性，不生成权限/实际proof；当前actor/namespace/scope/window与每个requested key一致；shape合法不授权，Query不会构造事务 |
| 只读 | `pub fn actor(&self) -> &ActorRef` | /// 只读取原字段，零IO/修改；不得推导执行或公开披露资格。 |
| 只读 | `pub fn namespace(&self) -> &InstallationNamespace` | /// 只读取原字段，零IO/修改；不得推导执行或公开披露资格。 |
| 只读 | `pub fn scope(&self) -> &SafeScopeRef` | /// 只读取原字段，零IO/修改；不得推导执行或公开披露资格。 |
| 只读 | `pub fn access(&self) -> &SafeAuthorityRef` | /// 只读取原字段，零IO/修改；不得推导执行或公开披露资格。 |
| 只读 | `pub fn purpose(&self) -> &BridgeLocalReadPurpose` | /// 只读取原字段，零IO/修改；不得推导执行或公开披露资格。 |
| 只读 | `pub fn validity(&self) -> &SafeValidityWindow` | /// 只读取原字段，零IO/修改；不得推导执行或公开披露资格。 |
| 只读 | `pub fn max_rows(&self) -> &u32` | /// 只读取原字段，零IO/修改；不得推导执行或公开披露资格。 |

不变量/禁止：当前actor/namespace/scope/window与每个requested key一致；shape合法不授权，Query不会构造事务；字段private，无mutable getter或默认Debug/Clone/serde/Error-source。纯factory不是trusted来源，实际接缝仍验证当下来源。

### BridgeRepositoryCursor

计划归属`crates/application/src/ports/local_snapshots.rs`；仓内分页cursor，绑定完整筛选与driver来源，非平台cursor或public token。

```rust
/// 仓内分页cursor，绑定完整筛选与driver来源，非平台cursor或public token。
pub struct BridgeRepositoryCursor {
    /// driver分配的opaque页位置。
    token: SafeOpaqueId,
    /// 原去显示名的读取主体。
    actor: ActorRef,
    /// 原实际读取授权；继续页仍重新核当前有效性。
    access: SafeAuthorityRef,
    /// 安装隔离。
    namespace: InstallationNamespace,
    /// 原获准scope。
    scope: SafeScopeRef,
    /// 原exact筛选。
    filter: BridgeRepositoryFilter,
    /// 稳定local排序。
    order: BridgeRepositoryOrder,
    /// same driver/schema来源。
    source: SafeAuthoritySourceRef,
    /// cursor和授权共同窗口。
    validity: SafeValidityWindow,
}
```

| 字段 | 类型 | 必填 / 可选 | 来源与约束 |
|---|---|---|---|
| token | `SafeOpaqueId` | 必填 | 受核store；无SQL/DSN/raw主键拼接/credential |
| actor | `ActorRef` | 必填 | 原read context；identity/kind须一致，display_name=None |
| access | `SafeAuthorityRef` | 必填 | 原read context的正式资格，继续页不绕过当下重新核验 |
| namespace | `InstallationNamespace` | 必填 | 原read context |
| scope | `SafeScopeRef` | 必填 | 原read context |
| filter | `BridgeRepositoryFilter` | 必填 | 原list方法参数，继续页必须逐字段判等 |
| order | `BridgeRepositoryOrder` | 必填 | 原list合同；不得推平台事件时间序 |
| source | `SafeAuthoritySourceRef` | 必填 | actual store binding；不得跨驱动/产品替代 |
| validity | `SafeValidityWindow` | 必填 | source/read validity取共同有效范围；到期拒绝 |

| 类别 | 完整签名 | 中文Rustdoc / 不变量 |
|---|---|---|
| 工厂 | `pub fn from_store_parts(token: SafeOpaqueId, actor: ActorRef, access: SafeAuthorityRef, namespace: InstallationNamespace, scope: SafeScopeRef, filter: BridgeRepositoryFilter, order: BridgeRepositoryOrder, source: SafeAuthoritySourceRef, validity: SafeValidityWindow) -> Result<Self, ContractViolation>` | /// 完整接纳上述全部字段，仅校结构与一致性，不生成权限/实际proof；跨actor资格、namespace/scope/filter/order/source或失效cursor拒绝，不默默从头查；不持久化Query页快照或映射为平台offset |
| 只读 | `pub fn token(&self) -> &SafeOpaqueId` | /// 只读取原字段，零IO/修改；不得推导执行或公开披露资格。 |
| 只读 | `pub fn actor(&self) -> &ActorRef` | /// 只读取原主体，不返回显示名或自动授权。 |
| 只读 | `pub fn access(&self) -> &SafeAuthorityRef` | /// 只读取原依据，不能替代当前有效性核验。 |
| 只读 | `pub fn namespace(&self) -> &InstallationNamespace` | /// 只读取原字段，零IO/修改；不得推导执行或公开披露资格。 |
| 只读 | `pub fn scope(&self) -> &SafeScopeRef` | /// 只读取原字段，零IO/修改；不得推导执行或公开披露资格。 |
| 只读 | `pub fn filter(&self) -> &BridgeRepositoryFilter` | /// 只读取原字段，零IO/修改；不得推导执行或公开披露资格。 |
| 只读 | `pub fn order(&self) -> &BridgeRepositoryOrder` | /// 只读取原字段，零IO/修改；不得推导执行或公开披露资格。 |
| 只读 | `pub fn source(&self) -> &SafeAuthoritySourceRef` | /// 只读取原字段，零IO/修改；不得推导执行或公开披露资格。 |
| 只读 | `pub fn validity(&self) -> &SafeValidityWindow` | /// 只读取原字段，零IO/修改；不得推导执行或公开披露资格。 |

不变量/禁止：跨actor资格、namespace/scope/filter/order/source或失效cursor拒绝，不默默从头查；不持久化Query页快照或映射为平台offset；字段private，无mutable getter或默认Debug/Clone/serde/Error-source。纯factory不是trusted来源，实际接缝仍验证当下来源。

### BridgeRepositoryPageRequest

计划归属`crates/application/src/ports/local_snapshots.rs`；明确bounded内部page请求；None cursor仅首个local页。

```rust
/// 明确bounded内部page请求；None cursor仅首个local页。
pub struct BridgeRepositoryPageRequest {
    /// exact查询筛选。
    filter: BridgeRepositoryFilter,
    /// local排序合同。
    order: BridgeRepositoryOrder,
    /// 最大返回行数。
    limit: u32,
    /// 下一页位置。
    cursor: Option<BridgeRepositoryCursor>,
}
```

| 字段 | 类型 | 必填 / 可选 | 来源与约束 |
|---|---|---|---|
| filter | `BridgeRepositoryFilter` | 必填 | 方法具名keys与context；不从free-text/路由推 |
| order | `BridgeRepositoryOrder` | 必填 | 对应list方法只允许其声明排序 |
| limit | `u32` | 必填 | 调用方budget，非零且不大于context.max_rows/control.max_rows |
| cursor | `Option<BridgeRepositoryCursor>` | 可选，None含义见来源 | None=首local页；Some由前一同条件page原样传入，不是owner stream position |

| 类别 | 完整签名 | 中文Rustdoc / 不变量 |
|---|---|---|
| 工厂 | `pub fn from_parts(filter: BridgeRepositoryFilter, order: BridgeRepositoryOrder, limit: u32, cursor: Option<BridgeRepositoryCursor>) -> Result<Self, ContractViolation>` | /// 完整接纳上述全部字段，仅校结构与一致性，不生成权限/实际proof；limit/filter/order/namespace/scope与cursor及方法keys一致；QueryMetadata.page不直接伪装成此cursor |
| 只读 | `pub fn filter(&self) -> &BridgeRepositoryFilter` | /// 只读取原字段，零IO/修改；不得推导执行或公开披露资格。 |
| 只读 | `pub fn order(&self) -> &BridgeRepositoryOrder` | /// 只读取原字段，零IO/修改；不得推导执行或公开披露资格。 |
| 只读 | `pub fn limit(&self) -> &u32` | /// 只读取原字段，零IO/修改；不得推导执行或公开披露资格。 |
| 只读 | `pub fn cursor(&self) -> &Option<BridgeRepositoryCursor>` | /// 只读取原字段，零IO/修改；不得推导执行或公开披露资格。 |

不变量/禁止：limit/filter/order/namespace/scope与cursor及方法keys一致；QueryMetadata.page不直接伪装成此cursor；字段private，无mutable getter或默认Debug/Clone/serde/Error-source。纯factory不是trusted来源，实际接缝仍验证当下来源。

### BridgeRepositoryPage<T>

计划归属`crates/application/src/ports/local_snapshots.rs`；bounded committed local page与完整read basis，不生成跨平台coverage。

```rust
/// bounded committed local page与完整read basis，不生成跨平台coverage。
pub struct BridgeRepositoryPage<T> {
    /// 完整typed结果项。
    items: Vec<T>,
    /// 同筛选后续页。
    next: Option<BridgeRepositoryCursor>,
    /// 本页完整stored/expected来源。
    read_basis: LocalSnapshotReadBasis,
}
```

| 字段 | 类型 | 必填 / 可选 | 来源与约束 |
|---|---|---|---|
| items | `Vec<T>` | 必填 | 同driver一致读，长度不超过request.limit；可正式空页 |
| next | `Option<BridgeRepositoryCursor>` | 可选，None含义见来源 | None=本次local页范围结束，不表示owner/platform无消息或effect |
| read_basis | `LocalSnapshotReadBasis` | 必填 | 覆盖所有mutable rows及实际读取scope/上限；不可伪造committed basis |

| 类别 | 完整签名 | 中文Rustdoc / 不变量 |
|---|---|---|
| 工厂 | `pub fn from_store_parts(items: Vec<T>, next: Option<BridgeRepositoryCursor>, read_basis: LocalSnapshotReadBasis) -> Result<Self, ContractViolation>` | /// 完整接纳上述全部字段，仅校结构与一致性，不生成权限/实际proof；items与read_basis对应，只有已提交local rows；不返回staged候选，empty不证明no-effect，next不直接出wire |
| 只读 | `pub fn items(&self) -> &[T]` | /// 只读取原字段，零IO/修改；不得推导执行或公开披露资格。 |
| 只读 | `pub fn next(&self) -> &Option<BridgeRepositoryCursor>` | /// 只读取原字段，零IO/修改；不得推导执行或公开披露资格。 |
| 只读 | `pub fn read_basis(&self) -> &LocalSnapshotReadBasis` | /// 只读取原字段，零IO/修改；不得推导执行或公开披露资格。 |
| 消费 | `pub fn into_parts(self) -> (Vec<T>, Option<BridgeRepositoryCursor>, LocalSnapshotReadBasis)` | /// 仓内一次性移交完整items/cursor/basis；不Clone或公开token，不改变顺序、筛选或资格。 |

不变量/禁止：items与read_basis对应，只有已提交local rows；不返回staged候选，empty不证明no-effect，next不直接出wire；`into_parts`只供仓内runner在同qualified session消费，不持久化/外显cursor；字段private，无mutable getter或默认Debug/Clone/serde/Error-source。纯factory不是trusted来源，实际接缝仍验证当下来源。

公共分页裁定：BridgeRepositoryPage/Request/Cursor/Filter仅仓内。core QueryMetadata.page仍唯一输入authority，但raw PageToken不能直接当内部cursor；当前四Q的BridgeLocalView没有公开Page字段。Step8若在既有协议内承接分页，须明确输入token资格/拒绝和投影，不新增公开数据库页helper、总count或Query页快照。当前无未定义public Page surface。

## 5. 本地事务与call-control

### BridgeLocalTransaction

计划归属`crates/application/src/ports/local_uow.rs`；由同driver登记的唯一local mutation transaction handle，非提交证明。

```rust
/// 由同driver登记的唯一local mutation transaction handle，非提交证明。
pub struct BridgeLocalTransaction {
    /// 本次技术handle identity。
    transaction_id: LocalObjectId,
    /// 原local mutation。
    mutation: LocalMutationRef,
    /// 原op/effect。
    original: OriginalOperationEffectRef,
    /// 完整local CAS集。
    expected: ExpectedLocalRevisionSet,
    /// 实际store/source。
    store_source: SafeAuthoritySourceRef,
    /// storage schema兼容轴。
    schema_revision: SafeRevision,
    /// 受限事务窗口。
    deadline: SafeInstant,
}
```

| 字段 | 类型 | 必填 / 可选 | 来源与约束 |
|---|---|---|---|
| transaction_id | `LocalObjectId` | 必填 | LocalUnitOfWorkPort.begin内部受核技术provider |
| mutation | `LocalMutationRef` | 必填 | QualifiedLocalMutationPlan，永不因timeout换ID |
| original | `OriginalOperationEffectRef` | 必填 | 已核plan/continuity；所有writes/result/audit一致 |
| expected | `ExpectedLocalRevisionSet` | 必填 | plan及actual baseline reads；Absent/Present各主语精确 |
| store_source | `SafeAuthoritySourceRef` | 必填 | same driver/schema注册；不能跨adapter借handle |
| schema_revision | `SafeRevision` | 必填 | qualified driver，不用config/cursor版本 |
| deadline | `SafeInstant` | 必填 | call-control/provider资格共同窗口 |

| 类别 | 完整签名 | 中文Rustdoc / 不变量 |
|---|---|---|
| 工厂 | `pub fn from_driver_parts(transaction_id: LocalObjectId, mutation: LocalMutationRef, original: OriginalOperationEffectRef, expected: ExpectedLocalRevisionSet, store_source: SafeAuthoritySourceRef, schema_revision: SafeRevision, deadline: SafeInstant) -> Result<Self, ContractViolation>` | /// 完整接纳上述全部字段，仅校结构与一致性，不生成权限/实际proof；driver登记才可stage；不是Clone/static/外部transaction；commit/rollback消费handle，drop/cancel不证明rollback；网络不进此事务 |
| 只读 | `pub fn transaction_id(&self) -> &LocalObjectId` | /// 只读取原字段，零IO/修改；不得推导执行或公开披露资格。 |
| 只读 | `pub fn mutation(&self) -> &LocalMutationRef` | /// 只读取原字段，零IO/修改；不得推导执行或公开披露资格。 |
| 只读 | `pub fn original(&self) -> &OriginalOperationEffectRef` | /// 只读取原字段，零IO/修改；不得推导执行或公开披露资格。 |
| 只读 | `pub fn expected(&self) -> &ExpectedLocalRevisionSet` | /// 只读取原字段，零IO/修改；不得推导执行或公开披露资格。 |
| 只读 | `pub fn store_source(&self) -> &SafeAuthoritySourceRef` | /// 只读取原字段，零IO/修改；不得推导执行或公开披露资格。 |
| 只读 | `pub fn schema_revision(&self) -> &SafeRevision` | /// 只读取原字段，零IO/修改；不得推导执行或公开披露资格。 |
| 只读 | `pub fn deadline(&self) -> &SafeInstant` | /// 只读取原字段，零IO/修改；不得推导执行或公开披露资格。 |

不变量/禁止：driver登记才可stage；不是Clone/static/外部transaction；commit/rollback消费handle，drop/cancel不证明rollback；网络不进此事务；字段private，无mutable getter或默认Debug/Clone/serde/Error-source。纯factory不是trusted来源，实际接缝仍验证当下来源。

### BridgeStagedWriteRef

计划归属`crates/application/src/ports/local_uow.rs`；本地已stage候选的有限确认，绝不等同actual commit。

```rust
/// 本地已stage候选的有限确认，绝不等同actual commit。
pub struct BridgeStagedWriteRef {
    /// 同事务handle。
    transaction_id: LocalObjectId,
    /// exact local subject。
    subject: BridgeViewSubjectRef,
    /// 原insert/CAS条件。
    expected: LocalRevisionCondition,
    /// 候选后继local revision。
    candidate_revision: LocalRevision,
}
```

| 字段 | 类型 | 必填 / 可选 | 来源与约束 |
|---|---|---|---|
| transaction_id | `LocalObjectId` | 必填 | actual local stage registration |
| subject | `BridgeViewSubjectRef` | 必填 | typed save/append对象，不拼字符串 |
| expected | `LocalRevisionCondition` | 必填 | tx.expected同subject；Absent插入，Present原read revision |
| candidate_revision | `LocalRevision` | 必填 | 新行1，更新原LocalRevision checked successor；尚未公开 |

| 类别 | 完整签名 | 中文Rustdoc / 不变量 |
|---|---|---|
| 工厂 | `pub fn from_driver_stage(transaction_id: LocalObjectId, subject: BridgeViewSubjectRef, expected: LocalRevisionCondition, candidate_revision: LocalRevision) -> Result<Self, ContractViolation>` | /// 完整接纳上述全部字段，仅校结构与一致性，不生成权限/实际proof；不返回CommittedLocalMutationRef/hydration/owner result；stage失败零部分覆盖，actual write set与plan/expected逐项一致 |
| 只读 | `pub fn transaction_id(&self) -> &LocalObjectId` | /// 只读取原字段，零IO/修改；不得推导执行或公开披露资格。 |
| 只读 | `pub fn subject(&self) -> &BridgeViewSubjectRef` | /// 只读取原字段，零IO/修改；不得推导执行或公开披露资格。 |
| 只读 | `pub fn expected(&self) -> &LocalRevisionCondition` | /// 只读取原字段，零IO/修改；不得推导执行或公开披露资格。 |
| 只读 | `pub fn candidate_revision(&self) -> &LocalRevision` | /// 只读取原字段，零IO/修改；不得推导执行或公开披露资格。 |

不变量/禁止：不返回CommittedLocalMutationRef/hydration/owner result；stage失败零部分覆盖，actual write set与plan/expected逐项一致；字段private，无mutable getter或默认Debug/Clone/serde/Error-source。纯factory不是trusted来源，实际接缝仍验证当下来源。

### BridgeCallControl<'call>

计划归属`crates/application/src/ports/mod.rs`；仅本次scoped call的deadline、取消和调用/行预算，不提供authority。

```rust
/// 仅本次scoped call的deadline、取消和调用/行预算，不提供authority。
pub struct BridgeCallControl<'call> {
    /// 本次调用截止。
    deadline: SafeInstant,
    /// scoped host取消旗标。
    cancelled: &'call std::cell::Cell<bool>,
    /// 剩余调用预算。
    remaining_calls: std::cell::Cell<u32>,
    /// 本次读取行数上限。
    max_rows: u32,
}
```

| 字段 | 类型 | 必填 / 可选 | 来源与约束 |
|---|---|---|---|
| deadline | `SafeInstant` | 必填 | qualified root及对应平台/owner窗口共同有效范围 |
| cancelled | `&'call std::cell::Cell<bool>` | 必填 | host owns cell至call结束；不暴露其getter/可写别名 |
| remaining_calls | `std::cell::Cell<u32>` | 必填 | qualified预算初值；try_start只递减，禁止外部重置 |
| max_rows | `u32` | 必填 | qualified budget；非零，无runtime/Infra类型反向依赖 |

| 类别 | 完整签名 | 中文Rustdoc / 不变量 |
|---|---|---|
| 工厂 | `pub fn from_parts(deadline: SafeInstant, cancelled: &'call std::cell::Cell<bool>, remaining_calls: std::cell::Cell<u32>, max_rows: u32) -> Result<Self, ContractViolation>` | /// 完整接纳上述全部字段，仅校结构与一致性，不生成权限/实际proof；local-only/非Send Future，无detached任务；cancel只终止本地等待，不能证owner/platform/local mutation无效果 |
| 只读 | `pub fn deadline(&self) -> &SafeInstant` | /// 只读取原字段，零IO/修改；不得推导执行或公开披露资格。 |
| 只读 | `pub fn max_rows(&self) -> &u32` | /// 只读取原字段，零IO/修改；不得推导执行或公开披露资格。 |
| 成员 | `pub fn try_start(&self, now: SafeInstant) -> Result<(), BridgePortError>` | /// 核deadline/取消和剩余调用数，合格时只递减本地预算；失败不产生IO/no-effect proof。 |
| 成员 | `pub fn is_cancelled(&self) -> bool` | /// 只返回当前取消状态，不能修改host cell。 |
| 成员 | `pub fn remaining_calls(&self) -> u32` | /// 只读取剩余数，不返回Cell或可写引用。 |

不变量/禁止：local-only/非Send Future，无detached任务；cancel只终止本地等待，不能证owner/platform/local mutation无效果；字段private，无mutable getter或默认Debug/Clone/serde/Error-source。纯factory不是trusted来源，实际接缝仍验证当下来源。

### BridgeLocalReadSession<'read>

计划归属`crates/application/src/ports/local_uow.rs`；已提交读或同事务一致基线读；都不公开未提交stage。

```rust
/// 已提交读或同事务一致基线读；都不公开未提交stage。
pub enum BridgeLocalReadSession<'read> {
    /// 纯已提交local只读，无begin/写审计/页快照。
    Committed {
        /// context的typed载荷，来源按本变体约束，不接受raw材料。
        context: &'read BridgeLocalReadContext,
    },
    /// 同driver实际登记事务的一致baseline；候选由Application持有，不返回staged作hydration。
    Transaction {
        /// context的typed载荷，来源按本变体约束，不接受raw材料。
        context: &'read BridgeLocalReadContext,
        /// transaction的typed载荷，来源按本变体约束，不接受raw材料。
        transaction: &'read BridgeLocalTransaction,
    },
}
```

| 变体 | Rustdoc / 载荷 | 允许来源 | 允许去向 |
|---|---|---|---|
| `Committed { context: &'read BridgeLocalReadContext }` | 纯已提交local只读，无begin/写审计/页快照。 | 所属具名typed方法/actual来源；仅结构factory不授权 | 按当前分支显式处理，不推断其他阶段成功或创建新权限 |
| `Transaction { context: &'read BridgeLocalReadContext, transaction: &'read BridgeLocalTransaction }` | 同driver实际登记事务的一致baseline；候选由Application持有，不返回staged作hydration。 | 所属具名typed方法/actual来源；仅结构factory不授权 | 按当前分支显式处理，不推断其他阶段成功或创建新权限 |

成员/工厂：按payload完整构造及穷尽match；无默认variant、自由文本、mutable getter、raw Error-source或自动serde。

tx baseline reads不会制造staged hydration；已有pure候选沿Application持有，所有stage result只BridgeStagedWriteRef。commit/rollback合同在既有LocalUnitOfWorkPort逐名定义；本附录不会自生成actual证明。事务handle不得串行复用到不同driver/namespace/op，drop后adapter必须保原mutation结果未知直至权威查询，不能默认为rollback。

## 6. 草稿、复杂度与组内自检

泛型factory只能验证自身可见字段与集合边界，不能在无bound的T上访问model成员；各具名typed repository adapter负责value identity/revision与hydration的一致性，page负责每项与read_basis的实际对应。此为provider后置条件，不新增第24业务port或generic model trait。分页各页只保证本页一致已提交读；非事务跨页不承诺同一历史快照，维护候选最终按原revision/current条件复核，不生成Query页快照。

未来正式§5 Application port小节引用本附录的Future、完整row/page/transaction/current控制与有限失败schema；不把本页过程、自检或数字放正文。

复杂度：统一typed支持消除23port重复Page/Version/任意错误；bounded limit/filter/source/token完整而非泛化db gateway。没有新增业务truth/请求/状态机。A0逐字段人工复核：所有new carrier有完整schema/来源/optional含义/getter或受限访问，既有Slot/version/meanings保持原定义；Query无transaction/write，private/Infra类型不进入这些safe carriers。后续X实际运行完整类型/字段/路径/重复审计，当前不冒称已编译或测试。

A0设计自检pass；下一只A1 binding/config/mapping。BR-UP与产品not_selected/not_established保持，formal_backfill_allowed=false、commit_required=false。
