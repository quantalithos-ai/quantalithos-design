# Step 6：设计测试场景与用例矩阵

## 1. Step 状态

2026-10-02；full-restart / single-agent；`completed / selfcheck_done / stop_review / gate_status=pass`（设计）。输入Step5候选追溯、03七U schema/flow/state/ports、04；输出98个P0参数化用例、49入口字段索引、13CUT独立设计停审。所有TC为`planned/not-run`。

Step内计划：用例语义回核→逐CUT正反/故障展开→49入口与库存覆盖→切口停审→跨断言审计；均完成设计核验。只读静态检查：98唯一TC、49入口=21C/16Q/12J，逐Request业务字段与03同名schema差集为0；不是运行结果。

### Step内计划与门禁字段

| 计划项 | 状态 | 可审查产物/门禁 |
|---|---|---|
| 读取输入与前序结论 | done | §2；前序：05_test_plan_step_05_traceability_coverage.md（含诊断、取舍、未确认项） |
| SOP逐问题回答 | done | §3，回答所有适用问题 |
| 当前/历史材料诊断 | done | §4，不继承historical truth |
| 设计取舍 | done | §6，采用/未采用理由 |
| 结构化产物 | done | §7；编号/字段/归属可反查 |
| 复杂度判断 | done | 已拆49入口索引与13CUT独立审查附录 |
| 回填草稿 | done | §8；只候选，正式写入等Step15 |
| 自检/下一步 | done | §9/10，外部资格不关闭 |

`gate_status=pass`；`gate_reason`=本Step设计审查完成，执行仍not-run；`next_allowed_action`=§10下一Step阅读/设计；`source_files`=§2列出的正式输入与前序文件。上述done是本Step内容事实，不是测试执行或用户/owner签核。

## 2. 本步输入

[Step5](05_test_plan_step_05_traceability_coverage.md)、[Step3](05_test_plan_step_03_test_objects_cuts.md)、[03 Step16](03_ddd_step_16_test_cuts.md)、03 Step6/7/8/9/10七U规范性附录、Step11～15、[04](../04-配置设计.md)；SOP Step6及书写规范§5.6。每TC的需求从Step5反查，具体Request/字段/返回/错误从本步入口索引回03，不写第二套业务schema。

## 3. SOP 问题回答

| 问题 | 回答 |
|---|---|
| P0主线？ | §7各行builder构造当前正式typed前置，调用指定入口，逐字段比对结果/持久状态。 |
| 反向/边界？ | 每行的错误fixture只改变一个维度；缺字段、错kind、权限、binding、terminal、timeout分别展开subcase。 |
| 非法state？ | CROSS-013参数化全部14carrier/222pair，A逐guard，S按分类，R零变更。 |
| rollback/effect？ | CROSS-015每写点fault；C单Tx、J分别A/B，spy调用与真实PG观测分开。 |
| 恢复复现？ | freeze原checkpoint/permission，crash与原probe结果矩阵，保留full原report；不重造原结果。 |
| 正式断言来源？ | 入口索引逐Request字段，03 Step10正式enum、Step12十八ErrorCode及映射。 |
| phase越界？ | 本地Accepted/Confirmed不等approval/install/payment/delivery/evidence；真实owner positive仍blocked。 |
| 每CUT场景？ | 切口审查附录逐CUT登记正反/边界/并发/恢复，不能用九族代替13CUT停审。 |
| 数据/自动化/EV？ | DS编号沿Step7，suite别名如下；EV为Step5双射，全部自动化候选。 |
| 单CUT停审？ | 逐CUT完成再记录，仅文档设计结论；不是用户或owner signoff。 |
| 跨审计？ | 库存、字段/error、EV唯一、共享spy、后续phase、外部blocker均需核验。 |

## 4. 当前文档问题诊断

初稿Draft错误冻结basis、目录壳错误要求MatchedDecision、NoticeAttempt不存在、Conflict并非正式ErrorCode、Record outcome错误允许negative/Unknown；family不等CUT，缺dataset/主suite/具体EV和库存索引。以下修正不改变03。

## 5. 改动前后对比

| 前 | 后 | 理由 |
|---|---|---|
| 82条短场景 | 保留82编号并补16条共享契约缺口，共98条 | 不重用旧编号 |
| Draft有basis | Draft仅draft_spec；Submit才freeze | 与正式U2一致 |
| listing shell需批准 | 创建壳无review gate，List才批准 | 不错置审核时机 |
| 用例族停审 | 13CUT独立停审+跨审计 | 可恢复小循环 |

## 6. 测试设计取舍

采用明确参数化清单而非为222pair/146methods分别另建TC编号；runner须列出每个subcase及expected集合，缺一个不是通过。拒绝仅用mock调用次数证明PG事务；fake验证编排，真实PG验证frame/CAS/as-of。共享通用断言在下述规则定义一次，各TC再增加本地断言。

## 7. 结构化中间产物

### 7.1 用例公共契约

- 全部P0/自动化候选/当前not-run。每个参数化case必须包含正向和相应负向数据，不只传空输入看status。
- `S=service-flow-fast`、`I=infra-runtime-fake`、`P=postgres-atomicity`、`W=entry-worker-job`、`R=recovery-replay`、`D=contract-domain-fast`、`C=config-redline`、`X=redaction-boundary`、`B=web-protocol-workflow`、`E=report-generation-audit`、`M=release-main-smoke`。
- 表中EV省略`EV-`；DS省略`DS-`；CUT省略`CUT-MP-`。每行是唯一TC定义；附加suite可重跑，但主EV仅引用同run主suite的完整raw/report，重复执行不得覆盖主结果。
- C通用：current disclosure→original replay→fresh；same key/intent逐字段原result，异intent=`IdempotencyConflict`；所有accepted facts/context/audit/work/plan/fullresult/Completed同Tx。拒绝不新增accepted audit。J通用：原claim/fence/checkpoint，A KnownCommitted才允许effect；B新load/CAS/新frame，unknown/probe-first，full item report和successor职责，旧report不覆写。
- Q通用：16Query及原replay零writeTx/ID/Clock/context/audit/work/O/P/owner effect；current scope先Missing；整体NotVisible无ref/count/token，typed Degraded不是Empty。无分页Query不得附会分页；七paged caller单列CROSS-017。
- 负向错误精确沿03 Step12映射：wrong-kind=`InvalidInput`，非法迁移=`IllegalTransition`，wrongbinding=`BindingMismatch`，CAS=`VersionConflict`，wrongfence=`FenceMismatch`，缺required body字段=`InvalidInput`，缺已指向的完整存储本体=`IntegrityFailure`。表中多个错误必须分subcase，禁止“任一非200即可”。

### 7.2 来源、申请和目录（CUT-02/03/06/07/09/12的业务批次）

| TC | CUT | 数据 | 输入/操作（含反例） | 精确断言 | 主suite / EV |
|---|---|---|---|---|---|
| TC-SOURCE-001 | 02/03/06 | SOURCE | BindPublisherRelation(principal_candidate,requested_scope)，重复/异意图 | Bound只引用正式publisher authority；重复完整原结果，异key意图不覆盖；no identity body | S / DOMAIN-001 |
| TC-SOURCE-002 | 02/08 | SOURCE | ReleasePublisherRelation(relation_ref,expected_revision,verification_refs,reason_ref)；陈旧revision | Released及关联实际核验失效同Tx；CAS错VersionConflict/全rollback；再发布current gate拒绝 | S / DOMAIN-002 |
| TC-SOURCE-003 | 02/03 | SOURCE | 五类formal typed source/material一致，VerifyPublicationSource | Qualified；owner/version/digest/visibility/mapping原值；材料仅ref；不生成scan/signature | S / DOMAIN-003 |
| TC-SOURCE-004 | 01/02 | SOURCE | 缺digest/visibility、错material kind/过期，逐一变异 | malformed InvalidInput；正式缺资格ContractBlocked或实际Blocked/Invalidated分支按flow；无application/listing/effect | I / DOMAIN-004 |
| TC-SOURCE-005 | 03/10 | SOURCE | human/org/auth mismatch、以AI identity当publisher authority | NotAuthorized/ContractBlocked按指定adapter分支；无假principal/认证；MP-UP-003保留 | I / DOMAIN-005 |
| TC-SOURCE-006 | 07/12 | SOURCE | GetSourceQualification(verification_ref)，可见/隐藏/缺失/不可用 | Q通用；Qualified与safe gap分开；此入口无page，不构造假token | S / DOMAIN-006 |
| TC-REVIEW-001 | 02/03 | REVIEW | CreatePublicationDraft(draft_spec)，缺typed字段/unsafe body | 保存完整draft_spec、Draft、basis_ref=None、review_ref=None；无PublicationBasis/Review work；拒绝InvalidInput/UnsafeMaterial | S / DOMAIN-007 |
| TC-REVIEW-002 | 02/06 | REVIEW | RevisePublicationDraft(application_ref,expected_revision,draft_spec)于Draft | 仅允许draft字段替换和CAS；仍无basis/review；不覆写已冻结basis；旧revision VersionConflict | S / DOMAIN-008 |
| TC-REVIEW-003 | 03/04 | REVIEW | SubmitPublicationApplication于当前Qualified Draft；同key replay | freeze PublicationBasis+Submitted+PendingDispatch review/work同Tx；full receipt；重复不第二basis/work | S / DOMAIN-009 |
| TC-REVIEW-004 | 02/08 | REVIEW | Submitted执行Revise；source/material资格于submit前改变 | Submitted修订IllegalTransition；实际gate失效CurrentGateDenied/ContractBlocked对应subcase；fixed basis不改 | S / DOMAIN-010 |
| TC-REVIEW-005 | 03/05 | REVIEW | DispatchReviewHandoff原handoff/work许可及controlled正式dispatch Confirmed | 原permission一次effect，WaitingDecision不是MatchedDecision/Listed；A/B与fullreport匹配 | S / DOMAIN-011 |
| TC-REVIEW-006 | 05 | REVIEW | A commit unknown、外发timeout、B fault三独立crash点 | A未确认零dispatch；已许可effect未知→CommitUnknown、durable Reconcile责任；无probe Blocked work；无盲重发 | I / DOMAIN-012 |
| TC-REVIEW-007 | 02/03 | REVIEW | RecordGovernanceDecision与ReconcileReviewHandoff，matched approved/rejected各一 | 两者均可MatchedDecision；rejected不可List；exact application/basis/source/material/scope/current binding；不造approval | S / DOMAIN-013 |
| TC-REVIEW-008 | 01/02 | REVIEW | ACK/scan/signature/waived/superseded/revoked/错binding决定 | wrongbinding BindingMismatch；缺consumer ContractBlocked；上架gate CurrentGateDenied；没有本地Approved enum | I / DOMAIN-014 |
| TC-REVIEW-009 | 02/05 | REVIEW | TerminatePublicationApplication与late handoff/probe交错 | Terminated；保留原permission/checkpoint/真实late结果职责；不复活申请或版本 | S / DOMAIN-015 |
| TC-REVIEW-010 | 12/05 | REVIEW | GetPublicationProgress和original C/J replay，删除被引用basis/report本体 | Draft无basis正常，Submitted有ref缺本体IntegrityFailure；完整original report；Q/replay零写 | S / DOMAIN-016 |
| TC-CATALOG-001 | 03/04 | CATALOG | CreateMarketplaceListing(publisher_ref,metadata,category_refs)，有Bound publisher而无decision | 只建目录壳/metadata/category，result revision读回一致；不自动建version/Listed；body拒绝UnsafeMaterial | P / PG-001 |
| TC-CATALOG-002 | 02/04 | CATALOG | EditMarketplaceListing同scope合法category；陈旧revision/替换source字段 | local metadata/revision r→r+1；不改source/version/digest；unknown字段InvalidInput，CAS VersionConflict | P / PG-002 |
| TC-CATALOG-003 | 02/04 | CATALOG | MaintainMarketCategory显式variant；parent ancestry环、跨scope、重复自然键 | 合法taxonomy CAS；环InvalidInput，跨scopeNotVisible/NotAuthorized按入口，业务UK映VersionConflict | P / PG-003 |
| TC-CATALOG-004 | 02/04 | CATALOG | RegisterMarketVersion(listing_ref,application_ref)，同sourceidentity再次注册 | 精确Submitted basis→Staged；不可SemVer upsert；不同intent撞UK VersionConflict；原basis不改 | P / PG-004 |
| TC-CATALOG-005 | 02/08 | CATALOG | ListMarketVersion(version_ref,expected_revision)于Staged/当前正式approved | Listed；publisher/source/material/Gov/scope完整current gate；receipt同实际revision | P / PG-005 |
| TC-CATALOG-006 | 02/08 | CATALOG | 缺approved、publisher Released、wrong basis、Withdrawn逐变异再List | CurrentGateDenied/ContractBlocked/BindingMismatch/IllegalTransition分case；无写、无假Restricted自动成功 | P / PG-006 |
| TC-CATALOG-007 | 07/09 | CATALOG | SearchMarketplaceCatalog(filter)五类/分类/标签/关键词/分页 | items/count/token同current谓词；同类多listing多版本不混；源不可用Degraded，不Empty | P / PG-007 |
| TC-CATALOG-008 | 07/12 | CATALOG | search/detail/version hidden与restricted/withdrawn/authorized missing | 整体NotVisible不带存在性，合法可见受限状态明确；无body/ref泄漏；不合并成全部Empty | P / PG-008 |
| TC-CATALOG-009 | 02/07 | CATALOG | SelectMarketVersion显式旧版、无可用、失效版本 | exact market/owner version；未获资格不替最新、不创建intent；typed eligible/gap沿原view | P / PG-009 |
| TC-CATALOG-010 | 07/09/12 | CATALOG | ListMarketVersions/ListMarketCategories/GetMarketplaceListing正常/缺paired projection | Q通用；七paged规则按适用caller；manifest存在缺body IntegrityFailure，不能称Fresh | P / PG-010 |

### 7.3 分发、撤回与恢复（CUT-03/04/05/08/11/12）

| TC | CUT | 数据 | 输入/操作（含反例） | 精确断言 | 主suite / EV |
|---|---|---|---|---|---|
| TC-DISTRIBUTION-001 | 03/07/12 | DISTRIBUTION | GetAcquisitionEligibility(target)在current与stale UI/cache | current source/publisher/Gov/scope/receiver交集；Q零写；无price/payment推断 | W / WORKER-001 |
| TC-DISTRIBUTION-002 | 03/04 | DISTRIBUTION | RequestDistribution(target exact version/consumer/receiver/scope)；缺Receiver slot | Accepted intent/relation/Prepared attempt/work/fullresult同Tx；slot缺ContractBlocked/noeffect | W / WORKER-002 |
| TC-DISTRIBUTION-003 | 06/12 | DISTRIBUTION | 同key/actor/scope/target完整重复 | 同relation及原完整receipt；0ID/Clock/context/audit/work/第二effect | W / WORKER-003 |
| TC-DISTRIBUTION-004 | 06 | DISTRIBUTION | 同key改target/version/receiver/scope各一 | IdempotencyConflict；旧intent/result/fingerprint保持；不是泛Conflict | W / WORKER-004 |
| TC-DISTRIBUTION-005 | 03/05 | DISTRIBUTION | DispatchDistribution A KnownCommitted+formal Confirmed | attempt Confirmed及exact ReceiverOutcomeBinding；fullreport，B新cursor/revision；不installed | W / WORKER-005 |
| TC-DISTRIBUTION-006 | 05 | DISTRIBUTION | 外发timeout/local commit unknown，RO missing | CommitUnknown/ExternalCommitUnknown按阶段；RO missing不证rollback；原permission保留；不Paid/Settled | W / WORKER-006 |
| TC-DISTRIBUTION-007 | 08 | DISTRIBUTION | CancelDistribution与late Confirmed/withdraw竞争 | intent Cancelled；原attempt/Confirmed不删；适用disposition追加late impact责任，不伪远端rollback | W / WORKER-007 |
| TC-DISTRIBUTION-008 | 01/03 | DISTRIBUTION | RecordReceiverOutcome错intent/version/consumer/receiver/scope；negative/Unknown/ACK | command只匹配formal Confirmed；BindingMismatch或CurrentGateDenied按flow，no attach；negative/Unknown走Job | W / WORKER-008 |
| TC-DISTRIBUTION-009 | 08 | DISTRIBUTION | Withdrawn/source Invalidated后新RequestDistribution | CurrentGateDenied/ContractBlocked分case；不产生新relation/permission/effect；旧结果不删 | W / WORKER-009 |
| TC-DISTRIBUTION-010 | 05/12 | DISTRIBUTION | ReconcileDistribution原probe Confirmed/notcommit/Unknown/no-probe，GetDistributionProgress | Confirmed/Failed/CommitUnknown/Blocked独立；新attempt需formal notcommit+current gate；progress只读 | W / WORKER-010 |
| TC-WITHDRAWAL-001 | 02/04/08 | WITHDRAWAL | RestrictMarketVersion有正式authority，与新许可交错 | Restricted/disposition/Impact Partial/scanwork同Tx，停新admission；旧许可责任保留 | S / DOMAIN-017 |
| TC-WITHDRAWAL-002 | 02/08 | WITHDRAWAL | WithdrawMarketVersion于Listed/Restricted；试图再次上架/refresh复活 | Withdrawn终态；List IllegalTransition；notice失败不回滚Withdraw；no历史删除 | S / DOMAIN-018 |
| TC-WITHDRAWAL-003 | 03/08 | WITHDRAWAL | restrict/withdraw缺authority/source unknown、scope不可证 | NotAuthorized/ContractBlocked/NotVisible逐case；拒绝不新disposition；资格gap不伪外部revoked | S / DOMAIN-019 |
| TC-WITHDRAWAL-004 | 04/09 | WITHDRAWAL | EnumerateKnownImpact固定upper，多页Relation+Attempt联合历史 | each typedPK一次；cursor稳定，完整才KnownScopeComplete；不承诺全安装覆盖 | S / DOMAIN-020 |
| TC-WITHDRAWAL-005 | 08/09 | WITHDRAWAL | KnownScopeComplete后late B新cursor>upper | 回Partial且增量责任/work同Tx；保存late actualbinding，旧upper扫描报告不改 | S / DOMAIN-021 |
| TC-WITHDRAWAL-006 | 06/03 | WITHDRAWAL | PlanImpactNotifications(impact_ref,targets)，乱序/重复target | targets保序canonical；每formal target/channel唯一NoticeIntent；重复InvalidInput，无截断complete | S / DOMAIN-022 |
| TC-WITHDRAWAL-007 | 03/05 | WITHDRAWAL | DispatchNotice formal Confirmed与formal notcommit | NoticeIntent Confirmed/Failed沿formal结果；没有NoticeAttempt对象；Confirmed不等delivered/read | S / DOMAIN-023 |
| TC-WITHDRAWAL-008 | 05 | WITHDRAWAL | notice timeout/B失败后ReconcileNotice，probe缺失 | CommitUnknown保存原permission/report，原intent probe-first；缺probe Blocked责任，0blind resend | S / DOMAIN-024 |
| TC-WITHDRAWAL-009 | 01/03 | WITHDRAWAL | RecordNoticeOutcome错target/channel/notice/scope；negative/Unknown/ACK | command仅formal Confirmed exact绑定，错配BindingMismatch；其余不attach，实际负向由Job承接 | S / DOMAIN-025 |
| TC-WITHDRAWAL-010 | 07/12 | WITHDRAWAL | GetWithdrawalImpact/GetNoticeProgress可见/隐藏/unknown/late | Q通用；filtered count/token，Partial与外部结果分轴；局部计划不送达承诺 | S / DOMAIN-026 |
| TC-RECOVERY-001 | 06/12 | RECOVERY | GetOperationResult与same-key replay，current disclosure允许/拒绝 | 全部允许才逐字段完整original payload；否则整体安全拒绝，不裁字段冒原结果；零写 | R / RECOVERY-001 |
| TC-RECOVERY-002 | 06 | RECOVERY | actor/delegate/scope/selector/body改变仍同key | IdempotencyConflict；immutable old result/context；display hint不改canonical | R / RECOVERY-002 |
| TC-RECOVERY-003 | 03 | RECOVERY | RequestMarketRecovery(target_ref)合法finite target/currentauthority | Requested+Recovery work；RecoveryAuthorityRef正式来源；仅局部有限恢复，不任意SQL | R / RECOVERY-003 |
| TC-RECOVERY-004 | 02/11 | RECOVERY | target=Recovery/非法ownertruth/越scope | Unsupported/NotAuthorized分case；不造新effect或Observation递归，不改ownertruth | R / RECOVERY-004 |
| TC-RECOVERY-005 | 04/05 | RECOVERY | RunMarketRecovery原checkpoint/report不完整 | 原Operation Reserved保持；IntegrityFailure或Recovery Blocked实际分支；不补造原report/Completed | R / RECOVERY-005 |
| TC-RECOVERY-006 | 05 | RECOVERY | finite外部target原formal inspection，原probe notcommit/confirmed/unknown | 新B load/CAS/cursor；probe-first，retry current gate；无probe等待，不复用A对象覆盖 | R / RECOVERY-006 |
| TC-RECOVERY-007 | 11/12 | RECOVERY | GetMarketAudit(subject_ref)安全六字段，body/secret sentinel | current disclosure；refs-only六字段及原operation关系；0audit自写/0evidence body | R / RECOVERY-007 |
| TC-RECOVERY-008 | 04/11 | RECOVERY | DispatchObservation原committed auditset/permission，producer缺口 | exact originaloperation/auditset；缺producer ContractBlocked/Blocked责任/noeffect；receipt非evidence | R / RECOVERY-008 |
| TC-RECOVERY-009 | 05/11 | RECOVERY | ReconcileObservation原probe，换成当前Job auditset/ACK | exact原集匹配才binding；错集BindingMismatch、缺probe等待；无O/P递归或Archivewriter | R / RECOVERY-009 |
| TC-RECOVERY-010 | 05 | RECOVERY | shutdown/crash于claim/A/外发/B各点，重启 | stop new claim；原checkpoint/permission/CommitUnknown保留；旧fence不能强置Settled | R / RECOVERY-010 |
| TC-RECOVERY-011 | 12 | RECOVERY | GetRecoveryProgress(recovery_ref)每正式状态+隐藏/缺本体 | Requested/Running/Completed/Blocked原值；Completed非owner ready；Missing/NotVisible正确且零写 | R / RECOVERY-011 |

### 7.4 引用与配置（CUT-09/10/11/12）

| TC | CUT | 数据 | 输入/操作（含反例） | 精确断言 | 主suite / EV |
|---|---|---|---|---|---|
| TC-REFERENCE-001 | 03/09 | REFERENCE | RefreshQualifiedReferences(snapshot_refs,work_ref)完整typed slice | state+safe_material+validity/source identity同Tx，Qualified仅formal资格；no ownerbody | P / PG-011 |
| TC-REFERENCE-002 | 09/12 | REFERENCE | owner unavailable/visibility变化/材料失效，查询旧snapshot | 有旧合法材料Stale，无合法材料Unavailable；current不可见不返回旧safe_material；不verified | P / PG-012 |
| TC-REFERENCE-003 | 04/09 | REFERENCE | RebuildMarketReadProjection(projection_ref,work_ref,plan)完整非空required plan | every key exactly once Rendered/Omitted；payload/manifest/state Fresh同Tx；no truth update | P / PG-013 |
| TC-REFERENCE-004 | 09 | REFERENCE | plan缺key/duplicate/空required；manifest存在body缺失 | InvalidInput/IntegrityFailure分别触发；不得Fresh，不以旧index补truth | P / PG-014 |
| TC-REFERENCE-005 | 09/11 | REFERENCE | unrelated kind/scope highwater、纯维护audit/lease/context/Obs receipt | 不无故Stale、不自循环rebuild/O；相关kind真实business cursor变化才判陈旧 | P / PG-015 |
| TC-REFERENCE-006 | 09/12 | REFERENCE | GetReferenceFreshness/GetProjectionFreshness actual各状态及缺pair | current disclosure、zero refresh/write；manifest缺body IntegrityFailure；Unavailability非Fresh | P / PG-016 |
| TC-CONFIG-001 | 10 | CONFIG | strict JSON合法envelope→loader→validator→builder | 六域映射七RuntimeConfig字段；schema_version/profile仅metadata；不变业务资格 | C / CONFIG-001 |
| TC-CONFIG-002 | 10 | CONFIG | unknown key/duplicate key/invalid JSON/type/null逐项 | fail-fast；0listener/claim/effect；完整snapshot不半装配 | C / CONFIG-002 |
| TC-CONFIG-003 | 10 | CONFIG | --config/env冲突、均无路径；相同路径分支按04 | 拒冲突/缺路径；不自动HOME搜索；rawpath不入logs | C / CONFIG-003 |
| TC-CONFIG-004 | 10 | CONFIG | 八slot duplicate/unknown/missing、请求写Bound | duplicate/unknown fail；missing slot Blocked；配置不能自证Bound | C / CONFIG-004 |
| TC-CONFIG-005 | 10 | CONFIG | worker_batch_limit/lease_millis=0、type/overflow/缺值 | validator拒绝；不编budget默认；finite范围仅沿04，无生产数值假设 | C / CONFIG-005 |
| TC-CONFIG-006 | 10 | CONFIG | 四profile；CI复用test；production尝试fake/错profile姿态 | fake仅显式test composition（本地测试也用test profile）；production拒绝fake；未qualification slot保持Blocked | C / CONFIG-006 |
| TC-CONFIG-007 | 10/11 | SECURITY | sensitive ref/secret sentinel注入loader/entry/Web/report日志 | 不回显rawsecret/endpoint/ref/path；finite安全分类；不是静态口头redacted | C / CONFIG-007 |
| TC-CONFIG-008 | 10 | CONFIG | PG/provider/SDK引用解析或装配失败，每步fault | PG关键失败拒装配，owner缺口Blocked；已创建句柄清理、0listener/claim | C / CONFIG-008 |
| TC-CONFIG-009 | 10/13 | CONFIG | Web public API base非法origin/含credential/query fragment | build-time拒绝非法值，合法public origin；不将secret注入bundle | C / CONFIG-009 |
| TC-CONFIG-010 | 10 | CONFIG | invalid snapshot重启及last-known-good | 不hot reload/半切换；旧完整artifact回滚不回滚listing/withdraw状态 | C / CONFIG-010 |
| TC-CONFIG-011 | 10/13 | CONFIG | default_locale缺/En/Zh/未知tag，Web切换 | 缺值默认En沿04；未知tag拒绝；locale不改authority/ref/intent/state | C / CONFIG-011 |
| TC-CONFIG-012 | 10 | CONFIG | 追加approved/paid/skip_scope/TLS/auth/CORS新业务或未设计字段 | strict unknown拒绝；无billing/state/config bypass；技术未来字段亦不私造 | C / CONFIG-012 |

### 7.5 共享契约（按CUT逐个展开，不能以代表subcase覆盖全库存）

| TC | CUT | 数据 | 输入/操作（含反例） | 精确断言 | 主suite / EV |
|---|---|---|---|---|---|
| TC-CROSS-001 | 06 | BASE | 33C/J business DTO逐叶字段变异；trace/locale/time/display/role hint改变 | 每业务字段改fingerprint；meta hint不改；sealed只33DTO，无Query/任意JSON impl；kind错InvalidInput | D / UNIT-001 |
| TC-CROSS-002 | 06 | BASE | unordered Set排列/重复，ordered targets反序，u64极值/Optional null/enum tag | RFC8785+SHA256 v1规则；整数canonical十进制string，targets保序；duplicate/unknown拒绝；不生成资产digest | D / UNIT-002 |
| TC-CROSS-003 | 04/08 | PG | 两RW frame竞争、一个rollback、MustNotExist/Exact CAS/溢出 | 高upper不越低号未终局Tx，rollback frame不可见；revision0/r+1与readback一致；0row VersionConflict/overflow IntegrityFailure | P / PG-017 |
| TC-CROSS-004 | 07/09 | CATALOG | EN/ZH短词/长词、空/边界filter、literal百分号/下划线/引号 | literal OR simpleFTS；参数绑定不当SQL/regex；candidate/filter/count/token一致，稳定typedPK排序 | P / PG-018 |
| TC-CROSS-005 | 12 | BASE | 全16Query+全33C/J original replay，spy每可变资源 | 0writeTx/ID/Clock/context/audit/work/O/P/owner effect；允许只current formal read/RO；无fresh precheck；全部当前披露或整体拒绝 | W / API-001 |
| TC-CROSS-006 | 11 | SECURITY | capture所有runtime/API/Worker/adapter日志tracemetric及报告，注入sentinel | raw body/secret/stack/URL/path/free reason/high-cardinality id不出现；finite labels与safe reason沿03；报告失败仍脱敏 | X / REDACTION-001 |
| TC-CROSS-007 | 01/03/11 | SECURITY | Core可信actor/delegate vs caller自填approved/verified/scope；human owner缺口 | deny unknown/unsafe，Core actor/meta唯一authority；不自建human login/session；越scope NotAuthorized/NotVisible | W / API-002 |
| TC-CROSS-008 | 13 | WEB | 默认En，切Zh再切En；操作进行中/失败/unknown | 所有标题/状态展示词覆盖；ref/enum/key/operation/fingerprint不变，locale不触发重复submit | B / WEB-001 |
| TC-CROSS-009 | 10/11 | CONFIG | production fake标签、ACK/scan/signature/fresh与缺formal资格 | no fake fallback、不得Bound/approved/evidence；只正式qualification绑定，错误/Blocked不伪pass | C / CONFIG-013 |
| TC-CROSS-010 | 11 | EVIDENCE | 生成器synthetic report变异：静态pass、缺raw、跨run、latest、摘要错/未脱敏 | Step13 schema/integrity/redaction validator拒绝；负例预期拒绝本身可pass，但被污染业务证据不得采纳 | E / RELEASE-001 |
| TC-CROSS-011 | 01 | BASE | 49Request/result/report/view和可达嵌套类型逐字段codec | roundtrip逐字段；每required删除/unknown/tag/wrongkind拒绝；Option显式与条件ref校验；0影子meta/authority | D / UNIT-003 |
| TC-CROSS-012 | 02 | BASE | 全43对象factory/member/public rehydrate(Row)逐字段/条件变异 | pure/no I/O；合法初态；非法condition/fullfield缺失拒绝；revision镜像；infra不能绕validated重建 | D / DOMAIN-027 |
| TC-CROSS-013 | 02 | BASE | 全14carrier逐222 From/To+A/S/R及每guard false/terminal | 73A合法逐side effect；S逐分类含replay/no-op/probe限制；R精确拒绝/0变更；数量与正式矩阵相等 | D / DOMAIN-028 |
| TC-CROSS-014 | 03 | BASE | 全17ports/146methods conformance，49flow顺序/typed错误/每method fault | 公开签名唯一、associated Tx一致，fake无private补口/隐式commit；调用方/返回完整，method未使用仍adapter契约测试 | I / UNIT-004 |
| TC-CROSS-015 | 04/11 | PG | 每21C/12J A/B写点fault；context/fact/history/work/plan/audit/fullresult/complete失败 | C全rollback；A未证实零effect；B失败保留A；同frame包含receipt work refs；21C+8J O，RecoveryJob只P、Obs2/Rebuild无O/P | P / PG-019 |
| TC-CROSS-016 | 08 | PG | release/version withdraw/permission两种顺序，cancel/late outcome，多disposition | publisher→version锁序；处置先commit则无新许可，反序保留真实late binding并每适用disposition续责；no复活 | P / PG-020 |
| TC-CROSS-017 | 07/09 | PG | 七paged PageReadContext；换actor/delegate/scope/selector/filter/parent/upper/after，visibility收缩 | method-selector错配InvalidInput；currentfilter先count/page；wrongfamily/隐藏anchor拒绝；fixedupper as-of多页不漏同frame PK | P / PG-021 |
| TC-CROSS-018 | 01/03 | BASE | 37HTTP routes合法/错误映射、replay header、尝试访问12Job | 十八ErrorCode对应03 HTTP码；Query200 Degraded保留；无Job公开route；hidden不带replay header/operation_ref | W / API-003 |
| TC-CROSS-019 | 05 | RECOVERY | Worker work/plan/fence错配、expired Claim、A后重启、stop signal | Pending合法claim；expired Claimed→新fence仅probe；body.work_ref/context.fence.work_ref同一；旧fence拒绝、shutdown保存责任 | W / WORKER-021 |
| TC-CROSS-020 | 03/10 | BASE | 未来manifest/模块依赖检查，尝试owner path/Bus/Archive/Billing依赖及event route | 只Core/SDK compile；owner runtime经SDK；0active event/outbox/财务/Archive writer；market listing不合并Hub/Method | D / UNIT-005 |
| TC-CROSS-021 | 13 | WEB | catalog/type/version→publish/progress→acquisition→withdraw/recovery；invalid DTO/空/加载/拒绝/unknown | workflow/按钮沿API状态，不凭UI资格；DTO invalid不得渲染假成功；默认En可切Zh、所有状态不重叠/漏文案 | B / WEB-002 |
| TC-CROSS-022 | 10 | CONFIG | 从同validated snapshot分别装配API/Worker/Web；各失败点 | API不claim Job，Worker无任意job路由；server startup、Web base build-time；七字段同源、不半装配/secret入bundle | C / CONFIG-014 |
| TC-CROSS-023 | 03/11/13 | BASE | 同run受控source→Draft→Submit→matched decision→List→exact distribute→withdraw→probe recovery | 仅本地最小闭环，列所有实际case/raw/report，unknown/blocked失败分支保留；全P0前置不能被smoke代表通过 | M / RELEASE-002 |

### 7.6 规范性索引与切口审查

[49入口字段与错误索引](05_test_plan_step_06_contract_index.md)提供每入口Request字段、TC和特有反例；返回完整字段以该索引链接的03 Step8为唯一schema。数据在Step7逐DS落实；具体suite调用与EV实例schema留Step9/13。

[13CUT独立停审与跨用例审计](05_test_plan_step_06_cut_reviews.md)逐CUT先分析风险/输入、选择主层、完成正反断言、停审后才进入下一CUT。不能以九族表一次性签核13CUT；这里全部仍是设计审查。

## 8. 回填草稿

正式§6采用本步完整用例矩阵和规范性索引；不把planned EV写成已收集evidence。执行结果、时间、commit、run_id和digest均不能在本轮填值。

## 9. 待确认事项

上游blocker保持；真实集成与容量不以controlled/fake关闭。详细设计影响判定：上述修正均是追溯回核，没有新增字段/state/error/入口；若某负向无法在原port注入，先回03契约审查，不在fake增加隐藏方法。

## 10. 进入下一步条件

98TC、49入口绑定、13CUT独立停审和跨项审计已完成本步设计门禁；未关闭任何真实positive资格。下一读SOP Step7、书写规范§5.7、本步DS需求和PG跨事务隔离/清理，不提交commit。
