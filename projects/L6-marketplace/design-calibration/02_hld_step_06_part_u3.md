# Step6 U3 对象正式化

## 思考、诊断与取舍

MarketplaceListing、MarketVersion、Category单独负责市场truth；源version绑定不改。Withdrawn终态，新发同源也必须新marketversion/review语境；Restricted有据显式恢复。Category无独立生命周期只metadata revision，不乱造Retired状态。

来源：Step5本部分功能/候选；计划：候选筛选→逐对象卡片→flow/state反查→回填→停审。当前卡片尚未落盘。

## 结构化对象与回填

#### MarketplaceListing

| 项 | 内容 |
|---|---|
| 所属部分 | U3 |
| 对象类型 | aggregate |
| 主要责任 | 市场目录metadata而非源资产定义 |

| 字段 | 类型 | 作用 |
|---|---|---|
| listing_ref | MarketplaceListingRef | 本地ID |
| publisher_ref | PublisherRelationRef | U1责任关联 |
| metadata | MarketListingMetadata | 用户允许市场描述/标签，拒绝body |
| category_refs | CategoryRefSet | U3分类关联 |
| revision | MarketRevision | repo返回并发版本 |

无独立生命周期；immutable记录/值或stateless策略，不伪造状态机。

| 成员函数 | 作用 |
|---|---|
| edit(ListingMetadataInput input) | 只市场metadata，不变owner版本或申请基线 |

| 工厂函数 | 作用 |
|---|---|
| create(ListingCreationInput input) | 建立目录壳，不自带Listed版本 |

| 禁止事项 | 说明 |
|---|---|
| 越权/写入 | 不复制外部正文/authority；不由query推进状态 |

#### MarketVersion

| 项 | 内容 |
|---|---|
| 所属部分 | U3 |
| 对象类型 | entity |
| 主要责任 | exact owner版本的独立市场处置 |

| 字段 | 类型 | 作用 |
|---|---|---|
| version_ref | MarketVersionRef | 本地ID，不是owner version |
| listing_ref | MarketplaceListingRef | 目录关联 |
| source_binding | SourceBinding | 一经登记不可换owner版本 |
| application_ref | PublicationApplicationRef | 对应固定审查对象 |
| decision_binding | OptionalGovernanceDecisionBinding | 上架必须正式有效approved |
| disposition_ref | OptionalWithdrawalDispositionRef | 限制/撤回依据 |
| state | MarketVersionState | Staged/Listed/Restricted/Withdrawn |
| revision | MarketRevision | 单版本序列化并发依据 |

| 状态 | 作用 |
|---|---|
| Staged | 登记未上架，不可获取 |
| Listed | 本地可上架姿态，获取仍当前gate |
| Restricted | 本地禁新获取，恢复需新有效依据显式list |
| Withdrawn | 本次marketversion处置终态；重发新marketversion/申请 |

| 成员函数 | 作用 |
|---|---|
| list(VersionAdmissionInput input) | 当前正式approved/资格才显式Listed |
| restrict(VersionRestrictionInput input) | 正式失效或未知保守限制，非owner撤销 |
| withdraw(VersionWithdrawalInput input) | 有据局部撤回，终态不自动复活 |

| 工厂函数 | 作用 |
|---|---|
| stage(MarketVersionCreationInput input) | 初始Staged，固定owner版本 |

| 禁止事项 | 说明 |
|---|---|
| 越权/写入 | 不复制外部正文/authority；不由query推进状态 |

#### Category

| 项 | 内容 |
|---|---|
| 所属部分 | U3 |
| 对象类型 | entity |
| 主要责任 | 市场分类taxonomy唯一owner |

| 字段 | 类型 | 作用 |
|---|---|---|
| category_ref | CategoryRef | 本地ID |
| label | MarketCategoryLabel | 市场标签，不上游资产enum |
| parent_ref | OptionalCategoryRef | typed父关联 |
| revision | MarketRevision | 变更并发保护 |

无独立生命周期；immutable记录/值或stateless策略，不伪造状态机。

| 成员函数 | 作用 |
|---|---|
| change(CategoryChangeInput input) | 防循环/不可见关联与标签越界 |

| 工厂函数 | 作用 |
|---|---|
| create(CategoryCreationInput input) | 有权taxonomy写入，非source定义 |

| 禁止事项 | 说明 |
|---|---|
| 越权/写入 | 不复制外部正文/authority；不由query推进状态 |

#### VersionAdmissionPolicy

| 项 | 内容 |
|---|---|
| 所属部分 | U3 |
| 对象类型 | policy |
| 主要责任 | 市场上架准入及当前有效性 |

| 字段 | 类型 | 作用 |
|---|---|---|
| requirements | VersionAdmissionRequirements | 批准binding与正式来源需求 |

无独立生命周期；immutable记录/值或stateless策略，不伪造状态机。

| 成员函数 | 作用 |
|---|---|
| evaluate(MarketVersion version, PublicationBasis basis, GovernanceDecisionBinding decision, CurrentQualificationInput current) | 返回局部准入/拒绝，不自行决定Gov outcome |

| 工厂函数 | 作用 |
|---|---|
| 无工厂业务入口 | stateless策略/typed view assembler调用，不新增truth |

| 禁止事项 | 说明 |
|---|---|
| 越权/写入 | 不复制外部正文/authority；不由query推进状态 |

#### CatalogReadView

| 项 | 内容 |
|---|---|
| 所属部分 | U3 |
| 对象类型 | read view |
| 主要责任 | 范围内列表/计数/提示/详情/版本 |

| 字段 | 类型 | 作用 |
|---|---|---|
| listing_ref | MarketplaceListingRef | committed local事实 |
| version_refs | MarketVersionRefSet | exact版本候选不可fallback |
| safe_metadata | MarketCatalogSafeMetadata | 本地允许metadata+owner safe摘要 |
| read_context | QualifiedReadContext | 当前可见交集 |
| status | ReadSurfaceKind | empty/missing/not-visible/stale/degraded/unsupported/failed安全面 |

无独立生命周期；immutable记录/值或stateless策略，不伪造状态机。

| 成员函数 | 作用 |
|---|---|
| 无业务变更成员 | immutable仅typed读取/校验；rehydrate后移03 |

| 工厂函数 | 作用 |
|---|---|
| assemble(CatalogReadInput input) | 按同scope裁剪所有字段/数量/提示 |

| 禁止事项 | 说明 |
|---|---|
| 越权/写入 | 不复制外部正文/authority；不由query推进状态 |

## 候选排除与状态型别

ID/Ref/Revision/Cursor/SafeReason等标量是字段类型不是新实体，03需校验/codec。Command/Result DTO、Service/Entry、Port/Repository/Adapter交Step7/03；未进入domain。每个state enum只属于其carrier，不共享GlobalState；状态表在carrier卡片完整定义，故不另建重复枚举对象。History关联复用U6 MarketAuditRecord，不另建未拥有生命周期的七套record。

## 自检与停审

候选全部独立展开或明确字段-only/接缝-only；每卡有所属/类型/字段作用/typed参数/factory/禁止事项，状态trigger将由Step7/8点名。正式§6摘录上述卡片。U3 internal stop_review/pass，允许下一部分；未宣称完整schema可实现或owner支持。
