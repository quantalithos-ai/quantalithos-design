# Step5 U5 撤回与通知

## 思考与诊断

来源：00§9 FR-MP-501/502、00§10相关BR与01§6 U5。本部分职责是有据限制/撤回、已知影响枚举/增量、通知计划/交接/对账。输入必须为正式处置依据、版本序列化、U4已知/unknown交接，输出仅停新发处置、known impact/coverage gap、notice尝试。现有01只划责任，未给功能到对象的承接；若继承产品词会越权到外部全局撤销/全安装扫描/卸载/自造送达。

取舍：以撤回与通知局部功能为轴，拒绝把外部全局撤销/全安装扫描/卸载/自造送达纳入本地对象。计划：功能→候选六维→边界接缝→回填→停审；当前功能表尚未写入。

## 结构化结果

| 功能 / capability | 输入 | 输出 | 状态 / 副作用 | 后续展开 |
|---|---|---|---|---|
| 限制/撤回本地版本 | formal处置/失效依据+exact版本 | disposition+Restricted/Withdrawn | 通知失败不复活，停新admission | §6～9；FR-MP-501；CUT-MP-5 |
| 已知影响枚举/增量与通知责任 | known/unknown/late关系+formalchannel/target | Partial/KnownScopeComplete、notice计划/attempt/outcome | 只已知cursor集合，不全安装/自造送达 | §6～9；FR-MP-502；CUT-MP-5 |

| 代码主体 / 模块 | 类型 | 作用 | 后续展开位置 |
|---|---|---|---|
| WithdrawalNoticeService | Application Service | 编排本部分意图/当前依据与局部变化 | Step7/8、03函数/UoW |
| WithdrawalImpactPolicy | Domain policy | 守来源/当前资格/禁止事项，不从配置授权 | Step6/8/9 |
| MarketStorePort / OperationStorePort | inside-owned port | typed存取本部分已成立对象/原结果；不改外部truth | Step7/8、03typed方法 |

| 维度 | 候选对象 | Step 6 展开要求 |
|---|---|---|
| Truth / State | WithdrawalDisposition、ImpactRecord、NoticeIntent | 每独立carrier成卡；enum在carrier状态表，禁止全局Done |
| Policy / Invariant | WithdrawalImpactPolicy | 独立卡片，guard输入来源必须闭合 |
| Projection / Read model | ImpactNoticeView | 独立typed read卡片或明确仅U7共享投影切片，不另造存储truth |
| Reference / Boundary | NoticeOutcomeBinding | 独立binding/上下文卡片；纯ref标量列排除 |
| Audit / History | 撤回/影响/通知追加历史 | U6 MarketAuditRecord唯一承接，其余只typed关联 |

## 接缝与禁止

U5经U3单一version writer限制/撤回，消费U4稳定cursor影响；late结果增量补充。 不承担外部全局撤销/全安装扫描/卸载/自造送达。

## 回填与停审

正式§5摘录本功能/代码/候选/边界结果；Step6按候选正式化。已核对功能来源、输入输出、局部状态与证明上限；本部分P1～P8完成，internal stop_review/pass，允许下一个部分。没有创建实现或external evidence。
