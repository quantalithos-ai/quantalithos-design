# L4-archive 03 Step 08：协议契约

> 对应 SOP：`standards/document/详细设计讨论流程_SOP.md` Step 8
> 回填位置：未来正式 `03-详细设计.md` §7
> 日期：2026-09-11
> 状态：`completed / pass_with_upstream_blockers / stop_review`
> 范围：仅创建本中间产物；不修改正式 `03-详细设计.md`，不实现代码，不创建目标实现仓。

## 1. Step 状态、输入与门禁

| 项目 | 本 Step 结论 |
|---|---|
| 当前文档 | `03-详细设计.md`，仅校准，不允许正式回填 |
| 前置门禁 | Step 01～07 已完成并停审；用户明确授权 Step 08 |
| 本步目标 | 将 3 Command、5 Query、5 Inbound Consumer、17 Operations Job 转成字段级、可映射、可重放的协议契约 |
| 不在本步 | 函数级处理流（Step 09）、状态矩阵（Step 10）、物理持久化（Step 11）、错误恢复细化（Step 12）、并发/幂等算法（Step 13）、配置、测试、实施计划 |
| 当前实现事实 | 不存在目标实现仓、Cargo baseline、编译结果、测试结果、真实 Bundle、digest、signature、storage commit、restore commit 或 readiness |
| 当前 blocker | `AR-UP-001~009`、`AR-ARCH-001`、`AR-HLD-Q-001~002` 继续开放；本 Step 不解锁受影响 adapter、provider、publisher 或 receiver |

本 Step 只保留协议层的逻辑名称、typed DTO、来源映射和 fail-closed 结果。任何尚未由 owning project 或标准闭合的 transport、schema version、digest 算法、签名算法、KMS、压缩、存储供应商、保留/删除规则均写为 `pending/blocker`，不得用默认值补齐。

## 2. 阅读输入与 SOP 问题回答

### 2.1 已读取输入

| 输入 | 用途 | 核验结论 |
|---|---|---|
| `standards/document/详细设计讨论流程_SOP.md` Step 8 | 协议族分组、独立协议小节、DTO 构造闭环、Query page/view/marker、Consumer receipt、Job report | 每个协议必须有用途、逻辑路由、request/schema、response/schema、错误映射、幂等和审计要求 |
| `standards/document/详细设计书写规范.md` §5.7 | 正式章节格式与二级类型要求 | public DTO 不得直接依赖 domain-only 类型；envelope 与 payload 不重复；所有 Query 必须有 request + response view/page/marker |
| `standards/document/设计真相源闭环与可落码性标准.md` §2.2.1A、§2.3、§2.7.1、§5.3、§5.5、§5.5-a、§5.6 | callable surface、visibility resolution、完整 duplicate result、cursor/source、context/channel、subject identity | result/receipt/report 必须可 typed save/get；cursor 不是 truth cursor；Query 不写；context factory 与 reserve 必须同源 |
| 本仓正式 `02-概要设计.md` §7～§10、Step 06、Step 07 | 入口分母、对象/服务、safe views、port 与 stored result | 3 Command、5 Query、5 Consumer、17 Job；E04/J12 各有 placement/lifecycle 两个互斥 method surface；3 outbound 仍为 blocked candidate |
| `projects/L1-governance/design-calibration/03_ddd_step_08_protocol_contracts.md` | 仅作粒度参考 | 借鉴分批、shared helper、envelope/payload、page、receipt/report 与 stop-review 结构；不复制 governance 业务对象或 outbox/publisher |
| L1 owner、`L1-workspace`、`L1-artifact`、`L4-observability`、`L0-bus`、`L0-sdk` 当前正式边界 | source authority、projection、event、SDK 方向 | 仅形成 runtime/event/ref/adapter 关系；不产生 sibling compile 依赖；workspace projection 永远不是 L1 canonical truth |

### 2.2 问题回答与取舍

| 问题 | 回答 / 取舍 |
|---|---|
| 协议分母是否改变？ | 不改变。仍为 3 Command、5 Query、5 Consumer、17 Job；E04/J12 的 placement/lifecycle 是同一入口的互斥 method surface，不增加入口。 |
| public 类型放在哪里？ | shared envelope、DTO、view mapping、page/marker、receipt/report 放 `contracts::protocols`（planned）；domain 状态/ref 先经显式 `*Dto` mapping，不把 domain-only 类型直接暴露。 |
| actor、trace、idempotency、occurred_at 放哪里？ | trusted envelope/metadata；payload 不重复。Command/Job/Event 的 context 由既有 `ArchiveOperationContext` factory 构造，Query 不携带写幂等键。 |
| duplicate 如何返回？ | 先按 `ArchiveOperationKey + input_digest` 读 Step 07 complete result；完整 result/receipt/report 缺失即 `ResultMissing`/`CorruptRecord`，禁止重跑 mutation 或扫描当前 truth 重构。 |
| Query 如何分页？ | public cursor 与 private repository cursor 独立；映射绑定 selector、principal/visibility、filter、order、snapshot 和 read-model kind。Query 只读 committed snapshot，不写 cache、result、repair 或外部系统。 |
| Consumer unsupported/stale/unknown 如何处理？ | envelope 校验失败时不解析 payload；unsupported/quarantined/rejected/delayed 均返回完整 receipt；`stale/partial/missing/conflicting/commit-unknown` 作为 typed item outcome 保存，不压成成功。 |
| transport 是否确定？ | 否。仅记录 `logical route`/`logical topic`/`logical RPC`；provider、部署、订阅、重试、ack deadline 留 blocker。 |
| outbound 是否 ready？ | 否。`ArchiveJobPostureChanged`、`ArchiveBundleSealed`、`RestoreHandoffPostureChanged` 只作为 blocked candidate；不创建 publisher/outbox ready trait、topic、delivery evidence。 |

## 3. 协议总表

### 3.1 Command

| 名称 | request DTO | response DTO | 调用方 / 处理方 | 逻辑传输名 | 目标对象 / side effect |
|---|---|---|---|---|---|
| `RequestArchive` | `RequestArchivePayload` | `RequestArchiveResponse` | trusted API → `ArchiveRequestService` | `archive.command.request_archive`（logical） | `ArchiveRequest`、`ArchiveJob`、初始 stage；Accepted 仅本地受理 |
| `RequestRestore` | `RequestRestorePayload` | `RequestRestoreResponse` | trusted API → `ArchiveRequestService` | `archive.command.request_restore`（logical） | `RestoreRequest`、`ArchiveJob`、初始 stage；不授予 owner 写权 |
| `RequestLifecycleExecution` | `RequestLifecycleExecutionPayload` | `RequestLifecycleExecutionResponse` | trusted API → `LifecycleExecutionService` | `archive.command.request_lifecycle_execution`（logical） | `LifecycleExecution` / action intent；不创造 governance decision |

### 3.2 Query（全部 no-write）

| 名称 | request DTO | response view | 调用方 / 处理方 | 逻辑传输名 | 读取边界 |
|---|---|---|---|---|---|
| `GetArchiveJobStatus` | `GetArchiveJobStatusRequest` | `SafeArchiveJobStatusViewDto` | trusted API → `ArchiveQueryService` | `archive.query.job_status`（logical） | request/job/stage/CP posture；不推导项目状态 |
| `GetArchiveBundle` | `GetArchiveBundleRequest` | `SafeArchiveBundleViewDto` | trusted API → `ArchiveQueryService` | `archive.query.bundle`（logical） | Bundle/manifest/entry/closure/finding；不 assembly/repair |
| `VerifyArchiveBundle` | `VerifyArchiveBundleRequest` | `SafeBundleVerificationViewDto` | trusted API → `ArchiveQueryService` | `archive.query.verify_bundle`（logical） | matching committed assessment/finding；不触发重验 |
| `GetRestorePlan` | `GetRestorePlanRequest` | `SafeRestorePlanViewDto` | trusted API → `ArchiveQueryService` | `archive.query.restore_plan`（logical） | plan/item/handoff/outcome/compensation |
| `GetRestoreHandoffStatus` | `GetRestoreHandoffStatusRequest` | `SafeRestoreHandoffViewDto` | trusted API → `ArchiveQueryService` | `archive.query.restore_handoff`（logical） | 一个 handoff 或 item 的历史；不 probe/retry/compensate |

### 3.3 Inbound Consumer

| 名称 | envelope/payload | 处理方 | logical topic/RPC | Archive-owned 承接 |
|---|---|---|---|---|
| `ConsumeArchiveTrigger` | `ArchiveInboundEventEnvelope<ArchiveTriggerPayload>` | `ArchiveRequestService` | `archive.inbound.archive_trigger`（pending） | trigger finding / 受理语境；不绕过 authority |
| `ConsumeSourceExportFeedback` | `ArchiveInboundEventEnvelope<SourceExportFeedbackPayload>` | `SourceCaptureService` | `archive.inbound.source_export_feedback`（pending） | attempt/coverage/finding |
| `ConsumeGovernanceDecisionChange` | `ArchiveInboundEventEnvelope<GovernanceDecisionChangePayload>` | `LifecycleExecutionService` | `archive.inbound.governance_decision_change`（pending） | execution 重评估或 blocked basis |
| `ConsumeStorageActionFeedback` | `ArchiveInboundEventEnvelope<StorageActionFeedbackPayload>` | `PlacementService` 或 lifecycle branch | `archive.inbound.storage_action_feedback`（pending） | action/placement/execution outcome；ACK 不等 commit |
| `ConsumeRestoreReceiverFeedback` | `ArchiveInboundEventEnvelope<RestoreReceiverFeedbackPayload>` | `RestoreService` | `archive.inbound.restore_receiver_feedback`（pending） | per-owner handoff/outcome；不推导 restored |

### 3.4 Operations Job

| 名称 | input DTO | report DTO | 处理方 | logical trigger |
|---|---|---|---|---|
| `AdvanceArchiveJob` | `AdvanceArchiveJobInput` | `AdvanceArchiveJobReport` | `ArchiveRequestService` | `archive.job.advance`（logical） |
| `PlanArchiveSources` | `PlanArchiveSourcesInput` | `PlanArchiveSourcesReport` | `SourceCaptureService` | `archive.job.plan_sources` |
| `CaptureArchiveSource` | `CaptureArchiveSourceInput` | `CaptureArchiveSourceReport` | `SourceCaptureService` | `archive.job.capture_source` |
| `ReconcileSourceCapture` | `ReconcileSourceCaptureInput` | `ReconcileSourceCaptureReport` | `SourceCaptureService` | `archive.job.reconcile_capture` |
| `AssembleBundleManifest` | `AssembleBundleManifestInput` | `AssembleBundleManifestReport` | `BundleAssemblyService` | `archive.job.assemble_manifest` |
| `SealArchiveBundle` | `SealArchiveBundleInput` | `SealArchiveBundleReport` | `BundleAssemblyService` | `archive.job.seal_bundle` |
| `AssessBundleIntegrity` | `AssessBundleIntegrityInput` | `AssessBundleIntegrityReport` | `BundleVerificationService` | `archive.job.assess_integrity` |
| `AssessBundleCompatibility` | `AssessBundleCompatibilityInput` | `AssessBundleCompatibilityReport` | `BundleVerificationService` | `archive.job.assess_compatibility` |
| `PlaceArchiveBundle` | `PlaceArchiveBundleInput` | `PlaceArchiveBundleReport` | `PlacementService` | `archive.job.place_bundle` |
| `RetrieveArchiveBundle` | `RetrieveArchiveBundleInput` | `RetrieveArchiveBundleReport` | `PlacementService` | `archive.job.retrieve_bundle` |
| `ExecuteArchiveLifecycle` | `ExecuteArchiveLifecycleInput` | `ExecuteArchiveLifecycleReport` | `LifecycleExecutionService` | `archive.job.execute_lifecycle` |
| `ReconcileExternalAction` | `ReconcileExternalActionInput` | `ReconcileExternalActionReport` | persisted target dispatch | `archive.job.reconcile_action` |
| `BuildRestorePlan` | `BuildRestorePlanInput` | `BuildRestorePlanReport` | `RestoreService` | `archive.job.build_restore_plan` |
| `PrepareRestoreMaterial` | `PrepareRestoreMaterialInput` | `PrepareRestoreMaterialReport` | `RestoreService` | `archive.job.prepare_restore_material` |
| `DispatchRestoreHandoff` | `DispatchRestoreHandoffInput` | `DispatchRestoreHandoffReport` | `RestoreService` | `archive.job.dispatch_restore_handoff` |
| `ReconcileRestoreHandoff` | `ReconcileRestoreHandoffInput` | `ReconcileRestoreHandoffReport` | `RestoreService` | `archive.job.reconcile_restore_handoff` |
| `ExecuteRestoreCompensation` | `ExecuteRestoreCompensationInput` | `ExecuteRestoreCompensationReport` | `RestoreService` | `archive.job.execute_restore_compensation` |

## 4. Shared protocol helpers（contracts::protocols）

### 4.1 Naming, metadata and envelope

```rust
/// Names one finite Archive command protocol.
pub struct ArchiveCommandName(pub String);
/// Names one finite Archive query protocol.
pub struct ArchiveQueryName(pub String);
/// Names one finite Archive inbound consumer.
pub struct ArchiveConsumerName(pub String);
/// Names one finite Archive operation job.
pub struct ArchiveJobName(pub String);
/// Logical route/topic/RPC name; never a provider binding.
pub struct ArchiveLogicalProtocolRef(pub String);
/// Opaque canonical request digest; algorithm is not selected in this Step.
pub struct ArchiveProtocolInputDigest(pub String);
/// Opaque public page continuation; never a repository cursor.
pub struct ArchivePublicPageCursor(pub String);
/// Query page marker tied to one read snapshot and visibility resolution.
pub struct ArchivePublicPageInfo {
    pub next_cursor: Option<ArchivePublicPageCursor>,
    pub has_more: bool,
    pub snapshot_ref: ArchiveReadSnapshotRef,
}
/// Trace and disclosure metadata copied from the trusted outer boundary.
pub struct ArchiveProtocolMetadata {
    pub trace_id: TraceId,
    pub occurred_at: Option<Timestamp>,
    pub request_id: Option<RequestId>,
}
```

`ArchiveCommandName`、`ArchiveQueryName`、`ArchiveConsumerName`、`ArchiveJobName` 只能取本 Step 总表中的有限 registry 值；不能由 route 字符串、DTO 类型名或 fake map 推导。`ArchiveProtocolInputDigest` 仅是稳定输入等价性 carrier，不承诺 digest 算法或完整性证明；`ArchiveReadSnapshotRef` 是本地 committed read snapshot，不是 owner fence。所有 body-free opaque ref 由既有 contracts/application factory 或正式上游提供，协议层不任意 mint。

### 4.2 Command envelope、result 与错误

```rust
/// Public command envelope.  Envelope fields are not repeated in payload.
pub struct ArchiveCommandEnvelope<T> {
    pub actor: ActorContext,
    pub metadata: CommandMetadata,
    pub command_name: ArchiveCommandName,
    pub payload: T,
}

/// Complete command response, including replay-safe result surface.
pub struct ArchiveCommandResponse<T> {
    pub command_name: ArchiveCommandName,
    pub disposition: ArchiveCommandDisposition,
    pub result_ref: Option<ArchiveApplicationResultRef>,
    pub payload: Option<T>,
    pub issue_refs: Vec<ArchiveProtocolIssueRef>,
    pub recorded_at: Option<RecordedAt>,
}

/// Command outcomes never imply an owner commit or project state change.
pub enum ArchiveCommandDisposition {
    Accepted,
    Duplicate,
    Rejected,
    Blocked,
    Conflict,
    CommitUnknown,
}

/// Safe, typed protocol issue; raw provider/SQL/HTTP/panic text is forbidden.
pub struct ArchiveProtocolIssueRef(pub String);
pub enum ArchiveProtocolIssueKind {
    InvalidInput,
    MissingRequiredField,
    NotVisible,
    UnsupportedVersion,
    StaleInput,
    Partial,
    Missing,
    Conflicting,
    IntegrityFailed,
    ContractBlocked,
    VersionConflict,
    DuplicateDigestConflict,
    ResultMissing,
    CommitUnknown,
    Quarantined,
    Unavailable,
}
```

`ArchiveCommandResponse.payload` 在 `Accepted`、`Duplicate` 或可安全披露的确定结果中为 `Some`；`Rejected/Blocked/Conflict/CommitUnknown` 的正文必须按具体协议定义，不能用空 body 伪装成功。`result_ref` 只能来自 Step 07 `save_complete_result`；同 key/同 digest duplicate 必须 `get_complete_result` 后返回原 payload，duplicate 标记是本次 response overlay，不改变已保存的 recorded_at、trace 或 details。

### 4.3 Query request、view、page 与 cursor 映射

```rust
/// Query envelope; idempotency and write metadata are intentionally absent.
pub struct ArchiveQueryEnvelope<T> {
    pub actor: ActorContext,
    pub metadata: QueryMetadata,
    pub query_name: ArchiveQueryName,
    pub payload: T,
}

/// All five Query responses expose an explicit safe surface and marker.
pub struct ArchiveQueryResponse<T> {
    pub query_name: ArchiveQueryName,
    pub surface: ArchiveQuerySurface,
    pub body: Option<T>,
    pub page: Option<ArchivePublicPageInfo>,
    pub issue_refs: Vec<ArchiveProtocolIssueRef>,
}

pub enum ArchiveQuerySurface {
    Visible,
    NotAvailable,
    Partial,
    Stale,
    Blocked,
    Unknown,
}

/// Private application mapping; never serialized or returned to a caller.
pub struct ArchiveRepositoryCursorMapping {
    pub public_cursor: ArchivePublicPageCursor,
    pub repository_cursor: RepositoryCursor,
    pub snapshot_ref: ArchiveReadSnapshotRef,
    pub selector_digest: ArchiveProtocolInputDigest,
    pub principal_ref: ActorRef,
    pub visibility_basis_ref: ExternalEvidenceRef,
    pub read_model_kind: ArchiveReadModelKind,
}
pub enum ArchiveReadModelKind {
    JobStatus,
    Bundle,
    Verification,
    RestorePlan,
    RestoreHandoff,
}
```

`ArchiveRepositoryCursorMapping` 由 application 在同一 read snapshot 中创建，public cursor 不能直接等于 `RepositoryCursor`。继续页必须校验 principal、current visibility basis、selector/filter/order、read-model kind 和 snapshot 一致；任何 mismatch、expired snapshot、unknown cursor 均返回 typed issue，不从第一页重新拼接。`has_more=true` 只能来自 `next_cursor=Some`；空 rows 不代表全集耗尽。五个 Query 均调用 Step 07 `VisibilityResolutionRead` + `ArchiveVisibilityPort`，再把 domain view 映射为 `*ViewDto`；hidden 与 absent 统一 `NotAvailable`，不计 hidden rows，不写 cache/result/trace。

### 4.4 Inbound envelope、receipt 与 payload 规则

```rust
/// Trusted inbound envelope.  Payload never repeats these fields.
pub struct ArchiveInboundEventEnvelope<T> {
    pub source_family: ArchiveInboundSourceFamily,
    pub event_id: ExternalEventRef,
    pub event_envelope_ref: ExternalEventEnvelopeRef,
    pub event_source_ref: ExternalEventSourceRef,
    pub event_version: ArchiveEventSchemaVersion,
    pub dedup_key: ArchiveEventDedupKey,
    pub occurred_at: Timestamp,
    pub trace_ref: TraceId,
    pub source_version_ref: Option<ExternalSourceVersionRef>,
    pub payload: T,
}

pub enum ArchiveInboundSourceFamily {
    ProjectLifecycle,
    SourceExport,
    GovernanceDecision,
    StorageCapability,
    RestoreReceiver,
}
pub struct ArchiveEventSchemaVersion(pub String);
pub struct ArchiveEventDedupKey(pub String);

/// Complete durable receipt; it is saved and loaded as one replay surface.
pub struct ArchiveConsumerReceipt {
    pub consumer_name: ArchiveConsumerName,
    pub event_id: ExternalEventRef,
    pub disposition: ArchiveConsumerDisposition,
    pub result_ref: Option<ArchiveApplicationResultRef>,
    pub processed_item_refs: Vec<ArchiveRecordRef>,
    pub issue_refs: Vec<ArchiveProtocolIssueRef>,
    pub local_commit: LocalCommitMarker,
}
pub enum ArchiveConsumerDisposition {
    Accepted,
    Duplicate,
    Delayed,
    Rejected,
    Quarantined,
    UnsupportedVersion,
    NoOp,
    CommitUnknown,
}
pub enum LocalCommitMarker {
    Committed,
    NotCommitted,
    Unknown,
}
```

Envelope validation precedes payload parsing. Missing event id/envelope/source/version/dedup/occurred_at/trace is `Rejected` or `Quarantined`; unsupported version is returned without payload parsing, snapshot write, stale marking, or external-body storage. `Accepted` only means Archive local receipt/observation committed; it does not mean Bus delivery, owner commit, archived/restored, or lifecycle deletion. `save_consumer_receipt(result_ref, receipt, uow)` and `get_consumer_receipt(result_ref)` must round-trip the entire receipt; a bool, bare id, or counters-only placeholder is invalid.

### 4.5 Job metadata、report 与 duplicate replay

```rust
/// Shared operations-job metadata.  Job input payload excludes these fields.
pub struct ArchiveJobEnvelope<T> {
    pub metadata: ArchiveJobMetadata,
    pub input: T,
}
pub struct ArchiveJobMetadata {
    pub job_name: ArchiveJobName,
    pub run_id: JobRunId,
    pub idempotency_key: ArchiveOperationIdempotencyKey,
    pub actor: ActorContext,
    pub trace_id: TraceId,
    pub worker_claim: WorkerClaim,
}

/// Complete report used for first-run and duplicate replay.
pub struct ArchiveOperationReport {
    pub result_ref: ArchiveApplicationResultRef,
    pub job_name: ArchiveJobName,
    pub disposition: ArchiveJobDisposition,
    pub job_ref: ArchiveJobRef,
    pub processed_items: Vec<ArchiveJobItemResult>,
    pub continuation_target: Option<WorkerTargetRef>,
    pub stage_ref: Option<JobStageRecordId>,
    pub issue_refs: Vec<ArchiveProtocolIssueRef>,
    pub recorded_at: RecordedAt,
}
pub struct ArchiveJobItemResult {
    pub subject: ArchiveRecordRef,
    pub outcome: ArchiveJobItemOutcome,
    pub related_refs: Vec<ArchiveRecordRef>,
    pub detail_refs: Vec<ArchiveProtocolIssueRef>,
}
pub enum ArchiveJobItemOutcome {
    Advanced,
    NoOp,
    Partial,
    Blocked,
    Failed,
    Stale,
    Missing,
    Conflicting,
    UnsupportedVersion,
    IntegrityFailed,
    CommitUnknown,
    Quarantined,
}
pub enum ArchiveJobDisposition {
    Accepted,
    Duplicate,
    Completed,
    Partial,
    Blocked,
    Failed,
    CommitUnknown,
}
```

每个 `*Report` 是 `ArchiveOperationReport` 的命名 wrapper，不丢弃 processed item、related refs、continuation、stage、issue 或 result_ref。首次执行顺序是 reserve → 执行 bounded body → `save_job_report(result_ref, report, uow)` → complete reservation；duplicate 只调用 `get_job_report(result_ref)`，不能重扫当前 truth、重发外部 effect、重建 projection 或重算报告。`worker_claim` 必须来自 application control，与 job target/operation/holder 一致；job_run_id 不能替代 result_ref、fence 或 idempotency key。

### 4.6 二级类型唯一归属与 mapping 规则

| public protocol 类型 | 唯一归属 | domain 映射 | 禁止 |
|---|---|---|---|
| `ArchiveCommandName`、`ArchiveQueryName`、`ArchiveConsumerName`、`ArchiveJobName` | `contracts::protocols` | finite registry | 从 route/DTO 名称推分支 |
| `ArchiveCommandDisposition`、`ArchiveConsumerDisposition`、`ArchiveJobDisposition`、`ArchiveQuerySurface` | `contracts::protocols` | application 明确映射 | 复用 domain state 名称掩盖语义 |
| `*ViewDto`、`ArchivePublicPageInfo`、`ArchivePublicPageCursor` | `contracts::protocols` | safe view factory / page mapper | 直接依赖 domain-only ref/enum、暴露 repository cursor |
| `ArchiveProtocolIssueKind` | `contracts::protocols` | `SafeReasonRef` / `ArchiveStoreError` / `ArchivePortError` 显式映射 | raw provider/SQL/HTTP/panic |
| inbound envelope/receipt | `contracts::protocols` | event adapter → application consumer input | payload 重复 envelope 字段、保存外部正文 |
| job envelope/report | `contracts::protocols` | worker entry → application input/report | counters-only report、从 job_run_id 推 idempotency |
| `DeclaredArchiveScopeDto`、`GovernanceDecisionRefDto` | `contracts::protocols` mapping shell | contracts shared object factory | 复制 domain truth 或 policy decision |

DTO factory 规则：`ArchiveProtocolMapper::from_request(...)` 只能接收 validated DTO + trusted context + explicit source map；缺字段、wrong-kind、selector mismatch、不可见或 unsupported version 安全拒绝。它不能从 opaque ref 字符串、route path、typed_refs 数量/顺序、config key、fake private map 或当前时间补值。

## 5. Command 协议族

### 5.1 `RequestArchive`

#### 5.1.1 用途 / 函数 / logical route

| 项 | 内容 |
|---|---|
| 函数签名 | `request_archive(&self, context: &ArchiveOperationContext, input: RequestArchiveInput) -> ApplicationResult<ArchiveRequestResult>` |
| DTO 映射 | `ArchiveCommandEnvelope<RequestArchivePayload>` → `RequestArchiveResponse` |
| logical route | `archive.command.request_archive`；HTTP/RPC provider pending |
| 处理方 | `ArchiveRequestService` |
| 写入对象 | `ArchiveRequest`、`ArchiveJob`、初始 `ArchiveJobStageRecord`、complete result/reservation |

```rust
/// Payload for local archive admission; envelope carries actor/metadata/key/trace.
pub struct RequestArchivePayload {
    pub scope: DeclaredArchiveScopeDto,
    pub authority_ref: AuthorityRef,
}
pub struct RequestArchiveResponse {
    pub common: ArchiveCommandResponseHeader,
    pub result: RequestArchiveResultDto,
}
pub struct RequestArchiveResultDto {
    pub disposition: RequestArchiveResultDisposition,
    pub request_ref: Option<ArchiveRequestRef>,
    pub operation_request_ref: Option<OperationRequestRef>,
    pub job_ref: Option<ArchiveJobRef>,
    pub initial_stage_ref: Option<JobStageRecordId>,
    pub result_ref: Option<ArchiveApplicationResultRef>,
    pub basis_ref: Option<ExternalEvidenceRef>,
}
pub enum RequestArchiveResultDisposition { Accepted, Duplicate, Rejected, Blocked, Conflict, CommitUnknown }
```

字段来源与约束：`scope` 来自已校验的 `DeclaredArchiveScope` mapping；`authority_ref` 只能定位正式 authority，不承载 policy/hold/body。请求 key、digest、actor、trace、occurred_at 不得复制进 payload。Accepted 只有本地三对象同 UoW 提交；同 key/同 digest 返回完整 stored response；异 digest 为 `Conflict`；local commit unknown 必须读回 operation key/result，不得重新 admit。

### 5.2 `RequestRestore`

| 项 | 内容 |
|---|---|
| 函数签名 | `request_restore(&self, context: &ArchiveOperationContext, input: RequestRestoreInput) -> ApplicationResult<RestoreRequestResult>` |
| DTO 映射 | `ArchiveCommandEnvelope<RequestRestorePayload>` → `RequestRestoreResponse` |
| logical route | `archive.command.request_restore`（logical；transport pending） |
| 处理方 | `ArchiveRequestService` |
| 写入对象 | `RestoreRequest`、`ArchiveJob`、初始 stage、complete result/reservation |

```rust
pub struct RequestRestorePayload {
    pub bundle_ref: ArchiveBundleRef,
    pub target_owners: RestoreTargetOwnerSetDto,
    pub restore_authority_ref: RestoreAuthorityRef,
}
pub struct RequestRestoreResponse {
    pub common: ArchiveCommandResponseHeader,
    pub result: RequestRestoreResultDto,
}
pub struct RequestRestoreResultDto {
    pub disposition: RequestRestoreResultDisposition,
    pub request_ref: Option<RestoreRequestRef>,
    pub operation_request_ref: Option<OperationRequestRef>,
    pub job_ref: Option<ArchiveJobRef>,
    pub initial_stage_ref: Option<JobStageRecordId>,
    pub result_ref: Option<ArchiveApplicationResultRef>,
    pub basis_ref: Option<ExternalEvidenceRef>,
}
pub enum RequestRestoreResultDisposition { Accepted, Duplicate, Rejected, Blocked, Conflict, CommitUnknown }
```

`bundle_ref` 只能指向 Archive-owned immutable Bundle；`target_owners` 必须是显式、非空且唯一的集合；`restore_authority_ref` 只作正式授权引用。C02 只冻结 Bundle、目标 owner 集合与正式 authority，不解析或要求 owner-specific receiver mapping；后者由持有 `RestoreReceiverPort` 的 `RestoreService` 在 J13 建计划、J15 派发前分别解析或重验。Bundle 不转化为跨域写权限，Accepted 不等 owner/project restored。Missing/stale/integrity-failed/unsupported 的 bundle 不能被 payload 默认放行，按 `Blocked` 或 `Rejected` 返回并保存 basis；receiver 缺失或不兼容则在后续 owner-specific plan/item 中 fail-closed，不反向改写 admission 事实。

### 5.3 `RequestLifecycleExecution`

| 项 | 内容 |
|---|---|
| 函数签名 | `request_execution(&self, context: &ArchiveOperationContext, input: RequestLifecycleExecutionInput) -> ApplicationResult<LifecycleRequestResult>` |
| DTO 映射 | `ArchiveCommandEnvelope<RequestLifecycleExecutionPayload>` → `RequestLifecycleExecutionResponse` |
| logical route | `archive.command.request_lifecycle_execution`（logical；transport pending） |
| 处理方 | `LifecycleExecutionService` |
| 写入对象 | `LifecycleExecution`、初始 `ExternalActionRecord`（仅 intent）、complete result/reservation |

```rust
pub struct RequestLifecycleExecutionPayload {
    pub bundle_revision_ref: BundleRevisionRef,
    pub governance_decision_ref: GovernanceDecisionRef,
    pub action_kind: LifecycleActionKindDto,
}
pub struct RequestLifecycleExecutionResponse {
    pub common: ArchiveCommandResponseHeader,
    pub result: RequestLifecycleExecutionResultDto,
}
pub struct RequestLifecycleExecutionResultDto {
    pub disposition: LifecycleRequestResultDisposition,
    pub execution_ref: Option<LifecycleExecutionRef>,
    pub action_ref: Option<ExternalActionRecordRef>,
    pub result_ref: Option<ArchiveApplicationResultRef>,
    pub basis_ref: Option<ExternalEvidenceRef>,
}
pub enum LifecycleRequestResultDisposition { Accepted, Duplicate, Rejected, Blocked, Conflict, CommitUnknown }
pub enum LifecycleActionKindDto { Retain, Release, Delete, Retrieve, OtherFormalValue }
```

`LifecycleActionKindDto` 仅是 contracts mapping；具体是否允许由 GovernanceDecisionPort/owner 合同决定，`OtherFormalValue` 不能在实现中任意创建。Command 只核验 decision applicability、version/hold 接缝并保存 intent，不解释 retention、legal hold、delete authorization 或 risk acceptance，不调用 provider；ACK/dispatch/commit 只能由后续 job 报告。

### 5.4 Command shared error / idempotency / audit

三个 Command 共用以下规则：

1. `ArchiveOperationContext::from_command` 提供 `channel=Command`、`operation_name`、actor、CommandMetadata、idempotency key、trace；payload 不重复这些字段。
2. `input_digest` 的 source map 是 payload canonical fields + operation name + explicit source variant；算法仍由 Step 13/AR-UP-004 闭合，未闭合时入口可返回 `ContractBlocked`。
3. reserve → exact input validation → domain factory → request/job/intent + complete result save → reservation complete 必须同一 local UoW；Query 不 reserve。
4. `VersionConflict`、`DuplicateDigestConflict`、`ResultMissing`、`CommitUnknown`、`ContractBlocked` 必须保持 typed issue；不得把 timeout 映射为 definite rejection，也不得将 accepted/ACK 映射为 archived/restored。
5. `ArchiveCommandResponseHeader` 至少包含 `command_name`、`disposition`、`result_ref`、`issue_refs`、`recorded_at`；完整 payload 由 typed result repository 保存/读取，不能只保存 header。

```rust
pub struct ArchiveCommandResponseHeader {
    pub command_name: ArchiveCommandName,
    pub disposition: ArchiveCommandDisposition,
    pub result_ref: Option<ArchiveApplicationResultRef>,
    pub issue_refs: Vec<ArchiveProtocolIssueRef>,
    pub recorded_at: Option<RecordedAt>,
}
```

## 6. Query 协议族（Q01～Q05）

### 6.1 Query shared DTO 与 mapping

Query 的请求只携带 selector、固定 revision、过滤和 public cursor；`ActorContext`、`QueryMetadata`、trace、purpose 和 visibility 输入属于 envelope。Query 不创建 `ArchiveOperationKey`、不 reserve idempotency、不开写 UoW，不调用 capture、verify、retrieve、repair、handoff、retry 或 cache write。

```rust
/// Public query request metadata.  No command idempotency field is allowed.
pub struct ArchiveQueryRequestHeader {
    pub query_name: ArchiveQueryName,
    pub trace_id: TraceId,
    pub purpose_ref: Option<ArchivePurposeRef>,
}

/// Safe response header shared by all five queries.
pub struct ArchiveQueryResponseHeader {
    pub query_name: ArchiveQueryName,
    pub surface: ArchiveQuerySurface,
    pub snapshot_ref: Option<ArchiveReadSnapshotRef>,
    pub issue_refs: Vec<ArchiveProtocolIssueRef>,
}

/// Public selector mapping; payloads use typed fields, never an untyped selector map.
pub enum ArchiveQuerySelectorDto {
    Job(ArchiveJobRef),
    Request(OperationRequestRef),
    Bundle { bundle_ref: ArchiveBundleRef, revision_ref: Option<BundleRevisionRef> },
    Verification { bundle_ref: ArchiveBundleRef, revision_ref: BundleRevisionRef },
    RestorePlan(RestorePlanRef),
    RestoreHandoff(RestoreHandoffRef),
    RestoreItem(RestoreItemRef),
}

/// Public bounded query page request.
pub struct ArchivePageRequest {
    pub cursor: Option<ArchivePublicPageCursor>,
    pub limit: ArchivePublicPageLimit,
    pub order: ArchivePublicOrder,
}
pub struct ArchivePublicPageLimit(pub u32);
pub enum ArchivePublicOrder { StableAscending, StableDescending }
```

`ArchivePageRequest` 的 `limit` 只接受已校验的正数；默认值、最大值和租期留 `AR-HLD-Q-002`/Step 14，不能私造数字。application 先把 public cursor 解为 `ArchiveRepositoryCursorMapping`，再将同一 `ArchiveReadSnapshotRef`、typed selector、principal、visibility basis、order 和 read-model kind 传给 Step 07 repository page；repository cursor 不回传 public surface。Query response 的 view DTO 只从五个 contracts safe view factory 组装，不能直接暴露 `ArchiveJob`、`BundleManifest`、`RestoreHandoff` 等 domain aggregate。

### 6.2 `GetArchiveJobStatus`

#### 6.2.1 用途、函数、路由

| 项 | 内容 |
|---|---|
| 函数签名 | `get_job_status(&self, context: &ArchiveOperationContext, input: GetArchiveJobStatusInput) -> ApplicationResult<SafeRead<SafeArchiveJobStatusView>>` |
| request DTO | `GetArchiveJobStatusRequest` |
| response DTO | `GetArchiveJobStatusResponse` |
| logical route | `archive.query.job_status`；transport pending |
| read set | request/job/latest stage、每个 CP 的 committed component posture、visibility resolution |

```rust
pub struct GetArchiveJobStatusRequest {
    pub selector: ArchiveJobStatusSelectorDto,
    pub page: Option<ArchivePageRequest>,
}
pub enum ArchiveJobStatusSelectorDto { Job(ArchiveJobRef), Request(OperationRequestRef) }
pub struct GetArchiveJobStatusResponse {
    pub common: ArchiveQueryResponseHeader,
    pub body: Option<SafeArchiveJobStatusViewDto>,
    pub page: Option<ArchivePublicPageInfo>,
}
pub struct SafeArchiveJobStatusViewDto {
    pub metadata: SafeViewMetadataDto,
    pub job_ref: ArchiveJobRef,
    pub request_ref: OperationRequestRef,
    pub job_kind: ArchiveJobKindDto,
    pub current_stage: ArchiveJobStageDto,
    pub aggregate_posture: JobAggregatePostureDto,
    pub components: Vec<SafeJobComponentViewDto>,
}
```

`Job` selector 从 `ArchiveReadSelector::Job` 进入 visibility resolver；`Request` selector 必须走正式 `find_job_by_request`，不能从 request ref 字符串推 job。缺失、hidden、撤权统一 `NotAvailable`。跨记录 snapshot 不一致返回 `Stale`/`Unknown`，不拼接旧 stage 与新 component。该 Query 不推进 job、不重算 posture、不写 result。

### 6.3 `GetArchiveBundle`

| 项 | 内容 |
|---|---|
| 函数签名 | `get_bundle(&self, context: &ArchiveOperationContext, input: GetArchiveBundleInput) -> ApplicationResult<SafeRead<SafeArchiveBundleView>>` |
| request DTO | `GetArchiveBundleRequest` |
| response DTO | `GetArchiveBundleResponse` |
| logical route | `archive.query.bundle`（logical；transport pending） |
| read set | Bundle、指定或 current immutable manifest revision、全部可披露 entry/closure/finding、placement/lifecycle summaries |

```rust
pub struct GetArchiveBundleRequest {
    pub bundle_ref: ArchiveBundleRef,
    pub revision_ref: Option<BundleRevisionRef>,
    pub entry_page: Option<ArchivePageRequest>,
    pub finding_page: Option<ArchivePageRequest>,
}
pub struct GetArchiveBundleResponse {
    pub common: ArchiveQueryResponseHeader,
    pub body: Option<SafeArchiveBundleViewDto>,
    pub entry_page: Option<ArchivePublicPageInfo>,
    pub finding_page: Option<ArchivePublicPageInfo>,
}
pub struct SafeArchiveBundleViewDto {
    pub metadata: SafeViewMetadataDto,
    pub bundle_revision_ref: BundleRevisionRef,
    pub bundle_state: ArchiveBundleStateDto,
    pub closure_posture: ManifestClosurePostureDto,
    pub entries: Vec<SafeManifestEntryViewDto>,
    pub placement: Option<SafePlacementViewDto>,
    pub lifecycle: Vec<SafeLifecycleExecutionViewDto>,
}
```

`revision_ref=None` 只使用已提交 Bundle current revision；不存在 current revision 时返回 `NotAvailable`，不创建 Draft。每个 page cursor 绑定 `(bundle_ref, revision_ref, entry role/filter, principal, visibility basis)`。缺 closure/entry/coverage/finding 只在对应 safe summary 中返回 `Partial/Missing/Unknown`；不把 ref 数量当 closure、不把 workspace projection、Artifact ref 或 observability material 冒充 canonical entry。

### 6.4 `VerifyArchiveBundle`

| 项 | 内容 |
|---|---|
| 函数签名 | `verify_bundle(&self, context: &ArchiveOperationContext, input: VerifyArchiveBundleInput) -> ApplicationResult<SafeRead<SafeBundleVerificationView>>` |
| request DTO | `VerifyArchiveBundleRequest` |
| response DTO | `VerifyArchiveBundleResponse` |
| logical route | `archive.query.verify_bundle`（logical；transport pending） |
| read set | fixed Bundle revision、matching integrity assessment、target-specific compatibility assessments、findings |

```rust
pub struct VerifyArchiveBundleRequest {
    pub bundle_ref: ArchiveBundleRef,
    pub revision_ref: BundleRevisionRef,
    pub selection: VerificationReadSelectionDto,
    pub finding_page: Option<ArchivePageRequest>,
}
pub struct VerificationReadSelectionDto {
    pub integrity: bool,
    pub compatibility_targets: Vec<CompatibilityTargetDto>,
}
pub struct CompatibilityTargetDto {
    pub target_ref: CompatibilityTargetRef,
    pub schema_refs: Vec<SchemaVersionRef>,
}
pub struct VerifyArchiveBundleResponse {
    pub common: ArchiveQueryResponseHeader,
    pub body: Option<SafeBundleVerificationViewDto>,
    pub finding_page: Option<ArchivePublicPageInfo>,
}
pub struct SafeBundleVerificationViewDto {
    pub metadata: SafeViewMetadataDto,
    pub bundle_revision_ref: BundleRevisionRef,
    pub integrity: Option<SafeVerificationAssessmentViewDto>,
    pub compatibility: Vec<SafeCompatibilityAssessmentViewDto>,
    pub findings: Vec<SafeVerificationFindingViewDto>,
}
```

`Verify` 是只读命名，不得调用 `IntegrityCapabilityPort`、`CompatibilityCapabilityPort` 或创建新的 assessment。`selection` 必须与 revision、fixed input、schema/target 完全匹配；缺 assessment 返回 `None`/`Partial`，不得构造 `Verified` 或 `Supported`。`IntegrityFailed`、`Unsupported`、`Conflicting`、`Unknown`、`Blocked` 是可见的 safe posture（若当前 disclosure 允许），不是 Query error 的成功替代。

### 6.5 `GetRestorePlan`

| 项 | 内容 |
|---|---|
| 函数签名 | `get_restore_plan(&self, context: &ArchiveOperationContext, input: GetRestorePlanInput) -> ApplicationResult<SafeRead<SafeRestorePlanView>>` |
| request DTO | `GetRestorePlanRequest` |
| response DTO | `GetRestorePlanResponse` |
| logical route | `archive.query.restore_plan`（logical；transport pending） |
| read set | immutable plan revision、完整 item set、per-owner material/handoff/outcome/compensation summaries |

```rust
pub struct GetRestorePlanRequest {
    pub plan_ref: RestorePlanRef,
    pub item_page: Option<ArchivePageRequest>,
}
pub struct GetRestorePlanResponse {
    pub common: ArchiveQueryResponseHeader,
    pub body: Option<SafeRestorePlanViewDto>,
    pub item_page: Option<ArchivePublicPageInfo>,
}
pub struct SafeRestorePlanViewDto {
    pub metadata: SafeViewMetadataDto,
    pub plan_ref: RestorePlanRef,
    pub bundle_revision_ref: BundleRevisionRef,
    pub plan_revision: RestorePlanRevision,
    pub plan_state: RestorePlanStateDto,
    pub items: Vec<SafeRestoreItemViewDto>,
}
```

必须按 exact `(plan_ref, plan_revision)` 读取完整 frozen item set；分页未读尽不能返回 `HandoffComplete`。当前权限隐藏或 item missing 时统一 `NotAvailable` 或显式 `Partial/Missing`，不能从可见 item 子集重算 plan state。该 Query 不准备材料、不 probe receiver、不执行 compensation。

### 6.6 `GetRestoreHandoffStatus`

| 项 | 内容 |
|---|---|
| 函数签名 | `get_restore_handoff_status(&self, context: &ArchiveOperationContext, input: GetRestoreHandoffStatusInput) -> ApplicationResult<SafeRead<SafeRestoreHandoffView>>` |
| request DTO | `GetRestoreHandoffStatusRequest` |
| response DTO | `GetRestoreHandoffStatusResponse` |
| logical route | `archive.query.restore_handoff`（logical；transport pending） |
| read set | exact handoff/item/owner、append-only outcomes、compensations |

```rust
pub struct GetRestoreHandoffStatusRequest {
    pub selector: RestoreHandoffSelectorDto,
    pub outcome_page: Option<ArchivePageRequest>,
    pub compensation_page: Option<ArchivePageRequest>,
}
pub enum RestoreHandoffSelectorDto { Handoff(RestoreHandoffRef), Item(RestoreItemRef) }
pub struct GetRestoreHandoffStatusResponse {
    pub common: ArchiveQueryResponseHeader,
    pub body: Option<SafeRestoreHandoffViewDto>,
    pub outcome_page: Option<ArchivePublicPageInfo>,
    pub compensation_page: Option<ArchivePublicPageInfo>,
}
pub struct SafeRestoreHandoffViewDto {
    pub metadata: SafeViewMetadataDto,
    pub handoff_ref: RestoreHandoffRef,
    pub item_ref: RestoreItemRef,
    pub target_owner_ref: RestoreOwnerRef,
    pub handoff_state: RestoreHandoffStateDto,
    pub outcomes: Vec<SafeHandoffOutcomeViewDto>,
    pub compensations: Vec<SafeCompensationViewDto>,
}
```

`Item` selector 必须由 Step 07 `latest_handoff_ref` 的正式读取面解析；不从 item 字符串、latest timestamp 或 fake map 猜 handoff。`CommitUnknown`、`ReconcileRequired`、conflicting feedback 和 compensation history 必须保留；Query 不将 `Succeeded` 映射为 owner/project `restored`。

### 6.7 Query 共用错误、visibility、分页与审计规则

| 情况 | 对外 surface | 处理 |
|---|---|---|
| missing / hidden / revoked | `NotAvailable` | 丢弃 existence bit、reason、timing；不创建修复记录 |
| stale snapshot / mixed revision | `Stale` 或 `Unknown` | 不拼不同 snapshot；要求 caller 重新发起 Query |
| partial child set | `Partial` | 只返回授权且同 snapshot 的 safe rows；不得补 count |
| blocked prerequisite | `Blocked` | 返回安全 issue；不调用外部 port |
| invalid/expired/foreign cursor | typed issue | 不从 cursor 文本修复或回退第一页 |
| provider/owner unknown | `Unknown` | 不压成 empty、failed 或 success |

每个 Query 的 `ArchiveOperationContext::from_query` 必须 `idempotency_key=None`，`assert_query_no_write()` 成功后才能进入 service。query response 不调用 `save_complete_result`，不写 visibility cache；如需审计只读取既有 Archive/observability material，不追加本地 trace。

## 7. Inbound Consumer 协议族（E01～E05）

### 7.1 shared envelope、payload、receipt 约束

Inbound payload 只写事件特有字段，不重复 `event_id`、`event_envelope_ref`、`event_source_ref`、`dedup_key`、`occurred_at`、`trace_ref`、source family 或 schema version。envelope 的可信来源由 `L0-bus`/owner 合同最终闭合；当前仅保留 logical consumer name 与 typed pending binding。

```rust
pub struct ArchiveInboundReceiptResponse {
    pub consumer_name: ArchiveConsumerName,
    pub receipt: ArchiveConsumerReceipt,
}
pub struct ArchiveTriggerPayload {
    pub request_scope: DeclaredArchiveScopeDto,
    pub trigger_kind: ArchiveTriggerKindDto,
    pub authority_ref: Option<AuthorityRef>,
}
pub enum ArchiveTriggerKindDto { ProjectLifecycleSignal, GovernanceReleaseSignal, FormalArchiveSignal }
pub struct SourceExportFeedbackPayload {
    pub binding_ref: SourceBindingRef,
    pub attempt_ref: CaptureAttemptRef,
    pub feedback: SourceExportFeedbackDto,
}
pub enum SourceExportFeedbackDto {
    Captured(SourceCaptureObservationDto),
    Partial(SourceCoverageObservationDto),
    Missing(SafeReasonRef),
    Stale(SafeReasonRef),
    Conflicting(SafeReasonRef),
    UnsupportedVersion(SafeReasonRef),
    Unknown(SafeReasonRef),
}
pub struct GovernanceDecisionChangePayload {
    pub decision_ref: GovernanceDecisionRef,
    pub affected_revision_ref: BundleRevisionRef,
    pub change_kind: GovernanceDecisionChangeKindDto,
}
pub enum GovernanceDecisionChangeKindDto { BecameApplicable, BecameStale, HoldConflict, Revoked, Superseded }
pub struct StorageActionFeedbackPayload {
    pub action_ref: ExternalActionRecordRef,
    pub target: ExternalActionTargetDto,
    pub feedback: StorageActionFeedbackDto,
}
pub enum StorageActionTargetDto { Placement(ArchivePlacementRef), Lifecycle(LifecycleExecutionRef) }
pub enum StorageActionFeedbackDto { Acknowledged(StorageObservationDto), Committed(StorageObservationDto), Failed(StorageObservationDto), CommitUnknown(StorageObservationDto), Conflicting(StorageObservationDto) }
pub struct RestoreReceiverFeedbackPayload {
    pub handoff_ref: RestoreHandoffRef,
    pub item_ref: RestoreItemRef,
    pub owner_ref: RestoreOwnerRef,
    pub feedback: RestoreReceiverFeedbackDto,
}
pub enum RestoreReceiverFeedbackDto { Acknowledged(ReceiverObservationDto), Succeeded(ReceiverObservationDto), Rejected(ReceiverObservationDto), Failed(ReceiverObservationDto), CommitUnknown(ReceiverObservationDto), Conflicting(ReceiverObservationDto) }
```

`SourceCaptureObservationDto`、`StorageObservationDto`、`ReceiverObservationDto` 只能包含 owner-approved body-free refs、safe summaries、source/fence/version correlation 和 evidence refs；不得携带原始 source body、provider credential、raw signature、secret、HTTP/SQL error 或未核验 digest。字段映射若缺正式上游 schema，保留 `ContractBlocked`，不能把 payload 解析成默认成功。

### 7.2 `ConsumeArchiveTrigger`

| 项 | 内容 |
|---|---|
| 函数签名 | `consume_archive_trigger(&self, context: &ArchiveOperationContext, input: ArchiveTriggerInput) -> ApplicationResult<ArchiveTriggerResult>` |
| envelope | `ArchiveInboundEventEnvelope<ArchiveTriggerPayload>` |
| logical topic | `archive.inbound.archive_trigger`（pending；AR-UP-002/003） |
| 本地结果 | trigger finding，或进入与 `RequestArchive` 相同的正式 admission 语境 |

```rust
pub struct ArchiveTriggerInput { pub envelope: ArchiveInboundEventEnvelope<ArchiveTriggerPayload> }
pub struct ArchiveTriggerResult { pub receipt: ArchiveConsumerReceipt, pub admission_result_ref: Option<ArchiveApplicationResultRef> }
```

只接受明确 owner 的 lifecycle/authority signal；event arrival 不等批准。缺 scope/authority、source family 不匹配、过期/冲突 decision 或重复 event 分别返回 `Rejected/Blocked/Quarantined/Duplicate`。Consumer 不直接创建 `Completed` job，不把 workspace projection 或项目状态当 canonical trigger。

### 7.3 `ConsumeSourceExportFeedback`

| 项 | 内容 |
|---|---|
| 函数签名 | `consume_feedback(&self, context: &ArchiveOperationContext, input: SourceExportFeedbackInput) -> ApplicationResult<SourceExportFeedbackResult>` |
| envelope | `ArchiveInboundEventEnvelope<SourceExportFeedbackPayload>` |
| logical topic | `archive.inbound.source_export_feedback`（pending；AR-UP-001/006/008） |
| 本地结果 | matching `CaptureAttempt`、`CapturedSourceRecord`/coverage/finding、完整 consumer receipt |

```rust
pub struct SourceExportFeedbackInput { pub envelope: ArchiveInboundEventEnvelope<SourceExportFeedbackPayload> }
pub struct SourceExportFeedbackResult { pub receipt: ArchiveConsumerReceipt, pub attempt_ref: Option<CaptureAttemptRef>, pub coverage_ref: Option<CaptureCoverageRef> }
```

必须核对 binding、attempt、requested fence、source class、owner authority、source version 和 correlation digest。stale/partial/missing/conflicting/unknown 可保存为 typed observation；不得跨 attempt 合并，不得以 material count 推导 `Complete`，不得将 workspace projection 反馈提升为 canonical snapshot。

### 7.4 `ConsumeGovernanceDecisionChange`

| 项 | 内容 |
|---|---|
| 函数签名 | `consume_decision_change(&self, context: &ArchiveOperationContext, input: GovernanceDecisionChangeInput) -> ApplicationResult<GovernanceDecisionChangeResult>` |
| envelope | `ArchiveInboundEventEnvelope<GovernanceDecisionChangePayload>` |
| logical topic | `archive.inbound.governance_decision_change`（pending；AR-UP-003） |
| 本地结果 | lifecycle execution 的 re-evaluation marker / blocked basis / safe receipt |

```rust
pub struct GovernanceDecisionChangeInput { pub envelope: ArchiveInboundEventEnvelope<GovernanceDecisionChangePayload> }
pub struct GovernanceDecisionChangeResult { pub receipt: ArchiveConsumerReceipt, pub affected_execution_refs: Vec<LifecycleExecutionRef> }
```

Archive 只消费正式 decision version/applicability/hold 变化，不解释 policy、retention 或 legal hold。新的 hold/revocation 不覆盖旧 effect evidence；已 commit 的 action 不被 ACK/新 event 擦除，必须进入独立 reconciliation posture。fan-out 为每 target 局部结果，不宣称全局原子。

### 7.5 `ConsumeStorageActionFeedback`

| 项 | 内容 |
|---|---|
| 函数签名 | `consume_feedback(&self, context: &ArchiveOperationContext, input: StorageActionFeedbackInput) -> ApplicationResult<StorageActionFeedbackResult>`；另有 lifecycle branch `consume_storage_feedback` |
| envelope | `ArchiveInboundEventEnvelope<StorageActionFeedbackPayload>` |
| logical topic | `archive.inbound.storage_action_feedback`（pending；AR-UP-005、AR-HLD-Q-001） |
| 本地结果 | action/placement/lifecycle outcome，ACK、commit、retrieval 轴分离 |

```rust
pub struct StorageActionFeedbackInput { pub envelope: ArchiveInboundEventEnvelope<StorageActionFeedbackPayload> }
pub struct StorageActionFeedbackResult { pub receipt: ArchiveConsumerReceipt, pub action_ref: Option<ExternalActionRecordRef>, pub outcome_ref: Option<ExternalActionObservationRef> }
```

persisted `target` 决定 placement/lifecycle 分支；不能从 topic、payload string 或 error category 猜 owner。必须匹配 action key、attempt、input digest、target and owner. `Acknowledged` 不等 `Committed`；ambiguous/timeout/conflicting 进入 `CommitUnknown`，不能盲重发。unmatched action quarantine，不写 unrelated records。

### 7.6 `ConsumeRestoreReceiverFeedback`

| 项 | 内容 |
|---|---|
| 函数签名 | `consume_receiver_feedback(&self, context: &ArchiveOperationContext, input: RestoreReceiverFeedbackInput) -> ApplicationResult<RestoreReceiverFeedbackResult>` |
| envelope | `ArchiveInboundEventEnvelope<RestoreReceiverFeedbackPayload>` |
| logical topic | `archive.inbound.restore_receiver_feedback`（pending；AR-UP-009） |
| 本地结果 | owner-specific `HandoffOutcome`、item/plan conservative posture、receipt |

```rust
pub struct RestoreReceiverFeedbackInput { pub envelope: ArchiveInboundEventEnvelope<RestoreReceiverFeedbackPayload> }
pub struct RestoreReceiverFeedbackResult { pub receipt: ArchiveConsumerReceipt, pub handoff_ref: Option<RestoreHandoffRef>, pub outcome_ref: Option<HandoffOutcomeRef> }
```

必须 exact-match receiver、handoff、item、material/input digest、receiver idempotency key 和 plan revision。feedback arrival/success 不等 owner database commit 或 project restored；`CommitUnknown`/conflicting 保留原 handoff evidence，进入 probe/manual/authorized compensation，不直接改写 owner truth。

### 7.7 Consumer 共用 receipt、context、错误与持久闭环

所有 Consumer 使用 `ArchiveOperationContext::from_inbound_event`，`channel=InboundEvent`、`source_event_ref`、dedup key、trace、actor 均来自可信 envelope；不得由 payload 或 event topic 反推。`reserve_operation` 的 key namespace 必须包含 channel/operation/scope/dedup key；Query 不参与。

| outcome | payload 解析 | 本地写入 | receipt surface |
|---|---|---|---|
| Accepted | parsed + binding valid | matching Archive observation + full result/receipt | `Accepted`, committed marker |
| Duplicate | 不重解析为 mutation | no new observation | 原 stored receipt/result replay |
| Delayed | 可保存安全 issue | 不写 core truth；可写 delayed receipt | `Delayed` + issue refs |
| Rejected | invalid body/envelope | no observation | `Rejected` + safe issue |
| Quarantined | untrusted/unmatched | quarantine receipt only | `Quarantined` |
| UnsupportedVersion | 不解析 payload | no snapshot/stale/effect | `UnsupportedVersion` |
| CommitUnknown | local/external effect uncertain | preserve intent/result posture | `CommitUnknown` + reconcile ref |

`save_consumer_receipt`、`get_consumer_receipt`、`save_complete_result`、`get_complete_result` 必须配对；receipt 缺失、wrong consumer、wrong event/digest 或 payload incomplete 视为 `ResultMissing/CorruptRecord`，不得重新应用 event。

## 8. Operations Job 协议族（J01～J17）

### 8.1 Job shared input / output contract

所有 Operations Job 使用同一个 `ArchiveJobEnvelope<T>` 外层，但每个 `T` 必须有独立的字段级 schema 和 selector；不得让 runner 从 job name、route、typed ref 顺序或私有 map 推断 input。`worker_claim`、`run_id`、`idempotency_key`、actor、trace 不在 job payload 中重复。

```rust
/// Shared job response envelope.  Report is complete and replayable.
pub struct ArchiveJobResponse {
    pub job_name: ArchiveJobName,
    pub run_id: JobRunId,
    pub disposition: ArchiveJobDisposition,
    pub result_ref: Option<ArchiveApplicationResultRef>,
    pub report: Option<ArchiveOperationReport>,
    pub issue_refs: Vec<ArchiveProtocolIssueRef>,
}

/// Maps one named job to its exact application method; no dynamic service locator.
pub enum ArchiveJobDispatch {
    Request(AdvanceArchiveJobInput),
    Source(PlanArchiveSourcesInput),
    Capture(CaptureArchiveSourceInput),
    CaptureReconcile(ReconcileSourceCaptureInput),
    Manifest(AssembleBundleManifestInput),
    Seal(SealArchiveBundleInput),
    Integrity(AssessBundleIntegrityInput),
    Compatibility(AssessBundleCompatibilityInput),
    Placement(PlaceArchiveBundleInput),
    Retrieval(RetrieveArchiveBundleInput),
    Lifecycle(ExecuteArchiveLifecycleInput),
    ActionReconcile(ReconcileExternalActionInput),
    RestorePlan(BuildRestorePlanInput),
    RestoreMaterial(PrepareRestoreMaterialInput),
    Handoff(DispatchRestoreHandoffInput),
    HandoffReconcile(ReconcileRestoreHandoffInput),
    Compensation(ExecuteRestoreCompensationInput),
}
```

`ArchiveJobDispatch` 的 variant 由 trusted worker registry 和 persisted `WorkerTargetRef` 唯一确定；E04/J12 的 `ActionReconcile` 仍需读回 `ExternalActionTargetRef` 后在 Placement/Lifecycle 两个 method surface 中二选一。未知/缺失/多 target 返回 `InputConflict` 或 `ContractBlocked`，不能广播到两个 service。

Job outcome 的最低完整集合为：`Accepted`、`Duplicate`、`Completed`、`Partial`、`Blocked`、`Failed`、`CommitUnknown`；每个 `ArchiveOperationReport` 还必须保存每个处理项的 `subject`、`outcome`、`related_refs`、`detail_refs`、continuation、stage ref、issue refs 和 recorded_at。`Accepted`/`Completed` 只代表本次 Archive-owned invocation 的本地结果，不能代替 source owner、storage provider、receiver 或项目状态提交。

### 8.2 `AdvanceArchiveJob`（J01）

| 项 | 内容 |
|---|---|
| 函数签名 | `advance_job(&self, context: &ArchiveOperationContext, input: AdvanceArchiveJobInput) -> ApplicationResult<AdvanceArchiveJobReport>` |
| 触发 / logical name | bounded worker candidate；`archive.job.advance` |
| 目标 | `ArchiveJob`、`ArchiveJobStageRecord`、stored operation report |

```rust
pub struct AdvanceArchiveJobInput {
    pub job_ref: ArchiveJobRef,
    pub expected_version: ArchiveJobVersion,
    pub requested_stage: Option<ArchiveJobStageDto>,
    pub component_postures: Vec<JobComponentPostureInputDto>,
}
pub struct JobComponentPostureInputDto {
    pub component: JobComponentKindDto,
    pub posture: ComponentPostureDto,
    pub basis_ref: ArchiveRecordRef,
}
pub struct AdvanceArchiveJobReport { pub report: ArchiveOperationReport }
```

输入来源：`job_ref/expected_version` 来 `get_job_with_version`；component basis 来同一 read snapshot 的已提交 CP record；requested stage 不能越过 kind-specific stage guard。缺 component、version conflict、stale worker claim、mixed snapshot 为 `Blocked/Failed/Conflict`，不从单个 CP 成功推导 job `Completed`。duplicate 读取原报告，不重新 recompute。

### 8.3 `PlanArchiveSources`（J02）

```rust
pub struct PlanArchiveSourcesInput {
    pub request_ref: ArchiveRequestRef,
    pub scope_ref: DeclaredScopeRef,
    pub declaration_version: ScopeDeclarationVersion,
    pub selectors: Vec<OwnerSliceSelectorDto>,
}
pub struct OwnerSliceSelectorDto { pub owner: SourceOwnerDto, pub selector: OwnerSliceSelector, pub requiredness: SourceRequirednessDto }
pub struct PlanArchiveSourcesReport { pub report: ArchiveOperationReport }
```

函数：`plan_sources(&self, context: &ArchiveOperationContext, input: PlanArchiveSourcesInput) -> ApplicationResult<PlanArchiveSourcesReport>`；logical `archive.job.plan_sources`。`request_ref/scope_ref/declaration_version` 必须来自 immutable admitted request；selectors 非空、唯一、稳定排序。owner/source class/conditional participation 只能由正式 source binding contract 返回；workspace projection 只能标为 Auxiliary。缺 owner contract、scope mismatch、undecided participation 为 `Blocked/Partial`，不生成 canonical binding。

### 8.4 `CaptureArchiveSource`（J03）

```rust
pub struct CaptureArchiveSourceInput {
    pub binding_ref: SourceBindingRef,
    pub attempt_ref: CaptureAttemptRef,
    pub capture_input: SourceCaptureInputDto,
    pub expected_version: CaptureAttemptVersion,
}
pub struct SourceCaptureInputDto {
    pub scope_ref: DeclaredScopeRef,
    pub selector: OwnerSliceSelector,
    pub authority_ref: SourceAuthorityRef,
    pub contract_ref: SourceContractRef,
    pub requested_fence: Option<SnapshotFenceRef>,
}
pub struct CaptureArchiveSourceReport { pub report: ArchiveOperationReport }
```

函数：`capture_source(&self, context: &ArchiveOperationContext, input: CaptureArchiveSourceInput) -> ApplicationResult<CaptureArchiveSourceReport>`；logical `archive.job.capture_source`。必须先确认已持久 `CaptureAttempt` 与 binding/attempt/fence，再调用 `SourceExportPort`；external I/O 不在 local Tx 内。`Observed/Pending/Blocked/Failed/Unknown` 必须逐项保存 coverage、member、finding、feedback refs；未知不转 empty，workspace view 不转 canonical。

### 8.5 `ReconcileSourceCapture`（J04）

```rust
pub struct ReconcileSourceCaptureInput {
    pub attempt_ref: CaptureAttemptRef,
    pub expected_version: CaptureAttemptVersion,
    pub probe_ref: ExternalFeedbackRef,
    pub requested_outcome: CaptureReconcileModeDto,
}
pub enum CaptureReconcileModeDto { ProbeExisting, AcceptFeedback, RequireReplacement }
pub struct ReconcileSourceCaptureReport { pub report: ArchiveOperationReport }
```

函数：`reconcile_capture(&self, context: &ArchiveOperationContext, input: ReconcileSourceCaptureInput) -> ApplicationResult<ReconcileSourceCaptureReport>`；logical `archive.job.reconcile_capture`。probe 必须指向 exact attempt/input/fence；不得盲 recapture 或把 timeout 当 Failed。`CommitUnknown`/stale/conflicting 只能保存对账 posture 或显式 replacement-required，replacement 必须新 attempt/operation key。

### 8.6 `AssembleBundleManifest`（J05）

```rust
pub struct AssembleBundleManifestInput {
    pub bundle_ref: ArchiveBundleRef,
    pub request_ref: ArchiveRequestRef,
    pub source_binding_refs: Vec<SourceBindingRef>,
    pub capture_attempt_refs: Vec<CaptureAttemptRef>,
    pub expected_bundle_version: ArchiveBundleVersion,
}
pub struct AssembleBundleManifestReport { pub report: ArchiveOperationReport }
```

函数：`assemble_manifest(&self, context: &ArchiveOperationContext, input: AssembleBundleManifestInput) -> ApplicationResult<AssembleBundleManifestReport>`；logical `archive.job.assemble_manifest`。输入必须覆盖 immutable declared scope 的全部 required bindings、settled attempts 和 owner-approved inventory；分页未读尽、required unknown、owner closure 未证明均不得生成 `ClosureReady`。manifest entries、source records、closure findings 作为同一 immutable revision 保存；旧 closure 不解锁新 assembly。

### 8.7 `SealArchiveBundle`（J06）

```rust
pub struct SealArchiveBundleInput {
    pub bundle_ref: ArchiveBundleRef,
    pub revision_ref: BundleRevisionRef,
    pub seal_basis: BundleSealBasisDto,
    pub expected_bundle_version: ArchiveBundleVersion,
}
pub struct BundleSealBasisDto {
    pub closure_ref: ManifestClosureRef,
    pub integrity_assessment_refs: Vec<VerificationAssessmentRef>,
    pub compatibility_assessment_refs: Vec<CompatibilityAssessmentRef>,
    pub placement_ref: Option<ArchivePlacementRef>,
    pub assembly_origin_ref: BundleRevisionRef,
}
pub struct SealArchiveBundleReport { pub report: ArchiveOperationReport }
```

函数：`seal_bundle(&self, context: &ArchiveOperationContext, input: SealArchiveBundleInput) -> ApplicationResult<SealArchiveBundleReport>`；logical `archive.job.seal_bundle`。`seal_basis` 必须 exact-match 同一 revision、closure、fixed assessments、placement and assembly origin；required unknown/blocked/failed、digest/signature/key 未闭合时 `Blocked`，不能生成 seal proof。`Sealed` 只表示 Archive-owned seal guards，不代表 project archived 或 storage committed。

### 8.8 `AssessBundleIntegrity`（J07）

```rust
pub struct AssessBundleIntegrityInput {
    pub revision_ref: BundleRevisionRef,
    pub verification_input: VerificationInputBindingDto,
    pub assessment_ref: Option<VerificationAssessmentRef>,
    pub expected_version: Option<RecordVersion>,
}
pub struct VerificationInputBindingDto {
    pub revision_ref: BundleRevisionRef,
    pub manifest_ref: BundleManifestRef,
    pub material_refs: Vec<ArchivedMaterialRef>,
    pub declared_digest_ref: Option<DigestRef>,
    pub signature_ref: Option<SignatureRef>,
    pub schema_refs: SchemaVersionRefSet,
}
pub struct AssessBundleIntegrityReport { pub report: ArchiveOperationReport }
```

函数：`assess_integrity(&self, context: &ArchiveOperationContext, input: AssessBundleIntegrityInput) -> ApplicationResult<AssessBundleIntegrityReport>`；logical `archive.job.assess_integrity`。`verification_input` 必须与 immutable manifest revision、captured material/source member 和 owner-approved digest/signature references 完全匹配；assessment intent 先落本地，再在事务外调用 `IntegrityCapabilityPort`。算法、签名方案、KMS/key、压缩和 digest authority 未闭合时返回 `Blocked/Unknown`，不生成 Verified、digest 或 signature。`IntegrityFailed`、`UnsupportedVersion`、`Partial`、`Unknown` 均作为完整 item detail 保存；duplicate 读取既有 report，不重新验证。

### 8.9 `AssessBundleCompatibility`（J08）

```rust
pub struct AssessBundleCompatibilityInput {
    pub revision_ref: BundleRevisionRef,
    pub selection: CompatibilitySelectionDto,
    pub assessment_ref: Option<CompatibilityAssessmentRef>,
    pub expected_version: Option<RecordVersion>,
}
pub struct CompatibilitySelectionDto {
    pub target: CompatibilityTargetDto,
    pub schema_refs: Vec<SchemaVersionRef>,
    pub authority_ref: Option<ExternalEvidenceRef>,
}
pub struct AssessBundleCompatibilityReport { pub report: ArchiveOperationReport }
```

函数：`assess_compatibility(&self, context: &ArchiveOperationContext, input: AssessBundleCompatibilityInput) -> ApplicationResult<AssessBundleCompatibilityReport>`；logical `archive.job.assess_compatibility`。target、schema set、revision 和 capability contract 是一个不可拆分的 selection；不得读取“最新成功”或跨 target 复用 assessment。`Supported/Unsupported/Unknown/Conflicting` 必须带 exact target/schema/evidence refs；schema evolution authority 未闭合则 `ContractBlocked`，不得迁移 Bundle 或声称长期可读。每个 assessment immutable，新的 target/input 必须新 ref。

### 8.10 `PlaceArchiveBundle`（J09）

```rust
pub struct PlaceArchiveBundleInput {
    pub placement_ref: ArchivePlacementRef,
    pub revision_ref: BundleRevisionRef,
    pub storage_intent: StorageIntentDto,
    pub action_ref: ExternalActionRecordRef,
    pub expected_placement_version: ArchivePlacementVersion,
}
pub struct StorageIntentDto {
    pub location_ref: StorageLocationRef,
    pub tier_ref: Option<StorageTierRef>,
    pub idempotency_key: ExternalIdempotencyKey,
    pub input_digest: SafeInputDigest,
}
pub struct PlaceArchiveBundleReport { pub report: ArchiveOperationReport }
```

函数：`place_bundle(&self, context: &ArchiveOperationContext, input: PlaceArchiveBundleInput) -> ApplicationResult<PlaceArchiveBundleReport>`；logical `archive.job.place_bundle`。`ArchivePlacement`、`ExternalActionRecord` 和完整 `StorageDispatchInput` 必须在外部调用前同一 local UoW 提交；storage provider、location、tier、secret、SLA 未闭合时保持 `Blocked`。调用 `ArchiveStoragePort` 时使用 persisted action/ref/digest，不接受 API 临时 location。返回必须区分 `Acknowledged`、`Committed`、`Failed`、`CommitUnknown`；ACK 或 dispatch success 不升级为 commit，may-have-dispatched 不能自动 retry。

### 8.11 `RetrieveArchiveBundle`（J10）

```rust
pub struct RetrieveArchiveBundleInput {
    pub placement_ref: ArchivePlacementRef,
    pub revision_ref: BundleRevisionRef,
    pub retrieval_intent_ref: ExternalActionRecordRef,
    pub expected_placement_version: ArchivePlacementVersion,
    pub probe_context_ref: Option<ExternalEvidenceRef>,
}
pub struct RetrieveArchiveBundleReport { pub report: ArchiveOperationReport }
```

函数：`retrieve_bundle(&self, context: &ArchiveOperationContext, input: RetrieveArchiveBundleInput) -> ApplicationResult<RetrieveArchiveBundleReport>`；logical `archive.job.retrieve_bundle`。retrieval 是独立轴：`Requested` 不等 `Retrievable`，placement `Committed` 不证明当前可取回。必须 exact-match placement、revision、retrieval action 和 storage binding；缺 provider retrieval contract、location/tier 或 probe 语义时返回 `Blocked/Unknown`。Query 不调用该 Job；duplicate 只重放完整 report，不再次发起取回。

### 8.12 `ExecuteArchiveLifecycle`（J11）

```rust
pub struct ExecuteArchiveLifecycleInput {
    pub lifecycle_ref: LifecycleExecutionRef,
    pub revision_ref: BundleRevisionRef,
    pub decision_ref: GovernanceDecisionRef,
    pub action_ref: ExternalActionRecordRef,
    pub expected_lifecycle_version: LifecycleExecutionVersion,
}
pub struct ExecuteArchiveLifecycleReport { pub report: ArchiveOperationReport }
```

函数：`execute(&self, context: &ArchiveOperationContext, input: ExecuteArchiveLifecycleInput) -> ApplicationResult<ExecuteArchiveLifecycleReport>`；logical `archive.job.execute_lifecycle`。dispatch 前必须通过 `GovernanceDecisionPort` 读取当前 applicability、version、hold/conflict 和 formal proof，并重新校验 `decision_ref` 与 persisted lifecycle/action target；不能用 actor、旧 accepted decision 或 local clock 替代 owner 事实。`RetentionPolicy`、legal hold、delete authorization、risk acceptance 和 project status 均不归 Archive；无法证明时 `Blocked`。外部效果仍在事务外执行，结果只写 Archive-owned lifecycle/action history，绝不反写 owner 数据库。

### 8.13 `ReconcileExternalAction`（J12 / J12-L）

```rust
pub struct ReconcileExternalActionInput {
    pub action_ref: ExternalActionRecordRef,
    pub target: Option<ExternalActionTargetDto>,
    pub expected_action_version: RecordVersion,
    pub probe_ref: ExternalEvidenceRef,
    pub mode: ExternalActionReconcileModeDto,
}
pub enum ExternalActionTargetDto { Placement(ArchivePlacementRef), Lifecycle(LifecycleExecutionRef) }
pub enum ExternalActionReconcileModeDto { ProbeOnly, AcceptFormalFeedback, RequireManualDecision }
pub struct ReconcileExternalActionReport { pub report: ArchiveOperationReport }
```

函数签名分别为：`PlacementService::reconcile_action(...)` 与 `LifecycleExecutionService::reconcile_action(...)`；两者共享 `ReconcileExternalActionInput`，由 persisted `ExternalActionTargetRef` 唯一选择，不是两个同时调用的 fallback。该 Job 只处理 `CommitUnknown`、矛盾反馈或正式 probe；不得对 definite failure、already committed 或 missing intent 盲重放。probe 必须匹配 owner、action key、input digest、attempt 和 target；仍未知时保存 `CommitUnknown`，需要新的外部尝试必须经过新的 intent/idempotency key 和明确授权。`target=None`、target mismatch 或跨 placement/lifecycle ref 为 `InputConflict`。

### 8.14 `BuildRestorePlan`（J13）

```rust
pub struct BuildRestorePlanInput {
    pub restore_request_ref: RestoreRequestRef,
    pub bundle_revision_ref: BundleRevisionRef,
    pub owner_set: RestoreTargetOwnerSetDto,
    pub expected_plan_revision: Option<RestorePlanRevision>,
    pub expected_request_version: RecordVersion,
}
pub struct RestoreTargetOwnerSetDto { pub owners: Vec<RestoreOwnerRef> }
pub struct BuildRestorePlanReport { pub report: ArchiveOperationReport }
```

函数：`build_plan(&self, context: &ArchiveOperationContext, input: BuildRestorePlanInput) -> ApplicationResult<BuildRestorePlanReport>`；logical `archive.job.build_restore_plan`。输入必须来自已受理 `RestoreRequest`、固定 Bundle revision 和 source-authority matrix；owner set 取自 admission 时冻结的集合，必须非空、唯一、稳定排序，不能从 Bundle entries 或 ref 文本推导。`RestoreService` 在本 Job 通过 `RestoreReceiverPort::resolve` 为每个 owner 取得 typed receiver outcome，再将 exact mapping/evidence 固定到对应 item；C02 不提供该 mapping。生成 immutable plan revision 和逐 owner `RestoreItem`；缺 material closure、integrity/compatibility、retrieval、authority 或 receiver contract 时生成 `Blocked` item/plan basis，不缩小 required owner 集合以伪造 Ready。新的 owner/material/input 只能新 plan revision，旧 plan 不原地改写。

### 8.15 `PrepareRestoreMaterial`（J14）

```rust
pub struct PrepareRestoreMaterialInput {
    pub plan_ref: RestorePlanRef,
    pub item_ref: RestoreItemRef,
    pub revision_ref: BundleRevisionRef,
    pub owner_ref: RestoreOwnerRef,
    pub entry_refs: Vec<ManifestEntryRef>,
    pub source_entries: Vec<RestoreMaterialEntryDto>,
    pub expected_item_version: RestoreItemVersion,
}
pub struct RestoreMaterialEntryDto {
    pub entry_ref: ManifestEntryRef,
    pub binding_ref: SourceBindingRef,
    pub attempt_ref: CaptureAttemptRef,
    pub member_ref: ManifestMemberKeyRef,
    pub material_ref: ArchivedMaterialRef,
}
pub struct PrepareRestoreMaterialReport { pub report: ArchiveOperationReport }
```

函数：`prepare_material(&self, context: &ArchiveOperationContext, input: PrepareRestoreMaterialInput) -> ApplicationResult<PrepareRestoreMaterialReport>`；logical `archive.job.prepare_restore_material`。`source_entries` 必须逐项关联 fixed manifest entry → source binding → capture attempt → captured member/material，并与 item 的 exact entry set、owner、plan revision、schema/version、integrity/compatibility、current authority 完全一致；不得靠两个数组位置或 ref 字符串匹配。缺失、过期、冲突、不支持版本、完整性失败、receiver 不可用或 authority stale 均为显式 `Blocked/Missing/Stale/Conflicting/UnsupportedVersion/IntegrityFailed`，不能构造 `MaterialReady`。准备材料只保存 Archive-owned material ref/sidecar，不授予 owner 写权限，不保存原始正文或 secret。

### 8.16 `DispatchRestoreHandoff`（J15）

```rust
pub struct DispatchRestoreHandoffInput {
    pub item_ref: RestoreItemRef,
    pub material_ref: RestoreMaterialRef,
    pub receiver_ref: RestoreReceiverRef,
    pub handoff_ref: RestoreHandoffRef,
    pub handoff_input: HandoffInputDto,
    pub expected_item_version: RestoreItemVersion,
}
pub struct HandoffInputDto {
    pub plan_ref: RestorePlanRef,
    pub revision_ref: BundleRevisionRef,
    pub owner_ref: RestoreOwnerRef,
    pub receiver_key: ReceiverEffectKey,
    pub idempotency_key: ReceiverIdempotencyKey,
    pub input_digest: SafeInputDigest,
}
pub struct DispatchRestoreHandoffReport { pub report: ArchiveOperationReport }
```

函数：`dispatch_handoff(&self, context: &ArchiveOperationContext, input: DispatchRestoreHandoffInput) -> ApplicationResult<DispatchRestoreHandoffReport>`；logical `archive.job.dispatch_restore_handoff`。`RestoreService` 必须先通过 `RestoreReceiverPort::resolve` 重验 owner-specific receiver mapping 与当前 authority/revision，且结果与 J13 固定的 item receiver/evidence exact match；随后才在本地事务保存完整 `HandoffDispatchInput`、handoff ref、receiver/owner/material/input digest，再在事务外调用同一 port 的 `dispatch`。receiver、owner、item、plan revision、material ref 和 receiver idempotency key 必须 exact match；缺 receiver contract、authority、fence 或版本兼容时 `Blocked`，不得派发。结果区分 `Acknowledged`、`Succeeded`、`Rejected`、`Failed`、`CommitUnknown`，其中 ACK 不等 owner commit；unknown 不盲重发，需 J16 probe 或正式补偿。

### 8.17 `ReconcileRestoreHandoff`（J16）

```rust
pub struct ReconcileRestoreHandoffInput {
    pub handoff_ref: RestoreHandoffRef,
    pub item_ref: RestoreItemRef,
    pub expected_handoff_version: RestoreHandoffVersion,
    pub probe_ref: ExternalEvidenceRef,
    pub mode: HandoffReconcileModeDto,
}
pub enum HandoffReconcileModeDto { ProbeOnly, AcceptFormalFeedback, RequireManualDecision }
pub struct ReconcileRestoreHandoffReport { pub report: ArchiveOperationReport }
```

函数：`reconcile_handoff(&self, context: &ArchiveOperationContext, input: ReconcileRestoreHandoffInput) -> ApplicationResult<ReconcileRestoreHandoffReport>`；logical `archive.job.reconcile_restore_handoff`。probe 必须使用已保存 handoff input、receiver key、material/input digest、owner 和 plan revision；不得从当前 owner/project 状态或 latest outcome 猜测。明确结果可进入新 append-only `HandoffOutcome`，仍未知保存 `CommitUnknown/ReconcileRequired`；不支持 probe 时返回 blocked/manual posture，不重发原 handoff。`item_ref` 与 handoff 不匹配、旧 fence 或 duplicate feedback 返回 `InputConflict`/原 report replay。

### 8.18 `ExecuteRestoreCompensation`（J17）

```rust
pub struct ExecuteRestoreCompensationInput {
    pub compensation_ref: CompensationRecordRef,
    pub handoff_ref: RestoreHandoffRef,
    pub item_ref: RestoreItemRef,
    pub authority_ref: CompensationAuthorityRef,
    pub receiver_ref: RestoreReceiverRef,
    pub action: CompensationActionDto,
    pub expected_compensation_version: CompensationRecordVersion,
}
pub enum CompensationActionDto { ReverseHandoff, RemoveMaterial, MarkManualReview, OtherFormalAction }
pub struct ExecuteRestoreCompensationReport { pub report: ArchiveOperationReport }
```

函数：`execute_compensation(&self, context: &ArchiveOperationContext, input: ExecuteRestoreCompensationInput) -> ApplicationResult<ExecuteRestoreCompensationReport>`；logical `archive.job.execute_restore_compensation`。必须存在 owner/formal authority 已批准的 compensation intent，且与原 handoff/item/receiver/material correlation 完全一致；Archive 不自行授权 reverse/cancel/delete，也不抹除原 handoff/outcome。补偿 intent 先保存，外部 receiver compensation 在事务外执行，结果追加 compensation history，区分 `Completed/Failed/CommitUnknown/Blocked`。缺 receiver probe、compensation schema、legal authority 或 commit feedback 时 fail-closed；compensated 不等 project restored，也不删除原证据。

### 8.19 Job 协议族共用闭环

| 检查项 | 要求 |
|---|---|
| input source | 每个 Job 输入字段均来自 Step 07 exact read、固定 request/manifest/attempt/intent/plan 或正式 owner feedback；不从 route、字符串、latest 或 fake map 推导 |
| context | `ArchiveOperationContext::from_job` 必须包含 `OperationJob` channel、job run、idempotency key、trace 和 active `WorkerClaim`；claim 与 operation/target/holder 逐字段匹配 |
| UoW | local intent/input/result/report/checkpoint/reservation 按 Step 07 同 Tx；所有 external I/O 在事务关闭后执行，回包新开 Tx 核验固定 input/version/fence |
| report | `ArchiveOperationReport` 保存完整 items、related refs、details、continuation、stage、issues、result_ref；duplicate 只 load stored report |
| errors | `Partial`、`Blocked`、`Stale`、`Missing`、`Conflicting`、`UnsupportedVersion`、`IntegrityFailed`、`CommitUnknown`、`VersionConflict`、`ContractBlocked` 可测试且不降级成成功 |
| no owner write | Archive Bundle、manifest、report、handoff、compensation 只代表 Archive-owned record；恢复必须经 owning domain 的 formal import/restore/command/handoff |
| worker | candidate 只提供 bounded typed target；service 重新读取 exact input；旧 fence/claim 不能提交，新 attempt/retry 必须新 key/intent |

J01～J17 的命名、函数、input 和 report 一一映射本仓正式 02 §7.5 与 Step 06 service surface；J12 的 placement/lifecycle 分支是一个入口的两个互斥 method surfaces。没有任何 Job 被定义为自动 schedule、provider success 或项目状态变更。

## 9. Outbound Event candidates（全部 blocked）

`AR-HLD-Q-001` 尚未闭合 Archive 是否需要 committed fact/outbox、事件族、publisher、delivery/ACK 语义和 Bus 接入。因此本 Step 只记录候选边界，不定义 ready outbound contract、publisher trait、outbox repository、topic、订阅关系或 delivery evidence。

| candidate | 可能事实来源 | 候选 payload（仅逻辑） | 允许下游语义 | 当前状态 |
|---|---|---|---|---|
| `ArchiveJobPostureChanged` | 已提交 `ArchiveJob` stage/posture 与 stage record | `job_ref`、`job_kind`、`current_stage`、`aggregate_posture`、`stage_ref`、Archive-local source marker | 仅传播 Archive 作业姿态；不代表项目 archived/restored | `blocked: AR-HLD-Q-001` |
| `ArchiveBundleSealed` | 已提交 Bundle revision/seal basis | `bundle_ref`、`revision_ref`、seal posture、safe basis ref | 仅传播 Archive-owned sealed posture；不授予跨域写权 | `blocked: AR-HLD-Q-001/AR-UP-004~006` |
| `RestoreHandoffPostureChanged` | per-owner handoff/outcome/compensation history | `handoff_ref`、`item_ref`、owner-safe posture、outcome/compensation refs | 仅传播单 owner handoff 姿态；不代表 receiver/project restored | `blocked: AR-HLD-Q-001/AR-UP-009` |

若后续解锁，必须回退核验 Step 07 stored result/UoW、L0-bus formal envelope、source subject mapping、event version、outbox atomicity、publisher/ACK/commit 边界，再由新 Step 或正式变更定义。当前不得把 `ArchiveCommandResponse`、`ArchiveConsumerReceipt` 或 `ArchiveOperationReport` 自动转换为 outbound event；accepted、ACK、dispatch 和 local commit 不能伪装成 owner truth。

## 10. 最终协议闭环审计

### 10.1 入口分母与服务映射

| 族 | 正式数量 | 当前覆盖 | service / route 校验 |
|---|---:|---|---|
| Command | 3 | `RequestArchive`、`RequestRestore`、`RequestLifecycleExecution` | 与 Step 06 C01～C03 方法一一对应；local admission/intent only |
| Query | 5 | `GetArchiveJobStatus`、`GetArchiveBundle`、`VerifyArchiveBundle`、`GetRestorePlan`、`GetRestoreHandoffStatus` | 与 Step 06 Q01～Q05 一一对应；只读 read store + visibility |
| Inbound Consumer | 5 | archive trigger、source export feedback、governance decision change、storage action feedback、restore receiver feedback | 与 Step 06 E01～E05 对应；E04 placement/lifecycle branch 由 persisted target 选择 |
| Operations Job | 17 | J01～J17；J12 两个互斥 method surface | 与 Step 06 service surface 和正式 02 §7.5 对齐；worker 不直连 domain/store |
| Outbound candidate | 3 | job posture、bundle sealed、restore handoff posture | blocked candidate only；无 publisher/outbox ready contract |

结论：协议分母保持 `3 + 5 + 5 + 17 = 30 logical entries`，E04/J12 的 placement/lifecycle 路由仍是 32 个 application method surfaces，而不是新增入口。

### 10.2 DTO → domain / port / flow 构造闭环

| 协议族 | DTO 必填输入来源 | 目标对象 / port | 缺失与错误 | 后续承接 |
|---|---|---|---|---|
| Command | trusted actor/metadata/key/trace envelope + explicit scope/bundle/decision payload | admission request/job/stage、lifecycle intent、OperationResultWrite | rejected、blocked、digest conflict、version conflict、commit unknown | Step 09 flow、Step 11 UoW、Step 13 digest |
| Query | typed selector + revision/filter + public cursor | VisibilityResolutionRead、ArchiveReadStorePort、五 safe view factories | hidden/absent→NotAvailable；stale/partial/unknown explicit；cursor mismatch rejected | Step 09 query flows、Step 15 test cuts |
| Consumer | trusted envelope + typed payload + persisted input correlation | capture/action/handoff observation、finding/receipt/result | unsupported/quarantined/rejected/delayed/duplicate；不写 owner truth | Step 09 consumer flows、Step 12/13 ACK/retry |
| Job | persisted root/attempt/intent/plan + WorkerClaim | job service、exact repository/port、complete operation report | missing/stale/conflicting/unsupported/integrity-failed/commit-unknown | Step 09 flow、Step 10 state、Step 11 consistency |

任何 `Option<T>` 的含义都在对应小节闭合：可选 assessment/material/placement 只有在 domain/port 明确允许时可为空；required selector、owner set、entry set、digest correlation、result/report surface 缺失时安全阻断，不由 DTO factory 补默认值。

### 10.3 source-authority matrix 与关系分类

| 切片 / 材料 | source authority | Archive 协议字段允许携带 | 关系分类 | 禁止 |
|---|---|---|---|---|
| Identity / Conversation / Work / Process canonical snapshot | 对应 L1 owner | owner-approved source ref、version/fence、coverage、material ref | runtime + ref + event feedback + adapter | sibling compile、Archive 复制 canonical truth |
| Governance decision / retention / legal hold | governance 或明确 owner | `GovernanceDecisionRef`、applicability/version/hold evidence | runtime + ref + event | Archive 自行解释/决定 policy、hold、delete、risk |
| Artifact正文/lineage | L1-artifact | approved artifact/material refs 与 closure evidence | runtime + ref | ref count 代替 body/lineage closure |
| L1-workspace projection | L1-workspace | 明确 `WorkspaceProjection` auxiliary ref/summary | runtime + ref | projection 冒充 L1 canonical snapshot |
| L4-observability material | L4-observability | approved redacted observation/evidence refs | runtime + ref + event | 审计链/后端归 Archive，或把摘要当完整链 |
| object storage / signature / KMS / receiver | owning provider/receiver contract | typed intent/key/digest/effect/feedback refs | runtime + adapter + event | provider、secret、算法、key、commit 由 Archive 私造 |

### 10.4 协议错误、重放与一致性检查

| 检查项 | 结论 |
|---|---|
| envelope/payload 分离 | pass；Command/Query/Inbound/Job 的 actor、trace、idempotency、event identity、run/claim 不重复进入 payload |
| public DTO 不依赖 domain-only | pass with mapping；`*Dto`/safe view mapping 由 contracts 协议层承接，domain object 不直接出 public surface |
| query no-write | pass；五 Query 只读 committed snapshot，禁止 verify/capture/retrieve/repair/retry/cache write |
| public cursor 映射 | pass；public cursor 与 repository cursor 独立，绑定 selector/principal/visibility/snapshot/order/read-model kind |
| duplicate result | pass；complete result、consumer receipt、job report 均有 typed save/get/replay；缺失即 ResultMissing/CorruptRecord，不重跑 |
| actor / metadata / trace | pass；由 context/envelope trusted source 提供，不从 payload/ref/route 推导 |
| digest / signature 来源 | pending；输入 digest 算法、完整性 digest、签名/KMS 仍由 AR-UP-004/Step 13/14 闭合，当前 fail-closed |
| unsupported / stale / partial / missing / conflicting | pass；均有显式 disposition/surface/item outcome，未知不压成 empty/success |
| commit-unknown | pass；local/external uncertainty 分离，probe/reconcile 新 intent 规则已写，禁止盲重发 |
| outbound | blocked；仅 3 candidate，无 outbox/publisher/topic/delivery readiness |

### 10.5 本 Step 前后对比与取舍

| 项 | 进入 Step 08 前 | 本 Step 结果 |
|---|---|---|
| public protocol | 仅有入口名称/输入骨架 | 形成 envelope、payload、request/response、receipt/report、错误与映射规则 |
| Query | 只有 safe view 名称 | 形成 request、view DTO、page/marker、public↔repository cursor 和 no-write 表面 |
| Consumer | 只有反馈类别 | 形成 trusted envelope、5 typed payload、receipt、unsupported/quarantine/delayed/duplicate 规则 |
| Job | 只有 17 个 Job 名称 | 每个 Job 有独立 input/report、固定输入、target/fence、外部效果和 replay 规则 |
| outbound | 3 个候选名称 | 明确保持 blocked，不伪造 publisher/outbox/transport |
| 上游边界 | source class 和 owner matrix 已在 Step 07 | 协议字段逐类保留 canonical、projection、artifact、observability 区分；未闭合合同继续 blocker |

### 10.6 Step 08 完成门禁与停审

| 门禁 | 结果 |
|---|---|
| 协议总表 | pass：3 Command、5 Query、5 Consumer、17 Job、3 blocked candidates |
| 独立协议小节 | pass：每个 Command/Query/Consumer/Job 均有独立小节或独立 DTO/处理边界；J12 placement/lifecycle 分支显式互斥 |
| Rust DTO 字段级 schema | pass_with_pending：本地字段、来源和 mapping 已写；外部 wire/provider schema 未闭合处保持 logical/pending |
| envelope/payload 分离 | pass |
| result/receipt/report 完整 outcome | pass：accepted、duplicate、rejected/quarantined、delayed、no-op、partial、blocked、unknown、commit-unknown 等已覆盖 |
| enum/ref/value 唯一归属 | pass_with_mapping：contracts shared 与 domain mapping 规则明确；未复制 owner truth |
| DTO → domain/port/flow | pass_with_upstream_blockers：本地 exact read/port 入口可回指，source/receiver/provider 合同继续 pending |
| transport route/topic/RPC | logical/pending；不私造 provider 或部署选择 |
| formal fill | 未允许；正式 `03-详细设计.md` 仍不得修改 |

Step 08 状态：`completed / pass_with_upstream_blockers / stop_review`。下一步为 Step 09，但必须等待用户新的明确授权；本 Step 不自动进入 Step 09。
