# Step 7. 逐模块定义 Trait / Port / Adapter 契约

> 对应 SOP: `standards/document/详细设计讨论流程_SOP.md` Step 7
> 回填章节: `03-详细设计.md` §5 模块实现契约中的 trait / port / adapter 契约;§7 应用服务与持久化接缝
> 生成日期: 2026-07-03
> 状态: 已完成

---

## 1. Step 状态

- 状态: `[x]` 已确认
- 当前目标: 在 Step 5 已固定的 7 个实现模块与 Step 6 已固定的 truth / support / view / record 对象之上,补齐 `L1-artifact` 的 exact Rust-facing trait、port、repository、resolver、relay、handoff 和 adapter contract
- 本步必须收口:
  - `application` 定义并调用的 service surface
  - `application` 定义的 repository / resolver / relay / handoff / stored-result / idempotency / UoW port
  - `infra` 对上述 port 的实现边界和 fake parity 规则
  - `api` / `worker` / `jobs` 只允许调用 `application` 的 entry 限制
- 本步不做的事:
  - 不提前定义 HTTP path、RPC method、topic、queue、完整 DTO schema 或 event envelope
  - 不提前写 SQL、DDL、索引、事务脚本、配置 key 或默认值
  - 不提前定义 Step 9 的完整函数级顺序或 Step 12 的完整错误 taxonomy
  - 不凭空新增新的 canonical business object owner

## 2. 本步输入

| 输入 | 当前状态 | 用途 |
|---|---|---|
| `projects/L1-artifact/design-calibration/03_ddd_step_05_module_contracts.md` | 已完成 | 提供模块 owner、依赖方向、trait owner 和 adapter owner 门禁 |
| `projects/L1-artifact/design-calibration/03_ddd_step_06_object_contracts.md` | 已完成 | 提供 truth object、support state、public view、record 和 policy 的 exact carrier |
| `projects/L1-artifact/02-概要设计.md` §5 / §7 / §8 / §12 | 已读取 | 提供 10 个主要组成部分、五类接口骨架、处理流骨架和详细设计承接清单 |
| `projects/L1-artifact/design-calibration/02_hld_step_07_api_interface_skeleton.md` | 已读取 | 提供 Command / Query / Consumer / Outbound Event / Operations Job vocabulary |
| `projects/L1-artifact/design-calibration/02_hld_step_12_detailed_design_handoff.md` | 已读取 | 提供 Step 7 必须继续闭口的 service I/O、repository、UoW、stored result 和 relay / handoff 接缝 |
| `projects/L1-governance/design-calibration/03_ddd_step_07_trait_port_adapter_contracts.md` | 已读取 | 作为 Step 7 粒度、结构和 closure audit 参考 |
| `projects/L1-artifact/00-需求文档.md` / `01-架构设计.md` | 已读取 | 提供 truth ownership、external body exclusion、query no-write、job no-truth-repair 和 handoff failure no rollback 红线 |
| `standards/document/设计真相源闭环与可落码性标准.md` | 已生效 | 约束 callable surface、version 来源、stored result、sidecar / snapshot 读取面、UoW cursor 和 fake parity |

## 3. 本步写入计划

| 计划项 | 目标产物 | 状态 |
|---|---|---|
| 固定 port owner 与 access rule | 本文件 §5 | 已完成 |
| 固定 application-local helper、UoW、operation context、clock 和 id generator | 本文件 §6 / §7 | 已完成 |
| 固定 4 组 public-facing application service 与 1 组 worker-only relay publication facade 的 callable surface / exact I/O carrier | 本文件 §8 | 已完成 |
| 固定 truth persistence、reference / snapshot、projection、derived / handoff、relay / result ports | 本文件 §9 ~ §11 | 已完成 |
| 固定 infra / api / worker / jobs adapter 规则与 fake parity | 本文件 §12 | 已完成 |
| 回填 Step 8 入口和闭环审计 | 本文件 §13 ~ §16 | 已完成 |

## 4. SOP 问题回答

### 4.1 哪些模块定义 port,哪些模块实现 port,哪些模块可以直接访问 port?

- `application` 是唯一允许定义并调用 port 的模块。
- `infra` 只实现 `application` 定义的 port,不得重新定义签名或通过 adapter 返回外部正文。
- `api`、`worker`、`jobs` 只允许调用 `application` service,不得直接访问 repository、resolver、publisher、handoff adapter 或 UoW。
- `domain` 只定义 object / policy / invariant,不得依赖 repository / resolver / publisher。
- `contracts` 只定义 public ref / state / view / protocol shared carrier,不得持有 port trait。

### 4.2 Step 7 当前必须闭口哪些服务面?

当前必须闭口 4 组 public-facing application service:

- `ArtifactTruthWriteService`
- `ArtifactReadConsumptionService`
- `ArtifactIntakeReviewService`
- `ArtifactDerivedMaintenanceService`

并补 1 组只供 worker relay loop 使用的 internal facade:

- `ArtifactRelayPublicationService`

上述 5 组 callable surface 必须共同覆盖 Step 7 接口骨架中的:

- 16 个 Command
- 13 个 Query
- 6 个 Inbound Event Consumer
- 6 个 Operations Job
- 1 个 internal outbound relay publication loop

Outbound Event 不作为 public entry service 暴露,而作为 accepted truth change / derived state change 的 stored relay queue + worker-only publication facade 闭口。

### 4.3 Step 7 需要哪些 shared helper 才能避免实现端自行选型?

必须显式定义:

- `Versioned<T>` 与 repository page helper
- `ArtifactUnitOfWork` / `ArtifactUnitOfWorkManager`
- `ArtifactCommandCallContext` / `ArtifactQueryCallContext` / `ArtifactInboundEventCallContext` / `ArtifactJobCallContext`
- `ArtifactIdempotentOperationContext` 与 `ArtifactOperationContextFactory`
- `ClockPort` 与 `IdGeneratorPort`
- `ArtifactReferenceRefreshScope`
- `ArtifactTruthSnapshotScope`
- `ArtifactApplicationResultRef` / stored result envelope / idempotency reservation

没有这些 helper,实现端就会在 repo、job、duplicate replay、UoW cursor 或 expected_version 来源上自行补 schema。

### 4.4 Step 7 对 repository / resolver 的最小 closure 红线是什么?

- 凡 mutation 后续需要 optimistic write,前置读取必须返回 `Versioned<T>`。
- 凡 list / lookup 会成为 query、job 或 policy 的正式输入,必须给 exact page / lookup surface,不得让实现端扫 store 或拼 ref。
- 凡 resolver / mirror port 会驱动 `ExternalReferenceResolutionState` 持久化状态,必须返回正式 business outcome,不得靠 `ApplicationError` 或错误字符串分流。
- 凡 derived / handoff / stored result surface 会被 duplicate replay 或后续 job 读取,必须定义 save + get 的对称 callable surface。

### 4.5 Step 7 如何保持“保守地不新增 canonical business object”?

本步允许在 Step 7 中就地重述或补充到 callable surface 的类型仅限:

- Step 6 已闭口的 `application` local helper
- repository / relay / handoff / stored-result port carrier
- entry-to-service context carrier
- 为 stored outbound publication 必需的 application-owned relay queue / payload snapshot carrier

本步不新增新的 truth object、policy subject 或 public contracts business object。所有业务主语仍以 Step 6 已定义对象为准。

## 5. 模块级 port 归属总览

| 模块 | 是否定义 port | 是否实现 port | 是否可直接访问 port | 结论 |
|---|---|---|---|---|
| `contracts` | 否 | 否 | 否 | 只定义 public ref / state / view / shared protocol carrier |
| `domain` | 否 | 否 | 否 | 只定义 truth / support / policy / record,不得读取 repository 或 external adapter |
| `application` | 是 | 否 | 是 | 定义并调用所有 service / repository / resolver / relay / handoff / result port |
| `infra` | 否 | 是 | 否 | 实现 application port,并对 durable / fake parity 负责 |
| `api` | 否 | 否 | 否 | 只解析 sync command/query 输入并调用 application service |
| `worker` | 否 | 否 | 否 | 只解析 inbound event 或触发 relay publication facade,并调用 application service |
| `jobs` | 否 | 否 | 否 | 只解析 one-shot maintenance job 输入并调用 application service |

port access 不变量:

- `api` / `worker` / `jobs` 不得持有 repository adapter。
- `infra` 不得在 adapter 内重做 domain policy。
- `application` 不得依赖具体 store / bus / object storage 产品实现。
- `contracts` 和 `domain` 不得反向依赖 `application`。

### 5.1 实现方 / 调用方关系表

| 接缝族 | 定义方 | 直接调用方 | 实现方 | 关系结论 |
|---|---|---|---|---|
| application service surface | `application` | `api` / `worker` / `jobs` | `application` | 入口模块只调用 service,不得下探 repository / resolver / UoW |
| truth persistence / projection / derived repositories | `application` | `application` services | `infra` | truth / read / derived 持久化统一经 application port 进入 durable / fake adapter |
| external resolver / relay / handoff delivery ports | `application` | `application` services | `infra` | 外部协作统一经 port 抽象,不得由 entry 或 domain 直接访问 |
| UoW / clock / id generator / idempotency / stored result | `application` | `application` services | `infra` | version、cursor、duplicate replay 和 transaction 语义只能经统一 helper / port 闭口 |

### 5.2 模块级 port capability / 接缝索引

| 模块 | capability / 对象能力 | 需要的接缝 | 调用方 | 实现方 | 后续承接 |
|---|---|---|---|---|---|
| `contracts` | public carrier / view / marker 对外暴露 | 无独立 port | 不适用 | 不适用 | Step 8 协议只消费既有 carrier |
| `domain` | truth / support / policy / record owner | 无独立 port | 不适用 | 不适用 | Step 8 / 9 只通过 application service 承接对象能力 |
| `application` | service orchestration、truth / read / maintenance write-read、duplicate replay | service traits、repository ports、resolver ports、relay / handoff ports、UoW、idempotency / stored-result ports | `application` services 与 entry modules | `infra` 实现底层 port | Step 8 / Step 9 / Step 11 |
| `infra` | durable / fake adapter、runtime binding、external integration | repository / resolver / relay / handoff adapter seam | `application` | `infra` | Step 11 / Step 14 |
| `api` | sync command / query entry normalization | `ArtifactCommandCallContext`、`ArtifactQueryCallContext`、public response mapping seam | `api` handler | `api` | Step 8 |
| `worker` | inbound consumer normalization、receipt / ack mapping | `ArtifactInboundEventCallContext`、`ArtifactInboundReceiptEnvelope` mapping seam | `worker` consumer / loop | `worker` | Step 8 / Step 13 |
| `jobs` | one-shot maintenance job normalization、run report / exit mapping | `ArtifactJobCallContext`、`ArtifactJobReportEnvelope` mapping seam | `jobs` runner | `jobs` | Step 8 / Step 15 |

## 6. Shared application port helper

以下 helper 固定归 `crates/application`。它们不是 public protocol DTO,只为 service / port / adapter contract 服务。这里是对 Step 6 已闭口 helper owner 的就地重述,用于让 Step 7 trait 签名保持局部可读;不是重新发明新的 business object owner。

```rust
/// Stable application-local transaction reference.
pub struct ArtifactTransactionRef(pub String);

/// Optimistic version attached to a persisted Artifact object.
pub struct ArtifactRepositoryVersion(pub u64);

/// Opaque repository page cursor.
pub struct ArtifactRepositoryCursor(pub String);

/// Repository page request used inside application ports.
pub struct ArtifactRepositoryPage {
    pub cursor: Option<ArtifactRepositoryCursor>,
    pub limit: u32,
}

/// Persisted object plus optimistic version.
pub struct Versioned<T> {
    pub value: T,
    pub version: ArtifactRepositoryVersion,
}

/// Repository page result.
pub struct Page<T> {
    pub items: Vec<T>,
    pub next_cursor: Option<ArtifactRepositoryCursor>,
}

/// Stable application-local operation name.
pub struct ArtifactOperationName(pub String);

/// Canonical request digest used by idempotency.
pub struct ArtifactRequestDigest(pub String);

/// Stable stored-result reference.
pub struct ArtifactApplicationResultRef(pub String);

/// Stable stored serialized surface reference.
pub struct ArtifactStoredResultSurfaceRef(pub String);

/// Stable application-local idempotency record reference.
pub struct ArtifactIdempotencyRef(pub String);

/// Scope used by reference refresh scans.
pub enum ArtifactReferenceRefreshScope {
    ExplicitExternalRefs(Vec<ExternalSourceRef>),
    ByReferenceKind(ArtifactExternalReferenceKind),
    UnhealthyOnly,
}

/// Scope used by truth snapshot readers for rebuild / reconcile / handoff jobs.
pub enum ArtifactTruthSnapshotScope {
    Baseline(ArtifactBaselineScopeRef),
    Report(ArtifactReportScopeRef),
    Reconciliation(ArtifactReconciliationScopeRef),
    Consumer(ArtifactConsumerScopeRef),
}

/// Channel of an idempotent application operation.
pub enum ArtifactOperationChannelKind {
    ApiCommand,
    WorkerConsumer,
    OperationsJob,
}

/// Minimal application-local idempotent operation context.
pub struct ArtifactIdempotentOperationContext {
    pub operation_name: ArtifactOperationName,
    pub channel_kind: ArtifactOperationChannelKind,
    pub actor_ref: ActorRef,
    pub idempotency_key: IdempotencyKey,
    pub trace_id: TraceId,
}

/// Application-owned error carrier for port and orchestration failures.
pub struct ArtifactApplicationError {
    pub code: ArtifactApplicationErrorCode,
    pub subject_ref: Option<ArtifactTruthAnchorRef>,
    pub message: String,
}

pub enum ArtifactApplicationErrorCode {
    DomainRejected,
    PersistenceFailed,
    ReferenceUnavailable,
    IdempotencyConflict,
    RelayFailed,
    InvariantViolation,
}

pub type ApplicationError = ArtifactApplicationError;
```

| helper | 作用 | 正式口径 |
|---|---|---|
| `ArtifactTransactionRef` | UoW 事务引用 | 只用于 application / infra 日志、assertion 和 error context |
| `ArtifactRepositoryVersion` | optimistic update token | 只能来自 `get_*_with_version` / `find_*_with_version` / `list_*` 的 versioned 读取面 |
| `ArtifactRepositoryCursor` | repository 列表位置 | 不得替代 version、truth cursor 或 request digest |
| `ArtifactRepositoryPage` | repository page request | 只属于 application-local port,Step 8 若暴露 public page 再在 contracts 闭口 |
| `ArtifactRequestDigest` | idempotency digest | 由 operation context factory 统一 canonicalize,不得由 entry / fake / adapter 各自拼接 |
| `ArtifactReferenceRefreshScope` | refresh job scope helper | refresh job 只能通过该 helper 读取候选 state,不得全表扫描或按字符串猜类型 |
| `ArtifactTruthSnapshotScope` | rebuild / reconcile / handoff scope helper | job snapshot 只能从 committed truth 读取 body-free refs |
| `ApplicationError` | Step 7 trait 签名统一错误面 | Step 12 继续细化 code family 与 protocol mapping |

### 6.1 UnitOfWork

```rust
/// Transaction handle passed to write repositories.
pub trait ArtifactUnitOfWork {
    fn transaction_ref(&self) -> ArtifactTransactionRef;

    /// Assigns the committed-truth cursor after truth writes are staged.
    fn assign_truth_cursor(&self) -> Result<ArtifactTruthCursor, ApplicationError>;

    /// Assigns the committed-reference cursor after reference-only writes are staged.
    fn assign_reference_cursor(&self) -> Result<ArtifactTruthCursor, ApplicationError>;
}

/// Creates, commits, and rolls back write transactions.
pub trait ArtifactUnitOfWorkManager {
    async fn begin(&self) -> Result<Box<dyn ArtifactUnitOfWork>, ApplicationError>;
    async fn commit(&self, uow: Box<dyn ArtifactUnitOfWork>) -> Result<(), ApplicationError>;
    async fn rollback(&self, uow: Box<dyn ArtifactUnitOfWork>) -> Result<(), ApplicationError>;
}
```

UoW cursor 规则:

| 规则 | 说明 |
|---|---|
| `assign_truth_cursor()` 时机 | accepted command 必须先 stage truth + history + trace,再分配 cursor |
| `assign_reference_cursor()` 时机 | consumer / refresh job 必须先 stage resolution state + mirror snapshot + stale marker,再分配 cursor |
| 单事务唯一 cursor | 同一 accepted command transaction 只分配一次 truth cursor;同一 reference-only transaction 只分配一次 reference cursor |
| rollback 不得泄露 cursor | rollback 后 cursor 不得被返回给 query、relay、job report 或 fake store |
| 禁止替代来源 | page cursor、timestamp、idempotency key、trace id、store row id、hard-coded string 都不得代替 truth / reference cursor |

### 6.2 Entry-to-service call context

```rust
/// Shared command call context assembled by API entry.
pub struct ArtifactCommandCallContext {
    pub actor_context: ActorContext,
    pub metadata: CommandMetadata,
}

/// Shared query call context assembled by API entry.
pub struct ArtifactQueryCallContext {
    pub actor_context: ActorContext,
    pub metadata: QueryMetadata,
}

/// Shared inbound event call context assembled by worker entry.
pub struct ArtifactInboundEventCallContext {
    pub source_event_id: OpaqueRef,
    pub source_ref: ExternalSourceRef,
    pub source_schema_ref: OpaqueRef,
    pub dedup_key: IdempotencyKey,
    pub trace_id: TraceId,
    pub occurred_at: Timestamp,
}

/// Shared operations job call context assembled by jobs entry.
pub struct ArtifactJobCallContext {
    pub operator_ref: ActorRef,
    pub metadata: JobMetadata,
    pub run_id: OpaqueRef,
    pub idempotency_key: IdempotencyKey,
    pub trace_id: TraceId,
}
```

```rust
/// Canonical factory for application idempotent operation context.
pub trait ArtifactOperationContextFactory {
    fn for_command(
        &self,
        operation_name: ArtifactOperationName,
        context: &ArtifactCommandCallContext,
    ) -> ArtifactIdempotentOperationContext;

    fn for_inbound_event(
        &self,
        operation_name: ArtifactOperationName,
        context: &ArtifactInboundEventCallContext,
        actor_ref: ActorRef,
    ) -> ArtifactIdempotentOperationContext;

    fn for_job(
        &self,
        operation_name: ArtifactOperationName,
        context: &ArtifactJobCallContext,
    ) -> ArtifactIdempotentOperationContext;
}
```

call context 规则:

- `api` / `worker` / `jobs` 不得自己拼 `ArtifactIdempotentOperationContext`。
- `ArtifactOperationContextFactory` 是 idempotency channel、operation name、actor 和 trace 的唯一归一化来源。
- inbound consumer 的 `actor_ref` 不直接来自外部 payload,而由 worker entry 依据 trusted source 规则传入 `for_inbound_event(...)`。

## 7. Application 基础 port 契约

### 7.1 `ClockPort`

```rust
pub trait ClockPort {
    fn now(&self) -> Timestamp;
}
```

### 7.2 `IdGeneratorPort`

```rust
pub trait IdGeneratorPort {
    fn new_artifact_fact_ref(&self) -> ArtifactFactRef;
    fn new_artifact_content_fact_context_ref(&self) -> ArtifactContentFactContextRef;
    fn new_artifact_version_ref(&self) -> ArtifactVersionRef;
    fn new_artifact_version_candidate_ref(&self) -> ArtifactVersionCandidateRef;
    fn new_artifact_lineage_link_ref(&self) -> ArtifactLineageLinkRef;
    fn new_artifact_baseline_ref(&self) -> ArtifactBaselineRef;
    fn new_artifact_baseline_membership_ref(&self) -> ArtifactBaselineMembershipRef;

    fn new_artifact_intake_context_ref(&self) -> ArtifactIntakeContextRef;
    fn new_artifact_submission_ref(&self) -> ArtifactSubmissionRef;
    fn new_artifact_review_anchor_ref(&self) -> ArtifactReviewAnchorRef;
    fn new_artifact_responsibility_assignment_ref(&self) -> ArtifactResponsibilityAssignmentRef;
    fn new_automation_artifact_input_ref(&self) -> AutomationArtifactInputRef;
    fn new_consumable_artifact_reference_ref(&self) -> ConsumableArtifactReferenceRef;
    fn new_artifact_consumption_backref_ref(&self) -> ArtifactConsumptionBackrefRef;

    fn new_artifact_derived_view_state_ref(&self) -> ArtifactDerivedViewStateRef;
    fn new_external_reference_resolution_state_ref(&self) -> ExternalReferenceResolutionStateRef;

    fn new_artifact_fact_change_record_ref(&self) -> ArtifactFactChangeRecordRef;
    fn new_artifact_version_change_record_ref(&self) -> ArtifactVersionChangeRecordRef;
    fn new_artifact_lineage_change_record_ref(&self) -> ArtifactLineageChangeRecordRef;
    fn new_artifact_baseline_change_record_ref(&self) -> ArtifactBaselineChangeRecordRef;
    fn new_artifact_input_resolution_record_ref(&self) -> ArtifactInputResolutionRecordRef;
    fn new_artifact_review_trace_record_ref(&self) -> ArtifactReviewTraceRecordRef;
    fn new_automation_intake_audit_record_ref(&self) -> AutomationIntakeAuditRecordRef;
    fn new_artifact_trace_record_ref(&self) -> ArtifactTraceRecordRef;
    fn new_artifact_handoff_record_ref(&self) -> ArtifactHandoffRecordRef;
    fn new_external_mirror_refresh_record_ref(&self) -> ExternalMirrorRefreshRecordRef;

    fn new_artifact_fact_summary_view_ref(&self) -> ArtifactFactSummaryViewRef;
    fn new_artifact_version_summary_view_ref(&self) -> ArtifactVersionSummaryViewRef;
    fn new_artifact_lineage_summary_view_ref(&self) -> ArtifactLineageSummaryViewRef;
    fn new_artifact_baseline_summary_view_ref(&self) -> ArtifactBaselineSummaryViewRef;
    fn new_artifact_review_summary_view_ref(&self) -> ArtifactReviewSummaryViewRef;
    fn new_artifact_read_surface_view_ref(&self) -> ArtifactReadSurfaceViewRef;
    fn new_artifact_preview_view_ref(&self) -> ArtifactPreviewViewRef;
    fn new_artifact_report_view_ref(&self) -> ArtifactReportViewRef;
    fn new_artifact_reconciliation_report_ref(&self) -> ArtifactReconciliationReportRef;
    fn new_artifact_relay_item_ref(&self) -> ArtifactRelayItemRef;
    fn new_artifact_relay_payload_snapshot_ref(&self) -> ArtifactRelayPayloadSnapshotRef;

    fn new_application_result_ref(&self) -> ArtifactApplicationResultRef;
    fn new_stored_result_surface_ref(&self) -> ArtifactStoredResultSurfaceRef;
}
```

`IdGeneratorPort` 红线:

- domain object factory 不得自行拼 `OpaqueRef`。
- repository adapter 不得 silently generate missing ref。
- fake runtime 与 durable adapter 必须可断言地产生稳定、非空、去碰撞的等价 ref。

## 8. Application service callable surface

### 8.1 service input / output carrier 总览

共有 4 组 public-facing service trait 和 1 组 worker-only internal facade:

| service trait | 负责接口族 | 对应 Step 5 service 主轴 |
|---|---|---|
| `ArtifactTruthWriteService` | truth-writing commands | `Truth Write Services` |
| `ArtifactReadConsumptionService` | query only | `Truth Read / Consumption Services` |
| `ArtifactIntakeReviewService` | intake / review / automation commands + inbound consumers | `Intake / Review Boundary Services` |
| `ArtifactDerivedMaintenanceService` | rebuild / refresh / reconcile / handoff jobs | `Derived Maintenance Services` |
| `ArtifactRelayPublicationService` | worker outbound relay publication loop only | `Event / Audit / Handoff Relay Ports` |

共享 output carrier:

| output | exact fields |
|---|---|
| `ArtifactIntakeWriteResult` | `result_ref`、`intake_context_ref`、`submission_ref: Option<ArtifactSubmissionRef>`、`resolution_record_ref: Option<ArtifactInputResolutionRecordRef>` |
| `ArtifactTruthWriteResult` | `result_ref`、`truth_anchor_ref`、`fact_change_record_ref: Option<ArtifactFactChangeRecordRef>`、`version_change_record_ref: Option<ArtifactVersionChangeRecordRef>`、`trace_record_ref: Option<ArtifactTraceRecordRef>` |
| `ArtifactLineageWriteResult` | `result_ref`、`artifact_lineage_link_ref`、`change_record_ref: ArtifactLineageChangeRecordRef` |
| `ArtifactBaselineWriteResult` | `result_ref`、`artifact_baseline_ref`、`membership_refs: ArtifactBaselineMembershipRefSet`、`change_record_ref: ArtifactBaselineChangeRecordRef` |
| `ArtifactReviewWriteResult` | `result_ref`、`review_anchor_ref`、`responsibility_assignment_ref: Option<ArtifactResponsibilityAssignmentRef>`、`trace_record_ref: ArtifactReviewTraceRecordRef>` |
| `ArtifactAutomationWriteResult` | `result_ref`、`automation_input_ref`、`audit_record_ref: AutomationIntakeAuditRecordRef`、`intake_context_ref: Option<ArtifactIntakeContextRef>` |
| `ArtifactConsumptionWriteResult` | `result_ref`、`consumable_ref: Option<ConsumableArtifactReferenceRef>`、`backref_ref: Option<ArtifactConsumptionBackrefRef>`、`trace_record_ref: Option<ArtifactTraceRecordRef>` |
| `ArtifactInboundReceiptResult` | `result_ref`、`disposition: ArtifactInboundDisposition`、`resolution_state_ref: Option<ExternalReferenceResolutionStateRef>`、`refresh_record_ref: Option<ExternalMirrorRefreshRecordRef>`、`trace_record_ref: Option<ArtifactTraceRecordRef>`、`stale_view_state_refs: Vec<ArtifactDerivedViewStateRef>` |
| `ArtifactMaintenanceJobResult` | `result_ref`、`job_outcome: ArtifactJobOutcome`、`changed_view_refs: Vec<OpaqueRef>`、`changed_state_refs: Vec<OpaqueRef>`、`handoff_record_refs: Vec<ArtifactHandoffRecordRef>`、`failed_refs: Vec<OpaqueRef>` |
| `ArtifactRelayPublicationBatchResult` | `scanned_relay_refs: Vec<ArtifactRelayItemRef>`、`published_relay_refs: Vec<ArtifactRelayItemRef>`、`retryable_relay_refs: Vec<ArtifactRelayItemRef>`、`failed_relay_refs: Vec<ArtifactRelayItemRef>` |

### 8.2 `ArtifactTruthWriteService`

```rust
pub trait ArtifactTruthWriteService {
    async fn establish_artifact_fact(&self, input: EstablishArtifactFactInput) -> Result<ArtifactTruthWriteResult, ApplicationError>;
    async fn create_artifact_version_candidate(&self, input: CreateArtifactVersionCandidateInput) -> Result<ArtifactTruthWriteResult, ApplicationError>;
    async fn publish_artifact_version(&self, input: PublishArtifactVersionInput) -> Result<ArtifactTruthWriteResult, ApplicationError>;
    async fn supersede_artifact_version(&self, input: SupersedeArtifactVersionInput) -> Result<ArtifactTruthWriteResult, ApplicationError>;
    async fn establish_artifact_lineage_link(&self, input: EstablishArtifactLineageLinkInput) -> Result<ArtifactLineageWriteResult, ApplicationError>;
    async fn reject_artifact_lineage_link(&self, input: RejectArtifactLineageLinkInput) -> Result<ArtifactLineageWriteResult, ApplicationError>;
    async fn create_artifact_baseline_candidate(&self, input: CreateArtifactBaselineCandidateInput) -> Result<ArtifactBaselineWriteResult, ApplicationError>;
    async fn freeze_artifact_baseline(&self, input: FreezeArtifactBaselineInput) -> Result<ArtifactBaselineWriteResult, ApplicationError>;
    async fn supersede_artifact_baseline(&self, input: SupersedeArtifactBaselineInput) -> Result<ArtifactBaselineWriteResult, ApplicationError>;
    async fn issue_consumable_artifact_reference(&self, input: IssueConsumableArtifactReferenceInput) -> Result<ArtifactConsumptionWriteResult, ApplicationError>;
    async fn record_artifact_consumption_backref(&self, input: RecordArtifactConsumptionBackrefInput) -> Result<ArtifactConsumptionWriteResult, ApplicationError>;
}
```

input carrier 闭口:

| input | exact fields |
|---|---|
| `EstablishArtifactFactInput` | `context: ArtifactCommandCallContext`、`intake_context_ref`、`definition_ref`、`review_anchor_ref: Option<ArtifactReviewAnchorRef>` |
| `CreateArtifactVersionCandidateInput` | `context`、`artifact_fact_ref`、`proposed_content_context_ref`、`candidate_source_ref: ArtifactContentSourceRef`、`submission_ref: ArtifactSubmissionRef` |
| `PublishArtifactVersionInput` | `context`、`artifact_version_candidate_ref`、`publish_reason: ArtifactChangeBasisRef` |
| `SupersedeArtifactVersionInput` | `context`、`current_version_ref`、`next_version_ref`、`supersede_reason: ArtifactChangeBasisRef` |
| `EstablishArtifactLineageLinkInput` | `context`、`source_version_ref`、`target_version_ref`、`relation_kind: ArtifactLineageRelationKind`、`basis_ref: ArtifactLineageBasisRef` |
| `RejectArtifactLineageLinkInput` | `context`、`artifact_lineage_link_ref`、`reject_reason: ArtifactLineageBasisRef` |
| `CreateArtifactBaselineCandidateInput` | `context`、`baseline_scope_ref`、`member_version_refs: Vec<ArtifactVersionRef>`、`membership_reason: ArtifactBaselineMembershipReason` |
| `FreezeArtifactBaselineInput` | `context`、`artifact_baseline_ref`、`freeze_context_ref: ArtifactReviewAnchorRef` |
| `SupersedeArtifactBaselineInput` | `context`、`current_baseline_ref`、`next_baseline_ref` |
| `IssueConsumableArtifactReferenceInput` | `context`、`truth_anchor_ref`、`consumer_scope_ref: ArtifactConsumerScopeRef` |
| `RecordArtifactConsumptionBackrefInput` | `context`、`consumer_ref: AdjacentConsumerRef`、`consumable_ref: ConsumableArtifactReferenceRef`、`consumption_reason: ArtifactConsumptionReason` |

### 8.3 `ArtifactIntakeReviewService`

```rust
pub trait ArtifactIntakeReviewService {
    async fn register_artifact_intake(&self, input: RegisterArtifactIntakeInput) -> Result<ArtifactIntakeWriteResult, ApplicationError>;
    async fn open_artifact_review_anchor(&self, input: OpenArtifactReviewAnchorInput) -> Result<ArtifactReviewWriteResult, ApplicationError>;
    async fn assign_artifact_responsibility(&self, input: AssignArtifactResponsibilityInput) -> Result<ArtifactReviewWriteResult, ApplicationError>;
    async fn register_automation_artifact_input(&self, input: RegisterAutomationArtifactInputInput) -> Result<ArtifactAutomationWriteResult, ApplicationError>;
    async fn accept_automation_artifact_input(&self, input: AcceptAutomationArtifactInputInput) -> Result<ArtifactAutomationWriteResult, ApplicationError>;

    async fn consume_work_artifact_context_changed(&self, input: ConsumeWorkArtifactContextChangedInput) -> Result<ArtifactInboundReceiptResult, ApplicationError>;
    async fn consume_process_artifact_context_changed(&self, input: ConsumeProcessArtifactContextChangedInput) -> Result<ArtifactInboundReceiptResult, ApplicationError>;
    async fn consume_governance_artifact_context_changed(&self, input: ConsumeGovernanceArtifactContextChangedInput) -> Result<ArtifactInboundReceiptResult, ApplicationError>;
    async fn consume_method_artifact_definition_changed(&self, input: ConsumeMethodArtifactDefinitionChangedInput) -> Result<ArtifactInboundReceiptResult, ApplicationError>;
    async fn consume_runtime_artifact_signal_recorded(&self, input: ConsumeRuntimeArtifactSignalRecordedInput) -> Result<ArtifactInboundReceiptResult, ApplicationError>;
    async fn consume_external_content_source_changed(&self, input: ConsumeExternalContentSourceChangedInput) -> Result<ArtifactInboundReceiptResult, ApplicationError>;
}
```

| input | exact fields |
|---|---|
| `RegisterArtifactIntakeInput` | `context: ArtifactCommandCallContext`、`source_ref: ArtifactContentSourceRef`、`intake_kind: ArtifactIntakeKind`、`definition_ref: Option<ArtifactDefinitionRef>`、`work_context_ref: Option<ArtifactWorkContextRef>`、`process_context_ref: Option<ArtifactProcessContextRef>`、`governance_context_ref: Option<ArtifactGovernanceContextRef>` |
| `OpenArtifactReviewAnchorInput` | `context`、`truth_anchor_ref`、`review_reason: ArtifactReviewReason` |
| `AssignArtifactResponsibilityInput` | `context`、`review_anchor_ref`、`responsible_party_ref: ActorRef`、`basis_ref: ArtifactResponsibilityBasisRef` |
| `RegisterAutomationArtifactInputInput` | `context`、`automation_source_ref: AutomationSourceRef`、`candidate_kind: AutomationArtifactCandidateKind`、`derived_from_ref: ArtifactTruthAnchorRef` |
| `AcceptAutomationArtifactInputInput` | `context`、`automation_input_ref: AutomationArtifactInputRef`、`intake_context_ref: ArtifactIntakeContextRef` |
| `ConsumeWorkArtifactContextChangedInput` | `context: ArtifactInboundEventCallContext`、`work_context_ref: ArtifactWorkContextRef` |
| `ConsumeProcessArtifactContextChangedInput` | `context`、`process_context_ref: ArtifactProcessContextRef` |
| `ConsumeGovernanceArtifactContextChangedInput` | `context`、`governance_context_ref: ArtifactGovernanceContextRef` |
| `ConsumeMethodArtifactDefinitionChangedInput` | `context`、`definition_ref: ArtifactDefinitionRef` |
| `ConsumeRuntimeArtifactSignalRecordedInput` | `context`、`automation_source_ref: AutomationSourceRef`、`derived_truth_anchor_ref: Option<ArtifactTruthAnchorRef>` |
| `ConsumeExternalContentSourceChangedInput` | `context`、`source_ref: ArtifactContentSourceRef` |

### 8.4 `ArtifactReadConsumptionService`

```rust
pub trait ArtifactReadConsumptionService {
    async fn get_artifact_fact(&self, input: GetArtifactFactInput) -> Result<ArtifactFactReadModel, ApplicationError>;
    async fn get_artifact_version(&self, input: GetArtifactVersionInput) -> Result<ArtifactVersionReadModel, ApplicationError>;
    async fn list_artifact_versions_by_fact(&self, input: ListArtifactVersionsByFactInput) -> Result<Page<ArtifactVersionSummaryView>, ApplicationError>;
    async fn get_artifact_lineage_summary(&self, input: GetArtifactLineageSummaryInput) -> Result<ArtifactLineageReadModel, ApplicationError>;
    async fn get_artifact_baseline(&self, input: GetArtifactBaselineInput) -> Result<ArtifactBaselineReadModel, ApplicationError>;
    async fn get_artifact_review_summary(&self, input: GetArtifactReviewSummaryInput) -> Result<ArtifactReviewReadModel, ApplicationError>;
    async fn get_artifact_read_surface(&self, input: GetArtifactReadSurfaceInput) -> Result<ArtifactReadSurfaceReadModel, ApplicationError>;
    async fn get_artifact_trace(&self, input: GetArtifactTraceInput) -> Result<Page<ArtifactTraceRecord>, ApplicationError>;
    async fn search_artifact_facts(&self, input: SearchArtifactFactsInput) -> Result<Page<ArtifactFactSummaryView>, ApplicationError>;
    async fn get_artifact_preview(&self, input: GetArtifactPreviewInput) -> Result<ArtifactPreviewReadModel, ApplicationError>;
    async fn get_artifact_report(&self, input: GetArtifactReportInput) -> Result<ArtifactReportReadModel, ApplicationError>;
    async fn get_artifact_reconciliation_report(&self, input: GetArtifactReconciliationReportInput) -> Result<ArtifactReconciliationReadModel, ApplicationError>;
    async fn get_external_reference_resolution(&self, input: GetExternalReferenceResolutionInput) -> Result<ArtifactReferenceResolutionReadModel, ApplicationError>;
}
```

application-local query read carrier:

| read model | exact fields |
|---|---|
| `ArtifactFactReadModel` | `fact: ArtifactFact`、`content_context: ArtifactContentFactContext`、`summary_view: Option<ArtifactFactSummaryView>` |
| `ArtifactVersionReadModel` | `version: ArtifactVersion`、`summary_view: Option<ArtifactVersionSummaryView>` |
| `ArtifactLineageReadModel` | `artifact_version_ref: ArtifactVersionRef`、`links: Vec<ArtifactLineageLink>`、`summary_view: Option<ArtifactLineageSummaryView>` |
| `ArtifactBaselineReadModel` | `baseline: ArtifactBaseline`、`memberships: Vec<ArtifactBaselineMembership>`、`summary_view: Option<ArtifactBaselineSummaryView>` |
| `ArtifactReviewReadModel` | `review_anchor: ArtifactReviewAnchor`、`responsibility_assignment: Option<ArtifactResponsibilityAssignment>`、`summary_view: Option<ArtifactReviewSummaryView>` |
| `ArtifactReadSurfaceReadModel` | `surface_view: ArtifactReadSurfaceView`、`backrefs: Vec<ArtifactConsumptionBackref>`、`trace_record: Option<ArtifactTraceRecord>` |
| `ArtifactPreviewReadModel` | `preview_view: ArtifactPreviewView`、`derived_state: ArtifactDerivedViewState` |
| `ArtifactReportReadModel` | `report_view: ArtifactReportView`、`derived_state: ArtifactDerivedViewState` |
| `ArtifactReconciliationReadModel` | `report: ArtifactReconciliationReport`、`derived_state: Option<ArtifactDerivedViewState>` |
| `ArtifactReferenceResolutionReadModel` | `resolution_state: ExternalReferenceResolutionState`、`last_refresh_record: Option<ExternalMirrorRefreshRecord>`、`snapshot_ref: Option<LocalMirrorSnapshotRef>` |

| input | exact fields |
|---|---|
| `GetArtifactFactInput` | `context: ArtifactQueryCallContext`、`artifact_fact_ref` |
| `GetArtifactVersionInput` | `context`、`artifact_version_ref` |
| `ListArtifactVersionsByFactInput` | `context`、`artifact_fact_ref`、`page: ArtifactRepositoryPage` |
| `GetArtifactLineageSummaryInput` | `context`、`artifact_version_ref` |
| `GetArtifactBaselineInput` | `context`、`artifact_baseline_ref` |
| `GetArtifactReviewSummaryInput` | `context`、`review_anchor_ref: ArtifactReviewAnchorRef` |
| `GetArtifactReadSurfaceInput` | `context`、`consumable_ref: Option<ConsumableArtifactReferenceRef>`、`truth_anchor_ref: Option<ArtifactTruthAnchorRef>`、`consumer_ref: AdjacentConsumerRef` |
| `GetArtifactTraceInput` | `context`、`truth_anchor_ref`、`page: ArtifactRepositoryPage` |
| `SearchArtifactFactsInput` | `context`、`definition_ref: Option<ArtifactDefinitionRef>`、`fact_state: Option<ArtifactFactState>`、`baseline_scope_ref: Option<ArtifactBaselineScopeRef>`、`page: ArtifactRepositoryPage` |
| `GetArtifactPreviewInput` | `context`、`truth_anchor_ref` |
| `GetArtifactReportInput` | `context`、`report_scope_ref: ArtifactReportScopeRef` |
| `GetArtifactReconciliationReportInput` | `context`、`reconciliation_scope_ref: ArtifactReconciliationScopeRef` |
| `GetExternalReferenceResolutionInput` | `context`、`resolution_state_ref: Option<ExternalReferenceResolutionStateRef>`、`external_ref: Option<ExternalSourceRef>`、`reference_kind: Option<ArtifactExternalReferenceKind>` |

### 8.5 `ArtifactDerivedMaintenanceService`

```rust
pub trait ArtifactDerivedMaintenanceService {
    async fn rebuild_artifact_derived_views(&self, input: RebuildArtifactDerivedViewsInput) -> Result<ArtifactMaintenanceJobResult, ApplicationError>;
    async fn refresh_external_reference_states(&self, input: RefreshExternalReferenceStatesInput) -> Result<ArtifactMaintenanceJobResult, ApplicationError>;
    async fn run_artifact_reconciliation(&self, input: RunArtifactReconciliationInput) -> Result<ArtifactMaintenanceJobResult, ApplicationError>;
    async fn prepare_artifact_archive_handoff(&self, input: PrepareArtifactArchiveHandoffInput) -> Result<ArtifactMaintenanceJobResult, ApplicationError>;
    async fn prepare_artifact_observability_handoff(&self, input: PrepareArtifactObservabilityHandoffInput) -> Result<ArtifactMaintenanceJobResult, ApplicationError>;
    async fn prepare_artifact_sync_handoff(&self, input: PrepareArtifactSyncHandoffInput) -> Result<ArtifactMaintenanceJobResult, ApplicationError>;
}
```

| input | exact fields |
|---|---|
| `RebuildArtifactDerivedViewsInput` | `context: ArtifactJobCallContext`、`derived_view_kinds: Vec<ArtifactDerivedViewKind>`、`snapshot_scope: ArtifactTruthSnapshotScope`、`page: ArtifactRepositoryPage` |
| `RefreshExternalReferenceStatesInput` | `context`、`refresh_scope: ArtifactReferenceRefreshScope`、`page: ArtifactRepositoryPage` |
| `RunArtifactReconciliationInput` | `context`、`reconciliation_scope_ref: ArtifactReconciliationScopeRef`、`snapshot_scope: ArtifactTruthSnapshotScope`、`page: ArtifactRepositoryPage` |
| `PrepareArtifactArchiveHandoffInput` | `context`、`target_ref: AdjacentConsumerRef`、`snapshot_scope: ArtifactTruthSnapshotScope`、`page: ArtifactRepositoryPage` |
| `PrepareArtifactObservabilityHandoffInput` | `context`、`target_ref: AdjacentConsumerRef`、`truth_anchor_refs: Vec<ArtifactTruthAnchorRef>`、`page: ArtifactRepositoryPage` |
| `PrepareArtifactSyncHandoffInput` | `context`、`target_ref: AdjacentConsumerRef`、`consumer_scope_ref: ArtifactConsumerScopeRef`、`page: ArtifactRepositoryPage` |

### 8.6 `ArtifactRelayPublicationService`

`ArtifactRelayPublicationService` 不是 public command/query/consumer/job surface,而是只供 `worker` relay loop 调用的 internal application facade。它负责读取 pending relay queue、读取 stored payload snapshot、调用 publisher port,并用 expected version 回写 publication state。Worker 不得直接访问 relay repository 或 publisher adapter。

```rust
pub struct PublishPendingArtifactRelaysInput {
    pub page: ArtifactRepositoryPage,
}

pub struct ArtifactRelayPublicationBatchResult {
    pub scanned_relay_refs: Vec<ArtifactRelayItemRef>,
    pub published_relay_refs: Vec<ArtifactRelayItemRef>,
    pub retryable_relay_refs: Vec<ArtifactRelayItemRef>,
    pub failed_relay_refs: Vec<ArtifactRelayItemRef>,
}

pub trait ArtifactRelayPublicationService {
    async fn publish_pending_artifact_relays(
        &self,
        input: PublishPendingArtifactRelaysInput,
    ) -> Result<ArtifactRelayPublicationBatchResult, ApplicationError>;
}
```

relay publication facade 红线:

- 只允许 mutation relay publication state;不得补写 truth、history、review、baseline、consumable 或 derived view body。
- 必须只读取 `ArtifactCommittedChangeRelayRepository.list_pending_with_payload(...)` 返回的 pending item 和 `get_payload_snapshot(...)` 返回的 stored snapshot,不得回查 current truth 重建 event payload。
- 不走 command / consumer / job stored-result duplicate replay;重复 publish 由 relay item 的 expected version 和 publication state 控制。

## 9. Truth persistence port capability 清单

### 9.1 capability / 接缝总览

| capability | 需要的 port | 调用方 | 说明 |
|---|---|---|---|
| fact / content context create + load | `ArtifactFactRepository`、`ArtifactContentContextRepository` | truth write / read service | 建立 fact truth,并支撑 `GetArtifactFact` |
| version candidate + version publish | `ArtifactVersionCandidateRepository`、`ArtifactVersionRepository` | truth write / read service | 候选修订与正式版本的 optimistic write |
| lineage establish / reject | `ArtifactLineageRepository` | truth write / read service | duplicate guard、summary query 和 traceability |
| baseline candidate / freeze / supersede | `ArtifactBaselineRepository`、`ArtifactBaselineMembershipRepository` | truth write / read service | formal-only baseline 和 membership freeze |
| intake / submission | `ArtifactIntakeContextRepository`、`ArtifactSubmissionRepository` | intake / consumer service | 收束语境和提交记录 |
| review / responsibility | `ArtifactReviewAnchorRepository`、`ArtifactResponsibilityRepository` | intake/review service + query | formal review anchor 与责任上下文 |
| automation boundary | `AutomationArtifactInputRepository` | intake/review service | automation candidate-only guard |
| consumption / backref | `ConsumableArtifactReferenceRepository`、`ArtifactConsumptionBackrefRepository` | truth write / query service | read surface 和 traceability |
| body-free truth snapshot | `ArtifactTruthSnapshotRepository` | derived maintenance service | rebuild / reconcile / handoff preparation |

### 9.2 fact / content context repositories

```rust
pub trait ArtifactFactRepository {
    async fn get_with_version(
        &self,
        artifact_fact_ref: ArtifactFactRef,
    ) -> Result<Option<Versioned<ArtifactFact>>, ApplicationError>;

    async fn find_by_content_context(
        &self,
        content_context_ref: ArtifactContentFactContextRef,
    ) -> Result<Option<Versioned<ArtifactFact>>, ApplicationError>;

    async fn list_by_definition(
        &self,
        definition_ref: ArtifactDefinitionRef,
        page: ArtifactRepositoryPage,
    ) -> Result<Page<Versioned<ArtifactFact>>, ApplicationError>;

    async fn save(
        &self,
        fact: ArtifactFact,
        expected_version: Option<ArtifactRepositoryVersion>,
        uow: &dyn ArtifactUnitOfWork,
    ) -> Result<ArtifactFactRef, ApplicationError>;
}

pub trait ArtifactContentContextRepository {
    async fn get_with_version(
        &self,
        content_context_ref: ArtifactContentFactContextRef,
    ) -> Result<Option<Versioned<ArtifactContentFactContext>>, ApplicationError>;

    async fn find_by_source(
        &self,
        source_ref: ArtifactContentSourceRef,
    ) -> Result<Option<Versioned<ArtifactContentFactContext>>, ApplicationError>;

    async fn save(
        &self,
        context: ArtifactContentFactContext,
        expected_version: Option<ArtifactRepositoryVersion>,
        uow: &dyn ArtifactUnitOfWork,
    ) -> Result<ArtifactContentFactContextRef, ApplicationError>;
}
```

### 9.3 version / version candidate repositories

```rust
pub trait ArtifactVersionRepository {
    async fn get_with_version(
        &self,
        artifact_version_ref: ArtifactVersionRef,
    ) -> Result<Option<Versioned<ArtifactVersion>>, ApplicationError>;

    async fn find_current_by_fact(
        &self,
        artifact_fact_ref: ArtifactFactRef,
    ) -> Result<Option<Versioned<ArtifactVersion>>, ApplicationError>;

    async fn list_by_fact(
        &self,
        artifact_fact_ref: ArtifactFactRef,
        page: ArtifactRepositoryPage,
    ) -> Result<Page<Versioned<ArtifactVersion>>, ApplicationError>;

    async fn save(
        &self,
        version: ArtifactVersion,
        expected_version: Option<ArtifactRepositoryVersion>,
        uow: &dyn ArtifactUnitOfWork,
    ) -> Result<ArtifactVersionRef, ApplicationError>;
}

pub trait ArtifactVersionCandidateRepository {
    async fn get_with_version(
        &self,
        artifact_version_candidate_ref: ArtifactVersionCandidateRef,
    ) -> Result<Option<Versioned<ArtifactVersionCandidate>>, ApplicationError>;

    async fn list_by_fact(
        &self,
        artifact_fact_ref: ArtifactFactRef,
        page: ArtifactRepositoryPage,
    ) -> Result<Page<Versioned<ArtifactVersionCandidate>>, ApplicationError>;

    async fn save(
        &self,
        candidate: ArtifactVersionCandidate,
        expected_version: Option<ArtifactRepositoryVersion>,
        uow: &dyn ArtifactUnitOfWork,
    ) -> Result<ArtifactVersionCandidateRef, ApplicationError>;
}
```

### 9.4 lineage / baseline repositories

```rust
pub trait ArtifactLineageRepository {
    async fn get_with_version(
        &self,
        artifact_lineage_link_ref: ArtifactLineageLinkRef,
    ) -> Result<Option<Versioned<ArtifactLineageLink>>, ApplicationError>;

    async fn find_by_endpoints(
        &self,
        source_version_ref: ArtifactVersionRef,
        target_version_ref: ArtifactVersionRef,
        relation_kind: ArtifactLineageRelationKind,
    ) -> Result<Option<Versioned<ArtifactLineageLink>>, ApplicationError>;

    async fn list_by_version(
        &self,
        artifact_version_ref: ArtifactVersionRef,
        page: ArtifactRepositoryPage,
    ) -> Result<Page<Versioned<ArtifactLineageLink>>, ApplicationError>;

    async fn save(
        &self,
        link: ArtifactLineageLink,
        expected_version: Option<ArtifactRepositoryVersion>,
        uow: &dyn ArtifactUnitOfWork,
    ) -> Result<ArtifactLineageLinkRef, ApplicationError>;
}

pub trait ArtifactBaselineRepository {
    async fn get_with_version(
        &self,
        artifact_baseline_ref: ArtifactBaselineRef,
    ) -> Result<Option<Versioned<ArtifactBaseline>>, ApplicationError>;

    async fn find_current_by_scope(
        &self,
        baseline_scope_ref: ArtifactBaselineScopeRef,
    ) -> Result<Option<Versioned<ArtifactBaseline>>, ApplicationError>;

    async fn list_by_scope(
        &self,
        baseline_scope_ref: ArtifactBaselineScopeRef,
        page: ArtifactRepositoryPage,
    ) -> Result<Page<Versioned<ArtifactBaseline>>, ApplicationError>;

    async fn save(
        &self,
        baseline: ArtifactBaseline,
        expected_version: Option<ArtifactRepositoryVersion>,
        uow: &dyn ArtifactUnitOfWork,
    ) -> Result<ArtifactBaselineRef, ApplicationError>;
}

pub trait ArtifactBaselineMembershipRepository {
    async fn get_with_version(
        &self,
        artifact_baseline_membership_ref: ArtifactBaselineMembershipRef,
    ) -> Result<Option<Versioned<ArtifactBaselineMembership>>, ApplicationError>;

    async fn list_by_baseline(
        &self,
        artifact_baseline_ref: ArtifactBaselineRef,
        page: ArtifactRepositoryPage,
    ) -> Result<Page<Versioned<ArtifactBaselineMembership>>, ApplicationError>;

    async fn save(
        &self,
        membership: ArtifactBaselineMembership,
        expected_version: Option<ArtifactRepositoryVersion>,
        uow: &dyn ArtifactUnitOfWork,
    ) -> Result<ArtifactBaselineMembershipRef, ApplicationError>;
}
```

### 9.5 intake / review / automation repositories

```rust
pub trait ArtifactIntakeContextRepository {
    async fn get_with_version(
        &self,
        artifact_intake_context_ref: ArtifactIntakeContextRef,
    ) -> Result<Option<Versioned<ArtifactIntakeContext>>, ApplicationError>;

    async fn find_by_source(
        &self,
        source_ref: ArtifactContentSourceRef,
    ) -> Result<Option<Versioned<ArtifactIntakeContext>>, ApplicationError>;

    async fn save(
        &self,
        intake_context: ArtifactIntakeContext,
        expected_version: Option<ArtifactRepositoryVersion>,
        uow: &dyn ArtifactUnitOfWork,
    ) -> Result<ArtifactIntakeContextRef, ApplicationError>;
}

pub trait ArtifactSubmissionRepository {
    async fn get_with_version(
        &self,
        artifact_submission_ref: ArtifactSubmissionRef,
    ) -> Result<Option<Versioned<ArtifactSubmissionRecord>>, ApplicationError>;

    async fn list_by_intake_context(
        &self,
        intake_context_ref: ArtifactIntakeContextRef,
        page: ArtifactRepositoryPage,
    ) -> Result<Page<Versioned<ArtifactSubmissionRecord>>, ApplicationError>;

    async fn save(
        &self,
        submission: ArtifactSubmissionRecord,
        expected_version: Option<ArtifactRepositoryVersion>,
        uow: &dyn ArtifactUnitOfWork,
    ) -> Result<ArtifactSubmissionRef, ApplicationError>;
}

pub trait ArtifactReviewAnchorRepository {
    async fn get_with_version(
        &self,
        artifact_review_anchor_ref: ArtifactReviewAnchorRef,
    ) -> Result<Option<Versioned<ArtifactReviewAnchor>>, ApplicationError>;

    async fn find_open_by_truth_anchor(
        &self,
        truth_anchor_ref: ArtifactTruthAnchorRef,
    ) -> Result<Option<Versioned<ArtifactReviewAnchor>>, ApplicationError>;

    async fn save(
        &self,
        review_anchor: ArtifactReviewAnchor,
        expected_version: Option<ArtifactRepositoryVersion>,
        uow: &dyn ArtifactUnitOfWork,
    ) -> Result<ArtifactReviewAnchorRef, ApplicationError>;
}

pub trait ArtifactResponsibilityRepository {
    async fn get_with_version(
        &self,
        artifact_responsibility_assignment_ref: ArtifactResponsibilityAssignmentRef,
    ) -> Result<Option<Versioned<ArtifactResponsibilityAssignment>>, ApplicationError>;

    async fn list_by_review_anchor(
        &self,
        review_anchor_ref: ArtifactReviewAnchorRef,
        page: ArtifactRepositoryPage,
    ) -> Result<Page<Versioned<ArtifactResponsibilityAssignment>>, ApplicationError>;

    async fn list_by_actor(
        &self,
        actor_ref: ActorRef,
        page: ArtifactRepositoryPage,
    ) -> Result<Page<Versioned<ArtifactResponsibilityAssignment>>, ApplicationError>;

    async fn save(
        &self,
        assignment: ArtifactResponsibilityAssignment,
        expected_version: Option<ArtifactRepositoryVersion>,
        uow: &dyn ArtifactUnitOfWork,
    ) -> Result<ArtifactResponsibilityAssignmentRef, ApplicationError>;
}

pub trait AutomationArtifactInputRepository {
    async fn get_with_version(
        &self,
        automation_input_ref: AutomationArtifactInputRef,
    ) -> Result<Option<Versioned<AutomationArtifactInput>>, ApplicationError>;

    async fn list_by_source(
        &self,
        automation_source_ref: AutomationSourceRef,
        page: ArtifactRepositoryPage,
    ) -> Result<Page<Versioned<AutomationArtifactInput>>, ApplicationError>;

    async fn save(
        &self,
        input: AutomationArtifactInput,
        expected_version: Option<ArtifactRepositoryVersion>,
        uow: &dyn ArtifactUnitOfWork,
    ) -> Result<AutomationArtifactInputRef, ApplicationError>;
}
```

### 9.6 consumption repositories

```rust
pub trait ConsumableArtifactReferenceRepository {
    async fn get_with_version(
        &self,
        consumable_ref: ConsumableArtifactReferenceRef,
    ) -> Result<Option<Versioned<ConsumableArtifactReference>>, ApplicationError>;

    async fn find_by_truth_anchor_and_scope(
        &self,
        truth_anchor_ref: ArtifactTruthAnchorRef,
        consumer_scope_ref: ArtifactConsumerScopeRef,
    ) -> Result<Option<Versioned<ConsumableArtifactReference>>, ApplicationError>;

    async fn list_by_truth_anchor(
        &self,
        truth_anchor_ref: ArtifactTruthAnchorRef,
        page: ArtifactRepositoryPage,
    ) -> Result<Page<Versioned<ConsumableArtifactReference>>, ApplicationError>;

    async fn save(
        &self,
        reference: ConsumableArtifactReference,
        expected_version: Option<ArtifactRepositoryVersion>,
        uow: &dyn ArtifactUnitOfWork,
    ) -> Result<ConsumableArtifactReferenceRef, ApplicationError>;
}

pub trait ArtifactConsumptionBackrefRepository {
    async fn get_with_version(
        &self,
        artifact_consumption_backref_ref: ArtifactConsumptionBackrefRef,
    ) -> Result<Option<Versioned<ArtifactConsumptionBackref>>, ApplicationError>;

    async fn list_by_consumable(
        &self,
        consumable_ref: ConsumableArtifactReferenceRef,
        page: ArtifactRepositoryPage,
    ) -> Result<Page<Versioned<ArtifactConsumptionBackref>>, ApplicationError>;

    async fn list_by_consumer(
        &self,
        consumer_ref: AdjacentConsumerRef,
        page: ArtifactRepositoryPage,
    ) -> Result<Page<Versioned<ArtifactConsumptionBackref>>, ApplicationError>;

    async fn save(
        &self,
        backref: ArtifactConsumptionBackref,
        expected_version: Option<ArtifactRepositoryVersion>,
        uow: &dyn ArtifactUnitOfWork,
    ) -> Result<ArtifactConsumptionBackrefRef, ApplicationError>;
}
```

### 9.7 truth snapshot repository

```rust
pub struct ArtifactTruthSnapshot {
    pub scope: ArtifactTruthSnapshotScope,
    pub truth_anchor_refs: Vec<ArtifactTruthAnchorRef>,
    pub version_refs: Vec<ArtifactVersionRef>,
    pub baseline_refs: Vec<ArtifactBaselineRef>,
    pub consumable_refs: Vec<ConsumableArtifactReferenceRef>,
    pub trace_refs: Vec<ArtifactTraceRecordRef>,
    pub source_cursor: ArtifactTruthCursor,
}

pub trait ArtifactTruthSnapshotRepository {
    async fn load_baseline_scope_snapshot(
        &self,
        baseline_scope_ref: ArtifactBaselineScopeRef,
        page: ArtifactRepositoryPage,
    ) -> Result<ArtifactTruthSnapshot, ApplicationError>;

    async fn load_report_scope_snapshot(
        &self,
        report_scope_ref: ArtifactReportScopeRef,
        page: ArtifactRepositoryPage,
    ) -> Result<ArtifactTruthSnapshot, ApplicationError>;

    async fn load_reconciliation_scope_snapshot(
        &self,
        reconciliation_scope_ref: ArtifactReconciliationScopeRef,
        page: ArtifactRepositoryPage,
    ) -> Result<ArtifactTruthSnapshot, ApplicationError>;

    async fn load_consumer_scope_snapshot(
        &self,
        consumer_scope_ref: ArtifactConsumerScopeRef,
        page: ArtifactRepositoryPage,
    ) -> Result<ArtifactTruthSnapshot, ApplicationError>;
}
```

truth snapshot 红线:

- 只返回 committed truth 的 body-free refs / cursor。
- 不返回 external body、derived preview body、report body 或 sibling repo payload。
- `source_cursor` 是 rebuild / reconcile / handoff 的唯一 committed truth coverage cursor。
- `ArtifactTruthSnapshotScope` 继续只作为 job input helper;application service 必须先按 scope variant 显式分发到 `load_*_snapshot(...)`,不得把 enum 透传给 repository 再由 adapter 猜分支。

truth snapshot 读取面与 job family 映射:

| callable surface | 允许承接的 job / flow |
|---|---|
| `load_baseline_scope_snapshot(...)` | baseline-scoped rebuild、archive handoff |
| `load_report_scope_snapshot(...)` | report generation、archive handoff |
| `load_reconciliation_scope_snapshot(...)` | reconciliation report build |
| `load_consumer_scope_snapshot(...)` | sync handoff、consumer-scoped rebuild |

## 10. Append-only、Projection、Reference、Result 与 Handoff preparation ports

### 10.1 change / audit / trace / handoff / refresh record repositories

```rust
pub trait ArtifactChangeRecordRepository {
    async fn append_fact_change(
        &self,
        record: ArtifactFactChangeRecord,
        uow: &dyn ArtifactUnitOfWork,
    ) -> Result<ArtifactFactChangeRecordRef, ApplicationError>;

    async fn append_version_change(
        &self,
        record: ArtifactVersionChangeRecord,
        uow: &dyn ArtifactUnitOfWork,
    ) -> Result<ArtifactVersionChangeRecordRef, ApplicationError>;

    async fn append_lineage_change(
        &self,
        record: ArtifactLineageChangeRecord,
        uow: &dyn ArtifactUnitOfWork,
    ) -> Result<ArtifactLineageChangeRecordRef, ApplicationError>;

    async fn append_baseline_change(
        &self,
        record: ArtifactBaselineChangeRecord,
        uow: &dyn ArtifactUnitOfWork,
    ) -> Result<ArtifactBaselineChangeRecordRef, ApplicationError>;
}

pub trait ArtifactBoundaryAuditRepository {
    async fn append_input_resolution(
        &self,
        record: ArtifactInputResolutionRecord,
        uow: &dyn ArtifactUnitOfWork,
    ) -> Result<ArtifactInputResolutionRecordRef, ApplicationError>;

    async fn append_review_trace(
        &self,
        record: ArtifactReviewTraceRecord,
        uow: &dyn ArtifactUnitOfWork,
    ) -> Result<ArtifactReviewTraceRecordRef, ApplicationError>;

    async fn append_automation_audit(
        &self,
        record: AutomationIntakeAuditRecord,
        uow: &dyn ArtifactUnitOfWork,
    ) -> Result<AutomationIntakeAuditRecordRef, ApplicationError>;
}

pub trait ArtifactTraceRepository {
    async fn append(
        &self,
        record: ArtifactTraceRecord,
        uow: &dyn ArtifactUnitOfWork,
    ) -> Result<ArtifactTraceRecordRef, ApplicationError>;

    async fn list_by_truth_anchor(
        &self,
        truth_anchor_ref: ArtifactTruthAnchorRef,
        page: ArtifactRepositoryPage,
    ) -> Result<Page<ArtifactTraceRecord>, ApplicationError>;
}

pub trait ArtifactHandoffRecordRepository {
    async fn append(
        &self,
        record: ArtifactHandoffRecord,
        uow: &dyn ArtifactUnitOfWork,
    ) -> Result<ArtifactHandoffRecordRef, ApplicationError>;

    async fn find_latest_by_truth_anchor_and_channel(
        &self,
        truth_anchor_ref: ArtifactTruthAnchorRef,
        channel_ref: ArtifactHandoffChannelRef,
    ) -> Result<Option<ArtifactHandoffRecord>, ApplicationError>;

    async fn list_by_channel(
        &self,
        channel_ref: ArtifactHandoffChannelRef,
        page: ArtifactRepositoryPage,
    ) -> Result<Page<ArtifactHandoffRecord>, ApplicationError>;
}

pub trait ExternalMirrorRefreshRecordRepository {
    async fn append(
        &self,
        record: ExternalMirrorRefreshRecord,
        uow: &dyn ArtifactUnitOfWork,
    ) -> Result<ExternalMirrorRefreshRecordRef, ApplicationError>;

    async fn list_by_external_ref(
        &self,
        external_ref: ExternalSourceRef,
        page: ArtifactRepositoryPage,
    ) -> Result<Page<ExternalMirrorRefreshRecord>, ApplicationError>;
}
```

### 10.2 projection / read model repositories

```rust
pub trait ArtifactSummaryViewRepository {
    async fn get_fact_summary_with_version(
        &self,
        view_ref: ArtifactFactSummaryViewRef,
    ) -> Result<Option<Versioned<ArtifactFactSummaryView>>, ApplicationError>;

    async fn find_fact_summary_by_fact(
        &self,
        artifact_fact_ref: ArtifactFactRef,
    ) -> Result<Option<Versioned<ArtifactFactSummaryView>>, ApplicationError>;

    async fn save_fact_summary(
        &self,
        view: ArtifactFactSummaryView,
        expected_version: Option<ArtifactRepositoryVersion>,
        uow: &dyn ArtifactUnitOfWork,
    ) -> Result<ArtifactFactSummaryViewRef, ApplicationError>;

    async fn get_version_summary_with_version(
        &self,
        view_ref: ArtifactVersionSummaryViewRef,
    ) -> Result<Option<Versioned<ArtifactVersionSummaryView>>, ApplicationError>;

    async fn find_version_summary_by_version(
        &self,
        artifact_version_ref: ArtifactVersionRef,
    ) -> Result<Option<Versioned<ArtifactVersionSummaryView>>, ApplicationError>;

    async fn save_version_summary(
        &self,
        view: ArtifactVersionSummaryView,
        expected_version: Option<ArtifactRepositoryVersion>,
        uow: &dyn ArtifactUnitOfWork,
    ) -> Result<ArtifactVersionSummaryViewRef, ApplicationError>;

    async fn get_lineage_summary_with_version(
        &self,
        view_ref: ArtifactLineageSummaryViewRef,
    ) -> Result<Option<Versioned<ArtifactLineageSummaryView>>, ApplicationError>;

    async fn find_lineage_summary_by_version(
        &self,
        artifact_version_ref: ArtifactVersionRef,
    ) -> Result<Option<Versioned<ArtifactLineageSummaryView>>, ApplicationError>;

    async fn save_lineage_summary(
        &self,
        view: ArtifactLineageSummaryView,
        expected_version: Option<ArtifactRepositoryVersion>,
        uow: &dyn ArtifactUnitOfWork,
    ) -> Result<ArtifactLineageSummaryViewRef, ApplicationError>;

    async fn get_baseline_summary_with_version(
        &self,
        view_ref: ArtifactBaselineSummaryViewRef,
    ) -> Result<Option<Versioned<ArtifactBaselineSummaryView>>, ApplicationError>;

    async fn find_baseline_summary_by_baseline(
        &self,
        artifact_baseline_ref: ArtifactBaselineRef,
    ) -> Result<Option<Versioned<ArtifactBaselineSummaryView>>, ApplicationError>;

    async fn save_baseline_summary(
        &self,
        view: ArtifactBaselineSummaryView,
        expected_version: Option<ArtifactRepositoryVersion>,
        uow: &dyn ArtifactUnitOfWork,
    ) -> Result<ArtifactBaselineSummaryViewRef, ApplicationError>;

    async fn get_review_summary_with_version(
        &self,
        view_ref: ArtifactReviewSummaryViewRef,
    ) -> Result<Option<Versioned<ArtifactReviewSummaryView>>, ApplicationError>;

    async fn find_review_summary_by_anchor(
        &self,
        review_anchor_ref: ArtifactReviewAnchorRef,
    ) -> Result<Option<Versioned<ArtifactReviewSummaryView>>, ApplicationError>;

    async fn save_review_summary(
        &self,
        view: ArtifactReviewSummaryView,
        expected_version: Option<ArtifactRepositoryVersion>,
        uow: &dyn ArtifactUnitOfWork,
    ) -> Result<ArtifactReviewSummaryViewRef, ApplicationError>;

    async fn search_fact_summaries(
        &self,
        definition_ref: Option<ArtifactDefinitionRef>,
        fact_state: Option<ArtifactFactState>,
        baseline_scope_ref: Option<ArtifactBaselineScopeRef>,
        page: ArtifactRepositoryPage,
    ) -> Result<Page<ArtifactFactSummaryView>, ApplicationError>;
}
```

```rust
pub trait ArtifactReadSurfaceRepository {
    async fn get_with_version(
        &self,
        view_ref: ArtifactReadSurfaceViewRef,
    ) -> Result<Option<Versioned<ArtifactReadSurfaceView>>, ApplicationError>;

    async fn find_by_consumable(
        &self,
        consumable_ref: ConsumableArtifactReferenceRef,
    ) -> Result<Option<Versioned<ArtifactReadSurfaceView>>, ApplicationError>;

    async fn save(
        &self,
        view: ArtifactReadSurfaceView,
        expected_version: Option<ArtifactRepositoryVersion>,
        uow: &dyn ArtifactUnitOfWork,
    ) -> Result<ArtifactReadSurfaceViewRef, ApplicationError>;
}

pub trait ArtifactPreviewViewRepository {
    async fn find_by_truth_anchor(
        &self,
        truth_anchor_ref: ArtifactTruthAnchorRef,
    ) -> Result<Option<Versioned<ArtifactPreviewView>>, ApplicationError>;

    async fn save(
        &self,
        view: ArtifactPreviewView,
        expected_version: Option<ArtifactRepositoryVersion>,
        uow: &dyn ArtifactUnitOfWork,
    ) -> Result<ArtifactPreviewViewRef, ApplicationError>;
}

pub trait ArtifactReportViewRepository {
    async fn find_by_scope(
        &self,
        report_scope_ref: ArtifactReportScopeRef,
    ) -> Result<Option<Versioned<ArtifactReportView>>, ApplicationError>;

    async fn save(
        &self,
        view: ArtifactReportView,
        expected_version: Option<ArtifactRepositoryVersion>,
        uow: &dyn ArtifactUnitOfWork,
    ) -> Result<ArtifactReportViewRef, ApplicationError>;
}

pub trait ArtifactReconciliationReportRepository {
    async fn find_by_scope(
        &self,
        reconciliation_scope_ref: ArtifactReconciliationScopeRef,
    ) -> Result<Option<Versioned<ArtifactReconciliationReport>>, ApplicationError>;

    async fn save(
        &self,
        report: ArtifactReconciliationReport,
        expected_version: Option<ArtifactRepositoryVersion>,
        uow: &dyn ArtifactUnitOfWork,
    ) -> Result<ArtifactReconciliationReportRef, ApplicationError>;
}
```

### 10.3 derived state / reference state / mirror snapshot repositories

```rust
pub trait ArtifactDerivedViewStateRepository {
    async fn get_with_version(
        &self,
        state_ref: ArtifactDerivedViewStateRef,
    ) -> Result<Option<Versioned<ArtifactDerivedViewState>>, ApplicationError>;

    async fn find_by_kind(
        &self,
        derived_view_kind: ArtifactDerivedViewKind,
    ) -> Result<Option<Versioned<ArtifactDerivedViewState>>, ApplicationError>;

    async fn save(
        &self,
        state: ArtifactDerivedViewState,
        expected_version: Option<ArtifactRepositoryVersion>,
        uow: &dyn ArtifactUnitOfWork,
    ) -> Result<ArtifactDerivedViewStateRef, ApplicationError>;
}

pub trait ExternalReferenceResolutionStateRepository {
    async fn get_with_version(
        &self,
        state_ref: ExternalReferenceResolutionStateRef,
    ) -> Result<Option<Versioned<ExternalReferenceResolutionState>>, ApplicationError>;

    async fn find_by_external_ref_and_kind(
        &self,
        external_ref: ExternalSourceRef,
        reference_kind: ArtifactExternalReferenceKind,
    ) -> Result<Option<Versioned<ExternalReferenceResolutionState>>, ApplicationError>;

    async fn list_by_refresh_scope(
        &self,
        refresh_scope: ArtifactReferenceRefreshScope,
        page: ArtifactRepositoryPage,
    ) -> Result<Page<Versioned<ExternalReferenceResolutionState>>, ApplicationError>;

    async fn save(
        &self,
        state: ExternalReferenceResolutionState,
        expected_version: Option<ArtifactRepositoryVersion>,
        uow: &dyn ArtifactUnitOfWork,
    ) -> Result<ExternalReferenceResolutionStateRef, ApplicationError>;
}

pub struct ArtifactLocalMirrorSnapshot {
    pub snapshot_ref: LocalMirrorSnapshotRef,
    pub external_ref: ExternalSourceRef,
    pub reference_kind: ArtifactExternalReferenceKind,
    pub source_version_ref: Option<ExternalSourceVersionRef>,
    pub summary_ref: Option<SafeSummaryRef>,
    pub source_digest: Option<SourceDigest>,
}

pub trait ArtifactLocalMirrorSnapshotRepository {
    async fn get(
        &self,
        snapshot_ref: LocalMirrorSnapshotRef,
    ) -> Result<Option<ArtifactLocalMirrorSnapshot>, ApplicationError>;

    async fn find_latest_by_external_ref(
        &self,
        external_ref: ExternalSourceRef,
        reference_kind: ArtifactExternalReferenceKind,
    ) -> Result<Option<ArtifactLocalMirrorSnapshot>, ApplicationError>;

    async fn save(
        &self,
        snapshot: ArtifactLocalMirrorSnapshot,
        uow: &dyn ArtifactUnitOfWork,
    ) -> Result<LocalMirrorSnapshotRef, ApplicationError>;
}
```

### 10.4 relay queue / payload snapshot repository

Outbound Event 在 `L1-artifact` 不作为 public command/query/job surface 暴露,但 accepted truth / derived state change 必须在 same UoW 内 durable capture 成 stored relay item + stored payload snapshot,供 worker relay publication loop 后续发布。Step 7 只闭口 relay queue、payload snapshot lookup 和 publication marker update 接缝;public event envelope / payload body field 集合由 Step 8 继续闭口。

```rust
pub struct ArtifactRelayItemRef(pub String);

pub struct ArtifactRelayPayloadSnapshotRef(pub String);

pub struct ArtifactEventSchemaVersion(pub String);

pub struct ArtifactSerializedOutboundPayload(pub Vec<u8>);

pub struct ArtifactRelayPublicationRef(pub String);

pub struct ArtifactRelayFailureReason(pub String);

pub enum ArtifactOutboundEventKind {
    ArtifactFactChanged,
    ArtifactVersionChanged,
    ArtifactLineageChanged,
    ArtifactBaselineChanged,
    ArtifactReviewChanged,
    ConsumableArtifactReferenceChanged,
    ArtifactTraceAvailable,
    ArtifactDerivedViewStateChanged,
}

pub enum ArtifactCommittedChange {
    Fact {
        artifact_fact_ref: ArtifactFactRef,
        content_context_ref: ArtifactContentFactContextRef,
        change_kind: ArtifactFactChangeKind,
        truth_cursor: ArtifactTruthCursor,
    },
    Version {
        artifact_version_ref: ArtifactVersionRef,
        artifact_fact_ref: ArtifactFactRef,
        version_state: ArtifactVersionState,
        truth_cursor: ArtifactTruthCursor,
    },
    Lineage {
        artifact_lineage_link_ref: ArtifactLineageLinkRef,
        source_version_ref: ArtifactVersionRef,
        target_version_ref: ArtifactVersionRef,
        relation_kind: ArtifactLineageRelationKind,
        truth_cursor: ArtifactTruthCursor,
    },
    Baseline {
        artifact_baseline_ref: ArtifactBaselineRef,
        baseline_scope_ref: ArtifactBaselineScopeRef,
        baseline_state: ArtifactBaselineState,
        truth_cursor: ArtifactTruthCursor,
    },
    Review {
        review_anchor_ref: ArtifactReviewAnchorRef,
        responsibility_assignment_ref: Option<ArtifactResponsibilityAssignmentRef>,
        review_state: ArtifactReviewState,
        truth_cursor: ArtifactTruthCursor,
    },
    Consumable {
        consumable_ref: ConsumableArtifactReferenceRef,
        truth_anchor_ref: ArtifactTruthAnchorRef,
        reference_state: ConsumableArtifactReferenceState,
        truth_cursor: ArtifactTruthCursor,
    },
    Traceability {
        trace_record_ref: ArtifactTraceRecordRef,
        truth_anchor_ref: ArtifactTruthAnchorRef,
        handoff_record_ref: Option<ArtifactHandoffRecordRef>,
        trace_state: ArtifactTraceState,
        truth_cursor: ArtifactTruthCursor,
    },
    DerivedViewState {
        derived_view_state_ref: ArtifactDerivedViewStateRef,
        derived_view_kind: ArtifactDerivedViewKind,
        freshness_state: ArtifactDerivedFreshnessState,
        truth_cursor: ArtifactTruthCursor,
    },
}

pub struct ArtifactRelayPayloadSnapshot {
    pub payload_snapshot_ref: ArtifactRelayPayloadSnapshotRef,
    pub event_kind: ArtifactOutboundEventKind,
    pub schema_version: ArtifactEventSchemaVersion,
    pub serialized_payload: ArtifactSerializedOutboundPayload,
    pub core_trace_id: TraceId,
}

pub struct ArtifactPendingRelayItem {
    pub relay_item_ref: ArtifactRelayItemRef,
    pub change: ArtifactCommittedChange,
    pub payload_snapshot_ref: ArtifactRelayPayloadSnapshotRef,
}

pub trait ArtifactCommittedChangeRelayRepository {
    async fn append(
        &self,
        change: ArtifactCommittedChange,
        payload_snapshot: ArtifactRelayPayloadSnapshot,
        uow: &dyn ArtifactUnitOfWork,
    ) -> Result<ArtifactRelayItemRef, ApplicationError>;

    async fn get_payload_snapshot(
        &self,
        payload_snapshot_ref: ArtifactRelayPayloadSnapshotRef,
    ) -> Result<Option<ArtifactRelayPayloadSnapshot>, ApplicationError>;

    async fn list_pending_with_payload(
        &self,
        page: ArtifactRepositoryPage,
    ) -> Result<Page<Versioned<ArtifactPendingRelayItem>>, ApplicationError>;

    async fn mark_published(
        &self,
        relay_item_ref: ArtifactRelayItemRef,
        publication_ref: ArtifactRelayPublicationRef,
        expected_version: ArtifactRepositoryVersion,
        uow: &dyn ArtifactUnitOfWork,
    ) -> Result<(), ApplicationError>;

    async fn mark_retryable(
        &self,
        relay_item_ref: ArtifactRelayItemRef,
        reason: ArtifactRelayFailureReason,
        expected_version: ArtifactRepositoryVersion,
        uow: &dyn ArtifactUnitOfWork,
    ) -> Result<(), ApplicationError>;

    async fn mark_failed(
        &self,
        relay_item_ref: ArtifactRelayItemRef,
        reason: ArtifactRelayFailureReason,
        expected_version: ArtifactRepositoryVersion,
        uow: &dyn ArtifactUnitOfWork,
    ) -> Result<(), ApplicationError>;
}
```

| committed change variant | outbound event kind | payload snapshot builder 不得缺失的 formal source |
|---|---|---|
| `Fact` | `ArtifactFactChanged` | fact ref、content context ref、change kind、truth cursor |
| `Version` | `ArtifactVersionChanged` | version ref、fact ref、version state、truth cursor |
| `Lineage` | `ArtifactLineageChanged` | lineage ref、source/target version refs、relation kind、truth cursor |
| `Baseline` | `ArtifactBaselineChanged` | baseline ref、scope ref、baseline state、truth cursor |
| `Review` | `ArtifactReviewChanged` | review anchor ref、optional responsibility assignment ref、review state、truth cursor |
| `Consumable` | `ConsumableArtifactReferenceChanged` | consumable ref、truth anchor ref、reference state、truth cursor |
| `Traceability` | `ArtifactTraceAvailable` | trace ref、truth anchor ref、optional handoff record ref、trace state、truth cursor |
| `DerivedViewState` | `ArtifactDerivedViewStateChanged` | derived state ref、view kind、freshness state、truth cursor |

relay queue / payload snapshot 红线:

- accepted command 或 maintenance accepted path 必须在 same `ArtifactUnitOfWork` 内同时保存 committed change 与 stored payload snapshot;不得先 commit truth 再依赖 current truth 补 event payload。
- `list_pending_with_payload(...)` 是 worker relay loop 的唯一 scan surface;worker 不得直接扫 durable store、自建 queue map 或从 trace/history 推 pending item。
- publisher path 如果 `get_payload_snapshot(...)` missing,只能 `mark_failed(...)` 或 `mark_retryable(...)`;不得回查 current truth、projection、mirror snapshot 或 sibling repo payload 重建快照。
- `mark_published(...)` / `mark_retryable(...)` / `mark_failed(...)` 必须使用 `list_pending_with_payload(...)` 返回的 `version`;不得重新查询 timestamp / cursor / row id 代替 expected version。

### 10.5 prepared handoff material repository

```rust
pub struct PreparedArtifactArchiveHandoff {
    pub handoff_record_ref: ArtifactHandoffRecordRef,
    pub target_ref: AdjacentConsumerRef,
    pub baseline_refs: Vec<ArtifactBaselineRef>,
    pub report_refs: Vec<ArtifactReportViewRef>,
    pub trace_refs: Vec<ArtifactTraceRecordRef>,
}

pub struct PreparedArtifactObservabilityHandoff {
    pub handoff_record_ref: ArtifactHandoffRecordRef,
    pub target_ref: AdjacentConsumerRef,
    pub truth_anchor_refs: Vec<ArtifactTruthAnchorRef>,
    pub trace_refs: Vec<ArtifactTraceRecordRef>,
    pub review_anchor_refs: Vec<ArtifactReviewAnchorRef>,
}

pub struct PreparedArtifactSyncHandoff {
    pub handoff_record_ref: ArtifactHandoffRecordRef,
    pub target_ref: AdjacentConsumerRef,
    pub consumable_refs: Vec<ConsumableArtifactReferenceRef>,
    pub read_surface_refs: Vec<ArtifactReadSurfaceViewRef>,
    pub trace_refs: Vec<ArtifactTraceRecordRef>,
}

pub enum PreparedArtifactHandoffMaterial {
    Archive(PreparedArtifactArchiveHandoff),
    Observability(PreparedArtifactObservabilityHandoff),
    Sync(PreparedArtifactSyncHandoff),
}

pub trait PreparedArtifactHandoffRepository {
    async fn save(
        &self,
        material: PreparedArtifactHandoffMaterial,
        uow: &dyn ArtifactUnitOfWork,
    ) -> Result<ArtifactHandoffRecordRef, ApplicationError>;

    async fn get(
        &self,
        handoff_record_ref: ArtifactHandoffRecordRef,
    ) -> Result<Option<PreparedArtifactHandoffMaterial>, ApplicationError>;
}
```

### 10.6 idempotency and stored result repositories

```rust
pub struct ArtifactIdempotencyConflictReason(pub String);

pub enum ArtifactIdempotencyReservation {
    Reserved {
        idempotency_ref: ArtifactIdempotencyRef,
    },
    Duplicate {
        result_ref: ArtifactApplicationResultRef,
    },
    Conflict {
        idempotency_ref: ArtifactIdempotencyRef,
        reason: ArtifactIdempotencyConflictReason,
    },
}

pub enum ArtifactCommandRejectionCode {
    PolicyRejected,
    InvalidState,
    MissingRequiredReference,
    VisibilityDenied,
    DuplicateConflict,
}

pub enum ArtifactInboundDisposition {
    Accepted,
    Duplicate,
    Delayed,
    Rejected,
    UnsupportedSchema,
    Quarantined,
}

pub enum ArtifactJobOutcome {
    Completed,
    PartiallyCompleted,
    Failed,
}

pub struct ArtifactCommandResultEnvelope {
    pub result_ref: ArtifactApplicationResultRef,
    pub operation_name: ArtifactOperationName,
    pub surface_ref: ArtifactStoredResultSurfaceRef,
    pub truth_anchor_ref: Option<ArtifactTruthAnchorRef>,
}

pub struct ArtifactCommandRejectionEnvelope {
    pub result_ref: ArtifactApplicationResultRef,
    pub operation_name: ArtifactOperationName,
    pub surface_ref: ArtifactStoredResultSurfaceRef,
    pub rejection_code: ArtifactCommandRejectionCode,
}

pub struct ArtifactInboundReceiptEnvelope {
    pub result_ref: ArtifactApplicationResultRef,
    pub operation_name: ArtifactOperationName,
    pub surface_ref: ArtifactStoredResultSurfaceRef,
    pub disposition: ArtifactInboundDisposition,
    pub resolution_state_ref: Option<ExternalReferenceResolutionStateRef>,
    pub trace_record_ref: Option<ArtifactTraceRecordRef>,
}

pub struct ArtifactJobReportEnvelope {
    pub result_ref: ArtifactApplicationResultRef,
    pub operation_name: ArtifactOperationName,
    pub surface_ref: ArtifactStoredResultSurfaceRef,
    pub outcome: ArtifactJobOutcome,
    pub changed_refs: Vec<OpaqueRef>,
    pub failed_refs: Vec<OpaqueRef>,
}

pub enum StoredArtifactOperationResult {
    CommandResult(ArtifactCommandResultEnvelope),
    CommandRejection(ArtifactCommandRejectionEnvelope),
    InboundReceipt(ArtifactInboundReceiptEnvelope),
    JobReport(ArtifactJobReportEnvelope),
}
```

```rust
pub trait ArtifactIdempotencyRepository {
    async fn reserve(
        &self,
        context: &ArtifactIdempotentOperationContext,
        request_digest: ArtifactRequestDigest,
        uow: &dyn ArtifactUnitOfWork,
    ) -> Result<ArtifactIdempotencyReservation, ApplicationError>;

    async fn complete(
        &self,
        idempotency_ref: ArtifactIdempotencyRef,
        result_ref: ArtifactApplicationResultRef,
        uow: &dyn ArtifactUnitOfWork,
    ) -> Result<(), ApplicationError>;

    async fn mark_conflict(
        &self,
        idempotency_ref: ArtifactIdempotencyRef,
        reason: ArtifactIdempotencyConflictReason,
        uow: &dyn ArtifactUnitOfWork,
    ) -> Result<(), ApplicationError>;
}

pub trait StoredArtifactResultRepository {
    async fn save(
        &self,
        result: StoredArtifactOperationResult,
        uow: &dyn ArtifactUnitOfWork,
    ) -> Result<ArtifactApplicationResultRef, ApplicationError>;

    async fn get(
        &self,
        result_ref: ArtifactApplicationResultRef,
    ) -> Result<Option<StoredArtifactOperationResult>, ApplicationError>;

    async fn get_command_result(
        &self,
        result_ref: ArtifactApplicationResultRef,
    ) -> Result<Option<ArtifactCommandResultEnvelope>, ApplicationError>;

    async fn get_command_rejection(
        &self,
        result_ref: ArtifactApplicationResultRef,
    ) -> Result<Option<ArtifactCommandRejectionEnvelope>, ApplicationError>;

    async fn get_inbound_receipt(
        &self,
        result_ref: ArtifactApplicationResultRef,
    ) -> Result<Option<ArtifactInboundReceiptEnvelope>, ApplicationError>;

    async fn get_job_report(
        &self,
        result_ref: ArtifactApplicationResultRef,
    ) -> Result<Option<ArtifactJobReportEnvelope>, ApplicationError>;
}
```

stored result / idempotency 红线:

- duplicate replay 只能返回已保存的 result / receipt / report surface,不得重跑 mutation。
- `StoredArtifactOperationResult` 的 save 与 get 必须字段对称。
- `reserve(...)` 的 channel / operation / actor / trace 必须来自 `ArtifactOperationContextFactory`。

## 11. External resolver、truth change relay 与 handoff delivery ports

### 11.1 external resolver outcome

```rust
pub enum ArtifactReferenceRefreshResolution<T> {
    Resolved {
        state: ExternalReferenceResolutionState,
        body: T,
    },
    Unresolved {
        reason: ArtifactReferenceUnresolvedReason,
        checked_at: Timestamp,
    },
    Failed {
        reason: ArtifactReferenceRefreshFailureReason,
        checked_at: Timestamp,
    },
}
```

```rust
pub trait ExternalArtifactSourceResolverPort {
    async fn resolve_artifact_definition(
        &self,
        definition_ref: ArtifactDefinitionRef,
    ) -> Result<ArtifactReferenceRefreshResolution<ArtifactDefinitionRef>, ApplicationError>;

    async fn resolve_work_context(
        &self,
        work_context_ref: ArtifactWorkContextRef,
    ) -> Result<ArtifactReferenceRefreshResolution<ArtifactWorkContextRef>, ApplicationError>;

    async fn resolve_process_context(
        &self,
        process_context_ref: ArtifactProcessContextRef,
    ) -> Result<ArtifactReferenceRefreshResolution<ArtifactProcessContextRef>, ApplicationError>;

    async fn resolve_governance_context(
        &self,
        governance_context_ref: ArtifactGovernanceContextRef,
    ) -> Result<ArtifactReferenceRefreshResolution<ArtifactGovernanceContextRef>, ApplicationError>;

    async fn resolve_content_source(
        &self,
        source_ref: ArtifactContentSourceRef,
    ) -> Result<ArtifactReferenceRefreshResolution<ArtifactLocalMirrorSnapshot>, ApplicationError>;

    async fn resolve_automation_source(
        &self,
        automation_source_ref: AutomationSourceRef,
    ) -> Result<ArtifactReferenceRefreshResolution<AutomationSourceRef>, ApplicationError>;
}
```

resolver 红线:

- resolver 只返回 body-free ref、summary、digest、snapshot 或 resolution outcome。
- `ApplicationError` 只表示调用失败,不得被 service 用来分流 `mark_unresolved(...)` / `mark_failed(...)`。
- `resolve_content_source(...)` 不得返回正文内容;只能返回 `ArtifactLocalMirrorSnapshot`。

### 11.2 stored relay publisher port

```rust
pub enum ArtifactRelayOutcome {
    Published {
        publication_ref: ArtifactRelayPublicationRef,
    },
    Retryable {
        reason: ArtifactRelayFailureReason,
    },
    Failed {
        reason: ArtifactRelayFailureReason,
    },
}

pub trait ArtifactRelayPublisherPort {
    async fn publish(
        &self,
        pending_item: ArtifactPendingRelayItem,
        payload_snapshot: ArtifactRelayPayloadSnapshot,
    ) -> Result<ArtifactRelayOutcome, ApplicationError>;
}
```

relay 红线:

- publisher 只消费 `ArtifactPendingRelayItem` + `ArtifactRelayPayloadSnapshot`,不得接收 bare `ArtifactCommittedChange` 后回查 current truth 拼 payload。
- `Published` 必须由 `ArtifactCommittedChangeRelayRepository.mark_published(...)` 持久化;`Retryable` 必须由 `mark_retryable(...)` 持久化;`Failed` 必须由 `mark_failed(...)` 持久化。
- relay publication failure 不得回滚原 accepted truth UoW;它只改变 relay item publication state。
- adapter 若返回 `ApplicationError`,application facade 只能按 Step 12 / Step 13 的 publication failure 规则记录本批 failure,不得从错误文本、transport status 或 topic 名称自行推断 retryable / terminal。

### 11.3 handoff delivery ports

```rust
pub struct ArtifactHandoffReceiptRef(pub String);

pub struct ArtifactHandoffFailureReason(pub String);

pub enum ArtifactHandoffDeliveryOutcome {
    Delivered {
        receipt_ref: ArtifactHandoffReceiptRef,
    },
    Retryable {
        reason: ArtifactHandoffFailureReason,
    },
    Failed {
        reason: ArtifactHandoffFailureReason,
    },
}

pub trait ArtifactArchiveHandoffPort {
    async fn deliver(
        &self,
        material: PreparedArtifactArchiveHandoff,
    ) -> Result<ArtifactHandoffDeliveryOutcome, ApplicationError>;
}

pub trait ArtifactObservabilityHandoffPort {
    async fn deliver(
        &self,
        material: PreparedArtifactObservabilityHandoff,
    ) -> Result<ArtifactHandoffDeliveryOutcome, ApplicationError>;
}

pub trait ArtifactSyncHandoffPort {
    async fn deliver(
        &self,
        material: PreparedArtifactSyncHandoff,
    ) -> Result<ArtifactHandoffDeliveryOutcome, ApplicationError>;
}
```

handoff delivery 红线:

- delivery port 只消费 prepared material,不得反向回查 truth body 组装新 payload。
- delivery outcome 必须显式区分 `Delivered` / `Retryable` / `Failed`。
- handoff delivery failure 只影响 handoff / job report surface,不改变 fact / version / baseline truth。

## 12. Infra、API、Worker、Jobs 实现契约

### 12.1 `infra`

| 项 | 必须做到 | 禁止事项 |
|---|---|---|
| repository adapter | 1:1 实现 Step 9 / 10 port 签名,保持 version / cursor / lookup 语义 | 不得新增 service 层未定义的方法面要求 caller 配合 |
| resolver adapter | 返回 `ArtifactReferenceRefreshResolution<T>` | 不得返回外部正文或靠错误字符串表达业务 outcome |
| relay repository / publisher adapter | repository 保存 pending relay item + payload snapshot,publisher 只消费 stored snapshot 并返回 `ArtifactRelayOutcome` | 不得让 publisher 回查 current truth / projection / sibling payload 重建事件 |
| handoff adapter | 返回 `ArtifactHandoffDeliveryOutcome` | 不得把 adapter 私有错误码泄露成协议状态 |
| fake parity | in-memory fake 与 durable adapter 必须共享同一 callable surface、同一 version / cursor / save/get 对称规则 | 不得只让 fake 成功、durable 需要额外 side effect |
| config / runtime builder | 只做注入和运行绑定 | 不得改变业务 guard、truth ownership 或 no-write 红线 |

### 12.2 `api`

- 只负责:
  - request -> `ArtifactCommandCallContext` / `ArtifactQueryCallContext`
  - public DTO -> application input carrier
  - application output -> public response
- `api` 不得:
  - 调用 repository / resolver / UoW
  - 直接构造 `ArtifactIdempotentOperationContext`
  - 读取 domain object 后自行补 business rule

### 12.3 `worker`

- 只负责:
  - inbound envelope -> `ArtifactInboundEventCallContext`
  - trusted source actor mapping
  - application receipt -> worker disposition / ack mapping
  - relay loop item / timer -> `ArtifactRelayPublicationService.publish_pending_artifact_relays(...)`
  - `ArtifactRelayPublicationBatchResult` -> worker publication outcome / ack mapping
- `worker` 不得:
  - 直接保存 resolution state / stale marker / trace record
  - 直接读取 `ArtifactCommittedChangeRelayRepository` 或调用 `ArtifactRelayPublisherPort`
  - 通过 source family 字符串自行选择 resolver
  - 因 payload snapshot missing 回查 current truth 重建 outbound event
  - 用 duplicate receipt 缺失为由重跑 mutation

### 12.4 `jobs`

- 只负责:
  - job input -> `ArtifactJobCallContext`
  - application job result -> run report / exit surface
- `jobs` 不得:
  - 直接访问 truth repository 或 handoff adapter
  - 把 maintenance failure 改写为 truth repair
  - 自行组装 prepared handoff material

## 13. 模块内 trait / port 停审记录

| 模块 | 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|---|
| `contracts` | 是否误定义 repository / resolver / relay port | 通过 | 继续要求 Step 8 只消费 public carrier,不得把 protocol DTO 反升格成 port helper |
| `domain` | 是否误定义持久化 / 外部依赖 port | 通过 | 继续要求 Step 9 / 10 只通过 Step 6 对象能力表达业务语义,不反向引入 repository 调用 |
| `application` | Step 6 truth / support / view / record 能力是否都有对应 service / repository / resolver / replay 接缝承接 | 通过 | Step 8 / Step 9 只能调用本文件已命名 trait / method,不得再造平行 callable surface |
| `infra` | adapter 是否仅实现 port,且 fake parity / cursor / version / save-get 对称是否写清 | 通过 | runtime config / builder exact schema 仍沿用 Step 6 watchpoint,不得在本文件偷补 `RuntimeConfig` / `ConfigError` 对象卡片 |
| `api` | 是否只负责 command / query context 归一化和 public response mapping | 通过 | 继续禁止直接访问 repository / resolver / UoW |
| `worker` | 是否只负责 inbound context 归一化、trusted actor mapping、receipt / ack 映射和 relay publication facade 调用 | 通过 | 继续禁止直接保存 resolution / trace / stale state、读取 relay repository、调用 publisher adapter 或重跑 duplicate mutation |
| `jobs` | 是否只负责 job context 归一化和 run report / exit surface 映射 | 通过 | 继续禁止 truth repair、直接访问 truth repository 或私组 handoff material |

## 14. Step 6 对齐与 defer 继承

本步对 Step 6 的正式结论只做 callable surface 承接,不改写 object owner:

| Step 6 结论 | Step 7 承接方式 | 当前状态 |
|---|---|---|
| `application` helper object 已在 Step 6 闭口 | §6 / §8 仅为 trait signature 和 service callable surface 重述这些 helper | 对齐,未改变 owner |
| `infra` runtime seam 继续 defer exact helper schema | §9 ~ §12 闭口 repository / resolver / relay / handoff adapter 与运行绑定规则,但不补 `RuntimeConfig` / `ConfigError` exact object | 对齐,继续继承 Step 6 watchpoint |
| `api` / `worker` / `jobs` 不新增 canonical object,稳定 carrier 回收到 `application` / `contracts` | §8.6 / §12 只固定 entry normalization、relay publication facade、receipt / report mapping 和 direct-access 禁止事项 | 对齐,未新增平行 helper |

这意味着:

- Step 7 没有改变 Step 6 的业务主语 owner。
- Step 7 只把运行层 callable surface 从“后续再说”推进到了 exact contract。
- 任何需要新增 canonical helper object 的实现 blocker,仍必须先回开 Step 6,而不是在 Step 7 / Step 8 私补。

## 15. 跨模块接缝闭环审计表

| 接缝 | 当前结论 | 是否闭口 |
|---|---|---|
| service input / output exact schema | 已给出四组 public-facing service + 一组 worker-only relay publication facade 的 exact method 和 named carrier | pass |
| truth repository version 来源 | mutable truth 全部通过 `get_*_with_version` / `find_*_with_version` / `list_*` 返回 `Versioned<T>` | pass |
| read model / derived state save-get 对称 | summary / read surface / preview / report / reconciliation / derived state 已给出 `find/get + save` | pass |
| reference refresh outcome | 已通过 `ArtifactReferenceRefreshResolution<T>` 固定 | pass |
| relay queue / stored payload snapshot | 已通过 `ArtifactCommittedChangeRelayRepository` + `ArtifactRelayPublisherPort` 固定 pending scan、payload lookup、expected_version marker 和 stored-snapshot-only publish | pass |
| relay / handoff failure outcome | 已通过 `ArtifactRelayOutcome` / `ArtifactHandoffDeliveryOutcome` 固定 | pass |
| duplicate replay | 已通过 `ArtifactIdempotencyRepository` + `StoredArtifactResultRepository` 固定 | pass |
| UoW cursor 来源 | 已通过 `assign_truth_cursor()` / `assign_reference_cursor()` 固定 | pass |
| fake parity | 已在 §12 明确 durable / fake 等价义务 | pass |

## 16. 回填草稿与 Step 8 入口

正式 `03-详细设计.md` 后续装配时:

- §5 “模块实现契约”引用本文件 §5、§8、§12。
- §7 “Trait / Port / Adapter 契约”摘录本文件 §6 ~ §12。
- `03-详细设计.md` 的 Step 8 / Step 9 / Step 11 必须直接承接本文件中:
  - service 名称
  - input / output carrier 名称
  - repository / resolver / relay repository / relay publisher / handoff trait 名称
  - UoW、idempotency、stored result helper 名称

进入 Step 8 前已满足:

- application / infra / api / worker / jobs 的 callable surface owner 已固定。
- public entry 与 internal repository 的隔离已固定。
- truth persistence、reference / snapshot、projection、derived / handoff、relay queue / stored payload / result 五类 port family 已有 exact Rust-facing contract。
- 没有把 HTTP / topic / event envelope / DTO 细节提前写进 Step 7。

下一步进入:

```text
Step 8 定义 API / Command / Query / Event / Job 协议契约
```
