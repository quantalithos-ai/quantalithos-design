# 02 Step 6：关键对象轮廓

## 1. Step状态

开工：用户已确认01并授权全部02；Step 6 completed，formal未装配。仅当前agent。

Step内计划：P1读取输入 → P2逐题回答 → P3诊断 → P4前后比较 → P5取舍 → P6结构化 → P7回填草稿 → P8自检/停审。P1～P8已分批完成。

模块门禁：U1→U2→U3→U4→U5→U6→U7逐部分小循环，前一部分pass才允许下一部分。

## 2. 本步输入

当前正式00§9～16、01§6～17；本Step对应SOP与书写规范。前一Step的问题回答/诊断/取舍/待确认事项：02_hld_step_05_components_boundary.md。旧02未作为推导依据。

## 3. SOP问题回答

1. 哪些对象如果不在概要设计层点名，详细设计会重新发明主语？

答：listing/version/application/handoff/intent/attempt、固定basis、qualifiedsnapshot、audit/result/work/projection与policy均是03必须承接主语。

2. Step 5 的对象候选池中，哪些候选对象正式进入本步独立展开？

答：逐U附录正式化Step5全部truth/policy/binding/view候选；所有独立生命周期与引用组合独立成卡。

3. Step 5 的对象候选池中，哪些名称只是字段类型、DTO、port、repository、API、trigger 或实现细节，不应作为关键对象展开？

答：ID/ref标量和owner提供的state/value字段不是新domain实体；Service/Entry/port/repository/DTO留Step7；enum由唯一carrier字段拥有并在其状态表完整展开，避免重复truth。

4. 每个对象属于哪个主要组成部分？

答：每卡基本表标唯一U1～7；shared operation/audit/work仅U6，sourcebinding仅U1，readprojection仅U7。

5. 每个对象是什么类型：聚合、实体、值对象、状态枚举、policy / guard、projection、reference object、audit record、history record、outbox record，还是上下文对象？

答：每卡区分aggregate/entity/immutable value/reference binding/policy/readview/auditrecord；无outbox对象因为无canonical合同。

6. 每个对象至少需要哪些关键字段骨架？

答：必需identity、输入basis、localstate或immutableassociation、reason/outcome来源、localrevision/cursor；不带raw body。

7. 每个关键字段分别是什么类型，且每个字段的作用是什么？

答：字段表逐项列typed概要类型和command/metadata/port/generated/derived来源；缺源不生成default。

8. 哪些对象存在状态集合，且每个状态的作用是什么？

答：存在生命周期者逐state说明；批准状态只外部binding值不作为本地Review enum；projectionfreshness独立。

9. 每个对象有哪些成员函数骨架，且每个函数的作用是什么？

答：只领域动作与安全view构建；每函数typed参数并对应后续明确触发，不让repo直改。

10. 每个对象有哪些工厂函数骨架，且每个工厂函数的作用是什么？

答：factory只从qualified输入或已提交facts建立初值，持久化rehydrate留03，不重跑业务factory读取旧对象。

11. 每个成员函数 / 工厂函数的参数分别是什么类型？

答：统一TypeName param_name；metadata用Core候选唯一来源、本地basis/refs是组合不第二truth；exactcanonical映射未闭合标conditional。

12. 哪些对象虽然已经在 Step 5 被列为代码主体 / 模块，但仍必须在本步独立展开对象骨架？

答：policy/reference/view/audit看似support仍要卡片；端口本身只能力不domain。

13. Step 8 处理流或 Step 9 状态机预计会使用哪些对象，它们是否已经在本步正式定义？

答：处理流预期用对象有卡；副作用责任inventory由OperationRecord/StoredOperationResult/DeferredWork/MarketAuditRecord承接。

14. 哪些字段、函数或结构已经属于详细设计，不应在本步写完整？

答：完整nullable/codec/enumwire值/返回签名/DDL/algorithm留03；本地请求指纹不是owner资产digest。

15. 当前主要组成部分的对象正式化是否完成停审:候选对象是否处理完、对象是否都有功能来源、字段 / 函数骨架是否没有越层？

答：七部分先候选筛选思考、后卡片、回填和自检，前一pass再下一；附录记录实际写入。

16. 所有对象完成后,是否存在跨组成部分重复对象、对象归属冲突或对象被处理流 / 状态机引用但未定义？

答：全对象唯一归属；Catalog/Progress等typedview由对应U拥有结构、U7统一projection存储维护；不被复制成第二truth。

## 4. 当前文档问题诊断

Step5 discovery把view与storage、pure ref与binding混在一列，需逐候选拆分；00BR201/402要求LocalReview/Distribution不得有Approved/Installed状态。01ADR005只receipt不够，需要完整public result。

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 候选 | Step5六维名称 | 独立对象基本/字段/状态/成员/工厂/禁止表 | 避免对象组替代模型 |
| state | 产品Approved/Installed风险 | 本地carrier与外部outcome分轴 | 不私造truth |
| result/sidecar | 架构机制 | 独立record/result/work/snapshot身份及typed读取要求 | 可持续恢复/重放 |

## 6. 设计取舍

采用独立卡片与字段来源，immutablebasis/binding与mutablecarrier分开；选择一份安全audit承接历史，不七套audit。拒绝预设外部schema；型别是本地设计骨架，03需正式映射后才能激活adapter。

## 7. 结构化中间产物

### 对象筛选与类型authority

本地关键对象共43个，逐对象独立卡片如下，来源均为§5功能与01可靠性机制。卡片类型名是概要设计本地骨架，不声明owner/Core已导出同名类型。

Core ActorContext/CommandMetadata/QueryMetadata仅复用已核验正式来源；command key从CommandMetadata.request读取，不在本地command再加同义key/trace字段。ID/ref/revision/cursor/safe reason等标量由03明确校验与codec，外部opaque ref由formal resolver输出，不解析或猜测。MarketIntentFingerprint是本地意图幂等指纹，绝不是OwnerAssetDigest。

候选排除：Service/Entry/API/CommandDTO/ResultDTO/Port/Repository/Adapter不是domain对象，交§7及03；各State enum是唯一carrier字段，状态全集在其卡片展开，故不另造重复生命周期对象。七部分audit/history全由U6 MarketAuditRecord承担，非遗漏。Catalog/Progress/Impact/Audit typedview结构由所属部分定义，U7 ReadProjection统一存储维护；U7切片不是业务truth。

所有可变carrier通过repo读取MarketRevision，application生成domain转换后typed save；repo不得绕domain直接改业务state。纯reference/basis/result/audit是immutable，纠错只追加新记录。属性完整schema/nullable/rehydrate/transport encoding与返回签名由03闭合。

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

#### PublicationBasis

| 项 | 内容 |
|---|---|
| 所属部分 | U2 |
| 对象类型 | immutable value object |
| 主要责任 | 审核申请固定输入 |

| 字段 | 类型 | 作用 |
|---|---|---|
| basis_ref | PublicationBasisRef | 本地ID |
| source | SourceBinding | U1固定来源 |
| publisher_ref | PublisherRelationRef | 已核验责任关联 |
| materials | MaterialReferenceSet | 审核适用材料固定集 |
| scope_ref | MarketScopeRef | 正式范围 |

无独立生命周期；immutable记录/值或stateless策略，不伪造状态机。

| 成员函数 | 作用 |
|---|---|
| matches(PublicationBasis candidate) | 版本/材料/责任/scope全匹配 |

| 工厂函数 | 作用 |
|---|---|
| freeze(QualifiedPublicationInput input) | 固定审核输入，不允许submitted后换材料 |

| 禁止事项 | 说明 |
|---|---|
| 越权/写入 | 不复制外部正文/authority；不由query推进状态 |

#### PublicationApplication

| 项 | 内容 |
|---|---|
| 所属部分 | U2 |
| 对象类型 | aggregate |
| 主要责任 | 申请草稿提交与终止局部truth |

| 字段 | 类型 | 作用 |
|---|---|---|
| application_ref | PublicationApplicationRef | 本地ID |
| draft_spec | DraftPublicationSpec | typed安全来源/责任/材料候选与scope由Draft输入持久化；Submitted不再改，非qualifiedbasis |
| basis_ref | OptionalPublicationBasisRef | Draft可无；Submitted必须typed固定PublicationBasis |
| review_ref | OptionalReviewHandoffRef | Draft可无；submit同UoW生成独立review责任 |
| state | PublicationApplicationState | Draft/Submitted/Terminated |
| revision | MarketRevision | repo返回用于optimistic save |

| 状态 | 作用 |
|---|---|
| Draft | 允许改草稿输入 |
| Submitted | 固定申请基线，等待独立handoff/决定 |
| Terminated | 本地申请终止，不复活 |

| 成员函数 | 作用 |
|---|---|
| revise(DraftPublicationInput input) | 仅Draft更新，旧basis保留 |
| submit(QualifiedPublicationInput input) | 固定basis及review责任，Draft到Submitted |
| terminate(ApplicationTerminationInput input) | 本地终止；不撤销已产生外部决定/交接 |

| 工厂函数 | 作用 |
|---|---|
| draft(DraftPublicationInput input) | 初始Draft，不从材料存在自动提交 |

| 禁止事项 | 说明 |
|---|---|
| 越权/写入 | 不复制外部正文/authority；不由query推进状态 |

#### ReviewHandoff

| 项 | 内容 |
|---|---|
| 所属部分 | U2 |
| 对象类型 | entity |
| 主要责任 | 申请到Governance的局部交接进度 |

| 字段 | 类型 | 作用 |
|---|---|---|
| handoff_ref | ReviewHandoffRef | 提交时原子生成 |
| application_ref | PublicationApplicationRef | 原申请固定关联 |
| basis_ref | PublicationBasisRef | 原审查对象 |
| dispatch_outcome_ref | OptionalReviewDispatchOutcomeRef | WaitingDecision/Unknown/Failed保存原意图交接结果或安全unknown来源 |
| failure_ref | OptionalSafeFailureRef | ContractBlocked/Failed/Unknown具安全缺口/失败依据 |
| decision_binding | OptionalGovernanceDecisionBinding | 仅正式matched决定存在时 |
| state | ReviewHandoffState | 局部进度而非Approved |

| 状态 | 作用 |
|---|---|
| PendingDispatch | 待原意图交接 |
| WaitingDecision | 正式接收申请，非批准 |
| MatchedDecision | 匹配正式决定已关联，决定outcome仍需读取 |
| CommitUnknown | 交接结果未知，原意图probe |
| ContractBlocked | consumer/SDK合同或binding不具备 |
| Failed | 明确未接收失败，可据原意图安全重试 |

| 成员函数 | 作用 |
|---|---|
| record_dispatch(ReviewDispatchOutcomeInput outcome) | 正式接收/失败/unknown分轴 |
| record_decision(GovernanceDecisionBinding binding) | 仅matched正式结果，不自行审核 |
| block(ContractGapInput gap) | 缺合同/不匹配不推进 |

| 工厂函数 | 作用 |
|---|---|
| prepare(SubmittedApplicationInput input) | 初始PendingDispatch |

| 禁止事项 | 说明 |
|---|---|
| 越权/写入 | 不复制外部正文/authority；不由query推进状态 |

#### GovernanceDecisionBinding

| 项 | 内容 |
|---|---|
| 所属部分 | U2 |
| 对象类型 | reference object |
| 主要责任 | 正式决定与market审核对象的适用绑定 |

| 字段 | 类型 | 作用 |
|---|---|---|
| decision_ref | GovernanceDecisionRef | Gov正式来源 |
| application_ref | PublicationApplicationRef | 指定申请，不泛化 |
| basis_ref | PublicationBasisRef | 来源/材料/scope完整绑定 |
| outcome_ref | GovernanceOutcomeRef | 正式approved/rejected等结果ref，非本地enum |
| validity_ref | DecisionValidityRef | 有效期/替代/撤销正式依据 |

无独立生命周期；immutable记录/值或stateless策略，不伪造状态机。

| 成员函数 | 作用 |
|---|---|
| applies(PublicationBasis basis, CurrentDecisionInput current) | matched且current approved才可上架 |

| 工厂函数 | 作用 |
|---|---|
| from_governance(QualifiedDecisionInput input) | 无positive合同不建有效binding |

| 禁止事项 | 说明 |
|---|---|
| 越权/写入 | 不复制外部正文/authority；不由query推进状态 |

#### ReviewBindingPolicy

| 项 | 内容 |
|---|---|
| 所属部分 | U2 |
| 对象类型 | policy |
| 主要责任 | 决定不由ACK或材料替代 |

| 字段 | 类型 | 作用 |
|---|---|---|
| requirements | ReviewBindingRequirements | 正式审查适用需求 |

无独立生命周期；immutable记录/值或stateless策略，不伪造状态机。

| 成员函数 | 作用 |
|---|---|
| evaluate(PublicationBasis basis, GovernanceDecisionBinding decision, CurrentDecisionInput current) | 验证申请/来源版本/材料/scope与有效性 |

| 工厂函数 | 作用 |
|---|---|
| 无工厂业务入口 | stateless策略/typed view assembler调用，不新增truth |

| 禁止事项 | 说明 |
|---|---|
| 越权/写入 | 不复制外部正文/authority；不由query推进状态 |

#### ApplicationProgressView

| 项 | 内容 |
|---|---|
| 所属部分 | U2 |
| 对象类型 | read view |
| 主要责任 | 本地申请与外部决定分开显示 |

| 字段 | 类型 | 作用 |
|---|---|---|
| application_ref | PublicationApplicationRef | 本地truth |
| review_ref | ReviewHandoffRef | 独立交接进度 |
| decision_binding | OptionalGovernanceDecisionBinding | body-free可见决定依据 |
| status | ReadSurfaceKind | 只读missing/stale/degraded安全结果 |

无独立生命周期；immutable记录/值或stateless策略，不伪造状态机。

| 成员函数 | 作用 |
|---|---|
| 无业务变更成员 | immutable仅typed读取/校验；rehydrate后移03 |

| 工厂函数 | 作用 |
|---|---|
| assemble(ApplicationProgressReadInput input) | 不从MatchedDecision推approved |

| 禁止事项 | 说明 |
|---|---|
| 越权/写入 | 不复制外部正文/authority；不由query推进状态 |

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

#### DistributionIntent

| 项 | 内容 |
|---|---|
| 所属部分 | U4 |
| 对象类型 | aggregate |
| 主要责任 | 一次exact版本consumer获取意图 |

| 字段 | 类型 | 作用 |
|---|---|---|
| intent_ref | DistributionIntentRef | 本地ID |
| version_ref | MarketVersionRef | 用户明确选择，不latest |
| consumer_ref | DistributionConsumerRef | 正式receiver/scope绑定 |
| receiver_ref | DistributionReceiverRef | 正式typed receiver，不猜类型→安装目标 |
| scope_ref | MarketScopeRef | 当前authority范围 |
| state | DistributionIntentState | Accepted/Cancelled |
| revision | MarketRevision | repo并发版本 |

| 状态 | 作用 |
|---|---|
| Accepted | 本地受理，有耐久交接责任，非installed |
| Cancelled | 本地不再启动新派发，既有external结果继续对账 |

| 成员函数 | 作用 |
|---|---|
| cancel(DistributionCancelInput input) | 本地取消，发出/unknown不得假造外部取消 |

| 工厂函数 | 作用 |
|---|---|
| accept(QualifiedAcquisitionInput input) | 同version序列化下当前gate成立，初始Accepted |

| 禁止事项 | 说明 |
|---|---|
| 越权/写入 | 不复制外部正文/authority；不由query推进状态 |

#### DistributionRelation

| 项 | 内容 |
|---|---|
| 所属部分 | U4 |
| 对象类型 | entity |
| 主要责任 | 已知获取与版本关联，非安装集合 |

| 字段 | 类型 | 作用 |
|---|---|---|
| relation_ref | DistributionRelationRef | 与intent同UoW分配 |
| intent_ref | DistributionIntentRef | 唯一意图关联 |
| version_ref | MarketVersionRef | 固定版本 |
| consumer_ref | DistributionConsumerRef | 正式消费关联 |
| outcome_binding | OptionalReceiverOutcomeBinding | 仅匹配正式结果回指 |

无独立生命周期；immutable记录/值或stateless策略，不伪造状态机。

| 成员函数 | 作用 |
|---|---|
| attach(ReceiverOutcomeBinding binding) | 追加正式结果，迟到时触发影响补充 |

| 工厂函数 | 作用 |
|---|---|
| for_intent(AcceptedDistributionInput input) | 本地已知关系，未确认不能称安装 |

| 禁止事项 | 说明 |
|---|---|
| 越权/写入 | 不复制外部正文/authority；不由query推进状态 |

#### DistributionAttempt

| 项 | 内容 |
|---|---|
| 所属部分 | U4 |
| 对象类型 | entity |
| 主要责任 | 每次外部交接尝试及commit未知 |

| 字段 | 类型 | 作用 |
|---|---|---|
| attempt_ref | DistributionAttemptRef | 本地ID |
| intent_ref | DistributionIntentRef | 原意图不变 |
| fence | DispatchFence | 本地claim/dispatch许可版本，非外部授权 |
| outcome_binding | OptionalReceiverOutcomeBinding | Confirmed必有matching结果 |
| failure_ref | OptionalSafeFailureRef | Failed/Blocked/Unknown安全来源 |
| state | DistributionAttemptState | Prepared/Dispatching/Confirmed/Failed/CommitUnknown/Blocked |
| revision | MarketRevision | 原子保存/旧fence拒绝 |

| 状态 | 作用 |
|---|---|
| Prepared | 尚未派发，需当前gate |
| Dispatching | 已获局部dispatch许可，可能外部commit |
| Confirmed | 正式receiver outcome匹配，仅局部映射 |
| Failed | 正式证明未提交失败；重试需安全原意图依据 |
| CommitUnknown | 提交可能发生，禁止盲retry |
| Blocked | 派发前合同/资格不成立，不自恢复 |

| 成员函数 | 作用 |
|---|---|
| begin(CurrentDispatchGateInput input) | 已持久化许可，派发前重核验 |
| settle(ReceiverOutcomeInput input) | 正式匹配结果→Confirmed/Failed/CommitUnknown |
| block(ContractGapInput gap) | 未派发资格不成立，保存缺口 |

| 工厂函数 | 作用 |
|---|---|
| prepare(DistributionDispatchInput input) | 初始Prepared，intent先于外部effect |

| 禁止事项 | 说明 |
|---|---|
| 越权/写入 | 不复制外部正文/authority；不由query推进状态 |

#### ReceiverOutcomeBinding

| 项 | 内容 |
|---|---|
| 所属部分 | U4 |
| 对象类型 | reference object |
| 主要责任 | 正式receiver结果与原意图绑定 |

| 字段 | 类型 | 作用 |
|---|---|---|
| outcome_ref | ReceiverOutcomeRef | receiver正式结果 |
| intent_ref | DistributionIntentRef | 原外部幂等意图 |
| version_ref | MarketVersionRef | 与sourcebinding匹配 |
| consumer_ref | DistributionConsumerRef | 指定consumer |
| receiver_ref | DistributionReceiverRef | 来源owner匹配 |
| scope_ref | MarketScopeRef | 正式结果范围 |

无独立生命周期；immutable记录/值或stateless策略，不伪造状态机。

| 成员函数 | 作用 |
|---|---|
| matches(DistributionOutcomeContext input) | 逐binding匹配，ACK不等结果 |

| 工厂函数 | 作用 |
|---|---|
| from_receiver(QualifiedReceiverOutcome input) | 不生成installed/paid |

| 禁止事项 | 说明 |
|---|---|
| 越权/写入 | 不复制外部正文/authority；不由query推进状态 |

#### AcquisitionGatePolicy

| 项 | 内容 |
|---|---|
| 所属部分 | U4 |
| 对象类型 | policy |
| 主要责任 | 新受理与未派发当前资格检查 |

| 字段 | 类型 | 作用 |
|---|---|---|
| requirements | AcquisitionRequirements | 正式source/auth/Gov/receiver与market未撤回要求 |

无独立生命周期；immutable记录/值或stateless策略，不伪造状态机。

| 成员函数 | 作用 |
|---|---|
| evaluate(MarketVersion version, CurrentQualificationInput current, AcquisitionTargetInput target) | 每次当前依据，免费不豁免 |

| 工厂函数 | 作用 |
|---|---|
| 无工厂业务入口 | stateless策略/typed view assembler调用，不新增truth |

| 禁止事项 | 说明 |
|---|---|
| 越权/写入 | 不复制外部正文/authority；不由query推进状态 |

#### DistributionReadView

| 项 | 内容 |
|---|---|
| 所属部分 | U4 |
| 对象类型 | read view |
| 主要责任 | 自有scope获取资格/关系/attempt进度 |

| 字段 | 类型 | 作用 |
|---|---|---|
| intent_ref | OptionalDistributionIntentRef | 资格读面可无意图，不自动建 |
| relation_ref | OptionalDistributionRelationRef | 已知局部关系 |
| attempt_refs | DistributionAttemptRefSet | 已保存历史及unknown |
| read_context | QualifiedReadContext | 当前范围，不因旧成功泄漏 |
| status | ReadSurfaceKind | 结果安全姿态 |

无独立生命周期；immutable记录/值或stateless策略，不伪造状态机。

| 成员函数 | 作用 |
|---|---|
| 无业务变更成员 | immutable仅typed读取/校验；rehydrate后移03 |

| 工厂函数 | 作用 |
|---|---|
| assemble(DistributionReadInput input) | 不把confirmed展示Installed/支付成功 |

| 禁止事项 | 说明 |
|---|---|
| 越权/写入 | 不复制外部正文/authority；不由query推进状态 |

#### WithdrawalDisposition

| 项 | 内容 |
|---|---|
| 所属部分 | U5 |
| 对象类型 | immutable disposition record |
| 主要责任 | 正式依据对应本地版本限制/撤回 |

| 字段 | 类型 | 作用 |
|---|---|---|
| disposition_ref | WithdrawalDispositionRef | 本地ID |
| version_ref | MarketVersionRef | exact处置对象 |
| authority_ref | DispositionAuthorityRef | 正式处置依据/来源资格失效依据 |
| action | MarketDispositionKind | 仅Restrict/Withdraw本地有限意图 |
| reason_ref | SafeReasonRef | 安全原因，不原正文 |
| source_cursor | MarketSourceCursor | 同UoW提交序列用于影响增量 |

无独立生命周期；immutable记录/值或stateless策略，不伪造状态机。

| 成员函数 | 作用 |
|---|---|
| 无业务变更成员 | immutable仅typed读取/校验；rehydrate后移03 |

| 工厂函数 | 作用 |
|---|---|
| record(QualifiedDispositionInput input) | 有据追加，本地处置与U3版本同事务 |

| 禁止事项 | 说明 |
|---|---|
| 越权/写入 | 不复制外部正文/authority；不由query推进状态 |

#### ImpactRecord

| 项 | 内容 |
|---|---|
| 所属部分 | U5 |
| 对象类型 | entity |
| 主要责任 | known relation/unknown handoff影响及覆盖缺口 |

| 字段 | 类型 | 作用 |
|---|---|---|
| impact_ref | ImpactRecordRef | 本地ID |
| disposition_ref | WithdrawalDispositionRef | 原处置关联 |
| relation_refs | DistributionRelationRefSet | 本地已知exact版本关系 |
| unknown_attempt_refs | DistributionAttemptRefSet | 保守未知交接集合 |
| coverage_cursor | MarketSourceCursor | 稳定枚举及late增量来源 |
| coverage_kind | ImpactCoverageKind | Partial/KnownScopeComplete不代表全安装 |

| 状态 | 作用 |
|---|---|
| Partial | 已知范围枚举尚有本地cursor缺口 |
| KnownScopeComplete | 指定cursor内已知集合完整，late关系仍增量；非全安装覆盖 |

| 成员函数 | 作用 |
|---|---|
| include(ImpactDeltaInput delta) | 按relation/attempt去重增量，保留coverage gap |

| 工厂函数 | 作用 |
|---|---|
| start(ImpactEnumerationInput input) | 初始Partial |

| 禁止事项 | 说明 |
|---|---|
| 越权/写入 | 不复制外部正文/authority；不由query推进状态 |

#### NoticeIntent

| 项 | 内容 |
|---|---|
| 所属部分 | U5 |
| 对象类型 | aggregate |
| 主要责任 | 一次风险通知责任与尝试结果 |

| 字段 | 类型 | 作用 |
|---|---|---|
| notice_ref | NoticeIntentRef | 本地ID |
| impact_ref | ImpactRecordRef | 影响对象 |
| target_ref | NoticeTargetRef | 正式可通知目标，非全安装用户 |
| channel_ref | NoticeChannelRef | 正式通道，缺合同不派发 |
| failure_ref | OptionalSafeFailureRef | Blocked/Failed/Unknown的安全来源 |
| dispatch_fence | OptionalDispatchFence | Dispatching必有原intent当前许可；旧fence结果不得覆盖 |
| outcome_binding | OptionalNoticeOutcomeBinding | 正式结果可选，ACK不是delivered |
| state | NoticeIntentState | Prepared/Dispatching/Confirmed/Failed/CommitUnknown/Blocked |
| revision | MarketRevision | claim及结果旧fence保护 |

| 状态 | 作用 |
|---|---|
| Prepared | 通知计划成立，未发出 |
| Dispatching | 已持久发送许可，结果独立 |
| Confirmed | 匹配正式通道结果可查；是否送达由owner outcome说明 |
| Failed | 明确未提交失败，允许安全原意图重试 |
| CommitUnknown | 可能发送，不盲重试 |
| Blocked | 通道/目标/权限合同不具备 |

| 成员函数 | 作用 |
|---|---|
| begin(NoticeDispatchInput input) | 原意图已持久，当前channel/授权合格 |
| settle(NoticeOutcomeInput input) | matching正式通道结果，不自造送达 |
| block(ContractGapInput gap) | 保存缺口不复活版本 |

| 工厂函数 | 作用 |
|---|---|
| prepare(QualifiedNoticePlanInput input) | 初始Prepared，deferred work同事务 |

| 禁止事项 | 说明 |
|---|---|
| 越权/写入 | 不复制外部正文/authority；不由query推进状态 |

#### NoticeOutcomeBinding

| 项 | 内容 |
|---|---|
| 所属部分 | U5 |
| 对象类型 | reference object |
| 主要责任 | 正式通知结果的绑定 |

| 字段 | 类型 | 作用 |
|---|---|---|
| outcome_ref | NoticeOutcomeRef | channel正式结果 |
| notice_ref | NoticeIntentRef | 原意图关联 |
| target_ref | NoticeTargetRef | 指定通知目标 |
| channel_ref | NoticeChannelRef | 结果来源 |
| scope_ref | MarketScopeRef | 安全披露范围 |

无独立生命周期；immutable记录/值或stateless策略，不伪造状态机。

| 成员函数 | 作用 |
|---|---|
| matches(NoticeOutcomeContext context) | 同意图/target/channel/scope才采纳 |

| 工厂函数 | 作用 |
|---|---|
| from_channel(QualifiedNoticeOutcome input) | 不推read/remediated |

| 禁止事项 | 说明 |
|---|---|
| 越权/写入 | 不复制外部正文/authority；不由query推进状态 |

#### WithdrawalImpactPolicy

| 项 | 内容 |
|---|---|
| 所属部分 | U5 |
| 对象类型 | policy |
| 主要责任 | 处置与影响通知不互为成功前置 |

| 字段 | 类型 | 作用 |
|---|---|---|
| requirements | DispositionRequirements | 正式authority与已知范围约束 |

无独立生命周期；immutable记录/值或stateless策略，不伪造状态机。

| 成员函数 | 作用 |
|---|---|
| evaluate(MarketVersion version, QualifiedDispositionInput basis) | 限制/撤回的本地允许性 |
| classify(DistributionImpactInput input) | known/unknown/late候选，不扫描外部全安装集合 |

| 工厂函数 | 作用 |
|---|---|
| 无工厂业务入口 | stateless策略/typed view assembler调用，不新增truth |

| 禁止事项 | 说明 |
|---|---|
| 越权/写入 | 不复制外部正文/authority；不由query推进状态 |

#### ImpactNoticeView

| 项 | 内容 |
|---|---|
| 所属部分 | U5 |
| 对象类型 | read view |
| 主要责任 | 已知影响覆盖与通知分轴 |

| 字段 | 类型 | 作用 |
|---|---|---|
| disposition_ref | WithdrawalDispositionRef | 已提交处置 |
| impact_ref | ImpactRecordRef | 已知集合/coverage |
| notice_refs | NoticeIntentRefSet | safe attempts/results |
| read_context | QualifiedReadContext | 同scope裁剪数量/细节 |

无独立生命周期；immutable记录/值或stateless策略，不伪造状态机。

| 成员函数 | 作用 |
|---|---|
| 无业务变更成员 | immutable仅typed读取/校验；rehydrate后移03 |

| 工厂函数 | 作用 |
|---|---|
| assemble(ImpactNoticeReadInput input) | 不由notice confirmed推撤回全覆盖 |

| 禁止事项 | 说明 |
|---|---|
| 越权/写入 | 不复制外部正文/authority；不由query推进状态 |

#### OperationContext

| 项 | 内容 |
|---|---|
| 所属部分 | U6 |
| 对象类型 | immutable context value |
| 主要责任 | 唯一operation/scope/key/canonical意图语境 |

| 字段 | 类型 | 作用 |
|---|---|---|
| operation_kind | MarketOperationKind | Entry有限command/job分类 |
| scope_ref | MarketScopeRef | 正式scope resolver输出 |
| metadata_ref | SharedMetadataReference | 引用Core command/query或本地worker wrapper，不重复字段authority |
| intent_fingerprint | MarketIntentFingerprint | 本地规范意图指纹算法03收口，非资产digest |

无独立生命周期；immutable记录/值或stateless策略，不伪造状态机。

| 成员函数 | 作用 |
|---|---|
| same_intent(OperationContext candidate) | 不以key单独判断相同 |

| 工厂函数 | 作用 |
|---|---|
| from_entry(QualifiedOperationInput input) | command key来自meta.request；worker仅其正式wrapper |

| 禁止事项 | 说明 |
|---|---|
| 越权/写入 | 不复制外部正文/authority；不由query推进状态 |

#### OperationRecord

| 项 | 内容 |
|---|---|
| 所属部分 | U6 |
| 对象类型 | entity |
| 主要责任 | 幂等预占/完成与原结果定位 |

| 字段 | 类型 | 作用 |
|---|---|---|
| operation_ref | MarketOperationRef | 本地ID |
| context | OperationContext | operation/scope/key/intent规范组合 |
| result_ref | OptionalStoredOperationResultRef | Completed必有完整结果 |
| state | OperationRecordState | Reserved/Completed |
| revision | MarketRevision | 唯一键/CAS来源 |

| 状态 | 作用 |
|---|---|
| Reserved | 本地预占未完成，竞争返回in-progress/reconcile |
| Completed | 原结果已保存，可typed重放，禁止重跑domain |

| 成员函数 | 作用 |
|---|---|
| complete(StoredOperationResult result) | 与accepted变化/audit/work同UoW保存完整原值 |

| 工厂函数 | 作用 |
|---|---|
| reserve(QualifiedOperationInput input) | 初始Reserved；持久冲突不能假success |

| 禁止事项 | 说明 |
|---|---|
| 越权/写入 | 不复制外部正文/authority；不由query推进状态 |

#### StoredOperationResult

| 项 | 内容 |
|---|---|
| 所属部分 | U6 |
| 对象类型 | immutable result envelope |
| 主要责任 | command/job完整原public结果 |

| 字段 | 类型 | 作用 |
|---|---|---|
| result_ref | StoredOperationResultRef | 本地ID |
| operation_ref | MarketOperationRef | 与record绑定 |
| result_kind | MarketResultKind | 有限command/job类型，不能错kind读取 |
| safe_result | MarketResultSurface | 完整原receipt/status/subject/item/outcome/gap/cursor安全字段 |
| schema_ref | MarketResultSchemaRef | 本地正式schema版本03闭合，不伪造已发布版本 |

无独立生命周期；immutable记录/值或stateless策略，不伪造状态机。

| 成员函数 | 作用 |
|---|---|
| 无业务变更成员 | immutable仅typed读取/校验；rehydrate后移03 |

| 工厂函数 | 作用 |
|---|---|
| capture(OperationResultInput input) | 同UoW保存原结果，不用当前projection重建 |

| 禁止事项 | 说明 |
|---|---|
| 越权/写入 | 不复制外部正文/authority；不由query推进状态 |

#### MarketAuditRecord

| 项 | 内容 |
|---|---|
| 所属部分 | U6 |
| 对象类型 | append-only audit/history record |
| 主要责任 | 本地变化安全追溯唯一承载 |

| 字段 | 类型 | 作用 |
|---|---|---|
| audit_ref | MarketAuditRef | 本地ID |
| subject_ref | MarketAuditSubjectRef | typed market subject，不从ref字符串反推 |
| operation_ref | MarketOperationRef | 原意图关联 |
| actor_ref | ActorReference | Core ActorContext正式来源 |
| basis_refs | SafeBasisReferenceSet | 来源/决定/reason/outcome安全回指 |
| cursor | MarketSourceCursor | 本地提交后稳定排序，不自证外部audit |

无独立生命周期；immutable记录/值或stateless策略，不伪造状态机。

| 成员函数 | 作用 |
|---|---|
| 无业务变更成员 | immutable仅typed读取/校验；rehydrate后移03 |

| 工厂函数 | 作用 |
|---|---|
| append_fact(MarketAuditInput input) | 同UoW追加，不覆旧；纠错新record |

| 禁止事项 | 说明 |
|---|---|
| 越权/写入 | 不复制外部正文/authority；不由query推进状态 |

#### DeferredWork

| 项 | 内容 |
|---|---|
| 所属部分 | U6 |
| 对象类型 | entity |
| 主要责任 | accepted后的耐久副作用责任 |

| 字段 | 类型 | 作用 |
|---|---|---|
| work_ref | DeferredWorkRef | 本地ID |
| operation_ref | MarketOperationRef | 原操作 |
| target_ref | MarketWorkTargetRef | 有限typed review/distribution/notice/observation/projection target |
| intent_ref | MarketEffectIntentRef | 原外部幂等意图 |
| fence | DispatchFence | 本地claim许可token |
| result_ref | OptionalStoredOperationResultRef | settled工作原report回指 |
| state | DeferredWorkState | Pending/Claimed/Settled/Blocked |
| revision | MarketRevision | claim CAS/过期worker拒绝 |

| 状态 | 作用 |
|---|---|
| Pending | 耐久责任未claim |
| Claimed | 已有worker/fence，进程崩溃不代表effect失败 |
| Settled | 本地结果/report持久化完成，非外部全局成功 |
| Blocked | 合同/unknown/人工依据阻塞；有据原意图恢复 |

| 成员函数 | 作用 |
|---|---|
| claim(WorkClaimInput input) | fence持久化，过期claim需判断effectunknown |
| settle(WorkSettlementInput input) | 只本地责任完成/结果已存 |
| block(ContractGapInput gap) | 缺合同或unknown需probe，不任意再发 |

| 工厂函数 | 作用 |
|---|---|
| schedule(DurableResponsibilityInput input) | accepted同UoW初始Pending |

| 禁止事项 | 说明 |
|---|---|
| 越权/写入 | 不复制外部正文/authority；不由query推进状态 |

#### RecoveryIntent

| 项 | 内容 |
|---|---|
| 所属部分 | U6 |
| 对象类型 | entity |
| 主要责任 | 授权局部恢复语境与report |

| 字段 | 类型 | 作用 |
|---|---|---|
| recovery_ref | RecoveryIntentRef | 本地ID |
| target_ref | MarketWorkTargetRef | 原intent/attempt/projection typed目标 |
| authority_ref | RecoveryAuthorityRef | 正式操作权限/人工依据 |
| report_ref | OptionalStoredOperationResultRef | 逐item安全恢复结果 |
| state | RecoveryIntentState | Requested/Running/Completed/Blocked |
| revision | MarketRevision | 并发来源 |

| 状态 | 作用 |
|---|---|
| Requested | 恢复请求局部受理 |
| Running | 按原intent或qualified重建计划执行 |
| Completed | 本次本地report成立，不宣称业务恢复/ready |
| Blocked | 无probe/authority/typed输入，不盲修复 |

| 成员函数 | 作用 |
|---|---|
| begin(QualifiedRecoveryInput input) | scope/目标/原意图核对 |
| record(RecoveryOutcomeInput input) | report完整逐项保存，缺probe保持Blocked |

| 工厂函数 | 作用 |
|---|---|
| request(RecoveryRequestInput input) | 初始Requested，只受理局部恢复 |

| 禁止事项 | 说明 |
|---|---|
| 越权/写入 | 不复制外部正文/authority；不由query推进状态 |

#### ObservationOutcomeBinding

| 项 | 内容 |
|---|---|
| 所属部分 | U6 |
| 对象类型 | reference object |
| 主要责任 | 外部observability准入结果安全回指 |

| 字段 | 类型 | 作用 |
|---|---|---|
| outcome_ref | ObservationReceiptRef | 正式Obs结果ref |
| operation_ref | MarketOperationRef | 原审计交接意图 |
| audit_refs | MarketAuditRefSet | 已提交安全audit集 |
| scope_ref | MarketScopeRef | producer/披露范围 |

无独立生命周期；immutable记录/值或stateless策略，不伪造状态机。

| 成员函数 | 作用 |
|---|---|
| matches(ObservationOutcomeContext context) | 正式producer/材料/intent binding |

| 工厂函数 | 作用 |
|---|---|
| from_observer(QualifiedObservationOutcome input) | ACK不能生成admitted |

| 禁止事项 | 说明 |
|---|---|
| 越权/写入 | 不复制外部正文/authority；不由query推进状态 |

#### RecoveryPolicy

| 项 | 内容 |
|---|---|
| 所属部分 | U6 |
| 对象类型 | policy |
| 主要责任 | 原意图核对与局部恢复上限 |

| 字段 | 类型 | 作用 |
|---|---|---|
| requirements | RecoveryRequirements | 正式恢复/权限/原意图依据 |

无独立生命周期；immutable记录/值或stateless策略，不伪造状态机。

| 成员函数 | 作用 |
|---|---|
| evaluate(RecoveryIntent intent, RecoveryTargetInput target) | typed目标/现状/authority；unknown必须probe |
| classify(ExternalEffectInspectionInput input) | confirmed/known-not-committed/unknown，禁止猜结果 |

| 工厂函数 | 作用 |
|---|---|
| 无工厂业务入口 | stateless策略/typed view assembler调用，不新增truth |

| 禁止事项 | 说明 |
|---|---|
| 越权/写入 | 不复制外部正文/authority；不由query推进状态 |

#### AuditRecoveryView

| 项 | 内容 |
|---|---|
| 所属部分 | U6 |
| 对象类型 | read view |
| 主要责任 | local audit/result/work与external接纳分轴 |

| 字段 | 类型 | 作用 |
|---|---|---|
| operation_ref | MarketOperationRef | 本地语境 |
| audit_refs | MarketAuditRefSet | 安全追加历史 |
| work_refs | DeferredWorkRefSet | 耐久责任 |
| recovery_refs | RecoveryIntentRefSet | 恢复report引用 |
| observation_binding | OptionalObservationOutcomeBinding | 正式接纳独立来源 |

无独立生命周期；immutable记录/值或stateless策略，不伪造状态机。

| 成员函数 | 作用 |
|---|---|
| 无业务变更成员 | immutable仅typed读取/校验；rehydrate后移03 |

| 工厂函数 | 作用 |
|---|---|
| assemble(AuditRecoveryReadInput input) | 不能输出secret/rawlog/evidence/verdict |

| 禁止事项 | 说明 |
|---|---|
| 越权/写入 | 不复制外部正文/authority；不由query推进状态 |

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

### 跨对象审计

U1～7对象筛选与正式化各有独立附录02_hld_step_06_part_u1～u7；每部分先思考后卡片并内部停审。无重复sourcebinding/version/audit/operation/projection owner。§8/9预期读取/转换均有carrier与typed参数；外部Gov outcome、receivercommit、human资质不是本地state主语。

## 8. 回填草稿

正式§6仅摘录本文件§7及已pass部分附录，不带问题/诊断/历史审计；不新增结论。

## 9. 待确认事项

MP-UP-001～008、MP-SRC-003/010/013、Q-MP-01沿01保留，仅受影响正向lane blocked；不是owner已确认或已发送请求。

## 10. 进入下一步条件

P1～P8均完成；内部stop_review/pass。七部分卡片分批写入且pass；没有完整Rust签名/DDL；将来schema/exports映射仍需03，不编造可实现正向合同。 外部资格不关闭，允许进入Step 7。
