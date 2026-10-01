# Step 3 · 职责边界

> 架构主题：明确 `L5-chat` 在全局职责分工中承担什么、排除什么，以及哪些相邻职责最容易被客户端误吸收。  
> 当前状态：已完成本 Step 的问题回答、历史诊断、结构化产物、回填草稿和跨边界自检；允许进入 Step 4。  
> 直接输入：`01_arch_step_01_requirements_baseline.md`、`01_arch_step_02_arch_goals_constraints.md`、正式 `00` §2/§4/§6/§10/§11。

## 1. Step 开工确认

| 项目 | 记录 |
|---|---|
| Step | Step 3 · 职责边界 |
| 前置门禁 | Step 2 `pass` |
| 本步输出 | 做/不做/易混淆职责表、边界红线、架构单元职责预分界 |
| 正式回填 | §4 职责边界 |
| 本步不展开 | 系统上下文图、限界上下文、容器、数据所有权、接口协议和技术选型 |

## 2. SOP 问题回答

### 2.1 这个仓具体做什么？

`L5-chat` 负责把正式 owner 允许消费的协作能力组织成跨平台客户端产品体验。它拥有用户进入语境、导航、渲染、局部交互状态、草稿/选择、受控意图、变化消费、缓存恢复、平台宿主适配和可访问性/低敏诊断入口；所有业务结论仍由正式 owner 经 `L0-sdk` 提供。

### 2.2 这个仓具体不做什么？

Chat 不拥有任何 Conversation、Turn、Participant、Project、ProjectMember、GlobalMember/Member、Gate、Decision、Policy、Artifact、Workspace、Runtime 或 Observability backend truth；不实现通用 SDK、认证、内部 bus、服务端命令、Runtime 推理、Tools 执行、外部平台映射、Workspace projection、审计后端或离线业务成功。

### 2.3 哪些能力看起来相关但必须属于其他仓？

- “对话窗口里的消息”仍是 Conversation/Turn truth，不是 Chat message truth。
- “审批卡片的批准/拒绝”仍是 Governance Decision truth，不是 GateCard state truth。
- “成员登录/员工视角”只能是安全入口和摘要展示，认证、session、GlobalMember/Member lifecycle 归对应 owner。
- “项目进度/阻塞”只能展示 Work/Workspace safe view，Chat 不推进 WorkItem 或聚合跨项目事实。
- “Artifact 预览”只能消费 Artifact safe preview/ref，Chat 不保存正文、血缘、Evidence 或 Baseline。
- “运行状态”只能展示 Runtime safe summary，Chat 不执行 Runtime、Tools、Capability 或 Sandbox。
- “事件实时性”只能消费 SDK formal change/resume，Chat 不成为 bus delivery、cursor 或 replay owner。
- “客户端日志/诊断”只能是低敏 handoff 意图，Observability backend、audit truth 和 evidence 不归 Chat。

### 2.4 哪些行为绝不能隐式发生？

1. UI 点击、toast、平台 ACK、网络连接或 cache hit 自动升级为业务成功。
2. 路由、深链、空列表、对象名称或缓存命中自动升级为存在性、权限或可操作性。
3. Chat 根据不同 owner 摘要自行拼出统一生命周期、授权、完成或治理结论。
4. Chat 通过私有 API、内部 bus、共享数据库或本地授权表绕过 `L0-sdk`。
5. unknown 命令被自动重放，或重连后按旧意图盲目产生副作用。
6. 失效/撤销语境继续展示受保护内容，或缓存继续提供可操作入口。
7. local draft、selection、read position、notification 和 cache 改写 owner truth。
8. 平台 shell 为 Desktop、Web 或 Mobile 单独发明业务状态和权限语义。

## 3. 历史材料诊断

| 历史职责口径 | 串线风险 | 当前职责处理 |
|---|---|---|
| “统一协作界面编织六域对象” | 把消费组合误写成跨域业务 owner | 改为 owner-safe view/ref 的产品组合，Chat 不拥有域对象。 |
| “员工登录视图” | 可能把认证、credential、session 或 Member lifecycle 带入 Chat | 只保留 actor/session/visibility 入口状态和受控跳转，认证与身份真相外置。 |
| “在用户上下文内完成审批” | 容易把 GateCard 操作等同 Decision committed | 仅保留授权语境下的治理意图入口和结果分层。 |
| “项目协作主入口、收件箱” | 可能把 Workspace/Work 聚合和 attention truth 转入 Chat | Chat 可提供入口与展示，正式 projection/attention 由 owner 提供。 |
| “前端事件上报 Observability” | 可能让 UI log 变成正式审计/观察 truth | 只保留低敏诊断 handoff seam，backend truth 归 Observability。 |
| “timeline registry、view、adapter”直接列作职责 | 把实现结构当作架构职责 | 只保留职责层：渲染、组合、意图、变化恢复和平台适配。 |

## 4. 做 / 不做 / 易混淆职责表

| 职责项 | 类型 | 说明 |
|---|---|---|
| 跨平台协作客户端产品体验承载 | 做 | Chat 的核心职责是把正式协作能力组织成用户可理解的入口与界面。 |
| 安全协作语境进入、路由和导航 | 做 | Chat 负责进入、保持和离开当前语境的客户端体验，但不拥有 scope/visibility truth。 |
| owner safe view/ref/summary 的展示组合 | 做 | Chat 可组合多个来源的获准材料并保留来源与降级姿态。 |
| Turn、Gate、Artifact、成员/项目/运行摘要的安全显化 | 做 | Chat 负责表现层语义和可访问路径，不重定义对象生命周期。 |
| draft、selection、focus、展开和 local intent 的局部状态 | 做 | 这些是 Chat-owned local truth，不能被解释为 owner 业务结果。 |
| 发送与治理意图的受控发起和结果反馈 | 做 | Chat 提供 intent、等待、结果和 unknown 的用户路径，经 SDK 交给 owner。 |
| SDK formal change/resume 的客户端消费与状态更新 | 做 | Chat 维护 reducer 和页面连续性，但不拥有 bus delivery 或事件 truth。 |
| 本地展示缓存、重启恢复和离线提示 | 做 | Chat 可恢复安全展示和草稿，但不延长授权、不离线确认业务。 |
| Desktop/Web/Mobile shell 的体验适配 | 做 | shell 提供窗口、输入、通知、存储、深链和辅助技术能力，不改变业务语义。 |
| 客户端安全、可访问性和低敏诊断入口 | 做 | Chat 负责等价路径、最小披露和用户可理解的连接/恢复解释。 |
| Conversation/Turn/Participant truth 与生命周期 | 不做 | 由 `L1-conversation` 拥有；Chat 只消费 safe view/ref/change。 |
| Identity/Member、认证、credential、session 和成员生命周期 | 不做 | 由身份/安全/Member owner 拥有；Chat 不签发或裁决权限。 |
| Project/ProjectMember/WorkItem/Iteration 和项目进度 truth | 不做 | 由 `L1-work` 或 Workspace owner 拥有；Chat 只展示安全摘要。 |
| Gate/Decision/Policy/Approval/治理裁决 | 不做 | 由 `L1-governance` 拥有；GateCard 不生成或确认 Decision。 |
| Artifact/Evidence/Baseline 正文、版本与血缘 | 不做 | 由 `L1-artifact` 拥有；Chat 只消费 body-free ref/preview。 |
| Workspace projection、attention、freshness 和 export truth | 不做 | 由 `L1-workspace` 拥有；Chat 不重建跨域视图。 |
| Runtime run/decision/checkpoint/outcome、Tools、Capability、Sandbox 执行 | 不做 | 由 L2/L3/L4 owner 拥有；Chat 只显示 safe status 或提供受控入口。 |
| 通用 SDK、协议、错误、重试、认证和事件传输实现 | 不做 | 由 `L0-sdk`/共享层拥有；Chat 只使用正式 surface。 |
| 内部 bus、broker、topic、offset、replay、delivery truth | 不做 | Chat 不直订内部 bus；只能消费 SDK formal change/resume。 |
| Observability backend、正式 audit/evidence/report truth | 不做 | Chat 只产生低敏客户端诊断意图或安全 handoff。 |
| 外部平台映射和外部消息正文 | 不做 | `L6-bridges` 负责外部平台生命周期，Chat 不吸收其正文。 |
| 完整离线业务工作流和离线审批 | 不做 | 当前离线只承载展示缓存、草稿、恢复和待处理提示。 |
| route/context 与 owner scope/visibility | 易混淆职责 | route 是 Chat-local 位置，scope/visibility 必须来自正式 owner。 |
| view model 与 owner truth | 易混淆职责 | view model 只组合安全材料和本地状态，不能成为第二真相。 |
| GateCard 状态与 Governance Decision | 易混淆职责 | 卡片可显示 submitted/pending/unknown，但 confirmed 依赖正式 owner result。 |
| command attempt 与 owner receipt/result | 易混淆职责 | 本地 attempt 只说明客户端意图/尝试，不能代替 receipt/result。 |
| transport ACK 与业务提交 | 易混淆职责 | 网络或 SDK 层确认不代表 owner 已接受或完成。 |
| formal change cursor 与 bus delivery cursor | 易混淆职责 | Chat 只保存 SDK consumer 语境，不拥有 broker offset 或 delivery truth。 |
| local cache 与当前 owner truth | 易混淆职责 | cache 只能作为带版本/visibility 的受限展示材料，不能放行权限。 |
| member/project/runtime panel 与对应 owner 生命周期 | 易混淆职责 | panel 是 view，不能跨域推断成员、项目或运行完成。 |
| Workspace attention 与 Chat notification/read state | 易混淆职责 | Chat 可显示和本地隐藏，不能改变 Workspace attention 或 source read receipt。 |
| shell 登录/窗口状态与认证/Member lifecycle | 易混淆职责 | shell 生命周期不是认证成功，也不是成员状态。 |

## 5. 边界红线清单

1. Chat 不创建、修改、删除或确认任何 owner truth。
2. Chat 不私自授予 actor、scope、visibility、Gate 操作资格或预览权限。
3. Chat 不把跨 owner view 组合成新的统一业务对象或生命周期结论。
4. Chat 不把本地 reducer、cache、draft、selection、notification 或 platform state 写回 owner truth。
5. Chat 不绕过 `L0-sdk` 调用 owner 私有 API、内部 bus、共享数据库或 provider/tool/runtime。
6. Chat 不保存外部正文、secret、credential、raw log、runtime/provider/tool/bridge body 或未脱敏 payload。
7. Chat 不把未知、未送达、局部成功、transport ACK 或缓存命中显示为 confirmed。
8. Chat 不在 unknown 下盲重放可能产生副作用的命令。
9. Chat 不以墙上时间、连接状态、topic 或 offset 推断正式变化顺序。
10. Chat 不让平台 shell 差异改变业务状态、owner 权限或结果语义。
11. Chat 不把低敏客户端诊断升级为正式 Observability、audit、evidence 或验收结论。
12. Chat 不把 `L6-bridges` 外部平台对象、消息正文或映射状态写成内部 Conversation truth。

## 6. 架构单元职责预分界

本表只为 Step 5 的上下文划分提供职责输入，不把下列名称当作最终代码模块或路由名：

| 架构单元候选 | 当前职责边界 | 明确不承担 |
|---|---|---|
| 客户端产品 core | 共享 view model、状态语义、页面体验和跨端业务语义 | owner truth、通用 SDK、平台资源 |
| 安全语境与导航 | actor/session/scope/visibility 的进入、保持、清理和 route 组织 | 认证签发、权限裁决、Conversation/Workspace scope truth |
| 正式视图显化 | safe view/ref/summary/preview 的来源保持、组合和降级表达 | 跨域 truth、正文复制、生命周期推断 |
| 意图与结果承接 | draft/selection/local intent/attempt 到 SDK command 和 result posture 的组织 | Conversation/Governance command 本体和业务确认 |
| 变化与恢复连续性 | formal change/resume、reducer、gap/requery、cache/restart/offline 展示 | bus delivery、owner repair、离线业务成功 |
| 平台 shell 与可访问性安全 | Desktop/Web/Mobile 宿主能力、输入、通知、存储、辅助技术和本地清理 | 改变业务语义、授权或 owner result |

## 7. 正式回填草稿

### 7.1 §4 职责边界

`L5-chat` 的职责边界以“客户端体验与局部状态拥有者、正式 owner 能力的安全消费方”为中心。它负责安全语境进入、导航、safe view 显化、草稿与选择、受控意图、正式变化消费、缓存恢复、平台适配和可访问性；它不拥有 Conversation、Governance、Artifact、Workspace、Member、Runtime 或 Observability truth，也不实现通用 SDK、认证、内部 bus、外部平台映射或离线业务成功。route 与 owner scope、GateCard 与 Decision、command attempt 与 receipt/result、cache 与 current truth、shell 登录与认证生命周期是必须持续分开的易混淆职责。

### 7.2 §4 边界红线

Chat 不创建、修改或确认 owner truth，不绕过 `L0-sdk`，不以按钮/ACK/cache/连接状态宣称业务成功，不从 route/空列表/对象名推断权限，不保存 forbidden body，不在 unknown 下盲重放副作用，也不让平台 shell 改变业务语义。上述红线同时约束共享 core、视图组合、意图承接、变化恢复和所有平台 shell。

## 8. 跨边界审计

| 审计项 | 结论 |
|---|---|
| 是否把职责写成系统上下文关系 | 否；外部对象关系留待 Step 4。 |
| 是否把功能清单写成职责 | 否；职责写的是体验承载、状态边界、消费/适配责任。 |
| 是否把实现模块名当作正式架构层 | 否；架构单元名称只作为 Step 5 输入，未锁代码组织。 |
| 是否把 owner truth、认证、SDK、bus、Runtime、Bridges 或 Observability 吸收进 Chat | 否；均明确为不做或易混淆职责。 |
| 是否清楚说明 Chat-local 与 owner truth 的关系 | 是；route、view、attempt、cache、recovery 等局部状态均有 owner 边界。 |
| 是否清楚说明失败和 unknown 的责任归属 | 是；Chat 表示和降级，owner receipt/result 决定业务结论。 |

## 9. Step 自检与门禁

| 检查项 | 结果 | 说明 |
|---|---|---|
| 是否形成做/不做/易混淆三类职责 | pass | 主职责表覆盖客户端、owner、SDK、平台和诊断边界。 |
| 是否明确边界红线 | pass | 12 条红线覆盖 truth、SDK、ACK、cache、unknown、body、shell 和诊断。 |
| 是否避免系统上下文、子域、数据矩阵和协议细节 | pass | 这些内容未在本 Step 展开。 |
| 是否保留上游 blocker 的影响 | pass | blocker 只影响 exact surface 和正向能力，不被写成 Chat 自己的 truth。 |
| 是否完成架构单元职责预分界 | pass | 为 Step 5 逐单元审查提供输入，未提前固化实现结构。 |
| 是否完成正式回填草稿 | pass | §4 主文和红线已形成。 |
| 是否足以进入 Step 4 | pass | 职责与红线已收稳，可以建立系统上下文边界。 |

## 10. Step 门禁

| 层级 | gate_status | gate_reason | next_allowed_action |
|---|---|---|---|
| Step / 模块级 | `pass` | 做/不做/易混淆职责、红线和架构单元预分界已完成并通过跨边界审计。 | 创建并执行 Step 4 `01_arch_step_04_system_context.md`。 |
| 文档级 | `pass` | Chat 的职责与相邻 owner 责任已分离，足以画系统上下文图。 | 进入 Step 4。 |
| 项目级 | `in_progress` | 正式 `01` 仍在校准链；未允许进入 `02`。 | 继续串行完成 Step 4。 |


## 本轮逐章审查与修复（2026-10-01）

> 模式：regression-review / single-agent-serial。前轮记录作为差异材料；本节为当前章节修复基线。前序修复已通过，未闭合合同不升级为 ready。

### 执行计划与输入

- [x] 读取本 Step SOP、书写规范对应章、修复后 00、冻结原型和相关正式 owner 边界。
- [x] 顺序完成问题回答、旧材料诊断、取舍、结构化结果、复杂度判断和回填自检。
- [x] 只回填本 Step 对应现有正式章节并更新 flow/ledger；无实现、测试或 commit。

### 问题回答与诊断

- Chat 做什么？展示项目详情五标签、整体流程/阶段/节点下钻，提供关联群聊和目录入口，保存安全的选中位置及返回上下文。
- 不做什么？不生成 BPMN 业务拓扑，不推进/合并 token，不计算汇聚，不管理 project/conversation 绑定或成员权限。
- 最易混淆什么？“不创建 owner truth”不能误写成 UI 不能经 SDK 发起 command；“不保存正文”不能误写成无法显示 SDK 正式授权预览。
- 旧 §4 将项目进度归 Work/Workspace，缺 Process；红线“Chat 不创建修改任何 owner truth”需要明确直接写禁止与受控提交允许之间的区别。

### 结构化取舍与回填

项目详情与流程 renderer 是协作体验职责；Project/WorkItem 归 Work，Process/Activity/Gateway 归 Process，Workspace 仅供只读 view；Gate 独立归 Governance。外部关系和目录授权均不可本地裁决。预览只消费获准 safe material/受控入口，不复制 Artifact 原始正文进入 store/cache。

回填 §4 职责表、易混淆表、红线。复杂度：边界表足够；后续系统图表达 SDK。自检：可经 SDK 发起正式意图，禁止客户端直接写 truth；不吸收 Process 引擎、Runtime 或 Tools。

### 门禁

- gate_status：pass（架构文档级；上游正向能力继续 blocked/pending）。
- gate_reason：项目详情、只读流程与三类成员职责和禁写边界完成。
- next_allowed_action：进入 Step 4，重新读取其 SOP 与前序输入。
