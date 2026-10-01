# Step 7 · 依赖方向与层间约束

> 架构主题：明确 `L5-chat` 内部依赖角色、允许方向、禁止反向依赖、外部正式接缝和跨仓依赖裁剪。
> 当前状态：已完成本 Step 的层次划分、逐架构单元依赖停审、跨仓裁剪、依赖图和跨边界审计；允许进入 Step 8。
> 直接输入：`01_arch_step_03_responsibility_boundary.md`、`01_arch_step_04_system_context.md`、`01_arch_step_05_bounded_context_subdomains.md`、`01_arch_step_06_container_deployment.md`、`standards/document/全局项目依赖关系与裁剪规则.md`、`00-需求文档.md` §4/§6/§7/§10/§11/§12。
> 本步限制：只讨论架构责任层 / 依赖角色；不展开接口协议、数据库细节、调用链、代码目录、部署参数或数据一致性。

## 1. Step 开工确认

| 项目 | 记录 |
|---|---|
| Step | Step 7 · 依赖方向与层间约束 |
| 前置门禁 | Step 6 `pass` |
| 本步目标 | 保护 Chat 的客户端核心语义，确保所有 owner 能力经正式接缝进入，且运行期/事件协作不被误写成源码依赖。 |
| 本步输出 | 层次划分、依赖方向图、层间约束表、依赖倒置规则、逐架构单元停审、跨仓裁剪表、依赖类型分类表、禁止依赖表、裁剪图和跨依赖审计。 |
| 本步不展开 | API/DTO/event schema、数据库/缓存细节、容器拓扑、技术选型、实现目录和调用时序。 |
| 全局规则输入 | 只裁剪与 Chat 相关的全局依赖边；编译期、运行期、事件协作依赖必须分别标记。 |

## 2. SOP 问题回答

### 2.1 本仓内部层次如何划分？

本仓采用四类依赖角色，而不是把 Step 5 的子域名称直接当作层：

1. `核心语义角色`：维护客户端体验、局部状态和结果姿态的语义规则，保护 Chat 不变成 owner truth。
2. `编排 / 承接角色`：承接正式输入、组织页面语境、变化连续性和受控意图，并只向核心语义提供已解释的本地材料。
3. `外部接缝角色`：连接 `L0-sdk`、平台宿主能力和可选低敏诊断边界；它是外部能力进入 Chat 的唯一位置。
4. `技术承载角色`：提供本地受限状态和必要的宿主技术能力，但不拥有客户端业务语义定义权。

这四类角色表达依赖保护关系，不等于源码目录、运行容器、包名或 Step 5 的子域。核心语义位于最内层；编排/承接位于中间；外部接缝和技术承载位于外层。

### 2.2 允许哪些依赖方向？

- 外部接缝角色可以依赖编排/承接角色公开的稳定本地语义边界，并在接缝处使用 `L0-core` 与 `L0-sdk` 的正式契约。
- 技术承载角色可以依赖编排/承接角色定义的本地承载边界；它不能把存储或宿主能力反向变成核心业务语义。
- 编排/承接角色可以依赖核心语义角色的稳定规则和本地状态语义。
- 核心语义角色只依赖自身稳定的客户端语义契约，不直接依赖 owner API、SDK 传输、内部 bus、平台存储或诊断后端。
- owner、Workspace、Runtime、Artifact、Governance、Identity 等能力只能经正式 SDK 接缝进入；“经 SDK 运行时消费”不自动变成对 owner 源码或 package 的依赖。

### 2.3 禁止哪些反向依赖？

- 核心语义不得反向依赖外部接缝、平台 shell、存储实现、诊断 sink 或任何 owner 私有类型。
- owner 项目不得反向依赖 Chat 的页面、路由、store、草稿、缓存或 UI 状态。
- 平台 shell 不得反向定义业务状态、授权、Gate/Decision 结果或 Conversation/Turn truth。
- 本地投影、缓存和恢复上下文不得反向写入 owner truth，也不得成为 Workspace/Observability/Conversation 的替代 projection。
- Chat 不得直接依赖 `L0-bus` 的 broker/topic/offset/replay，也不得把事件协作边写成 package dependency。

### 2.4 外部系统通过哪些正式边界接入？

- `L0-core`：只作为共享契约来源，具体编译期使用范围限于正式边界角色；不提供业务入口。
- `L0-sdk`：唯一业务 query/command/ref/formal change/resume 接缝；精确 surface 仍由 `CHAT-UP-001` 等 blocker 约束。
- 平台宿主能力：通过平台接缝进入窗口、输入、通知、存储、深链和辅助技术能力；不得进入核心业务语义。
- 低敏诊断边界：只有正式能力闭合时才可交接错误类别和关联提示，不能成为业务主路径。
- 各正式 owner：不作为 Chat 的直接 package/API 依赖，只以 SDK 公开的 safe view/ref/summary/preview/receipt/result/change 运行时边界出现。

### 2.5 本仓涉及哪些跨仓依赖边？

根据全局基线，Chat 的直接编译期依赖候选是 `L0-core` 与 `L0-sdk`；运行期主要消费 Conversation、Workspace、Governance 等能力，并扩展到 Identity、Work、Artifact、Member、Runtime 和 Observability 的正式安全消费面。`L0-bus` 是系统事件主干，但 Chat 不直接订阅；formal change/event 只有在 SDK 提供正式能力时才作为 SDK 运行时接缝消费。`L6-bridges`、L4-archive、L3 capability/tooling、L4-sandbox 等不进入 Chat 当前主链。

### 2.6 哪些依赖必须倒置？

- 核心语义所需的 owner-safe 材料必须由外部接缝映射成 Chat-local 语义后注入；核心不直接认识 owner DTO、传输或权限实现。
- 受控意图的发送/治理能力必须由 SDK 接缝承接；核心只表达 intent/attempt/result posture，不依赖命令执行实现。
- 变化与恢复必须通过 formal change/resume 接缝进入；连续性规则不依赖 bus delivery 或 broker 状态。
- 本地持久化通过稳定的 Chat-local 承载边界倒置；核心不依赖某个数据库、浏览器存储或桌面存储实现。
- 低敏诊断通过可选 handoff 边界倒置；页面和核心不依赖诊断后端可用性。

### 2.7 哪些规则最容易在后续实现中失控？

1. 把 `L0-sdk` 的编译期契约依赖扩散到页面和核心语义，导致 owner DTO 成为第二真相。
2. 把运行期 owner 消费写成 package/path 依赖，绕过 SDK 的授权、redaction、retry 和 unknown 语义。
3. 把 SDK formal change 当成 `L0-bus` 直订，进而自行管理 topic、offset、replay 或顺序。
4. 把平台 shell 或本地存储的能力结果升级为业务成功、权限或新鲜度结论。
5. 让 Workspace、Observability、Artifact 或 Governance 的投影在 Chat 内重新聚合，形成反向 owner。

## 3. 历史材料与边界污染诊断

| 历史表达 | 污染风险 | 本 Step 处理 |
|---|---|---|
| “Chat 直接连接六域服务并统一编排” | 绕过 SDK，形成私有 API 与跨域反向依赖。 | 所有业务能力收缩到 SDK 外部接缝；owner 只以 safe material runtime boundary 出现。 |
| “事件总线是 Chat 的依赖包” | 把运行期事件协作写成 package dependency，并暴露 broker 语义。 | `L0-bus` 直接边裁剪；formal change 只经 SDK runtime seam。 |
| “view/store/adapter/repository 层依赖关系” | 将实现术语当作架构层，无法保护真相边界。 | 使用核心语义、编排/承接、外部接缝、技术承载四类架构角色。 |
| “缓存层依赖 Workspace/Conversation 数据库” | 形成共享 DB、反写 truth 或跨端隐式一致性。 | 本地状态只依赖 Chat-local 承载边界；owner 数据经 SDK 读取。 |
| “平台 shell 直接调用业务服务” | 让平台差异改变授权和结果语义。 | shell 只能通过外部接缝进入宿主能力；业务仍经 SDK。 |
| “Observability 作为页面必需下游” | 诊断 sink 失败会影响业务主路径或产生审计越权。 | 低敏诊断是可选运行期边界，失败隔离。 |

## 4. 层次划分与依赖方向结论

| 架构责任层 / 依赖角色 | 位置 | 允许依赖方向 | 保护目标 |
|---|---|---|---|
| 核心语义角色：客户端产品语义 | 最内层 | 只依赖稳定的 Chat-local 语义契约和由内向外定义的需求边界。 | 防止 UI、owner DTO、传输、平台和存储成为业务真相。 |
| 编排 / 承接角色：客户端状态与意图承接 | 中间层 | 依赖核心语义；承接外部接缝映射后的 safe material、formal result/change 和本地状态语义。 | 防止页面直接接 SDK、命令结果与局部状态混合。 |
| 外部接缝角色：正式 SDK / 平台 / 诊断接缝 | 外层 | 依赖编排/承接定义的本地边界；接入 `L0-core`、`L0-sdk` 或平台能力。 | 把 owner、SDK、shell 和诊断隔离在边界上。 |
| 技术承载角色：本地受限状态与宿主支撑 | 外层 | 依赖编排/承接定义的承载语义；只提供存储和宿主能力。 | 防止技术设施反向决定业务状态、授权和结果。 |

## 5. 依赖方向图

```text
      +===========================================================+
      |                  L5-chat 依赖边界                         |
      |                                                           |
      |  +-------------------------------+                        |
      |  | 外部接缝角色                  |                        |
      |  | SDK / 平台 / 诊断正式接缝     |                        |
      |  +---------------+---------------+                        |
      |                  | 允许依赖                                  |
      |                  v                                           |
      |  +---------------+---------------+        +----------------+ |
      |  | 编排 / 承接角色              |<-------| 技术承载角色   | |
      |  | 客户端状态与意图承接        | 允许依赖 | 本地受限支撑   | |
      |  +---------------+---------------+        +----------------+ |
      |                  | 允许依赖                                  |
      |                  v                                           |
      |  +-------------------------------+                           |
      |  | 核心语义角色                  |                           |
      |  | 客户端产品语义                |                           |
      |  +-------------------------------+                           |
      +===========================================================+
```

图示说明：

- 箭头只表示允许依赖方向，指向被保护的更内层角色；不表示调用顺序、运行拓扑或协议交互。
- 外部接缝和技术承载只能依赖 Chat-local 的编排/承接边界，不能穿透核心语义直接决定 owner 结果。
- 核心语义不直接依赖 SDK、owner、平台、存储或诊断实现；必要能力通过边界倒置进入。

## 6. 层间约束表

| 架构责任层 / 依赖角色 | 允许依赖 | 禁止依赖 | 说明 |
|---|---|---|---|
| 核心语义角色：客户端产品语义 | Chat-local 状态语义、来源/visibility/freshness 解释规则、受控结果姿态契约。 | `L0-sdk` 方法/DTO、owner 私有 API、内部 bus、平台存储、诊断后端、共享数据库和任何外部生命周期。 | 核心只表达用户体验与局部语义，不拥有外部真相。 |
| 编排 / 承接角色：客户端状态与意图承接 | 核心语义、正式接缝提供的 safe material/result/change、明确的本地承载边界。 | 直接调用 owner、直接订阅 bus、把 SDK ACK 当 confirmed、向 owner 反写本地 projection。 | 是外部接缝与核心语义之间的唯一承接层。 |
| 外部接缝角色：SDK 接缝 | `L0-core`、`L0-sdk` 正式契约和编排/承接定义的 Chat-local 边界。 | owner 私有 package/API、内部 bus broker、跨仓共享数据库、页面组件和核心直接写入。 | 编译期契约和运行期业务入口只在接缝处收口。 |
| 外部接缝角色：平台接缝 | 平台宿主能力与编排/承接定义的输入、通知、存储、深链和辅助技术边界。 | 平台直接修改业务状态、直接调用 owner、凭通知/窗口状态确认业务结果。 | 平台只是宿主能力来源。 |
| 外部接缝角色：诊断接缝 | 正式允许的低敏分类、关联 ref 和 handoff 语义。 | raw body、credential、raw log、内部 bus、正式 audit/evidence 写入和业务结果依赖。 | 诊断是可选支链，故障不改变主路径。 |
| 技术承载角色：本地受限支撑 | 编排/承接规定的本地持久化和清理语义、平台存储能力。 | Workspace/Conversation/Artifact/Decision truth、共享缓存、远端数据库、权限表。 | 只承载 Chat-local 状态和最小安全展示材料。 |

## 7. 逐架构单元依赖规则与停审

### 7.1 架构单元 A：协作体验语境

| 项目 | 依赖结论 |
|---|---|
| 允许依赖 | 编排/承接提供的 Chat-local view 语义、来源/visibility/freshness 解释和安全降级状态。 |
| 禁止依赖 | 直接依赖 `L0-sdk` API/DTO、owner 私有接口、内部 bus、平台存储、诊断后端或任何 owner lifecycle。 |
| 依赖倒置 / 接入 | 外部 safe material 先由 SDK 接缝转换为 Chat-local 语义，再进入体验规则；核心不认识 owner 原始契约。 |
| 主要保护 | 防止页面显化成为 Conversation、Governance、Artifact、Workspace 或 Runtime 第二真相。 |
| 停审 | `pass`：层级清楚，禁止依赖明确，运行期消费未误写为 package dependency。 |

### 7.2 架构单元 B：受控协作意图

| 项目 | 依赖结论 |
|---|---|
| 允许依赖 | 核心体验的当前选择/语境、编排/承接的 local intent/attempt 语义、SDK 接缝提供的正式 receipt/result/change。 |
| 禁止依赖 | 直接实现或调用 Conversation/Governance command、直接重放 unknown、副作用确认依赖 transport ACK、向 owner 直接写入。 |
| 依赖倒置 / 接入 | 意图只经正式 SDK 接缝出站；核心只接收 formal result/change 映射，不接收命令执行实现。 |
| 主要保护 | 防止按钮、optimistic 状态或本地尝试变成 owner confirmed。 |
| 停审 | `pass`：意图和结果边界清楚，unknown 不被当作可重放许可，SDK 依赖被限制在接缝。 |

### 7.3 架构单元 C：安全语境与导航

| 项目 | 依赖结论 |
|---|---|
| 允许依赖 | 平台导航能力、SDK 提供的 actor/session/scope/visibility 结果和编排/承接的清理语义。 |
| 禁止依赖 | credential 签发、权限/Policy 数据库、对象名称推断、URL/空列表推断、平台登录状态作为认证真相。 |
| 依赖倒置 / 接入 | 身份和可见性通过正式 SDK safe result 进入；导航只提供 Chat-local 位置，不向 owner 授权。 |
| 主要保护 | 防止 route、deep link、缓存和 shell 状态绕过 Identity/Governance 的正式边界。 |
| 停审 | `pass`：安全入口依赖正式边界，平台和本地状态未被写成权限来源。 |

### 7.4 架构单元 D：变化与恢复连续性

| 项目 | 依赖结论 |
|---|---|
| 允许依赖 | SDK formal change/resume 接缝、编排/承接的连续性规则和本地受限恢复边界。 |
| 禁止依赖 | 直接依赖 `L0-bus` topic/offset/replay、墙上时间排序、连接状态确认业务变化、后台 worker 直接执行 owner 副作用。 |
| 依赖倒置 / 接入 | 变化只经 SDK 接缝进入；恢复/缺口规则向核心提供 stale/gap/unknown 语义，而不是暴露 transport/broker。 |
| 主要保护 | 防止事件投递技术细节变成 Conversation/Workspace/Decision 的客户端真相。 |
| 停审 | `pass`：事件协作被正确裁剪为 SDK runtime boundary，未误写成直接事件依赖或 package dependency。 |

### 7.5 架构单元 E：平台体验与可访问性

| 项目 | 依赖结论 |
|---|---|
| 允许依赖 | 平台宿主能力接缝、核心语义定义的状态解释和编排/承接的可访问性需求。 |
| 禁止依赖 | 平台 API 直接访问 owner、平台通知/窗口状态决定业务结果、平台专属权限替代正式 visibility。 |
| 依赖倒置 / 接入 | shell 能力由外部接缝提供，产品语义向内依赖稳定宿主能力抽象，而不是某个平台实现。 |
| 主要保护 | 保证 Desktop/Web/Mobile 的平台差异不改变业务授权、状态和结果。 |
| 停审 | `pass`：平台是外部支撑，不形成反向业务依赖；兼容矩阵未被伪造为已闭合。 |

### 7.6 架构单元 F：owner-safe 材料镜像

| 项目 | 依赖结论 |
|---|---|
| 允许依赖 | `L0-sdk` 正式 safe view/ref/summary/preview/receipt/result/change 边界，以及核心需要的来源/visibility/freshness 语义。 |
| 禁止依赖 | owner 私有 DTO/API、原始正文、credential/token/secret、raw log、跨 owner projection service 和本地反写。 |
| 依赖倒置 / 接入 | owner 能力通过 SDK 接缝映射为最小 Chat-local 材料；核心消费映射后的语义，不绑定 owner 内部结构。 |
| 主要保护 | 防止外部 truth、正文和权限规则侵入 Chat 持有面。 |
| 停审 | `pass`：runtime consumption 与 compile-time dependency 已分开，safe material 不是第二真相。 |

### 7.7 架构单元 G：本地展示与恢复投影

| 项目 | 依赖结论 |
|---|---|
| 允许依赖 | 技术承载角色提供的本地状态边界、安全清理规则和变化/恢复语义；可保存最小 Chat-local 状态。 |
| 禁止依赖 | 远端 owner 数据库、共享缓存、Workspace/Conversation projection、未脱敏正文、权限表和平台私有业务接口。 |
| 依赖倒置 / 接入 | 存储由技术承载角色实现，业务语义通过 Chat-local 边界请求；撤销、过期和 scope 变化由安全/连续性规则驱动清理。 |
| 主要保护 | 防止本地投影成为 owner truth、延长授权或形成跨端隐式同步。 |
| 停审 | `pass`：本地持久化依赖被隔离，缓存/恢复未成为直接业务依赖或反向写入路径。 |

## 8. 本仓依赖裁剪表

| 关联项目 | 全局关系 | 本仓角色 | 依赖类型 | 是否进入当前文档主链 | 裁剪理由 |
|---|---|---|---|---|---|
| `L0-core` | `L5-chat` 编译期依赖共享契约 | 依赖方 | 编译期 | 是（限正式边界角色） | 保留共享安全/错误/引用契约的编译边；不把 L0-core 当业务服务入口。 |
| `L0-sdk` | `L5` 产品编译期依赖 SDK；业务能力经 SDK 运行时消费 | 依赖方 / 唯一业务接缝使用方 | 编译期 + 运行期 | 是 | 这是 Chat 的唯一正式业务接入边界；exact package/surface 受 `CHAT-UP-001` 约束。 |
| `L1-conversation` | 产品经 SDK 消费 Conversation 能力 | 运行期消费方 | 运行期 | 是 | 只消费 safe view/ref/result/formal change；不编译依赖 Conversation 源码或直订 bus。 |
| `L1-identity` | Chat 需要 actor/identity 安全语境 | 运行期消费方 | 运行期 | 是 | 只消费 safe identity/visibility 结果；认证和 GlobalMember truth 不进入 Chat。 |
| `L1-work` | Chat 需要 Project/Work/ProjectMember 安全摘要 | 运行期消费方 | 运行期 | 是 | 只消费安全摘要和入口状态；不推进 Work truth。 |
| `L1-governance` | Chat 需要 Gate/Decision 受控语境和结果 | 运行期消费方 | 运行期 | 是 | 仅通过 SDK 发起受控意图并消费 receipt/result/change；不本地批准。 |
| `L1-artifact` | Chat 需要 Artifact safe ref/summary/preview | 运行期消费方 | 运行期 | 是 | 保留 body-free 引用和预览边界；不复制正文、血缘或 Evidence/Baseline truth。 |
| `L1-workspace` | Chat 消费 Workspace safe view/export | 运行期消费方 | 运行期 | 是（条件化） | `WS-UP-001~008` 未闭合时只保留 stale/partial/blocked；不建 Chat projection。 |
| `L2-member` | Chat 消费成员运行/交互安全摘要 | 运行期消费方 | 运行期 | 是（条件化） | 只显示 safe presence/interaction 状态，不拥有 Member 容器 truth。 |
| `L2-runtime` | Chat 消费运行状态和受控入口 | 运行期消费方 | 运行期 | 是（条件化） | 只显示 safe status/gap；不执行 Runtime、Tools、Capability 或 Sandbox。 |
| `L4-observability` | Chat 需要低敏诊断/关联交接 | 协作方 | 运行期 | 是（仅诊断支链） | `CHAT-UP-007` / `OPEN-CHAT-012` 未闭合时保持 blocked/deferred；不直写 backend。 |
| `L0-bus` | 全局事件主干；产品默认不得直接订阅 | 被裁剪的事件边 | 事件协作（直接边裁剪） | 否 | formal change 仅经 SDK 提供；Chat 不使用 broker/topic/offset/replay。 |
| `L4-archive` | 归档恢复基础设施，不在 Chat 当前主链 | 非直接依赖 | 运行期/事件协作（未纳入） | 否 | Chat 只消费 owner/SDK 给出的恢复语境，不直接读取归档或快照。 |
| `L3-capability-hub` / `L3-method-library` | Runtime/工具能力来源 | 边界外对象 | 运行期（间接） | 否 | Chat 不执行方法、工具或能力访问；只消费 Runtime safe status。 |
| `L4-sandbox` | Runtime 隔离承载 | 边界外对象 | 运行期（间接） | 否 | Chat 不进入 sandbox，不把宿主健康当业务状态。 |
| `L6-bridges` | 并行兄弟，外部平台映射 | 边界参考 | 运行期/事件协作（不接入） | 否 | 未停审设计不作为正式输入；Chat 不消费外部正文或映射状态。 |

## 9. 本仓依赖类型分类表

| 依赖类型 | 关联项目 | 本仓如何使用 / 提供能力 | 后续文档落点 |
|---|---|---|---|
| 编译期依赖 | `L0-core` | 仅在正式接缝角色使用共享安全、错误、引用和元数据契约；具体 package 边界待确认。 | Step 10/11 的技术选型；后续详细设计/实施计划再确认 package。 |
| 编译期 + 运行期依赖 | `L0-sdk` | 编译期承接 SDK 正式契约，运行期经 SDK 消费 owner-safe query/command/ref/result/change/resume。 | Step 9 的交互边界、Step 10 的技术选型；exact surface 仍 blocked。 |
| 运行期依赖 | `L1-conversation`、`L1-identity`、`L1-work`、`L1-governance`、`L1-artifact`、`L1-workspace` | 通过 `L0-sdk` 消费安全 view/ref/summary/preview/result/change；不直接调用 owner API。 | Step 9 交互、Step 8 数据边界、Step 12 横切约束。 |
| 运行期依赖 | `L2-member`、`L2-runtime` | 通过正式 SDK 消费成员/运行安全摘要、状态和 gap；不执行容器或 Runtime。 | Step 8 数据边界、Step 9 交互、Step 12 横切约束。 |
| 运行期依赖 | `L4-observability` | 仅在正式能力存在时交接低敏错误类别、correlation/ref 和支持语境。 | Step 9/12/14；`CHAT-UP-007`、`OPEN-CHAT-012`。 |
| 运行期依赖 | 平台宿主能力 | 提供窗口、输入、通知、存储、深链、返回和辅助技术能力。 | Step 10/11/12；平台矩阵待确认。 |
| 事件协作依赖 | `L0-bus` | Chat 不直接发布/订阅；只消费由 `L0-sdk` 封装的 formal change/resume。 | Step 9 只讨论 SDK 公开语义；不得进入 package dependency。 |

## 10. 本仓禁止依赖表

| 禁止依赖 | 禁止原因 | 正确协作方式 |
|---|---|---|
| `L5-chat -> L1-*` 私有 API / 源码 package | 绕过 SDK、授权、redaction、错误和 unknown 语义；形成 owner 反向耦合。 | 经 `L0-sdk` 的 safe view/ref/query/command/result/change 边界。 |
| `L5-chat -> L0-bus` 直接订阅或发布内部 topic | 暴露 broker delivery、offset、replay 和内部事件语义，破坏 SDK-only 边界。 | 由 `L0-sdk` 提供正式 change/resume 能力；若无正式能力则 blocked/deferred。 |
| `L5-chat ->` 共享数据库、owner projection 或远端缓存 | 形成第二真相、跨端隐式写入和越权恢复。 | 使用 SDK 正式读取；本地只保留受限 Chat-local 状态。 |
| `L5-chat -> L6-bridges` 外部正文/映射 | 把外部平台生命周期吸收到内部 Conversation truth。 | 等正式 owner/SDK safe ref 或 bridge contract；当前不接入。 |
| `L5-chat -> L2-runtime/L3/L4-sandbox` 执行面 | Chat 不拥有推理、Tools、Capability、Sandbox 或 handoff 执行。 | 只消费 Runtime safe summary/status/gap，受控入口仍经正式 owner/SDK。 |
| `L5-chat -> L4-observability` raw log/audit backend | 让 UI 日志成为正式观测/审计真相并扩大敏感持有面。 | 低敏诊断 handoff；exact envelope 未闭合时保持 blocked/deferred。 |
| 核心语义角色 -> SDK/owner/platform/storage 具体实现 | 破坏依赖倒置，把外部边界侵入核心。 | 外部接缝依赖核心定义的 Chat-local 边界，注入 safe material 和结果姿态。 |
| owner / shell -> Chat UI/store/cache | 形成反向依赖或让平台/owner 改写客户端真相。 | owner 只提供正式结果/change，shell 只提供宿主能力。 |

## 11. 依赖裁剪图: L5-chat

```text
Global baseline
  |
  | crop only related edges
  v
+----------------------+
| L5-chat              |
+----+---------+-------+
     |         |       \
     |         |        \ [event] direct edge cropped
     |         |         X
     |         |       L0-bus
     |         |
     |         +--[compile]--> L0-core
     |
     +--[compile/runtime]--> L0-sdk
                                  |
                                  +--[runtime]--> L1 owner safe boundaries
                                  |
                                  +--[runtime]--> L2 member/runtime safe boundaries
                                  |
                                  +--[runtime]--> L4-observability diagnostic boundary
```

图示说明：

- 本图只展示 `L5-chat` 相关依赖，不展示全 27 仓；`L1 owner safe boundaries` 是 Conversation、Identity、Work、Governance、Artifact、Workspace 的收缩表达。
- `[compile]` 可在后续确认后进入 package dependency；`[runtime]` 和 `[event]` 不得写成 Chat 的 package dependency。
- `L0-bus` 的直接事件边被裁剪；Chat 只消费 `L0-sdk` 暴露的正式变化/恢复语义，箭头不表达调用顺序。

## 12. 依赖倒置与边界保护结论

### 12.1 SDK 接缝倒置

`L0-sdk` 的具体类型和传输面只在外部接缝角色出现。核心语义和编排/承接只依赖 Chat-local 的安全材料、结果姿态和变化连续性语义；当 SDK surface 变化时，应在接缝处调整映射，不把 owner DTO、transport ACK 或错误实现扩散进核心。

### 12.2 本地状态承载倒置

核心只声明草稿、选择、恢复和受限展示材料的语义需要，技术承载角色提供设备范围内的存储能力。存储实现、浏览器/桌面差异和清理机制不得改变 `draft`、`unknown`、`stale` 或 `confirmed` 的业务解释。

### 12.3 变化与诊断边界倒置

变化连续性依赖 SDK formal change/resume 语义，而不是 bus 细节；诊断依赖可选低敏 handoff，而不是 Observability backend。两者都可以不可用，且不可用时只能收紧客户端姿态，不能阻断或伪造 owner truth。

## 13. 架构单元依赖总审计

| 审计项 | 结果 | 证据 / 处理 |
|---|---|---|
| 是否按架构单元逐个定义允许/禁止依赖 | `pass` | Step 5 的七个单元 A～G 均有允许、禁止、倒置和停审记录。 |
| 是否明确核心、中间、外部接缝和技术承载层次 | `pass` | 四类依赖角色和方向图已收敛。 |
| 是否保持 SDK 唯一业务接入边界 | `pass` | 所有 owner 运行期边均经 `L0-sdk`；无私有 API、共享 DB 或内部 bus 直连。 |
| 是否把运行期通信误写成 package dependency | `pass` | 运行期与事件协作在裁剪表/分类表中单独标记；只有 `L0-core`/`L0-sdk` 编译边进入候选。 |
| 是否把 SDK 事件误写成 `L0-bus` 事件依赖 | `pass` | 直接 `L0-bus` 边明确裁剪，formal change 归 SDK runtime boundary。 |
| 是否存在反向依赖 | `none` | owner、shell、技术承载、诊断均不反向定义 Chat 核心语义；核心不依赖外部实现。 |
| 是否误用 adapter/repository/handler 作为架构规则 | `pass` | 只使用依赖角色和正式接缝，不以实现名词定义层。 |
| 是否有跨仓裁剪不一致 | `none` | 与全局矩阵的 `L0-core/L0-sdk` compile、owner via SDK runtime、L0-bus indirect event 口径一致。 |
| 是否保留后续概要设计风险 | `pass` | exact SDK surface、owner visibility/cursor、diagnostic envelope 和 platform matrix 保持 blocker/pending。 |
| 是否存在 unresolved 依赖冲突 | `none` | 未发现反向依赖或类型误判；未闭合合同不被强行补齐。 |

## 14. 正式回填草稿

### 14.1 §8 依赖方向与层间约束

`L5-chat` 的依赖边界分为核心语义角色、编排/承接角色、外部接缝角色和技术承载角色。核心语义只依赖稳定的 Chat-local 语义契约；编排/承接依赖核心并承接正式输入；SDK、平台和诊断接缝位于外层，依赖 Chat-local 边界并分别接入 `L0-sdk`、宿主能力和低敏诊断；本地受限状态只提供技术承载，不反向定义业务语义。允许依赖方向朝向被保护的内层，核心不得直接依赖 owner、SDK 实现、内部 bus、平台存储、诊断后端或共享数据库。

### 14.2 §8 跨仓依赖裁剪

Chat 仅保留 `L0-core` 和 `L0-sdk` 的编译期契约边，并通过 `L0-sdk` 在运行期消费 Conversation、Identity、Work、Governance、Artifact、Workspace、Member、Runtime 和低敏 Observability 能力。`L0-bus` 的直接事件协作边被裁剪，formal change/resume 只有在 SDK 提供正式能力时才进入运行时主链；L6-bridges、L4-archive、L3 capability/tooling 和 L4-sandbox 不进入 Chat 当前主链。运行期和事件协作关系不得被改写为 package dependency。

### 14.3 §8 禁止依赖红线

Chat 不得直连 owner 私有 API、内部 bus、共享数据库、外部平台正文、Runtime/Tools/Sandbox 执行面或 Observability raw backend；核心语义不得反向依赖 SDK/平台/存储具体实现；本地投影不得反写 owner truth。所有正式业务读取、受控意图、变化和恢复必须经 `L0-sdk` 正式边界，平台和诊断能力缺失只能收紧客户端姿态。

## 15. Step 自检与门禁

| 检查项 | 结果 | 说明 |
|---|---|---|
| 是否明确内部层次和允许方向 | `pass` | 四类依赖角色、内向箭头和保护目标已定义。 |
| 是否明确禁止反向依赖和依赖倒置 | `pass` | 核心、owner、shell、存储、诊断和 bus 红线均有表格和说明。 |
| 是否按架构单元逐个停审 | `pass` | A～G 七个单元均完成依赖规则和停审记录。 |
| 是否完成全局依赖裁剪三张表 | `pass` | 裁剪表、类型分类表和禁止依赖表均已输出。 |
| 是否完成 `[compile]` / `[runtime]` / `[event]` 裁剪图 | `pass` | 图标题和标注符合全局规则；直接 L0-bus event 边标为裁剪。 |
| 是否避免把运行期/事件关系写成 package dependency | `pass` | 只有 L0-core/L0-sdk 编译期候选进入 package 讨论，其他关系保持边界语义。 |
| 是否避免把实现名词当作架构层 | `pass` | 未使用 service/repository/handler/module/package 作为正式层名。 |
| 是否保留 blocker 与未闭合合同 | `pass` | `CHAT-UP-*`、`WS-UP-*`、`OPEN-CHAT-*`、平台和诊断缺口均保持 pending/blocked/deferred。 |
| 是否完成正式 §8 回填草稿 | `pass` | 层间约束、依赖裁剪和禁止红线已形成。 |

## 16. Step 门禁

| 层级 | gate_status | gate_reason | next_allowed_action |
|---|---|---|---|
| 架构单元级 | `pass` | 七个架构单元依赖规则已逐个停审，无反向依赖和运行期/事件类型误判。 | 允许进入 Step 8；按单元收敛数据所有权与一致性。 |
| Step / 模块级 | `pass` | 层次、依赖方向、依赖倒置、跨仓裁剪、禁止依赖和总审计全部完成。 | 更新 flow 与项目台账后创建 Step 8。 |
| 文档级 | `in_progress` | 正式 `01-架构设计.md` 尚未完成 Step 8～16，旧正式文件仍保持 historical material。 | 继续 Step 8；不装配正式 `01`。 |
| 项目级 | `in_progress` | 本项目仍处于 `01` 架构校准，未进入 `02`。 | 保留 exact SDK/owner/platform blocker，按顺序进入 Step 8。 |


## 本轮逐章审查与修复（2026-10-01）

> 模式：regression-review / single-agent-serial。前轮记录作为差异材料；本节为当前章节修复基线。前序修复已通过，未闭合合同不升级为 ready。

### 执行计划与输入

- [x] 读取本 Step SOP、书写规范对应章、修复后 00、冻结原型和相关正式 owner 边界。
- [x] 顺序完成问题回答、旧材料诊断、取舍、结构化结果、复杂度判断和回填自检。
- [x] 只回填本 Step 对应现有正式章节并更新 flow/ledger；无实现、测试或 commit。

### 问题回答、诊断与取舍

新增页面应依赖什么？只依赖共享展示/意图边界；adapter 适配 SDK，reducer 不依赖 owner/bus。BPMN 库只能布局/渲染，不能提供业务推进、分支完成或汇聚结果。旧 §8.3 漏 Process；§8.2 把 L0-core 列为默认 allowed，需服从 SDK 已确认的导出/正式共享类型而非任意 direct import。

### 七单元依赖复核

按 A→G 顺序逐个复核：A 页面依赖内层展示语义，不依赖 owner；B 意图经注入的正式命令边界，不依赖治理实现；C 导航依赖正式授权与关系结果，不从 URL 推范围；D reducer 输入来自 SDK adapter，不依赖内部 bus；E 平台 adapter 依赖局部宿主边界，不推业务状态；F safe mirror 只接受 adapter 输出，不访问 sibling repository；G 受限 cache 依赖本地承载，不回写远端。每单元结论为边界级 pass，正向 capability pending。

### 结构化结果与回填

Process 加入 SDK runtime/ref/change 消费列表；公司目录 provider 没有正式能力时阻塞。UI 图形库作为可替换表现依赖；核心状态与 reducer 不依赖图形库自带模拟/编辑状态。L0-core 仅经正式 re-export 或已核对 compile surface 使用。回填 §8.2～§8.4。已有依赖图保留；跨单元审计无环、无旁路、无 owner package 依赖，幂等/重连仍委托正式 SDK。

### 门禁

- gate_status：pass（架构文档级；上游正向能力继续 blocked/pending）。
- gate_reason：新增流程与目录消费依赖已裁剪，UI 不绑定 owner 或图形库执行语义。
- next_allowed_action：进入 Step 8，重新读取其 SOP 与前序输入。


### 本轮 Step 7 模块 A 独立自检

- 问题：项目/图形页面依赖谁？
- 诊断：旧摘要范围不含流程图。
- 取舍：只依赖展示语义，库可替换。
- 结构化/回填：图形库不提供业务事实。
- gate_status：pass（本模块架构边界）；exact 合同未闭合部分保持 blocked/pending，允许进入下一个模块。


### 本轮 Step 7 模块 G 独立自检

- 问题：缓存能反写吗？
- 诊断：恢复易越界。
- 取舍：局部承载倒置，清理受限。
- 结构化/回填：不共享 DB 或自动重放。
- gate_status：pass（本模块架构边界）；exact 合同未闭合部分保持 blocked/pending，允许进入下一个模块。



### 本轮 Step 7 模块 F 独立自检

- 问题：材料镜像依赖 repository 吗？
- 诊断：影子可能变成聚合源。
- 取舍：SDK-only safe material。
- 结构化/回填：不依赖 sibling 私有存储。
- gate_status：pass（本模块架构边界）；exact 合同未闭合部分保持 blocked/pending，允许进入下一个模块。



### 本轮 Step 7 模块 E 独立自检

- 问题：宿主变化影响业务吗？
- 诊断：平台连接不是业务成功。
- 取舍：宿主只是技术适配。
- 结构化/回填：无平台授权裁决。
- gate_status：pass（本模块架构边界）；exact 合同未闭合部分保持 blocked/pending，允许进入下一个模块。



### 本轮 Step 7 模块 D 独立自检

- 问题：变化 reducer 依赖什么？
- 诊断：按来源水位不等价。
- 取舍：adapter 输入，各源隔离。
- 结构化/回填：不引入 broker offset。
- gate_status：pass（本模块架构边界）；exact 合同未闭合部分保持 blocked/pending，允许进入下一个模块。



### 本轮 Step 7 模块 C 独立自检

- 问题：导航如何确认绑定？
- 诊断：route 无 authority。
- 取舍：消费正式关系/访问结果。
- 结构化/回填：不解析 ref 推 scope。
- gate_status：pass（本模块架构边界）；exact 合同未闭合部分保持 blocked/pending，允许进入下一个模块。



### 本轮 Step 7 模块 B 独立自检

- 问题：命令接入能否页面直连？
- 诊断：按钮误当 owner 提交。
- 取舍：意图边界经 SDK 倒置。
- 结构化/回填：无 owner/bus/package 旁路。
- gate_status：pass（本模块架构边界）；exact 合同未闭合部分保持 blocked/pending，允许进入下一个模块。
