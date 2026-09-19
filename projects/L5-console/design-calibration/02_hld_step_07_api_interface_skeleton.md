## Step 7. API / 接口骨架

### 1. Step 状态

- 状态：[x] 已确认
- 对应 SOP：`standards/document/概要设计讨论流程_SOP.md` Step 7
- 回填章节：正式 `02-概要设计.md` §7「API / 接口骨架」

#### 1.1 Step 内计划

- [x] 读取 Step 6 关键对象、Step 5 五个主要组成部分和正式 00/01 接缝
- [x] 先按五个主要组成部分分别收敛接口候选，再做统一分类审计
- [x] 明确 Command、Query、Inbound Event Consumer、Outbound Event、Operations Job 的适用范围
- [x] 为每个接口写输入/输出类型骨架、读写性质、对象承接和边界
- [x] 处理 `ActorContext`、`AccessContext`、`CommandMetadata`、`IdempotencyKey`、event id、source ref 和 envelope 的必要性
- [x] 完成接口归属停审、跨接口一致性审计、回填草稿和三层门禁

### 2. 本步输入

- `design-calibration/02_hld_step_06_key_objects.md`
- `design-calibration/02_hld_step_05_components_boundary.md`
- `design-calibration/02_hld_step_04_code_subject_framework.md`
- `projects/L5-console/00-需求文档.md` §12「接口与依赖」
- `projects/L5-console/01-架构设计.md` §8～§10「依赖方向、数据所有权、关键交互」
- `standards/document/概要设计书写规范.md` §4.7

### 3. SOP 问题回答

1. **哪些接口属于 Command，负责改写真相？**

   Console 没有 owner 业务真相的本地 Command。概要层仍需点名三类受控用例入口：`RequestAccessContextSwitch` 只更新客户端语境转换经历；`SaveClientPreference` 和 `DiscardDraftIntent` 只更新 Console 交互 truth；`SubmitControlledIntent` 将经过复核的意图交给正式 owner command seam，不在 Console 写 owner truth。它们的结果都只能是本地呈现或正式边界返回的 receipt/result 引用，不能由 Console 生成业务终态。

2. **哪些接口属于 Query，只读取投影或只读视图？**

   语境解析、导航可见性、owner-safe 视图、八类主题视图、请求状态和正式 reconciliation 均属于 Query。Query 只经 `L0-sdk` 或 owner formal service 读取安全结果，按 owner 保留 source、freshness、coverage、availability、consistency；筛选、排序、分页、下钻和预取不产生业务写入。

3. **哪些外部事实需要通过 Inbound Event Consumer 进入本仓？**

   当前仅保留可选的 `ConsumeSdkInvalidationHint` 骨架，用于把正式 SDK/服务边界的失效提示转为本地 `DegradationState`、`RevalidationRequiredMarker` 或待回查姿态。它不消费私有 bus，不复制 owner 事件，不保存事件正文；如果正式 SDK 没有该 surface，事件消费者保持 `pending`，核心路径使用显式 Query。

4. **哪些已提交事实需要通过 Outbound Event 对外传播？**

   当前没有 Console-owned 业务事实需要通过 Outbound Event 传播。导航、草稿、偏好、请求呈现、恢复和 a11y 状态均是客户端交互 truth，不向 owner 或下游宣称业务事实。若未来需要诊断输出，只能走正式 observability 接缝的安全诊断引用，不构成本仓 Outbound Event。

5. **哪些恢复、发布、重建、对账动作属于 Operations Job，而不是业务 command？**

   Console 不拥有后台 job、projection rebuild、发布、重建或对账 worker。`RequeryOwnerView`、`ReconcileRequestResult`、`RevalidateAccessContext` 是用户/客户端显式触发的 Query 或 Recovery Action，不是 Operations Job；owner 的长时作业、reconciliation 和最终状态归 owner。

6. **Command 输入骨架是否需要 `ActorContext`、`CommandMetadata`、`IdempotencyKey`？**

   `SubmitControlledIntent` 必须携带 `AccessContext context`、`CommandMetadata metadata`，并在 owner contract 明确支持时携带 `IdempotencyKey idempotency_key`；Console 不自行生成幂等依据。只改本地交互 truth 的 `SaveClientPreference`、`DiscardDraftIntent` 和 `RequestAccessContextSwitch` 也携带 `CommandMetadata`，但不把本地 command 当 owner command。actor/credential 仅作为正式边界允许的 opaque context/reference 传递，不在 Console 鉴权。

7. **Query 输入骨架是否需要 `ActorContext`？**

   所有受保护 Query 至少携带 `AccessContext context` 或等价的 `ActorContext actor_context`，以便正式边界执行语境绑定、可见性裁剪和 trace 关联。未验证语境不得通过 query 参数放宽访问；本地 view/filter 参数不能代替 actor/scope/visibility。

8. **Event Consumer 输入骨架是否需要 event id、幂等键或 envelope？**

   `ConsumeSdkInvalidationHint` 需要 `EventId event_id`、`EventSourceReference source_ref` 和 `InvalidationEnvelopeReference envelope_ref`。只有正式 SDK/服务合同明确提供可重放/幂等依据时，才携带 `IdempotencyKey idempotency_key`；没有正式依据时只记录一次待处理失效提示，不自动重放任何副作用。

9. **每个接口属于哪个主要组成部分？**

   访问语境与导航承接语境、可见性和入口 Query 及语境转换本地 command；来源保真视图承接 owner-safe Query、筛选和回链；受控意图与结果承接草稿本地 command、受控提交 command、receipt/result/reconciliation Query；管理主题组织承接按 owner 分区的主题 Query 和条件化 command entry；韧性与可访问交互承接失效提示、恢复动作和状态 Query。五个部分不共享一个跨域 owner command 或统一状态 API。

10. **是否存在接口无人承接、对象能力没有入口、接口类别混淆或跨部分越界？**

    Step 6 的主要对象均可回指至少一个 Query、Command、Recovery Action 或呈现入口。`OwnerQueryPort`、`OwnerCommandPort`、`ResultReconciliationPort`、`SafeLinkPort`、`DiagnosticSinkPort` 是内部/外部 port，不冒充公开 API。不存在 Console Outbound Event 或 Operations Job；将来若需求要求新增，必须回退 Step 5～7 重新确认 truth owner。

### 4. 当前文档问题诊断

| 材料/位置 | 当前问题 | 结构性修正 |
|---|---|---|
| 旧 `02-概要设计.md` §7 | 以 chat/runtime/artifact 等页面或服务名称罗列交互，未区分读取、提交和结果回查 | 改为按五个主要组成部分组织的 Query/Command 骨架，owner 仅作为正式边界 |
| 旧接口段落 | 旧 API path、Provider Contract、固定 DTO 和按钮成功提示可能被理解为当前协议 | 只保留能力级 API 名、输入/输出类型名和 pending 边界，不继承 path/schema/技术框架 |
| 本仓 draft/03 | 可能把 Workspace projection、cursor/rebuild、批处理 worker 或本地 event bus 迁入 Console | 明确无本地 owner projection、worker、outbox 或私有 bus consumer |
| 需求级 `IF-CON-*` | 需求能力面没有对象和入口承接 | 将每个 IF 映射到 Query/Command/Recovery 接口和 Step 6 对象，保留 exact surface pending |
| 上游 owner contract | safe-field、资格、reconciliation、activation 尚未闭口 | 接口只写类型骨架和状态姿态；未闭口主题维持 `pending/blocked/read-only/partial` |

### 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 接口组织轴 | 页面/服务名称混排 | 五个主要组成部分 + Command/Query/Event/Job 分类 | 保持业务责任和接口类别可追溯 |
| 写入语义 | UI action、HTTP 成功和 owner 业务写入混在一起 | 本地交互 command 与委托 owner command 明确分离 | 防止 Console 声称 owner truth 或完成 |
| 查询语义 | 统一 dashboard/缓存读取 | owner-safe Query + 多轴状态 + 安全引用 | 防止 partial/stale/unavailable 被压平 |
| 事件/任务 | 隐含内部事件、后台刷新或重建 | 仅保留可选正式失效提示；无自有 outbound event/job | 对齐 00/01 的同步客户端边界 |
| 参数粒度 | 裸参数或旧 DTO | `TypeName param_name` 类型骨架，metadata/context/idempotency 显式 | 支撑 03 继续定义协议和错误语义 |

### 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A：每个 owner 复制一套 Console API | 页面映射直观 | 复制 owner surface、形成第二套权限和结果语义 | 不采用 |
| 方案 B：只保留一个 `ConsoleGateway` API | 表面简单 | 丢失 Query/Command/Recovery 边界，详细设计会重新发明接口 | 不采用 |
| 方案 C：按五部分拆分用例入口，再统一按 Command/Query/Event/Job 分类 | 能同时追踪业务能力、对象承接和读写性质；未闭口合同可显式挂起 | 需要维护通用 topic query 与 owner-specific adapter 的边界 | 采用 |

### 7. 结构化中间产物

#### 7.1 接口分类说明

```text
Command API
  - 更新 Console 交互 truth，或把受控意图委托给正式 owner command seam。
  - 不在 Console 改写成员、项目、流程、治理、制品、workspace、方法、能力、观测、归档或 sandbox truth。

Query API
  - 读取 AccessContext、TopicVisibility、OwnerViewModel、RequestPresentation、ResultReference 和 DegradationState。
  - 查询、筛选、分页、下钻和预取均 no-write。

Inbound Event Consumer
  - 仅消费正式 SDK/服务边界的失效提示，转换为本地失效/待重验姿态。
  - 不订阅私有 bus，不保存 owner 事件正文。

Outbound Event
  - 当前不适用；Console 没有需要传播的自有业务事实。

Operations Job
  - 当前不适用；Console 不拥有后台 worker、projection rebuild、发布或对账作业。
```

接口分类的“无”是设计结论，不是遗漏：owner 的事件、作业和最终结果继续由各自正式 owner 负责；Console 仅通过正式 Query/Command/Result/Ref 消费。

#### 7.2 按主要组成部分的接口骨架总表

| 主要组成部分 | Command / 用例入口 | Query | Inbound Event | Outbound Event | Operations Job | 关键对象承接 |
|---|---|---|---|---|---|---|
| 访问语境与导航 | `RequestAccessContextSwitch` | `ResolveAccessContext`、`GetNavigationVisibility` | 无 | 无 | 无 | `AccessContext`、`NavigationState`、`TopicVisibility`、`DisclosureGuard` |
| 来源保真视图 | 无 owner truth command；仅视图刷新意图 | `QueryOwnerView`、`GetSourceStatus`、`GetSafeLink` | 无 | 无 | 无 | `OwnerViewSnapshot`、`SourceStatusAxes`、`OwnerViewModel`、`ReferenceSet` |
| 受控意图与结果 | `SaveClientPreference`、`DiscardDraftIntent`、`SubmitControlledIntent` | `GetRequestPresentation`、`ReconcileRequestResult` | 无 | 无 | 无 | `DraftIntent`、`RequestPresentation`、`ResultReference`、`CompletionGuard` |
| 管理主题组织 | 无本地 owner command；由受控提交统一委托 | `QueryTopicView`、八类主题 query、`GetTopicActivation` | 无 | 无 | 无 | `TopicVisibility`、`TopicViewModel`、`TopicActivationState`、`OwnerCapabilityReference` |
| 韧性与可访问交互 | `ApplyRecoveryAction` | `GetDegradationStatus`、`GetAccessibilityState` | `ConsumeSdkInvalidationHint`（可选、pending） | 无 | 无 | `DegradationState`、`RecoveryPlan`、`AccessibilityState`、`DiagnosticContext` |

“无本地 owner truth command”表示主题管理动作必须沿 `SubmitControlledIntent` 进入正式 owner command seam；不表示 UI 没有受控动作入口。

#### 7.3 Command API 骨架表

| API | 所属部分 | 输入骨架 | 输出骨架 | 主要处理 | 写入结果 |
|---|---|---|---|---|---|
| `RequestAccessContextSwitch` | 访问语境与导航 | `ContextSwitchIntent intent`、`AccessContext current_context`、`CommandMetadata metadata` | `ContextSwitchPresentation presentation` | 记录用户显式切换意图，触发正式 scope/visibility 重验并更新客户端转换经历 | 只写 `AccessContext`/`NavigationState` 交互状态；不写 identity、scope 或授权 truth |
| `SaveClientPreference` | 受控意图与结果 | `ClientPreferenceCommand command`、`CommandMetadata metadata` | `PreferenceSavePresentation presentation` | 保存获准的布局、筛选或入口偏好，并校验不影响资格/来源/结果语义 | 只写 Console 偏好；不改变权限、业务优先级、治理决定或 readiness |
| `DiscardDraftIntent` | 受控意图与结果 | `DraftReference draft_ref`、`DiscardReason reason`、`CommandMetadata metadata` | `DraftDisposition disposition` | 清理用户明确放弃的本地草稿和关联呈现 | 只写/清理 `DraftIntent`；不得通知 owner 变更业务对象 |
| `SubmitControlledIntent` | 受控意图与结果 | `ControlledIntentCommand command`、`AccessContext context`、`CommandMetadata metadata`、`OptionalIdempotencyKey idempotency_key` | `RequestPresentation presentation` | 复核语境、visibility、资格和草稿边界后，经 `OwnerCommandPort`/`L0-sdk` 委托正式 command；仅保留 receipt/result/ref | Console 只写 `RequestPresentation`；owner truth、receipt、幂等和最终结果归正式 owner；无正式幂等依据时不得重放 |
| `ApplyRecoveryAction` | 韧性与可访问交互 | `RecoveryActionCommand command`、`RecoveryReference plan_ref`、`AccessContext context`、`CommandMetadata metadata` | `RecoveryPresentation presentation` | 执行获准的 requery、revalidate、reconcile、keep-draft 或 exit 交互动作 | 只更新局部 `DegradationState`、`RecoveryPlan`、焦点/播报；不通过恢复按钮放宽资格或改写 owner 状态 |

Command 共同边界：`AccessContext`/`ActorContext` 只作为正式上下文引用；`CommandMetadata` 用于关联和安全诊断；`IdempotencyKey` 只有 owner contract 明确提供时才进入输入。Console 不生成 owner 幂等依据，不把 transport success、toast、刷新或本地状态当作完成。

#### 7.4 Query API 骨架表：语境、来源和结果

| API | 所属部分 | 输入骨架 | 输出骨架 | 读取来源 | 边界 |
|---|---|---|---|---|---|
| `ResolveAccessContext` | 访问语境与导航 | `AccessContextQuery query`、`SessionReference session_ref`、`ActorContext actor_context` | `AccessContextView view` | `L0-sdk`/正式 identity-scope 边界 | 只读正式语境引用；无法验证、过期、撤销或冲突时返回 restricted/unknown，不由 Console 推导 scope |
| `GetNavigationVisibility` | 访问语境与导航 | `NavigationVisibilityQuery query`、`AccessContext context`、`ActorContext actor_context` | `NavigationViewModel view` | 正式 visibility/qualification surface | menu/route/local flag 只能收紧，不能生成 allow/deny 或泄露受限对象存在性 |
| `QueryOwnerView` | 来源保真视图 | `OwnerViewQuery query`、`AccessContext context`、`FilterIntent filter`、`PaginationRequest page` | `OwnerViewModel view` | owner-safe formal Query / `L0-sdk` | 查询、筛选、排序、分页、预取和下钻 no-write；保留 owner/source 与五个状态轴 |
| `GetSourceStatus` | 来源保真视图 | `SourceStatusQuery query`、`OwnerReference owner_ref`、`AccessContext context` | `SourceStatusAxes status` | formal result/ref 的状态元数据 | 不合成 health/compliance/readiness；empty、missing、partial、stale、unavailable、conflict、unknown 分开 |
| `GetSafeLink` | 来源保真视图 | `SafeLinkQuery query`、`SafeLinkReference link_ref`、`AccessContext context` | `SafeLinkView view` | owner-safe link/ref surface | 只返回可导航的安全引用；无效、撤销或受限时移除/阻断，不携带私有状态 |
| `GetRequestPresentation` | 受控意图与结果 | `RequestStatusQuery query`、`RequestReference request_ref`、`AccessContext context` | `RequestPresentation presentation` | Console 请求经历与正式 receipt/result ref | 只读本地呈现和已获准正式引用；不能由本地 phase 生成 confirmed/rejected |
| `ReconcileRequestResult` | 受控意图与结果 | `ReconciliationQuery query`、`RequestReference request_ref`、`OptionalReceiptReference receipt_ref`、`AccessContext context` | `ResultReference result_ref` | 正式 reconciliation surface | 没有正式回查/幂等依据时保持 unknown/blocked；不自动提交或重放 |
| `GetTopicActivation` | 管理主题组织 | `TopicActivationQuery query`、`TopicReference topic_ref`、`AccessContext context` | `TopicActivationView view` | owner contract/activation metadata 的正式安全结果 | pending/read-only/partial/blocked 不得被页面存在、mock 或 flag 提升为 active |

#### 7.5 管理主题 Query 骨架表

| 主题 Query | owner / 来源 | 输入骨架 | 输出骨架 | 当前激活姿态 | 主题边界 |
|---|---|---|---|---|---|
| `QueryMemberManagementTopic` | `L1-identity`、`L2-member-service` | `TopicViewQuery query`、`AccessContext context`、`FilterIntent filter`、`PaginationRequest page` | `TopicViewModel view` | `pending`；合同具备前可 `read_only/partial` | 只读成员/宿主安全摘要与 ref；不维护成员生命周期或角色继承 |
| `QueryProjectWorkspaceTopic` | `L1-work`、`L1-process`、`L1-workspace` | 同上；`OwnerScopeReference scope_ref` 仅作为正式引用 | `TopicViewModel view` | `pending`；按 owner 独立 `partial/stale/unavailable` | 不生成项目进度、Workspace projection、cursor、rebuild 或工作真相 |
| `QueryMethodAssetTopic` | `L3-method-library` | `TopicViewQuery query`、`AccessContext context`、`VersionReference version_ref` | `TopicViewModel view` | `pending`；浏览可先 `read_only` | 目录/版本只作 owner-safe view；草稿提交仍须走 `SubmitControlledIntent` |
| `QueryGovernanceControlTopic` | `L1-governance`、`L1-artifact` | `GovernanceTopicQuery query`、`AccessContext context`、`ReferenceSet refs` | `TopicViewModel view` | `pending/read_only` | 只呈现 Governance/SoA/AIIA/Control/Gate 状态和 evidence/artifact ref；不生成 verdict 或审批 |
| `QueryObservabilityTopic` | `L4-observability` | `ObservabilityTopicQuery query`、`AccessContext context`、`FilterIntent filter` | `TopicViewModel view` | `pending/read_only` | 只读审计/指标/验证/report 安全结果和引用；不生成正式 audit/evidence/report |
| `QueryCapabilityHubTopic` | `L3-capability-hub` | `CapabilityTopicQuery query`、`AccessContext context`、`OwnerCapabilityReference capability_ref` | `TopicViewModel view` | `pending/blocked` | 不创建能力注册、不推导 capability readiness；access-review/暴露状态以 owner 为准 |
| `QueryArchiveTopic` | `L4-archive` | `ArchiveTopicQuery query`、`AccessContext context` | `TopicViewModel view` | `pending/blocked` | 只读归档请求、材料、完整性、恢复/handoff ref；不执行归档或恢复 |
| `QuerySandboxTopic` | `L4-sandbox` | `SandboxTopicQuery query`、`AccessContext context` | `TopicViewModel view` | `pending/blocked` | 只读隔离/运行/清理状态与正式入口；不执行 sandbox、不推导运行 readiness |

主题 Query 的 `TopicViewModel` 必须保留每个 owner 的 `SourceStatusAxes` 和 `ReferenceSet`，不得将八类主题压成单一“管理健康”结果。`TopicViewModel` 中的 `action_entries` 只表示条件化入口，不表示命令已受理或已完成。

#### 7.6 Inbound Event Consumer 骨架表

| Consumer | 来源 | 输入骨架 | 本地结果 | 边界 |
|---|---|---|---|---|
| `ConsumeSdkInvalidationHint` | `L0-sdk` 或正式 owner SDK 封装的失效提示 | `SdkInvalidationHintEvent event`、`EventId event_id`、`EventSourceReference source_ref`、`InvalidationEnvelopeReference envelope_ref`、`OptionalIdempotencyKey idempotency_key` | `RevalidationRequiredMarker marker`、局部 `DegradationState state` | 仅把正式提示转换为 stale/invalidated/revalidate 姿态；不消费私有 bus、不保存事件 payload、不直接推进 owner 状态 |

事件消费者当前标记 `pending`：只有在 `L0-sdk`/正式服务提供稳定事件 envelope、来源验证、重复语义和失效范围后才能启用。没有该 surface 时，`GetSourceStatus`、`ResolveAccessContext` 和 `ReconcileRequestResult` 通过显式 Query 维持核心闭环。

#### 7.7 Outbound Event 骨架表

| Event | 产生来源 | 主要消费者 | 当前结论 |
|---|---|---|---|
| 无 Console-owned Outbound Event | 不适用 | 不适用 | Console 不拥有可向下游传播的业务事实；客户端交互状态、诊断和 link/ref 不升级为事件 truth。 |

如果将来某 owner 要求接收 Console 交互诊断，必须先由 `L4-observability` 或正式边界定义安全 envelope；本仓只能调用 `DiagnosticSinkPort`，不能自行定义事件、topic、payload 或审计语义。

#### 7.8 Operations Job 骨架表

| Job | 输入来源 | 输出结果 | 当前结论 |
|---|---|---|---|
| 无 Console-owned Operations Job | 不适用 | 不适用 | Console 是同步/显式交互客户端，不拥有后台 worker、projection rebuild、outbox publisher、发布、批量对账或归档/sandbox 作业。 |

用户点击的 requery、revalidate、reconcile、keep-draft、exit 属于 `ApplyRecoveryAction` 或 Query，不得在详细设计中偷偷变成后台任务。owner 自有长时作业的 receipt/result/ref 只作为正式结果消费。

#### 7.9 Port / Adapter 边界摘要

| 边界主语 | 类型 | API 层处理方式 | 详细设计承接方向 |
|---|---|---|---|
| `SdkAccessPort` | formal SDK port | 不作为公开 API；承接 Query/Command/Result/Ref | 定义 SDK 调用、错误映射、语境传递和失效提示封装；不得直连 owner 内部 |
| `OwnerQueryPort` | owner-safe query port | 不作为公开 API；由 `QueryOwnerView`/主题 Query 使用 | 定义按 owner 的 safe-field、状态轴和 coverage 边界，exact surface pending |
| `OwnerCommandPort` | formal command port | 不作为公开 API；仅由 `SubmitControlledIntent` 委托 | 定义资格/receipt/result/幂等传递；不把 owner command 实现迁入 Console |
| `ResultReconciliationPort` | formal reconciliation port | 不作为公开 API；由 `ReconcileRequestResult` 使用 | 定义正式回查能力、终态和未知语义；未闭口时阻断自动恢复 |
| `VisibilityQualificationPort` | visibility/qualification port | 不作为公开 API；由语境/导航/主题 Query 使用 | 定义最小披露、reason、撤销和资格边界；不在 Console 复制 Policy/Gate |
| `SafeLinkPort` | safe-link adapter | 不作为公开 API；由 `GetSafeLink`/主题 view 使用 | 定义引用验证、撤销和跨产品 deep-link 合同；未停审产品保持 pending |
| `DiagnosticSinkPort` | 可选诊断 port | 不作为 Outbound Event | 定义安全诊断 envelope、redaction 和 sink 失败隔离；不形成正式 audit/evidence |
| `FocusAnnouncementPort` | accessibility adapter | 不作为业务 API | 定义焦点、播报和语义状态承接；视觉/辅助路径共享同一资格和结果上限 |

#### 7.10 Step 8 处理流承接清单

| 接口 | 是否需要独立处理流 | 原因 |
|---|---|---|
| `RequestAccessContextSwitch` | 是 | 语境转换会触发 revalidation、入口清理和局部状态收紧。 |
| `ResolveAccessContext` / `GetNavigationVisibility` | 是（可合并为语境 bootstrap 流） | actor/scope/visibility 验证决定后续所有读取和披露。 |
| `QueryOwnerView` | 是 | 需要保留多轴来源、partial/fallback/no-write 和安全回链。 |
| `QueryMemberManagementTopic`～`QuerySandboxTopic` | 按 owner 可合并为主题查询流，八行保留来源差异 | 结构相同但 owner、safe-field、activation 和局部故障不同；不能合成统一 truth。 |
| `SaveClientPreference` / `DiscardDraftIntent` | 可合并为本地交互状态写流 | 只写 Console-owned state，不触发 owner 业务副作用。 |
| `SubmitControlledIntent` | 是（P0 Command） | 草稿→复核→正式 command seam→receipt/result/unknown 的完成边界必须独立说明。 |
| `GetRequestPresentation` / `ReconcileRequestResult` | 是 | 需要区分受理、处理中、正式终态和 unknown，不得以刷新收口。 |
| `ConsumeSdkInvalidationHint` | 是（若启用） | 会改写本地失效/降级姿态；正式事件 surface 当前 pending。 |
| `ApplyRecoveryAction` | 是 | requery/revalidate/reconcile/keep-draft/exit 的安全允许矩阵和 a11y 反馈不同。 |
| Outbound Event | 否 | 当前没有 Console-owned 事实需要传播。 |
| Operations Job | 否 | 当前没有 Console-owned 后台任务或 projection/rebuild。 |

#### 7.11 五个主要组成部分接口归属停审

| 组成部分 | 对象能力是否有入口 | Command/Query 分类 | 跨界检查 | 结果 |
|---|---|---|---|---|
| 访问语境与导航 | `AccessContext`、`NavigationState`、`TopicVisibility`、`DisclosureGuard` 均有入口 | 语境转换为本地 Command；解析/可见性为 Query | 不生成认证、授权或 scope truth | 通过；未验证时 fail-closed |
| 来源保真视图 | snapshot/status/view/ref 均由 owner-safe Query 承接 | 全部 Query；无 owner command | 不建 owner projection、cursor 或统一 verdict | 通过；多轴和 no-write 保留 |
| 受控意图与结果 | draft/request/result/ref/guards 均有入口 | 本地 draft command + 委托 command + result Query | 不把 receipt、toast、transport success 当完成 | 通过；unknown 不重放 |
| 管理主题组织 | 八类主题各有 Query，动作入口由 generic submit 承接 | Topic Query；无本地 owner command | owner activation 未闭口保持 pending/read-only/blocked | 通过；不跨主题合成 truth |
| 韧性与可访问交互 | degradation/recovery/a11y/diagnostic 均有入口 | Recovery Command + 状态 Query + optional Event | 不放宽资格、不拥有全局 health/audit/readiness | 通过；事件与诊断均受正式边界约束 |

#### 7.12 跨接口一致性审计

| 审计项 | 结论 |
|---|---|
| Command / Query 分类 | 本地交互写入与 owner 委托写入分离；读取和 reconciliation 全部 no-write；无自有 Outbound Event/Job。 |
| 输入上下文 | 受保护 Query 使用 `AccessContext`/`ActorContext`；受控 command 使用 `CommandMetadata`；幂等键只在 owner contract 明确时传递。 |
| 对象承接 | Step 6 所有后续关键对象均被至少一个接口或处理流引用；API DTO、port、repository 未升级为领域对象。 |
| owner 边界 | 八类主题通过 owner-specific query/adapter 消费；没有跨 owner command、数据库、私有 bus 或本地规则复制。 |
| 结果语义 | `RequestPresentation.phase` 与 `ResultReference.result_state` 分离；receipt 只表示受理；unknown 保持挂起。 |
| 失效和恢复 | 可选 SDK invalidation hint 只更新局部失效/降级姿态；显式 Query 是无事件时的核心 fallback。 |
| 可访问性 | API 不为视觉和辅助技术提供两套资格/结果路径；`FocusAnnouncementPort` 只承接同一 view/state。 |
| 未闭口项 | exact query/command/result/ref、safe-field、scope、visibility、reconciliation、activation、事件 envelope 和量化 authority 全部保持 pending。 |

### 8. 回填草稿

正式 §7 回填本文件以下收口内容：

- §7.1 接口分类说明；
- §7.2 五个主要组成部分接口骨架总表；
- §7.3 Command API 骨架表；
- §7.4 语境、来源和结果 Query 表；
- §7.5 八类管理主题 Query 表；
- §7.6 可选 Inbound Event Consumer 表；
- §7.7 无自有 Outbound Event 结论；
- §7.8 无自有 Operations Job 结论；
- §7.9 Port / Adapter 边界摘要；
- §7.10 Step 8 处理流承接清单。

正式章节不回填本文件的过程诊断、方案比较和审计过程；Step 14 装配时补充具体校准来源、延伸阅读和章节交叉引用。正式正文不写 HTTP/RPC path、JSON/proto schema、topic、错误码全集、回调参数或实现代码。

### 9. 待确认事项

| 待确认项 | 当前状态 | 对接口骨架的影响 | 当前保守口径 |
|---|---|---|---|
| owner exact query/command/result/ref 与 activation | `open` | 影响 `OwnerQueryPort`、`OwnerCommandPort`、主题 Query 和 `SubmitControlledIntent` | 只写能力级类型；主题 `pending/blocked/read-only/partial` |
| actor/scope/tenant/organization/project scope | `open` | 影响 `AccessContext`、context switch、所有受保护 Query | 只传递外部 ref；不可验证即 fail-closed |
| visibility/qualification/reason/redaction | `open` | 影响导航、主题 action entry、提交前 guard | 客户端只能收紧；不泄露受限对象存在性 |
| safe-field 与多轴状态合同 | `open` | 影响 `OwnerViewModel`、`SourceStatusAxes`、topic view | 保留 owner/source、freshness、coverage、availability、consistency，不发明字段全集 |
| reconciliation/幂等与重复副作用 | `open` | 影响 `ReconcileRequestResult`、`SubmitControlledIntent`、Recovery | 没有正式依据不重放、不声明完成 |
| SDK invalidation event envelope | `open` | 影响 `ConsumeSdkInvalidationHint` 是否激活 | 事件消费者 pending；显式 Query 是核心路径 |
| 诊断接缝和 a11y 支持矩阵 | `open` | 影响 `DiagnosticSinkPort`、`FocusAnnouncementPort` | 最小安全诊断；等价语义要求先成立，精确矩阵后移 |
| 未停审 L5/L6 的 deep-link/ref 合同 | `open` | 影响 `GetSafeLink` 和外围主题入口 | 仅正式 link/ref 候选，不消费私有状态 |

### 10. 进入下一步条件与三层门禁

- 已按五个主要组成部分给出接口归属和停审记录。
- Command、Query、Inbound Event Consumer、Outbound Event、Operations Job 的适用范围已明确；“无自有事件/任务”是显式设计结论。
- 每个接口均有输入/输出类型骨架、对象承接、读写性质和边界；受保护输入使用 `AccessContext`/`ActorContext`，命令元数据与幂等条件已说明。
- 未写 HTTP/RPC path、完整 schema、topic、错误码全集、鉴权实现或函数实现；未把 port、DTO、repository、owner aggregate 当作关键对象。
- Step 8 所需的 P0 Command、复杂 Query、可选 Event Consumer、结果回查和恢复处理流均已列入承接清单。
- exact owner surface、scope/visibility、safe-field、reconciliation、activation、事件 envelope、诊断与量化事项仍原样挂起。

| 门禁 | 结论 | 证据 |
|---|---|---|
| Step / 模块级 | `pass` | 五部分接口小循环、分类表、输入/输出骨架、port 边界和承接清单完成。 |
| 文档级 | `pass` | Step 6 对象均可回指接口；不存在未解释的接口类别、跨部分越界或未定义结果语义。 |
| 项目级 | `pass` | 允许进入 Step 8；正式 `02` 仍只在 Step 14 装配；持续 blocker 未被关闭。 |
