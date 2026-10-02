# Step6 U5 对象正式化

## 思考、诊断与取舍

WithdrawalDisposition是immutable actionrecord，不新增外部撤销state。Impact只本地cursor内已知集；KnownScopeComplete并非全覆盖。NoticeIntent引用attempt历史由U6 audit/work，状态只能通道正式结果映射。

来源：Step5本部分功能/候选；计划：候选筛选→逐对象卡片→flow/state反查→回填→停审。当前卡片尚未落盘。

## 结构化对象与回填

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

## 候选排除与状态型别

ID/Ref/Revision/Cursor/SafeReason等标量是字段类型不是新实体，03需校验/codec。Command/Result DTO、Service/Entry、Port/Repository/Adapter交Step7/03；未进入domain。每个state enum只属于其carrier，不共享GlobalState；状态表在carrier卡片完整定义，故不另建重复枚举对象。History关联复用U6 MarketAuditRecord，不另建未拥有生命周期的七套record。

## 自检与停审

候选全部独立展开或明确字段-only/接缝-only；每卡有所属/类型/字段作用/typed参数/factory/禁止事项，状态trigger将由Step7/8点名。正式§6摘录上述卡片。U5 internal stop_review/pass，允许下一部分；未宣称完整schema可实现或owner支持。

## Step9反查修复

状态条件字段审计发现初始态/失败态不能强制持有尚不存在的typed关联。本卡已补Optional条件与缺失行为；Draft输入是持久安全候选，Submitted才固定正式basis/review。修复来自既有状态/flow，不新增业务范围。
