# Step6 U1 对象正式化

## 思考、诊断与取舍

SourceBinding与MaterialReference是immutable组合，不是owner类型导出声明。PublisherRelation只有Bound/Released，拒绝Verified主体状态；SourceVerification只本次local资格。六候选全部独立卡，SourceQualificationView不成为资格truth。

来源：Step5本部分功能/候选；计划：候选筛选→逐对象卡片→flow/state反查→回填→停审。当前卡片尚未落盘。

## 结构化对象与回填

#### SourceBinding

| 项 | 内容 |
|---|---|
| 所属部分 | U1 |
| 对象类型 | immutable value object |
| 主要责任 | 固定owner提供的exact来源组合 |

| 字段 | 类型 | 作用 |
|---|---|---|
| owner_ref | TypedOwnerReference | 正式resolver输出，不解析字符串 |
| owner_version | OwnerVersionRef | owner提供不可变版本 |
| asset_digest | OwnerAssetDigest | owner提供摘要，不本地重算 |
| visibility_ref | OwnerVisibilityRef | owner正式可见依据 |
| eligibility_ref | OwnerEligibilityRef | owner消费资格依据 |

无独立生命周期；immutable记录/值或stateless策略，不伪造状态机。

| 成员函数 | 作用 |
|---|---|
| matches(SourceBinding candidate) | 逐typed字段一致，不猜同义ref |

| 工厂函数 | 作用 |
|---|---|
| from_owner(QualifiedSourceInput input) | 来源合同qualified才建组合 |

| 禁止事项 | 说明 |
|---|---|
| 越权/写入 | 不复制外部正文/authority；不由query推进状态 |

#### MaterialReference

| 项 | 内容 |
|---|---|
| 所属部分 | U1 |
| 对象类型 | reference object |
| 主要责任 | 适用签名/扫描/SBOM安全材料绑定 |

| 字段 | 类型 | 作用 |
|---|---|---|
| material_ref | OwnerMaterialRef | Artifact/正式材料authority输出 |
| binding | SourceBinding | 被核验exact来源 |
| kind_ref | MaterialKindRef | authority正式kind，不本地发明scan enum |
| applicability_ref | MaterialApplicabilityRef | 适用/有效性依据 |

无独立生命周期；immutable记录/值或stateless策略，不伪造状态机。

| 成员函数 | 作用 |
|---|---|
| matches(SourceBinding source) | 仅binding与正式适用核验 |

| 工厂函数 | 作用 |
|---|---|
| from_authority(QualifiedMaterialInput input) | 不保存raw签名/扫描结果 |

| 禁止事项 | 说明 |
|---|---|
| 越权/写入 | 不复制外部正文/authority；不由query推进状态 |

#### PublisherRelation

| 项 | 内容 |
|---|---|
| 所属部分 | U1 |
| 对象类型 | entity |
| 主要责任 | 市场发布责任关联而非资质 |

| 字段 | 类型 | 作用 |
|---|---|---|
| relation_ref | PublisherRelationRef | 本地ID port分配 |
| principal_ref | PublisherPrincipalRef | 正式人类/组织authority提供，非AI ID默认映射 |
| authority_ref | PublisherAuthorityRef | 当前scope与授权来源 |
| scope_ref | MarketScopeRef | 正式resolver范围 |
| state | PublisherRelationState | 本地Bound/Released；不外部Verified |

| 状态 | 作用 |
|---|---|
| Bound | 本地关联有效，后续当前授权仍复核 |
| Released | 本地关联解除，不反写主体truth |

| 成员函数 | 作用 |
|---|---|
| release(AuthorityDispositionInput input) | 有权解除本地责任，保留历史 |

| 工厂函数 | 作用 |
|---|---|
| bind(QualifiedPublisherInput input) | 当前authority有效，初始Bound |

| 禁止事项 | 说明 |
|---|---|
| 越权/写入 | 不复制外部正文/authority；不由query推进状态 |

#### SourceVerification

| 项 | 内容 |
|---|---|
| 所属部分 | U1 |
| 对象类型 | entity |
| 主要责任 | 一次发布来源核验过程 |

| 字段 | 类型 | 作用 |
|---|---|---|
| verification_ref | SourceVerificationRef | 本地ID生成 |
| source_candidate | SourceVerificationTarget | 来自请求的typed安全owner/type/opaque候选/版本/scope；未qualified时可回指所核验对象，绝不是canonicalref自造 |
| source_binding | OptionalSourceBinding | 仅正式来源组合已核验时存在；Blocked缺源允许缺失但禁止提交 |
| material_refs | MaterialReferenceSet | 只适用body-free组合 |
| outcome_ref | OptionalQualificationOutcomeRef | Pending可无；Qualified/Blocked/Invalidated必须安全结果/缺口依据 |
| state | SourceVerificationState | Pending/Qualified/Blocked/Invalidated |

| 状态 | 作用 |
|---|---|
| Pending | 待本次核验，不供新positive |
| Qualified | 本次固定输入合格，非永久授权 |
| Blocked | 缺失/不支持/冲突/失败安全缺口 |
| Invalidated | 旧核验不再可用；新核验另建记录 |

| 成员函数 | 作用 |
|---|---|
| record(QualificationOutcomeInput outcome) | 核验qualified或blocked，结果来源必须存在 |
| invalidate(SourceInvalidationInput input) | 正式变化或失效提示使本地资格不再供新positive |

| 工厂函数 | 作用 |
|---|---|
| start(SourceVerificationInput input) | 初始Pending，不推断qualified |

| 禁止事项 | 说明 |
|---|---|
| 越权/写入 | 不复制外部正文/authority；不由query推进状态 |

#### SourceGatePolicy

| 项 | 内容 |
|---|---|
| 所属部分 | U1 |
| 对象类型 | policy |
| 主要责任 | 来源/责任/材料三类正式依据交集 |

| 字段 | 类型 | 作用 |
|---|---|---|
| requirements | QualifiedSourceRuleInput | application传入适用规则，禁止配置豁免 |

无独立生命周期；immutable记录/值或stateless策略，不伪造状态机。

| 成员函数 | 作用 |
|---|---|
| evaluate(SourceBinding source, PublisherRelation publisher, MaterialReferenceSet materials, CurrentAuthorityInput authority) | 返回本地允许/缺口轮廓，不造verified |

| 工厂函数 | 作用 |
|---|---|
| 无工厂业务入口 | stateless策略/typed view assembler调用，不新增truth |

| 禁止事项 | 说明 |
|---|---|
| 越权/写入 | 不复制外部正文/authority；不由query推进状态 |

#### SourceQualificationView

| 项 | 内容 |
|---|---|
| 所属部分 | U1 |
| 对象类型 | read view |
| 主要责任 | 安全资格与材料缺口 |

| 字段 | 类型 | 作用 |
|---|---|---|
| verification_ref | SourceVerificationRef | 已提交核验关联 |
| safe_summary | SourceSafeSummary | qualified owner摘要，无正文 |
| read_context | QualifiedReadContext | resolver当前裁剪 |
| status | ReadSurfaceKind | 按正式读取结果映射，不持久业务状态 |

无独立生命周期；immutable记录/值或stateless策略，不伪造状态机。

| 成员函数 | 作用 |
|---|---|
| 无业务变更成员 | immutable仅typed读取/校验；rehydrate后移03 |

| 工厂函数 | 作用 |
|---|---|
| assemble(SourceQualificationReadInput input) | 只读生成，不刷新核验 |

| 禁止事项 | 说明 |
|---|---|
| 越权/写入 | 不复制外部正文/authority；不由query推进状态 |

## 候选排除与状态型别

ID/Ref/Revision/Cursor/SafeReason等标量是字段类型不是新实体，03需校验/codec。Command/Result DTO、Service/Entry、Port/Repository/Adapter交Step7/03；未进入domain。每个state enum只属于其carrier，不共享GlobalState；状态表在carrier卡片完整定义，故不另建重复枚举对象。History关联复用U6 MarketAuditRecord，不另建未拥有生命周期的七套record。

## 自检与停审

候选全部独立展开或明确字段-only/接缝-only；每卡有所属/类型/字段作用/typed参数/factory/禁止事项，状态trigger将由Step7/8点名。正式§6摘录上述卡片。U1 internal stop_review/pass，允许下一部分；未宣称完整schema可实现或owner支持。

## Step9反查修复

状态条件字段审计发现初始态/失败态不能强制持有尚不存在的typed关联。本卡已补Optional条件与缺失行为；Draft输入是持久安全候选，Submitted才固定正式basis/review。修复来自既有状态/flow，不新增业务范围。
