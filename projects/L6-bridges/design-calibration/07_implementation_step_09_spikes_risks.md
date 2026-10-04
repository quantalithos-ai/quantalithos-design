# L6-bridges 07 Step9：Spike、风险与待确认

## 1. Step状态与Step内计划

2026-10-04；done_design_static；SOP Step9 / 书写§5.9；仅设计校准，正式回填由Step13单独门禁控制。

| 小阶段 | 状态 | 产物/门禁 |
|---|---|---|
| 输入和前序结论 | read | §2/当前正式来源 |
| SOP问题回答 | done_design_static | §3 |
| 材料诊断/前后对比 | done_design_static | §4/5 |
| 取舍与复杂度 | done_design_static | §6 |
| 结构化产物 | done_design_static | §7 |
| 回填草稿 | done_design_static | §8 |
| 待确认 | done_design_static | §9 |
| 实际静态自检 | done_design_static | §10；无项目测试 |

| 模块 | gate_status | next_allowed_action | source_files |
|---|---|---|---|
| step_09 | pass | enter_step_10 | Step8资格矩阵/Step6blockers；06§13原BR-UP/WS/affected与no-waiver；04平台核验/未决 |

## 2. 输入

Step8资格矩阵/Step6blockers；06§13原BR-UP/WS/affected与no-waiver；04平台核验/未决。前序问题、诊断、取舍和未决全部承接；actual blocker不关闭。

## 3. SOP问题回答

Spike优先验证真实导出/driver/current与平台能力，不生成真实账号或token；每项具最早截止、输入、受控检查输出、通过条件/失败行为与scope责任。未建立事实不能通过，actual missing是资格blocker，不第四verdict。

## 4. 材料诊断

风险和设计闭包缺口不能混为允许后做；9个upstream open、12WS与12affected均未关闭；公开資料8选段/3unavailable不能替actual兼容。

## 5. 前后对比

| 当前风险 | 本步校准 |
|---|---|
| 风险和设计闭包缺口不能混为允许后做；9个upstream open、12WS与12affected均未关闭；公开資料8选段/3unavailable不能替actual兼容。 | 设计者已完成适用项审查，qualified产品选择与actual方案必须另有用户授权。无新设计schema缺口时可完成planned文档；有设计冲突则暂停受影响boundary回owner。 |

## 6. 取舍与复杂度

设计者已完成适用项审查，qualified产品选择与actual方案必须另有用户授权。无新设计schema缺口时可完成planned文档；有设计冲突则暂停受影响boundary回owner。

## 7. 结构化中间产物

### 9.1 Planned Spike

Spike不是本轮已执行的调研/测试。当前所有项planned/blocked，负责人只是未来资格/设计责任角色，assignment waiting，无实际报告或结果。

| ID/主题 | 最晚截止 | 输入 | 计划验证/输出 | 通过条件/失败 | 当前 |
|---|---|---|---|---|---|
| SPIKE-BR-001 Core exactsharedkind/exports/toolchain | commit-01-a | 03§3/6 shared及实际core-contracts manifest/lib | 逐exactsymbol/path/shape/MSRV/source revision检索与差异表；禁止localclonekind | required类型完整与基线可核；缺口回Core owner，全部依赖boundary blocked | planned/not_established |
| SPIKE-BR-002 UoW/same-driver commitproof | 首次actual存储前且不晚于07-a | 03§10/12/16全expected/unique/immutable/typedresult/probe | 批准driver/pin/schema transaction原语与故障注入、restart/read_original_commit；实际结果仅安全有限报告 | actualcommit/rollback/unknown分类同driver proof；timeout/NotFound不NoEffect；不私造物理DDL | planned/not_established |
| SPIKE-BR-003 secret/provider/clock/资源 | 首次actualprivate lease/current前且不晚于07-a | 04§7~12五purpose/当前revision/批准window/limits | 授权渠道核opaque refs与rotation/revoke/lease/clock域；不把secret locator/值入材料 | purpose/key/revision/scope/current/预算/retention齐，缺一阻affected IO | planned/not_established |
| SPIKE-BR-004 六owner与SDK seam | 首次actualowner/read前且不晚于07-b | 正式port/7专项合同/必要ledger | 逐method/schema/authority/current/source/outcome/known-unknown兼容；SDK选后pin完整closure/error/retry/cancel | Typed owner调用和safe-source/probe存在；缺口回owning设计，不源码依赖或用Chat填 | planned/not_established |
| SPIKE-BR-005 producer/consumer admission | 首次actualconditional producer前且不晚于07-b | BR-UP-006/十二affected/03 canonical+NonRecursiveResultOnly | Bridges family正式注册/producer schema/admission/rules/mandatory/current/result-only及consumer权威源核验 | 原canonical/consumer op/current可用；不能冒名producer，未选optional不当required | planned/not_established |
| SPIKE-BR-006 Slack | 首次Slackactual IO前且不晚于07-c | 03 Slack adapter/04登记官方来源 | 核API/SDK/method发布类别/installationscope/HMAC/changes/thread/附件/callback窗口/limit/probe | 每所承诺操作有正式结果/缺能力降级合同；不以ACK或missingprobe推success | planned/not_established |
| SPIKE-BR-007 Mattermost | 首次Mattermostactual IO前且不晚于07-d | 03 Mattermost adapter/04官方来源 | 核server/plugin/API pin、PAT/OAuth/source/context/action、post-root/event/附件/部署limit/probe | 安装实例当前兼容，认证不内部授权；差异缺失blocked | planned/not_established |
| SPIKE-BR-008 Telegram | 首次Telegramactual IO前且不晚于07-e | 03 Telegram adapter/04官方来源 | 核Bot版本/update/callback/delete事件缺失、topic/file、webhook/poll排他、offset/retry_after/原unknown | 保证只承诺平台具备能力；unknown不重复send，缺通知不造deletefact | planned/not_established |
| SPIKE-BR-009 Discord | 首次Discordactual IO前且不晚于07-f | 03 Discord adapter/04官方来源 | 核API/Gateway/intents/pin/Ed25519/HTTP互斥/interaction时窗、bucket/global/resume/probe | privatetoken受限，sessiongap保守；平台窗口未核阻actual | planned/not_established |
| SPIKE-BR-010 router/executor/entry | 首次actualhost启动前且不晚于07-g | 03 RuntimeExecution/TransportHost/API/Jobs/Worker；04CFG停机合同 | 核transport owning lease、trust/mode/selector/finite disposition、批准boundeddeadline/currentclock/stop unknown集合 | startup缺required0IO；stop freshclock/window budget，不删unknown | planned/not_established |
| SPIKE-BR-011 harness/digest/material safety | 01-b工具交付前；每次工具变更与08-a全run前 | 05九JSONroot/34defs/9.5/13、06门禁 | schema2020validator/strictJSON/CJSON-SHA256 rolepath/boundedcapture/redaction/expectedclosure selftest；不跑未授权actual | 工具能力真实可验证；缺validator/pin/budgetblocked，不手写猜schema或静态产pass | planned/not_established |

### 9.2 blocker继承与释放

| 类别 | 继承源 | 影响 | 释放/权限 |
|---|---|---|---|
| BR-UP-001~009 | 06§13.2/05§14/03§17逐项原open | owner/schema/current、身份授权、Gate、附件、Workspace、Observability、技术平台能力/去重恢复 | 对应owning合同和actual资格真实基线齐，本仓受影响boundary重审；当前全部open |
| BR-UP-010 Chat | 06§13.2 reference_only | 并行入口无前置 | 不能消费未停审内容；不当阻设计的强依赖 |
| WS-UP-001~008/006-S、WS-LOCAL-001~003 | 06§13.3与Workspace当前台账十二open | selected/mandatory safe export/provenance；unselected明确不用 | 不回写或宣布close；owner实际闭口后限定scope重核 |
| Observability十二affected | 06§13.4、上游pre_implementation_blocked/blocked/wait_design | producer/schema/admission/current/receipt/非递归/材料 | 原状态逐字沿源、BR-UP-006仍open；不冒名他producer |
| 实施前置 | 本文§3/目标仓只读absence | 用户实施/外部操作/提交授权、immutable design commit、真实实现仓、工具 | 当前design-only planned且07待审，不创造仓、hash或许可 |
| local旧expiry断口 | 03 Step10 expiry repair已closed_design_contract | 具名proof/两key-op/current/CAS/Plan | 只设计断口已闭，不等retention/driver/owner/平台资格 |
| 新schema冲突 | 实施前/二次核验发现 | 精确field/port/mapper/state/read-save/source/phase阻塞 | 先回owning设计，不在实现端临时补；授权不足请求新授权 |

### 9.3 风险与禁止workaround

四平台probe能力可能有限、删除通知不完备、edit/thread模型不等价、SDK自动retry/unsafe logging、网络未知/partial覆盖、producer/secret/current撤销与工具超界都须按原03/04safe失败分支处理，未核时blocked/manual。禁止“不确定就新effect/send/approve”“silent skip后pass”“hash敏感正文用于证据”“unsafe SDKdebug临时写文件”“换频道/身份/平台fallback”。S/A/P0/VETO和资格缺口不可风险接受；只有真实不影响P0的B/C残余可由06授权owner/acceptor人工候选，当前没有接受或assignment。

Spike输出若只设计决策仍归calibration，不是测试EV；actual运行计划需明确安全测试账号/许可范围与清理责任，但本轮不创建账号/token/endpoint或运行材料。新产品改变contract需回03/04owner审查而非实现者猜；跨项目修订另需用户授权。


## 8. 回填草稿

回填正式07§9仅采用§7规范内容；问题、诊断、取舍、过程记录不复制。最终在Step13按目标目录转换链接并逐章装配，不提前写正式07。

## 9. 待确认

BR-UP-001~009 open/010 reference_only、Workspace十二open、Observability十二affected原状态、actual资格及实现授权仍waiting；不由本Step自检释放。

## 10. 自检与过程

11项Spike各具截止/输入/输出/通过失败scope；原BR-UP/WS/affected状态未关闭，没有假账号/结果/产品pin或risk acceptance；资格缺口和设计blocker分层，均阻对应actual实施。

Step设计静态自检与规范回指已完成；未运行项目测试/编译/外部IO，不产生实际EV。下一仅顺序Step10。
