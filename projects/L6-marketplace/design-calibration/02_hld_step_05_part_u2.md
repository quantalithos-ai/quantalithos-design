# Step5 U2 发布与审核交接

## 思考与诊断

来源：00§9 FR-MP-201/202、00§10相关BR与01§6 U2。本部分职责是建立草稿、固定提交、终止申请、审核交接与匹配决定。输入必须为U1资格及固定来源/责任/材料/scope，输出仅申请与review局部进度、匹配决定引用。现有01只划责任，未给功能到对象的承接；若继承产品词会越权到Governance approval/投票/策略裁决。

取舍：以发布与审核交接局部功能为轴，拒绝把Governance approval/投票/策略裁决纳入本地对象。计划：功能→候选六维→边界接缝→回填→停审；当前功能表尚未写入。

## 结构化结果

| 功能 / capability | 输入 | 输出 | 状态 / 副作用 | 后续展开 |
|---|---|---|---|---|
| 申请草稿/修订/固定提交/终止 | 安全draft候选与U1当前资格 | Draft/Submitted/Terminated，固定PublicationBasis | Submitted不改，submit需review durable责任 | §6～9；FR-MP-201；CUT-MP-2 |
| 审核交接/决定关联/原意图对账 | 原handoff/basis+Govformal接收/决定 | ReviewHandoff进度与matched binding | ACK非approved；unknown先probe | §6～9；FR-MP-202；CUT-MP-2 |

| 代码主体 / 模块 | 类型 | 作用 | 后续展开位置 |
|---|---|---|---|
| PublicationReviewService | Application Service | 编排本部分意图/当前依据与局部变化 | Step7/8、03函数/UoW |
| ReviewBindingPolicy | Domain policy | 守来源/当前资格/禁止事项，不从配置授权 | Step6/8/9 |
| MarketStorePort / OperationStorePort | inside-owned port | typed存取本部分已成立对象/原结果；不改外部truth | Step7/8、03typed方法 |

| 维度 | 候选对象 | Step 6 展开要求 |
|---|---|---|
| Truth / State | PublicationApplication、ReviewHandoff | 每独立carrier成卡；enum在carrier状态表，禁止全局Done |
| Policy / Invariant | ReviewBindingPolicy | 独立卡片，guard输入来源必须闭合 |
| Projection / Read model | ApplicationProgressView | 独立typed read卡片或明确仅U7共享投影切片，不另造存储truth |
| Reference / Boundary | PublicationBasis、GovernanceDecisionBinding | 独立binding/上下文卡片；纯ref标量列排除 |
| Audit / History | 申请基线与交接历史 | U6 MarketAuditRecord唯一承接，其余只typed关联 |

## 接缝与禁止

U2消费U1基线、向U3供matched决定，不能直接上架。 不承担Governance approval/投票/策略裁决。

## 回填与停审

正式§5摘录本功能/代码/候选/边界结果；Step6按候选正式化。已核对功能来源、输入输出、局部状态与证明上限；本部分P1～P8完成，internal stop_review/pass，允许下一个部分。没有创建实现或external evidence。
