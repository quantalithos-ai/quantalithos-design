# Step7 U6 接口小循环

## 问题、诊断与取舍

U6可靠性是所有command/job共同应用规则，不另开无依据外部audit truth。OperationGet与save/get pair独立，job报告含逐item，不丢失refs；Recovery不能让worker直接SQL修业务state。

计划：入口分类→对象反查→typed骨架→flow/state反查→回填→停审；当前表尚未写入。

## 结构化接口与回填

### Command

| API | 输入骨架 | 输出骨架 | 主要处理 | 写入结果 |
|---|---|---|---|---|
| RequestMarketRecovery | RecoveryRequestInput input（typed原intent/attempt/projection target）；ActorContext actor；CommandMetadata meta（key唯一meta.request） | RecoveryResult | 正式operator/system actor scope与恢复authority；RecoveryIntent.request(RecoveryRequestInput input) | Requested RecoveryIntent + durable work/audit/result |

### Query

| API | 输入骨架 | 输出骨架 | 读取来源 | 边界 |
|---|---|---|---|---|
| GetMarketAudit | MarketAuditSubjectRef subject_ref；MarketPageInput page；ActorContext actor；QueryMetadata meta | AuditRecoveryView | append-only local audit+observation binding | rawlog/evidence禁止，不声明Obs已接纳 |
| GetRecoveryProgress | RecoveryIntentRef recovery_ref；ActorContext actor；QueryMetadata meta | AuditRecoveryView | recovery/work/stored report | 不运行恢复、不ready推断 |
| GetOperationResult | MarketOperationRef operation_ref；ActorContext actor；QueryMetadata meta | StoredOperationResultView | OperationRecord→StoredOperationResult typed完整原面 | 只读，不重新domain transition |

### Job

| Job | 输入来源 | 输出结果 | 边界 |
|---|---|---|---|
| RunMarketRecovery | RecoveryIntentRef recovery_ref；DeferredWorkRef work_ref；MarketWorkerContext context | RecoveryJobReport，含逐项target/outcome/gap/result refs | recovery state+typed逐项原report；不改外部truth/历史、不复活Withdrawn |
| DispatchObservation | MarketAuditRefSet audit_refs；DeferredWorkRef work_ref；MarketWorkerContext context | ObservationJobReport，含逐项target/outcome/gap/result refs | ObservationOutcomeBinding/local work/report；Archive没有activeexport/restore；no rawbody |
| ReconcileObservation | DeferredWorkRef work_ref；MarketWorkerContext context | ObservationJobReport，含逐项target/outcome/gap/result refs | 原external audit结果/report；local audit不等externaladmitted，不盲重发 |


## 自检与停审

对象/函数来源均已在Step6；command metadata唯一，query只读；job是worker-internal formal surface，其key由本地worker wrapper唯一提供而非复制Core command字段。没有activeevent/假schema；本部分接口逐个对应Step8flow和Step9trigger。正式§7摘录表与边界。U6 internal stop_review/pass。

## Step14 typed保存/读取反查

### typed持久化成对清单

下表是MarketStorePort内侧概要方法名，不是Rust完整签名或SQLschema。可变对象的save均接对应对象、ExpectedMarketRevision expected与MarketUow uow；expected=MustNotExist用于明确Create，expected=Exact读取revision用于更新。Immutable append接对象与同UoW，已有相同ref只能校验同内容而不能覆写。03必须固定参数和有限结果/错误，不以泛型JSON接口代替。

| 对象 | 保存骨架 | 正式读取骨架 | 缺失行为 |
|---|---|---|---|
| PublisherRelation | save_publisher(PublisherRelation value, ExpectedMarketRevision expected, MarketUow uow) | load_publisher(PublisherRelationRef relation_ref) | mutation reject/query safe missing |
| SourceVerification | save_verification(SourceVerification value, ExpectedMarketRevision expected, MarketUow uow) | load_verification(SourceVerificationRef verification_ref)；list_verifications_by_publisher(PublisherRelationRef relation_ref, MarketPageInput page) | missing阻塞资格；Release按typed关联追加失效，不能靠全表字符串扫描 |
| PublicationApplication | save_application(PublicationApplication value, ExpectedMarketRevision expected, MarketUow uow) | load_application(PublicationApplicationRef application_ref) | 缺申请reject，不补draft |
| PublicationBasis | append_basis(PublicationBasis value, MarketUow uow) | load_basis(PublicationBasisRef basis_ref) | Submitted缺sidecar完整性失败/query degraded |
| ReviewHandoff | save_review(ReviewHandoff value, ExpectedMarketRevision expected, MarketUow uow) | load_review(ReviewHandoffRef handoff_ref) | 缺原intent不dispatch/probe，reportgap |
| MarketplaceListing | save_listing(MarketplaceListing value, ExpectedMarketRevision expected, MarketUow uow) | load_listing(MarketplaceListingRef listing_ref) | 不存在与不可见按safe披露映射 |
| MarketVersion | save_version(MarketVersion value, ExpectedMarketRevision expected, MarketUow uow) | load_version(MarketVersionRef version_ref)；list_versions(MarketplaceListingRef listing_ref, MarketPageInput page) | 缺exact版本拒绝，不latestfallback |
| Category | save_category(Category value, ExpectedMarketRevision expected, MarketUow uow) | load_category(CategoryRef category_ref)；list_categories(CategoryReadInput input, MarketPageInput page) | 显式Create/Change，Change缺对象拒绝，不auto create |
| DistributionIntent | save_intent(DistributionIntent value, ExpectedMarketRevision expected, MarketUow uow) | load_intent(DistributionIntentRef intent_ref) | 缺原intent拒绝，不生成第二意图 |
| DistributionRelation | save_relation(DistributionRelation value, ExpectedMarketRevision expected, MarketUow uow) | load_relation(DistributionRelationRef relation_ref)；get_relation_by_intent(DistributionIntentRef intent_ref)；list_relations(MarketVersionRef version_ref, MarketSourceCursor cursor) | 原intent唯一关系缺失完整性缺口，影响枚举不视为empty成功 |
| DistributionAttempt | save_attempt(DistributionAttempt value, ExpectedMarketRevision expected, MarketUow uow) | load_attempt(DistributionAttemptRef attempt_ref)；list_attempts_by_intent(DistributionIntentRef intent_ref, MarketPageInput page)；list_unknown_attempts(MarketVersionRef version_ref, MarketSourceCursor cursor) | 缺原attempt/fence不补成功，不盲发 |
| WithdrawalDisposition | append_disposition(WithdrawalDisposition value, MarketUow uow) | load_disposition(WithdrawalDispositionRef disposition_ref)；list_dispositions_by_version(MarketVersionRef version_ref, MarketPageInput page) | 缺正式本地处置上下文则impactjob gap |
| ImpactRecord | save_impact(ImpactRecord value, ExpectedMarketRevision expected, MarketUow uow) | load_impact(ImpactRecordRef impact_ref)；get_impact_by_disposition(WithdrawalDispositionRef disposition_ref) | 缺固定cursor保留Partial/gap，不从安装统计补齐 |
| NoticeIntent | save_notice(NoticeIntent value, ExpectedMarketRevision expected, MarketUow uow) | load_notice(NoticeIntentRef notice_ref)；list_notices_by_impact(ImpactRecordRef impact_ref, MarketPageInput page) | 缺目标/原intent阻塞，unique notice target去重由03明确 |
| RecoveryIntent | save_recovery(RecoveryIntent value, ExpectedMarketRevision expected, MarketUow uow) | load_recovery(RecoveryIntentRef recovery_ref) | 缺typed目标/原report为gap，不任意SQL修复 |

SourceBinding/MaterialReference在SourceVerification与固定PublicationBasis/MarketVersion里是typedimmutable字段；Governance/Receiver/Notice binding在对应carrier内按card保存读取；不是另需opaque文件解析的sidecar。SnapshotStorePort与ProjectionStorePort、Operation/Audit/Work ports仍按前表独立成对，不从view/privatefake补缺。

ReleasePublisherRelation不需要无界全量关联事务：relation Released与完整result/audit/必要派生责任原子，current gate立即因relation失效拒绝新positive。AuthorityDispositionInput可声明有限typed verification_ref集合，逐项正式关联核验后同UoW调用invalidate；未在本次有限集合中的历史Qualified记录仍仅描述旧核验，不是当前授权。禁止后台projection/rebuild job写SourceVerification，也不通过重复同key命令绕过原结果重放去续办新的domain变化。


补强既有MarketStorePort的typed成对方法和唯一键读取，未新增对象/接口/外部authority；各部分写入仍各自domain，U6只统一UoW/原结果/安全追溯。
