# Step 7 独立入口验收项

每行独立小循环：风险/取舍→正式surface/字段/flow→通过/失败→主TC/EV/report→AC与裁决→停审。所有行P0/planned/not-run。`停审=design-stop/pass`只设计；出现表内失败条件在actual审查中不通过，触发五VETO按Step11优先。

每行完整输入字段沿[05 contract index](05_test_plan_step_06_contract_index.md)，输出schema/独立flow沿下列同U来源，不能只检表中摘要。report=`reports/runs/<run_id>/evidence/<完整EV-ID>.md`及同run raw/index/主suite report，完整规则[Step5§7](06_acceptance_step_05_function_gate.md#7-结构化中间产物)；I50～53共同证据每行也必选。

## U1 来源责任

先思考：候选不是资格，AI identity非human；采用publisher正式authority、refs-only，拒绝自认证。正式[协议](03_ddd_step_08_part_u1.md)/[flow](03_ddd_step_09_part_u1.md)，运行期SDK/owner接缝。

| GT/AC | 入口/固定surface | 通过条件/特有失败（失败即P0或相关VETO） | 主TC→EV | 独立停审 |
|---|---|---|---|---|
| GT-MP-I01 / AC-MP-101 | BindPublisherRelation / POST /api/marketplace/v1/commands/bind-publisher-relation | principal_candidate/requested_scope正式映射→Bound；AI冒认证/缺authority不得放行 | TC-SOURCE-001→EV-DOMAIN-001；TC-SOURCE-005→EV-DOMAIN-005 | design-stop/pass |
| GT-MP-I02 / AC-MP-103 | ReleasePublisherRelation / POST /api/marketplace/v1/commands/release-publisher-relation | Released+关联核验失效同Tx；陈旧revision拒绝，不能仍current | TC-SOURCE-002→EV-DOMAIN-002 | design-stop/pass |
| GT-MP-I03 / AC-MP-102 | VerifyPublicationSource / POST /api/marketplace/v1/commands/verify-publication-source | source_candidate/material_candidates exactref/version/digest/visibility/kind→正式资格；错配/缺口不Qualified | TC-SOURCE-003→EV-DOMAIN-003；TC-SOURCE-004→EV-DOMAIN-004 | design-stop/pass |
| GT-MP-I04 / AC-MP-103 | GetSourceQualification / POST /api/marketplace/v1/queries/get-source-qualification | 当前typed状态/安全gap、零写；隐藏不带refs，不用Degraded冒Empty | TC-SOURCE-006→EV-DOMAIN-006 | design-stop/pass |

## U2 申请审核

先思考：Draft→freeze→dispatch→formal决定不能合一；采用不可变PublicationBasis与原intent/probe，拒绝ACK本地approval。正式[协议](03_ddd_step_08_part_u2.md)/[flow](03_ddd_step_09_part_u2.md)，Gov/SDK runtime。

| GT/AC | 入口/固定surface | 通过条件/特有失败 | 主TC→EV | 独立停审 |
|---|---|---|---|---|
| GT-MP-I05 / AC-MP-201 | CreatePublicationDraft / POST /api/marketplace/v1/commands/create-publication-draft | draft_spec→Draft/basis_ref=None/review_ref=None；unsafe body拒绝，不预freeze | TC-REVIEW-001→EV-DOMAIN-007 | design-stop/pass |
| GT-MP-I06 / AC-MP-102/201 | RevisePublicationDraft / POST /api/marketplace/v1/commands/revise-publication-draft | 仅Draft按revision修draft_spec；Submitted不得就地换basis | TC-REVIEW-002→EV-DOMAIN-008；TC-REVIEW-004→EV-DOMAIN-010 | design-stop/pass |
| GT-MP-I07 / AC-MP-201 | SubmitPublicationApplication / POST /api/marketplace/v1/commands/submit-publication-application | current Qualified冻结basis/review/work同Tx；失资格零freeze/Submit | TC-REVIEW-003→EV-DOMAIN-009；TC-REVIEW-004→EV-DOMAIN-010 | design-stop/pass |
| GT-MP-I08 / AC-MP-203 | TerminatePublicationApplication / POST /api/marketplace/v1/commands/terminate-publication-application | Terminated保原permission/checkpoint/late责任；不抹Unknown | TC-REVIEW-009→EV-DOMAIN-015 | design-stop/pass |
| GT-MP-I09 / AC-MP-202 | RecordGovernanceDecision / POST /api/marketplace/v1/commands/record-governance-decision | exact decision_candidate绑定，可rejected MatchedDecision不可List；错basis/ACK不批准 | TC-REVIEW-007→EV-DOMAIN-013；TC-REVIEW-008→EV-DOMAIN-014 | design-stop/pass |
| GT-MP-I10 / AC-MP-203 | GetPublicationProgress / POST /api/marketplace/v1/queries/get-publication-progress | typed状态/完整basis/readsurface零写；Submitted缺本体IntegrityFailure非Draft None | TC-REVIEW-010→EV-DOMAIN-016 | design-stop/pass |
| GT-MP-I11 / AC-MP-201/203 | DispatchReviewHandoff / worker-internal dispatch_review_handoff | 原handoff/work许可、A KnownCommitted才effect；Confirmed只WaitingDecision；Aunknown零dispatch | TC-REVIEW-005→EV-DOMAIN-011；TC-REVIEW-006→EV-DOMAIN-012 | design-stop/pass |
| GT-MP-I12 / AC-MP-202/203 | ReconcileReviewHandoff / worker-internal reconcile_review_handoff | 原intent probe、formal fullbinding与完整report；缺probe Blocked/no blind resend | TC-REVIEW-007→EV-DOMAIN-013；TC-REVIEW-006→EV-DOMAIN-012 | design-stop/pass |

## U3 目录版本

先思考：listing壳、Staged、Listed、查询资格各不同；采用local identity/current gate，拒绝SemVer upsert/静态索引授权。正式[协议](03_ddd_step_08_part_u3.md)/[flow](03_ddd_step_09_part_u3.md)，local PG+SDKowner current reads。

| GT/AC | 入口/固定surface | 通过条件/特有失败 | 主TC→EV | 独立停审 |
|---|---|---|---|---|
| GT-MP-I13 / AC-MP-301 | CreateMarketplaceListing / POST /api/marketplace/v1/commands/create-marketplace-listing | publisher/metadata/category目录壳无需decision；不自动version/Listed | TC-CATALOG-001→EV-PG-001 | design-stop/pass |
| GT-MP-I14 / AC-MP-301 | EditMarketplaceListing / POST /api/marketplace/v1/commands/edit-marketplace-listing | CAS改local metadata/category；不能换immutable source字段或盲upsert | TC-CATALOG-002→EV-PG-002 | design-stop/pass |
| GT-MP-I15 / AC-MP-301/G01 | MaintainMarketCategory / POST /api/marketplace/v1/commands/maintain-market-category | intent Create/Change完整typedvariant；parent环/跨scope/重复UK安全拒绝 | TC-CATALOG-003→EV-PG-003 | design-stop/pass |
| GT-MP-I16 / AC-MP-201/303 | RegisterMarketVersion / POST /api/marketplace/v1/commands/register-market-version | exact Submitted basis→Staged；重复sourceidentity不SemVer upsert | TC-CATALOG-004→EV-PG-004 | design-stop/pass |
| GT-MP-I17 / AC-MP-201/202 | ListMarketVersion / POST /api/marketplace/v1/commands/list-market-version | current formal approved/fullgate→Listed；缺决定/失效/Withdrawn不放行 | TC-CATALOG-005→EV-PG-005；TC-CATALOG-006→EV-PG-006 | design-stop/pass |
| GT-MP-I18 / AC-MP-301/302 | SearchMarketplaceCatalog / POST /api/marketplace/v1/queries/search-marketplace-catalog | filter/EN-ZH/literal参数化与currentfilter/count/token一致；不泄漏/改SQL语义 | TC-CATALOG-007→EV-PG-007；TC-CROSS-004→EV-PG-018 | design-stop/pass |
| GT-MP-I19 / AC-MP-302/303 | GetMarketplaceListing / POST /api/marketplace/v1/queries/get-marketplace-listing | 当前可见/pairedbody/history分页；隐藏不旧snapshot泄漏，不假Fresh | TC-CATALOG-008→EV-PG-008；TC-CATALOG-010→EV-PG-010 | design-stop/pass |
| GT-MP-I20 / AC-MP-302/303 | ListMarketVersions / POST /api/marketplace/v1/queries/list-market-versions | listing_ref/parent/selector/upper/after全绑定；换scope/filter token拒绝 | TC-CATALOG-010→EV-PG-010；TC-CROSS-017→EV-PG-021 | design-stop/pass |
| GT-MP-I21 / AC-MP-303 | SelectMarketVersion / POST /api/marketplace/v1/queries/select-market-version | exactversion/真实eligible gap；不换latest/不建intent | TC-CATALOG-009→EV-PG-009 | design-stop/pass |
| GT-MP-I22 / AC-MP-302/303 | ListMarketCategories / POST /api/marketplace/v1/queries/list-market-categories | filter/currentparent/分页一致，hidden不count；不自行刷新 | TC-CATALOG-010→EV-PG-010；TC-CROSS-017→EV-PG-021 | design-stop/pass |

## U4 分发

先思考：receiver intent/attempt/version/consumer/scope要同源，取消不remote rollback。采用原permission/actualoutcome/probe；不把ACK当installed/paid。正式[协议](03_ddd_step_08_part_u4.md)/[flow](03_ddd_step_09_part_u4.md)，Receiver/SDK runtime。

| GT/AC | 入口/固定surface | 通过条件/特有失败 | 主TC→EV | 独立停审 |
|---|---|---|---|---|
| GT-MP-I23 / AC-MP-401 | RequestDistribution / POST /api/marketplace/v1/commands/request-distribution | target exact版本/consumer/receiver/scope且currentfullgate→local责任；失效/撤回不得新intent | TC-DISTRIBUTION-002→EV-WORKER-002；TC-DISTRIBUTION-009→EV-WORKER-009 | design-stop/pass |
| GT-MP-I24 / AC-MP-403 | CancelDistribution / POST /api/marketplace/v1/commands/cancel-distribution | Cancelled保真实lateConfirmed及impact责任；不删历史或强回滚远端 | TC-DISTRIBUTION-007→EV-WORKER-007 | design-stop/pass |
| GT-MP-I25 / AC-MP-402 | RecordReceiverOutcome / POST /api/marketplace/v1/commands/record-receiver-outcome | outcome_candidate仅formalConfirmed exact绑定；negative/Unknown/ACK不得command attach | TC-DISTRIBUTION-008→EV-WORKER-008 | design-stop/pass |
| GT-MP-I26 / AC-MP-401 | GetAcquisitionEligibility / POST /api/marketplace/v1/queries/get-acquisition-eligibility | currenttyped gate/eligible/gap零写，staleUI/cache不授权 | TC-DISTRIBUTION-001→EV-WORKER-001 | design-stop/pass |
| GT-MP-I27 / AC-MP-402/403 | GetDistributionProgress / POST /api/marketplace/v1/queries/get-distribution-progress | typedattempts/分页/current；CommitUnknown不可吞Failed/成功 | TC-DISTRIBUTION-010→EV-WORKER-010；TC-CROSS-017→EV-PG-021 | design-stop/pass |
| GT-MP-I28 / AC-MP-402/403 | DispatchDistribution / worker-internal dispatch_distribution | 原许可AKnownCommitted→exacteffect/Bfullreport；commit未知保原责任无盲重发 | TC-DISTRIBUTION-005→EV-WORKER-005；TC-DISTRIBUTION-006→EV-WORKER-006 | design-stop/pass |
| GT-MP-I29 / AC-MP-403/504 | ReconcileDistribution / worker-internal reconcile_distribution | 原intentprobe、formalnotcommit+currentgate才新attempt；late/cancel并存续责 | TC-DISTRIBUTION-010→EV-WORKER-010；TC-DISTRIBUTION-007→EV-WORKER-007 | design-stop/pass |

## U5 撤回通知

先思考：停新获取、knownimpact与notice结果分轴，late回Partial。采用正式authority/固定upper/orderedtargets/原probe；拒绝通知成功前置撤回或全安装承诺。正式[协议](03_ddd_step_08_part_u5.md)/[flow](03_ddd_step_09_part_u5.md)，local PG+Notice/SDK runtime。

| GT/AC | 入口/固定surface | 通过条件/特有失败 | 主TC→EV | 独立停审 |
|---|---|---|---|---|
| GT-MP-I30 / AC-MP-501 | RestrictMarketVersion / POST /api/marketplace/v1/commands/restrict-market-version | authority/CAS→Restricted+disposition/Partial/work；无依据不得造处置 | TC-WITHDRAWAL-001→EV-DOMAIN-017；TC-WITHDRAWAL-003→EV-DOMAIN-019 | design-stop/pass |
| GT-MP-I31 / AC-MP-501 | WithdrawMarketVersion / POST /api/marketplace/v1/commands/withdraw-market-version | Withdrawn终态/停新admission，通知故障不复活；缺authority安全拒绝 | TC-WITHDRAWAL-002→EV-DOMAIN-018；TC-WITHDRAWAL-003→EV-DOMAIN-019 | design-stop/pass |
| GT-MP-I32 / AC-MP-502 | PlanImpactNotifications / POST /api/marketplace/v1/commands/plan-impact-notifications | targets保序且每正式target/channel唯一NoticeIntent；duplicate拒绝不截断 | TC-WITHDRAWAL-006→EV-DOMAIN-022 | design-stop/pass |
| GT-MP-I33 / AC-MP-502 | RecordNoticeOutcome / POST /api/marketplace/v1/commands/record-notice-outcome | formalConfirmed exactnotice/target/channel/scope；negative/Unknown/ACK不attach | TC-WITHDRAWAL-009→EV-DOMAIN-025 | design-stop/pass |
| GT-MP-I34 / AC-MP-502/302 | GetWithdrawalImpact / POST /api/marketplace/v1/queries/get-withdrawal-impact | knowncoverage/unknownattempts与notice分页current；不造全安装覆盖/泄漏count | TC-WITHDRAWAL-010→EV-DOMAIN-026；TC-CROSS-017→EV-PG-021 | design-stop/pass |
| GT-MP-I35 / AC-MP-502 | GetNoticeProgress / POST /api/marketplace/v1/queries/get-notice-progress | exactstate/outcomebinding/gap零dispatch，不假送达/已读 | TC-WITHDRAWAL-010→EV-DOMAIN-026 | design-stop/pass |
| GT-MP-I36 / AC-MP-502/G03 | EnumerateKnownImpact / worker-internal enumerate_known_impact | fixedupper as-of Relation+Attempt typedPK全一次；late delta回Partial/续责 | TC-WITHDRAWAL-004→EV-DOMAIN-020；TC-WITHDRAWAL-005→EV-DOMAIN-021 | design-stop/pass |
| GT-MP-I37 / AC-MP-502/504 | DispatchNotice / worker-internal dispatch_notice | NoticeIntent原permission、formalConfirmed/notcommit/Unknown独立；B失败保A | TC-WITHDRAWAL-007→EV-DOMAIN-023；TC-WITHDRAWAL-008→EV-DOMAIN-024 | design-stop/pass |
| GT-MP-I38 / AC-MP-502/504 | ReconcileNotice / worker-internal reconcile_notice | 原intentprobe/fence/fullreport，缺probe Blocked不重发，不冒Confirmed | TC-WITHDRAWAL-008→EV-DOMAIN-024；TC-WITHDRAWAL-009→EV-DOMAIN-025 | design-stop/pass |

## U6 审计恢复

先思考：恢复仅有限targets，原auditset不是当前jobset，originalresult不能重造。采用current整条披露/原checkpoint/probe/新B；拒绝任意SQL、Obs递归或Archivewriter。正式[协议](03_ddd_step_08_part_u6.md)/[flow](03_ddd_step_09_part_u6.md)，Obs/SDK runtime与local存储。

| GT/AC | 入口/固定surface | 通过条件/特有失败 | 主TC→EV | 独立停审 |
|---|---|---|---|---|
| GT-MP-I39 / AC-MP-504 | RequestMarketRecovery / POST /api/marketplace/v1/commands/request-market-recovery | finite target_ref/current RecoveryAuthority→Requested/work；Recovery递归/ownertruth越权拒绝 | TC-RECOVERY-003→EV-RECOVERY-003；TC-RECOVERY-004→EV-RECOVERY-004 | design-stop/pass |
| GT-MP-I40 / AC-MP-503/302 | GetMarketAudit / POST /api/marketplace/v1/queries/get-market-audit | 原safe六字段/current subject/page，0audit写；不暴露bodysecret/evidence正文 | TC-RECOVERY-007→EV-RECOVERY-007；TC-CROSS-017→EV-PG-021 | design-stop/pass |
| GT-MP-I41 / AC-MP-504 | GetRecoveryProgress / POST /api/marketplace/v1/queries/get-recovery-progress | actualRequested/Running/Completed/Blocked、Missing/NotVisible零写；Completed非ready | TC-RECOVERY-011→EV-RECOVERY-011 | design-stop/pass |
| GT-MP-I42 / AC-MP-G02/504 | GetOperationResult / POST /api/marketplace/v1/queries/get-operation-result | 所有payload当前允许才完整原variant/result，否则整体拒绝；缺本体不补造 | TC-RECOVERY-001→EV-RECOVERY-001；TC-RECOVERY-005→EV-RECOVERY-005 | design-stop/pass |
| GT-MP-I43 / AC-MP-504/G02 | RunMarketRecovery / worker-internal run_market_recovery | 原formalinspection/checkpoint/report，新Bload/CAS/frame；fullreport不足旧Reserved，Recovery只P无O | TC-RECOVERY-005→EV-RECOVERY-005；TC-RECOVERY-006→EV-RECOVERY-006 | design-stop/pass |
| GT-MP-I44 / AC-MP-503 | DispatchObservation / worker-internal dispatch_observation | 原operation/frozenauditset/permission，资格缺Blocked保责任；receipt非evidence | TC-RECOVERY-008→EV-RECOVERY-008 | design-stop/pass |
| GT-MP-I45 / AC-MP-503/504 | ReconcileObservation / worker-internal reconcile_observation | 原plan auditset/probe exact，错集拒绝、缺probe等待、0O/P递归 | TC-RECOVERY-009→EV-RECOVERY-009 | design-stop/pass |

## U7 引用读取

先思考：Fresh与Qualified需要completepairedbody，旧projection不source truth。采用committedfacts/fullplan/四kind依赖；不查时refresh/partialmanifest发布。正式[协议](03_ddd_step_08_part_u7.md)/[flow](03_ddd_step_09_part_u7.md)，Source/Scope/SDK runtime+local PG。

| GT/AC | 入口/固定surface | 通过条件/特有失败 | 主TC→EV | 独立停审 |
|---|---|---|---|---|
| GT-MP-I46 / AC-MP-103/303 | GetReferenceFreshness / POST /api/marketplace/v1/queries/get-reference-freshness | actualsnapshot state/current visibility，旧safe_material不越披露、0refresh | TC-REFERENCE-006→EV-PG-016；TC-REFERENCE-002→EV-PG-012 | design-stop/pass |
| GT-MP-I47 / AC-MP-303/G02 | GetProjectionFreshness / POST /api/marketplace/v1/queries/get-projection-freshness | complete manifest/body对应；缺pair IntegrityFailure/no rebuild，不假Fresh | TC-REFERENCE-006→EV-PG-016 | design-stop/pass |
| GT-MP-I48 / AC-MP-103/504 | RefreshQualifiedReferences / worker-internal refresh_qualified_references | state/safe_material/validity/sourceidentity同Tx；失效Stale/Unavailable不复活version | TC-REFERENCE-001→EV-PG-011；TC-REFERENCE-002→EV-PG-012 | design-stop/pass |
| GT-MP-I49 / AC-MP-303/504 | RebuildMarketReadProjection / worker-internal rebuild_market_read_projection | everyrequiredkey一次Rendered/Omitted/complete manifest/body/Fresh同Tx；empty/duplicate/missing不得Fresh，0O/P | TC-REFERENCE-003→EV-PG-013；TC-REFERENCE-004→EV-PG-014 | design-stop/pass |

## 跨入口审计

49surface各自主TC/EV、full字段来源、独立flow、route/internal与AC绑定齐备；21C/16Q/12J、37HTTP/12internal、0Event均与03同集合。每行都附加I50/51/52/53共同库存/错误/依赖门禁，不仅检代表字段；所有TC还须05定义的全部required负例/故障子例。

原name不带Approval/Install/Payment/NoticeAttempt；receiver/notice command仅formalConfirmed；Degraded200不是ready；无publicJob/DLQ/topic。qualified owner缺失继续阻formal-positive，不要求相邻仓全实现、不在Marketplacefake补接口。报告展开不是跨run合并，全部not-run。
