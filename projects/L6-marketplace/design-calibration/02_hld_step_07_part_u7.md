# Step7 U7 接口小循环

## 问题、诊断与取舍

所有query先scope resolver，refresh/rebuild是显式Worker内部job。投影identity必须kind/scope/typed view keys完整，不以opaque ref解析生成typed计划；无计划/空集作为safe issue。

计划：入口分类→对象反查→typed骨架→flow/state反查→回填→停审；当前表尚未写入。

## 结构化接口与回填

### Command

本部分无该类active入口。

### Query

| API | 输入骨架 | 输出骨架 | 读取来源 | 边界 |
|---|---|---|---|---|
| GetReferenceFreshness | QualifiedReferenceSnapshotRef snapshot_ref；ActorContext actor；QueryMetadata meta | ReferenceFreshnessView | typed qualified snapshot/state/validity | state不能代替snapshot本体，不refresh |
| GetProjectionFreshness | MarketProjectionRef projection_ref；ActorContext actor；QueryMetadata meta | ProjectionFreshnessView | scope-bound ReadProjection/cursor/state | Fresh不代表业务ready |

### Job

| Job | 输入来源 | 输出结果 | 边界 |
|---|---|---|---|
| RefreshQualifiedReferences | ReferenceRefreshInput input（finite type/source/consumer/scope）；MarketWorkerContext context | ReferenceRefreshReport，含逐项target/outcome/gap/result refs | qualifiedsnapshot shadow/state+audit/report；不得自动解除Restricted或改申请/源truth |
| RebuildMarketReadProjection | MarketProjectionRef projection_ref；ProjectionRebuildPlanInput input；MarketWorkerContext context | ProjectionRebuildReport，含逐项target/outcome/gap/result refs | ReadProjection安全shadow及state/report；不从旧projection自建truth、不触发ownerwrite |


## 自检与停审

对象/函数来源均已在Step6；command metadata唯一，query只读；job是worker-internal formal surface，其key由本地worker wrapper唯一提供而非复制Core command字段。没有activeevent/假schema；本部分接口逐个对应Step8flow和Step9trigger。正式§7摘录表与边界。U7 internal stop_review/pass。
