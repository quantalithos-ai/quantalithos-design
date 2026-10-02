# Step6 U3 目录/市场版本对象小循环

## 思考、诊断与取舍

capability：目录/市场版本，只承接本地truth/引用/guard/readsurface。前序HLD给轮廓，本批先检查功能与所有字段、factory、methods来源。采用分离实体/immutable组合/策略/视图，拒绝把qualified输入暴露给客户端或复制owner正文。所有ref不足以自证authority；当前owner/SDK positive仍blocked。

## capability与对象映射

| 对象 | 能力 / 功能 | 类别 / 归属 | 字段与函数 / 状态来源 | 后续承接 |
|---|---|---|---|---|
| MarketplaceListing | 只市场metadata，不变owner版本或申请基线；建立目录壳，不自带Listed版本 | domain / immutable/value | listing_ref,publisher_ref,metadata,category_refs,revision；无独立lifecycle | Step7 typed ports；8请求/结果；9独立flow；10矩阵 |
| MarketVersion | 当前正式approved/资格才显式Listed；正式失效或未知保守限制，非owner撤销；有据局部撤回，终态不自动复活；初始Staged，固定owner版本 | domain / statecarrier | version_ref,listing_ref,source_binding,application_ref,decision_binding,disposition_ref,state,revision；Staged/Listed/Restricted/Withdrawn | Step7 typed ports；8请求/结果；9独立flow；10矩阵 |
| Category | 防循环/不可见关联与标签越界；有权taxonomy写入，非source定义 | domain / immutable/value |category_ref,label,parent_ref,scope_ref,revision；无独立lifecycle | Step7 typed ports；8请求/结果；9独立flow；10矩阵 |
| VersionAdmissionPolicy | 返回局部准入/拒绝，不自行决定Gov outcome；stateless策略/typed view assembler调用，不新增truth | domain / guard | requirements；无独立lifecycle | Step7 typed ports；8请求/结果；9独立flow；10矩阵 |
| CatalogReadView | immutable仅typed读取/校验；rehydrate后移03；按同scope裁剪所有字段/数量/提示 | contracts / readview | listing_ref,version_refs,safe_metadata,read_context,status；无独立lifecycle | Step7 typed ports；8请求/结果；9独立flow；10矩阵 |

对象能力到字段/函数：上表每一行字段闭包承接该对象能力；下方每字段明确来源，完整签名承接对应状态，不以overview替代。初值只factory提供，其余owner/current字段由正式port与typed读取。修正Draft可无review、Blocked可无source摘要；公开视图采用SafeReadContext，不依赖domain。

### MarketplaceListing

```rust
/// Carries MarketplaceListing with explicit sources and no upstream body.
pub struct MarketplaceListing {
    /// Carries listing_ref; see the source and invariant table.
    pub listing_ref: MarketplaceListingRef,
    /// Carries publisher_ref; see the source and invariant table.
    pub publisher_ref: PublisherRelationRef,
    /// Carries metadata; see the source and invariant table.
    pub metadata: MarketListingMetadata,
    /// Carries category_refs; see the source and invariant table.
    pub category_refs: CategoryRefSet,
    /// Carries revision; see the source and invariant table.
    pub revision: MarketRevision,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| listing_ref | `MarketplaceListingRef` | 本地ID |
| publisher_ref | `PublisherRelationRef` | U1责任关联 |
| metadata | `MarketListingMetadata` | 用户允许市场描述/标签，拒绝body |
| category_refs | `CategoryRefSet` | U3分类关联 |
| revision | `MarketRevision` | repo返回并发版本 |

归属：domain；该对象只承接所属U能力；domain纯同步，无ownerbody/外部approval；字段必填完整才factory，optional以生命周期约束。

#### 成员函数

| 完整签名 | 作用 | 参数来源 | 返回 / 副作用 |
|---|---|---|---|
| `pub fn edit(&mut self, input: ListingMetadataInput) -> Result<(), DomainError>` | 只市场metadata，不变owner版本或申请基线 | ListingMetadataInput input：typed原对象/正式port qualified输入，不调用I/O | Result<(), DomainError>；只按Step10合法pair改变本对象；持久化/审计/必要work由application同UoW |
| `pub fn validate(&self) -> Result<(), DomainError>` | 完整字段/state不变量 | 当前本体 | 不做I/O；缺必填/binding/state错配拒绝 |

#### 工厂 / rehydrate

| 完整签名 | 必填字段来源 / 初始化 | 不变量 |
|---|---|---|
| `pub fn create(input: ListingCreationInput) -> Result<Self, DomainError>` | ListingCreationInput的独立字段schema见shared_types；完整copy typed输入；immutable固定不替换 | 建立目录壳，不自带Listed版本；qualified字段只内侧构造，factory不是approval |
| `pub fn rehydrate(row: MarketplaceListingRow) -> Result<Self, DomainError>` | Row与本对象逐字段同构；state/optional/revision全校验；repo读取来源 | 禁止SQL/rawbody进入domain，既有ref不能重factory以复活状态 |

#### 不变量与禁止

binding只exacttyped比较，缺合同不fallback，state/status语义不外推。version/source_material/fixedbasis不可修改，revision镜像repo单一column；views只currentdisclosure之后构造，NotVisible/Missing/Degraded使用ReadSurface而非假填必需ref。unknown只能formal原intentprobe，终态不可任意复活。方法不得返回body/approval/payment/evidence/readiness。


### MarketVersion

```rust
/// Carries MarketVersion with explicit sources and no upstream body.
pub struct MarketVersion {
    /// Carries version_ref; see the source and invariant table.
    pub version_ref: MarketVersionRef,
    /// Carries listing_ref; see the source and invariant table.
    pub listing_ref: MarketplaceListingRef,
    /// Carries source_binding; see the source and invariant table.
    pub source_binding: SourceBinding,
    /// Carries application_ref; see the source and invariant table.
    pub application_ref: PublicationApplicationRef,
    /// Carries decision_binding; see the source and invariant table.
    pub decision_binding: OptionalGovernanceDecisionBinding,
    /// Carries disposition_ref; see the source and invariant table.
    pub disposition_ref: OptionalWithdrawalDispositionRef,
    /// Carries state; see the source and invariant table.
    pub state: MarketVersionState,
    /// Carries revision; see the source and invariant table.
    pub revision: MarketRevision,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| version_ref | `MarketVersionRef` | 本地ID，不是owner version |
| listing_ref | `MarketplaceListingRef` | 目录关联 |
| source_binding | `SourceBinding` | 一经登记不可换owner版本 |
| application_ref | `PublicationApplicationRef` | 对应固定审查对象 |
| decision_binding | `OptionalGovernanceDecisionBinding` | 上架必须正式有效approved |
| disposition_ref | `OptionalWithdrawalDispositionRef` | 限制/撤回依据 |
| state | `MarketVersionState` | Staged/Listed/Restricted/Withdrawn |
| revision | `MarketRevision` | 单版本序列化并发依据 |

归属：domain；该对象只承接所属U能力；domain纯同步，无ownerbody/外部approval；字段必填完整才factory，optional以生命周期约束。

#### 成员函数

| 完整签名 | 作用 | 参数来源 | 返回 / 副作用 |
|---|---|---|---|
| `pub fn list(&mut self, input: VersionAdmissionInput) -> Result<(), DomainError>` | 当前正式approved/资格才显式Listed | VersionAdmissionInput input：typed原对象/正式port qualified输入，不调用I/O | Result<(), DomainError>；只按Step10合法pair改变本对象；持久化/审计/必要work由application同UoW |
| `pub fn restrict(&mut self, input: VersionRestrictionInput) -> Result<(), DomainError>` | 正式失效或未知保守限制，非owner撤销 | VersionRestrictionInput input：typed原对象/正式port qualified输入，不调用I/O | Result<(), DomainError>；只按Step10合法pair改变本对象；持久化/审计/必要work由application同UoW |
| `pub fn withdraw(&mut self, input: VersionWithdrawalInput) -> Result<(), DomainError>` | 有据局部撤回，终态不自动复活 | VersionWithdrawalInput input：typed原对象/正式port qualified输入，不调用I/O | Result<(), DomainError>；只按Step10合法pair改变本对象；持久化/审计/必要work由application同UoW |
| `pub fn validate(&self) -> Result<(), DomainError>` | 完整字段/state不变量 | 当前本体 | 不做I/O；缺必填/binding/state错配拒绝 |

#### 工厂 / rehydrate

| 完整签名 | 必填字段来源 / 初始化 | 不变量 |
|---|---|---|
| `pub fn stage(input: MarketVersionCreationInput) -> Result<Self, DomainError>` | MarketVersionCreationInput的独立字段schema见shared_types；Staged；decision/disposition=None；revision=0 | 初始Staged，固定owner版本；qualified字段只内侧构造，factory不是approval |
| `pub fn rehydrate(row: MarketVersionRow) -> Result<Self, DomainError>` | Row与本对象逐字段同构；state/optional/revision全校验；repo读取来源 | 禁止SQL/rawbody进入domain，既有ref不能重factory以复活状态 |

#### 不变量与禁止

初始：Staged；decision/disposition=None；revision=0。binding只exacttyped比较，缺合同不fallback，state/status语义不外推。version/source_material/fixedbasis不可修改，revision镜像repo单一column；views只currentdisclosure之后构造，NotVisible/Missing/Degraded使用ReadSurface而非假填必需ref。unknown只能formal原intentprobe，终态不可任意复活。方法不得返回body/approval/payment/evidence/readiness。


### Category

```rust
/// Carries Category with explicit sources and no upstream body.
pub struct Category {
    /// Carries category_ref; see the source and invariant table.
    pub category_ref: CategoryRef,
    /// Carries label; see the source and invariant table.
    pub label: MarketCategoryLabel,
    /// Carries parent_ref; see the source and invariant table.
    pub parent_ref: OptionalCategoryRef,
    /// Carries scope_ref; see the source and invariant table.
    pub scope_ref: MarketScopeRef,
    /// Carries revision; see the source and invariant table.
    pub revision: MarketRevision,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| category_ref | `CategoryRef` | 本地ID |
| label | `MarketCategoryLabel` | 市场标签，不上游资产enum |
| parent_ref | `OptionalCategoryRef` | typed父关联 |
| scope_ref | `MarketScopeRef` | 创建formalresolved taxonomy scope；parent必须同scope，change不可跨scope搬分类 |
| revision | `MarketRevision` | 变更并发保护 |

归属：domain；该对象只承接所属U能力；domain纯同步，无ownerbody/外部approval；字段必填完整才factory，optional以生命周期约束。

#### 成员函数

| 完整签名 | 作用 | 参数来源 | 返回 / 副作用 |
|---|---|---|---|
| `pub fn change(&mut self, input: CategoryChangeInput) -> Result<(), DomainError>` | 防循环/不可见关联与标签越界 | CategoryChangeInput input：typed原对象/正式port qualified输入，不调用I/O | Result<(), DomainError>；只按Step10合法pair改变本对象；持久化/审计/必要work由application同UoW |
| `pub fn validate(&self) -> Result<(), DomainError>` | 完整字段/state不变量 | 当前本体 | 不做I/O；缺必填/binding/state错配拒绝 |

#### 工厂 / rehydrate

| 完整签名 | 必填字段来源 / 初始化 | 不变量 |
|---|---|---|
| `pub fn create(input: CategoryCreationInput) -> Result<Self, DomainError>` | CategoryCreationInput的独立字段schema见shared_types；完整copy typed输入；immutable固定不替换 | 有权taxonomy写入，非source定义；qualified字段只内侧构造，factory不是approval |
| `pub fn rehydrate(row: CategoryRow) -> Result<Self, DomainError>` | Row与本对象逐字段同构；state/optional/revision全校验；repo读取来源 | 禁止SQL/rawbody进入domain，既有ref不能重factory以复活状态 |

#### 不变量与禁止

binding只exacttyped比较，缺合同不fallback，state/status语义不外推。version/source_material/fixedbasis不可修改，revision镜像repo单一column；views只currentdisclosure之后构造，NotVisible/Missing/Degraded使用ReadSurface而非假填必需ref。unknown只能formal原intentprobe，终态不可任意复活。方法不得返回body/approval/payment/evidence/readiness。


### VersionAdmissionPolicy

```rust
/// Carries VersionAdmissionPolicy with explicit sources and no upstream body.
pub struct VersionAdmissionPolicy {
    /// Carries requirements; see the source and invariant table.
    pub requirements: VersionAdmissionRequirements,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| requirements | `VersionAdmissionRequirements` | 批准binding与正式来源需求 |

归属：domain；该对象只承接所属U能力；domain纯同步，无ownerbody/外部approval；字段必填完整才factory，optional以生命周期约束。

#### 成员函数

| 完整签名 | 作用 | 参数来源 | 返回 / 副作用 |
|---|---|---|---|
| `pub fn evaluate(&self, version: MarketVersion, basis: PublicationBasis, decision: GovernanceDecisionBinding, current: CurrentQualificationInput) -> Result<LocalGateResult, DomainError>` | 返回局部准入/拒绝，不自行决定Gov outcome | MarketVersion version；PublicationBasis basis；GovernanceDecisionBinding decision；CurrentQualificationInput current：typed原对象/正式port qualified输入，不调用I/O | Result<LocalGateResult, DomainError>；纯读取，不改变状态 |
| `pub fn validate(&self) -> Result<(), DomainError>` | 完整字段/state不变量 | 当前本体 | 不做I/O；缺必填/binding/state错配拒绝 |

#### 工厂 / rehydrate

| 完整签名 | 必填字段来源 / 初始化 | 不变量 |
|---|---|---|
| `pub fn new(requirements: VersionAdmissionRequirements) -> Result<Self, DomainError>` | formal适用规则输入，禁config豁免 | stateless guard，不新增truth |
| `pub fn rehydrate(row: VersionAdmissionPolicyRow) -> Result<Self, DomainError>` | Row与本对象逐字段同构；state/optional/revision全校验；repo读取来源 | 禁止SQL/rawbody进入domain，既有ref不能重factory以复活状态 |

#### 不变量与禁止

binding只exacttyped比较，缺合同不fallback，state/status语义不外推。version/source_material/fixedbasis不可修改，revision镜像repo单一column；views只currentdisclosure之后构造，NotVisible/Missing/Degraded使用ReadSurface而非假填必需ref。unknown只能formal原intentprobe，终态不可任意复活。方法不得返回body/approval/payment/evidence/readiness。


### CatalogReadView

```rust
/// Carries CatalogReadView with explicit sources and no upstream body.
pub struct CatalogReadView {
    /// Carries listing_ref; see the source and invariant table.
    pub listing_ref: MarketplaceListingRef,
    /// Carries version_refs; see the source and invariant table.
    pub version_refs: MarketVersionRefSet,
    /// Carries safe_metadata; see the source and invariant table.
    pub safe_metadata: MarketCatalogSafeMetadata,
    /// Carries read_context; see the source and invariant table.
    pub read_context: SafeReadContext,
    /// Carries status; see the source and invariant table.
    pub status: ReadSurfaceKind,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| listing_ref | `MarketplaceListingRef` | committed local事实 |
| version_refs | `MarketVersionRefSet` | exact版本候选不可fallback |
| safe_metadata | `MarketCatalogSafeMetadata` | 本地允许metadata+owner safe摘要 |
| read_context | `SafeReadContext` | 当前可见交集 |
| status | `ReadSurfaceKind` | empty/missing/not-visible/stale/degraded/unsupported/failed安全面 |

归属：contracts；该对象只承接所属U能力；domain纯同步，无ownerbody/外部approval；字段必填完整才factory，optional以生命周期约束。

#### 成员函数

| 完整签名 | 作用 | 参数来源 | 返回 / 副作用 |
|---|---|---|---|
| 无业务变更成员 | immutable/view不修改truth | 不适用 | 只校验/typed读 |
| `pub fn validate(&self) -> Result<(), DomainError>` | 完整字段/state不变量 | 当前本体 | 不做I/O；缺必填/binding/state错配拒绝 |

#### 工厂 / rehydrate

| 完整签名 | 必填字段来源 / 初始化 | 不变量 |
|---|---|---|
| `pub fn assemble(input: CatalogReadInput) -> Result<Self, DomainError>` | CatalogReadInput的独立字段schema见shared_types；完整copy typed输入；immutable固定不替换 | 按同scope裁剪所有字段/数量/提示；qualified字段只内侧构造，factory不是approval |
| `pub fn rehydrate(row: CatalogReadViewRow) -> Result<Self, DomainError>` | Row与本对象逐字段同构；state/optional/revision全校验；repo读取来源 | 禁止SQL/rawbody进入domain，既有ref不能重factory以复活状态 |

#### 不变量与禁止

binding只exacttyped比较，缺合同不fallback，state/status语义不外推。version/source_material/fixedbasis不可修改，revision镜像repo单一column；views只currentdisclosure之后构造，NotVisible/Missing/Degraded使用ReadSurface而非假填必需ref。unknown只能formal原intentprobe，终态不可任意复活。方法不得返回body/approval/payment/evidence/readiness。


## 模块内停审

功能均有独立对象承接；字段来源含candidate/lookup/formalport/ID/CAS；factory与typedrow完整，views与业务state分轴。当前批次结构审查通过，外部positive blocked不改变。下一模块才创建其附录；不会提前创建Step7/8文件。
