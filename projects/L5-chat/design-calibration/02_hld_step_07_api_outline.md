# L5-chat 02 · Step 7 API / 接口骨架

> Step 状态：`done`
> gate_status：`pass`
> 本步主题：按 Command、Query、Inbound Event Consumer、Outbound Event、Operations Job 分类收稳 Chat 的正式用例入口、SDK 接缝和本地恢复接口。
> 生成依据：`standards/document/概要设计讨论流程_SOP.md` §5 Step 7；`standards/document/概要设计书写规范.md` §4.7。
> 上游输入：`02_hld_step_05_components_boundary.md`、`02_hld_step_06_key_objects.md`、`projects/L5-chat/01-架构设计.md` §10、`CHAT-UP-001~007`。

## 1. Step 内计划

| 子阶段 | 主要组成部分 | 状态 | 门禁 |
|---|---|---|---|
| 读取对象和接缝 | Step 5 接缝、Step 6 对象、SDK-only 约束 | `done` | 只引用已定义对象和能力类别 |
| 接口分类 | Command/Query/Event/Outbound/Operations 分类和边界 | `done` | 不把内部 helper 当 API |
| 协作体验/安全查询 | 入口、页面、材料、preview、摘要查询 | `done` | 局部停审通过 |
| 受控协作/治理命令 | 普通发送、治理意图、重试/探测入口 | `done` | 结果门控和幂等要求显式 |
| 变化/恢复消费 | formal change/result/resume consumer | `done` | 不直订 bus，不固化 schema |
| 本地投影/平台/诊断操作 | cache、eviction、platform capability、低敏 handoff | `done` | 不拥有 owner truth |
| 跨接口审计与回填 | 对象承接、读写性质、后续处理流覆盖 | `done` | 完成后 `pass` |

## 2. SOP 问题回答与接口分类

### 2.1 Command API

Chat 的 Command API 是客户端产品用例入口，负责把用户意图交给正式 SDK command seam；它不直接改写 Chat 以外的业务真相。每个 command 输入都显式携带 `ActorContext`、`CommandMetadata` 和 `IdempotencyKey`（是否可用由 SDK/owner contract 决定），输出只返回安全的 `SubmissionReceiptView`、`PendingResultView`、`CommandResultView` 或 `UnknownEffectView`。

### 2.2 Query API

Query API 只读取正式 owner safe view/ref/summary/preview 或 Chat-local projection。涉及业务可见性时显式携带 `ActorContext`；只读本地 route/selection/draft 的 query 可以只使用 Chat-local context。Query 不通过空结果推断不存在，不返回 raw owner body，不改写真相。

### 2.3 Inbound Event Consumer

Chat 只消费 `L0-sdk` 暴露的 formal change/result/resume envelope。输入需要 `EventEnvelope`、`EventId`/幂等关联、来源/版本水位和 scope/visibility 语境；具体事件字段、topic、offset、broker delivery 和 raw payload 不在本概要设计中定义。

### 2.4 Outbound Event

Chat 不产生 Conversation、Governance、Artifact、Workspace、Runtime 或 Observability truth event。允许的 outbound 类别只有经正式 SDK/诊断 seam 的低敏客户端 handoff，例如连接/恢复/错误类别和用户支持关联意图；它们不改变业务结果，也不等于正式审计/evidence。

### 2.5 Operations Job

Operations Job 用于基于已持有的 Chat-local/正式查询结果做 resume、requery、unknown probe、cache eviction、重启恢复和可选低敏诊断 handoff。它们不执行 owner workflow，不把恢复成功当业务成功，也不以 job 完成生成 owner truth。

## 3. 接口候选与主要组成部分归属

| 主要组成部分 | Command | Query | Inbound Event Consumer | Outbound Event | Operations Job |
|---|---|---|---|---|---|
| 协作体验语境 | - | `LoadEntrySurface`、`LoadConversationSurface`、`LoadTurnPage` | `ConsumeConversationChange` | - | `RefreshVisibleSurface` |
| 受控协作意图 | `SubmitConversationIntent`、`SubmitGovernanceIntent` | `LoadIntentCapability`、`ProbeCommandAttempt` | `ConsumeCommandReceiptOrResult` | - | `ResolveUnknownAttempt` |
| 安全语境与导航 | - | `ResolveEntryAccess`、`LoadVisibilityPosture` | `ConsumeVisibilityChange` | - | `ClearRevokedContext` |
| 变化与恢复连续性 | - | `LoadResumeContext` | `ConsumeFormalChange`、`ConsumeResumeResult` | - | `ResumeChangeContext`、`RequeryAfterGap` |
| 平台体验与可访问性 | - | `ProbePlatformCapability`、`LoadAccessibilityContext` | `ConsumeShellLifecycle` | `ClientDiagnosticHandoffRequested`（可选） | `RestoreAfterShellRestart` |
| owner-safe 材料镜像 | - | `LoadSafeMaterial`、`LoadArtifactPreview`、`LoadOwnerSummary` | `ConsumeMaterialRevisionChange` | - | `RefreshStaleMaterial` |
| 本地展示与恢复投影 | - | `LoadLocalProjection`、`LoadDraft`、`LoadSelection` | `ConsumeEvictionTrigger` | - | `PersistLocalProjection`、`EvictLocalMaterial` |

说明：表中的名称是概要层正式用例/消费类别候选，不是 HTTP path、SDK public method、topic 或代码文件；具体 surface 需在 03 与上游合同中收口。

## 4. Command API 骨架

| API | 输入骨架 | 输出骨架 | 主要处理 | 写入结果 |
|---|---|---|---|---|
| `SubmitConversationIntent` | `ConversationIntent` + `ActorContext` + `CommandMetadata` + `IdempotencyKey` | `SubmissionReceiptView` / `PendingResultView` / `UnknownEffectView` | 校验当前 `AccessPosture`、创建 `CommandAttemptState`、经 `SdkCommandAdapter` 发起正式 Conversation intent | Chat-local attempt；owner Turn/Conversation 结果只由后续 receipt/result/change 确认。 |
| `SubmitGovernanceIntent` | `GovernanceIntent` + `ActorContext` + `CommandMetadata` + `IdempotencyKey` + `GateRef` | `SubmissionReceiptView` / `PendingResultView` / `CommandResultView` / `UnknownEffectView` | 检查 GateCard 的正式可操作姿态，提交受控治理意图并等待 owner 结果 | Chat-local attempt；不写 Decision，不本地批准/拒绝。 |
| `RequestSafePreview` | `PreviewRequest` + `ActorContext` + `CommandMetadata`（如 SDK 视为受控 request） | `PreviewResultView` / `PreviewUnavailableView` | 通过 `SdkReferenceAdapter` 获取正式安全预览或不可用原因 | 只更新 `PreviewReference`/snapshot，不保存正文。 |
| `AcknowledgeLocalRecoveryAction` | `RecoveryAction` + `RouteContext` + `CommandMetadata` | `LocalRecoveryResult` | 记录用户选择 query/resume/clear/wait，不向 owner 提交业务副作用 | Chat-local recovery context。 |

Command 共通边界：

- 所有可能造成 owner 副作用的 command 都必须有 `ActorContext`、`CommandMetadata` 和幂等关联候选；是否必需由正式 SDK/owner contract 决定。
- `SubmissionReceiptView` 只表示正式边界接收或关联，不自动转换成 `confirmed`。
- `UnknownEffectView` 只能进入 query/probe/wait/user decision，不能隐式再发同一副作用。
- `RequestSafePreview` 若最终被上游定义为 Query，则在详细设计中按 Query 归类；本概要层只固定其 body-free/visibility 边界。

### 4.1 `SubmitConversationIntent` 归属停审

| 审查项 | 结论 |
|---|---|
| 是否有对象承接 | 是：`DraftState`、`CommandAttemptState`、`CommandResultGate`。 |
| 是否需要 Actor/Metadata/Idempotency | 是，作为输入骨架候选；精确合同 pending。 |
| 是否直接写 Conversation | 否；经 SDK command seam。 |
| 是否有未知结果姿态 | 是：`UnknownEffectView`。 |

### 4.2 `SubmitGovernanceIntent` 归属停审

| 审查项 | 结论 |
|---|---|
| 是否有对象承接 | 是：`GateRef`、`CommandAttemptState`、`CommandResultGate`、`IntentFeedbackViewModel`。 |
| 是否本地生成 Decision | 否。 |
| 授权/幂等是否被误固化 | 否；只保留能力级输入，等待 `CHAT-UP-003`。 |
| 点击/ACK 是否 confirmed | 否。 |

## 5. Query API 骨架

| API | 输入骨架 | 输出骨架 | 读取来源 | 边界 |
|---|---|---|---|---|
| `ResolveEntryAccess` | `EntryReference` + `ActorContext` + `QueryMetadata` | `AccessPosture` + `EntryViewModel` | SDK formal visibility/scope/query | 无法验证时 restricted/blocked/unavailable；不从空结果推断不存在。 |
| `LoadConversationSurface` | `RouteContext` + `ActorContext` + `PageRequest` | `ConversationSurfaceViewModel` | Conversation safe view、Turn page、formal cursor posture | 不返回 raw owner body；分页/cursor exact schema pending。 |
| `LoadTurnPage` | `ContextReference` + `ActorContext` + `PageRequest` | `TurnPresentationModel[]` + `PageReference` | Conversation safe view/ref | 只读；来源/visibility/freshness 必须保留。 |
| `LoadOwnerSummary` | `OwnerReference` + `ActorContext` + `SummaryRequest` | `SafeMaterialSnapshot` | Identity/Work/Governance/Member/Runtime/Workspace safe summary | 按 owner 分域，不合成统一 truth。 |
| `LoadArtifactPreview` | `PreviewReference` + `ActorContext` + `PreviewRequest` | `PreviewResultView` / `PreviewUnavailableView` | Artifact formal preview/ref | body-free；visibility 不明时 restricted/unavailable。 |
| `LoadIntentCapability` | `ContextReference` + `ActorContext` + `IntentKind` | `IntentCapabilityView` | owner/SDK formal capability and posture | 不由 Chat 计算权限；缺合同则 read-only/blocked。 |
| `ProbeCommandAttempt` | `CommandAttemptState` + `ActorContext` + `ProbeMetadata` | `FormalProbeResult` | owner query/probe seam | 只用于 unknown 收敛，不自动重放命令。 |
| `LoadResumeContext` | `ContextReference` + `ActorContext` + `ResumeRequest` | `ResumeContext` + `ContinuityState` | SDK formal resume/safe snapshot | 不暴露 bus offset/replay。 |
| `LoadLocalProjection` | `ContextReference` + `LocalQueryMetadata` | `LocalProjectionEntry` / `RestorationViewModel` | LocalProjectionRepository | 缓存命中不等于 fresh/authorized。 |
| `LoadDraft` | `ContextReference` + `LocalQueryMetadata` | `DraftState` | DraftStore/LocalProjectionRepository | 草稿不等于 owner submission。 |
| `ProbePlatformCapability` | `PlatformCapabilityKind` + `PlatformProbeMetadata` | `PlatformCapabilityState` | PlatformCapabilityAdapter | 宿主能力不等于业务能力。 |
| `LoadAccessibilityContext` | `PageSemanticModel` + `PlatformCapabilityState` | `AccessibilityState` | shared semantic core + platform capability | 不另造业务状态。 |

Query 共通边界：

- 涉及 owner 可见性、摘要、preview、capability 或命令探测的 query 显式携带 `ActorContext`；纯 Chat-local query 使用 `LocalQueryMetadata`。
- Query 不修改 owner truth；本地投影读取/刷新若会改本地缓存，仍必须通过受限 local persistence 边界。
- Query 输出必须有来源/visibility/freshness/coverage 语境或明确 `unavailable/blocked/partial`。

## 6. Inbound Event Consumer 骨架

| Consumer | 来源 | 输入骨架 | 本地结果 | 边界 |
|---|---|---|---|---|
| `ConsumeFormalChange` | `L0-sdk` formal change surface | `EventEnvelope` + `EventId` + `ChangeSourceRef` + `RevisionMarker` + scope/visibility context | `ChangeAcceptanceRecord` → `ChangeReducer` → local projection/view update | 不直订内部 bus；不处理 raw payload 或 broker offset。 |
| `ConsumeCommandReceiptOrResult` | `L0-sdk` command result/receipt surface | `EventEnvelope` + `EventId` + `IntentRef` + result authority context | `CommandAttemptState` 更新，交给 `CommandResultGate` | receipt/transport ACK 不自动 confirmed。 |
| `ConsumeResumeResult` | `L0-sdk` resume/requery surface | `ResumeResultEnvelope` + `ResumeContextRef` + source/revision context | `ContinuityState`、`ResumeContext`、safe material 更新 | 只接受正式 resume/requery 结果。 |
| `ConsumeVisibilityChange` | Identity/Conversation/Governance/Artifact/Workspace formal change via SDK | `EventEnvelope` + `VisibilityChange` + `EventId` + source context | `AccessPosture`/`VisibilityGuard`/cache eviction | 不从对象消失推断撤销；不可验证时 fail-closed。 |
| `ConsumeMaterialRevisionChange` | owner safe view/ref/preview change via SDK | `EventEnvelope` + `MaterialRevisionChange` + `EventId` + `ProvenanceMetadata` | `SafeMaterialSnapshot` freshness/requery posture | 不重建 owner projection。 |
| `ConsumeShellLifecycle` | PlatformCapabilityAdapter | `ShellLifecycleEvent` + `PlatformCapabilityState` | `ResumeContext`/`RecoveryViewModel`/local lifecycle state | 宿主生命周期不改变业务结果。 |
| `ConsumeEvictionTrigger` | Identity/session/platform/local policy | `EvictionTrigger` + `ContextReference` + `ClearReason` | `LocalProjectionEntry`/`CacheLifecycleRecord` 更新 | 只清理本地材料，不写 owner audit。 |

Inbound 共通边界：

- 每个 consumer 都需要可追踪的 event identity/幂等关联；具体 envelope/schema 由 SDK/owner 合同提供。
- reducer 只接受已通过来源、scope/visibility 和 revision 检查的输入；未知/重复/缺口不得直接更新为 fresh/confirmed。
- `ConsumeShellLifecycle` 和 `ConsumeEvictionTrigger` 是本地/平台事件，不得伪装为 owner formal change。

## 7. Outbound Event 骨架

| Event | 产生来源 | 主要消费者 | 说明 |
|---|---|---|---|
| `ClientDiagnosticHandoffRequested` | `DiagnosticHandoffAdapter` / `RecoveryCoordinator` | `L4-observability` 正式低敏 handoff seam（若提供） | 只携带连接、恢复、缓存、错误类别和安全 correlation/ref；不包含 raw body、credential、owner truth 或 verdict。 |
| `ClientSupportContextRequested` | 用户主动支持入口 | 正式支持/诊断接缝（若提供） | 表达用户请求交接的意图，不代表已创建审计/evidence/report。 |

本仓没有以下 outbound event：Conversation/Turn 创建、Governance Decision、Artifact 版本、Workspace projection、Runtime outcome、Member lifecycle 或任何 owner truth 事件。若未来需要这些传播，必须由对应 owner/SDK 正式提供，不能由 Chat 自造。

## 8. Operations Job 骨架

| Job | 输入来源 | 输出结果 | 边界 |
|---|---|---|---|
| `ResumeChangeContext` | `ResumeContext` + `ContinuityState` + SDK resume capability | `ResumeResultView` / `ContinuityState` | 恢复正式变化/视图，不重放业务副作用。 |
| `RequeryAfterGap` | `GapRef` + `ContextReference` + `ActorContext` | refreshed/partial/blocked safe view | 以正式 query 填补缺口，不猜事件顺序。 |
| `ResolveUnknownAttempt` | `CommandAttemptState(unknown)` + `ProbeMetadata` | `FormalProbeResult` → confirmed/rejected/still-unknown | 只探测，不自动发起同一副作用。 |
| `RefreshStaleMaterial` | `SafeMaterialSnapshot(stale)` + `OwnerReference` + `ActorContext` | fresh/partial/restricted/unavailable snapshot | 只刷新安全材料；不读取 raw body。 |
| `RestoreAfterShellRestart` | local `LocalProjectionEntry` + `ResumeContext` + platform lifecycle | `RestorationViewModel` + next actions | 缓存先标 stale/needs-validation；不把重启恢复当业务成功。 |
| `PersistLocalProjection` | safe material/draft/selection/recovery metadata + `PersistenceSafetyGuard` | `LocalProjectionEntry` + `CacheLifecycleRecord` | 只写受限本地材料。 |
| `EvictLocalMaterial` | `EvictionTrigger` + `LocalProjectionEntry` | cleared/restricted `CacheLifecycleRecord` | 处理 logout/revoke/expiry/scope change；不写 owner audit。 |
| `EmitDiagnosticHandoff` | low-sensitivity diagnostic context + `PlatformCapabilityState` | optional outbound handoff posture | sink 失败不影响业务、授权或恢复上限。 |

## 9. 接口归属停审

| 主要组成部分 | 结论 | 关键边界 |
|---|---|---|
| 协作体验语境 | Query 为主，Command 只由受控意图承接；`LoadConversationSurface`/`LoadTurnPage` 有对象和页面承接 | 不直接调用 Conversation owner。 |
| 受控协作意图 | `SubmitConversationIntent`/`SubmitGovernanceIntent` 是 P0 Command；`ProbeCommandAttempt`/`ResolveUnknownAttempt` 只查询/探测 | 结果门控、幂等和 unknown 显式。 |
| 安全语境与导航 | `ResolveEntryAccess`/`LoadVisibilityPosture` 为 Query，`ClearRevokedContext` 为 Operations | 只读正式 visibility，清理本地。 |
| 变化与恢复连续性 | formal change/receipt/resume consumer + resume/requery jobs | 不直订 bus，不拥有 cursor/delivery truth。 |
| 平台体验与可访问性 | platform probe/query、shell lifecycle consumer、本地 recovery job、可选诊断 outbound | 宿主能力不改变业务状态。 |
| owner-safe 材料镜像 | safe material/summary/preview Query + revision consumer + stale refresh job | body-free、provenance、visibility/freshness。 |
| 本地展示与恢复投影 | local Query、persist/evict Operations、eviction consumer | 只写 Chat-local 投影。 |

## 10. 跨接口一致性审计

| 审计项 | 结论 | 说明 |
|---|---|---|
| 每个 Command 是否有对象承接 | 是 | Draft/Attempt/ResultGate/IntentFeedback/GateRef。 |
| 每个 Query 是否明确读取来源和边界 | 是 | owner safe view/ref、SDK capability 或 local projection 均已列出。 |
| 每个 Event Consumer 是否有 event identity/来源/版本语境 | 是 | 统一采用 EventEnvelope/EventId/source/revision/context 骨架。 |
| 是否有 Chat 自造业务 Outbound Event | 否 | 仅低敏诊断 handoff；owner truth event 明确排除。 |
| Operations 是否会执行副作用或修复 owner truth | 否 | resume/requery/probe/evict/persist/handoff 均有限边界。 |
| 输入是否显式判断 ActorContext/CommandMetadata/IdempotencyKey | 是 | Command 必须；Query 按 owner 可见性需要；Event 使用 envelope/identity。 |
| 是否写 HTTP path、完整 schema、topic/offset | 否。 |
| 接口是否会在 §8 有处理流覆盖 | 是 | P0 command、关键 consumer、恢复/一致性 job 将独立成流。 |
| 是否存在接口无人承接的对象能力 | 暂无 unresolved | Step 8 继续做接口/对象/处理流反查。 |

## 11. 回填草稿（正式 §7）

> 校准来源：本文件 `§2 接口分类`、`§4 Command API 骨架`、`§5 Query API 骨架`、`§6 Inbound Event Consumer 骨架`、`§7 Outbound Event 骨架`、`§8 Operations Job 骨架`、`§10 跨接口一致性审计`。

### 接口分类

```text
Command API
  由 Chat-local intent 进入 L0-sdk 正式 command seam；必须显式携带 ActorContext、CommandMetadata 和幂等关联候选。

Query API
  读取 owner safe view/ref/summary/preview 或 Chat-local projection；不改写真相。

Inbound Event Consumer
  消费 L0-sdk formal change/result/resume/lifecycle envelope；按 EventId、来源和版本/水位做幂等与恢复判断。

Outbound Event
  只允许低敏客户端诊断/支持 handoff；不产生 owner truth event。

Operations Job
  执行 resume、requery、unknown probe、stale refresh、local persist/evict 和重启恢复；不修复 owner truth。
```

正式 §7 将按上述分类列出 `SubmitConversationIntent`、`SubmitGovernanceIntent`、`LoadConversationSurface`、`LoadArtifactPreview`、`ConsumeFormalChange`、`ConsumeCommandReceiptOrResult`、`ResumeChangeContext`、`ResolveUnknownAttempt` 等概要接口。它们的输入输出只使用 Step 6 已定义的对象或能力级边界，具体 SDK 方法、DTO、事件 schema、HTTP path、topic 和错误码留给 03 与上游合同。

## 12. 待确认事项

| 待确认 | 影响 | 当前挂起口径 |
|---|---|---|
| `CHAT-UP-001` exact SDK Query/Command/Event/Resume surface | 所有 adapter 和 consumer 的实际输入输出 | 只保留能力级骨架；不伪造方法名/DTO。 |
| `CHAT-UP-002` Conversation cursor/visibility/resume 与 pagination contract | 对话 Query、change consumer、gap/requery job | 保持 page/cursor/ref 抽象，缺失时 stale/gap/blocked。 |
| `CHAT-UP-003` Governance receipt/idempotency/Decision result contract | `SubmitGovernanceIntent` 和 unknown probe | GateCard 只受控发起，结果保持 pending/unknown。 |
| `CHAT-UP-004` Artifact preview/ref/visibility contract | `LoadArtifactPreview` 和刷新/缓存 | body-free ref/summary/preview-unavailable。 |
| `CHAT-UP-005` Workspace safe view/export/freshness contract | `LoadOwnerSummary` 的 Workspace 分支 | 只消费正式 view/export，不重建 projection。 |
| `CHAT-UP-007` Diagnostic handoff envelope | Outbound handoff/operations | 可选、低敏、sink 失败不影响主线。 |

## 13. 自检与门禁

### 13.1 Step 自检

| 检查项 | 结论 |
|---|---|
| 是否按 Command/Query/Event/Outbound/Operations 分类？ | 是；五类均有定义或明确无业务事件。 |
| Command 是否显式判断 ActorContext、CommandMetadata、IdempotencyKey？ | 是；均在输入骨架和共通边界中说明。 |
| Query 是否区分 owner safe query 与 local query？ | 是。 |
| Event Consumer 是否携带 event identity、来源和版本语境？ | 是。 |
| 是否把内部 helper、HTTP path、topic、完整 schema 当 API？ | 否。 |
| 是否把 Chat 自造 owner truth event？ | 否；Outbound 仅低敏 handoff。 |
| 每个接口是否能回指对象和组成部分？ | 是；接口归属停审已完成。 |
| 是否为 Step 8 标出独立处理流候选？ | 是；P0 command、关键 consumer 和恢复 job 已明确。 |

### 13.2 进入下一步条件

- Command、Query、Inbound Event Consumer、Outbound Event、Operations Job 分类已收稳。
- 每个接口有输入/输出骨架、读写性质、边界和对象承接。
- 未闭合 SDK/owner surface 仍保持能力级、pending/blocked，不在 Chat 私造协议。
- 跨接口一致性审计无 unresolved；可进入 Step 8 处理流展开。

### 13.3 门禁结论

`gate_status = pass`。Step 7 已完成，下一动作是创建并执行 `02_hld_step_08_processing_flows.md`；Step 8 必须为 P0 Command、会改写本地状态的 Inbound Event Consumer 和影响一致性的 Operations Job 画独立处理流。

## 2026-10-01 当前接口复核计划与诊断

输入为当前Step5/6及Step7 SOP/规范§4.7；旧接口漏项目/Process/关系/目录query，candidate归属表有未正式定义别名。本轮明确正式表为规范化入口，旧LoadEntrySurface/LoadSafeMaterial/ConsumeConversationChange等仅历史候选别名，不新增API；统一ResolveEntryAccess/LoadOwnerSummary/ConsumeFormalChange。所有名称为Chat-local use case，不声称现有SDK method。Query本身不写owner；页面store应用响应是独立局部投影步骤。无新owner command或内部bus事件。

| Query | 输入骨架 | 输出骨架 | 正式来源/主体 | 边界 |
|---|---|---|---|---|
| LoadProjectList | ActorContext + PageRequest + ClientConsumptionContext | SafeMaterialSnapshot[] + PageReference | SdkQueryAdapter → Work正式项目safe view | 仅授权列表；不从空结果推不存在 |
| LoadProjectDetail | OwnerReference(project) + ActorContext + QueryMetadata + ClientConsumptionContext | ProjectDetailViewModel | ProjectContextCoordinator → SDK/Work及各独立section | 五标签统一project；section分来源，不合成原子快照 |
| LoadProjectProcessFlow | OwnerReference(project/process) + ActorContext + QueryMetadata + ClientConsumptionContext | ProcessFlowViewModel | ProcessDrilldownCoordinator → SDK正式Process整体投影 | CHAT-UP008；无正式拓扑/状态blocked |
| LoadStageProcessFlow | OwnerReference(stage) + RevisionMarker + ActorContext + ClientConsumptionContext | ProcessFlowViewModel | ProcessDrilldownCoordinator → SDK正式阶段拓扑 | 重验父层关系/版本，不按图坐标生成阶段 |
| LoadProcessNodeDetail | OwnerReference(node) + RevisionMarker + ActorContext + ClientConsumptionContext | ProcessNodeDetailViewModel | ProcessDrilldownCoordinator → 正式节点关联及目标owner query | 每section独立访问/版本；缺关系不按名称关联 |
| LoadProjectConversationLinks | OwnerReference(project/conversation) + ActorContext + QueryMetadata + ClientConsumptionContext | ProjectConversationLinkViewModel | ProjectContextCoordinator → SDK正式关系读取能力 | CHAT-UP009；关系和各目标access分别验证，解绑/撤销清入口 |
| LoadCompanyDirectory | ActorContext + LocalDirectorySearchState + PageRequest + ClientConsumptionContext | CompanyDirectoryViewModel | DirectoryCoordinator → SDK正式目录provider | CHAT-UP009；人类/AI覆盖/分页需确认，不合并成员集合 |
| LoadMemberContext | OwnerReference(person/project/conversation/member) + ActorContext + QueryMetadata + ClientConsumptionContext | SafeMaterialSnapshot[] + AccessPosture | DirectoryCoordinator → 各正式owner独立摘要/对话入口 | 目录/ProjectMember/Participant/在场分源；DM须Conversation正式能力 |

### 当前Step7部分停审：协作体验语境

对象承接与接口归属见修复后正式§7.9；输入明确ActorContext/消费context（业务query）、Metadata/Idempotency（owner意图）、EventId/source/revision（正式consumer）。局部navigation/search独立于owner command；API/repository/helper未建领域对象。当前部分读写类别、对象能力及边界已通过结构检查；SDK/owner能力blocked，完整协议留03。

## 当前Step7跨接口收口

正式回填§7 Query、局部导航入口、handoff定义与七部分归属停审。新增八Query及两个局部入口有§6对象承接，下一Step8逐流展开；generic consumer覆盖Process/关系/目录时仍需正式SDK surface，不发明新bus topic。复杂度表足够，未在§7画处理流。Step7 done gate pass；进入Step8，无实现/测试/提交。


### 当前Step7部分停审：本地展示与恢复投影

对象承接与接口归属见修复后正式§7.9；输入明确ActorContext/消费context（业务query）、Metadata/Idempotency（owner意图）、EventId/source/revision（正式consumer）。局部navigation/search独立于owner command；API/repository/helper未建领域对象。当前部分读写类别、对象能力及边界已通过结构检查；SDK/owner能力blocked，完整协议留03。


### 当前Step7部分停审：owner-safe 材料镜像

对象承接与接口归属见修复后正式§7.9；输入明确ActorContext/消费context（业务query）、Metadata/Idempotency（owner意图）、EventId/source/revision（正式consumer）。局部navigation/search独立于owner command；API/repository/helper未建领域对象。当前部分读写类别、对象能力及边界已通过结构检查；SDK/owner能力blocked，完整协议留03。


### 当前Step7部分停审：平台体验与可访问性

对象承接与接口归属见修复后正式§7.9；输入明确ActorContext/消费context（业务query）、Metadata/Idempotency（owner意图）、EventId/source/revision（正式consumer）。局部navigation/search独立于owner command；API/repository/helper未建领域对象。当前部分读写类别、对象能力及边界已通过结构检查；SDK/owner能力blocked，完整协议留03。


### 当前Step7部分停审：变化与恢复连续性

对象承接与接口归属见修复后正式§7.9；输入明确ActorContext/消费context（业务query）、Metadata/Idempotency（owner意图）、EventId/source/revision（正式consumer）。局部navigation/search独立于owner command；API/repository/helper未建领域对象。当前部分读写类别、对象能力及边界已通过结构检查；SDK/owner能力blocked，完整协议留03。


### 当前Step7部分停审：安全语境与导航

对象承接与接口归属见修复后正式§7.9；输入明确ActorContext/消费context（业务query）、Metadata/Idempotency（owner意图）、EventId/source/revision（正式consumer）。局部navigation/search独立于owner command；API/repository/helper未建领域对象。当前部分读写类别、对象能力及边界已通过结构检查；SDK/owner能力blocked，完整协议留03。


### 当前Step7部分停审：受控协作意图

对象承接与接口归属见修复后正式§7.9；输入明确ActorContext/消费context（业务query）、Metadata/Idempotency（owner意图）、EventId/source/revision（正式consumer）。局部navigation/search独立于owner command；API/repository/helper未建领域对象。当前部分读写类别、对象能力及边界已通过结构检查；SDK/owner能力blocked，完整协议留03。
