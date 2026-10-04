# L6-bridges 01 Step 13：演进路线

> full-restart；done / pass；正式01不写。

## 1. 状态与 Step 内计划

开工：Step10、Step11、Step12 pass；已读架构SOP Step13、规范§4.14。先定义当前主线的最低成立边界，再区分可接受债务、后续主线演进和触发条件；不写版本、排期、任务拆单、TODO或未来愿望池。

| 讨论面 | 思考 | 写入 | 自检 | gate_status / 下一动作 |
|---|---|---|---|---|
| 当前主线阶段 | done | done | done | pass / current_stage_stopped |
| 结构债务与非演进边界 | done | done | done | pass / debt_boundary_stopped |
| 后续阶段与触发条件 | done | done | done | pass / trigger_stopped |

## 2. 当前阶段做到哪里才算足够

当前架构阶段的成立标准不是“四个平台已经运行”，而是主线可以被后续文档无歧义地承接：

- Bridges局部BC、U1~U6职责和不拥有的truth已固定；
- typed adapter、逐installation capability资格、binding/mapping generation、body-free ref、stage/effect、namespace幂等、cursor/gap、secret/private seam和safe view机制已固定；
- 同步资格、异步事实、后台恢复和补偿的边界已固定；
- 受影响的BR-UP-001~009被精确登记为open，正向能力缺口保持blocked/waiting/indeterminate，不被设计文字误报为可用；
- 未选择具体SDK、OAuth/API Key、KMS、总线、数据库、路由或部署产品，也不把缺少它们伪装成运行readiness。

达到上述边界即足以支撑02~04继续闭合合同；未达到真实账号、联调、测试、证据或签署状态，不足以宣称任何平台路径已经ready。

## 3. SOP逐项问题回答

| 问题 | 当前回答 |
|---|---|
| 当前阶段守住什么？ | 先稳定owner/平台/本仓边界、阶段结果和安全材料规则，再允许具体adapter、配置和实现合同进入下游。 |
| 第一批必须守住哪些结构？ | U1绑定与映射、U2入站阶段分离、U3外显与effect、U4责任交接、U5连续性、U6安全读取，以及六类横切约束。 |
| 哪些能力后续演进？ | 逐平台正向能力资格、owner/material/human责任合同、具体secret/provider和路由、权威probe/dedup窗口、Observability真实consumer交接，以及经过合同核验的增强能力。 |
| 哪些债务可接受？ | 产品未选、正向路径blocked、自动恢复不启用、部分平台能力unsupported/degraded、Workspace/观察增强条件化，只要失败路径和禁止边界明确。 |
| 哪些债务不可接受？ | truth迁移、body/secret落盘、ACK或日志伪造owner/platform/consumer结果、unknown盲重试、跨安装串绑、query写入或用L5-chat未停审内容作为正式输入。 |
| 什么会触发演进？ | 正式owner合同关闭、平台版本/能力差异超出当前adapter、真实限流/规模产生结构压力、观察消费者资格闭合、或新监管/敏感材料要求改变当前边界。 |

## 4. 演进路线表

| 阶段 | 当前目标 / 范围 | 当前可接受债务 | 后续演进项 | 触发条件 | 说明 |
|---|---|---|---|---|---|
| E0 架构主线收稳 | 固定U1~U6、局部truth/ref、通信方式、技术机制、横切约束和风险姿态；允许下游合同继续 | 未选产品、未建立正向平台/owner/secret能力、自动恢复和真实观察均不启用 | 进入逐平台/逐owner的合同资格核验和概要/详细设计 | 本文Step1~12的主线和边界审计通过 | 当前工作的目标是结构成立，不是运行交付或平台可用性声明。 |
| E1 适配器与配置资格 | 为一个具体installation核验版本、入口、scope、capability、binding basis、secret ref、route和材料/责任边界 | 其他安装或平台保持waiting/unsupported；无法证明的线程、附件、callback和变化不扩展 | 形成可执行adapter/config/secret合同和逐能力支持矩阵 | BR-UP-001~008中相应owner/平台/secret材料真实闭合，且无相冲的版本或撤销缺口 | 演进按资格事实逐安装发生，不以平台名称或公开文档批量激活。 |
| E2 连续性与恢复收稳 | 闭合operation/effect、dedup窗口、cursor comparator/epoch、lane、限流预算、权威probe和人工出口 | unknown/gap/manual仍可保留；无权威探测或窗口证明的自动恢复不启用 | 在不改变stable effect的前提下增加受控对账、局部重建或有限自动收口 | BR-UP-009及平台/owner结果查询、保留窗口、无副作用证明和恢复材料可审查 | 只有连续性证据成熟后才扩大自动承接，不以重试次数衡量恢复。 |
| E3 安全观察与交接收稳 | 闭合body-free producer准入、handoff预算、consumer disposition/unknown和安全读取范围 | 本仓只输出局部safe材料；Observability affected项未关闭时限制强制操作 | 扩展安全诊断、审计读取和经核验的观察消费者交接 | BR-UP-006相关owner完成producer/consumer/实际环境资格；真实交接材料可审查 | 观察演进不能改变本仓不拥有evidence/report/verdict的边界。 |
| E4 能力或平台扩展 | 为新增平台语义、线程/附件/交互或治理要求增补独立adapter能力，保持核心不变 | 不支持能力仍明确unsupported/degraded；不为单平台例外复制核心truth | 只扩展adapter、capability snapshot、mapping kind或局部协议合同；必要时增加新的安全/恢复约束 | 新语义无法由现有adapter seam诚实表达，且具备正式来源、owner、版本和安全材料合同 | 扩展以边界压力和正式能力为触发，不以“更多平台/功能”愿望为理由。 |

## 5. 当前可接受设计债务

| 债务 | 当前为什么可接受 | 触发前的保护 |
|---|---|---|
| SDK、OAuth/API Key、KMS、总线、数据库、路由和部署产品未定 | 它们是P0机制的实现载体，不改变当前边界；提前选定会伪造能力资格 | 只允许adapter/config/secret/recovery/evidence seam资格描述；BR-UP-007保持open。 |
| 四平台正向能力未统一 | 平台语义本来不等价，逐安装supported/degraded/unsupported比虚假4/4更安全 | 能力快照带来源/版本；无证明的路径waiting/blocked。 |
| 自动恢复/无损回放暂不承诺 | unknown、窗口、probe和材料合同未闭合时，自动化会制造重复效果或正文泄露 | stable effect、manual/indeterminate、gap和body-free规则先成立。 |
| Workspace和Observability的条件分支未全部关闭 | 不是所有Bridges路径都需要这些owner；强制前置会扩大无关依赖 | 选用分支逐项验证，保留WS/Observability原状态，不反写上游。 |
| 外部体验增强、批量发现、复杂卡片和原生美化不在主线 | 这些不会决定truth、授权、连续性或安全交接 | 只有拥有正式owner、材料和能力合同时才重新评估。 |

## 6. 不可接受债务与不演进界限

以下不是后续阶段可以容忍的债务，也不是演进项：把外部平台设为内部或平台第二truth、自动创建GlobalMember、敏感Gate/附件/secret正文进入durable或证据、以ACK/HTTP/日志替代owner/platform/consumer事实、未知后盲重试或换target、query触发维护、使用未停审L5-chat材料。这些一旦出现，应视为当前主线被破坏并回到相应Step重开，而不是排入未来阶段。

## 7. 触发条件小表

| 触发事实 | 必须重新审查的结构面 | 不可直接做的事情 |
|---|---|---|
| owner给出新的source/material/actor/action合同 | U2/U3/U4数据和交互、治理/身份/Artifact边界 | 不能仅凭口头确认放宽外显或创建新truth。 |
| 平台版本、入口、scope、线程/附件/限流能力变化 | adapter、capability snapshot、mapping kind、cursor/receipt | 不能沿用旧generation或默认兼容。 |
| unknown/gap或重放压力超过当前可解释范围 | U5连续性、限流/预算、恢复和审计 | 不能用无限队列、全局重试或新effect掩盖。 |
| Observability producer/consumer或材料准入变化 | U6 handoff、安全出口、强制操作准入 | 不能把本地trace升级成evidence或ready。 |
| 新平台或新交互语义无法由现有adapter表达 | U1~U4 seam、mapping/阶段/材料和横切约束 | 不能把差异压进通用消息或让核心直接依赖平台。 |
| 敏感度、法规或组织授权规则变化 | 外显预检、secret、body-free和审计边界 | 不能用配置开关绕过Policy/Gate或历史授权。 |

## 8. 阶段边界说明

当前阶段不是“全部功能做完才算成立”，而是先让本仓在没有真实平台/owner能力时也能清楚表达边界、失败和未决资格。可接受债务必须被限定为不打穿这些边界的未选载体或受控降级；一旦出现真实合同、规模或能力差异使当前机制无法诚实表达，才触发下一阶段结构演进。演进的方向优先改变adapter、资格、连续性或观察承接，不重新分配内部或平台真相。

## 9. 回填草稿、来源与门禁

正式 `01-架构设计.md §14` 计划摘录：§2当前阶段成立边界、§4演进路线表、§5可接受债务、§6不可接受债务、§7触发条件和§8阶段边界说明。该章不包含版本、排期、任务、实现ledger或ready结论。

来源：`01_arch_step_10_technology_seams.md`、`01_arch_step_11_alternatives.md`、`01_arch_step_12_cross_cutting.md`、`00_req_step_15_risks_open_questions.md`、上游专项当前正式语义与台账状态、架构SOP Step13、架构设计书写规范§4.14。

自检：当前阶段、可接受/不可接受债务、后续主线和触发条件均有结构边界；未写项目排期、TODO、愿望池或边界外能力承诺。当前agent设计自检通过。

`gate_status=pass`；`gate_reason=evolution_stages_debts_and_triggers_audited`；`next_allowed_action=read_step_14_then_create`；`formal_backfill_allowed=after_step_16_three_level_gate`；`commit_required=false`。
