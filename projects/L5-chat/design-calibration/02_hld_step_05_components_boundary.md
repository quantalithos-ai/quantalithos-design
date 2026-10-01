# L5-chat 02 · Step 5 主要组成部分、职责与边界

> Step 状态：`done`
> gate_status：`pass`
> 本步主题：按主要组成部分逐一收稳 Chat 的 capability、代码主体、对象发现线索、关键接缝与非职责，并完成跨部分闭环审计。
> 生成依据：`standards/document/概要设计讨论流程_SOP.md` §5 Step 5；`standards/document/概要设计书写规范.md` §4.5。
> 上游输入：Step 1～4 中间产物、`projects/L5-chat/01-架构设计.md` §6～§10、`draft/02_功能推演.md`、`draft/03_模块划分与分层.md`。

## 1. Step 内计划

| 子阶段 | 产物 | 状态 | 门禁 |
|---|---|---|---|
| 读取输入 | Step 1～4、架构上下文、候选功能/分层 | `done` | 输入已通过前序门禁 |
| 全局问题回答 | 主要组成部分数量、组织轴、职责粒度 | `done` | 与 01 的 7 个客户端上下文结构一致 |
| 逐部分小循环 | 每部分 capability、代码主体、对象线索、接缝和停审 | `done` | 7 个部分均停审 |
| 历史材料诊断 | 组件树平铺、owner service 吞并、对象组压缩 | `done` | 已改为业务部分主轴 |
| 设计取舍 | 7 个主要组成部分；SDK/平台/诊断作为边界接缝而非 owner truth | `done` | 不扩大 Chat 领域边界 |
| 结构化产物 | 总表、对象发现维度表、交互图、7 个部分小节、闭环审计 | `done` | 满足 §4.5 必需输出 |
| 复杂度判断 | 必须画各部分交互总图；不补局部图 | `done` | 总图足以表达大体流向 |
| 回填草稿 | §5 回填草稿 | `done` | 对象字段/函数留给 Step 6 |
| 自检与门禁 | 逐部分停审、跨部分一致性、后续展开反查 | `done` | `pass`，允许创建 Step 6 |

## 2. SOP 问题回答与总体取舍

### 2.1 主要组成部分如何划分？

本概要设计采用 7 个业务结构主语，继承架构线已停审的核心、支撑和本地影子结构：

1. `协作体验语境`：把 group/channel/dm/thread、Turn、线程和跨域协作入口组织成可理解页面。
2. `受控协作意图`：承接 draft、选择、发送/重试和 Gate/Decision 受控动作的 local intent 与结果反馈。
3. `安全语境与导航`：承接 actor/scope/visibility 语境、route guard、深链/返回/撤销和清理入口。
4. `变化与恢复连续性`：承接 SDK formal change/resume、重复/乱序/gap、requery、重连、unknown 和恢复提示。
5. `平台体验与可访问性`：承接 Desktop-first shell、Web/Mobile 候选 shell、窗口/通知/输入/存储/深链/AT 和等价路径。
6. `owner-safe 材料镜像`：承接 owner safe view/ref/summary/preview/result/change 的来源、visibility、版本/新鲜度和可组合展示材料。
7. `本地展示与恢复投影`：承接受限缓存、草稿/选择/恢复上下文、清理/失效和重启后的最小展示。

这些部分是业务/产品结构主语，不是代码目录或外部 owner。`L0-sdk`、各 owner、平台宿主和 Observability 是外部接缝；`Application Services`、`Projection`、`Ports` 是实现分层，不能替代上述组织轴。

### 2.2 每个部分需要完成什么 capability？

总体 capability 闭环为：

```text
安全语境与导航
        │ 可见、可进入、可返回
        ▼
协作体验语境 ────────► owner-safe 材料镜像
        │                         │ 来源/新鲜度/预览
        ▼                         ▼
受控协作意图        变化与恢复连续性
        │                         │ formal change/resume
        └──────────► 本地展示与恢复投影
                           │
                           ▼
                 平台体验与可访问性
```

图只表达业务部分之间的大体交接，不表示 API、函数调用、协议字段、事件拓扑或详细时序。

## 3. 组成部分总表

| 组成部分 | 核心职责 | 主要代码主体 | 不承担什么 |
|---|---|---|---|
| 协作体验语境 | 把安全可见的协作内容组织为 group/channel/dm/thread、Turn、线程和跨域入口 | `CollaborationSurfaceCoordinator`、`ConversationPageViewModel`、`TurnPresentationModel`、`ContextSelectionCoordinator` | 不拥有 Conversation/Turn/Participant truth、正文生命周期或授权。 |
| 受控协作意图 | 管理 draft/selection、发送/重试/GateCard action 的 local intent、attempt 和结果反馈 | `UserIntentCoordinator`、`DraftCoordinator`、`CommandResultGate`、`RetryDecisionCoordinator` | 不执行 owner command、不生成 Turn/Decision、不把 ACK 当业务成功。 |
| 安全语境与导航 | 建立 actor/scope/visibility 语境，保护 route/deep-link/返回/撤销清理 | `RouteContextCoordinator`、`VisibilityGuard`、`ScopeEntryGuard`、`RevocationCleanupCoordinator` | 不认证、不授予权限、不解释身份生命周期或 owner scope truth。 |
| 变化与恢复连续性 | 消费 formal change/resume，处理 duplicate/order/gap/expired/revoked/reconnect/unknown | `SdkChangeAdapter`、`ChangeReducer`、`ResumeCoordinator`、`RecoveryCoordinator` | 不直订 bus、不拥有 delivery cursor、不修复 owner truth、不盲重放副作用。 |
| 平台体验与可访问性 | 提供 Desktop-first shell、宿主能力、等价键盘/AT 语义和能力缺失姿态 | `PlatformCapabilityAdapter`、`AccessibilitySemanticAdapter`、`ShellLifecycleCoordinator` | 不改变业务状态、权限、结果或恢复上限；不决定框架/平台实现细节。 |
| owner-safe 材料镜像 | 保存/组合来源受控的 safe view/ref/summary/preview/result/change material | `SafeMaterialComposer`、`ProvenanceMapper`、`FreshnessInterpreter`、`PreviewBoundary` | 不复制 owner schema、正文、权限、版本链或跨域 truth。 |
| 本地展示与恢复投影 | 承载最小安全缓存、draft/selection/recovery context、失效/清理和重启恢复 | `ClientStateStore`、`LocalProjectionRepository`、`DraftStore`、`CacheEvictionCoordinator` | 不保存 credential/raw body，不延长授权，不把本地写入当 owner 成功。 |

## 4. 对象发现维度表

| 组成部分 | Truth / State | Policy / Invariant | Projection / Read model | Reference / Boundary | Audit / History | Step 6 必须独立展开 |
|---|---|---|---|---|---|---|
| 协作体验语境 | `SelectionState`、`TurnPresentationState`（Chat-local） | `PresentationEligibilityPolicy`（只解释已给出的 visibility/freshness） | `ConversationSurfaceViewModel`、`TurnViewModel` | `ConversationRef`、`TurnRef`（外部安全引用） | 本地阅读/展开位置仅作 Chat-local history hint | `SelectionState`、`ConversationSurfaceViewModel`、`TurnPresentationModel`；owner refs 作为字段类型/边界引用，不复制。 |
| 受控协作意图 | `DraftState`、`CommandAttemptState` | `CommandResultGate`、`RetryDecisionPolicy`、`UnknownEffectGuard` | `IntentFeedbackViewModel` | `IntentRef`、`ReceiptRef`、`IdempotencyAssociation`（待 SDK 合同） | `IntentAttemptHistory`（本地最小关联） | `DraftState`、`CommandAttemptState`、`CommandResultGate`、`RetryDecision`。 |
| 安全语境与导航 | `RouteContext`、`AccessPosture` | `VisibilityGuard`、`ScopeEntryGuard`、`RevocationCleanupPolicy` | `EntryViewModel`、`NavigationViewModel` | `ActorRef`、`ScopeRef`、`DeepLinkRef` | `NavigationRecoveryHint`（本地） | `RouteContext`、`AccessPosture`、`VisibilityGuard`、`ScopeEntryRef`。 |
| 变化与恢复连续性 | `ContinuityState`、`ResumeState` | `ChangeReductionPolicy`、`UnknownProbePolicy` | `RecoveryViewModel`、`ChangeStatusView` | `ChangeCursorRef`、`ResumeContextRef`、`GapRef` | `ChangeAcceptanceRecord`（本地去重/水位材料） | `ContinuityState`、`ResumeContext`、`ChangeAcceptanceRecord`、`RecoveryContext`。 |
| 平台体验与可访问性 | `PlatformCapabilityState`、`AccessibilityState` | `PlatformSemanticInvariant`、`FocusOrderPolicy` | `ShellViewModel`、`StatusAnnouncement` | `PlatformCapabilityRef` | 本地清理/宿主生命周期记录不作业务 history | `PlatformCapabilityState`、`AccessibilityState`、`StatusAnnouncement`。 |
| owner-safe 材料镜像 | 仅保存来源绑定的 `SafeMaterialSnapshot` 状态 | `MaterialDisclosurePolicy`、`FreshnessPolicy` | `SafeViewModel`、`PreviewViewModel` | `OwnerReference`、`ProvenanceMetadata`、`PreviewReference` | `MaterialRevisionHint`（来源/水位，不是 owner history） | `SafeMaterialSnapshot`、`OwnerReference`、`ProvenanceMetadata`、`FreshnessMarker`、`PreviewReference`。 |
| 本地展示与恢复投影 | `LocalProjectionEntry`、`RecoveryContext` | `CacheRetentionPolicy`、`EvictionPolicy`、`PersistenceSafetyGuard` | `LocalDisplayProjection`、`RestorationViewModel` | `CacheKeyRef`、`StorageScopeRef` | `CacheLifecycleRecord`、`DraftRevisionHint`（本地） | `LocalProjectionEntry`、`RecoveryContext`、`CacheLifecycleRecord`、`PersistenceSafetyGuard`。 |

说明：表中的 `Ref`、`Snapshot`、`ViewModel` 和 `Record` 是概要层候选主语；是否由 SDK 正式提供、是否持久化、最终字段和序列化形式必须在 Step 6/7/03/04 再确认。外部 owner 的完整对象不进入 Step 6。

## 5. 各部分交互总图

#### 各部分交互总图

```text
                        +-----------------------------+
                        | 安全语境与导航              |
                        | actor/scope/visibility      |
                        +-------------+---------------+
                                      | entry context
                                      v
                        +-------------+---------------+
                        | 协作体验语境                |
                        | page/route/turn/selection   |
                        +------+------+---------------+
                               |      |
              safe material   |      | local intent
                               v      v
                 +-------------+--+  +------------------------+
                 | owner-safe     |  | 受控协作意图           |
                 | 材料镜像       |  | draft/command/result   |
                 +--------+-------+  +-----------+------------+
                          |                      | SDK command/query
                          | view/ref/result     v
                          |            +---------+----------+
                          |            | L0-sdk 正式接缝     |
                          |            +---------+----------+
                          |                      ^ formal change/resume
                          v                      |
                 +--------+----------------------+-------+
                 | 变化与恢复连续性                     |
                 | reducer/resume/gap/unknown           |
                 +----------------+---------------------+
                                  |
                                  v
                 +----------------+---------------------+
                 | 本地展示与恢复投影                     |
                 | cache/draft/recovery/eviction          |
                 +----------------+---------------------+
                                  |
                                  v
                 +----------------+---------------------+
                 | 平台体验与可访问性                     |
                 | shell/AT/notification/storage         |
                 +---------------------------------------+
```

关键说明：
- `L0-sdk` 是唯一业务接缝；图中所有 owner 事实、命令和 formal change/resume 均通过该边界进入。
- 协作体验语境读取 safe material，受控协作意图提交 local intent；二者都不能直接写 owner truth。
- 变化与恢复连续性把正式变化和恢复结果转成 Chat-local 状态，再由本地投影和页面重绘承接。
- 平台体验与可访问性承载共同语义，不改变业务权限、结果或状态。

## 6. 主要组成部分逐一展开

### 6.1 协作体验语境

#### 6.1.1 本部分职责

组织安全可见的 group/channel/dm/thread、项目协作入口、Turn 表现、线程关系、上下文选择和跨域入口，使用户能理解“当前在哪个协作语境、看到什么来源、下一步可做什么”。本部分消费 safe view/ref/summary 和 Chat-local route/selection，不创建 Conversation 或 Turn truth。

#### 6.1.2 功能 / capability 清单

| 功能 / capability | 输入 | 输出 | 状态 / 副作用 | 后续展开 |
|---|---|---|---|---|
| 入口与语境选择 | `RouteContext`、安全入口 view、scope/visibility posture | `ConversationSurfaceViewModel`、当前选择 | local selection、restricted/unavailable | Step 6 对象；Step 7 Query；Step 8 读取流 |
| Turn/线程呈现 | safe Turn material、来源/新鲜度、thread refs | `TurnPresentationModel`、状态解释 | fresh/stale/partial/blocked | Step 6 对象；Step 9 状态 |
| 跨域卡片挂接 | owner-safe member/project/runtime/Gate/Artifact refs | 引用/摘要卡片 view model | provenance、visibility、preview posture | Step 6 safe material；Step 8 query |
| 页面重绘与焦点保持 | reducer 输出、selection/focus | 可访问页面模型 | local focus/expanded | Step 7/8/9 |

#### 6.1.3 本部分包含的代码主体 / 模块

| 代码主体 / 模块 | 类型 | 作用 | 后续展开位置 |
|---|---|---|---|
| `CollaborationSurfaceCoordinator` | Application service | 编排当前协作语境的读取、选择和重绘 | §6、§8 |
| `ConversationPageViewModel` | Projection/view model | 组合对话入口、Turn、线程和来源状态 | §6、§8 |
| `TurnPresentationModel` | Local presentation object | 表达 Turn 的展示分类和来源状态，不代表 Turn truth | §6、§9 |
| `ContextSelectionCoordinator` | Local application component | 管理 route/selection/focus 的局部变化 | §6、§8、§9 |

#### 6.1.4 本部分对象发现线索

| 维度 | 候选对象 | Step 6 展开要求 |
|---|---|---|
| Truth / State | `SelectionState`、`TurnPresentationState` | 作为 Chat-local state 独立成节；不复制 owner 状态。 |
| Policy / Invariant | `PresentationEligibilityPolicy` | 只解释已给出的 visibility/freshness，需与 `VisibilityGuard` 关系清楚。 |
| Projection / Read model | `ConversationSurfaceViewModel`、`TurnPresentationModel` | 独立定义输入来源、局部字段骨架和降级姿态。 |
| Reference / Boundary | `ConversationRef`、`TurnRef`、`ThreadRef` | 作为 safe reference 类型；不升级为 owner entity。 |
| Audit / History | `NavigationRecoveryHint` | 只作为本地恢复提示，若不正式成对象需在 Step 6 说明。 |

#### 6.1.5 本部分不承担什么

- 不创建、修改、确认或排序 Conversation、Turn、Participant truth。
- 不裁决 scope/visibility/授权，不从空列表或缓存推断对象存在性。
- 不直接调用 owner API、内部 bus 或 Runtime。
- 不把页面已渲染、流式连接或本地选择当作业务结果。

#### 6.1.6 与其他部分的接缝

从安全语境与导航接收可进入语境；从 owner-safe 材料镜像接收 safe view/ref/summary/preview；从变化与恢复连续性接收更新后的 local projection；将 draft/selection/动作意图交给受控协作意图；由平台体验与可访问性承接页面和焦点。

#### 6.1.7 本部分停审记录

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| capability 是否清楚 | 是 | exact Conversation query/visibility pending，留在 SDK blocker。 |
| 候选对象是否有功能来源 | 是 | Step 6 逐对象正式化。 |
| 是否越过 owner 边界 | 否 | owner refs 仅作为安全引用。 |
| 接缝是否清楚 | 是 | Query/Change/Intent/Platform 四类接缝已标出。 |

### 6.2 受控协作意图

#### 6.2.1 本部分职责

把用户的草稿、目标选择、普通发送、重试和 GateCard 受控动作表示为 Chat-local intent/attempt，并将正式 receipt/result/change 映射为用户可理解的 submitted、pending、confirmed、rejected、failed 或 unknown。它负责交互编排和反馈，不执行 owner command、不生成治理结论。

#### 6.2.2 功能 / capability 清单

| 功能 / capability | 输入 | 输出 | 状态 / 副作用 | 后续展开 |
|---|---|---|---|---|
| 草稿与目标管理 | text/ref draft、reply target、selection | `DraftState`、本地校验姿态 | draft/invalid/restored/cleared | §6、§9 |
| 普通发送意图 | `DraftState`、actor/context、command metadata | command attempt/request posture | submitted/pending/unknown | §7、§8、§9 |
| GateCard 受控动作 | safe Gate view、可操作性 posture、用户选择 | governance intent posture | pending/confirmed/rejected/unknown | §7、§8、§9 |
| 重试与未知处理 | failed/unknown attempt、query/probe capability | retry decision or wait/user action | 不自动副作用重放 | §6、§8、§10 |

#### 6.2.3 本部分包含的代码主体 / 模块

| 代码主体 / 模块 | 类型 | 作用 | 后续展开位置 |
|---|---|---|---|
| `UserIntentCoordinator` | Application service | 把本地动作编排到 SDK command/query/probe 边界 | §7、§8 |
| `DraftCoordinator` | Local application component | 管理 draft、reply target 和清理/恢复 | §6、§9、§10 |
| `CommandResultGate` | Policy/guard | 门控正式结果到 confirmed/rejected/failed/unknown | §6、§9 |
| `RetryDecisionCoordinator` | Application policy | 区分可安全重试、查询、等待和用户决定 | §6、§8、§10 |

#### 6.2.4 本部分对象发现线索

| 维度 | 候选对象 | Step 6 展开要求 |
|---|---|---|
| Truth / State | `DraftState`、`CommandAttemptState` | 独立成节，明确 Chat-local 与 owner result 边界。 |
| Policy / Invariant | `CommandResultGate`、`UnknownEffectGuard`、`RetryDecision` | 独立成节；不得配置绕过。 |
| Projection / Read model | `IntentFeedbackViewModel` | 独立成节，承接来源/结果/下一步。 |
| Reference / Boundary | `IntentRef`、`ReceiptRef`、`IdempotencyAssociation` | 只定义边界轮廓，exact SDK contract 待定。 |
| Audit / History | `IntentAttemptHistory` | 只保存最小本地关联；不当作 owner receipt/audit。 |

#### 6.2.5 本部分不承担什么

- 不直接执行 Conversation/Governance command，不生成 Turn、Approval 或 Decision。
- 不把按钮、表单通过、transport ACK、toast 或网络恢复当 confirmed。
- 不在 unknown 时自动重放副作用；不自建幂等服务。
- 不保存命令正文、credential 或 owner 审计材料。

#### 6.2.6 与其他部分的接缝

从协作体验语境接收目标和草稿；从安全语境与导航接收 actor/scope/visibility posture；经 SDK command/query/ref adapter 发起意图或探测；从变化与恢复连续性接收正式结果/变化；把结果姿态交给页面 view model、本地投影和平台公告。

#### 6.2.7 本部分停审记录

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| capability 是否清楚 | 是 | Governance receipt/idempotency 仍 pending。 |
| 候选对象是否有功能来源 | 是 | Draft、attempt、gate 和 retry 均可回指 capability。 |
| 是否越过 owner 边界 | 否 | 只有 local intent/result mapping。 |
| unknown 语义是否清楚 | 是 | 只允许 query/probe/wait/user decision。 |

### 6.3 安全语境与导航

#### 6.3.1 本部分职责

在 actor、scope、visibility、session posture 和深链来源已由正式边界提供时，建立和维持 Chat 的 route/context，控制入口是否可见、只读、受限或不可用，并在 scope 改变、撤销、登出、过期和返回时触发本地清理和安全降级。

#### 6.3.2 功能 / capability 清单

| 功能 / capability | 输入 | 输出 | 状态 / 副作用 | 后续展开 |
|---|---|---|---|---|
| 安全入口守卫 | actor/scope/visibility result | `AccessPosture`、入口 view | available/restricted/blocked | §6、§8、§9 |
| 路由/深链解析 | platform route、safe refs、来源语境 | `RouteContext` | route/local selection | §6、§7 |
| 撤销/登出清理 | revoke/logout/scope change | cleanup instruction | redacted/cleared | §6、§8、§10 |
| 返回/恢复入口 | local recovery hint、formal requery result | safe navigation target | needs-action/unavailable | §6、§8、§9 |

#### 6.3.3 本部分包含的代码主体 / 模块

| 代码主体 / 模块 | 类型 | 作用 | 后续展开位置 |
|---|---|---|---|
| `RouteContextCoordinator` | Application service | 维护当前 route、语境和返回路径 | §6、§8 |
| `ScopeEntryGuard` | Policy/guard | 门控入口是否可进入/只读/受限 | §6、§9 |
| `VisibilityGuard` | Policy/guard | 将正式 visibility/posture 映射为安全显示边界 | §6、§8、§10 |
| `RevocationCleanupCoordinator` | Operations/application component | 触发本地材料裁剪、清理和重绘 | §8、§9、§10 |

#### 6.3.4 本部分对象发现线索

| 维度 | 候选对象 | Step 6 展开要求 |
|---|---|---|
| Truth / State | `RouteContext`、`AccessPosture` | 独立成节；明确不等于 owner scope/authorization。 |
| Policy / Invariant | `VisibilityGuard`、`ScopeEntryGuard`、`RevocationCleanupPolicy` | 独立成节；说明 fail-closed 和清理边界。 |
| Projection / Read model | `EntryViewModel`、`NavigationViewModel` | 独立成节或与 route view 合并说明。 |
| Reference / Boundary | `ActorRef`、`ScopeRef`、`DeepLinkRef`、`ScopeEntryRef` | 作为边界引用/字段类型，不复制 identity/workspace 对象。 |
| Audit / History | `NavigationRecoveryHint` | 若仅是 `RecoveryContext` 字段，Step 6 需说明不独立成对象的原因。 |

#### 6.3.5 本部分不承担什么

- 不认证、签发 credential、计算角色继承或授予 owner 权限。
- 不根据 route、深链、缓存或空列表推断对象存在性。
- 不替代 Identity/Governance 的 actor、scope、Policy 和 lifecycle truth。
- 不将窗口/页面生命周期当作 session 或业务完成。

#### 6.3.6 与其他部分的接缝

向协作体验语境提供可进入的 route/context；向受控协作意图提供 actor/scope/visibility posture；向本地展示与恢复投影发出清理/裁剪指令；接受平台 shell 的深链、返回和生命周期能力；经 SDK query/ref 获取正式入口语境。

#### 6.3.7 本部分停审记录

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| capability 是否清楚 | 是 | 精确 visibility/error 类型待 SDK/owner。 |
| 是否把 route 当 owner truth | 否 | 明确为 Chat-local。 |
| 清理边界是否清楚 | 是 | 只触发本地清理，不修改 owner。 |
| 是否越过 Identity/Governance | 否 | 只消费正式语境和结果。 |

### 6.4 变化与恢复连续性

#### 6.4.1 本部分职责

承接 SDK formal change/event/resume、receipt/result、撤销/版本变化和连接恢复，把它们转换为可幂等、可解释的客户端更新；处理 duplicate、乱序、gap、expired、revoked、reconnecting、requery 和 unknown，但不拥有 bus delivery、owner cursor 或副作用修复。

#### 6.4.2 功能 / capability 清单

| 功能 / capability | 输入 | 输出 | 状态 / 副作用 | 后续展开 |
|---|---|---|---|---|
| Formal change 接入 | SDK change envelope、source/version | reducer input | fresh/stale/gap/unknown | §7、§8、§9 |
| 幂等与顺序判断 | source/cursor/watermark、local acceptance | accepted/duplicate/out-of-order/gap | local record only | §6、§8、§9 |
| Resume/requery | resume context、cursor posture、query capability | refreshed/partial/blocked | no side effect replay | §7、§8、§9 |
| Unknown probe | unknown attempt、formal query/probe | confirmed/rejected/still-unknown | pending/user decision | §7、§8、§10 |

#### 6.4.3 本部分包含的代码主体 / 模块

| 代码主体 / 模块 | 类型 | 作用 | 后续展开位置 |
|---|---|---|---|
| `SdkChangeAdapter` | Inbound adapter | 接收 SDK 正式变化和结果 | §7、§8 |
| `ChangeReducer` | Local reducer | 以来源和版本规则更新 Chat-local projection | §6、§8、§9 |
| `ResumeCoordinator` | Application/operations component | 协调 resume/requery/gap/expired | §7、§8、§9 |
| `RecoveryCoordinator` | Application service | 统一连接、重启和未知结果的恢复姿态 | §8、§9、§10 |

#### 6.4.4 本部分对象发现线索

| 维度 | 候选对象 | Step 6 展开要求 |
|---|---|---|
| Truth / State | `ContinuityState`、`ResumeState` | 独立成节，和命令结果/平台连接状态分离。 |
| Policy / Invariant | `ChangeReductionPolicy`、`UnknownProbePolicy` | 独立成节，禁止按时间戳/连接状态推断。 |
| Projection / Read model | `RecoveryViewModel`、`ChangeStatusView` | 独立成节，表达 gap/stale/blocked/needs-action。 |
| Reference / Boundary | `ChangeCursorRef`、`ResumeContextRef`、`GapRef` | 作为 SDK boundary candidate，不固化内部 offset。 |
| Audit / History | `ChangeAcceptanceRecord` | 仅用于本地幂等/水位材料，不等于 owner event history。 |

#### 6.4.5 本部分不承担什么

- 不直接订阅内部 bus、broker、topic、offset 或 replay。
- 不修复 Conversation/Governance/Artifact/Workspace truth，不重建 owner projection。
- 不以连接恢复、缓存命中、事件到达或 reducer 执行确认业务副作用。
- 不对 unknown command 自动重放。

#### 6.4.6 与其他部分的接缝

从 SDK change/resume/result 接缝输入；向 owner-safe 材料镜像和协作体验语境提供更新后的 safe material posture；向受控协作意图提供命令结果；向本地展示与恢复投影提供恢复/清理信号；由平台 shell 触发生命周期恢复。

#### 6.4.7 本部分停审记录

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| formal change/resume 边界是否清楚 | 是 | 精确 SDK envelope/cursor 未闭合，保留 blocker。 |
| 是否区分 delivery 与业务状态 | 是 | `ChangeAcceptanceRecord` 只作本地材料。 |
| unknown 处理是否越界 | 否 | 只 query/probe/wait/user decision。 |
| 是否需要局部接缝图 | 否 | 总交互图已足够，详细流留给 Step 8。 |

### 6.5 平台体验与可访问性

#### 6.5.1 本部分职责

提供 Desktop-first 应用壳以及后续 Web/Mobile 候选 shell 的窗口/页面生命周期、输入、通知、文件选择、存储、深链、系统返回和辅助技术能力；把共享 Chat 语义转成等价可访问表达，并在宿主能力缺失时显示安全的 unavailable/needs-action。

#### 6.5.2 功能 / capability 清单

| 功能 / capability | 输入 | 输出 | 状态 / 副作用 | 后续展开 |
|---|---|---|---|---|
| Shell 生命周期 | host lifecycle、window/tab/mobile lifecycle | lifecycle posture | local shell state | §6、§8 |
| 输入/通知/深链 | platform capability、safe refs | platform action/result posture | no business confirmation | §7、§8、§10 |
| 可访问语义 | view model、status/focus | focus/announcement semantics | local accessibility state | §6、§9 |
| 文件/存储能力 | safe artifact ref、local storage boundary | open/pick/persist posture | unavailable/needs-action | §7、§10、§11 |

#### 6.5.3 本部分包含的代码主体 / 模块

| 代码主体 / 模块 | 类型 | 作用 | 后续展开位置 |
|---|---|---|---|
| `PlatformCapabilityAdapter` | Platform adapter | 提供窗口、输入、通知、存储、深链等宿主能力 | §7、§8、§11 |
| `ShellLifecycleCoordinator` | Application/platform component | 把宿主生命周期接到恢复和清理语义 | §8、§9 |
| `AccessibilitySemanticAdapter` | Presentation adapter | 把共享状态转成焦点、播报和等价路径 | §6、§9、§10 |
| `PlatformSecurityBoundary` | Policy/adapter boundary | 约束通知、剪贴板、深链和本地持有面 | §6、§10、§11 |

#### 6.5.4 本部分对象发现线索

| 维度 | 候选对象 | Step 6 展开要求 |
|---|---|---|
| Truth / State | `PlatformCapabilityState`、`AccessibilityState` | 独立成节；只代表宿主/可访问性能力。 |
| Policy / Invariant | `PlatformSemanticInvariant`、`FocusOrderPolicy`、`PlatformSecurityBoundary` | 独立成节；不改变业务状态。 |
| Projection / Read model | `ShellViewModel`、`StatusAnnouncement` | 独立成节或说明公告为 view model 子结构。 |
| Reference / Boundary | `PlatformCapabilityRef` | 作为宿主能力边界，不生成业务 ref。 |
| Audit / History | - | 本部分不产生业务 audit/history；低敏诊断通过外部接缝登记。 |

#### 6.5.5 本部分不承担什么

- 不实现或选择具体 UI 框架、窗口库、移动原生组件或存储引擎。
- 不把平台 ACK、通知送达、窗口打开或系统返回当业务结果。
- 不改变 owner 权限、状态机、结果门控或恢复上限。
- 不保存凭据、raw body 或未授权诊断材料。

#### 6.5.6 与其他部分的接缝

承载协作体验语境和受控意图的页面/输入；接收变化与恢复连续性的 lifecycle trigger；向本地投影提供 storage/cleanup capability；向可访问性语义提供 view model；可选地向低敏诊断接缝提供 capability/error category。

#### 6.5.7 本部分停审记录

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 平台职责是否与业务语义分离 | 是 | 具体 shell/adapter 仍 candidate。 |
| 是否有业务状态被平台生成 | 否 | 平台只提供 capability posture。 |
| 可访问性是否共享语义 | 是 | 状态来自 shared view model，不另造业务枚举。 |

### 6.6 owner-safe 材料镜像

#### 6.6.1 本部分职责

接收经 SDK 授权的 safe view/ref/summary/preview/result/change 材料，保留来源、范围、visibility、版本/水位、新鲜度和覆盖范围，并将不同 owner 的材料组合成可展示的局部 view。它是材料镜像和解释边界，不是跨域 truth store。

#### 6.6.2 功能 / capability 清单

| 功能 / capability | 输入 | 输出 | 状态 / 副作用 | 后续展开 |
|---|---|---|---|---|
| safe material 接收 | SDK query/result/change | `SafeMaterialSnapshot` | fresh/stale/partial/restricted | §6、§8、§9 |
| provenance/freshness 解释 | source/ref/version/visibility | `ProvenanceMetadata`、`FreshnessMarker` | unknown/stale/unavailable | §6、§9 |
| 跨域展示组合 | 多 owner safe views/ref | card/summary view model | display-only | §6、§8 |
| Artifact/引用预览边界 | safe ref/preview result | `PreviewReference`、preview posture | preview-unavailable/restricted | §6、§7、§8 |

#### 6.6.3 本部分包含的代码主体 / 模块

| 代码主体 / 模块 | 类型 | 作用 | 后续展开位置 |
|---|---|---|---|
| `SafeMaterialComposer` | Projection/application component | 组合 safe view/ref/summary 成页面材料 | §6、§8 |
| `ProvenanceMapper` | Mapper/policy component | 统一来源、范围和引用标记 | §6、§9 |
| `FreshnessInterpreter` | Policy component | 解释版本/水位/过期/partial 状态 | §6、§9、§10 |
| `PreviewBoundary` | Adapter boundary | 处理 safe preview/ref 和不可预览姿态 | §7、§8、§10 |

#### 6.6.4 本部分对象发现线索

| 维度 | 候选对象 | Step 6 展开要求 |
|---|---|---|
| Truth / State | `MaterialAvailabilityState`、`FreshnessMarker` | 独立成节，说明不等于 owner lifecycle。 |
| Policy / Invariant | `MaterialDisclosurePolicy`、`FreshnessPolicy` | 独立成节；不可被 UI 或配置绕过。 |
| Projection / Read model | `SafeMaterialSnapshot`、`SafeViewModel`、`PreviewViewModel` | 独立成节，明确 body-free 和来源元数据。 |
| Reference / Boundary | `OwnerReference`、`ProvenanceMetadata`、`PreviewReference` | 独立成节/字段骨架；不复制 owner ref schema。 |
| Audit / History | `MaterialRevisionHint` | 只作为来源水位/版本提示，不是 owner history。 |

#### 6.6.5 本部分不承担什么

- 不保存或重建 owner 原始正文、版本链、Evidence/Baseline、Policy 或审计材料。
- 不从对象名、ref、错误差异或字段缺失推断可见性、存在性或完成。
- 不将多个 owner summary 合成 Project/Workspace/Runtime/Governance truth。
- 不把预览成功等同于 Artifact 业务状态或下载完成。

#### 6.6.6 与其他部分的接缝

从 SDK query/ref/change adapter 接收材料；向协作体验语境提供 view model；向本地投影提供可安全缓存的最小材料；向平台/可访问性提供来源和状态文案；接受安全语境的 visibility/scope guard。

#### 6.6.7 本部分停审记录

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| material 与 truth 是否分离 | 是 | 明确 safe snapshot/ref 不是 owner truth。 |
| body-free/visibility 是否清楚 | 是 | 不可验证时 restricted/unavailable。 |
| 跨域组合是否越界 | 否 | display-only，不生成统一生命周期/授权。 |
| preview contract 是否闭合 | 否 | `CHAT-UP-004` 继续 blocker。 |

### 6.7 本地展示与恢复投影

#### 6.7.1 本部分职责

承载 Chat-local 的 draft、selection、route/recovery context 和来源绑定的最小安全展示缓存，支持重绘、断线、Desktop 重启、离线只读和撤销/过期清理。它不能延长授权、确认副作用或替代 formal change/resume。

#### 6.7.2 功能 / capability 清单

| 功能 / capability | 输入 | 输出 | 状态 / 副作用 | 后续展开 |
|---|---|---|---|---|
| local projection 写入/读取 | safe snapshot、draft、selection、recovery metadata | `LocalProjectionEntry`、restore view | cached/restored/stale | §6、§8、§9、§11 |
| 受限缓存失效 | revoke/logout/scope/expiry | eviction/clear decision | cleared/restricted | §6、§8、§10 |
| 重启恢复 | shell lifecycle、local entry、resume result | `RecoveryContext`、restore view | needs-action/blocked | §6、§8、§9 |
| 本地 draft 保护 | DraftState、storage posture | draft restore/clear | draft/cleared | §6、§9、§11 |

#### 6.7.3 本部分包含的代码主体 / 模块

| 代码主体 / 模块 | 类型 | 作用 | 后续展开位置 |
|---|---|---|---|
| `ClientStateStore` | Local state store | 保存 Chat-local 状态和投影索引 | §6、§7、§8、§9 |
| `LocalProjectionRepository` | Port/repository boundary | 读写最小安全 projection | §7、§8、§11 |
| `DraftStore` | Local persistence component | 保存未提交 draft 和恢复标记 | §6、§8、§9 |
| `CacheEvictionCoordinator` | Operations component | 依据撤销/过期/scope 变化清理材料 | §8、§9、§10、§11 |

#### 6.7.4 本部分对象发现线索

| 维度 | 候选对象 | Step 6 展开要求 |
|---|---|---|
| Truth / State | `LocalProjectionEntry`、`RecoveryContext` | 独立成节，说明仅为 Chat-local/投影。 |
| Policy / Invariant | `CacheRetentionPolicy`、`EvictionPolicy`、`PersistenceSafetyGuard` | 独立成节；不能延长授权或绕过 body-free。 |
| Projection / Read model | `LocalDisplayProjection`、`RestorationViewModel` | 独立成节，说明缓存命中不等于 fresh。 |
| Reference / Boundary | `CacheKeyRef`、`StorageScopeRef` | 作为本地存储边界，不等于 owner scope/cursor。 |
| Audit / History | `CacheLifecycleRecord`、`DraftRevisionHint` | 独立成节或说明最小本地记录范围。 |

#### 6.7.5 本部分不承担什么

- 不缓存 credential、raw body、内部 event payload、owner 审计或治理正文。
- 不从缓存命中、空列表或恢复成功推断当前授权、业务完成或 owner change。
- 不在离线期间确认发送/审批/Runtime 副作用，不替代 SDK query/change/resume。
- 不把本地清理记录变成 Observability 或 owner audit truth。

#### 6.7.6 与其他部分的接缝

从 owner-safe 材料镜像接收可缓存材料，从受控协作意图接收 draft/attempt 状态，从安全语境接收清理指令，从变化与恢复连续性接收 resume/requery 状态，由平台 shell 提供存储/生命周期能力，向协作体验语境和可访问性提供 restore view。

#### 6.7.7 本部分停审记录

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 缓存是否与 owner truth 分离 | 是 | 只保存来源绑定的安全 projection。 |
| 清理/撤销边界是否清楚 | 是 | identity/scope/revoke/expiry 触发本地裁剪。 |
| 是否支持离线业务成功 | 否 | 只读、草稿和恢复提示。 |
| persistence contract 是否闭合 | 否 | 留给 Step 11/03/04，当前不写载体和上限。 |

## 7. 总体边界说明

七个主要组成部分共同形成 Chat 的客户端产品结构，但它们不拥有任何外部领域 truth。安全语境决定“能否进入/显示/操作”的姿态，协作体验组织“如何呈现”，受控意图组织“用户想做什么及结果如何反馈”，变化与恢复承接“正式变化如何进入客户端”，owner-safe 材料镜像提供“可安全消费的材料”，本地投影保存“有限的客户端连续性”，平台体验负责“如何在宿主和辅助技术上表达”。`L0-sdk`、owner 和平台/诊断 adapter 是边界，不被内部部分越过。

## 8. Step 6 展开门禁

- Step 6 必须从本文件对象发现维度表和每部分线索开始筛选，不得临场发明未有来源的 owner 对象。
- `RouteContext`、`AccessPosture`、`DraftState`、`CommandAttemptState`、`ContinuityState`、`ResumeContext`、`PlatformCapabilityState`、`AccessibilityState`、`SafeMaterialSnapshot`、`OwnerReference`、`ProvenanceMetadata`、`FreshnessMarker`、`PreviewReference`、`LocalProjectionEntry`、`RecoveryContext`、`CacheLifecycleRecord` 和各主要 policy/guard 候选必须逐一处理；如不独立成节，必须说明原因。
- `ConversationRef`、`TurnRef`、`ActorRef`、`ScopeRef`、`GateRef`、`ArtifactRef`、`WorkspaceViewRef`、`RuntimeRef` 等只作为安全边界引用/字段类型，不得升级为 Chat 领域实体。
- Step 6 只写概要字段/函数骨架，不写完整 owner DTO、协议 schema、数据库或实现。

## 9. 跨组成部分闭环审计

| 审计项 | 结论 | 依据 / 修正 |
|---|---|---|
| 每个部分是否有明确 capability | 是 | 7 个部分均有 capability 表。 |
| 每个 capability 是否有代码主体承接 | 是 | 每部分代码主体表均指向 §6/§7/§8/§9。 |
| 候选对象是否能回指 capability | 是 | 对象发现维度表和逐部分线索已建立。 |
| 是否存在重复对象 | 暂无 unresolved 重复 | `RecoveryContext` 同时被连续性/本地投影使用，canonical owner 归变化与恢复连续性，投影只消费；Step 6 需保持该归属。 |
| 是否存在接口/处理流跨界 | 受控 | SDK/Platform/Storage 是外部接缝；后续 Step 7/8 明确入口归属。 |
| 是否把 view model 当 owner truth | 否 | 全部限定为 safe material 或 Chat-local projection。 |
| 是否存在候选对象没有后续位置 | 否 | Step 6/7/8/9 或“本轮不展开/字段类型”均已标注。 |
| 是否需要额外局部图 | 否 | 7 部分总图已表达主要流向；局部复杂时留给 Step 8，不在本步新增。 |

## 10. 回填草稿（正式 §5）

> 校准来源：本文件 `§3 组成部分总表`、`§4 对象发现维度表`、`§5 各部分交互总图`、`§6 主要组成部分逐一展开`、`§9 跨组成部分闭环审计`。

### 5.1 组成部分总表

| 组成部分 | 核心职责 | 主要代码主体 | 不承担什么 |
|---|---|---|---|
| 协作体验语境 | 组织对话、线程、Turn 和跨域入口 | `CollaborationSurfaceCoordinator`、`ConversationPageViewModel`、`TurnPresentationModel` | 不拥有 Conversation/Turn truth 或授权。 |
| 受控协作意图 | 管理 draft、发送/治理意图和结果反馈 | `UserIntentCoordinator`、`DraftCoordinator`、`CommandResultGate` | 不执行 owner command 或生成 Decision。 |
| 安全语境与导航 | 建立 actor/scope/visibility 语境和安全路由 | `RouteContextCoordinator`、`VisibilityGuard`、`ScopeEntryGuard` | 不认证、不授予权限、不拥有 scope truth。 |
| 变化与恢复连续性 | 消费 formal change/resume 并表达缺口/恢复 | `SdkChangeAdapter`、`ChangeReducer`、`ResumeCoordinator` | 不直订 bus、不拥有 delivery cursor。 |
| 平台体验与可访问性 | 提供 Desktop-first shell、等价可访问表达和宿主能力 | `PlatformCapabilityAdapter`、`AccessibilitySemanticAdapter` | 不改变业务语义、权限或结果。 |
| owner-safe 材料镜像 | 组合带来源/可见性/新鲜度的 safe material | `SafeMaterialComposer`、`ProvenanceMapper`、`PreviewBoundary` | 不复制正文、owner schema 或跨域 truth。 |
| 本地展示与恢复投影 | 保存受限缓存、draft、恢复和清理语义 | `ClientStateStore`、`LocalProjectionRepository`、`CacheEvictionCoordinator` | 不延长授权、不确认业务副作用。 |

### 5.2 主要接缝

上述主要组成部分通过 `L0-sdk` 的 query/command/change/ref/resume 能力、平台宿主能力和本地受限存储协作。每个部分只拥有 Chat-local 状态或安全展示材料；owner truth、领域授权、正文和事件 delivery 仍归正式 owner/SDK。

### 5.3 Step 6 展开入口

Step 6 将从对象发现维度表筛选关键对象，逐一给出所属部分、对象类型、关键字段骨架、状态集合、成员/工厂函数骨架和禁止事项；外部 owner ref 只作为字段类型或边界引用。

## 11. 待确认事项

| 待确认 | 影响 | 当前挂起口径 |
|---|---|---|
| 是否需要把 Workspace/Runtime/Observability safe material 分成独立 presentation component | Step 6/7 的对象和接口归属 | 当前并入 owner-safe 材料镜像，按来源标签和 boundary ref 分域；不建立统一 truth。 |
| `RecoveryContext` 的 canonical owner 与本地投影使用方式 | Step 6/8/9 的对象去重 | canonical owner 归变化与恢复连续性；本地投影只保存/恢复其安全子集。 |
| 平台诊断 handoff 是否属于独立主要部分 | Step 7/11 的接口和配置 | 当前作为平台体验与可访问性/外部诊断接缝，不增加第八个业务部分。 |

## 12. 自检与门禁

### 12.1 逐部分停审结果

七个部分均完成了 capability、代码主体、对象发现线索、非职责、接缝和停审记录；没有部分把 owner truth、SDK 实现或平台实现吸收为自身职责。

### 12.2 后续展开一致性

| Step 5 主语 | 后续承接 |
|---|---|
| `RouteContext`、`AccessPosture`、`VisibilityGuard` | Step 6 对象；Step 7 Entry Query；Step 8 入口/清理流；Step 9 availability/visibility 状态。 |
| `DraftState`、`CommandAttemptState`、`CommandResultGate` | Step 6 对象；Step 7 Command/Probe；Step 8 发送/治理流；Step 9 command 状态。 |
| `SafeMaterialSnapshot`、`OwnerReference`、`ProvenanceMetadata`、`FreshnessMarker` | Step 6 对象；Step 7 Query/Reference；Step 8 读取/预览流；Step 9 freshness/visibility 状态。 |
| `ContinuityState`、`ResumeContext`、`ChangeAcceptanceRecord` | Step 6 对象；Step 7 Change/Resume；Step 8 reducer/recovery 流；Step 9 continuity 状态。 |
| `LocalProjectionEntry`、`RecoveryContext`、`CacheLifecycleRecord` | Step 6 对象；Step 7 local operations；Step 8 persist/evict/restart 流；Step 9 local recovery 状态。 |
| `PlatformCapabilityState`、`AccessibilityState`、`StatusAnnouncement` | Step 6 对象；Step 7 platform port；Step 8 lifecycle/announcement 流；Step 9 capability/accessibility 状态。 |

### 12.3 Step 自检

| 检查项 | 结论 |
|---|---|
| 是否按主要组成部分组织，而不是按目录/类平铺？ | 是。 |
| 是否每个部分都有 capability、代码主体、对象发现线索和停审？ | 是，7/7。 |
| 是否覆盖 truth/state/policy/projection/reference/audit/history 维度？ | 是；不适用项明确写为 `-`。 |
| 是否把对象字段/函数提前写进 Step 5？ | 否；候选池留给 Step 6。 |
| 是否有悬空后续展开位置？ | 否；均指向 Step 6～9 或明确字段类型/留给详细设计。 |
| 是否存在跨部分重复或职责冲突？ | 无 unresolved；`RecoveryContext` 已指定 canonical owner。 |
| 是否越过 owner/SDK/platform/diagnostic 边界？ | 否。 |

### 12.4 门禁结论

`gate_status = pass`。Step 5 已完成，下一动作是创建并执行 `02_hld_step_06_key_objects.md`；Step 6 必须按本文件候选池逐一正式化对象，并完成对象归属、字段/函数骨架和 Step 8/9 反查。

### 2026-10-01 独立复核：协作体验语境

计划/输入：对照Step5 SOP、规范§4.5、修复后§1～4与本部分现有职责/对象/接缝；先capability再对象。诊断和取舍：新候选六对象有明确页面来源；旧ConversationPageViewModel统一为ConversationSurfaceViewModel；无owner推进或目录服务。

| capability | 输入 | 输出 | 局部状态/副作用 | 承接 |
|---|---|---|---|---|
| 对话与Turn展示 | Conversation safe view/类型/ref | ConversationSurfaceViewModel/TurnPresentationModel | 局部选择，不建立Turn | §6/7/8/9 |
| 项目列表与五标签 | Work项目safe summary/ref，独立访问 | ProjectDetailViewModel | tab切换，进度嵌于详情 | §6/7/8 |
| 整体→阶段→节点 | Process正式拓扑/状态/关联ref | ProcessFlowViewModel/ProcessNodeDetailViewModel | 只读选择；无合同blocked | §6/7/8/9 |
| 项目↔群聊/公司目录 | 正式关系/目录provider，目标各自授权 | ProjectConversationLinkViewModel/CompanyDirectoryViewModel | 保存安全返回，不建立绑定或成员资格 | §6/7/8 |

对象维度：沿用本部分state/policy/projection/ref/history分类，新投影不成为owner truth。复杂度用表与既有交互图；回填现有§5.4，不另建正式文档。独立停审：功能、候选对象来源、接缝和禁止项清楚；章节gate pass，SDK/owner合同保持blocked。当前部分完成后才进入下一部分；未实现/测试/提交。

### 2026-10-01 独立复核：受控协作意图

计划/输入：对照Step5 SOP、规范§4.5、修复后§1～4与本部分现有职责/对象/接缝；先capability再对象。诊断和取舍：项目图点击只读；工具调用、commit/测试摘要不可升级为批准/验收；SDK负责正式执行。

| capability | 输入 | 输出 | 局部状态/副作用 | 承接 |
|---|---|---|---|---|
| 发送/重试 | 草稿、正式目标、SDK command/result | attempt与IntentFeedbackViewModel | optimistic可撤销；submitted/pending到正式confirmed | §6/7/8/9 |
| Gate受控审批入口 | Governance Gate ref/正式授权与幂等合同 | submitted/rejected/failed/unknown | 业务确认receipt/result/change才可confirmed | §6/8/9 |
| unknown探测 | attempt关联及正式probe/query | 等待或已确认结果 | 禁止自动重放；结果缺合同blocked | §8/10 |

对象维度：沿用本部分state/policy/projection/ref/history分类，新投影不成为owner truth。复杂度用表与既有交互图；回填现有§5.5，不另建正式文档。独立停审：功能、候选对象来源、接缝和禁止项清楚；章节gate pass，SDK/owner合同保持blocked。当前部分完成后才进入下一部分；未实现/测试/提交。

### 2026-10-01 独立复核：安全语境与导航

计划/输入：对照Step5 SOP、规范§4.5、修复后§1～4与本部分现有职责/对象/接缝；先capability再对象。诊断和取舍：局部navigation不得证明正式关系；ClientConsumptionContext独立候选，不产生统一业务版本。

| capability | 输入 | 输出 | 局部状态/副作用 | 承接 |
|---|---|---|---|---|
| 路由与目标访问 | actor/scope/ref/正式access posture | RouteContext/AccessPosture | 独立验证项目/群聊/节点/人员目标 | §6/8/9 |
| 消费上下文隔离 | 当前actor/scope/project/source与请求代次 | ClientConsumptionContext | 拒绝旧响应/旧订阅，撤销使代次失效 | §6/8/10 |
| 撤销与返回 | 正式revoke/logout/scope change | 受限入口/清理请求 | 清除标签、图、节点、关系、目录与返回敏感ref | §8/10 |

对象维度：沿用本部分state/policy/projection/ref/history分类，新投影不成为owner truth。复杂度用表与既有交互图；回填现有§5.6，不另建正式文档。独立停审：功能、候选对象来源、接缝和禁止项清楚；章节gate pass，SDK/owner合同保持blocked。当前部分完成后才进入下一部分；未实现/测试/提交。

### 2026-10-01 独立复核：变化与恢复连续性

计划/输入：对照Step5 SOP、规范§4.5、修复后§1～4与本部分现有职责/对象/接缝；先capability再对象。诊断和取舍：复用现有continuity对象；拓扑和状态版本不一致时stale/partial，禁止拼假原子快照。

| capability | 输入 | 输出 | 局部状态/副作用 | 承接 |
|---|---|---|---|---|
| 正式变化/reducer | SDK formal change/source cursor/context | 局部safe projection及ChangeAcceptanceRecord | 幂等/乱序/gap按来源；不跨owner比较水位 | §6/8/9 |
| 分层流程恢复 | Process版本/关联变化、当前选择 | RecoveryViewModel与安全重查 | 父拓扑变化使旧节点选择失效；缺能力blocked | §8/10 |
| 重连/unknown | ResumeContext/attempt | requery/probe/wait | 恢复连接不能确认命令或汇聚 | §8/9 |

对象维度：沿用本部分state/policy/projection/ref/history分类，新投影不成为owner truth。复杂度用表与既有交互图；回填现有§5.7，不另建正式文档。独立停审：功能、候选对象来源、接缝和禁止项清楚；章节gate pass，SDK/owner合同保持blocked。当前部分完成后才进入下一部分；未实现/测试/提交。

### 2026-10-01 独立复核：平台体验与可访问性

计划/输入：对照Step5 SOP、规范§4.5、修复后§1～4与本部分现有职责/对象/接缝；先capability再对象。诊断和取舍：成熟只读图库优先候选；bpmn-js viewer需正式授权BPMN输入，不能从ref/原型坐标编造XML。

| capability | 输入 | 输出 | 局部状态/副作用 | 承接 |
|---|---|---|---|---|
| 图/列表等价 | 授权拓扑+VM访问/新鲜度 | ReadOnlyProcessRenderer/StatusAnnouncement | 键盘节点选择、缩放/平移、返回；仅局部变化 | §8/11 |
| 最小披露 | restricted node/edge/ref | 受限图及等价列表 | 隐藏名称/数量/边关系，不通过AT泄漏 | §8/10 |
| shell宿主能力 | 平台capability/lifecycle | PlatformCapabilityState/AccessibilityState | 恢复/存储/通知只影响体验 | §6/8/9 |

对象维度：沿用本部分state/policy/projection/ref/history分类，新投影不成为owner truth。复杂度用表与既有交互图；回填现有§5.8，不另建正式文档。独立停审：功能、候选对象来源、接缝和禁止项清楚；章节gate pass，SDK/owner合同保持blocked。当前部分完成后才进入下一部分；未实现/测试/提交。

### 2026-10-01 独立复核：owner-safe 材料镜像

计划/输入：对照Step5 SOP、规范§4.5、修复后§1～4与本部分现有职责/对象/接缝；先capability再对象。诊断和取舍：无跨owner事务/完成度推导；Runtime统计和测试仅安全摘要，保留正式来源与缺口。

| capability | 输入 | 输出 | 局部状态/副作用 | 承接 |
|---|---|---|---|---|
| 来源分立组合 | Work/Process/Governance/Runtime等safe材料 | SafeMaterialSnapshot/provenance/freshness | 每项保留source-local版本和独立访问 | §6/8/9 |
| 节点关联与证据 | 正式节点关系ref，目标owner安全读取 | ProcessNodeDetailViewModel安全section | 缺一source仅该section blocked/partial；不猜关联 | §6/8/10 |
| 预览与引用 | Artifact safe preview/ref | PreviewReference | preview隔离；工具/commit/test摘要不等于验收证据 | §6/8 |

对象维度：沿用本部分state/policy/projection/ref/history分类，新投影不成为owner truth。复杂度用表与既有交互图；回填现有§5.9，不另建正式文档。独立停审：功能、候选对象来源、接缝和禁止项清楚；章节gate pass，SDK/owner合同保持blocked。当前部分完成后才进入下一部分；未实现/测试/提交。

### 2026-10-01 独立复核：本地展示与恢复投影

计划/输入：对照Step5 SOP、规范§4.5、修复后§1～4与本部分现有职责/对象/接缝；先capability再对象。诊断和取舍：图材料与目录按来源/访问缓存切分；不用本地ref补图/补成员；无原型数据持久化。

| capability | 输入 | 输出 | 局部状态/副作用 | 承接 |
|---|---|---|---|---|
| 局部导航store | ProjectNavigationState/SelectionState/context | ClientStateStore安全局部切片 | tab/阶段/节点/viewport/return不写owner | §6/8/9 |
| 持久化与恢复 | 安全草稿/最小缓存/恢复ref | LocalProjectionEntry/CacheLifecycleRecord | 恢复前重验语境与关系；不恢复授权或批准 | §6/8/11 |
| 清理 | revoke/logout/expiry/scope change | 不可见姿态+清理记录 | 先阻断展示/失效消费代次，再持久清理；失败不恢复展示 | §8/10 |

对象维度：沿用本部分state/policy/projection/ref/history分类，新投影不成为owner truth。复杂度用表与既有交互图；回填现有§5.10，不另建正式文档。独立停审：功能、候选对象来源、接缝和禁止项清楚；章节gate pass，SDK/owner合同保持blocked。当前部分完成后才进入下一部分；未实现/测试/提交。

## 2026-10-01 跨组成部分闭环审计

七部分依次完成独立capability/线索/接缝/禁止项复核。协作体验拥有六新增投影/导航候选；安全导航拥有ClientConsumptionContext；reducer和缓存复用现有对象，不产生重复Process/Governance实体。渲染器是adapter不作为领域对象，coordinator的完整实现签名留03；新增对象§6、查询§7、流§8、局部状态§9可连续展开。交互总图保持七部分，source隔离属于既有安全/恢复接缝。Step5 done gate pass，进入Step6；合同仍blocked。

当前Step14一致性回查：正式§5.3补图后接缝说明，§5.11补跨部分检查表；均为当前七部分独立停审结论整理，无新模块或能力。章节gate pass，合同blocked。
