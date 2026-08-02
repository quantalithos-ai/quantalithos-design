# Step 7. 逐模块定义 Trait / Port / Adapter 契约

> 对应 SOP: `standards/document/详细设计讨论流程_SOP.md` Step 7
> 回填章节: `03-详细设计.md` §5 模块实现契约中的 Trait / Port / Adapter 契约;§6 全局对象 / Trait / API 索引
> 生成日期: 2026-07-09
> 回归重审启动日期: 2026-07-25
> 状态: `design_reopen_7r_m0_completed_wait_user_review`
> 所属流程: `03_ddd_calibration_flow.md`
> 本 Step 口径: 在 Step 5 固定 `contracts/domain/application/infra/api/worker/jobs` 七个实现模块、Step 6 闭口对象字段 / 函数 / 状态后,逐模块定义 repository、resolver、backend、handoff、publisher、UoW、idempotency、stored result、entry adapter 和 fake parity 契约。本步不定义完整 DTO schema、HTTP path、topic、DDL、配置 key、测试用例或实施 boundary。
> 当前效力: 原§1~§24整体为historical reviewed material，只作旧名称和缺口诊断，不拥有current callable authority；当前恢复点以物理末尾§25和`03_ddd_step_07_trait_port_adapter_contracts_regression_control.md`为准。

---

## 1. Step 开工确认

| 检查项 | 结论 |
|---|---|
| 用户是否已确认进入 Step 7 | 是。Step 6 审查点后用户已回复“同意”,允许进入 Step 7。 |
| 项目级台账是否允许进入 Step 7 | 是。`project_execution_ledger.md` 原恢复点为 Step 6 `pass_wait_review`,用户确认后可进入 Step 7。 |
| 文档级 flow 是否允许进入 Step 7 | 是。`03_ddd_calibration_flow.md` 原记录 Step 7 `blocked_by_step_6_review`,用户确认后门禁满足。 |
| 是否已读取 Step 6 对象契约 | 是。Step 6 已闭口 `contracts/domain/application/infra/api/worker/jobs` 的对象、字段、函数、状态、support carrier 和 Step 7 承接清单。 |
| 是否已读取详细设计 SOP Step 7 | 是。本步必须逐模块定义 trait / port / adapter,输出 capability 接缝清单、Rust trait 片段、调用方 / 实现方关系、模块停审和跨模块审计。 |
| 是否已读取详细设计书写规范 §5.5 / §5.6 | 是。正式 §5 后续按模块回填 Trait / Port / Adapter 契约,正式 §6 只做索引。 |
| 是否已读取真相源闭环标准 | 是。当前重点覆盖 callable surface、repository read/write parity、stored result、version / UoW、outcome enum 和 fake parity。 |
| 是否发现阻塞 Step 7 的上游 blocker | 否。`04` / `07` 缺失、backend 产品、config key、topic、DDL、测试结果仍为后续文档或后续 Step 闭口项,不阻塞本步 port contract。 |

---

## 2. 本步目标

本步要把 Step 6 已经闭口的对象能力转译成实现者可以直接落 trait、adapter 和 fake 的 Rust-facing 契约。重点不是“会调用外部系统”,而是每个接缝的 owner、调用方、实现方、函数签名、参数来源、返回分类、UoW / version / idempotency / no-write / no-rollback 口径都明确。

本步必须闭口:

- `application` 作为唯一 port trait owner。
- `infra` 作为 repository、resolver、backend、handoff、publisher、runtime builder 和 fake / durable adapter owner。
- `api/worker/jobs` 作为 entry adapter,只调用 application service / facade,不得直接访问 repository、domain transition 或 external adapter。
- `ContextReferenceResolverPort`、sandbox truth repository / UoW、backend capability / isolation backend port、policy summary port、capture / material / observability / handoff ports、cleanup / investigation / redline ports、projection / derived repositories、event relay / publisher port、idempotency / stored result repository、runtime builder / config adapter、entry facade。
- 每个 port 的 fake parity,避免 implementation agent 用字符串错误、私有 map、裸 bool、timestamp、page cursor 或临时默认值绕过正式 surface。

本步不处理:

- Command / Query / Event / Job DTO 字段全集。
- HTTP / RPC path、topic、schema version 和 public error code 完整映射。
- 逐接口函数级处理流、事务 save order、状态矩阵、错误恢复矩阵。
- 持久化表结构、索引、migration、配置 key、env var、产品参数。
- 测试用例全集、验收 evidence、run_id、签署结论、实施 commit boundary。

---

## 3. 本步输入

| 输入 | 状态 | 用途 |
|---|---|---|
| `projects/L4-sandbox/design-calibration/project_execution_ledger.md` | 已读取 | 确认当前 full-restart 恢复点和进入 Step 7 的门禁。 |
| `projects/L4-sandbox/design-calibration/03_ddd_calibration_flow.md` | 已读取 | 确认 Step 1~6 已完成、Step 7 当前可进入、正式 `03` 仍不得修改。 |
| `03_ddd_step_05_module_contracts.md` | 已读取 | 提供七模块主轴、依赖方向、port owner 和 entry 模块禁止事项。 |
| `03_ddd_step_06_object_contracts.md` | 已读取 | 提供对象能力、字段来源、状态 owner、support carrier 和 §19 Step 7 承接清单。 |
| `02_hld_step_07_api_interface_skeleton.md` | 已读取 | 提供 Command / Query / Consumer / Outbound Event / Operations Job / External Port 骨架。 |
| `02_hld_step_12_detailed_design_handoff.md` | 已读取 | 提供 `03` 必须继续展开的 service、repository、UoW、port、flow 和 state 输入。 |
| 正式 `00-需求文档.md` | 已读取 | 提供 C-SBX-1~5、数据归属、接口依赖、NFR 和一票否决红线。 |
| 正式 `01-架构设计.md` | 已读取 | 提供独立 execution isolation truth、coherent boundary、policy fail-closed、capture / handoff 分层、cleanup / redline 架构底线。 |
| 正式 `02-概要设计.md` | 已读取 | 提供代码主体、6 个主要组成部分、关键对象、接口骨架、flow、状态和异常输入。 |
| `projects/L1-artifact/design-calibration/03_ddd_step_07_trait_port_adapter_contracts.md` | 已读取 | 参考 Step 7 粒度、callable surface、repository / stored result / fake parity 写法。 |
| `projects/L1-governance/design-calibration/03_ddd_step_07_trait_port_adapter_contracts.md` | 已读取 | 参考 module port owner、UoW cursor、subject mapper 和跨模块审计写法。 |

---

## 4. Step 内计划

| 顺序 | 动作 | 状态 | 产物 / 门禁 |
|---:|---|---|---|
| 1 | 读取项目级台账、`03` flow、Step 6、Step 7 SOP、书写规范和真相源标准。 | done | 用户确认 Step 6 后允许进入 Step 7。 |
| 2 | 从 Step 6 §19 拆解 11 组必须承接的 port / repository / adapter 契约。 | done | 形成 application port 和 infra adapter 批次。 |
| 3 | 对照正式 `00/01/02` 复核 sandbox 重点边界和禁止混入项。 | done | 保持 execution environment identity、boundary、policy、capture、cleanup、redline 闭环。 |
| 4 | 输出模块级 port owner、access rule、capability / 接缝清单和共享 helper。 | done | 避免全仓 port 总表漂移。 |
| 5 | 写入 `application` service facade、repository、resolver、backend、handoff、relay、idempotency 和 stored result trait。 | done | 每个函数有参数、返回、错误和 UoW / version 口径。 |
| 6 | 写入 `infra` adapter / fake parity 和 `api/worker/jobs` entry restriction。 | done | adapter 不改业务 truth,entry 不直接访问 repository。 |
| 7 | 输出模块停审、跨模块接缝审计、回填草稿、待确认事项和进入下一步条件。 | done | Step 8 可按协议族继续。 |
| 8 | 更新 `03_ddd_calibration_flow.md` 和项目级台账。 | done | 当前恢复点停在 Step 7 审查点,不跨到 Step 8。 |

---

## 5. SOP 问题回答

| SOP 问题 | 本步回答 |
|---|---|
| 哪些模块需要定义 trait / port | 只有 `application` 定义 service facade、repository、resolver、backend、handoff、publisher、UoW、clock、id generator、idempotency 和 stored result trait。 |
| 哪些模块负责实现这些 trait / port | `infra` 负责实现所有 application port,包括 fake 和 durable adapter。`api/worker/jobs` 只装配并调用 application service。 |
| 哪些 capability / 对象能力需要接缝 | intake reference resolution、truth persistence、boundary / backend、policy summary、run / capture / handoff、cleanup / investigation / redline、projection / derived、event relay、idempotency / stored result、runtime builder、entry facade。 |
| 每个 trait / port 承接 Step 6 的哪个内容 | §9~§15 的接缝表逐项回指 Step 6 对象:context、identity、boundary、policy、run、capture、handoff、failure、control、lease、cleanup、redline、projection、relay、audit、idempotency、entry object。 |
| repository / external client 函数签名是什么 | §12 给出 Rust trait 片段。truth mutation 读取使用 `Versioned<T>`;写入使用 `&dyn SandboxUnitOfWork` 和 `expected_version`;append-only trace / audit 使用 append;adapter outcome 使用 Step 6 outcome enum。 |
| 每个读取函数是否覆盖 DTO / flow / state matrix / projection stale | 是。query、job、projection rebuild、relay、cleanup、redline、handoff retry 和 duplicate replay 所需读取面均有正式 port。 |
| 写入函数的 expected_version、UoW、幂等和 append-only 口径是否闭合 | 是。truth save 使用 expected version;append-only record 不更新;idempotency reserve / complete 与 stored result save / get 对称;UoW cursor 是 truth / reference marker 唯一事务 cursor 来源。 |
| 哪些依赖只能通过 trait 访问 | identity / work / runtime / tool safe summary、policy / authorization summary、backend capability、isolation backend、material / observability / investigation handoff、event publisher、durable store、clock、id generator、config runtime binding。 |
| 模块内 trait / port 是否通过停审 | 见 §18。每个模块均完成停审,未发现 unresolved port owner 或 access violation。 |
| 跨模块接缝是否存在重复 port、反向依赖、读取面缺失或 version 来源缺失 | 见 §19。当前无 unresolved blocker。 |

---

## 6. 当前文档问题诊断

| 位置 | 当前问题 | 本步处理 |
|---|---|---|
| Step 6 对象契约 | 对象、字段、状态已闭口,但 repository / resolver / adapter 函数仍未定义。 | 本步将 Step 6 §19 拆成 application port 和 infra adapter 契约。 |
| `api/worker/jobs` entry object | Step 6 已闭口 entry shell,但如果不定义调用限制,实现者可能直接读 repository 或扫 adapter state。 | 本步定义 entry facade 和 no direct repository rule。 |
| projection / derived / relay | 只读 / 可重建对象若没有正式读取面,query / job 容易临时拼 view ref 或反写 truth。 | 本步定义 projection / derived repository、relay store 和 publisher outcome。 |
| idempotency / stored result | duplicate replay 若没有保存 / 读取对称面,实现者会重算结果。 | 本步定义 reserve、get、complete、conflict、typed stored result save / get。 |
| backend / handoff / publisher | 若 adapter failure 只返回错误字符串,application / fake 会自行分类。 | 本步要求 adapter 返回 Step 6 已闭口 outcome enum,service 不解析 raw error。 |

---

## 7. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| Port owner | Step 5 只声明 `application` 为 port owner。 | 本步定义 `application` 具体 trait 文件、函数和调用限制。 | 防止 `infra` 或 entry 模块自定义替代 trait。 |
| Repository | Step 6 只有 truth object 和状态 owner。 | 本步定义 `Versioned<T>` 读取、expected version 写入、append-only record 和 list / page helper。 | 支撑 Step 9 flow、Step 10 state matrix、Step 11 persistence。 |
| External adapter | Step 6 只有 adapter outcome object。 | 本步定义 resolver、policy、backend、handoff、publisher、investigation port 方法与 outcome。 | 防止 string error 分类和 raw SDK response 入仓。 |
| Entry | Step 6 只有 entry envelope / receipt / accumulator。 | 本步定义 entry 只能调用 application facade,不访问 repository / port。 | 防止 API / worker / jobs 混入 orchestration truth。 |
| Fake parity | Step 6 仅给出禁止事项。 | 本步逐 adapter 定义 fake 与 durable 必须等价的字段、版本和 outcome。 | 实现和测试不会靠私有 map 或临时默认值通过。 |

---

## 8. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| A. 所有 port trait 由 `application` 定义,`infra` 实现 | 依赖方向清楚,application 可测试,entry 不下探。 | `application/src/ports.rs` 较重,需要分组。 | 采用。 |
| B. 各 adapter 在 `infra` 自定义 trait,application 依赖 infra trait | adapter 写起来直观。 | 造成反向依赖,port owner 漂移,无法约束 fake parity。 | 不采用。 |
| C. 按 backend / policy / handoff 产品分别定义 trait | 产品接入直接。 | 会把产品能力反向写进 sandbox truth,且违反运行期依赖裁剪。 | 不采用。 |
| D. 将 repository 拆成一个泛型 `SandboxRepository<T>` | 代码量少。 | 缺少 exact read surface、list scope、version 来源和 Step 9 flow 反查能力。 | 不采用。 |
| E. Entry 模块直接访问 repository 执行 query 或 job | 少一层调用。 | 破坏 no-write / no-repair / no-direct-port 规则,也让 duplicate / UoW 难以统一。 | 不采用。 |

---

## 9. 结构化中间产物

### 9.1 Step 7 写入批次状态表

| 批次 | 覆盖范围 | 写入状态 | 是否内容完整 | 停审状态 | 后续批次 |
|---|---|---|---|---|---|
| `7.0` | 开工确认、输入、计划、SOP 回答、诊断、取舍 | 已写入 | 是 | 已自检 | `7.1` |
| `7.1` | 模块 owner、access rule、shared helper、UoW / clock / id generator | 已写入 | 是 | 已自检 | `7.2` |
| `7.2` | `application` service facade 与 repository / resolver / backend / handoff / relay / result port | 已写入 | 是 | 已自检 | `7.3` |
| `7.3` | `infra` adapter / fake parity 与 entry adapter restriction | 已写入 | 是 | 已自检 | `7.4` |
| `7.4` | 模块停审、跨模块审计、回填草稿、待确认事项、最终自检 | 已写入 | 是 | 待用户审查 | 无 |

### 9.2 模块级 port owner 总览

| 模块 | 是否定义 port | 是否实现 port | 是否可直接访问 port | 结论 |
|---|---|---|---|---|
| `contracts` | 否 | 否 | 否 | 只定义 public DTO / ref / view / receipt / error carrier;Step 8 消费。 |
| `domain` | 否 | 否 | 否 | 只定义 truth object、state、guard、domain error;不读 repository 或 external adapter。 |
| `application` | 是 | 否 | 是 | 唯一 service / port / repository / UoW / idempotency owner。 |
| `infra` | 否 | 是 | 否 | 只实现 application port,提供 fake / durable adapter 和 runtime builder。 |
| `api` | 否 | 否 | 否 | 只做 sync command / query entry mapping,调用 application facade。 |
| `worker` | 否 | 否 | 否 | 只做 consumer / fulfillment / relay entry,调用 application facade。 |
| `jobs` | 否 | 否 | 否 | 只做 one-shot maintenance runner,调用 application job facade。 |

### 9.3 实现方 / 调用方关系表

| 接缝族 | 定义方 | 直接调用方 | 实现方 | 关系结论 |
|---|---|---|---|---|
| application service facade | `application` | `api`;`worker`;`jobs` | `application` service structs | entry 只调用 facade,不访问 repository、domain transition 或 external adapter。 |
| UnitOfWork / clock / id generator | `application` | `application` services | `infra` | 事务 cursor、时间和 id 来源统一,不得用 timestamp / route / cursor 代替。 |
| truth / projection / relay / idempotency repositories | `application` | `application` services | `infra` | fake 和 durable 必须字段、version、page、stored result 对称。 |
| context / policy / backend / handoff / investigation / publisher ports | `application` | `application` services | `infra` | 外部协作只返回 body-free ref / summary / outcome,不引入 sibling repo 编译依赖。 |
| runtime builder | `infra` | `api`;`worker`;`jobs` startup | `infra` | 只装配 service 和 adapter,不得改变业务不变量。 |

### 9.4 Shared application port helper

以下 helper 固定归属 `crates/application/src/ports.rs` 或 `crates/application/src/unit_of_work.rs`。它们不是 public protocol DTO,不进入 `contracts`;Step 8 若需要对外暴露 page、cursor、receipt 或 DTO,必须另行定义 public schema 并映射到这些 application-local helper。

```rust
/// Stable application-local transaction reference.
pub struct SandboxTransactionRef(pub String);

/// Optimistic version attached to persisted sandbox truth.
pub struct SandboxRepositoryVersion(pub u64);

/// Opaque cursor used by repository pagination.
pub struct SandboxRepositoryCursor(pub String);

/// Repository page request used inside application ports.
pub struct SandboxRepositoryPage {
    /// Opaque cursor from a previous page.
    pub cursor: Option<SandboxRepositoryCursor>,
    /// Maximum number of items to return.
    pub limit: u32,
}

/// Persisted value paired with optimistic version.
pub struct Versioned<T> {
    /// Persisted value.
    pub value: T,
    /// Version required by the next optimistic write.
    pub version: SandboxRepositoryVersion,
}

/// Repository page result.
pub struct Page<T> {
    /// Returned items.
    pub items: Vec<T>,
    /// Cursor for the next page.
    pub next_cursor: Option<SandboxRepositoryCursor>,
}

/// Committed cursor assigned by sandbox persistence.
pub struct SandboxTruthCursor(pub String);

/// Scope used by reference refresh jobs.
pub enum SandboxReferenceRefreshScope {
    /// Refresh only the provided tracked references.
    ExplicitRefs(ExternalSourceRefSet),
    /// Refresh references known to be stale or degraded.
    StaleOrDegraded,
    /// Refresh references related to one controlled execution context.
    ByContext(ControlledExecutionContextRef),
}

/// Body-free snapshot used to rebuild one read projection.
pub struct SandboxProjectionRebuildSnapshot {
    /// Projection reference.
    pub projection_ref: SandboxReadProjectionRef,
    /// Context reference for the projection.
    pub context_ref: ControlledExecutionContextRef,
    /// Status view refs used by the projection factory.
    pub status_view_refs: Vec<SandboxOpaqueRef>,
    /// Source truth refs used to derive the projection.
    pub source_truth_refs: Vec<SandboxOpaqueRef>,
}

/// Body-free reconciliation input item.
pub struct SandboxReconciliationSnapshotItem {
    /// Item reference.
    pub item_ref: SandboxOpaqueRef,
    /// Related source refs.
    pub source_refs: Vec<SandboxOpaqueRef>,
    /// Optional degraded marker.
    pub degraded_marker: Option<SandboxReason>,
}

/// Application-local result for entry/service calls.
pub type ApplicationResult<T> = Result<T, SandboxApplicationError>;
```

| helper | 作用 | 闭环口径 |
|---|---|---|
| `SandboxTransactionRef` | UoW 事务引用 | application-local opaque ref;用于 adapter 断言和 trace context,不得当 public truth id。 |
| `SandboxRepositoryVersion` | optimistic write token | 只能来自 `get_*_with_version` 或 `list_*_with_version`;不得用 page cursor / timestamp / id generator 代替。 |
| `SandboxRepositoryCursor` | repository page cursor | 只表达列表位置,不得当 version、truth cursor 或 source marker。 |
| `Versioned<T>` | mutation 前置读取面 | 所有需要 expected version 的保存必须先读取 `Versioned<T>`。 |
| `Page<T>` | application-local page helper | Step 8 public page DTO 必须显式映射,不得把 helper 直接作为 public schema。 |
| `SandboxTruthCursor` | committed truth / reference marker cursor | 只能由 UoW 在 staged writes 后分配,rollback 不得泄露。 |
| `SandboxReferenceRefreshScope` | reference refresh job selection helper | scope 必须显式展开,不得由 job / fake 扫描外部正文或猜 source family。 |
| `SandboxProjectionRebuildSnapshot` | projection rebuild body-free input | 必须提供 view factory 所需字段,不得从 existing view / config / fake map 反推。 |
| `SandboxReconciliationSnapshotItem` | reconciliation body-free input | finding 只保存 refs / marker,不得修 core truth 或保存外部正文。 |

### 9.5 UnitOfWork、Clock 与 IdGenerator

```rust
/// Transaction handle passed to repository writes.
pub trait SandboxUnitOfWork {
    /// Returns a stable transaction reference for adapter assertions.
    fn transaction_ref(&self) -> SandboxTransactionRef;

    /// Assigns the cursor for accepted sandbox truth changes staged in this UoW.
    fn assign_truth_change_cursor(&self) -> ApplicationResult<SandboxTruthCursor>;

    /// Assigns the cursor for reference/projection marker changes staged in this UoW.
    fn assign_reference_marker_cursor(&self) -> ApplicationResult<SandboxTruthCursor>;
}

/// Creates and finalizes sandbox transactions.
pub trait SandboxUnitOfWorkManager {
    /// Begins a write transaction.
    async fn begin(&self) -> ApplicationResult<Box<dyn SandboxUnitOfWork>>;

    /// Commits a previously opened transaction.
    async fn commit(&self, uow: Box<dyn SandboxUnitOfWork>) -> ApplicationResult<()>;

    /// Rolls a transaction back after a failed flow.
    async fn rollback(&self, uow: Box<dyn SandboxUnitOfWork>) -> ApplicationResult<()>;
}

/// Provides logical time to application flows.
pub trait SandboxClockPort {
    /// Returns the current logical instant.
    fn now(&self) -> ApplicationResult<SandboxInstant>;
}

/// Generates typed sandbox references.
pub trait SandboxIdGeneratorPort {
    /// Creates a controlled execution context reference.
    fn next_context_ref(&self) -> ApplicationResult<ControlledExecutionContextRef>;

    /// Creates an execution environment identity reference.
    fn next_environment_identity_ref(&self) -> ApplicationResult<ExecutionEnvironmentIdentityRef>;

    /// Creates a context-resolution reference.
    fn next_execution_context_resolution_ref(&self) -> ApplicationResult<ExecutionContextResolutionRef>;

    /// Creates a boundary requirement reference.
    fn next_boundary_requirement_ref(&self) -> ApplicationResult<BoundaryRequirementSetRef>;

    /// Creates a boundary decision reference.
    fn next_boundary_decision_ref(&self) -> ApplicationResult<BoundaryEstablishmentDecisionRef>;

    /// Creates a coherent boundary reference.
    fn next_coherent_boundary_ref(&self) -> ApplicationResult<CoherentBoundaryRef>;

    /// Creates a lease reference.
    fn next_lease_ref(&self) -> ApplicationResult<LeaseRecordRef>;

    /// Creates a policy applicability snapshot reference.
    fn next_policy_snapshot_ref(&self) -> ApplicationResult<PolicyApplicabilitySnapshotRef>;

    /// Creates a policy execution decision reference.
    fn next_policy_decision_ref(&self) -> ApplicationResult<PolicyExecutionDecisionRef>;

    /// Creates a high-risk action decision reference.
    fn next_high_risk_action_decision_ref(&self) -> ApplicationResult<HighRiskActionDecisionRef>;

    /// Creates a run reference.
    fn next_run_ref(&self) -> ApplicationResult<ControlledExecutionRunRef>;

    /// Creates a capture fact reference.
    fn next_capture_ref(&self) -> ApplicationResult<CaptureFactRef>;

    /// Creates a handoff fact reference.
    fn next_handoff_ref(&self) -> ApplicationResult<HandoffFactRef>;

    /// Creates a failure classification reference.
    fn next_failure_ref(&self) -> ApplicationResult<FailureClassificationRef>;

    /// Creates a control fact reference.
    fn next_control_ref(&self) -> ApplicationResult<ControlFactRef>;

    /// Creates a cleanup guard reference.
    fn next_cleanup_guard_ref(&self) -> ApplicationResult<CleanupGuardRef>;

    /// Creates a redline containment reference.
    fn next_redline_ref(&self) -> ApplicationResult<RedlineContainmentRef>;

    /// Creates an orphan recovery reference.
    fn next_orphan_recovery_ref(&self) -> ApplicationResult<OrphanRecoveryRecordRef>;

    /// Creates a reference-state reference.
    fn next_reference_state_ref(&self) -> ApplicationResult<ReferenceResolutionStateRef>;

    /// Creates a projection reference.
    fn next_projection_ref(&self) -> ApplicationResult<SandboxReadProjectionRef>;

    /// Creates a derived-state reference.
    fn next_derived_state_ref(&self) -> ApplicationResult<DerivedInspectPreviewTrendStateRef>;

    /// Creates an event-relay reference.
    fn next_relay_ref(&self) -> ApplicationResult<SandboxEventRelayRecordRef>;

    /// Creates an audit trace reference.
    fn next_trace_ref(&self) -> ApplicationResult<SandboxOpaqueRef>;

    /// Creates an opaque reconciliation-report reference.
    fn next_reconciliation_report_ref(&self) -> ApplicationResult<SandboxOpaqueRef>;

    /// Creates an opaque idempotency-record reference.
    fn next_idempotency_ref(&self) -> ApplicationResult<SandboxOpaqueRef>;

    /// Creates an opaque stored-result reference.
    fn next_stored_result_ref(&self) -> ApplicationResult<SandboxOpaqueRef>;

    /// Creates an opaque query-access-decision reference.
    fn next_query_access_decision_ref(&self) -> ApplicationResult<SandboxOpaqueRef>;

    /// Creates an opaque service-outcome reference.
    fn next_service_outcome_ref(&self) -> ApplicationResult<SandboxOpaqueRef>;

    /// Creates an opaque consumer-receipt reference.
    fn next_consumer_receipt_ref(&self) -> ApplicationResult<SandboxOpaqueRef>;

    /// Creates an opaque worker-run reference.
    fn next_worker_run_ref(&self) -> ApplicationResult<SandboxOpaqueRef>;

    /// Creates an opaque job-run reference.
    fn next_job_run_ref(&self) -> ApplicationResult<SandboxOpaqueRef>;

    /// Creates an opaque job-report reference.
    fn next_job_report_ref(&self) -> ApplicationResult<SandboxOpaqueRef>;
}
```

`SandboxIdGeneratorPort`必须覆盖Step 6中所有由application / worker / jobs生成的sandbox-owned identity。backend capability ref、isolation handle ref、material ref和下游receipt ref仍由对应adapter outcome提供;domain、entry、repository和fake不得拼接任何上述ID。deterministic fake必须逐方法生成稳定且不碰撞的typed ref。

| UoW cursor rule | 正式口径 |
|---|---|
| truth cursor 分配时机 | accepted command 必须先 stage 所有 changed truth、audit、relay、stored result,再调用 `assign_truth_change_cursor()`。 |
| reference marker cursor 分配时机 | consumer / reference refresh 必须先 stage reference state、projection stale marker 或 safe summary ref,再调用 `assign_reference_marker_cursor()`。 |
| rollback 语义 | rollback 后 cursor 不得暴露到 receipt、event、trace、job report 或 fake assertion。 |
| forbidden source | 不得用 `SandboxRepositoryCursor`、`SandboxRepositoryVersion`、timestamp、id generator、trace ref、idempotency digest 或 hard-coded string 替代 cursor。 |
| fake / durable parity | fake 必须给出单调、稳定、可断言的 cursor;durable adapter 可用 store transaction sequence,但 service 不感知来源。 |

---

## 10. `contracts` 模块 port capability / 接缝清单

`contracts` 模块不定义 trait / port。它只提供 Step 8 public protocol 要使用的 typed ref、view、receipt、job report、error 和 metadata carrier。本步对 `contracts` 的结论是禁止新增 port,避免 public DTO surface 反向持有 repository 或 adapter 语义。

| capability / 对象能力 | 需要的接缝 | 调用方 | 实现方 | 后续承接 |
|---|---|---|---|---|
| public typed ref / marker / status | 无 port | Step 8 DTO mapper | 不适用 | Step 8 定义 public DTO 字段映射。 |
| public receipt / report / view shell | 无 port | `api/worker/jobs` response mapper | 不适用 | Step 8 定义 response / receipt / report schema。 |
| public error kind / disposition | 无 port | entry error mapper | 不适用 | Step 12 错误模型补充映射。 |

| 名称 | 类型 | 定义位置 | 作用 | 关键函数 |
|---|---|---|---|---|
| none | none | none | `contracts` 不定义 port | none |

停审结论:

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| public DTO 是否携带 repository / adapter 语义 | 否 | none |
| contracts 是否依赖 domain / application / infra | 否 | none |
| Step 8 是否能消费 carrier | 是 | Step 8 仍需定义 DTO 字段全集。 |

---

## 11. `domain` 模块 port capability / 接缝清单

`domain` 模块不定义 infrastructure port。domain object、factory、guard 和 state transition 只接收已经由 `application` 加载或 adapter 返回后映射完成的 typed carrier。

| capability / 对象能力 | 需要的接缝 | 调用方 | 实现方 | 后续承接 |
|---|---|---|---|---|
| truth object transition | 无 port,由 application 前置加载对象 | `application` service | 不适用 | Step 9 flow 调用 domain method。 |
| guard / policy decision | 无 external port,只消费 `PolicyApplicabilitySnapshot` 等对象 | `application` service | 不适用 | Step 10 状态矩阵和 Step 12 错误模型。 |
| capture / handoff / cleanup / redline invariant | 无 direct adapter | `application` service | 不适用 | Step 9 / Step 10。 |

| 名称 | 类型 | 定义位置 | 作用 | 关键函数 |
|---|---|---|---|---|
| none | none | none | `domain` 不定义 port | none |

停审结论:

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| domain 是否访问 repository / adapter / config | 否 | none |
| domain 是否保存 external body / SDK response | 否 | none |
| domain transition 参数来源是否可由 Step 7 port 提供 | 是 | Step 9 逐 flow 必须回指具体 port 函数。 |

---

## 12. `application` 模块 Trait / Port / Adapter 契约

### 12.1 `application` port capability / 接缝清单

| capability / 对象能力 | 需要的接缝 | 调用方 | 实现方 | 后续承接 |
|---|---|---|---|---|
| 受理与 identity | `ContextReferenceResolverPort`;`SandboxTruthRepository`;`SandboxAuditTraceRepository`;id generator | `intake_service`;`environment_service` | `infra` resolver / repository | Step 8 command / event;Step 9 intake flow;Step 10 intake state |
| boundary 与 backend | `BackendCapabilityPort`;`IsolationBackendPort`;truth repository | `boundary_service`;`run_service`;jobs | `infra` backend adapters | Step 9 boundary / run flow;Step 14 config |
| policy / high-risk | `PolicySummaryPort`;truth repository | `policy_service` | `infra` policy adapter | Step 8 / Step 9 policy command;Step 12 fail-closed |
| run / capture / handoff | `ExecutionCapturePort`;`MaterialHandoffPort`;`ObservabilityMaterialPort`;truth repository | `run_service`;`capture_handoff_service`;worker | `infra` backend / handoff adapter | Step 9 run / capture flow |
| failure / control / cleanup / redline | `BackendLifecycleInspectionPort`;`InvestigationHandoffPort`;truth repository | `failure_control_service`;`cleanup_service`;`redline_service`;jobs | `infra` lifecycle / investigation adapters | Step 10 state;Step 12 recovery |
| query / projection / derived / reconciliation | `SandboxProjectionRepository`;`SandboxDerivedRepository`;`SandboxTruthSnapshotRepository`;truth snapshot readers | `query_service`;`derived_service`;jobs | `infra` projection store | Step 8 query DTO;Step 11 persistence |
| relay / publisher | `SandboxEventRelayRepository`;`SandboxEventPublisherPort` | `relay_service`;worker;job | `infra` relay store / publisher | Step 8 outbound event;Step 9 relay flow |
| idempotency / stored result | `SandboxIdempotencyRepository`;`SandboxStoredResultRepository` | all command / consumer / job services | `infra` idempotency store | Step 13 idempotency;Step 8 receipts |

### 12.2 Application service facade

Entry modules call these facades; they do not call repositories directly. Exact DTO schema is Step 8, so service inputs here use Step 6 object names and application-local input carriers.

```rust
/// Facade used by sync command handlers.
pub trait SandboxCommandService {
    /// Opens a controlled execution context.
    async fn open_controlled_execution_context(
        &self,
        ctx: SandboxServiceCallContext,
        input: OpenControlledExecutionContextInput,
    ) -> ApplicationResult<SandboxServiceOutcome>;

    /// Establishes a coherent execution boundary.
    async fn establish_execution_boundary(
        &self,
        ctx: SandboxServiceCallContext,
        input: EstablishExecutionBoundaryInput,
    ) -> ApplicationResult<SandboxServiceOutcome>;

    /// Evaluates launch policy for an accepted context and boundary.
    async fn evaluate_policy_execution(
        &self,
        ctx: SandboxServiceCallContext,
        input: EvaluatePolicyExecutionInput,
    ) -> ApplicationResult<SandboxServiceOutcome>;

    /// Starts a controlled execution run.
    async fn start_controlled_execution_run(
        &self,
        ctx: SandboxServiceCallContext,
        input: StartControlledExecutionRunInput,
    ) -> ApplicationResult<SandboxServiceOutcome>;

    /// Records capture output from an established run.
    async fn record_capture_result(
        &self,
        ctx: SandboxServiceCallContext,
        input: RecordCaptureResultInput,
    ) -> ApplicationResult<SandboxServiceOutcome>;

    /// Opens material or observability handoff for captured material.
    async fn open_material_handoff(
        &self,
        ctx: SandboxServiceCallContext,
        input: OpenMaterialHandoffInput,
    ) -> ApplicationResult<SandboxServiceOutcome>;

    /// Submits a sandbox control fact.
    async fn submit_sandbox_control(
        &self,
        ctx: SandboxServiceCallContext,
        input: SubmitSandboxControlInput,
    ) -> ApplicationResult<SandboxServiceOutcome>;

    /// Classifies a sandbox failure.
    async fn classify_sandbox_failure(
        &self,
        ctx: SandboxServiceCallContext,
        input: ClassifySandboxFailureInput,
    ) -> ApplicationResult<SandboxServiceOutcome>;

    /// Evaluates whether cleanup may proceed.
    async fn evaluate_cleanup_readiness(
        &self,
        ctx: SandboxServiceCallContext,
        input: EvaluateCleanupReadinessInput,
    ) -> ApplicationResult<SandboxServiceOutcome>;

    /// Records redline containment state.
    async fn record_redline_containment(
        &self,
        ctx: SandboxServiceCallContext,
        input: RecordRedlineContainmentInput,
    ) -> ApplicationResult<SandboxServiceOutcome>;
}

/// Facade used by sync query handlers.
pub trait SandboxQueryService {
    /// Reads execution status.
    async fn get_execution_status(
        &self,
        ctx: SandboxServiceCallContext,
        input: GetSandboxExecutionStatusInput,
    ) -> ApplicationResult<SandboxStatusViews>;

    /// Reads read projection or derived view.
    async fn get_read_projection(
        &self,
        ctx: SandboxServiceCallContext,
        input: GetSandboxReadProjectionInput,
    ) -> ApplicationResult<SandboxReadProjectionViewResult>;

    /// Reads audit trace page.
    async fn get_audit_trace(
        &self,
        ctx: SandboxServiceCallContext,
        input: GetSandboxAuditTraceInput,
    ) -> ApplicationResult<Page<SandboxAuditTrace>>;
}

/// Facade used by worker consumers.
pub trait SandboxConsumerService {
    /// Consumes a reference or summary change event.
    async fn consume_reference_change(
        &self,
        ctx: SandboxServiceCallContext,
        input: ConsumeReferenceChangeInput,
    ) -> ApplicationResult<SandboxConsumerReceipt>;

    /// Consumes handoff, backend lifecycle, control, or relay feedback events.
    async fn consume_sandbox_feedback(
        &self,
        ctx: SandboxServiceCallContext,
        input: ConsumeSandboxFeedbackInput,
    ) -> ApplicationResult<SandboxConsumerReceipt>;
}

/// Facade used by operations jobs.
pub trait SandboxJobService {
    /// Runs one maintenance job and returns a report.
    async fn run_job(
        &self,
        ctx: SandboxServiceCallContext,
        input: SandboxJobServiceInput,
    ) -> ApplicationResult<SandboxJobExitDisposition>;
}
```

| service facade | 调用方 | 事务要求 | 禁止事项 |
|---|---|---|---|
| `SandboxCommandService` | `api`;内部 worker control 可映射为 command service 调用 | command mutation 必须使用 UoW、idempotency、stored result | 不暴露 HTTP / topic / raw body。 |
| `SandboxQueryService` | `api` | no-write;不得 begin write UoW | 不 refresh、repair、handoff、cleanup 或 release。 |
| `SandboxConsumerService` | `worker` | 只在正式 event / feedback flow 中写 refs / marker / receipt | 不伪造 core success,不修核心 truth。 |
| `SandboxJobService` | `jobs` | 只按 job kind 调用 maintenance flow | 不作为业务 command,不绕过 guard。 |

### 12.3 Context / Reference Resolver Port

```rust
/// Resolves body-free external context references for sandbox intake and refresh.
pub trait ContextReferenceResolverPort {
    /// Resolves source refs before an execution context can be accepted.
    async fn resolve_context_refs(
        &self,
        source_refs: ExternalSourceRefSet,
        trace_context: SandboxTraceContext,
    ) -> ApplicationResult<ContextReferenceResolutionOutcome>;

    /// Refreshes tracked references without reading external bodies.
    async fn refresh_tracked_refs(
        &self,
        tracked_refs: ExternalSourceRefSet,
        trace_context: SandboxTraceContext,
    ) -> ApplicationResult<ContextReferenceResolutionOutcome>;
}

/// Body-free result returned by context reference resolvers.
pub struct ContextReferenceResolutionOutcome {
    /// Resolved refs that may be persisted.
    pub resolved_refs: ExternalSourceRefSet,
    /// Body-free safe summary refs.
    pub safe_summaries: SafeSummaryRefSet,
    /// Missing required refs.
    pub unresolved_items: Vec<SandboxReason>,
    /// Conflict markers.
    pub conflict_markers: Vec<SandboxReason>,
    /// Forbidden external body markers.
    pub forbidden_body_markers: ForbiddenExternalBodyMarkerSet,
    /// Resolution status.
    pub resolution_status: ReferenceResolutionStatus,
}
```

| 函数 | 承接 Step 6 内容 | fake parity / 禁止事项 |
|---|---|---|
| `resolve_context_refs` | `ExecutionContextResolution`;`ExternalSourceRefSet`;`SafeSummaryRefSet`;`ForbiddenExternalBodyMarkerSet` | fake 必须返回同样的 missing/conflict/body marker 结构;不得保存 identity/work/tool/runtime/policy 正文。 |
| `refresh_tracked_refs` | `ReferenceResolutionState`;`ReferenceRefreshMarker` | refresh failure 必须返回 business outcome,不得靠 error string 分类。 |

### 12.4 Sandbox Truth Repository

```rust
/// Repository for sandbox-owned truth objects.
pub trait SandboxTruthRepository {
    /// Loads a controlled execution context with optimistic version.
    async fn get_context_with_version(
        &self,
        context_ref: ControlledExecutionContextRef,
    ) -> ApplicationResult<Option<Versioned<ControlledExecutionContext>>>;

    /// Saves a controlled execution context.
    async fn save_context(
        &self,
        uow: &dyn SandboxUnitOfWork,
        context: ControlledExecutionContext,
        expected_version: Option<SandboxRepositoryVersion>,
    ) -> ApplicationResult<ControlledExecutionContextRef>;

    /// Loads an execution environment identity with optimistic version.
    async fn get_environment_identity_with_version(
        &self,
        identity_ref: ExecutionEnvironmentIdentityRef,
    ) -> ApplicationResult<Option<Versioned<ExecutionEnvironmentIdentity>>>;

    /// Saves an execution environment identity.
    async fn save_environment_identity(
        &self,
        uow: &dyn SandboxUnitOfWork,
        identity: ExecutionEnvironmentIdentity,
        expected_version: Option<SandboxRepositoryVersion>,
    ) -> ApplicationResult<ExecutionEnvironmentIdentityRef>;

    /// Loads an immutable boundary requirement for policy evaluation.
    async fn get_boundary_requirement(
        &self,
        requirement_ref: BoundaryRequirementSetRef,
    ) -> ApplicationResult<Option<BoundaryRequirementSet>>;

    /// Loads a coherent boundary with optimistic version.
    async fn get_boundary_with_version(
        &self,
        boundary_ref: CoherentBoundaryRef,
    ) -> ApplicationResult<Option<Versioned<CoherentBoundary>>>;

    /// Loads an isolation handle by the exact ref carried by a coherent boundary.
    async fn get_isolation_handle_with_version(
        &self,
        handle_ref: IsolationEnvironmentHandleRef,
    ) -> ApplicationResult<Option<Versioned<IsolationEnvironmentHandle>>>;

    /// Loads a persisted lease by the exact ref carried by an isolation handle.
    async fn get_lease_with_version(
        &self,
        lease_ref: LeaseRecordRef,
    ) -> ApplicationResult<Option<Versioned<LeaseRecord>>>;

    /// Saves boundary requirement, decision, and coherent boundary as one truth group.
    async fn save_boundary_group(
        &self,
        uow: &dyn SandboxUnitOfWork,
        requirement: BoundaryRequirementSet,
        decision: BoundaryEstablishmentDecision,
        boundary: CoherentBoundary,
        handle: Option<IsolationEnvironmentHandle>,
        lease: Option<LeaseRecord>,
        expected_boundary_version: Option<SandboxRepositoryVersion>,
    ) -> ApplicationResult<CoherentBoundaryRef>;

    /// Loads a policy execution decision with optimistic version.
    async fn get_policy_decision_with_version(
        &self,
        decision_ref: PolicyExecutionDecisionRef,
    ) -> ApplicationResult<Option<Versioned<PolicyExecutionDecision>>>;

    /// Saves policy snapshot, policy decision, and optional high-risk decision.
    async fn save_policy_group(
        &self,
        uow: &dyn SandboxUnitOfWork,
        snapshot: PolicyApplicabilitySnapshot,
        decision: PolicyExecutionDecision,
        high_risk_decision: Option<HighRiskActionDecision>,
        expected_decision_version: Option<SandboxRepositoryVersion>,
    ) -> ApplicationResult<PolicyExecutionDecisionRef>;

    /// Loads a run with optimistic version.
    async fn get_run_with_version(
        &self,
        run_ref: ControlledExecutionRunRef,
    ) -> ApplicationResult<Option<Versioned<ControlledExecutionRun>>>;

    /// Saves a controlled execution run.
    async fn save_run(
        &self,
        uow: &dyn SandboxUnitOfWork,
        run: ControlledExecutionRun,
        expected_version: Option<SandboxRepositoryVersion>,
    ) -> ApplicationResult<ControlledExecutionRunRef>;

    /// Saves capture and handoff facts.
    async fn save_capture_handoff_group(
        &self,
        uow: &dyn SandboxUnitOfWork,
        capture: Option<CaptureFact>,
        handoff: Option<HandoffFact>,
        expected_capture_version: Option<SandboxRepositoryVersion>,
        expected_handoff_version: Option<SandboxRepositoryVersion>,
    ) -> ApplicationResult<SandboxCaptureHandoffRefs>;

    /// Saves failure, control, cleanup, lease, orphan, and redline facts.
    async fn save_safety_group(
        &self,
        uow: &dyn SandboxUnitOfWork,
        group: SandboxSafetyTruthGroup,
    ) -> ApplicationResult<SandboxSafetyTruthRefs>;
}
```

| 读取 / 写入口径 | 正式规则 |
|---|---|
| create | `expected_version = None`;返回 ref 必须来自 id generator 或 object factory,不得由 repository 拼业务 ref。 |
| update | 必须先 `get_*_with_version`;`expected_version` 不得来自 page cursor / timestamp。 |
| grouped save | `save_boundary_group`、`save_policy_group`、`save_capture_handoff_group` 用于同一 use case 内相关 truth 一致提交;后序run只按boundary -> handle -> lease typed refs读取已提交组。 |
| missing | `Option<Versioned<T>> = None` 由 application 映射 not_found / rejected / delayed,adapter 不擅自创建。 |
| fake parity | fake 必须执行 expected version conflict、grouped save、missing 和 list 顺序规则。 |

### 12.5 Audit / Reference / Snapshot / Maintenance Repositories

```rust
/// Append-only repository for sandbox audit traces.
pub trait SandboxAuditTraceRepository {
    /// Appends one audit trace in the active transaction.
    async fn append_trace(
        &self,
        uow: &dyn SandboxUnitOfWork,
        trace: SandboxAuditTrace,
    ) -> ApplicationResult<SandboxOpaqueRef>;

    /// Lists audit traces by subject.
    async fn list_traces_by_subject(
        &self,
        subject_ref: SandboxOpaqueRef,
        page: SandboxRepositoryPage,
    ) -> ApplicationResult<Page<SandboxAuditTrace>>;

    /// Loads one audit trace.
    async fn get_trace(
        &self,
        trace_ref: SandboxOpaqueRef,
    ) -> ApplicationResult<Option<SandboxAuditTrace>>;
}

/// Repository for body-free reference resolution state.
pub trait SandboxReferenceStateRepository {
    /// Loads reference state with optimistic version.
    async fn get_reference_state_with_version(
        &self,
        reference_state_ref: ReferenceResolutionStateRef,
    ) -> ApplicationResult<Option<Versioned<ReferenceResolutionState>>>;

    /// Lists reference states selected for refresh.
    async fn list_reference_states_for_refresh(
        &self,
        scope: SandboxReferenceRefreshScope,
        page: SandboxRepositoryPage,
    ) -> ApplicationResult<Page<Versioned<ReferenceResolutionState>>>;

    /// Saves reference state after resolver refresh.
    async fn save_reference_state(
        &self,
        uow: &dyn SandboxUnitOfWork,
        state: ReferenceResolutionState,
        expected_version: Option<SandboxRepositoryVersion>,
    ) -> ApplicationResult<ReferenceResolutionStateRef>;
}

/// Read-only snapshot repository used by query, rebuild, and reconciliation flows.
pub trait SandboxTruthSnapshotRepository {
    /// Loads a body-free status snapshot for query assembly.
    async fn load_status_snapshot(
        &self,
        context_ref: ControlledExecutionContextRef,
    ) -> ApplicationResult<Option<SandboxExecutionStatusView>>;

    /// Loads body-free truth inputs required to rebuild one projection.
    async fn load_projection_rebuild_snapshot(
        &self,
        projection_ref: SandboxReadProjectionRef,
    ) -> ApplicationResult<Option<SandboxProjectionRebuildSnapshot>>;

    /// Loads body-free truth inputs required by reconciliation jobs.
    async fn load_reconciliation_snapshot(
        &self,
        scope_ref: SandboxOpaqueRef,
        page: SandboxRepositoryPage,
    ) -> ApplicationResult<Page<SandboxReconciliationSnapshotItem>>;
}

/// Repository read side used by maintenance job target selection.
pub trait SandboxMaintenanceSelectionRepository {
    /// Lists pending material handoffs with optimistic versions.
    async fn list_pending_handoffs(
        &self,
        page: SandboxRepositoryPage,
    ) -> ApplicationResult<Page<Versioned<HandoffFact>>>;

    /// Lists active leases whose window has expired.
    async fn list_expired_leases(
        &self,
        now: SandboxInstant,
        page: SandboxRepositoryPage,
    ) -> ApplicationResult<Page<Versioned<LeaseRecord>>>;

    /// Lists cleanup guards waiting for reevaluation.
    async fn list_pending_cleanup_guards(
        &self,
        page: SandboxRepositoryPage,
    ) -> ApplicationResult<Page<Versioned<CleanupGuard>>>;

    /// Lists redline containments waiting for investigation handoff.
    async fn list_redline_handoff_pending(
        &self,
        page: SandboxRepositoryPage,
    ) -> ApplicationResult<Page<Versioned<RedlineContainment>>>;

    /// Lists relay records already delegated to publisher retry.
    async fn list_relay_retry_candidates(
        &self,
        page: SandboxRepositoryPage,
    ) -> ApplicationResult<Page<Versioned<SandboxEventRelayRecord>>>;
}
```

| 函数族 | 承接 Step 6 内容 | fake parity / 禁止事项 |
|---|---|---|
| `append_trace` / `list_traces_by_subject` | `SandboxAuditTrace`;`SandboxTraceKind` | audit append-only;fake 不得修改历史 trace 或从 log line 拼 subject。 |
| `list_reference_states_for_refresh` / `save_reference_state` | `ReferenceResolutionState`;`ReferenceRefreshMarker` | refresh scope 必须正式展开;不得全表扫描外部正文或按字符串猜 source family。 |
| `load_status_snapshot` | `SandboxExecutionStatusView`;query status view | query 只读;缺失映射 unavailable / degraded,不得触发 repair。 |
| `load_projection_rebuild_snapshot` | `SandboxReadProjection`;projection rebuild | snapshot 必须给 view factory 所需 body-free inputs;不得让 rebuild 从 existing view 反推字段。 |
| `load_reconciliation_snapshot` | `SandboxReconciliationReport` | reconciliation 不修 core truth;finding 只保存 refs。 |
| maintenance list functions | `HandoffFact`;`LeaseRecord`;`CleanupGuard`;`RedlineContainment`;`SandboxEventRelayRecord` | jobs 使用 formal list scope;不得扫描 adapter private state 反推 targets。 |

### 12.6 Backend Capability / Isolation Backend Port

```rust
/// Reads or refreshes body-free backend capability summaries.
pub trait BackendCapabilityPort {
    /// Loads capability summary for a backend profile and boundary requirements.
    async fn load_capability_summary(
        &self,
        capability_summary_ref: BackendCapabilitySummaryRef,
        requirement: BoundaryRequirementSet,
        trace_context: SandboxTraceContext,
    ) -> ApplicationResult<BackendCapabilitySummary>;

    /// Refreshes capability summaries for maintenance jobs.
    async fn refresh_capability_summary(
        &self,
        backend_profile_ref: SandboxOpaqueRef,
        trace_context: SandboxTraceContext,
    ) -> ApplicationResult<BackendCapabilitySummary>;
}

/// Establishes and releases isolation environments.
pub trait IsolationBackendPort {
    /// Establishes an isolation environment for validated boundary requirements.
    async fn establish_environment(
        &self,
        context: ControlledExecutionContext,
        identity: ExecutionEnvironmentIdentity,
        requirements: BoundaryRequirementSet,
        capability: BackendCapabilitySummary,
        trace_context: SandboxTraceContext,
    ) -> ApplicationResult<IsolationBackendAdapterOutcome>;

    /// Starts the controlled run in an established isolation environment.
    async fn launch_run(
        &self,
        run: ControlledExecutionRun,
        handle: IsolationEnvironmentHandle,
        trace_context: SandboxTraceContext,
    ) -> ApplicationResult<IsolationBackendAdapterOutcome>;

    /// Inspects backend lifecycle without taking ownership of backend truth.
    async fn inspect_lifecycle(
        &self,
        handle_ref: IsolationEnvironmentHandleRef,
        trace_context: SandboxTraceContext,
    ) -> ApplicationResult<BackendLifecycleSummary>;

    /// Releases an isolation environment after cleanup guard allows it.
    async fn release_environment(
        &self,
        handle_ref: IsolationEnvironmentHandleRef,
        trace_context: SandboxTraceContext,
    ) -> ApplicationResult<IsolationBackendAdapterOutcome>;
}
```

| 函数 | 承接 Step 6 内容 | fake parity / 禁止事项 |
|---|---|---|
| `load_capability_summary` | `BackendCapabilitySummary`;`BoundaryRequirementSet` | 按exact summary ref读取;fake 必须按 supported/unsupported/stale 返回正式 status,不得默认 allow。 |
| `establish_environment` | `ControlledExecutionContext`;`ExecutionEnvironmentIdentity`;`BoundaryRequirementSet`;`BackendCapabilitySummary`;`IsolationEnvironmentHandle`;`IsolationBackendAdapterOutcome` | context / identity / profile / generation必须匹配;不得要求后序policy decision;outcome enum明确 `Established/Unsupported/Failed/Unavailable`,不得解析error string。 |
| `launch_run` | `ControlledExecutionRun`;`IsolationEnvironmentHandle` | 不实现 tools semantic execution 或 runtime agent loop;只承接 isolation launch boundary。 |
| `inspect_lifecycle` | `BackendLifecycleSummary`;`OrphanRecoveryRecord` | 不保存 backend lifecycle body。 |
| `release_environment` | `CleanupGuard`;`LeaseRecord` | 只能在 cleanup guard allowed 后调用;release failure 不伪装 cleanup completed。 |

### 12.7 Policy Summary Port

```rust
/// Loads policy and authorization summaries owned by upstream policy sources.
pub trait PolicySummaryPort {
    /// Loads applicability and authorization summary for a context and boundary requirement.
    async fn load_policy_applicability(
        &self,
        snapshot_ref: PolicyApplicabilitySnapshotRef,
        context: ControlledExecutionContext,
        requirement: BoundaryRequirementSet,
        policy_source_refs: ExternalSourceRefSet,
        authorization_summary_refs: SafeSummaryRefSet,
        requested_high_risk_markers: Vec<HighRiskActionMarker>,
        trace_context: SandboxTraceContext,
    ) -> ApplicationResult<PolicyApplicabilitySnapshot>;
}
```

| 函数 | 承接 Step 6 内容 | fake parity / 禁止事项 |
|---|---|---|
| `load_policy_applicability` | `PolicyApplicabilitySnapshot`;`PolicyApplicabilityStatus`;`HighRiskActionMarker` | request提供policy source refs、authorization summary refs和requested markers,`snapshot_ref`由application id generator提供;adapter一次返回验证后的body-free snapshot与显式disposition;missing/conflicted/stale/unsupported或unknown marker不得转allow;fake必须可制造fail-closed。 |

High-risk markers属于同一policy applicability snapshot的body-free输入,不得通过“先构造policy decision、再用decision查询markers”的反向调用获取。`HighRiskActionDecision::decide(...)`只消费snapshot已携带的markers,不新增policy source truth owner。

### 12.8 Capture / Material / Observability / Handoff Ports

```rust
/// Captures body-free material summaries from a controlled run.
pub trait ExecutionCapturePort {
    /// Collects capture facts and material refs from a completed or failed run.
    async fn collect_capture(
        &self,
        run: ControlledExecutionRun,
        trace_context: SandboxTraceContext,
    ) -> ApplicationResult<CaptureCollectionOutcome>;
}

/// Delivers captured material refs to downstream artifact or investigation owners.
pub trait MaterialHandoffPort {
    /// Hands off captured material refs to a target.
    async fn handoff_material(
        &self,
        handoff: HandoffFact,
        material_refs: Vec<CapturedMaterialRef>,
        trace_context: SandboxTraceContext,
    ) -> ApplicationResult<MaterialHandoffAdapterOutcome>;
}

/// Delivers observability material refs without becoming observability store.
pub trait ObservabilityMaterialPort {
    /// Hands off observability material refs.
    async fn handoff_observability_material(
        &self,
        capture: CaptureFact,
        observability_refs: Vec<ObservabilityMaterialRef>,
        trace_context: SandboxTraceContext,
    ) -> ApplicationResult<MaterialHandoffAdapterOutcome>;
}

/// Outcome returned by the capture adapter.
pub struct CaptureCollectionOutcome {
    /// Capture fact candidate.
    pub capture_fact: CaptureFact,
    /// Captured material refs.
    pub material_refs: Vec<CapturedMaterialRef>,
    /// Observability material refs.
    pub observability_refs: Vec<ObservabilityMaterialRef>,
}
```

| 函数 | 承接 Step 6 内容 | fake parity / 禁止事项 |
|---|---|---|
| `collect_capture` | `CaptureFact`;`CapturedMaterialRef`;`ObservabilityMaterialRef`;`CaptureStatus` | 不保存 stdout/stderr/file body;只返回 refs、digest、kind、status。 |
| `handoff_material` | `HandoffFact`;`MaterialHandoffAdapterOutcome` | delivered/retryable/failed 必须来自 outcome enum;failure 不回滚 capture truth。 |
| `handoff_observability_material` | observability material handoff | 不成为 observability store;只交接 refs。 |

### 12.9 Cleanup / Investigation / Redline Ports

```rust
/// Inspects backend lifecycle and orphan risk for cleanup/reaper flows.
pub trait BackendLifecycleInspectionPort {
    /// Inspects one isolation handle.
    async fn inspect_handle(
        &self,
        handle_ref: IsolationEnvironmentHandleRef,
        trace_context: SandboxTraceContext,
    ) -> ApplicationResult<BackendLifecycleSummary>;
}

/// Hands off redline or cleanup investigation material.
pub trait InvestigationHandoffPort {
    /// Hands off investigation summary and refs.
    async fn handoff_investigation(
        &self,
        containment: RedlineContainment,
        trace_context: SandboxTraceContext,
    ) -> ApplicationResult<InvestigationHandoffSummary>;
}
```

| 函数 | 承接 Step 6 内容 | fake parity / 禁止事项 |
|---|---|---|
| `inspect_handle` | `LeaseRecord`;`OrphanRecoveryRecord`;`BackendLifecycleSummary` | 不重写 backend truth;不绕过 cleanup guard。 |
| `handoff_investigation` | `RedlineContainment`;`InvestigationHandoffSummary` | redline 不 advisory-only;release 必须经过 guard。 |

### 12.10 Projection / Derived / Reconciliation Repositories

```rust
/// Repository for read projections and query surfaces.
pub trait SandboxProjectionRepository {
    /// Loads a read projection for query assembly.
    async fn get_projection(
        &self,
        projection_ref: SandboxReadProjectionRef,
    ) -> ApplicationResult<Option<SandboxReadProjection>>;

    /// Lists projections affected by committed sandbox truth refs.
    async fn list_projections_affected_by_truth(
        &self,
        truth_refs: Vec<SandboxOpaqueRef>,
        page: SandboxRepositoryPage,
    ) -> ApplicationResult<Page<SandboxReadProjectionRef>>;

    /// Saves a rebuilt projection.
    async fn save_projection(
        &self,
        uow: &dyn SandboxUnitOfWork,
        projection: SandboxReadProjection,
        expected_version: Option<SandboxRepositoryVersion>,
    ) -> ApplicationResult<SandboxReadProjectionRef>;

    /// Marks projections stale after accepted truth changes.
    async fn mark_projection_stale(
        &self,
        uow: &dyn SandboxUnitOfWork,
        projection_ref: SandboxReadProjectionRef,
        marker_cursor: SandboxTruthCursor,
        reason: SandboxReason,
    ) -> ApplicationResult<()>;
}

/// Repository for derived inspect/preview/trend state and reports.
pub trait SandboxDerivedRepository {
    /// Loads derived state with optimistic version.
    async fn get_derived_state_with_version(
        &self,
        derived_ref: SandboxOpaqueRef,
    ) -> ApplicationResult<Option<Versioned<DerivedInspectPreviewTrendState>>>;

    /// Lists derived states requiring rebuild.
    async fn list_derived_rebuild_candidates(
        &self,
        page: SandboxRepositoryPage,
    ) -> ApplicationResult<Page<Versioned<DerivedInspectPreviewTrendState>>>;

    /// Saves derived state.
    async fn save_derived_state(
        &self,
        uow: &dyn SandboxUnitOfWork,
        state: DerivedInspectPreviewTrendState,
        expected_version: Option<SandboxRepositoryVersion>,
    ) -> ApplicationResult<SandboxOpaqueRef>;

    /// Saves a reconciliation report.
    async fn save_reconciliation_report(
        &self,
        uow: &dyn SandboxUnitOfWork,
        report: SandboxReconciliationReport,
    ) -> ApplicationResult<SandboxOpaqueRef>;

    /// Loads a reconciliation report by ref.
    async fn get_reconciliation_report(
        &self,
        report_ref: SandboxOpaqueRef,
    ) -> ApplicationResult<Option<SandboxReconciliationReport>>;
}
```

| 函数 | 承接 Step 6 内容 | fake parity / 禁止事项 |
|---|---|---|
| `get_projection` | `SandboxReadProjection`;query view | projection 不成为 truth source;missing 映射 degraded / unavailable。 |
| `list_projections_affected_by_truth` | projection stale 闭环 | affected view 必须来自正式读取面,不得按 ref/string 临时拼接。 |
| `mark_projection_stale` | `ReferenceRefreshMarker`;`SandboxProjectionStatus` | marker cursor 必须来自 UoW,不得用 timestamp / page cursor。 |
| `list_derived_rebuild_candidates` | `DerivedInspectPreviewTrendState`;`DerivedFreshnessStatus` | job 不扫描 body 或 fake map 反推候选。 |
| `save_reconciliation_report` | `SandboxReconciliationReport` | report 不反写 core truth;finding 只保存 refs。 |

### 12.11 Event Relay / Publisher Port

```rust
/// Repository for outbound relay records.
pub trait SandboxEventRelayRepository {
    /// Appends a pending relay record after accepted truth changes.
    async fn append_pending_relay(
        &self,
        uow: &dyn SandboxUnitOfWork,
        relay: SandboxEventRelayRecord,
    ) -> ApplicationResult<SandboxOpaqueRef>;

    /// Lists pending or retryable relay records with versions.
    async fn list_pending_relay_records(
        &self,
        page: SandboxRepositoryPage,
    ) -> ApplicationResult<Page<Versioned<SandboxEventRelayRecord>>>;

    /// Saves updated relay record state after publish attempt.
    async fn save_relay_record(
        &self,
        uow: &dyn SandboxUnitOfWork,
        relay: SandboxEventRelayRecord,
        expected_version: SandboxRepositoryVersion,
    ) -> ApplicationResult<()>;
}

/// Publishes outbound sandbox events.
pub trait SandboxEventPublisherPort {
    /// Publishes one relay record and returns an explicit outcome.
    async fn publish(
        &self,
        relay: SandboxEventRelayRecord,
        trace_context: SandboxTraceContext,
    ) -> ApplicationResult<EventPublisherAdapterOutcome>;
}
```

| 函数 | 承接 Step 6 内容 | fake parity / 禁止事项 |
|---|---|---|
| `append_pending_relay` | `SandboxEventRelayRecord`;`SandboxEventKind` | 只在 accepted truth / maintenance state 已提交路径创建;无 payload source 不创建 outbox。 |
| `list_pending_relay_records` | relay worker / job | 必须返回 `Versioned<T>` 支撑 retry/dead-letter update。 |
| `publish` | `EventPublisherAdapterOutcome` | delivered/retryable/dead-letter/failed 由 outcome enum 返回;publish failure 不回滚 source truth。 |

### 12.12 Idempotency / Stored Result Repository

```rust
/// Repository for idempotency reservation and duplicate replay.
pub trait SandboxIdempotencyRepository {
    /// Reserves an idempotency key for one operation.
    async fn reserve(
        &self,
        uow: &dyn SandboxUnitOfWork,
        ctx: SandboxServiceCallContext,
    ) -> ApplicationResult<SandboxIdempotencyReservation>;

    /// Loads an existing idempotency record.
    async fn get_record(
        &self,
        operation_name: SandboxOperationName,
        idempotency_key: SandboxOpaqueRef,
    ) -> ApplicationResult<Option<SandboxIdempotencyRecord>>;

    /// Marks an idempotency record completed with a stored result ref.
    async fn complete(
        &self,
        uow: &dyn SandboxUnitOfWork,
        idempotency_ref: SandboxOpaqueRef,
        stored_result_ref: SandboxOpaqueRef,
    ) -> ApplicationResult<()>;

    /// Marks an idempotency record failed without producing a replayable result.
    async fn fail(
        &self,
        uow: &dyn SandboxUnitOfWork,
        idempotency_ref: SandboxOpaqueRef,
        reason: SandboxReason,
    ) -> ApplicationResult<()>;
}

/// Repository for replayable public operation results.
pub trait SandboxStoredResultRepository {
    /// Saves a replayable operation result.
    async fn save_result(
        &self,
        uow: &dyn SandboxUnitOfWork,
        result: SandboxStoredOperationResult,
    ) -> ApplicationResult<SandboxOpaqueRef>;

    /// Loads a replayable operation result.
    async fn get_result(
        &self,
        stored_result_ref: SandboxOpaqueRef,
    ) -> ApplicationResult<Option<SandboxStoredOperationResult>>;
}

/// Result of idempotency reservation.
pub enum SandboxIdempotencyReservation {
    /// This request owns the mutation path.
    Reserved(SandboxIdempotencyRecord),
    /// A completed result may be replayed.
    Duplicate(SandboxStoredOperationResult),
    /// The same key was used with a different request digest.
    Conflict(SandboxApplicationError),
}
```

| 函数 | 承接 Step 6 内容 | fake parity / 禁止事项 |
|---|---|---|
| `reserve` | `SandboxServiceCallContext`;`SandboxIdempotencyRecord`;`request_digest` | signature 接收 context,不得让 fake / service 硬编码 channel / operation。 |
| `complete` + `save_result` | `SandboxStoredOperationResult`;`SandboxServiceOutcome` | accepted path 保存完整 replay surface;duplicate 不重算。 |
| `get_result` | duplicate replay | missing stored result 映射 `DuplicateMissingResult`,不得重新执行 mutation。 |

### 12.13 Runtime Builder / Config Adapter Port

```rust
/// Loads validated runtime configuration summaries for sandbox runtime assembly.
pub trait SandboxRuntimeConfigPort {
    /// Loads a validated config summary.
    async fn load_runtime_config_summary(
        &self,
        profile_ref: SandboxOpaqueRef,
    ) -> ApplicationResult<SandboxRuntimeConfigSummary>;

    /// Checks adapter availability for startup and health gates.
    async fn check_adapter_availability(
        &self,
        adapter_kind: SandboxAdapterKind,
    ) -> ApplicationResult<AdapterAvailabilityState>;
}
```

| 函数 | 承接 Step 6 内容 | fake parity / 禁止事项 |
|---|---|---|
| `load_runtime_config_summary` | `SandboxRuntimeConfigSummary`;`RuntimeConfigStatus` | 不输出 raw endpoint / secret / env var;config 不改变 domain invariant。 |
| `check_adapter_availability` | `AdapterAvailabilityState`;`AdapterAvailabilityStatus` | unavailable / disabled 不得被 service 当 allow。 |

---

## 13. `infra` 模块 Adapter / Fake Parity 契约

### 13.1 `infra` port capability / 接缝清单

| capability / 对象能力 | 需要的接缝 | 调用方 | 实现方 | 后续承接 |
|---|---|---|---|---|
| durable / fake truth persistence | `SandboxTruthRepository`;`SandboxUnitOfWorkManager` | `application` service | `crates/infra/src/truth_repositories.rs` | Step 11 persistence |
| projection / derived store | `SandboxProjectionRepository`;`SandboxDerivedRepository` | query / derived / jobs | `crates/infra/src/projection_repositories.rs` | Step 11 persistence;Step 16 tests |
| resolver / policy / backend / handoff / publisher | application ports | `application` service | `crates/infra/src/*_adapters.rs` | Step 14 config |
| runtime assembly | runtime builder | `api/worker/jobs` startup | `crates/infra/src/runtime_builder.rs` | Step 14 / Step 17 |

| 名称 | 类型 | 定义位置 | 作用 | 关键函数 |
|---|---|---|---|---|
| `SandboxRuntimeBuilder` | adapter assembly | `crates/infra/src/runtime_builder.rs` | 组装 config、ports、services 和 entry runtime dependencies | `build_command_service`;`build_worker_runtime`;`build_job_runtime` |
| `SandboxFakeAdapterSet` | fake adapter bundle | `crates/infra/src/runtime_builder.rs` | 测试时提供与 durable port 等价的 fake | `for_contract_tests`;`with_clock`;`with_resolver_outcome` |

```rust
/// Builds sandbox runtime dependencies from validated infra config.
pub trait SandboxRuntimeBuilder {
    /// Builds command and query services for API entry.
    fn build_api_services(&self) -> ApplicationResult<SandboxApiServiceSet>;

    /// Builds worker services and runtime adapters.
    fn build_worker_services(&self) -> ApplicationResult<SandboxWorkerServiceSet>;

    /// Builds job services and runtime adapters.
    fn build_job_services(&self) -> ApplicationResult<SandboxJobServiceSet>;
}
```

### 13.2 Fake / Durable parity table

| Adapter family | Durable / fake 必须等价 | 禁止 fake 私有行为 |
|---|---|---|
| truth repository | expected version conflict、missing、grouped save、UoW commit / rollback、stable ref 保存 | 不得在 fake 中忽略 version 或自动创建 missing truth。 |
| projection repository | affected projection enumeration、stale marker cursor、page ordering、missing degraded | 不得从 query parameter 拼 projection ref。 |
| idempotency / stored result | reserve / duplicate / conflict / complete / get 对称 | 不得 duplicate 时重新执行 service 或返回 placeholder。 |
| resolver | missing/conflict/forbidden body marker、safe summary ref、resolution status | 不得把 external body 存入 fake map 后让 service 读取。 |
| policy adapter | missing/conflicted/stale/unsupported/high-risk marker | 不得默认 allow 或用 error string 表达 fail-closed。 |
| backend adapter | capability summary、establish / launch / inspect / release outcome enum | 不得用 local process / weak backend 伪装 formal success。 |
| handoff / observability / investigation adapter | delivered / retryable / failed / pending outcome,receipt ref,reason | 不得让 handoff failure 回滚 capture truth。 |
| publisher | delivered / retryable / dead-letter / failed outcome,publish attempt update | 不得 publish failure 回滚 source truth。 |
| runtime config | config summary、adapter availability、startup blocked / degraded | 不得通过 fake config 放宽 fail-closed、cleanup guard 或 redline。 |

### 13.3 `infra` 模块停审记录

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 是否重新定义 application port 签名 | 否 | `infra` 只实现 `application` trait。 |
| 是否允许 backend SDK / DB / bus 类型进入 `application/domain/contracts` | 否 | adapter 内部映射为 Step 6 outcome / carrier。 |
| fake parity 是否覆盖 version / outcome / stored result | 是 | Step 16 需补 contract tests。 |
| config 是否改变 business invariant | 否 | exact config key 后续 Step 14 / `04` 闭口。 |

---

## 14. Entry 模块 Adapter 契约

### 14.1 `api` entry adapter

| capability / 对象能力 | 需要的接缝 | 调用方 | 实现方 | 后续承接 |
|---|---|---|---|---|
| sync command mapping | `SandboxApiCommandEnvelope` -> `SandboxServiceCallContext` -> `SandboxCommandService` | API handler | `api` | Step 8 command DTO;Step 9 handler flow |
| sync query mapping | `SandboxApiQueryEnvelope` -> `SandboxServiceCallContext` -> `SandboxQueryService` | API handler | `api` | Step 8 query DTO;Step 9 query flow |
| API error mapping | `SandboxApplicationError` -> `SandboxApiDisposition` | API handler | `api` | Step 12 error mapping |

```rust
/// Adapter surface used by API handlers before calling application services.
pub trait SandboxApiEntryAdapter {
    /// Converts command envelope into application call context.
    fn command_context(
        &self,
        envelope: SandboxApiCommandEnvelope,
    ) -> Result<SandboxServiceCallContext, ApiError>;

    /// Converts query envelope into application call context.
    fn query_context(
        &self,
        envelope: SandboxApiQueryEnvelope,
    ) -> Result<SandboxServiceCallContext, ApiError>;

    /// Maps application outcome to API disposition.
    fn map_outcome(&self, outcome: SandboxServiceOutcome) -> SandboxApiDisposition;
}
```

API 禁止事项:

- 不直接访问 `SandboxTruthRepository`、`SandboxProjectionRepository`、`ContextReferenceResolverPort` 或 backend / publisher adapter。
- 不调用 domain transition。
- 不把 route string 临时解析成业务 state;operation selector 在 Step 8 闭口。

### 14.2 `worker` entry adapter

| capability / 对象能力 | 需要的接缝 | 调用方 | 实现方 | 后续承接 |
|---|---|---|---|---|
| inbound event mapping | event envelope -> `SandboxServiceCallContext` -> `SandboxConsumerService` | worker consumer | `worker` | Step 8 consumer schema |
| fulfillment loop | worker item -> application facade | worker runtime | `worker` | Step 9 fulfillment flow |
| relay loop | relay item -> `SandboxEventRelayRepository` only through `SandboxJobService` / relay service facade | worker runtime | `worker` | Step 9 relay flow |

```rust
/// Adapter surface used by worker consumers and loops.
pub trait SandboxWorkerEntryAdapter {
    /// Builds application call context for one consumed event.
    fn consumer_context(
        &self,
        run_context: SandboxWorkerRunContext,
        source_event_ref: SandboxOpaqueRef,
    ) -> Result<SandboxServiceCallContext, WorkerError>;

    /// Maps application receipt to worker ack decision.
    fn map_receipt(&self, receipt: SandboxConsumerReceipt) -> SandboxWorkerAckDecision;

    /// Maps loop outcome into worker result.
    fn map_loop_result(&self, outcome: SandboxServiceOutcome) -> SandboxFulfillmentLoopResult;
}
```

Worker 禁止事项:

- 不修核心 truth,不直接 save repository。
- 不与 `jobs` 互相调用。
- 不从 relay / adapter state 反推 success / failed counters;必须使用 application facade result。

### 14.3 `jobs` entry adapter

| capability / 对象能力 | 需要的接缝 | 调用方 | 实现方 | 后续承接 |
|---|---|---|---|---|
| one-shot job context | job input -> `SandboxJobRunContext` -> `SandboxJobService` | job runner | `jobs` | Step 8 job I/O |
| report accumulation | service result -> `SandboxJobReportAccumulator` -> `SandboxJobExitDisposition` | job runner | `jobs` | Step 16 job tests |
| cursor / batch | job input / report cursor | job runner | `jobs` via application service | Step 13 idempotency |

```rust
/// Adapter surface used by one-shot job runners.
pub trait SandboxJobEntryAdapter {
    /// Builds application call context for a job run.
    fn job_context(
        &self,
        run_context: SandboxJobRunContext,
    ) -> Result<SandboxServiceCallContext, JobsError>;

    /// Converts application job outcome into report accumulator updates.
    fn record_job_outcome(
        &self,
        accumulator: &mut SandboxJobReportAccumulator,
        outcome: SandboxServiceOutcome,
    ) -> Result<(), JobsError>;

    /// Finishes one job run.
    fn finish(
        &self,
        accumulator: SandboxJobReportAccumulator,
    ) -> SandboxJobExitDisposition;
}
```

Jobs 禁止事项:

- 不作为业务 command。
- 不绕过 cleanup guard、redline containment 或 handoff ownership guard。
- 不扫描 repository 或 adapter 私有 state 生成 report;report refs 必须来自 application service result。

---

## 15. Step 6 承接清单闭口表

| Step 6 契约组 | Step 7 闭口位置 | 闭口结论 | 后续 Step |
|---|---|---|---|
| Context / Reference Resolver Port | §12.3 | 已定义 `ContextReferenceResolverPort`、resolver outcome、missing/conflict/body marker。 | Step 8 DTO;Step 9 intake flow |
| Sandbox Truth Repository | §12.4 | 已定义 truth load/save/grouped save、`Versioned<T>`、UoW、expected version。 | Step 9 flow;Step 11 persistence |
| Audit / Reference / Snapshot / Maintenance Repositories | §12.5 | 已定义 audit append/list、reference state save/list、truth snapshot、maintenance selection 读取面。 | Step 8 query/job;Step 9 maintenance flow;Step 11 persistence |
| Backend Capability / Isolation Backend Port | §12.6 | 已定义 capability、establish、launch、inspect、release 和 outcome。 | Step 9 boundary/run;Step 14 config |
| Policy Summary Port | §12.7 | 已定义 policy applicability 与 high-risk marker 读取面。 | Step 9 policy;Step 12 fail-closed |
| Capture / Material / Observability / Handoff Ports | §12.8 | 已定义 capture collection、material handoff、observability handoff。 | Step 9 capture/handoff;Step 12 recovery |
| Cleanup / Investigation / Redline Ports | §12.9 | 已定义 lifecycle inspect 与 investigation handoff。 | Step 9 cleanup/redline;Step 10 state |
| Projection / Derived Repositories | §12.10 | 已定义 projection load/list affected/stale/save、derived rebuild/report store。 | Step 8 query;Step 11 persistence |
| Event Relay / Publisher Port | §12.11 | 已定义 relay append/list/save 与 publisher outcome。 | Step 8 event;Step 9 relay |
| Idempotency / Stored Result Repository | §12.12 | 已定义 reserve/get/complete/fail 与 result save/get。 | Step 13 idempotency;Step 8 receipt |
| Runtime Builder / Config Adapter | §12.13;§13 | 已定义 config summary / adapter availability port 和 runtime builder。 | Step 14 config;Step 17 handoff |
| API / Worker / Job Entry Adapter | §14 | 已定义 entry adapter、context mapping、receipt/report mapping、禁止直接 repository。 | Step 8 protocol;Step 9 entry flow |

---

## 16. 对象能力到 port 映射表

| Step 6 对象 / 对象组 | 所需 port / trait | 函数入口 | 下游可反查 |
|---|---|---|---|
| `ControlledExecutionContext`;`ExecutionContextResolution`;`ExecutionEnvironmentIdentity` | `ContextReferenceResolverPort`;`SandboxTruthRepository`;`SandboxIdGeneratorPort` | `resolve_context_refs`;`save_context`;`save_environment_identity` | Step 8 `OpenControlledExecutionContext`;Step 9 intake flow |
| `BoundaryRequirementSet`;`BackendCapabilitySummary`;`CoherentBoundary` | `BackendCapabilityPort`;`SandboxTruthRepository` | `load_capability_summary`;`save_boundary_group` | Step 9 boundary flow |
| `IsolationEnvironmentHandle`;`ControlledExecutionRun` | `IsolationBackendPort`;`SandboxTruthRepository` | `establish_environment`;`launch_run`;`save_run` | Step 9 run flow;Step 10 lifecycle |
| `PolicyApplicabilitySnapshot`;`PolicyExecutionDecision`;`HighRiskActionDecision` | `PolicySummaryPort`;`SandboxTruthRepository` | `load_policy_applicability`;`get_boundary_requirement`;`save_policy_group` | Step 9 policy flow |
| `CaptureFact`;`CapturedMaterialRef`;`HandoffFact` | `ExecutionCapturePort`;`MaterialHandoffPort`;`SandboxTruthRepository` | `collect_capture`;`handoff_material`;`save_capture_handoff_group` | Step 9 capture/handoff |
| `ObservabilityMaterialRef` | `ObservabilityMaterialPort` | `handoff_observability_material` | Step 15 observability;Step 8 events |
| `FailureClassification`;`ControlFact`;`LeaseRecord`;`CleanupGuard`;`RedlineContainment` | `SandboxTruthRepository`;`BackendLifecycleInspectionPort`;`InvestigationHandoffPort` | `save_safety_group`;`inspect_handle`;`handoff_investigation` | Step 9 safety flow;Step 10 state |
| `SandboxReadProjection` | `SandboxProjectionRepository` | `get_projection`;`save_projection`;`list_projections_affected_by_truth`;`mark_projection_stale` | Step 8 query;Step 11 persistence |
| `DerivedInspectPreviewTrendState`;`SandboxReconciliationReport` | `SandboxDerivedRepository` | `list_derived_rebuild_candidates`;`save_derived_state`;`save_reconciliation_report` | Step 8 job/query;Step 16 tests |
| `SandboxEventRelayRecord` | `SandboxEventRelayRepository`;`SandboxEventPublisherPort` | `append_pending_relay`;`list_pending_relay_records`;`publish` | Step 8 outbound event;Step 9 relay |
| `SandboxIdempotencyRecord`;`SandboxStoredOperationResult` | `SandboxIdempotencyRepository`;`SandboxStoredResultRepository` | `reserve`;`complete`;`save_result`;`get_result` | Step 13 idempotency |
| `SandboxRuntimeConfigSummary`;`AdapterAvailabilityState` | `SandboxRuntimeConfigPort`;`SandboxRuntimeBuilder` | `load_runtime_config_summary`;`check_adapter_availability`;`build_*_services` | Step 14 config |
| `SandboxApiCommandEnvelope`;`SandboxConsumerReceipt`;`SandboxJobReportAccumulator` | entry adapters + application service facade | `command_context`;`map_receipt`;`record_job_outcome` | Step 8 / Step 9 entry flow |

---

## 17. Callable Surface 闭环审计

| 审计项 | 结论 | 缺口 / 修正 |
|---|---|---|
| service callable surface 是否覆盖概要 Command / Query / Consumer / Job | 覆盖。`SandboxCommandService` 覆盖 10 个 command;`SandboxQueryService` 覆盖 status / projection / trace 主查询;`SandboxConsumerService` 和 `SandboxJobService` 覆盖 consumer / job 家族。 | Step 8 需拆成完整 DTO 和具体 query / job request。 |
| repository 读取面是否覆盖 mutation expected version | 覆盖。truth / derived / relay 使用 `Versioned<T>`。 | Step 11 持久化需映射具体 table / row version。 |
| projection stale 是否有 affected view 读取面 | 覆盖。`list_projections_affected_by_truth` 是唯一来源。 | Step 8 public projection identity 需映射。 |
| stored result save/get 是否对称 | 覆盖。`save_result` / `get_result` 与 idempotency complete 配对。 | Step 8 需定义 public replay surface。 |
| adapter failure 是否有正式 outcome enum | 覆盖。backend / handoff / publisher 使用 Step 6 outcome object。 | Step 12 需定义 error mapping。 |
| UoW cursor 来源是否唯一 | 覆盖。truth / reference marker cursor 只能由 UoW 分配。 | Step 11 需定义 durable sequence。 |
| fake parity 是否可测试 | 覆盖。§13.2 明确 fake / durable parity。 | Step 16 需定义 port contract tests。 |
| entry 是否绕过 application | 未绕过。§14 明确 entry 只调用 facade。 | Step 9 handler flow 需逐接口检查。 |

---

## 18. 模块内 trait / port 停审记录

| 模块 | 停审项 | 结论 | 缺口 / 修正 |
|---|---|---|---|
| `contracts` | 是否定义 port | 不定义。只提供 public carrier。 | none |
| `domain` | 是否访问 repository / adapter | 不访问。只接收 application 已加载或映射完成的对象。 | none |
| `application` | trait owner、函数签名、version / UoW、stored result | 通过。核心 port 已闭口。 | Step 9 需逐 flow 绑定具体函数调用顺序。 |
| `infra` | adapter implementation / fake parity | 通过。只实现 application trait,不改变业务 invariant。 | Step 11 / 14 需补 persistence/config 细节。 |
| `api` | command / query entry 限制 | 通过。只做 mapping 和 facade 调用。 | Step 8 route / DTO 后续闭口。 |
| `worker` | consumer / fulfillment / relay 限制 | 通过。不修 core truth,不与 jobs 互调。 | Step 9 consumer flow 后续闭口。 |
| `jobs` | one-shot maintenance runner 限制 | 通过。不作为业务 command,report 来源来自 application result。 | Step 8 job I/O 和 Step 16 tests 后续闭口。 |

---

## 19. 跨模块接缝闭环审计表

| 审计项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 重复 port | 未发现。resolver、policy、backend、handoff、publisher、repository 均由 `application` 唯一定义。 | none |
| 反向依赖 | 未发现。`application` 不依赖 `infra`;`domain/contracts` 不依赖 port。 | none |
| 读取面缺失 | 未发现当前阻塞。mutation、query、projection、relay、idempotency 均有读取面。 | Step 8 / 9 若新增协议字段或 flow branch,必须回到本 Step 补 port。 |
| version 来源缺失 | 未发现。expected version 只来自 `Versioned<T>`。 | Step 11 durable schema 需定义 row version。 |
| UoW / cursor 来源缺失 | 未发现。UoW 是唯一 cursor source。 | Step 11 需定义 transaction sequence。 |
| fake parity 缺失 | 未发现。adapter family 已列 parity。 | Step 16 补测试切口。 |
| public page helper schema | application-local `Page<T>` 已定义,但 public page DTO 留 Step 8。 | Step 8 必须定义 public page / cursor 映射,不能直接暴露 helper。 |
| downstream protocol / flow 承接 | 可承接。Step 8 / 9 / 10 都可回指本文件 port。 | Step 8 开工时先读本文件 §12~§17。 |

---

## 20. 回填草稿

> 校准来源:
> - `design-calibration/03_ddd_step_07_trait_port_adapter_contracts.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“结构化中间产物”“对象能力到 port 映射表”“Callable Surface 闭环审计”“跨模块接缝闭环审计表”和“待确认事项”小节,了解 Trait / Port / Adapter 契约如何从 Step 6 对象能力收敛而来。

### 5.x.5 Trait / Port / Adapter 契约

`L4-sandbox` 的 port owner 固定为 `application`。`contracts` 只定义 public carrier,`domain` 只定义 truth object / state / guard,`infra` 只实现 `application` port,`api/worker/jobs` 只作为 entry / runner 调用 application facade。

`application` 必须定义以下 port / service family:

| 契约族 | 主要 trait |
|---|---|
| service facade | `SandboxCommandService`;`SandboxQueryService`;`SandboxConsumerService`;`SandboxJobService` |
| transaction / support | `SandboxUnitOfWork`;`SandboxUnitOfWorkManager`;`SandboxClockPort`;`SandboxIdGeneratorPort` |
| resolver / policy / backend | `ContextReferenceResolverPort`;`PolicySummaryPort`;`BackendCapabilityPort`;`IsolationBackendPort` |
| truth / projection / derived | `SandboxTruthRepository`;`SandboxProjectionRepository`;`SandboxDerivedRepository` |
| capture / handoff / safety | `ExecutionCapturePort`;`MaterialHandoffPort`;`ObservabilityMaterialPort`;`BackendLifecycleInspectionPort`;`InvestigationHandoffPort` |
| relay / idempotency / config | `SandboxEventRelayRepository`;`SandboxEventPublisherPort`;`SandboxIdempotencyRepository`;`SandboxStoredResultRepository`;`SandboxRuntimeConfigPort` |

All mutation paths must use `SandboxUnitOfWork`; all optimistic updates must read `Versioned<T>` first; duplicate replay must use stored result save/get; adapter failures must return formal outcome objects; publish and handoff failures must not roll back source truth. `api`, `worker`, and `jobs` must not directly access repository, resolver, backend, handoff, publisher, projection, idempotency, or stored-result ports.

正式装配时,每个模块小节应摘录本 Step 的对应 trait 表和关键 Rust 契约片段;不要把本文件的过程性批次表、SOP 问题回答和停审记录直接搬入正式正文。

---

## 21. 待确认事项

| 待确认 | 当前处理 | 是否阻塞 Step 8 |
|---|---|---|
| 完整 Command / Query / Consumer / Event / Job DTO 字段 | 留给 Step 8。 | 否,本步提供 port 输入输出承接。 |
| HTTP / RPC path、event topic、schema version、public page DTO | 留给 Step 8。 | 否。 |
| exact transaction save order、state transition order | 留给 Step 9 / Step 10 / Step 11。 | 否。 |
| durable schema、row version、index、migration | 留给 Step 11。 | 否。 |
| config key、profile、env var、secret、backend product | 留给 Step 14 和正式 `04-配置设计.md`。 | 否。 |
| port contract tests 和 fake parity tests | 留给 Step 16 和正式 `05-测试方案.md`。 | 否。 |
| 正式 `07-实施计划.md` 与 implementation ledger | 后续进入 07 时创建。 | 否。 |

---

## 22. 自检

| 检查项 | 结果 |
|---|---|
| 是否逐模块定义 port / adapter | 通过。见 §10~§14。 |
| 是否先写 port capability / 接缝清单 | 通过。每个模块均有 capability / 接缝表或无 port 结论。 |
| trait 函数是否有参数、返回和错误类型 | 通过。Rust 片段使用 `ApplicationResult<T>` 或 entry error。 |
| repository 读取面 / 写入面是否闭合 | 通过。`Versioned<T>`、expected version、UoW、append / grouped save 均定义。 |
| fake parity 是否闭合 | 通过。见 §13.2。 |
| 是否把 tools semantic execution、runtime agent loop、member lifecycle、artifact truth、observability store、policy truth 混入 sandbox | 否。所有 external truth 只通过 body-free ref / summary / outcome。 |
| 是否修改正式 `03-详细设计.md` | 否。正式文档仍只在 Step 19 装配。 |
| 是否创建目标实现仓或代码 | 否。 |
| 是否伪造 commit、run_id、evidence、验收签署或测试结果 | 否。 |
| 是否需要提交 commit | 否。用户未要求提交。 |

---

## 23. 进入下一步条件

```text
Step 7 已完成并等待用户审查。
用户确认后,下一步读取:
- `standards/document/详细设计讨论流程_SOP.md` Step 8
- `standards/document/详细设计书写规范.md` §5.7 API / Command / Query / Event / Job 协议契约
- `standards/document/设计真相源闭环与可落码性标准.md` public protocol / DTO / receipt / page helper 相关规则
- `projects/L4-sandbox/design-calibration/03_ddd_step_07_trait_port_adapter_contracts.md`
- `projects/L4-sandbox/design-calibration/02_hld_step_07_api_interface_skeleton.md`

然后才能创建 `03_ddd_step_08_protocol_contracts.md`。
```

---

## 24. 实施计划回查修复记录

| 回查 ID | 发现位置 | 原冲突 | 修复结果 | fake parity约束 |
|---|---|---|---|---|
| `SBX-IMP-BOUNDARY-POLICY-CYCLE-001` | `07` Step 6 callable surface复核 | `IsolationBackendPort::establish_environment(...)` 原接收 `PolicyExecutionDecision`,要求PH-05读取PH-06结果。 | port改为接收accepted context、matching identity、requirements和fresh capability;policy只在后序launch guard参与。 | fake与real adapter均不得增加policy参数、隐式allow或跨generation建立handle。 |

---

## 25. Step 7 DesignReopen current authority override

原§1~§24保留为historical reviewed material。其trait名称和签名只能作为候选与冲突证据；出现
`SandboxOpaqueRef`、`SandboxRepositoryVersion`、16个未定义`*Input`、3/2/1压缩facade、generic entry
mapper或族级fake parity时，不得被实现或后续Step视为current contract。

Step 7 current authority按以下顺序建立：

```text
7R-M0 regression control
  -> 7R-01 service facades / exact inputs and outputs
  -> 7R-02 repositories / UoW / indexes
  -> 7R-03 resolvers / external ports / outcomes
  -> 7R-04 read maintenance / runtime assembly
  -> 7R-05 infra adapters / fake parity
  -> 7R-06 entry dispatch adapters
  -> 7R-07 callable surface audit
  -> 本文件物理末尾master assembly
```

当前只有`7R-M0`控制产物存在；`7R-01~07`均不得被推定为完成。

```text
current_document = 03-详细设计.md
current_step = Step 7 regression / 7R-M0
current_batch = 7R-M0 regression control completed_wait_user_review
step_status = reopened_control_ready
batch_status = completed_wait_user_review
gate_status = completed_wait_user_review
next_allowed_action = wait_user_review_before_7R_01_service_facades
upstream_step_6 = review_confirmed_consumed_by_7R_M0
historical_step_7 = reviewed_invalidated_by_design_reopen
handoff_groups = 15/15_allocated
entry_callable_target = 42/42
outbound_relay_target = 13/13
step_7_internal_blockers = 6/6_open_with_owner
new_l1_l2_blocker = 0
formal_03_status = historical_reviewed_invalidated_by_design_reopen
implementation = CB-SBX-01A blocked / wait_design
real_test_execution = not_started
real_evidence_created = no
commit_required = no
```

用户确认`7R-M0`前不得创建`7R-01`分件，不得修改原trait正文，不得进入Step 8或实现仓。
