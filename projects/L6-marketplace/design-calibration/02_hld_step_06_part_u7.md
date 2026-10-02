# Step6 U7 对象正式化

## 思考、诊断与取舍

U7没有domain writer。TypedOwnerReference只能qualifiedresolver构造；QualifiedReadContext是只读authority组合，非登录truth。Projection identity finite kind+scope+view typed keys，shadow原子替换；Catalog/Progress/Impact/Audit切片复用已定义view结构，不新增匿名JSON投影。

来源：Step5本部分功能/候选；计划：候选筛选→逐对象卡片→flow/state反查→回填→停审。当前卡片尚未落盘。

## 结构化对象与回填

#### TypedOwnerReference

| 项 | 内容 |
|---|---|
| 所属部分 | U7 |
| 对象类型 | reference value |
| 主要责任 | opaque正式owner引用及type绑定 |

| 字段 | 类型 | 作用 |
|---|---|---|
| owner_kind_ref | QualifiedOwnerKindRef | 正式owner kind映射，不以UI五类型定义enum |
| canonical_ref | CanonicalOwnerRef | 正式owner/SDK提供opaque ref |
| contract_ref | OwnerConsumerContractRef | 当前operation/consumer正式资格来源 |

无独立生命周期；immutable记录/值或stateless策略，不伪造状态机。

| 成员函数 | 作用 |
|---|---|
| matches(OwnerReferenceContext input) | typed引用/contract绑定，不解析opaque值 |

| 工厂函数 | 作用 |
|---|---|
| from_resolver(QualifiedOwnerReferenceInput input) | 无canonical映射不默认string-ref |

| 禁止事项 | 说明 |
|---|---|
| 越权/写入 | 不复制外部正文/authority；不由query推进状态 |

#### QualifiedReferenceSnapshot

| 项 | 内容 |
|---|---|
| 所属部分 | U7 |
| 对象类型 | snapshot entity |
| 主要责任 | 固定来源/资格/材料/结果安全切片及维护姿态 |

| 字段 | 类型 | 作用 |
|---|---|---|
| snapshot_ref | QualifiedReferenceSnapshotRef | 本地ID |
| source_ref | TypedOwnerReference | 正式来源 |
| source_version | OwnerVersionRef | 来源版本/cursor |
| safe_material | QualifiedSnapshotMaterial | finite source/publisher/material/decision/receiver/notice/observation safe切片；无正文 |
| validity_ref | SourceValidityRef | 正式owner有效性，非本地fresh自证 |
| state | ReferenceSnapshotState | Qualified/Stale/Unavailable |
| revision | MarketRevision | 更新CAS来源 |

| 状态 | 作用 |
|---|---|
| Qualified | 本次影子来源匹配，仍需当前authority资格 |
| Stale | 旧影子明确陈旧，敏感/资格不据此放行 |
| Unavailable | 无安全有效读取材料，返回缺口 |

| 成员函数 | 作用 |
|---|---|
| refresh(QualifiedSnapshotInput input) | 本次正式来源qualified才替换shadow |
| mark_stale(SourceRefreshFailureInput input) | 失败与旧合法摘要保留，不改业务truth |
| mark_unavailable(SourceRefreshFailureInput input) | 不可见/不支持/缺失或无安全旧材料，禁新positive |

| 工厂函数 | 作用 |
|---|---|
| capture(QualifiedSnapshotInput input) | 首个qualified切片，不空填默认 |

| 禁止事项 | 说明 |
|---|---|
| 越权/写入 | 不复制外部正文/authority；不由query推进状态 |

#### QualifiedReadContext

| 项 | 内容 |
|---|---|
| 所属部分 | U7 |
| 对象类型 | immutable context |
| 主要责任 | 当前actor/scope/披露交集 |

| 字段 | 类型 | 作用 |
|---|---|---|
| actor_ref | ActorReference | Core ActorContext规范来源 |
| scope_ref | MarketScopeRef | 正式scope resolver |
| disclosure_ref | DisclosureDecisionRef | 当前披露依据，不由ref或public标签猜 |
| source_constraints | SourceVisibilityConstraintSet | owner/市场/组织交集 |
| query_metadata_ref | SharedQueryMetadataReference | Core query上下文唯一来源 |

无独立生命周期；immutable记录/值或stateless策略，不伪造状态机。

| 成员函数 | 作用 |
|---|---|
| permits(ReadSubjectInput subject) | 按正式结果裁剪subject/summary/count/suggest |

| 工厂函数 | 作用 |
|---|---|
| resolve(QualifiedReadInput input) | 只读scope/visibility，不refresh业务snapshot |

| 禁止事项 | 说明 |
|---|---|
| 越权/写入 | 不复制外部正文/authority；不由query推进状态 |

#### ReadProjection

| 项 | 内容 |
|---|---|
| 所属部分 | U7 |
| 对象类型 | derived read model |
| 主要责任 | 范围绑定的安全目录/进度/影响/审计索引 |

| 字段 | 类型 | 作用 |
|---|---|---|
| projection_ref | MarketProjectionRef | 本地typed projection identity |
| kind | MarketProjectionKind | Catalog/Progress/Impact/Audit四有限切片族 |
| scope_ref | MarketScopeRef | 不可跨scope复用 |
| source_cursor | MarketSourceCursor | 重建committed facts稳定cursor |
| snapshot_refs | QualifiedReferenceSnapshotRefSet | typed safe来源 |
| view_keys | MarketReadViewKeySet | view kind+market subject+scope身份，非解析opaque字符串 |
| state | ReadProjectionState | Fresh/Stale/Rebuilding/Unavailable |
| revision | MarketRevision | rebuild compare与原子发布 |

| 状态 | 作用 |
|---|---|
| Fresh | 声明cursor内的派生切片，可见性仍当前校验 |
| Stale | 落后来源，不变成授权 |
| Rebuilding | 独立重建工作中，不暴露半成品 |
| Unavailable | 当前无合法派生读取，only声明安全fallback |

| 成员函数 | 作用 |
|---|---|
| mark_stale(ProjectionInvalidationInput input) | 只派生维护姿态 |
| begin_rebuild(ProjectionRebuildPlanInput input) | typed plan、固定cursor、非空typed来源 |
| publish(ProjectionBuildOutcomeInput input) | 安全完整shadow原子替换，不partial masquerade |
| mark_unavailable(ProjectionBuildFailureInput input) | 缺plan/失败保守不可用，不删truth |

| 工厂函数 | 作用 |
|---|---|
| initialize(ProjectionCreationInput input) | 初始Stale，无从旧index造truth |

| 禁止事项 | 说明 |
|---|---|
| 越权/写入 | 不复制外部正文/authority；不由query推进状态 |

#### ReadBoundaryPolicy

| 项 | 内容 |
|---|---|
| 所属部分 | U7 |
| 对象类型 | policy |
| 主要责任 | 全部读取一致scope与no-write |

| 字段 | 类型 | 作用 |
|---|---|---|
| requirements | ReadBoundaryRequirements | 正式disclosure/sourcevisibility交集 |

无独立生命周期；immutable记录/值或stateless策略，不伪造状态机。

| 成员函数 | 作用 |
|---|---|
| evaluate(QualifiedReadContext context, ReadSubjectInput subject, ReadSourceInspectionInput source) | 安全read surface；缺源不凭index证明可见 |

| 工厂函数 | 作用 |
|---|---|
| 无工厂业务入口 | stateless策略/typed view assembler调用，不新增truth |

| 禁止事项 | 说明 |
|---|---|
| 越权/写入 | 不复制外部正文/authority；不由query推进状态 |

## 候选排除与状态型别

ID/Ref/Revision/Cursor/SafeReason等标量是字段类型不是新实体，03需校验/codec。Command/Result DTO、Service/Entry、Port/Repository/Adapter交Step7/03；未进入domain。每个state enum只属于其carrier，不共享GlobalState；状态表在carrier卡片完整定义，故不另建重复枚举对象。History关联复用U6 MarketAuditRecord，不另建未拥有生命周期的七套record。

## 自检与停审

候选全部独立展开或明确字段-only/接缝-only；每卡有所属/类型/字段作用/typed参数/factory/禁止事项，状态trigger将由Step7/8点名。正式§6摘录上述卡片。U7 internal stop_review/pass，允许下一部分；未宣称完整schema可实现或owner支持。
