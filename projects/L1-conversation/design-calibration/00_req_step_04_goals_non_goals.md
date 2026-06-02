# Step 4. 目标与非目标

> 对应 SOP: `standards/document/需求文档讨论流程_SOP.md` Step 4
> 回填章节: `00-需求文档.md` §4 目标与非目标
> 生成日期: 2026-05-31

---

## 1. 本步目标

基于 Step 2 的“平台对话真相仓”边界和 Step 3 的“缺少统一对话真相域会导致协作可见性、跨端消费和审计追溯失真”问题定义,收束 `L1-conversation` 本轮需求要达成的状态和明确不纳入的事项。本步不写功能清单、接口、用户故事、业务规则、数据归属、性能指标或实现方案。

---

## 2. 本步输入

| 输入 | 当前状态 | 本步使用方式 |
|---|---|---|
| `design-calibration/00_req_step_02_position_boundary.md` | 已完成 | 提供仓定位、排除职责和相邻仓边界 |
| `design-calibration/00_req_step_03_problem_context.md` | 已完成 | 提供业务背景、问题定义和后移事项 |
| 旧 `projects/L1-conversation/00-需求文档.md` §3 | 旧目标与非目标 | 提取可迁移目标,剔除功能名、指标和实现项 |
| `product/最终目的.md` | 产品叙事权威 | 承接“协作载体是对话”“先对话后表单”“Conversation 是一等聚合根” |
| `product/六域模型.md` | 六域模型权威 | 承接 Conversation 域与其他五域平权、事件协作和一等聚合根的方向 |
| `standards/document/需求文档书写规范.md` §4.4 | 当前书写约束 | 约束本步输出目标表和非目标表,不得写功能或实现 |

---

## 3. SOP 问题回答

### 3.1 本次需求结束后,应成立哪些状态、边界或能力？

本轮需求结束后,应成立的是“Conversation 作为平台对话真相域”的需求边界,而不是某个具体接口或技术实现。它至少要让后续读者明确:Conversation 拥有对话空间、对话事实、参与者可见性和对话历史的需求主线;Chat、Workspace、Bridges、Runtime、Governance、Artifact、Identity 等仓只能消费、引用或协作,不能替代它拥有对话真相。

同时,本轮需求需要为后续核心能力闭环提供锚点。也就是说,下一步讨论用户、依赖、能力、故事和功能时,都必须围绕“建立对话事实、记录对话事实、让授权消费方读取 / 订阅、让关键跨域事实以对话方式可见、让历史可追溯”这些方向展开。

### 3.2 这些目标如何被验证？

本阶段的验证不是代码测试,而是需求层可审查性。每个目标都应能在后续章节中被追溯:

- 用户与角色章节不会把 Chat UI 或 Runtime 推理者写成 Conversation 的事实所有者。
- 使用方与依赖章节能区分输入依赖、输出消费和事件协作。
- 核心能力闭环能围绕对话真相成立,而不是围绕 UI 展示或 LLM 推理成立。
- 功能需求、业务规则、数据归属和验收标准不会把相邻仓真相混入 Conversation。

### 3.3 哪些事项虽然相关,但明确不纳入当前范围？

以下内容虽然与对话体验强相关,但不纳入 `L1-conversation` 的需求范围:

- Chat 的页面、交互组件、消息渲染和客户端状态。
- Workspace 的个人首页、项目视图、inbox、任务 / 流程 / 成员聚合视图。
- Bridges 对 Mattermost、Slack、Telegram 等外部平台协议和生命周期的适配。
- Runtime 的 LLM 推理、agent loop、tool 调用和记忆写入。
- Governance 的 Gate / Policy / Approval 决策真相。
- Artifact 的正文、版本、证据链和产物生命周期真相。
- Identity 的成员创建、生命周期、角色定义和认证 / 授权。
- Observability / Archive 的全局 trace、metrics、audit store 和长期归档策略。

### 3.4 哪些事情必须交给相邻仓或后续阶段处理？

Chat UI、Workspace 视图、Bridges 外部协议、Runtime 推理循环、Governance 决策、Artifact 正文和 Identity 生命周期必须交给对应相邻仓处理。Conversation 可以提供对话事实、引用、通知或可消费事件,但不接管这些仓的真相。

旧文档中的性能指标、容量目标、AG-UI 映射、四形态、Turn kind、参与者可见性、全文检索和数据保留不在 Step 4 展开。它们不是被删除,而是后移到核心能力、功能需求、规则、数据归属、接口依赖和非功能需求步骤中分开判断。

---

## 4. 当前文档问题诊断

| 位置 | 当前表现 | 问题 | 处理口径 |
|---|---|---|---|
| 旧 `00` §3.1 | 目标直接写 `Conversation 四形态完整`、`Turn 不可变`、`StreamEvents P95`、`PostTurn P95`、`147 事件`、`1.5 亿 Turn/月` | 混合了功能、规则、接口、非功能和容量指标 | Step 4 改为需求层状态 / 边界目标,细项后移 |
| 旧 `00` §3.2 | 非目标已有 Gate 决策、Artifact 正文、Bridges 协议、通知策略等 | 方向有价值,但缺 Chat、Workspace、Runtime、Identity、Observability / Archive 等最新边界 | 补齐非目标并明确归属 |
| 旧 `README` 性能目标 | 直接列 PostTurn / StreamEvents / QPS / Turn 月量 | 属于非功能或容量目标,不应在 Step 4 用作目标 | Step 13 再判断 |
| `domain/conversation/README.md` 使命 | 写“承载一切协作的载体” | 叙事有价值,但容易泛化成接管其他仓职责 | Step 4 收敛为“对话真相域”,不接管相邻仓 |

---

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 目标粒度 | 直接列功能、事件映射、性能和容量指标 | 写需求完成后应成立的状态、边界和能力范围 | 对齐需求规范 §4.4,避免目标层提前进入功能和非功能 |
| 核心目标 | 四形态、五 kind、StreamEvents、PostTurn、事件覆盖、月分区 | Conversation 真相域、跨端消费一致、可见协作事实、可追溯历史、相邻仓边界清晰 | 目标应支撑后续能力闭环,不是替代功能清单 |
| 非目标范围 | 主要排除 Gate、Artifact、Bridges 和通知策略 | 增加 Chat UI、Workspace 聚合、Runtime 推理、Identity 生命周期、Observability / Archive 真相 | 按 Step 2 最新边界补齐 |
| 验证方式 | 用 E2E、benchmark、事件测试等实现后验证 | 用后续章节追溯和边界不串线来验证 | 当前仍处于需求文档阶段 |
| 后移内容 | 旧目标中直接保留性能 / 容量 | 性能、AG-UI、四形态、Turn kind、可见性、检索和保留后移到对应步骤 | 防止 Step 4 过载 |

---

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A: 继承旧目标表,只补几个非目标 | 快,旧内容保留多 | 功能、接口、非功能和容量目标混在目标层,后续追溯困难 | 不采用 |
| 方案 B: 用“状态 / 边界 / 能力范围”重写目标,旧功能和指标后移 | 符合 SOP,可支撑后续用户故事和功能需求 | 需要后续步骤继续展开细节 | 采用 |
| 方案 C: 把目标写成“完整聊天体验” | 产品上直观 | 会把 Chat UI 和 Workspace 视图混入 Conversation | 不采用 |
| 方案 D: 把目标写成“为 Runtime 提供上下文” | 能解释 AI member 依赖 | 会让 runtime 消费倒置为 conversation 目标主线 | 不采用 |

---

## 7. 结构化中间产物

### 7.1 目标表

| 目标 | 说明 | 验证方式 |
|---|---|---|
| 建立平台对话真相域的需求边界 | 明确 `L1-conversation` 承载 Conversation / Turn 这类对话事实,而不是 Chat UI、Workspace 视图或 Runtime 推理过程 | 后续章节不再把 UI 展示状态、workspace 聚合视图或 agent loop 写入 Conversation 范围 |
| 收束对话事实可见与可消费的需求范围 | 明确对话事实需要被授权的人类用户、AI member、Chat、Workspace、Bridges 和审计链路稳定消费 | 后续用户、依赖、接口和验收章节能区分消费方与事实所有者 |
| 明确跨域事件进入对话后的边界 | 明确 Governance / Artifact / Work / Identity 等跨域事实可以在对话中形成可见记录,但原始业务真相仍归属对应仓 | 后续功能、规则和数据归属章节不把 Gate、Artifact、Project、Member 生命周期正文写成 Conversation 真相 |
| 支撑用户管理 AI 团队的协作可见性 | 明确 Conversation 需求服务于用户理解、介入和追溯 AI 团队协作过程 | 后续用户故事和验收标准能围绕协作可见、介入、复盘和追溯展开 |
| 为核心能力闭环提供需求锚点 | 为后续“创建 / 维护对话空间、记录对话事实、查询 / 订阅、跨域事件显化、历史追溯”能力闭环提供范围边界 | Step 7 核心能力闭环能够以对话真相为主线收敛,不转向 UI 或运行时主线 |

### 7.2 非目标表

| 非目标 | 不做原因 |
|---|---|
| Chat UI 页面、组件和客户端交互状态 | 属于 `L5-chat` 展示和产品交互范围,Conversation 只提供对话事实 |
| Workspace 个人首页、项目视图、inbox 和跨域聚合 | 属于 `L1-workspace` 聚合视图范围,Conversation 不拥有个人 / 项目视野整体真相 |
| 外部聊天平台协议适配和外部平台生命周期 | 属于 `L6-bridges` 范围,Conversation 不直接实现 Mattermost / Slack / Telegram 等平台协议 |
| LLM 推理、agent loop、tool 调用和 runtime memory 写入 | 属于 `L2-runtime` / `L2-tools` 范围,Conversation 只提供 / 记录对话事实 |
| Gate、Policy、Approval 的决策真相 | 属于 `L1-governance` 范围,Conversation 只承载对话中可见的通知、引用或记录 |
| Artifact 正文、版本、证据链和产物生命周期真相 | 属于 `L1-artifact` 范围,Conversation 只承载对话中的引用或通知 |
| 成员创建、成员生命周期、角色定义、认证和授权裁决 | 成员真相属于 `L1-identity`,角色定义属于 method-library,认证 / 授权裁决不属于 Conversation |
| 全局 trace、metrics、audit store、长期归档和冷存策略 | 属于 `L4-observability` / `L4-archive` 或后续非功能与设计范围,Conversation 只保留必要追溯需求 |

### 7.3 范围收束结论

本轮需求的目标主线是“对话事实真相”,不是“聊天产品完整体验”。凡是为了建立、记录、消费、显化和追溯对话事实而必要的需求,可以进入后续章节;凡是属于 UI 展示、视图聚合、外部协议、LLM 推理、治理决策、产物正文、成员生命周期或全局观测归档的需求,必须交给对应仓或后续阶段处理。

### 7.4 后移事项

| 内容 | 后移原因 | 后续位置 |
|---|---|---|
| 群聊 / 频道 / 私聊 / thread 是否全部 P0 | 属于能力范围和功能优先级 | Step 7 / Step 9 |
| Turn kind 集合和不可变规则 | 属于功能需求与业务规则 | Step 9 / Step 10 |
| AG-UI / SSE / WebSocket 等交互形式 | 属于接口与依赖或架构选择 | Step 12 / 架构设计 |
| PostTurn、StreamEvents、QPS、Turn 月量 | 属于非功能需求和容量验证 | Step 13 |
| 全文检索、分区、冷存 | 属于数据 / 非功能 / 设计问题 | Step 11 / Step 13 / 后续设计 |

---

## 8. 回填草稿

以下内容供 Step 17 重建正式 `00-需求文档.md` 时回填到 §4。

```md
## 4. 目标与非目标

> 校准来源：
> - `design-calibration/00_req_step_04_goals_non_goals.md`
>
> 延伸阅读：
> - 建议继续阅读上述中间产物的“结构化中间产物”“改动前后对比”和“后移事项”小节，了解本章如何把旧目标表收束为需求层目标和非目标。

### 4.1 目标

| 目标 | 说明 | 验证方式 |
|---|---|---|
| 建立平台对话真相域的需求边界 | 明确 `L1-conversation` 承载 Conversation / Turn 这类对话事实,而不是 Chat UI、Workspace 视图或 Runtime 推理过程 | 后续章节不再把 UI 展示状态、workspace 聚合视图或 agent loop 写入 Conversation 范围 |
| 收束对话事实可见与可消费的需求范围 | 明确对话事实需要被授权的人类用户、AI member、Chat、Workspace、Bridges 和审计链路稳定消费 | 后续用户、依赖、接口和验收章节能区分消费方与事实所有者 |
| 明确跨域事件进入对话后的边界 | 明确 Governance / Artifact / Work / Identity 等跨域事实可以在对话中形成可见记录,但原始业务真相仍归属对应仓 | 后续功能、规则和数据归属章节不把 Gate、Artifact、Project、Member 生命周期正文写成 Conversation 真相 |
| 支撑用户管理 AI 团队的协作可见性 | 明确 Conversation 需求服务于用户理解、介入和追溯 AI 团队协作过程 | 后续用户故事和验收标准能围绕协作可见、介入、复盘和追溯展开 |
| 为核心能力闭环提供需求锚点 | 为后续“创建 / 维护对话空间、记录对话事实、查询 / 订阅、跨域事件显化、历史追溯”能力闭环提供范围边界 | Step 7 核心能力闭环能够以对话真相为主线收敛,不转向 UI 或运行时主线 |

### 4.2 非目标

| 非目标 | 不做原因 |
|---|---|
| Chat UI 页面、组件和客户端交互状态 | 属于 `L5-chat` 展示和产品交互范围,Conversation 只提供对话事实 |
| Workspace 个人首页、项目视图、inbox 和跨域聚合 | 属于 `L1-workspace` 聚合视图范围,Conversation 不拥有个人 / 项目视野整体真相 |
| 外部聊天平台协议适配和外部平台生命周期 | 属于 `L6-bridges` 范围,Conversation 不直接实现 Mattermost / Slack / Telegram 等平台协议 |
| LLM 推理、agent loop、tool 调用和 runtime memory 写入 | 属于 `L2-runtime` / `L2-tools` 范围,Conversation 只提供 / 记录对话事实 |
| Gate、Policy、Approval 的决策真相 | 属于 `L1-governance` 范围,Conversation 只承载对话中可见的通知、引用或记录 |
| Artifact 正文、版本、证据链和产物生命周期真相 | 属于 `L1-artifact` 范围,Conversation 只承载对话中的引用或通知 |
| 成员创建、成员生命周期、角色定义、认证和授权裁决 | 成员真相属于 `L1-identity`,角色定义属于 method-library,认证 / 授权裁决不属于 Conversation |
| 全局 trace、metrics、audit store、长期归档和冷存策略 | 属于 `L4-observability` / `L4-archive` 或后续非功能与设计范围,Conversation 只保留必要追溯需求 |
```

---

## 9. 待确认事项

| 编号 | 待确认事项 | 方案 A | 方案 B | 推荐 |
|---|---|---|---|---|
| Q-001 | 是否继续把旧目标中的四形态、AG-UI、性能指标直接保留在目标表 | 是,作为目标继续保留 | 否,目标表只写状态 / 边界 / 能力范围,细节后移 | 推荐 B。原因是 Step 4 不应写功能、接口或非功能指标 |
| Q-002 | 是否把 Chat UI 体验写入 Conversation 目标 | 是,因为用户通过 Chat 使用对话 | 否,Conversation 目标只到事实可消费,UI 体验归 `L5-chat` | 推荐 B。原因是 Chat 是消费方和展示层 |
| Q-003 | 是否把 Runtime 上下文作为 Conversation 的目标主线 | 是,因为 AI member 需要读取对话 | 否,Runtime 是重要消费方,但主线仍是对话事实真相 | 推荐 B。原因是不能让消费方倒置成事实所有者 |
| Q-004 | 是否在非目标中排除 Observability / Archive | 不排除,由 Conversation 承担全量审计和归档 | 排除全局观测和长期归档,Conversation 只保留必要追溯需求 | 推荐 B。原因是全局 trace、metrics、audit store 和 archive 是横切仓职责 |

当前建议：按推荐方案继续进入 Step 5。

---

## 10. 进入下一步条件

- 已形成目标表,且每个目标都是状态、边界或能力范围,不是功能名或接口名。
- 已形成非目标表,且每个非目标都明确交给相邻仓或后续阶段。
- 已明确旧四形态、Turn kind、AG-UI、性能指标、检索和保留策略后移到对应步骤。
- 已形成可回填正式需求文档 §4 的目标与非目标内容。
