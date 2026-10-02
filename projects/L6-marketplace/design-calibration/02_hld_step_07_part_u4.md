# Step7 U4 接口小循环

## 问题、诊断与取舍

受理与派发许可都按marketversion serialization，撤回后没有新admission。dispatch许可持久后属于已handoff可能集，timeoutunknown保守纳影响；API request不能保证跨owner瞬时撤销。

计划：入口分类→对象反查→typed骨架→flow/state反查→回填→停审；当前表尚未写入。

## 结构化接口与回填

### Command

| API | 输入骨架 | 输出骨架 | 主要处理 | 写入结果 |
|---|---|---|---|---|
| RequestDistribution | QualifiedAcquisitionInput input（exact version/consumer/receiver/scope）；ActorContext actor；CommandMetadata meta（key唯一meta.request） | DistributionResult | resolver当前source/auth/Gov/receiver资格与exact版本；同版本序列化，AcquisitionGatePolicy.evaluate(MarketVersion version, CurrentQualificationInput current, AcquisitionTargetInput target)；DistributionIntent.accept(QualifiedAcquisitionInput input)；DistributionRelation.for_intent(AcceptedDistributionInput input)；DistributionAttempt.prepare(DistributionDispatchInput input) | DistributionIntent + Relation + PreparedAttempt + work/audit/result |
| CancelDistribution | DistributionIntentRef intent_ref；DistributionCancelInput input；ActorContext actor；CommandMetadata meta（key唯一meta.request） | DistributionResult | consumer当前授权+typed意图/attempt/fence；DistributionIntent.cancel(DistributionCancelInput input) | Cancelled intent + 原attempt/未知责任保留 |
| RecordReceiverOutcome | DistributionAttemptRef attempt_ref；QualifiedReceiverOutcome input；ActorContext actor；CommandMetadata meta（key唯一meta.request） | DistributionResult | receiver正式来源与intent/version/consumer/receiver/scope全binding；DistributionAttempt.settle(ReceiverOutcomeInput input)；DistributionRelation.attach(ReceiverOutcomeBinding binding)；若已撤回/限制，则增量knownimpact和notice待交接责任 | attempt formalmapped result + relation outcome + 迟到影响责任 |

### Query

| API | 输入骨架 | 输出骨架 | 读取来源 | 边界 |
|---|---|---|---|---|
| GetAcquisitionEligibility | AcquisitionEligibilityReadInput input（exact version/consumer/scope）；ActorContext actor；QueryMetadata meta | DistributionReadView | 当前正式资格+exact市场版本 | 不创建intent、免费不豁免、不造财务 |
| GetDistributionProgress | DistributionIntentRef intent_ref；ActorContext actor；QueryMetadata meta | DistributionReadView | intent/relation/attempt/receiverbinding | 旧成功不绕权限，不探测/重试 |

### Job

| Job | 输入来源 | 输出结果 | 边界 |
|---|---|---|---|
| DispatchDistribution | DistributionAttemptRef attempt_ref；DeferredWorkRef work_ref；MarketWorkerContext context | DistributionJobReport，含逐项target/outcome/gap/result refs | attempt/work结果及安全item refs；已许可后外部瞬时撤销不保证；unknown不能盲发 |
| ReconcileDistribution | DistributionAttemptRef attempt_ref；DeferredWorkRef work_ref；MarketWorkerContext context | DistributionJobReport，含逐项target/outcome/gap/result refs | 原attempt结果/knownimpact增量/report；不猜installed，不由intentCancelled覆盖formal结果 |


## 自检与停审

对象/函数来源均已在Step6；command metadata唯一，query只读；job是worker-internal formal surface，其key由本地worker wrapper唯一提供而非复制Core command字段。没有activeevent/假schema；本部分接口逐个对应Step8flow和Step9trigger。正式§7摘录表与边界。U4 internal stop_review/pass。
