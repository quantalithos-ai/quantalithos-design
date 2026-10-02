# Step8 U3 独立处理流

## 问题、诊断与取舍

U3分类Create/Change明确、版本exact/初始Staged；List需要currentapproved全binding与versionserialization；count/suggest在可见裁剪之后，不全库计数。

计划：逐接口输入/归属→读写/owner接缝→独立diagram→typed参数/结果→coverage/回填→停审；当前图尚未写入。

## 结构化flow与回填

#### CreateMarketplaceListing 处理流

```text
[ Current actor / scope / typed intent ]
        |
        v
[ Reserve canonical operation (short local transaction) ]
        |
        v
[ Duplicate -> typed stored original result; conflict -> reject ]
        |
        v
[ New intent -> typed load + qualified owner prechecks ]
        |
        v
[ Publisher scope + market metadata only ]
        |
        v
[ Create listing shell; no market version automatically Listed ]
        |
        v
[ Short local UoW: revision + owning guard (admission only when required) ]
        |
        v
[ Changed facts + safe audit + complete result + required durable work ]
        |
        v
[ Commit -> local accepted (not external success) ]
```

- 主要处理：publisher/scope编辑授权；MarketplaceListing.create(ListingCreationInput input)。
- 归属/保存：U3；MarketplaceListing + audit/result。accepted及完整原result/audit/必要durable责任同local UoW，ownereffect不跨事务；各rejected/blocked/unknown有安全来源。
- 禁止/03交接：目录壳无可获取版本；完整DTO→domain字段、typed get/save、revision/fence/错误与报告逐item由03闭合，fake/durable同语义。

#### EditMarketplaceListing 处理流

```text
[ Current actor / scope / typed intent ]
        |
        v
[ Reserve canonical operation (short local transaction) ]
        |
        v
[ Duplicate -> typed stored original result; conflict -> reject ]
        |
        v
[ New intent -> typed load + qualified owner prechecks ]
        |
        v
[ Typed listing + category refs + current revision ]
        |
        v
[ Edit market metadata; keep immutable source / review bindings ]
        |
        v
[ Short local UoW: revision + owning guard (admission only when required) ]
        |
        v
[ Changed facts + safe audit + complete result + required durable work ]
        |
        v
[ Commit -> local accepted (not external success) ]
```

- 主要处理：typed读取listing与分类，核验scope；MarketplaceListing.edit(ListingMetadataInput input)。
- 归属/保存：U3；市场metadata/categoryrefs revision。accepted及完整原result/audit/必要durable责任同local UoW，ownereffect不跨事务；各rejected/blocked/unknown有安全来源。
- 禁止/03交接：不能改变源绑定/审查材料；完整DTO→domain字段、typed get/save、revision/fence/错误与报告逐item由03闭合，fake/durable同语义。

#### MaintainMarketCategory 处理流

```text
[ Current actor / scope / typed intent ]
        |
        v
[ Reserve canonical operation (short local transaction) ]
        |
        v
[ Duplicate -> typed stored original result; conflict -> reject ]
        |
        v
[ New intent -> typed load + qualified owner prechecks ]
        |
        v
[ Explicit Create or Change? ]
        |
        v
[ Create -> new typed ID; Change -> existing revision; reject cycles ]
        |
        v
[ Short local UoW: revision + owning guard (admission only when required) ]
        |
        v
[ Changed facts + safe audit + complete result + required durable work ]
        |
        v
[ Commit -> local accepted (not external success) ]
```

- 主要处理：正式taxonomy维护权限，Create不复用已有ID，Change必须typed读取revision；Category.create(CategoryCreationInput input)或change(CategoryChangeInput input)。
- 归属/保存：U3；Category + audit/result。accepted及完整原result/audit/必要durable责任同local UoW，ownereffect不跨事务；各rejected/blocked/unknown有安全来源。
- 禁止/03交接：不把市场分类当ownerenum；防父子循环；完整DTO→domain字段、typed get/save、revision/fence/错误与报告逐item由03闭合，fake/durable同语义。

#### RegisterMarketVersion 处理流

```text
[ Current actor / scope / typed intent ]
        |
        v
[ Reserve canonical operation (short local transaction) ]
        |
        v
[ Duplicate -> typed stored original result; conflict -> reject ]
        |
        v
[ New intent -> typed load + qualified owner prechecks ]
        |
        v
[ Listing + application basis + exact owner version match? ]
        |
        v
[ Stage market version; no mutable selector / latest fallback ]
        |
        v
[ Short local UoW: revision + owning guard (admission only when required) ]
        |
        v
[ Changed facts + safe audit + complete result + required durable work ]
        |
        v
[ Commit -> local accepted (not external success) ]
```

- 主要处理：核验listing/申请固定basis/sourcebinding相同；MarketVersion.stage(MarketVersionCreationInput input)。
- 归属/保存：U3；Staged MarketVersion + audit/result。accepted及完整原result/audit/必要durable责任同local UoW，ownereffect不跨事务；各rejected/blocked/unknown有安全来源。
- 禁止/03交接：不能静默换owner版本或直接Listed；完整DTO→domain字段、typed get/save、revision/fence/错误与报告逐item由03闭合，fake/durable同语义。

#### ListMarketVersion 处理流

```text
[ Current actor / scope / typed intent ]
        |
        v
[ Reserve canonical operation (short local transaction) ]
        |
        v
[ Duplicate -> typed stored original result; conflict -> reject ]
        |
        v
[ New intent -> typed load + qualified owner prechecks ]
        |
        v
[ Formal current approved + exact binding + current source gate? ]
        |
        v
[ Version serialization: Staged / Restricted only; Withdrawn rejects ]
        |
        v
[ Short local UoW: revision + owning guard (admission only when required) ]
        |
        v
[ Changed facts + safe audit + complete result + required durable work ]
        |
        v
[ Commit -> local accepted (not external success) ]
```

- 主要处理：当前source/publisher/material/Govapproved全binding核验；同版本序列化，拒绝Withdrawn或stale revision；MarketVersion.list(VersionAdmissionInput input)。
- 归属/保存：U3；Listed版本 + immutabledecision关联 + audit/result/派生责任。accepted及完整原result/audit/必要durable责任同local UoW，ownereffect不跨事务；各rejected/blocked/unknown有安全来源。
- 禁止/03交接：Restricted恢复需新正式依据，Withdrawn重发需新version；完整DTO→domain字段、typed get/save、revision/fence/错误与报告逐item由03闭合，fake/durable同语义。

#### SearchMarketplaceCatalog 处理流

```text
[ Current actor -> formal scope / disclosure resolver ]
        |
        v
[ Unknown scope -> safe no disclosure ]
        |
        v
[ Current actor / scope / source visibility intersection ]
        |
        v
[ Typed SearchMarketplaceCatalog read source and freshness inspection ]
        |
        v
[ Authorized rows FIRST -> page / facets / total / suggestions ]
        |
        v
[ Visibility intersection + freshness / missing / degraded ]
        |
        v
[ Safe typed view / page / counts (no write) ]
```

- 主要处理：resolver-first；关键词/类型/分类/标签范围索引检索；先可见裁剪再count/suggest/page。
- 归属/保存：U3；U7 Catalog投影 + current scope/visibility。全部读取no-write，resolver不刷新业务snapshot。
- 禁止/03交接：索引不足degraded，不泄漏隐藏数量；完整DTO→domain字段、typed get/save、revision/fence/错误与报告逐item由03闭合，fake/durable同语义。

#### GetMarketplaceListing 处理流

```text
[ Current actor -> formal scope / disclosure resolver ]
        |
        v
[ Unknown scope -> safe no disclosure ]
        |
        v
[ Current actor / scope / source visibility intersection ]
        |
        v
[ Typed GetMarketplaceListing read source and freshness inspection ]
        |
        v
[ Safe subject / summary / count disclosure, no refresh or write ]
        |
        v
[ Visibility intersection + freshness / missing / degraded ]
        |
        v
[ Safe typed view / page / counts (no write) ]
```

- 主要处理：resolver-first详情裁剪。
- 归属/保存：U3；listing/marketversions+owner safe切片。全部读取no-write，resolver不刷新业务snapshot。
- 禁止/03交接：禁止body/虚构评分预览；完整DTO→domain字段、typed get/save、revision/fence/错误与报告逐item由03闭合，fake/durable同语义。

#### ListMarketVersions 处理流

```text
[ Current actor -> formal scope / disclosure resolver ]
        |
        v
[ Unknown scope -> safe no disclosure ]
        |
        v
[ Current actor / scope / source visibility intersection ]
        |
        v
[ Typed ListMarketVersions read source and freshness inspection ]
        |
        v
[ Safe subject / summary / count disclosure, no refresh or write ]
        |
        v
[ Visibility intersection + freshness / missing / degraded ]
        |
        v
[ Safe typed view / page / counts (no write) ]
```

- 主要处理：scope安全history/versions分页。
- 归属/保存：U3；typed版本列表+safe binding。全部读取no-write，resolver不刷新业务snapshot。
- 禁止/03交接：不把ownerlatest改市场绑定；完整DTO→domain字段、typed get/save、revision/fence/错误与报告逐item由03闭合，fake/durable同语义。

#### SelectMarketVersion 处理流

```text
[ Current actor -> formal scope / disclosure resolver ]
        |
        v
[ Unknown scope -> safe no disclosure ]
        |
        v
[ Current actor / scope / source visibility intersection ]
        |
        v
[ Typed SelectMarketVersion read source and freshness inspection ]
        |
        v
[ Exact version only: not available -> safe rejection, NO latest fallback ]
        |
        v
[ Visibility intersection + freshness / missing / degraded ]
        |
        v
[ Safe typed view / page / counts (no write) ]
```

- 主要处理：指定exact版本并检查当前可见/资格；不可用返回明确结果，不选latest。
- 归属/保存：U3；exact MarketVersion + current来源/决定读取。全部读取no-write，resolver不刷新业务snapshot。
- 禁止/03交接：仅只读选择资格，不受理获取；完整DTO→domain字段、typed get/save、revision/fence/错误与报告逐item由03闭合，fake/durable同语义。

#### ListMarketCategories 处理流

```text
[ Current actor -> formal scope / disclosure resolver ]
        |
        v
[ Unknown scope -> safe no disclosure ]
        |
        v
[ Current actor / scope / source visibility intersection ]
        |
        v
[ Typed ListMarketCategories read source and freshness inspection ]
        |
        v
[ Safe subject / summary / count disclosure, no refresh or write ]
        |
        v
[ Visibility intersection + freshness / missing / degraded ]
        |
        v
[ Safe typed view / page / counts (no write) ]
```

- 主要处理：分类和计数同scope裁剪。
- 归属/保存：U3；Category+scope安全关联。全部读取no-write，resolver不刷新业务snapshot。
- 禁止/03交接：不返隐藏listing总数；完整DTO→domain字段、typed get/save、revision/fence/错误与报告逐item由03闭合，fake/durable同语义。

## 自检/停审

本部分10接口均独立图+三项notes；Step7无遗漏，对象/成员均Step6，不创造event/API。业务gate与localcommit/outsideeffect分层，query无写，report保留逐item refs；正式§8摘录。U3 internal stop_review/pass。
