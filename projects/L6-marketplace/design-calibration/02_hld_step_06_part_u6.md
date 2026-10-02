# Step6 U6 对象正式化

## 思考、诊断与取舍

补充OperationContext属于Step4统一幂等机制发现的context值，不新增业务truth。完整result、record、audit、work分开独立卡，使用同local UoW。Claimed旧fence/worker崩溃只能核对原effect，不能当自动retry。

来源：Step5本部分功能/候选；计划：候选筛选→逐对象卡片→flow/state反查→回填→停审。当前卡片尚未落盘。

## 结构化对象与回填

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

## 候选排除与状态型别

ID/Ref/Revision/Cursor/SafeReason等标量是字段类型不是新实体，03需校验/codec。Command/Result DTO、Service/Entry、Port/Repository/Adapter交Step7/03；未进入domain。每个state enum只属于其carrier，不共享GlobalState；状态表在carrier卡片完整定义，故不另建重复枚举对象。History关联复用U6 MarketAuditRecord，不另建未拥有生命周期的七套record。

## 自检与停审

候选全部独立展开或明确字段-only/接缝-only；每卡有所属/类型/字段作用/typed参数/factory/禁止事项，状态trigger将由Step7/8点名。正式§6摘录上述卡片。U6 internal stop_review/pass，允许下一部分；未宣称完整schema可实现或owner支持。
