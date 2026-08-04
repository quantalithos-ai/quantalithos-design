# L4-observability 03-详细设计 Step 06 - R06.8-A application input assembly 契约

## 1. 子批次状态与边界

| 项 | 当前结论 |
|---|---|
| 正式文档 | `projects/L4-observability/03-详细设计.md`，本批不修改 |
| 当前 Step | Step 06，逐模块定义对象实现契约 |
| 修复子批次 | `R06.8-A` |
| 状态 | `done_design_only_consumed_by_R06.8-B` |
| 唯一目标 | 关闭 `R06-F1-AFFECT-07-01` 的 Step 06 definition gap：为 16 Command、14 Query、9 Consumer、9 Job 建立 application-owned、有限具名、可直接返回 concrete `*Input` 的 assembly seam |
| 本批不做 | 不修改冻结 Step 07~19、正式 `03`、任何 `04` 文档或实现代码；不执行测试；不生成 commit、run、evidence、签署、implementation ledger 或 boundary skeleton |
| 外部上游 blocker | `none` |

本文件是 48 个 application service input 的 Step 06 schema owner。冻结 Step 08 的 DTO 和 Step 07 的 service method 只提供 use-site；若其字段、旧类型或裸 context-factory 接缝与本文件冲突，后续 affected review 必须以本文件为准。

## 2. 输入与权威顺序

| 顺序 | 输入 | 本批消费方式 |
|---:|---|---|
| 1 | current 正式 `00/01/02` | 固定 Observability 只组装 observation-side input，不取得 source/business truth 写权 |
| 2 | `03_ddd_step_06_application_operation_context_idempotency.md` §§6.2.1、7、8 | 固定 48 operation、Consumer secondary identity 和四 family context matrix |
| 3 | `03_ddd_step_06_application_digest_canonicalizer.md` §§7.5、7.10~7.13、7.26、7.32 | 固定 exact material、profile-aware candidates、supplied digest verification 和 raw-hash 禁令 |
| 4 | R06.6 job、report/error/service、record-UoW 专项 | 固定 service input use、`ApplicationError`、`JobRunId`、plan/config、truth/UoW 边界 |
| 5 | R06.7-C/D/E | 固定 C-03/C-07 trusted entry carrier、single publication Job 和 least-authority assignment 需求 |
| 6 | 冻结 Step 07/08/09/13/14 | 只反查方法名、DTO 字段和 affected use；不反向拥有本节 schema |

### 2.1 已隔离的历史冲突

| 冻结/历史写法 | current replacement | 处理 |
|---|---|---|
| entry 取得裸 `ObservationOperationContextFactory` 并自行提供 digest | 三个 application input assembler 内部组合 typed material、canonicalizer 和 context factory | historical/affected；禁止落码 |
| `ObservationJobMetadata.job_execution_ref: JobExecutionRef` | `job_run_id: core_contracts::metadata::JobRunId` | affected；不是 local `ObservationJobExecutionRef`，也不是真实 external run id |
| `ReferenceSnapshotRef` | `ReferenceSnapshotStateRef` | historical alias 无 current encoder；所有 request/input/use 必须替换 |
| `PeripheralConsumerScopeRef` | `PeripheralConsumerRef + ObservationProjectionScope` | 无 owner 的历史 wrapper 删除；不得恢复 alias |
| worker cadence/limit 合成 publication input | 完整 `PublishObservationOutbox` Job request | historical execution mode；R06.8-B 删除 |

## 3. 缺口诊断与设计裁定

R06.6-F1 已经逐 operation 固定 digest material，但此前没有独立 owner 把“validated typed request -> material -> digest/candidates -> context -> concrete service input”闭合。冻结 Step 08 只在少数 Query 行写出 `*Input` 字段，Step 07 又把 context factory直接给 entry；实现者仍可选择 endpoint-local hash、先建 context 后补字段、只传 current digest 或在 Consumer/Job 中另建算法。

本批裁定如下：

1. 唯一 concrete input owner 是 `application::inputs`；48 个 `*Input` 均为具名、字段私有、不可 public struct literal 的 move carrier。
2. 唯一 assembly owner 是 `application::input_assembly`；它公开三个最小权限 trait facet，共 48 个有限具名方法，不公开 generic `assemble<T>`、material registry、raw writer 或 hash API。
3. `ObservationInputAssemblerImpl` 是唯一 concrete implementation，并在内部组合一个 `ObservationDigestCanonicalizer` 与一个 `ObservationOperationContextFactory`。二者均为 application-private helper，不再直接注入 api/worker/jobs。
4. Command、Consumer、Job input 均保留完整 `RequestDigestCandidates` 供 atomic admission；context 只保存其 write candidate。Query 只保存 current write-profile digest，不创建 candidates。
5. assembler 不读取 repository、resolver、UoW、current config、adapter、clock或业务 truth；它只消费已经完成协议/边界校验的 typed values。
6. 48 个方法任一失败都发生在 reservation/UoW/plan/claim/outbox/external effect 前，且不返回 partial context、partial input 或 candidates。

## 4. Module 与 visibility 契约

```text
contracts typed request / envelope / metadata
                 |
                 v
application::input_assembly
  exact route/body validation
  -> exact typed material
  -> digest/candidates
  -> supplied digest check where present
  -> private context factory
  -> application::inputs concrete *Input
                 |
                 v
application service facade
```

```rust
/// Application-private, stateless constructor for complete operation contexts.
pub(crate) struct ObservationOperationContextFactory {
    _private: (),
}

/// Sole implementation of the three finite input-assembly facets.
pub(crate) struct ObservationInputAssemblerImpl {
    canonicalizer: ObservationDigestCanonicalizer,
    context_factory: ObservationOperationContextFactory,
}

// The three complete public trait declarations are defined once in §6.
```

`ObservationOperationContextFactory` is a concrete sized helper owned by
`application::context`, not a trait, port, trait object or injectable entry
capability. Its complete callable surface is:

```rust
impl ObservationOperationContextFactory {
    pub(crate) const fn new() -> Self;

    pub(crate) fn for_command(
        &self,
        operation: ObservationCommandOperation,
        actor_ref: ActorSafeRef,
        idempotency_key: IdempotencyKey,
        request_digest: &RequestDigest,
        trace_ref: Option<TraceCorrelationRef>,
    ) -> Result<ObservationOperationContext, ApplicationError>;

    pub(crate) fn for_query(
        &self,
        operation: ObservationQueryOperation,
        actor_ref: ActorSafeRef,
        request_digest: RequestDigest,
        trace_ref: Option<TraceCorrelationRef>,
    ) -> Result<ObservationOperationContext, ApplicationError>;

    pub(crate) fn for_inbound_event(
        &self,
        event_identity: ObservationInboundEventIdentity,
        actor_ref: ActorSafeRef,
        dedup_key: IdempotencyKey,
        request_digest: &RequestDigest,
        trace_ref: Option<TraceCorrelationRef>,
    ) -> Result<ObservationOperationContext, ApplicationError>;

    pub(crate) fn for_job(
        &self,
        operation: ObservationJobOperation,
        actor_ref: ActorSafeRef,
        idempotency_key: IdempotencyKey,
        request_digest: &RequestDigest,
        trace_ref: Option<TraceCorrelationRef>,
    ) -> Result<ObservationOperationContext, ApplicationError>;
}
```

For writer lanes, the borrowed digest must be exactly
`request_digest_candidates.write_digest()`. `RequestDigest` has a deliberate
redaction-safe `Clone` implementation for this ownership split: the helper
clones that already validated typed carrier into the context while the input
retains the complete candidates. It does not re-encode material, recompute a
digest, select a different candidate or retain a second candidate collection.
Query transfers the sole digest returned by `digest_request`. Every method
rechecks the family matrix
and returns an error without a partial context. This concrete-helper decision
supersedes the earlier R06.6-A statement that Step 07 would expose an
`ObservationOperationContextFactory` trait; Step 07 may expose only the three
assembler facets below.

| subject | visibility / owner | allowed use | forbidden exposure |
|---|---|---|---|
| 48 concrete `*Input` | `pub` type in `application::inputs`，private fields | assembler returns；matching service method consumes | public literal、serde/wire schema、entry mutation、cross-family conversion |
| three assembler traits | `pub` in `application::input_assembly` | matching least-authority entry assignment only | repository/adapter access、generic dispatch、downcast |
| `ObservationInputAssemblerImpl` | `pub(crate)` | runtime builder constructs once and exposes three trait facets | concrete getter、replacement after assembly |
| `ObservationDigestCanonicalizer` | `pub(crate)` | assembler and durable-material owners | entry access、raw bytes/json/debug hashing |
| `ObservationOperationContextFactory` | `pub(crate)` concrete helper | assembler only | Step 07 public port、entry bundle、independent runtime accessor |
| `RequestDigestCandidates` | `pub` opaque type；fields / constructor / generation remain `application::digest` private | private field of write-lane inputs and value parameter of the application-owned atomic repository port implemented by the separate infra crate | caller construction、protocol field、persistence、serde、log/metric/trace、query input |

The three trait facets may be backed by the same immutable `Arc<ObservationInputAssemblerImpl>`, but each entry assignment receives only its trait view. Pointer sharing does not grant another facet or expose the concrete implementation.

## 5. Exact assembly algorithm

### 5.1 Common order

| stage | exact action | failure / no-side-effect rule |
|---:|---|---|
| 1 | Exact named method fixes operation family and variant；verify wrapper name/static route when the wrapper carries a name | mismatch -> `ApplicationError::InvalidRequest`；no payload fallback |
| 2 | Validate trusted metadata and family matrix：actor、trace、key、visibility/consistency、producer/schema/source-version or `JobRunId` as applicable | missing/incompatible -> exact existing input/application error；no context |
| 3 | Validate body selector cardinality、bounds、canonical set uniqueness and current typed refs | old alias、unknown field、raw body、invalid pair -> reject before digest |
| 4 | Construct the sealed operation-specific material projection with the exact F1 field order | projection is local and cannot escape；no serde/debug material |
| 5 | Query calls `digest_request` once；Command/Consumer/Job call `request_candidates` once | encoding/profile failure preserves exact `ApplicationError` |
| 6 | Command verifies supplied request digest against the write candidate；other families have no caller-selected digest in current wrappers | mismatch/profile error -> no reserve/UoW；caller value is never adopted |
| 7 | Consumer constructs `ObservationInboundEventIdentity` from fixed operation + authenticated producer + source event ref | producer/operation/source mismatch -> no reservation alias |
| 8 | Private factory builds one complete family-correct `ObservationOperationContext` using the already computed digest | no attach/setter/after-build mutation |
| 9 | Construct the matching concrete `*Input` atomically from context、control fields and operation fields | no partial input、no cross-operation constructor |

### 5.2 Family control fields

The following fields are physically present in every concrete struct of the stated family. They are not an embedded generic `CommandInput<T>` / `QueryInput<T>` / `ConsumerInput<T>` / `JobInput<T>` substitute; each row in §§7~10 is a distinct Rust type and factory result.

| family | fields physically repeated in every concrete input | source / invariant |
|---|---|---|
| Command | `context: ObservationOperationContext`;`request_digest_candidates: RequestDigestCandidates`;`requested_at: ObservedAt` | context write digest equals candidates.write_digest；requested time comes from trusted command metadata and is excluded from digest |
| Query | `context: ObservationOperationContext`;`visibility_scope_ref: VisibilityScopeRef`;`consistency: ObservationConsistencyHint`;`requested_at: ObservedAt` | context has no idempotency key/event identity；no candidates and no writer capability |
| Consumer | `context: ObservationOperationContext`;`request_digest_candidates: RequestDigestCandidates`;`source_ref: ObservationSourceRef`;`source_version_ref: Option<ObservationSourceVersionRef>`;`schema_version: SchemaVersion`;`occurred_at: ObservedAt` | context event identity matches operation/producer/source event；occurred_at never orders source versions |
| Job | `context: ObservationOperationContext`;`request_digest_candidates: RequestDigestCandidates`;`job_run_id: JobRunId`;`requested_at: ObservedAt` | `JobRunId` is public correlation only；local execution/plan/report refs are generated after admission；neither time nor run correlation enters request digest |

### 5.3 Construction and access rules

- Every concrete input has one `pub(crate) fn from_assembled(...) -> Result<Self, ApplicationError>` callable only by `application::input_assembly`. It receives all family fields and all row-specific fields in one call.
- The constructor rechecks `context.operation_name()` against its exact operation and, for writer lanes, `context.request_digest() == request_digest_candidates.write_digest()`.
- Services consume the input by value and inspect fields through crate-private borrows or destructuring. Entry code has no field getter that permits rewriting, extracting candidates, or changing context.
- No concrete input implements `Default`, wire `Serialize/Deserialize`, cross-operation `From/Into`, `Clone` solely to retry, or conversion back to a public request.
- A service may persist only the existing durable objects selected by its flow. The input itself is process-local and never becomes truth, evidence, report, plan, outbox payload or audit record.

## 6. Exact public assembler signatures

Each method is synchronous and pure with respect to I/O. Public request types
below mean the current contracts DTO after the registered affected
corrections; malformed wire decoding remains a protocol-layer responsibility
before these methods. These 48 signatures, not the frozen Step 07/08
representative snippets, are the complete public trait surfaces.

### 6.1 API facet: sixteen Commands and fourteen Queries

```rust
pub trait ObservationApiInputAssembler: Send + Sync {
    fn submit_observation_material(
        &self,
        request: ObservationCommandRequest<SubmitObservationMaterialRequest>,
    ) -> Result<SubmitObservationMaterialInput, ApplicationError>;
    fn record_safety_disposition(
        &self,
        request: ObservationCommandRequest<RecordSafetyDispositionRequest>,
    ) -> Result<RecordSafetyDispositionInput, ApplicationError>;
    fn bind_correlation_context(
        &self,
        request: ObservationCommandRequest<BindCorrelationContextRequest>,
    ) -> Result<BindCorrelationContextInput, ApplicationError>;
    fn record_safe_signal(
        &self,
        request: ObservationCommandRequest<RecordSafeSignalRequest>,
    ) -> Result<RecordSafeSignalInput, ApplicationError>;
    fn append_audit_projection(
        &self,
        request: ObservationCommandRequest<AppendAuditProjectionRequest>,
    ) -> Result<AppendAuditProjectionInput, ApplicationError>;
    fn link_body_free_evidence(
        &self,
        request: ObservationCommandRequest<LinkBodyFreeEvidenceRequest>,
    ) -> Result<LinkBodyFreeEvidenceInput, ApplicationError>;
    fn prepare_report_handoff(
        &self,
        request: ObservationCommandRequest<PrepareReportHandoffRequest>,
    ) -> Result<PrepareReportHandoffInput, ApplicationError>;
    fn evaluate_authenticity_hint(
        &self,
        request: ObservationCommandRequest<EvaluateAuthenticityHintRequest>,
    ) -> Result<EvaluateAuthenticityHintInput, ApplicationError>;
    fn set_retention_marker(
        &self,
        request: ObservationCommandRequest<SetRetentionMarkerRequest>,
    ) -> Result<SetRetentionMarkerInput, ApplicationError>;
    fn protect_active_reference(
        &self,
        request: ObservationCommandRequest<ProtectActiveReferenceRequest>,
    ) -> Result<ProtectActiveReferenceInput, ApplicationError>;
    fn define_replay_scope(
        &self,
        request: ObservationCommandRequest<DefineReplayScopeRequest>,
    ) -> Result<DefineReplayScopeInput, ApplicationError>;
    fn record_no_write_violation(
        &self,
        request: ObservationCommandRequest<RecordNoWriteViolationRequest>,
    ) -> Result<RecordNoWriteViolationInput, ApplicationError>;
    fn record_gap_state(
        &self,
        request: ObservationCommandRequest<RecordGapStateRequest>,
    ) -> Result<RecordGapStateInput, ApplicationError>;
    fn prepare_external_audit_export(
        &self,
        request: ObservationCommandRequest<PrepareExternalAuditExportRequest>,
    ) -> Result<PrepareExternalAuditExportInput, ApplicationError>;
    fn register_reference_snapshot(
        &self,
        request: ObservationCommandRequest<RegisterReferenceSnapshotRequest>,
    ) -> Result<RegisterReferenceSnapshotInput, ApplicationError>;
    fn update_reference_snapshot_state(
        &self,
        request: ObservationCommandRequest<UpdateReferenceSnapshotStateRequest>,
    ) -> Result<UpdateReferenceSnapshotStateInput, ApplicationError>;

    fn get_observation_receipt(
        &self,
        request: ObservationQueryRequest<GetObservationReceiptRequest>,
    ) -> Result<GetObservationReceiptInput, ApplicationError>;
    fn get_intake_status(
        &self,
        request: ObservationQueryRequest<GetIntakeStatusRequest>,
    ) -> Result<GetIntakeStatusInput, ApplicationError>;
    fn get_safe_signal(
        &self,
        request: ObservationQueryRequest<GetSafeSignalRequest>,
    ) -> Result<GetSafeSignalInput, ApplicationError>;
    fn get_signal_rollup(
        &self,
        request: ObservationQueryRequest<GetSignalRollupRequest>,
    ) -> Result<GetSignalRollupInput, ApplicationError>;
    fn get_audit_timeline(
        &self,
        request: ObservationQueryRequest<GetAuditTimelineRequest>,
    ) -> Result<GetAuditTimelineInput, ApplicationError>;
    fn get_evidence_index_input(
        &self,
        request: ObservationQueryRequest<GetEvidenceIndexInputRequest>,
    ) -> Result<GetEvidenceIndexInputInput, ApplicationError>;
    fn get_report_handoff(
        &self,
        request: ObservationQueryRequest<GetReportHandoffRequest>,
    ) -> Result<GetReportHandoffInput, ApplicationError>;
    fn get_retention_protection(
        &self,
        request: ObservationQueryRequest<GetRetentionProtectionRequest>,
    ) -> Result<GetRetentionProtectionInput, ApplicationError>;
    fn get_observation_read_model(
        &self,
        request: ObservationQueryRequest<GetObservationReadModelRequest>,
    ) -> Result<GetObservationReadModelInput, ApplicationError>;
    fn get_diagnostic_view(
        &self,
        request: ObservationQueryRequest<GetDiagnosticViewRequest>,
    ) -> Result<GetDiagnosticViewInput, ApplicationError>;
    fn get_gap_status(
        &self,
        request: ObservationQueryRequest<GetGapStatusRequest>,
    ) -> Result<GetGapStatusInput, ApplicationError>;
    fn get_peripheral_export_view(
        &self,
        request: ObservationQueryRequest<GetPeripheralExportViewRequest>,
    ) -> Result<GetPeripheralExportViewInput, ApplicationError>;
    fn get_reference_snapshot_view(
        &self,
        request: ObservationQueryRequest<GetReferenceSnapshotViewRequest>,
    ) -> Result<GetReferenceSnapshotViewInput, ApplicationError>;
    fn get_rebuild_progress(
        &self,
        request: ObservationQueryRequest<GetRebuildProgressRequest>,
    ) -> Result<GetRebuildProgressInput, ApplicationError>;
}
```

### 6.2 Inbound facet: nine Consumers

`actor_ref` in every signature is the trusted C-03 delivery projection. It is
not decoded from the payload or transport peer.

```rust
pub trait ObservationInboundInputAssembler: Send + Sync {
    fn consume_bus_observation_material(
        &self,
        actor_ref: ActorSafeRef,
        envelope: ObservationInboundEventEnvelope<BusObservationMaterialPayload>,
    ) -> Result<ConsumeBusObservationMaterialInput, ApplicationError>;
    fn consume_source_audit_material(
        &self,
        actor_ref: ActorSafeRef,
        envelope: ObservationInboundEventEnvelope<SourceAuditMaterialPayload>,
    ) -> Result<ConsumeSourceAuditMaterialInput, ApplicationError>;
    fn consume_identity_observation_context(
        &self,
        actor_ref: ActorSafeRef,
        envelope: ObservationInboundEventEnvelope<IdentityObservationContextPayload>,
    ) -> Result<ConsumeIdentityObservationContextInput, ApplicationError>;
    fn consume_governance_audit_context(
        &self,
        actor_ref: ActorSafeRef,
        envelope: ObservationInboundEventEnvelope<GovernanceAuditContextPayload>,
    ) -> Result<ConsumeGovernanceAuditContextInput, ApplicationError>;
    fn consume_artifact_evidence_context(
        &self,
        actor_ref: ActorSafeRef,
        envelope: ObservationInboundEventEnvelope<ArtifactEvidenceContextPayload>,
    ) -> Result<ConsumeArtifactEvidenceContextInput, ApplicationError>;
    fn consume_runtime_signal_summary(
        &self,
        actor_ref: ActorSafeRef,
        envelope: ObservationInboundEventEnvelope<RuntimeSignalSummaryPayload>,
    ) -> Result<ConsumeRuntimeSignalSummaryInput, ApplicationError>;
    fn consume_sandbox_signal_summary(
        &self,
        actor_ref: ActorSafeRef,
        envelope: ObservationInboundEventEnvelope<SandboxSignalSummaryPayload>,
    ) -> Result<ConsumeSandboxSignalSummaryInput, ApplicationError>;
    fn consume_archive_handoff_feedback(
        &self,
        actor_ref: ActorSafeRef,
        envelope: ObservationInboundEventEnvelope<ArchiveHandoffFeedbackPayload>,
    ) -> Result<ConsumeArchiveHandoffFeedbackInput, ApplicationError>;
    fn consume_report_consumer_feedback(
        &self,
        actor_ref: ActorSafeRef,
        envelope: ObservationInboundEventEnvelope<ReportConsumerFeedbackPayload>,
    ) -> Result<ConsumeReportConsumerFeedbackInput, ApplicationError>;
}
```

### 6.3 Job facet: nine complete Operations Jobs

`ObservationJobMetadata` in every request uses `JobRunId` after the registered
Step 08 affected repair.

```rust
pub trait ObservationJobInputAssembler: Send + Sync {
    fn publish_observation_outbox(
        &self,
        request: ObservationJobRequest<PublishObservationOutboxJobInput>,
    ) -> Result<PublishObservationOutboxInput, ApplicationError>;
    fn rebuild_observation_read_models(
        &self,
        request: ObservationJobRequest<RebuildObservationReadModelsJobInput>,
    ) -> Result<RebuildObservationReadModelsInput, ApplicationError>;
    fn rebuild_signal_rollups(
        &self,
        request: ObservationJobRequest<RebuildSignalRollupsJobInput>,
    ) -> Result<RebuildSignalRollupsInput, ApplicationError>;
    fn refresh_reference_snapshots(
        &self,
        request: ObservationJobRequest<RefreshReferenceSnapshotsJobInput>,
    ) -> Result<RefreshReferenceSnapshotsInput, ApplicationError>;
    fn scan_observation_gaps(
        &self,
        request: ObservationJobRequest<ScanObservationGapsJobInput>,
    ) -> Result<ScanObservationGapsInput, ApplicationError>;
    fn coordinate_observation_replay(
        &self,
        request: ObservationJobRequest<CoordinateObservationReplayJobInput>,
    ) -> Result<CoordinateObservationReplayInput, ApplicationError>;
    fn prepare_report_handoff_delivery(
        &self,
        request: ObservationJobRequest<PrepareReportHandoffDeliveryJobInput>,
    ) -> Result<PrepareReportHandoffDeliveryInput, ApplicationError>;
    fn prepare_external_audit_export_delivery(
        &self,
        request: ObservationJobRequest<PrepareExternalAuditExportJobInput>,
    ) -> Result<PrepareExternalAuditExportDeliveryInput, ApplicationError>;
    fn rebuild_peripheral_views(
        &self,
        request: ObservationJobRequest<RebuildPeripheralViewsJobInput>,
    ) -> Result<RebuildPeripheralViewsInput, ApplicationError>;
}
```

No facet exposes `assemble(operation, value)`、`digest(material)`、`context_factory()`、`canonicalizer()`、`register(name, mapper)` or a type-erased request method.

## 7. Sixteen Command input contracts

All rows include the three Command control fields from §5.2. The `factory method` column is also the only public construction path; `body fields` are copied losslessly from the validated concrete request after nested/current-type checks.

| concrete input / operation | exact body fields and types | factory method | required validation / forbidden substitution |
|---|---|---|---|
| `SubmitObservationMaterialInput` / `SubmitObservationMaterial` | `source_ref: ObservationSourceRef`;`source_family: SourceFamilyKind`;`submission_purpose: SubmissionPurpose`;`safe_summary_ref: Option<SafeSummaryRef>`;`redaction_marker: Option<RedactionMarker>` | `ObservationApiInputAssembler::submit_observation_material` | source is body-free；summary/marker are independent Options；no source body/path hash |
| `RecordSafetyDispositionInput` / `RecordSafetyDisposition` | `receipt_ref: ObservationReceiptRef`;`disposition_state: SafetyDispositionState`;`redaction_marker: RedactionMarker`;`sanitized_summary_ref: Option<SafeSummaryRef>`;`quarantine_reason: Option<QuarantineReason>` | `record_safety_disposition` | marker is not summary/reason；illegal state combination rejects before digest |
| `BindCorrelationContextInput` / `BindCorrelationContext` | `receipt_ref: ObservationReceiptRef`;`trace_ref: Option<TraceCorrelationRef>`;`causation_ref: Option<CausationRef>`;`source_ref: ObservationSourceRef`;`correlation_seed: Option<CorrelationSeed>` | `bind_correlation_context` | body trace is semantic and distinct from metadata trace；no business causation inference |
| `RecordSafeSignalInput` / `RecordSafeSignal` | `correlation_context_ref: CorrelationContextRef`;`signal_kind: SafeSignalKind`;`summary_ref: SafeSignalSummaryRef`;`runtime_signal_ref: Option<RuntimeSandboxSignalRef>`;`rollup_window_ref: Option<SignalRollupWindowRef>` | `record_safe_signal` | no raw log/metric/trace or resolver response；two Options remain independent |
| `AppendAuditProjectionInput` / `AppendAuditProjection` | `subject_ref: AuditSubjectRef`;`correlation_context_ref: CorrelationContextRef`;`source_audit_ref: SourceAuditRef`;`audit_action_summary_ref: SafeSummaryRef`;`visibility: Option<VisibilitySurface>` | `append_audit_projection` | nested visibility must satisfy its owner invariants；no source audit body |
| `LinkBodyFreeEvidenceInput` / `LinkBodyFreeEvidence` | `projection_ref: AuditProjectionRef`;`boundary_ref: GovernanceArtifactEvidenceReference`;`digest_summary: DigestSummary`;`evidence_purpose: EvidenceConsumerPurpose` | `link_body_free_evidence` | nested digest is semantic linkage input, not this request digest；no evidence body/alias mint |
| `PrepareReportHandoffInput` / `PrepareReportHandoff` | `handoff_scope_ref: ReportHandoffScopeRef`;`evidence_index_input: EvidenceIndexInputView`;`consumer_ref: ReportConsumerRef`;`visibility: Option<VisibilitySurface>` | `prepare_report_handoff` | immutable evidence input is validated as supplied；assembler cannot query current evidence to rebuild it |
| `EvaluateAuthenticityHintInput` / `EvaluateAuthenticityHint` | `handoff_ref: ReportHandoffRecordRef`;`evidence_index_input_ref: EvidenceIndexInputViewRef`;`gap_refs: Vec<GapStateRef>`;`evidence_origin: EvidenceOriginKind` | `evaluate_authenticity_hint` | gap refs canonical sorted/unique；origin is a finite hint, never verdict/authenticity truth |
| `SetRetentionMarkerInput` / `SetRetentionMarker` | `protected_ref: ProtectedObservationRef`;`retention_purpose: RetentionPurpose`;`hold_reason: Option<RetentionHoldReason>`;`release_reason: Option<RetentionReleaseReason>` | `set_retention_marker` | invalid simultaneous hold/release intent rejects；no cleanup/delete authority |
| `ProtectActiveReferenceInput` / `ProtectActiveReference` | `protected_ref: ProtectedObservationRef`;`consumer_ref: ObservationConsumerRef`;`protection_reason: ActiveReferenceReason` | `protect_active_reference` | consumer is typed boundary, not source/business truth owner |
| `DefineReplayScopeInput` / `DefineReplayScope` | `target_refs: ReplayTargetRefSet`;`allowed_effect: ReplayAllowedEffect`;`boundary_constraint_ref: NoWriteTriggerContextRef`;`replay_purpose: ReplayPurpose` | `define_replay_scope` | target set nonempty/canonical and source repair forbidden；does not fabricate H13 input |
| `RecordNoWriteViolationInput` / `RecordNoWriteViolation` | `trigger_context_ref: NoWriteTriggerContextRef`;`attempted_write_target: ForbiddenWriteTargetRef`;`violation_reason: NoWriteViolationReason` | `record_no_write_violation` | no attempted body/payload/adapter message；input records and blocks, never performs the write |
| `RecordGapStateInput` / `RecordGapState` | `source_ref: GapSourceRef`;`gap_kind: GapKind`;`degraded_reason: Option<DegradedReason>`;`limited_consumption_allowed: bool` | `record_gap_state` | false, absent reason and blocked are distinct；no default-success synthesis |
| `PrepareExternalAuditExportInput` / `PrepareExternalAuditExport` | `export_scope_ref: ExternalAuditExportScopeRef`;`consumer_ref: PeripheralConsumerRef`;`export_view_ref: DashboardAlertExportViewRef`;`visibility: VisibilitySurface` | `prepare_external_audit_export` | no endpoint/credential/product/provider body；preparation is not external audit truth |
| `RegisterReferenceSnapshotInput` / `RegisterReferenceSnapshot` | `subject_ref: ReferenceSubjectRef`;`safe_summary_ref: Option<SafeExternalSummaryRef>`;`freshness: ReferenceFreshnessState`;`source_version_ref: Option<ObservationSourceVersionRef>` | `register_reference_snapshot` | summary/version independent；requested time cannot replace source version |
| `UpdateReferenceSnapshotStateInput` / `UpdateReferenceSnapshotState` | `snapshot_ref: ReferenceSnapshotStateRef`;`state: ReferenceSnapshotStateKind`;`safe_summary_ref: Option<SafeExternalSummaryRef>`;`reason_ref: ReasonRef`;`source_version_ref: Option<ObservationSourceVersionRef>` | `update_reference_snapshot_state` | only current state ref；historical `ReferenceSnapshotRef` has no constructor/encoder |

Command assembly additionally proves supplied `request_digest` equals the candidates write digest. The supplied value is discarded after verification; it is not a second field in the concrete input.

## 8. Fourteen Query input contracts

All rows include the four Query control fields from §5.2. Every method calls only `digest_request`, creates a Query context with no key/event identity, and returns an input that cannot enter reservation, stored-result, outbox, history, repair or rebuild writers.

| concrete input / operation | exact body fields and types | factory method | required validation / forbidden substitution |
|---|---|---|---|
| `GetObservationReceiptInput` / `GetObservationReceipt` | `receipt_ref: ObservationReceiptRef` | `ObservationApiInputAssembler::get_observation_receipt` | exact typed identity；no lookup by display/source body |
| `GetIntakeStatusInput` / `GetIntakeStatus` | `scope: IntakeStatusScope`;`page: ObservationPublicPageRequest` | `get_intake_status` | page limit bounded and cursor syntax checked before digest |
| `GetSafeSignalInput` / `GetSafeSignal` | `signal_ref: Option<SafeSignalRef>`;`correlation_context_ref: Option<CorrelationContextRef>`;`page: Option<ObservationPublicPageRequest>` | `get_safe_signal` | selector/page cardinality explicit；all absent cannot silently become global scan |
| `GetSignalRollupInput` / `GetSignalRollup` | `window_ref: Option<SignalRollupWindowRef>`;`scope: Option<SignalRollupScope>`;`page: ObservationPublicPageRequest` | `get_signal_rollup` | window-vs-scope rules checked；repository cursor/result excluded |
| `GetAuditTimelineInput` / `GetAuditTimeline` | `subject_ref: AuditSubjectRef`;`page: ObservationPublicPageRequest` | `get_audit_timeline` | subject remains body-free；visibility cannot be inferred from existence |
| `GetEvidenceIndexInputInput` / `GetEvidenceIndexInput` | `scope_ref: EvidenceIndexScopeRef`;`handoff_ref: Option<ReportHandoffRecordRef>` | `get_evidence_index_input` | preview remains read-only and is not persisted by Query |
| `GetReportHandoffInput` / `GetReportHandoff` | `handoff_ref: ReportHandoffRecordRef` | `get_report_handoff` | no delivery/final verdict side effect |
| `GetRetentionProtectionInput` / `GetRetentionProtection` | `protected_ref: ProtectedObservationRef` | `get_retention_protection` | no hold/release evaluation write or cleanup |
| `GetObservationReadModelInput` / `GetObservationReadModel` | `scope: ObservationProjectionScope`;`page: Option<ObservationPublicPageRequest>` | `get_observation_read_model` | structured scope only；does not create/rebuild a view |
| `GetDiagnosticViewInput` / `GetDiagnosticView` | `request_context_ref: DiagnosticRequestContextRef`;`scope: ObservationProjectionScope` | `get_diagnostic_view` | request context correlates only；lookup uses scope；visibility/consistency remain explicit common fields |
| `GetGapStatusInput` / `GetGapStatus` | `gap_ref: Option<GapStateRef>`;`source_ref: Option<GapSourceRef>`;`page: Option<ObservationPublicPageRequest>` | `get_gap_status` | selector combination total；missing never opens/closes a gap |
| `GetPeripheralExportViewInput` / `GetPeripheralExportView` | `consumer_ref: PeripheralConsumerRef`;`scope: ObservationProjectionScope` | `get_peripheral_export_view` | exact structured pair；no product route or `PeripheralConsumerScopeRef` |
| `GetReferenceSnapshotViewInput` / `GetReferenceSnapshotView` | `snapshot_ref: Option<ReferenceSnapshotStateRef>`;`subject_ref: Option<ReferenceSubjectRef>` | `get_reference_snapshot_view` | exact selector cardinality；historical snapshot alias rejected |
| `GetRebuildProgressInput` / `GetRebuildProgress` | `target_ref: MaintenanceTargetRef` | `get_rebuild_progress` | no synchronous rebuild, resume or current-config read |

## 9. Nine Inbound Consumer input contracts

All rows include the six Consumer control fields from §5.2. The exact method fixes the Consumer operation；`actor_ref` comes only from C-03 trusted delivery；envelope producer/schema/source/event/version fields are validated before payload materialization.

| concrete input / operation / producer | exact payload fields and types | factory method | required validation / forbidden substitution |
|---|---|---|---|
| `ConsumeBusObservationMaterialInput` / `ConsumeBusObservationMaterial` / `Bus` | `source_family: SourceFamilyKind`;`submission_purpose: SubmissionPurpose`;`safe_summary_ref: Option<SafeSummaryRef>`;`redaction_marker: Option<RedactionMarker>` | `ObservationInboundInputAssembler::consume_bus_observation_material` | source family allowlist exact；no raw event/body fallback |
| `ConsumeSourceAuditMaterialInput` / `ConsumeSourceAuditMaterial` / `SourceOwner` | `source_audit_ref: SourceAuditRef`;`subject_ref: AuditSubjectRef`;`correlation_context_ref: Option<CorrelationContextRef>`;`audit_action_summary_ref: SafeSummaryRef`;`source_family: SourceFamilyKind` | `consume_source_audit_material` | producer remains SourceOwner while payload family preserves actual allowed owner；no generic producer |
| `ConsumeIdentityObservationContextInput` / `ConsumeIdentityObservationContext` / `Identity` | `subject_ref: SubjectObservationReference`;`safe_summary_ref: Option<SafeExternalSummaryRef>`;`freshness: ReferenceFreshnessState` | `consume_identity_observation_context` | source family derives only from total static map；no identity profile body |
| `ConsumeGovernanceAuditContextInput` / `ConsumeGovernanceAuditContext` / `Governance` | `governance_evidence_ref: GovernanceArtifactEvidenceReference`;`digest_summary: DigestSummary`;`visibility: VisibilitySurface` | `consume_governance_audit_context` | governance ref/digest are body-free and not a Governance decision |
| `ConsumeArtifactEvidenceContextInput` / `ConsumeArtifactEvidenceContext` / `Artifact` | `artifact_evidence_ref: GovernanceArtifactEvidenceReference`;`digest_summary: DigestSummary`;`evidence_purpose: EvidenceConsumerPurpose`;`visibility: VisibilitySurface` | `consume_artifact_evidence_context` | no evidence body or real evidence alias fabrication |
| `ConsumeRuntimeSignalSummaryInput` / `ConsumeRuntimeSignalSummary` / `Runtime` | `runtime_signal_ref: RuntimeSandboxSignalRef`;`signal_summary_ref: SafeSignalSummaryRef`;`signal_kind: SafeSignalKind`;`correlation_context_ref: Option<CorrelationContextRef>` | `consume_runtime_signal_summary` | safe summary is not runtime execution truth；no raw telemetry |
| `ConsumeSandboxSignalSummaryInput` / `ConsumeSandboxSignalSummary` / `Sandbox` | `sandbox_signal_ref: RuntimeSandboxSignalRef`;`receipt_ref: Option<ObservationReceiptRef>`;`signal_summary_ref: SafeSignalSummaryRef`;`safety_state: Option<SafetyDispositionState>` | `consume_sandbox_signal_summary` | receipt/state independent；no sandbox truth mutation |
| `ConsumeArchiveHandoffFeedbackInput` / `ConsumeArchiveHandoffFeedback` / `Archive` | `archive_handoff_ref: ArchiveReportHandoffRef`;`handoff_ref: ReportHandoffRecordRef`;`delivery_result: HandoffDeliveryResult`;`feedback_summary_ref: Option<SafeSummaryRef>` | `consume_archive_handoff_feedback` | feedback is local observation input, not archive package truth or acceptance signoff |
| `ConsumeReportConsumerFeedbackInput` / `ConsumeReportConsumerFeedback` / `ReportConsumer` | `consumer_ref: PeripheralConsumerRef`;`delivery_ref: Option<PeripheralDeliveryRef>`;`delivery_result: PeripheralDeliveryResult`;`gap_kind: Option<GapKind>` | `consume_report_consumer_feedback` | structured consumer only；delivery/gap independent；no external consumer truth write |

For every row, `source_version_ref`, when present, must repeat the envelope producer/source exactly. Operation, producer, source, schema, source-version or payload drift under the same event/key yields the existing conflict/inconsistency path；it never creates a second event identity.

## 10. Nine Operations Job input contracts

All rows include the four Job control fields from §5.2. The corrected public metadata supplies `JobRunId`; assembler never generates local execution/plan/report/claim/fence identity. Request selectors are validated and canonicalized here, while resolved candidates and `JobExecutionConfigSnapshot` are frozen later by the Job service start flow.

### 10.1 `PeripheralViewRebuildTarget`

```rust
/// Application-private structured target for one peripheral view rebuild item.
pub(crate) struct PeripheralViewRebuildTarget {
    consumer_ref: PeripheralConsumerRef,
    projection_scope: ObservationProjectionScope,
}
```

| member | exact contract |
|---|---|
| factory | `pub(crate) fn try_new(consumer_ref: PeripheralConsumerRef, projection_scope: ObservationProjectionScope) -> Result<Self, ApplicationError>`；validate consumer/scope compatibility, no route/config lookup |
| accessors | crate-private borrows for consumer and scope；no conversion to a single opaque ref |
| canonical equality/order | compare canonical bytes of the complete consumer then complete scope；input collection sorted/unique by that pair |
| boundary | process-local input/material value；not public protocol identity、not durable target ID、not `PeripheralConsumerScopeRef` replacement alias |

The later Step 08 affected review must expose an equivalent two-field request item and map it through this factory. It must not expose this application-private value as a wire type.

### 10.2 Job registry

| concrete input / operation | exact operation-specific fields and types | factory method | required validation / forbidden substitution |
|---|---|---|---|
| `PublishObservationOutboxInput` / `PublishObservationOutbox` | `cursor: Option<OutboxCursor>`;`limit: PositiveLimit`;`event_filter: Vec<ObservationOutboundEventName>` | `ObservationJobInputAssembler::publish_observation_outbox` | limit validated before digest and later narrowed by plan hard bound；filter canonical set；no worker cadence/current-config synthesis |
| `RebuildObservationReadModelsInput` / `RebuildObservationReadModels` | `target_ref: MaintenanceTargetRef`;`scopes: Vec<ObservationProjectionScope>`;`replay_scope_ref: Option<ReplayScopeRef>`;`diagnostic_visibility_scope_ref: VisibilityScopeRef`;`source_cursor: Option<ObservationCursor>` | `rebuild_observation_read_models` | scopes nonempty/canonical and target-compatible；source cursor is request minimum, not row version |
| `RebuildSignalRollupsInput` / `RebuildSignalRollups` | `scope: SignalRollupScope`;`signal_cursor: Option<ObservationCursor>`;`window_refs: Vec<SignalRollupWindowRef>` | `rebuild_signal_rollups` | windows canonical set；empty expansion remains empty in request digest and is resolved only into plan |
| `RefreshReferenceSnapshotsInput` / `RefreshReferenceSnapshots` | `scope: ObservationReferenceRefreshScope`;`freshness_policy_ref: ReferenceFreshnessPolicyRef`;`snapshot_refs: Vec<ReferenceSnapshotStateRef>` | `refresh_reference_snapshots` | current state refs only；empty expansion freezes later；no `ReferenceSnapshotRef` |
| `ScanObservationGapsInput` / `ScanObservationGaps` | `scan_scope_ref: GapScanScopeRef`;`expected_source_refs: Vec<GapSourceRef>`;`visibility_scope_ref: VisibilityScopeRef` | `scan_observation_gaps` | expected refs canonical set；empty has explicit scope-only meaning；no source body scan material |
| `CoordinateObservationReplayInput` / `CoordinateObservationReplay` | `replay_scope_ref: ReplayScopeRef`;`target_ref: MaintenanceTargetRef`;`no_write_guard_ref: NoWriteTriggerContextRef` | `coordinate_observation_replay` | complete target-bound tuple；does not repair source or turn scope definition into H13 |
| `PrepareReportHandoffDeliveryInput` / `PrepareReportHandoffDelivery` | `handoff_scope_ref: ReportHandoffScopeRef`;`handoff_ref: ReportHandoffRecordRef`;`consumer_ref: ReportConsumerRef` | `prepare_report_handoff_delivery` | exact binding/material is frozen in plan/item；no final verdict/signoff |
| `PrepareExternalAuditExportDeliveryInput` / `PrepareExternalAuditExportDelivery` | `export_scope_ref: ExternalAuditExportScopeRef`;`consumer_ref: PeripheralConsumerRef`;`preparation_ref: ExternalAuditExportPreparationRef` | `prepare_external_audit_export_delivery` | public Job spelling maps statically to internal Delivery operation；no Command token collision or external audit truth |
| `RebuildPeripheralViewsInput` / `RebuildPeripheralViews` | `consumer_targets: Vec<PeripheralViewRebuildTarget>`;`source_cursor: Option<ObservationCursor>` | `rebuild_peripheral_views` | target set nonempty/canonical by complete pair；no `PeripheralConsumerScopeRef`, route, endpoint or product config |

Candidate limits come from the validated Job request, the current application runtime bound used to derive `JobConfigBinding::CandidateLimit`, and the compile-time hard plan cap. The effective value is frozen in `JobExecutionConfigSnapshot` and the immutable plan. Resume never reads worker config or current Job config to replace it.

## 11. Factory totality register

| facet | named methods | concrete input outputs | generic/default branch |
|---|---:|---:|---|
| `ObservationApiInputAssembler` Command | 16 | 16 | forbidden |
| `ObservationApiInputAssembler` Query | 14 | 14 | forbidden |
| `ObservationInboundInputAssembler` | 9 | 9 | forbidden |
| `ObservationJobInputAssembler` | 9 | 9 | forbidden |
| total | 48 | 48 | zero |

Every public operation discriminator from R06.6-A appears exactly once in this register. A build-time/static contract test must compare the operation enum sets with the method/input registry；missing, duplicate, unknown, alias or wildcard mapping fails.

## 12. Error and no-side-effect contract

| failure point | exact owner/class | required zero side effects |
|---|---|---|
| malformed wire/header/body | protocol decoder / existing `ProtocolError` before assembler | no assembler/service/reservation/UoW |
| route/body/family/selector/type mismatch after typed handoff | `ApplicationError::InvalidRequest` or exact existing schema/input variant | no digest candidates escape；no repository/resolver |
| unsupported accepted schema | `ApplicationError::UnsupportedSchemaVersion` | no payload fallback、reservation or marker |
| supplied digest profile/value mismatch | `SuppliedDigestProfileUnsupported` / `SuppliedDigestMismatch` | no reserve/UoW/domain/outbox/claim |
| material encoding failure | `DigestMaterialEncodingFailed` | no raw serde/debug fallback；no partial context/input |
| context/input invariant mismatch | existing application invariant/input error | no service call；implementation defect remains visible |

Assembler errors carry no raw bytes、expected/actual digest、key、body、locator、credential、provider detail or stack. The exact recovery/public mapping remains an affected Step 12 concern；R06.8 does not add a parallel error enum.

## 13. Planned verification cuts

| ID | planned check | status |
|---|---|---|
| `TC-OBS-R068A-REG-001` | 16/14/9/9 operation enum sets equal assembler method/output sets | `planned/not_run` |
| `TC-OBS-R068A-CMD-001` | each Command material mutation changes candidates；metadata trace/time/key exclusion and supplied digest checks | `planned/not_run` |
| `TC-OBS-R068A-QRY-001` | all Query inputs have zero candidates/reservation/UoW/writes | `planned/not_run` |
| `TC-OBS-R068A-CNS-001` | nine producer/operation/schema/source-version matrices and secondary identity exactness | `planned/not_run` |
| `TC-OBS-R068A-JOB-001` | nine complete Job inputs use `JobRunId`, current refs and structured peripheral targets | `planned/not_run` |
| `TC-OBS-R068A-DIG-001` | no public raw/generic hash or canonicalizer/context-factory accessor | `planned/not_run` |
| `TC-OBS-R068A-ERR-001` | every assembly failure has zero repository/resolver/UoW/service/external spies | `planned/not_run` |
| `TC-OBS-R068A-TYPE-001` | no `JobExecutionRef`、`ReferenceSnapshotRef`、`PeripheralConsumerScopeRef` in current input definitions | `planned/not_run` |

These are planned implementation/contract cuts only. No test, runtime result, run ID, evidence alias, signoff or acceptance result is claimed.

## 14. Affected handoff

| affected item | current R06.8-A decision | next owner |
|---|---|---|
| `R06-F1-AFFECT-07-01` | `resolved_at_step06_definition_by_R06.8-A`; three finite assembler facets and 48 concrete inputs now have exact owner/schema/order | Step 07 must replace naked context factory with exact assembler traits/signatures |
| Step 04 application layout | add `inputs.rs` and `input_assembly.rs`; keep `context.rs`/`digest.rs` private owner modules | later Step 04 affected review；R06.8-B records exact layout decision |
| Step 08 request metadata/types | Job metadata uses `JobRunId`; snapshot/peripheral affected types corrected；48 DTO-to-input maps required | affected per-protocol review |
| Step 09 admission flow | exact method -> assembler -> service；no endpoint/handler-local hash/context | affected per-flow review |
| Step 12 error mapping | consume existing application variants；no new assembler error family | affected recovery review |
| Step 13 idempotency | writer inputs pass full candidates to one atomic reserve；Query bypass | affected concurrency review |
| Step 14 runtime | construct one assembler implementation and expose three least-authority facets；no raw factory accessor | R06.8-B/C-13 then Step 14 affected review |

## 15. 子批次停审结论

R06.8-A 已以 design-only 方式关闭 48 个 application input 无独立 schema owner的内部缺口。`R06-F1-AFFECT-07-01` 在 Step 06 definition 层已解决，但冻结 Step 07/08/09/12/13/14 尚未传播，因此不能宣称实现就绪或正式 `03` 完成。

本文件由同一 Step 的 R06.8-B final gate 消费。不得从本结论自动进入 Step 07，也不得修改正式 `03`、任何 `04` 文档或实现代码。
