# Step8 U3 目录/市场版本协议族小循环

## 思考、诊断与取舍

本族只处理目录/市场版本，Requestbody均是候选/localintent而不是qualificationtruth。采用独立DTO与safe result/readmodel，ownerfields由Step7formalports核验；拒绝使用callerprovided Approved/Verified/Installed/Delivered。前序对象state不以UI语言改变，unsafe unknownfields拒绝。sharedsurface只统一Envelope/错误/分页，不替代本族逐协议schema。

## 定义批次表

| 协议 | 类别 | 对象 / view | port/构造 | flow |
|---|---|---|---|---|
| CreateMarketplaceListing | Command | MarketplaceListing / MarketplaceListingResult | MarketplaceListing.create / currentpublisher + categoryscope | Step9 create_marketplace_listing |
| EditMarketplaceListing | Command | MarketplaceListing / MarketplaceListingResult | MarketplaceListing.edit / currentpublisher categoryscope | Step9 edit_marketplace_listing |
| MaintainMarketCategory | Command | Category / CategoryResult | Category.create/change / explicitvariant+parent ancestry+taxonomy authority | Step9 maintain_market_category |
| RegisterMarketVersion | Command | MarketVersion / MarketVersionResult | MarketVersion.stage / exactsubmittedbasis/source | Step9 register_market_version |
| ListMarketVersion | Command | MarketVersion / MarketVersionResult | VersionAdmissionPolicy.evaluate + MarketVersion.list / formalcurrentapproved fullbinding | Step9 list_market_version |
| SearchMarketplaceCatalog | Query | ReadProjection / CatalogReadView | ProjectionStore.search_catalog / scope-first item/count/token | Step9 search_marketplace_catalog |
| GetMarketplaceListing | Query | MarketplaceListing / CatalogReadView | listing/version/source typedread，noncopiedbody | Step9 get_marketplace_listing |
| ListMarketVersions | Query | MarketVersion / MarketVersionReadItem | MarketStore.list_versions / page singlemeta | Step9 list_market_versions |
| SelectMarketVersion | Query | MarketVersion / SelectedVersionView | typedexactversion + read-only formalcurrent资格；无创建intent | Step9 select_market_version |
| ListMarketCategories | Query | Category / CategoryReadItem | MarketStore.list_categories / scope/parent current | Step9 list_market_categories |

### CreateMarketplaceListing

#### 用途与完整入口

| 项 | 契约 |
|---|---|
| 函数签名 | `pub async fn create_marketplace_listing(&self, request: CommandEnvelope<CreateMarketplaceListingRequest>) -> Result<ExecutionResult<MarketplaceListingResult>, MarketError>` |
| transport | POST /api/marketplace/v1/commands/create-marketplace-listing |
| 处理方 | MarketplaceApplication<P> / catalog_version / planned create_marketplace_listing.rs |
| caller | Web或正式scope内integration；actor由可信gateway |
| 目标能力 | MarketplaceListing.create / currentpublisher + categoryscope |

#### 请求schema与构造来源

### CreateMarketplaceListingRequest

```rust
/// Carries CreateMarketplaceListingRequest with explicit sources and no upstream body.
pub struct CreateMarketplaceListingRequest {
    /// Carries publisher_ref; see the source and invariant table.
    pub publisher_ref: PublisherRelationRef,
    /// Carries metadata; see the source and invariant table.
    pub metadata: MarketListingMetadata,
    /// Carries category_refs; see the source and invariant table.
    pub category_refs: CategoryRefSet,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| publisher_ref | `PublisherRelationRef` | 协议body明确typed候选/本地意图，owner/class/refs经formalport/currentdisclosure，非qualified断言 |
| metadata | `MarketListingMetadata` | 协议body明确typed候选/本地意图，owner/class/refs经formalport/currentdisclosure，非qualified断言 |
| category_refs | `CategoryRefSet` | 协议body明确typed候选/本地意图，owner/class/refs经formalport/currentdisclosure，非qualified断言 |

归属：contracts；publicbody不重复actor/key/trace/page/consistency；deny unknown fields/unsafe body

| DTO来源 | Domain / read / Job构造 | 缺失/错kind行为 |
|---|---|---|
| Requestbody上述完整字段 | MarketplaceListing.create / currentpublisher + categoryscope；ID由IdGeneratorPort，basis/source/material/authority原typed读取或formalport，不由bodyqualified | reject InvalidInput/Missing；unsafe/body/wrongkind拒绝；formal缺口ContractBlocked |
| actor/meta | CoreContextRecord保存唯一meta/key/actor；operationkind由本typedmethod固定；fingerprint含业务body | missingkey拒绝；samekeydiffintent IdempotencyConflict |

#### 完整输出schema

返回ExecutionResult<MarketplaceListingResult>；HTTP payload为value；Accepted本地truth≠外部成功。

### MarketplaceListingResult

```rust
/// Carries MarketplaceListingResult with explicit sources and no upstream body.
pub struct MarketplaceListingResult {
    /// Carries receipt; see the source and invariant table.
    pub receipt: CommandReceipt,
    /// Carries listing_ref; see the source and invariant table.
    pub listing_ref: MarketplaceListingRef,
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
| receipt | `CommandReceipt` | 字段来自明确请求、typed读取或正式port；缺失reject，禁止正文/字符串猜测。 |
| listing_ref | `MarketplaceListingRef` | 字段来自明确请求、typed读取或正式port；缺失reject，禁止正文/字符串猜测。 |
| metadata | `MarketListingMetadata` | 字段来自明确请求、typed读取或正式port；缺失reject，禁止正文/字符串猜测。 |
| category_refs | `CategoryRefSet` | 字段来自明确请求、typed读取或正式port；缺失reject，禁止正文/字符串猜测。 |
| revision | `MarketRevision` | 字段来自明确请求、typed读取或正式port；缺失reject，禁止正文/字符串猜测。 |

归属：contracts；字段来自明确请求、typed读取或正式port；缺失reject，禁止正文/字符串猜测。


二级传递类型authority：Step6 shared_types/runtime_helpers + Step7 typed_ports + [本Step sharedsurface](03_ddd_step_08_shared_surface.md)。复用schema为引用镜像，唯一字段定义在上述来源，不新增同名不同字段类型。receipt/report中的refs与同UoW原记录完全一致，resultkind与operationkind严核，schemaRef=V1仅本地designversion。

#### 失败、幂等与审计

currentactor/disclosure先于originalresultreplay；replay不再factory/ID/业务precheck/dispatch/scan，原完整payload返还；fresh才typedreads/currentformalqualify。 错误映射见sharedsurface；写入错误rollback，不出现ref-onlyaccepted。

单协议停审：body→目标对象/typedport→safe result→同名flow已映射；owner资格缺口不关闭；下一协议仅承接已确定结论。


### EditMarketplaceListing

#### 用途与完整入口

| 项 | 契约 |
|---|---|
| 函数签名 | `pub async fn edit_marketplace_listing(&self, request: CommandEnvelope<EditMarketplaceListingRequest>) -> Result<ExecutionResult<MarketplaceListingResult>, MarketError>` |
| transport | POST /api/marketplace/v1/commands/edit-marketplace-listing |
| 处理方 | MarketplaceApplication<P> / catalog_version / planned edit_marketplace_listing.rs |
| caller | Web或正式scope内integration；actor由可信gateway |
| 目标能力 | MarketplaceListing.edit / currentpublisher categoryscope |

#### 请求schema与构造来源

### EditMarketplaceListingRequest

```rust
/// Carries EditMarketplaceListingRequest with explicit sources and no upstream body.
pub struct EditMarketplaceListingRequest {
    /// Carries listing_ref; see the source and invariant table.
    pub listing_ref: MarketplaceListingRef,
    /// Carries expected_revision; see the source and invariant table.
    pub expected_revision: MarketRevision,
    /// Carries metadata; see the source and invariant table.
    pub metadata: MarketListingMetadata,
    /// Carries category_refs; see the source and invariant table.
    pub category_refs: CategoryRefSet,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| listing_ref | `MarketplaceListingRef` | 协议body明确typed候选/本地意图，owner/class/refs经formalport/currentdisclosure，非qualified断言 |
| expected_revision | `MarketRevision` | 客户端读面revision；fresh读取相等检查且repoCAS；replay先于业务revision重核 |
| metadata | `MarketListingMetadata` | 协议body明确typed候选/本地意图，owner/class/refs经formalport/currentdisclosure，非qualified断言 |
| category_refs | `CategoryRefSet` | 协议body明确typed候选/本地意图，owner/class/refs经formalport/currentdisclosure，非qualified断言 |

归属：contracts；publicbody不重复actor/key/trace/page/consistency；deny unknown fields/unsafe body

| DTO来源 | Domain / read / Job构造 | 缺失/错kind行为 |
|---|---|---|
| Requestbody上述完整字段 | MarketplaceListing.edit / currentpublisher categoryscope；ID由IdGeneratorPort，basis/source/material/authority原typed读取或formalport，不由bodyqualified | reject InvalidInput/Missing；unsafe/body/wrongkind拒绝；formal缺口ContractBlocked |
| actor/meta | CoreContextRecord保存唯一meta/key/actor；operationkind由本typedmethod固定；fingerprint含业务body | missingkey拒绝；samekeydiffintent IdempotencyConflict |

#### 完整输出schema

返回ExecutionResult<MarketplaceListingResult>；HTTP payload为value；Accepted本地truth≠外部成功。

### MarketplaceListingResult

```rust
/// Carries MarketplaceListingResult with explicit sources and no upstream body.
pub struct MarketplaceListingResult {
    /// Carries receipt; see the source and invariant table.
    pub receipt: CommandReceipt,
    /// Carries listing_ref; see the source and invariant table.
    pub listing_ref: MarketplaceListingRef,
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
| receipt | `CommandReceipt` | 字段来自明确请求、typed读取或正式port；缺失reject，禁止正文/字符串猜测。 |
| listing_ref | `MarketplaceListingRef` | 字段来自明确请求、typed读取或正式port；缺失reject，禁止正文/字符串猜测。 |
| metadata | `MarketListingMetadata` | 字段来自明确请求、typed读取或正式port；缺失reject，禁止正文/字符串猜测。 |
| category_refs | `CategoryRefSet` | 字段来自明确请求、typed读取或正式port；缺失reject，禁止正文/字符串猜测。 |
| revision | `MarketRevision` | 字段来自明确请求、typed读取或正式port；缺失reject，禁止正文/字符串猜测。 |

归属：contracts；字段来自明确请求、typed读取或正式port；缺失reject，禁止正文/字符串猜测。


二级传递类型authority：Step6 shared_types/runtime_helpers + Step7 typed_ports + [本Step sharedsurface](03_ddd_step_08_shared_surface.md)。复用schema为引用镜像，唯一字段定义在上述来源，不新增同名不同字段类型。receipt/report中的refs与同UoW原记录完全一致，resultkind与operationkind严核，schemaRef=V1仅本地designversion。

#### 失败、幂等与审计

currentactor/disclosure先于originalresultreplay；replay不再factory/ID/业务precheck/dispatch/scan，原完整payload返还；fresh才typedreads/currentformalqualify。 错误映射见sharedsurface；写入错误rollback，不出现ref-onlyaccepted。

单协议停审：body→目标对象/typedport→safe result→同名flow已映射；owner资格缺口不关闭；下一协议仅承接已确定结论。


### MaintainMarketCategory

#### 用途与完整入口

| 项 | 契约 |
|---|---|
| 函数签名 | `pub async fn maintain_market_category(&self, request: CommandEnvelope<MaintainMarketCategoryRequest>) -> Result<ExecutionResult<CategoryResult>, MarketError>` |
| transport | POST /api/marketplace/v1/commands/maintain-market-category |
| 处理方 | MarketplaceApplication<P> / catalog_version / planned maintain_market_category.rs |
| caller | Web或正式scope内integration；actor由可信gateway |
| 目标能力 | Category.create/change / explicitvariant+parent ancestry+taxonomy authority |

#### 请求schema与构造来源

### MaintainMarketCategoryRequest

```rust
/// Carries MaintainMarketCategoryRequest with explicit sources and no upstream body.
pub struct MaintainMarketCategoryRequest {
    /// Carries intent; see the source and invariant table.
    pub intent: CategoryMaintenanceCandidate,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| intent | `CategoryMaintenanceCandidate` | 协议body明确typed候选/本地意图，owner/class/refs经formalport/currentdisclosure，非qualified断言 |

归属：contracts；publicbody不重复actor/key/trace/page/consistency；deny unknown fields/unsafe body

| DTO来源 | Domain / read / Job构造 | 缺失/错kind行为 |
|---|---|---|
| Requestbody上述完整字段 | Category.create/change / explicitvariant+parent ancestry+taxonomy authority；ID由IdGeneratorPort，basis/source/material/authority原typed读取或formalport，不由bodyqualified | reject InvalidInput/Missing；unsafe/body/wrongkind拒绝；formal缺口ContractBlocked |
| actor/meta | CoreContextRecord保存唯一meta/key/actor；operationkind由本typedmethod固定；fingerprint含业务body | missingkey拒绝；samekeydiffintent IdempotencyConflict |

#### 完整输出schema

返回ExecutionResult<CategoryResult>；HTTP payload为value；Accepted本地truth≠外部成功。

### CategoryResult

```rust
/// Carries CategoryResult with explicit sources and no upstream body.
pub struct CategoryResult {
    /// Carries receipt; see the source and invariant table.
    pub receipt: CommandReceipt,
    /// Carries category_ref; see the source and invariant table.
    pub category_ref: CategoryRef,
    /// Carries label; see the source and invariant table.
    pub label: MarketCategoryLabel,
    /// Carries parent_ref; see the source and invariant table.
    pub parent_ref: OptionalCategoryRef,
    /// Carries revision; see the source and invariant table.
    pub revision: MarketRevision,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| receipt | `CommandReceipt` | 字段来自明确请求、typed读取或正式port；缺失reject，禁止正文/字符串猜测。 |
| category_ref | `CategoryRef` | 字段来自明确请求、typed读取或正式port；缺失reject，禁止正文/字符串猜测。 |
| label | `MarketCategoryLabel` | 字段来自明确请求、typed读取或正式port；缺失reject，禁止正文/字符串猜测。 |
| parent_ref | `OptionalCategoryRef` | 字段来自明确请求、typed读取或正式port；缺失reject，禁止正文/字符串猜测。 |
| revision | `MarketRevision` | 字段来自明确请求、typed读取或正式port；缺失reject，禁止正文/字符串猜测。 |

归属：contracts；字段来自明确请求、typed读取或正式port；缺失reject，禁止正文/字符串猜测。


二级传递类型authority：Step6 shared_types/runtime_helpers + Step7 typed_ports + [本Step sharedsurface](03_ddd_step_08_shared_surface.md)。复用schema为引用镜像，唯一字段定义在上述来源，不新增同名不同字段类型。receipt/report中的refs与同UoW原记录完全一致，resultkind与operationkind严核，schemaRef=V1仅本地designversion。

#### 失败、幂等与审计

currentactor/disclosure先于originalresultreplay；replay不再factory/ID/业务precheck/dispatch/scan，原完整payload返还；fresh才typedreads/currentformalqualify。 错误映射见sharedsurface；写入错误rollback，不出现ref-onlyaccepted。

单协议停审：body→目标对象/typedport→safe result→同名flow已映射；owner资格缺口不关闭；下一协议仅承接已确定结论。


### RegisterMarketVersion

#### 用途与完整入口

| 项 | 契约 |
|---|---|
| 函数签名 | `pub async fn register_market_version(&self, request: CommandEnvelope<RegisterMarketVersionRequest>) -> Result<ExecutionResult<MarketVersionResult>, MarketError>` |
| transport | POST /api/marketplace/v1/commands/register-market-version |
| 处理方 | MarketplaceApplication<P> / catalog_version / planned register_market_version.rs |
| caller | Web或正式scope内integration；actor由可信gateway |
| 目标能力 | MarketVersion.stage / exactsubmittedbasis/source |

#### 请求schema与构造来源

### RegisterMarketVersionRequest

```rust
/// Carries RegisterMarketVersionRequest with explicit sources and no upstream body.
pub struct RegisterMarketVersionRequest {
    /// Carries listing_ref; see the source and invariant table.
    pub listing_ref: MarketplaceListingRef,
    /// Carries application_ref; see the source and invariant table.
    pub application_ref: PublicationApplicationRef,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| listing_ref | `MarketplaceListingRef` | 协议body明确typed候选/本地意图，owner/class/refs经formalport/currentdisclosure，非qualified断言 |
| application_ref | `PublicationApplicationRef` | 协议body明确typed候选/本地意图，owner/class/refs经formalport/currentdisclosure，非qualified断言 |

归属：contracts；publicbody不重复actor/key/trace/page/consistency；deny unknown fields/unsafe body

| DTO来源 | Domain / read / Job构造 | 缺失/错kind行为 |
|---|---|---|
| Requestbody上述完整字段 | MarketVersion.stage / exactsubmittedbasis/source；ID由IdGeneratorPort，basis/source/material/authority原typed读取或formalport，不由bodyqualified | reject InvalidInput/Missing；unsafe/body/wrongkind拒绝；formal缺口ContractBlocked |
| actor/meta | CoreContextRecord保存唯一meta/key/actor；operationkind由本typedmethod固定；fingerprint含业务body | missingkey拒绝；samekeydiffintent IdempotencyConflict |

#### 完整输出schema

返回ExecutionResult<MarketVersionResult>；HTTP payload为value；Accepted本地truth≠外部成功。

### MarketVersionResult

```rust
/// Carries MarketVersionResult with explicit sources and no upstream body.
pub struct MarketVersionResult {
    /// Carries receipt; see the source and invariant table.
    pub receipt: CommandReceipt,
    /// Carries version_ref; see the source and invariant table.
    pub version_ref: MarketVersionRef,
    /// Carries listing_ref; see the source and invariant table.
    pub listing_ref: MarketplaceListingRef,
    /// Carries source_binding; see the source and invariant table.
    pub source_binding: SourceBinding,
    /// Carries application_ref; see the source and invariant table.
    pub application_ref: PublicationApplicationRef,
    /// Carries state; see the source and invariant table.
    pub state: MarketVersionState,
    /// Carries decision_binding; see the source and invariant table.
    pub decision_binding: OptionalGovernanceDecisionBinding,
    /// Carries disposition_ref; see the source and invariant table.
    pub disposition_ref: OptionalWithdrawalDispositionRef,
    /// Carries revision; see the source and invariant table.
    pub revision: MarketRevision,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| receipt | `CommandReceipt` | 字段来自明确请求、typed读取或正式port；缺失reject，禁止正文/字符串猜测。 |
| version_ref | `MarketVersionRef` | 字段来自明确请求、typed读取或正式port；缺失reject，禁止正文/字符串猜测。 |
| listing_ref | `MarketplaceListingRef` | 字段来自明确请求、typed读取或正式port；缺失reject，禁止正文/字符串猜测。 |
| source_binding | `SourceBinding` | 字段来自明确请求、typed读取或正式port；缺失reject，禁止正文/字符串猜测。 |
| application_ref | `PublicationApplicationRef` | 字段来自明确请求、typed读取或正式port；缺失reject，禁止正文/字符串猜测。 |
| state | `MarketVersionState` | 字段来自明确请求、typed读取或正式port；缺失reject，禁止正文/字符串猜测。 |
| decision_binding | `OptionalGovernanceDecisionBinding` | 字段来自明确请求、typed读取或正式port；缺失reject，禁止正文/字符串猜测。 |
| disposition_ref | `OptionalWithdrawalDispositionRef` | 字段来自明确请求、typed读取或正式port；缺失reject，禁止正文/字符串猜测。 |
| revision | `MarketRevision` | 字段来自明确请求、typed读取或正式port；缺失reject，禁止正文/字符串猜测。 |

归属：contracts；字段来自明确请求、typed读取或正式port；缺失reject，禁止正文/字符串猜测。


二级传递类型authority：Step6 shared_types/runtime_helpers + Step7 typed_ports + [本Step sharedsurface](03_ddd_step_08_shared_surface.md)。复用schema为引用镜像，唯一字段定义在上述来源，不新增同名不同字段类型。receipt/report中的refs与同UoW原记录完全一致，resultkind与operationkind严核，schemaRef=V1仅本地designversion。

#### 失败、幂等与审计

currentactor/disclosure先于originalresultreplay；replay不再factory/ID/业务precheck/dispatch/scan，原完整payload返还；fresh才typedreads/currentformalqualify。 错误映射见sharedsurface；写入错误rollback，不出现ref-onlyaccepted。

单协议停审：body→目标对象/typedport→safe result→同名flow已映射；owner资格缺口不关闭；下一协议仅承接已确定结论。


### ListMarketVersion

#### 用途与完整入口

| 项 | 契约 |
|---|---|
| 函数签名 | `pub async fn list_market_version(&self, request: CommandEnvelope<ListMarketVersionRequest>) -> Result<ExecutionResult<MarketVersionResult>, MarketError>` |
| transport | POST /api/marketplace/v1/commands/list-market-version |
| 处理方 | MarketplaceApplication<P> / catalog_version / planned list_market_version.rs |
| caller | Web或正式scope内integration；actor由可信gateway |
| 目标能力 | VersionAdmissionPolicy.evaluate + MarketVersion.list / formalcurrentapproved fullbinding |

#### 请求schema与构造来源

### ListMarketVersionRequest

```rust
/// Carries ListMarketVersionRequest with explicit sources and no upstream body.
pub struct ListMarketVersionRequest {
    /// Carries version_ref; see the source and invariant table.
    pub version_ref: MarketVersionRef,
    /// Carries expected_revision; see the source and invariant table.
    pub expected_revision: MarketRevision,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| version_ref | `MarketVersionRef` | 协议body明确typed候选/本地意图，owner/class/refs经formalport/currentdisclosure，非qualified断言 |
| expected_revision | `MarketRevision` | 客户端读面revision；fresh读取相等检查且repoCAS；replay先于业务revision重核 |

归属：contracts；publicbody不重复actor/key/trace/page/consistency；deny unknown fields/unsafe body

| DTO来源 | Domain / read / Job构造 | 缺失/错kind行为 |
|---|---|---|
| Requestbody上述完整字段 | VersionAdmissionPolicy.evaluate + MarketVersion.list / formalcurrentapproved fullbinding；ID由IdGeneratorPort，basis/source/material/authority原typed读取或formalport，不由bodyqualified | reject InvalidInput/Missing；unsafe/body/wrongkind拒绝；formal缺口ContractBlocked |
| actor/meta | CoreContextRecord保存唯一meta/key/actor；operationkind由本typedmethod固定；fingerprint含业务body | missingkey拒绝；samekeydiffintent IdempotencyConflict |

#### 完整输出schema

返回ExecutionResult<MarketVersionResult>；HTTP payload为value；Accepted本地truth≠外部成功。

### MarketVersionResult

```rust
/// Carries MarketVersionResult with explicit sources and no upstream body.
pub struct MarketVersionResult {
    /// Carries receipt; see the source and invariant table.
    pub receipt: CommandReceipt,
    /// Carries version_ref; see the source and invariant table.
    pub version_ref: MarketVersionRef,
    /// Carries listing_ref; see the source and invariant table.
    pub listing_ref: MarketplaceListingRef,
    /// Carries source_binding; see the source and invariant table.
    pub source_binding: SourceBinding,
    /// Carries application_ref; see the source and invariant table.
    pub application_ref: PublicationApplicationRef,
    /// Carries state; see the source and invariant table.
    pub state: MarketVersionState,
    /// Carries decision_binding; see the source and invariant table.
    pub decision_binding: OptionalGovernanceDecisionBinding,
    /// Carries disposition_ref; see the source and invariant table.
    pub disposition_ref: OptionalWithdrawalDispositionRef,
    /// Carries revision; see the source and invariant table.
    pub revision: MarketRevision,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| receipt | `CommandReceipt` | 字段来自明确请求、typed读取或正式port；缺失reject，禁止正文/字符串猜测。 |
| version_ref | `MarketVersionRef` | 字段来自明确请求、typed读取或正式port；缺失reject，禁止正文/字符串猜测。 |
| listing_ref | `MarketplaceListingRef` | 字段来自明确请求、typed读取或正式port；缺失reject，禁止正文/字符串猜测。 |
| source_binding | `SourceBinding` | 字段来自明确请求、typed读取或正式port；缺失reject，禁止正文/字符串猜测。 |
| application_ref | `PublicationApplicationRef` | 字段来自明确请求、typed读取或正式port；缺失reject，禁止正文/字符串猜测。 |
| state | `MarketVersionState` | 字段来自明确请求、typed读取或正式port；缺失reject，禁止正文/字符串猜测。 |
| decision_binding | `OptionalGovernanceDecisionBinding` | 字段来自明确请求、typed读取或正式port；缺失reject，禁止正文/字符串猜测。 |
| disposition_ref | `OptionalWithdrawalDispositionRef` | 字段来自明确请求、typed读取或正式port；缺失reject，禁止正文/字符串猜测。 |
| revision | `MarketRevision` | 字段来自明确请求、typed读取或正式port；缺失reject，禁止正文/字符串猜测。 |

归属：contracts；字段来自明确请求、typed读取或正式port；缺失reject，禁止正文/字符串猜测。


二级传递类型authority：Step6 shared_types/runtime_helpers + Step7 typed_ports + [本Step sharedsurface](03_ddd_step_08_shared_surface.md)。复用schema为引用镜像，唯一字段定义在上述来源，不新增同名不同字段类型。receipt/report中的refs与同UoW原记录完全一致，resultkind与operationkind严核，schemaRef=V1仅本地designversion。

#### 失败、幂等与审计

currentactor/disclosure先于originalresultreplay；replay不再factory/ID/业务precheck/dispatch/scan，原完整payload返还；fresh才typedreads/currentformalqualify。 错误映射见sharedsurface；写入错误rollback，不出现ref-onlyaccepted。

单协议停审：body→目标对象/typedport→safe result→同名flow已映射；owner资格缺口不关闭；下一协议仅承接已确定结论。


### SearchMarketplaceCatalog

#### 用途与完整入口

| 项 | 契约 |
|---|---|
| 函数签名 | `pub async fn search_marketplace_catalog(&self, request: QueryEnvelope<SearchMarketplaceCatalogRequest>) -> Result<ReadSurface<CatalogReadView>, MarketError>` |
| transport | POST /api/marketplace/v1/queries/search-marketplace-catalog |
| 处理方 | MarketplaceApplication<P> / catalog_version / planned search_marketplace_catalog.rs |
| caller | Web或正式scope内integration；actor由可信gateway |
| 目标能力 | ProjectionStore.search_catalog / scope-first item/count/token |

#### 请求schema与构造来源

### SearchMarketplaceCatalogRequest

```rust
/// Carries SearchMarketplaceCatalogRequest with explicit sources and no upstream body.
pub struct SearchMarketplaceCatalogRequest {
    /// Carries filter; see the source and invariant table.
    pub filter: CatalogSearchInput,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| filter | `CatalogSearchInput` | 协议body明确typed候选/本地意图，owner/class/refs经formalport/currentdisclosure，非qualified断言 |

归属：contracts；publicbody不重复actor/key/trace/page/consistency；deny unknown fields/unsafe body

| DTO来源 | Domain / read / Job构造 | 缺失/错kind行为 |
|---|---|---|
| Requestbody上述完整字段 | ProjectionStore.search_catalog / scope-first item/count/token；ID由IdGeneratorPort，basis/source/material/authority原typed读取或formalport，不由bodyqualified | reject InvalidInput/Missing；unsafe/body/wrongkind拒绝；formal缺口ContractBlocked |
| actor/meta | currentScope + CoreQueryMetadata.page/consistency唯一；不写ContextRecord | 读取失败typedDegraded；不reserve |

#### 完整输出schema

返回ReadSurface<CatalogReadView>，Ready QualifiedPage.items为本类型的typedreadmodel；Empty/NotVisible/Missing/Degraded独立安全分支，无requiredID假填。

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


二级传递类型authority：Step6 shared_types/runtime_helpers + Step7 typed_ports + [本Step sharedsurface](03_ddd_step_08_shared_surface.md)。复用schema为引用镜像，唯一字段定义在上述来源，不新增同名不同字段类型。typedentity→readmodel每同名字段逐字段copy，status由currentReadSurface而不是owner approval；scope/page/token不重复。

#### 失败、幂等与审计

no-write：所有save/append/reserve/refresh/rebuild/dispatch/ID/Clock为零；当前scope先于typed读，数量/提示/详情/分页同一visibility交集。 错误映射见sharedsurface；写入错误rollback，不出现ref-onlyaccepted。

单协议停审：body→目标对象/typedport→safe result→同名flow已映射；owner资格缺口不关闭；下一协议仅承接已确定结论。


### GetMarketplaceListing

#### 用途与完整入口

| 项 | 契约 |
|---|---|
| 函数签名 | `pub async fn get_marketplace_listing(&self, request: QueryEnvelope<GetMarketplaceListingRequest>) -> Result<ReadSurface<CatalogReadView>, MarketError>` |
| transport | POST /api/marketplace/v1/queries/get-marketplace-listing |
| 处理方 | MarketplaceApplication<P> / catalog_version / planned get_marketplace_listing.rs |
| caller | Web或正式scope内integration；actor由可信gateway |
| 目标能力 | listing/version/source typedread，noncopiedbody |

#### 请求schema与构造来源

### GetMarketplaceListingRequest

```rust
/// Carries GetMarketplaceListingRequest with explicit sources and no upstream body.
pub struct GetMarketplaceListingRequest {
    /// Carries listing_ref; see the source and invariant table.
    pub listing_ref: MarketplaceListingRef,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| listing_ref | `MarketplaceListingRef` | 协议body明确typed候选/本地意图，owner/class/refs经formalport/currentdisclosure，非qualified断言 |

归属：contracts；publicbody不重复actor/key/trace/page/consistency；deny unknown fields/unsafe body

| DTO来源 | Domain / read / Job构造 | 缺失/错kind行为 |
|---|---|---|
| Requestbody上述完整字段 | listing/version/source typedread，noncopiedbody；ID由IdGeneratorPort，basis/source/material/authority原typed读取或formalport，不由bodyqualified | reject InvalidInput/Missing；unsafe/body/wrongkind拒绝；formal缺口ContractBlocked |
| actor/meta | currentScope + CoreQueryMetadata.page/consistency唯一；不写ContextRecord | 读取失败typedDegraded；不reserve |

#### 完整输出schema

返回ReadSurface<CatalogReadView>，Ready QualifiedPage.items为本类型的typedreadmodel；Empty/NotVisible/Missing/Degraded独立安全分支，无requiredID假填。

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


二级传递类型authority：Step6 shared_types/runtime_helpers + Step7 typed_ports + [本Step sharedsurface](03_ddd_step_08_shared_surface.md)。复用schema为引用镜像，唯一字段定义在上述来源，不新增同名不同字段类型。typedentity→readmodel每同名字段逐字段copy，status由currentReadSurface而不是owner approval；scope/page/token不重复。

#### 失败、幂等与审计

no-write：所有save/append/reserve/refresh/rebuild/dispatch/ID/Clock为零；当前scope先于typed读，数量/提示/详情/分页同一visibility交集。 错误映射见sharedsurface；写入错误rollback，不出现ref-onlyaccepted。

单协议停审：body→目标对象/typedport→safe result→同名flow已映射；owner资格缺口不关闭；下一协议仅承接已确定结论。


### ListMarketVersions

#### 用途与完整入口

| 项 | 契约 |
|---|---|
| 函数签名 | `pub async fn list_market_versions(&self, request: QueryEnvelope<ListMarketVersionsRequest>) -> Result<ReadSurface<MarketVersionReadItem>, MarketError>` |
| transport | POST /api/marketplace/v1/queries/list-market-versions |
| 处理方 | MarketplaceApplication<P> / catalog_version / planned list_market_versions.rs |
| caller | Web或正式scope内integration；actor由可信gateway |
| 目标能力 | MarketStore.list_versions / page singlemeta |

#### 请求schema与构造来源

### ListMarketVersionsRequest

```rust
/// Carries ListMarketVersionsRequest with explicit sources and no upstream body.
pub struct ListMarketVersionsRequest {
    /// Carries listing_ref; see the source and invariant table.
    pub listing_ref: MarketplaceListingRef,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| listing_ref | `MarketplaceListingRef` | 协议body明确typed候选/本地意图，owner/class/refs经formalport/currentdisclosure，非qualified断言 |

归属：contracts；publicbody不重复actor/key/trace/page/consistency；deny unknown fields/unsafe body

| DTO来源 | Domain / read / Job构造 | 缺失/错kind行为 |
|---|---|---|
| Requestbody上述完整字段 | MarketStore.list_versions / page singlemeta；ID由IdGeneratorPort，basis/source/material/authority原typed读取或formalport，不由bodyqualified | reject InvalidInput/Missing；unsafe/body/wrongkind拒绝；formal缺口ContractBlocked |
| actor/meta | currentScope + CoreQueryMetadata.page/consistency唯一；不写ContextRecord | 读取失败typedDegraded；不reserve |

#### 完整输出schema

返回ReadSurface<MarketVersionReadItem>，Ready QualifiedPage.items为本类型的typedreadmodel；Empty/NotVisible/Missing/Degraded独立安全分支，无requiredID假填。

### MarketVersionReadItem

```rust
/// Carries MarketVersionReadItem with explicit sources and no upstream body.
pub struct MarketVersionReadItem {
    /// Carries version_ref; see the source and invariant table.
    pub version_ref: MarketVersionRef,
    /// Carries listing_ref; see the source and invariant table.
    pub listing_ref: MarketplaceListingRef,
    /// Carries source_binding; see the source and invariant table.
    pub source_binding: SourceBinding,
    /// Carries application_ref; see the source and invariant table.
    pub application_ref: PublicationApplicationRef,
    /// Carries state; see the source and invariant table.
    pub state: MarketVersionState,
    /// Carries decision_binding; see the source and invariant table.
    pub decision_binding: OptionalGovernanceDecisionBinding,
    /// Carries disposition_ref; see the source and invariant table.
    pub disposition_ref: OptionalWithdrawalDispositionRef,
    /// Carries revision; see the source and invariant table.
    pub revision: MarketRevision,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| version_ref | `MarketVersionRef` | 字段来自明确请求、typed读取或正式port；缺失reject，禁止正文/字符串猜测。 |
| listing_ref | `MarketplaceListingRef` | 字段来自明确请求、typed读取或正式port；缺失reject，禁止正文/字符串猜测。 |
| source_binding | `SourceBinding` | 字段来自明确请求、typed读取或正式port；缺失reject，禁止正文/字符串猜测。 |
| application_ref | `PublicationApplicationRef` | 字段来自明确请求、typed读取或正式port；缺失reject，禁止正文/字符串猜测。 |
| state | `MarketVersionState` | 字段来自明确请求、typed读取或正式port；缺失reject，禁止正文/字符串猜测。 |
| decision_binding | `OptionalGovernanceDecisionBinding` | 字段来自明确请求、typed读取或正式port；缺失reject，禁止正文/字符串猜测。 |
| disposition_ref | `OptionalWithdrawalDispositionRef` | 字段来自明确请求、typed读取或正式port；缺失reject，禁止正文/字符串猜测。 |
| revision | `MarketRevision` | 字段来自明确请求、typed读取或正式port；缺失reject，禁止正文/字符串猜测。 |

归属：contracts；字段来自明确请求、typed读取或正式port；缺失reject，禁止正文/字符串猜测。


二级传递类型authority：Step6 shared_types/runtime_helpers + Step7 typed_ports + [本Step sharedsurface](03_ddd_step_08_shared_surface.md)。复用schema为引用镜像，唯一字段定义在上述来源，不新增同名不同字段类型。typedentity→readmodel每同名字段逐字段copy，status由currentReadSurface而不是owner approval；scope/page/token不重复。

#### 失败、幂等与审计

no-write：所有save/append/reserve/refresh/rebuild/dispatch/ID/Clock为零；当前scope先于typed读，数量/提示/详情/分页同一visibility交集。 错误映射见sharedsurface；写入错误rollback，不出现ref-onlyaccepted。

单协议停审：body→目标对象/typedport→safe result→同名flow已映射；owner资格缺口不关闭；下一协议仅承接已确定结论。


### SelectMarketVersion

#### 用途与完整入口

| 项 | 契约 |
|---|---|
| 函数签名 | `pub async fn select_market_version(&self, request: QueryEnvelope<SelectMarketVersionRequest>) -> Result<ReadSurface<SelectedVersionView>, MarketError>` |
| transport | POST /api/marketplace/v1/queries/select-market-version |
| 处理方 | MarketplaceApplication<P> / catalog_version / planned select_market_version.rs |
| caller | Web或正式scope内integration；actor由可信gateway |
| 目标能力 | typedexactversion + read-only formalcurrent资格；无创建intent |

#### 请求schema与构造来源

### SelectMarketVersionRequest

```rust
/// Carries SelectMarketVersionRequest with explicit sources and no upstream body.
pub struct SelectMarketVersionRequest {
    /// Carries version_ref; see the source and invariant table.
    pub version_ref: MarketVersionRef,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| version_ref | `MarketVersionRef` | 协议body明确typed候选/本地意图，owner/class/refs经formalport/currentdisclosure，非qualified断言 |

归属：contracts；publicbody不重复actor/key/trace/page/consistency；deny unknown fields/unsafe body

| DTO来源 | Domain / read / Job构造 | 缺失/错kind行为 |
|---|---|---|
| Requestbody上述完整字段 | typedexactversion + read-only formalcurrent资格；无创建intent；ID由IdGeneratorPort，basis/source/material/authority原typed读取或formalport，不由bodyqualified | reject InvalidInput/Missing；unsafe/body/wrongkind拒绝；formal缺口ContractBlocked |
| actor/meta | currentScope + CoreQueryMetadata.page/consistency唯一；不写ContextRecord | 读取失败typedDegraded；不reserve |

#### 完整输出schema

返回ReadSurface<SelectedVersionView>，Ready QualifiedPage.items为本类型的typedreadmodel；Empty/NotVisible/Missing/Degraded独立安全分支，无requiredID假填。

### SelectedVersionView

```rust
/// Carries SelectedVersionView with explicit sources and no upstream body.
pub struct SelectedVersionView {
    /// Carries version; see the source and invariant table.
    pub version: MarketVersionReadItem,
    /// Carries eligible; see the source and invariant table.
    pub eligible: bool,
    /// Carries basis_refs; see the source and invariant table.
    pub basis_refs: SafeBasisReferenceSet,
    /// Carries failure_ref; see the source and invariant table.
    pub failure_ref: OptionalSafeFailureRef,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| version | `MarketVersionReadItem` | exactversion选择只read，formalcurrentgate有可见依据才eligibletrue，不隐式latest/intent |
| eligible | `bool` | exactversion选择只read，formalcurrentgate有可见依据才eligibletrue，不隐式latest/intent |
| basis_refs | `SafeBasisReferenceSet` | exactversion选择只read，formalcurrentgate有可见依据才eligibletrue，不隐式latest/intent |
| failure_ref | `OptionalSafeFailureRef` | exactversion选择只read，formalcurrentgate有可见依据才eligibletrue，不隐式latest/intent |

归属：contracts；exactversion选择只read，formalcurrentgate有可见依据才eligibletrue，不隐式latest/intent


二级传递类型authority：Step6 shared_types/runtime_helpers + Step7 typed_ports + [本Step sharedsurface](03_ddd_step_08_shared_surface.md)。复用schema为引用镜像，唯一字段定义在上述来源，不新增同名不同字段类型。typedentity→readmodel每同名字段逐字段copy，status由currentReadSurface而不是owner approval；scope/page/token不重复。

#### 失败、幂等与审计

no-write：所有save/append/reserve/refresh/rebuild/dispatch/ID/Clock为零；当前scope先于typed读，数量/提示/详情/分页同一visibility交集。 错误映射见sharedsurface；写入错误rollback，不出现ref-onlyaccepted。

单协议停审：body→目标对象/typedport→safe result→同名flow已映射；owner资格缺口不关闭；下一协议仅承接已确定结论。


### ListMarketCategories

#### 用途与完整入口

| 项 | 契约 |
|---|---|
| 函数签名 | `pub async fn list_market_categories(&self, request: QueryEnvelope<ListMarketCategoriesRequest>) -> Result<ReadSurface<CategoryReadItem>, MarketError>` |
| transport | POST /api/marketplace/v1/queries/list-market-categories |
| 处理方 | MarketplaceApplication<P> / catalog_version / planned list_market_categories.rs |
| caller | Web或正式scope内integration；actor由可信gateway |
| 目标能力 | MarketStore.list_categories / scope/parent current |

#### 请求schema与构造来源

### ListMarketCategoriesRequest

```rust
/// Carries ListMarketCategoriesRequest with explicit sources and no upstream body.
pub struct ListMarketCategoriesRequest {
    /// Carries filter; see the source and invariant table.
    pub filter: CategoryReadInput,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| filter | `CategoryReadInput` | 协议body明确typed候选/本地意图，owner/class/refs经formalport/currentdisclosure，非qualified断言 |

归属：contracts；publicbody不重复actor/key/trace/page/consistency；deny unknown fields/unsafe body

| DTO来源 | Domain / read / Job构造 | 缺失/错kind行为 |
|---|---|---|
| Requestbody上述完整字段 | MarketStore.list_categories / scope/parent current；ID由IdGeneratorPort，basis/source/material/authority原typed读取或formalport，不由bodyqualified | reject InvalidInput/Missing；unsafe/body/wrongkind拒绝；formal缺口ContractBlocked |
| actor/meta | currentScope + CoreQueryMetadata.page/consistency唯一；不写ContextRecord | 读取失败typedDegraded；不reserve |

#### 完整输出schema

返回ReadSurface<CategoryReadItem>，Ready QualifiedPage.items为本类型的typedreadmodel；Empty/NotVisible/Missing/Degraded独立安全分支，无requiredID假填。

### CategoryReadItem

```rust
/// Carries CategoryReadItem with explicit sources and no upstream body.
pub struct CategoryReadItem {
    /// Carries category_ref; see the source and invariant table.
    pub category_ref: CategoryRef,
    /// Carries label; see the source and invariant table.
    pub label: MarketCategoryLabel,
    /// Carries parent_ref; see the source and invariant table.
    pub parent_ref: OptionalCategoryRef,
    /// Carries revision; see the source and invariant table.
    pub revision: MarketRevision,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| category_ref | `CategoryRef` | 字段来自明确请求、typed读取或正式port；缺失reject，禁止正文/字符串猜测。 |
| label | `MarketCategoryLabel` | 字段来自明确请求、typed读取或正式port；缺失reject，禁止正文/字符串猜测。 |
| parent_ref | `OptionalCategoryRef` | 字段来自明确请求、typed读取或正式port；缺失reject，禁止正文/字符串猜测。 |
| revision | `MarketRevision` | 字段来自明确请求、typed读取或正式port；缺失reject，禁止正文/字符串猜测。 |

归属：contracts；字段来自明确请求、typed读取或正式port；缺失reject，禁止正文/字符串猜测。


二级传递类型authority：Step6 shared_types/runtime_helpers + Step7 typed_ports + [本Step sharedsurface](03_ddd_step_08_shared_surface.md)。复用schema为引用镜像，唯一字段定义在上述来源，不新增同名不同字段类型。typedentity→readmodel每同名字段逐字段copy，status由currentReadSurface而不是owner approval；scope/page/token不重复。

#### 失败、幂等与审计

no-write：所有save/append/reserve/refresh/rebuild/dispatch/ID/Clock为零；当前scope先于typed读，数量/提示/详情/分页同一visibility交集。 错误映射见sharedsurface；写入错误rollback，不出现ref-onlyaccepted。

单协议停审：body→目标对象/typedport→safe result→同名flow已映射；owner资格缺口不关闭；下一协议仅承接已确定结论。


## 协议族停审

本族所有DTO字段有source/missing规则，response二级types唯一归属，Coremeta/actor/key/page无双承载；无activeevent/ownertruth复制；下一族方可创建。外部exact资格保持blocked，不宣称运行测试通过。


## Step9反向闭环修正

GetMarketplaceListing使用Coremeta.page控制version_refs当前页，PageInfo.next_token标明后续，不称全部版本。Listed谓词必须在repository中先于分页/count/token统一应用。
