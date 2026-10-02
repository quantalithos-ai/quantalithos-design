# 02 Step 13：设计风险与待确认事项

## 1. Step状态

开工：用户已确认01并授权全部02；Step 13 completed，formal未装配。仅当前agent。

Step内计划：P1读取输入 → P2逐题回答 → P3诊断 → P4前后比较 → P5取舍 → P6结构化 → P7回填草稿 → P8自检/停审。P1～P8已分批完成。

模块门禁：本Step独立收束后才允许下一Step。

## 2. 本步输入

当前正式00§9～16、01§6～17；本Step对应SOP与书写规范。前一Step的问题回答/诊断/取舍/待确认事项：02_hld_step_12_ddd_handoff.md。旧02未作为推导依据。

## 3. SOP问题回答

1. 当前概要设计层已经明确构成风险、但尚未闭环的问题有哪些？

答：source/publisher/material/Govbinding、receiver/probe、noticechannel/Obsadmission缺口已明确；scope/projection/result/unknownrace有结构风险，控制已设计但实现未验证。

2. 当前还有哪些问题尚未形成定论，只能作为待确认事项挂起？

答：MP-UP001～008/SRC003/010/013、QMP01与Hubrepairanchor/Images/Obsaffected按受影响合同资格挂起。

3. 这些未闭环项分别会影响哪些主要部分、对象、接口、处理流、状态机或配置影响轮廓？

答：每项指定U/接口/flow/state或config影响，列ownerauthority候选、当前blocked姿态、关闭输入与02重开位置。

4. 哪些问题若不先收纳，后续详细设计会被误导？

答：formalAPI名称、freshsummary、原型/文档/fake误报integration/ready最易误导，必须明确阻断。

5. 哪些内容只是任务或优化项，不应被包装成设计风险或待确认事项？

答：HTTP库/ORM/界面细节是03任务而非risk；中文实测/SLO无依据则待确认，不虚构高风险数字或owner确认。

## 4. 当前文档问题诊断

01§15本地UP候选不可变为上游已确认blocker；Hub/Obs/Images台账当前状态不宜全仓blocked也不宜ready。Gov状态冲突未解决，schema/reference资格审查需要正式当前anchor。

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| open项 | 01候选清单 | 具体入口/对象/状态/配置影响与formalclosure/重开Step | 不把pending写成可实现positive |
| sibling状态 | 设计完成/repair/blocked不同层 | affectedconsumer按路径裁剪 | 不全局封死或假ready |
| tech/finance | 历史愿景 | 当前formal方向与futureowner要求 | 不越权反污染 |

## 6. 设计取舍

风险与pending分开，localstructure已设计不等ownerpositive可执行。只记录实际依赖路径与正式closure条件，不修改/通知owner，不fabricateapproval/evidence。

## 7. 结构化中间产物

| 风险 | 影响 | 当前处理口径 |
|---|---|---|
| R-MP-HLD-1 来源/认证/材料formal读取名称被误当资格 | U1/U2/U4；Bind/Verify/Submit/Request/Dispatch | Qualified输入由formalport核验产生，缺合同positive blocked；metadata和缓存不自授权 |
| R-MP-HLD-2 MatchedDecision/可读summary/scan/signature/ACK误当approved | U2/U3/U4；RecordGovernanceDecision/ListMarketVersion | 只Gov有效正式approved与完整binding准入，no local approval；MP-UP-002仍open |
| R-MP-HLD-3 搜索/数量/提示/版本/历史跨scope泄漏 | U3/U7全部query | resolver-first、visibility交集、scopeboundprojection、隐藏统一安全不可用；当前设计非已验证权限 |
| R-MP-HLD-4 localpermit到externalcommit的时间差被误称全球撤销 | U3/U4/U5；Request/Dispatch/Withdraw/RecordReceiverOutcome | 版本序列化只本地，许可前再查，旧许可known/unknownimpact、late增量；不承诺外部instantcancel |
| R-MP-HLD-5 claim过期/timeout盲重发或result只有receipt | U2/U4/U5/U6 | typed原intentprobe、完整storedcommand/jobresult、旧fence保护、known-not-committed才safe retry |
| R-MP-HLD-6 KnownScopeComplete/NoticeConfirmed/RecoveryCompleted/ProjectionFresh夸大 | U5/U6/U7 query/report | 明确本地carrier意义与外部outcome独立；不全安装/送达/ready/业务恢复推断 |
| R-MP-HLD-7 缺typedsidecar/plan用privatefake或opaque解析补 | U6/U7及全部savedbinding的后续flow | typed get/save/bykey、snapshot本体+state、nonemptytypedplan、完整逐itemreport；03强制schema/port闭环 |
| R-MP-HLD-8 历史TS/React/财务/包叙事反污染 | Web/API/Worker、未来package/Billing | 当前Rust/Vue与市场owner不变；draft仅讨论，不作为formal覆盖 |
| R-MP-HLD-9 文档自检/原型/fake包装implementationready | 全文/后续05～07 | 当前仅设计静态检查，无implementation/run/asset/digest/scan/payment/evidence/verdict/signoff/readiness |

以下是本地candidate/pending，不是owner已确认或已发送的外部blocker。关闭条件是后续正式输入要求，不表示本轮已有这些材料。

| 待确认 | 影响范围 | 当前挂起口径 |
|---|---|---|
| MP-UP-001 owner类型/ref/version/digest/visibility/eligibility与SDK支持 | U1Verify、U2Submit、U3Register/List/Select、U4Eligibility/Request/Dispatch、U7Refresh；§6～9/11/12 | 每owner/type/operation/consumer/scope正式导出与有效性合同、SDKsupported映射具备才激活；不可用返回blocked/degraded；重开Step1/6/7/8/9/11/12/13 |
| MP-UP-002 Govformalapproved+application/sourceversion/material/scope binding及expiry/revocation | U2Record/Dispatch/Reconcile、U3List、U4Request/Dispatch；review/versiongate | GetGateDecision仅只读线索；缺formaloutcome/fullbinding/有效性consumer合同则不准入；输入变更先重开Step1/6～9/12/13 |
| MP-UP-003 humanpublisher/组织验证与authorizationowner | 全入口scope，U1Bind/Release/Verify、U2Draft/Submit、U3写、U4获取、U5处置、U6恢复 | owner待定，Identity只AI member引用；需正式subject/org/scope/validation/revocation和SDK接缝，不造登录/verified；重开Step1/3/6～9/11～13 |
| MP-UP-004 签名/扫描/SBOMauthority/kind/适用/有效性 | U1材料、U2fixedbasis、U3/U4currentgate | Artifact正式ref存在不等扫描/签名合格；需逐类型正式适用binding，缺失只gap，no rawresult；重开Step1/6～9/12/13 |
| MP-UP-005 各类型materialization/receiver/intent/outcome/probe | U4全部分发、U5lateimpact、U6恢复 | exactversion/consumer/receiver/scope完整结果与known-not-committed/probe正式合同，缺contract不派发；无probeunknownwaiting；重开Step1/6～10/12/13 |
| MP-UP-006 Billing/支付/订阅/结算/分成/跨境owner | 产品future、窄entitlement读来源 | 当前0financialtransactionwriter，不存paid/settled/收入truth；需正式owner和受控00/01范围变更后才重开02，不由03追加支付接口 |
| MP-UP-007 撤回authority、noticechannel/target/receipt | U5Restrict/Withdraw/Plan/Dispatch/Reconcile与U4竞争 | 局部停新发结构已定义，真实authority/channel仍需合同；不能造地址/全安装用户/送达；重开Step1/6～10/11～13 |
| MP-UP-008 Obsproducer/payload/redaction/receipt与Archiveabsence | U6Dispatch/ReconcileObservation、future归档 | producer资格待正式binding，local audit不admitted；Archive无marketsource/export/restore，当前0active lane；重开受影响Step1/6～13，不借endpoint开启 |
| MP-SRC-003 draft技术替换 | Rust API/Worker+Vue Web | 当前01已确认上位口径，draft TS/React改写仍需用户受控讨论稿变更；不能默改draft或formal技术 |
| MP-SRC-010 Governanceformal/flow状态冲突 | U2positiveconsumer与其下游List/Request | owner澄清当前正式baseline/consumerqualification才解除对应资格挂起，本仓不改flow或猜最新 |
| MP-SRC-013 MK2/ISO29110类型适用与包owner | 发布材料/未来package | 保留需求，不创造Package正文/Artifact/合规verdict；逐类型适用与正式包ref/版本/摘要owner明确后重开00/01及受影响02Step |
| Q-MP-01 容量/延迟/noticeSLO/retention-deleteauthority | U3query、U5impact/notice、U6work、U7index/rebuild及04～07 | 当前只有界结构，没有生产数值/删除政策；需正式profile测量/通知范围和保留authority，不编defaults |

### 相邻台账影响裁剪

Hub固定reason repair尚无独立immutableanchor：仅受影响consumerqualification挂起，不能引用历史scanneranchor为本次repair已冻结。Images07设计完成但implementationblocked/B01/B02/MI-UP相关合同仍open，尤其consumer/Artifact/material资格与0outbound限制；市场只裁剪受影响来源/receiver，不替其造事件。Observability当前protocol资格/affected保留，不能以07完成推produceradmission或runtime-ready。Artifact/Method/Archive设计或实施台账进度不证明市场特定consumer合同ready。

本章不补外部authority/schema或风险接受，不新增图。正式owner输入变化需回到对应Step校准、同步flow/项目台账，再按用户授权推进下文档。

## 8. 回填草稿

正式§13仅摘录本文件§7及已pass部分附录，不带问题/诊断/历史审计；不新增结论。

## 9. 待确认事项

MP-UP-001～008、MP-SRC-003/010/013、Q-MP-01沿01保留，仅受影响正向lane blocked；不是owner已确认或已发送请求。

## 10. 进入下一步条件

P1～P8均完成；内部stop_review/pass。全部UP/SRC/Q与既有入口映射，localcandidate不外部confirmed；no riskacceptance/readiness。 外部资格不关闭，允许进入Step 14。
