# Step 8. 定义 API / Command / Query / Event / Job 协议契约

> 对应 SOP：`standards/document/详细设计讨论流程_SOP.md` Step 8
> 对应书写规范：`standards/document/详细设计书写规范.md` §4、§5.7
> 粒度 / 格式参考：`projects/L1-governance/design-calibration/03_ddd_step_08_protocol_contracts.md`；只借鉴其按协议族、字段来源、闭环审计和停审记录的粒度，不继承 Governance truth、outbox、CloudEvents route 或物理实现。
> 回填目标：未来正式 `projects/L2-member/03-详细设计.md` §7「API / Command / Query / Event / Job 协议契约」。本文件是 calibration 中间产物，禁止直接替代正式正文。
> 状态：`completed / pass_with_upstream_blockers / stop_review`。本文件完成后停审；不得在未获新的明确确认前创建 Step 9。

## 1. Step 状态与执行边界

| 项 | 记录 |
|---|---|
| 前序门禁 | Step 5、6、7 已完成并停审；模块、对象、Port / Store、logical UoW、Job report 基础已收稳。 |
| 本步授权 | 用户于 2026-08-31 明确同意进入 Step 8；仅可完成本 Step，完成后必须停审。 |
| 本步目标 | 将 10 个 Command、16 个 Query、14 个 Inbound Consumer、24 个 semantic outbound event candidate、5 个 Operations Job 收敛为可逐项回指的 typed protocol contract，并闭合 facade / service callable surface、selector / source map、typed replay。 |
| 本步不做 | 不编辑正式 `03-详细设计.md`；不实现代码；不选择 HTTP/RPC/UDS/IPC transport、Bus topic、CloudEvents envelope、scheduler、DB、queue、outbox、retry 或外部 adapter；不进入 Step 9 函数级 flow。 |
| 正向主语 | 所有 Command / Query / 本地写入 Consumer 的正向执行主语必须是 `ProjectMemberRef + GlobalMemberRef`；无法取得双锚时只能返回 blocked / not-visible / not-available。 |
| 依赖分类 | `core-contracts` 仍是唯一 planned compile candidate；host、Runtime、Bus、Governance、Tools、Method、Conversation、Observation、member-service、member-images 均为 runtime / event / ref / adapter 边界，不是 Cargo dependency。 |
| 上游 blocker | `L2M-UP-001~008`、`L2M-DDD-001~002` 原样保留，见 §14；它们阻塞 exact external/physical activation、route、正向 integration、物理 persistence 与 evidence，不阻塞本步已闭合的 blocked-aware logical typed schema。 |

### 1.1 分批计划

| 批次 | 内容 | 状态 |
|---:|---|---|
| 8.0 | shared protocol helper、协议总表、命名与 transport-neutral 红线 | completed |
| 8.1 | Command envelope、10 个 Command body / result / rejection、owner service 映射 | completed |
| 8.2 | Query envelope、16 个 Query body / response、visibility / page / selector source map | completed |
| 8.3 | external / committed-fact Consumer envelope、14 个 receipt、duplicate / unsupported / blocked 语义 | completed |
| 8.4 | 24 个 blocked semantic outbound event candidates | completed |
| 8.5 | 5 个 Job input / output / report / replay contract 与 owner service 映射 | completed |
| 8.6 | facade / nine service exact callable methods、digest / result-store closure、跨协议审计与 gate | completed |

## 2. SOP 问题回答

| SOP 问题 | 本项目回答 |
|---|---|
| 哪些协议必须进入本步？ | HLD 已冻结的 10 Command、16 Query、14 Consumer、24 semantic event candidate、5 Job 全部进入；不新增第 6 个 Job，也不把内部 invariant helper 升格为协议。 |
| 协议如何分批？ | 按 Command、Query、Consumer、blocked Event、Job 五族分批；每族先固定 shared carrier，再逐项写 body、结果、错误、owner 和来源。 |
| public DTO 二级类型如何闭合？ | 每个进入 public DTO 的类型必须是 Step 6 已定义的 `contracts` 类型，或在本文件以 planned `contracts` carrier 明确 schema；application-local `MemberRepositoryPage`、UoW、Port error 不得泄漏。 |
| Command 与 Consumer 如何幂等？ | Command 使用 Core `IdempotencyKey`；external Consumer 使用 `DeduplicationKey`；committed-fact Consumer 使用已提交 fact identity；三者统一进入唯一 `MemberIdempotencyStore::reserve`，但以不同 typed result kind 保存 / 回放。 |
| Query 是否能触发维护动作？ | 不能。Query 永远 no-write，不 reserve、refresh、rebuild、reconcile、调用 handoff / resolver adapter 或扫描当前外部状态。 |
| duplicate 如何保证同构？ | duplicate 只读取与 reservation 中 `result_kind`、operation、channel、digest、result_ref 完全匹配的完整 stored carrier；缺失或错配 fail closed，不重跑、不重建、不读取 fake 私有 map。 |
| Event 是否已经可以接 Bus？ | 不能。24 个 outbound event 仅登记 semantic candidate；`L2M-UP-005` 未关闭前不定义 envelope、payload、source、subject、route、topic、publisher、outbox 或 delivery success。 |
| Job 是否等于 scheduler run？ | 不是。Job 只表达 logical continuation；`JobRunRef` / `MemberJobInvocationRef` 不是真实 run、process、artifact、evidence、report、signoff 或 readiness。 |

## 3. 协议总分母与 owner service

### 3.1 Command / Query / Consumer / Job inventory

| 协议族 | 数量 | owner service / 归属 |
|---|---:|---|
| Command | 10 | Presence 3、Host 1、Subscription 2、Runtime 2、External Mirror 2 |
| Query | 16 | Presence 1、Host 1、Subscription 1、Inbound 1、Runtime 2、Outbound 2、Interaction Trace 3、External Mirror 2、Read Model 3 |
| external Consumer | 10 | Host 1、Inbound 1、Runtime 1、Outbound 1、Interaction Trace 1、External Mirror 5 |
| committed-fact Consumer | 4 | Outbound 1、Interaction Trace 1、Read Model 2 |
| semantic outbound event candidate | 24 | CP01 3、CP02 3、CP03 4、CP04 4、CP05 4、CP06 2、CP07 4；全部 blocked |
| Operations Job | 5 | Outbound 1、Interaction Trace 1、External Mirror 1、Read Model 2 |

### 3.2 固定名称清单

**Commands（10）**

`AdmitMemberStartup`；`EstablishMemberPresence`；`TransitionMemberPresence`；`PrepareHostCollaboration`；`EstablishSubscriptionScope`；`ReplaceSubscriptionScope`；`SubmitScreenedFactToRuntime`；`LinkRuntimeAdmissionResult`；`ResolveExternalContext`；`RequestExternalContextRefresh`。

**Queries（16）**

`GetMemberPresence`；`GetHostCollaborationPosture`；`GetCurrentSubscriptionScope`；`GetScreeningDisposition`；`GetRuntimeMediationPosture`；`GetRuntimeMaterialReception`；`GetOutboundDecision`；`GetPublicationPosture`；`GetInteractionTrace`；`ListInteractionGaps`；`GetObservationPosture`；`GetExternalContextResolution`；`ListExternalContextGaps`；`GetMemberSummary`；`GetCapabilityOutlet`；`GetMemberDiagnostics`。

**Consumers（14）**

`HostFeedbackConsumer`；`InboundFactConsumer`；`RuntimeMaterialConsumer`；`DeliveryFeedbackConsumer`；`ObservationFeedbackConsumer`；`SubjectIdentityContextUpdateConsumer`；`PolicyContextUpdateConsumer`；`RuntimeBoundaryContextUpdateConsumer`；`CapabilityContextUpdateConsumer`；`HostRouteContextUpdateConsumer`；`RuntimeMaterialReceptionConsumer`；`MemberCommittedFactConsumer`；`MemberProjectionUpdateConsumer`；`CapabilityOutletSourceUpdateConsumer`。

**Jobs（5）**

`PublicationRelay`；`ObservationRelay`；`ExternalContextRefresh`；`MemberProjectionRebuild`；`GapReconciliation`。

## 4. Shared protocol helpers

本节的 generic 只用于“已列举的有限 typed carrier”复用，不能形成 `execute(operation, payload)`、service locator、字符串路由或无界 payload。

### 4.1 subject、metadata、protocol name

```rust
/// 绑定本仓所有正向操作的双锚执行主语。
pub struct MemberSubjectAnchor {
    /// 项目型成员的唯一运行态引用。
    pub project_member_ref: ProjectMemberRef,
    /// 与项目成员关联的全局身份锚点。
    pub global_member_ref: GlobalMemberRef,
}

/// 10 个 Command 的有限名称集合。
pub enum MemberCommandName {
    /// 启动准入。
    AdmitMemberStartup,
    /// 建立成员 presence。
    EstablishMemberPresence,
    /// 显式迁移成员 presence。
    TransitionMemberPresence,
    /// 制备宿主协作材料。
    PrepareHostCollaboration,
    /// 建立订阅范围。
    EstablishSubscriptionScope,
    /// 替换订阅范围。
    ReplaceSubscriptionScope,
    /// 提交已筛选事实到 Runtime。
    SubmitScreenedFactToRuntime,
    /// 关联 Runtime admission 结果。
    LinkRuntimeAdmissionResult,
    /// 解析一个 owner-specific 外部上下文。
    ResolveExternalContext,
    /// 登记一次外部上下文刷新请求。
    RequestExternalContextRefresh,
}

/// 16 个 Query 的有限名称集合。
pub enum MemberQueryName {
    /// 读取 presence。
    GetMemberPresence,
    /// 读取宿主协作 posture。
    GetHostCollaborationPosture,
    /// 读取当前订阅范围。
    GetCurrentSubscriptionScope,
    /// 读取筛选 disposition。
    GetScreeningDisposition,
    /// 读取 Runtime mediation posture。
    GetRuntimeMediationPosture,
    /// 读取 Runtime material reception。
    GetRuntimeMaterialReception,
    /// 读取 outbound decision。
    GetOutboundDecision,
    /// 读取 publication posture。
    GetPublicationPosture,
    /// 读取 interaction trace。
    GetInteractionTrace,
    /// 列出 interaction gaps。
    ListInteractionGaps,
    /// 读取 observation posture。
    GetObservationPosture,
    /// 读取外部上下文 resolution。
    GetExternalContextResolution,
    /// 列出外部上下文 gaps。
    ListExternalContextGaps,
    /// 读取成员 summary。
    GetMemberSummary,
    /// 读取 capability outlet。
    GetCapabilityOutlet,
    /// 读取成员 diagnostics。
    GetMemberDiagnostics,
}

/// 表示已通过入口验证的协议来源类别。
pub enum MemberConsumerSourceKind {
    /// 外部 owner 提供的 event / feedback。
    ExternalEvent,
    /// 本仓已经提交的 local fact。
    CommittedFact,
}

/// 公共 Command 输入 envelope；T 只能是 §5 列出的 10 个 body 类型。
pub struct MemberCommandRequest<T> {
    /// trusted actor，由入口边界注入。
    pub actor: ActorContext,
    /// Core command metadata。
    pub metadata: CommandMetadata,
    /// 与 body 一一对应的有限 Command 名称。
    pub command_name: MemberCommandName,
    /// 已校验的具体 Command body。
    pub body: T,
}

/// 公共 Query 输入 envelope；T 只能是 §6 列出的 16 个 body 类型。
pub struct MemberQueryRequest<T> {
    /// trusted actor，由入口边界注入。
    pub actor: ActorContext,
    /// Core query metadata；不得携带 idempotency key。
    pub metadata: QueryMetadata,
    /// 与 body 一一对应的有限 Query 名称。
    pub query_name: MemberQueryName,
    /// 已校验的具体 Query body。
    pub body: T,
}
```

`MemberCommandRequest<T>` / `MemberQueryRequest<T>` 是静态类型复用，不是运行时 generic dispatch。入口必须先把 name 与 T 做编译期 / 显式映射，禁止由字符串、字段顺序、route 或 `TypedRef` 顺序推断服务。

### 4.2 result、rejection、error 与 typed replay surface

```rust
/// Command / Consumer / Job 的保守边界结果分类。
pub enum MemberWriteDisposition {
    /// 本次 application 写入已提交并产生 typed result。
    Accepted,
    /// 入口或 application 拒绝，且没有外部正向结论。
    Rejected,
    /// 依赖合同或装配前提未满足。
    Blocked,
    /// 等待正式 source / feedback / resolution。
    Waiting,
    /// 无法安全证明副作用或来源状态。
    Unknown,
    /// 已读取同一 operation relation 的完整 stored carrier。
    DuplicateReplayed,
    /// 同一 key 仍在另一 logical operation 中。
    InFlight,
    /// 同一 key 与 channel / operation / digest 不匹配。
    Conflict,
}

/// 公开的安全协议问题类别；不携带 SQL、SDK、HTTP、payload 或 stack trace。
pub enum MemberProtocolErrorCode {
    /// 入口 metadata / 双锚 / name 不合法。
    InvalidContext,
    /// public carrier 或 selector 不一致。
    ContractViolation,
    /// schema version 不受支持。
    UnsupportedVersion,
    /// 依赖合同尚未闭合。
    BlockedDependency,
    /// 结果或 receipt 正在等待正式来源。
    WaitingForSource,
    /// 副作用无法证明。
    UnknownSideEffect,
    /// visibility basis 不允许公开。
    NotVisible,
    /// projection 尚未准备好。
    NotReady,
    /// 读取目标不可用。
    NotAvailable,
    /// typed stored carrier 缺失或 kind 不匹配。
    StoredResultUnavailable,
    /// application-level optimistic / idempotency 冲突。
    Conflict,
}

/// 不含自由文本正文的公开协议问题。
pub struct MemberProtocolIssue {
    /// 稳定的安全类别。
    pub code: MemberProtocolErrorCode,
    /// 低敏、低基数原因。
    pub reason_category: SafeReasonCategory,
    /// 可选的项目 blocker 标识。
    pub blocker_id: Option<MemberProjectBlockerId>,
}

/// Command rejection 的完整可重放 carrier。
pub struct MemberCommandRejection {
    /// 被拒绝的有限 Command 名称。
    pub command_name: MemberCommandName,
    /// 结果对应的 operation name。
    pub operation_name: MemberOperationName,
    /// 保守拒绝分类。
    pub disposition: MemberWriteDisposition,
    /// 安全问题集合，ordered-unique。
    pub issues: Vec<MemberProtocolIssue>,
    /// 入口拒绝时可选的 selector；不含 request body。
    pub selector: Option<MemberProtocolSelector>,
}

/// 一次 application accepted Command 的 body-free typed carrier。
pub struct MemberCommandAccepted<T> {
    /// 完整的具体结果 body。
    pub value: T,
    /// 本次提交的 local fact refs。
    pub committed_fact_refs: Vec<MemberCommittedFactRef>,
    /// 本次结果可回指的 trace refs。
    pub trace_refs: Vec<InteractionTraceEntryId>,
}

/// Query visibility 的有限结果集合。
pub enum MemberVisibilityDisposition {
    /// 有正式 visibility basis 且 view 可安全显示。
    Visible,
    /// actor / basis 不允许看到目标。
    NotVisible,
    /// projection 或 source 尚未达到请求的 consistency。
    NotReady,
    /// 可以显示但带 stale / degraded 标记。
    Degraded,
    /// 目标或 owner 当前不可用。
    NotAvailable,
    /// 目标可见但结果集合为空。
    Empty,
    /// 有 view 但已明确过期。
    Stale,
}

/// Query response 共用的安全 surface。
pub struct MemberVisibilitySurface {
    /// visibility / readiness / availability 分类。
    pub disposition: MemberVisibilityDisposition,
    /// 正式 visibility basis；无 basis 时不得为 Visible。
    pub basis_ref: Option<ProjectionVisibilityBasisRef>,
    /// projection freshness；不替代 Store version。
    pub freshness: Option<ProjectionFreshness>,
    /// 安全原因。
    pub reason_category: Option<SafeReasonCategory>,
    /// 可选 redaction profile；不携带正文。
    pub redaction_profile_ref: Option<RedactionProfileRef>,
}

/// 本仓定义的 opaque page request；不泄漏 repository page。
pub struct MemberPageRequest {
    /// 由上一次响应返回的 opaque cursor。
    pub cursor: Option<String>,
    /// 有界返回数量。
    pub limit: u32,
}

/// 公共分页信息。
pub struct MemberPageInfo {
    /// 下一页 opaque cursor。
    pub next_cursor: Option<String>,
    /// 是否仍有后续页。
    pub has_more: bool,
    /// 本页实际返回数量。
    pub returned: u32,
}

/// 公共分页 carrier；body 元素必须是已列出的具体 view。
pub struct MemberPage<T> {
    /// 有序、去重的 public items。
    pub items: Vec<T>,
    /// 公共分页信息。
    pub page: MemberPageInfo,
}
```

`QueryMetadata.page` 若由 Core 提供，只作为 consistency / trace 相关 metadata 的映射输入；本仓不在 Query body 重复承载同一页语义。Core `PageRequest` 字段尚未有权威闭合时，`MemberPageRequest` 仅允许 opaque cursor + bounded limit，不能让 service 解析字符串来决定 subject 或 visibility。

### 4.3 selector 与 source-map vocabulary

```rust
/// Query / Consumer / Job 使用的有限 selector；不是 route 或字符串查询语言。
pub enum MemberProtocolSelector {
    /// 项目成员主体。
    Subject(MemberSubjectAnchor),
    /// 一个 presence 记录。
    Presence(MemberPresenceId),
    /// 一个 host attempt。
    HostAttempt(HostCollaborationAttemptId),
    /// 一个 subscription scope decision。
    SubscriptionScope(SubscriptionScopeDecisionId),
    /// 一个 screening decision。
    Screening(ScreeningDecisionId),
    /// 一个 Runtime delivery decision。
    RuntimeDelivery(RuntimeDeliveryDecisionId),
    /// 一个 Runtime material reception。
    RuntimeMaterialReception(RuntimeMaterialReceptionId),
    /// 一个 outbound decision。
    OutboundDecision(OutboundDecisionId),
    /// 一个 interaction trace / gap。
    Interaction(InteractionTraceEntryId),
    /// 一个 observation attempt / material。
    Observation(ObservationAttemptId),
    /// 一个 external context resolution。
    ExternalResolution(ExternalContextResolutionId),
    /// 一个 member summary / outlet / diagnostic projection。
    Projection(MemberProjectionRecordRef),
}

/// 入口已核验的 source identity；不含 source body。
pub enum MemberConsumerSource {
    /// external source 的 ID、ref、authority 和 schema identity。
    External {
        /// 外部事件 ID。
        source_event_id: SourceEventId,
        /// 外部事件 typed ref。
        source_event_ref: SourceEventRef,
        /// source authority typed ref。
        source_authority_ref: SourceAuthorityRef,
        /// source schema version。
        schema_version: SchemaVersion,
    },
    /// 已提交 local fact 的有限引用。
    Committed {
        /// local committed fact ref。
        fact_ref: MemberCommittedFactRef,
        /// source schema version。
        schema_version: SchemaVersion,
    },
}
```

selector/source map 的正式表见 §5.3、§6.4、§7.4、§9.3、§10.3；每一项都必须写出“selector 从哪里来、selected input 从哪里来、application 不得从哪里猜”。

## 5. Command protocol contracts（10）

### 5.1 Command shared rules

每个 Command 都必须经过以下顺序：入口验证 `MemberCommandRequest<T>` → `MemberOperationContext::from_command(...)` → canonical digest → 唯一 `MemberIdempotencyStore::reserve(...)` → 根据 reservation 分类 → 仅 `Reserved` 才进入对应 named service → 在同一 logical UoW 保存完整 typed result / rejection → `complete(...)`。入口拒绝发生在 context / name / 双锚 / metadata gate 之前时，不创建 idempotency relation；已有合法 relation 后的 application rejection 必须保存完整 `MemberCommandRejection` 并可 typed replay。

```rust
/// Command application 的完整 outcome；T 只实例化为 §5.2 列出的具体结果。
pub enum MemberCommandOutcome<T> {
    /// 本次 Command 已提交 local truth。
    Accepted { result_ref: MemberOperationResultRef, value: MemberCommandAccepted<T> },
    /// application 在合法 relation 内拒绝了请求。
    Rejected { result_ref: MemberOperationResultRef, rejection: MemberCommandRejection },
    /// 依赖 / 合同 blocker 使本次操作保守停止。
    Blocked { result_ref: MemberOperationResultRef, rejection: MemberCommandRejection },
    /// 等待正式 source / feedback 的保守结果。
    Waiting { result_ref: MemberOperationResultRef, rejection: MemberCommandRejection },
    /// 副作用无法证明的保守结果。
    Unknown { result_ref: MemberOperationResultRef, rejection: MemberCommandRejection },
    /// 从同一 completed relation 读取完整 typed carrier。
    DuplicateReplayed { result_ref: MemberOperationResultRef, value: MemberCommandAccepted<T> },
    /// 同 key 仍被其它操作占用；不创建新结果。
    InFlight { record_ref: MemberIdempotencyRecordId, issue: MemberProtocolIssue },
    /// 同 key 的 channel / operation / digest 不一致；不改写旧 relation。
    Conflict { record_ref: MemberIdempotencyRecordId, issue: MemberProtocolIssue },
}

/// 将十个 Command 的结果 body 收敛为有限、可持久化的 typed union。
pub enum MemberStoredCommandValue {
    /// `AdmitMemberStartup` 的结果。
    StartupAdmission(StartupAdmission),
    /// `EstablishMemberPresence` 或 `TransitionMemberPresence` 的结果。
    MemberPresence(MemberPresence),
    /// `PrepareHostCollaboration` 的结果。
    HostCollaboration(HostCollaborationCommandValue),
    /// `EstablishSubscriptionScope` 或 `ReplaceSubscriptionScope` 的结果。
    SubscriptionScope(SubscriptionScopeDecision),
    /// `SubmitScreenedFactToRuntime` 的结果。
    RuntimeDelivery(RuntimeDeliveryCommandValue),
    /// `LinkRuntimeAdmissionResult` 的结果。
    RuntimeResultLink(RuntimeResultLink),
    /// `ResolveExternalContext` 的结果。
    ExternalContext(ExternalContextCommandValue),
    /// `RequestExternalContextRefresh` 的结果。
    ExternalRefresh(ExternalRefreshCommandValue),
}

/// `PrepareHostCollaboration` 的 typed result body。
pub struct HostCollaborationCommandValue {
    /// 已提交的 immutable host material。
    pub material: HostCollaborationMaterial,
    /// 与 material 配对的 local attempt。
    pub attempt: HostCollaborationAttempt,
}

/// `SubmitScreenedFactToRuntime` 的 typed result body。
pub struct RuntimeDeliveryCommandValue {
    /// member-side delivery decision。
    pub decision: RuntimeDeliveryDecision,
    /// local submission attempt。
    pub attempt: RuntimeSubmissionAttempt,
    /// 同步获得且经 owner 验证的结果 link；异步情形为 None。
    pub result_link: Option<RuntimeResultLink>,
}

/// `ResolveExternalContext` 的 typed result body。
pub struct ExternalContextCommandValue {
    /// 新捕获的 immutable source snapshot。
    pub snapshot: ExternalContextSnapshot,
    /// purpose-specific neutral resolution。
    pub resolution: ExternalContextResolution,
    /// 无法正向解析时的 gap；正向 completed 时为 None。
    pub gap: Option<ExternalContextGap>,
}

/// `RequestExternalContextRefresh` 的 typed result body。
pub struct ExternalRefreshCommandValue {
    /// 新登记的 refresh request reference。
    pub refresh_request_ref: ExternalRefreshRequestRef,
    /// 当前需要继续处理的 gap。
    pub gap: ExternalContextGap,
}

/// 十个 Command 的 stored carrier；rejection 与 accepted value 分离保存。
pub enum MemberStoredCommandCarrier {
    /// 完整 accepted / conservative result body。
    Value(MemberStoredCommandValue),
    /// 完整 application rejection body。
    Rejection(MemberCommandRejection),
}
```

`MemberStoredCommandCarrier` 的每个 enum variant 都是可独立 replay 的二级类型；不能以 JSON `Value`、`String`、`MemberStoredResultSurfaceRef`、当前 domain truth 或 adapter response 替代。

### 5.1A Command body 的 typed 别名与 application result

以下别名只把表格中的字段集合命名为可实现的 DTO；它们不是 transport request，也不允许附加未列字段。

```rust
/// `AdmitMemberStartup` body。
pub type AdmitMemberStartupBody = StartupAdmissionCommandInput;
/// `EstablishMemberPresence` body。
pub type EstablishMemberPresenceBody = EstablishPresenceCommandInput;
/// `TransitionMemberPresence` body。
pub type TransitionMemberPresenceBody = TransitionPresenceCommandInput;
/// `PrepareHostCollaboration` body。
pub type PrepareHostCollaborationBody = PrepareHostCommandInput;
/// `EstablishSubscriptionScope` body。
pub type EstablishSubscriptionScopeBody = EstablishScopeCommandInput;
/// `ReplaceSubscriptionScope` body。
pub type ReplaceSubscriptionScopeBody = ReplaceScopeCommandInput;
/// `SubmitScreenedFactToRuntime` body。
pub type SubmitScreenedFactToRuntimeBody = SubmitRuntimeCommandInput;
/// `LinkRuntimeAdmissionResult` body。
pub type LinkRuntimeAdmissionResultBody = LinkRuntimeResultCommandInput;
/// `ResolveExternalContext` body。
pub type ResolveExternalContextBody = ResolveExternalContextCommandInput;
/// `RequestExternalContextRefresh` body。
pub type RequestExternalContextRefreshBody = RequestExternalRefreshCommandInput;

/// Command application 返回给 protocol mapper 的 typed result。
pub struct MemberCommandApplicationResult<T> {
    /// accepted / rejected / blocked 等有限 disposition。
    pub disposition: MemberWriteDisposition,
    /// fresh operation 或 duplicate replay 使用的完整 typed result ref。
    pub result_ref: Option<MemberOperationResultRef>,
    /// accepted 时的具体 result body。
    pub value: Option<MemberCommandAccepted<T>>,
    /// 非正向分支的完整 rejection；`InFlight` / `Conflict` 在 entry 层另行返回。
    pub rejection: Option<MemberCommandRejection>,
}

/// 启动准入输入字段。
pub struct StartupAdmissionCommandInput {
    /// 双锚执行主语。
    pub subject: MemberSubjectAnchor,
    /// startup context 的 owner ref。
    pub startup_context_ref: StartupContextRef,
    /// 可选的凭据验证 ref。
    pub credential_ref: Option<CredentialRef>,
}

/// 建立 presence 输入字段。
pub struct EstablishPresenceCommandInput {
    /// 双锚执行主语。
    pub subject: MemberSubjectAnchor,
    /// 已 accepted admission 的 local ID。
    pub startup_admission_id: StartupAdmissionId,
    /// 明确的 local start context。
    pub start_context: PresenceStartContext,
}

/// presence transition 输入字段。
pub struct TransitionPresenceCommandInput {
    /// 双锚执行主语。
    pub subject: MemberSubjectAnchor,
    /// 要迁移的 presence ID。
    pub presence_id: MemberPresenceId,
    /// 目标状态。
    pub target_status: MemberPresenceStatus,
    /// 迁移原因类别。
    pub reason: PresenceTransitionReason,
    /// 来自同一 Store 读取的期望版本。
    pub expected_revision: ExpectedRevision,
}

/// 宿主协作材料输入字段。
pub struct PrepareHostCommandInput {
    /// 双锚执行主语。
    pub subject: MemberSubjectAnchor,
    /// 已提交 presence ID。
    pub presence_id: MemberPresenceId,
    /// 材料用途种类。
    pub kind: HostCollaborationKind,
    /// 明示的协作目的。
    pub purpose: InteractionPurpose,
    /// 低敏状态类别。
    pub safe_status_category: SafeStatusCategory,
}

/// 建立 scope 输入字段。
pub struct EstablishScopeCommandInput {
    /// 双锚执行主语。
    pub subject: MemberSubjectAnchor,
    /// current presence ID。
    pub presence_id: MemberPresenceId,
    /// 要建立的 scope。
    pub scope: MemberSubscriptionScope,
    /// CP06 已提交 resolution ID。
    pub resolution_id: ExternalContextResolutionId,
}

/// 替换 scope 输入字段。
pub struct ReplaceScopeCommandInput {
    /// 双锚执行主语。
    pub subject: MemberSubjectAnchor,
    /// 被替换的 decision ID。
    pub decision_id: SubscriptionScopeDecisionId,
    /// 来自同一 Store 的期望版本。
    pub expected_revision: ExpectedRevision,
    /// successor scope。
    pub scope: MemberSubscriptionScope,
    /// CP06 已提交 resolution ID。
    pub resolution_id: ExternalContextResolutionId,
}

/// Runtime submission 输入字段。
pub struct SubmitRuntimeCommandInput {
    /// 双锚执行主语。
    pub subject: MemberSubjectAnchor,
    /// 已筛选 decision ID。
    pub screening_id: ScreeningDecisionId,
    /// 与 decision 配对的 inbound fact ID。
    pub inbound_fact_id: InboundFactRecordId,
    /// Runtime boundary typed ref。
    pub runtime_boundary_ref: RuntimeBoundaryRef,
    /// supporting resolution ID。
    pub resolution_id: ExternalContextResolutionId,
}

/// Runtime admission result link 输入字段。
pub struct LinkRuntimeResultCommandInput {
    /// 双锚执行主语。
    pub subject: MemberSubjectAnchor,
    /// 原 submission attempt ID。
    pub attempt_id: RuntimeSubmissionAttemptId,
    /// owner-verified Runtime admission ref。
    pub admission_ref: RuntimeAdmissionDecisionRef,
    /// safe classification。
    pub classification: RuntimeResultClassification,
    /// Runtime source family ref。
    pub source_ref: RuntimeSourceRef,
}

/// 外部上下文 resolve 输入字段。
pub struct ResolveExternalContextCommandInput {
    /// 双锚执行主语。
    pub subject: MemberSubjectAnchor,
    /// owner-typed source ref。
    pub source_ref: TypedRef,
    /// source owner identity。
    pub source_owner: ExternalOwnerRef,
    /// safe context kind。
    pub context_kind: ExternalContextKind,
    /// consumer-specific purpose。
    pub purpose: ExternalConsumerPurpose,
    /// declared scope。
    pub scope: ExternalContextScope,
    /// owner freshness evidence。
    pub freshness: SourceFreshnessEvidence,
}

/// 外部上下文 refresh 输入字段。
pub struct RequestExternalRefreshCommandInput {
    /// 双锚执行主语。
    pub subject: MemberSubjectAnchor,
    /// owner-typed source ref。
    pub source_ref: TypedRef,
    /// safe context kind。
    pub context_kind: ExternalContextKind,
    /// consumer-specific purpose。
    pub purpose: ExternalConsumerPurpose,
    /// declared scope。
    pub scope: ExternalContextScope,
    /// refresh reason category。
    pub reason: SafeReasonCategory,
}
```

`MemberCommandApplicationResult<T>` 仅是 typed service method 的返回 carrier；protocol 层必须把它映射为 §5.4 的 `MemberCommandOutcome<T>`，并在 fresh 非 `Rejected` 分支写入完整 stored carrier。`T` 的实例集合被十个 body/result 表穷举，禁止开放成任意 payload。

### 5.2 十个 Command body / result cards

下表是 public DTO 的字段级 schema。字段来源一列同时是 selected-input source map 的第一部分；所有 ref 必须由 trusted entry、已提交 local Store 或 owner-specific Port 提供。

| Command | typed request body（字段：类型） | accepted result body | owner service / callable method |
|---|---|---|---|
| `AdmitMemberStartup` | `subject: MemberSubjectAnchor`; `startup_context_ref: StartupContextRef`; `credential_ref: Option<CredentialRef>` | `StartupAdmission` | `PresenceApplicationService::admit_member_startup` |
| `EstablishMemberPresence` | `subject: MemberSubjectAnchor`; `startup_admission_id: StartupAdmissionId`; `start_context: PresenceStartContext` | `MemberPresence` | `PresenceApplicationService::establish_member_presence` |
| `TransitionMemberPresence` | `subject: MemberSubjectAnchor`; `presence_id: MemberPresenceId`; `target_status: MemberPresenceStatus`; `reason: PresenceTransitionReason`; `expected_revision: ExpectedRevision` | `MemberPresence` | `PresenceApplicationService::transition_member_presence` |
| `PrepareHostCollaboration` | `subject: MemberSubjectAnchor`; `presence_id: MemberPresenceId`; `kind: HostCollaborationKind`; `purpose: InteractionPurpose`; `safe_status_category: SafeStatusCategory` | `HostCollaborationCommandValue` | `HostCollaborationService::prepare_host_collaboration` |
| `EstablishSubscriptionScope` | `subject: MemberSubjectAnchor`; `presence_id: MemberPresenceId`; `scope: MemberSubscriptionScope`; `resolution_id: ExternalContextResolutionId` | `SubscriptionScopeDecision` | `SubscriptionScopeService::establish_subscription_scope` |
| `ReplaceSubscriptionScope` | `subject: MemberSubjectAnchor`; `decision_id: SubscriptionScopeDecisionId`; `expected_revision: ExpectedRevision`; `scope: MemberSubscriptionScope`; `resolution_id: ExternalContextResolutionId` | `SubscriptionScopeDecision` | `SubscriptionScopeService::replace_subscription_scope` |
| `SubmitScreenedFactToRuntime` | `subject: MemberSubjectAnchor`; `screening_id: ScreeningDecisionId`; `inbound_fact_id: InboundFactRecordId`; `runtime_boundary_ref: RuntimeBoundaryRef`; `resolution_id: ExternalContextResolutionId` | `RuntimeDeliveryCommandValue` | `RuntimeMediationService::submit_screened_fact_to_runtime` |
| `LinkRuntimeAdmissionResult` | `subject: MemberSubjectAnchor`; `attempt_id: RuntimeSubmissionAttemptId`; `admission_ref: RuntimeAdmissionDecisionRef`; `classification: RuntimeResultClassification`; `source_ref: RuntimeSourceRef` | `RuntimeResultLink` | `RuntimeMediationService::link_runtime_admission_result` |
| `ResolveExternalContext` | `subject: MemberSubjectAnchor`; `source_ref: TypedRef`; `source_owner: ExternalOwnerRef`; `context_kind: ExternalContextKind`; `purpose: ExternalConsumerPurpose`; `scope: ExternalContextScope`; `freshness: SourceFreshnessEvidence` | `ExternalContextCommandValue` | `ExternalContextMirrorService::resolve_external_context` |
| `RequestExternalContextRefresh` | `subject: MemberSubjectAnchor`; `source_ref: TypedRef`; `context_kind: ExternalContextKind`; `purpose: ExternalConsumerPurpose`; `scope: ExternalContextScope`; `reason: SafeReasonCategory` | `ExternalRefreshCommandValue` | `ExternalContextMirrorService::request_external_context_refresh` |

### 5.3 Command selector / source map and exact callable signatures

每个 service 方法接收已经构造的 `MemberOperationContext` 与自己的 typed body；方法不得再次解析命令名称，也不得访问 entry registry。

```rust
/// CP01 admission / presence service。
pub trait PresenceApplicationServicePort {
    /// 以双锚和 startup / credential ref 形成 admission。
    async fn admit_member_startup(&self, context: MemberOperationContext, body: AdmitMemberStartupBody) -> Result<MemberCommandApplicationResult<StartupAdmission>, ApplicationError>;
    /// 从 accepted admission 建立 starting presence。
    async fn establish_member_presence(&self, context: MemberOperationContext, body: EstablishMemberPresenceBody) -> Result<MemberCommandApplicationResult<MemberPresence>, ApplicationError>;
    /// 按 expected revision 执行显式 presence transition。
    async fn transition_member_presence(&self, context: MemberOperationContext, body: TransitionMemberPresenceBody) -> Result<MemberCommandApplicationResult<MemberPresence>, ApplicationError>;
}

/// CP01 host collaboration service。
pub trait HostCollaborationServicePort {
    /// 从 committed presence 制备 material 与 prepared attempt。
    async fn prepare_host_collaboration(&self, context: MemberOperationContext, body: PrepareHostCollaborationBody) -> Result<MemberCommandApplicationResult<HostCollaborationCommandValue>, ApplicationError>;
    /// 处理一个已验证 host feedback ref。
    async fn consume_host_feedback(&self, context: MemberOperationContext, input: HostFeedbackConsumerInput) -> Result<MemberConsumerApplicationResult, ApplicationError>;
}

/// CP02 subscription scope service。
pub trait SubscriptionScopeServicePort {
    /// 建立首个 scope decision。
    async fn establish_subscription_scope(&self, context: MemberOperationContext, body: EstablishSubscriptionScopeBody) -> Result<MemberCommandApplicationResult<SubscriptionScopeDecision>, ApplicationError>;
    /// 按 expected revision 替换 scope decision。
    async fn replace_subscription_scope(&self, context: MemberOperationContext, body: ReplaceSubscriptionScopeBody) -> Result<MemberCommandApplicationResult<SubscriptionScopeDecision>, ApplicationError>;
}

/// CP03 Runtime mediation service。
pub trait RuntimeMediationServicePort {
    /// 从 screening 形成 delivery decision 和 submission attempt。
    async fn submit_screened_fact_to_runtime(&self, context: MemberOperationContext, body: SubmitScreenedFactToRuntimeBody) -> Result<MemberCommandApplicationResult<RuntimeDeliveryCommandValue>, ApplicationError>;
    /// 关联晚到或独立解析的 Runtime admission result。
    async fn link_runtime_admission_result(&self, context: MemberOperationContext, body: LinkRuntimeAdmissionResultBody) -> Result<MemberCommandApplicationResult<RuntimeResultLink>, ApplicationError>;
    /// 接收 Runtime committed safe material。
    async fn consume_runtime_material(&self, context: MemberOperationContext, input: RuntimeMaterialConsumerInput) -> Result<MemberConsumerApplicationResult, ApplicationError>;
}

/// CP06 external context mirror service。
pub trait ExternalContextMirrorServicePort {
    /// 由 owner-specific resolver 捕获 snapshot 并形成 neutral resolution。
    async fn resolve_external_context(&self, context: MemberOperationContext, body: ResolveExternalContextBody) -> Result<MemberCommandApplicationResult<ExternalContextCommandValue>, ApplicationError>;
    /// 只登记 refresh need，不在 Command 中长时调用 resolver。
    async fn request_external_context_refresh(&self, context: MemberOperationContext, body: RequestExternalContextRefreshBody) -> Result<MemberCommandApplicationResult<ExternalRefreshCommandValue>, ApplicationError>;
}
```

其中 `AdmitMemberStartupBody` 等 body 名称是对 §5.2 表格行的 typed 别名，不能被实现成裸 `TypedRef` 或 `HashMap`。selector/source map 如下：

| 协议 | selector | selector source | selected-input source | 禁止推断 |
|---|---|---|---|---|
| `AdmitMemberStartup` | `Subject(subject)` | API trusted双锚 | startup / credential refs 来自 request；credential verification 由 named Port | 不从 actor display、route、token 推导 subject |
| `EstablishMemberPresence` | `Presence(startup_admission_id)` | request + presence anchor | admission Store 的 versioned record、local start context | 不从 startup ref 直接假定 admission accepted |
| `TransitionMemberPresence` | `Presence(presence_id)` | request | same Store 的 version + target status + reason | 不从 heartbeat / host health 推导 status |
| `PrepareHostCollaboration` | `HostAttempt(presence_id)` | request | committed presence Store、explicit kind / purpose | 不从 route 选择 host kind |
| `EstablishSubscriptionScope` | `SubscriptionScope(presence_id)` | request | presence Store、scope body、CP06 resolution Store | 不从 policy body或 display name扩权 |
| `ReplaceSubscriptionScope` | `SubscriptionScope(decision_id)` | request | decision Store version、scope body、resolution Store | 不从 current query cursor当 revision |
| `SubmitScreenedFactToRuntime` | `RuntimeDelivery(screening_id)` | request | screening + inbound Store、Runtime boundary / resolution Port | 不从 raw inbound body或Runtime run猜 mapping |
| `LinkRuntimeAdmissionResult` | `RuntimeDelivery(attempt_id)` | request | attempt Store + formally verified result refs | 不从 port ack、时间或 result ID 单独推导 accepted |
| `ResolveExternalContext` | `ExternalResolution(source_ref)` | request | owner-specific resolver safe output + declared scope | 不使用 generic resolver / adapter state |
| `RequestExternalContextRefresh` | `ExternalResolution(source_ref)` | request | existing mirror gap / explicit reason | 不由 Query、stale flag或字符串自行创建 refresh |

### 5.4 Command result / rejection mapping

| reservation / application branch | public outcome | stored carrier | 写入规则 |
|---|---|---|---|
| entry pre-application invalid | `Rejected`（无 result_ref） | 不创建 relation | 不 reserve、不写 domain、不回放旧结果 |
| `Reserved` + accepted | `Accepted` | `MemberStoredCommandCarrier::Value` | local truth、typed result、result shell、reservation completion 同一 UoW |
| `Reserved` + domain/application rejection | `Rejected` / `Blocked` / `Waiting` / `Unknown` | `MemberStoredCommandCarrier::Rejection` | rejection 与合法 operation relation 一同保存；不得只存 surface ref |
| `Duplicate { result_kind: CommandResult }` | `DuplicateReplayed` | 读取完整 matching value / rejection | 不执行 service、不读 current truth 重建、不调用 adapter |
| `InFlight` | `InFlight` | 无新 carrier | 不忙等、不隐式重试 |
| `Conflict` | `Conflict` | 无新 carrier | 不改写既有 relation |

## 6. Query protocol contracts（16）

### 6.1 Query shared response contract

Query 只读取 application 明示的 read Port。它不得调用 `MemberIdempotencyStore`、`MemberStoredResultStore`、`MemberDigestPort`、任何 resolver / handoff adapter、refresh / rebuild / reconciliation Job，亦不得为了满足 `CurrentRequired` 而写 marker 或创建 gap。

```rust
/// 单对象 Query 的 typed response。
pub struct MemberQueryResponse<T> {
    /// 有限 Query 名称。
    pub query_name: MemberQueryName,
    /// visibility / freshness / availability surface。
    pub surface: MemberVisibilitySurface,
    /// Visible / degraded 时的 typed body；其它情况可为 None。
    pub body: Option<T>,
}

/// 分页 Query 的 typed response。
pub struct MemberPagedQueryResponse<T> {
    /// 有限 Query 名称。
    pub query_name: MemberQueryName,
    /// visibility / freshness / availability surface。
    pub surface: MemberVisibilitySurface,
    /// 公开分页 body；Empty 时仍返回空 `items`，而不是 None。
    pub body: Option<MemberPage<T>>,
}

/// capability outlet 的安全过滤器。
pub struct CapabilityOutletFilter {
    /// 要展示的 safe dimension 名称；空集合表示调用方未限定维度。
    pub dimensions: Vec<SafeDimensionName>,
    /// 是否允许返回 stale safe refs；不改变 authorization 语义。
    pub stale_policy: ProjectionConsistencyHint,
}

/// diagnostics 的安全过滤器。
pub struct DiagnosticFilter {
    /// 低基数诊断类别。
    pub categories: Vec<MemberDiagnosticCategory>,
    /// 是否只看仍有 gap 的条目。
    pub include_gap_categories: bool,
}

/// interaction gap 的 typed 过滤器。
pub struct InteractionGapFilter {
    /// 可选 gap status 集合。
    pub statuses: Vec<InteractionGapStatus>,
    /// 可选 purpose 限制。
    pub purpose: Option<InteractionPurpose>,
}

/// external context gap 的 typed 过滤器。
pub struct ExternalContextGapFilter {
    /// 可选 context kind 限制。
    pub context_kind: Option<ExternalContextKind>,
    /// 可选 gap status 集合。
    pub statuses: Vec<ExternalContextGapStatus>,
    /// 可选 consumer purpose 限制。
    pub purpose: Option<ExternalConsumerPurpose>,
}

/// 各 Query 的 response body 只能使用这个有限 union；不允许任意 map。
pub enum MemberQueryBody {
    /// presence read surface。
    Presence(MemberPresenceReadSurface),
    /// host posture。
    HostCollaboration(HostCollaborationPostureView),
    /// current subscription scope。
    SubscriptionScope(SubscriptionScopeReadSurface),
    /// screening disposition。
    Screening(ScreeningDecisionReadSurface),
    /// Runtime mediation posture。
    RuntimeMediation(RuntimeMediationReadSurface),
    /// Runtime material reception。
    RuntimeMaterialReception(RuntimeMaterialReceptionReadSurface),
    /// outbound decision。
    OutboundDecision(OutboundDecisionReadSurface),
    /// publication posture。
    Publication(PublicationPostureView),
    /// interaction trace page item。
    InteractionTrace(InteractionTraceEntry),
    /// interaction gap page item。
    InteractionGap(InteractionGap),
    /// observation posture。
    Observation(ObservationPostureView),
    /// external resolution。
    ExternalResolution(ExternalContextResolutionReadSurface),
    /// external gap page item。
    ExternalGap(ExternalContextGap),
    /// member summary。
    Summary(MemberSummaryView),
    /// capability outlet。
    CapabilityOutlet(CapabilityOutletView),
    /// diagnostics。
    Diagnostics(MemberDiagnosticView),
}

/// presence Query 的 body-free view。
pub struct MemberPresenceReadSurface {
    /// 当前或最近已提交 presence；不可见 / 不可用时为 None。
    pub presence: Option<MemberPresence>,
    /// presence revision，不是 Store version。
    pub revision: Option<PresenceRevision>,
    /// Query visibility surface。
    pub visibility: MemberVisibilitySurface,
}

/// host collaboration posture view。
pub struct HostCollaborationPostureView {
    /// local material refs。
    pub material_refs: Vec<HostCollaborationMaterialId>,
    /// local attempt refs。
    pub attempt_refs: Vec<HostCollaborationAttemptId>,
    /// formal feedback refs only。
    pub feedback_refs: Vec<HostFeedbackRef>,
    /// publication / acceptance 不在此 view 中声称。
    pub visibility: MemberVisibilitySurface,
}

/// subscription scope read surface。
pub struct SubscriptionScopeReadSurface {
    /// 当前 active decision；无可见 decision 时为 None。
    pub decision: Option<SubscriptionScopeDecision>,
    /// scope revision；不等于 Store version。
    pub revision: Option<SubscriptionScopeRevision>,
    /// visibility surface。
    pub visibility: MemberVisibilitySurface,
}

/// screening read surface。
pub struct ScreeningDecisionReadSurface {
    /// body-free screening decision。
    pub decision: Option<ScreeningDecision>,
    /// source event typed ref；不含 source body。
    pub source_event_ref: Option<SourceEventRef>,
    /// transient inspection 已被丢弃的标记。
    pub inspection_marker: Option<TransientInspectionMarker>,
    /// visibility surface。
    pub visibility: MemberVisibilitySurface,
}

/// Runtime mediation read surface。
pub struct RuntimeMediationReadSurface {
    /// delivery decision。
    pub decision: Option<RuntimeDeliveryDecision>,
    /// submission attempt。
    pub attempt: Option<RuntimeSubmissionAttempt>,
    /// immutable result link。
    pub result_link: Option<RuntimeResultLink>,
    /// safe reception ref。
    pub reception_ref: Option<RuntimeMaterialReceptionId>,
    /// visibility surface。
    pub visibility: MemberVisibilitySurface,
}

/// Runtime material reception read surface。
pub struct RuntimeMaterialReceptionReadSurface {
    /// local reception；不包含 Runtime material body。
    pub reception: Option<RuntimeMaterialReception>,
    /// material digest / source metadata surface。
    pub material_digest: Option<Digest>,
    /// visibility surface。
    pub visibility: MemberVisibilitySurface,
}

/// outbound decision read surface。
pub struct OutboundDecisionReadSurface {
    /// local outbound decision。
    pub decision: Option<OutboundDecision>,
    /// target resolution ref only。
    pub target_resolution_ref: Option<ExternalContextResolutionId>,
    /// visibility surface。
    pub visibility: MemberVisibilitySurface,
}

/// publication posture view。
pub struct PublicationPostureView {
    /// outbound decision ref。
    pub outbound_decision_ref: Option<OutboundDecisionId>,
    /// prepared material ref。
    pub material_ref: Option<MemberOutboundMaterialId>,
    /// attempts ordered by local creation order。
    pub attempt_refs: Vec<PublicationAttemptId>,
    /// gaps ordered by local creation order。
    pub gap_refs: Vec<PublicationGapId>,
    /// formal downstream feedback refs。
    pub feedback_refs: Vec<DownstreamFeedbackRef>,
    /// visibility surface。
    pub visibility: MemberVisibilitySurface,
}

/// observation posture view。
pub struct ObservationPostureView {
    /// observation material ref。
    pub material_ref: Option<ObservationMaterialId>,
    /// observation attempt refs。
    pub attempt_refs: Vec<ObservationAttemptId>,
    /// feedback refs；不等于 observed / evidence truth。
    pub feedback_refs: Vec<ObservationFeedbackRef>,
    /// visibility surface。
    pub visibility: MemberVisibilitySurface,
}

/// external resolution read surface。
pub struct ExternalContextResolutionReadSurface {
    /// latest owner-safe snapshot ref。
    pub snapshot_ref: Option<ExternalContextSnapshotId>,
    /// purpose-specific neutral resolution。
    pub resolution: Option<ExternalContextResolution>,
    /// unresolved / stale / blocked gap。
    pub gap: Option<ExternalContextGap>,
    /// visibility surface。
    pub visibility: MemberVisibilitySurface,
}
```

### 6.2 十六个 Query body / response cards

| Query | typed body（字段：类型） | response carrier | selector / source |
|---|---|---|---|
| `GetMemberPresence` | `subject: MemberSubjectAnchor`; `consistency: ProjectionConsistencyHint` | `MemberQueryResponse<MemberPresenceReadSurface>` | `Subject(subject)`；PresenceStore / safe projection |
| `GetHostCollaborationPosture` | `subject: MemberSubjectAnchor`; `presence_id: MemberPresenceId`; `page: MemberPageRequest` | `MemberPagedQueryResponse<HostCollaborationPostureView>` | `HostAttempt`；HostCollaborationStore |
| `GetCurrentSubscriptionScope` | `subject: MemberSubjectAnchor`; `consistency: ProjectionConsistencyHint` | `MemberQueryResponse<SubscriptionScopeReadSurface>` | `SubscriptionScope` from current subject；SubscriptionScopeStore |
| `GetScreeningDisposition` | `subject: MemberSubjectAnchor`; `screening_id: ScreeningDecisionId` | `MemberQueryResponse<ScreeningDecisionReadSurface>` | `Screening`；InboundStore / safe trace |
| `GetRuntimeMediationPosture` | `subject: MemberSubjectAnchor`; `decision_id: RuntimeDeliveryDecisionId`; `consistency: ProjectionConsistencyHint` | `MemberQueryResponse<RuntimeMediationReadSurface>` | `RuntimeDelivery`；RuntimeMediationStore |
| `GetRuntimeMaterialReception` | `subject: MemberSubjectAnchor`; `reception_id: RuntimeMaterialReceptionId` | `MemberQueryResponse<RuntimeMaterialReceptionReadSurface>` | `RuntimeMaterialReception`；RuntimeMediationStore |
| `GetOutboundDecision` | `subject: MemberSubjectAnchor`; `decision_id: OutboundDecisionId`; `consistency: ProjectionConsistencyHint` | `MemberQueryResponse<OutboundDecisionReadSurface>` | `OutboundDecision`；OutboundStore |
| `GetPublicationPosture` | `subject: MemberSubjectAnchor`; `decision_id: OutboundDecisionId`; `page: MemberPageRequest` | `MemberPagedQueryResponse<PublicationPostureView>` | `OutboundDecision`；Outbound / continuation Store |
| `GetInteractionTrace` | `subject: MemberSubjectAnchor`; `purpose: Option<InteractionPurpose>`; `page: MemberPageRequest` | `MemberPagedQueryResponse<InteractionTraceEntry>` | `Interaction(subject)`；InteractionTraceStore |
| `ListInteractionGaps` | `subject: MemberSubjectAnchor`; `filter: InteractionGapFilter`; `page: MemberPageRequest` | `MemberPagedQueryResponse<InteractionGap>` | `Interaction(subject)`；InteractionTraceStore |
| `GetObservationPosture` | `subject: MemberSubjectAnchor`; `attempt_id: Option<ObservationAttemptId>`; `page: MemberPageRequest` | `MemberPagedQueryResponse<ObservationPostureView>` | `Observation` or subject；InteractionTraceStore |
| `GetExternalContextResolution` | `subject: MemberSubjectAnchor`; `source_ref: TypedRef`; `purpose: ExternalConsumerPurpose`; `scope: ExternalContextScope`; `consistency: ProjectionConsistencyHint` | `MemberQueryResponse<ExternalContextResolutionReadSurface>` | `ExternalResolution(source_ref)`；MirrorStore |
| `ListExternalContextGaps` | `subject: MemberSubjectAnchor`; `filter: ExternalContextGapFilter`; `page: MemberPageRequest` | `MemberPagedQueryResponse<ExternalContextGap>` | `ExternalResolution(subject)`；MirrorStore |
| `GetMemberSummary` | `subject: MemberSubjectAnchor`; `consistency: ProjectionConsistencyHint` | `MemberQueryResponse<MemberSummaryView>` | `Projection(SummaryView)`；ProjectionStore |
| `GetCapabilityOutlet` | `subject: MemberSubjectAnchor`; `filter: CapabilityOutletFilter`; `consistency: ProjectionConsistencyHint` | `MemberQueryResponse<CapabilityOutletView>` | `Projection(CapabilityOutletView)`；ProjectionStore + committed CP06 refs |
| `GetMemberDiagnostics` | `subject: MemberSubjectAnchor`; `filter: DiagnosticFilter`; `consistency: ProjectionConsistencyHint` | `MemberQueryResponse<MemberDiagnosticView>` | `Projection(DiagnosticView)`；ProjectionStore + trace / mirror refs |

`GetHostCollaborationPosture`、`GetPublicationPosture`、`GetInteractionTrace`、`ListInteractionGaps`、`GetObservationPosture`、`ListExternalContextGaps` 的分页 body 只允许使用 `MemberPage<T>`；service 不得把 `MemberRepositoryPage`、Store version、watermark 或 external offset 直接暴露给 caller。

### 6.3 Query visibility / readiness matrix

| Query | visibility basis 来源 | 无 basis / not-visible | not-ready | degraded / stale | not-available | empty |
|---|---|---|---|---|---|---|
| `GetMemberPresence` | subject identity / member read policy | `NotVisible`, body None | projection not initialized | stale presence revision | PresenceStore unavailable | 不适用 |
| `GetHostCollaborationPosture` | host collaboration safe visibility basis | body None | attempt projection pending | feedback / route stale | HostCollaborationStore unavailable | empty page |
| `GetCurrentSubscriptionScope` | subject + scope policy basis | body None | no committed scope | source resolution stale | scope Store unavailable | `NotAvailable`（没有合法 scope 不是 Empty） |
| `GetScreeningDisposition` | actor + source / screening safe basis | body None | source decision pending | rule resolution stale | inbound Store unavailable | 不适用 |
| `GetRuntimeMediationPosture` | Runtime mediation read policy basis | body None | result / reception pending | source mapping stale | mediation Store unavailable | 不适用 |
| `GetRuntimeMaterialReception` | reception visibility basis | body None | committed reception not ready | material source stale | mediation Store unavailable | 不适用 |
| `GetOutboundDecision` | outbound target / subject basis | body None | target resolution pending | target resolution stale | outbound Store unavailable | 不适用 |
| `GetPublicationPosture` | publication safe view basis | body None | attempt projection pending | feedback / route stale | continuation Store unavailable | empty page |
| `GetInteractionTrace` | trace subject + actor basis | body None | committed trace projection pending | trace source stale | trace Store unavailable | empty page |
| `ListInteractionGaps` | trace-gap visibility basis | body None | gap projection pending | gap source stale | trace Store unavailable | empty page |
| `GetObservationPosture` | observation safe visibility basis | body None | observation material pending | handoff / feedback stale | trace Store unavailable | empty page |
| `GetExternalContextResolution` | owner-specific resolution basis | body None | resolution pending | source freshness stale | MirrorStore unavailable | `NotAvailable` |
| `ListExternalContextGaps` | source owner + purpose basis | body None | mirror projection pending | source freshness stale | MirrorStore unavailable | empty page |
| `GetMemberSummary` | `ProjectionVisibilityBasisRef` from read policy | body None | projection state `NotReady` / `Rebuilding` | `Degraded` / `Stale` | ProjectionStore unavailable | 不适用 |
| `GetCapabilityOutlet` | CP06 resolution + outlet rule basis | body None | outlet projection pending | stale / gap surface | source or projection unavailable | available refs为空时 `Empty`，不转为 invocation |
| `GetMemberDiagnostics` | trace / mirror / projection safe basis | body None | diagnostic projection pending | degraded / stale | optional source unavailable | empty diagnostic body only when explicitly visible |

没有 visibility basis 时一律不能返回 `Visible`；`NotVisible` 与 `NotAvailable` 不能通过空 body 的同一 generic error 混淆。`CapabilityOutletView` 的 `available` 只表示 safe ref display，不表示 authorization、invocation 或 execution readiness。

### 6.4 Query exact callable service surface

```rust
/// CP01 / CP02 / CP03 / CP04 / CP05 / CP06 / CP07 的只读调用面。
pub trait MemberQueryServicePort {
    /// 读取 presence。
    async fn get_member_presence(&self, context: MemberOperationContext, body: GetMemberPresenceBody) -> Result<MemberQueryResponse<MemberPresenceReadSurface>, ApplicationError>;
    /// 读取 host posture。
    async fn get_host_collaboration_posture(&self, context: MemberOperationContext, body: GetHostCollaborationPostureBody) -> Result<MemberPagedQueryResponse<HostCollaborationPostureView>, ApplicationError>;
    /// 读取当前 scope。
    async fn get_current_subscription_scope(&self, context: MemberOperationContext, body: GetCurrentSubscriptionScopeBody) -> Result<MemberQueryResponse<SubscriptionScopeReadSurface>, ApplicationError>;
    /// 读取 screening disposition。
    async fn get_screening_disposition(&self, context: MemberOperationContext, body: GetScreeningDispositionBody) -> Result<MemberQueryResponse<ScreeningDecisionReadSurface>, ApplicationError>;
    /// 读取 Runtime mediation posture。
    async fn get_runtime_mediation_posture(&self, context: MemberOperationContext, body: GetRuntimeMediationPostureBody) -> Result<MemberQueryResponse<RuntimeMediationReadSurface>, ApplicationError>;
    /// 读取 Runtime material reception。
    async fn get_runtime_material_reception(&self, context: MemberOperationContext, body: GetRuntimeMaterialReceptionBody) -> Result<MemberQueryResponse<RuntimeMaterialReceptionReadSurface>, ApplicationError>;
    /// 读取 outbound decision。
    async fn get_outbound_decision(&self, context: MemberOperationContext, body: GetOutboundDecisionBody) -> Result<MemberQueryResponse<OutboundDecisionReadSurface>, ApplicationError>;
    /// 读取 publication posture。
    async fn get_publication_posture(&self, context: MemberOperationContext, body: GetPublicationPostureBody) -> Result<MemberPagedQueryResponse<PublicationPostureView>, ApplicationError>;
    /// 读取 interaction trace。
    async fn get_interaction_trace(&self, context: MemberOperationContext, body: GetInteractionTraceBody) -> Result<MemberPagedQueryResponse<InteractionTraceEntry>, ApplicationError>;
    /// 列出 interaction gaps。
    async fn list_interaction_gaps(&self, context: MemberOperationContext, body: ListInteractionGapsBody) -> Result<MemberPagedQueryResponse<InteractionGap>, ApplicationError>;
    /// 读取 observation posture。
    async fn get_observation_posture(&self, context: MemberOperationContext, body: GetObservationPostureBody) -> Result<MemberPagedQueryResponse<ObservationPostureView>, ApplicationError>;
    /// 读取 external resolution。
    async fn get_external_context_resolution(&self, context: MemberOperationContext, body: GetExternalContextResolutionBody) -> Result<MemberQueryResponse<ExternalContextResolutionReadSurface>, ApplicationError>;
    /// 列出 external gaps。
    async fn list_external_context_gaps(&self, context: MemberOperationContext, body: ListExternalContextGapsBody) -> Result<MemberPagedQueryResponse<ExternalContextGap>, ApplicationError>;
    /// 读取 summary。
    async fn get_member_summary(&self, context: MemberOperationContext, body: GetMemberSummaryBody) -> Result<MemberQueryResponse<MemberSummaryView>, ApplicationError>;
    /// 读取 capability outlet。
    async fn get_capability_outlet(&self, context: MemberOperationContext, body: GetCapabilityOutletBody) -> Result<MemberQueryResponse<CapabilityOutletView>, ApplicationError>;
    /// 读取 diagnostics。
    async fn get_member_diagnostics(&self, context: MemberOperationContext, body: GetMemberDiagnosticsBody) -> Result<MemberQueryResponse<MemberDiagnosticView>, ApplicationError>;
}
```

上述 `*Body` 是 §6.2 每行字段的 typed 别名；实现必须逐方法暴露，不能把它们压成一个 `query(selector: String)`。

### 6.5 Query body aliases（public field closure）

```rust
/// 读取 presence 的 body。
pub struct GetMemberPresenceBody { pub subject: MemberSubjectAnchor, pub consistency: ProjectionConsistencyHint }
/// 读取 host posture 的 body。
pub struct GetHostCollaborationPostureBody { pub subject: MemberSubjectAnchor, pub presence_id: MemberPresenceId, pub page: MemberPageRequest }
/// 读取当前 scope 的 body。
pub struct GetCurrentSubscriptionScopeBody { pub subject: MemberSubjectAnchor, pub consistency: ProjectionConsistencyHint }
/// 读取 screening 的 body。
pub struct GetScreeningDispositionBody { pub subject: MemberSubjectAnchor, pub screening_id: ScreeningDecisionId }
/// 读取 Runtime posture 的 body。
pub struct GetRuntimeMediationPostureBody { pub subject: MemberSubjectAnchor, pub decision_id: RuntimeDeliveryDecisionId, pub consistency: ProjectionConsistencyHint }
/// 读取 Runtime reception 的 body。
pub struct GetRuntimeMaterialReceptionBody { pub subject: MemberSubjectAnchor, pub reception_id: RuntimeMaterialReceptionId }
/// 读取 outbound decision 的 body。
pub struct GetOutboundDecisionBody { pub subject: MemberSubjectAnchor, pub decision_id: OutboundDecisionId, pub consistency: ProjectionConsistencyHint }
/// 读取 publication posture 的 body。
pub struct GetPublicationPostureBody { pub subject: MemberSubjectAnchor, pub decision_id: OutboundDecisionId, pub page: MemberPageRequest }
/// 读取 interaction trace 的 body。
pub struct GetInteractionTraceBody { pub subject: MemberSubjectAnchor, pub purpose: Option<InteractionPurpose>, pub page: MemberPageRequest }
/// 列出 interaction gaps 的 body。
pub struct ListInteractionGapsBody { pub subject: MemberSubjectAnchor, pub filter: InteractionGapFilter, pub page: MemberPageRequest }
/// 读取 observation posture 的 body。
pub struct GetObservationPostureBody { pub subject: MemberSubjectAnchor, pub attempt_id: Option<ObservationAttemptId>, pub page: MemberPageRequest }
/// 读取 external resolution 的 body。
pub struct GetExternalContextResolutionBody { pub subject: MemberSubjectAnchor, pub source_ref: TypedRef, pub purpose: ExternalConsumerPurpose, pub scope: ExternalContextScope, pub consistency: ProjectionConsistencyHint }
/// 列出 external gaps 的 body。
pub struct ListExternalContextGapsBody { pub subject: MemberSubjectAnchor, pub filter: ExternalContextGapFilter, pub page: MemberPageRequest }
/// 读取 summary 的 body。
pub struct GetMemberSummaryBody { pub subject: MemberSubjectAnchor, pub consistency: ProjectionConsistencyHint }
/// 读取 outlet 的 body。
pub struct GetCapabilityOutletBody { pub subject: MemberSubjectAnchor, pub filter: CapabilityOutletFilter, pub consistency: ProjectionConsistencyHint }
/// 读取 diagnostics 的 body。
pub struct GetMemberDiagnosticsBody { pub subject: MemberSubjectAnchor, pub filter: DiagnosticFilter, pub consistency: ProjectionConsistencyHint }
```

这些 struct 的单行写法仅为校准材料的 compact schema；正式回填时仍须按详细设计书写规范拆成逐字段 Rustdoc。字段来源分别是 trusted API boundary、已提交 member Store、CP06 neutral resolution、或调用方显式提供的 consistency / filter；不得从 route、actor display name、当前 adapter 状态或 page cursor 推导业务 subject。

## 7. Inbound Consumer protocol contracts（14）

### 7.1 transport-neutral logical envelope

这里的 envelope 是**owner transport 已验证后**传给 `worker -> application` 的 body-free logical dispatch carrier，不是 `L0-bus` wire envelope，也不声明 CloudEvents、topic、route、ack、DLQ、IPC 或 delivery success。

```rust
/// 10 个 external Consumer 使用的逻辑输入 envelope。
pub struct MemberExternalConsumerEnvelope<T> {
    /// 有限 Consumer 名称。
    pub consumer_name: MemberConsumerName,
    /// 双锚执行主语；缺失时入口只能保守拒绝。
    pub subject: MemberSubjectAnchor,
    /// trusted system / integration actor。
    pub actor: ActorContext,
    /// 已验证 external source identity；不含 body。
    pub source: MemberConsumerSource,
    /// dedup key；只来自正式 envelope metadata。
    pub deduplication_key: DeduplicationKey,
    /// distributed trace。
    pub trace_id: TraceId,
    /// owner-specific、body-free typed input。
    pub input: T,
}

/// 4 个 committed-fact Consumer 使用的逻辑输入 envelope。
pub struct MemberCommittedFactConsumerEnvelope<T> {
    /// 有限 Consumer 名称。
    pub consumer_name: MemberConsumerName,
    /// 双锚执行主语。
    pub subject: MemberSubjectAnchor,
    /// trusted local continuation actor。
    pub actor: ActorContext,
    /// 已提交 local fact source；不得传 external event。
    pub source: MemberConsumerSource,
    /// dedup key；从 member committed-fact carrier 归一。
    pub deduplication_key: DeduplicationKey,
    /// distributed trace。
    pub trace_id: TraceId,
    /// 有限 local continuation input。
    pub input: T,
}

/// 14 个 inbound Consumer 的有限名称集合。
pub enum MemberConsumerName {
    /// host feedback。
    HostFeedback,
    /// inbound fact。
    InboundFact,
    /// Runtime committed material。
    RuntimeMaterial,
    /// downstream delivery feedback。
    DeliveryFeedback,
    /// observation feedback。
    ObservationFeedback,
    /// subject / identity context update。
    SubjectIdentityContextUpdate,
    /// policy context update。
    PolicyContextUpdate,
    /// Runtime boundary context update。
    RuntimeBoundaryContextUpdate,
    /// capability context update。
    CapabilityContextUpdate,
    /// host route context update。
    HostRouteContextUpdate,
    /// committed Runtime material reception。
    RuntimeMaterialReception,
    /// generic committed member fact trace continuation。
    MemberCommittedFact,
    /// projection state update。
    MemberProjectionUpdate,
    /// capability outlet source update。
    CapabilityOutletSourceUpdate,
}

/// Consumer receipt 的有限 application disposition。
pub enum MemberConsumerDisposition {
    /// local facts / links / markers 已提交。
    Accepted,
    /// 完整 stored receipt 已被回放。
    DuplicateReplayed,
    /// source schema 在 boundary 不受支持。
    UnsupportedVersion,
    /// boundary 或 application 保守拒绝。
    Rejected,
    /// required seam / contract 被 blocker 阻止。
    Blocked,
    /// 等待 source / feedback / resolution。
    Waiting,
    /// source / side effect 无法证明。
    Unknown,
    /// same relation 仍在处理中。
    InFlight,
    /// same key 与 digest relation 冲突。
    Conflict,
}

/// 完整、body-free Consumer receipt。
pub struct MemberConsumerReceipt {
    /// 消费者名称。
    pub consumer_name: MemberConsumerName,
    /// 逻辑 source family。
    pub source_kind: MemberConsumerSourceKind,
    /// source identity；不得含 payload。
    pub source: MemberConsumerSource,
    /// receipt disposition。
    pub disposition: MemberConsumerDisposition,
    /// application-handled fresh 或 duplicate receipt 的 stored result ref。
    pub result_ref: Option<MemberOperationResultRef>,
    /// 每种 Consumer 的 typed receipt detail。
    pub detail: MemberConsumerReceiptDetail,
    /// 安全问题；ordered-unique。
    pub issues: Vec<MemberProtocolIssue>,
}

/// 14 个 Consumer receipt 的有限 detail union。
pub enum MemberConsumerReceiptDetail {
    /// host feedback link / late classification。
    HostFeedback { attempt_id: HostCollaborationAttemptId, feedback_ref: HostFeedbackRef },
    /// inbound fact 与 screening decision。
    InboundFact { inbound_fact_id: Option<InboundFactRecordId>, screening_id: Option<ScreeningDecisionId>, inspection_marker: Option<TransientInspectionMarker> },
    /// Runtime safe material reception。
    RuntimeMaterial { reception_id: Option<RuntimeMaterialReceptionId> },
    /// delivery feedback link / gap successor。
    DeliveryFeedback { attempt_id: PublicationAttemptId, gap_refs: Vec<PublicationGapId> },
    /// observation feedback link / gap successor。
    ObservationFeedback { attempt_id: ObservationAttemptId, gap_refs: Vec<InteractionGapId> },
    /// subject / identity source mirror successor。
    SubjectIdentityContextUpdate { resolution_id: Option<ExternalContextResolutionId>, gap_id: Option<ExternalContextGapId> },
    /// policy source mirror successor。
    PolicyContextUpdate { resolution_id: Option<ExternalContextResolutionId>, gap_id: Option<ExternalContextGapId> },
    /// Runtime boundary source mirror successor。
    RuntimeBoundaryContextUpdate { resolution_id: Option<ExternalContextResolutionId>, gap_id: Option<ExternalContextGapId> },
    /// capability source mirror successor。
    CapabilityContextUpdate { resolution_id: Option<ExternalContextResolutionId>, gap_id: Option<ExternalContextGapId> },
    /// host route source mirror successor。
    HostRouteContextUpdate { resolution_id: Option<ExternalContextResolutionId>, gap_id: Option<ExternalContextGapId> },
    /// CP04 outbound decision / material continuation。
    RuntimeMaterialReception { outbound_decision_id: Option<OutboundDecisionId>, material_id: Option<MemberOutboundMaterialId>, gap_id: Option<PublicationGapId> },
    /// CP05 trace successor。
    MemberCommittedFact { trace_entry_id: Option<InteractionTraceEntryId>, gap_id: Option<InteractionGapId> },
    /// CP07 projection stale / target watermark marker。
    MemberProjectionUpdate { projection_state_id: Option<MemberProjectionStateId> },
    /// CP07 outlet stale / gap / not-available marker。
    CapabilityOutletSourceUpdate { projection_state_id: Option<MemberProjectionStateId> },
}

/// Service 返回的 Consumer receipt carrier。
pub struct MemberConsumerApplicationResult {
    /// 完整 receipt；accepted / rejection 都使用 typed detail。
    pub receipt: MemberConsumerReceipt,
}
```

`TransientInspectionMarker` 只能说明授权 body 检查已经完成且原始 body 已丢弃；它既不是原始 body，也不是 Bus ack、筛选 rule 正文或 external source truth。

### 7.2 十四个 Consumer cards

| Consumer | source family | typed input fields | owner service | local outcome / 禁止事项 |
|---|---|---|---|---|
| `HostFeedbackConsumer` | external host feedback | `subject`; `feedback_ref: HostFeedbackRef`; `attempt_id: HostCollaborationAttemptId` | HostCollaboration | append feedback link / late classification；不改 presence、host health、session |
| `InboundFactConsumer` | external formal input | `subject`; `authority_ref: SourceAuthorityRef`; `descriptor: InboundFactDescriptor`; `screening_input: ScreeningInputSummary`; `inspection_marker: TransientInspectionMarker` | InboundBoundary | append inbound fact / screening；不保存或转发 raw body |
| `RuntimeMaterialConsumer` | external Runtime committed material | `subject`; `material_ref: RuntimeSafeHandoffMaterialRef`; `outcome_ref: RuntimeOutcomeRef`; `source_ref: RuntimeSourceRef`; `metadata: RuntimeMaterialMetadata` | RuntimeMediation | append reception；不复制 Runtime context / plan / outcome / tool body |
| `DeliveryFeedbackConsumer` | external downstream feedback | `subject`; `feedback_ref: DownstreamFeedbackRef`; `attempt_id: PublicationAttemptId` | OutboundBoundary | append feedback link / gap successor；不声称 delivered / accepted |
| `ObservationFeedbackConsumer` | external observation feedback | `subject`; `feedback_ref: ObservationFeedbackRef`; `attempt_id: ObservationAttemptId` | InteractionTrace | append feedback / gap successor；不声称 observed / evidence |
| `SubjectIdentityContextUpdateConsumer` | Work / Identity owner update | `subject`; `source_ref: TypedRef`; `source_owner: ExternalOwnerRef`; `freshness: SourceFreshnessEvidence` | ExternalContextMirror | append snapshot / resolution / gap；不建立第三执行主语 |
| `PolicyContextUpdateConsumer` | Governance owner update | `subject`; `source_ref: TypedRef`; `source_owner: ExternalOwnerRef`; `freshness: SourceFreshnessEvidence` | ExternalContextMirror | append neutral policy resolution；不复制 rule / approval body |
| `RuntimeBoundaryContextUpdateConsumer` | Runtime contract / source update | `subject`; `boundary_ref: RuntimeBoundaryRef`; `entry_contract_ref: RuntimeEntryContractRef`; `freshness: SourceFreshnessEvidence` | ExternalContextMirror | append mapping resolution / gap；不复制 Runtime schema / run state |
| `CapabilityContextUpdateConsumer` | Tools / Method owner update | `subject`; `tool_ref: Option<ToolContractViewRef>`; `binding_ref: Option<CapabilityBindingViewRef>`; `method_ref: Option<MethodDefinitionRef>`; `freshness: SourceFreshnessEvidence` | ExternalContextMirror | append capability resolution / gap；不建 registry / provider route |
| `HostRouteContextUpdateConsumer` | host / event-route owner update | `subject`; `host_boundary_ref: HostBoundaryRef`; `route_ref: TypedRef`; `freshness: SourceFreshnessEvidence` | ExternalContextMirror | append boundary resolution / gap；不建立 host health / Bus delivery truth |
| `RuntimeMaterialReceptionConsumer` | committed CP03 fact | `subject`; `reception_id: RuntimeMaterialReceptionId`; `target_resolution_id: ExternalContextResolutionId`; `purpose: InteractionPurpose` | OutboundBoundary | append outbound decision / material / attempt / gap；只接受 accepted reception |
| `MemberCommittedFactConsumer` | committed CP01~04 / CP06 fact | `subject`; `fact_ref: MemberCommittedFactRef`; `purpose: InteractionPurpose`; `predecessor_refs: Vec<InteractionTraceEntryId>` | InteractionTrace | append trace / gap；不得回写 source fact |
| `MemberProjectionUpdateConsumer` | committed CP01~06 fact / resolution | `subject`; `fact_ref: MemberCommittedFactRef`; `target_watermark: ProjectionWatermark` | MemberReadModel | update projection support marker；不得改 source truth |
| `CapabilityOutletSourceUpdateConsumer` | committed CP06 capability resolution / gap | `subject`; `resolution_id: Option<ExternalContextResolutionId>`; `gap_id: Option<ExternalContextGapId>`; `safe_refs: Vec<TypedRef>` | MemberReadModel | update outlet posture；不得消费 Tools / Method raw event |

每一 external Consumer 还必须由 trusted boundary 提供 `SourceEventId`、`SourceEventRef`、`SchemaVersion`、`DeduplicationKey`、`TraceId`；每一 committed-fact Consumer 必须提供 `MemberCommittedFactRef`、`SchemaVersion`、`DeduplicationKey`、`TraceId`。它们由 §7.1 envelope 表达，但在 `L2M-UP-005` 关闭前不是 member-specific wire schema。

### 7.3 Consumer refusal, receipt, duplicate, and body gate

| 阶段 | 条件 | 结果 | reservation / storage 纪律 |
|---|---|---|---|
| worker pre-application | envelope 不完整、name / source family不匹配、双锚缺失、schema 不支持、external raw body 未完成授权 inspection | `Rejected` 或 `UnsupportedVersion` receipt | 不 reserve、不写 receipt store、不调用 service、不声称 ack / quarantine delivery result |
| body gate | `ForbiddenBodyInspection` 非 `Clean`，或 `TransientInspectionMarker` 缺失 | `Rejected` receipt | 不将 body / inspection handle 传给 application，不写 fact / screening |
| valid fresh relation | `Reserved` | service 返回 complete receipt | complete typed receipt + result shell 同 UoW 保存，再 complete reservation |
| valid application nonpositive | `Reserved` + blocked / waiting / unknown / rejected | complete receipt with typed detail | 仍保存 complete receipt；不能只返回 worker text |
| matching duplicate | `Duplicate { result_kind: ConsumerReceipt }` | `DuplicateReplayed` | 只用 `get_consumer_receipt` 读取原完整 carrier；不得重新 inspection、scan、resolve、handoff 或写 marker |
| in flight / conflict | `InFlight` / `Conflict` | `InFlight` / `Conflict` receipt | 无新 result，不重跑 |
| stored receipt missing / wrong kind | matching relation 无完整 carrier | conservative `Rejected` / `Blocked` at boundary | fail closed；不得从 result shell、current Store、fake map或adapter response重建 |

### 7.4 Consumer selector / selected-input source map

| Consumer | selector | selector source | selected input source | 不得从哪里推断 |
|---|---|---|---|---|
| `HostFeedbackConsumer` | `HostAttempt(attempt_id)` | verified input | host feedback ref + local attempt read | host payload / health / session |
| `InboundFactConsumer` | `Subject(subject)` | verified envelope + double anchor | authority / descriptor / marker / summary | raw body、topic、offset |
| `RuntimeMaterialConsumer` | `RuntimeMaterialReception(material_ref)` | verified Runtime source | material / outcome / source refs + metadata | Runtime context / plan / outcome body |
| `DeliveryFeedbackConsumer` | `OutboundDecision(attempt_id)` | verified input | feedback ref + local publication attempt | downstream body / delivery ack |
| `ObservationFeedbackConsumer` | `Observation(attempt_id)` | verified input | feedback ref + local observation attempt | observation backend response body |
| five CP06 update Consumers | `ExternalResolution(source_ref / boundary / capability / route)` | verified owner-specific source | named safe refs + freshness | generic resolver、owner body、route string |
| `RuntimeMaterialReceptionConsumer` | `RuntimeMaterialReception(reception_id)` | committed fact envelope | reception Store + target resolution + explicit purpose | Runtime material source scan |
| `MemberCommittedFactConsumer` | `Interaction(fact_ref)` | committed fact envelope | finite committed ref + predecessors + purpose | arbitrary Store scan / semantic event body |
| `MemberProjectionUpdateConsumer` | `Projection(fact_ref)` | committed fact envelope | finite fact + explicit target watermark | current external truth / query cursor |
| `CapabilityOutletSourceUpdateConsumer` | `Projection(resolution/gap)` | committed fact envelope | CP06 resolution / gap + safe refs | Tools / Method external event / registry |

## 8. Outbound semantic event candidates（24，全部 blocked）

`L2M-UP-005` 未解除。因此本节**只登记语义名称及其要表达的已提交事实变化**，不定义任何 event carrier、envelope、payload、source、subject、schema version、route、topic、publisher、outbox、delivery confirmation、retry 或 consumer binding。下表不是可发布协议。

| CP | semantic candidate | 仅冻结的业务语义 | 状态 |
|---|---|---|---|
| CP01 | `MemberStartupAdmissionRecorded` | startup admission 已形成 local committed record。 | blocked by `L2M-UP-005` |
| CP01 | `MemberPresenceChanged` | member presence 出现新 local revision。 | blocked by `L2M-UP-005` |
| CP01 | `HostCollaborationAttemptRecorded` | host collaboration attempt 已被本仓记录。 | blocked by `L2M-UP-005` |
| CP02 | `MemberSubscriptionScopeChanged` | subscription scope decision 出现新 local revision。 | blocked by `L2M-UP-005` |
| CP02 | `MemberInboundFactRecorded` | body-free inbound fact record 已提交。 | blocked by `L2M-UP-005` |
| CP02 | `MemberScreeningDecided` | member-side screening decision 已提交。 | blocked by `L2M-UP-005` |
| CP03 | `MemberRuntimeDeliveryDecided` | Runtime delivery 的 local decision 已提交。 | blocked by `L2M-UP-005` |
| CP03 | `MemberRuntimeSubmissionAttemptRecorded` | Runtime submission attempt 已被本仓记录。 | blocked by `L2M-UP-005` |
| CP03 | `MemberRuntimeResultLinked` | Runtime result ref 已被本仓链接。 | blocked by `L2M-UP-005` |
| CP03 | `MemberRuntimeMaterialReceived` | safe Runtime material reception 已被本仓接收。 | blocked by `L2M-UP-005` |
| CP04 | `MemberOutboundDecided` | outbound decision 已提交。 | blocked by `L2M-UP-005` |
| CP04 | `MemberOutboundMaterialPrepared` | body-free outbound material 已制备。 | blocked by `L2M-UP-005` |
| CP04 | `MemberPublicationAttemptRecorded` | publication attempt 已被本仓记录。 | blocked by `L2M-UP-005` |
| CP04 | `MemberPublicationGapChanged` | publication gap 出现 local successor。 | blocked by `L2M-UP-005` |
| CP05 | `MemberInteractionTraceRecorded` | interaction trace entry 已追加。 | blocked by `L2M-UP-005` |
| CP05 | `MemberInteractionGapChanged` | interaction gap 出现 local successor。 | blocked by `L2M-UP-005` |
| CP05 | `MemberObservationMaterialPrepared` | observation material 已制备。 | blocked by `L2M-UP-005` |
| CP05 | `MemberObservationAttemptRecorded` | observation attempt 已被本仓记录。 | blocked by `L2M-UP-005` |
| CP06 | `MemberExternalContextResolutionChanged` | neutral external-context resolution 出现新 local revision。 | blocked by `L2M-UP-005` |
| CP06 | `MemberExternalContextGapChanged` | external-context gap 出现 local successor。 | blocked by `L2M-UP-005` |
| CP07 | `MemberSummaryProjectionChanged` | member summary projection 出现新 revision。 | blocked by `L2M-UP-005` |
| CP07 | `MemberCapabilityOutletChanged` | capability outlet projection 出现新 revision。 | blocked by `L2M-UP-005` |
| CP07 | `MemberDiagnosticViewChanged` | diagnostic view 出现新 revision。 | blocked by `L2M-UP-005` |
| CP07 | `MemberProjectionStateChanged` | projection state 出现 local successor。 | blocked by `L2M-UP-005` |

这些 candidate 不可被当作 `MemberFactEnvelope` 的来源。内部 Consumer 只能消费由正式 Core / Bus authority 将来定义且已证实“已提交”的 carrier；在此之前，相关 entry 只能保持 blocked / waiting。

## 9. Operations Job protocol contracts（5）

### 9.1 Job shared input / output

```rust
/// 本仓对 future Core JobMetadata 槽位的 body-free 映射。
pub struct MemberJobMetadata {
    /// distributed trace identity。
    pub trace_id: TraceId,
    /// logical invocation reference。
    pub job_invocation_ref: MemberJobInvocationRef,
    /// duplicate protection key；不由 run/time 生成。
    pub idempotency_key: MemberOperationIdempotencyKey,
}

/// logical Operations Job request；T 只能是五个具体 Job input。
pub struct MemberJobRequest<T> {
    /// 双锚执行主语。
    pub subject: MemberSubjectAnchor,
    /// system / operator actor。
    pub actor: ActorContext,
    /// body-free job metadata。
    pub metadata: MemberJobMetadata,
    /// 固定五选一 continuation kind。
    pub job_kind: MemberOperationsJobKind,
    /// 具体 Job input。
    pub input: T,
}

/// application Job service 返回给 jobs mapper 的结果。
pub struct MemberJobApplicationResult {
    /// local continuation disposition。
    pub disposition: MemberJobRunDisposition,
    /// fresh / duplicate typed result ref。
    pub result_ref: Option<MemberOperationResultRef>,
    /// fresh 时的完整 report；duplicate 由 typed Store 读回同构 report。
    pub report: Option<MemberJobReport>,
    /// 安全问题集合。
    pub issues: Vec<MemberProtocolIssue>,
}

/// publication relay 的具体输入。
pub struct PublicationRelayJobInput {
    /// 要继续处理的 prepared attempts。
    pub attempt_refs: Vec<PublicationAttemptId>,
    /// 已存在的 publication gaps。
    pub gap_refs: Vec<PublicationGapId>,
    /// 可选 opaque continuation cursor。
    pub continuation_cursor: Option<String>,
}

/// observation relay 的具体输入。
pub struct ObservationRelayJobInput {
    /// 要继续处理的 observation attempts。
    pub attempt_refs: Vec<ObservationAttemptId>,
    /// 已存在的 interaction gaps。
    pub gap_refs: Vec<InteractionGapId>,
    /// 可选 opaque continuation cursor。
    pub continuation_cursor: Option<String>,
}

/// external-context refresh 的具体输入。
pub struct ExternalContextRefreshJobInput {
    /// owner-typed source ref。
    pub source_ref: TypedRef,
    /// context kind / purpose / scope 的显式组合。
    pub context_kind: ExternalContextKind,
    /// consumer purpose。
    pub purpose: ExternalConsumerPurpose,
    /// declared scope。
    pub scope: ExternalContextScope,
    /// 已存在的 resolution / gap / refresh request 关系。
    pub resolution_ref: Option<ExternalContextResolutionId>,
    /// 已登记的 refresh request ref。
    pub refresh_request_ref: Option<ExternalRefreshRequestRef>,
    /// 只能作为 continuation 依据，不能触发 generic resolver。
    pub gap_ref: Option<ExternalContextGapId>,
}

/// member projection rebuild 的具体输入。
pub struct MemberProjectionRebuildJobInput {
    /// committed local source refs，ordered-unique。
    pub committed_fact_refs: Vec<MemberCommittedFactRef>,
    /// CP06 已提交 resolution refs。
    pub resolution_refs: Vec<ExternalContextResolutionId>,
    /// source coverage watermark。
    pub target_watermark: ProjectionWatermark,
    /// 可选 opaque continuation cursor。
    pub continuation_cursor: Option<String>,
}

/// gap reconciliation 的具体输入。
pub struct GapReconciliationJobInput {
    /// 只允许三类已提交 local gap。
    pub gap_refs: Vec<MemberProjectionGapRef>,
    /// owner 已提交的 successor / resolution refs。
    pub successor_refs: Vec<MemberCommittedFactRef>,
    /// source coverage watermark。
    pub target_watermark: ProjectionWatermark,
}
```

### 9.2 五个 Job cards 与 exact service methods

| Job protocol | input source / selector | application owner | exact callable method | report allowed meaning |
|---|---|---|---|---|
| `PublicationRelay` | `OutboundDecision` / prepared attempt + existing gap；来自 Outbound / continuation Store | `OutboundBoundaryService` | `run_publication_relay(context: MemberOperationContext, input: PublicationRelayJobInput)` | local attempt / gap successor refs；不表示 delivered / accepted |
| `ObservationRelay` | `Observation` / prepared attempt + existing gap；来自 InteractionTraceStore | `InteractionTraceService` | `run_observation_relay(context: MemberOperationContext, input: ObservationRelayJobInput)` | local observation attempt / gap refs；不表示 observed / evidence |
| `ExternalContextRefresh` | `ExternalResolution(source_ref)` + existing resolution / gap / request | `ExternalContextMirrorService` | `run_external_context_refresh(context: MemberOperationContext, input: ExternalContextRefreshJobInput)` | new snapshot / resolution / gap refs；不表示 authorized / healthy |
| `MemberProjectionRebuild` | `Projection(committed_fact_refs)` + declared watermark | `MemberReadModelService` | `run_member_projection_rebuild(context: MemberOperationContext, input: MemberProjectionRebuildJobInput)` | new summary / outlet / diagnostic / projection-state refs；不修复 CP01~06 truth |
| `GapReconciliation` | finite `MemberProjectionGapRef` + committed successors | `MemberReadModelService` | `run_gap_reconciliation(context: MemberOperationContext, input: GapReconciliationJobInput)` | new read-side state / freshness refs；不创建或关闭 source gap |

```rust
/// CP04 的 Job continuation callable surface。
pub trait OutboundBoundaryJobPort {
    /// 继续已制备 publication attempt / gap。
    async fn run_publication_relay(&self, context: MemberOperationContext, input: PublicationRelayJobInput) -> Result<MemberJobApplicationResult, ApplicationError>;
}

/// CP05 的 Job continuation callable surface。
pub trait InteractionTraceJobPort {
    /// 继续已制备 observation attempt / gap。
    async fn run_observation_relay(&self, context: MemberOperationContext, input: ObservationRelayJobInput) -> Result<MemberJobApplicationResult, ApplicationError>;
}

/// CP06 的 Job continuation callable surface。
pub trait ExternalContextRefreshJobPort {
    /// 按既有 refresh relation 继续 owner-specific refresh。
    async fn run_external_context_refresh(&self, context: MemberOperationContext, input: ExternalContextRefreshJobInput) -> Result<MemberJobApplicationResult, ApplicationError>;
}

/// CP07 的两个 Job continuation callable surface。
pub trait MemberReadModelJobPort {
    /// 从 committed source rebuild projection。
    async fn run_member_projection_rebuild(&self, context: MemberOperationContext, input: MemberProjectionRebuildJobInput) -> Result<MemberJobApplicationResult, ApplicationError>;
    /// 从已存在 gap / successor 更新 read-side posture。
    async fn run_gap_reconciliation(&self, context: MemberOperationContext, input: GapReconciliationJobInput) -> Result<MemberJobApplicationResult, ApplicationError>;
}
```

### 9.3 Job report / duplicate replay closure

所有五个 Job 均使用 Step 6 已闭合的 `MemberJobReport`，并把 `MemberJobReportFactRef` 限制为 committed local fact 或 projection ref。fresh path 的最小关系为：

```text
MemberJobRequest<T>
  -> MemberOperationContext::from_job(...)
  -> MemberDigestPort::request_digest(MemberCanonicalDigestInput)
  -> MemberIdempotencyStore::reserve(...)
  -> Reserved
  -> named service run_* (...)
  -> MemberJobReportAssembly::finish(...)
  -> MemberStoredResultStore::save_job_report(...)
  -> MemberIdempotencyStore::complete(...)
```

`Duplicate { result_kind: JobReport }` 必须按已完成 reservation 读取完整 `MemberJobReport`；`MemberJobRunResult::duplicate_replayed(...)` 只允许携带该 stored report 的同一 `result_ref`。缺失、kind 错配、digest 错配、job kind / invocation 错配都返回 `StoredReportUnavailable` / `ConsistencyViolation`，不得重新扫描、重建、调用 handoff / resolver 或生成新的 report。

Job 的 `Completed` 仅表示 member-local continuation 已形成可回放 report；`PartiallyCompleted`、`Waiting`、`Blocked`、`Unknown` 必须在 report 的 `advanced_fact_refs` / `unresolved_refs` 和 issues 中显式表达。没有任何 Job outcome 可以被映射为外部 delivered、accepted、observed、authorized、healthy、current 或 readiness。

## 10. Facade 与九个 named application service 的 callable surface

### 10.1 Consumer input typed carriers

为避免 service 方法退化为 generic payload，14 个 Consumer 的 input 类型在 `contracts::consumers` 中逐一命名。字段完整定义以 §7.2 为准，以下代码块固定类型身份和关键字段：

```rust
/// `HostFeedbackConsumer` input。
pub struct HostFeedbackConsumerInput { pub subject: MemberSubjectAnchor, pub feedback_ref: HostFeedbackRef, pub attempt_id: HostCollaborationAttemptId }
/// `InboundFactConsumer` input；不含 raw body。
pub struct InboundFactConsumerInput { pub subject: MemberSubjectAnchor, pub authority_ref: SourceAuthorityRef, pub descriptor: InboundFactDescriptor, pub screening_input: ScreeningInputSummary, pub inspection_marker: TransientInspectionMarker }
/// `RuntimeMaterialConsumer` input；不含 Runtime body。
pub struct RuntimeMaterialConsumerInput { pub subject: MemberSubjectAnchor, pub material_ref: RuntimeSafeHandoffMaterialRef, pub outcome_ref: RuntimeOutcomeRef, pub source_ref: RuntimeSourceRef, pub metadata: RuntimeMaterialMetadata }
/// `DeliveryFeedbackConsumer` input。
pub struct DeliveryFeedbackConsumerInput { pub subject: MemberSubjectAnchor, pub feedback_ref: DownstreamFeedbackRef, pub attempt_id: PublicationAttemptId }
/// `ObservationFeedbackConsumer` input。
pub struct ObservationFeedbackConsumerInput { pub subject: MemberSubjectAnchor, pub feedback_ref: ObservationFeedbackRef, pub attempt_id: ObservationAttemptId }
/// 五类 CP06 owner-specific source update 的共同安全字段。
pub struct ExternalContextUpdateInput { pub subject: MemberSubjectAnchor, pub source_ref: TypedRef, pub source_owner: ExternalOwnerRef, pub freshness: SourceFreshnessEvidence }
/// Runtime boundary update 的专用字段。
pub struct RuntimeBoundaryContextUpdateInput { pub subject: MemberSubjectAnchor, pub boundary_ref: RuntimeBoundaryRef, pub entry_contract_ref: RuntimeEntryContractRef, pub freshness: SourceFreshnessEvidence }
/// capability update 的专用字段。
pub struct CapabilityContextUpdateInput { pub subject: MemberSubjectAnchor, pub tool_ref: Option<ToolContractViewRef>, pub binding_ref: Option<CapabilityBindingViewRef>, pub method_ref: Option<MethodDefinitionRef>, pub freshness: SourceFreshnessEvidence }
/// host route update 的专用字段。
pub struct HostRouteContextUpdateInput { pub subject: MemberSubjectAnchor, pub host_boundary_ref: HostBoundaryRef, pub route_ref: TypedRef, pub freshness: SourceFreshnessEvidence }
/// `RuntimeMaterialReceptionConsumer` input。
pub struct RuntimeMaterialReceptionConsumerInput { pub subject: MemberSubjectAnchor, pub reception_id: RuntimeMaterialReceptionId, pub target_resolution_id: ExternalContextResolutionId, pub purpose: InteractionPurpose }
/// `MemberCommittedFactConsumer` input。
pub struct MemberCommittedFactConsumerInput { pub subject: MemberSubjectAnchor, pub fact_ref: MemberCommittedFactRef, pub purpose: InteractionPurpose, pub predecessor_refs: Vec<InteractionTraceEntryId> }
/// `MemberProjectionUpdateConsumer` input。
pub struct MemberProjectionUpdateConsumerInput { pub subject: MemberSubjectAnchor, pub fact_ref: MemberCommittedFactRef, pub target_watermark: ProjectionWatermark }
/// `CapabilityOutletSourceUpdateConsumer` input。
pub struct CapabilityOutletSourceUpdateConsumerInput { pub subject: MemberSubjectAnchor, pub resolution_id: Option<ExternalContextResolutionId>, pub gap_id: Option<ExternalContextGapId>, pub safe_refs: Vec<TypedRef> }
```

`SubjectIdentityContextUpdateConsumer` 与 `PolicyContextUpdateConsumer` 使用 `ExternalContextUpdateInput`；其 `source_owner.owner_kind` 必须分别匹配 Identity/Work 与 Governance，不能因此形成一个可任意切换 owner 的 generic resolver。每个 service 方法仍以 Consumer 名称确定 owner，input type 只承载该 owner 已验证的字段。

### 10.2 九个 service 的 exact methods

下列 traits 是 application-owned callable surface；`api`、`worker`、`jobs` 只能注入 `MemberApplicationFacadePort`，不能拿到任一 Store、UoW、resolver、handoff、domain object 或 concrete adapter。

```rust
/// CP01 PresenceApplicationService 的完整调用面。
pub trait PresenceApplicationServiceCallable {
    /// `AdmitMemberStartup`。
    async fn admit_member_startup(&self, context: MemberOperationContext, body: AdmitMemberStartupBody) -> Result<MemberCommandApplicationResult<StartupAdmission>, ApplicationError>;
    /// `EstablishMemberPresence`。
    async fn establish_member_presence(&self, context: MemberOperationContext, body: EstablishMemberPresenceBody) -> Result<MemberCommandApplicationResult<MemberPresence>, ApplicationError>;
    /// `TransitionMemberPresence`。
    async fn transition_member_presence(&self, context: MemberOperationContext, body: TransitionMemberPresenceBody) -> Result<MemberCommandApplicationResult<MemberPresence>, ApplicationError>;
    /// `GetMemberPresence`。
    async fn get_member_presence(&self, context: MemberOperationContext, body: GetMemberPresenceBody) -> Result<MemberQueryResponse<MemberPresenceReadSurface>, ApplicationError>;
}

/// CP01 HostCollaborationService 的完整调用面。
pub trait HostCollaborationServiceCallable {
    /// `PrepareHostCollaboration`。
    async fn prepare_host_collaboration(&self, context: MemberOperationContext, body: PrepareHostCollaborationBody) -> Result<MemberCommandApplicationResult<HostCollaborationCommandValue>, ApplicationError>;
    /// `HostFeedbackConsumer`。
    async fn consume_host_feedback(&self, context: MemberOperationContext, input: HostFeedbackConsumerInput) -> Result<MemberConsumerApplicationResult, ApplicationError>;
    /// `GetHostCollaborationPosture`。
    async fn get_host_collaboration_posture(&self, context: MemberOperationContext, body: GetHostCollaborationPostureBody) -> Result<MemberPagedQueryResponse<HostCollaborationPostureView>, ApplicationError>;
}

/// CP02 SubscriptionScopeService 的完整调用面。
pub trait SubscriptionScopeServiceCallable {
    /// `EstablishSubscriptionScope`。
    async fn establish_subscription_scope(&self, context: MemberOperationContext, body: EstablishSubscriptionScopeBody) -> Result<MemberCommandApplicationResult<SubscriptionScopeDecision>, ApplicationError>;
    /// `ReplaceSubscriptionScope`。
    async fn replace_subscription_scope(&self, context: MemberOperationContext, body: ReplaceSubscriptionScopeBody) -> Result<MemberCommandApplicationResult<SubscriptionScopeDecision>, ApplicationError>;
    /// `GetCurrentSubscriptionScope`。
    async fn get_current_subscription_scope(&self, context: MemberOperationContext, body: GetCurrentSubscriptionScopeBody) -> Result<MemberQueryResponse<SubscriptionScopeReadSurface>, ApplicationError>;
}

/// CP02 InboundBoundaryService 的完整调用面。
pub trait InboundBoundaryServiceCallable {
    /// `InboundFactConsumer`。
    async fn consume_inbound_fact(&self, context: MemberOperationContext, input: InboundFactConsumerInput) -> Result<MemberConsumerApplicationResult, ApplicationError>;
    /// `GetScreeningDisposition`。
    async fn get_screening_disposition(&self, context: MemberOperationContext, body: GetScreeningDispositionBody) -> Result<MemberQueryResponse<ScreeningDecisionReadSurface>, ApplicationError>;
}

/// CP03 RuntimeMediationService 的完整调用面。
pub trait RuntimeMediationServiceCallable {
    /// `SubmitScreenedFactToRuntime`。
    async fn submit_screened_fact_to_runtime(&self, context: MemberOperationContext, body: SubmitScreenedFactToRuntimeBody) -> Result<MemberCommandApplicationResult<RuntimeDeliveryCommandValue>, ApplicationError>;
    /// `LinkRuntimeAdmissionResult`。
    async fn link_runtime_admission_result(&self, context: MemberOperationContext, body: LinkRuntimeAdmissionResultBody) -> Result<MemberCommandApplicationResult<RuntimeResultLink>, ApplicationError>;
    /// `RuntimeMaterialConsumer`。
    async fn consume_runtime_material(&self, context: MemberOperationContext, input: RuntimeMaterialConsumerInput) -> Result<MemberConsumerApplicationResult, ApplicationError>;
    /// `GetRuntimeMediationPosture`。
    async fn get_runtime_mediation_posture(&self, context: MemberOperationContext, body: GetRuntimeMediationPostureBody) -> Result<MemberQueryResponse<RuntimeMediationReadSurface>, ApplicationError>;
    /// `GetRuntimeMaterialReception`。
    async fn get_runtime_material_reception(&self, context: MemberOperationContext, body: GetRuntimeMaterialReceptionBody) -> Result<MemberQueryResponse<RuntimeMaterialReceptionReadSurface>, ApplicationError>;
}

/// CP04 OutboundBoundaryService 的完整调用面。
pub trait OutboundBoundaryServiceCallable {
    /// `RuntimeMaterialReceptionConsumer`。
    async fn consume_runtime_material_reception(&self, context: MemberOperationContext, input: RuntimeMaterialReceptionConsumerInput) -> Result<MemberConsumerApplicationResult, ApplicationError>;
    /// `DeliveryFeedbackConsumer`。
    async fn consume_delivery_feedback(&self, context: MemberOperationContext, input: DeliveryFeedbackConsumerInput) -> Result<MemberConsumerApplicationResult, ApplicationError>;
    /// `GetOutboundDecision`。
    async fn get_outbound_decision(&self, context: MemberOperationContext, body: GetOutboundDecisionBody) -> Result<MemberQueryResponse<OutboundDecisionReadSurface>, ApplicationError>;
    /// `GetPublicationPosture`。
    async fn get_publication_posture(&self, context: MemberOperationContext, body: GetPublicationPostureBody) -> Result<MemberPagedQueryResponse<PublicationPostureView>, ApplicationError>;
    /// `PublicationRelay`。
    async fn run_publication_relay(&self, context: MemberOperationContext, input: PublicationRelayJobInput) -> Result<MemberJobApplicationResult, ApplicationError>;
}

/// CP05 InteractionTraceService 的完整调用面。
pub trait InteractionTraceServiceCallable {
    /// `MemberCommittedFactConsumer`。
    async fn consume_member_committed_fact(&self, context: MemberOperationContext, input: MemberCommittedFactConsumerInput) -> Result<MemberConsumerApplicationResult, ApplicationError>;
    /// `ObservationFeedbackConsumer`。
    async fn consume_observation_feedback(&self, context: MemberOperationContext, input: ObservationFeedbackConsumerInput) -> Result<MemberConsumerApplicationResult, ApplicationError>;
    /// `GetInteractionTrace`。
    async fn get_interaction_trace(&self, context: MemberOperationContext, body: GetInteractionTraceBody) -> Result<MemberPagedQueryResponse<InteractionTraceEntry>, ApplicationError>;
    /// `ListInteractionGaps`。
    async fn list_interaction_gaps(&self, context: MemberOperationContext, body: ListInteractionGapsBody) -> Result<MemberPagedQueryResponse<InteractionGap>, ApplicationError>;
    /// `GetObservationPosture`。
    async fn get_observation_posture(&self, context: MemberOperationContext, body: GetObservationPostureBody) -> Result<MemberPagedQueryResponse<ObservationPostureView>, ApplicationError>;
    /// `ObservationRelay`。
    async fn run_observation_relay(&self, context: MemberOperationContext, input: ObservationRelayJobInput) -> Result<MemberJobApplicationResult, ApplicationError>;
}

/// CP06 ExternalContextMirrorService 的完整调用面。
pub trait ExternalContextMirrorServiceCallable {
    /// `ResolveExternalContext`。
    async fn resolve_external_context(&self, context: MemberOperationContext, body: ResolveExternalContextBody) -> Result<MemberCommandApplicationResult<ExternalContextCommandValue>, ApplicationError>;
    /// `RequestExternalContextRefresh`。
    async fn request_external_context_refresh(&self, context: MemberOperationContext, body: RequestExternalContextRefreshBody) -> Result<MemberCommandApplicationResult<ExternalRefreshCommandValue>, ApplicationError>;
    /// `SubjectIdentityContextUpdateConsumer`。
    async fn consume_subject_identity_context_update(&self, context: MemberOperationContext, input: ExternalContextUpdateInput) -> Result<MemberConsumerApplicationResult, ApplicationError>;
    /// `PolicyContextUpdateConsumer`。
    async fn consume_policy_context_update(&self, context: MemberOperationContext, input: ExternalContextUpdateInput) -> Result<MemberConsumerApplicationResult, ApplicationError>;
    /// `RuntimeBoundaryContextUpdateConsumer`。
    async fn consume_runtime_boundary_context_update(&self, context: MemberOperationContext, input: RuntimeBoundaryContextUpdateInput) -> Result<MemberConsumerApplicationResult, ApplicationError>;
    /// `CapabilityContextUpdateConsumer`。
    async fn consume_capability_context_update(&self, context: MemberOperationContext, input: CapabilityContextUpdateInput) -> Result<MemberConsumerApplicationResult, ApplicationError>;
    /// `HostRouteContextUpdateConsumer`。
    async fn consume_host_route_context_update(&self, context: MemberOperationContext, input: HostRouteContextUpdateInput) -> Result<MemberConsumerApplicationResult, ApplicationError>;
    /// `GetExternalContextResolution`。
    async fn get_external_context_resolution(&self, context: MemberOperationContext, body: GetExternalContextResolutionBody) -> Result<MemberQueryResponse<ExternalContextResolutionReadSurface>, ApplicationError>;
    /// `ListExternalContextGaps`。
    async fn list_external_context_gaps(&self, context: MemberOperationContext, body: ListExternalContextGapsBody) -> Result<MemberPagedQueryResponse<ExternalContextGap>, ApplicationError>;
    /// `ExternalContextRefresh`。
    async fn run_external_context_refresh(&self, context: MemberOperationContext, input: ExternalContextRefreshJobInput) -> Result<MemberJobApplicationResult, ApplicationError>;
}

/// CP07 MemberReadModelService 的完整调用面。
pub trait MemberReadModelServiceCallable {
    /// `MemberProjectionUpdateConsumer`。
    async fn consume_member_projection_update(&self, context: MemberOperationContext, input: MemberProjectionUpdateConsumerInput) -> Result<MemberConsumerApplicationResult, ApplicationError>;
    /// `CapabilityOutletSourceUpdateConsumer`。
    async fn consume_capability_outlet_source_update(&self, context: MemberOperationContext, input: CapabilityOutletSourceUpdateConsumerInput) -> Result<MemberConsumerApplicationResult, ApplicationError>;
    /// `GetMemberSummary`。
    async fn get_member_summary(&self, context: MemberOperationContext, body: GetMemberSummaryBody) -> Result<MemberQueryResponse<MemberSummaryView>, ApplicationError>;
    /// `GetCapabilityOutlet`。
    async fn get_capability_outlet(&self, context: MemberOperationContext, body: GetCapabilityOutletBody) -> Result<MemberQueryResponse<CapabilityOutletView>, ApplicationError>;
    /// `GetMemberDiagnostics`。
    async fn get_member_diagnostics(&self, context: MemberOperationContext, body: GetMemberDiagnosticsBody) -> Result<MemberQueryResponse<MemberDiagnosticView>, ApplicationError>;
    /// `MemberProjectionRebuild`。
    async fn run_member_projection_rebuild(&self, context: MemberOperationContext, input: MemberProjectionRebuildJobInput) -> Result<MemberJobApplicationResult, ApplicationError>;
    /// `GapReconciliation`。
    async fn run_gap_reconciliation(&self, context: MemberOperationContext, input: GapReconciliationJobInput) -> Result<MemberJobApplicationResult, ApplicationError>;
}
```

### 10.3 Facade callable contract与静态映射

`MemberApplicationFacade` 仍使用 Step 6 已定义的九个 concrete service 字段；本 Step 只增加其 typed dispatch contract，不把 facade 变成第十个 owner。

```rust
/// entry-facing facade 的完整 typed dispatch surface。
pub trait MemberApplicationFacadePort {
    /// 10 个 Command 方法、16 个 Query 方法、14 个 Consumer 方法和 5 个 Job 方法均逐一显式声明。
    async fn admit_member_startup(&self, context: MemberOperationContext, body: AdmitMemberStartupBody) -> Result<MemberCommandApplicationResult<StartupAdmission>, ApplicationError>;
    async fn establish_member_presence(&self, context: MemberOperationContext, body: EstablishMemberPresenceBody) -> Result<MemberCommandApplicationResult<MemberPresence>, ApplicationError>;
    async fn transition_member_presence(&self, context: MemberOperationContext, body: TransitionMemberPresenceBody) -> Result<MemberCommandApplicationResult<MemberPresence>, ApplicationError>;
    async fn prepare_host_collaboration(&self, context: MemberOperationContext, body: PrepareHostCollaborationBody) -> Result<MemberCommandApplicationResult<HostCollaborationCommandValue>, ApplicationError>;
    async fn establish_subscription_scope(&self, context: MemberOperationContext, body: EstablishSubscriptionScopeBody) -> Result<MemberCommandApplicationResult<SubscriptionScopeDecision>, ApplicationError>;
    async fn replace_subscription_scope(&self, context: MemberOperationContext, body: ReplaceSubscriptionScopeBody) -> Result<MemberCommandApplicationResult<SubscriptionScopeDecision>, ApplicationError>;
    async fn submit_screened_fact_to_runtime(&self, context: MemberOperationContext, body: SubmitScreenedFactToRuntimeBody) -> Result<MemberCommandApplicationResult<RuntimeDeliveryCommandValue>, ApplicationError>;
    async fn link_runtime_admission_result(&self, context: MemberOperationContext, body: LinkRuntimeAdmissionResultBody) -> Result<MemberCommandApplicationResult<RuntimeResultLink>, ApplicationError>;
    async fn resolve_external_context(&self, context: MemberOperationContext, body: ResolveExternalContextBody) -> Result<MemberCommandApplicationResult<ExternalContextCommandValue>, ApplicationError>;
    async fn request_external_context_refresh(&self, context: MemberOperationContext, body: RequestExternalContextRefreshBody) -> Result<MemberCommandApplicationResult<ExternalRefreshCommandValue>, ApplicationError>;

    async fn get_member_presence(&self, context: MemberOperationContext, body: GetMemberPresenceBody) -> Result<MemberQueryResponse<MemberPresenceReadSurface>, ApplicationError>;
    async fn get_host_collaboration_posture(&self, context: MemberOperationContext, body: GetHostCollaborationPostureBody) -> Result<MemberPagedQueryResponse<HostCollaborationPostureView>, ApplicationError>;
    async fn get_current_subscription_scope(&self, context: MemberOperationContext, body: GetCurrentSubscriptionScopeBody) -> Result<MemberQueryResponse<SubscriptionScopeReadSurface>, ApplicationError>;
    async fn get_screening_disposition(&self, context: MemberOperationContext, body: GetScreeningDispositionBody) -> Result<MemberQueryResponse<ScreeningDecisionReadSurface>, ApplicationError>;
    async fn get_runtime_mediation_posture(&self, context: MemberOperationContext, body: GetRuntimeMediationPostureBody) -> Result<MemberQueryResponse<RuntimeMediationReadSurface>, ApplicationError>;
    async fn get_runtime_material_reception(&self, context: MemberOperationContext, body: GetRuntimeMaterialReceptionBody) -> Result<MemberQueryResponse<RuntimeMaterialReceptionReadSurface>, ApplicationError>;
    async fn get_outbound_decision(&self, context: MemberOperationContext, body: GetOutboundDecisionBody) -> Result<MemberQueryResponse<OutboundDecisionReadSurface>, ApplicationError>;
    async fn get_publication_posture(&self, context: MemberOperationContext, body: GetPublicationPostureBody) -> Result<MemberPagedQueryResponse<PublicationPostureView>, ApplicationError>;
    async fn get_interaction_trace(&self, context: MemberOperationContext, body: GetInteractionTraceBody) -> Result<MemberPagedQueryResponse<InteractionTraceEntry>, ApplicationError>;
    async fn list_interaction_gaps(&self, context: MemberOperationContext, body: ListInteractionGapsBody) -> Result<MemberPagedQueryResponse<InteractionGap>, ApplicationError>;
    async fn get_observation_posture(&self, context: MemberOperationContext, body: GetObservationPostureBody) -> Result<MemberPagedQueryResponse<ObservationPostureView>, ApplicationError>;
    async fn get_external_context_resolution(&self, context: MemberOperationContext, body: GetExternalContextResolutionBody) -> Result<MemberQueryResponse<ExternalContextResolutionReadSurface>, ApplicationError>;
    async fn list_external_context_gaps(&self, context: MemberOperationContext, body: ListExternalContextGapsBody) -> Result<MemberPagedQueryResponse<ExternalContextGap>, ApplicationError>;
    async fn get_member_summary(&self, context: MemberOperationContext, body: GetMemberSummaryBody) -> Result<MemberQueryResponse<MemberSummaryView>, ApplicationError>;
    async fn get_capability_outlet(&self, context: MemberOperationContext, body: GetCapabilityOutletBody) -> Result<MemberQueryResponse<CapabilityOutletView>, ApplicationError>;
    async fn get_member_diagnostics(&self, context: MemberOperationContext, body: GetMemberDiagnosticsBody) -> Result<MemberQueryResponse<MemberDiagnosticView>, ApplicationError>;

    async fn consume_host_feedback(&self, context: MemberOperationContext, input: HostFeedbackConsumerInput) -> Result<MemberConsumerApplicationResult, ApplicationError>;
    async fn consume_inbound_fact(&self, context: MemberOperationContext, input: InboundFactConsumerInput) -> Result<MemberConsumerApplicationResult, ApplicationError>;
    async fn consume_runtime_material(&self, context: MemberOperationContext, input: RuntimeMaterialConsumerInput) -> Result<MemberConsumerApplicationResult, ApplicationError>;
    async fn consume_delivery_feedback(&self, context: MemberOperationContext, input: DeliveryFeedbackConsumerInput) -> Result<MemberConsumerApplicationResult, ApplicationError>;
    async fn consume_observation_feedback(&self, context: MemberOperationContext, input: ObservationFeedbackConsumerInput) -> Result<MemberConsumerApplicationResult, ApplicationError>;
    async fn consume_subject_identity_context_update(&self, context: MemberOperationContext, input: ExternalContextUpdateInput) -> Result<MemberConsumerApplicationResult, ApplicationError>;
    async fn consume_policy_context_update(&self, context: MemberOperationContext, input: ExternalContextUpdateInput) -> Result<MemberConsumerApplicationResult, ApplicationError>;
    async fn consume_runtime_boundary_context_update(&self, context: MemberOperationContext, input: RuntimeBoundaryContextUpdateInput) -> Result<MemberConsumerApplicationResult, ApplicationError>;
    async fn consume_capability_context_update(&self, context: MemberOperationContext, input: CapabilityContextUpdateInput) -> Result<MemberConsumerApplicationResult, ApplicationError>;
    async fn consume_host_route_context_update(&self, context: MemberOperationContext, input: HostRouteContextUpdateInput) -> Result<MemberConsumerApplicationResult, ApplicationError>;
    async fn consume_runtime_material_reception(&self, context: MemberOperationContext, input: RuntimeMaterialReceptionConsumerInput) -> Result<MemberConsumerApplicationResult, ApplicationError>;
    async fn consume_member_committed_fact(&self, context: MemberOperationContext, input: MemberCommittedFactConsumerInput) -> Result<MemberConsumerApplicationResult, ApplicationError>;
    async fn consume_member_projection_update(&self, context: MemberOperationContext, input: MemberProjectionUpdateConsumerInput) -> Result<MemberConsumerApplicationResult, ApplicationError>;
    async fn consume_capability_outlet_source_update(&self, context: MemberOperationContext, input: CapabilityOutletSourceUpdateConsumerInput) -> Result<MemberConsumerApplicationResult, ApplicationError>;

    async fn run_publication_relay(&self, context: MemberOperationContext, input: PublicationRelayJobInput) -> Result<MemberJobApplicationResult, ApplicationError>;
    async fn run_observation_relay(&self, context: MemberOperationContext, input: ObservationRelayJobInput) -> Result<MemberJobApplicationResult, ApplicationError>;
    async fn run_external_context_refresh(&self, context: MemberOperationContext, input: ExternalContextRefreshJobInput) -> Result<MemberJobApplicationResult, ApplicationError>;
    async fn run_member_projection_rebuild(&self, context: MemberOperationContext, input: MemberProjectionRebuildJobInput) -> Result<MemberJobApplicationResult, ApplicationError>;
    async fn run_gap_reconciliation(&self, context: MemberOperationContext, input: GapReconciliationJobInput) -> Result<MemberJobApplicationResult, ApplicationError>;
}
```

### 10.4 operation → service selector map

| operation family | canonical operation(s) | `MemberServiceRoute` | facade selected field / method |
|---|---|---|---|
| presence | `AdmitMemberStartup`; `EstablishMemberPresence`; `TransitionMemberPresence`; `GetMemberPresence` | `Presence` | `presence_service` / same-named method |
| host | `PrepareHostCollaboration`; `HostFeedbackConsumer`; `GetHostCollaborationPosture` | `HostCollaboration` | `host_collaboration_service` / same-named method |
| scope | `EstablishSubscriptionScope`; `ReplaceSubscriptionScope`; `GetCurrentSubscriptionScope` | `SubscriptionScope` | `subscription_scope_service` / same-named method |
| inbound | `InboundFactConsumer`; `GetScreeningDisposition` | `InboundBoundary` | `inbound_boundary_service` / same-named method |
| Runtime | `SubmitScreenedFactToRuntime`; `LinkRuntimeAdmissionResult`; `RuntimeMaterialConsumer`; `GetRuntimeMediationPosture`; `GetRuntimeMaterialReception` | `RuntimeMediation` | `runtime_mediation_service` / same-named method |
| outbound | `RuntimeMaterialReceptionConsumer`; `DeliveryFeedbackConsumer`; `GetOutboundDecision`; `GetPublicationPosture`; `PublicationRelay` | `OutboundBoundary` | `outbound_boundary_service` / same-named method |
| trace | `MemberCommittedFactConsumer`; `ObservationFeedbackConsumer`; `GetInteractionTrace`; `ListInteractionGaps`; `GetObservationPosture`; `ObservationRelay` | `InteractionTrace` | `interaction_trace_service` / same-named method |
| external mirror | `ResolveExternalContext`; `RequestExternalContextRefresh`; five CP06 source Consumers; two external Queries; `ExternalContextRefresh` | `ExternalContextMirror` | `external_context_mirror_service` / same-named method |
| read model | `MemberProjectionUpdateConsumer`; `CapabilityOutletSourceUpdateConsumer`; three projection Queries; `MemberProjectionRebuild`; `GapReconciliation` | `MemberReadModel` | `member_read_model_service` / same-named method |

`MemberApplicationFacade::service_for(&MemberOperationName)` 只能返回上述有限 `MemberServiceRoute`。未知 operation、operation 与 input type 不匹配、或同一 name 试图映射两个 service 时，facade 返回 `ApplicationError::ContractViolation`；不得按 route 字符串、body 字段顺序、typed ref 顺序或 service locator 动态选择。

## 11. Canonical digest closure

### 11.1 有限 typed canonical carrier

本节只闭合“哪些字段可以进入 request digest”以及它们的来源；digest 算法、编码和物理持久化仍留给 Step 13 / 后续 persistence 设计。canonical carrier 必须是有限、带 operation tag、body-free 的静态 union，不能退化成 generic payload、`HashMap`、`Vec<TypedRef>` 或 debug/string serialization。

```rust
/// The only three non-query families that may request a canonical digest.
pub enum MemberCanonicalDigestInput {
    /// One of the ten command projections below.
    Command(MemberCanonicalCommandInput),
    /// One of the fourteen consumer projections below.
    Consumer(MemberCanonicalConsumerInput),
    /// One of the five logical job projections below.
    Job(MemberCanonicalJobInput),
}

/// A source proof that is stable enough to participate in a digest.
pub enum MemberCanonicalFreshnessProof {
    /// Owner-issued monotonic/source version.
    SourceVersion(SourceVersion),
    /// Owner-issued receipt or marker reference.
    ResolutionReceipt(ExternalTypedRef),
}

/// External source identity after a trusted boundary has validated its owner.
pub struct MemberCanonicalExternalSourceIdentity {
    /// Stable external event identity; never a topic, offset, or body hash.
    pub source_event_id: SourceEventId,
    /// Owner-typed event reference.
    pub source_event_ref: SourceEventRef,
    /// Formal authority that owns the event.
    pub source_authority_ref: SourceAuthorityRef,
    /// Accepted source schema version.
    pub schema_version: SchemaVersion,
    /// Optional stable owner proof; an owner timestamp alone is not accepted.
    pub freshness_proof: Option<MemberCanonicalFreshnessProof>,
}

/// Committed local source identity for the four committed-fact consumers.
pub struct MemberCanonicalCommittedFactIdentity {
    /// A fact that has already been committed by a member-owned UoW.
    pub fact_ref: MemberCommittedFactRef,
    /// Schema version of that committed carrier.
    pub schema_version: SchemaVersion,
}

/// Role-checked wrapper for a CP06 source ref whose exact owner type is still upstream-owned.
pub struct MemberCanonicalOwnerTypedRef {
    /// Expected owner kind for this operation variant.
    pub owner_kind: ExternalOwnerKind,
    /// Opaque owner reference; the operation validator fixes the allowed role.
    pub external_ref: core_contracts::metadata::ExternalReferenceRef,
}

/// Role-checked route ref used only by the host-route projection.
pub struct MemberCanonicalHostRouteRef(pub MemberCanonicalOwnerTypedRef);

/// A subscription scope projection with explicit, ordered-unique safe members.
pub struct MemberCanonicalSubscriptionScope {
    /// Safe fact categories; no free-form filter expression.
    pub fact_categories: Vec<SafeStatusCategory>,
    /// Role-checked boundaries; unsupported owner kinds fail closed.
    pub boundary_refs: Vec<MemberCanonicalOwnerTypedRef>,
}

/// Canonical projection of `ExternalContextScope`; its boundary role is fixed
/// by the enclosing operation and is never inferred from a string.
pub struct MemberCanonicalExternalContextScope {
    /// Project member to which the owner lookup applies.
    pub subject_ref: ProjectMemberRef,
    /// Purpose declared by the named operation; must equal the enclosing purpose.
    pub purpose: ExternalConsumerPurpose,
    /// Optional role-checked boundary constraint.
    pub boundary_ref: Option<MemberCanonicalOwnerTypedRef>,
}

/// A validated opaque continuation token. It is included as an exact token,
/// never parsed to infer a subject, route, offset, or source state.
pub struct MemberCanonicalContinuationCursor(pub String);

/// Safe, owner-checked outlet references; arbitrary `TypedRef` values are not accepted.
pub enum MemberCanonicalOutletRef {
    /// Tool contract safe view.
    Tool(ToolContractViewRef),
    /// Capability binding safe view.
    Capability(CapabilityBindingViewRef),
    /// Method definition safe view.
    Method(MethodDefinitionRef),
    /// Runtime safe view.
    Runtime(RuntimeSafeViewRef),
}

/// Body-free inspection result used by canonical inbound/material projections.
pub enum MemberCanonicalInspection {
    /// The transient inspection found only permitted categories.
    Clean { fact_category: SafeStatusCategory },
    /// The boundary rejected a forbidden category; no rejected body is retained.
    Rejected { reason_category: SafeReasonCategory },
}
```

`MemberCanonicalOwnerTypedRef` 不是新的 owner truth。它只把当前仍由上游决定的 opaque ref 与**本变体声明的 owner role**绑定；若 owner kind、ref wrapper 或上游 source proof 不能核验，canonicalization 必须返回 `BlockedDependency`，不能把任意 `TypedRef` 放进 digest。`MemberCanonicalContinuationCursor` 只有在入口已验证、作为同一 logical continuation 的不透明 token 时才可进入；实现不得解析其内容。

### 11.2 Command canonical projections（10）

```rust
/// Exactly ten command-specific, body-free projections.
pub enum MemberCanonicalCommandInput {
    AdmitMemberStartup {
        subject: MemberSubjectAnchor,
        startup_context_ref: StartupContextRef,
        credential_ref: Option<CredentialRef>,
    },
    EstablishMemberPresence {
        subject: MemberSubjectAnchor,
        startup_admission_id: StartupAdmissionId,
        start_reason: SafeReasonCategory,
    },
    TransitionMemberPresence {
        subject: MemberSubjectAnchor,
        presence_id: MemberPresenceId,
        target_status: MemberPresenceStatus,
        reason: PresenceTransitionReason,
        expected_revision: ExpectedRevision,
    },
    PrepareHostCollaboration {
        subject: MemberSubjectAnchor,
        presence_id: MemberPresenceId,
        kind: HostCollaborationKind,
        purpose: InteractionPurpose,
        safe_status_category: SafeStatusCategory,
    },
    EstablishSubscriptionScope {
        subject: MemberSubjectAnchor,
        presence_id: MemberPresenceId,
        scope: MemberCanonicalSubscriptionScope,
        resolution_id: ExternalContextResolutionId,
    },
    ReplaceSubscriptionScope {
        subject: MemberSubjectAnchor,
        decision_id: SubscriptionScopeDecisionId,
        expected_revision: ExpectedRevision,
        scope: MemberCanonicalSubscriptionScope,
        resolution_id: ExternalContextResolutionId,
    },
    SubmitScreenedFactToRuntime {
        subject: MemberSubjectAnchor,
        screening_id: ScreeningDecisionId,
        inbound_fact_id: InboundFactRecordId,
        runtime_boundary_ref: RuntimeBoundaryRef,
        resolution_id: ExternalContextResolutionId,
    },
    LinkRuntimeAdmissionResult {
        subject: MemberSubjectAnchor,
        attempt_id: RuntimeSubmissionAttemptId,
        admission_ref: RuntimeAdmissionDecisionRef,
        classification: RuntimeResultClassification,
        source_ref: RuntimeSourceRef,
    },
    ResolveExternalContext {
        subject: MemberSubjectAnchor,
        source_ref: MemberCanonicalOwnerTypedRef,
        source_owner: ExternalOwnerRef,
        context_kind: ExternalContextKind,
        purpose: ExternalConsumerPurpose,
        scope: MemberCanonicalExternalContextScope,
        freshness_proof: MemberCanonicalFreshnessProof,
    },
    RequestExternalContextRefresh {
        subject: MemberSubjectAnchor,
        source_ref: MemberCanonicalOwnerTypedRef,
        context_kind: ExternalContextKind,
        purpose: ExternalConsumerPurpose,
        scope: MemberCanonicalExternalContextScope,
        reason: SafeReasonCategory,
    },
}
```

| Command variant | canonical fields included | selected-input source / fail-closed rule |
|---|---|---|
| `AdmitMemberStartup` | 双锚、`startup_context_ref`、可选 `credential_ref` | trusted command body；credential owner 未核验时不得把 credential material 或 token 放入 digest |
| `EstablishMemberPresence` | 双锚、`startup_admission_id`、`start_reason` | admission Store 的 accepted anchor + body safe reason；不把 local start timestamp 纳入 |
| `TransitionMemberPresence` | 双锚、presence ID、target status、reason、expected revision | request + same Store versioned read；不以 host heartbeat 推 status |
| `PrepareHostCollaboration` | 双锚、presence ID、kind、purpose、safe status | named command body + committed presence；不纳入 host route / session state |
| `EstablishSubscriptionScope` | 双锚、presence ID、canonical scope、resolution ID | CP06 committed resolution + explicit scope；unsupported boundary owner fail closed |
| `ReplaceSubscriptionScope` | 双锚、decision ID、expected revision、canonical scope、resolution ID | same Store version + CP06 resolution；不以 Query cursor 代 revision |
| `SubmitScreenedFactToRuntime` | 双锚、screening ID、inbound fact ID、Runtime boundary ref、resolution ID | committed screening/fact + formally mapped boundary；不纳 raw inbound body 或 Runtime run |
| `LinkRuntimeAdmissionResult` | 双锚、attempt ID、admission ref、safe classification、Runtime source ref | owner-verified result link；port ack、时间或单独 result ID 不足时 fail closed |
| `ResolveExternalContext` | 双锚、role-checked source ref/owner、context kind、purpose、scope、stable freshness proof | owner-specific resolver safe output；仅 owner version/receipt proof可进 digest |
| `RequestExternalContextRefresh` | 双锚、role-checked source ref、context kind、purpose、scope、reason | existing mirror gap / explicit command；不得由 Query stale flag 推导 |

`EstablishMemberPresence` 的 `PresenceStartContext` 只投影其稳定 `reason_category` 和双锚；`MemberCorrelation`、Core request ID、trace ID、received-at、generated IDs 与 local clock 均不进入 canonical input。`MemberSubscriptionScope` 的 vectors 必须保持其既定 ordered-unique 语义；不能通过 struct field order、debug 输出或字符串拼接推导 digest。

### 11.3 Consumer canonical projections（14）

Consumer canonical input 按 source family 再分为 10 个 external variant 与 4 个 committed-fact variant；每一个 operation name 仍是唯一且显式的 enum variant，不允许把两类压成一个 listener payload。

```rust
/// Ten external-source consumer projections.
pub enum MemberCanonicalExternalConsumerInput {
    HostFeedback { subject: MemberSubjectAnchor, source: MemberCanonicalExternalSourceIdentity, feedback_ref: HostFeedbackRef, attempt_id: HostCollaborationAttemptId },
    InboundFact { subject: MemberSubjectAnchor, source: MemberCanonicalExternalSourceIdentity, authority_ref: SourceAuthorityRef, source_event_ref: SourceEventRef, fact_category: SafeStatusCategory, inspection: MemberCanonicalInspection },
    RuntimeMaterial { subject: MemberSubjectAnchor, source: MemberCanonicalExternalSourceIdentity, material_ref: RuntimeSafeHandoffMaterialRef, outcome_ref: RuntimeOutcomeRef, runtime_source_ref: RuntimeSourceRef, material_digest: ContractFingerprint, material_category: SafeStatusCategory, inspection: MemberCanonicalInspection },
    DeliveryFeedback { subject: MemberSubjectAnchor, source: MemberCanonicalExternalSourceIdentity, feedback_ref: DownstreamFeedbackRef, attempt_id: PublicationAttemptId },
    ObservationFeedback { subject: MemberSubjectAnchor, source: MemberCanonicalExternalSourceIdentity, feedback_ref: ObservationFeedbackRef, attempt_id: ObservationAttemptId },
    SubjectIdentityContextUpdate { subject: MemberSubjectAnchor, source: MemberCanonicalExternalSourceIdentity, source_ref: MemberCanonicalOwnerTypedRef, source_owner: ExternalOwnerRef, freshness_proof: MemberCanonicalFreshnessProof },
    PolicyContextUpdate { subject: MemberSubjectAnchor, source: MemberCanonicalExternalSourceIdentity, source_ref: MemberCanonicalOwnerTypedRef, source_owner: ExternalOwnerRef, freshness_proof: MemberCanonicalFreshnessProof },
    RuntimeBoundaryContextUpdate { subject: MemberSubjectAnchor, source: MemberCanonicalExternalSourceIdentity, boundary_ref: RuntimeBoundaryRef, entry_contract_ref: RuntimeEntryContractRef, freshness_proof: MemberCanonicalFreshnessProof },
    CapabilityContextUpdate { subject: MemberSubjectAnchor, source: MemberCanonicalExternalSourceIdentity, tool_ref: Option<ToolContractViewRef>, binding_ref: Option<CapabilityBindingViewRef>, method_ref: Option<MethodDefinitionRef>, freshness_proof: MemberCanonicalFreshnessProof },
    HostRouteContextUpdate { subject: MemberSubjectAnchor, source: MemberCanonicalExternalSourceIdentity, host_boundary_ref: HostBoundaryRef, route_ref: MemberCanonicalHostRouteRef, freshness_proof: MemberCanonicalFreshnessProof },
}

/// Four committed-fact consumer projections.
pub enum MemberCanonicalCommittedFactConsumerInput {
    RuntimeMaterialReception { subject: MemberSubjectAnchor, source: MemberCanonicalCommittedFactIdentity, reception_id: RuntimeMaterialReceptionId, target_resolution_id: ExternalContextResolutionId, purpose: InteractionPurpose },
    MemberCommittedFact { subject: MemberSubjectAnchor, source: MemberCanonicalCommittedFactIdentity, fact_ref: MemberCommittedFactRef, purpose: InteractionPurpose, predecessor_refs: Vec<InteractionTraceEntryId> },
    MemberProjectionUpdate { subject: MemberSubjectAnchor, source: MemberCanonicalCommittedFactIdentity, fact_ref: MemberCommittedFactRef, target_watermark: ProjectionWatermark },
    CapabilityOutletSourceUpdate { subject: MemberSubjectAnchor, source: MemberCanonicalCommittedFactIdentity, resolution_id: Option<ExternalContextResolutionId>, gap_id: Option<ExternalContextGapId>, safe_refs: Vec<MemberCanonicalOutletRef> },
}

/// Explicitly identifies the ten + four consumer variants.
pub enum MemberCanonicalConsumerInput {
    External(MemberCanonicalExternalConsumerInput),
    CommittedFact(MemberCanonicalCommittedFactConsumerInput),
}
```

| Consumer variant | canonical identity and fields | source / ordering rule |
|---|---|---|
| `HostFeedback` | external source identity、双锚、feedback ref、attempt ID | trusted host envelope + local attempt；不纳 host body/health/session |
| `InboundFact` | external source identity、双锚、authority ref、source event ref、fact category、inspection result | inspection 已完成且 body 已丢弃；`Rejected` 只保留 safe reason |
| `RuntimeMaterial` | external source identity、双锚、material/outcome/runtime-source refs、material digest/category、inspection | Runtime safe handoff metadata；不复制 context/plan/outcome/tool body |
| `DeliveryFeedback` | external source identity、双锚、feedback ref、publication attempt | verified feedback ref；不声称 downstream ack |
| `ObservationFeedback` | external source identity、双锚、feedback ref、observation attempt | verified feedback ref；不声称 observed/evidence |
| `SubjectIdentityContextUpdate` | external source identity、双锚、role-checked source/owner、stable freshness proof | Identity/Work owner-specific update；timestamp-only freshness fail closed |
| `PolicyContextUpdate` | external source identity、双锚、role-checked source/owner、stable freshness proof | Governance safe resolution；不复制 policy/approval body |
| `RuntimeBoundaryContextUpdate` | external source identity、双锚、Runtime boundary、entry contract、stable freshness proof | Runtime mapping source；不复制 Runtime schema/run state |
| `CapabilityContextUpdate` | external source identity、双锚、optional Tool/Binding/Method safe refs、stable freshness proof | Tool/Method safe view；不建立 registry/provider route |
| `HostRouteContextUpdate` | external source identity、双锚、host boundary、role-checked route、stable freshness proof | host boundary owner；不形成 route/topic/delivery truth |
| `RuntimeMaterialReception` | committed fact identity、双锚、reception ID、target resolution、purpose | 只接受已提交 reception；fact schema mismatch fail closed |
| `MemberCommittedFact` | committed fact identity、双锚、fact ref、purpose、ordered-unique predecessor refs | predecessor 顺序由 trace contract 明示；不得扫描任意 Store |
| `MemberProjectionUpdate` | committed fact identity、双锚、fact ref、target watermark | watermark 是 source coverage，不是 Store version/cursor |
| `CapabilityOutletSourceUpdate` | committed fact identity、双锚、resolution/gap refs、ordered-unique owner-checked safe refs | 不接受 arbitrary `Vec<TypedRef>`；未知 owner ref fail closed |

`MemberCanonicalExternalSourceIdentity.freshness_proof` 只能携带 `SourceVersion` 或 formal receipt；`SourceFreshnessEvidence::observed_at` 和 `FreshnessBasis::OwnerTimestamp` 都不进入 digest。若 external source 没有稳定 version / receipt proof，Consumer 仍可返回 waiting / blocked receipt，但不得被当作可正向完成的 canonical relation。Committed-fact source 的 identity 以已提交 `MemberCommittedFactRef` 为准，不把 local capture time、projection cursor 或 event candidate 当作 source proof。

### 11.4 Job canonical projections（5）

```rust
/// Exactly five logical operations-job projections.
pub enum MemberCanonicalJobInput {
    PublicationRelay { subject: MemberSubjectAnchor, job_invocation_ref: MemberJobInvocationRef, attempt_refs: Vec<PublicationAttemptId>, gap_refs: Vec<PublicationGapId>, continuation_cursor: Option<MemberCanonicalContinuationCursor> },
    ObservationRelay { subject: MemberSubjectAnchor, job_invocation_ref: MemberJobInvocationRef, attempt_refs: Vec<ObservationAttemptId>, gap_refs: Vec<InteractionGapId>, continuation_cursor: Option<MemberCanonicalContinuationCursor> },
    ExternalContextRefresh { subject: MemberSubjectAnchor, job_invocation_ref: MemberJobInvocationRef, source_ref: MemberCanonicalOwnerTypedRef, context_kind: ExternalContextKind, purpose: ExternalConsumerPurpose, scope: MemberCanonicalExternalContextScope, resolution_ref: Option<ExternalContextResolutionId>, refresh_request_ref: Option<ExternalRefreshRequestRef>, gap_ref: Option<ExternalContextGapId> },
    MemberProjectionRebuild { subject: MemberSubjectAnchor, job_invocation_ref: MemberJobInvocationRef, committed_fact_refs: Vec<MemberCommittedFactRef>, resolution_refs: Vec<ExternalContextResolutionId>, target_watermark: ProjectionWatermark, continuation_cursor: Option<MemberCanonicalContinuationCursor> },
    GapReconciliation { subject: MemberSubjectAnchor, job_invocation_ref: MemberJobInvocationRef, gap_refs: Vec<MemberProjectionGapRef>, successor_refs: Vec<MemberCommittedFactRef>, target_watermark: ProjectionWatermark },
}
```

| Job variant | canonical fields included | source / prohibition |
|---|---|---|
| `PublicationRelay` | 双锚、logical job invocation ref、ordered-unique attempt refs、gap refs、validated opaque continuation cursor | Outbound / continuation Store；不含 scheduler run、route、delivery result |
| `ObservationRelay` | 双锚、logical job invocation ref、ordered-unique observation attempt refs、interaction gap refs、validated cursor | InteractionTraceStore；不含 observation backend body/evidence |
| `ExternalContextRefresh` | 双锚、logical job invocation ref、role-checked source、context kind、purpose、scope、existing resolution/refresh/gap refs | existing mirror relation；不触发 generic resolver，也不把 owner timestamp纳入 |
| `MemberProjectionRebuild` | 双锚、logical job invocation ref、ordered-unique committed fact refs、resolution refs、target watermark、validated cursor | committed local source + CP06 safe resolution；不修复 CP01~06 truth |
| `GapReconciliation` | 双锚、logical job invocation ref、finite local gap refs、ordered-unique successor refs、target watermark | existing local gap/successor；不创建或关闭 source gap |

### 11.5 Digest inclusion / exclusion and channel match

| 规则 | canonical digest contract |
|---|---|
| 稳定业务字段 | 双锚、local committed IDs、owner-typed refs、safe enum/value、expected revision、source identity、stable source version/receipt、explicit purpose/scope、projection watermark、validated continuation cursor（仅适用 Job）可进入。 |
| 明确排除 | request ID、idempotency key 本身、trace ID、`MemberCorrelation`、任何 timestamp（包括 `observed_at` 与 local captured-at）、random/generated ID、raw body、secret/credential material、hidden reasoning、provider/adapter-private state、route/topic、scheduler/run/process identity、debug string。 |
| source freshness | `SourceFreshnessEvidence::observed_at` 永不进入；`FreshnessBasis::OwnerTimestamp` 不能单独证明稳定输入。只有 owner `SourceVersion` 或 formal `ResolutionReceipt` 可作为 freshness proof；缺失则 fail closed / waiting。 |
| 结构稳定性 | variant tag 和字段语义由本 enum 固定；不使用 debug、JSON、字段顺序、map iteration、route/topic 或 `TypedRef` 顺序推导。集合必须按各 typed contract 的 ordered-unique 规则形成；算法留 Step 13。 |
| channel / operation | `MemberCanonicalDigestInput::Command` 只能与 `MemberOperationContext.channel = Command` 且 operation name 精确匹配；`Consumer` 同理为 `InboundConsumer`；`Job` 同理为 `OperationsJob`。variant 与 operation/name、source family、job kind 不匹配时直接 `ContractViolation`。 |
| Query | Query 没有 `MemberCanonicalDigestInput`，不调用 `MemberDigestPort`，不 reserve，也不读取 stored result。 |

当前闭合的是字段集合、来源和 fail-closed 条件；摘要算法、字节编码、版本迁移、物理索引与 collision evidence 不在本 Step 伪造，留 Step 13 / Step 11 的后续正式门禁。

## 12. Typed stored-result / replay closure

### 12.1 Result-kind 与 channel 的有限配对

| result kind | 唯一 channel | 完整 carrier | typed Store pair |
|---|---|---|---|
| `CommandResult` | `Command` | `MemberStoredCommandValue` | `save_command_result` / `get_command_result` |
| `CommandRejection` | `Command` | `MemberCommandRejection` | `save_command_rejection` / `get_command_rejection` |
| `ConsumerReceipt` | `InboundConsumer` | `MemberConsumerReceipt` | `save_consumer_receipt` / `get_consumer_receipt` |
| `JobReport` | `OperationsJob` | `MemberJobReport` | `save_job_report` / `get_job_report` |

`MemberStoredReplay` 是有限 union；它不是新的业务 truth，也不是 shell/ref 的别名：

```rust
/// Complete stored carriers that are legal replay values.
pub enum MemberStoredReplay {
    CommandResult { result_ref: MemberOperationResultRef, value: MemberStoredCommandValue },
    CommandRejection { result_ref: MemberOperationResultRef, rejection: MemberCommandRejection },
    ConsumerReceipt { result_ref: MemberOperationResultRef, receipt: MemberConsumerReceipt },
    JobReport { result_ref: MemberOperationResultRef, report: MemberJobReport },
}
```

六个 Command / Consumer 方法与已有 Job 方法构成对称闭环：每个 `save_*` 都接收完整 contracts-owned carrier、匹配的 `StoredMemberOperationResult` shell 和 `MemberStoredResultRelationExpectation`，在 caller 的同一 logical UoW 中 stage；每个 `get_*` 都先核对 relation，再返回完整 carrier。`MemberStoredResultSurfaceRef` 只是 shell 的本地表面身份，不能单独 replay，也不能被 mapper 当作 response body、receipt 或 report。

### 12.2 Fresh path 与 duplicate path

```text
fresh non-query path
  -> validate typed entry and double anchor
  -> MemberOperationContext (channel/name exact)
  -> MemberCanonicalDigestInput + one MemberDigestPort call
  -> MemberIdempotencyStore::reserve in the logical UoW
  -> Reserved
  -> named service executes its fixed typed method
  -> assemble complete value / rejection / receipt / report carrier
  -> create matching StoredMemberOperationResult shell
  -> save_* (same UoW, relation and carrier validation)
  -> MemberIdempotencyStore::complete with the same version/UoW
  -> return typed result and exact result_ref
```

```text
matching duplicate path
  -> Duplicate { record_ref, result_kind, result_ref }
  -> read completed reservation relation (channel/name/digest)
  -> construct full MemberStoredResultRelationExpectation
  -> call only the getter matching result_kind/channel
  -> require carrier, result_ref, shell, operation, source identity and digest to match
  -> return MemberStoredReplay / protocol duplicate surface
```

Duplicate path never re-runs a named service, domain transition, body inspection, source scan, resolver, handoff, relay, refresh, projection rebuild or fake/private-map lookup. A missing getter result, wrong kind/channel, wrong pointer, wrong operation, wrong digest, wrong reservation state, or carrier-specific identity mismatch is `StoredResultUnavailable` / `ContractViolation` and fails closed; it is never reconstructed from current truth.

`Duplicate` 的 `result_ref` 必须是 reservation classification 返回的 exact pointer，不得由 result ID、surface ref、trace、route、timestamp 或 current Store state 推导。Duplicate relation 的 `record_ref`、channel、operation、digest 由同一 completed reservation 提供；getter 还必须验证 carrier-specific identity：Command 的 command name / rejection operation、Consumer 的 consumer name + source family + source identity、Job 的 job kind + invocation ref。任何缺失或错配都不能被降级成“空成功”。

### 12.3 UoW、adapter 与 fake parity

| 审查点 | 强制语义 |
|---|---|
| same-UoW ordering | fresh path 必须先在同一 UoW stage complete carrier 与 result shell，再 `complete` reservation；`Reserved` 不是结果，`complete` 不能先行。 |
| save validation | `save_*` 校验 reservation record、`result_ref`、channel、operation、request digest、result kind、shell pointer 与 carrier-specific identity；Query 不可调用。 |
| get validation | `get_*` 只接受 completed matching relation；`None` 表示没有完整 carrier，wrong relation 是 consistency error，不是 replay。 |
| shell boundary | shell / `MemberStoredResultSurfaceRef` 不是 body；不得把 shell、surface ref、result ID或错误文本映射成 typed result。 |
| fake / durable parity | fake 与未来 durable adapter 必须执行相同的 reservation、relation、UoW、missing/wrong-kind、duplicate/no-rerun 语义；fake 私有 map 不能重建 carrier或改变顺序。 |
| Query no-write | Query 不生成 digest，不 reserve，不调用任一 stored-result getter/save/complete/mark_conflict，也不触发 refresh/rebuild/reconciliation。 |

Step 8 只闭合 logical typed replay schema；物理数据库表、事务隔离、唯一索引、序列化格式和 crash recovery 仍是 `L2M-DDD-002` / Step 11~13 的开放项。

## 13. Cross-protocol audit

| 审计项 | 结论 | 证据 / 说明 |
|---|---|---|
| 协议数量 | pass | 固定为 10 Command / 16 Query / 14 Consumer（10 external + 4 committed-fact）/ 24 semantic outbound event candidate / 5 Job；本 Step 未新增或遗漏协议。 |
| 名称唯一性 | pass | §3 固定名称 enum 与 §5~§10 cards 一一对应；operation name、consumer name、job kind 不以字符串 route 替代。 |
| operation → service | pass | §5.3、§6.4、§9.2、§10.2~§10.4 为每个 operation 提供唯一 owner service 与 exact method；facade 不形成第十个 service。 |
| public DTO 二级类型 | pass | Command value/rejection、Query view/page、Consumer receipt/detail、Job report 与 canonical input 均为有限 typed union；不泄漏 repository page、UoW、Port error、generic map。 |
| selector / source map | pass | 每个 Command、Query、Consumer、Job card 都有 selector / selected-input source / 禁止推断；source identity 与双锚均有明确 owner。 |
| Query no-write | pass | Query 不 digest、不 reserve、不读写 stored-result、不 refresh/rebuild/reconcile；`CurrentRequired` 只改变 visibility surface。 |
| typed replay symmetry | pass | 四种 result-kind/channel 配对均有对称 save/get；fresh same-UoW 与 duplicate exact-pointer path 均已闭合；missing/wrong relation fail closed。 |
| Event 状态 | pass_with_upstream_blockers | 24 个 event 仍仅为 semantic candidate；`L2M-UP-005` 关闭前不定义 envelope/payload/source/subject/route/topic/publisher/outbox/delivery。 |
| compile/runtime/event/ref/adapter/fake 分类 | pass | `core-contracts` 是唯一 planned compile candidate；host/Runtime/Bus/Governance/Tools/Method/Conversation/Observation/member-service/member-images 是 runtime/event/ref/adapter seams；fake 仅验证 parity，不是 package dependency。 |
| 历史污染审计 | pass | 旧 README 的 CloudEvents、AG-UI、UDS、launch token、固定端口和时延数字未继承；CloudEvents/W3C 仅待 Core authority，member-specific carrier/route 仍 blocked。 |
| ownership 越界 | pass | 不拥有 Runtime loop/context/plan/outcome、LLM 推理、memory、checkpoint、tool execution、capability registry、外部 MCP/A2A/API adapter、container lifecycle、image build、sandbox isolation truth、governance approval truth、conversation truth 或 observability backend。 |

综合结论：协议逻辑 schema、typed service/facade callable surface、canonical 字段来源和 replay discipline 已完成；exact external carrier/route、物理 persistence 与正向 integration 仍受 §14 blocker 约束，因此本 Step 只能标记 `completed / pass_with_upstream_blockers / stop_review`。

## 14. Blocker / non-fabrication audit

### 14.1 上游与详细设计 blocker（全部保持 open）

| blocker | 未闭合边界 | 本 Step 的保守处理 | 阻塞范围 |
|---|---|---|---|
| `L2M-UP-001` | host registration / IPC / credential / health / session 边界（`L2-member-service`） | 只保留 host material / attempt / feedback ref 与 blocked status；不选择 transport 或 health truth | exact host activation、IPC schema、凭据联调、正向 evidence |
| `L2M-UP-002` | image release / manifest / pinned entry / compatibility / handoff（`L2-member-images`） | 只使用 pinned release / entry 的 typed ref 槽位；不声明 image truth、manifest 或 readiness | image handoff、compatibility proof、宿主装配、readiness |
| `L2M-UP-003` | Runtime entry mapping（`L2-runtime` `Q-L2R-001` / `L2R-ENTRY-001`） | Runtime boundary / entry contract 仅作为 ref；mapping 未闭时返回 blocked | member→Runtime exact trigger、正向投递、联调 evidence |
| `L2M-UP-004` | Runtime handoff / source family（`L2-runtime` `L2R-UP-002/006`） | 出站只保留 attempt / gap / safe material refs；不声称 delivered / observed | Runtime handoff、source carrier、正向 outcome |
| `L2M-UP-005` | member-specific event carrier / payload / source / subject / route | 24 event 仅 semantic candidates；不定义 envelope、topic、publisher、outbox 或 delivery success | exact event activation、Bus route、event integration |
| `L2M-UP-006` | credential verification / identity anchor（Identity + member-service） | `CredentialRef` / `GlobalMemberRef` 只作为 typed ref；校验失败 fail closed | startup admission、presence 正向建立、credential evidence |
| `L2M-UP-007` | screening taxonomy / rule source（Policy effective + safety taxonomy） | 只消费 safe category / formal decision；unknown 进入 blocked / waiting，不建本地 allowlist | screening exact rule、正向 intake、policy evidence |
| `L2M-UP-008` | 第三执行主语未定义（ADR-0004 / L1-work / member-service） | 所有正向操作严格使用 `ProjectMemberRef + GlobalMemberRef`；其它主语拒绝 | non-project/personal member activation、跨主语联调 |
| `L2M-DDD-001` | 实现仓 / crate owner 未确定 | 仅记录 planned `core-contracts` compile candidate；不创建 implementation repo 或 manifest | 代码落地、compile evidence、package dependency |
| `L2M-DDD-002` | 物理 persistence / UoW / transaction 未确定 | 只闭合 logical same-UoW / typed save-get contract；不声称 DB、索引、隔离或 durability | physical schema、事务测试、crash/recovery evidence |

这些 blocker 阻塞 exact external/physical activation、正向 integration 和证据链，不阻塞本 Step 已完成的 blocked-aware logical typed schema。任何 blocker 的关闭都必须由其 owner 的正式材料或后续授权步骤提供，不能由本仓推测或以 fake 结果替代。

### 14.2 Non-fabrication checklist

本 Step 没有创建实现代码、实现仓、Cargo manifest、adapter、Bus topic、IPC endpoint、container/image artifact、scheduler run、test run、report、artifact、evidence、verdict、signoff、readiness 或 commit。所有 `pass` 仅表示 calibration 文档内的逻辑约束已写清；`pass_with_upstream_blockers` 不表示外部依赖已联通。

## 15. Step 8 gate / stop-review

| gate 项 | 当前值 |
|---|---|
| `current_document` | `03-详细设计.md` |
| `current_step` | `Step_08_protocol_contracts_completed` |
| `step_08_status` | `completed / pass_with_upstream_blockers / stop_review` |
| `formal_03_write_allowed` | `false` |
| `step_09_file_allowed` | `false_until_new_explicit_user_confirmation` |
| `implementation_repo_write_allowed` | `false` |
| `commit_required` | `false` |

Step 8 已完成：10 Command、16 Query、14 Consumer、24 blocked semantic event candidates、5 Operations Job 的 typed contract，canonical digest 字段闭合，四类 stored-result/replay 对称关系、facade / nine named service callable surface、selector/source map 与 cross-protocol / blocker audit 均已写入本校准材料。当前立即停审，不创建 Step 9，不读取或写入 Step 9 文件，也不修改正式 `03-详细设计.md`。只有在用户再次明确确认后，才可读取 Step 9 对应 SOP / 书写规范并创建 `03_ddd_step_09_function_flows.md`。
