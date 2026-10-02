# Step 14：回归策略与残余风险

## 1. Step 状态

2026-10-02；full-restart / single-agent；completed / selfcheck_done / stop_review；`gate_status=pass`（回归/风险设计）。输入Step6/11～13与03§17；输出变更触发、证据失效传播、12保留开放项与local技术残余。没有风险接受/signoff或真实retest。

Step内计划：最小/全量触发→资格/risk authority→reopen传播→06/07承接审计；完成。

### Step内计划与门禁字段

| 计划项 | 状态 | 可审查产物/门禁 |
|---|---|---|
| 读取输入与前序结论 | done | §2；前序：05_test_plan_step_13_evidence.md（含诊断、取舍、未确认项） |
| SOP逐问题回答 | done | §3，回答所有适用问题 |
| 当前/历史材料诊断 | done | §4，不继承historical truth |
| 设计取舍 | done | §6，采用/未采用理由 |
| 结构化产物 | done | §7，来源/失败/证明上限闭合 |
| 复杂度判断 | done | 主控内分单元/表，无需新增业务附录 |
| 回填草稿 | done | §8；只候选，正式写入等Step15 |
| 自检/下一步 | done | §9/10，实际资格与运行结果不伪填 |

`gate_status=pass`；`gate_reason`=本Step设计审查完成，执行仍not-run；`next_allowed_action`=§10下一Step阅读/设计；`source_files`=§2列出的正式输入与前序文件。上述done不表示实际环境、测试、evidence或owner签核通过。

## 2. 本步输入

[Step6](05_test_plan_step_06_cases.md)、[Step11](05_test_plan_step_11_defects_retest.md)、[Step12](05_test_plan_step_12_entry_exit.md)、[Step13](05_test_plan_step_13_evidence.md)、[03§17](../03-详细设计.md)/[Step18](03_ddd_step_18_risks.md)、04风险；SOP Step14及书写规范§5.14。

## 3. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 最小回归？ | 变更→受影响TC/CUT主suite+redaction/依赖/coverage/schema，矩阵如下。 |
| 全量？ | shared schema/state/canonical/transaction/auth、S红线、owner contract/profile、工具/多U变化，送验前全11/98/全部subcase。 |
| 暂不覆盖？ | actual formal positive/生产SLO/retention/Billing/Archive/全安装通知覆盖，明确blocked/future，不能消失。 |
| 接受人？ | 正式owner/产品/运维/保留authority角色仅待确认，当前没有接受人签名；S与未通过P0不能风险接受。 |
| 转06？ | 证明scope、VETO、actual evidence requirements、外部qualification/gaps与candidate阈值；本轮不开始06。 |

## 4. 当前文档问题诊断

只按改动文件选少数case会漏metadata/DTO/状态/PG/索引/证据传播；上游局部“完成”不能等于Marketplace exactconsumer qualified。旧commerce范围不能以风险接受名义保留writer。

## 5. 改动前后对比

| 前 | 后 | 原因 |
|---|---|---|
| 单模块回归 | CUT/跨契约影响及证据失效范围 | 防相邻流程回归 |
| owner项目状态当资格 | exact type/operation/version/scope材料/原probe | 精确裁剪而非全仓不可用或伪ready |
| future算延期功能 | future须重开00/01后再设计 | 不偷渡交易/归档truth |

## 6. 测试设计取舍

采用最小回归加最终全量送验、旧evidence保留历史但失去新baseline适用性，不采用跨run挑选通过子集。对上游只裁剪受影响接缝，不根据缺少台账断言owner全仓不可用；也不根据台账07完成关闭正式consumer缺口。

## 7. 结构化中间产物

### 7.1 回归触发表

| 变更类型 | 最小回归集/切口 | 全量触发/证据失效 | 责任角色（未指派） |
|---|---|---|---|
| domain字段/factory/state | D+CROSS-011/012/013及该U TC | 任一shared/condition/terminal变更：全11suite；43对象/222pair重新展开 | 领域与测试维护者 |
| Request/result/ports/Core metadata | D/I/W+对应U、CROSS-005/007/014/018 | typed exported schema/authority改变：49协议/146method/33replay及全量 | SDK/契约与测试维护者 |
| canonical/page codec | D/P/W+CROSS-001/002/005/017、RECOVERY-001/002 | fingerprint version/token/ref身份改变：全量，旧result decoder/原replay仍测 | 应用/存储维护者 |
| PG schema/CAS/frame/历史/锁 | P+R、CROSS-003/015/016/017 | 所有持久化或A/B语义改变：实际PG全切口+全量；fake无替代 | 存储/应用维护者 |
| current owner/SDK qualification | I/S/W/R+受影响五类/槽位 | source/binding/current authority/probe支持变化：受影响positive重开03/04/05/06/07，送验全量 | 正式owner/SDK authority待确认 |
| Worker/Unknown/late/恢复 | W/R+REVIEW-006/DISTRIBUTION-006/007/010/WITHDRAWAL-005/008 | claim/fence/checkpoint/permission/fullreport/late责任共享改变：全量 | Worker/恢复维护者 |
| index/search/分类 | P/S+CATALOG、REFERENCE、CROSS-004/017 | projection kind/highwater/visibility/manifest变化：全量；证据跨kind不可用 | 查询/存储维护者 |
| config/profile/provider | C/W/B+CONFIG全部/CROSS-009/022 | 七字段/八slot/newprofile/secret/bypass改变：先回03/04，再全量 | 配置/安全authority待确认 |
| Web DTO/locale/workflow | B/C+W schema映射 | 按钮资格/状态/ref/key改变：业务族与红线，shared wire变化全量 | Web/API维护者 |
| gate/check/report schema/runner | E/X+6checks/4reports，CROSS-010 | 输出格式/摘要/路径/registry/selection/成熟度变化：全部EV受影响，fresh全量run重新生成 | 测试工具/证据审查者 |
| DS/builder/seed/fault harness | 关联主TC与CUT+E coverage | inventory/guard/fault时序/并发隔离变化：全参数化与全量，旧EV不得复用 | 测试数据维护者 |
| Billing/Archive/event/new内容范围 | 当前禁止依赖负例CROSS-020/CONFIG-012 | 先用户受控确认00/01，再02～07 full变更；不得直接加fake positive | 项目与正式新增owner待确认 |

### 7.2 十二项保留ID（本地调查项，不是owner受理单）

| ID/状态 | 未覆盖原因/影响 | 缓解/测试上限 | 确认authority/接受人 | 重开 |
|---|---|---|---|---|
| MP-UP-001 pending/affected | 五类immutable export/type/SDK qualification未闭合；source/submit/list/acquire/refresh | SOURCE/REFERENCE controlled mapping+fail-closed，no正文/digest自产 | Method/Hub/Images/Artifact+SDK，待确认/未接受 | 03受影响U/ports→04binding→05/06/07 |
| MP-UP-002 pending | Gov application/basis/version/material/scope/current决定+原probe | matched rejected不List、ACK/scan/signature非approval；REVIEW/CATALOG负例 | Governance+SDK，待确认/未接受 | 03U2/3/4→04/05/06/07 |
| MP-UP-003 owner待定 | human/org/auth/current scope资格；全入口/read/write/replay | SOURCE-005/CROSS-007/017 fail closed；Identity仅AI | human/组织/授权owner待定/未接受 | 00/01受控owner→03/04/05/06/07 |
| MP-UP-004 pending | material kind/适用/有效/安全摘要/Artifact与Gov消费规则 | typed材料ref/gap，不生成扫描/签名/包；SOURCE/REVIEW负例 | 安全材料/Artifact/Gov+SDK，待确认/未接受 | 03U1/2/3/4→04/05/06/07 |
| MP-UP-005 pending | exact receiver/intent/version/consumer/scope/materialization/outcome/probe | distribution局部/typed controlled，潜在commit无probe waiting，noinstalled/URL/包 | receiver各类型owner+SDK，待确认/未接受 | 03U4/5/6→04/05/06/07 |
| MP-UP-006 future/blocker | Billing/支付/订阅/分成/跨境无正式owner，当前0财务writer | CONFIG-012/CROSS-020禁止扩展；获取不paid | 财务/法律/产品authority待定/未接受 | 首先00/01范围，才02～07 |
| MP-UP-007 pending | disposition authority/knownreceiver/notice target/channel/receipt/probe | 停新分发独立，notice CommitUnknown/no送达阅读保证 | 处置/通知owner+SDK，待确认/未接受 | 03U4/5/6→04/05/06/07 |
| MP-UP-008 pending/affected | Obs producer/redaction/payload/receipt/probe与SDK；Archive无source lane | 21C+8J O责任仅本地、qualification Blocked；audit≠evidence | Observability producer/redaction+SDK，待确认/未接受 | 03U6/埋点→04/05/06/07；Archive先00/01 |
| MP-SRC-003 pending | draft TS/React与正式Rust/Vue口径，04标签差异 | 正式栈优先、prototype非真实验证；Step1记录标签冲突 | 用户受控draft/文档确认，待确认/未接受 | 仅获授权相关draft/受控标签核对 |
| MP-SRC-010 affected/pending | Gov formal/flow历史状态和缺台账，exactmarket binding未核验 | 按受影响contract failclosed，非owner全仓判失效 | Governance/SDK baseline authority，待确认/未接受 | exact来源审查→03/04/05/06/07 |
| MP-SRC-013 pending/future | MK2/ISO29110适用/Package owner/合规authority | 标签非compliance verdict，no自造包/正文 | 标准/材料/Package/合规owner待定/未接受 | 先00/01类型与范围，再相关下游 |
| Q-MP-01 pending | 容量/延迟/notice SLO/预算/retention/delete未测未确认 | correctness硬gate，fixedupper/continuation，capacity trend/no TTL GC | 产品/存储/运维/保留/法律authority，待确认/未接受 | 03预算→04profile→05/06阈值→07 |

### 7.3 本地技术残余与后续承接

03的R-MP-DDD-01～10保留：写帧吞吐、history/result增长、短ZH查询负载、canonical库/MSRV未运行、Unknown原report不足、许可与remote时间差、bounded维护数值、exporter与audit混同、privatefake/phase补面、文档误当ready。缓解分别由P/R/D/I/X/C/B/E计划验证，但实际未执行，不算风险关闭或接受。

| 消费者 | 必须承接 | 当前禁止 |
|---|---|---|
| 06 | scope/AC/VETO、actual same-run证据、12上游项、local残余、风险authority待定 | 把本地negative全部pass当formal集成成立/代签 |
| 07 | 每业务/配置/测试脚本/生成器成熟度边界+设计库存+全部planned/blocked/waiting skeleton | 本轮提前创建implementation ledger、commit、run/evidence或ready |
| 正式owner | exactconsumer/type/operation/version/scope/material/probe输入 | 本agent改owner文档/台账或关闭其资格 |

静态审计：12ID与03§17完整同名/同语义，local残余无遗漏；接受人全部待确认，不存在伪signoff。source变化需先owning Step再DTO/flow/state/SQL/index/config/TC/EV传播，不能以后写05覆盖03。

## 8. 回填草稿

正式§14收录回归矩阵、12开放项和local风险摘要、authority/重开传播。SOP问题/停审不入正式正文。

## 9. 待确认事项

上述全部未确认；当前05文档完成只设计收口。详细设计影响判定：无新增字段/状态/owner权限，未来新输入才受控回源；现有04 ID标签差异不改变契约，记录不擅自回修正式04。

## 10. 进入下一步条件

回归与风险可供未来06/07直接消费，设计门禁pass。下一读SOP Step15、书写规范15章主链、通则full-restart正式重建及中间产物§5.10，完成跨文档审计/三层装配门禁后才删除旧05、建骨架、分章装配；不提交commit。
