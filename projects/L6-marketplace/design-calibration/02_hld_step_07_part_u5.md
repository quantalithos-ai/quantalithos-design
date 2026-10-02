# Step7 U5 接口小循环

## 问题、诊断与取舍

U5处置必须通过U3 MarketVersion领域方法，唯一writer不重复。Enumerate增量范围+notice计划分开，通知外部未知不能改撤回truth；所有结果只formalref。

计划：入口分类→对象反查→typed骨架→flow/state反查→回填→停审；当前表尚未写入。

## 结构化接口与回填

### Command

| API | 输入骨架 | 输出骨架 | 主要处理 | 写入结果 |
|---|---|---|---|---|
| RestrictMarketVersion | MarketVersionRef version_ref；QualifiedDispositionInput input（Restrict）；ActorContext actor；CommandMetadata meta（key唯一meta.request） | WithdrawalResult | 正式失效/未知资格或处置authority，不假造外部撤销；同version serialization，WithdrawalDisposition.record(QualifiedDispositionInput input)；MarketVersion.restrict(VersionRestrictionInput input)；ImpactRecord.start(ImpactEnumerationInput input) | WithdrawalDisposition + Restricted MarketVersion + PartialImpact + work/audit/result |
| WithdrawMarketVersion | MarketVersionRef version_ref；QualifiedDispositionInput input（Withdraw）；ActorContext actor；CommandMetadata meta（key唯一meta.request） | WithdrawalResult | 正式撤回authority/处置理由；同version serialization，与U4受理/许可竞争；MarketVersion.withdraw(VersionWithdrawalInput input)；ImpactRecord.start(ImpactEnumerationInput input) | WithdrawalDisposition + Withdrawn MarketVersion + PartialImpact + work/audit/result |
| PlanImpactNotifications | ImpactRecordRef impact_ref；QualifiedNoticePlanInput input；ActorContext actor；CommandMetadata meta（key唯一meta.request） | NoticePlanResult | scope内knownrelation/unknown candidates固定关联；正式channel/target授权具备才生成可派发计划；NoticeIntent.prepare(QualifiedNoticePlanInput input) | 去重NoticeIntent + work/audit/result |
| RecordNoticeOutcome | NoticeIntentRef notice_ref；QualifiedNoticeOutcome input；ActorContext actor；CommandMetadata meta（key唯一meta.request） | NoticeResult | 正式通道来源，notice/target/channel/scope匹配；NoticeIntent.settle(NoticeOutcomeInput input) | NoticeOutcomeBinding + notice state/audit/result |

### Query

| API | 输入骨架 | 输出骨架 | 读取来源 | 边界 |
|---|---|---|---|---|
| GetWithdrawalImpact | WithdrawalDispositionRef disposition_ref；MarketPageInput page；ActorContext actor；QueryMetadata meta | ImpactNoticeView | disposition/impact+knownrelations | 不声称全安装受影响集合 |
| GetNoticeProgress | NoticeIntentRef notice_ref；ActorContext actor；QueryMetadata meta | ImpactNoticeView | notice/outcomebinding/audit历史 | 读取不发通知；Confirmed不硬翻译Delivered |

### Job

| Job | 输入来源 | 输出结果 | 边界 |
|---|---|---|---|
| EnumerateKnownImpact | WithdrawalDispositionRef disposition_ref；DeferredWorkRef work_ref；MarketWorkerContext context | ImpactEnumerationReport，含逐项target/outcome/gap/result refs | ImpactRecord增量/coverage及notice planning责任；不扫描外部全安装集合 |
| DispatchNotice | NoticeIntentRef notice_ref；DeferredWorkRef work_ref；MarketWorkerContext context | NoticeJobReport，含逐项target/outcome/gap/result refs | notice/work结果；不以外部失败回滚撤回 |
| ReconcileNotice | NoticeIntentRef notice_ref；DeferredWorkRef work_ref；MarketWorkerContext context | NoticeJobReport，含逐项target/outcome/gap/result refs | 原notice outcome/report；不得造通知成功/新意图盲发 |


## 自检与停审

对象/函数来源均已在Step6；command metadata唯一，query只读；job是worker-internal formal surface，其key由本地worker wrapper唯一提供而非复制Core command字段。没有activeevent/假schema；本部分接口逐个对应Step8flow和Step9trigger。正式§7摘录表与边界。U5 internal stop_review/pass。
