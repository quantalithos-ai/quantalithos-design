# Step 8：状态机、事务与一致性验收

## 1. Step 状态

SOP Step8/规范5.8；正式§8；completed/selfcheck_done/stop_review；gate_status=pass（设计）；gate_reason=14carrier/九Tx独立停审及跨项审计完成；next_allowed_action=Step9非功能。

### 1.1 Step 内计划

| 项 | 状态 | 产物 |
|---|---|---|
| 读取前序/输入 | done | §2 |
| 问题回答 | done | §3 |
| 诊断 | done | §4 |
| 取舍 | done | §6 |
| 状态/事务结构化 | done | §7及独立state reviews |
| 复杂度/附录 | done | 14carrier拆附录，完整矩阵不复制 |
| 草稿 | done | §8 |
| 跨状态一致性审计 | done | §10 |

## 2. 本步输入

source_files：[Step7](06_acceptance_step_07_interface_sync_gate.md)/49入口附录、03§9～12、Step10七U完整222pair、Step11/12/13/15及typedports PageReadContext、05CROSS-001/002/003/005/013/015/016/017/019和业务故障TC。前序资格/route/ref边界及十二开放项继承，不新state。

## 3. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 合法迁移？ | 完整14carrier/73A，每guardtrue/false与conditionrefs/factory初态；A不能只按终态判。 |
| 非法迁移？ | 98R全部精确IllegalTransition/正式错配/缺条件映射并零变更；51S逐replay/no-op/probe分类。 |
| 哪些原子提交？ | 21C facts/history/context/work-plan/audit/fullresult/Completed；12J分A/B、B新frame/CAS；projection完整publish。 |
| 幂等并发？ | 33canonical完整business、exactkeybytes、ROlookup/赢家；publisher→version、withdraw/permission、cancel/late、claim/fence、noticeUK、category/rebuild/refresh竞争。 |
| 失败怎么裁决？ | 任一requiredpair/guard/fault/counter/race漏或不符P0；篡历史/复活/伪结果命VETO5，不risk accept。 |
| 旧名/phase？ | 无Approved/Installed/Paid/Delivered/NoticeAttempt/GlobalState，无reserved外部state；同名Confirmed/Completed按carrier解释。 |
| 可回矩阵/flow/EV/path？ | 14项各linkU矩阵/flow，CROSS-013 shared全pair+业务EV；九Tx项有exactTC/EV/report规则。 |
| 每项停审？ | 每carrier先risk/取舍、正式enum/触发/不变量/子例→设计停审，九Tx同样逐项。 |
| 跨机冲突？ | MatchedDecision非approved、Cancelled不抹Confirmed、late回Partial、Settled需报告/继任、recovery/rebuild不复活；最后整体审计。 |

## 4. 当前文档问题诊断

旧06未固定状态集合，易将localAccepted和安装/付款混淆。06不能改03矩阵。PG验证必须实际多连接/真实commit，不用test总事务自动rollback掩盖atomicframe；SQL锁不能证明跨owner原子撤销。

## 5. 改动前后对比

| 前 | 后 | 原因 |
|---|---|---|
| 状态可回放口号 | 14enum/222pair/guard/effect完整参数化 | R/S也需要证据 |
| 只验最终row | 每写点fault/frame/完整结果/责任 | 防部分commit与丢责任 |
| timeout重试 | 原intent/probe/currentgate | 不双effect或伪notcommit |

## 6. 设计取舍

采用03完整矩阵为唯一authority，06只声明必须验证的allpair与关键否决条件，14carrier独立review；不把API/adapter姿态/HTTP/ReadSurface当生命周期。采用actual PGframe/CAS/as-of验证；未采用fake作PG证明或全局测试rollback。九Tx切口按key→frame→A/B→race→page→projection→责任→恢复→记录持久规则小循环。

## 7. 结构化中间产物

14状态主语的enum/触发来源、风险取舍、condition/副作用、TC/EV/path/裁决及独立停审在[完整state reviews](06_acceptance_step_08_state_reviews.md)，U1-U4/U5-U7分批回核。统一TC-CROSS-012→EV-DOMAIN-027（factory/rehydrate）和TC-CROSS-013→EV-DOMAIN-028（222pair）都是每carrier必选，业务证据不能替代全pair。

report唯一规则沿Step5§7；每pair manifest显式完整carrier/from/to/A-S-R/guard子例与actualassertions，不以73/51/98计数代替身份集合。非法迁移失败输入自身被正确拒绝可为TCpass，产品实际进入非法状态才finding；无actualrun不赋verdict。

### 7.1 九一致性项独立小循环

每行先风险取舍、正式契约/trigger，再通过失败/副作用/证据/裁决及停审；全项P0，失败不通过候选，若伪外部结果/篡history/撤回复活按五VETO。report由本节固定规则逐EV展开。

| GT/AC | 风险取舍/正式契约和触发 | 通过条件/必选副作用 | 失败条件 | TC→EV / 独立停审 |
|---|---|---|---|---|
| GT-MP-T01 / AC-MP-G02/103/403 | 03Step13/33DTO/exactkey；采用sealed全business、拒任意JSON/assetdigest自产 | kind/scope/exactUTF8key，canonicalv1+0x00+JCS/SHA256；整数decimalstring/null/tagvalue/Set排序拒dup、targets保序；同intent原result/异IdempotencyConflict；hint不改 | 漏业务字段/normalizekey/metadata或ownerfreshref影响fingerprint/重复新effect | TC-CROSS-001/002→EV-UNIT-001/002；TC-RECOVERY-001/002→EV-RECOVERY-001/002；design-stop/pass |
| GT-MP-T02 / AC-MP-G02 | 03Step11/每21C/12J A/B写点；采用actualPGframe/CAS，拒非事务sequence/test全rollback | RW READCOMMITTED持frame锁至终局、key→publisher→version；RO REPEATABLEREAD READONLY；rollback不露高cursor；revision0/Exactr→r+1与返回镜像；fault全部同frame写集回滚 | 部分facts/history/work/context/audit/fullresult/Completed、frame/cursor越低未终局Tx、CAS溢出不拒绝 | TC-CROSS-003/015→EV-PG-017/019；design-stop/pass |
| GT-MP-T03 / AC-MP-203/403/504 | 03JobA/B及原checkpoint/permission；采用formalprobe-first，拒timeout当notcommit | A未KnownCommitted零effect；SQL外effect；B新load/CAS/frame；originalfullreport不足旧Reserved，正式Reconcile另报告；Unknown/no-probe续责 | 原A对象/游标覆盖B，blindsend、receiptproof补造fullreport、丢checkpoint | TC-REVIEW-006→EV-DOMAIN-012；TC-DISTRIBUTION-006→EV-WORKER-006；TC-RECOVERY-005/006→EV-RECOVERY-005/006；design-stop/pass |
| GT-MP-T04 / AC-MP-203/501/502/403 | 03Step13竞争/late；采用publisher→version锁与实际commit两顺序 | 处置/release先commit禁新准入/许可；许可先commit保actuallatebinding，所有适用disposition更新+增量责任同B；Cancel不删Confirmed | 处置后新发、late丢失、只更新一disposition/预算截断complete、远端假rollback | TC-CROSS-016→EV-PG-020；TC-DISTRIBUTION-007→EV-WORKER-007；TC-WITHDRAWAL-005→EV-DOMAIN-021；design-stop/pass |
| GT-MP-T05 / AC-MP-302/303/G03 | 03PageReadContext/seven caller/sixpositions；采用as-of+currentfilter，不令token授权 | Search/GetListing/ListVersions/ListCategories/DistributionProgress/WithdrawalImpact/MarketAudit；actor/delegate/selector/scope/filter/sourceconstraint/upper/after完整绑定，frame/tag/typedPK稳定；count/items/token同谓词，同frame多PK不漏 | 非法family/hiddenanchor/换identity/filter接受、漏页/重页/hiddencount/token、来源失效假Empty | TC-CROSS-017→EV-PG-021；TC-CROSS-004→EV-PG-018；design-stop/pass |
| GT-MP-T06 / AC-MP-303/504/G02 | 03U7完整plan/manifest/snapshotpair/fourkind；采用committed facts，拒旧indextruth | everyrequiredkey一次Rendered/Omitted，body/manifest/state原子Fresh；Catalog/Progress/Impact/Audit独立依赖highwater，selfmaintenance排除；源变化Stale | 部分Fresh/空required、body丢失仍Fresh、unrelatedcursor无故Stale/O递归、ownertruth反写 | TC-REFERENCE-001/003/004/005/006→EV-PG-011/013/014/015/016；design-stop/pass |
| GT-MP-T07 / AC-MP-G02/G03/504 | 03workclaim/fence/O-P inventory；采用durablesuccessor，拒lease重发 | 同work/contextfence/plan，claim赢家唯一；expiry新fence只原probe；21C+8JO，Recovery只P，Obs2/Rebuild无O/P；Settled有fullreport/无悬空或explicit successor | wrongfence覆盖、新第二intent、shutdown丢A/permission、递归审计、假Settled | TC-CROSS-019→EV-WORKER-021；TC-CROSS-015→EV-PG-019；TC-RECOVERY-010→EV-RECOVERY-010；design-stop/pass |
| GT-MP-T08 / AC-MP-302/G02/504 | 03readonly/有限恢复；采用wholeoriginal/currentdisclosure，拒重新freshgate重放 | 全16Q/33replay九counter零；current能披露全部原payload才原样返回，否则整体拒绝；Recovery有限target不recursive，不改source/history | Query/replay写入/裁原payload冒原result/用currentview补缺report/Recovery任意SQL | TC-CROSS-005→EV-API-001；TC-RECOVERY-004/005→EV-RECOVERY-004/005；design-stop/pass |
| GT-MP-T09 / AC-MP-G02/502 | 03Step11全部PK/UK/FK/append/Row，category/noticebusinessUK；采用RESTRICT/validatedrehydrate，不delete/upsert | immutable同ID异payload拒绝；FK本地RESTRICT无跨ownerFK，unique/CAS精确错误；context/result/checkpoint/plan/permissionpaired完整；无TTL/GC权限 | rawrow绕factory、业务UK冒idempotency、CASCADE删history/Unknown职责、缺pairedstore | TC-CROSS-012→EV-DOMAIN-027；TC-CROSS-015→EV-PG-019；TC-CATALOG-003→EV-PG-003；TC-WITHDRAWAL-006→EV-DOMAIN-022；design-stop/pass |

### 7.2 跨状态与事务审计

14exactenum/pairs与九Tx不重复authority；S不是retry-all，非法pair/currentgate/error遵03。每写点fault/每race顺序/全库存参数化，PG项actual PG，fake只flow。Bcursor用于late事实与责任，已固定upper的旧报告不可覆盖；kindhighwater排除selfmaintenance。33canonical与16Q/replay、七page、O/P数量和fullreport规则齐备；factory外部资格未伪造，0Event/outbox/Billing/Archive。

## 8. 回填草稿

正式§8采用14carrier完整enum/矩阵来源及九Tx门禁、同runTC/EV/report与exactstate/错误规则，所有测试是未来实际required。必须同时验证allowed/illegal/selfpair、condition refs、原子写集/原fullresult/真实late责任、actual PG与全readonly。

## 9. 待确认事项

actualPG/driver/lock/JCS/MSRV/资源与ownerprobe资格均待实施验证，Q-MP-01frame吞吐/预算不在本轮编数。恢复只有限target，不使用Archive或Billingauthority。

## 10. 进入下一步条件

自检：14carrier独立停审/222pair/73A/51S/98R与九Tx/全33DTO/七page/完整副作用闭环；无幽灵state/跨ownerTx/未来phase结果。Step8设计pass；下一读SOP Step9/规范5.9、00全部17NFR、05Step10与04姿态；无commit。
