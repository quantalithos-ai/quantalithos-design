# Step 8. 定义 API / Command / Query / Event / Job 协议契约

### 1. Step 状态

- 状态:[x] 已确认
- 对应 SOP:`standards/document/详细设计讨论流程_SOP.md` Step 8
- 回填章节:`03-详细设计.md` §7 API / Command / Query / Event / Job 协议契约 / §6 全局对象与 API 索引

### 2. 本步输入

| 输入 | 内容 | 本步使用方式 |
|---|---|---|
| `03_ddd_step_05_module_contracts.md` | 模块主轴和依赖方向 | 固定 DTO / event / job 归属 `contracts`,handler 归属 entry module |
| `03_ddd_step_06_object_contracts.md` | shared ref / state、domain object、view DTO 归属 | 确认协议字段能构造或影响目标对象 |
| `03_ddd_step_07_trait_port_adapter_contracts.md` | repository / resolver / publisher / handoff port | 确认 lookup、derive、page、outbox、handoff 的来源 |
| `02_hld_step_07_api_interface_skeleton.md` | Command / Query / Consumer / Event / Job 骨架 | 作为协议入口清单 |
| `02_hld_step_08_processing_flows.md` | 概要处理流 | 判断每个协议是否需要 Step 9 函数级 flow |
| `02_hld_step_10_exceptions_boundaries.md` | 异常与边界场景 | 形成错误映射和缺失处理口径 |
| `core-contracts` 本地契约 | `ActorContext`、`CommandMetadata`、`QueryMetadata`、`PageRequest`、`PageToken`、`Version` 等 | 避免重复承载 metadata / page / actor |

### 3. 分批写入记录

本 Step 按 `设计文档讨论中间产物规范.md` §3.4 分批写入:

| 批次 | 内容 | 状态 |
|---|---|---|
| 8.1 | 文件骨架、SOP 问题回答、共享 envelope / result / page / marker schema、协议总表 | [x] |
| 8.2 | Command DTO / result / route / 字段闭环 | [x] |
| 8.3 | Query request / response view / page / degraded surface | [x] |
| 8.4 | Inbound Event / Outbound Event schema、topic、版本策略 | [x] |
| 8.5 | Operations Job input / output / idempotency、错误映射、闭环表和回填草稿 | [x] |

### 4. SOP 问题回答

1. 本轮需要定义哪些 API / Command / Query / Event / Job?

   回答:本轮定义 18 个 Command、8 个 Query、7 个 Inbound Event Consumer、10 个 Outbound Event、6 个 Operations Job。协议清单来自概要 Step 7,不新增额外业务入口。

2. 每个协议的调用方、处理方、传输方式是什么?

   回答:Command / Query 使用同步 HTTP-style entry route 作为外部入口名,由 `api` handler 调 application service;Inbound Event 使用 logical topic,由 `worker` consumer 调 application consumer service;Outbound Event 由 outbox publisher 通过 logical topic 发布;Operations Job 使用 `jobs` runner 或 operations HTTP-style trigger 调 application job service。

3. 外部接口使用 HTTP、RPC、event bus 还是其他方式?

   回答:本 Step 固定逻辑传输面:同步入口写作 HTTP route,事件写作 logical event topic,job 写作 operations trigger。具体 Web framework、bus 产品、consumer group、重试参数留给 Step 14 / Step 15 / 实施计划。

4. 请求、响应、事件或 job 输入输出 schema 是什么?

   回答:本文件 §7~§11 给出 Rust DTO 或 event schema。所有 DTO 归属 `contracts`;handler / service 不在 DTO 内。

5. 每个输入契约会构造或影响哪些 Domain 对象?

   回答:每个协议小节均有“字段闭环 / 目标对象”表;§13 给出汇总闭环。

6. 目标对象的必填字段是否全部能从输入、派生、查表或系统生成中获得?

   回答:是。凡 domain 字段不在请求中出现,本文件明确为 `IdGeneratorPort`、`ClockPort`、repository lookup、resolver lookup、metadata、或 domain factory 派生。缺失时按 reject / lookup failed / retry / dead-letter 处理。

7. 哪些字段名相近但语义不同,不得混同?

   回答:`ProjectRef` != `ProjectOwnerRef`;`ProjectMemberRef` != `GlobalMemberRef`;`FormalWorkRef` != `SourceWorkRef`;`ExternalEvidenceRef` != `SourceWorkRef`;`WorkOutboxId` != event id;`WorkTruthCursor` != `Version`;`Page<T>` repository helper != public page DTO。§6.4 给出完整清单。

8. 字段缺失时是 reject、derive、lookup、retry、dead-letter 还是暂停处理?

   回答:同步 Command / Query 缺必填字段直接 reject;写路径缺 idempotency key reject;外部 reference lookup 失败返回 unresolved / rejected;Inbound Event 缺 envelope / event id 进入 dead-letter,缺可解析业务 ref 进入 unresolved / retry;Job 缺 idempotency key reject。

9. Query 的 response view、page、projection marker 是否有字段级 schema?

   回答:§9 明确 `PublicPageInfo`、`ProjectionViewMarker` 和所有 query response view 字段。Query 不只返回 projection 名或 builder 名。

10. Query 的 empty、not visible、stale、failed、rebuilding、disabled、missing state 对外 surface 是什么?

   回答:Query 使用 `WorkQueryResponse<T>` 包装 response surface。`surface` 可为 `Visible`、`Empty`、`NotVisible`、`Stale`、`Rebuilding`、`Failed`、`Missing`。其中 `NotVisible` 不返回业务明细。

11. Query response 中 read model / projection / cursor 的 id/ref 如何生成,repository key 是什么?

   回答:Project board key = `ProjectRef`;member work key = `ProjectMemberRef`;iteration summary key = `IterationRef`;search key = `ProjectRef + criteria + page`;trace key = `WorkTraceSubjectRef`。`DerivedWorkViewRef` 由 query scope 稳定派生,具体派生公式见 §9.2。

12. Query response 字段引用的 enum / ref 是否归属到 contracts shared,或是否写明 domain 到 view 的正式映射?

   回答:全部 public view 字段使用 `contracts/refs.rs` shared ref / enum 或本 Step 定义的 `contracts/views.rs` DTO。不会引用 domain-only enum。

13. Query / repository 使用的 page helper 是否有 schema、归属和 public page DTO 映射?

   回答:Step 7 已定义 application `Page<T>` / `PageInfo`;本 Step §9.1 定义 public `PublicPageInfo`,映射为 `PageInfo.next_page_token -> PublicPageInfo.next_page_token`、`PageInfo.has_more -> PublicPageInfo.has_more`。

14. HLD `*Query`、DDD `*Request`、Rust DTO 名称是否存在收敛映射?

   回答:本 Step 统一 Rust DTO 命名为 `*Request`;概要层 `*Query` 名称作为 protocol operation name 保留。例如 `GetProjectBoardView` 操作使用 `GetProjectBoardViewRequest` DTO。

15. 每个协议失败时映射成什么错误?

   回答:§12 给出 `WorkProtocolError` 映射表;Step 12 继续细化错误恢复。

16. 哪些协议需要幂等键或审计记录?

   回答:所有 Command、Inbound Event Consumer、Operations Job 需要 idempotency / dedup;所有核心 truth 写 Command 和会写本地 snapshot / outbox / handoff 的 Job 需要审计或 trace 记录。Query 不需要 idempotency key。

### 5. 当前文档问题诊断

| 位置 | 当前问题 | 本步处理 |
|---|---|---|
| HLD Step 7 | 只有输入骨架,无字段级 DTO schema | 本 Step 为每个 Command / Query / Event / Job 定义 Rust DTO / schema |
| Step 6 `ProjectSpec`、`FormalWorkIntent` 等 | 只作为 factory 输入出现 | 本 Step 补 contracts DTO 字段,并说明目标 domain 字段来源 |
| Step 7 `Page<T>` | 是 application repository helper,非 public DTO | 本 Step 补 `PublicPageInfo` 和映射 |
| projection views | HLD 只写 view 名和 stale 语义 | 本 Step 补 query view 字段、repository key、empty / degraded surface |
| event / outbox | HLD 只写事件骨架 | 本 Step 补 logical topic、schema 和 version strategy |
| metadata | HLD 要 context,core 已有 metadata | 本 Step 统一收口到 core `ActorContext`、`CommandMetadata`、`QueryMetadata`,不重复顶层 idempotency / trace |

### 6. 共享协议约束

#### 6.1 归属与文件

| 契约类别 | Rust 文件 | 说明 |
|---|---|---|
| shared ref / enum / reason / target | `crates/contracts/src/refs.rs` | Step 6 已定义主轴;本 Step 补协议需要的 DTO wrapper |
| Command request / result | `crates/contracts/src/commands.rs` | 写入口 DTO 和 result schema |
| Query request / response / view | `crates/contracts/src/queries.rs`、`crates/contracts/src/views.rs` | 读入口 DTO、page、projection marker 和 public view |
| Inbound / Outbound Event | `crates/contracts/src/events.rs` | event payload DTO 和版本策略 |
| Operations Job | `crates/contracts/src/jobs.rs` | job input / output / report DTO |
| protocol error | `crates/contracts/src/errors.rs` | API / event / job 对外错误 surface |

#### 6.2 metadata 与 envelope

Command / Query 不再额外定义顶层 `idempotency_key`、`trace_ref`、`page` 或 `consistency` 字段。

```rust
/// Event schema version used by Work inbound and outbound event envelopes.
pub struct EventSchemaVersion(pub String);
```

| 字段 / helper | 类型 | 来源 | validation / 处理 |
|---|---|---|---|
| `EventSchemaVersion.0` | `String` | event envelope / contracts fixture | 必填;P0 唯一支持值为 `v1`;格式为 `v<major>` 且 major 必须与 topic suffix 对齐 |
| `EventSchemaVersion::v1()` | `EventSchemaVersion` | `crates/contracts/src/events.rs` 常量 / helper | outbound builder 和 fixtures 必须使用该 helper,不得写裸字符串 |
| inbound parse | `EventSchemaVersion` | worker handler 读取 envelope | missing、parse failure、非 `v1`、或与 topic suffix major version 不一致 -> `ConsumerDisposition::DeadLetter`;不写 Work truth / snapshot / trace / outbox |

```rust
/// A synchronous Work command envelope.
pub struct WorkCommandEnvelope<T> {
    /// Effective actor and entrypoint context.
    pub actor: ActorContext,
    /// Core command metadata; request.idempotency_key must be Some.
    pub metadata: CommandMetadata,
    /// Operation-specific command body.
    pub command: T,
}

/// A synchronous Work query envelope.
pub struct WorkQueryEnvelope<T> {
    /// Effective actor and entrypoint context.
    pub actor: ActorContext,
    /// Core query metadata; pagination and consistency live here.
    pub metadata: QueryMetadata,
    /// Operation-specific query body.
    pub query: T,
}

/// Metadata carried by inbound events before operation-specific payload.
pub struct WorkInboundEventEnvelope<T> {
    /// Source-owned event id used for deduplication.
    pub source_event_id: SourceEventId,
    /// Source system or bounded context that emitted the event.
    pub source_ref: ExternalSourceRef,
    /// Event schema version.
    pub event_version: EventSchemaVersion,
    /// Core trace and request pointer.
    pub trace_context_ref: WorkTraceContextRef,
    /// Event occurrence timestamp.
    pub occurred_at: Timestamp,
    /// Operation-specific event payload.
    pub payload: T,
}
```

| Envelope | metadata 字段来源 | 幂等 / dedup | 缺失处理 |
|---|---|---|---|
| `WorkCommandEnvelope<T>` | core `ActorContext` + `CommandMetadata` | `metadata.request.idempotency_key` 必须为 `Some` | 缺 actor / metadata / key -> reject |
| `WorkQueryEnvelope<T>` | core `ActorContext` + `QueryMetadata` | 不要求 idempotency key | 缺 actor / metadata -> reject |
| `WorkInboundEventEnvelope<T>` | event source envelope,`event_version` 按 `EventSchemaVersion` schema 解析 | `source_event_id` + topic + source ref 作为 dedup key | 缺 envelope / event id / event_version、unsupported version -> dead-letter |

Query authorization 不从 query DTO 携带额外权限字段。`ActorContext` 只提供可信主体上下文;`AuthorizedWorkQueryService` 必须通过 `ActorMemberResolverPort.resolve_actor_member(actor)` 得到 `QueryActorMemberRef.member_ref: GlobalMemberRef`,再用 `ProjectMemberRepository.get_by_member(project_ref, member_ref)` 判断 Work-owned ProjectMember responsibility。`Active` / `Paused` 可读,`Proposed` / `Released`、actor-member not found / rejected、scope unresolved 均返回 `QuerySurface::NotVisible` 且 `data = None`;actor-member resolver temporary unavailable 映射 `TemporarilyUnavailable`。P0 不允许使用 `role_refs`、`ActorKind::System`、`ActorKind::Integration` 或 `ProjectOwnerRef` 绕过该 membership 规则。

#### 6.3 command result / receipt

```rust
/// Public receipt returned by Work write operations.
pub struct WorkCommandReceipt {
    /// Stable application result reference used by idempotency.
    pub result_ref: ApplicationResultRef,
    /// Idempotency outcome for this request.
    pub idempotency: IdempotencyResultView,
    /// Trace record created or reused by the operation.
    pub trace_ref: Option<WorkTraceId>,
    /// Outbox records enqueued by the operation.
    pub outbox_record_refs: Vec<WorkOutboxId>,
    /// Version of the primary changed record after commit.
    pub applied_version: Option<Version>,
}

/// Idempotency result visible to command and job callers.
pub enum IdempotencyResultView {
    /// The request executed and produced a new result.
    Applied,
    /// The same request digest returned a previously completed result.
    Duplicate,
}
```

| 字段 | 类型 | 来源 | 约束 |
|---|---|---|---|
| `result_ref` | `ApplicationResultRef` | application service / idempotency complete | duplicate 必须复用原 result ref |
| `idempotency` | `IdempotencyResultView` | `IdempotencyReservation` | conflict 不返回 result,映射 error |
| `trace_ref` | `Option<WorkTraceId>` | `AuditRepository.append_trace` | 核心 truth 写成功必须有 trace |
| `outbox_record_refs` | `Vec<WorkOutboxId>` | `WorkOutboxRepository.enqueue` | Query 不产生 |
| `applied_version` | `Option<Version>` | primary repository save / create | 多对象变更时代表主对象版本 |

`ApplicationResultRef` 必须指向 `CommandResultRepository` 中同 UoW 保存的 command result surface。success path 保存的 receipt 使用 `IdempotencyResultView::Applied`;duplicate replay 读取该 stored result 后只把返回给调用方的 receipt `idempotency` overlay 为 `Duplicate`,不得改变 `result_ref`、primary ref、state、`trace_ref`、`outbox_record_refs` 或 `applied_version`。若 `ApplicationResultRef` 无法读回对应 result surface,handler 映射 `ApplicationError::DuplicateResultMissing` 为 `WorkProtocolError::TemporarilyUnavailable`。

#### 6.4 page / projection / query response surface

```rust
/// Public page metadata returned by Work query DTOs.
pub struct PublicPageInfo {
    /// Token to request the next page.
    pub next_page_token: Option<PageToken>,
    /// Whether more items may exist.
    pub has_more: bool,
}

/// Public marker describing projection freshness.
pub struct ProjectionViewMarker {
    /// Stable derived view reference.
    pub view_ref: DerivedWorkViewRef,
    /// Source cursor covered by this view.
    pub source_cursor: WorkTruthCursor,
    /// Current freshness state.
    pub freshness_state: DerivedFreshnessState,
}

/// Public query response wrapper.
pub struct WorkQueryResponse<T> {
    /// Visibility and degradation surface for this response.
    pub surface: QuerySurface,
    /// Optional payload; absent for NotVisible and Missing.
    pub data: Option<T>,
}

/// Query response surface.
pub enum QuerySurface {
    /// The requested data is visible and usable.
    Visible,
    /// The requested scope exists but has no data.
    Empty,
    /// The caller cannot see the requested scope.
    NotVisible,
    /// The response includes stale projection data.
    Stale,
    /// The projection is rebuilding and data may be absent.
    Rebuilding,
    /// The projection or reference failed and data is degraded.
    Failed,
    /// The requested resource is missing.
    Missing,
}
```

| application helper | public DTO | 映射 |
|---|---|---|
| `Page<T>.items` | response `items` / `*_items` | 原样映射为 public view item |
| `PageInfo.next_page_token` | `PublicPageInfo.next_page_token` | 原样映射 |
| `PageInfo.has_more` | `PublicPageInfo.has_more` | 原样映射 |
| `DerivedWorkViewState.view_ref` | `ProjectionViewMarker.view_ref` | 原样映射 |
| `DerivedWorkViewState.source_cursor` | `ProjectionViewMarker.source_cursor` | 原样映射 |
| `DerivedWorkViewState.freshness_state` | `ProjectionViewMarker.freshness_state` | 原样映射 |

#### 6.5 不得混同的相近字段

| 字段 A | 字段 B | 不得混同原因 | 缺失 / 错用处理 |
|---|---|---|---|
| `ProjectRef` | `ProjectOwnerRef` | Work-owned project identity vs external owner pointer | reject |
| `ProjectMemberRef` | `GlobalMemberRef` | project-local responsibility vs identity member | reject / lookup |
| `FormalWorkRef` | `SourceWorkRef` | admitted Work truth vs external source reference | reject |
| `ExternalEvidenceRef` | `SourceWorkRef` | completion / blocker evidence vs formalization source | reject |
| `WorkOutboxId` | `source_event_id` | Work outbox record identity vs upstream event id | reject / dead-letter |
| `WorkTruthCursor` | `Version` | projection source cursor vs optimistic aggregate version | reject invalid mapping |
| `Page<T>` | public page DTO | repository helper vs external response schema | map via `PublicPageInfo` |
| `CommandMetadata.request.idempotency_key` | inbound `source_event_id` | command idempotency vs event dedup identity | reject / dead-letter |

### 7. 协议总表

| 名称 | 类别 | 调用方 / 发布方 | 处理方 / 订阅方 | 传输方式 | 是否需要 Step 9 处理流 |
|---|---|---|---|---|---|
| `CreateProject` | Command | SDK / workspace / operator | `api::WorkCommandHandlers` -> `ProjectCommandService` | `POST /work/v1/projects` | 是 |
| `UpdateProjectLifecycle` | Command | SDK / workspace / operator | `api` -> `ProjectCommandService` | `PATCH /work/v1/projects/{project_id}/lifecycle` | 是 |
| `UpdateBacklogAvailability` | Command | operator / maintenance | `api` -> `WorkItemCommandService` | `PATCH /work/v1/backlogs/{backlog_id}/availability` | 是 |
| `AssignProjectMember` | Command | SDK / workspace / operator | `api` -> `ProjectMemberCommandService` | `POST /work/v1/projects/{project_id}/members` | 是 |
| `UpdateProjectMemberResponsibility` | Command | SDK / workspace / operator | `api` -> `ProjectMemberCommandService` | `PATCH /work/v1/project-members/{project_member_id}/responsibility` | 是 |
| `CreateWorkItem` | Command | SDK / workspace / promote review | `api` -> `WorkItemCommandService` | `POST /work/v1/projects/{project_id}/work-items` | 是 |
| `CreateChildWorkItem` | Command | SDK / workspace / promote review | `api` -> `WorkItemCommandService` | `POST /work/v1/formal-work/{work_item_id}/children` | 是 |
| `UpdateWorkItemLifecycle` | Command | SDK / workspace / operator | `api` -> `WorkItemCommandService` | `PATCH /work/v1/formal-work/lifecycle` | 是 |
| `RequestWorkPromotion` | Command | SDK / runtime / conversation bridge | `api` -> `PromoteCommandService` | `POST /work/v1/promotions` | 是 |
| `ReviewWorkPromotion` | Command | reviewer / governance bridge | `api` -> `PromoteCommandService` | `PATCH /work/v1/promotions/{promote_result_id}/review` | 是 |
| `LinkWorkDependency` | Command | SDK / workspace / operator | `api` -> `DependencyBlockerService` | `POST /work/v1/dependencies` | 是 |
| `UpdateWorkDependencyState` | Command | SDK / workspace / operator | `api` -> `DependencyBlockerService` | `PATCH /work/v1/dependencies/{dependency_id}` | 是 |
| `OpenWorkBlocker` | Command | SDK / workspace / governance bridge | `api` -> `DependencyBlockerService` | `POST /work/v1/blockers` | 是 |
| `ResolveWorkBlocker` | Command | SDK / workspace / artifact bridge | `api` -> `DependencyBlockerService` | `PATCH /work/v1/blockers/{blocker_id}/resolve` | 是 |
| `OpenIteration` | Command | SDK / workspace / process bridge | `api` -> `IterationCommandService` | `POST /work/v1/projects/{project_id}/iterations` | 是 |
| `CommitIterationScope` | Command | SDK / workspace / process bridge | `api` -> `IterationCommandService` | `POST /work/v1/iterations/{iteration_id}/commitments` | 是 |
| `UpdateIterationCommitment` | Command | SDK / workspace / operator | `api` -> `IterationCommandService` | `PATCH /work/v1/iterations/{iteration_id}/commitments` | 是 |
| `UpdateIterationLifecycle` | Command | SDK / workspace / process bridge | `api` -> `IterationCommandService` | `PATCH /work/v1/iterations/{iteration_id}/lifecycle` | 是 |
| `GetProjectWorkFacts` | Query | SDK / workspace / archive | `api::WorkQueryHandlers` -> `AuthorizedWorkQueryService` | `GET /work/v1/projects/{project_id}/facts` | 是 |
| `GetBacklog` | Query | SDK / workspace | `api` -> `AuthorizedWorkQueryService` | `GET /work/v1/projects/{project_id}/backlog` | 是 |
| `GetWorkItem` | Query | SDK / workspace / archive | `api` -> `AuthorizedWorkQueryService` | `GET /work/v1/formal-work/{formal_work_ref}` | 是 |
| `ListMemberWork` | Query | SDK / workspace / member-service | `api` -> `AuthorizedWorkQueryService` | `GET /work/v1/project-members/{project_member_id}/work` | 是 |
| `GetIterationSummary` | Query | SDK / workspace / process | `api` -> `AuthorizedWorkQueryService` | `GET /work/v1/iterations/{iteration_id}/summary` | 是 |
| `SearchWork` | Query | SDK / workspace | `api` -> `AuthorizedWorkQueryService` | `POST /work/v1/projects/{project_id}/search` | 是 |
| `GetWorkTrace` | Query | SDK / archive / observability bridge | `api` -> `AuthorizedWorkQueryService` | `GET /work/v1/traces/{subject_ref}` | 是 |
| `GetProjectBoardView` | Query | SDK / workspace | `api` -> `AuthorizedWorkQueryService` | `GET /work/v1/projects/{project_id}/board` | 是 |
| `ConsumeIdentityMemberChanged` | Inbound Event | `L1-identity` | `worker::WorkInboundConsumers` | topic `identity.member.changed.v1` | 是 |
| `ConsumeMethodDefinitionChanged` | Inbound Event | `L3-method-library` | `worker::WorkInboundConsumers` | topic `method.definition.changed.v1` | 是 |
| `ConsumeConversationWorkContextChanged` | Inbound Event | `L1-conversation` | `worker::WorkInboundConsumers` | topic `conversation.work_context.changed.v1` | 是 |
| `ConsumeProcessTimingChanged` | Inbound Event | `L1-process` | `worker::WorkInboundConsumers` | topic `process.timing.changed.v1` | 是 |
| `ConsumeGovernanceDecisionChanged` | Inbound Event | `L1-governance` | `worker::WorkInboundConsumers` | topic `governance.decision.changed.v1` | 是 |
| `ConsumeArtifactEvidenceChanged` | Inbound Event | `L1-artifact` | `worker::WorkInboundConsumers` | topic `artifact.evidence.changed.v1` | 是 |
| `ConsumeRuntimePromoteRequested` | Inbound Event | `L2-runtime` | `worker::WorkInboundConsumers` | topic `runtime.work_promote.requested.v1` | 是 |
| `ProjectChanged` | Outbound Event | `WorkOutboxPublisher` | SDK / workspace / process / archive | topic `work.project.changed.v1` | 是 |
| `BacklogChanged` | Outbound Event | `WorkOutboxPublisher` | SDK / workspace / process / archive | topic `work.backlog.changed.v1` | 是 |
| `ProjectMemberChanged` | Outbound Event | `WorkOutboxPublisher` | member-service / runtime / workspace | topic `work.project_member.changed.v1` | 是 |
| `WorkItemChanged` | Outbound Event | `WorkOutboxPublisher` | process / governance / artifact / workspace | topic `work.formal_work.changed.v1` | 是 |
| `PromoteResultRecorded` | Outbound Event | `WorkOutboxPublisher` | runtime / conversation / artifact | topic `work.promote_result.recorded.v1` | 是 |
| `WorkDependencyChanged` | Outbound Event | `WorkOutboxPublisher` | workspace / process / governance | topic `work.dependency.changed.v1` | 是 |
| `WorkBlockerChanged` | Outbound Event | `WorkOutboxPublisher` | workspace / governance / artifact | topic `work.blocker.changed.v1` | 是 |
| `IterationChanged` | Outbound Event | `WorkOutboxPublisher` | process / workspace / runtime | topic `work.iteration.changed.v1` | 是 |
| `WorkTraceAvailable` | Outbound Event | `WorkOutboxPublisher` | observability / archive | topic `work.trace.available.v1` | 是 |
| `DerivedWorkViewChanged` | Outbound Event | `WorkOutboxPublisher` | workspace / SDK | topic `work.derived_view.changed.v1` | 是 |
| `PublishWorkOutbox` | Operations Job | worker / operator | `jobs::WorkOperationsJobRunner` -> `outbox_service` | trigger `work.jobs.publish_outbox` | 是 |
| `RebuildWorkProjections` | Operations Job | operator / scheduled job | `jobs` -> `WorkDerivedMaintenanceService` | trigger `work.jobs.rebuild_projections` | 是 |
| `RefreshExternalReferenceSnapshots` | Operations Job | operator / scheduled job | `jobs` -> reference refresh service | trigger `work.jobs.refresh_references` | 是 |
| `RunWorkReconciliation` | Operations Job | operator / scheduled job | `jobs` -> reconciliation service | trigger `work.jobs.reconcile` | 是 |
| `PrepareWorkTraceHandoff` | Operations Job | operator / scheduled job | `jobs` -> trace service | trigger `work.jobs.prepare_trace_handoff` | 是 |
| `PrepareArchiveHandoff` | Operations Job | operator / scheduled job | `jobs` -> archive service | trigger `work.jobs.prepare_archive_handoff` | 是 |

### 8. Command 协议契约

#### 8.1 Command DTO 共享值对象

```rust
/// Human-readable title for formal Work public views.
pub struct WorkTitle(pub String);

/// Describes a project to be created by Work.
pub struct ProjectSpec {
    /// External owner pointer for the project.
    pub owner_ref: ProjectOwnerRef,
    /// Optional external source summary ref for audit.
    pub source_ref: Option<SourceWorkRef>,
}

/// Describes a project-local member responsibility.
pub struct ProjectResponsibilitySpec {
    /// Responsibility kind expected in the project.
    pub responsibility_kind: ProjectResponsibilityKind,
    /// Method or capability references required by the responsibility.
    pub required_capability_refs: CapabilityRefSet,
}

/// Describes a formal collaborative work intent.
pub struct FormalWorkIntent {
    /// Human-readable title for public Work views.
    pub title: WorkTitle,
    /// Stable method definition reference used to classify the work.
    pub method_definition_ref: Option<MethodDefinitionRef>,
    /// Intended assignee inside the project.
    pub assignee_ref: ProjectMemberRef,
    /// Optional parent formal work for split candidates.
    pub parent_ref: Option<FormalWorkRef>,
}

/// Describes changes to an iteration commitment.
pub struct IterationCommitmentChangeSet {
    /// Formal work refs to add to the commitment.
    pub add_work_refs: Vec<FormalWorkRef>,
    /// Formal work refs to remove from the commitment.
    pub remove_work_refs: Vec<FormalWorkRef>,
}
```

| DTO | 字段 | 类型 | 作用 | 缺失处理 |
|---|---|---|---|---|
| `WorkTitle` | string | `FormalWorkIntent.title` | public view 标题 | trim 后 1..=160 UTF-8 chars;含换行或空白后为空 reject |
| `ProjectSpec` | `owner_ref` | `ProjectOwnerRef` | 构造 `Project.owner_ref` | reject |
| `ProjectSpec` | `source_ref` | `Option<SourceWorkRef>` | audit / trace 来源 | 缺失允许 |
| `ProjectResponsibilitySpec` | `responsibility_kind` | `ProjectResponsibilityKind` | policy 判断承担类型 | reject |
| `ProjectResponsibilitySpec` | `required_capability_refs` | `CapabilityRefSet` | `MemberCapabilitySnapshot.supports(...)` | 空集合按 policy 判断 |
| `FormalWorkIntent` | `title` | `WorkTitle` | public view 标题 | reject |
| `FormalWorkIntent` | `method_definition_ref` | `Option<MethodDefinitionRef>` | method snapshot lookup | 缺失允许但不能要求 method policy |
| `FormalWorkIntent` | `assignee_ref` | `ProjectMemberRef` | `WorkItem.assignee_ref` | reject / lookup failed |
| `FormalWorkIntent` | `parent_ref` | `Option<FormalWorkRef>` | child / promote parent hint | root work 缺失允许 |
| `IterationCommitmentChangeSet` | `add_work_refs` / `remove_work_refs` | `Vec<FormalWorkRef>` | commitment 变更 | 两者都空 reject |

#### 8.2 Command result schema

```rust
/// Result returned by project commands.
pub struct ProjectCommandResult {
    /// Changed project reference.
    pub project_ref: ProjectRef,
    /// Current project lifecycle state.
    pub lifecycle_state: ProjectLifecycleState,
    /// Shared write receipt.
    pub receipt: WorkCommandReceipt,
}

/// Result returned by backlog commands.
pub struct BacklogCommandResult {
    /// Changed backlog reference.
    pub backlog_ref: BacklogRef,
    /// Current backlog state.
    pub backlog_state: BacklogState,
    /// Shared write receipt.
    pub receipt: WorkCommandReceipt,
}

/// Result returned by project member commands.
pub struct ProjectMemberCommandResult {
    /// Changed project member reference.
    pub project_member_ref: ProjectMemberRef,
    /// Current responsibility state.
    pub responsibility_state: ProjectMemberResponsibilityState,
    /// Shared write receipt.
    pub receipt: WorkCommandReceipt,
}

/// Result returned by formal work commands.
pub struct WorkItemCommandResult {
    /// Changed formal work reference.
    pub work_ref: FormalWorkRef,
    /// Current formal work lifecycle state.
    pub work_state: WorkItemState,
    /// Shared write receipt.
    pub receipt: WorkCommandReceipt,
}

/// Result returned by promote commands.
pub struct PromoteCommandResult {
    /// Promote result reference.
    pub promote_result_ref: PromoteResultRef,
    /// Current promote state.
    pub result_state: PromoteResultState,
    /// Formal work created by accepted promotion.
    pub created_work_ref: Option<FormalWorkRef>,
    /// Shared write receipt.
    pub receipt: WorkCommandReceipt,
}

/// Result returned by dependency commands.
pub struct DependencyCommandResult {
    /// Changed dependency reference.
    pub dependency_ref: WorkDependencyRef,
    /// Current dependency state.
    pub dependency_state: DependencyState,
    /// Shared write receipt.
    pub receipt: WorkCommandReceipt,
}

/// Result returned by blocker commands.
pub struct BlockerCommandResult {
    /// Changed blocker reference.
    pub blocker_ref: WorkBlockerRef,
    /// Current blocker state.
    pub blocker_state: BlockerState,
    /// Shared write receipt.
    pub receipt: WorkCommandReceipt,
}

/// Result returned by iteration commands.
pub struct IterationCommandResult {
    /// Changed iteration reference.
    pub iteration_ref: IterationRef,
    /// Current iteration state.
    pub iteration_state: IterationState,
    /// Current commitment state when a commitment is involved.
    pub commitment_state: Option<CommitmentState>,
    /// Shared write receipt.
    pub receipt: WorkCommandReceipt,
}
```

| Result | primary ref | state field | result_ref operation | duplicate 口径 |
|---|---|---|---|---|
| `ProjectCommandResult` | `project_ref` | `lifecycle_state` | command operation name | 返回既有 `project_ref` / state / receipt |
| `BacklogCommandResult` | `backlog_ref` | `backlog_state` | command operation name | 返回既有 backlog result |
| `ProjectMemberCommandResult` | `project_member_ref` | `responsibility_state` | command operation name | 返回既有 member result |
| `WorkItemCommandResult` | `work_ref` | `work_state` | command operation name | 返回既有 work result |
| `PromoteCommandResult` | `promote_result_ref` | `result_state` | command operation name | 返回既有 promote result |
| `DependencyCommandResult` | `dependency_ref` | `dependency_state` | command operation name | 返回既有 dependency result |
| `BlockerCommandResult` | `blocker_ref` | `blocker_state` | command operation name | 返回既有 blocker result |
| `IterationCommandResult` | `iteration_ref` | `iteration_state` / `commitment_state` | command operation name | 返回既有 iteration result |

所有 command result DTO 都必须能被 application-local `StoredCommandResult` enum 承载并按 `ApplicationResultRef` 持久化。duplicate 口径中的“返回既有 result”是读取 stored DTO,不是从当前 truth repository 重新组装。

#### 8.3 `CreateProject`

| 项 | 内容 |
|---|---|
| 函数签名 | `handle_create_project(WorkCommandEnvelope<CreateProjectRequest>) -> Result<ProjectCommandResult, WorkProtocolError>` |
| HTTP route | `POST /work/v1/projects` |
| 调用方 | SDK / workspace / operator |
| 处理方 | `api::WorkCommandHandlers` -> `ProjectCommandService.create_project(...)` |
| 是否幂等 | 是;`CommandMetadata.request.idempotency_key` 必填 |

```rust
/// Requests creation of a Work-owned project subject.
pub struct CreateProjectRequest {
    /// Project creation specification.
    pub project_spec: ProjectSpec,
}
```

| 输入字段 | 类型 | 目标对象字段 | 字段来源 | 缺失处理 |
|---|---|---|---|---|
| `project_spec.owner_ref` | `ProjectOwnerRef` | `Project.owner_ref` | request body | reject |
| `project_spec.source_ref` | `Option<SourceWorkRef>` | trace / audit source | request body | 缺失允许 |
| generated | `ProjectId` | `Project.project_id` | `IdGeneratorPort.next_project_id()` | generator failed -> reject |
| generated | `BacklogId` | `Backlog.backlog_id` | `IdGeneratorPort.next_backlog_id()` | generator failed -> reject |

#### 8.4 `UpdateProjectLifecycle`

| 项 | 内容 |
|---|---|
| 函数签名 | `handle_update_project_lifecycle(WorkCommandEnvelope<UpdateProjectLifecycleRequest>) -> Result<ProjectCommandResult, WorkProtocolError>` |
| HTTP route | `PATCH /work/v1/projects/{project_id}/lifecycle` |
| 调用方 | SDK / workspace / operator |
| 处理方 | `api` -> `ProjectCommandService.update_lifecycle(...)` |
| 是否幂等 | 是 |

```rust
/// Requests a project lifecycle transition.
pub struct UpdateProjectLifecycleRequest {
    /// Project to update.
    pub project_ref: ProjectRef,
    /// Target lifecycle state.
    pub target: ProjectLifecycleTarget,
    /// Reason for the transition.
    pub reason: ProjectLifecycleReason,
    /// Expected project version.
    pub expected_version: Version,
}
```

| 输入字段 | 类型 | 目标对象字段 | 字段来源 | 缺失处理 |
|---|---|---|---|---|
| `project_ref` | `ProjectRef` | repository key | route / body一致 | reject mismatch |
| `target` | `ProjectLifecycleTarget` | lifecycle transition | request body | reject |
| `reason` | `ProjectLifecycleReason` | audit / domain method | request body | reject |
| `expected_version` | `Version` | optimistic lock | request body | reject |

#### 8.5 `UpdateBacklogAvailability`

| 项 | 内容 |
|---|---|
| 函数签名 | `handle_update_backlog_availability(WorkCommandEnvelope<UpdateBacklogAvailabilityRequest>) -> Result<BacklogCommandResult, WorkProtocolError>` |
| HTTP route | `PATCH /work/v1/backlogs/{backlog_id}/availability` |
| 调用方 | operator / maintenance |
| 处理方 | `api` -> `WorkItemCommandService.update_backlog_availability(...)` |
| 是否幂等 | 是 |

```rust
/// Requests a backlog availability transition.
pub struct UpdateBacklogAvailabilityRequest {
    /// Backlog to update.
    pub backlog_ref: BacklogRef,
    /// Target availability state.
    pub target: BacklogAvailabilityTarget,
    /// Maintenance reason.
    pub reason: BacklogMaintenanceReason,
    /// Expected backlog version.
    pub expected_version: Version,
}
```

| 输入字段 | 类型 | 目标对象字段 | 字段来源 | 缺失处理 |
|---|---|---|---|---|
| `backlog_ref` | `BacklogRef` | repository key | route / body一致 | reject mismatch |
| `target` | `BacklogAvailabilityTarget` | `Backlog.backlog_state` transition | request body | reject |
| `reason` | `BacklogMaintenanceReason` | audit / domain method | request body | reject |
| `expected_version` | `Version` | optimistic lock | request body | reject |

#### 8.6 `AssignProjectMember`

| 项 | 内容 |
|---|---|
| 函数签名 | `handle_assign_project_member(WorkCommandEnvelope<AssignProjectMemberRequest>) -> Result<ProjectMemberCommandResult, WorkProtocolError>` |
| HTTP route | `POST /work/v1/projects/{project_id}/members` |
| 调用方 | SDK / workspace / operator |
| 处理方 | `api` -> `ProjectMemberCommandService.assign_project_member(...)` |
| 是否幂等 | 是 |

```rust
/// Requests assignment of a project-local responsibility.
pub struct AssignProjectMemberRequest {
    /// Project that owns the responsibility.
    pub project_ref: ProjectRef,
    /// Referenced identity member.
    pub member_ref: GlobalMemberRef,
    /// Responsibility specification.
    pub responsibility_spec: ProjectResponsibilitySpec,
}
```

| 输入字段 | 类型 | 目标对象字段 | 字段来源 | 缺失处理 |
|---|---|---|---|---|
| `project_ref` | `ProjectRef` | `ProjectMember.project_id` via lookup | route / body一致 | reject mismatch |
| `member_ref` | `GlobalMemberRef` | `ProjectMember.member_ref` | request body | reject / resolver not found |
| `responsibility_spec` | `ProjectResponsibilitySpec` | policy input | request body | reject |
| generated | `ProjectMemberId` | `ProjectMember.project_member_id` | `IdGeneratorPort` | generator failed -> reject |
| lookup | `MemberCapabilitySnapshot` | policy input | `MemberReferencePort` / snapshot repo | unresolved -> reject |

#### 8.7 `UpdateProjectMemberResponsibility`

```rust
/// Requests a project member responsibility state transition.
pub struct UpdateProjectMemberResponsibilityRequest {
    /// Project member responsibility to update.
    pub project_member_ref: ProjectMemberRef,
    /// Target responsibility transition.
    pub target: ResponsibilityTarget,
    /// Reason for the transition.
    pub reason: ProjectMemberReason,
    /// Expected project member version.
    pub expected_version: Version,
}
```

| 项 | 内容 |
|---|---|
| 函数签名 | `handle_update_project_member_responsibility(WorkCommandEnvelope<UpdateProjectMemberResponsibilityRequest>) -> Result<ProjectMemberCommandResult, WorkProtocolError>` |
| HTTP route | `PATCH /work/v1/project-members/{project_member_id}/responsibility` |
| 处理方 | `api` -> `ProjectMemberCommandService.update_responsibility(...)` |
| 是否幂等 | 是 |

| 输入字段 | 类型 | 目标对象字段 | 字段来源 | 缺失处理 |
|---|---|---|---|---|
| `project_member_ref` | `ProjectMemberRef` | repository key | route / body一致 | reject mismatch |
| `target` | `ResponsibilityTarget` | `ProjectMember.responsibility_state` transition | request body | reject |
| `reason` | `ProjectMemberReason` | audit / domain method | request body | reject |
| `expected_version` | `Version` | optimistic lock | request body | reject |

#### 8.8 `CreateWorkItem`

```rust
/// Requests creation of a root formal work item.
pub struct CreateWorkItemRequest {
    /// Project that owns the work.
    pub project_ref: ProjectRef,
    /// Formal work intent.
    pub work_intent: FormalWorkIntent,
    /// External source reference.
    pub source_ref: SourceWorkRef,
}
```

| 项 | 内容 |
|---|---|
| 函数签名 | `handle_create_work_item(WorkCommandEnvelope<CreateWorkItemRequest>) -> Result<WorkItemCommandResult, WorkProtocolError>` |
| HTTP route | `POST /work/v1/projects/{project_id}/work-items` |
| 处理方 | `api` -> `WorkItemCommandService.create_work_item(...)` |
| 是否幂等 | 是 |

| 输入字段 | 类型 | 目标对象字段 | 字段来源 | 缺失处理 |
|---|---|---|---|---|
| `project_ref` | `ProjectRef` | project / backlog lookup | route / body一致 | reject mismatch |
| `work_intent.assignee_ref` | `ProjectMemberRef` | `WorkItem.assignee_ref` | request body | reject / lookup failed |
| `work_intent.method_definition_ref` | `Option<MethodDefinitionRef>` | policy input | request body / resolver | unresolved -> reject if required |
| `source_ref` | `SourceWorkRef` | source audit / policy | request body | reject / resolver rejected |
| generated | `WorkItemId` | `WorkItem.work_item_id` | `IdGeneratorPort` | generator failed -> reject |

#### 8.9 `CreateChildWorkItem`

```rust
/// Requests creation of a formal child work item.
pub struct CreateChildWorkItemRequest {
    /// Parent formal work item.
    pub parent_ref: FormalWorkRef,
    /// Formal child work intent.
    pub work_intent: FormalWorkIntent,
    /// External source reference.
    pub source_ref: SourceWorkRef,
}
```

| 项 | 内容 |
|---|---|
| 函数签名 | `handle_create_child_work_item(WorkCommandEnvelope<CreateChildWorkItemRequest>) -> Result<WorkItemCommandResult, WorkProtocolError>` |
| HTTP route | `POST /work/v1/formal-work/{work_item_id}/children` |
| 处理方 | `api` -> `WorkItemCommandService.create_child_work_item(...)` |
| 是否幂等 | 是 |

| 输入字段 | 类型 | 目标对象字段 | 字段来源 | 缺失处理 |
|---|---|---|---|---|
| `parent_ref` | `FormalWorkRef` | `ChildWorkItem.parent_work_item_id` via lookup | route / body一致 | reject mismatch / not root |
| `work_intent` | `FormalWorkIntent` | child work policy input | request body | reject |
| `source_ref` | `SourceWorkRef` | `ChildWorkItem.source_ref` | request body | reject |
| generated | `ChildWorkItemId` | `ChildWorkItem.child_work_item_id` | `IdGeneratorPort` | generator failed -> reject |

#### 8.10 `UpdateWorkItemLifecycle`

```rust
/// Requests a formal work lifecycle transition.
pub struct UpdateWorkItemLifecycleRequest {
    /// Formal work to update.
    pub work_ref: FormalWorkRef,
    /// Target lifecycle state.
    pub target: WorkLifecycleTarget,
    /// Reason for the transition.
    pub reason: WorkLifecycleReason,
    /// Completion or transition evidence when required.
    pub evidence_ref: Option<ExternalEvidenceRef>,
    /// Expected formal work version.
    pub expected_version: Version,
}
```

| 项 | 内容 |
|---|---|
| 函数签名 | `handle_update_work_item_lifecycle(WorkCommandEnvelope<UpdateWorkItemLifecycleRequest>) -> Result<WorkItemCommandResult, WorkProtocolError>` |
| HTTP route | `PATCH /work/v1/formal-work/lifecycle` |
| 处理方 | `api` -> `WorkItemCommandService.update_lifecycle(...)` |
| 是否幂等 | 是 |

| 输入字段 | 类型 | 目标对象字段 | 字段来源 | 缺失处理 |
|---|---|---|---|---|
| `work_ref` | `FormalWorkRef` | repository key | request body | reject |
| `target` | `WorkLifecycleTarget` | `WorkItemState` transition | request body | reject |
| `reason` | `WorkLifecycleReason` | audit / domain method | request body | reject |
| `evidence_ref` | `Option<ExternalEvidenceRef>` | `completion_ref` when completed | request body / resolver | required target 缺失 reject |
| `expected_version` | `Version` | optimistic lock | request body | reject |

#### 8.11 `RequestWorkPromotion`

```rust
/// Requests review of an external source for formal Work promotion.
pub struct RequestWorkPromotionRequest {
    /// Source to evaluate.
    pub source_ref: SourceWorkRef,
    /// Reason for promotion.
    pub reason: PromoteReason,
}
```

| 项 | 内容 |
|---|---|
| 函数签名 | `handle_request_work_promotion(WorkCommandEnvelope<RequestWorkPromotionRequest>) -> Result<PromoteCommandResult, WorkProtocolError>` |
| HTTP route | `POST /work/v1/promotions` |
| 处理方 | `api` -> `PromoteCommandService.request_promotion(...)` |
| 是否幂等 | 是 |

| 输入字段 | 类型 | 目标对象字段 | 字段来源 | 缺失处理 |
|---|---|---|---|---|
| `source_ref` | `SourceWorkRef` | `PromoteResult.source_ref` | request body | reject / resolver rejected |
| `reason` | `PromoteReason` | policy / decision input | request body | reject |
| generated | `PromoteResultId` | `PromoteResult.promote_result_id` | `IdGeneratorPort` | generator failed -> reject |

#### 8.12 `ReviewWorkPromotion`

```rust
/// Requests a review decision for a promote result.
pub struct ReviewWorkPromotionRequest {
    /// Promote result under review.
    pub promote_result_ref: PromoteResultRef,
    /// Review decision.
    pub decision: PromoteReviewDecision,
    /// Optional formal work intent when accepting into a new Work item.
    pub accepted_work_intent: Option<FormalWorkIntent>,
    /// Expected promote result version.
    pub expected_version: Version,
}
```

| 项 | 内容 |
|---|---|
| 函数签名 | `handle_review_work_promotion(WorkCommandEnvelope<ReviewWorkPromotionRequest>) -> Result<PromoteCommandResult, WorkProtocolError>` |
| HTTP route | `PATCH /work/v1/promotions/{promote_result_id}/review` |
| 处理方 | `api` -> `PromoteCommandService.review_promotion(...)` |
| 是否幂等 | 是 |

| 输入字段 | 类型 | 目标对象字段 | 字段来源 | 缺失处理 |
|---|---|---|---|---|
| `promote_result_ref` | `PromoteResultRef` | repository key | route / body一致 | reject mismatch |
| `decision` | `PromoteReviewDecision` | `PromoteResult.result_state`;reject path `PromoteRejectReason` | request body | reject;`Reject(reason)` reason 缺失 reject |
| `accepted_work_intent` | `Option<FormalWorkIntent>` | accepted path work creation | request body | accept decision 缺失 reject;reject decision 出现时 reject |
| `expected_version` | `Version` | optimistic lock | request body | reject |
| generated | `WorkItemId` / `ChildWorkItemId` | accepted work id | `IdGeneratorPort` | accept path generator failed -> reject |

#### 8.13 dependency / blocker Commands

```rust
/// Requests creation of a dependency between formal work records.
pub struct LinkWorkDependencyRequest {
    /// Work that must happen first.
    pub upstream_work_ref: FormalWorkRef,
    /// Work affected by the dependency.
    pub downstream_work_ref: FormalWorkRef,
    /// Reason for linking.
    pub reason: DependencyReason,
}

/// Requests a dependency state transition.
pub struct UpdateWorkDependencyStateRequest {
    /// Dependency to update.
    pub dependency_ref: WorkDependencyRef,
    /// Target dependency state.
    pub target: DependencyTarget,
    /// Reason for the state change.
    ///
    /// `target = Active` requires `reason.reason_kind = Activated`.
    /// `target = Satisfied` requires `reason.reason_kind = SatisfiedByEvidence`.
    /// `target = Waived` requires `reason.reason_kind = Waived`.
    /// `target = Cancelled` requires `reason.reason_kind = Cancelled`.
    pub reason: DependencyChangeReason,
    /// Evidence when required by target.
    pub evidence_ref: Option<ExternalEvidenceRef>,
    /// Expected dependency version.
    pub expected_version: Version,
}

/// Requests opening a work blocker.
pub struct OpenWorkBlockerRequest {
    /// Formal work blocked by this record.
    pub blocked_work_ref: FormalWorkRef,
    /// Cause reference.
    pub cause_ref: BlockerCauseRef,
}

/// Requests blocker resolution.
pub struct ResolveWorkBlockerRequest {
    /// Blocker to resolve.
    pub blocker_ref: WorkBlockerRef,
    /// Evidence used for resolution.
    pub evidence_ref: ExternalEvidenceRef,
    /// Expected blocker version.
    pub expected_version: Version,
}
```

| Command | route | result | 必填字段 | 派生 / lookup | 缺失处理 |
|---|---|---|---|---|---|
| `LinkWorkDependency` | `POST /work/v1/dependencies` | `DependencyCommandResult` | upstream、downstream、reason | graph snapshot、`WorkDependencyId` | reject |
| `UpdateWorkDependencyState` | `PATCH /work/v1/dependencies/{dependency_id}` | `DependencyCommandResult` | dependency ref、target、reason、version | evidence resolver when target is `Satisfied`;reason kind must match target | reject / resolver rejected |
| `OpenWorkBlocker` | `POST /work/v1/blockers` | `BlockerCommandResult` | blocked work、cause ref | `WorkBlockerId` | reject |
| `ResolveWorkBlocker` | `PATCH /work/v1/blockers/{blocker_id}/resolve` | `BlockerCommandResult` | blocker ref、evidence、version | evidence resolver | reject / resolver rejected |

#### 8.14 iteration Commands

```rust
/// Requests opening a Work-owned iteration.
pub struct OpenIterationRequest {
    /// Project that owns the iteration.
    pub project_ref: ProjectRef,
    /// External process timebox pointer.
    pub timebox_ref: ProcessTimeboxRef,
}

/// Requests commitment of an iteration work scope.
pub struct CommitIterationScopeRequest {
    /// Iteration to commit.
    pub iteration_ref: IterationRef,
    /// Candidate formal work refs.
    pub candidate_work_refs: FormalWorkRefSet,
    /// Expected iteration version.
    pub expected_iteration_version: Version,
}

/// Requests changes to an iteration commitment.
pub struct UpdateIterationCommitmentRequest {
    /// Iteration whose commitment is changed.
    pub iteration_ref: IterationRef,
    /// Change set to apply.
    pub change_set: IterationCommitmentChangeSet,
    /// Reason for the change.
    pub reason: IterationChangeReason,
    /// Expected commitment version.
    pub expected_commitment_version: Version,
}

/// Requests an iteration lifecycle transition.
pub struct UpdateIterationLifecycleRequest {
    /// Iteration to update.
    pub iteration_ref: IterationRef,
    /// Target iteration state.
    pub target: IterationLifecycleTarget,
    /// Required for `target = InProgress` and `target = Cancelled`; forbidden for `target = Closed`.
    pub change_reason: Option<IterationChangeReason>,
    /// Required for `target = Closed`; forbidden for `target = InProgress` and `target = Cancelled`.
    pub close_reason: Option<IterationCloseReason>,
    /// Expected iteration version.
    pub expected_version: Version,
}
```

| Command | route | result | 必填字段 | 派生 / lookup | 缺失处理 |
|---|---|---|---|---|---|
| `OpenIteration` | `POST /work/v1/projects/{project_id}/iterations` | `IterationCommandResult` | project ref、timebox ref | process timebox resolver、`IterationId` | reject / resolver rejected |
| `CommitIterationScope` | `POST /work/v1/iterations/{iteration_id}/commitments` | `IterationCommandResult` | iteration ref、candidate refs、version | work repo verifies candidates、`IterationCommitmentId` | empty candidates reject |
| `UpdateIterationCommitment` | `PATCH /work/v1/iterations/{iteration_id}/commitments` | `IterationCommandResult` | iteration ref、change set、reason、version | work repo verifies added refs | empty change set reject |
| `UpdateIterationLifecycle` | `PATCH /work/v1/iterations/{iteration_id}/lifecycle` | `IterationCommandResult` | iteration ref、target、target-specific reason、version | `InProgress` / `Cancelled` use `change_reason`;`Closed` uses `close_reason`;commitment lookup when closing | reject invalid reason combination / close without commitment |

`UpdateIterationLifecycleRequest` target / reason validation:

| `target` | Required field | Forbidden field | Domain call |
|---|---|---|---|
| `InProgress` | `change_reason: IterationChangeReason` | `close_reason` | `Iteration::start(change_reason, actor)` |
| `Closed` | `close_reason: IterationCloseReason` | `change_reason` | `Iteration::close(close_reason, actor)` and `IterationCommitment::close(close_reason, actor)` |
| `Cancelled` | `change_reason: IterationChangeReason` | `close_reason` | `Iteration::cancel(change_reason, actor)` |

#### 8.15 Command 到 Domain 构造闭环

| 输入契约 | 目标 Domain 对象 | 必填字段是否齐全 | 派生字段来源 | 不得混同字段 | 缺失时行为 |
|---|---|---|---|---|---|
| `CreateProjectRequest` | `Project`、`Backlog` | 是 | `ProjectId` / `BacklogId` from id port | `ProjectOwnerRef` != `ProjectRef` | reject / generate failed reject |
| `AssignProjectMemberRequest` | `ProjectMember`、`MemberCapabilitySnapshot` | 是 | `ProjectMemberId`、member snapshot lookup | `GlobalMemberRef` != `ProjectMemberRef` | reject / lookup failed |
| `CreateWorkItemRequest` | `WorkItem` | 是 | `WorkItemId`、Backlog lookup、source resolver | `SourceWorkRef` != `FormalWorkRef` | reject |
| `CreateChildWorkItemRequest` | `ChildWorkItem` | 是 | `ChildWorkItemId`、parent lookup | parent root id != child id | reject |
| `UpdateWorkItemLifecycleRequest` | `WorkItem` / `ChildWorkItem` | 是 | evidence resolver for completion | `ExternalEvidenceRef` != source ref | reject missing required evidence |
| `RequestWorkPromotionRequest` | `PromoteResult` | 是 | `PromoteResultId`、source resolver | source ref != created work ref | reject |
| `ReviewWorkPromotionRequest` | `PromoteResult`、optional `WorkItem` / `ChildWorkItem` | 是 | work id generated on accept;reject reason carried by `PromoteReviewDecision::Reject(PromoteRejectReason)` | promote result ref != work ref;reject reason != accepted work intent | accept without intent reject;reject with accepted intent reject |
| dependency / blocker requests | `WorkDependency`、`WorkBlocker` | 是 | ids、graph snapshot、evidence resolver;`DependencyTarget::Active` uses `DependencyChangeReasonKind::Activated` | dependency ref != blocker ref;creation `DependencyReason` != state-change `DependencyChangeReason` | reject |
| iteration requests | `Iteration`、`IterationCommitment` | 是 | ids、timebox resolver、work lookup | process timebox != iteration truth | reject |

### 9. Query 协议契约

#### 9.1 Query DTO 共享值对象

```rust
/// Free-text query for Work search.
pub struct WorkSearchText(pub String);

/// Stable digest over normalized WorkSearchCriteria.
pub struct WorkSearchCriteriaDigest(pub String);

/// Summarizes one formal work record for public query views.
pub struct FormalWorkSummaryView {
    /// Formal work reference.
    pub work_ref: FormalWorkRef,
    /// Current work lifecycle state.
    pub work_state: WorkItemState,
    /// Current project member assignee.
    pub assignee_ref: Option<ProjectMemberRef>,
    /// Optional completion evidence reference.
    pub completion_ref: Option<ExternalEvidenceRef>,
}

/// Summarizes a project member responsibility for public query views.
pub struct ProjectMemberSummaryView {
    /// Project member reference.
    pub project_member_ref: ProjectMemberRef,
    /// Referenced identity member.
    pub member_ref: GlobalMemberRef,
    /// Current responsibility state.
    pub responsibility_state: ProjectMemberResponsibilityState,
}

/// Summarizes a dependency or blocker for public query views.
pub struct WorkRelationSummaryView {
    /// Relation or blocker reference.
    pub relation_ref: DependencyOrBlockerRef,
    /// Formal work affected by this relation.
    pub affected_work_refs: Vec<FormalWorkRef>,
    /// Current relation state marker.
    pub relation_state: WorkRelationStateView,
}

/// Public relation state marker that avoids exposing domain-only variants.
pub enum WorkRelationStateView {
    /// Dependency state marker.
    Dependency(DependencyState),
    /// Blocker state marker.
    Blocker(BlockerState),
}

/// Search criteria accepted by Work search queries.
pub struct WorkSearchCriteria {
    /// Optional formal work state filter.
    pub work_state: Option<WorkItemState>,
    /// Optional assignee filter.
    pub assignee_ref: Option<ProjectMemberRef>,
    /// Optional source kind filter.
    pub source_kind: Option<SourceWorkKind>,
    /// Optional free-text query over indexed summaries.
    pub text_query: Option<WorkSearchText>,
}

/// Filters backlog reads.
pub struct BacklogQueryFilter {
    /// Optional formal work state filter.
    pub work_state: Option<WorkItemState>,
    /// Optional assignee filter.
    pub assignee_ref: Option<ProjectMemberRef>,
}
```

| DTO | 字段 | 类型 | 字段来源 | 约束 |
|---|---|---|---|---|
| `WorkSearchText` | string | `SearchWorkRequest.criteria.text_query` | query input | trim 后 1..=120 UTF-8 chars;控制字符 reject;缺失表示不按文本过滤 |
| `WorkSearchCriteriaDigest` | string | `DerivedWorkViewScopeRef::Search` | canonical `WorkSearchCriteria` | 输入为 normalized `work_state`、`assignee_ref`、`source_kind`、`text_query`;不得包含 `QueryMetadata.page`、actor、trace、request id、projection freshness 或 repository cursor |
| `FormalWorkSummaryView` | `work_ref` | `FormalWorkRef` | truth repository | 不含 work body / plan body |
| `FormalWorkSummaryView` | `work_state` | `WorkItemState` | contracts shared enum | 不依赖 domain-only enum |
| `ProjectMemberSummaryView` | `member_ref` | `GlobalMemberRef` | ProjectMember truth | 不暴露 identity body |
| `WorkRelationSummaryView` | `relation_state` | `WorkRelationStateView` | dependency / blocker truth | 使用 contracts shared state |
| `WorkSearchCriteria` | filters | shared refs / enums | query body | page 在 `QueryMetadata.page`,不在 criteria |

#### 9.2 projection key 与 `DerivedWorkViewRef` 稳定派生

| Query / View | repository key | `DerivedWorkViewRef` 派生规则 | cursor 来源 |
|---|---|---|---|
| `GetProjectBoardView` / `ProjectBoardView` | `ProjectRef` | `project-board:{project_id}` | `DerivedWorkViewState.source_cursor` |
| `ListMemberWork` / `MemberWorkView` | `ProjectMemberRef` | `member-work:{project_member_id}` | `DerivedWorkViewState.source_cursor` |
| `GetIterationSummary` / `IterationSummaryView` | `IterationRef` | `iteration-summary:{iteration_id}` | `DerivedWorkViewState.source_cursor` |
| `SearchWork` / `WorkSearchResult` | `ProjectRef + WorkSearchCriteria` | `work-search:{project_id}:{criteria_digest}` where `criteria_digest: WorkSearchCriteriaDigest` | `DerivedWorkViewState.source_cursor` |
| `GetProjectWorkFacts` | `ProjectRef` | 不要求 projection ref;truth read | repository truth cursor optional |
| `GetWorkTrace` | `WorkTraceSubjectRef` | 不要求 projection ref;trace read | trace page cursor |

`SearchWork` 的 stable view identity 必须由完整 `WorkSearchCriteria` 派生。`criteria_digest` 的 canonical input 按固定顺序编码 `work_state`、`assignee_ref`、`source_kind` 和 normalized `text_query`;每个字段使用稳定字段名和 variant / ref value,`None` 必须显式编码为 `null`,text 使用 DTO validation 后的 normalized `WorkSearchText` value。`QueryMetadata.page` 只影响返回页,不得进入 `WorkSearchCriteriaDigest`,否则同一搜索条件的不同页面会变成不同 projection freshness key。实现不得以 `WorkSearchText` 单独派生 `DerivedWorkViewScopeRef::Search`,也不得使用 Rust `Debug` 输出或 map iteration order 作为 digest input。

P0 public derived view identity 只包含 `ProjectBoardView`、`MemberWorkView`、`IterationSummaryView` 和 `WorkSearchResult`。`PromoteResult` 通过 command result、truth repository 和 `PromoteResultRecorded` outbound event 暴露;`PendingPromoteIntake` 只是 runtime intake marker / operations inspection 数据,当前 P0 不提供 query surface。因此不得派生 `promote-result:*`、`promote-intake:*` 或同类临时 `DerivedWorkViewRef`。Promote 写路径只有在 accept path 创建 / 绑定 formal work 并影响上述既有 Work views 时,才标记这些既有 view stale。

#### 9.3 Query response view schema

```rust
/// Project facts visible to authorized consumers.
pub struct ProjectWorkFactsView {
    /// Project reference.
    pub project_ref: ProjectRef,
    /// Current project lifecycle state.
    pub lifecycle_state: ProjectLifecycleState,
    /// Current backlog reference when available.
    pub backlog_ref: Option<BacklogRef>,
    /// Project members visible to the actor.
    pub members: Vec<ProjectMemberSummaryView>,
    /// Formal work summaries visible to the actor.
    pub formal_work: Vec<FormalWorkSummaryView>,
    /// Dependency and blocker summaries visible to the actor.
    pub relations: Vec<WorkRelationSummaryView>,
}

/// Backlog read view.
pub struct BacklogView {
    /// Backlog reference.
    pub backlog_ref: BacklogRef,
    /// Owning project.
    pub project_ref: ProjectRef,
    /// Current backlog state.
    pub backlog_state: BacklogState,
    /// Page of formal work summaries.
    pub items: Vec<FormalWorkSummaryView>,
    /// Public page metadata.
    pub page: PublicPageInfo,
}

/// Formal work read view.
pub struct WorkItemView {
    /// Formal work reference.
    pub work_ref: FormalWorkRef,
    /// Parent work when this is a child work item.
    pub parent_ref: Option<FormalWorkRef>,
    /// Current work state.
    pub work_state: WorkItemState,
    /// Current assignee.
    pub assignee_ref: Option<ProjectMemberRef>,
    /// Source used to create or promote this work.
    pub source_ref: Option<SourceWorkRef>,
    /// Completion evidence when present.
    pub completion_ref: Option<ExternalEvidenceRef>,
    /// Active relations involving this work.
    pub relations: Vec<WorkRelationSummaryView>,
}

/// Member work projection view.
pub struct MemberWorkView {
    /// Project member reference.
    pub member_ref: ProjectMemberRef,
    /// Assigned work visible in this view.
    pub assigned_work: Vec<FormalWorkSummaryView>,
    /// Projection marker.
    pub marker: ProjectionViewMarker,
    /// Public page metadata.
    pub page: PublicPageInfo,
}

/// Iteration summary projection view.
pub struct IterationSummaryView {
    /// Iteration reference.
    pub iteration_ref: IterationRef,
    /// Current iteration state.
    pub iteration_state: IterationState,
    /// Current commitment state.
    pub commitment_state: Option<CommitmentState>,
    /// Committed work summaries.
    pub committed_work: Vec<FormalWorkSummaryView>,
    /// Projection marker.
    pub marker: ProjectionViewMarker,
}

/// Search result over formal work projections.
pub struct WorkSearchResult {
    /// Project searched.
    pub project_ref: ProjectRef,
    /// Criteria applied by the query.
    pub criteria: WorkSearchCriteria,
    /// Matching work items.
    pub items: Vec<FormalWorkSummaryView>,
    /// Projection marker.
    pub marker: ProjectionViewMarker,
    /// Public page metadata.
    pub page: PublicPageInfo,
}

/// Trace view for one Work subject.
pub struct WorkTraceView {
    /// Trace subject.
    pub subject_ref: WorkTraceSubjectRef,
    /// Trace records visible to the actor.
    pub records: Vec<WorkTraceRecordView>,
    /// Public page metadata.
    pub page: PublicPageInfo,
}

/// Public trace record view.
pub struct WorkTraceRecordView {
    /// Trace record id.
    pub trace_id: WorkTraceId,
    /// Related subject.
    pub subject_ref: WorkTraceSubjectRef,
    /// Core trace and request pointer.
    pub trace_context_ref: WorkTraceContextRef,
}

/// Project board projection view.
pub struct ProjectBoardView {
    /// Project reference.
    pub project_ref: ProjectRef,
    /// Work cards grouped for board consumption.
    pub work_cards: Vec<FormalWorkSummaryView>,
    /// Projection marker.
    pub marker: ProjectionViewMarker,
}
```

| View | 字段 | 类型 | 字段来源 | empty / not visible / degraded 口径 |
|---|---|---|---|---|
| `ProjectWorkFactsView` | `project_ref`、state、members、work、relations | shared refs / states | truth repositories | not visible -> `data=None`; empty project -> empty lists |
| `BacklogView` | backlog、items、page | shared refs / states | Backlog + WorkItem repos | missing backlog -> `Missing`; empty backlog -> empty items |
| `WorkItemView` | work fields | shared refs / states | WorkItem repo + relations | not visible -> no data; missing -> `Missing` |
| `MemberWorkView` | assigned work、marker、page | projection wrapper | ProjectionRepository | stale / rebuilding / failed via `QuerySurface` |
| `IterationSummaryView` | committed work、marker | iteration truth + projection | ProjectionRepository / Iteration repo | stale via marker; missing -> `Missing` |
| `WorkSearchResult` | criteria、items、marker、page | projection search | ProjectionRepository | stale / failed via surface |
| `WorkTraceView` | trace records、page | AuditRepository | trace repo | no records -> `Empty` |
| `ProjectBoardView` | cards、marker | ProjectionRepository | board projection | stale / rebuilding / failed via surface |

#### 9.4 Query request DTO

```rust
/// Requests project work facts.
pub struct GetProjectWorkFactsRequest {
    /// Project to read.
    pub project_ref: ProjectRef,
}

/// Requests a backlog page.
pub struct GetBacklogRequest {
    /// Project whose backlog is read.
    pub project_ref: ProjectRef,
    /// Optional backlog filter.
    pub filter: Option<BacklogQueryFilter>,
}

/// Requests one formal work item.
pub struct GetWorkItemRequest {
    /// Formal work to read.
    pub work_ref: FormalWorkRef,
}

/// Requests work assigned to a project member.
pub struct ListMemberWorkRequest {
    /// Project member scope.
    pub project_member_ref: ProjectMemberRef,
    /// Optional work state filter.
    pub work_state: Option<WorkItemState>,
}

/// Requests an iteration summary.
pub struct GetIterationSummaryRequest {
    /// Iteration to read.
    pub iteration_ref: IterationRef,
}

/// Requests a formal work search.
pub struct SearchWorkRequest {
    /// Project search scope.
    pub project_ref: ProjectRef,
    /// Search criteria.
    pub criteria: WorkSearchCriteria,
}

/// Requests Work trace records for a subject.
pub struct GetWorkTraceRequest {
    /// Trace subject.
    pub subject_ref: WorkTraceSubjectRef,
}

/// Requests the project board projection.
pub struct GetProjectBoardViewRequest {
    /// Project board scope.
    pub project_ref: ProjectRef,
}
```

| Query | 函数签名 | HTTP route | Response type | page 来源 | consistency 来源 |
|---|---|---|---|---|---|
| `GetProjectWorkFacts` | `handle_get_project_work_facts(WorkQueryEnvelope<GetProjectWorkFactsRequest>) -> Result<WorkQueryResponse<ProjectWorkFactsView>, WorkProtocolError>` | `GET /work/v1/projects/{project_id}/facts` | `ProjectWorkFactsView` | 不分页 | `QueryMetadata.consistency` |
| `GetBacklog` | `handle_get_backlog(WorkQueryEnvelope<GetBacklogRequest>) -> Result<WorkQueryResponse<BacklogView>, WorkProtocolError>` | `GET /work/v1/projects/{project_id}/backlog` | `BacklogView` | `QueryMetadata.page` | metadata |
| `GetWorkItem` | `handle_get_work_item(WorkQueryEnvelope<GetWorkItemRequest>) -> Result<WorkQueryResponse<WorkItemView>, WorkProtocolError>` | `GET /work/v1/formal-work/{formal_work_ref}` | `WorkItemView` | 不分页 | metadata |
| `ListMemberWork` | `handle_list_member_work(WorkQueryEnvelope<ListMemberWorkRequest>) -> Result<WorkQueryResponse<MemberWorkView>, WorkProtocolError>` | `GET /work/v1/project-members/{project_member_id}/work` | `MemberWorkView` | `QueryMetadata.page` | metadata |
| `GetIterationSummary` | `handle_get_iteration_summary(WorkQueryEnvelope<GetIterationSummaryRequest>) -> Result<WorkQueryResponse<IterationSummaryView>, WorkProtocolError>` | `GET /work/v1/iterations/{iteration_id}/summary` | `IterationSummaryView` | 不分页 | metadata |
| `SearchWork` | `handle_search_work(WorkQueryEnvelope<SearchWorkRequest>) -> Result<WorkQueryResponse<WorkSearchResult>, WorkProtocolError>` | `POST /work/v1/projects/{project_id}/search` | `WorkSearchResult` | `QueryMetadata.page` | metadata |
| `GetWorkTrace` | `handle_get_work_trace(WorkQueryEnvelope<GetWorkTraceRequest>) -> Result<WorkQueryResponse<WorkTraceView>, WorkProtocolError>` | `GET /work/v1/traces/{subject_ref}` | `WorkTraceView` | `QueryMetadata.page` | metadata |
| `GetProjectBoardView` | `handle_get_project_board_view(WorkQueryEnvelope<GetProjectBoardViewRequest>) -> Result<WorkQueryResponse<ProjectBoardView>, WorkProtocolError>` | `GET /work/v1/projects/{project_id}/board` | `ProjectBoardView` | 不分页 | metadata |

#### 9.5 Query 字段闭环

| Query | 输入字段 | repository / projection key | response 字段来源 | 缺失 / 不可见 / degraded 行为 |
|---|---|---|---|---|
| `GetProjectWorkFacts` | `project_ref` | `ProjectRepository.get` + related repos | truth summary | not found -> `Missing`; unauthorized -> `NotVisible` |
| `GetBacklog` | `project_ref`、filter | `BacklogRepository.get_by_project` + `WorkItemRepository.list_by_backlog` | truth + page | missing -> `Missing`; empty -> `Empty` |
| `GetWorkItem` | `work_ref` | `WorkItemRepository.get_formal_work` | formal work + relation summaries | missing -> `Missing`; unauthorized -> `NotVisible` |
| `ListMemberWork` | `project_member_ref`、state filter | `ProjectionRepository.get_member_work_view` | projection wrapper | stale / rebuilding / failed surface |
| `GetIterationSummary` | `iteration_ref` | `ProjectionRepository.get_iteration_summary_view` | projection wrapper | missing -> `Missing`; stale marker preserved |
| `SearchWork` | `project_ref`、criteria | `ProjectionRepository.search_work` | search projection page | projection failed -> `Failed` |
| `GetWorkTrace` | `subject_ref` | `AuditRepository.list_trace_records` | trace records | no records -> `Empty`; unauthorized -> `NotVisible` |
| `GetProjectBoardView` | `project_ref` | `ProjectionRepository.get_project_board_view` | board projection wrapper | missing projection -> `Rebuilding` or `Missing` by freshness state |

### 10. Event 协议契约

#### 10.1 event version strategy

| 项 | 正式口径 |
|---|---|
| topic 命名 | `<bounded-context>.<subject>.<verb>.v1` |
| payload 版本 | `EventSchemaVersion` 是 `crates/contracts/src/events.rs` 中的字符串 newtype;P0 支持 `v1`;字段必须与 topic major version 对齐 |
| fixture 版本 | event fixture 使用 `EventSchemaVersion::v1()`;unsupported-version fixture 显式构造非 `v1` 用于 dead-letter 测试 |
| 兼容变更 | v1 只允许新增可选字段;删除 / 改名 / 语义变更必须升 v2 |
| dedup | inbound 使用 `source_event_id + topic + source_ref` |
| trace | inbound / outbound 均携带 `WorkTraceContextRef` |
| dead-letter | envelope 缺失、event id 缺失、schema version unsupported、必填 ref 缺失 |

#### 10.2 Inbound Event payload schema

```rust
/// Identity member change consumed by Work.
pub struct IdentityMemberChangedPayload {
    /// Referenced identity member.
    pub member_ref: GlobalMemberRef,
    /// Capability refs safe for Work responsibility checks.
    pub capability_refs: CapabilityRefSet,
    /// Upstream member version or cursor.
    pub source_version_ref: ExternalVersionRef,
}

/// Method definition change consumed by Work.
pub struct MethodDefinitionChangedPayload {
    /// Referenced method definition.
    pub definition_ref: MethodDefinitionRef,
    /// Definition category.
    pub definition_kind: MethodDefinitionKind,
    /// Upstream definition version or cursor.
    pub source_version_ref: ExternalVersionRef,
}

/// Conversation work context change consumed by Work.
pub struct ConversationWorkContextChangedPayload {
    /// Source work reference derived from conversation context.
    pub source_ref: SourceWorkRef,
    /// Optional digest of the source summary.
    pub source_digest: Option<SourceDigest>,
}

/// Process timing change consumed by Work.
pub struct ProcessTimingChangedPayload {
    /// Process timebox reference.
    pub timebox_ref: ProcessTimeboxRef,
    /// Project affected when known.
    pub project_ref: Option<ProjectRef>,
    /// Upstream timing version or cursor.
    pub source_version_ref: ExternalVersionRef,
}

/// Governance decision change consumed by Work.
pub struct GovernanceDecisionChangedPayload {
    /// Governance decision source reference.
    pub source_ref: SourceWorkRef,
    /// Evidence reference when the decision can support a Work transition.
    pub evidence_ref: Option<ExternalEvidenceRef>,
    /// Upstream decision version or cursor.
    pub source_version_ref: ExternalVersionRef,
}

/// Artifact evidence change consumed by Work.
pub struct ArtifactEvidenceChangedPayload {
    /// External evidence reference.
    pub evidence_ref: ExternalEvidenceRef,
    /// Upstream artifact version or cursor.
    pub source_version_ref: ExternalVersionRef,
}

/// Runtime promote request consumed by Work.
pub struct RuntimePromoteRequestedPayload {
    /// Runtime source ref that may become a Work promotion.
    pub source_ref: SourceWorkRef,
    /// Reason supplied by runtime.
    pub promote_reason: PromoteReason,
}
```

| Consumer | topic | Payload | 写入对象 | 缺失处理 |
|---|---|---|---|---|
| `ConsumeIdentityMemberChanged` | `identity.member.changed.v1` | `IdentityMemberChangedPayload` | `MemberCapabilitySnapshot`、`ReferenceResolutionState` | missing member / capabilities -> dead-letter |
| `ConsumeMethodDefinitionChanged` | `method.definition.changed.v1` | `MethodDefinitionChangedPayload` | `MethodDefinitionSnapshot`、`ReferenceResolutionState` | missing definition -> dead-letter |
| `ConsumeConversationWorkContextChanged` | `conversation.work_context.changed.v1` | `ConversationWorkContextChangedPayload` | `ReferenceResolutionState` / pending source marker | missing source -> dead-letter |
| `ConsumeProcessTimingChanged` | `process.timing.changed.v1` | `ProcessTimingChangedPayload` | process timing reference state | missing timebox -> dead-letter |
| `ConsumeGovernanceDecisionChanged` | `governance.decision.changed.v1` | `GovernanceDecisionChangedPayload` | governance source/evidence reference state | missing both source/evidence -> dead-letter |
| `ConsumeArtifactEvidenceChanged` | `artifact.evidence.changed.v1` | `ArtifactEvidenceChangedPayload` | evidence reference state | missing evidence -> dead-letter |
| `ConsumeRuntimePromoteRequested` | `runtime.work_promote.requested.v1` | `RuntimePromoteRequestedPayload` | pending promote intake / source reference state | missing source / reason -> dead-letter |

| Inbound 字段 | 目标对象字段 | 字段来源 | 不得混同 | 失败行为 |
|---|---|---|---|---|
| `member_ref` | `MemberCapabilitySnapshot.member_ref` | event payload | `GlobalMemberRef` != `ProjectMemberRef` | dead-letter |
| `capability_refs` | `MemberCapabilitySnapshot.capability_refs` | event payload | capabilities != responsibility spec | dead-letter / unresolved |
| `definition_ref` | `MethodDefinitionSnapshot.definition_ref` | event payload | method ref != work ref | dead-letter |
| `source_ref` | `ReferenceResolutionState.reference_ref` / pending source | event payload | source ref != formal work ref | unresolved / pending |
| `evidence_ref` | `ExternalEvidenceRef` snapshot | event payload | evidence ref != source ref | unresolved / rejected |
| `timebox_ref` | process timing reference state | event payload | timebox ref != iteration ref | unresolved |

Inbound consumer 如需标记 projection stale,affected views 必须来自正式 repository 读取面,不得从 event payload 或 external ref 临时拼接 `DerivedWorkViewRef`。`ConsumeIdentityMemberChanged` 使用 `ProjectMemberRepository.list_by_member(member_ref, page)` 确认 Work-owned responsibility scope,并使用 `ProjectionRepository.list_views_affected_by_member(member_ref, page)` 获得既有 public view refs。`ConsumeMethodDefinitionChanged` 使用 `ProjectionRepository.list_views_affected_by_method(definition_ref, page)` 获得既有 public view refs。上述列表为空时只保存 snapshot / reference state,不调用 `mark_stale(...)` 生成 ad hoc view ref。

#### 10.3 Outbound Event shared schema

```rust
/// Shared envelope for Work outbound events.
pub struct WorkOutboundEventEnvelope<T> {
    /// Work-owned outbox record id.
    pub outbox_id: WorkOutboxId,
    /// Event schema version.
    pub event_version: EventSchemaVersion,
    /// Core trace and request pointer.
    pub trace_context_ref: WorkTraceContextRef,
    /// Event creation timestamp.
    pub occurred_at: Timestamp,
    /// Operation-specific payload.
    pub payload: T,
}
```

| 字段 | 类型 | 来源 | 约束 |
|---|---|---|---|
| `outbox_id` | `WorkOutboxId` | `WorkOutboxRecord.outbox_id` | 不等于 bus event id |
| `event_version` | `EventSchemaVersion` | `EventSchemaVersion::v1()` contracts helper | 与 topic major 版本一致;P0 outbound 只发布 `v1` |
| `trace_context_ref` | `WorkTraceContextRef` | `WorkTraceRecord` / metadata | 必填 |
| `occurred_at` | `Timestamp` | `ClockPort.now()` or truth change time | 必填 |

#### 10.4 Outbound Event payload schema

```rust
/// Project change event payload.
pub struct ProjectChangedEvent {
    /// Changed project.
    pub project_ref: ProjectRef,
    /// Current lifecycle state.
    pub lifecycle_state: ProjectLifecycleState,
    /// Change reason.
    pub reason: ProjectLifecycleReason,
}

/// Backlog availability change event payload.
pub struct BacklogChangedEvent {
    /// Changed backlog.
    pub backlog_ref: BacklogRef,
    /// Owning project.
    pub project_ref: ProjectRef,
    /// Current backlog availability state.
    pub backlog_state: BacklogState,
    /// Maintenance reason for lock / reopen availability transitions.
    pub reason: BacklogMaintenanceReason,
}

/// Project member change event payload.
pub struct ProjectMemberChangedEvent {
    /// Changed project member.
    pub project_member_ref: ProjectMemberRef,
    /// Owning project.
    pub project_ref: ProjectRef,
    /// Referenced identity member.
    pub member_ref: GlobalMemberRef,
    /// Current responsibility state.
    pub responsibility_state: ProjectMemberResponsibilityState,
}

/// Formal work change event payload.
pub struct WorkItemChangedEvent {
    /// Changed formal work.
    pub work_ref: FormalWorkRef,
    /// Owning project.
    pub project_ref: ProjectRef,
    /// Current work state.
    pub work_state: WorkItemState,
    /// Source reference when relevant.
    pub source_ref: Option<SourceWorkRef>,
    /// Completion evidence when relevant.
    pub evidence_ref: Option<ExternalEvidenceRef>,
}

/// Promote result event payload.
pub struct PromoteResultRecordedEvent {
    /// Promote result reference.
    pub promote_result_ref: PromoteResultRef,
    /// Source that was reviewed.
    pub source_ref: SourceWorkRef,
    /// Current promote state.
    pub result_state: PromoteResultState,
    /// Created formal work when accepted.
    pub created_work_ref: Option<FormalWorkRef>,
}

/// Dependency change event payload.
pub struct WorkDependencyChangedEvent {
    /// Changed dependency.
    pub dependency_ref: WorkDependencyRef,
    /// Upstream work.
    pub upstream_work_ref: FormalWorkRef,
    /// Downstream work.
    pub downstream_work_ref: FormalWorkRef,
    /// Current dependency state.
    pub dependency_state: DependencyState,
}

/// Blocker change event payload.
pub struct WorkBlockerChangedEvent {
    /// Changed blocker.
    pub blocker_ref: WorkBlockerRef,
    /// Blocked work.
    pub blocked_work_ref: FormalWorkRef,
    /// Current blocker state.
    pub blocker_state: BlockerState,
    /// Evidence when resolved; sourced from WorkBlocker.resolved_evidence_ref.
    pub evidence_ref: Option<ExternalEvidenceRef>,
}

/// Iteration change event payload.
pub struct IterationChangedEvent {
    /// Changed iteration.
    pub iteration_ref: IterationRef,
    /// Owning project.
    pub project_ref: ProjectRef,
    /// Current iteration state.
    pub iteration_state: IterationState,
    /// Current commitment state when available.
    pub commitment_state: Option<CommitmentState>,
    /// Affected formal work refs.
    pub affected_work_refs: Vec<FormalWorkRef>,
}

/// Trace availability event payload.
pub struct WorkTraceAvailableEvent {
    /// Trace subject.
    pub subject_ref: WorkTraceSubjectRef,
    /// Trace record id.
    pub trace_id: WorkTraceId,
    /// Optional handoff reference.
    pub handoff_ref: Option<TraceHandoffRef>,
}

/// Derived view change event payload.
pub struct DerivedWorkViewChangedEvent {
    /// Changed derived view.
    pub view_ref: DerivedWorkViewRef,
    /// Current freshness state.
    pub freshness_state: DerivedFreshnessState,
    /// Source cursor covered by the view.
    pub source_cursor: WorkTruthCursor,
}
```

| Event | topic | 发布方 | 消费方 | payload 字段来源 |
|---|---|---|---|---|
| `ProjectChanged` | `work.project.changed.v1` | outbox publisher | SDK / workspace / process / archive | `Project` + lifecycle reason |
| `BacklogChanged` | `work.backlog.changed.v1` | outbox publisher | SDK / workspace / process / archive | `Backlog` + `BacklogMaintenanceReason` |
| `ProjectMemberChanged` | `work.project_member.changed.v1` | outbox publisher | member-service / runtime / workspace | `ProjectMember` |
| `WorkItemChanged` | `work.formal_work.changed.v1` | outbox publisher | process / governance / artifact / workspace | `WorkItem` / `ChildWorkItem` |
| `PromoteResultRecorded` | `work.promote_result.recorded.v1` | outbox publisher | runtime / conversation / artifact | `PromoteResult` |
| `WorkDependencyChanged` | `work.dependency.changed.v1` | outbox publisher | workspace / process / governance | `WorkDependency` |
| `WorkBlockerChanged` | `work.blocker.changed.v1` | outbox publisher | workspace / governance / artifact | `WorkBlocker` |
| `IterationChanged` | `work.iteration.changed.v1` | outbox publisher | process / workspace / runtime | `Iteration` / `IterationCommitment` |
| `WorkTraceAvailable` | `work.trace.available.v1` | outbox publisher | observability / archive | `WorkTraceRecord` / handoff job |
| `DerivedWorkViewChanged` | `work.derived_view.changed.v1` | outbox publisher | workspace / SDK | `DerivedWorkViewState` |

#### 10.5 Event 到对象闭环

| Event | 目标 / 来源对象 | 必填字段是否齐全 | 派生字段来源 | 缺失行为 |
|---|---|---|---|---|
| inbound identity | `MemberCapabilitySnapshot` | 是 | `ReferenceResolutionState` from payload ref + timestamp | dead-letter |
| inbound method | `MethodDefinitionSnapshot` | 是 | `ReferenceResolutionState` from payload ref + timestamp | dead-letter |
| inbound conversation / runtime | `SourceWorkRef` reference state / pending promote | 是 | source resolver / clock | unresolved / dead-letter |
| inbound process | process reference state | 是 | resolver / clock | unresolved |
| inbound governance / artifact | `ExternalEvidenceRef` reference state | 是 when evidence present | evidence resolver / clock | unresolved / dead-letter |
| outbound truth changed | `WorkOutboxRecord` -> event payload | 是 | `ClockPort` / trace context | publication failed -> mark failed |
| outbound derived changed | `DerivedWorkViewState` -> event payload | 是 | projection rebuild / stale marker | publication failed -> mark failed |

### 11. Operations Job 协议契约

#### 11.1 Job shared DTO

```rust
/// Stable id for one operations job run.
pub struct JobRunId(pub String);

/// Selects which Work projections a rebuild job should replace.
pub enum WorkProjectionSet {
    /// Rebuild every project-scoped projection.
    All,
    /// Rebuild only project board views.
    ProjectBoard,
    /// Rebuild only member work views.
    MemberWork,
    /// Rebuild only iteration summary views.
    IterationSummary,
    /// Rebuild only search projection rows.
    Search,
}

/// Scope for refreshing external references.
pub struct ExternalReferenceScope {
    /// Scope kind.
    pub scope_kind: ExternalReferenceScopeKind,
    /// Project scope when the kind is project-scoped.
    pub project_ref: Option<ProjectRef>,
    /// Explicit reference refs when the kind is explicit.
    pub reference_refs: Vec<ExternalReferenceRef>,
}

/// External reference refresh scope kind.
pub enum ExternalReferenceScopeKind {
    /// Refresh stale references selected by repository.
    StaleOnly,
    /// Refresh references related to one project.
    Project,
    /// Refresh explicitly listed references.
    ExplicitRefs,
}

/// Scope for reconciliation jobs.
pub struct WorkReconciliationScopeRef {
    /// Scope kind.
    pub scope_kind: WorkReconciliationScopeKind,
    /// Project scope when applicable.
    pub project_ref: Option<ProjectRef>,
    /// Derived view scope when applicable.
    pub view_ref: Option<DerivedWorkViewRef>,
    /// External reference scope when applicable.
    pub reference_ref: Option<ExternalReferenceRef>,
}

/// Reconciliation scope kind.
pub enum WorkReconciliationScopeKind {
    /// Inspect all Work reconciliation surfaces.
    All,
    /// Inspect one project.
    Project,
    /// Inspect one derived view.
    DerivedView,
    /// Inspect one external reference.
    ExternalReference,
}

/// Target for trace handoff.
pub struct TraceHandoffTargetRef {
    /// Target kind.
    pub target_kind: TraceHandoffTargetKind,
    /// External pointer for the target.
    pub external_ref: ExternalSourceRef,
}

/// Trace handoff target kind.
pub enum TraceHandoffTargetKind {
    /// Observability trace store.
    Observability,
    /// Archive handoff boundary.
    Archive,
    /// Safe diagnostic store.
    Diagnostic,
}

/// Scope prepared for archive handoff.
pub struct ArchiveHandoffScope {
    /// Scope kind.
    pub scope_kind: ArchiveHandoffScopeKind,
    /// Work subjects included in the scope.
    pub subject_refs: Vec<WorkTraceSubjectRef>,
    /// Optional truth cursor covered by this handoff.
    pub source_cursor: Option<WorkTruthCursor>,
}

/// Archive handoff scope kind.
pub enum ArchiveHandoffScopeKind {
    /// Archive selected Work subjects.
    Subjects,
    /// Archive a project up to the supplied cursor.
    ProjectCursor,
}

/// Target for archive handoff.
pub struct ArchiveHandoffTargetRef {
    /// Target kind.
    pub target_kind: ArchiveHandoffTargetKind,
    /// External pointer for the target.
    pub external_ref: ExternalSourceRef,
}

/// Archive handoff target kind.
pub enum ArchiveHandoffTargetKind {
    /// General archive boundary.
    ArchiveStore,
    /// Compliance export boundary.
    ComplianceExport,
}

/// Common metadata for Work operations jobs.
pub struct WorkJobMetadata {
    /// Job run id.
    pub job_run_id: JobRunId,
    /// Actor running the job.
    pub actor: ActorContext,
    /// Idempotency metadata for the job.
    pub command_metadata: CommandMetadata,
}

/// Common report returned by Work jobs.
pub struct WorkJobReport {
    /// Job run id.
    pub job_run_id: JobRunId,
    /// Shared write receipt when the job wrote local state.
    pub receipt: Option<WorkCommandReceipt>,
    /// Number of records scanned.
    pub scanned_count: u64,
    /// Number of records changed.
    pub changed_count: u64,
    /// Failed item refs that require retry or inspection.
    pub failed_refs: Vec<ExternalReferenceRef>,
}
```

| 字段 | 类型 | 来源 | 约束 |
|---|---|---|---|
| `job_run_id` | `JobRunId` | job trigger | trim 后非空;同一 retry 保持稳定 |
| `actor` | `ActorContext` | job trigger | system / operator actor |
| `command_metadata` | `CommandMetadata` | job trigger | `request.idempotency_key` 必填 |
| `failed_refs` | `Vec<ExternalReferenceRef>` | job processing | 不包含外部正文 |
| `projection_set` | `WorkProjectionSet` | rebuild job input | `All` 表示 board / member / iteration / search 全部重建 |
| `reference_scope` | `Option<ExternalReferenceScope>` | refresh job input | `None` 表示 stale refs;`ExplicitRefs` 必须非空 |
| `scope_ref` | `WorkReconciliationScopeRef` | reconciliation job input | kind 与对应 optional ref 必须匹配 |
| `target_ref` | `TraceHandoffTargetRef` | trace handoff job input | 只保存目标引用 |
| `archive_scope` | `ArchiveHandoffScope` | archive handoff job input | `subject_refs` 必须非空 |
| `archive_target_ref` | `ArchiveHandoffTargetRef` | archive handoff job input | 只保存 archive boundary ref |

#### 11.2 Job input / output schema

```rust
/// Publishes pending Work outbox records.
pub struct PublishWorkOutboxJobInput {
    /// Common job metadata.
    pub metadata: WorkJobMetadata,
    /// Page request for pending outbox records.
    pub page: PageRequest,
}

/// Rebuilds derived Work projections from committed truth.
pub struct RebuildWorkProjectionsJobInput {
    /// Common job metadata.
    pub metadata: WorkJobMetadata,
    /// Project scope to rebuild.
    pub project_ref: ProjectRef,
    /// Projection set to rebuild.
    pub projection_set: WorkProjectionSet,
}

/// Refreshes external reference snapshots.
pub struct RefreshExternalReferenceSnapshotsJobInput {
    /// Common job metadata.
    pub metadata: WorkJobMetadata,
    /// Optional reference scope; absent means stale references.
    pub reference_scope: Option<ExternalReferenceScope>,
    /// Page request for references.
    pub page: PageRequest,
}

/// Runs reconciliation over Work truth, projections, outbox, and references.
pub struct RunWorkReconciliationJobInput {
    /// Common job metadata.
    pub metadata: WorkJobMetadata,
    /// Reconciliation scope.
    pub scope_ref: WorkReconciliationScopeRef,
}

/// Prepares trace handoff to observability or archive consumers.
pub struct PrepareWorkTraceHandoffJobInput {
    /// Common job metadata.
    pub metadata: WorkJobMetadata,
    /// Trace subject scope.
    pub subject_ref: WorkTraceSubjectRef,
    /// Handoff target.
    pub target_ref: TraceHandoffTargetRef,
}

/// Prepares archive handoff markers.
pub struct PrepareArchiveHandoffJobInput {
    /// Common job metadata.
    pub metadata: WorkJobMetadata,
    /// Archive scope.
    pub archive_scope: ArchiveHandoffScope,
    /// Archive target.
    pub archive_target_ref: ArchiveHandoffTargetRef,
}
```

| Job | trigger | Input | Output | 幂等要求 | 允许写入 |
|---|---|---|---|---|---|
| `PublishWorkOutbox` | `work.jobs.publish_outbox` | `PublishWorkOutboxJobInput` | `WorkJobReport` | `metadata.command_metadata.request.idempotency_key` 必填 | outbox publication state |
| `RebuildWorkProjections` | `work.jobs.rebuild_projections` | `RebuildWorkProjectionsJobInput` | `WorkJobReport` | 必填 | projection views + freshness |
| `RefreshExternalReferenceSnapshots` | `work.jobs.refresh_references` | `RefreshExternalReferenceSnapshotsJobInput` | `WorkJobReport` | 必填 | snapshots + reference state |
| `RunWorkReconciliation` | `work.jobs.reconcile` | `RunWorkReconciliationJobInput` | `ReconciliationReport` | 必填 | reconciliation report / markers |
| `PrepareWorkTraceHandoff` | `work.jobs.prepare_trace_handoff` | `PrepareWorkTraceHandoffJobInput` | `WorkJobReport` | 必填 | trace handoff marker / outbox |
| `PrepareArchiveHandoff` | `work.jobs.prepare_archive_handoff` | `PrepareArchiveHandoffJobInput` | `WorkJobReport` | 必填 | archive handoff marker / outbox |

#### 11.3 Job 字段闭环

| Job | 输入字段 | 目标对象 / port | 字段来源 | 缺失处理 |
|---|---|---|---|---|
| `PublishWorkOutbox` | `page` | `WorkOutboxRepository.list_pending` | job input | reject |
| `PublishWorkOutbox` | pending outbox record | `WorkOutboxPublisherPort.publish` | repository | no pending -> report zero |
| `RebuildWorkProjections` | `project_ref`、`projection_set` | `WorkTruthSnapshotRepository`、`ProjectionRepository` | job input | reject |
| `RefreshExternalReferenceSnapshots` | `reference_scope`、`page` | `ReferenceSnapshotRepository` + resolver ports | job input / stale refs | empty scope -> list stale refs |
| `RunWorkReconciliation` | `scope_ref` | `ReconciliationReport` | job input + repositories | reject |
| `PrepareWorkTraceHandoff` | `subject_ref`、`target_ref` | `TraceHandoffPort` | job input + audit repo | reject |
| `PrepareArchiveHandoff` | `archive_scope`、`archive_target_ref` | `ArchiveHandoffPort` | job input + truth repos | reject |

#### 11.4 Reconciliation report schema

```rust
/// Report returned by Work reconciliation jobs.
pub struct ReconciliationReport {
    /// Reconciliation scope.
    pub scope_ref: WorkReconciliationScopeRef,
    /// Truth cursor inspected by the job.
    pub truth_cursor: WorkTruthCursor,
    /// Derived views that are stale, failed, or missing.
    pub projection_gaps: Vec<DerivedWorkViewRef>,
    /// Outbox records requiring retry or inspection.
    pub outbox_gaps: Vec<WorkOutboxId>,
    /// External references requiring refresh.
    pub reference_gaps: Vec<ExternalReferenceRef>,
}
```

| 字段 | 来源 | 约束 |
|---|---|---|
| `scope_ref` | job input | 与 `RunWorkReconciliationJobInput.scope_ref` 一致 |
| `truth_cursor` | `WorkTruthSnapshotRepository.load_truth_cursor(...)` | 不等于 optimistic `Version` |
| `projection_gaps` | projection repository freshness scan | 只含 view refs,job 不直接修复 projection |
| `outbox_gaps` | outbox repository scan | 只含 outbox ids |
| `reference_gaps` | reference repository scan | 只含 external reference refs |

### 12. Protocol Error 映射

```rust
/// Public protocol error returned by Work API, event, and job handlers.
pub enum WorkProtocolError {
    /// Required actor, metadata, idempotency, or body field is missing.
    InvalidRequest,
    /// The caller cannot see or modify the requested resource.
    NotVisible,
    /// The requested Work-owned resource does not exist.
    NotFound,
    /// The requested transition violates Work domain rules.
    DomainRejected,
    /// The expected optimistic version did not match.
    VersionConflict,
    /// The idempotency key was reused with a different request digest.
    IdempotencyConflict,
    /// An external reference could not be resolved.
    ExternalReferenceUnresolved,
    /// An inbound event could not be accepted and must be dead-lettered.
    DeadLetter,
    /// A projection, publisher, repository, or handoff dependency failed.
    TemporarilyUnavailable,
}
```

| 来源错误 / 场景 | `WorkProtocolError` | 同步 Command | Query | Event Consumer | Job |
|---|---|---|---|---|---|
| missing actor / metadata / body | `InvalidRequest` | reject | reject | dead-letter if envelope missing | reject |
| missing command/job idempotency key | `InvalidRequest` | reject | 不适用 | dead-letter / reject | reject |
| repository none | `NotFound` | reject | `QuerySurface::Missing` 或 error by query | unresolved if external ref | report failed |
| authorization / visibility denied | `NotVisible` | reject | `QuerySurface::NotVisible` | 不适用 | reject |
| domain policy rejected | `DomainRejected` | reject | 不适用 | unresolved / rejected marker | report failed |
| repository version conflict | `VersionConflict` | reject | 不适用 | retry / dead-letter by event policy | report failed |
| idempotency digest conflict | `IdempotencyConflict` | reject | 不适用 | dead-letter / conflict marker | reject |
| resolver not found / rejected | `ExternalReferenceUnresolved` | reject | degraded / missing | save failed / unresolved state | report failed |
| unsupported event version | `DeadLetter` | 不适用 | 不适用 | dead-letter | 不适用 |
| store / publisher / handoff unavailable | `TemporarilyUnavailable` | rollback / retry | failed surface | retry | report failed / retry |

### 13. DTO / Event / Job 到 Domain 对象构造闭环汇总

| 输入契约 | 目标 Domain 对象 | 必填字段是否齐全 | 派生字段来源 | 不得混同字段 | 缺失时行为 | 后续处理流 |
|---|---|---|---|---|---|---|
| `CreateProjectRequest` | `Project`、`Backlog` | 是 | id generator、actor、metadata | owner ref != project ref | reject | Step 9 |
| `UpdateProjectLifecycleRequest` | `Project` | 是 | repository lookup、domain transition | target != state | reject | Step 9 |
| `AssignProjectMemberRequest` | `ProjectMember`、`MemberCapabilitySnapshot` | 是 | id generator、member resolver | global member != project member | reject / unresolved | Step 9 |
| `CreateWorkItemRequest` | `WorkItem` | 是 | id generator、backlog lookup、source resolver | source ref != formal work ref | reject | Step 9 |
| `CreateChildWorkItemRequest` | `ChildWorkItem` | 是 | id generator、parent lookup | child work != runtime step | reject | Step 9 |
| `UpdateWorkItemLifecycleRequest` | `WorkItem` / `ChildWorkItem` | 是 | evidence resolver when required | evidence ref != source ref | reject | Step 9 |
| `RequestWorkPromotionRequest` | `PromoteResult` | 是 | id generator、source resolver | promote result ref != created work ref | reject | Step 9 |
| `ReviewWorkPromotionRequest` | `PromoteResult`、optional work truth | 是 | id generator on accept;reject reason from `PromoteReviewDecision::Reject(reason)` | accept decision requires intent;reject decision forbids accepted intent | reject | Step 9 |
| dependency / blocker requests | `WorkDependency`、`WorkBlocker` | 是 | ids、graph snapshot、evidence resolver | dependency ref != blocker ref | reject | Step 9 |
| iteration requests | `Iteration`、`IterationCommitment` | 是 | id generator、timebox resolver、work lookup | process timebox != iteration | reject | Step 9 |
| query requests | public view DTO | 是 | repository / projection mapping | repository `Page<T>` != public page | surface marker | Step 9 |
| inbound events | snapshots / reference state / pending intake | 是 | event envelope、resolver、clock | source event id != outbox id | retry / dead-letter | Step 9 |
| outbound events | event payload from outbox | 是 | committed truth / trace / clock | outbox id != bus event id | publish failed marker | Step 9 |
| jobs | reports / projection / handoff markers | 是 | job metadata、repositories、ports | job id != idempotency key | reject / report failed | Step 9 |

### 14. 审计、幂等和可观测性要求

| 协议类别 | 幂等要求 | 审计 / trace | outbox | 备注 |
|---|---|---|---|---|
| Command | `CommandMetadata.request.idempotency_key` 必填 | 核心 truth 写成功必须写 trace / audit | truth changed 必须 enqueue | duplicate 通过 `CommandResultRepository` 返回既有 result |
| Query | 不要求 idempotency | 不写 audit,可读 trace | 不写 outbox | 不触发 rebuild |
| Inbound Event | `source_event_id + topic + source_ref` dedup | snapshot / pending 写入可写 trace | 仅必要时 enqueue derived changed | 不直接创建 WorkItem |
| Outbound Event | outbox id 驱动 publication | 使用已有 trace_context_ref | publisher 只发布 | 失败 mark failed |
| Operations Job | job metadata idempotency key 必填 | 写本地状态时写 trace / report | handoff / derived change 可 enqueue | 不修 business truth |

### 15. 设计取舍

| 取舍 | 结论 | 理由 |
|---|---|---|
| Command / Query metadata 是否在 body 重复承载 | 不重复 | core `CommandMetadata` / `QueryMetadata` 已有 request、trace、idempotency、page、consistency |
| HTTP route 是否绑定具体 framework | 否,只写 logical route | Step 8 只定协议面,实现框架留实施计划 |
| Query projection missing 是否自动 rebuild | 否 | Query no-write,返回 `Rebuilding` / `Missing` / `Stale` surface |
| Event consumer 是否直接创建 WorkItem | 否 | 必须回到 promote / formalize command 边界 |
| Public query page 是否复用 application `Page<T>` | 否,映射为 `PublicPageInfo` | 避免 application helper 泄漏为 public DTO |
| outbound event 是否携带外部正文 | 否 | 只传播 Work truth summary / refs / state |

### 16. 回填草稿

正式 `03-详细设计.md` §7 可引用本文件以下内容:

- §6 共享协议约束
- §7 协议总表
- §8 Command 协议契约
- §9 Query 协议契约
- §10 Event 协议契约
- §11 Operations Job 协议契约
- §12 Protocol Error 映射
- §13 DTO / Event / Job 到 Domain 构造闭环汇总
- §14 审计、幂等和可观测性要求

正式文档整理必须保留校准来源:

```text
协议契约来源: `projects/L1-work/design-calibration/03_ddd_step_08_protocol_contracts.md`。
```

### 17. 待确认事项

| 待确认事项 | 影响 | 处理口径 |
|---|---|---|
| 具体 HTTP framework、route binding、auth middleware | `api` 实现 | Step 14 / 实施计划补 |
| bus 产品、consumer group、retry / DLQ 参数 | `worker` 实现 | Step 14 / Step 15 补 |
| durable store schema 和 index | repository / query performance | Step 11 补 |

### 18. 进入下一步条件

```text
所有需要实现的协议入口都有明确签名、schema、错误映射、处理方和 DTO 到目标对象构造闭环。
Command、Query、Inbound Event、Outbound Event 和 Operations Job 均有字段级协议契约。
可以进入 Step 9,逐接口定义函数级处理流。
```
