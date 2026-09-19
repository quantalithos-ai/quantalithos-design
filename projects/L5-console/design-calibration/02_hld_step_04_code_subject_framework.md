## Step 4. 代码主体框架映射

### 1. Step 状态

- 状态：[x] 已确认
- 对应 SOP：`standards/document/概要设计讨论流程_SOP.md` Step 4
- 回填章节：正式 `02-概要设计.md` §4「代码主体框架总览」

#### 1.1 Step 内计划

- [x] 读取 Step 2/3、正式 01 §6～§11 和可落码性边界
- [x] 识别业务主要组成部分与实现分层的不同组织轴
- [x] 逐项回答代码主体映射问题
- [x] 诊断旧 02 把页面/组件/外部系统当主体的问题
- [x] 形成架构模块到代码主体映射图
- [x] 形成实现分层视图及关系说明
- [x] 完成回填草稿和三层门禁

### 2. 本步输入

- `design-calibration/02_hld_step_02_scope.md`
- `design-calibration/02_hld_step_03_constraints.md`
- `projects/L5-console/01-架构设计.md` §6～§11
- `projects/L5-console/00-需求文档.md` §7、§9～§12
- 约束：不写目录/文件/框架/完整 trait 或 schema；不把 owner 服务、浏览器或组件库列为 Console 内部代码主体。

### 3. SOP 问题回答

1. **架构层模块应落到哪些代码主体？**

   `可信管理交互编排`落到应用编排主体；`访问语境与导航`落到访问上下文与入口编排；`来源保真视图`落到 owner-safe query adapter、view assembler 和状态标记；`受控意图与结果`落到 draft/intent/receipt-result adapter 与 reconciliation gate；`管理主题组织`落到 owner-partitioned topic adapter、route/visibility seam 和 view composition；`韧性与可访问交互`落到 degradation/recovery、focus/announcement 和 semantic presentation 主体。三类本地安全影子/引用分别由 context reference、owner-safe view reference、request/result reference 主体承载。

2. **哪些主体属于 Inbound / Operations，哪些属于 Application Services？**

   Inbound/Operations 只表示客户端入口和显式维护/重验触发：`ConsoleEntry`、`NavigationEntry`、`ViewQueryEntry`、`IntentSubmitEntry`、`ResultReconcileEntry`、`RevalidateTrigger`、`RecoveryActionEntry`。Application Services 编排 `AccessContextService`、`NavigationService`、`OwnerViewCompositionService`、`IntentReviewService`、`ResultPresentationService`、`TopicCompositionService`、`DegradationRecoveryService`、`AccessibilitySemanticService`。这些是概要层主语，不是已存在代码或 API。

3. **哪些主体属于 Domain Model，哪些属于 Ports / Persistence / Projection / Outbox？**

   Domain Model/Policy 包括 `AccessContext`、`NavigationState`、`OwnerViewSnapshot`、`DraftIntent`、`RequestPresentation`、`TopicVisibility`、`DegradationState`、`AccessibilityState` 及 `DisclosureGuard`、`CompletionGuard`、`ForbiddenBodyGuard`。Ports/Adapters 包括 `SdkAccessPort`、`OwnerQueryPort`、`OwnerCommandPort`、`ResultReconciliationPort`、`DiagnosticSinkPort`、`SafeLinkPort`、`FocusAnnouncementPort`。Projection/View 只表示可失效 `ViewModel`、`ReferenceSet` 和受控请求索引，不表示 owner projection 或本地业务数据库；不设 Console outbox 或内部 event consumer。

4. **哪些名称必须在概要层点名？**

   必须点名：`AccessContext`、`NavigationState`、`OwnerViewSnapshot`、`OwnerViewModel`、`DraftIntent`、`RequestPresentation`、`ResultReference`、`TopicVisibility`、`DegradationState`、`AccessibilityState`、`DisclosureGuard`、`CompletionGuard`、`SdkAccessPort`、`OwnerQueryPort`、`OwnerCommandPort`、`ResultReconciliationPort`。这些主语连接后续对象、接口、流程和状态；owner domain object、数据库表、私有事件和 UI 组件不进入主体清单。

5. **哪些内容不应在本步展开？**

   不展开目录、文件路径、组件树、浏览器存储产品、具体框架、完整 trait/struct、HTTP/RPC path、DTO schema、数据库表、topic、函数实现、部署进程、测试 runner 或量化参数。`L0-sdk` 和 owner 服务只作为外部正式访问边界。

### 4. 当前文档问题诊断

| 位置 | 当前问题 | 对主体映射的影响 |
|---|---|---|
| 旧 02 §6 | 用工作台入口、面板、quick action、dashboard、permission hint 平铺，混合业务部分、UI 组件和外部产品 | 无法形成可承接对象/接口/流程的业务轴 |
| 旧 02 §7 | 直接用 chat/runtime/artifact/obs/archive 作为交互模块 | 将外部 owner 误写为 Console 内部代码主体 |
| 本仓 draft/03 | 提供了“模块×分层”粒度，但有把 source summary、Workspace 和 action 作为本地服务的风险 | 只能借鉴表达层次，重新以交互 truth 和正式 port 收口 |
| 正式 01 §7 | 已明确只有同步交互客户端和有界状态承载，没有 BFF/worker/projection | Step 4 不得新增服务端容器或后台主体 |

### 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 业务轴 | 页面、panel、card、dashboard | 访问语境与导航、来源保真视图、受控意图与结果、管理主题组织、韧性与可访问交互 | 对齐架构子域及需求 C1～C6 |
| 实现轴 | 未区分，组件名与外部系统同级 | Inbound/Operations→Application→Domain/Policy→Ports/Adapters→View/State carrier | 为 03 留下可落码安放位置 |
| 外部边界 | chat/runtime 等被写为模块 | L0-sdk/正式 owner 只作为 `SdkAccessPort`/query/command/result seam | 保护 owner truth 和依赖倒置 |
| 状态承载 | `ConsoleWorkspace` 可能像业务聚合 | 只保留可失效 interaction state/reference/view model | 防止本地投影或缓存升级为真相 |

### 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A：按页面/组件建代码主体 | UI 对应直观 | 组件会吸收业务边界，无法表达跨页不变量 | 不采用 |
| 方案 B：按 owner 服务复制主体 | 能覆盖主题和接口 | 形成领域对象/规则复制，依赖方向反转 | 不采用 |
| 方案 C：业务主要组成部分 + 实现分层双轴映射 | 既表达产品职责又给出落码骨架 | 需要维护两套名称并明确不混用 | 采用 |

### 7. 结构化中间产物

#### 7.1 架构模块到代码主体映射图

```text
L5-console
│
├─ 1. 访问语境与导航
│   ├─ AccessContextService / AccessContext
│   ├─ NavigationService / NavigationState
│   └─ DisclosureGuard / VisibilityQualificationPort
│
├─ 2. 来源保真视图
│   ├─ OwnerViewCompositionService
│   ├─ OwnerQueryPort / SdkAccessPort
│   └─ OwnerViewSnapshot / OwnerViewModel / ReferenceSet
│
├─ 3. 受控意图与结果
│   ├─ IntentReviewService / DraftIntent
│   ├─ OwnerCommandPort / ResultReconciliationPort
│   └─ RequestPresentation / ResultReference / CompletionGuard
│
├─ 4. 管理主题组织
│   ├─ TopicCompositionService / TopicVisibility
│   ├─ TopicAdapter seam（按 owner 独立门控）
│   └─ SafeLinkPort / TopicViewModel
│
└─ 5. 韧性与可访问交互
    ├─ DegradationRecoveryService / DegradationState
    ├─ AccessibilitySemanticService / AccessibilityState
    └─ DiagnosticSinkPort / FocusAnnouncementPort
```

关键说明：

- 图中的五项是业务主要组成部分；服务、对象、guard、port 是后续可落码主体骨架。
- `L0-sdk`、各 owner 和浏览器/辅助技术是外部边界，不是 Console 内部主体。
- 图不表达目录、文件、协议 path、完整字段、数据库、事件 topic 或实现调用链。

#### 7.2 实现分层视图

```text
用户输入 / 直接入口 / SDK 正式提示 / 显式重验
                         │
                         ▼
┌────────────────────────────────────────────┐
│ Inbound / Operations                        │
│ ConsoleEntry · QueryEntry · SubmitEntry     │
│ ReconcileTrigger · RecoveryActionEntry      │
└──────────────────────┬─────────────────────┘
                       ▼
┌────────────────────────────────────────────┐
│ Application Services                        │
│ Access · Navigation · View · Intent · Topic │
│ Result · Degradation · Accessibility        │
└──────────────────────┬─────────────────────┘
                       ▼
┌────────────────────────────────────────────┐
│ Domain / Policy                             │
│ Interaction states · guards · source-status  │
│ draft/result separation · disclosure rules  │
└──────────────────────┬─────────────────────┘
                       ▼
┌────────────────────────────────────────────┐
│ Ports / Adapters / State carrier            │
│ SDK/owner query+command · reconciliation    │
│ safe-link · diagnostics · a11y · local state│
└────────────────────────────────────────────┘
```

关键说明：

- Inbound/Operations 只接收用户或正式提示/重验意图；它不直接读 owner 内部存储。
- Application Services 负责编排；Domain/Policy 保护客户端交互不变量；Ports/Adapters 承接正式 SDK/服务边界和有界状态。
- 图不表示已确定的框架、目录、进程、数据库、缓存或部署结构。

#### 7.3 业务主要组成部分与实现分层关系说明

| 项 | 说明 |
|---|---|
| 业务主要组成部分 | 说明 Console 产品上“做什么”：访问语境、来源保真、受控意图、主题组织、韧性与 a11y。 |
| 实现分层 | 说明代码如何安放这些主体：入口/维护、应用编排、交互不变量/guard、正式 ports/adapters 与状态承载。 |
| 关系 | 每个业务部分跨越多个实现层；实现层不是额外业务部分，也不拥有 owner truth。 |

#### 7.4 关键判断

- `AccessContext` 是客户端对正式语境的安全引用/呈现对象，不是 actor、credential 或 scope owner。
- `OwnerViewSnapshot`/`OwnerViewModel` 是带来源和多轴状态的可失效消费结果，不是业务 projection。
- `DraftIntent`/`RequestPresentation`/`ResultReference` 连接交互经历和正式结果引用，不拥有副作用、幂等或 owner result。
- `TopicAdapter` 仅是按 owner 合同门控的访问接缝；Topic 不能成为跨域聚合服务。
- `DegradationState`/`AccessibilityState` 表达本地呈现与恢复，不改变资格、业务状态或审计结论。

### 8. 回填草稿

正式 §4 直接回填本文件 §7 的两张图、关系说明表和关键判断；图后保留关键说明。正式章节不加入目录、框架、协议或部署细节。

### 9. 待确认事项

- `OwnerQueryPort`、`OwnerCommandPort`、`ResultReconciliationPort` 的 exact surface、错误映射和 activation 仍待 Step 7/专项 owner 合同确认。
- 状态承载介质、视图快照生命周期和诊断 sink 仍待 Step 11/03/04；当前仅保留逻辑层。
- “TopicAdapter”是否由一个通用 seam 或多个 owner-specific adapter 实现留给详细设计，不改变业务主要组成部分。

### 10. 进入下一步条件

- 已产出规范要求的架构模块映射图和实现分层视图，且每张图有 2～5 条关键说明。
- 业务主要组成部分与实现分层已明确区分；没有外部 owner、数据库、组件或目录混入业务主体。
- 关键代码主体能回指正式 00/01 和 Step 3 约束，足以进入 Step 5 主要组成部分小循环。
