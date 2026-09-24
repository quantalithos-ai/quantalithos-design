# Step 7. 逐模块定义 Trait / Port / Adapter 契约

> 对应 SOP：`standards/document/详细设计讨论流程_SOP.md` Step 7
> 参考框架：`projects/L1-governance/design-calibration/03_ddd_step_07_trait_port_adapter_contracts.md`
> 回填位置：未来正式 `03-详细设计.md` §5 各模块 Trait / Port / Adapter 契约、§6 全局 Trait 索引
> 文件性质：逻辑接缝契约中间产物。代码块只表达可落码签名，不构成 Rust、async runtime、crate、package、binary 或文件路径选择。

## 1. Step 状态与开工确认

| 项目 | 记录 |
|---|---|
| Step | 7 / 逐模块定义 Trait / Port / Adapter 契约 |
| 输出文件 | `design-calibration/03_ddd_step_07_trait_port_adapter_contracts.md` |
| 当前模式 | `full-restart + single-agent-serial` |
| 已读取规范 | 详细设计 SOP Step 7、详细设计书写规范 §5.5～§5.6、真相源闭环与可落码性标准 |
| 已读取前序 | Step 5 模块主轴、Step 6 对象契约与停审、正式 01/02、02 Step 7～9 校准产物 |
| 参考粒度 | L1-governance Step 7 的 capability→port→signature→caller/implementer→module stop-review→cross-seam audit 框架 |
| Step 6 门禁 | `pass_for_step_07_logic` |
| 当前逻辑门禁 | `completed_with_upstream_blockers`；可进入 Step 8 逻辑协议契约 |
| 物理 / exact adapter 门禁 | `blocked`：`RUN-UP-001~008`、`RUN-DDD-001~003` 未关闭 |
| 正式 03 / 实现 / 测试 / commit | 均不允许；Step 19 前不改正式 03，不实现代码，不执行测试，不提交 |

本 Step 的“port 完成”只表示 Runner 所需 semantic contract 在逻辑层闭合，不表示 owner 已提供同名 client、DTO、endpoint、event schema 或 SDK 方法，也不表示 adapter ready。

## 2. 本步目标、输入与非目标

### 2.1 目标

按七个逻辑模块逐个回答：

1. 哪些 Step 6 对象能力、字段来源、状态迁移需要跨模块接缝；
2. trait / port 的唯一逻辑 owner、调用方和实现方；
3. repository 的 versioned read、paired write、UnitOfWork、page/helper 面是否足以支撑 Step 8～11；
4. 14 个 required port 的 semantic request/result/error/readiness 是否可表达 blocked/unknown/stale/restricted；
5. entry、worker、operations 是否只能调用 application facade；
6. infra adapter 是否只实现 application port，且不暴露 sibling 私有实现或反写 owner truth；
7. Step 6 的 10 个 open item 是否有明确承接，而非留给实现者猜测。

### 2.2 输入

| 输入 | 本 Step 使用方式 |
|---|---|
| `03_ddd_step_05_module_contracts_axis.md` | 固定七模块归属、依赖方向与禁止调用 |
| `03_ddd_step_06_object_contracts.md` | 固定对象、字段、factory/transition、状态、carrier 与 `RUN-S6-OPEN-001~010` |
| 正式 `02-概要设计.md` §7.6 | 固定 14 个 required port 名称与能力，不把 required 误写成 available |
| 02 Step 7/8/9 校准产物 | 固定 11 Command、12 Query、4 planned Consumer、5 Job、处理流与状态触发需求 |
| 正式 `01-架构设计.md` | 固定依赖方向、SDK-first、local truth / owner projection / observation 分离 |
| 上游正式文档与台账 | 仅核验 owner 与当前 readiness；exact surface 缺失时保持 blocked |

### 2.3 非目标

- 不定义 Command/Query/Event/Job public DTO 完整 body；属于 Step 8。
- 不定义逐接口调用顺序、事务切片与 crash window；属于 Step 9/11。
- 不定义完整状态转换矩阵；属于 Step 10。
- 不选择数据库、cache、文件原语、HTTP/RPC/topic、SDK version、GUI/CLI shell、语言或 runtime。
- 不创建 Runner outbound event、outbox repository 或 publisher port；概要已明确当前无正式 outbound event family。
- 不写任何真实源码路径；Step 4 physical layout 仍 blocked。

## 3. 分批写入计划

| 批次 | 覆盖内容 | 写入状态 | 停审状态 | 下一批 |
|---|---|---|---|---|
| 7.0 | 骨架、目标、输入、模块顺序、门禁 | completed | skeleton reviewed | 7.1 |
| 7.1 | `contracts` / `domain` no-port 边界、shared application helper | completed | module reviewed | 7.2 |
| 7.2 | application base ports：UoW、Clock/Connectivity、Id、canonical digest、availability | completed | module reviewed | 7.3 |
| 7.3 | local repositories：context/selection/material/lifecycle/resource/diagnosis/read | completed | module reviewed | 7.4 |
| 7.4 | idempotency/result/operations repositories 与 application facade ports | completed | module reviewed | 7.5 |
| 7.5 | 14 required external/local semantic ports | completed | reviewed with upstream blockers | 7.6 |
| 7.6 | `infra` adapter、`entry`、`worker`、`operations` 模块契约与停审 | completed | modules reviewed | 7.7 |
| 7.7 | Step 6 open-item closure、跨模块审计、反查、回填、停审 | completed | step reviewed with blockers retained | Step 8 |

## 4. 模块执行顺序与 port 归属总览

Step 7 严格按模块展开，不先造全仓 port 总表再倒填归属。`contracts` 和 `domain` 先做 no-port 停审；`application` 再定义全部 semantic ports；`infra` 只给实现契约；三个入口模块只给 facade 依赖与禁止项。

| 顺序 | 模块 | 是否定义 port | 是否实现 port | 允许直接调用 | 本步停审重点 |
|---:|---|---:|---:|---|---|
| 1 | `contracts` | 否 | 否 | 无 | public carrier 不引用 application/domain-only/infra 类型 |
| 2 | `domain` | 否 | 否 | 无 | object/policy 不读 repository、不调 owner、不生成 id/time |
| 3 | `application` | 是 | 否 | 定义并调用 repository/resolver/gateway/clock/id/UoW/facade | 读取面、version、safe result、blocked readiness 闭合 |
| 4 | `infra` | 否 | 是 | 实现 application ports，由 composition 注入 | no private backend reuse、no truth upgrade、fake/durable parity |
| 5 | `entry` | 仅依赖 facade contract | 否 | application command/query facade | 不直连 repository/adapter/domain transition |
| 6 | `worker` | 仅依赖 consumer facade/readiness | 否 | application consumer facade | 当前 planned/blocked，不解析未知 payload |
| 7 | `operations` | 仅依赖 job facade | 否 | application job facade | claim/checkpoint/report 不等 owner success |

### 4.1 依赖方向

```text
contracts  <── domain
    ▲             ▲
    └──── application ──── defines semantic ports
                ▲
        infra implements ports
                ▲
 entry / worker / operations call application facades only
```

图中箭头表示编译期逻辑依赖方向，不表示真实 crate/package 已存在。外部 owner 通过 infra adapter 实现 application port；Runner 不直接编译或复用 Sandbox、Runtime、Observability 等私有实现。

## 5. Step 7 通用签名与真实性规则

| 规则 | 约束 |
|---|---|
| trait owner | repository/resolver/gateway/clock/id/UoW/readiness trait 统一由 `application` 定义；infra 不反向定义业务接口 |
| async 语法 | `async fn` 仅表示可能的 I/O 边界；不选择 async runtime，也不保证所有 local fake 都需线程/网络 |
| error | `ApplicationError` 是逻辑占位；可保存的业务 blocked/unknown/stale/restricted 必须进入 typed result，而非靠 error string 分类 |
| version | mutable Runner object 写入必须使用来自 paired versioned read 的 `RunnerVersion`；page/source cursor 不得替代 version |
| UnitOfWork | 同一 local atomic boundary 的多对象写入显式携带 `&dyn RunnerUnitOfWork`；不得把 owner/network/download/verify 调用包进 local transaction |
| Query | query/read port 不得隐式 refresh、repair、reserve idempotency、create intent 或执行 cleanup |
| owner result | ACK、HTTP 200、PID、port、socket、toast、本地日志不得在 adapter 内映射为 running/cleanup/evidence success |
| body-free | resolver/read/handoff/archive 返回 typed ref、safe summary/snapshot、bounded material、receipt；不返回 sibling truth body或secret |
| readiness | configured/enabled/callable/contract-ready 分开；上游未闭合时正向调用返回 `Blocked/Unsupported/Unavailable` |
| consumer | 四个 planned Consumer 在 envelope/schema/client/order/dedup 未闭合前只能走 readiness blocked，不解析 body |
| outbound | 当前无 outbound event/outbox/publisher；任何新增都必须回退概要 Step 7，而不能在本 Step补造 |

## 6. `contracts` 模块接缝停审

### 6.1 capability / 接缝清单

| Step 6 capability | 是否需要在 contracts 定义 port | 承接方式 | 结论 |
|---|---:|---|---|
| typed id/ref/binding/state/reason/marker | 否 | 作为 application port 参数/结果的共享类型 | contracts 不访问 I/O |
| Command/Query/Consumer/Job public surface | 否（Step 7） | Step 8 定义 DTO；本 Step 只校验 port 不引用 domain-only body | deferred to Step 8 |
| safe view sections | 否 | repository/query assembler 返回 contracts-owned view/section carrier | no reverse dependency |

### 6.2 停审记录

| 审查项 | 结论 | 缺口 / 后续 |
|---|---|---|
| 是否定义 repository/adapter | pass：不定义 | 全部由 application 定义 |
| public carrier 是否能被 port 使用 | pass with blockers | exact serialization 留 Step 8 |
| 是否引用 owner/private body | pass | 只允许 body-free ref/safe marker |
| 模块状态 | `completed_for_step_07` | Step 8 继续 protocol schema |

## 7. `domain` 模块接缝停审

### 7.1 capability / 接缝清单

| 对象能力 | 所需外部协作 | domain 内处理 | application port 承接 |
|---|---|---|---|
| factory 所需 id/time | id/clock | 只接收参数，不自行生成 | `RunnerIdGeneratorPort`、`RunnerClockPort` |
| load / save / expected version | local persistence | object transition 纯内存 | object repositories + UoW |
| authority/material/owner reads | external owner | 只消费 safe result/binding | 14 required semantic ports |
| unknown/reconcile | owner current snapshot | `RecoveryCase` 比较 expected/actual | read ports + recovery repository |
| preview/redaction/handoff | safe source/transform/receipt | object 保持 bounded/body-free | diagnostic/redaction/handoff ports |

### 7.2 停审记录

| 审查项 | 结论 | 缺口 / 后续 |
|---|---|---|
| object 是否持有 port/client | pass：禁止 | application 注入并编排 |
| transition 是否访问 repository | pass：禁止 | Step 9 flow 调 repository 后调用 object method |
| owner projection 是否可本地升级 | pass：禁止 | 只接受 formal safe snapshot/receipt |
| 模块状态 | `completed_for_step_07` | Step 10 再审状态转换矩阵 |

## 8. Shared application port helper

这些 helper 归 `application` 的逻辑 contract surface，不进入 public protocol，也不暗示真实源码文件。Step 8 若需要公开 page、readiness 或 error，必须定义 contracts-owned DTO 并显式映射，不能直接暴露 repository helper。

```rust
/// Optimistic version returned by a Runner-owned repository read.
pub struct RunnerVersion(pub u64);

/// Expected state used by insert-or-update repository operations.
pub enum RunnerExpectedVersion {
    /// The object must not exist when the write is committed.
    Absent,
    /// The object must still have the supplied optimistic version.
    Exact(RunnerVersion),
}

/// Opaque cursor for local repository pagination only.
pub struct RunnerRepositoryCursor(pub String);

/// Bounded application-local repository page request.
pub struct RunnerRepositoryPage {
    pub cursor: Option<RunnerRepositoryCursor>,
    pub limit: u32,
}

/// Application-local bounds for collections embedded in non-page Query views.
/// Concrete values and configuration binding remain Step 14 decisions.
pub struct RunnerEmbeddedCollectionBounds {
    pub control_intents: u32,
    pub resource_observations: u32,
    pub recovery_links: u32,
    pub recovery_subjects: u32,
    pub resolution_refs: u32,
    pub diagnostic_subjects: u32,
    pub output_source_refs: u32,
    pub source_failure_refs: u32,
    pub safe_handoff_material_refs: u32,
    pub source_attributions: u32,
}

/// A persisted value paired with the only version valid for its next write.
pub struct Versioned<T> {
    pub value: T,
    pub version: RunnerVersion,
}

/// A bounded repository page whose cursor has no truth or version semantics.
pub struct Page<T> {
    pub items: Vec<T>,
    pub next_cursor: Option<RunnerRepositoryCursor>,
}

/// Stable application-local identity for one local transaction attempt.
pub struct RunnerTransactionRef(pub String);

/// Semantic readiness of a logical port; it is not an owner success state.
pub enum RunnerPortReadiness {
    Ready,
    Degraded,
    Unavailable,
    Blocked,
    Unsupported,
}

/// Body-free readiness observation for one logical port slot.
pub struct RunnerPortReadinessMarker {
    pub slot: RunnerInfraAdapterSlot,
    pub state: RunnerPortReadiness,
    pub issue_ref: Option<RunnerConfigIssueRef>,
    pub checked_at: Timestamp,
}

/// Safe read result that preserves freshness, visibility, and unsupported paths.
pub enum RunnerSemanticRead<T> {
    Current {
        value: T,
        attribution: SourceAttribution,
    },
    Stale {
        value: T,
        attribution: SourceAttribution,
        issue_ref: RunnerPortIssueRef,
    },
    Restricted {
        visibility: VisibilityPosture,
        attribution: SourceAttribution,
        issue_ref: RunnerPortIssueRef,
    },
    Unavailable {
        issue_ref: RunnerPortIssueRef,
    },
    Unsupported {
        issue_ref: RunnerPortIssueRef,
    },
}

/// Redacted issue identity shared by application port results.
pub struct RunnerPortIssueRef(pub String);

/// Finite application-local locator submitted to the formal read-visibility resolver.
/// It preserves nominal identity and never derives a canonical subject by string parsing.
pub enum RunnerReadSubjectLocator {
    ContextRequest {
        requested_scope_ref: Option<RunnerScopeRef>,
        platform_ref: PlatformContextRef,
    },
    Scope(RunnerScopeRef),
    Context(RunnerContextId),
    Selection(RunnerSelectionId),
    AcquisitionTask(AcquisitionTaskRef),
    CacheEntry(CacheEntryRef),
    IntegrityPosture(IntegrityPostureRef),
    RunIntent(RunIntentId),
    ControlIntent(ControlIntentRef),
    ProtectedSubject(ProtectedSubjectRef),
    ProtectionGuard(ProtectionGuardRef),
    RecoveryCase(RecoveryCaseId),
    OutputPreview(OutputPreviewRef),
    DiagnosticSubject(DiagnosticSubjectRef),
    DiagnosticSubjects(DiagnosticSubjectRefSet),
    FailureDiagnosis(FailureDiagnosisRef),
    Handoff(DiagnosticHandoffId),
    Canonical(RunnerReadSubjectRef),
}

/// Body-free visibility resolution returned for every allow/deny/degraded posture.
pub struct RunnerReadVisibilityResolution {
    pub read_subject_ref: RunnerReadSubjectRef,
    pub actor_ref: ActorRef,
    pub scope_ref: RunnerScopeRef,
    pub visibility: VisibilityPosture,
    pub freshness: SourceFreshness,
    pub degraded: Option<RunnerDegradedMarker>,
    pub resolution_source_ref: VisibilityResolutionSourceRef,
    pub source_attribution: Vec<SourceAttribution>,
}

/// Finite read-model section key; it is not a stringly-typed projection name.
pub enum ReadModelSection {
    Context,
    Selection,
    Material,
    Run,
    ResourceCleanup,
    PreviewDiagnosis,
    Connectivity,
}

/// Application-local safe body carried by one committed read section.
pub enum RunnerReadSectionBody {
    Context(RunnerContextView),
    Selection(SelectionPostureSection),
    Material(MaterialPostureSection),
    Run(RunPostureSection),
    ResourceCleanup(ResourceCleanupSection),
    PreviewDiagnosis(PreviewDiagnosisSection),
    Connectivity(ConnectivityView),
}

/// One committed, source-attributed section. `body=None` is an explicit safe absence.
pub struct RunnerReadSection {
    pub section: ReadModelSection,
    pub subject_ref: RunnerReadSubjectRef,
    pub projection_ref: Option<RunnerProjectionRef>,
    pub projection_generation: Option<ReadModelGeneration>,
    pub surface: RunnerViewSurface,
    pub body: Option<RunnerReadSectionBody>,
}

/// Stable-generation source set consumed by pure `RunnerReadModel` composition.
pub struct RunnerReadSources {
    pub context: RunnerReadSection,
    pub selection: RunnerReadSection,
    pub material: RunnerReadSection,
    pub run: RunnerReadSection,
    pub resource_cleanup: RunnerReadSection,
    pub preview_diagnosis: RunnerReadSection,
    pub connectivity: RunnerReadSection,
    pub composition_generation: ReadModelGeneration,
    pub source_attribution: Vec<SourceAttribution>,
}
```

| helper | 语义来源 | 使用规则 | 禁止替代 |
|---|---|---|---|
| `RunnerVersion` | repository `get/list` | 下一次 mutable save 的 optimistic token | page cursor、source version、timestamp、trace |
| `RunnerExpectedVersion::Absent` | explicit create path | 只允许 insert；已存在即 conflict | `None` 表示“随便覆盖” |
| `RunnerExpectedVersion::Exact` | paired versioned read | update/delete/replace 必须携带 | 从 object 字段或 UI generation 猜 version |
| `RunnerRepositoryCursor` | repository list | 只用于同一 list contract 的下一页 | truth cursor、event order、version |
| `RunnerEmbeddedCollectionBounds` | validated application composition/config | 限制非分页view内嵌集合；值必须非零且受全局硬上限约束 | transport默认值、无界循环、截断后仍标Complete |
| `Versioned<T>` | Runner-owned repository | object 与 version 不可拆开缓存/传递 | owner source version |
| `RunnerPortReadinessMarker` | validated config + adapter capability/readiness | 每次正向调用前可被 application gate 使用 | configured/Enabled 自动等于 Ready |
| `RunnerSemanticRead<T>` | adapter safe result | stale/restricted/unavailable/unsupported 是正常 typed outcome | generic exception 或空对象当成功 |
| `RunnerReadSubjectLocator` | Query 的 finite typed locator | 只交给 formal visibility resolver 换取 canonical subject/scope | ref prefix、route、cursor、loaded body 或 generic string mapper |
| `RunnerReadVisibilityResolution` | visibility resolver 的 body-free结果 | allow/deny/degraded 均携带 canonical subject、scope、freshness与source | denied path丢失subject后再读正文定位 |
| `RunnerReadSection` / `RunnerReadSources` | committed safe projection repository | section key、body variant、surface与generation必须一致 | generic map/downcast、缺surface body、跨generation拼接 |

### 8.1 UnitOfWork 契约

```rust
/// Transaction handle for one bounded Runner-local atomic write set.
pub trait RunnerUnitOfWork {
    /// Returns an opaque local transaction reference for correlation only.
    fn transaction_ref(&self) -> RunnerTransactionRef;
}

/// Creates and finalizes Runner-local transactions.
pub trait RunnerUnitOfWorkManager {
    async fn begin(&self) -> Result<Box<dyn RunnerUnitOfWork>, ApplicationError>;

    async fn commit(
        &self,
        uow: Box<dyn RunnerUnitOfWork>,
    ) -> Result<(), ApplicationError>;

    async fn rollback(
        &self,
        uow: Box<dyn RunnerUnitOfWork>,
    ) -> Result<(), ApplicationError>;
}
```

| UoW 规则 | 正式口径 |
|---|---|
| transaction scope | 只包含 Runner-owned state、projection marker、idempotency/stored-result、claim/checkpoint 等本地原子写入 |
| external call | SDK/API、owner read/write、transfer、verification、redaction、platform probe 均在 transaction 外调用 |
| write pairing | 每个 existing object save 必须使用同一 flow 中 versioned read 的 exact `RunnerVersion` |
| create pairing | create 使用 `RunnerExpectedVersion::Absent`；duplicate/conflict 不能覆盖 |
| commit result unknown | durable commit/readback 不可确认时进入 typed storage-unknown/recovery 路径；不得重发 owner side effect |
| rollback | rollback 不伪造“owner 未接收”；若 owner call 已发生，仍需 Unknown + RecoveryCase |
| cross-repo transaction | 只限 Runner local adapters；不声称跨 Artifact/Governance/Sandbox/Runtime 分布式事务 |

### 8.2 page / version / source order 分离

| 轴 | carrier | 只表示 | 不表示 |
|---|---|---|---|
| optimistic concurrency | `RunnerVersion` | Runner local record version | owner source order、list position |
| repository pagination | `RunnerRepositoryCursor` | local bounded list position | object version、event cursor |
| owner freshness/order | `SourceAttribution.source_version` + port-specific marker | formal owner observation basis | local version 或 commit sequence |
| selection generation | `SelectionGeneration` | explicit user selection successor | object version、event ordering |
| job checkpoint | `RunnerJobCheckpoint.sequence/basis_ref` | local bounded job progress | owner cursor 或 replay permission |

### 8.3 shared helper 停审

| 审查项 | 结论 |
|---|---|
| version 与 cursor 是否分离 | pass |
| create/update version 来源是否明确 | pass |
| external I/O 是否进入 UoW | pass：禁止 |
| typed read 是否保留 stale/restricted/unavailable | pass |
| public DTO 是否误用 repository helper | pass：明确留 Step 8 映射 |

## 9. `application` 基础 port 契约

### 9.1 capability / 接缝清单

| capability / Step 6 来源 | application 接缝 | 调用方 | 实现方 | 后续承接 |
|---|---|---|---|---|
| trusted timestamp、network/suspend/resume/cancellation observation | `ClockConnectivityPort` | all services/jobs | infra platform adapter | Step 8 marker、Step 9 recovery |
| all generated local ids/refs | `RunnerIdGeneratorPort` | factories、entry/worker/job assembly | infra local generator | Step 11 generation strategy |
| stable input digest | `RunnerCanonicalDigestPort` | idempotency orchestration | infra canonical encoder | Step 8 stable fields、Step 13 |
| local transaction | `RunnerUnitOfWorkManager` | write/consumer/job services | infra state store adapter | Step 9/11 |
| logical adapter readiness | `RunnerAdapterRegistryPort` | preflight/runtime builder/query degradation | infra composition registry | Step 8 readiness/error、Step 14 |

### 9.2 `ClockConnectivityPort`

```rust
/// Supplies trusted local time and bounded connectivity/lifecycle observations.
pub trait ClockConnectivityPort {
    async fn now(&self) -> Result<Timestamp, ApplicationError>;

    async fn observe_connectivity(
        &self,
        sources: SourceOwnerSet,
    ) -> Result<ConnectivityObservation, ApplicationError>;

    async fn observe_local_lifecycle(
        &self,
    ) -> Result<LocalLifecycleObservation, ApplicationError>;

    async fn cancellation_observation(
        &self,
        operation_name: RunnerOperationName,
    ) -> Result<RunnerCancellationObservation, ApplicationError>;
}
```

| 函数 | 消费方 | 约束 |
|---|---|---|
| `now` | factory、idempotency、observation、job | trusted local time，不冒充 owner time |
| `observe_connectivity` | connectivity/recovery/refresh service | 只给 local observation；Online 不清 business stale/unknown |
| `observe_local_lifecycle` | recovery service/job | suspend/resume/restart/session marker；不推断 owner outcome |
| `cancellation_observation` | acquisition/job orchestration | 只表达 local cancellation posture；不取消 owner truth |

### 9.3 `RunnerIdGeneratorPort`

```rust
/// Generates opaque identities for all Runner-owned objects and operation shells.
pub trait RunnerIdGeneratorPort {
    fn new_context_id(&self) -> RunnerContextId;
    fn new_selection_id(&self) -> RunnerSelectionId;
    fn new_acquisition_task_id(&self) -> AcquisitionTaskId;
    fn new_cache_entry_id(&self) -> CacheEntryId;
    fn new_integrity_posture_id(&self) -> IntegrityPostureId;
    fn new_run_intent_id(&self) -> RunIntentId;
    fn new_control_intent_id(&self) -> ControlIntentId;
    fn new_resource_observation_id(&self) -> ResourceObservationId;
    fn new_protection_guard_id(&self) -> ProtectionGuardId;
    fn new_recovery_case_id(&self) -> RecoveryCaseId;
    fn new_output_preview_id(&self) -> OutputPreviewId;
    fn new_failure_diagnosis_id(&self) -> FailureDiagnosisId;
    fn new_diagnostic_handoff_id(&self) -> DiagnosticHandoffId;
    fn new_application_result_id(&self) -> RunnerApplicationResultId;
    fn new_entry_ref(&self) -> RunnerEntryRef;
    fn new_worker_entry_ref(&self) -> RunnerWorkerEntryRef;
    fn new_job_entry_ref(&self) -> RunnerJobEntryRef;
    fn new_job_run_ref(&self) -> JobRunRef;
    fn new_job_claim_ref(&self) -> JobClaimRef;
    fn new_projection_ref(&self) -> RunnerProjectionRef;
    fn new_read_model_generation(&self) -> ReadModelGeneration;
}
```

ID 生成规则：输出必须 opaque、non-empty、stable；不得从 owner id、release/version、path、digest、timestamp、PID、port、trace 或 idempotency key 拼接。repository/handler/domain object 不得自行生成这些 id。

Step 9 仅通过 Step 6 §7.1.1 的 contracts-owned nominal conversion 在已持久化 local `*Id` 与 public `*Ref` 之间转换；`RunnerIdGeneratorPort` 仍只生成新的 local identity，不生成同一对象的第二个 ref identity。Repository 接口保持以 `*Id` 定位，entry/application 不得复制内部字符串或按 prefix 解析 ref。

### 9.4 `RunnerCanonicalDigestPort`

```rust
/// Produces a stable digest from the Step 8-declared stable operation fields.
pub trait RunnerCanonicalDigestPort {
    fn digest_write_input(
        &self,
        operation_name: RunnerOperationName,
        stable_input: RunnerStableOperationInput,
    ) -> Result<RunnerRequestDigest, ApplicationError>;
}
```

`RunnerStableOperationInput` 的 variants 与字段由 Step 8 按 11 Command、4 planned Consumer、5 Job 定义。canonical input 必须排除 request id、trace、issued-at、retry counter、random value、transport headers 和 raw body；同一语义输入在 entry/fake/durable adapter 中产生相同 digest。

Step 8 §6.1、§7 各 Command 的 stable-field 规则以及 §9/§11 的 Consumer/Job metadata 构成 `RunnerStableOperationInput` 的封闭构造表；该 application-only carrier 不进入 public wire schema。实现必须按 finite `RunnerCommandRequest` / `RunnerInboundEventEnvelope` / `RunnerJobRequest` variant 逐字段构造它，禁止 generic map、反射遍历或对序列化全文直接 hash。

### 9.5 `RunnerAdapterRegistryPort`

```rust
/// Reads validated logical-port readiness without exposing concrete clients.
pub trait RunnerAdapterRegistryPort {
    async fn get_readiness(
        &self,
        slot: RunnerInfraAdapterSlot,
    ) -> Result<RunnerPortReadinessMarker, ApplicationError>;

    async fn list_readiness(
        &self,
        page: RunnerRepositoryPage,
    ) -> Result<Page<RunnerPortReadinessMarker>, ApplicationError>;
}
```

| readiness | 是否可发正向调用 | 对外 surface |
|---|---:|---|
| `Ready` | 仅在该次业务 basis 也通过时允许 | 正常，但仍保留 source/freshness |
| `Degraded` | 仅允许该 port 明确声明的 safe read/partial capability | degraded/partial marker |
| `Unavailable` | 否；可显式重读 readiness | unavailable，不自动 fallback private API |
| `Blocked` | 否 | blocker/issue ref；不声称 integration ready |
| `Unsupported` | 否 | unsupported contract/version；不猜 schema |

### 9.6 application 基础 port 停审

| 审查项 | 结论 | 缺口 / 后续 |
|---|---|---|
| all local generated ids covered | pass | physical generator 留 `RUN-DDD-001/002` |
| time/connectivity 与 owner time 分离 | pass | platform binding 留 Step 14 |
| digest stable fields 有正式承接 | pass for Step 7 | variants 留 Step 8 |
| UoW owner 与实现方明确 | pass | schema/atomic primitive 留 Step 11 |
| readiness 与 configured/success 分离 | pass with blockers | exact SDK capability 受 `RUN-UP-008` |

## 10. Runner-owned repository port 契约

### 10.1 capability / 接缝清单

| 对象组 / capability | repository 读取面 | repository 写入面 | 主要调用方 | Step 8～11 承接 |
|---|---|---|---|---|
| context / selection | context id、actor/scope current context、selection id、current selection by context、generation | save context/selection with expected version | selection/query/recovery service | Command/Query、invalidation flow、state matrix |
| acquisition / integrity / cache | task/cache/posture by id、binding lookup、paged candidates | save each object with expected version | acquisition/qualification/eviction/job | acquire/job DTO、qualification flow |
| run / control / owner projection | intent/control by id、by request/run refs、current projection | save intent/control/projection with expected version | lifecycle/control/query/recovery | request/control/query/consumer flow |
| resource / guard / recovery | observation/guard/case by id/subject、open cases page | save/replace observation、save guard/case | cleanup/recovery/query/job | cleanup/reconcile/state matrix |
| preview / diagnosis / handoff | by id/subject、latest safe ref only through explicit index | save projection/record/posture | presentation/handoff/query/job | diagnostic/handoff protocol/flow |
| read sections | explicit subject/generation reads | replace generation-matched projection only | query/refresh service | 12 Query DTO、refresh flow |

所有 `find_current` / `find_latest` 方法必须依赖正式索引条件并返回 `Option<Versioned<T>>`；实现不得扫描目录、按 mtime、按“最后插入”或解析 typed-ref 字符串猜 current/latest。

### 10.2 Context / selection repositories

```rust
/// Persists safe Runner context references only; never identity or project bodies.
pub trait RunnerContextRepository {
    async fn get(
        &self,
        context_id: RunnerContextId,
    ) -> Result<Option<Versioned<RunnerContextRef>>, ApplicationError>;

    async fn find_current_for_actor_scope(
        &self,
        actor_ref: ActorRef,
        scope_ref: RunnerScopeRef,
    ) -> Result<Option<Versioned<RunnerContextRef>>, ApplicationError>;

    async fn save(
        &self,
        context: RunnerContextRef,
        expected: RunnerExpectedVersion,
        uow: &dyn RunnerUnitOfWork,
    ) -> Result<RunnerVersion, ApplicationError>;
}

/// Persists explicit Release selections and their immutable generations.
pub trait ReleaseSelectionRepository {
    async fn get(
        &self,
        selection_id: RunnerSelectionId,
    ) -> Result<Option<Versioned<ReleaseSelection>>, ApplicationError>;

    async fn find_current_for_context(
        &self,
        context_id: RunnerContextId,
    ) -> Result<Option<Versioned<ReleaseSelection>>, ApplicationError>;

    async fn list_by_context(
        &self,
        context_id: RunnerContextId,
        page: RunnerRepositoryPage,
    ) -> Result<Page<Versioned<ReleaseSelection>>, ApplicationError>;

    async fn allocate_next_generation(
        &self,
        context_id: RunnerContextId,
        expected_current: Option<SelectionGenerationNumber>,
        uow: &dyn RunnerUnitOfWork,
    ) -> Result<SelectionGenerationNumber, ApplicationError>;

    async fn save(
        &self,
        selection: ReleaseSelection,
        expected: RunnerExpectedVersion,
        uow: &dyn RunnerUnitOfWork,
    ) -> Result<RunnerVersion, ApplicationError>;
}
```

| 闭合点 | 规则 |
|---|---|
| current context/selection | 由正式 index + state/generation 约束返回；不从 history/cache 任取一条 |
| generation allocation | 与 selection write 同 local UoW；不得用 timestamp 或 row count |
| invalidation propagation | repository 只保存对象；affected material/intent lookup 由 §10.3/§10.4 明确读取，不在 adapter 私下扫描修改 |
| query | 可读取 committed object；不得调用 `allocate_next_generation` 或 `save` |

### 10.3 Material repositories

```rust
/// Persists acquisition tasks and supports bounded operations-job scans.
pub trait AcquisitionTaskRepository {
    async fn get(
        &self,
        task_id: AcquisitionTaskId,
    ) -> Result<Option<Versioned<AcquisitionTask>>, ApplicationError>;

    async fn list_by_selection(
        &self,
        selection_id: RunnerSelectionId,
        page: RunnerRepositoryPage,
    ) -> Result<Page<Versioned<AcquisitionTask>>, ApplicationError>;

    async fn list_runnable(
        &self,
        page: RunnerRepositoryPage,
    ) -> Result<Page<Versioned<AcquisitionTask>>, ApplicationError>;

    async fn save(
        &self,
        task: AcquisitionTask,
        expected: RunnerExpectedVersion,
        uow: &dyn RunnerUnitOfWork,
    ) -> Result<RunnerVersion, ApplicationError>;
}

/// Persists local cache metadata while material bytes remain behind MaterialCachePort.
pub trait MaterialCacheEntryRepository {
    async fn get(
        &self,
        cache_entry_id: CacheEntryId,
    ) -> Result<Option<Versioned<MaterialCacheEntry>>, ApplicationError>;

    async fn find_by_source_binding(
        &self,
        binding: MaterialSourceBinding,
    ) -> Result<Option<Versioned<MaterialCacheEntry>>, ApplicationError>;

    async fn list_by_selection_generation(
        &self,
        generation: SelectionGenerationNumber,
        page: RunnerRepositoryPage,
    ) -> Result<Page<Versioned<MaterialCacheEntry>>, ApplicationError>;

    async fn list_eviction_candidates(
        &self,
        scope_ref: RunnerScopeRef,
        page: RunnerRepositoryPage,
    ) -> Result<Page<Versioned<MaterialCacheEntry>>, ApplicationError>;

    async fn save(
        &self,
        entry: MaterialCacheEntry,
        expected: RunnerExpectedVersion,
        uow: &dyn RunnerUnitOfWork,
    ) -> Result<RunnerVersion, ApplicationError>;
}

/// Persists verification posture independently from transfer and cache state.
pub trait IntegrityPostureRepository {
    async fn get(
        &self,
        posture_id: IntegrityPostureId,
    ) -> Result<Option<Versioned<IntegrityPosture>>, ApplicationError>;

    async fn find_current_for_cache_entry(
        &self,
        cache_entry_id: CacheEntryId,
    ) -> Result<Option<Versioned<IntegrityPosture>>, ApplicationError>;

    async fn save(
        &self,
        posture: IntegrityPosture,
        expected: RunnerExpectedVersion,
        uow: &dyn RunnerUnitOfWork,
    ) -> Result<RunnerVersion, ApplicationError>;
}
```

| repository | 读取面闭合 | 禁止事项 |
|---|---|---|
| task | job 可按 id/load + bounded runnable scan；返回 version | 不根据文件存在性创建 Complete |
| cache metadata | exact binding lookup 与 scoped candidate page | candidate 不等删除许可；不返回 bytes/path |
| integrity | cache entry 对应 current posture index | 不从 cache state 反造 verifier result |

`list_eviction_candidates(scope_ref, page)` 只返回指定 scope 内、已被 local policy 标成 candidate 的 metadata；application 仍必须逐项重读 `ProtectionGuard` 和 formal protection inputs。scope 是显式 typed 输入，不得由 cache binding、目录路径或 page cursor 推导。Repository 不得删除材料或把 Candidate 改成 Evicted。

### 10.4 Lifecycle repositories

```rust
/// Persists Runner-local run intents, never Sandbox or Runtime truth.
pub trait RunIntentRepository {
    async fn get(
        &self,
        run_intent_id: RunIntentId,
    ) -> Result<Option<Versioned<RunIntent>>, ApplicationError>;

    async fn find_by_sandbox_request_ref(
        &self,
        request_ref: SandboxRequestRef,
    ) -> Result<Option<Versioned<RunIntent>>, ApplicationError>;

    async fn list_by_selection_generation(
        &self,
        generation: SelectionGenerationNumber,
        page: RunnerRepositoryPage,
    ) -> Result<Page<Versioned<RunIntent>>, ApplicationError>;

    async fn save(
        &self,
        intent: RunIntent,
        expected: RunnerExpectedVersion,
        uow: &dyn RunnerUnitOfWork,
    ) -> Result<RunnerVersion, ApplicationError>;
}

/// Persists one explicit Runner-local control intent per idempotent request.
pub trait ControlIntentRepository {
    async fn get(
        &self,
        control_intent_id: ControlIntentId,
    ) -> Result<Option<Versioned<ControlIntent>>, ApplicationError>;

    async fn list_by_run_intent(
        &self,
        run_intent_id: RunIntentId,
        page: RunnerRepositoryPage,
    ) -> Result<Page<Versioned<ControlIntent>>, ApplicationError>;

    async fn save(
        &self,
        intent: ControlIntent,
        expected: RunnerExpectedVersion,
        uow: &dyn RunnerUnitOfWork,
    ) -> Result<RunnerVersion, ApplicationError>;
}

/// Persists an owner-attributed read projection without becoming owner truth.
pub trait OwnerRunProjectionRepository {
    async fn get_by_run_intent(
        &self,
        run_intent_id: RunIntentId,
    ) -> Result<Option<Versioned<OwnerRunProjection>>, ApplicationError>;

    async fn find_by_owner_subject(
        &self,
        subject_ref: OwnerSubjectRef,
    ) -> Result<Option<Versioned<OwnerRunProjection>>, ApplicationError>;

    async fn save(
        &self,
        projection: OwnerRunProjection,
        expected: RunnerExpectedVersion,
        uow: &dyn RunnerUnitOfWork,
    ) -> Result<RunnerVersion, ApplicationError>;
}
```

| 闭合点 | 规则 |
|---|---|
| request lookup | formal request ref 映射到 local intent，adapter 不解析 ref 字符串 |
| invalidation lookup | generation page 支撑 selection invalidation flow；每项 expected-version update |
| control history | list 只返回 local intents；不把最后一条 control 当 owner current state |
| owner projection | 只保存 attributed safe axes；source version/gap check 在 application flow |

### 10.5 Resource / protection / recovery repositories

```rust
/// Persists bounded local observations; it does not allocate resources.
pub trait ResourceObservationRepository {
    async fn get(
        &self,
        observation_id: ResourceObservationId,
    ) -> Result<Option<Versioned<ResourceObservation>>, ApplicationError>;

    async fn find_current_by_resource(
        &self,
        resource_key: ResourceKey,
    ) -> Result<Option<Versioned<ResourceObservation>>, ApplicationError>;

    async fn save(
        &self,
        observation: ResourceObservation,
        expected: RunnerExpectedVersion,
        uow: &dyn RunnerUnitOfWork,
    ) -> Result<RunnerVersion, ApplicationError>;
}

/// Persists conservative protection decisions and their complete input posture.
pub trait ProtectionGuardRepository {
    async fn get(
        &self,
        guard_id: ProtectionGuardId,
    ) -> Result<Option<Versioned<ProtectionGuard>>, ApplicationError>;

    async fn find_by_subject(
        &self,
        subject: ProtectedSubjectRef,
    ) -> Result<Option<Versioned<ProtectionGuard>>, ApplicationError>;

    async fn save(
        &self,
        guard: ProtectionGuard,
        expected: RunnerExpectedVersion,
        uow: &dyn RunnerUnitOfWork,
    ) -> Result<RunnerVersion, ApplicationError>;
}

/// Persists local freeze/reconciliation state without owning owner recovery truth.
pub trait RecoveryCaseRepository {
    async fn get(
        &self,
        recovery_case_id: RecoveryCaseId,
    ) -> Result<Option<Versioned<RecoveryCase>>, ApplicationError>;

    async fn find_open_by_subjects(
        &self,
        subjects: RecoverySubjectRefSet,
        page: RunnerRepositoryPage,
    ) -> Result<Page<Versioned<RecoveryCase>>, ApplicationError>;

    async fn list_reconcile_candidates(
        &self,
        page: RunnerRepositoryPage,
    ) -> Result<Page<Versioned<RecoveryCase>>, ApplicationError>;

    async fn save(
        &self,
        recovery_case: RecoveryCase,
        expected: RunnerExpectedVersion,
        uow: &dyn RunnerUnitOfWork,
    ) -> Result<RunnerVersion, ApplicationError>;
}
```

`find_open_by_subjects` 的 repository implementation 必须使用正式 subject index 和 exact typed refs，并遵守传入的 bounded page；不得扫描序列化 body 或解析 ref prefix。返回多个 open cases 时由 application 显式合并/关联或进入 conflict，不能任取 newest。

### 10.6 Preview / diagnosis / handoff repositories

```rust
/// Persists bounded, redacted preview projections only.
pub trait OutputPreviewRepository {
    async fn get(
        &self,
        preview_id: OutputPreviewId,
    ) -> Result<Option<Versioned<OutputPreview>>, ApplicationError>;

    async fn find_for_subject(
        &self,
        subject_ref: DiagnosticSubjectRef,
    ) -> Result<Option<Versioned<OutputPreview>>, ApplicationError>;

    /// Looks up the current preview by the canonical ordered-unique exact
    /// diagnostic subject set. A subset/superset or a single "latest" item is
    /// not a valid match.
    async fn find_for_subjects(
        &self,
        subjects: DiagnosticSubjectRefSet,
    ) -> Result<Option<Versioned<OutputPreview>>, ApplicationError>;

    async fn save(
        &self,
        preview: OutputPreview,
        expected: RunnerExpectedVersion,
        uow: &dyn RunnerUnitOfWork,
    ) -> Result<RunnerVersion, ApplicationError>;
}

/// Persists local diagnostic classifications, never formal evidence or verdicts.
pub trait FailureDiagnosisRepository {
    async fn get(
        &self,
        diagnosis_id: FailureDiagnosisId,
    ) -> Result<Option<Versioned<FailureDiagnosis>>, ApplicationError>;

    async fn find_for_subjects(
        &self,
        subjects: DiagnosticSubjectRefSet,
    ) -> Result<Option<Versioned<FailureDiagnosis>>, ApplicationError>;

    async fn save(
        &self,
        diagnosis: FailureDiagnosis,
        expected: RunnerExpectedVersion,
        uow: &dyn RunnerUnitOfWork,
    ) -> Result<RunnerVersion, ApplicationError>;
}

/// Persists Runner-local handoff intent and receipt posture only.
pub trait HandoffPostureRepository {
    async fn get(
        &self,
        handoff_id: DiagnosticHandoffId,
    ) -> Result<Option<Versioned<HandoffPosture>>, ApplicationError>;

    async fn list_by_diagnosis(
        &self,
        diagnosis_ref: FailureDiagnosisRef,
        page: RunnerRepositoryPage,
    ) -> Result<Page<Versioned<HandoffPosture>>, ApplicationError>;

    async fn save(
        &self,
        handoff: HandoffPosture,
        expected: RunnerExpectedVersion,
        uow: &dyn RunnerUnitOfWork,
    ) -> Result<RunnerVersion, ApplicationError>;
}
```

Repository 只保存 Step 6 的 already-redacted/bounded objects。它不能执行 redaction、读取 raw logs、构造 handoff package、确认 evidence 或按 mtime 猜 latest diagnosis/preview。

`OutputPreviewRepository.find_for_subject(...)` 只使用单 subject 的正式 subject index；`OutputPreviewRepository.find_for_subjects(...)` 与 `FailureDiagnosisRepository.find_for_subjects(...)` 只使用 canonical ordered-unique `DiagnosticSubjectRefSet` 的 exact-set index。三者都不得按创建时间、mtime、最后插入或集合的任意子集/superset命中记录；不存在 exact current index时返回 `None`，由Query或Refresh Job按各自契约处理。

### 10.7 Read-section repository / assembler source

```rust
/// Loads committed safe sections for pure RunnerReadModel composition.
pub trait RunnerReadSectionRepository {
    async fn load_sources(
        &self,
        subject_ref: RunnerReadSubjectRef,
        actor_context: ActorContext,
    ) -> Result<RunnerReadSources, ApplicationError>;

    async fn load_section(
        &self,
        subject_ref: RunnerReadSubjectRef,
        section: ReadModelSection,
        actor_context: ActorContext,
    ) -> Result<RunnerReadSection, ApplicationError>;

    /// Loads the already-committed section together with its local version for
    /// an explicit refresh replacement. A missing value means that no formal
    /// projection identity exists; the refresh flow must report Blocked rather
    /// than inventing one.
    async fn load_section_versioned(
        &self,
        subject_ref: RunnerReadSubjectRef,
        section: ReadModelSection,
        actor_context: ActorContext,
    ) -> Result<Option<Versioned<RunnerReadSection>>, ApplicationError>;

    async fn replace_projection_if_generation_matches(
        &self,
        projection_ref: RunnerProjectionRef,
        section: RunnerReadSection,
        expected_generation: ReadModelGeneration,
        expected: RunnerExpectedVersion,
        uow: &dyn RunnerUnitOfWork,
    ) -> Result<RunnerVersion, ApplicationError>;
}
```

| 函数 | 约束 |
|---|---|
| `load_sources` | 只读 committed safe sections；所有section必须与requested subject一致并携带同一 `composition_generation`，包括body=None的missing/disabled section；不调用external port、不refresh、不repair |
| `load_section` | 返回 finite `RunnerReadSectionBody`；requested key、body variant、subject和surface必须一致；missing显式返回 body=None unavailable section |
| `load_section_versioned` | 仅供显式 Refresh Job 读取已有 section identity/version；缺失返回 `None`，不得由 refresh 创建 projection identity；Query 仍使用 `load_section` |
| `replace_projection_if_generation_matches` | 只供显式 Refresh Job/consumer application flow；Query 禁止调用；generation mismatch 拒绝旧结果 |

`RunnerReadModel` 本身不作为第二 truth 持久化。允许持久化的是有明确来源与 generation 的 safe section/projection；composite model 每次纯组合。

### 10.8 Runner-owned repository 停审

| 审查项 | 结论 | 缺口 / 后续 |
|---|---|---|
| 17 对象读取/写入面 | pass | owner DTO 不进入 repository |
| all mutable writes paired with version | pass | physical schema 留 Step 11 |
| Query 所需读取面 | pass | visibility DTO 留 Step 8 |
| invalidation/recovery/candidate scans bounded | pass | page limit/config 留 Step 14 |
| cache bytes/raw log/sibling body | pass：均不进入 repository |
| current/latest 是否靠正式 index | pass | durable index 设计留 Step 11 |

## 11. Idempotency、stored result 与 operations repository 契约

### 11.1 capability / 接缝清单

| capability | 接缝 | 调用方 | 实现方 | 强制边界 |
|---|---|---|---|---|
| write/event/job reservation | `RunnerIdempotencyRepository` | command/consumer/job services | infra result store adapter | Query 不 reserve；same key different digest=Conflict |
| duplicate replay | `StoredRunnerResultRepository` | entry/worker/operations facade | infra result store adapter | 必须读完整 safe surface；不得重跑 mutation/job |
| local job persistence | `RunnerOperationsRepository` | operations runner/job service | infra operation store | claim/checkpoint/report 与 owner lease分离 |
| consumer dedup/order marker | `RunnerConsumerReceiptRepository` | planned consumer service | infra result/operation store | 当前只可 blocked/unsupported；不伪造 owner cursor |

### 11.2 Idempotency repository

```rust
/// Reserves and completes idempotency for Runner write, consumer, and job channels.
pub trait RunnerIdempotencyRepository {
    async fn get(
        &self,
        key: RunnerOperationIdempotencyKey,
    ) -> Result<Option<Versioned<RunnerIdempotencyRecord>>, ApplicationError>;

    async fn reserve(
        &self,
        record: RunnerIdempotencyRecord,
        expected: RunnerExpectedVersion,
        uow: &dyn RunnerUnitOfWork,
    ) -> Result<RunnerVersion, ApplicationError>;

    async fn complete(
        &self,
        record: RunnerIdempotencyRecord,
        expected: RunnerVersion,
        uow: &dyn RunnerUnitOfWork,
    ) -> Result<RunnerVersion, ApplicationError>;

    async fn mark_conflict(
        &self,
        record: RunnerIdempotencyRecord,
        expected: RunnerVersion,
        uow: &dyn RunnerUnitOfWork,
    ) -> Result<RunnerVersion, ApplicationError>;
}
```

| path | 必须行为 | 禁止行为 |
|---|---|---|
| first request | `get -> None`，factory reserve，`ExpectedVersion::Absent` | 直接执行 side effect 后补 reservation |
| duplicate same name/digest | Completed→按 `result_ref` 读取 stored surface；Reserved→返回 in-progress/unknown typed surface | 重跑 transition、owner call、scan |
| same key different name/digest | versioned mark Conflict 或返回 conflict surface | 用新 body 覆盖旧 record |
| unknown original outcome | 保留 Reserved/associated recovery disposition，先 read-only reconcile | timeout 后自动删除 reservation/replay |

### 11.3 Stored result repository

```rust
/// Stores and retrieves complete safe replay surfaces by a body-free result ref.
pub trait StoredRunnerResultRepository {
    async fn get_shell(
        &self,
        result_ref: RunnerApplicationResultRef,
    ) -> Result<Option<StoredRunnerOperationResult>, ApplicationError>;

    async fn save_command_result(
        &self,
        shell: StoredRunnerOperationResult,
        surface: RunnerStoredCommandResult,
        uow: &dyn RunnerUnitOfWork,
    ) -> Result<(), ApplicationError>;

    async fn get_command_result(
        &self,
        result_ref: RunnerApplicationResultRef,
    ) -> Result<Option<RunnerStoredCommandResult>, ApplicationError>;

    async fn save_consumer_receipt(
        &self,
        shell: StoredRunnerOperationResult,
        receipt: RunnerStoredConsumerReceipt,
        uow: &dyn RunnerUnitOfWork,
    ) -> Result<(), ApplicationError>;

    async fn get_consumer_receipt(
        &self,
        result_ref: RunnerApplicationResultRef,
    ) -> Result<Option<RunnerStoredConsumerReceipt>, ApplicationError>;

    async fn save_job_report(
        &self,
        shell: StoredRunnerOperationResult,
        report: RunnerJobReport,
        uow: &dyn RunnerUnitOfWork,
    ) -> Result<(), ApplicationError>;

    async fn get_job_report(
        &self,
        result_ref: RunnerApplicationResultRef,
    ) -> Result<Option<RunnerJobReport>, ApplicationError>;
}
```

`RunnerStoredCommandResult` 与 `RunnerStoredConsumerReceipt` 的 variants/body 由 Step 8 定义；它们必须是完整、安全、可重复返回的 public surface，而不是 placeholder。Application 在同一 UoW 中先保存 shell+surface，再 complete idempotency record。若 idempotency=Completed 但 surface missing，返回 consistency failure/unknown，不重跑原操作。

### 11.4 Operations repository

```rust
/// Persists local job entries, claims, checkpoints, and terminal report references.
pub trait RunnerOperationsRepository {
    async fn get_entry(
        &self,
        job_run_ref: JobRunRef,
    ) -> Result<Option<Versioned<RunnerOperationsJobEntry>>, ApplicationError>;

    async fn list_runnable_entries(
        &self,
        kinds: Vec<RunnerOperationsJobKind>,
        page: RunnerRepositoryPage,
    ) -> Result<Page<Versioned<RunnerOperationsJobEntry>>, ApplicationError>;

    async fn save_entry(
        &self,
        entry: RunnerOperationsJobEntry,
        expected: RunnerExpectedVersion,
        uow: &dyn RunnerUnitOfWork,
    ) -> Result<RunnerVersion, ApplicationError>;

    async fn get_claim(
        &self,
        job_run_ref: JobRunRef,
    ) -> Result<Option<Versioned<RunnerJobClaim>>, ApplicationError>;

    async fn save_claim(
        &self,
        claim: RunnerJobClaim,
        expected: RunnerExpectedVersion,
        uow: &dyn RunnerUnitOfWork,
    ) -> Result<RunnerVersion, ApplicationError>;

    async fn get_checkpoint(
        &self,
        job_run_ref: JobRunRef,
    ) -> Result<Option<Versioned<RunnerJobCheckpoint>>, ApplicationError>;

    async fn save_checkpoint(
        &self,
        checkpoint: RunnerJobCheckpoint,
        expected: RunnerExpectedVersion,
        uow: &dyn RunnerUnitOfWork,
    ) -> Result<RunnerVersion, ApplicationError>;

    async fn save_result(
        &self,
        result: RunnerOperationsJobResult,
        expected_entry_version: RunnerVersion,
        uow: &dyn RunnerUnitOfWork,
    ) -> Result<(), ApplicationError>;
}
```

| contract point | 规则 |
|---|---|
| runnable list | bounded、stable ordering、显式 kind；不扫隐藏目录/进程猜 job |
| claim | local exclusive claim only；不是 Sandbox lease、OS lock 或 owner allocation |
| checkpoint | body-free refs + basis；unknown readback 进入 recovery，不自动 resume side effect |
| result | report/stored result/idempotency 在同 local terminal boundary 配对 |
| duplicate job | 先 idempotency lookup + stored `RunnerJobReport`；不 acquire claim、不重新 scan |

### 11.5 Consumer receipt / ordering repository

```rust
/// Persists planned-consumer dedup and safe receipt markers without owning an owner cursor.
pub trait RunnerConsumerReceiptRepository {
    async fn get_by_dedup_key(
        &self,
        source_family: RunnerConsumerSourceFamily,
        dedup_key: RunnerOperationIdempotencyKey,
    ) -> Result<Option<RunnerStoredConsumerReceipt>, ApplicationError>;

    async fn get_last_applied_marker(
        &self,
        source_family: RunnerConsumerSourceFamily,
        subject_ref: OwnerSubjectRef,
    ) -> Result<Option<RunnerConsumerAppliedMarker>, ApplicationError>;

    async fn save_applied_marker(
        &self,
        marker: RunnerConsumerAppliedMarker,
        uow: &dyn RunnerUnitOfWork,
    ) -> Result<(), ApplicationError>;
}
```

`RunnerConsumerAppliedMarker` 只能保存 formal event ref、formal source version/order marker、subject ref、dedup key 和 stored receipt ref。它不是 owner cursor，也不能从本地 arrival time 构造。由于四类 consumer 当前 blocked，本 port 只闭合未来 seam 和 negative readiness path；Step 8/上游未提供 formal envelope/order type 前不得调用 `save_applied_marker`。

### 11.6 application result/operations 停审

| 审查项 | 结论 | 缺口 / 后续 |
|---|---|---|
| duplicate command/event/job replay | pass：都有 complete stored surface lookup | surface variants 留 Step 8 |
| Query idempotency | pass：明确禁止 |
| result save 与 idempotency complete 顺序 | pass：same local UoW，先 surface 后 complete |
| job claim/checkpoint 与 owner lease分离 | pass |
| consumer order marker 是否伪造 | pass with blocker | formal envelope/order 受 `RUN-UP-001~005/008` |

## 12. 14 个 Required Port / Adapter 语义契约

### 12.1 总览与通用调用结果

| # | Required port | 定义 owner | infra 实现候选（逻辑名） | 当前正向 readiness | 主要 blocker |
|---:|---|---|---|---|---|
| 1 | `ContextReadPort` | application | context SDK/API adapter | blocked/pending | `RUN-UP-008` + owner conditions |
| 2 | `ReleaseAuthorityReadPort` | application | Artifact/Governance SDK adapter | blocked | `RUN-UP-001/002/008` |
| 3 | `MaterialSourcePort` | application | Artifact material adapter | blocked | `RUN-UP-001/008` |
| 4 | `IntegrityVerifierPort` | application | owner-policy verifier adapter | blocked | `RUN-UP-001/002/007/008` |
| 5 | `MaterialCachePort` | application | local quarantine/cache adapter | logical only | `RUN-DDD-001~003` |
| 6 | `SandboxRunPort` | application | public Sandbox SDK/API adapter | blocked | `RUN-UP-003/007/008` |
| 7 | `RuntimeStatusReadPort` | application | public Runtime safe-read adapter | blocked | `RUN-UP-004/008` |
| 8 | `PlatformResourcePort` | application | platform semantic probe adapter | blocked/pending | `RUN-UP-007`、`RUN-DDD-002` |
| 9 | `DiagnosticReadPort` | application | bounded diagnostic source adapter | blocked | `RUN-UP-004/005/008` |
| 10 | `ObservabilityHandoffPort` | application | public Observability handoff adapter | blocked | `RUN-UP-005/008` |
| 11 | `ArchiveReferencePort` | application | public Archive reference adapter | blocked/peripheral | `RUN-UP-006/008` |
| 12 | `RunnerStateStorePort` | application | local state-store capability adapter | logical only | `RUN-DDD-001~003` |
| 13 | `ClockConnectivityPort` | application | local platform clock/connectivity adapter | logical only | `RUN-DDD-002` |
| 14 | `RedactionPort` | application | mandatory policy/redaction adapter | blocked | `RUN-UP-005/008` |

这里的“逻辑 only”表示 semantic contract 可以完成，但没有物理实现仓、产品、schema、路径或测试事实；“blocked”表示除 safe readiness/negative path 外不得宣称可正向调用。

```rust
/// Outcome of an external side-effect submission without collapsing ambiguity.
pub enum RunnerSubmissionOutcome<A, R, C> {
    /// The formal owner explicitly accepted and returned a safe receipt.
    Accepted(A),
    /// The formal owner explicitly rejected the request.
    Rejected(R),
    /// The expected basis conflicts with the owner's safe current basis.
    Conflict(C),
    /// The call may have reached the owner but no trustworthy result is known.
    Unknown(RunnerUnknownOutcome),
    /// The semantic contract or adapter readiness does not permit the call.
    Blocked(RunnerPortIssueRef),
}

/// Safe ambiguity marker; it carries no retry permission.
pub struct RunnerUnknownOutcome {
    pub issue_ref: RunnerPortIssueRef,
    pub observed_at: Timestamp,
    pub source_attribution: Option<SourceAttribution>,
}

/// Explicit completion of a local or owner effect, scoped to that effect only.
pub enum RunnerEffectOutcome<S, F, C> {
    Confirmed(S),
    Failed(F),
    Conflict(C),
    Unknown(RunnerUnknownOutcome),
    Blocked(RunnerPortIssueRef),
}
```

`RunnerSubmissionOutcome::Accepted` 不能被通用 mapper 翻译为 running；`RunnerEffectOutcome::Confirmed` 只能证明其类型参数所代表的单一 effect，例如 stop confirmed 不能证明 cleanup/release。`ApplicationError` 仅用于 wiring、serialization contract violation、store/runtime failure 等无法形成业务 safe outcome 的错误；flow 不得解析错误字符串猜 `Rejected/Conflict/Unknown`。

### 12.2 `ContextReadPort`

#### 12.2.1 capability / 对象承接

| capability | 请求 basis | safe result | Step 6 消费方 | 禁止事项 |
|---|---|---|---|---|
| resolve actor/session/project/scope/platform context | trusted inbound actor/session hints + explicit scope | body-free context resolution | `RunnerContextRef` factory、visibility/query | 不返回 profile/token/project body；不从 local role 猜 scope |
| resolve read subject visibility | actor context + typed read subject | scope/visibility/source ref | `RunnerReadVisibilityDecision` | denied/unknown 不能返回 hidden body |

```rust
/// Explicit inputs used to resolve a safe Runner context.
pub struct RunnerContextResolutionQuery {
    pub actor_context: ActorContext,
    pub requested_scope_ref: Option<RunnerScopeRef>,
    pub platform_ref: PlatformContextRef,
}

/// Body-free result used to construct a RunnerContextRef.
pub struct RunnerContextResolution {
    pub actor_ref: ActorRef,
    pub session_ref: SessionRef,
    pub project_ref: Option<ProjectRef>,
    pub scope_ref: RunnerScopeRef,
    pub platform_ref: PlatformContextRef,
    pub freshness: SourceFreshness,
    pub visibility: VisibilityPosture,
    pub source_attribution: SourceAttribution,
}

/// Resolves trusted context and visibility without copying sibling truth.
pub trait ContextReadPort {
    async fn resolve_context(
        &self,
        query: RunnerContextResolutionQuery,
    ) -> Result<RunnerSemanticRead<RunnerContextResolution>, ApplicationError>;

    async fn resolve_read_visibility(
        &self,
        actor_context: ActorContext,
        locator: RunnerReadSubjectLocator,
    ) -> Result<RunnerReadVisibilityResolution, ApplicationError>;
}
```

`RunnerReadVisibilityResolution` 无论 visible、restricted、unknown、unavailable 或 unsupported 都必须返回同一个 body-free envelope，并包含 canonical `read_subject_ref`、`scope_ref`、freshness、degraded marker 和 `VisibilityResolutionSourceRef`；只有 protected body 可被拒绝，subject surface不能在denied path消失。Query service只能把finite `RunnerReadSubjectLocator`交给resolver；不得从loaded object body、route、page cursor或ref string反推read subject/scope。`Canonical` variant只允许承接public contract已经声明为canonical的`RunnerReadSubjectRef`，不能成为generic string escape hatch。

#### 12.2.2 状态与实现边界

| 结果 | application 处理 | adapter 禁止映射 |
|---|---|---|
| `Current` | 可构造 context/visibility decision；副作用仍需其他 gate | login success 自动等于 scope authorized |
| `Stale` | 只读可降级；危险副作用 blocked | 旧 cache 标 current |
| `Restricted` | 返回 marker/允许的 safe partial；不返回正文 | denied 当 not-found 后读旁路 |
| `Unavailable/Unsupported` | 显式 unavailable/blocked | fallback local role/history |

上表的 `RunnerSemanticRead` 分支适用于 `resolve_context`。`resolve_read_visibility` 不使用会在 Restricted/Unavailable 分支丢失 value 的 generic wrapper，而由 `RunnerReadVisibilityResolution.visibility/freshness/degraded` 表达同样姿态；这是为了使 denied Query 仍可返回 canonical、body-free `RunnerViewSurface`，不是放宽 visibility。

### 12.3 `ReleaseAuthorityReadPort`

#### 12.3.1 semantic carriers

```rust
/// Exact immutable Release/version request; implicit selectors are unrepresentable.
pub struct ReleaseAuthorityQuery {
    pub release_ref: ReleaseRef,
    pub version_ref: ArtifactVersionRef,
    pub scope_ref: RunnerScopeRef,
    pub generation: SelectionGenerationNumber,
    pub actor_ref: ActorRef,
}

/// Safe authority result without Release, Artifact, or Governance bodies.
pub struct ReleaseAuthorityAssessment {
    pub binding: SelectionBinding,
    pub authority_ref: AuthoritySnapshotRef,
    pub approval_posture: AuthorityApprovalPosture,
    pub baseline_posture: AuthorityBaselinePosture,
    pub lifecycle_posture: AuthorityLifecyclePosture,
    pub source_digest_ref: Option<SourceDigestRef>,
    pub freshness: SourceFreshness,
    pub visibility: VisibilityPosture,
    pub source_attribution: SourceAttribution,
}

/// Explicit filter for selectable immutable releases; it has no latest/default mode.
pub struct SelectableReleaseQuery {
    pub actor_ref: ActorRef,
    pub scope_ref: RunnerScopeRef,
    pub page: RunnerRepositoryPage,
}

/// Body-free item that may be explicitly selected by exact refs.
pub struct SelectableReleaseSummary {
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
```

`AuthorityApprovalPosture`、`AuthorityBaselinePosture`、`AuthorityLifecyclePosture` 是 semantic projection carriers：必须能表达 approved/baselined、not-approved/not-baselined、revoked/expired/conflict、unknown/unsupported；exact upstream enum/schema 受 `RUN-UP-001/002/008`，Step 8 只能按正式上游证据闭合，不可将本地布尔值写成 truth。

```rust
/// Reads exact Release and Governance authority posture through formal surfaces.
pub trait ReleaseAuthorityReadPort {
    async fn assess_exact_release(
        &self,
        query: ReleaseAuthorityQuery,
    ) -> Result<RunnerSemanticRead<ReleaseAuthorityAssessment>, ApplicationError>;

    async fn list_selectable_releases(
        &self,
        query: SelectableReleaseQuery,
    ) -> Result<RunnerSemanticRead<Page<SelectableReleaseSummary>>, ApplicationError>;

    async fn revalidate_authority(
        &self,
        binding: SelectionBinding,
        previous_authority_ref: AuthoritySnapshotRef,
    ) -> Result<RunnerSemanticRead<ReleaseAuthorityAssessment>, ApplicationError>;
}
```

#### 12.3.2 fail-closed rules

- Port input type不提供 `latest`、branch、tag、directory 或“use cached”字段。
- `Current` 必须同时带 exact binding、authority ref、source attribution 和可用 visibility；缺一返回 Stale/Restricted/Unavailable/Unsupported。
- Adapter 不合并 Artifact 与 Governance body，不在 Runner 内决定 approval policy；只映射正式 safe authority surface。
- revocation、expiry、scope conflict 或 baseline/approval 不可证明都阻止 acquisition/run；历史成功和本地 cache 不得覆盖。
- `list_selectable_releases` 的 page cursor 只来自 formal adapter mapping；“第一项”不表示默认选择。

### 12.4 `MaterialSourcePort`

#### 12.4.1 semantic carriers

```rust
/// Resolves a safe locator and immutable manifest references for one exact binding.
pub struct MaterialSourceQuery {
    pub binding: SelectionBinding,
    pub authority_ref: AuthoritySnapshotRef,
    pub platform_ref: PlatformContextRef,
}

/// Safe source resolution; locator_ref is not a URL or credential.
pub struct MaterialSourceResolution {
    pub binding: SelectionBinding,
    pub locator_ref: ExternalLocatorRef,
    pub manifest_ref: ManifestRef,
    pub expected_digest_ref: SourceDigestRef,
    pub transport_constraints: MaterialTransportConstraints,
    pub source_attribution: SourceAttribution,
}

/// Requests a bounded transfer into a cache-owned quarantine sink.
pub struct MaterialTransferRequest {
    pub task_id: AcquisitionTaskId,
    pub binding: SelectionBinding,
    pub locator_ref: ExternalLocatorRef,
    pub quarantine_sink_ref: QuarantineSinkRef,
    pub resume_marker: Option<MaterialTransferResumeMarker>,
}

/// Transfer result never includes qualified state.
pub enum MaterialTransferOutcome {
    Progress(TransferProgress),
    Paused(MaterialTransferResumeMarker),
    Complete(MaterialTransferCompletion),
    Failed(AcquisitionFailure),
    Unknown(RunnerUnknownOutcome),
    Blocked(RunnerPortIssueRef),
}

/// Safe completion references bytes already placed in quarantine.
pub struct MaterialTransferCompletion {
    pub material_handle: LocalMaterialHandle,
    pub observed_digest_ref: Option<SourceDigestRef>,
    pub completed_at: Timestamp,
    pub source_attribution: SourceAttribution,
}
```

```rust
/// Resolves source metadata and transfers bytes only into a quarantine sink.
pub trait MaterialSourcePort {
    async fn resolve_source(
        &self,
        query: MaterialSourceQuery,
    ) -> Result<RunnerSemanticRead<MaterialSourceResolution>, ApplicationError>;

    async fn transfer_to_quarantine(
        &self,
        request: MaterialTransferRequest,
    ) -> Result<MaterialTransferOutcome, ApplicationError>;

    async fn read_transfer_outcome(
        &self,
        task_id: AcquisitionTaskId,
        binding: SelectionBinding,
    ) -> Result<RunnerSemanticRead<MaterialTransferOutcome>, ApplicationError>;
}
```

#### 12.4.2 transfer rules

| rule | 约束 |
|---|---|
| locator secrecy | `ExternalLocatorRef`/adapter private binding 隔离 URL、token、credential；application/store 不见 secret locator |
| sink | transfer 只能写 `MaterialCachePort.open_quarantine_sink` 提供的 opaque sink；不写用户任意 path |
| resume | resume marker 必须与 exact binding/source attribution 匹配，并先重验 authority；不能仅凭 byte offset |
| complete | 只形成 quarantine handle；不形成 Verified/Qualified |
| ambiguity | readback 不能证明时返回 Unknown，job checkpoint/recovery 承接；不重启新 transfer 覆盖旧 task |
| content | Runner 不修改、重打包、重签名或以重命名修复 Release 内容 |

### 12.5 `IntegrityVerifierPort`

```rust
/// Verification request bound to owner manifest/policy and exact local material.
pub struct IntegrityVerificationRequest {
    pub task_id: AcquisitionTaskId,
    pub cache_entry_ref: CacheEntryRef,
    pub material_handle: LocalMaterialHandle,
    pub source_binding: MaterialSourceBinding,
    pub manifest_ref: ManifestRef,
    pub authority_ref: AuthoritySnapshotRef,
    pub platform_ref: PlatformContextRef,
}

/// Semantic check result that cannot silently default to pass.
pub enum VerificationCheckPosture {
    Passed,
    Failed(VerificationFailureRef),
    Unknown(RunnerPortIssueRef),
    Unsupported(RunnerPortIssueRef),
}

/// Complete verification result for the exact requested basis.
pub struct IntegrityVerificationResult {
    pub source_binding: MaterialSourceBinding,
    pub manifest_ref: ManifestRef,
    pub digest_result: DigestCheckResult,
    pub signature_result: SignatureCheckResult,
    pub platform_result: PlatformCompatibilityResult,
    pub authority_freshness: SourceFreshness,
    pub source_attribution: SourceAttribution,
}

/// Verifies bytes under owner-supplied manifest, signature, and compatibility rules.
pub trait IntegrityVerifierPort {
    async fn verify(
        &self,
        request: IntegrityVerificationRequest,
    ) -> Result<RunnerSemanticRead<IntegrityVerificationResult>, ApplicationError>;
}
```

Verifier adapter 不得自选宽松 digest/signature policy、跳过 manifest、把 platform probe 当 Sandbox approval，或在 unsupported 算法/规则时返回 pass。Verification result 必须原样保留 exact binding、manifest、authority freshness 与 attribution，供 `IntegrityPosture` 构造和 cache promotion 前二次比较。

### 12.6 `MaterialCachePort`

```rust
/// Opaque sink used only for one exact quarantine transfer.
pub struct QuarantineSinkRef(pub String);

/// Formal local release receipt scoped to one cache handle and basis.
pub struct LocalMaterialReleaseReceipt {
    pub cache_entry_ref: CacheEntryRef,
    pub material_handle: LocalMaterialHandle,
    pub released_at: Timestamp,
    pub release_basis_ref: OwnerResolutionRef,
}

/// Opens quarantine, promotes verified material, and performs guarded local release.
pub trait MaterialCachePort {
    async fn open_quarantine_sink(
        &self,
        task_id: AcquisitionTaskId,
        binding: MaterialSourceBinding,
    ) -> Result<RunnerEffectOutcome<QuarantineSinkRef, CacheFailureRef, CacheConflictRef>, ApplicationError>;

    async fn bind_completed_material(
        &self,
        sink_ref: QuarantineSinkRef,
        completion: MaterialTransferCompletion,
        binding: MaterialSourceBinding,
    ) -> Result<RunnerEffectOutcome<LocalMaterialHandle, CacheFailureRef, CacheConflictRef>, ApplicationError>;

    async fn promote_verified(
        &self,
        cache_entry_ref: CacheEntryRef,
        material_handle: LocalMaterialHandle,
        verification: IntegrityVerificationResult,
        authority_ref: AuthoritySnapshotRef,
    ) -> Result<RunnerEffectOutcome<CachePromotionReceipt, CacheFailureRef, CacheConflictRef>, ApplicationError>;

    async fn release_material(
        &self,
        cache_entry_ref: CacheEntryRef,
        material_handle: LocalMaterialHandle,
        guard_ref: ProtectionGuardRef,
        cleanup_basis: OwnerCleanupBasis,
    ) -> Result<RunnerEffectOutcome<LocalMaterialReleaseReceipt, CacheFailureRef, CacheConflictRef>, ApplicationError>;

    async fn read_material_posture(
        &self,
        cache_entry_ref: CacheEntryRef,
    ) -> Result<RunnerSemanticRead<LocalMaterialPosture>, ApplicationError>;
}
```

| operation | 前置 | confirmed 只证明 | 禁止 |
|---|---|---|---|
| open sink | exact binding + cache capability | quarantine sink exists | bytes complete/verified |
| bind complete | source completion matches sink/binding | opaque material handle bound | qualified |
| promote | Verified + same binding + authority Current | local promotion effect | approval/running |
| release | `ProtectionGuard::Releasable` + current cleanup basis | local handle safely released | owner cleaned/evidence deleted |

`MaterialCachePort` 管理 bytes/opaque handle；`MaterialCacheEntryRepository` 管理 Runner metadata。Step 9 必须给出两者 crash-safe ordering，Step 11 再定义 atomicity/recovery；当前不锁文件 rename、filesystem、database 或 directory layout。

### 12.7 `SandboxRunPort`

#### 12.7.1 semantic request/result carriers

```rust
/// Exact, qualified request submitted to the formal Sandbox boundary.
pub struct SandboxRunRequest {
    pub run_intent_id: RunIntentId,
    pub context_ref: RunnerContextRef,
    pub selection_binding: SelectionBinding,
    pub material_binding: QualifiedMaterialBinding,
    pub requested_resources: RunnerRequestedResourceSet,
    pub metadata: RunnerCommandMetadata,
}

/// Safe acknowledgement that a Sandbox request was accepted, not executed.
pub struct SandboxRunAcceptance {
    pub request_ref: SandboxRequestRef,
    pub owner_basis: OwnerStateBasis,
    pub receipt_ref: SandboxReceiptRef,
    pub source_attribution: SourceAttribution,
}

/// Explicit control request bound to a previously read owner basis.
pub struct SandboxControlRequest {
    pub control_intent_id: ControlIntentId,
    pub run_intent_id: RunIntentId,
    pub kind: ControlIntentKind,
    pub expected_owner_basis: OwnerStateBasis,
    pub metadata: RunnerCommandMetadata,
}

/// Explicit cleanup request that cannot be represented without a guard and current basis.
pub struct SandboxCleanupRequest {
    pub control_intent_id: ControlIntentId,
    pub protected_subject: ProtectedSubjectRef,
    pub guard_ref: ProtectionGuardRef,
    pub expected_cleanup_basis: OwnerCleanupBasis,
    pub metadata: RunnerCommandMetadata,
}

/// Safe owner snapshot used for projection and reconciliation.
pub struct SandboxSafeSnapshot {
    pub subject_ref: OwnerSubjectRef,
    pub request_ref: Option<SandboxRequestRef>,
    pub boundary_ref: Option<SandboxBoundaryRef>,
    pub request_posture: OwnerRequestPosture,
    pub control_posture: OwnerControlPosture,
    pub lease_posture: OwnerLeasePosture,
    pub cleanup_posture: OwnerCleanupPosture,
    pub owner_basis: OwnerStateBasis,
    pub result_refs: OwnerResultRefSet,
    pub source_attribution: SourceAttribution,
}
```

```rust
/// Submits and reads Sandbox-owned request, control, lease, and cleanup state.
pub trait SandboxRunPort {
    async fn request_run(
        &self,
        request: SandboxRunRequest,
    ) -> Result<RunnerSubmissionOutcome<SandboxRunAcceptance, SandboxRejection, SandboxBasisConflict>, ApplicationError>;

    async fn request_control(
        &self,
        request: SandboxControlRequest,
    ) -> Result<RunnerSubmissionOutcome<SandboxControlAcceptance, SandboxControlRejection, SandboxBasisConflict>, ApplicationError>;

    async fn request_cleanup(
        &self,
        request: SandboxCleanupRequest,
    ) -> Result<RunnerSubmissionOutcome<SandboxCleanupAcceptance, SandboxCleanupRejection, SandboxBasisConflict>, ApplicationError>;

    async fn read_safe_snapshot(
        &self,
        subject_ref: OwnerSubjectRef,
    ) -> Result<RunnerSemanticRead<SandboxSafeSnapshot>, ApplicationError>;

    async fn read_request_outcome(
        &self,
        request_ref: SandboxRequestRef,
        expected_basis: OwnerStateBasis,
    ) -> Result<RunnerSemanticRead<SandboxSafeSnapshot>, ApplicationError>;

    async fn read_protection_inputs(
        &self,
        subject: ProtectedSubjectRef,
    ) -> Result<RunnerSemanticRead<SandboxProtectionSnapshot>, ApplicationError>;
}
```

#### 12.7.2 ownership / outcome rules

| seam | Runner 可记录 | Runner 不得宣称 |
|---|---|---|
| `request_run Accepted` | request ref、receipt ref、owner basis；`RunIntent=Accepted` | boundary exists、starting/running、terminal success |
| `request_control Accepted` | control accepted ref/posture | requested effect confirmed |
| formal control result/snapshot | 仅相应 control axis confirmed | stop confirmed=cleaned/released |
| `request_cleanup Accepted` | cleanup request accepted/ref | cleanup complete、cache evicted |
| cleanup snapshot Confirmed | owner cleanup effect posture | local bytes released/evidence gone |
| snapshot | attributed request/control/lease/cleanup refs | Sandbox policy/body/private implementation |

Adapter 必须只通过 L0 SDK/正式 API；不得依赖或编译 Sandbox 私有 crate/package/backend，亦不得用 Docker、gVisor、Firecracker、process spawn 或本地容器状态旁路正式 port。`RUN-UP-003/007/008` 未关闭时所有正向 submission 返回 Blocked/Unsupported readiness surface；不得伪造 accepted receipt。

### 12.8 `RuntimeStatusReadPort`

```rust
/// Safe Runtime snapshot whose axes remain independent from Sandbox request acceptance.
pub struct RuntimeSafeSnapshot {
    pub runtime_run_ref: RuntimeRunRef,
    pub sandbox_request_ref: Option<SandboxRequestRef>,
    pub execution_posture: OwnerExecutionPosture,
    pub control_posture: OwnerControlPosture,
    pub result_refs: OwnerResultRefSet,
    pub owner_basis: OwnerStateBasis,
    pub source_attribution: SourceAttribution,
}

/// Reads Runtime-owned execution and result posture without process-level inference.
pub trait RuntimeStatusReadPort {
    async fn read_by_runtime_run(
        &self,
        run_ref: RuntimeRunRef,
    ) -> Result<RunnerSemanticRead<RuntimeSafeSnapshot>, ApplicationError>;

    async fn find_by_sandbox_request(
        &self,
        request_ref: SandboxRequestRef,
    ) -> Result<RunnerSemanticRead<Option<RuntimeSafeSnapshot>>, ApplicationError>;

    async fn read_result_refs(
        &self,
        run_ref: RuntimeRunRef,
    ) -> Result<RunnerSemanticRead<OwnerResultRefSet>, ApplicationError>;
}
```

| source | 可作为 execution posture 来源 | 处理 |
|---|---:|---|
| formal Runtime safe snapshot/result | 是 | 保留 ref、source version、freshness、visibility |
| formal Sandbox snapshot明确承接 Runtime axis | 仅合同明确时 | adapter 必须标 source attribution，不合并含义 |
| PID/process existence | 否 | 仅 platform observation/diagnostic hint |
| port/socket/HTTP health | 否 | 仅 local resource observation |
| stdout/stderr/log/toast | 否 | 仅经 redaction 的 preview/diagnosis hint |

`find_by_sandbox_request` 返回 `Current(None)` 表示正式当前来源明确尚无 Runtime run；这不等于 failure。Unavailable/Unsupported/Unknown 与 `None` 必须可区分。

### 12.9 `PlatformResourcePort`

```rust
/// Bounded resource probe request using typed keys rather than arbitrary host paths.
pub struct PlatformResourceProbeQuery {
    pub platform_ref: PlatformContextRef,
    pub resource_keys: Vec<ResourceKey>,
    pub purpose: ResourceProbePurpose,
}

/// Safe resource conflict set for application preflight.
pub struct PlatformResourceProbeResult {
    pub observations: Vec<ResourceObservationInput>,
    pub observed_at: Timestamp,
    pub freshness: LocalFreshness,
    pub source_attribution: SourceAttribution,
}

/// Performs bounded, redacted local platform observations only.
pub trait PlatformResourcePort {
    async fn probe_resources(
        &self,
        query: PlatformResourceProbeQuery,
    ) -> Result<RunnerSemanticRead<PlatformResourceProbeResult>, ApplicationError>;

    async fn probe_platform_compatibility(
        &self,
        platform_ref: PlatformContextRef,
        manifest_ref: ManifestRef,
    ) -> Result<RunnerSemanticRead<PlatformCompatibilityResult>, ApplicationError>;
}
```

Port 只接受 typed/bounded resource keys；不提供 arbitrary process listing、raw filesystem traversal、environment dump 或 unrestricted command execution。Observation 可阻止/提示 preflight，但不能预留端口、声明 Sandbox allocation、杀进程或直接 cleanup。跨平台 exact resource taxonomy 与安全 probing 受 `RUN-UP-007`，未闭合类别必须 Unsupported/Unknown。

### 12.10 `DiagnosticReadPort`

```rust
/// Bounded diagnostic query referencing formal subjects and result refs only.
pub struct DiagnosticReadQuery {
    pub subject_refs: DiagnosticSubjectRefSet,
    pub result_refs: OwnerResultRefSet,
    pub requested_window: DiagnosticWindow,
    pub requested_bound: DiagnosticContentBound,
    pub actor_context: ActorContext,
}

/// Safe material remains unrenderable until RedactionPort confirms it.
pub struct BoundedDiagnosticMaterial {
    pub source_refs: OutputSourceRefSet,
    pub opaque_material_ref: DiagnosticMaterialRef,
    pub content_kind: DiagnosticContentKind,
    pub bound: DiagnosticContentBound,
    pub source_attribution: SourceAttribution,
}

/// Reads only formally exposed, bounded diagnostic material.
pub trait DiagnosticReadPort {
    async fn read_bounded_material(
        &self,
        query: DiagnosticReadQuery,
    ) -> Result<RunnerSemanticRead<BoundedDiagnosticMaterial>, ApplicationError>;

    async fn read_safe_failure_refs(
        &self,
        subject_refs: DiagnosticSubjectRefSet,
    ) -> Result<RunnerSemanticRead<SourceFailureRefSet>, ApplicationError>;
}
```

`BoundedDiagnosticMaterial` 不是可展示正文，必须先交给 `RedactionPort`。Adapter 不得 fallback 到 local raw log、container stdout、host file、stack trace、environment 或 secret。Unavailable/Restricted 必须保留，不以空字符串伪装 success。

### 12.11 `RedactionPort`

```rust
/// Mandatory redaction request bound to actor visibility and source attribution.
pub struct RedactionRequest {
    pub material_ref: DiagnosticMaterialRef,
    pub actor_context: ActorContext,
    pub visibility: VisibilityPosture,
    pub required_policy_ref: RedactionPolicyRef,
    pub content_bound: DiagnosticContentBound,
}

/// Safe transformation outcome; blocked never carries displayable content.
pub enum RedactionOutcome {
    Safe(SafeOutputMaterial),
    Restricted(SafeOutputMaterial),
    Blocked(RedactionFailureRef),
    Unsupported(RunnerPortIssueRef),
}

/// Applies and validates mandatory redaction before any preview or handoff use.
pub trait RedactionPort {
    async fn redact(
        &self,
        request: RedactionRequest,
    ) -> Result<RedactionOutcome, ApplicationError>;

    async fn validate_safe_material(
        &self,
        material: SafeOutputMaterial,
        policy_ref: RedactionPolicyRef,
    ) -> Result<RedactionValidationOutcome, ApplicationError>;

    async fn validate_safe_handoff_ref(
        &self,
        material_ref: SafeHandoffMaterialRef,
        target_ref: HandoffTargetRef,
        actor_context: ActorContext,
    ) -> Result<RedactionValidationOutcome, ApplicationError>;
}
```

`validate_safe_handoff_ref` 只验证该 opaque ref 能回指已持久化/owner-attributed的 mandatory-redaction proof，且仍满足目标与 actor visibility policy；它不得按 ref 字符串查任意文件、取回 raw body或把未知 ref 当有效。Redaction failure/unsupported 时不得返回 raw或“best effort”内容；fake adapter 也必须执行等价 fail-closed contract，不能直接 echo input。Safe/Restricted 只说明展示/交接材料满足当前 policy，不表示 source truth、run success 或 evidence。

### 12.12 `ObservabilityHandoffPort`

```rust
/// Safe diagnostic handoff request containing only approved refs/material.
pub struct ObservabilityHandoffRequest {
    pub handoff_id: DiagnosticHandoffId,
    pub diagnosis_ref: FailureDiagnosisRef,
    pub material_refs: SafeHandoffMaterialRefSet,
    pub target_ref: HandoffTargetRef,
    pub metadata: HandoffCommandMetadata,
}

/// Owner-safe handoff acceptance or delivery snapshot.
pub struct ObservabilityHandoffSnapshot {
    pub handoff_id: DiagnosticHandoffId,
    pub receipt_ref: Option<HandoffReceiptRef>,
    pub posture: OwnerHandoffPosture,
    pub source_attribution: SourceAttribution,
}

/// Submits and reads diagnostic handoff posture; it never creates evidence locally.
pub trait ObservabilityHandoffPort {
    async fn submit(
        &self,
        request: ObservabilityHandoffRequest,
    ) -> Result<RunnerSubmissionOutcome<ObservabilityHandoffSnapshot, HandoffFailureReason, HandoffBasisConflict>, ApplicationError>;

    async fn read_posture(
        &self,
        handoff_id: DiagnosticHandoffId,
        receipt_ref: Option<HandoffReceiptRef>,
    ) -> Result<RunnerSemanticRead<ObservabilityHandoffSnapshot>, ApplicationError>;
}
```

Accepted/Delivered 只更新 `HandoffPosture` 对应轴；port 不返回 evidence/report/verdict/signoff body或身份。Unknown 禁止 application 自动 resend；read-only `read_posture` 是唯一收敛路径。Target/endpoint/credential 由 infra private config binding 管理，不进入 request object。

### 12.13 `ArchiveReferencePort`

```rust
/// Safe, body-free archive reference associated with an allowed Runner subject.
pub struct ArchiveReferenceSnapshot {
    pub subject_ref: DiagnosticSubjectRef,
    pub archive_ref: ArchiveSafeRef,
    pub restore_posture: ArchiveRestorePosture,
    pub retention_posture: RetentionProtectionPosture,
    pub source_attribution: SourceAttribution,
}

/// Reads conditional Archive references without moving archive truth into Runner.
pub trait ArchiveReferencePort {
    async fn resolve_reference(
        &self,
        subject_ref: DiagnosticSubjectRef,
        actor_context: ActorContext,
    ) -> Result<RunnerSemanticRead<ArchiveReferenceSnapshot>, ApplicationError>;

    async fn read_restore_posture(
        &self,
        archive_ref: ArchiveSafeRef,
    ) -> Result<RunnerSemanticRead<ArchiveReferenceSnapshot>, ApplicationError>;
}
```

Archive 是外围能力：Unavailable/Unsupported 不改变 selection/material/run truth，也不作为启动、运行、停止或清理成功判定。Runner 不触发隐式 restore，不保存 archive package/body，不把 archive ref 当本地 cache handle。

### 12.14 `RunnerStateStorePort`

`RunnerStateStorePort` 是 02 的聚合 required capability 名，不与 §10～§11 的细粒度 repositories 重复定义数据访问函数。它只暴露 store-level capability/readiness/UoW factory；对象读写一律经对应 application repository trait。

```rust
/// Reports the semantic guarantees of Runner-local persistence.
pub trait RunnerStateStorePort {
    async fn read_capabilities(
        &self,
    ) -> Result<RunnerStoreCapabilityState, ApplicationError>;

    fn unit_of_work_manager(&self) -> &dyn RunnerUnitOfWorkManager;

    async fn health_observation(
        &self,
    ) -> Result<RunnerSemanticRead<RunnerStoreHealthSnapshot>, ApplicationError>;
}
```

若 transaction、expected-version、durable-reference 或 corruption detection 不能满足声明要求，相关 write/duplicate/recovery flow 必须 Blocked/Unknown；不得自动改用无事务文件、内存 map 或重建/清空 store。具体 provider/schema/migration/locking 留 Step 11/14 和 `RUN-DDD-003`。

### 12.15 `ClockConnectivityPort`

已在 §9.2 定义完整 trait。作为 14 required ports 之一，其 adapter 还必须满足：

- trusted local time 与 owner timestamp 分开；
- connectivity observation 按 owner family 标 affected sources；
- suspend/resume/restart 不自动把 business axes 标 stale/current，而是触发显式 recovery decision；
- reconnect 不自动 replay command/event/handoff；
- cancellation只影响 local acquisition/job control，不冒充 owner control结果。

### 12.16 14-port 覆盖与模块停审

| 检查项 | 结论 | 依据 / blocker |
|---|---|---|
| 14/14 required port 有唯一 application 定义 | pass | §9.2、§12.2～§12.15 |
| 每个 port 有 typed request/result/error or semantic read | pass for logic | exact DTO 受 `RUN-UP-001~008`，Step 8 承接 |
| accepted/confirmed 范围不跨轴 | pass | submission/effect outcome + per-port rules |
| body-free / no private implementation | pass | context/authority/runtime/diagnostic/handoff/archive 均显式 |
| material transfer/verify/cache 分离 | pass | §12.4～§12.6 |
| Sandbox/Runtime state 分离 | pass | §12.7～§12.8 |
| local observation/owner allocation 分离 | pass | §12.9 |
| redaction mandatory | pass | §12.10～§12.11 |
| all positive upstream integrations ready | blocked（预期） | `RUN-UP-001~008` 未关闭；不影响逻辑 Step 7 pass |

## 13. Application facade / entry-facing service ports

这些 facade trait 由 `application` 定义，供 `entry`、`worker`、`operations` 注入。方法参数/返回类型在本 Step 固定名称、读写类别与责任，完整字段 schema 由 Step 8 定义；Step 8 不得改变 operation 数量或语义主语，若必须改变应回退概要设计。

### 13.1 Command application service

```rust
/// Executes the eleven explicit Runner command use cases.
pub trait RunnerCommandApplicationService {
    async fn select_release(
        &self,
        context: RunnerOperationContext,
        input: SelectReleaseInput,
    ) -> Result<RunnerCommandOutcome<ReleaseSelectionResult>, ApplicationError>;

    async fn invalidate_selection(
        &self,
        context: RunnerOperationContext,
        input: SelectionInvalidationInput,
    ) -> Result<RunnerCommandOutcome<SelectionInvalidationResult>, ApplicationError>;

    async fn request_material_acquisition(
        &self,
        context: RunnerOperationContext,
        input: AcquisitionRequestInput,
    ) -> Result<RunnerCommandOutcome<AcquisitionRequestResult>, ApplicationError>;

    async fn pause_acquisition(
        &self,
        context: RunnerOperationContext,
        input: AcquisitionControlInput,
    ) -> Result<RunnerCommandOutcome<AcquisitionControlResult>, ApplicationError>;

    async fn resume_acquisition(
        &self,
        context: RunnerOperationContext,
        input: AcquisitionControlInput,
    ) -> Result<RunnerCommandOutcome<AcquisitionControlResult>, ApplicationError>;

    async fn cancel_acquisition(
        &self,
        context: RunnerOperationContext,
        input: AcquisitionControlInput,
    ) -> Result<RunnerCommandOutcome<AcquisitionControlResult>, ApplicationError>;

    async fn request_run(
        &self,
        context: RunnerOperationContext,
        input: RunRequestInput,
    ) -> Result<RunnerCommandOutcome<RunRequestResult>, ApplicationError>;

    async fn request_run_control(
        &self,
        context: RunnerOperationContext,
        input: RunControlInput,
    ) -> Result<RunnerCommandOutcome<RunControlResult>, ApplicationError>;

    async fn request_cleanup(
        &self,
        context: RunnerOperationContext,
        input: CleanupRequestInput,
    ) -> Result<RunnerCommandOutcome<CleanupRequestResult>, ApplicationError>;

    async fn open_manual_review(
        &self,
        context: RunnerOperationContext,
        input: ManualReviewInput,
    ) -> Result<RunnerCommandOutcome<ManualReviewResult>, ApplicationError>;

    async fn request_diagnostic_handoff(
        &self,
        context: RunnerOperationContext,
        input: DiagnosticHandoffInput,
    ) -> Result<RunnerCommandOutcome<DiagnosticHandoffResult>, ApplicationError>;
}
```

| command group | 可写对象 | 必经 ports/repositories | 结果红线 |
|---|---|---|---|
| select/invalidate | context/selection + downstream stale/invalidation | context/authority、selection/material/intent/recovery repos | current 非 approved；失效不撤销 owner truth |
| acquisition controls | acquisition task | selection/authority/task + operations trigger seam | accepted 不等 transfer complete |
| run/control | run/control intent、owner projection result、recovery | authority/cache/guard + Sandbox/Runtime + stores | accepted 非 running；confirmed stop 非 cleaned |
| cleanup | control intent/guard/recovery/cache metadata | protection reads + Sandbox cleanup + cache port | releasable/confirmed 非 evicted |
| manual review | recovery case | recovery repository only | manual review 非 override |
| handoff | handoff posture/recovery | diagnosis/redaction/handoff + stores | delivered 非 evidence |

所有副作用 Command 均要求 `RunnerOperationContext.channel=Command`、stable idempotency key、canonical digest 和 trace。`OpenManualReview` 即使无 external call，也必须采用 versioned recovery update；它不授予跳过 guard/authority 的权限。

### 13.2 Query application service

```rust
/// Executes the twelve read-only Runner query use cases.
pub trait RunnerQueryApplicationService {
    async fn resolve_runner_context(
        &self,
        context: RunnerOperationContext,
        input: RunnerContextQueryInput,
    ) -> Result<RunnerQueryResponse<RunnerContextView>, ApplicationError>;

    async fn list_selectable_releases(
        &self,
        context: RunnerOperationContext,
        input: ReleaseSelectionQueryInput,
    ) -> Result<SelectableReleasePage, ApplicationError>;

    async fn get_selection_posture(
        &self,
        context: RunnerOperationContext,
        input: SelectionQueryInput,
    ) -> Result<RunnerQueryResponse<SelectionPostureSection>, ApplicationError>;

    async fn get_material_preparation(
        &self,
        context: RunnerOperationContext,
        input: MaterialQueryInput,
    ) -> Result<RunnerQueryResponse<MaterialPostureSection>, ApplicationError>;

    async fn get_cache_protection(
        &self,
        context: RunnerOperationContext,
        input: CacheProtectionQueryInput,
    ) -> Result<RunnerQueryResponse<CacheProtectionView>, ApplicationError>;

    async fn get_run_lifecycle(
        &self,
        context: RunnerOperationContext,
        input: RunLifecycleQueryInput,
    ) -> Result<RunnerQueryResponse<RunPostureSection>, ApplicationError>;

    async fn get_resource_cleanup_view(
        &self,
        context: RunnerOperationContext,
        input: ResourceCleanupQueryInput,
    ) -> Result<RunnerQueryResponse<ResourceCleanupSection>, ApplicationError>;

    async fn get_recovery_case(
        &self,
        context: RunnerOperationContext,
        input: RecoveryQueryInput,
    ) -> Result<RunnerQueryResponse<RecoveryCaseView>, ApplicationError>;

    async fn get_output_preview(
        &self,
        context: RunnerOperationContext,
        input: OutputPreviewQueryInput,
    ) -> Result<RunnerQueryResponse<OutputPreviewView>, ApplicationError>;

    async fn get_failure_diagnosis(
        &self,
        context: RunnerOperationContext,
        input: FailureDiagnosisQueryInput,
    ) -> Result<RunnerQueryResponse<FailureDiagnosisView>, ApplicationError>;

    async fn get_handoff_posture(
        &self,
        context: RunnerOperationContext,
        input: HandoffQueryInput,
    ) -> Result<RunnerQueryResponse<HandoffPostureView>, ApplicationError>;

    async fn get_runner_read_model(
        &self,
        context: RunnerOperationContext,
        input: RunnerReadModelQueryInput,
    ) -> Result<RunnerQueryResponse<RunnerReadModel>, ApplicationError>;
}
```

Query contract：`context.channel=Query`、无 idempotency reservation、无 UoW、无 repository save、无 external refresh/repair、无 material transfer/verification、无 reconcile/cleanup/handoff。`ResolveRunnerContext` 可调用 formal context read port，但不得保存 context；`ListSelectableReleases` 只读 formal safe page，不能自动选择第一项。其余 Query 只读 committed local/safe projection。

### 13.3 Planned consumer application service

```rust
/// Reports whether a planned consumer contract may parse and dispatch an envelope.
pub trait RunnerConsumerReadinessPort {
    async fn readiness(
        &self,
        source_family: RunnerConsumerSourceFamily,
        schema_version: OwnerEventSchemaVersion,
    ) -> Result<RunnerPortReadinessMarker, ApplicationError>;
}

/// Applies only formally validated owner facts through four planned consumer use cases.
pub trait RunnerConsumerApplicationService {
    async fn consume_release_authority_change(
        &self,
        context: RunnerOperationContext,
        envelope: OwnerEventEnvelope<ReleaseAuthorityChange>,
    ) -> Result<RunnerInboundEventReceipt, ApplicationError>;

    async fn consume_sandbox_lifecycle_change(
        &self,
        context: RunnerOperationContext,
        envelope: OwnerEventEnvelope<SandboxLifecycleChange>,
    ) -> Result<RunnerInboundEventReceipt, ApplicationError>;

    async fn consume_runtime_status_change(
        &self,
        context: RunnerOperationContext,
        envelope: OwnerEventEnvelope<RuntimeStatusChange>,
    ) -> Result<RunnerInboundEventReceipt, ApplicationError>;

    async fn consume_handoff_change(
        &self,
        context: RunnerOperationContext,
        envelope: OwnerEventEnvelope<HandoffChange>,
    ) -> Result<RunnerInboundEventReceipt, ApplicationError>;
}
```

以上 envelope/payload/receipt 是 Step 8 contract names，不声明当前 schema 存在。Worker 必须先以 envelope header 中不含 payload 的 source family/schema version 调用 readiness；当前四类均为 `Blocked/Unsupported`，因此不得反序列化或调用 consumer method。未来 Ready 后，consumer 仍只应用 owner 已提交 safe fact，gap/order conflict→stale + RecoveryCase；不创建 owner truth。

### 13.4 Operations job application service

```rust
/// Executes the five explicit Runner operations jobs.
pub trait RunnerJobApplicationService {
    async fn acquire_and_verify_material(
        &self,
        context: RunnerOperationContext,
        input: AcquireAndVerifyMaterialJobInput,
    ) -> Result<RunnerJobReport, ApplicationError>;

    async fn evaluate_cache_eviction(
        &self,
        context: RunnerOperationContext,
        input: EvaluateCacheEvictionJobInput,
    ) -> Result<RunnerJobReport, ApplicationError>;

    async fn reconcile_runner_state(
        &self,
        context: RunnerOperationContext,
        input: ReconcileRunnerStateJobInput,
    ) -> Result<RunnerJobReport, ApplicationError>;

    async fn refresh_safe_diagnosis(
        &self,
        context: RunnerOperationContext,
        input: RefreshSafeDiagnosisJobInput,
    ) -> Result<RunnerJobReport, ApplicationError>;

    async fn refresh_visible_sources(
        &self,
        context: RunnerOperationContext,
        input: RefreshVisibleSourcesJobInput,
    ) -> Result<RunnerJobReport, ApplicationError>;
}
```

Job methods只能在 operations entry 完成 registry、idempotency、claim、checkpoint gate 后调用。Report 是本地 bounded refs/counters/disposition；Completed/Partial/Failed/Unknown 都不映射为 approved、running、cleaned、evidence、verdict 或 signoff。Duplicate job 不调用本 trait，而直接从 `StoredRunnerResultRepository` 返回旧 report。

### 13.5 facade 聚合与停审

```rust
/// Entry-facing aggregate of the four application service contracts.
pub trait RunnerApplicationServiceFacade:
    RunnerCommandApplicationService
    + RunnerQueryApplicationService
    + RunnerConsumerApplicationService
    + RunnerJobApplicationService
{
}
```

| 审查项 | 结论 |
|---|---|
| 11 Command methods | covered |
| 12 Query methods | covered；all no-write |
| 4 planned Consumer methods | covered but readiness blocked |
| 5 Operations Job methods | covered |
| entry-facing facade 是否暴露 repository/adapter | no |
| Step 8 DTO 是否被提前伪造 | no：只固定 type name/semantic owner，body 留 Step 8 |

## 14. `infra` adapter 实现契约

### 14.1 adapter implementation matrix

因 Step 4 physical layout blocked，下表“逻辑实现组”不是文件路径、crate 或已存在代码。技术 authority 关闭后，Step 4/14 必须把它们映射到真实目录；当前不得据此创建代码。

| application port group | infra 逻辑实现组 | Step 6 infra state | 实现要求 | 当前状态 |
|---|---|---|---|---|
| UoW + object repositories | local state adapter | `RunnerStoreCapabilityState` | versioned reads、expected version、same-local-UoW、corruption fail-closed | planned/blocked by `RUN-DDD-003` |
| idempotency/result | local result adapter | store/result capability | complete replay surface、same-UoW ordering | planned/blocked |
| operations/consumer marker | local operation adapter | operation store capability | claim/checkpoint/dedup marker；no owner cursor | planned/blocked |
| material cache | quarantine/cache adapter | `RunnerMaterialCacheCapabilityState` | quarantine/promote/release receipt；metadata/bytes split | planned/blocked |
| context/authority/material | formal SDK/API adapters | availability markers | SDK-first、body-free、source attribution | upstream blocked |
| Sandbox/Runtime | formal owner adapters | availability markers | no private backend; independent axes; typed ambiguity | upstream blocked |
| platform/clock/connectivity | platform semantic adapter | availability markers | bounded probes、no arbitrary process/path exposure | pending/blocked |
| diagnostic/redaction | safe read/transform adapters | availability markers | bounded first、mandatory redaction、no raw fallback | upstream blocked |
| Observability/Archive | handoff/reference adapters | availability markers | refs/receipts only；no evidence/archive body | upstream blocked/peripheral |
| readiness registry | runtime composition registry | `RunnerRuntimeBuilderState` | config presence ≠ semantic readiness | logical only |

### 14.2 adapter mapping obligations

| mapping boundary | adapter 必须做 | adapter 不得做 |
|---|---|---|
| owner DTO → semantic result | 校验 schema/version、映射 typed refs/postures/freshness/visibility/source | 返回 raw DTO/body；用 HTTP status/ACK猜成功 |
| SDK error → outcome/error | 可保存业务 rejection/conflict/unknown进入 typed outcome；wiring/contract bug→`ApplicationError` | 让 service解析 error string/code 猜 retry |
| local provider → repository | 同一 version/UoW semantics，稳定 page/index | 用 mtime/directory order/latest row猜 current |
| material transfer/cache | locator secret保持 adapter private；只交 opaque handle/ref | 暴露 URL/path/credential；修改 Release content |
| platform probe | 最小、bounded、redacted semantic observation | arbitrary command/process dump/path traversal |
| diagnostic/redaction | raw/opaque material不越过 redaction adapter | fake直接 echo raw input |
| readiness | 明确 Ready/Degraded/Unavailable/Blocked/Unsupported | configured/client constructed=Ready |

### 14.3 fake / durable parity

未来 test double/fake 若被创建，必须与 durable/SDK adapter 保持以下等价语义；本 Step 不创建任何实现或测试：

- 同一 optimistic version 冲突类别和 create-absent 规则；
- 同一 page ordering/cursor opacity，cursor 不当 version；
- 同一 idempotency key/name/digest 冲突与 complete replay surface；
- 同一 `Accepted != Running`、stop confirmed != cleaned、receipt != evidence 映射；
- 同一 unknown/stale/restricted/unsupported fail-closed 行为；
- 同一 canonical digest stable-field selection；
- 同一 consumer readiness gate；blocked 时不解析 payload；
- 同一 redaction failure no-body rule；
- 不通过 fake private map、string prefix 或 hard-coded status 绕过 semantic port。

### 14.4 runtime composition

```rust
/// Logical composition boundary; concrete runtime and dependency container are undecided.
pub trait RunnerRuntimeCompositionPort {
    async fn validate_config(
        &self,
        config: RunnerRuntimeConfig,
    ) -> Result<RunnerRuntimeBuilderState, ApplicationError>;

    async fn build_facade(
        &self,
        config: RunnerRuntimeConfig,
    ) -> Result<RunnerApplicationFacadeHandle, ApplicationError>;
}
```

`RunnerApplicationFacadeHandle` 是 opaque composition handle，不进入 public protocol、不证明 process/server/GUI 已启动。`build_facade` 只有在 required local stores 与本次启用的 ports 满足 readiness 时才能返回；由于当前 owner adapters blocked，正向 capability 应通过 per-port marker显式 blocked/degraded，而非造 Ready integration。

### 14.5 infra 模块停审

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 是否重新定义 application port | pass：否，只实现 |
| exact file/product/path 是否伪造 | pass：未写 |
| private owner dependency | pass：明确禁止 |
| semantic error/readiness mapping | pass for logic | exact SDK mapping受 `RUN-UP-008` |
| local persistence guarantees | pass as required semantics | technology受 `RUN-DDD-003` |
| fake parity | pass as future contract；无测试结果声明 |

## 15. `entry` 模块接缝契约

### 15.1 allowed dependencies

| entry object | 可调用 | 可接收/返回 | 禁止调用 |
|---|---|---|---|
| `RunnerCommandEntry` | `RunnerCommandApplicationService` | Step 8 command DTO/result + handler shell | repository、domain transition、owner/material/platform port |
| `RunnerQueryEntry` | `RunnerQueryApplicationService` | Step 8 query DTO/view + visibility/degraded markers | UoW/idempotency/save/refresh/reconcile |
| `RunnerHandlerResult` mapper | pure result/error mapper | stored result ref / view surface / issue refs | 根据 UI toast/HTTP status改变 domain/owner state |
| registry/composition | facade handle/readiness only | logical operation name mapping | 固化 HTTP route、CLI command、Tauri IPC 或 GUI framework |

### 15.2 dispatch contract

```rust
/// Transport-neutral entry dependency; no repository or adapter is exposed.
pub trait RunnerEntryDispatchPort {
    async fn dispatch_command(
        &self,
        entry: RunnerCommandEntry,
        request: RunnerCommandRequest,
    ) -> Result<RunnerHandlerResult, EntryError>;

    async fn dispatch_query(
        &self,
        entry: RunnerQueryEntry,
        request: RunnerQueryRequest,
    ) -> Result<RunnerHandlerResult, EntryError>;
}
```

`RunnerCommandRequest`/`RunnerQueryRequest` 是 Step 8 finite tagged unions；entry 仅校验 envelope/metadata、构造 `RunnerOperationContext` 并转交对应 facade method。它不缓存 body、不选择 release、不重试 owner call、不将 application accepted shell渲染成 running。GUI/CLI/product adapters 必须共享同一 dispatch contract。

### 15.3 entry 停审

| 审查项 | 结论 |
|---|---|
| only application facade dependency | pass |
| Query no-write/no-refresh | pass |
| transport/framework choice inherited | no |
| result success overstatement | prohibited |

## 16. `worker` 模块接缝契约

### 16.1 readiness-first boundary

```rust
/// Header-only candidate used before any owner payload is parsed.
pub struct OwnerEventHeaderCandidate {
    pub source_family: RunnerConsumerSourceFamily,
    pub schema_version: OwnerEventSchemaVersion,
    pub event_ref: Option<OwnerEventRef>,
    pub dedup_key: Option<RunnerOperationIdempotencyKey>,
    pub source_attribution: Option<SourceAttribution>,
}

/// Worker dependency that gates parsing and delegates a validated item to application.
pub trait RunnerWorkerDispatchPort {
    async fn check_readiness(
        &self,
        header: OwnerEventHeaderCandidate,
    ) -> Result<RunnerPortReadinessMarker, WorkerError>;

    async fn dispatch_validated(
        &self,
        entry: RunnerInboundConsumerEntry,
        envelope: RunnerInboundEventEnvelope,
    ) -> Result<RunnerConsumerItemResult, WorkerError>;
}
```

`dedup_key` 只能来自正式 envelope 的 framing metadata，并且在 payload 解析前已可取得；它不能由 payload bytes、generic JSON、arrival time、trace、event ref 拼接或本地 hash 推导。该字段缺失时 worker 不得查询 stored receipt，也不得制造 `Duplicate`，只能继续 readiness/header 的安全负向分支。

### 16.2 worker rules

| 阶段 | 允许 | 禁止 |
|---|---|---|
| header inspection | 读取最小 source/schema/event identity metadata | 解析 payload、写 projection、ACK success |
| readiness blocked/unsupported | 构造 blocked/unsupported safe result/issue ref | fallback generic JSON/private topic/client |
| validated future path | 校验 event id/source version/visibility/trace/dedup/order后调用 consumer facade | 直写 repository/domain、last-arrival wins |
| duplicate | 读取 stored consumer receipt | 重跑 application transition |
| gap/unknown | 创建/关联 RecoveryCase，经 application保存 | 推进 owner cursor、自动 replay |

当前 `ConsumeReleaseAuthorityChange`、`ConsumeSandboxLifecycleChange`、`ConsumeRuntimeStatusChange`、`ConsumeHandoffChange` 全部 readiness=`Blocked/Unsupported`。这不是实现错误，而是上游 contract 尚未闭合的正确姿态。

### 16.3 worker 停审

| 审查项 | 结论 |
|---|---|
| readiness before payload parse | pass |
| application-only dispatch | pass |
| dedup stored receipt | pass |
| formal schema/client ready | blocked；未伪造 |

## 17. `operations` 模块接缝契约

### 17.1 operations dispatch contract

```rust
/// Operations boundary around registry, idempotency, claim, checkpoint, and job facade.
pub trait RunnerOperationsDispatchPort {
    async fn dispatch_job(
        &self,
        entry: RunnerOperationsJobEntry,
        request: RunnerJobRequest,
    ) -> Result<RunnerOperationsJobResult, JobError>;
}
```

`RunnerJobRequest` 是 Step 8 的五 variant tagged union。Operations adapter/runner 不直接取得 repository/port；`RunnerOperationsDispatchPort` 的 application implementation 负责：registry gate→idempotency lookup→stored report replay 或 local claim→job facade→checkpoint/report/result/idempotency completion。Step 9 将展开确切顺序。

### 17.2 job boundary matrix

| Job | application facade | required ports | forbidden shortcut |
|---|---|---|---|
| AcquireAndVerify | material job method | authority/source/verifier/cache | operations 直接下载/verify/promote |
| EvaluateCacheEviction | eviction job method | cache/guard/protection/platform reads | candidate 直接 delete |
| ReconcileRunnerState | recovery job method | Sandbox/Runtime/authority/handoff read ports | replay unknown request |
| RefreshSafeDiagnosis | diagnosis job method | diagnostic/redaction + local repos | raw log fallback |
| RefreshVisibleSources | refresh job method | read-only owner ports + projection repo | Query/render隐式触发 |

### 17.3 operations stop-review

| 审查项 | 结论 |
|---|---|
| claim/checkpoint/report seam | pass |
| duplicate replay without job run | pass |
| direct adapter/repository access | prohibited |
| job report truth overstatement | prohibited |
| scheduler/process technology | pending，不在本 Step 选择 |

## 18. Step 6 open item 承接

| Step 6 open item | Step 7 承接结论 | 当前状态 | 后续责任 |
|---|---|---|---|
| `RUN-S6-OPEN-001` all local IDs | `RunnerIdGeneratorPort` 覆盖 context、selection、task/cache/posture、intent/control、observation/guard/recovery、preview/diagnosis/handoff、result、entry/worker/job/claim/projection/generation | closed for semantic contract | Step 11/14 physical generation；不从字段拼接 |
| `RUN-S6-OPEN-002` Release/Artifact/Governance authority | `ReleaseAuthorityReadPort`、`MaterialSourcePort`、`IntegrityVerifierPort` 定义 exact binding、authority、manifest/check result surface | partially closed; positive path blocked | Step 8 schema + `RUN-UP-001/002/008` authority |
| `RUN-S6-OPEN-003` Sandbox/Runtime safe contract | `SandboxRunPort` 与 `RuntimeStatusReadPort` 分轴定义 request/control/cleanup/read/reconcile | partially closed; positive path blocked | Step 8 DTO + `RUN-UP-003/004/007/008` |
| `RUN-S6-OPEN-004` diagnostics/handoff/archive | bounded read→mandatory redaction→handoff/ref ports 已定义 | partially closed; positive path blocked | Step 8 DTO + `RUN-UP-005/006/008` |
| `RUN-S6-OPEN-005` repositories/UoW/idempotency/result | all Runner objects have paired versioned read/write；stored command/consumer/job surface + UoW 已定义 | closed for semantic contract | Step 11 persistence、Step 13 concurrency |
| `RUN-S6-OPEN-006` public DTO/errors/readiness | port input/result names与 semantic marker 已固定，但 public body 未抢写 | correctly deferred | Step 8（本轮下一步） |
| `RUN-S6-OPEN-007` exact ordering | port/repository calls 已可枚举，未在 Step 7 决定调用顺序 | correctly deferred | Step 9/11 |
| `RUN-S6-OPEN-008` exhaustive state matrix | all transition inputs/results可从 ports取得 | correctly deferred | Step 10 |
| `RUN-S6-OPEN-009` physical files/technology | 未写真实路径/产品/runtime | remains blocked | `RUN-DDD-001~003` + Step 4/14 authority |
| `RUN-S6-OPEN-010` consumer contract | readiness/header/dedup/order/stored receipt seam 已定义；payload contract仍无 authority | partially closed; consumers blocked | Step 8/9 + upstream event authority |

Step 7 关闭的是“Runner 需要什么语义接缝、谁定义/实现/调用、失败如何安全表达”，不是“上游已经实现”。部分关闭项必须继续携带 blocker；不得因 trait 名已出现就把 adapter readiness 改为 Ready。

## 19. 模块内停审汇总

| 模块 | port capability 审查 | 调用 / 实现边界 | 结论 | 后续缺口 |
|---|---|---|---|---|
| `contracts` | 不定义 I/O port；提供 body-free public carriers | 被 application/domain引用，不反依赖 | pass | Step 8 complete DTO/schema |
| `domain` | 不定义 repository/client；factory/transition只接参数 | 由 application load/call/save | pass | Step 10 matrix |
| `application` | base、repositories、14 required ports、4 facade groups齐全 | 唯一定义与调用 owner | pass for logic | exact upstream schema blocked |
| `infra` | 只实现 application ports；mapping/readiness/fake parity明确 | composition injection | pass with blockers | physical file/product/config pending |
| `entry` | command/query dispatch only | application facade only | pass | Step 8 request/result unions |
| `worker` | readiness-first + validated dispatch | consumer facade only | pass with positive path blocked | formal envelope/schema/client |
| `operations` | five-job dispatch + idempotency/claim/report boundary | job facade only | pass | Step 8 job union、Step 9 ordering |

模块执行顺序已完成 7/7。没有模块通过私有 helper、repository side door 或 concrete adapter 绕过 application；没有新增第八个“ports module”业务 owner。

## 20. 跨模块接缝闭环审计

### 20.1 结构审计

| 审计项 | 结论 | 依据 / 修正 |
|---|---|---|
| duplicate port | pass | 14 required ports各定义一次；`RunnerStateStorePort`只聚合 capability/UoW，不复制细粒度 repository functions |
| reverse dependency | pass | contracts/domain不依赖 application/infra；entry/worker/operations不依赖 repository/adapter |
| port owner | pass | semantic traits归 application；infra只实现 |
| caller/implementer | pass | §9～§17 每组均列明 caller与逻辑 implementer |
| private implementation leak | pass | Sandbox/Runtime/Observability/Archive仅SDK/正式 API；不编译私有实现 |
| physical path fabrication | pass | 全文仅逻辑模块/实现组，无 crate/file/product事实 |

### 20.2 数据与一致性审计

| 审计项 | 结论 | 依据 / 修正 |
|---|---|---|
| mutable read/write pairing | pass | repositories返回 `Versioned<T>`，save接 `RunnerExpectedVersion` |
| create conflict | pass | create明确 `Absent`，禁止upsert覆盖 |
| UnitOfWork scope | pass | 只含Runner local writes；external I/O在事务外 |
| page/version/source/generation | pass | §8.2 四轴分离 |
| Query read surface | pass | 12 Query facade + repository/safe resolver读取面完整且no-write |
| invalidation lookup | pass | generation-indexed material/intent pages；不由adapter私扫修改 |
| recovery lookup | pass | subject index + bounded candidate page；多个case不任取latest |
| material bytes/metadata | pass | `MaterialCachePort`与metadata repository分离 |
| stored duplicate result | pass | command/consumer/job完整surface lookup；missing为consistency failure，不重跑 |
| consumer dedup/order | pass with blocker | semantic marker存在；formal order type留Step 8/upstream |

### 20.3 真相源与安全审计

| 审计项 | 结论 | 依据 / 修正 |
|---|---|---|
| implicit version selector | pass：unrepresentable | authority query必须exact release/version；无latest/default/tag/branch |
| transfer/verify/qualify | pass | source、verifier、cache promotion分port与结果 |
| accepted/running | pass | Sandbox acceptance与Runtime execution read分离 |
| stop/cleanup/release/evict | pass | control、owner cleanup、local release receipt、metadata state分离 |
| local probe/owner allocation | pass | Platform port只观察；Sandbox owns allocation/lease |
| raw diagnostic/log | pass | bounded material必须RedactionPort；no fallback |
| handoff receipt/evidence | pass | handoff只返回posture/receipt；不返回evidence/verdict/signoff |
| archive core-path influence | pass | reference port peripheral，Unavailable不改core truth |
| owner body leak | pass | all external read results body-free safe summaries/refs |
| unknown replay | pass | submission/effect Unknown无retry permission，只读readback/reconcile |
| outbound event/outbox | pass as not applicable | 当前无event family，未创建outbox/publisher/repository |

### 20.4 读取面完整性反查

| 后续消费者 | 所需读取面 | Step 7 提供 | 结论 |
|---|---|---|---|
| Step 8 Command result | idempotency record、stored result、typed owner outcomes | §11～§13 | complete for schema design |
| Step 8 Query view | object/version reads、read sections、visibility、safe external page | §10、§12.2/3、§13.2 | complete |
| Step 8 Consumer receipt | readiness、dedup、last marker、stored receipt | §11.5、§13.3、§16 | complete with upstream blocker |
| Step 8 Job report | operations entry/claim/checkpoint/result + stored report | §11.3/4、§13.4、§17 | complete |
| Step 9 flows | all object load/save、external call/readback、UoW、id/result | §8～§17 | complete for ordering |
| Step 10 matrix | typed outcome + object transition input + repository persisted object | §9～§13 | complete for transition audit |
| Step 11 persistence | identity/index/page/version/UoW requirements | §8、§10～§11 | complete as requirements, physical blocked |

## 21. Step 8 / 9 / 10 反查

### 21.1 Step 8 protocol 承接

| protocol family | 必须落下的 Step 7 输入 | Step 8 完成门禁 |
|---|---|---|
| shared envelope/metadata | `ActorContext`、trace、idempotency、stable digest fields、expected basis、source/freshness/visibility | public/application-local归属明确；不泄露 repository helper或secret |
| 11 Commands | command facade signatures + typed port outcomes | each request/result/rejection/unknown/conflict schema；implicit selector不可表达 |
| 12 Queries | query facade + visibility/read-section repositories | each view section carries source/freshness/visibility/degraded；no-write明确 |
| 4 Consumers | readiness header、formal envelope/order/dedup marker、stored receipt | current blocked/unsupported variants first-class；未授权payload不补造 |
| 5 Jobs | job facade + claim/checkpoint/report/stored result | input/report/disposition/duplicate schema；report非owner truth |
| owner adapter DTO | §12 semantic requests/results | exact owner mapping标blocked；不能把semantic carrier冒充现有SDK DTO |

### 21.2 Step 9 flow 承接

Step 9 每条函数流必须只调用本 Step 已定义的方法，至少写出：entry validation→idempotency/versioned read→domain gate→local transaction A→external call outside UoW→typed outcome→local transaction B/readback/recovery→stored result。若发现需要新 repository/port method，必须回写 Step 7，不能在 flow 中临时发明。

特别反查：

- selection generation allocation与旧 material/intent invalidation pages；
- quarantine sink→transfer→bind completion→verify→authority recheck→promote；
- Sandbox accepted与Runtime running read分离；
- cleanup guard/current basis→owner cleanup→guard reevaluate→local release→metadata evicted；
- diagnostic bounded read→mandatory redaction→preview/diagnosis→handoff；
- Query只读 committed sections；Refresh Job generation-matched replace；
- duplicate command/consumer/job直接stored surface replay；
- ambiguous side effect不重调，创建RecoveryCase并只读reconcile。

### 21.3 Step 10 state matrix 承接

Step 10 必须把每个 local transition映射到：触发 facade/flow、读到的 object+version、port typed outcome、domain method、persisted repository、failure/unknown出口。Owner request/execution/control/lease/cleanup/handoff姿态只校验formal source/order并更新projection，不由Runner定义owner合法迁移。

## 22. 正反例

| 场景 | 正例 | 反例（禁止） |
|---|---|---|
| repository update | `get -> Versioned<T> -> transition -> save Exact(version)` | load body without version后upsert覆盖 |
| create | reserve/insert with `ExpectedVersion::Absent` | generic save自动覆盖同ID |
| Query | visibility resolve + committed reads + pure assemble | Query建立UoW、refresh source或修复projection |
| adapter error | formal rejection→typed Rejected；ambiguous timeout→Unknown | service解析HTTP code/error string猜running/retryable |
| Sandbox | public SDK request returns request receipt only | 调Sandbox私有backend/Docker/gVisor/Firecracker并当正式执行 |
| Runtime | formal snapshot supports Running | PID/port/socket/HTTP health支持Running |
| material | exact binding→quarantine→verify→promote | cache hit/file exists直接Qualified |
| cleanup | guard Releasable + owner cleanup basis + local release receipt | stop ACK/磁盘压力直接Evicted |
| diagnostic | bounded opaque material→mandatory redaction | raw local log fallback |
| handoff | accepted/delivered receipt更新local posture | receipt生成evidence/report/verdict |
| duplicate | stored command/receipt/report原样replay | 重跑owner call/job scan |
| consumer blocked | header readiness Unsupported，不解析payload | generic JSON解析后“尽力”更新projection |
| outbound | 明确无event/outbox/publisher | 因有local state就新增Runner events |

## 23. 正式 `03` 回填草稿

### 23.1 建议章节映射

| 正式章节 | 本 Step 来源 | 回填内容 | 不回填内容 |
|---|---|---|---|
| §5 `contracts` / `domain` | §6～§7 | no-port纯类型/纯domain边界 | calibration停审过程 |
| §5 `application` | §8～§13 | helpers、UoW、repositories、14 ports、4 facade traits | upstream“ready”声明、具体SDK/transport |
| §5 `infra` | §14 | adapter mapping/readiness/composition/fake parity | 虚构文件路径/产品/schema |
| §5 `entry/worker/operations` | §15～§17 | facade-only dependencies、readiness-first、job dispatch | GUI/CLI/HTTP/topic/scheduler技术 |
| §6 Trait索引 | all traits in §8～§17 | 名称、类型、所属module、逻辑定义位置 | 新设计判断 |
| §7/8 cross-reference | §21 | protocol/flow/state承接说明 | 抢写后续完整内容 |

### 23.2 可进入正式文档的核心结论

- `application` 是 semantic repository/resolver/gateway/UoW/Clock/Id/readiness/service trait 的唯一 owner；`infra` 是实现层。
- `contracts`/`domain` 不访问 I/O；entry/worker/operations只依赖application facade。
- mutable Runner state通过versioned read + expected-version save；page/source/generation/checkpoint marker互不替代。
- external I/O永远在local UoW之外；ambiguous side effect→Unknown + read-only recovery，不自动replay。
- 14 required ports全部有typed safe outcome与readiness；名称不证明owner client/DTO已存在。
- 当前没有Runner outbound event/outbox/publisher。
- planned Consumers必须在schema/client/order/dedup readiness通过前保持blocked且不解析payload。

### 23.3 装配红线

- Step 19前不修改正式`03-详细设计.md`。
- 代码片段不转换为真实Rust/crate/path事实；若技术authority选择非Rust，仍须保留等价类型与函数契约。
- `RUN-UP-001~008`、`RUN-DDD-001~003`随对应port/adapter进入正文。
- 不把“trait定义完成”写成“adapter实现/集成/测试完成”。

## 24. 待确认事项

| ID | 待确认 / blocker | 当前已闭合 | 仍需 authority / Step | 未闭合时行为 |
|---|---|---|---|---|
| `RUN-S7-OPEN-001` | exact SDK client/version/error/redaction/trace mapping | semantic ports/readiness | `RUN-UP-008` + Step 14 | Blocked/Unsupported；no private fallback |
| `RUN-S7-OPEN-002` | Artifact locator/manifest/digest/signature/revoke/expire schema | exact semantic request/result fields | `RUN-UP-001` + Step 8 | acquire/verify positive path blocked |
| `RUN-S7-OPEN-003` | Governance approval/baseline chain enum/scope/version | independent semantic postures | `RUN-UP-002` + Step 8 | authority不可证明即blocked |
| `RUN-S7-OPEN-004` | Sandbox request/control/lease/cleanup/reconcile DTO/idempotency | submission/read port shapes | `RUN-UP-003/007/008` + Step 8 | run/control/cleanup positive path blocked |
| `RUN-S7-OPEN-005` | Runtime safe status/result/order mapping | read port shape | `RUN-UP-004/008` + Step 8 | execution remains unknown/unavailable |
| `RUN-S7-OPEN-006` | Observability diagnostic/redaction/handoff/retention | bounded/redaction/handoff ports | `RUN-UP-005/008` + Step 8 | no raw fallback；handoff blocked |
| `RUN-S7-OPEN-007` | Archive ref/restore/retention | peripheral ref port | `RUN-UP-006/008` | peripheral unavailable；no core impact |
| `RUN-S7-OPEN-008` | cross-platform resource keys/probes/allocation boundary | bounded platform port + owner separation | `RUN-UP-007`、Step 8/14 | unknown/unsupported fail-closed |
| `RUN-S7-OPEN-009` | local store/cache atomicity/schema/locking/corruption | version/UoW/capability requirements | `RUN-DDD-001~003`、Step 11/14 | no durable/readiness claim |
| `RUN-S7-OPEN-010` | consumer envelope/schema/order/dedup formal types | readiness/header/receipt seam | upstream + Step 8/9 | all four planned/blocked |
| `RUN-S7-OPEN-011` | full Command/Query/Consumer/Job DTO | facade type names and semantic sources | Step 8 | protocol not yet implementable |
| `RUN-S7-OPEN-012` | exact call/transaction/crash ordering | all necessary port methods | Step 9/11 | flow not yet implementable |

Step 9 开工反查修正记录（2026-09-20）：`RUN-S7-FIX-001` 将 11 个 Command facade 的返回统一为 Step 8 已定义的 `RunnerCommandOutcome<T>`，并将 11 个非分页 Query facade 的返回统一为 `RunnerQueryResponse<T>`；`ListSelectableReleases` 继续返回已经是 `RunnerPageResponse<SelectableReleaseView>` alias 的 `SelectableReleasePage`。`RUN-S7-FIX-002` 为 `RedactionPort` 增加 `validate_safe_handoff_ref(...)`，闭合 public safe handoff ref 到 mandatory-redaction/target/actor proof 的校验路径，禁止信任任意 opaque ref或回读 raw body。`RUN-S7-FIX-003` 为既有 `SelectableReleaseSummary` 补齐 Step 8 `SelectableReleaseView` 已要求的 authority/digest posture。`RUN-S7-FIX-004` 增加 finite read-subject locator 与 body-free visibility resolution。`RUN-S7-FIX-005` 补齐 finite read-section/source carrier。`RUN-S7-FIX-006` 为 open-recovery lookup 增加 bounded page。`RUN-S7-FIX-007` 增加并扩展 `RunnerEmbeddedCollectionBounds`，覆盖 control/resource/recovery/diagnostic/handoff/attribution 内嵌集合。`RUN-S7-FIX-008` 将 context 纳入 `ReadModelSection` / `RunnerReadSectionBody` 并使 `RunnerReadSources.context` 也携带 surface/generation/optional body；context缺失时composer不得造默认context。`RUN-S7-FIX-009` 为 header-only `OwnerEventHeaderCandidate` 增加 optional framing dedup identity；缺失时禁止查询 stored receipt，且永远不得从 payload 或本地 metadata推导。新增 `RUN-S7-FIX-010` 使 eviction candidate repository 接收显式 `scope_ref`，并提供 `RunnerReadSectionRepository.load_section_versioned(...)` 读取已有 section identity/version，禁止 Refresh Job 拼 projection ref；新增 `RUN-S7-FIX-011` 为 OutputPreview exact subject-set refresh 增加正式 `find_for_subjects(...)` index lookup。十一项修正都不改变 truth owner、transport或正向adapter readiness；其中两项只补齐 Step 9 已识别的 scoped pagination、projection identity 与 exact-set persistence 接缝。

没有待确认项要求回到 Step 7 补一个未定义接缝；剩余项要么是上游authority，要么是后续Step的正式职责。若Step 8/9发现所需method缺失，必须重开本Step并记录修正。

## 25. Step 7 停审与进入 Step 8 条件

### 25.1 完成检查

| 门禁 | 结果 | 依据 |
|---|---|---|
| 七模块逐一处理并停审 | pass | §6～§7、§9～§17、§19 |
| application port ownership唯一 | pass | §4、§20.1 |
| 14 required ports 14/14覆盖 | pass for logic | §12.2～§12.15 |
| 每个trait有参数/返回/error | pass | §8～§17 code blocks |
| repository读取面支撑DTO/flow/state/persistence | pass | §10～§11、§20.4 |
| mutable write version来源/UoW闭合 | pass | §8、§10～§11 |
| duplicate command/event/job stored result | pass | §11 |
| entry/worker/operations不绕过application | pass | §15～§17 |
| body-free、redaction、truth boundary | pass | §12、§20.3 |
| Step 6 open items逐项承接 | pass with upstream blockers | §18 |
| Step 8/9/10反查完整 | pass | §20.4、§21 |
| no outbound/outbox fabrication | pass | §5、§20.3 |
| physical/exact integration未伪造 | pass with blockers | §14、§24 |

### 25.2 Step 8 启动红线

- Step 8 只能定义 protocol DTO/envelope/result/error/readiness；不能将 semantic port carrier冒充现存owner SDK DTO。
- 每个 DTO字段必须回指 Step 6 object/shared carrier或本Step port request/result；缺来源先回退修正。
- Repository helper (`RunnerVersion`、`RunnerRepositoryCursor`、UoW)不直接泄露为public API；必须由contracts-owned version/page marker显式映射。
- Consumer blocked/unsupported必须是正式protocol variant；上游未闭合前不定义猜测payload。
- 仍不创建outbound events；仍不写HTTP path/topic/transport/GUI binding。

### 25.3 停审结论

| 项 | 结论 |
|---|---|
| Step 7 逻辑契约 | `completed_with_upstream_blockers` |
| Step 7 gate | `pass_for_step_08_logic` |
| exact adapter / physical gate | `blocked` |
| 下一允许动作 | 读取 Step 8 SOP/规范并创建 `03_ddd_step_08_protocol_contracts.md` |
| 不允许动作 | Step 9提前开工、正式03写入、代码、测试、implementation ledger/skeleton、commit |

Step 7 到此停审。Trait/port 已达到后续 protocol、flow 和 state matrix 可逐项回指的粒度；上游 blocker与技术pending全部保留，不形成任何 readiness 或实现完成声明。
