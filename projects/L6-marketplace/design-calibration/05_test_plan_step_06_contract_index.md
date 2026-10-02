# Step 6 规范性附录：49入口字段与失败断言索引

## 权威来源与使用规则

本索引属于[Step6](05_test_plan_step_06_cases.md)；不是第16主Step。每行Request字段与03同名schema一致，actor/key/trace/page/consistency取Core envelope，Job work/fence取正式context。输出字段完整集合从同U Step8读取，不在此复制第二套schema；TC必须逐字段比对该返回，并验证同U Step9 flow/Step10状态。

所有行有公共输入变异：删除required、unknown/tag/wrongkind→InvalidInput；越scope/actor→03 current披露安全拒绝；C/J缺key→MissingIdempotencyKey；同key异canonical→IdempotencyConflict；缺被引用完整stored record→IntegrityFailure。Q不要求key，不构造不存在的分页。以下特有反例使用确定错误/状态，不能将“任一非200”视为成功。

数据、suite、EV沿所列TC主表与Step5双射；CROSS-011/014/018分别额外覆盖所有codec/ports/37HTTP。不新增第50入口。完整来源：

- U1：[协议](03_ddd_step_08_part_u1.md)、[flow](03_ddd_step_09_part_u1.md)、[状态](03_ddd_step_10_part_u1.md)。
- U2：[协议](03_ddd_step_08_part_u2.md)、[flow](03_ddd_step_09_part_u2.md)、[状态](03_ddd_step_10_part_u2.md)。
- U3：[协议](03_ddd_step_08_part_u3.md)、[flow](03_ddd_step_09_part_u3.md)、[状态](03_ddd_step_10_part_u3.md)。
- U4：[协议](03_ddd_step_08_part_u4.md)、[flow](03_ddd_step_09_part_u4.md)、[状态](03_ddd_step_10_part_u4.md)。
- U5：[协议](03_ddd_step_08_part_u5.md)、[flow](03_ddd_step_09_part_u5.md)、[状态](03_ddd_step_10_part_u5.md)。
- U6：[协议](03_ddd_step_08_part_u6.md)、[flow](03_ddd_step_09_part_u6.md)、[状态](03_ddd_step_10_part_u6.md)。
- U7：[协议](03_ddd_step_08_part_u7.md)、[flow](03_ddd_step_09_part_u7.md)、[状态](03_ddd_step_10_part_u7.md)。

TC单元格省略固定`TC-`；入口完整Request类型为入口名+`Request`。

## U1 来源责任（4）

| 入口/类别 | Request业务字段（完整） | 主要TC | 特有反例/断言 |
|---|---|---|---|
| BindPublisherRelation C | principal_candidate, requested_scope | SOURCE-001、SOURCE-005 | AI identity不能human publisher；缺资格ContractBlocked |
| ReleasePublisherRelation C | relation_ref, expected_revision, verification_refs, reason_ref | SOURCE-002 | 陈旧revision VersionConflict；Released不再current |
| VerifyPublicationSource C | source_candidate, publisher_ref, material_candidates | SOURCE-003、SOURCE-004 | immutable binding错配BindingMismatch；缺正式qualification不Qualified |
| GetSourceQualification Q | verification_ref | SOURCE-006 | 隐藏NotVisible无refs，源不可用Degraded非Empty |

## U2 申请审核（8）

| 入口/类别 | Request业务字段（完整） | 主要TC | 特有反例/断言 |
|---|---|---|---|
| CreatePublicationDraft C | draft_spec | REVIEW-001 | Draft无basis/review；unsafe body拒绝 |
| RevisePublicationDraft C | application_ref, expected_revision, draft_spec | REVIEW-002、REVIEW-004 | Submitted→revise IllegalTransition；无新basis |
| SubmitPublicationApplication C | application_ref, expected_revision | REVIEW-003、REVIEW-004 | publisher/source失资格不得freeze/Submit |
| TerminatePublicationApplication C | application_ref, expected_revision, reason_ref | REVIEW-009 | Terminated但旧permission/unknown责任不删 |
| RecordGovernanceDecision C | handoff_ref, decision_candidate | REVIEW-007、REVIEW-008 | matched rejected可保存，但List CurrentGateDenied；错basis BindingMismatch |
| GetPublicationProgress Q | application_ref | REVIEW-010 | Submitted指向缺basis IntegrityFailure；Draft None合法 |
| DispatchReviewHandoff J | handoff_ref, work_ref | REVIEW-005、REVIEW-006 | A unknown零dispatch，正式Confirmed只WaitingDecision |
| ReconcileReviewHandoff J | handoff_ref, work_ref | REVIEW-007、REVIEW-006 | 原intent probe；缺probe Blocked责任、不盲重发 |

## U3 目录版本（10）

| 入口/类别 | Request业务字段（完整） | 主要TC | 特有反例/断言 |
|---|---|---|---|
| CreateMarketplaceListing C | publisher_ref, metadata, category_refs | CATALOG-001 | 目录壳无Gov前置；不自动Listed |
| EditMarketplaceListing C | listing_ref, expected_revision, metadata, category_refs | CATALOG-002 | CAS错VersionConflict；不得就地换immutable source |
| MaintainMarketCategory C | intent | CATALOG-003 | 显式Create/Change完整variant；parent环InvalidInput |
| RegisterMarketVersion C | listing_ref, application_ref | CATALOG-004 | exact Submitted basis→Staged；业务UK映VersionConflict |
| ListMarketVersion C | version_ref, expected_revision | CATALOG-005、CATALOG-006 | current Approved才Listed；Withdrawn IllegalTransition |
| SearchMarketplaceCatalog Q | filter | CATALOG-007、CROSS-004 | literal与filter同count/items/token，hidden不泄漏 |
| GetMarketplaceListing Q | listing_ref | CATALOG-008、CATALOG-010 | 当前owner不可见不得旧snapshot body；paged history同selector |
| ListMarketVersions Q | listing_ref | CATALOG-010、CROSS-017 | parent/scope/filter token替换InvalidInput |
| SelectMarketVersion Q | version_ref | CATALOG-009 | exact version不换latest/no intent |
| ListMarketCategories Q | filter | CATALOG-010、CROSS-017 | parent不可见不泄漏count；分页currentfilter |

## U4 分发（7）

| 入口/类别 | Request业务字段（完整） | 主要TC | 特有反例/断言 |
|---|---|---|---|
| RequestDistribution C | target | DISTRIBUTION-002、DISTRIBUTION-009 | exact source/version/consumer/receiver/scope；current denied无intent |
| CancelDistribution C | intent_ref, expected_revision, reason_ref | DISTRIBUTION-007 | Cancelled与真实Confirmed可共存；不remote rollback |
| RecordReceiverOutcome C | attempt_ref, outcome_candidate | DISTRIBUTION-008 | probe匹配Confirmed才attach；negative/Unknown走Job |
| GetAcquisitionEligibility Q | target | DISTRIBUTION-001 | stale UI/cache不授权；只读current gate |
| GetDistributionProgress Q | intent_ref | DISTRIBUTION-010、CROSS-017 | attempts分页，CommitUnknown不能吞成Failed |
| DispatchDistribution J | attempt_ref, work_ref | DISTRIBUTION-005、DISTRIBUTION-006 | 原permission、A/B、CommitUnknown职责 |
| ReconcileDistribution J | attempt_ref, work_ref | DISTRIBUTION-010、DISTRIBUTION-007 | original intent probe；新attempt需formal notcommit/currentgate |

## U5 撤回通知（9）

| 入口/类别 | Request业务字段（完整） | 主要TC | 特有反例/断言 |
|---|---|---|---|
| RestrictMarketVersion C | version_ref, expected_revision, reason_ref | WITHDRAWAL-001、WITHDRAWAL-003 | no authority不建disposition；Restricted停新admission |
| WithdrawMarketVersion C | version_ref, expected_revision, reason_ref | WITHDRAWAL-002、WITHDRAWAL-003 | Withdrawn terminal；notice失败不复活 |
| PlanImpactNotifications C | impact_ref, targets | WITHDRAWAL-006 | targets保序、duplicate拒绝不截断 |
| RecordNoticeOutcome C | notice_ref, outcome_candidate | WITHDRAWAL-009 | formal Confirmed exacttarget/channel，ACK不delivered |
| GetWithdrawalImpact Q | disposition_ref | WITHDRAWAL-010、CROSS-017 | notice分页过滤，saved relation/unknown sets不是新关系分页 |
| GetNoticeProgress Q | notice_ref | WITHDRAWAL-010 | CommitUnknown/gap独立，0dispatch |
| EnumerateKnownImpact J | disposition_ref, work_ref | WITHDRAWAL-004、WITHDRAWAL-005 | fixedupper as-of union一次；late delta回Partial |
| DispatchNotice J | notice_ref, work_ref | WITHDRAWAL-007、WITHDRAWAL-008 | NoticeIntent，不存在NoticeAttempt；B失败保留A |
| ReconcileNotice J | notice_ref, work_ref | WITHDRAWAL-008、WITHDRAWAL-009 | no probe waiting、old fence不得覆盖 |

## U6 审计恢复（7）

| 入口/类别 | Request业务字段（完整） | 主要TC | 特有反例/断言 |
|---|---|---|---|
| RequestMarketRecovery C | target_ref | RECOVERY-003、RECOVERY-004 | Recovery variant Unsupported；正式authority有限target |
| GetMarketAudit Q | subject_ref | RECOVERY-007、CROSS-017 | safe六字段、current scope/audit分页，zero audit |
| GetRecoveryProgress Q | recovery_ref | RECOVERY-011 | 实际Requested/Running/Completed/Blocked，no readiness |
| GetOperationResult Q | operation_ref | RECOVERY-001、RECOVERY-005 | 完整原variant/result/checkpoint；missing IntegrityFailure |
| RunMarketRecovery J | recovery_ref, work_ref | RECOVERY-005、RECOVERY-006 | B新reload/CAS/frame；原report不足保持Reserved；只P无O |
| DispatchObservation J | audit_refs, work_ref | RECOVERY-008 | 原operation/frozen auditset、资格不足Blocked/noeffect |
| ReconcileObservation J | work_ref | RECOVERY-009 | original auditset从plan，不换成当前Job audit；无O/P递归 |

## U7 引用读取（4）

| 入口/类别 | Request业务字段（完整） | 主要TC | 特有反例/断言 |
|---|---|---|---|
| GetReferenceFreshness Q | snapshot_ref | REFERENCE-006、REFERENCE-002 | 实际snapshot state，current invisible不旧safe_material |
| GetProjectionFreshness Q | projection_ref | REFERENCE-006 | manifest/body成对，缺pair IntegrityFailure/no rebuild |
| RefreshQualifiedReferences J | snapshot_refs, work_ref | REFERENCE-001、REFERENCE-002 | state/material/validity同Tx，不复活version |
| RebuildMarketReadProjection J | projection_ref, work_ref, plan | REFERENCE-003、REFERENCE-004 | complete Rendered/Omitted manifest；empty required拒绝/noO/P |

## 库存闭包与参数化展开

| 库存 | 用例与枚举来源 | runner完成条件（未来） |
|---|---|---|
| 49入口=21C/16Q/12J | 本表与03 Step8/9同名集；CROSS-011/014/018 | 每Request叶字段/结果叶字段、缺失/unknown、flow fault均有subcase；count集合相等 |
| 43主要对象 | Step3§7.1及03 Step6七U；CROSS-012 | 每factory/member/public rehydrate/condition字段至少一valid/invalid；support types随codec可达闭包 |
| 14carrier/222pair/73A | 03 Step10七U完整矩阵；CROSS-013 | 逐From/To不重复，A/S/R集相等；A每guard true/false，S不可偷渡retry，R拒绝零写 |
| 17ports/146methods | 03 Step7 typed_ports逐trait；CROSS-014 | 逐method签名、调用方、result/error/Tx同一conformance表；native async generic无私补方法 |
| 33canonical C/J DTO | 03 Step13§7.3；CROSS-001/002 | 递归全部business字段、actor/delegate/scope、无Query/任意Serialize |
| 七paged caller/method | 03 Step13§7.6、Step7/9；CROSS-017 | Search/GetListing/ListVersions/ListCategories/DistributionProgress/WithdrawalImpact/MarketAudit全覆盖；合法位置族一致 |
| O/P production | 03 Step15逐入口；CROSS-015/REFERENCE-005/RECOVERY-008/009 | 21C+8J O及无递归；不能只看任一一个producer |

所有dataset为合成fixture，所有digest/scan/approval/receiver素材仅typed controlled branch，不是已存在owner证据。本附录设计静态检索库存，实际参数化测试与adapter编译均not-run。
