# Step6 U2 申请/正式审核交接对象小循环

## 思考、诊断与取舍

capability：申请/正式审核交接，只承接本地truth/引用/guard/readsurface。前序HLD给轮廓，本批先检查功能与所有字段、factory、methods来源。采用分离实体/immutable组合/策略/视图，拒绝把qualified输入暴露给客户端或复制owner正文。所有ref不足以自证authority；当前owner/SDK positive仍blocked。

## capability与对象映射

| 对象 | 能力 / 功能 | 类别 / 归属 | 字段与函数 / 状态来源 | 后续承接 |
|---|---|---|---|---|
| PublicationBasis | 版本/材料/责任/scope全匹配；固定审核输入，不允许submitted后换材料 | contracts / immutable/value | basis_ref,source,publisher_ref,materials,scope_ref；无独立lifecycle | Step7 typed ports；8请求/结果；9独立flow；10矩阵 |
| PublicationApplication | 仅Draft更新，旧basis保留；固定basis及review责任，Draft到Submitted；本地终止；不撤销已产生外部决定/交接；初始Draft，不从材料存在自动提交 | domain / statecarrier | application_ref,draft_spec,basis_ref,review_ref,state,revision；Draft/Submitted/Terminated | Step7 typed ports；8请求/结果；9独立flow；10矩阵 |
| ReviewHandoff | 正式接收/失败/unknown分轴；仅matched正式结果，不自行审核；缺合同/不匹配不推进；初始PendingDispatch | domain / statecarrier | handoff_ref,application_ref,basis_ref,dispatch_outcome_ref,failure_ref,decision_binding,state；PendingDispatch/WaitingDecision/MatchedDecision/CommitUnknown/ContractBlocked/Failed | Step7 typed ports；8请求/结果；9独立flow；10矩阵 |
| GovernanceDecisionBinding | matched且current approved才可上架；无positive合同不建有效binding | contracts / immutable/value | decision_ref,application_ref,basis_ref,outcome_ref,validity_ref；无独立lifecycle | Step7 typed ports；8请求/结果；9独立flow；10矩阵 |
| ReviewBindingPolicy | 验证申请/来源版本/材料/scope与有效性；stateless策略/typed view assembler调用，不新增truth | domain / guard | requirements；无独立lifecycle | Step7 typed ports；8请求/结果；9独立flow；10矩阵 |
| ApplicationProgressView | immutable仅typed读取/校验；rehydrate后移03；不从MatchedDecision推approved | contracts / readview | application_ref,review_ref,decision_binding,status；无独立lifecycle | Step7 typed ports；8请求/结果；9独立flow；10矩阵 |

对象能力到字段/函数：上表每一行字段闭包承接该对象能力；下方每字段明确来源，完整签名承接对应状态，不以overview替代。初值只factory提供，其余owner/current字段由正式port与typed读取。修正Draft可无review、Blocked可无source摘要；公开视图采用SafeReadContext，不依赖domain。

### PublicationBasis

```rust
/// Carries PublicationBasis with explicit sources and no upstream body.
pub struct PublicationBasis {
    /// Carries basis_ref; see the source and invariant table.
    pub basis_ref: PublicationBasisRef,
    /// Carries source; see the source and invariant table.
    pub source: SourceBinding,
    /// Carries publisher_ref; see the source and invariant table.
    pub publisher_ref: PublisherRelationRef,
    /// Carries materials; see the source and invariant table.
    pub materials: MaterialReferenceSet,
    /// Carries scope_ref; see the source and invariant table.
    pub scope_ref: MarketScopeRef,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| basis_ref | `PublicationBasisRef` | 本地ID |
| source | `SourceBinding` | U1固定来源 |
| publisher_ref | `PublisherRelationRef` | 已核验责任关联 |
| materials | `MaterialReferenceSet` | 审核适用材料固定集 |
| scope_ref | `MarketScopeRef` | 正式范围 |

归属：contracts；该对象只承接所属U能力；domain纯同步，无ownerbody/外部approval；字段必填完整才factory，optional以生命周期约束。

#### 成员函数

| 完整签名 | 作用 | 参数来源 | 返回 / 副作用 |
|---|---|---|---|
| `pub fn matches(&self, candidate: PublicationBasis) -> bool` | 版本/材料/责任/scope全匹配 | PublicationBasis candidate：typed原对象/正式port qualified输入，不调用I/O | bool；纯读取，不改变状态 |
| `pub fn validate(&self) -> Result<(), DomainError>` | 完整字段/state不变量 | 当前本体 | 不做I/O；缺必填/binding/state错配拒绝 |

#### 工厂 / rehydrate

| 完整签名 | 必填字段来源 / 初始化 | 不变量 |
|---|---|---|
| `pub fn freeze(input: QualifiedPublicationInput) -> Result<Self, DomainError>` | QualifiedPublicationInput的独立字段schema见shared_types；完整copy typed输入；immutable固定不替换 | 固定审核输入，不允许submitted后换材料；qualified字段只内侧构造，factory不是approval |
| `pub fn rehydrate(row: PublicationBasisRow) -> Result<Self, DomainError>` | Row与本对象逐字段同构；state/optional/revision全校验；repo读取来源 | 禁止SQL/rawbody进入domain，既有ref不能重factory以复活状态 |

#### 不变量与禁止

binding只exacttyped比较，缺合同不fallback，state/status语义不外推。version/source_material/fixedbasis不可修改，revision镜像repo单一column；views只currentdisclosure之后构造，NotVisible/Missing/Degraded使用ReadSurface而非假填必需ref。unknown只能formal原intentprobe，终态不可任意复活。方法不得返回body/approval/payment/evidence/readiness。


### PublicationApplication

```rust
/// Carries PublicationApplication with explicit sources and no upstream body.
pub struct PublicationApplication {
    /// Carries application_ref; see the source and invariant table.
    pub application_ref: PublicationApplicationRef,
    /// Carries draft_spec; see the source and invariant table.
    pub draft_spec: DraftPublicationSpec,
    /// Carries basis_ref; see the source and invariant table.
    pub basis_ref: OptionalPublicationBasisRef,
    /// Carries review_ref; see the source and invariant table.
    pub review_ref: OptionalReviewHandoffRef,
    /// Carries state; see the source and invariant table.
    pub state: PublicationApplicationState,
    /// Carries revision; see the source and invariant table.
    pub revision: MarketRevision,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| application_ref | `PublicationApplicationRef` | 本地ID |
| draft_spec | `DraftPublicationSpec` | typed安全来源/责任/材料候选与scope由Draft输入持久化；Submitted不再改，非qualifiedbasis |
| basis_ref | `OptionalPublicationBasisRef` | Draft可无；Submitted必须typed固定PublicationBasis |
| review_ref | `OptionalReviewHandoffRef` | Draft可无；submit同UoW生成独立review责任 |
| state | `PublicationApplicationState` | Draft/Submitted/Terminated |
| revision | `MarketRevision` | repo返回用于optimistic save |

归属：domain；该对象只承接所属U能力；domain纯同步，无ownerbody/外部approval；字段必填完整才factory，optional以生命周期约束。

#### 成员函数

| 完整签名 | 作用 | 参数来源 | 返回 / 副作用 |
|---|---|---|---|
| `pub fn revise(&mut self, input: DraftPublicationInput) -> Result<(), DomainError>` | 仅Draft更新，旧basis保留 | DraftPublicationInput input：typed原对象/正式port qualified输入，不调用I/O | Result<(), DomainError>；只按Step10合法pair改变本对象；持久化/审计/必要work由application同UoW |
| `pub fn submit(&mut self, input: QualifiedPublicationInput) -> Result<(), DomainError>` | 固定basis及review责任，Draft到Submitted | QualifiedPublicationInput input：typed原对象/正式port qualified输入，不调用I/O | Result<(), DomainError>；只按Step10合法pair改变本对象；持久化/审计/必要work由application同UoW |
| `pub fn terminate(&mut self, input: ApplicationTerminationInput) -> Result<(), DomainError>` | 本地终止；不撤销已产生外部决定/交接 | ApplicationTerminationInput input：typed原对象/正式port qualified输入，不调用I/O | Result<(), DomainError>；只按Step10合法pair改变本对象；持久化/审计/必要work由application同UoW |
| `pub fn validate(&self) -> Result<(), DomainError>` | 完整字段/state不变量 | 当前本体 | 不做I/O；缺必填/binding/state错配拒绝 |

#### 工厂 / rehydrate

| 完整签名 | 必填字段来源 / 初始化 | 不变量 |
|---|---|---|
| `pub fn draft(input: DraftPublicationInput) -> Result<Self, DomainError>` | DraftPublicationInput的独立字段schema见shared_types；Draft；basis_ref/review_ref=None；revision=0待首次save | 初始Draft，不从材料存在自动提交；qualified字段只内侧构造，factory不是approval |
| `pub fn rehydrate(row: PublicationApplicationRow) -> Result<Self, DomainError>` | Row与本对象逐字段同构；state/optional/revision全校验；repo读取来源 | 禁止SQL/rawbody进入domain，既有ref不能重factory以复活状态 |

#### 不变量与禁止

初始：Draft；basis_ref/review_ref=None；revision=0待首次save。binding只exacttyped比较，缺合同不fallback，state/status语义不外推。version/source_material/fixedbasis不可修改，revision镜像repo单一column；views只currentdisclosure之后构造，NotVisible/Missing/Degraded使用ReadSurface而非假填必需ref。unknown只能formal原intentprobe，终态不可任意复活。方法不得返回body/approval/payment/evidence/readiness。


### ReviewHandoff

```rust
/// Carries ReviewHandoff with explicit sources and no upstream body.
pub struct ReviewHandoff {
    /// Carries handoff_ref; see the source and invariant table.
    pub handoff_ref: ReviewHandoffRef,
    /// Carries application_ref; see the source and invariant table.
    pub application_ref: PublicationApplicationRef,
    /// Carries basis_ref; see the source and invariant table.
    pub basis_ref: PublicationBasisRef,
    /// Carries dispatch_outcome_ref; see the source and invariant table.
    pub dispatch_outcome_ref: OptionalReviewDispatchOutcomeRef,
    /// Carries failure_ref; see the source and invariant table.
    pub failure_ref: OptionalSafeFailureRef,
    /// Carries decision_binding; see the source and invariant table.
    pub decision_binding: OptionalGovernanceDecisionBinding,
    /// Carries state; see the source and invariant table.
    pub state: ReviewHandoffState,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| handoff_ref | `ReviewHandoffRef` | 提交时原子生成 |
| application_ref | `PublicationApplicationRef` | 原申请固定关联 |
| basis_ref | `PublicationBasisRef` | 原审查对象 |
| dispatch_outcome_ref | `OptionalReviewDispatchOutcomeRef` | WaitingDecision/Unknown/Failed保存原意图交接结果或安全unknown来源 |
| failure_ref | `OptionalSafeFailureRef` | ContractBlocked/Failed/Unknown具安全缺口/失败依据 |
| decision_binding | `OptionalGovernanceDecisionBinding` | 仅正式matched决定存在时 |
| state | `ReviewHandoffState` | 局部进度而非Approved |

归属：domain；该对象只承接所属U能力；domain纯同步，无ownerbody/外部approval；字段必填完整才factory，optional以生命周期约束。

#### 成员函数

| 完整签名 | 作用 | 参数来源 | 返回 / 副作用 |
|---|---|---|---|
| `pub fn record_dispatch(&mut self, outcome: ReviewDispatchOutcomeInput) -> Result<(), DomainError>` | 正式接收/失败/unknown分轴 | ReviewDispatchOutcomeInput outcome：typed原对象/正式port qualified输入，不调用I/O | Result<(), DomainError>；只按Step10合法pair改变本对象；持久化/审计/必要work由application同UoW |
| `pub fn record_decision(&mut self, binding: GovernanceDecisionBinding) -> Result<(), DomainError>` | 仅matched正式结果，不自行审核 | GovernanceDecisionBinding binding：typed原对象/正式port qualified输入，不调用I/O | Result<(), DomainError>；只按Step10合法pair改变本对象；持久化/审计/必要work由application同UoW |
| `pub fn block(&mut self, gap: ContractGapInput) -> Result<(), DomainError>` | 缺合同/不匹配不推进 | ContractGapInput gap：typed原对象/正式port qualified输入，不调用I/O | Result<(), DomainError>；只按Step10合法pair改变本对象；持久化/审计/必要work由application同UoW |
| `pub fn validate(&self) -> Result<(), DomainError>` | 完整字段/state不变量 | 当前本体 | 不做I/O；缺必填/binding/state错配拒绝 |

#### 工厂 / rehydrate

| 完整签名 | 必填字段来源 / 初始化 | 不变量 |
|---|---|---|
| `pub fn prepare(input: SubmittedApplicationInput) -> Result<Self, DomainError>` | SubmittedApplicationInput的独立字段schema见shared_types；PendingDispatch；outcome/failure/decision=None | 初始PendingDispatch；qualified字段只内侧构造，factory不是approval |
| `pub fn rehydrate(row: ReviewHandoffRow) -> Result<Self, DomainError>` | Row与本对象逐字段同构；state/optional/revision全校验；repo读取来源 | 禁止SQL/rawbody进入domain，既有ref不能重factory以复活状态 |

#### 不变量与禁止

初始：PendingDispatch；outcome/failure/decision=None。binding只exacttyped比较，缺合同不fallback，state/status语义不外推。version/source_material/fixedbasis不可修改，revision镜像repo单一column；views只currentdisclosure之后构造，NotVisible/Missing/Degraded使用ReadSurface而非假填必需ref。unknown只能formal原intentprobe，终态不可任意复活。方法不得返回body/approval/payment/evidence/readiness。


### GovernanceDecisionBinding

```rust
/// Carries GovernanceDecisionBinding with explicit sources and no upstream body.
pub struct GovernanceDecisionBinding {
    /// Carries decision_ref; see the source and invariant table.
    pub decision_ref: GovernanceDecisionRef,
    /// Carries application_ref; see the source and invariant table.
    pub application_ref: PublicationApplicationRef,
    /// Carries basis_ref; see the source and invariant table.
    pub basis_ref: PublicationBasisRef,
    /// Carries outcome_ref; see the source and invariant table.
    pub outcome_ref: GovernanceOutcomeRef,
    /// Carries validity_ref; see the source and invariant table.
    pub validity_ref: DecisionValidityRef,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| decision_ref | `GovernanceDecisionRef` | Gov正式来源 |
| application_ref | `PublicationApplicationRef` | 指定申请，不泛化 |
| basis_ref | `PublicationBasisRef` | 来源/材料/scope完整绑定 |
| outcome_ref | `GovernanceOutcomeRef` | 正式approved/rejected等结果ref，非本地enum |
| validity_ref | `DecisionValidityRef` | 有效期/替代/撤销正式依据 |

归属：contracts；该对象只承接所属U能力；domain纯同步，无ownerbody/外部approval；字段必填完整才factory，optional以生命周期约束。

#### 成员函数

| 完整签名 | 作用 | 参数来源 | 返回 / 副作用 |
|---|---|---|---|
| `pub fn applies(&self, basis: PublicationBasis, current: CurrentDecisionInput) -> Result<LocalGateResult, DomainError>` | matched且current approved才可上架 | PublicationBasis basis；CurrentDecisionInput current：typed原对象/正式port qualified输入，不调用I/O | Result<LocalGateResult, DomainError>；纯读取，不改变状态 |
| `pub fn validate(&self) -> Result<(), DomainError>` | 完整字段/state不变量 | 当前本体 | 不做I/O；缺必填/binding/state错配拒绝 |

#### 工厂 / rehydrate

| 完整签名 | 必填字段来源 / 初始化 | 不变量 |
|---|---|---|
| `pub fn from_governance(input: QualifiedDecisionInput) -> Result<Self, DomainError>` | QualifiedDecisionInput的独立字段schema见shared_types；完整copy typed输入；immutable固定不替换 | 无positive合同不建有效binding；qualified字段只内侧构造，factory不是approval |
| `pub fn rehydrate(row: GovernanceDecisionBindingRow) -> Result<Self, DomainError>` | Row与本对象逐字段同构；state/optional/revision全校验；repo读取来源 | 禁止SQL/rawbody进入domain，既有ref不能重factory以复活状态 |

#### 不变量与禁止

binding只exacttyped比较，缺合同不fallback，state/status语义不外推。version/source_material/fixedbasis不可修改，revision镜像repo单一column；views只currentdisclosure之后构造，NotVisible/Missing/Degraded使用ReadSurface而非假填必需ref。unknown只能formal原intentprobe，终态不可任意复活。方法不得返回body/approval/payment/evidence/readiness。


### ReviewBindingPolicy

```rust
/// Carries ReviewBindingPolicy with explicit sources and no upstream body.
pub struct ReviewBindingPolicy {
    /// Carries requirements; see the source and invariant table.
    pub requirements: ReviewBindingRequirements,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| requirements | `ReviewBindingRequirements` | 正式审查适用需求 |

归属：domain；该对象只承接所属U能力；domain纯同步，无ownerbody/外部approval；字段必填完整才factory，optional以生命周期约束。

#### 成员函数

| 完整签名 | 作用 | 参数来源 | 返回 / 副作用 |
|---|---|---|---|
| `pub fn evaluate(&self, basis: PublicationBasis, decision: GovernanceDecisionBinding, current: CurrentDecisionInput) -> Result<LocalGateResult, DomainError>` | 验证申请/来源版本/材料/scope与有效性 | PublicationBasis basis；GovernanceDecisionBinding decision；CurrentDecisionInput current：typed原对象/正式port qualified输入，不调用I/O | Result<LocalGateResult, DomainError>；纯读取，不改变状态 |
| `pub fn validate(&self) -> Result<(), DomainError>` | 完整字段/state不变量 | 当前本体 | 不做I/O；缺必填/binding/state错配拒绝 |

#### 工厂 / rehydrate

| 完整签名 | 必填字段来源 / 初始化 | 不变量 |
|---|---|---|
| `pub fn new(requirements: ReviewBindingRequirements) -> Result<Self, DomainError>` | formal适用规则输入，禁config豁免 | stateless guard，不新增truth |
| `pub fn rehydrate(row: ReviewBindingPolicyRow) -> Result<Self, DomainError>` | Row与本对象逐字段同构；state/optional/revision全校验；repo读取来源 | 禁止SQL/rawbody进入domain，既有ref不能重factory以复活状态 |

#### 不变量与禁止

binding只exacttyped比较，缺合同不fallback，state/status语义不外推。version/source_material/fixedbasis不可修改，revision镜像repo单一column；views只currentdisclosure之后构造，NotVisible/Missing/Degraded使用ReadSurface而非假填必需ref。unknown只能formal原intentprobe，终态不可任意复活。方法不得返回body/approval/payment/evidence/readiness。


### ApplicationProgressView

```rust
/// Carries ApplicationProgressView with explicit sources and no upstream body.
pub struct ApplicationProgressView {
    /// Carries application_ref; see the source and invariant table.
    pub application_ref: PublicationApplicationRef,
    /// Carries review_ref; see the source and invariant table.
    pub review_ref: OptionalReviewHandoffRef,
    /// Carries decision_binding; see the source and invariant table.
    pub decision_binding: OptionalGovernanceDecisionBinding,
    /// Carries status; see the source and invariant table.
    pub status: ReadSurfaceKind,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| application_ref | `PublicationApplicationRef` | 本地truth |
| review_ref | `OptionalReviewHandoffRef` | 独立交接进度 |
| decision_binding | `OptionalGovernanceDecisionBinding` | body-free可见决定依据 |
| status | `ReadSurfaceKind` | 只读missing/stale/degraded安全结果 |

归属：contracts；该对象只承接所属U能力；domain纯同步，无ownerbody/外部approval；字段必填完整才factory，optional以生命周期约束。

#### 成员函数

| 完整签名 | 作用 | 参数来源 | 返回 / 副作用 |
|---|---|---|---|
| 无业务变更成员 | immutable/view不修改truth | 不适用 | 只校验/typed读 |
| `pub fn validate(&self) -> Result<(), DomainError>` | 完整字段/state不变量 | 当前本体 | 不做I/O；缺必填/binding/state错配拒绝 |

#### 工厂 / rehydrate

| 完整签名 | 必填字段来源 / 初始化 | 不变量 |
|---|---|---|
| `pub fn assemble(input: ApplicationProgressReadInput) -> Result<Self, DomainError>` | ApplicationProgressReadInput的独立字段schema见shared_types；完整copy typed输入；immutable固定不替换 | 不从MatchedDecision推approved；qualified字段只内侧构造，factory不是approval |
| `pub fn rehydrate(row: ApplicationProgressViewRow) -> Result<Self, DomainError>` | Row与本对象逐字段同构；state/optional/revision全校验；repo读取来源 | 禁止SQL/rawbody进入domain，既有ref不能重factory以复活状态 |

#### 不变量与禁止

binding只exacttyped比较，缺合同不fallback，state/status语义不外推。version/source_material/fixedbasis不可修改，revision镜像repo单一column；views只currentdisclosure之后构造，NotVisible/Missing/Degraded使用ReadSurface而非假填必需ref。unknown只能formal原intentprobe，终态不可任意复活。方法不得返回body/approval/payment/evidence/readiness。


## 模块内停审

功能均有独立对象承接；字段来源含candidate/lookup/formalport/ID/CAS；factory与typedrow完整，views与业务state分轴。当前批次结构审查通过，外部positive blocked不改变。下一模块才创建其附录；不会提前创建Step7/8文件。
