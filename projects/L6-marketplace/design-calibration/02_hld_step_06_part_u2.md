# Step6 U2 对象正式化

## 思考、诊断与取舍

申请state、reviewhandoff与Gov决定分轴；basis改动需Draft revise或新申请，不改Submitted。MatchedDecision只ref存在，拒绝Approved本地状态；pending unknown恢复只原handoff。

来源：Step5本部分功能/候选；计划：候选筛选→逐对象卡片→flow/state反查→回填→停审。当前卡片尚未落盘。

## 结构化对象与回填

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

## 候选排除与状态型别

ID/Ref/Revision/Cursor/SafeReason等标量是字段类型不是新实体，03需校验/codec。Command/Result DTO、Service/Entry、Port/Repository/Adapter交Step7/03；未进入domain。每个state enum只属于其carrier，不共享GlobalState；状态表在carrier卡片完整定义，故不另建重复枚举对象。History关联复用U6 MarketAuditRecord，不另建未拥有生命周期的七套record。

## 自检与停审

候选全部独立展开或明确字段-only/接缝-only；每卡有所属/类型/字段作用/typed参数/factory/禁止事项，状态trigger将由Step7/8点名。正式§6摘录上述卡片。U2 internal stop_review/pass，允许下一部分；未宣称完整schema可实现或owner支持。

## Step9反查修复

状态条件字段审计发现初始态/失败态不能强制持有尚不存在的typed关联。本卡已补Optional条件与缺失行为；Draft输入是持久安全候选，Submitted才固定正式basis/review。修复来自既有状态/flow，不新增业务范围。

## Step9反查修复

状态条件字段审计发现初始态/失败态不能强制持有尚不存在的typed关联。本卡已补Optional条件与缺失行为；Draft输入是持久安全候选，Submitted才固定正式basis/review。修复来自既有状态/flow，不新增业务范围。
