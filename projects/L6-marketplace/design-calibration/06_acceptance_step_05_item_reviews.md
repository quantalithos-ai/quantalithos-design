# Step 5 独立功能验收项审查

本附录规范性从属于Step5。每项都是P0，按出现顺序完成小循环后设计停审；design-stop/pass不是运行、用户或owner signoff。TC/EV原定义以05Step5/6为准，报告路径遵从主控§7，全部planned/not-run。下列本地“通过”条件只用于未来声明scope的证据裁决，不授予formal资格。

## AC-MP-101 来源与责任

思考：绑定publisher relation只能消费外部资格，不能把AI Identity当human/org认证。取舍：采用exact authority refs与current scope；不采用UI verified标签或配置Bound。

设计：03U1 `BindPublisherRelation`/`VerifyPublicationSource`，SourceBinding/PublisherRelation/SourceGatePolicy；owner/type/ref/version/digest/visibility及principal/组织/scope同源。

证据：TC-SOURCE-001→EV-DOMAIN-001；TC-SOURCE-005→EV-DOMAIN-005。report=`reports/runs/<run_id>/evidence/EV-DOMAIN-001.md`与`EV-DOMAIN-005.md`（同目录）；全部required raw/同run主suite。

通过：正式资格可映射且重复完整原结果；错主体/组织/scope/AI冒认证安全拒绝。失败：本地造资格/跨scope或positive缺证；红线VETO-MP-1/3，否则P0阻断。停审：输入/正式字段/正反EV/条件/裁决已独立核对，design-stop/pass；MP-UP-001/003仍开放。

## AC-MP-102 材料与基线

思考：签名/扫描只材料，不是批准，qualified材料还须适用kind/current有效。采用owner immutable refs；不复制包、scan正文或私算资产digest。

设计：03U1 MaterialReference/SourceVerification、U2 PublicationBasis；VerifyPublicationSource→Submit冻结当前验证材料。

证据：TC-SOURCE-003→EV-DOMAIN-003；TC-SOURCE-004→EV-DOMAIN-004；同run report=`reports/runs/<run_id>/evidence/EV-DOMAIN-003.md`、`EV-DOMAIN-004.md`。

通过：五类source/material exact元数据原值且正文不存；missing/wrong-kind/stale分别gap或精确错误，变更重核验。失败：缺材料伪Qualified、第二truth、扫描当批准；VETO-MP-1/2或P0阻断。停审：完整kind/gap/边界来源核对design-stop/pass，MP-UP-004不关闭。

## AC-MP-103 核验失败与重试

思考：只读qualification不能顺便refresh；重试不得第二责任记录。采用原result与explicit维护入口；不采用自动“查时修好”。

设计：03U1 GetSourceQualification、U6原操作重放；OperationRecord/StoredOperationResult、Current disclosure/33canonical规则。

证据：TC-SOURCE-006→EV-DOMAIN-006；TC-RECOVERY-002→EV-RECOVERY-002；同run report=`reports/runs/<run_id>/evidence/EV-DOMAIN-006.md`、`EV-RECOVERY-002.md`。

通过：有效与safe gap可辨，same intent原完整结果，异intent IdempotencyConflict不覆盖。失败：无来源仍有效、Query写入、重放重造；P0阻断，造外部truth命VETO-MP-1/5。停审：readonly/duplicate/错误已核对design-stop/pass。

## AC-MP-201 申请与受控上架

思考：创建listing是壳而非批准，Draft无basis，Register只Staged。采用Submit freeze与显式List current fullgate；不把几个步骤合成自动上架。

设计：03U2 CreatePublicationDraft/SubmitPublicationApplication、U3 RegisterMarketVersion/ListMarketVersion，PublicationBasis/VersionAdmissionPolicy。

证据：TC-CATALOG-005→EV-PG-005；TC-CATALOG-006→EV-PG-006；补TC-REVIEW-003→EV-DOMAIN-009；report分别`reports/runs/<run_id>/evidence/EV-PG-005.md`、`EV-PG-006.md`、`EV-DOMAIN-009.md`。

通过：source/publisher/material/scope当前有效，exact basis/version绑定current formal approved才Listed。失败：missing/rejected/revoked/错binding仍上架；VETO-MP-2或P0缺资格阻断。停审：创建/冻结/注册/上架时机design-stop/pass，MP-UP-002仍开放。

## AC-MP-202 决定边界

思考：MatchedDecision只匹配，包含rejected；ACK/waived/fresh/signature/scan不能被译成approval。采用Gov正式读取；不本地投票或判断审核通过。

设计：03U2 RecordGovernanceDecision/ReconcileReviewHandoff、GovernanceDecisionBinding/ReviewBindingPolicy；U3List gate。

证据：TC-REVIEW-007→EV-DOMAIN-013；TC-REVIEW-008→EV-DOMAIN-014；report=`reports/runs/<run_id>/evidence/EV-DOMAIN-013.md`、`EV-DOMAIN-014.md`。

通过：正反决定binding精确，rejected可MatchedDecision但拒List；旧basis/决定不改。失败：错版本/scope/material/失效决定或ACK冒批准；VETO-MP-2。停审：MatchedDecision≠approved设计停审pass，MP-UP-002/MP-SRC-010不关闭。

## AC-MP-203 上架重试与竞争

思考：撤回与许可竞争需按实际commit顺序处理，不用CAS描述“最终会一致”。采用原完整report、publisher→version锁序；不让stale List复活。

设计：03U2 GetPublicationProgress、U3/U5 currentgate/withdraw、03Tx/幂等；original C/J result与late责任。

证据：TC-REVIEW-010→EV-DOMAIN-016；TC-CROSS-016→EV-PG-020；report=`reports/runs/<run_id>/evidence/EV-DOMAIN-016.md`、`EV-PG-020.md`。

通过：两commit次序actual PG验证，处置先commit零新许可，反序真实late结果续责不删；无本体IntegrityFailure。失败：duplicate新结果、Withdrawn复活/新分发、late责任丢失；VETO-MP-5或P0。停审：两顺序/原report/资格上限独立核对design-stop/pass。

## AC-MP-301 目录发现

思考：五类asset label须正式type映射，Hub/Method读材料不等market listing。采用owner refs与本地listing/version身份；不按sourcekind聚合丢失同类多listing。

设计：03U3 SearchMarketplaceCatalog、CatalogReadView；U7ReadProjection；03分页/simple FTS OR literal搜索规则。

证据：TC-CATALOG-007→EV-PG-007；TC-CROSS-004→EV-PG-018；report=`reports/runs/<run_id>/evidence/EV-PG-007.md`、`EV-PG-018.md`。

通过：五类/分类/标签/EN-ZH关键词，多listing/version可区分；current items/count/token一致，literal特殊字符参数化。失败：SQL/regex注入、旧index扩大范围、错type/current泄漏；VETO-MP-3或P0。停审：搜索/身份/证明上限design-stop/pass；MP-UP-001仍开放。

## AC-MP-302 可见性与只读

思考：public标签不能免scope，zero writes还包括ID/Clock/audit/Obs与外效应。采用current整条披露；不局部裁剪original result冒重放。

设计：03U3 ListMarketVersions/ListMarketCategories/GetMarketplaceListing及U7只读上下文；全16Q/33replay；PageReadContext。

证据：TC-CATALOG-010→EV-PG-010；TC-CROSS-005→EV-API-001；补TC-CATALOG-008→EV-PG-008；report=`reports/runs/<run_id>/evidence/EV-PG-010.md`、`EV-API-001.md`、`EV-PG-008.md`。

通过：隐藏整体NotVisible无ref/count/token、可见Restricted/Withdrawn仍安全准确；全部Query/replay九counter零，缺paired body不称Fresh。失败：泄漏存在性、Query修truth、重建反写源；VETO-MP-3/5或P0。停审：current/只读不混Error与Empty，design-stop/pass。

## AC-MP-303 版本选择与读取

思考：用户选择市场版本不是最大SemVer；token绑定身份/filter/upper/after。采用exact version与as-of/current交集；不fallback最新版。

设计：03U3 SelectMarketVersion，七PageReadContext caller/03Step13分页，projection payload/manifest。

证据：TC-CATALOG-009→EV-PG-009；TC-CROSS-017→EV-PG-021；report=`reports/runs/<run_id>/evidence/EV-PG-009.md`、`EV-PG-021.md`。

通过：exact market/owner version保留，gap/stale/unavailable可辨，七caller全identity变异/同frame多PK稳定不漏。失败：替版本、无资格称eligible、隐藏count/token或漏页；VETO-MP-3或P0。停审：select不造intent、actual PG不可fake替代，design-stop/pass。

## AC-MP-401 受控获取

思考：免费仍授权，缓存按钮不是current gate。采用source/publisher/material/Gov/scope/receiver交集；不开放无owner entitlement/payment路径。

设计：03U4 RequestDistribution/GetAcquisitionEligibility，AcquisitionGatePolicy/DistributionIntent/Relation/Attempt/work/fullresult。

证据：TC-DISTRIBUTION-002→EV-WORKER-002；TC-DISTRIBUTION-009→EV-WORKER-009；report=`reports/runs/<run_id>/evidence/EV-WORKER-002.md`、`EV-WORKER-009.md`。

通过：exact版本/consumer/receiver/scope有效才Accepted局部责任同Tx；Withdrawn/Invalidated/缺slot拒绝无新effect。失败：免费绕gate、撤回仍新分发；VETO-MP-3/4/5或缺资格P0。停审：Accepted非已获取/安装，design-stop/pass，MP-UP-005保留。

## AC-MP-402 接收结果

思考：ACK/HTTP成功不证明owner Confirmed，更不证明installed/paid。采用ReceiverOutcomeBinding exact维度；负向/Unknown只由Job记录，不注入command。

设计：03U4 DispatchDistribution/RecordReceiverOutcome及正式结果binding；DistributionReadView。

证据：TC-DISTRIBUTION-005→EV-WORKER-005；TC-DISTRIBUTION-008→EV-WORKER-008；report=`reports/runs/<run_id>/evidence/EV-WORKER-005.md`、`EV-WORKER-008.md`。

通过：匹配intent/version/consumer/receiver/scope与原许可，command仅formal Confirmed；视图区分局部确认与外部安装。失败：错binding接入、ACK/获取冒安装激活/付款；VETO-MP-4/5或P0。停审：仅消费formaltyped result，design-stop/pass。

## AC-MP-403 分发失败与重试

思考：timeout/cancel不证明notcommit，new attempt不改原receiver intent。采用原结果/probe-first与真实late责任；不blind resend或远端假rollback。

设计：03U4 CancelDistribution/ReconcileDistribution，33canonical及Job A/B；late outcome与U5disposition关联。

证据：TC-DISTRIBUTION-003→EV-WORKER-003；TC-DISTRIBUTION-007→EV-WORKER-007；补TC-DISTRIBUTION-006/010→EV-WORKER-006/010；同run report依完整EV-ID在`reports/runs/<run_id>/evidence/`展开。

通过：sameintent原完整receipt且zero effect，异intent冲突；cancel保真实Confirmed，unknown有原checkpoint/probe与后继责任。失败：重复effect、Unknown假成功/无probe重发/篡历史；VETO-MP-5或P0。停审：取消与attempt分轴/探测资格design-stop/pass。

## AC-MP-501 撤回与停新分发

思考：准入关闭必须与通知是否可用独立，unknown资格不是撤回依据本身。采用正式处置authority和同Tx状态/责任；不等待送达才停获取。

设计：03U5 WithdrawMarketVersion/RestrictMarketVersion及U4currentadmission，WithdrawalDisposition/Withdrawn终态。

证据：TC-WITHDRAWAL-002→EV-DOMAIN-018；TC-WITHDRAWAL-008→EV-DOMAIN-024；补TC-DISTRIBUTION-009→EV-WORKER-009；report=`reports/runs/<run_id>/evidence/EV-DOMAIN-018.md`、`EV-DOMAIN-024.md`、`EV-WORKER-009.md`。

通过：有依据Withdrawn即停新许可，通知失败仍保持撤回；旧许可真实结果续责不删。失败：通知不可用复活/撤回后新分发/伪authority；VETO-MP-5或P0。停审：终态与通知分层design-stop/pass，MP-UP-007保留。

## AC-MP-502 影响范围与通知

思考：已知relation+potential commit attempts完整但不等全安装覆盖，late B可令Complete回Partial。采用fixedupper/continuation/late责任；不造NoticeAttempt或送达承诺。

设计：03U5 EnumerateKnownImpact/PlanImpactNotifications，ImpactRecord/NoticeIntent及typedPK、ordered target/channel。

证据：TC-WITHDRAWAL-004→EV-DOMAIN-020；TC-WITHDRAWAL-005→EV-DOMAIN-021；补TC-WITHDRAWAL-006/007/009/010→EV-DOMAIN-022/023/025/026；report依完整EV-ID在`reports/runs/<run_id>/evidence/`展开。

通过：已知exact关系和unknown attempt纳入，扫描无漏/重复，late增量Partial/续责，计划/Confirmed/CommitUnknown/Blocked分开。失败：漏影响、假complete/伪通知送达/ACK当已读；VETO-MP-5或P0。停审：KnownScopeComplete范围明确，无NoticeAttempt，design-stop/pass。

## AC-MP-503 安全审计

思考：local history/audit、safe Obs producer receipt和正式evidence三层不能合并。采用原operation/auditset六字段refs-only；不拿日志或当前Job auditset重造原交接。

设计：03U6 GetMarketAudit/DispatchObservation/ReconcileObservation、MarketAuditRecord/ObservationOutcomeBinding，03副作用21C+8J O。

证据：TC-RECOVERY-007→EV-RECOVERY-007；TC-RECOVERY-009→EV-RECOVERY-009；补TC-CROSS-006→EV-REDACTION-001；report=`reports/runs/<run_id>/evidence/EV-RECOVERY-007.md`、`EV-RECOVERY-009.md`、`EV-REDACTION-001.md`。

通过：当前可见审计完整可追溯/无bodysecret，原auditset/binding匹配；缺producer/probe明确等待，Obs不递归。失败：假receipt/evidence、泄漏、丢原责任、Archivewriter；VETO-MP-1/5或P0。停审：审计非验收evidence，design-stop/pass，MP-UP-008保留。

## AC-MP-504 受控恢复

思考：恢复authority有限，结果证明不等原full report，恢复不能修外部truth或复活版本。采用原intent/checkpoint/probe及新Bframe；不盲修SQL/补造原Completed。

设计：03U6 RequestMarketRecovery/RunMarketRecovery、RecoveryPolicy；U7RebuildMarketReadProjection从committed facts/完整plan重建。

证据：TC-RECOVERY-006→EV-RECOVERY-006；TC-RECOVERY-005→EV-RECOVERY-005；补TC-REFERENCE-003/004→EV-PG-013/014；report依完整EV-ID在`reports/runs/<run_id>/evidence/`展开。

通过：原probe notcommit且current gate才重试，Unknown保留责任，缺fullreport Reserved等待；重建无第二truth。失败：无probe伪成功/原report重造/删历史/外部反写；VETO-MP-5或P0。停审：恢复/重建权限、结果与原报告边界独立核对design-stop/pass。

## 跨功能门禁审计

| 审计 | 设计结论 | 外部缺口/后续 |
|---|---|---|
| 16业务canonical AC | 逐项来源/正反TC/唯一EV/固定report/条件/裁决齐备 | 不是实际pass |
| 4全局AC | G01→Step6/7/10/11；G02→Step7/8/10；G03→Step8/9；G04→Step7/9 | 不被16业务表或smoke替代 |
| 同EV多门禁 | 同一actual证据可支持多个AC，不能多造EV或重复计TC | 全98孤儿审计等Step10 |
| approval/Confirmed/Complete | 匹配非批准、ACK非结果、Complete非全安装 | formal positive资格不关闭 |
| 字段/状态/错误 | Draft无basis、listing壳无批准、NoticeIntent唯一、command只Confirmed | 03/05无需新schema |
| P1/范围漂移 | 无commerce/安装/运营对象，无旧阈值、无风险降级P0 | 十二开放项保持原状态 |

附录完成16独立设计停审。全部actual TC/EV/report仍planned/not-run；没有用户/owner签署或裁决。
