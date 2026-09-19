## Step 6. 关键对象轮廓

### 1. Step 状态

- 状态：[x] 已确认（对象卡审计通过）
- 对应 SOP：`standards/document/概要设计讨论流程_SOP.md` Step 6
- 回填章节：正式 `02-概要设计.md` §6「关键对象轮廓」

#### 1.1 Step 内计划

- [x] 读取 Step 5 对象候选池、Step 4 主体框架和 Step 3 约束
- [x] 完成候选池筛选，区分对象、字段类型、DTO、port 和 owner domain
- [x] 按对象独立给出类型、关键字段、状态、函数骨架和禁止事项
- [x] 按五个主要组成部分完成对象正式化停审
- [x] 反查 Step 7 接口和 Step 8/9 流程/状态所需对象
- [x] 完成回填草稿与三层门禁

### 2. 本步输入

- `design-calibration/02_hld_step_05_components_boundary.md`
- `design-calibration/02_hld_step_04_code_subject_framework.md`
- `design-calibration/02_hld_step_03_constraints.md`
- `projects/L5-console/00-需求文档.md` §11
- `projects/L5-console/01-架构设计.md` §9

### 3. SOP 问题回答

1. **哪些对象若不点名，详细设计会重新发明主语？**

   `AccessContext`、`NavigationState`、`OwnerViewSnapshot`、`SourceStatusAxes`、`OwnerViewModel`、`ReferenceSet`、`DraftIntent`、`RequestPresentation`、`ResultReference`、`TopicVisibility`、`TopicViewModel`、`DegradationState`、`RecoveryPlan`、`AccessibilityState`、`DiagnosticContext` 以及保护它们的不变量 guard 必须点名。它们分别承接语境、入口、来源保真、草稿/结果、主题门控和恢复主线。

2. **哪些候选对象正式进入本步？**

   进入对象卡的包括上述 15 个主对象，以及 `ContextLifecycleState`、`ActorScopeReference`、`VisibilityReference`、`SourceReference`、`VersionReference`、`CommandReference`、`ReceiptReference`、`QueryInteractionRecord`、`SubmissionAttemptPresentation`、`TopicActivationState`、`OwnerCapabilityReference`、`SafeLinkReference`、`RecoveryReference`、`DiagnosticReference`、`StatusPresentationView`、`RecoveryViewModel`、`DisclosureGuard`、`QualificationBoundary`、`QueryNoWriteGuard`、`CoverageGuard`、`SubmissionEligibilityGuard`、`CompletionGuard`、`UnknownReplayGuard`、`TopicBoundaryGuard`、`OwnerActivationGuard`、`RecoverySafetyGuard`、`AccessibilityEquivalenceGuard`。

3. **哪些名称只是字段类型、DTO、port、repository、API、trigger 或实现细节？**

   `SdkAccessPort`、`OwnerQueryPort`、`OwnerCommandPort`、`ResultReconciliationPort`、`DiagnosticSinkPort`、`SafeLinkPort`、`FocusAnnouncementPort`、所有 Query/Command 输入输出、组件、路由、缓存介质、数据库、owner domain object、Workspace cursor/rebuild、Artifact/Evidence body 都不作为本步领域对象。它们在字段中只能作为 opaque reference/type 或留给 Step 7/03。

4. **每个对象属于哪个主要组成部分、是什么类型？**

   每个对象卡都写所属部分；类型只到 `context object`、`interaction state`、`snapshot/view model`、`reference object`、`policy/guard`、`safe diagnostic record` 等概要层，不写完整实现定义。

5. **关键字段、状态和函数需要到什么粒度？**

   只列支撑 Step 7～9 的字段类型、状态含义和函数意图；函数参数统一 `TypeName param_name`。不写完整 schema、返回类型、trait、错误码、数据库列或实现体。

6. **对象是否会反向成为 owner truth？**

   不会。每张对象卡都包含禁止事项；owner-safe snapshot/reference 只可失效、可撤除和回链，Console-owned state 只表达客户端经历。

### 4. 当前文档问题诊断

| 位置 | 当前问题 | 修正 |
|---|---|---|
| 旧 02 §1.3/§6 | `ConsoleWorkspace`、`PanelState`、`UnifiedDashboard` 被写成近似领域对象，缺少 owner/交互类型区分 | 改为明确的 context/state/view/reference 对象，禁止升级为业务 truth |
| 旧 02 §6.2 | 只有页面/模块名，没有字段类型、状态和函数骨架 | 为关键对象逐卡给出概要粒度 |
| 旧 draft/03 | 可能迁移 Workspace projection、cursor、rebuild、事件对象 | 在候选池筛选中明确排除 owner 服务对象 |
| 旧正文 | `PermissionHint` 容易被理解成 authorization cache | 改为 `TopicVisibility`/`DisclosureGuard`，只呈现正式决定上限 |

### 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 对象来源 | 从页面名词直接抽取 | 从 Step 5 truth/state/policy/view/reference 维度筛选 | 保持功能来源和对象边界 |
| 对象粒度 | 多个对象合并或只列概念 | 每个关键对象独立成卡 | 支撑详细设计 1:1 承接 |
| 权限表示 | Permission hint 容易成为本地权限 | Visibility reference + guard，只能收紧 | 防止 fail-open |
| 结果表示 | Action entry、toast、refresh 与业务结果相邻 | DraftIntent / RequestPresentation / ResultReference 分离 | 保持 unknown 和正式结果语义 |

### 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A：只写对象总表 | 易读、短 | 不能支撑字段、状态、函数和禁止事项 | 不采用 |
| 方案 B：复制 owner 领域对象到 Console | 主题看起来完整 | 制造第二真相，越过 owner 边界 | 不采用 |
| 方案 C：按对象独立成卡，区分交互 truth 与安全 view/ref | 可回指功能、接口、流和状态，边界可审查 | 对象数量较多 | 采用 |

### 7. 结构化中间产物

#### 7.1 对象候选池筛选说明

| 候选 | 筛选结论 | 原因 |
|---|---|---|
| `AccessContext` / `NavigationState` / `ContextLifecycleState` | 正式对象 | 承接语境锚定、入口和失效交互事实 |
| `OwnerViewSnapshot` / `SourceStatusAxes` / `OwnerViewModel` | 正式对象 | 保留 owner/source、freshness、coverage、availability、consistency |
| `ReferenceSet` 与 actor/source/version/command/receipt/result/link reference | 正式对象或字段集合 | 支撑安全回链，不保存正文 |
| `DraftIntent` / `RequestPresentation` / `ResultReference` | 正式对象 | 分离草稿、提交经历和 owner 正式结果 |
| `TopicVisibility` / `TopicViewModel` / `TopicActivationState` | 正式对象 | 承接八类主题按 owner 独立门控 |
| `DegradationState` / `RecoveryPlan` / `AccessibilityState` / `DiagnosticContext` | 正式对象 | 承接局部故障、恢复和可访问交互 |
| `DisclosureGuard`、`QueryNoWriteGuard`、`CompletionGuard` 等 | 正式 policy/guard | 约束对象行为，不生成外部 truth |
| API DTO、port、repository、component、route、owner aggregate | 排除 | 由 Step 7 或 03 承接；owner truth 不迁移 |

#### 7.2 对象卡片

##### `AccessContext`

| 项 | 内容 |
|---|---|
| 所属部分 | 访问语境与导航 |
| 对象类型 | context object |
| 主要责任 | 表达当前可呈现的正式 actor/scope 语境安全引用 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `context_ref` | `ContextReference` | 标识当前交互语境引用 |
| `actor_ref` | `ActorReference` | 指向正式 actor 的安全引用 |
| `scope_ref` | `ScopeReference` | 指向正式 scope 的安全引用 |
| `visibility_ref` | `VisibilityReference` | 记录可呈现的正式可见性引用 |
| `lifecycle_state` | `ContextLifecycleState` | 表达 verified/restricted/expired/revoked/unknown |

| 成员函数 | 作用 |
|---|---|
| `is_usable_for_disclosure()` | 判断是否可用于受保护呈现 |
| `requires_revalidation()` | 判断是否必须重新验证 |
| `invalidate(ContextInvalidationReason reason)` | 收紧并失效当前语境 |

| 工厂函数 | 作用 |
|---|---|
| `from_formal_context(FormalContextReference formal_ref)` | 从正式边界安全引用构造 |
| `unknown(ContextUnknownReason reason)` | 在无法验证时构造保守姿态 |

禁止：签发 credential、计算 scope 层级、生成 allow/deny、缓存授权证明或保存身份正文。

##### `NavigationState`

| 项 | 内容 |
|---|---|
| 所属部分 | 访问语境与导航 |
| 对象类型 | interaction state |
| 主要责任 | 保存当前入口、探索和返回姿态 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `entry_ref` | `NavigationEntryReference` | 当前入口 |
| `route_selection` | `RouteSelection` | 当前客户端路由选择，不是权限 |
| `history_marker` | `NavigationHistoryMarker` | 返回/恢复所需交互标记 |
| `visibility_posture` | `TopicVisibility` | 当前入口安全姿态 |

| 成员函数 | 作用 |
|---|---|
| `select(NavigationEntryReference entry_ref)` | 选择入口 |
| `apply_visibility(TopicVisibility posture)` | 应用正式可见性上限 |
| `clear_sensitive_selection()` | 语境失效时清理敏感选择 |

禁止：由 route、menu、history 或 local flag 授权；根据空列表推导对象不存在。

##### `ContextLifecycleState`

| 项 | 内容 |
|---|---|
| 所属部分 | 访问语境与导航 |
| 对象类型 | state enum/value object |
| 主要责任 | 区分语境可用性和失效姿态 |

| 状态 | 作用 |
|---|---|
| `unresolved` | 尚无可验证语境 |
| `verified` | 可用于当前允许的呈现 |
| `restricted` | 只允许最小披露 |
| `expired` / `revoked` | 旧语境必须收紧并重验 |
| `conflict` / `unknown` | 无法安全判断，fail-closed |

禁止：把 `verified` 当永久认证；把 `unknown` 自动提升为允许。

##### `DisclosureGuard`

| 项 | 内容 |
|---|---|
| 所属部分 | 访问语境与导航 |
| 对象类型 | policy/guard |
| 主要责任 | 在显示或提交前检查语境、visibility 和最小披露上限 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `guard_ref` | `GuardReference` | 标识 guard 规则来源 |
| `context_requirement` | `ContextRequirement` | 记录必须满足的语境条件 |
| `redaction_limit` | `RedactionLimit` | 表示可呈现字段上限 |

| 成员函数 | 作用 |
|---|---|
| `check(AccessContext context, DisclosureTarget target)` | 给出呈现上限 |
| `tighten(VisibilityReference visibility_ref)` | 只收紧，不放宽 |

禁止：生成授权决定、读取 owner 内部规则、把缺失解释成 allow。

##### `OwnerViewSnapshot`

| 项 | 内容 |
|---|---|
| 所属部分 | 来源保真视图 |
| 对象类型 | safe snapshot object |
| 主要责任 | 保存一次 owner-safe 查询结果的最小摘要、来源和状态轴 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `snapshot_ref` | `SnapshotReference` | 标识可失效快照 |
| `owner_ref` | `OwnerReference` | 标识来源 owner |
| `source_ref` | `SourceReference` | 指向正式结果/对象安全引用 |
| `status_axes` | `SourceStatusAxes` | 保留 freshness/coverage/availability/consistency |
| `safe_payload` | `SafeViewPayload` | 仅允许的安全摘要字段 |

| 成员函数 | 作用 |
|---|---|
| `is_presentable(AccessContext context)` | 判断是否可在当前语境呈现 |
| `mark_stale(FreshnessMarker marker)` | 标记过期 |
| `revoke(RevocationReason reason)` | 撤除或收紧快照 |

| 工厂函数 | 作用 |
|---|---|
| `from_owner_result(OwnerSafeResult result, AccessContext context)` | 从正式安全结果构造 |
| `partial(PartialCoverage coverage)` | 形成可解释的部分结果 |

禁止：保存 raw/hidden body、复制 owner domain、把 snapshot 当 current truth、跨 owner 合成统一 verdict。

##### `SourceStatusAxes`

| 项 | 内容 |
|---|---|
| 所属部分 | 来源保真视图 |
| 对象类型 | status/value object |
| 主要责任 | 独立表达 source、freshness、coverage、availability、consistency |

| 字段 | 类型 | 作用 |
|---|---|---|
| `source` | `OwnerReference` | 来源 owner |
| `freshness` | `FreshnessState` | 当前/过期/未知 |
| `coverage` | `CoverageState` | 完整/部分/未覆盖 |
| `availability` | `AvailabilityState` | 可用/不可用/降级 |
| `consistency` | `ConsistencyState` | 一致/冲突/未知 |

| 状态轴 | 状态集合 | 作用 |
|---|---|---|
| `freshness` | `fresh / stale / expired / unknown` | 保留正式来源的当前性；`stale` 只允许受限呈现，`expired/unknown` 不进入正常主线 |
| `coverage` | `complete / partial / missing / not_covered` | 区分完整、部分、缺失与不适用，禁止把缺失解释为空集合 |
| `availability` | `available / degraded / unavailable / unknown` | 只描述当前 owner surface 的可访问姿态，不代表 Console 整体可用性 |
| `consistency` | `coherent / conflict / unknown` | 保留正式材料的一致性；冲突或未知不得由 Console 自行择优 |

| 成员函数 | 作用 |
|---|---|
| `is_safe_for_display()` | 判断是否可以在安全上限内显示 |
| `has_conflict()` | 判断是否必须暂停危险操作 |
| `tighten(StatusConstraint constraint)` | 在不确定时收紧 |

禁止：合成 health/compliance/readiness；以某一轴覆盖其它轴。

##### `OwnerViewModel`

| 项 | 内容 |
|---|---|
| 所属部分 | 来源保真视图 |
| 对象类型 | projection/view model |
| 主要责任 | 将一个或多个已裁剪的 owner snapshot 组织成页面消费模型，并保留每个来源边界 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `view_ref` | `ViewReference` | 当前呈现模型引用 |
| `source_snapshots` | `OwnerViewSnapshotSet` | 分 owner 的安全快照集合 |
| `coverage` | `CoverageSet` | 说明缺失/未覆盖区域 |
| `interaction_context` | `ContextReference` | 回指语境 |

| 成员函数 | 作用 |
|---|---|
| `compose(OwnerViewSnapshot snapshot)` | 加入分域安全结果 |
| `filter(FilterIntent filter)` | 只在已获准结果上探索 |
| `drill_down(SafeLinkReference link_ref)` | 生成安全下钻意图 |

禁止：把多 owner 结果变成统一 truth、写回 owner、补齐缺失数据。

##### `ReferenceSet`

| 项 | 内容 |
|---|---|
| 所属部分 | 来源保真视图 |
| 对象类型 | reference object |
| 主要责任 | 保存正式对象、版本、结果和链接的安全引用集合 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `references` | `SafeReferenceSet` | 允许展示的引用集合 |
| `owner_scope` | `OwnerScopeReference` | 约束引用适用范围 |
| `redaction_marker` | `RedactionMarker` | 记录裁剪上限 |

| 成员函数 | 作用 |
|---|---|
| `add(SafeReference reference)` | 加入已验证引用 |
| `remove_revoked(RevocationSet revoked)` | 撤除失效引用 |
| `contains(SafeReference reference)` | 判断是否存在安全引用 |

禁止：保存正文、把 ref 当权限或幂等依据、用本地 ref 推导 owner 终态。

##### `QueryNoWriteGuard`

| 项 | 内容 |
|---|---|
| 所属部分 | 来源保真视图 |
| 对象类型 | policy/guard |
| 主要责任 | 保证查询、筛选、预取、分页和下钻不产生业务副作用 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `guard_ref` | `GuardReference` | 规则标识 |
| `prohibited_effects` | `EffectKindSet` | 禁止的写入/刷新/回查副作用 |

| 成员函数 | 作用 |
|---|---|
| `assert_read_only(QueryIntent query)` | 审查查询是否纯读 |
| `reject_implicit_refresh(QueryIntent query)` | 阻止隐式状态推进 |

禁止：用 query 触发 owner command、推进 cursor、生成审计或重放未知请求。

##### `DraftIntent`

| 项 | 内容 |
|---|---|
| 所属部分 | 受控意图与结果 |
| 对象类型 | interaction truth object |
| 主要责任 | 保存未提交的用户管理意图和提交前复核材料 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `draft_ref` | `DraftReference` | 标识草稿 |
| `target_ref` | `SafeTargetReference` | 指向获准操作目标 |
| `draft_fields` | `ClientDraftFields` | 仅保存允许的草稿字段 |
| `validation_state` | `DraftValidationState` | 表示本地格式检查 |
| `context_ref` | `ContextReference` | 绑定创建时语境 |

| 状态 | 作用 |
|---|---|
| `editing` | 正在编辑 |
| `reviewable` | 已可进入复核 |
| `invalid` | 本地格式检查未通过 |
| `submitted` | 已交给正式 command seam |
| `discarded` | 已放弃或清理 |

| 成员函数 | 作用 |
|---|---|
| `edit(DraftPatch patch)` | 更新未提交字段 |
| `validate(ClientValidationContext context)` | 执行需求级检查 |
| `prepare_submission(AccessContext context)` | 绑定当前语境并生成提交前复核 |
| `discard(DiscardReason reason)` | 安全清理草稿 |

禁止：把草稿当正式对象、执行 owner 校验/授权、携带 forbidden body。

##### `RequestPresentation`

| 项 | 内容 |
|---|---|
| 所属部分 | 受控意图与结果 |
| 对象类型 | interaction state |
| 主要责任 | 表达一次提交的客户端经历，不表示 owner 已完成 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `request_ref` | `RequestReference` | 标识本次提交交互 |
| `draft_ref` | `DraftReference` | 回指草稿 |
| `phase` | `RequestPhase` | submitted/accepted/pending/confirmed/rejected/unknown |
| `receipt_ref` | `ReceiptReference` | owner 允许返回时保存安全 receipt 引用 |
| `reconciliation_ref` | `ReconciliationReference` | 正式回查能力引用 |

| 状态 | 作用 |
|---|---|
| `submitted` | 已发起提交尝试，不表示 owner 已受理 |
| `accepted` | 正式 receipt 表示已受理，仍不表示业务完成 |
| `pending` | 正式结果尚未终结 |
| `confirmed` | 仅依据 owner 正式结果呈现成功终态 |
| `rejected` | 仅依据 owner 正式结果呈现拒绝或失败终态 |
| `unknown` | 提交或响应无法判定；只能等待正式回查，不得自动重放 |

| 成员函数 | 作用 |
|---|---|
| `mark_submitted(CommandAttemptReference attempt_ref)` | 记录提交尝试 |
| `apply_receipt(ReceiptReference receipt_ref)` | 呈现受理但不宣布完成 |
| `apply_result(ResultReference result_ref)` | 仅根据正式结果进入 confirmed/rejected |
| `mark_unknown(UnknownReason reason)` | 中断/缺回查时保持未知 |

禁止：以 transport success、toast、刷新或缓存命中进入 confirmed；未知时自动重放。

##### `ResultReference`

| 项 | 内容 |
|---|---|
| 所属部分 | 受控意图与结果 |
| 对象类型 | reference object |
| 主要责任 | 指向 owner 正式 receipt/result/reconciliation 的安全引用 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `result_ref` | `OwnerResultReference` | 正式结果引用 |
| `owner_ref` | `OwnerReference` | 结果来源 |
| `result_state` | `OwnerResultState` | confirmed/rejected/unknown 等正式标记 |
| `observed_at` | `ObservedAt` | 结果观察时间 |

| 成员函数 | 作用 |
|---|---|
| `is_formal_terminal()` | 判断是否是 owner 正式终态 |
| `requires_reconciliation()` | 判断是否需要正式回查 |

禁止：本地生成 confirmed/rejected；保存业务结果正文；把 ref 当 idempotency proof。

##### `CompletionGuard`

| 项 | 内容 |
|---|---|
| 所属部分 | 受控意图与结果 |
| 对象类型 | policy/guard |
| 主要责任 | 防止非正式成功信号冒充业务完成 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `formal_result_requirement` | `FormalResultRequirement` | 规定必须有 owner result |
| `accepted_states` | `FormalCompletionStateSet` | 允许的正式终态 |

| 成员函数 | 作用 |
|---|---|
| `assert_terminal(ResultReference result_ref)` | 检查结果是否正式终态 |
| `reject_transport_success(TransportOutcome outcome)` | 拒绝以传输成功收口 |

禁止：放宽正式结果门槛、从 UI 状态推导业务完成。

##### `UnknownReplayGuard`

| 项 | 内容 |
|---|---|
| 所属部分 | 受控意图与结果 |
| 对象类型 | policy/guard |
| 主要责任 | 在 unknown 副作用结果缺少正式回查/幂等依据时阻止重放 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `reconciliation_requirement` | `ReconciliationRequirement` | 规定回查能力 |
| `idempotency_requirement` | `IdempotencyRequirement` | 规定正式幂等依据 |

| 成员函数 | 作用 |
|---|---|
| `can_retry(UnknownRequest request, FormalReconciliation capability)` | 判断是否可安全重试 |
| `block_without_basis(UnknownRequest request)` | 形成 blocked/unknown 姿态 |

禁止：使用本地时间、刷新、随机 key 或 toast 作为幂等依据。

##### `TopicVisibility`

| 项 | 内容 |
|---|---|
| 所属部分 | 管理主题组织 |
| 对象类型 | state/value object |
| 主要责任 | 表达主题或动作在正式 visibility/qualification 上限内的入口姿态 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `topic_ref` | `TopicReference` | 主题标识 |
| `posture` | `VisibilityPosture` | visible/restricted/disabled/unknown/unavailable |
| `reason_ref` | `OptionalReasonReference` | 仅在 owner 允许时提供原因引用 |
| `source_ref` | `VisibilityReference` | 回指正式决定 |

| 状态 | 作用 |
|---|---|
| `visible` | 正式结果允许发现入口；仍受语境、资格和命令面约束 |
| `restricted` | 只允许最小披露，不得泄露更多对象或原因 |
| `disabled` | 入口可见但当前正式条件不允许动作 |
| `unknown` | visibility 或资格不可判定，按 fail-closed 处理 |
| `unavailable` | 正式 surface 或来源当前不可用，与 denied/restricted 分离 |

| 成员函数 | 作用 |
|---|---|
| `restrict(RestrictionReason reason)` | 收紧入口 |
| `is_actionable()` | 判断是否可以展示操作入口 |
| `apply_revocation(RevocationReference revocation)` | 立即撤销旧姿态 |

禁止：生成 allow/deny、泄露 restricted 对象存在性、由 flag 放宽。

##### `TopicViewModel`

| 项 | 内容 |
|---|---|
| 所属部分 | 管理主题组织 |
| 对象类型 | projection/view model |
| 主要责任 | 组织单一管理主题的 owner-safe 结果、入口和状态轴 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `topic_ref` | `TopicReference` | 主题标识 |
| `visibility` | `TopicVisibility` | 入口/动作上限 |
| `owner_views` | `OwnerViewModelSet` | 分 owner 视图 |
| `action_entries` | `CommandEntrySet` | 条件化入口，不是命令完成事实 |
| `links` | `SafeLinkReferenceSet` | 正式安全回链 |

| 成员函数 | 作用 |
|---|---|
| `compose(OwnerViewModel view)` | 加入 owner-safe 视图 |
| `disable_dependent_actions(DegradationState state)` | 局部收紧动作 |
| `remove_revoked_links(RevocationSet revoked)` | 撤除无效回链 |

禁止：跨主题生成统一 readiness/health；把动作入口当执行结果；复制 owner 正文。

##### `TopicActivationState`

| 项 | 内容 |
|---|---|
| 所属部分 | 管理主题组织 |
| 对象类型 | state/value object |
| 主要责任 | 表达某主题正式接缝是否达到可消费的能力级条件 |

| 状态 | 作用 |
|---|---|
| `pending` | 合同或 activation 尚未闭口 |
| `read_only` | 仅有安全查询面 |
| `partial` | 只有部分 owner/能力可用 |
| `active` | 正式 surface 和资格可判别，可提供受控入口 |
| `blocked` | 缺少安全前置或合同 |

禁止：由产品计划、feature flag、mock 或页面存在把 pending 变 active。

##### `OwnerActivationGuard`

| 项 | 内容 |
|---|---|
| 所属部分 | 管理主题组织 |
| 对象类型 | policy/guard |
| 主要责任 | 仅在正式 owner surface、safe-field、visibility、资格和结果语义均可证明时开放能力 |

| 成员函数 | 作用 |
|---|---|
| `check(OwnerContractStatus contract, AccessContext context)` | 判断能力级开放上限 |
| `block_missing_surface(OwnerReference owner_ref)` | 生成 blocked/read-only 姿态 |

禁止：把历史接口或 fake 视为正式 activation。

##### `DegradationState`

| 项 | 内容 |
|---|---|
| 所属部分 | 韧性与可访问交互 |
| 对象类型 | state object |
| 主要责任 | 表达某 owner/topic/交互区的非理想状态 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `subject_ref` | `DegradationSubjectReference` | 指向局部区域 |
| `availability` | `AvailabilityState` | available/degraded/unavailable |
| `freshness` | `FreshnessState` | fresh/stale/expired/unknown |
| `coverage` | `CoverageState` | complete/partial/missing |
| `consistency` | `ConsistencyState` | coherent/conflict/unknown |
| `reason_ref` | `SafeReasonReference` | 允许披露的原因引用 |

| 状态轴 | 状态集合 | 作用 |
|---|---|---|
| `availability` | `available / degraded / unavailable` | 表达局部来源或交互区是否可用 |
| `freshness` | `fresh / stale / expired / unknown` | 表达当前性；不在概要层固定 TTL |
| `coverage` | `complete / partial / missing` | 表达覆盖缺口；`missing` 不等于正式空结果 |
| `consistency` | `coherent / conflict / unknown` | 表达局部材料能否一致解释；冲突不自动择优 |

这些状态轴彼此正交，不组成单一线性生命周期；恢复必须等待对应正式新结果，不能由一个成功轴覆盖另一个失败轴。

| 成员函数 | 作用 |
|---|---|
| `is_local_to(TopicReference topic_ref)` | 判断故障范围 |
| `tighten_for_unknown()` | 在不可判别时收紧 |
| `recover(RecoveryObservation observation)` | 根据正式新结果更新状态 |

禁止：合成全局健康/合规/readiness；让一个 owner 成功覆盖另一个 owner 失败。

##### `RecoveryPlan`

| 项 | 内容 |
|---|---|
| 所属部分 | 韧性与可访问交互 |
| 对象类型 | interaction object |
| 主要责任 | 列出针对当前失败/unknown 的安全恢复动作和禁用动作 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `plan_ref` | `RecoveryReference` | 计划引用 |
| `trigger_state` | `DegradationState` | 触发原因 |
| `allowed_actions` | `RecoveryActionSet` | requery/revalidate/reconcile/exit/keep-draft |
| `blocked_actions` | `RecoveryActionSet` | 无依据重放或越权动作 |
| `preserve_draft` | `DraftPreservationChoice` | 是否安全保留草稿 |

| 成员函数 | 作用 |
|---|---|
| `allow(RecoveryAction action)` | 暴露获准恢复动作 |
| `block(RecoveryAction action, RecoveryBlockReason reason)` | 阻止不安全动作 |
| `for_unknown(RequestPresentation request)` | 为 unknown 生成保守计划 |

禁止：隐藏 unknown、默认重放副作用、用恢复按钮改变 owner 状态。

##### `AccessibilityState`

| 项 | 内容 |
|---|---|
| 所属部分 | 韧性与可访问交互 |
| 对象类型 | interaction state |
| 主要责任 | 表达焦点、播报、键盘和非颜色语义路径的客户端状态 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `focus_target` | `FocusTargetReference` | 当前焦点 |
| `announcement` | `AnnouncementTextReference` | 可感知状态变化 |
| `keyboard_path` | `KeyboardActionPath` | 等价键盘操作路径 |
| `semantic_state` | `SemanticStatusReference` | 非颜色状态语义 |

| 成员函数 | 作用 |
|---|---|
| `move_focus(FocusTargetReference target)` | 保持安全焦点 |
| `announce(StatusPresentationView view)` | 播报状态变化 |
| `assert_equivalent(VisualAction visual_action, AssistiveAction assistive_action)` | 检查操作等价 |

禁止：以视觉可用抵消非视觉路径缺失；在播报中泄露 forbidden body。

##### `DiagnosticContext`

| 项 | 内容 |
|---|---|
| 所属部分 | 韧性与可访问交互 |
| 对象类型 | safe diagnostic record |
| 主要责任 | 记录最小交互/请求阶段诊断，不构成业务审计 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `diagnostic_ref` | `DiagnosticReference` | 诊断关联 |
| `interaction_phase` | `InteractionPhase` | 语境/query/submit/reconcile/recovery |
| `owner_ref` | `OptionalOwnerReference` | 可安全披露的 owner 标识 |
| `outcome_marker` | `SafeOutcomeMarker` | 阶段结果，不含正文 |
| `redaction_marker` | `RedactionMarker` | 证明已裁剪 |

| 成员函数 | 作用 |
|---|---|
| `redact(ForbiddenBodyPolicy policy)` | 删除不安全材料 |
| `attach(TraceReference trace_ref)` | 关联安全 trace 引用 |
| `is_safe_to_emit()` | 判断能否送诊断 sink |

禁止：保存 credential、raw/hidden body、治理/审计/evidence 正文；诊断失败不得改业务结果。

##### `ActorScopeReference`

| 项 | 内容 |
|---|---|
| 所属部分 | 访问语境与导航 |
| 对象类型 | reference object |
| 主要责任 | 回指正式 actor/scope 并表达引用有效性 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `actor_ref` | `ActorReference` | 正式 actor 引用 |
| `scope_ref` | `ScopeReference` | 正式 scope 引用 |
| `validity` | `ReferenceValidity` | 引用有效性，不是授权证明 |

| 成员函数 | 作用 |
|---|---|
| `is_current()` | 检查引用当前性 |

禁止：不保存身份正文或授权证明。

##### `VisibilityReference`

| 项 | 内容 |
|---|---|
| 所属部分 | 访问语境与导航 |
| 对象类型 | reference object |
| 主要责任 | 回指正式可见性决定与有效性 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `owner_ref` | `OwnerReference` | 决定来源 |
| `decision_ref` | `DecisionReference` | 正式决定安全引用 |
| `validity` | `ValidityMarker` | 当前可消费上限 |

| 成员函数 | 作用 |
|---|---|
| `is_restricted()` | 读取正式受限姿态 |

禁止：不成为本地 allow/deny。

##### `SourceReference`

| 项 | 内容 |
|---|---|
| 所属部分 | 来源保真视图 |
| 对象类型 | reference object |
| 主要责任 | 将视图绑定到正式 owner、对象和版本 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `owner_ref` | `OwnerReference` | 来源 owner |
| `object_ref` | `ObjectReference` | 正式对象安全引用 |
| `version_ref` | `VersionReference` | 绑定版本 |

| 成员函数 | 作用 |
|---|---|
| `matches_owner(OwnerReference owner_ref)` | 检查引用来源是否匹配 |

禁止：不复制对象正文。

##### `VersionReference`

| 项 | 内容 |
|---|---|
| 所属部分 | 来源保真视图 |
| 对象类型 | reference object |
| 主要责任 | 保留明确版本和观察时间 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `version_token` | `VersionToken` | 正式版本标记 |
| `observed_at` | `ObservedAt` | 观察时间 |

| 成员函数 | 作用 |
|---|---|
| `requires_refresh(VersionToken latest)` | 依据正式版本判断是否需重新读取 |

禁止：不以模糊 latest 替代明确版本。

##### `CommandReference`

| 项 | 内容 |
|---|---|
| 所属部分 | 受控意图与结果 |
| 对象类型 | reference object |
| 主要责任 | 回指已正式开放的 owner 命令面 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `command_ref` | `CommandReferenceId` | 正式命令引用 |
| `owner_ref` | `OwnerReference` | 命令 owner |

| 成员函数 | 作用 |
|---|---|
| `is_formally_open()` | 检查正式命令面是否开放 |

禁止：不等同命令结果。

##### `ReceiptReference`

| 项 | 内容 |
|---|---|
| 所属部分 | 受控意图与结果 |
| 对象类型 | reference object |
| 主要责任 | 保存 owner 受理事实的安全引用 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `receipt_id` | `ReceiptId` | 正式 receipt 引用 |
| `accepted_at` | `AcceptedAt` | owner 返回的受理时间 |

| 成员函数 | 作用 |
|---|---|
| `is_receipt_only()` | 明确受理与完成的区别 |

禁止：不等同 committed。

##### `QueryInteractionRecord`

| 项 | 内容 |
|---|---|
| 所属部分 | 来源保真视图 |
| 对象类型 | history record |
| 主要责任 | 记录查询阶段的最小客户端经历 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `query_ref` | `QueryReference` | 查询交互引用 |
| `phase` | `InteractionPhase` | 本地交互阶段 |
| `outcome` | `SafeOutcomeMarker` | 不含正文的结果标记 |

| 成员函数 | 作用 |
|---|---|
| `redact()` | 裁剪非安全诊断材料 |

禁止：不冒充正式 audit。

##### `SubmissionAttemptPresentation`

| 项 | 内容 |
|---|---|
| 所属部分 | 受控意图与结果 |
| 对象类型 | history record |
| 主要责任 | 记录提交尝试的最小客户端经历 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `request_ref` | `RequestReference` | 请求交互引用 |
| `phase` | `AttemptPhase` | 尝试阶段 |
| `outcome` | `SafeOutcomeMarker` | 安全结果标记 |

| 成员函数 | 作用 |
|---|---|
| `mark_unknown()` | 无法判别时记录 unknown |

禁止：不记录业务正文或生成 owner 终态。

##### `OwnerCapabilityReference`

| 项 | 内容 |
|---|---|
| 所属部分 | 管理主题组织 |
| 对象类型 | reference object |
| 主要责任 | 回指 owner 正式能力及其消费条件 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `owner_ref` | `OwnerReference` | 能力 owner |
| `capability_ref` | `CapabilityReference` | 正式能力引用 |
| `activation` | `ActivationMarker` | 正式消费条件标记 |

| 成员函数 | 作用 |
|---|---|
| `is_available()` | 读取适用能力是否可消费 |

禁止：不推导 readiness。

##### `SafeLinkReference`

| 项 | 内容 |
|---|---|
| 所属部分 | 管理主题组织 |
| 对象类型 | reference object |
| 主要责任 | 承载正式安全回链目标及其有效性 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `target_ref` | `LinkTargetReference` | 安全目标引用 |
| `validity` | `ValidityMarker` | 链接有效性 |

| 成员函数 | 作用 |
|---|---|
| `is_navigable()` | 判断是否可在当前上限内导航 |

禁止：不携带私有状态或绕过目标方资格检查。

##### `StatusPresentationView`

| 项 | 内容 |
|---|---|
| 所属部分 | 韧性与可访问交互 |
| 对象类型 | view model |
| 主要责任 | 组合局部降级状态和等价呈现语义 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `degradation` | `DegradationState` | 局部状态输入 |
| `semantic_status` | `SemanticStatusReference` | 文本和辅助路径共享的语义 |

| 成员函数 | 作用 |
|---|---|
| `compose()` | 组合已有状态，不提升任何状态轴 |

禁止：不生成统一健康结论。

##### `RecoveryViewModel`

| 项 | 内容 |
|---|---|
| 所属部分 | 韧性与可访问交互 |
| 对象类型 | view model |
| 主要责任 | 呈现当前计划和等价恢复入口 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `plan` | `RecoveryPlan` | 安全恢复计划 |
| `accessibility` | `AccessibilityState` | 等价辅助交互状态 |

| 成员函数 | 作用 |
|---|---|
| `available_actions()` | 读取获准恢复动作 |

禁止：不自动执行恢复。

##### `QualificationBoundary`

| 项 | 内容 |
|---|---|
| 所属部分 | 访问语境与导航 |
| 对象类型 | policy guard |
| 主要责任 | 约束正式资格结果的消费与最小披露 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `context_requirement` | `ContextRequirement` | 正式语境前置 |
| `redaction_limit` | `RedactionLimit` | 允许披露上限 |

| 成员函数 | 作用 |
|---|---|
| `check()` | 检查已绑定前置与披露上限 |

禁止：不生成授权决定。

##### `CoverageGuard`

| 项 | 内容 |
|---|---|
| 所属部分 | 来源保真视图 |
| 对象类型 | policy guard |
| 主要责任 | 保护结果覆盖语义 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `coverage_requirement` | `CoverageRequirement` | 当前视图所需覆盖条件 |

| 成员函数 | 作用 |
|---|---|
| `assert_coverage()` | 检查已绑定覆盖条件，保留缺口 |

禁止：不把 partial 当 complete。

##### `SubmissionEligibilityGuard`

| 项 | 内容 |
|---|---|
| 所属部分 | 受控意图与结果 |
| 对象类型 | policy guard |
| 主要责任 | 在正式提交前核验语境、可见性与命令面 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `context` | `AccessContext` | 当前语境 |
| `visibility` | `TopicVisibility` | 动作呈现上限 |
| `command_ref` | `CommandReference` | 正式命令引用 |

| 成员函数 | 作用 |
|---|---|
| `check(AccessContext context, TopicVisibility visibility, CommandReference command_ref)` | 核验当前提交前置，仅据正式资格收紧 |

禁止：不替代 Policy/Gate。

##### `TopicBoundaryGuard`

| 项 | 内容 |
|---|---|
| 所属部分 | 管理主题组织 |
| 对象类型 | policy guard |
| 主要责任 | 保护主题与 owner 能力的分区边界 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `topic_ref` | `TopicReference` | 适用主题 |
| `capability_ref` | `OwnerCapabilityReference` | 适用 owner 能力引用 |

| 成员函数 | 作用 |
|---|---|
| `check()` | 检查已绑定主题与能力的对应关系 |

禁止：不跨主题聚合 truth。

##### `RecoverySafetyGuard`

| 项 | 内容 |
|---|---|
| 所属部分 | 韧性与可访问交互 |
| 对象类型 | policy guard |
| 主要责任 | 约束恢复动作与当前请求经历一致 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `plan` | `RecoveryPlan` | 当前安全恢复计划 |
| `request` | `RequestPresentation` | 当前请求经历 |

| 成员函数 | 作用 |
|---|---|
| `check()` | 检查已绑定恢复计划是否越过 unknown 和资格上限 |

禁止：不放行无正式依据的 unknown 重放。

##### `AccessibilityEquivalenceGuard`

| 项 | 内容 |
|---|---|
| 所属部分 | 韧性与可访问交互 |
| 对象类型 | policy guard |
| 主要责任 | 约束视觉和辅助操作使用同一业务语义 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `visual_action` | `VisualAction` | 视觉操作描述 |
| `assistive_action` | `AssistiveAction` | 辅助操作描述 |

| 成员函数 | 作用 |
|---|---|
| `assert_equivalent()` | 核对已绑定操作的资格、结果和恢复语义 |

禁止：不形成第二业务路径。

<!-- auxiliary-object-cards -->

#### 7.3 主要组成部分对象正式化停审

| 组成部分 | 对象覆盖 | 结果 |
|---|---|---|
| 访问语境与导航 | `AccessContext`、`NavigationState`、生命周期/引用、`DisclosureGuard` | 通过；无认证/授权 truth |
| 来源保真视图 | snapshot、status axes、view model、reference、query guard | 通过；无 owner projection/truth |
| 受控意图与结果 | draft、request、result、receipt、completion/unknown guards | 通过；无副作用/幂等 truth |
| 管理主题组织 | visibility、activation、topic view、capability/link、boundary guards | 通过；未闭口主题保持 pending |
| 韧性与可访问交互 | degradation、recovery、a11y、diagnostic、相关 guards | 通过；无全局 health/audit |

#### 7.4 Step 8 / Step 9 反查清单

| 后续主线 | 已定义对象 | 结论 |
|---|---|---|
| 语境/入口 bootstrap | `AccessContext`、`ContextLifecycleState`、`NavigationState`、`DisclosureGuard` | 可展开 |
| owner-safe query | `OwnerViewSnapshot`、`SourceStatusAxes`、`OwnerViewModel`、`QueryNoWriteGuard` | 可展开 |
| controlled submit | `DraftIntent`、`RequestPresentation`、`CommandReference`、`CompletionGuard` | 可展开 |
| unknown reconcile | `ResultReference`、`UnknownReplayGuard`、`RecoveryPlan` | 可展开 |
| topic composition | `TopicVisibility`、`TopicViewModel`、`OwnerActivationGuard` | 可展开 |
| invalidation/recovery/a11y | `DegradationState`、`RecoveryPlan`、`AccessibilityState`、`DiagnosticContext` | 可展开 |

#### 7.5 跨对象一致性审计

- `AccessContext` 只引用正式语境；`TopicVisibility` 只引用正式可见性；二者不互相生成授权。
- `OwnerViewSnapshot` 的 `SourceStatusAxes` 不被 `TopicViewModel` 压平；`DegradationState` 只表达局部呈现姿态。
- `RequestPresentation` 的 `phase` 不等同 `ResultReference.result_state`；`CompletionGuard` 只接受 owner 正式结果。
- `ReceiptReference`、`CommandReference`、`ResultReference` 生命周期角色分离；没有把 receipt 当 committed。
- 诊断/history 对象没有业务正文、evidence/audit 正文或 forbidden body。

#### 7.6 对象卡完整性与省略项统一说明

本步对每张对象卡执行“基本信息 → 字段类型 → 状态（如有）→ 成员函数（如有）→ 工厂函数（如有）→ 禁止事项”的静态门禁。下列对象没有单独列出某类表格，是因为该类对象在概要层没有可承接的额外行为；省略不表示把行为隐式留给后续步骤。

| 对象 / 对象组 | 省略项 | 省略原因与后续承接 |
|---|---|---|
| `ContextLifecycleState` | 字段、成员函数、工厂函数 | 仅是生命周期状态集合；迁移触发由 Step 9 的语境状态流转说明，具体枚举承载留给 03。 |
| `SourceStatusAxes` | 工厂函数 | 由 `OwnerViewSnapshot` 从 owner-safe result 构造；独立工厂不会增加边界语义。 |
| `ReferenceSet` | 状态集合、工厂函数 | 只是安全引用集合；增删/撤销行为已由成员函数表达，集合初始化留给详细设计。 |
| `QueryNoWriteGuard`、`CompletionGuard`、`UnknownReplayGuard` | 工厂函数 | guard 由应用编排注入，不能自行决定策略来源；构造与依赖注入留给 03。 |
| `TopicActivationState` | 字段、成员函数、工厂函数 | 仅表达能力级状态集合；能力判定由 `OwnerActivationGuard` 和 Step 7 接缝承接。 |
| `OwnerActivationGuard` | 字段、工厂函数 | 规则来源是正式 owner contract；概要层只需保留检查函数和 fail-closed 禁止事项。 |
| `DegradationState` | 工厂函数 | 由 owner-safe result、失效提示或恢复观察生成；具体来源组合留给 Step 8/10/03。 |
| `RecoveryPlan` | 状态集合、工厂函数 | 计划是一次交互决策载体，不拥有独立生命周期；由 Step 8/9 依据局部 degradation 构造。 |
| `AccessibilityState` | 状态集合、工厂函数 | 焦点、播报和键盘路径是组合交互状态；语义等价检查由 guard 承接。 |
| `DiagnosticContext` | 状态集合、工厂函数 | 仅为可裁剪记录；由诊断边界在 emit 前构造，不形成业务生命周期。 |
| `ActorScopeReference`、`VisibilityReference`、`SourceReference`、`VersionReference`、`CommandReference`、`ReceiptReference`、`OwnerCapabilityReference`、`SafeLinkReference` | 独立状态/工厂表 | 统一安全 reference 形态；状态仅为 validity marker，构造来自正式 result/ref，避免在 Console 生成第二套生命周期。 |
| `QueryInteractionRecord`、`SubmissionAttemptPresentation` | 字段以最小摘要收口 | history 仅承载交互经历，详细保留/清理规则交给 Step 10/11；不扩展为 audit record。 |
| `StatusPresentationView`、`RecoveryViewModel` | 工厂函数 | 由对应 state/plan 组合得到的呈现模型；构造不应自行改变状态，留给 Step 8/03。 |
| `DisclosureGuard`、`QualificationBoundary`、`CoverageGuard`、`SubmissionEligibilityGuard`、`TopicBoundaryGuard`、`RecoverySafetyGuard`、`AccessibilityEquivalenceGuard` | 部分字段/工厂表 | guard 的概要责任是约束检查；正式规则来自 owner/SDK 或共享标准，不能在 Console 再造一套字段和构造路径。 |

统一函数参数审计结论：所有已列函数均使用 `TypeName param_name`；无参数函数仅保留空参数列表。未列返回类型、trait、泛型、生命周期、序列化 schema、数据库列和实现体，符合概要层深度。所有字段类型均为概要层命名类型，尚未伪装为 owner exact schema。

#### 7.7 Step 6 三层门禁记录

| 门禁 | 结论 | 证据 |
|---|---|---|
| Step / 模块级 | `pass` | 候选池、对象卡、函数参数类型、禁止事项、Step 8/9 反查和省略项说明均完成。 |
| 文档级 | `pass` | Step 5→6 的对象主语连续；无 API DTO、port、repository、owner aggregate 越界；正式正文仍锁定至 Step 14。 |
| 项目级 | `pass` | 台账可切换到 Step 7；持续 blocker 原样保留，不因对象骨架而关闭。 |

### 8. 回填草稿

正式 §6 回填候选池筛选表、对象分布摘要和关键对象卡的收口字段/状态/函数/禁止事项；完整诊断、逐部分停审和反查清单留在本文件。正式正文不加入 API DTO、目录、owner domain 或实现代码。

### 9. 待确认事项

- safe-field、reference 类型和 owner result 状态的精确 schema 仍待 owner/SDK 合同；当前仅保留类型骨架。
- 客户端状态介质、草稿跨会话生命周期、诊断 envelope、a11y 支持矩阵留给 Step 10～11、03/04/05。
- 若后续发现对象包含 owner truth、幂等依据或 forbidden body，必须回退本 Step 删除或降级为外部 reference。

### 10. 进入下一步条件

- 候选池筛选完成；每个关键对象至少有基本信息和适用的字段/状态/函数/工厂/禁止事项。
- API、DTO、port、repository、owner domain 未被误写为本地关键对象。
- Step 8/9 反查无未定义主语，跨对象边界无 unresolved 冲突。
- 对无状态、无行为或无独立构造语义的对象已记录省略原因，不能以“未展开”掩盖缺口。
- 三层门禁通过；允许进入 Step 7 API/接口骨架。
