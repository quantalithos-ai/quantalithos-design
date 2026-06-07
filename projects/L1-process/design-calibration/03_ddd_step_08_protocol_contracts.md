# Step 8. 定义 API / Command / Query / Event / Job 协议契约

### 1. Step 状态

- 状态:[x] 已确认
- 对应 SOP:`standards/document/详细设计讨论流程_SOP.md` Step 8
- 回填章节:`03-详细设计.md` §7 API / Command / Query / Event / Job 协议契约;§6 全局对象 / Trait / API 索引

### 2. 本步输入

- 上一步中间产物:
  - `projects/L1-process/design-calibration/03_ddd_step_05_module_contracts.md`
  - `projects/L1-process/design-calibration/03_ddd_step_06_object_contracts.md`
  - `projects/L1-process/design-calibration/03_ddd_step_07_trait_port_adapter_contracts.md`
- 上游正式文档:
  - `projects/L1-process/01-架构设计.md`
  - `projects/L1-process/02-概要设计.md` §7 / §8 / §10 / §12
- 概要设计校准来源:
  - `projects/L1-process/design-calibration/02_hld_step_07_api_interface_skeleton.md`
  - `projects/L1-process/design-calibration/02_hld_step_08_processing_flows.md`
  - `projects/L1-process/design-calibration/02_hld_step_12_detailed_design_handoff.md`
- 规范输入:
  - `standards/document/详细设计书写规范.md` §5.7
  - `standards/document/设计真相源闭环与可落码性标准.md`

### 3. SOP 问题回答

1. 本轮需要定义哪些 API / Command / Query / Event / Job?

   回答:本 Step 定义 `02-概要设计.md` §7 中列出的 13 个 Command、11 个 Query、7 个 inbound consumer event、10 个 outbound event、7 个 operations job,以及它们共享的 context、metadata、receipt、page、visibility / degraded marker、envelope 和 error surface。

2. 每个协议的调用方、处理方、传输方式是什么?

   回答:Command / Query 通过 `api` 同步入口进入 application service。Inbound consumer 通过 `worker` 订阅 event bus。Outbound event 由 `worker` outbox publisher 发布。Operations job 由 `jobs` crate 的 runner 同步调用 application job service。传输名称在协议总表和各小节中给出。

3. 外部接口使用 HTTP、RPC、event bus 还是其他方式?

   回答:Command / Query 以 RPC 名称作为稳定协议锚点,不在本 Step 锁定具体 HTTP path。Inbound / outbound 使用 event bus topic 名称。Job 使用 operations runner 名称和 job DTO。后续 API transport 若采用 HTTP,必须 1:1 映射这些 DTO,不得新增字段真相源。

4. 请求、响应、事件或 job 输入输出 schema 是什么?

   回答:本 Step 以 Rust DTO 字段表为主,并提供最小 JSON 形状说明。所有 public DTO 归 `contracts` crate;共享 id/ref/reason/kind/state 归 `contracts/src/refs.rs`。

5. 每个输入契约会构造或影响哪些 Domain 对象?

   回答:每个协议小节给出 DTO 到 Domain 构造闭环表。Command 会构造或修改 Step 6 truth object、trace、outbox。Consumer 只影响 snapshot / reference / pending / stale marker。Job 只影响 outbox state、projection、snapshot、reconciliation report、handoff marker 或 recovery maintenance marker。

6. 目标对象的必填字段是否全部能从输入、派生、查表或系统生成中获得?

   回答:必填字段来源必须在字段映射表中声明。`*_id`、`result_ref`、`outbox_id`、`trace_id` 由 `IdGeneratorPort` 生成;`captured_at`、`occurred_at`、`published_at`、`completed_at` 由 `ClockPort` 或 event envelope 提供;truth ref 来自已保存对象。

7. 哪些字段名相近但语义不同,不得混同?

   回答:`id` / `ref` / `record_ref` / `payload_ref` / `truth_ref` / `result_ref` / `receipt_ref` 不得混同。`source_version_ref` 是外部来源版本,`expected_version` 是本仓 optimistic storage version。`trace_context` 是 core trace 关联,`ProcessTraceRecordRef` 是本仓 trace record 引用。

8. 字段缺失时是 reject、derive、lookup、retry、dead-letter 还是暂停处理?

   回答:Command 缺 actor、metadata、idempotency key 或必填 ref 时 reject。Consumer envelope 缺 event id、source、schema version、dedup key、occurred_at、trace context 时 quarantine。外部来源暂不可用时 retry / delayed。Query 缺 subject ref 时 reject;找不到 truth 返回 missing surface;不可见返回 not visible surface。

9. Query 的 response view、page、projection marker 是否有字段级 schema?

   回答:本 Step 定义 public `ProcessPageRequest`、`ProcessPageInfo`、`ProcessViewStatus`、`ProcessDegradedMarker`、`ProcessVisibilityMarker`、`ProjectionStatusMarker` 和各 view DTO 字段。

10. Query 的 empty、not visible、stale、failed、rebuilding、disabled、missing state 对外 surface 是什么?

   回答:所有 Query response 包含 `status: ProcessViewStatus` 和可选 `degraded_marker`、`visibility_marker`、`projection_marker`。empty page 使用 `items: []` 且 `status: Available`;not visible 使用 `status: NotVisible`;missing 使用 `status: Missing`;stale / failed / rebuilding / disabled 通过 `ProjectionStatusMarker` 暴露。

11. Query response 中 read model / projection / cursor 的 id/ref 如何生成,repository key 是什么?

   回答:view id/ref 由 projection builder 或 stable query builder 从 repository key 派生。repository key 在各 Query 小节中声明。page cursor 映射自 Step 7 `PageInfo.next_cursor`,public 字段为 `ProcessPageInfo.next_cursor`。

12. Query response 字段引用的 enum / ref 是否归属到 contracts shared,或是否写明 domain 到 view 的正式映射?

   回答:所有进入 public DTO 的 state enum 必须归 `contracts::refs`,domain 复用。若 Step 6 中为 domain-only 对象但进入 view,本 Step 将其上提为 public shared enum。

13. Query / repository 使用的 page helper 是否有 schema、归属和 public page DTO 映射?

   回答:Step 7 的 `PageRequest` / `PageInfo` 属 application helper。本 Step 定义 `ProcessPageRequest` / `ProcessPageInfo` 归 `contracts::queries`,并明确转换规则。

14. HLD `*Query`、DDD `*Request`、Rust DTO 名称是否存在收敛映射?

   回答:概要中的 `Get*` / `Search*` 映射为 Rust `Get*Request` / `Search*Request`。Command 名称映射为 `*Request`。Event 名称映射为 `*Event` payload + envelope。

15. Command result、event payload、consumer envelope / receipt、job report 中引用的 enum / ref / helper 是否都有 schema 和归属?

   回答:本 Step 的共享协议类型和协议小节必须全部给出字段级 schema。若仍出现只引用类型名未定义字段的情况,进入 Step 18 风险,不得进入实现。

16. Inbound consumer 的 envelope、receipt、duplicate、quarantine、delayed、no-op marker 是否有字段级 schema?

   回答:本 Step 定义 `InboundEventEnvelope<T>`、`ConsumerReceipt`、`ConsumerDisposition`、`QuarantineMarker`、`DelayedConsumerMarker`、`NoopConsumerMarker`。

17. 每个 command / event / job 的 actor 是 participant、system、integration 还是 trusted source actor?是否必须在 participant / visibility scope 中?

   回答:Command actor 来自 `ActorContext.actor_ref`,必须通过 policy / actor capability snapshot 校验。Consumer actor 为 `TrustedSourceActorRef`,只可用于 source isolation、snapshot / marker 写入,不得直接推进核心实例。Job actor 为 `SystemActorRef` 或 operator actor,只可维护派生 / outbox / handoff / recovery maintenance。

18. 如果存在 trusted source actor 例外,适用的 source kind、actor kind、入口协议和不可绕过的 gate 是否写清?

   回答:Consumer trusted source 例外只适用于 `InboundEventEnvelope.metadata.source_actor_ref` 且入口为本 Step 7 个 consumer event。它不绕过 schema version、digest、source isolation、forbidden body、dedup、state gate 或 projection boundary。

19. 每个协议失败时映射成什么错误?

   回答:Command / Query 返回 `ProcessApiError`;Consumer 返回 `ConsumerReceipt` disposition;Job 返回 `JobRunReceipt` 或 `JobError`;publisher / handoff 错误经 Step 7 port error 映射到 outbox / handoff marker。Step 12 再定义完整错误恢复矩阵。

20. 哪些协议需要幂等键或审计记录?

   回答:所有 Command 需要 `CommandMetadata.idempotency_key` 和 command receipt。所有 Consumer 需要 `InboundEventEnvelope.dedup_key`。所有 Job 需要 `JobMetadata.job_idempotency_key`。Query 不需要幂等键,但需要 `QueryMetadata.request_ref` 用于审计关联。

### 4. 当前文档问题诊断

| 位置 | 当前问题 | 本步处理 |
|---|---|---|
| `02-概要设计.md` §7 | 只定义输入 / 输出骨架,没有 DTO 字段表 | 本 Step 定义 request / result / view / event / job schema |
| Step 7 前向引用表 | command result、metadata、page、receipt、envelope 只有名字 | 本 Step 补正式字段级 schema |
| Query response | HLD 中只给返回类型名 | 本 Step 固定 view、page、status、degraded / visibility / projection marker |
| Consumer | 只有事件骨架 | 本 Step 固定 envelope、typed payload、receipt、quarantine / delayed / duplicate surface |
| Job | 只有 job 名称和报告语义 | 本 Step 固定 job request、scope、receipt、error surface |

### 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| Command | 名称 + 输入骨架 | `*Request` + `*CommandResult` + receipt + field mapping | 支撑 handler / service / duplicate replay |
| Query | 返回 view 名称 | request / response / view / marker / page schema | 支撑 contract tests |
| Inbound event | consumer 名称 | envelope + payload + receipt + source actor gate | 支撑 worker tests |
| Outbound event | event 名称 | envelope + payload + version / publisher input | 支撑 outbox publisher |
| Job | job 名称 | job DTO + scope + receipt + error | 支撑 jobs crate |

### 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| A. 每个协议重复写完整 context 字段 | 单协议自足 | 文档巨大且容易漂移 | 不采用 |
| B. 定义共享 context / metadata / receipt,具体协议复用 | 字段真相源集中 | 需要查共享章节 | 采用 |
| C. Query 缺 projection 时直接返回 error | 实现简单 | 不满足 stale / degraded 可见性 | 不采用 |
| D. Query response 固定 `ProcessViewStatus` + marker | 可测试、可观察 | DTO 稍重 | 采用 |
| E. Consumer payload 重复 envelope 字段 | 单 payload 自足 | 违反 envelope / payload 分层 | 不采用 |
| F. Consumer envelope 承载 event identity / dedup / source actor | 边界清楚 | payload 需要与 envelope 一起处理 | 采用 |

### 7. 结构化中间产物

#### 7.1 协议总表

| 名称 | 类别 | 调用方 / 发布方 | 处理方 / 订阅方 | 传输方式 | 是否需要处理流 |
|---|---|---|---|---|---|
| `SyncRuntimeProcessShape` | Command | API caller / system sync | `ProcessShapeCommandHandler -> ProcessShapeSyncService` | RPC `process.command.sync_runtime_process_shape` | 是 |
| `AdoptProcessProfile` | Command | API caller | `ProcessProfileCommandHandler -> ProcessProfileCommandService` | RPC `process.command.adopt_process_profile` | 是 |
| `UpdateProcessProfileTailoring` | Command | API caller | `ProcessProfileCommandHandler -> ProcessProfileCommandService` | RPC `process.command.update_process_profile_tailoring` | 是 |
| `StartProcessInstance` | Command | API caller | `ProcessInstanceCommandHandler -> ProcessInstanceCommandService` | RPC `process.command.start_process_instance` | 是 |
| `AdvanceProcessActivity` | Command | API caller | `ActivityCommandHandler -> ActivityProgressionService` | RPC `process.command.advance_process_activity` | 是 |
| `RecordActivityFeedback` | Command | API caller / runtime bridge | `ActivityCommandHandler -> ActivityProgressionService` | RPC `process.command.record_activity_feedback` | 是 |
| `OpenWaitingGate` | Command | API caller | `WaitingGateCommandHandler -> WaitingGateCoordinationService` | RPC `process.command.open_waiting_gate` | 是 |
| `ResumeWaitingGate` | Command | API caller | `WaitingGateCommandHandler -> WaitingGateCoordinationService` | RPC `process.command.resume_waiting_gate` | 是 |
| `CreateProcessCheckpoint` | Command | API caller / system checkpoint | `RecoveryCommandHandler -> ProcessRecoveryService` | RPC `process.command.create_process_checkpoint` | 是 |
| `StartRecoveryAttempt` | Command | API caller / operator | `RecoveryCommandHandler -> ProcessRecoveryService` | RPC `process.command.start_recovery_attempt` | 是 |
| `CompleteRecoveryAttempt` | Command | API caller / operator | `RecoveryCommandHandler -> ProcessRecoveryService` | RPC `process.command.complete_recovery_attempt` | 是 |
| `BindProcessTimebox` | Command | API caller / work integration | `RhythmCommandHandler -> ProcessRhythmService` | RPC `process.command.bind_process_timebox` | 是 |
| `UpdateProcessStageState` | Command | API caller | `RhythmCommandHandler -> ProcessRhythmService` | RPC `process.command.update_process_stage_state` | 是 |
| `GetRuntimeProcessShape` | Query | API caller | `ProcessQueryHandler -> AuthorizedProcessQueryService` | RPC `process.query.get_runtime_process_shape` | 是 |
| `GetProcessProfile` | Query | API caller | `ProcessQueryHandler -> AuthorizedProcessQueryService` | RPC `process.query.get_process_profile` | 是 |
| `GetProcessInstance` | Query | API caller | `ProcessQueryHandler -> AuthorizedProcessQueryService` | RPC `process.query.get_process_instance` | 是 |
| `GetActivityStatus` | Query | API caller | `ProcessQueryHandler -> AuthorizedProcessQueryService` | RPC `process.query.get_activity_status` | 是 |
| `GetWaitingGate` | Query | API caller | `ProcessQueryHandler -> AuthorizedProcessQueryService` | RPC `process.query.get_waiting_gate` | 是 |
| `GetRecoveryStatus` | Query | API caller | `ProcessQueryHandler -> AuthorizedProcessQueryService` | RPC `process.query.get_recovery_status` | 是 |
| `GetProcessTimeline` | Query | API caller | `ProcessQueryHandler -> AuthorizedProcessQueryService` | RPC `process.query.get_process_timeline` | 是 |
| `GetProcessProgressSummary` | Query | API caller | `ProcessQueryHandler -> AuthorizedProcessQueryService` | RPC `process.query.get_process_progress_summary` | 是 |
| `SearchProcessInstances` | Query | API caller | `ProcessQueryHandler -> AuthorizedProcessQueryService` | RPC `process.query.search_process_instances` | 是 |
| `GetProcessTrace` | Query | API caller | `ProcessQueryHandler -> AuthorizedProcessQueryService` | RPC `process.query.get_process_trace` | 是 |
| `GetReconciliationReport` | Query | API caller | `ProcessQueryHandler -> AuthorizedProcessQueryService` | RPC `process.query.get_reconciliation_report` | 是 |
| `MethodDefinitionChangedEvent` | Inbound Event | method-library | `ProcessInboundConsumer -> ProcessConsumerService` | topic `method.definition.changed.v1` | 是 |
| `WorkContextChangedEvent` | Inbound Event | work | `ProcessInboundConsumer -> ProcessConsumerService` | topic `work.context.changed.v1` | 是 |
| `IdentityActorCapabilityChangedEvent` | Inbound Event | identity | `ProcessInboundConsumer -> ProcessConsumerService` | topic `identity.actor_capability.changed.v1` | 是 |
| `GovernanceDecisionChangedEvent` | Inbound Event | governance | `ProcessInboundConsumer -> ProcessConsumerService` | topic `governance.decision.changed.v1` | 是 |
| `ArtifactEvidenceChangedEvent` | Inbound Event | artifact | `ProcessInboundConsumer -> ProcessConsumerService` | topic `artifact.evidence.changed.v1` | 是 |
| `RuntimeActivityFeedbackEvent` | Inbound Event | runtime / member-service | `ProcessInboundConsumer -> ProcessConsumerService` | topic `runtime.activity_feedback.v1` | 是 |
| `ConversationContextChangedEvent` | Inbound Event | conversation | `ProcessInboundConsumer -> ProcessConsumerService` | topic `conversation.context.changed.v1` | 是 |
| `RuntimeProcessShapeChangedEvent` | Outbound Event | process outbox publisher | downstream consumers | topic `process.runtime_shape.changed.v1` | 是 |
| `ProcessProfileChangedEvent` | Outbound Event | process outbox publisher | work / workspace / conversation | topic `process.profile.changed.v1` | 是 |
| `ProcessInstanceChangedEvent` | Outbound Event | process outbox publisher | work / workspace / conversation / archive | topic `process.instance.changed.v1` | 是 |
| `ActivityProgressedEvent` | Outbound Event | process outbox publisher | runtime / work / workspace / conversation | topic `process.activity.progressed.v1` | 是 |
| `WaitingGateChangedEvent` | Outbound Event | process outbox publisher | governance / workspace / conversation | topic `process.waiting_gate.changed.v1` | 是 |
| `ProcessCheckpointCreatedEvent` | Outbound Event | process outbox publisher | archive / observability | topic `process.checkpoint.created.v1` | 是 |
| `RecoveryAttemptChangedEvent` | Outbound Event | process outbox publisher | archive / observability / workspace | topic `process.recovery_attempt.changed.v1` | 是 |
| `ProcessTimingChangedEvent` | Outbound Event | process outbox publisher | work / workspace / conversation | topic `process.timing.changed.v1` | 是 |
| `ProcessTraceAvailableEvent` | Outbound Event | process outbox publisher | observability / archive / conversation | topic `process.trace.available.v1` | 是 |
| `DerivedProcessViewChangedEvent` | Outbound Event | process outbox publisher | workspace / SDK / conversation | topic `process.derived_view.changed.v1` | 是 |
| `PublishProcessOutboxJob` | Operations Job | scheduler / operator | `PublishProcessOutboxRunner -> ProcessOutboxService` | job `process.job.publish_outbox` | 是 |
| `RebuildProcessProjectionsJob` | Operations Job | scheduler / operator | `ProjectionRebuildRunner -> ProcessProjectionService` | job `process.job.rebuild_projections` | 是 |
| `RefreshExternalContextSnapshotsJob` | Operations Job | scheduler / operator | `ReferenceRefreshRunner -> ProcessReferenceRefreshService` | job `process.job.refresh_external_context_snapshots` | 是 |
| `RunProcessReconciliationJob` | Operations Job | scheduler / operator | `ReconciliationRunner -> ProcessReconciliationService` | job `process.job.run_reconciliation` | 是 |
| `PrepareProcessTraceHandoffJob` | Operations Job | scheduler / operator | `TraceHandoffRunner -> ProcessTraceService` | job `process.job.prepare_trace_handoff` | 是 |
| `PrepareProcessArchiveHandoffJob` | Operations Job | scheduler / operator | `ArchiveHandoffRunner -> ProcessTraceService` | job `process.job.prepare_archive_handoff` | 是 |
| `MaintainRecoveryAttemptsJob` | Operations Job | scheduler / operator | `RecoveryMaintenanceRunner -> ProcessRecoveryMaintenanceService` | job `process.job.maintain_recovery_attempts` | 是 |

#### 7.2 共享协议类型归属

| 类型 | 归属文件 | 用途 |
|---|---|---|
| `ActorContext` | `contracts/src/refs.rs` | command / query actor context |
| `CommandMetadata` | `contracts/src/refs.rs` | command request metadata and idempotency |
| `QueryMetadata` | `contracts/src/refs.rs` | query request metadata |
| `EventMetadata` | `contracts/src/refs.rs` | inbound / outbound event metadata |
| `JobMetadata` | `contracts/src/jobs.rs` | operations job metadata |
| `ProcessCommandKind` | `contracts/src/commands.rs` | command idempotency operation kind |
| `ProcessInboundEventKind` | `contracts/src/events.rs` | inbound consumer idempotency operation kind |
| `ProcessOutboxEventKind` | `contracts/src/events.rs` | outbound event kind derived from committed truth |
| `ProcessIdempotencyOperation` | `contracts/src/refs.rs` | command / event / job idempotency namespace |
| `ProcessIdempotencyKey` | `contracts/src/refs.rs` | normalized command / event / job idempotency key |
| `ProcessTruthRef` / `ProcessTruthRefKind` / `ProcessTruthCursorRef` / `ProcessTruthChangeRef` | `contracts/src/refs.rs` | committed truth refs used by outbox envelope、projection cursor、trace records |
| `ActivityKind` / `GatewayKind` / `RuntimeFeedbackKind` / `RecoveryHistoryKind` | `contracts/src/refs.rs` | public kind enums reused by DTO、event and domain object signatures |
| `ProcessCancelReason` / `ActivityCompletionReason` / `ActivitySkipReason` / `ActivityFailureReason` / `TokenTerminationReason` / `GatewayDecisionReason` / `GatewayInvalidReason` | `contracts/src/refs.rs` | public reason newtypes used by command DTO and domain transitions |
| `RuntimeFeedbackSummaryRef` / `SourceDigest` / `ProcessTokenRef` / `GatewayRouteRef` | `contracts/src/refs.rs` | secondary shared refs used by feedback、token and gateway protocols |
| `ProcessStartIntentRef` / `ProcessStartReason` | `contracts/src/refs.rs` | structured command intent used by `StartProcessInstanceRequest.start_intent_ref`;schema and bootstrap mapping are Step 6 §7.2.2 |
| `ActivityProgressionIntentRef` / `ActivityProgressionTransition` / `ActivityFlowControlIntent` | `contracts/src/refs.rs` | structured command intent used by `AdvanceProcessActivityRequest.progression_ref`;schema and variant-to-domain-method mapping are Step 6 §7.2.3 |
| `ReferenceResolutionState` / `ReferenceResolutionLifecycleState` | `contracts/src/refs.rs` | public reference state reused by external reference markers、DTO、view、job、repository / resolver port and domain policy;contracts 不依赖 domain |
| `GovernanceDecisionRef` / `ArtifactEvidenceMarker` / `RuntimeFeedbackRef` / `ConversationContextRef` | `contracts/src/refs.rs` | public external reference markers reused by protocol surface and domain;不得保存外部正文 |
| `ProcessSearchFilter` | `contracts/src/queries.rs` | projection search filter derived from search request |
| `ProcessReconciliationScopeRef` / `ReconciliationReportTargetRef` | `contracts/src/refs.rs` | reconciliation report scope and target |
| `ArchiveDestinationRef` / `ArchiveScopeRef` / `ArchivePackageRef` | `contracts/src/refs.rs` | archive handoff destination、scope and package marker |
| `ProtocolErrorRef` / `DependencyRef` / `JobReportRef` / `HandoffReceiptRef` | `contracts/src/refs.rs` | public error、job report and handoff receipt refs |
| `IdempotencyKey` / `EventDedupKey` / `JobIdempotencyKey` | `contracts/src/refs.rs` | operation-specific idempotency key value objects |
| `RequestDigest` / `EventDigest` / `JobDigest` | `contracts/src/refs.rs` | canonical digest value objects |
| `DigestAlgorithmVersion` / `DigestValue` | `contracts/src/refs.rs` | digest algorithm marker and value |
| `CommandReceipt` | `contracts/src/commands.rs` | command result receipt |
| `ConsumerReceipt` | `contracts/src/events.rs` | inbound consumer result receipt |
| `JobRunReceipt` | `contracts/src/jobs.rs` | job run receipt |
| `ProcessPageRequest` / `ProcessPageInfo` | `contracts/src/queries.rs` | public page DTO |
| `ProcessViewStatus` / `ProcessDegradedMarker` / `ProcessVisibilityMarker` / `ProjectionStatusMarker` | `contracts/src/views.rs` | query response status and degraded surface |
| `InboundEventEnvelope<T>` | `contracts/src/events.rs` | inbound event envelope |
| `ProcessOutboundEventEnvelope` | `contracts/src/events.rs` | outbound event envelope |
| `ProcessApiError` | `contracts/src/errors.rs` | command / query API error surface |
| `JobError` | `contracts/src/jobs.rs` | job runner error surface |

#### 7.3 共享 context / metadata schema

```rust
/// Authority kind used by process public protocols.
pub enum ActorAuthorityKind {
    /// A participant or member actor from the normal collaboration context.
    Participant,
    /// An operator actor executing administrative or recovery actions.
    Operator,
    /// A system actor executing scheduled jobs.
    System,
    /// An integration actor calling a process command through an approved boundary.
    Integration,
    /// A source actor trusted only for inbound event intake.
    TrustedSource,
}

/// Read consistency preference for query requests.
pub enum ReadConsistencyHint {
    /// Prefer committed truth and fall back to projection only when allowed.
    TruthFirst,
    /// Read from projection when it is fresh enough for the caller.
    ProjectionAccepted,
    /// Require projection and expose unavailable when projection cannot serve.
    ProjectionOnly,
}

/// Public expected version supplied by mutable commands.
pub struct ExpectedVersion {
    /// Expected storage version observed by the caller.
    pub value: u64,
}

/// Public schema version value used by event protocols.
pub struct SchemaVersion {
    /// Numeric schema version.
    pub value: u16,
}

/// Command idempotency key supplied by command callers.
pub struct IdempotencyKey {
    /// Opaque non-empty stable key value scoped by ProcessIdempotencyOperation.
    pub value: String,
}

/// Inbound event deduplication key supplied by the source boundary.
pub struct EventDedupKey {
    /// Opaque non-empty stable dedup key value scoped by ProcessIdempotencyOperation.
    pub value: String,
}

/// Operations job idempotency key supplied by the scheduler or operator.
pub struct JobIdempotencyKey {
    /// Opaque non-empty stable job key value scoped by ProcessIdempotencyOperation.
    pub value: String,
}

/// Digest algorithm version used by canonical idempotency digest values.
pub struct DigestAlgorithmVersion {
    /// Numeric algorithm version; v1 is the baseline canonical-json SHA-256 profile.
    pub value: u16,
}

/// Encoded digest value.
pub struct DigestValue {
    /// Lowercase hexadecimal digest string.
    pub value: String,
}

/// Canonical digest for command requests.
pub struct RequestDigest {
    /// Algorithm profile used to compute the digest.
    pub algorithm_version: DigestAlgorithmVersion,
    /// Digest over the canonical command operation and stable request payload.
    pub digest_value: DigestValue,
}

/// Canonical digest for inbound consumer events.
pub struct EventDigest {
    /// Algorithm profile used to compute the digest.
    pub algorithm_version: DigestAlgorithmVersion,
    /// Digest over the canonical inbound event operation, source identity, schema version, and stable payload.
    pub digest_value: DigestValue,
}

/// Canonical digest for operations jobs.
pub struct JobDigest {
    /// Algorithm profile used to compute the digest.
    pub algorithm_version: DigestAlgorithmVersion,
    /// Digest over the canonical job operation and stable job input.
    pub digest_value: DigestValue,
}

/// Actor context supplied by command and query callers.
pub struct ActorContext {
    /// Actor executing the request.
    pub actor_ref: ActorRef,
    /// Authority kind used by policy and visibility checks.
    pub authority_kind: ActorAuthorityKind,
    /// Optional member reference when identity can resolve one.
    pub member_ref: Option<GlobalMemberRef>,
}

/// Command metadata shared by all command requests.
pub struct CommandMetadata {
    /// Stable request reference assigned by the caller or API boundary.
    pub request_ref: RequestRef,
    /// Idempotency key for duplicate replay.
    pub idempotency_key: IdempotencyKey,
    /// Trace context used for audit and downstream correlation.
    pub trace_context: TraceContext,
    /// Expected aggregate storage version when the command mutates an existing subject.
    pub expected_version: Option<ExpectedVersion>,
}

/// Query metadata shared by all query requests.
pub struct QueryMetadata {
    /// Stable request reference assigned by the caller or API boundary.
    pub request_ref: RequestRef,
    /// Consistency preference for reading truth or projection.
    pub consistency_hint: ReadConsistencyHint,
    /// Trace context used for read audit correlation.
    pub trace_context: TraceContext,
}

/// Metadata shared by event envelopes.
pub struct EventMetadata {
    /// Event envelope reference assigned by the source boundary.
    pub event_envelope_ref: EventEnvelopeRef,
    /// Source event id used for deduplication.
    pub source_event_id: SourceEventId,
    /// Source boundary that produced the event.
    pub source_ref: EventSourceRef,
    /// Source actor trusted only for this event intake.
    pub source_actor_ref: TrustedSourceActorRef,
    /// Event schema version.
    pub schema_version: SchemaVersion,
    /// Deduplication key for consumer idempotency.
    pub dedup_key: EventDedupKey,
    /// Source occurrence timestamp.
    pub occurred_at: Timestamp,
    /// Trace context propagated from the source boundary.
    pub trace_context: TraceContext,
}

/// Metadata shared by operations jobs.
pub struct JobMetadata {
    /// Stable job run reference.
    pub job_run_ref: JobRunRef,
    /// Idempotency key for job duplicate replay.
    pub job_idempotency_key: JobIdempotencyKey,
    /// Actor executing the job.
    pub actor_context: ActorContext,
    /// Trace context for job audit and emitted markers.
    pub trace_context: TraceContext,
    /// Time when the job was requested.
    pub requested_at: Timestamp,
}
```

字段规则:

- `CommandMetadata.idempotency_key` 必填;缺失 reject。
- `CommandMetadata.expected_version` 的 required / optional / forbidden 口径由下表固定;handler 必须在计算 command digest 和 reserve idempotency 前校验。
- `QueryMetadata` 不承载 idempotency key。
- `EventMetadata` 字段不得重复出现在 typed payload 中。
- `JobMetadata.actor_context.authority_kind` 必须为 `System` 或 `Operator`;若为普通 actor,job runner 必须 reject。
- idempotency key value 必须为非空稳定字符串,不得使用 `request_ref`、`event_envelope_ref`、`job_run_ref` 或 transport retry counter 替代。
- `RequestDigest`、`EventDigest`、`JobDigest` 的字段集合和 volatile metadata 排除规则由 Step 13 固定;Step 8 只定义 public value object schema。

Command `expected_version` validation matrix:

| Command | `metadata.expected_version` | Versioned subject | Missing / present when forbidden handling |
|---|---|---|---|
| `SyncRuntimeProcessShape` | Optional | existing `RuntimeProcessShape` when refreshing by definition/version | missing allowed for first sync;present checked against loaded shape;stale -> conflict |
| `AdoptProcessProfile` | Forbidden | new `ProcessProfile` | present -> `InvalidRequest` |
| `UpdateProcessProfileTailoring` | Required | `ProcessProfile` | missing -> `InvalidRequest`;stale -> conflict |
| `StartProcessInstance` | Forbidden | new `ProcessInstance` | present -> `InvalidRequest` |
| `AdvanceProcessActivity` | Required | primary `Activity`;loaded token/gateway/instance use repository `StorageVersion` | missing -> `InvalidRequest`;stale -> conflict |
| `RecordActivityFeedback` | Required | `Activity` | missing -> `InvalidRequest`;stale -> conflict |
| `OpenWaitingGate` | Required | primary `ProcessInstance`;loaded token/activity use repository `StorageVersion` | missing -> `InvalidRequest`;stale -> conflict |
| `ResumeWaitingGate` | Required | `WaitingGate` | missing -> `InvalidRequest`;stale -> conflict |
| `CreateProcessCheckpoint` | Optional | previous latest checkpoint when superseding;loaded instance/activity use repository `StorageVersion` | missing allowed;present checked against previous checkpoint when supplied;stale -> conflict |
| `StartRecoveryAttempt` | Required | `ProcessInstance` being recovered | missing -> `InvalidRequest`;stale -> conflict |
| `CompleteRecoveryAttempt` | Required | `RecoveryAttempt` | missing -> `InvalidRequest`;stale -> conflict |
| `BindProcessTimebox` | Forbidden | new `ProcessTimeboxBinding`;active binding uniqueness is repository-enforced | present -> `InvalidRequest` |
| `UpdateProcessStageState` | Required | `ProcessStageState` | missing -> `InvalidRequest`;stale -> conflict |

#### 7.4 共享 receipt / page / marker schema

```rust
/// Receipt returned by command results.
pub struct CommandReceipt {
    /// Application result reference stored for duplicate replay.
    pub result_ref: ApplicationResultRef,
    /// Request reference from command metadata.
    pub request_ref: RequestRef,
    /// Whether this result was produced by duplicate replay.
    pub duplicate: bool,
    /// Trace record created by the command when a truth change occurred.
    pub trace_record_ref: Option<ProcessTraceRecordRef>,
}

/// Public page request used by query and job DTOs.
pub struct ProcessPageRequest {
    /// Cursor from a previous response.
    pub cursor: Option<PageCursorRef>,
    /// Requested page size.
    pub limit: PageLimit,
}

/// Public page limit for query and job pages.
pub struct PageLimit {
    /// Requested item count.
    pub value: u16,
}

/// Public page info returned by query and job DTOs.
pub struct ProcessPageInfo {
    /// Cursor for the next page when more data exists.
    pub next_cursor: Option<PageCursorRef>,
    /// Whether the caller may request another page.
    pub has_more: bool,
}

/// Public view status shared by query responses.
pub enum ProcessViewStatus {
    /// The requested view is available.
    Available,
    /// The requested subject is not visible to the actor.
    NotVisible,
    /// The requested subject does not exist.
    Missing,
    /// The view is available with degraded projection or reference data.
    Degraded,
    /// The view is unavailable because its projection is disabled or failed.
    Unavailable,
}

/// Public visibility decision.
pub enum VisibilityDecision {
    /// The actor may read the requested subject.
    Visible,
    /// The actor may read a filtered form of the requested subject.
    Filtered,
    /// The actor may not read the requested subject.
    Hidden,
}

/// Marker explaining degraded process views.
pub struct ProcessDegradedMarker {
    /// Degraded reason.
    pub reason_ref: DegradedReasonRef,
    /// Projection marker when degradation comes from projection state.
    pub projection_marker: Option<ProjectionStatusMarker>,
    /// Reference marker when degradation comes from external context.
    pub reference_state_ref: Option<ReferenceResolutionStateRef>,
}

/// Marker explaining visibility filtering.
pub struct ProcessVisibilityMarker {
    /// Consumer or actor that requested the view.
    pub consumer_ref: ProcessConsumerRef,
    /// Visibility decision.
    pub visibility_decision: VisibilityDecision,
    /// Optional reason for hidden or filtered data.
    pub reason_ref: Option<VisibilityReasonRef>,
}

/// Projection status marker included in query responses.
pub struct ProjectionStatusMarker {
    /// Projection state reference.
    pub view_state_ref: DerivedProcessViewStateRef,
    /// Freshness state.
    pub freshness_state: ProjectionFreshnessState,
    /// Source cursor represented by the projection.
    pub source_cursor_ref: ProcessTruthCursorRef,
}
```

转换规则:

- Step 7 `PageRequest.cursor` / `PageRequest.limit` 从 `ProcessPageRequest.cursor` / `limit` 转换。
- Step 7 `PageInfo.next_cursor` / `has_more` 转为 `ProcessPageInfo`。
- `ProcessViewStatus::Degraded` 必须带 `ProcessDegradedMarker`。
- `ProcessViewStatus::NotVisible` 必须带 `ProcessVisibilityMarker`。
- `ProcessViewStatus::Missing` 不得伪造 empty object;只返回 subject ref 和 status。

#### 7.4.1 public enum / helper schema

以下类型被 command、query、event 或 job public DTO 直接引用,正式归属 `contracts/src/refs.rs` 或对应 protocol 文件,不得在实现侧临时补字段。

```rust
/// Process command kind used by idempotency operation names.
pub enum ProcessCommandKind {
    /// SyncRuntimeProcessShape command.
    SyncRuntimeProcessShape,
    /// AdoptProcessProfile command.
    AdoptProcessProfile,
    /// UpdateProcessProfileTailoring command.
    UpdateProcessProfileTailoring,
    /// StartProcessInstance command.
    StartProcessInstance,
    /// AdvanceProcessActivity command.
    AdvanceProcessActivity,
    /// RecordActivityFeedback command.
    RecordActivityFeedback,
    /// OpenWaitingGate command.
    OpenWaitingGate,
    /// ResumeWaitingGate command.
    ResumeWaitingGate,
    /// CreateProcessCheckpoint command.
    CreateProcessCheckpoint,
    /// StartRecoveryAttempt command.
    StartRecoveryAttempt,
    /// CompleteRecoveryAttempt command.
    CompleteRecoveryAttempt,
    /// BindProcessTimebox command.
    BindProcessTimebox,
    /// UpdateProcessStageState command.
    UpdateProcessStageState,
}

/// Inbound event kind used by event deduplication operation names.
pub enum ProcessInboundEventKind {
    /// method.definition.changed.v1.
    MethodDefinitionChanged,
    /// work.context.changed.v1.
    WorkContextChanged,
    /// identity.actor_capability.changed.v1.
    IdentityActorCapabilityChanged,
    /// governance.decision.changed.v1.
    GovernanceDecisionChanged,
    /// artifact.evidence.changed.v1.
    ArtifactEvidenceChanged,
    /// runtime.activity_feedback.v1.
    RuntimeActivityFeedback,
    /// conversation.context.changed.v1.
    ConversationContextChanged,
}

/// Idempotency operation namespace for commands, inbound events, and jobs.
pub enum ProcessIdempotencyOperation {
    /// Command operation namespace.
    Command(ProcessCommandKind),
    /// Inbound event consumer operation namespace.
    InboundEvent(ProcessInboundEventKind),
    /// Operations job namespace.
    Job(ProcessJobKind),
}

/// Normalized operation-scoped key stored by the idempotency repository.
pub struct ProcessIdempotencyKey {
    /// Operation namespace.
    pub operation: ProcessIdempotencyOperation,
    /// Original command, event, or job key normalized as a string.
    pub key_value: String,
}

/// Outbox event kind derived from committed process truth.
pub enum ProcessOutboxEventKind {
    /// Runtime process shape changed.
    RuntimeProcessShapeChanged,
    /// Process profile changed.
    ProcessProfileChanged,
    /// Process instance changed.
    ProcessInstanceChanged,
    /// Activity progressed.
    ActivityProgressed,
    /// Waiting gate changed.
    WaitingGateChanged,
    /// Process checkpoint was created.
    ProcessCheckpointCreated,
    /// Recovery attempt changed.
    RecoveryAttemptChanged,
    /// Process timing changed.
    ProcessTimingChanged,
    /// Process trace became available.
    ProcessTraceAvailable,
    /// Derived process view changed.
    DerivedProcessViewChanged,
}

/// Projection kind used by rebuild jobs and view markers.
pub enum ProcessProjectionKind {
    /// Process read model projection.
    ReadModel,
    /// Process timeline projection.
    Timeline,
    /// Process progress summary projection.
    ProgressSummary,
    /// Activity status projection.
    ActivityStatus,
    /// Process search index projection.
    SearchIndex,
    /// Derived view state marker projection.
    DerivedViewState,
}

/// Operations job kind.
pub enum ProcessJobKind {
    /// Publish pending process outbox records.
    PublishProcessOutbox,
    /// Rebuild process projections.
    RebuildProcessProjections,
    /// Refresh external context snapshots.
    RefreshExternalContextSnapshots,
    /// Run process reconciliation.
    RunProcessReconciliation,
    /// Prepare process trace handoff.
    PrepareProcessTraceHandoff,
    /// Prepare process archive handoff.
    PrepareProcessArchiveHandoff,
    /// Maintain recovery attempts.
    MaintainRecoveryAttempts,
}

/// External context kind refreshed by snapshot jobs.
pub enum ExternalContextKind {
    /// Method definition context.
    MethodDefinition,
    /// Work context.
    WorkContext,
    /// Actor capability context.
    ActorCapability,
    /// Governance decision context.
    GovernanceDecision,
    /// Artifact evidence context.
    ArtifactEvidence,
    /// Runtime feedback context.
    RuntimeFeedback,
    /// Conversation context.
    ConversationContext,
}

/// Process-visible artifact evidence marker without artifact body or package content.
pub struct ArtifactEvidenceMarker {
    /// Artifact evidence reference.
    pub evidence_ref: ArtifactEvidenceRef,
    /// Evidence kind.
    pub evidence_kind: ArtifactEvidenceKind,
    /// Resolution state for this evidence marker.
    pub evidence_state: ReferenceResolutionState,
}

/// Recovery command outcome.
pub enum RecoveryOutcome {
    /// Mark the recovery attempt as applied.
    Applied,
    /// Mark the recovery attempt as failed.
    Failed,
    /// Abandon the recovery attempt.
    Abandoned,
}

/// Requested target for a stage state update.
pub enum StageTarget {
    /// Activate the stage.
    Activate,
    /// Pause the stage.
    Pause,
    /// Complete the stage.
    Complete,
    /// Skip the stage.
    Skip,
}

/// Retry limit used by jobs.
pub struct RetryLimit {
    /// Maximum retry count.
    pub value: u16,
}

/// Retention duration used by snapshot refresh and retention jobs.
pub struct RetentionDuration {
    /// Duration in seconds.
    pub seconds: u64,
}

/// Public search filter used by projection repository search.
pub struct ProcessSearchFilter {
    /// Optional work context filter.
    pub work_context_ref: Option<WorkContextRef>,
    /// Optional process profile filter.
    pub profile_ref: Option<ProcessProfileRef>,
    /// Optional process instance state filter.
    pub instance_state: Option<ProcessInstanceState>,
    /// Page request.
    pub page: ProcessPageRequest,
}

/// Reconciliation scope reference with explicit process filter fields.
pub struct ProcessReconciliationScopeRef {
    /// Stable scope reference.
    pub value: String,
    /// Optional process instance scope.
    pub process_instance_ref: Option<ProcessInstanceRef>,
    /// Optional work context scope.
    pub work_context_ref: Option<WorkContextRef>,
    /// Include projections in reconciliation.
    pub include_projections: bool,
    /// Include external snapshot markers in reconciliation.
    pub include_snapshots: bool,
    /// Include outbox cursor / publication state in reconciliation.
    pub include_outbox: bool,
}

/// Target where reconciliation report metadata is written.
pub struct ReconciliationReportTargetRef {
    /// Stable report target reference.
    pub value: String,
    /// Target kind, for example local report store or external operations sink.
    pub target_kind: ReconciliationReportTargetKind,
}

/// Reconciliation report target kind.
pub enum ReconciliationReportTargetKind {
    /// Store the report in the process report repository.
    LocalReportStore,
    /// Emit report metadata to an operations sink.
    OperationsSink,
}

/// Archive destination reference used by archive handoff jobs.
pub struct ArchiveDestinationRef {
    /// Stable destination reference.
    pub value: String,
    /// Destination kind.
    pub destination_kind: ArchiveDestinationKind,
}

/// Archive destination kind.
pub enum ArchiveDestinationKind {
    /// Local fake or in-memory archive destination.
    Local,
    /// Configured durable archive destination.
    ConfiguredArchive,
}

/// Archive material scope reference.
pub struct ArchiveScopeRef {
    /// Stable archive scope reference.
    pub value: String,
    /// Optional trace subject scope.
    pub trace_subject_ref: Option<ProcessTraceSubjectRef>,
    /// Optional process instance scope.
    pub process_instance_ref: Option<ProcessInstanceRef>,
}

/// Protocol validation error reference.
pub struct ProtocolErrorRef {
    /// Stable protocol error reference.
    pub value: String,
}

/// Dependency reference used in unavailable errors.
pub struct DependencyRef {
    /// Stable dependency reference.
    pub value: String,
}

/// Job report reference.
pub struct JobReportRef {
    /// Stable job report reference.
    pub value: String,
}

/// Handoff receipt reference.
pub struct HandoffReceiptRef {
    /// Stable handoff receipt reference.
    pub value: String,
}

/// Archive package reference without package body.
pub struct ArchivePackageRef {
    /// Stable archive package reference.
    pub value: String,
}
```

#### 7.5 API error schema

```rust
/// Public API error returned by process command and query handlers.
pub enum ProcessApiError {
    /// Request schema or required field validation failed.
    InvalidRequest(ProtocolErrorRef),
    /// Actor is not authorized for the requested operation.
    NotAuthorized(AuthorizationErrorRef),
    /// Idempotency key conflicts with a different request digest.
    IdempotencyConflict(IdempotencyConflictRef),
    /// Duplicate result could not be loaded by result reference.
    IdempotencyResultMissing(ApplicationResultRef),
    /// The requested subject was not found.
    NotFound(ProcessSubjectRef),
    /// Domain policy rejected the request.
    DomainRejected(DomainErrorRef),
    /// Repository or external source is temporarily unavailable.
    TemporarilyUnavailable(DependencyRef),
}
```

#### 7.6 Command request / result schema

##### 7.6.1 `SyncRuntimeProcessShape`

| 项 | 内容 |
|---|---|
| 函数签名 | `sync_runtime_process_shape(SyncRuntimeProcessShapeRequest) -> Result<RuntimeProcessShapeCommandResult, ProcessApiError>` |
| RPC 名称 | `process.command.sync_runtime_process_shape` |
| 调用方 | method sync actor / operator |
| 处理方 | `ProcessShapeCommandHandler -> ProcessShapeSyncService` |

```rust
/// Request to index or refresh a runtime process shape from a method definition.
pub struct SyncRuntimeProcessShapeRequest {
    /// Actor and authority context.
    pub actor_context: ActorContext,
    /// Command metadata and idempotency key.
    pub metadata: CommandMetadata,
    /// External method definition reference.
    pub definition_ref: MethodDefinitionRef,
    /// External method definition version reference.
    pub definition_version_ref: MethodDefinitionVersionRef,
    /// Intent explaining why the shape is synchronized.
    pub sync_intent_ref: ShapeSyncIntentRef,
    /// Optional source digest supplied by the method boundary.
    pub source_digest: Option<SourceDigest>,
}

/// Result of SyncRuntimeProcessShape.
pub struct RuntimeProcessShapeCommandResult {
    /// Runtime shape affected by the command.
    pub shape_ref: RuntimeProcessShapeRef,
    /// External method definition reference used as source.
    pub definition_ref: MethodDefinitionRef,
    /// External method definition version used as source.
    pub definition_version_ref: MethodDefinitionVersionRef,
    /// Resulting shape state.
    pub shape_state: RuntimeProcessShapeState,
    /// Snapshot reference used to build the shape.
    pub source_snapshot_ref: MethodDefinitionSnapshotRef,
    /// Outbox record created when a truth change occurred.
    pub outbox_record_ref: Option<ProcessOutboxRef>,
    /// Command receipt for idempotency replay.
    pub receipt: CommandReceipt,
}
```

| 输入字段 | 类型 | 目标对象字段 | 字段来源 | 缺失处理 |
|---|---|---|---|---|
| `definition_ref` | `MethodDefinitionRef` | `RuntimeProcessShape.definition_ref` | caller | reject |
| `definition_version_ref` | `MethodDefinitionVersionRef` | `RuntimeProcessShape.definition_version_ref` | caller | reject |
| `source_digest` | `Option<SourceDigest>` | resolver verification | caller / method event | digest mismatch -> reject / unresolved |
| `shape_id` | `RuntimeProcessShapeId` | `RuntimeProcessShape.shape_id` | `IdGeneratorPort` | system generated |
| `source_snapshot_ref` | `MethodDefinitionSnapshotRef` | `RuntimeProcessShape.source_snapshot_ref` | `MethodDefinitionResolverPort` + snapshot repository | source unavailable -> retry / unresolved |

##### 7.6.2 `AdoptProcessProfile`

| 项 | 内容 |
|---|---|
| 函数签名 | `adopt_process_profile(AdoptProcessProfileRequest) -> Result<ProcessProfileCommandResult, ProcessApiError>` |
| RPC 名称 | `process.command.adopt_process_profile` |
| 调用方 | project operator / process setup |
| 处理方 | `ProcessProfileCommandHandler -> ProcessProfileCommandService` |

```rust
/// Request to adopt a runtime process shape as a project process profile.
pub struct AdoptProcessProfileRequest {
    /// Actor and authority context.
    pub actor_context: ActorContext,
    /// Command metadata and idempotency key.
    pub metadata: CommandMetadata,
    /// External project reference supplied by work.
    pub project_ref: ProjectRef,
    /// External work context reference.
    pub work_context_ref: WorkContextRef,
    /// Runtime shape to adopt.
    pub shape_ref: RuntimeProcessShapeRef,
    /// Tailoring intent reference.
    pub tailoring_intent_ref: ProfileTailoringIntentRef,
}

/// Result of profile adoption or tailoring update.
pub struct ProcessProfileCommandResult {
    /// Profile affected by the command.
    pub profile_ref: ProcessProfileRef,
    /// External project reference.
    pub project_ref: ProjectRef,
    /// Runtime shape currently adopted by the profile.
    pub shape_ref: RuntimeProcessShapeRef,
    /// Resulting profile state.
    pub profile_state: ProcessProfileState,
    /// Profile change record created by the command.
    pub change_record_ref: ProfileChangeRecordRef,
    /// Outbox record created when a truth change occurred.
    pub outbox_record_ref: Option<ProcessOutboxRef>,
    /// Command receipt for idempotency replay.
    pub receipt: CommandReceipt,
}
```

| 输入字段 | 类型 | 目标对象字段 | 字段来源 | 缺失处理 |
|---|---|---|---|---|
| `project_ref` | `ProjectRef` | `ProcessProfile.project_ref` | caller | reject |
| `work_context_ref` | `WorkContextRef` | `WorkContextSnapshot.work_context_ref` | caller / resolver | unresolved -> reject or retry by Step 9 flow |
| `shape_ref` | `RuntimeProcessShapeRef` | `ProcessProfile.shape_ref` | caller + shape repository | missing -> reject |
| `profile_id` | `ProcessProfileId` | `ProcessProfile.profile_id` | `IdGeneratorPort` | system generated |
| `change_record_ref` | `ProfileChangeRecordRef` | `ProcessProfile.last_change_ref` | domain change record | system generated |

##### 7.6.3 `UpdateProcessProfileTailoring`

| 项 | 内容 |
|---|---|
| 函数签名 | `update_process_profile_tailoring(UpdateProcessProfileTailoringRequest) -> Result<ProcessProfileCommandResult, ProcessApiError>` |
| RPC 名称 | `process.command.update_process_profile_tailoring` |
| 调用方 | project operator |
| 处理方 | `ProcessProfileCommandHandler -> ProcessProfileCommandService` |

```rust
/// Request to change profile tailoring or switch the adopted runtime shape.
pub struct UpdateProcessProfileTailoringRequest {
    /// Actor and authority context.
    pub actor_context: ActorContext,
    /// Command metadata and idempotency key.
    pub metadata: CommandMetadata,
    /// Profile to update.
    pub profile_ref: ProcessProfileRef,
    /// Optional next runtime shape.
    pub next_shape_ref: Option<RuntimeProcessShapeRef>,
    /// Tailoring change reference.
    pub tailoring_change_ref: ProfileTailoringChangeRef,
    /// Reason for the profile change.
    pub change_reason: ProfileChangeReason,
}
```

字段闭环:

| 输入字段 | 类型 | 目标对象字段 | 字段来源 | 缺失处理 |
|---|---|---|---|---|
| `profile_ref` | `ProcessProfileRef` | existing `ProcessProfile` | caller + repository | missing -> reject |
| `next_shape_ref` | `Option<RuntimeProcessShapeRef>` | `ProcessProfile.shape_ref` when switching | caller + shape repository | missing shape -> reject |
| `tailoring_change_ref` | `ProfileTailoringChangeRef` | `ProfileChangeRecord` evidence | caller | reject |
| `change_reason` | `ProfileChangeReason` | `ProfileChangeRecord.change_reason` | caller | reject |

##### 7.6.4 `StartProcessInstance`

| 项 | 内容 |
|---|---|
| 函数签名 | `start_process_instance(StartProcessInstanceRequest) -> Result<ProcessInstanceCommandResult, ProcessApiError>` |
| RPC 名称 | `process.command.start_process_instance` |
| 调用方 | project operator / work integration |
| 处理方 | `ProcessInstanceCommandHandler -> ProcessInstanceCommandService` |

```rust
/// Request to start a process instance from an active process profile.
pub struct StartProcessInstanceRequest {
    /// Actor and authority context.
    pub actor_context: ActorContext,
    /// Command metadata and idempotency key.
    pub metadata: CommandMetadata,
    /// Active process profile reference.
    pub profile_ref: ProcessProfileRef,
    /// External work context reference.
    pub work_context_ref: WorkContextRef,
    /// Start intent reference.
    pub start_intent_ref: ProcessStartIntentRef,
}

/// Result of StartProcessInstance.
pub struct ProcessInstanceCommandResult {
    /// Process instance created or affected.
    pub process_instance_ref: ProcessInstanceRef,
    /// Profile used by the instance.
    pub profile_ref: ProcessProfileRef,
    /// External project reference copied from profile / work context.
    pub project_ref: ProjectRef,
    /// Resulting instance state.
    pub instance_state: ProcessInstanceState,
    /// Initial current activity when available.
    pub current_activity_ref: Option<ActivityRef>,
    /// Initial token set reference.
    pub token_set_ref: ProcessTokenSetRef,
    /// Outbox record created when a truth change occurred.
    pub outbox_record_ref: Option<ProcessOutboxRef>,
    /// Command receipt for idempotency replay.
    pub receipt: CommandReceipt,
}
```

字段闭环:

| 输入字段 | 类型 | 目标对象字段 | 字段来源 | 缺失处理 |
|---|---|---|---|---|
| `profile_ref` | `ProcessProfileRef` | `ProcessInstance.profile_ref` | caller + profile repository | missing / inactive -> reject |
| `work_context_ref` | `WorkContextRef` | source for `project_ref` validation | caller + snapshot repository | unresolved -> reject / retry |
| `start_intent_ref` | `ProcessStartIntentRef` | initial activity / token / optional gateway bootstrap | caller + `ProcessShapeRepository.get_start_bootstrap_summary(profile.shape_ref, start_intent_ref.start_node_ref)`;schema 见 Step 6 §7.2.2 / §7.3 | unknown start node、gateway mismatch、missing start reason -> reject |
| `process_instance_id` | `ProcessInstanceId` | `ProcessInstance.process_instance_id` | `IdGeneratorPort` | generated |
| `token_set_ref` | `ProcessTokenSetRef` | `ProcessInstance.token_set_ref` | `IdGeneratorPort::new_process_token_set_ref()` | generated |
| `activity_id` | `ActivityId` | `Activity.activity_id` | `IdGeneratorPort::new_activity_id()` | generated |
| `token_id` | `ProcessTokenId` | `Token.token_id` | `IdGeneratorPort::new_process_token_id()` | generated |
| `gateway_id` | `GatewayId` | `Gateway.gateway_id` when bootstrap gateway exists | `IdGeneratorPort::new_gateway_id()` | generated only when `ProcessStartBootstrapSummary.requires_gateway_tracking = true` |
| `current_activity_ref` | `Option<ActivityRef>` | `ProcessInstance.current_activity_ref` | saved initial `Activity` ref generated from `activity_id` | if no start node summary -> reject |

Start bootstrap validation:

- `ProcessShapeRepository.get_start_bootstrap_summary(profile.shape_ref, start_intent_ref.start_node_ref)` is the only formal read surface for start node membership、`ActivityKind` and initial gateway bootstrap metadata.
- `ProcessStartBootstrapSummary.activity_kind` is passed to `Activity::from_shape_node(...)`;service must not infer `ActivityKind` from `ShapeNodeRef` text or private adapter state.
- If `ProcessStartBootstrapSummary.requires_gateway_tracking = true`,request `initial_gateway_ref` must equal `summary.initial_gateway.gateway_ref`;the saved `Gateway` truth still uses `IdGeneratorPort::new_gateway_id()` as `GatewayId`,and `summary.initial_gateway.shape_node_ref / gateway_kind` are passed to `Gateway::from_shape_node(...)`.
- If `requires_gateway_tracking = false`,request `initial_gateway_ref` must be `None` and no `Gateway` truth is created.

##### 7.6.5 `AdvanceProcessActivity`

| 项 | 内容 |
|---|---|
| 函数签名 | `advance_process_activity(AdvanceProcessActivityRequest) -> Result<ActivityProgressionCommandResult, ProcessApiError>` |
| RPC 名称 | `process.command.advance_process_activity` |
| 调用方 | process actor / operator |
| 处理方 | `ActivityCommandHandler -> ActivityProgressionService` |

```rust
/// Request to advance an activity and related token or gateway state.
pub struct AdvanceProcessActivityRequest {
    /// Actor and authority context.
    pub actor_context: ActorContext,
    /// Command metadata and idempotency key.
    pub metadata: CommandMetadata,
    /// Owning process instance.
    pub process_instance_ref: ProcessInstanceRef,
    /// Activity to advance.
    pub activity_ref: ActivityRef,
    /// Requested activity transition.
    pub progression_ref: ActivityProgressionIntentRef,
    /// Expected current position for concurrency-safe progression.
    pub expected_position_ref: ShapeNodeRef,
}

/// Result of activity progression and feedback commands.
pub struct ActivityProgressionCommandResult {
    /// Process instance affected by the activity change.
    pub process_instance_ref: ProcessInstanceRef,
    /// Activity affected by the command.
    pub activity_ref: ActivityRef,
    /// Resulting activity state.
    pub activity_state: ActivityState,
    /// Activity progression record created by the command.
    pub progression_record_ref: ActivityProgressionRecordRef,
    /// Tokens affected by the transition when applicable.
    pub token_refs: Vec<ProcessTokenRef>,
    /// Gateway affected by the transition when applicable.
    pub gateway_ref: Option<GatewayRef>,
    /// Gateway route selected during this command when applicable.
    pub selected_route_ref: Option<GatewayRouteRef>,
    /// Outbox record created when a truth change occurred.
    pub outbox_record_ref: Option<ProcessOutboxRef>,
    /// Command receipt for idempotency replay.
    pub receipt: CommandReceipt,
}
```

字段闭环:

| 输入字段 | 类型 | 目标对象字段 | 字段来源 | 缺失处理 |
|---|---|---|---|---|
| `process_instance_ref` | `ProcessInstanceRef` | load instance | caller | missing -> reject |
| `activity_ref` | `ActivityRef` | `Activity.activity_id` | caller | missing -> reject |
| `progression_ref` | `ActivityProgressionIntentRef` | activity transition + token / gateway flow-control intent | caller;schema 见 Step 6 §7.2.3 | unknown variant、missing variant field、route not allowed、summary mismatch -> reject |
| `expected_position_ref` | `ShapeNodeRef` | token / activity consistency check | caller | mismatch -> conflict |

`progression_ref.activity_transition` 到 domain method 的映射必须完全采用 Step 6 §7.2.3 表格:`Ready -> Activity.ready(progression_id, actor)`、`Start -> Activity.start(progression_id, actor)`、`Complete -> Activity.complete(progression_id, reason, actor)`、`Skip -> Activity.skip(progression_id, reason, actor)`、`Fail -> Activity.fail(progression_id, reason, actor)`。这些 activity method 只返回 `ActivityTransitionOutcome`,不直接返回完整 `ActivityProgressionRecord`。`progression_id` 由 application 通过 `IdGeneratorPort::new_activity_progression_id()` 生成后传入,domain 不得自行生成。`Complete.feedback_summary_ref` 只作为 body-free summary ref;若 activity 已有 `feedback_ref` 或当前状态为 `WaitingFeedback`,则必须读取 matching `RuntimeFeedbackSummary` 并通过 `ActivityFeedbackPolicy`,不得读取 runtime body。

`progression_ref.flow_control` 到 token / gateway method 的映射必须完全采用 Step 6 §7.2.3 表格。`SelectGatewayRoute` 成功后,`Gateway.selected_route_ref` 是 route selection 的 committed truth。application 必须在 activity transition 和 token / gateway flow-control 都完成后,用 `ActivityTransitionOutcome` + 同事务 changed token / gateway truth 调用 `ActivityProgressionRecord::from_activity_transition(...)`;`ActivityProgressionCommandResult.selected_route_ref` 必须复制同事务保存后的 `Gateway.selected_route_ref`,不得由 handler 重新按 request 或 shape 推导。

##### 7.6.6 `RecordActivityFeedback`

| 项 | 内容 |
|---|---|
| 函数签名 | `record_activity_feedback(RecordActivityFeedbackRequest) -> Result<ActivityProgressionCommandResult, ProcessApiError>` |
| RPC 名称 | `process.command.record_activity_feedback` |
| 调用方 | runtime bridge / process actor |
| 处理方 | `ActivityCommandHandler -> ActivityProgressionService` |

```rust
/// Request to bind runtime or member feedback to an activity.
pub struct RecordActivityFeedbackRequest {
    /// Actor and authority context.
    pub actor_context: ActorContext,
    /// Command metadata and idempotency key.
    pub metadata: CommandMetadata,
    /// Activity receiving feedback.
    pub activity_ref: ActivityRef,
    /// External runtime feedback reference supplied by the runtime/member source.
    pub runtime_feedback_ref: ExternalRuntimeFeedbackRef,
    /// Feedback summary reference without execution body. The concrete summary schema is Step 6 `RuntimeFeedbackSummary`.
    pub feedback_summary_ref: RuntimeFeedbackSummaryRef,
}
```

字段闭环:

| 输入字段 | 类型 | 目标对象字段 | 字段来源 | 缺失处理 |
|---|---|---|---|---|
| `activity_ref` | `ActivityRef` | `Activity.activity_id` | caller | missing -> reject |
| `runtime_feedback_ref` | `ExternalRuntimeFeedbackRef` | resolver input;forms `Activity.feedback_ref: RuntimeFeedbackRef` | caller / runtime event | unresolved -> reject / retry |
| `feedback_summary_ref` | `RuntimeFeedbackSummaryRef` | `RuntimeFeedbackSummary.feedback_summary_ref` | caller;resolver must return matching body-free summary | missing / mismatch -> reject |

##### 7.6.7 `OpenWaitingGate`

| 项 | 内容 |
|---|---|
| 函数签名 | `open_waiting_gate(OpenWaitingGateRequest) -> Result<WaitingGateCommandResult, ProcessApiError>` |
| RPC 名称 | `process.command.open_waiting_gate` |
| 调用方 | process actor / operator |
| 处理方 | `WaitingGateCommandHandler -> WaitingGateCoordinationService` |

```rust
/// Request to open a waiting gate for a process activity.
pub struct OpenWaitingGateRequest {
    /// Actor and authority context.
    pub actor_context: ActorContext,
    /// Command metadata and idempotency key.
    pub metadata: CommandMetadata,
    /// Process instance being paused.
    pub process_instance_ref: ProcessInstanceRef,
    /// Activity that opens the gate.
    pub activity_ref: ActivityRef,
    /// Reason for pausing.
    pub pause_reason: PauseReason,
    /// Requirement needed for resume.
    pub resume_requirement_ref: ResumeRequirementRef,
}

/// Result of waiting gate commands.
pub struct WaitingGateCommandResult {
    /// Waiting gate affected by the command.
    pub waiting_gate_ref: WaitingGateRef,
    /// Process instance owning the gate.
    pub process_instance_ref: ProcessInstanceRef,
    /// Current waiting gate state.
    pub gate_state: WaitingGateState,
    /// Pause context reference.
    pub pause_context_ref: PauseContextRef,
    /// Optional governance decision evidence.
    pub decision_ref: Option<GovernanceDecisionRef>,
    /// Waiting gate change record.
    pub change_record_ref: WaitingGateChangeRecordRef,
    /// Outbox record created when a truth change occurred.
    pub outbox_record_ref: Option<ProcessOutboxRef>,
    /// Command receipt for idempotency replay.
    pub receipt: CommandReceipt,
}
```

字段闭环:

| 输入字段 | 类型 | 目标对象字段 | 字段来源 | 缺失处理 |
|---|---|---|---|---|
| `process_instance_ref` | `ProcessInstanceRef` | `WaitingGate.process_instance_id` | caller + repository | missing -> reject |
| `activity_ref` | `ActivityRef` | `WaitingGate.activity_ref` / `PauseContext.activity_ref` | caller | reject |
| `pause_reason` | `PauseReason` | `PauseContext.pause_reason` | caller | reject |
| `resume_requirement_ref` | `ResumeRequirementRef` | `PauseContext.resume_requirement_ref` | caller | reject |
| `waiting_gate_id` / `pause_context_id` | generated ids | `WaitingGate.waiting_gate_id` / `PauseContext.pause_context_id` | `IdGeneratorPort::new_waiting_gate_id()` / `new_pause_context_id()` | generated before domain factory calls |
| `change_record_ref` | generated ref from `WaitingGateChangeId` | `WaitingGateCommandResult.change_record_ref` / appended `WaitingGateChangeRecord.change_id` | `IdGeneratorPort::new_waiting_gate_change_id()` | generated before waiting gate / instance transition record construction |

##### 7.6.8 `ResumeWaitingGate`

| 项 | 内容 |
|---|---|
| 函数签名 | `resume_waiting_gate(ResumeWaitingGateRequest) -> Result<WaitingGateCommandResult, ProcessApiError>` |
| RPC 名称 | `process.command.resume_waiting_gate` |
| 调用方 | process actor / operator |
| 处理方 | `WaitingGateCommandHandler -> WaitingGateCoordinationService` |

```rust
/// Request to resume a waiting gate with explicit evidence.
pub struct ResumeWaitingGateRequest {
    /// Actor and authority context.
    pub actor_context: ActorContext,
    /// Command metadata and idempotency key.
    pub metadata: CommandMetadata,
    /// Waiting gate to resume.
    pub waiting_gate_ref: WaitingGateRef,
    /// Resume reason.
    pub resume_reason: ResumeReason,
    /// Governance decision or external evidence used to resume.
    pub decision_ref: GovernanceDecisionRef,
}
```

字段闭环:

| 输入字段 | 类型 | 目标对象字段 | 字段来源 | 缺失处理 |
|---|---|---|---|---|
| `waiting_gate_ref` | `WaitingGateRef` | existing `WaitingGate` | caller + repository | missing -> reject |
| `resume_reason` | `ResumeReason` | waiting gate transition / trace reason | caller | reject |
| `decision_ref` | `GovernanceDecisionRef` | `WaitingGate.decision_ref` | caller / resolver | unresolved -> reject |

##### 7.6.9 `CreateProcessCheckpoint`

| 项 | 内容 |
|---|---|
| 函数签名 | `create_process_checkpoint(CreateProcessCheckpointRequest) -> Result<ProcessCheckpointCommandResult, ProcessApiError>` |
| RPC 名称 | `process.command.create_process_checkpoint` |
| 调用方 | process actor / system checkpoint |
| 处理方 | `RecoveryCommandHandler -> ProcessRecoveryService` |

```rust
/// Request to capture a process checkpoint.
pub struct CreateProcessCheckpointRequest {
    /// Actor and authority context.
    pub actor_context: ActorContext,
    /// Command metadata and idempotency key.
    pub metadata: CommandMetadata,
    /// Process instance being checkpointed.
    pub process_instance_ref: ProcessInstanceRef,
    /// Optional current activity reference.
    pub activity_ref: Option<ActivityRef>,
    /// Reason for creating the checkpoint.
    pub checkpoint_reason: CheckpointReason,
    /// Evidence reference for recovery.
    pub evidence_ref: CheckpointEvidenceRef,
}

/// Result of checkpoint creation.
pub struct ProcessCheckpointCommandResult {
    /// Created checkpoint.
    pub checkpoint_ref: ProcessCheckpointRef,
    /// Process instance owning the checkpoint.
    pub process_instance_ref: ProcessInstanceRef,
    /// Checkpoint state.
    pub checkpoint_state: CheckpointState,
    /// Evidence reference.
    pub evidence_ref: CheckpointEvidenceRef,
    /// Command receipt for idempotency replay.
    pub receipt: CommandReceipt,
}
```

##### 7.6.10 `StartRecoveryAttempt`

| 项 | 内容 |
|---|---|
| 函数签名 | `start_recovery_attempt(StartRecoveryAttemptRequest) -> Result<RecoveryAttemptCommandResult, ProcessApiError>` |
| RPC 名称 | `process.command.start_recovery_attempt` |
| 调用方 | operator / system recovery |
| 处理方 | `RecoveryCommandHandler -> ProcessRecoveryService` |

```rust
/// Request to start a recovery attempt from a checkpoint.
pub struct StartRecoveryAttemptRequest {
    /// Actor and authority context.
    pub actor_context: ActorContext,
    /// Command metadata and idempotency key.
    pub metadata: CommandMetadata,
    /// Checkpoint to use for recovery.
    pub checkpoint_ref: ProcessCheckpointRef,
    /// Reason for recovery.
    pub recovery_reason: RecoveryReason,
}

/// Result of recovery attempt commands.
pub struct RecoveryAttemptCommandResult {
    /// Recovery attempt affected by the command.
    pub recovery_attempt_ref: RecoveryAttemptRef,
    /// Process instance being recovered.
    pub process_instance_ref: ProcessInstanceRef,
    /// Checkpoint used by the attempt.
    pub checkpoint_ref: ProcessCheckpointRef,
    /// Resulting recovery state.
    pub recovery_state: RecoveryAttemptState,
    /// Optional failure reason.
    pub failure_reason: Option<RecoveryFailureReason>,
    /// Optional abandon reason.
    pub abandon_reason: Option<RecoveryAbandonReason>,
    /// Recovery history record.
    pub history_record_ref: RecoveryHistoryRecordRef,
    /// Outbox record created when a truth change occurred.
    pub outbox_record_ref: Option<ProcessOutboxRef>,
    /// Command receipt for idempotency replay.
    pub receipt: CommandReceipt,
}
```

`RecoveryAttemptCommandResult.history_record_ref` 指向该 command 的 primary history record:`StartRecoveryAttempt` 使用 `AttemptStarted`;`CompleteRecoveryAttempt` 使用 `AttemptApplied` / `AttemptFailed` / `AttemptAbandoned`。若同一 accepted transaction 还追加 instance recovery history,该 additional record 只通过 history repository / trace 暴露,不替代 primary result ref。

##### 7.6.11 `CompleteRecoveryAttempt`

| 项 | 内容 |
|---|---|
| 函数签名 | `complete_recovery_attempt(CompleteRecoveryAttemptRequest) -> Result<RecoveryAttemptCommandResult, ProcessApiError>` |
| RPC 名称 | `process.command.complete_recovery_attempt` |
| 调用方 | operator / system recovery |
| 处理方 | `RecoveryCommandHandler -> ProcessRecoveryService` |

```rust
/// Request to complete or fail a recovery attempt.
pub struct CompleteRecoveryAttemptRequest {
    /// Actor and authority context.
    pub actor_context: ActorContext,
    /// Command metadata and idempotency key.
    pub metadata: CommandMetadata,
    /// Recovery attempt to complete.
    pub recovery_attempt_ref: RecoveryAttemptRef,
    /// Desired recovery outcome.
    pub recovery_outcome: RecoveryOutcome,
    /// Failure reason when outcome is failed.
    pub failure_reason: Option<RecoveryFailureReason>,
    /// Abandon reason when outcome is abandoned.
    pub abandon_reason: Option<RecoveryAbandonReason>,
}
```

字段闭环:

| `recovery_outcome` | `failure_reason` | `abandon_reason` | Domain 调用 | 缺失 / 冲突处理 |
|---|---|---|---|---|
| `Applied` | 必须为空 | 必须为空 | `RecoveryAttempt.mark_applied(...)`;随后 `ProcessInstance.complete_recovery(...)` | 任一 reason 存在 -> `InvalidRequest` |
| `Failed` | 必填 | 必须为空 | `RecoveryAttempt.mark_failed(failure_reason)` | 缺失 failure 或存在 abandon -> `InvalidRequest` |
| `Abandoned` | 必须为空 | 必填 | `RecoveryAttempt.abandon(abandon_reason, actor)` | 缺失 abandon 或存在 failure -> `InvalidRequest` |

##### 7.6.12 `BindProcessTimebox`

| 项 | 内容 |
|---|---|
| 函数签名 | `bind_process_timebox(BindProcessTimeboxRequest) -> Result<ProcessTimingCommandResult, ProcessApiError>` |
| RPC 名称 | `process.command.bind_process_timebox` |
| 调用方 | process actor / work integration |
| 处理方 | `RhythmCommandHandler -> ProcessRhythmService` |

```rust
/// Request to bind a process timebox to an external work timebox.
pub struct BindProcessTimeboxRequest {
    /// Actor and authority context.
    pub actor_context: ActorContext,
    /// Command metadata and idempotency key.
    pub metadata: CommandMetadata,
    /// Process instance or profile subject for the binding.
    pub process_subject_ref: ProcessTimingSubjectRef,
    /// Process-owned timebox reference.
    pub process_timebox_ref: ProcessTimeboxRef,
    /// External work timebox or iteration reference.
    pub external_timebox_ref: ExternalTimeboxRef,
    /// Reason for rhythm binding.
    pub rhythm_reason: RhythmReason,
}

/// Result of process timing commands.
pub struct ProcessTimingCommandResult {
    /// Timing subject affected by the command.
    pub process_subject_ref: ProcessTimingSubjectRef,
    /// Stage state affected when applicable.
    pub stage_ref: Option<ProcessStageRef>,
    /// Timebox binding affected when applicable.
    pub timebox_binding_ref: Option<ProcessTimeboxBindingRef>,
    /// Resulting stage state when applicable.
    pub stage_state: Option<StageState>,
    /// Resulting binding state when applicable.
    pub binding_state: Option<TimeboxBindingState>,
    /// Outbox record created when a truth change occurred.
    pub outbox_record_ref: Option<ProcessOutboxRef>,
    /// Command receipt for idempotency replay.
    pub receipt: CommandReceipt,
}
```

##### 7.6.13 `UpdateProcessStageState`

| 项 | 内容 |
|---|---|
| 函数签名 | `update_process_stage_state(UpdateProcessStageStateRequest) -> Result<ProcessTimingCommandResult, ProcessApiError>` |
| RPC 名称 | `process.command.update_process_stage_state` |
| 调用方 | process actor / operator |
| 处理方 | `RhythmCommandHandler -> ProcessRhythmService` |

```rust
/// Request to update a process stage state.
pub struct UpdateProcessStageStateRequest {
    /// Actor and authority context.
    pub actor_context: ActorContext,
    /// Command metadata and idempotency key.
    pub metadata: CommandMetadata,
    /// Stage state to update.
    pub stage_ref: ProcessStageRef,
    /// Requested stage target.
    pub stage_target: StageTarget,
    /// Reason for the stage change.
    pub stage_change_reason: StageChangeReason,
}
```

#### 7.7 Command result duplicate replay matrix

| Command | Stored result variant | Duplicate behavior |
|---|---|---|
| `SyncRuntimeProcessShape` | `StoredProcessOperationResult::Command(StoredProcessCommandResult::RuntimeShape)` | return stored `RuntimeProcessShapeCommandResult` with `receipt.duplicate = true` |
| `AdoptProcessProfile` | `StoredProcessOperationResult::Command(StoredProcessCommandResult::ProcessProfile)` | return stored `ProcessProfileCommandResult` with `receipt.duplicate = true` |
| `UpdateProcessProfileTailoring` | `StoredProcessOperationResult::Command(StoredProcessCommandResult::ProcessProfile)` | return stored `ProcessProfileCommandResult` with `receipt.duplicate = true` |
| `StartProcessInstance` | `StoredProcessOperationResult::Command(StoredProcessCommandResult::ProcessInstance)` | return stored `ProcessInstanceCommandResult` with `receipt.duplicate = true` |
| `AdvanceProcessActivity` | `StoredProcessOperationResult::Command(StoredProcessCommandResult::ActivityProgression)` | return stored `ActivityProgressionCommandResult` with `receipt.duplicate = true` |
| `RecordActivityFeedback` | `StoredProcessOperationResult::Command(StoredProcessCommandResult::ActivityProgression)` | return stored `ActivityProgressionCommandResult` with `receipt.duplicate = true` |
| `OpenWaitingGate` | `StoredProcessOperationResult::Command(StoredProcessCommandResult::WaitingGate)` | return stored `WaitingGateCommandResult` with `receipt.duplicate = true` |
| `ResumeWaitingGate` | `StoredProcessOperationResult::Command(StoredProcessCommandResult::WaitingGate)` | return stored `WaitingGateCommandResult` with `receipt.duplicate = true` |
| `CreateProcessCheckpoint` | `StoredProcessOperationResult::Command(StoredProcessCommandResult::ProcessCheckpoint)` | return stored `ProcessCheckpointCommandResult` with `receipt.duplicate = true` |
| `StartRecoveryAttempt` | `StoredProcessOperationResult::Command(StoredProcessCommandResult::RecoveryAttempt)` | return stored `RecoveryAttemptCommandResult` with `receipt.duplicate = true` |
| `CompleteRecoveryAttempt` | `StoredProcessOperationResult::Command(StoredProcessCommandResult::RecoveryAttempt)` | return stored `RecoveryAttemptCommandResult` with `receipt.duplicate = true` |
| `BindProcessTimebox` | `StoredProcessOperationResult::Command(StoredProcessCommandResult::ProcessTiming)` | return stored `ProcessTimingCommandResult` with `receipt.duplicate = true` |
| `UpdateProcessStageState` | `StoredProcessOperationResult::Command(StoredProcessCommandResult::ProcessTiming)` | return stored `ProcessTimingCommandResult` with `receipt.duplicate = true` |

Consumer / job duplicate replay:

| Operation | Stored result variant | Duplicate behavior |
|---|---|---|
| inbound consumer event | `StoredProcessOperationResult::Consumer` | return stored `ConsumerReceipt` refs / markers with `disposition = Duplicate`;do not recompute marker refs |
| operations job run | `StoredProcessOperationResult::Job` | return stored `JobRunReceipt` with original counters and `disposition` preserved unless Step 12 maps duplicate to an explicit duplicate marker |

Rule:`OperationResultRepository::get_result(result_ref)` variant mismatch is treated as missing / invalid idempotency result;handler must not rebuild a consumer receipt or job receipt from current snapshots, markers, reports, or counters.

#### 7.8 Query request / response 共享 schema

所有 Query request 必须携带 `actor_context` 和 `metadata: QueryMetadata`。Query 不携带 command idempotency key,不得触发 snapshot refresh、projection rebuild 或 truth write。

```rust
/// Generic query response wrapper for process views.
pub struct ProcessQueryResponse<T> {
    /// Requested subject reference.
    pub subject_ref: ProcessReadSubjectRef,
    /// Public status of the requested view.
    pub status: ProcessViewStatus,
    /// Returned view when status allows a body.
    pub view: Option<T>,
    /// Visibility marker when visibility filtered or denied the view.
    pub visibility_marker: Option<ProcessVisibilityMarker>,
    /// Degraded marker when data is stale, partial, or unavailable.
    pub degraded_marker: Option<ProcessDegradedMarker>,
    /// Projection marker when the view comes from a projection.
    pub projection_marker: Option<ProjectionStatusMarker>,
}

/// Page response wrapper for process search and timeline queries.
pub struct ProcessPageResponse<T> {
    /// Requested subject or search scope.
    pub subject_ref: ProcessReadSubjectRef,
    /// Public status of the page.
    pub status: ProcessViewStatus,
    /// Items returned in this page.
    pub items: Vec<T>,
    /// Page information.
    pub page_info: ProcessPageInfo,
    /// Visibility marker when data was filtered.
    pub visibility_marker: Option<ProcessVisibilityMarker>,
    /// Degraded marker when data is stale or partial.
    pub degraded_marker: Option<ProcessDegradedMarker>,
    /// Projection marker when the page comes from a projection.
    pub projection_marker: Option<ProjectionStatusMarker>,
}
```

Query response rules:

- `status = Available`: `view` may be `Some` for object query; page `items` may be empty.
- `status = Missing`: `view = None`,`items = []`,must not synthesize a view id.
- `status = NotVisible`: `view = None`,`items = []`,must include `visibility_marker`.
- `status = Degraded`: may include `view` / `items`,must include `degraded_marker`.
- `status = Unavailable`: `view = None` unless a stale fallback is explicitly returned with `Degraded`.

#### 7.9 Query view DTO schema

##### 7.9.1 `RuntimeProcessShapeView`

```rust
/// Public view for a runtime process shape.
pub struct RuntimeProcessShapeView {
    /// Runtime shape reference.
    pub shape_ref: RuntimeProcessShapeRef,
    /// Source method definition reference.
    pub definition_ref: MethodDefinitionRef,
    /// Source method definition version reference.
    pub definition_version_ref: MethodDefinitionVersionRef,
    /// Current runtime shape state.
    pub shape_state: RuntimeProcessShapeState,
    /// Source snapshot reference.
    pub source_snapshot_ref: MethodDefinitionSnapshotRef,
}
```

Repository key:`RuntimeProcessShapeRef`;fallback source:`ProcessShapeRepository::get`.

##### 7.9.2 `ProcessProfileView`

```rust
/// Public view for an adopted process profile.
pub struct ProcessProfileView {
    /// Process profile reference.
    pub profile_ref: ProcessProfileRef,
    /// External project reference.
    pub project_ref: ProjectRef,
    /// Adopted runtime shape reference.
    pub shape_ref: RuntimeProcessShapeRef,
    /// Current profile state.
    pub profile_state: ProcessProfileState,
    /// Last profile change record.
    pub last_change_ref: Option<ProfileChangeRecordRef>,
}
```

Repository key:`ProcessProfileRef`;fallback source:`ProcessProfileRepository::get`.

##### 7.9.3 `ProcessInstanceView`

```rust
/// Public view for one process instance.
pub struct ProcessInstanceView {
    /// Process instance reference.
    pub process_instance_ref: ProcessInstanceRef,
    /// Profile used by the instance.
    pub profile_ref: ProcessProfileRef,
    /// External project reference.
    pub project_ref: ProjectRef,
    /// Current instance state.
    pub instance_state: ProcessInstanceState,
    /// Current activity reference.
    pub current_activity_ref: Option<ActivityRef>,
    /// Token set reference for flow control.
    pub token_set_ref: ProcessTokenSetRef,
    /// Read model reference when this view uses projection data.
    pub read_model_ref: Option<ProcessReadModelRef>,
}
```

Repository key:`ProcessInstanceRef`;fallback source:`ProcessInstanceRepository::get`.

##### 7.9.4 `ActivityStatusView`

`ActivityStatusView` public schema follows Step 6 object contract and is exposed from `contracts/src/views.rs`:

| 字段 | 类型 | 字段来源 | empty / degraded 口径 |
|---|---|---|---|
| `activity_status_view_id` | `ActivityStatusViewId` | stable derived from `ActivityRef` or projection id | missing subject -> no view |
| `activity_ref` | `ActivityRef` | `Activity.activity_id` | required when view exists |
| `activity_state` | `ActivityState` | committed `Activity.activity_state` | not visible -> no view |
| `assignee_ref` | `Option<ActorRef>` | committed `Activity.assignee_ref` | may be filtered |
| `feedback_state` | `ReferenceResolutionState` | runtime feedback reference state | unresolved / stale -> degraded |

##### 7.9.5 `WaitingGateView`

```rust
/// Public view for one waiting gate.
pub struct WaitingGateView {
    /// Waiting gate reference.
    pub waiting_gate_ref: WaitingGateRef,
    /// Owning process instance.
    pub process_instance_ref: ProcessInstanceRef,
    /// Activity that opened the gate.
    pub activity_ref: ActivityRef,
    /// Current waiting gate state.
    pub gate_state: WaitingGateState,
    /// Pause context reference.
    pub pause_context_ref: PauseContextRef,
    /// Pause reason copied from pause context.
    pub pause_reason: PauseReason,
    /// Resume requirement reference.
    pub resume_requirement_ref: ResumeRequirementRef,
    /// Optional governance decision evidence.
    pub decision_ref: Option<GovernanceDecisionRef>,
}
```

Repository key:`WaitingGateRef`;fallback source:`WaitingGateRepository::get_gate` + `WaitingGateRepository::get_pause_context(gate.pause_context_ref)`. Missing pause context returns `status = Degraded`.

##### 7.9.6 `RecoveryStatusView`

```rust
/// Public view for checkpoint and recovery status.
pub struct RecoveryStatusView {
    /// Process instance being recovered or observed.
    pub process_instance_ref: ProcessInstanceRef,
    /// Checkpoint reference when available.
    pub checkpoint_ref: Option<ProcessCheckpointRef>,
    /// Checkpoint validity state when a checkpoint is present.
    pub checkpoint_state: Option<CheckpointState>,
    /// Recovery attempt reference when available.
    pub recovery_attempt_ref: Option<RecoveryAttemptRef>,
    /// Recovery attempt state when present.
    pub recovery_state: Option<RecoveryAttemptState>,
    /// Latest recovery history record when available.
    pub latest_history_ref: Option<RecoveryHistoryRecordRef>,
}
```

Repository key:`ProcessInstanceRef` or `RecoveryAttemptRef`;fallback source:`CheckpointRepository` + `RecoveryRepository`.

##### 7.9.7 `ProcessTimelineView`

Public `ProcessTimelineView` response uses a page of `ProcessTimelineEntryView` instead of exposing only `entry_refs`,because public callers need stable entry metadata without reading trace body.

```rust
/// Public timeline entry view.
pub struct ProcessTimelineEntryView {
    /// Timeline entry reference.
    pub entry_ref: ProcessTimelineEntryRef,
    /// Trace record reference backing this entry.
    pub trace_record_ref: ProcessTraceRecordRef,
    /// Subject referenced by the trace.
    pub subject_ref: ProcessTraceSubjectRef,
    /// Committed truth change reference.
    pub change_ref: ProcessTruthChangeRef,
    /// Time associated with the entry.
    pub occurred_at: Timestamp,
}
```

Repository key:`ProcessInstanceRef`;fallback source:`TraceRepository::list_trace_records`. `has_gap = true` maps to `ProcessDegradedMarker`.

##### 7.9.8 `ProcessProgressSummaryView`

```rust
/// Public process progress summary view.
pub struct ProcessProgressSummaryView {
    /// Summary reference.
    pub summary_ref: ProcessProgressSummaryRef,
    /// Process instance represented by the summary.
    pub process_instance_ref: ProcessInstanceRef,
    /// Current stage when available.
    pub stage_ref: Option<ProcessStageRef>,
    /// Consumer-facing progress state.
    pub progress_state: ProcessProgressState,
    /// Derived view state reference.
    pub view_state_ref: DerivedProcessViewStateRef,
}
```

Repository key:`ProcessInstanceRef` or `WorkContextRef`;fallback source:`ProjectionRepository::find_read_model`.

##### 7.9.9 `ProcessSearchResultPage`

```rust
/// Search result item for process instances.
pub struct ProcessSearchResultItem {
    /// Read model reference.
    pub read_model_ref: ProcessReadModelRef,
    /// Process instance reference.
    pub process_instance_ref: ProcessInstanceRef,
    /// Profile reference.
    pub profile_ref: ProcessProfileRef,
    /// Current activity reference.
    pub current_activity_ref: Option<ActivityRef>,
    /// Projection state reference.
    pub view_state_ref: DerivedProcessViewStateRef,
}

/// Public page returned by SearchProcessInstances.
pub struct ProcessSearchResultPage {
    /// Search items.
    pub items: Vec<ProcessSearchResultItem>,
    /// Page metadata.
    pub page_info: ProcessPageInfo,
    /// Response status.
    pub status: ProcessViewStatus,
    /// Projection marker for the search index.
    pub projection_marker: Option<ProjectionStatusMarker>,
    /// Degraded marker when search data is stale or partial.
    pub degraded_marker: Option<ProcessDegradedMarker>,
}
```

Repository key:`ProcessSearchFilter`;fallback source:`ProjectionRepository::search_instances`. Empty search returns `items = []` and `status = Available`.

##### 7.9.10 `ProcessTraceView`

```rust
/// Public process trace view item.
pub struct ProcessTraceEntryView {
    /// Trace record reference.
    pub trace_record_ref: ProcessTraceRecordRef,
    /// Trace subject reference.
    pub subject_ref: ProcessTraceSubjectRef,
    /// Trace context copied for correlation.
    pub trace_context: TraceContext,
    /// Committed change reference.
    pub change_ref: ProcessTruthChangeRef,
}

/// Public process trace view page.
pub struct ProcessTraceView {
    /// Trace subject requested by the caller.
    pub subject_ref: ProcessTraceSubjectRef,
    /// Trace entries.
    pub entries: Vec<ProcessTraceEntryView>,
    /// Page metadata.
    pub page_info: ProcessPageInfo,
    /// Visibility marker when entries are filtered.
    pub visibility_marker: Option<ProcessVisibilityMarker>,
}
```

Repository key:`ProcessTraceSubjectRef`;fallback source:`TraceRepository::list_trace_records`.

##### 7.9.11 `ReconciliationReportView`

```rust
/// Public reconciliation report view.
pub struct ReconciliationReportView {
    /// Report reference.
    pub report_ref: ReconciliationReportRef,
    /// Scope covered by the report.
    pub scope_ref: ProcessReconciliationScopeRef,
    /// Result state of the report.
    pub result_state: ReconciliationResultState,
    /// Issue references discovered by the report.
    pub issue_refs: ReconciliationIssueRefSet,
}
```

Repository key:`ReconciliationReportRef`;fallback source:`ReconciliationReportRepository::get_report`.

#### 7.10 Query protocols

##### 7.10.1 `GetRuntimeProcessShape`

```rust
/// Request to get a runtime process shape view.
pub struct GetRuntimeProcessShapeRequest {
    /// Actor and authority context.
    pub actor_context: ActorContext,
    /// Query metadata.
    pub metadata: QueryMetadata,
    /// Runtime shape reference.
    pub shape_ref: RuntimeProcessShapeRef,
}
```

| 项 | 内容 |
|---|---|
| 函数签名 | `get_runtime_process_shape(GetRuntimeProcessShapeRequest) -> Result<ProcessQueryResponse<RuntimeProcessShapeView>, ProcessApiError>` |
| RPC 名称 | `process.query.get_runtime_process_shape` |
| repository key | `RuntimeProcessShapeRef` |
| missing 口径 | `status = Missing`, no view |

##### 7.10.2 `GetProcessProfile`

```rust
/// Request to get a process profile view.
pub struct GetProcessProfileRequest {
    /// Actor and authority context.
    pub actor_context: ActorContext,
    /// Query metadata.
    pub metadata: QueryMetadata,
    /// Process profile reference.
    pub profile_ref: ProcessProfileRef,
}
```

| 项 | 内容 |
|---|---|
| 函数签名 | `get_process_profile(GetProcessProfileRequest) -> Result<ProcessQueryResponse<ProcessProfileView>, ProcessApiError>` |
| RPC 名称 | `process.query.get_process_profile` |
| repository key | `ProcessProfileRef` |
| degraded 口径 | shape snapshot stale -> degraded marker |

##### 7.10.3 `GetProcessInstance`

```rust
/// Request to get a process instance view.
pub struct GetProcessInstanceRequest {
    /// Actor and authority context.
    pub actor_context: ActorContext,
    /// Query metadata.
    pub metadata: QueryMetadata,
    /// Process instance reference.
    pub process_instance_ref: ProcessInstanceRef,
}
```

| 项 | 内容 |
|---|---|
| 函数签名 | `get_process_instance(GetProcessInstanceRequest) -> Result<ProcessQueryResponse<ProcessInstanceView>, ProcessApiError>` |
| RPC 名称 | `process.query.get_process_instance` |
| repository key | `ProcessInstanceRef` |
| not visible 口径 | `ReadVisibilityPolicy` reject -> `status = NotVisible` |

##### 7.10.4 `GetActivityStatus`

```rust
/// Request to get an activity status view.
pub struct GetActivityStatusRequest {
    /// Actor and authority context.
    pub actor_context: ActorContext,
    /// Query metadata.
    pub metadata: QueryMetadata,
    /// Activity reference.
    pub activity_ref: ActivityRef,
}
```

| 项 | 内容 |
|---|---|
| 函数签名 | `get_activity_status(GetActivityStatusRequest) -> Result<ProcessQueryResponse<ActivityStatusView>, ProcessApiError>` |
| RPC 名称 | `process.query.get_activity_status` |
| repository key | `ActivityRef` |
| degraded 口径 | feedback unresolved / stale -> degraded marker |

##### 7.10.5 `GetWaitingGate`

```rust
/// Request to get a waiting gate view.
pub struct GetWaitingGateRequest {
    /// Actor and authority context.
    pub actor_context: ActorContext,
    /// Query metadata.
    pub metadata: QueryMetadata,
    /// Waiting gate reference.
    pub waiting_gate_ref: WaitingGateRef,
}
```

| 项 | 内容 |
|---|---|
| 函数签名 | `get_waiting_gate(GetWaitingGateRequest) -> Result<ProcessQueryResponse<WaitingGateView>, ProcessApiError>` |
| RPC 名称 | `process.query.get_waiting_gate` |
| repository key | `WaitingGateRef` |
| degraded 口径 | missing pause context or unresolved decision -> degraded marker |

##### 7.10.6 `GetRecoveryStatus`

```rust
/// Request to get recovery status for an instance or attempt.
pub struct GetRecoveryStatusRequest {
    /// Actor and authority context.
    pub actor_context: ActorContext,
    /// Query metadata.
    pub metadata: QueryMetadata,
    /// Recovery subject.
    pub recovery_subject_ref: RecoveryStatusSubjectRef,
}
```

| 项 | 内容 |
|---|---|
| 函数签名 | `get_recovery_status(GetRecoveryStatusRequest) -> Result<ProcessQueryResponse<RecoveryStatusView>, ProcessApiError>` |
| RPC 名称 | `process.query.get_recovery_status` |
| repository key | `ProcessInstanceRef` or `RecoveryAttemptRef` inside `RecoveryStatusSubjectRef` |
| missing 口径 | no checkpoint / attempt -> Available view with empty optional fields; missing subject -> Missing |

##### 7.10.7 `GetProcessTimeline`

```rust
/// Request to get a process timeline page.
pub struct GetProcessTimelineRequest {
    /// Actor and authority context.
    pub actor_context: ActorContext,
    /// Query metadata.
    pub metadata: QueryMetadata,
    /// Process instance reference.
    pub process_instance_ref: ProcessInstanceRef,
    /// Page request.
    pub page: ProcessPageRequest,
    /// Optional timeline filter.
    pub filter_ref: Option<ProcessTimelineFilterRef>,
}
```

| 项 | 内容 |
|---|---|
| 函数签名 | `get_process_timeline(GetProcessTimelineRequest) -> Result<ProcessPageResponse<ProcessTimelineEntryView>, ProcessApiError>` |
| RPC 名称 | `process.query.get_process_timeline` |
| repository key | `ProcessInstanceRef` + page cursor |
| empty 口径 | no entries -> `items = []`, `status = Available` |

##### 7.10.8 `GetProcessProgressSummary`

```rust
/// Request to get a process progress summary.
pub struct GetProcessProgressSummaryRequest {
    /// Actor and authority context.
    pub actor_context: ActorContext,
    /// Query metadata.
    pub metadata: QueryMetadata,
    /// Summary subject.
    pub summary_subject_ref: ProcessSummarySubjectRef,
}
```

| 项 | 内容 |
|---|---|
| 函数签名 | `get_process_progress_summary(GetProcessProgressSummaryRequest) -> Result<ProcessQueryResponse<ProcessProgressSummaryView>, ProcessApiError>` |
| RPC 名称 | `process.query.get_process_progress_summary` |
| repository key | `ProcessInstanceRef` or `WorkContextRef` |
| degraded 口径 | projection stale / rebuilding -> degraded marker |

##### 7.10.9 `SearchProcessInstances`

```rust
/// Request to search process instances by projection filters.
pub struct SearchProcessInstancesRequest {
    /// Actor and authority context.
    pub actor_context: ActorContext,
    /// Query metadata.
    pub metadata: QueryMetadata,
    /// Optional work context filter.
    pub work_context_ref: Option<WorkContextRef>,
    /// Optional process profile filter.
    pub profile_ref: Option<ProcessProfileRef>,
    /// Optional instance state filter.
    pub instance_state: Option<ProcessInstanceState>,
    /// Page request.
    pub page: ProcessPageRequest,
}
```

| 项 | 内容 |
|---|---|
| 函数签名 | `search_process_instances(SearchProcessInstancesRequest) -> Result<ProcessSearchResultPage, ProcessApiError>` |
| RPC 名称 | `process.query.search_process_instances` |
| repository key | `ProcessSearchFilter` derived from filters |
| disabled 口径 | `status = Unavailable`, projection marker with `Disabled` |

Filter construction:

- `ProcessSearchFilter.work_context_ref = request.work_context_ref`.
- `ProcessSearchFilter.profile_ref = request.profile_ref`.
- `ProcessSearchFilter.instance_state = request.instance_state`.
- `ProcessSearchFilter.page = request.page`.
- empty filter is allowed and means repository default searchable process instance scope.

##### 7.10.10 `GetProcessTrace`

```rust
/// Request to get process trace entries.
pub struct GetProcessTraceRequest {
    /// Actor and authority context.
    pub actor_context: ActorContext,
    /// Query metadata.
    pub metadata: QueryMetadata,
    /// Trace subject reference.
    pub trace_subject_ref: ProcessTraceSubjectRef,
    /// Page request.
    pub page: ProcessPageRequest,
}
```

| 项 | 内容 |
|---|---|
| 函数签名 | `get_process_trace(GetProcessTraceRequest) -> Result<ProcessTraceView, ProcessApiError>` |
| RPC 名称 | `process.query.get_process_trace` |
| repository key | `ProcessTraceSubjectRef` + page cursor |
| visibility 口径 | filtered entries require `visibility_marker` |

##### 7.10.11 `GetReconciliationReport`

```rust
/// Request to get a reconciliation report.
pub struct GetReconciliationReportRequest {
    /// Actor and authority context.
    pub actor_context: ActorContext,
    /// Query metadata.
    pub metadata: QueryMetadata,
    /// Report reference.
    pub report_ref: ReconciliationReportRef,
}
```

| 项 | 内容 |
|---|---|
| 函数签名 | `get_reconciliation_report(GetReconciliationReportRequest) -> Result<ProcessQueryResponse<ReconciliationReportView>, ProcessApiError>` |
| RPC 名称 | `process.query.get_reconciliation_report` |
| repository key | `ReconciliationReportRef` |
| missing 口径 | `status = Missing`, no view |

#### 7.11 Query naming convergence table

| HLD query | Rust request DTO | Rust response DTO |
|---|---|---|
| `GetRuntimeProcessShape` | `GetRuntimeProcessShapeRequest` | `ProcessQueryResponse<RuntimeProcessShapeView>` |
| `GetProcessProfile` | `GetProcessProfileRequest` | `ProcessQueryResponse<ProcessProfileView>` |
| `GetProcessInstance` | `GetProcessInstanceRequest` | `ProcessQueryResponse<ProcessInstanceView>` |
| `GetActivityStatus` | `GetActivityStatusRequest` | `ProcessQueryResponse<ActivityStatusView>` |
| `GetWaitingGate` | `GetWaitingGateRequest` | `ProcessQueryResponse<WaitingGateView>` |
| `GetRecoveryStatus` | `GetRecoveryStatusRequest` | `ProcessQueryResponse<RecoveryStatusView>` |
| `GetProcessTimeline` | `GetProcessTimelineRequest` | `ProcessPageResponse<ProcessTimelineEntryView>` |
| `GetProcessProgressSummary` | `GetProcessProgressSummaryRequest` | `ProcessQueryResponse<ProcessProgressSummaryView>` |
| `SearchProcessInstances` | `SearchProcessInstancesRequest` | `ProcessSearchResultPage` |
| `GetProcessTrace` | `GetProcessTraceRequest` | `ProcessTraceView` |
| `GetReconciliationReport` | `GetReconciliationReportRequest` | `ProcessQueryResponse<ReconciliationReportView>` |

#### 7.12 Inbound Event envelope / receipt schema

```rust
/// Inbound event envelope shared by all process consumers.
pub struct InboundEventEnvelope<T> {
    /// Metadata used for event identity, source isolation, dedup, and trace.
    pub metadata: EventMetadata,
    /// Typed event payload.
    pub payload: T,
}

/// Result receipt returned by inbound consumers.
pub struct ConsumerReceipt {
    /// Source event id from the envelope.
    pub source_event_id: SourceEventId,
    /// Dedup key from the envelope.
    pub dedup_key: EventDedupKey,
    /// Consumer disposition.
    pub disposition: ConsumerDisposition,
    /// Snapshot or reference state written by the consumer.
    pub reference_state_ref: Option<ReferenceResolutionStateRef>,
    /// Trace record created when a marker was written.
    pub trace_record_ref: Option<ProcessTraceRecordRef>,
    /// Quarantine marker when the event was quarantined.
    pub quarantine_marker: Option<QuarantineMarker>,
    /// Delayed marker when the event must be retried later.
    pub delayed_marker: Option<DelayedConsumerMarker>,
    /// No-op marker when no state change was required.
    pub noop_marker: Option<NoopConsumerMarker>,
}

/// Consumer disposition for inbound events.
pub enum ConsumerDisposition {
    /// The event was accepted and processed.
    Accepted,
    /// The same event was already processed.
    Duplicate,
    /// The event was rejected into quarantine.
    Quarantined,
    /// The event should be retried later.
    Delayed,
    /// The event was valid but did not require a state change.
    Noop,
}

/// Marker explaining why an inbound event was quarantined.
pub struct QuarantineMarker {
    /// Quarantine reason.
    pub reason_ref: QuarantineReasonRef,
    /// Field or payload reference that caused quarantine.
    pub offending_ref: Option<ProtocolFieldRef>,
}

/// Marker explaining delayed consumer processing.
pub struct DelayedConsumerMarker {
    /// Delay reason.
    pub reason_ref: DelayReasonRef,
    /// Earliest timestamp when retry is allowed.
    pub retry_after: Option<Timestamp>,
}

/// Marker explaining a no-op consumer result.
pub struct NoopConsumerMarker {
    /// No-op reason.
    pub reason_ref: NoopReasonRef,
}
```

Inbound envelope validation:

| Missing / invalid field | Disposition | Rule |
|---|---|---|
| `metadata.event_envelope_ref` | `Quarantined` | cannot identify envelope |
| `metadata.source_event_id` | `Quarantined` | cannot deduplicate |
| `metadata.source_ref` | `Quarantined` | cannot verify source isolation |
| `metadata.source_actor_ref` | `Quarantined` | trusted source actor required |
| `metadata.schema_version` unsupported | `Quarantined` | unsupported version is not processed |
| `metadata.dedup_key` duplicate | `Duplicate` | return existing receipt |
| source unavailable | `Delayed` | retry without truth write |
| valid event but no affected process subject | `Noop` | no truth write |

Trusted source actor rule:

- `TrustedSourceActorRef` is valid only inside inbound consumer processing.
- It may write snapshot / reference / pending / stale marker through application consumer service.
- It must not call command domain transitions such as `Activity::complete`, `WaitingGate::resume`, or `ProcessInstance::advance`.
- It does not bypass digest validation, forbidden-body checks, dedup, schema version, source isolation, or state gate.

#### 7.13 Inbound Event payload schema

##### 7.13.1 `MethodDefinitionChangedEvent`

```rust
/// Payload for method definition changes consumed by process.
pub struct MethodDefinitionChangedEvent {
    /// Method definition reference.
    pub definition_ref: MethodDefinitionRef,
    /// Method definition version reference.
    pub definition_version_ref: MethodDefinitionVersionRef,
    /// Method definition kind.
    pub definition_kind: MethodDefinitionKind,
    /// Source digest proving the summary.
    pub source_digest: Option<SourceDigest>,
}
```

| Event 名称 | `method.definition.changed.v1` |
|---|---|
| 发布方 | `L3-method-library` |
| 处理方 | `ProcessInboundConsumer.consume_method_definition_changed` |
| 写入 | `MethodDefinitionSnapshot`、`ReferenceResolutionState`、affected shape / profile stale marker |
| 禁止 | method definition body |

##### 7.13.2 `WorkContextChangedEvent`

```rust
/// Payload for external work context changes.
pub struct WorkContextChangedEvent {
    /// External work context reference.
    pub work_context_ref: WorkContextRef,
    /// Optional project reference.
    pub project_ref: Option<ProjectRef>,
    /// Optional iteration reference.
    pub iteration_ref: Option<IterationRef>,
    /// Optional external timebox reference.
    pub external_timebox_ref: Option<ExternalTimeboxRef>,
    /// Source version reference.
    pub source_version_ref: Option<SourceVersionRef>,
}
```

| Event 名称 | `work.context.changed.v1` |
|---|---|
| 发布方 | `L1-work` |
| 处理方 | `ProcessInboundConsumer.consume_work_context_changed` |
| 写入 | `WorkContextSnapshot`、`ReferenceResolutionState`、timebox / view stale marker |
| 禁止 | Project、WorkItem、Iteration truth body |

##### 7.13.3 `IdentityActorCapabilityChangedEvent`

```rust
/// Payload for actor capability changes.
pub struct IdentityActorCapabilityChangedEvent {
    /// Actor reference.
    pub actor_ref: ActorRef,
    /// Optional global member reference.
    pub member_ref: Option<GlobalMemberRef>,
    /// Capability references available to the actor.
    pub capability_refs: CapabilityRefSet,
    /// Source version reference.
    pub source_version_ref: Option<SourceVersionRef>,
}
```

| Event 名称 | `identity.actor_capability.changed.v1` |
|---|---|
| 发布方 | `L1-identity` |
| 处理方 | `ProcessInboundConsumer.consume_identity_actor_capability_changed` |
| 写入 | `ActorCapabilitySnapshot`、`ReferenceResolutionState` |
| 禁止 | identity profile body |

##### 7.13.4 `GovernanceDecisionChangedEvent`

```rust
/// Payload for governance decision changes relevant to process waiting gates.
pub struct GovernanceDecisionChangedEvent {
    /// External governance decision reference.
    pub decision_ref: ExternalDecisionRef,
    /// Governance decision kind.
    pub decision_kind: GovernanceDecisionKind,
    /// Waiting gate or resume requirement affected when known.
    pub resume_requirement_ref: Option<ResumeRequirementRef>,
    /// Source digest proving the decision summary.
    pub source_digest: Option<SourceDigest>,
}
```

| Event 名称 | `governance.decision.changed.v1` |
|---|---|
| 发布方 | `L1-governance` |
| 处理方 | `ProcessInboundConsumer.consume_governance_decision_changed` |
| 写入 | `GovernanceDecisionRef` marker、waiting gate stale / resumable marker |
| 禁止 | automatic `ResumeWaitingGate` |

##### 7.13.5 `ArtifactEvidenceChangedEvent`

```rust
/// Payload for artifact evidence changes relevant to checkpoint or recovery.
pub struct ArtifactEvidenceChangedEvent {
    /// Artifact evidence reference.
    pub evidence_ref: ArtifactEvidenceRef,
    /// Evidence kind.
    pub evidence_kind: ArtifactEvidenceKind,
    /// Optional checkpoint affected by the evidence.
    pub checkpoint_ref: Option<ProcessCheckpointRef>,
    /// Source digest proving the evidence summary.
    pub source_digest: Option<SourceDigest>,
}
```

| Event 名称 | `artifact.evidence.changed.v1` |
|---|---|
| 发布方 | `L1-artifact` |
| 处理方 | `ProcessInboundConsumer.consume_artifact_evidence_changed` |
| 写入 | artifact evidence marker、reference state |
| 禁止 | artifact body / package content |

##### 7.13.6 `RuntimeActivityFeedbackEvent`

```rust
/// Payload for runtime or member-service activity feedback.
pub struct RuntimeActivityFeedbackEvent {
    /// Activity receiving feedback.
    pub activity_ref: ActivityRef,
    /// External runtime feedback reference.
    pub runtime_feedback_ref: ExternalRuntimeFeedbackRef,
    /// Feedback kind.
    pub feedback_kind: RuntimeFeedbackKind,
    /// Feedback summary reference without execution body. The concrete summary schema is Step 6 `RuntimeFeedbackSummary`.
    pub feedback_summary_ref: RuntimeFeedbackSummaryRef,
    /// Source digest proving the feedback summary.
    pub source_digest: Option<SourceDigest>,
}
```

| Event 名称 | `runtime.activity_feedback.v1` |
|---|---|
| 发布方 | `L2-runtime` / `L2-member-service` |
| 处理方 | `ProcessInboundConsumer.consume_runtime_activity_feedback` |
| 写入 | `RuntimeFeedbackRef` marker、pending feedback marker、activity stale marker |
| 禁止 | direct activity completion / execution log body |

##### 7.13.7 `ConversationContextChangedEvent`

```rust
/// Payload for conversation context changes relevant to process trace or views.
pub struct ConversationContextChangedEvent {
    /// Conversation reference.
    pub conversation_ref: ConversationRef,
    /// Context kind.
    pub context_kind: ConversationContextKind,
    /// Optional process trace subject affected by the context.
    pub trace_subject_ref: Option<ProcessTraceSubjectRef>,
    /// Source version reference.
    pub source_version_ref: Option<SourceVersionRef>,
}
```

| Event 名称 | `conversation.context.changed.v1` |
|---|---|
| 发布方 | `L1-conversation` |
| 处理方 | `ProcessInboundConsumer.consume_conversation_context_changed` |
| 写入 | `ConversationContextRef` marker、timeline stale marker |
| 禁止 | conversation fact / message body |

#### 7.14 Outbound Event envelope schema

```rust
/// Outbound event envelope published from process outbox records.
pub struct ProcessOutboundEventEnvelope {
    /// Process outbox record reference.
    pub outbox_record_ref: ProcessOutboxRef,
    /// Outbound event kind.
    pub event_kind: ProcessOutboxEventKind,
    /// Committed process truth reference.
    pub committed_truth_ref: ProcessTruthRef,
    /// Trace context copied from the truth change.
    pub trace_context: TraceContext,
    /// Visibility marker for downstream consumers.
    pub visibility_marker: Option<ProcessVisibilityMarker>,
    /// Typed payload.
    pub payload: ProcessOutboundEventPayload,
}

/// Outbound event payload variants.
pub enum ProcessOutboundEventPayload {
    /// Runtime process shape changed.
    RuntimeProcessShapeChanged(RuntimeProcessShapeChangedEvent),
    /// Process profile changed.
    ProcessProfileChanged(ProcessProfileChangedEvent),
    /// Process instance changed.
    ProcessInstanceChanged(ProcessInstanceChangedEvent),
    /// Activity progressed.
    ActivityProgressed(ActivityProgressedEvent),
    /// Waiting gate changed.
    WaitingGateChanged(WaitingGateChangedEvent),
    /// Process checkpoint was created.
    ProcessCheckpointCreated(ProcessCheckpointCreatedEvent),
    /// Recovery attempt changed.
    RecoveryAttemptChanged(RecoveryAttemptChangedEvent),
    /// Process timing changed.
    ProcessTimingChanged(ProcessTimingChangedEvent),
    /// Process trace became available.
    ProcessTraceAvailable(ProcessTraceAvailableEvent),
    /// Derived process view changed.
    DerivedProcessViewChanged(DerivedProcessViewChangedEvent),
}
```

Version strategy:

- All outbound topics use suffix `.v1`.
- Breaking payload changes require new topic suffix and new `SchemaVersion`.
- Publisher input must be `ProcessOutboundEventEnvelope`;publisher adapter must not inspect domain objects directly.

#### 7.15 Outbound Event payload schema

##### 7.15.1 `RuntimeProcessShapeChangedEvent`

```rust
/// Outbound payload for runtime shape changes.
pub struct RuntimeProcessShapeChangedEvent {
    /// Runtime shape reference.
    pub shape_ref: RuntimeProcessShapeRef,
    /// Source definition reference.
    pub definition_ref: MethodDefinitionRef,
    /// Source definition version reference.
    pub definition_version_ref: MethodDefinitionVersionRef,
    /// Current shape state.
    pub shape_state: RuntimeProcessShapeState,
    /// Change reason.
    pub change_reason: ShapeChangeReason,
}
```

##### 7.15.2 `ProcessProfileChangedEvent`

```rust
/// Outbound payload for process profile changes.
pub struct ProcessProfileChangedEvent {
    /// Profile reference.
    pub profile_ref: ProcessProfileRef,
    /// External project reference.
    pub project_ref: ProjectRef,
    /// Runtime shape adopted by the profile.
    pub shape_ref: RuntimeProcessShapeRef,
    /// Current profile state.
    pub profile_state: ProcessProfileState,
    /// Profile change record.
    pub change_record_ref: ProfileChangeRecordRef,
}
```

##### 7.15.3 `ProcessInstanceChangedEvent`

```rust
/// Outbound payload for process instance lifecycle changes.
pub struct ProcessInstanceChangedEvent {
    /// Process instance reference.
    pub process_instance_ref: ProcessInstanceRef,
    /// Profile reference.
    pub profile_ref: ProcessProfileRef,
    /// Current instance state.
    pub instance_state: ProcessInstanceState,
    /// Current activity reference.
    pub current_activity_ref: Option<ActivityRef>,
    /// Token set reference.
    pub token_set_ref: ProcessTokenSetRef,
}
```

##### 7.15.4 `ActivityProgressedEvent`

```rust
/// Outbound payload for process activity progression.
pub struct ActivityProgressedEvent {
    /// Process instance reference.
    pub process_instance_ref: ProcessInstanceRef,
    /// Activity reference.
    pub activity_ref: ActivityRef,
    /// Current activity state.
    pub activity_state: ActivityState,
    /// Activity progression record reference.
    pub progression_record_ref: ActivityProgressionRecordRef,
    /// Runtime feedback reference when available.
    pub feedback_ref: Option<RuntimeFeedbackRef>,
    /// Tokens affected by this progression when applicable.
    pub token_refs: Vec<ProcessTokenRef>,
    /// Gateway affected by this progression when applicable.
    pub gateway_ref: Option<GatewayRef>,
    /// Gateway route selected by this progression when applicable.
    pub selected_route_ref: Option<GatewayRouteRef>,
}
```

##### 7.15.5 `WaitingGateChangedEvent`

```rust
/// Outbound payload for waiting gate changes.
pub struct WaitingGateChangedEvent {
    /// Waiting gate reference.
    pub waiting_gate_ref: WaitingGateRef,
    /// Owning process instance reference.
    pub process_instance_ref: ProcessInstanceRef,
    /// Current gate state.
    pub gate_state: WaitingGateState,
    /// Pause context reference.
    pub pause_context_ref: PauseContextRef,
    /// Optional governance decision evidence.
    pub decision_ref: Option<GovernanceDecisionRef>,
}
```

##### 7.15.6 `ProcessCheckpointCreatedEvent`

```rust
/// Outbound payload for checkpoint creation or availability changes.
pub struct ProcessCheckpointCreatedEvent {
    /// Checkpoint reference.
    pub checkpoint_ref: ProcessCheckpointRef,
    /// Process instance reference.
    pub process_instance_ref: ProcessInstanceRef,
    /// Checkpoint state.
    pub checkpoint_state: CheckpointState,
    /// Evidence reference.
    pub evidence_ref: CheckpointEvidenceRef,
}
```

##### 7.15.7 `RecoveryAttemptChangedEvent`

```rust
/// Outbound payload for recovery attempt changes.
pub struct RecoveryAttemptChangedEvent {
    /// Recovery attempt reference.
    pub recovery_attempt_ref: RecoveryAttemptRef,
    /// Process instance being recovered.
    pub process_instance_ref: ProcessInstanceRef,
    /// Checkpoint reference.
    pub checkpoint_ref: ProcessCheckpointRef,
    /// Current recovery state.
    pub recovery_state: RecoveryAttemptState,
    /// Failure reason when failed.
    pub failure_reason: Option<RecoveryFailureReason>,
    /// Abandon reason when abandoned.
    pub abandon_reason: Option<RecoveryAbandonReason>,
}
```

##### 7.15.8 `ProcessTimingChangedEvent`

```rust
/// Outbound payload for process timing or rhythm changes.
pub struct ProcessTimingChangedEvent {
    /// Timing subject reference.
    pub process_subject_ref: ProcessTimingSubjectRef,
    /// Stage reference when stage changed.
    pub stage_ref: Option<ProcessStageRef>,
    /// Current stage state when available.
    pub stage_state: Option<StageState>,
    /// Timebox binding reference when changed.
    pub timebox_binding_ref: Option<ProcessTimeboxBindingRef>,
    /// Current binding state when available.
    pub binding_state: Option<TimeboxBindingState>,
}
```

##### 7.15.9 `ProcessTraceAvailableEvent`

```rust
/// Outbound payload for trace availability and handoff readiness.
pub struct ProcessTraceAvailableEvent {
    /// Trace subject reference.
    pub trace_subject_ref: ProcessTraceSubjectRef,
    /// Trace record reference.
    pub trace_record_ref: ProcessTraceRecordRef,
    /// Optional handoff reference.
    pub handoff_ref: Option<TraceHandoffRef>,
}
```

##### 7.15.10 `DerivedProcessViewChangedEvent`

```rust
/// Outbound payload for derived view freshness changes.
pub struct DerivedProcessViewChangedEvent {
    /// Derived view state reference.
    pub view_state_ref: DerivedProcessViewStateRef,
    /// Projection kind.
    pub projection_kind: ProcessProjectionKind,
    /// Current freshness state.
    pub freshness_state: ProjectionFreshnessState,
    /// Source cursor represented by the view.
    pub source_cursor_ref: ProcessTruthCursorRef,
}
```

#### 7.16 Outbox event mapping table

| `ProcessTruthChange` variant | `ProcessOutboxEventKind` | Payload variant |
|---|---|---|
| `RuntimeShapeChanged(RuntimeProcessShapeRef)` | `RuntimeProcessShapeChanged` | `RuntimeProcessShapeChangedEvent` |
| `ProfileChanged(ProcessProfileRef)` | `ProcessProfileChanged` | `ProcessProfileChangedEvent` |
| `InstanceChanged(ProcessInstanceRef)` | `ProcessInstanceChanged` | `ProcessInstanceChangedEvent` |
| `ActivityProgressed(ActivityRef)` | `ActivityProgressed` | `ActivityProgressedEvent` |
| `WaitingGateChanged(WaitingGateRef)` | `WaitingGateChanged` | `WaitingGateChangedEvent` |
| `CheckpointChanged(ProcessCheckpointRef)` | `ProcessCheckpointCreated` | `ProcessCheckpointCreatedEvent` |
| `RecoveryAttemptChanged(RecoveryAttemptRef)` | `RecoveryAttemptChanged` | `RecoveryAttemptChangedEvent` |
| `TimingChanged(ProcessTimingRef)` | `ProcessTimingChanged` | `ProcessTimingChangedEvent` |
| `TraceAvailable(ProcessTraceRecordRef)` | `ProcessTraceAvailable` | `ProcessTraceAvailableEvent` |
| `DerivedViewChanged(DerivedProcessViewStateRef)` | `DerivedProcessViewChanged` | `DerivedProcessViewChangedEvent` |

规则:

- command / consumer / job accepted transaction 创建 `ProcessOutboxRecord` 时,必须同时构造 `ProcessOutboundEventPayload` variant 并保存为 outbox payload snapshot。
- payload snapshot 的字段只能来自本次已提交的 domain 对象、同事务生成的 history / trace / audit record、已保存 snapshot / marker ref、command / event / job metadata;不得包含相邻仓正文。
- `PublishProcessOutboxFlow` 只复制 outbox 中已保存的 payload snapshot 到 `ProcessOutboundEventEnvelope.payload`;不得在发布时按 `truth_ref` 重新加载 current truth 重算 payload。
- `ProcessTraceAvailableEvent` 必须来自 committed `ProcessTruthChange::TraceAvailable(ProcessTraceRecordRef)`,不得由 publisher adapter 在发布时临时生成。

| Payload variant | Snapshot field source |
|---|---|
| `RuntimeProcessShapeChangedEvent` | committed `RuntimeProcessShape` + accepted `ShapeChangeReason` / marker reason |
| `ProcessProfileChangedEvent` | committed `ProcessProfile` + same-transaction `ProfileChangeRecordRef` |
| `ProcessInstanceChangedEvent` | committed `ProcessInstance` after transition |
| `ActivityProgressedEvent` | committed `Activity` + same-transaction `ActivityProgressionRecord`;`selected_route_ref` copies `ActivityProgressionRecord.selected_route_ref`,which itself copies committed `Gateway.selected_route_ref` |
| `WaitingGateChangedEvent` | committed `WaitingGate` + `PauseContextRef` + same-transaction `WaitingGateChangeRecord` evidence |
| `ProcessCheckpointCreatedEvent` | committed `ProcessCheckpoint` after capture / state change |
| `RecoveryAttemptChangedEvent` | committed `RecoveryAttempt` + failure reason when state is `Failed` + abandon reason when state is `Abandoned` |
| `ProcessTimingChangedEvent` | committed `ProcessStageState` and / or `ProcessTimeboxBinding`;only one of stage or binding may be absent when the other changed |
| `ProcessTraceAvailableEvent` | committed `ProcessTraceRecord` + optional prepared `TraceHandoffRef` |
| `DerivedProcessViewChangedEvent` | committed `DerivedProcessViewState` after freshness transition |

#### 7.17 Operations Job shared schema

```rust
/// Receipt returned by operations job runners.
pub struct JobRunReceipt {
    /// Job run reference from job metadata.
    pub job_run_ref: JobRunRef,
    /// Job kind executed.
    pub job_kind: ProcessJobKind,
    /// Job disposition.
    pub disposition: JobDisposition,
    /// Number of items scanned by the job.
    pub scanned_count: u32,
    /// Number of items changed by the job.
    pub changed_count: u32,
    /// Number of items skipped by the job.
    pub skipped_count: u32,
    /// Number of items failed by the job.
    pub failed_count: u32,
    /// Report reference produced by the job when applicable.
    pub report_ref: Option<JobReportRef>,
    /// Completed timestamp.
    pub completed_at: Timestamp,
}

/// Job disposition.
pub enum JobDisposition {
    /// The job completed successfully.
    Completed,
    /// The job completed with partial failures.
    PartialFailure,
    /// The job was rejected before execution.
    Rejected,
    /// The job was delayed for retry.
    Delayed,
}

/// Error returned by process job runners.
pub enum JobError {
    /// Job input failed validation.
    InvalidInput(ProtocolErrorRef),
    /// Job idempotency key conflicts with a different digest.
    IdempotencyConflict(IdempotencyConflictRef),
    /// A required repository or external source is unavailable.
    DependencyUnavailable(DependencyRef),
    /// Job completed only partially.
    PartialFailure(JobReportRef),
}
```

Receipt rules:

- successful job returns `JobRunReceipt` with `disposition = Completed`.
- partial failures return `Ok(JobRunReceipt { disposition = PartialFailure, ... })` when the job produced a report; unrecoverable input errors return `Err(JobError::InvalidInput)`.
- duplicate job with same key + digest returns previous `JobRunReceipt`.
- job must not create new business truth unless its specific job is recovery maintenance and Step 9 flow allows a recovery marker transition.

#### 7.18 Job scope / report DTO schema

```rust
/// Scope for scanning process outbox records.
pub struct ProcessOutboxScope {
    /// Optional lower cursor.
    pub after_outbox_ref: Option<ProcessOutboxRef>,
    /// Optional event kind filter.
    pub event_kind: Option<ProcessOutboxEventKind>,
    /// Page request.
    pub page: ProcessPageRequest,
}

/// Projection rebuild scope.
pub struct ProcessProjectionRebuildScope {
    /// Projection kinds to rebuild.
    pub projection_kinds: Vec<ProcessProjectionKind>,
    /// Optional process instance scope.
    pub process_instance_ref: Option<ProcessInstanceRef>,
    /// Optional work context scope.
    pub work_context_ref: Option<WorkContextRef>,
}

/// External context refresh scope.
pub struct ExternalContextRefreshScope {
    /// External context kinds to refresh.
    pub context_kinds: Vec<ExternalContextKind>,
    /// Optional process instance scope.
    pub process_instance_ref: Option<ProcessInstanceRef>,
    /// Optional reference state filter.
    pub reference_state: Option<ReferenceResolutionLifecycleState>,
}

/// Recovery maintenance scope.
pub struct RecoveryMaintenanceScope {
    /// Optional process instance scope.
    pub process_instance_ref: Option<ProcessInstanceRef>,
    /// Include failed attempts that may be abandoned.
    pub include_failed: bool,
    /// Page request.
    pub page: ProcessPageRequest,
}

/// Trace handoff scan scope.
pub struct TraceHandoffScope {
    /// Optional trace subject scope.
    pub trace_subject_ref: Option<ProcessTraceSubjectRef>,
    /// Include committed trace records that have not yet been prepared.
    pub include_unprepared_traces: bool,
    /// Handoff states to include.
    pub handoff_states: Vec<TraceHandoffState>,
    /// Page request.
    pub page: ProcessPageRequest,
}

/// Archive handoff target reference.
pub struct ArchiveHandoffTargetRef {
    /// Destination archive reference.
    pub destination_ref: ArchiveDestinationRef,
    /// Archive scope to prepare.
    pub archive_scope_ref: ArchiveScopeRef,
}

/// Publication receipt returned by publisher port.
pub struct PublicationReceipt {
    /// Publication reference.
    pub publication_ref: OutboxPublicationRef,
    /// Downstream acknowledgement reference when available.
    pub downstream_ack_ref: Option<DownstreamAckRef>,
    /// Published timestamp.
    pub published_at: Timestamp,
}

/// Trace handoff receipt returned by handoff port.
pub struct TraceHandoffReceipt {
    /// Handoff receipt reference.
    pub receipt_ref: HandoffReceiptRef,
    /// External handoff reference.
    pub external_ref: ExternalHandoffRef,
    /// Delivered timestamp.
    pub delivered_at: Timestamp,
}

/// Archive handoff receipt returned by archive handoff port.
pub struct ArchiveHandoffReceipt {
    /// Handoff receipt reference.
    pub receipt_ref: HandoffReceiptRef,
    /// External archive package reference.
    pub archive_package_ref: ArchivePackageRef,
    /// Delivered timestamp.
    pub delivered_at: Timestamp,
}
```

Trace handoff scope rules:

- `include_unprepared_traces = true` means `TraceRepository::list_trace_records_for_handoff(scope)` may return committed `ProcessTraceRecord` rows that need `ProcessTraceRecord.prepare_handoff(handoff_ref, target_ref)`.
- `handoff_states` filters existing `TraceHandoffRecord` markers returned by `TraceRepository::list_handoff_refs(scope)`.
- At least one of `include_unprepared_traces = true` or non-empty `handoff_states` is required for handoff jobs;otherwise the job returns `JobError::InvalidInput`.

#### 7.19 Operations Job protocols

##### 7.19.1 `PublishProcessOutboxJob`

| 项 | 内容 |
|---|---|
| 触发方式 | scheduler / operator |
| 函数签名 | `run_publish_process_outbox(PublishProcessOutboxJob) -> Result<JobRunReceipt, JobError>` |
| job 名称 | `process.job.publish_outbox` |
| 处理方 | `PublishProcessOutboxRunner -> ProcessOutboxService` |

```rust
/// Job input for publishing pending process outbox records.
pub struct PublishProcessOutboxJob {
    /// Job metadata and idempotency key.
    pub metadata: JobMetadata,
    /// Outbox scan scope.
    pub scope: ProcessOutboxScope,
    /// Maximum retry count allowed for one record during this run.
    pub max_retry_count: RetryLimit,
}
```

| 字段 | 类型 | 目标 | 缺失处理 |
|---|---|---|---|
| `scope` | `ProcessOutboxScope` | `ProcessOutboxRepository::list_pending` | reject |
| `max_retry_count` | `RetryLimit` | retry gate | default not allowed; missing reject |
| `metadata.job_idempotency_key` | `JobIdempotencyKey` | job idempotency | reject |

##### 7.19.2 `RebuildProcessProjectionsJob`

| 项 | 内容 |
|---|---|
| 触发方式 | scheduler / operator |
| 函数签名 | `run_rebuild_process_projections(RebuildProcessProjectionsJob) -> Result<JobRunReceipt, JobError>` |
| job 名称 | `process.job.rebuild_projections` |
| 处理方 | `ProjectionRebuildRunner -> ProcessProjectionService` |

```rust
/// Job input for rebuilding process projections.
pub struct RebuildProcessProjectionsJob {
    /// Job metadata and idempotency key.
    pub metadata: JobMetadata,
    /// Projection rebuild scope.
    pub scope: ProcessProjectionRebuildScope,
    /// Source cursor to rebuild from.
    pub from_cursor_ref: Option<ProcessTruthCursorRef>,
}
```

Rules:

- rebuild source must be committed truth / trace.
- job may write `ProcessReadModel`、`ProcessTimelineView`、`ProcessProgressSummary`、`DerivedProcessViewState`.
- job must not create new `ProcessTruthChange` except `DerivedViewChanged` marker when freshness changes.

##### 7.19.3 `RefreshExternalContextSnapshotsJob`

| 项 | 内容 |
|---|---|
| 触发方式 | scheduler / operator |
| 函数签名 | `run_refresh_external_context_snapshots(RefreshExternalContextSnapshotsJob) -> Result<JobRunReceipt, JobError>` |
| job 名称 | `process.job.refresh_external_context_snapshots` |
| 处理方 | `ReferenceRefreshRunner -> ProcessReferenceRefreshService` |

```rust
/// Job input for refreshing external context snapshots.
pub struct RefreshExternalContextSnapshotsJob {
    /// Job metadata and idempotency key.
    pub metadata: JobMetadata,
    /// External context refresh scope.
    pub scope: ExternalContextRefreshScope,
    /// Maximum age allowed before a snapshot is refreshed.
    pub max_snapshot_age: RetentionDuration,
}
```

Rules:

- `max_snapshot_age` uses conversation-local / process-local `RetentionDuration` style value object,not an undefined core `Duration`.
- job writes snapshot / reference state only.
- unavailable sources produce delayed / partial report;do not rewrite process truth.

##### 7.19.4 `RunProcessReconciliationJob`

| 项 | 内容 |
|---|---|
| 触发方式 | scheduler / operator |
| 函数签名 | `run_process_reconciliation(RunProcessReconciliationJob) -> Result<JobRunReceipt, JobError>` |
| job 名称 | `process.job.run_reconciliation` |
| 处理方 | `ReconciliationRunner -> ProcessReconciliationService` |

```rust
/// Job input for producing a process reconciliation report.
pub struct RunProcessReconciliationJob {
    /// Job metadata and idempotency key.
    pub metadata: JobMetadata,
    /// Reconciliation scope.
    pub scope_ref: ProcessReconciliationScopeRef,
    /// Optional source cursor.
    pub cursor_ref: Option<ProcessTruthCursorRef>,
    /// Report target reference.
    pub report_target_ref: ReconciliationReportTargetRef,
}
```

Rules:

- job writes `ReconciliationReport` only.
- detected drift is represented by `ReconciliationIssueRef`,not by silent repair.

##### 7.19.5 `PrepareProcessTraceHandoffJob`

| 项 | 内容 |
|---|---|
| 触发方式 | scheduler / operator |
| 函数签名 | `run_prepare_process_trace_handoff(PrepareProcessTraceHandoffJob) -> Result<JobRunReceipt, JobError>` |
| job 名称 | `process.job.prepare_trace_handoff` |
| 处理方 | `TraceHandoffRunner -> ProcessTraceService` |

```rust
/// Job input for preparing and delivering process trace handoff.
pub struct PrepareProcessTraceHandoffJob {
    /// Job metadata and idempotency key.
    pub metadata: JobMetadata,
    /// Trace handoff scope.
    pub scope: TraceHandoffScope,
    /// Handoff target reference.
    pub target_ref: TraceHandoffTargetRef,
}
```

Rules:

- job generates `TraceHandoffRef`,calls `ProcessTraceRecord::prepare_handoff(handoff_ref, target_ref)`,then calls `TraceHandoffPort::deliver_trace`.
- unprepared trace records come from `TraceRepository::list_trace_records_for_handoff(scope)`.
- existing retryable records come from `TraceRepository::list_handoff_refs(scope)`.
- success stores `TraceHandoffReceipt` marker.
- failure stores failed / retryable handoff marker,not observability body.

##### 7.19.6 `PrepareProcessArchiveHandoffJob`

| 项 | 内容 |
|---|---|
| 触发方式 | scheduler / operator |
| 函数签名 | `run_prepare_process_archive_handoff(PrepareProcessArchiveHandoffJob) -> Result<JobRunReceipt, JobError>` |
| job 名称 | `process.job.prepare_archive_handoff` |
| 处理方 | `ArchiveHandoffRunner -> ProcessTraceService` |

```rust
/// Job input for preparing process archive handoff.
pub struct PrepareProcessArchiveHandoffJob {
    /// Job metadata and idempotency key.
    pub metadata: JobMetadata,
    /// Trace handoff scope used to select material.
    pub scope: TraceHandoffScope,
    /// Archive target reference.
    pub target_ref: ArchiveHandoffTargetRef,
}
```

Rules:

- job delivers prepared handoff refs to archive via `ArchiveHandoffPort`.
- unprepared trace records come from `TraceRepository::list_trace_records_for_handoff(scope)` before preparing archive handoff refs.
- existing retryable records come from `TraceRepository::list_handoff_refs(scope)`.
- returned `ArchiveHandoffReceipt.archive_package_ref` is a reference only,not package body.

##### 7.19.7 `MaintainRecoveryAttemptsJob`

| 项 | 内容 |
|---|---|
| 触发方式 | scheduler / operator |
| 函数签名 | `run_maintain_recovery_attempts(MaintainRecoveryAttemptsJob) -> Result<JobRunReceipt, JobError>` |
| job 名称 | `process.job.maintain_recovery_attempts` |
| 处理方 | `RecoveryMaintenanceRunner -> ProcessRecoveryMaintenanceService` |

```rust
/// Job input for maintaining recovery attempts.
pub struct MaintainRecoveryAttemptsJob {
    /// Job metadata and idempotency key.
    pub metadata: JobMetadata,
    /// Recovery maintenance scope.
    pub scope: RecoveryMaintenanceScope,
    /// Retry policy reference.
    pub retry_policy_ref: RecoveryRetryPolicyRef,
    /// Expiry policy reference.
    pub expiry_policy_ref: RecoveryExpiryPolicyRef,
}
```

Rules:

- job may mark eligible attempts abandoned or failed according to recovery policy.
- job must not create a new `ProcessInstance`.
- each state change must append `RecoveryHistoryRecord` and may create outbox when Step 9 flow says so.

#### 7.20 DTO 到 Domain 构造闭环总表

| 输入契约 | 目标 Domain 对象 | 必填字段是否齐全 | 派生字段来源 | 不得混同字段 | 缺失时行为 |
|---|---|---|---|---|---|
| `SyncRuntimeProcessShapeRequest` | `RuntimeProcessShape`、`MethodDefinitionSnapshot`、`ProcessOutboxRecord` | 是 | id generator、resolver、clock | `definition_version_ref` vs storage version | reject / retry |
| `AdoptProcessProfileRequest` | `ProcessProfile`、`ProfileChangeRecord`、`ProcessAuditTrail`、`ProcessOutboxRecord` | 是 | id generator、profile repository | `project_ref` vs `work_context_ref` | reject |
| `UpdateProcessProfileTailoringRequest` | `ProcessProfile`、`ProfileChangeRecord`、outbox | 是 | repository, id generator | `next_shape_ref` vs current `shape_ref` | reject |
| `StartProcessInstanceRequest` | `ProcessInstance`、`Activity`、`Token`、`Gateway`、trace、outbox | 是 | profile / shape lookup, id generator | `profile_ref` vs `work_context_ref` | reject |
| `AdvanceProcessActivityRequest` | `Activity`、`Token`、`Gateway`、`ActivityProgressionRecord` | 是 | repository, policy | `expected_position_ref` vs storage version | conflict |
| `RecordActivityFeedbackRequest` | `Activity`、`RuntimeFeedbackRef`、progression record | 是 | resolver / reference snapshot | feedback ref vs feedback summary | reject / retry |
| `OpenWaitingGateRequest` | `WaitingGate`、`PauseContext`、change record | 是 | id generator、clock | pause reason vs resume requirement | reject |
| `ResumeWaitingGateRequest` | `WaitingGate`、`PauseContext`、`Token`、change record | 是 | `WaitingGateRepository::get_gate` / `get_pause_context`、repository / resolver | missing pause context;decision ref vs resume reason | reject |
| `CreateProcessCheckpointRequest` | `ProcessCheckpoint`、trace / audit | 是 | id generator, repository | evidence ref vs checkpoint reason | reject |
| `StartRecoveryAttemptRequest` | `RecoveryAttempt`、history record | 是 | checkpoint repository, id generator | checkpoint ref vs attempt ref | reject |
| `CompleteRecoveryAttemptRequest` | `RecoveryAttempt`、history record、outbox | 是 | repository | outcome vs failure reason / abandon reason | invalid input |
| `BindProcessTimeboxRequest` | `ProcessTimeboxBinding`、stage / timing marker | 是 | id generator, work snapshot | process timebox vs external timebox | reject |
| `UpdateProcessStageStateRequest` | `ProcessStageState`、trace / outbox | 是 | repository | stage target vs state enum | reject |
| `InboundEventEnvelope<T>` | snapshot / reference / pending / stale marker | 是 if envelope valid | resolver, clock | source actor vs command actor | quarantine / delayed |
| `PublishProcessOutboxJob` | `ProcessOutboxRecord.publication_state` | 是 | publisher receipt | publication ref vs outbox ref | partial failure |
| `RebuildProcessProjectionsJob` | projections / `DerivedProcessViewState` | 是 | committed truth / trace | projection cursor vs page cursor | failed report |
| `RefreshExternalContextSnapshotsJob` | snapshots / `ReferenceResolutionState` | 是 | resolver | source version vs storage version | delayed / partial |
| `RunProcessReconciliationJob` | `ReconciliationReport` | 是 | report builder | report ref vs issue ref | failed report |
| `PrepareProcessTraceHandoffJob` | `TraceHandoffRecord` marker | 是 | trace repository, handoff port | target ref vs external ref | failed / delayed |
| `PrepareProcessArchiveHandoffJob` | `TraceHandoffRecord` / archive marker | 是 | trace repository, archive port | archive package ref vs body | failed / delayed |
| `MaintainRecoveryAttemptsJob` | `RecoveryAttempt` / `RecoveryHistoryRecord` | 是 | recovery repository, policy | retry policy vs recovery reason | partial / failed |

### 8. 回填草稿

> 校准来源:
> - `design-calibration/03_ddd_step_08_protocol_contracts.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“协议总表”“共享 context / metadata schema”“Command request / result schema”“Query view DTO schema”“Inbound Event envelope / receipt schema”“Outbound Event payload schema”“Operations Job protocols”和“DTO 到 Domain 构造闭环总表”小节。

## 7. API / Command / Query / Event / Job 协议契约

L1-process 的 public protocol 归 `crates/contracts`。`commands.rs` 定义 13 个 command request / result DTO 和 `CommandReceipt`;`queries.rs` 定义 query request、page request / info 和 search page;`views.rs` 定义 query view、status、visibility / degraded / projection marker;`events.rs` 定义 inbound envelope、consumer receipt、inbound payload、outbound envelope 和 outbound payload;`jobs.rs` 定义 operations job input、scope、receipt 和 job error。

Command / Query 以 RPC 名称作为稳定协议锚点。Inbound / outbound event 以 event bus topic 名称作为稳定协议锚点。Operations job 以 job runner 名称作为稳定协议锚点。后续 HTTP / RPC / scheduler implementation 必须 1:1 映射这些 DTO,不得新增字段真相源。

所有 Command 必须携带 `ActorContext`、`CommandMetadata` 和 idempotency key。所有 Query 必须携带 `ActorContext` 和 `QueryMetadata`,但不携带 idempotency key。所有 Inbound Event 必须使用 `InboundEventEnvelope<T>`,typed payload 不重复 envelope 字段。所有 Job 必须携带 `JobMetadata` 和 job idempotency key。

Query response 必须使用 `ProcessViewStatus` 明确 `Available`、`NotVisible`、`Missing`、`Degraded`、`Unavailable` surface。stale / failed / rebuilding / disabled projection 必须通过 `ProjectionStatusMarker` 或 `ProcessDegradedMarker` 暴露,不得只返回 null 或裸错误。

### 9. 待确认事项

| 待确认项 | 当前处理 | 后续 Step |
|---|---|---|
| Command / Query 具体处理流 | 本 Step 只定义协议和字段映射 | Step 9 |
| 状态转换合法矩阵 | 本 Step 只引用 state enum | Step 10 |
| 持久化表 / transaction order | 本 Step 只定义 DTO 到对象映射 | Step 11 |
| 错误恢复策略 | 本 Step 定义 public error surface | Step 12 |
| 幂等窗口和 digest 计算细节 | 本 Step 定义 metadata / receipt | Step 13 |

### 10. 进入下一步条件

```text
所有需要实现的协议入口都有明确签名、schema、错误映射、处理方和 DTO 到目标对象构造闭环。
Step 9 可以基于这些协议定义逐接口函数级处理流。
```
