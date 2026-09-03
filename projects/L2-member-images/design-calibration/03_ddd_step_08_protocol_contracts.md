# L2-member-images 03 详细设计 Step 8：协议契约

> 创建日期：2026-08-27  
> 状态：`completed_stop_review`（Step 8 已完成；必须等待用户明确确认后才可创建 Step 9）  
> 文档模式：`full-restart`  
> 对应 SOP：`standards/document/详细设计讨论流程_SOP.md` Step 8  
> 回填位置：正式 `03-详细设计.md` 第 7 章、第 6 章索引（当前禁止装配）  
> 粒度基线：`projects/L1-governance/design-calibration/03_ddd_step_08_protocol_contracts.md` 的逐协议、逐字段、逐族停审格式；不继承其治理对象、outbox、publisher、route、topic 或正向结果。

## 0. Step 开工确认

| 项目 | 记录 |
|---|---|
| 恢复入口 | 已先读取 `design-calibration/project_execution_ledger.md`、`03_ddd_calibration_flow.md`，再读取 Step 7 的 port / replay / projection 契约、Step 6 对象契约、02 HLD Step 7/8 和 Step 5~9 粒度校准。 |
| 用户授权 | 用户最新“继续”只解除 Step 7→Step 8 门禁；本文件完成后必须停审，未经再次明确确认不得创建 Step 9。 |
| 本步目标 | 将 02 的 10 个 Command、10 个 Query、2 个条件入站边界和 6 个 Operations Job 展开为可落码的逻辑签名、DTO、view/page、错误、幂等、审计和 DTO→对象/port→Step 9 承接。 |
| transport 上限 | 所有物理 HTTP/RPC route、broker topic、event envelope、scheduler 产品和外部协议均未获 authority；以“逻辑 surface + 未绑定”记录，不伪造可用 transport。 |
| Core 边界 | `MI-UP-004` 未闭口；不复用或 shadow Core 的 `ActorContext` / `CommandMetadata`。本步只使用本仓已有 `ActorOrSourceRef`、`IdempotencyKey`、`CorrelationRef`、`CausationRef`，并由 `ImageClockPort` 补 `OperationMetadata.recorded_at`。 |
| 条件入站 | `MI-UP-005` 未闭口；不定义可接受的 envelope、payload、event-id、topic、receipt、dedup 或 accepted write path，只定义不可用/拒绝/重开结果壳。 |
| 出站事件 | `MI-UP-009` 未闭口；本仓 outbound event inventory 为零，不创建 outbox、publisher、delivery state 或 payload。 |
| 本步禁止 | 不读取旧正式 `03-详细设计.md`，不写实现代码/Cargo/测试结果/digest/run_id/report/evidence/readiness，不修改其他项目，不提交 commit。 |

## 1. Step 内计划、协议族门禁与写入批次

| 批次 | 协议族 / 范围 | 计划产物 | 状态 | 局部门禁 |
|---:|---|---|---|---|
| 8.0 | shared protocol helper | operation/context、结果/错误、view/page/freshness、状态映射、canonical 规则 | `completed_pass` | shared 类型先闭口，不能使用未归属的 Core 类型。 |
| 8.1 | Command（10） | 四组 command DTO、结果、字段来源、canonical 输入、错误/幂等/审计 | `completed_pass` | 每个 command 可回指 Step 6 对象和 Step 7 port；已完成族内停审。 |
| 8.2 | Query（10） | 三组 query request、response view/page/marker、读取键和 degraded surface | `completed_pass` | query 只读；view/page 二级类型均有字段级 schema。 |
| 8.3 | 条件入站（2） | unavailable/rejected/reopen boundary surface | `completed_pass_with_blocker` | 不产生 envelope、receipt、dedup 或正向 mutation。 |
| 8.4 | Outbound Event（0） | absence decision 与 reopen 条件 | `completed_pass` | 无 event DTO、outbox、publisher、delivery 或 positive result。 |
| 8.5 | Operations Job（6） | bounded input/output、scope、replay、blocked/unknown surface | `completed_pass` | 不写 scheduler、lease、run、report、evidence、verdict、signoff。 |
| 8.6 | final audit | public secondary type、命名、DTO 构造、port/flow、无 outbound 线路审计 | `completed_stop_review` | 跨协议审计已完成；停止在 Step 8，等待用户确认 Step 9。 |

### 1.1 协议总表

| 名称 | 类别 | 调用方 / 发布方 | 处理方 / 订阅方 | 传输方式 | 是否需要处理流 |
|---|---|---|---|---|---|
| `DefineImageVariant` | Command | `api` logical entry | `application::DefinitionAssemblyCoordinator` | in-process facade；外部 route 未绑定 | 是 |
| `CaptureAssemblyBaseline` | Command | `api` logical entry | `application::DefinitionAssemblyCoordinator` | in-process facade；外部 route 未绑定 | 是 |
| `ProposeVariantRevision` | Command | `api` logical entry | `application::DefinitionAssemblyCoordinator` | in-process facade；外部 route 未绑定 | 是 |
| `RequestBuildIntent` | Command | `api` 或 `jobs` bounded caller | `application::BuildIntentCoordinator` | in-process facade；外部 route 未绑定 | 是 |
| `RecordBuildOutcome` | Command | `api` / controlled integration mapping | `application::BuildIntentCoordinator` | in-process facade；provider callback 未定义 | 是 |
| `EvaluateCandidateEligibility` | Command | `api` logical entry | `application::QualificationCoordinator` | in-process facade；外部 route 未绑定 | 是 |
| `RecordArtifactHandoff` | Command | `api` / bounded reconciliation | `application::QualificationCoordinator` | in-process facade；Artifact route 未绑定 | 是 |
| `PublishInstantiableEntry` | Command | `api` logical entry | `application::AvailabilityCoordinator` | in-process facade；“publish”只表示 local supply transition | 是 |
| `TransitionAvailability` | Command | `api` logical entry | `application::AvailabilityCoordinator` | in-process facade；外部 notification 未定义 | 是 |
| `RollbackOrRetireEntry` | Command | `api` logical entry | `application::AvailabilityCoordinator` | in-process facade；外部 rollback 未定义 | 是 |
| `GetImageVariantDefinition` | Query | `api` logical entry | `application::query_service` | in-process read facade；外部 route 未绑定 | 否（共享只读流） |
| `GetAssemblyDerivation` | Query | `api` logical entry | `application::query_service` | in-process read facade；外部 route 未绑定 | 否（共享只读流） |
| `GetBuildTrace` | Query | `api` logical entry | `application::query_service` | in-process read facade；外部 route 未绑定 | 否（共享只读流） |
| `GetProvenanceAndEligibility` | Query | `api` logical entry | `application::query_service` | in-process read facade；外部 route 未绑定 | 否（共享只读流） |
| `ResolveInstantiableEntry` | Query | `api` / future Member Service consumer | `application::query_service` | in-process read facade；consumer contract 未绑定 | 是（gap 分支） |
| `ListAvailableVariants` | Query | `api` logical entry | `application::query_service` | in-process read facade；外部 route 未绑定 | 否（page surface） |
| `GetAvailabilityHistory` | Query | `api` logical entry | `application::query_service` | in-process read facade；外部 route 未绑定 | 否（page surface） |
| `GetImageTrace` | Query | `api` logical entry | `application::query_service` | in-process read facade；外部 route 未绑定 | 否（page surface） |
| `GetContractGaps` | Query | `api` logical entry | `application::query_service` | in-process read facade；外部 route 未绑定 | 否（page surface） |
| `GetProjectionFreshness` | Query | `api` logical entry | `application::query_service` | in-process read facade；外部 route 未绑定 | 否 |
| `ConsumeVerifiedBuildRequest` | conditional inbound | future verified source | `worker` → `application` | event transport 未绑定；当前 unavailable | 是（仅拒绝/重开流） |
| `ConsumeVerifiedSourceRefresh` | conditional inbound | future formal owner source | `worker` → `application` | event transport 未绑定；当前 unavailable | 是（仅拒绝/重开流） |
| `RunNightlyBuildSweep` | Operations Job | bounded `jobs` caller | `application::BuildIntentCoordinator` | bounded in-process call；scheduler 未绑定 | 是 |
| `ReconcileBuildAttempts` | Operations Job | bounded `jobs` caller | `application::BuildIntentCoordinator` | bounded in-process call；scheduler 未绑定 | 是 |
| `ReevaluatePendingQualifications` | Operations Job | bounded `jobs` caller | `application::QualificationCoordinator` | bounded in-process call；scheduler 未绑定 | 是 |
| `RefreshExternalReferenceSnapshots` | Operations Job | bounded `jobs` caller | `application::ReferenceIntakeCoordinator` | bounded in-process call；scheduler 未绑定 | 是 |
| `RebuildImageDerivedViews` | Operations Job | bounded `jobs` caller | `application::ProjectionRebuilder` | bounded in-process call；scheduler 未绑定 | 是 |
| `ReconcileArtifactAndConsumerHandoffs` | Operations Job | bounded `jobs` caller | `application::QualificationCoordinator` + `AvailabilityCoordinator` | bounded in-process call；scheduler 未绑定 | 是 |

## 2. shared protocol helper

### 2.1 protocol metadata：不 shadow Core

本节的 metadata 是本仓协议边界的中性输入，不是 Core 的 `ActorContext` 或 `CommandMetadata` 替代品。它只携带已经由入口验证到“可安全保留”的 body-free 身份；认证、授权、scope membership、source authority 和 transport envelope 仍由 owner 关闭后再接入。

```rust
/// 本仓协议入口中可安全保留的 actor/source 分类；不表示认证或授权已经通过。
pub enum ImageProtocolActorKind {
    /// 代表一个外部参与者的 body-free 引用。
    Participant,
    /// 代表本地系统或受控维护动作的 body-free 引用。
    System,
    /// 代表未来已验证的 integration source；当前不自动获得写权限。
    IntegrationSource,
    /// 当前无法安全判断 actor 类别；只能进入 unavailable / gap surface。
    Unknown,
}

/// 协议入口保留的最小 actor/source 载体；不承载 profile、credential、session 或权限结论。
pub struct ImageProtocolActor {
    /// 已脱敏的 actor 或 source 身份引用。
    pub actor_ref: ActorOrSourceRef,
    /// 身份的中性分类。
    pub kind: ImageProtocolActorKind,
}

/// 本仓 Command、条件入站和 Job 共用的写操作 metadata 输入。
pub struct ImageWriteMetadata {
    /// 调用方提供的稳定幂等键；不得由 payload 或时间临时生成。
    pub idempotency_key: IdempotencyKey,
    /// 本次操作的关联引用。
    pub correlation_ref: CorrelationRef,
    /// 已知的先行 command/event/job 引用；不保存 raw body 或 run id。
    pub causation_ref: Option<CausationRef>,
}

/// Query 的只读上下文；不携带写幂等记录或写事务意图。
pub struct ImageQueryContext {
    /// 可安全保留的 actor/source；缺失不等于已授权。
    pub actor: Option<ImageProtocolActor>,
    /// 已知的本地读取范围句柄；它只表示可能的 local read reachability，不是权限或 scope membership
    /// 结论，也不能由 variant、entry、route 或其它字段隐式推导。
    pub read_scope_ref: Option<LocalObjectRef>,
    /// 调用方对 freshness 的读取偏好；不触发 rebuild。
    pub freshness_preference: ImageFreshnessPreference,
}

/// Query 对 projection freshness 的只读偏好。
pub enum ImageFreshnessPreference {
    /// 允许读取既有 projection 的可读状态，或读取 direct truth/history（此时 freshness=None）。
    /// 该偏好绝不把 direct read 或 stale marker 升格为 Fresh。
    AllowStale,
    /// 只接受带既有 Fresh marker 的 projection-backed query；没有 projection companion、view 或 Fresh marker
    /// 时 fail-closed 为 Unavailable，绝不静默降级到 direct truth/history。
    RequireFresh,
    /// 要求 projection-backed query 返回既有 marker（包括 Rebuilding / Unavailable）；没有 projection
    /// companion 或 marker 时 fail-closed 为 Unavailable，不创建 marker、不降级为 direct read。
    InspectMarker,
}

/// 逻辑 Command 请求包；不绑定 HTTP/RPC，也不携带 Core envelope。
pub struct ImageCommandRequest<T> {
    /// 可安全保留的 actor；具体 actor 要求由单个 command 声明。
    pub actor: Option<ImageProtocolActor>,
    /// 本仓写操作 metadata。
    pub metadata: ImageWriteMetadata,
    /// command 专用 body。
    pub body: T,
}

/// 逻辑 Query 请求包；不绑定 HTTP/RPC。
pub struct ImageQueryRequest<T> {
    /// 只读上下文。
    pub context: ImageQueryContext,
    /// query 专用 body。
    pub body: T,
}

/// 逻辑 protocol surface 的稳定名称；不保存 route、topic 或 handler 名。
pub struct ImageProtocolSurfaceRef {
    /// 稳定、非空的逻辑 surface 名称；不是 HTTP path、RPC method 或 broker topic。
    pub value: NonEmptyText,
}

/// Names one synchronous Member Images command without binding a route or application handler.
pub enum ImageCommandName {
    /// Defines a local image variant from an existing body-free mapping snapshot.
    DefineImageVariant,
    /// Captures one immutable static assembly baseline.
    CaptureAssemblyBaseline,
    /// Proposes a new immutable variant revision against an existing baseline.
    ProposeVariantRevision,
    /// Requests one local build intent for a buildable revision.
    RequestBuildIntent,
    /// Records one safe, body-free build outcome observation.
    RecordBuildOutcome,
    /// Evaluates image-local provenance and eligibility for a candidate.
    EvaluateCandidateEligibility,
    /// Records the local observation of an Artifact handoff boundary.
    RecordArtifactHandoff,
    /// Publishes one local pinned entry into the local supply history.
    PublishInstantiableEntry,
    /// Appends one local availability transition.
    TransitionAvailability,
    /// Rolls back or retires one local pinned entry through new local history.
    RollbackOrRetireEntry,
}

/// Names one read-only Member Images query without binding a route or application handler.
pub enum ImageQueryName {
    /// Reads one local variant definition summary.
    GetImageVariantDefinition,
    /// Reads one immutable assembly derivation summary.
    GetAssemblyDerivation,
    /// Reads a persisted build intent/attempt/candidate trace.
    GetBuildTrace,
    /// Reads a candidate's local provenance and eligibility chain.
    GetProvenanceAndEligibility,
    /// Resolves a local pinned entry while keeping the consumer seam visible.
    ResolveInstantiableEntry,
    /// Lists local Available pinned entries only.
    ListAvailableVariants,
    /// Lists append-only local availability history for one variant.
    GetAvailabilityHistory,
    /// Lists explain-only trace records for one local subject.
    GetImageTrace,
    /// Lists one explicit scope of contract or consumer handoff gaps.
    GetContractGaps,
    /// Reads the existing freshness marker for one projection key.
    GetProjectionFreshness,
}

/// Names a conditional inbound boundary that currently has no usable event contract.
pub enum ImageInboundConsumerName {
    /// The future verified build-request consumer boundary.
    ConsumeVerifiedBuildRequest,
    /// The future verified source-refresh consumer boundary.
    ConsumeVerifiedSourceRefresh,
}

/// Names one bounded maintenance action without defining a scheduler or job run.
pub enum ImageOperationsJobName {
    /// Selects persisted buildable revisions for local build-intent requests.
    RunNightlyBuildSweep,
    /// Reconciles existing build attempts against safe outcome observations.
    ReconcileBuildAttempts,
    /// Reevaluates existing pending, blocked, or unknown qualification contexts.
    ReevaluatePendingQualifications,
    /// Refreshes one explicitly named body-free external reference snapshot scope.
    RefreshExternalReferenceSnapshots,
    /// Rebuilds one explicitly named read-only projection key from committed truth.
    RebuildImageDerivedViews,
    /// Reconciles existing Artifact-handoff and consumer-handoff local contexts.
    ReconcileArtifactAndConsumerHandoffs,
}
```

| 字段 | 来源与映射 | 约束 |
|---|---|---|
| `ImageProtocolActor.actor_ref` | 入口已验证的 `ActorOrSourceRef`；application 映射为 `OperationMetadata.actor_or_source_ref` | 不证明 participant membership、scope authorization、consumer confirmation 或 governance approval。 |
| `ImageWriteMetadata.idempotency_key` | Command/Job 入口的 `IdempotencyKey` | Query 不承载；同 key 的 canonical input 规则见 §2.6。 |
| `ImageWriteMetadata.correlation_ref` | 入口显式提供 | 不由 domain、repository、event body、timestamp 或 run id 推导。 |
| `ImageWriteMetadata.causation_ref` | 已知先行操作的 body-free ref | 未知时可为 `None`；不得用 raw event/job body 替代。 |
| `ImageQueryContext.read_scope_ref` | 仅允许显式 local ref；它最多证明 local read reachability，不能自行证明授权、scope membership 或 consumer visibility | 需要未闭合 visibility/scope authority 时返回 `Unavailable`/gap；不创建 `NotVisible` 结论。 |
| `freshness_preference` | 调用方只读意图 | 不触发 `ImageProjectionRepositoryPort` 写入、rebuild 或 source refresh。 |
| `ImageCommandName` / `ImageQueryName` / `ImageInboundConsumerName` / `ImageOperationsJobName` | `contracts` protocol vocabulary；application 将每个 enum variant 显式映射为本节列出的 canonical literal，再经 `NonEmptyText::parse` 构造 `ImageOperationName` | public DTO 不直接暴露 Step 6 application-only `ImageOperationName`；未知或不一致 mapping=`ContractViolation`。 |

### 2.1.1 protocol name → application operation name 的穷尽映射

`ImageOperationName` 的唯一 owner 仍是 Step 6 `application`，且它是 `pub struct ImageOperationName(pub NonEmptyText)`，**不是 enum**。下表的 `canonical literal` 是写死在 application mapper 中的 ASCII 逻辑操作名：实现必须先调用 `NonEmptyText::parse(canonical_literal.to_owned())`，成功后再构造 `ImageOperationName(non_empty_text)`；不得根据 Rust `Debug`/`Display`、route、RPC method、topic、handler symbol、动态字符串、scheduler/tick 或用户输入猜测名称。下表是 `contracts` 到 application 的**穷尽 mapper 规范**，不是新增 public `ImageOperationName` 字段，也不表示 route、topic、scheduler 或实现已存在。mapper 必须按 enum variant 穷尽匹配；新增 variant 时必须先补此表和 Step 8 审计，未知 variant 一律 `ContractViolation`。

| protocol enum | variant | application `ImageOperationChannel` | canonical literal → `NonEmptyText` → `ImageOperationName` |
|---|---|---|---|
| `ImageCommandName` | `DefineImageVariant` | `Command` | `"DefineImageVariant"` → parse → name |
|  | `CaptureAssemblyBaseline` | `Command` | `"CaptureAssemblyBaseline"` → parse → name |
|  | `ProposeVariantRevision` | `Command` | `"ProposeVariantRevision"` → parse → name |
|  | `RequestBuildIntent` | `Command` | `"RequestBuildIntent"` → parse → name |
|  | `RecordBuildOutcome` | `Command` | `"RecordBuildOutcome"` → parse → name |
|  | `EvaluateCandidateEligibility` | `Command` | `"EvaluateCandidateEligibility"` → parse → name |
|  | `RecordArtifactHandoff` | `Command` | `"RecordArtifactHandoff"` → parse → name |
|  | `PublishInstantiableEntry` | `Command` | `"PublishInstantiableEntry"` → parse → name |
|  | `TransitionAvailability` | `Command` | `"TransitionAvailability"` → parse → name |
|  | `RollbackOrRetireEntry` | `Command` | `"RollbackOrRetireEntry"` → parse → name |
| `ImageQueryName` | `GetImageVariantDefinition` | `Query` | `"GetImageVariantDefinition"` → parse → name |
|  | `GetAssemblyDerivation` | `Query` | `"GetAssemblyDerivation"` → parse → name |
|  | `GetBuildTrace` | `Query` | `"GetBuildTrace"` → parse → name |
|  | `GetProvenanceAndEligibility` | `Query` | `"GetProvenanceAndEligibility"` → parse → name |
|  | `ResolveInstantiableEntry` | `Query` | `"ResolveInstantiableEntry"` → parse → name |
|  | `ListAvailableVariants` | `Query` | `"ListAvailableVariants"` → parse → name |
|  | `GetAvailabilityHistory` | `Query` | `"GetAvailabilityHistory"` → parse → name |
|  | `GetImageTrace` | `Query` | `"GetImageTrace"` → parse → name |
|  | `GetContractGaps` | `Query` | `"GetContractGaps"` → parse → name |
|  | `GetProjectionFreshness` | `Query` | `"GetProjectionFreshness"` → parse → name |
| `ImageInboundConsumerName` | `ConsumeVerifiedBuildRequest` | `InboundEvent` | `"ConsumeVerifiedBuildRequest"` → parse → name (marker only) |
|  | `ConsumeVerifiedSourceRefresh` | `InboundEvent` | `"ConsumeVerifiedSourceRefresh"` → parse → name (marker only) |
| `ImageOperationsJobName` | `RunNightlyBuildSweep` | `OperationsJob` | `"RunNightlyBuildSweep"` → parse → name |
|  | `ReconcileBuildAttempts` | `OperationsJob` | `"ReconcileBuildAttempts"` → parse → name |
|  | `ReevaluatePendingQualifications` | `OperationsJob` | `"ReevaluatePendingQualifications"` → parse → name |
|  | `RefreshExternalReferenceSnapshots` | `OperationsJob` | `"RefreshExternalReferenceSnapshots"` → parse → name |
|  | `RebuildImageDerivedViews` | `OperationsJob` | `"RebuildImageDerivedViews"` → parse → name |
|  | `ReconcileArtifactAndConsumerHandoffs` | `OperationsJob` | `"ReconcileArtifactAndConsumerHandoffs"` → parse → name |

`ImageInboundConsumerName` 的两行当前只能为 `InboundContractMarker` / boundary disposition 建立 mapper，不得据此调用 `ImageOperationContext::from_write`、canonicalizer、reservation 或任何 truth mutation；该正向路径仍受 `MI-UP-005` 阻断。

### 2.2 application context 构造规则

| 协议族 | application 构造 | `OperationMetadata.recorded_at` | UoW / idempotency |
|---|---|---|---|
| Command | `ImageOperationContext::from_write(ImageOperationChannel::Command, ImageOperationName, metadata)` | `ImageClockPort::now()` | `ReadWrite`；先 canonicalize，再 reserve；Query 不参与。 |
| Query | `ImageOperationContext::from_query(ImageOperationName)` | 不创建写 metadata | `ReadOnly`；不 reserve、不保存 replay。 |
| 条件入站 | 当前不可构造 positive write context；只生成 `InboundContractMarker` | 只有 local marker 可用 `ImageClockPort::now()` | 当前不 reserve、不 dedup、不写 intent。正式 authority 关闭后必须重开。 |
| Operations Job | `ImageOperationContext::from_write(ImageOperationChannel::OperationsJob, ...)` | `ImageClockPort::now()` | `ReadWrite`；duplicate 必须读取 stored job disposition。 |

`ImageWriteMetadata` 到 `OperationMetadata` 的映射是唯一 metadata authority：应用层复制 key/correlation/causation，并补 local recorded time；不得同时保存另一份 Core metadata 或从 command body 推导第二套 metadata。

### 2.3 public protocol state 与 domain state 映射

公开 DTO 不直接暴露 domain-only enum；以下中性 enum 是本步协议层的映射类型。`Accepted`、`Available`、`Passed`、`Eligible`、`Artifact Accepted`、`Consumer Resolved` 等词只表达对应本仓窄阶段，不是全局 readiness。

```rust
/// Definition 生命周期的协议映射。
pub enum ImageDefinitionState {
    /// 对应 `DefinitionLifecycle::Draft`。
    Draft,
    /// 对应 `DefinitionLifecycle::Resolved`。
    Resolved,
    /// 对应 `DefinitionLifecycle::Blocked`。
    Blocked,
    /// 对应 `DefinitionLifecycle::Superseded`。
    Superseded,
}

/// Baseline 完整性的协议映射。
pub enum ImageBaselineState {
    /// 对应 `BaselineCompleteness::Incomplete`。
    Incomplete,
    /// 对应 `BaselineCompleteness::Complete`。
    Complete,
    /// 对应 `BaselineCompleteness::Conflict`。
    Conflict,
    /// 对应 `BaselineCompleteness::Superseded`。
    Superseded,
}

/// Variant revision 生命周期的协议映射。
pub enum ImageRevisionState {
    /// 对应 `VariantRevisionLifecycle::Proposed`。
    Proposed,
    /// 对应 `VariantRevisionLifecycle::Buildable`。
    Buildable,
    /// 对应 `VariantRevisionLifecycle::Invalid`。
    Invalid,
    /// 对应 `VariantRevisionLifecycle::Superseded`。
    Superseded,
}

/// Build intent 生命周期的协议映射。
pub enum ImageIntentState {
    /// 对应 `BuildIntentLifecycle::Accepted`。
    Accepted,
    /// 对应 `BuildIntentLifecycle::Pending`。
    Pending,
    /// 对应 `BuildIntentLifecycle::Blocked`。
    Blocked,
    /// 对应 `BuildIntentLifecycle::Cancelled`。
    Cancelled,
}

/// Build attempt 生命周期的协议映射。
pub enum ImageAttemptState {
    /// 对应 `BuildAttemptLifecycle::Created`。
    Created,
    /// 对应 `BuildAttemptLifecycle::HandoffPending`。
    HandoffPending,
    /// 对应 `BuildAttemptLifecycle::OutcomePending`。
    OutcomePending,
    /// 对应 `BuildAttemptLifecycle::Succeeded`。
    Succeeded,
    /// 对应 `BuildAttemptLifecycle::Failed`。
    Failed,
    /// 对应 `BuildAttemptLifecycle::Unknown`。
    Unknown,
}

/// Candidate formation 生命周期的协议映射。
pub enum ImageCandidateState {
    /// 对应 `CandidateLifecycle::Formed`。
    Formed,
    /// 对应 `CandidateLifecycle::Rejected`。
    Rejected,
    /// 对应 `CandidateLifecycle::Blocked`。
    Blocked,
    /// 对应 `CandidateLifecycle::Unknown`。
    Unknown,
}

/// Provenance 完整性的协议映射。
pub enum ImageProvenanceState {
    /// 对应 `ProvenanceLifecycle::Complete`。
    Complete,
    /// 对应 `ProvenanceLifecycle::Incomplete`。
    Incomplete,
    /// 对应 `ProvenanceLifecycle::Conflict`。
    Conflict,
}

/// Gate evaluation 的协议映射。
pub enum ImageGateState {
    /// 对应 `GateEvaluationLifecycle::Pending`。
    Pending,
    /// 对应 `GateEvaluationLifecycle::Passed`；不表示 Artifact 或 supply ready。
    Passed,
    /// 对应 `GateEvaluationLifecycle::Failed`。
    Failed,
    /// 对应 `GateEvaluationLifecycle::Blocked`。
    Blocked,
    /// 对应 `GateEvaluationLifecycle::Unknown`。
    Unknown,
}

/// Image-domain eligibility 的协议映射。
pub enum ImageEligibilityState {
    /// 对应 `EligibilityLifecycle::Pending`。
    Pending,
    /// 对应 `EligibilityLifecycle::Eligible`；不表示 Artifact/consumer accepted。
    Eligible,
    /// 对应 `EligibilityLifecycle::Ineligible`。
    Ineligible,
    /// 对应 `EligibilityLifecycle::Blocked`。
    Blocked,
}

/// Artifact handoff 的协议映射；`Accepted` 当前是条件保留值。
pub enum ImageArtifactHandoffState {
    /// 对应 `ArtifactHandoffLifecycle::Pending`。
    Pending,
    /// 对应 `ArtifactHandoffLifecycle::Gap`。
    Gap,
    /// 只有 MI-UP-007 与 owner-side schema 正式关闭后才可构造。
    Accepted,
}

/// Local availability transition 的协议映射。
pub enum ImageAvailabilityTransitionState {
    /// 对应 `AvailabilityTransitionLifecycle::Proposed`。
    Proposed,
    /// 对应 `AvailabilityTransitionLifecycle::Committed`；只表示本仓 history。
    Committed,
    /// 对应 `AvailabilityTransitionLifecycle::Rejected`。
    Rejected,
    /// 对应 `AvailabilityTransitionLifecycle::Superseded`。
    Superseded,
}

/// Local pinned entry 生命周期的协议映射。
pub enum ImageEntryState {
    /// 对应 `InstantiableEntryLifecycle::Unavailable`。
    Unavailable,
    /// 对应 `InstantiableEntryLifecycle::Available`；不表示实例已启动。
    Available,
    /// 对应 `InstantiableEntryLifecycle::Superseded`。
    Superseded,
    /// 对应 `InstantiableEntryLifecycle::Retired`。
    Retired,
}

/// Consumer handoff gap 的协议映射；`Resolved` 当前是条件保留值。
pub enum ImageConsumerGapState {
    /// 对应 `ConsumerHandoffGapLifecycle::Open`。
    Open,
    /// 只有 MI-UP-001 与 Member Service formal contract 正式关闭后才可构造。
    Resolved,
    /// 对应 `ConsumerHandoffGapLifecycle::Stale`。
    Stale,
}

/// Cross-owner contract gap lifecycle的协议映射；`Resolved` 当前是条件保留值。
pub enum ImageContractGapState {
    /// 对应 `ContractGapLifecycle::Open`。
    Open,
    /// 对应 `ContractGapLifecycle::Blocked`。
    Blocked,
    /// 只有 formal `ContractResolutionRef` 经 owner contract 验证后才可构造。
    Resolved,
    /// 对应 `ContractGapLifecycle::Expired`。
    Expired,
}

/// Reference snapshot validity 的协议映射。
pub enum ImageReferenceState {
    /// 对应 `ReferenceValidity::Valid`，且只限 declared use。
    Valid,
    /// 对应 `ReferenceValidity::Stale`。
    Stale,
    /// 对应 `ReferenceValidity::Conflict`。
    Conflict,
    /// 对应 `ReferenceValidity::Unavailable`。
    Unavailable,
}

/// Projection freshness 的协议映射。
pub enum ImageProjectionState {
    /// 对应 `ProjectionFreshnessLifecycle::Fresh`。
    Fresh,
    /// 对应 `ProjectionFreshnessLifecycle::Stale`。
    Stale,
    /// 对应 `ProjectionFreshnessLifecycle::Rebuilding`。
    Rebuilding,
    /// 对应 `ProjectionFreshnessLifecycle::Unavailable`。
    Unavailable,
}
```

| 映射规则 | 处理 |
|---|---|
| domain enum variant 与 protocol enum 不一致 | application mapper 返回 `ContractViolation`，不得按相近名称强转。 |
| conditional positive variant | 类型可以预留以保持 future schema 位置，但当前 factory/port/flow/test 不得构造；需列入对应 MI-UP reopen。 |
| 状态缺 reason | 若 domain 状态要求 reason 而 DTO 未携带，application 不能补空文本；返回 `ContractViolation`。 |

### 2.4 command result、错误与 replay surface

```rust
/// Command 结果的有限协议处置类别；不等同 transport status code。
pub enum ImageCommandOutcomeKind {
    /// local truth mutation 已在同一 UoW 内提交。
    Accepted,
    /// domain 或协议校验拒绝，未提交本次 mutation。
    Rejected,
    /// 受影响 lane 被 gap/owner pending 冻结。
    Blocked,
    /// local store 或受控 seam 当前不可安全使用。
    Unavailable,
    /// 外部副作用或结论无法安全判定。
    Unknown,
    /// 读取既有 stored result 后返回，未重新执行 mutation。
    DuplicateReplay,
    /// 同一幂等 key 对应不同 canonical input。
    Conflict,
}

/// 协议错误的安全分类；完整 retry / recovery 规则留 Step 12。
pub enum ImageProtocolErrorKind {
    /// 必填 ref、字段或关联对象缺失。
    Missing,
    /// typed ref、版本或关联结论冲突。
    Conflict,
    /// source、projection、store 或 owner 当前不可用。
    Unavailable,
    /// 结果、来源或副作用未知。
    Unknown,
    /// local contract / owner schema 尚未闭口。
    ContractGap,
    /// 当前状态不允许请求的 transition。
    InvalidTransition,
    /// 幂等 key 与既有 canonical input 不一致。
    IdempotencyConflict,
    /// duplicate 所指 stored result shell/body 缺失或不匹配。
    ReplayUnavailable,
    /// DTO / port / typed-ref 违反本步契约。
    ContractViolation,
}

/// 面向调用方的脱敏协议错误；不携带 raw provider、SQL、HTTP、event 或 job body。
pub struct ImageProtocolError {
    /// 安全错误类别。
    pub kind: ImageProtocolErrorKind,
    /// 已脱敏的原因。
    pub reason: SafeReason,
    /// 可选的受影响本仓对象。
    pub subject_ref: Option<LocalObjectRef>,
    /// 可选的本仓跨边界 gap；不把 contract gap 与 consumer handoff gap 混成同一种 ref。
    pub gap_ref: Option<ImageBoundaryGapRef>,
}

/// 本仓出站事件库存的明确结论；不是空数组形式的潜在 publisher surface。
pub enum ImageOutboundEventInventory {
    /// 当前没有任何已授权的 image-domain outbound event。
    NoneAuthorized,
}

/// Command 或 bounded Job 的统一本地效果摘要；本仓没有 outbound event authority。
pub struct ImageWriteEffectSummary {
    /// 本次结果涉及的 local subjects，按 kind/id 稳定排序。
    pub changed_subject_refs: Vec<LocalObjectRef>,
    /// 本次 accepted mutation 追加的 trace refs。
    pub trace_refs: Vec<ImageTraceRecordRef>,
    /// 本次结果打开或关联的跨边界 gap refs。
    pub gap_refs: ImagePublicGapRefSet,
    /// 固定为 `NoneAuthorized`，用于防止调用方猜造 event、outbox 或 publisher。
    pub outbound_event_inventory: ImageOutboundEventInventory,
}

/// command 统一结果；`body` 只含本仓安全 refs、state 和 reason。
pub struct ImageCommandResult<T> {
    /// 逻辑 command 名称。
    pub command_name: ImageCommandName,
    /// stored local result shell 的 ref；没有进入 replay 的早期拒绝可为空。
    pub result_ref: Option<ImageOperationResultRef>,
    /// 本次结果处置。
    pub outcome: ImageCommandOutcomeKind,
    /// accepted / duplicate replay 时必须有；rejected 可有安全负面 body。
    pub body: Option<T>,
    /// accepted 时的 local effect；duplicate 必须逐字读取已存 effect。
    pub effects: ImageWriteEffectSummary,
    /// 非 accepted 结果的安全错误；不含原始输入。
    pub error: Option<ImageProtocolError>,
    /// 是否来自已存结果重放。
    pub replayed: bool,
}

/// Query surface 的 local-read reachability；当前没有正式 visibility / scope authority，不能把此字段当授权结论。
pub enum ImageQueryVisibility {
    /// 本仓已有的 exact local read path 可以提供所声明的 body/page。它不等于认证、授权、
    /// participant membership、consumer entitlement 或 scope membership 已成功。
    Visible,
    /// 需要的 visibility / scope authority 不可安全确认。
    Unavailable {
        /// 解释 scope/authority 缺口的本仓 gap。
        gap_ref: Option<ImageBoundaryGapRef>,
    },
}

/// Query 结果的可读性和 degraded 类别。
pub enum ImageQuerySurfaceStatus {
    /// 有可返回的 body 或 page item。
    Present,
    /// 在可安全读取的范围内没有条目；不表示全局没有对象。
    Empty,
    /// view 存在但 watermark 落后。
    Stale,
    /// view 正在被 job 重建，query 不等待也不写入。
    Rebuilding,
    /// view、projection 或所需 source 当前不可用。
    Unavailable,
    /// 跨 owner 合同或 local handoff gap 必须显式展示。
    Gap,
}

/// States whether a Query body/page is complete, explicitly partial, or deliberately absent.
pub enum ImageQueryContentState {
    /// Every field required by this query's declared view is present from committed local reads.
    Complete,
    /// The named query explicitly permits a safe partial view together with typed gap refs.
    Partial,
    /// No view body or page item may be returned for this surface.
    None,
}

/// Query response 共用的只读 surface。
pub struct ImageQuerySurface {
    /// 当前 visibility 结论；Unavailable 时 body 必须为空。
    pub visibility: ImageQueryVisibility,
    /// 本次读取的安全状态。
    pub status: ImageQuerySurfaceStatus,
    /// Returned-content completeness; this prevents a Gap from being mistaken for a complete view.
    pub content_state: ImageQueryContentState,
    /// 若已有 read model，则返回稳定的 public wrapper；其内层 ref 仅由既有 projection index 提供。
    pub view_ref: Option<ImagePublicReadModelRef>,
    /// Query 实际使用的 projection lookup key；direct truth/history read 为 None。
    pub projection_key: Option<ImagePublicProjectionKey>,
    /// 实际已有 projection 的 freshness marker；direct truth/history query 可为 None。
    pub freshness: Option<ImageProjectionFreshnessView>,
    /// 影响本次读取的 gap refs。
    pub gap_refs: ImagePublicGapRefSet,
    /// 已使用的 committed local subjects；无 view 时可为空。
    pub source_subject_refs: Vec<LocalObjectRef>,
}

/// 对外 page cursor；不等同 repository cursor、object version 或 truth watermark。
pub struct ImagePublicPageCursor {
    /// Opaque public cursor token；只能由 application page mapper 创建和消费。
    pub value: NonEmptyText,
}

/// Query page 的公共分页信息。
pub struct ImagePublicPageInfo {
    /// 下一页 opaque cursor；None 表示没有下一页。
    pub next_cursor: Option<ImagePublicPageCursor>,
    /// 与 `next_cursor` 保持一致的便捷标记。
    pub has_more: bool,
}

/// 单体 Query response。
pub struct ImageQueryResponse<T> {
    /// 逻辑 query 名称。
    pub query_name: ImageQueryName,
    /// 只读 surface。
    pub surface: ImageQuerySurface,
    /// 可见且有 body 时返回；Unavailable / Gap 不得以空 body伪装 Present。
    pub body: Option<T>,
}

/// 分页 Query response。
pub struct ImageQueryPageResponse<T> {
    /// 逻辑 query 名称。
    pub query_name: ImageQueryName,
    /// 只读 surface。
    pub surface: ImageQuerySurface,
    /// 公共分页信息。
    pub page_info: ImagePublicPageInfo,
    /// 可见条目；Empty、Unavailable、Gap 时必须按 surface 规则为空或保守返回。
    pub items: Vec<T>,
}
```

| surface 规则 | 固定语义 |
|---|---|
| `Visible + Present` | `content_state=Complete`，`body=Some` 或 `items` 非空；字段来自 existing view / committed truth read，不创建 projection。若查询使用 projection，`projection_key=Some(key)` 且 `freshness=Some(marker)`；direct truth/history read 的二者均可为 `None`，且这绝不表示 Fresh。 |
| `Visible + Empty` | `content_state=None`；只对显式可读 scope 的 list query 使用；有 dedicated page/list access summary 时才可返回。无 scope authority 时改 `Unavailable`。 |
| `Visible + Stale` | `content_state=Complete`；可以返回既有 body，但必须暴露 `projection_key=Some(key)` 与 `freshness=Some(state=Stale)`；不改写 source truth。 |
| `Visible + Rebuilding` | `content_state=None`；只在 `InspectMarker` 或允许 degraded 的 query 返回 `projection_key=Some(key)` 与 `freshness=Some(state=Rebuilding)`；不等待 job。 |
| `Visible + Gap` | 只有该 query 明确允许安全 partial view 时才可 `content_state=Partial`；否则 `None`。partial body/page 必须在该协议小节逐字段指定，不得用空 body 隐藏缺链。 |
| `Unavailable` | `content_state=None`、`body=None`、`items=[]`；带 gap refs 或安全 error 语境，不得伪造 NotVisible 或全局 Empty。 |
| page mapping | `ImageRepositoryPage<T>.next_after` 只能经 application mapper 转为 `ImagePublicPageCursor`；internal cursor 不泄漏，`has_more == next_cursor.is_some()`。 |

#### 2.4.1 Query visibility、freshness 与 content-state 全量矩阵

`ImageQueryVisibility::Visible` 只表示已选 local read path 可达；它不证明授权成功。`read_scope_ref` 也不能自行派生任何权限结论。若某入口必须依赖尚未闭合的 visibility/scope authority，或调用方不能给出可验证的 exact local read scope，则该入口必须返回 `ImageQueryVisibility::Unavailable`、`content_state=None`、无 body/items，不得把 local ref、selector、page cursor、first item 或 route 伪装成授权结果。

`RequireFresh` 只接受**已有 projection companion 且其 marker 已存在并为 `Fresh`** 的读取。direct truth/history read 的 `freshness=None` 从不满足 `RequireFresh`；没有 projection companion 的 Query 收到 `RequireFresh` 或 `InspectMarker` 一律 fail-closed 为 `Unavailable`，不能静默降级。`InspectMarker` 只可读取已有 marker，不能 mint、rebuild 或等待它。

| Query | primary read / projection companion | `Complete` | `Partial` | `None` | `RequireFresh` / `InspectMarker` |
|---|---|---|---|---|---|
| `GetImageVariantDefinition` | exact definition truth；`DefinitionSummary` 仅为可选既有 companion | exact variant 与需要的 linked revision 均可读 | 仅 current-revision pointer 断裂时，返回 definition 字段 + typed gap；不得补 revision | missing、scope/visibility unavailable、或 projection preference 不可满足 | 若已有 matching `DefinitionSummary` marker=Fresh，允许 complete projection-backed view；否则两种 preference 均 `Unavailable`。 |
| `GetAssemblyDerivation` | exact revision/baseline truth；`DefinitionSummary` 仅为可选既有 companion | revision、baseline、全部静态 pins/seeds 与 refs 可读 | baseline 不完整/关联断裂时只返回已验证的 revision/baseline fields + gap；不补 slot/seed | revision missing、visibility unavailable、或 preference 不可满足 | 仅 matching existing `DefinitionSummary` + Fresh 支持 `RequireFresh`；`InspectMarker` 仅返回已有 marker surface，否则 unavailable。 |
| `GetBuildTrace` | exact/history truth；`BuildTrace` 可选既有 companion | selected chain 的 mapped local records完整 | 只保留完整的 intent/attempt items，断裂 item 不返回并给 typed gap | selector missing、visibility unavailable、或 preference 不可满足 | 仅 matching existing `BuildTrace` + Fresh 支持 `RequireFresh`；无 companion 时不以 truth history 降级。 |
| `GetProvenanceAndEligibility` | exact candidate/qualification truth；`QualificationSummary` 可选既有 companion | candidate 与 provenance/gate/eligibility chain完整 | candidate 已存在但缺链时，不返回伪完整 view；只能返回已定义安全字段 + typed gap | candidate missing、owner/visibility unavailable、或 preference 不可满足 | 仅 matching existing `QualificationSummary` + Fresh 支持 `RequireFresh`；`InspectMarker` 无 marker 即 unavailable。 |
| `ResolveInstantiableEntry` | exact supply/gap truth；`SupplyCatalog` 可选既有 companion | entry 与其 local chain可读，且 consumer seam状态可安全表达 | local entry 可读但 consumer handoff gap未闭合时，entry + typed consumer gap；绝不表示 consumer resolved | entry missing、visibility unavailable、或 preference 不可满足 | 仅 matching existing `SupplyCatalog` + Fresh 支持 `RequireFresh`；no companion 不降级。 |
| `ListAvailableVariants` | `SupplyCatalog` existing projection page | every returned item relation可读且 matching marker Fresh/Stale per preference | relation-invalid items 排除，并返回 typed gaps；其余 items 可保留 | empty permitted only under an explicit readable local catalog scope；任何 authority/preference failure is none | `RequireFresh` requires existing `SupplyCatalog` Fresh; `InspectMarker` permits only its existing marker surface, not page synthesis. |
| `GetAvailabilityHistory` | exact append-only history truth；无 projection companion | all returned history items完整 | 不允许；history relation conflict不得用残页掩盖 | empty only for explicit readable variant scope；scope/store failure none | `RequireFresh` / `InspectMarker` 均 `Unavailable`，因为没有正式 projection companion。 |
| `GetImageTrace` | exact append-only trace truth；无 projection companion | all returned trace items的 local/external source分型完整 | 不允许；source kind mismatch必须 gap/none，不改写 trace | empty only for explicit readable subject scope；scope/store failure none | `RequireFresh` / `InspectMarker` 均 `Unavailable`，因为没有正式 projection companion。 |
| `GetContractGaps` | selector-bounded gap reads；`ContractGapSummary` 可选既有 companion | every returned gap branch及 lifecycle fields完整 | relation断裂时仅返回其余完整 items + typed gaps | empty only for explicit readable selector scope；authority/preference failure none | `RequireFresh` only with matching existing `ContractGapSummary` Fresh; `InspectMarker` only reads existing marker, else unavailable. |
| `GetProjectionFreshness` | existing view→marker read；其 object 本身是 marker surface | existing marker with a complete marker view; `Fresh` / `Stale` are body-bearing only under the preference rules | 不允许；view/marker relation断裂为 gap/none | key missing, marker rebuilding/unavailable under marker-only rule, or visibility/store failure | `RequireFresh` requires existing `Fresh`; `InspectMarker` may expose an existing `Rebuilding` / `Unavailable` marker with `body=None`; neither creates a marker. |

所有矩阵中的 `Partial` 都必须随 `gap_refs` 返回，且只保留上表已列的安全字段；其他 Query 不得临时引入 `Partial`。所有 `None` 分支都要求 `body=None`、分页 `items=[]`；`Empty` 只可在已明确的 local read scope 内使用，不能代表全局不存在、授权通过或上游合同闭合。

### 2.5 public secondary ref、set 与 view identity

```rust
/// 对外 read-model identity 的单向包装；不创建新的 local object kind。
pub struct ImagePublicReadModelRef {
    /// 已有 local read-model ref 的单向包装；query 不得临时 mint 此值。
    pub local_ref: ImageDerivedReadModelRef,
}

/// Public protocol projection family; it is mapped explicitly to the domain `ProjectionKind`.
pub enum ImageProtocolProjectionKind {
    /// Definition and static assembly summary.
    DefinitionSummary,
    /// Build intent/attempt/outcome trace summary.
    BuildTrace,
    /// Provenance, gate, and eligibility summary.
    QualificationSummary,
    /// Local available-entry catalog.
    SupplyCatalog,
    /// Contract and consumer-gap summary.
    ContractGapSummary,
}

/// Projection lookup key 的协议映射；必须能还原 Step 7 的 `ImageProjectionLookupKey`。
pub struct ImagePublicProjectionKey {
    /// 受控 projection family。
    pub projection_kind: ImageProtocolProjectionKind,
    /// 可选的 variant scope；catalog / gap summary 可为空。
    pub variant_ref: Option<ImageVariantDefinitionRef>,
}

/// 混合 local refs 的稳定公共集合；按 `LocalObjectKind`、canonical local id 排序去重。
pub struct ImagePublicLocalRefSet {
    /// 所有条目必须是已定义本仓 local kind。
    pub entries: Vec<LocalObjectRef>,
}

/// 一个本仓边界缺口的精确公开引用；两个 variant 不可相互替代。
pub enum ImageBoundaryGapRef {
    /// 跨 owner contract/ref/authority gap。
    Contract(ContractGapRef),
    /// Member Service consumer handoff gap。
    Consumer(ConsumerHandoffGapRef),
}

/// 公共 gap ref 集合；按 variant 再按 gap local id 排序去重。
pub struct ImagePublicGapRefSet {
    /// 只包含本仓 typed `Contract` 或 `Consumer` gap ref。
    pub entries: Vec<ImageBoundaryGapRef>,
}

/// A public contract-gap view retains all contract-specific lifecycle and boundary fields.
pub struct ImageContractGapDetailView {
    /// Exact local contract-gap identity.
    pub gap_ref: ContractGapRef,
    /// External truth owner whose exact contract is missing or blocked.
    pub owner: ExternalOwnerKind,
    /// Dependency class retained by the local gap.
    pub seam_kind: DependencySeamKind,
    /// The one local decision lane frozen by this gap.
    pub affected_lane: DecisionLane,
    /// Explicit protocol mapping of the contract-gap lifecycle.
    pub lifecycle: ImageContractGapState,
    /// Formal resolution ref only when the lifecycle is conditionally Resolved.
    pub resolution_ref: Option<ContractResolutionRef>,
    /// Safe explanation for Open, Blocked, or Expired states.
    pub reason: Option<SafeReason>,
}

/// A public consumer-handoff gap view retains only consumer-boundary fields.
pub struct ImageConsumerHandoffGapDetailView {
    /// Exact local consumer-handoff-gap identity.
    pub gap_ref: ConsumerHandoffGapRef,
    /// Related local entry when a local entry was already known.
    pub entry_ref: Option<InstantiableEntryRef>,
    /// Consumer contract context if the owner supplied one; None is not a guessed contract.
    pub consumer_contract_ref: Option<ConsumerContractRef>,
    /// Narrow consumer handoff condition that remains unclosed.
    pub gap_kind: ConsumerHandoffGapKind,
    /// Explicit protocol mapping of the consumer-gap lifecycle.
    pub lifecycle: ImageConsumerGapState,
    /// Formal resolution ref only when the lifecycle is conditionally Resolved.
    pub resolution_ref: Option<ContractResolutionRef>,
    /// Consumer confirmation ref only when the lifecycle is conditionally Resolved.
    pub confirmation_ref: Option<ConsumerConfirmationRef>,
    /// Safe explanation for Open or Stale states.
    pub reason: Option<SafeReason>,
}

/// A public gap item keeps contract and consumer lifecycles in separate typed branches.
pub enum ImageBoundaryGapViewItem {
    /// A cross-owner contract/ref/authority gap.
    Contract(ImageContractGapDetailView),
    /// A Member Service consumer handoff gap.
    Consumer(ImageConsumerHandoffGapDetailView),
}

/// 公共 freshness marker 的字段视图。
pub struct ImageProjectionFreshnessView {
    /// Projection family。
    pub projection_kind: ImageProtocolProjectionKind,
    /// Stable local freshness marker。
    pub freshness_ref: ProjectionFreshnessRef,
    /// 映射后的 freshness state。
    pub state: ImageProjectionState,
    /// 用于重建的 committed subject refs。
    pub source_subject_refs: Vec<LocalObjectRef>,
    /// 阻断或滞后的安全原因。
    pub reason: Option<SafeReason>,
}
```

| identity / set | 生成与读取来源 | 禁止替代 |
|---|---|---|
| `ImagePublicProjectionKey` | query selector 显式构造，再映射为 `ImageProjectionLookupKey` | variant 字符串、route、method 名、Artifact/consumer ref、page cursor。 |
| `ImagePublicReadModelRef` | `ImageProjectionRepositoryPort::find_read_model_ref_by_key` 返回的既有 ref | query 临时 mint、从 variant id 拼接、从 cache key 反推。 |
| `ImagePublicPageCursor` | repository page mapper | local version、timestamp、watermark、idempotency key 或 opaque external ref。 |
| `ImageBoundaryGapRef` / `ImagePublicGapRefSet` | local gap/consumer-gap read，按 variant 和 local id 稳定排序去重 | 以裸 `ContractGapRef` 冒充 consumer handoff，或以空结果隐藏 gap。 |
| `ImageProjectionFreshnessView` | exact freshness read | `Fresh` 默认值、view 不存在时的隐式 marker、业务 readiness。 |

`ImageProtocolProjectionKind` 与 Step 6 domain-only `ProjectionKind` 采用一对一显式 mapper：`DefinitionSummary`、`BuildTrace`、`QualificationSummary`、`SupplyCatalog`、`ContractGapSummary` 名称相同但不得直接把 domain enum 放进 public DTO。任一新 domain variant 必须先补 protocol mapper 与本 Step 审计，不能由 query 默认序列化。

### 2.6 canonical input 与 replay 规则

`ImageOperationInputCanonicalizerPort` 的输出仍是 opaque `StableOperationInputRef`，本节只闭合每个 operation 的字段顺序和语义，**不声明已计算 digest**。canonicalizer 不读取 payload bytes、event body、job report、raw error、secret、live state、image digest、Artifact digest、tag 或 route。

固定规则：

1. canonical identity 的前缀顺序为 `channel -> operation_name -> protocol-specific fields`；`IdempotencyKey` 本身不进入 stable input body。
2. typed local ref 按 `(object_kind, object_id)` 编码；typed external ref 按 `(owner, reference_kind, opaque_identity, revision-or-absent)` 编码；不得反向解析 generic ref。
3. ordered set 先按其字段声明排序并去重；重复项如果来自同一输入集合则 canonicalize 后只保留一项，若同一 key 的两次输入集合不同则进入 `IdempotencyConflict`，不能静默合并旧结果。
4. `Option<T>::None` 使用显式 absence 语义；不能把 `None`、空字符串、缺字段和默认值混为一类。当前协议若把 `None` 解释为“不适用”，必须在该协议表中明确；否则缺失即 `Missing`。
5. `SafeReason` 只纳入 category 与 typed related ref；reason 说明文本不作为 identity。时间、actor ref、correlation、causation、transport 名和 adapter availability 不作为业务 body identity，除非某协议表显式将其声明为来源字段。
6. 同一 `(channel, operation_name, idempotency_key, StableOperationInputRef)` 只能 replay 既有 result；同 key 但 channel、operation 或任一 canonical 字段不同，必须返回 `Conflict`，不覆盖旧 reservation、不重跑 mutation、不重做 external handoff/job scan。
7. duplicate replay 需要 `get_stored_result` 与 `get_replay_body`；任一缺失或 kind/name 不匹配都返回 `ReplayUnavailable` / `ContractViolation`，不能由当前 truth 重新计算旧 response。

| 结果 | application 行为 | protocol surface |
|---|---|---|
| 首次且安全接受 | 同一 `ImageUnitOfWork` 内保存 local truth、trace、gap、replay body，再 complete reservation、commit | `Accepted`，`replayed=false`。 |
| 首次拒绝/阻断且本协议允许保存 negative disposition | 保存 body-free rejection/disposition shell，再 complete reservation、commit | `Rejected` / `Blocked`，可带 safe body。 |
| 同 key 同 canonical input | 只读 stored result/body | `DuplicateReplay`，`replayed=true`，effects 与 body 必须来自存储。 |
| 同 key 不同 canonical input | 不执行 domain 或外部副作用 | `Conflict` + `IdempotencyConflict`。 |
| canonicalizer 尚未闭合 | 不 reserve，不声称 stable ref | `Unavailable`/`ContractGap`；当前条件入站始终走此分支。 |

### 2.7 application error 到 protocol error 映射

| `ImageApplicationError` | `ImageProtocolErrorKind` | 处理上限 |
|---|---|---|
| `Domain(DomainError::Validation)` | `ContractViolation` 或 `Missing` | 保留 safe reason；不重写为成功。 |
| `Domain(DomainError::WrongReferenceKind)` | `ContractViolation` | exact-kind 失败即停止，不尝试其它 ref。 |
| `Domain(DomainError::InvalidTransition)` | `InvalidTransition` | 不改变对象状态；恢复规则留 Step 12。 |
| `Domain(DomainError::Blocked)` | `ContractGap` 或 `Unavailable` | 只冻结 affected lane。 |
| `Domain(DomainError::Conflict)` / `VersionConflict` | `Conflict` | 不 last-write-wins、不自动覆盖。 |
| `NotFound` | `Missing` | command 不猜补；query 依 selector 语义返回 Empty 或 Unavailable。 |
| `Unavailable` | `Unavailable` | body-free safe reason；不得暴露 provider/SQL/transport。 |
| `ContractViolation` | `ContractViolation` | fail closed，回写设计缺口而非在 entry 修补。 |
| `IdempotencyConflict` | `IdempotencyConflict` | 不返回旧 result，不重跑。 |
| `StoredResultMissing` | `ReplayUnavailable` | 停止 replay，进入恢复设计；不重算旧结果。 |
| `TransactionBoundary` | `Unavailable` | rollback 语义留 Step 11/12；不得声称 local commit。 |

### 2.8 shared protocol helper 停审

| 审查项 | 结论 | 缺口 / 后续 |
|---|---|---|
| metadata 是否只有一个本仓 authority | `pass_with_pending_core` | 使用本仓 neutral carrier；`MI-UP-004` 关闭后需重新核对 Core 映射，不能 shadow。 |
| Command / Job 是否有 key、canonical input、stored result 路径 | `pass` | 每个 operation 的字段顺序在后续协议族表中逐项闭合；canonicalizer 当前不能伪造 digest。 |
| Query 是否无写 UoW / idempotency | `pass` | Query 仅 existing projection/truth read；不 reserve、不创建 view。 |
| public view/page/freshness/gap identity 是否有 owner | `pass` | `ImageProjectionLookupKey`、`ImagePublicPageCursor`、optional freshness view、contract/consumer gap union 已与 Step 6/7 映射。 |
| visibility 是否避免伪造授权 | `pass_with_gap` | 无正式 visibility authority 时只返回 `Unavailable`/gap，不创建 `NotVisible` 结论。 |
| outbound effect 是否明确不存在 | `pass` | `ImageWriteEffectSummary.outbound_event_inventory=NoneAuthorized`；MI-UP-009 保持 absent，未形成 ref、event、outbox 或 publisher surface。 |

## 3. Command 协议族（8.1）

Command 是本仓唯一可以请求 local truth mutation 的同步协议。每个 handler 都必须由 `application` facade 承接，`api` 只负责把已验证入口字段映射成 `ImageCommandRequest<T>`；`domain` 不知道 DTO，`infra` 不决定 command 语义。

### 3.1 Command 共享二级类型与映射

```rust
/// Command 请求中选择既有 family 或声明新 family 的方式。
pub enum ImageFamilySelector {
    /// 读取一个已存在的本仓 family。
    Existing(ImageFamilyDefinitionRef),
    /// 以安全名称创建一个新的本仓 family。
    New(NonEmptyText),
}

/// 一个 command 可携带的 component release pin 输入；不包含 component 正文。
pub struct ImageComponentPinInput {
    /// 组件在镜像静态装配中的槽位。
    pub slot: ImageProtocolComponentSlot,
    /// owner 提供的不可变 component release ref。
    pub release_ref: ComponentReleaseRef,
    /// 可选的 body-free compatibility conclusion ref。
    pub compatibility_ref: Option<CompatibilityConclusionRef>,
}

/// 协议层 component slot，映射到 domain `ComponentSlotKind`。
pub enum ImageProtocolComponentSlot {
    /// Runtime 组件槽位。
    Runtime,
    /// Tools 组件槽位。
    Tools,
    /// Member 组件槽位。
    Member,
    /// Supervisor 组件槽位。
    Supervisor,
    /// 角色 extras 组件槽位。
    RoleExtra,
}

/// 一个静态 seed template 的协议输入；不携带 template body、mount 或 live state。
pub struct ImageSeedBindingInput {
    /// owner 提供的静态模板 ref。
    pub template_ref: SeedTemplateRef,
    /// 模板的用途类别。
    pub seed_kind: StaticSeedKind,
    /// 模板在镜像静态层的 placement 类别。
    pub placement_kind: StaticPlacementKind,
}

/// Capture baseline 所需的静态、ref-only 输入集合。
pub struct ImageAssemblyInputSet {
    /// 本地 mapping snapshot；必须与 variant 关联。
    pub mapping_snapshot_ref: MappingSourceSnapshotRef,
    /// 必须显式给出的 component pins；空集合表示缺少输入，不是默认无组件。
    pub component_pins: Vec<ImageComponentPinInput>,
    /// 必须显式给出的静态 seed bindings；每项的用途和 placement 不可从名称猜测。
    pub seed_bindings: Vec<ImageSeedBindingInput>,
    /// 不可变 base image ref。
    pub base_image_ref: BaseImageRef,
}

/// 触发一次本地 build intent 的协议输入。
pub struct ImageBuildTriggerInput {
    /// 触发来源的窄类别。
    pub kind: BuildTriggerKind,
    /// body-free 的触发引用；不得为 scheduler run 或 event body。
    pub trigger_ref: OpaqueReference,
}

/// 记录一次安全 build outcome 的协议输入。
pub struct ImageBuildOutcomeInput {
    /// builder/registry 提供的 external execution ref。
    pub execution_ref: ExternalBuildExecutionRef,
    /// 保守的结果类别。
    pub result_kind: BuildResultKind,
    /// 只有同一 safe observation 验证成功时才可提供 immutable image ref。
    pub immutable_image_ref: Option<ImmutableImageRef>,
    /// 只有同一 safe observation 验证成功时才可提供 output identity binding。
    pub output_identity_ref: Option<VerifiedContentIdentityRef>,
    /// failed/unknown/unavailable 的安全原因。
    pub reason: Option<SafeReason>,
}

/// Provenance 来源的协议层角色。
pub enum ImageProvenanceSourceRole {
    /// complete build input snapshot。
    InputSnapshot,
    /// external build execution identity。
    Execution,
    /// verified immutable output identity。
    OutputIdentity,
    /// 可选 mapping source 解释。
    MappingSource,
    /// 可选 assembly source 解释。
    AssemblySource,
}

/// 一个 body-free provenance 来源输入。
pub struct ImageProvenanceSourceInput {
    /// 来源在 provenance 链中的结构角色。
    pub role: ImageProvenanceSourceRole,
    /// local 或 external typed ref；接收方必须校验 role 与 kind。
    pub source_ref: TraceSourceRef,
}

/// 单个 applicable gate 的安全结论输入；不枚举 gate inventory。
pub struct ImageGateConclusionInput {
    /// owner 提供的 evidence/gate conclusion ref。
    pub conclusion_ref: EvidenceConclusionRef,
    /// 本仓保守结论。
    pub disposition: SafeDisposition,
    /// 非正向结论的安全解释。
    pub reason: Option<SafeReason>,
}

/// Availability transition command 的动作与目标输入。
pub struct ImageAvailabilityTransitionInput {
    /// 本仓 local transition 动作。
    pub transition_kind: AvailabilityTransitionKind,
    /// publish/replace 时的 candidate；retire 可为 None。
    pub candidate_ref: Option<CandidateImageRef>,
    /// 当前变化前 entry；首次 publish 可为 None。
    pub prior_entry_ref: Option<InstantiableEntryRef>,
    /// rollback 时必须显式给出仍可验证的目标 entry；其它动作通常为 None。
    pub resulting_entry_ref: Option<InstantiableEntryRef>,
    /// command 对动作的安全说明。
    pub reason: Option<SafeReason>,
}

/// Definition command 的安全返回 body。
pub struct ImageDefinitionCommandBody {
    /// local family ref。
    pub family_ref: ImageFamilyDefinitionRef,
    /// local variant ref。
    pub variant_ref: ImageVariantDefinitionRef,
    /// 映射后的 definition state。
    pub state: ImageDefinitionState,
}

/// Baseline command 的安全返回 body。
pub struct ImageBaselineCommandBody {
    /// local baseline ref。
    pub baseline_ref: AssemblyBaselineRef,
    /// 映射后的 completeness state。
    pub state: ImageBaselineState,
}

/// Revision command 的安全返回 body。
pub struct ImageRevisionCommandBody {
    /// local revision ref。
    pub revision_ref: VariantRevisionRef,
    /// 映射后的 revision state。
    pub state: ImageRevisionState,
}

/// Build intent command 的安全返回 body。
pub struct ImageBuildIntentCommandBody {
    /// local build intent ref。
    pub intent_ref: BuildIntentRef,
    /// 映射后的 intent state。
    pub state: ImageIntentState,
}

/// Build outcome command 的安全返回 body。
pub struct ImageBuildOutcomeCommandBody {
    /// attempt ref。
    pub attempt_ref: BuildAttemptRef,
    /// 可选已保存 outcome ref。
    pub outcome_ref: Option<BuildOutcomeConclusionRef>,
    /// 映射后的 attempt state。
    pub attempt_state: ImageAttemptState,
    /// 通过 candidate guard 后才出现的 candidate ref。
    pub candidate_ref: Option<CandidateImageRef>,
}

/// Qualification command 的安全返回 body。
pub struct ImageQualificationCommandBody {
    /// provenance binding ref。
    pub provenance_ref: ProvenanceBindingRef,
    /// gate evaluation ref。
    pub gate_evaluation_ref: GateEvaluationRef,
    /// eligibility decision ref。
    pub eligibility_ref: EligibilityDecisionRef,
    /// 映射后的 eligibility state。
    pub eligibility_state: ImageEligibilityState,
    /// 映射后的 gate state。
    pub gate_state: ImageGateState,
}

/// Artifact handoff command 的安全返回 body。
pub struct ImageArtifactHandoffCommandBody {
    /// local handoff record ref。
    pub handoff_ref: ArtifactHandoffRecordRef,
    /// 映射后的 handoff state。
    pub state: ImageArtifactHandoffState,
    /// 当前 gap（若有）。
    pub gap_ref: Option<ImageBoundaryGapRef>,
}

/// Supply command 的安全返回 body。
pub struct ImageSupplyCommandBody {
    /// local entry ref（若已创建）。
    pub entry_ref: Option<InstantiableEntryRef>,
    /// local availability transition ref（若已追加）。
    pub transition_ref: Option<AvailabilityTransitionRef>,
    /// 映射后的 entry state。
    pub entry_state: Option<ImageEntryState>,
}

/// Transition command 的安全返回 body。
pub struct ImageAvailabilityCommandBody {
    /// 追加的 local transition ref。
    pub transition_ref: AvailabilityTransitionRef,
    /// 映射后的 transition state。
    pub state: ImageAvailabilityTransitionState,
}

/// Rollback/retire command 的安全返回 body。
pub struct ImageRollbackCommandBody {
    /// 被操作的既有 entry ref。
    pub entry_ref: InstantiableEntryRef,
    /// 新追加的 transition ref。
    pub transition_ref: AvailabilityTransitionRef,
    /// 操作后的 local entry state。
    pub entry_state: ImageEntryState,
}
```

| 二级类型 | 归属 / 来源 | 构造与校验边界 |
|---|---|---|
| `ImageFamilySelector` | `contracts` protocol carrier；`Existing` 来自 request，`New` 由 application ID + domain factory 承接 | Existing 必须 exact local kind；New 的 name 非空且不能含外部正文。 |
| `ImageComponentPinInput` / `ImageSeedBindingInput` | `contracts` protocol carrier | 只映射到 Step 6 domain pin/binding；不携带 release/template body、path、secret 或 live state。 |
| `ImageBuildOutcomeInput` | `contracts` protocol carrier；safe adapter 观察映射 | `Succeeded` 必须同时有两个 output ref；其它结果两者必须为 None 且 reason 为 Some。 |
| `ImageProvenanceSourceInput` / `ImageGateConclusionInput` | `contracts` protocol carrier | role、owner、kind、disposition 均由 application/domain guard 校验，不能按数组位置猜。 |
| command body structs | `contracts` response carrier | body 只返回本仓 typed refs、窄状态和安全 gap；不返回 raw manifest、log、report、digest 或 provider body。 |

### 3.2 Command handler 逻辑签名与 shared 规则

```rust
/// 处理 DefinitionAssembly 的 DefineImageVariant command。
pub async fn handle_define_image_variant(
    &self,
    request: ImageCommandRequest<DefineImageVariantRequest>,
) -> Result<ImageCommandResult<ImageDefinitionCommandBody>, ImageProtocolError>;

/// 处理静态 assembly baseline capture command。
pub async fn handle_capture_assembly_baseline(
    &self,
    request: ImageCommandRequest<CaptureAssemblyBaselineRequest>,
) -> Result<ImageCommandResult<ImageBaselineCommandBody>, ImageProtocolError>;

/// 处理 variant revision proposal command。
pub async fn handle_propose_variant_revision(
    &self,
    request: ImageCommandRequest<ProposeVariantRevisionRequest>,
) -> Result<ImageCommandResult<ImageRevisionCommandBody>, ImageProtocolError>;

/// 处理 build intent request command。
pub async fn handle_request_build_intent(
    &self,
    request: ImageCommandRequest<RequestBuildIntentRequest>,
) -> Result<ImageCommandResult<ImageBuildIntentCommandBody>, ImageProtocolError>;

/// 处理安全 build outcome recording command。
pub async fn handle_record_build_outcome(
    &self,
    request: ImageCommandRequest<RecordBuildOutcomeRequest>,
) -> Result<ImageCommandResult<ImageBuildOutcomeCommandBody>, ImageProtocolError>;

/// 处理 candidate qualification command。
pub async fn handle_evaluate_candidate_eligibility(
    &self,
    request: ImageCommandRequest<EvaluateCandidateEligibilityRequest>,
) -> Result<ImageCommandResult<ImageQualificationCommandBody>, ImageProtocolError>;

/// 处理 Artifact handoff boundary recording command。
pub async fn handle_record_artifact_handoff(
    &self,
    request: ImageCommandRequest<RecordArtifactHandoffRequest>,
) -> Result<ImageCommandResult<ImageArtifactHandoffCommandBody>, ImageProtocolError>;

/// 处理 local instantiable entry publication command。
pub async fn handle_publish_instantiable_entry(
    &self,
    request: ImageCommandRequest<PublishInstantiableEntryRequest>,
) -> Result<ImageCommandResult<ImageSupplyCommandBody>, ImageProtocolError>;

/// 处理 local availability transition command。
pub async fn handle_transition_availability(
    &self,
    request: ImageCommandRequest<TransitionAvailabilityRequest>,
) -> Result<ImageCommandResult<ImageAvailabilityCommandBody>, ImageProtocolError>;

/// 处理 local rollback 或 retire entry command。
pub async fn handle_rollback_or_retire_entry(
    &self,
    request: ImageCommandRequest<RollbackOrRetireEntryRequest>,
) -> Result<ImageCommandResult<ImageRollbackCommandBody>, ImageProtocolError>;
```

| shared 规则 | 固定口径 |
|---|---|
| handler owner | 只由 application facade 实现；api 不读 repository，jobs 也不能绕 facade。 |
| metadata | `ImageWriteMetadata` 映射为 `OperationMetadata`，`recorded_at` 由 `ImageClockPort::now()` 补齐；不得 shadow Core。 |
| actor | API command 必须有 `ImageProtocolActor`；bounded job 使用 `System` actor；integration source 只有在 owner contract 已验证后才可用。actor ref 不等授权。 |
| canonical input | 按 §2.6 的 `channel -> operation_name -> protocol fields` 排序；key 不进入 stable input body；canonicalizer 未能构造时不 reserve。 |
| duplicate | 同 key 同 canonical input 只读 stored result/body；不同 input 返回 `Conflict`；不得重跑 domain mutation、external handoff 或 job scan。 |
| effects | accepted 只列 local changed subjects、trace、gap；`outbound_event_inventory` 固定 `NoneAuthorized`。 |
| transport | route/RPC 未绑定；逻辑函数名是当前唯一可实现 surface，不能把函数名当 HTTP path。 |

### 3.3 `DefineImageVariant`

| 项 | 内容 |
|---|---|
| 函数签名 | `handle_define_image_variant(ImageCommandRequest<DefineImageVariantRequest>) -> Result<ImageCommandResult<ImageDefinitionCommandBody>, ImageProtocolError>` |
| HTTP / RPC 名称 | 未定义（仅保留 logical operation `DefineImageVariant`） |
| 调用方 | `api` logical command entry；未来受控内部 caller 也必须走同一 facade |
| 处理方 | `DefinitionAssemblyCoordinator` |
| 目标对象 / port | `ImageFamilyDefinition`、`ImageVariantDefinition`；`DefinitionAssemblyRepositoryPort`、`ImageIdGeneratorPort`、`ImageClockPort`、`ImageIdempotencyRepositoryPort`；mapping snapshot 只按 typed local ref 读取 |

```rust
/// DefineImageVariant 的请求 body。
pub struct DefineImageVariantRequest {
    /// 既有 family ref 或新 family safe name。
    pub family: ImageFamilySelector,
    /// 本仓安全 persona/variant label。
    pub persona_label: NonEmptyText,
    /// 已捕获的 body-free mapping snapshot。
    pub mapping_snapshot_ref: MappingSourceSnapshotRef,
}
```

| 输入字段 | 类型 | 目标对象字段 | 字段来源 | 缺失 / 冲突处理 |
|---|---|---|---|---|
| `family` | `ImageFamilySelector` | `ImageVariantDefinition.family_ref`；必要时 `ImageFamilyDefinition` | request；Existing 经 `get_family_with_version`，New 经 ID + `ImageFamilyDefinition::create` | Existing missing=`Missing`；New name为空=`ContractViolation`；同名多 family=`Conflict`。 |
| `persona_label` | `NonEmptyText` | `ImageVariantDefinition.persona_label` | request | 空白/含外部正文=`ContractViolation`；不得由 mapping body派生。 |
| `mapping_snapshot_ref` | `MappingSourceSnapshotRef` | `ImageVariantDefinition.mapping_snapshot_ref` | request；`get_mapping_snapshot_with_version` | missing/stale/conflict=`Blocked` 或 `Missing`；不调用 Method Library body。 |
| `metadata` | `ImageWriteMetadata` | `ImageVariantDefinition` 的 operation context / trace | envelope | 缺 key/correlation=`ContractViolation`；不由 label 生成。 |

处理与映射约束：

1. application 先校验 mapping snapshot exact kind、variant scope 和 `ReferenceValidity`;不得把 snapshot validity 当作外部 mapping truth。
2. `ImageVariantDefinition::define(...)` 只能接收 application 生成的 local ID、loaded family ref 和 snapshot ref；随后按 guard 结论决定 `Draft` / `Resolved` / `Blocked`，不直接进入 buildable。
3. Existing family 的更新使用 `Versioned<ImageFamilyDefinition>` 的 `Exact` 版本；New family 使用 `Absent`。family attach 与 variant save 必须在同一 `ImageUnitOfWork`。

| 失败类别 | protocol surface | 审计 / 幂等 |
|---|---|---|
| mapping snapshot missing/stale | `Blocked` + `ContractGap`（affected lane=Definition/Assembly） | 可保存 negative disposition；不创建 `Resolved` variant。 |
| family version conflict | `Conflict` / `VersionConflict` | rollback；不得 last-write-wins。 |
| duplicate | `DuplicateReplay`，逐字返回存储的 body/effects | 不再次 attach variant 或写 trace。 |
| 首次 accepted | `Accepted` + family/variant refs + states | 同一 UoW 保存 local truth、trace、replay；outbound 为空。 |

#### `DefineImageVariant` 停审记录

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| DTO 能否构造目标对象 | `pass_with_pending_mapping` | 需要已有 local `MappingSourceSnapshot`; owner mapping body/authority (`MI-UP-003`) 未闭口，positive resolution 仍 blocked。 |
| 二级类型是否有 schema | `pass` | `ImageFamilySelector`、request、body、state/effect 类型均已定义。 |
| canonical / duplicate 是否闭合 | `pass` | selector variant、label、snapshot ref按固定顺序；duplicate读取 stored result。 |
| actor / metadata / error 是否闭合 | `pass_with_pending_core` | 使用 neutral actor/source；Core metadata 映射待 `MI-UP-004`。 |
| Step 9 承接 | `pass` | 后续独立 flow 必须展开 family load、snapshot load、guard、版本保存和 rollback。 |

### 3.4 `CaptureAssemblyBaseline`

| 项 | 内容 |
|---|---|
| 函数签名 | `handle_capture_assembly_baseline(ImageCommandRequest<CaptureAssemblyBaselineRequest>) -> Result<ImageCommandResult<ImageBaselineCommandBody>, ImageProtocolError>` |
| HTTP / RPC 名称 | 未定义（logical operation `CaptureAssemblyBaseline`） |
| 调用方 | `api` logical command entry |
| 处理方 | `DefinitionAssemblyCoordinator` |
| 目标对象 / port | `AssemblyBaseline`、`ComponentPinSet`、`SeedPlacementBinding`；`DefinitionAssemblyRepositoryPort`、`ImageAssemblyReferenceResolverPort`、`ImageIdGeneratorPort`、`ImageClockPort` |

```rust
/// CaptureAssemblyBaseline 的请求 body。
pub struct CaptureAssemblyBaselineRequest {
    /// 静态 assembly 所属 variant。
    pub variant_ref: ImageVariantDefinitionRef,
    /// ref-only 静态输入集合。
    pub inputs: ImageAssemblyInputSet,
}
```

| 输入字段 | 类型 | 目标对象字段 | 字段来源 / 映射 | 缺失 / 冲突处理 |
|---|---|---|---|---|
| `variant_ref` | `ImageVariantDefinitionRef` | `AssemblyBaseline.variant_ref` | request；`get_variant_with_version` | missing/wrong kind=`Missing`/`ContractViolation`；Blocked variant 不得继续。 |
| `inputs.mapping_snapshot_ref` | `MappingSourceSnapshotRef` | baseline mapping ref | request；exact snapshot read | snapshot 与 variant 不关联=`Conflict`；stale/unavailable=`Blocked`。 |
| `inputs.component_pins` | `Vec<ImageComponentPinInput>` | `ComponentPinSet.pins` | 每项经 resolver 得 safe conclusion，再由 domain factory 组装 | 空集合、重复 slot、wrong owner/kind、mutable selector=`Missing`/`Conflict`/`ContractViolation`；不得默认补齐。 |
| `inputs.seed_bindings` | `Vec<ImageSeedBindingInput>` | `SeedPlacementBinding` 集合 | 每项经 seed resolver；映射到 domain static kind/placement | 空集合是否允许由 required rule 决定；live/mount/path/body=`ContractViolation`；未闭口=`Blocked`。 |
| `inputs.base_image_ref` | `BaseImageRef` | `AssemblyBaseline.base_image_ref` | request + base resolver safe conclusion | 缺少 immutable verification=`Blocked`；不得从 tag/latest 推导。 |

处理与映射约束：

1. 每个 pin/seed/base 必须先经过 `ImageAssemblyReferenceResolverPort`；resolver 只返回 body-free conclusion，不直接写 baseline。
2. application 将 protocol inputs 映射为 domain `ComponentPinSet` 与 `Vec<SeedPlacementBinding>`，调用 `AssemblyBaseline::capture(...)`，再调用 `AssemblyCompletenessGuard::check_baseline` / `PinIntegrityGuard::check_pins`。
3. `Complete` 只说明静态输入闭合；如果任何 `MI-UP-002`、`MI-UP-006` 或 `MI-UP-008` 相关 ref 未验证，返回 `Incomplete`/`Conflict`/`Blocked`，不可产生 buildable revision。

| 失败类别 | protocol surface | 审计 / 幂等 |
|---|---|---|
| 缺 pin/seed/base | `Blocked` 或 `Rejected` + `ImageBaselineState::Incomplete/Conflict` | 可记录 gap；不以 configuration 默认值补齐。 |
| resolver unavailable/unknown | `Unavailable`/`Unknown` | 不保存 positive baseline；若保存 negative result，仍使用同一 UoW replay。 |
| duplicate | `DuplicateReplay` | 不重复调用外部 resolver，不生成第二 baseline。 |
| accepted complete | `Accepted` + baseline ref/state | 只写 local baseline/trace/replay；不启动 build、不产生 event。 |

#### `CaptureAssemblyBaseline` 停审记录

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 所有 domain 必填字段有来源 | `pass_with_pending_owner_refs` | local refs/time/ID闭合；component/seed/base positive owner conclusions 受 `MI-UP-002/006/008` 阻断。 |
| static 与 live 是否分离 | `pass` | DTO 只有 template/release/base refs；live memory/checkpoint/workspace/container 明确拒绝。 |
| version/UoW | `pass` | variant/baseline/snapshot 读取与 save 配对；具体顺序留 Step 9/11。 |
| Step 9 承接 | `pass` | 需逐 pin/seed resolver、guard、baseline save、gap/trace/replay flow。 |

### 3.5 `ProposeVariantRevision`

#### 3.5.1 用途

`ProposeVariantRevision` 为一个已经登记的 variant 建立新的、不可变的 revision 语境，并把它绑定到一个已经存在的 assembly baseline。它只创建 `VariantRevisionLifecycle::Proposed` 语境，然后由本地 completeness / pin guard 给出 `Buildable`、`Invalid` 或保守阻断结论；它不修改 baseline 输入、不调用 builder、不形成 build intent，也不声明任何外部版本或 digest。

#### 3.5.2 函数签名 / 路由

| 项 | 内容 |
|---|---|
| 函数签名 | `handle_propose_variant_revision(ImageCommandRequest<ProposeVariantRevisionRequest>) -> Result<ImageCommandResult<ImageRevisionCommandBody>, ImageProtocolError>` |
| HTTP / RPC 名称 | 未定义；当前只保留 logical operation `ProposeVariantRevision`。 |
| 调用方 | `api` logical command entry；受控内部 caller 也必须经过同一 application facade。 |
| 处理方 | `application::DefinitionAssemblyCoordinator`。 |
| 目标对象 / port | `VariantRevision`、必要时旧 revision 的 supersede 关系；`DefinitionAssemblyRepositoryPort`、`ImageAssemblyReferenceResolverPort`、`ImageIdGeneratorPort`、`ImageClockPort`、`ImageIdempotencyRepositoryPort`。 |
| 依赖分类 | baseline / variant 为 `ref` + local truth；resolver 为 `adapter/ref`；不推导 sibling compile 依赖。 |

#### 3.5.3 请求 schema

```rust
/// ProposeVariantRevision 的请求 body；不携带 derivation record、mapping body 或 owner payload。
pub struct ProposeVariantRevisionRequest {
    /// 该 revision 所属的 variant；必须与 baseline 的 variant 完全一致。
    pub variant_ref: ImageVariantDefinitionRef,
    /// 已存在且不可变的 assembly baseline；不得以内联输入替代。
    pub baseline_ref: AssemblyBaselineRef,
    /// 本仓记录为何产生新 revision 的安全原因；使用 Step 6 的 `SafeReason`。
    pub derivation_reason: SafeReason,
    /// 可选的旧 revision；提供时表示新 revision 成立后要追加 supersede 关系。
    pub prior_revision_ref: Option<VariantRevisionRef>,
}
```

| 输入字段 | 类型 | 目标对象字段 / 动作 | 字段来源 | 缺失 / 冲突处理 |
|---|---|---|---|---|
| `variant_ref` | `ImageVariantDefinitionRef` | `VariantRevision.variant_ref` | caller 显式 typed local ref | missing=`Missing`；wrong kind=`ContractViolation`；与 baseline 不一致=`Conflict`。 |
| `baseline_ref` | `AssemblyBaselineRef` | `VariantRevision.baseline_ref` | caller 显式 typed local ref | missing=`Missing`；baseline 非 `Complete`=`Blocked`；跨 variant=`Conflict`。 |
| `derivation_reason` | `SafeReason` | `VariantRevision.derivation_reason` | caller 的已脱敏变更意图或本仓安全结论 | category / related ref 不合法=`ContractViolation`；不得由时间、label 或 payload 自动生成。 |
| `prior_revision_ref` | `Option<VariantRevisionRef>` | 成功保存新 revision 后调用旧 revision 的 `supersede` | caller 显式提供；`None` 表示没有要替代的旧 revision | 提供但找不到=`Missing`；自指或 variant 不同=`Conflict`；不允许从 current pointer 猜补。 |
| `metadata` | `ImageWriteMetadata` | operation context、trace、replay | request envelope | 缺 key/correlation=`ContractViolation`；不参与 domain identity。 |

#### 3.5.4 响应 schema 与构造闭环

响应���用共享 `ImageCommandResult<ImageRevisionCommandBody>`。`ImageRevisionCommandBody.revision_ref` 来自新建对象的 `to_ref()`；`state` 由 domain `VariantRevisionLifecycle` 显式映射到 `ImageRevisionState`。当 baseline 不是 `Complete` 时，可以保存带 `Blocked` / `Invalid` 的 negative disposition，但不得把该 disposition 映射成 `Buildable`。

| DTO 字段 | 目标对象 / 读取面 | 构造规则 | 禁止混同 |
|---|---|---|---|
| `revision_ref` | 新 `VariantRevision` | application ID factory 生成 ID，domain factory 建立对象，repository 返回 exact local ref | 不是 image tag、Artifact version、builder execution ref。 |
| `state` | `VariantRevision.lifecycle` | 只通过显式 mapper；未知 domain variant 返回 `ContractViolation` | `Buildable` 不等 build success、candidate 或 eligibility。 |
| `effects.changed_subject_refs` | variant、baseline、revision 的 local refs | 由同一 UoW 实际 staged 的 subject 组成，稳定排序 | 不列 external provider、event 或 guessed projection ref。 |
| `effects.trace_refs` | `ImageTraceRecordRef` | accepted / 允许保存 negative disposition 时由 trace append 返回 | duplicate 不新增 trace。 |
| `effects.gap_refs` | `ImagePublicGapRefSet` | 只包含本次打开或关联的 contract / consumer gap | 不把 gap 当 global readiness。 |

处理约束：

1. application 先 exact-load variant 与 baseline，并检查 `variant_ref`、baseline.variant_ref、variant.lifecycle 的关系；domain factory 不自行读取 repository。
2. 若 `prior_revision_ref` 存在，先 exact-load 并确保它属于同一 variant；新 revision 保存成功后才追加旧 revision 的 supersede，不覆盖旧 history。
3. `VariantRevision::validate` 只能消费已加载 baseline 与 pure guards；任何 `Pending`、`Blocked`、`Unavailable` 或 owner gap 均不得被转成 `Buildable`。
4. 该 command 不接受 HLD 旧名 `DerivationRecordRef`；`derivation_reason` 是本仓当前唯一安全派生输入。若未来需要正式 derivation object，必须在后续 owner/Step 重开而非在本 DTO 偷渡。

#### 3.5.5 错误映射

| 条件 | 结果 | `ImageProtocolErrorKind` | 是否保存 negative disposition |
|---|---|---|---|
| variant/baseline 缺失 | 未创建 revision | `Missing` | 可保存 body-free `Rejected`，但不得创建假 ref。 |
| baseline incomplete / stale / owner pending | revision 只能停在 `Invalid` 或 lane `Blocked` | `ContractGap` 或 `Unavailable` | 可以；gap 只冻结 `Revision` lane。 |
| prior revision mismatch / duplicate relation | 不写 supersede | `Conflict` / `InvalidTransition` | 由 application 规则决定；不覆盖旧对象。 |
| guard 通过 | local mutation committed | 无 error，`Accepted` | 是。 |
| stored result 缺失 | 不重算当前 revision | `ReplayUnavailable` | 否；进入恢复设计。 |

#### 3.5.6 幂等与审计要求

canonical input 顺序固定为：

```text
Command -> ProposeVariantRevision
  -> variant_ref
  -> baseline_ref
  -> derivation_reason.category
  -> derivation_reason.related_ref (explicit None marker when absent)
  -> prior_revision_ref (explicit None marker when absent)
```

reason 的展示文本不进入 canonical identity；actor、correlation、recorded time、route 和 adapter availability 也不进入。相同 key + 相同 canonical input 必须读取原 stored result；不同 baseline、reason category、related ref 或 prior revision 即使 label 相同也返回 `IdempotencyConflict`。审计 trace 只记录 local refs、safe reason、correlation/causation，不记录 owner body。

#### `ProposeVariantRevision` 停审记录

| 审查项 | 结论 | 缺口 / 后续 |
|---|---|---|
| DTO → object 字段是否齐全 | `pass_with_pending_baseline` | variant/baseline/reason/旧 revision 均有来源；baseline positive completeness 受 MI-UP-002/003/006/008 影响。 |
| HLD 名称是否纠偏 | `pass` | 未继承未定义的 `DerivationRecordRef`，改用 Step 6 `SafeReason derivation_reason`。 |
| 状态与边界是否分离 | `pass` | `Buildable` 只允许进入 intent 判断，不推出 build/candidate。 |
| replay / version / trace 是否闭合 | `pass_with_pending_core` | application/store/UoW 由 Step 7 定义，具体顺序留 Step 9/11/13。 |
| Step 9 承接 | `pass` | 需展开 exact loads、guard、new revision save、prior supersede、gap/trace/replay。 |

### 3.6 `RequestBuildIntent`

#### 3.6.1 用途

`RequestBuildIntent` 把一个已经持久化且通过本地 guard 的 `Buildable` revision 登记为本地构建意图。`Accepted` 只表示 image domain 允许进入 snapshot / attempt 判断，不表示 builder 接收、执行、产出 immutable image、生成 candidate 或完成发布。

#### 3.6.2 函数签名 / 路由

| 项 | 内容 |
|---|---|
| 函数签名 | `handle_request_build_intent(ImageCommandRequest<RequestBuildIntentRequest>) -> Result<ImageCommandResult<ImageBuildIntentCommandBody>, ImageProtocolError>` |
| HTTP / RPC 名称 | 未定义；logical operation `RequestBuildIntent`。 |
| 调用方 | `api` 或 bounded `jobs` caller；conditional worker 当前不得调用 positive path。 |
| 处理方 | `application::BuildIntentCoordinator`。 |
| 目标对象 / port | `VariantRevision`、`BuildIntent`；`DefinitionAssemblyRepositoryPort`、`BuildCandidateRepositoryPort`、`ImageIdGeneratorPort`、`ImageClockPort`、`ImageIdempotencyRepositoryPort`。 |
| 依赖分类 | revision 为 local `ref`；nightly 是 `runtime`/application call；future verified event 是 conditional `event`，当前不启用。 |

#### 3.6.3 请求 schema

```rust
/// RequestBuildIntent 的请求 body；trigger 只保存 body-free identity。
pub struct RequestBuildIntentRequest {
    /// 必须处于 `Buildable` 的本仓 revision。
    pub revision_ref: VariantRevisionRef,
    /// 明确的触发来源；不得使用 scheduler run、event body 或 provider callback body。
    pub trigger: ImageBuildTriggerInput,
}
```

| 输入字段 | 类型 | 目标对象字段 | 字段来源 / 映射 | 缺失 / 冲突处理 |
|---|---|---|---|---|
| `revision_ref` | `VariantRevisionRef` | `BuildIntent.revision_ref` | caller / nightly selected persisted ref | missing=`Missing`；非 Buildable、superseded 或 cross-variant=`Blocked`/`InvalidTransition`。 |
| `trigger.kind` | `BuildTriggerKind` | `BuildIntent.trigger_kind` | caller 明确选择；`VerifiedInboundEvent` 当前不可构造 | 未知 variant=`ContractViolation`；event kind 在 MI-UP-005 未闭口时=`ContractGap`。 |
| `trigger.trigger_ref` | `OpaqueReference` | `BuildIntent.trigger_ref` | local command / bounded action safe ref，或 future verified source ref | owner/kind 不符合 trigger kind=`ContractViolation`；不得由 revision id 拼接。 |
| `metadata` | `ImageWriteMetadata` | `BuildIntent.metadata` / operation context | envelope | key/correlation 缺失=`ContractViolation`。 |
| `actor` | `ImageProtocolActor` | application operation context | API participant/system 或 bounded job system actor | actor 缺失时 API=`Missing`；actor 不证明授权。 |

#### 3.6.4 响应 schema 与构造闭环

| 字段 | 来源 | 构造规则 | 边界 |
|---|---|---|---|
| `intent_ref` | `BuildIntent::to_ref()` | app 生成 local ID；domain 根据 initial disposition 建立对象 | 不等 `BuildAttemptRef` 或 external execution。 |
| `state` | `BuildIntent.lifecycle` | `Accepted/Pending/Blocked/Cancelled` 显式映射 | `Accepted` 不等 builder accepted。 |
| `effects.changed_subject_refs` | intent 与必要 revision local refs | 同一 UoW 实际变更的 local subjects | 不包含 scheduler、event、builder 或 registry refs。 |
| `effects.gap_refs` | local `ContractGap` refs | 只在 trigger/revision seam 打开 gap 时返回 | 不以 gap 隐藏缺失 revision。 |

`BuildIntent::request` 的 `initial_disposition` 由 application 根据 revision state 和 trigger boundary 计算：`VerifiedUsable` 仅可用于已确认 revision + command/nightly trigger；`VerifiedInboundEvent` 在 MI-UP-005 未关闭时只能得到 `Pending`、`Blocked` 或 `Unavailable`，不得构造 `Accepted`。

#### 3.6.5 错误映射

| 条件 | protocol outcome | 说明 |
|---|---|---|
| revision missing / wrong kind | `Rejected` + `Missing`/`ContractViolation` | 不创建 intent。 |
| revision invalid / superseded | `Rejected` + `InvalidTransition` | 不从历史中挑另一个 revision。 |
| trigger event authority pending | `Blocked`/`Unavailable` + `ContractGap` | 只冻结 `BuildIntent` lane；nightly/command lane 不被自动宣称成功。 |
| duplicate | `DuplicateReplay` | 读取 stored intent result，不再次 attach trigger。 |
| local store / transaction failure | `Unavailable` | 不声称 intent 已提交。 |

#### 3.6.6 幂等与审计要求

canonical input 顺序为 `revision_ref -> trigger.kind -> trigger_ref`，并保留 `None` / future conditional marker 的显式语义。相同 key 不得在 `Command`、`OperationsJob` 与 `InboundEvent` channel 间互相重放；channel 是 replay identity 的一部分。nightly 选择的 revision 必须来自已持久化 `list_buildable_revisions`，不得把 scheduler tick 或 “当天”字符串写入 trigger ref。审计记录 revision、trigger kind/ref、intent ref 与安全处置；不记录 pipeline body、run id 或 secret。

#### `RequestBuildIntent` 停审记录

| 审查项 | 结论 | 缺口 / 后续 |
|---|---|---|
| buildable 前置是否明确 | `pass` | 只接受 persisted `VariantRevisionLifecycle::Buildable`；不由 label/tag 推导。 |
| trigger 分类是否闭合 | `pass_with_pending_event` | command/nightly 可表达；verified event 受 MI-UP-005 阻断。 |
| accepted 边界是否收窄 | `pass` | 不等 attempt、builder、candidate、digest 或 availability。 |
| Step 9 承接 | `pass` | 需展开 revision read、trigger guard、intent save、negative gap、replay。 |

### 3.7 `RecordBuildOutcome`

#### 3.7.1 用途

`RecordBuildOutcome` 将 builder/registry seam 提供的保守 observation 规范化为本仓 `BuildOutcomeConclusion`，更新对应 `BuildAttempt`，并在且仅在 candidate formation guard 通过时形成 `CandidateImage`。handoff、ACK、HTTP 2xx、registry presence、tag 或 cache hit 都不能直接成为 candidate 条件。

#### 3.7.2 函数签名 / 路由

| 项 | 内容 |
|---|---|
| 函数签名 | `handle_record_build_outcome(ImageCommandRequest<RecordBuildOutcomeRequest>) -> Result<ImageCommandResult<ImageBuildOutcomeCommandBody>, ImageProtocolError>` |
| HTTP / RPC 名称 | 未定义；logical operation `RecordBuildOutcome`。 |
| 调用方 | `api` 的受控 integration mapping；或 `ReconcileBuildAttempts` 的 application facade；不接受 provider callback body 直通。 |
| 处理方 | `application::BuildIntentCoordinator`。 |
| 目标对象 / port | `BuildAttempt`、`BuildOutcomeConclusion`、可选 `CandidateImage`；`BuildCandidateRepositoryPort`、`BuilderRegistryPort`、`ImageIdGeneratorPort`、`ImageClockPort`、`ImageIdempotencyRepositoryPort`。 |
| 依赖分类 | builder/registry 为 `adapter`；attempt/outcome/candidate 为 local truth；provider callback schema 未绑定。 |

#### 3.7.3 请求 schema

```rust
/// RecordBuildOutcome 的请求 body；observation 已被 caller/adapter 映射为 body-free safe refs。
pub struct RecordBuildOutcomeRequest {
    /// 要更新的既有本仓 attempt。
    pub attempt_ref: BuildAttemptRef,
    /// 单次安全 observation；不同 result kind 的 Option 语义见下表。
    pub outcome: ImageBuildOutcomeInput,
}
```

| 输入字段 | 类型 | 目标对象字段 / 动作 | 字段来源 | 缺失 / 冲突处理 |
|---|---|---|---|---|
| `attempt_ref` | `BuildAttemptRef` | `BuildAttempt.intent_ref/snapshot_ref` 读取与 outcome 关联 | caller 显式 typed local ref | missing=`Missing`；wrong kind=`ContractViolation`；已终态重复不同结论=`Conflict`。 |
| `outcome.execution_ref` | `ExternalBuildExecutionRef` | `BuildOutcomeConclusion.execution_ref` | 同一 safe observation 的 builder/registry adapter | wrong owner/kind=`ContractViolation`；不从 handoff ref 反推。 |
| `outcome.result_kind` | `BuildResultKind` | `BuildOutcomeConclusion.result_kind` 与 attempt lifecycle | approved safe observation | ACK/transport status 不能直接构造；unknown/unavailable 必须保守保存。 |
| `outcome.immutable_image_ref` | `Option<ImmutableImageRef>` | candidate 的 `image_ref` | 同一成功 observation | `Succeeded` 缺失=`ContractViolation`；其它 result 若为 Some=`ContractViolation`。 |
| `outcome.output_identity_ref` | `Option<VerifiedContentIdentityRef>` | outcome 的 output identity、candidate formation basis | 同一成功 observation | `Succeeded` 缺失=`Blocked`；不得由 tag/裸 digest补齐。 |
| `outcome.reason` | `Option<SafeReason>` | outcome / attempt / candidate negative reason | adapter safe conclusion | `Failed/Unknown/Unavailable` 缺 reason=`Missing`；Succeeded 带不相容 reason=`ContractViolation`。 |
| `metadata` | `ImageWriteMetadata` | local operation trace/replay | envelope | 不作为 external outcome identity。 |

#### 3.7.4 响应 schema 与构造闭环

`ImageBuildOutcomeCommandBody` 同时返回 attempt 状态、保存的 outcome ref 和可选 candidate ref。只有以下链条全部成立才允许 `candidate_ref=Some`：

```text
loaded attempt (HandoffPending | OutcomePending)
  + matching complete BuildInputSnapshot
  + Succeeded result
  + immutable_image_ref=Some
  + output_identity_ref=Some
  + matching execution/output refs
  -> BuildOutcomeConclusion
  -> CandidateFormationGuard::check = VerifiedUsable
  -> CandidateImage::form
```

| 响应字段 | 来源 | 保守规则 |
|---|---|---|
| `attempt_ref` | request / loaded attempt | 必须 exact match；不由 execution ref 生成。 |
| `outcome_ref` | 新建 `BuildOutcomeConclusion` | `Failed/Unknown/Unavailable` 也可有 local outcome ref，但不能带 candidate。 |
| `attempt_state` | `BuildAttempt.lifecycle` | 映射 `Succeeded` 不等 candidate formed；Unknown 永不被 query 隐藏。 |
| `candidate_ref` | candidate factory（可选） | 仅 guard 通过；不由 image ref 单独查找后补造。 |
| `effects.trace_refs` | local trace append | 记录 attempt/outcome/candidate 的 safe relation。 |

#### 3.7.5 错误映射

| 条件 | protocol outcome | 处置 |
|---|---|---|
| attempt 不存在 / 已 superseded 且不允许更新 | `Rejected` + `Missing`/`InvalidTransition` | 不写 outcome。 |
| outcome refs 与 attempt/snapshot 不匹配 | `Rejected` + `Conflict`/`ContractViolation` | 不猜修 execution 或 output identity。 |
| safe observation 为 Unknown | `Unknown`，attempt=`Unknown` | 不普通 retry、不形成 candidate。 |
| adapter unavailable | `Unavailable` | 可保存安全 negative observation；不宣称失败或成功。 |
| Succeeded 但缺 immutable/output identity | `Blocked` + `ContractViolation` | 不保存 positive candidate；必要时保存 blocked outcome shell。 |
| duplicate same canonical input | `DuplicateReplay` | 不再次调用 builder/registry，不重新形成 candidate。 |

#### 3.7.6 幂等与审计要求

canonical input 顺序为 `attempt_ref -> execution_ref -> result_kind -> immutable_image_ref -> output_identity_ref -> reason.category/related_ref`，所有 optional 字段均有显式 absence marker。不得把完整 provider observation body、log、manifest、tag、digest 文本、callback 时间或 retry counter 放进 canonical body。对同一 attempt 的不同安全结论必须显式 `Conflict`，不得 last-write-wins；unknown recovery 通过后续新的 observation / context 处理。

#### `RecordBuildOutcome` 停审记录

| 审查项 | 结论 | 缺口 / 后续 |
|---|---|---|
| handoff / outcome / candidate 是否分离 | `pass` | 每阶段有独立 ref 与状态；ACK 不升级。 |
| output identity 是否安全 | `pass_with_pending_builder_registry` | 只接受 future safe verified refs；Q-MI-003 未闭口。 |
| unknown / unavailable 是否可见 | `pass` | 各自映射到 attempt/outcome 保守状态，不静默转失败或成功。 |
| Step 9 承接 | `pass` | 需展开 attempt load、observation normalization、guard、candidate save、rollback/replay。 |

### 3.8 `EvaluateCandidateEligibility`

#### 3.8.1 用途

该 command 在一个已形成的 candidate 上建立或重新评估 provenance、authority-owned gate conclusion 与 image-local eligibility。它不定义 gate inventory、不保存 evidence body、不拥有 Artifact acceptance，也不把 `Eligible` 推导为 `Available` 或 consumer confirmation。

#### 3.8.2 函数签名 / 路由

| 项 | 内容 |
|---|---|
| 函数签名 | `handle_evaluate_candidate_eligibility(ImageCommandRequest<EvaluateCandidateEligibilityRequest>) -> Result<ImageCommandResult<ImageQualificationCommandBody>, ImageProtocolError>` |
| HTTP / RPC 名称 | 未定义；logical operation `EvaluateCandidateEligibility`。 |
| 调用方 | `api` 或 bounded qualification reevaluation facade。 |
| 处理方 | `application::QualificationCoordinator`。 |
| 目标对象 / port | `CandidateImage`、`BuildInputSnapshot`、`ProvenanceBinding`、`GateEvaluation`、`EligibilityDecision`；`BuildCandidateRepositoryPort`、`QualificationRepositoryPort`、`QualificationBoundaryPort`、`ImageIdGeneratorPort`、`ImageClockPort`、`ImageIdempotencyRepositoryPort`。 |
| 依赖分类 | local chain 为 `ref`；governance/evidence 为 `adapter/ref`；Q-MI-004 当前阻断 positive gate。 |

#### 3.8.3 请求 schema

```rust
/// EvaluateCandidateEligibility 的请求 body；gate/evidence 只以 body-free ref 和 safe conclusion 进入。
pub struct EvaluateCandidateEligibilityRequest {
    /// 必须处于 `CandidateLifecycle::Formed` 的 candidate。
    pub candidate_ref: CandidateImageRef,
    /// candidate 对应的 complete input snapshot。
    pub snapshot_ref: BuildInputSnapshotRef,
    /// builder execution 的 body-free provenance ref。
    pub execution_ref: ExternalBuildExecutionRef,
    /// candidate 的 verified output identity。
    pub output_identity_ref: VerifiedContentIdentityRef,
    /// provenance 中附加的 mapping / assembly source refs；不可带 source body。
    pub provenance_sources: Vec<ImageProvenanceSourceInput>,
    /// 重新使用一个已有 provenance context 时提供；`None` 表示创建新 binding。
    pub existing_provenance_ref: Option<ProvenanceBindingRef>,
    /// Governance owner 的 gate authority；当前可为空并导致 blocked/reopen。
    pub gate_authority_ref: Option<GateAuthorityRef>,
    /// authority-owned applicable gate-set ref；不携带 gate inventory。
    pub applicable_gate_set_ref: Option<ApplicableGateSetRef>,
    /// 已由受控 boundary 得出的单项 gate safe conclusions。
    pub gate_conclusions: Vec<ImageGateConclusionInput>,
    /// 重新使用一个已有 gate evaluation context 时提供；`None` 表示创建新 evaluation。
    pub existing_gate_evaluation_ref: Option<GateEvaluationRef>,
}
```

| 输入字段 | 类型 | 目标对象字段 / 动作 | 字段来源 | 缺失 / 冲突处理 |
|---|---|---|---|---|
| `candidate_ref` | `CandidateImageRef` | 所有 qualification 对象的 candidate 关联 | caller + exact load | missing / non-Formed=`Missing`/`InvalidTransition`。 |
| `snapshot_ref` | `BuildInputSnapshotRef` | `ProvenanceBinding.snapshot_ref` | caller + exact load | snapshot 不完整或与 candidate attempt 不一致=`Conflict`/`Blocked`。 |
| `execution_ref` | `ExternalBuildExecutionRef` | `ProvenanceBinding.execution_ref` | safe builder/registry conclusion | wrong owner/kind=`ContractViolation`；不由 attempt handoff 推导。 |
| `output_identity_ref` | `VerifiedContentIdentityRef` | `ProvenanceBinding.output_identity_ref` | candidate formation / safe outcome | verification source 缺失=`Blocked`；不得由 `ImmutableImageRef` 反推。 |
| `provenance_sources` | `Vec<ImageProvenanceSourceInput>` | `ProvenanceSourceBindingSet` | caller 的 body-free refs | required role 缺失、role/kind 不匹配=`ContractViolation`/`Blocked`。 |
| `existing_provenance_ref` | `Option<ProvenanceBindingRef>` | 更新 / supersede 的既有 local context | explicit exact ref | wrong candidate=`Conflict`；不从 trace 猜当前 binding。 |
| `gate_authority_ref` | `Option<GateAuthorityRef>` | `QualificationBoundaryPort::assess_gate_boundary` 输入 | Governance safe boundary | 当前缺失=`ContractGap`；不默认有 authority。 |
| `applicable_gate_set_ref` | `Option<ApplicableGateSetRef>` | `GateEvaluation.applicable_gate_set_ref` | formal authority ref | 当前缺失=`ContractGap`；不得复制 gate inventory。 |
| `gate_conclusions` | `Vec<ImageGateConclusionInput>` | `GateConclusionBindingSet` | approved evidence/gate safe refs | 空集合不等 passed；duplicate / conflict=`Conflict`。 |
| `existing_gate_evaluation_ref` | `Option<GateEvaluationRef>` | 更新 / supersede 的既有 evaluation | explicit exact ref | candidate 不一致=`Conflict`；不覆盖 history。 |

#### 3.8.4 响应 schema 与构造闭环

application 先构造（或 exact-load）provenance binding，再打开（或 exact-load）gate evaluation，最后创建新的 eligibility decision context。三者必须指向同一 candidate；每个 context 的历史替代都通过新 ref，不能在 query 或 repository 层原地修复。

| 响应字段 | 来源 | 映射 / 边界 |
|---|---|---|
| `provenance_ref` | `ProvenanceBinding::to_ref()` | `Complete` 只表示 source chain 完整；不等 gate passed。 |
| `gate_evaluation_ref` | `GateEvaluation::to_ref()` | `Passed` 只有 applicable set + all required safe conclusions 正向时可构造；Q-MI-004 未闭口时通常 Pending/Blocked/Unknown。 |
| `eligibility_ref` | `EligibilityDecision::to_ref()` | `Eligible` 只在 candidate Formed + provenance Complete + gate Passed 时允许。 |
| `eligibility_state` / `gate_state` | domain state mapper | 未知 variant 映射失败即 `ContractViolation`。 |
| `effects.gap_refs` | contract gap refs | gate/evidence 缺口可见，不能压成 `Ineligible` 或空结果。 |

#### 3.8.5 错误映射

| 条件 | protocol outcome | 说明 |
|---|---|---|
| candidate/snapshot relation 缺失 | `Rejected` + `Missing`/`Conflict` | 不创建 qualification positive context。 |
| authority / applicable gate set 未闭口 | `Blocked` + `ContractGap` | 只冻结 Qualification lane；不把缺失当 passed。 |
| gate 明确失败 | `Rejected` + `InvalidTransition` 或安全负面 body | eligibility=`Ineligible`，不进入 supply。 |
| gate unknown / unavailable | `Unknown`/`Unavailable` | eligibility 保持 `Pending` 或 `Blocked`；不普通 retry 成功。 |
| duplicate | `DuplicateReplay` | 读取 stored qualification result；不重复询问 external boundary。 |

#### 3.8.6 幂等与审计要求

canonical 顺序为 candidate、snapshot、execution、output identity、排序后的 provenance sources、authority/applicable gate refs、排序后的 gate conclusion refs、existing context refs。gate conclusion 的展示 reason 文本不进入 identity，但 disposition 与 related ref 必须进入。不得保存 BOM、扫描结果、签名文件、Evidence body、gate priority 或 policy body。审计同时记录 candidate/provenance/gate/eligibility refs 与受影响 lane；不记录 external payload。

#### `EvaluateCandidateEligibility` 停审记录

| 审查项 | 结论 | 缺口 / 后续 |
|---|---|---|
| qualification 对象是否全部承接 | `pass` | provenance、gate evaluation、eligibility 三层均有 DTO/ref/state。 |
| Q-MI-004 是否保持 pending | `pass_with_blocker` | 只有 authority/applicable refs 和 safe conclusions carrier；不声称 gate inventory 或 pass。 |
| Artifact / supply 是否越界 | `pass` | 输出不含 Artifact/entry/consumer result；后续 command 单独处理。 |
| Step 9 承接 | `pass` | 需展开 candidate load、provenance binding、boundary assessment、gate close、eligibility save、history/replay。 |

### 3.9 `RecordArtifactHandoff`

#### 3.9.1 用途

该 command 记录镜像域向 `L1-artifact` 的 handoff 观察。当前 `MI-UP-007` 尚未提供 image handoff 的 exact schema、consumable ref、lineage 和 owner acceptance，因此当前允许的结果仅为 local `Pending` 或 `Gap`；`Accepted` 类型为 future schema 保留位，不得在当前 composition 中构造。

#### 3.9.2 函数签名 / 路由

| 项 | 内容 |
|---|---|
| 函数签名 | `handle_record_artifact_handoff(ImageCommandRequest<RecordArtifactHandoffRequest>) -> Result<ImageCommandResult<ImageArtifactHandoffCommandBody>, ImageProtocolError>` |
| HTTP / RPC 名称 | 未定义；logical operation `RecordArtifactHandoff`。 |
| 调用方 | `api` 的受控 reconciliation mapping 或 handoff job facade。 |
| 处理方 | `application::QualificationCoordinator`。 |
| 目标对象 / port | `ArtifactHandoffRecord`、`ContractGap`；`QualificationRepositoryPort`、`QualificationBoundaryPort`、`ReferenceDerivedRepositoryPort`、`ImageIdGeneratorPort`、`ImageClockPort`、`ImageIdempotencyRepositoryPort`。 |
| 依赖分类 | Artifact 为 `adapter/ref`；本地 handoff/gap 为 local truth；不把 L1-artifact 变成源码依赖。 |

#### 3.9.3 请求 schema

```rust
/// RecordArtifactHandoff 的请求 body；所有 Artifact 字段均为 body-free optional ref。
pub struct RecordArtifactHandoffRequest {
    /// 形成 handoff 的本仓 candidate。
    pub candidate_ref: CandidateImageRef,
    /// 必须为同一 candidate 的 image-local eligible decision。
    pub eligibility_ref: EligibilityDecisionRef,
    /// 未来 formal Artifact seam 提供的 consumable ref；当前通常为 None。
    pub artifact_ref: Option<ArtifactConsumableRef>,
    /// 未来 owner-side formal resolution；当前不得据此直接写 Accepted。
    pub formal_resolution_ref: Option<ContractResolutionRef>,
}
```

| 输入字段 | 类型 | 目标对象字段 / 动作 | 当前来源 | 缺失 / 冲突处理 |
|---|---|---|---|---|
| `candidate_ref` | `CandidateImageRef` | `ArtifactHandoffRecord.candidate_ref` | exact local load | missing / non-Formed=`Missing`/`InvalidTransition`。 |
| `eligibility_ref` | `EligibilityDecisionRef` | `ArtifactHandoffRecord.eligibility_ref` | exact local load | missing、非 Eligible 或 candidate 不一致=`Conflict`/`Blocked`。 |
| `artifact_ref` | `Option<ArtifactConsumableRef>` | future `ArtifactHandoffRecord.artifact_ref` | formal Artifact owner boundary only | 当前 `Some` 但无 formal schema=`ContractGap`；不从 image ref/registry 猜。 |
| `formal_resolution_ref` | `Option<ContractResolutionRef>` | future accepted resolution basis | owner formal resolution only | 当前不可验证=`ContractGap`；不得由本仓配置/ACK mint。 |

#### 3.9.4 响应 schema与当前处置

`ImageArtifactHandoffCommandBody` 返回 local handoff ref、映射后的 state 以及可选的 `ImageBoundaryGapRef`。在 `MI-UP-007` 未关闭时，application 必须走：

```text
eligible candidate + pending Artifact boundary
  -> ArtifactHandoffRecord::open
  -> QualificationBoundaryPort::assess_artifact_handoff_boundary
  -> ContractGap::open (ArtifactHandoff lane)
  -> ArtifactHandoffRecord::record_gap
  -> Pending | Gap result
```

`ArtifactHandoffState::Accepted` 只有在未来同一 safe assessment 同时提供 exact `ArtifactConsumableRef` 与 formal `ContractResolutionRef`、且 owner-side schema 已重新通过 Step 7/8/9 审阅时才可构造。当前不存在 accepted response、Artifact version、lineage、storage location 或 delivery receipt。

#### 3.9.5 错误映射

| 条件 | protocol outcome | 处置 |
|---|---|---|
| candidate/eligibility 缺失或不一致 | `Rejected` + `Missing`/`Conflict` | 不创建 handoff。 |
| Artifact schema/ref pending | `Blocked` + `ContractGap` | 保存 local Pending/Gap observation；不写 Accepted。 |
| Artifact boundary unavailable | `Unavailable` | 保留 local safe reason；不宣称 handoff failed 或 accepted。 |
| owner ref 与 candidate/eligibility 不相容 | `Rejected` + `ContractViolation` | 不尝试替换 ref。 |
| duplicate | `DuplicateReplay` | 不再次调用 Artifact seam，不重复 open gap。 |

#### 3.9.6 幂等与审计要求

canonical 顺序为 candidate_ref、eligibility_ref、artifact_ref（显式 None）、formal_resolution_ref（显式 None）。同 key 不同 Artifact ref 或 resolution ref 返回冲突；不把缺失的 optional 字段当空字符串。审计只保存 local handoff/gap refs、owner kind、safe reason 和 correlation；不保存 Artifact body、lineage graph、manifest、receipt 或 delivery status。

#### `RecordArtifactHandoff` 停审记录

| 审查项 | 结论 | 缺口 / 后续 |
|---|---|---|
| image qualification 与 Artifact owner 是否分离 | `pass` | only local observation + gap；L1-artifact 仍为 truth owner。 |
| Accepted 是否被错误开放 | `pass_with_blocker` | 当前 factory/port/flow 不得构造 Accepted；MI-UP-007 关闭后必须重开。 |
| Step 9 承接 | `pass` | 需展开 eligibility load、boundary assessment、gap save、negative replay。 |

### 3.10 `PublishInstantiableEntry`

#### 3.10.1 用途

`PublishInstantiableEntry` 将已经具备本仓 `Eligible`、`Complete` provenance 和 immutable image ref 的 candidate 固化为一个 local pinned entry，并追加 local `Publish` availability transition。这里的“publish”只表示本仓 supply history 成立；不表示 registry publish、Artifact acceptance、Member Service receive、container launch 或 health。

#### 3.10.2 函数签名 / 路由

| 项 | 内容 |
|---|---|
| 函数签名 | `handle_publish_instantiable_entry(ImageCommandRequest<PublishInstantiableEntryRequest>) -> Result<ImageCommandResult<ImageSupplyCommandBody>, ImageProtocolError>` |
| HTTP / RPC 名称 | 未定义；logical operation `PublishInstantiableEntry`。 |
| 调用方 | `api` logical command entry；不由 Member Service callback 直接调用。 |
| 处理方 | `application::AvailabilityCoordinator`。 |
| 目标对象 / port | `InstantiableEntry`、`AvailabilityTransition`；`QualificationRepositoryPort`、`BuildCandidateRepositoryPort`、`SupplyEntryRepositoryPort`、`ImageIdGeneratorPort`、`ImageClockPort`、`ImageIdempotencyRepositoryPort`。 |
| 依赖分类 | candidate/image 是 `ref`；Member Service 为未来 `runtime/ref` consumer seam，不在本 command 中调用。 |

#### 3.10.3 请求 schema

```rust
/// PublishInstantiableEntry 的请求 body；只携带已验证 local refs 与 immutable image ref。
pub struct PublishInstantiableEntryRequest {
    /// entry 所属的 variant。
    pub variant_ref: ImageVariantDefinitionRef,
    /// 已形成 candidate 的 local ref。
    pub candidate_ref: CandidateImageRef,
    /// 必须为同一 candidate 的 Eligible decision。
    pub eligibility_ref: EligibilityDecisionRef,
    /// 必须为同一 candidate 的 Complete provenance。
    pub provenance_ref: ProvenanceBindingRef,
    /// 来自 candidate / safe outcome 的 immutable image identity。
    pub image_ref: ImmutableImageRef,
    /// 若显式提供，必须指向当前 local entry；首次 Publish 应为 None。
    pub prior_entry_ref: Option<InstantiableEntryRef>,
}
```

| 输入字段 | 类型 | 目标对象 / 动作 | 来源 | 缺失 / 冲突处理 |
|---|---|---|---|---|
| `variant_ref` | `ImageVariantDefinitionRef` | entry / transition scope | caller + exact local load | missing=`Missing`；与 candidate chain 不一致=`Conflict`。 |
| `candidate_ref` | `CandidateImageRef` | `InstantiableEntry.candidate_ref` | exact local candidate | non-Formed=`InvalidTransition`；missing=`Missing`。 |
| `eligibility_ref` | `EligibilityDecisionRef` | entry eligibility prerequisite | exact qualification load | non-Eligible / candidate mismatch=`Blocked`/`Conflict`。 |
| `provenance_ref` | `ProvenanceBindingRef` | entry provenance prerequisite | exact qualification load | non-Complete / candidate mismatch=`Blocked`/`Conflict`。 |
| `image_ref` | `ImmutableImageRef` | `InstantiableEntry.image_ref` | candidate formation safe binding | mutable selector / wrong owner/kind=`ContractViolation`。 |
| `prior_entry_ref` | `Option<InstantiableEntryRef>` | current facts / conflict detection | explicit local ref | existing current entry + None=`Conflict`；不得静默 replace。 |

#### 3.10.4 响应 schema与构造闭环

application 顺序上必须先 exact-load candidate、eligibility、provenance，并由 `EntryPinGuard::check_entry` 验证三者及 image ref；然后创建 `InstantiableEntry`（初始 `Unavailable`），创建 `AvailabilityTransition`（`Publish`），通过 `AvailabilityTransitionGuard` 后在同一 UoW 提交 transition 与 entry 的 local history。`entry_state=Available` 只在这两个 local object 均成功提交后返回。

| 响应字段 | 来源 | 规则 |
|---|---|---|
| `entry_ref` | 新 `InstantiableEntry` | accepted publish 才 `Some`；blocked/rejected 可为 None。 |
| `transition_ref` | 新 `AvailabilityTransition` | accepted local publish 才 `Some`；不代表 external publish。 |
| `entry_state` | `InstantiableEntry.lifecycle` | `Available` 仅表示 local supply；不等 consumer confirmation。 |
| `effects.gap_refs` | local gaps | consumer gap 不应被本 command 关闭；如已有 gap，保持可见。 |

#### 3.10.5 错误映射

| 条件 | protocol outcome | 处置 |
|---|---|---|
| local qualification ref 缺失 | `Rejected` + `Missing` | 不创建 entry。 |
| eligibility/provenance/candidate 不满足 | `Blocked`/`Rejected` | 不用 Artifact、registry 或 consumer 状态替代。 |
| image ref mutable / unverified | `Rejected` + `ContractViolation` | 不计算或猜补 digest。 |
| current entry 与 prior ref 冲突 | `Conflict` | 使用 `TransitionAvailability` 的 replace 语境，不在 publish 内隐式替换。 |
| duplicate | `DuplicateReplay` | 不生成第二 entry/transition。 |

#### 3.10.6 幂等与审计要求

canonical 顺序为 variant、candidate、eligibility、provenance、image_ref、prior_entry_ref（显式 None）。`image_ref` 按 external typed ref 的 owner/kind/opaque identity/revision 编码；不得把 raw digest 文本或 tag 作为替代。accepted trace 记录 entry、transition、candidate、eligibility、provenance refs；outbound inventory 固定 `NoneAuthorized`。

#### `PublishInstantiableEntry` 停审记录

| 审查项 | 结论 | 缺口 / 后续 |
|---|---|---|
| entry 前置是否完整 | `pass` | candidate/eligibility/provenance/image ref 四条链均显式。 |
| local publish 与 external publish 是否分离 | `pass` | 只写 local transition/history；无 registry/consumer side effect。 |
| immutable pin 是否 fail closed | `pass_with_pending_output_owner` | Builder/Registry safe ref 仍受 Q-MI-003 约束。 |
| Step 9 承接 | `pass` | 需展开 qualification loads、entry/transition factories、guards、append/save、replay。 |

### 3.11 `TransitionAvailability`

#### 3.11.1 用途

该 command 只追加一条本仓 availability history。它承接 `Publish`、`Replace`、`Rollback`、`Retire` 四种 local action，但不创建或删除外部对象，也不把 history commit 解释为 registry、Artifact、Member Service 或容器状态。

#### 3.11.2 函数签名 / 路由

| 项 | 内容 |
|---|---|
| 函数签名 | `handle_transition_availability(ImageCommandRequest<TransitionAvailabilityRequest>) -> Result<ImageCommandResult<ImageAvailabilityCommandBody>, ImageProtocolError>` |
| HTTP / RPC 名称 | 未定义；logical operation `TransitionAvailability`。 |
| 调用方 | `api` logical command entry；Publish/Rollback flows 可通过 application 内部 facade 复用。 |
| 处理方 | `application::AvailabilityCoordinator`。 |
| 目标对象 / port | `AvailabilityTransition`、`CurrentAvailabilityFacts`、必要时 entry exact read；`SupplyEntryRepositoryPort`、`ImageClockPort`、`ImageIdGeneratorPort`、`ImageIdempotencyRepositoryPort`。 |
| 依赖分类 | 全部当前为 local truth/ref；consumer/registry 状态不进入 guard。 |

#### 3.11.3 请求 schema

```rust
/// TransitionAvailability 的请求 body；动作所需 target refs 必须显式提供。
pub struct TransitionAvailabilityRequest {
    /// availability history 的 variant scope。
    pub variant_ref: ImageVariantDefinitionRef,
    /// 动作和前后 entry refs。
    pub transition: ImageAvailabilityTransitionInput,
}
```

| 输入字段 | 类型 | 目标对象字段 / 动作 | 来源 | 缺失 / 冲突处理 |
|---|---|---|---|---|
| `variant_ref` | `ImageVariantDefinitionRef` | `AvailabilityTransition.variant_ref` | caller exact local ref | missing=`Missing`；与 target entry variant 不一致=`Conflict`。 |
| `transition.transition_kind` | `AvailabilityTransitionKind` | `AvailabilityTransition.transition_kind` | caller explicit action | unknown / action not allowed=`ContractViolation`。 |
| `transition.candidate_ref` | `Option<CandidateImageRef>` | history candidate context | action-specific caller ref | Publish/Replace 缺失=`Missing`；Retire 可 None；不从 entry image 反查 candidate。 |
| `transition.prior_entry_ref` | `Option<InstantiableEntryRef>` | history prior pointer | current facts / explicit caller ref | Replace/Rollback/Retire 需按 action 校验；不从 newest history猜。 |
| `transition.resulting_entry_ref` | `Option<InstantiableEntryRef>` | history resulting pointer | explicit target entry | Rollback/Replace 需 Some 且 exact valid；Retire 必须 None；不把 consumer ref 当 entry。 |
| `transition.reason` | `Option<SafeReason>` | reject / blocked / action explanation | caller safe reason | rejected/superseded 分支缺 reason=`Missing`；Committed 不用 reason 伪装。 |

#### 3.11.4 响应 schema与动作矩阵

| 动作 | 必要 refs | guard 允许条件 | local 结果 |
|---|---|---|---|
| `Publish` | candidate、resulting entry（由 publish flow 先创建） | 当前无 conflicting current entry；target entry pinned | append `Committed` transition。 |
| `Replace` | candidate、prior entry、resulting entry | prior 是 current；resulting 是新的 immutable entry | append `Committed`，旧 entry 后续由 application 标记 `Superseded`。 |
| `Rollback` | prior/current entry、resulting earlier entry | `rollback_target_is_verified=true` 且 target 不为当前 | append 新 `Committed` history；不复活旧 transition。 |
| `Retire` | prior entry，resulting=None | current entry 存在且 action allowed | append `Committed` retire history；保留 entry/history。 |

`ImageAvailabilityCommandBody.transition_ref` 仅来自 append 成功的 local transition；`state=Committed` 只表示本仓 history。若 guard 失败，response 可带 `Proposed/Rejected` 的安全 body，但不返回 `Committed`。

#### 3.11.5 错误映射

| 条件 | protocol outcome | 处置 |
|---|---|---|
| current facts 缺失或 stale | `Blocked`/`Unavailable` | 不从 history newest 或 consumer state 猜补。 |
| action/target ref 不匹配 | `Rejected` + `ContractViolation`/`Conflict` | 不 append。 |
| optimistic version conflict | `Conflict` | 不 last-write-wins；重新读取由后续 flow 决定。 |
| duplicate | `DuplicateReplay` | 不 append 第二条 history。 |
| append / commit failure | `Unavailable` | 不声称 local transition committed。 |

#### 3.11.6 幂等与审计要求

canonical 顺序为 variant、transition_kind、candidate_ref、prior_entry_ref、resulting_entry_ref、reason.category/related_ref。`resulting_entry_ref=None` 与缺字段不可混用。每条 committed transition 追加 local trace；旧 history 不删除、不改写，consumer/registry/Artifact refs 不进入 action identity。

#### `TransitionAvailability` 停审记录

| 审查项 | 结论 | 缺口 / 后续 |
|---|---|---|
| 四种 action 是否逐项闭合 | `pass` | refs、None 语义、guard 条件和 local state 均明确。 |
| append-only 是否保持 | `pass` | 只允许新 transition；不 update/delete 旧 history。 |
| downstream readiness 是否隔离 | `pass` | Committed 不等 external publish、consumer、container 或 health。 |
| Step 9 承接 | `pass` | 需展开 current facts、guard、append/save、entry linkage、version/replay。 |

### 3.12 `RollbackOrRetireEntry`

#### 3.12.1 用途

`RollbackOrRetireEntry` 是对一个既有 local entry 的显式回退或退役命令。Rollback 必须指向仍然可验证的既有 immutable entry，并通过新 transition 建立历史；Retire 只停止 local supply 语义而不删除 entry、candidate、provenance 或旧 history。

#### 3.12.2 函数签名 / 路由

| 项 | 内容 |
|---|---|
| 函数签名 | `handle_rollback_or_retire_entry(ImageCommandRequest<RollbackOrRetireEntryRequest>) -> Result<ImageCommandResult<ImageRollbackCommandBody>, ImageProtocolError>` |
| HTTP / RPC 名称 | 未定义；logical operation `RollbackOrRetireEntry`。 |
| 调用方 | `api` logical command entry；不接受 Member Service、container 或 registry callback 直接改变 entry。 |
| 处理方 | `application::AvailabilityCoordinator`。 |
| 目标对象 / port | `InstantiableEntry`、`AvailabilityTransition`、`CurrentAvailabilityFacts`；`SupplyEntryRepositoryPort`、`ImageClockPort`、`ImageIdGeneratorPort`、`ImageIdempotencyRepositoryPort`。 |
| 依赖分类 | local `ref`/truth；future consumer relation 只可形成 gap，不可驱动 rollback。 |

#### 3.12.3 请求 schema

```rust
/// RollbackOrRetireEntry 的请求 body；只允许 Rollback 或 Retire 两个 local action。
pub struct RollbackOrRetireEntryRequest {
    /// 被操作的既有 local entry。
    pub entry_ref: InstantiableEntryRef,
    /// 必须是 `Rollback` 或 `Retire`。
    pub transition_kind: AvailabilityTransitionKind,
    /// Rollback 的目标 entry；Retire 必须为 None。
    pub resulting_entry_ref: Option<InstantiableEntryRef>,
    /// 操作原因；不得保存 raw incident / provider error body。
    pub reason: SafeReason,
}
```

| 输入字段 | 类型 | 目标对象 / 动作 | 来源 | 缺失 / 冲突处理 |
|---|---|---|---|---|
| `entry_ref` | `InstantiableEntryRef` | current prior entry | caller exact local ref | missing=`Missing`；非 current、已 retired/superseded=`InvalidTransition`。 |
| `transition_kind` | `AvailabilityTransitionKind` | new transition action | caller explicit | Publish/Replace=`ContractViolation`；只接受 Rollback/Retire。 |
| `resulting_entry_ref` | `Option<InstantiableEntryRef>` | rollback target | explicit local ref | Rollback None=`Missing`；Retire Some=`ContractViolation`；target not verified=`Blocked`。 |
| `reason` | `SafeReason` | transition / entry state explanation | caller safe reason | 空 reason / raw body=`ContractViolation`；不由 entry state 猜补。 |
| `metadata` | `ImageWriteMetadata` | operation/replay/trace | envelope | key/correlation 缺失=`ContractViolation`。 |

#### 3.12.4 响应 schema与构造闭环

application exact-loads `entry_ref` 与 current availability facts，构造新 `AvailabilityTransition`，调用 strict guard，然后：

- Rollback：验证 target entry 的 immutable pin、variant 一致性和当前仍可供本仓使用；追加新 committed transition，并按 domain 规则为原 current entry 建立 supersede/历史关系。
- Retire：追加新 committed transition，调用 entry 的 `retire`，保留全部 immutable input 与历史 refs。

| 响应字段 | 来源 | 规则 |
|---|---|---|
| `entry_ref` | 被操作的 exact entry | 不换成 target 或新生成 ref。 |
| `transition_ref` | 新 append-only transition | accepted 才返回；不表示外部 rollback。 |
| `entry_state` | 操作后 local entry state | Rollback 的 target/current 映射由 local supply flow 明确；Retire 为 `Retired`。 |
| `effects.changed_subject_refs` | entry + transition (+ target) | 仅同一 UoW 实际 staged refs。 |

#### 3.12.5 错误映射

| 条件 | protocol outcome | 处置 |
|---|---|---|
| entry missing / not current | `Rejected` + `Missing`/`InvalidTransition` | 不追加 transition。 |
| rollback target unverifiable | `Blocked` + `ContractGap`/`Unavailable` | 不退回 tag/latest，不复活旧 object。 |
| retire reason missing | `Rejected` + `Missing` | 不改变 entry。 |
| version conflict | `Conflict` | 保留已提交 history，不覆盖并发结果。 |
| duplicate | `DuplicateReplay` | 不重复 retire / rollback。 |

#### 3.12.6 幂等与审计要求

canonical 顺序为 entry_ref、transition_kind、resulting_entry_ref（显式 None）、reason.category/related_ref。reason 文本、transport、actor 时间不进入 identity。审计记录旧 entry、target（如有）、新 transition、local outcome 和 gap；不发送 outbound event。

#### `RollbackOrRetireEntry` 停审记录

| 审查项 | 结论 | 缺口 / 后续 |
|---|---|---|
| rollback 与 retire 是否分开 | `pass` | 同一 DTO 但 action-specific ref 规则显式；不混用。 |
| history / immutable chain 是否保留 | `pass` | 新 transition + entry transition，旧 refs 不删除。 |
| consumer/runtime 是否越界 | `pass` | 不读取或修改 Member Service、container、runtime health。 |
| Step 9 承接 | `pass` | 需展开 exact current read、target guard、append/save、concurrency/replay。 |

### 3.13 Command 协议族停审（8.1）

| 审查项 | 结论 | 证据 / 后续 |
|---|---|---|
| 10 个 command 是否各有 handler、request、response body | `pass` | `DefineImageVariant`、`CaptureAssemblyBaseline`、本节 3.5~3.12 均逐项定义；共享 carrier 位于 §2/§3.1。 |
| DTO 字段是否能回指 Step 6 对象 | `pass_with_pending_owner_refs` | 每字段均列目标对象/来源；positive mapping、component、seed、builder、gate、Artifact、consumer 仍按 MI-UP blocker 保持 pending。 |
| application / domain / port 方向是否一致 | `pass` | handler 只在 application；domain 不知道 DTO；infra 不决定 command 语义。 |
| canonical / duplicate 是否逐 command 闭合 | `pass_with_pending_canonicalizer` | 每 command 已列字段顺序；实际 canonicalizer implementation 留 Step 7/13，不能伪造 digest。 |
| accepted / blocked / unknown 是否阶段化 | `pass` | Buildable、Accepted、Succeeded、Eligible、Available 均只表示窄阶段。 |
| outbound effect 是否被误建模 | `pass` | 所有 effects 使用 `ImageOutboundEventInventory::NoneAuthorized`；无 event/outbox/publisher。 |
| Step 9 承接 | `pass` | 10 条 command 均有独立 flow 入口；下一 Step 才展开函数级调用图与事务顺序。 |

## 4. Query 协议族（8.2）

Query 是严格只读的 application surface。Query 可以读取已经提交的 local truth 或既有 projection，并将 stale、rebuilding、unavailable、empty 与 gap 作为可测试的 `ImageQuerySurface` 状态返回；它不会创建 projection、刷新 external snapshot、reserve 幂等键、改写 history 或调用 Member Service / builder / registry 的写接口。所有 HLD `*Query` 名称与本步 Rust `*Request` 一对一对应，外部 route/RPC 保持未绑定。

### 4.1 Query shared secondary types

```rust
/// Selects either one local intent or the complete trace scope of a variant.
pub enum ImageBuildTraceSelector {
    /// Read one exact build-intent chain.
    Intent(BuildIntentRef),
    /// Read persisted build chains belonging to one variant.
    Variant(ImageVariantDefinitionRef),
}

/// Selects an optional local consumer contract context for entry resolution.
pub struct ImageConsumerResolutionContext {
    /// Member Service contract ref when formally supplied; None keeps the query gap-visible.
    pub consumer_contract_ref: Option<ConsumerContractRef>,
}

/// Safe summary of one immutable component pin; no component manifest or binary body.
pub struct ImageComponentPinView {
    /// Assembly slot mapped from the local component slot enum.
    pub slot: ImageProtocolComponentSlot,
    /// Owner-supplied immutable release ref.
    pub release_ref: ComponentReleaseRef,
    /// Optional owner compatibility conclusion ref.
    pub compatibility_ref: Option<CompatibilityConclusionRef>,
    /// Local safe disposition for this pin.
    pub disposition: SafeDisposition,
}

/// Safe summary of one static seed placement; no template body or filesystem path.
pub struct ImageSeedPlacementView {
    /// Static template ref.
    pub template_ref: SeedTemplateRef,
    /// Declared static seed class.
    pub seed_kind: StaticSeedKind,
    /// Declared image-layer placement class.
    pub placement_kind: StaticPlacementKind,
    /// Local validity mapped to a protocol state.
    pub state: ImageReferenceState,
    /// Safe reason when the binding is not valid.
    pub reason: Option<SafeReason>,
}

/// Public summary of one persisted variant definition and its current revision pointer.
pub struct ImageVariantDefinitionView {
    /// Exact local variant ref.
    pub variant_ref: ImageVariantDefinitionRef,
    /// Owning local family ref.
    pub family_ref: ImageFamilyDefinitionRef,
    /// Safe persona label.
    pub persona_label: NonEmptyText,
    /// Definition lifecycle mapped to protocol state.
    pub definition_state: ImageDefinitionState,
    /// Current revision ref, if one is explicitly linked.
    pub current_revision_ref: Option<VariantRevisionRef>,
    /// Current revision state when the linked revision exists and is readable.
    pub current_revision_state: Option<ImageRevisionState>,
    /// Body-free mapping snapshot ref used by this definition.
    pub mapping_snapshot_ref: MappingSourceSnapshotRef,
}

/// Public summary of an immutable assembly derivation.
pub struct ImageAssemblyDerivationView {
    /// Exact revision ref being explained.
    pub revision_ref: VariantRevisionRef,
    /// Variant that owns the revision.
    pub variant_ref: ImageVariantDefinitionRef,
    /// Revision lifecycle.
    pub revision_state: ImageRevisionState,
    /// Baseline used by the revision.
    pub baseline_ref: AssemblyBaselineRef,
    /// Baseline completeness state.
    pub baseline_state: ImageBaselineState,
    /// Mapping snapshot ref.
    pub mapping_snapshot_ref: MappingSourceSnapshotRef,
    /// Immutable component pins used by the baseline.
    pub component_pins: Vec<ImageComponentPinView>,
    /// Static template bindings used by the baseline.
    pub seed_bindings: Vec<ImageSeedPlacementView>,
    /// Immutable base-image ref.
    pub base_image_ref: BaseImageRef,
    /// Safe derivation reason; no source body.
    pub derivation_reason: SafeReason,
}

/// One persisted build-intent summary in a trace response.
pub struct ImageBuildIntentView {
    /// Intent ref.
    pub intent_ref: BuildIntentRef,
    /// Revision ref.
    pub revision_ref: VariantRevisionRef,
    /// Trigger kind and body-free trigger ref.
    pub trigger_kind: BuildTriggerKind,
    /// Body-free trigger identity paired with `trigger_kind`; never an event body or scheduler run id.
    pub trigger_ref: OpaqueReference,
    /// Local intent state.
    pub state: ImageIntentState,
    /// Safe negative reason, if present.
    pub reason: Option<SafeReason>,
}

/// One persisted attempt/outcome/candidate summary in a build trace.
pub struct ImageBuildAttemptView {
    /// Attempt ref.
    pub attempt_ref: BuildAttemptRef,
    /// Parent intent ref.
    pub intent_ref: BuildIntentRef,
    /// Frozen snapshot ref.
    pub snapshot_ref: BuildInputSnapshotRef,
    /// Local attempt state.
    pub state: ImageAttemptState,
    /// Outcome ref, if one was recorded.
    pub outcome_ref: Option<BuildOutcomeConclusionRef>,
    /// Candidate ref, if formation succeeded.
    pub candidate_ref: Option<CandidateImageRef>,
    /// Safe reason for failed/unknown lanes.
    pub reason: Option<SafeReason>,
}

/// Read-only build trace aggregation; it never acts as build truth.
pub struct ImageBuildTraceView {
    /// Selector echoed from the request.
    pub selector: ImageBuildTraceSelector,
    /// Persisted intents in stable repository order.
    pub intents: Vec<ImageBuildIntentView>,
    /// Persisted attempts in stable repository order.
    pub attempts: Vec<ImageBuildAttemptView>,
    /// Whether the selected scope contains a formed candidate.
    pub formed_candidate_refs: Vec<CandidateImageRef>,
}

/// Public provenance and eligibility summary for one candidate.
pub struct ImageProvenanceEligibilityView {
    /// Candidate ref.
    pub candidate_ref: CandidateImageRef,
    /// Provenance binding ref and state.
    pub provenance_ref: ProvenanceBindingRef,
    /// Explicit protocol mapping of the persisted provenance lifecycle.
    pub provenance_state: ImageProvenanceState,
    /// Gate evaluation ref and state.
    pub gate_evaluation_ref: GateEvaluationRef,
    /// Explicit protocol mapping of the persisted gate-evaluation lifecycle.
    pub gate_state: ImageGateState,
    /// Image-local eligibility decision ref and state.
    pub eligibility_ref: EligibilityDecisionRef,
    /// Explicit protocol mapping of the persisted image-local eligibility lifecycle.
    pub eligibility_state: ImageEligibilityState,
    /// Body-free source and conclusion refs used in the chain.
    pub source_refs: ImagePublicLocalRefSet,
    /// Safe reason for a non-positive state.
    pub reason: Option<SafeReason>,
}

/// Public local supply entry summary; consumer status remains a separate gap surface.
pub struct ImageInstantiableEntryView {
    /// Local entry ref.
    pub entry_ref: InstantiableEntryRef,
    /// Variant and candidate chain.
    pub variant_ref: ImageVariantDefinitionRef,
    /// Candidate pinned by this local entry.
    pub candidate_ref: CandidateImageRef,
    /// Image-local eligibility decision required by this entry.
    pub eligibility_ref: EligibilityDecisionRef,
    /// Provenance binding required by this entry.
    pub provenance_ref: ProvenanceBindingRef,
    /// Immutable image ref only.
    pub image_ref: ImmutableImageRef,
    /// Local entry lifecycle.
    pub state: ImageEntryState,
    /// Availability history ref, if linked.
    pub availability_transition_ref: Option<AvailabilityTransitionRef>,
}

/// Query result for resolving a local entry under a still-pending consumer boundary.
pub struct ImageInstantiableEntryResolutionView {
    /// Local entry, if one is locally available/readable.
    pub entry: Option<ImageInstantiableEntryView>,
    /// Consumer gap, when Member Service contract or confirmation is not closed.
    pub consumer_gap_ref: Option<ConsumerHandoffGapRef>,
    /// Local disposition; it never means instance launch or health.
    pub disposition: SafeDisposition,
}

/// One item in the local available-variant catalog.
pub struct ImageAvailableVariantItem {
    /// Variant ref and safe label.
    pub variant_ref: ImageVariantDefinitionRef,
    /// Safe local persona label; it is not a RoleDefinition body.
    pub persona_label: NonEmptyText,
    /// Current local entry and immutable image refs.
    pub entry_ref: InstantiableEntryRef,
    /// Immutable image identity pinned by the local entry; never a mutable tag.
    pub image_ref: ImmutableImageRef,
    /// Local availability state, always narrow to this catalog.
    pub entry_state: ImageEntryState,
}

/// One append-only availability transition item.
pub struct ImageAvailabilityHistoryItem {
    /// Transition and variant refs.
    pub transition_ref: AvailabilityTransitionRef,
    /// Variant scope of this append-only transition.
    pub variant_ref: ImageVariantDefinitionRef,
    /// Action and local state.
    pub transition_kind: AvailabilityTransitionKind,
    /// Explicit protocol mapping of the transition lifecycle.
    pub state: ImageAvailabilityTransitionState,
    /// Candidate/prior/resulting refs are deliberately optional by action.
    pub candidate_ref: Option<CandidateImageRef>,
    /// Prior local entry when required by the transition action.
    pub prior_entry_ref: Option<InstantiableEntryRef>,
    /// Resulting local entry when required by the transition action.
    pub resulting_entry_ref: Option<InstantiableEntryRef>,
    /// Safe explanation for non-committed or exceptional history context.
    pub reason: Option<SafeReason>,
}

/// One explain-only image trace item.
pub struct ImageTraceViewItem {
    /// Trace record ref.
    pub trace_ref: ImageTraceRecordRef,
    /// Local subject being explained.
    pub subject_ref: LocalObjectRef,
    /// Explicit local and body-free external source refs; neither class is coerced into the other.
    pub source_refs: ImageTraceSourceView,
    /// Safe reason and local record time.
    pub reason: SafeReason,
    /// Local append time of this trace record; it is not an external execution time.
    pub recorded_at: UtcTimestamp,
}

/// Body-free external source ref shown in an explain-only trace view.
pub struct ImageTraceExternalSourceView {
    /// Owner-qualified opaque source ref; no external source body is included.
    pub source_ref: OpaqueReference,
}

/// The two source classes in a public trace item remain explicit.
pub struct ImageTraceSourceView {
    /// Local source refs, sorted and deduplicated by local object kind and ID.
    pub local_refs: ImagePublicLocalRefSet,
    /// External body-free source refs, sorted and deduplicated by owner/kind/identity/revision.
    pub external_refs: Vec<ImageTraceExternalSourceView>,
}

/// Query selector for the projection-freshness lookup.
pub struct ImageProjectionFreshnessQuerySelector {
    /// Public projection family.
    pub projection_kind: ImageProtocolProjectionKind,
    /// Optional variant scope.
    pub variant_ref: Option<ImageVariantDefinitionRef>,
}
```

| 二级类型 | 归属 / 来源 | 约束 |
|---|---|---|
| `Image*View` | 本仓 `contracts` protocol carrier | 只含 typed local/external refs、mapped state、safe reason；不含 domain-only enum 或 owner body。 |
| `ImageBuildTraceSelector` | Query protocol selector | `Intent` 与 `Variant` 是不同 canonical selector；不可从一个 ref 猜另一个。 |
| `ImageInstantiableEntryResolutionView` | Supply query response | entry local availability 与 consumer gap 同时可见；不把 `consumer_gap_ref=None` 当 confirmation。 |
| `ImageBoundaryGapViewItem` | Gap query response | contract 与 consumer handoff 各有独立 field/lifecycle schema；不以 optional 字段或错误 state mapper 混装。 |
| `ImageTraceSourceView` | Trace query response | local/external sources 分型；external `OpaqueReference` 不可强转为 `LocalObjectRef`。 |
| `ImageProjectionFreshnessQuerySelector` | Projection query selector | 映射到 Step 7 `ImageProjectionLookupKey`；不把 query 名、route 或 cursor 当 key。 |

### 4.2 `GetImageVariantDefinition`

#### 4.2.1 用途

读取单个 variant 的已提交定义、family 关系、mapping snapshot ref 和当前 revision 指针。此 query 不加载 Method Library mapping body、不刷新 snapshot，也不把 `Resolved` 或 `Buildable` 解释为可用镜像。

#### 4.2.2 函数签名 / 路由

| 项 | 内容 |
|---|---|
| 函数签名 | `handle_get_image_variant_definition(ImageQueryRequest<GetImageVariantDefinitionRequest>) -> Result<ImageQueryResponse<ImageVariantDefinitionView>, ImageProtocolError>` |
| HTTP / RPC 名称 | 未定义；logical query `GetImageVariantDefinition`。 |
| 调用方 | `api` logical read entry。 |
| 处理方 | `application::query_service`，只读 `DefinitionAssemblyRepositoryPort` 与 `ReferenceDerivedRepositoryPort`。 |
| repository key | `ImageVariantDefinitionRef` exact lookup；若需 revision，使用已提交 `current_revision_ref` exact lookup。 |

#### 4.2.3 请求 schema

```rust
/// GetImageVariantDefinition 的请求 body。
pub struct GetImageVariantDefinitionRequest {
    /// 要读取的 exact local variant ref。
    pub variant_ref: ImageVariantDefinitionRef,
}
```

| 输入字段 | 类型 | 读取目标 | 缺失 / degraded |
|---|---|---|---|
| `variant_ref` | `ImageVariantDefinitionRef` | `get_variant_with_version` | missing=`Empty`（仅当 read scope 已明确）；wrong kind=`ContractViolation`。 |
| `context.read_scope_ref` | `Option<LocalObjectRef>` | application visibility boundary | 需要 scope 但未能确认=`Unavailable` + gap；不得伪造 not-visible。 |
| `context.freshness_preference` | `ImageFreshnessPreference` | 仅影响既有 projection 是否可接受 | 此 direct truth query 通常 `freshness=None`；`RequireFresh` 不触发 rebuild。 |

#### 4.2.4 响应 schema与构造闭环

`ImageVariantDefinitionView` 由 exact variant truth 构造；如果 current revision ref 存在但 revision 不可读，仍返回 definition body 与 `surface.status=Gap/Unavailable`，不从 revision history 猜当前 revision。

| response 字段 | 来源 | 禁止替代 |
|---|---|---|
| `variant_ref` / `family_ref` | loaded variant typed refs | 不从 label 或 mapping ref 拼接。 |
| `persona_label` | variant local field | 不回传 RoleDefinition/persona body。 |
| `definition_state` | explicit domain→protocol mapper | 不以 `Available` 或 global ready 替代。 |
| `current_revision_state` | exact linked revision read | missing pointer保持 `None`，不取 history 最新项。 |
| `surface.view_ref` | 仅当 projection view 已存在时返回 | query 不 mint 新 view ref。 |

#### 4.2.5 错误映射

| 条件 | surface / error |
|---|---|
| exact variant missing | `Visible + Empty` 或 scope 不明确时 `Unavailable`；不泄漏授权判断。 |
| revision pointer broken | `Gap` + `ContractViolation`；不修复 pointer。 |
| projection freshness missing | direct truth body 可返回且 `freshness=None`；若请求 `RequireFresh` 则 `Unavailable`。 |
| repository unavailable | `Unavailable` + safe reason。 |

#### 4.2.6 幂等与审计要求

Query 不使用 `ImageWriteMetadata.idempotency_key`，不 reserve、不保存 replay、不追加 trace。若入口需要审计读取，可在既有 read context 中记录安全访问诊断，但不得把其变成 domain trace 或写入 truth。

#### `GetImageVariantDefinition` 停审记录

| 审查项 | 结论 | 缺口 / 后续 |
|---|---|---|
| HLD→DDD 名称映射 | `pass` | HLD query 与本请求/response 一对一。 |
| DTO→对象 / port | `pass` | exact variant/revision repository read；不访问 external body。 |
| degraded surface | `pass` | Empty、Unavailable、Gap、freshness=None 语义明确。 |
| Step 9 承接 | `pass` | 需展开只读 context、exact loads、mapper 与 surface 规则。 |

### 4.3 `GetAssemblyDerivation`

#### 4.3.1 用途

读取一个 revision 绑定的不可变 assembly baseline、mapping snapshot、component pins、静态 seed placements 和 base image ref，用于解释“构建输入来自哪里”。响应只回传 ref、静态类别、状态和安全原因，不回传模板正文、组件 manifest、运行时 live state 或 workspace mount。

#### 4.3.2 函数签名 / 路由

| 项 | 内容 |
|---|---|
| 函数签名 | `handle_get_assembly_derivation(ImageQueryRequest<GetAssemblyDerivationRequest>) -> Result<ImageQueryResponse<ImageAssemblyDerivationView>, ImageProtocolError>` |
| HTTP / RPC 名称 | 未定义；logical query `GetAssemblyDerivation`。 |
| 调用方 | `api` logical read entry。 |
| 处理方 | `application::query_service`，只读 `DefinitionAssemblyRepositoryPort` 与 `ReferenceDerivedRepositoryPort`。 |
| repository key | `VariantRevisionRef` exact read，再按 `baseline_ref` exact read。 |

#### 4.3.3 请求 schema

```rust
/// GetAssemblyDerivation 的请求 body。
pub struct GetAssemblyDerivationRequest {
    /// 要解释的 exact revision ref。
    pub revision_ref: VariantRevisionRef,
}
```

| 输入字段 | 类型 | 读取目标 | 缺失 / degraded |
|---|---|---|---|
| `revision_ref` | `VariantRevisionRef` | `get_revision_with_version` | missing=`Empty`；wrong kind=`ContractViolation`。 |
| revision.baseline_ref | `AssemblyBaselineRef` | `get_baseline_with_version` | missing=`Gap`；不从 variant current pointer 补 baseline。 |
| context freshness | shared query context | 若有既有 derivation projection则读取 marker | stale/rebuilding/unavailable 显式返回；不启动 rebuild。 |

#### 4.3.4 响应 schema与构造闭环

component pins 映射为 `ImageComponentPinView`，seed bindings 映射为 `ImageSeedPlacementView`；每一项保留 explicit slot/kind/placement 与 validity。`ImageAssemblyDerivationView.revision_state` 与 `baseline_state` 分别由各自 domain lifecycle 映射，不能合并成一个“build ready”字段。

| 字段 | 来源 | 缺失处理 / 禁止混同 |
|---|---|---|
| `component_pins` | baseline.component_pins | 缺 slot 保持空/不完整并带 surface gap；不默认补 runtime/tools/member/supervisor。 |
| `seed_bindings` | baseline.seed_bindings | 空集合不等无 seed requirement；以 baseline state/reason 说明。 |
| `base_image_ref` | baseline local field | 只回传 body-free ref；不展示 tag/latest。 |
| `derivation_reason` | revision.derivation_reason | 使用 Step 6 `SafeReason`；不重新生成 HLD `DerivationRecordRef`。 |

#### 4.3.5 错误映射

| 条件 | surface / error |
|---|---|
| revision/baseline missing | `Empty` 或 `Gap` + `Missing`。 |
| baseline incomplete/conflict | body 可返回但 `status=Gap`/`Stale`，并保留 mapped state/reason；不改写 baseline。 |
| owner static ref unavailable | `Unavailable`/`Gap`；不加载 owner body。 |

#### 4.3.6 幂等与审计要求

只读 exact refs 与 page-less body；不使用写幂等键、不保存 replay、不追加 trace。请求 selector canonical 仅用于诊断，不可作为 command replay identity。

#### `GetAssemblyDerivation` 停审记录

| 审查项 | 结论 | 缺口 / 后续 |
|---|---|---|
| static/live 分离 | `pass` | view 只含 refs、种类、placement、状态。 |
| revision/baseline 关系 | `pass` | exact baseline ref 是唯一来源，不从 history 猜补。 |
| Step 9 承接 | `pass` | exact revision→baseline→mapper→surface。 |

### 4.4 `GetBuildTrace`

#### 4.4.1 用途

以一个 intent 或 variant 为 selector 读取已持久化的 build intent、attempt、outcome 与 candidate 关联摘要。该 query 不调用 builder/registry inspect，不重新计算 outcome，不把 trace 中的 `Succeeded` 或 `Formed` 升格为 eligibility / availability。

#### 4.4.2 函数签名 / 路由

| 项 | 内容 |
|---|---|
| 函数签名 | `handle_get_build_trace(ImageQueryRequest<GetBuildTraceRequest>) -> Result<ImageQueryResponse<ImageBuildTraceView>, ImageProtocolError>` |
| HTTP / RPC 名称 | 未定义；logical query `GetBuildTrace`。 |
| 调用方 | `api` logical read entry。 |
| 处理方 | `application::query_service`，只读 `BuildCandidateRepositoryPort`、`DefinitionAssemblyRepositoryPort`、`ReferenceDerivedRepositoryPort`。 |
| repository key | `Intent` 使用 intent exact + attempts list；`Variant` 使用 revision list 后的 intent/attempt history。 |

#### 4.4.3 请求 schema

```rust
/// GetBuildTrace 的请求 body。
pub struct GetBuildTraceRequest {
    /// 选择一个 intent chain 或一个 variant scope。
    pub selector: ImageBuildTraceSelector,
}
```

| 输入字段 | 类型 | 读取目标 | 缺失 / degraded |
|---|---|---|---|
| `selector` | `ImageBuildTraceSelector` | exact/list repository reads | exact missing=`Empty`；wrong kind=`ContractViolation`。 |
| `context.read_scope_ref` | `Option<LocalObjectRef>` | read visibility boundary | 未能确认所需 scope=`Unavailable` + gap。 |
| `context.freshness_preference` | `ImageFreshnessPreference` | existing BuildTrace projection marker | RequireFresh 无 Fresh marker=`Unavailable`，不 rebuild。 |

#### 4.4.4 响应 schema与构造闭环

`ImageBuildIntentView` 从 `BuildIntent` 映射；`ImageBuildAttemptView` 由 attempt exact/history 与 outcome/candidate lookup 构造。outcome 的 execution ref 只在需要解释时以 body-free `OpaqueReference` 形式保留，不返回 execution body、log、report 或 digest。

| response 字段 | 来源 | 规则 |
|---|---|---|
| `intents` | `get_intent_with_version` / `list_intents_by_revision` | 按 repository 声明顺序；空列表仅表示选定 scope 无记录。 |
| `attempts` | `list_attempts_by_intent` | 保留 failed/unknown 历史；不隐藏 unknown。 |
| `formed_candidate_refs` | `find_candidate_by_attempt_with_version` | 只列已持久化 Formed candidate；不从 output ref 猜补。 |
| `surface.freshness` | existing BuildTrace projection marker（若被使用） | 直接 truth read 可为 `None`。 |

#### 4.4.5 错误映射

| 条件 | surface / error |
|---|---|
| no persisted chain | `Visible + Empty`（scope 明确）或 `Unavailable`（scope 不明）。 |
| attempt/outcome relation broken | `Gap` + `ContractViolation`；仍可返回可安全读取的其它 items。 |
| repository unavailable | `Unavailable`；不从 adapter 重查。 |

#### 4.4.6 幂等与审计要求

Query 不使用 idempotency，不重跑 builder/registry，不创建 outcome/candidate，不追加 trace。selector 的 variant/intent 语义必须保持在 response 中，避免 consumer 将 variant page 当单一 intent。

#### `GetBuildTrace` 停审记录

| 审查项 | 结论 | 缺口 / 后续 |
|---|---|---|
| intent/attempt/outcome/candidate 分离 | `pass` | 各自有独立 view 与 refs。 |
| unknown/stale surface | `pass` | unknown 保留，projection freshness 可为 Stale/Unavailable。 |
| Step 9 承接 | `pass` | selector→repository reads→mappers→surface。 |

### 4.5 `GetProvenanceAndEligibility`

#### 4.5.1 用途

读取 candidate 的 provenance binding、gate evaluation 与 image-local eligibility decision。Query 只展示已提交的安全 refs、状态和原因，不向 Governance 查询 gate inventory，不读 evidence body，不触发重新评估。

#### 4.5.2 函数签名 / 路由

| 项 | 内容 |
|---|---|
| 函数签名 | `handle_get_provenance_and_eligibility(ImageQueryRequest<GetProvenanceAndEligibilityRequest>) -> Result<ImageQueryResponse<ImageProvenanceEligibilityView>, ImageProtocolError>` |
| HTTP / RPC 名称 | 未定义；logical query `GetProvenanceAndEligibility`。 |
| 调用方 | `api` logical read entry。 |
| 处理方 | `application::query_service`，只读 `BuildCandidateRepositoryPort` 与 `QualificationRepositoryPort`。 |
| repository key | `CandidateImageRef` exact；随后 exact/current qualification lookups。 |

#### 4.5.3 请求 schema

```rust
/// GetProvenanceAndEligibility 的请求 body。
pub struct GetProvenanceAndEligibilityRequest {
    /// 要读取的 formed 或历史 candidate。
    pub candidate_ref: CandidateImageRef,
}
```

| 输入字段 | 类型 | 读取目标 | 缺失 / degraded |
|---|---|---|---|
| `candidate_ref` | `CandidateImageRef` | candidate exact + qualification history | missing=`Empty`；wrong kind=`ContractViolation`。 |
| qualification current refs | local relation | exact provenance/evaluation/eligibility | 缺任一链=`Gap`；不从 gate status 猜 eligibility。 |

#### 4.5.4 响应 schema与构造闭环

`source_refs` 由已持久化 provenance source bindings 的 local refs 映射到 `ImagePublicLocalRefSet`；external refs 只在 `SafeReason` 或 trace surface 中保持 body-free，不被伪装为 local object ref。`Eligible` 仅是 image-domain qualification 状态。

| 字段 | 来源 | 约束 |
|---|---|---|
| `provenance_state` | `ProvenanceBinding.lifecycle` mapper | Complete 不等 gate pass。 |
| `gate_state` | `GateEvaluation.lifecycle` mapper | 不枚举 gate inventory；Q-MI-004 gap 可见。 |
| `eligibility_state` | `EligibilityDecision.lifecycle` mapper | 不等 Artifact accepted/Available。 |
| `reason` | 当前非正向对象 reason | 不补空文本，不返回 evidence body。 |

#### 4.5.5 错误映射

| 条件 | surface / error |
|---|---|
| candidate exists but no qualification chain | `Gap` + `Missing`，body 可为空或保守 partial 不得伪造 complete。 |
| gate/evidence owner unavailable | `Unavailable`/`Gap`；query 不重评估。 |
| relation conflict | `Gap` + `Conflict`；不选择任一历史项。 |

#### 4.5.6 幂等与审计要求

Query strictly read-only；不写 decision、不 reserve、不调用 qualification adapter。selector/candidate ref 只用于读取，不进入 stored result。

#### `GetProvenanceAndEligibility` 停审记录

| 审查项 | 结论 | 缺口 / 后续 |
|---|---|---|
| qualification chain 完整性 | `pass_with_pending_gate_owner` | 本地 refs/state 完整；Q-MI-004 owner inventory pending。 |
| Eligibility 与 supply 分离 | `pass` | response 不含 entry/consumer success。 |
| Step 9 承接 | `pass` | candidate→provenance/gate/eligibility exact reads。 |

### 4.6 `ResolveInstantiableEntry`

#### 4.6.1 用途

读取一个 variant 的本仓 current pinned entry，并在需要 Member Service 合同时同时暴露 consumer handoff gap。当前 `MI-UP-001` 未闭口时，query 的 positive consumer resolution 不可构造；local entry `Available` 仍可作为窄的 supply 事实返回，但不代表实例、容器、workspace、launch 或 health。

#### 4.6.2 函数签名 / 路由

| 项 | 内容 |
|---|---|
| 函数签名 | `handle_resolve_instantiable_entry(ImageQueryRequest<ResolveInstantiableEntryRequest>) -> Result<ImageQueryResponse<ImageInstantiableEntryResolutionView>, ImageProtocolError>` |
| HTTP / RPC 名称 | 未定义；logical query `ResolveInstantiableEntry`。 |
| 调用方 | `api` 或 future Member Service consumer read caller；consumer contract 未绑定。 |
| 处理方 | `application::query_service` / `AvailabilityCoordinator` read facade，只读 supply/gap/projection ports。 |
| repository key | `ImageVariantDefinitionRef` + optional consumer contract ref（仅作为显式上下文，不作 local lookup key）。 |

#### 4.6.3 请求 schema

```rust
/// ResolveInstantiableEntry 的请求 body。
pub struct ResolveInstantiableEntryRequest {
    /// 要解析的 variant。
    pub variant_ref: ImageVariantDefinitionRef,
    /// 可选的 Member Service contract context；当前缺失不自动推导。
    pub consumer: ImageConsumerResolutionContext,
}
```

| 输入字段 | 类型 | 读取 / 边界 | 缺失处理 |
|---|---|---|---|
| `variant_ref` | `ImageVariantDefinitionRef` | `find_current_entry_by_variant_with_version` | missing=`Empty` 或 scope 不明=`Unavailable`。 |
| `consumer.consumer_contract_ref` | `Option<ConsumerContractRef>` | 仅传给 consumer gap/read seam | `None` 在 MI-UP-001 下形成 `ConsumerHandoffGap::Open`；不从 Member Service draft 猜 ref。 |
| freshness preference | shared query context | existing SupplyCatalog marker | stale 可读但必须标 marker；RequireFresh 无 fresh=`Unavailable`。 |

#### 4.6.4 响应 schema与构造闭环

| 字段 | 来源 | 构造规则 |
|---|---|---|
| `entry` | exact current local entry | 仅 `Available`/可读 entry 映射；不由 latest history/tag 生成。 |
| `consumer_gap_ref` | exact/list consumer gap | `Open`/`Stale` 保持可见；当前不得 `Resolved`。 |
| `disposition` | local entry/gap assessment | `VerifiedUsable` 只表示 declared local supply/consumer seam 的窄条件；不等 launch/health。 |
| `surface.status` | query read state | 有 gap 时为 `Gap`；无 entry 且 scope明确才为 `Empty`。 |

#### 4.6.5 错误映射

| 条件 | surface / error |
|---|---|
| current entry absent | `Visible + Empty`（scope 明确）或 `Unavailable`；不伪造 consumer not-found。 |
| consumer contract/schema pending | body 可含 local entry，但 `status=Gap` 且 `consumer_gap_ref=Some`；不返回 Resolved。 |
| local supply repository unavailable | `Unavailable` + safe reason。 |
| relation wrong kind | `ContractViolation`。 |

#### 4.6.6 幂等与审计要求

Query 不使用写幂等，不调用 `MemberServiceSupplyPort` 的写/resolve 操作，不创建 gap；若缺 gap 且需要显示 pending，创建 gap 属于写操作，必须由既有 reconciliation/command 先行，query 只能返回 `Gap`/unavailable marker，不能在查询中 mint gap。

#### `ResolveInstantiableEntry` 停审记录

| 审查项 | 结论 | 缺口 / 后续 |
|---|---|---|
| local entry 与 consumer gap 分离 | `pass` | response 同时承载 entry 与 typed consumer gap。 |
| MI-UP-001 处理 | `pass_with_blocker` | no positive confirmation/resolution; query 不写 gap。 |
| Step 9 承接 | `pass` | exact entry/gap reads、surface mapping、no-write assertion。 |

### 4.7 `ListAvailableVariants`

#### 4.7.1 用途

返回本仓已提交且处于 local `Available` 的 pinned entries 列表。它只表达 local supply catalog，不表达 Member Service 可实例化、container 健康、registry online 或整体 readiness。

#### 4.7.2 函数签名 / 路由

| 项 | 内容 |
|---|---|
| 函数签名 | `handle_list_available_variants(ImageQueryRequest<ListAvailableVariantsRequest>) -> Result<ImageQueryPageResponse<ImageAvailableVariantItem>, ImageProtocolError>` |
| HTTP / RPC 名称 | 未定义；logical query `ListAvailableVariants`。 |
| 调用方 | `api` logical read entry。 |
| 处理方 | `application::query_service`，只读 `SupplyEntryRepositoryPort`、`DefinitionAssemblyRepositoryPort` 与 `ImageProjectionRepositoryPort`。 |
| repository key | `list_available_entries(page)`；variant label 通过 exact variant reads 映射，不从 tag 推导。 |

#### 4.7.3 请求 schema

```rust
/// ListAvailableVariants 的请求 body。
pub struct ListAvailableVariantsRequest {
    /// Public page cursor；第一页为 None。
    pub page_cursor: Option<ImagePublicPageCursor>,
    /// 请求的最多条目数；最终上限由 config/implementation step 约束。
    pub limit: u32,
}
```

| 输入字段 | 类型 | 读取目标 | 缺失 / degraded |
|---|---|---|---|
| `page_cursor` | `Option<ImagePublicPageCursor>` | mapper 转 `ImageRepositoryCursor` | malformed=`ContractViolation`；不把 cursor 当 version。 |
| `limit` | `u32` | application page guard | 0/超限=`ContractViolation`；具体上限留 Step 14。 |
| `context.freshness_preference` | `ImageFreshnessPreference` | SupplyCatalog marker | stale allowed 时返回既有 page + marker；RequireFresh 无 fresh=`Unavailable`。 |

#### 4.7.4 响应 schema与构造闭环

`ImageRepositoryPage<Versioned<InstantiableEntry>>` 经 application mapper 生成 `ImageQueryPageResponse<ImageAvailableVariantItem>`；`next_after` 只映射为 opaque `ImagePublicPageCursor`。items 只包含 local `Available` entries，按 variant ref、entry ref 稳定排序。

| 字段 | 来源 | 规则 |
|---|---|---|
| `variant_ref` / `persona_label` | entry.variant_ref + exact variant read | exact relation mismatch=`Gap`，不以 entry id 反查。 |
| `entry_ref` / `image_ref` | entry local truth | image ref 必须 immutable typed ref；不显示 mutable tag。 |
| `entry_state` | entry lifecycle mapper | 过滤条件是 local Available，不等 consumer ready。 |
| `page_info` | repository page mapper | `has_more == next_cursor.is_some()`；internal cursor 不泄漏。 |

#### 4.7.5 错误映射

| 条件 | surface / error |
|---|---|
| no available entries | `Visible + Empty` + empty page（scope 明确）。 |
| one entry relation invalid | `Gap`；可返回其它安全 items，不把坏行当 available。 |
| projection stale/rebuilding | page 可读但 freshness marker 显式；不重建。 |

#### 4.7.6 幂等与审计要求

Query 不 reserve、不保存 page result、不修改 entry/history。cursor 仅是读取位置，不进入 command canonical identity。

#### `ListAvailableVariants` 停审记录

| 审查项 | 结论 | 缺口 / 后续 |
|---|---|---|
| page helper 映射 | `pass` | internal `ImageRepositoryPage`→public cursor/page info 已明确。 |
| local availability 语义 | `pass` | 不推导 consumer/container readiness。 |
| Step 9 承接 | `pass` | page mapping、exact variant label reads、freshness surface。 |

### 4.8 `GetAvailabilityHistory`

#### 4.8.1 用途

读取一个 variant 的 append-only availability transition history，保留 proposed、committed、rejected、superseded 等本仓记录。Query 不重排、删除或修复 history，也不把最后一条记录自动解释为 current entry。

#### 4.8.2 函数签名 / 路由

| 项 | 内容 |
|---|---|
| 函数签名 | `handle_get_availability_history(ImageQueryRequest<GetAvailabilityHistoryRequest>) -> Result<ImageQueryPageResponse<ImageAvailabilityHistoryItem>, ImageProtocolError>` |
| HTTP / RPC 名称 | 未定义；logical query `GetAvailabilityHistory`。 |
| 调用方 | `api` logical read entry。 |
| 处理方 | `application::query_service`，只读 `SupplyEntryRepositoryPort`。 |
| repository key | `variant_ref` + internal page request；排序由 port 声明的 proposed_at/transition id。 |

#### 4.8.3 请求 schema

```rust
/// GetAvailabilityHistory 的请求 body。
pub struct GetAvailabilityHistoryRequest {
    /// Variant scope。
    pub variant_ref: ImageVariantDefinitionRef,
    /// Public page cursor。
    pub page_cursor: Option<ImagePublicPageCursor>,
    /// Page limit。
    pub limit: u32,
}
```

#### 4.8.4 响应 schema与构造闭环

每一项从 `AvailabilityTransition` exact/history read 映射 `transition_kind`、local state 与 action-specific refs。`reason=None` 只允许在 mapped committed state；invalid object 应返回 `ContractViolation`，不以空 reason 隐藏数据缺陷。

| 字段 | 来源 | 约束 |
|---|---|---|
| `transition_ref`、`variant_ref` | transition local truth | exact typed refs；不得由 page cursor 生成。 |
| `candidate_ref` / `prior_entry_ref` / `resulting_entry_ref` | action-specific optional fields | None 语义按 `AvailabilityTransitionKind` 校验；不能把 None 当 missing silently。 |
| `state` | lifecycle mapper | Committed 只表示本仓 history。 |
| `page_info` | repository page mapper | opaque cursor，不泄漏 internal cursor/version。 |

#### 4.8.5 错误映射

| 条件 | surface / error |
|---|---|
| no history | `Visible + Empty`（variant scope 明确）。 |
| history relation conflict | `Gap` + `Conflict`；不选择 newest。 |
| store unavailable | `Unavailable`。 |

#### 4.8.6 幂等与审计要求

Query 只读；不创建 transition、不修复 current pointer、不保存 replay。分页 selector 不进入 write identity。

#### `GetAvailabilityHistory` 停审记录

| 审查项 | 结论 | 缺口 / 后续 |
|---|---|---|
| append-only history 是否保持 | `pass` | query 只读并保留历史顺序。 |
| action-specific Option 语义 | `pass` | publish/replace/rollback/retire 规则显式。 |
| Step 9 承接 | `pass` | page mapper、state mapper、relation validation。 |

### 4.9 `GetImageTrace`

#### 4.9.1 用途

读取一个 local subject 的 explain-only trace。Trace 是安全来源解释链，不是第二 truth；query 不用 trace 重建缺失 domain 对象，不返回 raw log、manifest、event payload、job report 或 secret。

#### 4.9.2 函数签名 / 路由

| 项 | 内容 |
|---|---|
| 函数签名 | `handle_get_image_trace(ImageQueryRequest<GetImageTraceRequest>) -> Result<ImageQueryPageResponse<ImageTraceViewItem>, ImageProtocolError>` |
| HTTP / RPC 名称 | 未定义；logical query `GetImageTrace`。 |
| 调用方 | `api` logical read entry。 |
| 处理方 | `application::query_service`，只读 `ReferenceDerivedRepositoryPort`。 |
| repository key | `LocalObjectRef` exact subject + internal page request。 |

#### 4.9.3 请求 schema

```rust
/// GetImageTrace 的请求 body。
pub struct GetImageTraceRequest {
    /// 被解释的 exact local subject。
    pub subject_ref: LocalObjectRef,
    /// Public page cursor。
    pub page_cursor: Option<ImagePublicPageCursor>,
    /// Page limit。
    pub limit: u32,
}
```

#### 4.9.4 响应 schema与构造闭环

`list_trace_by_subject` 返回的 `ImageTraceRecord` 逐项映射为 `ImageTraceViewItem`；`source_refs` 必须映射为 §4.1 已定义的 `ImageTraceSourceView`。local source 进入 `local_refs`，external source 进入 `external_refs`；两者都只保留 body-free ref，不能互相强转，也不能把 external source 当作 local subject 查询键。

#### 4.9.5 错误映射

| 条件 | surface / error |
|---|---|
| subject 无 trace | `Visible + Empty`（subject scope 明确）。 |
| trace source kind mismatch | `Gap` + `ContractViolation`；不丢弃或重写 trace。 |
| trace store unavailable | `Unavailable`。 |

#### 4.9.6 幂等与审计要求

Query 不追加 trace、不从 trace 修复 truth、不保存 replay。访问诊断不应与 image trace 混淆。

#### `GetImageTrace` 停审记录

| 审查项 | 结论 | 缺口 / 后续 |
|---|---|---|
| trace 与 truth 分离 | `pass` | trace 只读、explain-only。 |
| external/local source 类型 | `pass_after_field_fix` | `ImageTraceSourceView` 取代混合 local set；见 §4.9.4。 |
| Step 9 承接 | `pass` | subject list→source mapper→page surface。 |

### 4.10 `GetContractGaps`

#### 4.10.1 用途

读取本仓已经记录的跨 owner `ContractGap` 与 Member Service `ConsumerHandoffGap`。该 Query 只解释已提交的 gap，不创建 gap、不调用 owner 重新验证、不关闭 gap，也不把“当前没有读到 gap”解释为所有依赖已闭合。`ContractGap` 与 `ConsumerHandoffGap` 必须在响应中保持两个 typed 分支，不能通过同一可选字段或同一生命周期枚举混装。

#### 4.10.2 函数签名 / 路由

| 项 | 内容 |
|---|---|
| 函数签名 | `handle_get_contract_gaps(ImageQueryRequest<GetContractGapsRequest>) -> Result<ImageQueryPageResponse<ImageBoundaryGapViewItem>, ImageProtocolError>` |
| HTTP / RPC 名称 | 未定义；仅保留 logical query `GetContractGaps`。 |
| 调用方 | `api` logical read entry；诊断工具也必须通过同一只读 facade。 |
| 处理方 | `application::query_service`。 |
| 依赖 port | `ReferenceDerivedRepositoryPort` 的 contract-gap read；`SupplyEntryRepositoryPort` 的 consumer-gap read；不调用外部 resolver。 |
| repository key | `ContractLane` → `list_open_gaps_by_lane(lane, page)`；`ContractBoundary` → `list_gaps_by_boundary(owner, seam_kind, lane, page)`；`ConsumerEntry` → `list_consumer_handoff_gaps(Some(entry_ref), page)`。不接受其它 selector、post-filter 或全局扫描。 |

#### 4.10.3 请求 schema

```rust
/// 选择一个可直接映射到既有 repository read port 的本地 gap 范围；不是外部 owner 扫描指令。
pub enum ImageGapQuerySelector {
    /// 读取一个明确 local decision lane 中的 Open / Blocked contract gap。
    ContractLane {
        /// 唯一的 local decision lane；直接映射 `list_open_gaps_by_lane`。
        lane: DecisionLane,
    },
    /// 读取一个完整 owner / seam / lane 边界中的 contract gap。
    ContractBoundary {
        /// 精确 external truth owner；不得省略。
        owner: ExternalOwnerKind,
        /// 精确 dependency seam kind；不得省略。
        seam_kind: DependencySeamKind,
        /// 精确 local decision lane；不得省略。
        lane: DecisionLane,
    },
    /// 读取一个明确 local entry 下的 consumer-handoff gap。
    ConsumerEntry {
        /// 精确 local entry；直接映射 `list_consumer_handoff_gaps(Some(entry_ref), page)`。
        entry_ref: InstantiableEntryRef,
    },
}

/// GetContractGaps 的请求 body；分页只存在于 body，不复制到 metadata。
pub struct GetContractGapsRequest {
    /// Explicitly bounded contract/consumer gap selector.
    pub selector: ImageGapQuerySelector,
    /// Public opaque page cursor; the first page uses None.
    pub page_cursor: Option<ImagePublicPageCursor>,
    /// Maximum number of local gap items requested by the caller.
    pub limit: u32,
}
```

| 输入字段 | 类型 | 读取目标 / 映射 | 缺失 / degraded |
|---|---|---|---|
| `selector` | `ImageGapQuerySelector` | `ContractLane` 直接映射 `list_open_gaps_by_lane`；`ContractBoundary` 直接映射 `list_gaps_by_boundary`；`ConsumerEntry` 直接映射 `list_consumer_handoff_gaps(Some(entry_ref), page)` | selector 缺失、variant 字段缺失或无法一对一映射既有 read port=`ContractViolation`；不提供 global union、optional filter、`gap_kind` post-filter 或全库扫描。 |
| `page_cursor` | `Option<ImagePublicPageCursor>` | application mapper → `ImageRepositoryCursor` | malformed=`ContractViolation`；不把 cursor 当 gap/version。 |
| `limit` | `u32` | application page guard | `0` 或超过后续配置上限=`ContractViolation`；具体上限留 Step 14。 |
| `context.read_scope_ref` | `Option<LocalObjectRef>` | 只读 visibility boundary | scope 无法确认=`Unavailable` + gap；不伪造 `NotVisible`。 |
| `context.freshness_preference` | `ImageFreshnessPreference` | 仅影响既有 `ContractGapSummary` projection 是否可接受 | RequireFresh 无 Fresh marker=`Unavailable`；Query 不 rebuild、不创建 gap。 |

#### 4.10.4 响应 schema与构造闭环

响应使用 `ImageQueryPageResponse<ImageBoundaryGapViewItem>`。Contract 分支逐项映射为 `ImageContractGapDetailView`：`gap_ref`、`owner`、`seam_kind`、`affected_lane`、`ImageContractGapState`、条件 `resolution_ref` 和 safe `reason` 必须全部来自已提交 local gap。Consumer 分支逐项映射为 `ImageConsumerHandoffGapDetailView`：entry、consumer contract、gap kind、`ImageConsumerGapState`、条件 resolution/confirmation ref 和 reason 不得从 Member Service draft 或 local `Available` entry 猜补。

| surface 条件 | `content_state` / body 规则 |
|---|---|
| 显式 scope 有 gap items 且每项字段完整 | `Present + Complete`；items 非空，`status=Present` 或 projection stale 时 `status=Stale`。 |
| 显式 scope 无 local gap | `Empty + None`；只表示该 local scope 没有已记录条目，不表示 owner contract 已闭合。 |
| 某项 relation 断裂但其余字段安全 | `Gap + Partial`；保留安全 items 与 typed gap refs，不丢弃整页或补默认 lifecycle。 |
| gap index / visibility / projection 不可用 | `Unavailable + None`，items 为空并带安全 gap/error；不得返回空数组伪装 Empty。 |

Contract lifecycle 映射规则：当前 repository 的 active list 只允许返回 `Open` / `Blocked`；`Resolved` / `Expired` 只有在未来提供正式 history read 且 resolution/expiry 字段完整时才可出现在本 Query，不能由“列表中不存在”隐式构造。Consumer lifecycle 当前只允许 `Open` / `Stale`；`Resolved` 仍受 `MI-UP-001` 条件门禁。

#### 4.10.5 错误映射

| 条件 | surface / error |
|---|---|
| selector wrong kind / malformed cursor | `Rejected` 语义的 Query error=`ContractViolation`；不 fallback 到其它 selector。 |
| requested selector 未能一对一映射既有 bounded read port | `ContractViolation`；不执行 fallback、global scan 或 local post-filter。 |
| contract/consumer relation 不一致 | `Gap` + `Conflict` 或 `ContractViolation`；保留可安全读取的其它 items。 |
| repository unavailable | `Unavailable`；不调用外部 owner 代查。 |

#### 4.10.6 幂等与审计要求

Query 不使用 `ImageWriteMetadata.idempotency_key`，不 reserve、不保存 replay、不创建 gap。selector 只用于 read key 与诊断审计；访问审计若后续启用，只记录 query name、safe selector summary 和结果 surface，不记录 owner body、consumer body 或 raw error。

#### `GetContractGaps` 停审记录

| 审查项 | 结论 | 缺口 / 后续 |
|---|---|---|
| Contract / Consumer gap 是否分型 | `pass` | `ImageBoundaryGapViewItem` 两个 typed branch；生命周期不混用。 |
| empty / partial / unavailable 是否可测试 | `pass` | 显式 scope、content state、gap refs 与安全 error 规则已写明。 |
| 不是否在 Query 中创建 gap | `pass` | 只读 existing gap/index；reconciliation 才能写新 context。 |
| Step 9 承接 | `pass` | selector→bounded repository read→branch mapper→page surface。 |

### 4.11 `GetProjectionFreshness`

#### 4.11.1 用途

读取一个已命名 projection key 的现有 freshness marker。该 Query 只读取 `ImageProjectionRepositoryPort` 已保存的 read-model/freshness；不会注册 marker、开始 rebuild、刷新 source、修正 watermark 或把 `Fresh` 升格为业务 readiness。

#### 4.11.2 函数签名 / 路由

| 项 | 内容 |
|---|---|
| 函数签名 | `handle_get_projection_freshness(ImageQueryRequest<GetProjectionFreshnessRequest>) -> Result<ImageQueryResponse<ImageProjectionFreshnessView>, ImageProtocolError>` |
| HTTP / RPC 名称 | 未定义；仅保留 logical query `GetProjectionFreshness`。 |
| 调用方 | `api` logical read entry；rebuild/diagnostic caller 不得绕过 query facade读取私有 marker。 |
| 处理方 | `application::query_service`。 |
| 依赖 port | `ImageProjectionRepositoryPort` 的 key→existing view→freshness read；不调用 `CommittedImageTruthSnapshotPort`。 |
| repository key | `ImageProjectionFreshnessQuerySelector` 显式映射为 Step 7 `ImageProjectionLookupKey`。 |

#### 4.11.3 请求 schema

```rust
/// GetProjectionFreshness 的请求 body。
pub struct GetProjectionFreshnessRequest {
    /// Explicit projection family and optional typed variant scope.
    pub selector: ImageProjectionFreshnessQuerySelector,
}
```

| 输入字段 | 类型 | 读取目标 | 缺失 / degraded |
|---|---|---|---|
| `selector` | `ImageProjectionFreshnessQuerySelector` | `ImageProtocolProjectionKind` → domain `ProjectionKind`，variant ref 保持 exact typed relation | missing/unknown mapping=`ContractViolation`；不从 query name、route 或 cursor 推导 key。 |
| `context.freshness_preference` | `ImageFreshnessPreference` | 只决定是否接受已读到的 marker | `InspectMarker` 允许返回 Rebuilding/Unavailable marker；RequireFresh 读到非 Fresh=`Unavailable`；不 rebuild。 |
| `context.read_scope_ref` | `Option<LocalObjectRef>` | read visibility boundary | scope 不可确认=`Unavailable` + gap。 |

#### 4.11.4 响应 schema与构造闭环

application 先用 selector 找 `ImageProjectionLookupKey`，再调用 `find_read_model_ref_by_key`；只有既有 view ref 存在时，才调用 `find_freshness_by_read_model_with_version` 并映射 `ImageProjectionFreshnessView`。若某实现有独立 marker index，仍必须提供等价的 key→existing marker 映射；不得按 `projection_kind` 或 variant id 临时 mint `ProjectionFreshnessRef`。

| response 字段 | 来源 | 规则 |
|---|---|---|
| `projection_kind` | explicit protocol→domain mapper | 不直接序列化 domain-only `ProjectionKind`。 |
| `freshness_ref` | existing `ProjectionFreshness` local ref | 仅既有 marker 可返回；不存在不造 ref。 |
| `state` | `ProjectionFreshnessLifecycle` 显式映射 | `Fresh/Stale/Rebuilding/Unavailable` 保持原义，不等 candidate/entry/consumer ready。 |
| `source_subject_refs` | marker.source_watermark.committed_subjects | 只返回 committed local refs，稳定排序去重；不返回 source body。 |
| `reason` | marker.reason | non-fresh 状态要求 safe reason；不补空文本。 |
| `surface.projection_key` | request selector mapper | 必须 `Some`；它是 lookup identity，不是 read-model ref。 |

| surface 条件 | `content_state` / body 规则 |
|---|---|
| existing marker 可读 | `Present + Complete`，`body=Some`；`Fresh` / `Stale` 状态照实返回。 |
| marker 存在但处于 Rebuilding 且 `InspectMarker` | `Rebuilding + None`；只返回 marker，`body=None`，不等待 job。 |
| key 无既有 view/marker且 scope 明确 | `Empty + None`；不表示 projection 已 Fresh。 |
| marker/store/visibility 不可用 | `Unavailable + None`，带安全 gap/error；不返回默认 Fresh。 |

#### 4.11.5 错误映射

| 条件 | surface / error |
|---|---|
| projection kind / variant relation wrong | `ContractViolation`；不改写 selector。 |
| RequireFresh 但 marker 为 Stale/Rebuilding/Unavailable | `Unavailable` + safe reason；不触发 rebuild。 |
| existing view 与 freshness relation 断裂 | `Gap` + `ContractViolation`；不从 watermark 猜 marker。 |
| projection repository unavailable | `Unavailable`。 |

#### 4.11.6 幂等与审计要求

Query 不使用幂等键，不 reserve、不保存 marker、不调用 rebuild。selector canonical 仅用于只读诊断；projection key、freshness ref 和 source subjects 的访问记录不得被当作业务 trace 或 readiness evidence。

#### `GetProjectionFreshness` 停审记录

| 审查项 | 结论 | 缺口 / 后续 |
|---|---|---|
| key→existing marker 映射 | `pass` | 显式 protocol/domain mapper 与 repository lookup；不临时 mint。 |
| Fresh/Stale/Rebuilding/Unavailable surface | `pass` | `ImageQueryContentState` 与 preference 语义逐项闭合。 |
| Query 是否保持只读 | `pass` | 无 rebuild、source refresh、marker save 或 truth write。 |
| Step 9 承接 | `pass` | selector→key mapper→existing view/freshness read→surface。 |

### 4.12 Query 协议族停审（8.2）

| 审查项 | 结论 | 证据 / 后续 |
|---|---|---|
| 10 个 Query 是否有 request、response view/page/marker 和 logical handler | `pass` | §4.2~§4.11 覆盖全部 `ImageQueryName` variant；HLD `*Query` 与 DDD `*Request` 一对一映射。 |
| read model / projection / cursor 身份是否闭合 | `pass` | `ImagePublicProjectionKey`、`ImagePublicReadModelRef`、`ImagePublicPageCursor` 均有 contracts schema、Step 7 lookup key与 mapper规则；query 不 mint identity。 |
| empty / stale / rebuilding / unavailable / gap 是否可区分 | `pass` | `ImageQuerySurface` + `ImageQueryContentState` 固定 surface；各 Query 的例外规则在各自小节列出。 |
| Query 是否避免写入和外部回查 | `pass` | 无 reserve、replay、trace append、projection rebuild、source refresh、gap create 或 adapter write。 |
| visibility / `RequireFresh` / content-state 是否无静默降级 | `pass_after_final_matrix` | §2.4.1 逐条规定 `Visible` 仅为 local reachability；`RequireFresh` 仅接受已有 Fresh projection；无 companion 的 Query 收到 `RequireFresh` / `InspectMarker` 一律 `Unavailable`。 |
| public view 是否泄漏 domain-only enum/ref | `pass_after_wrapper_fix` | public state mapper、gap union、public read-model wrapper和 page cursor已显式；内层 local ref只在 wrapper内存在。 |
| Step 9 承接 | `pass` | Query flow 只展开 context→existing reads→mapper→surface；不得在 flow 中新增 DTO 或写路径。 |

## 5. 条件入站协议族（8.3）

`MI-UP-005` 尚未闭口，故本节刻意**不**定义 `InboundEventEnvelope<T>`、typed payload、topic、event ID、event source、occurred time、receipt、duplicate、delayed、quarantine 或 transport ACK。这里的“协议”仅是 worker 到 application 的 fail-closed boundary disposition：其唯一可公开 body 是已有 `InboundContractMarker` 的安全摘要，且所有当前结果都禁止 truth mutation。它不满足未来 active inbound consumer 的完整 schema；owner 权威关闭后必须重开 Step 7~9，而不是把本节的壳升级为可消费事件。

### 5.1 条件入站共享二级类型

```rust
/// A public, body-free disposition for a conditional inbound boundary; it is not a consumer receipt.
pub struct ImageInboundBoundaryDispositionView {
    /// Named conditional inbound boundary that was inspected.
    pub consumer_name: ImageInboundConsumerName,
    /// Fail-closed state mapped from the local inbound contract marker.
    pub state: InboundContractState,
    /// Safe reason for the current unavailable, rejected, or reopen-required state.
    pub reason: Option<SafeReason>,
    /// Local marker observation time; it is not message occurred/delivery time.
    pub observed_at: UtcTimestamp,
    /// Explicitly states that no event envelope, payload, receipt, or dedup fact was accepted.
    pub accepted_input: bool,
}

/// Conditional inbound result shell; unlike a command result, it has no idempotency replay surface today.
pub struct ImageInboundBoundaryResult {
    /// Named boundary whose current disposition was inspected.
    pub consumer_name: ImageInboundConsumerName,
    /// Body-free current disposition; it is always present for this fail-closed surface.
    pub disposition: ImageInboundBoundaryDispositionView,
    /// Safe protocol error when the boundary cannot be inspected or is rejected.
    pub error: Option<ImageProtocolError>,
}
```

| 类型 / 字段 | 归属与来源 | 当前约束 |
|---|---|---|
| `ImageInboundBoundaryDispositionView.state` | `InboundContractMarker.state` 的 explicit mapping | 仅 `Unavailable` / `Rejected` / `ReopenRequired`；没有 `Accepted` variant。 |
| `reason` / `observed_at` | 已有 local marker 的 safe fields | 不可替换为 event body、event timestamp、delivery time、receipt time 或 run id。 |
| `accepted_input` | protocol constant | 当前固定 `false`；用于防止 caller 将返回壳误当 broker receipt。 |
| `ImageInboundBoundaryResult` | `contracts` result carrier | 没有 idempotency key、receipt ID、dedup marker、retry/delay/quarantine record 或 event payload 字段。 |

### 5.2 `ConsumeVerifiedBuildRequest`

#### 5.2.1 用途

表达 future verified build-request source 的当前不可用边界。它不接收事件 body，也不从任意 arrival、callback 或 API request 创建 `BuildIntent`。只要 `MI-UP-005`、source authority、envelope schema、dedup scope 和 receipt 语义仍未正式关闭，本操作只能读取/构造本地 `InboundContractMarker` disposition。

#### 5.2.2 函数签名 / 路由

| 项 | 内容 |
|---|---|
| 函数签名 | `handle_consume_verified_build_request() -> Result<ImageInboundBoundaryResult, ImageProtocolError>` |
| HTTP / RPC / Event 名称 | 未定义；没有 route、topic 或 event schema。 |
| 调用方 | planned `worker::inbound_event_consumer` boundary；当前没有可调用 external transport。 |
| 处理方 | `application` boundary facade 仅调用 `ImageEntryBoundaryPort::inspect_inbound_boundary`。 |
| 目标对象 / port | `InboundContractMarker`、`ImageEntryBoundaryPort`；禁止 `BuildIntent`、snapshot、attempt、candidate、idempotency record。 |

#### 5.2.3 请求 schema

无 public request DTO / payload。调用没有可接受输入：worker 只能以 protocol 常量 `ImageInboundConsumerName::ConsumeVerifiedBuildRequest` 选择已声明 boundary，并从 composition 提供的 marker 读取当前 disposition。任何试图传入 envelope、event ID、source identity、payload、receipt key、offset、correlation 或 idempotency key 的调用，都是超出当前合同的 `ContractViolation`，不以“暂存”方式保留。

#### 5.2.4 响应 schema与构造闭环

`ImageInboundBoundaryResult.disposition` 从 `InboundContractMarker::unavailable`、`rejected` 或 `reopen_required` 映射。`accepted_input=false` 固定；结果不会构造 `ImageOperationContext::from_write`，不会调用 canonicalizer、UoW、idempotency repository 或 `RequestBuildIntent`。

| marker state | protocol result | local side effect |
|---|---|---|
| `Unavailable` | `disposition.state=Unavailable` + safe reason | 无 `BuildIntent`；可保留/读取 marker，但不是 event receipt。 |
| `Rejected` | `disposition.state=Rejected` + safe reason | 无 dedup/receipt/quarantine record；不写 truth。 |
| `ReopenRequired` | `disposition.state=ReopenRequired` | 仅记录重新设计条件；不假定 future event 被接收。 |

#### 5.2.5 错误映射

| 条件 | protocol result |
|---|---|
| `MI-UP-005` / source authority / schema 未关闭 | `Unavailable` 或 `ReopenRequired`；不进入 command path。 |
| composition 未提供 marker | `Unavailable` + `ContractGap`；不补默认 `Unavailable` marker。 |
| 调用方附带任何 envelope/payload/receipt/dedup 字段 | `ContractViolation`；不解析、不保存。 |
| boundary port unavailable | `Unavailable`；不从 broker/adapter status猜结果。 |

#### 5.2.6 幂等与审计要求

当前不接受输入，故不具备 idempotency / duplicate replay / receipt / delay / quarantine 语义。不得 reserve key 或创建 stored result。若未来 event contract 关闭，必须先定义完整 envelope、payload、source authority、dedup scope、receipt 和 error/retry surface，再重新开启本协议小节和 Step 9 flow。

#### `ConsumeVerifiedBuildRequest` 停审记录

| 审查项 | 结论 | 缺口 / 后续 |
|---|---|---|
| no-envelope boundary 是否明确 | `pass_with_blocker` | `MI-UP-005` 下无 payload、receipt、dedup 或 accepted write path。 |
| BuildIntent 是否未被隐式创建 | `pass` | result 只映射 marker；不调用 command/UoW/repository。 |
| Step 9 承接 | `pass_with_reopen_only` | 仅 disposition flow；正向 consumer flow 等正式 owner contract 后重开。 |

### 5.3 `ConsumeVerifiedSourceRefresh`

#### 5.3.1 用途

表达 future formal owner source-refresh 的当前不可用边界。它不接收 source update body，也不直接创建或更新 `ExternalReferenceSnapshot`、`MappingSourceSnapshot`、definition、qualification、supply 或 projection truth。任何新 snapshot 都必须在 future contract 关闭后，由 application 使用 safe body-free conclusion 和既有 factory/port 构造。

#### 5.3.2 函数签名 / 路由

| 项 | 内容 |
|---|---|
| 函数签名 | `handle_consume_verified_source_refresh() -> Result<ImageInboundBoundaryResult, ImageProtocolError>` |
| HTTP / RPC / Event 名称 | 未定义；没有 source topic、event name 或 adapter callback schema。 |
| 调用方 | planned `worker::source_refresh_consumer` boundary；当前没有 active external caller。 |
| 处理方 | `application` boundary facade 仅调用 `ImageEntryBoundaryPort::inspect_inbound_boundary`。 |
| 目标对象 / port | `InboundContractMarker`、`ImageEntryBoundaryPort`；禁止 snapshot/gap/projection truth mutation。 |

#### 5.3.3 请求 schema

无 public request DTO / payload。不得传入 owner ref、revision、freshness category、source body、event envelope、dedup key、receipt 或 adapter response；这些字段的 owner/schema 仍属于待关闭合同。worker 只按 `ImageInboundConsumerName::ConsumeVerifiedSourceRefresh` 选择 boundary marker。

#### 5.3.4 响应 schema与构造闭环

结果同 §5.2 的 `ImageInboundBoundaryResult`，但 `consumer_name` 固定为 `ConsumeVerifiedSourceRefresh`。任何 state 都只表达本仓对 future source-refresh contract 的理解，不代表 source 已刷新、snapshot 已新建、snapshot validity 已变更或 projection 已标脏。

| marker state | protocol result | 明确禁止 |
|---|---|---|
| `Unavailable` | safe unavailable disposition | 不调用 resolver、snapshot repository、projection repository。 |
| `Rejected` | safe rejected disposition | 不存 source ref/body、event body、dedup/receipt。 |
| `ReopenRequired` | future reopen disposition | 不把 reopen 当 refresh 成功或 source version 已接受。 |

#### 5.3.5 错误映射

| 条件 | protocol result |
|---|---|
| owner/source schema 或 authority 未关闭 | `Unavailable` / `ReopenRequired`。 |
| caller 试图附带 source ref/body / event metadata | `ContractViolation`；不缓存输入。 |
| marker 与 selected consumer name 不一致 | `ContractViolation`；不换用 build-request marker。 |
| boundary port unavailable | `Unavailable`。 |

#### 5.3.6 幂等与审计要求

当前没有 accepted source update，因而没有 idempotency、dedup、receipt、delay、quarantine 或 replay body。安全审计只可记录 local boundary state 与 reopen reason；不得将其作为 external source freshness evidence。

#### `ConsumeVerifiedSourceRefresh` 停审记录

| 审查项 | 结论 | 缺口 / 后续 |
|---|---|---|
| source refresh 是否未越权写 snapshot/truth | `pass_with_blocker` | marker-only；正式 source contract 未闭口。 |
| inbound secondary types 是否有 schema | `pass` | 只有 disposition/result 壳，且明确不含 envelope/receipt。 |
| Step 9 承接 | `pass_with_reopen_only` | 仅 marker inspection；future snapshot flow 必须重开。 |

### 5.4 条件入站协议族停审（8.3）

| 审查项 | 结论 | 证据 / 后续 |
|---|---|---|
| 两个 consumer 是否各有独立 logical surface | `pass` | `ConsumeVerifiedBuildRequest` 与 `ConsumeVerifiedSourceRefresh` 各有 purpose、handler、error、audit 和 reopen 条件。 |
| 是否错误创建 envelope / receipt / dedup / payload | `pass` | public carrier 明确是 marker disposition，`accepted_input=false`；全体禁止字段已列明。 |
| 当前是否能写 BuildIntent/snapshot/truth | `pass_with_blocker` | 不能；`MI-UP-005` 继续阻断 positive write path。 |
| Step 9 承接 | `pass_with_reopen_only` | 可展开 marker inspection；完整 consumer flow 需 owner contract 后重开。 |

## 6. Outbound Event 协议族（8.4）：零库存

本仓当前的 outbound-event protocol inventory 是**严格的零**：`ImageOutboundEventInventory::NoneAuthorized`。这不是“空数组留作未来扩展”，而是明确禁止创建 event name、payload、envelope、schema version、topic key、outbox、publisher、delivery state、retry/receipt 或 outbound processing flow。

| 事项 | 当前结论 | reopen 条件 |
|---|---|---|
| outbound event DTO / payload | 不存在 | `MI-UP-009` 有正式 owner、消费者、用途、schema/version、delivery/失败语义。 |
| outbox / publisher / delivery | 不存在 | 同时重开 Step 5、7、8、9、11~13，确认 truth snapshot、transaction和幂等边界。 |
| outbound effect in command/job result | 固定 `NoneAuthorized` | 新 authority 不能通过 enum 新分支偷偷接入；必须先重开本 Step。 |
| routing / topic / adapter | 不存在 | 上游正式合同和依赖分类复核；消费关系不自动变成 compile dependency。 |

任何 local trace、gap、freshness marker、entry transition 或 stored result 都不是 outbound event。`PublishInstantiableEntry` 的 local publish 也不是 registry publish、Member Service notification 或 message delivery。

### 6.1 Outbound Event 协议族停审记录

| 审查项 | 结论 | 缺口 / 后续 |
|---|---|---|
| zero inventory 是否显式可审计 | `pass` | §2.4 effect summary 与本节一致。 |
| 是否误继承 L1-governance outbox/publisher | `pass` | 未创建此类对象、port、DTO 或 flow。 |
| reopen discipline | `pass_with_blocker` | 仅 `MI-UP-009` 正式关闭后按多 Step 重开；当前不产生事件。 |

## 7. Operations Job 协议族（8.5）

Job 是本仓受限的 application maintenance entry，不是 scheduler、cron、queue consumer、lease、cursor、run、report、evidence、verdict 或 signoff。每个 Job 只选择已经持久化的本仓 scope；它可以通过同一 application facade 请求一个 local action 或记录安全阻断，但不能直接访问 repository/domain/adapter。下文的 result 是**local job disposition**，不是 run report：不包含 run ID、started/ended time、计数、execution log、evidence alias、测试结果或 readiness。

### 7.1 Job 共享二级类型与 replay 规则

```rust
/// Opaque page cursor for one bounded operations-job scope; it is neither a scheduler cursor nor a
/// repository cursor and cannot be exchanged with `ImagePublicPageCursor`.
pub struct ImageJobPageCursor {
    /// Opaque cursor token that application maps to one `ImageRepositoryCursor` for the exact job scope.
    pub value: NonEmptyText,
}

/// Explicit bounded page selection for an operations-job scope. The caller must supply both the
/// `after` presence (`None` for the first page) and a positive `limit`; no default batch exists.
pub struct ImageJobPageRequest {
    /// Previous page cursor for this exact job scope; `None` explicitly selects its first page.
    pub after: Option<ImageJobPageCursor>,
    /// Explicit maximum number of persisted local subjects to inspect; zero or over-limit is rejected.
    pub limit: u32,
}

/// Selects exactly one handoff family so its job page maps to one repository page without a
/// composite/scheduler cursor.
pub enum ImageHandoffJobTarget {
    /// Reconcile persisted Pending or Gap Artifact handoff observations only.
    ArtifactHandoffs,
    /// Reconcile persisted Open or Stale Member Service consumer-handoff gaps only.
    ConsumerHandoffGaps,
}

/// A bounded persisted local scope selected for a maintenance action; it is not a scheduler cursor.
pub enum ImageJobScopeSelector {
    /// Select currently persisted buildable revisions.
    BuildableRevisions {
        /// Explicit page selection mapped to `ImageRepositoryPageRequest`.
        page: ImageJobPageRequest,
    },
    /// Select persisted reconcilable build attempts.
    ReconcilableBuildAttempts {
        /// Explicit page selection mapped to `ImageRepositoryPageRequest`.
        page: ImageJobPageRequest,
    },
    /// Select persisted reevaluable gate/qualification contexts.
    ReevaluableQualifications {
        /// Explicit page selection mapped to `ImageRepositoryPageRequest`.
        page: ImageJobPageRequest,
    },
    /// Select one exact existing external snapshot for a declared local use.
    ExternalSnapshot {
        /// Exact local snapshot to reconsider; never an external source body.
        snapshot_ref: ExternalReferenceSnapshotRef,
    },
    /// Select one explicit projection family and optional typed variant scope.
    Projection(ImagePublicProjectionKey),
    /// Select one persisted local Artifact or consumer handoff family with an explicit bounded page.
    HandoffGaps {
        /// Exact repository family to reconcile; no implicit union or post-filter is permitted.
        target: ImageHandoffJobTarget,
        /// Explicit page selection mapped to `ImageRepositoryPageRequest` for the selected family.
        page: ImageJobPageRequest,
    },
}

/// Public request envelope for one bounded local job action; it contains no scheduler/run metadata.
pub struct ImageOperationsJobRequest<T> {
    /// System actor required for a bounded local maintenance action.
    pub actor: ImageProtocolActor,
    /// Shared write metadata; key/correlation are supplied by the bounded caller, never by a scheduler tick.
    pub metadata: ImageWriteMetadata,
    /// Job-specific bounded body.
    pub body: T,
}

/// Local result disposition for one bounded job action; it is not a job report or execution fact.
pub enum ImageJobOutcomeKind {
    /// The local action safely completed its declared bounded disposition.
    Applied,
    /// The selected persisted scope had no local work; this is not an external success conclusion.
    NoOp,
    /// One or more selected local lanes remain blocked by a typed gap.
    Blocked,
    /// A required local store, projection, or external seam is unavailable.
    Unavailable,
    /// A selected external side effect or conclusion remains unknown.
    Unknown,
    /// A stored local disposition was replayed without repeating the selection or action.
    DuplicateReplay,
    /// The same key was reused for a different canonical job input.
    Conflict,
}

/// Safe per-scope disposition; it never exposes a run counter, report, or provider body.
pub struct ImageJobScopeDispositionItem {
    /// Persisted local subject selected by the job.
    pub subject_ref: LocalObjectRef,
    /// Safe local disposition for this exact subject.
    pub disposition: SafeDisposition,
    /// Safe explanation when the subject is not applied.
    pub reason: Option<SafeReason>,
    /// Related local gap when a narrow lane is frozen.
    pub gap_ref: Option<ImageBoundaryGapRef>,
}

/// Bounded local job result; `items` is not a run report and must not contain counts or evidence.
pub struct ImageOperationsJobResult {
    /// Logical job identity.
    pub job_name: ImageOperationsJobName,
    /// Stored local result shell ref, if this disposition entered replay storage.
    pub result_ref: Option<ImageOperationResultRef>,
    /// Aggregate safe disposition for the bounded selected scope.
    pub outcome: ImageJobOutcomeKind,
    /// Stable-order per-subject local dispositions; empty is required for unavailable-before-selection.
    pub items: Vec<ImageJobScopeDispositionItem>,
    /// Local truth/trace/gap effects only; outbound inventory is always NoneAuthorized.
    pub effects: ImageWriteEffectSummary,
    /// Safe non-positive protocol error, if applicable.
    pub error: Option<ImageProtocolError>,
    /// Whether this value was read from the stored local replay body.
    pub replayed: bool,
}
```

| shared rule | 固定语义 |
|---|---|
| actor | `ImageOperationsJobRequest.actor.kind` 必须为 `System`；`Participant`、`IntegrationSource`、`Unknown` 一律 `ContractViolation`。system actor 不等 scheduler ownership、authorization 或已执行事实。 |
| metadata | key/correlation 明确输入；不得从 clock、daily tick、run ID、cursor、scope size 或 external ref text 生成。 |
| scope | 只能是 `ImageJobScopeSelector` 中已声明的 persisted local scope；所有枚举型 list scope 都必须携带 `ImageJobPageRequest { after: None 或 token, limit }`，application 一对一映射为 Step 7 `ImageRepositoryPageRequest { after, limit }`。不存在默认 batch、全表 scan、unbounded source scan、public Query cursor复用或 scheduler cursor。 |
| result | `Applied` 只表示对应 local disposition 已提交；`NoOp` 只表示 selected local scope 无动作；两者都不表示 build/gate/Artifact/consumer/external success。 |
| replay | Job 使用 `ImageOperationChannel::OperationsJob` + exact job name + canonical scope/body；duplicate 必须读取 stored `JobDisposition` body，不能重新 select、调用 adapter 或重建 projection。 |
| stored body | `ImageOperationsJobResult` 是 Step 7 `StoredImageOperationResultKind::JobDisposition` 的唯一 Step 8 replay body schema；shell 不存 job request、report 或 evidence。 |
| forbidden output | 不得添加 `run_id`、schedule name、lease、cursor、start/end time、report、counter、metric、evidence、verdict、signoff、digest、Artifact/consumer confirmation 或 outbound event。 |

`ImageJobPageCursor` 只在 input identity 中表示一个**已请求的读取位置**，不是 output/report 字段；`ImageOperationsJobResult` 仍不得回传 cursor、计数或 page report。每次 page 只是一个独立、明确调用；下一页是否调用、何时调用和如何保存进度均未设计，不能由本仓假设 scheduler 或 worker state。

### 7.1.1 Job name → action marker → boundary disposition 的穷尽映射

每个 Job 都必须先从 `ImageOperationsJobName` 映射到 Step 6 的唯一 `ImageJobActionKind`，构造 `ImageJobActionMarker::declare(action_kind, None)`，再调用 `ImageEntryBoundaryPort::inspect_job_action_boundary(&marker)`。marker 不是 run record，`None` 只表示入口尚未持有 pre-existing local blocker，不表示 action 已运行或成功；不得向 marker 加入 schedule、lease、cursor、run/report/evidence 或 digest。

| `ImageOperationsJobName` | Step 6 `ImageJobActionKind` | marker 构造 | Step 7 boundary call | `Declared` | `Blocked` | `ReopenRequired` |
|---|---|---|---|---|---|---|
| `RunNightlyBuildSweep` | `NightlyBuildSweep` | `ImageJobActionMarker::declare(NightlyBuildSweep, None)` | `inspect_job_action_boundary(&marker)` | 允许继续 canonicalize、reserve 后读取 `BuildableRevisions { page }`，再只经 intent facade处理该页。 | `ImageJobOutcomeKind::Blocked` + safe error/gap；不读取 page、不创建 intent。 | `Blocked` + `ContractGap` safe error；不读取 page；待 owner contract 后重开 Step 7~9。 |
| `ReconcileBuildAttempts` | `ReconcileBuildAttempts` | `ImageJobActionMarker::declare(ReconcileBuildAttempts, None)` | `inspect_job_action_boundary(&marker)` | 允许继续 canonicalize、reserve 后读取 `ReconcilableBuildAttempts { page }`，逐项走受控 outcome facade。 | `Blocked` + safe error/gap；不 inspect builder、不读取 page。 | `Blocked` + `ContractGap` safe error；不读取 page，不能把重开当 retry。 |
| `ReevaluatePendingQualifications` | `ReevaluatePendingQualifications` | `ImageJobActionMarker::declare(ReevaluatePendingQualifications, None)` | `inspect_job_action_boundary(&marker)` | 允许继续 canonicalize、reserve 后读取 `ReevaluableQualifications { page }`，逐项走 qualification facade。 | `Blocked` + safe error/gap；不读取 page、不取 gate/evidence body。 | `Blocked` + `ContractGap` safe error；不读取 page，待 owner authority 后重开。 |
| `RefreshExternalReferenceSnapshots` | `RefreshExternalReferenceSnapshots` | `ImageJobActionMarker::declare(RefreshExternalReferenceSnapshots, None)` | `inspect_job_action_boundary(&marker)` | 允许继续 canonicalize、reserve 后 exact-load `ExternalSnapshot`，再走 declared-use resolver。 | `Blocked` + safe error/gap；不 load snapshot、不调 resolver。 | `Blocked` + `ContractGap` safe error；不把 source refresh event 偷渡为重试。 |
| `RebuildImageDerivedViews` | `RebuildImageDerivedViews` | `ImageJobActionMarker::declare(RebuildImageDerivedViews, None)` | `inspect_job_action_boundary(&marker)` | 允许继续 canonicalize、reserve 后 exact-read `Projection`，再从 committed truth 处理。 | `Blocked` + safe error/gap；不读/写 projection、不 rebuild。 | `Blocked` + `ContractGap` safe error；不把 query freshness 请求升格为执行。 |
| `ReconcileArtifactAndConsumerHandoffs` | `ReconcileArtifactAndConsumerHandoffs` | `ImageJobActionMarker::declare(ReconcileArtifactAndConsumerHandoffs, None)` | `inspect_job_action_boundary(&marker)` | 允许继续 canonicalize、reserve 后读取 `HandoffGaps { target, page }`，逐项走 non-positive seam assessment。 | `Blocked` + safe error/gap；不读取 page、不调用 Artifact/Member Service seam。 | `Blocked` + `ContractGap` safe error；不读取 page、不 accept/resolve/confirm。 |

无论上述分支如何，`Declared` 只是“已有安全 facade 方向”的设计结论，并非一次 job 的执行、提交、成功、build outcome、Artifact acceptance 或 consumer confirmation。若 boundary port 自身 `Unavailable`，对应结果为 `ImageJobOutcomeKind::Unavailable`，同样在 selection 前停止。

### 7.2 Job 逻辑签名

```rust
/// Runs the bounded nightly build-intent sweep without binding a scheduler.
pub async fn handle_run_nightly_build_sweep(
    &self,
    request: ImageOperationsJobRequest<RunNightlyBuildSweepRequest>,
) -> Result<ImageOperationsJobResult, ImageProtocolError>;

/// Reconciles selected persisted build attempts without blindly retrying external work.
pub async fn handle_reconcile_build_attempts(
    &self,
    request: ImageOperationsJobRequest<ReconcileBuildAttemptsRequest>,
) -> Result<ImageOperationsJobResult, ImageProtocolError>;

/// Reevaluates selected persisted qualification contexts without inventing gate authority.
pub async fn handle_reevaluate_pending_qualifications(
    &self,
    request: ImageOperationsJobRequest<ReevaluatePendingQualificationsRequest>,
) -> Result<ImageOperationsJobResult, ImageProtocolError>;

/// Refreshes one existing body-free external snapshot context without accepting a source event body.
pub async fn handle_refresh_external_reference_snapshots(
    &self,
    request: ImageOperationsJobRequest<RefreshExternalReferenceSnapshotsRequest>,
) -> Result<ImageOperationsJobResult, ImageProtocolError>;

/// Rebuilds one existing derived view from committed local truth only.
pub async fn handle_rebuild_image_derived_views(
    &self,
    request: ImageOperationsJobRequest<RebuildImageDerivedViewsRequest>,
) -> Result<ImageOperationsJobResult, ImageProtocolError>;

/// Reconciles existing local Artifact and consumer handoff gaps without accepting or confirming either boundary.
pub async fn handle_reconcile_artifact_and_consumer_handoffs(
    &self,
    request: ImageOperationsJobRequest<ReconcileArtifactAndConsumerHandoffsRequest>,
) -> Result<ImageOperationsJobResult, ImageProtocolError>;
```

### 7.3 `RunNightlyBuildSweep`

#### 7.3.1 用途

从已持久化的 `Buildable` revision 选择有限 scope，并通过 `BuildIntentCoordinator` 发起与 `RequestBuildIntent` 同一受控 intent 语义。它不绑定 nightly scheduler，不凭“当天”或 tick 构造 trigger，不直接创建 attempt/candidate，也不把空 scope、intent accepted 或 local disposition 写成 build 成功。

#### 7.3.2 函数签名 / 路由

| 项 | 内容 |
|---|---|
| 函数签名 | `handle_run_nightly_build_sweep(ImageOperationsJobRequest<RunNightlyBuildSweepRequest>) -> Result<ImageOperationsJobResult, ImageProtocolError>` |
| 触发方式 | bounded `jobs` caller 的 explicit invocation；scheduler 未绑定。 |
| 处理方 | `application::BuildIntentCoordinator`。 |
| 依赖 port | `ImageEntryBoundaryPort`、`DefinitionAssemblyRepositoryPort::list_buildable_revisions`、同一 application intent facade、`ImageIdempotencyRepositoryPort`。 |
| 影响对象 | 可创建/阻断 local `BuildIntent`、trace/gap/replay shell；不创建 snapshot/attempt/candidate。 |

#### 7.3.3 请求 schema

```rust
/// RunNightlyBuildSweep 的 bounded request body.
pub struct RunNightlyBuildSweepRequest {
    /// Must be `BuildableRevisions { page }`; `page.after` is explicitly None or one job-page token,
    /// and `page.limit` is explicit. No scheduler cursor or unrestricted selector is accepted.
    pub scope: ImageJobScopeSelector,
    /// Body-free local trigger identity for this declared maintenance action.
    pub trigger_ref: OpaqueReference,
}
```

| 输入字段 | 类型 | 目标对象 / 来源 | 缺失 / 冲突处理 |
|---|---|---|---|
| `scope` | `ImageJobScopeSelector` | 必须精确为 `BuildableRevisions { page }` → `list_buildable_revisions(ImageRepositoryPageRequest { after, limit })` | page 的 `after=None` 明确表示第一页；token/limit 由 job-page mapper校验。其它 variant、0/超限 limit、malformed token=`ContractViolation`；不接受 scheduler cursor、默认 batch或全表扫描。 |
| `trigger_ref` | `OpaqueReference` | 每个 `BuildIntent.trigger_ref` 的 body-free `NightlySweep` source | owner/kind 不合格或 run/tick identity=`ContractViolation`；不得由 date 生成。 |
| `actor` / `metadata` | shared job envelope | `System` actor、`OperationMetadata`、replay | actor/key/correlation 缺失=`ContractViolation`。 |

#### 7.3.4 响应 schema与构造闭环

每个 selected revision 只能通过 `RequestBuildIntent` 的既有 DTO/object rules形成 `BuildIntent` 或 safe blocked disposition；job 本身不复制另一套 intent factory。`items.subject_ref` 是 selected `VariantRevision`，`effects.changed_subject_refs` 只列实际 staged local revision/intent/gap/trace subjects。

| 条件 | `ImageJobOutcomeKind` / object effect |
|---|---|
| 无 persisted buildable revision | `NoOp` + `items=[]`；不表示 nightly 已成功执行外部 build。 |
| revision 仍可请求 local intent | `Applied` + local `BuildIntent` effect；`BuildIntent.Accepted` 不等 builder accepted。 |
| revision relation/trigger seam blocked | `Blocked` + typed gap item；不跳过 baseline/pin guard。 |
| local store unavailable before selection | `Unavailable` + `items=[]`；不猜 scope。 |

#### 7.3.5 错误映射

| 条件 | protocol result |
|---|---|
| job boundary `Blocked` / `ReopenRequired` | `Blocked` / `Unavailable` + safe reason；不执行 selection。 |
| list/read conflict | `Conflict` / `ContractViolation`；不选择近似 revision。 |
| same key + different scope/trigger | `Conflict` + `IdempotencyConflict`；不重扫。 |
| duplicate | `DuplicateReplay`；读取 stored job disposition。 |

#### 7.3.6 幂等与审计要求

canonical 顺序为 `OperationsJob -> RunNightlyBuildSweep -> scope=BuildableRevisions -> page.after (explicit None|token) -> page.limit -> trigger_ref`。actor、time、scheduler/run/tick、selected item count和result state不进入 identity。page cursor 是请求 selector的一部分，不是 scheduler cursor、output/report字段或持久化进度。job trace 只可记录 selected local revision/intent/gap refs与安全 correlation；不记录 scheduler metadata或 builder body。

#### `RunNightlyBuildSweep` 停审记录

| 审查项 | 结论 | 缺口 / 后续 |
|---|---|---|
| scope / BuildIntent 构造闭环 | `pass` | 复用 `RequestBuildIntent` facade；不绕 factory。 |
| scheduler/run/report 是否未被伪造 | `pass` | request/result无 scheduler、run/report字段。 |
| Step 9 承接 | `pass` | boundary→bounded list→intent facade→local disposition/replay。 |

### 7.4 `ReconcileBuildAttempts`

#### 7.4.1 用途

对已持久化且由 repository 明确列出的 pending/unknown attempts 做保守 recheck。它不盲目 retry handoff、不创建第二个 attempt、不覆盖 old outcome，也不把 adapter availability、ACK、tag 或 cache 当 outcome。只有 adapter 产生新的 safe observation，且复用 `RecordBuildOutcome` 的 guard/DTO 约束时，才可能记录新的 local outcome/candidate context。

#### 7.4.2 函数签名 / 路由

| 项 | 内容 |
|---|---|
| 函数签名 | `handle_reconcile_build_attempts(ImageOperationsJobRequest<ReconcileBuildAttemptsRequest>) -> Result<ImageOperationsJobResult, ImageProtocolError>` |
| 触发方式 | bounded `jobs` caller；无 retry scheduler、lease 或 run loop。 |
| 处理方 | `application::BuildIntentCoordinator`。 |
| 依赖 port | `ImageEntryBoundaryPort`、`BuildCandidateRepositoryPort::list_reconcilable_attempts`、`BuilderRegistryPort::inspect_outcome`、`RecordBuildOutcome` application facade、idempotency/replay port。 |
| 影响对象 | existing `BuildAttempt`、可选 local `BuildOutcomeConclusion`/`CandidateImage`、gap/trace/replay；不删除/覆盖 attempt history。 |

#### 7.4.3 请求 schema

```rust
/// ReconcileBuildAttempts 的 bounded request body.
pub struct ReconcileBuildAttemptsRequest {
    /// Must be `ReconcilableBuildAttempts { page }`; it never accepts an arbitrary provider selector.
    pub scope: ImageJobScopeSelector,
}
```

| 输入字段 | 类型 | 读取目标 | 缺失 / 冲突处理 |
|---|---|---|---|
| `scope` | `ImageJobScopeSelector` | 必须为 `ReconcilableBuildAttempts { page }` → `list_reconcilable_attempts(ImageRepositoryPageRequest { after, limit })` | page 的 None/token 与 limit 都是显式 canonical input；其它 variant、0/超限 limit、malformed token=`ContractViolation`；不得传 provider run/id、默认 batch或全表 scan。 |
| `actor` / `metadata` | shared job envelope | System actor、context、replay | 缺 key/correlation=`ContractViolation`。 |

#### 7.4.4 响应 schema与构造闭环

每个 `items.subject_ref` 必须是已持久化 `BuildAttempt`。`BuilderRegistryPort::inspect_outcome` 的 `Observed` 仅成为 `RecordBuildOutcome` 受控 facade 的候选输入；`Blocked`/`Unavailable`/`Unknown` 必须保守反映在 item 与可能的 local gap/attempt context，不能自动 retry。未获得新 safe observation时，`NoOp` 只代表本仓没有可提交的新 disposition。

| 条件 | `ImageJobOutcomeKind` / object effect |
|---|---|
| 无 reconcilable attempt | `NoOp`；不表示无外部执行。 |
| new safe observation 成功形成 local outcome | `Applied`；candidate 仍只由 `RecordBuildOutcome` guard 决定。 |
| adapter `Unknown` | `Unknown`；不重试/不覆盖 old attempt。 |
| adapter blocked / owner pending | `Blocked` + typed gap；不标 failed/succeeded。 |
| adapter unavailable | `Unavailable`；不从 cache补 conclusion。 |

#### 7.4.5 错误映射

| 条件 | protocol result |
|---|---|
| attempt wrong kind/terminal relation conflict | `ContractViolation` / `Conflict`；不选择其它 attempt。 |
| outcome facade refuses mismatch | `Blocked` / `Rejected` equivalent local item；aggregate按最保守 non-positive state。 |
| duplicate | `DuplicateReplay`；不重新 inspect adapter。 |
| same key different scope | `Conflict` + `IdempotencyConflict`。 |

#### 7.4.6 幂等与审计要求

canonical 顺序为 `OperationsJob -> ReconcileBuildAttempts -> scope=ReconcilableBuildAttempts -> page.after (explicit None|token) -> page.limit`。不纳入 adapter observation body、provider run ID、retry count、cache state、clock 或 selected count。page token不是 scheduler cursor或 output。trace 只记录 existing attempt/outcome/candidate/gap local refs和 safe correlation。

#### `ReconcileBuildAttempts` 停审记录

| 审查项 | 结论 | 缺口 / 后续 |
|---|---|---|
| unknown 是否不盲重试 | `pass` | `Unknown` 明确保留，不生成 second attempt。 |
| adapter 与 outcome/candidate guard 是否分离 | `pass_with_pending_builder` | `Q-MI-003` 仍只允许 safe observation/blocked seam。 |
| Step 9 承接 | `pass` | bounded attempt list→inspect→outcome facade/negative disposition→replay。 |

### 7.5 `ReevaluatePendingQualifications`

#### 7.5.1 用途

对已持久化 pending/blocked/unknown qualification contexts 重新评估本仓 `GateEvaluation` / `EligibilityDecision`。它不读取 Governance gate inventory、evidence body或 policy body，不默认 `Passed` / `Eligible`，也不把 local recheck 变成 Artifact acceptance 或 supply entry creation。

#### 7.5.2 函数签名 / 路由

| 项 | 内容 |
|---|---|
| 函数签名 | `handle_reevaluate_pending_qualifications(ImageOperationsJobRequest<ReevaluatePendingQualificationsRequest>) -> Result<ImageOperationsJobResult, ImageProtocolError>` |
| 触发方式 | bounded `jobs` caller；无 schedule/run binding。 |
| 处理方 | `application::QualificationCoordinator`。 |
| 依赖 port | `ImageEntryBoundaryPort`、`QualificationRepositoryPort::list_reevaluable_gate_evaluations`、`QualificationBoundaryPort`、same qualification facade、idempotency/replay port。 |
| 影响对象 | existing `GateEvaluation`，可选 new/current `EligibilityDecision`、local gap/trace/replay；不创建 Artifact/entry。 |

#### 7.5.3 请求 schema

```rust
/// ReevaluatePendingQualifications 的 bounded request body.
pub struct ReevaluatePendingQualificationsRequest {
    /// Must be `ReevaluableQualifications { page }`; the job does not accept a gate inventory or evidence body.
    pub scope: ImageJobScopeSelector,
}
```

| 输入字段 | 类型 | 读取目标 | 缺失 / 冲突处理 |
|---|---|---|---|
| `scope` | `ImageJobScopeSelector` | 必须为 `ReevaluableQualifications { page }` → `list_reevaluable_gate_evaluations(ImageRepositoryPageRequest { after, limit })` | page 的 None/token 与 limit 都是显式 canonical input；其它 variant、0/超限 limit、malformed token=`ContractViolation`；不得按 gate name/owner body筛选、使用默认 batch或全表 scan。 |
| `actor` / `metadata` | shared job envelope | System actor、context、replay | actor/key/correlation缺失=`ContractViolation`。 |

#### 7.5.4 响应 schema与构造闭环

`items.subject_ref` 是 existing `GateEvaluation` 或其 exact candidate relation；job 通过已有 qualification facade 决定是否能形成新的 local evaluation/decision context。`QualificationBoundaryPort` 的任何当前结果都只能导致 pending/blocked/unknown/gap，不得构造 `Passed`、`Eligible`、Artifact `Accepted` 或 supply `Available`。

| 条件 | `ImageJobOutcomeKind` / object effect |
|---|---|
| 无 reevaluable evaluation | `NoOp`；不代表 gate set已通过。 |
| 本地 guard在已有 safe conclusions下形成新 non-positive/positive local evaluation | `Applied`；仅在 future formal authority已满足时才可能是 local eligibility变化，当前 Q-MI-004保持 pending。 |
| owner authority/evidence pending | `Blocked` + qualification gap；不生成 inventory。 |
| owner result unknown/unavailable | `Unknown` / `Unavailable`；不默认 fail 或 pass。 |

#### 7.5.5 错误映射

| 条件 | protocol result |
|---|---|
| evaluation/candidate relation wrong | `ContractViolation` / `Conflict`；不选择历史其它决策。 |
| qualification boundary returns ReopenRequired | `Blocked` + `ContractGap`；不调用 positive evaluator。 |
| duplicate | `DuplicateReplay`；不重复 reevaluate。 |
| same key different scope | `Conflict` + `IdempotencyConflict`。 |

#### 7.5.6 幂等与审计要求

canonical 顺序为 `OperationsJob -> ReevaluatePendingQualifications -> scope=ReevaluableQualifications -> page.after (explicit None|token) -> page.limit`。不包含 evidence/gate body、inventory、policy version、run ID、clock或item count。page token不是 scheduler cursor或 output。trace只列 evaluation/eligibility/gap local refs和 safe reason；不记录 evidence body。

#### `ReevaluatePendingQualifications` 停审记录

| 审查项 | 结论 | 缺口 / 后续 |
|---|---|---|
| gate authority 是否仍外置 | `pass_with_blocker` | Q-MI-004 未关闭；无 inventory/body。 |
| local qualification 与 Artifact/supply 是否分离 | `pass` | job不创建 Accepted handoff或 entry。 |
| Step 9 承接 | `pass` | bounded evaluation list→boundary assessment→qualification facade→local disposition/replay。 |

### 7.6 `RefreshExternalReferenceSnapshots`

#### 7.6.1 用途

对一个已存在的 body-free `ExternalReferenceSnapshot` 作受限 recheck，并按现有 snapshot factory/guard 形成新 snapshot context、stale/conflict/unavailable gap 或 no-op。它不接受 source refresh event body、不从 owner 复制 RoleDefinition/component/seed/Artifact/consumer body、不更新 definition/build/qualification/supply truth，也不把 snapshot `Valid` 写成 owner truth。

#### 7.6.2 函数签名 / 路由

| 项 | 内容 |
|---|---|
| 函数签名 | `handle_refresh_external_reference_snapshots(ImageOperationsJobRequest<RefreshExternalReferenceSnapshotsRequest>) -> Result<ImageOperationsJobResult, ImageProtocolError>` |
| 触发方式 | bounded `jobs` caller；无 source event/scheduler binding。 |
| 处理方 | `application::ReferenceIntakeCoordinator`。 |
| 依赖 port | `ImageEntryBoundaryPort`、`ReferenceDerivedRepositoryPort`、`ImageAssemblyReferenceResolverPort`（仅 declared use）、idempotency/replay port。 |
| 影响对象 | existing/new `ExternalReferenceSnapshot`、local `ContractGap`、trace、affected existing projection freshness；不改核心 domain truth。 |

#### 7.6.3 请求 schema

```rust
/// RefreshExternalReferenceSnapshots 的 bounded request body.
pub struct RefreshExternalReferenceSnapshotsRequest {
    /// Must select one exact existing local external snapshot.
    pub scope: ImageJobScopeSelector,
}
```

| 输入字段 | 类型 | 目标对象 / 来源 | 缺失 / 冲突处理 |
|---|---|---|---|
| `scope` | `ImageJobScopeSelector` | 必须为 `ExternalSnapshot { snapshot_ref }` → `get_external_snapshot_with_version` | 非 exact snapshot scope=`ContractViolation`；不扫描 owner source。 |
| loaded snapshot `source_ref/use_kind` | existing local truth | `ExternalReferenceSnapshot::capture` new context / old snapshot supersede/invalidate | missing/invalid relation=`Gap`；不由 job body补 source ref。 |
| `actor` / `metadata` | shared job envelope | System actor、replay | missing=`ContractViolation`。 |

#### 7.6.4 响应 schema与构造闭环

job 必须先 exact-load snapshot；然后只对该 snapshot 的 declared `ReferenceUseKind` 使用对应 body-free resolver。新的 safe conclusion 只能经 `ExternalReferenceSnapshot::capture` 形成新的 local context；旧 snapshot 的 `Valid` 不得原地恢复或跨用途复用。resolver 当前无法安全结论时，只产生 stale/conflict/unavailable/gap disposition，不能伪造 new valid snapshot。

| 条件 | `ImageJobOutcomeKind` / object effect |
|---|---|
| selected snapshot missing | `Blocked` / `Missing`；不创建替代 snapshot。 |
| safe new conclusion支持新 capture | `Applied` + new snapshot/old supersede local effects；不改 source owner truth。 |
| source stale/conflict | `Blocked` + gap 或 invalidation；不继续正向 guard。 |
| source unavailable/unknown | `Unavailable` / `Unknown`；不使用 cache/fake回填。 |

#### 7.6.5 错误映射

| 条件 | protocol result |
|---|---|
| source/use kind不匹配 | `ContractViolation`；不改 use kind。 |
| resolver lacks formal owner input | `Blocked` + `ContractGap`。 |
| version conflict saving snapshot | `Conflict`；不覆盖旧 snapshot。 |
| duplicate | `DuplicateReplay`；不再次调用 resolver。 |

#### 7.6.6 幂等与审计要求

canonical 顺序为 `OperationsJob -> RefreshExternalReferenceSnapshots -> external_snapshot_ref`。不含 source body、source revision text、adapter response、event body、clock或result state。trace只保存 local snapshot/gap refs、declared use和 safe reason；不把 snapshot当证据或 digest。

#### `RefreshExternalReferenceSnapshots` 停审记录

| 审查项 | 结论 | 缺口 / 后续 |
|---|---|---|
| snapshot/static/live/owner 边界 | `pass` | exact existing body-free snapshot，仅 declared use。 |
| source refresh event 是否被偷渡 | `pass` | job不接受 event payload；conditional inbound仍封闭。 |
| Step 9 承接 | `pass` | exact snapshot→resolver→new context/invalidation→gap/trace/replay。 |

### 7.7 `RebuildImageDerivedViews`

#### 7.7.1 用途

从 committed local truth 重建一个显式 projection key 的既有 `ImageDerivedReadModel` / `ProjectionFreshness`。它是唯一可请求 rebuild 的 bounded job surface，但不修复 truth、不读取 cache/fake/owner body作为 source、不以 rebuild 成功宣布 readiness，也不自动创建由 query 缺失触发的 view。

#### 7.7.2 函数签名 / 路由

| 项 | 内容 |
|---|---|
| 函数签名 | `handle_rebuild_image_derived_views(ImageOperationsJobRequest<RebuildImageDerivedViewsRequest>) -> Result<ImageOperationsJobResult, ImageProtocolError>` |
| 触发方式 | bounded `jobs` caller；scheduler 未绑定。 |
| 处理方 | `application::ProjectionRebuilder`。 |
| 依赖 port | `ImageEntryBoundaryPort`、`ImageProjectionRepositoryPort`、`CommittedImageTruthSnapshotPort`、`ImageIdGeneratorPort`、`ImageClockPort`、idempotency/replay port。 |
| 影响对象 | existing/new local `ProjectionFreshness` and derived view only, trace/replay；不写 DefinitionAssembly/BuildCandidate/Qualification/Supply truth。 |

#### 7.7.3 请求 schema

```rust
/// RebuildImageDerivedViews 的 bounded request body.
pub struct RebuildImageDerivedViewsRequest {
    /// Must select one explicit safe projection family and optional typed variant scope.
    pub scope: ImageJobScopeSelector,
}
```

| 输入字段 | 类型 | 读取目标 | 缺失 / 冲突处理 |
|---|---|---|---|
| `scope` | `ImageJobScopeSelector` | 必须为 `Projection(ImagePublicProjectionKey)` → `ImageProjectionLookupKey` | 其它 variant=`ContractViolation`；不从 query/cursor推 key。 |
| existing view/marker | Step 7 projection reads | existing read model/freshness + committed truth snapshot | no existing view/marker=`NoOp`/`Blocked` per marker policy；不能由 query/create side effect补造。 |
| `actor` / `metadata` | shared job envelope | System actor、context、replay | missing=`ContractViolation`。 |

#### 7.7.4 响应 schema与构造闭环

application 检查 `ProjectionReadOnlyGuard`，从 `CommittedImageTruthSnapshotPort.load_committed_truth_snapshot` 取得同 key truth，才可使 existing freshness begin/rebuild/mark fresh 或 mark unavailable，并通过 `ImageDerivedReadModel::from_truth/rebuild` 写入 projection store。`items.subject_ref` 是 existing derived-view 或 freshness local ref；真实 domain subject 仅列在 `effects.changed_subject_refs` / marker source refs，不得被 job回写。

| 条件 | `ImageJobOutcomeKind` / object effect |
|---|---|
| existing view/marker不存在 | `NoOp`；不代表 projection fresh或创建成功。 |
| committed truth snapshot完整且 guard通过 | `Applied` + projection/freshness local updates；Fresh仅读侧watermark一致。 |
| truth snapshot/gap阻断 | `Blocked` + projection gap；不读取cache补 view。 |
| rebuild/store unavailable | `Unavailable`，marker可按同一 UoW安全标记不可用；不改 truth。 |
| truth/result无法确定 | `Unknown`；不声明 fresh。 |

#### 7.7.5 错误映射

| 条件 | protocol result |
|---|---|
| projection key mapper错误 | `ContractViolation`。 |
| source不是 committed truth | `ContractViolation`；不得用 projection/cache/fake。 |
| freshness/version conflict | `Conflict`；不 last-write-wins。 |
| duplicate | `DuplicateReplay`；不 rebuild第二次。 |

#### 7.7.6 幂等与审计要求

canonical 顺序为 `OperationsJob -> RebuildImageDerivedViews -> projection_kind -> variant_ref (explicit None when catalog/gap scope)`。watermark、view content、clock、run ID、cache state和item count都不进入 identity。trace可记录 existing view/freshness refs与 committed local subject refs；不记录 source body、report或 readiness evidence。

#### `RebuildImageDerivedViews` 停审记录

| 审查项 | 结论 | 缺口 / 后续 |
|---|---|---|
| truth→projection 单向性 | `pass` | only committed truth port；no writeback。 |
| query-time create/rebuild 是否被阻止 | `pass` | rebuild仅由该 bounded job请求。 |
| Step 9 承接 | `pass` | key→existing marker→truth snapshot→read-only guard→projection save/replay。 |

### 7.8 `ReconcileArtifactAndConsumerHandoffs`

#### 7.8.1 用途

对已经持久化的 `ArtifactHandoffRecord`（Pending/Gap）和 `ConsumerHandoffGap`（Open/Stale）做受限 recheck。它不创建 Artifact consumable ref、不接受 Artifact handoff、不解析 Member Service manifest/variant/ref/confirmation、不调用 `ConsumerHandoffGap::resolve`，也不影响 local entry availability。当前工作只能维持/新建 local gap context、mark stale或返回 reopen/unavailable。

#### 7.8.2 函数签名 / 路由

| 项 | 内容 |
|---|---|
| 函数签名 | `handle_reconcile_artifact_and_consumer_handoffs(ImageOperationsJobRequest<ReconcileArtifactAndConsumerHandoffsRequest>) -> Result<ImageOperationsJobResult, ImageProtocolError>` |
| 触发方式 | bounded `jobs` caller；无 delivery/retry scheduler。 |
| 处理方 | `application::QualificationCoordinator` + `AvailabilityCoordinator` 的受控 facade。 |
| 依赖 port | `ImageEntryBoundaryPort`、`QualificationRepositoryPort::list_reconcilable_artifact_handoffs`、`SupplyEntryRepositoryPort::list_reconcilable_consumer_handoff_gaps`、`QualificationBoundaryPort`、`MemberServiceSupplyPort`、idempotency/replay port。 |
| 影响对象 | local handoff record/gap/trace/replay；不得写 Artifact owner truth、consumer confirmation或 entry state。 |

#### 7.8.3 请求 schema

```rust
/// ReconcileArtifactAndConsumerHandoffs 的 bounded request body.
pub struct ReconcileArtifactAndConsumerHandoffsRequest {
    /// Must select exactly one Artifact or consumer handoff family and its explicit bounded page.
    pub scope: ImageJobScopeSelector,
}
```

| 输入字段 | 类型 | 读取目标 | 缺失 / 冲突处理 |
|---|---|---|---|
| `scope.target` | `ImageHandoffJobTarget` | `ArtifactHandoffs` → `list_reconcilable_artifact_handoffs(page)`；`ConsumerHandoffGaps` → `list_reconcilable_consumer_handoff_gaps(page)` | 必须精确选择一族；不提供 bool 双选、隐式 union、post-filter或默认全选。Consumer 分支在 MI-UP-001 下仅读 local gap，不读 Member Service body。 |
| `scope.page` | `ImageJobPageRequest` | application mapper → selected repository 的 `ImageRepositoryPageRequest { after, limit }` | `after=None` 明确第一页；malformed token、0/超限 limit=`ContractViolation`；不得使用 scheduler cursor、默认 batch或全表 scan。 |
| `actor` / `metadata` | shared job envelope | System actor、context、replay | missing=`ContractViolation`。 |

#### 7.8.4 响应 schema与构造闭环

Artifact item先以 exact local record访问 `QualificationBoundaryPort`；当前 `Gap` / `Unavailable` / `ReopenRequired` 只能保存/保持 `ArtifactHandoffRecord::Pending/Gap` 与 local `ContractGap`。Consumer item先以 exact local gap访问 `MemberServiceSupplyPort::assess_gap_reopen`；当前 `Gap` / `Unavailable` / `ReopenRequired` 只能保持 Open 或 mark Stale，并且 `Resolved` factory/save 一律不可调用。

| 条件 | `ImageJobOutcomeKind` / object effect |
|---|---|
| selected local records/gaps均不存在 | `NoOp`；不表示 handoff被接受或consumer无需求。 |
| owner boundary仍 pending/gap | `Blocked` + local gap disposition；不形成 Artifact/consumer positive ref。 |
| owner boundary unavailable/unknown | `Unavailable` / `Unknown`；不转换为 failed/accepted/resolved。 |
| formal future contract尚未重新审阅 | `Blocked` + reopen reason；不调用 resolve/accept。 |

#### 7.8.5 错误映射

| 条件 | protocol result |
|---|---|
| Artifact/consumer local ref wrong kind | `ContractViolation`；不跨类型替代。 |
| current gap/relation version conflict | `Conflict`；不覆盖 history。 |
| current port returns positive confirmation/acceptance under pending gate | `ContractViolation`；拒绝该 adapter result。 |
| duplicate | `DuplicateReplay`；不重新调用 external seam。 |

#### 7.8.6 幂等与审计要求

canonical 顺序为 `OperationsJob -> ReconcileArtifactAndConsumerHandoffs -> target -> page.after (explicit None|token) -> page.limit`。不包含 Artifact/consumer body、manifest、delivery receipt、confirmation, run ID、retry count、clock或selected count。page token不是 scheduler cursor、checkpoint或 output。trace只保存 local handoff/gap refs、safe reason和correlation；outbound inventory固定 `NoneAuthorized`。

#### `ReconcileArtifactAndConsumerHandoffs` 停审记录

| 审查项 | 结论 | 缺口 / 后续 |
|---|---|---|
| Artifact / consumer owner truth 是否未被写入 | `pass_with_blockers` | MI-UP-001/007下只维护 local pending/gap/reopen。 |
| local entry availability 是否保持独立 | `pass` | consumer gap不回写 Available entry。 |
| Step 9 承接 | `pass` | bounded local lists→non-positive seam assessment→gap/record disposition→replay。 |

### 7.9 Operations Job 协议族停审（8.5）

| 审查项 | 结论 | 证据 / 后续 |
|---|---|---|
| 六个 Job 是否各有 trigger/input/output/幂等 | `pass` | §7.3~§7.8 每项有 bounded request、result、scope、canonical/error/audit 和 Step 9承接。 |
| job I/O 二级类型是否闭合 | `pass` | `ImageOperationsJobRequest`、scope selector、outcome、per-subject disposition、result均有 Rust schema/归属。 |
| scheduler/run/report/evidence 是否未被建模 | `pass` | 所有相应字段明确禁止；job result不是 report。 |
| duplicate 是否不重复 selection/action | `pass` | exact `OperationsJob` channel/replay rule；stored `JobDisposition` body。 |
| 外部 positive effect 是否保持 pending | `pass_with_blockers` | builder、gate、Artifact、consumer仍按 Q-MI/MI-UP gates处理，不宣称 success。 |
| Step 9 承接 | `pass` | 每 job都可独立展开 bounded flow；不得在 flow新增 schedule/run/report。 |

## 8. 8.6 跨协议 public surface 闭环审计

### 8.1 SOP 问题回答、材料诊断与本步取舍

| Step 8 SOP 问题 | 收敛回答 | 仍然不能推导的事实 |
|---|---|---|
| 本轮需要哪些协议族 | 10 Command、10 Query、2 个条件入站 boundary、0 个 outbound event、6 个 Operations Job；总表见 §1.1。 | route/RPC/topic、broker、scheduler、已运行实例或任何外部产品绑定。 |
| 调用方/处理方/传输如何表达 | 全部以 logical in-process facade / planned entry 表达；每项有 handler owner 与未绑定 transport 声明。 | API server、worker process、transport authorization 或跨仓 compile dependency。 |
| DTO 是否可构造对象/view/job | Command 逐项回指 Step 6 factory/guard与 Step 7 port；Query 逐项回指 exact/local read、view/page/marker mapper；Job 逐项回指 bounded selector、marker 与 facade。 | 未闭合 owner 的 body、Artifact acceptance、consumer confirmation、真实 build/publish/digest。 |
| Query 的 empty/visibility/freshness 如何处理 | §2.4.1 按全部 10 Query 固定 Complete/Partial/None、projection companion 与 preference；`Visible` 只为 local reachability。 | 授权成功、global absence、Fresh 默认值或 query-time rebuild。 |
| 条件入站如何满足 receipt/envelope 问题 | 因 `MI-UP-005` 未闭口，当前不是 active consumer：没有 envelope/payload/receipt/dedup/quarantine/delay；仅 marker disposition，并以 `accepted_input=false` 防误读。 | 任何 event acceptance、BuildIntent/snapshot write、delivery/offset 或 broker ACK。 |
| Job 的输入/输出/幂等如何闭口 | 公共 request/result、scope、explicit page、canonical order、stored `JobDisposition` replay 和 boundary disposition 已逐项定义。 | scheduler、lease、cursor progress、run/report/evidence/verdict/signoff 或执行事实。 |
| outbound 该如何处理 | inventory 严格为零，只有 `ImageOutboundEventInventory::NoneAuthorized`。 | outbox、publisher、delivery、event DTO/payload/topic 或 outbound flow。 |

| 材料诊断 | 写入前风险 | 本步修正 / 取舍 |
|---|---|---|
| 旧 query 叙述会把 direct truth 的 `freshness=None` 与 Fresh 混读 | `RequireFresh` 可被实现者静默降级，projection truth 与 direct truth 边界失效。 | 明定 `RequireFresh` 只接受已有 Fresh marker；无 companion 的 `RequireFresh` / `InspectMarker` fail-closed。 |
| `read_scope_ref` 容易被当作 authorization | local ref、selector 或 cursor 会越权充当 visibility proof。 | `ImageQueryVisibility::Visible` 改为 local reachability；未闭合 authority 一律 `Unavailable`。 |
| Job enum scope 没有 page | scheduler/default batch/full scan 可能被实现端自行补入。 | 增加 `ImageJobPageRequest`/cursor，并将四个 list scope 显式映射 Step 7 repository page。 |
| Job 与 Step 6 action marker 未逐项对齐 | entry boundary 的 `Declared/Blocked/ReopenRequired` 可能被绕开。 | 增加六行 name→action→marker→port→disposition 的穷尽表。 |
| `ImageOperationName` 是 newtype 而不是 enum | 代码可能按 Debug/route/dynamic string 猜 operation identity。 | 定义 canonical literal → `NonEmptyText::parse` → `ImageOperationName` 的唯一构造规则。 |

### 8.2 协议 → 对象 → Port → Step 9 flow 承接矩阵

下表的 “Step 9 flow” 只是后续**应展开的独立 flow 名称/范围**，不是本轮创建 Step 9 或声称 flow 已实现��每行都必须在 Step 9 重用本 Step DTO/type 名与 Step 6/7 定义，不能新增替代 carrier。

| public surface | Step 6 对象 / guard / marker | Step 7 port / boundary | Step 9 独立 flow 承接 | 当前上限 |
|---|---|---|---|---|
| `DefineImageVariant` | `ImageFamilyDefinition`、`ImageVariantDefinition`、mapping validity guard | Definition repository、ID/clock/UoW/idempotency | family/variant define + mapping snapshot load/guard/save/replay | mapping owner body仍 pending。 |
| `CaptureAssemblyBaseline` | `AssemblyBaseline`、pin/assembly guards、static seed binding | Definition repository、assembly reference resolver | static pin/seed/base resolve + baseline capture/save/replay | runtime/tools/member/extras body与 live state禁止进入。 |
| `ProposeVariantRevision` | `VariantRevision`、completeness/pin guard | Definition repository、ID/clock/UoW/idempotency | revision/baseline exact-load + validate/supersede/save | Buildable 不等 build success。 |
| `RequestBuildIntent` | `BuildIntent`、revision state | Definition/Build repositories、idempotency | buildable revision → local intent only | inbound event trigger仍不可构造。 |
| `RecordBuildOutcome` | `BuildAttempt`、outcome/candidate guard | Build repository、builder/registry safe-observation seam | exact attempt + safe observation → outcome/candidate-or-gap | no provider body/tag/digest guess。 |
| `EvaluateCandidateEligibility` | provenance/gate/eligibility objects and guards | Qualification repository、qualification boundary | candidate chain → local evaluation/decision-or-gap | Q-MI-004 blocks owner gate inventory/evidence body。 |
| `RecordArtifactHandoff` | `ArtifactHandoffRecord`、`ContractGap` | Qualification/referenced-derived repos、Artifact boundary | local handoff observation → Pending/Gap only | MI-UP-007 blocks Accepted/artifact truth。 |
| `PublishInstantiableEntry` | `InstantiableEntry`、`AvailabilityTransition`、entry pin guard | Qualification/Build/Supply repositories | local entry/transition create only | no registry/Member Service delivery/launch。 |
| `TransitionAvailability` | transition/current facts/availability guard | Supply repository、ID/clock/idempotency | append local availability history | no external lifecycle effect。 |
| `RollbackOrRetireEntry` | entry/transition/current facts guard | Supply repository、ID/clock/idempotency | rollback/retire local history and state | no container/registry callback authority。 |
| `GetImageVariantDefinition` | definition/revision refs | Definition + ReferenceDerived reads | query context → exact read → view/surface | direct truth does not satisfy Fresh preference。 |
| `GetAssemblyDerivation` | revision/baseline/static bindings | Definition + ReferenceDerived reads | exact derivation reads → safe view/surface | no template/component body/live state。 |
| `GetBuildTrace` | intent/attempt/outcome/candidate relations | Build + Definition + ReferenceDerived reads | selector → bounded reads → trace view | no builder inspection/recompute。 |
| `GetProvenanceAndEligibility` | provenance/gate/eligibility chain | Build + Qualification reads | candidate → exact chain → view/gap | no gate/evidence owner query。 |
| `ResolveInstantiableEntry` | entry + `ConsumerHandoffGap` | Supply/gap/projection reads | entry/gap read → gap-visible resolution view | no query-created gap or consumer resolve。 |
| `ListAvailableVariants` | local Available entry | Supply/Definition/projection reads + page helper | catalog page → exact labels → public page | local Available only, no consumer readiness。 |
| `GetAvailabilityHistory` | append-only transition | Supply history page helper | variant page → history view | no projection companion; fresh/marker preferences unavailable。 |
| `GetImageTrace` | append-only trace | ReferenceDerived trace page helper | subject page → source-class mapper | no projection companion; fresh/marker preferences unavailable。 |
| `GetContractGaps` | `ContractGap` / `ConsumerHandoffGap` | ReferenceDerived or Supply bounded gap read + page helper | selector → one repository read → typed gap page | no global union/post-filter/new gap。 |
| `GetProjectionFreshness` | `ProjectionFreshness` / read-model relation | projection repository key/view/marker reads | key → existing marker → marker surface | no marker mint/rebuild or business readiness。 |
| `ConsumeVerifiedBuildRequest` | `InboundContractMarker` | `ImageEntryBoundaryPort::inspect_inbound_boundary` | marker inspection only | MI-UP-005 blocks input/envelope/write flow。 |
| `ConsumeVerifiedSourceRefresh` | `InboundContractMarker` | `ImageEntryBoundaryPort::inspect_inbound_boundary` | marker inspection only | MI-UP-005 blocks source/snapshot write flow。 |
| `RunNightlyBuildSweep` | `ImageJobActionMarker` + BuildIntent path | entry boundary, Definition list page, intent facade, replay | boundary → one `BuildableRevisions { page }` → intent disposition | no scheduler/run/build success。 |
| `ReconcileBuildAttempts` | action marker + BuildAttempt/outcome guard | entry boundary, Build list page, builder safe inspection | boundary → one attempt page → outcome facade/disposition | unknown does not retry blindly。 |
| `ReevaluatePendingQualifications` | action marker + qualification objects | entry boundary, Qualification list page/boundary | boundary → one evaluation page → qualification disposition | no gate inventory/pass default。 |
| `RefreshExternalReferenceSnapshots` | action marker + external snapshot/gap | entry boundary, ReferenceDerived exact read/resolver | boundary → exact snapshot → declared-use resolution | no event payload/source body。 |
| `RebuildImageDerivedViews` | action marker + projection/freshness/read model | entry boundary, projection + committed truth ports | boundary → existing projection → rebuild from committed truth | no query-triggered creation/readiness。 |
| `ReconcileArtifactAndConsumerHandoffs` | action marker + handoff/gap objects | entry boundary, selected handoff page, non-positive external seams | boundary → one target/page → gap/pending disposition | no accept/resolve/confirm/delivery。 |

### 8.3 Public secondary type、Rustdoc、page 与命名审计

| 审计项 | 结论 | 证据 / 不满足时处置 |
|---|---|---|
| public struct/enum/field Rustdoc | `pass` | 本 Step 的 Rust code blocks 中每个 public struct/enum/field 均有 Rustdoc；新增 type/field 未带 Rustdoc 视为 Step 8 contract defect。 |
| contracts/domain 依赖方向 | `pass` | public DTO 使用 contracts-owned type 或 explicit domain→protocol mapper；不把 `ProjectionKind`、lifecycle domain enum 或 application `ImageOperationName` 直接暴露。 |
| public read-model identity | `pass` | `ImageDerivedReadModelRef` 仅作为 `ImagePublicReadModelRef.local_ref` 的内层字段；query 只能读取 existing index，不能 mint。 |
| trace source 名称唯一 | `pass` | `ImageTraceSourceView` 只定义一次，local/external source 分型；external ref 不强转 local ref。 |
| command/result/replay | `pass_with_pending_canonicalizer` | command/job 使用 one canonical order + stored result kind；canonicalizer implementation与完整 replay recovery仍留 Step 13/12，不能借此伪造 digest。 |
| Query content-state | `pass` | §2.4.1 全部 10 Query 定义 Complete/Partial/None；`Partial` 仅在指定安全字段 + typed gap 下允许。 |
| Query visibility/freshness | `pass_with_pending_authority` | `Visible` 不等 authorization；未闭合 scope authority为 `Unavailable`。`RequireFresh` only existing Fresh projection；direct truth/history `freshness=None` 不暗示 Fresh。 |
| public Query page | `pass` | `ImagePublicPageCursor/Info` 映射 Step 7 page helper；internal cursor/version/watermark不泄漏。 |
| job page | `pass` | `ImageJobPageRequest` 只映射 Step 7 `ImageRepositoryPageRequest`；enum list scope 的 `None`/token + limit 全部显式、纳入 canonical identity。 |
| operation name | `pass` | canonical literal → `NonEmptyText::parse` → Step 6 `ImageOperationName`; 禁止 Debug/Display/route/topic/dynamic string 推导。 |
| static seed/template vs live state | `pass` | DTO 只传 template/ref/kind/placement；memory/workspace seed 是静态层输入，不是 live memory/checkpoint/workspace/container state。 |
| typed ref/replay/error mapping | `pass` | local/external/gap refs 不混用；application error→protocol error见 §2.7；duplicate不能重算、unknown不能伪成功。 |

### 8.4 Outbound inventory 与外部边界审计

| 检查 | 结论 | 约束 |
|---|---|---|
| outbound event inventory | `zero_pass` | 唯一允许值为 `ImageOutboundEventInventory::NoneAuthorized`。 |
| publisher/outbox/delivery surface | `zero_pass` | 没有 port、DTO、payload、topic、route、delivery state、retry/receipt或 Step 9 flow；出现任一项必须重开 Step 5/7/8/9/11~13。 |
| local “publish”词 | `pass` | `PublishInstantiableEntry` 仅 local supply history，不是 registry publish、Artifact handoff、Member Service notification 或 message delivery。 |
| Member Service seam | `blocked_pending_MI-UP-001` | 仅 consumer gap/ref direction；无 manifest/variant/ref/qualification/confirmation/instance/launch/health truth。 |
| Artifact seam | `blocked_pending_MI-UP-007_Q-MI-004` | 仅 local Pending/Gap；无 consumable acceptance、lineage、storage/delivery receipt。 |
| inbound seam | `blocked_pending_MI-UP-005` | marker-only，无 envelope/payload/receipt/dedup/positive mutation。 |
| build/governance evidence seam | `blocked_pending_Q-MI-003_Q-MI-004` | safe body-free observation/conclusion only；无 raw log/evidence body、guessed digest或 positive readiness。 |

### 8.5 Pending / blocker ledger

| blocker / pending | 受影响 surface | 当前安全行为 | reopen 条件 |
|---|---|---|---|
| `MI-UP-001` Member Service | `ResolveInstantiableEntry`、consumer gap、handoff reconciliation | local entry/gap 可读；无 consumer positive resolution/confirmation。 | Member Service formal manifest/variant/ref/qualification/confirmation contract 停审后，重开 Step 7~9。 |
| `MI-UP-002/003/006/008` component/mapping/seed/base owner fields | definition/baseline/revision inputs | only static body-free ref/safe conclusion/gap；不复制 owner body或 live state。 | owner schema/compatibility/ref正式闭口后重审 affected resolver/DTO/flow。 |
| `MI-UP-004` Core metadata/authority | actor/metadata boundary | neutral local carrier，actor/ref不等 auth。 | Core exact mapping/authority正式闭口后重开 metadata/authorization design。 |
| `MI-UP-005` inbound event | two conditional inbound boundaries | marker-only/unavailable/rejected/reopen; no envelope/receipt/dedup/write. | event family, owner, identity/version, schema, dedup/receipt and transport semantics正式闭口后重开 Step 7~9。 |
| `MI-UP-007` Artifact handoff | record/reconcile Artifact surfaces | Pending/Gap only; no accepted Artifact ref/lineage/delivery. | Artifact consumable handoff schema/resolution正式闭口后重开 Step 7~9。 |
| `MI-UP-009` outbound | all command/job effects | inventory zero; no outbox/publisher/delivery. | owner/consumer/schema/version/delivery failure semantics正式闭口后按多 Step重开。 |
| `Q-MI-003/004` builder/gate/evidence | outcome/qualification/job recheck | safe observation/conclusion and non-positive disposition only; no evidence body/gate inventory/digest guess. | formal policy/adapter/schema and acceptance criteria close, then re-audit affected positive lanes. |

### 8.6 正式 `03-详细设计.md` 回填草稿（禁止当前装配）

> 正式回填位置：第 6 章全局对象 / Trait / API 索引与第 7 章 API / Command / Query / Event / Job 协议契约。当前项目级、文档级门禁均不允许装配正式 `03-详细设计.md`；本节只是未来 assembly 的引用清单，不生成正式正文。

```md
> 校准来源：
> - `design-calibration/03_ddd_step_06_object_contracts.md`
> - `design-calibration/03_ddd_step_07_trait_port_adapter_contracts.md`
> - `design-calibration/03_ddd_step_08_protocol_contracts.md`
>
> 延伸阅读：
> - 阅读 Step 8 §2.4.1、§7.1.1、§8.2~§8.5，了解 Query 可见性/新鲜度、Job 边界、public type 审计与 pending 上限。

### 7. API / Command / Query / Event / Job 协议契约

本仓仅定义 logical in-process protocol surface：10 个 Command、10 个 Query、2 个 fail-closed conditional inbound boundary 与 6 个 bounded Operations Job。所有外部 route、RPC、topic、event envelope、scheduler 与产品绑定均未定义。Command/Job 返回只含 local typed refs、safe states/reasons、gap refs 和 `NoneAuthorized` outbound inventory；Query 只读 committed truth 或 existing projection。`Visible` 仅表示 local read reachability，`RequireFresh` 只接受已有 Fresh projection；direct truth/history 的 `freshness=None` 不表示 Fresh。outbound event inventory 为严格零；Member Service、Artifact、inbound event、builder/evidence/gate 的未闭合对端合同均以 gap/blocker 表示。
```

### 8.7 Step 8 completion checklist 与停审门禁

| 检查项 | 结论 | 说明 |
|---|---|---|
| Step 8 SOP 输出清单 | `pass` | 总表、批次、独立协议、签名、schema、field/object mapping、Query view/page/marker、error/idempotency、族停审与跨协议审计均在本文件。 |
| 10 Command / 10 Query / 2 inbound / 0 outbound / 6 Job inventory | `pass` | 与 §1.1 和各独立小节一致；outbound 为设计性的严格零。 |
| DTO → object → port → future flow chain | `pass_with_pending_external_owners` | §8.2 完整回指；待关闭 owner 仅留下 gap/reopen，未伪造正向合同。 |
| query completeness/visibility/freshness/page | `pass` | §2.4.1 及 query 小节锁定 no-write、page、Fresh/direct truth 和 authority fail-closed 规则。 |
| public secondary type / naming / Rustdoc | `pass` | §8.3 记录唯一名称、inner ref、cursor、operation-name constructor 和 rustdoc 审计。 |
| static template/seed 与 live state 分离 | `pass` | 只承接 static ref/kind/placement；禁止 live memory/checkpoint/workspace/container state。 |
| Job bounded/page/boundary/replay | `pass` | §7.1/§7.1.1 规定 explicit page、marker/port disposition、stored replay；无 schedule/run/report。 |
| outbound absence | `pass` | §6 与 §8.4 双重零库存；无 outbox/publisher/delivery/event payload。 |
| implementation/verification facts | `not_created_by_design` | 未创建实现仓、Cargo、commit、run ID、artifact digest、report、evidence alias、test result、verdict、signoff 或 readiness。 |
| 正式 03 装配 | `blocked` | Step 19 前禁止；本轮不读取旧正式 03。 |
| 下一 Step | `waiting_user_confirmation` | Step 8 现转为 `completed_stop_review`；未经用户再次明确确认不得创建 `03_ddd_step_09_function_flows.md`。 |

```text
step_08_status = completed_stop_review
next_allowed_action = wait_for_explicit_user_confirmation_for_step_09
step_09_creation_allowed = false
formal_03_assembly_allowed = false
implementation_allowed = false
commit_required = false
```
