# 03 Step 17：实施承接与跨文档闭环复核

## 1. Step状态

2026-10-02；full-restart / single-agent；completed / selfcheck_done / stop_review（文档）。已读SOP Step17、规范5.16、中间产物5.10、闭环§九、实施规范提交/移交规则与Rust英文源码/rustdoc规则；前序Step16文档停审通过。只交付设计输入，不开始07任务/phase拆分，不创建implementation ledger或boundary skeleton。

### Step内计划

| 单元 | 状态 | 位置 |
|---|---|---|
| 输入/十二题/诊断/取舍 | done | §2～6 |
| 真相源/字段/DTO/Query/状态审计 | done | §7.1～7.5 |
| port/命名/phase/修正与前置阅读 | done | §7.6～7.12 |
| 静态复核/候选/停审 | done | §8/10 |

## 2. 本步输入

Step1～16全部当前calibration；尤其[Step16切口](03_ddd_step_16_test_cuts.md)、[Step13canonical/page](03_ddd_step_13_concurrency_idempotency.md)、[Step7ports](03_ddd_step_07_typed_ports.md)、[Step15audit](03_ddd_step_15_observability_audit.md)。当前正式00/01/02承接需求/ownership；正式03仍historical。旧05/06不作本轮已验证输入，04/07未开始。git配置只读：user.name=quantalithos-labs、user.email=quantalithos.ai@gmail.com；不修改、不提交。

## 3. SOP问题回答

1. 足够交给计划的契约？七技术模块、七U/43对象、17ports/146methods、49protocols/flows、14statecarriers、持久化/error/幂等/config/telemetry与最小测试。资格缺仍受影响blocked，不等开工。
2. 先读什么？00～03正式与规范性calibration、后续正式04～07、全局规则/闭环/目录/台账/Rust/Vue/TS/提交规范及各exactowner接口；未经正式baseline不实现。
3. 提交/git/注释？§7前置清单明确列入，当前只读git用户符合要求；设计仓中文文档、实现仓英文源码/rustdoc/标识符/测试名与commit，scope必填。当前用户未授权commit。
4. 必填字段有源？Step6逐字段/工厂/Row+Step8DTO+Step9构造映射；系统ID/Clock/cursor仅本地typedport，ownerref/version/digest/visibility来自正式port。无formal输入安全拒绝，不填默认。
5. C/J能构造？33writes各完整DTO、readers与factory/source map；checkpoint/fullreport存在；0event。新Obs work由Step15明确生产，不能Worker扫audit猜原intent。
6. Queryresponse闭口？16Q含read model/PageInfo/ReadMarker来源；审计发现public page actor/selector绑定还缺port显式输入，本Step回源修复，不能将其留实现猜测。
7. 状态名字一致？14carrier沿唯一Step6 enum；矩阵/flow/Step16同词汇，后续06只能接续，不使用旧formal05/06状态。
8. phase误用后序成果？未创建phase/commit boundary，只有依赖承接输入。04/05/06/07未完成、无implementationbaseline/run/evidence/readiness。
9. 旧名漂移？listing/listed/reviewbinding/receiverConfirmed/Obsreceipt各有正式local含义，禁approvalcontroller/installed/paid/scanpassed/evidenceReady。Step10已完成但少数摘要仍写审计进行中，须改当前文档状态。
10. 不能实施哪些？MP-UP/SRC/Q及受影响owner/SDKexact支持、人类auth/Billing、数值profile、真实外部联调/implementation授权；§7与Step18列到受影响path，不全盘伪ready。
11. 07怎么引用？逐boundary引用formal03章/完整calibration schema、05case、06AC/VETO与状态，不复制一套代码契约；后续发现冲突回修ownerStep并重新审计。
12. 提供整体审计输入？§7完整闭环表提供schema/port/flow/state/UoW/test/需求映射；最终移交须07对03/05/06/07逐boundary按标准§九全项复核。本Step不是该最终审计结论。

## 4. 当前文档问题诊断

Step13 publicpage request_binding含actor/delegate/selector，但七个pagedport只收SafeReadContext与PageRequest，SafeReadContext没有actor字段，也不能从disclosure_ref反查身份。采用application-only PageReadContext显式带原Coreactor、当前safe scope、finiteQueryselector；同步port声明/表/调用与codec来源。不扩充owner-facingSafeReadContext、不让infra读HTTP或反向解析opaque。

CanonicalMarketIntent使用private sealed marker但原code仅描述模块，补完整marker声明明确可见性；33finiteimpl规则不变。Job共享执行中有限kind match使用借用，避免额外要求enum Copy。所有本地缺口先修后交接，旧formal03只Step19独立结论后作差异比较。

## 5. 改动前后对比

| 项 | 前 | 后 | 原因 |
|---|---|---|---|
| publicpage | 规则有actor但port无输入 | PageReadContext完整source+七caller | 防infra私造/refparse |
| schema authority | controllers/附录分散 | 十类闭环复核与统一命名 | 07能按boundary裁剪 |
| 完成状态 | 部分摘要历史进行中 | 当前完成与历史暂停分开 | 台账可恢复 |

## 6. 设计取舍

不把actor加进owner-facingSafeReadContext，不删除actor绑定来掩盖输入缺口；用application-ownedfinitepage carrier仅跨本地repositoryport，actor还是Core唯一truth。前置表不预造phase/task或实施证据；复核不足即回修当前Step，不交由实施者选边。

## 7. 结构化中间产物

### 7.1 真相源表

以下是正式03装配的authority索引；Step19只摘录已校准结论。若彼此冲突回修对应Step后重审，不以“后写覆盖”授权实现者选边。00/01/02固定业务/架构/概要；本轮03细化技术，不复制另一套需求。43对象的**每字段**完整来源/optional/方法/Row在七U独立卡，下面复核表是索引与高风险交叉验证，不取代其完整schema。

| 设计事实 | 真相源 | 章节 / 中间产物 | 后续消费者 | 冲突处理 |
|---|---|---|---|---|
| 需求/owner/AC/VETO | 当前00/01/02 | 正式00§9～16、01职责/ownership、02七U与§12/13 | 03～07 | 不借旧README/draft覆盖正式上位 |
| file/module/path | Step3/4/5 | 六Rustmember+Web、215plannedpaths、独立模块卡 | 04/05/07 | 新路径回修Step4，ownerCargo拒绝 |
| 主对象/支撑字段/Row | Step6 | U1～7、shared_types、runtime_helpers | 03§6、05/06/07 | contracts immutable/词汇、domain纯entity；无clientqualified |
| ports/helper/读写成对 | Step7 | typed_ports、application_callables | infra/fake/entry及07 | signature与表一致，17ports/146methods无私有补口 |
| 协议/metadata/view/error | Step8 | 七U及shared_surface | API/Web/Worker与05/06 | 21C/16Q/12J唯一inventory，0event |
| 函数流/副作用 | Step9/15 | 七U独立flow、Job A/B、acceptedinventory | application/infra/05～07 | 每flow完整originalresult、O/P有限，no-querywrite |
| 状态集合/guard | Step6/10 | 14carrier enum+222pairs/73A | 测试/06/07 | 不发明Registered/Active/Verified等别名state |
| SQL/revision/sourceframe/as-of | Step11 | PGtypedrow/历史/帧/索引/UoW | 04/05/07 | physicalrevision单列、同kinddependencyupper |
| 错误/unknown恢复 | Step12 | finite映射、原key/intentprobe | API/SDK/Worker/05～07 | 日志/timeout/ACK不证明rollback |
| key/canonical/cursor | Step13+Step7 | 33DTO、finitePageReadContext/RepositoryPositionSubject | 05/07 | metadata唯一；token非authcredential |
| config/builder | Step14 | 七字段、八slots、入口与真实Core/SDKpath | 04/07 | Bound需要formal资格、production无fakefallback |
| telemetry/local audit/Obs | Step15 | finite字段、21C+八J O生产、防递归 | 04/05/06/07 | 真实localaudit与正式receipt/evidence分层 |
| 测试入口/证明上限 | Step16 | 49正反、14矩阵、跨契约表 | 05/06/07 | planned≠run/pass/qualification |

### 7.2 字段闭环表

全字段覆盖索引：U1六对象、U2六、U3五、U4六、U5六、U6九、U7五，共43；各字段均须反查[Step6主控与七U卡](03_ddd_step_06_object_contracts.md)以及[shared字段/Row](03_ddd_step_06_shared_types.md)。本表逐高风险field明确跨文档入口，未列重复字段仍受同一完整卡约束；没有“实施再补”字段。

| 对象 | 字段 | 类型 | 来源 / 构造入口 | DTO / port对应 | 缺失处理 | 最小测试 / 后续AC |
|---|---|---|---|---|---|---|
| SourceBinding | owner_ref/version/digest/visibility/eligibility | TypedOwnerReference/OwnerVersionRef/OwnerAssetDigest/OwnerVisibilityRef/OwnerEligibilityRef | 正式SourceOwner输出；U1 from_owner | SourceResolveOutput.binding完整 | ContractBlocked/BindingMismatch；不自己hash资产 | Step16 U1；AC-MP-101/102 |
| MaterialReference | material_ref/binding/kind/applicability | OwnerMaterialRef/SourceBinding/MaterialKindRef/MaterialApplicabilityRef | MaterialAuthority.resolve_materials→from_owner | MaterialResolveRequest及正式结果 | 缺正式kind/适用只gap | U1/U2；AC-MP-102/202 |
| PublisherRelation | principal/authority/scope/state | PublisherPrincipalRef/PublisherAuthorityRef/MarketScopeRef/PublisherRelationState | 正式resolve_publisher+本地ID→bind | BindPublisherRelationRequest是候选，不qualified | 未formalhumanorgpositiveblocked；初态Bound | U1；AC-MP-101/G01 |
| PublicationApplication | draft_spec/basis_ref/review_ref/revision | DraftPublicationSpec/OptionalPublicationBasisRef/OptionalReviewHandoffRef/MarketRevision | draft DTO；Submit固定basis+review；singlePGrevision | Create/Revise/Submit及typedload | Submitted必有basis/review，不能就地换 | U2；AC-MP-201/203 |
| ReviewHandoff | dispatch_outcome/decision/failure | OptionalReviewDispatchOutcomeRef/OptionalGovernanceDecisionBinding/OptionalSafeFailureRef | 正式dispatch/probe/decision与实际gap | GovernancePort原basis/申请/scope | ACK不构造decision；state与condition一致 | U2；AC-MP-202 |
| MarketVersion | source/application/decision/disposition/revision | SourceBinding/PublicationApplicationRef/OptionalGovernanceDecisionBinding/OptionalWithdrawalDispositionRef/MarketRevision | 原Submittedbasis、正式decision、局部处置；stage/list | Register/List/Restrict/Withdraw+typedloads | sourceimmutable，Staged初态、Withdrawnterminal | U3/U5；AC-MP-201/501 |
| DistributionAttempt | intent/fence/outcome/failure | DistributionIntentRef/DispatchFence/OptionalReceiverOutcomeBinding/OptionalSafeFailureRef | 原intent/plan+当次claim、正式receiver结果 | Request/Dispatch/Reconcile/Record | 普通timeout只Unknown；Record仅Confirmed | U4；AC-MP-402/403 |
| ImpactRecord | relation_refs/unknown_attempt_refs/cursor/kind | DistributionRelationRefSet/DistributionAttemptRefSet/MarketSourceCursor/ImpactCoverageKind | fixedupper typedas-of双源；lateB新cursor | list_relations+list_unknown_attempts+late deltainput | 缺扫描不Complete；高upper外late回Partial | U5；AC-MP-502/504 |
| NoticeIntent | target/channel/scope/fence/outcome | NoticeTargetRef/NoticeChannelRef/MarketScopeRef/OptionalDispatchFence/OptionalNoticeOutcomeBinding | formalNotice resolvedtarget+sameApermission+formalprobe | Plan/Dispatch/Reconcile/Record | caller地址/ACK不能formalreceipt | U5；AC-MP-502 |
| StoredOperationResult | result_kind/safe_result/schema_ref | MarketResultKind/MarketResultSurface/MarketResultSchemaRef | original完整familypayload+固定codec；capture | CommandReceipt或完整MarketJobReport | Missing/wrongkind IntegrityFailure，不projection重造 | U6；AC-MP-G02/504 |
| DeferredWork/JobCheckpoint | intent/target/fence/fullrequest/resultIDs | MarketEffectIntentRef/MarketWorkTargetRef/DispatchFence/InternalJobRequest/ReservedOperation | 每flow schedule与获胜reserve；checkpoint同A | JobEnvelope.body=原完整typedrequest | currentJoboperation不替代原externalintent；不偷lease重发 | U6/Worker；AC-MP-403/504 |
| MarketAuditRecord | 六safe字段 | 全字段见U6卡 | audit/ID/cursor/Corecontextref+actualbasis同Tx | Commands或B原resultframe；无auditbody参数 | 不accepted失败/Query/replay、不扩字段 | 全U；AC-MP-503/G01/G02 |
| QualifiedReferenceSnapshot | source/version/safe_material/validity/state | TypedOwnerReference/OwnerVersionRef/QualifiedSnapshotMaterial/SourceValidityRef/ReferenceSnapshotState | 正式typed safe slice，sameCASRow | Verify/Refresh+SourceOwnerPort.read_snapshot | 缺本体不Qualified，旧visibility不缓存授权 | U7；AC-MP-302/303 |
| ReadProjection | identity/cursor/snapshots/view_keys/state | ProjectionIdentity/MarketSourceCursor/QualifiedReferenceSnapshotRefSet/MarketReadViewKeySet/ReadProjectionState | initialize Stale，fullplan/manifest由committedfacts | ProjectionStore plan/read/publish_views | incompletekeymanifest或Fresh缺body IntegrityFailure | U7；AC-MP-303/G03 |
| PageReadContext（application） | actor/scope/selector | CoreActorContext/SafeReadContext/MarketPageSelector | Query.actor+ReadFacade.authorize+七fixedliteral | 七pagedport，CorePageRequest独立 | method错selector InvalidCursor；不refparseactor | pagebinding切口；AC-MP-302/G01 |

IDs/cursor/Clock只来自既有IDPort/UnitOfWork/ClockPort；systemclock不冒充commitorder。公开result中的revision使用save返回或同Txtypedreadback，不保留旧revision镜像。所有Optional状态条件与Row校验同authority。

### 7.3 DTO / Job 到对象构造闭环

此表分组覆盖全部33write入口，完整字段仍逐协议与Step9同名构造表；不因同U分组省略某入口schema。0event所以没有临时consumer/event构造。

| 输入契约 | 目标对象 | 必填是否齐全 / 派生来源 | 不得混同 | 缺失行为 | flow来源 |
|---|---|---|---|---|---|
| Bind/Release/Verify三C | PublisherRelation/SourceVerification/qualification/snapshot | candidate+formalports+localID、原typedloads | publisherlabel≠authority，scan≠approval | reject/blocked，realgap才存 | Step8/9 U1 |
| Create/Revise/Submit/Terminate/RecordDecision五C | Application/Basis/Review/DecisionBinding | fulldraft/typedbasis/currentformaldecision | Draftspec≠Submittedbasis、binding≠Govtruth | 缺qualification/错state全rollback | U2 |
| Dispatch/ReconcileReview二J | 原Review/Work/fullreport | checkpoint/permission+正式dispatch/probe | ACK≠Approved、effectproof≠完整原report | Unknown原probe，无probewaiting | U2/Jobexecution |
| Create/EditListing/MaintainCategory/Register/List五C | Listing/Category/Version | metadata+typedintent+formalbasis+ID+CAS | listing不资产正文；stage不是上市 | wrongscope/source/CAS拒绝 | U3 |
| Request/Cancel/RecordReceiver三C | Intent/Relation/Attempt/binding/lateimpactwork | complete typedtarget+currentgate+formaloutcome | Cancel≠remote rollback，Confirmed≠installed/paid | 负向callback命令拒绝，unknown由Job | U4 |
| Dispatch/ReconcileDistribution二J | 原attempt/relation/late责任/report | 原intentpermission+formalfullbinding/currentB | originalexternalintent≠newJobkey/fence | probe-only，必要late责任同B | U4/Jobexecution |
| Restrict/Withdraw/Plan/RecordNotice四C | Disposition/Impact/Notice/binding | localcursor+formaldisposition/noticeauthority+typedknownfacts | knownscope≠全部安装，ACK≠阅读/卸载 | 缺formal资格blocked，不伪target | U5 |
| EnumerateKnownImpact J | Impact/window/continuation/report | fixedupper+完整after+as-of双源、B新frame | scanafter≠摘要nextcursor | partial/failed真实报告，不假空完整 | U5/Jobexecution |
| Dispatch/ReconcileNotice二J | Notice/Work/正式binding/report | 原noticeplan/permission/channel/probe | 旧许可expired≠未提交 | Unknownwaiting，no blindsend | U5/Jobexecution |
| RequestMarketRecovery C / RunMarketRecovery J | Recovery/typedtarget责任/report | formalrecoveryauthority+原checkpoint/probe/localfacts | local恢复≠ownertruth修复 | Recovery递归拒绝，旧原report不足waiting | U6 |
| Dispatch/ReconcileObservation二J | ObsBinding/Work/report | 21C+八J同Tx生产O，frozenoriginalauditset，正式producer | localaudit≠Obsreceipt≠evidence | 资格缺blocked，potentialcommit无probewaiting | U6+Step15 |
| RefreshQualifiedReferences J | snapshot/continuation/report | formalcurrenttypedsidecar+state/CAS | state≠本体，snapshot≠assettruth | missing/gap真实Unavailable/Blocked | U7 |
| RebuildMarketReadProjection J | Projection/完整manifest/report | committedfacts、formalqualifiedslices、nonemptyplan | oldindex≠truthsource，Fresh≠contractready | missingkey/unsafe/incomplete拒绝publish | U7 |

所有accepted33writes均完整storedresult；JobA/B及21C+八J O/P有限生产由Step9/15约束。port失败不通过string异常推outcome，sameports fake无privateextras。

### 7.4 状态闭环表与命名authority

正式值逐字取Step6 enum，状态图/矩阵取Step10，合法/禁止/condition refs以相应U附录为唯一完整authority，Step16覆盖222pairs/73A。这里不产生第二份省略guard的矩阵。

| enum / carrier | 正式值 | 产生函数 / flow authority | 合法/禁止 authority | 测试 / 后续AC |
|---|---|---|---|---|
| PublisherRelationState | Bound, Released | U1卡+Bind/Release | U1矩阵；Released不可current授权 | U1；AC-MP-101/G01 |
| SourceVerificationState | Pending, Qualified, Blocked, Invalidated | U1卡+Verify/Release | U1矩阵；无formalbinding不Qualified | U1；AC-MP-101～103 |
| PublicationApplicationState | Draft, Submitted, Terminated | U2卡+Create/Revise/Submit/Terminate | U2矩阵；Submitted不可改fixedbasis | U2；AC-MP-201～203 |
| ReviewHandoffState | PendingDispatch, WaitingDecision, MatchedDecision, CommitUnknown, ContractBlocked, Failed | U2卡+Dispatch/Reconcile/RecordDecision | U2矩阵；MatchedDecision非approvalstate | U2；AC-MP-202/203 |
| MarketVersionState | Staged, Listed, Restricted, Withdrawn | U3卡+Register/List/U5处置 | U3矩阵；Withdrawn terminal | U3/U5；AC-MP-201/501 |
| DistributionIntentState | Accepted, Cancelled | U4卡+Request/Cancel | U4矩阵；Cancel保留attemptfacts | U4；AC-MP-403 |
| DistributionAttemptState | Prepared, Dispatching, Confirmed, Failed, CommitUnknown, Blocked | U4卡+三C/二J | U4矩阵；Unknown不是Failed | U4；AC-MP-402/403 |
| ImpactCoverageKind | Partial, KnownScopeComplete | U5卡+枚举/lateinclude | U5矩阵；只fixedupper本地knownset | U5；AC-MP-502 |
| NoticeIntentState | Prepared, Dispatching, Confirmed, Failed, CommitUnknown, Blocked | U5卡+Plan/Record/二J | U5矩阵；ACK≠Confirmed | U5；AC-MP-502 |
| OperationRecordState | Reserved, Completed | U6卡+twoRunner | U6矩阵；fullresult不足不Complete | U6；AC-MP-G02/504 |
| DeferredWorkState | Pending, Claimed, Settled, Blocked | U6卡+claim/settle/block | U6矩阵；expiredClaimed self只probe-only | U6/Worker；AC-MP-403/504 |
| RecoveryIntentState | Requested, Running, Completed, Blocked | U6卡+Request/Run | U6矩阵；Completed非ready | U6；AC-MP-504 |
| ReferenceSnapshotState | Qualified, Stale, Unavailable | U7卡+Verify/Refresh | U7矩阵；Qualified必有完整safe材料 | U7；AC-MP-302/303 |
| ReadProjectionState | Fresh, Stale, Rebuilding, Unavailable | U7卡+initialize/rebuild | U7矩阵；初始Stale，Fresh必完整manifest | U7；AC-MP-303/G03 |

Review的正式Approved来自Governance外部outcome/currentvalidity，不给Application增加Approvedstate。Listing/Category/Relation/Disposition/audit/binding/result/permission/plan无独立新lifecycle；Coreactorhint/locale/SDKconfiguration也不是状态机。

### 7.5 16 Query response / view闭环

全部response外层为`ReadSurface<T>`；`Ready/Empty`携Page<T>/PageInfo与ReadMarker，NotVisible/Missing/Degraded各严格独立schema见Step8.shared_surface。每个T全字段见对应Step8/Step6卡，下表明确来源与稳定ID；currentdisclosure先过滤items/count/token，合法空有formal scopesummary，不以空集合猜visibilityref。

| Query | T / 必要字段族 | typed来源 / key | empty / hidden / degrade | 最小测试 |
|---|---|---|---|---|
| GetSourceQualification | SourceQualificationReadModel；verification/source/summary/status | load_verification+get_qualification_outcome；typedverificationref | safeoptional摘要可None；缺资格独立gap | U1 |
| GetPublicationProgress | ApplicationProgressReadModel；application/review/basis/state | load_application+review/basis；application_ref | authorizedMissing独立；不从projection造决定 | U2 |
| SearchMarketplaceCatalog | CatalogReadView；listing/versionrefs/safemetadata/readcontext | Catalog projection(kind,scope)+search_catalog(filter,PageReadContext) | source落后Degraded，当前同predicate合法空 | U3/U7/page |
| GetMarketplaceListing | CatalogReadView；实际listing+listed版本 | load_listing+page_listed_versions；listing_ref | 当前可见metadata；pagedselector固定本Query | U3/page |
| ListMarketVersions | MarketVersionReadItem；version/source/状态/revision | list_versions；listing_ref+currentcontext | 全版本historychunk，不当全库可获取承诺 | U3/page |
| SelectMarketVersion | SelectedVersionView；actualversion/source/gate | load_version/原basis+current资格；显式version_ref | 无可用不换最新版，degrade/denied独立 | U3 |
| ListMarketCategories | CategoryReadItem；category/parent/scope/label/revision | list_categories(typedfilter,PageReadContext) | parenthidden不漏children/count | U3/page |
| GetAcquisitionEligibility | DistributionProgressReadModel；当前eligibility及gap | typedversion/basis+正式owner/gov/receiver | readonly资格，不创建intent | U4 |
| GetDistributionProgress | DistributionProgressReadModel；intent/relation/attemptsnapshots | load_intent+findrelation+page_attempts_by_intent；intent_ref | attempts有完整position，Unknown独立 | U4/page |
| GetWithdrawalImpact | ImpactNoticeReadModel；relation/unknownsets+noticeitems | disposition/impact+page_notices_by_impact；disposition_ref→typedimpact | relation/unknown是savedset经当前裁剪，只有Notice分页 | U5/page |
| GetNoticeProgress | ImpactNoticeReadModel；actualnotice/impact/fullbinding | load_notice+impact；notice_ref | no fake receipt/阅读，gap独立 | U5 |
| GetMarketAudit | AuditRecoveryReadModel；六safeaudit片段/原op/observerbinding | list_audits(subject,PageReadContext)+get_observation_binding(originalop) | 每audit实际PK不是subject同值，Query不审计自身 | U6/page |
| GetRecoveryProgress | AuditRecoveryReadModel；actualrecovery/state/fullreport | load_recovery+load_result；recovery_ref | missing报告不是Completed或ready | U6 |
| GetOperationResult | StoredOperationResult；原kind/schema/fullpayload | load_operation/context/result；operation_ref/result_ref | 整体原结果披露，missing/wrongkind IntegrityFailure | U6 |
| GetReferenceFreshness | ReferenceFreshnessView；snapshot/source/validity/state | find/load_snapshot；typedsourceidentity+scope | qualified材料失效不能仍可见 | U7 |
| GetProjectionFreshness | ProjectionFreshnessView；identity/state/highwater | find/loadprojection+source_cursor；kind+scope | Fresh缺manifest/body IntegrityFailure，no rebuild | U7 |

七pagedQuery的selector/ref/filter/currentactor由PageReadContext及方法实参闭口；其他九详情next_token=None，不暗增pagedcollection。`RepositoryCursor`只内部typedposition，`Core PageToken`是private strictcodec结果；不签名authorize、不反向解析ownerref。

### 7.6 Public protocol传递类型闭环

| surface | 外层 / 字段 | 传递类型与owner | schema authority | missing / duplicate / retry | 依赖 / 测试 |
|---|---|---|---|---|---|
| Command | CommandEnvelope.body/actor/meta | T=21Request；CoreActorContext/CommandMetadata | Step8各U+shared_surface、Coreexports | 缺key拒绝；同canonical原completepayload | contracts→Core，不→domain；protocol/entry |
| Query | QueryEnvelope.body/actor/meta | T=16Request；CoreQueryMetadata含page | Step8各U/Core | no operationkey，badpageInvalidInput，currentvisibility | contracts/Core；16no-write |
| Job | JobEnvelope.body/context | 12Request、MarketWorkerContext含Coreactor/request/fence | Step6.runtime_helpers/Step8.shared+各U | 同work+原plan/selector；samekeyfullreport，Reservedwaiting | internaltrustedtyped，无HTTProute；Worker |
| Commandresult | family result.receipt / snapshots | CommandReceipt、MarketResultSurface、七Utypedfield族 | Step6/8 shared、各U | 原resultfullref/work/audit完整，no currentrebuild | contractsimmutable，不leakdomainentity；C21 |
| Jobreport | fullreport.items/fence/workstate/auditrefs/spawnedrefs | MarketJobReport/JobItemResult/finiteoutcome | Step8shared+Step9Jobexecution | 逐itemactualgap；actualsuccessor同Tx；replay不重scan | contracts；J12 |
| Readsurface | items/info/marker / degraded | Page<T>/PageInfo/ReadMarker/ReadSurfaceKind | Step8shared+typedread模型 | legalEmpty/nohidden; wrongcursor/error有限映射 | contracts；Q16 |
| Queryrepo context | actor/scope/selector/page | application PageReadContext/MarketPageSelector；CorePageRequest | Step7新增完整schema+Step13codec | seven fixed mapping，unknown/mismatchreject | application→Core/contracts；fake/PG同规则 |
| internal scan | upper/after/limit | ReadWindow/RepositoryCursor/RepositoryPositionSubject | Step7/13 | sameupper完整after；legalpositionPK，不摘要续页 | application；PGas-of |
| externalbinding | owner/decision/outcome/receipt引用 | contracts完整immutableSource/Gov/Receiver/Notice/Obs组合 | Step6七U+shared/Step7ports | 缺/错scope/ref/version拒绝；ACK非formal | formalSDKonly；qualificationblocked |
| 0event | 不适用 | 无consumer/outbox/payload/dedup | Step8inventory | 不能为effect模板生成第N+1event | 无Busdirectdep |

### 7.7 Phase / commit boundary闭环输入

当前03不定义phase/task/commitID，因此没有“已通过实施boundary”。本表是未来07分界时必须携带的前置集合，不是开发顺序或排期。每个boundary须最小ownerfile变更路径、正式03/05/06/07引用、标准§九全项结论；split不能把当前用到的carrier/ports/report移到后序导致fake私补。

| 内容集合（非phase） | 必须同boundary或真实前置 | 明确排除 | 不得依赖后续 | 测试 / 验收范围 |
|---|---|---|---|---|
| contracts/domain | refs/states/二级carrier/Row/factory/finiteerror完整authority | SQL/SDK/HTTP/auth/Billingtruth | 不能先写flow后等下一boundary补state/condition | Step16pure；相应AC/VETO |
| application/fake | 17ports+genericrunners/gates+完整typed result/checkpoint/当前schema | infra类型导入/privatefake补口 | 原report/读取口/currentdisclosure/ canonical intent为当前前置 | C/Q/J正反与no-write/replay |
| durable storage | PGcodec/PKUKCAS/UoW/frame/历史as-of/result/audit/work | owner正文/跨owner事务/任意GC | cursor/tie-break/原result读回不可后置 | 真实PG局部契约，AC-MP-G02/G03 |
| qualified SDK adapter | exact正式consumer+operation/schema/currentvalidity/probe | genericSDK读写当ready、ownerCargo/fakeproduction | 上游owner确认不足不能靠未来07signoff补造 | affectedSDKintegration，范围逐qualification |
| API/Worker | trustedCore上下文、DTOmapper、finiteerror、typeddispatch、crash恢复 | internalHTTPJob、任意CLI、日志作truth | fullreport/leasefence/permission/currentgate必须当前闭口 | entry/Worker+AC-MP-G01/G02 |
| Web | typed37HTTP/ReadSurface、locale与UIstate、currentbuttonavailability | 直owner/SDK/DB、自产approval/installed/paid | 不能先展示成功等后序真实adapter补证 | Webworkflow/locale+AC-MP-G04 |
| audit/maintenance | sameTx原audit/Oplan/manifest/as-of/有限no-recursion | Obs/Archivebody、export/restore、event、evidence写入 | requiredowningrows/typedsourceplan/report不可后置 | Step16跨契约+AC-MP-503/504 |

07结束才创建implementationledger与全部planned/blocked/waiting skeleton；未来真实测试/材料/run/evidence/verdict/signoff须独立执行，不以schema骨架代readiness。全部外部资格由Step18按path保留。

### 7.8 命名一致性表

| 名称类型 | 正式名称 | 禁用旧名 / 混同 | 出现位置 / 修正 |
|---|---|---|---|
| publisherstate | Bound / Released | Active/Verified publisherlabel当认证 | Step6/10/16；新切口已改Bound |
| versionstate | Staged / Listed / Restricted / Withdrawn | Registered/Published/Approved/Installed混为state | Step6/10/15/16；新摘要已改Staged |
| source/snapshotstate | SourceVerification Qualified、ReferenceSnapshot Qualified | Verified/Fresh snapshot等非enum旧口语 | Step6/10/16；Fresh仅ReadProjection |
| review结果 | GovernanceDecisionBinding + ReviewHandoff.MatchedDecision | MarketApproval/scanpassed/ACK approval | Step6/8/9/10；validapproved外部owner |
| version/digest | OwnerVersionRef vs MarketVersionRef；OwnerAssetDigest vs MarketIntentFingerprint | marketsemver替资产identity，本地hash替ownerdigest | Step6/11/13 |
| distribution | Intent/Attempt/Relation/ReceiverOutcomeBinding | transaction/paid/installedstate | U4严格localfacts，不新增Billingwriter |
| notice | NoticeIntent/NoticeOutcomeBinding | delivered/read/uninstalled假结论 | U5；正式receiver结果范围才可解释 |
| observation | MarketAuditRecord / ObservationOutcomeBinding | EvidenceRecord/signoff/Archivepackage | U6/Step15；六safe字段与正式ref分层 |
| metadata/key | CoreActorContext/CoreCommand/Query/RequestMetadata | LocalActorContext/top-level key/duplicated trace | Step6/8/13/14/15；Core唯一authority |
| cursor/page | RepositoryPositionSubject / CorePageToken / PageReadContext | subject当每work/auditPK、签名token=授权 | Step7/9/13/16；七caller显式currentcontext |
| 交付状态 | design completed / planned / blocked / waiting | implementationready、fakepass=qualification、提前implementationledger | flow/项目台账/后续07 |

### 7.9 冲突与修正表

下列ID是本地03诊断索引，非上游正式blocker；修复只在Marketplace设计内完成。已有标准覆盖这些经验，无需修改仓外规范（也未经授权）。

| 本地冲突ID | 位置 / 类型 | 影响 | 修正 | 状态 |
|---|---|---|---|---|
| MP-DDD-FIX-01 | Step6 pub(crate)rehydrate / 跨crate缺口 | infra不能合法restore | 43 public校验rehydrate，Step11Row导出/revision回读 | design-fixed；未compile |
| MP-DDD-FIX-02 | Step11 cursor/as-of / 稳定顺序 | latecommit/更新后row漏扫 | RW入口事务帧锁+mp_fact_versions+perkindhighwater，B新cursor | design-fixed；PGnot-run，Q-MP-01保留 |
| MP-DDD-FIX-03 | Step7旧subjectcursor / 不唯一PK | 同targetwork/同subjectaudit丢页 | RepositoryPositionSubject六variant，scan选择真实PK | design-fixed；fake/PGnot-run |
| MP-DDD-FIX-04 | Step13pageactor有规则无输入 | infra需偷读metadata | PageReadContext/七selector、14声明/表和七caller同步 | design-fixed；currentauth仍blocked |
| MP-DDD-FIX-05 | Step15 Observation无producer / 不可达 | 需Worker私造work/auditset | 21C+八J sameTx既有schedule，四J无O递归 | design-fixed；formalproducer资格不关闭 |
| MP-DDD-FIX-06 | Step13sealed marker / schema可见性 | 纯callable不完整说明 | private mod sealed完整声明，33finiteimpl，无Queryimpl | design-fixed；未编译 |
| MP-DDD-FIX-07 | Step15/16摘要state口语 | 测试state漂移 | 对照actualenum改Bound/Staged/Qualified；14enum复核 | design-fixed；无新state |
| MP-DDD-FIX-08 | 台账损坏title/Step11旧恢复、Step10进行中摘要 | 恢复门禁矛盾 | 修title/currentrecovery/docprogress、当前完成行；旧暂停标历史 | design-fixed；最终19再同步 |
| MP-DDD-FIX-09 | Job B derivedplan沿旧reserved.cursor | 可能冻结A上限遗漏本B变化 | 明确result_reserved同原IDs/context但cursor=B新帧；queue/report使用它，Acheckpoint不可变 | design-fixed；PGnot-run |

### 7.10 正反例与未移交问题

正确：GetMarketAudit将Query.actor、正式SafeReadContext、固定GetMarketAuditselector传给list_audits；count/items/token都currentpredicate。错误：repository从disclosure_ref或HTTPheader猜actor，再以tokenchecksum授权。

正确：Submit把真实auditref的Owork放入同Tx后再构造完整receipt；DispatchObservation只消费frozenoriginaloperation/auditset，自己B审计不O。错误：Worker扫描audit生成新业务intent，或ObsJob再投递自身audit直到循环。

正确：Confirmed晚结果以新授权Reconcile和B新cursor承接所有适用disposition责任；原报告不足继续Reservedwaiting。错误：cancel/expiredlease/单次keymissing就当notcommitted，强行Complete或再dispatch。

本轮无artifact/materialization实现面：只ReceiverPort消费正式delivery/ref/outcome，外部资产包/位置/正文/血缘不进入本仓。缺正式receiver location/materialization/probe合同属于MP-UP-005；不得让实现者拼downloadURL/包digest。未来machine artifact/fixture/report写入须05/06/07正式定义schema/路径/readerwriter/redaction，当前无writer、不预造EV编号。

### 7.11 实施承接清单与跨文档结论

| 承接项 | 已定义位置 | 实施者如何使用 |
|---|---|---|
| 模块/path/object/schema | Step3～7、本Step§7.1～7.2 | 按owningfile创建最小源码；规范性附录全字段必读，不根据正式摘要补字段 |
| 协议/flow/state | Step8～10、本Step§7.3～7.6 | 一入口一flow，exactenum/guard/condition，不把ownertruth复制 |
| storage/error/idempotency | Step11～13 | 同Txfullresult/audit/work、frame/as-of、originalkey/probe与finitecanonical |
| config/telemetry | Step14～15 | 04补profile数值而不能配置bypass；safe有限埋点与Obs资格分层 |
| test/AC映射 | Step16、本Step表中当前00AC | 05分case，06正式证据映射，0当前run/verdict |
| boundary审计 | 本Step§7.7、标准§九 | 07逐phase/commitboundary审计03/05/06/07，全部planned/blocked/waiting初始 |

| 复核项 | 设计位置 | 下游 | 结论 | 未关闭问题 |
|---|---|---|---|---|
| 字段/condition/DTO构造 | Step6～9、§7.2～7.3 | 05/06/07 | 文档source map闭口 | exactowner/schemaqualification仍affected |
| Query/page/marker/传递类型 | Step7/8/9/13、§7.5～7.6 | 05/06/07 | pageactor/selector缺口已回修，current/no-write闭口 | runtimeauthowner缺仍blocked |
| 状态/函数/可执行variant | Step6/9/10/16、§7.4/7.8 | 05/06/07 | 14enum一致、222pairs与切口完整 | 状态测试not-run，06后续展开 |
| metadata/key/fullresult/原intent | Step7～13 | 05/06/07 | 单Coreauthority与原report/读写成对 | no-probe/原report不足必须waiting |
| projection/stale/source/history | Step9/11/13/15 | 04/05/07 | typed完整manifest/as-of/depupper、no selfloop | PG性能/retentionauthority Q-MP-01 |
| artifact/evidence | §7.10+Step7receiver/Obs | 05/06/07 | 当前不拥有writer；localrefs证据上限明确 | MP-UP-004/005/008，futureBilling/Archive |
| phaseboundary | §7.7 | 07 | 只审计输入通过，不声明最终boundary通过 | 04～07未完成/未授权 |
| 交付实现前审计输入 | Step1～16+§7.1～7.11 | 07 | 对象/协议/flow/state/SQL/test/AC完整可索引 | 最终移交必须07按03/05/06/07逐boundary审计 |

### 7.12 实施前置阅读清单

| 文档 / 检查 | 阅读目的 |
|---|---|
| 当前正式00/01/02/03及本章normativecalibration | 业务owner、完整schema/flows/state、不重复裁决 |
| 后续获确认的正式04/05/06/07 | 配置profile、case/真实证据上限、boundary/rollback；旧05/06不可用 |
| 设计通则、中间产物规范、全局依赖§4.1 | 串行校准、来源/恢复门禁、compile/runtime裁剪 |
| 设计真相源闭环与可落码性标准§九 | 每boundary全部适用检查与缺口回写，不自行补truth |
| 子项目目录与代码文件组织规范 | role crate、package/lib/bin命名、源码/test/artifact/report路径 |
| Rust编码规范的源码语言/rustdoc/命名/格式 | 英文pubstruct/字段/enum/每variant/trait/function注释、Errors、测试名 |
| Vue/TypeScript编码规范 | scriptsetup/单向state、typedDTO与runtimevalidate、i18n仅展示 |
| 实施计划书写规范§5.11与未来07提交纪律、目标仓更严格规则、合格历史提交 | 实现英文type(scope):subject、body按子功能/改动量、具体固定footer、commit时机与门禁；当前不提交 |
| 项目级git user.name/user.email只读检查 | design仓当前quantalithos-labs/quantalithos.ai@gmail.com；目标不存在不能宣称已配置，禁止--global |
| 代码实施台账与门禁规范 | 07完成才创建ledger/skeleton且全planned/blocked/waiting，真实测试后变更状态 |
| 九owner当前正式受影响consumer/SDKexports及台账 | exactqualifications/upstreamblocker不以目录/endpoint/通用client关闭 |

复杂度判断：本Step十类cross-doc复核在独立表中完成；schema/43cards/49flows/14matrix仍引用现有独立附录，不压成一张总表、不复制万行schema。无排期/phaseID/task拆分，旧材料差异审计等待Step19。

## 8. 文档草稿

正式§16候选采用§7.11承接/复核表、§7.12前置阅读与§7.7移交门禁；完整十类cross-doc审计为本Step规范性阅读来源。不能把MP-DDD-FIX诊断过程装配进正式正文；正式只写收敛的输入/来源/禁止/未闭合资格。

## 9. 待确认事项

MP-UP-001～008、MP-SRC-003/010/013、Q-MP-01及受影响Hub/Images/Obs/SDKexactconsumer保留。04～07及实施门禁不因03完成而解除；本Step不造task/phase/evidence。

## 10. 自检与下一动作

静态复核：17ports/146methods、43主对象/publicrehydrate、49独立flow、七pagedcaller与14声明/表、21C Oproducer库存均通过；十类cross-doc表和14enum/16Q逐行来源已核，新增finitecontext未改变业务/port库存。局部Markdown链接/表格/围栏与范围内diff whitespace再次通过；只设计检查，未compile/PGrun/evidence。九个本地设计冲突已回源修复，外部MP-UP/SRC/Q资格不关闭。Step17停审pass（文档），下一读Step18风险SOP/规范5.17、02§13与当前ownerledger受影响资格，不实现、不提交。
