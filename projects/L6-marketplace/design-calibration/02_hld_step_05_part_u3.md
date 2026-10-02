# Step5 U3 目录与市场版本

## 思考与诊断

来源：00§9 FR-MP-203/301/302/303、00§10相关BR与01§6 U3。本部分职责是建立listing、维护市场metadata/分类、登记与上架版本、范围发现/exact选择。输入必须为U2正式适用批准与U1当前资格、范围读取语境，输出仅listing/market version处置与安全详情/分类目录。现有01只划责任，未给功能到对象的承接；若继承产品词会越权到Method目录/Registry/源版本/资产内容/资格truth。

取舍：以目录与市场版本局部功能为轴，拒绝把Method目录/Registry/源版本/资产内容/资格truth纳入本地对象。计划：功能→候选六维→边界接缝→回填→停审；当前功能表尚未写入。

## 结构化结果

| 功能 / capability | 输入 | 输出 | 状态 / 副作用 | 后续展开 |
|---|---|---|---|---|
| 显式上架 | 固定申请与currentapproved/sourcegate | MarketVersion Listed或拒绝/blocked | 只有本地市场处置，不自审 | §6～9；FR-MP-203；CUT-MP-3 |
| 目录metadata/分类/范围搜索 | 市场标签/分类+currentreadscope+safe来源 | listing/category与可见page/count/suggest | 领域写显式，query/index不变truth | §6～9；FR-MP-301；CUT-MP-3 |
| 来源与版本详情 | exact listing/version与qualifiedsnapshot | safe详情/材料/限制/freshness | 不返回body/伪造评分预览 | §6～9；FR-MP-302；CUT-MP-3 |
| exact版本选择 | 用户指定MarketVersionRef | 明确选择资格/不可用/unknown | 不latestfallback、不创建获取intent | §6～9；FR-MP-303；CUT-MP-3 |

| 代码主体 / 模块 | 类型 | 作用 | 后续展开位置 |
|---|---|---|---|
| CatalogVersionService | Application Service | 编排本部分意图/当前依据与局部变化 | Step7/8、03函数/UoW |
| VersionAdmissionPolicy | Domain policy | 守来源/当前资格/禁止事项，不从配置授权 | Step6/8/9 |
| MarketStorePort / OperationStorePort | inside-owned port | typed存取本部分已成立对象/原结果；不改外部truth | Step7/8、03typed方法 |

| 维度 | 候选对象 | Step 6 展开要求 |
|---|---|---|
| Truth / State | MarketplaceListing、MarketVersion、Category | 每独立carrier成卡；enum在carrier状态表，禁止全局Done |
| Policy / Invariant | VersionAdmissionPolicy | 独立卡片，guard输入来源必须闭合 |
| Projection / Read model | CatalogReadView | 独立typed read卡片或明确仅U7共享投影切片，不另造存储truth |
| Reference / Boundary | 市场版本→owner版本不可变绑定 | 独立binding/上下文卡片；纯ref标量列排除 |
| Audit / History | 目录及版本处置历史 | U6 MarketAuditRecord唯一承接，其余只typed关联 |

## 接缝与禁止

U3消费U2批准binding；与U4/U5同marketversion序列化边界；U7只读取。 不承担Method目录/Registry/源版本/资产内容/资格truth。

## 回填与停审

正式§5摘录本功能/代码/候选/边界结果；Step6按候选正式化。已核对功能来源、输入输出、局部状态与证明上限；本部分P1～P8完成，internal stop_review/pass，允许下一个部分。没有创建实现或external evidence。
