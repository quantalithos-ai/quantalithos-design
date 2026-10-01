# Step 10 · 关键技术选型

> 架构主题：收敛已经上升为架构层决定的技术机制，说明它们解决的问题、采用理由和代价；把具体框架、库、协议和平台产品保持在候选或后续取舍范围。
> 当前状态：已完成本 Step 的关键技术机制表、采用/不采用边界、平台候选约束和 authority 审计；允许进入 Step 11。
> 直接输入：`01_arch_step_02_arch_goals_constraints.md`、`01_arch_step_07_dependency_direction.md`、`01_arch_step_08_data_ownership_consistency.md`、`01_arch_step_09_key_interactions_communication.md`、`draft/01~03`、`00-需求文档.md` §4/§6/§7/§10/§12/§13。
> 本步限制：只选择架构层技术机制；不写技术栈 inventory、产品横向比较、实现 API、部署环境或完整备选方案比较。

## 1. Step 开工确认

| 项目 | 记录 |
|---|---|
| Step | Step 10 · 关键技术选型 |
| 前置门禁 | Step 9 `pass` |
| 本步目标 | 明确哪些机制必须进入架构主线，哪些只是实现载体候选，哪些当前明确不采用。 |
| 本步输出 | 关键技术机制表、采用理由、代价/约束、不采用口径、平台候选边界、authority 审计和 §11 回填草稿。 |
| 本步不展开 | 完整替代方案对比（Step 11）、具体框架/库版本、API/DTO/schema、部署参数和实现代码。 |
| 当前产品范围 | Desktop-first；共享客户端语义与 UI 机制先收敛，具体 Desktop shell、Web/Mobile 载体保持候选。 |

## 2. SOP 问题回答

### 2.1 当前正式采用哪些关键技术机制？

当前进入架构主线的不是产品名清单，而是以下机制：

1. 外部语义隔离与 SDK-only 正式接入。
2. owner-safe 材料的来源感知只读投影。
3. 多轴客户端状态与显式结果门控。
4. formal change/resume 的连续性承接与安全去重。
5. 受限本地持久化、最小披露和撤销/过期清理。
6. 共享客户端语义与平台 shell 分离的跨平台承载。
7. fail-closed 的可见性/能力闸门。
8. 共享语义层内建的可访问状态表达。

这些机制都改变 Chat 的边界、状态、一致性、通信或跨端结构，因而属于架构层决定；它们不等于某个框架、库、运行时产品或代码目录。

### 2.2 为什么当前值得采用？

- SDK-only 接入和语义隔离是 Chat 不吸收 owner truth 的前提。
- 来源感知投影同时保护正文、visibility、freshness 和跨域引用边界。
- 多轴状态和结果门控防止按钮、ACK、缓存、连接或 optimistic UI 被误显示为业务成功。
- formal change/resume 承接让 duplicate、gap、过期和 unknown 有明确位置，不需要直连内部 bus。
- 受限本地持久化支持 Desktop 重启、离线阅读和草稿恢复，同时限制敏感持有面。
- 共享语义与平台 shell 分离是 Desktop-first 后续扩展 Web/Mobile 的结构基础。
- fail-closed 和可访问状态表达把安全、解释性和等价路径放到所有平台的主路径中。

### 2.3 每项机制带来什么代价或新风险？

- 正式接缝增加映射和合同维护成本；SDK/owner surface 未闭合时，正向能力必须挂起。
- 只读投影会产生 stale/partial/unavailable 等中间姿态，用户需要理解来源和新鲜度。
- 多轴状态比单一 status 复杂，页面和后续测试必须覆盖未知、撤销、缺口和失败组合。
- formal change/resume 要求客户端处理重复、乱序、cursor 失效和恢复边界，不能依赖简单连接状态。
- 本地持久化引入 redaction、过期、登出清理和设备范围限制；错误策略可能扩大敏感暴露。
- shell 分离带来宿主能力差异、可访问性矩阵和跨端语义一致性成本。
- fail-closed 可能在上游短暂不可用时减少可见性和可操作性，但这是安全边界的必要代价。
- 共享可访问语义限制部分平台特有交互，需要持续维护等价路径。

### 2.4 哪些只是实现载体候选？

- React/TypeScript 共享 UI 与客户端 core 是当前候选载体，不在本 Step 固化为正式技术事实。
- Tauri Desktop shell 是 V1 Desktop 的当前候选承载；它不等于已实现或已验证。
- Web 共享 UI 是后续扩展面；Mobile 可暂以 Capacitor 类 shell 作为候选，但不进入 V1 前置。
- 具体 SDK transport、状态库、持久化引擎、窗口/通知库、测试框架和日志库都不在本 Step 选择。

### 2.5 当前明确不采用什么？

- 不采用 Chat 直连 owner 私有 API、内部 bus 或共享数据库的技术路径。
- 不采用把 owner DTO/raw body 复制进客户端作为“简单集成”的路径。
- 不采用离线副作用队列、自动重放 unknown 命令或本地审批确认机制。
- 不采用由 Chat 自建跨域聚合服务、Runtime 执行服务、Artifact 正文代理或 Observability backend。
- 不以固定性能数字、兼容设备数、SLO 或历史框架偏好作为未授权选型理由。

## 3. 历史材料与边界污染诊断

| 历史表达 | 污染风险 | 本 Step 处理 |
|---|---|---|
| “React/Svelte/Tauri/RN 全部已确定” | 把候选产品和实现载体伪装成架构事实。 | 只正式采用共享语义与 shell 分离机制；具体载体保留候选。 |
| “AG-UI 17 / SSE / WS 是技术主线” | 协议候选未有 authority，且不能保护 owner truth。 | 只保留 formal change/resume 和 SDK-only 接入机制。 |
| “Redux/某状态库是架构核心” | 局部实现库取代状态语义和结果门控。 | 正式记录多轴状态与显式 reducer/transition discipline，库后置。 |
| “本地 IndexedDB/SQLite 保存全部数据” | 将存储实现写成 owner truth 或敏感正文持有方案。 | 只采用受限本地持久化机制，具体引擎待后续。 |
| “实时连接可保证实时成功” | 连接/ACK 与业务确认混淆。 | 结果门控、formal change/resume 和 unknown 机制进入主线。 |
| “可访问性作为 UI 末端优化” | 核心路径在不同平台语义不等价。 | 可访问状态表达作为共享架构机制。 |

## 4. 关键技术机制表

| 技术机制 | 解决的问题 | 采用理由 | 代价 / 约束 | 说明 |
|---|---|---|---|---|
| 外部语义隔离与 SDK-only 正式接入 | 防止页面、核心语义或本地状态直接吸收 owner truth、私有 API 或内部 bus。 | Chat 的成立前提是跨域消费而非跨域拥有；`L0-sdk` 是唯一正式业务边界，能集中授权、redaction、错误和恢复语义。 | 增加正式接缝、映射和 SDK 合同依赖；surface 未闭合时能力必须 blocked/deferred。 | 该机制改变所有外部输入如何进入核心边界，属于架构层保护，不是某个 adapter 实现。 |
| 来源感知的只读安全投影 | 防止 safe view/ref/summary/preview/result 被误读为完整正文、权限或生命周期。 | Chat 需要组合多个 owner 材料，同时保留来源、visibility、版本/水位和 freshness。 | 产生 stale/partial/unavailable 等姿态，要求页面解释来源和降级。 | 该机制同时影响数据归属、通信承接和跨域演进，必须显式记录。 |
| 多轴客户端状态与正式结果门控 | 防止 local、transport、command、freshness、visibility 和业务结果被压缩为一个 status。 | 需求要求区分 draft、submitted/pending、confirmed/rejected/failed/unknown 及 stale/gap/revoked 等状态。 | 状态组合更复杂，后续组件、view model 和验收必须保持轴之间不越权。 | 这是客户端业务语义的结构性机制，不等于某个状态库。 |
| formal change/resume 连续性承接 | 防止重复、乱序、缺口、cursor 失效和连接恢复被误解为正式变化。 | 变化是 owner 事实传播，Chat 只能消费 SDK 提供的正式 change/resume；连续性必须独立表达。 | 需要维护 gap/unknown/requery/reconnect 语义，且受 `CHAT-UP-002` 等合同阻塞。 | 该机制改变跨边界状态传播和恢复方式，不是某种 websocket/SSE 选择。 |
| 受限本地持久化与安全清理 | 支持 Desktop 重启、草稿恢复、离线展示和局部连续性，同时限制敏感材料留存。 | Chat 需要本地体验连续性，但不得延长授权或保存 forbidden body。 | 需要最小化、redaction、过期、logout/revoke 清理和设备范围约束；跨端一致性不自动成立。 | 这是数据边界和恢复架构机制，具体存储引擎后置。 |
| 共享客户端语义与平台 shell 分离 | 保持 Desktop/Web/Mobile 的业务状态和授权语义一致，同时适配窗口、输入、通知、深链和辅助技术。 | V1 Desktop-first 仍需为 Web/Mobile 保留扩展面；平台差异不应复制业务实现。 | 需要宿主能力矩阵、等价路径和平台降级，可能降低平台特有交互自由度。 | 这是跨端运行架构机制；Tauri、React、Capacitor 只是候选载体。 |
| fail-closed 的可见性与能力闸门 | 防止 URL、缓存、空列表、连接状态或平台登录绕过正式 actor/scope/visibility。 | 安全约束要求无法验证时 restricted/blocked/cleared，不能以“看起来可用”放行。 | 上游短暂失败会减少可见性和可操作性，需要清晰的恢复提示和 requery。 | 该机制影响入口、投影、缓存和操作路径，属于结构性安全决定。 |
| 共享语义层内建可访问状态表达 | 防止键盘、屏幕阅读器、焦点和 reduced-motion 只在某个平台末端补做，造成业务状态不可理解。 | 核心路径必须在支持的宿主上提供等价状态、错误、等待、撤销和恢复表达。 | 增加组件语义约束和跨端验证成本；具体辅助技术矩阵仍待 `OPEN-CHAT-009`。 | 该机制让可访问性成为业务状态表达的一部分，而非装饰层。 |

## 5. 采用 / 候选 / 不采用边界

| 类别 | 当前口径 | 进入正式架构的内容 |
|---|---|---|
| 正式采用 | 架构机制 | SDK-only 接入、外部语义隔离、来源感知只读投影、多轴状态/结果门控、formal change/resume、受限本地持久化、shell 分离、fail-closed、共享可访问语义。 |
| 候选载体 | 需要后续技术和方案验证 | React/TypeScript shared UI/core、Tauri Desktop、Web shell、Capacitor 类 Mobile shell，以及具体状态/存储/窗口库。 |
| 明确不采用 | 越过边界或伪造结果的路径 | 直连 owner/bus/共享 DB、raw body cache、离线审批、unknown 自动重放、Chat 聚合服务、Runtime/Tools 执行、Observability backend。 |

## 6. 机制与架构单元覆盖

| 架构单元 | 主要采用机制 | 选择目的 | 当前限制 |
|---|---|---|---|
| 协作体验语境 | 来源感知只读投影、多轴状态、fail-closed、可访问语义 | 让 safe material 可理解、可回链、可降级且不变成 truth。 | owner view/visibility/freshness contract 仍需确认。 |
| 受控协作意图 | SDK-only、结果门控、多轴状态、formal result/change | 分离 local intent/attempt 与正式 receipt/result，保护 unknown。 | Governance/Conversation receipt/idempotency surface 未闭合。 |
| 安全语境与导航 | SDK-only、fail-closed、shell 分离、受限持久化 | 保持 actor/scope/visibility 与路由、深链、缓存清理一致。 | 认证/会话/平台能力矩阵待确认。 |
| 变化与恢复连续性 | formal change/resume、显式状态、受限持久化 | 处理 duplicate/gap/expired/reconnect/unknown，不直连 bus。 | cursor/resume exact contract 未闭合。 |
| 平台体验与可访问性 | shell 分离、共享可访问语义、fail-closed | 跨 Desktop/Web/Mobile 保持业务语义和等价路径。 | Desktop host 与辅助技术 authority 尚未完全闭合。 |
| owner-safe 材料镜像 | 来源感知只读投影、SDK-only、最小披露 | 只持安全 view/ref/summary/preview/result/change。 | Artifact/Workspace/Observability safe surface 仍有 blocker。 |
| 本地展示与恢复投影 | 受限本地持久化、清理、显式恢复状态 | 支持重启、离线展示和草稿恢复，不延长授权。 | 持久化上限、跨端恢复和诊断 envelope 待确认。 |

## 7. 简化技术边界示意

```text
      +-----------------------------+
      | 平台 / Desktop-first shell  |
      | 具体产品仍为候选载体       |
      +-------------+---------------+
                    | 宿主能力边界
                    v
      +-------------+---------------+
      | 共享客户端语义与状态机制   |
      | safe projection / gating   |
      | change-resume / recovery   |
      +-------------+---------------+
                    | 唯一业务接入
                    v
      +-------------+---------------+
      | L0-sdk 正式接缝             |
      +-------------+---------------+
                    |
                    v
      +-----------------------------+
      | owner safe view/ref/result  |
      +-----------------------------+
```

图示说明：

- 图表达已采用的架构机制和边界位置，不表达具体框架、协议、代码模块或调用顺序。
- Desktop shell 是当前范围，具体承载产品名仍是候选；共享客户端语义必须独立于 shell。
- owner 只以 SDK safe material/result/change 进入，不能把 SDK 或 owner 实现扩散到核心。

## 8. 不采用口径

| 不采用的相邻路径 | 不采用原因 | 保留的替代边界 |
|---|---|---|
| Chat 直接调用各 owner API | 破坏单一 SDK 接入、授权和错误/恢复语义。 | 所有业务面经 `L0-sdk`。 |
| Chat 直接订阅内部 bus | 暴露 topic/offset/replay，形成 transport truth。 | SDK formal change/resume。 |
| 本地完整复制 owner 数据 | 形成第二真相、正文泄露和缓存授权延长。 | 最小 safe projection/ref，带来源/visibility/freshness。 |
| 离线副作用队列和自动重放 | unknown 下可能重复发送或重复治理。 | offline read/draft/recovery，副作用保持 unknown。 |
| 为 Chat 构建跨域后端聚合服务 | 让客户端项目重新拥有 Workspace/Governance/Runtime 等跨域 truth。 | owner safe view/export 经 SDK 消费。 |
| 以固定技术栈或历史性能数字作为架构决定 | 缺少 authority、工作负载和兼容矩阵。 | 机制先收敛，载体和数值后续由 Step 11/12/14 挂起。 |

## 9. Authority 与风险审计

| 选型项 | 当前状态 | 影响 / 风险 | 处理 |
|---|---|---|---|
| SDK-only 正式接入 | `adopted` | exact SDK capability、error、retry、redaction、resume 未闭合。 | 机制正式采用；方法/DTO/schema 保持 `CHAT-UP-001` pending。 |
| safe projection + provenance | `adopted` | owner visibility/freshness/version contract 需要逐项确认。 | 只定义能力级机制；不复制 owner DTO。 |
| multi-axis state/result gating | `adopted` | 状态组合多，需后续概要/详细设计保持轴隔离。 | 纳入架构主线；不指定状态库。 |
| change/resume continuity | `adopted` | Conversation cursor/resume 和 SDK event contract 未闭合。 | 作为边界机制；保持 gap/unknown/requery。 |
| constrained persistence | `adopted` | 持久化上限、清理、跨端恢复 authority 未闭合。 | 采用最小披露和清理机制；具体引擎/上限后置。 |
| shared core + shell separation | `adopted` | Desktop/Web/Mobile host/AT compatibility matrix 未闭合。 | Desktop-first；具体 shell 仍 candidate。 |
| React/TypeScript shared UI/core | `candidate` | 需要与 SDK surface、桌面 host、可访问性和长期维护 authority 对齐。 | 不写成正式实现事实，进入 Step 11 取舍。 |
| Tauri Desktop shell | `candidate` | host capability、分发和安全清理边界尚未形成正式矩阵。 | 作为 V1 候选，不宣称实现/readiness。 |
| Capacitor Mobile shell | `temporary candidate` | Mobile 不属于 V1 前置，后台/通知/恢复差异未闭合。 | 仅保留后续扩展假设。 |
| 具体传输、状态库、存储库、日志库 | `deferred` | 无 authority，且不是架构层主问题。 | 后续概要/详细设计或 Step 11/12 处理。 |

## 10. 当前 blocker 对技术选型的影响

| blocker | 影响 | 当前口径 |
|---|---|---|
| `CHAT-UP-001` | SDK surface 影响接缝实现载体和类型边界。 | SDK-only 机制已采用，具体 package/API/DTO 不锁定。 |
| `CHAT-UP-002` | change/resume 影响连续性机制的可落地方式。 | formal change/resume 机制已采用，transport 和 cursor contract pending。 |
| `CHAT-UP-003` | Governance receipt/idempotency 影响结果门控闭环。 | 结果门控已采用，confirmed 仍依赖正式 owner result。 |
| `CHAT-UP-004` | Artifact preview/ref 影响安全投影的 materialization。 | body-free projection/ref 机制已采用，preview surface pending。 |
| `CHAT-UP-005`、`WS-UP-001~008` | Workspace view/export/attention 影响跨域投影范围。 | 不建 Chat aggregator；只采用 safe projection 机制。 |
| `CHAT-UP-007`、`OPEN-CHAT-012` | 诊断 envelope 影响低敏 handoff 载体。 | 诊断接缝可选、低敏、失败隔离。 |
| `CHAT-NF-Q-001~005`、`OPEN-CHAT-009~011` | 精确性能、兼容、持久化和跨端 authority 缺失。 | 不固定数字、支持矩阵或技术产品结论。 |

## 11. 正式回填草稿

### 11.1 §11 关键技术选型

`L5-chat` 正式采用的架构层技术机制包括：外部语义隔离与 SDK-only 接入、来源感知的只读安全投影、多轴客户端状态与正式结果门控、formal change/resume 连续性承接、受限本地持久化与撤销/过期清理、共享客户端语义与平台 shell 分离、fail-closed 的可见性/能力闸门，以及共享语义层内建的可访问状态表达。这些机制直接保护真相边界、数据归属、通信承接、一致性和跨端语义，因此不属于局部实现便利。

具体框架、库、协议和平台产品仍保持候选或后置：React/TypeScript shared UI/core、Tauri Desktop、Web shell、Capacitor 类 Mobile shell、状态库、存储库和传输机制均不在本 Step 固化。当前只确认 Desktop-first 的承载方向和共享语义机制；不采用 Chat 直连 owner/bus/共享数据库、raw body cache、离线副作用重放、Chat 聚合后端、Runtime/Tools 执行和 Observability backend。

### 11.2 §11 代价与约束

上述机制会增加 SDK 合同维护、来源/新鲜度解释、多轴状态覆盖、变化恢复、敏感清理和跨端等价路径的成本；fail-closed 也会在上游不可用时降低可见性和可操作性。由于 `CHAT-UP-*`、`WS-UP-*`、`CHAT-NF-Q-*` 和 `OPEN-CHAT-*` 尚未闭合，任何具体技术载体、性能数字、兼容矩阵和持久化上限都保持 pending/blocked/deferred。

## 12. Step 自检与门禁

| 检查项 | 结果 | 说明 |
|---|---|---|
| 是否选择架构层技术机制而非技术名词清单 | `pass` | 八项机制均说明结构问题、理由、代价和架构层资格。 |
| 是否说明采用理由与代价 | `pass` | 主表和 authority 审计覆盖收益、约束和风险。 |
| 是否区分正式采用、候选载体和明确不采用 | `pass` | 机制、React/Tauri/Capacitor 候选和越界路径分列。 |
| 是否与依赖/数据/交互边界一致 | `pass` | SDK-only、safe projection、结果门控、change/resume、受限持久化互相闭合。 |
| 是否避免部署、协议、实现和完整备选比较 | `pass` | 未写 API、库版本、环境参数、时序或 Step 11 的方案对比。 |
| 是否保留技术 authority blocker | `pass` | SDK、性能、平台、持久化、诊断和兼容矩阵均保持 pending/blocked。 |
| 是否存在未经授权的技术事实 | `none` | Tauri/React/Capacitor 明确标为 candidate，不宣称实现/readiness。 |
| 是否完成正式 §11 回填草稿 | `pass` | 机制、边界、代价和不采用口径已形成。 |

## 13. Step 门禁

| 层级 | gate_status | gate_reason | next_allowed_action |
|---|---|---|---|
| 技术机制级 | `pass` | 八项架构层机制已逐项说明问题、理由、代价和边界；具体载体保持候选。 | 允许进入 Step 11，比较备选路径与取舍。 |
| Step / 模块级 | `pass` | 关键机制表、采用/不采用边界、平台候选和 authority 审计完成。 | 更新 flow 与项目台账后创建 Step 11。 |
| 文档级 | `in_progress` | 正式 `01-架构设计.md` 尚未完成 Step 11～16，旧正式文件仍保持 historical material。 | 继续 Step 11；不装配正式 `01`。 |
| 项目级 | `in_progress` | 本项目仍处于 `01` 架构校准，未进入 `02`。 | 保留 exact SDK/owner/platform blocker，按顺序进入 Step 11。 |


## 本轮逐章审查与修复（2026-10-01）

> 模式：regression-review / single-agent-serial。前轮记录作为差异材料；本节为当前章节修复基线。前序修复已通过，未闭合合同不升级为 ready。

### 执行计划与输入

- [x] 读取本 Step SOP、书写规范对应章、修复后 00、冻结原型和相关正式 owner 边界。
- [x] 顺序完成问题回答、旧材料诊断、取舍、结构化结果、复杂度判断和回填自检。
- [x] 只回填本 Step 对应现有正式章节并更新 flow/ledger；无实现、测试或 commit。

### 问题回答与诊断

什么需要技术机制？正式拓扑的只读图形、可访问列表、布局/缩放/焦点、每源状态 reducer、局部缓存失效。什么不需要？客户端 BPMN 引擎、编辑器、图形库状态决定业务。旧 §11 机制只覆盖通用 safe projection，无流程图承载。

用户已认可 Desktop-first 与 React/TypeScript、Tauri 的 draft 方向；认可不等于已核对 package/host 安全兼容，更不等于实现/运行证据。保留候选身份，明确方向与启用 gate，禁止以后凭“candidate”遗漏产品层架构。

### 结构化取舍与回填

采用只读流程渲染机制、版本感知局部 reducer、可访问等价列表。优先评估成熟 BPMN viewer/graph renderer；若正式输入为获准 BPMN 文档，可评估 bpmn-js viewer，若为已布局或结构化节点/边则评估通用图库；不能从 generic safe ref 拼 BPMN XML，也不能声明已选中/已验证具体库。不同 library 的编辑/模拟能力必须禁用或不纳入包。

回填 §11 正式机制与载体选择条件，配置只能裁剪表现能力，不能改 owner 状态/权限。复杂度：机制表与候选比较足够，无部署图。自检：无新增依赖安装，无许可证/兼容性通过声明；SDK 继续完成 query/auth/retry/trace/redaction。

### 门禁

- gate_status：pass（架构文档级；上游正向能力继续 blocked/pending）。
- gate_reason：只读流程渲染机制、开源复用边界与 SDK 适配策略已明确。
- next_allowed_action：进入 Step 11，重新读取其 SOP 与前序输入。
