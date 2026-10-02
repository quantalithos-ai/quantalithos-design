# Step 9：非功能验收门禁

## 1. Step 状态

SOP Step9/规范5.9；正式§9；completed/selfcheck_done/stop_review；gate_status=pass（设计）；gate_reason=17项独立停审/阈值来源及跨项审计完成；next_allowed_action=读取Step10证据归档输入。

### 1.1 Step 内计划

| 项 | 状态 | 产物 |
|---|---|---|
| 读取前序/输入 | done | §2 |
| 问题回答 | done | §3 |
| 诊断 | done | §4 |
| 取舍 | done | §6 |
| 逐NFR结构化 | done | §7 |
| 复杂度/独立停审 | done | 主控内17项小循环，无新TC/EV |
| 草稿 | done | §8 |
| 跨项审计 | done | §10 |

## 2. 本步输入

source_files：[Step8](06_acceptance_step_08_state_tx_consistency.md)及state reviews的问题/诊断/取舍/待确认；[00§13](../00-需求文档.md#13-非功能需求)、[05逐需求正反映射](05_test_plan_step_05_traceability_coverage.md)、[98用例](05_test_plan_step_06_cases.md)、[05非功能专项](05_test_plan_step_10_nonfunctional.md)、03§10～15、04六域/七字段/八slot/四profile。前序的14carrier/222pair/actual PG和十二外部缺口继承。

## 3. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 哪些指标P0？ | 17NFR的安全、原子/幂等、可判别读取、有限维护/等待、恢复和locale语义均为P0；容量数字未定义，不虚构P0数字。 |
| 阈值来源？ | 00§13/BR/VETO与03规范性flow/state/frame/canonical/page/config/安全字段；是明确二元不变量。配置实值在未来run冻结，不是生产SLO。 |
| 哪些专项未覆盖？ | 设计已指定17项正反TC/EV，但全部未执行；actual容量/通知送达率/生产保持期等Q-MP-01未闭合。local受控负例不能证明formal positive。 |
| 哪些失败阻发布？ | 本scope任一P0断言/required子例缺失或失败、泄漏/伪approval/越scope/伪财务/复活历史均阻通过；后者按五VETO，不风险接受。 |
| 证据来自哪里？ | 05指定主suite全部required raw与report→同run完整EV JSON/MD→evidence-index；实际PG不能用fake，Web应有browser实际结果。路径沿Step5§7。 |

## 4. 当前文档问题诊断

旧06无来源P95<200ms不可继承；“日志有输出”不能证明local audit或formal owner acceptance。“未执行进入风险”应理解为必须列遗留，不是允许未测P0有条件通过。安全拒绝本身可为负例TC通过，实际产品绕过才是finding。

## 5. 改动前后对比

| 前 | 后 | 原因 |
|---|---|---|
| 非功能泛化或无依据数字 | 17逐项NFR、阈值来源、正反TC/EV、失败裁决 | 可复查，不创造生产承诺 |
| 未测等已接受风险 | 未测P0阻通过；非P0残余只能由正式authority接受 | 不越过门禁 |
| 容量趋势计入98EV | capacity-candidate独立raw sample，未分配正式EV | 不能以趋势替P0 |

## 6. 设计取舍

采用既有NFR ID为门禁identity，回指canonical AC；不新增GT或质量机器enum。每项先风险/取舍，再指标/通过失败/阈值来源/正反证据/裁决/停审。未采用代表性安全TC替全17项，也不新增未定义SLO、送达率、retention、metric或config字段。容量硬化必须回Q-MP-01 authority及00～06受控变更。

## 7. 结构化中间产物

### 7.1 逐项风险取舍与硬条件

各行都是独立小循环；ID省略共同NFR-MP-前缀，AC列省略AC-MP-前缀。阈值是未来断言的硬条件，不是已有测量。“全部/零”指冻结required集合的断言，不是生产100%或可用率承诺。

| NFR / AC | 维度/风险与取舍 | 指标要求/通过条件 | 阈值及正式来源 | 失败条件/裁决 |
|---|---|---|---|---|
| 101 / 102,G01 | 安全；采用typed refs/safe摘要，拒复制正文 | owner/version/digest/visibility/mapping保原值，material仅ref；capture无body/secret或隐藏存在性 | 零禁止内容；00§13/BR101/504、03U1/§14/15 | 任一复制/泄漏P0，VETO1；不能靠脱敏报告掩盖runtime泄漏 |
| 102 / 101,103,G02 | 幂等；采用exact intent，拒role hint作authority | 同key/context/business逐字段原result；异意图IdempotencyConflict，旧来源/责任不覆盖 | 全业务字段与exactkey；03Step13/33DTO | 漏字段、规范化key、第二effect或改历史P0，适用VETO5 |
| 103 / 103,303 | 可用性；采用显式gap，拒缓存冒Qualified | 缺失/不可见/陈旧/不支持/timeout可区分；旧safe材料current不可见不返回 | 03U1/U7 ReadSurface/ErrorCode与snapshot pair | 错Qualified、假Empty、泄漏旧材料P0，适用VETO1/3 |
| 201 / 201,203,G02 | 一致性；采用Submit freeze及publisher→version锁 | application/basis/work一次同Tx，当前fullgate才List；withdraw/release先commit阻新许可 | 03U2/U3/Step11/13两个commit顺序 | 第二basis/上架或处置后准入P0，适用VETO2/5 |
| 202 / 202,203,503 | 审计；采用完整report和原checkpoint，拒ACK冒决定 | Draft无basis正常，Submitted缺本体IntegrityFailure；外部unknown不List且保续责 | 03U2/U6 fullreport/A-B/O规则 | 缺原报告仍Completed、缺责任或伪approval P0，适用VETO2/5 |
| 301 / 301,303,G03 | 性能；采用有界page，拒无依据延迟SLO | 明确filter/limit/upper/after，七caller绑定；items/count/token同current谓词，actual PG稳定分页 | 03PageReadContext/配置冻结实值；00§13无毫秒阈值 | 无限扫描、漏/重页、count/token不一致P0；泄漏命VETO3 |
| 302 / 302,G01 | 安全；采用同scope/currentfilter，拒stale授权 | search/detail/versions/categories及资格同authority；NotVisible整体无ref/count/token | 03U3/U7、Step12/13/14 | 读取面扩大scope、缓存授准入P0，VETO3 |
| 303 / 303,504 | 可判别；采用实际pair与state，拒Fresh空壳 | Fresh/Stale/Rebuilding/Unavailable及Missing/NotVisible/Degraded精确；manifest缺body IntegrityFailure | 03U7/fourkind/完整plan | 缺pair当Fresh、源失败当Empty、Query自refresh P0 |
| 401 / 403,G02 | 幂等；采用原完整receipt，拒重复新relation | 同intent回同relation/attempt/result、九counter零；异target/version/receiver/scope精确冲突 | 03U4/Step13及canonical sealed集合 | 第二ID/work/effect、改变原结果或Unknown重发P0，适用VETO4/5 |
| 402 / 402,403 | 审计/可用；采用formal binding，拒Accepted冒commit | exact intent/attempt/version/consumer/receiver/scope；Confirmed/Failed/CommitUnknown/Blocked分开，progress只读 | 03U4 formal outcome/probe A-B | ACK当Confirmed、Confirmed当Installed/Paid、漏unknown责任P0，适用VETO4/5 |
| 501 / 501,502 | 一致性；采用固定upper+增量，拒全安装覆盖承诺 | known本地Relation+Attempt完整一次，late回Partial；notice原intent probe-first、去重 | 03U5 ImpactCoverageKind/NoticeIntent矩阵 | 截断complete、blind resend、通知失败回滚withdraw P0，适用VETO5 |
| 502 / 502,503 | 审计/安全；采用状态分轴，拒local计划冒送达 | local disposition/coverage/notice external结果各可查；safe六字段currentfilter，Q零写 | 03U5/U6/Step15 | 混Unknown与已送达、body泄漏或audit自写P0，适用VETO1/4/5 |
| 503 / 501,504 | 可恢复；采用原probe与finite target，拒恢复复活 | no-probe保Blocked责任；shutdown停新claim，保checkpoint/permission，新B frame/CAS | 03U5/U6/Step12/13 | 改ownertruth/history、复活Withdrawn、旧fenceSettled或强判notcommit P0，VETO5 |
| G01 / G01,101,202 | 全入口安全；采用Core与正式owner authority，拒配置skip | Web/API/Worker/public/org/恢复同authority；八slot姿态不可自证Bound | 03§14/04严格配置与四profile | caller自填verified/approved、fake production、配置绕gate P0，适用VETO1～4 |
| G02 / G02 | 全局一致性；采用actual PG同frame，拒跨owner事务 | 每21C/12J写点fault、完整result/context/audit/work/O-P同规则；C rollback/A确认/B新load | 03Step11/15及05全写点manifest | 部分commit、丢许可、伪完成、O递归、history篡改P0，适用VETO5 |
| G03 / G03,502,504 | 有界可用；采用明确batch/lease/continuation，拒预算截断 | query/claim/impact/projection/owner等待有界；超界safe失败/完整续责；停分发不等全部通知 | 03有限flow/04validator，未来run实值；无产能SLO | 无限阻塞、超预算假Complete、过期lease盲发P0 |
| G04 / G04 | 体验真实性；采用展示locale，拒其改变intent | 初次En，全页面词/状态可切Zh/En；ref/enum/key/fingerprint不变，处理中不重复submit | 00§13、04default_locale、03Web protocol | 状态漏词/混成功/按钮绕资格、伪预览/评分或locale重发P0 |

### 7.2 逐项证据与独立停审

每行正反均必选且包括05§7.1完整required子例，不是任选一侧。report固定为 `reports/runs/<run_id>/evidence/<EV-ID>.md`，JSON为 `artifacts/test/<run_id>/evidence/<EV-ID>.json`，回同run index及05主suite全部raw/report。以下design-stop/pass只证明门禁设计；全部运行not-run。

| NFR | 正向TC → EV | 反向TC → EV | 主要证明层/独立设计停审 |
|---|---|---|---|
| NFR-MP-101 | TC-SOURCE-003 → EV-DOMAIN-003 | TC-CROSS-006 → EV-REDACTION-001 | service/capture；风险/来源/条件/证据/裁决已核，design-stop/pass |
| NFR-MP-102 | TC-SOURCE-001 → EV-DOMAIN-001 | TC-RECOVERY-002 → EV-RECOVERY-002 | service/replay；design-stop/pass |
| NFR-MP-103 | TC-SOURCE-006 → EV-DOMAIN-006 | TC-REFERENCE-002 → EV-PG-012 | service/actual PG；design-stop/pass |
| NFR-MP-201 | TC-REVIEW-003 → EV-DOMAIN-009 | TC-CROSS-016 → EV-PG-020 | service/actual PG竞争；design-stop/pass |
| NFR-MP-202 | TC-REVIEW-010 → EV-DOMAIN-016 | TC-REVIEW-006 → EV-DOMAIN-012 | service/infra fault；design-stop/pass |
| NFR-MP-301 | TC-CATALOG-007 → EV-PG-007 | TC-CROSS-017 → EV-PG-021 | actual PG七page；design-stop/pass |
| NFR-MP-302 | TC-CATALOG-010 → EV-PG-010 | TC-CATALOG-008 → EV-PG-008 | actual PG；design-stop/pass |
| NFR-MP-303 | TC-REFERENCE-006 → EV-PG-016 | TC-REFERENCE-004 → EV-PG-014 | actual PG完整projection；design-stop/pass |
| NFR-MP-401 | TC-DISTRIBUTION-003 → EV-WORKER-003 | TC-DISTRIBUTION-004 → EV-WORKER-004 | Worker/typed fake；design-stop/pass |
| NFR-MP-402 | TC-DISTRIBUTION-005 → EV-WORKER-005 | TC-DISTRIBUTION-010 → EV-WORKER-010 | Worker/typed fake；design-stop/pass |
| NFR-MP-501 | TC-WITHDRAWAL-004 → EV-DOMAIN-020 | TC-WITHDRAWAL-008 → EV-DOMAIN-024 | service/fault，PG补层沿05；design-stop/pass |
| NFR-MP-502 | TC-RECOVERY-007 → EV-RECOVERY-007 | TC-WITHDRAWAL-010 → EV-DOMAIN-026 | audit/replay/service；design-stop/pass |
| NFR-MP-503 | TC-RECOVERY-006 → EV-RECOVERY-006 | TC-RECOVERY-010 → EV-RECOVERY-010 | recovery/checkpoint/shutdown；design-stop/pass |
| NFR-MP-G01 | TC-CROSS-007 → EV-API-002 | TC-CONFIG-012 → EV-CONFIG-012 | entry/config；design-stop/pass |
| NFR-MP-G02 | TC-CROSS-015 → EV-PG-019 | TC-CROSS-003 → EV-PG-017 | actual PG写点/CAS/frame；design-stop/pass |
| NFR-MP-G03 | TC-CROSS-017 → EV-PG-021 | TC-CROSS-019 → EV-WORKER-021 | actual PG/Worker；design-stop/pass |
| NFR-MP-G04 | TC-CROSS-008 → EV-WEB-001 | TC-CROSS-021 → EV-WEB-002 | browser/API DTO，CONFIG-011补层；design-stop/pass |

### 7.3 容量candidate与未执行口径

Q-MP-01只允许未来获准范围测量：显式run/hardware/PG与extension/数据规模及分布/scope/type/page/batch/lease、冷暖cache、并发/持续时间、raw samples，区分owner等待和本地SQL。报告只sample/trend，当前无实际值/正式EV/生产SLO。阈值需正式authority和受控回源00～06，不能失败后降阈值或缩scope。

未测P0一律阻授通过，不进入可接受残余；非P0 candidate未执行登记遗留、承接Step13但不伪称接受。若送验或生产发布范围需要容量资格，它成为该范围blocker，不能因为当前未定数值而默许上线。formal positive及safe producer缺口另按十二开放项，不由local捕获证明关闭。

## 8. 回填草稿

正式§9采用17NFR门禁、正反TC/EV、阈值来源、失败影响和capacity-candidate分层。硬指标无来源数字，全部required参数化实际执行后才授通过；未测P0不能风险接受。locale仅展示，审计、来源与外部unknown事实不能被UI或report改写。

## 9. 待确认事项

Q-MP-01容量/通知SLO/保留授权、actual PG/driver/MSRV/JCS兼容、受影响owner/auth/SDK/producer资格待实施；不提供测量数字、默认预算或真实authority名字。十二开放项不关闭。

## 10. 进入下一步条件

跨项审计：17NFR逐项问题/风险取舍/条件/正反TC-EV/report/失败裁决与独立停审齐备；canonical AC未扩展、05库存和profile未改变、actual PG/fake/browser证明上限分开。capacity不计98P0；未测P0与合法非P0残余不混。Step9设计pass，下一读SOP Step10/规范5.10、05Step13完整schema/98EV/六checks两stage及03观测；不提交commit。
