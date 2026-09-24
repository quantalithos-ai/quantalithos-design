# Step 8. 定义 API / Command / Query / Event / Job 协议契约

> 对应 SOP：`standards/document/详细设计讨论流程_SOP.md` Step 8  
> 回填章节：未来正式 `03-详细设计.md` §7；本 Step 不修改正式文档  
> 参考框架：`projects/L1-governance/design-calibration/03_ddd_step_08_protocol_contracts.md`  
> 生成日期：2026-09-20  
> 状态：`completed_with_upstream_blockers`  
> 物理实现状态：`blocked`；本文中的类型和签名是语言中立的 Rust-like contract notation，不证明 Rust、crate、transport 或实现仓已经存在

---

## 1. Step 状态与开工确认

| 项 | 当前值 |
|---|---|
| current_document | `03-详细设计.md` calibration |
| current_step | Step 8 |
| current_module | `protocol_contracts` |
| gate_status | `pass_for_step_09_logic` |
| gate_reason | 11 Command、12 Query、4 planned Consumer、0 Outbound Event、5 Job 均形成字段级、可回指对象/port/flow 的协议；exact owner schema 和物理 transport 继续 blocked。 |
| formal_03_write_allowed | `false_until_step_19` |
| implementation_write_allowed | `false` |
| next_allowed_action | 读取 Step 9 SOP/规范与 L1-governance Step 9 后创建函数级 flow 中间产物 |
| commit_required | `false` |

本 Step 的输入门禁已经满足：Step 6 对象契约与 Step 7 trait/port/adapter 契约均完成逻辑停审；正式 `02-概要设计.md` 的接口目录没有发生变化。`RUN-UP-001~008`、`RUN-DDD-001~003` 继续阻断 exact SDK/client/DTO、正向 adapter readiness、transport 和物理代码布局，但不阻断 Runner 自有 public protocol 的逻辑 schema。

## 2. 本步目标、输入与非目标

### 2.1 目标

把概要设计固定的接口骨架展开为可逐项落码的 transport-neutral 协议：

- shared actor、metadata、page、view、error、result 与 readiness surface；
- 11 个 Command 的 envelope、request、result、字段来源与构造闭环；
- 12 个 Query 的 request、字段级 view/page/marker 与 empty/degraded 口径；
- 4 个 planned Consumer 的 header-first、blocked/unsupported、receipt、dedup/gap 负向协议；
- Outbound Event 的正式“不适用”结论；
- 5 个 Operations Job 的 metadata、input、report、duplicate replay surface；
- Runner semantic DTO 到 Step 7 owner port 的边界，防止把 semantic carrier 冒充已存在的 SDK DTO。

### 2.2 输入

| 输入 | 本 Step 使用内容 | 使用上限 |
|---|---|---|
| 正式 `02-概要设计.md` §7～§10 | 11/12/4/0/5 协议目录、处理主线和状态红线 | 不改变接口数量、truth owner 或 outbound 结论。 |
| `02_hld_step_07_api_interface_skeleton.md` | operation 名、输入输出骨架、required port | 不把 skeleton 名称当已实现类型。 |
| `02_hld_step_08_processing_flows.md` | protocol-to-flow 承接 | 不抢写 Step 9 的函数顺序。 |
| `03_ddd_step_06_object_contracts.md` | 17 个正式对象、shared carriers、entry/worker/job objects | public DTO 不直接泄露 repository version/UoW。 |
| `03_ddd_step_07_trait_port_adapter_contracts.md` | repositories、14 ports、facades、typed outcomes | semantic port DTO 不冒充 owner SDK DTO。 |
| Step 8 SOP / 详细设计书写规范 | 分协议族、逐协议、字段级、停审和跨协议审计要求 | 本文件仅为中间产物。 |

### 2.3 非目标

- 不选择 HTTP、RPC、event bus、desktop IPC、CLI、scheduler 或进程模型；`RUN-DDD-002` 未关闭。
- 不写真实 path、crate、package、source file、数据库、cache backend 或 serialization library。
- 不定义 owner 私有/猜测 DTO，不给 blocked adapter 标 Ready。
- 不定义函数级调用顺序、事务/crash window、完整状态矩阵；分别留 Step 9～11。
- 不创建 Runner outbound event、outbox、publisher 或 topic。
- 不实现代码、不执行测试、不创建 implementation ledger/skeleton、不修改正式 `03-详细设计.md`。

## 3. 分批写入计划与完成状态

| 批次 | 协议族 | 内容 | 状态 |
|---|---|---|---|
| 8.0 | shared | actor/metadata/page/view/result/error/readiness、协议总表 | [x] |
| 8.1-a | Command：selection/material | 6 个 command | [x] |
| 8.1-b | Command：lifecycle/recovery/handoff | 5 个 command | [x] |
| 8.2-a | Query：context/selection/material | 5 个 query | [x] |
| 8.2-b | Query：lifecycle/recovery | 3 个 query | [x] |
| 8.2-c | Query：preview/diagnosis/handoff/read model | 4 个 query | [x] |
| 8.3 | planned inbound | shared header/receipt + 4 个 blocked consumer | [x] |
| 8.4 | outbound | 明确不适用并做无残留审计 | [x] |
| 8.5 | operations | shared metadata/report + 5 个 job | [x] |
| 8.6 | final audit | secondary type、DTO→object/port/flow、blocker 与停审 | [x] |

## 4. SOP 问题回答与协议总纪律

| 问题 | 本仓答案 |
|---|---|
| 本轮定义哪些协议？ | 11 Command、12 Query、4 planned Inbound Consumer、0 Outbound Event、5 Operations Job。 |
| 调用方/处理方是谁？ | GUI/CLI/product shell → `entry` → application facade；future owner adapter → `worker` → application consumer facade；scheduler/operator → `operations` → application job facade。 |
| 传输方式是什么？ | 尚无 authority；仅固定 logical operation key。任何 HTTP/RPC/IPC/topic/CLI 绑定必须在 Step 14 与技术 authority 后完成。 |
| actor 从哪里来？ | Command/Query 来自 trusted inbound boundary；Job 来自 system/operator boundary；Consumer 仅允许 validated trusted-owner-source actor。body 不得自报 actor。 |
| 哪些入口幂等？ | 全部 Command、future Consumer、全部 Job；Query 禁止 idempotency reservation。 |
| Query denied 怎么表达？ | `RunnerViewSurface.visibility` + `body=None/items=[]`；不是 generic error，也不触发 refresh。 |
| unknown 怎么表达？ | 一等 `Unknown` result，带 recovery ref/issue ref；不自动 replay。 |
| Consumer 当前怎么表达？ | header-first readiness 后返回 `Blocked`/`UnsupportedVersion`；不得解析或保存 payload。 |
| owner ACK 能证明什么？ | 只证明相应 request/control/handoff 被接受；不能证明 running、effect confirmed、cleaned、evidence 或 verdict。 |
| page 如何映射？ | public `RunnerPageRequest/RunnerPageInfo` 与 application `RunnerRepositoryPage/Page<T>` 显式转换；cursor 不具 truth/version/order 语义。 |

协议总纪律：

1. `latest`、default、newest、mutable tag、branch、目录最新项在 request schema 中不可表达。
2. Command 只能修改 Runner-owned state 或提交一个正式 owner intent；不得写回 Release/Artifact/Governance/Sandbox/Runtime/Observability truth。
3. Query 始终 no-write；不得 reserve idempotency、refresh、repair、download、verify、reconcile、cleanup 或 handoff。
4. External I/O 不进入 Runner local UoW；本 Step 只固定输入/结果，不决定 Step 9/11 的具体顺序。
5. 所有 body、error、receipt、report 只允许 safe ref/marker/redacted content；不得保存 secret locator、raw log、stack、credential 或 sibling truth body。
6. `Accepted != Running`；`Confirmed stop != Cleaned`；`Releasable != Released/Evicted`；handoff receipt 不是 evidence/report/verdict/signoff。

## 5. 协议总表

### 5.1 Command inventory

| Command | Request DTO | Result DTO | 目标对象 | 主要 port | Step 9 flow |
|---|---|---|---|---|---|
| `SelectRelease` | `SelectReleaseInput` | `ReleaseSelectionResult` | context/generation/selection | context + authority | `FLOW-C01` |
| `InvalidateSelection` | `SelectionInvalidationInput` | `SelectionInvalidationResult` | selection + successor generation | local repositories | `FLOW-C02` |
| `RequestMaterialAcquisition` | `AcquisitionRequestInput` | `AcquisitionRequestResult` | acquisition task | authority + source readiness | `FLOW-C03` |
| `PauseAcquisition` | `AcquisitionControlInput` | `AcquisitionControlResult` | acquisition task | local repositories | `FLOW-C04` |
| `ResumeAcquisition` | `AcquisitionControlInput` | `AcquisitionControlResult` | acquisition task | authority + source | `FLOW-C05` |
| `CancelAcquisition` | `AcquisitionControlInput` | `AcquisitionControlResult` | acquisition task | local repositories | `FLOW-C06` |
| `RequestRun` | `RunRequestInput` | `RunRequestResult` | run intent + owner acceptance ref | Sandbox + Runtime reads | `FLOW-C07` |
| `RequestRunControl` | `RunControlInput` | `RunControlResult` | control intent | Sandbox + Runtime reads | `FLOW-C08` |
| `RequestCleanup` | `CleanupRequestInput` | `CleanupRequestResult` | guard/control/recovery | Sandbox + cache | `FLOW-C09` |
| `OpenManualReview` | `ManualReviewInput` | `ManualReviewResult` | recovery case | local repository | `FLOW-C10` |
| `RequestDiagnosticHandoff` | `DiagnosticHandoffInput` | `DiagnosticHandoffResult` | handoff posture | redaction + Observability | `FLOW-C11` |

### 5.2 Query inventory

| Query | Request DTO | Response body | 读取源 | Step 9 flow |
|---|---|---|---|---|
| `ResolveRunnerContext` | `RunnerContextQueryInput` | `RunnerContextView` | context port/local safe ref | `FLOW-Q01` |
| `ListSelectableReleases` | `ReleaseSelectionQueryInput` | `SelectableReleasePage` | authority safe page | `FLOW-Q02` |
| `GetSelectionPosture` | `SelectionQueryInput` | `SelectionPostureSection` | selection + authority projection | `FLOW-Q03` |
| `GetMaterialPreparation` | `MaterialQueryInput` | `MaterialPostureSection` | task/cache/integrity | `FLOW-Q04` |
| `GetCacheProtection` | `CacheProtectionQueryInput` | `CacheProtectionView` | cache + guard | `FLOW-Q05` |
| `GetRunLifecycle` | `RunLifecycleQueryInput` | `RunPostureSection` | intent/control/owner projection | `FLOW-Q06` |
| `GetResourceCleanupView` | `ResourceCleanupQueryInput` | `ResourceCleanupSection` | observation/guard/recovery | `FLOW-Q07` |
| `GetRecoveryCase` | `RecoveryQueryInput` | `RecoveryCaseView` | recovery repository | `FLOW-Q08` |
| `GetOutputPreview` | `OutputPreviewQueryInput` | `OutputPreviewView` | safe preview repository | `FLOW-Q09` |
| `GetFailureDiagnosis` | `FailureDiagnosisQueryInput` | `FailureDiagnosisView` | diagnosis repository | `FLOW-Q10` |
| `GetHandoffPosture` | `HandoffQueryInput` | `HandoffPostureView` | handoff repository | `FLOW-Q11` |
| `GetRunnerReadModel` | `RunnerReadModelQueryInput` | `RunnerReadModel` | committed safe sections | `FLOW-Q12` |

### 5.3 Consumer / Event / Job inventory

| 类别 | 数量 | 当前 surface |
|---|---:|---|
| planned Inbound Consumer | 4 | header readiness + blocked/unsupported receipt；payload schema unbound |
| Runner Outbound Event | 0 | 明确不适用；无 event/outbox/publisher/topic |
| Operations Job | 5 | typed request、report、stored duplicate replay |

## 6. Shared public protocol helper

### 6.1 Actor、trace 与 metadata

```rust
pub struct TraceRef(pub String);
pub struct RunnerClientRequestRef(pub String);
pub struct RunnerVisibilityContextRef(pub String);
pub struct RunnerProtocolOperationName(pub String);
pub struct RunnerProtocolCommandName(pub String);
pub struct RunnerProtocolQueryName(pub String);
pub struct RunnerProtocolIdempotencyKey(pub String);
pub struct RunnerProtocolResultId(pub String);

pub struct RunnerProtocolResultRef {
    pub operation_name: RunnerProtocolOperationName,
    pub result_id: RunnerProtocolResultId,
}

pub enum RunnerActorAuthorityKind {
    Participant,
    SystemOperator,
    TrustedOwnerSource,
}

pub struct ActorContext {
    pub actor_ref: ActorRef,
    pub session_ref: Option<SessionRef>,
    pub scope_ref: RunnerScopeRef,
    pub authority_kind: RunnerActorAuthorityKind,
    pub visibility_context_ref: RunnerVisibilityContextRef,
}

pub struct RunnerExpectedBasisMarker {
    pub selection_generation: Option<SelectionGenerationNumber>,
    pub authority_ref: Option<AuthoritySnapshotRef>,
    pub owner_basis: Option<OwnerStateBasis>,
    pub source_digest_ref: Option<SourceDigestRef>,
}

pub struct RunnerCommandMetadata {
    pub client_request_ref: RunnerClientRequestRef,
    pub trace_ref: TraceRef,
    pub idempotency_key: RunnerProtocolIdempotencyKey,
    pub issued_at: Timestamp,
    pub expected_basis: RunnerExpectedBasisMarker,
}

pub struct RunnerQueryMetadata {
    pub client_request_ref: RunnerClientRequestRef,
    pub trace_ref: TraceRef,
    pub requested_at: Timestamp,
    pub visibility_context_ref: RunnerVisibilityContextRef,
}
```

| 类型/字段 | 来源 | 约束 |
|---|---|---|
| `ActorContext` | trusted entry/system/owner boundary | body 不得覆盖；Command/Query 不允许 `TrustedOwnerSource`；Consumer 不允许 participant 冒充 source。 |
| `authority_kind` | boundary authentication/registration | 仅表达调用 authority 类别，不授予绕过 visibility、scope、digest、idempotency 或状态 gate。 |
| `TraceRef` | L0/core tracing surface | 仅关联，不是 result/run/event id。exact SDK mapping 受 `RUN-UP-008`。 |
| command idempotency | trusted metadata | 所有 11 Command 必填，包括纯本地状态变更；same key/different stable digest = conflict。 |
| `expected_basis` | caller 已知 basis + application re-read | 可部分为空，但具体 command 的必填项由其协议小节固定；不得用 repository version/cursor 替代。 |
| Query metadata | trusted boundary | 无 write idempotency；page 只在 query body 承载，避免 metadata/body 双承载。 |

### 6.2 Public page、view 与 freshness surface

```rust
pub struct RunnerPageCursor(pub String);

pub struct RunnerPageRequest {
    pub cursor: Option<RunnerPageCursor>,
    pub limit: u32,
}

pub struct RunnerPageInfo {
    pub next_cursor: Option<RunnerPageCursor>,
    pub has_more: bool,
}

pub struct RunnerReadSubjectRef(pub String);
pub struct RunnerProjectionRef(pub String);
pub struct ReadModelGeneration(pub u64);

pub enum RunnerDegradedKind {
    Stale,
    Partial,
    Missing,
    Rebuilding,
    Disabled,
    Unavailable,
    Unsupported,
    Conflict,
}

pub struct RunnerDegradedMarker {
    pub kind: RunnerDegradedKind,
    pub issue_ref: RunnerProtocolIssueRef,
    pub source_owner: Option<SourceOwner>,
}

pub struct RunnerViewSurface {
    pub read_subject_ref: RunnerReadSubjectRef,
    pub projection_ref: Option<RunnerProjectionRef>,
    pub projection_generation: Option<ReadModelGeneration>,
    pub visibility: VisibilityPosture,
    pub freshness: SourceFreshness,
    pub degraded: Option<RunnerDegradedMarker>,
    pub source_attribution: Vec<SourceAttribution>,
}

pub struct RunnerQueryResponse<T> {
    pub query_name: RunnerProtocolQueryName,
    pub surface: RunnerViewSurface,
    pub body: Option<T>,
}

pub struct RunnerPageResponse<T> {
    pub query_name: RunnerProtocolQueryName,
    pub surface: RunnerViewSurface,
    pub page_info: RunnerPageInfo,
    pub items: Vec<T>,
}
```

Public page 映射：`RunnerPageRequest.cursor` 在 application boundary 转为 `RunnerRepositoryCursor`，`limit` 经配置上限校验后转为 `RunnerRepositoryPage.limit`；`Page<T>.next_cursor` 转为 `RunnerPageInfo.next_cursor`，`has_more = next_cursor.is_some()`。两种 cursor 只表示各自 list 的位置，不是 object version、selection generation、owner source order、truth cursor 或 checkpoint。

Query surface 规则：

| 情形 | `body/items` | surface |
|---|---|---|
| visible/current | body 可存在；page 可为空 | Visible/Current；empty page 是成功空集合。 |
| not visible | `body=None`、`items=[]` | Restricted/Unknown/Unavailable + issue；不泄露 existence/body。 |
| stale/partial | 仅返回已允许的 safe body | freshness/degraded 必须显式；不得在 Query 内刷新。 |
| missing | `body=None` 或 empty page | `Missing` marker；不得用 fabricated default object。 |
| rebuilding/disabled/unsupported | body 仅在 policy 允许时保留旧 safe view | 对应 degraded kind；不隐式启动 Job。 |

### 6.3 Command envelope、stored result 与 public outcome

```rust
pub struct RunnerTypedCommandRequest<T> {
    pub actor: ActorContext,
    pub metadata: RunnerCommandMetadata,
    pub command_name: RunnerProtocolCommandName,
    pub body: T,
}

pub enum RunnerReplayPosture {
    Fresh,
    DuplicateReplayed,
}

pub struct RunnerCommandResponse<T> {
    pub command_name: RunnerProtocolCommandName,
    pub result_ref: RunnerProtocolResultRef,
    pub trace_ref: TraceRef,
    pub replay: RunnerReplayPosture,
    pub result: T,
}

pub enum RunnerCommandOutcome<T> {
    Accepted(RunnerCommandResponse<T>),
    Rejected(RunnerProtocolRejection),
    Conflict(RunnerProtocolConflict),
    Unknown(RunnerProtocolUnknown),
}

pub enum RunnerStoredCommandResult {
    SelectRelease(RunnerCommandOutcome<ReleaseSelectionResult>),
    InvalidateSelection(RunnerCommandOutcome<SelectionInvalidationResult>),
    RequestMaterialAcquisition(RunnerCommandOutcome<AcquisitionRequestResult>),
    PauseAcquisition(RunnerCommandOutcome<AcquisitionControlResult>),
    ResumeAcquisition(RunnerCommandOutcome<AcquisitionControlResult>),
    CancelAcquisition(RunnerCommandOutcome<AcquisitionControlResult>),
    RequestRun(RunnerCommandOutcome<RunRequestResult>),
    RequestRunControl(RunnerCommandOutcome<RunControlResult>),
    RequestCleanup(RunnerCommandOutcome<CleanupRequestResult>),
    OpenManualReview(RunnerCommandOutcome<ManualReviewResult>),
    RequestDiagnosticHandoff(RunnerCommandOutcome<DiagnosticHandoffResult>),
}
```

`RunnerStoredCommandResult` 是完整安全 replay surface；duplicate same digest 直接读取对应 variant，保留原 `result_ref` 和语义 outcome，不重跑 domain transition、owner call 或 cleanup。`Rejected/Conflict/Unknown` 也可成为稳定 stored surface；infrastructure consistency defect 才进入 `ApplicationError`。有限 `RunnerCommandRequest` tagged union 在所有 Command body 定义后见 §7.18。

### 6.4 Protocol issue/error surface

```rust
pub struct RunnerProtocolSurfaceRef(pub String);
pub struct RunnerProtocolIssueRef(pub String);
pub struct RunnerProtocolIssueRefSet(pub Vec<RunnerProtocolIssueRef>);

pub enum RunnerProtocolIssueKind {
    InvalidInput,
    MissingRequiredField,
    VisibilityDenied,
    StaleBasis,
    AuthorityBlocked,
    UnsupportedContract,
    DependencyUnavailable,
    IdempotencyConflict,
    VersionConflict,
    SafetyBlocked,
    ConsistencyUnknown,
}

pub struct RunnerProtocolRejection {
    pub surface_ref: RunnerProtocolSurfaceRef,
    pub kind: RunnerProtocolIssueKind,
    pub issue_refs: RunnerProtocolIssueRefSet,
}

pub struct RunnerProtocolConflict {
    pub surface_ref: RunnerProtocolSurfaceRef,
    pub issue_refs: RunnerProtocolIssueRefSet,
    pub recovery_case_ref: Option<RecoveryCaseId>,
}

pub struct RunnerProtocolUnknown {
    pub surface_ref: RunnerProtocolSurfaceRef,
    pub issue_refs: RunnerProtocolIssueRefSet,
    pub recovery_case_ref: RecoveryCaseId,
}
```

错误映射约束：Step 8 固定 public shape；domain/application/adapter 到具体 issue kind/code 的 exhaustive mapping 留 Step 12。Issue ref 必须 redacted/body-free，不得包含 request payload、owner response、URL、token、path、raw log、stack 或 secret。可预期 validation/policy/readiness/basis 失败走 typed outcome；进程崩溃、存储损坏等非协议故障才走 `ApplicationError`。

### 6.5 Logical route / dispatch binding

| family | logical key 格式 | caller | handler | transport binding |
|---|---|---|---|---|
| Command | `runner.command.<CommandName>` | GUI/CLI/product shell | `RunnerEntryDispatchPort` → command facade | pending `RUN-DDD-002` |
| Query | `runner.query.<QueryName>` | GUI/CLI/product shell | `RunnerEntryDispatchPort` → query facade | pending `RUN-DDD-002` |
| Consumer | `runner.consumer.<ConsumerName>` | validated owner adapter/worker | `RunnerWorkerDispatchPort` → consumer facade | planned/blocked |
| Job | `runner.job.<JobName>` | scheduler/operator | `RunnerOperationsDispatchPort` → job facade | pending `RUN-DDD-002` |

Logical key 是稳定 operation mapping，不是 HTTP path、RPC method、topic、CLI flag 或 executable name；不得据此声称某 transport 已存在。

### 6.6 Public binding、owner basis 与 bounded-ref helper

```rust
pub struct RunnerSelectionBinding {
    pub release_ref: ReleaseRef,
    pub version_ref: ArtifactVersionRef,
    pub scope_ref: RunnerScopeRef,
    pub generation: SelectionGenerationNumber,
}

pub struct RunnerMaterialBinding {
    pub selection: RunnerSelectionBinding,
    pub digest_ref: Option<SourceDigestRef>,
}

pub struct RunnerQualifiedMaterialBinding {
    pub cache_entry_ref: CacheEntryRef,
    pub integrity_posture_ref: IntegrityPostureRef,
    pub source_binding: RunnerMaterialBinding,
    pub authority_ref: AuthoritySnapshotRef,
    pub authority_freshness: SourceFreshness,
}

pub struct RunnerLocalReleaseReceipt {
    pub cache_entry_ref: CacheEntryRef,
    pub material_handle: LocalMaterialHandle,
    pub released_at: Timestamp,
    pub release_basis_ref: OwnerResolutionRef,
}

pub struct OwnerSubjectRef(pub String);
pub struct OwnerSourceVersionRef(pub String);
pub struct SandboxReceiptRef(pub String);
pub struct OwnerResultRef(pub String);
pub struct OwnerResultRefSet(pub Vec<OwnerResultRef>);

pub struct OwnerStateBasis {
    pub subject_ref: OwnerSubjectRef,
    pub sandbox_request_ref: Option<SandboxRequestRef>,
    pub boundary_ref: Option<SandboxBoundaryRef>,
    pub runtime_run_ref: Option<RuntimeRunRef>,
    pub lease_ref: Option<OwnerLeaseRef>,
    pub source_version_ref: Option<OwnerSourceVersionRef>,
}

pub struct OwnerCleanupBasis {
    pub owner_state_basis: OwnerStateBasis,
    pub cleanup_ref: Option<CleanupRef>,
    pub protection_guard_ref: ProtectionGuardRef,
}

pub enum ControlIntentKind {
    Start,
    Stop,
    Cancel,
    CleanupRequest,
}

pub struct ResourceKey(pub String);

pub struct RunnerRequestedResource {
    pub resource_key: ResourceKey,
    pub requested_amount: Option<u64>,
    pub unit: Option<String>,
}

pub struct RunnerRequestedResourceSet(pub Vec<RunnerRequestedResource>);

pub enum ProtectedSubjectRef {
    CacheEntry(CacheEntryRef),
    RunIntent(RunIntentId),
    LocalMaterial(LocalMaterialHandle),
}

pub struct SafeHandoffMaterialRef(pub String);
pub struct SafeHandoffMaterialRefSet(pub Vec<SafeHandoffMaterialRef>);
pub struct HandoffTargetRef(pub String);
pub struct HandoffCommandMetadata {
    pub trace_ref: TraceRef,
    pub idempotency_key: RunnerProtocolIdempotencyKey,
    pub issued_at: Timestamp,
    pub expected_basis: RunnerExpectedBasisMarker,
}
pub struct AcquisitionControlReasonRef(pub String);
pub struct ManualReviewReasonRef(pub String);

pub enum RunnerLocalObjectRef {
    Context(RunnerContextId),
    Selection(RunnerSelectionId),
    AcquisitionTask(AcquisitionTaskRef),
    CacheEntry(CacheEntryRef),
    IntegrityPosture(IntegrityPostureRef),
    RunIntent(RunIntentId),
    ControlIntent(ControlIntentRef),
    ProtectionGuard(ProtectionGuardRef),
    RecoveryCase(RecoveryCaseId),
    OutputPreview(OutputPreviewRef),
    FailureDiagnosis(FailureDiagnosisRef),
    Handoff(DiagnosticHandoffId),
}

pub struct RunnerCommandChangeSummary {
    pub changed_refs: Vec<RunnerLocalObjectRef>,
    pub changed_count: u64,
    pub recovery_case_refs: Vec<RecoveryCaseId>,
}
```

| Helper | 构造来源 | 不变量 |
|---|---|---|
| `RunnerQualifiedMaterialBinding` | 由 application 将 matching `MaterialCacheEntry` + `IntegrityPosture` + current authority read 显式映射为 public contract | 任一 selection/digest/generation/authority 漂移即不可用于 run；不含 bytes/path；不得直接序列化 domain `QualifiedMaterialBinding`。 |
| `OwnerStateBasis` | formal Sandbox/Runtime safe read | optional 字段表示该轴正式不存在/未建立，不得用 PID、端口、socket 或 ACK 补齐。 |
| `OwnerCleanupBasis` | current owner read + current `ProtectionGuard` | 只允许 cleanup flow 使用；不证明 owner/local release 已完成。 |
| `RunnerRequestedResourceSet` | explicit bounded product request | key 必须来自受支持 taxonomy；空/重复/越界由 protocol reject；不表示 allocation/reservation。 |
| `ProtectedSubjectRef` | persisted local object/ref | enum branch 不得用字符串 prefix 猜测。 |
| `SafeHandoffMaterialRefSet` | mandatory `RedactionPort` safe output | ordered unique、bounded；不得装入 raw log/material ref。 |
| `HandoffCommandMetadata` | `RunnerCommandMetadata` 的逐字段安全映射 | 保留同一 trace/key/issued-at/expected basis；不得为handoff生成第二个幂等身份。 |
| `RunnerCommandChangeSummary` | committed Runner-local write set | bounded refs/counters；不等 global audit/evidence，也不返回 owner body。 |

`OwnerStateBasis`、Sandbox/Runtime/Observability posture 的 exact SDK serialization 仍受 `RUN-UP-003~005/008`；上表只固定 Runner semantic contract，不能被标记为已存在的 upstream DTO。

Public/application nominal mapping：`RunnerProtocolOperationName`、`RunnerProtocolIdempotencyKey`、`RunnerProtocolResultRef` 分别逐字段映射为 application-only `RunnerOperationName`、`RunnerOperationIdempotencyKey`、`RunnerApplicationResultRef`，反向返回 public result 时再映射回来；不得重生成 id、拼接字符串或改变 operation name。`AcquisitionTaskRef`、`CacheEntryRef`、`IntegrityPostureRef`、`ControlIntentRef`、`ProtectionGuardRef`、`OutputPreviewRef`、`FailureDiagnosisRef` 只经 Step 6 §7.1.1 nominal conversion 定位对应 repository `*Id`，转换本身不授权 visibility/scope 访问。

## 7. Command API protocol

所有 Command 的 logical handler 统一返回：

```rust
Result<RunnerCommandOutcome<T>, ApplicationError>
```

各 variant 的 typed envelope 为 `RunnerTypedCommandRequest<Input>`；entry dispatch 的有限 `RunnerCommandRequest` 见 §7.18。Entry 从 trusted boundary 构造 `ActorContext` 和 metadata；body 不携带 actor、trace、idempotency 或 transport route。稳定 digest 覆盖 command name、actor/scope identity、expected basis 与 body 的稳定字段，排除 timestamp、trace、request ref 和随机 id。

### 7.1 Selection / material Command 定义批次表

| 协议 | 所属模块 | 目标对象 | 依赖 port/repository | 后续 flow | 状态 |
|---|---|---|---|---|---|
| `SelectRelease` | context/selection | context、generation、selection | context/authority + selection repos | `FLOW-C01` | closed for logic |
| `InvalidateSelection` | context/selection | selection、successor、affected local refs | selection/material/intent/recovery repos | `FLOW-C02` | closed for logic |
| `RequestMaterialAcquisition` | material | acquisition task | selection/authority/task repos | `FLOW-C03` | positive adapter blocked |
| `PauseAcquisition` | material | acquisition task | task repo | `FLOW-C04` | closed for logic |
| `ResumeAcquisition` | material | acquisition task | authority/source + task repo | `FLOW-C05` | positive adapter blocked |
| `CancelAcquisition` | material | acquisition task | task repo | `FLOW-C06` | closed for logic |

### 7.2 Shared selection/material request and result schemas

```rust
pub struct SelectReleaseInput {
    pub requested_scope_ref: RunnerScopeRef,
    pub platform_ref: PlatformContextRef,
    pub release_ref: ReleaseRef,
    pub version_ref: ArtifactVersionRef,
    pub change_cause: SelectionChangeCause,
}

pub struct ReleaseSelectionResult {
    pub context_id: RunnerContextId,
    pub selection_id: RunnerSelectionId,
    pub binding: RunnerSelectionBinding,
    pub authority_ref: Option<AuthoritySnapshotRef>,
    pub state: SelectionState,
    pub invalidation_reason: Option<SelectionInvalidation>,
    pub change_summary: RunnerCommandChangeSummary,
}

pub struct SelectionInvalidationInput {
    pub selection_id: RunnerSelectionId,
    pub expected_generation: SelectionGenerationNumber,
    pub reason: SelectionInvalidation,
}

pub struct SelectionInvalidationResult {
    pub selection_id: RunnerSelectionId,
    pub invalidated_state: SelectionState,
    pub reason: SelectionInvalidation,
    pub successor_generation: SelectionGenerationNumber,
    pub change_summary: RunnerCommandChangeSummary,
}

pub struct AcquisitionRequestInput {
    pub selection_id: RunnerSelectionId,
    pub expected_binding: RunnerSelectionBinding,
    pub expected_authority_ref: AuthoritySnapshotRef,
}

pub struct AcquisitionRequestResult {
    pub task_ref: AcquisitionTaskRef,
    pub selection_binding: RunnerSelectionBinding,
    pub state: AcquisitionState,
    pub locator_ref: Option<ExternalLocatorRef>,
    pub change_summary: RunnerCommandChangeSummary,
}

pub enum AcquisitionControlIntent {
    Pause { reason_ref: AcquisitionControlReasonRef },
    Resume,
    Cancel { reason_ref: AcquisitionControlReasonRef },
}

pub struct AcquisitionControlInput {
    pub task_ref: AcquisitionTaskRef,
    pub expected_binding: RunnerSelectionBinding,
    pub intent: AcquisitionControlIntent,
}

pub struct AcquisitionControlResult {
    pub task_ref: AcquisitionTaskRef,
    pub selection_binding: RunnerSelectionBinding,
    pub state: AcquisitionState,
    pub progress: Option<TransferProgress>,
    pub recovery_case_ref: Option<RecoveryCaseId>,
    pub change_summary: RunnerCommandChangeSummary,
}
```

### 7.3 `SelectRelease`

| 项 | 契约 |
|---|---|
| 函数签名 | `select_release(RunnerOperationContext, SelectReleaseInput) -> Result<RunnerCommandOutcome<ReleaseSelectionResult>, ApplicationError>` |
| logical key | `runner.command.SelectRelease` |
| 调用/处理 | participant → entry → `RunnerCommandApplicationService` |
| actor/scope | Participant；`actor.scope_ref == requested_scope_ref` 或 formal context resolver 明确映射；body 自报无效。 |
| 幂等 | required；same key + same exact release/version/scope/basis replay。 |

| 输入字段 | 目标/查表 | 来源 | 缺失/非法处理 |
|---|---|---|---|
| `requested_scope_ref` | context resolver + selection scope | explicit UI/CLI/product choice | reject；不得用 project/route/default scope 补齐。 |
| `platform_ref` | `RunnerContextResolutionQuery` | trusted platform boundary | reject/unsupported；不得探测后静默换平台。 |
| `release_ref` | `ReleaseSelection.release_ref` | explicit selectable item/ref | reject；`latest/default/tag/branch` 不能反序列化为该类型。 |
| `version_ref` | `ReleaseSelection.version_ref` | explicit immutable version | reject；不得由 Release ref 推导“当前版”。 |
| `change_cause` | `SelectionGeneration.cause` | command intent | `Initial/UserChange` only；source/context invalidation 由专门 flow 产生。 |

构造闭环：`ContextReadPort.resolve_context` → generated `RunnerContextId` → `RunnerContextRef::from_resolution`；local allocator 产生 successor generation；`ReleaseSelection::select` 接收 exact refs；`ReleaseAuthorityReadPort.assess_exact_release` 只决定 `Checking/Current/Blocked` 和 authority ref。结果 `Current` 仍不表示 material qualified 或 run allowed。Authority unavailable/unsupported 返回 `Rejected(AuthorityBlocked)` 或保存明确 Blocked posture；不得用 cache 历史批准。

### 7.4 `InvalidateSelection`

| 项 | 契约 |
|---|---|
| 函数签名 | `invalidate_selection(RunnerOperationContext, SelectionInvalidationInput) -> Result<RunnerCommandOutcome<SelectionInvalidationResult>, ApplicationError>` |
| logical key | `runner.command.InvalidateSelection` |
| actor | Participant/system operator within resolved selection scope；不允许 trusted-source body 直接调用 public Command。 |
| 幂等 | required；旧 generation 与原因进入 stable digest。 |

`selection_id` 必须加载 versioned selection；`expected_generation` 必须等于当前对象 generation；`reason` 必须与 source/context/generation事实一致。Application 原子分配 successor 并调用 `ReleaseSelection.invalidate`，再以 bounded pages 标记旧材料/intent stale/invalidated。若任一外部副作用曾 Unknown，只在 `change_summary.recovery_case_refs` 中关联 RecoveryCase，不声称撤销 owner truth。Generation mismatch → `Conflict`，不得失效新 generation。

### 7.5 `RequestMaterialAcquisition`

| 项 | 契约 |
|---|---|
| 函数签名 | `request_material_acquisition(RunnerOperationContext, AcquisitionRequestInput) -> Result<RunnerCommandOutcome<AcquisitionRequestResult>, ApplicationError>` |
| logical key | `runner.command.RequestMaterialAcquisition` |
| actor/scope | Participant；input binding scope 必须等于 actor/context scope。 |
| 幂等 | required；selection id + complete binding + authority ref 进入 digest。 |

字段闭环：load selection → `assert_binding` → `ReleaseAuthorityReadPort.revalidate_authority` → generated task id → `AcquisitionTask::start`. Command 只建立 persisted task，最多记录正式 safe locator ref；它不下载 bytes、不返回 `Verified/Qualified`。`expected_binding`、authority ref、Current approval/baseline/lifecycle posture任一不可证明 → blocked/rejected；`RUN-UP-001/002/008` 未关闭时正向 source/authority path不得声称 ready。

### 7.6 `PauseAcquisition`

| 项 | 契约 |
|---|---|
| 函数签名 | `pause_acquisition(RunnerOperationContext, AcquisitionControlInput) -> Result<RunnerCommandOutcome<AcquisitionControlResult>, ApplicationError>` |
| logical key | `runner.command.PauseAcquisition` |
| input discriminator | `intent` 必须是 `Pause { reason_ref }`，否则 reject operation/body mismatch。 |
| 幂等 | required；同一 task/binding/reason replay。 |

加载 task 与 optimistic version，校验 `expected_binding`，调用 `AcquisitionTask.pause` 后保存。Pause 只改变本地 task posture；不得把 worker/process signal当 transfer-safe checkpoint，也不得释放 quarantine/material。已完成/失败/取消 task 的 pause 走 rejected/conflict，而不是 generic accepted no-op。

### 7.7 `ResumeAcquisition`

| 项 | 契约 |
|---|---|
| 函数签名 | `resume_acquisition(RunnerOperationContext, AcquisitionControlInput) -> Result<RunnerCommandOutcome<AcquisitionControlResult>, ApplicationError>` |
| logical key | `runner.command.ResumeAcquisition` |
| input discriminator | `intent=Resume`；Pause/Cancel variant rejected。 |
| 幂等 | required；task/binding/current authority basis 固定。 |

Resume 必须重新读取 selection/authority、校验 source attribution/resume marker 与 exact binding，才调用 `AcquisitionTask.resume`。Source/authority stale、revoked、expired、conflict、unsupported 或 unavailable → blocked/stale，不恢复 transfer。它不以 byte offset、旧 locator、file exists 或网络恢复作为授权；ambiguous existing transfer → `Unknown` + RecoveryCase，不启动第二条 transfer。

### 7.8 `CancelAcquisition`

| 项 | 契约 |
|---|---|
| 函数签名 | `cancel_acquisition(RunnerOperationContext, AcquisitionControlInput) -> Result<RunnerCommandOutcome<AcquisitionControlResult>, ApplicationError>` |
| logical key | `runner.command.CancelAcquisition` |
| input discriminator | `intent=Cancel { reason_ref }`；其他 variant rejected。 |
| 幂等 | required。 |

Cancel 对 matching task 调用 `AcquisitionTask.cancel`。结果 `Cancelled` 只表示本地取得意图终止；不删除 quarantine/cache bytes、不标 Evicted、不解除 protection，也不证明 source transport 已停止。若 transfer outcome不明，返回 `Unknown` 并冻结到 RecoveryCase，而不是用 Cancelled 掩盖。

### 7.9 Selection/material Command 协议族停审

| 审查项 | 结论 | 缺口/修正 |
|---|---|---|
| 6 个 DTO 可构造目标对象 | pass | context/generation/selection/task factory 与 transition均有字段。 |
| implicit selector | unrepresentable | exact release/version/scope/generation；无 string selector。 |
| transfer/integrity/qualification分轴 | pass | request/control result只返回 acquisition state。 |
| actor/metadata/idempotency | pass | shared envelope + per-operation discriminator/basis。 |
| secondary public type | pass | §6.6 + §7.2 已闭合。 |
| owner exact schema | blocked as intended | `RUN-UP-001/002/008`；semantic DTO 不是 readiness。 |
| Step 9 flow | ready | `FLOW-C01~C06` 可逐项展开。 |

### 7.10 Lifecycle / recovery / handoff Command 定义批次表

| 协议 | 目标对象 | 依赖 port/repository | 后续 flow | 状态 |
|---|---|---|---|---|
| `RequestRun` | run intent + owner request ref | context/authority/cache/guard/Sandbox | `FLOW-C07` | positive adapter blocked |
| `RequestRunControl` | control intent | Sandbox/Runtime + local repos | `FLOW-C08` | positive adapter blocked |
| `RequestCleanup` | guard/control/recovery | Sandbox/cache + local repos | `FLOW-C09` | positive adapter blocked |
| `OpenManualReview` | recovery case | recovery repo | `FLOW-C10` | closed for logic |
| `RequestDiagnosticHandoff` | handoff posture | diagnosis/redaction/Observability | `FLOW-C11` | positive adapter blocked |

### 7.11 Lifecycle/recovery/handoff request and result schemas

```rust
pub struct RunRequestInput {
    pub context_id: RunnerContextId,
    pub selection_id: RunnerSelectionId,
    pub selection_binding: RunnerSelectionBinding,
    pub material_binding: RunnerQualifiedMaterialBinding,
    pub requested_resources: RunnerRequestedResourceSet,
}

pub struct RunRequestResult {
    pub run_intent_id: RunIntentId,
    pub state: RunIntentState,
    pub sandbox_request_ref: Option<SandboxRequestRef>,
    pub owner_basis: Option<OwnerStateBasis>,
    pub recovery_case_ref: Option<RecoveryCaseId>,
    pub change_summary: RunnerCommandChangeSummary,
}

pub struct RunControlInput {
    pub run_intent_id: RunIntentId,
    pub kind: ControlIntentKind,
    pub expected_owner_basis: OwnerStateBasis,
}

pub struct RunControlResult {
    pub control_intent_ref: ControlIntentRef,
    pub run_intent_id: RunIntentId,
    pub kind: ControlIntentKind,
    pub state: ControlIntentState,
    pub owner_result_ref: Option<ControlResultRef>,
    pub recovery_case_ref: Option<RecoveryCaseId>,
    pub change_summary: RunnerCommandChangeSummary,
}

pub struct CleanupRequestInput {
    pub run_intent_id: RunIntentId,
    pub protected_subject: ProtectedSubjectRef,
    pub guard_ref: ProtectionGuardRef,
    pub expected_cleanup_basis: OwnerCleanupBasis,
}

pub enum OwnerCleanupPosture {
    NotRequested,
    Accepted,
    Confirmed,
    Rejected,
    Conflict,
    Unknown,
}

pub struct CleanupRequestResult {
    pub control_intent_ref: ControlIntentRef,
    pub protected_subject: ProtectedSubjectRef,
    pub guard_ref: ProtectionGuardRef,
    pub guard_state: ProtectionState,
    pub cleanup_ref: Option<CleanupRef>,
    pub owner_cleanup_posture: OwnerCleanupPosture,
    pub local_release_receipt: Option<RunnerLocalReleaseReceipt>,
    pub recovery_case_ref: Option<RecoveryCaseId>,
    pub change_summary: RunnerCommandChangeSummary,
}

pub struct ManualReviewInput {
    pub recovery_case_id: RecoveryCaseId,
    pub expected_state: RecoveryState,
    pub reason_ref: ManualReviewReasonRef,
}

pub struct ManualReviewResult {
    pub recovery_case_id: RecoveryCaseId,
    pub state: RecoveryState,
    pub reason_ref: ManualReviewReasonRef,
    pub change_summary: RunnerCommandChangeSummary,
}

pub struct DiagnosticHandoffInput {
    pub diagnosis_ref: FailureDiagnosisRef,
    pub material_refs: SafeHandoffMaterialRefSet,
    pub target_ref: HandoffTargetRef,
}

pub struct DiagnosticHandoffResult {
    pub handoff_id: DiagnosticHandoffId,
    pub diagnosis_ref: FailureDiagnosisRef,
    pub state: HandoffState,
    pub receipt_ref: Option<HandoffReceiptRef>,
    pub visibility: VisibilityPosture,
    pub freshness: SourceFreshness,
    pub recovery_case_ref: Option<RecoveryCaseId>,
    pub change_summary: RunnerCommandChangeSummary,
}
```

### 7.12 `RequestRun`

| 项 | 契约 |
|---|---|
| 函数签名 | `request_run(RunnerOperationContext, RunRequestInput) -> Result<RunnerCommandOutcome<RunRequestResult>, ApplicationError>` |
| logical key | `runner.command.RequestRun` |
| actor/scope | Participant；context/selection/material scope必须完全一致。 |
| 幂等 | required；完整 exact binding、resources、expected basis进入 digest。 |

构造闭环：load context/selection/cache/integrity/guard → 将 public `RunnerSelectionBinding` / `RunnerQualifiedMaterialBinding` 逐字段映射并校验为 domain `SelectionBinding` / `QualifiedMaterialBinding` → re-read authority/platform conflicts → generated id → `RunIntent::create` → local draft/submitting → `SandboxRunPort.request_run`。只有 formal acceptance 可填 `sandbox_request_ref` 并把 intent置 Accepted；response 中没有 `running/success` 字段。Blocked/Unsupported readiness 在 port call 前拒绝；timeout/ambiguous → `Unknown` + recovery，不重放。Requested resources只是请求，不是端口/CPU/内存 allocation truth。

### 7.13 `RequestRunControl`

| 项 | 契约 |
|---|---|
| 函数签名 | `request_run_control(RunnerOperationContext, RunControlInput) -> Result<RunnerCommandOutcome<RunControlResult>, ApplicationError>` |
| logical key | `runner.command.RequestRunControl` |
| supported kinds | `Start/Stop/Cancel`；`CleanupRequest` 必须走 `RequestCleanup`。 |
| 幂等 | required；kind + run intent + full owner basis。 |

`expected_owner_basis` 必须来自最近 formal safe read并在提交前重读；generated control id 构造 `ControlIntent`，随后调用 `SandboxRunPort.request_control`。Accepted 只置 control Accepted；只有 formal read/response明确 effect 才置 Confirmed。Stop Confirmed不等 cleanup、lease released、material evicted；Cancel Confirmed不等 Runtime terminal success。Basis mismatch → Conflict；ambiguous → Unknown + RecoveryCase。

### 7.14 `RequestCleanup`

| 项 | 契约 |
|---|---|
| 函数签名 | `request_cleanup(RunnerOperationContext, CleanupRequestInput) -> Result<RunnerCommandOutcome<CleanupRequestResult>, ApplicationError>` |
| logical key | `runner.command.RequestCleanup` |
| actor/scope | Participant/system operator within formal scope；不允许 UI confirmation绕 guard。 |
| 幂等 | required；subject/guard/full cleanup basis固定。 |

Application 必须重读 lease/capture/handoff/retention/orphan inputs，重新计算 `ProtectionGuard`，只有 Current + Releasable + same cleanup basis 才能建立 cleanup control intent并调用 Sandbox。`owner_cleanup_posture=Confirmed` 仍不自动填 `local_release_receipt`；local release必须再次评估 guard并显式调用 `MaterialCachePort.release_material`。只有 formal local receipt 后才允许 cache metadata进入 Evicted。Protected/Blocked/Unknown、stale或缺字段均不调用 cleanup/release。

### 7.15 `OpenManualReview`

| 项 | 契约 |
|---|---|
| 函数签名 | `open_manual_review(RunnerOperationContext, ManualReviewInput) -> Result<RunnerCommandOutcome<ManualReviewResult>, ApplicationError>` |
| logical key | `runner.command.OpenManualReview` |
| actor | Participant/system operator with resolved visibility; no trusted-source exception. |
| 幂等 | required；case/state/reason固定。 |

加载 versioned RecoveryCase，要求 current state与`expected_state`一致且属于 Frozen/Querying/Conflict 等允许集合，调用 `require_manual_review` 后保存。ManualReview 不是 override：它不改变 selection/material/owner projection，不允许 replay、cleanup或release，也不关闭 case。Missing case → rejected/missing；state mismatch → conflict。

### 7.16 `RequestDiagnosticHandoff`

| 项 | 契约 |
|---|---|
| 函数签名 | `request_diagnostic_handoff(RunnerOperationContext, DiagnosticHandoffInput) -> Result<RunnerCommandOutcome<DiagnosticHandoffResult>, ApplicationError>` |
| logical key | `runner.command.RequestDiagnosticHandoff` |
| actor/scope | Participant；diagnosis/material/target visibility必须由 formal resolver允许。 |
| 幂等 | required；diagnosis + ordered safe material refs + target固定。 |

加载 current safe diagnosis；每个 `SafeHandoffMaterialRef` 必须能回指 mandatory redaction/validation结果，禁止 raw fallback；generated handoff id + metadata构造 `HandoffPosture::prepare`，再调用 `ObservabilityHandoffPort.submit`。Accepted/Delivered response只更新 local handoff state和receipt ref；schema不存在 evidence/report/verdict/signoff字段。Unknown → RecoveryCase且不自动 resend；`RUN-UP-005/008` 未关闭时正向提交保持 blocked。

### 7.17 Lifecycle/recovery/handoff Command 协议族停审

| 审查项 | 结论 | 缺口/修正 |
|---|---|---|
| 5 个 DTO 构造闭环 | pass | run/control/guard/recovery/handoff factory/transition字段齐全。 |
| accepted/running 分离 | pass | result无 running推导；Runtime只在Query/projection读取。 |
| stop/cleanup/release/evict 分离 | pass | 四个字段/阶段独立。 |
| unknown/replay | pass | mandatory recovery ref；禁止自动 replay/resend。 |
| handoff/evidence | pass | public result无 evidence/report/verdict/signoff。 |
| exact owner adapter | blocked as intended | `RUN-UP-003~005/007/008`。 |
| Step 9 flow | ready | `FLOW-C07~C11` 可展开。 |

### 7.18 Command route/result audit

```rust
pub enum RunnerCommandRequest {
    SelectRelease(RunnerTypedCommandRequest<SelectReleaseInput>),
    InvalidateSelection(RunnerTypedCommandRequest<SelectionInvalidationInput>),
    RequestMaterialAcquisition(RunnerTypedCommandRequest<AcquisitionRequestInput>),
    PauseAcquisition(RunnerTypedCommandRequest<AcquisitionControlInput>),
    ResumeAcquisition(RunnerTypedCommandRequest<AcquisitionControlInput>),
    CancelAcquisition(RunnerTypedCommandRequest<AcquisitionControlInput>),
    RequestRun(RunnerTypedCommandRequest<RunRequestInput>),
    RequestRunControl(RunnerTypedCommandRequest<RunControlInput>),
    RequestCleanup(RunnerTypedCommandRequest<CleanupRequestInput>),
    OpenManualReview(RunnerTypedCommandRequest<ManualReviewInput>),
    RequestDiagnosticHandoff(RunnerTypedCommandRequest<DiagnosticHandoffInput>),
}
```

Union variant、`command_name` 和实际 body type 必须三者一致；不一致在 entry validation 时 rejected，不进入 idempotency reservation。这个 finite union 是 `RunnerEntryDispatchPort.dispatch_command` 的 request type，开放泛型 envelope不得直接进入dispatch。

| Command | Envelope | Stored variant | 预期 protocol failure |
|---|---|---|---|
| all 11 | `RunnerCommandRequest` 同名 variant | §6.3 同名 variant | invalid/missing→Rejected；same key/different digest或basis→Conflict；ambiguous side effect/storage→Unknown；fresh/duplicate→Accepted。 |

Command accepted transaction必须保存完整 `RunnerStoredCommandResult` 后完成 idempotency record；duplicate返回原 result ref/surface。当前无 outbound event/outbox，Command accepted不得附带伪造 event refs。

## 8. Query API protocol

所有 Query 使用：

```rust
pub struct RunnerTypedQueryRequest<T> {
    pub actor: ActorContext,
    pub metadata: RunnerQueryMetadata,
    pub query_name: RunnerProtocolQueryName,
    pub body: T,
}
```

Query handler 返回 `Result<RunnerQueryResponse<T>, ApplicationError>` 或 `Result<RunnerPageResponse<T>, ApplicationError>`。所有 request 中只放定位/过滤/page 字段；actor、trace、visibility context只在 envelope metadata承载。Query 不产生 stored result、不使用 idempotency、不写 trace/outbox、不更新 last-used、不修复 projection。有限 `RunnerQueryRequest` dispatch union 在所有 Query body定义后见 §8.25。

### 8.1 Public owner/read posture secondary types

```rust
pub enum AuthorityApprovalPosture {
    Approved,
    NotApproved,
    Revoked,
    Expired,
    Conflict,
    Unknown,
    Unsupported,
}

pub enum AuthorityBaselinePosture {
    Baselined,
    NotBaselined,
    Revoked,
    Expired,
    Conflict,
    Unknown,
    Unsupported,
}

pub enum AuthorityLifecyclePosture {
    Active,
    Revoked,
    Expired,
    Superseded,
    Conflict,
    Unknown,
    Unsupported,
}

pub enum OwnerRequestPosture {
    NotSubmitted,
    Accepted,
    Rejected,
    Unknown,
}

pub enum OwnerExecutionPosture {
    NotStarted,
    Starting,
    Running,
    Stopping,
    Stopped,
    Succeeded,
    Failed,
    Cancelled,
    Unknown,
}

pub enum OwnerControlPosture {
    None,
    Accepted,
    Confirmed,
    Rejected,
    Conflict,
    Unknown,
}

pub enum OwnerLeasePosture {
    Absent,
    Active,
    Released,
    Protected,
    Conflict,
    Unknown,
}

pub enum LocalFreshness {
    Current,
    Stale,
    Unknown,
}

pub struct OutputSourceRef(pub String);
pub struct OutputSourceRefSet(pub Vec<OutputSourceRef>);
pub struct SourceFailureRef(pub String);
pub struct SourceFailureRefSet(pub Vec<SourceFailureRef>);
pub struct DiagnosticSubjectRef(pub String);
pub struct DiagnosticSubjectRefSet(pub Vec<DiagnosticSubjectRef>);

pub enum TruncationPosture {
    Complete,
    TruncatedByContentBound,
    TruncatedByVisibility,
    NoVisibleContent,
}

pub enum DigestCheckResult {
    Passed,
    Failed,
    Unknown,
    Unsupported,
}

pub enum SignatureCheckResult {
    Passed,
    Failed,
    NotRequiredByOwnerPolicy,
    Unknown,
    Unsupported,
}

pub enum PlatformCompatibilityResult {
    Compatible,
    Incompatible,
    Unknown,
    Unsupported,
}

pub enum CaptureProtectionPosture {
    Clear,
    Active,
    Unknown,
}

pub enum HandoffProtectionPosture {
    Clear,
    Active,
    Unknown,
}

pub enum RetentionProtectionPosture {
    Clear,
    Protected,
    Unknown,
}

pub enum OrphanProtectionPosture {
    Clear,
    Investigating,
    Protected,
    Unknown,
}

pub enum RunnerPreviewSafetyPosture {
    Safe,
    Restricted,
    Unavailable,
    Blocked,
}

pub enum RunnerFailureClass {
    Authority,
    Material,
    Resource,
    Request,
    Execution,
    Control,
    Cleanup,
    Connectivity,
    Handoff,
    Uncertain,
}

pub enum RunnerFailureImpact {
    BlockedBeforeSideEffect,
    FrozenPendingReconcile,
    ExplicitOwnerFailure,
    PresentationDegraded,
    UnknownImpact,
}

pub enum RunnerSafeNextStep {
    RetryRead,
    Reselect,
    Reverify,
    Reconcile,
    ManualReview,
    ContactOwner,
    None,
}

pub enum RunnerDiagnosisCertainty {
    Supported,
    Partial,
    Uncertain,
}
```

这些 enum 是 Runner semantic projection vocabulary，不是声称 Artifact/Governance/Sandbox/Runtime 已发布同名 enum。Adapter 只能从正式 safe owner surface映射；无法无损映射就返回 `Unknown/Unsupported`，不得靠 HTTP code、ACK、PID、端口、socket或本地日志猜值。

其中 `RunnerPreviewSafetyPosture`、`RunnerFailureClass`、`RunnerFailureImpact`、`RunnerSafeNextStep` 与 `RunnerDiagnosisCertainty` 是 contracts-owned public view enum。Application 必须从 Step 6 domain 的 `PreviewSafetyPosture`、`FailureClass`、`FailureImpact`、`SafeNextStep`、`DiagnosisCertainty` 逐 variant 映射；未知新增 variant 必须使该 view unavailable/unsupported 并携带 issue ref，禁止透传 domain enum、按 ordinal 映射或降级为字符串。

### 8.2 Context / selection / material Query 定义批次表

| Query | Response | repository/port | no-write flow | 状态 |
|---|---|---|---|---|
| `ResolveRunnerContext` | `RunnerContextView` | ContextReadPort + context repo | `FLOW-Q01` | closed |
| `ListSelectableReleases` | `SelectableReleasePage` | ReleaseAuthorityReadPort | `FLOW-Q02` | positive source blocked |
| `GetSelectionPosture` | `SelectionPostureSection` | selection repo + authority safe projection | `FLOW-Q03` | closed for logic |
| `GetMaterialPreparation` | `MaterialPostureSection` | task/cache/integrity repos | `FLOW-Q04` | closed |
| `GetCacheProtection` | `CacheProtectionView` | cache/guard repos | `FLOW-Q05` | closed |

### 8.3 Context / selection / material request schemas

```rust
pub struct RunnerContextQueryInput {
    pub requested_scope_ref: Option<RunnerScopeRef>,
    pub platform_ref: PlatformContextRef,
}

pub struct ReleaseSelectionQueryInput {
    pub scope_ref: RunnerScopeRef,
    pub page: RunnerPageRequest,
}

pub struct SelectionQueryInput {
    pub selection_id: Option<RunnerSelectionId>,
    pub context_id: Option<RunnerContextId>,
}

pub struct MaterialQueryInput {
    pub selection_id: Option<RunnerSelectionId>,
    pub task_ref: Option<AcquisitionTaskRef>,
    pub cache_entry_ref: Option<CacheEntryRef>,
}

pub struct CacheProtectionQueryInput {
    pub cache_entry_ref: CacheEntryRef,
    pub guard_ref: Option<ProtectionGuardRef>,
}
```

Union定位规则：`SelectionQueryInput` 恰有一个 locator；`MaterialQueryInput` 恰有一个 locator；违反即 protocol rejection。Resolver从 locator/load结果得到 canonical read subject/scope，不能从 ref字符串、route或page cursor推导。`ReleaseSelectionQueryInput`没有 sort-by-latest/default/tag/branch字段；page item顺序不构成默认选择。

### 8.4 Context / selection / material view schemas

```rust
pub struct RunnerContextView {
    pub context_id: Option<RunnerContextId>,
    pub actor_ref: ActorRef,
    pub session_ref: SessionRef,
    pub project_ref: Option<ProjectRef>,
    pub scope_ref: RunnerScopeRef,
    pub platform_ref: PlatformContextRef,
    pub source_freshness: SourceFreshness,
    pub visibility: VisibilityPosture,
    pub source_attribution: SourceAttribution,
}

pub struct SelectableReleaseView {
    pub release_ref: ReleaseRef,
    pub version_ref: ArtifactVersionRef,
    pub authority_ref: AuthoritySnapshotRef,
    pub approval_posture: AuthorityApprovalPosture,
    pub baseline_posture: AuthorityBaselinePosture,
    pub lifecycle_posture: AuthorityLifecyclePosture,
    pub source_digest_ref: Option<SourceDigestRef>,
    pub freshness: SourceFreshness,
    pub visibility: VisibilityPosture,
    pub source_attribution: SourceAttribution,
}

pub type SelectableReleasePage = RunnerPageResponse<SelectableReleaseView>;

pub struct SelectionPostureSection {
    pub selection_id: RunnerSelectionId,
    pub context_id: RunnerContextId,
    pub binding: RunnerSelectionBinding,
    pub state: SelectionState,
    pub authority_ref: Option<AuthoritySnapshotRef>,
    pub approval_posture: AuthorityApprovalPosture,
    pub baseline_posture: AuthorityBaselinePosture,
    pub lifecycle_posture: AuthorityLifecyclePosture,
    pub invalidation_reason: Option<SelectionInvalidation>,
    pub surface: RunnerViewSurface,
}

pub struct MaterialPostureSection {
    pub selection_binding: RunnerSelectionBinding,
    pub task_ref: Option<AcquisitionTaskRef>,
    pub acquisition_state: Option<AcquisitionState>,
    pub transfer_progress: Option<TransferProgress>,
    pub cache_entry_ref: Option<CacheEntryRef>,
    pub cache_state: Option<MaterialCacheState>,
    pub integrity_posture_ref: Option<IntegrityPostureRef>,
    pub integrity_state: Option<IntegrityState>,
    pub manifest_ref: Option<ManifestRef>,
    pub source_digest_ref: Option<SourceDigestRef>,
    pub digest_result: Option<DigestCheckResult>,
    pub signature_result: Option<SignatureCheckResult>,
    pub platform_result: Option<PlatformCompatibilityResult>,
    pub authority_freshness: SourceFreshness,
    pub surface: RunnerViewSurface,
}

pub struct CacheProtectionView {
    pub cache_entry_ref: CacheEntryRef,
    pub material_state: MaterialCacheState,
    pub eviction_candidate: EvictionCandidatePosture,
    pub active_guard_ref: Option<ProtectionGuardRef>,
    pub protection_state: ProtectionState,
    pub owner_lease_posture: OwnerLeasePosture,
    pub capture_posture: CaptureProtectionPosture,
    pub handoff_posture: HandoffProtectionPosture,
    pub retention_posture: RetentionProtectionPosture,
    pub orphan_posture: OrphanProtectionPosture,
    pub freshness: SourceFreshness,
    pub surface: RunnerViewSurface,
}
```

| View | 构造来源 | Empty/degraded | 禁止事项 |
|---|---|---|---|
| `RunnerContextView` | formal context resolution；可选 committed local id | resolution unavailable则 body None | 不返回profile/token/project body；Query不持久化新context。 |
| `SelectableReleaseView` | one `ReleaseAuthorityAssessment` safe summary | empty page合法；blocked source用degraded/empty | 不返回“第一项=默认”；unknown authority不可列为可运行。 |
| `SelectionPostureSection` | persisted selection + attributed authority safe view | authority stale可保留local selection并标 degraded | local state不能改写approval/baseline truth。 |
| `MaterialPostureSection` | matching task/cache/integrity records | optional表示该轴尚未建立或当前locator无法唯一定位；missing用marker | `acquisition_state=None`不得解释为Absent；Complete不推Verified；Verified不推Qualified。 |
| `CacheProtectionView` | cache metadata + current guard + formal lease projection | missing/stale input => protection Unknown | Candidate/Releasable不能显示为Evicted/Released。 |

### 8.5 `ResolveRunnerContext`

签名：`resolve_runner_context(context, RunnerContextQueryInput) -> RunnerQueryResponse<RunnerContextView>`；logical key `runner.query.ResolveRunnerContext`。`platform_ref`必填，scope可为空以请求formal resolution；若body scope存在必须和envelope actor scope/正式resolution一致。Query可以调用`ContextReadPort.resolve_context`，但不得生成/保存`RunnerContextId`，不得创建selection；context id只有已存在matching local record时返回。

### 8.6 `ListSelectableReleases`

签名：`list_selectable_releases(context, ReleaseSelectionQueryInput) -> SelectableReleasePage`；logical key `runner.query.ListSelectableReleases`。映射 `SelectableReleaseQuery` → `RunnerSemanticRead<Page<SelectableReleaseSummary>>`，然后逐item补充正式 approval/baseline/lifecycle semantic posture；无法取得完整可选择条件的item不得伪装为selectable。`RUN-UP-001/002/008`使正向exact page映射保持blocked；此时返回Unsupported/Unavailable surface，而不是cache历史列表。

### 8.7 `GetSelectionPosture`

签名：`get_selection_posture(context, SelectionQueryInput) -> RunnerQueryResponse<SelectionPostureSection>`。按selection id或context current index读取，不允许“最新记录”扫描；visibility先由formal resolver取得。Query不调用`bind_authority/invalidate`，不刷新source；stale authority与local selection并列展示。

### 8.8 `GetMaterialPreparation`

签名：`get_material_preparation(context, MaterialQueryInput) -> RunnerQueryResponse<MaterialPostureSection>`。只读matching task/cache/integrity记录；各轴optional/enum保留实际缺口。不得调用source transfer、verifier、cache promotion或更新last-used。Locator、storage handle、bytes、manifest body不进入view。

### 8.9 `GetCacheProtection`

签名：`get_cache_protection(context, CacheProtectionQueryInput) -> RunnerQueryResponse<CacheProtectionView>`。`guard_ref`若给定必须与cache subject index一致；否则通过正式subject index找current guard，不按mtime/last insert。Query不重新evaluate guard、不probe owner、不release protection/material。

### 8.10 Context/selection/material Query 协议族停审

| 审查项 | 结论 |
|---|---|
| 5 request/view字段级schema | pass |
| locator/page identity | pass：exact one-of与opaque cursor |
| view source/freshness/visibility | pass：每个section有surface或显式字段 |
| Query hidden writes | none |
| latest/default/cache fallback | prohibited |
| Step 9承接 | `FLOW-Q01~Q05` ready；owner positive mapping仍blocked |

### 8.11 Lifecycle / resource / recovery Query 定义批次表

| Query | Response | 读取面 | flow |
|---|---|---|---|
| `GetRunLifecycle` | `RunPostureSection` | run/control/projection repos | `FLOW-Q06` |
| `GetResourceCleanupView` | `ResourceCleanupSection` | observation/guard/recovery + safe owner projection | `FLOW-Q07` |
| `GetRecoveryCase` | `RecoveryCaseView` | recovery repo | `FLOW-Q08` |

### 8.12 Lifecycle/resource/recovery request and view schemas

```rust
pub struct RunLifecycleQueryInput {
    pub run_intent_id: RunIntentId,
}

pub struct ResourceCleanupQueryInput {
    pub protected_subject: ProtectedSubjectRef,
}

pub struct RecoveryQueryInput {
    pub recovery_case_id: RecoveryCaseId,
}

pub struct ControlIntentSummaryView {
    pub control_intent_ref: ControlIntentRef,
    pub kind: ControlIntentKind,
    pub state: ControlIntentState,
    pub owner_result_ref: Option<ControlResultRef>,
}

pub struct RunPostureSection {
    pub run_intent_id: RunIntentId,
    pub local_intent_state: RunIntentState,
    pub selection_binding: RunnerSelectionBinding,
    pub sandbox_request_ref: Option<SandboxRequestRef>,
    pub boundary_ref: Option<SandboxBoundaryRef>,
    pub runtime_run_ref: Option<RuntimeRunRef>,
    pub request_posture: OwnerRequestPosture,
    pub execution_posture: OwnerExecutionPosture,
    pub control_posture: OwnerControlPosture,
    pub control_intents: Vec<ControlIntentSummaryView>,
    pub result_refs: OwnerResultRefSet,
    pub owner_basis: Option<OwnerStateBasis>,
    pub surface: RunnerViewSurface,
}

pub struct ResourceObservationView {
    pub observation_id: ResourceObservationId,
    pub resource_key: ResourceKey,
    pub posture: LocalResourcePosture,
    pub observed_at: Timestamp,
    pub freshness: LocalFreshness,
    pub source_attribution: SourceAttribution,
}

pub struct ResourceCleanupSection {
    pub protected_subject: ProtectedSubjectRef,
    pub local_observations: Vec<ResourceObservationView>,
    pub guard_ref: Option<ProtectionGuardRef>,
    pub protection_state: ProtectionState,
    pub owner_lease_posture: OwnerLeasePosture,
    pub capture_posture: CaptureProtectionPosture,
    pub handoff_posture: HandoffProtectionPosture,
    pub retention_posture: RetentionProtectionPosture,
    pub orphan_posture: OrphanProtectionPosture,
    pub owner_cleanup_posture: OwnerCleanupPosture,
    pub cleanup_ref: Option<CleanupRef>,
    pub local_release_receipt: Option<RunnerLocalReleaseReceipt>,
    pub recovery_case_refs: Vec<RecoveryCaseId>,
    pub surface: RunnerViewSurface,
}

pub struct RecoveryCaseView {
    pub recovery_case_id: RecoveryCaseId,
    pub subject_refs: Vec<RunnerLocalObjectRef>,
    pub state: RecoveryState,
    pub expected_basis: RunnerExpectedBasisMarker,
    pub resolution_refs: Vec<OwnerResolutionRef>,
    pub unresolved_posture: Option<ReconcileFailurePosture>,
    pub surface: RunnerViewSurface,
}

pub enum ReconcileFailurePosture {
    ExpectedBasisIncomplete,
    OwnerBasisConflict,
    SourceGap,
    SourceStale,
    VisibilityRestricted,
    DependencyUnavailable,
    UnsupportedContract,
    LocalStateConflict,
    AmbiguousPriorEffect,
}
```

`RecoveryCase.subject_refs` 在domain中使用 `RecoverySubjectRefSet`；public view必须经显式mapping转成允许暴露的`RunnerLocalObjectRef`并丢弃不可见项，不能serialize domain-only union/raw source。`unresolved_posture` 从domain `ReconcileFailure` 逐variant映射；不得临时生成issue ref、使用enum debug字符串或暴露raw error。

### 8.13 `GetRunLifecycle`

签名：`get_run_lifecycle(context, RunLifecycleQueryInput) -> RunnerQueryResponse<RunPostureSection>`。读取 local intent、bounded control list与owner projection；缺owner ref时 request/execution/control必须分别显示`NotSubmitted/NotStarted/None或Unknown`，不能从Accepted intent、PID、端口、socket、health、toast或日志补Running。Stale projection可展示last-known但surface必须Stale且不能用于后续command expected basis。

### 8.14 `GetResourceCleanupView`

签名：`get_resource_cleanup_view(context, ResourceCleanupQueryInput) -> RunnerQueryResponse<ResourceCleanupSection>`。local observations和owner lease/cleanup两类来源并列；冲突用degraded Conflict显式表达，owner truth不被local probe覆盖。Query不执行new probe、guard evaluation、cleanup、release或eviction。

### 8.15 `GetRecoveryCase`

签名：`get_recovery_case(context, RecoveryQueryInput) -> RunnerQueryResponse<RecoveryCaseView>`。只读case/resolution refs；不调用`begin_query/reconcile/close`，不自动启动Reconcile Job。ManualReview/Closed均不表示owner success；not visible时body为空且不泄露subject/ref existence。

### 8.16 Lifecycle/resource/recovery Query 协议族停审

| 审查项 | 结论 |
|---|---|
| owner多轴是否压平 | no：request/execution/control/lease/cleanup分离 |
| local/owner双视图 | pass |
| recovery query side effect | none |
| stale last-known授权 | prohibited |
| Step 9承接 | `FLOW-Q06~Q08` ready |

### 8.17 Preview / diagnosis / handoff / read-model Query 定义批次表

| Query | Response | 读取面 | flow |
|---|---|---|---|
| `GetOutputPreview` | `OutputPreviewView` | preview repo | `FLOW-Q09` |
| `GetFailureDiagnosis` | `FailureDiagnosisView` | diagnosis/recovery repos | `FLOW-Q10` |
| `GetHandoffPosture` | `HandoffPostureView` | handoff repo | `FLOW-Q11` |
| `GetRunnerReadModel` | `RunnerReadModel` | committed safe section repo | `FLOW-Q12` |

### 8.18 Preview/diagnosis/handoff/read-model request schemas

```rust
pub struct OutputPreviewQueryInput {
    pub preview_ref: Option<OutputPreviewRef>,
    pub subject_ref: Option<DiagnosticSubjectRef>,
}

pub struct FailureDiagnosisQueryInput {
    pub diagnosis_ref: Option<FailureDiagnosisRef>,
    pub subject_refs: Option<DiagnosticSubjectRefSet>,
}

pub struct HandoffQueryInput {
    pub handoff_id: DiagnosticHandoffId,
}

pub struct RunnerReadModelQueryInput {
    pub subject_ref: RunnerReadSubjectRef,
    pub expected_generation: Option<ReadModelGeneration>,
}
```

Preview/diagnosis request各恰有一种locator；subject lookup使用正式index，不按“latest file/record”扫描。`expected_generation`只做stale响应判断，不触发refresh，也不是selection generation/repository version。

### 8.19 Preview/diagnosis/handoff/read-model view schemas

```rust
pub struct OutputPreviewView {
    pub preview_ref: OutputPreviewRef,
    pub source_refs: OutputSourceRefSet,
    pub content: RedactedBoundedContent,
    pub safety: RunnerPreviewSafetyPosture,
    pub truncation: TruncationPosture,
    pub generated_at: Timestamp,
    pub surface: RunnerViewSurface,
}

pub struct FailureDiagnosisView {
    pub diagnosis_ref: FailureDiagnosisRef,
    pub subject_refs: DiagnosticSubjectRefSet,
    pub source_failure_refs: SourceFailureRefSet,
    pub classification: RunnerFailureClass,
    pub impact: RunnerFailureImpact,
    pub next_step: RunnerSafeNextStep,
    pub certainty: RunnerDiagnosisCertainty,
    pub diagnosed_at: Timestamp,
    pub surface: RunnerViewSurface,
}

pub struct HandoffPostureView {
    pub handoff_id: DiagnosticHandoffId,
    pub diagnosis_ref: FailureDiagnosisRef,
    pub material_refs: SafeHandoffMaterialRefSet,
    pub target_ref: HandoffTargetRef,
    pub state: HandoffState,
    pub receipt_ref: Option<HandoffReceiptRef>,
    pub surface: RunnerViewSurface,
}

pub struct PreviewDiagnosisSection {
    pub preview: Option<OutputPreviewView>,
    pub diagnosis: Option<FailureDiagnosisView>,
    pub handoff: Option<HandoffPostureView>,
    pub surface: RunnerViewSurface,
}

pub struct SourceAttributionSet(pub Vec<SourceAttribution>);

pub struct SourceOwnerSet(pub Vec<SourceOwner>);
pub enum RunnerConnectivityReasonPosture {
    DependencyUnavailable,
    SourceStale,
    SourceGap,
    VisibilityRestricted,
    ReconcilePending,
    ReconcileConflict,
    ManualReviewRequired,
    UnsupportedContract,
}

pub struct ConnectivityView {
    pub state: ConnectivityState,
    pub observed_at: Timestamp,
    pub freshness: LocalFreshness,
    pub affected_sources: SourceOwnerSet,
    pub recovery_case_ref: Option<RecoveryCaseId>,
    pub reason: Option<RunnerConnectivityReasonPosture>,
    pub source_attribution: SourceAttribution,
}

pub enum ReadModelAvailability {
    Complete,
    Partial,
    Unavailable,
}

pub struct RunnerReadModelSection<T> {
    pub surface: RunnerViewSurface,
    pub body: Option<T>,
}

pub struct RunnerReadModel {
    pub context: RunnerContextView,
    pub selection: RunnerReadModelSection<SelectionPostureSection>,
    pub material: RunnerReadModelSection<MaterialPostureSection>,
    pub run: RunnerReadModelSection<RunPostureSection>,
    pub resource_cleanup: RunnerReadModelSection<ResourceCleanupSection>,
    pub preview_diagnosis: RunnerReadModelSection<PreviewDiagnosisSection>,
    pub connectivity: RunnerReadModelSection<ConnectivityView>,
    pub source_attribution: SourceAttributionSet,
    pub composition_generation: ReadModelGeneration,
    pub availability: ReadModelAvailability,
}
```

`RunnerReadModel` public schema与Step 6 domain/read composition object同名、语义对齐，但本 public schema 用 `RunnerReadModelSection<T>` 显式承载 partial/unavailable 组合；它不是 domain object 的直接序列化。`body=None` 时 section `surface.degraded` 必须解释 missing/rebuilding/disabled/unavailable；`body=Some` 时 wrapper surface必须与body内surface一致。contracts公开字段只能引用本Step已定义的view types，application必须提供逐字段mapper，不能serialize含domain-only/private字段的对象。

### 8.20 `GetOutputPreview`

签名：`get_output_preview(context, OutputPreviewQueryInput) -> RunnerQueryResponse<OutputPreviewView>`。只读已保存的bounded/redacted projection；`content.redacted`必须为true才可显示value。Restricted/Unavailable/Blocked时value必须None或policy允许的safe clipped value；不得现场抓stdout/stderr、host file、raw log或调用redaction adapter。

### 8.21 `GetFailureDiagnosis`

签名：`get_failure_diagnosis(context, FailureDiagnosisQueryInput) -> RunnerQueryResponse<FailureDiagnosisView>`。只展示已持久化safe diagnosis与refs；不在Query中重新classify/refresh。`certainty=Uncertain`与`next_step=Reconcile/ManualReview`必须保留，不能被UI解释为自动retry。View不是evidence/report/verdict/signoff。

### 8.22 `GetHandoffPosture`

签名：`get_handoff_posture(context, HandoffQueryInput) -> RunnerQueryResponse<HandoffPostureView>`。receipt只作为body-free ref；Accepted/Delivered不生成evidence字段。Unknown不触发resend，Query也不read-reconcile owner；显式Job/Command负责后续动作。

### 8.23 `GetRunnerReadModel`

签名：`get_runner_read_model(context, RunnerReadModelQueryInput) -> RunnerQueryResponse<RunnerReadModel>`。`RunnerReadSectionRepository.load_sources`读取同一stable composition generation的committed safe sections，`RunnerReadModel::compose/redact_for`纯组合。每个section保留自己的surface，顶层`availability`不压平为success/healthy/running。Generation mismatch返回Stale/Conflict marker，不启动`RefreshVisibleSourcesJob`。

### 8.24 Preview/diagnosis/handoff/read-model Query 协议族停审

| 审查项 | 结论 |
|---|---|
| 4 request/view字段级schema | pass |
| raw content fallback | prohibited |
| receipt/evidence边界 | pass |
| read model secondary sections | closed；均有field-level schema |
| projection identity/generation | contracts-owned，stable id generator/repository key来源明确 |
| Query hidden refresh/write | none |
| Step 9承接 | `FLOW-Q09~Q12` ready |

### 8.25 Query family final audit

```rust
pub enum RunnerQueryRequest {
    ResolveRunnerContext(RunnerTypedQueryRequest<RunnerContextQueryInput>),
    ListSelectableReleases(RunnerTypedQueryRequest<ReleaseSelectionQueryInput>),
    GetSelectionPosture(RunnerTypedQueryRequest<SelectionQueryInput>),
    GetMaterialPreparation(RunnerTypedQueryRequest<MaterialQueryInput>),
    GetCacheProtection(RunnerTypedQueryRequest<CacheProtectionQueryInput>),
    GetRunLifecycle(RunnerTypedQueryRequest<RunLifecycleQueryInput>),
    GetResourceCleanupView(RunnerTypedQueryRequest<ResourceCleanupQueryInput>),
    GetRecoveryCase(RunnerTypedQueryRequest<RecoveryQueryInput>),
    GetOutputPreview(RunnerTypedQueryRequest<OutputPreviewQueryInput>),
    GetFailureDiagnosis(RunnerTypedQueryRequest<FailureDiagnosisQueryInput>),
    GetHandoffPosture(RunnerTypedQueryRequest<HandoffQueryInput>),
    GetRunnerReadModel(RunnerTypedQueryRequest<RunnerReadModelQueryInput>),
}
```

Union variant、`query_name` 与 body type必须一致；finite union 是 `RunnerEntryDispatchPort.dispatch_query` 的request type。Page只存在于相应body中，metadata不得重复携带。

| 门禁 | 结果 |
|---|---|
| 12/12 Query独立小节/签名 | pass |
| response body/view/page/marker字段级 | pass |
| empty/not-visible/stale/failed/rebuilding/disabled/missing | shared surface均可表达；`failed`映射Unavailable/Conflict + issue，非伪造empty success |
| page helper mapping | pass |
| read-model/projection ref生成 | `RunnerIdGeneratorPort` + repository explicit key；不得拼接或mtime推导 |
| contracts/domain依赖 | public view只用contracts类型；domain映射显式 |
| no-write | pass |

## 9. Planned Inbound Event Consumer protocol

本节定义的是“当前可实现的安全负向 surface”以及未来启用前必须满足的 envelope shell；它不宣称任何 owner 已发布事件、topic、client 或 payload schema。四类 consumer 在所有 required readiness marker 为 Ready 之前均不得解析 payload、保存 applied marker、更新 projection 或 ACK success。

### 9.1 Consumer 定义批次表

| Consumer | source family | 未来目标 projection | blockers | Step 9 flow |
|---|---|---|---|---|
| `ConsumeReleaseAuthorityChange` | ReleaseAuthority | selection/authority stale/invalidated view | `RUN-UP-001/002/008` | `FLOW-E01` blocked-first |
| `ConsumeSandboxLifecycleChange` | SandboxLifecycle | owner request/boundary/lease/cleanup projection | `RUN-UP-003/007/008` | `FLOW-E02` blocked-first |
| `ConsumeRuntimeStatusChange` | RuntimeStatus | execution/result projection | `RUN-UP-004/008` | `FLOW-E03` blocked-first |
| `ConsumeHandoffChange` | Handoff | handoff/receipt projection | `RUN-UP-005/008` | `FLOW-E04` blocked-first |

### 9.2 Header-first candidate and readiness

```rust
pub struct RunnerConsumerName(pub String);
pub struct RunnerProtocolWorkerEntryRef(pub String);
pub struct RunnerProtocolOwnerEventRef(pub String);
pub struct RunnerProtocolEventSchemaVersion(pub String);
pub struct RunnerOwnerOrderMarker(pub String);
pub struct RunnerConsumerIssueRef(pub String);
pub struct RunnerConsumerIssueRefSet(pub Vec<RunnerConsumerIssueRef>);

pub enum RunnerProtocolConsumerSourceFamily {
    ReleaseAuthority,
    SandboxLifecycle,
    RuntimeStatus,
    Handoff,
}

pub struct RunnerInboundEventHeader {
    pub consumer_name: RunnerConsumerName,
    pub source_family: RunnerProtocolConsumerSourceFamily,
    pub schema_version: RunnerProtocolEventSchemaVersion,
    pub event_ref: Option<RunnerProtocolOwnerEventRef>,
    pub dedup_key: Option<RunnerProtocolIdempotencyKey>,
    pub subject_ref: Option<OwnerSubjectRef>,
    pub source_attribution: Option<SourceAttribution>,
    pub trace_ref: Option<TraceRef>,
}

pub enum RunnerConsumerContractState {
    Ready,
    Blocked,
    Unsupported,
}

pub enum RunnerPublicReadinessState {
    Ready,
    Degraded,
    Unavailable,
    Blocked,
    Unsupported,
}

pub struct RunnerPublicReadinessMarker {
    pub state: RunnerPublicReadinessState,
    pub checked_at: Timestamp,
    pub issue_ref: Option<RunnerProtocolIssueRef>,
}

pub struct RunnerConsumerReadiness {
    pub consumer_name: RunnerConsumerName,
    pub source_family: RunnerProtocolConsumerSourceFamily,
    pub schema_version: RunnerProtocolEventSchemaVersion,
    pub contract_state: RunnerConsumerContractState,
    pub port_readiness: RunnerPublicReadinessMarker,
    pub issue_refs: RunnerConsumerIssueRefSet,
}
```

`RunnerPublicReadinessMarker` 是 contracts-owned public DTO；application把Step 7 `RunnerPortReadinessMarker` 映射到它，移除infra slot/config issue等application-local细节。Header inspection 只允许读取 source family/schema/event identity/dedup identity 等 framing metadata，不允许将 payload bytes 解码成 generic JSON/map。`dedup_key` 只能由正式 framing metadata 提供；不得从 payload hash、event ref、trace、arrival time 或本地计数器推导。当前 `RunnerConsumerReadiness.contract_state` 必须为 `Blocked` 或 `Unsupported`；即使 transport连接成功、消息可见或ACK API存在也不能为 Ready。

### 9.3 Future validated envelope shell and opaque payload boundary

```rust
pub struct RunnerValidatedOwnerEventMetadata {
    pub event_ref: RunnerProtocolOwnerEventRef,
    pub subject_ref: OwnerSubjectRef,
    pub source_attribution: SourceAttribution,
    pub schema_version: RunnerProtocolEventSchemaVersion,
    pub dedup_key: RunnerProtocolIdempotencyKey,
    pub owner_order_marker: RunnerOwnerOrderMarker,
    pub trace_ref: TraceRef,
    pub trusted_source_actor: ActorContext,
}

pub enum RunnerInboundPayloadContract {
    ReleaseAuthorityChangeUnsupported,
    SandboxLifecycleChangeUnsupported,
    RuntimeStatusChangeUnsupported,
    HandoffChangeUnsupported,
}

pub struct ReleaseAuthorityChange;
pub struct SandboxLifecycleChange;
pub struct RuntimeStatusChange;
pub struct HandoffChange;

/// Typed marker carried by the currently unsupported application facade input.
/// It contains no owner payload and cannot be constructed from arbitrary JSON.
pub struct OwnerEventEnvelope<T> {
    pub metadata: RunnerValidatedOwnerEventMetadata,
    pub unsupported_payload: T,
}

pub struct RunnerInboundEventEnvelope {
    pub metadata: RunnerValidatedOwnerEventMetadata,
    pub payload_contract: RunnerInboundPayloadContract,
}
```

The four facade-level marker types have no fields and only support the blocked/unsupported path. `OwnerEventEnvelope<ReleaseAuthorityChange>` and its three siblings therefore cannot represent or apply an owner fact today; they exist solely to close the Step 7 method signatures without inventing payload content. When a formal schema exists, these marker types must be replaced by field-level payload contracts through a recorded Step 8 reopen, not silently extended in implementation.

当前 union 只有 `*Unsupported` variants，这是有意的可落码 fail-closed contract：它允许 worker 在没有猜测 payload schema 的情况下编译/表达“不支持”，但不提供可被误解析的 payload body。未来上游正式 schema闭合时必须重开本 Step，新增typed payload variant、字段级来源、source-version/order规则和DTO→projection映射；不得在实现中把本 enum 偷换成 `JsonValue/bytes/map`。

Trusted source actor例外仅适用于 future validated envelope：`authority_kind=TrustedOwnerSource`、scope与subject由正式source registration/resolver确定，不能来自payload。它仍必须通过source isolation、visibility、schema、event identity、dedup、digest/order和state gate，不能调用public participant Command或绕过application facade。

### 9.4 Receipt、disposition、quarantine 与 stored replay

```rust
pub enum RunnerInboundEventDisposition {
    Accepted,
    Duplicate,
    Delayed,
    Rejected,
    UnsupportedVersion,
    GapDetected,
    Blocked,
    Quarantined,
}

pub struct RunnerConsumerQuarantineMarker {
    pub entry_ref: RunnerProtocolWorkerEntryRef,
    pub event_ref: Option<RunnerProtocolOwnerEventRef>,
    pub schema_version: RunnerProtocolEventSchemaVersion,
    pub issue_ref: RunnerConsumerIssueRef,
    pub quarantined_at: Timestamp,
}

pub struct RunnerInboundEventReceipt {
    pub entry_ref: RunnerProtocolWorkerEntryRef,
    pub consumer_name: RunnerConsumerName,
    pub source_family: RunnerProtocolConsumerSourceFamily,
    pub event_ref: Option<RunnerProtocolOwnerEventRef>,
    pub dedup_key: Option<RunnerProtocolIdempotencyKey>,
    pub subject_ref: Option<OwnerSubjectRef>,
    pub schema_version: RunnerProtocolEventSchemaVersion,
    pub source_attribution: Option<SourceAttribution>,
    pub trace_ref: Option<TraceRef>,
    pub disposition: RunnerInboundEventDisposition,
    pub result_ref: Option<RunnerProtocolResultRef>,
    pub owner_order_marker: Option<RunnerOwnerOrderMarker>,
    pub recovery_case_ref: Option<RecoveryCaseId>,
    pub quarantine: Option<RunnerConsumerQuarantineMarker>,
    pub issue_refs: RunnerConsumerIssueRefSet,
}

pub enum RunnerStoredConsumerReceipt {
    ReleaseAuthorityChange(RunnerInboundEventReceipt),
    SandboxLifecycleChange(RunnerInboundEventReceipt),
    RuntimeStatusChange(RunnerInboundEventReceipt),
    HandoffChange(RunnerInboundEventReceipt),
}
```

| Disposition | 触发 | 允许写入 | 禁止 |
|---|---|---|---|
| `Blocked` | contract/client/source readiness未闭合 | 可记录body-free operational issue/receipt；不建立applied marker | parse payload、projection write、success ACK。 |
| `UnsupportedVersion` | source family已识别但schema不支持 | body-free receipt；可隔离transport item ref | payload parse、dedup applied、mark stale。 |
| `Rejected` | header缺event/source/trace等必要字段或trusted source验证失败 | issue receipt | 猜默认event id/source actor。 |
| `Delayed` | 已知contract但temporary dependency unavailable | delayed receipt/checkpoint | 写owner fact或丢弃identity。 |
| `Quarantined` | framing/forbidden-body/schema isolation policy要求隔离 | opaque quarantine ref，不保存payload到Runner state store | 将quarantine视为accepted。 |
| `Duplicate` | complete stored receipt与same digest/key存在 | replay原receipt/result ref | 重新apply projection。 |
| `GapDetected` | formal order marker不连续/冲突 | RecoveryCase + stale marker（仅未来Ready后） | last-arrival-wins、推进owner cursor。 |
| `Accepted` | future full schema/source/dedup/order/visibility gate全部通过 | safe projection + applied marker + stored receipt | 创建owner truth、保存raw payload。 |

当前正常返回只能是 `Blocked/UnsupportedVersion/Rejected/Quarantined`（以及已有body-free receipt的`Duplicate`）；`Accepted/GapDetected/Delayed`只固定未来结果shape，不构成ready声明。`entry_ref` 由 `RunnerIdGeneratorPort.new_worker_entry_ref` 生成；durable duplicate identity使用可信 header 中的 optional `dedup_key` 定位已有完整 stored receipt，并复用其 optional `result_ref`，不再引入无来源receipt id。Duplicate 前必须逐字段确认 stored receipt 与当前 header 的 consumer/source/schema/event/subject/source attribution/trace/dedup identity 一致；任一缺失或冲突均不得 replay。不得解析 payload 或计算 payload digest来补做比较。Receipt中的header字段允许为optional的仅限header本身未完整时；不得猜默认subject/source/trace/dedup key。Quarantine marker由同一worker entry identity、header safe fields、trusted local clock和redacted issue构成，不能保存payload，不能进入domain/query正文，也不代表Archive保存；isolation provider未绑定时`quarantine=None`并返回Blocked/Rejected。

### 9.5 `ConsumeReleaseAuthorityChange`

| 项 | 契约 |
|---|---|
| logical key | `runner.consumer.ConsumeReleaseAuthorityChange` |
| input | header-first；payload contract=`ReleaseAuthorityChangeUnsupported` |
| current result | Blocked/UnsupportedVersion receipt |
| future target | exact release/version/scope/generation authority projection；不得修改 Release/Governance truth。 |

Future payload必须至少由正式owner提供exact binding、approval/baseline/lifecycle posture、authority ref、source version/order、visibility；当前不得自行定义。即使未来Accepted，也只能mark selection/material/intent stale或应用safe projection；不能本地批准、改Release内容或自动发起下载/run。

### 9.6 `ConsumeSandboxLifecycleChange`

| 项 | 契约 |
|---|---|
| logical key | `runner.consumer.ConsumeSandboxLifecycleChange` |
| input | header-first；payload contract=`SandboxLifecycleChangeUnsupported` |
| current result | Blocked/UnsupportedVersion receipt |
| future target | owner request/boundary/control/lease/cleanup safe projection。 |

Future receipt/ACK如果只表达request accepted，不能更新execution Running；cleanup accepted不能更新Confirmed/released/evicted。不得订阅/编译Sandbox私有实现或以Docker/gVisor/Firecracker/local container state补payload。

### 9.7 `ConsumeRuntimeStatusChange`

| 项 | 契约 |
|---|---|
| logical key | `runner.consumer.ConsumeRuntimeStatusChange` |
| input | header-first；payload contract=`RuntimeStatusChangeUnsupported` |
| current result | Blocked/UnsupportedVersion receipt |
| future target | Runtime-owned execution/result refs safe projection。 |

Future payload必须formal runtime run ref、execution posture、result refs、owner basis、source order/visibility；PID、port、socket、HTTP health、stdout/stderr不能作为event或status truth。Consumer不把terminal Runtime result反写`RunIntent`为global success。

### 9.8 `ConsumeHandoffChange`

| 项 | 契约 |
|---|---|
| logical key | `runner.consumer.ConsumeHandoffChange` |
| input | header-first；payload contract=`HandoffChangeUnsupported` |
| current result | Blocked/UnsupportedVersion receipt |
| future target | matching `HandoffPosture` receipt/posture projection。 |

Future event只能更新handoff state/receipt；不能生成或携带evidence/report/verdict/signoff正文。本地日志或diagnosis不能成为event payload substitute；gap/unknown进入RecoveryCase，不自动resend原handoff。

### 9.9 Planned Consumer 协议族停审

| 审查项 | 结论 |
|---|---|
| 4/4 独立协议小节 | pass |
| header/readiness before parse | pass |
| envelope/receipt/disposition/quarantine字段级 | pass for safe negative surface |
| payload字段级 | intentionally unsupported；无authority时不猜测，这是当前正式contract |
| actor/source exception | trusted source only + all gates retained |
| duplicate/gap/delayed | result shape闭合；Accepted/applied marker当前不可达 |
| current readiness | all four `Blocked/Unsupported` |
| Step 9承接 | `FLOW-E01~E04`先展开negative readiness；future positive branch明确blocked |

## 10. Outbound Event protocol：不适用

正式 00/01/02 没有经消费者合同确认的 Runner-owned outbound fact family。Runner-owned selection、intent、diagnosis、preview、handoff posture和job report是本地产品状态/结果，不自动成为全局事件。因此：

- 不定义 `RunnerOutboundEventEnvelope`、event kind、schema version、topic、publisher、outbox、payload snapshot或delivery retry。
- Command/Job完成只保存本地result/report；不得附带event refs。
- 本地日志、audit hint、trace、receipt、projection change不提升为outbound business event。
- 若未来确有消费者需求，必须回退正式需求/架构/概要接口校准，明确event owner、consumer、payload、visibility、retention、delivery/idempotency和evidence边界后，再重开Step 7/8；不能由Step 9或实现临时新增。

### 10.1 Outbound no-residue audit

| 检查项 | 结论 |
|---|---|
| publisher port | absent |
| outbox repository/object | absent |
| event payload/envelope | absent |
| topic/config | absent |
| command result event refs | absent |
| job report published refs | absent |
| 与Step 7一致 | pass：Step 7明确not applicable |

## 11. Operations Job protocol

Operations Job 是显式、可见、可取消/检查点化的本地操作入口，不是藏在 Query/render/reconnect 中的副作用。Job 可以编排 Runner-owned local state与正式 ports，但不得修复 owner truth、生成 evidence/verdict/signoff，或把本地完成映射为 approved/running/cleaned。

### 11.1 Job 定义批次表

| Job | 目标对象/report | 主要 port/repository | flow | 正向状态 |
|---|---|---|---|---|
| `AcquireAndVerifyMaterialJob` | task/cache/integrity refs | authority/source/verifier/cache | `FLOW-J01` | owner integration blocked |
| `EvaluateCacheEvictionJob` | cache candidate/guard refs | cache/guard/platform reads | `FLOW-J02` | logic closed；physical cache blocked |
| `ReconcileRunnerStateJob` | recovery/projection refs | formal read ports + recovery repos | `FLOW-J03` | owner integration blocked |
| `RefreshSafeDiagnosisJob` | preview/diagnosis refs | diagnostic/redaction + repos | `FLOW-J04` | owner integration blocked |
| `RefreshVisibleSourcesJob` | projection refs | read-only owner ports + section repo | `FLOW-J05` | owner integration blocked |

### 11.2 Shared job metadata, request and response

```rust
pub struct JobRunRef(pub String);
pub struct RunnerProtocolJobEntryRef(pub String);
pub struct RunnerProtocolJobIssueRef(pub String);
pub struct RunnerProtocolJobIssueRefSet(pub Vec<RunnerProtocolJobIssueRef>);
pub struct RunnerJobBasisRef(pub String);
pub struct RunnerCheckpointItemRef(pub String);

pub enum RunnerProtocolJobKind {
    AcquireAndVerifyMaterial,
    EvaluateCacheEviction,
    ReconcileRunnerState,
    RefreshSafeDiagnosis,
    RefreshVisibleSources,
}

pub enum RunnerProtocolJobDisposition {
    Completed,
    Partial,
    Blocked,
    Failed,
    DuplicateReplayed,
    Rejected,
    Unknown,
}

pub struct RunnerJobMetadata {
    pub job_kind: RunnerProtocolJobKind,
    pub job_run_ref: JobRunRef,
    pub idempotency_key: RunnerProtocolIdempotencyKey,
    pub actor: ActorContext,
    pub trace_ref: TraceRef,
    pub requested_at: Timestamp,
    pub basis_ref: RunnerJobBasisRef,
}

pub struct RunnerTypedJobRequest<T> {
    pub metadata: RunnerJobMetadata,
    pub input: T,
}

pub enum JobReportDisposition {
    Completed,
    Partial,
    Blocked,
    Failed,
    Unknown,
}

pub struct RunnerJobReport {
    pub job_kind: RunnerProtocolJobKind,
    pub job_run_ref: JobRunRef,
    pub disposition: JobReportDisposition,
    pub acquisition_task_refs: Vec<AcquisitionTaskRef>,
    pub cache_entry_refs: Vec<CacheEntryRef>,
    pub recovery_case_refs: Vec<RecoveryCaseId>,
    pub diagnosis_refs: Vec<FailureDiagnosisRef>,
    pub handoff_refs: Vec<DiagnosticHandoffId>,
    pub projection_refs: Vec<RunnerProjectionRef>,
    pub scanned_count: u64,
    pub changed_count: u64,
    pub failed_count: u64,
    pub checkpoint_sequence: Option<u64>,
    pub issue_refs: RunnerProtocolJobIssueRefSet,
}

pub struct RunnerJobResponse {
    pub entry_ref: RunnerProtocolJobEntryRef,
    pub job_kind: RunnerProtocolJobKind,
    pub job_run_ref: JobRunRef,
    pub disposition: RunnerProtocolJobDisposition,
    pub result_ref: Option<RunnerProtocolResultRef>,
    pub report: Option<RunnerJobReport>,
    pub recovery_case_ref: Option<RecoveryCaseId>,
    pub issue_refs: RunnerProtocolJobIssueRefSet,
}
```

| Field | 来源 | 约束 |
|---|---|---|
| `job_run_ref` | explicit scheduler-provided validated ref或`RunnerIdGeneratorPort` | 不伪造真实运行记录；本文件仅定义类型。不得替代result/idempotency。 |
| idempotency | scheduler/operator boundary | 五个job全部必填；same key/different stable digest rejected/conflict。 |
| actor | SystemOperator为主；可用Participant触发显式foreground refresh但仍需scope/visibility | 不允许anonymous/background UI隐式job。 |
| `basis_ref` | stable input/generation/source basis canonicalization | checkpoint resume必须same basis；不是owner cursor。 |
| report refs/counters | `RunnerJobReportAssembly` | ordered unique/bounded；scanned ≥ changed，scanned ≥ failed（partial retry不重复计数规则留Step 9）。 |
| disposition | local job work | Completed/Partial/Blocked/Failed/Unknown均不表达owner success/evidence。 |

### 11.3 Job duplicate replay and claim contract

| 场景 | 必须行为 | 禁止行为 |
|---|---|---|
| first accepted | validate registry/input → reserve idempotency → create entry/claim → run bounded body → save report/result + complete idempotency | 未reserve先发external side effect。 |
| duplicate same key/digest | `StoredRunnerResultRepository.get_job_report`，返回原result ref/report，disposition=`DuplicateReplayed` | acquire claim、rescan、redownload、reverify、reconcile、refresh。 |
| completed key but report missing | consistency unknown/failure + recovery | 静默重跑。 |
| same key different digest | conflict/rejected | 覆盖旧report。 |
| claim/checkpoint unknown | mark Unknown + RecoveryCase，只读readback | 新worker盲claim/replay side effect。 |
| stale checkpoint basis | mark Stale；从明确safe boundary创建新job/run | 用旧generation/source继续。 |

### 11.4 Job input DTO schemas

```rust
pub struct AcquireAndVerifyMaterialJobInput {
    pub task_ref: AcquisitionTaskRef,
    pub expected_binding: RunnerSelectionBinding,
    pub expected_authority_ref: AuthoritySnapshotRef,
    pub resume_from_checkpoint: Option<u64>,
}

pub struct EvaluateCacheEvictionJobInput {
    pub scope_ref: RunnerScopeRef,
    pub page: RunnerPageRequest,
    pub capacity_observation_ref: Option<ResourceObservationId>,
}

pub struct ReconcileRunnerStateJobInput {
    pub recovery_case_id: RecoveryCaseId,
    pub expected_state: RecoveryState,
    pub expected_basis: RunnerExpectedBasisMarker,
}

pub struct RefreshSafeDiagnosisJobInput {
    pub subject_refs: DiagnosticSubjectRefSet,
    pub expected_projection_generation: Option<ReadModelGeneration>,
}

pub enum RunnerVisibleSourceKind {
    Context,
    ReleaseAuthority,
    SandboxLifecycle,
    RuntimeStatus,
    DiagnosticHandoff,
    ArchiveReference,
    PlatformResources,
}

pub struct RunnerVisibleSourceKindSet(pub Vec<RunnerVisibleSourceKind>);

pub struct RefreshVisibleSourcesJobInput {
    pub subject_ref: RunnerReadSubjectRef,
    pub scope_ref: RunnerScopeRef,
    pub source_kinds: RunnerVisibleSourceKindSet,
    pub expected_projection_generation: ReadModelGeneration,
    pub page: Option<RunnerPageRequest>,
}

pub enum RunnerJobRequest {
    AcquireAndVerifyMaterial(
        RunnerTypedJobRequest<AcquireAndVerifyMaterialJobInput>,
    ),
    EvaluateCacheEviction(
        RunnerTypedJobRequest<EvaluateCacheEvictionJobInput>,
    ),
    ReconcileRunnerState(
        RunnerTypedJobRequest<ReconcileRunnerStateJobInput>,
    ),
    RefreshSafeDiagnosis(
        RunnerTypedJobRequest<RefreshSafeDiagnosisJobInput>,
    ),
    RefreshVisibleSources(
        RunnerTypedJobRequest<RefreshVisibleSourcesJobInput>,
    ),
}
```

`RunnerJobRequest` is the finite union required by `RunnerOperationsDispatchPort`; its variant and `metadata.job_kind` must match exactly. `RunnerTypedJobRequest<T>` is only the per-variant envelope and must not be used as an open generic dispatch surface.

### 11.5 `AcquireAndVerifyMaterialJob`

| 项 | 契约 |
|---|---|
| logical key | `runner.job.AcquireAndVerifyMaterialJob` |
| trigger | explicit persisted task enqueue/operations trigger；不由Query自动触发 |
| input target | exact task/binding/authority basis |
| report | task/cache refs、counts、checkpoint、issues；不返回bytes/digest value/approval |

Job读取task/selection/authority，打开quarantine sink，transfer，bind completion，verify，authority recheck，promote并更新metadata；每个阶段使用bounded checkpoint与expected version。`resume_from_checkpoint`只是sequence hint，必须和stored checkpoint+basis完全一致；不能只凭offset恢复。Transfer Complete ≠ Verified ≠ Qualified；job Completed也不证明approved/running。`RUN-UP-001/002/008`未关闭时正向port readiness使report Blocked，而非伪造成功。

### 11.6 `EvaluateCacheEvictionJob`

| 项 | 契约 |
|---|---|
| logical key | `runner.job.EvaluateCacheEvictionJob` |
| trigger | explicit capacity/maintenance operation；不由disk pressure callback直接delete |
| input | exact scope、bounded page、optional safe capacity observation ref |
| report | scanned candidate cache refs、changed candidate markers、protected/unknown issues |

Job只评估`EvictionCandidatePosture`并重读每项guard/owner protection inputs；它不调用`release_material`、不将entry标Evicted、不杀进程或执行Sandbox cleanup。Capacity observation只是候选排序/影响输入，不是delete permission。Candidate与Protected/Unknown可同时导致不变/issue结果。

### 11.7 `ReconcileRunnerStateJob`

| 项 | 契约 |
|---|---|
| logical key | `runner.job.ReconcileRunnerStateJob` |
| trigger | explicit frozen/unknown/gap/reconnect recovery action |
| input | exact case/current expected state/basis |
| report | recovery refs、safe projection refs、partial/unknown issues |

Job只经formal read ports读取current context/authority/Sandbox/Runtime/handoff/archive-peripheral posture，调用`RecoveryCase.begin_query/record_snapshot/reconcile`并更新safe local projections。它不调用owner mutation，不推进owner cursor，不补发unknown command。Reconnect/Online只允许尝试本job；不能直接使case Reconciled/Closed。

### 11.8 `RefreshSafeDiagnosisJob`

| 项 | 契约 |
|---|---|
| logical key | `runner.job.RefreshSafeDiagnosisJob` |
| trigger | explicit user/operator/scheduled refresh；不由GetFailureDiagnosis触发 |
| input | non-empty bounded subject refs + optional expected projection generation |
| report | preview/diagnosis/handoff refs（handoff仅现有关联）、projection refs、issues |

Job经`DiagnosticReadPort`读取bounded material/failure refs并强制`RedactionPort`，随后构造/更新`OutputPreview`与`FailureDiagnosis`。Redaction Blocked/Unsupported时不保存可见content；禁止fallback raw local logs/container stdout/host files。Report中的diagnosis ref不是evidence/verdict，job也不自动提交handoff。

### 11.9 `RefreshVisibleSourcesJob`

| 项 | 契约 |
|---|---|
| logical key | `runner.job.RefreshVisibleSourcesJob` |
| trigger | explicit foreground/schedule；不由GetRunnerReadModel/render隐式触发 |
| input | canonical subject/scope、non-empty source kind set、expected composition generation、optional page |
| report | generation-matched projection refs、per-source partial/blocked issues |

Job逐source调用对应read-only port，保留每个source的freshness/visibility/attribution，通过`replace_projection_if_generation_matches`更新safe sections。某source成功不使其他sourceCurrent；旧generation结果丢弃/标stale，不覆盖用户新selection/context。`ArchiveReference`失败为外围degraded，不改变core selection/run/material truth。

### 11.10 Operations Job 协议族停审

| 审查项 | 结论 |
|---|---|
| 5/5 job独立schema/trigger/output | pass |
| metadata/run/idempotency/basis | pass |
| report二级类型/refs/counters | pass |
| duplicate stored report replay | pass |
| local claim vs owner lease | separated |
| hidden Query/render side effect | prohibited |
| owner truth repair/evidence overstatement | prohibited |
| Step 9承接 | `FLOW-J01~J05` ready；positive ports carry blockers |

## 12. Owner adapter semantic DTO boundary

Step 7 的 port request/result 是 application semantic carrier；本 Step 的 public DTO 是 Runner inbound/outbound-at-entry contract。两者都不是 upstream SDK DTO。Adapter必须完成明确映射并在无法证明时fail closed。

| Runner protocol input/view | Step 7 semantic carrier/port | exact owner DTO status | 不可映射时 |
|---|---|---|---|
| context input/view | `RunnerContextResolutionQuery/Resolution` → `ContextReadPort` | pending `RUN-UP-008` + owner conditions | Restricted/Unavailable/Unsupported |
| release exact input/item | `ReleaseAuthorityQuery/Assessment`、`SelectableReleaseQuery/Summary` | blocked `RUN-UP-001/002/008` | AuthorityBlocked/Unsupported；不补cache |
| acquisition/job | `MaterialSourceQuery/Resolution/Transfer*`、`IntegrityVerification*` | blocked `RUN-UP-001/002/008` | Blocked；不生成locator/verified |
| run/control/cleanup | `SandboxRunRequest`、`SandboxControlRequest`、`SandboxCleanupRequest`、`SandboxSafeSnapshot` | blocked `RUN-UP-003/007/008` | Blocked/Unknown；不旁路private impl |
| lifecycle view | `RuntimeSafeSnapshot` | blocked `RUN-UP-004/008` | Unknown/Unavailable；不看PID/port |
| resource view/job | `PlatformResourceProbe*` | taxonomy pending `RUN-UP-007` | Unsupported/Unknown |
| preview/diagnosis | `DiagnosticReadQuery/BoundedDiagnosticMaterial` + `RedactionRequest/Outcome` | blocked `RUN-UP-005/008` | no content/Blocked；无raw fallback |
| handoff | `ObservabilityHandoffRequest/Snapshot` | blocked `RUN-UP-005/008` | Blocked/Unknown；不造receipt |
| archive peripheral | `ArchiveReferenceSnapshot` | blocked/peripheral `RUN-UP-006/008` | Degraded peripheral only |

Mapping obligations：

1. adapter使用L0 SDK/正式API，禁止依赖/编译owner私有实现；Sandbox尤不得以Docker/gVisor/Firecracker/local process旁路。
2. upstream unknown enum/field/version必须映射Unsupported/Unknown，不能drop后用default。
3. upstream body/error先经过正式safe/redaction contract；protocol只接body-free refs/markers。
4. `SourceAttribution`必须保留owner/source/version/freshness/visibility；不能用local arrival time填source version。
5. exact mapping在Step 14/authority关闭前保持blocked，本文不构成adapter readiness。

## 13. Cross-protocol closure audit

### 13.1 Public secondary type ownership

| Type family | owner | 定义位置/来源 | 状态 |
|---|---|---|---|
| actor/metadata/trace/expected basis | `contracts` | §6.1 | closed semantic；SDK exact pending |
| page/view/degraded/projection marker | `contracts` | §6.2 | closed |
| command outcome/stored result/error | `contracts` | §6.3～§6.4 | closed |
| binding/owner basis/resource/handoff/change refs | `contracts` | §6.6 | closed semantic |
| owner projection posture enum | `contracts` | §8.1 | closed semantic；owner mapping pending |
| 12 query request/view types | `contracts` | §8 | closed |
| consumer header/envelope-negative/receipt/quarantine | `contracts` | §9 | closed negative surface |
| positive consumer payloads | upstream owner + Runner contracts mapper | intentionally absent | blocked; must reopen Step 8 |
| job metadata/input/report/response | `contracts` | §11 | closed |

### 13.2 DTO → object / port / Step 9 flow audit

| Family | 数量 | Step 6 object closure | Step 7 port/repository closure | Step 9 coverage |
|---|---:|---|---|---|
| Command | 11 | all request/result fields map to context/selection/task/intent/control/guard/recovery/handoff factories/transitions | all loads/saves/external calls present | `FLOW-C01~C11` |
| Query | 12 | all sections map to objects/safe composition | all read/index/visibility/page surfaces present | `FLOW-Q01~Q12` |
| planned Consumer | 4 | worker entry/result/loop support negative outcomes | readiness/stored receipt/order seam present | `FLOW-E01~E04` blocked-first |
| Outbound Event | 0 | n/a | no publisher/outbox | n/a |
| Job | 5 | entry/claim/checkpoint/report objects present | operations/result repositories + needed ports present | `FLOW-J01~J05` |

没有为 Step 8 临时发明新的 repository/port method；Step 9 可以只调用 Step 7 已定义接缝。若函数流发现缺method，必须回退Step 7并记录修正，不能在flow伪造。

### 13.3 Protocol naming convergence

| HLD/API name | Step 7 facade type | Step 8 public type | 结论 |
|---|---|---|---|
| `SelectRelease` 等11项 | snake_case facade method + `*Input/*Result` | same operation name + same DTO | pass |
| `ResolveRunnerContext` 等12项 | snake_case query method | same request/view | pass |
| 4 `Consume*` | consumer facade signature name | same logical key；payload marked unsupported | pass with blocker |
| 5 `*Job` | job facade method | same job kind/input/report | pass |

### 13.4 Truth/evidence/safety boundary audit

| 风险 | 协议防线 | 结论 |
|---|---|---|
| implicit version | exact typed release/version fields；无generic selector | pass |
| local approval/baseline | semantic owner posture + authority ref/source | pass |
| download complete→qualified | acquisition/integrity/cache fields分轴 | pass |
| ACK→running | request/execution axes分离 | pass |
| stop→cleanup/eviction | control/cleanup/release/cache四阶段 | pass |
| local probe→allocation | local observation/owner lease分离 | pass |
| raw log fallback | preview content仅redacted bounded；job fail-closed | pass |
| receipt→evidence | no evidence/report/verdict/signoff fields | pass |
| Runner state→upstream writeback | no owner mutation beyond formal request/control/handoff intents；no truth update API | pass |
| consumer schema guess | unsupported-only payload contract | pass |
| outbound fabrication | explicit n/a/no-residue | pass |

### 13.5 Idempotency / replay / actor / metadata audit

| Family | actor | idempotency | replay | audit/trace |
|---|---|---|---|---|
| Command | trusted Participant/SystemOperator in scope | required | stored complete command result | trace ref + local result shell；非formal evidence |
| Query | trusted Participant/SystemOperator | prohibited | none | trace correlation only；no audit mutation |
| Consumer | TrustedOwnerSource only after registration/readiness | formal event dedup required | stored receipt | source/version/order/trace；current path blocked |
| Job | SystemOperator or explicit permitted Participant | required | stored report | trace + entry/claim/checkpoint/report；非owner audit truth |

### 13.6 Step 6/7 open-item disposition

| Open item | Step 8 disposition | Next owner |
|---|---|---|
| `RUN-S6-OPEN-002~004` / `RUN-S7-OPEN-002~008` | semantic public/port mapping now explicit；positive exact DTO remains blocked | upstream authority + Step 14 |
| `RUN-S6-OPEN-006` / `RUN-S7-OPEN-011` | closed：Command/Query/Consumer-negative/Job full public surface defined | Step 9 consumes |
| `RUN-S6-OPEN-007` / `RUN-S7-OPEN-012` | protocol-to-flow refs fixed，ordering intentionally deferred | Step 9/11 |
| `RUN-S6-OPEN-008` | all state-bearing outcomes fixed | Step 10 matrix |
| `RUN-S6-OPEN-009` / `RUN-S7-OPEN-009` | physical/store/cache technology untouched | `RUN-DDD-001~003` + Step 11/14 |
| `RUN-S6-OPEN-010` / `RUN-S7-OPEN-010` | negative consumer protocol closed；positive payload/order/client remains blocked | upstream + future Step 8 reopen |

### 13.7 New Step 8 open items

| ID | 内容 | 当前状态 | 后续责任 | 未关闭行为 |
|---|---|---|---|---|
| `RUN-S8-OPEN-001` | exact transport/route/IPC/CLI/scheduler binding | pending | technology authority + Step 14 | logical keys only |
| `RUN-S8-OPEN-002` | exact L0 SDK actor/metadata/trace/error/redaction types | blocked | `RUN-UP-008` + Step 14 | semantic DTO + Unsupported/Blocked |
| `RUN-S8-OPEN-003` | exact Artifact/Governance release/authority/page/source schemas | blocked | `RUN-UP-001/002/008` | acquire/select positive adapter blocked |
| `RUN-S8-OPEN-004` | exact Sandbox/Runtime request/control/cleanup/status DTO | blocked | `RUN-UP-003/004/007/008` | run/control/cleanup positive adapter blocked |
| `RUN-S8-OPEN-005` | exact diagnostic/redaction/handoff/archive DTO | blocked/peripheral | `RUN-UP-005/006/008` | no raw fallback；handoff blocked |
| `RUN-S8-OPEN-006` | 4 consumer payload/schema/order/dedup/client contracts | blocked | upstream authority；reopen Step 8 | header negative surface only；no parse/apply |
| `RUN-S8-OPEN-007` | local persistence/cache/page serialization and limits | pending | Step 11/14 + `RUN-DDD-003` | no backend/readiness claim |
| `RUN-S8-OPEN-008` | exhaustive protocol error code mapping | deferred | Step 12 | current typed issue kind/ref only |

Step 9 开工反查修正记录（2026-09-20）：`RUN-S8-FIX-001` 将 §7.3～§7.16 的 11 个 Command 简写签名与 shared handler contract 对齐。`RUN-S8-FIX-002` 将 `MaterialPostureSection.acquisition_state` 改为optional。`RUN-S8-FIX-003` 将 recovery unresolved reason改为finite `ReconcileFailurePosture`。`RUN-S8-FIX-004` 将 `ConnectivityView.reason_ref` 改为finite `RunnerConnectivityReasonPosture`，由domain `ConnectivityReason`逐variant映射，禁止Query生成opaque issue ref或泄漏raw network error。`RUN-S8-FIX-005` 为 public inbound header 与 receipt 增加 optional framing `dedup_key`，使 blocked-first flow 只有在正式 header 已携带 dedup identity 时才能查询并精确重放已有 stored receipt；不增加 payload 字段、不计算 payload digest、不启用 positive consumer path。五项修正使Step 9 flow可逐字段落码；没有改变operation数量、truth owner或正向adapter readiness。

## 14. 正式 `03` 回填草稿

Step 19装配时，正式§7建议按以下结构抽取，不复制calibration过程：

| 正式章节 | 本文件来源 | 必须保留 |
|---|---|---|
| §7.1 shared protocol | §4～§6 | envelope/metadata/page/view/error/result/route-neutral规则 |
| §7.2 Command | §7 | 11项schema、构造映射、unknown/accepted红线 |
| §7.3 Query | §8 | 12项request + field-level views + no-write/degraded口径 |
| §7.4 planned Consumer | §9 | header-first、unsupported-only payload、receipt、current blockers |
| §7.5 Outbound Event | §10 | 不适用与no-residue原因 |
| §7.6 Operations Job | §11 | 5项input/report/duplicate/claim边界 |
| §7.7 adapter/cross audit | §12～§13 | semantic≠SDK DTO、truth/evidence、open items |

不得把 Rust-like notation回填成已选Rust事实；不得删除blocker、unsupported-only consumer或outbound n/a结论。

## 15. Step 8 停审与进入 Step 9 条件

### 15.1 完成检查

| 门禁 | 结果 | 依据 |
|---|---|---|
| 协议总表/分批表 | pass | §3、§5 |
| 11 Command独立schema/映射 | 11/11 | §7 |
| 12 Query独立schema + field-level view | 12/12 | §8 |
| 4 inbound envelope/receipt/negative contract | 4/4 | §9 |
| positive consumer payload未伪造 | pass | unsupported-only union + blocker |
| Outbound Event结论 | 0，not applicable | §10 |
| 5 Job input/report/replay | 5/5 | §11 |
| public secondary types归属/schema | pass | §6、§8.1、§9、§11、§13.1 |
| page/version/source/generation/order分离 | pass | §6.2、§9、§11 |
| actor/source exception | pass | §6.1、§9.3、§13.5 |
| DTO→object/port/flow闭环 | pass for logic | §13.2 |
| exact adapter readiness未伪造 | pass with blockers | §12、§13.7 |
| formal 03 untouched | pass | 本文件仅calibration |

### 15.2 Step 9 启动红线

- Step 9每条flow必须使用本文件固定的request/result/view/receipt/report；不得改DTO字段来迁就临时顺序。
- 每条flow必须回指Step 6 object method、Step 7 repository/port和本文件protocol。
- 11 Command、12 Query、4 blocked-first Consumer、5 Job逐条定义；不得以“通用流”替代独立flow停审。
- External I/O始终在local UoW外；具体transaction/crash ordering由Step 9/11分层定义。
- Consumer flow当前只能完整实现header/readiness负向路径；positive payload branch标blocked，不得解析。
- 不新增Outbound Event/outbox，不修改正式03，不选物理技术，不实现代码或测试。

### 15.3 停审结论

| 项 | 结论 |
|---|---|
| Step 8逻辑协议契约 | `completed_with_upstream_blockers` |
| Step 8 gate | `pass_for_step_09_logic` |
| exact owner adapter / physical transport gate | `blocked` |
| upstream blockers | `RUN-UP-001~008` |
| local DDD blockers | `RUN-DDD-001~003` |
| 下一允许动作 | 读取Step 9 SOP/规范与L1-governance Step 9，再创建`03_ddd_step_09_function_flows.md` |
| 不允许动作 | Step 10提前开工、Step 11+、正式03写入、代码、测试、implementation ledger/skeleton、commit |

Step 8到此停审。协议层已达到Step 9可逐接口编排而无需重新猜public字段的粒度；未闭合的exact owner与consumer正向schema均被保持为显式blocked surface，而不是伪造ready或实现事实。
