# Step5 U4 受控分发

## 思考与诊断

来源：00§9 FR-MP-401/402/403、00§10相关BR与01§6 U4。本部分职责是当前获取资格、受理/取消意图、交付与原意图结果对账。输入必须为exact市场版本、consumer/receiver/scope、当前资格，输出仅局部分发relation/intent/attempt及mapped正式结果。现有01只划责任，未给功能到对象的承接；若继承产品词会越权到安装激活/付款订阅/receiver commit truth。

取舍：以受控分发局部功能为轴，拒绝把安装激活/付款订阅/receiver commit truth纳入本地对象。计划：功能→候选六维→边界接缝→回填→停审；当前功能表尚未写入。

## 结构化结果

| 功能 / capability | 输入 | 输出 | 状态 / 副作用 | 后续展开 |
|---|---|---|---|---|
| 当前获取资格读面 | exact版本/source/Gov/当前授权/正式receiver | 资格safeview或blocked/unknown | no-write，无财务entitlementtruth | §6～9；FR-MP-401；CUT-MP-4 |
| 获取受理/取消与分发交接 | 当前gate+exact版本/consumer/receiver/scope | intent/relation/attempt/durable责任 | 与withdraw同版本边界，accepted非installed | §6～9；FR-MP-402；CUT-MP-4 |
| 接收结果匹配/对账 | formal原intent/version/consumer/receiver/scope结果或probe | mappedoutcome/Failed/CommitUnknown | 迟到补impact，unknown不盲retry | §6～9；FR-MP-403；CUT-MP-4 |

| 代码主体 / 模块 | 类型 | 作用 | 后续展开位置 |
|---|---|---|---|
| DistributionService | Application Service | 编排本部分意图/当前依据与局部变化 | Step7/8、03函数/UoW |
| AcquisitionGatePolicy | Domain policy | 守来源/当前资格/禁止事项，不从配置授权 | Step6/8/9 |
| MarketStorePort / OperationStorePort | inside-owned port | typed存取本部分已成立对象/原结果；不改外部truth | Step7/8、03typed方法 |

| 维度 | 候选对象 | Step 6 展开要求 |
|---|---|---|
| Truth / State | DistributionIntent、DistributionRelation、DistributionAttempt | 每独立carrier成卡；enum在carrier状态表，禁止全局Done |
| Policy / Invariant | AcquisitionGatePolicy | 独立卡片，guard输入来源必须闭合 |
| Projection / Read model | DistributionReadView | 独立typed read卡片或明确仅U7共享投影切片，不另造存储truth |
| Reference / Boundary | ReceiverOutcomeBinding | 独立binding/上下文卡片；纯ref标量列排除 |
| Audit / History | 意图/attempt/receiver结果历史 | U6 MarketAuditRecord唯一承接，其余只typed关联 |

## 接缝与禁止

U4消费U3 exact版本/currentgate，向U5供已知及unknown relation/attempt；receiver结果只正式映射。 不承担安装激活/付款订阅/receiver commit truth。

## 回填与停审

正式§5摘录本功能/代码/候选/边界结果；Step6按候选正式化。已核对功能来源、输入输出、局部状态与证明上限；本部分P1～P8完成，internal stop_review/pass，允许下一个部分。没有创建实现或external evidence。
