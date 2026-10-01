# L5-chat 02 · Step 8 关键处理流 / 重要函数数据流

> Step 状态：`done`
> gate_status：`pass`
> 本步主题：围绕 Step 7 接口与 Step 6 对象，收稳关键 Query、P0 Command、正式变化消费、恢复/探测、预览和本地清理处理流。
> 生成依据：`standards/document/概要设计讨论流程_SOP.md` §5 Step 8；`standards/document/概要设计书写规范.md` §4.8。
> 上游输入：`02_hld_step_05_components_boundary.md`、`02_hld_step_06_key_objects.md`、`02_hld_step_07_api_outline.md`、`projects/L5-chat/01-架构设计.md` §10。

## 1. Step 内计划

| 子阶段 | 处理流 | 状态 | 门禁 |
|---|---|---|---|
| 读取接口/对象 | Step 6/7 对象、接口和边界 | `done` | 所有流的正式主语已定义 |
| 通用路径 | Query、Command、Event、Job 的共同结构 | `done` | 不写完整调用链 |
| 协作体验/安全查询流 | 入口访问、Conversation surface、Artifact preview | `done` | 局部停审通过 |
| 受控命令流 | 普通发送、治理意图、结果门控 | `done` | P0 command 独立图完成 |
| 变化/结果/恢复流 | formal change、receipt/result、resume/gap、unknown probe | `done` | 幂等、重连和不重放边界清楚 |
| 本地投影/清理流 | 重启恢复、persist、evict | `done` | 不延长授权、不写 owner |
| 跨流审计与回填 | 接口覆盖、对象引用、事务/边界粒度 | `done` | 完成后 `pass` |

## 2. SOP 问题回答

### 2.1 每类接口的通用处理结构

- Query：入口/adapter 接收正式语境 → Application service 调用 SDK safe query/ref → `SafeMaterialSnapshot`/view model 组合 → 页面或 local projection；遇到 visibility/freshness/gap 时显式降级。
- Command：页面 local intent → `CommandAttemptState` → `SdkCommandAdapter` 正式提交 → receipt/result/change 由后续 consumer 门控 → feedback view model；transport 接收不等于 confirmed。
- Inbound Event Consumer：SDK formal envelope → event identity/source/revision 校验 → `ChangeAcceptanceRecord`/attempt result → reducer 更新 local projection/view model；duplicate/乱序/gap/visibility revoke 不直接推进主线。
- Operations Job：已知 local context 或正式查询结果 → resume/requery/probe/persist/evict → 更新 `ContinuityState`、`RecoveryContext` 或 local projection；不执行 owner workflow。

### 2.2 哪些流必须独立画图？

本步独立画图：

1. `LoadConversationSurface`：含 visibility、partial/stale、分页/变化边界。
2. `SubmitConversationIntent`：P0 command，含 receipt/result/unknown 门控。
3. `SubmitGovernanceIntent`：P0 command，含授权与 Decision 结果隔离。
4. `ConsumeFormalChange`：会改写本地 projection，需幂等/gap/requery。
5. `ConsumeCommandReceiptOrResult`：会改写 attempt 状态，需结果门控。
6. `ResumeChangeContext` / `RequeryAfterGap`：影响连续性和查询一致性。
7. `ResolveUnknownAttempt`：影响副作用不确定性，必须独立表达非重放。
8. `LoadArtifactPreview`：有 visibility/body-free/fallback 边界。
9. `RestoreAfterShellRestart`、`PersistLocalProjection`、`EvictLocalMaterial`：分别影响本地恢复和敏感材料清理。

不独立画 `LoadDraft`、`LoadSelection`、`ProbePlatformCapability` 和可选诊断 handoff：它们沿通用 local read/adapter 路径即可表达，若详细设计发现包含新的裁剪或权限分支，再回到本步骤补图。

## 3. 当前文档问题诊断

| 旧材料问题 | 影响 | 本步修正 |
|---|---|---|
| 旧文档把 websocket/SSE/AG-UI 流当固定处理流 | 把 transport 细节误当业务变化 | 统一从 `L0-sdk` formal change/result/resume 开始，不写协议或 broker。 |
| 旧文档把发送入口直接连 ConversationService | 页面越过 SDK，且无法解释 receipt/unknown | 先建 local attempt，再经 `SdkCommandAdapter`，结果由 consumer/gate 门控。 |
| 旧文档把 Artifact preview 当读取正文 | 造成 raw body 进入 Chat | 只走 `PreviewReference`/safe preview，失败时 restricted/unavailable。 |
| 旧文档把恢复当“重新连接成功” | 连接恢复会被误写成业务 fresh/confirmed | 分离 `ContinuityState`、resume/requery 和业务结果。 |
| 旧文档没有独立 cache eviction 流 | 撤销/登出后仍可能展示旧材料 | 把 eviction 作为 Operations Job，明确 visibility/清理边界。 |

## 4. 通用处理流骨架

### 4.1 通用 Query 读路径

```text
Query API
  │
  ▼
Inbound / Query Adapter
  - 读取 ActorContext（如涉及 owner visibility）
  - 交给正式 SDK query/ref/preview 能力
  │
  ▼
Application Service
  - 建立 RouteContext / AccessPosture
  - 调用 VisibilityGuard.evaluate_material(SafeMaterialSnapshot safe_material, RouteContext route_context)
  │
  ▼
SafeMaterialSnapshot / Projection / ViewModel
  - 绑定 ProvenanceMetadata、FreshnessMarker、DisclosurePosture
  - 组合 ConversationSurfaceViewModel 或 PreviewReference
  │
  ▼
Result / Local Projection
  - 返回安全 view model
  - 需要时写入 LocalProjectionEntry（不写 owner truth）
```

关键设计点：
- Query 只读取安全材料或 Chat-local projection；空结果不等于不存在。
- visibility、scope、来源或 freshness 无法验证时，返回 restricted/partial/stale/unavailable/blocked。
- view model 和本地 projection 不得补齐缺失 owner 字段，也不得将缓存命中标 fresh。
- 详细设计继续展开 SDK response mapping、分页、错误映射和持久化事务边界。

### 4.2 通用 Command 读写路径

```text
Command API
  │
  ▼
Inbound / User Intent Coordinator
  - 接收 DraftState、ActorContext、CommandMetadata、IdempotencyKey
  - 建立 CommandAttemptState
  │
  ▼
Application Service
  - 检查 AccessPosture
  - 调用 SdkCommandAdapter
  - 等待 submission/receipt/result，不把 transport ACK 映射为 confirmed
  │
  ▼
CommandAttemptState / CommandResultGate / ClientStateStore
  - 记录 submitted/pending/unknown
  - 后续 receipt/result/change 进入正式门控
  │
  ▼
SubmissionReceiptView / IntentFeedbackViewModel / Formal Result Consumer
```

关键设计点：
- Chat 只创建 local intent/attempt，不写 Conversation/Governance truth。
- `CommandResultGate.evaluate(CommandAttemptState attempt, FormalResultMaterial result_material)` 是 confirmed/rejected/failed 的唯一概要门控入口。
- unknown 进入 `ResolveUnknownAttempt`，不自动再发副作用 command。
- 详细设计继续展开幂等关联、错误/重试分类和 SDK receipt/result 映射。

## 5. `LoadConversationSurface` 处理流

```text
LoadConversationSurface Query
  │
  ▼
Inbound / SafeMaterialQueryCoordinator
  - 接收 RouteContext route_context、ActorContext actor_context、PageRequest page_request
  - 调用 SdkQueryAdapter 读取 Conversation/Turn safe view
  │
  ▼
Application Service / CollaborationSurfaceCoordinator
  - 建立 AccessPosture
  - 调用 VisibilityGuard.evaluate_entry(EntryReference entry_ref, VisibilityResultView visibility_result)
  - 调用 SafeMaterialComposer 组合安全材料
  │
  ▼
ConversationSurfaceViewModel / TurnPresentationModel / ContinuityState
  - 绑定 ProvenanceMetadata、FreshnessMarker、PageReference
  - 标记 partial/stale/restricted/unavailable
  │
  ▼
ConversationSurfaceViewModel Result
  - 页面重绘、SelectionState 更新
  - 允许时写入受限 LocalProjectionEntry
```

关键设计点：
- Query 只返回已授权的 safe view/ref/summary；不把空列表或缺字段转成“没有对话/Turn”。
- `ActorContext`、scope、visibility、来源和 page/cursor posture 必须能追溯；exact cursor schema 留给上游/03。
- 页面可以显示已知 stale/partial 材料，但必须显式解释，不能当作完整历史。
- `SelectionState` 只影响当前客户端焦点和选择，不改 Conversation attention/read receipt。

## 6. `SubmitConversationIntent` 处理流

```text
SubmitConversationIntent Command
  │
  ▼
Inbound / UserIntentCoordinator
  - 接收 DraftState draft_state、ActorContext actor_context
  - 生成 CommandAttemptState
  │
  ▼
Application Service / UserIntentCoordinator
  - 调用 VisibilityGuard.evaluate_intent(IntentCapability intent_capability, AccessPosture access_posture)
  - 调用 SdkCommandAdapter 提交 ConversationIntent
  - 保存 IdempotencyAssociation（若正式 seam 提供）
  │
  ▼
CommandAttemptState / ClientStateStore
  - 进入 submitted/pending
  - 关联 IntentFeedbackViewModel
  │
  ▼
SubmissionReceiptView / ConsumeCommandReceiptOrResult / Conversation Change
```

关键设计点：
- 本流是 P0 command；`DraftState` 成为 attempt 输入，但不成为 Turn。
- SDK 接收、网络成功、transport ACK、toast 或页面乐观更新都只允许 submitted/pending。
- confirmed 只能由后续正式 receipt/result/change 经 `CommandResultGate` 进入。
- 失败和 unknown 分开；unknown 必须进入 probe/query/wait/user decision，不自动重放。
- 详细设计继续展开 draft 清理时机、幂等 key、receipt/result mapping、错误姿态和 reducer action。

## 7. `SubmitGovernanceIntent` 处理流

```text
SubmitGovernanceIntent Command
  │
  ▼
Inbound / UserIntentCoordinator
  - 接收 GateRef gate_ref、GovernanceIntent governance_intent、ActorContext actor_context
  - 建立 CommandAttemptState
  │
  ▼
Application Service / GovernanceIntentCoordinator
  - 读取 GateCard safe view 和 IntentCapabilityView
  - 调用 VisibilityGuard.evaluate_intent(IntentCapability intent_capability, AccessPosture access_posture)
  - 调用 SdkCommandAdapter 提交受控治理意图
  │
  ▼
CommandAttemptState / CommandResultGate / IntentFeedbackViewModel
  - 显示 submitted/pending/unknown
  - 只接受正式 Governance receipt/result/change
  │
  ▼
Governance Result View / GateCard 更新 / User Next Action
```

关键设计点：
- GateCard 只显化正式 Gate/Policy/Decision 语境并发起受控意图；不计算 Policy、不创建 Decision。
- 角色名称、按钮可见和 transport ACK 都不是审批 authority。
- confirmed 需要 Governance owner 的正式结果或 change；unknown 时不得自动重复审批。
- 证据/Artifact 只通过 `OwnerReference`/`PreviewReference` 回链，不把治理正文放入 Chat。
- 详细设计继续展开 authorization context、idempotency、result reason 和审计/诊断关联，但不在 Chat 生成 audit truth。

## 8. `ConsumeFormalChange` 处理流

```text
ConsumeFormalChange Event
  │
  ▼
Inbound / SdkChangeAdapter
  - 接收 EventEnvelope event_envelope、EventId event_id、ChangeSourceRef source_ref
  - 读取 RevisionMarker revision_marker 和 scope/visibility context
  │
  ▼
Application Service / ChangeReducer
  - 调用 ChangeAcceptanceRecord.evaluate(FormalChangeView change_view, ContinuityState continuity_state)
  - 检查 duplicate/out_of_order/gap/restricted
  │
  ▼
ChangeAcceptanceRecord / SafeMaterialSnapshot / ContinuityState
  - accepted 才更新 local projection/view model
  - gap/expired/revoked 转入 ResumeContext 或清理
  │
  ▼
ConversationSurfaceViewModel / IntentFeedbackViewModel / RecoveryViewModel
```

关键设计点：
- 只消费 SDK formal change/event；不直订内部 bus，不解析 raw payload、topic、offset 或 broker delivery。
- acceptance 依据正式 source/revision/cursor 语义，不依据 arrival time。
- duplicate 不重复应用；乱序/gap 不推进 fresh；visibility revoke 触发 restricted/clear。
- reducer 更新的是 Chat-local projection 和 feedback，不修复 owner truth。
- 详细设计继续展开 event envelope mapping、幂等索引、reducer transaction 和 gap/requery 触发。

## 9. `ConsumeCommandReceiptOrResult` 处理流

```text
ConsumeCommandReceiptOrResult Event
  │
  ▼
Inbound / SdkChangeAdapter
  - 接收 EventEnvelope event_envelope、EventId event_id、IntentRef intent_ref
  - 读取 ResultAuthority result_authority 和正式结果材料
  │
  ▼
Application Service / CommandResultCoordinator
  - 找到 CommandAttemptState
  - 调用 CommandResultGate.evaluate(CommandAttemptState attempt, FormalResultMaterial result_material)
  │
  ▼
CommandAttemptState / IntentFeedbackViewModel / ClientStateStore
  - confirmed/rejected/failed/unknown 显式更新
  - 清理或保留 DraftState 依据正式结果，不依据 ACK
  │
  ▼
IntentFeedbackViewModel / ConversationSurfaceViewModel / RecoveryViewModel
```

关键设计点：
- receipt、result、change 的权威等级由 SDK/owner 合同提供，Chat 不自行提升。
- 重复 receipt/result 必须幂等；旧结果不能覆盖更新的正式状态。
- unknown 保持 unknown，除非正式 probe/query/result 收敛；不由连接恢复自动确认。
- 不产生 owner audit/evidence；低敏诊断只走独立 handoff。

## 10. `ResumeChangeContext` / `RequeryAfterGap` 处理流

```text
ResumeChangeContext / RequeryAfterGap Job
  │
  ▼
Operations / ResumeCoordinator
  - 接收 ResumeContext resume_context、ContinuityState continuity_state
  - 判断 resume/requery capability、visibility 和 gap posture
  │
  ▼
Application Service / RecoveryCoordinator
  - 调用 SdkChangeAdapter.resume(ResumeContext resume_context)
  - 或调用 SdkQueryAdapter.requery(ContextReference context_ref, ActorContext actor_context)
  │
  ▼
ContinuityState / ChangeAcceptanceRecord / SafeMaterialSnapshot
  - 应用 formal resume result
  - fresh/partial/restricted/blocked/needs-action
  │
  ▼
RecoveryViewModel / ConversationSurfaceViewModel / ClientStateStore
```

关键设计点：
- resume/requery 只收敛客户端安全材料和变化连续性，不重放原业务 command。
- visibility/scope 在恢复时重新验证；失败则 restricted/clear，不因缓存继续展示。
- cursor/cover/gap 的准确语义待 SDK/owner contract；Chat 只保存 consumer-safe ref。
- 恢复完成不等于业务动作 confirmed；命令结果仍由 `CommandResultGate` 独立门控。
- 详细设计继续展开 resume batch、分页、冲突、重试/退避和持久化原子性，但本概要不写参数。

## 11. `ResolveUnknownAttempt` 处理流

```text
ResolveUnknownAttempt Job
  │
  ▼
Operations / RecoveryCoordinator
  - 接收 CommandAttemptState attempt_state、ProbeMetadata probe_metadata
  - 确认 attempt 为 unknown，拒绝自动 resend
  │
  ▼
Application Service / UserIntentCoordinator
  - 调用 SdkQueryAdapter.probe(AttemptReference attempt_ref, ActorContext actor_context)
  - 读取 formal probe/result/change
  │
  ▼
CommandResultGate / CommandAttemptState
  - confirmed/rejected/still-unknown
  - 设置 AttemptNextAction
  │
  ▼
IntentFeedbackViewModel / RecoveryViewModel
  - 提供查询、等待或用户决定
```

关键设计点：
- probe 是查询/确认路径，不是隐式 command retry。
- 没有正式 probe surface 时保持 unknown/needs-action，不能由本地缓存或连接状态推断。
- still-unknown 仍不允许自动重放；用户可以在正式 capability 和新 attempt 语义清楚后主动决定。
- 详细设计继续展开探测结果关联、用户确认界面、重试幂等和安全审计引用。

## 12. `LoadArtifactPreview` 处理流

```text
LoadArtifactPreview Query / Request
  │
  ▼
Inbound / PreviewBoundary
  - 接收 PreviewReference preview_reference、ActorContext actor_context
  - 调用 SdkReferenceAdapter 读取 formal preview/ref
  │
  ▼
Application Service / PreviewCoordinator
  - 调用 VisibilityGuard.evaluate_material(SafeMaterialSnapshot safe_material, RouteContext route_context)
  - 调用 FreshnessInterpreter
  │
  ▼
PreviewReference / SafeMaterialSnapshot / FreshnessMarker
  - preview available / pending / restricted / unavailable
  - 保留 owner reference、版本/水位和安全摘要
  │
  ▼
ArtifactPanel ViewModel / LocalProjectionEntry（仅允许安全子集）
```

关键设计点：
- Artifact 正文、版本链、Evidence/Baseline、血缘和下载权限仍归 Artifact owner。
- 文件名、扩展名、ref 或旧缓存不能绕过 visibility/preview contract。
- preview unavailable 仍可显示安全引用或原因；不能以空白代替安全解释。
- 详细设计继续展开 preview response mapping、body-free redaction、缓存和打开/下载 platform handoff。

## 13. `RestoreAfterShellRestart` 处理流

```text
RestoreAfterShellRestart Job
  │
  ▼
Operations / ShellLifecycleCoordinator
  - 接收 PlatformCapabilityState lifecycle_posture、ContextReference context_ref
  - 读取 LocalProjectionEntry 与安全 DraftState
  │
  ▼
Application Service / RecoveryCoordinator
  - 建立 ResumeContext
  - 调用 VisibilityGuard.evaluate_cache(LocalProjectionEntry projection_entry, VisibilityResultView visibility_result)
  - 将缓存标为 stale/needs-validation
  │
  ▼
RecoveryViewModel / ConversationSurfaceViewModel / AccessibilityState
  - 先显示已知安全材料和明确恢复说明
  - 触发正式 LoadResumeContext / RequeryAfterGap
  │
  ▼
Restored page / next action / restricted or cleared projection
```

关键设计点：
- Shell 重启只恢复 Chat-local route/selection/draft 和安全 projection 子集；不恢复 credential/raw body。
- 缓存恢复不是 fresh，不是 owner authorization，也不是命令 confirmed。
- visibility 无法验证时先 restricted/clear，再等待正式查询；不 fail-open。
- 详细设计继续展开启动顺序、清理竞态、跨窗口/标签页隔离和可访问状态恢复。

## 14. `PersistLocalProjection` 处理流

```text
PersistLocalProjection Job
  │
  ▼
Operations / LocalProjectionRepository
  - 接收 SafeMaterialSnapshot safe_material、DraftState draft_state、SelectionState selection_state
  - 接收 PersistenceSafetyGuard safety_guard
  │
  ▼
Application Service / ClientStateStore
  - 调用 PersistenceSafetyGuard.allows(SafeMaterialSnapshot safe_material)
  - 生成 LocalProjectionEntry
  │
  ▼
LocalProjectionEntry / CacheLifecycleRecord
  - 写入最小安全 projection
  - 记录 stored/refreshed 的低敏 local lifecycle
  │
  ▼
RestorationViewModel / ClientStateStore
```

关键设计点：
- 只有 safe material、来源/visibility/freshness、draft/selection/recovery metadata 能进入本地持有面。
- credential、token、secret、raw body、raw event、owner audit/evidence 和未脱敏诊断必须被守卫拒绝。
- 本地写入成功只是 Chat-local 持久化结果，不改变 owner truth。
- 详细设计继续展开存储事务、冲突、压缩、版本兼容和清理原子性。

## 15. `EvictLocalMaterial` 处理流

```text
EvictLocalMaterial Job
  │
  ▼
Operations / CacheEvictionCoordinator
  - 接收 EvictionTrigger trigger、ContextReference context_ref
  - 读取 LocalProjectionEntry 与 CacheLifecycleRecord
  │
  ▼
Application Service / RevocationCleanupCoordinator
  - 调用 PersistenceSafetyGuard.requires_clear(VisibilityChange visibility_change)
  - 遮蔽/裁剪/删除受影响 projection、draft、selection 和 preview ref
  │
  ▼
LocalProjectionEntry / CacheLifecycleRecord / RouteContext
  - evicting → restricted/cleared
  - route/selection 转为 expired/cleared/needs-action
  │
  ▼
EntryViewModel / RecoveryViewModel / AccessibilityState
```

关键设计点：
- logout、revoke、scope change、expiry 和明确安全策略触发本地清理；清理不写 owner audit。
- 清理后的空列表不能用于推断对象不存在；页面显示安全原因或 needs-action。
- 清理不会取消 owner command，也不会把未确认 attempt 变成 failed；unknown 仍需 probe/user decision。
- 详细设计继续展开清理顺序、并发访问、失败重试、平台存储删除和诊断分类。

## 16. 处理流覆盖清单

| 接口 / Job | 是否画独立处理流 | 原因 |
|---|---|---|
| `LoadConversationSurface` | 是 | visibility、分页、stale/partial 和页面 projection 边界。 |
| `SubmitConversationIntent` | 是 | P0 command、幂等、receipt/result/unknown。 |
| `SubmitGovernanceIntent` | 是 | P0 command、授权和 Decision truth 隔离。 |
| `ConsumeFormalChange` | 是 | 改写 local projection，需 duplicate/order/gap/requery。 |
| `ConsumeCommandReceiptOrResult` | 是 | 改写 attempt 状态，需正式结果门控。 |
| `ResumeChangeContext` / `RequeryAfterGap` | 是 | 影响连续性和查询一致性。 |
| `ResolveUnknownAttempt` | 是 | 副作用不确定性和禁止盲重放。 |
| `LoadArtifactPreview` | 是 | body-free、visibility、preview fallback。 |
| `RestoreAfterShellRestart` | 是 | 本地恢复和正式重验证边界。 |
| `PersistLocalProjection` | 是 | 受限持久化和安全守卫。 |
| `EvictLocalMaterial` | 是 | revoke/logout/expiry 清理和安全边界。 |
| `LoadDraft` / `LoadSelection` | 否 | 沿 local read path，暂无额外跨边界裁剪。 |
| `ProbePlatformCapability` | 否 | 单纯 platform adapter read，业务语义在调用方处理。 |
| `EmitDiagnosticHandoff` | 否 | 可选低敏 handoff，sink 失败不影响主线；详细设计按 adapter 处理。 |

## 17. 按主要组成部分的处理流停审

| 主要组成部分 | 接口/流 | 停审结论 |
|---|---|---|
| 协作体验语境 | `LoadConversationSurface`、Turn page、surface refresh | 对象、Query、view model、selection 和 freshness 已闭环；不写 owner truth。 |
| 受控协作意图 | `SubmitConversationIntent`、`SubmitGovernanceIntent`、`ConsumeCommandReceiptOrResult`、`ResolveUnknownAttempt` | local attempt、result gate、unknown/retry 口径闭环；不把 ACK 当 confirmed。 |
| 安全语境与导航 | `ResolveEntryAccess`、visibility change、evict/clear | fail-closed、清理和入口 posture 闭环；不推断存在性。 |
| 变化与恢复连续性 | `ConsumeFormalChange`、resume/requery、shell restart | formal SDK boundary、幂等、gap、重连和恢复闭环；不直订 bus。 |
| 平台体验与可访问性 | shell restart、platform capability、status announcement | 宿主生命周期和可访问表达不改变业务语义。 |
| owner-safe 材料镜像 | safe query、preview、stale refresh | provenance/freshness/body-free/visibility 闭环；不复制正文。 |
| 本地展示与恢复投影 | persist、evict、local restore | 最小安全持有、清理和缓存非 truth 闭环。 |

## 18. 跨处理流一致性审计

| 审计项 | 结论 | 说明 |
|---|---|---|
| 接口是否都有处理流口径 | 是 | 独立图或通用路径均有说明。 |
| 处理流中的对象是否均在 Step 6 定义 | 是 | Route/Access/Draft/Attempt/SafeMaterial/Continuity/Projection/Platform 对象均可反查。 |
| 处理流是否跨组成部分但未标接缝 | 否 | SDK、platform、local storage 和 owner-safe material 接缝均明确。 |
| 是否存在 transport/connection/optimistic→confirmed 越级 | 否 | 只有 CommandResultGate 接受正式 authority。 |
| 是否存在 unknown 自动重放 | 否 | `ResolveUnknownAttempt` 明确 probe/query/wait/user decision。 |
| 是否把 cache/recovery 当 owner truth | 否。 |
| 是否出现完整伪代码、SQL、schema、retry 参数 | 否。 |
| 是否写明详细设计测试切口和证据边界方向 | 是 | 每条关键流均指出 03 继续展开函数/事务/错误/测试；不声称已有运行证据。 |

## 19. 测试切口与证据边界（概要层）

| 处理流 | 未来测试切口 | 当前证据边界 |
|---|---|---|
| Query/视图 | safe material mapping、visibility/freshness/partial 解释、空结果不误判 | 只能在 05/06 通过真实 fixture/owner contract 证明；本步无测试结果。 |
| Command | intent/attempt 幂等、receipt/result gate、unknown 不重放 | fake adapter 只能验证本地映射，不证明 owner 接受或生产 readiness。 |
| Change consumer | duplicate/out-of-order/gap/revoked/requery | reducer 单元切口不证明 SDK delivery truth。 |
| Recovery | resume/restart/cache stale/clear、跨端语义一致 | 本地恢复行为不证明离线业务成功或 owner repair。 |
| Preview | body-free/redaction/visibility/版本姿态 | 预览 fake 不证明 Artifact 权限和正文安全合同。 |
| Persistence/Eviction | forbidden material rejection、logout/revoke/expiry 清理 | 本地清理记录不等于 Observability evidence/audit。 |
| Accessibility/Platform | 相同 view model 在 shell/AT 下等价表达 | 平台 adapter fake 不证明所有设备/AT 兼容矩阵。 |

## 20. 回填草稿（正式 §8）

> 校准来源：本文件 `§4 通用处理流骨架`、`§5～§15` 各关键接口处理流、`§16 处理流覆盖清单`、`§18 跨处理流一致性审计`、`§19 测试切口与证据边界`。

正式 §8 将收纳以下处理流：安全入口/Conversation surface Query、普通发送 Command、治理意图 Command、formal change consumer、command receipt/result consumer、resume/requery、unknown probe、Artifact safe preview、Desktop 重启恢复、受限本地持久化和撤销/过期清理。每条流均以 `Command/Query/Event/Job → Inbound/Consumer/Job → Application Service → Domain/Projection/Outbox（如适用）→ Result/Event/Projection` 结构表达，保留边界、禁止事项和留给详细设计的函数/事务/错误/测试内容。

## 21. 待确认事项

| 待确认 | 影响 | 当前挂起口径 |
|---|---|---|
| SDK formal result/change/resume envelope 和 authority ordering | `ChangeAcceptanceRecord`、`CommandResultGate`、resume/requery | 只保留能力级来源/版本/结果类别；不固化字段或顺序。 |
| Conversation 分页/cursor 与变化缺口 contract | surface query、change consumer、gap job | 以 `PageReference`/`ChangeCursorRef`/`GapRef` 占位，缺失则 stale/gap/blocked。 |
| Governance probe/result 语义 | unknown/重试和 GateCard feedback | 不自动重放，不本地确认。 |
| Artifact preview body-free 语义 | preview flow、缓存和平台打开 | 只允许 safe summary/ref/preview result。 |
| local storage transaction/clear contract | restart/persist/evict flow | 只确定 port 和安全守卫，细节留给 03/04。 |

## 22. 自检与门禁

### 22.1 Step 自检

| 检查项 | 结论 |
|---|---|
| P0 Command 是否独立画流？ | 是；普通发送和治理意图均有独立图。 |
| 改写本地状态的 Event Consumer 是否独立画流？ | 是；formal change 和 receipt/result 均有独立图。 |
| 影响一致性的 Operations Job 是否独立画流？ | 是；resume/requery、unknown probe、restart、persist、evict 均有独立图。 |
| Query 的 fallback/visibility/preview 边界是否画出？ | 是；Conversation surface 和 Artifact preview 独立画出。 |
| 函数调用参数是否显式类型化？ | 是；所有图中点名函数均使用 typed 参数。 |
| 是否写完整实现/SQL/schema/retry 参数？ | 否。 |
| 每条流是否说明边界、禁止事项、详细设计承接？ | 是。 |
| 处理流对象和接口能否反查 Step 6/7？ | 是；跨处理流审计无 unresolved。 |

### 22.2 进入下一步条件

- 关键接口已按主要组成部分形成处理流，独立图覆盖规则要求的 P0 command、状态改写 consumer、恢复 job 和复杂 query。
- 每条处理流都能回指 Step 6 对象和 Step 7 接口，且跨部分接缝明确。
- 处理流只停在概要结构，不写完整函数、协议、SQL、错误码和重试参数。
- 已登记未来测试切口和证据边界，但没有伪造运行/测试/验收事实。

### 22.3 门禁结论

`gate_status = pass`。Step 8 已完成，下一动作是创建并执行 `02_hld_step_09_state_machine.md`；Step 9 将把本文件出现的命令结果、可见性/新鲜度、连续性、平台能力和本地投影状态单独收稳。

## 2026-10-01 当前处理流复核计划

输入：Step8 SOP/规范§4.8、当前Step5～7、既有§8全部流。诊断：漏项目/Process/关系/目录、多个状态改写consumer独立流；通用query持久写入混写，恢复未核对请求代次。取舍：业务只读query→局部投影更新→可选持久化分开；新query独立裁剪/fallback流；所有consumer按当前source/context门控，正式撤销先隐藏和失效旧代次。下列逐流结构为回填草稿，所有测试切口planned，未run/test。

### 8.15 `LoadProjectList`

归属：协作体验语境；承接§7同名入口。

#### `LoadProjectList` 处理流

```text
LoadProjectList Query
  |
  v
Inbound / Operations
  - 接收 ActorContext actor、PageRequest page、ClientConsumptionContext context
  |
  v
Application / ProjectContextCoordinator
  - 经SdkQueryAdapter读取Work授权项目列表与分页
  - 响应核对actor/scope/source/页请求代次，过期响应忽略
  - 每项目保留safe summary/ref及来源，空结果不推不存在
  |
  v
SafeMaterialSnapshot[] / AccessPosture / PageReference
  |
  v
项目列表安全投影；点击只选项目，另验详情
```

关键设计点：通过SDK正式能力读/恢复或处理局部状态，未确认能力blocked；不改owner truth。planned验证切口：分页重复/搜索切换迟到/访问撤销；不自行计算完成度。完整函数签名、adapter映射、错误矩阵与测试实现留03～05；原型图不是执行证据。

逐流自检：入口§7、对象§6可回链，受影响source/局部状态/迟到/失败边界已点名；无完整实现/内部bus；结构gate pass。

最终结果轴同步：ResolveUnknownAttempt输出允许正式证明的failed，与Step9已定义迁移一致；无证明仍unknown，禁止自动重发。当前Step8 done，章节gate pass，合同blocked。


当前Step14一致性回查：旧独立流补规范化处理流标题；新增流首行改精确Query/Consumer/Job/Local Action/局部Command类别。统一既有UserIntentCoordinator/RecoveryViewModel/PreviewReference输出；continuity partial明确归FreshnessState，route/selection清理状态按各自轴解释。与§6/7/9同名，无新分析或能力。


## 当前Step8跨流审计

新增§8.15～33含八Query、两局部导航/search、五consumer、stale刷新、入口/操作能力及局部恢复选择。既有发送/审批/变化/恢复/持久化/清理已收紧context/receipt/optimistic边界。LoadTurnPage走LoadConversationSurface分页骨架，LoadOwnerSummary走通用安全query和RefreshStaleMaterial，ProbeCommandAttempt走ResolveUnknownAttempt，LoadResumeContext走resume/requery骨架，LoadLocalProjection/LoadDraft为局部读取，LoadAccessibilityContext/ProbePlatformCapability为宿主语义读取；RequestSafePreview仅合同确认后映射LoadArtifactPreview或受控command并使用相同结果门控，未确认blocked。Diagnostic/support及EmitDiagnosticHandoff仅低敏optional adapter交接，不声明已提交事实或写状态权威；sink失败不影响业务。Step7旧LoadSelection别名不是新正式API，局部读取归SelectionState/store。

复杂度需要独立图且逐流输出；覆盖/对象/source/局部事务/未独立流理由已检查。Step8 done gate pass，进入Step9；无实现/测试/提交。

### 当前Step8部分停审：本地展示与恢复投影

逐流复核已完成：对应§7同名入口和§6对象，跨部分通过guard/SDK/reducer/受限存储接缝；无跨owner事务/流程推进。局部写入仅state/projection，业务提交在owner。每个改状态consumer/一致性job都有独立图；同一resume/requery图共用恢复骨架。完整调用链和实现测试留03～05，结构gate pass，合同blocked。


### 当前Step8部分停审：owner-safe 材料镜像

逐流复核已完成：对应§7同名入口和§6对象，跨部分通过guard/SDK/reducer/受限存储接缝；无跨owner事务/流程推进。局部写入仅state/projection，业务提交在owner。每个改状态consumer/一致性job都有独立图；同一resume/requery图共用恢复骨架。完整调用链和实现测试留03～05，结构gate pass，合同blocked。


### 当前Step8部分停审：平台体验与可访问性

逐流复核已完成：对应§7同名入口和§6对象，跨部分通过guard/SDK/reducer/受限存储接缝；无跨owner事务/流程推进。局部写入仅state/projection，业务提交在owner。每个改状态consumer/一致性job都有独立图；同一resume/requery图共用恢复骨架。完整调用链和实现测试留03～05，结构gate pass，合同blocked。


### 当前Step8部分停审：变化与恢复连续性

逐流复核已完成：对应§7同名入口和§6对象，跨部分通过guard/SDK/reducer/受限存储接缝；无跨owner事务/流程推进。局部写入仅state/projection，业务提交在owner。每个改状态consumer/一致性job都有独立图；同一resume/requery图共用恢复骨架。完整调用链和实现测试留03～05，结构gate pass，合同blocked。


### 当前Step8部分停审：安全语境与导航

逐流复核已完成：对应§7同名入口和§6对象，跨部分通过guard/SDK/reducer/受限存储接缝；无跨owner事务/流程推进。局部写入仅state/projection，业务提交在owner。每个改状态consumer/一致性job都有独立图；同一resume/requery图共用恢复骨架。完整调用链和实现测试留03～05，结构gate pass，合同blocked。


### 当前Step8部分停审：受控协作意图

逐流复核已完成：对应§7同名入口和§6对象，跨部分通过guard/SDK/reducer/受限存储接缝；无跨owner事务/流程推进。局部写入仅state/projection，业务提交在owner。每个改状态consumer/一致性job都有独立图；同一resume/requery图共用恢复骨架。完整调用链和实现测试留03～05，结构gate pass，合同blocked。


### 当前Step8部分停审：协作体验语境

逐流复核已完成：对应§7同名入口和§6对象，跨部分通过guard/SDK/reducer/受限存储接缝；无跨owner事务/流程推进。局部写入仅state/projection，业务提交在owner。每个改状态consumer/一致性job都有独立图；同一resume/requery图共用恢复骨架。完整调用链和实现测试留03～05，结构gate pass，合同blocked。


### 8.33 `AcknowledgeLocalRecoveryAction`

归属：变化与恢复连续性；承接§7同名入口。

#### `AcknowledgeLocalRecoveryAction` 处理流

```text
AcknowledgeLocalRecoveryAction Chat-local Command
  |
  v
Inbound / Operations
  - 接收 RecoveryAction action、RouteContext route、CommandMetadata metadata
  |
  v
Application / RecoveryCoordinator
  - 记录用户选择query/resume/clear/wait的局部意图
  - 对当前source/context选择获准job；无能力保持needs_action
  - unknown只能probe/query/wait，不转换为隐式resend
  |
  v
ResumeContext / RecoveryViewModel / CommandAttemptState
  |
  v
局部恢复选择及安全下一动作
```

关键设计点：通过SDK正式能力读/恢复或处理局部状态，未确认能力blocked；不改owner truth。planned验证切口：用户选择重连/清缓存不代表命令失败或确认。完整函数签名、adapter映射、错误矩阵与测试实现留03～05；原型图不是执行证据。

逐流自检：入口§7、对象§6可回链，受影响source/局部状态/迟到/失败边界已点名；无完整实现/内部bus；结构gate pass。


### 8.32 `LoadIntentCapability`

归属：受控协作意图；承接§7同名入口。

#### `LoadIntentCapability` 处理流

```text
LoadIntentCapability Query
  |
  v
Inbound / Operations
  - 接收 ContextReference target、ActorContext actor、IntentKind intent
  |
  v
Application / UserIntentCoordinator / VisibilityGuard
  - 经SDK正式owner capability读取当前target/actor/scope
  - 结果与当前消费语境匹配才开放受控入口，操作提交前再验
  - 无合同/read-only/过期仅显示安全等待或blocked
  |
  v
AccessPosture / CommandResultGate / IntentFeedbackViewModel
  |
  v
安全可操作姿态；按钮可见不表示结果
```

关键设计点：通过SDK正式能力读/恢复或处理局部状态，未确认能力blocked；不改owner truth。planned验证切口：GateCard可见但不可批/能力过期/submit竞态。完整函数签名、adapter映射、错误矩阵与测试实现留03～05；原型图不是执行证据。

逐流自检：入口§7、对象§6可回链，受影响source/局部状态/迟到/失败边界已点名；无完整实现/内部bus；结构gate pass。


### 8.31 `ResolveEntryAccess`

归属：安全语境与导航；承接§7同名入口。

#### `ResolveEntryAccess` 处理流

```text
ResolveEntryAccess Query
  |
  v
Inbound / Operations
  - 接收 EntryReference entry、ActorContext actor、QueryMetadata metadata
  |
  v
Application / RouteContextCoordinator / VisibilityGuard
  - 建立待验证route/current消费语境，经SDK正式访问/scope查询
  - 正式结果允许才生成当前AccessPosture，关系与目标分别验证
  - 未确认/隐藏/过期返回最小安全入口，不泄漏对象存在性
  |
  v
RouteContext / AccessPosture / ClientConsumptionContext
  |
  v
获准入口或restricted/blocked/unavailable
```

关键设计点：通过SDK正式能力读/恢复或处理局部状态，未确认能力blocked；不改owner truth。planned验证切口：深链伪ref/空结果/访问变化；完整错误映射留03。完整函数签名、adapter映射、错误矩阵与测试实现留03～05；原型图不是执行证据。

逐流自检：入口§7、对象§6可回链，受影响source/局部状态/迟到/失败边界已点名；无完整实现/内部bus；结构gate pass。


### 8.30 `RefreshStaleMaterial`

归属：owner-safe 材料镜像；承接§7同名入口。

#### `RefreshStaleMaterial` 处理流

```text
RefreshStaleMaterial Operations Job
  |
  v
Inbound / Operations
  - 接收 SafeMaterialSnapshot material、OwnerReference target、ActorContext actor
  |
  v
Application / SafeMaterialComposer / RecoveryCoordinator
  - 为当前target/source建立新消费代次，验证访问
  - 通过SDK正式query/ref刷新该来源；无能力blocked
  - 核对版本/visibility/context后替换安全section，旧结果忽略
  - 可选持久化经guard另走PersistLocalProjection
  |
  v
SafeMaterialSnapshot / FreshnessMarker / ClientConsumptionContext
  |
  v
fresh/partial/stale/restricted/unavailable
```

关键设计点：通过SDK正式能力读/恢复或处理局部状态，未确认能力blocked；不改owner truth。planned验证切口：刷新时撤销/项目切换/旧版本；不按缓存命中fresh。完整函数签名、adapter映射、错误矩阵与测试实现留03～05；原型图不是执行证据。

逐流自检：入口§7、对象§6可回链，受影响source/局部状态/迟到/失败边界已点名；无完整实现/内部bus；结构gate pass。


### 8.29 `ConsumeEvictionTrigger`

归属：本地展示与恢复投影；承接§7同名入口。

#### `ConsumeEvictionTrigger` 处理流

```text
ConsumeEvictionTrigger Inbound Event Consumer
  |
  v
Inbound / Operations
  - 接收 EvictionTrigger trigger、ContextReference context_ref、ClearReason reason
  |
  v
Application / CacheEvictionCoordinator
  - 确定登出/撤销/scope/过期/容量受影响本地范围
  - 先遮蔽和失效消费代次，再调用EvictLocalMaterial
  - 删除最小材料及返回/焦点关联，记录低敏CacheLifecycleRecord
  - 失败保持不可见，不回滚为可展示或把unknown改failed
  |
  v
LocalProjectionEntry / CacheLifecycleRecord / ClientConsumptionContext
  |
  v
evicting/restricted/cleared安全姿态
```

关键设计点：通过SDK正式能力读/恢复或处理局部状态，未确认能力blocked；不改owner truth。planned验证切口：清理失败/重复触发/旧存储恢复；不写owner audit。完整函数签名、adapter映射、错误矩阵与测试实现留03～05；原型图不是执行证据。

逐流自检：入口§7、对象§6可回链，受影响source/局部状态/迟到/失败边界已点名；无完整实现/内部bus；结构gate pass。


### 8.28 `ConsumeShellLifecycle`

归属：平台体验与可访问性；承接§7同名入口。

#### `ConsumeShellLifecycle` 处理流

```text
ConsumeShellLifecycle Inbound Event Consumer
  |
  v
Inbound / Operations
  - 接收 ShellLifecycleEvent event、PlatformCapabilityState capability
  |
  v
Application / ShellLifecycleCoordinator
  - 按当前shell局部生命周期去重，区分网络提示与正式SDK连续性
  - 挂起仅保存允许的最小局部state；恢复新建消费代次
  - 调用RestoreAfterShellRestart或ResumeChangeContext，重新验证访问
  - 焦点/公告使用当前安全VM，通知与窗口ACK不确认业务
  |
  v
PlatformCapabilityState / AccessibilityState / RecoveryViewModel
  |
  v
安全宿主体验与恢复姿态
```

关键设计点：通过SDK正式能力读/恢复或处理局部状态，未确认能力blocked；不改owner truth。planned验证切口：挂起/重启/通知深链/辅助技术；未确认跨端同步不造服务。完整函数签名、adapter映射、错误矩阵与测试实现留03～05；原型图不是执行证据。

逐流自检：入口§7、对象§6可回链，受影响source/局部状态/迟到/失败边界已点名；无完整实现/内部bus；结构gate pass。


### 8.27 `ConsumeMaterialRevisionChange`

归属：owner-safe 材料镜像；承接§7同名入口。

#### `ConsumeMaterialRevisionChange` 处理流

```text
ConsumeMaterialRevisionChange Inbound Event Consumer
  |
  v
Inbound / Operations
  - 接收 EventEnvelope event、MaterialRevisionChange change、ClientConsumptionContext context
  |
  v
Application / SafeMaterialComposer / ChangeReducer
  - 核对正式source/event identity/context/版本可比性
  - 重复忽略；版本不兼容/gap标stale/partial，重查该来源
  - Process父拓扑变更失效旧节点和关联；其他owner只更新其section
  - 裁剪material后输出安全freshness，不跨source推统一完成
  |
  v
SafeMaterialSnapshot / ProvenanceMetadata / FreshnessMarker / ProjectNavigationState
  |
  v
来源局部VM刷新或RequeryAfterGap
```

关键设计点：通过SDK正式能力读/恢复或处理局部状态，未确认能力blocked；不改owner truth。planned验证切口：拓扑与状态乱序/跨owner同数版本/重复事件；不可借其他source补truth。完整函数签名、adapter映射、错误矩阵与测试实现留03～05；原型图不是执行证据。

逐流自检：入口§7、对象§6可回链，受影响source/局部状态/迟到/失败边界已点名；无完整实现/内部bus；结构gate pass。


### 8.26 `ConsumeVisibilityChange`

归属：安全语境与导航；承接§7同名入口。

#### `ConsumeVisibilityChange` 处理流

```text
ConsumeVisibilityChange Inbound Event Consumer
  |
  v
Inbound / Operations
  - 接收 EventEnvelope event、EventId event_id、VisibilityChange change
  |
  v
Application / RevocationCleanupCoordinator
  - 验证SDK正式visibility来源、受影响actor/scope/target范围和事件关联
  - 先隐藏受影响内容、失效消费代次及操作入口，不等待持久清理
  - 清图/列表/节点/关系/目录/预览/返回ref与敏感公告
  - 进入EvictLocalMaterial，清理失败维持restricted并提示安全恢复
  |
  v
AccessPosture / VisibilityGuard / ClientConsumptionContext / LocalProjectionEntry
  |
  v
restricted/hidden/cleared，拒绝旧响应复活
```

关键设计点：通过SDK正式能力读/恢复或处理局部状态，未确认能力blocked；不改owner truth。planned验证切口：撤销与迟到query竞态/清理失败/范围外事件；不推owner删除或取消。完整函数签名、adapter映射、错误矩阵与测试实现留03～05；原型图不是执行证据。

逐流自检：入口§7、对象§6可回链，受影响source/局部状态/迟到/失败边界已点名；无完整实现/内部bus；结构gate pass。


### 8.25 `ConsumeResumeResult`

归属：变化与恢复连续性；承接§7同名入口。

#### `ConsumeResumeResult` 处理流

```text
ConsumeResumeResult Inbound Event Consumer
  |
  v
Inbound / Operations
  - 接收 ResumeResultEnvelope result、ResumeContext resume、ClientConsumptionContext context
  |
  v
Application / ResumeCoordinator / ChangeReducer
  - 仅接受SDK正式resume/query结果，核对source/context和恢复关联
  - 按本source正式coverage/cursor/revision确认可应用范围
  - 缺口/过期/访问变化保持stale/gap/restricted；无合同blocked
  - 更新Continuity/安全VM；父拓扑改变则清旧stage/node选择
  |
  v
ContinuityState / ChangeAcceptanceRecord / RecoveryViewModel
  |
  v
本来源恢复姿态与受限投影；不恢复command副作用
```

关键设计点：通过SDK正式能力读/恢复或处理局部状态，未确认能力blocked；不改owner truth。planned验证切口：旧resume结果/游标过期/partial coverage；连接恢复不足以fresh。完整函数签名、adapter映射、错误矩阵与测试实现留03～05；原型图不是执行证据。

逐流自检：入口§7、对象§6可回链，受影响source/局部状态/迟到/失败边界已点名；无完整实现/内部bus；结构gate pass。


### 8.24 `UpdateDirectorySearch`

归属：协作体验语境；承接§7同名入口。

#### `UpdateDirectorySearch` 处理流

```text
UpdateDirectorySearch Local Action
  |
  v
Inbound / Operations
  - 接收 LocalDirectorySearchState search、ClientConsumptionContext context
  |
  v
Application / DirectoryCoordinator
  - 只更新本地搜索输入/页选择，生成新请求代次
  - 旧页及旧订阅禁止应用新search；必要时裁剪旧显示
  - 调用LoadCompanyDirectory正式分页/搜索，无能力则blocked
  |
  v
CompanyDirectoryViewModel / ClientConsumptionContext
  |
  v
局部search/loading姿态，不写人员truth
```

关键设计点：通过SDK正式能力读/恢复或处理局部状态，未确认能力blocked；不改owner truth。planned验证切口：快速连续搜索/旧page迟到/撤销；不通过搜索错误探测隐藏人员。完整函数签名、adapter映射、错误矩阵与测试实现留03～05；原型图不是执行证据。

逐流自检：入口§7、对象§6可回链，受影响source/局部状态/迟到/失败边界已点名；无完整实现/内部bus；结构gate pass。


### 8.23 `NavigateProjectContext`

归属：安全语境与导航；承接§7同名入口。

#### `NavigateProjectContext` 处理流

```text
NavigateProjectContext Local Action
  |
  v
Inbound / Operations
  - 接收 ProjectNavigationState navigation、OwnerReference target、ClientConsumptionContext context
  |
  v
Application / RouteContextCoordinator / ProjectContextCoordinator
  - 失效旧消费代次，保留安全返回候选和局部tab/viewport
  - 目标若跨项目/群聊/阶段/节点，验证正式关系与目标访问
  - 发起对应query；本地选择不创建owner command或幂等键
  - 获准后图/列表焦点同步；拒绝/撤销回安全入口并清理目标
  |
  v
RouteContext / ProjectNavigationState / ClientConsumptionContext / AccessibilityState
  |
  v
当前局部路由/下钻或restricted/blocked入口
```

关键设计点：通过SDK正式能力读/恢复或处理局部状态，未确认能力blocked；不改owner truth。planned验证切口：项目↔群聊回程/深链恢复/隐藏节点焦点；不凭local selection赋权。完整函数签名、adapter映射、错误矩阵与测试实现留03～05；原型图不是执行证据。

逐流自检：入口§7、对象§6可回链，受影响source/局部状态/迟到/失败边界已点名；无完整实现/内部bus；结构gate pass。


### 8.22 `LoadMemberContext`

归属：协作体验语境；承接§7同名入口。

#### `LoadMemberContext` 处理流

```text
LoadMemberContext Query
  |
  v
Inbound / Operations
  - 接收 OwnerReference target、ActorContext actor、ClientConsumptionContext context
  |
  v
Application / DirectoryCoordinator
  - 按入口分立目录身份、项目成员、群聊参与者、Member/Runtime在场来源
  - 经SDK独立查询各owner获准summary/ref；上下文不兼容不拼接
  - DM或群聊入口只展示正式Conversation capability，不从目录可见推获准
  - 核对当前person/project/conversation/source/请求代次后局部投影
  |
  v
SafeMaterialSnapshot / OwnerReference / AccessPosture
  |
  v
来源分立的人员/成员section和可用对话入口
```

关键设计点：通过SDK正式能力读/恢复或处理局部状态，未确认能力blocked；不改owner truth。planned验证切口：同人不同scope/无DM capability/离线presence；不合成成员生命周期。完整函数签名、adapter映射、错误矩阵与测试实现留03～05；原型图不是执行证据。

逐流自检：入口§7、对象§6可回链，受影响source/局部状态/迟到/失败边界已点名；无完整实现/内部bus；结构gate pass。


### 8.21 `LoadCompanyDirectory`

归属：协作体验语境；承接§7同名入口。

#### `LoadCompanyDirectory` 处理流

```text
LoadCompanyDirectory Query
  |
  v
Inbound / Operations
  - 接收 ActorContext actor、LocalDirectorySearchState search、PageRequest page、ClientConsumptionContext context
  |
  v
Application / DirectoryCoordinator
  - 验证正式provider及人类/AI覆盖/搜索分页/可见性能力
  - 经SDK读取安全目录页，不并集ProjectMember/Participant/Member
  - 仅匹配当前search/页请求代次的响应可应用；分页去重由正式ref
  - 人员点击后目标详情/DM独立验证，撤销裁剪名单/焦点/返回
  |
  v
CompanyDirectoryViewModel / SafeMaterialSnapshot / PageReference
  |
  v
公司目录安全列表或blocked/unavailable
```

关键设计点：通过SDK正式能力读/恢复或处理局部状态，未确认能力blocked；不改owner truth。planned验证切口：搜索迟到/分页重复/人员隐藏/覆盖不完整；Identity不默认等于全公司目录。完整函数签名、adapter映射、错误矩阵与测试实现留03～05；原型图不是执行证据。

逐流自检：入口§7、对象§6可回链，受影响source/局部状态/迟到/失败边界已点名；无完整实现/内部bus；结构gate pass。


### 8.20 `LoadProjectConversationLinks`

归属：协作体验语境；承接§7同名入口。

#### `LoadProjectConversationLinks` 处理流

```text
LoadProjectConversationLinks Query
  |
  v
Inbound / Operations
  - 接收 OwnerReference anchor、ActorContext actor、ClientConsumptionContext context
  |
  v
Application / ProjectContextCoordinator
  - 调用SDK正式绑定/关联读取；owner不明或合同缺失blocked
  - 保留正式关系版本，独立验证每个项目/群聊目标访问
  - 点击入口仅导航；保存安全return_context，不建立或解除绑定
  - 解绑/撤销使入口和返回ref失效，旧query不得复活关系
  |
  v
ProjectConversationLinkViewModel / ProjectNavigationState / AccessPosture
  |
  v
项目→多群列表或群聊→获准项目入口
```

关键设计点：通过SDK正式能力读/恢复或处理局部状态，未确认能力blocked；不改owner truth。planned验证切口：关系可见但目标拒绝/解绑迟到/群成员不同；产品一群一项目约束不代替正式owner合同。完整函数签名、adapter映射、错误矩阵与测试实现留03～05；原型图不是执行证据。

逐流自检：入口§7、对象§6可回链，受影响source/局部状态/迟到/失败边界已点名；无完整实现/内部bus；结构gate pass。


### 8.19 `LoadProcessNodeDetail`

归属：协作体验语境；承接§7同名入口。

#### `LoadProcessNodeDetail` 处理流

```text
LoadProcessNodeDetail Query
  |
  v
Inbound / Operations
  - 接收 OwnerReference node_ref、RevisionMarker topology_revision、ClientConsumptionContext context
  |
  v
Application / ProcessDrilldownCoordinator
  - 验证当前stage/node父关系、拓扑版本和节点访问
  - 经SDK读取正式节点关联，不从日志/标题/时间推关联
  - Work/Governance/Artifact/Runtime/诊断目标分别读取获准summary/ref
  - 每section核对node/source/请求代次，缺一source仅该section降级
  |
  v
ProcessNodeDetailViewModel / OwnerReference / SafeMaterialSnapshot
  |
  v
节点侧栏/详情及独立GateCard/Artifact/统计安全section
```

关键设计点：通过SDK正式能力读/恢复或处理局部状态，未确认能力blocked；不改owner truth。planned验证切口：节点切换/关联过期/来源失败；tool/commit/test摘要不构成验收结果。完整函数签名、adapter映射、错误矩阵与测试实现留03～05；原型图不是执行证据。

逐流自检：入口§7、对象§6可回链，受影响source/局部状态/迟到/失败边界已点名；无完整实现/内部bus；结构gate pass。


### 8.18 `LoadStageProcessFlow`

归属：协作体验语境；承接§7同名入口。

#### `LoadStageProcessFlow` 处理流

```text
LoadStageProcessFlow Query
  |
  v
Inbound / Operations
  - 接收 OwnerReference stage_ref、RevisionMarker parent_revision、ClientConsumptionContext context
  |
  v
Application / ProcessDrilldownCoordinator
  - 当前整体图确认stage正式关联及版本，重新验证stage访问
  - 经SDK读取阶段子拓扑及正式状态，保留各自版本
  - 旧父图/旧代次响应忽略；父图变更失效stage/node并重查
  - 应用ProjectNavigationState stage选择，保留获准返回整体位置
  |
  v
ProcessFlowViewModel / ProjectNavigationState / AccessPosture
  |
  v
阶段图/列表，整体→阶段返回路径
```

关键设计点：通过SDK正式能力读/恢复或处理局部状态，未确认能力blocked；不改owner truth。planned验证切口：父图刷新时迟到子图/阶段撤销/键盘返回；不从坐标或工作项集合造子图。完整函数签名、adapter映射、错误矩阵与测试实现留03～05；原型图不是执行证据。

逐流自检：入口§7、对象§6可回链，受影响source/局部状态/迟到/失败边界已点名；无完整实现/内部bus；结构gate pass。


### 8.17 `LoadProjectProcessFlow`

归属：协作体验语境；承接§7同名入口。

#### `LoadProjectProcessFlow` 处理流

```text
LoadProjectProcessFlow Query
  |
  v
Inbound / Operations
  - 接收 OwnerReference project_ref、ActorContext actor、ClientConsumptionContext context
  |
  v
Application / ProcessDrilldownCoordinator
  - 验证project与正式Process语境关系/访问，不按名称或原型图关联
  - 经SDK读取Process整体安全拓扑、节点/边/层级与版本/coverage
  - 分别读取正式状态，校验与拓扑兼容性；不兼容partial/stale重查
  - 只读renderer绘制分叉/各分支/汇聚，Governance Gate独立ref/section
  |
  v
ProcessFlowViewModel / ProvenanceMetadata / FreshnessMarker
  |
  v
整体流程图与等价列表；无正式projection blocked
```

关键设计点：通过SDK正式能力读/恢复或处理局部状态，未确认能力blocked；不改owner truth。planned验证切口：无拓扑/状态版本不兼容/并行分支/隐藏节点；不执行BPMN或推导join。完整函数签名、adapter映射、错误矩阵与测试实现留03～05；原型图不是执行证据。

逐流自检：入口§7、对象§6可回链，受影响source/局部状态/迟到/失败边界已点名；无完整实现/内部bus；结构gate pass。


### 8.16 `LoadProjectDetail`

归属：协作体验语境；承接§7同名入口。

#### `LoadProjectDetail` 处理流

```text
LoadProjectDetail Query
  |
  v
Inbound / Operations
  - 接收 OwnerReference project_ref、ActorContext actor、ClientConsumptionContext context
  |
  v
Application / ProjectContextCoordinator
  - 正式验证项目访问，建立五标签同project局部导航
  - 通过SDK分别读取Work概览/工作项及获准证据ref
  - 进度/关联群聊按需进入独立query，各section分别保留来源/缺口
  - 切换project先失效旧代次；迟到section不得应用新project
  |
  v
ProjectDetailViewModel / ProjectNavigationState / SafeMaterialSnapshot
  |
  v
同一详情五标签，section独立loading/partial/blocked
```

关键设计点：通过SDK正式能力读/恢复或处理局部状态，未确认能力blocked；不改owner truth。planned验证切口：项目切换/section失败/标签恢复；未获准材料不可由别的section补齐。完整函数签名、adapter映射、错误矩阵与测试实现留03～05；原型图不是执行证据。

逐流自检：入口§7、对象§6可回链，受影响source/局部状态/迟到/失败边界已点名；无完整实现/内部bus；结构gate pass。
