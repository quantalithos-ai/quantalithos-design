# L6-bridges 02 Step 13：风险与待确认

## 1. Step 状态与内计划

done / pass；full-restart / single-agent-serial；回填正式§13。开工：三层门禁已核；通用规范与当前SOP/书写规范已读取；Step4~12；00Step15；SOP13/规范4.13已核对；前序思考/结构/自检pass。未来Step未创建。

| 计划项 | 状态 |
|---|---|
| 前序读取 | done |
| 问题/诊断/取舍 | done |
| 结构化/复杂度 | done |
| 草稿/自检 | done / pass |

## 2. 本步输入

Step4~12；00Step15；SOP13/规范4.13；前序校准文件的回答/诊断/取舍/待确认；项目/flow；通则/中间产物/真相源适用纪律。历史02/README后置扫描。

## 3. SOP 问题回答

1. 02风险是本仓如何消费不完整资格、metadata/effect竞争、分阶段unknown、scope/slot/材料约束被误实现，下面列保守边界。2. 未定的是外部兼容/authority、安装版本与产品资格，不重开已稳定对象/入口/状态。3~4. 每项落U、port及入口并继承精确source/释放要求；相应正向分支blocked不会妨碍保守结构装配。5. 03应展开的schema任务不是未定风险，不列排期/人员/优化。

## 4. 当前文档问题诊断

不能把Identity/Artifact implementation ledger ready_for_design_gate当Bridges角色/附件对接完成，也不能把Observability covered_conditional统一改open/closed。source需要逐项保留状态；本仓静态设计自检不建立真正consumer接受、证据或readiness。

## 5. 改动前后对比

| 当前稳定结论 | 外部未得依据 | 当前边界 |
|---|---|---|
| safe port最低语义 | callable/兼容/准入/authority仍缺 | 仅受影响分支blocked |
| type/状态已承接03 | schema细化是明确方向 | 不把已收稳结构重新列为未定 |
| 来源台账有phase/conditional | 非Bridges运行/验收事实 | 状态原样，未检验实现仓或运行 |

## 6. 设计取舍

本仓概要风险与外部对接待确认分两表；继承affected另表原样保存，可追00 Step15§7.3/7.4及当前源台账。BR-UP-001~009=open，010 reference_only不成为强前置。缺口只限制相关操作/消费，不把所有上游域宣布未完成。无风险图，思考done。

## 7. 结构化中间产物

### 概要设计风险

| 风险 | 影响 | 当前处理口径 |
|---|---|---|
| HLD-R01 typed ref/Slot被误当现成authority | U1/U2/U4/U6资格与required输入 | 03逐项carrier必须来源/resolver/required-by-state；没真实资格的local结构仍blocked，不能空ref补。 |
| HLD-R02 两namespace触发同effect或恢复换义 | U3 C04/E02/J01与U5原operation恢复 | effect语义唯一、immutable原target/source/projection与original op；DB/claim验证未执行前不宣exactly-once。 |
| HLD-R03 ACK接管欠缺或unknown误retry | U2/U3/U4/U6 IO前后两UoW | 无安全来源不承诺可靠接管；可能已有效果只权威同op/effect probe/manual，NotFound/lease不证明no-effect。 |
| HLD-R04 per-platform差异被generic adapter吞掉 | U1能力资格、U2~U5四adapter链 | 缺version/scope/method/安装资格waiting/unsupported，thread/变化/附件只明确授权降级；不承诺4/4。 |
| HLD-R05 state传播/query snapshot暗示全局成功 | U6 view/hand-off与17局部机 | 分阶段safe view、denied/unavailable/current scope，不刷新/repair/写audit；consumer准入仍条件，history不变evidence。 |
| HLD-R06 rate/continuity来源不足导致无界积压或虚假完整 | U5 lane/cursor/gap与U3派发 | 所有平台下界与预算/current basis共同，位置需kind-specific coverage，缺窗口/来源manual而非丢gap/自动新键。 |
| HLD-R07 private材料/secret/raw error泄漏 | 全部private seam、U3 Gate/附件、U4 callback、U6出口 | 所有durable/log/trace/handoff/evidence body-free，raw与可还原派生禁止；debug/SDK默认错误记录也不例外。 |
| HLD-R08 skeleton/设计自检被冒称实现许可 | §6/7类型、§12承接及上游ledger | 02只概要正式设计，03/04协议/资格未闭口不得实施；不填实现仓/commit/run/测试/evidence/verdict/readiness。 |

### 外部对接待确认

| 待确认 | 影响范围 | 当前挂起口径 |
|---|---|---|
| BR-UP-001 / open：Conversation兼容/material/result/source-change | U2 E01、U3 projection、U5 J02/J03 | 已有BridgeTargetMode/ActorRef/Integration/kind/digest语义不重开；待owner材料归属/准入/重解析、变化与accepted/unknown结果正式兼容；受影响交接/恢复blocked。 |
| BR-UP-002 / open：human/AI/Integration owning chain | U1三mapping、U4 E03、U6读取 | Identity只AI锚点；正式human入口/责任链提供kind/external证明/internal actor/scope/action/expiry/revoke，缺分支不执行，不自动GlobalMember。 |
| BR-UP-003 / open：Policy/Gate/visibility披露与action | U1 binding、U3 C04/E02/J01、U4 C05/E03 | 逐对象/scope current basis、safe projection/存在性/提示/入口/action与owner状态/责任/结果兼容需明确；无provider默认，无正式entry不造URL/按钮。 |
| BR-UP-004 / open：external附件准入/authorized ref/传播 | U2 qualified material、U3附件资格 | Artifact正式准入/读取/有效性/传播/revoke/expiry/必要或省略basis与平台访问合同待核；必要附件blocked，无raw缓存/公开永久URL。 |
| BR-UP-005 / open：条件Workspace safe read/export | 仅选用的U1/U3/U6 Workspace来源分支 | WS-UP-001~008/006-S、WS-LOCAL-001~003保持open；逐实际source/scope/read/export与owning visibility释放，无独立Workspace频道/权限owner，不把personal执行/seed列Bridges新增前置。 |
| BR-UP-006 / open：Observability producer-safe schema/admission/result | U6 E04/O01/J04，强制材料交接相关操作 | pre_implementation_blocked/wait_design与十二affected原样；缺canonical/admission audit-only或blocked；强制准入缺失时相应操作受限，不能用local audit代consumer/evidence。 |
| BR-UP-007 / open：SDK/产品/secret/route资格 | U1 config/shared seam、U2~U4 adapter | SDK/client兼容与pin、OAuth/PAT/API Key/grant/scope/rotation/revoke、opaque provider/version/expiry/private读取authority及SSRF/固定路由尚未建立；not_selected/not_established，不填真secret。 |
| BR-UP-008 / open：四平台逐安装服务能力 | 四adapter/入口/变化/线程/附件/callback/ACK/limit | 官方source范围不等安装证据；pin/版本/method/scope supported/degraded/unsupported需核。Telegram官方服务版本缺口不能由master源码补固定cloud配额/TTL/窗口。 |
| BR-UP-009 / open：source comparator/probe/coverage/windows | U5连续性/恢复及所有IO未知 | 本地schema/claim/fence是§12明确03细化；外部权威结果/无效果proof、comparator/coverage、replay保留/预算窗口仍待来源合同；不支持时incomparable/gap/indeterminate/manual。 |
| BR-UP-010 / reference_only：L5-chat并行入口 | 无当前正式输入边 | 未停审内容不消费，不做Bridges强前置。后续只有用户授权及可引用正式消费合同才重新裁剪，不宣当前已对接。 |

精确owning source/contract缺口/释放材料沿[00 Step15§7.3/7.4](00_req_step_15_risks_open_questions.md)，本轮又核Workspace项目台账与Identity/Artifact/Observability必要实施台账。Identity current commit-08-c、Artifact current commit-01-a均ready_for_design_gate只是源台账姿态，不是Bridges验证；不核实现仓，不复制上游commit/run/evidence为本仓事实。

### Observability十二inherited affected（状态原样）

| affected_id | 上游原状态 | Bridges禁止推论 |
|---|---|---|
| S08-E-I05-PAYLOAD-SCHEMA-01 | open_upstream_internal | 不宣canonical Bridges payload完成 |
| S08-E-I05-PRODUCER-EVENT-BINDING-01 | open_upstream_internal | 不自选producer事件声称consumer闭口 |
| R06.6-F2-H13-UPSTREAM | open_controlled | 不宣H13/J06恢复Completed |
| R06-F-AFFECT-UOW-01 | open_controlled_downstream | 不以partial success/clone替真实原子交接 |
| S08-RECOVERY-CLASS-OWNER-01 | open_internal_affected | 不自选默认retry类型解锁 |
| R07-EXTERNAL-PHASE-LINK-01 | covered_conditional | 条件覆盖不证明实际投递或可换target/token |
| R07-EXTERNAL-PHASE-RETRY-ACCOUNTING-01 | covered_conditional | unknown不得盲retry/新intent |
| S08-CONSUMER-OUTBOX-SURFACE-01 | open_internal_affected | 不默认ACK/outbox/consumer accepted |
| S08-CONSUMER-INDETERMINATE-COMPLETION-01 | open_internal_affected | 不把unknown改ACK/retry/dead-letter |
| S08-JOB-REPORT-REF-OWNER-01 | open_internal_affected | 不以alias/String伪report ref |
| S08-M1-SECONDARY-TYPE-OWNER-01 | open_internal_affected | 不复制/包shared type伪闭口 |
| 03-RPR-S09-PER-FLOW | design_record_closed_implementation_open | 设计记录非逐flow implementation/run/evidence |

不关闭owner事项、不把conditional/design-record闭合统一改open/closed。当前无本仓结构未处置矛盾阻止保守02装配；本表缺口限制相应正向执行资格。对象/类型/流程/state/config的细化已在§12，不重复作为“待定主语”。03只在用户另行授权后开始；无实施/readiness/验收结论。


## 8. 回填草稿

正式§13回填本仓风险、外部对接pending及精确inherited状态；不携入讨论/审查过程；source与释放入口保留。

## 9. 待确认事项

BR-UP-001~009=open；010=reference_only；不关闭上游。

## 10. 进入下一步条件

自检pass；gate_status=pass；gate_reason=risks_pending_and_exact_inherited_status_preserved；next_allowed_action=step14_formal_assembly；formal_backfill_allowed=after_step14；commit_required=false。
