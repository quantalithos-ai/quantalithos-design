## Step 8. 关键处理流 / 重要函数数据流

### 1. Step 状态

- 状态：[x] 已确认
- 对应 SOP：`standards/document/概要设计讨论流程_SOP.md` Step 8
- 回填章节：正式 `02-概要设计.md` §8「关键处理流 / 重要函数数据流」

#### 1.1 Step 内计划

- [x] 读取 Step 7 接口、Step 6 对象和 Step 5 五个主要组成部分
- [x] 确定通用读路径、本地交互写路径和委托 owner command 路径
- [x] 按五个主要组成部分选择必须独立展开的关键流
- [x] 为每条关键流绘制规范 ASCII 图并补边界/禁止事项/详细设计承接
- [x] 明确无 Outbound Event/Operations Job 路径及可选 invalidation consumer 的 activation 条件
- [x] 完成接口覆盖、对象引用、跨部分接缝、函数参数类型和跨流一致性审计

### 2. 本步输入

- `design-calibration/02_hld_step_07_api_interface_skeleton.md`
- `design-calibration/02_hld_step_06_key_objects.md`
- `design-calibration/02_hld_step_05_components_boundary.md`
- `projects/L5-console/00-需求文档.md` §7～§10、§12～§14
- `projects/L5-console/01-架构设计.md` §9～§10、§13
- `standards/document/概要设计书写规范.md` §4.8

### 3. SOP 问题回答

1. **关键 Command 的写路径如何组织？**

   本地交互 Command 只经过 Inbound → Application Service → Console-owned state/guard → presentation；不会进入 owner repository/outbox。`SubmitControlledIntent` 经过提交前重验、`SubmissionEligibilityGuard`、`OwnerCommandPort`/`L0-sdk`，然后只保存 `RequestPresentation` 和安全 receipt/result/ref；owner 业务写入、事务、outbox 和终态均在正式 owner 边界之外。

2. **关键 Query 如何读取？**

   Query 从入口验证 `AccessContext`，经过 `QueryNoWriteGuard` 和 owner-specific query port，得到 owner-safe result，再构造 `OwnerViewSnapshot`、`SourceStatusAxes`、`OwnerViewModel`/`TopicViewModel`。partial/stale/unavailable/conflict/unknown 进入局部 `DegradationState`，不会触发隐式 command、projection refresh 或跨域补数据。

3. **Inbound Event 如何处理？**

   只有可选 `ConsumeSdkInvalidationHint`：验证正式来源/envelope、裁剪 forbidden body、标记相关 snapshot stale/invalidated，并要求显式 requery/revalidation。它不执行 owner command、不维护 cursor/replay、不以 event 表示 owner 终态。

4. **Operations Job 如何处理？**

   本仓没有 Operations Job。requery、revalidate、reconcile 都是显式 Query/Recovery Action；owner 的发布、归档、sandbox、对账、重建和长时任务不迁入 Console。

5. **函数调用参数是否具备类型？**

   是。图中所有被点名的调用都采用 `TypeName param_name`，例如 `DisclosureGuard.check(AccessContext context, DisclosureTarget target)`、`OwnerViewCompositionService.query(OwnerViewQuery query, AccessContext context)`。不写完整签名、返回类型或实现体。

6. **哪些处理步骤必须在概要层点名？**

   必须点名：语境解析/重验、最小披露、query no-write、owner/source 多轴保真、草稿/复核/提交分离、receipt/result/unknown 分层、正式 reconciliation、owner-specific topic 组合、局部降级、安全恢复和 a11y 等价。具体路由、component、protocol schema、retry 数值、错误码和存储实现留给 03。

7. **哪些流必须独立画图？**

   `SubmitControlledIntent` 是 P0 Command，必须独立；语境 bootstrap、owner-safe query、result reconciliation 和 recovery 包含关键安全边界，也独立；八类主题使用一张通用 owner-partitioned 流并保留主题差异表；可选 invalidation consumer 因会修改本地失效状态而独立说明。

8. **Query 是否可只写通用读路径？**

   简单状态读取可归入通用读路径；语境、owner view、topic view 和 reconciliation 涉及裁剪、fallback、partial/unknown 或结果终态，必须独立展开。`GetSourceStatus`、`GetSafeLink`、`GetRequestPresentation`、`GetTopicActivation` 可由相应主流覆盖。

9. **每条流的归属、接口和对象是否明确？**

   明确，见 §7.2 覆盖表。跨部分接缝只传 `AccessContext`、safe view/ref、`RequestPresentation`、`DegradationState` 等 Step 6 对象，不传 owner raw body 或私有状态。

10. **是否存在接口无处理流、对象未定义或跨部分接缝未说明？**

    没有。Step 7 所有核心接口均由独立流或通用流覆盖；所有正式对象均来自 Step 6。Outbound Event/Operations Job 因明确不适用而无处理流，不是遗漏。

### 4. 当前文档问题诊断

| 材料/位置 | 当前问题 | 修正 |
|---|---|---|
| 旧 `02` §7 | 只有跨模块箭头和技术调用词，缺少语境/资格、结果分层和 owner 多轴状态 | 以可信交互主线重建七条处理流 |
| 旧 action 流 | UI 点击→API→toast 容易被理解为完成 | 加入提交前重验、receipt/pending/unknown、正式 result 和 reconciliation guard |
| 旧 dashboard 流 | 多 owner 结果合并成统一看板 | 按 owner 构造 snapshot/view/status axes，局部降级不合成 verdict |
| draft/Workspace 参考 | projection/cursor/rebuild/event replay 可能迁入客户端 | 事件只做可选失效提示；无 projection、cursor、replay 或后台 rebuild |
| 可访问路径 | 被当成组件层补充而非主流的一部分 | 每条流末端都更新同一 `StatusPresentationView` 和 `AccessibilityState` |

### 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 流程起点 | 页面/按钮/外部服务混排 | Step 7 的正式 Query/Command/Event 入口 | 保持接口可追溯 |
| 查询 | 请求→数据→卡片 | context/guard→formal query→snapshot/status→view/degradation | 保留 no-write 和来源状态 |
| 命令 | 提交→成功提示 | draft/review→revalidate→owner seam→receipt/result/unknown | 防止非正式成功收口 |
| 主题 | 所有 owner 汇入 dashboard | 按 owner 独立 adapter、状态轴、activation 和局部失败 | 不制造跨域 truth |
| 恢复/a11y | 错误页和重试按钮 | safety guard→获准恢复动作→同一语义 view/focus/announcement | 防止重复副作用和辅助路径漂移 |

### 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A：每个页面画一条流 | 页面直观 | 大量重复且把组件当设计主语 | 不采用 |
| 方案 B：只画一条通用 SDK 流 | 简短 | 无法说明 command/unknown/topic/recovery 的关键边界 | 不采用 |
| 方案 C：按可信交互阶段画七条主流，主题用 owner-partitioned 模板 | 覆盖安全边界且避免八主题复制 | 需用覆盖表确保接口不遗漏 | 采用 |

### 7. 结构化中间产物

#### 7.1 通用处理流骨架

```text
用户意图 / 直接入口 / 正式 SDK 提示
                  │
                  ▼
Inbound Entry
  - 绑定 AccessContext / CommandMetadata
  - 阻止未验证语境和 forbidden body
                  │
                  ▼
Application Service
  - 调用 guard 保持 disclosure / no-write / completion / recovery 不变量
  - 选择正式 SDK / owner port，不访问数据库或私有 bus
                  │
                  ▼
Interaction Object / Safe View / Reference
  - 只更新 Console interaction truth
  - 或构造可失效 owner-safe snapshot/ref
                  │
                  ▼
Presentation + AccessibilityState
  - 保留 source/freshness/coverage/availability/consistency
  - 呈现 submitted/accepted/pending/confirmed/rejected/unknown
```

关键说明：

- 所有路径先受正式语境与最小披露约束；UI route、menu、flag 不能授权。
- Query 只构造可失效 view/ref；Command 若触发 owner 副作用，只通过正式 port 委托。
- 流程末端是呈现和可访问状态，不是 owner truth、audit、evidence 或 readiness。
- 图不表达协议字段、组件树、数据库、事务实现、错误码、retry 参数或详细时序。

#### 7.2 处理流覆盖清单

| 主要组成部分 | 接口 / 能力 | 独立处理流 | 使用对象 | 覆盖结论 |
|---|---|---|---|---|
| 访问语境与导航 | `ResolveAccessContext`、`GetNavigationVisibility`、`RequestAccessContextSwitch` | 语境 bootstrap/revalidation | `AccessContext`、`NavigationState`、`TopicVisibility`、`DisclosureGuard` | 覆盖 |
| 来源保真视图 | `QueryOwnerView`、`GetSourceStatus`、`GetSafeLink` | owner-safe query/no-write | `OwnerViewSnapshot`、`SourceStatusAxes`、`OwnerViewModel`、`ReferenceSet` | 覆盖 |
| 受控意图与结果 | draft/preference、`SubmitControlledIntent` | 本地草稿/偏好流 + 受控提交流 | `DraftIntent`、`RequestPresentation`、`CompletionGuard` | 覆盖 |
| 受控意图与结果 | `GetRequestPresentation`、`ReconcileRequestResult` | receipt/result/reconciliation | `RequestPresentation`、`ResultReference`、`UnknownReplayGuard` | 覆盖 |
| 管理主题组织 | 八类 Topic Query、`GetTopicActivation` | owner-partitioned 主题组合 | `TopicVisibility`、`TopicViewModel`、`TopicActivationState` | 覆盖 |
| 韧性与可访问交互 | `ConsumeSdkInvalidationHint` | 可选失效提示流 | `DegradationState`、`DiagnosticContext` | 条件覆盖；activation pending |
| 韧性与可访问交互 | `ApplyRecoveryAction`、状态/a11y Query | 恢复与可访问反馈流 | `RecoveryPlan`、`AccessibilityState`、`StatusPresentationView` | 覆盖 |
| 全仓 | Outbound Event / Operations Job | 不画 | 不适用 | Step 7 已确认不存在自有事实事件和后台作业 |

#### 7.3 `ResolveAccessContext` / `GetNavigationVisibility` 处理流

```text
AccessContextQuery / DirectEntry / ContextSwitchIntent
                  │
                  ▼
ConsoleEntry
  - 读取 SessionReference session_ref
  - 不从 URL / menu / local role 推导权限
                  │
                  ▼
AccessContextService
  - 调用 resolve(AccessContextQuery query, ActorContext actor_context)
  - 经 SdkAccessPort / VisibilityQualificationPort 请求正式语境与可见性
                  │
                  ▼
AccessContext + DisclosureGuard
  - 调用 check(AccessContext context, DisclosureTarget target)
  - verified 才允许适用披露；restricted/expired/revoked/conflict/unknown 收紧
                  │
                  ▼
NavigationService
  - 调用 apply_visibility(TopicVisibility posture)
  - 清理失效入口、敏感选择和旧 safe links
                  │
                  ▼
NavigationViewModel + AccessibilityState
  - 呈现当前语境或最小披露恢复方向
  - 焦点与播报反映同一正式姿态
```

关键设计点：

- 语境切换是“请求正式重验 + 更新交互经历”，不是 Console 签发 scope 或权限。
- 无法验证时整体 fail-closed；不能用旧 cache、route 或页面存在继续披露。
- 直接入口和普通导航共用同一 guard；不得形成绕过路径。
- 03 继续展开入口适配、失效清理顺序、错误映射和焦点策略，不定义 owner scope hierarchy。

#### 7.4 `QueryOwnerView` 处理流

```text
OwnerViewQuery
  - AccessContext context
  - FilterIntent filter / PaginationRequest page
                  │
                  ▼
QueryEntry
  - 调用 QueryNoWriteGuard.assert_read_only(QueryIntent query)
  - 应用 DisclosureGuard 和 owner activation 上限
                  │
                  ▼
OwnerViewCompositionService
  - 调用 query(OwnerViewQuery query, AccessContext context)
  - 经 OwnerQueryPort / L0-sdk 获取 owner-safe result
                  │
                  ▼
OwnerViewSnapshot.from_owner_result(OwnerSafeResult result, AccessContext context)
  - 保留 OwnerReference / SourceReference / VersionReference
  - 构造 SourceStatusAxes，不填补 missing/partial 字段
                  │
                  ▼
OwnerViewModel.compose(OwnerViewSnapshot snapshot)
  - 筛选/排序/分页只作用于已获准结果
  - SafeLinkReference 失效或撤销即移除
                  │
                  ▼
OwnerViewModel + DegradationState + AccessibilityState
  - 区分 empty / missing / restricted / partial / stale / unavailable / conflict / unknown
  - 不合成 health / compliance / readiness
```

关键设计点：

- Query 的所有探索动作 no-write；不得触发 owner command、cursor 推进、projection rebuild 或隐式 refresh。
- snapshot 是可失效消费结果，不是 owner projection/current truth；raw/hidden body 不进入 view/cache/error/diagnostic。
- 多 owner 查询必须有界且可归因；某 owner 失败只影响相关区域，其他成功不能覆盖失败。
- 03 继续展开 adapter mapping、cache invalidation、分页/排序能力协商和 safe-field 映射；exact contract 仍 pending。

#### 7.5 本地草稿、偏好与复核处理流

```text
DraftEdit / ClientPreferenceCommand / DiscardDraftIntent
                  │
                  ▼
IntentEntry
  - 绑定 AccessContext context 和 CommandMetadata metadata
  - 过滤 forbidden body，拒绝把 owner 正文复制进草稿
                  │
                  ▼
IntentReviewService
  - 调用 edit(DraftPatch patch)
  - 调用 validate(ClientValidationContext context)
  - 调用 prepare_submission(AccessContext context) 或 discard(DiscardReason reason)
                  │
                  ▼
DraftIntent / ClientPreference
  - 只更新 Console-owned interaction truth
  - editing / reviewable / invalid / submitted / discarded
                  │
                  ▼
IntentReviewView + AccessibilityState
  - 呈现字段错误、危险影响和明确确认入口
  - 不显示为 owner 已创建、更新或发布
```

关键设计点：

- 本地校验只检查格式和需求级可复核条件，不替代 owner 业务校验、Policy/Gate 或资格。
- 偏好只影响布局/筛选/入口便利性；不得改变权限、状态解释、业务优先级或结果语义。
- 草稿跨会话/设备生命周期和清理介质仍 pending；退出/语境变化时必须遵守最小保留和安全清理。
- 03/04 继续展开状态载体、清理触发和配置注入，不定义 owner draft schema。

#### 7.6 `SubmitControlledIntent` 处理流

```text
ControlledIntentCommand
  - DraftReference draft_ref
  - AccessContext context / CommandMetadata metadata
                  │
                  ▼
SubmitEntry
  - 要求用户显式确认
  - 重新解析 actor/scope/visibility/qualification
                  │
                  ▼
IntentReviewService
  - 调用 SubmissionEligibilityGuard.check(
      AccessContext context,
      TopicVisibility visibility,
      CommandReference command_ref)
  - 调用 CompletionGuard.reject_transport_success(TransportOutcome outcome)
                  │
                  ▼
OwnerCommandPort / L0-sdk
  - 仅在正式 surface active 时提交
  - 传递 CommandMetadata metadata
  - 仅在 owner 正式提供时传递 OptionalIdempotencyKey idempotency_key
                  │
                  ▼
RequestPresentation
  - mark_submitted(CommandAttemptReference attempt_ref)
  - receipt -> accepted/pending，不是 confirmed
  - interruption/ambiguous -> unknown
                  │
                  ▼
RequestPresentation + AccessibilityState
  - 明确 submitted / accepted / pending / rejected / unknown
  - 只有正式 ResultReference 可进入 confirmed/rejected 终态
```

关键设计点：

- 这是委托 owner 的 P0 Command 流；Console 事务只覆盖本地交互状态，不覆盖 owner 业务事务。
- eligibility 必须在提交前重验；页面曾显示按钮或草稿曾可提交都不能替代当前资格。
- transport success、HTTP/SDK success、receipt、toast、刷新或 cache 均不得进入 confirmed。
- 无正式幂等/reconciliation 依据的 unknown 不自动重放；详细设计必须保留 interruption 与 ambiguous response 测试切口。

#### 7.7 `GetRequestPresentation` / `ReconcileRequestResult` 处理流

```text
RequestStatusQuery / ReconciliationQuery
  - RequestReference request_ref
  - OptionalReceiptReference receipt_ref
                  │
                  ▼
ReconcileTrigger
  - 重验 AccessContext context
  - 调用 UnknownReplayGuard.block_without_basis(UnknownRequest request)
                  │
                  ▼
ResultReconciliationPort / L0-sdk
  - 仅使用 owner 正式 receipt/result/ref 回查
  - 无正式 surface -> 保持 unknown/blocked
                  │
                  ▼
ResultReference
  - 校验 OwnerReference / OwnerResultState / ObservedAt
  - 调用 CompletionGuard.assert_terminal(ResultReference result_ref)
                  │
                  ▼
RequestPresentation.apply_result(ResultReference result_ref)
  - 正式 confirmed/rejected 才收口
  - pending/unknown 保留后续显式回查或安全退出
                  │
                  ▼
ResultPresentationView + RecoveryPlan + AccessibilityState
```

关键设计点：

- reconciliation 是 Query，不隐式重发 command；刷新页面也不等于重新提交或确认。
- owner 没有正式回查能力时，Console 必须诚实停在 unknown/blocked，并给出退出、保留草稿或联系正式支持的安全方向。
- `RequestPresentation.phase` 与 `ResultReference.result_state` 是两层状态；不能相互伪造。
- 03 继续展开 receipt/ref 映射、终态错误映射和过期/撤销清理，不定义 owner 终态机。

#### 7.8 Owner-partitioned 管理主题组合处理流

```text
TopicViewQuery
  - TopicReference topic_ref / AccessContext context
                  │
                  ▼
TopicEntry
  - 调用 OwnerActivationGuard.check(OwnerContractStatus contract, AccessContext context)
  - pending/read_only/partial/blocked 先于页面内容
                  │
                  ▼
TopicCompositionService
  - 按 owner 拆分 QueryMember / ProjectWorkspace / Method / Governance
    / Observability / Capability / Archive / Sandbox 请求
  - 每个请求经独立 OwnerQueryPort / L0-sdk
                  │
                  ▼
OwnerViewSnapshotSet
  - 每个 owner 独立 SourceStatusAxes 和 ReferenceSet
  - 单一 owner 失败只形成局部 DegradationState
                  │
                  ▼
TopicViewModel.compose(OwnerViewModel view)
  - action_entries 只在正式 command surface + qualification 成立时出现
  - links 只保留 SafeLinkReference
                  │
                  ▼
TopicViewModel + 局部状态 + AccessibilityState
  - 不合成统一 health/compliance/audit/readiness
```

关键设计点：

- 八类主题共享编排骨架，但 owner、safe-field、activation、状态轴和失败姿态必须独立。
- Governance/SoA/AIIA/Control/Gate、audit/metric、Capability、Archive、Sandbox 只能显示正式状态/ref，不能由卡片颜色或阈值生成结论。
- action entry 只表示可发起受控意图，实际提交仍回到 §7.6；主题页面不能绕过 `SubmissionEligibilityGuard`。
- 03 应按 owner adapter 和页面/view model 拆分测试切口；当前 exact owner surface 全部保持 pending。

#### 7.9 `ConsumeSdkInvalidationHint` 处理流（条件化）

```text
SdkInvalidationHintEvent
  - EventId event_id / EventSourceReference source_ref
  - InvalidationEnvelopeReference envelope_ref
                  │
                  ▼
SdkHintConsumer
  - 验证正式 SDK 来源和 envelope
  - 丢弃 raw payload / forbidden body
                  │
                  ▼
DegradationRecoveryService
  - 标记相关 OwnerViewSnapshot stale/invalidated
  - 生成 RevalidationRequiredMarker marker
                  │
                  ▼
DegradationState + NavigationState
  - 敏感入口即时收紧
  - 等待显式 ResolveAccessContext / QueryOwnerView / ReconcileRequestResult
                  │
                  ▼
StatusPresentationView + AccessibilityState
```

关键设计点：

- 本流只有正式 SDK event contract 激活后才成立；当前 `pending`，不能用私有 bus 或 owner 内部事件替代。
- event 只使本地安全影子失效，不代表业务事实已经变化或某 command 已完成。
- 不维护 cursor、replay、projection 或 event body；重复/乱序语义由正式 envelope 和详细设计继续收口。
- 无事件 surface 时使用显式 Query，不影响核心闭环成立。

#### 7.10 `ApplyRecoveryAction` 与可访问反馈处理流

```text
RecoveryActionCommand
  - RecoveryReference plan_ref / AccessContext context
                  │
                  ▼
RecoveryActionEntry
  - 调用 RecoverySafetyGuard.check(RecoveryPlan plan, RequestPresentation request)
  - 调用 AccessibilityEquivalenceGuard.assert_equivalent(
      VisualAction visual_action,
      AssistiveAction assistive_action)
                  │
                  ▼
DegradationRecoveryService
  - requery -> QueryOwnerView
  - revalidate -> ResolveAccessContext
  - reconcile -> ReconcileRequestResult
  - keep-draft / exit -> 只更新本地交互状态
  - unsafe retry -> blocked
                  │
                  ▼
RecoveryPlan + DegradationState
  - 每个 owner/topic/interaction 独立恢复
  - 正式新结果到达前不把状态提升为成功
                  │
                  ▼
StatusPresentationView + AccessibilityState
  - 保持焦点、播报状态变化、提供键盘/辅助技术等价路径
  - 诊断仅发安全 DiagnosticContext，sink 失败不改业务姿态
```

关键设计点：

- 恢复动作由故障类型决定：语境失效重验、Query 失败重查、unknown command 回查；不能统一成“重试”。
- unknown 副作用在缺正式 reconciliation/幂等依据时明确阻断 retry。
- a11y 路径共享同一 guard、result 和 recovery plan，不形成第二资格或业务路径。
- 03 继续展开焦点恢复、播报去重、诊断 redaction 和每种失败的适配器错误映射。

#### 7.11 未独立展开处理流的取舍

| 接口 | 归入的主流 | 不独立画图原因 |
|---|---|---|
| `GetSourceStatus`、`GetSafeLink` | `QueryOwnerView` | 都是 owner-safe Query 的状态/ref 分支，不新增写入或终态语义。 |
| `SaveClientPreference`、`DiscardDraftIntent` | 本地草稿、偏好与复核流 | 同为 Console-owned state 写入，无 owner 副作用。 |
| `GetRequestPresentation` | reconciliation 流 | 本地读取分支由同一 request/result 分层覆盖。 |
| 八类主题 Query | owner-partitioned 主题组合流 | 编排结构相同；owner、activation 和安全字段差异已由接口表保留。 |
| `GetDegradationStatus`、`GetAccessibilityState` | recovery/a11y 流 | 只读同一局部状态和呈现，不新增处理边界。 |
| Outbound Event / Operations Job | 不适用 | Step 7 已确认不存在 Console-owned 事实传播或后台任务。 |

#### 7.12 五个主要组成部分处理流停审

| 组成部分 | 接口覆盖 | 对象覆盖 | 边界检查 | 结果 |
|---|---|---|---|---|
| 访问语境与导航 | bootstrap、visibility、context switch | `AccessContext`、`NavigationState`、`DisclosureGuard` | 无本地认证/授权/scope truth | 通过 |
| 来源保真视图 | owner query、source status、safe link | snapshot/status/view/ref/query guard | no-write、无 projection/cursor、保留多轴 | 通过 |
| 受控意图与结果 | draft、submit、request/result/reconcile | draft/request/result/completion/unknown guards | receipt 不等于完成、unknown 不重放 | 通过 |
| 管理主题组织 | 八类 topic query、activation、action entry | visibility/activation/topic view/ref | owner 分区、正向入口条件化 | 通过 |
| 韧性与可访问交互 | invalidation、recovery、status/a11y/diagnostic | degradation/recovery/a11y/diagnostic | 局部恢复、同义路径、无全局 health/audit | 通过 |

#### 7.13 跨处理流一致性审计

| 审计项 | 结论 |
|---|---|
| 接口覆盖 | Step 7 所有核心接口均由独立或合并流覆盖；无 Event/Job 的原因明确。 |
| 对象引用 | 图中正式对象均在 Step 6 定义；额外名称仅为 Step 7 DTO/entry/port 类型，不升级为 domain object。 |
| 参数类型 | 所有显式函数调用使用 `TypeName param_name`；未出现裸参数、完整签名或实现体。 |
| 跨部分接缝 | 只传 `AccessContext`、safe view/ref、request/result、degradation/recovery 等安全对象；不传 owner raw body。 |
| Query/Command | Query no-write；本地 Command 只改 interaction truth；owner Command 只经 formal port 委托。 |
| 结果与恢复 | submitted/accepted/pending/confirmed/rejected/unknown 分层；unknown 无依据不重放；恢复按原因分流。 |
| 状态传播 | SDK hint 只使本地影子失效；正式新 Query/Result 才更新呈现；不伪造 owner state propagation。 |
| 事务边界 | 仅声明本地交互状态与 owner formal seam 分离；未虚构跨 owner 原子事务、outbox 或数据库。 |
| Pending 保真 | exact surface、scope、visibility、safe-field、reconciliation、event envelope、activation、诊断和量化均未关闭。 |

### 8. 回填草稿

正式 §8 回填：通用处理流骨架、处理流覆盖清单、语境 bootstrap、owner-safe query、本地草稿/偏好、受控提交、reconciliation、owner-partitioned topic、条件化 invalidation、recovery/a11y 九组图及其关键设计点，以及未独立展开接口的简表。正式正文不回填诊断、方案比较、停审过程和三层门禁记录。

图中保留 `TypeName param_name` 形式的关键函数调用，但不加入完整伪代码、HTTP/RPC、JSON/proto、SQL/DDL、错误码全集、retry 参数、组件时序或事务实现。

### 9. 待确认事项

- 各 owner exact Query/Command/Result/Ref、safe-field 和 activation 决定 §7.4～§7.9 中具体 adapter 分支；当前只收稳共同安全骨架。
- scope/visibility/qualification/reason/redaction 未闭口，所有受保护流继续以 fail-closed、最小披露和客户端只能收紧为前置。
- unknown reconciliation、幂等和 owner 终态语义未闭口；§7.6～§7.7 不允许自动重放或本地确认。
- SDK invalidation envelope、重复/乱序和失效范围未闭口；§7.9 仍为条件化 `pending`，显式 Query 是核心路径。
- 客户端状态介质、缓存失效时间、草稿/偏好生命周期、诊断 envelope 和 a11y 支持矩阵交给 Step 10～11 和 03/04/05。

### 10. 进入下一步条件与三层门禁

- 通用读/写/委托边界已明确；每个关键流有规范 ASCII 图和边界、禁止事项、详细设计承接说明。
- P0 `SubmitControlledIntent`、复杂 Query、状态写入型可选 Consumer 和 Recovery 均有独立流。
- 五个主要组成部分均完成处理流停审，跨流接口、对象、参数、接缝和 pending 审计无 unresolved 冲突。
- 没有引入数据库、repository、outbox、projection、worker、私有 bus、完整 schema、错误码或实现代码。

| 门禁 | 结论 | 证据 |
|---|---|---|
| Step / 模块级 | `pass` | 九组图、覆盖表、逐部分停审、未展开理由和跨流审计完成。 |
| 文档级 | `pass` | Step 7 接口与 Step 6 对象均有对应处理口径；未出现未定义主语或越层实现。 |
| 项目级 | `pass` | 允许进入 Step 9 状态机；正式 `02` 仍锁定至 Step 14，持续 blocker 原样传递。 |
