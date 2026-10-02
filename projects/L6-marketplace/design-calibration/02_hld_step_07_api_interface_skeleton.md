# 02 Step 7：API / 接口骨架

## 1. Step状态

开工：用户已确认01并授权全部02；Step 7 completed，formal未装配。仅当前agent。

Step内计划：P1读取输入 → P2逐题回答 → P3诊断 → P4前后比较 → P5取舍 → P6结构化 → P7回填草稿 → P8自检/停审。P1～P8已分批完成。

模块门禁：U1→U2→U3→U4→U5→U6→U7逐部分小循环，前一部分pass才允许下一部分。

## 2. 本步输入

当前正式00§9～16、01§6～17；本Step对应SOP与书写规范。前一Step的问题回答/诊断/取舍/待确认事项：02_hld_step_06_key_objects.md。旧02未作为推导依据。

## 3. SOP问题回答

1. 哪些接口属于 Command，负责改写真相？

答：U1责任/核验；U2草稿/提交/终止/正式决定关联；U3listing/分类/version/list；U4受理/取消/正式receiver结果；U5限制/撤回/通知计划/结果；U6恢复受理。

2. 哪些接口属于 Query，只读取投影或只读视图？

答：全部scope内资格/目录/版本/进度/影响/通知/audit/result/freshness读取；U7无business command。

3. 哪些外部事实需要通过 Inbound Event Consumer 进入本仓？

答：仅未来qualifiedowner事件提示或matched反馈候选；无canonicalfamily/SDK支持时当前0 active consumer。正式结果通过qualifiedquery/probe后controlled命令记录。

4. 哪些已提交事实需要通过 Outbound Event 对外传播？

答：需求IF504保留conditional变化提示；未有canonical schema/消费者合同，当前0 active producer/outbox，不伪造事件DTO。

5. 哪些恢复、发布、重建、对账动作属于 Operations Job，而不是业务 command？

答：审核交接/对账、分发派发/probe、影响枚举/通知派发/probe、安全audit交接/probe、恢复、snapshotrefresh/projectionrebuild是Worker内部正式job。

6. Command 输入骨架是否需要 `ActorContext`、`CommandMetadata`、`IdempotencyKey`？

答：复用ActorContext与CommandMetadata，key唯一来自meta.request，表内不再独立idempotency_key字段；operation/scope/intent严格绑定。

7. Query 输入骨架是否需要 `ActorContext`？

答：Query必须ActorContext与QueryMetadata，scope经正式resolver，不沿用UI传来的授权断言。

8. Event Consumer 输入骨架是否需要 event id、幂等键或 envelope？

答：条件consumer未来必须canonicalenvelope/eventid/source/schema/dedup/trace；当前不创建假typedpayload。

9. 每个接口属于哪个主要组成部分,承接哪个对象或对象能力？

答：每接口表逐U，写入对象在Step6卡片中；内側port、worker与控制命令明确分离。

10. 是否存在接口无人承接、对象能力没有入口、接口类别混淆或跨组成部分越界？

答：command只意图/正式输入映射；job调用相同domain语义而非绕repo，result与report必须完整save/get；所有view有入口，policies内部调用。

11. 每个主要组成部分的接口骨架完成后是否通过停审？

答：逐U问题/诊断/取舍后接口表，再回填自检；七U过后审计接口/对象/分类与state触发。

## 4. 当前文档问题诊断

Step6对象方法如果没有formaltrigger不可实现状态迁移。01§10条件事件不能被概要表升格active；来源正式API线索只能adapter映射候选。Core metadata有key，禁止示例重复IdempotencyKey实参authority。

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 对象能力 | Step6成员骨架 | 唯一归属typed命令/查询/内部job | 状态trigger可追踪 |
| metadata | 共享与本地混用风险 | commandkey唯一meta.request、workerwrapper独立核验 | 不建第二authority |
| event | 条件IF | 当前0active，正式合同后重开 | 不私造outbox |
| sidecar/replay | 保存责任 | typed save/get与缺失行为成对 | 避免private map恢复 |

## 6. 设计取舍

选controlled命令记录formalquery/probe已核验结果，Worker内部job重用same domain不绕gate；不开放任意callback填Approved/Delivered。内部job具正式请求/result/replay语义但不是无权限公开HTTP入口。

## 7. 结构化中间产物

### 上下文与入口资格

Command使用Core ActorContext/CommandMetadata，key唯一从meta.request取，业务DTO不重复key/trace。Query使用Core ActorContext/QueryMetadata；scope/disclosure由正式resolver产生而非客户端断言。Qualified*Input是application对正式port输出完成核验后的本地输入骨架，不是调用者自填“已验证”。

Job是MarketWorkerEntry的worker-internal formal surface，不是任意公开HTTP；MarketWorkerContext为本地wrapper，引用Core ActorContext/request metadata，工作key/fence/cursor只有该wrapper的单一authority，03必须检查与Core字段不重复。每Job请求/完整report/error/逐item result与stored replay必须和该Job所在实施boundary同时落地，不能后置。

### 按部分接口骨架

#### U1 来源与发布责任

| API | 输入骨架 | 输出骨架 | 主要处理 | 写入结果 |
|---|---|---|---|---|
| BindPublisherRelation | QualifiedPublisherInput input；ActorContext actor；CommandMetadata meta | PublisherRelationResult | 正式publisher/组织authority解析；SourceGatePolicy当前scope核验；PublisherRelation.bind(QualifiedPublisherInput input) | PublisherRelation + audit/result |
| ReleasePublisherRelation | PublisherRelationRef relation_ref；AuthorityDispositionInput input；ActorContext actor；CommandMetadata meta | PublisherRelationResult | typed读取relation+revision；正式解除authority核验；PublisherRelation.release(AuthorityDispositionInput input)；关联核验置Invalidated | PublisherRelation + source资格失效责任 |
| VerifyPublicationSource | SourceVerificationInput input；ActorContext actor；CommandMetadata meta | SourceQualificationResult | SourceOwnerPort/MaterialAuthorityPort正式qualified读取；SourceGatePolicy.evaluate(SourceBinding source, PublisherRelation publisher, MaterialReferenceSet materials, CurrentAuthorityInput authority)；SourceVerification.start(SourceVerificationInput input)；record(QualificationOutcomeInput outcome) | SourceVerification + 固定SourceBinding/MaterialReference + audit/result |

| API | 输入骨架 | 输出骨架 | 读取来源 | 边界 |
|---|---|---|---|---|
| GetSourceQualification | SourceVerificationRef verification_ref；ActorContext actor；QueryMetadata meta | SourceQualificationView | SourceVerification + typed qualified snapshot | 不refresh/自证有效 |

#### U2 发布与审核交接

| API | 输入骨架 | 输出骨架 | 主要处理 | 写入结果 |
|---|---|---|---|---|
| CreatePublicationDraft | DraftPublicationInput input；ActorContext actor；CommandMetadata meta | PublicationApplicationResult | publisher当前编辑授权；PublicationApplication.draft(DraftPublicationInput input) | PublicationApplication + 安全draft_spec候选 |
| RevisePublicationDraft | PublicationApplicationRef application_ref；DraftPublicationInput input；ActorContext actor；CommandMetadata meta | PublicationApplicationResult | 读取application+revision，检查Draft；PublicationApplication.revise(DraftPublicationInput input) | Draft + 新安全draft_spec（尚非qualifiedbasis） |
| SubmitPublicationApplication | PublicationApplicationRef application_ref；QualifiedPublicationInput input；ActorContext actor；CommandMetadata meta | PublicationApplicationResult | 重新核验U1当前来源责任材料；PublicationBasis.freeze(QualifiedPublicationInput input)；PublicationApplication.submit(QualifiedPublicationInput input)；ReviewHandoff.prepare(SubmittedApplicationInput input) | 固定PublicationBasis + Submitted application + ReviewHandoff + work |
| TerminatePublicationApplication | PublicationApplicationRef application_ref；ApplicationTerminationInput input；ActorContext actor；CommandMetadata meta | PublicationApplicationResult | 正式终止权限，读取当前review上下文；PublicationApplication.terminate(ApplicationTerminationInput input) | Terminated申请 + 原交接状态保留 |
| RecordGovernanceDecision | ReviewHandoffRef handoff_ref；QualifiedDecisionInput input；ActorContext actor；CommandMetadata meta | ReviewProgressResult | GovernancePort取得正式决定与完整适用binding；ReviewBindingPolicy.evaluate(PublicationBasis basis, GovernanceDecisionBinding decision, CurrentDecisionInput current)；ReviewHandoff.record_decision(GovernanceDecisionBinding binding) | GovernanceDecisionBinding + ReviewHandoff + audit/result |

| API | 输入骨架 | 输出骨架 | 读取来源 | 边界 |
|---|---|---|---|---|
| GetPublicationProgress | PublicationApplicationRef application_ref；ActorContext actor；QueryMetadata meta | ApplicationProgressView | application/basis/review/decision safe refs | 只读，不触发Govpoll/提交 |

| Job | 输入来源 | 输出结果 | 边界 |
|---|---|---|---|
| DispatchReviewHandoff | ReviewHandoffRef handoff_ref；DeferredWorkRef work_ref；MarketWorkerContext context | ReviewJobReport（逐item refs/report安全完整面） | review/work局部进度；timeout CommitUnknown，原intent不重建 |
| ReconcileReviewHandoff | ReviewHandoffRef handoff_ref；DeferredWorkRef work_ref；MarketWorkerContext context | ReviewJobReport（逐item refs/report安全完整面） | matched决定/局部交接进度/report；恢复不自造批准，不从querysummary推出outcome |

#### U3 目录与市场版本

| API | 输入骨架 | 输出骨架 | 主要处理 | 写入结果 |
|---|---|---|---|---|
| CreateMarketplaceListing | ListingCreationInput input；ActorContext actor；CommandMetadata meta | MarketplaceListingResult | publisher/scope编辑授权；MarketplaceListing.create(ListingCreationInput input) | MarketplaceListing + audit/result |
| EditMarketplaceListing | MarketplaceListingRef listing_ref；ListingMetadataInput input；ActorContext actor；CommandMetadata meta | MarketplaceListingResult | typed读取listing与分类，核验scope；MarketplaceListing.edit(ListingMetadataInput input) | 市场metadata/categoryrefs revision |
| MaintainMarketCategory | CategoryMaintenanceInput input（Create/Change明确意图）；ActorContext actor；CommandMetadata meta | CategoryResult | 正式taxonomy维护权限，Create不复用已有ID，Change必须typed读取revision；Category.create(CategoryCreationInput input)或change(CategoryChangeInput input) | Category + audit/result |
| RegisterMarketVersion | MarketVersionCreationInput input；ActorContext actor；CommandMetadata meta | MarketVersionResult | 核验listing/申请固定basis/sourcebinding相同；MarketVersion.stage(MarketVersionCreationInput input) | Staged MarketVersion + audit/result |
| ListMarketVersion | MarketVersionRef version_ref；VersionAdmissionInput input；ActorContext actor；CommandMetadata meta | MarketVersionResult | 当前source/publisher/material/Govapproved全binding核验；同版本序列化，拒绝Withdrawn或stale revision；MarketVersion.list(VersionAdmissionInput input) | Listed版本 + immutabledecision关联 + audit/result/派生责任 |

| API | 输入骨架 | 输出骨架 | 读取来源 | 边界 |
|---|---|---|---|---|
| SearchMarketplaceCatalog | CatalogSearchInput input（keyword/type/category/tag/page）；ActorContext actor；QueryMetadata meta | CatalogReadViewPage | U7 Catalog投影 + current scope/visibility | 索引不足degraded，不泄漏隐藏数量 |
| GetMarketplaceListing | MarketplaceListingRef listing_ref；ActorContext actor；QueryMetadata meta | CatalogReadView | listing/marketversions+owner safe切片 | 禁止body/虚构评分预览 |
| ListMarketVersions | MarketplaceListingRef listing_ref；MarketPageInput page；ActorContext actor；QueryMetadata meta | MarketVersionReadPage | typed版本列表+safe binding | 不把ownerlatest改市场绑定 |
| SelectMarketVersion | MarketVersionRef version_ref；ActorContext actor；QueryMetadata meta | SelectedVersionView | exact MarketVersion + current来源/决定读取 | 仅只读选择资格，不受理获取 |
| ListMarketCategories | CategoryReadInput input；MarketPageInput page；ActorContext actor；QueryMetadata meta | CategoryReadPage | Category+scope安全关联 | 不返隐藏listing总数 |

#### U4 受控分发

| API | 输入骨架 | 输出骨架 | 主要处理 | 写入结果 |
|---|---|---|---|---|
| RequestDistribution | QualifiedAcquisitionInput input（exact version/consumer/receiver/scope）；ActorContext actor；CommandMetadata meta | DistributionResult | resolver当前source/auth/Gov/receiver资格与exact版本；同版本序列化，AcquisitionGatePolicy.evaluate(MarketVersion version, CurrentQualificationInput current, AcquisitionTargetInput target)；DistributionIntent.accept(QualifiedAcquisitionInput input)；DistributionRelation.for_intent(AcceptedDistributionInput input)；DistributionAttempt.prepare(DistributionDispatchInput input) | DistributionIntent + Relation + PreparedAttempt + work/audit/result |
| CancelDistribution | DistributionIntentRef intent_ref；DistributionCancelInput input；ActorContext actor；CommandMetadata meta | DistributionResult | consumer当前授权+typed意图/attempt/fence；DistributionIntent.cancel(DistributionCancelInput input) | Cancelled intent + 原attempt/未知责任保留 |
| RecordReceiverOutcome | DistributionAttemptRef attempt_ref；QualifiedReceiverOutcome input；ActorContext actor；CommandMetadata meta | DistributionResult | receiver正式来源与intent/version/consumer/receiver/scope全binding；DistributionAttempt.settle(ReceiverOutcomeInput input)；DistributionRelation.attach(ReceiverOutcomeBinding binding)；若已撤回/限制，则增量knownimpact和notice待交接责任 | attempt formalmapped result + relation outcome + 迟到影响责任 |

| API | 输入骨架 | 输出骨架 | 读取来源 | 边界 |
|---|---|---|---|---|
| GetAcquisitionEligibility | AcquisitionEligibilityReadInput input（exact version/consumer/scope）；ActorContext actor；QueryMetadata meta | DistributionReadView | 当前正式资格+exact市场版本 | 不创建intent、免费不豁免、不造财务 |
| GetDistributionProgress | DistributionIntentRef intent_ref；ActorContext actor；QueryMetadata meta | DistributionReadView | intent/relation/attempt/receiverbinding | 旧成功不绕权限，不探测/重试 |

| Job | 输入来源 | 输出结果 | 边界 |
|---|---|---|---|
| DispatchDistribution | DistributionAttemptRef attempt_ref；DeferredWorkRef work_ref；MarketWorkerContext context | DistributionJobReport（逐item refs/report安全完整面） | attempt/work结果及安全item refs；已许可后外部瞬时撤销不保证；unknown不能盲发 |
| ReconcileDistribution | DistributionAttemptRef attempt_ref；DeferredWorkRef work_ref；MarketWorkerContext context | DistributionJobReport（逐item refs/report安全完整面） | 原attempt结果/knownimpact增量/report；不猜installed，不由intentCancelled覆盖formal结果 |

#### U5 撤回与通知

| API | 输入骨架 | 输出骨架 | 主要处理 | 写入结果 |
|---|---|---|---|---|
| RestrictMarketVersion | MarketVersionRef version_ref；QualifiedDispositionInput input（Restrict）；ActorContext actor；CommandMetadata meta | WithdrawalResult | 正式失效/未知资格或处置authority，不假造外部撤销；同version serialization，WithdrawalDisposition.record(QualifiedDispositionInput input)；MarketVersion.restrict(VersionRestrictionInput input)；ImpactRecord.start(ImpactEnumerationInput input) | WithdrawalDisposition + Restricted MarketVersion + PartialImpact + work/audit/result |
| WithdrawMarketVersion | MarketVersionRef version_ref；QualifiedDispositionInput input（Withdraw）；ActorContext actor；CommandMetadata meta | WithdrawalResult | 正式撤回authority/处置理由；同version serialization，与U4受理/许可竞争；MarketVersion.withdraw(VersionWithdrawalInput input)；ImpactRecord.start(ImpactEnumerationInput input) | WithdrawalDisposition + Withdrawn MarketVersion + PartialImpact + work/audit/result |
| PlanImpactNotifications | ImpactRecordRef impact_ref；QualifiedNoticePlanInput input；ActorContext actor；CommandMetadata meta | NoticePlanResult | scope内knownrelation/unknown candidates固定关联；正式channel/target授权具备才生成可派发计划；NoticeIntent.prepare(QualifiedNoticePlanInput input) | 去重NoticeIntent + work/audit/result |
| RecordNoticeOutcome | NoticeIntentRef notice_ref；QualifiedNoticeOutcome input；ActorContext actor；CommandMetadata meta | NoticeResult | 正式通道来源，notice/target/channel/scope匹配；NoticeIntent.settle(NoticeOutcomeInput input) | NoticeOutcomeBinding + notice state/audit/result |

| API | 输入骨架 | 输出骨架 | 读取来源 | 边界 |
|---|---|---|---|---|
| GetWithdrawalImpact | WithdrawalDispositionRef disposition_ref；MarketPageInput page；ActorContext actor；QueryMetadata meta | ImpactNoticeView | disposition/impact+knownrelations | 不声称全安装受影响集合 |
| GetNoticeProgress | NoticeIntentRef notice_ref；ActorContext actor；QueryMetadata meta | ImpactNoticeView | notice/outcomebinding/audit历史 | 读取不发通知；Confirmed不硬翻译Delivered |

| Job | 输入来源 | 输出结果 | 边界 |
|---|---|---|---|
| EnumerateKnownImpact | WithdrawalDispositionRef disposition_ref；DeferredWorkRef work_ref；MarketWorkerContext context | ImpactEnumerationReport（逐item refs/report安全完整面） | ImpactRecord增量/coverage及notice planning责任；不扫描外部全安装集合 |
| DispatchNotice | NoticeIntentRef notice_ref；DeferredWorkRef work_ref；MarketWorkerContext context | NoticeJobReport（逐item refs/report安全完整面） | notice/work结果；不以外部失败回滚撤回 |
| ReconcileNotice | NoticeIntentRef notice_ref；DeferredWorkRef work_ref；MarketWorkerContext context | NoticeJobReport（逐item refs/report安全完整面） | 原notice outcome/report；不得造通知成功/新意图盲发 |

#### U6 审计与恢复

| API | 输入骨架 | 输出骨架 | 主要处理 | 写入结果 |
|---|---|---|---|---|
| RequestMarketRecovery | RecoveryRequestInput input（typed原intent/attempt/projection target）；ActorContext actor；CommandMetadata meta | RecoveryResult | 正式operator/system actor scope与恢复authority；RecoveryIntent.request(RecoveryRequestInput input) | Requested RecoveryIntent + durable work/audit/result |

| API | 输入骨架 | 输出骨架 | 读取来源 | 边界 |
|---|---|---|---|---|
| GetMarketAudit | MarketAuditSubjectRef subject_ref；MarketPageInput page；ActorContext actor；QueryMetadata meta | AuditRecoveryView | append-only local audit+observation binding | rawlog/evidence禁止，不声明Obs已接纳 |
| GetRecoveryProgress | RecoveryIntentRef recovery_ref；ActorContext actor；QueryMetadata meta | AuditRecoveryView | recovery/work/stored report | 不运行恢复、不ready推断 |
| GetOperationResult | MarketOperationRef operation_ref；ActorContext actor；QueryMetadata meta | StoredOperationResultView | OperationRecord→StoredOperationResult typed完整原面 | 只读，不重新domain transition |

| Job | 输入来源 | 输出结果 | 边界 |
|---|---|---|---|
| RunMarketRecovery | RecoveryIntentRef recovery_ref；DeferredWorkRef work_ref；MarketWorkerContext context | RecoveryJobReport（逐item refs/report安全完整面） | recovery state+typed逐项原report；不改外部truth/历史、不复活Withdrawn |
| DispatchObservation | MarketAuditRefSet audit_refs；DeferredWorkRef work_ref；MarketWorkerContext context | ObservationJobReport（逐item refs/report安全完整面） | ObservationOutcomeBinding/local work/report；Archive没有activeexport/restore；no rawbody |
| ReconcileObservation | DeferredWorkRef work_ref；MarketWorkerContext context | ObservationJobReport（逐item refs/report安全完整面） | 原external audit结果/report；local audit不等externaladmitted，不盲重发 |

#### U7 引用与读取投影

| API | 输入骨架 | 输出骨架 | 读取来源 | 边界 |
|---|---|---|---|---|
| GetReferenceFreshness | QualifiedReferenceSnapshotRef snapshot_ref；ActorContext actor；QueryMetadata meta | ReferenceFreshnessView | typed qualified snapshot/state/validity | state不能代替snapshot本体，不refresh |
| GetProjectionFreshness | MarketProjectionRef projection_ref；ActorContext actor；QueryMetadata meta | ProjectionFreshnessView | scope-bound ReadProjection/cursor/state | Fresh不代表业务ready |

| Job | 输入来源 | 输出结果 | 边界 |
|---|---|---|---|
| RefreshQualifiedReferences | ReferenceRefreshInput input（finite type/source/consumer/scope）；MarketWorkerContext context | ReferenceRefreshReport（逐item refs/report安全完整面） | qualifiedsnapshot shadow/state+audit/report；不得自动解除Restricted或改申请/源truth |
| RebuildMarketReadProjection | MarketProjectionRef projection_ref；ProjectionRebuildPlanInput input；MarketWorkerContext context | ProjectionRebuildReport（逐item refs/report安全完整面） | ReadProjection安全shadow及state/report；不从旧projection自建truth、不触发ownerwrite |

### 事件现状

| Consumer | 来源 | 输入骨架 | 本地结果 | 边界 |
|---|---|---|---|---|
| 当前无active inbound consumer | owner正式变更/feedback仅候选 | 无获准canonical payload，不创建假DTO | 不执行 | 正式schema/authority/binding/SDK资格齐备后重开§6～13；Images0outbound不猜事件 |

| Event | 产生来源 | 主要消费者 | 说明 |
|---|---|---|---|
| IF-MP-504 条件市场变化提示，非active Event名 | 已提交localfacts候选 | 正式consumer尚未绑定 | 当前0producer/outbox，local DeferredWork不是eventoutbox |

### 内側ports与外側资格

以下是市场本地required能力名称，不声明对端有同名RPC/SDK method。只写typed参数与结果骨架，不写Rust完整签名。所有保存读取按对象kind分支显式typed，无JSON万能load。

| 边界 | typed方法骨架与输入 | 输出/责任骨架 | 资格/缺失边界 |
|---|---|---|---|
| MarketStorePort | load_publisher(PublisherRelationRef ref)、load_verification(SourceVerificationRef ref)、load_application(PublicationApplicationRef ref)、load_basis(PublicationBasisRef ref)、load_review(ReviewHandoffRef ref)、load_listing(MarketplaceListingRef ref)、load_version(MarketVersionRef ref)、load_category(CategoryRef ref)、load_intent(DistributionIntentRef ref)、load_relation(DistributionRelationRef ref)、load_attempt(DistributionAttemptRef ref)、load_disposition(WithdrawalDispositionRef ref)、load_impact(ImpactRecordRef ref)、load_notice(NoticeIntentRef ref)、load_recovery(RecoveryIntentRef ref) | 每方法返回其对应typed carrier/basis+mutable revision；每类对应save/append；UoW参数03展开 | 主体与sidecar均有独立get，不从index/ref字符串/private map补缺；更新缺对象reject |
| MarketStorePort枚举 | list_versions(MarketplaceListingRef ref, MarketPageInput page)、list_relations(MarketVersionRef ref, MarketSourceCursor cursor)、list_unknown_attempts(MarketVersionRef ref, MarketSourceCursor cursor) | typed稳定有界页、游标与coverage | 影响仅已知局部，缺cursor保留gap |
| OperationStorePort | reserve(OperationContext context)、save_result(StoredOperationResult result)、get_result(StoredOperationResultRef ref)、complete(OperationCompletionInput input)、get_operation(MarketOperationRef ref) | Reserved/Duplicate/Conflict/Busy及typed原完整结果；sameUoW | 原结果missing/错kind完整性失败，不重跑domain；fingerprint来自context |
| AuditStorePort | append_audit(MarketAuditRecord record)、read_audit(MarketAuditSubjectRef subject, MarketPageInput page) | append-only安全audit/history与cursor | localaudit非Obs receipt；同accepted事务 |
| WorkStorePort | schedule_work(DeferredWork work)、get_work(DeferredWorkRef ref)、claim_work(WorkClaimInput input)、save_work(WorkSettlementInput input) | typed工作/intent/fence/revision，完整report refs | claim/attempt/CAS只本地，旧worker不覆盖结果 |
| SnapshotStorePort | get_snapshot(SnapshotReadKey key)、save_snapshot(QualifiedReferenceSnapshot snapshot, MarketRevision expected_version) | finite型别qualified切片本体+state/version，不只有通用状态 | pureget无resolver sidecall，缺失querydegraded/commandblocked/jobitemgap |
| ProjectionStorePort | get_projection(MarketProjectionRef ref)、get_rebuild_plan(ProjectionTargetInput input)、replace_projection(ProjectionReplacementInput input)、read_catalog(CatalogReadInput input) | kind/scope/typed非空view inputs与固定cursor，安全影子替换 | 缺plan/空输入Unavailable；不得从oldindex/opaque值补typed目标 |
| SourceOwnerPort | resolve_source(SourceResolutionInput input)、read_source(CurrentSourceReadInput input) | SourceBinding+owner-safe摘要+formal资格/缺口 | Method/GetFormalMethodAssetVersionSummary；Hub/GetFormalExposureBoundary/visibility；Images/ResolveInstantiableEntry仅候选，MP-UP-001与SDK支持未闭合 |
| PublisherAuthorityPort / ScopeResolverPort | resolve_publisher(PublisherAuthorityInput input)、resolve_read_scope(ReadScopeInput input)、resolve_operation_scope(OperationScopeInput input) | 本地qualified主体/权限/披露输入 | owner待定，不把Identity/SDK当auth；不可证明scope不暴露positive |
| MaterialAuthorityPort | resolve_material(MaterialResolutionInput input) | MaterialReference+正式适用/有效性 | Artifact正式version/consumable+扫描签名authority合同待绑，MP-UP-004 |
| GovernancePort | submit_review(ReviewSubmissionInput input)、probe_review(ReviewProbeInput input)、read_decision(DecisionReadInput input) | 正式接收/unknown与qualified决定binding | GetGateDecision只读线索；approved+完整binding/失效支持MP-UP-002，不能自己填 |
| ReceiverPort | dispatch_distribution(DistributionDeliveryInput input)、probe_distribution(DistributionProbeInput input) | matching正式outcome/known-not-committed/unknown/unsupported | 每类型receiver与materialization MP-UP-005，ACK不installed |
| NoticeChannelPort | dispatch_notice(NoticeDeliveryInput input)、probe_notice(NoticeProbeInput input) | matching通道outcome/unknown | MP-UP-007，缺正式通道不造target/receipt |
| ObservationPort | dispatch_observation(ObservationDeliveryInput input)、probe_observation(ObservationProbeInput input) |正式准入结果/unknown | MP-UP-008，producer/payload/redaction/receipt资格；不activeArchive |
| 本地技术ports | allocate_market_id(MarketIdKind kind)、read_clock()、begin_market_uow() | 本地ID/time/UoW，非owner资产digest/审批 | 03精确事务/ID/clock接口；不提供外部truth writer |

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


跨部分审计：21 Commands、16 Queries、12 worker-internal Jobs均有唯一U与对象来源；0 activeevents。所有query no-write，record formal outcome入口只接正式核验结果，job同规则保存不绕domain。七部分实际小循环附录02_hld_step_07_part_u1～u7均pass，状态触发交§8/9。

## 8. 回填草稿

正式§7仅摘录本文件§7及已pass部分附录，不带问题/诊断/历史审计；不新增结论。

## 9. 待确认事项

MP-UP-001～008、MP-SRC-003/010/013、Q-MP-01沿01保留，仅受影响正向lane blocked；不是owner已确认或已发送请求。

## 10. 进入下一步条件

P1～P8均完成；内部stop_review/pass。七部分interface/对象/context/readwrite自检pass，后续Step8每critical接口独立图。 外部资格不关闭，允许进入Step 8。
