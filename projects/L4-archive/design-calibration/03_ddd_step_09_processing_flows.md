# L4-archive 03 Step 09：逐接口函数级处理流

> 对应 SOP：`standards/document/详细设计讨论流程_SOP.md` Step 9
> 回填位置：未来正式 `03-详细设计.md` §8
> 日期：2026-09-11
> 状态：`completed / pass_with_upstream_blockers / stop_review`

## 1. Step 状态、输入与边界

| 项目 | 本 Step 结论 |
|---|---|
| 前置 | Step 01～08 已完成并停审；本轮用户明确授权 Step 09 |
| 直接输入 | 正式 `02-概要设计.md` §7～§10；`03_ddd_step_06_object_contracts.md`；`03_ddd_step_07_trait_port_adapter_contracts.md`；`03_ddd_step_08_protocol_contracts.md` |
| 本步目标 | 为 3 Command、5 Query、5 Consumer、17 Job 的每一条入口给出函数签名、调用图、DTO→对象构造、事务边界、错误映射、状态变化、副作用和测试切口 |
| 不在本步 | Step 10 状态矩阵、Step 11 物理 schema/index、Step 12 恢复算法、Step 13 并发算法、Step 14 配置绑定、Step 16 完整测试方案、Step 19 正式文档装配 |
| 正式文档 | 不修改正式 `03-详细设计.md`；本文件是唯一 Step 09 中间产物 |
| 外部事实 | provider、存储供应商、digest/签名/KMS、schema evolution、retention/delete、receiver 和 outbound 合同仍是 pending/blocker；相关 flow fail-closed |

## 2. SOP 问题回答、共享约定与流程目录

### 2.1 问题回答

| 问题 | 本 Step 回答 |
|---|---|
| 函数级输入从哪里来？ | API/consumer/worker 先验证 Step 08 envelope，再由 `ArchiveProtocolMapper` 和已有 `ArchiveOperationContext::{from_command,from_query,from_inbound_event,from_job}` 构造 typed input；禁止从字符串、route、当前时间或 fake map 补值 |
| 事务如何切分？ | 本地读取/状态变化/result 保存使用同一 `ArchiveStorePort` UoW；任何 external port 调用都在 intent/attempt 已提交后、事务外执行，回包重新开事务按 fixed input/version/fence reconcile |
| duplicate 如何处理？ | Command/Consumer/Job 先读取完整 typed result；同 key+同 digest 只 replay 原 payload/receipt/report，不重跑 domain 或外部 effect；缺完整结果返回 `ResultMissing/CorruptRecord` |
| Query 是否写入？ | 五个 Query 只用 `ReadOnlyStore` + `VisibilityResolutionRead` + `ArchiveVisibilityPort`；不开写 UoW，不 reserve，不写 cache/result/trace，不触发外部 I/O |
| ACK/accepted 是否等于业务成功？ | 否。只代表 Archive 本地 receipt/intent/result 已提交；owner commit、storage commit、restored、archived 均须由正式反馈和对应状态决定 |
| outbox/event 如何处理？ | `AR-HLD-Q-001` 未解锁；所有 outbound candidate 只记录 `blocked/no-op`，不创建 publisher、outbox 或 delivery contract |

### 2.2 共享调用图与伪代码骨架

```text
trusted entry
  -> envelope/context validation
  -> existing-result / reservation check (write flows only)
  -> application service
      -> read committed Archive truth
      -> domain factory/guard
      -> local UoW: save intent/state/result
  -> commit / commit-unknown probe boundary
  -> typed DTO or safe receipt/report
```

```rust
let context = ArchiveOperationContext::from_* (...)?;
let input = ArchiveProtocolMapper::from_validated_* (...)?;
let result = service.method(&context, input).await?;
ArchiveProtocolMapper::to_public(result)
```

`from_*` 的具体参数、service 方法和 port 方法必须与 Step 06/07/08 的正式名字一致；本 Step 不新增通用 dispatcher、repository、port 或状态 enum。

### 2.3 每条 flow 的固定记录项

每个 flow 都独立记录：`入口与签名`、`调用图`、`DTO/对象构造`、`事务与外部边界`、`状态/错误映射`、`结果/审计副作用`、`最小测试切口`、`单 flow 停审结论`。状态只回指 Step 06 的 enum；测试仅为设计切口，不是已执行证据。

## 3. Command flows（C01～C03）

### 3.1 C01 `RequestArchive`

**入口与构造**：`ArchiveCommandEnvelope<RequestArchivePayload>` → `request_archive(&self, context: &ArchiveOperationContext, input: RequestArchiveInput) -> ApplicationResult<ArchiveRequestResult>`。mapper 校验 `DeclaredArchiveScopeDto`、`AuthorityRef` 和有限 command name；context 使用 `from_command`。

**调用图**：

```text
API entry -> from_command -> mapper -> IdempotencyCoordinator
  -> ArchiveStorePort.open_read/begin
  -> reserve_operation -> ArchiveRequest::admit -> ArchiveJob::start
  -> append_archive_request + save_job + append_stage
  -> save_complete_result -> complete_operation -> commit
  -> RequestArchiveResponse
```

**事务/伪代码**：同一 UoW 内先 reserve，再读取 declared scope/authority 所需本地引用，调用 domain factory，追加 request、job、初始 `Queued` stage，组装完整 result 并保存；commit 失联为 `CommitUnknown`，使用 operation key/result probe，不重入 admission。

**状态/错误/副作用**：`ArchiveJobStage::Queued`；输入缺失/错误 kind→`Rejected`，上游 authority 或 scope 不可核验→`Blocked`，版本/CAS→`Conflict`，同 digest→`Duplicate`。保存 command result、audit/trace refs；outbox 为空并记录 blocked candidate。

**测试切口**：accepted 原子三对象；同 digest replay；异 digest conflict；scope/authority missing；commit-unknown probe；query capability 不可被调用。单 flow：`pass_with_upstream_blockers`。

### 3.2 C02 `RequestRestore`

**入口与构造**：`request_restore(&self, context, input: RequestRestoreInput) -> ApplicationResult<RestoreRequestResult>`；mapper 只要求非空唯一 `RestoreTargetOwnerSetDto`、`ArchiveBundleRef`、`RestoreAuthorityRef`。C02 冻结这三项但不解析 receiver mapping；`ArchiveRequestService` 不持有 `RestoreReceiverPort`。

**调用图**：

```text
API -> context/mapper -> reserve/replay
  -> read immutable Bundle + closure/verification/compatibility posture
  -> RestoreRequest::admit -> ArchiveJob::start
  -> append_restore_request + save_job + append_stage
  -> save_complete_result/complete_operation -> commit -> response
```

**事务/伪代码**：bundle 必须是 Archive-owned immutable revision；缺失、stale、integrity-failed 或 unsupported 在 domain 构造前返回 blocked，并保存完整 rejection result。Accepted 只写 restore request、job、初始 stage，不写 owner；receiver mapping unknown 不属于 C02 admission 分支，而由 `RestoreService` 在 J13/J15 形成 owner-specific `Blocked` plan/item 或阻止派发。

**状态/错误/副作用**：Restore job 初始 `Queued`；hidden/absent bundle 对外均 `NotAvailable`/`Blocked`，不泄露存在性；同 digest duplicate replay；commit-unknown 只 probe。记录 authority basis、trace、result；不产生 outbound。

**测试切口**：多 owner 去重；bundle revision mismatch；compatibility unsupported；accepted 不调用 RestoreReceiverPort；duplicate 完整字段对称。单 flow：`pass_with_upstream_blockers`。

### 3.3 C03 `RequestLifecycleExecution`

**入口与构造**：`request_execution(&self, context, input: RequestLifecycleExecutionInput) -> ApplicationResult<LifecycleRequestResult>`；mapper 固定 `BundleRevisionRef`、`GovernanceDecisionRef`、`LifecycleActionKindDto`，不解释 policy 内容。

**调用图**：

```text
API -> from_command/mapper -> reserve/replay
  -> read bundle revision -> GovernanceDecisionPort.lookup/check_current
  -> LifecycleExecution::begin -> ExternalActionRecord::record_intent
  -> save_lifecycle + save_action + save_complete_result + complete -> commit
  -> response
```

**事务/外部边界**：只保存 intent；不调用 `ArchiveStoragePort`、`GovernanceDecisionPort.observe_lifecycle_compensation` 或 provider dispatch。decision applicability、hold/expiry 接缝未闭合则 `Blocked`。

**状态/错误/副作用**：execution `Eligible`→`IntentRecorded`；无 decision、stale decision、unsupported action、version conflict 分别映射 `Blocked`/`Rejected`/`Conflict`。保存 action key、decision basis、result；outbox blocked/no-op。

**测试切口**：decision lookup unavailable；delete action 不绕过 hold；same key replay；intent 与 result 同 UoW；无外部 dispatch。单 flow：`pass_with_upstream_blockers`。

## 4. Query flows（Q01～Q05，全部 no-write）

### 4.1 Q01 `GetArchiveJobStatus`

**签名**：`get_job_status(&self, context, input: GetArchiveJobStatusInput) -> ApplicationResult<SafeRead<SafeArchiveJobStatusView>>`。

**调用图**：`API -> from_query/assert_query_no_write -> resolve_read(Job selector) -> visibility.resolve_read/evaluate -> ReadOnlyStore.open_read -> get_job_with_version + get_stage/list component records -> SafeArchiveJobStatusView::assemble -> public response`。

**构造与边界**：public cursor 先映射并绑定 selector/principal/visibility/snapshot/order；只从同一 committed snapshot 组 view，不从 stage 推导项目 archived/restored。无写事务、无 result 保存、无 external port。

**错误/状态/测试**：hidden/absent→`NotAvailable`；mixed snapshot/expired cursor→`Stale`；visibility unavailable→`Unknown`；repository failure→typed unavailable。测试覆盖 empty page marker、cursor mismatch、no-write spy、component posture 保守组装。单 flow：`pass`（受持续上游 blocker 影响）。

### 4.2 Q02 `GetArchiveBundle`

**签名**：`get_bundle(&self, context, input: GetArchiveBundleInput) -> ApplicationResult<SafeRead<SafeArchiveBundleView>>`。

**调用图**：`API -> query context -> resolve Bundle revision -> visibility -> read get_bundle_with_version/get_manifest/get_manifest_closure/list_manifest_entries/list placement/lifecycle -> SafeArchiveBundleView::assemble -> DTO`。

**构造与边界**：revision、manifest、closure、entry、placement/lifecycle 必须同 immutable revision；public cursor 映射 repository cursor，不暴露内部 cursor。Query 不 assembly、repair、retrieve、cache write。

**错误/状态/测试**：missing/hidden→`NotAvailable`；closure incomplete→`Partial`；revision mismatch→`Conflicting`；read failure→`Unknown`。测试 closure posture 不被 entry 子集重算、Sealed+非 Complete closure 拒绝、no external calls。单 flow：`pass`。

### 4.3 Q03 `VerifyArchiveBundle`

**签名**：`verify_bundle(&self, context, input: VerifyArchiveBundleInput) -> ApplicationResult<SafeRead<SafeBundleVerificationView>>`。

**调用图**：`API -> query context -> resolve Verification selector -> visibility -> read list/get verification + compatibility + findings -> SafeBundleVerificationView::assemble -> DTO`。

**构造与边界**：只读已提交 assessment/finding；不调用 `IntegrityCapabilityPort`/`CompatibilityCapabilityPort`，不创建新 assessment。assessment 必须匹配 exact manifest/material revision 和 target context。

**错误/状态/测试**：无 assessment→`NotAvailable`/`Partial`；`IntegrityFailed`、`Unknown`、`Unsupported` 显式保留，不升格 Verified/Supported；wrong target→`Conflicting`。测试验证 no re-assess、finding association、visibility redaction。单 flow：`pass`。

### 4.4 Q04 `GetRestorePlan`

**签名**：`get_restore_plan(&self, context, input: GetRestorePlanInput) -> ApplicationResult<SafeRead<SafeRestorePlanView>>`。

**调用图**：`API -> query context -> resolve RestorePlan -> visibility -> read get_plan_with_version/list_items/list handoffs/outcomes as allowed -> SafeRestorePlanView::assemble -> DTO`。

**构造与边界**：plan state 来 committed plan，不从披露后的 item 子集重算；per-owner item/handoff 只按 current visibility 裁剪；不调用 receiver、source export、compensation。

**错误/状态/测试**：hidden/absent→`NotAvailable`；plan/item missing→`Partial`；superseded revision→`Stale`；测试 empty page visibility seed、plan state stability、no-write/no-handoff。单 flow：`pass`。

### 4.5 Q05 `GetRestoreHandoffStatus`

**签名**：`get_restore_handoff_status(&self, context, input: GetRestoreHandoffStatusInput) -> ApplicationResult<SafeRead<SafeRestoreHandoffView>>`。

**调用图**：`API -> query context -> resolve exact handoff/item -> visibility -> read get_handoff_with_version/list outcomes/list compensations -> SafeRestoreHandoffView::assemble -> DTO`。

**构造与边界**：按 owner-specific handoff 历史读取；不从 ACK 推断 success，不 probe/retry/compensate，不把 handoff complete 映射 owner/project restored。

**错误/状态/测试**：`CommitUnknown`/`ReconcileRequired` 原样显示为 safe posture；hidden/absent→`NotAvailable`；outcome history partial→`Partial`。测试 no receiver calls、history redaction、cursor binding。单 flow：`pass`。

## 5. Inbound consumer flows（E01～E05）

### 5.1 E01 `ConsumeArchiveTrigger`

**签名**：`consume_archive_trigger(&self, context, input: ArchiveTriggerInput) -> ApplicationResult<ArchiveTriggerResult>`。

**调用图**：`trusted envelope validator -> from_inbound_event -> get_consumer_receipt(event_id) -> ArchiveRequestService -> read trigger authority/scope -> append observation or admission intent -> save receipt/result -> commit -> ACK disposition`。

**事务/状态**：缺 event/envelope/source/version/dedup/trace 先 rejected/quarantined，不解析 payload；duplicate 只 replay receipt。合法 trigger 只能产生受理语境或 finding，不能绕过 command authority，也不能直接改 project state。

**错误/副作用/测试**：unsupported version→`UnsupportedVersion`；unknown source→`Quarantined`；local commit unknown→`CommitUnknown`；保存完整 receipt（不保存外部正文），outbound blocked/no-op。测试 envelope-before-payload、duplicate、authority missing、receipt round-trip。单 flow：`pass_with_upstream_blockers`。

### 5.2 E02 `ConsumeSourceExportFeedback`

**签名**：`consume_feedback(&self, context, input: SourceExportFeedbackInput) -> ApplicationResult<SourceExportFeedbackResult>`。

**调用图**：`validator -> receipt lookup -> SourceCaptureService -> get_capture_with_version/get_capture_input -> map SourceExport feedback -> save_capture/append_captured_source/append_source_finding -> save receipt/result -> commit`。

**状态/事务**：feedback correlation、fixed input、source authority、coverage 分离核验；`Settled` 仅在 exact approved material/coverage；partial/stale/missing/conflicting 保存 typed finding，不压成 settled。无 external call。

**错误/副作用/测试**：unsupported/quarantined/delayed/duplicate/commit-unknown 均完整 receipt；payload 不重复 envelope，不保存正文或 secret。测试 wrong attempt, stale version, partial coverage, idempotent replay。单 flow：`pass_with_upstream_blockers`。

### 5.3 E03 `ConsumeGovernanceDecisionChange`

**签名**：`consume_decision_change(&self, context, input: GovernanceDecisionChangeInput) -> ApplicationResult<GovernanceDecisionChangeResult>`。

**调用图**：`validator -> receipt lookup -> LifecycleExecutionService -> read affected lifecycle/action -> GovernanceDecisionPort.check_current -> save blocked/reassessment basis + receipt -> commit`。

**状态/事务**：不创建 governance decision；旧 decision mismatch、new hold、expiry、unknown 都保存 blocked/reconcile basis。不会直接 dispatch 或 compensate；由后续 J11/J12 使用已提交 intent。

**错误/副作用/测试**：conflicting decision→typed `Conflicting`；provider unavailable→`Unavailable/Delayed`；保存完整 receipt/result，outbound blocked/no-op。测试 decision correlation、hold blocks dispatch、duplicate replay、no direct owner write。单 flow：`pass_with_upstream_blockers`。

### 5.4 E04 `ConsumeStorageActionFeedback`（Placement 分支）

**签名**：`PlacementService::consume_feedback(&self, context, input: StorageActionFeedbackInput) -> ApplicationResult<StorageActionFeedbackResult>`。

**调用图**：`validator -> receipt lookup -> persisted ExternalActionTargetRef -> PlacementService -> get_action_with_version/get_storage_intent -> map StorageObservedOutcome -> save action/placement + receipt/result -> commit`。

**状态/事务**：只路由 `Placement` target；ACK 只记 `Acknowledged`/observation，不更新 `Committed`；commit/unknown/retrievability 由 typed outcome 驱动。target 缺失/冲突拒绝，不广播两个服务。

**测试**：placement target exact routing、ACK≠commit、duplicate receipt、commit unknown、wrong effect key。副作用仅本地 history；outbound blocked。单 flow：`pass_with_upstream_blockers`。

### 5.5 E04-L `ConsumeStorageActionFeedback`（Lifecycle 分支）

**签名**：`LifecycleExecutionService::consume_storage_feedback(&self, context, input: StorageActionFeedbackInput) -> ApplicationResult<StorageActionFeedbackResult>`。

**调用图**：`validator -> receipt lookup -> target inspection(Lifecycle) -> get_lifecycle_with_version/get_action_with_version -> GovernanceDecisionPort.check_current -> save lifecycle/action transition + receipt -> commit`。

**状态/事务**：只路由 `Lifecycle` target；必须重核正式 decision/hold；ACK 不等 commit，unknown 进入 reconcile-required；不得把 storage feedback 作为 governance decision。

**测试**：target conflict、decision stale、commit unknown、duplicate replay、no placement write。单 flow：`pass_with_upstream_blockers`。

### 5.6 E05 `ConsumeRestoreReceiverFeedback`

**签名**：`consume_receiver_feedback(&self, context, input: RestoreReceiverFeedbackInput) -> ApplicationResult<RestoreReceiverFeedbackResult>`。

**调用图**：`validator -> receipt lookup -> RestoreService -> find_handoff_by_key/get_handoff_intent -> map receiver outcome -> append_handoff_outcome/save_handoff -> save receipt/result -> commit`。

**状态/事务**：per-owner receiver correlation；Succeeded 只表示该 handoff outcome，不推进项目 restored；partial/stale/missing/conflicting/unsupported/integrity-failed/commit-unknown 独立保存。

**测试**：wrong receiver key、duplicate event、ACK/success distinction、partial owner set、receipt round-trip、no owner DB write。单 flow：`pass_with_upstream_blockers`。

## 6. Operations job flows（J01～J17）

### 6.1 Job shared flow contract

每个 Job 都由 `ArchiveJobEnvelope<T>` 携带 `ArchiveJobMetadata`（job name、run id、idempotency key、actor、trace、worker claim），payload 不重复这些字段。入口先校验 claim/fence/target，再读取完整已保存 report；duplicate 直接 replay。首次运行遵循：

```text
worker claim/fence -> read fixed input -> local intent/attempt UoW commit
  -> (optional) external port call outside UoW
  -> probe/reconcile response in a new UoW
  -> save full report + stage/checkpoint -> commit
```

任何可能已发出 effect 的失联结果都是 `CommitUnknown`，不能直接 retry；`ArchiveStoragePort`、`SourceExportPort`、`IntegrityCapabilityPort`、`CompatibilityCapabilityPort`、`GovernanceDecisionPort`、`RestoreReceiverPort` 的 typed outcomes 是唯一错误/状态来源。所有报告都保存 processed item、related refs、continuation、stage、issues；不创建 outbound ready contract。

### 6.2 J01 `AdvanceArchiveJob`

**签名/图**：`advance_job(&self, context, input: AdvanceArchiveJobInput) -> ApplicationResult<AdvanceArchiveJobReport>`。

```text
worker -> claim/fixed job -> read job + latest stage/component postures
  -> ArchiveJob::advance/recompute -> save_job + append_stage + checkpoint
  -> save report/complete -> commit
```

无 external I/O；只按 job kind 与已提交 component posture 选择下一 stage。非法 stage/version→`Conflicting`，缺 component→`Blocked`，CAS→`Stale`；不以单一 CP 完成推导 aggregate Completed。测试涵盖 stage fence、duplicate report、restore/archive kind separation、commit unknown。单 flow：`pass`。

### 6.3 J02 `PlanArchiveSources`

**签名/图**：`plan_sources(&self, context, input: PlanArchiveSourcesInput) -> ApplicationResult<PlanArchiveSourcesReport>`。

```text
worker -> claim -> read request/scope/existing bindings
  -> local UoW save complete Planned SourceBinding intent
  -> reconstruct SourceBindingInput from committed request/scope/binding
  -> SourceExportPort.bind_source outside UoW
  -> new UoW save Bound/Blocked transition + BoundSourceRecord + checkpoint/report
```

外部 bind 必须在完整 Planned binding 已提交后执行；`SourceBindingInput` 只能由 immutable request/scope 与该 committed binding 重构。`SourceExportPort` 没有 bind probe；若返回错误表示 `MayHaveDispatched` 或 outcome 不可确认，本次保持 `Blocked/Unknown` 且不得靠 E02/J04（它们只处理 capture）或盲重调伪造收敛。不能以 workspace projection 替代 owner snapshot。缺 source authority/fence→`Blocked`；partial source list→逐项 `Partial`。测试 source-authority routing、projection-not-canonical、bind unknown no blind retry、replay。

### 6.4 J03 `CaptureArchiveSource`

**签名/图**：`capture_source(&self, context, input: CaptureArchiveSourceInput) -> ApplicationResult<CaptureArchiveSourceReport>`。

```text
worker -> claim -> load CaptureAttempt + fixed SourceCaptureInput
  -> transition Requested/InProgress; commit intent
  -> SourceExportPort.capture outside UoW
  -> save returned observation/coverage or reconcile-required -> report
```

`Settled` 需要 exact source version/fence/coverage；partial/missing/stale/conflicting 不得伪装 Settled。provider timeout/possible dispatch→`CommitUnknown`，必须 J04 probe。测试 fixed-input mismatch、source export unavailable、no retry on unknown、report replay。

### 6.5 J04 `ReconcileSourceCapture`

**签名/图**：`reconcile_capture(&self, context, input: ReconcileSourceCaptureInput) -> ApplicationResult<ReconcileSourceCaptureReport>`。

```text
worker -> claim -> read attempt + stored fixed input
  -> SourceExportPort.probe_capture outside UoW
  -> compare source version/fence/coverage -> save attempt/coverage/finding + report
```

Probe `NotFound` 不能证明无 effect；unknown 继续保存 `CommitUnknown`/reconcile-required。只有 formal exact feedback 才能 `Settled`；owner canonical truth 仍归 source owner。测试 probe unknown、late feedback、stale fence、coverage separation。

### 6.6 J05 `AssembleBundleManifest`

**签名/图**：`assemble_manifest(&self, context, input: AssembleBundleManifestInput) -> ApplicationResult<AssembleBundleManifestReport>`。

```text
worker -> claim -> read approved captures/material refs/fixed closure input
  -> ArchiveBundle/BundleManifest factory -> append manifest/entries/closure findings
  -> save bundle + report/checkpoint -> commit
```

只使用已提交、owner-approved material/ref；workspace view、artifact ref 或 audit summary 缺 authority 时标 `Partial/Blocked`。closure exact-set 不完整不能 `ClosureReady`。无 external I/O。测试 duplicate manifest revision、missing material、closure under-closure、stable ordering。

### 6.7 J06 `SealArchiveBundle`

**签名/图**：`seal_bundle(&self, context, input: SealArchiveBundleInput) -> ApplicationResult<SealArchiveBundleReport>`。

```text
worker -> claim -> read bundle/manifest/closure + verification + compatibility + placement basis
  -> BundleSealBasis::bind exact revision -> ArchiveBundle::seal
  -> save_bundle + report -> commit
```

seal 前必须重新读取 exact set；缺任一 required basis、assembly origin 不匹配或 closure 重评失败→`Blocked/Conflicting`。不生成 digest/signature/key，不调用 provider；外部完整性 pending 保持 fail-closed。测试 exact basis、old closure cannot unlock、CAS/duplicate。

### 6.8 J07 `AssessBundleIntegrity`

**签名/图**：`assess_integrity(&self, context, input: AssessBundleIntegrityInput) -> ApplicationResult<AssessBundleIntegrityReport>`。

```text
worker -> claim -> read fixed VerificationInputBinding
  -> create Pending/InProgress assessment; commit
  -> IntegrityCapabilityPort.assess outside UoW
  -> map typed feedback -> save immutable assessment/findings/report
```

缺 digest/signature/KMS/algorithm contract→`Blocked/Unknown`，不造 placeholder；exact manifest/material revision mismatch→`Conflicting`。assessment immutable，重评建立新 assessment。测试 no fake Verified、finding mapping、provider unavailable、duplicate report。

### 6.9 J08 `AssessBundleCompatibility`

**签名/图**：`assess_compatibility(&self, context, input: AssessBundleCompatibilityInput) -> ApplicationResult<AssessBundleCompatibilityReport>`。

```text
worker -> claim -> read revision/schema refs/target context
  -> create assessment intent -> CompatibilityCapabilityPort.assess outside UoW
  -> save Supported/Unsupported/Unknown/Conflicting assessment + report
```

target context 必须精确（Verification/Read/RestoreReceiver(owner)）；不可跨 target 复用。schema evolution authority 未闭合时保持 Unknown/Blocked，不自动迁移。测试 target isolation、unsupported visibility、late outcome。

### 6.10 J09 `PlaceArchiveBundle`

**签名/图**：`place_bundle(&self, context, input: PlaceArchiveBundleInput) -> ApplicationResult<PlaceArchiveBundleReport>`。

```text
worker -> claim -> read sealed revision + storage binding
  -> save Placement IntentRecorded + StorageDispatchInput; commit
  -> ArchiveStoragePort.dispatch outside UoW
  -> map observed outcome -> save placement/action/report; commit
```

`ACK` 仅 observation；`Committed` 需要 typed commit/evidence；possible dispatch→`CommitUnknown`，J12 reconcile。location/tier/provider 未闭合不做 ready placement。测试 intent-before-effect、ACK≠commit、effect-key duplicate、unknown no blind retry。

### 6.11 J10 `RetrieveArchiveBundle`

**签名/图**：`retrieve_bundle(&self, context, input: RetrieveArchiveBundleInput) -> ApplicationResult<RetrieveArchiveBundleReport>`。

```text
worker -> claim -> read placement + sealed revision
  -> save retrieval intent; commit
  -> ArchiveStoragePort.dispatch/probe outside UoW
  -> save material/location/retrievability observation + report
```

retrieval effect commit 与 retrievability evidence 分开；取回失败/unsupported/unknown 不能提供 restore material。测试 sealed revision binding、cold tier unknown、partial material、no direct owner write。

### 6.12 J11 `ExecuteArchiveLifecycle`

**签名/图**：`execute(&self, context, input: ExecuteArchiveLifecycleInput) -> ApplicationResult<ExecuteArchiveLifecycleReport>`。

```text
worker -> claim -> read lifecycle/action intent
  -> GovernanceDecisionPort.check_current + hold/expiry proof
  -> save Dispatched intent/permit; commit
  -> ArchiveStoragePort.dispatch outside UoW
  -> save ACK/Committed/Unknown + report
```

危险 action 每次派发前重核正式 decision；legal hold/delete authorization/risk acceptance 未闭合即 Blocked。ACK 不等 commit，unknown 进入 J12；不反写项目状态、不自行决定 retention。测试 hold race、decision stale、permit boundary、commit unknown。

### 6.13 J12 / J12-L `ReconcileExternalAction`

**签名/路由**：`reconcile_action(&self, context, input: ReconcileExternalActionInput) -> ApplicationResult<ReconcileExternalActionReport>`；worker 先读 persisted `ExternalActionTargetRef`，`Placement` 路由 `PlacementService`，`Lifecycle` 路由 `LifecycleExecutionService`，target 缺失/冲突安全拒绝。

```text
worker -> claim -> inspect persisted action target/effect key
  -> (Lifecycle: recheck GovernanceDecisionPort) -> ArchiveStoragePort.probe
  -> map committed/not-found/unknown/conflicting -> save action/placement/lifecycle/report
```

probe `NotFound` 不等 no effect；`CommitUnknown` 可保持 unknown 或转 committed/failed，仅以 typed outcome 为准；不广播两个 service、不从输入字符串猜分支。测试 target exclusivity、probe unknown、decision recheck、duplicate replay。

### 6.14 J13 `BuildRestorePlan`

**签名/图**：`build_plan(&self, context, input: BuildRestorePlanInput) -> ApplicationResult<BuildRestorePlanReport>`。

```text
worker -> claim -> read restore request + sealed Bundle/manifest/closure/assessments
  -> RestoreService calls RestoreReceiverPort.resolve outside UoW per frozen owner
  -> begin protected UoW + re-read exact guards and typed receiver outcomes
  -> RestorePlan/RestoreItem factory -> save plan/items/report -> commit
```

仅用 C02 已冻结的 owner set、exact immutable revision、owner-approved material refs 和本 Job 解析的 typed receiver outcome；owner receiver 缺失、unsupported version、integrity failure→per-item blocked，plan-level basis 显式保存。不得把 workspace projection 或 bundle 直接当写权限。测试 admission 不解析 receiver、owner isolation、partial plan、plan state not recomputed from hidden items。

### 6.15 J14 `PrepareRestoreMaterial`

**签名/图**：`prepare_material(&self, context, input: PrepareRestoreMaterialInput) -> ApplicationResult<PrepareRestoreMaterialReport>`。

```text
worker -> claim -> read RestoreItem + sealed revision + placement
  -> SourceExportPort.prepare_restore_material outside UoW
  -> save PreparedRestoreMaterial or finding/report in new UoW
```

material 必须绑定 item、revision、owner、integrity/compatibility basis；partial/stale/missing/integrity-failed 不生成可派发 material。正文与 owner truth 不归 Archive；只保存受控 material/ref。测试 fixed binding、unsupported receiver、material missing、no owner DB write。

### 6.16 J15 `DispatchRestoreHandoff`

**签名/图**：`dispatch_handoff(&self, context, input: DispatchRestoreHandoffInput) -> ApplicationResult<DispatchRestoreHandoffReport>`。

```text
worker -> claim -> read item/material/J13 fixed receiver mapping
  -> RestoreService calls RestoreReceiverPort.resolve outside UoW and exact-matches current outcome
  -> save RestoreHandoff IntentRecorded + HandoffDispatchInput; commit
  -> RestoreReceiverPort.dispatch outside UoW
  -> save Dispatched/ACK/Unknown observation + report
```

Archive 不能直接写 owner DB；每个 owner/receiver 独立 handoff。J15 的 current resolve 必须与 item 中固定的 owner/receiver/revision/evidence 相容，不相容即在 intent/dispatch 前 `Blocked`。ACK 不等 owner commit，possible dispatch→`CommitUnknown`；receiver contract 未闭合保持 Blocked。测试 per-owner idempotency、receiver mapping drift、intent-before-effect、receiver refusal、unknown no retry。

### 6.17 J16 `ReconcileRestoreHandoff`

**签名/图**：`reconcile_handoff(&self, context, input: ReconcileRestoreHandoffInput) -> ApplicationResult<ReconcileRestoreHandoffReport>`。

```text
worker -> claim -> read handoff + fixed dispatch input
  -> RestoreReceiverPort.probe_handoff outside UoW
  -> save outcome/state/report/checkpoint -> commit
```

per-owner outcome 必须区分 rejected/failed/succeeded/commit-unknown/reconcile-required；不由 Archive 推导 restored。probe unknown 保留 unknown；late conflicting feedback 保存 conflict，不覆盖历史。测试 receiver target binding、probe unknown、partial owner set、duplicate report。

### 6.18 J17 `ExecuteRestoreCompensation`

**签名/图**：`execute_compensation(&self, context, input: ExecuteRestoreCompensationInput) -> ApplicationResult<ExecuteRestoreCompensationReport>`。

```text
worker -> claim -> read failed/unknown handoff + compensation intent
  -> save compensation intent; commit
  -> RestoreReceiverPort.compensate outside UoW
  -> probe_compensation/reconcile -> save compensation record/report
```

仅在正式 receiver outcome/owner decision 允许时补偿；不把 compensation 成功改写为原 handoff 成功，也不改变 owner project state。compensation provider/authorization 未闭合→Blocked；possible dispatch→CommitUnknown。测试 compensation idempotency、original history preserved、unknown probe、no direct owner write。

## 7. 跨 flow 审计与 Step 09 停审门禁

### 7.1 入口覆盖与方法面

| 检查项 | 结论 |
|---|---|
| Commands | C01～C03：3/3 覆盖 |
| Queries | Q01～Q05：5/5 覆盖，全部 no-write |
| Consumers | E01～E05：5/5 覆盖；E04 placement/lifecycle 互斥路由 |
| Jobs | J01～J17：17/17 覆盖；J12 placement/lifecycle 互斥路由 |
| 总分母 | 30 logical entries；E04/J12 双分支共 32 method surfaces，不新增入口 |

### 7.2 事务、结果与错误审计

- 所有写 flow 都显式区分 `reserve → local UoW → commit`、事务外 external I/O、回包 reconcile；Query 没有写 UoW、idempotency reserve、result save 或 external call。
- 所有 Command/Consumer/Job 都要求完整 typed result/receipt/report save/get/replay；duplicate 不重跑、不重扫当前 truth、不重发 effect。
- `CommitUnknown`、`Partial`、`Stale`、`Missing`、`Conflicting`、`UnsupportedVersion`、`IntegrityFailed` 均保持 typed disposition；ACK/accepted 不升级为业务成功。
- 未调用 Step 07 未定义的 repository/port/function；引用的 `get_*`、`list_*`、`save_*`、`append_*`、`probe_*` 均来自 Step 07，domain factory/guard 来自 Step 06/02。

### 7.3 Source-authority 与边界审计

| 输入/接缝 | Flow 处理 |
|---|---|
| L1 真相域 snapshot/export | J02/J03/J04/E02 只接受 owner-approved binding、version/fence/coverage；缺口 blocked |
| `L1-workspace` projection | 仅作为明确辅助材料；J02/J05/J13 不把 projection 当 canonical truth |
| `L1-artifact` 制品/血缘引用 | 只按 approved ref/material closure 使用；正文/血缘 owner 不转移 |
| `L4-observability` audit/evidence | 只保存安全 evidence/ref；不拥有审计后端或通过摘要补完整链 |
| governance / lifecycle | C03/J11/J12-L/E03 只消费正式 decision；不创造 policy/hold/删除授权 |
| restore receiver | J15/J16/J17/E05 逐 owner handoff；不直写 owner DB 或推导 restored |

### 7.4 前后对比、待确认与完成上限

**前**：Step 08 只有协议字段、映射和统一 result/replay 规则，函数级事务顺序、外部 I/O fence、状态触发和测试切口尚未落文。
**后**：30 logical entries 均有独立签名、调用图、伪代码、DTO→domain/port 构造、UoW/外部边界、错误/状态、副作用和测试切口；查询 no-write、E04/J12 互斥路由、source-authority 与 outbound blocker 均完成跨 flow 审计。

仍待上游闭合：`AR-UP-001~009`、`AR-ARCH-001`、`AR-HLD-Q-001~002`。这些 blocker 阻止正向 provider/receiver/storage/crypto/outbound 被标 ready，但不阻止本地 flow 契约继续保持 fail-closed。未执行任何测试、代码或外部 effect，未生成真实 report/digest/signature/bundle/evidence。

### 7.5 Step 09 完成门禁

| 门禁 | 结果 |
|---|---|
| 30 logical entries 覆盖 | pass |
| 每 flow 独立处理流与停审 | pass |
| Query strict no-write | pass |
| Step 07 callable surface 未越界 | pass |
| source-authority / owning-domain boundary | pass_with_upstream_blockers |
| outbound publisher/outbox | blocked by `AR-HLD-Q-001` |
| formal 03 回填 | not allowed until Step 19 |
| 下一步 | `stop_review`，等待用户明确授权 Step 10 |

## 8. Step 09 结论

Step 09 的中间产物已覆盖全部 3 Command、5 Query、5 Consumer、17 Job（30 logical entries；32 method surfaces），并完成跨 flow 静态审计。结论为 `completed / pass_with_upstream_blockers / stop_review`。本文件不代表实现、编译、测试、真实外部提交、恢复成功或 readiness。
