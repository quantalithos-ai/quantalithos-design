## Step 2. 本仓定位与边界

### 1. Step 状态

- 状态：`[x] 已确认`
- 对应 SOP：`standards/document/需求文档讨论流程_SOP.md` Step 2
- 回填章节：正式 `00-需求文档.md` §2「本仓定位与边界」
- 当前模块：`chat-product-boundary`

#### 1.1 Step 内计划

- [x] 读取输入和前序结论：读取 Step 1、全局依赖规则和各 owner 边界。
- [x] SOP 问题回答：完成一句话定义、单独成仓原因、非职责和易混淆边界回答。
- [x] 当前材料 / 旧文档诊断：检查旧 Chat 对 UI、SDK、体验对象和领域真相的混层。
- [x] 设计取舍：确定“产品客户端 + SDK 接入”双层边界。
- [x] 结构化中间产物：形成边界表、所有权表和禁止路径图。
- [x] 复杂度判断 / 是否拆模块或附录：Step 2 不拆模块；SDK gap 在 Step 6 / 12 展开。
- [x] 回填草稿：本文件 §8 已形成正式章节草稿。
- [x] 自检与进入下一步条件：所有边界句可回指 Step 1 和全局依赖规则，允许进入 Step 3。

### 2. 本步输入

- `00_req_step_01_upstream_relation.md`
- `standards/document/全局项目依赖关系与裁剪规则.md` §4、§4.1
- `projects/L0-sdk/00-需求文档.md` §2、§4、§10~§12
- `projects/L1-conversation/00-需求文档.md` §2、§11~§12
- `projects/L1-identity/00-需求文档.md` §2、§11~§12
- `projects/L1-work/00-需求文档.md` §2、§11~§12
- `projects/L1-governance/00-需求文档.md` §2、§11~§12
- `projects/L1-artifact/00-需求文档.md` §2、§11~§12
- `projects/L1-workspace/00-需求文档.md` §2、§11~§12
- `projects/L2-member/00-需求文档.md` §2、§11~§12
- `projects/L2-runtime/00-需求文档.md` §2、§11~§12
- `projects/L4-observability/00-需求文档.md` §2、§11~§12

### 3. SOP 问题回答

#### 3.1 本仓一句话定义是什么？

`L5-chat` 是基于 `L0-sdk` 的跨平台协作客户端产品，负责把各正式 owner 的安全读取、变化和受控命令入口组织成可访问、可恢复、可理解的用户界面与客户端交互状态。

#### 3.2 为什么需要单独成仓？

页面、路由、跨端壳、视图模型、局部 reducer、草稿、选择状态和本地展示缓存有独立的产品演进节奏。它们不能塞进 Conversation、Governance、Workspace 或 SDK，否则会把产品展示语义误升格为业务真相，或让通用 SDK 被某一个产品的页面和交互绑死。单独成仓还能让 Web、Desktop、Mobile 共享同一套产品交互语义，同时保留平台壳差异。

#### 3.3 本仓不是什么？

| 不是什么 | 正式 owner / 处理方 |
|---|---|
| Conversation / Turn / Participant 真相仓 | `L1-conversation` |
| GlobalMember / Actor / Role 生命周期仓 | `L1-identity` |
| Project / ProjectMember / WorkItem / Iteration 真相仓 | `L1-work` |
| Gate / Approval / Decision / Policy 真相仓 | `L1-governance` |
| Artifact / Evidence / version / lineage 正文仓 | `L1-artifact` |
| 跨域 Workspace projection / local view owner | `L1-workspace` |
| Runtime run / decision / checkpoint / outcome 执行仓 | `L2-runtime` |
| Member 容器在场与交互边界真相仓 | `L2-member` / `L2-member-service` |
| Observability backend、原始日志和审计存储 | `L4-observability` |
| 外部平台映射、桥接和协议适配仓 | `L6-bridges` |
| 通用 SDK、传输、错误、重试、事件客户端实现 | `L0-sdk` |
| IDE、部署宿主、工具执行、治理后台总台 | 对应产品或能力 owner |

#### 3.4 最容易与哪些边界混淆？

1. **Chat UI 与 Conversation truth**：聊天时间线、局部排序和折叠是 Chat 的 view state；Conversation、Turn 和 participant 事实仍归 conversation。
2. **GateCard 与 Governance Decision**：卡片是显化和交互入口；点击只产生 client intent，只有 Governance 正式命令结果 / Decision 变化才能显示确认。
3. **成员入口与 Identity / Member / Runtime**：成员卡、状态摘要和“查看成员”路由是展示；身份生命周期、容器 presence 和 Runtime outcome 不由 Chat 推断。
4. **Workspace view 与 Chat inbox**：Chat 可以消费 Workspace safe view 并做局部筛选；不能重建 Workspace projection 或自行定义 attention truth。
5. **SDK 与 Chat adapter**：SDK 提供通用、typed、可版本化能力；Chat 只组合产品使用场景，不复制 SDK contract。

### 4. 当前文档问题诊断

| 位置 | 问题 | 边界后果 |
|---|---|---|
| 旧 README “仓使命 / 技术栈” | 把具体框架和外壳写入定位 | 技术候选会限制跨平台设计，且与 SDK / UI 的责任无关。 |
| 旧 `00` §2、§5 | “Chat 是产品的脸”后直接罗列服务能力，缺少 Chat 自有状态边界 | 可能把服务对象和客户端对象混成同一真相。 |
| 旧 `01` §5~§6 | 将 Member Lens、Artifact View、Inbox 等产品模块命名为近似领域上下文 | 容易让 UI 名称成为领域 owner 或公共 schema。 |
| 旧 `02` §1.3、`05` §1 | `ChatThread`、`ChatReplyState` 被称为体验层真相，但没有说明只属于客户端 store / view model | 实现者可能建立第二个持久化 truth。 |
| 旧 `06` §4、§7 | 把“形成卡片 / hint”与“写入正式状态”边界写得不够明确 | 可能把展示成功、ACK 或 hint 当作业务成功。 |

### 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 一句话定位 | 多端聊天协作界面 | 基于 SDK 的跨平台协作客户端产品 | 同时表达 UI 产品职责和接入边界。 |
| Chat 自有内容 | “体验层真相”概念宽泛 | 页面 / 路由 / view model / client store / draft / selection / cache / platform state | 为后续可落码和数据归属提供精确边界。 |
| 领域对象 | Chat 组合多个业务对象 | Chat 只持有 owner refs、safe views 和展示映射 | 防止复制 Conversation / Governance / Work truth。 |
| 命令语义 | Chat 内“审批”“发送”像直接业务动作 | Chat 发起 intent，经 SDK 获取正式 result / receipt / event | 保护幂等、审计和真实状态。 |
| 跨平台 | React / Tauri / RN 候选写死 | 共享产品交互语义 + 平台壳，技术选型后置 | 保留跨平台演进空间。 |

### 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 把 Chat 做成纯 UI 静态壳，不持有任何客户端状态 | 最简单 | 无法表达草稿、重连、optimistic / failed、跨端体验 | 不采用；客户端交互状态属于 Chat。 |
| 把 Chat 做成轻量 BFF / 领域聚合服务 | 可统一调用上游 | 形成第二业务编排层和真相复制，破坏 SDK / owner 边界 | 不采用。 |
| 把 SDK 做成 UI + 页面通用框架 | 可复用部分组件 | SDK 绑定产品，失去通用开发者接入层定位 | 不采用。 |
| Chat 负责展示与交互状态，SDK 负责正式能力接入 | 边界清晰，支持 Web / Desktop / Mobile 共用 | 依赖 SDK surface 完整，需显式登记 gap | 采用。 |

### 7. 结构化中间产物

#### 7.1 Chat 所有权表

| 对象 / 状态 | Chat 是否拥有 | Chat 可做什么 | 禁止什么 |
|---|---:|---|---|
| Page / route / navigation state | 是 | 路由、返回、深链、平台导航 | 用路由名猜业务对象或权限 |
| Timeline view model / renderer registry | 是 | 把 safe view 映射为可渲染项 | 重建 Turn / Gate / Artifact truth |
| Draft / selection / focus / expanded state | 是 | 本地编辑、选择、折叠、焦点恢复 | 当作正式命令或领域状态 |
| Optimistic / confirmed / failed client status | 是 | 表示一次客户端 intent 生命周期 | 把 transport ACK 当 confirmed |
| Sanitized display cache | 是 | 缓存最近安全展示结果并标 fresh / stale | 缓存冒充 source truth 或绕过可见性 |
| Conversation / Turn / Participant | 否 | 读取、分页、订阅正式变化 | 本地创建、修改或重排业务事实 |
| Gate / Decision / Policy | 否 | 显化、发起受控命令、显示结果 | 本地决定审批结果 |
| Project / Member / Artifact / Workspace / Runtime | 否 | 读取 safe view / ref / summary | 拼造替代状态或反写 owner |

#### 7.2 边界红线

```text
UI action -> client intent -> SDK command -> owner result / receipt -> owner event/query refresh

transport ACK ───────≠────── business confirmation
rendered card ───────≠────── source truth
local cache ─────────≠────── current owner state
workspace view ──────≠────── Chat-owned aggregate truth
```

#### 7.3 单独成仓原因的闭环

```text
多端产品体验差异
        ↓
共享 UI 语义 + 平台壳适配
        ↓
客户端局部状态、草稿、缓存和恢复
        ↓
通过 SDK 消费正式 owner 能力
        ↓
不复制业务 truth，仍可形成可用协作入口
```

### 8. 回填草稿

正式 `00-需求文档.md` §2 可回填为：

> `L5-chat` 是基于 `L0-sdk` 的跨平台协作客户端产品，负责页面、导航、展示、交互状态、草稿、选择状态、本地展示缓存和多端体验。它把 Conversation、Governance、Work、Identity、Artifact、Workspace、Runtime、Member 和 Observability 提供的正式读取、变化和受控命令入口组织成用户可理解的协作界面。
>
> `L5-chat` 不拥有 Conversation、Turn、Participant、Project、ProjectMember、WorkItem、Member、Gate、Decision、Artifact、Workspace、Runtime 或 Observability 的业务真相，也不实现通用 SDK、内部事件总线、Runtime 推理、Tools 执行、Bridges 外部平台映射或 Observability backend。页面和卡片是展示，客户端 store 是交互状态，SDK / owner 返回的正式结果才决定业务状态。

### 9. 待确认事项

- Chat 是否在所有平台共享同一 view model / reducer，或允许移动端采用受限能力子集，需要在架构阶段确认。
- SDK 是否提供通用 cache / resume metadata，或由 Chat 维护产品层 sanitized cache，需要在 Step 6 / Step 12 继续裁剪。
- `L1-workspace` safe view 是否足以支撑 Inbox / attention 入口；在 `WS-UP-001~008` 未关闭前不得把 Chat Inbox 写成 Workspace truth。

### 9.1 原型回写修复（2026-10-01）

冻结原型新增的项目详情、项目进度、阶段子流程、群聊绑定、公司成员目录和 BPMN 并行结构均属于 Chat 的展示与导航边界。Chat 可以显示 owner safe projection、来源、新鲜度、选择和恢复状态，但不拥有项目流程、绑定关系、成员集合、分支完成或 Governance Gate 结果。

项目关系约束作为需求假设登记：一个群聊最多绑定一个项目，一个项目可以关联多个群聊；群聊成员、项目成员和公司成员分别由正式 owner 判断可见性。该假设需要在后续依赖和接口 Step 中确认，不在 Step 2 私自固化为 schema。

### 10. 进入下一步条件

- 一句话定义包含产品形态、SDK 接入和客户端责任。
- Chat 自有状态与所有上游 truth 已逐项分离。
- SDK、BFF、Bridges、Runtime、Tools、Observability backend 等非职责明确。
- 已形成后续数据与接口章节可复用的所有权表和红线。
- Step 2 自检完成；允许创建 Step 3。
