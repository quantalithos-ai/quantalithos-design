# 03 Step 18：风险与待确认事项

## 1. Step状态

2026-10-02；full-restart / single-agent；completed / selfcheck_done / stop_review（文档）。已读SOP Step18、规范5.17、[Step17](03_ddd_step_17_implementation_handoff.md)、当前02§13以及Hub/Images/Obs/Archive台账恢复点、SDK flow资格面。只记录本地candidate/affected，未向owner发送或关闭blocker，不作风险接受。

### Step内计划

| 单元 | 状态 | 位置 |
|---|---|---|
| 输入/问题/诊断/取舍 | done | §2～6 |
| 本地技术风险 | done | §7.1 |
| 上游/待确认/重开 | done | §7.2～7.3 |
| 候选/自检/停审 | done | §8/10 |

## 2. 本步输入

Step1～17所有待确认；[正式02风险](../02-概要设计.md)及当前00/01风险；[Step11写帧/历史](03_ddd_step_11_persistence_transactions.md)、[Step12Unknown](03_ddd_step_12_errors_recovery.md)、[Step13canonical/page](03_ddd_step_13_concurrency_idempotency.md)、[Step14资格绑定](03_ddd_step_14_config_bindings.md)、[Step15Obs](03_ddd_step_15_observability_audit.md)、[Step16证明上限](03_ddd_step_16_test_cuts.md)、[Step17本地修复](03_ddd_step_17_implementation_handoff.md)。九owner阅读范围见03 flow；只恢复受影响formal/ledger，不宣称整体巨型schema全文qualification审计。

## 3. SOP问题回答

1. 哪些仍影响代码？exactowner引用/材料/approval/人类组织权限/receiver/probe/notice/Obs消费、人类入口auth、PG性能与保留authority、04完整profile、05/06/07及实施门禁；local设计已闭口但实现验证未发生。
2. 哪些blocking哪些优化？formalconsumer缺阻受影响positive；scope/humanauth缺阻受影响全入口；Billing/Archive扩展是非当前范围，不能扩大MVP。全局写帧吞吐优化待测量，不为性能提前破坏正确性；数值缺影响生产部署预算。
3. 谁确认？各asset truthowner+SDK、Governance、人类组织/auth正式owner（待定）、安全材料authority、receiver/noticechannel、Obs/Archive；产品用户决定scope变更，后续运维/性能/保留authority决定数值政策。不指派虚构实名负责人。
4. 未确认如何处理？failclosed/ContractBlocked/Degraded/Unknownwaiting，各typed理由与当前披露；fake只能test、不生产fallback；不写外部approval/assetbody/payment/installed/evidence。变化回到owningStep与受影响后序重新校准。

## 4. 当前文档问题诊断

Step17修复了pageactor/selector、state别名、Obsproducer局部责任、B新frame等本地设计缺口，不能把这些修复等同owner contract关闭或PG测试通过。MP-UP-001～008与MP-SRC/Q都是本地待核验ID，不能冒充owner已受理工单。Hub历史scanneranchor与当前reason/canonical局部修复分开；Images07、Obs07或其他owner正式装配状态都不等Marketplace exactconsumerready。

## 5. 改动前后对比

| 项 | 前 | 后 | 理由 |
|---|---|---|---|
| 上游缺口 | scattered pending | ID/受影响path/确认authority/重开集合 | 不把affected扩大为全ownerblocker |
| 本地选择 | correctness已定义 | 生产验证/容量/留存显式开放 | design不等运行 |
| 完成 | Step17设计通过 | 03完成与实现移交分层 | 无readiness/签核假事实 |

## 6. 设计取舍

采用按exactpath failclosed与留存原责任；拒绝用全仓“ready/notready”覆盖具体consumer。外部资格缺可定义本地完整负向设计，但不得生产fake成功。为完成03不补auth/扫描/Billingowner、不改九owner正式文档或台账；已被标准覆盖的本地修复只记录本项目经验与例，不越权改全局规范。

## 7. 结构化中间产物

### 7.1 本地技术风险表

这些是开放的实施/生产验证风险，不否定已明确的本地设计规则；不以主观风险接受代测试或正式authority。

| 风险 | 影响范围 / 阻塞程度 | 当前缓解 / 不可绕规则 | 待确认方 |
|---|---|---|---|
| R-MP-DDD-01 全局写帧吞吐与锁预算未知 | 全部RW UoW，U3搜索/U5影响/U6work/U7维护；生产容量待Q-MP-01 | 单例frame锁保证commitorder；外部I/O不持SQL；不凭性能偏好改sequence/时间戳。优化须新ADR并重开11/13/16 | 产品容量/运维/存储owner，后续实测 |
| R-MP-DDD-02 fact history/result/checkpoint留存增长 | mp_fact_versions/results/context/checkpoint/permission/audit；生产保留与删除资格未定 | 不任意TTL/GC/级联删除，不删幂等原结果或Unknown责任；retention/delete formalauthority前保持 | 正式保留/隐私/删除authority与运维，Q-MP-01 |
| R-MP-DDD-03 PG搜索中文/短词/分页负载未测 | search_catalog与catalogprojection；生产延迟待验证 | literal-substring OR simpleFTS、pg_trgm辅助、固定sort、currentpredicate先count/page；超预算安全不可用，非假Empty | 04profile/05实测与产品检索要求 |
| R-MP-DDD-04 RFC8785库兼容/MSRV/严格codec未运行 | intent_fingerprint、pagecodec、Rust workspace；实施验证planned | 33finiteDTO/整数decimalstrings/Set排序/targets保序，成熟库golden/parity；不对owner资产自产digest | 后续实施兼容测试，04/05/07 |
| R-MP-DDD-05 commitUnknown与原报告不能完整复原 | Commands与12Jobs的A/B恢复；受影响originalcomplete/replayblocked | 一次keymissing不证明rollback；正式终止/重新帧锁再核；潜在remoteeffect原intentprobe，原report不足保持Reservedwaiting | 本地PGadapter正式终局证明、receiver/probeowner |
| R-MP-DDD-06 localpermission与remoteeffect时间差 | U2handoff/U4distribution/U5notice及撤回lateimpact；外部瞬时撤销不提供 | 许可前currentgate+局部锁；旧许可/confirmed/unknown归knownimpact，B新cursor/原probe承接，cancel不抹历史 | exactreceiver/notice/Gov合同与产品可承诺范围 |
| R-MP-DDD-07 boundedmaintenance尚无正式数值预算 | Enumerate/Refresh/Rebuild/NoticePlan、整套manifest/result写集；生产profile未定 | fixedupper+typedcontinuation、完整逐item；超界rollback/Blocked，不截断称Complete/Fresh，不复用旧index修truth | 04预算与Q-MP-01/05测量 |
| R-MP-DDD-08 trace/log/exporter与audit混淆 | API/Worker/SDK/telemetry、audit/Oproducer；安全验证not-run | finiteallowlist/低基数label；runtime不能反写truth；原auditset同Tx，Obs2/RecoveryJob/Rebuild无O递归 | 05安全验证、Obs正式redaction合同 |
| R-MP-DDD-09 未来schema/phase/privatefake越界补口 | 全43对象/17ports/49flows/14statecarriers、04～07 | 规范性schema附录全字段读取；futureboundary不得后置当前carrier/原result/读写面；新缺口回修设计 | 未来07按03/05/06/07逐boundary审计 |
| R-MP-DDD-10 当前文档/原型/fake被误当实现ready | 全项目交付/验收；实施当前not_entered | 不存在目标实现仓/lock/build/run/真实资产/扫描/支付/evidence/verdict/signoff；03完成只文档门禁 | 用户后续设计/实施授权与06/07真实性门禁 |

本地设计冲突MP-DDD-FIX-01～09已在Step17回源修复，状态是design-fixed/not-run；不重复列成尚未闭口schema，不伪装生产验证完成。

### 7.2 上游与待确认事项矩阵

所有MP-UP/SRC/Q是Marketplace本地保留调查/待核验编号，**不是owner已确认工单**。需要当前正式exactownerconsumer+SDKoperation/schema/有效性映射，不能以目录存在、endpoint、07完成或genericServiceClient关闭；每个type/operation/scope独立资格。表中路径是Step4下的planned实现位置。

| 事项 / 状态 | 当前影响与planned路径 | 需要谁 / 哪些正式输入确认 | 未确认前处理 | 输入变化重开 |
|---|---|---|---|---|
| MP-UP-001 owner type/ref/version/digest/visibility/eligibility；pending/affected | U1Verify/U2Submit/U3Register/List/Select/U4Eligibility/Request/Dispatch/U7Refresh；`crates/infra/src/sdk/source_owner_adapter.rs`、source_responsibility/publication_review/catalog_version/distribution/reference_read | Method/Hub/Images/Artifact各type不可变export与currentvalidity、适用consumer/scope，SDKexactoperation | 当前受影响positive ContractBlocked/Degraded；safe引用不造正文/digest/Registry；不得给五UI类私造canonicalownerkind | 1/6/7/8/9/11/13/14/16/17及后续consumer |
| MP-UP-002 Governance决定与申请/sourceversion/material/scope；pending | U2Record/Dispatch/Reconcile、U3List、U4Request/Dispatch；`crates/infra/src/sdk/governance_adapter.rs` | Governance正式approved/outcome/fullbinding/expiry/revocation与SDKconsumer，不只GetGateDecision名称 | scan/signature/ACK/MatchedDecision不可approval，缺正式currentvalidapproved不准入；原decision历史不覆 | 1/6～10/12～17 |
| MP-UP-003 humanpublisher/org/authorization/authowner；owner待定 | Scope全入口、U1Bind/Release/Verify、各业务write/Query/replay；`crates/infra/src/sdk/publisher_authority_adapter.rs`、`crates/infra/src/sdk/scope_resolver_adapter.rs`、api入口 | 正式人类/组织/入口authowner、subject/org/scope验证/撤销与可信Coreactor注入合同；Identity只AI | 缺currentformaldisclosure/authority failclosed；不实现本地登录/session/verifiedlabel或Identityhumantruth | 1/3/6～9/12～17；必要00/01范围 |
| MP-UP-004 签名/扫描/SBOM材料authority；pending | U1Verify、U2basis、U3/U4gate；`crates/infra/src/sdk/material_authority_adapter.rs` | 正式安全材料owner、type/kind/适用binding/有效性与Artifact材料ref，Gov对材料消费规则 | 只formalref与gap，无rawscan/signature生成；材料齐备不批准 | 1/6～9/11～17 |
| MP-UP-005 delivery/materialization/receiver/outcome/probe；pending | U4全部分发、U5lateimpact、U6恢复；`crates/infra/src/sdk/receiver_adapter.rs`、worker | 每type exactintent/version/consumer/receiver/scope正式outcome、knownnotcommitted/probe与安全材料化合同 | 无contract不dispatch；可能commit无probewaiting，不blindretry，不造URL/package/digest/installed/paid | 1/6～13/14/16/17 |
| MP-UP-006 Billing/支付/订阅/结算/分成/跨境；future/blocker | 不在当前49入口或PG账本；无adapter/financialwriter | 正式财务/交易owner与受控00/01范围变更，后续法律/跨境authority | 0paid/settled/subscription/revenue/crossbordertruth；不以本地分发intent作付款结果，entitlement候选也不得自认证 | 先00/01，获明确授权才02/03完整重开 |
| MP-UP-007 withdrawalauthority/noticechannel/target/receipt；pending | U5处置/Plan/Dispatch/Reconcile与U4竞争；`crates/infra/src/sdk/notice_channel_adapter.rs`、`crates/infra/src/sdk/publisher_authority_adapter.rs` | 正式处置authority、knownreceiver通知范围与channel资格、原intentreceipt/probe | 本地停新分发不等待通知；缺authority不能自授权处置，缺channelpositiveblocked；Unknown不送达/阅读/卸载 | 1/6～14/16/17 |
| MP-UP-008 Obsproducer/redaction/payload/receipt；Archivefuture | 21C+八J的Owork、U6Dispatch/ReconcileObservation；`crates/infra/src/sdk/observation_adapter.rs`；无Archivelane | Obs当前exactproducer/safeaudit消费合同与SDKoperation/probe；未来Archive须正式sourceentry/export/restoreowner | 原operation+frozenauditset本地责任已闭口，资格缺真实Blocked；localaudit非admitted/evidence。Archive0source/export/restore，no fakepackage | 1/6～9/11～17；Archive若扩展先00/01 |
| MP-SRC-003 draft技术口径差异；pending讨论稿变更 | draft TS/React与formalRust/Vue差异；不阻断本文选定六Rustmember+Web结构 | 用户受控draft修订确认；当前00/01/02正式上位口径优先 | 本轮不改draft/原型，实施技术不可默换Next/Fastify/React | draft另授权；formal栈变更则03Step3/4/5/14/16/17及上位 |
| MP-SRC-010 Governanceformal/flow状态差异；affected pending | U2正向consumer→U3/U4admission；不是Gov全仓不可用结论 | owner明确受影响formalbaseline/flow/consumer资格一致与SDKexactbinding；缺项目级ledger不能猜完成 | 原历史冲突保留，按exactpath挂起positive；不修改Gov台账或借旧summary批准 | 1/7/8/9/12/14/17/18 |
| MP-SRC-013 MK2/ISO29110类型适用与包owner；pending/future | 发布材料适用/未来Package；无正文/packagewriter | 产品/安全/包truthowner提供type适用、正式包ref/version/digest/visibility与合规authority | 保留需求与gap，不自产Package/Artifact正文/合规verdict，不把标准标签当审批 | 00/01及受影响6～9/14/16/17 |
| Q-MP-01 容量/延迟/通知SLO/retention-delete；pending | query/knownimpact/work/rebuild/history；04～07生产/实测 | 正式容量与超限预算profile、通知范围、保留/删除authority及真实后续测量 | 无凭空default/SLA/已测吞吐，未授权GC；局部帧正确性优先、knownscope有界 | 11/13/14/16/17与未来04/05/06/07 |

### 7.3 相邻资格裁剪与恢复门禁

| 当前输入 | Marketplace裁剪范围 | 不能据此声称 |
|---|---|---|
| Hub当前formal03局部canonical-frame修复及独立reason-literalanchor仍待固定 | MP-UP-001受影响capabilitysource/currentconsumer；历史scanneranchor不能替当前修复 | Hub历史commit证明本次reason修复/Marketplace支持，不新造或借用anchor |
| Images07设计/24plannedskeleton与B01/B02/MI-UP相关open | 仅marketimage来源、材料与receiver/materialization资格 | 镜像真实包/签名扫描/consumerready、0outbound之外新事件支持 |
| Obs07设计与inheritedaffected、03局部schema/port/producer传播修复 | MP-UP-008 exactsafeproducer/redaction/outcome/probe | 07=runtime-ready或60协议局部记录=市场producer准入；不把其本地audit/evidence对象复制 |
| SDK/Identity/Govformal与flow受影响状态、项目级ledger未找到 | exactSDKexport/consumer与identityAI/审批关系；缺ledger按正式/flow不足保留 | 通用client=alloperation，Identity=human认证，Gov可读=fullapprovedbinding |
| Artifact/Method/Archive正式设计/台账进度 | body-freeimmutable资产/材料消费；Archive当前无marketsourceentry | 有市场特定consumer支持、可默认export/restore或获得owner正文/血缘写权限 |

外部新输入先确认受影响type/consumer/operation/scope，记录来源与真实ownerbaseline，不推整仓关闭；只修改Marketplace对应Step、flow与本台账。schema/状态/ownership变化时重开源Step并传播所有相关protocol/flow/test/index/config。后续05/06/07分别重审case/证据/边界，不从本轮03推riskacceptance、implementationready或signoff。

风险单元停审：十项技术风险与十二项retainedID均有scope、authority、未确认前处理与重开；本地九个修复不代外部资格；futureBilling/Archive没有当前writer。复杂度采用独立技术风险表/资格表/裁剪表，不增其他项目工单或台账。

## 8. 文档草稿

正式§17候选采用§7.1技术风险、§7.2全retainedID与§7.3相邻资格裁剪。只有事实性风险/影响/authority/保守处理和重开条件，不装配诊断过程、历史聊天或风险接受建议。

## 9. 待确认事项

待确认不是已accepted风险；MP-UP/SRC/Q与受影响Hub/Images/Obs/SDK资格不关闭。04～07未授权；实施仓/ledger/boundary/evidence均不存在于本轮交付。

## 10. 自检与下一动作

静态核对十项R-MP-DDD风险、十二项retainedID（MP-UP-001～008、MP-SRC-003/010/013、Q-MP-01）无遗漏；十段、55份03相关文件340链接/表格/围栏检查通过，明确无riskacceptance/实测/资格关闭。Step18停审pass（文档），下一读Step19 SOP/规范骨架与三层装配门，思考先落盘后才处理旧正式03；不进入04、不提交。
