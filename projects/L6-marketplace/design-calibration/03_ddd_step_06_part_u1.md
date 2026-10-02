# Step6 U1 来源/发布责任对象小循环

## 思考、诊断与取舍

capability：来源/发布责任，只承接本地truth/引用/guard/readsurface。前序HLD给轮廓，本批先检查功能与所有字段、factory、methods来源。采用分离实体/immutable组合/策略/视图，拒绝把qualified输入暴露给客户端或复制owner正文。所有ref不足以自证authority；当前owner/SDK positive仍blocked。

## capability与对象映射

| 对象 | 能力 / 功能 | 类别 / 归属 | 字段与函数 / 状态来源 | 后续承接 |
|---|---|---|---|---|
| SourceBinding | 逐typed字段一致，不猜同义ref；来源合同qualified才建组合 | contracts / immutable/value | owner_ref,owner_version,asset_digest,visibility_ref,eligibility_ref；无独立lifecycle | Step7 typed ports；8请求/结果；9独立flow；10矩阵 |
| MaterialReference | 仅binding与正式适用核验；不保存raw签名/扫描结果 | contracts / immutable/value | material_ref,binding,kind_ref,applicability_ref；无独立lifecycle | Step7 typed ports；8请求/结果；9独立flow；10矩阵 |
| PublisherRelation | 有权解除本地责任，保留历史；当前authority有效，初始Bound | domain / statecarrier | relation_ref,principal_ref,authority_ref,scope_ref,state；Bound/Released | Step7 typed ports；8请求/结果；9独立flow；10矩阵 |
| SourceVerification | 核验qualified或blocked，结果来源必须存在；正式变化或失效提示使本地资格不再供新positive；初始Pending，不推断qualified | domain / statecarrier |verification_ref,publisher_ref,source_candidate,source_binding,material_refs,outcome_ref,state；Pending/Qualified/Blocked/Invalidated | Step7 typed ports；8请求/结果；9独立flow；10矩阵 |
| SourceGatePolicy | 返回本地允许/缺口轮廓，不造verified；stateless策略/typed view assembler调用，不新增truth | domain / guard | requirements；无独立lifecycle | Step7 typed ports；8请求/结果；9独立flow；10矩阵 |
| SourceQualificationView | immutable仅typed读取/校验；rehydrate后移03；只读生成，不刷新核验 | contracts / readview | verification_ref,safe_summary,read_context,status；无独立lifecycle | Step7 typed ports；8请求/结果；9独立flow；10矩阵 |

对象能力到字段/函数：上表每一行字段闭包承接该对象能力；下方每字段明确来源，完整签名承接对应状态，不以overview替代。初值只factory提供，其余owner/current字段由正式port与typed读取。修正Draft可无review、Blocked可无source摘要；公开视图采用SafeReadContext，不依赖domain。

### SourceBinding

```rust
/// Carries SourceBinding with explicit sources and no upstream body.
pub struct SourceBinding {
    /// Carries owner_ref; see the source and invariant table.
    pub owner_ref: TypedOwnerReference,
    /// Carries owner_version; see the source and invariant table.
    pub owner_version: OwnerVersionRef,
    /// Carries asset_digest; see the source and invariant table.
    pub asset_digest: OwnerAssetDigest,
    /// Carries visibility_ref; see the source and invariant table.
    pub visibility_ref: OwnerVisibilityRef,
    /// Carries eligibility_ref; see the source and invariant table.
    pub eligibility_ref: OwnerEligibilityRef,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| owner_ref | `TypedOwnerReference` | 正式resolver输出，不解析字符串 |
| owner_version | `OwnerVersionRef` | owner提供不可变版本 |
| asset_digest | `OwnerAssetDigest` | owner提供摘要，不本地重算 |
| visibility_ref | `OwnerVisibilityRef` | owner正式可见依据 |
| eligibility_ref | `OwnerEligibilityRef` | owner消费资格依据 |

归属：contracts；该对象只承接所属U能力；domain纯同步，无ownerbody/外部approval；字段必填完整才factory，optional以生命周期约束。

#### 成员函数

| 完整签名 | 作用 | 参数来源 | 返回 / 副作用 |
|---|---|---|---|
| `pub fn matches(&self, candidate: SourceBinding) -> bool` | 逐typed字段一致，不猜同义ref | SourceBinding candidate：typed原对象/正式port qualified输入，不调用I/O | bool；纯读取，不改变状态 |
| `pub fn validate(&self) -> Result<(), DomainError>` | 完整字段/state不变量 | 当前本体 | 不做I/O；缺必填/binding/state错配拒绝 |

#### 工厂 / rehydrate

| 完整签名 | 必填字段来源 / 初始化 | 不变量 |
|---|---|---|
| `pub fn from_owner(input: QualifiedSourceInput) -> Result<Self, DomainError>` | QualifiedSourceInput的独立字段schema见shared_types；完整copy typed输入；immutable固定不替换 | 来源合同qualified才建组合；qualified字段只内侧构造，factory不是approval |
| `pub fn rehydrate(row: SourceBindingRow) -> Result<Self, DomainError>` | Row与本对象逐字段同构；state/optional/revision全校验；repo读取来源 | 禁止SQL/rawbody进入domain，既有ref不能重factory以复活状态 |

#### 不变量与禁止

binding只exacttyped比较，缺合同不fallback，state/status语义不外推。version/source_material/fixedbasis不可修改，revision镜像repo单一column；views只currentdisclosure之后构造，NotVisible/Missing/Degraded使用ReadSurface而非假填必需ref。unknown只能formal原intentprobe，终态不可任意复活。方法不得返回body/approval/payment/evidence/readiness。


### MaterialReference

```rust
/// Carries MaterialReference with explicit sources and no upstream body.
pub struct MaterialReference {
    /// Carries material_ref; see the source and invariant table.
    pub material_ref: OwnerMaterialRef,
    /// Carries binding; see the source and invariant table.
    pub binding: SourceBinding,
    /// Carries kind_ref; see the source and invariant table.
    pub kind_ref: MaterialKindRef,
    /// Carries applicability_ref; see the source and invariant table.
    pub applicability_ref: MaterialApplicabilityRef,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| material_ref | `OwnerMaterialRef` | Artifact/正式材料authority输出 |
| binding | `SourceBinding` | 被核验exact来源 |
| kind_ref | `MaterialKindRef` | authority正式kind，不本地发明scan enum |
| applicability_ref | `MaterialApplicabilityRef` | 适用/有效性依据 |

归属：contracts；该对象只承接所属U能力；domain纯同步，无ownerbody/外部approval；字段必填完整才factory，optional以生命周期约束。

#### 成员函数

| 完整签名 | 作用 | 参数来源 | 返回 / 副作用 |
|---|---|---|---|
| `pub fn matches(&self, source: SourceBinding) -> bool` | 仅binding与正式适用核验 | SourceBinding source：typed原对象/正式port qualified输入，不调用I/O | bool；纯读取，不改变状态 |
| `pub fn validate(&self) -> Result<(), DomainError>` | 完整字段/state不变量 | 当前本体 | 不做I/O；缺必填/binding/state错配拒绝 |

#### 工厂 / rehydrate

| 完整签名 | 必填字段来源 / 初始化 | 不变量 |
|---|---|---|
| `pub fn from_authority(input: QualifiedMaterialInput) -> Result<Self, DomainError>` | QualifiedMaterialInput的独立字段schema见shared_types；完整copy typed输入；immutable固定不替换 | 不保存raw签名/扫描结果；qualified字段只内侧构造，factory不是approval |
| `pub fn rehydrate(row: MaterialReferenceRow) -> Result<Self, DomainError>` | Row与本对象逐字段同构；state/optional/revision全校验；repo读取来源 | 禁止SQL/rawbody进入domain，既有ref不能重factory以复活状态 |

#### 不变量与禁止

binding只exacttyped比较，缺合同不fallback，state/status语义不外推。version/source_material/fixedbasis不可修改，revision镜像repo单一column；views只currentdisclosure之后构造，NotVisible/Missing/Degraded使用ReadSurface而非假填必需ref。unknown只能formal原intentprobe，终态不可任意复活。方法不得返回body/approval/payment/evidence/readiness。


### PublisherRelation

```rust
/// Carries PublisherRelation with explicit sources and no upstream body.
pub struct PublisherRelation {
    /// Carries relation_ref; see the source and invariant table.
    pub relation_ref: PublisherRelationRef,
    /// Carries principal_ref; see the source and invariant table.
    pub principal_ref: PublisherPrincipalRef,
    /// Carries authority_ref; see the source and invariant table.
    pub authority_ref: PublisherAuthorityRef,
    /// Carries scope_ref; see the source and invariant table.
    pub scope_ref: MarketScopeRef,
    /// Carries state; see the source and invariant table.
    pub state: PublisherRelationState,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| relation_ref | `PublisherRelationRef` | 本地ID port分配 |
| principal_ref | `PublisherPrincipalRef` | 正式人类/组织authority提供，非AI ID默认映射 |
| authority_ref | `PublisherAuthorityRef` | 当前scope与授权来源 |
| scope_ref | `MarketScopeRef` | 正式resolver范围 |
| state | `PublisherRelationState` | 本地Bound/Released；不外部Verified |

归属：domain；该对象只承接所属U能力；domain纯同步，无ownerbody/外部approval；字段必填完整才factory，optional以生命周期约束。

#### 成员函数

| 完整签名 | 作用 | 参数来源 | 返回 / 副作用 |
|---|---|---|---|
| `pub fn release(&mut self, input: AuthorityDispositionInput) -> Result<(), DomainError>` | 有权解除本地责任，保留历史 | AuthorityDispositionInput input：typed原对象/正式port qualified输入，不调用I/O | Result<(), DomainError>；只按Step10合法pair改变本对象；持久化/审计/必要work由application同UoW |
| `pub fn validate(&self) -> Result<(), DomainError>` | 完整字段/state不变量 | 当前本体 | 不做I/O；缺必填/binding/state错配拒绝 |

#### 工厂 / rehydrate

| 完整签名 | 必填字段来源 / 初始化 | 不变量 |
|---|---|---|
| `pub fn bind(input: QualifiedPublisherInput) -> Result<Self, DomainError>` | QualifiedPublisherInput的独立字段schema见shared_types；Bound | 当前authority有效，初始Bound；qualified字段只内侧构造，factory不是approval |
| `pub fn rehydrate(row: PublisherRelationRow) -> Result<Self, DomainError>` | Row与本对象逐字段同构；state/optional/revision全校验；repo读取来源 | 禁止SQL/rawbody进入domain，既有ref不能重factory以复活状态 |

#### 不变量与禁止

初始：Bound。binding只exacttyped比较，缺合同不fallback，state/status语义不外推。version/source_material/fixedbasis不可修改，revision镜像repo单一column；views只currentdisclosure之后构造，NotVisible/Missing/Degraded使用ReadSurface而非假填必需ref。unknown只能formal原intentprobe，终态不可任意复活。方法不得返回body/approval/payment/evidence/readiness。


### SourceVerification

```rust
/// Carries SourceVerification with explicit sources and no upstream body.
pub struct SourceVerification {
    /// Carries verification_ref; see the source and invariant table.
    pub verification_ref: SourceVerificationRef,
    /// Carries source_candidate; see the source and invariant table.
    pub source_candidate: SourceVerificationTarget,
    /// Carries publisher_ref; see the source and invariant table.
    pub publisher_ref: PublisherRelationRef,
    /// Carries source_binding; see the source and invariant table.
    pub source_binding: OptionalSourceBinding,
    /// Carries material_refs; see the source and invariant table.
    pub material_refs: MaterialReferenceSet,
    /// Carries outcome_ref; see the source and invariant table.
    pub outcome_ref: OptionalQualificationOutcomeRef,
    /// Carries state; see the source and invariant table.
    pub state: SourceVerificationState,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| verification_ref | `SourceVerificationRef` | 本地ID生成 |
| source_candidate | `SourceVerificationTarget` | 来自请求的typed安全owner/type/opaque候选/版本/scope；未qualified时可回指所核验对象，绝不是canonicalref自造 |
| publisher_ref | `PublisherRelationRef` | Verify请求关联+typedpublisher当前authority，保存后Release可按正式localtyped关联失效；不只同scope猜关联 |
| source_binding | `OptionalSourceBinding` | 仅正式来源组合已核验时存在；Blocked缺源允许缺失但禁止提交 |
| material_refs | `MaterialReferenceSet` | 只适用body-free组合 |
| outcome_ref | `OptionalQualificationOutcomeRef` | Pending可无；Qualified/Blocked/Invalidated必须安全结果/缺口依据 |
| state | `SourceVerificationState` | Pending/Qualified/Blocked/Invalidated |

归属：domain；该对象只承接所属U能力；domain纯同步，无ownerbody/外部approval；字段必填完整才factory，optional以生命周期约束。

#### 成员函数

| 完整签名 | 作用 | 参数来源 | 返回 / 副作用 |
|---|---|---|---|
| `pub fn record(&mut self, outcome: QualificationOutcomeInput) -> Result<(), DomainError>` | 核验qualified或blocked，结果来源必须存在 | QualificationOutcomeInput outcome：typed原对象/正式port qualified输入，不调用I/O | Result<(), DomainError>；只按Step10合法pair改变本对象；持久化/审计/必要work由application同UoW |
| `pub fn invalidate(&mut self, input: SourceInvalidationInput) -> Result<(), DomainError>` | 正式变化或失效提示使本地资格不再供新positive | SourceInvalidationInput input：typed原对象/正式port qualified输入，不调用I/O | Result<(), DomainError>；只按Step10合法pair改变本对象；持久化/审计/必要work由application同UoW |
| `pub fn validate(&self) -> Result<(), DomainError>` | 完整字段/state不变量 | 当前本体 | 不做I/O；缺必填/binding/state错配拒绝 |

#### 工厂 / rehydrate

| 完整签名 | 必填字段来源 / 初始化 | 不变量 |
|---|---|---|
| `pub fn start(input: SourceVerificationInput) -> Result<Self, DomainError>` | SourceVerificationInput的独立字段schema见shared_types；Pending；source_binding=None/material_refs=[]/outcome_ref=None | 初始Pending，不推断qualified；qualified字段只内侧构造，factory不是approval |
| `pub fn rehydrate(row: SourceVerificationRow) -> Result<Self, DomainError>` | Row与本对象逐字段同构；state/optional/revision全校验；repo读取来源 | 禁止SQL/rawbody进入domain，既有ref不能重factory以复活状态 |

#### 不变量与禁止

初始：Pending；source_binding=None/material_refs=[]/outcome_ref=None。binding只exacttyped比较，缺合同不fallback，state/status语义不外推。version/source_material/fixedbasis不可修改，revision镜像repo单一column；views只currentdisclosure之后构造，NotVisible/Missing/Degraded使用ReadSurface而非假填必需ref。unknown只能formal原intentprobe，终态不可任意复活。方法不得返回body/approval/payment/evidence/readiness。


### SourceGatePolicy

```rust
/// Carries SourceGatePolicy with explicit sources and no upstream body.
pub struct SourceGatePolicy {
    /// Carries requirements; see the source and invariant table.
    pub requirements: QualifiedSourceRuleInput,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| requirements | `QualifiedSourceRuleInput` | application传入适用规则，禁止配置豁免 |

归属：domain；该对象只承接所属U能力；domain纯同步，无ownerbody/外部approval；字段必填完整才factory，optional以生命周期约束。

#### 成员函数

| 完整签名 | 作用 | 参数来源 | 返回 / 副作用 |
|---|---|---|---|
| `pub fn evaluate(&self, source: SourceBinding, publisher: PublisherRelation, materials: MaterialReferenceSet, authority: CurrentAuthorityInput) -> Result<LocalGateResult, DomainError>` | 返回本地允许/缺口轮廓，不造verified | SourceBinding source；PublisherRelation publisher；MaterialReferenceSet materials；CurrentAuthorityInput authority：typed原对象/正式port qualified输入，不调用I/O | Result<LocalGateResult, DomainError>；纯读取，不改变状态 |
| `pub fn validate(&self) -> Result<(), DomainError>` | 完整字段/state不变量 | 当前本体 | 不做I/O；缺必填/binding/state错配拒绝 |

#### 工厂 / rehydrate

| 完整签名 | 必填字段来源 / 初始化 | 不变量 |
|---|---|---|
| `pub fn new(requirements: QualifiedSourceRuleInput) -> Result<Self, DomainError>` | formal适用规则输入，禁config豁免 | stateless guard，不新增truth |
| `pub fn rehydrate(row: SourceGatePolicyRow) -> Result<Self, DomainError>` | Row与本对象逐字段同构；state/optional/revision全校验；repo读取来源 | 禁止SQL/rawbody进入domain，既有ref不能重factory以复活状态 |

#### 不变量与禁止

binding只exacttyped比较，缺合同不fallback，state/status语义不外推。version/source_material/fixedbasis不可修改，revision镜像repo单一column；views只currentdisclosure之后构造，NotVisible/Missing/Degraded使用ReadSurface而非假填必需ref。unknown只能formal原intentprobe，终态不可任意复活。方法不得返回body/approval/payment/evidence/readiness。


### SourceQualificationView

```rust
/// Carries SourceQualificationView with explicit sources and no upstream body.
pub struct SourceQualificationView {
    /// Carries verification_ref; see the source and invariant table.
    pub verification_ref: SourceVerificationRef,
    /// Carries safe_summary; see the source and invariant table.
    pub safe_summary: Option<SourceSafeSummary>,
    /// Carries read_context; see the source and invariant table.
    pub read_context: SafeReadContext,
    /// Carries status; see the source and invariant table.
    pub status: ReadSurfaceKind,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| verification_ref | `SourceVerificationRef` | 已提交核验关联 |
| safe_summary | `Option<SourceSafeSummary>` | qualified owner摘要，无正文 |
| read_context | `SafeReadContext` | resolver当前裁剪 |
| status | `ReadSurfaceKind` | 按正式读取结果映射，不持久业务状态 |

归属：contracts；该对象只承接所属U能力；domain纯同步，无ownerbody/外部approval；字段必填完整才factory，optional以生命周期约束。

#### 成员函数

| 完整签名 | 作用 | 参数来源 | 返回 / 副作用 |
|---|---|---|---|
| 无业务变更成员 | immutable/view不修改truth | 不适用 | 只校验/typed读 |
| `pub fn validate(&self) -> Result<(), DomainError>` | 完整字段/state不变量 | 当前本体 | 不做I/O；缺必填/binding/state错配拒绝 |

#### 工厂 / rehydrate

| 完整签名 | 必填字段来源 / 初始化 | 不变量 |
|---|---|---|
| `pub fn assemble(input: SourceQualificationReadInput) -> Result<Self, DomainError>` | SourceQualificationReadInput的独立字段schema见shared_types；完整copy typed输入；immutable固定不替换 | 只读生成，不刷新核验；qualified字段只内侧构造，factory不是approval |
| `pub fn rehydrate(row: SourceQualificationViewRow) -> Result<Self, DomainError>` | Row与本对象逐字段同构；state/optional/revision全校验；repo读取来源 | 禁止SQL/rawbody进入domain，既有ref不能重factory以复活状态 |

#### 不变量与禁止

binding只exacttyped比较，缺合同不fallback，state/status语义不外推。version/source_material/fixedbasis不可修改，revision镜像repo单一column；views只currentdisclosure之后构造，NotVisible/Missing/Degraded使用ReadSurface而非假填必需ref。unknown只能formal原intentprobe，终态不可任意复活。方法不得返回body/approval/payment/evidence/readiness。


## 模块内停审

功能均有独立对象承接；字段来源含candidate/lookup/formalport/ID/CAS；factory与typedrow完整，views与业务state分轴。当前批次结构审查通过，外部positive blocked不改变。下一模块才创建其附录；不会提前创建Step7/8文件。
