# Step 4 · 系统边界与上下文

> 架构主题：说明 `L5-chat` 在全局系统中的位置、正式上下文对象、输入/输出面和失效降级口径。  
> 当前状态：已完成系统上下文图、关系表、边界说明、历史诊断、回填草稿和自检；允许进入 Step 5。  
> 直接输入：`01_arch_step_01_requirements_baseline.md`、`01_arch_step_03_responsibility_boundary.md`、全局依赖规则、`L0-sdk`/owner 当前正式 01 和正式 `00`。

## 1. Step 开工确认

| 项目 | 记录 |
|---|---|
| Step | Step 4 · 系统边界与上下文 |
| 前置门禁 | Step 3 `pass` |
| 本步输出 | 系统上下文图、上下游与输入/输出面表、边界说明、失效降级表 |
| 正式回填 | §5 系统边界与上下文 |
| 本步不展开 | 内部限界上下文、容器、层间依赖、数据一致性、API/DTO/事件 schema |

## 2. SOP 问题回答

### 2.1 这个仓在全局系统中的位置是什么？

`L5-chat` 位于 Layer 5 产品与分发面，是面向协作者、项目负责人、审批者、观察者和后续移动端用户的协作客户端入口。它位于正式 owner 与最终用户之间：通过 `L0-sdk` 消费对话、身份、工作、治理、制品、工作区、成员和运行的安全 view/ref/result/change，再由客户端页面和平台 shell 组织成可理解的体验。

### 2.2 正式上游和输入面是什么？

正式输入面由 `L0-sdk` 的 typed query/command/event/ref/auth/error/trace/redaction/resume 能力、各 owner 提供的 safe view/summary/preview/receipt/result/change、平台 shell 提供的宿主能力以及低敏诊断/支持边界组成。Chat 不把 owner 的服务仓、内部 bus、数据库或外部平台直接作为输入面。

### 2.3 正式下游和输出面是什么？

Chat 的输出主要是最终用户可操作的页面、导航、可访问语义、受控意图、局部恢复状态和低敏客户端诊断意图。对于 owner，Chat 只通过 SDK 发送正式意图或消费结果；对于平台 shell，Chat 提供业务语义和受限状态，不让 shell 改写 owner truth；对于支持/Observability，只在正式能力存在时交接低敏 correlation 和错误类别。

### 2.4 哪些外部系统或相邻仓构成正式上下文边界？

正式上下文包括：`L0-core`/`L0-sdk` 共享接入边界；`L1-conversation`、`L1-identity`、`L1-work`、`L1-governance`、`L1-artifact`、`L1-workspace` owner truth；`L2-member`、`L2-runtime` 的 safe runtime/member view；`L4-observability` 的低敏诊断/handoff；Desktop/Web/Mobile 入口 shell。`L6-bridges` 只作为并行兄弟的边界参考，不进入 Chat 正式输入主链。

### 2.5 依赖失效时，本仓的降级口径是什么？

Chat 按来源局部隔离：SDK 不可用则启动或业务入口明确 blocked/unavailable；单一 owner 不可用则对应区域 stale/partial/unavailable/blocked；visibility/actor/scope 无法验证则 fail-closed；变化缺口或 cursor 失效则 reconnect/requery/unknown；平台能力缺失则 needs-action/unavailable；诊断 sink 失败不改变业务结果、授权或恢复上限。

## 3. 历史材料诊断

| 历史上下文表达 | 问题 | 当前处理 |
|---|---|---|
| 以“管理者/参与者”作为系统上下文图角色 | 角色不属于系统上下文图对象类型 | 角色保留在需求文档，系统图使用入口系统/平台 shell。 |
| 将 `sdk(events/rpc)`、SSE/WS、AG-UI 17 画入边界图 | 接口/传输名下沉到架构上下文，且合同未闭合 | 图只画 SDK 接入能力和正式 owner 边界，不画协议名。 |
| 把 `observability(前端事件)` 作为直接输出 | 可能绕过 Observability owner 或把 UI 事件等同正式观测 | 只保留低敏诊断/handoff 外部边界，exact surface pending。 |
| 把“员工登录”作为 Chat 自有上下文 | 可能混入认证、credential、session、Member lifecycle | 入口系统只承载受控会话/语境进入；认证和身份真相外置。 |
| 把所有六域服务直接画成 Chat 下游 | 没有区分 SDK-only、safe view、局部失败和 owner truth | 图使用 owner 分组，表格逐项说明输入/输出面和降级。 |

## 4. 系统上下文图

```text
                              +----------------------+
                              |      L0-core         |
                              | shared contract base |
                              +----------+-----------+
                                         | 依赖
                                         v
                              +----------------------+
                              |       L0-sdk         |
                              | formal client seam   |
                              +----------+-----------+
                                         | 输入 / 输出
                                         v

+----------------------+     +--------------------------------------+     +----------------------+
| L1 owner truth       |---->|                                      |<----| L2 safe views        |
| conversation         |输入|              L5-chat                  |输入| member / runtime     |
| identity / work      |    |  cross-platform collaboration client  |    | safe status          |
| governance / artifact|    |                                      |    +----------------------+
| workspace            |    +------------------+-------------------+
+----------------------+                       | 输出 / 入口
                                              v
                              +-------------------------------+
                              | Desktop / Web / Mobile shells |
                              | platform entry systems         |
                              +-------------------------------+
                                              |
                                              | 低敏交接 / 诊断
                                              v
                              +-------------------------------+
                              | L4-observability / support     |
                              | read-only diagnostic boundary  |
                              +-------------------------------+
```

图示说明：

- 图只表达 `L5-chat` 与正式上下文对象之间的边界关系和输入/输出方向，不表达 API、事件、实现组件、协议或运行时顺序。
- `L1 owner truth` 是对话、身份、工作、治理、制品和工作区正式来源的收缩表达；它们的业务真相不合并。
- `L2 safe views` 只表示成员与运行的安全消费面，不表示 Chat 可以读取 Runtime/Member 内部正文或控制面。
- Platform shell 是入口系统，只提供宿主能力；低敏诊断边界只在正式能力闭合时承接，不等同于 Observability backend truth。

## 5. 上下游与输入/输出面表

| 对象 | 关系方向 | 关系类型 | 输入/输出面 | 说明 |
|---|---|---|---|---|
| `L0-core` | 输入 | 依赖 | 共享 ref、error、metadata、trace 和安全契约来源 | 仅作为正式共享类型候选，不成为 Chat 的业务服务入口。 |
| `L0-sdk` | 输入/输出 | 来源/接入 | typed query、command、formal change、resume、safe ref、auth、error、trace、redaction | Chat 的唯一业务接入边界；exact surface 受 `CHAT-UP-001` 约束。 |
| `L1-conversation` | 输入/输出 | 来源/消费 | Conversation/Turn/Participant 的 safe view、变化、分页/恢复和普通意图结果 | Chat 显化对话事实，不拥有对话 truth 或事件 delivery。 |
| `L1-identity` | 输入 | 来源 | actor/member safe summary、visibility/identity 入口语境 | Chat 不认证、不创建 GlobalMember、不推断生命周期。 |
| `L1-work` | 输入 | 来源 | Project/ProjectMember/WorkItem/Iteration safe summary、项目进度和阻塞语境 | Chat 只显示项目协作摘要，不推进 Work truth。 |
| `L1-governance` | 输入/输出 | 治理依赖/消费 | Gate/Decision/Policy safe view、授权语境、receipt/result 和受控意图 | GateCard 是显化与入口，不是 Decision owner。 |
| `L1-artifact` | 输入 | 来源 | Artifact/Evidence/Baseline body-free ref、summary、preview availability | Chat 不保存正文、血缘、Evidence 或 Baseline truth。 |
| `L1-workspace` | 输入 | 来源 | Personal/Project safe view、attention、freshness、coverage、export | `WS-UP-001~008` 未闭合时局部保持 blocked/stale/partial。 |
| `L2-member` | 输入 | 来源 | member presence/interaction safe summary、availability/gap | Chat 不拥有容器内交互、宿主或成员运行 truth。 |
| `L2-runtime` | 输入/输出 | 来源/消费 | run/decision/checkpoint/outcome safe status 和受控入口 | Chat 只显示安全状态或发起意图，不执行 Runtime/Tools。 |
| `L4-observability` | 输出/输入 | 诊断交接 | 低敏错误分类、correlation/ref、handoff 语境 | `CHAT-UP-007` 未闭合时只保留本地诊断意图。 |
| Desktop/Web/Mobile shell | 输入/输出 | 入口/承载 | 窗口、输入、通知、存储、深链、网络、辅助技术 | shell 能力缺失只导致 unavailable/needs-action，不改变业务结果。 |
| `L6-bridges` | 不进入主链 | 边界参考 | 外部平台映射边界参考 | 未停审设计不作为 Chat 正式输入；Chat 不消费外部正文/凭证。 |

## 6. 依赖失效与降级表

| 失效对象 | 受影响范围 | Chat 架构口径 |
|---|---|---|
| `L0-core`/`L0-sdk` 不可用或能力未闭合 | 所有业务读取、意图和变化 | 入口或对应能力 blocked/unavailable；不 fallback 到私有 API、内部 bus 或共享 DB。 |
| Conversation safe view/change/resume 不可用 | 对话入口、历史、线程、变化和发送 | 保留安全局部位置或带语境缓存，显示 stale/reconnecting/blocked/unknown；不猜顺序、不确认发送。 |
| Identity/Work safe summary 不可用 | 成员、项目、进度和责任提示 | 局部 opaque/stale/unavailable；不从 ID、名称或其他 owner 摘要补齐。 |
| Governance receipt/result 不可用 | GateCard、审批意图和结果 | 只读或 pending/unknown；不把点击、ACK 或刷新显示为 confirmed。 |
| Artifact preview/ref 不可用 | Artifact card、预览和下载入口 | 显示 safe ref、preview unavailable 或 needs-action；不复制正文或猜权限。 |
| Workspace safe view/export 不可用 | Inbox、attention、跨项目摘要 | 受影响区域 partial/stale/blocked；Chat 不重建 projection/attention。 |
| Member/Runtime safe view 不可用 | 成员在场、运行摘要、执行状态 | 只显示最小可用状态或 unavailable；不推断 host health、outcome 或 lifecycle。 |
| Observability handoff 不可用 | 支持诊断和低敏关联 | 本地安全错误提示仍可用；诊断 sink 失败不改变业务结果、权限或恢复上限。 |
| Platform shell 能力缺失 | 窗口、通知、存储、深链、辅助技术 | 使用共享 core 的业务路径，给出 unavailable/needs-action；不另造业务状态。 |

## 7. 边界说明

`L5-chat` 的系统上下文围绕“L0 共享接入、L1/L2 owner safe material、平台入口 shell 和低敏诊断交接”建立。进入主图的 owner 只表示正式真相来源或安全消费边界，不表示 Chat 合并、复制或管理这些 truth；平台 shell 只承载产品体验，不改变业务授权和结果。未闭合的 SDK、Workspace、Governance、Artifact、Observability 合同不被隐藏，受影响区域保持 blocked、stale、unknown、unavailable 或 read-only。`L6-bridges` 只作为并行兄弟的边界参考，不进入当前正式输入主链。

## 8. 正式回填草稿

### 8.1 §5 系统边界与上下文

`L5-chat` 位于 Layer 5 产品与分发面，通过 `L0-sdk` 连接 Conversation、Identity、Work、Governance、Artifact、Workspace、Member、Runtime 等正式 owner，并把安全 view/ref/result/change 组织成跨平台客户端体验。其输出是页面、导航、局部状态、受控意图、恢复语境和低敏诊断意图；其平台输入是 Desktop/Web/Mobile shell 提供的宿主能力。Chat 不直接接入 owner 私有 API、内部 bus、共享数据库或 `L6-bridges` 外部正文。

### 8.2 §5 失效降级口径

Chat 采用来源局部隔离和 fail-closed：SDK 或 actor/scope/visibility 无法验证时阻塞或收紧；单一 owner 不可用时局部 stale、partial、unavailable 或 blocked；变化缺口和 cursor 失效进入 reconnect/requery/unknown；shell 能力缺失进入 unavailable/needs-action；诊断 sink 失败不改写业务结果或授权。

## 9. Step 自检与门禁

| 检查项 | 结果 | 说明 |
|---|---|---|
| 图中是否只使用本仓、内部仓、外部能力和入口系统 | pass | 没有角色、文档来源对象、接口名或内部模块。 |
| 是否明确输入/输出方向、关系类型和消费面 | pass | 关系表逐项列出来源、消费、入口和治理依赖。 |
| 是否保持 L0-sdk 唯一业务接入边界 | pass | 所有业务面均经 SDK，L0-core 仅作共享契约候选。 |
| 是否把 owner truth、协议或运行顺序画入 Chat | pass | 图与表仅表达上下文边界，不表达协议和时序。 |
| 是否保留未闭合合同和局部降级 | pass | `CHAT-UP-*`、`WS-UP-*` 和低敏诊断缺口均显式保留。 |
| 是否完成正式回填草稿 | pass | §5 图、表和降级口径已形成。 |
| 是否足以进入 Step 5 | pass | 外部系统位置和边界已收稳，可划分 Chat 内部语义上下文。 |

## 10. Step 门禁

| 层级 | gate_status | gate_reason | next_allowed_action |
|---|---|---|---|
| Step / 模块级 | `pass` | 系统上下文图、关系表、失效降级和边界说明已完成静态自检。 | 创建并执行 Step 5 `01_arch_step_05_bounded_context_subdomains.md`。 |
| 文档级 | `pass` | Chat 的全局位置和上下游输入/输出面清楚，不依赖未确认协议。 | 进入 Step 5。 |
| 项目级 | `in_progress` | 正式 `01` 仍在校准链；未允许进入 `02`。 | 继续串行完成 Step 5。 |


## 本轮逐章审查与修复（2026-10-01）

> 模式：regression-review / single-agent-serial。前轮记录作为差异材料；本节为当前章节修复基线。前序修复已通过，未闭合合同不升级为 ready。

### 执行计划与输入

- [x] 读取本 Step SOP、书写规范对应章、修复后 00、冻结原型和相关正式 owner 边界。
- [x] 顺序完成问题回答、旧材料诊断、取舍、结构化结果、复杂度判断和回填自检。
- [x] 只回填本 Step 对应现有正式章节并更新 flow/ledger；无实现、测试或 commit。

### 问题回答与诊断

外部输入为 SDK 提供的可见项目、正式流程、关联群聊、成员目录、Gate、Artifact、Runtime safe material；输出为获准 command intent 与平台 UI。依赖失效只局部降级，项目可读不代表其流程/群聊/Gate 可读。旧 §5.1 将 owner 直接连入 Chat、Chat 直接连向 Observability，和 SDK-only 文字冲突。

### 取舍、结构化结果与回填

重画 §5.1 为 owners → SDK → Chat → 宿主，诊断作为 SDK 可选输入/交接。新增 Process 关系行和项目/群聊/目录独立能力闸门；本图只表达上下文，包承载在 Step6收敛。保留 L6-bridges 为非输入。

图类型：系统上下文图；标题：Chat 通过 SDK 消费正式 owner 能力。图正文回填 §5.1：L1 owners（含 Process）与 L2 safe source、L4 optional diagnostic 均经 L0-sdk 进入 L5-chat，再由平台 shell 表达。图说明：无旁路；owner 分立；宿主非 truth；不表达部署。自检：所有业务箭头穿过 SDK，读取列表不放宽 item 权限。

### 门禁

- gate_status：pass（架构文档级；上游正向能力继续 blocked/pending）。
- gate_reason：系统上下文图已消除直连歧义并补 Process 与关联消费面。
- next_allowed_action：进入 Step 5，重新读取其 SOP 与前序输入。


### 本轮已收敛上下文图回填正文

图类型：系统上下文图。图标题：Chat 通过 SDK 消费正式 owner 能力。

```text
+------------------------------------------+
| L1 owners: Conversation / Identity / Work |
| Process / Governance / Artifact /        |
| Workspace                                |
+---------------------+--------------------+
                      | 正式能力
+---------------------v--------------------+
| L0-sdk: 唯一业务接入边界                  |<--- L2 Member / Runtime
| query / command / change / resume / ref  |<--- L4 Observability（可选）
+---------------------+--------------------+
                      | safe material / result
                      v
+------------------------------------------+
| L5-chat: 客户端 UI / 局部状态 / 展示恢复   |
+---------------------+--------------------+
                      | 平台适配
                      v
+------------------------------------------+
| Desktop 宿主；Web / Mobile 后续候选       |
+------------------------------------------+
```

- 所有 owner/诊断业务能力均经 SDK，图中没有 Chat 直连 owner 或 backend 的旁路。
- Process 只提供正式流程材料，Work 提供项目/工作项材料，Governance 提供 Gate/Decision；它们不是同一真相源。
- 宿主提供平台能力而非业务 truth；SDK 是接入边界，实际包/进程承载见 §7。
- L0-core 的共享契约关系见 §8；本图不表达编译期依赖、broker 或部署位置。
