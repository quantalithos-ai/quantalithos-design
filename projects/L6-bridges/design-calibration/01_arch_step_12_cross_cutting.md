# L6-bridges 01 Step 12：横切关注点

> full-restart；done / pass；正式01不写。

## 1. 状态与 Step 内计划

开工：Step2、Step8、Step9、Step10、Step11 pass；已读架构SOP Step12、规范§4.13、00 Step13质量要求、Step15风险和BR-UP-001~009状态。先确定适用横切类别，再按U1~U6判断安全、审计/追溯、可观测性、韧性/恢复、性能/容量、配置/变更，最后做跨项审计；不写监控配置、密钥脚本、压测计划或运维手册。

| 单元 | 思考 | 写入 | 横切停审 | gate_status / 下一动作 |
|---|---|---|---|---|
| U1 受权绑定与映射 | done | done | done | pass / U1_cross_cutting_stopped |
| U2 入站交接 | done | done | done | pass / U2_cross_cutting_stopped |
| U3 安全外显与交付 | done | done | done | pass / U3_cross_cutting_stopped |
| U4 交互责任 | done | done | done | pass / U4_cross_cutting_stopped |
| U5 连续性与恢复支撑 | done | done | done | pass / U5_cross_cutting_stopped |
| U6 安全读取与追溯支撑 | done | done | done | pass / U6_cross_cutting_stopped |

## 2. SOP逐项问题回答

| 问题 | 回答 |
|---|---|
| 安全边界如何处理？ | 平台、secret、owner、material、visibility、action和观察均经正式边界；主体kind、binding basis、当前generation和敏感材料禁止规则持续有效。 |
| 需要观察什么？ | 绑定/撤销、来源验证与交接、intent/attempt/receipt、callback验证、unknown/gap/限流等待、恢复和handoff的安全阶段；不观察正文、secret、私有URL或敏感存在性。 |
| 可用性/韧性底线？ | 外部失败不改内部truth；unknown/gap/blocked可见并可延后收敛；只有原operation/effect和权威依据才恢复，不把自动重试当可用性。 |
| 性能/容量如何判断？ | 不设无来源数字；判断是否会因同步等待、无限队列、跨lane阻塞、重放放大或高基数材料造成结构性失控，按安装/方法/资源/全局能力和预算隔离。 |
| 配置如何管理？ | 配置、binding generation、能力版本、路由约束、secret ref、预算和撤销均作为受权变更；不能用默认token、动态fallback或任意开关放宽边界。 |
| 审计如何保证？ | 关键状态和判断保留body-free ref/版本/阶段/有限reason；本地handoff、owner结果、平台receipt和consumer disposition分开，真实证据归相应owner。 |
| 哪些不机械套用？ | 通用UI、品牌、日志库、告警阈值、值班流程、固定SLA、全局自动扩缩容、个人数据全量留存不属于本仓当前架构横切主线。 |

## 3. 当前材料诊断与取舍

旧架构把“安全、可用、性能、可维护”列成口号，并把所有raw日志交给观察层再脱敏；这没有说明每个边界保护什么，也会把Bridges推成正文/证据仓。当前按六类横切类别写长期约束：以安全和审计保护真相与材料边界，以观察表达局部阶段，以韧性保留unknown/gap，以性能/容量限制同步和排队放大，以配置/变更保护主线不被开关绕开。代价是更多阶段状态、低信息材料和保守降级，但这是在没有真实平台/owner合同时保持可解释性的必要取舍。

## 4. 横切关注点约束表

| 横切关注点 | 作用范围 | 约束要求 | 保护目标 | 说明 |
|---|---|---|---|---|
| 安全边界：外部输入与主体资格 | U1/U2/U4平台入口、Identity责任ref、binding generation | 外部认证、主体kind、当前binding/basis、target和action必须分别可验证；external_id不自动建GlobalMember或授予权限 | 保护内部身份、授权和owner责任链不被平台来源替代 | 该约束同时作用于映射、入站和回调，不能留给单个adapter自行解释。 |
| 安全边界：材料与敏感外显 | U2/U3/U4/U6及所有durable、log、trace、handoff、evidence出口 | 消息/附件正文、敏感Gate、secret/token、私有callback/response URL、未获准存在性及可还原派生不得持久化或观测；仅传获准ref/版本/有限reason | 保护内容最小暴露、治理敏感度和凭证安全 | 这是跨数据/交互/观察的架构约束，不是后置脱敏脚本。 |
| 安全边界：查询与执行分离 | U3/U4/U5/U6读取、probe、维护和owner action边界 | query/read/probe不触发repair、replay、外显、Decision或Runtime/Tools；action必须回到正式owner | 保护no-write读取、Policy/Gate和执行责任不被旁路 | 读取副作用会破坏阶段解释，故需架构层长期禁止。 |
| 审计与可追溯：关系和变化 | U1配置、binding、mapping、撤销与generation变化 | 关键关系变化可回指basis/ref/version和局部operation；历史效果不因新generation重写 | 保护授权演进、撤销竞争和映射争议的可追溯性 | 不要求保留平台正文或全部历史快照。 |
| 审计与可追溯：阶段及效果 | U2/U3/U4/U5的ACK、owner结果、intent/attempt/receipt、callback和恢复 | 每阶段保留安全关系和结果类别；stable effect、attempt、平台receipt和owner/consumer结果分开 | 保护“收到、接纳、送达、接受、恢复”不互相冒称 | 普通访问日志不能替代阶段语义。 |
| 审计与可追溯：缺口和恢复 | U2/U3/U5/U6的gap、unknown、限流、blocked和handoff | 记录有限安全原因、位置/epoch、原operation/effect和恢复basis；没有依据不得关闭gap或报告complete | 保护失败后的责任定位和人工对账边界 | 不生成虚构report、evidence、verdict或readiness。 |
| 可观测性：安全阶段可见 | U1~U6局部状态、关键交互和正式承接 | 受权调用方可区分active/waiting/blocked/revoked、accepted/rejected/unknown、gap/rate-wait/handoff-wait；输出低基数安全类别 | 保护主线是否成立、失败为何发生的可见性 | 观察只消费body-free材料，不能凭本仓记录推断owner/consumer接受。 |
| 可观测性：观察边界 | U6与Observability handoff、producer准入和consumer disposition | 本地handoff/attempt与真实consumer结果分开；producer准入不足限制相应操作，保留原affected状态 | 保护观察系统和本仓不互相伪造证据 | BR-UP-006未关闭，不能报告真实evidence或消费完成。 |
| 韧性/恢复：未知与缺口保留 | U2/U3/U4/U5/U6外部超时、崩溃、lease失效、epoch变化和材料失效 | unknown/indeterminate/gap/blocked/manual是正式可见结果；只有权威probe/覆盖或同effect结果才finalize | 保护不重复效果、不换target、不伪造完整性 | 这项约束跨交互、数据、后台和审计，不能由默认retry库决定。 |
| 韧性/恢复：隔离与有界承接 | U1撤销、U2入站缺口、U3限流、U5 recovery、U6 backlog | 按installation、binding、lane、namespace和预算隔离；外部失败不拖垮无关关系，不允许无限积压或跨lane放大 | 保护局部可用性和恢复范围，不承诺无条件高可用 | 具体预算/限流合同待BR-UP-008/009和配置设计闭合。 |
| 性能/容量：即时边界收缩 | U1资格、U2入口验证、U3预检、U4验证、U6安全读取 | 同步路径只做当前资格/验证/读取和明确拒绝；正文解析、外部投递、owner等待、重建和观察消费延后 | 保护平台入口时限、治理决策和局部响应不被长链拖垮 | 这是结构判断，不编造毫秒/吞吐目标。 |
| 性能/容量：排队与限流隔离 | U3/U5派发、U2/U6交接backlog、四平台安装 | 预算、顺序、重试和平台能力按installation/方法/资源/全局维度隔离；unknown不产生无界重试 | 保护外部限制不扩散为内部资源放大或重复效果 | 具体bucket/配额只在真实版本核验后进入02~04。 |
| 配置与变更：资格化配置 | U1绑定、U3外显、U4动作、U5恢复、平台adapter | platform/installation/capability revision、direction/action、route policy、有效期、generation和opaque secret ref必须作为受权配置变更 | 保护配置不绕过owner、Policy/Gate、mapping或secret seam | 配置接受不等运行激活，缺basis/version保持waiting。 |
| 配置与变更：撤销和兼容变更 | U1~U5所有会改变效果/位置/能力的变更 | 变更有新generation/版本和影响范围；撤销阻新排队操作；不静默换target、projection、comparator或secret provider | 保护历史效果、恢复可解释性和跨安装隔离 | 具体迁移/回滚步骤留04/07，不在架构层伪造。 |

## 5. 按架构单元适用性与停审

| 单元 | 安全适用性 | 审计/可观测性适用性 | 韧性/性能适用性 | 配置/变更适用性 | 停审结论 |
|---|---|---|---|---|---|
| U1 受权绑定与映射 | 主体kind、basis、scope、secret和generation必须独立验证 | 配置/撤销/mapping变化可解释；不出平台正文 | 版本失效和撤销隔离；管理读取不阻塞外部路径 | binding/capability/route/secret ref受权变更；不默认激活 | pass |
| U2 入站交接 | 来源验证、回环、target、material和actor链 | ACK、owner disposition、source version、gap安全可见 | 入口同步收缩；owner等待、材料解析和变化对账延后；无安全ref不接管 | adapter入口和变化能力按版本；变更不抹历史mapping | pass |
| U3 安全外显与交付 | visibility/Policy/Gate、附件和secret在intent前重核 | intent/attempt/known receipt/unknown分离；不记录body | 限流/派发后台承接；按lane/预算隔离；外部失败不改内部truth | projection/material/capability/secret变化使intent重判；不静默改target | pass |
| U4 交互责任 | 签名/时效/actor/source/target/action/owner依据独立 | 验证/重放/owner result可追溯；callback私有材料不出 | 入口快速拒绝；owner结果异步；过期/unknown后台对账 | action/expiry/one-use/revocation变更阻止旧交互；不延长token | pass |
| U5 连续性与恢复支撑 | recovery basis、probe、scope和人工权限受控 | cursor/gap/预算/恢复结果可解释；不把本地trace当evidence | unknown、不可比、窗口过期保留；重试/重建隔离并有界 | comparator、dedup窗口、预算和secret版本变更须新资格 | pass |
| U6 安全读取与追溯支撑 | scope/visibility、body-free和准入裁剪 | safe view/handoff/consumer disposition分层；保留上游affected状态 | query no-write；backlog重建有界；consumer缺口不造ready | view/schema/producer binding变化需兼容核验，不可任意扩展输出 | pass |

## 6. 横切影响说明

这些横切要求必须进入架构层，因为它们同时改变多个边界上的数据允许形状、通信收口和失败含义，而不是某个实现函数可以事后补齐的属性。安全和审计规定哪些状态能被承接与观察，韧性和性能规定哪些工作必须延后以及未知如何保留，配置控制规定这些主线不能被运行开关绕开。具体告警、指标、轮换、预算和恢复操作仍由后续配置、详细设计、测试和实施文档闭合，不在此处伪造。

## 7. 主线映射小表

| 横切类别 | 主要作用章节/机制 | 当前不可宣称 |
|---|---|---|
| 安全边界 | §3/§5/§8/§9；adapter、binding、material、secret、治理预检 | 不宣称已建立human认证、Policy/Gate provider、secret provider或平台安装。 |
| 审计与可追溯 | §8/§9/§10；body-free阶段/结果/ref | 不宣称真实evidence、report、verdict、consumer接受或ready。 |
| 可观测性 | §7/§9/§10；safe view、handoff、低基数状态 | 不把本地handoff或静态扫描升级为Observability完成。 |
| 韧性/恢复 | §8/§9；operation/effect、cursor/gap、manual/unknown | 不宣称自动恢复率、恢复时长或无损回放。 |
| 性能/容量 | §7/§10；同步收缩、lane/budget、平台能力隔离 | 不编造吞吐、延迟、SLA、配额或队列容量。 |
| 配置/变更 | §3/§8/§11；generation、capability、route、secret ref | 不宣称具体配置加载、轮换、回滚或部署机制已存在。 |

## 8. 跨横切约束审计

| 审计面 | 结果 |
|---|---|
| 模板化空话 | 每项均绑定到U1~U6的relation、source、effect、cursor、handoff、secret或view，不使用“安全/高可用/可扩展”裸标签。 |
| 适用性遗漏 | 六单元逐项停审；不适用的UI、品牌、通用值班和固定SLA未强塞进表。 |
| 与Step8一致 | body-free、局部truth/ref、unknown/gap、query no-write和owner/platform最终一致保持不变。 |
| 与Step9一致 | 同步资格、异步事实、后台恢复和补偿的横切约束没有被改成伪同步或无限重试。 |
| 与Step10/11一致 | 机制与P0主线受配置/变更控制保护；未选产品不能削弱横切红线。 |
| 审计材料 | 只允许安全ref/版本/阶段/有限reason/位置摘要；BR-UP-006与Observability十二affected原状态不关闭。 |
| 性能数字 | 未设置无来源数字；只保留结构性判断和后续核验入口。 |

## 9. 回填草稿、来源与门禁

正式 `01-架构设计.md §13` 计划摘录：§4横切约束表、§5六单元适用性、§6影响说明、§7主线映射和§8跨审结果。详细告警、配置、测试和恢复操作留后续文档；不把横切表改写成NFR清单。

来源：`01_arch_step_02_goals_constraints.md`、`01_arch_step_08_data_consistency.md`、`01_arch_step_09_interactions.md`、`01_arch_step_10_technology_seams.md`、`01_arch_step_11_alternatives.md`、`00_req_step_13_non_functional_requirements.md`、`00_req_step_15_risks_open_questions.md`、架构SOP Step12、架构设计书写规范§4.13。

自检：六类横切要求均有结构作用范围、约束和保护目标；六单元均完成适用性停审；未落入实现脚本、运维手册、固定SLA或虚构运行事实。当前agent设计自检通过。

`gate_status=pass`；`gate_reason=cross_cutting_applicability_and_boundary_audit_passed`；`next_allowed_action=read_step_13_then_create`；`formal_backfill_allowed=after_step_16_three_level_gate`；`commit_required=false`。
