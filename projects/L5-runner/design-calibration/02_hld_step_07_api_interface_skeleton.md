# Step 7. API / 接口骨架

## 1. Step 状态

| 字段 | 值 |
|---|---|
| 文档 | `02-概要设计.md` |
| Step | 7 / API 与接口骨架 |
| 状态 | `completed` |
| 当前模块 | `interfaces:self_reviewed` |
| gate_status | `pass` |
| gate_reason | 六个组成部分的 Command、Query、条件性 Consumer、Operations Job 与 required ports 已分类并完成对象承接/读写边界审计；未伪造 event family 或 exact owner API。 |
| next_allowed_action | `read_and_start_step_08` |
| 正式正文写入 | `blocked_until_step_14` |

### 1.1 Step 内计划

- [x] 恢复台账、flow、Step 6 并读取概要 SOP Step 7 / 书写规范 §4.7。
- [x] 按六个组成部分识别对象能力入口和接口类别。
- [x] 逐部分收稳 Command/Query/Consumer/Job/required port，并完成停审。
- [x] 审计 ActorContext、metadata/idempotency、owner source、读写与 blocker 边界。
- [x] 形成回填草稿并同步 flow / 项目台账。

## 2. 本步输入

| 输入 | 用途 |
|---|---|
| Step 5 | 组成部分、capability、接缝和接口归属。 |
| Step 6 | 17 个对象及其能力、状态和禁止事项。 |
| 正式 01 §8～10 | 依赖方向、同步/异步/后台路径和 owner-safe communication。 |
| `RUN-UP-001~008` | 限制正向 adapter、consumer 与 exact schema 的真实性上限。 |

## 3. 接口分类与问题回答

```text
Command
  显式表达 Runner-owned selection / intent / control / handoff 变更；
  必须带 ActorContext、CommandMetadata 与 IdempotencyKey（如产生副作用）。

Query
  只读 local truth、safe owner projection/ref 和 local observation；
  必须带 ActorContext / visibility context，不得创建、刷新或修复状态。

Inbound Event Consumer
  只在 owner 正式 SDK/event seam 存在时消费 owner 已提交事实；
  event envelope/id/dedup/source version 必须显式，当前均为 planned/blocked。

Outbound Event
  当前无已确认 Runner-owned 正式 event family；不以本地记录或 UI telemetry 伪造。

Operations Job
  承接长时取得/验证、只读对账、投影刷新和安全淘汰评估；
  job success 不等于 owner success，unknown 不自动重放。

Required Port
  描述 Runner 所需能力和安全失败语义；不证明 owner client/DTO/transport 已存在。
```

## 4. 当前文档诊断、改动对比与取舍

| 议题 | 旧/候选风险 | 当前取舍 |
|---|---|---|
| retry/replay/kill 接口 | 隐含任意副作用重放 | 只提供 typed control intent；unknown 进入 reconcile。 |
| 页面接口 | 每页直连不同外部系统 | 所有页面/CLI/产品入口通过同一 Command/Query facade。 |
| Owner events | 根据系统名猜 topic/payload | 仅列 planned consumer capability；没有正式 event seam 时用显式 query/reconcile。 |
| Outbound events | 把 local operation/outbox 当正式传播 | 当前不定义 event family；后续需 owner/consumer authority。 |
| Generic adapter | `Any`/JSON/HTTP 200 补齐缺失合同 | required ports 使用 typed semantic skeleton，未知 schema blocked。 |

## 5. 按组成部分接口骨架索引

| 组成部分 | Command | Query | Consumer / Job | 关键对象 |
|---|---|---|---|---|
| Context and explicit selection | `SelectRelease`、`InvalidateSelection` | `ResolveRunnerContext`、`ListSelectableReleases`、`GetSelectionPosture` | `ConsumeReleaseAuthorityChange` (planned) | `RunnerContextRef`、`ReleaseSelection` |
| Material acquisition and qualification | `RequestMaterialAcquisition`、`PauseAcquisition`、`ResumeAcquisition`、`CancelAcquisition` | `GetMaterialPreparation`、`GetCacheProtection` | `AcquireAndVerifyMaterialJob`、`EvaluateCacheEvictionJob` | `AcquisitionTask`、`MaterialCacheEntry`、`IntegrityPosture` |
| Run intent and lifecycle | `RequestRun`、`RequestRunControl` | `GetRunLifecycle` | `ConsumeSandboxLifecycleChange` / `ConsumeRuntimeStatusChange` (planned) | `RunIntent`、`ControlIntent`、`OwnerRunProjection` |
| Resource, cleanup and recovery | `RequestCleanup`、`OpenManualReview` | `GetResourceCleanupView`、`GetRecoveryCase` | `ReconcileRunnerStateJob`、owner lifecycle consumers | `ResourceObservation`、`ProtectionGuard`、`RecoveryCase` |
| Preview, diagnosis and handoff | `RequestDiagnosticHandoff` | `GetOutputPreview`、`GetFailureDiagnosis`、`GetHandoffPosture` | `ConsumeHandoffChange` (planned)、`RefreshSafeDiagnosisJob` | `OutputPreview`、`FailureDiagnosis`、`HandoffPosture` |
| Entry and presentation | 无额外 domain command；映射上述 commands | `GetRunnerReadModel` | `RefreshVisibleSourcesJob` | `RunnerReadModel`、`ConnectivityView` |

## 6. Command API 骨架

| Command | 所属部分 | 输入骨架 | 输出骨架 | 主要处理 | 写入结果 |
|---|---|---|---|---|---|
| `SelectRelease` | Context/selection | `ActorContext`、`SelectReleaseInput`、`CommandMetadata`、`IdempotencyKey` | `ReleaseSelectionResult` | 解析 context，拒绝隐式版本，创建新 generation | `ReleaseSelection`；旧资格/意图失效标记 |
| `InvalidateSelection` | Context/selection | `ActorContext`、`SelectionInvalidationInput`、`CommandMetadata` | `SelectionInvalidationResult` | 校验 source/generation 并失效选择 | 新 `SelectionGeneration` 与 invalidated posture |
| `RequestMaterialAcquisition` | Material | `ActorContext`、`AcquisitionRequestInput`、`CommandMetadata`、`IdempotencyKey` | `AcquisitionRequestResult` | 校验 current authority/binding，建立取得任务 | `AcquisitionTask`；不生成 verified |
| `PauseAcquisition` | Material | `ActorContext`、`AcquisitionControlInput`、`CommandMetadata` | `AcquisitionControlResult` | 对本地取得任务表达暂停 | task paused posture |
| `ResumeAcquisition` | Material | `ActorContext`、`AcquisitionControlInput`、`CommandMetadata`、`IdempotencyKey` | `AcquisitionControlResult` | 重验 binding/authority 后恢复传输 | task transferring 或 blocked |
| `CancelAcquisition` | Material | `ActorContext`、`AcquisitionControlInput`、`CommandMetadata` | `AcquisitionControlResult` | 取消取得；材料清理另走保护门禁 | task cancelled posture |
| `RequestRun` | Lifecycle | `ActorContext`、`RunRequestInput`、`CommandMetadata`、`IdempotencyKey` | `RunRequestResult` | 校验 selection/material/protection，建立并提交 intent | `RunIntent` + optional owner request ref |
| `RequestRunControl` | Lifecycle | `ActorContext`、`RunControlInput`、`CommandMetadata`、`IdempotencyKey` | `RunControlResult` | 创建 start/stop/cancel 意图并经正式 port 提交 | `ControlIntent`; result 可 accepted/rejected/unknown |
| `RequestCleanup` | Resource/recovery | `ActorContext`、`CleanupRequestInput`、`CommandMetadata`、`IdempotencyKey` | `CleanupRequestResult` | 评估 `ProtectionGuard`，允许时提交 owner cleanup intent | cleanup intent/ref；不直接标 released |
| `OpenManualReview` | Resource/recovery | `ActorContext`、`ManualReviewInput`、`CommandMetadata` | `ManualReviewResult` | 将无法证明的 recovery case 置 manual-review | `RecoveryCase` 状态更新 |
| `RequestDiagnosticHandoff` | Diagnosis/handoff | `ActorContext`、`DiagnosticHandoffInput`、`CommandMetadata`、`IdempotencyKey` | `DiagnosticHandoffResult` | 校验 redaction/visibility，准备并提交 handoff | `HandoffPosture`；不创建 evidence |

Command 共通约束：所有可能产生副作用的入口必须显式 metadata/correlation/idempotency；输入绑定 generation/source/digest/expected owner basis；adapter timeout 返回 unknown，禁止入口自动重放。

## 7. Query API 骨架

| Query | 所属部分 | 输入骨架 | 输出骨架 | 读取来源 | 边界 |
|---|---|---|---|---|---|
| `ResolveRunnerContext` | Context/selection | `ActorContext`、`RunnerContextQueryInput` | `RunnerContextView` | formal context port + local safe ref | 只读，不创建 selection |
| `ListSelectableReleases` | Context/selection | `ActorContext`、`ReleaseSelectionQueryInput` | `SelectableReleasePage` | Artifact/Governance safe view | 禁止 latest/default；blocked 时不补旧 cache |
| `GetSelectionPosture` | Context/selection | `ActorContext`、`SelectionQueryInput` | `SelectionPostureSection` | local selection + owner authority snapshot | 不刷新或批准 |
| `GetMaterialPreparation` | Material | `ActorContext`、`MaterialQueryInput` | `MaterialPostureSection` | task/cache/integrity local state | 不启动下载/验证 |
| `GetCacheProtection` | Material | `ActorContext`、`CacheProtectionQueryInput` | `CacheProtectionView` | cache entry + guard snapshots | 不删除/释放保护 |
| `GetRunLifecycle` | Lifecycle | `ActorContext`、`RunLifecycleQueryInput` | `RunPostureSection` | run/control intent + owner projection | 无 owner ref 不确认 running |
| `GetResourceCleanupView` | Resource/recovery | `ActorContext`、`ResourceCleanupQueryInput` | `ResourceCleanupSection` | local observations + owner lease/cleanup refs | 双视图，冲突显式 |
| `GetRecoveryCase` | Resource/recovery | `ActorContext`、`RecoveryQueryInput` | `RecoveryCaseView` | local recovery state + resolution refs | 不触发 reconcile/replay |
| `GetOutputPreview` | Diagnosis/handoff | `ActorContext`、`OutputPreviewQueryInput` | `OutputPreviewView` | safe owner material + local view | bounded/redacted；不取 raw body |
| `GetFailureDiagnosis` | Diagnosis/handoff | `ActorContext`、`FailureDiagnosisQueryInput` | `FailureDiagnosisView` | local safe diagnosis + source refs | 不生成 verdict |
| `GetHandoffPosture` | Diagnosis/handoff | `ActorContext`、`HandoffQueryInput` | `HandoffPostureView` | local posture + formal receipt ref | receipt 非 evidence |
| `GetRunnerReadModel` | Entry/presentation | `ActorContext`、`RunnerReadModelQueryInput` | `RunnerReadModel` | 所有 safe local/read projections | 纯组合；不 refresh/repair/write |

## 8. Inbound Event Consumer 骨架

| Consumer | 所属部分 | 来源 | 输入骨架 | 本地结果 | 边界 / 当前状态 |
|---|---|---|---|---|---|
| `ConsumeReleaseAuthorityChange` | Context/selection | Artifact/Governance formal event seam | `OwnerEventEnvelope<ReleaseAuthorityChange>`、event id/source version | selection stale/invalidated projection | `RUN-UP-001/002/008`; planned/blocked；未知 schema 不消费 |
| `ConsumeSandboxLifecycleChange` | Lifecycle/resource | Sandbox formal event seam | `OwnerEventEnvelope<SandboxLifecycleChange>` | `OwnerRunProjection` / protection view 更新 | `RUN-UP-003/007/008`; planned/blocked；receipt 不推 running |
| `ConsumeRuntimeStatusChange` | Lifecycle | Runtime formal event seam | `OwnerEventEnvelope<RuntimeStatusChange>` | execution/result projection 更新 | `RUN-UP-004/008`; planned/blocked |
| `ConsumeHandoffChange` | Diagnosis/handoff | Observability formal event seam | `OwnerEventEnvelope<HandoffChange>` | `HandoffPosture`/receipt projection 更新 | `RUN-UP-005/008`; planned/blocked；不生成 evidence |

每个 consumer 需要 event id、owner source/version、visibility、trace/correlation 和 dedup basis；exact envelope/payload 未闭合前不得实现正向消费。事件只承接 owner 已提交事实，gap/乱序进入 stale/reconcile，不以 cursor 自动修复。

## 9. Outbound Event 骨架

当前不定义正式 Runner outbound event family。原因：没有经需求/架构和消费者合同确认的 Runner-owned 事实传播面；本地 selection/intent/diagnosis 记录不能自动成为全局事件。若后续需要，必须重开概要接口校准并明确事件 owner、消费者、payload、visibility、delivery 与 evidence 边界。

## 10. Operations Job 骨架

| Job | 所属部分 | 输入来源 | 输出结果 | 边界 |
|---|---|---|---|---|
| `AcquireAndVerifyMaterialJob` | Material | persisted acquisition task、formal locator/manifest refs | progress、quarantine、integrity posture、qualified/blocked | job success 不等 owner approval/running；正向 port blocked |
| `EvaluateCacheEvictionJob` | Material/resource | cache entries、`ProtectionGuard`、capacity observation | evictable candidates 或 protected/unknown | 不绕 active protection；不直接删 owner material |
| `ReconcileRunnerStateJob` | Resource/recovery | frozen `RecoveryCase`、formal read ports | reconciled/conflict/manual-review + rebuilt local views | query-first；不自动 replay/write owner truth |
| `RefreshSafeDiagnosisJob` | Diagnosis/handoff | source failure refs、safe diagnostic ports | updated `FailureDiagnosis`/preview or restricted | 不抓 raw logs；不生成 verdict |
| `RefreshVisibleSourcesJob` | Entry/presentation | explicit schedule/foreground trigger、formal read ports | refreshed safe projections and freshness | 不在 query/render 内触发；partial/unavailable 显式 |

## 11. Required Port / Adapter 骨架

| Required port | 所属部分 | 所需能力 | 安全失败 | 状态 |
|---|---|---|---|---|
| `ContextReadPort` | Context | actor/session/project/scope safe resolution | restricted/blocked；不猜身份 | `RUN-UP-008 pending` + owner 条件 |
| `ReleaseAuthorityReadPort` | Context | exact Release/version、baseline/authority applicability、revoke/expiry/conflict | blocked/invalidated | `RUN-UP-001/002/008 blocked` |
| `MaterialSourcePort` | Material | locator/manifest/transport constraints | no locator/blocked | `RUN-UP-001/008 blocked` |
| `IntegrityVerifierPort` | Material | 按 owner-provided policy 验证 bytes | invalid/blocked；无宽松默认 | policy exact pending |
| `MaterialCachePort` | Material | quarantine、promotion、protection metadata、safe release | protected/unknown | local detailed design pending |
| `SandboxRunPort` | Lifecycle/resource | request/control/status/lease/cleanup/reconcile safe contract | rejected/unknown/conflict | `RUN-UP-003/007/008 blocked` |
| `RuntimeStatusReadPort` | Lifecycle | execution/status/result/recovery safe read | unavailable/unknown | `RUN-UP-004/008 blocked` |
| `PlatformResourcePort` | Resource | port/path/disk/process/platform safe probe | unknown/unavailable | `RUN-UP-007` + local detailed design pending |
| `DiagnosticReadPort` | Diagnosis | bounded/redacted output/diagnostic source | restricted/partial/unavailable | `RUN-UP-005/008 blocked` |
| `ObservabilityHandoffPort` | Handoff | redacted diagnostic handoff + receipt read | blocked/unknown | `RUN-UP-005/008 blocked` |
| `ArchiveReferencePort` | Handoff/peripheral | conditional safe archive/restore reference read | unavailable | `RUN-UP-006/008 blocked/peripheral` |
| `RunnerStateStorePort` | Shared | local truth、projection、expected-version persistence | conflict/storage unavailable | local detailed design pending |
| `ClockConnectivityPort` | Shared | clock/network/suspend/resume/cancellation observations | unknown | local detailed design pending |
| `RedactionPort` | Shared | safe transformation/validation | blocked，不返回未脱敏内容 | exact policy/SDK pending |

## 12. 接口归属停审与跨接口审计

| 审计项 | 结论 | 说明 |
|---|---|---|
| 六部分接口承接 | pass | 每个 capability 有 Command/Query/Job/port 或明确纯内部职责。 |
| 对象能力承接 | pass | Step 6 的可变对象有写入口；read models 有 query；无孤儿 API。 |
| 读写分类 | pass | Query no-write；Command 明确 local intent；event 只承接 owner fact。 |
| metadata/idempotency | pass | 副作用 command/job 均要求 typed metadata/binding；详细字段留 03。 |
| Events | pass with blocker | Consumers 明确 planned/blocked；Outbound event 明确不适用。 |
| External seam | pass with blocker | required ports 与 available adapters 分离。 |
| 页面/CLI 一致性 | pass | 入口只映射相同 Command/Query，不产生旁路。 |

## 13. 回填草稿

正式 §7 使用接口分类说明、Command/Query/Consumer/Job/required port 表；为控制篇幅可合并同类 query，但不得删除读写、metadata、source 与 blocker 边界。Outbound event 的“不适用及原因”必须保留。

## 14. 待确认事项

- 所有 owner exact methods、DTO/event schema、transport、version 与 errors 仍受 `RUN-UP-001~008` 控制。
- Consumer 是否启用取决于正式 event seam；在此之前显式 query/reconcile 是唯一保守路径。
- Runner outbound events 当前不存在，不得在 03/实现中自行增加；若需要须回退本 Step。

## 15. 进入下一步条件

- [x] 所有接口按 Command/Query/Consumer/Event/Job/port 正确分类。
- [x] 每个接口回指所属组成部分与关键对象能力。
- [x] 输入输出骨架、ActorContext、metadata/idempotency、读写和 blocker 边界明确。
- [x] 各部分停审及跨接口审计无 unresolved 冲突。
- [x] 未写 HTTP path、完整 schema、topic、transport 或鉴权实现。

结论：`gate_status=pass`，允许进入 Step 8“关键处理流”。
