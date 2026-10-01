# L5-chat 02 · Step 4 代码主体框架映射

> Step 状态：`done`
> gate_status：`pass`
> 本步主题：把 `01-架构设计.md` 的客户端架构单元映射为概要设计层的代码主体骨架，并区分业务主要组成部分与实现分层。
> 生成依据：`standards/document/概要设计讨论流程_SOP.md` §5 Step 4；`standards/document/概要设计书写规范.md` §4.4。
> 上游输入：Step 1～3 中间产物、`projects/L5-chat/00-需求文档.md`、`projects/L5-chat/01-架构设计.md`、`draft/03_模块划分与分层.md`。

## 1. Step 内计划

| 子阶段 | 产物 | 状态 | 门禁 |
|---|---|---|---|
| 读取输入 | Step 1～3、01 架构单元和 draft 分层候选 | `done` | 输入已通过前序门禁 |
| 回答 SOP 问题 | 架构模块、代码主体和实现层映射回答 | `done` | 未混淆业务部分和技术层 |
| 历史材料诊断 | 旧目录树、组件名和服务端模块混入 | `done` | 未沿用旧目录/包名 |
| 设计取舍 | 采用 shared semantic core + platform shell + SDK/port 边界 | `done` | 与 01/Step 3 一致 |
| 结构化产物 | 两张 ASCII 图、映射表、关键判断 | `done` | 图格式符合规范 |
| 复杂度判断 | 需要两张必需图；不补部署图或类图 | `done` | §4.4 图示门禁通过 |
| 回填草稿 | §4 回填草稿 | `done` | 只写代码主体骨架，不写目录 |
| 自检与门禁 | 主体命名、分层、依赖方向和图审计 | `done` | `pass`，允许创建 Step 5 |

## 2. SOP 问题回答

### 2.1 架构层模块分别映射到哪些代码主体骨架？

`01` 的客户端同步入口单元映射到 `ClientApplicationShell`、`RouteContextCoordinator`、`PageViewModelAssembler` 和页面/路由入口主体；客户端连续性承接单元映射到 `ChangeStreamAdapter`、`ChangeReducer`、`ResumeCoordinator`、`RecoveryViewModel`；本地受限状态承载映射到 `ClientStateStore`、`LocalProjectionRepository`、`DraftStore`、`CacheEvictionCoordinator`；共享产品语义映射到 `ChatSemanticPolicy`、`CommandResultGate`、`VisibilityGuard`、`SafeMaterialComposer`；外部接缝映射到 `SdkQueryAdapter`、`SdkCommandAdapter`、`SdkChangeAdapter`、`SdkReferenceAdapter`、`PlatformCapabilityAdapter` 和 `DiagnosticHandoffAdapter`。

### 2.2 哪些主体属于 Inbound/Operations，哪些属于 Application Services？

Inbound/Operations 主体承接用户/平台输入、SDK 变化、resume/requery、缓存清理和诊断 handoff；它们包括应用壳入口、SDK change adapter、平台生命周期 adapter、`ResumeCoordinator`、`CacheEvictionCoordinator` 和低敏诊断入口。Application 层包括 `RouteContextCoordinator`、`SafeMaterialQueryCoordinator`、`UserIntentCoordinator`、`PreviewCoordinator` 和 `RecoveryCoordinator`，负责把入口动作编排到本地语义和正式 SDK 边界。它们不拥有 owner truth。

### 2.3 哪些主体属于本地语义/状态，哪些属于 Ports/Projection？

本地语义主体包括 Chat-local context、selection、draft、attempt、recovery、结果姿态和可见性/新鲜度解释；它们由 `ClientStateStore`、`ChatSemanticPolicy`、`CommandResultGate`、`VisibilityGuard` 和 `ChangeReducer` 承接。Projection/Ports 主体包括 safe material view model、`LocalProjectionRepository`、`Sdk*Adapter`、`PlatformCapabilityPort`、`LocalStoragePort` 和 `DiagnosticPort`。这些主体提供读取、转换和承载边界，不生成 owner truth。

### 2.4 哪些名称必须在概要设计层先点名？

必须点名的结构主语是：`ClientApplicationShell`、`RouteContextCoordinator`、`PageViewModelAssembler`、`SafeMaterialComposer`、`UserIntentCoordinator`、`CommandResultGate`、`ClientStateStore`、`ChangeReducer`、`ResumeCoordinator`、`LocalProjectionRepository`、`SdkQueryAdapter`、`SdkCommandAdapter`、`SdkChangeAdapter`、`SdkReferenceAdapter`、`PlatformCapabilityAdapter`、`AccessibilitySemanticAdapter`、`CacheEvictionCoordinator` 和 `DiagnosticHandoffAdapter`。这些名称在后续 Step 可被对象、接口、处理流和状态引用；它们是概要候选主语，不是现有代码路径。

### 2.5 哪些内容不能在本步展开？

不能写具体目录/文件路径、完整 struct/trait、依赖注入框架、HTTP path、DTO/schema、数据库表、平台插件实现或 owner service。不能把 `ConversationService`、`GovernanceService`、`ArtifactStore` 等外部 owner 名称当作 Chat 内部主体；Chat 内只出现相应 SDK adapter 和 safe material boundary。

## 3. 历史材料问题诊断

| 旧材料口径 | 风险 | 本步处置 |
|---|---|---|
| README 的 `apps/`、`packages/` 目录和固定包名 | 把目录草案当实现事实 | 只使用无路径的代码主体名称，目录留给 03/07。 |
| 旧 02 按 UI 组件树平铺 | 业务职责、实现层和组件层混淆 | 先用主要组成部分/实现分层双轴表达，Step 5 再按业务部分展开。 |
| `conversation`、`runtime`、`artifact` 服务名直接作为本仓模块 | 将 owner truth 吸收到 Chat | 只保留 `Sdk*Adapter`、safe material 和引用边界。 |
| AG-UI/SSE/WebSocket/stream renderer 作为核心层 | 固化未确认 transport | 将变化消费抽象为 `SdkChangeAdapter`/`ChangeReducer`，不写协议。 |
| 旧“store 负责业务状态” | 形成 shadow truth | `ClientStateStore` 只保存 Chat-local 状态和来源绑定的投影。 |

## 4. 设计取舍

### 4.1 业务主要组成部分与实现分层分离

主要组成部分回答“Chat 产品体验承担什么”；实现分层回答“代码主体如何安放和互相依赖”。本步不把 `Application`、`Domain`、`Ports` 当业务部分，也不把 `conversation`、`artifact` 等外部 owner 当实现层。

### 4.2 采用共享语义内核和可替换外部接缝

`ChatSemanticPolicy`、`CommandResultGate`、`VisibilityGuard`、`ChangeReducer` 和 view model 语义属于共享 core；SDK、平台、存储和诊断通过 port/adapter 注入。这样 Desktop/Web/Mobile 能共享业务语义，具体宿主能力缺失时只改变 adapter capability posture。

### 4.3 采用“同步入口 + 连续性承接 + 本地受限状态”三类运行主体

这三类主体与 `01` 的运行承载一致：入口负责当前交互，连续性承接正式 change/resume 和恢复，受限状态承载 draft/cache/recovery metadata。三者可以同一产品部署，但状态责任不合并，避免连接状态或缓存状态伪装为业务结果。

## 5. 架构模块到代码主体映射图

#### 架构模块到代码主体映射图

```text
L5-chat 客户端产品
│
├─ 1. 客户端同步入口单元
│   ├─ ClientApplicationShell
│   ├─ RouteContextCoordinator
│   ├─ PageViewModelAssembler
│   └─ NavigationSurface / Page Entry
│
├─ 2. 客户端连续性承接单元
│   ├─ SdkChangeAdapter
│   ├─ ChangeReducer
│   ├─ ResumeCoordinator
│   └─ RecoveryViewModel
│
├─ 3. 本地受限状态承载
│   ├─ ClientStateStore
│   ├─ LocalProjectionRepository
│   ├─ DraftStore
│   └─ CacheEvictionCoordinator
│
├─ 4. 共享客户端产品语义
│   ├─ ChatSemanticPolicy
│   ├─ SafeMaterialComposer
│   ├─ VisibilityGuard
│   └─ CommandResultGate
│
├─ 5. 正式 SDK 接缝
│   ├─ SdkQueryAdapter
│   ├─ SdkCommandAdapter
│   ├─ SdkReferenceAdapter
│   └─ SdkError / Provenance Mapper
│
└─ 6. 平台与低敏诊断接缝
    ├─ PlatformCapabilityAdapter
    ├─ AccessibilitySemanticAdapter
    ├─ LocalStoragePort
    └─ DiagnosticHandoffAdapter
```

关键说明：
- 图从 Chat 主要运行承载出发列出概要层代码主体，不表示已有目录、文件或实现。
- `Sdk*Adapter` 是唯一业务接缝；owner 服务、内部 bus 和数据库不作为 Chat 代码主体出现。
- `ClientStateStore`、`ChangeReducer` 和 `SafeMaterialComposer` 只处理 Chat-local 状态与 owner-safe 材料，不生成领域 truth。
- 页面/路由入口属于同步入口单元；具体页面和组件职责在 Step 5 展开，视觉实现留给后续设计。

## 6. 实现分层视图

#### 实现分层视图

```text
用户输入 / 平台生命周期 / SDK formal change / Operations trigger
                              │
                              ▼
┌──────────────────────────────────────────────────────────────┐
│ Inbound / Operations                                         │
│ ClientApplicationShell · SdkChangeAdapter · ResumeCoordinator │
│ PlatformCapabilityAdapter · CacheEvictionCoordinator          │
└──────────────────────────────┬───────────────────────────────┘
                               ▼
┌──────────────────────────────────────────────────────────────┐
│ Application Services                                          │
│ RouteContextCoordinator · SafeMaterialQueryCoordinator         │
│ UserIntentCoordinator · PreviewCoordinator · RecoveryCoordinator│
└──────────────────────────────┬───────────────────────────────┘
                               ▼
┌──────────────────────────────────────────────────────────────┐
│ Local Semantic / Domain Model                                 │
│ ChatSemanticPolicy · VisibilityGuard · CommandResultGate       │
│ ClientStateStore · ChangeReducer · Draft/Selection/Recovery    │
└──────────────────────────────┬───────────────────────────────┘
                               ▼
┌──────────────────────────────────────────────────────────────┐
│ Projection / View Model                                       │
│ SafeMaterialComposer · PageViewModelAssembler · RecoveryViewModel│
└──────────────────────────────┬───────────────────────────────┘
                               ▼
┌──────────────────────────────────────────────────────────────┐
│ Ports / Adapters / Persistence                                │
│ SdkQuery/Command/Change/ReferenceAdapter · LocalStoragePort    │
│ LocalProjectionRepository · Platform/Accessibility/Diagnostic  │
└──────────────────────────────────────────────────────────────┘
```

关键说明：
- 外部调用、正式变化和运维触发先进入 Inbound/Operations，再由 Application 编排本地语义、投影和适配器。
- 本地语义层不直接依赖 SDK、平台或存储实现；其依赖通过 port/adapter 边界进入。
- Projection/View Model 只组合安全材料和 Chat-local 状态，不能反向写 owner truth。
- 分层图不表达代码目录、框架、依赖注入、协议、部署拓扑或函数调用链。

## 7. 业务主要组成部分与实现分层关系说明

| 项 | 说明 |
|---|---|
| 业务主要组成部分 | 协作语境与导航、正式材料呈现、受控协作意图、变化与恢复连续性、本地受限展示与恢复投影、平台体验与可访问性、SDK/诊断接缝。它们描述 Chat 产品上承担的行为责任。 |
| 实现分层 | Inbound/Operations、Application Services、Local Semantic/Domain Model、Projection/View Model、Ports/Adapters/Persistence。它们描述代码主体的安放和依赖方向。 |
| 二者关系 | 一个业务部分可跨多个实现层；一个实现层也可服务多个业务部分。例如“受控协作意图”横跨 Application、CommandResultGate、SdkCommandAdapter 和 ClientStateStore。二者不能互换。 |
| 外部 owner | Conversation、Identity、Work、Governance、Artifact、Workspace、Member、Runtime、Observability 是外部 truth owner，不属于 Chat 业务部分或实现层。 |

### 7.1 关键判断

- `NavigationSurface`、`TurnRenderer`、`GateCard`、`ArtifactPanel` 等页面/组件名称只能在 Step 5 作为主要部分内的展示主体候选，不能成为 owner truth 对象。
- `ClientStateStore` 是客户端局部状态主体，不是通用 domain repository；`LocalProjectionRepository` 只保存受限安全材料和来源元数据。
- `SdkQueryAdapter`、`SdkCommandAdapter`、`SdkChangeAdapter` 和 `SdkReferenceAdapter` 是边界主体，不是 SDK 本身，也不拥有各 owner 的数据。
- `ChangeReducer` 只依据正式 SDK 输入和明确本地动作更新本地状态；它不重建事件 delivery truth 或推断 owner 生命周期。
- `PlatformCapabilityAdapter` 与 `AccessibilitySemanticAdapter` 提供宿主能力和等价表达，不改变业务状态和授权。

## 8. 反向依赖与名称审计

| 审计项 | 结论 |
|---|---|
| 是否存在页面直接调用 owner 的主体？ | 否；页面只能通过 Application/SDK adapter 边界。 |
| 是否存在 Chat 内部 bus consumer 或 broker 处理主体？ | 否；只保留 SDK formal change/resume adapter。 |
| 是否把 owner truth 当 Chat Domain Model？ | 否；Local Semantic/Domain Model 只含 Chat-local 语义。 |
| 是否把平台 shell 作为业务部分？ | 否；平台 shell 属于外部接缝/承载，业务语义由共享 core 提供。 |
| 是否出现代码目录、文件路径或完整类型定义？ | 否。 |
| 后续主语是否有承接位置？ | 是；Step 5～9 将按主要组成部分展开，Step 6/7/8/9 反查同名主体。 |

## 9. 回填草稿（正式 §4）

> 校准来源：本文件 `§5 架构模块到代码主体映射图`、`§6 实现分层视图`、`§7 业务主要组成部分与实现分层关系说明`。

#### 架构模块到代码主体映射图

```text
L5-chat 客户端产品
│
├─ 客户端同步入口：ClientApplicationShell / RouteContextCoordinator / PageViewModelAssembler
├─ 客户端连续性承接：SdkChangeAdapter / ChangeReducer / ResumeCoordinator / RecoveryViewModel
├─ 本地受限状态承载：ClientStateStore / LocalProjectionRepository / DraftStore / CacheEvictionCoordinator
├─ 共享客户端产品语义：ChatSemanticPolicy / SafeMaterialComposer / VisibilityGuard / CommandResultGate
├─ 正式 SDK 接缝：SdkQueryAdapter / SdkCommandAdapter / SdkReferenceAdapter / Error-Provenance Mapper
└─ 平台与诊断接缝：PlatformCapabilityAdapter / AccessibilitySemanticAdapter / LocalStoragePort / DiagnosticHandoffAdapter
```

#### 实现分层视图

```text
用户输入 / 平台生命周期 / SDK formal change / Operations
                              │
                              ▼
Inbound / Operations
                              │
                              ▼
Application Services
                              │
                              ▼
Local Semantic / Domain Model
                              │
                              ▼
Projection / View Model
                              │
                              ▼
Ports / Adapters / Persistence
```

业务主要组成部分负责说明 Chat “做什么”，实现分层负责说明代码“如何安放”。后续 Step 将以业务主要组成部分为小循环轴，在每个部分内反查这些代码主体、对象、接口、处理流和状态归属；具体目录、文件和实现框架不在本概要设计中锁定。

## 10. 待确认事项

| 待确认 | 影响 | 当前挂起口径 |
|---|---|---|
| shared semantic core 的最终包边界 | 共享 core 与平台 shell 的物理承载 | 只确定语义责任和依赖方向，不写目录或包名。 |
| SDK adapter 的 exact type/error/event surface | 适配器对象和接口骨架 | 先按能力类别和安全结果姿态，等待 `CHAT-UP-001`。 |
| local persistence 的最终载体 | LocalProjectionRepository、DraftStore 和清理 | 只确定 port/边界，具体存储由 03/04 决定。 |

## 11. 自检与门禁

### 11.1 Step 自检

| 检查项 | 结论 |
|---|---|
| 是否产出两张规范要求的 ASCII 图？ | 是；映射图和实现分层图均有标题、`text` 代码块和关键说明。 |
| 是否区分主要组成部分和实现分层？ | 是；使用关系表和关键判断说明。 |
| 是否写入代码目录、路径、完整 trait/struct 或协议？ | 否。 |
| 是否把外部 owner 误写成 Chat 内代码主体？ | 否；仅保留 SDK adapter 和 safe material 边界。 |
| 是否遵守 Step 3 的 SDK-only、owner truth、平台语义和配置红线？ | 是。 |
| 是否为 Step 5～9 提供可反查的主体名称？ | 是；已列出候选主体和后续展开方向。 |

### 11.2 进入下一步条件

- 两张必需图和关系说明已完成，且不表达目录、协议或部署细节。
- 架构模块已映射为可继续下沉的代码主体；业务部分和实现分层没有混用。
- 代码主体命名没有把 owner truth、SDK 实现或平台实现吸收到 Chat。
- 后续 Step 可沿主要组成部分展开 capability、对象、接口、处理流和状态。

### 11.3 门禁结论

`gate_status = pass`。Step 4 已完成，下一动作是创建并执行 `02_hld_step_05_components_boundary.md`；Step 5 起必须按主要组成部分逐一停审，并用本文件的主体名称做后续一致性反查。

## 2026-10-01 当前逐章复核

计划/输入：读取Step4 SOP、规范§4.4、当前§4与前序三步。SOP回答：入口为shell/页面；应用编排为项目、流程、关系、目录coordinator；本地语义为guard/reducer/导航；外部能力通过SDK/平台/存储port提供。

诊断/取舍：旧分层直箭头可能使core依赖persistence具体实现，补入依赖倒置说明和新页面主体；SDK包可在Desktop进程内消费，owner服务仍远端，仓库owner不等于部署位置。

结构结果：§4两图保留职责映射，新增ProjectContextCoordinator、ProcessDrilldownCoordinator、DirectoryCoordinator及ReadOnlyProcessRenderer；具体成员/接口/状态在Step5～9收稳。图后说明依赖/材料流和图不证明实现。

自检：七单元未增业务owner；无路径/完整协议/owner实体。复杂度需两图且均已复核；§4原位修复完成，Step4 done gate pass，允许Step5逐模块审查。合同blocked，不提交。
