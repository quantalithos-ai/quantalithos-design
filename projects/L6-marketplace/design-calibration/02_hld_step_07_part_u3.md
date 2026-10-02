# Step7 U3 接口小循环

## 问题、诊断与取舍

五个command各有独立flow。MaintainCategory输入显式Create/Change，缺目标不自动创建；Catalogue五query安全边界不同，Step8分别画。U3只有市场truth，ReviewBinding来自U2不直接审核。

计划：入口分类→对象反查→typed骨架→flow/state反查→回填→停审；当前表尚未写入。

## 结构化接口与回填

### Command

| API | 输入骨架 | 输出骨架 | 主要处理 | 写入结果 |
|---|---|---|---|---|
| CreateMarketplaceListing | ListingCreationInput input；ActorContext actor；CommandMetadata meta（key唯一meta.request） | MarketplaceListingResult | publisher/scope编辑授权；MarketplaceListing.create(ListingCreationInput input) | MarketplaceListing + audit/result |
| EditMarketplaceListing | MarketplaceListingRef listing_ref；ListingMetadataInput input；ActorContext actor；CommandMetadata meta（key唯一meta.request） | MarketplaceListingResult | typed读取listing与分类，核验scope；MarketplaceListing.edit(ListingMetadataInput input) | 市场metadata/categoryrefs revision |
| MaintainMarketCategory | CategoryMaintenanceInput input（Create/Change明确意图）；ActorContext actor；CommandMetadata meta（key唯一meta.request） | CategoryResult | 正式taxonomy维护权限，Create不复用已有ID，Change必须typed读取revision；Category.create(CategoryCreationInput input)或change(CategoryChangeInput input) | Category + audit/result |
| RegisterMarketVersion | MarketVersionCreationInput input；ActorContext actor；CommandMetadata meta（key唯一meta.request） | MarketVersionResult | 核验listing/申请固定basis/sourcebinding相同；MarketVersion.stage(MarketVersionCreationInput input) | Staged MarketVersion + audit/result |
| ListMarketVersion | MarketVersionRef version_ref；VersionAdmissionInput input；ActorContext actor；CommandMetadata meta（key唯一meta.request） | MarketVersionResult | 当前source/publisher/material/Govapproved全binding核验；同版本序列化，拒绝Withdrawn或stale revision；MarketVersion.list(VersionAdmissionInput input) | Listed版本 + immutabledecision关联 + audit/result/派生责任 |

### Query

| API | 输入骨架 | 输出骨架 | 读取来源 | 边界 |
|---|---|---|---|---|
| SearchMarketplaceCatalog | CatalogSearchInput input（keyword/type/category/tag/page）；ActorContext actor；QueryMetadata meta | CatalogReadViewPage | U7 Catalog投影 + current scope/visibility | 索引不足degraded，不泄漏隐藏数量 |
| GetMarketplaceListing | MarketplaceListingRef listing_ref；ActorContext actor；QueryMetadata meta | CatalogReadView | listing/marketversions+owner safe切片 | 禁止body/虚构评分预览 |
| ListMarketVersions | MarketplaceListingRef listing_ref；MarketPageInput page；ActorContext actor；QueryMetadata meta | MarketVersionReadPage | typed版本列表+safe binding | 不把ownerlatest改市场绑定 |
| SelectMarketVersion | MarketVersionRef version_ref；ActorContext actor；QueryMetadata meta | SelectedVersionView | exact MarketVersion + current来源/决定读取 | 仅只读选择资格，不受理获取 |
| ListMarketCategories | CategoryReadInput input；MarketPageInput page；ActorContext actor；QueryMetadata meta | CategoryReadPage | Category+scope安全关联 | 不返隐藏listing总数 |

### Job

本部分无该类active入口。


## 自检与停审

对象/函数来源均已在Step6；command metadata唯一，query只读；job是worker-internal formal surface，其key由本地worker wrapper唯一提供而非复制Core command字段。没有activeevent/假schema；本部分接口逐个对应Step8flow和Step9trigger。正式§7摘录表与边界。U3 internal stop_review/pass。
