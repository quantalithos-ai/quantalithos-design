# Step 13：风险接受与遗留项

## 1. Step 状态

SOP Step13/规范5.13；正式§13；completed/selfcheck_done/stop_review；gate_status=pass（设计）；gate_reason=十二项/十残余七字段、权限与失效重开审计完成；next_allowed_action=读取Step14结论签署规则。

### 1.1 Step 内计划

| 项 | 状态 | 产物 |
|---|---|---|
| 读取前序/输入 | done | §2 |
| 问题回答 | done | §3 |
| 诊断 | done | §4 |
| 取舍 | done | §6 |
| 十二项/十残余结构化 | done | §7 |
| 复杂度 | done | 主控分表，保留canonical开放ID |
| 草稿 | done | §8 |
| 权限/失效/重开自检 | done | §10 |

## 2. 本步输入

source_files：[Step12](06_acceptance_step_12_defects_release.md)分级/复验/放行，[Step2](06_acceptance_step_02_scope.md)冻结scope，[Step10](06_acceptance_step_10_evidence_audit.md)三入口/人工detail；[03Step18](03_ddd_step_18_risks.md)/03§17、[05Step14](05_test_plan_step_14_regression_risks.md)、04风险与00§15。继承前序诊断/取舍/未确认；风险全部未接受，无实名/期限/实际签署。

## 3. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 哪些支持条件通过？ | 仅actual证据证明本scope全部P0/VETO/资格/证据成立后的真实非P0 A/B残余，实际正式authority完整接受；scope外blocker只是排除声明，不是已接受风险。 |
| 哪些不能接受？ | 五VETO/S、任何未测/失败P0、formal selected必要positive资格、raw/report/check缺口、审批/身份/财务/安装/通知truth与历史反写。 |
| 接受人是谁？ | 必须实际具权责任人及可核验authority依据；本文仅列待确认角色，不能填TL/finance/growth槽位当接受人。owner资格由owner+SDK确认，不能由本项目风险签署补造。 |
| 动作/截止？ | 每项七字段与明确范围/基线/期限/复验/重开；本轮未指派/未定，不用假日期或名字。 |
| 同步后续？ | 07在用户确认后承接全部遗留/权限/实际证据边界；新formal输入先owning Step受控回源再后序，当前不创建07/implementation ledger或外部工单。 |

## 4. 当前文档问题诊断

当前本地设计自检完成不是实现已测/风险已接受。上游qualification缺口可能在local scope外，但formal positive在scope内时不可risk豁免；不能失败后排除接缝以获得条件通过。MP-SRC-003是技术口径差异，人类auth仅MP-UP-003，04标签差异继续记录不回写。

## 5. 改动前后对比

| 前 | 后 | 原因 |
|---|---|---|
| 角色槽位冒接受 | 七字段+actual authority，当前未接受/未定 | 不造signoff |
| owner缺口当可延期P1 | 按冻结scope判断，required formal资格不可接受 | 不冒positive ready |
| 风险登记即关闭 | open/deferred/accepted/expired说明与新review重开 | 接受不等修复/qualification |

## 6. 设计取舍

采用十二保留ID和R-MP-DDD-01～10原语义，按scope/证据/authority逐项处理；不改上游台账或造已受理工单。不将capacity-candidate未测变成通过，不将文档确认写成风险接受。人工risk detail沿Step10固定路径，机器risk-notes仅材料来源。

## 7. 结构化中间产物

### 7.1 接受资格与七字段约束

eligible风险必须有actual evidence证明无本scope P0/VETO/资格/证据影响、真实风险和受影响范围、理由/替代与回退、后续动作/复验、实际责任人、实际具权接受人和截止时间。另明确run/review/baseline/scope、authority依据/实际接受记录、有效期/重开。七字段缺任一不得作为有条件通过依据；role-only/TBD/伪日期不满足。

scope外MP-UP/Billing/Archive/capacity只列exclusion与影响，不自动视为accepted；scope内required owner资格或P0不得接受。不能在失败后换scope/标签/级别、删失败、降低阈值。接受只说明有限非P0延期，不关闭defect、不提供Governance approval或owner资格。

### 7.2 十二开放项（全部未接受）

本地调查ID与原状态保留，不是owner已受理工单。“责任人/接受人”列当前仅确认authority方向，实名都未指派；截止都未定，送验前必要资格不满足即block。

| 风险 / 遗留项 | 影响 | 接受理由（当前无） | 后续动作 | 责任人 | 接受人 | 截止时间 |
|---|---|---|---|---|---|---|
| MP-UP-001 pending/affected | 五type/source/immutable refs/current与SDK，U1/2/3/4/7正式positive | required资格不可接受；local外部排除不是接受 | asset owner+SDK exact export/consumer/type/version/scope核验；回03受影响U→04→05/06 | 未指派；Method/Hub/Images/Artifact+SDK方向 | 未提供，owner资格不能代签 | 未定；required formal送验前 |
| MP-UP-002 pending | Gov fullbinding/current approved/原probe，U2/3/4 | approval缺口不可接受 | Governance+SDK正式application/basis/material/version/scope决定消费与probe；03U2/3/4→04/05/06 | 未指派；Gov+SDK方向 | 未提供，不能由市场产生approval | 未定；required formal送验前 |
| MP-UP-003 owner待定 | human/org/auth/current scope，全入口与replay | auth/authority P0不可接受，Identity只AI | 正式human/org/auth owner与Core可信注入合同；先00/01→03/04/05/06 | 未指派；owner待定 | 未提供，无本地登录补资格 | 未定；受影响formal入口前 |
| MP-UP-004 pending | 材料kind/适用/有效/安全ref与Gov消费 | 材料/gate P0不可接受 | 安全材料/Artifact/Gov+SDK exact合同；03U1/2/3/4→04/05/06 | 未指派；材料authority方向 | 未提供，scan/signature非接受/approval | 未定；required formal送验前 |
| MP-UP-005 pending | receiver/materialization/outcome/probe，U4/5/6 | positive与potential commit不能风险豁免 | 每type intent/version/consumer/receiver/scope正式消费/probe；03U4/5/6→04/05/06 | 未指派；receiver+SDK方向 | 未提供，Confirmed非安装/支付 | 未定；required formal送验前 |
| MP-UP-006 future/blocker | Billing/支付/订阅/分成/跨境无owner | 非当前范围，不是已接受财务能力 | 正式财务/法律/产品authority与受控00/01范围，之后02～07重开 | 未指派；owner待定 | 未提供，市场无财务authority | 未定；纳入范围前 |
| MP-UP-007 pending | 处置/knownreceiver/notice target/channel/outcome/probe，U4/5/6 | formal资格/P0与送达伪造不可接受 | 正式处置/通知owner+SDK；03U4/5/6→04/05/06；停发不等通知 | 未指派；处置/通知方向 | 未提供，不能伪送达/已读 | 未定；required formal送验前 |
| MP-UP-008 pending/affected | Obs safe producer/redaction/receipt/probe；Archive无market lane | required Obs资格不可接受；Archive仅future | Obs+SDK exact原operation/auditset/scope核验；03U6→04/05/06；Archive扩展先00/01 | 未指派；Obs+SDK方向 | 未提供，receipt非evidence | 未定；required formal送验前 |
| MP-SRC-003 pending | draft TS/React与formal Rust/Vue，04标签差异 | 非运行风险接受；formal栈不默换 | 用户另授权draft/标签核对；human仅MP-UP-003 | 未指派；项目文档维护方向 | 未提供；需用户受控确认 | 未定；相关变更授权前 |
| MP-SRC-010 affected/pending | Gov formal/flow历史状态与exact market binding来源 | 受影响positive未核验不可接受，不宣判Gov全仓 | owner baseline/flow/SDK exact来源核验；03/04/05/06受影响链 | 未指派；Gov/SDK方向 | 未提供 | 未定；required formal送验前 |
| MP-SRC-013 pending/future | MK2/ISO29110适用、Package/合规owner | 标准标签不等合规verdict/approval | 标准/材料/Package/合规正式owner与00/01类型/范围，再下游 | 未指派；owner待定 | 未提供，无自造包/正文 | 未定；纳入范围前 |
| Q-MP-01 pending | 容量/延迟/通知SLO/预算/retention-delete | candidate无阈值；生产required范围不可豁免 | 产品/存储/运维/保留/法律authority，actual workload测量；03预算→04→05/06→07 | 未指派；相关authority方向 | 未提供，无TTL/GC删除授权 | 未定；相关生产范围前 |

### 7.3 十本地技术残余（全部未测/未接受）

| 风险 / 遗留项 | 影响 | 接受理由（当前无） | 后续动作 | 责任人 | 接受人 | 截止时间 |
|---|---|---|---|---|---|---|
| R-MP-DDD-01 写帧吞吐/锁预算 | 全RW/生产capacity | correctness P0不接受；纯capacity尚无actual可接受依据 | actual PG锁/负载样本，Q-MP-01 profile；优化需ADR及03Step11/13/16重开 | 未指派；存储/运维方向 | 未提供 | 未定；相关生产容量前 |
| R-MP-DDD-02 history/result/checkpoint增长 | 原结果/Unknown责任留存及删除资格 | 不许删责任/TTL/GC；保留政策缺口不能代签 | 实测增长，正式保留/隐私/删除authority，03持久化/04/05/06回源 | 未指派；保留/运维方向 | 未提供 | 未定；保留/删除动作前 |
| R-MP-DDD-03 PG短中文/search负载 | literal/simpleFTS/page/产能 | page/currentfilter P0未测不接受，latency仅candidate | actual PG正反分页+声明workload趋势，再正式检索/容量profile | 未指派；查询/测试方向 | 未提供 | 未定；送验及生产profile前 |
| R-MP-DDD-04 JCS/MSRV/codec兼容 | 33DTO/fingerprint/pagecodec/strict JSON | canonical/codec P0未执行不可接受 | 成熟RFC8785库golden/parity/codec，D/P与完整原replay；不自产资产digest | 未指派；应用/测试方向 | 未提供 | 未定；P0送验前 |
| R-MP-DDD-05 Unknown原report不足 | C/J原完成/重放与probe | fullreport/终局/责任 P0不可接受 | actual PG key终局证明及原formal probe/fullreport fault矩阵；Reserved不足不补造 | 未指派；PG/receiver测试方向 | 未提供 | 未定；P0/formal送验前 |
| R-MP-DDD-06 permission与remote时间差 | handoff/distribution/notice/late impact | late/currentgate/历史 P0不可接受，不承诺瞬时跨owner撤销 | actual两commit序/全适用disposition/原probe，formal接收合同范围核验 | 未指派；接收/测试方向 | 未提供 | 未定；required formal送验前 |
| R-MP-DDD-07 bounded维护预算 | impact/noticeplan/refresh/rebuild完整写集 | bounded/complete P0不接受，数值未定不造default | actual完整manifest/continuation与超界安全失败，Q-MP-01/04profile | 未指派；维护/配置方向 | 未提供 | 未定；P0及相关生产预算前 |
| R-MP-DDD-08 runtime exporter/audit混同 | log/trace/metric/O producer/安全 | sixfield/finite label/防递归P0不可接受 | X/capture/sentinel/PG audit，Obs正式safe consumer；诊断不修truth | 未指派；安全/Obs方向 | 未提供 | 未定；P0/formal送验前 |
| R-MP-DDD-09 privatefake/schema/phase越界 | 全43/17/49/14库存/未来boundary | 全字段/port/phase P0不可接受 | D/I/P参数化与03规范性schema复核；未来07逐boundary重开而不私补接口 | 未指派；契约/测试方向 | 未提供 | 未定；每实施boundary前 |
| R-MP-DDD-10 文档/原型冒ready | 全项目交付/实际证据/签署 | 真实性P0/VETO不可接受 | 实际repo/build/run/raw/report/EV与authority门禁；design/runtime分层 | 未指派；交付/验收方向 | 未提供 | 未定；任何运行/ready声明前 |

以上future验证计划不是已经缓解/接受/关闭；其中P0必要测试必须实际执行，capacity与无ownerfuture范围继续独立。十风险原ID/语义沿03，不另造新风险号码或实际verdict。

### 7.4 固定风险详情、失效与重开

入口 `reports/acceptance/risk-acceptance.md` → explicit `reports/acceptance/<run_id>-<review_id>-risk-acceptance.md`，沿Step10 phase/摘要/append-only/three入口绑定。即使没有eligible残余也须明确“无eligible残余”及scope外十二项，不留下误读空表；有残余未接受必须写未接受，不能留空被解释为同意。

接受authority必须实际身份/委任/权限可核验，真实接受记录和日期回指实际来源；作者、实施者、测试runner或协调人不因角色名称自动有权。owner approval、human auth、finance/legal、安全材料与生产运维由相应authority，市场review不可代填。

到期、范围/基线/owner contract/config/风险影响/后续动作/authority失效，或新actual finding关联P0/VETO，立即重开并停止沿用条件通过；未到期也不豁免新红线。更正人工记录newreview+supersedes；影响测试baseline/资格/范围需newrun与fresh复验。首先回owning 00～05 Step，再传播06，07只在用户另授权后承接，保留旧失败/接受记录。

## 8. 回填草稿

正式§13采用eligibility、七字段和十二项/十残余、全部未接受/未指派/未定、人工风险入口与authority/失效/重开。当前无风险接受事实或签署；本地设计完整不关闭上游资格。

## 9. 待确认事项

真实责任人与接受authority/期限/预算/profile、scope selected资格、actual风险影响均未提供；本轮不协调外部或指派人名。retention-delete需正式授权，测试cleanup不能删证据历史。

## 10. 进入下一步条件

自检：十二开放ID及十原技术残余无遗漏/改义，七字段完整且明确全部未接受，P0/资格/证据/VETO不能豁免；fixed risk详情/authority/期限/重开闭口，无伪signoff。Step13设计pass；下一读SOP Step14/规范5.14、前述全部门禁/Step4进入退出及三入口decision规则；不提交commit。
