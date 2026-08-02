# Step 7 Repository / UoW / Index 一致性契约回归产物

> 对应 SOP: `standards/document/详细设计讨论流程_SOP.md` Step 7
> 创建日期: 2026-07-25
> 状态: `7r_03b_completed_wait_user_review`
> 所属流程: `03_ddd_calibration_flow.md`
> 上游门禁: `7R-02D review_confirmed`；Step 6 `S7H-06~10`；`S7-03A review_confirmed`
> 当前批次: `S7-03B` establish/launch/inspect/release ports
> 当前边界: `S7-03B`只补充lifecycle external call的reservation/UoW ordering、fresh read、CAS、launch failure identity复用与unknown/duplicate约束；不新增repository root、method或status。当前停在用户复核前，不得进入`S7-03C`、Step 8或implementation。

---

## 1. 开工确认与恢复点

| 检查项 | 当前结论 |
|---|---|
| 用户门禁 | 用户本次“continue”已消费`S7-G01`，只授权进入`7R-02A`；不授权Step 8或implementation。 |
| 当前文档 / Step | `03-详细设计.md` / Step 7 regression / `7R-02A`。 |
| 上游 callable | `7R-01A~D`已闭合42/42 application callable；本批不改其input、output、selector或operation mapping。 |
| Step 6 authority | shared types的core/shared registry、五份canonical object source和`6R-07`的`S7H-06~10`。 |
| historical Step 7 | 只用于识别旧`SandboxRepositoryVersion`、opaque ID和宽泛UoW缺口；不得继承签名。 |
| implementation | `CB-SBX-01A blocked / wait_design`；没有实现仓、实现commit、run、测试或evidence事实。 |
| 本批完成条件 | UoW生命周期、可信时间、identity分类、core `Version`/CAS、外部await、rollback/commit-unknown和replay交接均可编码。 |

```text
current_document = 03-详细设计.md
current_step = Step 7 regression / 7R-02A
current_batch = UoW / trusted clock / typed ID / core Version
batch_status = completed_ready_for_next_internal_batch
gate_status = internal_batch_completed
next_allowed_action = start_7R_02B
formal_03_status = historical_reviewed_invalidated_by_design_reopen
implementation = CB-SBX-01A blocked / wait_design
real_test_execution = not_started
real_evidence_created = no
commit_required = no
```

---

## Historical-Position Draft (superseded): `S7-03B` launch reservation / UoW ordering

本节曾被插入 repository 产物前部，只修正 `MUT-G04` 与
`start_controlled_execution_run` 对 `S7-02D` reservation-only 规则的消费顺序。§19.2 中
`C(run Preparing) + I-C(Reserved)` 以及 §20.1 中同组表达现记为 `historical_conflicting_material`；它们不得被实现为
同一 UoW。该位置现仅保留为 `historical_material`；current authority 以本文物理 EOF 的 `S7-03B` override 为准。
idempotency repository method、business repository method、root、index和 `Version` 数量均不改变。

### Current `MUT-G04 -> MUT-G05` contract

| phase | exact repository / UoW slice | commit gate | forbidden |
|---|---|---|---|
| reservation prefix | reservation-only UoW调用 `claim_idempotency_reservation`；`FreshReserved`只表示stage成功 | 只有 `Confirmed` 形成 committed `FreshReservationOwnership`；`Existing/NotCommitted/StatusUnknown`均不进入business body | business owner read、run/capture/failure identity allocation、`create_run`、external launch |
| `MUT-G04` run preparation | 在已提交reservation ownership下，fresh-read exact context/identity/boundary/handle/lease/policy；分配run/capture/launch-failure三ref；`C(run Preparing)`并stage capture、audit、launch recovery relation | preparation UoW `Confirmed` 后run才是可inspect recovery point；本UoW不再次 `I-C` | 与reservation同组、用reservation candidate作business `Version`、未提交run就authorize/launch |
| pre-call revalidation | committed snapshot exact-read `Preparing` run、prebound failure ref、active handle/lease/policy及reservation relation | `authorize_launch`通过后才冻结port request；write set为0 | 复用prepare前owner/age/permit、latest scan、替换handle/ref |
| external call | UoW和transaction handle均已释放；调用一次exact launch method | finite result或same-key inspection result必须与原correlation一致 | repository callback、跨await持有UoW、盲目第二次launch |
| `MUT-G05` finalization | fresh-read run + `Version`及完整recovery group；成功 `S(run@V)`；terminal failure `C(failure)` + `S(run@V)`；stageaudit、typed stored surface、carrier和 `I-S` completion | whole group `Confirmed` 后才能返回fresh outcome | 第二failure ref、`PendingInput`占位、classification `mark_terminal`、partial stored linkage |

`BackendLaunchFailed` 的 `C(failure)` 使用 `Preparing` run内嵌的同一个
`FailureClassificationRef`。application依次执行 typed observation、marker、marker set、
`FailureClassification::classify`、`require_run_failure_basis`、`ControlledExecutionRun::mark_failed`，然后在同一
`MUT-G05` UoW创建classification并保存run。classification保持 `Classified`；run进入 `Failed`。这里不调用
`FailureClassification::mark_terminal`，因为Step 6已允许 `Classified` 生成run failure basis。

```text
current_document = 03-详细设计.md
current_step = Step 7 regression / 7R-03B
consistency_overlay = launch reservation / MUT-G04 / MUT-G05 ordering
reservation_only_commit_before_business = required
run_preparation_commit = separate_required
external_await_with_uow = forbidden
launch_failure_identity = prebound_same_ref
new_repository_root = 0
new_repository_method = 0
new_status = 0
new_l1_l2_blocker = 0
formal_03_modified_by_overlay = no
implementation = CB-SBX-01A blocked / wait_design
commit_required = no
```

---

## Historical-Position Draft: `S7-02D-B6` repository closure

本节因 patch 锚点命中文件前部而保留为 non-authoritative draft。只有物理 EOF 的 B6 recovery override 可覆盖
B5 selector/index overlay；本节不决定恢复点。

| repository closure | current result |
|---|---|
| idempotency exact methods | `5/5` (`get`, `find binding`, `claim`, `save completion`, `save failure`) |
| stored carrier methods | `2/2` (`get`, `create`) |
| typed surface methods | `6/6` (`Command/Consumer/Job save/get`) |
| maintenance reader methods | `9/9` exact read-only methods；generic reader `0` |
| UoW / Version | committed read snapshot与write UoW分离；CAS使用core `Version`；inspection write `0` |
| query / reconciliation | Query maintenance/write `0/13`；reconciliation paged reader `0/1` |
| forbidden positive path | old wrapper、opaque current ref、latest/all scan、offset pagination、decode/restart consumer `0` |
| `REF-001` | `resolved_in_7r_02d`；无新的 L1/L2 upstream blocker |

```text
current_document = 03-详细设计.md
current_step = Step 7 regression / 7R-02D completed_wait_user_review
current_batch = S7-02D idempotency / stored result / bounded index
batch_status = completed_wait_user_review
gate_status = user_review_pending
completed_internal_batches = S7-02D-B1,S7-02D-B2,S7-02D-B3,S7-02D-B4,S7-02D-B5,S7-02D-B6
current_internal_batch = none
idempotency_repository_method = 5/5
carrier_method = 2/2
typed_surface_method = 6/6
maintenance_reader = 9/9
generic_inspector_method_added = 0
new_repository_method = 0
query_write = 0/13
S7-02D-INT-01 = closed
S7-02D-INT-02 = closed
S7-02D-INT-03 = closed
S7-02D-INT-04 = closed
S7-02D-INT-05 = closed
ref_blocker = resolved_in_7r_02d
next_gate = S7-G02 user review of 7R-02A~D
next_allowed_action = wait_user_review_before_s7_g02
step_8 = blocked_by_step_7_regression
formal_03_07 = historical_reviewed_revalidation_pending
implementation = CB-SBX-01A blocked / wait_design
real_test_execution = not_started
real_evidence_created = no
commit_required = no
```

## EOF Current Recovery Override: `S7-02D-B3-1` surface schema ready

本节位于物理EOF并覆盖本文所有前置repository overlay。三类surface schema已就绪，save/get method仍待B3-2。

```text
current_document = 03-详细设计.md
current_step = Step 7 regression / 7R-02D in_progress
current_batch = idempotency / stored result / bounded selector repositories
batch_status = in_progress
gate_status = content_in_progress
completed_internal_batches = S7-02D-B1,S7-02D-B2
completed_internal_sub_batch = S7-02D-B3-1
current_internal_batch = S7-02D-B3
surface_schema = CommandResult+ConsumerReceipt+JobReport
surface_store_methods = deferred_to_S7_02D_B3_2
next_allowed_action = write_s7_02d_b3_batch_2
query_write = 0/13
ref_blocker = in_progress_wait_s7_02d
new_l1_l2_blocker = 0
implementation = CB-SBX-01A blocked / wait_design
commit_required = no
```

---

## EOF Current Overlay: `S7-02D-B3-1` typed surface schema handoff

repository current authority继续来自`03_ddd_step_07_idempotency_stored_index_repositories.md`。B3-1已给出三类完整
application surface与loaded union，但尚未定义surface store repository method，因此本文件不得提前宣称save/get symmetry。

```text
current_document = 03-详细设计.md
current_step = Step 7 regression / 7R-02D in_progress
current_batch = idempotency / stored result / bounded selector repositories
batch_status = in_progress
gate_status = content_in_progress
completed_internal_batches = S7-02D-B1,S7-02D-B2
completed_internal_sub_batch = S7-02D-B3-1 owner/schema/factory/accessor
current_internal_batch = S7-02D-B3
surface_schema = CommandResult+ConsumerReceipt+JobReport
job_report_payload = Maintenance|Reconciliation
surface_store_methods = deferred_to_S7_02D_B3_2
next_allowed_action = write_s7_02d_b3_batch_2
query_write = 0/13
ref_blocker = in_progress_wait_s7_02d
new_l1_l2_blocker = 0
implementation = CB-SBX-01A blocked / wait_design
commit_required = no
```

---

## Historical-Position Draft A: `S7-02D` activation (non-authoritative)

> 本节曾被错误插入文件前部，只保留为恢复轨迹，不是 current authority。
> 当前 repository authority来自物理 EOF overlay和
> `03_ddd_step_07_idempotency_stored_index_repositories.md`；不得单独消费本节状态。

### 27.1 本批输入与禁止回退

| input | current use |
|---|---|
| `SandboxIdempotencyRecord` / `SandboxIdempotencyObservation` | 固定 persisted lifecycle与application observation的分离；不增加 `Duplicate` / `Conflict` persisted status。 |
| `SandboxStoredOperationResult` / `SandboxStoredResultSurfaceRef` | 固定 typed surface relation；不保存 DTO body，不持久化 `Unavailable`。 |
| `SandboxServiceCallContext` | operation/channel在入口校验；persisted unique identity不包含 channel。 |
| `SandboxRepositoryCursor` | 仅 application-local bounded read helper；不替代 `PageToken`、truth/reference cursor或 `Version`。 |
| `S7-02C` repositories | source、audit、relay的已有 UoW/Version/unknown规则必须保持；stored relation不得绕过。 |

本批不得复活历史 `SandboxOpaqueRef`、generic `save_result/get_result`、`upsert`、`find_latest_result`、全表 scan 或
“duplicate缺结果则重跑”。任何与 current Step 6 schema冲突的旧正式文档、README或历史Step 7段落只记录为
`historical_material`，不作为实现输入。

### 27.2 Current batch contract

```text
current_document = 03-详细设计.md
current_step = Step 7 regression / 7R-02D in_progress
current_batch = idempotency / stored result / bounded index repositories
batch_status = in_progress
gate_status = content_in_progress
repository_traits_in_scope = idempotency + stored_result + bounded selectors
repository_methods_in_scope = reserve/get/create/save/complete/fail exact set, pending audit
unique_identity = operation_name + idempotency_key + request_digest
channel_in_unique_identity = no
stored_result_body = forbidden
query_write = 0/13
next_allowed_action = write_s7_02d_batch_1
```

---

## Historical-Position Draft B: `S7-02D` activation (non-authoritative)

> 本节是重复的前部 activation 草稿，只保留为 historical-position material，不是 current authority。
> 当前恢复状态只读取物理 EOF overlay和新的 `S7-02D` 中间产物。

### 27.1 本批输入与禁止回退

| input | current use |
|---|---|
| `SandboxIdempotencyRecord` / `SandboxIdempotencyObservation` | 固定 persisted lifecycle与application observation的分离；不增加 `Duplicate` / `Conflict` persisted status。 |
| `SandboxStoredOperationResult` / `SandboxStoredResultSurfaceRef` | 固定 typed surface relation；不保存 DTO body，不持久化 `Unavailable`。 |
| `SandboxServiceCallContext` | operation/channel在入口校验；persisted unique identity不包含 channel。 |
| `SandboxRepositoryCursor` | 仅 application-local bounded read helper；不替代 `PageToken`、truth/reference cursor或 `Version`。 |
| `S7-02C` repositories | source、audit、relay的已有 UoW/Version/unknown规则必须保持；stored relation不得绕过。 |

本批不得复活历史 `SandboxOpaqueRef`、generic `save_result/get_result`、`upsert`、`find_latest_result`、全表 scan 或
“duplicate缺结果则重跑”。任何与 current Step 6 schema冲突的旧正式文档、README或历史Step 7段落只记录为
`historical_material`，不作为实现输入。

### 27.2 Current batch contract

```text
current_document = 03-详细设计.md
current_step = Step 7 regression / 7R-02D in_progress
current_batch = idempotency / stored result / bounded index repositories
batch_status = in_progress
gate_status = content_in_progress
repository_traits_in_scope = idempotency + stored_result + bounded selectors
repository_methods_in_scope = reserve/get/create/save/complete/fail exact set, pending audit
unique_identity = operation_name + idempotency_key + request_digest
channel_in_unique_identity = no
stored_result_body = forbidden
query_write = 0/13
next_allowed_action = write_s7_02d_batch_1
```

---

---

## 1A. Mutable repository shared failure contract

19个trait各自暴露named error enum；实现使用同一私有macro生成，避免泛化公开repository key。macro本身
不得`pub`导出，调用方只能看到下列19个具体error type。

```rust
/// 生成一个只服务单一mutable root key的application repository error闭集。
macro_rules! define_mutable_repository_error {
    ($error:ident, $key:ty, $doc:literal) => {
        #[doc = $doc]
        #[derive(Clone, Debug, Eq, PartialEq)]
        pub enum $error {
            /// exact key在当前committed snapshot中不存在。
            NotFound {
                /// 未找到的typed repository key。
                key: $key,
            },
            /// explicit create发现exact key已经存在。
            AlreadyExists {
                /// 已存在的typed repository key。
                key: $key,
            },
            /// save使用的core Version不再匹配当前committed generation。
            VersionConflict {
                /// CAS冲突的typed repository key。
                key: $key,
            },
            /// repository当前无法完成exact operation；不表示对象不存在。
            Unavailable {
                /// 失败操作对应的typed repository key。
                key: $key,
                /// 已脱敏且不携带driver信息的安全理由。
                reason: SandboxReason,
            },
            /// durable row、typed key或完整对象关系违反current schema不变量。
            IntegrityViolation {
                /// 完整性失败对应的typed repository key。
                key: $key,
                /// 已脱敏且不包含raw row/body的安全理由。
                reason: SandboxReason,
            },
        }
    };
}

define_mutable_repository_error!(
    ControlledExecutionContextRepositoryError,
    ControlledExecutionContextRef,
    "ControlledExecutionContext exact repository failure。"
);
define_mutable_repository_error!(
    ExecutionEnvironmentIdentityRepositoryError,
    ExecutionEnvironmentIdentityRef,
    "ExecutionEnvironmentIdentity exact repository failure。"
);
define_mutable_repository_error!(
    ReferenceResolutionStateRepositoryError,
    ReferenceResolutionStateRef,
    "ReferenceResolutionState exact repository failure。"
);
define_mutable_repository_error!(
    CoherentBoundaryRepositoryError,
    CoherentBoundaryRef,
    "CoherentBoundary exact repository failure。"
);
define_mutable_repository_error!(
    IsolationEnvironmentHandleRepositoryError,
    IsolationEnvironmentHandleRef,
    "IsolationEnvironmentHandle exact repository failure。"
);
define_mutable_repository_error!(
    ControlledExecutionRunRepositoryError,
    ControlledExecutionRunRef,
    "ControlledExecutionRun exact repository failure。"
);
define_mutable_repository_error!(
    CapturedMaterialRepositoryError,
    CapturedMaterialRepositoryKey,
    "CapturedMaterialRef exact composite-key repository failure。"
);
define_mutable_repository_error!(
    ObservabilityMaterialRepositoryError,
    ObservabilityMaterialRef,
    "ObservabilityMaterial exact repository failure。"
);
define_mutable_repository_error!(
    HandoffFactRepositoryError,
    HandoffFactRef,
    "HandoffFact aggregate exact repository failure。"
);
define_mutable_repository_error!(
    FailureClassificationRepositoryError,
    FailureClassificationRef,
    "FailureClassification exact repository failure。"
);
define_mutable_repository_error!(
    ControlFactRepositoryError,
    ControlFactRef,
    "ControlFact exact repository failure。"
);
define_mutable_repository_error!(
    LeaseRecordRepositoryError,
    LeaseRecordRef,
    "LeaseRecord exact repository failure。"
);
define_mutable_repository_error!(
    OrphanRecoveryRecordRepositoryError,
    OrphanRecoveryRecordRef,
    "OrphanRecoveryRecord exact repository failure。"
);
define_mutable_repository_error!(
    CleanupGuardRepositoryError,
    CleanupGuardRef,
    "CleanupGuard exact repository failure。"
);
define_mutable_repository_error!(
    RedlineContainmentRepositoryError,
    RedlineContainmentRef,
    "RedlineContainment exact repository failure。"
);
define_mutable_repository_error!(
    SandboxReadProjectionRepositoryError,
    SandboxReadProjectionRef,
    "SandboxReadProjection exact repository failure。"
);
define_mutable_repository_error!(
    DerivedInspectPreviewTrendStateRepositoryError,
    DerivedInspectPreviewTrendStateRef,
    "DerivedInspectPreviewTrendState exact repository failure。"
);
define_mutable_repository_error!(
    SandboxEventRelayRecordRepositoryError,
    SandboxEventRelayRecordRef,
    "SandboxEventRelayRecord exact root repository failure。"
);
define_mutable_repository_error!(
    SandboxIdempotencyRecordRepositoryError,
    SandboxIdempotencyRecordRef,
    "SandboxIdempotencyRecord exact root repository failure。"
);
```

| repository variant | only legal source | application mapping baseline | retry / safety rule |
|---|---|---|---|
| `NotFound` | exact committed read找不到root | flow按owner映射`ReferenceUnresolved`、`NotVisible`或`InternalInvariantViolation` | 不自动create；query visibility由`7R-04`决定。 |
| `AlreadyExists` | insert-if-absent发现same key | duplicate-equivalent必须由`7R-02D`完整identity/result证明；否则`InternalInvariantViolation` | 不转save，不覆盖existing row。 |
| `VersionConflict` | expected core `Version`与current generation不等 | `ApplicationErrorDetail::VersionConflict` | 丢弃旧guard/decision/observation，完整重读重算。 |
| `Unavailable` | store/transaction adapter暂不可用 | `ApplicationErrorDetail::PortUnavailable` | 不冒充NotFound；条件变化后由上层新调用决定。 |
| `IntegrityViolation` | decode、key/object relation、half-group或schema invariant失败 | `ApplicationErrorDetail::InternalInvariantViolation` | fail-closed并进入reconciliation；不得默认值修复。 |

object-owned error与repository error是两条不同返回边界：application先调用Step 6 method得到
`Result<_, ObjectError>`，成功后才调用repository。adapter不得捕获object error，也不得把
`IntegrityViolation`伪装成object transition rejection。19个named error必须由application mapper逐type
穷尽处理；禁止`Box<dyn Error>`、raw cause、SQL state、path、provider response或`to_string()`进入reason。

### 1A.1 Exact method语义模板

所有trait遵守以下同构规则，后续代码块仍逐method具名，不能用generic trait替代：

| method class | transaction | success | exact failure | forbidden behavior |
|---|---|---|---|---|
| `get_*_with_version` | 接收同一`&mut dyn SandboxUnitOfWork`并读取其一致snapshot | `Versioned<T>`中的对象与Version同snapshot | `NotFound/Unavailable/IntegrityViolation` | fallback latest、默认对象、把NotFound转None、拼接Version。 |
| `create_*` | 在传入UoW stage完整对象，commit前不可见 | insert-if-absent；允许factory后同UoW合法transition形成的首次可见shape | `AlreadyExists/Unavailable/IntegrityViolation` | upsert、存在时save、repository调用factory、强制factory初态。 |
| `save_*` | stage完整对象并消费expected core `Version` | exact-key CAS staged | `NotFound/VersionConflict/Unavailable/IntegrityViolation` | patch/status update、reload latest、last-write-wins。 |

`create_*`和`save_*`都返回`Result<(), E>`：identity已由对象携带，stage成功不是commit confirmed，不能返回
新ref、cursor、Version或success receipt。`Version`按值传入，表示本次CAS expectation已被该stage消费；
同一旧Version不得用于两次独立save。repository trait当前使用native `async fn`且不声明`dyn Repository`；
runtime assembly采用何种静态/动态装配由`7R-04B`统一闭合，本批不引入`async-trait`依赖。

---

## 1B. Context、boundary与run repository exact traits

```rust
/// 持久化受控执行入口语境的mutable root；不拥有resolution snapshot或identity root。
pub trait ControlledExecutionContextRepository: Send + Sync {
    /// 在同一UoW snapshot按exact context ref读取对象与core Version。
    async fn get_context_with_version(
        &self,
        context_ref: &ControlledExecutionContextRef,
        uow: &mut dyn SandboxUnitOfWork,
    ) -> Result<Versioned<ControlledExecutionContext>, ControlledExecutionContextRepositoryError>;

    /// insert-if-absent stage由open-pending起始且已完成本UoW合法transition的完整context。
    async fn create_context(
        &self,
        context: &ControlledExecutionContext,
        uow: &mut dyn SandboxUnitOfWork,
    ) -> Result<(), ControlledExecutionContextRepositoryError>;

    /// 使用exact read取得的Version stage完整transition后context。
    async fn save_context(
        &self,
        context: &ControlledExecutionContext,
        expected_version: Version,
        uow: &mut dyn SandboxUnitOfWork,
    ) -> Result<(), ControlledExecutionContextRepositoryError>;
}

/// 持久化context绑定的execution environment identity；不拥有actor/member/runtime identity。
pub trait ExecutionEnvironmentIdentityRepository: Send + Sync {
    /// 按exact environment identity ref读取同snapshot对象与Version。
    async fn get_environment_identity_with_version(
        &self,
        environment_identity_ref: &ExecutionEnvironmentIdentityRef,
        uow: &mut dyn SandboxUnitOfWork,
    ) -> Result<Versioned<ExecutionEnvironmentIdentity>, ExecutionEnvironmentIdentityRepositoryError>;

    /// insert-if-absent stage由`bind`形成的active identity。
    async fn create_environment_identity(
        &self,
        identity: &ExecutionEnvironmentIdentity,
        uow: &mut dyn SandboxUnitOfWork,
    ) -> Result<(), ExecutionEnvironmentIdentityRepositoryError>;

    /// CAS stage由`close`或`invalidate`形成的完整identity。
    async fn save_environment_identity(
        &self,
        identity: &ExecutionEnvironmentIdentity,
        expected_version: Version,
        uow: &mut dyn SandboxUnitOfWork,
    ) -> Result<(), ExecutionEnvironmentIdentityRepositoryError>;
}

/// 持久化长期external reference resolution state；不现场调用resolver。
pub trait ReferenceResolutionStateRepository: Send + Sync {
    /// 按exact state ref读取current binding、status与同snapshot Version。
    async fn get_reference_state_with_version(
        &self,
        reference_state_ref: &ReferenceResolutionStateRef,
        uow: &mut dyn SandboxUnitOfWork,
    ) -> Result<Versioned<ReferenceResolutionState>, ReferenceResolutionStateRepositoryError>;

    /// insert-if-absent stage由track factory形成的完整state。
    async fn create_reference_state(
        &self,
        state: &ReferenceResolutionState,
        uow: &mut dyn SandboxUnitOfWork,
    ) -> Result<(), ReferenceResolutionStateRepositoryError>;

    /// CAS stage由mark-stale或apply-resolution形成的完整state。
    async fn save_reference_state(
        &self,
        state: &ReferenceResolutionState,
        expected_version: Version,
        uow: &mut dyn SandboxUnitOfWork,
    ) -> Result<(), ReferenceResolutionStateRepositoryError>;
}

/// 持久化coherent boundary root；requirement、decision与capability snapshot均由immutable owner另存。
pub trait CoherentBoundaryRepository: Send + Sync {
    /// 按exact boundary ref读取完整boundary与同snapshot Version。
    async fn get_boundary_with_version(
        &self,
        boundary_ref: &CoherentBoundaryRef,
        uow: &mut dyn SandboxUnitOfWork,
    ) -> Result<Versioned<CoherentBoundary>, CoherentBoundaryRepositoryError>;

    /// insert-if-absent stage由require起始且已完成本UoW合法transition的完整boundary root。
    async fn create_boundary(
        &self,
        boundary: &CoherentBoundary,
        uow: &mut dyn SandboxUnitOfWork,
    ) -> Result<(), CoherentBoundaryRepositoryError>;

    /// CAS stage由exact boundary transition形成的完整root。
    async fn save_boundary(
        &self,
        boundary: &CoherentBoundary,
        expected_version: Version,
        uow: &mut dyn SandboxUnitOfWork,
    ) -> Result<(), CoherentBoundaryRepositoryError>;
}

/// 持久化Sandbox管理的isolation environment handle；不调用backend。
pub trait IsolationEnvironmentHandleRepository: Send + Sync {
    /// 按exact handle ref读取完整handle与同snapshot Version。
    async fn get_isolation_handle_with_version(
        &self,
        isolation_handle_ref: &IsolationEnvironmentHandleRef,
        uow: &mut dyn SandboxUnitOfWork,
    ) -> Result<Versioned<IsolationEnvironmentHandle>, IsolationEnvironmentHandleRepositoryError>;

    /// insert-if-absent stage由create起始且已完成本UoW合法transition的完整handle root。
    async fn create_isolation_handle(
        &self,
        handle: &IsolationEnvironmentHandle,
        uow: &mut dyn SandboxUnitOfWork,
    ) -> Result<(), IsolationEnvironmentHandleRepositoryError>;

    /// CAS stage由activate/release/orphan transition形成的完整handle。
    async fn save_isolation_handle(
        &self,
        handle: &IsolationEnvironmentHandle,
        expected_version: Version,
        uow: &mut dyn SandboxUnitOfWork,
    ) -> Result<(), IsolationEnvironmentHandleRepositoryError>;
}

/// 持久化controlled run root；不执行tool semantics、runtime loop或backend launch。
pub trait ControlledExecutionRunRepository: Send + Sync {
    /// 按exact run ref读取完整run与同snapshot Version。
    async fn get_run_with_version(
        &self,
        run_ref: &ControlledExecutionRunRef,
        uow: &mut dyn SandboxUnitOfWork,
    ) -> Result<Versioned<ControlledExecutionRun>, ControlledExecutionRunRepositoryError>;

    /// insert-if-absent stage由`prepare`形成的Preparing run recovery root。
    async fn create_run(
        &self,
        run: &ControlledExecutionRun,
        uow: &mut dyn SandboxUnitOfWork,
    ) -> Result<(), ControlledExecutionRunRepositoryError>;

    /// CAS stage由running/completed/failure/control/redline transition形成的完整run。
    async fn save_run(
        &self,
        run: &ControlledExecutionRun,
        expected_version: Version,
        uow: &mut dyn SandboxUnitOfWork,
    ) -> Result<(), ControlledExecutionRunRepositoryError>;
}
```

这些方法只保证exact root的transactional primitive。context到source/resolution、reference source identity、
run到capture target、boundary到requirement/decision/handle/lease的unique relation读取与bounded index由
`7R-02C/02D/04`补齐；不得通过本批方法扫描对象正文反推relation。

---

## 1C. Capture与handoff mutable repository exact traits

```rust
/// 持久化capture group内body-free material lifecycle row；key不是全局object ref。
pub trait CapturedMaterialRepository: Send + Sync {
    /// 按exact composite key读取material与同snapshot Version。
    async fn get_captured_material_with_version(
        &self,
        key: &CapturedMaterialRepositoryKey,
        uow: &mut dyn SandboxUnitOfWork,
    ) -> Result<Versioned<CapturedMaterialRef>, CapturedMaterialRepositoryError>;

    /// insert-if-absent stage由from-candidate起始且已完成本UoW合法transition的完整material。
    async fn create_captured_material(
        &self,
        material: &CapturedMaterialRef,
        uow: &mut dyn SandboxUnitOfWork,
    ) -> Result<(), CapturedMaterialRepositoryError>;

    /// CAS stage完整handoff/retention transition后material。
    async fn save_captured_material(
        &self,
        material: &CapturedMaterialRef,
        expected_version: Version,
        uow: &mut dyn SandboxUnitOfWork,
    ) -> Result<(), CapturedMaterialRepositoryError>;
}

/// 持久化Sandbox-owned observability handoff material；不拥有observability store正文。
pub trait ObservabilityMaterialRepository: Send + Sync {
    /// 按exact material ref读取完整material与同snapshot Version。
    async fn get_observability_material_with_version(
        &self,
        material_ref: &ObservabilityMaterialRef,
        uow: &mut dyn SandboxUnitOfWork,
    ) -> Result<Versioned<ObservabilityMaterial>, ObservabilityMaterialRepositoryError>;

    /// insert-if-absent stage从terminal run起始且已完成本UoW合法transition的body-free material。
    async fn create_observability_material(
        &self,
        material: &ObservabilityMaterial,
        uow: &mut dyn SandboxUnitOfWork,
    ) -> Result<(), ObservabilityMaterialRepositoryError>;

    /// CAS stage完整handoff lifecycle transition后material。
    async fn save_observability_material(
        &self,
        material: &ObservabilityMaterial,
        expected_version: Version,
        uow: &mut dyn SandboxUnitOfWork,
    ) -> Result<(), ObservabilityMaterialRepositoryError>;
}

/// 持久化handoff aggregate及其内嵌target progress set；不得拆出progress repository。
pub trait HandoffFactRepository: Send + Sync {
    /// 按exact handoff ref读取aggregate、全部progress与同snapshot Version。
    async fn get_handoff_with_version(
        &self,
        handoff_ref: &HandoffFactRef,
        uow: &mut dyn SandboxUnitOfWork,
    ) -> Result<Versioned<HandoffFact>, HandoffFactRepositoryError>;

    /// insert-if-absent stage由`open`形成的完整Pending aggregate和全target progress。
    async fn create_handoff(
        &self,
        handoff: &HandoffFact,
        uow: &mut dyn SandboxUnitOfWork,
    ) -> Result<(), HandoffFactRepositoryError>;

    /// 以aggregate Version CAS stage target progress及derived aggregate的完整新状态。
    async fn save_handoff(
        &self,
        handoff: &HandoffFact,
        expected_version: Version,
        uow: &mut dyn SandboxUnitOfWork,
    ) -> Result<(), HandoffFactRepositoryError>;
}
```

`CapturedMaterialRepository.create_captured_material`必须在adapter内验证对象getter派生key与durable row key
一致；不匹配返回`IntegrityViolation`。handoff read必须一次取得完整ordered progress set，不能对每个target
独立读取后拼装Version。`begin_target_attempt`的attempt relation和pending retry selection由`7R-02C`补齐，
但其aggregate mutation只能经这里的`save_handoff`提交。

---

## 1D. `7R-02B` 开工确认与批次边界

本节及其后内容是对本文§1~§16中“`7R-02B`尚未开始”叙述的current override；`7R-02A`的UoW、
trusted clock、typed identity、core `Version`、external-await split和commit-unknown规则继续有效。

| 检查项 | 当前结论 |
|---|---|
| 用户授权 | 用户已明确“同意”继续，只授权启动`S7-02B`。 |
| 当前文档 / Step | `03-详细设计.md` / Step 7 regression / `7R-02B`。 |
| current source | Step 6 closure audit §9.2的20个mutable owner、五份canonical object source、`6R-07 S7H-07`和本文`7R-02A`。 |
| historical source | 原Step 7 `SandboxTruthRepository`、`save_*_group`、opaque ref和optional old version只用于缺口诊断，不继承签名。 |
| 本批产出 | 20/20 owner到19/19 logical root联接、exact typed get/create/save-CAS、repository error、same-UoW group和durable/fake parity。 |
| 本批非目标 | immutable fact/audit append、relay pending selection与attempt store、idempotency unique reservation/stored replay/index/page；分别留给`7R-02C/02D/04`。 |
| implementation | `CB-SBX-01A blocked / wait_design`；本批不修改正式`03~07`、boundary skeleton或实现仓。 |

```text
current_document = 03-详细设计.md
current_step = Step 7 regression / 7R-02B
current_batch = mutable truth repositories
batch_status = in_progress
gate_status = in_progress
next_allowed_action = complete_7R_02B_only
formal_03_07 = historical_reviewed_revalidation_pending
implementation = CB-SBX-01A blocked / wait_design
real_test_execution = not_started
real_evidence_created = no
commit_required = no
```

### 1D.1 目标与非目标

本批必须让application service能在同一`SandboxUnitOfWork`中按exact typed key读取committed对象与
`Version`、显式创建新对象、以及使用读取所得`Version`执行CAS保存。repository只负责持久化语义，
domain对象的factory、guard和transition仍由Step 6唯一拥有。

本批不允许：

- 用`Option<Version>`把create和update压成一个`save`；
- 用`SandboxObjectRef`、`ResourceRef`、字符串或status作为repository key；
- 让repository选择transition、patch字段、推导status、自动reload latest或last-write-wins；
- 给内嵌`HandoffTargetProgress`创建独立repository identity；
- 把immutable snapshot/fact、audit append、relay attempt、stored result或query index提前混入本批trait。

---

## 1E. `7R-02B` SOP问题回答、问题诊断与设计取舍

| SOP问题 | `7R-02B`回答 |
|---|---|
| trait owner / implementer | 19个logical repository trait均由`crates/application/src/repositories.rs`声明；durable与deterministic fake由`infra`实现。 |
| caller | 只有application service / maintenance service；domain和`api/worker/jobs`不得持有repository。 |
| exact read | mutation路径使用`get_*_with_version(exact key, &mut uow)`，存在即返回同一committed snapshot的`Versioned<T>`；缺失是typed `NotFound`。 |
| exact create | `create_*`只接受由Step 6 factory起始、并可在同一未提交UoW内完成零次或多次合法transition后的完整对象；目标key已存在返回typed `AlreadyExists`，不得转成update。 |
| exact update | `save_*`只接受完整transition后对象与从该对象exact read取得的core `Version`；冲突返回typed `VersionConflict`。 |
| object error | Step 6 object-owned error在调用repository前产生；repository error只描述not-found/already-exists/version-conflict/unavailable/integrity五类持久化事实。 |
| aggregate child | `HandoffTargetProgress`是`HandoffFact`内部成员；通过handoff aggregate的单个CAS保存，独立save为禁止路径。 |
| composite key | `CapturedMaterialRef`没有named object ref；唯一key为typed `(CaptureFactRef, CapturedMaterialKey)`，material key单独不全局唯一。 |
| same-UoW | application顺序调用多个exact repository method并传同一UoW；不提供会隐藏成员、Version或错误来源的`save_*_group`。 |
| query / duplicate | 本批方法服务mutation和recovery relation；public Query读取面由`7R-04`定义，duplicate replay由`7R-02D`定义且均不得借本批create/save写入。 |

| historical问题 | current处置 |
|---|---|
| 一个`SandboxTruthRepository`保存不同owner并接收opaque ref | 拆成19个按root命名的trait，method参数只接受matching named ref或captured-material composite key。 |
| `expected_version: Option<SandboxRepositoryVersion>` | create/save分离；update只接收core `Version`，不存在local version wrapper。 |
| `save_boundary_group`等大组方法隐藏对象遗漏和CAS来源 | application以同一UoW调用逐root exact method；原子组由§24声明完整成员与Version expectation。 |
| repository负责状态迁移或接受caller status/patch map | repository只编码完整对象；状态必须已由Step 6 owning method形成。 |
| `latest`、scan或missing-create fallback | 本批正向方法均为exact-key；必要bounded selection/index由后续owner显式定义。 |

设计取舍：采用“逐root trait + shared typed error kernel + per-root error alias”。这样既消除19份完全相同的
技术错误枚举，又让每个trait的错误key保持编译期exact type；shared kernel不提供generic repository读写，
也不允许application用一个generic repository对象绕过owner边界。

---

## 1F. 20个mutable owner到19个logical root的机械联接

| # | mutable status owner | persisted root / key | repository trait | create source | update source | owner error |
|---:|---|---|---|---|---|---|
| 1 | `ControlledExecutionContext` | `ControlledExecutionContextRef` | `ControlledExecutionContextRepository` | `open_pending` | 6种exact context transition | `ControlledExecutionContextError` |
| 2 | `ExecutionEnvironmentIdentity` | `ExecutionEnvironmentIdentityRef` | `ExecutionEnvironmentIdentityRepository` | `bind` | `close`;`invalidate` | `ExecutionEnvironmentIdentityError` |
| 3 | `ReferenceResolutionState` | `ReferenceResolutionStateRef` | `ReferenceResolutionStateRepository` | `track_resolved`;`track_non_resolved` | `mark_stale`;`apply_resolution` | `ReferenceResolutionStateError` |
| 4 | `CoherentBoundary` | `CoherentBoundaryRef` | `CoherentBoundaryRepository` | `require` | 6种exact boundary transition | `CoherentBoundaryError` |
| 5 | `IsolationEnvironmentHandle` | `IsolationEnvironmentHandleRef` | `IsolationEnvironmentHandleRepository` | `create` | `activate`;release/orphan transitions | `IsolationEnvironmentHandleError` |
| 6 | `ControlledExecutionRun` | `ControlledExecutionRunRef` | `ControlledExecutionRunRepository` | `prepare` | running/completed/failure/control/redline transitions | `ControlledExecutionRunError` |
| 7 | `CapturedMaterialRef` | `(CaptureFactRef, CapturedMaterialKey)` | `CapturedMaterialRepository` | `from_candidate` | handoff/retention transitions | `CapturedMaterialError` |
| 8 | `ObservabilityMaterial` | `ObservabilityMaterialRef` | `ObservabilityMaterialRepository` | `prepare_from_terminal_run` | handoff transitions | `ObservabilityMaterialError` |
| 9 | `HandoffTargetProgress` | embedded in `HandoffFactRef` root | `HandoffFactRepository` | `pending_for_target` through `HandoffFact::open` | `begin_attempt`;`apply_observation` through aggregate | `HandoffTargetProgressError` chained by `HandoffFactError` |
| 10 | `HandoffFact` | `HandoffFactRef` | `HandoffFactRepository` | `open` | target attempt/observation + cleanup override | `HandoffFactError` |
| 11 | `FailureClassification` | `FailureClassificationRef` | `FailureClassificationRepository` | pending/classified factories | classify/terminal/supersede transitions | `FailureClassificationError` |
| 12 | `ControlFact` | `ControlFactRef` | `ControlFactRepository` | accept/duplicate/conflict factories | complete/fail/attach failure | `ControlFactError` |
| 13 | `LeaseRecord` | `LeaseRecordRef` | `LeaseRecordRepository` | `open` | expiring/expired/orphan/released transitions | `LeaseRecordError` |
| 14 | `OrphanRecoveryRecord` | `OrphanRecoveryRecordRef` | `OrphanRecoveryRecordRepository` | `suspect` | confirm/recovering/recovered/failed | `OrphanRecoveryRecordError` |
| 15 | `CleanupGuard` | `CleanupGuardRef` | `CleanupGuardRepository` | `open` | decision/release authorization/failure/confirmation | `CleanupGuardError` |
| 16 | `RedlineContainment` | `RedlineContainmentRef` | `RedlineContainmentRepository` | `detect` | contain/handoff/preservation/investigation/release/terminal | `RedlineContainmentError` |
| 17 | `SandboxReadProjection` | `SandboxReadProjectionRef` | `SandboxReadProjectionRepository` | `create`;`create_unavailable` | stale/rebuild/degraded/unavailable | `SandboxReadProjectionError` |
| 18 | `DerivedInspectPreviewTrendState` | `DerivedInspectPreviewTrendStateRef` | `DerivedInspectPreviewTrendStateRepository` | `from_sources`;`unavailable_from_sources` | stale/rebuild/failed/unavailable | `DerivedInspectPreviewTrendStateError` |
| 19 | `SandboxEventRelayRecord` | `SandboxEventRelayRecordRef` | `SandboxEventRelayRecordRepository` | finalized relay draft | publish attempt/delivery/dead-letter/integrity | `SandboxEventRelayRecordError` |
| 20 | `SandboxIdempotencyRecord` | `SandboxIdempotencyRecordRef` | `SandboxIdempotencyRecordRepository` | `reserve` | `mark_completed`;`mark_failed` | `ApplicationError` |

计数规则固定为`20 status owners / 19 persisted roots / 19 repository traits`。#9不是漏项：它没有独立ref、
root row或Version；progress set与handoff aggregate必须从同一committed snapshot读取并用同一个
`HandoffFact` `Version` CAS。任何`HandoffTargetProgressRepository`都违反Step 6聚合边界。

### 1F.1 Captured material typed composite key

```rust
/// application repository用于定位capture group内material row的typed composite key；不是新truth identity。
#[derive(Clone, Debug, Eq, Hash, PartialEq)]
pub struct CapturedMaterialRepositoryKey {
    /// owning immutable capture fact identity。
    capture_ref: CaptureFactRef,
    /// 只在该capture group内稳定的material key。
    material_key: CapturedMaterialKey,
}

impl CapturedMaterialRepositoryKey {
    /// 从exact capture ref和group-local material key构造repository key。
    pub fn new(
        capture_ref: CaptureFactRef,
        material_key: CapturedMaterialKey,
    ) -> Self;

    /// 返回owning capture ref。
    pub fn capture_ref(&self) -> &CaptureFactRef;

    /// 返回group-local material key。
    pub fn material_key(&self) -> &CapturedMaterialKey;
}
```

该helper位于`application/repositories.rs`，不加入`SandboxObjectRefKind`，不由identity allocator生成，
不进入public DTO，也不允许只按`CapturedMaterialKey`全局查询。adapter从待create/save对象的两个getter
机械取得同一key；不接受caller另传一份可能不一致的key。

---

## 2. 本批目标与非目标

### 2.1 目标

1. 给所有写入型Command、Consumer和Job提供唯一application-owned事务边界。
2. 让时间、Sandbox-owned identity、core `Version`和committed cursor的来源互不混用。
3. 固定外部side effect前后的恢复点，禁止跨网络调用持有write UoW。
4. 固定rollback、commit confirmed、commit unknown、duplicate replay和CAS loser的可见性规则。
5. 为`7R-02B~D`提供可机械消费的repository签名约束，而不提前定义其具体方法集合。

### 2.2 非目标

- 不定义20个mutable truth repository的逐method surface；owner为`7R-02B`。
- 不定义13个immutable repository以及audit/relay store方法；owner为`7R-02C`。
- 不定义idempotency reserve/complete/fail、typed stored result和page/index方法；owner为`7R-02D`。
- 不选择数据库、隔离级别名称、SQL方言、物理表、锁实现或migration。
- 不新增Step 6 named ref、status、error、cursor或public DTO。
- 不展开普通审计、日志、测试或交付实现；本批只给这些surface最小一致性边界。

---

## 3. 权威输入与冲突裁决

| 输入 | 本批消费结论 |
|---|---|
| 详细设计SOP与书写规范§5.5/§5.10 | port必须给出exact typed callable、owner、调用方、实现方、事务和错误边界。 |
| 真相源闭环标准 | mutation必须从versioned read取得CAS token；stored replay、cursor和UoW来源必须唯一。 |
| Step 4 / 5 | `application/unit_of_work.rs`拥有UoW；`application/ports.rs`拥有clock/ID port；`infra/clock_id.rs`和repository adapters实现。 |
| shared types §7~§10 / §26 | 复用core `Timestamp/JobRunId/Version`、52 named refs及两类committed cursor；§26仅修复UoW adapter所需checked cursor constructor可见性；禁止duplicate wrapper。 |
| application object §9 | query access无UoW/ID；idempotency/stored result使用named refs；service outcome没有第二身份。 |
| context/boundary、policy/run/capture、failure/cleanup/read | identity bundle、pre-call recovery point、same-UoW owner group、cursor时点和safe failure规则。 |
| `7R-01` §4.5、§40~§43 | 42 callable的write/no-write、external split、duplicate和commit-unknown要求。 |
| historical Step 7 | `SandboxInstant`、`SandboxRepositoryVersion`、`SandboxOpaqueRef`和通用`next_*`只是失效诊断材料。 |

冲突裁决顺序固定为：

```text
core-contracts exact type
  -> Step 6 shared registry / current canonical object contract
  -> Step 6 S7H-06~10 handoff
  -> 7R-01 exact callable transaction requirement
  -> current 7R-02A contract
  -> historical Step 7 (diagnosis only)
```

若历史方法与本批在`Timestamp`、`Version`、identity owner或commit visibility上冲突，历史方法失效；不得通过alias、adapter overload或compatibility mapper保留两套语义。

---

## 4. SOP 问题回答

| SOP问题 | `7R-02A`回答 |
|---|---|
| trait/port由谁拥有 | `application`唯一拥有UoW manager、transaction handle、trusted clock和typed identity allocator port。 |
| 谁实现 | `infra`提供durable与deterministic fake；domain、entry和repository对象不实现第二套port。 |
| 谁调用 | 只允许application service调用；jobs entry可生成core `JobRunId`并冻结`started_at`，但不能持有UoW或mint Sandbox truth ref。 |
| read-only callable如何处理 | 13 Query及duplicate replay读取路径不begin write UoW、不分配Sandbox identity、不生成cursor。 |
| `Version`来源 | 只来自repository exact versioned read/list或create-absence expectation；不得来自input、clock、cursor或ID。 |
| cursor来源 | staged write set完整后由UoW分配；只有commit confirmed后才对外可见为committed cursor。 |
| 外部调用边界 | pre-call recovery truth先commit；释放UoW后调用external port；post-call用新UoW重读exact owner + `Version`。 |
| commit unknown | 冻结原operation和所有candidate identity，进入exact relation inspection；不得报告success、blind retry或补偿写。 |
| rollback | 只保证未确认提交的staged rows/cursors不作为committed truth可见；rollback失败/未知升级为一致性错误。 |
| fake parity | fake必须重现同样的Version/CAS、transaction visibility、cursor、commit unknown和rollback failure分支。 |

---

## 5. Planned Owner 与依赖边界

| contract | unique planned owner | caller | implementer | persistence / visibility |
|---|---|---|---|---|
| `SandboxUnitOfWork` | `crates/application/src/unit_of_work.rs` | application service / repository port | infra transaction adapter | transient linear write handle；不进入DTO/domain。 |
| `SandboxUnitOfWorkManager` | 同上 | application service | infra transaction adapter | begin/commit/rollback boundary。 |
| `SandboxTransactionRef` | 同上 | application/infra diagnostic assertion | infra allocator | application-local；非truth、非public、非recovery key。 |
| `Versioned<T>` | `crates/application/src/ports.rs` | application service | repository adapter returns | transient object + core `Version`；不得序列化为public DTO。 |
| `SandboxClockPort` | `crates/application/src/ports.rs` | application service / jobs assembly | `crates/infra/src/clock_id.rs` | 返回core `Timestamp`或`SandboxCheckedElapsed`；不拥有业务窗口、时区或配置语义。 |
| `SandboxIdentityAllocator` | `crates/application/src/ports.rs` | application service only | `crates/infra/src/clock_id.rs` | 只mint明确列入§8的Sandbox-owned identity。 |
| core `Version/Timestamp/JobRunId` | `core-contracts` | 全部current caller | upstream core | 只复用，不重定义codec或wrapper。 |
| named refs / committed cursors | `contracts` Step 6 owner | application/domain/repository | allocator/UoW按本批规则提供 | 类型schema不在本批复制。 |

依赖方向保持：

```text
core-contracts <- contracts <- domain <- application <- infra
                                             ^
                                             |
                                    api / worker / jobs
```

entry模块只依赖application facade。`api/worker/jobs`不得获得repository、UoW manager、clock port或identity allocator handle；startup wiring可以在infra构造service后向entry暴露facade trait object。

---

## 6. Application-local 基础类型

```rust
use core_contracts::metadata::{Timestamp, Version};

/// 仅用于同一进程内关联一次write transaction；不是Sandbox truth identity。
#[derive(Clone, Debug, Eq, Hash, PartialEq)]
pub struct SandboxTransactionRef(String);

impl SandboxTransactionRef {
    /// 从infra生成的非空transaction token构造application-local ref。
    pub fn try_new(value: String) -> ApplicationResult<Self>;

    /// 返回已校验的transaction token，仅供diagnostic与fake assertion。
    pub fn as_str(&self) -> &str;
}

/// 将已提交对象与下一次CAS必须使用的core Version绑定。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct Versioned<T> {
    /// 从一个committed repository snapshot读取的完整对象。
    value: T,
    /// 与该对象同一snapshot返回的optimistic token。
    version: Version,
}

impl<T> Versioned<T> {
    /// 仅供repository adapter从同一committed read构造。
    pub fn from_committed(value: T, version: Version) -> Self;

    /// 借用committed对象。
    pub fn value(&self) -> &T;

    /// 借用下一次CAS必须原样使用的core Version。
    pub fn version(&self) -> &Version;

    /// 将对象和Version一起移交给application transition flow。
    pub fn into_parts(self) -> (T, Version);
}
```

| helper | 不变量 | 禁止用途 |
|---|---|---|
| `SandboxTransactionRef` | non-empty；一次begin唯一；commit/rollback消费后失效 | public id、truth ref、idempotency key、external correlation、commit recovery key。 |
| `Versioned<T>` | value/version来自同一committed snapshot；构造入口不对entry开放 | 从两个读取拼接、clone旧Version套用新对象、作为immutable object的更新许可。 |
| `Timestamp` | 只来自trusted clock或已验证上游observation | repository version、cursor、ID、latest-wins tie-breaker。 |
| `Version` | 只表达单个mutable persisted owner的optimistic generation |时间、page token、truth/reference cursor、source version或operation identity。 |

`Versioned<T>`不实现“自动reload”或“save latest”。CAS conflict后，旧domain decision、guard result、external observation或completion全部失效；只有重新执行完整read -> guard/transition -> write flow才能生成新决定。

---

## 7. UoW 与 Trusted Clock Exact Contract

### 7.1 UoW contract

```rust
/// Sandbox application写入事务的线性handle；repository write只接受借用。
pub trait SandboxUnitOfWork: Send {
    /// 返回本事务的application-local identity；不得作为durable recovery key。
    fn transaction_ref(&self) -> &SandboxTransactionRef;

    /// 在truth owner group已声明完整且cursor-independent writes已stage后，分配唯一truth boundary cursor。
    fn assign_truth_cursor(
        &mut self,
    ) -> Result<SandboxTruthCursor, SandboxUnitOfWorkUsageError>;

    /// 在reference owner group已声明完整且cursor-independent writes已stage后，分配唯一reference cursor。
    fn assign_reference_cursor(
        &mut self,
    ) -> Result<SandboxReferenceCursor, SandboxUnitOfWorkUsageError>;

    /// 返回本事务已分配但尚不一定committed的truth cursor。
    fn assigned_truth_cursor(&self) -> Option<SandboxTruthCursor>;

    /// 返回本事务已分配但尚不一定committed的reference cursor。
    fn assigned_reference_cursor(&self) -> Option<SandboxReferenceCursor>;
}

/// 创建并终结Sandbox write transaction；commit/rollback消费线性handle。
pub trait SandboxUnitOfWorkManager: Send + Sync {
    /// 开启一个新的write transaction。
    async fn begin(
        &self,
    ) -> Result<Box<dyn SandboxUnitOfWork>, SandboxUnitOfWorkBeginError>;

    /// 尝试原子提交完整staged write set；成功返回Confirmed。
    async fn commit(
        &self,
        uow: Box<dyn SandboxUnitOfWork>,
    ) -> Result<SandboxCommitReceipt, SandboxCommitError>;

    /// 在commit尚未开始时回滚全部staged writes；成功后不可见。
    async fn rollback(
        &self,
        uow: Box<dyn SandboxUnitOfWork>,
    ) -> Result<(), SandboxRollbackError>;
}

/// 只有durable commit被明确确认后才能返回的application receipt。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct SandboxCommitReceipt {
    /// 已确认提交的transaction ref；仅供同次application flow匹配。
    transaction_ref: SandboxTransactionRef,
    /// 本事务已确认提交的optional truth cursor。
    truth_cursor: Option<SandboxTruthCursor>,
    /// 本事务已确认提交的optional reference cursor。
    reference_cursor: Option<SandboxReferenceCursor>,
}

impl SandboxCommitReceipt {
    /// 仅供UoW manager在durable commit已确认后构造receipt。
    pub fn confirmed(
        transaction_ref: SandboxTransactionRef,
        truth_cursor: Option<SandboxTruthCursor>,
        reference_cursor: Option<SandboxReferenceCursor>,
    ) -> Self;

    /// 返回已确认提交的transaction ref。
    pub fn transaction_ref(&self) -> &SandboxTransactionRef;

    /// 返回已确认提交的truth cursor；本事务没有truth write时为None。
    pub fn truth_cursor(&self) -> Option<SandboxTruthCursor>;

    /// 返回已确认提交的reference cursor；本事务没有reference write时为None。
    pub fn reference_cursor(&self) -> Option<SandboxReferenceCursor>;
}

/// begin阶段的有限失败；不携带driver或store raw cause。
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum SandboxUnitOfWorkBeginError {
    /// durable transaction入口暂不可用；本次write set仍为零。
    Unavailable { reason: SandboxReason },
    /// runtime binding或transaction adapter违反已验证不变量。
    InvalidBinding { reason: SandboxReason },
}

/// UoW handle的非法使用或cursor分配失败。
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum SandboxUnitOfWorkUsageError {
    /// 尚未stage任何truth write却请求truth cursor。
    NoStagedTruthWrite,
    /// 尚未stage任何reference/marker write却请求reference cursor。
    NoStagedReferenceWrite,
    /// 同一事务重复请求truth cursor。
    TruthCursorAlreadyAssigned,
    /// 同一事务重复请求reference cursor。
    ReferenceCursorAlreadyAssigned,
    /// store暂时无法分配对应cursor；不得使用本地fallback。
    AllocationUnavailable { reason: SandboxReason },
}

/// durable commit已明确未发生时的有限失败类别。
#[derive(Clone, Copy, Debug, Eq, Hash, Ord, PartialEq, PartialOrd)]
pub enum SandboxNotCommittedKind {
    /// deferred optimistic/unique owner检查产生并发冲突。
    VersionConflict,
    /// durable store在应用任何write前不可用。
    StoreUnavailable,
    /// staged group无法通过完整性或constraint校验。
    IntegrityRejected,
}

/// commit失败且adapter能证明全部staged writes均未提交。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct SandboxNotCommitted {
    /// 失败类别；application mapper必须穷尽映射。
    kind: SandboxNotCommittedKind,
    /// 已脱敏的安全理由。
    reason: SandboxReason,
}

impl SandboxNotCommitted {
    /// 仅供UoW adapter在能够证明整组零提交时构造。
    pub fn new(kind: SandboxNotCommittedKind, reason: SandboxReason) -> Self;

    /// 返回已证明的未提交类别。
    pub fn kind(&self) -> SandboxNotCommittedKind;

    /// 返回已脱敏的安全理由。
    pub fn reason(&self) -> &SandboxReason;
}

/// commit durable状态不可判定；只允许进入exact relation inspection。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct SandboxCommitUnknown {
    /// 原transaction identity；不是业务recovery key。
    transaction_ref: SandboxTransactionRef,
    /// 已脱敏且不推断commit状态的安全理由。
    reason: SandboxReason,
}

impl SandboxCommitUnknown {
    /// 仅供UoW adapter在durable状态无法证明时构造。
    pub fn new(
        transaction_ref: SandboxTransactionRef,
        reason: SandboxReason,
    ) -> Self;

    /// 返回原transaction identity，仅供诊断关联。
    pub fn transaction_ref(&self) -> &SandboxTransactionRef;

    /// 返回不推断commit状态的安全理由。
    pub fn reason(&self) -> &SandboxReason;
}

/// commit的有限错误；NotCommitted与StatusUnknown不可合并。
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum SandboxCommitError {
    /// adapter明确证明没有任何staged write生效。
    NotCommitted(SandboxNotCommitted),
    /// adapter无法证明commit发生或未发生。
    StatusUnknown(SandboxCommitUnknown),
}

/// rollback失败；任何variant都不得被解释为已成功回滚。
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum SandboxRollbackError {
    /// rollback命令明确失败，transaction需要一致性检查。
    Failed {
        transaction_ref: SandboxTransactionRef,
        reason: SandboxReason,
    },
    /// rollback完成性未知，不能推断staged writes不可见。
    StatusUnknown {
        transaction_ref: SandboxTransactionRef,
        reason: SandboxReason,
    },
}
```

`commit`的错误闭集不与Step 6 `ApplicationErrorDetail`另建公开错误层：

| UoW终结结果 | application处理 | public/entry处理 | 可否同operation自动重试 |
|---|---|---|---:|
| `Confirmed(receipt)` | 允许构造/返回本次fresh success或stored surface | 继续正常mapping | 不需要 |
| definite stage failure before `commit` | caller仍持有handle并必须rollback；映射现有typed detail | delayed/failed按既有mapper | 仅完整重启flow且幂等owner允许 |
| `NotCommitted` | commit已消费handle但明确证明整组零可见；按kind映射VersionConflict/PortUnavailable/Internal | delayed/failed按既有mapper | 重新进入完整幂等preflight后才可决定 |
| `CommitUnknown` | 丢弃内存success，冻结identity并进入§11 exact inspection | `Internal`/delayed-safe surface；不得success | 否 |
| rollback confirmed | staged writes/cursors不可见 | 返回原业务/技术错误 | 由上层新调用决定 |
| rollback failed/unknown | 进入一致性检查；不得宣称absent | `Internal` | 否 |

`SandboxUnitOfWorkBeginError`、`SandboxUnitOfWorkUsageError`、`SandboxCommitError`和
`SandboxRollbackError`是application port failure carrier，只允许由UoW owner返回并立即穷尽映射；不得携带SQL、
driver、filesystem、host、container或raw cause。`NotCommittedKind`映射固定为
`VersionConflict -> VersionConflict`、`StoreUnavailable -> PortUnavailable`、
`IntegrityRejected -> InternalInvariantViolation`。`StatusUnknown`与现有
`InfraError::PersistenceCommitUnknown`一一对应并映射`InternalInvariantViolation`，不新增public kind。

`SandboxTransactionRef::try_new`、`Versioned::from_committed`、`SandboxCommitReceipt::confirmed`、
`SandboxNotCommitted::new`和`SandboxCommitUnknown::new`必须为`pub`，因为实现者位于独立的`infra` crate；
private fields与checked constructor仍是唯一构造入口。receipt中的transaction ref和两个optional cursor必须
逐项等于被commit消费的UoW在durable commit前冻结的值；adapter不得替换、补造或在commit返回后重新分配。
begin `InvalidBinding`、cursor重复 / 无staged group、receipt relation mismatch映射
`InternalInvariantViolation`；begin / cursor allocation unavailable映射`PortUnavailable`；rollback
`Failed | StatusUnknown`均映射`InternalInvariantViolation`并进入一致性检查。

### 7.2 Cursor规则

| 规则 | `SandboxTruthCursor` | `SandboxReferenceCursor` |
|---|---|---|
| 调用时点 | truth owner group已完整声明、全部cursor-independent writes已stage之后；随后只允许在同一UoW补齐引用该cursor的成员 | reference/snapshot/marker group已完整声明、全部cursor-independent writes已stage之后；随后只允许补齐引用该cursor的成员 |
| 每事务次数 | 0或1；同事务多个truth change复用同一boundary cursor | 0或1；同事务多个reference marker复用同一cursor |
| 双cursor事务 | 只有flow明确同时改变truth和reference marker时可各调用一次；类型保持隔离 | 同左 |
| 可见性 | 仅commit confirmed后可出现在result、relay/source linkage或后续read | 仅commit confirmed后可作为后续marker/source cursor读取 |
| rollback | 不可见且不得被后续对象引用 | 不可见且不得被后续对象引用 |
| commit unknown | cursor值不得作为“已提交”证据；只按exact identity relation检查 | 同左 |
| 禁止来源 | `Version`、page token、clock、ID、trace、digest、hard-coded integer | source version、dedup key、clock、ID、truth cursor |

### 7.3 Trusted clock

```rust
/// clock adapter 对一个 canonical baseline 完成的单次 checked-elapsed 结果。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct SandboxCheckedElapsed {
    /// caller 传入且由 adapter 原样回显的 canonical baseline。
    baseline_at: Timestamp,
    /// adapter 本次只读取一次得到的 canonical evaluation time。
    evaluated_at: Timestamp,
    /// `evaluated_at - baseline_at` 的 checked milliseconds；允许为零。
    elapsed_millis: u64,
}

impl SandboxCheckedElapsed {
    /// 仅从 clock adapter 已完成 canonical parse、顺序和 overflow 校验的结果构造。
    pub fn try_from_clock(
        baseline_at: Timestamp,
        evaluated_at: Timestamp,
        elapsed_millis: u64,
    ) -> Result<Self, SandboxClockError>;

    /// 返回 caller baseline；application 必须与原输入做全字段相等校验。
    pub fn baseline_at(&self) -> &Timestamp;
    /// 返回与 elapsed 同一次 clock observation 的 evaluation time。
    pub fn evaluated_at(&self) -> &Timestamp;
    /// 返回经过 clock adapter 校验的 elapsed milliseconds。
    pub fn elapsed_millis(&self) -> u64;
}

/// 提供Sandbox application唯一可信逻辑时间。
pub trait SandboxClockPort: Send + Sync {
    /// 返回一次已验证的core Timestamp；adapter失败不得回退本地默认值。
    fn now(&self) -> Result<Timestamp, SandboxClockError>;

    /// 对 exact baseline 读取一次 evaluation time并返回 checked pair；不得饱和、取绝对值或按字符串相减。
    fn checked_elapsed_since(
        &self,
        baseline_at: &Timestamp,
    ) -> Result<SandboxCheckedElapsed, SandboxClockError>;
}

/// trusted clock的有限失败；不携带系统时钟或provider raw value。
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum SandboxClockError {
    /// clock dependency暂不可用。
    Unavailable { reason: SandboxReason },
    /// clock返回无法构成core Timestamp或违反单调关系的值。
    InvalidTimestamp { reason: SandboxReason },
    /// baseline / evaluation不能按已激活 canonical timestamp contract形成安全 elapsed。
    InvalidElapsedRelation { reason: SandboxReason },
}
```

`checked_elapsed_since` 的实现必须先按 Activation 已固定的 canonical timestamp parser解析 exact baseline和本次
`evaluated_at`，再执行 checked subtraction。`evaluated_at < baseline_at`、duration overflow、baseline回显不相等或 parser
不可用均返回 `InvalidElapsedRelation`；不得返回零、最大值、绝对值或本地 wall-clock fallback。相等时间合法并返回零。
application必须同时消费 `evaluated_at` 与 `elapsed_millis`，不能把 elapsed 与另一次 `now()` 拼接。当前
`BLK-SBX-VERSION-001` 仍负责在 Activation 前固定 core revision、canonical timestamp format/parser与 arithmetic
compatibility；本次签名补齐不声称该实现前置已经关闭。

| 用途 | 读取规则 | 禁止项 |
|---|---|---|
| 单transition时间 | 每个domain transition先读取一次并原样传入所有同义`changed_at/observed_at`字段 | 每个对象分别取now造成同一原子变化内部漂移。 |
| lease/reaper age | 用一次checked time计算完整selection/page；若长批次跨安全阈值，下一item/page重新取时并重验 | 使用wall-clock字符串、job start time代替current safety check。 |
| external observation | adapter提供typed `observed_at`时先校验；post-call application time不能反写adapter observation | 收到结果后用本地now伪造provider observation time。 |
| job start/finish | `started_at`由trusted jobs assembly冻结；finalization UoW读取一次finish/recorded time且`>= started_at` | duplicate生成新start/finish time；page间改写start time。 |
| idempotency duplicate | 原stored time原样replay | duplicate读取now并重建stored result。 |

clock不可成为业务排序裁决器。并发winner由unique constraint、exact binding和core `Version` CAS决定；timestamp相同或大小关系不能覆盖CAS conflict。

---

## 8. Typed Identity Allocation Contract

### 8.1 Port shape

```rust
/// 只为明确登记的Sandbox-owned持久身份分配exact typed ref。
pub trait SandboxIdentityAllocator: Send + Sync {
    /// 分配受控执行语境identity。
    fn next_controlled_execution_context_ref(&self) -> IdentityResult<ControlledExecutionContextRef>;
    /// 分配执行环境identity。
    fn next_execution_environment_identity_ref(&self) -> IdentityResult<ExecutionEnvironmentIdentityRef>;
    /// 分配execution context resolution identity。
    fn next_execution_context_resolution_ref(&self) -> IdentityResult<ExecutionContextResolutionRef>;
    /// 分配context reference resolution identity。
    fn next_context_reference_resolution_ref(&self) -> IdentityResult<ContextReferenceResolutionRef>;
    /// 分配intake guard rule identity。
    fn next_controlled_execution_intake_guard_ref(&self) -> IdentityResult<ControlledExecutionIntakeGuardRef>;
    /// 分配external-body exclusion guard identity。
    fn next_external_body_exclusion_guard_ref(&self) -> IdentityResult<ExternalBodyExclusionGuardRef>;
    /// 分配boundary requirement identity。
    fn next_boundary_requirement_set_ref(&self) -> IdentityResult<BoundaryRequirementSetRef>;
    /// 分配coherent boundary identity。
    fn next_coherent_boundary_ref(&self) -> IdentityResult<CoherentBoundaryRef>;
    /// 分配boundary establishment decision identity。
    fn next_boundary_establishment_decision_ref(&self) -> IdentityResult<BoundaryEstablishmentDecisionRef>;
    /// 分配backend capability snapshot identity。
    fn next_backend_capability_summary_ref(&self) -> IdentityResult<BackendCapabilitySummaryRef>;
    /// 分配Sandbox-managed isolation handle identity。
    fn next_isolation_environment_handle_ref(&self) -> IdentityResult<IsolationEnvironmentHandleRef>;
    /// 分配boundary coherence guard identity。
    fn next_boundary_coherence_guard_ref(&self) -> IdentityResult<BoundaryCoherenceGuardRef>;
    /// 分配backend capability guard identity。
    fn next_backend_capability_guard_ref(&self) -> IdentityResult<BackendCapabilityGuardRef>;
    /// 分配execution status view identity。
    fn next_sandbox_execution_status_view_ref(&self) -> IdentityResult<SandboxExecutionStatusViewRef>;
    /// 分配boundary status view identity。
    fn next_boundary_status_view_ref(&self) -> IdentityResult<BoundaryStatusViewRef>;
    /// 分配policy applicability snapshot identity。
    fn next_policy_applicability_snapshot_ref(&self) -> IdentityResult<PolicyApplicabilitySnapshotRef>;
    /// 分配policy execution decision identity。
    fn next_policy_execution_decision_ref(&self) -> IdentityResult<PolicyExecutionDecisionRef>;
    /// 分配high-risk action decision identity。
    fn next_high_risk_action_decision_ref(&self) -> IdentityResult<HighRiskActionDecisionRef>;
    /// 分配policy applicability guard identity。
    fn next_policy_applicability_guard_ref(&self) -> IdentityResult<PolicyApplicabilityGuardRef>;
    /// 分配fail-closed policy guard identity。
    fn next_fail_closed_policy_guard_ref(&self) -> IdentityResult<FailClosedPolicyGuardRef>;
    /// 分配policy summary view identity。
    fn next_policy_decision_summary_view_ref(&self) -> IdentityResult<PolicyDecisionSummaryViewRef>;
    /// 分配controlled run identity。
    fn next_controlled_execution_run_ref(&self) -> IdentityResult<ControlledExecutionRunRef>;
    /// 分配capture fact identity。
    fn next_capture_fact_ref(&self) -> IdentityResult<CaptureFactRef>;
    /// 分配observability material identity。
    fn next_observability_material_ref(&self) -> IdentityResult<ObservabilityMaterialRef>;
    /// 分配material handoff fact identity。
    fn next_handoff_fact_ref(&self) -> IdentityResult<HandoffFactRef>;
    /// 分配capture completeness guard identity。
    fn next_capture_completeness_guard_ref(&self) -> IdentityResult<CaptureCompletenessGuardRef>;
    /// 分配handoff ownership guard identity。
    fn next_handoff_ownership_guard_ref(&self) -> IdentityResult<HandoffOwnershipGuardRef>;
    /// 分配capture summary view identity。
    fn next_capture_summary_view_ref(&self) -> IdentityResult<CaptureSummaryViewRef>;
    /// 分配material handoff status view identity。
    fn next_material_handoff_status_view_ref(&self) -> IdentityResult<MaterialHandoffStatusViewRef>;
    /// 分配failure classification identity。
    fn next_failure_classification_ref(&self) -> IdentityResult<FailureClassificationRef>;
    /// 分配control fact identity。
    fn next_control_fact_ref(&self) -> IdentityResult<ControlFactRef>;
    /// 分配lease record identity。
    fn next_lease_record_ref(&self) -> IdentityResult<LeaseRecordRef>;
    /// 分配orphan recovery identity。
    fn next_orphan_recovery_record_ref(&self) -> IdentityResult<OrphanRecoveryRecordRef>;
    /// 分配cleanup guard truth identity。
    fn next_cleanup_guard_ref(&self) -> IdentityResult<CleanupGuardRef>;
    /// 分配redline containment truth identity。
    fn next_redline_containment_ref(&self) -> IdentityResult<RedlineContainmentRef>;
    /// 分配control conflict guard identity。
    fn next_control_conflict_guard_ref(&self) -> IdentityResult<ControlConflictGuardRef>;
    /// 分配cleanup safety guard identity。
    fn next_cleanup_safety_guard_ref(&self) -> IdentityResult<CleanupSafetyGuardRef>;
    /// 分配redline containment guard identity。
    fn next_redline_containment_guard_ref(&self) -> IdentityResult<RedlineContainmentGuardRef>;
    /// 分配failure/control status view identity。
    fn next_failure_control_status_view_ref(&self) -> IdentityResult<FailureControlStatusViewRef>;
    /// 分配cleanup readiness view identity。
    fn next_cleanup_readiness_view_ref(&self) -> IdentityResult<CleanupReadinessViewRef>;
    /// 分配redline containment view identity。
    fn next_redline_containment_view_ref(&self) -> IdentityResult<RedlineContainmentViewRef>;
    /// 分配reference resolution state identity。
    fn next_reference_resolution_state_ref(&self) -> IdentityResult<ReferenceResolutionStateRef>;
    /// 分配derived state identity。
    fn next_derived_inspect_preview_trend_state_ref(&self) -> IdentityResult<DerivedInspectPreviewTrendStateRef>;
    /// 分配derived read-only guard identity。
    fn next_derived_read_only_guard_ref(&self) -> IdentityResult<DerivedReadOnlyGuardRef>;
    /// 分配Sandbox read projection identity。
    fn next_sandbox_read_projection_ref(&self) -> IdentityResult<SandboxReadProjectionRef>;
    /// 分配derived view/materialization identity。
    fn next_derived_inspect_preview_trend_view_ref(&self) -> IdentityResult<DerivedInspectPreviewTrendViewRef>;
    /// 分配backend comparison view identity。
    fn next_backend_capability_comparison_view_ref(&self) -> IdentityResult<BackendCapabilityComparisonViewRef>;
    /// 分配reconciliation report identity。
    fn next_sandbox_reconciliation_report_ref(&self) -> IdentityResult<SandboxReconciliationReportRef>;
    /// 分配append-only audit identity。
    fn next_sandbox_audit_trace_ref(&self) -> IdentityResult<SandboxAuditTraceRef>;
    /// 分配append-only relay record identity。
    fn next_sandbox_event_relay_record_ref(&self) -> IdentityResult<SandboxEventRelayRecordRef>;
    /// 分配idempotency record identity。
    fn next_sandbox_idempotency_record_ref(&self) -> IdentityResult<SandboxIdempotencyRecordRef>;
    /// 分配stored operation result identity。
    fn next_sandbox_stored_operation_result_ref(&self) -> IdentityResult<SandboxStoredOperationResultRef>;
    /// 分配handoff target attempt identity。
    fn next_handoff_delivery_attempt_ref(&self) -> IdentityResult<HandoffDeliveryAttemptRef>;
    /// 分配relay publisher attempt identity。
    fn next_sandbox_relay_attempt_ref(&self) -> IdentityResult<SandboxRelayAttemptRef>;
}

/// exact identity allocation的统一typed error结果。
pub type IdentityResult<T> = Result<T, SandboxIdentityAllocationError>;

/// identity allocation失败；不允许返回generic ResourceRef或raw generator cause。
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum SandboxIdentityAllocationError {
    /// allocator dependency暂不可用，尚未生成可用identity。
    Unavailable { reason: SandboxReason },
    /// generator返回空或不满足对应named ref constructor的identity。
    InvalidGeneratedIdentity { reason: SandboxReason },
    /// 同一owner group中生成了重复底层identity。
    IdentityCollision { reason: SandboxReason },
}
```

54个method分别覆盖52个`SandboxObjectRefKind`和两个跨模块attempt ref；每个adapter method内部必须调用对应Step 6 named wrapper的checked constructor，不能先向application返回generic `ResourceRef`。对于必须一次分配多个身份并校验互不碰撞的owner group，application调用多个exact method后使用flow-specific identity bundle复核；本批不新增通用`Vec<ResourceRef>` bundle。

### 8.2 Identity来源分类

| 分类 | current identity | 唯一来源 | 规则 |
|---|---|---|---|
| application generated | context、environment identity、resolution、boundary/policy/run/capture/handoff/failure/control/cleanup/orphan/redline、reference/projection/derived、view/report/audit/relay、idempotency/stored refs | `SandboxIdentityAllocator` exact typed method | 必须在首次side effect或stage前冻结；commit unknown保留同一identity。 |
| owner-group generated | run + capture；capture + observability；boundary decision + boundary + handle/lease候选；reconciliation report/finding/audit/optional relay/stored group | flow-specific checked identity bundle | 同次allocation step、pairwise non-collision；条件性identity只在条件成立后分配。 |
| repository/store generated | `SandboxStoredResultSurfaceRef.resource_ref`、committed cursors、core `Version` | result store/UoW/repository | application不能预造；rollback/unknown不表示committed。 |
| adapter/external preserved | external source/safe summary、backend descriptor/handle source、material/receipt/target refs | exact typed adapter outcome或upstream envelope | 必须原样保留kind/lineage；不得重新mint Sandbox同义identity。 |
| entry preserved | actor/request/trace/idempotency key/operation/digest、caller selectors | checked call context / Step 8 DTO mapper | 不进入ID allocator；不得从显示名、route、topic或字符串重建。 |
| runtime/job preserved | core `JobRunId`、runtime generation/profile/config/binding refs | trusted jobs/runtime assembly | `JobRunId`不是idempotency key或stored report ref。 |
| transient no identity | service outcome、query access decision、adapter outcome、consumer candidate、job permit/accumulator/exit disposition | in-memory checked carrier | 不新增`*Ref`，不持久化第二身份。 |

### 8.3 52 named refs的分配边界

52个`SandboxObjectRefKind`不是52个都可由业务flow随意生成。下表是重叠的权限视图，不是把52个kind重复求和的分区：

| family | allocation rule |
|---|---|
| 20 mutable truth owner refs | 首次create的owning flow或明确maintenance owner分配；更新路径必须复用loaded ref。 |
| 13 immutable snapshot/fact refs | 每个formal attempt/materialization分配新ref；replacement不得更新旧row。 |
| 12 pure guard rule refs | 由validated rule/config materialization owner提供；业务Command/Consumer/Job不临时生成。 |
| 8 status view refs | 只由write-side status materialization owner分配；13 Query分配数必须为0。 |
| idempotency/stored refs | fresh write-capable operation在reservation阶段分配；duplicate复用原refs。 |
| audit/relay refs | 仅在当前flow明确要求append时分配；relay被禁用或finding为空时不得预分配占位identity。 |

这里的family分类用于限制allocator调用权限，不改变Step 6 registry category，也不提前替代`7R-02B~D`的逐repository inventory。

### 8.4 Identity禁止矩阵

| 禁止做法 | 原因 |
|---|---|
| `next_service_outcome_ref`、`next_query_access_decision_ref`、`next_consumer_receipt_ref` | current carrier无第二持久身份；receipt/report identity由stored public surface owner提供。 |
| `next_opaque_ref` / `next_object_ref(kind)` / `allocate(kind)` | 调用方可绕过54个exact typed method和owner权限。 |
| 从timestamp、Version、cursor、page token、trace或digest拼ref | 混淆语义并破坏collision/commit visibility。 |
| duplicate或commit-unknown恢复生成新ref | 可能形成第二truth、第二attempt或第二stored surface。 |
| query分配view/ref/audit identity | 违反13/13 no-write；missing/stale必须诚实返回surface。 |
| adapter替Sandbox生成domain truth ref | adapter只返回external/candidate/observation；truth identity在application call前冻结。 |

---

## 9. Core `Version` 与 CAS Contract

### 9.1 唯一来源

```rust
// Mutable update的唯一合法骨架；具体repository method由7R-02B定义。
let Versioned { value, version } = repository.get_exact_with_version(owner_ref).await?;
let next_value = value.apply_checked_transition(observation, checked_at)?;
repository.save(next_value, version, uow.as_mut()).await?;
```

| 场景 | expected version | absence/create expectation | conflict行为 |
|---|---|---|---|
| mutable owner update | exact `Versioned<T>::version` | 不适用 | 返回`ApplicationErrorDetail::VersionConflict`；旧决定作废。 |
| create new identity | 不接受伪造`Version(0)` | repository explicit create/insert-if-absent contract | already exists分duplicate-equivalent或integrity conflict，按`7R-02B/C` owner定义。 |
| current binding replacement | exact binding/core `Version` | first materialization使用explicit absent expectation | CAS loser不保存historical success，不reload latest套用旧candidate。 |
| append-only record | 不更新既有row | exact unique identity/source key | duplicate exact relation可返回existing；conflicting duplicate为integrity error。 |
| immutable snapshot replacement | 新identity + explicit old/current binding version | first/replacement分支显式 | 旧snapshot永不update。 |

### 9.2 CAS安全规则

1. `Version`必须与loaded object同一snapshot返回，不能由caller input提供。
2. domain transition和guard evaluation完成后若CAS conflict，所有基于旧snapshot的decision、authorization、attempt或completion失效。
3. 重试必须重新读取完整owner group和fresh `Version`，重新执行guard/transition；不得只reload目标row。
4. external observation只能应用到matching active attempt。若post-call CAS conflict，先inspect/reconcile exact attempt relation，不得把旧observation套用到latest owner。
5. fake adapter必须制造first-winner/second-conflict，不能last-write-wins或自动merge。
6. repository不得接收caller status、patch map或row-only transition；完整对象变化只由Step 6 owner method形成。

---

## 10. Transaction 生命周期与 External Await Boundary

### 10.1 无外部side effect的single-UoW模板

```text
validate checked input / call context
begin UoW
reserve idempotency (write-capable only)
  duplicate -> no mutation;read original stored result;rollback/close empty UoW
  conflict/in-flight -> no business mutation
load exact owners + Version in one transaction snapshot
call Step 6 factory/guard/transition
allocate only required fresh identities
stage truth / immutable facts / audit / relay / markers / stored surface
complete idempotency linkage
assign required truth/reference cursor after write set is complete
commit
  confirmed -> return fresh outcome
  unknown -> discard in-memory success;exact relation inspection
```

适用：纯resolver-read后的context/policy assembly、typed consumer truth intake、cleanup guard decision、projection/derived write completion等不在事务内产生external side effect的阶段。

### 10.2 有外部side effect的two/three-UoW模板

```text
UoW-A: load exact owners + Version
       create/freeze attempt or preservation recovery point
       stage audit/required marker/stored relation
       commit confirmed
release transaction handle
external port call with exact persisted attempt/correlation
UoW-B: reload exact owners + fresh Version + persisted attempt
       map finite outcome to typed observation
       owner.apply_observation(...)
       stage owner group + audit/relay/marker/stored relation
       commit confirmed
unknown at either commit -> exact relation inspection;no blind external retry
```

适用：environment establishment/launch/inspect/release、handoff target delivery、publisher、redline investigation等。Capture collection若port无法证明side-effect-free，也按此模板；run/capture source truth不得因外呼失败回滚。

### 10.3 Await约束

| await类别 | 可否持有write UoW | 规则 |
|---|---:|---|
| 同一transaction repository read/write | 是 | 只能调用接收同一`&mut dyn SandboxUnitOfWork`的repository方法；不得调用未知外部依赖。 |
| trusted clock / local pure mapper | 是，但应在begin前取得可复用时点 | 不得在锁持有期间做可能阻塞的外部I/O。 |
| resolver/body-free source read | 否，默认在UoW前 | 若结果影响write，进入UoW后重验其source version/digest binding。 |
| backend/capture/handoff/publisher/investigation port | 否 | 调用前必须有committed recovery point；调用后新UoW。 |
| query read snapshot | 不使用write UoW | read snapshot owner由`7R-04`定义；全程write set为0。 |

禁止把database transaction handle传给external adapter，也禁止adapter callback访问repository。这样可避免长事务、未知锁持有和provider重入application truth。

---

## 11. Commit / Rollback / Unknown Recovery

### 11.1 可见性矩阵

| 终结状态 | truth/record | cursor | stored result | application可返回 |
|---|---|---|---|---|
| commit confirmed | 整组可见 | 已提交并可引用 | 完整relation可读 | fresh success/rejected/degraded/failed surface。 |
| definite rollback | 整组不可见 | 不可见 | 不可见 | 原typed error；不能返回fresh stored ref。 |
| rollback failed/unknown | 不得推断可见或不可见 | 不得暴露 | 不得recompute | consistency/internal hold。 |
| commit unknown | 只能经exact relation inspection确定 | cursor不单独证明commit | missing不能触发重算 | `Committed`、`FullyAbsent`、`Indeterminate`三分支内部处置。 |

### 11.2 Commit-unknown inspection rule

本批不定义generic repository inspector方法；`7R-02B~D`必须为每个原子owner group提供typed relation读取面。共同算法固定为：

```text
freeze original operation_name + request digest + idempotency key
freeze every pre-generated truth/attempt/audit/relay/stored identity
open read-only committed snapshot
read exact idempotency/stored relation and every mandatory group member
validate kind, lineage, Version/current-binding, cursor and completeness
  full group present and valid -> Committed(original stored outcome)
  every group member and reservation provably absent -> FullyAbsent
  partial, corrupt, unavailable, mixed generation or ambiguous -> Indeterminate
```

| inspection result | allowed next step | forbidden |
|---|---|---|
| `Committed` | replay original stored surface / original attempt observation | rebuild output、new identity、repeat external call。 |
| `FullyAbsent` | 上层可发起显式新调用；是否复用same key由`7R-02D/Step 13`定义 | 在同一栈帧静默重跑并报告原调用成功。 |
| `Indeterminate` | quarantine/fail-closed/manual reconciliation；保留safety hold | repair index、delete partial rows、猜commit、报告success。 |

### 11.3 Duplicate/replay/no-write交接

| path | UoW/ID/clock | repository obligation owner |
|---|---|---|
| fresh Command/Consumer/Job | reserve + write UoW；只分配必要identity；clock按flow读取 | `7R-02B~D`。 |
| completed duplicate | zero business write；zero new identity；zero external call；原stored time/ref原样返回 | `7R-02D` typed save/get symmetry。 |
| duplicate missing/wrong stored result | `DuplicateMissingResult`；不得重跑 | `7R-02D` relation integrity。 |
| 13 Query | zero write UoW；zero identity；zero truth/reference cursor；只读clock若access/age规则必需 | `7R-04` exact reader/index。 |
| ordinary observability hook failure | 不回滚主体truth；safe diagnostic only | `7R-03C/05` L2 contract。 |
| audit/relay mandatory append failure | 若属于同一原子write group则commit前整组失败；publisher失败不回滚source | `7R-02C` append surface。 |

---

## 12. Failure Mapping 与 Safe Defaults

| failure | exact owner | application mapping | safe default |
|---|---|---|---|
| begin unavailable | UoW manager | `PortUnavailable` | write set 0；可在条件变化后新调用。 |
| identity allocator unavailable | allocator | `PortUnavailable` | 不创建fallback/string identity；由显式新调用重走preflight。 |
| generated identity invalid/collision | allocator / named constructor | `InternalInvariantViolation` | 冻结当前flow，不通过retry换一个identity掩盖缺陷。 |
| trusted clock unavailable | clock port | `PortUnavailable` | safety transition不执行；不得用system default。 |
| trusted clock invalid | clock port | `InternalInvariantViolation` | 拒绝该timestamp；不得修剪、排序或回退本地时间。 |
| object not found | exact repository | owner-specific not-found / `ReferenceUnresolved` | 不scan latest、不create replacement，除非flow明确create。 |
| `VersionConflict` | mutable repository CAS | existing detail | 旧decision作废；完整重读。 |
| unique conflict | repository owner | duplicate-equivalent或integrity conflict | 不last-write-wins。 |
| commit unknown | UoW manager | internal consistency route | exact inspection；不返回success。 |
| rollback failure | UoW manager | internal consistency route | 不宣称staged rows absent。 |
| external side-effect unknown | external port | existing infra/application unknown route | inspect exact persisted attempt；不blind retry。 |

本表只给一致性分支，不扩写普通审计存储、日志模板或测试矩阵。security redline、release、handoff、launch和capture partial属于L1，不能用普通`PortUnavailable`后直接放行；必须保留各自Step 6 safety truth/attempt/hold。

---

## 13. Fake / Durable Parity

| parity dimension | durable要求 | fake要求 |
|---|---|---|
| transaction visibility | commit前不可见；rollback整组不可见 | 不能每次save立即暴露到共享map。 |
| `Version` | exact read返回；CAS single-winner | 单调且per-owner；可注入conflict，禁止last-write-wins。 |
| identity | 54个exact method、named kind、non-empty、collision-free | deterministic sequence按method隔离；可注入collision error，不能固定同一ref。 |
| clock | trusted core `Timestamp` | 可控advance/freeze；不自动随读取次数漂移。 |
| cursor | staged complete后分配；commit后可见 | truth/reference序列分离且单调；rollback不消费为visible cursor。 |
| commit | 可返回confirmed/definite failure/unknown | 三分支均可注入；unknown不能默认转confirmed。 |
| rollback | confirmed/failure/unknown可区分 | failure/unknown可注入；不能静默清map并报成功。 |
| duplicate | exact stored surface replay | 不从current truth重建result。 |
| external await | write transaction关闭后调用 | fake external port也断言无active write UoW。 |

fake parity是契约，不是测试结果。本批未运行Rust compile、unit test、integration test或数据库验证。

---

## 14. `7R-02B~D` Handoff

| next batch | 必须消费本批什么 | 必须输出 | 不得重新决定 |
|---|---|---|---|
| `7R-02B` mutable truth repository | `Versioned<T>`、core `Version`、same-UoW、CAS loser、external split | 20/20 exact get/create/save/CAS、owner error、same-UoW group | old version wrapper、generic save、repository transition。 |
| `7R-02C` immutable/audit/relay | identity分类、append visibility、cursor和publisher no-rollback | 13/13 get/create/append、replacement/source/correlation、audit/relay pending/attempt surface | immutable update、post-commit event append、publisher current-truth rebuild。 |
| `7R-02D` idempotency/stored/index | fresh/duplicate/commit-unknown、stored surface identity、query no-write | reserve/complete/fail、typed save/get、duplicate replay、bounded necessary indexes | channel入key、missing result重跑、latest/all scan。 |

`REF-001`不能由`7R-02A`单独关闭。本批只关闭其基础子条件：current UoW/clock/identity/version contract不再使用opaque ref或旧version wrapper；必须等待`7R-02B~D`的全部repository签名、stored/index join差集为0后才能标记resolved。

---

## 15. 静态闭合门禁与负向事实

| check | expected | 当前设计结果 |
|---|---:|---:|
| UoW owner / manager owner | 1 / 1 | application唯一owner。 |
| trusted clock return type | core `Timestamp` | 1/1；local `SandboxInstant` 0。 |
| optimistic token | core `Version` | 1/1；current `SandboxRepositoryVersion` 0。 |
| committed cursor family | truth/reference 2 | 2；类型不可互换。 |
| cursor checked constructor | 2 / 2 | `try_from_sequence`跨crate可调用；只有UoW拥有分配权，constructor不证明commit。 |
| identity source class | 7 | application-generated、owner-group、store-generated、external-preserved、entry-preserved、runtime-preserved、transient-no-id。 |
| exact identity allocation methods | 54 | 52 named object refs + handoff/relay attempt refs；generic allocator method 0。 |
| canonical 52-ref allocator join | 52 / 52 | 与Step 6 `define_sandbox_object_ref!`集合差集0；另有2个support attempt ref。 |
| cross-crate checked constructor | 7 / 7 | transaction、versioned snapshot、commit receipt、2个commit error carrier、2个cursor均可由独立infra crate经唯一入口构造。 |
| query write/ID/cursor allocation | 0/0/0 | contract为0/0/0。 |
| external call with active write UoW | 0 | contract为0；pre/post UoW split。 |
| commit unknown success mapping | 0 | contract为0；三分检查。 |
| CAS conflict reload-latest old decision | 0 | 明确禁止。 |
| generic/opaque ID allocator output | 0 | 只返回core `ResourceRef`并立即checked-wrap；无generic repository key。 |
| new upstream L1/L2 blocker | 0 | 0。 |
| formal `03~07` / skeleton / code modification | 0 | 0。 |
| compile/test/run/evidence/acceptance claim | 0 | 0。 |

静态闭合只证明本文契约集合自洽，不证明实现、编译、测试、数据库或runtime行为。

---

## 16. 回填草稿与进入下一批条件

未来Step 7正式回填只装配以下current结论：

| 正式位置 | 回填结论 |
|---|---|
| application port | UoW manager/handle、trusted clock、typed identity allocator与`Versioned<T>`唯一owner。 |
| transaction consistency | no-external-await、pre-call recovery commit、post-call fresh UoW、rollback和commit-unknown三分检查。 |
| identity/version | named ref分配/保留分类、core `Version`唯一CAS token、两类committed cursor隔离。 |
| infra parity | durable/fake必须同样支持transaction visibility、CAS、clock、identity、cursor和unknown failure。 |

进入`7R-02B`前必须满足：

1. 本文`§5~§15`完成结构/负向扫描，Rust fence parity为0。
2. flow、control、project ledger、implementation ledger和`/tmp`计划恢复点一致。
3. `S7-02A`从`[~]`改为`[x]`；本轮不把`S7-02B`标为执行中，也不写其正文。
4. 不设置`S7-G02`外部停审；下一次继续时才把`S7-02B`从`[ ]`改为唯一`[~]`并进入下一批。
5. 若发现Step 6 typed ref或object identity本身缺失，必须重开Step 6；不得在repository port临时补类型。

```text
current_document = 03-详细设计.md
current_step = Step 7 regression / 7R-02A completed_ready_for_7R_02B
current_batch = UoW / trusted clock / typed ID / core Version
batch_status = completed
gate_status = internal_batch_completed
next_allowed_action = start_7R_02B
ref_blocker = in_progress_7r_02a_wait_7r_02b_02d
step_8 = blocked_by_step_7_regression
formal_03_07 = historical_reviewed_revalidation_pending
implementation = CB-SBX-01A blocked / wait_design
real_test_execution = not_started
real_evidence_created = no
commit_required = no
```

---

## 17. Failure、control与cleanup repository exact traits

```rust
/// 持久化Sandbox formal failure classification；不从adapter error或status文本自行分类。
pub trait FailureClassificationRepository: Send + Sync {
    /// 按exact failure ref读取完整classification与同snapshot Version。
    async fn get_failure_classification_with_version(
        &self,
        failure_ref: &FailureClassificationRef,
        uow: &mut dyn SandboxUnitOfWork,
    ) -> Result<Versioned<FailureClassification>, FailureClassificationRepositoryError>;

    /// insert-if-absent stage由factory起始且已完成本UoW合法transition的完整classification。
    async fn create_failure_classification(
        &self,
        classification: &FailureClassification,
        uow: &mut dyn SandboxUnitOfWork,
    ) -> Result<(), FailureClassificationRepositoryError>;

    /// CAS stage由classification/terminal/supersede transition形成的完整对象。
    async fn save_failure_classification(
        &self,
        classification: &FailureClassification,
        expected_version: Version,
        uow: &mut dyn SandboxUnitOfWork,
    ) -> Result<(), FailureClassificationRepositoryError>;
}

/// 持久化Sandbox control fact；不执行backend terminate或release。
pub trait ControlFactRepository: Send + Sync {
    /// 按exact control ref读取完整fact与同snapshot Version。
    async fn get_control_fact_with_version(
        &self,
        control_ref: &ControlFactRef,
        uow: &mut dyn SandboxUnitOfWork,
    ) -> Result<Versioned<ControlFact>, ControlFactRepositoryError>;

    /// insert-if-absent stage由factory起始且已完成本UoW合法transition的完整fact。
    async fn create_control_fact(
        &self,
        control: &ControlFact,
        uow: &mut dyn SandboxUnitOfWork,
    ) -> Result<(), ControlFactRepositoryError>;

    /// CAS stage由complete/fail/attach-failure transition形成的完整fact。
    async fn save_control_fact(
        &self,
        control: &ControlFact,
        expected_version: Version,
        uow: &mut dyn SandboxUnitOfWork,
    ) -> Result<(), ControlFactRepositoryError>;
}

/// 持久化isolation environment lease lifecycle；不拥有backend lease实现。
pub trait LeaseRecordRepository: Send + Sync {
    /// 按exact lease ref读取完整record与同snapshot Version。
    async fn get_lease_with_version(
        &self,
        lease_ref: &LeaseRecordRef,
        uow: &mut dyn SandboxUnitOfWork,
    ) -> Result<Versioned<LeaseRecord>, LeaseRecordRepositoryError>;

    /// insert-if-absent stage由`open`形成的Active lease record。
    async fn create_lease(
        &self,
        lease: &LeaseRecord,
        uow: &mut dyn SandboxUnitOfWork,
    ) -> Result<(), LeaseRecordRepositoryError>;

    /// CAS stage由expiring/expired/orphan/released transition形成的完整lease。
    async fn save_lease(
        &self,
        lease: &LeaseRecord,
        expected_version: Version,
        uow: &mut dyn SandboxUnitOfWork,
    ) -> Result<(), LeaseRecordRepositoryError>;
}

/// 持久化一个exact orphan recovery attempt；不扫描backend或latest handle。
pub trait OrphanRecoveryRecordRepository: Send + Sync {
    /// 按exact orphan record ref读取完整attempt与同snapshot Version。
    async fn get_orphan_recovery_with_version(
        &self,
        orphan_record_ref: &OrphanRecoveryRecordRef,
        uow: &mut dyn SandboxUnitOfWork,
    ) -> Result<Versioned<OrphanRecoveryRecord>, OrphanRecoveryRecordRepositoryError>;

    /// insert-if-absent stage由`suspect`形成的完整recovery record。
    async fn create_orphan_recovery(
        &self,
        recovery: &OrphanRecoveryRecord,
        uow: &mut dyn SandboxUnitOfWork,
    ) -> Result<(), OrphanRecoveryRecordRepositoryError>;

    /// CAS stage由confirm/recovering/recovered/failed transition形成的完整record。
    async fn save_orphan_recovery(
        &self,
        recovery: &OrphanRecoveryRecord,
        expected_version: Version,
        uow: &mut dyn SandboxUnitOfWork,
    ) -> Result<(), OrphanRecoveryRecordRepositoryError>;
}

/// 持久化cleanup readiness与release authorization truth；不直接调用release adapter。
pub trait CleanupGuardRepository: Send + Sync {
    /// 按exact cleanup guard ref读取完整guard与同snapshot Version。
    async fn get_cleanup_guard_with_version(
        &self,
        cleanup_guard_ref: &CleanupGuardRef,
        uow: &mut dyn SandboxUnitOfWork,
    ) -> Result<Versioned<CleanupGuard>, CleanupGuardRepositoryError>;

    /// insert-if-absent stage由open起始且已完成本UoW合法transition的完整guard。
    async fn create_cleanup_guard(
        &self,
        guard: &CleanupGuard,
        uow: &mut dyn SandboxUnitOfWork,
    ) -> Result<(), CleanupGuardRepositoryError>;

    /// CAS stage由decision/authorization/failure/confirmation transition形成的完整guard。
    async fn save_cleanup_guard(
        &self,
        guard: &CleanupGuard,
        expected_version: Version,
        uow: &mut dyn SandboxUnitOfWork,
    ) -> Result<(), CleanupGuardRepositoryError>;
}

/// 持久化security redline containment truth；任何unknown都不得写成Released。
pub trait RedlineContainmentRepository: Send + Sync {
    /// 按exact containment ref读取完整truth与同snapshot Version。
    async fn get_redline_containment_with_version(
        &self,
        containment_ref: &RedlineContainmentRef,
        uow: &mut dyn SandboxUnitOfWork,
    ) -> Result<Versioned<RedlineContainment>, RedlineContainmentRepositoryError>;

    /// insert-if-absent stage由`detect`形成的Detected containment。
    async fn create_redline_containment(
        &self,
        containment: &RedlineContainment,
        uow: &mut dyn SandboxUnitOfWork,
    ) -> Result<(), RedlineContainmentRepositoryError>;

    /// CAS stage由contain/handoff/preservation/investigation/release/terminal transition形成的完整truth。
    async fn save_redline_containment(
        &self,
        containment: &RedlineContainment,
        expected_version: Version,
        uow: &mut dyn SandboxUnitOfWork,
    ) -> Result<(), RedlineContainmentRepositoryError>;
}
```

这些repository不得提供`release_*`、`terminate_*`、`classify_*`、`repair_*`等业务动词。业务动词只属于
Step 6对象或Step 7 application facade；repository方法固定为exact persistence primitive。特别是cleanup
release外呼前必须先以`save_cleanup_guard`持久化authorization recovery point，外呼后用fresh UoW分别读取
guard、handle、lease和optional orphan record的新Version，再提交完整completion/failure group。

---

## 18. Projection、derived、relay与idempotency root traits

```rust
/// 持久化Sandbox read projection lifecycle root；public Query不调用create/save。
pub trait SandboxReadProjectionRepository: Send + Sync {
    /// 按exact projection ref读取完整root与同snapshot Version。
    async fn get_read_projection_with_version(
        &self,
        projection_ref: &SandboxReadProjectionRef,
        uow: &mut dyn SandboxUnitOfWork,
    ) -> Result<Versioned<SandboxReadProjection>, SandboxReadProjectionRepositoryError>;

    /// insert-if-absent stage由create factory形成的完整projection root。
    async fn create_read_projection(
        &self,
        projection: &SandboxReadProjection,
        uow: &mut dyn SandboxUnitOfWork,
    ) -> Result<(), SandboxReadProjectionRepositoryError>;

    /// CAS stage由stale/rebuild/degraded/unavailable transition形成的完整root。
    async fn save_read_projection(
        &self,
        projection: &SandboxReadProjection,
        expected_version: Version,
        uow: &mut dyn SandboxUnitOfWork,
    ) -> Result<(), SandboxReadProjectionRepositoryError>;
}

/// 持久化inspect/preview/trend derived lifecycle root；不写回core execution truth。
pub trait DerivedInspectPreviewTrendStateRepository: Send + Sync {
    /// 按exact derived state ref读取完整root与同snapshot Version。
    async fn get_derived_state_with_version(
        &self,
        derived_state_ref: &DerivedInspectPreviewTrendStateRef,
        uow: &mut dyn SandboxUnitOfWork,
    ) -> Result<Versioned<DerivedInspectPreviewTrendState>, DerivedInspectPreviewTrendStateRepositoryError>;

    /// insert-if-absent stage由source factory起始且已完成本UoW合法transition的完整derived root。
    async fn create_derived_state(
        &self,
        state: &DerivedInspectPreviewTrendState,
        uow: &mut dyn SandboxUnitOfWork,
    ) -> Result<(), DerivedInspectPreviewTrendStateRepositoryError>;

    /// CAS stage由stale/rebuild/failed/unavailable transition形成的完整root。
    async fn save_derived_state(
        &self,
        state: &DerivedInspectPreviewTrendState,
        expected_version: Version,
        uow: &mut dyn SandboxUnitOfWork,
    ) -> Result<(), DerivedInspectPreviewTrendStateRepositoryError>;
}

/// 持久化event relay mutable root；payload冻结、attempt与selection扩展由`7R-02C`拥有。
pub trait SandboxEventRelayRecordRepository: Send + Sync {
    /// 按exact relay record ref读取完整root与同snapshot Version。
    async fn get_event_relay_with_version(
        &self,
        relay_ref: &SandboxEventRelayRecordRef,
        uow: &mut dyn SandboxUnitOfWork,
    ) -> Result<Versioned<SandboxEventRelayRecord>, SandboxEventRelayRecordRepositoryError>;

    /// insert-if-absent stage从finalized draft形成的Pending relay root。
    async fn create_event_relay(
        &self,
        relay: &SandboxEventRelayRecord,
        uow: &mut dyn SandboxUnitOfWork,
    ) -> Result<(), SandboxEventRelayRecordRepositoryError>;

    /// CAS stage由attempt/delivery/dead-letter/integrity transition形成的完整root。
    async fn save_event_relay(
        &self,
        relay: &SandboxEventRelayRecord,
        expected_version: Version,
        uow: &mut dyn SandboxUnitOfWork,
    ) -> Result<(), SandboxEventRelayRecordRepositoryError>;
}

/// 持久化idempotency mutable root primitive；unique reservation与stored replay由`7R-02D`扩展。
pub trait SandboxIdempotencyRecordRepository: Send + Sync {
    /// 按exact idempotency ref读取完整root与同snapshot Version。
    async fn get_idempotency_record_with_version(
        &self,
        idempotency_ref: &SandboxIdempotencyRecordRef,
        uow: &mut dyn SandboxUnitOfWork,
    ) -> Result<Versioned<SandboxIdempotencyRecord>, SandboxIdempotencyRecordRepositoryError>;

    /// insert-if-absent stage由reserve起始且已完成本UoW合法transition的完整root；不替代unique claim。
    async fn create_idempotency_record(
        &self,
        record: &SandboxIdempotencyRecord,
        uow: &mut dyn SandboxUnitOfWork,
    ) -> Result<(), SandboxIdempotencyRecordRepositoryError>;

    /// CAS stage由mark-completed/mark-failed形成的完整root。
    async fn save_idempotency_record(
        &self,
        record: &SandboxIdempotencyRecord,
        expected_version: Version,
        uow: &mut dyn SandboxUnitOfWork,
    ) -> Result<(), SandboxIdempotencyRecordRepositoryError>;
}
```

本批只闭合relay/idempotency作为20个mutable status owner的root primitive。以下内容仍明确defer：

| deferred surface | owner | 本批禁止替代 |
|---|---|---|
| pending/retry relay selection、frozen payload lookup、attempt-before-call、attempt inspection | `7R-02C` | scan relay root、按status字符串筛选、publisher从current truth重建payload。 |
| `(operation_name, idempotency_key, request_digest)`唯一claim、duplicate/in-flight/conflict observation | `7R-02D` | 只按idempotency ref create、channel入unique key、AlreadyExists直接当duplicate。 |
| stored result typed save/get与completion relation | `7R-02D` | idempotency `Completed`先提交再补result、missing result重跑。 |
| public query/page/index | `7R-04` | entry直接调用本批UoW method、query begin write UoW。 |

`create_idempotency_record`只能由`7R-02D`的atomic reservation algorithm在取得正式unique claim后调用；
它不是对application service公开的“按ref随意reserve”入口。`save_idempotency_record(mark_completed)`必须与
matching immutable stored result在同一UoW stage，且完整business owner group也已stage；否则adapter应返回
`IntegrityViolation`并使整组不可提交。

---

## 19. Same-UoW mutable owner group contract

### 19.1 记号与执行规则

| 记号 | exact含义 |
|---|---|
| `C(root)` | 对本次operation预生成exact key执行对应`create_*`；同key已存在为`AlreadyExists`，不是update。 |
| `S(root@V)` | 对先前exact read所得root执行对应`save_*`，并消费该read同snapshot的core `Version`。 |
| `C?` / `S?` | 只有closed branch明确要求该owner时执行；branch条件来自Step 6 typed relation，不由repository猜。 |
| `S*(rows@V*)` | 对bounded、已知完整key set逐row保存；每个row携带自己的Version，任一失败整组rollback。 |
| `R(root)` | 在同一transaction snapshot exact读取但不stage；不得以read status反推另一个root的写入。 |
| `I-C` / `I-S` | idempotency root首次create / 后续CAS completion；unique claim、stored result与replay细节仍由`7R-02D`拥有。 |

每组的application实现按表中顺序完成domain factory/transition，再逐项调用exact repository method并传入
同一个`&mut dyn SandboxUnitOfWork`。表中顺序不是数据库表顺序，而是可审查的业务依赖顺序；adapter必须把
全部stage集中到一次commit。不存在`save_owner_group(group: Vec<_>)`、optional old version、generic object union或
repository callback。对于同为core `Version`的多个expectation，application变量必须以owner具名，例如
`boundary_version`、`handle_version`、`lease_version`；adapter还须按对象getter重新校验key，交换Version只能得到
`VersionConflict/IntegrityViolation`，不能碰巧覆盖另一root。

首次可见对象允许在同一尚未提交的UoW内由factory继续执行合法transition，再以`C(root)`提交最终完整shape。
例如intake可首次提交`Accepted` context，handoff opening可首次提交已绑定材料；这不等于upsert。只有已经存在于
committed snapshot的root才使用`S(root@V)`。

### 19.2 L1/L2 owner-group matrix

| group ID | owner operation / recovery point | mutable root write set | same-UoW non-mutable obligation owner | external split / failure rule |
|---|---|---|---|---|
| `MUT-G01` | intake resolution与accept/reject/unresolved收束 | `C(context)` + `C*(reference states)`；accepted分支`C?(environment identity)`；`I-C(final)` | resolutions、guard decisions、audit、relay/stored surface由`7R-02C/02D` | 每个显式source恰有一个reference-state candidate；resolver为body-free read；无external write side effect。任一relation缺失整组失败。 |
| `MUT-G02` | boundary establishment pre-call recovery | `I-C(Reserved)`；本批无business mutable root | immutable requirement、generation binding、attempt/correlation、audit由`7R-02C/02D/03` | commit confirmed后才能调用backend；commit unknown先检查原attempt/reservation，不调用backend。boundary尚未成为committed truth。 |
| `MUT-G03` | boundary finite outcome | `C(boundary)`；established分支`C?(handle)`+`C?(lease)`；`I-S` | immutable capability/decision、audit、relay/stored result | outcome UoW内先`require`再合法transition并首次提交完整boundary；partial handle也必须有typed recovery relation，不能丢弃。 |
| `MUT-G04` | run launch pre-call recovery | `C(run Preparing)`；`I-C(Reserved)` | launch correlation/permit basis、audit与recovery surface | commit confirmed后才launch；run/capture refs冻结，unknown不生成第二组identity。 |
| `MUT-G05` | run launch/completion/terminal observation | `S(run@run_version)`；formal failure时`C?/S?(failure@failure_version)`；`I-S` | typed observation、audit、relay/stored result | post-call完整重读；旧freshness/permit在CAS conflict后失效。 |
| `MUT-G06` | capture materialization after exact run collection | `C*(captured materials)`；`C(observability material)`；`I-C(final)` | immutable `CaptureFact`、audit、relay/projection marker、stored result | run terminal truth不回滚；capture group任一row失败则本次capture group全不可见。 |
| `MUT-G07` | handoff opening | `C(handoff aggregate)`；`S*(selected captured materials@V*)`；`S(observability material@V)`；`I-C(final)` | immutable ownership guard/decision、audit、relay/projection marker、stored result | 不调用delivery port；complete progress内嵌aggregate，partial opening禁止。 |
| `MUT-G08` | handoff target attempt recovery | `S(handoff aggregate@handoff_version)`；`I-C(Reserved)`或保留existing reservation | exact attempt/correlation、audit由`7R-02C/02D` | `Attempting`与attempt ref先commit，之后才能外呼；unknown按同attempt inspect。 |
| `MUT-G09` | handoff target observation | `S(handoff aggregate@fresh_version)`；`S*(affected captured materials@V*)`和/或`S?(observability material@V)`；terminal failure时`C?/S?(failure@V)`；`I-S` | receipt observation、audit、relay/cleanup marker、stored receipt | post-call fresh read；一个target失败不回滚capture、opening或其它已提交target。 |
| `MUT-G10` | control intent/fact recovery | `C(control fact)`；需要external effect时`I-C(Reserved)`，否则`I-C(final)` | immutable conflict guard/decision、effect correlation、audit/stored surface | external effect前fact必须commit；duplicate/conflict fact不得触发effect。 |
| `MUT-G11` | control effect completion | `S(control fact@control_version)`；target需要时`S?(run@V)`/`S?(boundary@V)`；failure relation`C?/S?(failure@V)`；`I-S` | typed effect observation、audit、relay/stored result | post-call fresh owner group；unknown保持accepted effect recovery，不报告completed。 |
| `MUT-G12` | formal failure classification / impact | `C/S(failure@V)`；impact要求时`S?(run@V)`+`S?(boundary@V)`；`I-C/S` | typed source markers、audit、relay/stored result | 无owner proof不改run/boundary；adapter error不能直接形成classification。 |
| `MUT-G13` | cleanup readiness evaluation | first `C(cleanup guard)`；existing `S(cleanup guard@V)`；active block变化时`S?(handoff@V)`；`I-C/S` | evidence snapshot、coverage、decision、audit/relay/stored result | 只有`evaluate_cleanup_readiness`可首次create guard；后续安全kernel只save existing；只形成permission/block truth，不调用release；unknown保持blocked/pending。 |
| `MUT-G14` | cleanup release pre-call recovery | `S(cleanup guard@guard_version)`；`S(handle@handle_version)`进入ReleasePending；`S?(orphan@V)`进入Recovering；`I-C/S(Reserved)` | release authorization/correlation、audit与recovery surface | commit confirmed后才release；lease尚不写Released，authorization unknown不得换identity。 |
| `MUT-G15` | cleanup release confirmation/failure | `S(cleanup guard@fresh_guard_version)`；`S(handle@fresh_handle_version)`；`S?(lease@V)`；existing `S?(orphan@V)`；`S(boundary@V)`；允许closure时`S?(context@V)+S?(identity@V)`；`I-S` | completion/failure basis、fresh complete redline coverage、audit/relay/stored result | 本组不得首次create orphan；所有owner同一UoW；missing/partial/unknown绝不写Released/Closed。 |
| `MUT-G16` | redline detection、stop-new-use与containment recovery | `C/S(redline@V)`；`C/S(failure@V)`；active run时`S?(run@V)`；`S(boundary@V)`；必要时`S?(cleanup/handoff@V)`；`I-C/S` | signal/guard/decision/preservation snapshot、audit/relay/stored result | termination需外呼时先提交Detected与correlation；unknown保持strict hold。 |
| `MUT-G17` | tracked reference initial/refresh/stale | intake `MUT-G01`执行`C*(reference states)`；本组只执行existing `S(reference state@V)`；`I-C/S` | resolver observation、audit/stored receipt、reference cursor linkage | refresh与三个reference consumer遇到missing只报selection/index integrity；不得首次补建；L2普通source unavailable不写假状态；forbidden body/identity race仍按L1 fail-closed。 |
| `MUT-G18` | lease/orphan reaper evaluation | `S(lease@lease_version)`；proof要求时`S?(handle@V)`；eligible new incident `C?(orphan)`或existing `S?(orphan@V)`；`I-C/S` | reaper marker、typed lifecycle observation、audit/stored item | 只有G18 eligible branch可首次create orphan；不执行release；Unavailable不确认orphan，Released observation不绕过cleanup。 |
| `MUT-G19` | relay publish attempt与observation | pre-call `S(relay@relay_version)`；post-call `S(relay@fresh_version)`；`I-C/S` | frozen payload、relay attempt、audit/stored report由`7R-02C/02D` | publisher失败不回滚source truth；attempt必须先commit，unknown按exact attempt inspect。 |
| `MUT-G20` | read projection create/rebuild | `FirstMaterialization: C(projection)`；`Existing: S(projection@V)`；`I-C/S` | exact source snapshot、attempt/marker、audit/stored item | first target必须来自formal projection target/index；maintenance不得由NotFound补建；Query无权调用，CAS loser不得套用旧completion。 |
| `MUT-G21` | derived state create/rebuild | `FirstMaterialization: C(derived state)`；`Existing: S(derived state@V)`；`I-C/S` | exact source snapshot/materialization result、audit/stored item | first target必须有formal source/materialization proof；maintenance不得由NotFound补建；不反写core truth，source incomplete只按owner method形成stale/degraded/unavailable。 |

`EvaluatePolicyExecution`、backend capability refresh与`RunSandboxReconciliation`的主体输出分别是immutable
snapshot/decision、immutable summary和immutable report/current-binding group；它们在本批的mutable slice只有
`SandboxIdempotencyRecord`。其完整create/replacement、binding、audit、relay和stored relation由`7R-02C/02D`
闭合，不能为了让本表“每行都有truth repository”而把immutable对象改成mutable root。

### 19.3 Group rollback与commit visibility

| stage result | mutable roots | non-mutable relations | allowed application result |
|---|---|---|---|
| all stage calls succeeded, commit confirmed | 全组在一个committed boundary可见；每个updated root获得新generation | 必须由`7R-02C/02D`证明同组完整 | fresh stored outcome；不能从stage success提前返回。 |
| any create/save failed before commit, rollback confirmed | 本组新root/transition全部不可见 | 本组append/result/cursor也全部不可见 | exact typed error。 |
| any create/save failed, rollback failed/unknown | 不得推断任一root absent或unchanged | 不得补写缺失relation | internal consistency hold。 |
| commit status unknown | 不得使用内存对象或expected Version推断结果 | 进入§21 mutable-slice inspection，再与`7R-02C/02D`证据合并 | 只有完整whole-group证明后才能replay；本批单独不报告success。 |
| CAS conflict | winner以committed snapshot为准；loser整组rollback | loser不得留下audit/relay/stored residue | `VersionConflict`；旧guard/observation/decision全部失效。 |

---

## 20. 42-callable mutable repository group join

本节把`7R-01A~D`的42个application callable逐项联接到§19的mutable owner group。这里的
`mutable group = none`只表示本批没有业务mutable root write，不表示该callable没有immutable、audit、relay、stored
result或index义务；这些义务继续由`7R-02C/02D/04`闭合。除13个Query外，fresh invocation都必须包含本次
idempotency root的`I-C/I-S`，但unique claim、完整stored surface和duplicate replay仍不得从本表反推实现。

### 20.1 10 Command join

| # | application method | mutable group | exact mutable repository slice | branch与事务约束 |
|---:|---|---|---|---|
| 1 | `open_controlled_execution_context` | `MUT-G01` | `C(context)` + `C*(reference states)`；accepted时`C(environment identity)`；`I-C(final)` | 每个显式source先得到typed state ref与finite observation；resolver只读；context、reference states、optional identity和后续non-mutable group一次提交。 |
| 2 | `establish_execution_boundary` | external branch `MUT-G02 -> MUT-G03`；no-call branch仅`MUT-G03` | pre-call仅`I-C(Reserved)`；outcome UoW `C(boundary)`+`C?(handle)`+`C?(lease)`+`I-S`；no-call final branch使用`I-C(final)` | 无side effect的pending/rejected closed branch在单UoW创建final boundary；可能创建backend资源时先提交G02 recovery relation，外呼后fresh UoW执行G03。 |
| 3 | `evaluate_policy_execution` | business mutable `none` | 仅`I-C(final)` | policy snapshot、action decisions和formal decision均immutable；不得为满足mutable表而创建可更新policy row。完整组等待`7R-02C/02D`。 |
| 4 | `start_controlled_execution_run` | `MUT-G04 -> MUT-G05` | pre-call `C(run Preparing)`+`I-C(Reserved)`；post-call `S(run@V)`+`C?/S?(failure@V)`+`I-S` | launch correlation先提交；外呼后重读run，旧permit和旧Version不得复用。 |
| 5 | `record_capture_result` | `MUT-G06` | `C*(captured materials)`+`C(observability material)`+`I-C(final)` | source run只读且已terminal；任一material失败使本次capture group整组不可见，不回滚既有run。 |
| 6 | `open_material_handoff` | `MUT-G07` | `C(handoff)`+`S*(selected materials@V*)`+`S(observability material@V)`+`I-C(final)` | opening不外呼delivery；aggregate含完整progress，禁止partial opening。 |
| 7 | `submit_sandbox_control` | `MUT-G10 -> MUT-G11` | fact阶段`C(control)`+`I-C`；需要effect时completion阶段`S(control@V)`+`S?(run@V)`/`S?(boundary@V)`+`C?/S?(failure@V)`+`I-S` | duplicate/conflict在G10形成final fact且不外呼；accepted effect必须先提交recovery fact，再由fresh G11收束。 |
| 8 | `classify_sandbox_failure` | `MUT-G12` | `C/S(failure@V)`+`S?(run@V)`+`S?(boundary@V)`+`I-C/S` | create或推进由exact pending selector决定；没有impact proof时run/boundary write均为0。 |
| 9 | `evaluate_cleanup_readiness` | `MUT-G13` | `C/S(cleanup guard@V)`+`S?(handoff@V)`+`I-C/S` | 只保存permission/block truth，不调用release，不写handle/lease Released。 |
| 10 | `record_redline_containment` | `MUT-G16` | `C/S(redline@V)`+`C/S(failure@V)`+`S?(run@V)`+`S(boundary@V)`+`S?(cleanup@V)`+`S?(handoff@V)`+`I-C/S` | stop-new-use与safety truth同组；后续investigation不在此命令伪造完成，任何unknown保持strict hold。 |

Command中的`C/S`不是upsert：closed input selector、exact preflight和Step 6 factory决定本次是create还是save，
application必须调用对应具名method。`MUT-G02 -> G03`、`G04 -> G05`、`G10 -> G11`中的箭头表示由external
side effect隔开的两个已提交事务，不表示一个UoW跨await。

### 20.2 13 Query zero-write join

| # | application method | committed mutable source可能性 | mutable group / write method count |
|---:|---|---|---:|
| 1 | `get_sandbox_execution_status` | context、identity、boundary、run、failure、cleanup、redline和projection的checked read source | `none / 0` |
| 2 | `get_boundary_status` | boundary、handle和lease的exact/current checked read source | `none / 0` |
| 3 | `get_policy_decision_summary` | context/boundary只作lineage source；policy主体immutable | `none / 0` |
| 4 | `get_capture_summary` | run、captured material与observability material只读 | `none / 0` |
| 5 | `get_material_handoff_status` | handoff aggregate、material与observability material只读 | `none / 0` |
| 6 | `get_failure_control_status` | failure与control bounded merged read source | `none / 0` |
| 7 | `get_cleanup_readiness` | cleanup、handle、lease、orphan、handoff和redline只读 | `none / 0` |
| 8 | `get_redline_containment_status` | redline及matching lineage owners只读 | `none / 0` |
| 9 | `get_sandbox_read_projection` | projection root只读 | `none / 0` |
| 10 | `get_derived_inspect_preview_trend` | derived state只读 | `none / 0` |
| 11 | `get_backend_capability_comparison` | capability summaries为immutable；不得更新reference或boundary | `none / 0` |
| 12 | `get_sandbox_reconciliation_report` | report/current binding均由read contract读取，不修复source truth | `none / 0` |
| 13 | `get_sandbox_audit_trace` | immutable trace page；不追加read audit | `none / 0` |

上述13行都必须经过`7R-04A`定义的access-first committed read snapshot，而不是调用本批write UoW执行
`create_*`或`save_*`。Query的`SandboxIdempotencyRecordRepository`调用数、identity分配数、truth/reference cursor
分配数和external side-effect数均为0；读取发现stale、missing或corrupt时也不得进入`MUT-G17/G20/G21`修复。

### 20.3 9 Consumer join

| # | application method | mutable group | exact mutable repository slice |
|---:|---|---|---|
| 1 | `consume_caller_context_reference_changed` | `MUT-G17` | `S(reference state@V)`+`I-C/S`；只将matching state标为stale。 |
| 2 | `consume_policy_summary_changed` | `MUT-G17` | `S(reference state@V)`+`I-C/S`；immutable policy snapshot不原地修改。 |
| 3 | `consume_backend_capability_summary_changed` | `MUT-G17` | `S(reference state@V)`+`I-C/S`；boundary truth不反写。 |
| 4 | `consume_isolation_backend_lifecycle_signal` | closed branch `MUT-G15`或`MUT-G18` | `ReleaseConfirmed`走G15 existing-only cleanup completion owner set；`ObservedPresent/Conflicted`有proof时走G18 lease/handle/orphan set，且仅G18 eligible branch允许`C?(orphan)`；`Unavailable`业务owner write为0，仅保存后续完整receipt relation。 |
| 5 | `consume_material_handoff_status_changed` | `MUT-G09` | `S(handoff@V)`+`S*(affected captured materials@V*)`+`C?/S?(failure@V)`+`I-S`。 |
| 6 | `consume_observability_handoff_status_changed` | `MUT-G09` | `S(handoff@V)`+`S(observability material@V)`+`C?/S?(failure@V)`+`I-S`。 |
| 7 | `consume_sandbox_control_requested` | `MUT-G10` | `C(control fact)`+`I-C(final/reserved)`；consumer只落fact与effect correlation，不在本调用执行G11 effect。 |
| 8 | `consume_investigation_handoff_status_changed` | `MUT-G16` | `S(redline@V)`+`S?(cleanup@V)`+`I-C/S`；只有strict guard decision允许release block或terminal transition。 |
| 9 | `consume_sandbox_truth_relay_feedback` | `MUT-G19` | `S(relay@V)`+`I-C/S`；只应用matching active attempt observation，不回写original source truth。 |

Consumer的source event identity与idempotency relation由`7R-02D`证明；本批repository不得按topic、arrival time或
status扫描owner。普通projection marker或diagnostic失败属于L2，不得扩大上述mutable set；release、handoff、redline、
relay active-attempt完整性会改变安全结论，因此仍按L1 group fail closed。

### 20.4 10 Job join

| # | application method | mutable group | exact mutable repository slice与粒度 |
|---:|---|---|---|
| 1 | `publish_sandbox_event_relay` | `MUT-G19` | pre/post-call分别`S(relay@V)`；attempt-before-publish与matching observation是L1一致性约束。 |
| 2 | `refresh_sandbox_reference_states` | `MUT-G17` | resolver外呼后fresh `S(reference state@V)`；普通维护按L2粒度，参与launch安全判断时fail closed。 |
| 3 | `refresh_backend_capability_summaries` | business mutable `none` | summary与current binding为immutable replacement；本批只有invocation idempotency root，细节归`7R-02C/02D`。 |
| 4 | `retry_pending_material_handoffs` | `MUT-G08 -> MUT-G09` | pre-call `S(handoff@V)`建立attempt；post-call `S(handoff@V)`+`S*(materials@V*)`/`S?(observability@V)`+`C?/S?(failure@V)`。 |
| 5 | `run_lease_orphan_reaper` | `MUT-G18` | `S(lease@V)`+`S?(handle@V)`+`C?(orphan)`或`S?(orphan@V)`，由formal incident absence/existing proof二选一；不调用release。 |
| 6 | `evaluate_pending_cleanup_guards` | `MUT-G13` | 只`S(cleanup guard@V)`；不得补造guard、授权release或写completion basis。 |
| 7 | `maintain_redline_containment_handoffs` | `MUT-G16` | pre-call preservation `S(redline@V)`；matching observation后fresh `S(redline@V)`+`S?(cleanup@V)`；unknown不重发。 |
| 8 | `rebuild_sandbox_read_projections` | `MUT-G20` | formal target proof分出`FirstMaterialization`或`Existing`；前者`C(projection)`，后者start/completion分别`S(projection@V)`；NotFound不是first proof，不反写core truth。 |
| 9 | `maintain_derived_inspect_preview_trend` | `MUT-G21` | formal target/source proof分出`FirstMaterialization`或`Existing`；前者`C(derived state)`，后者start/completion分别`S(derived state@V)`；builder failure不创建core failure。 |
| 10 | `run_sandbox_reconciliation` | business mutable `none` | report、finding与current binding是immutable materialization group；本批只有invocation idempotency root，完整writer归`7R-02C/02D`。 |

前九个paged Job的每个item都使用自己的exact Version和branch-local group，不能把一页对象打包成一个generic
repository save。Job invocation/report finalization、selection index和stored report归`7R-02D/04`。L2维护只需要
明确owner、CAS、no-repair和safe default，不在本批扩写调度、日志、metric或运维存储schema；G08/G09、G16、G18、
G19涉及external attempt或安全truth时保留L1完整事务粒度。

### 20.5 Callable coverage结论

| family | expected | mapped | business mutable group none | idempotency mutable write |
|---|---:|---:|---:|---:|
| Command | 10 | 10 | 1 (`evaluate_policy_execution`) | fresh 10/10；exact relation待`7R-02D` |
| Query | 13 | 13 | 13 | 0/13 |
| Consumer | 9 | 9 | branch-level no-op only | fresh 9/9；exact relation待`7R-02D` |
| Job | 10 | 10 | 2 (capability refresh、reconciliation) | fresh 10/10；exact relation待`7R-02D` |
| **total** | **42** | **42** | **16 callable-level** | **29 write callable** |

`mapped=42`只证明本批mutable repository slice没有孤儿 callable；不能据此声明42个whole write group已闭合。
每个非Query callable仍要与`7R-02C` non-mutable/audit/relay relation及`7R-02D` idempotency/stored/index relation
做同一UoW join。Query exact reader则由`7R-04A`闭合，不能直接注入上述19个write repository绕过access decision。

---

## 21. Commit-unknown mutable-slice inspection

### 21.1 Inspection plan与snapshot纪律

application在原write UoW commit前冻结branch-specific mutable inspection plan；plan不是public DTO、repository key或
durable success receipt，只是恢复协调器的typed输入。它必须包含：

1. exact operation与§19 group ID集合；
2. 每个create target的具名repository、exact typed key和原本准备提交的完整candidate object；
3. 每个update target的具名repository、exact typed key、原committed object、原core `Version`和完整candidate object；
4. 本分支实际存在的optional member集合；未选中的`C?/S?`不得在检查时临时加入；
5. 本次idempotency root作为create或update target的同一类snapshot；stored result、audit、relay与immutable relation另由
   `7R-02C/02D`计划持有。

恢复协调器只能执行以下固定算法：

```text
freeze plan before original commit
  -> begin fresh SandboxUnitOfWork
  -> allocate no identity / clock / cursor; call no external port
  -> for every frozen target, call its exact get_*_with_version in the same UoW
  -> stage no create/save/append
  -> rollback the read-only UoW to close it
  -> classify the complete snapshot only after close succeeds
```

本路径不是Query，不经过public access surface；它复用repository已定义的19个exact get method，因此不新增generic
inspector或第58个repository method。所有read必须共享同一个fresh UoW snapshot。begin/read/close任一步
`Unavailable`、`IntegrityViolation`、rollback failed/unknown，或者adapter无法证明读取来自一个一致committed snapshot，
结果一律为`Indeterminate`。检查UoW严禁stage write或分配cursor；若fake/durable观察到write set非零，按
`InternalInvariantViolation`处理。

### 21.2 Per-target判定

| target class | committed-candidate match | fully-absent match | 其它结果 |
|---|---|---|---|
| create target | exact get返回对象与冻结candidate逐字段相等，且typed key/object getter relation有效；返回Version为合法committed generation | exact get只返回该repository的`NotFound` | same key不同对象、wrong lineage、invalid Version、Unavailable或IntegrityViolation均`Indeterminate` |
| update target | exact get返回对象与冻结candidate逐字段相等，且current Version不同于原Version | exact get返回对象与原committed object逐字段相等，且current Version等于原Version | NotFound、对象/Version只匹配一半、更新后又推进、回退形状、wrong lineage或读取失败均`Indeterminate` |

update plan在commit前必须验证`candidate != original`；没有字段变化的业务NoOp不得调用`save_*`。检查器不能假定
store生成的next Version数值，也不能用`Version + 1`判断提交；只比较“仍为原snapshot”或“已出现冻结candidate”。
create target找到相同key但不同candidate不能解释为`AlreadyExists`并自动重跑，因为这可能是identity collision、并发写或
损坏relation。

### 21.3 Mutable-slice三分结果

| result | exact条件 | allowed handoff | forbidden action |
|---|---|---|---|
| `AllCandidateMatched` | 同一snapshot中所有create和update target均满足committed-candidate match | 把mutable证据交`7R-02C/02D` whole-group inspector继续合并 | 单独返回success、重建stored result、补写audit/relay/index。 |
| `FullyAbsent` | 同一snapshot中所有create target均NotFound，所有update target均保持原object+原Version | 把absence证据交whole-group inspector；只有全部non-mutable/reservation relation也absent才允许上层显式新调用 | 在当前栈帧静默重跑、复用旧external observation、报告原调用成功。 |
| `Indeterminate` | 任一target为partial/mixed/concurrent/missing-update/corrupt/unavailable，或snapshot/close无法证明 | quarantine/fail-closed并进入manual/reconciliation owner | 删除partial row、覆盖winner、猜测commit、产生新identity或再次external call。 |

empty mutable plan非法：13 Query不会进入commit-unknown write恢复；其余29个write callable至少包含idempotency root。
immutable-only business callable也不能把idempotency candidate match当作whole-group成功，因为immutable/stored relation可能
half-commit。相反，mutable slice `FullyAbsent`也不能单独证明whole group未提交，audit、relay或stored relation仍可能可见。

### 21.4 Whole-group merge handoff

| mutable slice | `7R-02C` relation slice | `7R-02D` reservation/stored slice | whole-group result |
|---|---|---|---|
| all candidate matched | all mandatory candidate relation matched | matching reservation completed且完整stored surface matched | `Committed`，只replay原stored outcome |
| fully absent | all mandatory relation absent | reservation与stored relation均absent | `FullyAbsent`，交上层显式新调用 |
| 任一其它组合 | 任意 | 任意 | `Indeterminate` |

没有“mutable committed + stored missing时补一个result”的自动分支。若未来设计允许同reservation linkage修复，必须由
`7R-02D`给出独立、可证明不重做业务mutation的exact repair contract；本批不预授权该行为。

---

## 22. Durable / fake parity与adapter obligation

| parity dimension | durable adapter obligation | fake adapter obligation |
|---|---|---|
| exact key | schema主键与typed getter一致；composite material key两段均参与 | 使用相同typed key equality/hash；不得降格字符串map |
| snapshot read | 同一UoW内19类get观察一个committed transaction snapshot | 冻结per-UoW snapshot；后续并发写不能改变该snapshot的已读/未读结果 |
| create | insert-if-absent；存在时只返回`AlreadyExists` | 同样拒绝重复；不得create-as-overwrite或create-as-save |
| save CAS | exact key + expected core `Version` single winner | 可确定性注入conflict；同一Version并发save恰一winner |
| Version | commit后生成新的opaque generation；rollback不可见 | per-root单调opaque token；不得以timestamp、全局计数或对象hash代替语义 |
| staged visibility | commit前其它UoW不可见；本UoW可按adapter一致规则读自己的stage但不得伪装committed Version | 不得在每次create/save后立即修改共享map；stage存于transaction-local write set |
| multi-root atomicity | §19一个group任一constraint/CAS失败则整组零提交 | 可在第N个stage/commit validation注入失败并断言共享state零partial |
| rollback | confirmed后全部stage及cursor不可见 | 清除transaction-local stage；可注入failed/unknown且不得回报success |
| commit unknown | 保留实际durable状态，返回unknown且不泄露猜测 | 可分别模拟“实际已提交”和“实际未提交”unknown；application观察面均先是unknown |
| inspection | fresh read-only UoW按§21返回一致snapshot，write/cursor计数为0 | 可断言19个exact get共享transaction ref，并注入partial/concurrent/unavailable |
| error parity | 只映射本trait五variant，不泄露driver/SQL/path/raw cause | 使用同一named error variant和safe reason，不新增fake-only错误 |
| key/object integrity | create/save/get均校验object getter、lineage和row key一致 | 同样执行校验；不得因对象直接存于内存而跳过 |

fake可以提供测试控制面选择冲突、unknown或失败点，但该控制面只能位于test support，不能成为application trait方法。
本表是实现契约，不是测试结果；本批未运行Rust compiler、repository conformance suite、数据库事务测试或并发测试。

---

## 23. Static closure audit与negative inventory

### 23.1 Positive inventory

| check | expected | current design result |
|---|---:|---:|
| Step 6 mutable status owner | 20 | 20/20 mapped |
| logical mutable repository root | 19 | 19/19；`HandoffTargetProgress`内嵌于`HandoffFact` |
| named repository error type | 19 | 19/19；每类固定5 variants |
| repository trait | 19 | 19/19；application声明、infra实现 |
| exact get/create/save method | 57 | 57/57；每trait各3 |
| same-UoW group | 21 | `MUT-G01~MUT-G21`连续且唯一 |
| Command join | 10 | 10/10 |
| Query join / mutable write | 13 / 0 | 13/13 / 0 |
| Consumer join | 9 | 9/9 |
| Job join | 10 | 10/10 |
| total callable join | 42 | 42/42 |
| commit-unknown mutable result | 3 | all-candidate / fully-absent / indeterminate |
| new L1/L2 upstream blocker | 0 | 0 |

### 23.2 Negative inventory

| forbidden positive surface | expected | current result |
|---|---:|---:|
| independent `HandoffTargetProgressRepository` | 0 | 0 |
| generic `Repository<T>` / generic object key / `SandboxObjectRef` repository key | 0 | 0 |
| `Option<Version>` create-or-update | 0 | 0 |
| upsert / last-write-wins / reload-latest-and-reuse-decision | 0 | 0 |
| repository-owned factory / transition / status selection | 0 | 0 |
| application callable directly invoked by repository callback | 0 | 0 |
| Query begin write UoW / create / save / cursor allocation | 0 | 0 |
| external call while write UoW active | 0 | 0 |
| commit-unknown mutable-only success | 0 | 0 |
| partial/mixed inspection auto-repair | 0 | 0 |
| audit/log/metric/diagnostic schema expanded as main business flow | 0 | 0 |
| tools semantic execution / runtime agent loop / member lifecycle orchestration | 0 | 0 |

正向计数只统计current Rust contract与current mapping表；historical diagnosis和`forbidden`文字中的旧名称不计为
positive surface。Markdown结构、trait/method集合与42行join的机械检查在本批完成时执行；它们不是compile、test、run、
evidence或验收签署。

---

## 24. `7R-02B` completion gate与handoff

> Current override（2026-07-25）：本节原completion结论因owner reachability差集失效。§25审计闭合前，
> 本批状态为`in_progress`，不得据此进入`7R-02C`。

| gate item | result |
|---|---|
| mutable owner/root join | 20/20 owner -> 19/19 root，差集0 |
| repository callable | 19 named traits + 57 exact methods，get/create/save-CAS对称 |
| transaction grouping | `MUT-G01~G21`覆盖L1主流程和必要L2 writer；external split明确 |
| application join | Command 10/10、Query 13/13 zero-write、Consumer 9/9、Job 10/10 |
| recovery | mutable-slice all-candidate / fully-absent / indeterminate闭合；whole-group success继续等待`7R-02C/02D` |
| parity | durable/fake的key、snapshot、CAS、atomicity、unknown和inspection义务一致 |
| secondary concern粒度 | audit、diagnostic、ordinary projection marker只保留owner/失败隔离，不扩写实现或运维schema |
| blocker | 新L1/L2 blocker 0；`REF-001`保持`in_progress_wait_7r_02c_02d` |
| forbidden work | 正式`03~07`、Step 8、boundary skeleton、实现仓、测试/run/evidence均未修改或产生 |

```text
current_document = 03-详细设计.md
current_step = Step 7 regression / 7R-02B completed_ready_for_7R_02C
current_batch = mutable truth repositories
batch_status = completed
gate_status = internal_batch_completed
mutable_owner_join = 20/20
logical_repository_root = 19/19
repository_trait = 19/19
repository_method = 57/57
same_uow_group = 21/21
application_callable_join = 42/42
query_mutable_write = 0/13
ref_blocker = in_progress_wait_7r_02c_02d
next_allowed_action = start_7R_02C
step_8 = blocked_by_step_7_regression
formal_03_07 = historical_reviewed_revalidation_pending
implementation = CB-SBX-01A blocked / wait_design
real_test_execution = not_started
real_evidence_created = no
commit_required = no
```

本批完成后停在`7R-02C`入口，不写immutable/audit/relay repository正文。下一次继续必须先读取本文
§11.2、§19~§24，Step 6 closure audit §9.3、handoff assembly `S7H-08/S7H-10`以及service facade中relay、
capture、consumer和job的same-UoW义务。

---

## 25. `7R-02B` current overlay：create owner reachability与首次物化

> 本节是对§1F、§19~§24及本文早先 completion 快照的更晚 current overlay（2026-07-26）。
> 早先章节中的数量、trait和method仍是有效基础；凡与本节的 create owner、首次物化分支或旧
> “maintenance 只处理 existing”描述冲突者，均降级为 historical diagnosis。本文只定义
> mutable repository primitive 与 application owner 的可达性，不提前展开`7R-02C/02D`的
> immutable row、audit append、stored replay或relay attempt schema。

### 25.1 本次重开问题与裁决

| 问题 | 旧表达 | current 裁决 | 影响范围 |
|---|---|---|---|
| `create_reference_state` 无 application owner | 只列出 `track_*` factory，consumer/job只更新 existing state | `open_controlled_execution_context` 的 intake group 唯一拥有 initial create；每个显式 external source都有 typed state ref和finite observation | `MUT-G01/G17`、Command 1、reference Job |
| `create_read_projection` 无首次物化 owner | `RebuildSandboxReadProjections`只接受existing projection ref，缺失即error | 同一 Job 增加 `FirstMaterialization | Existing` 内部分支；first target必须由formal projection target/index提供 | `MUT-G20`、Job 8 |
| `create_derived_state` 无首次物化 owner | `MaintainDerivedInspectPreviewTrend`只读取existing state | 同一 Job 增加 `FirstMaterialization | Existing` 内部分支；first target必须有formal source proof | `MUT-G21`、Job 9 |
| `C*(rows)`未定义 | 仅以capture表格符号表示多行写入 | 定义为bounded、完整已知key set上的逐row具名`create_*`调用，不是bulk upsert | `MUT-G06`、capture owner |
| relay create owner不逐callable | 只说“finalized draft” | 唯一内部append helper绑定同一callable的finalized draft和`requires_event_relay()` gate | 全部可产生relay的fresh write callable |
| idempotency create owner不逐callable | `7R-02D`拥有，但未说明调用面 | 唯一fresh-reservation helper拥有create；29个非Query fresh callable只能经该helper进入 | 10 Command、9 Consumer、10 Job |

本次裁决不新增第43个public application callable、不新增repository trait、不允许Query取得write authority。
“唯一 owner”指唯一的application create kernel；多个业务入口如需创建同一类root，只能调用该kernel，不能
直接调用repository primitive或各自复制一套create逻辑。

### 25.2 `C*` exact semantics

`C*(rows)`只适用于一个operation已经证明“本次要创建的row集合”是有界且完整的场景。当前正向使用点只有
`MUT-G01`的initial reference-state集合和`MUT-G06`的captured-material集合；两者都必须按本节规则逐row调用
该group已经固定的具名`create_*`方法。`C*`是application执行规则，不是repository批量接口。

1. owner先从同一个checked、闭合source carrier得到typed candidate set；`MUT-G01`的carrier是checked explicit
   source set加每个source恰一份finite resolver observation，`MUT-G06`的carrier是同一个committed terminal run/capture
   snapshot。set携带owner group、完整cardinality、ordered-unique typed key和`source_complete` proof；不能由分页总数、
   latest scan、空列表或caller count推导完整性。
2. 对set中的每个key，application调用Step 6的candidate factory形成完整对象，再按该owner group已经固定的对象类型
   调用唯一具名`create_* (object, uow)`。`MUT-G01`只能调用`create_reference_state`，`MUT-G06`只能调用
   `create_captured_material`；不存在`create_rows`、`save_group`、generic `Repository<T>`或“存在则save”的替代路径。
3. `MUT-G01`每个row以预生成`ReferenceResolutionStateRef`为repository key，并与一个`ExternalSourceRef`和一份
   observation一一对应；`MUT-G06`每个row以`CapturedMaterialRepositoryKey::new(capture_ref, material_key)`为composite
   key。adapter必须从对象getter重验key和lineage；任一key、lineage、factory或repository error都使整个`C*` group rollback。
4. `MUT-G01`的checked source set为空时执行零次reference-row create，不能伪装一个state；`MUT-G06`只有在candidate
   factory明确给出terminal capture zero-material proof时才允许零行。source unavailable、candidate未完成、selection未闭合
   或reader error均不能以空集合通过。
5. `C*`的成功只表示所有具名create已stage并且whole UoW随后commit confirmed；中途stage成功、单row成功或
   已分配identity都不能返回fresh success。commit unknown按§21的whole-group inspection处理。

因此，`C*`是一个application执行规则而非public type。它不改变19个root的`create_*`方法数量，也不允许把
projection、derived、audit、relay或stored result压成一个批量repository接口。

### 25.3 19个logical root的create owner reachability

下表是本批的唯一 create-owner registry。`create primitive`列中的方法必须仍保持§1A.1的
insert-if-absent语义；`unique application owner`是唯一可以调用该primitive的current application kernel；
`authorized callers`只是能够通过该kernel进入的已定义入口，不是额外的create实现。

| # | logical root | create primitive | unique application owner | authorized callers | candidate / source proof | UoW group |
|---:|---|---|---|---|---|---|
| 1 | `ControlledExecutionContext` | `create_context` | `write_intake_context` | `open_controlled_execution_context` | checked source refs、responsibility、guard、resolver decision，经`open_pending`/accept/reject factory | `MUT-G01` |
| 2 | `ExecutionEnvironmentIdentity` | `create_environment_identity` | `write_intake_environment_identity` | `open_controlled_execution_context` accepted branch | 同一 intake group 的 accepted context、exact environment binding和`bind` factory | `MUT-G01` |
| 3 | `ReferenceResolutionState` | `create_reference_state` | `write_initial_reference_state` | `open_controlled_execution_context`；refresh/consumer只走save | 每个显式`ExternalSourceRef`对应一个预生成`ReferenceResolutionStateRef`和`ReferenceResolutionObservation`；`track_resolved`或`track_non_resolved`形成完整state | `MUT-G01` / `MUT-G17` |
| 4 | `CoherentBoundary` | `create_boundary` | `write_boundary_establishment_outcome` | `establish_execution_boundary` | exact requirement、generation、capability/guard decision和typed establishment outcome，经`require`及合法transition | `MUT-G03` |
| 5 | `IsolationEnvironmentHandle` | `create_isolation_handle` | `write_boundary_established_resources` | `establish_execution_boundary` established branch | 同一 boundary outcome 的 exact handle identity、backend binding和`create`/`activate` factory | `MUT-G03` |
| 6 | `ControlledExecutionRun` | `create_run` | `write_run_prepare_recovery` | `start_controlled_execution_run` | exact context/boundary/handle/lease/policy proof、预生成run/capture identity，经`prepare` | `MUT-G04` |
| 7 | `CapturedMaterialRef` | `create_captured_material` | `write_capture_material_group` | `record_capture_result` | complete candidate set、composite key和capture completeness proof；逐row执行`C*` | `MUT-G06` |
| 8 | `ObservabilityMaterial` | `create_observability_material` | `write_capture_material_group` | `record_capture_result` | terminal run、capture outcome、body-free observability candidate和mandatory handoff relation | `MUT-G06` |
| 9 | `HandoffFact` | `create_handoff` | `write_handoff_opening` | `open_material_handoff` | exact capture/material/target plan、all target progress和`HandoffFact::open` factory | `MUT-G07` |
| 10 | `FailureClassification` | `create_failure_classification` | `write_failure_classification` | `classify_sandbox_failure`及已登记的run/handoff/control/redline/lifecycle safety kernels | non-empty typed source marker set，或由同一安全kernel保存的合法`PendingInput`; kind/impact/status由domain factory派生 | `MUT-G05/G09/G10/G11/G12/G16` |
| 11 | `ControlFact` | `create_control_fact` | `write_control_fact` | `submit_sandbox_control`、`consume_sandbox_control_requested` | strict guard、target group、existing-fact snapshot和`ControlFact::{accept,duplicate,conflict}` factory | `MUT-G10` |
| 12 | `LeaseRecord` | `create_lease` | `write_boundary_established_resources` | `establish_execution_boundary` established branch | active handle、explicit equal lease window、generation/context lineage，经`LeaseRecord::open` | `MUT-G03` |
| 13 | `OrphanRecoveryRecord` | `create_orphan_recovery` | `write_orphan_incident` | `run_lease_orphan_reaper`、lifecycle consumer的G18 eligible branch | exact expired lease/handle/generation、typed lifecycle observation和incident uniqueness proof，经`suspect` | `MUT-G18` |
| 14 | `CleanupGuard` | `create_cleanup_guard` | `write_cleanup_guard` | `evaluate_cleanup_readiness` only；后续安全kernel只允许get/save existing guard | complete owner/evidence/redline coverage和strict guard evaluation，经`open` | `MUT-G13` |
| 15 | `RedlineContainment` | `create_redline_containment` | `write_redline_detection` | `record_redline_containment` | checked redline signal、lineage、strict containment guard和`RedlineContainment::detect` | `MUT-G16` |
| 16 | `SandboxReadProjection` | `create_read_projection` | `write_projection_materialization` | `rebuild_sandbox_read_projections` first branch only | formal projection target proof、exact projection/context identity和`SandboxReadProjectionSourceSnapshot`或typed unavailable proof | `MUT-G20` |
| 17 | `DerivedInspectPreviewTrendState` | `create_derived_state` | `write_derived_materialization` | `maintain_derived_inspect_preview_trend` first branch only | formal derived target proof、kind、`DerivedSourceRefSet`、same-snapshot source/materialization proof；调用`from_sources`或`unavailable_from_sources` | `MUT-G21` |
| 18 | `SandboxEventRelayRecord` | `create_event_relay` | `append_finalized_relay` | 任一fresh callable在同一operation确实形成required relay draft | finalized `SandboxEventRelayDraft`、canonical payload/target/retry/schema prerequisite和`requires_event_relay()` gate | owning group + `7R-02C` relation |
| 19 | `SandboxIdempotencyRecord` | `create_idempotency_record` | `reserve_fresh_operation` | 10 Command、9 Consumer、10 Job的fresh non-Query path | unique `(operation_name, idempotency_key, request_digest)` claim、checked call context和`reserve` factory | every fresh write group |

`HandoffTargetProgress`仍没有create primitive或独立owner；它只能由`write_handoff_opening`经`HandoffFact::open`
嵌入aggregate，后续由`save_handoff`整体CAS。表中“authorized callers”不会改变该聚合边界。

#### 25.3.1 `get/create/save` method reachability

| logical root | exact get callers | unique create owner | exact save callers | unreachable method |
|---|---|---|---|---:|
| `ControlledExecutionContext` | intake relation check、boundary/run/safety owner load、cleanup closure、commit-unknown inspector | `write_intake_context` | cleanup completion/closure safety kernel | 0 |
| `ExecutionEnvironmentIdentity` | intake relation check、boundary/run/cleanup owner load、commit-unknown inspector | `write_intake_environment_identity` | cleanup completion/invalidating safety kernel | 0 |
| `ReferenceResolutionState` | intake duplicate/integrity check、three reference consumers、reference refresh、commit-unknown inspector | `write_initial_reference_state` | reference stale/refresh kernel | 0 |
| `CoherentBoundary` | boundary outcome、run launch、control/failure/cleanup/redline loads、commit-unknown inspector | `write_boundary_establishment_outcome` | failure/control/cleanup/redline safety kernels | 0 |
| `IsolationEnvironmentHandle` | boundary outcome、run launch、lifecycle/reaper/cleanup loads、commit-unknown inspector | `write_boundary_established_resources` | lifecycle/reaper/cleanup release kernels | 0 |
| `ControlledExecutionRun` | launch/capture/control/failure/redline loads、commit-unknown inspector | `write_run_prepare_recovery` | launch observation、failure/control/redline kernels | 0 |
| `CapturedMaterialRef` | capture duplicate check、handoff opening/observation/retry、commit-unknown inspector | `write_capture_material_group` | handoff lifecycle synchronization kernel | 0 |
| `ObservabilityMaterial` | capture duplicate check、handoff/redline preservation loads、commit-unknown inspector | `write_capture_material_group` | handoff lifecycle synchronization kernel | 0 |
| `HandoffFact` | opening duplicate check、handoff consumers/retry、cleanup/redline loads、commit-unknown inspector | `write_handoff_opening` | target-attempt/observation、cleanup/redline kernels | 0 |
| `FailureClassification` | failure command、control/redline/lifecycle safety loads、commit-unknown inspector | `write_failure_classification` | classify-pending/terminal/supersede safety kernels | 0 |
| `ControlFact` | control conflict/duplicate load、effect completion、query source reader、commit-unknown inspector | `write_control_fact` | control effect completion/attach-failure kernel | 0 |
| `LeaseRecord` | boundary/run/reaper/lifecycle/cleanup loads、commit-unknown inspector | `write_boundary_established_resources` | reaper/lifecycle/guarded release kernels | 0 |
| `OrphanRecoveryRecord` | reaper/lifecycle/cleanup loads、commit-unknown inspector | `write_orphan_incident` | reaper/guarded release recovery kernels | 0 |
| `CleanupGuard` | cleanup command/job、lifecycle/redline/handoff loads、commit-unknown inspector | `write_cleanup_guard` | evaluation/release/confirmation/redline kernels | 0 |
| `RedlineContainment` | redline command/consumer/job、cleanup coverage loads、commit-unknown inspector | `write_redline_detection` | containment/preservation/investigation terminal kernels | 0 |
| `SandboxReadProjection` | projection target reader、rebuild job、query source reader、commit-unknown inspector | `write_projection_materialization` | stale/rebuild/degraded/unavailable maintenance kernel | 0 |
| `DerivedInspectPreviewTrendState` | derived target reader、maintenance job、query source reader、commit-unknown inspector | `write_derived_materialization` | stale/rebuild/failed/unavailable maintenance kernel | 0 |
| `SandboxEventRelayRecord` | finalized append duplicate check、publisher/feedback/recovery、commit-unknown inspector | `append_finalized_relay` | attempt/delivery/retry/dead-letter/integrity kernels | 0 |
| `SandboxIdempotencyRecord` | fresh preflight、duplicate replay、completion/recovery、commit-unknown inspector | `reserve_fresh_operation` | matching complete/fail finalizer only | 0 |

`commit-unknown inspector`对19个root都只可调用exact `get_*_with_version`，write set、identity allocation、cursor
allocation和external call均为0。Query只通过后续`7R-04A`受控read port消费表中标注的query source reader，不能直接
持有mutable repository或借“exact get callers”取得write UoW。表中save caller集合均必须先经matching root的
Step 6 transition并使用该次exact read取得的`Version`；集合不授权generic cross-root mutation。

### 25.4 Special create rules：reference、projection与derived

#### 25.4.1 Initial reference state

`write_initial_reference_state`是`open_controlled_execution_context`内部唯一的reference-state create kernel，
不是refresh Job的隐藏补行逻辑。intake顺序固定为：

```text
checked explicit source_refs
  -> allocate one ReferenceResolutionStateRef per source
  -> run body-free resolver observation outside the write UoW
  -> open fresh intake UoW
  -> for every explicit source call track_resolved(...) or track_non_resolved(...)
  -> create_reference_state(...) for every complete candidate
  -> stage context / optional environment identity / required immutable relations
  -> commit the complete intake group
```

resolver observation的`reference_state_ref`必须等于该source预生成的ref，source kind/ref与intake source set逐项相等，
且不得携带external body。finite `Resolved | Stale | Unresolved | Invalid | Unavailable` observation可以形成对应
initial state；technical error若不能安全映射为finite observation，则整个intake group返回typed application error并
rollback，不创建空state、不由旧summary补state。reference state只维护长期freshness，不能反向决定intake的
Accepted/Rejected/Unresolved decision；decision仍由intake guard和resolver result的canonical owner产生。

refresh Job、reference-change consumer和policy/capability consumer只允许对已存在的state调用
`get_reference_state_with_version` + `save_reference_state`。它们遇到`NotFound`必须报告selection/index integrity，
不能调用`write_initial_reference_state`或把Query/maintenance变成initial owner。

#### 25.4.2 Projection first materialization

`write_projection_materialization`在`rebuild_sandbox_read_projections`内部处理一个typed target的两种互斥形态：

| target branch | formal input | exact repository path | missing/race rule |
|---|---|---|---|
| `FirstMaterialization` | `projection_ref`、`context_ref`、formal target/index proof、完整或typed unavailable source outcome | `SandboxReadProjection::create`或`create_unavailable` -> `create_read_projection` | write UoW重验exact key absent；已存在返回conflict，不转save |
| `Existing` | existing `projection_ref`、context、current `Version`、matching stale/maintenance proof | `get_read_projection_with_version` -> domain start/finish/degrade transition -> `save_read_projection` | `NotFound`是index/integrity error；不补行 |

formal target/index proof至少证明：target属于该context、projection kind/scope已注册、projection identity是稳定typed ref、
selection不是all/latest推导、source reader可以按该target取得`SandboxReadProjectionSourceSnapshot`或明确 unavailable
reason。Job不能从context ref拼projection ref、从status view ref反推projection identity、从旧projection body猜source、
或因`get`返回NotFound临时分配identity。first source完整时可以直接建立Fresh；source只可安全降级时必须用
`create_unavailable`或domain允许的显式degraded初始形态，不能把缺失source写成Fresh。

#### 25.4.3 Derived first materialization

`write_derived_materialization`同样只在`maintain_derived_inspect_preview_trend`内部拥有first branch。formal target/index
必须提供`derived_state_ref`、context、固定`DerivedMaterialKind`（仅`Inspect | Preview | Trend`）和
`DerivedSourceRefSet` source proof；不能由Job、Query或caller生成source set。分支规则为：

```text
FirstMaterialization + complete source/materialization proof
  -> DerivedInspectPreviewTrendState::from_sources(...)
  -> create_derived_state(...)

FirstMaterialization + formal source unavailable proof
  -> DerivedInspectPreviewTrendState::unavailable_from_sources(...)
  -> create_derived_state(...)

Existing + current state Version
  -> get_derived_state_with_version(...)
  -> start/finish/failed/unavailable transition
  -> save_derived_state(...)
```

first branch必须在同一UoW重验 current state/materialization index 的 absence；`None`、empty summary、Query `Empty`、
旧view body或“没有选到row”都不是`DerivedNeverMaterializedProof`。first conflict、source-set mismatch、wrong kind、
half-commit或commit unknown均进入typed conflict/integrity/reconciliation，不reload latest套用旧builder结果，也不创建第二
state identity。builder failure只形成derived `Failed`/`Unavailable` maintenance outcome，不创建`FailureClassification`。

### 25.5 Relay与idempotency create的唯一绑定

#### 25.5.1 Relay

`append_finalized_relay`是唯一可以调用`create_event_relay`的application helper。它必须在调用前验证：

1. 当前callable的同一operation已经形成finalized `SandboxEventRelayDraft`，draft的source truth/cursor、payload、target、
   runtime generation、retry policy和audit linkage全部来自当前group；
2. `requires_event_relay()`为true且该event kind确实要求relay；如果为false，不分配relay identity、不调用create；
3. canonical encoder/verifier、schema、store能力和target binding均已通过提交前gate；finding/required relay缺任何前置时
   整个group不得退化为report-only或无relay成功；
4. `SandboxEventRelayDraft::finalize_staged_source`或`finalize_committed_source`已形成完整append pair，且
   `create_event_relay`与同一operation的truth/non-mutable group在允许的UoW内共同stage。

relay publisher、relay feedback consumer和retry job只能对已存在record执行`get`/`save`与attempt transition；它们
不能因为selection缺row而create，也不能从current truth重建payload。一个operation最多由其自身的finalized draft创建
一个matching relay root；duplicate replay和commit-unknown inspection均为zero-create。

#### 25.5.2 Idempotency

`reserve_fresh_operation`是唯一可以调用`create_idempotency_record`的application helper。它只在调用方已经通过
fixed operation/channel、checked digest/key和authority preflight、且确认这是fresh invocation后执行。固定顺序为：

```text
preflight operation + digest + idempotency key
  -> unique claim lookup / reservation decision
  -> allocate SandboxIdempotencyRecordRef exactly once for a fresh claim
  -> SandboxIdempotencyRecord::reserve(...)
  -> create_idempotency_record(...)
  -> only then allocate business identities and read/write business owners
```

相同key/digest的duplicate只读取完整stored result；相同key不同digest、in-flight、wrong channel、损坏relation或
`AlreadyExists`但无法证明同一claim均返回typed conflict/integrity，不转save、不重跑、不创建第二ref。Query的
idempotency repository调用、identity分配、cursor分配和write set固定为0。`evaluate_policy_execution`、capability
refresh和reconciliation虽然没有business mutable root，也仍遵守该fresh reservation owner；其immutable/stored group
不能借业务root表绕过reservation。

### 25.6 `7R-02B` owner reachability completion criteria

本批只有同时满足以下条件才可关闭：

| check | required result |
|---|---|
| logical root registry | 19/19 roots each has one create primitive and one unique application create owner |
| method symmetry | 19/19 traits each has exact `get/create/save`, total 57/57 |
| create owner reachability | every owner is reached by at least one named current callable or explicitly shared kernel caller set; no orphan create method |
| first materialization | reference initial、projection first、derived first each have typed identity/source proof and explicit UoW branch |
| relay/idempotency | relay create requires finalized draft; idempotency create requires fresh reservation; Query create/write remains 0/13 |
| bounded multi-row | `C*` only uses complete known key set and per-row create; empty semantics explicit |
| callable join | Command 10/10、Query 13/13、Consumer 9/9、Job 10/10 remains exact |
| negative surface | generic upsert、missing-row fallback、query repair、new public callable、second identity owner均为0 |

在本节审计完成前，§24的`completed_ready_for_7R_02C`文本不具current效力；该段状态由本文物理末尾的§26覆盖。

---

## 26. `7R-02B` Current Completion Overlay：mutable owner reachability

> 本节位于本文物理末尾，是repository产物对`7R-02B`的唯一current completion overlay（2026-07-26）。
> §24是失效的历史完成快照，§25保留owner reachability推导和规则；本节只收口静态审计状态，不提前激活
> `7R-02C/02D`，也不定义immutable、audit、stored-result或relay-attempt schema。

| audit | current result |
|---|---|
| mutable owner to persisted root | 20/20 owner -> 19/19 logical root；`HandoffTargetProgress`仍嵌入`HandoffFact`，无独立root/ref/Version |
| repository trait and method symmetry | 19/19 traits；每个trait exact `get/create/save`，共57/57 methods；generic repository/upsert/bulk API为0 |
| same-UoW groups | 21/21 groups；`C*`仅是G01/G06在完整typed candidate set上的逐row named create规则 |
| application callable join | Command 10/10、Query 13/13、Consumer 9/9、Job 10/10，共42/42 |
| Query write guard | Query mutable create/save、write UoW、identity/cursor allocation和external call均为0/13 |
| fresh reservation owner | 10 Command + 9 Consumer + 10 Job = 29/29，经唯一`reserve_fresh_operation`；duplicate/recovery不二次create |
| first materialization | reference initial、projection first、derived first均有typed identity/source proof和明确create/existing UoW分支 |
| negative fallback | missing-row补建、Query repair、latest/all scan、generic upsert、second identity owner均为0 |

`ReferenceResolutionState`首次创建唯一归`open_controlled_execution_context`的
`write_initial_reference_state`/`MUT-G01`；capture materials只由`record_capture_result`的G06逐row create；projection和
derived只由各自Job的formal target `FirstMaterialization`分支create。failure、cleanup和orphan的首次create继续服从
§25.3登记的唯一安全kernel。relay只接受finalized draft和`requires_event_relay()` gate，idempotency只接受fresh reservation。

本 overlay 的结论是设计静态闭合，不是Rust compile、test、run、evidence、验收签署、baseline或commit事实。新L1/L2上游
blocker为0；`REF-001`仍等待`7R-02C/02D`的immutable、stored和index join。`S7-02B`已完成并进入用户审查停点，下一合法动作是
用户确认后读取`S7H-08/S7H-10`和`7R-02C`输入；当前不自动跨批。

```text
current_document = 03-详细设计.md
current_step = Step 7 regression / 7R-02B completed_wait_user_review
current_batch = mutable truth repositories
batch_status = completed_wait_user_review
gate_status = user_review_pending
mutable_owner_join = 20/20
logical_repository_root = 19/19
repository_trait = 19/19
repository_method = 57/57
same_uow_group = 21/21
application_callable_join = 42/42
query_mutable_write = 0/13
fresh_idempotency_owner = 29/29
ref_blocker = open_wait_7r_02c_02d
next_allowed_action = wait_user_review_before_7R_02C
step_8 = blocked_by_step_7_regression
formal_03_07 = historical_reviewed_revalidation_pending
implementation = CB-SBX-01A blocked / wait_design
real_test_execution = not_started
real_evidence_created = no
commit_required = no
```

---

## EOF Current Overlay: `S7-02D` repository boundary

本节位于物理 EOF，覆盖本文前部两个 `S7-02D` activation 草稿。前部内容保留为 historical-position material；当前
repository authority只来自新 `S7-02D` 中间产物及本节的恢复状态。

```text
current_document = 03-详细设计.md
current_step = Step 7 regression / 7R-02D in_progress
current_batch = idempotency / stored result / bounded selector repositories
batch_status = in_progress
gate_status = content_in_progress
repository_traits_in_scope = SandboxIdempotencyRecordRepository + SandboxStoredOperationResultRepository
index_scope = exact unique claim + bounded existing-record selector only
unique_identity = operation_name + idempotency_key + request_digest
channel_in_unique_identity = no
stored_result_body = forbidden
generic_result_api = forbidden
query_write = 0/13
completed_internal_batches = S7-02D-B1,S7-02D-B2
current_internal_batch = S7-02D-B3 typed stored carrier and full surface stores
next_allowed_action = write_s7_02d_b3_batch_1
ref_blocker = in_progress_wait_s7_02d
new_l1_l2_blocker = 0
implementation = CB-SBX-01A blocked / wait_design
commit_required = no
```

---

## EOF Current Recovery Override: `S7-02D-B3-1` surface schema ready, B3-2 next

本节位于物理EOF并覆盖本文全部前置repository overlay。三类surface schema已就绪，save/get method仍待B3-2。

```text
current_document = 03-详细设计.md
current_step = Step 7 regression / 7R-02D in_progress
current_batch = idempotency / stored result / bounded selector repositories
batch_status = in_progress
gate_status = content_in_progress
completed_internal_batches = S7-02D-B1,S7-02D-B2
completed_internal_sub_batch = S7-02D-B3-1
current_internal_batch = S7-02D-B3
surface_schema = CommandResult+ConsumerReceipt+JobReport
surface_store_methods = deferred_to_S7_02D_B3_2
next_allowed_action = write_s7_02d_b3_batch_2
query_write = 0/13
ref_blocker = in_progress_wait_s7_02d
new_l1_l2_blocker = 0
implementation = CB-SBX-01A blocked / wait_design
commit_required = no
```

---

## EOF Current Recovery Override: `S7-02D-B3-2` completed, B3-3 active

本节位于物理 EOF，覆盖前置 repository overlay。B3-2 已把 carrier 与三类 typed surface 的 save/get trait、有限错误、
同一 UoW stage 和 committed snapshot read 固定到 `crates/application/src/ports.rs`；不新增 `repositories.rs`，也不
把 stored surface 迁移到 worker/jobs。下一批只验证五类 relation 的统一 validator。

```text
current_document = 03-详细设计.md
current_step = Step 7 regression / 7R-02D in_progress
current_batch = idempotency / stored result / bounded selector repositories
batch_status = in_progress
gate_status = content_in_progress
completed_internal_batches = S7-02D-B1,S7-02D-B2
completed_internal_sub_batch = S7-02D-B3-2 typed store exact traits and errors
current_internal_batch = S7-02D-B3
next_internal_sub_batch = S7-02D-B3-3 cross-validation
next_allowed_action = write_s7_02d_b3_batch_3
repository_owner = crates/application/src/ports.rs
carrier_method = 2/2
typed_surface_method = 6/6
write_handle = same_uow_stage 4/4
read_handle = committed_snapshot 6/6
error_family = 4/4
query_write = 0/13
ref_blocker = in_progress_wait_s7_02d
new_l1_l2_blocker = 0
implementation = CB-SBX-01A blocked / wait_design
commit_required = no
```

---

## EOF Current Recovery Override: `S7-02D-B4` whole-group contract closed

本节位于 repository/UoW 产物物理 EOF，覆盖前置 B3 repository overlay。B4 复用既有 5 个 idempotency method、
2 个 carrier method、6 个 typed surface method及其它 named exact get；没有新增 generic inspector或repository method。

```text
current_document = 03-详细设计.md
current_step = Step 7 regression / 7R-02D in_progress
current_batch = idempotency / stored result / bounded selector repositories
batch_status = in_progress
gate_status = user_confirmation_pending_for_internal_batch
completed_internal_batches = S7-02D-B1,S7-02D-B2,S7-02D-B3,S7-02D-B4
completed_internal_batch = S7-02D-B4 whole-group algorithm and inspection
next_internal_batch = S7-02D-B5 necessary bounded selector/index and parity join
next_allowed_action = wait_user_confirmation_before_s7_02d_b5
idempotency_repository_method = 5/5
carrier_method = 2/2
typed_surface_method = 6/6
generic_inspector_method_added = 0
repository_method_added_in_b4 = 0
inspection_snapshot = one_committed_snapshot
inspection_write = 0
inspection_identity_cursor_clock_external = 0/0/0/0
not_committed_is_status_unknown = no
rollback_unknown_is_absent = no
query_write = 0/13
S7-02D-INT-04 = closed
S7-02D-INT-05 = open
ref_blocker = open_wait_s7_02d_b5_b6
new_l1_l2_blocker = 0
formal_03_07 = historical_reviewed_revalidation_pending
implementation = CB-SBX-01A blocked / wait_design
real_test_execution = not_started
real_evidence_created = no
commit_required = no
```

---

## EOF Current Overlay: `S7-02D-B5` selector/index repository join

> 本节位于物理 EOF，覆盖前置 B4 recovery block。B5 的详细 current authority 在
> `03_ddd_step_07_idempotency_stored_index_repositories.md` §§64~70；本节只同步 repository 总览、Step 6 carrier delta与恢复点。

九个 paged maintenance Job 使用一个 read-only repository trait中的九个 exact methods；每个首页打开 immutable committed
selection generation，后续 cursor只能续读同一 selector/family/limit/generation。reader不接受write UoW，不分配 identity、
truth/reference cursor，不调用external port，不执行repair/delete。13个Query与 reconciliation Job均不消费该 index。

capability index identity固定为 `(context_ref, backend source identity, requirement_ref)`。Step 6 maintenance report carrier已最小
回开为 `SandboxMaintenanceTargetRef::BackendCapability { backend_ref, requirement_ref }`，因此同一 backend 下不同 immutable
requirements 不会在 page stable order、batch duplicate validation或stored report replay中碰撞。`current_summary_ref`、status、
freshness、Timestamp和core `Version`都不是stable identity；它们只在exact owner reload / CAS recheck中使用。

`SandboxMaintenancePageTokenCodec` current surface只有 `encode(job_kind, cursor)`。Start cursor恒为None，Continue move permit
中的 `SandboxRepositoryCursor`，所以不存在合法 decode consumer；PageToken仅作为batch/report chain中的body-free input/next
记录，不是restart/resume authority。cursor integrity、family/selector/limit/snapshot校验归reader / cursor implementation。

```text
current_document = 03-详细设计.md
current_step = Step 7 regression / 7R-02D
current_task = S7-02D idempotency / stored result / bounded index
batch_status = in_progress
completed_internal_batches = S7-02D-B1,S7-02D-B2,S7-02D-B3,S7-02D-B4,S7-02D-B5
completed_internal_batch = S7-02D-B5 necessary bounded selector/index and parity join
next_internal_batch = S7-02D-B6 closure audit and recovery-source synchronization
next_allowed_action = wait_user_confirmation_before_s7_02d_b6
maintenance_selector = 9/9
maintenance_reader = 9/9
capability_target_identity = backend_source_plus_requirement_ref
page_token_decode_consumer = 0
page_token_codec_surface = encode_only
application_callable = 42/42
fresh_reservation_owner = 29/29
query_maintenance_index = 0/13
query_write = 0/13
reconciliation_paged_reader = 0/1
S7-02D-INT-05 = closed
ref_blocker = open_wait_s7_02d_b6
new_l1_l2_blocker = 0
formal_03_07 = historical_reviewed_revalidation_pending
implementation = CB-SBX-01A blocked / wait_design
real_test_execution = not_started
real_evidence_created = no
commit_required = no
```

---

## EOF Current Recovery Override: `S7-02D-B6` repository closure consumed

本节位于 repository 产物物理 EOF，覆盖 B5 selector/index overlay。B6 只做 repository method、stored relation、bounded
reader、UoW/Version和 current identity 的集合闭合；不新增 repository root、generic inspector、write method或物理存储方案。

| repository closure | current result |
|---|---|
| idempotency exact methods | `5/5` (`get`, `find binding`, `claim`, `save completion`, `save failure`) |
| stored carrier methods | `2/2` (`get`, `create`) |
| typed surface methods | `6/6` (`Command/Consumer/Job save/get`) |
| maintenance reader methods | `9/9` exact read-only methods；generic reader `0` |
| UoW / Version | committed read snapshot与write UoW分离；CAS使用core `Version`；inspection write `0` |
| query / reconciliation | Query maintenance/write `0/13`；reconciliation paged reader `0/1` |
| forbidden positive path | old wrapper、opaque current ref、latest/all scan、offset pagination、decode/restart consumer `0` |
| `REF-001` | `resolved_in_7r_02d`；无新的 L1/L2 upstream blocker |

```text
current_document = 03-详细设计.md
current_step = Step 7 regression / 7R-02D completed_wait_user_review
current_batch = S7-02D idempotency / stored result / bounded index
batch_status = completed_wait_user_review
gate_status = user_review_pending
completed_internal_batches = S7-02D-B1,S7-02D-B2,S7-02D-B3,S7-02D-B4,S7-02D-B5,S7-02D-B6
current_internal_batch = none
idempotency_repository_method = 5/5
carrier_method = 2/2
typed_surface_method = 6/6
maintenance_reader = 9/9
generic_inspector_method_added = 0
new_repository_method = 0
query_write = 0/13
S7-02D-INT-01 = closed
S7-02D-INT-02 = closed
S7-02D-INT-03 = closed
S7-02D-INT-04 = closed
S7-02D-INT-05 = closed
ref_blocker = resolved_in_7r_02d
next_gate = S7-G02 user review of 7R-02A~D
next_allowed_action = wait_user_review_before_s7_g02
step_8 = blocked_by_step_7_regression
formal_03_07 = historical_reviewed_revalidation_pending
implementation = CB-SBX-01A blocked / wait_design
real_test_execution = not_started
real_evidence_created = no
commit_required = no
```

---

## EOF Current Recovery Override: `S7-03B` launch reservation / UoW ordering consumed

本节位于 repository 产物物理 EOF，是 `S7-03B` 对 repository/UoW 接缝的唯一 current authority。前部同名段只保留为
`historical_material`，不得覆盖本节。该 overlay 不新增 repository root、generic inspector、write method、status 或物理存储方案。

### Current `MUT-G04 -> MUT-G05` repository contract

| phase | repository/UoW responsibility | confirmed gate | forbidden path |
|---|---|---|---|
| reservation prefix | reservation-only UoW调用 `claim_idempotency_reservation` | 仅 `Confirmed` 形成 `FreshReservationOwnership`；`FreshReserved` stage result本身不授予business permission | business owner read、run/capture/failure identity allocation、`create_run`、external launch |
| run preparation | 已提交reservation后fresh-read exact owner group；分配run/capture/launch-failure三ref；`create_run`保存 `Preparing`、audit和recovery relation | preparation UoW独立 `Confirmed` 后才形成可恢复的Preparing run | 与reservation同组、复用reservation candidate作business Version、未提交run就authorize |
| pre-call revalidation | committed read snapshot中重新读取Preparing run、prebound ref、handle/lease/policy和reservation relation | `authorize_launch`成功后才构造port request；该阶段write为0 | 复用旧permit/旧Version、latest scan、替换handle/ref |
| external lifecycle call | repository/UoW全部释放；由facade调用一次exact launch method | finite result或同key inspection必须保留原correlation | 跨await持有UoW、repository callback、盲目第二次launch |
| finalization | fresh-read run/Version和完整recovery group；成功保存Running，terminal failure保存同ref classification及Failed run | whole-group commit `Confirmed` 后才返回 outcome | 第二failure ref、`PendingInput`占位、`mark_terminal`、partial stored linkage |

`BackendLaunchFailed` 不要求 repository 新增 failure identity method。它使用 `Preparing` run 中预绑定的同一个
`FailureClassificationRef`，由 application 依次执行 typed observation、marker、marker set、`classify`、
`require_run_failure_basis` 和 `mark_failed`，再在 finalization UoW 中保存 classification 与 run；classification 保持
`Classified`，run 进入 `Failed`。

### Repository closure

| check | result |
|---|---:|
| existing idempotency exact methods changed | `0` |
| new repository root / method / status | `0 / 0 / 0` |
| reservation-only commit before business allocation | `required` |
| separate run-preparation commit | `required` |
| external await with UoW held | `forbidden` |
| launch failure identity | `prebound same ref` |
| query/maintenance reader writes introduced | `0` |
| tools/runtime/member semantic execution path | `0` |
| new L1/L2 upstream blocker | `0` |

```text
current_document = 03-详细设计.md
current_step = Step 7 regression / 7R-03B completed_wait_user_review
current_batch = S7-03B establish/launch/inspect/release ports
artifact_content_status = completed
artifact_review_status = user_review_pending
repository_current_authority = EOF_S7-03B_launch_reservation_uow_overlay
reservation_only_commit_before_business = required
run_preparation_commit = separate_required
external_await_with_uow = forbidden
launch_failure_identity = prebound_same_ref
new_repository_root = 0
new_repository_method = 0
new_status = 0
new_l1_l2_blocker = 0
next_allowed_action = wait_user_review_before_s7_03c
step_8 = blocked_by_step_7_regression
formal_03_07 = historical_reviewed_revalidation_pending
implementation = CB-SBX-01A blocked / wait_design
real_test_execution = not_started
real_evidence_created = no
commit_required = no
```
