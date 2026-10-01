# Step 7 · 核心能力闭环

> 状态：`校准完成，门禁通过`  
> 对应正式文档：`00-需求文档.md` §7「核心能力闭环」  
> 对应 SOP：`standards/document/需求文档讨论流程_SOP.md` Step 7  
> 直接输入：`00_req_step_02_position_boundary.md`、`00_req_step_04_goals_non_goals.md`、`00_req_step_06_consumers_dependencies.md`、`draft/01_项目作用与交互对象.md`、`draft/02_功能推演.md`、`draft/03_模块划分与分层.md`。  
> 本步只收敛能力成立结构，不把接口、事件、DTO、组件、路由、代码目录或实施顺序写成核心闭环。所有尚未闭合的 SDK/owner surface 继续保持 blocker。

## 1. Step 状态与执行计划

- 状态：`[x] 已完成`
- 当前模块：`core-capability-loop`
- 思考记录：`[x]`
- 结构化写入：`[x]`
- 自检：`[x]`
- gate_status：`pass`
- 回填位置：正式 `00-需求文档.md` §7「核心能力闭环」

### 1.1 Step 内计划

- [x] 读取 Step 2、Step 4、Step 6、前置 draft 和 Step 7 SOP/书写规范。
- [x] 从“没有 Chat 会缺什么”而不是从 UI 功能清单开始定义仓存在必要性。
- [x] 提炼 3～5 个必须共同成立的核心能力，并区分能力成立关系与运行时/实施顺序。
- [x] 明确每个能力节点的前置、退出条件和独立停审点。
- [x] 将 Desktop-first 记录为平台实现约束，不把 Tauri、React、Capacitor 或 SDK 方法名放进闭环图。
- [x] 区分核心闭环、外围增强和边界外能力。
- [x] 形成候选功能到能力节点的回填映射，不在本步展开用户故事、功能编号、接口或验收正文。
- [x] 完成复杂度判断、待确认事项、blocker 和进入 Step 8 的门禁检查。

## 2. 本步输入与来源边界

| 输入 | 本步使用方式 | 不直接继承的内容 |
|---|---|---|
| Step 2 本仓定位与边界 | 固定 Chat 是跨平台客户端产品，拥有 UI/客户端局部状态，不拥有 owner truth。 | 旧技术栈和服务端对象命名。 |
| Step 4 目标与非目标 | 确认产品入口、理解协作事实、受控交互和恢复体验是目标；业务 truth、SDK、Runtime、Bridges 等是非目标。 | 未经当前 draft 重新确认的历史指标。 |
| Step 6 使用方与依赖 | 固定 `L0-sdk` 为唯一应用接入边界，owner 通过 runtime/event/ref 被消费。 | sibling package path dependency、内部 bus 和私有 API。 |
| `draft/01~03` | 提供 Desktop-first、四个能力候选、模块与状态预演。 | draft 中尚未确认的技术细节、组件名和移动端方案。 |
| 上游正式文档 | 确认 Conversation、Governance、Artifact、Workspace、Member、Runtime 等 truth owner。 | 将 owner 的内部实现、DTO 或事件名转成 Chat 能力。 |

## 3. SOP 问题回答

### 3.1 如果没有 L5-chat，系统会缺什么不可替代的能力？

如果没有 L5-chat，系统仍可能拥有 Conversation、Governance、Artifact、Workspace、Runtime 等正式事实，但缺少一个面向最终用户的统一协作入口。用户无法在一个跨平台产品中持续完成以下闭环：

1. 进入当前可见的 group/channel/dm/thread 或项目协作语境；
2. 理解来自多个 owner 的对话、成员、项目、Gate、Artifact 和运行摘要；
3. 编辑草稿、选择目标、发起消息或受控治理意图，并看懂结果尚未确认、已确认、被拒绝、失败或未知的区别；
4. 在变化、断线、应用重启、缓存过期和多端恢复后，继续看到有来源、有可见性、有新鲜度标记的协作状态。

因此 Chat 的不可替代能力不是“保存消息”或“提供一个窗口”，而是把正式 owner 的安全结果组织成可理解、可操作、可恢复的客户端协作体验，同时保持各 owner 的真相边界。

### 3.2 Chat 成立必须共同具备哪些能力？

Chat 至少必须共同具备以下四种能力：

| 能力 | 必须成立的原因 | 缺失后果 |
|---|---|---|
| 安全协作语境可被进入与保持 | 没有可验证的 actor、scope、入口和选择，页面无法知道正在展示哪个协作语境。 | 用户会在错误 scope、过期链接或已撤销权限下继续浏览。 |
| 正式协作事实可被安全、可解释地显化 | 只有导航没有可理解的 owner 事实，Chat 只是空壳；用户无法读懂 Turn、Gate、Artifact 或状态摘要。 | 展示层会自行补字段、猜状态或复制 owner truth。 |
| 用户意图可被受控发起并获得可区分反馈 | 纯只读界面无法完成发送、重试和受控治理入口；但动作必须经过正式 owner。 | 用户会把按钮点击、网络 ACK 或 optimistic 状态误认为业务完成。 |
| 变化、失败、离线与恢复可维持展示连续性 | 没有变化和恢复语义，客户端无法应对断线、过期、重复、权限撤销和 unknown outcome。 | 多端状态漂移，缓存被误当真相，重试可能造成重复副作用。 |

这四项共同构成 Chat 的最小产品闭环。Desktop-first 只规定首版先在哪个 shell 验证闭环，不增加第五个业务能力节点；可访问性、安全、跨端一致性和可观察交接是四项能力的横向成立条件。

### 3.3 哪些能力缺一个，Chat 就不算真正成立？

- 没有协作语境进入能力，用户无法确定当前展示对象和 scope；
- 没有正式事实显化能力，页面无法保证内容来自正确 owner，也无法表达不可见、过期和部分结果；
- 没有受控意图能力，Chat 只能展示，不能支持其作为协作入口的必要交互；
- 没有变化/恢复能力，断线或多端场景会让页面停留在无法解释的旧状态。

任何一项缺失时，最多只能称为局部 demo、只读预览或静态 shell，不能称为完整的 L5-chat 产品闭环。上游合同尚未闭合时，能力可以进入设计，但其运行状态必须为 `pending / blocked / waiting / degraded`，不能伪称已成立。

### 3.4 哪些能力是外围增强？

以下能力有产品价值，但不决定 Chat 的最小闭环：

- 全局搜索、高级过滤、消息索引和智能预取；
- 富文本增强、复杂附件编排、多窗口布局和个性化主题；
- Desktop 托盘徽标、系统分享、快捷键扩展和细粒度通知偏好；
- Mobile 推送、后台恢复、手势和原生分享；
- 高级诊断面板、支持人员视图和更丰富的低敏观测 handoff；
- 离线内容扩展、跨端偏好同步和高级阅读标记。

这些能力只能在核心节点已有明确输入、输出、失败和安全边界后进入后续小循环，不能反过来定义 Chat 的存在必要性。

### 3.5 哪些能力根本不属于 Chat？

- 创建、修改、删除或确认 Conversation、Turn、Participant、Project、ProjectMember、Member、Gate、Approval、Decision、Artifact、Workspace、Runtime 或 Observability truth；
- 实现通用 SDK、服务私有 API、内部 bus、共享数据库、Runtime 推理、Tools 执行、外部平台映射或 Observability backend；
- 计算 Policy/Authorization、批准/拒绝 Gate、推进项目/工作项、生成 Artifact 版本/血缘、判断 Runtime outcome 或重建 Workspace projection；
- 以按钮点击、HTTP/websocket ACK、通知送达、缓存存在、页面刷新或本地 optimistic 状态替代 owner committed result；
- 把 Tauri、Web、Capacitor 或其他平台 shell 的生命周期作为业务 truth。

## 4. 当前文档问题诊断

| 历史或预期说法 | 问题 | Step 7 修订 |
|---|---|---|
| “Chat 就是消息 UI” | 只覆盖渲染，遗漏 scope、Gate、Artifact、状态反馈和恢复。 | 定义四节点闭环，消息渲染只是事实显化的一部分。 |
| “Chat 只做展示，所以不需要发送和 Gate 交互” | 把展示层交互误解为业务写入；用户仍需要受控提交入口。 | 保留意图发起和结果展示，但业务提交归 owner。 |
| “Web/Desktop/Mobile 同时成为首版范围” | 将平台交付优先级混入能力闭环，扩大 V1 复杂度。 | Desktop-first 是实现约束；Web 共享 UI，Mobile 暂为 Capacitor 候选。 |
| “AG-UI/WebSocket/旧事件流就是 Chat 的核心能力” | 把 transport/事件机制写成产品能力，且可能绕过 SDK。 | 能力写成变化与恢复的产品语义，具体 seam 后移 Step 12。 |
| “ChatThread/ReplyState/MemberCard 是服务端对象” | 体验对象可能变成 shadow truth。 | 仅允许作为 Chat-local view model 或状态载体。 |
| “GateCard 点击等于审批成功” | transport/交互反馈不等于 Governance decision。 | 只允许 `submitted / pending / confirmed / rejected / failed / unknown` 分层。 |

## 5. 设计取舍

### 5.1 从功能清单定义闭环 vs 从仓存在必要性定义闭环

| 方案 | 优点 | 风险 | 结论 |
|---|---|---|---|
| 先列消息、卡片、通知和平台功能 | 容易快速罗列页面 | 容易遗漏 scope、失败、恢复和 truth 边界，形成孤儿功能 | 不采用。 |
| 先定义 Chat 成立所需能力，再映射功能 | 能区分必要能力、外围增强和边界外能力，方便后续追溯 | 需要后续每个节点单独收敛故事、功能和规则 | 采用。 |

### 5.2 将 Desktop-first 作为核心节点 vs 作为横向实现约束

| 方案 | 优点 | 风险 | 结论 |
|---|---|---|---|
| 把 Desktop/Tauri 作为核心能力节点 | 直接表达首版目标 | 把平台实现混入产品闭环，未来切换平台会破坏需求结构 | 不采用。 |
| 把 Desktop-first 作为四节点的首版验证约束 | 先收敛产品能力，再指定首版 shell；便于后续 Web/Mobile 复用 | 需要在后续架构/配置文档明确平台边界 | 采用。 |

### 5.3 自研完整客户端 vs fork 完整开源聊天产品

| 方案 | 优点 | 风险 | 结论 |
|---|---|---|---|
| fork Element/Mattermost/Rocket.Chat 等完整产品 | 初始聊天页面快 | 后端模型、权限、事件、消息真相与 Quantalithos owner 不匹配，迁移成本和安全债务高 | 不采用。 |
| 所有 UI、编辑器、虚拟列表和平台能力全部自研 | 控制力高 | 重复建设成熟基础设施，拖慢 Desktop-first 验证 | 不采用。 |
| 自研 Chat product core，复用开源 UI/编辑器/容器 | 保留产品边界和状态语义，同时降低基础设施成本 | 需要持续维护 SDK adapter 和开源依赖治理 | 采用。 |

## 6. 结构化中间产物

### 6.1 仓存在必要性结论

`L5-chat` 的存在必要性是：为正式 owner 的协作事实提供统一、跨平台、可理解、可操作且可恢复的客户端入口。该入口必须能够保持安全 scope，将正式结果映射为可访问的页面和卡片，受控发起用户意图，并在变化、失败、离线和恢复时维持可解释的状态。

Chat 不因拥有这些体验能力而拥有 Conversation、Governance、Artifact、Workspace、Member、Runtime 或 Observability truth。正因为这些真相分散在不同 owner，才需要一个独立的客户端产品层负责统一呈现和交互状态。

### 6.2 核心能力闭环定义

Chat 的核心能力闭环不是功能清单的集合，而是四项能力共同成立的关系：用户首先能够进入并保持一个经过验证的协作语境；随后能够看到来自正式 owner、带有可见性和新鲜度语义的协作事实；在此基础上，用户能够经受控入口发起意图并得到区分 transport 与业务结果的反馈；最后，变化、失败、离线和恢复机制使客户端能够重新校准并继续显示该协作语境。缺少其中任何一项，Chat 就会退化为静态 UI、未经授权的聚合器或无法解释的本地缓存。

### 6.3 核心能力闭环图

```text
协作语境能够被安全进入与保持
              ->
正式协作事实能够被安全、可解释地显化
              ->
用户意图能够被受控发起并获得可区分反馈
              ->
变化、失败、离线与恢复能够维持展示连续性
```

图中的箭头只表示能力成立的逻辑依赖关系，不表示接口调用顺序、事件传播顺序、运行时调用链或开发实施步骤。Desktop-first、Web shared UI 和 Mobile 临时方案不进入此图，因为它们是平台承载选择而非 Chat 的业务能力。

### 6.4 能力层级划分表

| 分类 | 内容 |
|---|---|
| 核心能力闭环 | 1. 安全协作语境进入与保持；2. 正式协作事实安全显化；3. 用户意图受控发起与结果反馈；4. 变化/失败/离线/恢复下的展示连续性。 |
| 外围增强能力 | 搜索、过滤、富文本增强、复杂附件、通知偏好、多窗口布局、桌面托盘、跨端偏好同步、高级诊断、Mobile 原生体验增强。 |
| 边界外能力 | owner truth 创建/修改/确认、SDK 通用实现、内部 bus、服务私有 API、Policy/Authorization、Runtime/Tools 执行、Artifact 正文/版本/血缘、Workspace projection、Bridges 外部映射、Observability backend。 |

### 6.5 能力节点停审卡片

#### 节点 N1：安全协作语境进入与保持

| 项目 | 结论 |
|---|---|
| 能力说明 | 用户能够在当前 actor、scope 和 visibility 语境下进入 group/channel/dm/thread、项目、成员、Gate 或 Artifact 入口，并保留可解释的 route/selection。 |
| 逻辑前置 | 是整个闭环的第一节点；没有安全语境，后续事实和动作无法绑定。 |
| 进入条件 | Chat 边界明确不创建 Conversation/Project/Member；已有 owner safe ref、scope 和 visibility 输入类别。 |
| 退出条件 | 已定义入口可用、受限、过期、不可见、等待和重连姿态；已定义 scope 变化、登出和撤销后的本地清理原则。 |
| 后续映射 | 导航、路由、scope 选择、深链恢复、入口裁剪和选择状态。 |
| 停审证明 | 不从 URL、缓存、空列表或对象名推断权限和存在性；不会把 route/selection 写成业务 truth。 |

#### 节点 N2：正式协作事实安全显化

| 项目 | 结论 |
|---|---|
| 能力说明 | 用户能够理解由正式 owner 提供的 Conversation/Turn、成员、项目、Gate/Decision、Artifact、Workspace 和 Runtime 安全摘要。 |
| 逻辑前置 | 依赖 N1 的已验证协作语境。 |
| 退出条件 | 已定义 safe view、来源、版本/水位、visibility、fresh/stale/partial/unavailable/blocked 的展示边界；正文、Policy 和生命周期仍留在 owner。 |
| 后续映射 | Turn 表现渲染、GateCard、Artifact 引用/预览、成员/项目/运行状态卡和来源标签。 |
| 停审证明 | 不复制 owner truth，不从 ref 猜正文/权限，不将缺失或 partial 当 complete。 |

#### 节点 N3：用户意图受控发起与结果反馈

| 项目 | 结论 |
|---|---|
| 能力说明 | 用户能够编辑草稿、选择目标、发送消息、重试失败操作或提交受控治理意图，并看到从本地意图到正式结果的区分状态。 |
| 逻辑前置 | 依赖 N1 的目标语境和 N2 的可理解事实。 |
| 退出条件 | 已定义 draft/selection、submitted/pending/confirmed/rejected/failed/unknown、receipt/result/probe 的显示边界；命令真相归 owner。 |
| 后续映射 | composer、发送/重试、GateCard action、command attempt 状态、结果链接和 unknown 处理。 |
| 停审证明 | 不把按钮、HTTP/websocket ACK、AG-UI ACK、toast 或 optimistic state 当业务成功；不盲目重放副作用。 |

#### 节点 N4：变化、失败、离线与恢复下的展示连续性

| 项目 | 结论 |
|---|---|
| 能力说明 | 客户端能够消费正式变化并在断线、重复、缺口、权限撤销、应用重启、缓存过期和多端并行后恢复到可解释的页面状态。 |
| 逻辑前置 | 依赖 N1 的语境、N2 的展示模型和 N3 的命令结果关联。 |
| 退出条件 | 已定义 formal change/cursor/resume 的消费意图、reconnecting/stale/unknown/blocked 姿态、缓存版本和恢复清理原则。 |
| 后续映射 | event reducer、去重、gap、cursor-expired、requery、离线展示、cache restore 和 Desktop 重启恢复。 |
| 停审证明 | 不直订内部 bus，不从时间戳猜 cursor，不用缓存继续授权，不把恢复后的网络连接当业务完成。 |

### 6.6 能力节点执行顺序与停审门禁

| 顺序 | 能力节点 | 必须先收敛 | 节点停审后才允许讨论 |
|---|---|---|---|
| 1 | N1 安全协作语境进入与保持 | scope、visibility、route/selection、撤销和清理边界 | N2 的事实 view 和展示状态。 |
| 2 | N2 正式协作事实安全显化 | safe view、来源、版本/新鲜度、降级和正文禁止项 | N3 的草稿、发送和 Gate 操作。 |
| 3 | N3 用户意图受控发起与结果反馈 | command intent、receipt/result、幂等、unknown 和重试边界 | N4 的变化关联、恢复和多端连续性。 |
| 4 | N4 变化、失败、离线与恢复连续性 | cursor/resume、reducer、cache、requery、清理和 fail-closed | 跨能力追溯、外围增强和正式装配。 |

这里的顺序是讨论依赖关系，不是实施排期。每个节点的 Step 8～14 小循环必须完成故事、功能、规则、数据、接口、非功能和验收承接后，才可以标记节点停审；未停审的节点不能与后续节点混写。

### 6.7 功能回填映射结论

| 预期功能族 | 回填能力节点 | 说明 |
|---|---|---|
| group/channel/dm/thread 入口、route、scope 选择 | N1 | 只负责安全进入和保持语境，不创建 Conversation。 |
| Turn 表现渲染、来源标签、项目/成员/运行摘要 | N2 | 只消费 safe view/ref，显示来源和降级状态。 |
| GateCard、Artifact 引用/预览 | N2 + N3 | N2 显化结果，N3 处理受控意图；不把卡片点击当 owner 成功。 |
| draft、selection、focus、composer | N1 + N3 | 绑定当前语境，属于 Chat-local 状态。 |
| send/retry、审批请求、command 状态 | N3 | 由 SDK 发起，结果以 owner receipt/result/event 为准。 |
| formal change、cursor/resume、reducer、reconnect | N4 | 不直订内部 bus，不从客户端时间戳猜顺序。 |
| Desktop 重启、缓存、离线阅读、恢复 | N4 | 只恢复展示和未提交草稿；不制造离线业务成功。 |
| 键盘、屏幕阅读、敏感字段遮蔽、缓存清除 | N1～N4 横向约束 | 保护每个能力节点，不单独形成业务节点。 |

## 7. 复杂度判断

| 复杂度来源 | 判断 | 控制方式 |
|---|---|---|
| 多 owner safe view | 高 | 统一经 SDK adapter，按 owner 保存 provenance/visibility/freshness，不做 Chat BFF。 |
| 命令与 unknown outcome | 高 | 所有副作用动作分离 intent、receipt、confirmed 和 probe；不以 transport ACK 收口。 |
| 事件、cursor、重连和多端恢复 | 高 | 只消费正式 event/resume；reducer 显式处理 duplicate/gap/expired/revoked。 |
| Desktop-first shell | 中 | 先锁定 shared core 与 Tauri candidate 的边界，暂缓移动端原生复杂度。 |
| 可访问性与客户端安全 | 中高 | 把状态语义、遮蔽、清理、focus 和低敏诊断作为横向门禁。 |
| 开源组件集成 | 中 | 复用组件和容器，不 fork 完整聊天产品；执行 license、版本和安全审计。 |

整体复杂度可控的前提是 Chat 不承担服务端聚合、权限裁决和业务写入。若 SDK/owner surface 长期未闭合，设计只能停留在能力级 pending，不能通过本地 fake 或缓存绕过依赖。

## 8. 正式文档回填草稿

正式 `00-需求文档.md` §5 可回填为：

> `L5-chat` 存在的必要性，是为分散在多个正式 owner 中的协作事实提供统一、跨平台、可理解、可操作且可恢复的客户端入口。Chat 成立必须共同具备四项能力：安全协作语境能够被进入与保持；正式协作事实能够被安全、可解释地显化；用户意图能够被受控发起并获得可区分反馈；变化、失败、离线与恢复能够维持展示连续性。
>
> 这四项能力构成一条逻辑闭环。Chat 可以拥有路由、view model、客户端 store、草稿、选择、缓存、reducer、状态反馈和平台 shell 体验，但不拥有 Conversation、Turn、Participant、Project、Member、Gate、Decision、Artifact、Workspace、Runtime 或 Observability 真相。Desktop-first 是 V1 的平台验证约束，不是独立业务能力；Web shared UI 和 Mobile 临时 Capacitor 方向也不能改变 owner 边界。
>
> 搜索、富文本增强、复杂附件、多窗口布局、通知偏好、高级诊断和移动端原生体验属于外围增强。业务真相创建/修改、SDK 通用实现、内部 bus、服务私有 API、Policy/Authorization、Runtime/Tools 执行、Artifact 正文/版本/血缘、Workspace projection、Bridges 映射和 Observability backend 属于边界外能力。

## 9. 待确认事项与 blocker

| ID | 待确认事项 | 影响节点 | 当前状态 |
|---|---|---|---|
| `CHAT-UP-001` | SDK 是否能为四个节点提供统一 typed query/command/event adapter、错误和 trace surface？ | N1～N4 | `blocked`，登记在 Step 6，留待 Step 12。 |
| `CHAT-UP-002` | Conversation 的 visibility、safe view、change cursor、resume 和分页消费合同如何闭合？ | N1、N2、N4 | `blocked`，不复制 Conversation DTO。 |
| `CHAT-UP-003` | Governance Gate/Decision 的 receipt、幂等、unknown probe 和状态事件如何暴露？ | N2、N3、N4 | `blocked`，GateCard 只保持受控入口。 |
| `CHAT-UP-004` | Artifact safe preview、ref、redaction 和 visibility contract 是否稳定？ | N2 | `pending`，只保留引用/摘要/不可预览。 |
| `CHAT-UP-005` | Workspace safe view、freshness、attention、cursor 和 export 是否能供客户端消费？ | N1、N2、N4 | `blocked`，Chat 不自行拼 Inbox/attention。 |
| `CHAT-UP-006` | Identity/Work/Member/Runtime 的摘要层级是否足够支撑安全卡片？ | N2 | `pending`，不跨 owner 推断。 |
| `CHAT-UP-007` | Observability 的低敏交互观测和 handoff surface 如何闭合？ | N4、横向安全 | `deferred/blocked`，不直写 backend。 |
| `CHAT-DRAFT-PLATFORM-001` | Tauri Desktop、React/TypeScript shared UI 和 Capacitor 临时方案的具体版本/宿主能力如何确定？ | 横向 | `后移` 到 01～04；不影响能力闭环。 |

## 10. Step 7 自检与门禁

| 检查项 | 结果 | 说明 |
|---|---|---|
| 是否从仓存在必要性而非功能清单出发？ | 否 | 已先说明没有 Chat 时缺失的统一协作入口。 |
| 是否定义 3～5 个核心能力？ | 是 | 已定义 N1～N4 四个节点。 |
| 闭环图节点是否只写能力成立描述？ | 是 | 未写接口名、事件名、字段、数据库动作或组件名。 |
| 箭头是否被解释为逻辑依赖而非调用顺序？ | 是 | 已在图后明确说明。 |
| 是否区分核心、外围和边界外能力？ | 是 | 已形成能力层级划分表。 |
| 是否为每个节点提供执行顺序与停审条件？ | 是 | 已形成节点卡片和顺序门禁表。 |
| 是否把 Desktop-first 混入核心能力图？ | 否 | Desktop-first 只作为平台实现约束。 |
| 是否把功能编号、接口或事件链当作闭环本身？ | 否 | 功能仅在回填映射中出现，exact surface 后移。 |
| 是否引入未确认的 owner/SDK truth？ | 否 | `CHAT-UP-001~007` 保持 blocker/pending/deferred。 |
| 是否完成正式章节回填草稿？ | 是 | 已提供 §5 回填文本。 |

### 10.1 进入 Step 8 条件

- Chat 的存在必要性和四节点闭环已收敛；
- 每个节点有逻辑依赖、功能映射、进入/退出和独立停审条件；
- 外围增强和边界外能力已移出闭环；
- Desktop-first 未被写成业务真相或核心节点；
- 不依赖未确认的 SDK 方法、事件 topic、DTO 或内部 bus；
- 允许创建并完成 `00_req_step_08_user_stories.md`，按节点逐个进入用户故事小循环。

## 11. 本步结论

Step 7 将 `L5-chat` 的核心闭环收敛为：**安全进入协作语境 → 安全显化正式协作事实 → 受控发起用户意图并反馈结果 → 在变化、失败、离线和恢复中保持展示连续性**。这是 Chat 作为跨平台客户端产品成立的最小结构。V1 Desktop-first 只决定首版验证 shell，不改变能力结构，也不把 Tauri、React、Capacitor 或 SDK surface 升格为需求真相。

本步已具备进入 Step 8 的条件；后续用户故事必须按 N1→N4 的顺序逐节点收敛，未获正式 owner/SDK 合同的内容继续标记为 `pending / blocked / waiting`。\n## 12. 原型修复回写\n\n冻结原型将核心闭环具体化为：从群聊或项目进入正确语境，阅读整体 BPMN 与阶段子流程，查看并行分支/Gate/Artifact/成员状态，发起受控动作并接收 confirmed/failed/unknown/recovery 展示。项目与项目进度仍是同一 N1/N2 展示上下文，流程计算和治理结论不进入闭环所有权。\n\n- 影响能力：N1～N4 均覆盖。\n- 新增承接：`F-CHAT-018~021`。\n- 自检：原型交互没有改变四节点闭环或制造客户端业务 truth。

### 逐章修复结构化结果（2026-10-01）

以下为本 Step 已复核的当前需求级结果，替代前轮回填草稿中对应范围；保留旧轮记录用于差异审计，不代表实现或验收通过。

本轮修复将项目详情与流程下钻归入 N1/N2，将流程版本、分支变化、绑定撤销和成员可见性归入 N4；不新增 Chat 自有的流程编排能力。


| 节点 | 必须成立的能力 | 退出条件 |
|---|---|---|
| N1 安全协作语境进入与保持 | 在正式 actor、scope 和 visibility 下进入 group/channel/dm/thread、项目或相关协作语境。 | 入口可用、受限、过期、不可见、等待、重连和撤销/清理姿态明确；route/selection 不成为业务 truth。 |
| N2 正式协作事实安全显化 | 以 owner safe view/ref/summary 显示 Turn、成员、项目、Gate/Decision、Artifact、Workspace 和 Runtime。 | 来源、版本/新鲜度、visibility、partial/stale/unavailable/blocked 可解释；不复制 owner 正文或推断缺失结果。 |
| N3 用户意图受控发起与结果反馈 | 编辑草稿、选择目标、发送或重试普通意图、提交受控治理意图并观察结果。 | draft、submitted/pending、confirmed/rejected/failed/unknown、receipt/result 分层；按钮或 ACK 不当作业务成功。 |
| N4 变化、失败、离线与恢复连续性 | 消费 SDK 正式变化，在 duplicate、gap、撤销、断线、重启和缓存失效后恢复可解释状态。 | cursor/resume、requery、stale、unknown、blocked 和缓存上限明确；不直订 bus，不离线授权。 |

```text
N1 安全进入语境 → N2 显化正式事实 → N3 发起受控意图并解释结果 → N4 在变化/失败后重新校准
```

箭头仅表示能力成立的逻辑依赖，不表示接口调用、事件传播或实施顺序。四节点缺一，Chat 的最小产品闭环不成立。搜索、高级过滤、通知/托盘、富文本/复杂附件、Mobile 增强和高级诊断属于外围增强；owner truth 写入、SDK 通用实现、内部 bus、Runtime/Tools/Bridges/Observability backend 属于边界外。Desktop-first 和可访问性是横向约束。
