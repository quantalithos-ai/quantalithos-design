# Step 5：定义功能验收门禁

## 1. Step 状态

SOP Step5/规范5.5；正式§5；completed/selfcheck_done/stop_review；gate_status=pass（设计）；gate_reason=16业务AC独立停审与跨项审计完成，四G已分配；next_allowed_action=Step6数据架构红线。

### 1.1 Step 内计划

| 项 | 状态 | 产物 |
|---|---|---|
| 读取输入 | done | §2 |
| 问题回答 | done | §3 |
| 诊断 | done | §4 |
| 取舍 | done | §6 |
| 逐AC结构化 | done | §7/独立item reviews |
| 复杂度/附录 | done | 拆16项review，不混专项 |
| 回填草稿 | done | §8 |
| 逐项及跨项自检 | done | §10 |

## 2. 本步输入

source_files：[Step4](06_acceptance_step_04_entry_exit.md)及其scope/缺口；00§14二十AC/五VETO，03§5/7/8/9及七U规范性对象/协议/flow/state，05Step5完整正反映射、Step6全部98TC与EV。沿00 canonical AC，不另造AC编号；专项GT只内部细分。

## 3. SOP 问题回答

| 问题 | 回答 |
|---|---|
| P0通过？ | 每项须符合正式current gate/typed结果/不可变引用/局部责任；正负完整required子例。 |
| P0失败？ | 漏gate、错binding/终态/原结果/责任或资格证据缺失；在actual审查中不通过，命红线按VETO。 |
| 证据？ | 下表完整TC/EV双射、同run EV MD/JSON→suite raw/report→全部required子例。 |
| P1？ | 无新增P1功能；纯非P0微调只按Step12/13真实残余，不降级98TC。 |
| 哪些失败总体不通过？ | 16业务及4全局均P0，任一未满足禁止通过；VETO触发总体必不通过。 |
| 闭环可反查？ | 每项review给03U/入口/字段与05正反TC/EV/report，资格上限随scope。 |
| 单项停审？ | item reviews逐项思考/取舍→设计→证据→条件→裁决→独立停审，仅设计自检。 |
| 跨项冲突？ | C1资格不代C2批准、C2匹配不代上架、C3选择不建分发、C4Confirmed非安装、C5Complete非全安装；最后交叉审计。 |

## 4. 当前文档问题诊断

旧06§4十个commerce条目不是当前AC；05只提供测试过程断言，06需转换成scope内裁决。CreateListing无需approved，Draft无basis，MatchedDecision可rejected，RecordReceiver/NoticeOutcome仅formal Confirmed；这四处若误写会改变03业务规则。

## 5. 改动前后对比

| 前 | 后 | 原因 |
|---|---|---|
| 笼统publish/install/pay成功 | 16AC逐项可失败条件 | 不引入外部truth |
| 主smoke一个成功代表全部 | 每项全required证据+专项P0 | CROSS-023只是最小闭环 |
| ACK/材料齐全推上架 | Gov fullbinding/current approved | 正式决定唯一authority |

## 6. 设计取舍

采用每AC独立review和同run正反证据，16业务项先闭口，四G项分配后续专项。未采用将所有49接口当新业务AC：接口是实现裁决子门禁，须回指现有20AC，不能变05schema枚举。

## 7. 结构化中间产物

16项按101/102/103→201/202/203→301/302/303→401/402/403→501/502/503/504独立执行，全部P0。完整思考/取舍/设计/通过失败/证据/裁决/停审见[16项规范性review](06_acceptance_step_05_item_reviews.md)，C1-C2/C3-C4/C5分批完成后跨项审计，无预填运行pass。

所有门禁证据统一固定关系：`reports/runs/<run_id>/evidence/<完整EV-ID>.md`配对`artifacts/test/<run_id>/evidence/<EV-ID>.json`，回同run `evidence-index.md`与05指定主suite report/全部required raw。后续表中TC/EV明确完整ID，路径由此唯一展开，绝不使用latest/跨run/代表子例。

| AC/P0场景 | 通过/失败边界摘要 | 正式设计 | 正反主TC→EV |
|---|---|---|---|
| AC-MP-101 来源责任 | exact资格；伪主体/跨scope不通过 | 03U1/SourceGatePolicy | TC-SOURCE-001→EV-DOMAIN-001；TC-SOURCE-005→EV-DOMAIN-005 |
| AC-MP-102 材料基线 | 正确kind/有效refs；缺口不伪Qualified | 03U1/2/MaterialReference | TC-SOURCE-003→EV-DOMAIN-003；TC-SOURCE-004→EV-DOMAIN-004 |
| AC-MP-103 失败重试 | safe gap/原结果；异intent/Query写入不通过 | 03U1/6 | TC-SOURCE-006→EV-DOMAIN-006；TC-RECOVERY-002→EV-RECOVERY-002 |
| AC-MP-201 受控上架 | current formal approved/fullbinding；其他不可List | 03U2/3/VersionAdmissionPolicy | TC-CATALOG-005→EV-PG-005；TC-CATALOG-006→EV-PG-006 |
| AC-MP-202 决定边界 | rejected可MatchedDecision不可上架；ACK非批准 | 03U2/GovernanceDecisionBinding | TC-REVIEW-007→EV-DOMAIN-013；TC-REVIEW-008→EV-DOMAIN-014 |
| AC-MP-203 上架竞争 | 原完整结果/真实late责任；撤回复活不通过 | 03U2/3/5、Tx | TC-REVIEW-010→EV-DOMAIN-016；TC-CROSS-016→EV-PG-020 |
| AC-MP-301 目录发现 | 五type、多listing/version、currentfilter；错身份/泄漏不通过 | 03U3/7 | TC-CATALOG-007→EV-PG-007；TC-CROSS-004→EV-PG-018 |
| AC-MP-302 可见只读 | 隐藏无存在性/全Query-replay零写；旁路不通过 | 03U3/7/readonly | TC-CATALOG-010→EV-PG-010；TC-CROSS-005→EV-API-001 |
| AC-MP-303 版本读取 | exact版本/stable page；fallback/隐藏token不通过 | 03U3/PageReadContext | TC-CATALOG-009→EV-PG-009；TC-CROSS-017→EV-PG-021 |
| AC-MP-401 受控获取 | full current gate才local intent；免费/撤回绕gate不通过 | 03U4/AcquisitionGatePolicy | TC-DISTRIBUTION-002→EV-WORKER-002；TC-DISTRIBUTION-009→EV-WORKER-009 |
| AC-MP-402 接收结果 | formal Confirmed exactbinding；ACK/installed/paid不通过 | 03U4/ReceiverOutcomeBinding | TC-DISTRIBUTION-005→EV-WORKER-005；TC-DISTRIBUTION-008→EV-WORKER-008 |
| AC-MP-403 失败重试 | 原intent/probe/late责任；双effect/盲重试不通过 | 03U4/Job A-B | TC-DISTRIBUTION-003→EV-WORKER-003；TC-DISTRIBUTION-007→EV-WORKER-007 |
| AC-MP-501 撤回停发 | Withdrawn终态独立于通知；复活/新分发不通过 | 03U5/4 | TC-WITHDRAWAL-002→EV-DOMAIN-018；TC-WITHDRAWAL-008→EV-DOMAIN-024 |
| AC-MP-502 影响通知 | known scope完整/late回Partial；假送达不通过 | 03U5/ImpactRecord/NoticeIntent | TC-WITHDRAWAL-004→EV-DOMAIN-020；TC-WITHDRAWAL-005→EV-DOMAIN-021 |
| AC-MP-503 安全审计 | 原auditset/脱敏/非evidence；泄漏/伪交接不通过 | 03U6/Observation | TC-RECOVERY-007→EV-RECOVERY-007；TC-RECOVERY-009→EV-RECOVERY-009 |
| AC-MP-504 受控恢复 | 原probe/fullreport、新B、truth重建；补成功/反写不通过 | 03U6/7 | TC-RECOVERY-006→EV-RECOVERY-006；TC-RECOVERY-005→EV-RECOVERY-005 |

| 全局AC | 通过/失败条件与主TC→EV | 后续主裁决 |
|---|---|---|
| AC-MP-G01 | 全入口trusted scope/body-free；TC-CROSS-007→EV-API-002、TC-CROSS-006→EV-REDACTION-001；旁路/泄漏必阻断 | Step6/7/10/11 |
| AC-MP-G02 | 同frame facts/history/work/result+原replay；TC-CROSS-015→EV-PG-019、TC-CROSS-003→EV-PG-017；部分commit/原结果重造阻断 | Step7/8/10 |
| AC-MP-G03 | fixedupper/batch/lease/continuation；TC-CROSS-017→EV-PG-021、TC-CROSS-019→EV-WORKER-021；无限等待/假complete阻断；容量候选不算SLO | Step8/9 |
| AC-MP-G04 | actual Web默认En/切Zh/ref-key-state不变；TC-CROSS-008→EV-WEB-001、TC-CROSS-021→EV-WEB-002；译义/按钮伪资格阻断 | Step7/9 |

失败影响：每行P0未满足禁止授予通过，actual审查不通过；命中五VETO从Step11优先裁决。未送验没有实际失败verdict，formal缺资格不由expected negative pass关闭。

跨项设计审计：16业务项各自停审、4全局专项分配、sameEV可复用支持但不重复计数、五能力不互代、无P1污染/幽灵对象/口语enum；完整审计表见附录末节。全98无孤儿还须Step10完成，不能以本表正反代表覆盖全部。

## 8. 回填草稿

正式§5候选采用本节16业务AC门禁与四G分配；完整独立review为规范性附录。全项P0、通过失败/设计/TC/EV/report/裁决明确，无实际结论列预填；actual审查须同时满足后续专项与五VETO。

## 9. 待确认事项

MP-UP source/publisher/material/Gov/receiver/notice/Obs positive保持blocked/pending；local参数化只证明formal typed合同的本地消费，不说明实际approval/install/payment/delivery。没有实际测试或verdict。

## 10. 进入下一步条件

自检：16canonical业务AC与四G集合等于00二十AC，正反TC/EV沿05映射，16独立停审/跨项审计齐备，fullscope与actual资格未冒充。Step5设计pass，下一读SOP Step6/规范5.6、01ownership/依赖、03持久化/readonly、04禁止配置项；不提交。
