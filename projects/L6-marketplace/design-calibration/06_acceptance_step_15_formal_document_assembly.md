# Step 15：正式验收标准装配

## 1. Step 状态

SOP Step15/规范15章主链、中间产物§3.2/3.4/3.4.6/5.10；full-restart/single-agent；completed/selfcheck_done/stop_review；gate_status=pass（设计装配）；gate_reason=总审计、旧稿删除、15章分批装配、链接/表格/库存静态核对完成；next_allowed_action=停止06，等待用户确认后再读取07。

### 1.1 Step 内计划

| 项 | 状态 | 产物 |
|---|---|---|
| 读取前序/全部输入 | done | §2 |
| SOP问题逐答 | done | §3 |
| 历史/当前诊断 | done | §4 |
| 取舍/分批 | done | §6 |
| 跨门禁总审计/来源 | done | §7十类跨文档闭环 |
| 复杂度/正式骨架 | done | 15章，A/B/C分批 |
| 回填正式草稿 | done | §8/正式06 |
| 静态自检/停审 | done | §10/06_acceptance_static_review_record.md |

## 2. 本步输入

source_files：Step14问题/诊断/取舍/待确认；06 Step1～14全部18主控/附录；当前00～05与03/05规范性schema/field/port/flow/state/TC-EV来源；[05跨文档审查](05_test_plan_cross_document_review.md)；验收SOP Step15/书写规范全文已读及本轮复核；中间产物重建/三层写入/十类闭环；全局§4.1 Layer5窗口及九owner恢复记录沿Step1。旧06在Step1独立结论后读作historical_material。

开工确认：通用三规范/当前SOP/书写规范/项目台账/flow/前序输入均已恢复读取。只当前agent，无实现/外部写/commit；未来07未读取/启动。每正式批次须本台账与flow/本Step同时许可，先骨架再单章/批次结论；不复制诊断/取舍/actual结果到正式正文。

## 3. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 15章主链？ | §1输入→2scope→3baseline→4三门→5功能→6红线→7接口→8状态Tx→9NFR→10证据→11VETO→12缺陷→13风险→14裁决签署→15参考。 |
| 删除SOP原问题？ | 正式只装配收口条件；问题/诊断/差异/取舍/独立停审留calibration。 |
| P0通过/失败/证据？ | 二十canonical AC及八B/53I/十四S/九T/17NFR/十二E/五VETO均有正式source/TC-EV/report和裁决。 |
| VETO有效？ | 五项actual finding优先总体不通过，不风险接受，过程缺证仍阻P0。 |
| 设计/TC/EV可回？ | 49入口/14carrier/全98规范性附录与05唯一映射；不能从静态表生成actual index。 |
| 字段/状态/事件一致？ | 43/49/17/146/14/222/33/七paged/18ErrorCode/0Event与03，六域七字段八slot/四profile与04；完整schema不复制第二truth。 |
| 风险有接受人/动作？ | 七字段全部记录未接受/未指派/未定，十二项十残余不可据此条件通过。 |
| Step5～11停审？ | 功能16及4G、边界8、入口49+4shared、状态14+Tx9、17NFR、证据12+98EV、VETO5均独立设计停审；不是runtime或owner signoff。 |
| 孤儿/重复/越权/路径？ | 先只读18文件结构/链接/表格核对，98双射/主suite已回核；跨门禁canonical反向归档一致性再总审计，发现缺口先回修再放装配门。 |

## 4. 当前文档问题诊断

旧06的10章commerce/install/rating/ranking、幽灵对象/无依据P95/角色槽位全部不继承。当前formal 03/04/05的历史“下一文档未授权”描述只属其完成时事实，授权状态以本项目台账为准；不为清理历史回写其他正式文档。

Step7把Unavailable与BindingDisposition并列可误读，需明确它是runtime错误不是第四姿态。Step14“红action”需修文案。98归档附录还须核所有06门禁的canonical反向锚点，不能只核无孤儿计数；若缺仅回修本项目calibration，不改变05schema/TC或正式03/04。

## 5. 改动前后对比

| 项 | 前 | 后/理由 |
|---|---|---|
| 旧formal | 10章旧业务truth | 删除后15章新骨架，结论仅当前00～05/06 calibration |
| 代表证据/泛化条件 | 难反查字段/入口/状态/TC | 规范性完整49/14/98入口和专项门禁，完整required集合 |
| 通过/签核事实 | 容易将设计或角色槽位作runtime结果 | design/actual scope/机器与人工/authority分层，当前未裁决 |

## 6. 设计取舍

采用正式06读者可判定的主门禁与细节规范性附录；43字段/49完整wire/17trait/222矩阵仍由03唯一定义，98TC/raw schema仍由05唯一定义，不为简化审阅复制第二authority。每章具体来源+延伸阅读。

装配批次A（§1～4范围基线/§5功能独立），B（§6边界/§7接口/§8状态Tx分别独立），C（§9NFR/§10证据/§11VETO/§12～15分别按章），单patch不超500行。总审计通过先删旧06，再单独建骨架，再逐批装配并局部静态检查。最后全部静态核对、写实际文档检查记录并停审；不跨07，不编任何run/asset/digest/scan/payment/EV/verdict/signoff/readiness。

## 7. 跨文档闭环与装配前总审计

以下是Step15的规范性总审计，不是运行结果。每个表先以正式00～05/03或04为真相源，再沿06门禁和05 TC/EV消费；发现冲突必须回owning calibration，不在正式06私造字段、状态、TC、EV或owner结论。

### 7.1 真相源表

| 事实 | 唯一真相源 | 06消费者 | 冲突处理 |
|---|---|---|---|
| 五能力、20AC、17NFR、五VETO、104需求 | [00](../00-需求文档.md)§7～16 | §2/5/9/11/14 | 以00 canonical为准；缺positive不伪通过 |
| Rust API/Worker、Vue/TS Web、Core/SDK依赖 | [01](../01-架构设计.md)、[02](../02-概要设计.md) | §1/2/6/7/14 | draft/原型不覆盖正式栈；MP-SRC-003保持pending |
| 43对象、49入口、17ports/146methods、错误码 | [03](../03-详细设计.md)§5～9/11及规范性附录 | §6/7/8/14 | 06只引用；字段/签名漂移回03 |
| 14carrier/222pair、frame/CAS/A-B、canonical/page/replay | [03](../03-详细设计.md)§9～13及Step10～13 | §8/9/12/14 | actual scope必须逐pair/写点；不以摘要替代 |
| refs-only audit、Observation/O-P、防递归 | [03](../03-详细设计.md)§14与[03 Obs审计](03_ddd_step_15_observability_audit.md) | §6/8/9/10/11 | local audit不等外部evidence/owner资格 |
| 六配置域、七RuntimeConfig字段、八slot、四profile | [04](../04-配置设计.md)及04 calibration | §3/6/7/9/11 | 配置不能产生Bound/approval/visibility/paid |
| 98TC/98EV、11suite、六checks、schema/DAG/paths | [05](../05-测试方案.md)及05 calibration | §3/4/5/7/9/10/12/14 | 05 schema/TC/EV唯一；06不增机器enum |
| 真实owner资格、material/receiver/notice/Obs/Archive | 九owner正式03/flow/必要台账，Step1表 | §1/2/6/7/11/13/14 | exact consumer/type/version/scope未闭合即blocked |

### 7.2 字段闭环表（风险代表，完整集合由03/05参数化）

| Domain对象/字段 | 来源与构造 | DTO/入口/状态 | 缺失处理 | TC / EV / AC |
|---|---|---|---|---|
| PublicationApplication.draft_spec/basis_ref/review_ref | U2 typed draft；Submit freeze PublicationBasis | Create/Revise/Submit；Draft/Submitted | Draft basis/review为None；Submitted缺本体IntegrityFailure | REVIEW-001～004 / EV-DOMAIN-007～010 / AC-MP-201/202 |
| MarketListing.metadata/category_refs/revision | U3 local metadata/category与CAS | Create/Edit；目录壳无lifecycle | unsafe body InvalidInput；旧revision VersionConflict | CATALOG-001～003 / EV-PG-001～003 / AC-MP-301/G02 |
| MarketVersion.source/basis/state | U3 source/basis immutable refs | Register/List；Staged→Listed | wrong binding/current gate/terminal拒绝 | CATALOG-004～006 / EV-PG-004～006 / AC-MP-201/202/203 |
| DistributionAttempt.intent/receiver/fence | U4原intent/permission与formal outcome | Dispatch/Reconcile/Record；Prepared/Dispatching/Confirmed/CommitUnknown | wrong binding/fence/unknown分别错误；不Installed/Paid | DISTRIBUTION-005～010 / EV-WORKER-005～010 / AC-MP-402/403/G02 |
| ImpactRecord.upper/coverage + NoticeIntent.targets/state | U5 fixed upper、typed PK与ordered target/channel | Enumerate/Plan/Dispatch；Partial/KnownScopeComplete、六Notice states | late→Partial；duplicate target InvalidInput；ACK非送达 | WITHDRAWAL-004～010 / EV-DOMAIN-020～026 / AC-MP-502/G03 |
| MarketAuditRecord六字段 | 03 trusted context + local committed facts | accepted C/J同Tx；GetAudit只读 | no raw/body/secret；Obs receipt非evidence | RECOVERY-007/008/009 / EV-RECOVERY-007～009 / AC-MP-503/G02 |
| StoredOperationResult/Checkpoint/fullreport | 原request/kind/schema/report/permission | C/J A-B与原replay；Reserved/Completed | fullreport缺失保持Reserved/IntegrityFailure；不currentview补 | RECOVERY-001/005/006 / EV-RECOVERY-001/005/006 / AC-MP-504/G02 |
| ReferenceSnapshot.safe_material/validity + Projection.manifest/body | owner safe slice + typed plan + committed facts | Refresh/Rebuild；Qualified/Stale/Unavailable、Fresh/Stale/Rebuilding/Unavailable | body/manifest不成对不Fresh；当前不可见不返旧材料 | REFERENCE-001～006 / EV-PG-011～016 / AC-MP-103/303/504 |

完整43对象字段、49入口Request/result/report/view、33canonical和七PageReadContext不复制进06；CROSS-011/012/017及05 contract index执行逐叶/逐caller闭环。

### 7.3 DTO / Event / Job 到 Domain 构造闭环

| 输入契约 | Domain目标 | 必填/派生 | 不得混同 | 缺失/失败 | TC / AC |
|---|---|---|---|---|---|
| 21 Commands | 七U factory/member及trusted ports | caller候选、正式资格、reserved IDs与完整DTO齐全 | caller body不等approval/verified/scope；same-key不重造 | InvalidInput/ContractBlocked/CurrentGateDenied；无accepted写 | 全业务TC+CROSS-011/014/015 / AC-G01/G02 |
| 16 Queries + Core envelope | ReadFacade/current disclosure/PageReadContext | actor/delegate/selector/filter/upper/after来源完整 | ref字符串不生成actor/scope；Query不写 | NotVisible/Missing/Degraded/IntegrityFailure；九counter=0 | CROSS-005/017/018 / AC-MP-302/303/G02 |
| 12 internal Jobs | persisted work/plan/fence/checkpoint/permission | A/B fresh load；work_ref/context.fence.work_ref同源 | timeout不等notcommit；当前Job auditset不替原 | CommitUnknown/Blocked/Reserved/新B frame | CROSS-019+REVIEW/DISTRIBUTION/WITHDRAWAL/RECOVERY job TC / AC-403/504 |
| 0 active Event/outbox | 不适用 | 无Domain构造/发布/订阅输入 | 不把邻仓事件或Archive/Billing lane引入 | CROSS-020/配置严格拒绝新topic | CROSS-020 / AC-G01/G02 |

### 7.4 状态闭环表

| Carrier / 正式enum | 合法集合与来源 | 关键触发/禁止 | TC / EV |
|---|---|---|---|
| PublisherRelation / SourceVerification | Bound/Released；Pending/Qualified/Blocked/Invalidated（03 U1） | Released不复活；缺资格不Qualified | SOURCE-001～004 / EV-DOMAIN-001～004 |
| PublicationApplication / ReviewHandoff | Draft/Submitted/Terminated；PendingDispatch/WaitingDecision/MatchedDecision/CommitUnknown/ContractBlocked/Failed（U2） | Draft无basis；rejected可Matched但不List；unknown不盲发 | REVIEW-001～010 / EV-DOMAIN-007～016 |
| MarketVersion | Staged/Listed/Restricted/Withdrawn（U3） | Withdrawn终态；List需current formal fullgate | CATALOG-004～006/WITHDRAWAL-002 / EV-PG-004～006/DOMAIN-018 |
| DistributionIntent / Attempt | Accepted/Cancelled；Prepared/Dispatching/Confirmed/Failed/CommitUnknown/Blocked（U4） | Cancel不删Confirmed；只formal Confirmed绑定 | DISTRIBUTION-002/005～010 / EV-WORKER-002/005～010 |
| Impact / NoticeIntent | Partial/KnownScopeComplete；Prepared/Dispatching/Confirmed/Failed/CommitUnknown/Blocked（U5） | late回Partial；无NoticeAttempt；ACK非delivered/read | WITHDRAWAL-004～010 / EV-DOMAIN-020～026 |
| Operation / Work / Recovery | Reserved/Completed；Pending/Claimed/Settled/Blocked；Requested/Running/Completed/Blocked（U6） | fullreport不足不Completed；old fence不Settled；Recovery有限 | RECOVERY-001/003～011+CROSS-019 / EV-RECOVERY/WORKER |
| Snapshot / Projection | Qualified/Stale/Unavailable；Fresh/Stale/Rebuilding/Unavailable（U7） | current不可见不泄漏；partial manifest不Fresh；maintenance不自循环 | REFERENCE-001～006 / EV-PG-011～016 |

完整14carrier=222pair（73A/51S/98R）由03矩阵和CROSS-013唯一展开；06不改enum或创造Approved/Installed/Paid/Delivered/NoticeAttempt。

### 7.5 Query response / view 闭环

| Query族 | Response/View来源 | empty/not-visible/degraded | 测试与验收 |
|---|---|---|---|
| U1 qualification/U2 progress | 03 U1/U2 typed view、basis/report refs | Draft无basis合法；缺本体IntegrityFailure；隐藏不带ref | SOURCE-006/REVIEW-010 / AC-101/103/202/203 |
| U3 catalog/version/category | 03 U3 + U7 projection、PageReadContext | current谓词后分页；NotVisible整体无存在性；Stale不授权 | CATALOG-007～010/CROSS-017 / AC-301/302/303 |
| U4 distribution/U5 impact/notice | local relation/attempt/impact/notice view | local/external分轴；Partial不假Complete；unknown可查 | DISTRIBUTION-001/010/WITHDRAWAL-010 / AC-401～403/501～502 |
| U6 result/audit/recovery | original full result、六字段audit、finite recovery view | 原payload不能完整披露则整体拒绝；Completed非ready | RECOVERY-001/007/011 / AC-302/503/504 |
| U7 freshness | snapshot/projection pair | Unavailable/Missing不Empty/Fresh；Query不refresh/write | REFERENCE-002/003/006 / AC-103/303/504 |
| 全16Q/33 replay | 03/05 complete schemas and no-write counters | 所有writeTx/ID/Clock/context/audit/work/O/P/owner effect=0 | CROSS-005/011/017/018 / AC-G02 |

### 7.6 Phase / commit boundary

| 阶段 | 包含 | 明确排除 | 验收范围 |
|---|---|---|---|
| local-contract | typed fake/domain/application/actual PG/API/Worker/Web/tool本地契约 | formal owner positive、approval、安装、支付、送达、readiness | 全98/11suite，证明上限随scope |
| formal-selected | local全量+冻结exact owner/type/operation/version/scope实际接缝 | 未选接缝；fake不替formal | 同run selected evidence；资格缺失block |
| capacity-candidate | 获准workload raw sample/trend | 无生产SLO/三值/retention通过 | Q-MP-01独立样本 |
| C/J commit | C一次frame完整写集；J A责任与B新frame/CAS | 外部跨owner事务、远端回滚、Query写 | CROSS-003/015/016/019 / AC-G02/403/504 |
| evidence/decision | actual raw→reports→EV/index→seal→draft→人工review | 静态计划、machine draft/verdict、自签风险 | CROSS-010、Step10/14 / AC-G01/G02 |

### 7.7 Public protocol / transport closure

| Surface | 正式传递类型/来源 | retry/missing/依赖边界 | TC / EV |
|---|---|---|---|
| 21C result/receipt | 03 Step8 typed result/receipt/state/revision/work refs | same intent原完整result；contracts不依domain | CROSS-011/014/015 / UNIT-003/004,PG-019 |
| 16Q/page/read surface | 03 U7/PageReadContext/ReadSurface | current谓词/typed gap；无writer/owner effect | CROSS-005/017/018 / API-001,PG-021,API-003 |
| 12J/report/checkpoint | 03 Step8/9 worker context/fence/permission/fullreport | A/B新frame；no-probe blocked；原IDs保留 | CROSS-019、RECOVERY-005/006 / WORKER-021,RECOVERY-005/006 |
| HTTP/Web | 37 route/18 ErrorCode/locale DTO（03） | hidden无replay header；Degraded≠ready；locale不改key | CROSS-008/018/021 / WEB-001/002,API-003 |
| test artifact | `marketplace-test/v1` strict harness schema（05） | same-run/DAG/hash/redaction；不进入public/domain | CROSS-010 / RELEASE-001 |
| Event | none | 不创建topic/outbox/active event | CROSS-020 / UNIT-005 |

### 7.8 命名一致性表

| 类型 | 正式名 | 禁用旧名/口语 | 修正位置 |
|---|---|---|---|
| 状态 | MatchedDecision, CommitUnknown, Blocked, Withdrawn | Approved、Timeout=NotCommitted、NoticeAttempt、Installed | 03§9、06§7/8/11 |
| 对象 | MarketVersion, DistributionIntent/Attempt, NoticeIntent, OperationRecord | PackageRelease、InstallRecord、EntitlementView、Rating/Ranking | 06§1/2/5/8/11 |
| 错误 | IdempotencyConflict、VersionConflict、ContractBlocked、CurrentGateDenied | 泛Conflict、failed但无code | 03§11/05§6/06§5/7 |
| 证据 | EV完整ID、reports/runs/<run_id>、artifacts/test/<run_id> | latest、跨run、静态pass、代表EV | 05§13/06§3/10 |
| 资格/结果 | formal Approved由Gov来源，Confirmed仅接收结果 | scan/signature/ACK=approval/installed/delivered | 06§5/7/11 |

### 7.9 冲突与修正表

| 冲突 | 影响 | 修正/来源 | 状态 |
|---|---|---|---|
| 旧06 commerce/install/评分/排名 | 越范围、私造truth | Step1独立差异审计；以00～05/03边界重建 | 已隔离 |
| 旧06无来源延迟阈值 | 虚构SLO | Step9只保留正式不变量；Q-MP-01 candidate | 已修正 |
| 早期05/06代表EV覆盖 | 孤儿/漏反向锚点 | Step10完整98索引；Step15补72条AC/VETO支持边 | 已修正/静态待复核 |
| BindingDisposition与Unavailable混列 | 错把runtime error当slot状态 | Step7明确Unavailable为错误分类 | 已修正 |
| “红action”文案 | 非正式词漂移 | Step14改为“脱敏” | 已修正 |
| MP-SRC-003标签/技术栈差异 | 误改04或把human auth归错ID | 沿03正式Rust/Vue；MP-UP-003独立 | pending外部确认 |
| owner台账/设计完成冒positive ready | 越owner authority | Step1/13/14逐项保留blocked，未修改owner | 未关闭 |

### 7.10 正反例与总审计结论

正例：Draft的basis_ref/review_ref为None；Submit冻结PublicationBasis并同Tx创建handoff work；rejected可Matched但不能List；Withdrawn停止新admission而晚到结果保留真实binding并把影响回Partial；原payload全部可披露才完整重放；actual validator负例可生成工具EV但不冒业务成功。

反例：signature/scan/ACK/fresh推导approval；CreateListing即Listed；Query修projection/source；timeout直接notcommit或blind retry；通知成功才撤回；index shell/静态表/原型截图冒final evidence；风险签署替Gov/owner/Billing/生产readiness。

总审计结论：需求→架构→概要→详细对象/协议/状态/事务→配置→测试TC/EV/schema/DAG→06门禁/否决/缺陷/风险/三值已建立单向闭环；98EV主suite唯一、20AC/5VETO有反向锚点、15章来源可追溯。所有运行/owner资格/风险接受/签署仍未发生；Step15可进入正式删除/骨架/分批装配门。

## 8. 回填草稿

正式 `06-验收标准.md` 已按本Step总审计重建为15章主链，并分A（§1～5）、B（§6～8）、C（§9～15）三批装配。正式正文只保留范围、门禁、状态、证据、否决、缺陷、风险和签署口径；问题回答、诊断、取舍、独立停审和历史差异留在本目录。正式章节均含具体校准来源和延伸阅读，未填运行值/actual三值/人名/签名。

## 9. 待确认事项

MP-UP-001～008、MP-SRC-003/010/013、Q-MP-01、R-MP-DDD-01～10及受影响owner/SDK/auth/PG/Obs/receiver/notice资格仍pending/blocked/affected/future。没有真实实现仓、commit、run、artifact、report、EV、digest、扫描、签名、支付结果、风险接受、verdict、signoff或readiness。正式06装配完成不等用户确认，也不授权07/实现。

## 10. 进入下一步条件

Step15设计门禁自检：

- [x] 旧06已先删除，随后创建15章骨架并按A/B/C批次装配。
- [x] 正式主链恰为15章，每章有具体校准来源/延伸阅读，无SOP问题原文和历史commerce/install truth。
- [x] Step1～14均completed/pass，Step5～11 P0细项、证据、VETO均独立停审；20 AC、5 VETO、17 NFR和98 TC/EV可反向定位。
- [x] 03唯一对象/字段/state/port/flow、04配置、05 schema/TC/EV/path未被06复制为第二truth；0 Event/outbox、Billing/Archive writer边界保持。
- [x] 98 EV索引行/主suite/AC锚点、15章链接、表格列数、Markdown围栏和范围内旧名检查通过；检查记录见 `06_acceptance_static_review_record.md`。
- [x] 文档状态只表明设计完成；无运行/owner资格/风险接受/三值/签署/readiness事实。

Step15 gate=pass（设计）；06 document gate=completed / stop_review / waiting_user_confirmation。下一动作仅等待用户明确确认后读取07 SOP；不提交commit。
