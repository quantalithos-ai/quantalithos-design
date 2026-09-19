# Step 5. 定义模块实现契约主轴

### 1. Step 状态

- 状态：`[x] 已完成（step_stop_review）`
- 对应 SOP：`standards/document/详细设计讨论流程_SOP.md` Step 5
- 回填章节：未来正式 `03-详细设计.md` §5「模块实现契约」
- 当前模块：`module-contracts-axis`
- 正式回填：未执行；正式 `03-详细设计.md` 仍为 `historical_material`，本 Step 不修改。
- 实现仓：`/home/aris/Projects/quantalithos-console` 仍为 `planned / not_created`。

#### 1.1 Step 内计划

- [x] 读取 Step 4 的 planned 文件布局、`02` §4/§5/§12 和详细设计 Step 5 SOP。
- [x] 读取 `projects/L1-governance` 的 Step 5 模块主轴、职责、依赖、对象归属和测试切口表达。
- [x] 将 L1-governance 的粒度方法迁移为 TypeScript 浏览器客户端的模块契约轴。
- [x] 明确模块对外暴露、允许/禁止依赖和业务组成部分映射。
- [x] 明确对象、port、adapter、entry、repository/handler/job 的归属边界；不生成 owner truth。
- [x] 完成模块内停审、跨模块依赖审计、污染审计、回填草稿、待确认事项和进入下一步条件。
- [x] 按当前授权在 Step 5 后停止；不创建 Step 6～10 中间产物。

### 2. 本步输入

| 输入 | 已确认内容 | 本步用途 |
|---|---|---|
| `design-calibration/03_ddd_step_04_units_file_layout.md` | planned TypeScript/ESM browser package、`src/entry`、`access`、`navigation`、`views`、`intent`、`features`、`recovery`、`adapters`、`state`、`diagnostics` 及 planned tests | 固定模块候选和文件边界；不把 planned 文件当作已存在实现。 |
| `projects/L5-console/02-概要设计.md` §4/§5/§12 | 五个主要组成部分、代码主体、对象白名单、Step 7/8/9 接缝和回退规则 | 作为模块职责与主语白名单；不重新定义概要架构。 |
| `03_ddd_step_03_coding_runtime_constraints.md` | TypeScript/ESM 方向、SDK-only、无 DB/BFF/worker/private bus、framework pending | 约束依赖方向、语言适配和禁止模块。 |
| `standards/document/详细设计讨论流程_SOP.md` Step 5 | 模块总览、职责表、依赖图、对象归属五问 | 规定本 Step 输出结构和停审门禁。 |
| `standards/document/详细设计书写规范.md` §5.5 | 模块实现契约、对象归属和后续承接摘要要求 | 形成未来正式 §5 的回填草稿。 |
| `projects/L1-governance/design-calibration/03_ddd_step_05_module_contracts.md` | 模块总览→依赖图→职责表→文件映射→对象归属→业务映射→测试切口的粒度 | 只借鉴组织方法和审计粒度，不继承 Governance truth、Rust/Cargo 或服务端语义。 |
| `projects/L1-governance/design-calibration/03_ddd_calibration_flow.md` | L1-governance Step 5 的逐模块停审和跨模块闭环习惯 | 作为审阅框架参考，不作为 Console 的真相源。 |
| `projects/L1-governance/01-架构设计.md`、`02-概要设计.md` | 治理域自身的模块/对象/协议边界 | 仅用于理解参考粒度；治理域 Gate/Decision/Policy/Audit 等不迁入本仓。 |
| `@quantalithos/sdk` TypeScript package 事实 | 官方 ESM SDK package 存在；owner exact surface 仍 pending | 将 SDK boundary 放在 adapter 模块，避免源码穿透。 |

前序依赖：Step 1～4 已通过。当前只定义模块契约主轴，不定义 Step 6 的字段/函数/状态细节、Step 7 的完整 port 签名、Step 8 的协议 schema、Step 9 的函数流或 Step 10 的转换矩阵。

#### 2.1 L1-governance 粒度迁移规则

| 参考维度 | 在 L1-governance 中的表达 | 在 L5-console 中的适配 | 明确不迁移 |
|---|---|---|---|
| 模块主轴 | `contracts/domain/application/infra/api/worker/jobs` | 以浏览器客户端职责和 Step 4 planned 目录为主轴：`entry/access/navigation/views/intent/features/recovery/adapters/state/diagnostics` | Rust crate、服务端层、后台 worker/job、repository/projection |
| 对外暴露 | DTO、domain object、service、handler、runner | safe view/ref、interaction state、guard、adapter port、browser composition seam | owner aggregate、Policy/Gate 决策、审计/evidence/report |
| 依赖图 | 单向 crate 依赖及 port 实现 | 单向 TypeScript module import 方向；SDK 是外部 boundary，owner 仅 runtime formal surface | 直连 DB/private bus、复制服务端规则 |
| 对象归属预告 | `contracts/domain/application/infra` 对象分类 | `views/intent/access/recovery` 的客户端对象；`adapters` 的 port/adapter；无 repository | 把 owner truth 或 server DTO 变成本地 domain |
| 业务组成部分映射 | 业务部分跨多个 crate | 五个 Console 组成部分跨多个客户端模块 | 将八个 owner 主题拆成本地 domain 或独立真相 |
| 测试切口预告 | crate 级单元/协议/worker/job | planned 的 module/contract/flow/accessibility 切口 | 声称测试已创建、运行或通过 |

### 3. SOP 问题回答

#### 3.1 本仓详细设计应该拆成哪些实现模块？

本仓采用十个职责模块作为详细设计主轴，名称与 Step 4 planned 目录一致。`access` 与 `navigation` 分开，以便分别承接语境/披露与入口/选择；`recovery` 与 `diagnostics` 分开，以便恢复语义不依赖诊断 sink；`state` 是有界载体，不是业务 domain。

| 模块 | planned 路径 | 模块性质 | 当前状态 |
|---|---|---|---|
| `entry` | `src/entry` | 浏览器组合根和宿主入口 | planned |
| `access` | `src/access` | 语境引用与披露收紧 | planned |
| `navigation` | `src/navigation` | 入口、选择和主题可见性呈现 | planned |
| `views` | `src/views` | owner-safe snapshot/view/ref 组合 | planned |
| `intent` | `src/intent` | 草稿、请求经历和正式结果引用 | planned |
| `features` | `src/features` | 按 owner 分区的主题组合 seam | planned |
| `recovery` | `src/recovery` | 局部降级、恢复选择和 a11y 语义状态 | planned |
| `adapters` | `src/adapters` | SDK/formal-boundary port 与 adapter | planned |
| `state` | `src/state` | bounded client state carrier 与失效接口 | planned |
| `diagnostics` | `src/diagnostics` | body-free 客户端诊断上下文与 sink seam | planned |

这十个模块是实现职责边界，不是十个服务、十个 package 或十个 owner。八类管理主题仍由 `features` 按 owner 条件化组织，不能升级为本地 truth 模块。

#### 3.2 每个模块对应概要设计中的哪个主要组成部分或代码主体？

| 模块 | 对应 `02` 代码主体/组成部分 | 承接范围 | 不改变的上游判断 |
|---|---|---|---|
| `entry` | Inbound / Operations 的 browser entry、`ConsoleEntry`、`QueryEntry`、`SubmitEntry`、`RecoveryActionEntry` | 宿主注入、组合根、显式用户意图入口 | 不认证、不授权、不直接访问 owner |
| `access` | `AccessContextService`、`AccessContext`、`DisclosureGuard` | formal context ref、lifecycle presentation、disclosure ceiling | 不生成 credential、scope hierarchy 或 allow/deny |
| `navigation` | `NavigationService`、`NavigationState`、`TopicVisibility` | route/deep-link 选择、返回/清理、入口姿态 | route/menu/history 不是权限 |
| `views` | `OwnerViewCompositionService`、`OwnerViewSnapshot`、`SourceStatusAxes`、`OwnerViewModel`、`ReferenceSet` | no-write 查询结果映射、来源多轴和 safe ref | 不建 owner projection/current truth |
| `intent` | `IntentReviewService`、`DraftIntent`、`RequestPresentation`、`ResultReference`、completion/unknown guard | 本地草稿和正式 result/ref 分层 | 不执行 owner command 规则、幂等或副作用 |
| `features` | `TopicCompositionService`、`TopicViewModel`、`TopicActivationState`、owner-specific seam | 八类主题的条件化入口、视图、safe link | 不综合 readiness/health/合规 |
| `recovery` | `DegradationRecoveryService`、`AccessibilitySemanticService`、`DegradationState`、`RecoveryPlan`、`AccessibilityState` | 局部故障、显式 requery/revalidate/reconcile/exit、a11y | 不自动 replay、不放宽资格 |
| `adapters` | `SdkAccessPort`、`OwnerQueryPort`、`OwnerCommandPort`、`ResultReconciliationPort`、optional invalidation seam | SDK/formal service boundary、safe mapping 和错误接缝 | 不直连 DB/bus/owner source |
| `state` | bounded state carrier | interaction truth、safe shadow、scope binding、清理/失效 | 不存 credential、forbidden body 或 owner result truth |
| `diagnostics` | `DiagnosticContext`、safe diagnostic sink seam | 最小、去正文诊断上下文 | 不产出 audit/evidence/report/verdict |

#### 3.3 每个模块对外暴露什么？

“对外”在本 Step 指模块间可消费的 typed seam，不等同于最终 npm public API；具体导出符号和 schema 留给 Step 6～8。

| 模块 | 计划暴露 | 消费者 | 暴露限制 |
|---|---|---|---|
| `entry` | `bootstrapConsole`、宿主依赖注入/启动 seam（名称暂定） | 宿主页面/测试 harness | 不暴露 owner client、credential 或内部状态存储 |
| `access` | `AccessContext`、`ContextLifecycleState`、`DisclosureGuard`、安全语境 ref 类型 | `navigation`、`views`、`intent`、`entry`、`adapters` 输入映射 | 只能表达引用/上限；不得输出授权结论 |
| `navigation` | `NavigationState`、`TopicVisibility`、选择/清理函数 | `entry`、`features`、`recovery`、可访问呈现 | route selection 不得被当作 allow |
| `views` | `OwnerViewSnapshot`、`SourceStatusAxes`、`OwnerViewModel`、`ReferenceSet`、read-only guards | `features`、`recovery`、页面呈现 seam | 只接受 safe result；不暴露 raw/hidden body |
| `intent` | `DraftIntent`、`RequestPresentation`、`ResultReference`、提交/完成 guards | `features`、`recovery`、`entry` | receipt/transport success 不可直接成为 terminal result |
| `features` | `TopicViewModel`、topic composition/activation seam、safe-link intent | `entry`、页面宿主、测试 harness | 不暴露 owner domain 或跨主题聚合 |
| `recovery` | `DegradationState`、`RecoveryPlan`、`AccessibilityState`、recovery safety seam | `entry`、各页面/主题、测试 harness | 只能改变本地呈现和显式恢复动作 |
| `adapters` | `SdkAccessPort`、owner query/command/reconciliation/invalidation port、safe adapter result seam | `entry` 组合根、`views`、`intent`、`features`、`access` | exact method/schema pending；禁止私有 transport 泄漏 |
| `state` | `ClientStateCarrier`、scope-bound cleanup/invalidation seam、载体错误边界 | `entry` 注入及各模块组合 | 不定义业务对象、TTL 或持久化产品 |
| `diagnostics` | `DiagnosticContext`、`DiagnosticSinkPort`（名称暂定） | `entry`/`recovery` 注入 | body-free、失败隔离，不阻断主线 |

#### 3.4 每个模块允许依赖哪些模块，禁止依赖哪些模块？

允许依赖只表示 planned import 方向；SDK 和正式 owner 是模块外部 boundary，不代表源码依赖。

| 模块 | 允许依赖 | 禁止依赖 | 约束说明 |
|---|---|---|---|
| `entry` | 所有内部模块的公开 seam、浏览器宿主类型 | SDK transport internals、owner repo、DB、private bus | 仅作 composition root；不在入口写业务规则 |
| `access` | 本模块类型、正式语境安全引用输入 | `features`、`views` 的业务模型、DB、Policy/Gate 实现 | 只能传递/收紧语境 |
| `navigation` | `access` 的 context/disclosure seam、本模块类型 | `adapters` 的 transport、owner domain、权限服务 | 选择与授权严格分离 |
| `views` | `access`、`adapters` safe result seam、本模块类型 | `intent` 写入口、DB、owner projection、统一 health service | Query no-write、来源多轴保真 |
| `intent` | `access`、`adapters` command/result seam、`state` carrier、本模块类型 | `features` 反向依赖、owner command 实现、幂等存储 | 只表达本地意图/请求经历 |
| `features` | `access`、`navigation`、`views`、`intent`、`adapters` 的 topic seam | owner domain、跨主题事务、`state` 私有持久化实现、DB | 主题按 owner 独立激活 |
| `recovery` | `access`、`views`、`intent`、`navigation`、`state`、`diagnostics` 的注入 seam | `adapters` transport internals、自动重放器、全局 health | 恢复动作必须显式且有安全上限 |
| `adapters` | 官方 `@quantalithos/sdk` public package、`access` 安全输入类型、本模块映射类型 | `features`、`views`、`intent` 的 UI 实现、数据库、服务源码 | adapter 不得成为第二业务层 |
| `state` | 浏览器/宿主存储抽象（若未来获 authority）、本模块通用 carrier 类型 | 所有 owner domain、`adapters` 私有 response、secret | 载体介质/TTL/缓存策略 pending |
| `diagnostics` | 本模块安全 marker/接口、宿主 sink 抽象（若获 authority） | owner正文、audit/evidence/report、业务模块规则 | sink failure 与业务主线隔离 |

禁止形成的方向：`access/navigation/views/intent/features/recovery` 不能反向 import `entry`；任何业务模块不能 import owner repo 或 DB；`state`/`diagnostics` 不能成为新的“common”业务桶；不存在 `api -> repository`、`worker -> store`、`job -> owner` 等服务端方向。

#### 3.5 哪些对象、trait、handler、repository 应归属于哪个模块？

本仓使用 TypeScript `type`/`interface`/`class`/具名函数；“trait”仅以 port interface 的概念对应，不创建 Rust trait。`handler` 仅指浏览器入口函数，不指 HTTP handler；`repository` 在 Console 中明确为 `N/A`。

| 主体类别 | 模块归属 | 当前代表 | 本 Step 的边界 |
|---|---|---|---|
| 语境/导航交互对象 | `access` / `navigation` | `AccessContext`、`ContextLifecycleState`、`NavigationState`、`TopicVisibility` | Step 6 再闭字段和转换；不拥有授权 |
| 视图/来源对象 | `views` | `OwnerViewSnapshot`、`SourceStatusAxes`、`OwnerViewModel`、`ReferenceSet` | safe-field 与状态轴来源仍 pending |
| 草稿/请求/结果对象 | `intent` | `DraftIntent`、`RequestPresentation`、`ResultReference` | 不拥有 owner result/幂等 |
| 主题呈现对象 | `features` | `TopicViewModel`、`TopicActivationState`、topic composition seam | 不拥有八个 owner 的 domain object |
| 恢复/a11y/诊断对象 | `recovery` / `diagnostics` | `DegradationState`、`RecoveryPlan`、`AccessibilityState`、`DiagnosticContext` | 不拥有全局健康或正式审计 |
| Guard / local invariant | 对应业务模块 | `DisclosureGuard`、`QueryNoWriteGuard`、`CompletionGuard`、`RecoverySafetyGuard` | 只保护客户端不变量；不生成 owner decision |
| SDK/formal boundary port | `adapters` | `SdkAccessPort`、`OwnerQueryPort`、`OwnerCommandPort`、`ResultReconciliationPort` | exact methods/schema 留 Step 7/8 |
| state carrier port | `state` | `ClientStateCarrier`、invalidation/cleanup seam | 介质、TTL、持久策略留 Step 11/14/04 |
| browser entry/handler | `entry` | bootstrap、query/submit/recovery action entry | 不直接实现 query/command 规则 |
| repository / projection / worker / job | 不归属 Console | `N/A (non-server client)` | 不得以别名迁入 `features` 或 `adapters` |

### 4. 当前文档问题诊断

| 材料/位置 | 发现的问题 | Step 5 修正 |
|---|---|---|
| 旧正式 `03-详细设计.md` 的 `api/application/domain/infra/projection` 目录 | 把浏览器产品写成 Rust/服务端实现，并暗含 DB、repository、worker | 以 Step 4 planned TypeScript 模块为主轴，明确 server-only 模块不适用 |
| 旧 README / 本仓 draft | 以 React/Vue/router/store/provider contract 或固定主题服务名作为模块边界 | framework、router、store 和 provider contract 保持 pending；只保留职责级 seam |
| `02` 五个主要组成部分 | 若直接当 package，会导致每个 owner/主题复制 truth | 明确五部分跨十个职责模块实现，主题只在 `features` 组成 |
| SDK 当前 skeleton | `ServiceClient`/`EventClient` 参数仍有 `unknown`，不能证明 exact contract | `adapters` 只暴露 boundary placeholder；schema、错误、activation 留后续 Step |
| L1-governance Step 5 模板 | Rust `contracts/domain/application/...` 结构含治理域语义 | 迁移其审计粒度，不迁移 Gate/Decision/Policy/Audit/Outbox/Projection/Job |

### 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 模块主轴 | Step 4 只有 planned 目录和文件职责 | 十个职责模块及其 public seam、依赖方向和禁止依赖 | 让 Step 6～10 有稳定归属入口 |
| 业务部分关系 | 可能被理解为主题 package 或 owner domain | 五个主要组成部分跨模块实现，八个主题留在 `features` 条件化 | 防止第二真相 |
| 外部边界 | 旧文可能把 SDK/owner 当源码依赖 | `adapters` 作为唯一 formal boundary，SDK public package 是外部依赖 | 遵守 SDK-only |
| 状态载体 | 可能混入 store/cache truth | `state` 只承载 interaction truth/safe shadow/失效 seam | 不发明缓存产品、TTL 或 owner 状态 |
| 诊断 | 可能被写成 audit/report | `diagnostics` 仅 body-free client context/sink | 保持正式审计归 owner |
| 服务端主体 | `repository/projection/worker/job` 可能出现在目录 | 明确 `N/A (non-server client)`，不建立替代名 | 与浏览器产品边界一致 |
| L1-governance 参考 | 可能机械复制 Rust 模块和治理对象 | 只复制“逐模块停审+跨模块审计”方法 | 满足用户粒度要求且防止语义污染 |

### 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| A：按五个主要组成部分各建一个模块 | 业务阅读直观 | 每部分会同时承载 entry、view、adapter、state，容易循环和职责过大 | 不采用 |
| B：按八个 owner/主题各建本地 domain 模块 | 主题入口容易定位 | 复制成员、治理、能力、归档、sandbox 等 owner truth，形成第二真相 | 不采用 |
| C：复制 L1-governance 的 `contracts/domain/application/infra/api/worker/jobs` | 可直接套用参考文档排版 | 不匹配浏览器 TS 客户端，引入 repository、projection、worker、job 事实 | 不采用 |
| D：按 Step 4 planned 目录建立职责模块，并以 adapter/state/diagnostic 作为边界 seam | 依赖方向清晰、可落码、保持 framework-neutral，能承接 L1-governance 粒度 | 模块数较多，部分 exact 类型仍需后续 Step 收口 | 采用 |
| E：建立 `common`/`shared` 大桶供所有模块复用 | 初期导入方便 | 无边界公共桶会隐藏依赖和 truth 归属 | 不采用；共享类型必须回到明确 owner 模块或正式 SDK |

### 7. 结构化中间产物

#### 7.1 模块总览表

| 模块 | 所属 planned 实现单元 | 主要职责 | 对外暴露 | 允许依赖 |
|---|---|---|---|---|
| `entry` | `src/entry` | 浏览器 bootstrap、依赖注入和宿主 session shell 启动 | entry/composition seam | 所有内部公开模块 |
| `access` | `src/access` | formal context presentation、生命周期姿态、披露收紧 | context/ref/guard | 本模块及安全输入类型 |
| `navigation` | `src/navigation` | 入口选择、返回/清理、topic visibility presentation | navigation state/selection | `access` |
| `views` | `src/views` | safe snapshot、来源多轴、owner-partitioned view/ref | view model/ref/guards | `access`、`adapters` |
| `intent` | `src/intent` | draft、request presentation、result ref、完成/unknown guard | intent/result seam | `access`、`adapters`、`state` |
| `features` | `src/features` | 八类主题的 owner 分区、视图和条件化动作入口 | topic composition/view/activation seam | `access`、`navigation`、`views`、`intent`、`adapters` |
| `recovery` | `src/recovery` | 局部 degradation、显式恢复、a11y 语义 | recovery/a11y state/guard | `access`、`navigation`、`views`、`intent`、`state`、`diagnostics` |
| `adapters` | `src/adapters` | SDK/formal service boundary、safe mapping、reconciliation/invalidation seam | port/adapter interface | `@quantalithos/sdk`、安全输入类型 |
| `state` | `src/state` | bounded carrier、scope binding、cleanup/invalidation | carrier/invalidation interface | carrier abstraction（pending） |
| `diagnostics` | `src/diagnostics` | body-free diagnostic context、sink isolation | diagnostic context/sink interface | host sink abstraction（pending） |

#### 7.2 模块依赖图：L5-console planned module axis

```text
                         external formal boundary
                    @quantalithos/sdk (public package)
                                  │
                                  ▼
                         +-------------------+
                         |     adapters      |
                         +----+----+----+-----+
                              │    │    │
             safe context/ref │    │    │ safe query/command/result seams
                              │    │    └───────────────┐
                              ▼    ▼                    ▼
                       +---------+  +---------+   +-----------+
                       | access  |  | views   |   |  intent   |
                       +----+----+  +----+----+   +-----+-----+
                            │            │               │
                            ▼            │               ▼
                       +---------+      │         +-----------+
                       |navigation|─────┘         | features  |
                       +----+----+                +-----+-----+
                            │                           │
                            └──────────────┬────────────┘
                                           ▼
                                    +--------------+
                                    |   recovery   |
                                    +------+-------+
                                           │
                         +-----------------+-----------------+
                         │                                   │
                         ▼                                   ▼
                  +-------------+                     +-------------+
                  |    state    |                     | diagnostics |
                  +-------------+                     +-------------+

                entry/composition root imports public seams above
                (graph shows module dependency direction, not call timing)
```

图的约束说明：

- `entry` 是组合根，只向下装配，不被业务模块反向依赖。
- `adapters` 是唯一 SDK/formal-boundary 适配面；`views`、`intent`、`features` 不穿透 SDK transport internals。
- `access` 不依赖 `views`/`features`；`navigation` 只消费 access 的披露上限。
- `state` 与 `diagnostics` 不拥有业务主语；它们通过注入接口被使用，不能反向形成公共 truth。
- 图不表达 HTTP、event topic、数据库、owner projection、cursor/replay、后台 worker 或 operations job。

#### 7.3 模块职责表

##### `entry` 模块

| 项 | 内容 |
|---|---|
| 组成部分映射 | 横跨五个主要组成部分的浏览器入口/组合根 |
| 主要责任 | 接收宿主依赖、建立模块组合、启动 session shell、转发显式 query/command/recovery intent |
| 对外暴露 | planned `bootstrapConsole` 与宿主注入 seam |
| 允许依赖 | 所有内部模块的公开 seam、浏览器平台入口类型 |
| 禁止事项 | 不签发 credential、不判定资格、不直连 SDK transport/DB、不保存 owner 正文 |
| Step 6/7 承接 | 入口对象和 composition carrier；完整注入签名留 Step 6/7 |

##### `access` 模块

| 项 | 内容 |
|---|---|
| 组成部分映射 | 访问语境与导航 |
| 主要责任 | 保存 formal actor/scope/visibility 的安全引用和 lifecycle presentation，执行披露收紧 |
| 对外暴露 | `AccessContext`、`ContextLifecycleState`、`DisclosureGuard`、安全 ref seam |
| 允许依赖 | 本模块类型、正式边界输入类型 |
| 禁止事项 | 不认证、不生成 allow/deny、不计算 scope hierarchy、不缓存授权证明 |
| Step 6/7 承接 | 字段来源、生命周期转换、context adapter 输入/输出 |

##### `navigation` 模块

| 项 | 内容 |
|---|---|
| 组成部分映射 | 访问语境与导航、管理主题入口 |
| 主要责任 | 入口选择、deep-link 姿态、历史 marker、敏感选择清理和 topic visibility presentation |
| 对外暴露 | `NavigationState`、`TopicVisibility`、selection/cleanup seam |
| 允许依赖 | `access` 的 context/disclosure seam |
| 禁止事项 | 不将 URL/menu/local role/flag 当授权，不决定 owner existence |
| Step 6/7 承接 | route selection 类型、visibility mapper、navigation port seam |

##### `views` 模块

| 项 | 内容 |
|---|---|
| 组成部分映射 | 来源保真视图、管理主题视图 |
| 主要责任 | 组合 owner-safe snapshot、来源/时效/覆盖/可用性/一致性轴、safe ref 和 no-write view |
| 对外暴露 | `OwnerViewSnapshot`、`SourceStatusAxes`、`OwnerViewModel`、`ReferenceSet`、read-only guards |
| 允许依赖 | `access`、`adapters` 的 safe result seam |
| 禁止事项 | 不复制 owner aggregate/projection，不合成跨 owner readiness/health，不用缺失补全正文 |
| Step 6/7 承接 | safe-field mapper、view builder、query port 输入/返回映射 |

##### `intent` 模块

| 项 | 内容 |
|---|---|
| 组成部分映射 | 受控意图与结果 |
| 主要责任 | 保存本地草稿、提交前 review、request phase、formal result/ref 和 unknown 姿态 |
| 对外暴露 | `DraftIntent`、`RequestPresentation`、`ResultReference`、completion/unknown guards |
| 允许依赖 | `access`、`adapters`、`state` |
| 禁止事项 | 不执行 owner validation/Policy/Gate/幂等，不把 receipt/transport success 当完成，不自动 replay unknown |
| Step 6/7 承接 | draft 字段、command adapter、reconciliation port 和错误映射 |

##### `features` 模块

| 项 | 内容 |
|---|---|
| 组成部分映射 | 管理主题组织：member、project/work/process/workspace、method、governance/artifact、observability、capability、archive、sandbox |
| 主要责任 | 按 owner 分域组合 view、activation、safe link 和条件化 action entry |
| 对外暴露 | `TopicViewModel`、topic registry/composition seam、`TopicActivationState`、safe-link intent |
| 允许依赖 | `access`、`navigation`、`views`、`intent`、`adapters` 的 topic seam |
| 禁止事项 | 不创建 owner domain、跨主题原子事务、统一 readiness、固定控制项/指标数量或未审产品私有状态 |
| Step 6/7 承接 | topic object、adapter registry、activation guard、safe-link port |

##### `recovery` 模块

| 项 | 内容 |
|---|---|
| 组成部分映射 | 韧性与可访问交互，横切前四部分 |
| 主要责任 | 将 source/error/interaction 阶段映射为局部 degradation、显式恢复选择和等价 a11y 语义 |
| 对外暴露 | `DegradationState`、`RecoveryPlan`、`AccessibilityState`、recovery/a11y guards |
| 允许依赖 | `access`、`navigation`、`views`、`intent`、`state`、`diagnostics` 接口 |
| 禁止事项 | 不自动 retry/replay，不改变资格/结果，不生成全局 health/audit/readiness |
| Step 6/7 承接 | error/recovery mapping、focus/announcement adapter、诊断 sink 注入 |

##### `adapters` 模块

| 项 | 内容 |
|---|---|
| 组成部分映射 | 所有五部分的 SDK/formal boundary |
| 主要责任 | 统一 SDK client access、owner-safe query/command、formal reconciliation 和可选 invalidation hint |
| 对外暴露 | `SdkAccessPort`、`OwnerQueryPort`、`OwnerCommandPort`、`ResultReconciliationPort`、invalidation seam |
| 允许依赖 | 官方 `@quantalithos/sdk` public package、明确安全输入类型 |
| 禁止事项 | 不依赖 owner repo/DB/private bus，不复制服务端规则，不把 `unknown` 当 exact schema |
| Step 6/7/8 承接 | port/adapter interface、DTO mapping、错误/取消/版本兼容边界 |

##### `state` 模块

| 项 | 内容 |
|---|---|
| 组成部分映射 | 横切客户端交互 truth |
| 主要责任 | 提供有界 state carrier、scope binding、cleanup、stale/invalidation 标记和载体错误隔离 |
| 对外暴露 | `ClientStateCarrier`、cleanup/invalidation interface |
| 允许依赖 | 未来获 authority 的 carrier abstraction；当前不锁介质 |
| 禁止事项 | 不保存 credential/secret、forbidden body、owner aggregate、正式授权/结果证明 |
| Step 6/11/14 承接 | state object 字段、生命周期、持久/会话边界、配置绑定 |

##### `diagnostics` 模块

| 项 | 内容 |
|---|---|
| 组成部分映射 | 横切诊断与可访问反馈支持 |
| 主要责任 | 提供最小 body-free diagnostic context、safe marker 和 sink failure isolation |
| 对外暴露 | `DiagnosticContext`、`DiagnosticSinkPort`（名称暂定） |
| 允许依赖 | 宿主 sink abstraction（若获 authority） |
| 禁止事项 | 不生成正式 audit/evidence/report/verdict，不接受 owner 正文或 secret |
| Step 6/15 承接 | envelope 字段、redaction、sink contract、测试 evidence boundary |

#### 7.4 文件与代码主体映射表（planned）

| 文件路径 | 模块 | 计划主体 | 类型/职责 | 明确不定义 |
|---|---|---|---|---|
| `src/entry/browser_entry.ts` | `entry` | `bootstrapConsole`、composition root | 浏览器 bootstrap/宿主注入 | auth、owner query、路由真相 |
| `src/access/access_context.ts` | `access` | `AccessContext`、lifecycle mapper | formal context safe presentation | credential、scope hierarchy |
| `src/access/disclosure_guard.ts` | `access` | `DisclosureGuard`、tightening function | 最小披露 guard | Policy/Gate decision |
| `src/navigation/navigation_state.ts` | `navigation` | `NavigationState`、selection/cleanup | 入口与返回交互状态 | permission decision |
| `src/navigation/topic_visibility.ts` | `navigation` | `TopicVisibility` | topic visibility presentation | owner qualification rule |
| `src/views/owner_view_model.ts` | `views` | `OwnerViewModel`、snapshot composer | safe owner-partitioned view | projection/current truth |
| `src/views/source_status_axes.ts` | `views` | `SourceStatusAxes` | source/freshness/coverage/availability/consistency | unified readiness |
| `src/views/safe_reference_set.ts` | `views` | `ReferenceSet`、safe ref collection | body-free refs | raw/hidden payload |
| `src/intent/draft_intent.ts` | `intent` | `DraftIntent` | local draft carrier | owner entity |
| `src/intent/request_presentation.ts` | `intent` | `RequestPresentation` | request phase presentation | committed result |
| `src/intent/result_reference.ts` | `intent` | `ResultReference`、completion/unknown guard seam | formal result/ref | local terminal inference |
| `src/features/member_management.ts` | `features` | member topic composition seam | identity/member safe view/link | member truth/role policy |
| `src/features/project_workspace.ts` | `features` | work/process/workspace topic seam | owner-partitioned view | progress/workspace cursor truth |
| `src/features/method_assets.ts` | `features` | method topic seam | method safe view/draft/link | method registry truth |
| `src/features/governance_controls.ts` | `features` | governance/artifact topic seam | decision/evidence safe refs | verdict/control truth |
| `src/features/observability.ts` | `features` | observability topic seam | audit/metric safe result/ref | audit/report truth |
| `src/features/capability_hub.ts` | `features` | capability topic seam | registration/access-review safe posture | readiness/registration truth |
| `src/features/archive.ts` | `features` | archive topic seam | archive request/material safe posture | archive execution/recovery truth |
| `src/features/sandbox.ts` | `features` | sandbox topic seam | isolated run/cleanup safe posture | sandbox enforcement/readiness |
| `src/recovery/degradation_state.ts` | `recovery` | `DegradationState` | local non-ideal posture | global health |
| `src/recovery/recovery_plan.ts` | `recovery` | `RecoveryPlan`、safety guard | explicit safe actions | automatic replay/compensation |
| `src/recovery/accessibility_state.ts` | `recovery` | `AccessibilityState` | focus/announcement/keyboard semantics | semantic result changes |
| `src/adapters/sdk_access_adapter.ts` | `adapters` | SDK access adapter | public SDK boundary | private transport |
| `src/adapters/owner_query_adapter.ts` | `adapters` | owner query adapter | no-write safe query mapping | DB/repository |
| `src/adapters/owner_command_adapter.ts` | `adapters` | owner command adapter | controlled delegation | local business command |
| `src/adapters/reconciliation_adapter.ts` | `adapters` | reconciliation adapter seam | formal result requery | local idempotency authority |
| `src/adapters/invalidation_adapter.ts` | `adapters` | optional invalidation hint seam | stale/revalidate trigger | direct bus/cursor/replay |
| `src/state/client_state_carrier.ts` | `state` | `ClientStateCarrier` | bounded state and cleanup | storage product/TTL decision |
| `src/diagnostics/diagnostic_context.ts` | `diagnostics` | `DiagnosticContext`/sink seam | body-free diagnostics | audit/evidence/report |

> 上表是 planned 文件职责映射，不表示目标实现仓、文件或导出已经创建。具体类型字段、函数签名、协议 DTO 和状态 enum 依次由 Step 6～10 关闭。

#### 7.5 对象/port/entry 归属预告

| 归属组 | 模块 | 代表主体 | Step 6～8 的闭口要求 |
|---|---|---|---|
| context/state | `access`、`navigation` | `AccessContext`、`NavigationState`、`ContextLifecycleState` | 字段来源、失效清理和状态转换；不可升级为 auth/permission truth |
| view/reference | `views` | `OwnerViewSnapshot`、`SourceStatusAxes`、`OwnerViewModel`、`ReferenceSet` | safe-field、source axes、redaction、view construction |
| intent/result | `intent` | `DraftIntent`、`RequestPresentation`、`ResultReference` | draft/request/result 分层、unknown/reconciliation 边界 |
| topic composition | `features` | `TopicViewModel`、`TopicActivationState`、safe link | 八类主题各自 activation/visibility；不复制 owner 对象 |
| resilience/a11y | `recovery` | `DegradationState`、`RecoveryPlan`、`AccessibilityState` | 错误映射、显式动作、焦点/播报语义等价 |
| boundary port | `adapters` | SDK/query/command/reconciliation/invalidation ports | 完整接口、输入/输出/error/cancel/schema 由 Step 7/8 承接 |
| bounded carrier | `state` | `ClientStateCarrier` | scope、cleanup、invalidation、介质/TTL 由 Step 11/14/04 承接 |
| diagnostic boundary | `diagnostics` | `DiagnosticContext`、sink port | envelope/redaction/sink failure 由 Step 12/15 承接 |
| browser entry | `entry` | bootstrap/composition functions | 依赖注入、宿主 lifecycle、启动/退出 seam 由 Step 6/9 承接 |
| repository/domain/worker/job | 无 | `N/A` | 不得通过改名迁入任何模块 |

#### 7.6 五个主要组成部分到模块映射表

| 主要组成部分 | 主模块 | 协作模块 | 对外消费 | 不得越过的边界 |
|---|---|---|---|---|
| 访问语境与导航 | `access`、`navigation` | `adapters`、`entry`、`recovery` | context/ref、visibility、navigation posture | 不认证、不授权、不决定 owner existence |
| 来源保真视图 | `views` | `access`、`adapters`、`features`、`recovery` | owner-safe view/ref、来源多轴 | 不复制 domain/projection，不合成 readiness |
| 受控意图与结果 | `intent` | `access`、`adapters`、`state`、`features`、`recovery` | draft/request/result presentation | 不拥有 owner command、幂等、终态 |
| 管理主题组织 | `features` | `navigation`、`views`、`intent`、`adapters` | owner-partitioned topic view/activation/link | 不创建八个 owner domain，不跨主题原子化 |
| 韧性与可访问交互 | `recovery` | `access`、`navigation`、`views`、`intent`、`state`、`diagnostics` | local degradation/recovery/a11y posture | 不改资格/结果，不生成 audit/readiness |

关键交互闭环：

```text
access/context
      │ disclosure ceiling
      ▼
navigation ───────► views ───────► features
      │                │              │
      │                │ safe refs    │ explicit action intent
      └──────────────► intent ◄────────┘
                           │ formal result / unknown
                           ▼
                        recovery
                  requery / revalidate / reconcile / exit
```

`adapters`、`state`、`diagnostics` 是横切边界，不形成新的业务组成部分；任何跨 owner 结论必须回到正式 owner，不在这张图内合成。

#### 7.7 模块级测试切口预告（不表示已执行）

| 模块 | planned 测试切口 | 证据边界 |
|---|---|---|
| `entry` | composition wiring、宿主 lifecycle、启动/退出安全 | 只能记录 planned fixture/结果，不伪造运行记录 |
| `access` | context lifecycle、disclosure tightening、unknown/revoked/expired fail-closed | 不测试或声称 owner auth 正确性 |
| `navigation` | direct entry、selection cleanup、visibility posture、非存在性泄露 | 不把 route test 当 permission proof |
| `views` | source axes 保真、query no-write、partial/conflict/stale 显示、safe-field redaction | 不生成 owner projection/evidence |
| `intent` | draft isolation、request phase、receipt/result 分层、unknown 不 replay | 不声称 owner command/幂等已验证 |
| `features` | topic partition、activation gating、safe link、局部故障隔离 | 每个主题 exact contract 未闭口前仅 contract/fake seam |
| `recovery` | recovery action safety、局部 degradation、a11y semantic equivalence | 不以视觉快照替代语义和资格测试 |
| `adapters` | SDK boundary mapping、错误/版本/取消 seam、formal result reconciliation placeholder | exact schema pending，不运行私有 transport |
| `state` | scope binding、cleanup、invalidation、forbidden-body rejection | 介质/TTL 未定，不声明持久化性能 |
| `diagnostics` | redaction、sink failure isolation、body-free envelope | 不产生 audit/report/evidence |

测试目录仍仅为 Step 4 planned `tests/unit`、`tests/contract`、`tests/flow`、`tests/accessibility`；本 Step 未创建或运行任何测试。

#### 7.8 模块内停审记录

| 模块 | 审查项 | 结论 | 缺口/后续承接 |
|---|---|---|---|
| `entry` | 是否只做组合和宿主入口 | 通过 | Step 6/9 闭 lifecycle 与注入签名 |
| `access` | 是否只表达 context/ref/disclosure | 通过 | exact scope/visibility/safe-field pending；Step 6/7 |
| `navigation` | 是否把选择与授权分离 | 通过 | route/visibility schema pending；Step 6/7 |
| `views` | 是否保持 owner 分区和 no-write | 通过 | safe-field/source axes/reconciliation pending；Step 6～9 |
| `intent` | 是否分离 draft/request/formal result | 通过 | command/result schema、幂等 authority pending；Step 6～9/13 |
| `features` | 是否按主题条件化而不复制 owner truth | 通过 | 八类 activation/safe-link pending；Step 6～8 |
| `recovery` | 是否只做局部姿态和显式恢复 | 通过 | error/recovery/a11y envelope pending；Step 9/12/15 |
| `adapters` | 是否唯一 SDK/formal boundary | 通过 | exact ports/schema/error/cancel pending；Step 7/8/12/14 |
| `state` | 是否 bounded、无 forbidden body | 通过 | carrier/TTL/invalidation pending；Step 11/14/04 |
| `diagnostics` | 是否与 audit/evidence 分离 | 通过 | diagnostic envelope/sink pending；Step 12/15 |

#### 7.9 跨模块闭环审计

| 审计项 | 结果 | 依据/限制 |
|---|---|---|
| 每个五部分是否有明确主模块 | 通过 | §7.6；没有新增第六业务部分 |
| 每个 planned 文件是否有唯一职责归属 | 通过（planned） | §7.4；跨模块文件仅作为组合/边界 seam |
| 是否存在循环依赖 | 当前计划无循环 | `entry` 为组合根；`state`/`diagnostics` 不反向依赖业务模块 |
| SDK/owner 是否只有 formal boundary | 通过 | `adapters` 唯一 boundary；不引用 owner 源码 |
| 是否引入第二 truth | 通过 | no DB/repository/projection/worker/job；owner result 只保留 safe ref/view |
| Query/Command/Event/Job 分类是否被改变 | 通过 | Step 7 分类保持；本 Step 未新增 Event/Job 实现 |
| forbidden body/credential 是否有进入路径 | 通过（禁止） | access/state/views/diagnostics 均明列禁止事项 |
| L1-governance 语义污染 | 通过 | 仅借鉴粒度；Gate/Decision/Policy/Audit/Outbox 未进入模块主轴 |
| 未停审 L5/L6 是否泄漏私有状态 | 通过 | 仅 future link/ref，未列模块依赖 |
| 测试/证据是否伪造 | 通过 | 全部 `planned`，无 run/baseline/report/readiness |

#### 7.10 依赖/污染否决检查

- [x] 未创建 `domain`、`repository`、`projection`、`worker`、`jobs`、`api` 等服务端替代目录。
- [x] 未把 `Gate`、`Decision`、`Policy`、`Audit`、`Outbox`、`Evidence`、`Readiness` 作为 Console-owned 模块或对象。
- [x] 未将 L1-governance 的 Rust struct、Cargo package、crate 或 handler 复制为 TypeScript 契约。
- [x] 未把 `@quantalithos/sdk` 的 `unknown` 参数扩写成 owner schema。
- [x] 未把 UI route、菜单、feature flag、cache hit 或 transport success 解释为权限/完成/ready。
- [x] 未把 L1-workspace projection/cursor/rebuild、L4 archive/sandbox execution 或 capability registration 搬入 `features`。
- [x] 未创建目标实现仓、源码、package、测试或构建产物。

### 8. 复杂度判断与是否需要拆分

本 Step 的模块主轴可以在一个校准产物内闭合，不再拆出附录：

1. 十个模块与 Step 4 planned 目录一一对应，拆分更多会提前锁定 framework 或 owner-specific 文件。
2. 业务主要组成部分到模块的映射和依赖图已经足以支撑 Step 6 的逐模块对象小循环。
3. 字段、函数、状态、port 方法和协议 schema 尚未稳定，继续在本 Step 扩写会越界到 Step 6～8。
4. 八类主题保持在一个 `features` 模块族中，后续只有在 exact owner contract/activation 成立后才允许进一步拆文件。

复杂度结论：`pass`；Step 6 应建立自己的批次骨架，按模块逐个展开，不把本 Step 的总表当成对象契约替代品。

### 9. 回填草稿

以下文字是未来正式 `03-详细设计.md` §5 的回填草稿，本轮不写入正式正文：

> Console 的详细设计按浏览器客户端职责拆分为 `entry`、`access`、`navigation`、`views`、`intent`、`features`、`recovery`、`adapters`、`state`、`diagnostics` 十个模块。五个主要组成部分跨这些模块实现；八类管理主题仅在 `features` 中按 owner 条件化组合，不形成新的 owner truth。`adapters` 是唯一 SDK/formal service boundary，`state` 只承载有界交互事实与失效标记，`diagnostics` 只承载去正文客户端诊断上下文。
>
> 模块依赖方向由 `entry` 组合根向内部公开 seam 单向流动；`access`/`navigation` 负责 context、披露与入口选择，`views` 负责 owner-safe snapshot/view/ref，`intent` 负责草稿/请求经历/正式结果引用，`features` 负责主题视图与 activation，`recovery` 负责局部降级、显式恢复和 a11y 语义。不得引入数据库、repository、projection、BFF、后台 worker、operations job、私有 bus 或 owner domain。完整对象字段、port 方法、协议 schema、函数流和状态矩阵分别由 Step 6～10 继续闭合。

### 10. 待确认事项与阻塞传递

| 待确认项 | 当前状态 | 影响模块 | 后续承接/阻塞 |
|---|---|---|---|
| owner Query/Command/Result/Ref exact contract | `open/pending` | `adapters`、`views`、`intent`、`features` | 阻塞 Step 7/8 的精确签名和正向 activation |
| scope/visibility/qualification/safe-field | `open/pending` | `access`、`navigation`、`views`、`features` | 阻塞字段来源和 disclosure/activation 精确化 |
| reconciliation/幂等 authority | `open/pending` | `intent`、`adapters`、`recovery` | 阻塞 unknown 回查和提交结果闭合 |
| state carrier 介质、cache/TTL/invalidation | `open/pending` | `state`、`views`、`recovery` | 阻塞 Step 11/14 与 04 配置填写 |
| diagnostic envelope、browser/a11y support matrix | `open/pending` | `diagnostics`、`recovery` | 阻塞 Step 12/15/05/06 精确证据口径 |
| framework/bundler/package manager | `open/pending` | `entry`、全部构建边界 | 不得由本 Step 或实施者自行锁定 |
| 未停审 L5/L6 link/ref | `pending` | `features`、`navigation` | 只允许 future link/ref，不阻塞安全骨架 |

以上事项不阻塞 Step 5 的职责级模块主轴，但按表中范围阻塞后续精确契约；不得在后续 Step 中被写成已激活或已验证事实。

### 11. 进入下一步条件与三层门禁

#### Step / 模块级

- [x] 十个 planned 模块均有职责、对外暴露、允许/禁止依赖和后续承接点。
- [x] 五个主要组成部分均能找到主模块和协作模块；没有无人承接或越界模块。
- [x] 文件/主体映射、对象归属预告和模块级测试切口已完成。
- [x] L1-governance 仅作为粒度参考；治理域 truth、Rust/Cargo、服务端 worker/job 未迁入。

#### 文档级

- [x] 输出可回填的 §5 模块总览、依赖图和职责表，但未修改正式 `03-详细设计.md`。
- [x] 未新增或改写 `02` 的五个组成部分、接口类别、状态主语或配置红线。
- [x] 所有 exact contract、safe-field、activation、量化和诊断事项保持 pending。

#### 项目级

- [x] 只创建本 Step calibration 文件；未创建 Step 6～10 文件。
- [x] 未创建实现仓、源码、package、测试、baseline、run、artifact、report、evidence、verdict、signoff 或 readiness。
- [x] 未运行测试、未提交 commit。
- [x] Step 5 通过并停在 `step_stop_review`；进入 Step 6 前需有新的明确授权。

#### 当前批次结论

`Step 5 = pass / step_stop_review`。模块实现契约主轴已经稳定，可以在后续授权后进入 Step 6；Step 6 必须先建立批次状态表和模块执行顺序表，再逐模块闭合对象字段、函数、状态和不变量。当前不进入 Step 6～10，也不装配正式 `03-详细设计.md`。
