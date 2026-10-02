# Step5 U7 引用与读取投影

## 思考与诊断

来源：00§9 FR-MP-301/302/504、00§10相关BR与01§6 U7。本部分职责是qualified引用快照刷新、resolver-first读取、目录/进度/影响投影重建。输入必须为committed市场facts+qualified owner safe snapshot+正式scope，输出仅body-free reference/snapshot与scope内有界read view。现有01只划责任，未给功能到对象的承接；若继承产品词会越权到business truth写入/从index授权/opaque解析/财务truth。

取舍：以引用与读取投影局部功能为轴，拒绝把business truth写入/从index授权/opaque解析/财务truth纳入本地对象。计划：功能→候选六维→边界接缝→回填→停审；当前功能表尚未写入。

## 结构化结果

| 功能 / capability | 输入 | 输出 | 状态 / 副作用 | 后续展开 |
|---|---|---|---|---|
| scope安全读取 | currentactor/disclosure+typed市场facts/safe影子 | QualifiedReadContext与安全view | 所有count/suggest/history同裁剪，no-write | §6～9；FR-MP-301/302；CUT-MP-7 |
| qualified引用刷新 | finiteformal来源/type/consumer/scope | snapshot本体+Qualified/Stale/Unavailable+gap | 只影子，不解除business限制 | §6～9；FR-MP-504；CUT-MP-7 |
| 目录/进度/影响/audit派生重建 | committedfacts+qualifiedsnapshots+非空typedplan/fixedcursor | scopebound ReadProjection安全shadow/report | 不oldindex修truth、不发无schemaevent | §6～9；FR-MP-301/302/504；CUT-MP-7 |

| 代码主体 / 模块 | 类型 | 作用 | 后续展开位置 |
|---|---|---|---|
| ReferenceReadService | Application Service | 编排本部分意图/当前依据与局部变化 | Step7/8、03函数/UoW |
| ReadBoundaryPolicy | Domain policy | 守来源/当前资格/禁止事项，不从配置授权 | Step6/8/9 |
| SnapshotStorePort / ProjectionStorePort | inside-owned port | typed存取本部分已成立对象/原结果；不改外部truth | Step7/8、03typed方法 |

| 维度 | 候选对象 | Step 6 展开要求 |
|---|---|---|
| Truth / State | 无业务truth；仅QualifiedReferenceSnapshot、ReadProjection维护姿态 | 每独立carrier成卡；enum在carrier状态表，禁止全局Done |
| Policy / Invariant | ReadBoundaryPolicy | 独立卡片，guard输入来源必须闭合 |
| Projection / Read model | Catalog/Progress/Impact/Audit typed切片 | 独立typed read卡片或明确仅U7共享投影切片，不另造存储truth |
| Reference / Boundary | TypedOwnerReference、QualifiedReadContext | 独立binding/上下文卡片；纯ref标量列排除 |
| Audit / History | 来源cursor与维护报告回指 | U6 MarketAuditRecord唯一承接，其余只typed关联 |

## 接缝与禁止

U7消费U1～6 committed facts和qualified snapshot，刷新只自身影子，不静默解除市场限制。 不承担business truth写入/从index授权/opaque解析/财务truth。

## 回填与停审

正式§5摘录本功能/代码/候选/边界结果；Step6按候选正式化。已核对功能来源、输入输出、局部状态与证明上限；本部分P1～P8完成，internal stop_review/pass，允许下一个部分。没有创建实现或external evidence。
