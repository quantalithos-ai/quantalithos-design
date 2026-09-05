# Step 3. 职责边界

> 对应 SOP: `standards/document/架构设计讨论流程_SOP.md` Step 3
> 对应书写规范: `standards/document/架构设计书写规范.md` §4.4
> 回填位置: 正式 `01-架构设计.md` §4
> 日期: 2026-08-22
> 状态: `pass`
> 串行门禁: Step 1~2 已通过;本文件通过前未创建 Step 4

## 1. 本步输入与边界

| 输入 | 承接内容 |
|---|---|
| Step 1 `RB-L2M-001~008` / `HC-L2M-001~010` | 仓定位、数据禁区、依赖上限与开放 seam。 |
| Step 2 `AG-L2M-001~009` / `AIC-L2M-001~010` | 架构必须成立的结构与不可变红线。 |
| 正式 00 §2 / §7 / §9 / §10 / §11 | owner 判定、五节点闭环、功能、规则与数据归属。 |
| Runtime / Tools / host sibling / Bus / Governance / Conversation / Identity / Work 当前边界 | 相邻 owner 的正向职责和 member 消费上限。 |

本步只回答仓级“做什么 / 不做什么 / 与谁容易混淆 / 哪些行为禁止”。不画上下文图,不划子域,不讨论部署、数据一致性或协议。

## 2. SOP 问题回答

### 2.1 这个仓具体做什么

| 职责 ID | 本仓职责 | 成立产物 | 明确不包含 |
|---|---|---|---|
| `RESP-L2M-001` | 受理项目型运行主体与启动语境,建立本地 presence | 主语 / 身份锚关联的受理或拒绝结论、显式在场变化 | Work / Identity 生命周期、凭据签发、容器启动成功。 |
| `RESP-L2M-002` | 形成宿主协作的本地请求、信号、报告与尝试事实 | register request、liveness signal、status report 的本地形成 / attempt / gap | host acceptance、endpoint registry、host session、health verdict。 |
| `RESP-L2M-003` | 决定成员可承接的入站订阅范围 | 有来源的 subscription scope decision 及变化记录 | Bus route truth、Policy truth、本地永久 allowlist。 |
| `RESP-L2M-004` | 对入站事实做授权瞬时检查并形成筛选四态 | passed / downgraded / blocked / pending 结论、规则来源回链和 body-free 处置记录 | 正文持久化、语义推理、Governance 决策、Bus delivery。 |
| `RESP-L2M-005` | 决定是否及以何种安全语境向 Runtime entry 投递 | delivery decision、typed ref / safe snapshot / controlled context、受理关联或 waiting / gap | Runtime acceptance truth、run 建立、代答、透明 raw forwarding。 |
| `RESP-L2M-006` | 承接 Runtime committed safe material 并形成出站决定 | outbound decision、body-free handoff material、拒绝不安全材料 | Runtime outcome、对话追加、artifact 写入、任意外呼。 |
| `RESP-L2M-007` | 向正式事件 / handoff 边界发起发布并记录本地状态 | publication attempt / gap、迟到 / 重复反馈的追加关联事实 | Bus delivery、downstream accepted、observed truth。 |
| `RESP-L2M-008` | 维护本地交互事实的关联追溯并形成安全材料 | presence / screening / delivery / outbound / attempt 的 body-free trace 与交接 attempt | 完整日志、evidence verdict、observability backend。 |
| `RESP-L2M-009` | 从本地事实与正式 ref / safe view 派生成员摘要和能力出口 | 可重建 summary / outlet / diagnostic / explanation view、freshness / gap | capability registry、ToolDefinition / method body、任何 truth 反写。 |
| `RESP-L2M-010` | 显式表达外部 seam 的不可用、未知和未闭口状态 | blocked / waiting / degraded / stale / unresolved / gap | 伪造 positive integration、readiness 或默认成功。 |

### 2.2 这个仓具体不做什么

| 非职责 | 正式 Owner | member 允许的最小协作 |
|---|---|---|
| run / context / plan / checkpoint / recovery / outcome | `L2-runtime` | entry 提交、受理结果 ref、committed safe material / safe view 消费。 |
| canonical tool invocation / execution / normalized outcome | `L2-tools` | 能力出口只消费 contract / definition ref 或 safe view。 |
| capability registry、provider / MCP / A2A / API adapter | `L3-capability-hub` 等 | 无直连;只接受正式平台边界已形成的 ref / safe material。 |
| ProjectMember / GlobalMember truth 与身份生命周期 | `L1-work` / `L1-identity` | 消费 ProjectMemberRef + GlobalMemberRef 双锚;不写回。 |
| Policy effective / Decision / approval truth | `L1-governance` | 消费正式结果 / safe snapshot;unknown 保守处置。 |
| 容器启停、registry、host session、health verdict、credential issue / revoke | `L2-member-service` / credential owner | 提供本地请求 / 信号 / 报告与 attempt;消费 acceptance / session ref。 |
| 镜像构建、manifest / provenance / compatibility truth | `L2-member-images` | member component 作为 pinned 被打包对象的消费方向,不参与运行主链。 |
| Sandbox 隔离与执行 truth | `L4-sandbox` | 不直连;只消费正式上游安全结果(如未来有 authority)。 |
| Event delivery | `L0-bus` | subscribe / publish event seam 与 feedback ref。 |
| Conversation / Artifact / Evidence truth | `L1-conversation` / `L1-artifact` 等 | 输出 body-free handoff material;不直接追加正文。 |
| Observed truth / backend / alert | `L4-observability` | 输出低敏材料并记录 attempt / gap。 |
| SDK / 产品 UI 封装 | `L0-sdk` / 产品层 | 只读消费未来正式查询面;不反向形成 package dependency。 |

### 2.3 哪些能力看起来相关但必须属于其他仓

| 易混淆边 | member 拥有 | 对方拥有 | 判定句 |
|---|---|---|---|
| member ↔ Runtime 入站 | 筛选结论、投递决定、关联 | EntryAuthority 下的受理 / 拒绝、run / decision | “member 决定是否提交;Runtime 决定是否受理与如何运行”。 |
| Runtime ↔ member 出站 | 出站决定、材料门禁、attempt / gap | committed outcome 与 safe material 来源 | “Runtime 提交结果;member 决定是否以及如何离开容器”。 |
| member ↔ host | 本地 presence、请求 / 信号 / 报告与 attempt | acceptance、registry、session、health、lifecycle | “member 报告自己;host 判定如何编排”。 |
| member ↔ Bus | subscribe / publish intent 与本地 attempt | delivery / redelivery / route truth | “member 尝试收发;Bus 证明传递”。 |
| member ↔ Governance | 筛选四态和使用结果记录 | policy / approval / decision truth | “member 应用正式规则结果;不制定规则”。 |
| member ↔ Work / Identity | 运行态双锚受理与 presence 关联 | ProjectMember / GlobalMember 生命周期 | “member 证明本实例归属;不创造主体”。 |
| member ↔ Conversation | body-free 出站 handoff | conversation append / ordering / visibility truth | “member 准备交互材料;Conversation 决定对话事实”。 |
| member ↔ Tools / capability | 可承接能力派生出口 | tool definition / invocation / registry / execution | “member 展示来源视图;不定义或执行能力”。 |
| member ↔ Observability | 本地 trace / safe material / handoff attempt | ingest / storage / query / observed truth | “member 提供材料;后端证明已观测”。 |

### 2.4 哪些行为绝不能隐式发生

| 红线 ID | 禁止隐式行为 | 必须的显式结果 |
|---|---|---|
| `RR-L2M-001` | 进程出现、token 存在或 GlobalMember 可解析就自动进入 ready | subject / association / startup context 受理结论;失败即拒绝。 |
| `RR-L2M-002` | 主语 / scope / policy unknown 时默认放行 | blocked / pending / degraded 或明确拒绝。 |
| `RR-L2M-003` | 将授权瞬时检查变成正文保存,或把 raw body 透明交给 Runtime / Bus / trace | body-free record + typed ref / safe snapshot / controlled context。 |
| `RR-L2M-004` | 把 screening passed 写成 Runtime accepted | 两个独立结论和关联。 |
| `RR-L2M-005` | Runtime 不可用时 member 代答、盲重放或创建 run | waiting / degraded / gap;恢复动作需后续正式规则。 |
| `RR-L2M-006` | 将 committed outcome 直接等同 outbound published / delivered / accepted | outcome ref、outbound decision、attempt、external feedback 分层。 |
| `RR-L2M-007` | delivery / observed / accepted 或 host feedback 覆盖本地历史 | 追加关联事实;旧决定不可原地改写。 |
| `RR-L2M-008` | projection / summary / outlet / reconciliation 修复或批准 truth | rebuild result / stale / gap;不得反写。 |
| `RR-L2M-009` | adapter / fake / planned seam 被当成真实外部协作 | 明确 adapter boundary 和 integration state。 |
| `RR-L2M-010` | 任意直连外部 provider 或通用监听面绕过平台边界 | 拒绝;只允许正式 Bus / host / Runtime seam。 |

### 2.5 哪些边界最容易在后续设计串线

最高风险为五条:项目执行主语 vs 身份锚、member delivery decision vs Runtime acceptance、Runtime outcome vs member outbound decision、publication attempt vs Bus / downstream result、member trace material vs observability truth。后续每个上下文、数据项和交互都必须能映射到其中一侧,不能使用含糊的“成功”“事件状态”“身份卡”“会话”“日志”等词压平边界。

## 3. 职责类型汇总

| 类型 | 内容 |
|---|---|
| 核心职责 | RESP-001、003~008:在场、入站、Runtime 交付、出站、发布、追溯。 |
| 支撑职责 | RESP-002、010:host 协作与外部缺口显式化。 |
| 派生职责 | RESP-009:摘要、能力出口、诊断 / 解释视图。 |
| 明确不负责 | Runtime / Tools / capability / Work / Identity / Governance / host lifecycle / images / Sandbox / Bus delivery / downstream truth / observability backend。 |

## 4. 当前文档问题诊断与前后对比

| 旧表现 | 问题 | 当前收口 |
|---|---|---|
| “嘴耳门面” + B1~B6 | 比喻不能说明哪个事实属于 member,Identity / Event IO 又越界 | 用 RESP-001~010 明确每项决定 / fact 的 owner。 |
| “Attention 做预过滤” | 未区分规则 truth、筛选结论和 Runtime 受理 | Governance 规则外置;member 四态;Runtime acceptance 外置。 |
| “External RPC” | 把 transport / server 和 host 职责混成模块 | 只定义本地请求 / 信号 / 报告与 host truth 分界。 |
| “Publisher 发布 CloudEvent” | 未说明 outcome / decision / attempt / delivery 分层 | RESP-006 / 007 + RR-006 / 007 明确。 |
| “Identity Card” | 容易吸收 Work / Identity truth | 只受理双锚 ref 并形成本地 presence。 |
| “audit events 写 observability” | 混淆材料形成与 observed truth | RESP-008 只拥有安全材料与 handoff attempt。 |

## 5. 设计取舍

| 取舍 | 结论 | 理由 |
|---|---|---|
| 是否把 host collaboration 合入 presence 职责 | 仓级职责相关但 owner 分开表达 | member 的 presence 是本地 truth;host 反馈只能是外部 ref / snapshot。 |
| 是否把订阅、筛选、投递合成“入站管道” | 不合并 | 三者来源、owner、失败语义和数据暴露不同。 |
| 是否把出站决定和发布 attempt 合并 | 不合并 | 发布失败不得回滚决定,delivery truth 在 Bus。 |
| 是否把 summary / outlet 归核心写职责 | 不归 | 二者是派生只读面,能力出口还可裁剪。 |
| 是否将 gap / degraded 当单独业务能力 | 不单独成能力 | 它是所有外部 seam 必须显式表达的横切责任。 |

## 6. 结构化中间产物

- 本仓职责: `RESP-L2M-001~010`。
- 隐式行为红线: `RR-L2M-001~010`。
- 易混淆 owner 边: Runtime 入 / 出、host、Bus、Governance、Work / Identity、Conversation、Tools / capability、Observability。
- 统一判定: 本仓只拥有“成员容器内交互边界事实”,不拥有相邻仓执行、生命周期、传递、裁决、正文或观测真相。

## 7. 回填草稿

正式 §4 使用“本仓职责 / 非职责 / 易混淆边 / 边界红线”四部分。职责表回填 RESP-001~010;非职责表保留正式 owner;边界红线回填 RR-001~010。不得在正式职责章节写协议、容器、字段、数据一致性或源码模块。

## 8. 门禁自检

| 检查项 | 结果 |
|---|---|
| 做 / 不做 / 易混淆 / 红线是否齐全 | pass |
| 每项职责是否有明确成立产物和不包含范围 | pass |
| 是否把功能动作、上下文关系或实现方案误写成职责 | pass:未误写 |
| Runtime / host / Bus / Governance / Identity / Work / Conversation / Tools / Observability owner 是否保留 | pass |
| 是否处理正文瞬时检查与持久化 / raw forwarding 的差别 | pass |
| 是否新增协议、字段、容器、数据或技术结论 | pass:未新增 |
| Step 3 总门禁 | `pass` |

下一允许动作仅为创建 `01_arch_step_04_system_context.md`;正式 `01` 仍禁止修改。
