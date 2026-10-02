# Step6 U5 撤回/影响/通知对象小循环

## 思考、诊断与取舍

capability：撤回/影响/通知，只承接本地truth/引用/guard/readsurface。前序HLD给轮廓，本批先检查功能与所有字段、factory、methods来源。采用分离实体/immutable组合/策略/视图，拒绝把qualified输入暴露给客户端或复制owner正文。所有ref不足以自证authority；当前owner/SDK positive仍blocked。

## capability与对象映射

| 对象 | 能力 / 功能 | 类别 / 归属 | 字段与函数 / 状态来源 | 后续承接 |
|---|---|---|---|---|
| WithdrawalDisposition | immutable仅typed读取/校验；rehydrate后移03；有据追加，本地处置与U3版本同事务 | domain / immutable/value | disposition_ref,version_ref,authority_ref,action,reason_ref,source_cursor；无独立lifecycle | Step7 typed ports；8请求/结果；9独立flow；10矩阵 |
| ImpactRecord | 按relation/attempt去重增量，保留coverage gap；初始Partial | domain / statecarrier | impact_ref,disposition_ref,relation_refs,unknown_attempt_refs,coverage_cursor,coverage_kind；Partial/KnownScopeComplete | Step7 typed ports；8请求/结果；9独立flow；10矩阵 |
| NoticeIntent | 原意图已持久，当前channel/授权合格；matching正式通道结果，不自造送达；保存缺口不复活版本；初始Prepared，deferred work同事务 | domain / statecarrier |notice_ref,impact_ref,target_ref,channel_ref,scope_ref,failure_ref,dispatch_fence,outcome_binding,state,revision；Prepared/Dispatching/Confirmed/Failed/CommitUnknown/Blocked | Step7 typed ports；8请求/结果；9独立flow；10矩阵 |
| NoticeOutcomeBinding | 同意图/target/channel/scope才采纳；不推read/remediated | contracts / immutable/value | outcome_ref,notice_ref,target_ref,channel_ref,scope_ref；无独立lifecycle | Step7 typed ports；8请求/结果；9独立flow；10矩阵 |
| WithdrawalImpactPolicy | 限制/撤回的本地允许性；known/unknown/late候选，不扫描外部全安装集合；stateless策略/typed view assembler调用，不新增truth | domain / guard | requirements；无独立lifecycle | Step7 typed ports；8请求/结果；9独立flow；10矩阵 |
| ImpactNoticeView | immutable仅typed读取/校验；rehydrate后移03；不由notice confirmed推撤回全覆盖 | contracts / readview | disposition_ref,impact_ref,notice_refs,read_context；无独立lifecycle | Step7 typed ports；8请求/结果；9独立flow；10矩阵 |

对象能力到字段/函数：上表每一行字段闭包承接该对象能力；下方每字段明确来源，完整签名承接对应状态，不以overview替代。初值只factory提供，其余owner/current字段由正式port与typed读取。修正Draft可无review、Blocked可无source摘要；公开视图采用SafeReadContext，不依赖domain。

### WithdrawalDisposition

```rust
/// Carries WithdrawalDisposition with explicit sources and no upstream body.
pub struct WithdrawalDisposition {
    /// Carries disposition_ref; see the source and invariant table.
    pub disposition_ref: WithdrawalDispositionRef,
    /// Carries version_ref; see the source and invariant table.
    pub version_ref: MarketVersionRef,
    /// Carries authority_ref; see the source and invariant table.
    pub authority_ref: DispositionAuthorityRef,
    /// Carries action; see the source and invariant table.
    pub action: MarketDispositionKind,
    /// Carries reason_ref; see the source and invariant table.
    pub reason_ref: SafeReasonRef,
    /// Carries source_cursor; see the source and invariant table.
    pub source_cursor: MarketSourceCursor,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| disposition_ref | `WithdrawalDispositionRef` | 本地ID |
| version_ref | `MarketVersionRef` | exact处置对象 |
| authority_ref | `DispositionAuthorityRef` | 正式处置依据/来源资格失效依据 |
| action | `MarketDispositionKind` | 仅Restrict/Withdraw本地有限意图 |
| reason_ref | `SafeReasonRef` | 安全原因，不原正文 |
| source_cursor | `MarketSourceCursor` | 同UoW提交序列用于影响增量 |

归属：domain；该对象只承接所属U能力；domain纯同步，无ownerbody/外部approval；字段必填完整才factory，optional以生命周期约束。

#### 成员函数

| 完整签名 | 作用 | 参数来源 | 返回 / 副作用 |
|---|---|---|---|
| 无业务变更成员 | immutable/view不修改truth | 不适用 | 只校验/typed读 |
| `pub fn validate(&self) -> Result<(), DomainError>` | 完整字段/state不变量 | 当前本体 | 不做I/O；缺必填/binding/state错配拒绝 |

#### 工厂 / rehydrate

| 完整签名 | 必填字段来源 / 初始化 | 不变量 |
|---|---|---|
| `pub fn record(input: QualifiedDispositionInput) -> Result<Self, DomainError>` | QualifiedDispositionInput的独立字段schema见shared_types；完整copy typed输入；immutable固定不替换 | 有据追加，本地处置与U3版本同事务；qualified字段只内侧构造，factory不是approval |
| `pub fn rehydrate(row: WithdrawalDispositionRow) -> Result<Self, DomainError>` | Row与本对象逐字段同构；state/optional/revision全校验；repo读取来源 | 禁止SQL/rawbody进入domain，既有ref不能重factory以复活状态 |

#### 不变量与禁止

binding只exacttyped比较，缺合同不fallback，state/status语义不外推。version/source_material/fixedbasis不可修改，revision镜像repo单一column；views只currentdisclosure之后构造，NotVisible/Missing/Degraded使用ReadSurface而非假填必需ref。unknown只能formal原intentprobe，终态不可任意复活。方法不得返回body/approval/payment/evidence/readiness。


### ImpactRecord

```rust
/// Carries ImpactRecord with explicit sources and no upstream body.
pub struct ImpactRecord {
    /// Carries impact_ref; see the source and invariant table.
    pub impact_ref: ImpactRecordRef,
    /// Carries disposition_ref; see the source and invariant table.
    pub disposition_ref: WithdrawalDispositionRef,
    /// Carries relation_refs; see the source and invariant table.
    pub relation_refs: DistributionRelationRefSet,
    /// Carries unknown_attempt_refs; see the source and invariant table.
    pub unknown_attempt_refs: DistributionAttemptRefSet,
    /// Carries coverage_cursor; see the source and invariant table.
    pub coverage_cursor: MarketSourceCursor,
    /// Carries coverage_kind; see the source and invariant table.
    pub coverage_kind: ImpactCoverageKind,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| impact_ref | `ImpactRecordRef` | 本地ID |
| disposition_ref | `WithdrawalDispositionRef` | 原处置关联 |
| relation_refs | `DistributionRelationRefSet` | 本地已知exact版本关系 |
| unknown_attempt_refs | `DistributionAttemptRefSet` | 保守未知交接集合 |
| coverage_cursor | `MarketSourceCursor` | 稳定枚举及late增量来源 |
| coverage_kind | `ImpactCoverageKind` | Partial/KnownScopeComplete不代表全安装 |

归属：domain；该对象只承接所属U能力；domain纯同步，无ownerbody/外部approval；字段必填完整才factory，optional以生命周期约束。

#### 成员函数

| 完整签名 | 作用 | 参数来源 | 返回 / 副作用 |
|---|---|---|---|
| `pub fn include(&mut self, delta: ImpactDeltaInput) -> Result<(), DomainError>` | 按relation/attempt去重增量，保留coverage gap | ImpactDeltaInput delta：typed原对象/正式port qualified输入，不调用I/O | Result<(), DomainError>；只按Step10合法pair改变本对象；持久化/审计/必要work由application同UoW |
| `pub fn validate(&self) -> Result<(), DomainError>` | 完整字段/state不变量 | 当前本体 | 不做I/O；缺必填/binding/state错配拒绝 |

#### 工厂 / rehydrate

| 完整签名 | 必填字段来源 / 初始化 | 不变量 |
|---|---|---|
| `pub fn start(input: ImpactEnumerationInput) -> Result<Self, DomainError>` | ImpactEnumerationInput的独立字段schema见shared_types；Partial；relation/unknownrefs=[] | 初始Partial；qualified字段只内侧构造，factory不是approval |
| `pub fn rehydrate(row: ImpactRecordRow) -> Result<Self, DomainError>` | Row与本对象逐字段同构；state/optional/revision全校验；repo读取来源 | 禁止SQL/rawbody进入domain，既有ref不能重factory以复活状态 |

#### 不变量与禁止

初始：Partial；relation/unknownrefs=[]。binding只exacttyped比较，缺合同不fallback，state/status语义不外推。version/source_material/fixedbasis不可修改，revision镜像repo单一column；views只currentdisclosure之后构造，NotVisible/Missing/Degraded使用ReadSurface而非假填必需ref。unknown只能formal原intentprobe，终态不可任意复活。方法不得返回body/approval/payment/evidence/readiness。


### NoticeIntent

```rust
/// Carries NoticeIntent with explicit sources and no upstream body.
pub struct NoticeIntent {
    /// Carries notice_ref; see the source and invariant table.
    pub notice_ref: NoticeIntentRef,
    /// Carries impact_ref; see the source and invariant table.
    pub impact_ref: ImpactRecordRef,
    /// Carries target_ref; see the source and invariant table.
    pub target_ref: NoticeTargetRef,
    /// Carries channel_ref; see the source and invariant table.
    pub channel_ref: NoticeChannelRef,
    /// Carries scope_ref; see the source and invariant table.
    pub scope_ref: MarketScopeRef,
    /// Carries failure_ref; see the source and invariant table.
    pub failure_ref: OptionalSafeFailureRef,
    /// Carries dispatch_fence; see the source and invariant table.
    pub dispatch_fence: OptionalDispatchFence,
    /// Carries outcome_binding; see the source and invariant table.
    pub outcome_binding: OptionalNoticeOutcomeBinding,
    /// Carries state; see the source and invariant table.
    pub state: NoticeIntentState,
    /// Carries revision; see the source and invariant table.
    pub revision: MarketRevision,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| notice_ref | `NoticeIntentRef` | 本地ID |
| impact_ref | `ImpactRecordRef` | 影响对象 |
| target_ref | `NoticeTargetRef` | 正式可通知目标，非全安装用户 |
| channel_ref | `NoticeChannelRef` | 正式通道，缺合同不派发 |
| scope_ref | `MarketScopeRef` | QualifiedNoticePlanInput正式scope，与target/channel/impact当前authority一致；不可从字符串猜 |
| failure_ref | `OptionalSafeFailureRef` | Blocked/Failed/Unknown的安全来源 |
| dispatch_fence | `OptionalDispatchFence` | Dispatching必有原intent当前许可；旧fence结果不得覆盖 |
| outcome_binding | `OptionalNoticeOutcomeBinding` | 正式结果可选，ACK不是delivered |
| state | `NoticeIntentState` | Prepared/Dispatching/Confirmed/Failed/CommitUnknown/Blocked |
| revision | `MarketRevision` | claim及结果旧fence保护 |

归属：domain；该对象只承接所属U能力；domain纯同步，无ownerbody/外部approval；字段必填完整才factory，optional以生命周期约束。

#### 成员函数

| 完整签名 | 作用 | 参数来源 | 返回 / 副作用 |
|---|---|---|---|
| `pub fn begin(&mut self, input: NoticeDispatchInput) -> Result<(), DomainError>` | 原意图已持久，当前channel/授权合格 | NoticeDispatchInput input：typed原对象/正式port qualified输入，不调用I/O | Result<(), DomainError>；只按Step10合法pair改变本对象；持久化/审计/必要work由application同UoW |
| `pub fn settle(&mut self, input: NoticeOutcomeInput) -> Result<(), DomainError>` | matching正式通道结果，不自造送达 | NoticeOutcomeInput input：typed原对象/正式port qualified输入，不调用I/O | Result<(), DomainError>；只按Step10合法pair改变本对象；持久化/审计/必要work由application同UoW |
| `pub fn block(&mut self, gap: ContractGapInput) -> Result<(), DomainError>` | 保存缺口不复活版本 | ContractGapInput gap：typed原对象/正式port qualified输入，不调用I/O | Result<(), DomainError>；只按Step10合法pair改变本对象；持久化/审计/必要work由application同UoW |
| `pub fn validate(&self) -> Result<(), DomainError>` | 完整字段/state不变量 | 当前本体 | 不做I/O；缺必填/binding/state错配拒绝 |

#### 工厂 / rehydrate

| 完整签名 | 必填字段来源 / 初始化 | 不变量 |
|---|---|---|
| `pub fn prepare(input: QualifiedNoticePlanInput) -> Result<Self, DomainError>` | QualifiedNoticePlanInput的独立字段schema见shared_types；Prepared；failure/fence/outcome=None；revision=0 | 初始Prepared，deferred work同事务；qualified字段只内侧构造，factory不是approval |
| `pub fn rehydrate(row: NoticeIntentRow) -> Result<Self, DomainError>` | Row与本对象逐字段同构；state/optional/revision全校验；repo读取来源 | 禁止SQL/rawbody进入domain，既有ref不能重factory以复活状态 |

#### 不变量与禁止

初始：Prepared；failure/fence/outcome=None；revision=0。binding只exacttyped比较，缺合同不fallback，state/status语义不外推。version/source_material/fixedbasis不可修改，revision镜像repo单一column；views只currentdisclosure之后构造，NotVisible/Missing/Degraded使用ReadSurface而非假填必需ref。unknown只能formal原intentprobe，终态不可任意复活。方法不得返回body/approval/payment/evidence/readiness。


### NoticeOutcomeBinding

```rust
/// Carries NoticeOutcomeBinding with explicit sources and no upstream body.
pub struct NoticeOutcomeBinding {
    /// Carries outcome_ref; see the source and invariant table.
    pub outcome_ref: NoticeOutcomeRef,
    /// Carries notice_ref; see the source and invariant table.
    pub notice_ref: NoticeIntentRef,
    /// Carries target_ref; see the source and invariant table.
    pub target_ref: NoticeTargetRef,
    /// Carries channel_ref; see the source and invariant table.
    pub channel_ref: NoticeChannelRef,
    /// Carries scope_ref; see the source and invariant table.
    pub scope_ref: MarketScopeRef,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| outcome_ref | `NoticeOutcomeRef` | channel正式结果 |
| notice_ref | `NoticeIntentRef` | 原意图关联 |
| target_ref | `NoticeTargetRef` | 指定通知目标 |
| channel_ref | `NoticeChannelRef` | 结果来源 |
| scope_ref | `MarketScopeRef` | 安全披露范围 |

归属：contracts；该对象只承接所属U能力；domain纯同步，无ownerbody/外部approval；字段必填完整才factory，optional以生命周期约束。

#### 成员函数

| 完整签名 | 作用 | 参数来源 | 返回 / 副作用 |
|---|---|---|---|
| `pub fn matches(&self, context: NoticeOutcomeContext) -> bool` | 同意图/target/channel/scope才采纳 | NoticeOutcomeContext context：typed原对象/正式port qualified输入，不调用I/O | bool；纯读取，不改变状态 |
| `pub fn validate(&self) -> Result<(), DomainError>` | 完整字段/state不变量 | 当前本体 | 不做I/O；缺必填/binding/state错配拒绝 |

#### 工厂 / rehydrate

| 完整签名 | 必填字段来源 / 初始化 | 不变量 |
|---|---|---|
| `pub fn from_channel(input: QualifiedNoticeOutcome) -> Result<Self, DomainError>` | QualifiedNoticeOutcome的独立字段schema见shared_types；完整copy typed输入；immutable固定不替换 | 不推read/remediated；qualified字段只内侧构造，factory不是approval |
| `pub fn rehydrate(row: NoticeOutcomeBindingRow) -> Result<Self, DomainError>` | Row与本对象逐字段同构；state/optional/revision全校验；repo读取来源 | 禁止SQL/rawbody进入domain，既有ref不能重factory以复活状态 |

#### 不变量与禁止

binding只exacttyped比较，缺合同不fallback，state/status语义不外推。version/source_material/fixedbasis不可修改，revision镜像repo单一column；views只currentdisclosure之后构造，NotVisible/Missing/Degraded使用ReadSurface而非假填必需ref。unknown只能formal原intentprobe，终态不可任意复活。方法不得返回body/approval/payment/evidence/readiness。


### WithdrawalImpactPolicy

```rust
/// Carries WithdrawalImpactPolicy with explicit sources and no upstream body.
pub struct WithdrawalImpactPolicy {
    /// Carries requirements; see the source and invariant table.
    pub requirements: DispositionRequirements,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| requirements | `DispositionRequirements` | 正式authority与已知范围约束 |

归属：domain；该对象只承接所属U能力；domain纯同步，无ownerbody/外部approval；字段必填完整才factory，optional以生命周期约束。

#### 成员函数

| 完整签名 | 作用 | 参数来源 | 返回 / 副作用 |
|---|---|---|---|
| `pub fn evaluate(&self, version: MarketVersion, basis: QualifiedDispositionInput) -> Result<LocalGateResult, DomainError>` | 限制/撤回的本地允许性 | MarketVersion version；QualifiedDispositionInput basis：typed原对象/正式port qualified输入，不调用I/O | Result<LocalGateResult, DomainError>；纯读取，不改变状态 |
| `pub fn classify(&self, input: DistributionImpactInput) -> Result<ImpactDeltaInput, DomainError>` | known/unknown/late候选，不扫描外部全安装集合 | DistributionImpactInput input：typed原对象/正式port qualified输入，不调用I/O | Result<ImpactDeltaInput, DomainError>；纯读取，不改变状态 |
| `pub fn validate(&self) -> Result<(), DomainError>` | 完整字段/state不变量 | 当前本体 | 不做I/O；缺必填/binding/state错配拒绝 |

#### 工厂 / rehydrate

| 完整签名 | 必填字段来源 / 初始化 | 不变量 |
|---|---|---|
| `pub fn new(requirements: DispositionRequirements) -> Result<Self, DomainError>` | formal适用规则输入，禁config豁免 | stateless guard，不新增truth |
| `pub fn rehydrate(row: WithdrawalImpactPolicyRow) -> Result<Self, DomainError>` | Row与本对象逐字段同构；state/optional/revision全校验；repo读取来源 | 禁止SQL/rawbody进入domain，既有ref不能重factory以复活状态 |

#### 不变量与禁止

binding只exacttyped比较，缺合同不fallback，state/status语义不外推。version/source_material/fixedbasis不可修改，revision镜像repo单一column；views只currentdisclosure之后构造，NotVisible/Missing/Degraded使用ReadSurface而非假填必需ref。unknown只能formal原intentprobe，终态不可任意复活。方法不得返回body/approval/payment/evidence/readiness。


### ImpactNoticeView

```rust
/// Carries ImpactNoticeView with explicit sources and no upstream body.
pub struct ImpactNoticeView {
    /// Carries disposition_ref; see the source and invariant table.
    pub disposition_ref: WithdrawalDispositionRef,
    /// Carries impact_ref; see the source and invariant table.
    pub impact_ref: ImpactRecordRef,
    /// Carries notice_refs; see the source and invariant table.
    pub notice_refs: NoticeIntentRefSet,
    /// Carries read_context; see the source and invariant table.
    pub read_context: SafeReadContext,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| disposition_ref | `WithdrawalDispositionRef` | 已提交处置 |
| impact_ref | `ImpactRecordRef` | 已知集合/coverage |
| notice_refs | `NoticeIntentRefSet` | safe attempts/results |
| read_context | `SafeReadContext` | 同scope裁剪数量/细节 |

归属：contracts；该对象只承接所属U能力；domain纯同步，无ownerbody/外部approval；字段必填完整才factory，optional以生命周期约束。

#### 成员函数

| 完整签名 | 作用 | 参数来源 | 返回 / 副作用 |
|---|---|---|---|
| 无业务变更成员 | immutable/view不修改truth | 不适用 | 只校验/typed读 |
| `pub fn validate(&self) -> Result<(), DomainError>` | 完整字段/state不变量 | 当前本体 | 不做I/O；缺必填/binding/state错配拒绝 |

#### 工厂 / rehydrate

| 完整签名 | 必填字段来源 / 初始化 | 不变量 |
|---|---|---|
| `pub fn assemble(input: ImpactNoticeReadInput) -> Result<Self, DomainError>` | ImpactNoticeReadInput的独立字段schema见shared_types；完整copy typed输入；immutable固定不替换 | 不由notice confirmed推撤回全覆盖；qualified字段只内侧构造，factory不是approval |
| `pub fn rehydrate(row: ImpactNoticeViewRow) -> Result<Self, DomainError>` | Row与本对象逐字段同构；state/optional/revision全校验；repo读取来源 | 禁止SQL/rawbody进入domain，既有ref不能重factory以复活状态 |

#### 不变量与禁止

binding只exacttyped比较，缺合同不fallback，state/status语义不外推。version/source_material/fixedbasis不可修改，revision镜像repo单一column；views只currentdisclosure之后构造，NotVisible/Missing/Degraded使用ReadSurface而非假填必需ref。unknown只能formal原intentprobe，终态不可任意复活。方法不得返回body/approval/payment/evidence/readiness。


## 模块内停审

功能均有独立对象承接；字段来源含candidate/lookup/formalport/ID/CAS；factory与typedrow完整，views与业务state分轴。当前批次结构审查通过，外部positive blocked不改变。下一模块才创建其附录；不会提前创建Step7/8文件。
