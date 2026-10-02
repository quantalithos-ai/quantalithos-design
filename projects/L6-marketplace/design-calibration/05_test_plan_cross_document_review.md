# 05跨文档可落码闭环审查

对应中间产物规范§5.10；本记录仅05设计/文档静态审查，06/07尚未启动，不能提供实际运行或implementation boundary通过结论。完整字段/type/函数/矩阵读取所列03规范性附录；05不复制第二套业务schema。

## 1. 真相源表

| 事实 | source | 05消费者 | 冲突处理 |
|---|---|---|---|
| 五能力/104需求/20AC/5VETO | 正式00§7～16 | Step2/5/10/12/14 | 未覆盖positive保留风险，不扩大范围 |
| Rust API/Worker+Vue/TS Web、Core/SDK compile | 正式01/02/03 | Step3/8/9 | draft/原型不覆盖，MP-SRC-003仍pending |
| 43对象/49协议/17ports/14carrier | 正式03§5～9与Step6～10附录 | Step6/入口索引/参数化库存 | 字段/状态/error以03为准，发现缺口回源 |
| frame/CAS/as-of/原result/canonical/page | 正式03§10～12/Step11～13 | Step6/7/10 | fake证明上限不等PG实际 |
| refs-only audit/O生产/no递归 | 正式03§14/Step15 | Step6/10/13 | local audit≠receipt≠evidence |
| 六域/七字段/八slot/四profile | 正式04 | Step6/8/9 | 非法/duplicate拒绝，缺资格不Bound |
| test schema/TC/EV/paths | 本轮Step5/6/9/13 | 正式05→未来06/07 | 仅测试管理，不进入domain或伪真实证据 |

## 2. 字段闭环表

下表列风险代表；43对象全部field/condition/Row由CROSS-012参数化闭包，49Request全字段已入口索引逐行静态核对，与正式03无差集。公共result/report/view/nested全部schema由CROSS-011；不是只测代表字段。

| 对象/字段 | 类型/source/构造 | DTO/flow | 缺失/错配 | TC/EV/AC |
|---|---|---|---|---|
| PublicationApplication.draft_spec/basis_ref/review_ref | DraftPublicationSpec/Option typed refs；draft caller vs Submit formal QualifiedPublicationInput | Create/Revise/Submit U2；PublicationBasis::freeze仅Submit | Draft None合法；Submitted ref缺本体IntegrityFailure；Submitted revise IllegalTransition | REVIEW-001～004 / DOMAIN-007～010 / AC-MP-201/202 |
| MarketplaceListing.metadata/category_refs/revision | MarketListingMetadata/CategoryRefSet/MarketRevision；caller candidates+currentpublisher，save readback | Create/Edit U3 | unsafe body拒绝、CAS VersionConflict、无decision前置于shell | CATALOG-001/002 / PG-001/002 / AC-MP-201/G02 |
| MarketVersion.source/basis/state | 完整immutable owner/basis来源，03对象卡唯一类型 | Register Staged，List current approved | wrongbinding/terminal/current gate拒绝 | CATALOG-004～006 / PG-004～006 / AC-MP-201/202/203 |
| DistributionAttempt原intent/receiver binding/fence | U4对象与typed正式ReceiverPort outcome/原permission | Dispatch/Reconcile/RecordReceiverOutcome | command仅Confirmed；wrongbinding/fence拒绝、timeout CommitUnknown | DISTRIBUTION-005～010 / WORKER-005～010 / AC-MP-402/403 |
| ImpactRecord fixedupper/coverage+NoticeIntent.state | ReadWindow/local facts；ImpactCoverageKind/NoticeIntentState | Enumerate/Plan/Dispatch/Reconcile | incomplete Partial、late新cursor回Partial；ACK非送达 | WITHDRAWAL-004～009 / DOMAIN-020～025 / AC-MP-502 |
| MarketAuditRecord六字段 | audit_ref/subject_ref/operation_ref/actor_ref/basis_refs/cursor；trustedCore+localcommittedfacts | accepted sameTx与GetMarketAudit | no raw context/body/credential，current disclosure | RECOVERY-007/CROSS-015 / RECOVERY-007/PG-019 / AC-MP-503/G02 |
| StoredOperationResult/JobCheckpoint完整payload | 03 U6/runtime/ports原request/kind/schema/report/permission | Runner.finish/finish_original/原replay | 缺fullreport IntegrityFailure/Reserved waiting，不currentview补 | RECOVERY-001/005/006 / RECOVERY-001/005/006 / AC-MP-504/G02 |
| QualifiedReferenceSnapshot safe_material/validity与ReadProjection manifest/body | ownerqualified slice/typedplan+localasof，03 U7 | Refresh/Rebuild与freshness Q | state/body成对，missing/duplicate不Fresh | REFERENCE-001～006 / PG-011～016 / AC-MP-303/504 |

## 3. DTO/Event/Job到对象构造闭环

| 输入 | 目标/构造source | 必填/派生完整性 | 禁止替代/失败 | 流与TC |
|---|---|---|---|---|
| 21C完整Request | 03七U factory/member，caller候选+formalport+load+reservedIDs | 入口索引完整fields，nested/schema取03 | body自证approved/verified拒绝；samekey原replay不再次factory | Step9七U；全部业务TC+CROSS-011/014/015 |
| 16Q完整Request+Core envelope | ReadFacade/current scope、PageReadContext七caller | actor/delegate固定、safe source constraints/parent/selector | ref字符串解析scope/私补actor禁止；所有writer为0 | Q业务TC+CROSS-005/017/018 |
| 12内部Job Request/context | 原work/plan/fence/checkpoint/permission，A/B fresh loads | body.work_ref=context.fence.work_ref，原全部request/IDs/report | blindretry/lease当notcommit禁止；no-probe blocked/waiting | Job业务TC+CROSS-019/RECOVERY-005/006 |
| 0active Event | 当前没有domain构造输入 | 不适用 | 不造event/outbox/payload/replay positive | CROSS-020 |

## 4. 状态闭环表

每行迁移产生方法/完整A/S/R以03 Step10该U和Step6对象卡为唯一source；CROSS-013穷尽全部222pairs/73A、guard true/false、S限制、R零变更，不将enum list当测试覆盖。

| enum / U | 正式状态全集 | 风险断言/主要TC | EV/AC |
|---|---|---|---|
| PublisherRelationState U1 | Bound,Released | SOURCE-001/002，Released不可current | DOMAIN-001/002；AC-MP-101/103 |
| SourceVerificationState U1 | Pending,Qualified,Blocked,Invalidated | SOURCE-003/004，不缺材料Qualified | DOMAIN-003/004；AC-MP-101/102 |
| PublicationApplicationState U2 | Draft,Submitted,Terminated | REVIEW-001～004/009，Draft None、Submit freeze/终止 | DOMAIN-007～010/015；AC-MP-201～203 |
| ReviewHandoffState U2 | PendingDispatch,WaitingDecision,MatchedDecision,CommitUnknown,ContractBlocked,Failed | REVIEW-005～008，Matched rejected非批准 | DOMAIN-011～014；AC-MP-202/203 |
| MarketVersionState U3 | Staged,Listed,Restricted,Withdrawn | CATALOG-004～006、WITHDRAWAL-002，Withdrawn terminal | PG-004～006/DOMAIN-018；AC-MP-201/501 |
| DistributionIntentState U4 | Accepted,Cancelled | DISTRIBUTION-002/007，Cancel不删attempt | WORKER-002/007；AC-MP-401/403 |
| DistributionAttemptState U4 | Prepared,Dispatching,Confirmed,Failed,CommitUnknown,Blocked | DISTRIBUTION-005～010，timeout/no-probe | WORKER-005～010；AC-MP-402/403 |
| ImpactCoverageKind U5 | Partial,KnownScopeComplete | WITHDRAWAL-004/005，upper后late→Partial | DOMAIN-020/021；AC-MP-502 |
| NoticeIntentState U5 | Prepared,Dispatching,Confirmed,Failed,CommitUnknown,Blocked | WITHDRAWAL-007～009，no NoticeAttempt/delivered | DOMAIN-023～025；AC-MP-502 |
| OperationRecordState U6 | Reserved,Completed | RECOVERY-001/005，缺原fullreport不Completed | RECOVERY-001/005；AC-MP-G02/504 |
| DeferredWorkState U6 | Pending,Claimed,Settled,Blocked | CROSS-019，expiredclaim仅probe/newfence | WORKER-021；AC-MP-504/G03 |
| RecoveryIntentState U6 | Requested,Running,Completed,Blocked | RECOVERY-003～006/011，finite/no递归 | RECOVERY-003～006/011；AC-MP-504 |
| ReferenceSnapshotState U7 | Qualified,Stale,Unavailable | REFERENCE-001/002/006，当前披露排旧材料 | PG-011/012/016；AC-MP-303 |
| ReadProjectionState U7 | Fresh,Stale,Rebuilding,Unavailable | REFERENCE-003～006，完整payload/manifest | PG-013～016；AC-MP-303/504 |

## 5. Query response/view闭环

| Query集合 | 完整view/schema source | 字段/visibility/page/ID规则 | TC |
|---|---|---|---|
| U1 qualification/U2 progress | Step8 U1/U2、Step9 current typed读取 | Draft无basis正常，Submitted缺本体IntegrityFailure；Source不可用Degraded | SOURCE-006/REVIEW-010 |
| U3五Q | Step8 U3 read item/selected view、U7 projection | exact版本不换latest；safe metadata；Search/GetListing/ListVersions/ListCategories七paged中的四者 | CATALOG-007～010/CROSS-017 |
| U4两Q/U5两Q | Step8 U4/5 actual intent/attempt/impact/notice views | 局部与external分轴；attempt页/notice页同currentfilter，saved relation sets安全 | DISTRIBUTION-001/010/WITHDRAWAL-010 |
| U6三Q/U7两Q | Step8 U6/7 full result/audit/recovery/freshness | 全原payload或整体拒绝；safe六字段；freshness不refresh；audit页用Audit typed position | RECOVERY-001/007/011/REFERENCE-006 |
| 全16Q/原33replay | Step9/13完整全字段传递 | 不产生ID/Clock/context/audit/work/O/P/effect，整体NotVisible无refs/count/token；Ready/Empty/Missing/Degraded来源正式 | CROSS-005/011/017/018 |

## 6. Phase/commit boundary闭环

| 层/阶段 | 包含/前置 | 排除后续truth | 测试/验收范围 |
|---|---|---|---|
| 本轮05设计 | 15Step/15章、TC/EV/DS/suite/schema计划 | 代码/implcommit/run/资产包/digest/scan/payment/evidence/verdict | 仅文档静态自检，06等待用户确认 |
| future local测试 | 实际实现+test资源+gate/report工具 | formal owner qualification/签核 | same-run local scope；真实资格另blocked |
| script capability/index shell/final EV/draft | 四层分别前置/有界产物，正式07安排 | shell不final，draft不verdict | Step13/未来06/07直接承接 |
| formal07 boundary | 全部03/05/06/07确认后设计审计 | 本轮不分配伪commit/run结果 | implementation ledger/skeleton只planned/blocked/waiting |

## 7. Public protocol传递类型闭环

| surface | 字段族/source ownership | duplicate/retry/missing及依赖 | TC |
|---|---|---|---|
| Command result/receipt | 03 Step8各U result、shared/runtime；typed refs/state/revision/work refs | 同Tx fullresult，current披露→原完整replay；contracts不依domain | CROSS-011/014/015及21C |
| Query view/Page/ReadSurface | 03 Step8 shared+七U，Core page/type，U7 safe slice | 同current谓词、missing/notvisible/degraded正式来源，no writer | CROSS-005/011/017/018及16Q |
| Job report/item/successor/checkpoint | 03 Step8/9/ports完整types，Core Worker context | 原IDs/request/permissions完整，B新帧，original report不能currentview重造 | CROSS-011/014/019及12J |
| test artifact JSON | Step13 v1 strict schema，仅harness/scripts | 同run/DAG/hash/未知拒绝，非public或domain | CROSS-010 |

## 8. 命名一致性

固定九TC族、十EV层级，98唯一双射；49同名入口/Request字段集合与03静态核对相等。不存在TC-STATE/OBSERVABILITY/REDACTION族；Conflict仅口语历史诊断，正式ErrorCode用IdempotencyConflict/VersionConflict；Review ContractBlocked、Attempt/Notice CommitUnknown。PackageRelease/InstallRecord/EntitlementView/Rating/Ranking等旧truth仅历史诊断，不在正式05对象或主线。

## 9. 冲突与修正表

| 冲突 | 已作修正 | 外部/范围上限 |
|---|---|---|
| 初稿提前全部completed | flow/ledger恢复实际进度，各Step回核再过门 | 未伪造测试执行 |
| Draft提前basis、shell前置decision | U2仅Submit freeze，CreateListing无review，List正式approved | 不改03/04 |
| NoticeAttempt/Unknown/Conflict漂移 | NoticeIntent/CommitUnknown/ContractBlocked/正式ErrorCode | ACK/negative command不approved/installed/delivered |
| 82短case缺共享库存 | 保留编号+16=98，49fields索引/13CUT/13DS/11suite/98EV | 参数化实际运行not-run |
| report工具漏suite/schema循环 | 11suite完整、strict11kind JSON、top-level摘要排除、artifact/seal DAG | 无实际writer/index |
| MP-SRC-003标签 | 沿03技术栈语义，auth用MP-UP-003；保留04标签差异 | 受控后续核对，不私改正式04 |

## 10. 正反例与结论

正例：Draft result basis_ref=None；Submit fixedbasis+Submitted+review work同Tx；formal matched rejected可存但List拒绝；晚Confirmed在Cancelled/Withdrawn后保存真实binding及Partial责任；GetOperationResult当前全披露后返回完整原payload；tool validator真实负例运行可产生该工具EV。

反例：签名/scan/ACK/fresh→approval；CreateListing即Listed；cancel=远端rollback；一次RO Missing=commit rollback；blind retry或用currentview补原report；index shell/静态表/原型截图=final evidence；config Bound或owner台账07=marketconsumer ready。

结论：设计来源/字段/构造/state/query/phase/nested/name/证据闭环已逐项审查；正式装配仍须Step15门禁与静态核对。实际执行/owner qualification/06裁决/07boundary均未完成，全部开放项保持。
