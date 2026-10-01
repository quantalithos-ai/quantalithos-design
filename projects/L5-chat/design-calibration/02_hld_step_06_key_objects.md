# L5-chat 02 · Step 6 关键对象轮廓

> Step 状态：`done`
> gate_status：`pass`
> 本步主题：从 Step 5 的对象发现维度表和候选线索出发，按主要组成部分正式化概要层关键对象，并完成字段、状态、成员函数、工厂函数和禁止事项边界。
> 生成依据：`standards/document/概要设计讨论流程_SOP.md` §5 Step 6；`standards/document/概要设计书写规范.md` §4.6。
> 上游输入：`02_hld_step_05_components_boundary.md`、Step 1～4、`projects/L5-chat/00-需求文档.md`、`projects/L5-chat/01-架构设计.md`。

## 1. Step 内计划

| 子阶段 | 主要组成部分 | 状态 | 门禁 |
|---|---|---|---|
| 读取输入与候选池 | Step 5 总表、7 部分对象发现维度和后续展开门禁 | `done` | 候选来源可追溯 |
| 协作体验语境对象正式化 | Route/selection/presentation projections | `done` | 局部停审通过 |
| 受控协作意图对象正式化 | Draft/attempt/result guard/feedback | `done` | 局部停审通过 |
| 安全语境与导航对象正式化 | Access/visibility/route guards | `done` | 局部停审通过 |
| 变化与恢复连续性对象正式化 | Continuity/resume/acceptance/recovery | `done` | canonical owner 已固定 |
| 平台体验与可访问性对象正式化 | Platform/accessibility/announcement | `done` | 宿主语义与业务语义分离 |
| owner-safe 材料镜像对象正式化 | Snapshot/reference/provenance/freshness/preview | `done` | body-free / provenance 边界通过 |
| 本地展示与恢复投影对象正式化 | Local projection/cache lifecycle | `done` | 清理、留存、owner truth 分离 |
| 跨对象审计与反查 | §8/§9 预期对象、重复定义、类型越层 | `done` | 无 unresolved |
| 回填、自检和门禁 | §6 草稿、禁用项、Step 8/9 反查 | `done` | 完成后 `pass` |

## 2. 对象候选池筛选说明

| 候选名称 | 来源维度 | 筛选结论 | 原因 |
|---|---|---|---|
| `RouteContext` | 安全语境与导航 / Truth-State | 正式关键对象 | Chat-local 路由和语境承载，后续入口 Query、恢复和状态机需要。 |
| `AccessPosture` | 安全语境与导航 / Truth-State | 正式关键对象 | 需要区分可见、只读、受限、不可用和阻塞，不等于 owner authorization。 |
| `VisibilityGuard` | 安全语境与导航 / Policy-Invariant | 正式关键对象 | fail-closed 的结构守卫，影响入口、材料和清理。 |
| `SelectionState` | 协作体验语境 / Truth-State | 正式关键对象 | 当前 conversation/thread/Turn/Gate/Artifact 等选择是 Chat-local 主语。 |
| `TurnPresentationModel` | 协作体验语境 / Projection | 正式关键对象 | 负责 Turn 展示语义，不复制 Turn truth。 |
| `ConversationSurfaceViewModel` | 协作体验语境 / Projection | 正式关键对象 | 页面级安全 view model，承接来源和 freshness。 |
| `DraftState` | 受控协作意图 / Truth-State | 正式关键对象 | 未提交输入和恢复必须独立表达。 |
| `CommandAttemptState` | 受控协作意图 / Truth-State | 正式关键对象 | 分离 local intent/attempt 与 owner result。 |
| `CommandResultGate` | 受控协作意图 / Policy | 正式关键对象 | confirmed/rejected/failed/unknown 的结果门控。 |
| `IntentFeedbackViewModel` | 受控协作意图 / Projection | 正式关键对象 | 将 attempt/result/next action 显化给页面。 |
| `ContinuityState` | 变化与恢复 / Truth-State | 正式关键对象 | 维护 fresh/stale/gap/reconnecting 等客户端连续性轴。 |
| `ResumeContext` | 变化与恢复 / Reference-Boundary | 正式关键对象 | 恢复、requery、gap 处理的 canonical Chat-local 上下文。 |
| `ChangeAcceptanceRecord` | 变化与恢复 / Audit-History | 正式关键对象 | 本地幂等/水位材料，不是 owner event history。 |
| `RecoveryViewModel` | 变化与恢复 / Projection | 正式关键对象 | 解释恢复下一步、缺口和未知结果。 |
| `PlatformCapabilityState` | 平台体验 / Truth-State | 正式关键对象 | 描述宿主能力姿态，不生成业务状态。 |
| `AccessibilityState` | 平台体验 / Truth-State | 正式关键对象 | 共享可访问语义和焦点状态。 |
| `StatusAnnouncement` | 平台体验 / Projection | 正式关键对象 | 将共享状态转换为辅助技术可理解的公告。 |
| `SafeMaterialSnapshot` | owner-safe 材料 / Projection | 正式关键对象 | body-free、来源绑定的安全材料容器。 |
| `OwnerReference` | owner-safe 材料 / Reference-Boundary | 正式关键对象 | 仅回链 owner 对象，不转移 truth 或正文。 |
| `ProvenanceMetadata` | owner-safe 材料 / Reference-Boundary | 正式关键对象 | 保存来源、scope、visibility、revision/watermark 语境。 |
| `FreshnessMarker` | owner-safe 材料 / State | 正式关键对象 | 明确 fresh/stale/partial/unknown，不等于 owner lifecycle。 |
| `PreviewReference` | owner-safe 材料 / Reference-Boundary | 正式关键对象 | Artifact/安全预览结果的 body-free 入口。 |
| `LocalProjectionEntry` | 本地投影 / Truth-State | 正式关键对象 | 受限展示缓存和索引的 Chat-local 容器。 |
| `CacheLifecycleRecord` | 本地投影 / Audit-History | 正式关键对象 | 记录本地 cache 写入/失效/清理姿态，不是 Observability audit。 |
| `PersistenceSafetyGuard` | 本地投影 / Policy | 正式关键对象 | 阻止 credential/raw body/越权材料进入本地持有面。 |
| `PlatformCapabilityRef`、`ConversationRef`、`TurnRef`、`ActorRef`、`ScopeRef`、`GateRef`、`ArtifactRef` 等 | Reference/Boundary | 字段类型/边界引用，不独立展开 | 它们由 SDK/owner 提供或待确认；Chat 不复制其 schema。 |
| `SdkQueryAdapter`、`SdkCommandAdapter`、`SdkChangeAdapter`、`LocalProjectionRepository`、`PlatformCapabilityAdapter` | Step 5 代码主体 / Port-Adapter | 留给 §7 接口与详细设计 | 它们是接缝/port，不是本章的领域关键对象；本章只在对象字段中引用其能力。 |
| 完整 Conversation、Turn、Gate、Decision、Artifact、Workspace、Runtime 等 owner 对象 | owner truth | 排除 | 不得形成 Chat shadow truth。 |

## 3. 对象正式化原则

- 本章对象均是 Chat-local、safe projection、reference、policy、state、audit/history 或 context object；外部 owner truth 只通过 `OwnerReference`、安全材料和结果姿态进入。
- 字段类型使用概要层类型名，不复制上游 DTO 或 wire schema；未确认的 SDK 类型只写能力级边界名。
- 状态集合表达客户端语义，不把 UI 文案、transport 状态或 owner 生命周期混成同一枚举。
- 成员/工厂函数只写参数类型骨架和责任，不写完整签名、返回类型、泛型、实现和调用链。
- `ResumeContext` 是变化与恢复连续性的 canonical Chat-local 对象；`LocalProjectionEntry` 只能保存其可持久化安全子集。

## 4. 协作体验语境对象

### 4.1 `RouteContext`

#### 4.1.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | 安全语境与导航（被协作体验语境消费） |
| 对象类型 | context object / local state |
| 主要责任 | 表示当前 Chat route、入口来源和局部协作语境，不代表 owner scope 或对象存在性。 |

#### 4.1.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `platform_kind` | `PlatformKind` | 标记 Desktop/Web/Mobile shell 语境，不改变业务语义。 |
| `route_kind` | `RouteKind` | 标记入口/空间/线程/恢复等产品路径。 |
| `scope_ref` | `ScopeRef` | 回链当前授权语境的安全引用，不保存 scope truth。 |
| `entry_ref` | `EntryReference` | 记录从哪个安全入口进入，便于返回和恢复。 |
| `return_context` | `ReturnContext` | 保存本地返回位置和恢复提示，不触发隐式查询。 |
| `deep_link_provenance` | `DeepLinkProvenance` | 标记深链来源和可信度，未知时受限。 |

#### 4.1.3 状态集合

| 状态 | 作用 |
|---|---|
| `unresolved` | 尚未通过正式语境判断，不能据此展示受保护材料。 |
| `resolved` | 已获得可解释的 Chat-local route/context。 |
| `restricted` | route 存在但 scope/visibility 只允许受限或只读姿态。 |
| `expired` | 本地 route 仍存在但语境已过期，需要重新验证或清理。 |
| `cleared` | 登出、撤销或清理后不再承载旧语境。 |

#### 4.1.4 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `apply_entry_result(EntryAccessResult entry_result)` | 根据正式入口结果更新 route posture，不自行授予访问。 |
| `change_scope(ScopeRef scope_ref)` | 切换 Chat-local scope 引用并触发相关材料重新验证。 |
| `mark_expired(ExpiryReason reason)` | 标记 route 过期并交给清理/恢复流程。 |
| `clear_for_logout(ClearReason reason)` | 清除本地 route/context，不写 owner。 |

#### 4.1.5 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `from_entry(EntryReference entry_ref, PlatformKind platform_kind)` | 从安全入口建立待验证的 Chat-local route。 |
| `from_restore(RestorationHint restoration_hint, PlatformKind platform_kind)` | 从本地恢复提示建立受限 route，等待正式 requery。 |

#### 4.1.6 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 把 `scope_ref` 当成授权结论 | Scope/visibility 仍由正式 owner/SDK 验证。 |
| 从 deep link 推断对象存在性 | 深链只提供入口线索，未知时 fail-closed。 |
| 把 route resolved 当业务数据 fresh | route 和材料 freshness 是不同状态轴。 |

### 4.2 `SelectionState`

#### 4.2.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | 协作体验语境 |
| 对象类型 | local state |
| 主要责任 | 保存当前 conversation/thread/Turn/Gate/Artifact/member/project 的局部选择、展开和焦点。 |

#### 4.2.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `selected_context` | `ContextReference` | 当前产品语境的安全引用。 |
| `selected_turn` | `TurnRef` | 当前 Turn 的回链引用，不保存 Turn truth。 |
| `selected_gate` | `GateRef` | 当前 GateCard 目标引用，不代表可审批。 |
| `selected_artifact` | `ArtifactRef` | 当前 Artifact 预览目标引用。 |
| `focus_target` | `FocusTarget` | 可访问焦点和键盘导航目标。 |
| `expanded_regions` | `ExpandedRegionSet` | 页面局部展开/折叠状态。 |

#### 4.2.3 状态集合

| 状态 | 作用 |
|---|---|
| `empty` | 没有当前选择。 |
| `selected` | 已有安全引用的局部选择。 |
| `stale` | 选择仍存在但来源需要刷新。 |
| `cleared` | scope/visibility/撤销或离开后清理。 |

#### 4.2.4 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `select_context(ContextReference context_ref)` | 选择当前语境引用并重置不兼容的局部焦点。 |
| `select_turn(TurnRef turn_ref)` | 选择 Turn 引用，不确认 Turn 状态。 |
| `move_focus(FocusTarget focus_target)` | 更新本地焦点目标。 |
| `clear_for_visibility_change(VisibilityChange visibility_change)` | 依据可见性变化清理受影响选择。 |

#### 4.2.5 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `empty()` | 建立无选择的初始局部状态。 |
| `from_route(RouteContext route_context)` | 从 route 建立安全选择候选，不绕过入口验证。 |

#### 4.2.6 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 将 selection 当 read receipt/attention | owner 的阅读/attention truth 不归 Chat。 |
| 以选择存在推断对象可见 | 选择需随 visibility/freshness 重新验证。 |
| 把焦点状态传播为业务状态 | focus 只影响本地可访问性和渲染。 |

### 4.3 `TurnPresentationModel`

#### 4.3.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | 协作体验语境 |
| 对象类型 | projection / presentation object |
| 主要责任 | 将 owner 提供的安全 Turn material 转成可理解的展示分类、来源和降级姿态。 |

#### 4.3.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `turn_ref` | `TurnRef` | 回链 Turn 的安全引用。 |
| `presentation_kind` | `TurnPresentationKind` | Chat 展示类别，不重新定义 Turn truth。 |
| `safe_content` | `SafeDisplayContent` | 已获准的最小展示材料。 |
| `thread_context` | `ThreadContextRef` | 线程关系和回链语境。 |
| `provenance` | `ProvenanceMetadata` | 来源、范围和版本语境。 |
| `freshness` | `FreshnessMarker` | 当前材料的新鲜度和覆盖状态。 |
| `visibility` | `MaterialVisibility` | visible/redacted/restricted/unavailable 等展示边界。 |

#### 4.3.3 状态集合

| 状态 | 作用 |
|---|---|
| `available` | 安全材料可按当前 posture 展示。 |
| `partial` | 只有部分材料或线程关系可用。 |
| `stale` | 材料可能过期，需正式变化/requery。 |
| `restricted` | scope/visibility 只允许受限显示。 |
| `unavailable` | 无法安全取得展示材料。 |

#### 4.3.4 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `apply_safe_material(SafeMaterialSnapshot safe_material)` | 应用来源绑定的安全材料。 |
| `mark_freshness(FreshnessMarker freshness_marker)` | 更新材料 freshness，不改 owner 状态。 |
| `redact(MaterialVisibility visibility)` | 按正式 visibility 结果裁剪展示内容。 |
| `to_accessible_view(AccessibilityState accessibility_state)` | 生成共享可访问语义需要的展示形态。 |

#### 4.3.5 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `from_safe_turn(TurnSafeView turn_view, ProvenanceMetadata provenance)` | 从 SDK safe view 建立展示模型；不接收 raw owner DTO。 |
| `restricted(TurnRef turn_ref, RestrictionReason reason)` | 在 visibility 不足时建立不泄露正文的受限模型。 |

#### 4.3.6 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 复制 Turn 生命周期或正文版本链 | Conversation owner 保有 truth。 |
| 从缺失字段推断 Turn 类型或作者权限 | 缺失时显示 partial/unavailable。 |
| 把渲染完成当 Turn confirmed | 业务结果由 owner receipt/result/change 门控。 |

### 4.4 `ConversationSurfaceViewModel`

#### 4.4.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | 协作体验语境 |
| 对象类型 | projection / page view model |
| 主要责任 | 组合当前协作入口、Turn 列表、线程导航、来源/新鲜度和页面降级姿态。 |

#### 4.4.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `route_context` | `RouteContext` | 当前页面语境。 |
| `access_posture` | `AccessPosture` | 页面可见/可操作姿态。 |
| `turn_items` | `TurnPresentationModel[]` | 安全 Turn 展示模型序列。 |
| `next_page_ref` | `PageReference` | 后续分页/读取边界，不等于 owner cursor truth。 |
| `change_status` | `ContinuityState` | 当前页面变化/恢复状态。 |
| `selection` | `SelectionState` | 局部选择和焦点。 |
| `degradation` | `ViewDegradation` | stale/partial/restricted/unavailable 等解释。 |

#### 4.4.3 状态集合

| 状态 | 作用 |
|---|---|
| `loading` | 正式 query 尚未完成，不能以空列表推断无内容。 |
| `ready` | 当前安全材料可解释地展示。 |
| `partial` | 只有局部页面材料可用。 |
| `stale` | 页面需要正式变化或 requery。 |
| `blocked` | 入口或材料 contract 不允许继续。 |

#### 4.4.4 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `apply_page(PageSafeView page_view)` | 应用 SDK 提供的安全页面材料。 |
| `apply_change(ChangeAcceptanceRecord change_record)` | 将已接受的正式变化映射到局部页面。 |
| `set_selection(SelectionState selection_state)` | 应用本地选择，不改 owner truth。 |
| `mark_degraded(ViewDegradation degradation)` | 显式表达页面局部不可用或过期。 |

#### 4.4.5 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `loading(RouteContext route_context)` | 建立查询中的页面模型，避免空列表误判。 |
| `from_page(PageSafeView page_view, RouteContext route_context)` | 从正式 safe view 建立页面模型。 |

#### 4.4.6 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 直接拼 owner 原始响应 | 只接受 safe view/snapshot。 |
| 以页面空/满决定 owner 存在性 | 需要正式 scope/visibility 和 query 结果。 |
| 在 view model 内写 owner truth | view model 只读/组合展示。 |

## 5. 第一组成部分停审

| 审查项 | 结论 |
|---|---|
| 对象是否来自 Step 5 capability | 是：route、selection、Turn presentation、conversation page。 |
| 字段是否为概要类型骨架 | 是；未复制 DTO/schema。 |
| 状态是否保持 Chat-local/安全展示语义 | 是；无 owner lifecycle 状态。 |
| 函数参数是否显式带类型 | 是；均采用 `TypeName param_name`。 |
| 是否有 Step 8/9 反查缺口 | 暂无；后续流程将使用 RouteContext、AccessPosture、TurnPresentationModel、ContinuityState。 |

## 6. 受控协作意图对象

### 6.1 `DraftState`

#### 6.1.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | 受控协作意图 |
| 对象类型 | local state / value object |
| 主要责任 | 表示未提交文本、安全引用、回复目标、本地校验和恢复标记。 |

#### 6.1.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `draft_ref` | `DraftRef` | 标识本地草稿，不等于 Turn/Decision/Artifact。 |
| `context_ref` | `ContextReference` | 绑定草稿所属 Chat 语境。 |
| `safe_text` | `DraftText` | 未提交文本；其持久化上限留给 03/04。 |
| `attachment_refs` | `SafeAttachmentReference[]` | 仅保存安全引用，不保存 Artifact 正文。 |
| `reply_target` | `TurnRef` | 回复目标引用，不确认其当前可见性。 |
| `validation` | `LocalValidationState` | 仅表示客户端可检查条件。 |
| `revision_hint` | `DraftRevisionHint` | 本地编辑/恢复冲突线索，不是 owner version。 |

#### 6.1.3 状态集合

| 状态 | 作用 |
|---|---|
| `empty` | 尚无草稿内容。 |
| `editing` | 用户正在编辑。 |
| `locally_valid` | 通过本地可检查条件，不代表 owner 接受。 |
| `invalid` | 本地可解释地不可提交。 |
| `submitting` | 已产生提交 attempt，仍未有 owner 结果。 |
| `restored` | 从本地安全存储恢复，仍需重新验证语境。 |
| `cleared` | 已提交确认、放弃、登出、撤销或清理。 |

#### 6.1.4 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `edit(DraftText draft_text)` | 更新本地文本并使校验/修订线索失效。 |
| `attach(SafeAttachmentReference attachment_ref)` | 添加安全附件引用，不读取正文。 |
| `set_reply_target(TurnRef turn_ref)` | 设置回复目标引用。 |
| `validate(LocalValidationPolicy validation_policy)` | 运行本地校验，不作 owner 授权或业务校验。 |
| `mark_submitting(IntentRef intent_ref)` | 关联本地 attempt，不把草稿变成 Turn。 |
| `clear(ClearReason reason)` | 清除本地草稿材料。 |

#### 6.1.5 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `empty(ContextReference context_ref)` | 为当前语境建立空草稿。 |
| `restore(DraftSnapshot snapshot, VisibilityPosture visibility)` | 从安全快照恢复并重新验证可见性。 |

#### 6.1.6 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 把草稿当作 Turn/Approval/Decision | 草稿只属于 Chat-local。 |
| 在 attachment 中保存 Artifact 正文 | 只允许安全 ref/metadata。 |
| 以 local validation 宣称可提交或已接受 | 正式校验和结果归 owner。 |

### 6.2 `CommandAttemptState`

#### 6.2.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | 受控协作意图 |
| 对象类型 | local state / history record |
| 主要责任 | 表示一次发送或治理动作从 local intent 到正式结果的客户端姿态及关联。 |

#### 6.2.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `intent_ref` | `IntentRef` | Chat-local 意图标识。 |
| `intent_kind` | `IntentKind` | 区分普通发送、重试、治理动作等类别。 |
| `context_ref` | `ContextReference` | 绑定发起语境。 |
| `idempotency_association` | `IdempotencyAssociation` | 关联正式幂等信息；具体格式待 SDK 合同。 |
| `receipt_ref` | `ReceiptRef` | 可选正式 receipt 引用，不保存 receipt 正文。 |
| `result_ref` | `ResultRef` | 可选正式 result 引用。 |
| `result_posture` | `CommandResultPosture` | 客户端对正式结果的映射状态。 |
| `next_action` | `AttemptNextAction` | query/probe/wait/retry/user-decision 等安全下一步。 |

#### 6.2.3 状态集合

| 状态 | 作用 |
|---|---|
| `draft` | 仅有本地意图，尚未发出。 |
| `submitted` | 已经由 SDK 发起，但未获得最终业务结论。 |
| `pending` | owner/SDK 明确表示结果仍在等待。 |
| `confirmed` | 正式 owner receipt/result/change 满足成功门控。 |
| `rejected` | 正式结果明确拒绝意图。 |
| `failed` | 正式失败且可解释是否允许重新尝试。 |
| `unknown` | 无法安全判断副作用是否成立，禁止自动重放。 |

#### 6.2.4 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `mark_submitted(CommandSubmission submission)` | 记录正式发起已发生，不宣称业务确认。 |
| `apply_receipt(CommandReceiptView receipt_view)` | 应用安全 receipt 视图并交给结果门控。 |
| `apply_result(CommandResultView result_view)` | 应用正式结果并更新 result posture。 |
| `mark_unknown(UnknownEffectReason reason)` | 进入 unknown 并计算非重放下一步。 |
| `choose_next_action(AttemptNextAction next_action)` | 记录用户/系统选择的安全后续动作。 |

#### 6.2.5 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `from_draft(IntentRef intent_ref, IntentKind intent_kind, ContextReference context_ref)` | 建立尚未提交的 attempt。 |
| `restore(AttemptSnapshot snapshot, FormalProbeResult probe_result)` | 从本地快照和正式探测结果恢复 posture。 |

#### 6.2.6 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 以 transport ACK 进入 `confirmed` | 必须通过正式结果门控。 |
| unknown 自动重放 | 只允许 query/probe/wait/user decision。 |
| 把本地 attempt 当 owner receipt/audit | attempt 只提供客户端关联。 |

### 6.3 `CommandResultGate`

#### 6.3.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | 受控协作意图 |
| 对象类型 | policy / guard |
| 主要责任 | 根据正式 receipt/result/change 和命令类别决定客户端是否可进入 confirmed/rejected/failed/unknown。 |

#### 6.3.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `intent_kind` | `IntentKind` | 选择对应的结果门控规则。 |
| `required_authority` | `ResultAuthorityKind` | 指明该动作接受何种正式结果来源。 |
| `unknown_policy` | `UnknownEffectPolicy` | 指定未知结果的安全后续姿态。 |
| `replay_policy` | `ReplaySafetyPolicy` | 默认禁止副作用自动重放。 |

#### 6.3.3 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `evaluate(CommandAttemptState attempt, FormalResultMaterial result_material)` | 评估正式材料是否满足结果状态迁移。 |
| `accepts_authority(ResultAuthority authority)` | 检查结果是否来自该命令允许的正式来源。 |
| `resolve_unknown(CommandAttemptState attempt, FormalProbeResult probe_result)` | 根据正式探测结果保持 unknown 或收敛。 |
| `allows_retry(CommandAttemptState attempt, RetryCapability retry_capability)` | 判断是否有正式依据允许新 attempt。 |

#### 6.3.4 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `for_intent(IntentKind intent_kind, ResultAuthorityKind authority_kind)` | 为意图类别建立门控 policy。 |

#### 6.3.5 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 配置关闭结果门控 | 结果门控是不可配置化边界。 |
| 接受 toast/通知/连接状态为 authority | 它们都不是正式业务结果。 |
| 在 policy 内执行 owner command | policy 只判断，不产生副作用。 |

### 6.4 `IntentFeedbackViewModel`

#### 6.4.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | 受控协作意图 |
| 对象类型 | projection / page view model |
| 主要责任 | 把 attempt、正式结果来源、下一步和可访问说明映射为页面反馈。 |

#### 6.4.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `intent_ref` | `IntentRef` | 回链本地 attempt。 |
| `status` | `CommandResultPosture` | 显示 submitted/pending/confirmed/rejected/failed/unknown。 |
| `authority_ref` | `ResultRef` | 可选正式结果引用。 |
| `safe_reason` | `SafeReasonSummary` | 可向用户披露的原因摘要。 |
| `next_actions` | `AttemptNextAction[]` | 允许的 query/probe/retry/wait/user decision。 |
| `announcement` | `StatusAnnouncement` | 可访问状态公告。 |

#### 6.4.3 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `apply_attempt(CommandAttemptState attempt_state)` | 映射本地 attempt 到页面反馈。 |
| `apply_safe_reason(SafeReasonSummary reason_summary)` | 更新可披露原因，不泄露隐藏对象。 |
| `set_next_actions(AttemptNextActionSet action_set)` | 设置安全下一步集合。 |

#### 6.4.4 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 在文案层改变业务状态 | 反馈只解释既有状态。 |
| 显示 raw error/body | 只接受脱敏、安全摘要。 |
| 把 retry 入口等同于可安全重放 | retry 需要正式 capability/guard。 |

## 7. 受控协作意图停审

| 审查项 | 结论 |
|---|---|
| Draft、attempt、result gate、feedback 是否均有 capability 来源 | 是。 |
| local 与 owner 结果是否分离 | 是；Receipt/Result 仅为引用/安全材料。 |
| unknown 和重试边界是否清楚 | 是；默认禁止自动重放。 |
| Step 8/9 预期对象是否已定义 | 是；发送/治理流程使用 DraftState、CommandAttemptState、CommandResultGate、IntentFeedbackViewModel。 |

## 8. 安全语境与导航对象

### 8.1 `AccessPosture`

#### 8.1.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | 安全语境与导航 |
| 对象类型 | state enum / value object |
| 主要责任 | 表示 Chat 在正式 actor/scope/visibility 结果下的入口和操作姿态。 |

#### 8.1.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `availability` | `AvailabilityState` | available/restricted/unavailable/blocked。 |
| `operation_mode` | `OperationMode` | interactive/read-only/hidden/needs-action。 |
| `visibility_ref` | `VisibilityResultRef` | 正式 visibility 结果引用。 |
| `reason` | `SafeReasonSummary` | 不泄露隐藏事实的安全原因。 |

#### 8.1.3 状态集合

| 状态 | 作用 |
|---|---|
| `available` | 可以在正式语境下进入和按 capability 操作。 |
| `read_only` | 可读但不具备当前操作资格。 |
| `restricted` | 只能展示受限材料或入口说明。 |
| `unavailable` | 依赖/能力暂不可用。 |
| `blocked` | 继续将越过安全或 contract 边界。 |
| `hidden` | 正式结果要求不暴露入口/材料。 |

#### 8.1.4 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `allows_view(ViewCapability view_capability)` | 判断当前 posture 是否允许展示指定安全视图。 |
| `allows_intent(IntentCapability intent_capability)` | 判断当前 posture 是否允许显示受控意图入口。 |
| `restrict(SafeReasonSummary reason_summary)` | 收紧 posture，不扩大权限。 |
| `revoke(VisibilityChange visibility_change)` | 响应正式撤销并进入 hidden/restricted。 |

#### 8.1.5 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `from_visibility(VisibilityResultView visibility_result)` | 从正式 visibility 安全视图建立 posture。 |
| `blocked(BlockReason block_reason)` | 在 contract 或安全条件不足时建立 fail-closed posture。 |

#### 8.1.6 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 从本地 role/route 推断权限 | 必须依赖正式结果。 |
| 把 unavailable 当 not-found | 避免泄露对象存在性。 |
| 配置提升 operation mode | 平台/feature 配置不能授予权限。 |

### 8.2 `VisibilityGuard`

#### 8.2.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | 安全语境与导航 |
| 对象类型 | policy / guard |
| 主要责任 | 对 route、safe material、cache 和操作入口执行统一 fail-closed 可见性守卫。 |

#### 8.2.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `actor_context_ref` | `ActorContextRef` | 当前正式 actor 语境引用。 |
| `scope_ref` | `ScopeRef` | 当前 scope 引用。 |
| `visibility_result_ref` | `VisibilityResultRef` | 正式 visibility 结果引用。 |
| `unknown_behavior` | `UnknownVisibilityBehavior` | 固定为 fail-closed 类别。 |

#### 8.2.3 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `evaluate_entry(EntryReference entry_ref, VisibilityResultView visibility_result)` | 判断入口 posture。 |
| `evaluate_material(SafeMaterialSnapshot safe_material, RouteContext route_context)` | 判断材料是否可在当前 route 展示。 |
| `evaluate_cache(LocalProjectionEntry projection_entry, VisibilityResultView visibility_result)` | 判断缓存可继续显示、需遮蔽或清理。 |
| `evaluate_intent(IntentCapability intent_capability, AccessPosture access_posture)` | 判断操作入口是否可显示。 |

#### 8.2.4 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `for_context(ActorContextRef actor_ref, ScopeRef scope_ref)` | 为当前正式语境建立守卫。 |

#### 8.2.5 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 从缓存、空列表、错误差异推断 visibility | 未知必须收紧。 |
| 在 guard 内访问私有 owner API | 只消费 SDK 正式结果。 |
| 把 UI 隐藏当安全边界完成 | guard 还必须驱动 projection 清理/遮蔽。 |

## 9. 安全语境与导航停审

| 审查项 | 结论 |
|---|---|
| RouteContext、AccessPosture、VisibilityGuard 是否职责分离 | 是：route 是本地语境，posture 是结果映射，guard 是 policy。 |
| 是否创建身份/授权 shadow truth | 否。 |
| 清理/撤销是否有后续对象承接 | 是；Recovery/LocalProjection/CacheLifecycle 将承接。 |
| Step 8/9 是否可反查 | 是；入口、visibility 变化和清理流使用这些对象。 |

## 10. 变化与恢复连续性对象

### 10.1 `ContinuityState`

#### 10.1.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | 变化与恢复连续性 |
| 对象类型 | state enum / local state |
| 主要责任 | 表示当前 safe material/change/resume 的客户端连续性姿态，与命令结果和平台连接状态分离。 |

#### 10.1.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `phase` | `ContinuityPhase` | fresh/stale/gap/reconnecting/resuming/blocked 等阶段。 |
| `source_ref` | `ChangeSourceRef` | 正式变化来源引用。 |
| `cursor_ref` | `ChangeCursorRef` | SDK consumer 范围的恢复引用，不暴露 bus offset。 |
| `gap_ref` | `GapRef` | 可选缺口引用。 |
| `last_accepted_revision` | `RevisionMarker` | 本地已接受变化的来源水位。 |
| `next_action` | `RecoveryNextAction` | resume/requery/wait/clear/needs-action。 |

#### 10.1.3 状态集合

| 状态 | 作用 |
|---|---|
| `fresh` | 当前材料与正式来源在已知水位内一致。 |
| `stale` | 材料可能落后，需要正式 resume/requery。 |
| `gap` | 检测到缺口，暂停将后续变化视为连续。 |
| `reconnecting` | 技术连接恢复中，但不代表业务状态恢复。 |
| `resuming` | 正在通过正式 resume/requery 收敛。 |
| `restricted` | 可见性/范围变化要求收紧展示。 |
| `blocked` | contract 或安全条件不足，不能继续。 |
| `needs_action` | 需要用户或支持角色采取明确下一步。 |

#### 10.1.4 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `accept(ChangeAcceptanceRecord change_record)` | 接受已通过来源/幂等检查的变化。 |
| `mark_gap(GapRef gap_ref)` | 标记缺口并阻止连续性伪装为 fresh。 |
| `begin_resume(ResumeContext resume_context)` | 进入正式恢复阶段。 |
| `apply_resume_result(ResumeResultView resume_result)` | 根据正式结果收敛或保持 blocked/partial。 |
| `restrict(VisibilityChange visibility_change)` | 处理撤销/范围变化并触发清理。 |

#### 10.1.5 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `initial(ChangeSourceRef source_ref)` | 建立尚未确定 fresh 的初始连续性状态。 |
| `from_cache(LocalProjectionEntry projection_entry)` | 从缓存建立 stale/needs-validation 姿态。 |

#### 10.1.6 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 将 reconnecting 等同于 fresh | 连接恢复不是业务变化恢复。 |
| 使用墙上时间排序正式变化 | 顺序只依据 SDK 正式来源/水位语义。 |
| 将 cursor_ref 当 bus offset 或 owner revision truth | 只是 SDK consumer 恢复边界。 |

### 10.2 `ResumeContext`

#### 10.2.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | 变化与恢复连续性（canonical owner） |
| 对象类型 | context object / reference object |
| 主要责任 | 保存恢复所需的安全语境、来源水位、gap/unknown 线索和允许的恢复动作。 |

#### 10.2.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `context_ref` | `ContextReference` | 要恢复的协作语境。 |
| `source_ref` | `ChangeSourceRef` | 正式变化来源。 |
| `cursor_ref` | `ChangeCursorRef` | SDK 提供的恢复引用候选。 |
| `visibility_ref` | `VisibilityResultRef` | 恢复时必须重新验证的可见性结果引用。 |
| `pending_attempts` | `IntentRef[]` | 需要 probe/query 的未知 attempt 引用。 |
| `recovery_reason` | `RecoveryReason` | reconnect/restart/gap/expired/revoked 等原因。 |
| `allowed_actions` | `RecoveryNextAction[]` | 只列正式允许的 resume/requery/clear/wait/user-action。 |

#### 10.2.3 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `add_unknown_attempt(IntentRef intent_ref)` | 将 unknown attempt 纳入恢复探测，不自动重放。 |
| `replace_cursor(ChangeCursorRef cursor_ref)` | 用正式恢复结果更新 consumer cursor 引用。 |
| `require_requery(RequeryReason reason)` | 标记需要正式查询而不是事件补齐。 |
| `restrict_for_visibility(VisibilityResultView visibility_result)` | 收紧恢复材料和允许动作。 |

#### 10.2.4 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `for_gap(ContextReference context_ref, GapRef gap_ref, ChangeCursorRef cursor_ref)` | 为变化缺口建立恢复上下文。 |
| `for_restart(RestorationHint restoration_hint, VisibilityResultRef visibility_ref)` | 为 Desktop 重启建立待验证恢复上下文。 |

#### 10.2.5 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 保存完整 owner event/payload | 只保存安全 ref/水位/原因。 |
| 将本地 pending attempt 解释为已提交 | 需要正式 probe/result。 |
| 由 LocalProjectionEntry 定义第二份 ResumeContext | 本对象是 canonical owner，投影只保存安全子集。 |

### 10.3 `ChangeAcceptanceRecord`

#### 10.3.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | 变化与恢复连续性 |
| 对象类型 | audit/history record（Chat-local） |
| 主要责任 | 记录一条 formal change 在客户端是否被接受、忽略或触发 gap/requery，以支持幂等 reducer。 |

#### 10.3.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `change_ref` | `ChangeReference` | 正式变化引用。 |
| `source_ref` | `ChangeSourceRef` | 变化来源。 |
| `revision_marker` | `RevisionMarker` | SDK/owner 给出的顺序或水位语境。 |
| `acceptance` | `ChangeAcceptanceKind` | accepted/duplicate/out_of_order/gap/restricted/ignored。 |
| `affected_contexts` | `ContextReference[]` | 受影响的 Chat-local 语境引用。 |
| `safe_reason` | `SafeReasonSummary` | 可安全解释的接受/拒绝原因。 |

#### 10.3.3 状态集合

| 状态 | 作用 |
|---|---|
| `accepted` | 允许 reducer 应用到局部 projection。 |
| `duplicate` | 已处理，不再次应用。 |
| `out_of_order` | 顺序无法安全合并，需等待或 requery。 |
| `gap` | 检测到缺口，进入恢复。 |
| `restricted` | 可见性或 scope 变化只允许清理/遮蔽。 |
| `ignored` | 对当前页面无影响，但仍保留最小幂等线索。 |

#### 10.3.4 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `can_apply()` | 判断该记录是否允许更新 local projection。 |
| `requires_resume()` | 判断是否需要 resume/requery。 |
| `requires_cleanup()` | 判断是否需要 visibility 清理。 |

#### 10.3.5 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `evaluate(FormalChangeView change_view, ContinuityState continuity_state)` | 依据正式来源/水位建立接受记录。 |

#### 10.3.6 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 充当 owner event log | 只记录客户端接受姿态。 |
| 保存 raw event body | 仅引用和安全原因。 |
| 以 arrival time 决定 acceptance | 必须使用正式 revision/cursor 语义。 |

### 10.4 `RecoveryViewModel`

#### 10.4.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | 变化与恢复连续性 |
| 对象类型 | projection / page view model |
| 主要责任 | 向用户解释断线、gap、cursor expired、重启、unknown 和下一步。 |

#### 10.4.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `continuity` | `ContinuityState` | 当前连续性姿态。 |
| `restored_material` | `SafeMaterialSnapshot[]` | 可安全展示的恢复材料。 |
| `unknown_attempts` | `IntentFeedbackViewModel[]` | 需要 query/probe/用户决定的意图。 |
| `next_actions` | `RecoveryNextAction[]` | 正式允许的恢复动作。 |
| `announcement` | `StatusAnnouncement` | 可访问恢复公告。 |

#### 10.4.3 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `apply_continuity(ContinuityState continuity_state)` | 更新恢复页面 posture。 |
| `attach_restored_material(SafeMaterialSnapshot safe_material)` | 添加受限恢复材料。 |
| `set_unknown_attempts(CommandAttemptStateSet attempts)` | 显示未知副作用的安全下一步。 |

#### 10.4.4 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 将缓存恢复显示为 current fresh truth | 需标记 stale/needs-validation。 |
| 提供隐式自动重放按钮 | unknown 需正式 probe/capability。 |
| 泄露不可见对象存在性 | 使用安全原因和受限姿态。 |

## 11. 变化与恢复连续性停审

| 审查项 | 结论 |
|---|---|
| Continuity、Resume、Acceptance、Recovery 是否各有唯一责任 | 是。 |
| `ResumeContext` canonical owner 是否明确 | 是；归变化与恢复连续性。 |
| 是否把 bus delivery/owner event history 带入 Chat | 否。 |
| Step 8/9 预期对象是否已定义 | 是；formal change、resume、gap、restart、unknown 流均有对象承接。 |

## 12. 平台体验与可访问性对象

### 12.1 `PlatformCapabilityState`

#### 12.1.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | 平台体验与可访问性 |
| 对象类型 | local state / capability projection |
| 主要责任 | 表示窗口、通知、存储、深链、文件选择、网络提示等宿主能力是否可用。 |

#### 12.1.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `platform_kind` | `PlatformKind` | 当前宿主类别。 |
| `capability_kind` | `PlatformCapabilityKind` | 被查询的宿主能力。 |
| `availability` | `CapabilityAvailability` | available/restricted/unavailable/needs-action。 |
| `safe_reason` | `SafeReasonSummary` | 可展示的能力缺失原因。 |
| `lifecycle_posture` | `ShellLifecyclePosture` | active/background/suspended/restoring 等宿主姿态。 |

#### 12.1.3 状态集合

| 状态 | 作用 |
|---|---|
| `available` | 能力可被平台 adapter 使用。 |
| `restricted` | 能力受宿主权限/策略限制。 |
| `unavailable` | 当前宿主不提供能力。 |
| `needs_action` | 需要用户完成宿主级动作。 |
| `unknown` | 无法确定能力，必须保守处理。 |

#### 12.1.4 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `allows(PlatformAction platform_action)` | 判断是否允许发起宿主动作。 |
| `mark_unavailable(SafeReasonSummary reason_summary)` | 标记宿主能力缺失。 |
| `apply_lifecycle(ShellLifecyclePosture lifecycle_posture)` | 更新宿主生命周期姿态，不改变业务状态。 |

#### 12.1.5 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `from_capability_probe(PlatformCapabilityProbe probe)` | 从平台 adapter 的能力探测建立状态。 |

#### 12.1.6 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 将 platform available 当业务可操作 | 仍需 AccessPosture/owner capability。 |
| 将 notification delivered 当 command confirmed | 宿主送达不是业务结果。 |
| 以平台差异改变 shared state enum | 只能映射为 capability posture。 |

### 12.2 `AccessibilityState`

#### 12.2.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | 平台体验与可访问性 |
| 对象类型 | local state / context object |
| 主要责任 | 保存焦点、展开、播报和辅助技术偏好的 Chat-local 状态。 |

#### 12.2.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `focus_target` | `FocusTarget` | 当前可访问焦点。 |
| `focus_order` | `FocusOrder` | 当前页面的语义焦点顺序。 |
| `announcement_queue` | `StatusAnnouncement[]` | 待播报的安全状态。 |
| `motion_preference` | `MotionPreference` | 只影响表现，不改业务状态。 |
| `assistive_capabilities` | `AssistiveCapabilitySet` | 当前宿主可用的辅助技术能力。 |

#### 12.2.3 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `move_focus(FocusTarget focus_target)` | 更新局部焦点。 |
| `enqueue(StatusAnnouncement announcement)` | 加入安全状态公告。 |
| `clear_for_route(RouteContext route_context)` | 路由变化后清理不兼容焦点/公告。 |
| `apply_capabilities(AssistiveCapabilitySet capabilities)` | 应用宿主辅助技术能力。 |

#### 12.2.4 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `for_page(PageSemanticModel page_model)` | 从页面语义建立初始焦点和公告上下文。 |

#### 12.2.5 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 另造与页面不同的业务状态 | 可访问表达必须共享同一状态语义。 |
| 公告 raw error/body | 只播报脱敏、安全状态。 |
| 通过焦点/展开触发 owner 写入 | 可访问状态只在客户端变化。 |

### 12.3 `StatusAnnouncement`

#### 12.3.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | 平台体验与可访问性 |
| 对象类型 | projection / value object |
| 主要责任 | 将结果、恢复、限制和错误姿态转换为安全、可去重的辅助技术公告。 |

#### 12.3.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `announcement_kind` | `AnnouncementKind` | result/recovery/restriction/error/navigation 等类别。 |
| `safe_message` | `SafeAnnouncementText` | 不泄露正文/隐藏对象的公告内容。 |
| `priority` | `AnnouncementPriority` | 公告优先级，不表示业务优先级。 |
| `dedupe_key` | `AnnouncementDedupeKey` | 防止重复变化造成重复播报。 |
| `source_ref` | `LocalStateReference` | 回链产生公告的 Chat-local 状态。 |

#### 12.3.3 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `same_semantics(StatusAnnouncement other)` | 判断两个公告是否语义重复。 |
| `redact(MaterialVisibility visibility)` | 在可见性收紧时裁剪公告。 |

#### 12.3.4 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `from_attempt(CommandAttemptState attempt_state)` | 从命令姿态建立公告。 |
| `from_continuity(ContinuityState continuity_state)` | 从恢复姿态建立公告。 |
| `from_access(AccessPosture access_posture)` | 从入口/可见性姿态建立公告。 |

#### 12.3.5 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 公告内容成为状态 authority | 公告只是 projection。 |
| 泄露对象名、正文或未脱敏错误 | 使用 safe message 和可见性裁剪。 |
| 以播报完成推进流程 | 播报只影响用户体验。 |

## 13. 平台体验与可访问性停审

| 审查项 | 结论 |
|---|---|
| 平台 capability 与业务 capability 是否分离 | 是。 |
| 可访问状态是否共享业务语义 | 是；公告从既有状态投影。 |
| 是否锁定具体平台/框架 API | 否。 |
| Step 8/9 是否可反查 | 是；shell lifecycle、notification/deep-link、focus/announcement 均有对象承接。 |

## 14. owner-safe 材料镜像对象

### 14.1 `SafeMaterialSnapshot`

#### 14.1.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | owner-safe 材料镜像 |
| 对象类型 | projection / read model |
| 主要责任 | 承载经过正式 SDK/owner 边界裁剪的 body-free 展示材料及其来源语境。 |

#### 14.1.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `material_ref` | `MaterialReference` | Chat-local 材料标识。 |
| `owner_reference` | `OwnerReference` | 回链正式 owner 对象，不转移 truth。 |
| `safe_summary` | `SafeSummary` | 允许展示的最小摘要。 |
| `provenance` | `ProvenanceMetadata` | 来源、scope、visibility、revision 和生成语境。 |
| `freshness` | `FreshnessMarker` | fresh/stale/partial/unknown 等来源水位姿态。 |
| `preview_reference` | `PreviewReference` | 可选正式预览入口。 |
| `disclosure` | `DisclosurePosture` | visible/redacted/restricted/unavailable。 |

#### 14.1.3 状态集合

| 状态 | 作用 |
|---|---|
| `fresh` | 在已知来源水位和范围内可解释。 |
| `stale` | 可能落后，需要正式变化/requery。 |
| `partial` | 只覆盖部分材料/字段/范围。 |
| `restricted` | visibility 或 policy 只允许受限显示。 |
| `unavailable` | 没有可安全显示的材料。 |
| `cleared` | 撤销/登出/过期后不再持有。 |

#### 14.1.4 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `apply_provenance(ProvenanceMetadata provenance_metadata)` | 绑定来源、范围和版本语境。 |
| `mark_stale(FreshnessMarker freshness_marker)` | 标记材料过期/部分。 |
| `restrict(DisclosurePosture disclosure_posture)` | 收紧展示而不扩大可见性。 |
| `clear(ClearReason clear_reason)` | 清除本地材料。 |

#### 14.1.5 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `from_safe_view(SafeOwnerView safe_owner_view, ProvenanceMetadata provenance_metadata)` | 从正式 safe view 建立 snapshot。 |
| `unavailable(OwnerReference owner_reference, SafeReasonSummary reason_summary)` | 在无安全材料时建立不泄露正文的占位。 |

#### 14.1.6 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 保存 raw owner body | 本对象只能持有 safe summary/ref/preview。 |
| 从 snapshot 推断 owner lifecycle | snapshot 只表达当前可消费材料。 |
| 省略 provenance/freshness | 不能把快照误当 current truth。 |

### 14.2 `OwnerReference`

#### 14.2.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | owner-safe 材料镜像 |
| 对象类型 | reference object / boundary value |
| 主要责任 | 提供 owner 对象的安全回链和引用分类，不复制对象正文、权限或生命周期。 |

#### 14.2.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `owner_kind` | `OwnerKind` | conversation/turn/member/project/gate/artifact/workspace/runtime 等引用类别。 |
| `opaque_ref` | `OpaqueOwnerRef` | 由 SDK/owner 提供的不可推断引用。 |
| `scope_ref` | `ScopeRef` | 引用适用范围。 |
| `visibility_hint` | `VisibilityResultRef` | 可选正式 visibility 关联。 |
| `version_hint` | `RevisionMarker` | 可选来源版本/水位。 |

#### 14.2.3 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `same_owner(OwnerReference other)` | 判断引用是否指向同一 owner scope 下的对象。 |
| `requires_revalidation(VisibilityResultView visibility_result)` | 判断是否需要重新验证引用。 |
| `redact(DisclosurePosture disclosure_posture)` | 在不可见时保留最小安全引用或清理。 |

#### 14.2.4 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `from_sdk_ref(SdkSafeReference sdk_safe_reference)` | 从正式 SDK 安全引用建立 boundary object。 |

#### 14.2.5 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 由 Chat 生成可被 owner 接受的伪引用 | 引用必须来自正式 SDK/owner。 |
| 通过引用名称推断正文、存在性或权限 | 引用只用于回链。 |
| 把引用当本地实体主键 | 不建立 shadow entity 生命周期。 |

### 14.3 `ProvenanceMetadata`

#### 14.3.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | owner-safe 材料镜像 |
| 对象类型 | value object / boundary metadata |
| 主要责任 | 记录材料来自哪个正式边界、scope、visibility、版本/水位和覆盖范围。 |

#### 14.3.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `source_kind` | `SourceKind` | query/result/change/ref/preview 等来源类别。 |
| `source_ref` | `SourceReference` | 来源引用。 |
| `scope_ref` | `ScopeRef` | 材料适用 scope。 |
| `visibility_ref` | `VisibilityResultRef` | 正式可见性语境。 |
| `revision_marker` | `RevisionMarker` | 版本/水位。 |
| `coverage` | `MaterialCoverage` | 材料覆盖范围和缺口。 |

#### 14.3.3 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `is_compatible_with(RouteContext route_context)` | 判断材料是否适用于当前 Chat route。 |
| `compare_revision(ProvenanceMetadata other)` | 以正式 revision/watermark 语义比较来源，不使用墙上时间。 |
| `restrict(VisibilityResultView visibility_result)` | 根据最新 visibility 收紧元数据和材料。 |

#### 14.3.4 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `from_query(QuerySourceMetadata source_metadata)` | 从 query 结果元数据建立 provenance。 |
| `from_change(FormalChangeMetadata change_metadata)` | 从 formal change 建立 provenance。 |

#### 14.3.5 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 用本地 arrival time 代替 revision | 顺序/新鲜度必须来源于正式语义。 |
| 删除 visibility/scope 信息后缓存材料 | 不能安全判断可展示范围。 |
| 将 provenance 当审计证据 | Observability/audit truth 归外部 owner。 |

### 14.4 `FreshnessMarker`

#### 14.4.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | owner-safe 材料镜像 |
| 对象类型 | state/value object |
| 主要责任 | 表示安全材料相对正式来源的 fresh/stale/partial/unknown 状态。 |

#### 14.4.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `state` | `FreshnessState` | freshness 主状态。 |
| `revision_marker` | `RevisionMarker` | 已知来源水位。 |
| `observed_at` | `ObservationMarker` | 客户端观察标记，不等于业务时间。 |
| `gap_ref` | `GapRef` | 可选缺口引用。 |

#### 14.4.3 状态集合

| 状态 | 作用 |
|---|---|
| `fresh` | 在已知来源语境内可直接展示。 |
| `stale` | 可能落后，需 requery/resume。 |
| `partial` | 覆盖不完整。 |
| `unknown` | 无法安全判断新鲜度。 |
| `expired` | 已超过正式可用范围，应清理或重新查询。 |

#### 14.4.4 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `mark_stale(StalenessReason reason)` | 进入 stale/unknown。 |
| `is_displayable(AccessPosture access_posture)` | 结合 visibility 判断是否可显示。 |
| `requires_requery()` | 判断是否需要正式查询。 |

#### 14.4.5 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `from_revision(RevisionMarker revision_marker, FreshnessState state)` | 从正式版本/水位建立 freshness。 |

#### 14.4.6 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 用网络连接状态代替 freshness | 连接可用不代表材料最新。 |
| 用 cache hit 标记 fresh | 缓存必须保留来源水位。 |
| 由 freshness 推断 owner 完成 | freshness 只表示材料相对来源的状态。 |

### 14.5 `PreviewReference`

#### 14.5.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | owner-safe 材料镜像 |
| 对象类型 | reference object / projection |
| 主要责任 | 表示 Artifact 或其他安全预览入口的引用、可用性和限制，不持有正文。 |

#### 14.5.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `owner_reference` | `OwnerReference` | 预览目标安全引用。 |
| `preview_kind` | `PreviewKind` | 允许的预览类别。 |
| `availability` | `PreviewAvailability` | available/unavailable/restricted/pending。 |
| `version_hint` | `RevisionMarker` | 预览对应版本语境。 |
| `safe_summary` | `SafeSummary` | 可直接展示的最小摘要。 |

#### 14.5.3 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `mark_unavailable(SafeReasonSummary reason_summary)` | 标记不可安全预览。 |
| `is_openable(AccessPosture access_posture)` | 判断是否可显示打开/下载入口。 |
| `bind_result(PreviewResultView preview_result)` | 绑定正式预览结果引用。 |

#### 14.5.4 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `from_safe_ref(OwnerReference owner_reference, PreviewCapability capability)` | 从正式安全引用建立预览边界。 |

#### 14.5.5 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 读取/缓存 Artifact raw body | 正文和血缘归 Artifact owner。 |
| 以预览成功推断 Artifact 状态 | 预览只表示展示能力。 |
| 用文件名/扩展名绕过 visibility | 必须经过正式安全预览能力。 |

## 15. owner-safe 材料镜像停审

| 审查项 | 结论 |
|---|---|
| 是否保留 source/scope/visibility/revision/freshness | 是；SafeMaterialSnapshot/ProvenanceMetadata/FreshnessMarker 分离承接。 |
| 是否复制 owner body/schema | 否。 |
| 是否把 preview/ref 当 truth | 否；只作安全展示入口。 |
| Step 7/8/9 预期对象是否已定义 | 是；Query/Preview/Change/Visibility 处理均可反查。 |

## 16. 本地展示与恢复投影对象

### 16.1 `LocalProjectionEntry`

#### 16.1.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | 本地展示与恢复投影 |
| 对象类型 | local projection / persistence boundary |
| 主要责任 | 保存来源绑定的最小安全展示材料、Chat-local 状态索引和失效元数据。 |

#### 16.1.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `cache_key_ref` | `CacheKeyRef` | 本地缓存索引引用。 |
| `context_ref` | `ContextReference` | 绑定 Chat 语境。 |
| `material_snapshot` | `SafeMaterialSnapshot` | 可缓存的安全材料子集。 |
| `draft_state` | `DraftState` | 可选未提交草稿安全子集。 |
| `selection_state` | `SelectionState` | 可选局部选择/焦点安全子集。 |
| `resume_context` | `ResumeContext` | 只保存可持久化安全字段，不拥有 canonical 全量。 |
| `retention_marker` | `RetentionMarker` | 留存/失效姿态。 |

#### 16.1.3 状态集合

| 状态 | 作用 |
|---|---|
| `absent` | 没有本地材料。 |
| `cached` | 有安全缓存，但仍需 freshness/visibility 验证。 |
| `restored` | 已恢复到页面，但不表示 current fresh。 |
| `stale` | 来源可能落后。 |
| `restricted` | 只能受限展示。 |
| `evicting` | 正在清理/裁剪。 |
| `cleared` | 已删除或不可恢复。 |

#### 16.1.4 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `store(SafeMaterialSnapshot safe_material, PersistenceSafetyGuard safety_guard)` | 按安全守卫写入最小材料。 |
| `restore(VisibilityGuard visibility_guard)` | 恢复后重新验证可见性。 |
| `mark_stale(FreshnessMarker freshness_marker)` | 标记来源落后。 |
| `evict(EvictionReason eviction_reason)` | 清理受影响材料。 |

#### 16.1.5 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `from_safe_material(SafeMaterialSnapshot safe_material, ContextReference context_ref)` | 建立可缓存 projection。 |
| `from_draft(DraftState draft_state, ContextReference context_ref)` | 建立草稿恢复 projection。 |

#### 16.1.6 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 以缓存命中当 current truth | 必须重新验证来源/visibility/freshness。 |
| 保存凭据/secret/raw body | 由 PersistenceSafetyGuard 阻止。 |
| 将本地 projection 写回 owner | 仅供 Chat-local 展示和恢复。 |

### 16.2 `CacheLifecycleRecord`

#### 16.2.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | 本地展示与恢复投影 |
| 对象类型 | local audit/history record |
| 主要责任 | 记录缓存创建、刷新、失效、裁剪和清理的低敏生命周期线索。 |

#### 16.2.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `cache_key_ref` | `CacheKeyRef` | 本地缓存引用。 |
| `lifecycle_kind` | `CacheLifecycleKind` | stored/refreshed/stale/evicted/cleared/restricted。 |
| `reason` | `SafeReasonSummary` | 低敏清理/失效原因。 |
| `source_revision` | `RevisionMarker` | 可选来源水位。 |
| `occurred_at` | `LocalObservationMarker` | 客户端本地观察时间，不是业务事实。 |

#### 16.2.3 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `is_safe_for_diagnostics()` | 判断是否只含低敏诊断可用信息。 |
| `requires_followup()` | 判断是否需要重新查询/清理提示。 |

#### 16.2.4 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `from_eviction(CacheKeyRef cache_key_ref, EvictionReason reason)` | 建立清理生命周期记录。 |

#### 16.2.5 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 充当 Observability audit/evidence | 仅是 Chat-local 低敏材料。 |
| 包含 raw key/body/credential | 只使用安全引用和原因类别。 |
| 证明 owner 业务状态 | 缓存生命周期与 owner truth 无关。 |

### 16.3 `PersistenceSafetyGuard`

#### 16.3.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | 本地展示与恢复投影 |
| 对象类型 | policy / guard |
| 主要责任 | 在本地写入前判断材料是否满足 body-free、visibility、scope、清理和敏感值约束。 |

#### 16.3.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `storage_scope` | `StorageScopeRef` | 本地存储语境。 |
| `disclosure_policy` | `MaterialDisclosurePolicy` | 允许持有的材料类别。 |
| `retention_policy` | `CacheRetentionPolicy` | 留存/失效类别。 |
| `clear_triggers` | `ClearTriggerSet` | logout/revoke/expiry/scope-change 等清理触发。 |

#### 16.3.3 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `allows(SafeMaterialSnapshot safe_material)` | 判断材料是否可本地持有。 |
| `requires_clear(VisibilityChange visibility_change)` | 判断现有材料是否必须清理。 |
| `redact_for_storage(SafeMaterialSnapshot safe_material)` | 生成最小可持有材料。 |

#### 16.3.4 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `for_storage(StorageScopeRef storage_scope, MaterialDisclosurePolicy disclosure_policy)` | 建立本地持有守卫。 |

#### 16.3.5 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 配置关闭敏感材料清理 | 清理/最小披露是硬边界。 |
| 以离线模式绕过 visibility | 离线材料仍需来源和语境绑定。 |
| 记录 credential/token/secret | 明确禁止进入 Chat 持有面。 |

## 17. 本地展示与恢复投影停审

| 审查项 | 结论 |
|---|---|
| projection、cache lifecycle、persistence guard 是否分工清楚 | 是。 |
| 是否明确 `ResumeContext` canonical owner 与本地子集 | 是。 |
| 是否支持离线业务写入/审批 | 否；仅展示、草稿、恢复和清理。 |
| Step 7/8/9/11 预期对象是否已定义 | 是。 |

## 18. 跨对象 / 跨组成部分一致性审计

| 审计项 | 结论 | 说明 |
|---|---|---|
| Step 5 标记为必须独立展开的对象是否均有独立节 | 是 | 关键 Chat-local state、policy、projection、reference、history 均已逐项处理；被排除者有明确原因。 |
| 是否存在同名对象多重 canonical owner | 无 unresolved | `ResumeContext` 归变化/恢复；`LocalProjectionEntry` 只保存安全子集；`ProvenanceMetadata` 归材料镜像。 |
| 是否把 `TurnRef`/`ArtifactRef` 等引用误写成领域实体 | 否 | 仅作为字段类型/边界引用。 |
| Step 8 关键流将使用的对象是否全部已定义 | 是 | Entry query、send/治理 command、safe preview、change reducer、resume/requery、cache eviction 均可反查。 |
| Step 9 状态机将使用的对象是否全部已定义 | 是 | command result、access/visibility、freshness、continuity、platform capability、local projection 均有对象。 |
| 字段类型是否写明且未下沉为 schema | 是 | 使用概要类型名；无数据库/序列化字段全集。 |
| 函数参数是否显式类型化 | 是 | 采用 `TypeName param_name`；无完整签名/返回类型/实现。 |
| 是否有对象承担 owner truth、授权、bus delivery、Observability audit | 否 | 均明确禁止或留给外部 owner。 |

## 19. 回填草稿（正式 §6）

> 校准来源：本文件 `§2 对象候选池筛选说明`、`§4/§6/§8/§10/§12/§14/§16` 各对象小节、`§18 跨对象 / 跨组成部分一致性审计`。

概要设计正式 §6 将独立收稳以下关键对象：

| 所属部分 | 关键对象 | 对象类型 | 概要层责任 |
|---|---|---|---|
| 协作体验语境 | `RouteContext`、`SelectionState`、`TurnPresentationModel`、`ConversationSurfaceViewModel` | context/state/projection | 组织当前路由、选择、Turn 展示和页面材料。 |
| 受控协作意图 | `DraftState`、`CommandAttemptState`、`CommandResultGate`、`IntentFeedbackViewModel` | state/policy/projection | 组织草稿、意图/尝试、结果门控和反馈。 |
| 安全语境与导航 | `AccessPosture`、`VisibilityGuard` | state/policy | 将正式可见性/范围结果映射为 fail-closed 入口和材料边界。 |
| 变化与恢复连续性 | `ContinuityState`、`ResumeContext`、`ChangeAcceptanceRecord`、`RecoveryViewModel` | state/context/history/projection | 组织 formal change/resume、缺口、恢复和未知结果。 |
| 平台体验与可访问性 | `PlatformCapabilityState`、`AccessibilityState`、`StatusAnnouncement` | state/context/projection | 组织宿主能力和等价辅助技术表达。 |
| owner-safe 材料镜像 | `SafeMaterialSnapshot`、`OwnerReference`、`ProvenanceMetadata`、`FreshnessMarker`、`PreviewReference` | projection/reference/value/state | 组织 body-free 材料、来源、visibility、新鲜度和预览入口。 |
| 本地展示与恢复投影 | `LocalProjectionEntry`、`CacheLifecycleRecord`、`PersistenceSafetyGuard` | projection/history/policy | 组织受限本地持有、清理和安全守卫。 |

这些对象的完整字段、协议映射、序列化、持久化和函数实现留给 `03-详细设计.md`；外部 owner 对象只以安全引用、safe view 或结果材料进入。

## 20. 待确认事项

| 待确认 | 影响 | 当前挂起口径 |
|---|---|---|
| `OwnerReference` 与各 owner/SDK safe ref 的具体类型映射 | §7 接口和 §8 查询/预览流 | 保留 opaque/reference 轮廓，等待 `CHAT-UP-001~006`。 |
| `RevisionMarker`、`ChangeCursorRef`、`VisibilityResultRef` 的正式来源与兼容 | §8/§9 reducer、resume、freshness | 只使用能力级类型名，不复制上游 schema。 |
| `SafeMaterialSnapshot` 可持有的摘要粒度和预览正文上限 | §11 配置、缓存和安全 | 只允许 body-free safe material；具体上限留给 owner/04。 |
| `StatusAnnouncement` 与诊断 handoff 的低敏分类 | §7/§8/§10 | 只保留安全原因/状态类别，不把公告当 evidence。 |

## 21. 自检与门禁

### 21.1 Step 自检

| 检查项 | 结论 |
|---|---|
| 是否从 Step 5 候选池筛选对象？ | 是；候选池逐项列出正式对象、字段类型、外部引用和排除原因。 |
| 是否按主要组成部分逐个正式化并停审？ | 是；协作、意图、安全、连续性、平台、材料、本地投影均有停审。 |
| 每个关键对象是否有基本信息表？ | 是。 |
| 关键字段、状态、成员函数、工厂函数是否分表且有作用说明？ | 是；适用对象均按规范独立成表。 |
| 函数参数是否使用类型名和参数名？ | 是。 |
| 是否复制 owner DTO/正文/数据库？ | 否。 |
| 是否把 API/port/repository 当领域对象？ | 否；留给 §7/03，或作为字段边界。 |
| Step 8/9 预计使用对象是否均已定义？ | 是；审计无 unresolved。 |
| 是否存在未解释的重复 canonical owner？ | 否。 |

### 21.2 进入下一步条件

- 对象候选池已筛选，正式关键对象均有独立概要骨架。
- 对象字段、状态、函数和工厂函数停在概要层，没有下沉到完整实现或 schema。
- 各对象能回指 Step 5 的 capability，Step 8/9 的预期对象均能反查。
- owner truth、SDK surface、平台能力和诊断边界没有被对象化为 Chat 私有事实。

### 21.3 门禁结论

`gate_status = pass`。Step 6 已完成，下一动作是创建并执行 `02_hld_step_07_api_outline.md`；接口骨架必须只引用本文件已定义对象和 Step 5 接缝，不得临场新增未确认 DTO、API path 或事件 schema。

### 6.28 `ProjectDetailViewModel`

| 项 | 内容 |
|---|---|
| 所属部分 | 协作体验语境 |
| 对象类型 | page projection |
| 主要责任 | 同一项目语境组织概览、项目进度、关联群聊、工作项、证据五标签；项目列表复用Work安全摘要和分页，不定义项目truth。 |

**关键字段骨架**

| 字段 | 类型 | 作用 |
|---|---|---|
| `project_reference` | `OwnerReference` | 正式Work项目ref |
| `consumption_context` | `ClientConsumptionContext` | 本次项目读取语境 |
| `navigation` | `ProjectNavigationState` | 局部标签与下钻 |
| `project_summary` | `SafeMaterialSnapshot` | Work安全概览 |
| `flow_view` | `ProcessFlowViewModel` | 可选正式流程材料；未加载不等于不存在 |
| `conversation_links` | `ProjectConversationLinkViewModel` | 正式关联群聊投影 |
| `work_items` | `SafeMaterialSnapshot[]` | Work工作项安全摘要 |
| `evidence_refs` | `OwnerReference[]` | 正式证据引用，不生成验收 |
| `access_posture` | `AccessPosture` | 项目入口访问 |
| `load_posture` | `PageLoadPosture` | loading/ready/partial/stale/blocked/unavailable |

**状态集合**

| 状态 | 作用 |
|---|---|
| `loading` | 等待正式安全query |
| `ready` | 当前语境获准材料可展示，不表示业务完成 |
| `partial/stale` | 覆盖不足或来源/版本落后，保留分来源姿态 |
| `blocked/unavailable` | 缺合同、无法验证或无安全材料，不推不存在 |

**成员函数骨架**

| 成员函数 | 作用 |
|---|---|
| `apply_section(SafeMaterialSnapshot section, ClientConsumptionContext context)` | 只应用当前语境的授权section |
| `set_navigation(ProjectNavigationState navigation)` | 仅局部标签/下钻 |
| `restrict(VisibilityChange change)` | 立即裁剪项目及关联材料 |

**工厂函数骨架**

| 工厂函数 | 作用 |
|---|---|
| `for_project(OwnerReference project_ref, ClientConsumptionContext context)` | 建立loading待验证页面 |

**禁止事项**

| 禁止事项 | 说明 |
|---|---|
| 概要设计硬边界 | 不得计算项目完成度、从群聊权限推项目权限或将测试摘要认作验收。 |

独立对象自检：§5候选有capability来源；字段/参数均为概要类型，未定义wire schema；对象职责及禁止项清楚，章节gate pass，正向owner/SDK能力仍blocked。

最终术语同步：ContinuityState.apply_resume_result的partial描述改为ContinuityPhase保持stale、FreshnessState标partial，与Step9分轴一致；不增加状态。


## 当前Step6收口

计划/输入已依Step6 SOP与规范§4.6读取，现有对象按七部分核对。诊断：缺项目/流程/目录对象、消费代次和跨source比较边界；已补独立骨架，receipt与optimistic分轴。复杂度以独立对象表足够。正式回填§6.1、既有对象与新增§6.28～34；边界类型/反查移为§6.35/36。跨对象审计无多重owner：ProjectNavigationState只负责项目局部下钻；SelectionState负责对话与通用焦点；ClientConsumptionContext当前消费，ResumeContext只恢复线索。Step8/9可反查，Step6 done gate pass，进入Step7；无实现/测试/提交。

### 当前Step6部分停审：本地展示与恢复投影

复核本部分既有独立对象及新增候选：功能来源见当前Step5；协作新增六对象分别独立定义，安全新增ClientConsumptionContext，其余沿用现有对象并明确optimistic/receipt/source-local/context/缓存恢复约束。API/coordinator/repository/renderer留§7/8或03，不升级为领域实体；字段类型仅边界或局部类型。被排除Process/人员/关系truth归正式owner。局部gate pass，合同blocked。


### 当前Step6部分停审：owner-safe 材料镜像

复核本部分既有独立对象及新增候选：功能来源见当前Step5；协作新增六对象分别独立定义，安全新增ClientConsumptionContext，其余沿用现有对象并明确optimistic/receipt/source-local/context/缓存恢复约束。API/coordinator/repository/renderer留§7/8或03，不升级为领域实体；字段类型仅边界或局部类型。被排除Process/人员/关系truth归正式owner。局部gate pass，合同blocked。


### 当前Step6部分停审：平台体验与可访问性

复核本部分既有独立对象及新增候选：功能来源见当前Step5；协作新增六对象分别独立定义，安全新增ClientConsumptionContext，其余沿用现有对象并明确optimistic/receipt/source-local/context/缓存恢复约束。API/coordinator/repository/renderer留§7/8或03，不升级为领域实体；字段类型仅边界或局部类型。被排除Process/人员/关系truth归正式owner。局部gate pass，合同blocked。


### 当前Step6部分停审：变化与恢复连续性

复核本部分既有独立对象及新增候选：功能来源见当前Step5；协作新增六对象分别独立定义，安全新增ClientConsumptionContext，其余沿用现有对象并明确optimistic/receipt/source-local/context/缓存恢复约束。API/coordinator/repository/renderer留§7/8或03，不升级为领域实体；字段类型仅边界或局部类型。被排除Process/人员/关系truth归正式owner。局部gate pass，合同blocked。


### 当前Step6部分停审：安全语境与导航

复核本部分既有独立对象及新增候选：功能来源见当前Step5；协作新增六对象分别独立定义，安全新增ClientConsumptionContext，其余沿用现有对象并明确optimistic/receipt/source-local/context/缓存恢复约束。API/coordinator/repository/renderer留§7/8或03，不升级为领域实体；字段类型仅边界或局部类型。被排除Process/人员/关系truth归正式owner。局部gate pass，合同blocked。


### 当前Step6部分停审：受控协作意图

复核本部分既有独立对象及新增候选：功能来源见当前Step5；协作新增六对象分别独立定义，安全新增ClientConsumptionContext，其余沿用现有对象并明确optimistic/receipt/source-local/context/缓存恢复约束。API/coordinator/repository/renderer留§7/8或03，不升级为领域实体；字段类型仅边界或局部类型。被排除Process/人员/关系truth归正式owner。局部gate pass，合同blocked。


### 当前Step6部分停审：协作体验语境

复核本部分既有独立对象及新增候选：功能来源见当前Step5；协作新增六对象分别独立定义，安全新增ClientConsumptionContext，其余沿用现有对象并明确optimistic/receipt/source-local/context/缓存恢复约束。API/coordinator/repository/renderer留§7/8或03，不升级为领域实体；字段类型仅边界或局部类型。被排除Process/人员/关系truth归正式owner。局部gate pass，合同blocked。


### 6.34 `ClientConsumptionContext`

| 项 | 内容 |
|---|---|
| 所属部分 | 安全语境与导航 |
| 对象类型 | context value object |
| 主要责任 | 隔离actor/scope/project/source/当前目标和本地消费代次，保护迟到query/change与撤销。 |

**关键字段骨架**

| 字段 | 类型 | 作用 |
|---|---|---|
| `actor_reference` | `ActorContextRef` | 正式actor安全关联 |
| `scope_reference` | `ScopeRef` | 正式scope关联 |
| `project_reference` | `OwnerReference` | 可选当前项目ref |
| `target_reference` | `OwnerReference` | 当前节点/群聊/目录目标 |
| `source_reference` | `SourceReference` | 当前正式来源 |
| `request_generation` | `LocalRequestGeneration` | 局部请求/订阅代次，不是业务版本 |
| `visibility_reference` | `VisibilityResultRef` | 当前访问语境关联 |
| `context_posture` | `ConsumptionContextPosture` | active/invalidated/cleared |

**状态集合**

| 状态 | 作用 |
|---|---|
| `active` | 当前局部消费代次，仍须正式access |
| `invalidated` | 切换/撤销后禁止应用旧响应 |
| `cleared` | 清理后不持有旧ref |

**成员函数骨架**

| 成员函数 | 作用 |
|---|---|
| `matches(ClientConsumptionContext incoming)` | 检查actor/scope/project/target/source/代次，不赋权 |
| `invalidate(ContextInvalidationReason reason)` | 切换/撤销先失效旧消费者 |
| `is_applicable(ProvenanceMetadata provenance)` | 校验材料source/scope/访问关联 |

**工厂函数骨架**

| 工厂函数 | 作用 |
|---|---|
| `for_request(RouteContext route, OwnerReference target, SourceReference source, LocalRequestGeneration generation)` | 每个来源读取建立当前消费语境 |

**禁止事项**

| 禁止事项 | 说明 |
|---|---|
| 概要设计硬边界 | 不序列化credential、resume token；不比较跨owner全局版本，不把本地active当授权成立。 |

独立对象自检：§5候选有capability来源；字段/参数均为概要类型，未定义wire schema；对象职责及禁止项清楚，章节gate pass，正向owner/SDK能力仍blocked。


### 6.33 `CompanyDirectoryViewModel`

| 项 | 内容 |
|---|---|
| 所属部分 | 协作体验语境 |
| 对象类型 | page projection |
| 主要责任 | 消费正式目录provider的人类/AI覆盖、搜索/分页/人员摘要；与项目成员、群聊参与者和runtime presence分开。 |

**关键字段骨架**

| 字段 | 类型 | 作用 |
|---|---|---|
| `provider_reference` | `OwnerReference` | 正式provider ref待确认 |
| `consumption_context` | `ClientConsumptionContext` | 目录actor/scope/source/请求代次 |
| `search_state` | `LocalDirectorySearchState` | 本地筛选/搜索输入，不扩访问 |
| `people` | `SafeMaterialSnapshot[]` | provider授权安全人员摘要 |
| `next_page_ref` | `PageReference` | provider分页边界 |
| `coverage` | `MaterialCoverage` | 正式人类/AI覆盖，缺合同不可宣称全公司 |
| `access_posture` | `AccessPosture` | 目录访问 |
| `freshness` | `FreshnessMarker` | 目录来源局部新鲜度 |
| `load_posture` | `PageLoadPosture` | loading/ready/partial/stale/blocked/unavailable |

**状态集合**

| 状态 | 作用 |
|---|---|
| `loading` | 等待正式安全query |
| `ready` | 当前语境获准材料可展示，不表示业务完成 |
| `partial/stale` | 覆盖不足或来源/版本落后，保留分来源姿态 |
| `blocked/unavailable` | 缺合同、无法验证或无安全材料，不推不存在 |

**成员函数骨架**

| 成员函数 | 作用 |
|---|---|
| `apply_page(SafeDirectoryPageView page, ClientConsumptionContext context)` | 当前搜索/页请求代次匹配才应用 |
| `select_person(OwnerReference person_ref)` | 局部人员选择，详情和DM另验 |
| `restrict(VisibilityChange change)` | 裁剪名单/搜索结果/选择与关联入口 |

**工厂函数骨架**

| 工厂函数 | 作用 |
|---|---|
| `for_provider(OwnerReference provider_ref, ClientConsumptionContext context)` | 缺provider合同则blocked |

**禁止事项**

| 禁止事项 | 说明 |
|---|---|
| 概要设计硬边界 | Identity AI员工身份不自动构成公司目录；不可并集ProjectMember/Participant/Member生成全公司名单或猜DM权限。 |

独立对象自检：§5候选有capability来源；字段/参数均为概要类型，未定义wire schema；对象职责及禁止项清楚，章节gate pass，正向owner/SDK能力仍blocked。


### 6.32 `ProjectConversationLinkViewModel`

| 项 | 内容 |
|---|---|
| 所属部分 | 协作体验语境 |
| 对象类型 | relationship projection |
| 主要责任 | 展示正式项目/群聊关联及分别验证的目标入口，支持双向导航而不建立关系。 |

**关键字段骨架**

| 字段 | 类型 | 作用 |
|---|---|---|
| `anchor_reference` | `OwnerReference` | 当前项目或群聊 |
| `relationship_material` | `SafeProjectConversationAssociationView` | 正式owner关联输出；未确认owner则blocked |
| `target_refs` | `OwnerReference[]` | 获准目标ref |
| `target_access` | `AccessPosture[]` | 每个目标独立访问，不继承锚点权限 |
| `provenance` | `ProvenanceMetadata` | 关系版本与撤销 |
| `consumption_context` | `ClientConsumptionContext` | 当前锚点请求语境 |
| `load_posture` | `PageLoadPosture` | 客户端加载/缺口姿态 |

**状态集合**

| 状态 | 作用 |
|---|---|
| `loading` | 等待正式安全query |
| `ready` | 当前语境获准材料可展示，不表示业务完成 |
| `partial/stale` | 覆盖不足或来源/版本落后，保留分来源姿态 |
| `blocked/unavailable` | 缺合同、无法验证或无安全材料，不推不存在 |

**成员函数骨架**

| 成员函数 | 作用 |
|---|---|
| `apply_relationship(SafeProjectConversationAssociationView relationship, ClientConsumptionContext context)` | 应用正式关系，不以local choice绑定 |
| `apply_target_access(OwnerReference target, AccessPosture access)` | 验证目标后才提供入口 |
| `restrict(VisibilityChange change)` | 解除/撤销后删除入口和返回ref |

**工厂函数骨架**

| 工厂函数 | 作用 |
|---|---|
| `for_anchor(OwnerReference anchor, ClientConsumptionContext context)` | 建立待验证关联投影 |

**禁止事项**

| 禁止事项 | 说明 |
|---|---|
| 概要设计硬边界 | 一群至多一项目/项目多群是产品目标，不由Chat强制修改owner；关系可见不等于目标可见。 |

独立对象自检：§5候选有capability来源；字段/参数均为概要类型，未定义wire schema；对象职责及禁止项清楚，章节gate pass，正向owner/SDK能力仍blocked。


### 6.31 `ProcessNodeDetailViewModel`

| 项 | 内容 |
|---|---|
| 所属部分 | 协作体验语境 |
| 对象类型 | read-only projection |
| 主要责任 | 在当前Process拓扑节点上组织独立授权的Work、Gate、Artifact、Runtime和诊断引用section。 |

**关键字段骨架**

| 字段 | 类型 | 作用 |
|---|---|---|
| `node_reference` | `OwnerReference` | 当前正式节点ref |
| `consumption_context` | `ClientConsumptionContext` | 节点选择请求语境 |
| `topology_revision` | `RevisionMarker` | 父图当前版本 |
| `association_refs` | `OwnerReference[]` | 正式节点关系输出，不由名称匹配 |
| `sections` | `SafeMaterialSnapshot[]` | 各owner独立access/provenance/freshness材料 |
| `access_posture` | `AccessPosture` | 节点访问姿态 |
| `load_posture` | `PageLoadPosture` | section缺口使partial，不推不存在 |

**状态集合**

| 状态 | 作用 |
|---|---|
| `loading` | 等待正式安全query |
| `ready` | 当前语境获准材料可展示，不表示业务完成 |
| `partial/stale` | 覆盖不足或来源/版本落后，保留分来源姿态 |
| `blocked/unavailable` | 缺合同、无法验证或无安全材料，不推不存在 |

**成员函数骨架**

| 成员函数 | 作用 |
|---|---|
| `apply_associations(SafeNodeAssociationView associations, ClientConsumptionContext context)` | 仅应用正式节点关系 |
| `apply_section(SafeMaterialSnapshot section, ClientConsumptionContext context)` | 分别校验owner/source/当前节点 |
| `invalidate_parent(RevisionMarker revision)` | 父图变化失效旧节点/查询 |

**工厂函数骨架**

| 工厂函数 | 作用 |
|---|---|
| `for_node(OwnerReference node_ref, RevisionMarker revision, ClientConsumptionContext context)` | 建立独立授权待查详情 |

**禁止事项**

| 禁止事项 | 说明 |
|---|---|
| 概要设计硬边界 | 工具调用、代码提交、测试和Agent统计只能safe ref/summary；不执行Tools/Runtime、不产生验收/evidence/verdict。 |

独立对象自检：§5候选有capability来源；字段/参数均为概要类型，未定义wire schema；对象职责及禁止项清楚，章节gate pass，正向owner/SDK能力仍blocked。


### 6.30 `ProcessFlowViewModel`

| 项 | 内容 |
|---|---|
| 所属部分 | 协作体验语境 |
| 对象类型 | read-only projection |
| 主要责任 | 承接Process正式整体/阶段安全拓扑和状态，供图与等价列表共享；不执行BPMN。 |

**关键字段骨架**

| 字段 | 类型 | 作用 |
|---|---|---|
| `project_reference` | `OwnerReference` | 当前项目ref |
| `process_reference` | `OwnerReference` | 正式Process语境ref |
| `stage_reference` | `OwnerReference` | 可选阶段ref |
| `consumption_context` | `ClientConsumptionContext` | 隔离请求/订阅 |
| `topology_material` | `SafeProcessTopologyView` | 正式授权节点/边/层级边界材料，不是自造XML |
| `state_material` | `SafeMaterialSnapshot[]` | Process提供节点/分支/Gateway状态 |
| `topology_provenance` | `ProvenanceMetadata` | 正式拓扑来源/版本/coverage |
| `state_provenance` | `ProvenanceMetadata` | 状态来源版本，独立于拓扑 |
| `governance_refs` | `OwnerReference[]` | 正式关联Gate，单独读取与标记来源 |
| `freshness` | `FreshnessMarker` | 相对本Process来源的状态 |
| `access_posture` | `AccessPosture` | 当前流程可见边界 |
| `load_posture` | `PageLoadPosture` | 客户端加载/缺口状态 |

**状态集合**

| 状态 | 作用 |
|---|---|
| `loading` | 等待正式安全query |
| `ready` | 当前语境获准材料可展示，不表示业务完成 |
| `partial/stale` | 覆盖不足或来源/版本落后，保留分来源姿态 |
| `blocked/unavailable` | 缺合同、无法验证或无安全材料，不推不存在 |

**成员函数骨架**

| 成员函数 | 作用 |
|---|---|
| `apply_topology(SafeProcessTopologyView topology, ProvenanceMetadata provenance, ClientConsumptionContext context)` | 通过上下文/版本检查后投影 |
| `apply_state(SafeMaterialSnapshot state, ClientConsumptionContext context)` | 不匹配拓扑则partial/stale并重查 |
| `to_equivalent_list(AccessibilityState accessibility)` | 与图共享获准材料 |
| `restrict(VisibilityChange change)` | 裁剪图/列表/关联入口 |

**工厂函数骨架**

| 工厂函数 | 作用 |
|---|---|
| `for_context(OwnerReference process_ref, ClientConsumptionContext context)` | 建立blocked或loading消费候选 |

**禁止事项**

| 禁止事项 | 说明 |
|---|---|
| 概要设计硬边界 | 不从WorkItem/Runtime/原型坐标补图、不推导join、不将Gateway等同治理Gate，不显示未授权节点名称/数量/关系。 |

独立对象自检：§5候选有capability来源；字段/参数均为概要类型，未定义wire schema；对象职责及禁止项清楚，章节gate pass，正向owner/SDK能力仍blocked。


### 6.29 `ProjectNavigationState`

| 项 | 内容 |
|---|---|
| 所属部分 | 协作体验语境 |
| 对象类型 | local state |
| 主要责任 | 记录项目详情标签、整体/阶段/节点、图视口和往返位置；与普通对话SelectionState分工。 |

**关键字段骨架**

| 字段 | 类型 | 作用 |
|---|---|---|
| `project_reference` | `OwnerReference` | 项目选择候选 |
| `active_tab` | `ProjectDetailTab` | overview/progress/conversations/work-items/evidence局部标签 |
| `stage_reference` | `OwnerReference` | 可选正式阶段ref |
| `node_reference` | `OwnerReference` | 可选正式节点ref |
| `topology_revision` | `RevisionMarker` | 选择对应Process版本 |
| `viewport` | `LocalViewportState` | 缩放/平移安全局部值 |
| `return_context` | `ReturnContext` | 已裁剪的返回群聊/项目位置 |
| `selection_posture` | `SelectionPosture` | empty/selected/stale/cleared |

**状态集合**

| 状态 | 作用 |
|---|---|
| `empty/selected` | 无选择/有局部选择，不推进owner |
| `stale` | 父拓扑或关系变化，待重验 |
| `cleared` | 撤销/离开/登出后裁剪 |

**成员函数骨架**

| 成员函数 | 作用 |
|---|---|
| `select_tab(ProjectDetailTab tab)` | 切标签不推进owner |
| `select_stage(OwnerReference stage_ref, RevisionMarker revision)` | 仅接受当前图已授权阶段 |
| `select_node(OwnerReference node_ref, RevisionMarker revision)` | 仅接受当前版本已授权节点 |
| `invalidate(VisibilityChange change)` | 撤销/版本变化使选择失效 |

**工厂函数骨架**

| 工厂函数 | 作用 |
|---|---|
| `from_route(RouteContext route)` | 建立须重验的局部选择 |

**禁止事项**

| 禁止事项 | 说明 |
|---|---|
| 概要设计硬边界 | 不证明阶段归属、绑定、授权或流程运行结果；恢复不得重放点击副作用。 |

独立对象自检：§5候选有capability来源；字段/参数均为概要类型，未定义wire schema；对象职责及禁止项清楚，章节gate pass，正向owner/SDK能力仍blocked。
