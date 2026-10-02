# 03 Step 16：测试切口与最小验证清单

## 1. Step状态

2026-10-02；full-restart / single-agent；completed / selfcheck_done / stop_review（文档）。已读SOP Step16、规范5.15、闭环2.15、Step15与Step4 planned测试路径。这里只定义最小入口，不生成05用例库、CI、fixture、报告或evidence，不执行测试。

### Step内计划

| 单元 | 状态 | 位置 |
|---|---|---|
| 输入/回答/诊断/取舍 | done | §2～6 |
| 七模块与49协议 | done | §7.1～7.2 |
| 状态/事务/幂等/安全 | done | §7.3～7.5 |
| 上限/候选/自检 | done | §7.6/8/10 |

## 2. 本步输入

[Step15](03_ddd_step_15_observability_audit.md)的安全埋点/明确Obs生产方/防递归取舍与待确认；[Step4测试路径](03_ddd_step_04_units_file_layout.md)、[Step5模块](03_ddd_step_05_module_contracts.md)、Step6七U对象及Row、[Step7ports](03_ddd_step_07_typed_ports.md)、[Step8协议](03_ddd_step_08_protocol_contracts.md)、[Step9流](03_ddd_step_09_function_flows.md)、[Step10矩阵](03_ddd_step_10_state_matrix.md)、[Step11](03_ddd_step_11_persistence_transactions.md)、[Step12](03_ddd_step_12_errors_recovery.md)、[Step13](03_ddd_step_13_concurrency_idempotency.md)、[Step14](03_ddd_step_14_config_bindings.md)。

## 3. SOP问题回答

1. 每模块单测？contracts完整codec/metadata、domain七U纯guard/Row/state、application七U同ports fake流程、infra PG与SDKmapping、APIcontext/error、Workercrash/fence、WebDTO/UIstate/locale。不新造jobs crate。
2. 每接口正异常？49入口逐行，21C验证真实局部接受与reject/replay，16Q验证可见读与不写，12J验证fullreport/A-B与Unknown/blocked。正向fake是设计分支测试，非owner qualification。
3. 合法非法？14carrier逐矩阵222pairs，73A显式guard/optionalcondition，S分类不等盲重发，R拒绝零副作用；factory/terminal/expiredclaimed另切。
4. 事务/幂等？fake确定性fault切断+未来PG实际CAS/帧顺序/as-of历史/原result/permission/checkpoint；canonical33DTO、page binding/currentfilter、late withdrawal竞争、audit投递sameUoW全部可断言。
5. 留05？TC编号/fixture/优先级/覆盖率/CI/环境/执行脚本与报告细节；06真实证据与verdict/签核；07boundary审计。当前不给not-run赋pass。

## 4. 当前文档问题诊断

只按模块写“做单测”会漏49协议与状态R分支；只fake会漏SQL commit-order与多事务as-of查询。必须区分pure/fake/PG/API/Worker/Web的证明上限。新Step11帧/历史、Step13canonical/token、Step15auditproducer回修都需独立failure断言，不让旧Step5～10自检覆盖新契约。

## 5. 改动前后对比

| 项 | 前 | 后 | 理由 |
|---|---|---|---|
| 测试 | 七U分散切口 | 模块+49协议+14carrier+跨契约索引 | 05可逐项接续 |
| fixture能力 | owner正向候选 | fake/real资格严格分层 | 不造外部ready |
| 新规则 | 文本契约 | 每规则至少一个反例/故障入口 | 发现漏项而非仅happy path |

## 6. 设计取舍

复用Step4全部planned测试文件，不创建实现文件或新gate脚本。domain按U测试，application同公开port签名spy/fault fake，不有私有读取补口；PG测试是必须的后续实现验证，不以fake替代。每入口正向+异常切口粒度固定在本Step；后续05分配case而不能私改协议/state/ownership。

## 7. 结构化中间产物

### 7.1 模块测试切口与planned路径

目标实现仓不存在，下列全是planned路径；不创建文件。每个U的domain/application切口覆盖其43主要对象与支撑类型的完整field/condition/Row，不只测试表中代表。

| 测试切口 | 对应契约 | 验证内容 | 建议类型 / planned入口 |
|---|---|---|---|
| contracts finite codec | Step6/8所有typed ref/DTO/result/view/report | strict未知field/tag拒绝，optional显式，Coremetadata无影子authority，49roundtrip | unit；crates/contracts/tests/protocol_roundtrip_tests.rs |
| domain七U | Step6/10 | 每factory/member/rehydrate纯同步，conditionrefs必需、不复活terminal、无I/O | unit；crates/domain/tests/{source_responsibility,publication_review,catalog_version,distribution,withdrawal_notice,audit_recovery,reference_read}_tests.rs |
| application七U | Step7/8/9 | 同17ports/146methods的spy/fake；调用顺序、完整result/rollback/currentdisclosure | service；crates/application/tests/{source_responsibility,publication_review,catalog_version,distribution,withdrawal_notice,audit_recovery,reference_read}_flow_tests.rs |
| PG UoW与codec | Step11/13 | 实际unique/CAS/revision/readback/commitframe/历史as-of/sourcekind | integration；crates/infra/tests/postgres_atomicity_tests.rs |
| SDK qualifications | Step7/12/14 | 完整schema/immutablebinding、unsupported/gap/unknown、no rawbody | contract；crates/infra/tests/sdk_qualification_tests.rs |
| withdrawal竞争 | Step9/10/11 | publisher→version锁、许可与撤回序列化、旧许可晚结果责任 | PG integration；crates/infra/tests/withdrawal_race_tests.rs |
| projection/reference | Step9/11/13 | 完整manifest、currentfilter、fixedupper、sourcekind、自audit不循环 | PG/service；crates/infra/tests/projection_rebuild_tests.rs |
| API | Step8/12/14 | trusted actor/meta、HTTP错误、replay header、没有internalJob route | entry；crates/api/tests/entry_mapping_tests.rs |
| Worker | Step9/13/14/15 | typed frozen work dispatch、A/B crash、claim/fence、probe-only、shutdown责任 | entry/service；crates/worker/tests/worker_recovery_tests.rs |
| Web protocol | Step8/12 | runtimeDTO验shape、Unknown/Degraded/NotVisible/Blocked独立显示 | Vitest；apps/web/tests/marketplace_protocol_tests.ts |
| Web locale | Step14 | 初次En/选择Zh，翻译不改ref/enum/key或重新提交 | Vitest；apps/web/tests/marketplace_locale_tests.ts |
| Web workflow | Step5/8/9 | catalog/type/version、publish/progress/distribution/withdraw/recovery视图；不自行资格/approval | component/browser；apps/web/tests/marketplace_workflow_tests.ts |

花括号只是缩写七个已列Step4的实际文件，不是新glob脚本或fixture路径。无新增gate/report/check脚本；当前不需要交付执行脚本，若05/07决定增加，须受控定义参数、`artifacts/test/<run_id>`与`reports/`、失败保留，不把本文示例当已存在run。

### 7.2 49协议独立正反切口

每行反查同名Step8协议与Step9 flow；U列指向对应Step6/10独立附录及7.1七U测试入口。C通用额外断言：真实accepted audit/O/P/fullresult同Tx，samekey+samecanonical完整原replay零写；Q通用：currentfilter先count/page/token且零write/ID/context/Clock/audit/work/refresh；J通用：immutablecheckpoint、KnownCommitted A才external、B完整逐item报告/audit/successor。每行至少覆盖表中一正一反，不能将通用断言替代本行业务断言。

| 入口 | U / 类型 | 正向最小断言 | 异常最小断言 |
|---|---|---|---|
| BindPublisherRelation | U1/C | formal publisher/scope匹配后仅本地relation Bound | 人类authority缺/Identity AI冒充时blocked，无fakeprincipal |
| ReleasePublisherRelation | U1/C | release与实际verification失效原子 | publisher/version竞争或expectedrevision错全rollback |
| VerifyPublicationSource | U1/C | exact immutable source/material形成真实qualification/safe snapshot | digest/version/visibility错配或材料缺不得verified |
| GetSourceQualification | U1/Q | 当前可见qualification及独立gap | notvisible不漏source/ref/count、不补scan |
| CreatePublicationDraft | U2/C | 原draft_spec完整保存，state Draft | 无授权/非法sourcecandidate拒绝，未伪basis |
| RevisePublicationDraft | U2/C | Draft exactCAS，完整替换允许draft字段 | Submitted不能改fixedbasis，冲突零audit |
| SubmitPublicationApplication | U2/C | fixedbasis+Submitted+Review work同Tx | 当前publisher/material/source资格撤销无提交 |
| TerminatePublicationApplication | U2/C | 本地Terminated不抹旧handoff责任 | 已发unknown不能当未提交删除/checkpoint丢失拒绝 |
| RecordGovernanceDecision | U2/C | 正式fullbinding exact申请/basis/subject/scope | ACK/scan/signature或wrongversion不能approved |
| GetPublicationProgress | U2/Q | 当前披露申请/review独立进度 | 源不可用Degraded，不用假Empty掩盖 |
| DispatchReviewHandoff | U2/J | A许可后原intent一次dispatch，真实报告/O | Acommit未知零dispatch；timeout→Unknown/probe责任 |
| ReconcileReviewHandoff | U2/J | 原permission/basis probe匹配后收束 | 无probe/原report不足waiting，不blindresend/假complete |
| CreateMarketplaceListing | U3/C | ownerref独立listing metadata | 资产正文/registry写入或owner不符拒绝 |
| EditMarketplaceListing | U3/C | localmetadata/revision更新 | immutable source就地替换/越scope拒绝 |
| MaintainMarketCategory | U3/C | scope/parent正确taxonomy维护 | cycle/parent跨scope/未授权拒绝 |
| RegisterMarketVersion | U3/C | exactsource+application绑定Staged | 同listing重复sourceidentity UniqueConflict，非SemVerupsert |
| ListMarketVersion | U3/C | current正式Approved+全部gate才能Listed | scan签名/ACK代approval、publisher已release、Withdrawn拒绝 |
| SearchMarketplaceCatalog | U3/Q | 同predicate文本/type/category/filter+稳定page/count | 短中文literal、SQLwildcard文本、hidden过滤、staleindex均正确无写 |
| GetMarketplaceListing | U3/Q | 当前可见metadata+完整选择条件 | 当前owner不可见不输出旧snapshot/body |
| ListMarketVersions | U3/Q | version固定序与currentdisposition过滤 | page跨scope/parent/token换filter拒绝 |
| SelectMarketVersion | U3/Q | 显式version/正式选择条件返回actual typedversion | 不以最大SemVer/最新摘要跳过eligibility |
| ListMarketCategories | U3/Q | 当前scope taxonomy分页 | parent/ref不存在先visibility，不漏hidden count |
| RequestDistribution | U4/C | currentgate+intent/relation/attempt/work原子，非installed | receiver/type无formal支持或owner资格变更无派发 |
| CancelDistribution | U4/C | Cancelled不清除旧Confirmed/CommitUnknownattempt | 不能因cancel造remote rollback或删除late责任 |
| RecordReceiverOutcome | U4/C | 原Confirmed fullbinding attach、lateimpact同Tx | Negative/Unknown命令拒绝、错receiver/intent/version拒绝 |
| GetAcquisitionEligibility | U4/Q | read-only当前owner/publisher/gov/receiver交集 | contractmissing/denied不accepted、不推导paid/installed |
| GetDistributionProgress | U4/Q | intent、relation、全部attempt按真实状态 | Unknown不能合并Failed/Empty；当前不可见不露attempt |
| DispatchDistribution | U4/J | 原许可一次dispatch，正式结果attach/O/晚责任 | withdraw与A/B竞争、timeout无notcommitted、旧fence不能覆盖 |
| ReconcileDistribution | U4/J | 原intentprobe、confirmed晚结果仍保存 | 无probeblocked；新attempt须formalnotcommit/currentgate，不偷换intent |
| RestrictMarketVersion | U5/C | Restricted/disposition/impact/scanwork原子 | 许可竞争按局部锁序，不假承诺远端瞬时撤销 |
| WithdrawMarketVersion | U5/C | Withdrawn终态与knownimpact责任；无需先notice | 已撤回不能重上架，scan/rebuild/refresh不能复活 |
| PlanImpactNotifications | U5/C | orderedtargets逐项uniqueintent，channel正式资格 | 重复/超界/非法channel不得截断称complete |
| RecordNoticeOutcome | U5/C | 正式Confirmed exactnotice/channel/target | Unknown/negative走Job，ACK不能delivered/已阅读 |
| GetWithdrawalImpact | U5/Q | currentfiltered relation/unknownsets与Notice分页 | 不可见target过滤count/token；latecursor产生Partial |
| GetNoticeProgress | U5/Q | 原notice progress和safeformalresult | 缺probe/未知不假成功或泄露target |
| EnumerateKnownImpact | U5/J | fixedupper/as-of双源联合，完整cursor continuation/O | 上限后late结果重新Partial；合法空与store不可用区别 |
| DispatchNotice | U5/J | 原noticeintent许可单次调用/fullreport/O | timeout/ACK→Unknown；B失败保留A，不重复发送 |
| ReconcileNotice | U5/J | 原permission probe匹配后真实binding | channel无probewaiting；旧lease回执新授权承接 |
| RequestMarketRecovery | U6/C | 正式authority+finite localtarget+work | 任意SQL/ownertruth修复/Recovery递归target拒绝 |
| GetMarketAudit | U6/Q | current披露safe六字段与原operation关联 | 禁rawcontext/secret/evidence，audit query零audit |
| GetRecoveryProgress | U6/Q | actual Requested/Running/Blocked/Completed进度 | Completed非集成ready，缺本体不假Empty |
| GetOperationResult | U6/Q | current全部披露后完整original typedpayload | missing/wrongkind/checkpointgap IntegrityFailure，不projection重造 |
| RunMarketRecovery | U6/J | 正式authority+原probe/localfacts安排typed责任，A/B新revision | 原report不足旧Reservedwaiting；无probe/递归拒绝，O不自投递 |
| DispatchObservation | U6/J | 原业务operation+frozen已提交auditset的正式binding | 无producer/redaction资格Blocked；无O/P递归、不造evidence |
| ReconcileObservation | U6/J | 同原operation/auditset/permission probe | 当前Jobaudit替换原集或ACK作receipt拒绝；无probewaiting |
| GetReferenceFreshness | U7/Q | 实际snapshot状态/validity/currentdisclosure | 当前资格已失不输出过期safe_material/不refresh |
| GetProjectionFreshness | U7/Q | kinddependency高水位判断Fresh/Degraded | 存在manifest缺body IntegrityFailure；no rebuild |
| RefreshQualifiedReferences | U7/J | ownerqualifiedslice+state原子/O | noowner/visibilitychanged为实际gap，不用旧缓存verified |
| RebuildMarketReadProjection | U7/J | 全plan每key Rendered/Omitted一次完整publish | 缺key/重复/空requiredplan拒绝；不以旧index修truth、不投递自身audit |

模块/协议单元停审：21C/16Q/12J、七U与七技术模块均有路径和正反断言；0event/consumer/paid流程，不新增第50入口。下一状态/跨契约单元不得用fake成功关闭ownerblocker。

### 7.3 14状态机最小切口

对应[Step10主控](03_ddd_step_10_state_matrix.md)与其U1～7独立enum/矩阵。每行执行该carrier全部n*n=222pairs的A/S/R：A=73条合法迁移逐guard与sideeffect，S逐分类断言（不是新操作无条件no-op），R返回typed非法/不满足guard且全部零写。factory不算pair，单测合法初态/完整condition字段；terminal与rehydrate损坏另测。

| carrier / state authority | 合法最小切口 | 非法 / 特殊最小切口 | planned入口 |
|---|---|---|---|
| PublisherRelation / PublisherRelationState | formalbind→Bound、正式release | release后不得作为currentpublisher资格；publisher/version锁竞争 | domain/application U1 |
| SourceVerification / SourceVerificationState | 正式qualified或actualblocked/失效 | missing digest/visibility/material不可Verified；refresh不改旧terminal | domain/application U1 |
| PublicationApplication / PublicationApplicationState | Draft→Submitted固定basis，正式决定/terminate | Submitted改draft拒绝、approved绑定wrongbasis拒绝 | domain/application U2 |
| ReviewHandoff / ReviewHandoffState | 许可发出/正式probe收束 | ACK≠approved，Unknown只probe，terminal不重发 | domain/application U2 |
| MarketVersion / MarketVersionState | Staged→Listed、Restricted/Withdrawn | Withdrawn terminal；ownerrefresh/rebuild不复活 | domain/application U3+U5 |
| DistributionIntent / DistributionIntentState | Request/Cancel真实局部状态 | Cancel不抹attempt/receiver正式结果 | domain/application U4 |
| DistributionAttempt / DistributionAttemptState | 原fence Dispatching→正式Confirmed/Failed/Unknown | 普通timeout不得KnownNotCommitted，旧fence不能覆盖 | domain/application U4 |
| ImpactRecord / ImpactCoverageKind | fixedupper knownscan形成KnownScopeComplete | upper外晚cursor include回Partial；不承诺未知消费者complete | domain/application U5 |
| NoticeIntent / NoticeIntentState | 原notice dispatch/probe正式收束 | ACK非送达/阅读、Record命令负向拒绝 | domain/application U5 |
| OperationRecord / OperationRecordState | Reserved+完整result原子→Completed | missingfullreport不Complete；相同key变fingerprint冲突 | domain/application U6 |
| DeferredWork / DeferredWorkState | Pending→Claimed→实际Settled/Blocked | 过期Claimed→Claimed仅Reconcileprobe-only、新fence不新intent | domain/application U6+Worker |
| RecoveryIntent / RecoveryIntentState | 正式authority开始并以actualresult承接 | 递归Recovery/任意修ownertruth禁止；报告不足Blocked | domain/application U6 |
| QualifiedReferenceSnapshot / ReferenceSnapshotState | 完整safe_material/validity匹配才Qualified | 过期/不可见/contractmissing不造safe_material；state/body同save | domain/application U7 |
| ReadProjection / ReadProjectionState | 初始Stale、正式Rebuild→完整Fresh | Fresh缺manifest/body IntegrityFailure；纯维护audit不无限Stale | domain/application U7+infra |

### 7.4 一致性、幂等与并发切口

| 测试切口 | 对应契约 | 验证内容 | 建议测试类型 |
|---|---|---|---|
| command_atomic_write_set | Step9/11/15 | 在每save/work/plan/audit/result/complete处注入failure，C全rollback，Oref包含在原receipt | sameports fake+真实PGatomicity |
| job_a_b_fault_windows | Step9/11/12 | A前、Aunknown、external后、B前/Bunknown分别crash；只formalcommit A发出，旧许可/report可查 | Worker+fake+PG |
| global_frame_commit_order | Step11 | 两RW竞争：低号迟提交不被higherupper漏扫，rollbackcounter不可见；外部调用不持锁 | PG并发，非fake证明 |
| fixed_upper_as_of_history | Step11/13 | row在upper后更新/失效，历史latest<=upper仍被扫一次；跨页同frame多PK不丢 | PGintegration+service |
| revision_mirror_readback | Step6/11 | MustNotExist=0、CAS r→r+1，实体/Versioned/公开result一致；溢出/0rowfail | domaincodec+PG |
| unique_local_fk_restrict | Step11 | source完整identity、work(intent,target)、notice自然键；scope索引与本体一致 | PGintegration |
| duplicate_original_result | Step8/9/13 | 每C/J samekey同canonical返回逐字段原receipt/report/successorrefs，0ID/audit/O/P/work | fake spy+PG race |
| unknown_commit_not_absence | Step12 | 一个RO读missing不能证明rollback，需权威终止或重新获得frame再核；禁止blind effect | fake fault+PGcontrolledfault |
| full_checkpoint_recovery | Step7/9/12 | originalbody/schema/fence/result/audit完整；effectproof不足原report仍Reservedwaiting | fake+Worker |
| canonical_33_business_bodies | Step13 | 33有限DTO完整字段；每business字段变化改fingerprint，trace/time/locale/hint不改；无real digest样例 | purecanonical unit |
| canonical_order_precision | Step13 | Set排序/duplicate拒绝，PlanImpact.targets保序，u64极值decimalstrings，null/tag规范 | unit+property |
| canonical_actor_scope_binding | Step13 | actor/delegate identity/scope/selector变则冲突，role/displayhint不参与 | applicationunit |
| page_binding_current_visibility | Step7/13/17 | 七pagedmethod的PageReadContext显式actor/delegate/scope/selector，filter/upper/after绑定；method-selector错配/非法rowfamily/不可见anchor拒绝；token非auth | Queryfake+API |
| cursor_total_order | Step13 | sameframe跨Relation/Attempt/Work/Audit以真实typedPK稳定tie-break，不能用共同subject | fake+PG |
| search_predicate_parity | Step11/13 | literal OR simpleFTS；中文/短词、通配字符literal参数；候选/筛选/count/token同谓词 | PG+Query |
| projection_complete_manifest | Step9/11 | 每plan key Rendered/Omitted完整一次，Fresh必须storedpayload与manifest，samekindhighwater | fake+PG |
| dependency_highwater_no_loop | Step11/15 | unrelatedscope/kind不使projectionstale，context/lease/Oreceipt/纯维护audit不自循环 | fake+PG |
| publisher_version_permission_race | Step9/11/13 | publisher release/version restrict/withdraw与A许可局部序列化；afterpermission晚结果被持久承接 | PGwithdrawalrace |
| cancellation_late_formal_outcome | Step9/10 | cancel不抹Confirmed/Unknownattempt；新授权reconcile保存真实结果及每适用disposition责任 | domain/service+PG |
| impact_late_upper_reopen | Step9/11 | B新cursor>A且late于disposition；完整fixedupperscan后late结果回Partial | PG+service |
| external_retry_not_payment | Step12/13 | 只有formalnotcommit/currentgate新attempt；没有probewaiting，不带Billing/fakepayment | SDKfakecontract+Worker |
| observation_atomic_no_recursion | Step15 | 21C+八J Owork+frozenoriginalauditset同commit；Obs2/RecoveryJob/Rebuild无O；replay零O | U6及各Ufake+PG |

没有dead-letter queue/outbox/Bus协议，因此没有“移dead-letter即完成”路径；不可达或无probe工作保存Blocked/Unknown及原checkpoint，正式恢复仍待authority。若后续新增queue须回修02/03，不可由05私造。

### 7.5 配置、埋点与安全切口

| 测试切口 | 对应契约 | 验证内容 | 建议测试类型 |
|---|---|---|---|
| runtime_config_strict | Step14 | 七字段校验、八slots重复/缺失、unknown/bypass拒绝；demo9090非生产默认 | infraunit+entry |
| config_entry_parity | Step14 | --config/env冲突拒绝、无自动HOME；Worker无任意--job；Webpublicbase无secret | API/Worker/Web |
| adapter_availability | Step7/14 | Bound要formalconsumer+exactSDK，不以endpoint/Bound标签合格；production无fakefallback | infra+SDKcontract |
| sdk_paths_real_exports | Step3/14 | 实际Core/SDK rootpath/memberexports；owner/Bus/Billing/Archive无Cargodep | 未来manifest/build检查，不当前compile |
| trusted_metadata_only | Step8/14/15 | actor/key/trace取Core唯一authority；clientapproved/publisherverified字段拒绝 | contracts/API/Worker |
| redacted_runtime_sinks | Step12/15 | 合成sentinel rawbody/credential/stack/free reason不得入log/trace/report；safecode可诊断 | unitcapture+entry |
| finite_metric_labels | Step15 | 所有label沿finiteallowlist，无id/key/digest/trace/path/endpoint/free text | telemetryunit |
| audit_refs_only | Step6/15 | 六字段与actualbasis/result同frame，actorref受控，不嵌owner/Obs/Archivebody | domain+service+PG |
| observation_qualification_ceiling | Step15 | ACK/扫描/签名/receipt均非approval/evidence；正式producer缺则blocked且noeffect | SDK+U6 |
| query_and_replay_no_write | Step9/15 | 16Q及全部originalreplay无writeTx/context/audit/work/O/P/owner effect | 每Uspyfake+API |
| shutdown_preserves_duty | Step14 | stopnewclaim，旧许可/原checkpoint/Unknown责任保留、没有强置Settled | Worker fault |

### 7.6 证明上限与后续承接

| 验证层 | 能证明 | 不能证明 | 当前状态 |
|---|---|---|---|
| 本轮文档静态检查 | 链接/库存/字段/规则与最小切口可追溯 | Rust/Vue运行、PG隔离、SDK/ownerready | design-only |
| future pure/fake tests | 本地enum/schema/guard/flow以及typedfailure branch | owner正式合同/真实扫描/签名/支付/安装/送达 | planned/not-run |
| future PG integration | 本地唯一键/CAS/UoW/frame/as-of/readback | 外部原子性/吞吐SLO/跨系统rollback | planned/not-run |
| future formal SDK integration | 受测exact consumer/scope/schema映射与实际原probe | 未受测type/版本/材料/人类认证/交易、全项目ready | blocked/waiting qualification |
| future Web/API/Worker tests | UI和entry状态/metadata/恢复的本地契约 | 浏览器按钮状态等于approval/installed/paid/notice阅读 | planned/not-run |

04补profile与预算，05把全部入口/矩阵/跨契约切口展开case、环境和报告，06约束真实证据/资格范围，07逐boundary审计与实施计划。这里不创建fixture/assets/digest/run/evidence/verdict/signoff/ready；Q-MP-01容量实测仍待正式数值profile与后续执行。

## 8. 文档草稿

正式§15候选采用§7.1模块表、§7.2全部49正反入口、§7.3状态矩阵覆盖和§7.4～7.6跨契约/安全/证明上限。详细case与运行结果禁止进入本章，必要完整表可作为规范性calibration附录逐行阅读。

## 9. 待确认项

全体MP-UP/SRC/Q及受影响owner/SDK资格保持；真实integration/performance/security环境尚无正式验证。不通过tests文档关闭qualification。

## 10. 自检与下一动作

文档静态检查：49协议与Step9同名集完全相等（missing/extra均0）、14carrier齐备、十段完整；模块引用沿Step4已planned测试路径，新规则与失败断言能反查11～15。全部类型/矩阵实测仍not-run，未执行Rust/Vue/PG/SDK测试，不产证据。Step16停审pass（文档），下一读SOP Step17/规范5.16与实施前字段/状态/port/phase审计；不提交。
