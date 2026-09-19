## Step 5. 主要组成部分、职责与边界

### 1. Step 状态

- 状态：[x] 已确认
- 对应 SOP：`standards/document/概要设计讨论流程_SOP.md` Step 5
- 回填章节：正式 `02-概要设计.md` §5「主要组成部分、职责与边界」

#### 1.1 Step 内计划

- [x] 读取 Step 4、00 §7/§9、01 §6/§9/§10
- [x] 确认五个业务主要组成部分及其排序
- [x] 对每个部分完成 capability、代码主体、对象发现、非职责、接缝和停审
- [x] 形成对象发现维度表与交互总图
- [x] 完成跨部分重复、遗漏、越界和后续展开位置审计
- [x] 完成回填草稿与三层门禁

### 2. 本步输入

- `design-calibration/02_hld_step_04_code_subject_framework.md`
- `design-calibration/02_hld_step_03_constraints.md`
- `projects/L5-console/00-需求文档.md` §7、§9、§10、§11、§12
- `projects/L5-console/01-架构设计.md` §6、§9、§10
- 五个业务主要组成部分候选：
  1. 访问语境与导航
  2. 来源保真视图
  3. 受控意图与结果
  4. 管理主题组织
  5. 韧性与可访问交互

### 3. SOP 问题回答

1. **本仓应划分为哪些主要组成部分？**

   采用上述五部分。它们按客户端可信交互主链拆分，而不是按页面、组件、owner 仓或实现层平铺。`可信管理交互编排`是跨部分的核心应用语义，不另建一个会重复职责的第六个 UI 部分。

2. **每个部分承担什么、不承担什么？**

   访问语境与导航负责当前交互语境、入口组织与安全姿态呈现，不认证或授权；来源保真视图负责 owner-safe query 结果、来源和多轴状态，不复制业务对象；受控意图与结果负责草稿、复核、提交经历和正式结果引用，不拥有副作用或幂等；管理主题组织负责按 owner 组织八类管理入口，不形成跨域 truth；韧性与可访问交互负责局部降级、恢复和等价路径，不改变资格或业务状态。

3. **每个部分需要哪些 capability？**

   分别需要：语境锚定/转换/入口裁剪；安全读取/探索/来源解释；草稿/复核/受理/回查；主题路由/owner 适配/回链/局部门控；错误解释/失效/恢复/焦点播报/诊断裁剪。具体 capability 表见 §7.1～§7.5。

4. **每个部分包含哪些代码主体，粒度到哪里？**

   只点名 service、policy/guard、view/reference、adapter/port 和状态主体，说明其职责与后续 Step 位置；不写目录、类实现、协议、字段全集或组件树。

5. **对象发现线索属于哪些维度？**

   对每个部分分别检查 Console-owned truth/state、policy/invariant、projection/read model、reference/boundary、audit/history。owner domain aggregate、服务端 cursor/rebuild、DTO、repository 和私有事件默认不进入 Step 6，除非作为明确的边界引用对象并说明理由。

6. **哪些内容必须进入 Step 6？**

   能承接后续接口、处理流和状态机的本地交互对象、guard、状态、view/reference 和请求呈现记录必须独立正式化；只属于字段类型、API 输入输出、port、组件或外部 owner 的名称留在 Step 7/03 或排除。

7. **哪些接缝容易越界？**

   owner query/command/result/ref、visibility/qualification、reconciliation、safe-link、diagnostics 和 accessibility adapter 都是外部/横切接缝；它们不能被写成 Console truth，也不能以本地状态替代正式结果。

### 4. 当前文档问题诊断

| 材料/位置 | 当前问题 | 结构性修正 |
|---|---|---|
| 旧 02 §6 | 以 workspace entry、panel、action、dashboard、permission hint 五类页面语汇平铺，职责和实现层混合 | 改按交互主链组成部分拆分，并为每部分提供 capability 与非职责 |
| 旧 02 §7 | 把 chat/runtime/artifact/obs/archive 当作 Console 交互模块 | 改为 owner-partitioned 外部接缝，由管理主题组织消费 |
| 本仓 draft/02～03 | 已有能力链，但对象候选、状态和模块层次尚未完成停审 | 只保留候选线索，逐部分建立对象发现维度和接缝审计 |
| `L1-workspace/draft` | 细粒度的 projection/cursor/rebuild 容易被误迁移 | 明确这些属于 Workspace owner，不进入 Console 部分或对象池 |

### 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 部分主语 | 页面、面板、卡片、动作入口 | 五个业务主要组成部分 | 与 HLD 结构和能力闭环对齐 |
| 外部系统位置 | 与 Console 内部模块同级 | 作为 owner-specific query/command/result/ref 接缝 | 保持真相单一归属 |
| 对象发现 | 旧文档直接命名 `ConsoleWorkspace` 等对象 | 先按 truth/state/policy/view/reference/audit 维度建立候选池 | 防止候选升级为领域真相 |
| 边界审查 | 只写“不能替代 source truth” | 每部分逐项写不承担、接缝和停审记录 | 为 Step 6～9 提供可检查门禁 |

### 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A：按八类管理主题拆八部分 | 与用户菜单直观对应 | 导航、来源状态、草稿、恢复和 a11y 重复，owner 主题会吞掉公共语义 | 不采用 |
| 方案 B：按 Inbound/Application/Domain/Port 分四部分 | 代码层次清楚 | 丢失产品责任主线，无法说明每个交互 capability 的归属 | 不采用 |
| 方案 C：按五个交互主链部分拆分，另以实现分层安放代码主体 | 兼顾产品职责、对象来源和后续接口/流/状态 | 需要跨部分审计，避免横切重复 | 采用 |

### 7. 结构化中间产物

#### 7.0 组成部分总表与对象发现维度表

| 组成部分 | 核心职责 | 主要代码主体 | 不承担什么 |
|---|---|---|---|
| 访问语境与导航 | 正式语境引用、入口组织、显式转换和披露收紧 | `AccessContextService`、`NavigationService`、`AccessContext`、`NavigationState`、`DisclosureGuard` | 认证、credential、scope truth、本地授权、Policy/Gate 决策 |
| 来源保真视图 | owner-safe 读取、探索、来源/多轴状态与安全回链 | `OwnerViewCompositionService`、`OwnerViewSnapshot`、`OwnerViewModel`、`SourceStatusAxes`、`ReferenceSet` | owner domain、跨域 projection、数据库、统一 verdict/readiness |
| 受控意图与结果 | 草稿、复核、提交经历、正式结果引用和条件化回查 | `IntentReviewService`、`DraftIntent`、`RequestPresentation`、`ResultReference`、`CompletionGuard` | 业务副作用、owner 校验/幂等、审批、最终结果、后台 job |
| 管理主题组织 | 八类主题的 owner 分区入口、视图、动作门控和安全链接 | `TopicCompositionService`、`TopicVisibility`、`TopicViewModel`、`TopicAdapter`、`SafeLinkPort` | 主题领域 truth、跨主题原子性、固定指标/控制项和未停审私有状态 |
| 韧性与可访问交互 | 局部降级、保守恢复、焦点/播报和等价辅助技术路径 | `DegradationRecoveryService`、`AccessibilitySemanticService`、`DegradationState`、`RecoveryPlan`、`AccessibilityState` | owner retry/reconciliation、全局健康、监控/审计报告、权限放宽 |

| 组成部分 | Truth / State | Policy / Invariant | Projection / Read model | Reference / Boundary | Audit / History | Step 6 必须独立展开 |
|---|---|---|---|---|---|---|
| 访问语境与导航 | `AccessContext`、`NavigationState`、`ContextLifecycleState` | `DisclosureGuard`、`QualificationBoundary` | `NavigationViewModel` | `ActorScopeReference`、`VisibilityReference` | `ContextChangePresentation`（仅交互经历） | `AccessContext`、`NavigationState`、`DisclosureGuard`、统一安全引用组 |
| 来源保真视图 | `OwnerViewSnapshot`、`SourceStatusAxes` | `QueryNoWriteGuard`、`CoverageGuard` | `OwnerViewModel`、`TopicViewModel` | `SourceReference`、`VersionReference`、`ReferenceSet` | `QueryInteractionRecord`（非 audit） | `OwnerViewSnapshot`、`SourceStatusAxes`、`OwnerViewModel`、`ReferenceSet`、`QueryNoWriteGuard` |
| 受控意图与结果 | `DraftIntent`、`RequestPresentation` | `SubmissionEligibilityGuard`、`CompletionGuard`、`UnknownReplayGuard` | `IntentReviewView`、`ResultPresentationView` | `CommandReference`、`ReceiptReference`、`ResultReference` | `SubmissionAttemptPresentation`（非 audit） | `DraftIntent`、`RequestPresentation`、`ResultReference`、`CompletionGuard`、`UnknownReplayGuard` |
| 管理主题组织 | `TopicVisibility`、`TopicActivationState` | `TopicBoundaryGuard`、`OwnerActivationGuard` | `TopicViewModel`、`ManagementSummaryView` | `OwnerCapabilityReference`、`SafeLinkReference` | `TopicNavigationRecord`（非 audit） | `TopicVisibility`、`TopicViewModel`、`OwnerActivationGuard`、`SafeLinkReference` |
| 韧性与可访问交互 | `DegradationState`、`AccessibilityState` | `RecoverySafetyGuard`、`AccessibilityEquivalenceGuard` | `StatusPresentationView`、`RecoveryViewModel` | `RecoveryReference`、`DiagnosticReference` | `RecoveryInteractionRecord`、`AnnouncementRecord`（非 audit） | `DegradationState`、`RecoveryPlan`、`AccessibilityState`、`DiagnosticContext`、两个 guard |

#### 7.1 访问语境与导航

**本部分职责**：在正式 actor/scope/visibility/资格材料可用的上限内，维护当前客户端访问语境的安全呈现、入口组织、显式转换和直接入口收紧。

| 功能 / capability | 输入 | 输出 | 状态 / 副作用 | 后续展开 |
|---|---|---|---|---|
| 语境锚定 | 正式 actor/scope 安全引用、会话生命周期提示 | `AccessContext` 呈现、当前语境引用 | verified/restricted/unknown/expired/revoked；只改变交互呈现 | Step 6 对象、Step 7 Query seam |
| 显式语境转换 | 用户选择、正式 scope/visibility 结果 | 新语境候选和重验请求 | pending/accepted/rejected/unknown；不自行授予 scope | Step 8 处理流、Step 9 状态 |
| 导航组织 | 入口注册候选、visibility/qualification posture | `NavigationState`、入口姿态 | visible/restricted/disabled/unknown；不写 owner truth | Step 6、Step 7 Query |
| 直接入口防护 | URL/deep-link 选择、当前正式语境 | 安全裁剪或重验入口 | fail-closed/revalidate；不泄露对象存在性 | Step 8、Step 10 |

| 代码主体 / 模块 | 类型 | 作用 | 后续展开位置 |
|---|---|---|---|
| `AccessContextService` | Application Service | 组织正式语境引用和失效/转换呈现 | Step 6、Step 8 |
| `NavigationService` | Application Service | 组织入口、路由选择和可见性姿态 | Step 6、Step 7 |
| `AccessContext` | Context object | 表达客户端当前正式语境的安全引用上限 | Step 6 独立对象 |
| `NavigationState` | Interaction state | 表达当前入口和探索选择 | Step 6 独立对象 |
| `DisclosureGuard` | Policy/guard | 在披露前检查语境和最小披露上限 | Step 6 独立对象 |
| `VisibilityQualificationPort` | External port | 消费正式可见性/资格结果 | Step 7，不作为领域对象 |

| 维度 | 候选对象 | Step 6 展开要求 |
|---|---|---|
| Truth / State | `AccessContext`、`NavigationState`、`ContextLifecycleState` | 独立成节；只表达 Console 交互事实/引用生命周期 |
| Policy / Invariant | `DisclosureGuard`、`QualificationBoundary` | 独立成节；不得生成 allow/deny |
| Projection / Read model | `NavigationViewModel` | 作为可失效呈现模型候选；不作为权限 projection |
| Reference / Boundary | `ActorScopeReference`、`VisibilityReference` | 作为安全引用对象；字段精度 pending |
| Audit / History | `ContextChangePresentation` | 仅保留客户端交互经历候选；正式审计归 owner |

**本部分不承担**：认证、credential、正式 scope hierarchy、成员资格、Policy/Gate 决策、角色继承、后端 session、权限缓存或对象存在性判断。

**与其他部分的接缝**：向来源保真视图提供当前可用的语境/披露上限；向受控意图与结果提供提交前重验前置；向管理主题组织提供入口裁剪；向韧性与可访问交互提供失效、焦点和恢复提示。

**本部分停审记录**：功能可回指 C-CON-1/2 与 FR-CON-001～004；候选对象均有交互来源；`VisibilityQualificationPort` 未升级为本地权限对象；不越入身份或治理 owner；允许进入跨部分审计。

#### 7.2 来源保真视图

**本部分职责**：经 SDK/正式服务边界消费 owner-safe query 结果，保留 source、freshness、coverage、availability、consistency 和安全 ref，形成可裁剪、可失效的视图模型。

| 功能 / capability | 输入 | 输出 | 状态 / 副作用 | 后续展开 |
|---|---|---|---|---|
| owner-safe 查询编排 | 当前 `AccessContext`、主题 query 意图 | `OwnerViewSnapshot` / `OwnerViewModel` | fresh/stale/partial/unavailable/conflict/unknown；query no-write | Step 6、Step 7、Step 8 |
| 受控探索 | filter/sort/page/drilldown 意图、owner 支持边界 | 安全列表/摘要/引用呈现 | 空、missing、restricted、partial 保真；不补造数据 | Step 6、Step 8 |
| 来源解释 | source/version/time basis/coverage markers | 来源标签、下钻 ref、缺失说明 | 失效/过期时撤除或收紧；不写审计 | Step 6、Step 9 |
| 视图失效 | SDK 正式提示或显式 requery | 失效标记和重新读取入口 | invalidated/revalidating；提示不等于结果变化 | Step 8、Step 10 |

| 代码主体 / 模块 | 类型 | 作用 | 后续展开位置 |
|---|---|---|---|
| `OwnerViewCompositionService` | Application Service | 按 owner 分区编排 no-write query 与 view model | Step 6～8 |
| `OwnerQueryPort` / `SdkAccessPort` | External port | 承接正式 query/result/ref | Step 7，不作为领域对象 |
| `OwnerViewSnapshot` | Safe snapshot object | 表达某 owner 安全结果和多轴状态 | Step 6 独立对象 |
| `OwnerViewModel` | Projection/view model | 供主题/页面消费的来源保真呈现模型 | Step 6 独立对象 |
| `SourceStatusAxes` | Value/status object | 保持来源、时效、覆盖、可用性、一致性轴 | Step 6 独立对象 |
| `ReferenceSet` | Reference object | 承载获准对象/版本/结果回链 | Step 6 独立对象 |

| 维度 | 候选对象 | Step 6 展开要求 |
|---|---|---|
| Truth / State | `OwnerViewSnapshot`、`SourceStatusAxes` | 独立成节；仅为 Console 消费/呈现事实，不替代 owner truth |
| Policy / Invariant | `QueryNoWriteGuard`、`CoverageGuard` | 独立成节；保证读取不写入、不把部分当完整 |
| Projection / Read model | `OwnerViewModel`、`TopicViewModel` | 独立成节；声明可失效、按 owner 分区 |
| Reference / Boundary | `SourceReference`、`VersionReference`、`ReferenceSet` | 独立成节；不复制正文或内部规则 |
| Audit / History | `QueryInteractionRecord` | 仅记录安全交互经历候选；不成为 Observability audit |

**本部分不承担**：owner domain object、业务聚合、跨域 projection、数据库/repository、事件 cursor/replay/rebuild、统一健康/合规/readiness、固定指标/控制项。

**与其他部分的接缝**：从访问语境取披露上限；向管理主题组织提供分域 view；向受控意图与结果提供提交前显示和结果回链所需 ref；向韧性部分提供多轴状态和恢复依据。

**本部分停审记录**：功能可回指 C-CON-3/5 与 FR-CON-005/006/010～015；候选对象不拥有 owner truth；`OwnerQueryPort` 只作为 Step 7 seam；所有状态轴没有合成统一 verdict；通过本部分停审。

#### 7.3 受控意图与结果

**本部分职责**：维护未提交草稿、提交前复核、受理/处理中呈现、正式结果引用和有依据的 reconciliation 姿态。

| 功能 / capability | 输入 | 输出 | 状态 / 副作用 | 后续展开 |
|---|---|---|---|---|
| 草稿隔离 | 用户输入、页面上下文、需求级格式检查 | `DraftIntent`、validation summary | draft/edited/invalid/discarded；不写 owner | Step 6、Step 8 |
| 提交前复核 | 草稿、当前语境/资格、危险影响提示 | review presentation、显式确认 | ready-for-submit/blocked/unknown；不等于 owner accept | Step 6、Step 9 |
| 受控意图提交 | owner command seam、语境/资格、确认结果 | `RequestPresentation`、receipt/ref | submitted/accepted/pending/rejected/unknown | Step 7、Step 8、Step 9 |
| 正式结果回查 | receipt/result/reconciliation ref、显式回查 | `ResultReference` 与可判别结果 | confirmed/rejected/unknown；无依据不重放 | Step 7～10 |

| 代码主体 / 模块 | 类型 | 作用 | 后续展开位置 |
|---|---|---|---|
| `IntentReviewService` | Application Service | 组织草稿、校验摘要和提交前确认 | Step 6、Step 8 |
| `OwnerCommandPort` | External port | 通过正式边界提交受控意图 | Step 7，不作为领域对象 |
| `ResultReconciliationPort` | External port | 仅在正式能力存在时回查结果 | Step 7/8，不作为领域对象 |
| `DraftIntent` | Interaction truth object | 表达未提交用户意图 | Step 6 独立对象 |
| `RequestPresentation` | Interaction state | 表达本客户端请求经历 | Step 6 独立对象 |
| `ResultReference` | Reference object | 指向 owner 正式 receipt/result/reconciliation | Step 6 独立对象 |
| `CompletionGuard` | Policy/guard | 防止 transport/receipt/乐观状态冒充完成 | Step 6 独立对象 |

| 维度 | 候选对象 | Step 6 展开要求 |
|---|---|---|
| Truth / State | `DraftIntent`、`RequestPresentation` | 独立成节；只承载客户端经历与未提交意图 |
| Policy / Invariant | `SubmissionEligibilityGuard`、`CompletionGuard`、`UnknownReplayGuard` | 独立成节；不实现 owner policy/幂等 |
| Projection / Read model | `IntentReviewView`、`ResultPresentationView` | 独立成节；只读呈现模型 |
| Reference / Boundary | `CommandReference`、`ReceiptReference`、`ResultReference` | 独立成节；exact shape pending |
| Audit / History | `SubmissionAttemptPresentation` | 仅记录客户端尝试/回查经历；正式 audit 归 owner |

**本部分不承担**：owner command 业务校验、领域副作用、幂等记录、审批、Policy/Gate、reconciliation truth、最终结果、后台长时作业或未知请求自动重放。

**与其他部分的接缝**：读取访问语境的当前资格上限；消费来源视图和安全 ref；把结果回链交给管理主题；把 unknown、冲突和恢复动作交给韧性与可访问交互。

**本部分停审记录**：功能可回指 C-CON-4/6 与 FR-CON-007～009；草稿和请求经历不被写为 owner 对象；`ResultReconciliationPort` 未闭口时保持 unknown/blocked；无自动重放；通过本部分停审。

#### 7.4 管理主题组织

**本部分职责**：按 owner 和合同成熟度组织员工、项目/Workspace、方法、Governance/SoA/AIIA/Control/Gate、审计/指标、Capability Hub、Archive、Sandbox 的消费入口和安全回链。

| 功能 / capability | 输入 | 输出 | 状态 / 副作用 | 后续展开 |
|---|---|---|---|---|
| 主题注册/裁剪 | owner capability、visibility/qualification posture | `TopicVisibility`、入口/动作姿态 | available/read-only/partial/blocked/unavailable；不由 flag 放宽 | Step 6、Step 7 |
| 主题查询编排 | 主题选择、语境、筛选与分页 | 分域 `TopicViewModel` | 按 owner 独立 status/coverage；query no-write | Step 7/8 |
| 安全回链/下钻 | source/object/version/result ref | 正式 owner link/ref 入口 | link unavailable/blocked 时不猜目标 | Step 6、Step 8、Step 10 |
| 主题级受控入口 | owner command activation、资格、草稿/确认 | 条件化 `CommandEntry` | 未闭口保持 blocked/read-only；不推导 readiness | Step 7～9 |

| 代码主体 / 模块 | 类型 | 作用 | 后续展开位置 |
|---|---|---|---|
| `TopicCompositionService` | Application Service | 组织八类主题的入口、分域视图和接缝 | Step 6～8 |
| `TopicVisibility` | State/value object | 表达主题/动作安全上限 | Step 6 独立对象 |
| `TopicAdapter`（owner-specific seam） | External adapter | 将正式 owner surface 映射成消费能力 | Step 7，不作为领域对象 |
| `TopicViewModel` | Projection/view model | 表达主题安全视图和 source status | Step 6 独立对象 |
| `SafeLinkPort` | External port | 导航到正式 ref/链接目标 | Step 7，不作为领域对象 |

| 维度 | 候选对象 | Step 6 展开要求 |
|---|---|---|
| Truth / State | `TopicVisibility`、`TopicActivationState` | 独立成节；状态来自正式合同/客户端收紧，不是授权 truth |
| Policy / Invariant | `TopicBoundaryGuard`、`OwnerActivationGuard` | 独立成节；不把 pending 变 ready |
| Projection / Read model | `TopicViewModel`、`ManagementSummaryView` | 独立成节；保留 owner 分区和 coverage |
| Reference / Boundary | `OwnerCapabilityReference`、`SafeLinkReference` | 独立成节；不保存 owner 正文 |
| Audit / History | `TopicNavigationRecord` | 仅记录入口/回链交互，不成为 owner audit |

**本部分不承担**：八类主题的领域 truth、跨主题原子事务、综合健康/合规/审计/readiness、owner activation 决定、固定控制/指标数量、未停审 L5/L6 私有状态。

**与其他部分的接缝**：从访问语境取得入口上限，从来源保真视图消费分域结果，从受控意图与结果消费正式命令状态，从韧性部分取得局部故障/恢复姿态。

**本部分停审记录**：功能可回指 C-CON-5 与 FR-CON-010～015；八类主题均保持 owner 分区；Workspace/Method/Capability/Observability/Archive/Sandbox 未闭合项仍 pending/blocked/read-only；通过本部分停审。

#### 7.5 韧性与可访问交互

**本部分职责**：在语境失效、权限未知、部分/过期/冲突/不可用/unknown 等情况下提供局部隔离、保守恢复、焦点/播报和等价辅助技术路径。

| 功能 / capability | 输入 | 输出 | 状态 / 副作用 | 后续展开 |
|---|---|---|---|---|
| 状态解释 | owner/status/error 轴、交互阶段 | 语义文本、可感知姿态 | 不把非理想状态归一为 success/empty/ready | Step 6、Step 9、Step 10 |
| 局部降级 | owner 区域故障/过期/缺失/冲突 | topic-level fallback/遮蔽 | 只影响可证明依赖区域 | Step 6、Step 8/10 |
| 恢复编排 | retry/requery/revalidate/reconcile/exit/keep-draft 选择 | `RecoveryPlan`、恢复入口 | unknown 无正式依据不自动重放 | Step 6、Step 8/9 |
| 可访问路径 | 视觉交互语义、焦点目标、播报变化 | `AccessibilityState`、等价操作路径 | 不改变资格/结果/安全上限 | Step 6、Step 8/10 |

| 代码主体 / 模块 | 类型 | 作用 | 后续展开位置 |
|---|---|---|---|
| `DegradationRecoveryService` | Application Service | 组织局部故障姿态和安全恢复选择 | Step 6、Step 8～10 |
| `AccessibilitySemanticService` | Application Service | 组织焦点、播报、键盘和非颜色语义 | Step 6、Step 8/10 |
| `DegradationState` | State object | 表达 owner/topic/interaction 的非理想状态 | Step 6 独立对象 |
| `RecoveryPlan` | Interaction object | 表达可用恢复动作和安全上限 | Step 6 独立对象 |
| `AccessibilityState` | Interaction state | 表达焦点、播报和等价路径经历 | Step 6 独立对象 |
| `DiagnosticContext` | Safe diagnostic reference | 表达最小交互诊断上下文 | Step 6 独立对象 |

| 维度 | 候选对象 | Step 6 展开要求 |
|---|---|---|
| Truth / State | `DegradationState`、`AccessibilityState` | 独立成节；是客户端呈现/恢复事实，不是 owner 状态 |
| Policy / Invariant | `RecoverySafetyGuard`、`AccessibilityEquivalenceGuard` | 独立成节；保证恢复不放权、a11y 不改语义 |
| Projection / Read model | `StatusPresentationView`、`RecoveryViewModel` | 独立成节；由分域状态组成，不生成全局结论 |
| Reference / Boundary | `RecoveryReference`、`DiagnosticReference` | 独立成节；不携带正文/secret |
| Audit / History | `RecoveryInteractionRecord`、`AnnouncementRecord` | 仅安全交互经历候选；不替代正式审计 |

**本部分不承担**：错误码定义、owner retry/reconciliation、全局健康判定、监控/审计报告、无障碍浏览器认证、权限放宽或跨主题状态合并。

**与其他部分的接缝**：消费前四部分的状态与引用，向其提供统一的局部降级、恢复和可访问呈现；诊断只经安全 sink，失败不改变主链。

**本部分停审记录**：功能可回指 C-CON-6 与 FR-CON-016～018；恢复动作不包含无依据 unknown 重放；a11y 与视觉路径共享同一状态上限；诊断不升级为 audit/evidence；通过本部分停审。

#### 7.6 各部分交互总图

```text
┌──────────────────────────┐
│ 1 访问语境与导航          │
└────────────┬─────────────┘
             │ context / disclosure ceiling
             ▼
┌──────────────────────────┐     owner query/result/ref
│ 2 来源保真视图            │◄──────────────────────────┐
└────────────┬─────────────┘                           │
             │ safe view / source axes                  │
             ▼                                          │
┌──────────────────────────┐     topic owner seams      │
│ 4 管理主题组织            │───────────────────────────┘
└────────────┬─────────────┘
             │ view + command entry
             ▼
┌──────────────────────────┐
│ 3 受控意图与结果          │──── formal command/result/ref
└────────────┬─────────────┘
             │ status / unknown / recovery choice
             ▼
┌──────────────────────────┐
│ 5 韧性与可访问交互        │
└────────────┬─────────────┘
             │ revalidate / requery / reconcile / exit
             └───────────────► 1 / 2 / 3 / 4（局部回路）
```

关键说明：

- 图表达五个业务主要组成部分的责任流和接缝方向，不表达 HTTP、事件、组件、数据库或详细时序。
- owner query/command/result/ref 始终经过正式 SDK/服务边界；图中的回路是交互意图，不是本地自动重放。
- 韧性与 a11y 横切前四部分；局部 owner 故障不会被合成为全局状态。

#### 7.7 总体边界说明

Console 的内部部分只承载交互事实、可失效安全视图/引用和呈现恢复语义。任何名称若需要保存业务正文、owner 状态机、授权决定、幂等依据、审计/evidence/report、Workspace cursor/rebuild、Capability registry、Archive/Sandbox 执行事实，就必须移出本仓或降级为外部 reference/port。

#### 7.8 Step 6 展开门禁

| 检查项 | 结论 |
|---|---|
| 每个部分有 capability、代码主体和非职责 | 通过 |
| 每个候选对象能回指部分 capability | 通过；候选池不等于最终对象 |
| owner truth、数据库、私有 bus、服务端 projection 未混入 | 通过 |
| 接缝和 pending 上限明确 | 通过 |
| 对象字段/函数未提前展开 | 通过 |
| 后续 Step 6～9 有明确同名承接位置 | 通过 |

#### 7.9 跨组成部分闭环审计

| 审计项 | 结论 | 处理 |
|---|---|---|
| `AccessContext` 与 `OwnerViewSnapshot` 是否重复 | 不重复 | 前者是语境引用，后者是 owner-safe 消费结果 |
| `TopicViewModel` 与 `OwnerViewModel` 是否重复 | 不重复 | 前者按主题组装，后者保留 owner/source 视图语义 |
| `RequestPresentation` 与 `ResultReference` 是否重复 | 不重复 | 前者是交互阶段，后者是正式结果/回查引用 |
| `DegradationState` 是否成为统一健康结论 | 否 | 必须按 owner/topic/阶段局部归属 |
| `NavigationState` 是否授权 | 否 | 仅入口/选择状态，授权来自正式边界 |
| Workspace projection/cursor/rebuild 是否误入 | 否 | 明确排除，作为外部条件化来源 |
| 五部分是否覆盖 C-CON-1～6 | 是 | C1/2→P1，C3→P2，C4→P3，C5→P4，C6→P5；横切接缝交叉覆盖 |

### 8. 回填草稿

正式 §5 回填本文件的组成部分总表、对象发现维度表、交互总图、五个部分的职责/代码主体/非职责/接缝摘要和总体边界说明。逐部分停审记录、候选池诊断和跨部分审计留在 calibration；正式文档只承载收口结论。

### 9. 待确认事项

- owner-specific adapter 数量、命名和 exact surface 仍待 Step 7/owner 合同；本步只固定“按 owner 独立门控”。
- `ReferenceSet`、`DiagnosticContext` 等安全引用是否需要更细分类别留给 Step 6；不得因此引入正文。
- 管理主题的具体路由/页面树和未停审 L5/L6 链接仍 pending；不改变五部分边界。

### 10. 进入下一步条件

- 五个主要组成部分均已完成 capability、代码主体、对象发现线索、非职责、接缝和停审。
- 交互总图、对象发现维度表和跨部分闭环审计无 unresolved 冲突。
- Step 6 对象候选池已明确且没有字段/函数越层。
- 三层门禁通过后，进入 Step 6 关键对象轮廓。
