# 03 Step 8：定义 API / Command / Query / Event / Job 协议契约

## 1. Step状态

2026-10-01；full-restart / single-agent；用户授权Step5～10。completed / selfcheck_done，正式03仍historical_material。

### Step内计划

| 单元 | 状态 |
|---|---|
| P1读取输入 | done |
| P2问题回答 | done |
| P3诊断 | done |
| P4取舍 | done |
| P5逐单元结构化 | done |
| P6复杂度与跨单元审计 | done |
| P7候选草稿 | done |
| P8自检与停审 | done |

## 2. 本步输入

当前00/01/02，前序Step的问题、诊断、取舍及未闭合资格；详细设计SOP Step8、书写规范对应章节、通则/中间产物/闭环标准；Governance对应Step适用契约组织。不继承其业务truth或运行证据。

## 3. SOP问题回答

1. 本轮需要定义哪些 API / Command / Query / Event / Job？

答：21Command/16Query/12internalJob；0activeInbound/Outboundevent，不能照Governance增event。

2. 这些协议应按哪个协议族或所属模块分批定义: Command、Query、Inbound Event、Outbound Event、Operations Job、admin/internal？

答：按七U拆附录，每族先batch表→逐protocol→family停审，再全库存审计。

3. 每个协议的调用方、处理方、传输方式是什么？

答：Command/Query由Web或正式integration经API，typedfacade处理；Job由trustedworker系统/operator，内部非HTTP。

4. 外部接口使用 HTTP、RPC、event bus 还是其他方式？

答：37同步入口HTTP typedJSON over boundary，读取语义采用query端点；12Job nativeRusttypedcalls，owner经formalSDK。

5. 请求、响应、事件或 job 输入输出 schema 是什么？

答：逐Requestbody字段与Envelope单Core上下文，结果family完整schema，内部Job完整report，不只名字。

6. 每个输入契约会构造或影响哪些 Domain 对象？

答：每Command列Step6factory/method与Step7qualified来源，Query只组装view，Jobtyped原work/target。

7. 目标对象的必填字段是否全部能从输入、派生、查表或系统生成中获得？

答：IDport补localIDs，repo补fixedbasis/原intent，formalports补owner/current；缺正式来源blocked，不clientassertqualified。

8. 哪些字段名相近但语义不同，不得混同？

答：ownerVersion≠marketVersion，assetdigest≠intentfingerprint，scan/signature/ACK≠approval，noticeConfirmed≠delivered。

9. 字段缺失时是 reject、derive、lookup、retry、dead-letter 还是暂停处理？

答：missingkey/ref reject；ownerqualificationmissingblocked；unknownprobeunsupportedwaiting/manualformalbasis；无DLQ事件lane。

10. 当前协议族完成后,每个 DTO / Event / Job 是否能回指 Step 6 对象、Step 7 port 和 Step 9 处理流？

答：protocol逐项回指对象/port/同名flow，所有二级carrier都有schema。

11. Query 的 response view、page、projection marker 是否有字段级 schema？

答：view/page/marker typed定义；details用1item Page，notvisible/missing/degraded独立，不假填requiredrefs。

12. Query 的 empty、not visible、stale、failed、rebuilding、disabled、missing state 对外 surface 是什么？

答：ReadSurface Ready/Empty/NotVisible/Missing/Degraded(ReadMarker finite状态)，noqueryrefresh/write。

13. Query response 中 read model / projection / cursor 的 id/ref 如何生成，repository key 是什么？

答：projection唯一(kind,scope)，cursor typedcommittedsequence+真实typedposition/固定upper；publicCorePageToken按Step13规范codec绑定actor/delegate/selector/scope/filter/upper/after，不是授权签名。Step7 PageReadContext显式给七pagedport当前actor/scope/selector，不parseownerref。

14. Query response 字段引用的 enum / ref 是否归属到 contracts shared,或是否写明 domain 到 view 的正式映射？

答：publicDTO使用contracts词汇/safeviews，不依赖domainentities；domain→snapshot字段显式映射。

15. Query / repository 使用的 page helper 是否有 schema、归属和 public page DTO 映射？

答：publicPage items/info；CoreQueryMetadata.page唯一请求分页，内scan另ReadWindow，映射不双authority。

16. HLD `*Query`、DDD `*Request`、Rust DTO 名称是否存在收敛映射？

答：原HLD接口名保留，DDD按ProtocolNameRequest，Query不会凭名字变化增入口。

17. Command result、event payload、consumer envelope / receipt、job report 中引用的 enum / ref / helper 是否都有 schema 和归属？

答：CommandReceipt/MarketResultSurface/MarketJobReport/item enum/fullbindings都已shared闭口，族typedaliases不减字段。

18. Inbound consumer 的 envelope、receipt、duplicate、quarantine、delayed、no-op marker 是否有字段级 schema？

答：不适用：本仓0inbound，无envelope/receipt/quarantine伪入口；duplicate/reject/jobno-op另typed定义。

19. 每个 command / event / job 的 actor 是 participant、system、integration 还是 trusted source actor？是否必须在 participant / visibility scope 中？

答：humanpublisher/operatorconsumer formal授权仍blocked；systemworker有CoreActorContext且仍scope，不天然trustedbypass。

20. 如果存在 trusted source actor 例外,适用的 source kind、actor kind、入口协议和不可绕过的 gate 是否写清？

答：无绕gate例外，正式integration只提供source候选也要fullbinding/visibility/forbiddenbody/key/fence。

21. 每个协议失败时映射成什么错误？

答：有限MarketError code映射400/403/404/409/422/503，unknown为acceptedjobreport不假500失败。

22. 哪些协议需要幂等键或审计记录？

答：21C/12J writekey与safeaudit/fullresult；16Q不用key且不写audit。

23. 所有协议族完成后,是否存在 public DTO 传递类型缺 schema、跨协议命名漂移、二级类型未归属或 protocol-to-flow 断裂？

答：跨协议审计49一一映射、publicclosure、singlemeta、fullreplay、0event，不删除外部blocker。

## 4. 当前文档问题诊断

HLD qualified输入不能直接成为公开body，否则客户端可自证publisher/scan/approved。分页在HLD page+meta重复，DDD收敛唯一Core meta.page；receiver/notice结果body必须只是formal候选引用，不采纳caller生成outcome。实际视图还须明确missing/degraded、application/review/attempt state，不只返回refs。

## 5. 改动前后对比

| 项 | 前 | 后 |
|---|---|---|
| 契约深度 | 前序概念骨架 | 本Step按模块/对象/入口独立展开，类型、来源与失败边界可追溯 |
| 外部资格 | retained pending | 不因文档深化变为ready；受影响positive仍blocked |

## 6. 设计取舍

采用37typedHTTP入口+12typedinternalJob；Query走只读语义的POST query endpoint以明确body/meta运输，不能借POST写state；不采用万能commandselector/JSON反射或开放JobHTTP。familysafe result完整保存且通过contracts snapshots返回，不复制domaintruth。

## 7. 结构化中间产物

2026-10-02：安全错误十八code→HTTP/Query穷尽映射见[Step12§7.1～7.2](03_ddd_step_12_errors_recovery.md)。503不能自动重发，effectUnknown只原intentprobe；replay header不改变原payload。现有schema/37HTTP+12内部Jobs/0event库存不变。

### 协议库存与批次

| 协议 | 类别 | 技术模块 / U | 完整入口 / result | transport |
|---|---|---|---|---|
| BindPublisherRelation | Command | application/source_responsibility / U1 | BindPublisherRelationRequest → PublisherRelationResult | POST /api/marketplace/v1/commands/bind-publisher-relation |
| ReleasePublisherRelation | Command | application/source_responsibility / U1 | ReleasePublisherRelationRequest → PublisherRelationResult | POST /api/marketplace/v1/commands/release-publisher-relation |
| VerifyPublicationSource | Command | application/source_responsibility / U1 | VerifyPublicationSourceRequest → SourceQualificationResult | POST /api/marketplace/v1/commands/verify-publication-source |
| GetSourceQualification | Query | application/source_responsibility / U1 | GetSourceQualificationRequest → SourceQualificationReadModel | POST /api/marketplace/v1/queries/get-source-qualification |
| CreatePublicationDraft | Command | application/publication_review / U2 | CreatePublicationDraftRequest → PublicationApplicationResult | POST /api/marketplace/v1/commands/create-publication-draft |
| RevisePublicationDraft | Command | application/publication_review / U2 | RevisePublicationDraftRequest → PublicationApplicationResult | POST /api/marketplace/v1/commands/revise-publication-draft |
| SubmitPublicationApplication | Command | application/publication_review / U2 | SubmitPublicationApplicationRequest → PublicationApplicationResult | POST /api/marketplace/v1/commands/submit-publication-application |
| TerminatePublicationApplication | Command | application/publication_review / U2 | TerminatePublicationApplicationRequest → PublicationApplicationResult | POST /api/marketplace/v1/commands/terminate-publication-application |
| RecordGovernanceDecision | Command | application/publication_review / U2 | RecordGovernanceDecisionRequest → ReviewProgressResult | POST /api/marketplace/v1/commands/record-governance-decision |
| GetPublicationProgress | Query | application/publication_review / U2 | GetPublicationProgressRequest → ApplicationProgressReadModel | POST /api/marketplace/v1/queries/get-publication-progress |
| DispatchReviewHandoff | Job | application/publication_review / U2 | DispatchReviewHandoffRequest → ReviewJobReport | worker-internal dispatch_review_handoff |
| ReconcileReviewHandoff | Job | application/publication_review / U2 | ReconcileReviewHandoffRequest → ReviewJobReport | worker-internal reconcile_review_handoff |
| CreateMarketplaceListing | Command | application/catalog_version / U3 | CreateMarketplaceListingRequest → MarketplaceListingResult | POST /api/marketplace/v1/commands/create-marketplace-listing |
| EditMarketplaceListing | Command | application/catalog_version / U3 | EditMarketplaceListingRequest → MarketplaceListingResult | POST /api/marketplace/v1/commands/edit-marketplace-listing |
| MaintainMarketCategory | Command | application/catalog_version / U3 | MaintainMarketCategoryRequest → CategoryResult | POST /api/marketplace/v1/commands/maintain-market-category |
| RegisterMarketVersion | Command | application/catalog_version / U3 | RegisterMarketVersionRequest → MarketVersionResult | POST /api/marketplace/v1/commands/register-market-version |
| ListMarketVersion | Command | application/catalog_version / U3 | ListMarketVersionRequest → MarketVersionResult | POST /api/marketplace/v1/commands/list-market-version |
| SearchMarketplaceCatalog | Query | application/catalog_version / U3 | SearchMarketplaceCatalogRequest → CatalogReadView | POST /api/marketplace/v1/queries/search-marketplace-catalog |
| GetMarketplaceListing | Query | application/catalog_version / U3 | GetMarketplaceListingRequest → CatalogReadView | POST /api/marketplace/v1/queries/get-marketplace-listing |
| ListMarketVersions | Query | application/catalog_version / U3 | ListMarketVersionsRequest → MarketVersionReadItem | POST /api/marketplace/v1/queries/list-market-versions |
| SelectMarketVersion | Query | application/catalog_version / U3 | SelectMarketVersionRequest → SelectedVersionView | POST /api/marketplace/v1/queries/select-market-version |
| ListMarketCategories | Query | application/catalog_version / U3 | ListMarketCategoriesRequest → CategoryReadItem | POST /api/marketplace/v1/queries/list-market-categories |
| RequestDistribution | Command | application/distribution / U4 | RequestDistributionRequest → DistributionResult | POST /api/marketplace/v1/commands/request-distribution |
| CancelDistribution | Command | application/distribution / U4 | CancelDistributionRequest → DistributionResult | POST /api/marketplace/v1/commands/cancel-distribution |
| RecordReceiverOutcome | Command | application/distribution / U4 | RecordReceiverOutcomeRequest → DistributionResult | POST /api/marketplace/v1/commands/record-receiver-outcome |
| GetAcquisitionEligibility | Query | application/distribution / U4 | GetAcquisitionEligibilityRequest → DistributionProgressReadModel | POST /api/marketplace/v1/queries/get-acquisition-eligibility |
| GetDistributionProgress | Query | application/distribution / U4 | GetDistributionProgressRequest → DistributionProgressReadModel | POST /api/marketplace/v1/queries/get-distribution-progress |
| DispatchDistribution | Job | application/distribution / U4 | DispatchDistributionRequest → DistributionJobReport | worker-internal dispatch_distribution |
| ReconcileDistribution | Job | application/distribution / U4 | ReconcileDistributionRequest → DistributionJobReport | worker-internal reconcile_distribution |
| RestrictMarketVersion | Command | application/withdrawal_notice / U5 | RestrictMarketVersionRequest → WithdrawalResult | POST /api/marketplace/v1/commands/restrict-market-version |
| WithdrawMarketVersion | Command | application/withdrawal_notice / U5 | WithdrawMarketVersionRequest → WithdrawalResult | POST /api/marketplace/v1/commands/withdraw-market-version |
| PlanImpactNotifications | Command | application/withdrawal_notice / U5 | PlanImpactNotificationsRequest → NoticePlanResult | POST /api/marketplace/v1/commands/plan-impact-notifications |
| RecordNoticeOutcome | Command | application/withdrawal_notice / U5 | RecordNoticeOutcomeRequest → NoticeResult | POST /api/marketplace/v1/commands/record-notice-outcome |
| GetWithdrawalImpact | Query | application/withdrawal_notice / U5 | GetWithdrawalImpactRequest → ImpactNoticeReadModel | POST /api/marketplace/v1/queries/get-withdrawal-impact |
| GetNoticeProgress | Query | application/withdrawal_notice / U5 | GetNoticeProgressRequest → ImpactNoticeReadModel | POST /api/marketplace/v1/queries/get-notice-progress |
| EnumerateKnownImpact | Job | application/withdrawal_notice / U5 | EnumerateKnownImpactRequest → ImpactEnumerationReport | worker-internal enumerate_known_impact |
| DispatchNotice | Job | application/withdrawal_notice / U5 | DispatchNoticeRequest → NoticeJobReport | worker-internal dispatch_notice |
| ReconcileNotice | Job | application/withdrawal_notice / U5 | ReconcileNoticeRequest → NoticeJobReport | worker-internal reconcile_notice |
| RequestMarketRecovery | Command | application/audit_recovery / U6 | RequestMarketRecoveryRequest → RecoveryResult | POST /api/marketplace/v1/commands/request-market-recovery |
| GetMarketAudit | Query | application/audit_recovery / U6 | GetMarketAuditRequest → AuditRecoveryReadModel | POST /api/marketplace/v1/queries/get-market-audit |
| GetRecoveryProgress | Query | application/audit_recovery / U6 | GetRecoveryProgressRequest → AuditRecoveryReadModel | POST /api/marketplace/v1/queries/get-recovery-progress |
| GetOperationResult | Query | application/audit_recovery / U6 | GetOperationResultRequest → StoredOperationResult | POST /api/marketplace/v1/queries/get-operation-result |
| RunMarketRecovery | Job | application/audit_recovery / U6 | RunMarketRecoveryRequest → RecoveryJobReport | worker-internal run_market_recovery |
| DispatchObservation | Job | application/audit_recovery / U6 | DispatchObservationRequest → ObservationJobReport | worker-internal dispatch_observation |
| ReconcileObservation | Job | application/audit_recovery / U6 | ReconcileObservationRequest → ObservationJobReport | worker-internal reconcile_observation |
| GetReferenceFreshness | Query | application/reference_read / U7 | GetReferenceFreshnessRequest → ReferenceFreshnessView | POST /api/marketplace/v1/queries/get-reference-freshness |
| GetProjectionFreshness | Query | application/reference_read / U7 | GetProjectionFreshnessRequest → ProjectionFreshnessView | POST /api/marketplace/v1/queries/get-projection-freshness |
| RefreshQualifiedReferences | Job | application/reference_read / U7 | RefreshQualifiedReferencesRequest → ReferenceRefreshReport | worker-internal refresh_qualified_references |
| RebuildMarketReadProjection | Job | application/reference_read / U7 | RebuildMarketReadProjectionRequest → ProjectionRebuildReport | worker-internal rebuild_market_read_projection |

### 独立协议附录

- [U1 来源/发布责任](03_ddd_step_08_part_u1.md)：每协议独立schema/完整签名/构造映射/错误/幂等/actor/停审。
- [U2 申请/正式审核交接](03_ddd_step_08_part_u2.md)：每协议独立schema/完整签名/构造映射/错误/幂等/actor/停审。
- [U3 目录/市场版本](03_ddd_step_08_part_u3.md)：每协议独立schema/完整签名/构造映射/错误/幂等/actor/停审。
- [U4 受控分发](03_ddd_step_08_part_u4.md)：每协议独立schema/完整签名/构造映射/错误/幂等/actor/停审。
- [U5 撤回/影响/通知](03_ddd_step_08_part_u5.md)：每协议独立schema/完整签名/构造映射/错误/幂等/actor/停审。
- [U6 审计/恢复](03_ddd_step_08_part_u6.md)：每协议独立schema/完整签名/构造映射/错误/幂等/actor/停审。
- [U7 引用/snapshot/索引](03_ddd_step_08_part_u7.md)：每协议独立schema/完整签名/构造映射/错误/幂等/actor/停审。
- [sharedsurface](03_ddd_step_08_shared_surface.md)：Query read models、report别名、错误/分页/上下文authority。

### 跨协议审计

49=21C+16Q+12J，37HTTP+12内部typedcall；0activeevent/topic/outbox/consumerreceipt。HLD接口名不变，Request后缀一一映射不增入口。公开Request无Qualified*Input、key/trace/actor/page字段重复；分类维护有明确Create/Changevariant，不能根据missingref猜意图。Query无writer；Job完整逐itemreport与storedpayload，不bool/refonly。

contracts公共carrier不含domainentity（StoredOperationResult改为contracts-safe immutable完整结果载体，domain文件re-export不复制字段）；readmodel已定义相关state，Draft/Blocked不假填review/summary。错误safe，只读surface可测试，public page单Coremetadataauthority。复杂度已拆七协议族+shared，逐协议停审，不压成总表。



### Step9回修与审查记录

SourceVerification.publisher_ref、NoticeIntent.scope_ref、Category.scope_ref已在完整schema/Row/factory输入承接；QualifiedObservationOutcome回填为outcome_ref/operation_ref/audit_refs/scope_ref，不误用RecoveryRequirements。Immutable组合词汇与StoredOperationResult迁至contracts单authority，原domain只re-export，不让safe public结果泄漏domain-only类型。Versioned.revision为单持久列，显式entity revision只是同列镜像；JobCheckpoint、联合ImpactScanItem、projection manifest无独立新lifecycle。具体受影响schema以Step6 shared_types、Step7 application_callables为准。此次仅文档反向闭环，不变更owner资格/实现状态。

## 8. 候选正式草稿

候选正式§7/§6协议索引从§7与8附录摘录，保持49入口名、typedDTO/result/readsurface/完整Job报告及构造source/错误映射，不新增支付/owner approval，不装配正式03。

## 9. 待确认事项

MP-UP-001～008、MP-SRC-003/010/013、Q-MP-01及受影响Hub/Images/Obs/SDK资格仍pending/blocked；本地候选不冒充owner确认。Billing/支付/订阅/分成/跨境均future/blocker，Archive无active lane。

## 10. 自检与下一门禁

49Request/49签名与21C/16Q/12J库存逐项核对，族停审与sharedsurface闭环完成；进入Step9逐flow，不装配/实现/提交；外部exactqualification仍blocked。
