# Step6 U4 对象正式化

## 思考、诊断与取舍

关系固定intent/version/consumer，outcome不等安装。Intent取消与Attempt分轴；外部已提交或未知继续收敛，不能以Cancelled覆盖结果。Attempt fence需要typed持久输入，不凭私有map/索引恢复。

来源：Step5本部分功能/候选；计划：候选筛选→逐对象卡片→flow/state反查→回填→停审。当前卡片尚未落盘。

## 结构化对象与回填

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

## 候选排除与状态型别

ID/Ref/Revision/Cursor/SafeReason等标量是字段类型不是新实体，03需校验/codec。Command/Result DTO、Service/Entry、Port/Repository/Adapter交Step7/03；未进入domain。每个state enum只属于其carrier，不共享GlobalState；状态表在carrier卡片完整定义，故不另建重复枚举对象。History关联复用U6 MarketAuditRecord，不另建未拥有生命周期的七套record。

## 自检与停审

候选全部独立展开或明确字段-only/接缝-only；每卡有所属/类型/字段作用/typed参数/factory/禁止事项，状态trigger将由Step7/8点名。正式§6摘录上述卡片。U4 internal stop_review/pass，允许下一部分；未宣称完整schema可实现或owner支持。
