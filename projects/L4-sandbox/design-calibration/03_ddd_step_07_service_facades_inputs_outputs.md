# Step 7 Application Service Facade 与 Exact Input / Output 契约

> 对应 SOP: `standards/document/详细设计讨论流程_SOP.md` Step 7
> 创建日期: 2026-07-25
> 状态: `7r_03b_completed_wait_user_review`
> 所属流程: `03_ddd_calibration_flow.md`
> 上游门禁: Step 6 `6R-07 review_confirmed`；Step 7 `S7-03A review_confirmed`、`S7-03B` lifecycle contract
> 当前批次: `S7-03B` establish/launch/inspect/release ports；42 个 application entry callable继续有效，当前停在用户复核前
> 当前效力: 本文件是 `7R-01` service facade、application-local input / output 和 DTO source requirement 的唯一 current owner；historical Step 7 同名 trait 与 16 个未定义 `*Input` 不再拥有 current authority。

---

## 1. Step 状态、输入与边界

### 1.1 当前恢复点

| 项目 | current 结论 |
|---|---|
| 当前正式文档 / Step | `03-详细设计.md` / Step 7 regression / `7R-01 completed_wait_user_review`。 |
| 当前任务 | `S7-G01`用户审查：确认42/42 application entry callable和`7R-01D` 10/10 Job闭合结果；确认前不得进入`7R-02`。 |
| 上游 current authority | 正式 `00~02`；Step 4 file layout；Step 5 module contract；Step 6 五份 canonical object contract；`6R-07` handoff §10；`7R-M0` regression control。 |
| historical material | 原 Step 7 service facade、HLD Command input 骨架及正式 `03` 中旧 trait 摘要只用于缺口诊断，不直接继承字段。 |
| 本批允许修改 | 本文件、`03` calibration flow、两层 execution ledger、Step 7 control current override 和 `/tmp` 加速计划状态。 |
| 本批禁止修改 | historical Step 7 正文签名、Step 8~19、正式 `03~07`、planned boundary skeleton、implementation Gate、目标实现仓和代码。 |
| implementation | `CB-SBX-01A blocked / wait_design`。 |
| 新上游 blocker | 0。`STEP7-INPUT-001`已由`7R-01`关闭；`DISPATCH/REF/OUTCOME/READ/ENTRY`五项继续按既定owner开放。 |

```text
current_document = 03-详细设计.md
current_step = Step 7 regression / 7R-01 completed_wait_user_review
current_artifact = 03_ddd_step_07_service_facades_inputs_outputs.md
current_batch = 7R-01 application callable
batch_status = completed_wait_user_review
current_callable_defined = 42/42
next_allowed_action = wait_user_review_before_7R_02
formal_03_07 = historical_reviewed_revalidation_pending
implementation = CB-SBX-01A blocked / wait_design
compile_or_test_claim = none
real_evidence_or_acceptance = none
commit_required = no
```

---

## Historical-Position Foundation: `7R-06C-1C-R` borrowed JobReport finalizer

> 本节因历史状态锚点命中文件顶部，只保留完整owner推导与exact contract；只有物理EOF的同批activation显式采纳后才是
> current authority。它消费Step 6物理EOF的Jobs/Worker owner activation。前部
> §§40.6~40.7以及`7R-06C-1B-R`中按值`Vec`、finalizer返回普通`SandboxServiceOutcome`、entry预先复制status的定义，在
> 冲突处降为`historical_material`。九个paged callable、permit union和42-entry join均不变。

### 40.8 SOP回答与方案裁决

| 问题 | current回答 |
|---|---|
| 谁拥有batch chain | Jobs路径由`SandboxJobReportAccumulator`唯一拥有；Worker relay路径由invocation-local唯一`Vec`拥有。application只借用。 |
| application如何保存完整report | borrowed write source在一次finalization future内逐batch/逐item校验并stage到typed store；不保存borrow本身。 |
| status由谁派生 | 只由`FinalizeSandboxJobReportInput::try_new`遍历完整borrowed items派生。 |
| entry如何得到不可伪造结果 | finalizer返回application-only `SandboxFinalizedJobReport` witness。 |
| 为什么不选consume-and-return | 会新增更重的owned handoff并让application暂时拥有entry chain；borrowed source能保持owner不变且不clone。 |

### 40.9 Exact borrowed input and service signature

```rust
/// 九个paged Job完整、exhausted batch chain的调用期borrowed finalizer input。
#[derive(Debug)]
pub struct FinalizeSandboxJobReportInput<'a> {
    /// 已耗尽且持有原reservation ownership的closed permit；按值只能消费一次。
    permit: SandboxFinalizableJobPermit,
    /// caller唯一batch chain的只读borrow；不得clone、保存或跨future逃逸。
    batches: &'a [SandboxMaintenanceBatchOutcome],
    /// constructor从完整items机械派生的五态fresh report status。
    report_status: SandboxJobReportStatus,
}

impl<'a> FinalizeSandboxJobReportInput<'a> {
    pub fn try_new(
        permit: SandboxFinalizableJobPermit,
        batches: &'a [SandboxMaintenanceBatchOutcome],
    ) -> ApplicationResult<Self>;

    pub fn permit(&self) -> &SandboxFinalizableJobPermit;
    pub fn batches(&self) -> &'a [SandboxMaintenanceBatchOutcome];
    pub fn report_status(&self) -> SandboxJobReportStatus;
    pub fn item_count(&self) -> ApplicationResult<u64>;

    /// 只移交owned permit、borrowed slice和constructor-derived status；不产生owned batch copy。
    pub(crate) fn into_parts(
        self,
    ) -> (
        SandboxFinalizableJobPermit,
        &'a [SandboxMaintenanceBatchOutcome],
        SandboxJobReportStatus,
    );
}

pub trait SandboxJobService: Send + Sync {
    /// 在input borrow有效期内完成typed surface、carrier与idempotency relation的同一UoW提交。
    async fn finalize_job_report<'a>(
        &'a self,
        input: FinalizeSandboxJobReportInput<'a>,
    ) -> ApplicationResult<SandboxFinalizedJobReport>;
}
```

若实现toolchain或trait-object策略不用原生`async fn in trait`，唯一允许的等价展开是：

```rust
fn finalize_job_report<'a>(
    &'a self,
    input: FinalizeSandboxJobReportInput<'a>,
) -> Pin<Box<dyn Future<Output = ApplicationResult<SandboxFinalizedJobReport>> + Send + 'a>>;
```

两种形态二选一，不形成两个callable。禁止`'static` input/future、`tokio::spawn`/detached task、把slice放进service字段、UoW
对象或channel，以及用`Arc<Vec<_>>`、`Cow::Owned`、serialization round-trip隐藏复制。permit按值进入input并由application消费；
若finalization失败，caller不再持有permit，不能盲重试，仍按原operation/digest/key和commit-unknown inspection处理。

constructor沿用§40.6的exhaustion/page-count/token-chain/job-kind/page-limit/global-target-unique/item-shape/status六类检查，
但不再依赖已失效的“permit持有全量selection target vector”口径。首批input固定None；每个nonterminal next必须等于下一批
input；最后一批next=None。`batches.is_empty()`始终拒绝，explicit empty selection由一条terminal empty batch表达。

### 40.10 Borrowed write source and materialization

write-side draft与read-side frozen payload必须分开：read/replay仍可由persistence adapter重建owned
`SandboxMaintenanceJobReportSurfaceDraft`；fresh save不能为了复用该owned type而clone caller chain。

```rust
/// 只在application finalization栈内存在的borrowed maintenance report write source。
pub(crate) struct SandboxMaintenanceJobReportWriteSource<'a> {
    stored_result_ref: SandboxStoredOperationResultRef,
    job_kind: SandboxJobKind,
    original_job_run_id: JobRunId,
    trace_context: SandboxTraceContext,
    selection: SandboxStoredMaintenanceJobSelection,
    initial_page_request: SandboxJobPageRequest,
    batches: &'a [SandboxMaintenanceBatchOutcome],
    original_report_status: SandboxJobReportStatus,
    final_outcome: SandboxReplaySurfaceOutcome,
    started_at: Timestamp,
    finished_at: Timestamp,
}

impl<'a> SandboxMaintenanceJobReportWriteSource<'a> {
    pub(crate) fn try_from_finalizer_input(
        stored_result_ref: SandboxStoredOperationResultRef,
        input: FinalizeSandboxJobReportInput<'a>,
        finished_at: Timestamp,
    ) -> ApplicationResult<Self>;

    pub(crate) fn validate_shape(&self) -> ApplicationResult<()>;
    pub(crate) fn batches(&self) -> &'a [SandboxMaintenanceBatchOutcome];
    pub(crate) fn original_report_status(&self) -> SandboxJobReportStatus;
    pub(crate) fn finished_at(&self) -> &Timestamp;
}
```

`try_from_finalizer_input`消费permit但只保留borrow；它是status、selection、run、trace、start/finish和outcome join的唯一fresh
constructor。`SandboxMaintenanceJobReportSurfaceDraft::try_from_finalizer_input`旧owned factory删除。fresh store按canonical
batch/item字段迭代write source并在同一UoW stage完整rows/immutable payload；它可以编码每个字段到persistence owned values，
但不能构造第二个完整内存`Vec<Batch>`。commit前任一错误使surface/carrier/completion均不可见；commit unknown进入既有inspection。

finalizer成功顺序固定为：

```text
validate borrowed input outside write UoW
  -> exact-read Reserved record + Version
  -> allocate/freeze stored and surface identities
  -> read application clock once as report_recorded_at
  -> construct borrowed write source
  -> stage complete typed JobReport by iterating borrowed batches/items
  -> stage generic carrier with recorded_at == report_recorded_at
  -> mark idempotency Completed with terminal_at == report_recorded_at
  -> atomic commit confirmed
  -> construct SandboxFinalizedJobReport from committed source/outcome/time
  -> return; finalization future ends and caller borrow is released
```

`SandboxFinalizedJobReport`只能在commit confirmed后构造；pre-commit error、rollback或StatusUnknown均不返回witness。witness的
`report_status`与`report_recorded_at`复制的是同一已提交write source的值，不构成第二derivation或第二clock读取。

### 40.11 Worker relay compatibility

Worker relay继续以invocation-local唯一`Vec`累积batch，但terminal改为：

```rust
let finalizable = SandboxFinalizableJobPermit::try_publish_sandbox_event_relay(permit)?;
let input = FinalizeSandboxJobReportInput::try_new(finalizable, batches.as_slice())?;
let completion = service.finalize_job_report(input).await?;
let entry_completed_at = trusted_clock.now()?;
return SandboxRelayLoopResult::finish_fresh(
    run_context,
    completion,
    entry_completed_at,
);
```

borrow在`await`返回后结束；Worker随后drop本地batch vector，不需要把它放入result。duplicate分支只调用
`SandboxRelayLoopResult::duplicate_replayed(run_context, outcome, entry_completed_at)`，不构造finalizer input或fresh witness。
因此C-1B的semantic closure保持，但旧“预读`input.report_status()`并自由传入`finish`”被本节替换。

### 40.12 Static owner audit

| audit | expected | current result |
|---|---:|---:|
| finalizer logical helper | `1` | `1`；不是第43个entry |
| finalizer owned permit | `1` | `1` |
| finalizer owned complete batch chain | `0` | `0` |
| borrowed complete chain | `1` | `1` |
| fresh status derivation owner | `1` | application constructor only |
| write-side complete-chain clone/rebuild | `0 / 0` | `0 / 0` |
| borrow escape / detached task / `'static` | `0 / 0 / 0` | `0 / 0 / 0` |
| public DTO/callable/job-kind delta | `0 / 0 / 0` | `0 / 0 / 0` |
| new L1/L2 blocker | `0` | `0` |

```text
current_document = 03-详细设计.md
current_step = Step 7 regression / 7R-06
current_sub_batch = 7R-06C-1C-R service facade borrowed finalizer foundation drafted
artifact = 03_ddd_step_07_service_facades_inputs_outputs.md
artifact_content_status = drafted_pending_eof_activation
artifact_review_status = not_current_until_eof_activation
current_authority = historical_position_foundation_only
finalizer_batch_ownership = borrowed_slice
finalizer_output = SandboxFinalizedJobReport
application_fresh_status_deriver_count = 1
owned_complete_batch_chain_count = caller_only_1
new_public_dto = 0
new_application_callable = 0
new_l1_l2_blocker = 0
next_allowed_action = update_typed_store_borrowed_write_surface
formal_03_writeback = forbidden
implementation = not_started
real_test_execution = not_started
real_evidence_created = no
acceptance_signoff = no
commit_required = no
```

---

## Historical-Position Draft (superseded): `S7-03B` `start_controlled_execution_run` exact launch ordering

本节曾被插入 facade 产物前部，消费 `S7-02D` reservation-only authority、Step 6 run identity overlay和 `S7-03B` lifecycle port契约。§8.2、§48及
其它历史位置中把idempotency reservation与 `Preparing` run隐含为同一write group的文字，均按
`historical_conflicting_material`处理。该位置不是 current authority；public facade method和 `StartControlledExecutionRunInput` schema不变。

### Current application algorithm

```text
start_controlled_execution_run(ctx, input)
  -> validate fixed operation/channel/authority/digest/idempotency key
  -> reserve_fresh_operation in reservation-only UoW
       DuplicateReplayed -> return exact stored command surface; zero business read/allocation/port/write
       Existing conflict/in-flight/failed -> return typed application error; zero business body
       FreshReserved staged -> commit reservation-only UoW
       commit NotCommitted/StatusUnknown -> stop or inspect reservation; zero business body
       commit Confirmed -> retain FreshReservationOwnership and continue
  -> exact-read context/identity/requirement/boundary/capability/handle/lease/policy
  -> allocate run/capture/launch-failure refs exactly once
  -> ControlledRunIdentityBundle::try_from_generated
  -> one clock snapshot -> RunLaunchFreshnessCheck
  -> ControlledExecutionRun::prepare
  -> preparation UoW: create Preparing run + capture/audit/launch-recovery relation
  -> preparation commit confirmed; drop UoW
  -> fresh-read exact Preparing group and committed reservation
  -> require_prebound_launch_failure_ref + authorize_launch
  -> build LaunchControlledRunRequest from committed permit/ref/handle/generation
  -> call launch port outside UoW
  -> validate finite result, or inspect exact same correlation on side-effect unknown
  -> fresh-read exact run/recovery group + Version
  -> finalization UoW: apply exactly one branch, stage full stored surface/carrier/idempotency completion
  -> commit confirmed -> return SandboxServiceOutcome
```

### Five-way launch result closure

| branch | exact owner action | resulting truth | prohibited shortcut |
|---|---|---|---|
| `Launched` | validate observation/permit/ref/time -> `run.mark_running` -> save run | `Preparing -> Running`，prebound failure ref retired | create failure、reuse old Version |
| `BackendLaunchFailed` | observation -> marker -> marker set -> `FailureClassification::classify(same prebound ref)` -> `require_run_failure_basis` -> `run.mark_failed` -> create failure + save run | classification `Classified`；run `Preparing -> Failed`，terminal basis引用同一ref | second ref、`PendingInput`、`mark_terminal`、adapter direct status write |
| `NotLaunched` | keep exact `Preparing` recovery point；仅在完整revalidation后允许same-key retry policy | run/ref均不变 | 新run/capture/failure ref、把absence猜成success |
| `Unavailable` | strict hold并保留原external-effect unknown relation | `Preparing`，未知副作用未被终结 | blind retry、映射为`NotLaunched`或`Failed` |
| `Conflicted` | typed conflict observation交formal failure/control/redline owner；matching checked basis决定run `Failed | Terminated` | safety owner single winner | port直接改run、替换prebound ref、last-write-wins |

preparation commit unknown先检查 committed reservation + complete candidate run/recovery relation。post-call finalization commit unknown
检查run、prebound ref、matching classification/terminal basis、stored surface和idempotency completion；任一proper subset都进入
integrity hold。两者都不得重新调用launch、重分配identity或从缺失stored output推断外部side effect未发生。

```text
current_document = 03-详细设计.md
current_step = Step 7 regression / 7R-03B
facade = start_controlled_execution_run
public_method_delta = 0
public_input_delta = 0
committed_uow_sequence = reservation_only,run_preparation,finalization
launch_finite_branches = 5/5
launch_failure_mark_terminal = forbidden
duplicate_business_external_rerun = 0/0
new_l1_l2_blocker = 0
formal_03_modified_by_overlay = no
implementation = CB-SBX-01A blocked / wait_design
commit_required = no
```

---

## EOF Current Recovery Override: `S7-02D-B3-1` facade source ready

本节位于物理EOF并覆盖本文所有前置facade overlay。三类surface source归application；未新增public callable。

```text
current_document = 03-详细设计.md
current_step = Step 7 regression / 7R-02D in_progress
current_batch = S7-02D idempotency / stored result / facade join
batch_status = in_progress
gate_status = content_in_progress
completed_internal_sub_batch = S7-02D-B3-1
current_internal_batch = S7-02D-B3
surface_source = application_owned_transport_neutral
public_callable_added = 0
query_write = 0/13
next_allowed_action = write_s7_02d_b3_batch_2
ref_blocker = in_progress_wait_s7_02d
formal_03_07 = historical_reviewed_revalidation_pending
implementation = CB-SBX-01A blocked / wait_design
commit_required = no
```

---

## EOF Current Overlay: `S7-02D-B3-1` facade surface-source join

B3-1没有新增第43个public callable。29个fresh non-Query callable后续只把其validated original outcome parts交给
application-owned surface draft；API/worker/jobs不拥有stored schema。duplicate仍在business read、selection、external call和
identity allocation前结束。

```text
current_document = 03-详细设计.md
current_step = Step 7 regression / 7R-02D in_progress
current_batch = S7-02D idempotency / stored result / facade join
batch_status = in_progress
gate_status = content_in_progress
completed_internal_sub_batch = S7-02D-B3-1
current_internal_batch = S7-02D-B3
surface_source = application_owned_transport_neutral
command_surface = complete
consumer_surface = complete_without_worker_dependency
job_surface = complete_without_jobs_dependency
public_callable_added = 0
query_write = 0/13
next_allowed_action = write_s7_02d_b3_batch_2
ref_blocker = in_progress_wait_s7_02d
formal_03_07 = historical_reviewed_revalidation_pending
implementation = CB-SBX-01A blocked / wait_design
commit_required = no
```


### 1.2 本批已读输入与效力

| 输入 | 读取重点 | 本批使用方式 |
|---|---|---|
| Step 7 SOP | 按模块定义 capability、exact trait、参数、返回、错误、依赖和停审 | 约束本文件结构与 10/10 callable 门禁。 |
| 详细设计书写规范 §5.5 / §5.6 | trait Rust 片段、关键函数、错误和索引格式 | 约束可落码表达，不声明实现已编译。 |
| 真相源闭环与可落码性标准 | 字段来源、DTO 构造、UoW / Version、stored replay、read/write 对称 | 约束 input 不夹带 owner truth，output 可完整 replay。 |
| Step 4 / Step 5 | application 文件 owner 与依赖方向 | facade 固定在 `services.rs`，10 个 input 分别固定在已有 use-case service 文件。 |
| Step 6 shared / context / policy / failure / application 分件 | current ref、value、factory、guard、outcome、error 和 entry context | 所有字段和函数只引用 canonical type；不创建 domain 同义类型。 |
| Step 6 handoff §10 | `S7H-01~04`、42 entry、15 contract group、六 blocker | `7R-01`关闭42个application callable及`INPUT-001`；repository、port、read和entry责任继续移交后续批次。 |
| historical Step 7 / HLD callable tables | 旧 method 名和输入缺口 | 只作前后对比；旧结果字段、opaque ref、generic dispatch和guard-only shortcut失效。 |

冲突裁决顺序固定为：

```text
Step 7 SOP / writing standard
  -> Step 5 module and file owner
  -> Step 6 canonical object / application carrier
  -> 6R-07 S7H handoff
  -> this current 7R-01 artifact
  -> historical Step 7 / HLD / formal 03 (diagnosis only)
```

### 1.3 L1 / L2 / L3 粒度裁决

10个Command按Sandbox主流程或安全收束路径以`L1`展开；13个Query按L2只读保障契约闭合，但不得弱化L1 truth；9个Consumer和10个Job按影响分级，安全truth、external attempt、cleanup/reaper/redline及reconciliation原子关系按L1，普通refresh/projection/derived维护按L2停止。普通审计、观测hook、错误记录和运维报告只保留最小接缝；审查与回填只保留L3 Gate轮廓。

以下情形即使表现为异常，也保持 L1：partial handle、lease expiry、release unknown、cleanup / reaper failure、commit unknown、silent isolation degradation、capture partial、handoff no-rollback 和 security redline。

---

## 2. SOP 问题回答

| SOP 问题 | `7R-01A` current 回答 |
|---|---|
| 哪个模块拥有 service trait | `application` 唯一拥有 `SandboxCommandService`；planned definition 为 `crates/application/src/services.rs`。 |
| 哪些模块调用 | `api` 可调用全部 10 个 method；`worker` 只可调用 `StartControlledExecutionRun`、`RecordCaptureResult`、`OpenMaterialHandoff`、`ClassifySandboxFailure`；consumer / jobs 使用后续独立 facade。 |
| 如何 dispatch | 每个 `SandboxCommandKind` variant 对应一个独立 method 和独立 input carrier。禁止 `run_command(String, ..)`、generic enum payload、route string 或 `OperationName` 反向分派。 |
| call context 放什么 | selector 映射、channel、actor、trace、request digest 和 idempotency key只在 `SandboxServiceCallContext`；业务 input 不复制这些字段。 |
| input 放什么 | 只放 caller 能合法声明的 typed selector、explicit requirement component、trusted source intent；不放 application 生成 identity、clock、audit、relay、stored result、Version / UoW、guard body或 adapter outcome。 |
| output 是什么 | 统一 `ApplicationResult<SandboxServiceOutcome>`；fresh write 必须携带完整 `SandboxStoredOperationResult`，duplicate 只 replay stored surface。 |
| error 是什么 | 统一 `SandboxApplicationError`；domain / port / repository error在 application mapper穷尽转换，raw provider cause不得穿透。 |
| async / transaction | 10 个 facade method 均为 `async fn`；idempotency reservation、truth write、audit / relay draft和 stored result按各命令的原子组提交。external side effect需要 pre-call recovery point时分两段 UoW，不能跨网络持有数据库事务。 |
| Version / CAS 从哪里来 | 只由后续 `7R-02` repository `get_with_version` 返回 core `Version`；caller input 与 protocol DTO不得携带 expected version。 |
| guard 从哪里来 | input最多携带受信任entry或runtime binding已获准选择的 typed guard ref；application加载 active immutable rule snapshot并验证 exact ref / generation / activation。raw payload不得任意构造guard identity，guard fields、decision和 bool 不得由 caller传入。 |
| DTO 如何承接 | Step 8 只能逐字段构造本文件 input；无 source 的 input field不得出现在 protocol，input不存在的 status / decision / result字段不得由 DTO新增。 |
| fake parity | 后续 `7R-05` 对每个 method覆盖 fresh、duplicate、typed rejection / degraded、安全失败、unavailable和 commit-unknown；fake不得省略 guard / UoW / stored replay。 |

本批不画新的模块图：Step 5 已固定依赖图，本批的新增信息是函数级 typed contract，Rust 片段和矩阵比重复模块图更直接。依赖方向继续为：

```text
core-contracts <- contracts <- domain <- application <- infra
                                             ^
                                             |
                                    api / worker / jobs
```

---

## 3. Historical 诊断、前后对比与取舍

### 3.1 Historical material ledger

| historical material | current 问题 | current 处置 |
|---|---|---|
| 10 个 method 引用同名 `*Input`，但没有 type definition | 实现者无法确定字段、来源、optional、DTO mapping和owner | method 名保留；10 个 input在本文件逐个 exact 定义。 |
| `OpenControlledExecutionContext` 接受 `ContextRefSummarySet` 或 guard body候选 | caller可伪造 resolver / guard 判断 | 只接受 source refs、responsibility和typed active guard ref；summary / marker / decision由 resolver与guard产生。 |
| boundary input 接受 capability summary ref、profile / template或四维摘要 | generation / capability truth可能被 caller选择，十维不完整 | caller只交 explicit checked components；application / runtime binding加载 profile、template、generation、capability和guard。 |
| policy input 接受 `AuthorizationSummary`、`HighRiskActionMarkerSet` | caller可直接提交正式 policy outcome | input只给 owner refs和 source requirement / requested marker source selector；port mapper生成 binding、summary和marker。 |
| run input接受 `LaunchRequestSummary` | 未定义，可能吸收 tool semantics / runtime loop | run input只选择 exact committed context / boundary / policy decision；launch permit与backend correlation由application形成。 |
| capture input接受 output summary、material rows、observability object和failure reason | caller可选择 canonical capture status / material truth | input只选择 exact completed run和 trusted capture trigger；adapter返回 candidate，application组装 fact/material/observability。 |
| handoff input接受 aggregate refs / status | last receipt或 caller status可覆盖 per-target progress | input只选择 exact source和 validated target plan；application加载完整 source group并创建全量 pending progress。 |
| control input接受裸 kind + guard ref | target lineage、source identity和existing controls无法证明 | input明确 target selector、kind、source context和typed guard ref；intent ref/time由application生成。 |
| failure input接受 `Vec<SandboxOpaqueRef>` 或 optional status refs | kind / impact可由 caller或文本推断 | input使用 closed typed source selector / observation；application加载 owner object并构造 marker set。 |
| cleanup input接受 capture / handoff / investigation摘要拼接 | partial handle、terminal run、redline coverage和release recovery分支丢失 | input只选择 exact cleanup subject与strict guard ref；application按 subject加载完整 evidence group。 |
| redline input接受 `SecurityRedlineKind`、release bool或 investigation summary | caller可选择 security kind / disposition | input只给 typed redline source selector与strict guard ref；kind、impact、requirements和status由source/guard派生。 |

### 3.2 改动前后

| 主题 | before | current after |
|---|---|---|
| dispatch | method名较细但 input悬空 | 10 independent method + 10 independently defined carrier。 |
| metadata | 可能重复在每个 input | 统一由 checked `SandboxServiceCallContext` 承载。 |
| identity | caller / adapter可提供 object ref | application typed generator产生；source owner预绑定ref则从exact committed owner读取。 |
| truth source | caller可提交 status / summary / fact候选 | caller只提交意图；application加载 truth，port返回 typed finite outcome，domain factory定格。 |
| transaction | 族级“同事务”描述 | 每命令列原子写集、external-call split、duplicate和 commit-unknown处置。 |
| safety | ordinary error与关键unknown混在摘要中 | L1安全失败逐命令 fail-closed；unknown不得当 absent / success。 |
| output | generic outcome，stored relation不明确 | 统一 outcome但强制 fresh / duplicate完整 stored surface关系。 |

### 3.3 设计取舍

| 候选方案 | 结论 | 理由 |
|---|---|---|
| 单一 `execute_command(kind, payload)` | 不采用 | payload需要未定义union或动态downcast，削弱10/10 exhaustiveness。 |
| 10 method + 一个大 input enum | 不采用 | variant与method重复，仍允许wrong variant / method组合。 |
| 10 method + 10 input carrier | 采用 | method签名在编译期固定variant，Step 8可逐协议机械映射。 |
| 每个 input复制 actor / trace / key | 不采用 | 会产生两份调用元数据和mismatch分支。 |
| caller提供所有已解析owner object | 不采用 | 把 repository / resolver / policy / backend truth移到protocol边界。 |
| caller只给字符串 / opaque ref | 不采用 | 无法证明 kind、lineage、generation和source authority。 |
| input允许 guard ref但不允许 guard body | 有条件采用 | active rule选择需要typed identity；rule内容必须由application trusted loader取得。 |

---

## 4. 共同 Application Contract

### 4.1 Planned owner 与 visibility

| contract | unique planned owner | visibility / persistence | prohibited duplicate |
|---|---|---|---|
| `SandboxCommandService` | `crates/application/src/services.rs` | public application trait；transient | api / worker local service trait、infra facade。 |
| `OpenControlledExecutionContextInput` | `crates/application/src/intake_service.rs` | public constructor + read-only getters；transient | protocol DTO alias、domain request object。 |
| `EstablishExecutionBoundaryInput` | `crates/application/src/boundary_service.rs` | 同上 | infra boundary request。 |
| `EvaluatePolicyExecutionInput` | `crates/application/src/policy_service.rs` | 同上 | policy provider DTO。 |
| `StartControlledExecutionRunInput` | `crates/application/src/run_service.rs` | 同上 | runtime / tool launch request。 |
| `RecordCaptureResultInput`;`OpenMaterialHandoffInput` | `crates/application/src/capture_handoff_service.rs` | 同上 | adapter candidate / handoff receipt。 |
| `SubmitSandboxControlInput`;`ClassifySandboxFailureInput` | `crates/application/src/failure_control_service.rs` | 同上 | consumer envelope / domain fact。 |
| `EvaluateCleanupReadinessInput` | `crates/application/src/cleanup_service.rs` | 同上 | cleanup view selector / backend release request。 |
| `RecordRedlineContainmentInput` | `crates/application/src/redline_service.rs` | 同上 | security provider payload / investigation receipt。 |
| `ApplicationResult<T>`;`SandboxServiceOutcome` | Step 6 application canonical owner | transient output；stored surface独立持久化 | per-command result wrapper。 |

### 4.2 Facade exact trait

```rust
/// Sandbox 的 10 个写入型 use case facade；entry 只能经独立 method 调用。
pub trait SandboxCommandService: Send + Sync {
    /// 打开正式受控执行语境并形成 acceptance / pending / rejection truth。
    async fn open_controlled_execution_context(
        &self,
        ctx: SandboxServiceCallContext,
        input: OpenControlledExecutionContextInput,
    ) -> ApplicationResult<SandboxServiceOutcome>;

    /// 合成十维 hard requirements并尝试建立隔离环境边界。
    async fn establish_execution_boundary(
        &self,
        ctx: SandboxServiceCallContext,
        input: EstablishExecutionBoundaryInput,
    ) -> ApplicationResult<SandboxServiceOutcome>;

    /// 对 exact established boundary执行 immutable policy / high-risk裁定。
    async fn evaluate_policy_execution(
        &self,
        ctx: SandboxServiceCallContext,
        input: EvaluatePolicyExecutionInput,
    ) -> ApplicationResult<SandboxServiceOutcome>;

    /// 在 accepted policy与active isolation owner group上启动受控 run。
    async fn start_controlled_execution_run(
        &self,
        ctx: SandboxServiceCallContext,
        input: StartControlledExecutionRunInput,
    ) -> ApplicationResult<SandboxServiceOutcome>;

    /// 从 exact completed run采集并定格 immutable capture group。
    async fn record_capture_result(
        &self,
        ctx: SandboxServiceCallContext,
        input: RecordCaptureResultInput,
    ) -> ApplicationResult<SandboxServiceOutcome>;

    /// 为 exact capture或formal terminal source打开完整 target-plan handoff。
    async fn open_material_handoff(
        &self,
        ctx: SandboxServiceCallContext,
        input: OpenMaterialHandoffInput,
    ) -> ApplicationResult<SandboxServiceOutcome>;

    /// 对 exact Sandbox target提交 typed control intent。
    async fn submit_sandbox_control(
        &self,
        ctx: SandboxServiceCallContext,
        input: SubmitSandboxControlInput,
    ) -> ApplicationResult<SandboxServiceOutcome>;

    /// 从 closed typed source形成或推进 failure classification。
    async fn classify_sandbox_failure(
        &self,
        ctx: SandboxServiceCallContext,
        input: ClassifySandboxFailureInput,
    ) -> ApplicationResult<SandboxServiceOutcome>;

    /// 从 exact owner group与完整 safety evidence形成 cleanup guard decision。
    async fn evaluate_cleanup_readiness(
        &self,
        ctx: SandboxServiceCallContext,
        input: EvaluateCleanupReadinessInput,
    ) -> ApplicationResult<SandboxServiceOutcome>;

    /// 从 typed security signal形成不可 advisory-only 的 redline containment truth。
    async fn record_redline_containment(
        &self,
        ctx: SandboxServiceCallContext,
        input: RecordRedlineContainmentInput,
    ) -> ApplicationResult<SandboxServiceOutcome>;
}
```

`async fn`表示 facade允许 repository / resolver / external port I/O；它不授权跨await持有UoW。具体 transaction split见各命令矩阵，并由 `7R-02/03` exact port和Step 9 flow继续落码。

### 4.3 Call-context preflight

每个 method在 reservation前执行共同 preflight：

1. `ctx.operation_name()` 必须等于该method固定 `SandboxCommandKind` 的 canonical mapping。
2. `ctx.channel()` 必须属于 §4.4 allow-set；wrong channel返回 typed `ChannelMismatch`，不reserve、不读业务truth。
3. `ctx.requires_idempotency() == true`，key / digest / trace / actor已经由 Step 6 checked factory验证。
4. 若 input包含 responsibility或source actor relation，必须与 `ctx.actor_ref()`和`ctx.trace_context()`逐项一致。
5. reserve identity只使用 `operation_name + request_digest + idempotency_key`；channel、actor、clock和route不进入duplicate key。

### 4.4 Caller allow-set

| method | `ApiCommand` | `Worker` | `Consumer` / `Job` | 说明 |
|---|---:|---:|---:|---|
| `open_controlled_execution_context` | yes | no | no | 正式同步入口；consumer / job不得匿名补开context。 |
| `establish_execution_boundary` | yes | no | no | runtime binding由application assembly，不由worker选择。 |
| `evaluate_policy_execution` | yes | no | no | policy refresh走后续consumer / job facade。 |
| `start_controlled_execution_run` | yes | yes | no | worker仅承接Sandbox-owned launch boundary，不承接agent loop。 |
| `record_capture_result` | yes | yes | no | worker只触发typed collection，不上传raw output body。 |
| `open_material_handoff` | yes | yes | no | worker不得改变target plan或宣布downstream truth。 |
| `submit_sandbox_control` | yes | no | no | inbound control event走独立consumer callable。 |
| `classify_sandbox_failure` | yes | yes | no | worker只提交typed observation selector，不提交kind/status。 |
| `evaluate_cleanup_readiness` | yes | no | no | cleanup maintenance走独立job callable。 |
| `record_redline_containment` | yes | no | no | lifecycle / investigation signal走独立consumer callable。 |

### 4.5 Unified output / error / stored replay

```rust
/// 所有 application facade 的统一 typed result。
pub type ApplicationResult<T> = Result<T, SandboxApplicationError>;
```

| path | `SandboxServiceOutcome`要求 | write / side effect要求 |
|---|---|---|
| fresh accepted | `Accepted` + non-empty exact truth refs + complete stored result | truth、audit、relay draft、stored result和idempotency completion按命令原子组提交。 |
| fresh rejected | `Rejected` + complete stored rejection surface + non-empty safe reason | 不生成success truth；允许同UoW rejection truth / audit，duplicate可完整replay。 |
| fresh degraded | `Degraded` +诚实truth refs + complete stored result + exact safe reasons | 只在canonical object明确允许 degraded / partial时使用；不得把unknown当degraded success。 |
| fresh failed | `Failed` + complete stored failure surface | 不伪造success ref；若已有不可回滚 source truth，必须保留其 exact refs。 |
| duplicate | `DuplicateReplayed` + original `SandboxStoredOperationResult` | write set、id generation、resolver / external port和new audit/relay调用均为0。 |
| in-flight / identity conflict | `Err(SandboxApplicationError)` | 不重入，不覆盖原record，不产生第二套identity。 |

普通 audit / observability hook失败只按L2最小保障规则处理：mandatory audit / relay draft无法在要求的UoW内stage时整个命令失败或保持已定义的pre-call recovery state；非主体telemetry hook失败不得改写canonical truth，也不得静默吞掉需要升级为L1的 isolation / capture / cleanup / redline失败。

### 4.6 Caller 永久禁止字段

所有 10 个 input carrier 均不得新增以下字段：

```text
generated object / attempt / audit / relay / stored-result ref
Timestamp / checked elapsed / repository Version / UoW handle
canonical status / decision / disposition / side-effect refs
guard rule body / enable flag / allow-on-missing / release bool
backend handle / lease window / generation selected by caller
raw policy / tool / runtime / member / artifact / observability / investigation body
path / URL / command / stdout / stderr / secret / SDK response / raw error
```

---

## 5. `OpenControlledExecutionContext`

### 5.1 Capability 与 input contract

```rust
/// 打开受控语境时 caller 唯一允许提交的 body-free业务输入。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct OpenControlledExecutionContextInput {
    /// request声明且已按 kind / ref / version校验的外部 source refs。
    source_refs: ExternalSourceRefSet,
    /// actor、Work refs与request origin组成的checked责任语境。
    responsibility: ExecutionResponsibilityContext,
    /// application必须加载并验证为active的immutable intake rule identity。
    intake_guard_ref: ControlledExecutionIntakeGuardRef,
}

impl OpenControlledExecutionContextInput {
    /// 构造body-free intake input；不接受summary、resolution、decision或generated refs。
    pub fn try_new(
        source_refs: ExternalSourceRefSet,
        responsibility: ExecutionResponsibilityContext,
        intake_guard_ref: ControlledExecutionIntakeGuardRef,
    ) -> ApplicationResult<Self>;

    /// 返回request声明的外部source refs。
    pub fn source_refs(&self) -> &ExternalSourceRefSet;
    /// 返回checked责任语境。
    pub fn responsibility(&self) -> &ExecutionResponsibilityContext;
    /// 返回需要application加载的exact intake guard ref。
    pub fn intake_guard_ref(&self) -> &ControlledExecutionIntakeGuardRef;
}
```

| field | cardinality / optionality | exact source | constructor check | prohibited substitute |
|---|---|---|---|---|
| `source_refs` | required non-empty set | Step 8 command request中的typed external refs，经entry carrier校验 | 至少含`Work`和一个`Tool | Runtime | MemberHost | Runner` caller source；不含body | opaque refs、safe summary、external object正文。 |
| `responsibility` | required | entry由actor、Work refs和core request origin构造 | actor等于`ctx.actor_ref`；work refs是source refs的Work子集；不能授权 | optional actor、role字符串、route推导origin。 |
| `intake_guard_ref` | required | trusted runtime / protocol选择的active rule identity | named ref合法；service必须加载exact active immutable guard及其exclusion guard | `SandboxOpaqueRef`、guard body、required-kind列表、allow flag。 |

`source_refs` 的构造下限与 acceptance 下限不同：`open_pending`允许缺少Identity source，以便诚实记录
`Unresolved`；但guard的required set固定包含`Identity + Work + caller source`，且reference resolution与context
source set必须双向同源覆盖。因此缺Identity时只能得到pending/unresolved/rejected surface，resolver不得注入request
未声明的额外Identity source，也不得由application用actor ref、display name或latest identity补齐后Accepted。

### 5.2 Service assembly 与事务

| phase | application-owned action | result / invariant |
|---|---|---|
| preflight | 固定command kind/channel；验证responsibility与ctx actor / trace；reserve idempotency | conflict / in-flight无业务读写；duplicate直接replay。 |
| resolution | 生成context、reference-resolution、execution-resolution refs；`open_pending`；调用typed resolver | resolver只返回body-free refs / summaries / forbidden markers；不保存external body。 |
| guard | 加载input指定的active intake guard和其exact exclusion guard；pure evaluate | missing/stale/mismatched guard fail-closed；caller不能替代required source set。 |
| accepted assembly | 生成environment identity ref；context accept；identity bind | accepted context、resolved snapshots与active identity必须同一UoW。 |
| non-accepted assembly | 按decision形成pending / unresolved / rejected context | 不生成environment identity；rejected / unresolved reasons来自typed owner。 |
| commit | stage context、immutable resolutions、optional identity、audit、relay draft、stored result、idempotency complete | accepted路径遵守Step 6 §12.3固定顺序；任一stage失败rollback且generated refs不可见。 |

该命令没有external side-effect split：resolver是只读接缝；所有Sandbox truth在一个UoW提交。commit unknown必须先按idempotency identity和预生成context ref inspect，不能新建第二个context。成功输出至少包含context / resolution refs，accepted时还包含identity ref；具体 `SandboxTruthRefSet` variant由Step 6 canonical union决定。

### 5.3 安全失败与 redline

| condition | finite handling | forbidden handling |
|---|---|---|
| required source unavailable | 持久化`Unresolved`或可信`PendingResolution` stored surface | 默认accept、复用旧summary。 |
| conflict / invalid / forbidden body | rejected；保留typed reason / marker关系 | 把forbidden body保存为诊断或降级放行。 |
| guard missing / inactive / wrong ref | application error或rejected（由typed loader outcome固定），始终fail-closed | runtime default guard、caller嵌入guard。 |
| accepted group half-stage / commit unknown | rollback或inspect exact context/idempotency；unknown保持unknown | 单独提交accepted context后补identity。 |

### 5.4 DTO source requirement

Step 8 request只能提供 external typed ref列表、responsibility字段和`ControlledExecutionIntakeGuardRef`。它不得提供context / resolution / identity ref、safe summary、forbidden marker判断结果或acceptance status。Step 8 mapping必须证明request actor与`SandboxServiceCallContext` actor相等。

---

## 6. `EstablishExecutionBoundary`

### 6.1 Capability 与 input contract

```rust
/// caller为一个accepted context声明的十维checked hard-boundary组件。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct EstablishExecutionBoundaryInput {
    /// exact accepted context selector。
    context_ref: ControlledExecutionContextRef,
    /// context acceptance原子绑定的active environment identity selector。
    environment_identity_ref: ExecutionEnvironmentIdentityRef,
    /// CPU / memory / wall-clock / IO四维完整hard limit set。
    resource_limits: ResourceLimitSet,
    /// strict root / host-write / special-file / device / symlink requirement。
    filesystem: FilesystemBoundaryRequirement,
    /// deny-all或显式allowlisted egress requirement。
    network: NetworkBoundaryRequirement,
    /// namespace / privilege / subprocess / signal / count requirement。
    process: ProcessBoundaryRequirement,
    /// Work-bound writable-surface与escape requirement。
    workspace: WorkspaceBoundaryRequirement,
    /// ordered-unique private mount rules与host/device prohibition。
    mounts: MountBoundaryRequirement,
    /// lease / renewal / orphan / cleanup / reaper hard lifecycle requirement。
    lifecycle: BoundaryLifecycleRequirement,
}

impl EstablishExecutionBoundaryInput {
    /// 构造十维完整caller requirement；不接收profile、generation、capability或backend handle。
    pub fn try_new(
        context_ref: ControlledExecutionContextRef,
        environment_identity_ref: ExecutionEnvironmentIdentityRef,
        resource_limits: ResourceLimitSet,
        filesystem: FilesystemBoundaryRequirement,
        network: NetworkBoundaryRequirement,
        process: ProcessBoundaryRequirement,
        workspace: WorkspaceBoundaryRequirement,
        mounts: MountBoundaryRequirement,
        lifecycle: BoundaryLifecycleRequirement,
    ) -> ApplicationResult<Self>;

    /// 返回exact context selector。
    pub fn context_ref(&self) -> &ControlledExecutionContextRef;
    /// 返回exact environment identity selector。
    pub fn environment_identity_ref(&self) -> &ExecutionEnvironmentIdentityRef;
    /// 返回4/4 resource hard limits。
    pub fn resource_limits(&self) -> &ResourceLimitSet;
    /// 返回strict filesystem requirement。
    pub fn filesystem(&self) -> &FilesystemBoundaryRequirement;
    /// 返回fail-closed network requirement。
    pub fn network(&self) -> &NetworkBoundaryRequirement;
    /// 返回strict process requirement。
    pub fn process(&self) -> &ProcessBoundaryRequirement;
    /// 返回checked workspace requirement。
    pub fn workspace(&self) -> &WorkspaceBoundaryRequirement;
    /// 返回checked mount requirement。
    pub fn mounts(&self) -> &MountBoundaryRequirement;
    /// 返回hard lifecycle requirement。
    pub fn lifecycle(&self) -> &BoundaryLifecycleRequirement;
}
```

`resource_limits`内含4个canonical resource kind，其余6个field各承接一个kind，合计恰好10维。input没有`Option`：缺失一维必须在entry / constructor拒绝，不得由profile permissive补齐。

| source group | caller provides | application / runtime binding provides | port / domain produces |
|---|---|---|---|
| owner selectors | context + environment identity refs | exact committed context / identity及core `Version` | relation error或accepted / active proof。 |
| explicit requirement | 10维checked components | validated profile、limit template与“取更严格值”合成规则 | immutable `BoundaryRequirementSet`。 |
| generation | none | exact published runtime generation、profile/template/config source versions | `BoundaryGenerationBinding`。 |
| capability | none | backend selection binding | `BackendCapabilitySummary` finite fresh/stale/unavailable/conflict。 |
| guard | none | exact active coherence / capability guard snapshots | pure guard decisions。 |
| establishment | none | pre-generated requirement/decision/boundary/handle/lease/audit refs | isolation port typed outcome，domain形成decision/boundary/handle/lease。 |

### 6.2 Transaction / external-call split

```text
UoW-A: reserve + load exact context/identity + compose immutable requirement
       + stage pending establishment decision / recovery identity + audit + stored recovery surface
       + commit before backend call
external: establish environment once with persisted requirement/generation/correlation
UoW-B: inspect exact outcome + load versions + apply capability/coherence/establishment factory
       + create coherent boundary + exact handle + mandatory lease when established
       + stage audit/relay/stored result/idempotency completion + commit
```

若 chosen isolation port能在无side effect时先返回`PendingCapability | Rejected`，可在单一UoW内定格且不得创建handle / lease。任何可能创建partial backend handle的调用都必须先提交可inspect的attempt identity；不得跨external await持有UoW。

| condition | current handling |
|---|---|
| capability stale / unavailable / unsupported / unknown | pending / rejected / failed按typed decision；不得weak fallback。 |
| partial handle | 保存exact typed partial-handle relation并进入cleanup obligation；不能丢弃或只写log。 |
| backend timeout / commit unknown | inspect同一attempt / backend target；unknown不等于absent，不得生成第二handle。 |
| established result | requirement、decision、boundary、handle、lease、audit、relay、stored result原子提交；lease ref预绑定relation完整。 |
| stage-B commit failure | 恢复时先inspect backend和stored attempt；不能盲目release或重建。 |

### 6.3 安全边界

- 不读取后序`PolicyExecutionDecision`，也不因policy允许而扩大boundary。
- network unknown只能`DenyAll`或阻断，不能隐式allowlisted egress。
- resource `0`不代表unlimited；filesystem / process / mount strict bool不能由配置关闭。
- caller不能选择backend product、runtime generation、capability verdict、handle / lease identity或guard decision。
- isolation SDK / raw provider result止于infra adapter；application只消费typed establishment result。

### 6.4 DTO source requirement

Step 8 command必须逐字段提供10维checked component所需的明确单位和closed enum输入；mapping调用对应domain checked factory后才能构造本input。protocol不得接收profile/template/generation/capability/guard/handle/lease/status字段，也不得用optional缺省表达“采用平台默认放宽值”。

---

## 7. `EvaluatePolicyExecution`

### 7.1 Capability 与 input contract

```rust
/// 对exact established boundary发起一次immutable policy evaluation的caller-owned选择输入。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct EvaluatePolicyExecutionInput {
    /// exact accepted context selector。
    context_ref: ControlledExecutionContextRef,
    /// exact immutable boundary requirement selector。
    requirement_ref: BoundaryRequirementSetRef,
    /// exact established coherent boundary selector。
    boundary_ref: CoherentBoundaryRef,
    /// 本次evaluation显式要求的policy source roles；至少含strict baseline三项。
    required_sources: PolicySourceRequirementSet,
}

impl EvaluatePolicyExecutionInput {
    /// 构造policy evaluation selector；authorization summary与high-risk marker由trusted port生成。
    pub fn try_new(
        context_ref: ControlledExecutionContextRef,
        requirement_ref: BoundaryRequirementSetRef,
        boundary_ref: CoherentBoundaryRef,
        required_sources: PolicySourceRequirementSet,
    ) -> ApplicationResult<Self>;

    /// 返回exact context selector。
    pub fn context_ref(&self) -> &ControlledExecutionContextRef;
    /// 返回exact requirement selector。
    pub fn requirement_ref(&self) -> &BoundaryRequirementSetRef;
    /// 返回exact boundary selector。
    pub fn boundary_ref(&self) -> &CoherentBoundaryRef;
    /// 返回strict policy source role requirements。
    pub fn required_sources(&self) -> &PolicySourceRequirementSet;
}
```

`Approval` / `Capability` role可由request明确要求，但不能删除`LaunchPolicy + IsolationPolicy + Authorization` strict baseline。caller不提交`PolicySourceBindingSet`、`PolicyAuthorizationSummary`、`HighRiskActionMarkerSet`或任何disposition；这些只能由 policy port针对exact owner group返回并由application mapper构造。

| phase | exact input owner | application action | stable result |
|---|---|---|---|
| load | refs + repository | 加载context、identity、requirement、boundary、capability、handle及generation relation | wrong / stale relation typed fail。 |
| resolve | `required_sources` + policy port | 获取body-free binding、freshness、gap、authorization和high-risk marker candidate | raw policy / approval body永不进入application carrier。 |
| snapshot | generated snapshot ref + typed port results | 使用status-specific factory形成immutable applicability snapshot | missing/conflict/unavailable显式保留。 |
| guards | application加载active applicability / fail-closed guards | 对snapshot和完整marker set pure evaluate；预生成action/aggregate decision refs | unknown / unsupported / non-authorized high risk不允许Accepted。 |
| commit | domain decisions + audit / relay / stored | snapshot、action decisions、formal decision、audit、relay和stored result原子提交 | refresh必须创建新refs，不原地改旧decision。 |

### 7.2 Transaction、安全失败与 replay

该命令的policy port是只读summary接缝，Sandbox truth在一个UoW提交；不得跨调用保存policy body。port timeout / unavailable形成typed gap：只有全部gap被trusted source明确标识为仍在等待时可`Pending`，否则`FailClosed`或`Rejected / Blocked`，不能复用latest accepted decision。

duplicate直接replay原snapshot / action / aggregate refs与stored status，不重新调用policy port。commit unknown按预生成decision ref和idempotency record inspect；新summary到达后必须使用新idempotency operation与新refs，不得改变旧immutable attempt。

### 7.3 DTO source requirement

Step 8只映射三个 exact owner refs和closed `PolicySourceRole`集合。authorization / approval摘要refs、high-risk marker、decision status、launch validity、guard refs和reason均不是request字段。若协议需要表达“本次还要求Approval / Capability”，只能映射为`required_sources`成员，不能上传approval body或allowed bool。

---

## 8. `StartControlledExecutionRun`

### 8.1 Capability 与 input contract

```rust
/// 选择一个已经满足launch前提的Sandbox owner group；不承载tool/runtime执行语义。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct StartControlledExecutionRunInput {
    /// exact accepted context selector。
    context_ref: ControlledExecutionContextRef,
    /// exact established coherent boundary selector。
    boundary_ref: CoherentBoundaryRef,
    /// exact active isolation handle selector。
    isolation_handle_ref: IsolationEnvironmentHandleRef,
    /// exact immutable Accepted policy decision selector。
    policy_decision_ref: PolicyExecutionDecisionRef,
}

impl StartControlledExecutionRunInput {
    /// 构造launch selector；run/capture refs、freshness check和permit均由application形成。
    pub fn try_new(
        context_ref: ControlledExecutionContextRef,
        boundary_ref: CoherentBoundaryRef,
        isolation_handle_ref: IsolationEnvironmentHandleRef,
        policy_decision_ref: PolicyExecutionDecisionRef,
    ) -> ApplicationResult<Self>;

    /// 返回exact context selector。
    pub fn context_ref(&self) -> &ControlledExecutionContextRef;
    /// 返回exact boundary selector。
    pub fn boundary_ref(&self) -> &CoherentBoundaryRef;
    /// 返回exact isolation handle selector。
    pub fn isolation_handle_ref(&self) -> &IsolationEnvironmentHandleRef;
    /// 返回exact policy decision selector。
    pub fn policy_decision_ref(&self) -> &PolicyExecutionDecisionRef;
}
```

input刻意不包含`LaunchRequestSummary`、tool invocation、command、runtime loop action、runner request、backend correlation或run status。Sandbox只启动已校验的隔离环境run lifecycle；tools semantic execution和runtime agent loop由上游owner负责。

### 8.2 Preflight 与 two-phase launch

| phase | required action | invariant / output |
|---|---|---|
| exact load | context、identity、requirement、boundary、capability、handle、lease、policy decision / snapshot带core `Version`读取 | 所有context / identity / generation / handle / lease关系逐项相等。 |
| freshness | 同一次application clock读取policy age与lease age，构造`RunLaunchFreshnessCheck` | 不允许两个clock snapshot拼接；到期即阻断。 |
| prepare UoW | 生成run ref与唯一capture ref；`ControlledExecutionRun::prepare`；stage audit、attempt / stored recovery surface | `Preparing` truth与launch correlation先提交，rollback不泄露ref。 |
| external launch | fresh-read preparing group并`authorize_launch`；向isolation launch port传exact permit + persisted idempotent correlation | port不接受tool body，不能绕过active lease / Accepted policy。 |
| confirmation UoW | typed `Launched` observation -> `mark_running`，或typed terminal observation进入failure owner flow | running transition、audit、relay、stored result原子提交。 |

launch external call前必须持久化可inspect的run / correlation recovery point。timeout、adapter unavailable、backend result unknown或post-call commit unknown都不能生成第二run或第二capture ref；恢复必须inspect同一correlation。只有明确未发生且持久化规则允许时，才可复用同一run attempt重试。

### 8.3 安全失败与职责红线

| condition | handling | prohibition |
|---|---|---|
| policy non-Accepted / expired | 不调用backend；返回typed rejected / failed stored surface | boundary成立即launch、latest accepted fallback。 |
| lease expiring / expired / relation unknown | fail-closed或进入owner-definedcleanup/failure路径 | caller bool `lease_active`。 |
| handle inactive / partial / generation mismatch | 不launch；保留boundary / cleanup obligation | 重新选backend或silent handle replacement。 |
| launch failed | typed observation进入failure classification；run只能由formal failure owner变`Failed` | adapter直接写run status或用error字符串推断kind。 |
| redline / terminal control race | safety group CAS single-winner；fresh-read后由control/redline owner终止 | last-write-wins、runtime recover / business replay。 |

### 8.4 DTO source requirement

Step 8 request只携带四个 exact typed refs。run / capture identity、lease ref、generation、freshness age、permit、backend target和launch summary均从repository / runtime binding / port产生。API或worker mapping不得增加tool command、runtime action、member session或runner payload字段。

---

## 9. `RecordCaptureResult`

### 9.1 Capability 与 input contract

```rust
/// 触发对一个exact completed run执行一次body-free capture collection。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct RecordCaptureResultInput {
    /// exact completed controlled run selector；capture ref从该owner读取。
    run_ref: ControlledExecutionRunRef,
}

impl RecordCaptureResultInput {
    /// 构造capture trigger；不接受output、material、status、gap或failure reason。
    pub fn try_new(
        run_ref: ControlledExecutionRunRef,
    ) -> ApplicationResult<Self>;

    /// 返回exact completed run selector。
    pub fn run_ref(&self) -> &ControlledExecutionRunRef;
}
```

唯一 caller field 是 `run_ref`。`capture_ref`由已提交run预绑定；capture profile、material requirement、completeness guard、reason catalog和observability identity均由application/runtime binding加载或生成；`CaptureCollectionCandidate`只能由 capture port的typed outcome mapper形成。

| owner | exact source | application obligation | caller prohibited |
|---|---|---|---|
| run / capture identity | repository exact `ControlledExecutionRun::Completed` | `require_capture_target()`并证明尚无committed capture | capture ref、capture status。 |
| capture requirement | validated capture profile bound to generation | 形成minimum material requirement和strict reason catalog | required material bool / count default。 |
| collection candidate | `ExecutionCapturePort` typed outcome | body-free summary、candidate、locator、digest、size、marker关系完整映射 | stdout / stderr / file body、path、URL、raw adapter error。 |
| guard / decision | active `CaptureCompletenessGuard` + candidate | pure evaluate，status / gap / reason机械派生 | completeness guard body、complete bool、gap / reason。 |
| material / fact | application factory assembly | candidate逐项materialize并形成immutable fact | material rows、observability object、artifact / evidence ref。 |

### 9.2 Transaction、capture partial 与 commit unknown

capture port执行受控collection side effect前，run已作为独立committed terminal truth存在。collection结果返回后，application在一个UoW中原子stage：

```text
CaptureFact
  + exact CapturedMaterialRef rows (when allowed)
  + mandatory ObservabilityMaterial
  + audit trace
  + relay/projection drafts
  + complete SandboxStoredOperationResult
  + idempotency completion
```

`Complete | Partial | Failed | Unavailable`都必须形成诚实的immutable capture fact和mandatory observability material；`ForbiddenBodyRejected`不得保存任何locator。`Partial`不是success别名，也不自动创建failure classification；`Failed | Unavailable`只登记后续typed failure owner obligation。

duplicate读取同一个capture/stored result，不调用capture port。adapter timeout / source unavailable是typed finite candidate，不以raw error填reason。commit unknown先按run预绑定capture ref、observability ref和idempotency record inspect；不得生成第二capture / observability identity，也不得把unknown当absent。

### 9.3 DTO source requirement

Step 8 request只携带`ControlledExecutionRunRef`。`ExecutionOutputSummary`、material keys / locators / digests / summaries、observability ref、capture disposition/status/gaps/reasons和audit ref全部来自application / adapter / domain owner，不得进入request。

---

## 10. `OpenMaterialHandoff`

### 10.1 Closed source selector 与 input contract

```rust
/// material handoff允许选择的两类已提交Sandbox source owner。
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum MaterialHandoffSourceSelector {
    /// completed-run capture及其exact captured / observability material group。
    Capture {
        /// exact immutable capture fact selector。
        capture_ref: CaptureFactRef,
    },
    /// failed / terminated run及其formal terminal observability material。
    TerminalRun {
        /// exact terminal controlled run selector。
        run_ref: ControlledExecutionRunRef,
    },
}

/// 为一个exact source打开完整、validated target-plan handoff。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct OpenMaterialHandoffInput {
    /// 选择capture或formal terminal source，不接受散装material refs。
    source: MaterialHandoffSourceSelector,
    /// 已由entry / resolver使用closed target/source/selection matrix校验的完整plan。
    target_plan: HandoffTargetSet,
}

impl OpenMaterialHandoffInput {
    /// 构造handoff request；aggregate status、progress、attempt和receipt均由owner形成。
    pub fn try_new(
        source: MaterialHandoffSourceSelector,
        target_plan: HandoffTargetSet,
    ) -> ApplicationResult<Self>;

    /// 返回exact handoff source selector。
    pub fn source(&self) -> &MaterialHandoffSourceSelector;
    /// 返回非空、ordered-unique、完整required target plan。
    pub fn target_plan(&self) -> &HandoffTargetSet;
}
```

| selector | application exact load | allowed target plan | fail-closed check |
|---|---|---|---|
| `Capture` | capture + all captured rows + exact observability material + run lineage | 根据material coverage允许Artifact / Runtime / Runner / Observability；有formal need才允许Investigation | keys全覆盖、observability target存在、source未绑定handoff。 |
| `TerminalRun` | failed / terminated run + formal terminal basis + exact observability material | Observability / Investigation；redline terminal必须两类都有 | 不得补造capture、不得有captured selection。 |

target plan是受信任entry从validated plan input构造的typed intent，但每个`HandoffTarget`必须先经
`try_from_validated_plan`；raw caller payload不能绕过target/source/selection allow-set，`EventRelay | Other`不能
进入plan。plan不证明downstream availability、delivery或truth ownership。

### 10.2 Opening UoW 与 no-rollback

application生成handoff ref和ownership guard ref，按source调用`bind_capture_source`或`bind_terminal_source`，pure evaluate完整plan，然后在一个opening UoW中原子保存：

```text
HandoffFact(Pending)
  + complete HandoffTargetProgress(Pending) rows
  + selected source material lifecycle linkage
  + audit trace
  + relay/projection drafts
  + stored result + idempotency completion
```

本Command只打开handoff，不在同一调用内向所有target发送delivery。per-target attempt、external delivery、receipt和retry由后续consumer / job / port flow承接。opening失败不得留下partial progress；opening成功后，任一target delivery或relay失败都不能回滚capture、terminal owner、其它target receipt或handoff opening truth。

duplicate只replay原handoff和完整target plan；同一source已经绑定handoff但stored result缺失属于integrity error，不创建第二batch。commit unknown按source unique binding + handoff ref + idempotency inspect，不能把source material重新绑定。

### 10.3 DTO source requirement

Step 8 request使用closed source variant和target plan item。每个item只含`HandoffTargetKind`、matching typed `ExternalSourceRef`和`HandoffMaterialSelection`。request不得携带handoff / attempt / progress / receipt ref、aggregate或target status、relay record、artifact/evidence identity、observability ack或downstream formal truth。

---

## 11. `SubmitSandboxControl`

### 11.1 Target selector 与 input contract

```rust
/// control intent允许选择的exact Sandbox target范围。
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum SandboxControlTargetSelector {
    /// accepted context与active identity的pre-boundary control target。
    Context {
        /// exact controlled context selector。
        context_ref: ControlledExecutionContextRef,
    },
    /// coherent boundary与matching handle的无run target。
    Boundary {
        /// exact coherent boundary selector。
        boundary_ref: CoherentBoundaryRef,
        /// exact matching isolation handle selector。
        isolation_handle_ref: IsolationEnvironmentHandleRef,
    },
    /// exact controlled run及其完整owner group target。
    Run {
        /// exact controlled run selector。
        run_ref: ControlledExecutionRunRef,
    },
}

/// 提交一个typed、body-free control intent；fact identity与time由application生成。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct SubmitSandboxControlInput {
    /// exact target selector；application加载并构造`ControlTargetLineage`。
    target: SandboxControlTargetSelector,
    /// closed Sandbox control kind；`Other`始终fail-closed。
    control_kind: SandboxControlKind,
    /// external或system source的application-local body-free candidate。
    source_candidate: ControlSourceCandidate,
    /// application必须加载的exact immutable strict conflict guard identity。
    conflict_guard_ref: ControlConflictGuardRef,
}

impl SubmitSandboxControlInput {
    /// 构造control command input；不接受effect、disposition、status或existing fact refs。
    pub fn try_new(
        target: SandboxControlTargetSelector,
        control_kind: SandboxControlKind,
        source_candidate: ControlSourceCandidate,
        conflict_guard_ref: ControlConflictGuardRef,
    ) -> ApplicationResult<Self>;

    /// 返回exact target selector。
    pub fn target(&self) -> &SandboxControlTargetSelector;
    /// 返回closed control kind。
    pub fn control_kind(&self) -> SandboxControlKind;
    /// 返回application-local source candidate。
    pub fn source_candidate(&self) -> &ControlSourceCandidate;
    /// 返回exact conflict guard ref。
    pub fn conflict_guard_ref(&self) -> &ControlConflictGuardRef;
}
```

application按candidate origin穷尽调用`ControlSourceContext::{from_external | from_system}`，两者都只能使用service
call context的`trace_context`；input不携带第二trace。external source kind与control kind的合法关系由strict guard验证；
system source必须有reason，request-id key只能由call-context request id形成。caller不提供`ControlEffect`，它由kind穷尽派生。

### 11.2 Control transaction 与 side-effect split

| phase | action | atomic / safety rule |
|---|---|---|
| load/evaluate | 加载target owner group、same-scope existing controls和exact active strict guard；生成control ref/time，构造intent并evaluate | existing facts由repository exact scope读取；caller顺序和last-write不影响结果。 |
| fact UoW | `Accept | TerminalOverride | Duplicate | Conflict`分别调用exact factory，stage audit/relay/stored result | duplicate/conflict也是显式fact surface；不得静默丢弃。 |
| effect recovery | accepted effect需要external action时，先commit fact与idempotent effect correlation | 不跨external await持有UoW。 |
| effect completion | typed `ControlEffectObservation`驱动completed / failed及optional failure attach | raw runtime / backend error不写status；failure与control同UoW relation完整。 |

`Duplicate`不得重跑effect；`Conflict`不得靠更新到更晚时间解决。terminal control使run终止时必须消费formal `ControlFact`，不能由adapter直接改run。`CleanupOnly`与`InvestigationOnly`只触发相应Sandbox safety flow，不执行runtime recovery、tools replay或member lifecycle orchestration。

commit unknown必须先inspect fact / effect correlation；若fact提交但effect未知，保持Accepted并inspect，不生成第二control。control effect失败不允许伪造Completed；安全相关unknown保持待确认或typed failure。

### 11.3 DTO source requirement

Step 8只映射closed target selector、`SandboxControlKind`、closed source origin、external source/ref reason cardinality和
guard ref。application结合唯一call-context trace构造domain source context。protocol不得提交control ref、target lineage
散装refs、domain `ControlSourceContext`、第二trace、effect、existing controls、disposition/status、completion summary或
failure classification ref。

---

## 12. `ClassifySandboxFailure`

### 12.1 Closed source selector 与 input contract

```rust
/// failure classification允许消费的closed typed source owner。
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum SandboxFailureSourceSelector {
    /// exact non-accepted policy decision。
    PolicyDecision(PolicyExecutionDecisionRef),
    /// trusted adapter已经映射并通过lineage factory校验的body-free observation。
    Observation(SandboxFailureObservation),
    /// exact failed / unavailable capture fact。
    Capture(CaptureFactRef),
    /// exact terminal failed handoff fact。
    Handoff(HandoffFactRef),
    /// exact classifiable orphan recovery record。
    Orphan(OrphanRecoveryRecordRef),
    /// exact active or terminal security containment truth。
    Redline(RedlineContainmentRef),
}

/// 创建stable failure，或为既有PendingInput补齐stable typed source。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct ClassifySandboxFailureInput {
    /// owning accepted controlled context selector。
    context_ref: ControlledExecutionContextRef,
    /// `Some`表示推进exact pending fact；`None`表示创建新classification identity。
    pending_failure_ref: Option<FailureClassificationRef>,
    /// non-empty typed source selectors；pending创建的空source入口不属于本Command正常request。
    sources: Vec<SandboxFailureSourceSelector>,
}

impl ClassifySandboxFailureInput {
    /// 构造新stable classification request。
    pub fn new(
        context_ref: ControlledExecutionContextRef,
        sources: Vec<SandboxFailureSourceSelector>,
    ) -> ApplicationResult<Self>;

    /// 构造对exact `PendingInput` failure补齐source的request。
    pub fn for_pending(
        context_ref: ControlledExecutionContextRef,
        pending_failure_ref: FailureClassificationRef,
        sources: Vec<SandboxFailureSourceSelector>,
    ) -> ApplicationResult<Self>;

    /// 返回owning context selector。
    pub fn context_ref(&self) -> &ControlledExecutionContextRef;
    /// 返回optional pending fact selector。
    pub fn pending_failure_ref(&self) -> Option<&FailureClassificationRef>;
    /// 返回保持request source顺序的typed selector；domain set会按canonical priority校验。
    pub fn sources(&self) -> &[SandboxFailureSourceSelector];
}
```

`sources`必须非空。需要先保存`PendingInput`的场景由产生unknown typed observation的owner flow明确创建，不允许API caller用空数组制造无限pending。`pending_failure_ref`只允许指向同context、同identity的`PendingInput`，不能重开Classified / Superseded / Terminal。

### 12.2 Marker assembly、原子写与安全影响

application逐selector加载exact owner并调用对应`FailureSourceMarker::from_*`；`Observation`已是trusted mapper从typed backend/runner/investigation outcome构造的body-free value。marker set再执行context、identity、run/boundary/handle/generation、duplicate和dominant tie校验。caller永不提供failure kind、impact、status或reason。

| source impact | same-UoW required mutation | prohibited shortcut |
|---|---|---|
| `PreLaunchBlock` | classification + audit/relay/stored result | 改写已运行run。 |
| `RunTerminal | BoundaryAndRun` | classification + matching run failure basis / transition；需要时boundary failure | adapter error直接`mark_failed`。 |
| `BoundaryAndTerminatedRun` | redline/control owner提供termination basis；failure保留relation | failure owner代替redline终止。 |
| `BoundaryAndPostRun | BoundaryOnly` | classification + exact boundary safety relation | 伪造run。 |
| `PostRunClosure` | classification + cleanup preservation obligation | capture/handoff failure反写run completion。 |

创建或推进classification、相关run / boundary mutation、audit、relay、stored result和idempotency completion必须按impact在同一UoW提交。此Command本身不调用backend；若source observation还未知，必须由source owner先形成typed pending/inspection流程。

duplicate replay不重新加载external source或重新确定dominant marker。commit unknown按failure ref / pending ref和idempotency inspect；不能用新ref生成第二classification。ambiguous dominant source、lineage mismatch和unknown source type均fail-closed，不退化为`SandboxFailureKind::Unknown` stable success。

### 12.3 DTO source requirement

Step 8 request可映射policy/capture/handoff/orphan/redline exact ref variant；external observation只允许来自trusted API/worker adapter已经完成finite kind、source/summary和lineage validation的protocol variant。request不得提交`FailureSourceMarker`、kind、impact、status、safe reason、boundary failure bool或raw provider error。

---

## 13. `EvaluateCleanupReadiness`

### 13.1 Closed evaluation target 与 input contract

```rust
/// cleanup evaluation选择首次owner group、既有guard重评或partial-handle failure recovery。
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum CleanupEvaluationTarget {
    /// completed / failed / terminated run owner group；application按run status选择evidence factory。
    Run {
        /// exact controlled run selector。
        run_ref: ControlledExecutionRunRef,
    },
    /// 从未形成run的established / failed boundary与partial/full handle。
    Boundary {
        /// exact coherent boundary selector。
        boundary_ref: CoherentBoundaryRef,
        /// exact matching isolation handle selector。
        isolation_handle_ref: IsolationEnvironmentHandleRef,
    },
    /// 对尚未授权release的existing cleanup truth应用fresh完整decision。
    ExistingGuard {
        /// exact existing cleanup guard selector。
        cleanup_guard_ref: CleanupGuardRef,
    },
    /// definitive partial-handle release failure后的fresh inspection recovery。
    ReleaseFailureRecovery {
        /// exact blocked prior cleanup guard selector。
        prior_cleanup_guard_ref: CleanupGuardRef,
    },
}

/// 请求application从exact owner truth组装evidence并执行strict cleanup evaluation。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct EvaluateCleanupReadinessInput {
    /// exact evaluation target，不接受capture/handoff/investigation散装拼接。
    target: CleanupEvaluationTarget,
    /// application必须加载的active immutable strict safety guard identity。
    safety_guard_ref: CleanupSafetyGuardRef,
}

impl EvaluateCleanupReadinessInput {
    /// 构造cleanup evaluation request；release、completion和status均不由caller选择。
    pub fn try_new(
        target: CleanupEvaluationTarget,
        safety_guard_ref: CleanupSafetyGuardRef,
    ) -> ApplicationResult<Self>;

    /// 返回closed evaluation target。
    pub fn target(&self) -> &CleanupEvaluationTarget;
    /// 返回exact strict safety guard ref。
    pub fn safety_guard_ref(&self) -> &CleanupSafetyGuardRef;
}
```

### 13.2 Exact evidence join

| target | mandatory application load | factory / action | forbidden omission |
|---|---|---|---|
| `Run` completed | context/identity/boundary/handle/lease/run/capture/all material/observability/optional handoff | `CleanupEvidenceSnapshot::from_completed_run` | capture Partial/Failed、handoff target progress、forbidden markers。 |
| `Run` failed/terminated | same owner group + formal terminal basis + observability + optional handoff | `from_terminal_run` | 伪造capture、忽略terminal owner。 |
| `Boundary` | context/identity/boundary/handle + optional lease | `from_boundary_only` | partial handle、prebound lease ref。 |
| `ExistingGuard` | exact guard及其owner group，fresh evidence | `CleanupGuard::apply_decision`；release已授权时本Command拒绝普通重评 | 用view或status摘要替代truth。 |
| `ReleaseFailureRecovery` | blocked prior guard + exact failure basis + fresh same-target lifecycle inspection | `from_boundary_only_release_failure`，新cleanup identity | 复活旧guard、把unknown当released。 |

所有target还必须加载完整redline lineage index coverage及exact rows、matching optional orphan和body-free`InvestigationHandoffSummary`。coverage缺失、partial page、repository unavailable或count mismatch是integrity / unavailable，不可构造空coverage。investigation summary来自exact owner或明确`NotRequired / Pending` typed source，不由caller上传status。

### 13.3 Transaction 与 release边界

本Command只形成或重评cleanup readiness truth：加载active strict guard，pure evaluate，然后`CleanupGuard::open`或合法`apply_decision`，并将guard、handoff cleanup override、audit、relay、stored result和idempotency completion按same safety group CAS在一个UoW提交。

它不调用backend release，也不把`Allowed`写成`Completed`。release authorization、pre-call recovery point、external release、inspection、completion/failure basis和owner closure属于后续独立application/job flow与Step 9；但必须遵守本文件共同L1规则：

- `Allowed`只是一份exact guard permission，不是release confirmation。
- partial handle与无lease row分支必须显式保留。
- retryable / unavailable / timeout / unknown / commit unknown保持同一authorization identity；不能回退到pending或生成第二target。
- definitive release failure终结旧guard；fresh recovery必须新guard + fresh inspection。
- lease / orphan / boundary / handle / context closure只能消费matching completion basis，不读caller bool或view。

### 13.4 DTO source requirement

Step 8 request只映射closed target variant和strict guard ref。不得携带capture / handoff / lease / orphan / redline散装状态、investigation summary、cleanup status、blocker set、allowed / release / complete bool、backend target或release receipt。

---

## 14. `RecordRedlineContainment`

### 14.1 Typed source selector 与 input contract

```rust
/// redline detection唯一允许的三类typed source选择输入。
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum SandboxRedlineSourceInput {
    /// trusted boundary observer给出的finite body-free observation。
    BoundaryObservation {
        /// exact boundary observation kind；redline kind由factory机械派生。
        observation_kind: BoundaryRedlineObservationKind,
        /// source kind只允许IsolationBackend或Runner。
        source_ref: ExternalSourceRef,
        /// 与source同kind的body-free summary。
        summary_ref: SafeSummaryRef,
        /// owner-approved caller-safe reason。
        reason: SandboxReason,
    },
    /// exact observed-attempt、non-allowed high-risk action decision。
    HighRiskDecision {
        /// exact immutable action decision selector。
        action_decision_ref: HighRiskActionDecisionRef,
    },
    /// trusted scanner命中的non-empty forbidden-body marker source。
    ForbiddenBody {
        /// stable body-free source selector。
        source_ref: ExternalSourceRef,
        /// 必须含SecretMaterial的ordered-unique marker set。
        markers: ForbiddenExternalBodyMarkerSet,
        /// matching owner safe summary。
        summary_ref: SafeSummaryRef,
        /// owner-approved caller-safe reason。
        reason: SandboxReason,
    },
}

/// 对exact execution boundary记录不可绕过的security containment detection。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct RecordRedlineContainmentInput {
    /// exact accepted context selector。
    context_ref: ControlledExecutionContextRef,
    /// optional exact run；boundary-only detection为None。
    run_ref: Option<ControlledExecutionRunRef>,
    /// exact coherent boundary selector。
    boundary_ref: CoherentBoundaryRef,
    /// exact matching isolation handle selector。
    isolation_handle_ref: IsolationEnvironmentHandleRef,
    /// typed source discriminator；不含caller-suppliedredline kind。
    source: SandboxRedlineSourceInput,
    /// application必须加载的active immutable strict containment guard identity。
    containment_guard_ref: RedlineContainmentGuardRef,
}

impl RecordRedlineContainmentInput {
    /// 构造security detection input；不接受status、release、investigation outcome或containment requirements。
    pub fn try_new(
        context_ref: ControlledExecutionContextRef,
        run_ref: Option<ControlledExecutionRunRef>,
        boundary_ref: CoherentBoundaryRef,
        isolation_handle_ref: IsolationEnvironmentHandleRef,
        source: SandboxRedlineSourceInput,
        containment_guard_ref: RedlineContainmentGuardRef,
    ) -> ApplicationResult<Self>;

    /// 返回exact context selector。
    pub fn context_ref(&self) -> &ControlledExecutionContextRef;
    /// 返回optional exact run selector。
    pub fn run_ref(&self) -> Option<&ControlledExecutionRunRef>;
    /// 返回exact boundary selector。
    pub fn boundary_ref(&self) -> &CoherentBoundaryRef;
    /// 返回exact handle selector。
    pub fn isolation_handle_ref(&self) -> &IsolationEnvironmentHandleRef;
    /// 返回typed redline source input。
    pub fn source(&self) -> &SandboxRedlineSourceInput;
    /// 返回exact strict containment guard ref。
    pub fn containment_guard_ref(&self) -> &RedlineContainmentGuardRef;
}
```

`HighRiskDecision` variant的run必须由decision保存的`observed_run_ref`精确对账且不得为None；boundary observation与forbidden-body可按Step 6 closed matrix使用optional active/terminal run。input永不接受`RedlineKind`、`RedlineImpact`、containment/release status或security rule override。

### 14.2 Detection、stop-new-use 与 recovery point

| phase | application action | required truth / safety |
|---|---|---|
| load / signal | 加载context、identity、optional run、boundary、handle和generation；按source variant调用exact `RedlineSignal::from_*` | source kind / summary / marker / observed-run / cleanup-race relation全部checked。 |
| guard / detect | 加载exact active strict guard；`evaluate_signal`；生成redline/audit refs；`RedlineContainment::detect` | 九条security rule、containment / investigation requirements不可配置删减。 |
| stop-new-use | 创建matching redline failure；active run取得redline basis并终止；boundary进入Failed；containment取得proof后`mark_contained` | normal path同一safety UoW；cleanup release race使用same group CAS且不覆盖prior failure。 |
| preservation | 组装exact run/post-run/boundary preservation snapshot并`mark_handoff_pending` | 先提交durable recovery point，才能调用investigation / handoff port。 |
| external handoff | 后续port产生typed observation，containment记录observation并由guard评估release / terminal | 本Command不接受caller investigation summary或release bool。 |

若stop-new-use需要事务外backend termination，必须先提交`Detected` truth + typed idempotent termination operation；在未取得matching termination / boundary proof前不能写`Contained`。timeout、unknown或commit unknown保持formal `Detected`与同一operation identity并inspect；不能只发告警、静默继续使用boundary或生成第二containment掩盖第一条。

同一execution lineage允许多条redline truth。检测与cleanup authorization对same safety group使用core `Version` CAS；任何query view、audit log或“最新一条redline”都不能替代完整coverage。redline `Terminal`不等于cleanup released；containment release只解除该redline的cleanup block，不恢复run/boundary/handle新使用。

### 14.3 DTO source requirement

Step 8 request按三类source variant映射finite observation / exact decision ref / forbidden marker摘要，并携带owner refs和guard ref。不得携带host path、network destination、process command、secret body、tool/runtime/member payload、raw backend/investigation response、redline kind/status、containment requirements、investigation disposition或release flag。

---

## 15. 10 Command Exact Join

### 15.1 Callable / carrier / owner matrix

| # | `SandboxCommandKind` / method | exact input owner | caller-owned business fields | application / port-owned result |
|---:|---|---|---|---|
| 1 | `OpenControlledExecutionContext` / `open_controlled_execution_context` | `intake_service.rs` | source refs、responsibility、intake guard ref | resolutions、context、optional identity。 |
| 2 | `EstablishExecutionBoundary` / `establish_execution_boundary` | `boundary_service.rs` | context/identity + 10维checked requirement | generation binding、capability、decision、boundary、handle、lease。 |
| 3 | `EvaluatePolicyExecution` / `evaluate_policy_execution` | `policy_service.rs` | context/requirement/boundary refs + required roles | bindings、snapshot、action decisions、formal decision。 |
| 4 | `StartControlledExecutionRun` / `start_controlled_execution_run` | `run_service.rs` | context/boundary/handle/policy refs | run/capture identities、freshness、permit、run lifecycle。 |
| 5 | `RecordCaptureResult` / `record_capture_result` | `capture_handoff_service.rs` | run ref | candidate、fact/material/observability group。 |
| 6 | `OpenMaterialHandoff` / `open_material_handoff` | `capture_handoff_service.rs` | source selector + target plan | handoff / full progress / recovery identities。 |
| 7 | `SubmitSandboxControl` / `submit_sandbox_control` | `failure_control_service.rs` | target selector、kind、source context、guard ref | intent/decision/fact/effect observation relation。 |
| 8 | `ClassifySandboxFailure` / `classify_sandbox_failure` | `failure_control_service.rs` | context、optional pending ref、typed source selectors | markers、classification、formal terminal basis。 |
| 9 | `EvaluateCleanupReadiness` / `evaluate_cleanup_readiness` | `cleanup_service.rs` | evaluation target + safety guard ref | evidence/coverage/decision/cleanup guard。 |
| 10 | `RecordRedlineContainment` / `record_redline_containment` | `redline_service.rs` | exact owner refs、typed source、guard ref | signal/decision/containment/failure/stop-new-use proof。 |

### 15.2 Per-command implementation checklist

| check | required result |
|---|---|
| method count / selector join | 10 variants = 10 methods = 10 input carriers；missing / duplicate 0。 |
| call context | 每个method固定operation和channel allow-set；input metadata duplicate 0。 |
| generated refs | caller-generated ref 0；source owner预绑定ref从exact owner读取。 |
| option semantics | optional只用于domain真实分支：pending failure、run absence、source variant；不用于缺省放宽。 |
| output / error | 10/10返回`ApplicationResult<SandboxServiceOutcome>`；module error只有`SandboxApplicationError`。 |
| persistence | fresh write都有complete stored replay surface；duplicate zero-write / zero-port。 |
| transaction | 每命令已声明single UoW或external-call recovery split；Version只来自repository。 |
| security | partial/unknown/commit-unknown/no-rollback/cleanup/redline分支均fail-closed且无silent success。 |
| module boundary | tool semantics、runtime loop、member lifecycle、artifact/observability/investigation body owner leakage 0。 |

### 15.3 Error mapping requirement

本文件不复制Step 6的41 detail / 16 kind error enum，但实现必须按下列source family穷尽映射：

| source error | application mapping owner | retry / result rule |
|---|---|---|
| input constructor / selector / channel | owning service input + `application::errors` | reservation前失败，write set 0。 |
| domain factory / guard / transition | owning use-case service + `application::errors` | relation error不降格为业务pending；finite guard decision按stored outcome返回。 |
| repository / UoW / Version | `7R-02` port mapper | conflict、unavailable、rollback和commit-unknown保持不同typed detail。 |
| external finite outcome | `7R-03` application port result mapper | finite rejection/degraded进入domain owner；raw cause不穿透。 |
| audit / relay L2保障 | owning service + `7R-02` repository | mandatory stage失败按原子组失败；普通telemetry失败不反写truth。 |

任何新增domain/port error variant导致mapper match非穷尽时必须编译失败并回到owner；禁止wildcard映成generic internal error或success。

---

## 16. `S7H-01`、Blocker 与下游 Handoff

### 16.1 `S7H-01` closure evidence

| `S7H-01` requirement | current evidence |
|---|---|
| 10 Command exact method | §4.2，10/10独立method。 |
| exact input carrier | §5~§14，10/10定义；closed support selector同owner section定义。 |
| field source / optionality | 每节field table或source matrix；caller/application/port三方分离。 |
| output / stored relation | §4.5，10/10统一outcome并要求complete replay。 |
| error | §4.5、§15.3，统一`SandboxApplicationError`且source family穷尽。 |
| transaction / Version / UoW | 每命令transaction section；Version caller field 0。 |
| security failure | partial handle、capture partial、handoff no-rollback、cleanup/release unknown、redline均L1闭合。 |
| Step 8 source map | 每命令独立DTO source requirement；不提前定义wire schema。 |

### 16.2 Blocker disposition

| blocker | `7R-01A` disposition | remaining owner |
|---|---|---|
| `SBX-DDD-GRANULARITY-STEP7-INPUT-001` | 10个historical Command `*Input`已由exact current schema替代；Command undefined input = 0。blocker整体仍open，因为13 Query、9 Consumer、10 Job尚未完成。 | `7R-01B~D`。 |
| `...-DISPATCH-001` | Command 10/10独立method已闭合；42/42整体仍open。 | `7R-01B~D` + `7R-06`。 |
| `...-REF-001` | Command input使用named refs，`SandboxOpaqueRef`和old version wrapper = 0；generator/repository全局仍待审。 | `7R-02`。 |
| `...-OUTCOME-001` | facade禁止adapter直接写status；exact external port/outcome尚未定义。 | `7R-03/05`。 |
| `...-READ-001` | 本批只登记exact owner loads；repository/read callable尚未定义。 | `7R-04`。 |
| `...-ENTRY-001` | DTO source requirement已固定；entry mapper尚未定义。 | `7R-06`。 |

本批没有发现需要重开Step 6的schema缺口，也没有新增L1/L2上游 blocker。六个Step 7 blocker均不得因Command部分完成而提前标记resolved。

### 16.3 `7R-01B~D` handoff

| next batch | current input from this batch | must preserve |
|---|---|---|
| `7R-01B Query` | facade独立method策略、call-context分离、统一error规则 | 13 exact selector/output、access-first、zero-write、absence/degraded；不复制Command transaction。 |
| `7R-01C Consumer` | operation/channel/idempotency/stored replay规则 | 9 source authority、dedup receipt；改变safety truth者L1，其余L2停止。 |
| `7R-01D Job` | independent callable与generated-field discipline | 10 selection/item/finalizer；cleanup/reaper/redline L1，普通maintenance L2。 |
| `7R-02` | 每命令owner load/write/UoW requirement | exact repository / Version / idempotency / audit / relay surface。 |
| `7R-03` | external-call split与finite outcome需求 | resolver / isolation / capture / handoff / investigation ports。 |
| Step 8 | 10 DTO source requirement | 只做机械wire mapping，不反向新增input field。 |
| Step 9 | 每命令transaction / safety ordering | 逐Command完整flow，不改变本文件method / carrier authority。 |

---

## 17. 正式回填草稿

本节只固定未来Step 19装配输入，不修改正式`03-详细设计.md`。

| formal target | source | must assemble | must omit |
|---|---|---|---|
| application Trait/Port | §4.2 | `SandboxCommandService` 10 exact methods、统一result/error/async rule | historical悬空input、generic dispatch。 |
| application service inputs | §5~§14 | 10 carrier Rust契约、closed selector、field source / optionality和planned path | 过程状态、historical conflict表。 |
| application critical functions | 各命令transaction section | idempotency、UoW split、stored replay、unknown/recovery和redline | 尚未定义的repository/port method签名。 |
| application error summary | §15.3 | source family到`SandboxApplicationError`的穷尽要求 | raw cause、虚构具体测试结果。 |
| module closure summary | §15~§16 | 10/10 join、scope redline、后续Step owner | blocker过程历史与停审记录。 |

正式正文必须保留可直接实现的 carrier / method / field-source契约，不能只引用本calibration文件让实现者自行拼接。

---

## 18. `7R-01A` Completion Gate

| check | current result |
|---|---|
| common facade method | 10/10 independent exact signature。 |
| exact input carrier fully defined | 10/10；support closed selector 5组，均与carrier同owner。 |
| input field source / optionality / prohibited substitute | 10/10。 |
| DTO source requirement | 10/10。 |
| transaction / external split / duplicate / commit unknown | 10/10。 |
| L1 safety condition coverage | identity、10维boundary、policy fail-closed、launch/lease、capture partial、handoff no-rollback、control/failure、cleanup/release、redline已覆盖。 |
| unified output / error | 10/10 `ApplicationResult<SandboxServiceOutcome>` / `SandboxApplicationError`。 |
| caller metadata duplication | 0。 |
| generated identity / clock / audit / relay / stored-result caller field | 0。 |
| opaque ref / string dispatch / caller status | 0。 |
| formal doc / Step 8 / implementation modified | 0。 |
| real compile / test / run / evidence / acceptance claim | 0。 |
| new upstream L1/L2 blocker | 0。 |

### 18.1 Static design audit record

| audit | expected | observed design result |
|---|---:|---:|
| `SandboxCommandKind` variants / facade methods / exact inputs | 10 / 10 / 10 | 10 / 10 / 10；missing 0，duplicate 0。 |
| input owner planned file | 10 mapped | 10 mapped to 8 existing application files；new planned file 0。 |
| independent method strategy | 10 | 10；string / route / topic dispatch 0。 |
| named ref use | current refs only | current callable中的`SandboxOpaqueRef`与old repository version use 0。 |
| generated / clock / audit / relay / stored-result caller fields | 0 | 0。 |
| canonical status / decision caller fields | 0 | 0。 |
| Rust code fences | even | 40 fences，parity 0。 |
| formal `03~07` / Step 8 / skeleton / code writes | 0 | 0。 |
| compile / test / run / evidence / acceptance claim | 0 | 0。 |

这里的结果是文档集合与结构静态审计，不是Rust编译、单元测试、集成测试、runtime run、provider evidence或
验收事实。historical名称只出现在诊断 / 禁止项中，不构成current callable引用。

`7R-01A`内容已达到完成门禁。按产物内连续执行规则，状态同步后下一唯一任务是`7R-01B` 13个Query callable；完整`7R-01A~D`完成前不设置外部停审，也不得进入`7R-02`、Step 8、正式文档或implementation。

```text
current_document = 03-详细设计.md
current_step = Step 7 regression / 7R-01B
completed_batch = 7R-01A L1 Command callable
next_batch = 7R-01B Query callable
command_methods = 10/10
command_inputs = 10/10
command_dto_source_maps = 10/10
command_undefined_inputs = 0
step_7_internal_blockers = 6/6 open with partial command evidence
formal_03_07 = historical_reviewed_revalidation_pending
implementation = CB-SBX-01A blocked / wait_design
real_test_execution = not_started
real_evidence_created = no
commit_required = no
```

---

## Historical-Position Activation Draft: `7R-06C-1B-R` Worker relay paged finalization

> 本节因重复状态块 anchor 命中文件中段，保留为 non-authoritative activation draft，不改变恢复状态。只有文件最后的
> physical EOF activation 才是 current authority。本节显式采纳前部
> `Historical-Position Foundation: 7R-06C-1B-R Worker relay paged finalization contract` 的 R1~R6 全部规则、
> 字段 join、Rust-style pseudocode、status matrix、failure boundary 和 static audit。若 B5/B6、旧 §40.6、旧 Worker mapping
> 或 `S7-03B` EOF 与本 activation冲突，只在 relay paged/finalizer channel 与 Worker handoff范围内以本节为准。

Current delta严格限定为：

1. `publish_sandbox_event_relay`、其 `SandboxJobInvocationPermit<PublishSandboxEventRelaySelection>`、
   `SandboxFinalizableJobPermit::PublishSandboxEventRelay` 和 shared `finalize_job_report` 接受原 invocation channel
   `Worker | Job`；其它八个 paged Job 与 reconciliation 仍是 `Job` only。
2. Start/Continue/finalizer全链必须保留同一个 `SandboxServiceCallContext`；Continue 的 caller context 与 permit context
   逐字段相等，禁止 Worker/Job channel中途切换。channel不进入 duplicate key，也不能产生第二 report。
3. Worker Start唯一输入 join为：`SandboxRelayLoopInvocation` 提供 context、`JobRunId`、started_at、selector context、
   selector cutoff、page limit、digest/key；Start cursor固定 `None`。started_at与cutoff取同一 trusted timestamp。
4. Worker仅在一个 async invocation 内 move-preserve完整 batch vector；nonterminal permit只进入一次 Continue，terminal permit
   只进入一次 `FinalizeSandboxJobReportInput::try_new`。Worker不复制 cursor、不flatten items、不推导status。
5. finalizer input在 move 前通过 `report_status()` 暴露 constructor-derived status；finalizer返回完整
   `SandboxServiceOutcome`。Worker只把这两项交 `SandboxRelayLoopResult::finish`。
6. fresh current relation固定为 `Succeeded | Skipped -> NoChange/Completed`、
   `PartialFailed | Degraded -> Degraded/Completed`、`Failed -> Failed/Failed`；duplicate overlay为
   `DuplicateReplayed`。`NoChange + Succeeded` 与 `NoChange + Skipped` 均为显式合法分支。
7. page/finalizer error、permit loss、process crash或 commit unknown均不产生 loop success；Worker不得按 run id、last token、
   count、publisher response、repository/current truth重建 continuation/report。

| closure | result |
|---|---:|
| logical application callable | `42/42` |
| new public callable / DTO | `0 / 0` |
| relay channel branches | `2/2` (`Worker`,`Job`) |
| non-relay Worker-channel maintenance | `0/9` |
| first-page field join | `7/7` |
| full batch chain -> exhausted permit -> finalizer | closed_for_design |
| duplicate no-read/no-write/no-external | closed_for_design |
| Worker -> Jobs / repository / UoW / publisher direct dependency | `0 / 0 / 0 / 0` |
| new L1/L2 blocker | `0` |

本 activation关闭 relay blocker 的 service facade owner子条件；entry re-audit完成前 blocker仍 open。不得进入
`7R-06C-1C`、C-2、Step 8、正式 `03` 或 implementation。

```text
current_document = 03-详细设计.md
current_step = Step 7 regression / 7R-06
current_sub_batch = 7R-06C-1B-R service facade contract activated
artifact = 03_ddd_step_07_service_facades_inputs_outputs.md
artifact_content_status = completed
artifact_review_status = consumed_by_entry_reaudit_pending
current_authority = physical_eof_7r_06c_1b_r_activation
relay_channel_allow_set = Worker|Job
other_paged_job_channel_allow_set = Job_only
relay_first_page_field_join = 7/7
relay_fresh_finalization_chain = closed_for_design
relay_duplicate_chain = closed_for_design
new_application_callable = 0
new_public_dto = 0
worker_jobs_dependency = 0
new_l1_l2_blocker = 0
internal_relay_blocker = open_pending_entry_reaudit
next_allowed_action = update_entry_relay_mapping_and_close_c_1b
formal_03_writeback = forbidden
implementation = not_started
real_test_execution = not_started
real_evidence_created = no
acceptance_signoff = no
commit_required = no
```

---

## Historical-Position Foundation: `7R-06C-1B-R` Worker relay paged finalization contract

> 本节因 patch anchor 命中 facade 文件中段，保留为 non-authoritative foundation，不改变恢复状态。只有物理 EOF 的
> 同批 activation 显式采纳后，以下契约才成为 current authority。本节消费 Step 6 entry-object 物理 EOF 的
> `7R-06C-1B-R Worker relay invocation metadata repair activated`，并覆盖前部要求所有
> `SandboxFinalizableJobPermit` 只能使用 `Job` channel 的旧口径。其它八个 paged maintenance Job、reconciliation、42 个
> application callable 名称和 shared finalizer callable count 均不变。

### R1. Channel allow-set and identity preservation

| application surface | `Worker` | `Job` | current rule |
|---|---:|---:|---|
| `publish_sandbox_event_relay` Start / Continue | yes | yes | 唯一双 channel paged Job method；operation始终为 `PublishSandboxEventRelay` |
| `SandboxFinalizableJobPermit::try_publish_sandbox_event_relay` | yes | yes | 只接受 exhausted permit，并保留 permit 原 channel |
| `finalize_job_report` with relay permit variant | yes | yes | finalizer只完成原 reservation/report relation，不把 Worker改成Job |
| 其它八个 paged maintenance methods / permits | no | yes | 保持 one-shot Job only |
| `run_sandbox_reconciliation` | no | yes | 保持 specialized one-shot Job |

channel 是 invocation 合法性字段，不进入 duplicate identity。`Worker` 与 `Job` 若携带同一 canonical operation、digest 和
idempotency key，必须命中同一 reservation / stored replay relation；它们不能因 channel 不同而创建两份 JobReport。相反，
两个无关 trigger 不得复用 key/digest，即使 context 相同。`JobRunId`、channel、clock、trace 和 page count均不能替代
`operation + request_digest + idempotency_key`。

`publish_sandbox_event_relay` preflight 的 current channel规则为：

1. Start 时 `ctx.channel()` 只能为 `Worker | Job`，operation必须精确映射到 `PublishSandboxEventRelay`，actor必须为受信
   System actor，digest/key required。
2. Continue 时 caller 传入的 `ctx` 必须与 moved permit 中的 `call_context` 逐字段相等，包括 channel、actor、trace、digest
   和 key；不得只用 `matches_duplicate_identity` 忽略 channel，也不得在中途从 Worker切换为Job或反向切换。
3. `SandboxPagedJobInvocationResult::validate_for_job(PublishSandboxEventRelay)` 与 relay permit constructor 同时接受
   `Worker | Job`；其它 job kind 仍要求 `Job`。
4. finalizer读取 permit 原 context并执行同一 allow-set；它不接受 caller 另传 context，因此不存在 finalization channel
   覆盖口。

### R2. Worker first-page field join

Worker fresh Start 必须只从 `SandboxRelayLoopInvocation` 和 current selector constructor形成，不存在“frozen relay batch”
隐式字段：

| Start / context field | exact source | equality / validation | forbidden source |
|---|---|---|---|
| `ctx` | `SandboxRelayLoopInvocation::call_context()` | Worker channel、fixed operation、system actor、trace、digest/key全部受检 | Job factory、topic、publisher、repository |
| `job_run_id` | `invocation.job_run_id()` | non-empty；原样进入permit/report | clock、key、relay ref、counter |
| `started_at` | `invocation.run_context().started_at()` | 与 selector cutoff逐字段相等 | 第二次clock读取、page time |
| `selection.context_ref` | `invocation.context_ref()` | 显式 context anchor；reader只在该context snapshot选取 | global/all/latest、first relay row |
| `selection.selection_cutoff` | 同一 `run_context.started_at()` | Start/selector/permit三处相等，续页不刷新 | repository/publisher timestamp |
| `page_limit` | `invocation.page_limit()` | non-zero且已受 config ceiling校验；原样进入permit | reader clamp、publisher count |
| Start cursor | application-owned `None` | 首批 batch `input_page_token=None` | caller token、stored cursor、last report |

Worker trigger 的 canonical digest 至少绑定 fixed job kind、explicit `context_ref`、frozen cutoff 与 page limit 的规范化输入；
具体字节编码复用 runtime 已有 canonical fingerprint facility，不在 facade 用 Debug/JSON重算。若 runtime 只能提供与这些字段
不一致的 digest/key，`SandboxRelayLoopInvocation::try_new` 或 application preflight 必须拒绝，不能为“尽量投递”改写字段。

### R3. Exact fresh relay loop algorithm

`SandboxPagedJobInvocationResult<S>`、`SandboxJobPageInvocation<S>`、`SandboxFinalizableJobPermit` 和
`FinalizeSandboxJobReportInput` 的 public shape均不增加字段。Worker 只在一次 async invocation 的局部所有权中保存完整
batch vector；该局部 vector不是新对象契约、不是 stored surface，也不拥有 status derivation。

```rust
// Rust-style design pseudocode; exact handler owner is worker::event_relay_worker.
let call_context = invocation.call_context()?;
let selection = invocation.selection()?;
let run_context = invocation.run_context().clone();

let mut next_invocation = SandboxJobPageInvocation::Start {
    job_run_id: invocation.job_run_id().clone(),
    started_at: run_context.started_at().clone(),
    selection,
    page_limit: invocation.page_limit(),
};
let mut batches: Vec<SandboxMaintenanceBatchOutcome> = Vec::new();

loop {
    let input = PublishSandboxEventRelayJobInput::try_new(next_invocation)?;
    let page_result = job_service
        .publish_sandbox_event_relay(call_context.clone(), input)
        .await?;
    page_result.validate_for_job(SandboxJobKind::PublishSandboxEventRelay)?;

    match page_result {
        SandboxPagedJobInvocationResult::DuplicateReplayed { outcome } => {
            // Duplicate is legal only before any fresh page has been accepted.
            require(batches.is_empty())?;
            let finished_at = trusted_clock.now()?;
            return SandboxRelayLoopResult::finish(
                run_context,
                SandboxJobReportStatus::DuplicateReplayed,
                outcome,
                finished_at,
            );
        }
        SandboxPagedJobInvocationResult::FreshBatch { permit, batch } => {
            // Preserve the application batch as a whole; do not flatten items or derive counters/status.
            batches.push(batch);

            if permit.is_exhausted() {
                let finalizable =
                    SandboxFinalizableJobPermit::try_publish_sandbox_event_relay(permit)?;
                let finalizer_input =
                    FinalizeSandboxJobReportInput::try_new(finalizable, batches)?;
                // Status is copied from the application-owned checked constructor before input is moved.
                let report_status = finalizer_input.report_status();
                let outcome = job_service.finalize_job_report(finalizer_input).await?;
                let finished_at = trusted_clock.now()?;
                return SandboxRelayLoopResult::finish(
                    run_context,
                    report_status,
                    outcome,
                    finished_at,
                );
            }

            require(permit.call_context() == &call_context)?;
            next_invocation = SandboxJobPageInvocation::Continue(permit);
        }
    }
}
```

该伪代码中的 `require(...)` 映射到既有 application/Worker relation error，不新增 panic、raw string error 或 boolean
fallback。`trusted_clock.now()` 只提供 Worker invocation 结束时间；JobReport 的 `finished_at/recorded_at` 已由 application
finalizer在其 UoW 中取得并保存，Worker completion time不得覆盖 stored report time。

每页调用的 exact linearity规则：

1. Start 只出现一次；fresh reservation也只出现一次。
2. 每个 `FreshBatch` 的 permit 与 batch先由 application validator证明 same job、same selector、same cursor relation，再整体
   move到下一步；Worker不拆 permit、不复制 cursor。
3. `batches.push(batch)` 必须保留每个 batch 的 input/next token、items、result refs、reasons和trace；不得只保存 count、
   failed refs或last cursor。
4. nonterminal permit只能进入一次 `Continue`；不得并发 spawn 两个 page call，不得 clone/serialize/rebuild permit。
5. terminal permit只能进入一次 relay finalizable constructor；finalizer input constructor再次校验 page count、token chain、
   global ordered-unique target和机械status。
6. Worker可以读取 `finalizer_input.report_status()` 的 Copy值用于最终 loop carrier，但不能接收 caller status，也不能在
   constructor失败后从 batches自行推导替代值。

### R4. Fresh status and final outcome join

current maintenance finalizer relation固定为：

| constructor-derived report status | finalizer outcome | stored status | Worker relay disposition |
|---|---|---|---|
| `Succeeded` | `NoChange` | `Completed` | `Accepted` |
| `Skipped` | `NoChange` | `Completed` | `Skipped` |
| `PartialFailed` | `Degraded` | `Completed` | `Accepted` |
| `Degraded` | `Degraded` | `Completed` | `Accepted` |
| `Failed` | `Failed` | `Failed` | `Failed` |

`Succeeded -> NoChange` 是 report-only finalization 的 intentional relation：relay item truth/attempt 已在前序 page UoW提交，
finalizer不再次拥有这些 truth refs。`SandboxRelayLoopResult::finish` 必须允许 `NoChange + Succeeded` 和
`NoChange + Skipped` 两个显式分支；它不能把所有 `NoChange` 强制解释为 `Skipped`。`Accepted` 不是 paged maintenance
finalizer的合法 fresh outcome；若出现则是 relation error，不表示“全部发布成功”。

### R5. Duplicate, failure and ownership-loss boundaries

| branch | Worker可做 | Worker不得做 | current disposition |
|---|---|---|---|
| Start duplicate | 以 `DuplicateReplayed` overlay和完整 stored outcome构造 loop result | selection、page read、publisher、permit、finalizer、current truth read | `Accepted` |
| duplicate after any fresh batch | 返回 invariant/application error | 丢弃已收 batches后假装正常duplicate | error；该组合不应由合法 facade产生 |
| page application error | 原样映射 `WorkerError::Application` | 把部分batch包装成 terminal report、继续下页、从repository补页 | no loop success |
| permit/batch relation error | fail closed | 修正token、排序、target或page count | no loop success |
| process crash / permit loss | 丢失本 invocation continuation；交 Step 12/13 typed recovery | 按 `job_run_id`、last token或current index重建permit | no blind resume |
| finalizer pre-commit failure | 返回 application error；不构造 loop result | 复用已消费input、再次调用finalizer、回滚已提交item truth | typed recovery |
| finalizer commit unknown | 只接受 application exact relation inspection给出的 fully committed outcome | Worker读stored/current truth猜 committed、生成第二surface/key/run | indeterminate fail closed |
| loop-result relation/time error | 返回 relation-specific `WorkerError` | 改写 report status/outcome/stored status/time使其“匹配” | no ack success |

process crash后已经提交的 relay attempt/item truth不回滚。由于 permit 和完整 batch chain均是 transient linear ownership，
当前 invocation不能跨进程恢复；recovery owner只能围绕原 operation/digest/key、Reserved/completed relation和 exact same
relay attempts执行 inspection/hold/classification。普通异常、审计和诊断只记录 body-free kind/reason/trace，不扩写第二套
report或重试主体设计。

### R6. Static closure and downstream handoff

| audit | result |
|---|---:|
| existing logical application callables | `42/42` |
| additional public callable | `0` |
| relay paged method channel branches | `Worker + Job = 2/2` |
| other paged methods Worker allowance | `0/8` |
| reconciliation Worker allowance | `0/1` |
| Worker first-page required fields | `7/7` including fixed None cursor |
| Worker batch preservation | complete application batches only；second report owner `0` |
| finalizer status derivation owner | application constructor `1`；Worker derivation `0` |
| Worker -> Jobs dependency | `0` |
| Worker direct repository/UoW/publisher access | `0` |
| new L1/L2 blocker | `0` |

本节已关闭 `SBX-DDD-GRANULARITY-STEP7-RELAY-001` 的 application facade owner子条件，但 blocker在 entry artifact完成
re-audit前仍保持 open。`7R-06C-1C`、C-2、Step 8和正式 `03` 继续冻结。

```text
current_document = 03-详细设计.md
current_step = Step 7 regression / 7R-06
current_sub_batch = 7R-06C-1B-R service facade contract completed
artifact = 03_ddd_step_07_service_facades_inputs_outputs.md
artifact_content_status = completed
artifact_review_status = consumed_by_entry_reaudit_pending
relay_channel_allow_set = Worker|Job
other_paged_job_channel_allow_set = Job_only
relay_first_page_field_join = 7/7
relay_fresh_finalization_chain = closed_for_design
relay_duplicate_chain = closed_for_design
new_application_callable = 0
new_public_dto = 0
worker_jobs_dependency = 0
new_l1_l2_blocker = 0
internal_relay_blocker = open_pending_entry_reaudit
next_allowed_action = update_entry_relay_mapping_and_close_c_1b
formal_03_writeback = forbidden
implementation = not_started
real_test_execution = not_started
real_evidence_created = no
acceptance_signoff = no
commit_required = no
```

---

## Historical-Position Activation Draft: `S7-02D-B5` selector-bound paged Job facade

> 本节因patch锚点命中文件中段而保留为non-authoritative activation draft，不是facade物理EOF，也不改变恢复状态。
> 本节显式采纳前部 `Historical-Position Foundation: S7-02D-B5 selector-bound paged Job facade draft` 的 §§53~57，
> 并以其“selector identity而非全量target vector、move-only repository cursor、9/9 exact reader、42/29/13 join”为准。
> 文件中更早的B3/B4恢复块和原§40.2~40.7在冲突处均为historical material。本节不修改正式文档、协议DTO、实现代码或测试事实。

### 58. Current selector and permit contract

九个既有selection类型保持原名称，但字段语义固定为：

| selection | current selector identity | page-owned data forbidden in selection |
|---|---|---|
| `PublishSandboxEventRelaySelection` | context + trusted selection cutoff | relay record vector/status/attempt |
| `RefreshSandboxReferenceStatesSelection` | context + source-kind filter + cutoff | state vector/status/resolver outcome |
| `RefreshBackendCapabilitySummariesSelection` | context + backend/requirement filters + cutoff | target vector/current summary status |
| `RetryPendingMaterialHandoffsSelection` | context + target-kind filter + cutoff | handoff group/progress/attempt vector |
| `RunLeaseOrphanReaperSelection` | context + cutoff | lease vector/marker authorization |
| `EvaluatePendingCleanupGuardsSelection` | context + explicit `include_blocked` + cutoff | guard vector/decision/evidence |
| `MaintainRedlineContainmentHandoffsSelection` | context + cutoff | redline vector/preservation/observation |
| `RebuildSandboxReadProjectionsSelection` | context + explicit projection refs | implicit scope/all/latest and status vector |
| `MaintainDerivedInspectPreviewTrendSelection` | context + supported `Inspect/Preview/Trend` kinds | derived state vector/materialization result |

前七类 cutoff只在Start之前由trusted clock读取一次，续页不刷新；projection/derived按registered target/index读取，不从时间
自动扩展scope。所有constructor、getter、filter order、empty和unsupported-kind规则由主产物B5 §§63、67拥有。

`SandboxJobInvocationPermit<S>`中的`S`只表示上述immutable selector。current permit额外持有：
`page_limit: NonZeroU32`、`next_cursor: Option<SandboxRepositoryCursor>`、`completed_page_count: u32`。它不持有全量
target vector，不实现Clone/Serialize/Deserialize，不能由caller或process restart重建。`Continue`只move该permit，不能传入
第二selector、cutoff、limit或PageToken；`next_cursor=None`只由reader确认selection snapshot exhausted后产生。

### 59. Current per-page and finalizer join

九个paged facade method按同一序列执行：

```text
fixed service method
  -> validate matching selector/context and original page limit
  -> reserve once on Start; reuse permit on Continue
  -> read exactly one matching page through SandboxMaintenanceSelectionRepository
  -> encode only input/next repository cursor for batch token chain
  -> exact owner reload and existing §41 item flow
  -> return full batch plus updated move-only permit
```

reader返回的`SandboxSelectionPage<T>`是唯一target来源；jobs runner不得读repository、扫描scope或从count/last-ref补页。index
candidate不授予action，owner reload后必须重验context/lineage/status/Version/marker/attempt/domain guard；不eligible项按既有
safe default处理，integrity mismatch直接application error。duplicate在selection read、cursor codec、owner load、clock和
external call之前从完整stored JobReport replay，写入、identity、external和业务重跑均为0。

current page-chain rules：

| rule | required relation |
|---|---|
| first page | repository cursor `None`; initial public `PageToken`对九个paged Job必须为`None` |
| continuation | permit cursor与下一次reader request逐字段相等；caller token不可覆盖 |
| empty | empty page必须terminal；empty不是`all`、unavailable或scope invalid |
| nonterminal | items non-empty，next cursor存在，next public token只由matching codec编码 |
| exhaustion | permit `next_cursor=None`与最后batch `next_page_token=None`同时成立 |
| order | page内及跨batch target stable identity严格有序且unique；重复是integrity error |
| finalizer | 只接exhausted permit和完整batch chain，不重读selection/current truth，不重建target vector |

`SandboxRepositoryCursor <-> PageToken`只经主产物定义的matching codec单向转换；PageToken不是repository key、Version、truth/
reference cursor或idempotency identity。旧`SandboxJobPageRequest`全量token入口不再是current application contract，保留为
historical reference，不创建兼容adapter。

### 60. Facade static closure

| audit | result |
|---|---|
| existing application callables | Command 10 + Query 13 + Consumer 9 + Job 10 = `42/42`，无新增public callable |
| exact paged selection | `9/9` existing selection types；full target vector semantics `0` |
| exact reader join | `9/9` one-to-one method/reader mapping |
| fresh reservation ownership | non-Query `29/29`，paged invocation每次只reserve一次 |
| Query index/write/external participation | `0/13` |
| reconciliation paged reader | `0/1`；继续完整explicit scope和专用materialization result |
| duplicate page/owner/external/write | `0/0/0/0` |
| public DTO/status/callable additions | `0/0/0` |
| new L1/L2 upstream blocker | `0`；`REF-001`等待B6总closure |

```text
current_document = 03-详细设计.md
current_step = Step 7 regression / 7R-02D
current_batch = S7-02D idempotency / stored result / bounded index
batch_status = in_progress
completed_internal_batches = S7-02D-B1,S7-02D-B2,S7-02D-B3,S7-02D-B4,S7-02D-B5
completed_internal_batch = S7-02D-B5 selector-bound paged Job facade
next_internal_batch = S7-02D-B6 closure audit and recovery-source synchronization
next_allowed_action = wait_user_confirmation_before_s7_02d_b6
current_callable = 42/42
fresh_reservation_owner = 29/29
paged_selector = 9/9
paged_reader = 9/9
query_maintenance_index = 0/13
query_write = 0/13
reconciliation_paged_reader = 0/1
S7-02D-INT-05 = closed
ref_blocker = open_wait_s7_02d_b6
formal_03_07 = historical_reviewed_revalidation_pending
implementation = CB-SBX-01A blocked / wait_design
real_test_execution = not_started
real_evidence_created = no
commit_required = no
```

---

## Historical-Position Foundation: `S7-02D-B5` selector-bound paged Job facade draft

> 本节因patch锚点命中文件中段而保留为non-authoritative foundation，不是facade物理 EOF，也不改变恢复状态。
> 只有物理 EOF 的B5 activation显式采纳后，九个paged Job selector/permit/page orchestration才成为current authority。
> §§40.2~40.7中“selection保存完整target vector”“finalizer用selection vector证明全量覆盖”以及public initial page token
> 语义均降为historical material；method名、九个selection类型名、九个`*JobInput`、`SandboxPagedJobInvocationResult<S>`、
> `SandboxFinalizableJobPermit`和42个application entry callable保持不变。本节不修改正式文档、协议DTO或实现代码。

### 53. Selection type semantics override

九个既有`*Selection`类型现在只保存selector identity，不保存repository返回的target vector：

| existing type | current fields | removed historical fields |
|---|---|---|
| `PublishSandboxEventRelaySelection` | `context_ref; selection_cutoff` | `relay_record_refs` |
| `RefreshSandboxReferenceStatesSelection` | `context_ref; source_kind_filter; selection_cutoff` | `reference_state_refs` |
| `RefreshBackendCapabilitySummariesSelection` | `context_ref; backend_filter; requirement_filter; selection_cutoff` | `targets` |
| `RetryPendingMaterialHandoffsSelection` | `context_ref; target_kind_filter; selection_cutoff` | `handoff_groups` |
| `RunLeaseOrphanReaperSelection` | `context_ref; selection_cutoff` | `lease_refs` |
| `EvaluatePendingCleanupGuardsSelection` | `context_ref; include_blocked; selection_cutoff` | `cleanup_guard_refs` |
| `MaintainRedlineContainmentHandoffsSelection` | `context_ref; selection_cutoff` | `redline_refs` |
| `RebuildSandboxReadProjectionsSelection` | `context_ref; explicit_projection_refs` | implicit stale/all scope |
| `MaintainDerivedInspectPreviewTrendSelection` | `context_ref; supported_kinds` | `derived_state_refs` |

constructor/getter、filter order、empty semantics、projection explicit target和derived supported-kind规则以
`03_ddd_step_07_idempotency_stored_index_repositories.md` EOF §§63、§67为准。前七类`selection_cutoff`由
`SandboxJobRunContext.started_at()`原样复制；selector constructor、Start invocation和permit三处必须逐字段相等。
continuation不得重读clock或替换cutoff。projection/derived不按clock选择，但每个item仍在owner reload时使用其flow需要的
current safety time。

Step 8后续只允许为这些selector提供explicit context/filter/ref fields；不得恢复`SandboxOpaqueRef`、`all/latest`、status
authority、repository cursor或target status。target page来自九个exact read-only repository method，随后由§41既有item flow
exact reload，不由jobs runner或public request枚举。

### 54. Permit and invocation page state override

`SandboxJobInvocationPermit<S>`中的`S`现在是immutable selector identity。permit不保存全量target集合，page continuation直接
保存application-local repository cursor：

```rust
#[derive(Debug)]
pub struct SandboxJobInvocationPermit<S> {
    job_kind: SandboxJobKind,
    job_run_id: JobRunId,
    idempotency_record_ref: SandboxIdempotencyRecordRef,
    call_context: SandboxServiceCallContext,
    started_at: Timestamp,
    selection: S,
    page_limit: NonZeroU32,
    next_cursor: Option<SandboxRepositoryCursor>,
    completed_page_count: u32,
}

#[derive(Debug)]
pub enum SandboxJobPageInvocation<S> {
    Start {
        job_run_id: JobRunId,
        started_at: Timestamp,
        selection: S,
        page_limit: NonZeroU32,
    },
    Continue(SandboxJobInvocationPermit<S>),
}

impl<S> SandboxJobInvocationPermit<S> {
    pub fn job_kind(&self) -> SandboxJobKind;
    pub fn job_run_id(&self) -> &JobRunId;
    pub fn idempotency_record_ref(&self) -> &SandboxIdempotencyRecordRef;
    pub fn call_context(&self) -> &SandboxServiceCallContext;
    pub fn started_at(&self) -> &Timestamp;
    pub fn selection(&self) -> &S;
    pub fn page_limit(&self) -> NonZeroU32;
    pub fn next_cursor(&self) -> Option<&SandboxRepositoryCursor>;
    pub fn completed_page_count(&self) -> u32;
    pub fn is_exhausted(&self) -> bool;
}
```

旧`SandboxJobPageRequest { input_page_token, page_limit }`不再是九个paged Job application input；它保留为historical type
reference，后续Step 8不得为其生成public constructor。fresh `Start`必须从repository cursor `None`开始。Step 6通用
`SandboxJobRunContext.initial_page_token`对九个paged Job必须为`None`；present token由runner在调用application前拒绝为
validation/error。该限制与“process crash后不能凭job_run_id重建permit”一致，避免外部调用者用旧token重开另一个snapshot或
第二个idempotency invocation。

`Continue`只move原permit，不接受caller page token、selector、cutoff或limit。permit的`next_cursor=None`唯一表示selection
snapshot已耗尽，只能进入shared finalizer。cursor不可Clone到并发branch；即使adapter允许read-only repeat，application
ownership仍只有一个。

### 55. Per-page orchestration and token/report mapping

九个service method共同前缀固定为：

```text
Start
  -> validate fixed job kind/context/selector/page limit
  -> require run_context initial PageToken == None
  -> reserve invocation exactly once
  -> input_cursor = None

Continue
  -> consume matching move-only permit
  -> validate ctx/call_context/job kind and not exhausted
  -> input_cursor = permit.next_cursor

both
  -> SandboxSelectionPageRequest::try_new(input_cursor, original limit)
  -> call exactly one matching read_*_page(selector, request)
  -> for each immutable target: exact owner reload + domain eligibility + existing §41 item flow
  -> encode input cursor and returned next cursor only for batch/report token chain
  -> return FreshBatch with updated permit and full SandboxMaintenanceBatchOutcome
```

`SandboxMaintenanceBatchOutcome.input_page_token`为首页`None`，续页由matching codec对本页input cursor编码；
`next_page_token`只由reader返回的`next_cursor`编码。application不得从last target、item count、clock、Version、truth/reference
cursor或stored result生成token。codec encode/decode失败是application/infra error，不得把已处理items包装成terminal success。

updated permit固定：

1. selector、started_at、call context、job run、idempotency record和page limit逐字段不变；
2. `completed_page_count` checked `+1`，overflow为internal error；
3. `next_cursor`原样接收reader返回值，不能由encoded token反向重建；
4. page terminal时`next_cursor=None`；batch也必须`next_page_token=None`；
5. page nonterminal时items必须non-empty，batch next token与permit cursor是同一logical continuation；
6. page target严格有序且当前batch、此前batches全局exact identity不重复；normal path若出现重复为index integrity，而不是再次执行。

repository reader只选candidate。每个item仍执行§41的owner reload、Version、attempt、external split、post-call UoW与safe default；
selection-time status、marker、proof或filter不直接形成item result。duplicate invocation仍在任何selector read、cursor codec、owner
reload、clock或external call之前从完整stored JobReport返回。

### 56. Finalizer coverage and stored replay override

`FinalizeSandboxJobReportInput::try_new`不再把batches与permit内的全量target vector对账。current完整性证明由以下闭集组成：

| proof | exact rule |
|---|---|
| selector identity | finalizable permit保存九类exact selector；与operation/job kind/context/start cutoff逐字段匹配 |
| snapshot exhaustion | exhausted permit的`next_cursor=None`;末批`next_page_token=None`;不能由empty vector猜测 |
| page chain | first input token `None`;每个nonterminal batch next token等于下一batch input token；codec family/limit一致 |
| page count | checked `completed_page_count == batches.len()`且至少一个terminal batch |
| item order | 每批reader order有效；跨批target identity严格递增且全局unique |
| explicit projection scope | 每个projection item属于selector explicit set；terminal chain覆盖reader对该explicit set返回的全部candidate，不要求caller预先提供status |
| dynamic index scope | relay/reference/capability/handoff/lease/cleanup/redline/derived的完整selected target集合由exhausted immutable snapshot + full batches证明，不存在第二vector |
| report body | selector identity和完整batch/item/token chain全部进入frozen JobReport surface；不得只保存digest/count/last cursor |

因此§40.6 historical第4项“selection identity恰好被覆盖一次”改为“snapshot返回的candidate identity恰好在batch chain出现
一次”。selector可能合法命中零项；此时仍要求一个terminal empty first batch，permit page count为1且exhausted。explicit
projection refs也只是selection universe；若reader在reload前已按formal registry拒绝invalid target，整个page返回error，不把
缺失target静默删掉后完成report。

stored duplicate replay继续保存并校验original selector identity、original run/status/time、完整batches/items/token chain和
stored relation。duplicate不重新打开selection snapshot，不要求旧cursor仍可用，也不读取current index/current owners。
retention必须保证stored report在支持duplicate期间完整可读；selection snapshot retention只服务fresh invocation continuation。

### 57. Facade join and closure

| check | B5 facade result |
|---|---|
| service methods | Command 10 + Query 13 + Consumer 9 + Job 10 = `42/42`; method signature family unchanged |
| paged selector | `9/9` existing type names rebound to selector identity; full-target vector fields = 0 |
| paged reader binding | `9/9` one service method -> one exact read method |
| reconciliation | `0/1` paged reader; complete explicit scope and specialized result unchanged |
| reservation | Command 10 + Consumer 9 + Job 10 = `29/29`; each paged invocation reserves once, not per page |
| Query | maintenance selector/index/idempotency/write/external = `0/13` |
| duplicate | selection/cursor/owner/external/write = `0/0/0/0/0` |
| finalizer | no item execution, no selection read, no current truth scan; only frozen report/stored/idempotency group |
| public additions | public entry callable/DTO/status = `0/0/0` |
| upstream blocker | new L1/L2 blocker `0`; `REF-001` waits B6 complete closure audit |

```text
current_document = 03-详细设计.md
current_step = Step 7 regression / 7R-02D
current_batch = S7-02D idempotency / stored result / bounded selector facade join
batch_status = in_progress
completed_internal_batches = S7-02D-B1,S7-02D-B2,S7-02D-B3,S7-02D-B4,S7-02D-B5
completed_internal_batch = S7-02D-B5 selector-bound paged Job facade
next_internal_batch = S7-02D-B6 closure audit and recovery-source synchronization
next_allowed_action = wait_user_confirmation_before_s7_02d_b6
current_callable = 42/42
fresh_reservation_owner = 29/29
paged_selector = 9/9
paged_reader = 9/9
query_maintenance_index = 0/13
query_write = 0/13
reconciliation_paged_reader = 0/1
S7-02D-INT-05 = closed
ref_blocker = open_wait_s7_02d_b6
formal_03_07 = historical_reviewed_revalidation_pending
implementation = CB-SBX-01A blocked / wait_design
real_test_execution = not_started
real_evidence_created = no
commit_required = no
```

---

# `S7-02D` Current Activation：fresh claim与typed replay facade boundary

> 本节位于本文物理末尾，是 facade 产物对 `S7-02D` 的唯一 current overlay（2026-07-26）。此前 `7R-01` 和
> `7R-02B` 内容保留为历史审计轨迹；本节只定义 facade 如何消费新 repository contract，不新增 public callable。

## 53.1 Facade ownership

| surface | owner | rule |
|---|---|---|
| fresh idempotency claim | `reserve_fresh_operation` | 29个非Query fresh callable的唯一 reservation owner；先于业务 identity、business read/write和external call。 |
| duplicate observation | same facade operation | 只加载 exact claim与完整 typed stored surface；不调用 resolver、domain mutation、publisher或job selection。 |
| stored completion | operation-specific finalizer | stored result与matching idempotency record在允许的同组UoW内stage；surface kind必须匹配。 |
| stored failure | operation-specific failure finalizer | 形成 `Failed` stored surface并保留原 claim；不把失败变成可重跑空洞。 |
| Query | 13 Query methods | 不调用 idempotency repository、identity/cursor allocator、write UoW、audit/relay或external port。 |

## 53.2 Required facade algorithm (content pending)

```text
validate operation/channel + request digest + idempotency key
  -> inspect exact unique claim
  -> fresh: reserve_fresh_operation -> business operation -> typed result finalizer
  -> duplicate: load exact stored surface -> verify kind/operation/ref/status -> replay
  -> conflict/in-flight/integrity: return typed application observation; no mutation or retry
```

The exact carrier fields, repository error variants, three stored surface mappings and commit-unknown branches are owned by the
new `03_ddd_step_07_idempotency_stored_index_repositories.md`; this overlay does not predeclare generic method signatures.

```text
current_document = 03-详细设计.md
current_step = Step 7 regression / 7R-02D in_progress
current_batch = S7-02D idempotency / stored result / facade join
batch_status = in_progress
current_callable = 42/42 preserved
fresh_reservation_owner = 29/29
query_write = 0/13
public_callable_added = 0
next_allowed_action = write_s7_02d_batch_1
formal_03_07 = historical_reviewed_revalidation_pending
implementation = CB-SBX-01A blocked / wait_design
commit_required = no
```

---

---

# `7R-02B` Historical-Position Overlay：mutable create owner与首次物化诊断

> 本节曾被插入文件中部，不能单独作为current activation。它消费 repository 产物
> `03_ddd_step_07_repositories_uow_indexes.md` §25。前文 `7R-01` 的42个 callable、输入和输出继续有效；
> 与本节冲突的“maintenance 只处理 existing”“reference state 只由 refresh 创建”或未绑定的
> relay/idempotency create描述均为 historical material。此处只补 application owner reachability，
> 不新增public callable、不定义`7R-02C/02D`的immutable/audit/stored schema。文件物理末尾的§52是唯一current activation。

## 44. 缺口诊断与当前取舍

| surface | 发现的缺口 | current owner决策 | 不允许的替代 |
|---|---|---|---|
| initial reference state | `refresh_sandbox_reference_states`、三个reference consumer都只拿existing state；intake没有长期state create路径 | `open_controlled_execution_context` 内部 `write_initial_reference_state` 逐source创建；refresh/consumer遇到missing只报integrity | Job/Query missing-row fallback、从summary或source文本生成state ref |
| projection first materialization | Job selection只有`projection_ref`，旧矩阵只写existing save | `rebuild_sandbox_read_projections` 内部按 formal target 返回 `FirstMaterialization | Existing`，first调用`create`/`create_unavailable` | 新增`create_projection` public method、query触发修复、用context ref拼projection ref |
| derived first materialization | Job selection只有`derived_state_ref`，旧矩阵未绑定`from_sources` | `maintain_derived_inspect_preview_trend` 内部按 formal target 返回 `FirstMaterialization | Existing`，first调用`from_sources`/`unavailable_from_sources`后create | 从view/body/empty summary猜首次、builder failure建core failure |
| relay root create | 42 callable只写“optional relay” | 同一fresh callable的 `append_finalized_relay` helper独占create；`requires_event_relay()==true`才分配和创建 | publisher/consumer/job补建record、post-commit补event、从current truth重建payload |
| idempotency root create | 共用`reserve`名词但未逐入口证明 | 所有29个fresh non-Query callable先经`reserve_fresh_operation`；duplicate/in-flight/query均zero-create | 每个入口复制reserve、按ref随意create、duplicate重跑 |

这组取舍保持“业务主体完整、普通保障最小”的粒度：首次物化的 identity/source proof属于L1可落码闭环，
但不会在本批扩写调度、数据库DDL、builder实现、审计平台或测试case矩阵。

## 45. `open_controlled_execution_context`：reference state initial branch

### 45.1 Owner与输入来源

`write_initial_reference_state`是intake service内部的唯一reference-state create kernel。它不改变
`open_controlled_execution_context`已有的acceptance decision owner，也不把长期state反向作为acceptance输入。
application先固定显式`source_refs`，再为每个source分配一次`ReferenceResolutionStateRef`；ref、source pair和
resolver observation的关系必须在同一checked intake context中冻结。

| item | exact source | owner rule | missing / mismatch |
|---|---|---|---|
| state identity | `SandboxIdentityAllocator::next_reference_resolution_state_ref()` | 每个显式external source恰一ref；不按source文本哈希或context ref派生 | allocation失败或duplicate relation -> application error，整组不写 |
| source target | `OpenControlledExecutionContextInput::source_refs()` | source kind/ref逐项复制；不得追加caller未声明source | source set不闭合 -> rejected/unresolved，不补source |
| observation | typed resolver finite body-free result | observation `reference_state_ref`、source ref、context lineage必须全等 | technical error无finite mapping -> rollback，不造Unavailable state |
| audit linkage | same intake group的planned audit identity | state factory只接typed audit ref；审计正文由后续owner定义 | missing mandatory linkage -> whole-group failure |

### 45.2 Exact branch与UoW

```text
preflight command + digest + actor + explicit source set
  -> reserve_fresh_operation (fresh only)
  -> allocate context/ref bundle and one reference-state ref per source
  -> call body-free resolver outside any write UoW
  -> begin fresh intake UoW
  -> for each source:
       ReferenceResolutionState::track_resolved(observation, tracked_at, audit_ref)
       or ReferenceResolutionState::track_non_resolved(observation, tracked_at, audit_ref)
       -> ReferenceResolutionStateRepository::create_reference_state(state, uow)
  -> assemble context + optional environment identity + required immutable relation
  -> stage relay only when finalized draft requires it
  -> complete idempotency/stored group and commit once
```

`Resolved | Stale | Unresolved | Invalid | Unavailable`只能来自resolver的finite observation，且每个state都必须
拥有完整body-free binding、status/reason规则和source identity。state create失败、source pair错配、audit/relay/stored
mandatory relation缺失或commit unknown时，整个intake group按§21进行whole-group recovery；不得先提交context再补state。
reference state只记录长期freshness，不决定`Accepted`；intake guard/resolution owner仍决定context status。

### 45.3 Existing-only downstream规则

`refresh_sandbox_reference_states`、`consume_caller_context_reference_changed`、`consume_policy_summary_changed`和
`consume_backend_capability_summary_changed`都必须使用selection提供的existing `ReferenceResolutionStateRef`。
它们的固定顺序是`get_reference_state_with_version` -> object transition -> `save_reference_state`；`NotFound`是
selection/index integrity error，不能跳转到`write_initial_reference_state`。这保证首次跟踪只发生在正式intake，
consumer不会因事件到达顺序制造无context的长期state。

## 46. Projection与Derived Job的首次/既有分支

### 46.1 共同的 formal target contract

两个maintenance Job仍各自只有一个既有public method。selection reader在调用item kernel前，必须从正式
target/index提供以下typed carrier；selection自身不保存status、Version或caller生成的source set：

| target kind | required proof | permitted identity source | empty / missing rule |
|---|---|---|---|
| projection | context、projection kind/scope、stable `SandboxReadProjectionRef`、`SandboxReadProjectionSourceSnapshot`或typed unavailable proof | committed projection target/index；不得由context ref派生 | explicit known-empty selection可exhaust；selected target missing是integrity |
| derived | context、fixed `DerivedMaterialKind`、stable `DerivedInspectPreviewTrendStateRef`、closed `DerivedSourceRefSet`和same-snapshot source proof或typed unavailable proof | committed derived target/index；不得由view/ref文本派生 | explicit known-empty selection可exhaust；selected target missing是integrity |

formal target proof必须确认目标属于selection context、kind/scope与registered maintenance definition一致、source
coverage不是all/latest推导，且source reader在同一snapshot可重验lineage/cursor/audit关系。Job不能把`Option`缺失、
Query `Empty`、旧body或builder返回的未经验证数据当作first proof。

### 46.2 `rebuild_sandbox_read_projections`

| branch | owner load | domain factory / repository | safe result |
|---|---|---|---|
| `FirstMaterialization` | formal target先证明 exact ref absent、context和source proof；不得先对缺失row做latest scan | complete source -> `SandboxReadProjection::create(...)`; safe unavailable -> `SandboxReadProjection::create_unavailable(...)`; 再调用`create_read_projection` | `Succeeded(Projection(ref))`或诚实`Degraded`；first conflict转typed conflict，不转save |
| `Existing` | `get_read_projection_with_version`读取state+Version；selection marker与context必须匹配 | `SandboxProjectionRebuildAttempt::initial/from_stale`只按state形态选择；start/finish/degraded/unavailable后`save_read_projection` | `Skipped`、`Succeeded`或`Degraded`；NotFound是index/integrity，不补建 |

first path的最小顺序为：

```text
read formal projection target + source proof
  -> reserve/validate invocation already complete
  -> begin write UoW
  -> recheck exact projection absence and target relation
  -> build SandboxReadProjection from checked source
  -> create_read_projection(projection, uow)
  -> stage required audit / marker / stored relation
  -> commit and map only confirmed identity
```

`SandboxProjectionRebuildAttempt::initial`只表示target proof已确认首次且没有existing projection；它不能被
Job根据`get NotFound`自行构造。source complete时可进入Fresh，source明确不可用时只能进入`Unavailable`或
Step 6允许的安全初始degraded形态；redline coverage缺失、wrong lineage、mixed cursor和half-commit必须是
integrity/unavailable，不能用degraded掩盖。

### 46.3 `maintain_derived_inspect_preview_trend`

| branch | owner load | domain factory / repository | safe result |
|---|---|---|---|
| `FirstMaterialization` + complete | formal target提供state ref、kind、closed source set和same-snapshot materialization proof；exact absence在write UoW重验 | `DerivedInspectPreviewTrendState::from_sources(...)` -> `create_derived_state` | `Succeeded(Derived(ref))` |
| `FirstMaterialization` + unavailable | formal target提供source unavailable reason和合法target source set | `DerivedInspectPreviewTrendState::unavailable_from_sources(...)` -> `create_derived_state` | `Degraded(Derived(ref), safe reason)`；不伪造Fresh |
| `Existing` | `get_derived_state_with_version` + matching marker/Version | start/finish/failed/unavailable transition -> `save_derived_state` | `Skipped`、`Succeeded`或`Degraded` |

first path必须在same-snapshot materialization index中取得`DerivedNeverMaterializedProof`或等价的正式
first expectation；`None`、empty source、Query absence、旧view row或builder cache都不构成proof。source set/kind/
context不一致、first conflict、newer marker、CAS conflict或commit unknown都保留现有安全状态并交reconciliation，
不得reload latest套用旧completion。builder/validation failure只形成derived maintenance outcome，不创建
`FailureClassification`或修改core truth。

## 47. Relay与Idempotency在42 callable中的绑定

### 47.1 Fresh reservation owner

所有29个fresh non-Query callable（10 Command、9 Consumer、10 Job）在任何business source read、business identity
allocation或external call前，统一调用`reserve_fresh_operation`。该helper完成fixed operation/channel、digest、authority、
unique claim和`SandboxIdempotencyRecord::reserve`的完整校验，并以`create_idempotency_record`作为唯一首次create
primitive。`evaluate_policy_execution`、capability refresh和reconciliation虽无business mutable root，仍遵守同一顺序。

| family | fresh callable count | reservation owner | duplicate behavior | create count |
|---|---:|---|---|---:|
| Command | 10 | `reserve_fresh_operation` | stored outcome replay before business read | 10/10 fresh only |
| Query | 13 | none | no idempotency lookup/write in this surface | 0/13 |
| Consumer | 9 | `reserve_fresh_operation` | stored consumer receipt replay | 9/9 fresh only |
| Job | 10 | `reserve_fresh_operation`（reconciliation仍走同一reservation kernel） | stored job/reconciliation report replay | 10/10 fresh only |

duplicate、in-flight、same key/different digest、wrong channel、reservation integrity failure和commit-unknown recovery
均不得调用`create_idempotency_record`第二次。`AlreadyExists`只有在完整unique claim与stored relation证明等价时才
能映射duplicate；否则是conflict/integrity。

### 47.2 Relay create owner matrix

| callable family / branch | relay create permission | exact condition | no-relay rule |
|---|---|---|---|
| Command fresh | same command kernel's `append_finalized_relay` | finalized draft exists and `requires_event_relay()` true; draft source/cursor/target/schema all validated | false gate -> no relay identity/create |
| Consumer fresh | same consumer mutation UoW's relay helper | canonical consumer outcome explicitly requires relay and finalized source draft belongs to current mutation | feedback-only/no required relay -> no create |
| Job fresh | same job item/finalization writer's relay helper | report/finding or safety transition has a finalized relay draft and prerequisites closed | diagnostic/ordinary maintenance without required relay -> no create |
| Query / duplicate / recovery inspector | forbidden | these paths are read-only or replay-only | create count 0 |

`append_finalized_relay`必须在当前callable的same-UoW group内执行；publisher job、relay feedback consumer和retry
maintenance只允许`get/save` existing record。relay draft为空时不得为了保持“每个operation都有event”而分配identity；
required relay前置不满足时整组返回typed failure/blocked，不得改成report-only成功。

## 48. Callable与create owner join

| family | callable / branch | mutable create owner(s) | first/existing rule | query/write guard |
|---|---|---|---|---|
| Command | `open_controlled_execution_context` | context、environment identity（accepted）、reference state、idempotency；relay按gate | reference initial只在intake；其它root按exact branch | write UoW；resolver outside UoW |
| Command | `establish_execution_boundary` | boundary、handle、lease；idempotency；relay按gate | boundary outcome first create；pre-call recovery与outcome分UoW | external await split |
| Command | `start_controlled_execution_run` | run Preparing、idempotency；relay按gate | run first create，post-call只save | recovery point before launch |
| Command | `record_capture_result` | captured material `C*`、observability material、idempotency；relay按gate | bounded complete candidate set；逐row create | capture source terminal |
| Command | `open_material_handoff` | handoff、idempotency；relay按gate | aggregate first create；progress embedded | no external delivery |
| Command | `submit_sandbox_control` | control fact、idempotency；relay按gate | duplicate/conflict仍是explicit fact branch | effect split |
| Command | `classify_sandbox_failure` | failure classification when no pending ref、idempotency；relay按gate | pending ref -> save；new ref -> create | impact proof controls optional writes |
| Command | `evaluate_cleanup_readiness` | cleanup guard when target absent、idempotency；relay按gate | `open` first, `apply_decision` existing | never release |
| Command | `record_redline_containment` | redline、optional failure/cleanup relation、idempotency；relay按gate | detect first; existing safety group CAS | strict hold |
| Query (13) | all query methods | none | no materialization or repair branch | write set/ID/cursor/external call = 0 |
| Consumer | reference/policy/capability change | none for state; idempotency only | state must existing; save stale | no initial state |
| Consumer | lifecycle / control / investigation / handoff / relay feedback | branch-specific safety root only as §25 registry | create only when formal incident/fact branch proves absent; otherwise save | duplicate zero-write |
| Job | `refresh_sandbox_reference_states` | none for state; idempotency only | existing state only | missing = integrity |
| Job | `rebuild_sandbox_read_projections` | projection + idempotency | `FirstMaterialization | Existing` from formal target | Query cannot invoke |
| Job | `maintain_derived_inspect_preview_trend` | derived state + idempotency | `FirstMaterialization | Existing` from formal target | no core truth write |
| Job | other 7 jobs | branch-specific roots in §25.3; idempotency; relay as gate | create only explicit domain candidate/incident branch | no generic fallback |

## 49. `7R-02B` facade closure gate

| gate | required result |
|---|---|
| initial reference reachability | intake has one state ref/observation/create per explicit source; refresh/consumer existing-only |
| projection/derived first branch | both Jobs have formal target proof, first/existing split, exact factory and create/save path |
| relay create | one helper, finalized-draft gate, duplicate/query zero-create |
| idempotency create | one fresh reservation helper; 29/29 fresh callable binding; Query 0/13 |
| callable join | 42/42 methods remain unchanged and each create path has owner or explicit no-create rule |
| safety redline | missing/unknown/half-commit never becomes Fresh/Accepted/Released/success; no query repair |
| scope | no tools semantic execution, runtime agent loop or member lifecycle orchestration added |

本overlay完成后，facade侧的 owner reachability差集为0；repository侧仍需执行物理文本静态检查和两份overlay
交叉join。差集归零前不得更新`7R-02B completed`，不得启动`7R-02C`或Step 8。

---

# `7R-02B` Historical-Position Activation Draft：owner reachability与首次物化

> 本节位于文件中部，只是待激活设计正文，不单独声明current效力。§41.9~§41.10的existing-only文字保留为
> historical snapshot；文件物理末尾§52只提取并激活本节经静态审计成立的结论。
> 本节只描述application facade到mutable repository primitive的可达性，不提前定义`7R-02C/02D`的immutable、
> audit、stored-result或relay-attempt schema。

## 50.1 Draft source与裁决摘要

| surface | current owner | exact rule | forbidden fallback |
|---|---|---|---|
| initial reference state | `open_controlled_execution_context`内部`write_initial_reference_state` | 对checked explicit source set逐项分配state ref、消费finite body-free observation并在`MUT-G01`同一UoW逐项`create_reference_state` | refresh/consumer/job遇到missing补建；从summary、source body或context ref派生state |
| captured material group | `record_capture_result`内部`write_capture_material_group` | 从同一terminal snapshot得到完整candidate set；按`C*`逐row调用`create_captured_material`，与observability material同组提交 | bulk upsert、存在则save、按page count推完整集合、部分成功返回Fresh |
| failure classification | `write_failure_classification` | `classify_sandbox_failure`及已登记的run/handoff/control/redline/lifecycle safety kernel共享唯一create kernel；有pending ref时只save | adapter error字符串直接造classification；无source proof补空classification |
| cleanup guard | `evaluate_cleanup_readiness`内部`write_cleanup_guard` | 只有G13首次open；G14/G15/G16及Job/consumer只读取并save existing guard | release阶段补建guard；unknown当Allowed |
| orphan incident | `write_orphan_incident` | 只有G18 formal eligible incident absence branch允许`create_orphan_recovery`；G15只save existing orphan | cleanup confirmation首次造orphan；Unavailable/Released observation确认orphan |
| projection | `rebuild_sandbox_read_projections`内部`write_projection_materialization` | formal target/index proof先分`FirstMaterialization | Existing`；first `create_read_projection`，existing按Version transition + save | Query repair、NotFound即first、context ref拼projection ref |
| derived state | `maintain_derived_inspect_preview_trend`内部`write_derived_materialization` | formal target/source proof先分`FirstMaterialization | Existing`；first以`from_sources`或`unavailable_from_sources`构造后create，existing transition + save | Query/empty row/builder cache造first；builder failure造core failure |
| relay | `append_finalized_relay` | 仅当前fresh callable形成finalized draft且`requires_event_relay()`为true时create | publisher/retry/feedback补建；post-commit重建payload |
| idempotency | `reserve_fresh_operation` | 29个fresh non-Query callable唯一进入reserve/create；duplicate、Query、recovery zero-create | 每入口复制reserve；按ref随意create |

本节的`owner`是唯一application create kernel，不是第43个public callable。任何authorized caller只能调用该kernel；
repository primitive不得暴露给entry、Query、publisher或普通maintenance直接调用。

## 50.2 `MUT-G01` reference-state initial branch

```text
checked explicit source_refs
  -> allocate exactly one ReferenceResolutionStateRef per source
  -> resolve body-free observations outside write UoW
  -> begin fresh intake UoW
  -> for every source: track_resolved(...) or track_non_resolved(...)
  -> create_reference_state(state, uow)
  -> create context and accepted environment identity when branch requires
  -> stage required non-mutable relations and final idempotency result
  -> commit whole group
```

每个source candidate必须携带`source_ref`、state ref、context lineage、finite observation、tracked timestamp和
Step 6规定的必要body-free linkage；source set必须与caller checked input逐项相等。`Resolved | Stale | Unresolved |
Invalid | Unavailable`只有在resolver返回合法finite observation时才能构造。技术错误若不能安全映射为finite outcome，
整组rollback，不创建空state。

`refresh_sandbox_reference_states`、`consume_caller_context_reference_changed`、`consume_policy_summary_changed`和
`consume_backend_capability_summary_changed`均为existing-only：selection/index提供existing state ref，调用顺序固定为
`get_reference_state_with_version -> domain transition -> save_reference_state`。`NotFound`是selection/index integrity
error，不能转入initial owner；这些入口的state create count固定为0。

## 50.3 `C*` exact facade rule for captured materials

`record_capture_result`的candidate set必须来自同一已提交terminal run snapshot，并携带：

| field | requirement |
|---|---|
| owner group | `MUT-G06`，不得跨group复用 |
| ordered unique key set | 每个material key唯一，顺序由source snapshot固定 |
| completeness proof | 明确证明本次terminal capture允许的全部material已枚举；不能用分页总数、latest scan或caller count |
| source lineage | run/capture/context/generation/cursor关系逐项可重验 |
| zero-row proof | 只有domain factory明确证明terminal capture没有允许material时才可为空；source unavailable或selection未闭合不算空 |

对每个candidate，application先调用Step 6 candidate factory，再调用唯一具名
`CapturedMaterialRepository::create_captured_material(material, uow)`。任何key、lineage、factory、repository或
observability candidate错误都使整个G06 pre-commit group rollback；不能先返回部分materials，也不能把stage success映射成
fresh success。`C*`不引入`create_rows`、`save_group`或generic repository。

## 50.4 Projection与derived first/existing split

两个既有Job仍各自只有一个public callable。selection reader必须提供来自正式target/index的typed carrier；Job不得由
`get NotFound`、Query `Empty`、旧body或context ref自行制造first proof。

| callable | FirstMaterialization | Existing | missing/race |
|---|---|---|---|
| `rebuild_sandbox_read_projections` | formal target证明stable projection ref、context/kind/scope、source snapshot或typed unavailable；write UoW重验absence，domain `create`/`create_unavailable`后`create_read_projection` | exact ref + current Version；domain start/finish/degraded/unavailable transition后`save_read_projection` | selected target missing是index/integrity；first conflict/CAS conflict/commit unknown不得转save或reload latest |
| `maintain_derived_inspect_preview_trend` | formal target证明stable derived ref、context、`Inspect | Preview | Trend`、closed source set和same-snapshot proof；`from_sources`或`unavailable_from_sources`后`create_derived_state` | exact ref + current Version；start/finish/failed/unavailable后`save_derived_state` | selected target missing是integrity；empty source、builder cache、first conflict或unknown不得补第二identity |

projection first source完整时只可返回已提交`Succeeded(Projection(ref))`；safe unavailable只能返回已提交`Degraded`或
`Unavailable`形态。derived builder failure只形成derived maintenance outcome，不创建`FailureClassification`，不修改core
truth。两个Job都必须把first/existing分支绑定到同一invocation idempotency group，并在whole-group commit confirmed后才映射
result ref。

## 50.5 Relay与idempotency binding

所有10 Command、9 Consumer、10 Job的fresh invocation在business read、business identity allocation或external call前，
统一进入`reserve_fresh_operation`。Query 13/13不调用idempotency repository、不分配identity/cursor、不打开write UoW。
duplicate、in-flight、same-key/different-digest、wrong-channel和commit-unknown recovery均不可二次create。

`append_finalized_relay`只接受当前callable同一operation的finalized `SandboxEventRelayDraft`，并重验source truth/cursor、
payload、target、generation、retry/schema prerequisite和`requires_event_relay()`。gate为false时不分配relay identity；
前置不完整时整组typed failure/blocked，不退化为report-only success。publisher、feedback consumer和retry Job只可对
existing relay执行get/save/attempt transition。

## 50.6 42-callable join与scope redline

| family | count | current create rule | query/write guard |
|---|---:|---|---|
| Command | 10 | fresh reservation；业务root按§25 registry和group branch；relay按finalized gate | write UoW与external split exact |
| Query | 13 | no mutable create/save；no materialization/repair | write set、identity、cursor、external call均0 |
| Consumer | 9 | fresh reservation；reference existing-only；G18/G15等安全branch只按formal proof | duplicate/recovery不二次create |
| Job | 10 | fresh reservation；projection/derived允许formal first或existing分支，其余按root-specific branch | 不由selection缺失补root，不跨await持有write UoW |
| **total** | **42** | selector到method仍1:1；无新增public callable | tools semantic execution、runtime agent loop、member lifecycle orchestration不进入Sandbox facade |

## 50.7 Draft closure statement

本draft确认以下交叉闭环已具备进入静态审计的设计材料：19/19 logical roots、57/57 get/create/save
methods、21/21 same-UoW groups、42/42 callable、Query 0/13 write、reference/projection/derived first proof、relay gate和
29/29 fresh idempotency owner。该声明不是实现、测试、run、evidence或验收事实；静态审计差集归零前，`S7-02B`仍保持
`in_progress / owner_reachability_audit`，不得启动`7R-02C`。

---

# `7R-02B` Historical-Position Completion Draft：owner reachability与首次物化

> 本节曾被写入文件中部，位于后续`7R-01B~D`历史批次之前，因此只保留为completion draft，
> 不具有current activation效力。§41.9~§41.10的existing-only文字、§44~§51的推导轨迹均由文件物理末尾§52
> 统一裁决；本批不定义`7R-02C/02D`的immutable、audit、stored-result或relay-attempt schema。

## 51.1 Draft activation候选与静态结果

| check | current result |
|---|---|
| source authority | §50.1~§50.6 historical draft；§41.9~§41.10 historical snapshot；§52是唯一current facade owner |
| initial reference state | `open_controlled_execution_context -> write_initial_reference_state -> create_reference_state`；每个显式source一ref/observation；refresh/consumer existing-only |
| capture `C*` | `record_capture_result -> write_capture_material_group`；同一terminal carrier的完整candidate set逐row create；whole-group commit |
| failure / cleanup / orphan | failure共享kernel；cleanup first create只在G13；orphan first create只在G18；后续安全kernel existing-only或save |
| projection / derived | 两个Job均由formal target/source proof分出`FirstMaterialization | Existing`，分别走create或Versioned save |
| relay | 一个`append_finalized_relay` helper；finalized draft + `requires_event_relay()` gate；publisher/feedback/retry existing-only |
| idempotency | `reserve_fresh_operation`唯一fresh create owner；10 Command + 9 Consumer + 10 Job = 29/29；Query 0/13 |
| callable family | Command 10/10、Query 13/13、Consumer 9/9、Job 10/10；total 42/42 |
| scope redline | tools semantic execution、runtime agent loop、member lifecycle orchestration均不进入Sandbox facade |

## 51.2 Draft branch obligations

### Reference initial branch

`open_controlled_execution_context`先固定checked explicit `source_refs`，为每个source分配一个
`ReferenceResolutionStateRef`，在write UoW外取得body-free finite observation，再在同一`MUT-G01` UoW逐项调用
`track_resolved(...)`或`track_non_resolved(...)`与`create_reference_state(state, uow)`。candidate必须携带source ref、
state ref、context lineage、finite observation和Step 6规定的body-free linkage；技术错误不能映射为finite outcome时整组
rollback。refresh Job及三个reference consumer只允许`get_reference_state_with_version -> domain transition ->
save_reference_state`；`NotFound`是selection/index integrity error，state create count为0。

### Capture material group

`record_capture_result`从同一已提交terminal run/capture snapshot取得完整、ordered-unique、带completeness proof的
candidate set。每个candidate先由Step 6 factory构造，再调用`create_captured_material(material, uow)`；composite key由
`CapturedMaterialRepositoryKey::new(capture_ref, material_key)`形成并由adapter重验。source unavailable、candidate未完成、
selection未闭合或任一row/observability relation错误时，整个G06 pre-commit group rollback；不能返回partial fresh result。

### Projection / derived first branch

`rebuild_sandbox_read_projections`必须由formal projection target/index提供stable ref、context/kind/scope和source snapshot
或typed unavailable proof。write UoW重验absence后，first调用domain `create`/`create_unavailable`与
`create_read_projection`；existing读取exact Version、执行transition并`save_read_projection`。`NotFound`不是first proof。

`maintain_derived_inspect_preview_trend`必须由formal derived target/index提供stable ref、context、固定kind、closed source
set和same-snapshot proof；first调用`from_sources`或`unavailable_from_sources`后`create_derived_state`，existing按Version
transition后save。empty source、Query absence、builder cache或builder failure不得制造第二identity或core failure。

### Relay / idempotency branch

29个fresh non-Query callable在business read、identity allocation或external call前统一进入
`reserve_fresh_operation`；duplicate、in-flight、same-key/different-digest、wrong-channel、recovery和Query均不可二次
create。`append_finalized_relay`只接受当前operation形成的finalized draft，并重验source cursor、payload、target、generation、
retry/schema prerequisite与`requires_event_relay()`；gate false不分配relay identity，publisher/feedback/retry只读写existing。

## 51.3 Draft completion gate

本节候选静态设计集合声称满足：19/19 logical roots、57/57 get/create/save methods、21/21 same-UoW groups、42/42 callable、
Query mutable write 0/13、create owner非空、首次物化三分支有typed identity/source proof、relay/idempotency唯一owner和
负向fallback差集为0。该声明须由物理末尾§52的独立静态审计结果激活；此处不是current完成状态，也不是compile、test、
run、evidence、acceptance或commit事实。

因此，本节本身不能把`S7-02B`标记为`[x]`。只有§52差集归零并同步控制台账后才可完成本任务；
`S7-G02`仍未完成，且不得由本draft自动启动`7R-02C`。

---

# `7R-01B` Query Callable 与 Exact Read Surface

## 19. 本批恢复点、输入与范围

### 19.1 当前恢复点

`7R-01A`已经闭合10/10 Command method、10/10 exact input、字段来源、事务和安全失败。本批只继续
`S7H-02`的application callable部分：为正式`02`和Step 6 `SandboxQueryKind`中的13个Query逐一建立
独立method、exact selector/input和typed output。exact repository/index reader仍由`7R-04A`拥有，本批只写其
不可变承接要求，不提前定义port。

| control item | current decision |
|---|---|
| current document / Step | `03-详细设计.md` / Step 7 regression / `7R-01B`。 |
| current artifact | 本文件；`7R-01A`内容保持current，不重写。 |
| upstream authority | 正式`02` 13 Query logical names；Step 6 canonical refs、views、selector和query access decision。 |
| historical Step 7/8 | 只作冲突诊断；3-method facade、opaque selector和多个optional ref均不继承。 |
| L1/L2/L3 | Query本身按L2保障契约收口；visibility、redline、cleanup、failure和boundary读取不得弱化L1 truth。 |
| no-write | 13/13 write UoW、id generation、truth transition、repair、refresh、rebuild、retry和business audit append均为0。 |
| implementation | `CB-SBX-01A blocked / wait_design`；本批不创建实现事实。 |

### 19.2 已读输入与效力

| input | consumed conclusion |
|---|---|
| 详细设计SOP Step 7与书写规范§5.5/§5.6 | 逐application capability定义exact trait、参数、返回、错误、调用方和实现承接。 |
| Step 6 shared types §11.5、§12.8~12.10 | 13个`SandboxQueryKind`、11个`SandboxQuerySurfaceStatus`以及public/persisted分层。 |
| Step 6 application §9.7 | `SandboxQueryAccessDecision`只表达`Permitted/Restricted/NotVisible/Unavailable`；最终surface不能反写access。 |
| Step 6 context/boundary §20~21 | execution/boundary view只能来自同一committed snapshot，query不能重算visible status。 |
| Step 6 policy/run/capture §13、§23~24 | policy、capture、handoff view使用checked source；missing和degraded不得伪造view。 |
| Step 6 failure/read §16.5~16.10 | failure bounded window；cleanup/redline/derived/comparison/reconciliation使用current canonical selector。 |
| 正式`02` Query骨架 | 保持13个logical name、caller-safe view和职责红线，不继承其宽松selector轮廓。 |
| historical Step 8 §12 | 只登记旧request/response冲突；不得倒推current application input。 |

没有发现需要重开Step 6的新schema缺口。`S7H-02`的13个application callable可由现有canonical object承接；
exact read/index surface仍按既定owner留给`7R-04A`，不是上游blocker。

## 20. SOP 问题回答与 Historical 诊断

### 20.1 SOP 问题回答

| question | current answer |
|---|---|
| facade owner | `SandboxQueryService`唯一属于`application`，planned path为`crates/application/src/services.rs`。 |
| callable strategy | 13个Query各有独立async method；不使用`get_status(kind, payload)`、string route或downcast。 |
| input owner | application-local input位于`crates/application/src/query_service.rs`；已在Step 6闭合的selector只引用不复制。 |
| output | 每个签名返回具体`SandboxQueryResult<T>`；failure/control和audit使用独立bounded body carrier。 |
| metadata | actor、operation、trace、channel和request digest只来自`SandboxServiceCallContext`，input不复制。 |
| visibility ordering | checked input后先形成`SandboxQueryAccessDecision`；`NotVisible/Unavailable`在target/index read前返回。 |
| transaction | 只允许一个公平read snapshot；不得begin write UoW，也不得跨两个latest read拼同一view。 |
| absence | `Empty`只来自exact absence proof或完整empty-scope proof；repository `None`、timeout或missing row不是absence proof。 |
| degraded | 只复制canonical view/read-gap safe reason；raw repository/provider error不得进入result。 |
| error | malformed typed input、integrity corruption、wrong-kind/mismatch和no-write violation返回`SandboxApplicationError`。 |
| Step 8 handoff | 每个input字段和result body均给DTO source requirement；Step 8只机械映射，不新增selector。 |

### 20.2 Historical material ledger

| historical material | disposition | current replacement |
|---|---|---|
| `SandboxQueryService`只有status/projection/audit 3个method | invalidated | 13个logical name对应13个独立method。 |
| 多个`Option<Ref>`并由service选择优先级 | invalidated | closed enum或required canonical selector；无both/none分支。 |
| `SandboxOpaqueRef`作为scope、report、comparison、finding或trace key | invalidated | Step 6 named ref/value selector；不提供compatibility alias。 |
| context-only `latest` scan | invalidated unless explicit current binding | 只有closed `CurrentForContext` variant可读唯一current index并要求0/1 cardinality proof。 |
| query生成view ref、truth cursor、stale marker或audit ref | invalidated | view/binding/cursor必须来自已提交source或maintenance writer。 |
| stale/missing触发refresh/rebuild/retry/repair | invalidated | 显式返回`Stale/Rebuilding/MissingProjection/Degraded/Unavailable`。 |
| 每次query追加`SandboxAuditTrace` | invalidated | 只允许受限diagnostic hook；business audit append为0。 |
| `NotFound`统一映`Empty` | invalidated | 只有exact absence proof可`Empty`；不可见先于存在性。 |

## 21. Query 公共 Application Contract

### 21.1 Planned owner

| contract | unique planned owner | persistence / visibility |
|---|---|---|
| `SandboxQueryService` | `crates/application/src/services.rs` | public transient facade；entry只依赖trait。 |
| 13个`Get*Input`及本批新增selector | `crates/application/src/query_service.rs` | checked transient carrier；不持久化。 |
| `SandboxQueryResult<T>` | `crates/application/src/query_service.rs` | application output；不作为truth或stored replay持久化。 |
| `SandboxQueryPageInfo`;`FailureControlStatusQueryResult`;`SandboxAuditTraceQueryResult` | `crates/application/src/query_service.rs` | bounded application output；Step 8机械映射public DTO。 |
| canonical refs/views/selectors | Step 6 planned `contracts` owner | 本批只引用；application不得复制同名schema。 |
| `SandboxQueryAccessDecision` | Step 6 planned `application` owner | query pre-read decision；不对public直接暴露。 |

### 21.2 Exact facade

```rust
/// Sandbox的13个只读use case facade；每个method固定一个SandboxQueryKind。
pub trait SandboxQueryService: Send + Sync {
    /// 读取一个受控执行语境的committed caller-safe状态。
    async fn get_sandbox_execution_status(
        &self,
        ctx: SandboxServiceCallContext,
        input: GetSandboxExecutionStatusInput,
    ) -> ApplicationResult<SandboxQueryResult<SandboxExecutionStatusView>>;

    /// 读取exact或唯一current coherent boundary状态。
    async fn get_boundary_status(
        &self,
        ctx: SandboxServiceCallContext,
        input: GetBoundaryStatusInput,
    ) -> ApplicationResult<SandboxQueryResult<BoundaryStatusView>>;

    /// 读取exact或唯一current policy execution decision摘要。
    async fn get_policy_decision_summary(
        &self,
        ctx: SandboxServiceCallContext,
        input: GetPolicyDecisionSummaryInput,
    ) -> ApplicationResult<SandboxQueryResult<PolicyDecisionSummaryView>>;

    /// 读取exact capture或run绑定的唯一capture摘要。
    async fn get_capture_summary(
        &self,
        ctx: SandboxServiceCallContext,
        input: GetCaptureSummaryInput,
    ) -> ApplicationResult<SandboxQueryResult<CaptureSummaryView>>;

    /// 读取exact或唯一current material handoff状态。
    async fn get_material_handoff_status(
        &self,
        ctx: SandboxServiceCallContext,
        input: GetMaterialHandoffStatusInput,
    ) -> ApplicationResult<SandboxQueryResult<MaterialHandoffStatusView>>;

    /// 读取一个context内bounded failure/control committed窗口。
    async fn get_failure_control_status(
        &self,
        ctx: SandboxServiceCallContext,
        input: GetFailureControlStatusInput,
    ) -> ApplicationResult<FailureControlStatusQueryResult>;

    /// 读取current或exact cleanup readiness view。
    async fn get_cleanup_readiness(
        &self,
        ctx: SandboxServiceCallContext,
        input: GetCleanupReadinessInput,
    ) -> ApplicationResult<SandboxQueryResult<CleanupReadinessView>>;

    /// 读取required context + exact redline containment view。
    async fn get_redline_containment_status(
        &self,
        ctx: SandboxServiceCallContext,
        input: GetRedlineContainmentStatusInput,
    ) -> ApplicationResult<SandboxQueryResult<RedlineContainmentView>>;

    /// 读取exact或唯一current Sandbox read projection。
    async fn get_sandbox_read_projection(
        &self,
        ctx: SandboxServiceCallContext,
        input: GetSandboxReadProjectionInput,
    ) -> ApplicationResult<SandboxQueryResult<SandboxReadProjection>>;

    /// 读取required context/state/kind的derived inspect/preview/trend view。
    async fn get_derived_inspect_preview_trend(
        &self,
        ctx: SandboxServiceCallContext,
        input: GetDerivedInspectPreviewTrendInput,
    ) -> ApplicationResult<SandboxQueryResult<DerivedInspectPreviewTrendView>>;

    /// 读取required context/requirement/source-set的backend capability comparison。
    async fn get_backend_capability_comparison(
        &self,
        ctx: SandboxServiceCallContext,
        input: GetBackendCapabilityComparisonInput,
    ) -> ApplicationResult<SandboxQueryResult<BackendCapabilityComparisonView>>;

    /// 读取一个required exact reconciliation report。
    async fn get_sandbox_reconciliation_report(
        &self,
        ctx: SandboxServiceCallContext,
        input: GetSandboxReconciliationReportInput,
    ) -> ApplicationResult<SandboxQueryResult<SandboxReconciliationReport>>;

    /// 读取一个subject下的bounded append-only audit trace页。
    async fn get_sandbox_audit_trace(
        &self,
        ctx: SandboxServiceCallContext,
        input: GetSandboxAuditTraceInput,
    ) -> ApplicationResult<SandboxAuditTraceQueryResult>;
}
```

所有method使用`async`只表示允许访问read repository/index和受限query access dependency；不得跨await持有write
UoW。13个method的`ctx.channel()`必须为`ApiQuery`，operation必须与固定`SandboxQueryKind`一一映射，且
`ctx.requires_idempotency() == false`。wrong channel/operation/digest mapping在任何target read前返回typed error。

### 21.3 Unified typed surface result

```rust
/// 一个Query的最终application surface；access decision不作为public body暴露。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct SandboxQueryResult<T> {
    /// access后形成的最终public surface状态；不是persisted truth状态。
    surface_status: SandboxQuerySurfaceStatus,
    /// 仅在该surface允许时存在的caller-safe typed body。
    body: Option<T>,
    /// Restricted/Stale/Degraded及no-body dependency surface的safe reasons。
    reasons: SandboxReasonSet,
}

impl<T> SandboxQueryResult<T> {
    /// 构造完整可见结果；body必填且reason为空。
    pub fn visible(body: T) -> Self;
    /// 构造已证明的空结果；body和reason均为空。
    pub fn empty() -> Self;
    /// 构造不可见结果；body和reason均为空，避免泄露规则与存在性。
    pub fn not_visible() -> Self;
    /// 构造受限且不暴露目标body的结果；non-empty reason必填。
    pub fn restricted(reasons: SandboxReasonSet) -> ApplicationResult<Self>;
    /// 构造可读但stale的结果；body与non-empty reason均必填。
    pub fn stale(body: T, reasons: SandboxReasonSet) -> ApplicationResult<Self>;
    /// 构造可读但不完整的结果；body与non-empty reason均必填。
    pub fn degraded(body: T, reasons: SandboxReasonSet) -> ApplicationResult<Self>;
    /// 构造正在重建的诚实surface；可携带已提交status-only/last-known-safe body。
    pub fn rebuilding(
        body: Option<T>,
        reasons: SandboxReasonSet,
    ) -> ApplicationResult<Self>;
    /// 构造无body的有限dependency/projection surface。
    pub fn no_body(
        status: SandboxQuerySurfaceStatus,
        reasons: SandboxReasonSet,
    ) -> ApplicationResult<Self>;
    /// 返回最终surface状态。
    pub fn surface_status(&self) -> SandboxQuerySurfaceStatus;
    /// 返回optional caller-safe body。
    pub fn body(&self) -> Option<&T>;
    /// 返回safe reason集合。
    pub fn reasons(&self) -> &SandboxReasonSet;
}
```

| final status | body | reasons | allowed source |
|---|---:|---:|---|
| `Visible` | required | empty | checked complete view/source。 |
| `Empty` | none | empty | exact absence proof或complete empty-scope proof。 |
| `NotVisible` | none | empty | access decision；target/index read count必须为0。 |
| `Restricted` | none | non-empty | access decision；当前没有可复用restricted-body type，不加载full view。 |
| `Stale` | required | non-empty | committed stale view/marker；不得query-side重建。 |
| `Degraded` | required | non-empty | checked degraded view/source；不得用raw error构造。 |
| `Rebuilding` | optional | non-empty | 已提交status-only/current-safe body可返回；不得把last-known伪装fresh。 |
| `MissingProjection`;`Unavailable`;`Failed`;`Disabled` | none | non-empty | closed read/dependency outcome；不得伪造empty。 |

`no_body(...)`只接受`MissingProjection/Unavailable/Failed/Disabled`，拒绝
`Visible/Empty/NotVisible/Restricted/Stale/Degraded/Rebuilding`；`Restricted`与`Rebuilding`必须使用各自专用factory。
contracts/domain完整性错误、wrong-kind、relation mismatch、duplicate current binding和no-write violation不降级为
`no_body`，而是返回`Err(SandboxApplicationError)`并交给后续migration/quarantine owner。

### 21.4 Bounded page output

```rust
/// application向Step 8 mapper提供的bounded repository page信息。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct SandboxQueryPageInfo {
    /// 当前页实际返回的item数量。
    returned_count: u32,
    /// repository证明当前snapshot是否还有后续item。
    has_more: bool,
    /// has_more为true时必须存在的application-local repository cursor。
    next_cursor: Option<SandboxRepositoryCursor>,
}

impl SandboxQueryPageInfo {
    /// 校验count、has_more与cursor三者关系；不编码public token。
    pub fn try_new(
        returned_count: u32,
        has_more: bool,
        next_cursor: Option<SandboxRepositoryCursor>,
    ) -> ApplicationResult<Self>;
    /// 返回当前页实际item数量。
    pub fn returned_count(&self) -> u32;
    /// 判断当前snapshot是否仍有后续item。
    pub fn has_more(&self) -> bool;
    /// 返回optional application-local continuation cursor。
    pub fn next_cursor(&self) -> Option<&SandboxRepositoryCursor>;
}

/// failure/control bounded window的最终application surface。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct FailureControlStatusQueryResult {
    /// access后形成的最终query surface。
    surface_status: SandboxQuerySurfaceStatus,
    /// complete/degraded/empty scope的checked bounded view；access/no-view分支为空。
    view: Option<FailureControlStatusView>,
    /// 与view window同snapshot的continuation信息。
    page_info: SandboxQueryPageInfo,
    /// restricted/degraded/no-view分支的ordered safe reasons。
    reasons: SandboxReasonSet,
}

impl FailureControlStatusQueryResult {
    /// 构造Visible/Restricted/Stale/Degraded window并校验view/page/reason矩阵。
    pub fn with_view(
        status: SandboxQuerySurfaceStatus,
        view: FailureControlStatusView,
        page_info: SandboxQueryPageInfo,
        reasons: SandboxReasonSet,
    ) -> ApplicationResult<Self>;
    /// 构造已证明的empty scope；仍返回checked empty view和page metadata。
    pub fn empty(
        view: FailureControlStatusView,
        page_info: SandboxQueryPageInfo,
    ) -> ApplicationResult<Self>;
    /// 构造access/dependency阻断的no-view result。
    pub fn no_view(
        status: SandboxQuerySurfaceStatus,
        page_info: SandboxQueryPageInfo,
        reasons: SandboxReasonSet,
    ) -> ApplicationResult<Self>;
    /// 返回最终query surface。
    pub fn surface_status(&self) -> SandboxQuerySurfaceStatus;
    /// 返回optional checked failure/control window view。
    pub fn view(&self) -> Option<&FailureControlStatusView>;
    /// 返回与window同snapshot的page信息。
    pub fn page_info(&self) -> &SandboxQueryPageInfo;
    /// 返回ordered safe reason集合。
    pub fn reasons(&self) -> &SandboxReasonSet;
}

/// append-only audit trace bounded page的最终application surface。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct SandboxAuditTraceQueryResult {
    /// access后形成的最终query surface。
    surface_status: SandboxQuerySurfaceStatus,
    /// 当前snapshot内稳定排序的caller-safe audit records。
    items: Vec<SandboxAuditTrace>,
    /// 与items同snapshot的continuation信息。
    page_info: SandboxQueryPageInfo,
    /// restricted/degraded/no-item分支的ordered safe reasons。
    reasons: SandboxReasonSet,
}

impl SandboxAuditTraceQueryResult {
    /// 构造Visible/Restricted/Stale/Degraded trace page并校验item/page/reason矩阵。
    pub fn with_items(
        status: SandboxQuerySurfaceStatus,
        items: Vec<SandboxAuditTrace>,
        page_info: SandboxQueryPageInfo,
        reasons: SandboxReasonSet,
    ) -> ApplicationResult<Self>;
    /// 构造已证明的empty trace page；items为空且page已终止。
    pub fn empty(page_info: SandboxQueryPageInfo) -> ApplicationResult<Self>;
    /// 构造access/dependency阻断的no-item result。
    pub fn no_items(
        status: SandboxQuerySurfaceStatus,
        page_info: SandboxQueryPageInfo,
        reasons: SandboxReasonSet,
    ) -> ApplicationResult<Self>;
    /// 返回最终query surface。
    pub fn surface_status(&self) -> SandboxQuerySurfaceStatus;
    /// 返回当前bounded page的immutable audit records。
    pub fn items(&self) -> &[SandboxAuditTrace];
    /// 返回与records同snapshot的page信息。
    pub fn page_info(&self) -> &SandboxQueryPageInfo;
    /// 返回ordered safe reason集合。
    pub fn reasons(&self) -> &SandboxReasonSet;
}
```

`FailureControlStatusQueryResult`存在view时必须证明`page_info.returned_count ==
view.window().returned_count()`且`has_more`一致，不能把window items拆成顶层items；`Empty`仍携带能证明完整空scope的view。
`GetSandboxAuditTrace`的`items`才是一页`SandboxAuditTrace`，并拒绝item超限、重复trace ref、非稳定顺序和count不等。
`SandboxRepositoryCursor`的exact schema、repository产生规则和retention由`7R-02D/04A`定义；Step 8
entry mapper通过后续codec将该application-local cursor编码为core `PageToken`。query service不得自行编码
public token，cursor也不得越过application-to-entry mapping边界。token/cursor不得由
`SandboxTruthCursor`、`Version`、timestamp、trace ref或字符串拼接产生。

## 22. 13 个 Exact Selector 与 Application Input

### 22.1 Status、Boundary、Policy

```rust
/// execution status只接受required context identity。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct GetSandboxExecutionStatusInput {
    /// 唯一查询目标；不携带metadata或visibility判断。
    selector: SandboxExecutionStatusSelector,
}

/// required context identity selector；不接受其它owner ref。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct SandboxExecutionStatusSelector {
    /// caller明确持有的受控执行语境identity。
    context_ref: ControlledExecutionContextRef,
}

/// boundary读取只允许exact boundary或context下唯一current binding。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct GetBoundaryStatusInput {
    /// exact或current-for-context closed selector。
    selector: BoundaryStatusSelector,
}

/// coherent boundary的exact/current closed selector。
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum BoundaryStatusSelector {
    /// 按context与exact boundary读取，不允许从boundary反推context。
    Exact {
        /// access scope和lineage anchor。
        context_ref: ControlledExecutionContextRef,
        /// caller明确选择的coherent boundary。
        boundary_ref: CoherentBoundaryRef,
    },
    /// 按context current-binding index读取唯一current boundary。
    CurrentForContext {
        /// current-binding index唯一允许使用的context key。
        context_ref: ControlledExecutionContextRef,
    },
}

/// policy摘要只允许exact decision或context下唯一current binding。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct GetPolicyDecisionSummaryInput {
    /// exact或current-for-context closed selector。
    selector: PolicyDecisionSummarySelector,
}

/// policy execution decision的exact/current closed selector。
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum PolicyDecisionSummarySelector {
    /// 按context与exact policy decision读取。
    Exact {
        /// access scope和decision lineage anchor。
        context_ref: ControlledExecutionContextRef,
        /// caller明确选择的policy execution decision。
        policy_decision_ref: PolicyExecutionDecisionRef,
    },
    /// 按context current-binding index读取唯一current policy decision。
    CurrentForContext {
        /// current policy decision binding的context key。
        context_ref: ControlledExecutionContextRef,
    },
}
```

| input / selector field | required | trusted source | prohibited substitute |
|---|---:|---|---|
| execution `context_ref` | yes | caller已获得的typed context ref | execution identity、string、route param opaque ref。 |
| boundary exact pair | variant required | caller typed context + boundary command result | optional pair、boundary-only反推context。 |
| boundary current context | variant required | caller typed context | latest timestamp scan、all-context scan。 |
| policy exact pair | variant required | caller typed context + policy command result | policy DSL/ref、approval body、decision-only反推context。 |
| policy current context | variant required | caller typed context | query现场重评policy或读取“最新全局policy”。 |

`CurrentForContext`只允许exact current-binding index返回`0/1` cardinality proof：0可映`Empty`，1继续读取同snapshot
source，>1为integrity error。`Exact`必须校验loaded owner context逐项相等；mismatch不是`Empty`。

### 22.2 Capture 与 Handoff

```rust
/// capture摘要只允许exact capture或run下唯一capture binding。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct GetCaptureSummaryInput {
    /// exact capture或for-run closed selector。
    selector: CaptureSummarySelector,
}

/// immutable capture group的exact/for-run closed selector。
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum CaptureSummarySelector {
    /// 按context/run/exact capture读取immutable capture group。
    Exact {
        /// access scope和run lineage所属context。
        context_ref: ControlledExecutionContextRef,
        /// capture唯一归属的controlled run。
        run_ref: ControlledExecutionRunRef,
        /// caller明确选择的immutable capture fact。
        capture_ref: CaptureFactRef,
    },
    /// 按context/run的0/1 binding读取唯一capture group。
    ForRun {
        /// access scope和run lineage所属context。
        context_ref: ControlledExecutionContextRef,
        /// run-to-capture 0/1 index的exact key。
        run_ref: ControlledExecutionRunRef,
    },
}

/// handoff状态只允许exact handoff或context下唯一current handoff batch。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct GetMaterialHandoffStatusInput {
    /// exact handoff或current-for-context closed selector。
    selector: MaterialHandoffStatusSelector,
}

/// material handoff group的exact/current closed selector。
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum MaterialHandoffStatusSelector {
    /// 按context与exact handoff fact读取完整handoff group。
    Exact {
        /// access scope和handoff lineage anchor。
        context_ref: ControlledExecutionContextRef,
        /// caller明确选择的immutable handoff fact。
        handoff_ref: HandoffFactRef,
    },
    /// 按context current-binding index读取唯一current handoff batch。
    CurrentForContext {
        /// current handoff binding的context key。
        context_ref: ControlledExecutionContextRef,
    },
}
```

| selector | exact lookup requirement | valid absence | forbidden behavior |
|---|---|---|---|
| capture `Exact` | context/run/capture lineage和完整capture group同snapshot | exact row + binding index共同证明0 | 只读capture row后扫描materials/observability latest。 |
| capture `ForRun` | context/run ownership与run-to-capture cardinality 0/1 proof | run存在且binding=0 | 把capture partial/failed当absence；触发recapture。 |
| handoff `Exact` | context/handoff/source plan/progress/relay linkage同snapshot | exact row + binding共同证明0 | 读取delivery adapter、重试target、重算aggregate。 |
| handoff `CurrentForContext` | context current binding 0/1 proof | context存在且binding=0 | timestamp winner、从capture推导handoff ref。 |

capture与handoff的domain failure status可以出现在`Visible` body；只有read source缺口才使用`Degraded/Unavailable`。
Query不得把真实`Partial/Failed/Retryable`伪装成technical degraded，也不得宣布artifact或observability formal truth。

### 22.3 Failure/Control、Cleanup、Redline

```rust
/// bounded failure/control query的required context与validated page输入。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct GetFailureControlStatusInput {
    /// bounded failure/control scope的required context。
    context_ref: ControlledExecutionContextRef,
    /// entry validated first/continued public page request。
    page_request: PageRequest,
}

/// cleanup query直接复用Step 6 canonical closed selector。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct GetCleanupReadinessInput {
    /// Step 6 current/exact cleanup closed selector。
    selector: CleanupReadinessSelector,
}

/// redline query直接复用Step 6 required context + exact redline selector。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct GetRedlineContainmentStatusInput {
    /// Step 6 required context + exact containment selector。
    selector: RedlineContainmentSelector,
}
```

| input | source / validation | no-write safety rule |
|---|---|---|
| failure `context_ref` | required typed caller input | 不接受direct failure ref，不按latest failure/control拼摘要。 |
| failure `page_request` | entry validated public page request；application codec转为`FailureControlPageAnchor`和`FailureControlWindowLimit` | invalid/expired/tampered cursor返回typed surface/error，不回退第一页或latest。 |
| cleanup selector | Step 6 `CurrentForContext`或`Exact { context_ref, cleanup_guard_ref }` closed enum | 读取immutable guard/evidence/owner/release relation；不执行cleanup/release/reaper。 |
| redline selector | Step 6 required context + exact redline ref struct | `NotVisible`先于redline index；不解除containment、不关闭调查、不记录新security truth。 |

`GetFailureControlStatus`必须在一个immutable snapshot中返回binding、merged bounded window、`u64` scope summary、
needed cross-link proof和typed gaps。正常empty要求完整scope summary证明failure/control总量均为0。`PendingInput`、accepted control
或unknown failure是canonical visible truth，不是read degradation。

### 22.4 Projection、Derived、Comparison、Reconciliation

```rust
/// read projection只允许exact projection或context下唯一current binding。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct GetSandboxReadProjectionInput {
    /// exact projection或current-for-context closed selector。
    selector: SandboxReadProjectionSelector,
}

/// Sandbox read projection的exact/current closed selector。
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum SandboxReadProjectionSelector {
    /// 按context与exact projection读取immutable projection snapshot。
    Exact {
        /// projection唯一归属的access context。
        context_ref: ControlledExecutionContextRef,
        /// caller明确选择的projection identity。
        projection_ref: SandboxReadProjectionRef,
    },
    /// 按context current-binding index读取唯一current projection。
    CurrentForContext {
        /// current projection binding的context key。
        context_ref: ControlledExecutionContextRef,
    },
}

/// derived query复用Step 6 required context/state/kind selector。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct GetDerivedInspectPreviewTrendInput {
    /// Step 6 required context/state/kind selector。
    selector: DerivedInspectPreviewTrendSelector,
}

/// comparison query复用Step 6 required context/requirement/source-set selector。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct GetBackendCapabilityComparisonInput {
    /// Step 6 required context/requirement/source-set selector。
    selector: BackendCapabilityComparisonSelector,
}

/// reconciliation query只读取required exact immutable report。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct GetSandboxReconciliationReportInput {
    /// Step 6 required exact immutable report selector。
    selector: SandboxReconciliationReportSelector,
}
```

| query | exact selector content | forbidden substitute |
|---|---|---|
| projection | exact context+projection，或context唯一current binding | context latest scan、projection ref反推context、query rebuild。 |
| derived | required context + exact state + `Inspect/Preview/Trend` kind | opaque scope、caller source set、kind-only scan、backend comparison/reconciliation kind。 |
| comparison | required context + requirement + ordered non-empty 1..=16 capability summary refs | profile refs、scope ref、empty-means-all、query调用capability port。 |
| reconciliation | required exact report ref | scope-only、context-current、latest report、report/scope optional precedence。 |

projection的`Stale/Rebuilding/Degraded/Unavailable` canonical status必须诚实映射surface；query不改变marker或attempt。
derived/comparison的`ExactAbsent`只来自Step 6 formal proof。reconciliation report中的finding只展示已提交关系缺口，
query不得执行repair、生成finding或运行reconciliation job。

### 22.5 Audit trace

```rust
/// 一个Sandbox业务subject下的bounded audit trace query。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct GetSandboxAuditTraceInput {
    /// subject visibility和lineage校验使用的required context。
    context_ref: ControlledExecutionContextRef,
    /// closed Sandbox-local business audit subject。
    subject_ref: SandboxTraceSubjectRef,
    /// optional closed audit kind filter；None不改变subject scope。
    trace_kind_filter: Option<SandboxAuditTraceKind>,
    /// entry validated first/continued public page request。
    page_request: PageRequest,
}
```

| field | required | source | prohibition |
|---|---:|---|---|
| `context_ref` | yes | caller已授权的Sandbox execution scope | 从subject ref文本或第一条trace反推context。 |
| `subject_ref` | yes | `SandboxTraceSubjectRef::try_from_object_ref`已验证closed business subject | string/opaque ref、view/guard/audit自身、外部主体正文。 |
| `trace_kind_filter` | no | caller closed enum；`None`表示该subject的全部允许kind | topic/operation/error文本过滤、跨subject scan。 |
| `page_request` | yes | entry validated bounded request | truth cursor/version/timestamp直接当page token。 |

reader必须先以subject级visibility形成access decision，再解码page cursor；`NotVisible`时不得验证“该subject是否有trace”。
返回项只包含已提交body-free `SandboxAuditTrace`；不读取observability store、log、metric或external payload，也不追加
“read audit”。empty page仍返回`SandboxQueryPageInfo { returned_count: 0, has_more: false, next_cursor: None }`。

### 22.6 Input constructor / accessor contract

所有application input字段保持private；entry必须调用以下constructor，不能绕过factory直接组装。canonical Step 6
selector在进入input前已经通过其owning factory。constructor不读取repository，也不把“typed ref可构造”解释为目标存在。

```rust
impl GetSandboxExecutionStatusInput {
    /// 包装checked execution status selector。
    pub fn new(selector: SandboxExecutionStatusSelector) -> Self;
    /// 返回唯一selector。
    pub fn selector(&self) -> &SandboxExecutionStatusSelector;
}
impl SandboxExecutionStatusSelector {
    /// 从required typed context构造selector；不验证目标存在性。
    pub fn new(context_ref: ControlledExecutionContextRef) -> Self;
    /// 返回required context ref。
    pub fn context_ref(&self) -> &ControlledExecutionContextRef;
}
impl GetBoundaryStatusInput {
    /// 包装closed boundary selector。
    pub fn new(selector: BoundaryStatusSelector) -> Self;
    /// 返回closed boundary selector。
    pub fn selector(&self) -> &BoundaryStatusSelector;
}
impl GetPolicyDecisionSummaryInput {
    /// 包装closed policy decision selector。
    pub fn new(selector: PolicyDecisionSummarySelector) -> Self;
    /// 返回closed policy decision selector。
    pub fn selector(&self) -> &PolicyDecisionSummarySelector;
}
impl GetCaptureSummaryInput {
    /// 包装closed capture selector。
    pub fn new(selector: CaptureSummarySelector) -> Self;
    /// 返回closed capture selector。
    pub fn selector(&self) -> &CaptureSummarySelector;
}
impl GetMaterialHandoffStatusInput {
    /// 包装closed handoff selector。
    pub fn new(selector: MaterialHandoffStatusSelector) -> Self;
    /// 返回closed handoff selector。
    pub fn selector(&self) -> &MaterialHandoffStatusSelector;
}
impl GetFailureControlStatusInput {
    /// 校验required context与bounded page request后构造input。
    pub fn try_new(
        context_ref: ControlledExecutionContextRef,
        page_request: PageRequest,
    ) -> ApplicationResult<Self>;
    /// 返回required context ref。
    pub fn context_ref(&self) -> &ControlledExecutionContextRef;
    /// 返回validated public page request。
    pub fn page_request(&self) -> &PageRequest;
}
impl GetCleanupReadinessInput {
    /// 包装Step 6 canonical cleanup selector。
    pub fn new(selector: CleanupReadinessSelector) -> Self;
    /// 返回canonical cleanup selector。
    pub fn selector(&self) -> &CleanupReadinessSelector;
}
impl GetRedlineContainmentStatusInput {
    /// 包装Step 6 canonical redline selector。
    pub fn new(selector: RedlineContainmentSelector) -> Self;
    /// 返回canonical redline selector。
    pub fn selector(&self) -> &RedlineContainmentSelector;
}
impl GetSandboxReadProjectionInput {
    /// 包装closed projection selector。
    pub fn new(selector: SandboxReadProjectionSelector) -> Self;
    /// 返回closed projection selector。
    pub fn selector(&self) -> &SandboxReadProjectionSelector;
}
impl GetDerivedInspectPreviewTrendInput {
    /// 包装Step 6 canonical derived selector。
    pub fn new(selector: DerivedInspectPreviewTrendSelector) -> Self;
    /// 返回canonical derived selector。
    pub fn selector(&self) -> &DerivedInspectPreviewTrendSelector;
}
impl GetBackendCapabilityComparisonInput {
    /// 包装Step 6 canonical comparison selector。
    pub fn new(selector: BackendCapabilityComparisonSelector) -> Self;
    /// 返回canonical comparison selector。
    pub fn selector(&self) -> &BackendCapabilityComparisonSelector;
}
impl GetSandboxReconciliationReportInput {
    /// 包装Step 6 canonical exact report selector。
    pub fn new(selector: SandboxReconciliationReportSelector) -> Self;
    /// 返回canonical exact report selector。
    pub fn selector(&self) -> &SandboxReconciliationReportSelector;
}
impl GetSandboxAuditTraceInput {
    /// 校验context、subject、filter和bounded page request后构造input。
    pub fn try_new(
        context_ref: ControlledExecutionContextRef,
        subject_ref: SandboxTraceSubjectRef,
        trace_kind_filter: Option<SandboxAuditTraceKind>,
        page_request: PageRequest,
    ) -> ApplicationResult<Self>;
    /// 返回required access context。
    pub fn context_ref(&self) -> &ControlledExecutionContextRef;
    /// 返回closed business audit subject。
    pub fn subject_ref(&self) -> &SandboxTraceSubjectRef;
    /// 返回optional closed audit kind filter。
    pub fn trace_kind_filter(&self) -> Option<SandboxAuditTraceKind>;
    /// 返回validated public page request。
    pub fn page_request(&self) -> &PageRequest;
}
```

`BoundaryStatusSelector`、`PolicyDecisionSummarySelector`、`CaptureSummarySelector`、
`MaterialHandoffStatusSelector`和`SandboxReadProjectionSelector`是public closed enum；entry只能构造其显式variant。
service必须对variant做穷尽`match`，不得用wildcard把未来variant回退到current/latest路径。

## 23. Access-first、Read Snapshot 与 No-write 算法

### 23.1 13/13 共同执行顺序

每个Query method必须按以下顺序执行；顺序本身是application contract，不是实现建议：

1. 校验`ctx.channel == ApiQuery`、operation与method固定`SandboxQueryKind`一致、digest和actor context有效。
2. 调用input/selector的pure validation；此时不得读target、binding、index或repository body。
3. 仅用actor、query kind、request digest和access scope形成`SandboxQueryAccessDecision`。
4. `NotVisible/Unavailable`立即返回对应surface；target/index read count保持0。
5. `Restricted`当前立即返回no-body restricted surface；不得加载full view再临时裁剪。
6. `Permitted`才允许解码page token并开启一个公平read snapshot，调用该Query的exact reader。
7. 对closed reader outcome做穷尽mapping；view必须由Step 6 checked factory形成，service不得手工填status/body。
8. 关闭read snapshot后发受限diagnostic hook；hook失败不改写已确定surface，也不追加business audit。

```text
checked ctx + exact input
  -> access decision
     -> NotVisible / Unavailable / Restricted : zero target read
     -> Permitted
        -> one fair read snapshot
        -> exact binding/index/source outcome
        -> checked view/result factory
        -> close snapshot
        -> redacted diagnostic hook
```

关键说明：

- `read snapshot`不是`SandboxUnitOfWork`，不暴露save、append、CAS、cursor allocation或commit。
- page token只在access允许后解码，避免hidden subject/target的cursor validity泄露存在性。
- diagnostic hook不能记录exact selector、hidden ref、page token body、safe reason正文、SQL或raw error。
- method返回后不得异步排队refresh/rebuild/retry；维护动作只能由独立Consumer/Job callable触发。

### 23.2 Access decision 到最终 surface

| access status | target/index read | permitted result factory | prohibited mapping |
|---|---:|---|---|
| `Permitted` | exact reader only | `Visible/Empty/Stale/Degraded/Rebuilding/MissingProjection/Unavailable/Failed/Disabled` | repository `None`直接`Empty`；integrity error降级。 |
| `Restricted` | 0 full-target read；本批无restricted reader | no-body `Restricted` + non-empty safe reasons | 加载full body后由API删字段；返回`Visible`。 |
| `NotVisible` | 0 | `NotVisible`，body/reason均空 | 验证target、binding、page token或existence reason。 |
| `Unavailable` | 0 | no-body `Unavailable` + non-empty safe reasons | fail-open为Permitted；尝试fallback repository。 |

最终`Empty`不等于access `NotVisible`：前者说明已获准读取且formal index/absence proof完成，后者明确禁止探测存在性。

### 23.3 Write 与 external-call deny-set

| forbidden call family | 13/13 expected count | violation disposition |
|---|---:|---|
| begin/write/commit `SandboxUnitOfWork` | 0 | `NoWriteViolation` typed application error；不补偿写。 |
| object/view/audit/relay/cursor ID allocation | 0 | implementation defect；结果不得返回。page token codec不分配business identity。 |
| domain transition / command facade | 0 | implementation defect；不得把read变成control path。 |
| resolver refresh / capability probe / isolation backend | 0 | 返回已有stale/unavailable surface，不现场刷新。 |
| capture/handoff/retry/release/reaper/investigation port | 0 | 保持canonical source truth，不产生side effect。 |
| projection/derived/reconciliation writer或builder | 0 | 返回stale/rebuilding/missing/degraded；显式Job负责维护。 |
| idempotency reserve / stored result save | 0 | Query每次读取当前fair snapshot；不产生duplicate state。 |
| `SandboxAuditTrace` append / relay publish | 0 | 只允许redacted diagnostic hook；business truth不变。 |

## 24. 13 Query Exact Read 与 Surface Matrix

### 24.1 主状态读取组

| Query | exact read requirement for `7R-04A` | Found mapping | absence / no-view mapping | safety invariant |
|---|---|---|---|---|
| `GetSandboxExecutionStatus` | required context；同snapshot读取execution status source、current view binding和必要projection marker | checked complete view=`Visible`；checked degraded view=`Degraded`；committed stale view=`Stale` | complete context/view absence proof=`Empty`；projection明确缺失=`MissingProjection`；reader unavailable=`Unavailable` | 不重新resolve refs，不从run status单独推导Completed，不隐藏failure/cleanup/redline。 |
| `GetBoundaryStatus` | `Exact`或context current 0/1 binding；同snapshot读取`BoundaryStatusSourceSnapshot`和view | canonical Required/Pending/Established/Rejected/Failed/Released均作为真实body；读面完整=`Visible`，projection stale=`Stale` | exact/current complete zero proof=`Empty`；source gap=`Degraded/Unavailable` | 不建立backend、不探测capability、不把partial handle当absent或released。 |
| `GetPolicyDecisionSummary` | exact/current decision binding；同snapshot读取policy snapshot、decision和high-risk set | Accepted/Rejected/Blocked/Pending/FailClosed都是canonical body；完整=`Visible` | exact/current zero proof=`Empty`；missing required source=`Degraded/Unavailable` | 不读取policy DSL/approval body，不重评decision，不把fail-closed映success。 |

`BoundaryStatusSourceSnapshot`或`PolicyDecisionSummarySourceSnapshot`关系损坏时返回typed integrity error，不得用
`Degraded`掩盖半提交。canonical业务失败状态仍可完整可见；`Failed` query surface只表示本次read assembly失败。

### 24.2 Capture 与 Handoff 读取组

| Query | exact read requirement for `7R-04A` | Found mapping | absence / no-view mapping | safety invariant |
|---|---|---|---|---|
| `GetCaptureSummary` | context/run/exact-or-0/1 capture binding；一次读取fact、expected keys、all material/observability rows和lineage | checked complete source=`Visible`；允许的explicit source gap=`Degraded`；capture `Partial/Failed/Unavailable`仍在body中诚实展示 | run存在且binding完整证明0=`Empty`；read source unavailable=`Unavailable` | 不调用capture adapter、不重算gap、不读取material body、不宣布artifact/observability formal truth。 |
| `GetMaterialHandoffStatus` | context/exact-or-current binding；一次读取fact、plan、progress、truth cursor、relay linkage和source lineage | pending/delivered/retryable/failed/blocked canonical handoff均可`Visible`；read source gap=`Degraded` | exact/current complete zero proof=`Empty`；required source不可读=`Unavailable` | 不重试handoff、不重算aggregate、不加载cleanup guard重评、不因delivery失败回滚capture。 |

capture material count与committed gap不一致、handoff plan/progress/cursor关系损坏均是typed integrity error。Query不能修正
任一owner，也不能把source corruption转换为“部分可用”body。

### 24.3 Failure、Cleanup 与 Redline 读取组

| Query | exact read requirement for `7R-04A` | Found mapping | absence / no-view mapping | safety invariant |
|---|---|---|---|---|
| `GetFailureControlStatus` | required context、validated first/continued anchor和limit；同snapshot读取immutable view binding、merged window、`u64` scope summary和cross-link proof | non-empty complete window=`Visible`；typed allowed gap=`Degraded`；canonical unknown/pending/conflicted仍在body | complete empty-scope view=`Empty`且保留page info；invalid/expired cursor=typed input/read error；repository unavailable=`Unavailable` | 不按timestamp选winner，不直接查failure ref，不执行control effect，不回退latest。 |
| `GetCleanupReadiness` | Step 6 closed selector；同snapshot读取current/exact binding、immutable guard/evidence、owners、release relation和typed gaps | complete checked view=`Visible`；allowed read gap=`Degraded`；Allowed/Blocked/Pending/ReleaseUnknown均诚实展示 | canonical current/exact absence proof=`Empty`；binding/source unavailable=`Unavailable` | view不是release authority；不执行cleanup/reaper/release，不把absence证明为资源已释放。 |
| `GetRedlineContainmentStatus` | required context+exact redline；同snapshot读取current binding、truth/lineage/detection/preservation/investigation/disposition/timeline proof | complete view=`Visible`；唯一允许read gap=`Degraded`；Detected/Contained/HandoffPending/Released/Terminal保持canonical | exact absence proof=`Empty`；binding/source unavailable=`Unavailable` | `NotVisible`先于index；不解除containment、不关闭调查、不泄露security selector/reason/body。 |

cleanup或redline source的half-commit、duplicate current binding、wrong context、stale source cursor均返回typed integrity error；
不得以`Empty`、historical row fallback或safe reason掩盖。

### 24.4 Projection 与 Derived 读取组

| Query | exact read requirement for `7R-04A` | Found mapping | absence / no-view mapping | safety invariant |
|---|---|---|---|---|
| `GetSandboxReadProjection` | exact/current projection 0/1 binding；读取immutable projection、status-view bindings、cursor/marker/rebuild relation | `Fresh -> Visible`;`Stale -> Stale`;`Rebuilding -> Rebuilding`并可携status-only/last-known-safe body；`Degraded -> Degraded`；checked unavailable projection保留no-body `Unavailable` | current/exact complete zero proof=`MissingProjection`，不是普通`Empty`；repository unavailable=`Unavailable` | projection不是truth source；不生成projection ref/marker/attempt，不触发rebuild。 |
| `GetDerivedInspectPreviewTrend` | Step 6 required context/state/kind selector；消费`ViewSource/ExactAbsent/Unavailable` closed outcome | canonical `Fresh -> Visible`;`Stale -> Stale`;`Rebuilding -> Rebuilding`;domain `Failed/Unavailable` status-only view仍`Visible`;唯一current-source gap=`Degraded` | `ExactAbsent -> Empty`;typed no-view gap=`Unavailable` | 只允许Inspect/Preview/Trend；不运行builder，不把derived failure升级为core failure。 |
| `GetBackendCapabilityComparison` | required context/requirement/ordered 1..=16 summary refs；消费comparison closed lookup outcome | complete comparison=`Visible`；source stale=`Stale`；唯一allowed current-capability gap=`Degraded` | `ExactAbsent -> Empty`;typed read gaps=`Unavailable` | 不扫描配置、不调用capability port、不选择backend、不把Unknown/empty unsupported set当Supported。 |

`SandboxReadProjection`缺失使用`MissingProjection`是有意的；derived/comparison的formal exact absence则使用`Empty`。
这两个surface不能由generic repository `None`统一处理。

### 24.5 Reconciliation 与 Audit 读取组

| Query | exact read requirement for `7R-04A` | Found mapping | absence / no-view mapping | safety invariant |
|---|---|---|---|---|
| `GetSandboxReconciliationReport` | required exact report ref；同snapshot读取aggregate、ordered findings、coverage/basis、matching audit/relay/stored relations | report `Clean/IssuesFound/Failed -> Visible`;report `Degraded -> Degraded`；Failed是报告内容，不是query failure | exact complete reverse-index zero proof=`Empty`；typed read gap=`Unavailable`；integrity corruption=`Err`/public Failed | 不按scope/latest查报告，不运行reconciliation，不生成finding，不repair truth/projection/relay。 |
| `GetSandboxAuditTrace` | context+subject+optional kind+validated page；同snapshot按stable append order读取bounded immutable records | non-empty complete page=`Visible`；允许的safe partial page=`Degraded`且原因来自typed gap | complete zero page=`Empty`；invalid/expired token=typed error；repository unavailable=`Unavailable` | 不读observability store，不追加read audit，不把trace当acceptance/evidence，不跨subject扫描。 |

reconciliation report或audit record本身携带的existing audit linkage只证明原mutation；本次Query不得创建第二条business audit。

## 25. Step 8 DTO Source Requirement

本节只定义未来Step 8必须机械承接的字段来源，不修改historical Step 8。protocol metadata只映射
`SandboxServiceCallContext`，不得复制到application input；response mapper只读取本批typed result和Step 6 public view。

| Query | request DTO必须提供 | application input构造 | response DTO唯一body source | historical field必须删除 |
|---|---|---|---|---|
| `GetSandboxExecutionStatus` | required `context_ref` | `SandboxExecutionStatusSelector::new` | `SandboxExecutionStatusView` + final surface/reasons | caller view ref、visible status、projection freshness bool。 |
| `GetBoundaryStatus` | closed exact `{context_ref,boundary_ref}`或current `{context_ref}` variant | `BoundaryStatusSelector` exact match | `BoundaryStatusView` | 两个optional ref、backend profile/handle/status。 |
| `GetPolicyDecisionSummary` | closed exact `{context_ref,policy_decision_ref}`或current `{context_ref}` variant | `PolicyDecisionSummarySelector` | `PolicyDecisionSummaryView` | policy body/DSL、approval ref、caller decision status。 |
| `GetCaptureSummary` | closed exact `{context_ref,run_ref,capture_ref}`或for-run `{context_ref,run_ref}` variant | `CaptureSummarySelector` | `CaptureSummaryView` | optional run/capture precedence、material body/locator、caller gap/status。 |
| `GetMaterialHandoffStatus` | closed exact `{context_ref,handoff_ref}`或current `{context_ref}` variant | `MaterialHandoffStatusSelector` | `MaterialHandoffStatusView` | target progress body、receipt body、retry flag、caller aggregate status。 |
| `GetFailureControlStatus` | required `context_ref` + required bounded `page_request` | `GetFailureControlStatusInput::try_new` | `FailureControlStatusView` + `SandboxQueryPageInfo` | optional failure ref、latest status、lease status、unbounded lists。 |
| `GetCleanupReadiness` | closed current context或exact context+guard variant | Step 6 `CleanupReadinessSelector` factory | `CleanupReadinessView` | two optional refs、release bool、status/reason supplied by caller。 |
| `GetRedlineContainmentStatus` | required `context_ref` + required exact `redline_ref` | Step 6 `RedlineContainmentSelector::try_new` | `RedlineContainmentView` | context-only latest、investigation body、release/close flag。 |
| `GetSandboxReadProjection` | closed exact context+projection或current context variant | `SandboxReadProjectionSelector` | `SandboxReadProjection` + final surface/reasons | caller projection status、source cursor、refresh/rebuild request。 |
| `GetDerivedInspectPreviewTrend` | required context + exact state + exact `Inspect/Preview/Trend` kind | Step 6 `DerivedInspectPreviewTrendSelector::try_new` | `DerivedInspectPreviewTrendView` | opaque scope、caller source refs、generic derived kind/status。 |
| `GetBackendCapabilityComparison` | required context + requirement + ordered non-empty 1..=16 capability summary refs | Step 6 `BackendCapabilityComparisonSelector::try_new` | `BackendCapabilityComparisonView` | opaque scope/profile refs/empty-means-all/unsupported-only summary。 |
| `GetSandboxReconciliationReport` | required exact `report_ref` | Step 6 `SandboxReconciliationReportSelector::try_new` | `SandboxReconciliationReport` | optional scope/context/latest/target kinds。 |
| `GetSandboxAuditTrace` | required context + subject + optional closed kind + bounded page request | `GetSandboxAuditTraceInput::try_new` | page of `SandboxAuditTrace` + `SandboxQueryPageInfo` | opaque subject、raw operation/error filter、truth cursor page token。 |

Step 8必须为closed selector提供tagged request schema，不能重新采用多个optional字段。`SandboxQuerySurfaceStatus`、
reason marker和view字段的public redaction/omission由Step 8拥有，但不得改变本批的access precedence、body presence矩阵或
canonical status。当前`Restricted`没有body；未来若Step 8要求restricted body，必须先回到Step 6/7新增checked
restricted view type和reader，不能在API mapper临时删字段。

## 26. Error、Diagnostic 与 Reader Handoff

### 26.1 Error family mapping requirement

| source failure family | application disposition | retry / recovery owner | forbidden shortcut |
|---|---|---|---|
| ctx/channel/operation/input/selector invalid | `SandboxApplicationError::Validation`或typed channel mismatch | caller修正请求 | 访问repository后才发现wrong kind。 |
| access `NotVisible` | successful `NotVisible` surface | none | 返回NotFound/Empty或记录existence reason。 |
| access dependency unavailable | successful no-body `Unavailable` surface + safe reason | dependency owner | fail-open、fallback reader。 |
| exact absence proof | successful `Empty`或projection-specific`MissingProjection` | explicit maintenance owner if applicable | generic repository `None`当proof。 |
| typed allowed read gap | `Degraded` with body或no-body `Unavailable`，按§24 exact matrix | maintenance/repository owner | raw SQL/IO/provider error作为reason。 |
| invalid/expired page token | typed application read/validation error；不回退 | caller从第一页重新请求 | 把token body、cursor key回显。 |
| wrong owner/relation/cardinality/half-commit | integrity application error，后续migration/quarantine/reconciliation | data integrity owner | timestamp winner、historical fallback、映Empty/Degraded。 |
| no-write/external-call deny-set violation | `NoWriteViolation` implementation error | implementation fix | 补偿写、继续返回body。 |
| diagnostic hook failure | 保留已确定Query surface；单独受限上报 | observability owner | 追加business audit或重跑Query。 |

本批按L2停止，不逐个repository error variant展开public错误码；但上述分类、safe default和升级L1条件已经固定，
后续`7R-04A/7R-06A`只能细化，不得改变。

### 26.2 `7R-04A` exact reader handoff

| reader family | required input | required closed output | read consistency |
|---|---|---|---|
| execution/boundary/policy | matching `SandboxQueryAccessDecision` + exact selector + read snapshot context | Found checked source/view、exact absence proof、typed unavailable；三分或更严格闭集 | one fair snapshot；current binding cardinality 0/1。 |
| capture/handoff | access decision + exact closed selector | complete/degraded checked source、exact absence、typed unavailable | whole committed owner group；no latest child scans。 |
| failure/control | access decision + context + decoded anchor + validated limit | immutable view/window/scope summary/proofs/gaps + continuation cursor | same immutable snapshot across page continuation。 |
| cleanup/redline | access decision + Step 6 canonical selector | existing `*SourceLookupOutcome` closed enum | same-snapshot binding/source/proof；no write action。 |
| projection | access decision + exact/current selector | projection/source status、exact missing proof、typed unavailable | current binding and projection row same snapshot。 |
| derived/comparison | access decision + Step 6 canonical selector | existing `*SourceLookupOutcome` closed enum | exact binding/source/materialization relation。 |
| reconciliation | access decision + exact report selector | existing `SandboxReconciliationReportLookupOutcome` | aggregate/findings/audit/index same snapshot。 |
| audit | access decision + context/subject/kind + decoded page anchor/limit | bounded records、complete empty proof、typed unavailable + continuation cursor | stable append order and immutable snapshot。 |

`7R-04A`可以为尚无canonical名称的前七类source reader定义application port carrier，但不得修改本批method、input、
selector或result body；若reader无法满足本表，应回到`7R-01B`登记blocker，不得在port层接受宽松opaque selector。

### 26.3 Diagnostic allow-set

Query完成后只允许记录以下低基数语义：fixed operation、query kind、final surface、selector variant kind、returned count、
has-more、canonical status class、typed gap/error class、first/continued page class。严禁记录exact ref、page token/cursor body、
safe reason正文、material/finding/trace body、SQL、path/URL/host/process/network detail、policy/backend/provider正文或secret。

## 27. 13/13 Join、Blocker 与 Formal Handoff

### 27.1 Callable / input / output join

| # | `SandboxQueryKind` | exact method | application input | typed body/result |
|---:|---|---|---|---|
| 1 | `GetSandboxExecutionStatus` | `get_sandbox_execution_status` | `GetSandboxExecutionStatusInput` | `SandboxQueryResult<SandboxExecutionStatusView>` |
| 2 | `GetBoundaryStatus` | `get_boundary_status` | `GetBoundaryStatusInput` | `SandboxQueryResult<BoundaryStatusView>` |
| 3 | `GetPolicyDecisionSummary` | `get_policy_decision_summary` | `GetPolicyDecisionSummaryInput` | `SandboxQueryResult<PolicyDecisionSummaryView>` |
| 4 | `GetCaptureSummary` | `get_capture_summary` | `GetCaptureSummaryInput` | `SandboxQueryResult<CaptureSummaryView>` |
| 5 | `GetMaterialHandoffStatus` | `get_material_handoff_status` | `GetMaterialHandoffStatusInput` | `SandboxQueryResult<MaterialHandoffStatusView>` |
| 6 | `GetFailureControlStatus` | `get_failure_control_status` | `GetFailureControlStatusInput` | `FailureControlStatusQueryResult` |
| 7 | `GetCleanupReadiness` | `get_cleanup_readiness` | `GetCleanupReadinessInput` | `SandboxQueryResult<CleanupReadinessView>` |
| 8 | `GetRedlineContainmentStatus` | `get_redline_containment_status` | `GetRedlineContainmentStatusInput` | `SandboxQueryResult<RedlineContainmentView>` |
| 9 | `GetSandboxReadProjection` | `get_sandbox_read_projection` | `GetSandboxReadProjectionInput` | `SandboxQueryResult<SandboxReadProjection>` |
| 10 | `GetDerivedInspectPreviewTrend` | `get_derived_inspect_preview_trend` | `GetDerivedInspectPreviewTrendInput` | `SandboxQueryResult<DerivedInspectPreviewTrendView>` |
| 11 | `GetBackendCapabilityComparison` | `get_backend_capability_comparison` | `GetBackendCapabilityComparisonInput` | `SandboxQueryResult<BackendCapabilityComparisonView>` |
| 12 | `GetSandboxReconciliationReport` | `get_sandbox_reconciliation_report` | `GetSandboxReconciliationReportInput` | `SandboxQueryResult<SandboxReconciliationReport>` |
| 13 | `GetSandboxAuditTrace` | `get_sandbox_audit_trace` | `GetSandboxAuditTraceInput` | `SandboxAuditTraceQueryResult` |

### 27.2 `S7H-02` 与 blocker disposition

| item | current evidence | remaining owner |
|---|---|---|
| `S7H-02` 13 Query callable | §21.2与§27.1，13/13独立method和typed output | callable部分closed；exact read/index surface由`7R-04A`关闭。 |
| exact application input | §22，13/13 input；closed selector无optional precedence | current batch closed。 |
| access-first / zero-write | §23，13/13共同顺序和deny-set | `7R-04A/05/06A`验证port/fake/entry parity。 |
| absence/degraded/unavailable | §24逐Query matrix | reader outcome具体trait由`7R-04A`。 |
| Step 8 DTO source | §25，13/13 | Step 8 regression机械消费。 |
| `...-INPUT-001` | Command 10 + Query 13 = 23/42 exact input已闭合 | `7R-01C/D`继续闭合19项。 |
| `...-DISPATCH-001` | 23/42独立service method已闭合 | `7R-01C/D` + `7R-06`。 |
| `...-READ-001` | selector/result/no-write已闭合；reader尚未定义 | `7R-04A`。 |
| `...-ENTRY-001` | DTO source requirement已闭合 | `7R-06A`。 |

六个Step 7内部blocker均保持open；本批没有新增L1/L2上游blocker，也没有理由重开Step 6。

### 27.3 Formal writeback draft

未来Step 19在正式`03` application模块装配：13-method `SandboxQueryService`、13个input/selector、typed surface
result、access-first顺序、no-write deny-set和13项read/surface matrix。过程性historical ledger、task状态、静态审计数字和
blocker推进历史不得进入正式正文。正式正文不能只写“query no-write”摘要而省略method/signature/selector/output。

## 28. `7R-01B` Completion Gate

| check | expected result |
|---|---|
| Query logical names / methods / inputs | 13 / 13 / 13；missing 0，duplicate 0。 |
| independent typed dispatch | 13 exact methods；generic/string/route/topic dispatch 0。 |
| closed selector | 13/13 required typed selector；multi-optional precedence 0；current selector仅显式variant。 |
| access-first | `NotVisible/Unavailable/Restricted` target/index read=0。 |
| zero-write | write UoW、truth transition、ID allocation、repair/refresh/rebuild/retry、stored result、business audit均0。 |
| final surface | Found/absence/stale/degraded/rebuilding/missing/unavailable/disabled与integrity error分层明确。 |
| bounded reads | failure/control和audit均required page request、stable snapshot、typed page result。 |
| DTO source requirement | 13/13；metadata只来自call context。 |
| L1 truth protection | boundary/capture/handoff/failure/cleanup/redline canonical failure不得伪装Empty/success。 |
| scope redline | tools semantic execution、runtime agent loop、member lifecycle、artifact/observability truth均未进入。 |
| downstream writes | Step 8、正式`03~07`、skeleton、实现仓修改0。 |
| fabricated facts | compile/test/run/evidence/acceptance/commit claim 0。 |

### 28.1 Static design audit record

| audit | expected | observed design result |
|---|---:|---:|
| Command methods retained | 10 | 10；`7R-01A` callable未丢失。 |
| `SandboxQueryKind` / Query methods / Query inputs / join rows | 13 / 13 / 13 / 13 | 13 / 13 / 13 / 13；missing 0，duplicate 0。 |
| total application entry methods / inputs in current artifact | 23 / 23 | 23 / 23。 |
| generic/string/route/topic Query dispatch | 0 | 0；historical名称只出现在诊断与禁止项。 |
| current Query input中的`SandboxOpaqueRef` | 0 | 0；仅historical invalidation表提及。 |
| Query caller metadata/idempotency/stored-result字段 | 0 | 0。 |
| access-denied target/index read allowance | 0 | 0；§23固定pre-read终止。 |
| write/external side-effect call family allowance | 0 | 0；§23.3逐族deny。 |
| DTO source maps | 13 | 13。 |
| Markdown code fences | even | `7R-01B`完成时历史快照为62 fences（31 open / 31 close，parity 0）；这不是后续批次写入后的全文件当前计数。 |
| current artifact trailing whitespace | 0 | 直接执行`rg -n '[[:blank:]]+$'`扫描，匹配0；不以普通`git diff --check`冒充对untracked产物的覆盖。 |
| formal`03~07`/Step 8/skeleton/implementation writes | 0 | 0。 |
| compile/test/run/evidence/acceptance facts | 0 | 0。 |

这里的结果只证明设计文档的名称、数量、结构和禁止项静态一致，不是Rust编译、单元测试、集成测试、runtime
run、provider evidence或验收事实。exact reader trait尚由`7R-04A`拥有，因此`S7H-02`只关闭callable部分。

本批完成后按产物内连续执行规则进入`7R-01C` 9个Consumer callable；完整`7R-01A~D`前不触发外部停审，
也不得进入`7R-02`或Step 8。

```text
current_document = 03-详细设计.md
current_step = Step 7 regression / 7R-01C
completed_batch = 7R-01B Query callable
next_batch = 7R-01C Consumer callable
query_methods = 13/13
query_inputs = 13/13
query_dto_source_maps = 13/13
query_undefined_inputs = 0
application_entry_callable_progress = 23/42
step_7_internal_blockers = 6/6 open with partial command/query evidence
formal_03_07 = historical_reviewed_revalidation_pending
implementation = CB-SBX-01A blocked / wait_design
real_test_execution = not_started
real_evidence_created = no
commit_required = no
```

# `7R-01C` Consumer Callable、Source Authority 与 Receipt 契约

## 29. 本批恢复点、输入与粒度

### 29.1 当前状态

| field | value |
|---|---|
| current document / Step | `03-详细设计.md / Step 7` |
| current batch | `7R-01C Consumer callable` |
| upstream | `7R-01A` 10 Command与`7R-01B` 13 Query已完成；Step 6 `S7H-03` current |
| output | 9个独立method、9个exact input、application-local receipt result、authority / dedup / UoW要求 |
| excluded | Step 8 envelope / public DTO、repository method、adapter实现、topic、transport ack policy |
| implementation | `CB-SBX-01A blocked / wait_design`；没有实现代码或实现事实 |

本批重新读取详细设计SOP、书写规范、Step 6 shared §11.6、application §9.2 / §9.3~§9.6 /
§11.10、五份canonical对象分件和HLD Consumer骨架。HLD §10只提供名称、来源方向和历史输入骨架；
字段、对象能力和状态关系一律以Step 6 current contract为准。

### 29.2 L1 / L2裁决

| consumer group | level | 本批必须闭合 | 本批停止点 |
|---|---|---|---|
| caller reference / policy / backend capability change | L2 | exact source、target、stale fence、dedup、stored receipt、no-refresh边界 | 不展开resolver异常矩阵，不在consumer内重建projection或重新做policy / boundary decision。 |
| backend lifecycle / material / observability handoff | L1 | exact handle / attempt / generation、matching observation、CAS / same-UoW与unknown保守路径 | external port实现与完整flow后移`7R-03` / Step 9。 |
| control / investigation / relay feedback | L1 | exact authority、target lineage、attempt / preservation correlation、no-rollback与安全终态 | transport ack / retry / dead-letter调度后移Step 9 / 12。 |

普通source unavailable、延迟传播和非安全projection marker失败按L2处理；任何可能把released、delivered、
published、accepted或cleanup-safe伪造为成功的unknown、relation mismatch、half-commit和commit-unknown自动按L1
fail closed，不得降格为普通`Delayed`。

### 29.3 Historical material ledger

| historical pattern | current disposition |
|---|---|
| 两个generic consumer method接收opaque input | invalid；9个consumer各有独立method和独立input。 |
| `SandboxConsumerApplicationReceipt` | invalid；不复活application public receipt；worker仍唯一拥有`SandboxConsumerReceipt`。 |
| application trait返回worker receipt | forbidden；会形成`application -> worker`反向依赖。 |
| 从topic、schema name、error string或source ref文本选择consumer | forbidden；selector只由entry到固定method映射。 |
| duplicate重新读取current truth拼receipt | forbidden；只读取完整stored consumer receipt surface。 |
| consumer收到外部最终Sandbox status | forbidden；只接typed observation / authority，最终状态由owner object推导。 |

## 30. 共同 Consumer Application Contract

### 30.1 Planned owner

| contract | unique planned owner | visibility / persistence |
|---|---|---|
| `SandboxConsumerService` | `crates/application/src/services.rs` | public transient facade；worker只依赖trait。 |
| 9个`Consume*Input` | 对应`crates/application/src/*_consumer_service.rs` | checked transient carrier；不持久化、不等于Step 8 payload。 |
| `SandboxConsumerServiceResult` | `crates/application/src/consumer_service.rs` | application-local output；不作为truth或worker lifecycle持久化。 |
| `SandboxConsumerReceipt` | Step 6 planned `worker` owner | worker在application返回后构造；不得进入application trait签名。 |
| `SandboxConsumerReceiptStatus` / `SandboxServiceOutcome` | Step 6 shared / application owner | 本批只组合并验证，不复制enum或outcome schema。 |

### 30.2 Exact facade

```rust
/// Sandbox的9个trusted inbound consumer use case；每个method固定一个closed selector。
pub trait SandboxConsumerService: Send + Sync {
    /// 记录caller context external reference已经变化并建立stale fence。
    async fn consume_caller_context_reference_changed(
        &self,
        ctx: SandboxServiceCallContext,
        input: ConsumeCallerContextReferenceChangedInput,
    ) -> ApplicationResult<SandboxConsumerServiceResult>;

    /// 记录given policy summary变化并使受影响local inputs失效。
    async fn consume_policy_summary_changed(
        &self,
        ctx: SandboxServiceCallContext,
        input: ConsumePolicySummaryChangedInput,
    ) -> ApplicationResult<SandboxConsumerServiceResult>;

    /// 记录backend capability source变化并阻止旧snapshot继续建立boundary。
    async fn consume_backend_capability_summary_changed(
        &self,
        ctx: SandboxServiceCallContext,
        input: ConsumeBackendCapabilitySummaryChangedInput,
    ) -> ApplicationResult<SandboxConsumerServiceResult>;

    /// 消费exact isolation backend lifecycle observation并保守收束local safety truth。
    async fn consume_isolation_backend_lifecycle_signal(
        &self,
        ctx: SandboxServiceCallContext,
        input: ConsumeIsolationBackendLifecycleSignalInput,
    ) -> ApplicationResult<SandboxConsumerServiceResult>;

    /// 消费material target的matching handoff attempt observation。
    async fn consume_material_handoff_status_changed(
        &self,
        ctx: SandboxServiceCallContext,
        input: ConsumeMaterialHandoffStatusChangedInput,
    ) -> ApplicationResult<SandboxConsumerServiceResult>;

    /// 消费observability target的matching handoff attempt observation。
    async fn consume_observability_handoff_status_changed(
        &self,
        ctx: SandboxServiceCallContext,
        input: ConsumeObservabilityHandoffStatusChangedInput,
    ) -> ApplicationResult<SandboxConsumerServiceResult>;

    /// 将trusted external control request收束为Sandbox-owned control fact。
    async fn consume_sandbox_control_requested(
        &self,
        ctx: SandboxServiceCallContext,
        input: ConsumeSandboxControlRequestedInput,
    ) -> ApplicationResult<SandboxConsumerServiceResult>;

    /// 记录matching redline preservation的investigation handoff observation。
    async fn consume_investigation_handoff_status_changed(
        &self,
        ctx: SandboxServiceCallContext,
        input: ConsumeInvestigationHandoffStatusChangedInput,
    ) -> ApplicationResult<SandboxConsumerServiceResult>;

    /// 将trusted publication feedback应用到exact relay active attempt。
    async fn consume_sandbox_truth_relay_feedback(
        &self,
        ctx: SandboxServiceCallContext,
        input: ConsumeSandboxTruthRelayFeedbackInput,
    ) -> ApplicationResult<SandboxConsumerServiceResult>;
}
```

不存在`consume_event(kind, input)`、`consume_reference_event`、`consume_safety_event`或字符串dispatch。
entry先验证Step 8 envelope，再使用编译期固定method；application不得读取topic决定selector。

### 30.3 Application-local result

```rust
/// application显式返回给worker的receipt status与完整outcome组合。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct SandboxConsumerServiceResult {
    /// worker必须逐字段复制的finite receipt status。
    receipt_status: SandboxConsumerReceiptStatus,
    /// 完整truth、side-effect和stored consumer receipt surface。
    outcome: SandboxServiceOutcome,
}

impl SandboxConsumerServiceResult {
    /// 为固定consumer校验status、outcome和stored surface关系。
    pub fn try_for_consumer(
        consumer_kind: SandboxConsumerKind,
        receipt_status: SandboxConsumerReceiptStatus,
        outcome: SandboxServiceOutcome,
    ) -> ApplicationResult<Self>;
    /// 返回worker必须使用的finite receipt status。
    pub fn receipt_status(&self) -> SandboxConsumerReceiptStatus;
    /// 返回完整application outcome；worker不得重建或裁剪。
    pub fn outcome(&self) -> &SandboxServiceOutcome;
    /// 移交完整组合，供worker构造`SandboxConsumerReceipt`。
    pub fn into_parts(self) -> (SandboxConsumerReceiptStatus, SandboxServiceOutcome);
}
```

`try_for_consumer`先执行`outcome.validate_shape()`，再要求stored result存在、kind为`ConsumerReceipt`并
调用`validate_for_consumer(consumer_kind)`，最后穷尽校验以下关系；实现不得使用wildcard arm：

| receipt status | allowed outcome status | required stored status |
|---|---|---|
| `Accepted` | `Accepted` | `Completed` |
| `Duplicate` | `DuplicateReplayed` | 原stored `Completed | Rejected | Failed` |
| `Delayed` | `NoChange | Degraded` | `Completed` |
| `Rejected` | `Rejected` | `Rejected` |
| `Failed` | `Failed` | `Failed` |
| `Quarantined` | `Rejected | NoChange` | 分别为`Rejected | Completed` |
| `NoOp` | `NoChange` | `Completed` |

该类型不是public receipt、没有`source_event_ref / trace / selector`字段，也不替代worker carrier。worker从
validated envelope保留这三项，再调用`SandboxConsumerReceipt::from_application_outcome(...)`；两层factory
执行相同关系的parity校验，但application不依赖worker crate。

### 30.4 Context、source event与dedup preflight

每个method在任何truth read和reservation前按固定顺序执行：

1. `ctx.channel() == SandboxOperationChannel::Consumer`，operation与该method固定`SandboxConsumerKind`一致。
2. actor、trace、digest和non-empty idempotency key已经由`SandboxServiceCallContext::from_consumer`校验。
3. input `source_event_ref` non-empty；input内typed authority与该consumer allow-set一致。
4. input所有trace-bearing source必须等于`ctx.trace_context()`；control source尤其不得生成第二trace。
5. Step 8 canonical request digest必须覆盖consumer kind、source event ref和input全部业务字段；application不重新序列化。
6. reserve identity仍为`operation_name + request_digest + idempotency_key`；source event、topic、arrival time和retry count不另建unique key。

`Duplicate`必须读取idempotency record链接的完整`SandboxStoredOperationResult`，校验consumer operation与surface
kind后直接返回`DuplicateReplayed`。duplicate write UoW、ID allocation、truth/index read、external port、new audit、
relay和projection marker均为0。stored linkage缺失、wrong-kind或损坏返回`DuplicateMissingResult`，不得重跑mutation。

### 30.5 Application-local external observation candidates

Consumer input 的 observation candidate 由 `application` 唯一拥有；它们不是 domain observation、infra adapter
outcome 或 persisted status。worker / Step 8 mapper 只能构造下列 body-free finite candidate，application 在加载
exact owner、attempt 或 preservation snapshot 后，使用同一 candidate 调用 Step 6 canonical factory。candidate
不得携带 raw provider body、HTTP / SDK status、retry bool、最终 Sandbox status、domain aggregate、Version 或
第二份 trace。

| candidate | planned owner | application 唯一后续转换 | 禁止直接转换 |
|---|---|---|---|
| `IsolationBackendLifecycleObservationCandidate` | `crates/application/src/consumer_service.rs` | `IsolationEnvironmentLifecycleObservation::try_new`，并从同一字段映射 `BackendLifecycleSummary::try_new` | worker 构造 domain observation；`ReleaseConfirmed` 直接写 `Released` |
| `HandoffDeliveryOutcomeCandidate` | `crates/application/src/consumer_service.rs` | 从 loaded target 构造 `HandoffReceiptRef` / `HandoffTargetDeliveryOutcome`，再调用 `HandoffTargetDeliveryObservation::try_from_adapter` | input 直接携带 domain outcome、aggregate status 或 material status |
| `InvestigationHandoffObservationCandidate` | `crates/application/src/consumer_service.rs` | `InvestigationHandoffSummary::from_observation`，再由 exact preservation snapshot 调用 `RedlineInvestigationHandoffObservation::try_from_adapter` | input 直接携带 `InvestigationHandoffSummary` 或 preservation snapshot |
| `SandboxRelayFeedbackCandidate` | `crates/application/src/consumer_service.rs` | 从 loaded attempt 生成 `SandboxRelayDeliveryOutcome`，再调用 `SandboxRelayDeliveryObservation::try_from_typed_outcome` | candidate 直接携带 domain outcome、payload identity 或 active-attempt字段集合 |
| `ControlSourceCandidate` | `crates/application/src/consumer_service.rs` | Command 按 origin 调用 `ControlSourceContext::{from_external | from_system}`；Consumer preflight 只允许 `from_external`；两者都只使用 call-context trace | worker 提交 `ControlSourceContext`、Consumer 伪装 system source 或任一入口提交第二 trace |

```rust
/// application 接收的 isolation backend lifecycle finite candidate kind。
#[derive(Clone, Copy, Debug, Eq, PartialEq)]
pub enum IsolationBackendLifecycleCandidateKind {
    /// backend 明确观察到 exact environment 仍存在。
    ObservedPresent,
    /// backend 明确确认 exact environment 已释放。
    ReleaseConfirmed,
    /// source 暂不可用，不能证明 environment 已释放。
    Unavailable,
    /// source 与 Sandbox owner lineage 冲突。
    Conflicted,
}

/// worker / DTO 到 application 的 body-free lifecycle candidate。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct IsolationBackendLifecycleObservationCandidate {
    /// backend 返回的 stable isolation source identity。
    backend_handle_ref: ExternalSourceRef,
    /// 不含 provider body 的 lifecycle summary identity。
    observation_summary: SafeSummaryRef,
    /// candidate 声明的 canonical backend generation。
    generation_ref: ResourceRef,
    /// trusted source 映射出的 finite candidate kind。
    kind: IsolationBackendLifecycleCandidateKind,
    /// 除 `ReleaseConfirmed` 外必有的 caller-safe reason。
    reason: Option<SandboxReason>,
    /// source observation 的 canonical time。
    observed_at: Timestamp,
}

impl IsolationBackendLifecycleObservationCandidate {
    /// 构造并校验 backend / summary source、generation 与 reason cardinality。
    pub fn try_new(
        backend_handle_ref: ExternalSourceRef,
        observation_summary: SafeSummaryRef,
        generation_ref: ResourceRef,
        kind: IsolationBackendLifecycleCandidateKind,
        reason: Option<SandboxReason>,
        observed_at: Timestamp,
    ) -> ApplicationResult<Self>;
    /// 返回 stable backend source identity。
    pub fn backend_handle_ref(&self) -> &ExternalSourceRef;
    /// 返回 body-free lifecycle summary identity。
    pub fn observation_summary(&self) -> &SafeSummaryRef;
    /// 返回 candidate generation。
    pub fn generation_ref(&self) -> &ResourceRef;
    /// 返回 finite candidate kind。
    pub fn kind(&self) -> IsolationBackendLifecycleCandidateKind;
    /// 返回 candidate reason。
    pub fn reason(&self) -> Option<&SandboxReason>;
    /// 返回 source observation time。
    pub fn observed_at(&self) -> &Timestamp;
}

/// worker / DTO 到 application 的 body-free handoff delivery candidate。
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum HandoffDeliveryOutcomeCandidate {
    /// downstream 确认接收 exact selection。
    Delivered {
        /// downstream stable body-free receipt identity；application 绑定 loaded target。
        receipt_ref: ExternalSourceRef,
    },
    /// 当前 attempt 可在 non-zero age 后重试。
    Retryable {
        /// caller-safe typed outcome reason。
        reason: SandboxReason,
        /// 从 loaded attempt start time 起算的非零等待年龄。
        retry_not_before_age_millis: NonZeroU64,
    },
    /// 当前 attempt 明确 terminal failed。
    Failed {
        /// caller-safe typed outcome reason。
        reason: SandboxReason,
    },
}

impl HandoffDeliveryOutcomeCandidate {
    /// 校验 receipt / retry age / reason 的 closed variant shape。
    pub fn validate_shape(&self) -> ApplicationResult<()>;
}

/// application 接收的 investigation handoff finite disposition。
#[derive(Clone, Copy, Debug, Eq, PartialEq)]
pub enum InvestigationHandoffCandidateDisposition {
    /// 尚未形成可验证的 external 接收。
    Pending,
    /// external owner 已接收 refs / summaries。
    Accepted,
    /// external owner 要求保留现场并阻断 cleanup。
    Blocked,
    /// handoff attempt 已失败，不能证明安全接收。
    Failed,
}

/// worker / DTO 到 application 的 body-free investigation candidate。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct InvestigationHandoffObservationCandidate {
    /// exact investigation owner identity。
    target_ref: ExternalSourceRef,
    /// investigation owner 返回的 body-free receipt / status summary。
    receipt_summary_ref: SafeSummaryRef,
    /// finite external handoff disposition。
    disposition: InvestigationHandoffCandidateDisposition,
    /// `Pending | Blocked | Failed` 必有的 safe reason。
    reason: Option<SandboxReason>,
    /// external observation 的 canonical time。
    observed_at: Timestamp,
}

impl InvestigationHandoffObservationCandidate {
    /// 构造并校验 Investigation source kind 与 disposition / reason cardinality。
    pub fn try_new(
        target_ref: ExternalSourceRef,
        receipt_summary_ref: SafeSummaryRef,
        disposition: InvestigationHandoffCandidateDisposition,
        reason: Option<SandboxReason>,
        observed_at: Timestamp,
    ) -> ApplicationResult<Self>;
    /// 返回 exact investigation target。
    pub fn target_ref(&self) -> &ExternalSourceRef;
    /// 返回 body-free receipt / status summary。
    pub fn receipt_summary_ref(&self) -> &SafeSummaryRef;
    /// 返回 finite disposition。
    pub fn disposition(&self) -> InvestigationHandoffCandidateDisposition;
    /// 返回 candidate reason。
    pub fn reason(&self) -> Option<&SandboxReason>;
    /// 返回 observation time。
    pub fn observed_at(&self) -> &Timestamp;
}

/// application 接收的 relay retryable publisher failure kind。
#[derive(Clone, Copy, Debug, Eq, PartialEq)]
pub enum SandboxRelayRetryableCandidateKind {
    /// publisher binding 暂时不可用。
    PublisherTemporarilyUnavailable,
    /// publisher 明确返回限流或 backpressure。
    PublisherBackpressure,
    /// exact inspect 证明 publisher 未接收 publication。
    PublicationConfirmedAbsent,
    /// validated route 暂时不可用。
    RouteTemporarilyUnavailable,
    /// side effect 前明确拒绝且证明未接收。
    TransportRejectedBeforeAcceptance,
}

/// application 接收的 relay publisher terminal kind。
#[derive(Clone, Copy, Debug, Eq, PartialEq)]
pub enum SandboxRelayDeadLetterCandidateKind {
    /// publisher 永久拒绝 publication。
    PublisherPermanentlyRejected,
    /// publisher 不支持当前 formal schema version。
    SchemaPermanentlyRejected,
    /// publisher 永久拒绝 frozen payload。
    PayloadPermanentlyRejected,
    /// publisher 对 route 没有 authority。
    PublisherNotAuthorized,
    /// publication binding 已永久禁用。
    PublicationBindingDisabled,
}

/// trusted relay feedback 的 finite body-free candidate；不携带 payload / attempt body。
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum SandboxRelayFeedbackCandidate {
    /// publisher 确认接收 exact frozen payload；application 将 receipt 与 loaded attempt 绑定。
    Published {
        /// publisher 返回的 body-free receipt resource identity。
        receipt_ref: ResourceRef,
    },
    /// 当前 attempt 可在 non-zero age 后重试。
    Retryable {
        /// retryability 已由 closed kind 固定。
        failure_kind: SandboxRelayRetryableCandidateKind,
        /// caller-safe failure reason。
        reason: SandboxReason,
        /// 从 attempt start time 计算的非零等待年龄。
        retry_not_before_age_millis: NonZeroU64,
    },
    /// publisher 明确给出 terminal publication outcome。
    DeadLetter {
        /// terminal basis 已由 closed kind 固定。
        dead_letter_kind: SandboxRelayDeadLetterCandidateKind,
        /// caller-safe terminal reason。
        reason: SandboxReason,
    },
}

impl SandboxRelayFeedbackCandidate {
    /// 校验 candidate 的 finite field cardinality；不解析 reason 推断 outcome。
    pub fn validate_shape(&self) -> ApplicationResult<()>;
}

/// application-local control source origin；不携带 trace 或 domain source key。
#[derive(Clone, Copy, Debug, Eq, PartialEq)]
pub enum ControlSourceCandidateOrigin {
    /// authenticated external source。
    External,
    /// application call context代表的system-generated source。
    System,
}

/// control source 的 application-local body-free carrier。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct ControlSourceCandidate {
    /// source origin；决定 source ref / reason cardinality和domain factory。
    origin: ControlSourceCandidateOrigin,
    /// `External`必有、`System`必无的source identity。
    source_ref: Option<ExternalSourceRef>,
    /// `System`必有；`External`可选的caller-safe source reason。
    reason: Option<SandboxReason>,
}

impl ControlSourceCandidate {
    /// 构造authenticated external source candidate；trace由application call context提供。
    pub fn from_external(
        source_ref: ExternalSourceRef,
        reason: Option<SandboxReason>,
    ) -> ApplicationResult<Self>;
    /// 构造system-generated candidate；必须有safe reason，source key从call-context request id生成。
    pub fn from_system(reason: SandboxReason) -> ApplicationResult<Self>;
    /// 返回closed source origin。
    pub fn origin(&self) -> ControlSourceCandidateOrigin;
    /// 返回external source identity；system candidate返回None。
    pub fn source_ref(&self) -> Option<&ExternalSourceRef>;
    /// 返回 optional safe reason。
    pub fn reason(&self) -> Option<&SandboxReason>;
}
```

candidate 的构造和转换规则固定为：lifecycle candidate 的 `ReleaseConfirmed` reason 必须为空，其余三类必须
非空且 source kind 为 `IsolationBackend`；handoff candidate 的 `Delivered` receipt source kind 必须在加载
target后证明与target kind/ref一致，`Retryable`只允许non-zero age，`Failed`不得携带retry age；investigation
candidate 的 target 与 summary 必须同为
`Investigation`，且四个 disposition 都必须携带 target / summary，`Pending | Blocked | Failed` 必须有 reason，
`Accepted` 不得有 reason；relay candidate 只允许 `Published | Retryable | DeadLetter`，feedback 不允许表达
`RetryExhausted` 或 integrity `Failed`；control candidate 的`External`必须为`Some source / optional reason`，
`System`必须为`None source / Some reason`。application从`ctx.trace_context()`创建`ControlSourceContext`，不接受
candidate内的trace；Consumer额外拒绝`System`，只有Command可使用两种origin。

application 的唯一转换顺序为：加载 exact owner / current attempt / preservation snapshot，校验 candidate source、
cardinality 和 exact correlation，穷尽映射 local finite kind，调用一次 Step 6 canonical factory，再执行 owner
transition并以同一 safety group CAS / UoW提交。candidate shape error、wrong generation、wrong active attempt 和
preservation mismatch 是 typed reject / quarantine；不得回退到 latest / scan / generic status 文本。

local enum 到 Step 6 canonical enum 的 exact mapping 固定如下。左右集合必须完全相等；application mapper 对每行
显式写 match arm，不允许 `_`、同名字符串解析或 `From<u8>` 自动开放新分支：

| local enum | local variant | Step 6 canonical variant / factory argument | cardinality |
|---|---|---|---:|
| `IsolationBackendLifecycleCandidateKind` | `ObservedPresent` | `IsolationEnvironmentLifecycleObservationKind::ObservedPresent` + `BackendLifecycleObservationKind::Present` | 1:1 |
| 同上 | `ReleaseConfirmed` | `IsolationEnvironmentLifecycleObservationKind::ReleaseConfirmed` + `BackendLifecycleObservationKind::Released` | 1:1 |
| 同上 | `Unavailable` | `IsolationEnvironmentLifecycleObservationKind::Unavailable` + `BackendLifecycleObservationKind::Unavailable` | 1:1 |
| 同上 | `Conflicted` | `IsolationEnvironmentLifecycleObservationKind::Conflicted` + `BackendLifecycleObservationKind::Conflicted` | 1:1 |
| `HandoffDeliveryOutcomeCandidate` | `Delivered` | `HandoffTargetDeliveryOutcome::Delivered` | 1:1 |
| 同上 | `Retryable` | `HandoffTargetDeliveryOutcome::Retryable` | 1:1 |
| 同上 | `Failed` | `HandoffTargetDeliveryOutcome::Failed` | 1:1 |
| `InvestigationHandoffCandidateDisposition` | `Pending` | `InvestigationHandoffDisposition::Pending` | 1:1 |
| 同上 | `Accepted` | `InvestigationHandoffDisposition::Accepted` | 1:1 |
| 同上 | `Blocked` | `InvestigationHandoffDisposition::Blocked` | 1:1 |
| 同上 | `Failed` | `InvestigationHandoffDisposition::Failed` | 1:1 |
| `SandboxRelayRetryableCandidateKind` | `PublisherTemporarilyUnavailable` | `SandboxRelayRetryableFailureKind::PublisherTemporarilyUnavailable` | 1:1 |
| 同上 | `PublisherBackpressure` | `SandboxRelayRetryableFailureKind::PublisherBackpressure` | 1:1 |
| 同上 | `PublicationConfirmedAbsent` | `SandboxRelayRetryableFailureKind::PublicationConfirmedAbsent` | 1:1 |
| 同上 | `RouteTemporarilyUnavailable` | `SandboxRelayRetryableFailureKind::RouteTemporarilyUnavailable` | 1:1 |
| 同上 | `TransportRejectedBeforeAcceptance` | `SandboxRelayRetryableFailureKind::TransportRejectedBeforeAcceptance` | 1:1 |
| `SandboxRelayDeadLetterCandidateKind` | `PublisherPermanentlyRejected` | `SandboxRelayPublisherDeadLetterKind::PublisherPermanentlyRejected` | 1:1 |
| 同上 | `SchemaPermanentlyRejected` | `SandboxRelayPublisherDeadLetterKind::SchemaPermanentlyRejected` | 1:1 |
| 同上 | `PayloadPermanentlyRejected` | `SandboxRelayPublisherDeadLetterKind::PayloadPermanentlyRejected` | 1:1 |
| 同上 | `PublisherNotAuthorized` | `SandboxRelayPublisherDeadLetterKind::PublisherNotAuthorized` | 1:1 |
| 同上 | `PublicationBindingDisabled` | `SandboxRelayPublisherDeadLetterKind::PublicationBindingDisabled` | 1:1 |
| `SandboxRelayFeedbackCandidate` | `Published` | `SandboxRelayDeliveryOutcome::Published` | 1:1 |
| 同上 | `Retryable` | `SandboxRelayDeliveryOutcome::Retryable` | 1:1 |
| 同上 | `DeadLetter` | `SandboxRelayDeliveryOutcome::DeadLetter` | 1:1 |
| `ControlSourceCandidateOrigin` | `External` | `ControlSourceContext::from_external` | 1:1 |
| 同上 | `System` | `ControlSourceContext::from_system`；Consumer preflight 禁止此行 | 1:1 Command-only |

`InvestigationHandoffDisposition::NotRequired`有意不在 inbound local enum 中，差集为一项且由 strict guard 内部判断拥有；
`SandboxRelayDeadLetterBasis::RetryExhausted`和`SandboxRelayIntegrityFailureSummary`同样没有 trusted-feedback candidate，
分别只由 retry-policy owner 和 integrity recovery owner形成。这三个受控差集不是 mapper 漏项。

candidate API 完整性固定如下：struct candidate 的字段均为 private，checked constructor 与逐字段只读 accessor 一一
对应；closed enum candidate 以公开 variant 作为构造面、以 exhaustive pattern match 作为读取面，并在 enclosing input
的 `try_new` 中强制调用 `validate_shape()`。实现不得另加 generic `status()`、字符串构造器或跳过 input validation 的
public service入口。

| candidate API | fields / variants | checked construction | read surface | unresolved |
|---|---:|---|---|---:|
| `IsolationBackendLifecycleObservationCandidate` | 6 fields | `try_new(6)` | 6 accessors | 0 |
| `HandoffDeliveryOutcomeCandidate` | 3 variants / 4 payload fields | variant + `validate_shape` | exhaustive match | 0 |
| `InvestigationHandoffObservationCandidate` | 5 fields | `try_new(5)` | 5 accessors | 0 |
| `SandboxRelayFeedbackCandidate` | 3 variants / 6 payload fields | variant + `validate_shape` | exhaustive match | 0 |
| `ControlSourceCandidate` | 3 fields | `from_external` / `from_system` | 3 accessors | 0 |

| candidate branch | application factory sequence | loaded-only fields | prohibited fallback |
|---|---|---|---|
| handoff `Delivered` | `HandoffReceiptRef::try_from_adapter` -> `HandoffTargetDeliveryOutcome::Delivered` -> `HandoffTargetDeliveryObservation::try_from_adapter` | target kind/ref、handoff ref、attempt relation | worker构造receipt relation、receipt ref当formal downstream truth |
| handoff `Retryable` | `HandoffTargetDeliveryOutcome::Retryable` -> observation factory | target、attempt start、generation | reason文本推retryability、zero age |
| handoff `Failed` | `HandoffTargetDeliveryOutcome::Failed` -> observation factory | target、attempt、whole aggregate | 自动重试、回滚capture |
| investigation `Pending | Accepted | Blocked | Failed` | exhaustive disposition map -> `InvestigationHandoffSummary::from_observation` -> redline observation factory | current preservation snapshot、redline Version | `NotRequired` inbound、candidate直接改cleanup/redline status |
| relay `Published` | `SandboxRelayReceiptSummary::try_from_publisher` -> `SandboxRelayDeliveryOutcome::Published` -> relay observation factory | exact payload identity、attempt ordinal/start、target binding | worker上传payload identity、ack字符串映射 |
| relay `Retryable` | exhaustive failure-kind map -> `SandboxRelayFailureSummary::try_from_publisher` -> `SandboxRelayDeliveryOutcome::Retryable` -> observation factory | exact attempt relation | error文本分类、立即开始新attempt |
| relay `DeadLetter` | exhaustive terminal-kind map -> `SandboxRelayDeadLetterSummary::from_publisher_terminal` -> `SandboxRelayDeliveryOutcome::DeadLetter` -> observation factory | exact attempt relation | `RetryExhausted`伪装为publisher feedback、unknown变terminal |
| control `External | System` | exhaustive origin map -> `ControlSourceContext::{from_external | from_system}` | call-context trace/request id | candidate trace、caller source key、generic source context |

所有 exhaustive map 必须显式列出本节 local enum 的全部variant，不得使用 `_` arm。Step 6 domain enum新增variant时，
compiler只会迫使application mapper显式裁决，不能自动开放worker或protocol输入。

## 31. L2 Reference / Policy / Capability Consumers

### 31.1 `ConsumeCallerContextReferenceChangedInput`

```rust
/// caller-owned external reference变化的checked application input。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct ConsumeCallerContextReferenceChangedInput {
    /// validated inbound envelope的non-empty event identity。
    source_event_ref: ResourceRef,
    /// 受变化影响的exact accepted Sandbox context scope。
    context_ref: ControlledExecutionContextRef,
    /// exact tracked state、expected observation和new observation的lost-update fence。
    refresh_marker: ReferenceRefreshMarker,
}

impl ConsumeCallerContextReferenceChangedInput {
    /// 校验source kind allow-set、exact state target和body-free marker。
    pub fn try_new(
        source_event_ref: ResourceRef,
        context_ref: ControlledExecutionContextRef,
        refresh_marker: ReferenceRefreshMarker,
    ) -> ApplicationResult<Self>;
    /// 返回 validated inbound envelope 的 non-empty source event identity。
    pub fn source_event_ref(&self) -> &ResourceRef;
    /// 返回受 reference 变化影响的 exact accepted context selector。
    pub fn context_ref(&self) -> &ControlledExecutionContextRef;
    /// 返回 expected / observed source 组成的 lost-update fence。
    pub fn refresh_marker(&self) -> &ReferenceRefreshMarker;
}
```

marker的`expected_source / observed_source` kind只允许`Identity | Work | Tool | Runtime | MemberHost | Runner`。
`Policy | IsolationBackend | Artifact | Observability | Investigation`必须由其它exact consumer处理。application按
`context_ref + reference_state_ref` exact index加载唯一state，并要求current full binding等于expected observation；
只调用`ReferenceResolutionState::mark_stale`。本调用不调用resolver、不应用new safe summary、不修改首次intake的
`ContextReferenceResolution`，也不重建projection。

### 31.2 `ConsumePolicySummaryChangedInput`

```rust
/// given policy source变化的checked application input。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct ConsumePolicySummaryChangedInput {
    /// validated inbound envelope 的 non-empty event identity。
    source_event_ref: ResourceRef,
    /// 受 policy source 变化影响的 exact accepted context scope。
    context_ref: ControlledExecutionContextRef,
    /// immutable snapshot中必须存在的exact affected source role。
    source_role: PolicySourceRole,
    /// 当前受影响的immutable applicability snapshot。
    policy_snapshot_ref: PolicyApplicabilitySnapshotRef,
    /// policy external source对应的long-lived stale fence。
    refresh_marker: ReferenceRefreshMarker,
}

impl ConsumePolicySummaryChangedInput {
    /// 校验 policy authority、snapshot target 与 body-free refresh marker relation。
    pub fn try_new(
        source_event_ref: ResourceRef,
        context_ref: ControlledExecutionContextRef,
        source_role: PolicySourceRole,
        policy_snapshot_ref: PolicyApplicabilitySnapshotRef,
        refresh_marker: ReferenceRefreshMarker,
    ) -> ApplicationResult<Self>;
    /// 返回 validated inbound envelope 的 non-empty source event identity。
    pub fn source_event_ref(&self) -> &ResourceRef;
    /// 返回受变化影响的 exact accepted context selector。
    pub fn context_ref(&self) -> &ControlledExecutionContextRef;
    /// 返回 immutable snapshot 中必须存在的 exact source role。
    pub fn source_role(&self) -> PolicySourceRole;
    /// 返回当前被失效的 immutable policy applicability snapshot ref。
    pub fn policy_snapshot_ref(&self) -> &PolicyApplicabilitySnapshotRef;
    /// 返回 policy source 的 expected / observed lost-update fence。
    pub fn refresh_marker(&self) -> &ReferenceRefreshMarker;
}
```

marker两侧source kind必须为`Policy`。loaded snapshot必须属于`context_ref`，且其`source_bindings`中exact
`source_role` binding的完整source observation等于marker expected source；不存在、重复或relation mismatch为typed
integrity error，不得选择latest binding。consumer只提交matching `ReferenceResolutionState` stale mutation和stored
receipt；immutable policy snapshot / decision不原地改status。新的snapshot和policy reevaluation由独立refresh / command
路径完成，在此之前旧snapshot不得被launch guard当fresh使用。

### 31.3 `ConsumeBackendCapabilitySummaryChangedInput`

```rust
/// isolation backend capability source变化的checked application input。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct ConsumeBackendCapabilitySummaryChangedInput {
    /// validated inbound envelope 的 non-empty event identity。
    source_event_ref: ResourceRef,
    /// 受 backend capability 变化影响的 exact accepted context scope。
    context_ref: ControlledExecutionContextRef,
    /// capability snapshot 必须评估的 immutable boundary requirement ref。
    requirement_ref: BoundaryRequirementSetRef,
    /// 当前被新observation失效的immutable capability snapshot。
    capability_ref: BackendCapabilitySummaryRef,
    /// backend source对应的long-lived stale fence。
    refresh_marker: ReferenceRefreshMarker,
}

impl ConsumeBackendCapabilitySummaryChangedInput {
    /// 校验 isolation-backend authority、requirement / capability target 与 refresh marker relation。
    pub fn try_new(
        source_event_ref: ResourceRef,
        context_ref: ControlledExecutionContextRef,
        requirement_ref: BoundaryRequirementSetRef,
        capability_ref: BackendCapabilitySummaryRef,
        refresh_marker: ReferenceRefreshMarker,
    ) -> ApplicationResult<Self>;
    /// 返回 validated inbound envelope 的 non-empty source event identity。
    pub fn source_event_ref(&self) -> &ResourceRef;
    /// 返回受变化影响的 exact accepted context selector。
    pub fn context_ref(&self) -> &ControlledExecutionContextRef;
    /// 返回 capability snapshot 必须评估的 exact requirement ref。
    pub fn requirement_ref(&self) -> &BoundaryRequirementSetRef;
    /// 返回当前被新 observation 失效的 immutable capability snapshot ref。
    pub fn capability_ref(&self) -> &BackendCapabilitySummaryRef;
    /// 返回 backend source 的 expected / observed lost-update fence。
    pub fn refresh_marker(&self) -> &ReferenceRefreshMarker;
}
```

marker两侧source kind必须为`IsolationBackend`。loaded requirement必须属于context；loaded capability必须评估
该requirement，且其完整`backend_ref`等于marker expected source。consumer只提交matching reference state stale
mutation；不修改immutable capability snapshot，不重新probe backend，不选择backend，也不改变已成立boundary truth。
任何后序boundary establishment必须重新取得current fresh 10/10 summary；comparison / boundary projection stale只在
reference mutation提交并获得`SandboxReferenceCursor`后由后续marker动作形成。

### 31.4 三类L2共同提交边界

```text
preflight -> reserve -> exact scope/index read -> Versioned<ReferenceResolutionState>
  -> verify full expected observation -> mark_stale -> stage audit + stored receipt
  -> assign SandboxReferenceCursor after write set staged -> commit
  -> post-commit enqueue exact projection/derived stale-marker work
```

同一exact marker已由另一event提交且current state已等价stale时，可以形成`NoOp + NoChange`完整stored receipt；
同key duplicate必须走`Duplicate`，两者不得混用。repository / source dependency暂不可用且尚未改变truth时可形成
`Delayed`完整receipt；lost-update、source identity冲突、forbidden body和wrong authority不能写`Delayed`掩盖，必须
typed reject / quarantine。post-commit普通projection marker失败不得回滚reference mutation，记录L2 bounded
diagnostic并保持对应maintenance pending；它不能把旧projection重新标为fresh。

## 32. L1 Isolation Backend Lifecycle Consumer

### 32.1 `ConsumeIsolationBackendLifecycleSignalInput`

```rust
/// exact isolation handle 的 trusted backend lifecycle signal input。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct ConsumeIsolationBackendLifecycleSignalInput {
    /// validated inbound envelope 的 non-empty event identity。
    source_event_ref: ResourceRef,
    /// observation 唯一适用的 Sandbox-local isolation handle selector。
    isolation_handle_ref: IsolationEnvironmentHandleRef,
    /// worker只能构造的application-local body-free lifecycle candidate。
    observation_candidate: IsolationBackendLifecycleObservationCandidate,
}

impl ConsumeIsolationBackendLifecycleSignalInput {
    /// 校验isolation-backend authority及kind / reason / generation的body-free field relation。
    pub fn try_new(
        source_event_ref: ResourceRef,
        isolation_handle_ref: IsolationEnvironmentHandleRef,
        observation_candidate: IsolationBackendLifecycleObservationCandidate,
    ) -> ApplicationResult<Self>;
    /// 返回 validated inbound envelope 的 non-empty source event identity。
    pub fn source_event_ref(&self) -> &ResourceRef;
    /// 返回 observation 唯一适用的 exact isolation handle selector。
    pub fn isolation_handle_ref(&self) -> &IsolationEnvironmentHandleRef;
    /// 返回application-local body-free lifecycle candidate。
    pub fn observation_candidate(&self) -> &IsolationBackendLifecycleObservationCandidate;
}
```

input 不携带 lease / handle / boundary / cleanup status、`released: bool`、orphan marker、failure kind、
cleanup permission或 raw backend body。application按handle ref加载exact handle、boundary、optional lease、
active cleanup authorization、optional orphan和generation group；candidate的`backend_handle_ref`、generation及source
kind必须全部匹配，不允许扫描latest handle或按summary文本选择分支。加载后application穷尽映射candidate kind并唯一调用
`IsolationEnvironmentLifecycleObservation::try_new`形成canonical observation；worker不构造domain observation，
也不调用handle / cleanup owner method。

| candidate kind | domain lifecycle kind | cleanup summary kind |
|---|---|---|
| `ObservedPresent` | `IsolationEnvironmentLifecycleObservationKind::ObservedPresent` | `BackendLifecycleObservationKind::Present` |
| `ReleaseConfirmed` | `IsolationEnvironmentLifecycleObservationKind::ReleaseConfirmed` | `BackendLifecycleObservationKind::Released` |
| `Unavailable` | `IsolationEnvironmentLifecycleObservationKind::Unavailable` | `BackendLifecycleObservationKind::Unavailable` |
| `Conflicted` | `IsolationEnvironmentLifecycleObservationKind::Conflicted` | `BackendLifecycleObservationKind::Conflicted` |

映射必须穷尽且没有wildcard。两项domain factory复用candidate的backend handle、summary、generation、reason与
observed time；任何一项factory失败都不允许执行owner transition。

### 32.2 Finite branch 与 owner transition

| observation kind | required current basis | allowed owner action | receipt / safety result |
|---|---|---|---|
| `ReleaseConfirmed` | exact persisted cleanup release basis；handle为`ReleasePending`；fresh complete redline coverage | 先形成`CleanupCompletionBasis`，再按Step 6固定顺序更新handle、optional lease/orphan、boundary、cleanup；满足closure guard时再收束context/identity | matching completion为`Accepted`；同一confirmation已完整提交为`NoOp`；缺completion basis不得宣称released。 |
| `ObservedPresent` | exact non-released handle/generation；expired或orphan-eligible lease relation | 只在完整owner proof成立时推进lease / handle orphan suspicion及对应recovery marker | 保守`Accepted | NoOp`；绝不回退`ReleasePending`到`Active`。 |
| `Unavailable` | exact handle/generation，且尚无可证明terminal observation | 保持current truth，写完整`Delayed` receipt；必要时保留same-basis inspection pending | 不创建failure、released或orphan truth。 |
| `Conflicted` | exact handle/generation和non-released safe reason | 按owner proof形成orphan suspicion / typed failure classification候选与cleanup stale marker | 必须可见为`Accepted | Quarantined`，不能作为普通projection delay。 |

`ReleaseConfirmed`不是caller提交的Sandbox release truth。matching branch必须复用Step 6 cleanup completion链：

```text
load exact Versioned owner group + persisted release basis
  -> fresh complete redline coverage
  -> cleanup.require_completion_basis(...)
  -> handle.mark_released(existing observation, ...)
  -> optional lease.mark_released(completion basis, ...)
  -> optional orphan.mark_recovered(completion basis, matching lifecycle summary, ...)
  -> boundary.mark_released(handle, completion basis, ...)
  -> cleanup.settle_release_confirmation(...)
  -> optional context / identity closure only when current coverage permits
  -> stage audit + relay drafts + stored consumer receipt
  -> CAS all owner rows and commit one UoW
```

consumer mapper必须从同一 inbound typed source形成`IsolationEnvironmentLifecycleObservation`和cleanup需要的
`BackendLifecycleSummary`；两者的backend source、summary、generation、reason和observed time逐项相等。不得对backend
二次读取后拼接两份不同观察，也不得仅凭`ReleaseConfirmed`直接把handle / lease / boundary写为`Released`。

### 32.3 Unknown、race 与 commit-unknown

- redline、cleanup authorization与lifecycle consumer争用同一lineage safety group，全部使用repository `Version` CAS；last-write-wins无效。
- relation mismatch、wrong generation、missing release basis或incomplete redline coverage是typed reject / quarantine，不是`Delayed`。
- UoW commit失败且结果未知时，返回`CommitUnknown`，不得生成fresh success receipt；恢复先按source event reservation与exact owner refs检查stored result和owner group。
- 若owner group已完整提交但stored receipt链接未知，只能修复同一reservation的receipt linkage；不得重放owner transition。
- post-commit普通projection / diagnostic marker失败只登记L2 maintenance pending；不能回滚release或把已确认owner重新标为active。

## 33. L1 Material 与 Observability Handoff Consumers

### 33.1 `ConsumeMaterialHandoffStatusChangedInput`

```rust
/// material target 的 matching handoff attempt observation input。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct ConsumeMaterialHandoffStatusChangedInput {
    /// validated inbound envelope 的 non-empty event identity。
    source_event_ref: ResourceRef,
    /// observation 所属的 exact Sandbox handoff batch selector。
    handoff_ref: HandoffFactRef,
    /// target plan 中 exact material downstream target selector。
    target_ref: ExternalSourceRef,
    /// feedback声明的exact persisted attempt selector。
    attempt_ref: HandoffDeliveryAttemptRef,
    /// worker只能构造的application-local finite target outcome；不是aggregate status。
    delivery_candidate: HandoffDeliveryOutcomeCandidate,
    /// envelope已校验的target observation time。
    observed_at: Timestamp,
}

impl ConsumeMaterialHandoffStatusChangedInput {
    /// 校验material target authority及handoff / target / observation identity一致性。
    pub fn try_new(
        source_event_ref: ResourceRef,
        handoff_ref: HandoffFactRef,
        target_ref: ExternalSourceRef,
        attempt_ref: HandoffDeliveryAttemptRef,
        delivery_candidate: HandoffDeliveryOutcomeCandidate,
        observed_at: Timestamp,
    ) -> ApplicationResult<Self>;
    /// 返回 validated inbound envelope 的 non-empty source event identity。
    pub fn source_event_ref(&self) -> &ResourceRef;
    /// 返回 exact handoff batch selector。
    pub fn handoff_ref(&self) -> &HandoffFactRef;
    /// 返回 immutable plan 中的 exact material target selector。
    pub fn target_ref(&self) -> &ExternalSourceRef;
    /// 返回feedback声明的exact persisted attempt selector。
    pub fn attempt_ref(&self) -> &HandoffDeliveryAttemptRef;
    /// 返回application-local finite target outcome candidate。
    pub fn delivery_candidate(&self) -> &HandoffDeliveryOutcomeCandidate;
    /// 返回target observation time。
    pub fn observed_at(&self) -> &Timestamp;
}
```

target kind只允许`Artifact | Runtime | Runner`中由immutable plan已批准且确实选择至少一项captured material的
目标。`Other`、`Observability`、`Investigation`和`EventRelay`不得通过material consumer进入；它们由对应exact
owner处理或被typed reject。input不得携带aggregate status、material status、cleanup bool或下游formal
artifact/runtime truth。

### 33.2 `ConsumeObservabilityHandoffStatusChangedInput`

```rust
/// observability target 的 matching handoff attempt observation input。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct ConsumeObservabilityHandoffStatusChangedInput {
    /// validated inbound envelope 的 non-empty event identity。
    source_event_ref: ResourceRef,
    /// observation 所属的 exact Sandbox handoff batch selector。
    handoff_ref: HandoffFactRef,
    /// handoff source中必须匹配的 exact observability material selector。
    observability_material_ref: ObservabilityMaterialRef,
    /// immutable plan 中 exact observability target selector。
    target_ref: ExternalSourceRef,
    /// feedback声明的exact persisted attempt selector。
    attempt_ref: HandoffDeliveryAttemptRef,
    /// worker只能构造的application-local finite target outcome；不是observability store status。
    delivery_candidate: HandoffDeliveryOutcomeCandidate,
    /// envelope已校验的target observation time。
    observed_at: Timestamp,
}

impl ConsumeObservabilityHandoffStatusChangedInput {
    /// 校验observability authority、material / target plan与observation identity关系。
    pub fn try_new(
        source_event_ref: ResourceRef,
        handoff_ref: HandoffFactRef,
        observability_material_ref: ObservabilityMaterialRef,
        target_ref: ExternalSourceRef,
        attempt_ref: HandoffDeliveryAttemptRef,
        delivery_candidate: HandoffDeliveryOutcomeCandidate,
        observed_at: Timestamp,
    ) -> ApplicationResult<Self>;
    /// 返回 validated inbound envelope 的 non-empty source event identity。
    pub fn source_event_ref(&self) -> &ResourceRef;
    /// 返回 exact handoff batch selector。
    pub fn handoff_ref(&self) -> &HandoffFactRef;
    /// 返回 handoff source exact observability material selector。
    pub fn observability_material_ref(&self) -> &ObservabilityMaterialRef;
    /// 返回 immutable plan 中 exact observability target selector。
    pub fn target_ref(&self) -> &ExternalSourceRef;
    /// 返回feedback声明的exact persisted attempt selector。
    pub fn attempt_ref(&self) -> &HandoffDeliveryAttemptRef;
    /// 返回application-local finite target outcome candidate。
    pub fn delivery_candidate(&self) -> &HandoffDeliveryOutcomeCandidate;
    /// 返回target observation time。
    pub fn observed_at(&self) -> &Timestamp;
}
```

target kind固定`Observability`；若经明确HLD binding使用bus作为observability relay，target仍必须在immutable plan中
以observability owner关系被验证，不能改投`EventRelay` generic target。receipt只证明refs / summaries已被该target接收，
不证明observability store truth、retention、审计签署或正式evidence已经成立。

### 33.3 Matching attempt、same-UoW 与 no-rollback

两类consumer均按`handoff_ref`读取whole aggregate与`Version`，并要求input target存在于immutable plan，current
progress为`Attempting`且`attempt_ref`完全相等。material consumer还必须证明target kind属于`Artifact | Runtime |
Runner`且`material_selection.includes_captured_materials()`为true。application从loaded `HandoffTarget`、attempt、
candidate和observed time穷尽构造`HandoffTargetDeliveryOutcome`，再调用`HandoffTargetDeliveryObservation::try_from_adapter`形成canonical observation，然后只调用
`HandoffFact::apply_target_observation`；worker不构造domain observation。aggregate status由owner按全量progress机械
推导，caller和application mapper不得提交或计算“最后receipt决定整体状态”。

| finite outcome | aggregate / material owner action | forbidden interpretation |
|---|---|---|
| `Delivered` | matching progress进入`Delivered`；按material-specific helper更新所选captured material或observability material；stage cleanup reevaluation marker | 不等于artifact truth、runtime completion、runner completion或observability retention。 |
| `Retryable` | matching progress进入`Retryable`，保留typed reason与non-zero not-before age | 不立即开始新attempt，不按错误字符串重试。 |
| `Failed` | matching progress进入terminal`Failed`；按exact source形成failure / cleanup stale marker | 不覆盖capture fact，不删除已交接material。 |

handoff aggregate、受影响material lifecycle、audit、relay draft、cleanup reevaluation marker和完整stored receipt在同一UoW
CAS提交。commit unknown恢复只检查exact attempt与whole aggregate；如果observation已应用，必须重建同一stored surface，
不能再调用owner transition。external source反馈失败、projection marker失败或后续cleanup reevaluation失败都不回滚已提交
handoff progress；只登记bounded pending工作。matching `Delivered` receipt也不能让Sandbox回写下游owner truth。

## 34. L1 External Control Consumer

### 34.1 `ConsumeSandboxControlRequestedInput`

```rust
/// trusted external control request 的checked application input。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct ConsumeSandboxControlRequestedInput {
    /// validated inbound envelope 的 non-empty event identity。
    source_event_ref: ResourceRef,
    /// exact Sandbox-owned control target selector。
    target: SandboxControlTargetSelector,
    /// external authority请求的closed control kind。
    control_kind: SandboxControlKind,
    /// authenticated external source的application-local body-free candidate。
    source_candidate: ControlSourceCandidate,
    /// application必须加载的exact immutable strict conflict guard identity。
    conflict_guard_ref: ControlConflictGuardRef,
}

impl ConsumeSandboxControlRequestedInput {
    /// 校验external-only source、trace equality、closed target及strict guard selector。
    pub fn try_new(
        source_event_ref: ResourceRef,
        target: SandboxControlTargetSelector,
        control_kind: SandboxControlKind,
        source_candidate: ControlSourceCandidate,
        conflict_guard_ref: ControlConflictGuardRef,
    ) -> ApplicationResult<Self>;
    /// 返回 validated inbound envelope 的 non-empty source event identity。
    pub fn source_event_ref(&self) -> &ResourceRef;
    /// 返回 exact Sandbox control target selector。
    pub fn target(&self) -> &SandboxControlTargetSelector;
    /// 返回 external authority请求的finite control kind。
    pub fn control_kind(&self) -> SandboxControlKind;
    /// 返回 authenticated external source candidate。
    pub fn source_candidate(&self) -> &ControlSourceCandidate;
    /// 返回 exact immutable strict conflict guard ref。
    pub fn conflict_guard_ref(&self) -> &ControlConflictGuardRef;
}
```

application要求`source_candidate.origin() == ControlSourceCandidateOrigin::External`，并使用唯一call context的
`ctx.trace_context()`调用`ControlSourceContext::from_external(source_ref, reason, trace_context)`。system candidate
只能用于Command / owner内部路径，不能伪装为inbound event；input没有trace字段，因此不存在第二trace可供选择。
external source kind和control kind的allow-set由strict guard判断。input不含control ref、target lineage散装refs、
effect、existing controls、disposition、status、completion observation或failure ref。

### 34.2 与 Command 共用唯一 control kernel

本method逐字段构造与`SubmitSandboxControl`相同的`ControlIntent`，并调用同一个private application kernel；不复制
guard算法或ControlFact factory：

```text
consumer preflight + reservation
  -> load target owner group + same-scope controls + exact active guard
  -> generate control ref/time; build ControlTargetLineage + ControlIntent
  -> guard.evaluate(intent, existing controls)
  -> ControlFact::{accept | duplicate | conflict}
  -> stage fact + audit + relay + stored consumer receipt
  -> CAS target-control scope and commit fact UoW
  -> only after commit, schedule exact Sandbox-side effect correlation
```

`Accept | TerminalOverride`形成`Accepted` fact；guard-level `Duplicate`形成显式`IgnoredDuplicate` fact，和application
idempotency `Duplicate`不是一回事；`Conflict`形成显式`Conflicted` fact。后二者不得调用effect。accepted control的kill /
cancel只能由后续Sandbox effect path消费formal fact；本consumer不执行业务replay、tools semantic execution、runtime
agent loop、member lifecycle orchestration或直接release环境。

fact UoW commit unknown时不得生成第二control ref；先按reservation及source key读取exact fact / stored result。fact已提交但
effect尚未发生时保持`Accepted`并从persisted correlation继续。effect unknown不把fact伪造为`Completed`；typed effect
failure也只能经`ControlEffectObservation`和owner method收束。

## 35. L1 Investigation Handoff Consumer

### 35.1 `ConsumeInvestigationHandoffStatusChangedInput`

```rust
/// exact redline preservation 对应的trusted investigation handoff observation input。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct ConsumeInvestigationHandoffStatusChangedInput {
    /// validated inbound envelope 的 non-empty event identity。
    source_event_ref: ResourceRef,
    /// observation 唯一适用的 Sandbox redline containment selector。
    redline_ref: RedlineContainmentRef,
    /// worker只能构造的application-local investigation handoff candidate。
    observation_candidate: InvestigationHandoffObservationCandidate,
    /// application必须加载的exact immutable strict containment guard ref。
    containment_guard_ref: RedlineContainmentGuardRef,
}

impl ConsumeInvestigationHandoffStatusChangedInput {
    /// 校验investigation authority、redline / preservation / observation与guard selector关系。
    pub fn try_new(
        source_event_ref: ResourceRef,
        redline_ref: RedlineContainmentRef,
        observation_candidate: InvestigationHandoffObservationCandidate,
        containment_guard_ref: RedlineContainmentGuardRef,
    ) -> ApplicationResult<Self>;
    /// 返回 validated inbound envelope 的 non-empty source event identity。
    pub fn source_event_ref(&self) -> &ResourceRef;
    /// 返回 exact redline containment selector。
    pub fn redline_ref(&self) -> &RedlineContainmentRef;
    /// 返回application-local body-free investigation handoff candidate。
    pub fn observation_candidate(&self) -> &InvestigationHandoffObservationCandidate;
    /// 返回 exact immutable strict containment guard selector。
    pub fn containment_guard_ref(&self) -> &RedlineContainmentGuardRef;
}
```

candidate target与receipt summary的source kind必须为`Investigation`；application将candidate disposition穷尽映射为
`InvestigationHandoffDisposition::{Pending | Accepted | Blocked | Failed}`，复用candidate的target、summary、reason和time
调用`InvestigationHandoffSummary::from_observation`。`NotRequired`没有inbound candidate variant，strict redline
requirement不得由worker绕过。input不携带domain-only `InvestigationHandoffSummary`或
`RedlinePreservationSnapshot`；后者没有独立public identity且只能由application从current aggregate读取。input也不接受
cleanup / failure散装refs、investigation case正文、operator note、最终containment status、release bool、acceptance
evidence或审查签署。

### 35.2 Preservation correlation 与安全终态

application按redline ref加载whole aggregate、active guard与`Version`，从aggregate读取current persisted
preservation snapshot，先构造matching `InvestigationHandoffSummary`，再调用
`RedlineInvestigationHandoffObservation::try_from_adapter`。该factory把candidate绑定到
读取时的exact current snapshot，随后调用`RedlineContainment::record_investigation_observation`时再次验证snapshot与
Version；若material owner并发刷新snapshot，CAS失败后必须重新读取，旧candidate不能以arrival time覆盖新snapshot。

记录observation本身不改变containment status。application随后可用同一snapshot、observation和strict guard执行
`evaluate_release`；只有guard返回closed `ReleaseCleanupBlock | MakeTerminal` decision，owner才分别调用
`release_cleanup_block`或`mark_terminal`。pending / unavailable / insufficient observation保持`HandoffPending`并形成
完整`Delayed` receipt；不能由consumer猜测`Released | Terminal`。observation、optional owner transition、cleanup /
reference stale marker、audit、relay draft和stored receipt在同一UoW CAS提交。

已提交preservation或containment truth不因investigation transport失败回滚。commit unknown恢复按redline ref + exact
preservation snapshot检查aggregate与stored receipt；若observation已存在则不得重放。cleanup guard只能读取owner已提交的
`InvestigationHandoffSummary`，不允许consumer直接修改cleanup status。

## 36. L1 Sandbox Truth Relay Feedback Consumer

### 36.1 `ConsumeSandboxTruthRelayFeedbackInput`

```rust
/// exact active relay attempt 的trusted asynchronous feedback input。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct ConsumeSandboxTruthRelayFeedbackInput {
    /// validated inbound envelope 的 non-empty event identity。
    source_event_ref: ResourceRef,
    /// feedback 唯一适用的 Sandbox-owned relay record selector。
    relay_record_ref: SandboxEventRelayRecordRef,
    /// feedback必须匹配的current active attempt selector。
    attempt_ref: SandboxRelayAttemptRef,
    /// worker只能构造的application-local finite feedback candidate；不是relay status。
    feedback_candidate: SandboxRelayFeedbackCandidate,
    /// envelope已校验的feedback observation time。
    observed_at: Timestamp,
}

impl ConsumeSandboxTruthRelayFeedbackInput {
    /// 校验trusted-feedback source及relay / attempt / observation identity一致性。
    pub fn try_new(
        source_event_ref: ResourceRef,
        relay_record_ref: SandboxEventRelayRecordRef,
        attempt_ref: SandboxRelayAttemptRef,
        feedback_candidate: SandboxRelayFeedbackCandidate,
        observed_at: Timestamp,
    ) -> ApplicationResult<Self>;
    /// 返回 validated inbound envelope 的 non-empty source event identity。
    pub fn source_event_ref(&self) -> &ResourceRef;
    /// 返回 exact Sandbox relay record selector。
    pub fn relay_record_ref(&self) -> &SandboxEventRelayRecordRef;
    /// 返回 current active relay attempt selector。
    pub fn attempt_ref(&self) -> &SandboxRelayAttemptRef;
    /// 返回application-local finite feedback candidate。
    pub fn feedback_candidate(&self) -> &SandboxRelayFeedbackCandidate;
    /// 返回feedback observation time。
    pub fn observed_at(&self) -> &Timestamp;
}
```

application加载exact persisted attempt后，按candidate variant穷尽构造domain outcome：`Published`使用candidate
receipt ref与attempt的exact payload identity调用`SandboxRelayReceiptSummary::try_from_publisher`；`Retryable`先将local
failure kind穷尽映射为`SandboxRelayRetryableFailureKind`并调用`SandboxRelayFailureSummary::try_from_publisher`；
`DeadLetter`先将local terminal kind穷尽映射为`SandboxRelayPublisherDeadLetterKind`并调用
`SandboxRelayDeadLetterSummary::from_publisher_terminal`。随后以固定
`SandboxRelayObservationSourceKind::TrustedFeedback`调用
`SandboxRelayDeliveryObservation::try_from_typed_outcome`。record、attempt、ordinal、started time、payload identity和
target binding全部从loaded attempt复制；entry不得从topic、ack string或HTTP status拼装。input不含relay status、
retry bool、dead-letter bool、source truth status、projection freshness或subscriber业务结果。

### 36.2 Active-attempt CAS 与 no truth rollback

application加载paired relay record / immutable payload snapshot与`Version`，要求`active_attempt_ref == input.attempt_ref`
且whole attempt relation匹配，构造canonical observation后只调用`SandboxEventRelayRecord::apply_delivery_observation`。owner返回
`Applied | DuplicateAlreadyApplied`；最终`Published | Retryable | DeadLetter`只由finite observation派生。

| observation outcome | owner result | prohibited action |
|---|---|---|
| `Published` | exact active attempt关闭，record进入`Published`并保存matching receipt | 不回写或重判original source truth。 |
| `Retryable` | active attempt关闭，record进入`Retryable`并保存typed failure与not-before age | consumer不立即重发；job重新evaluate eligibility。 |
| `DeadLetter(PublisherTerminal)` | active attempt关闭，record进入terminal`DeadLetter` | 不把unknown transport error伪装为terminal。 |
| exact same committed observation | `DuplicateAlreadyApplied`，形成`NoOp` stored receipt | 不追加attempt、audit truth change或第二receipt。 |

relay record、audit、reconciliation / projection stale marker和stored consumer receipt在同一UoW CAS提交。relay feedback失败、
retry、dead-letter或commit unknown均不回滚original source fact、source truth cursor或已提交outbound payload snapshot。
commit unknown先按exact attempt检查record：已应用则恢复stored receipt，仍active则保留同一attempt继续inspect / wait；不得
盲目开始new attempt。wrong active attempt、payload/target mismatch或corrupt pair进入typed quarantine / integrity path，
不能降格为`Delayed`。

## 37. 9 Consumer Transaction、Receipt 与 DTO Source Matrix

### 37.1 Exact authority / write owner matrix

| consumer | trusted source allow-set | exact selector / loaded owner | only allowed canonical mutation |
|---|---|---|---|
| caller context reference changed | `Identity | Work | Tool | Runtime | MemberHost | Runner` | context + reference state | matching state `mark_stale`。 |
| policy summary changed | `Policy` | context + policy snapshot + reference state | matching state `mark_stale`；immutable snapshot不原改。 |
| backend capability summary changed | `IsolationBackend` | context + requirement + capability + reference state | matching state `mark_stale`；boundary truth不反写。 |
| isolation backend lifecycle signal | `IsolationBackend` | handle + boundary + optional lease/orphan + cleanup group | owner methods收束release / orphan / safety truth。 |
| material handoff status changed | fixed plan material target authority | whole handoff + selected captured materials | `apply_target_observation` + material-specific lifecycle sync。 |
| observability handoff status changed | `Observability` fixed target authority | whole handoff + exact observability material | `apply_target_observation` + observability lifecycle sync。 |
| Sandbox control requested | authenticated external control authority | target owner group + same-scope controls + strict guard | shared kernel创建one append-once`ControlFact`。 |
| investigation handoff status changed | `Investigation` | whole redline + current preservation + strict guard | record observation；仅guard decision允许安全终态。 |
| Sandbox truth relay feedback | authenticated relay feedback authority | paired relay record/payload + active attempt | `apply_delivery_observation`。 |

### 37.2 UoW、stored replay 与 post-commit rule

所有fresh mutation UoW至少原子包含：idempotency state、exact owner mutation、truth/reference cursor（适用时）、canonical
audit、required relay draft / stale marker和完整`ConsumerReceipt` stored public surface。各repository通过`Version` CAS；
caller input与protocol不携带expected version。reservation成功但业务reject / quarantine仍保存可重复的完整receipt；
validation在reservation前失败时不伪造stored result。

| condition | required result | write / retry rule |
|---|---|---|
| same idempotency identity + same digest | `Duplicate + DuplicateReplayed` | 只读stored receipt；owner/index/external call/write均0。 |
| same business observation，different idempotency identity，owner证明已等价应用 | `NoOp + NoChange` | 可写本次完整receipt；不得重做owner transition。 |
| trusted source暂不可用且未改变truth | `Delayed + NoChange | Degraded` | 保存完整receipt或按既定reservation policy安全释放；不得伪造安全终态。 |
| authority / relation / generation / active-attempt mismatch | `Rejected | Quarantined` | 无owner mutation；保存typed safe result，raw body不持久化。 |
| owner invariant / persisted pair损坏 | `Failed` typed integrity | fail closed；不得fallback到scan/latest/string dispatch。 |
| commit outcome unknown | application `CommitUnknown` error | 不返回fresh receipt；先inspect reservation、stored result与exact owner group。 |

post-commit diagnostic、普通projection marker或maintenance enqueue失败按L2记录，不回滚L1 truth；但required relay / audit若被
定义在同一atomic write set内则必须共同提交，不能降格为best effort。consumer不自行调用第二个external system，所有后续
effect / retry / refresh都由persisted marker、formal fact或attempt identity驱动。

### 37.3 Step 8 DTO source requirement

Step 8为9类consumer各定义独立payload并逐字段构造本节input。envelope统一拥有schema version、dedup metadata和
trace；mapper把唯一`source_event_ref`投影到application input用于correlation，但不复制schema / key / digest / trace。
`observed_at`是source owner给出的业务观察时间，只存在于需要canonical observation的typed payload / candidate；它不是
transport arrival time，也不得由worker当前时钟覆盖。

| input field family | only legal DTO / mapper source | forbidden source |
|---|---|---|
| exact Sandbox selector | typed payload field经kind validation | topic、route、opaque string或“latest”lookup。 |
| `ReferenceRefreshMarker` | source payload中的expected/new body-free source observations | current projection、resolver reread或caller bool。 |
| lifecycle candidate | typed payload中的backend source / summary / generation / local finite kind / reason / observed time；application加载handle后构造canonical observation | caller final handle/lease/cleanup status、raw backend body、domain observation kind。 |
| handoff candidate | typed payload中的exact selector、local delivery candidate和observed time；application加载target / attempt后构造Step 6 canonical observation | worker repository read、domain outcome、aggregate status、generic status text。 |
| investigation candidate | typed payload中的target / receipt summary / local disposition / reason / observed time；application加载preservation snapshot后构造domain summary / observation | worker上传`InvestigationHandoffSummary`、preservation snapshot、cleanup status。 |
| relay candidate | typed payload中的exact relay / attempt selector、local finite feedback candidate和observed time；application从loaded attempt复制payload / target relation并构造domain outcome | worker上传payload identity、domain outcome、HTTP/SDK status、retry bool。 |
| control source candidate | Command允许`External | System` local origin；Consumer只允许`External`；application使用envelope trace构造domain source context | worker / protocol提交domain `ControlSourceContext`、system source伪装、第二trace。 |
| guard ref | payload中的typed active immutable guard selector，随后由application加载校验 | guard body、decision、allow bool。 |

worker必须从validated envelope保留source event ref、consumer kind和trace，再把
`SandboxConsumerServiceResult::{receipt_status,outcome}`逐字段传给
`SandboxConsumerReceipt::from_application_outcome`。worker不得重新读current truth、裁剪stored surface或从application
error合成成功receipt。

## 38. `7R-01C` Join、Blocker 与 Completion Gate

### 38.1 Callable / input / output join

| metric | expected | current |
|---|---:|---:|
| Consumer logical kind | 9 | 9 |
| independent service method | 9 | 9 |
| exact application input | 9 | 9 |
| input constructor / accessor set | 9 | 9 |
| DTO source requirement | 9 | 9 |
| application-local result | 1 | 1 |
| worker receipt ownership | 1 worker-owned | 1；application reverse dependency 0 |
| generic/string/topic dispatch | 0 | 0 |
| undefined `*Input` | 0 | 0 |

42-entry callable累计进度为Command 10 + Query 13 + Consumer 9 = `32/42`。剩余10个Job由`7R-01D`闭合；
在此之前`SBX-DDD-GRANULARITY-STEP7-INPUT-001`与`...-DISPATCH-001`保持open但已有32/42 evidence。

### 38.2 Internal blocker disposition

| blocker | `7R-01C` evidence | status after this batch |
|---|---|---|
| `...-INPUT-001` | 9/9 Consumer input有private fields、checked constructor、getter、source和DTO mapping | partial 32/42；等`7R-01D`。 |
| `...-DISPATCH-001` | 9/9独立method；generic/topic dispatch为0 | partial 32/42；等`7R-01D`和`7R-06`。 |
| `...-REF-001` | 全部selector使用Step 6 named refs；repository version不进input | 保持open；owner在`7R-02`。 |
| `...-OUTCOME-001` | 四类canonical observation只由owner method接受，不直写status | partial；owner在`7R-03/05`。 |
| `...-READ-001` | duplicate exact stored replay和whole aggregate read要求已固定 | 保持open；owner在`7R-04`。 |
| `...-ENTRY-001` | worker构造receipt与Step 8 DTO source已固定 | partial；owner在`7R-06`。 |

未发现需要回开L1/L2上游正式设计的blocker。Step 6 current carrier足以承接9类Consumer；HLD event envelope字段只作为
Step 8 downstream requirement，不反向复制到application input。

### 38.3 Formal writeback draft

正式`03` Step 19重装配时，本批只回填以下current结论：

1. `SandboxConsumerService`拥有9个独立async method与9个exact input，不允许generic/topic dispatch。
2. application返回local status/outcome组合；worker唯一拥有public consumer receipt并执行parity factory。
3. L2 reference consumers只提交stale fence；L1 lifecycle/handoff/control/investigation/relay consumers必须使用exact
   correlation、owner method、CAS/UoW和commit-unknown恢复。
4. external ack / feedback不迁移下游truth ownership，不回滚已提交Sandbox source truth。
5. 普通diagnostic、projection和maintenance异常只保留L2接缝；会伪造release/delivery/publication/safety终态的分支按L1。

本草稿不是正式`03`回填授权；完整Step 7回归和后续Step 8~19重验完成前不得修改正式章节。

### 38.4 Static design audit record

| check | expected result |
|---|---|
| method / input parity | 9 / 9；missing 0，duplicate 0。 |
| input field visibility | private；public struct literal 0。 |
| Rustdoc | 9 struct、字段、constructor与public accessor均有中文语义注释。 |
| canonical observation | lifecycle、handoff、investigation、relay四类均由application在load owner后调用Step 6 factory；worker直接构造domain observation为0。 |
| local/domain enum join | lifecycle 4/4；handoff 3/3；investigation inbound 4/5且`NotRequired`为guard-only；relay feedback 3/3、retryable kind 5/5、publisher terminal kind 5/5；control 2/2且Consumer只开放External。 |
| candidate API | struct constructor/accessor 14/14；closed enum variant/validate/exhaustive-read 3/3；unresolved 0。 |
| status ownership | caller-selected Sandbox final status 0；direct adapter-to-status write 0。 |
| receipt ownership | application -> worker reverse dependency 0；stored replay完整。 |
| safety branches | release、handoff、control、investigation、relay commit-unknown/no-rollback已闭合。 |
| secondary concerns | 普通audit/diagnostic/projection只保留L2接缝，未扩成主体功能。 |
| scope redline | tools semantics、runtime agent loop、member lifecycle、artifact/observability truth未进入Sandbox。 |
| formal / implementation write | 正式`03~07`、implementation、test/evidence/run/acceptance事实修改0。 |

```text
current_document = 03-详细设计.md
current_step = Step 7 regression / 7R-01D
completed_batch = 7R-01C Consumer callable
next_batch = 7R-01D Job callable
consumer_methods = 9/9
consumer_inputs = 9/9
consumer_dto_source_maps = 9/9
consumer_undefined_inputs = 0
application_entry_callable_progress = 32/42
step_7_internal_blockers = 6/6 open with partial callable evidence
formal_03_07 = historical_reviewed_revalidation_pending
implementation = CB-SBX-01A blocked / wait_design
real_test_execution = not_started
real_evidence_created = no
commit_required = no
```

`7R-01C`内容完成并通过静态设计审计后，按连续产物规则进入`7R-01D` 10个Job callable；完整
`7R-01A~D`完成前不触发外部停审，完整`7R-01`后停在`S7-G01`等待用户审查，不进入`7R-02`。

# `7R-01D` Operations Job Callable、Selection 与 Stored Report 契约

## 39. 本批恢复点、输入与粒度

### 39.1 当前状态

| field | value |
|---|---|
| current document / Step | `03-详细设计.md / Step 7` |
| current batch | `7R-01D Operations Job callable` |
| upstream | `7R-01A~C`已完成32/42 callable；Step 6 `S7H-04/S7H-14`、application §9.2~§9.6 / §11.13~§11.19、reconciliation §16.10 current |
| output | 10个独立method、10个exact input、invocation permit、fresh/duplicate closed result、完整batch与shared report finalizer |
| excluded | Step 8 public Job DTO/report schema、repository/port trait、adapter实现、scheduler/cadence、process exit code和完整Step 9 flow |
| implementation | `CB-SBX-01A blocked / wait_design`；没有实现代码、job run、测试、evidence或验收事实 |

本批已重新读取Step 7 SOP与书写规范、真相源闭环标准、Step 4/5 application/jobs owner、Step 6五份
canonical对象分件、`S7H-04/S7H-14`和historical Step 7~9 Job材料。historical
`SandboxJobService::run_job(SandboxJobServiceInput)`只作为缺口证据；本节是10个Job callable和application-local
input/output的唯一current owner。

### 39.2 L1 / L2 / L3 裁决

| job group | level | 本批必须闭合 | 本批停止点 |
|---|---|---|---|
| relay publish、handoff retry | L1 on no-rollback/attempt unknown；其余L2 | exact persisted attempt/target、Version/CAS、finite outcome、source/capture truth不回滚 | publisher/handoff adapter签名到`7R-03C`；逐分支flow到Step 9 |
| lease/orphan reaper、cleanup guard、redline handoff | L1 | exact lineage/guard、evidence preservation、unknown保守处置、same-UoW/CAS、禁止提前release/解除containment | cadence、backoff、operator route留正式`04`/Step 9/12 |
| reference/capability refresh、projection rebuild、derived maintenance | L2；若影响boundary安全则升级L1 | exact selection、typed source、whole-group write、stale/degraded safe default、不得改核心truth | 不展开resolver/builder全部异常或运维报告存储 |
| reconciliation | L2 report面；其atomic relation/duplicate/commit unknown按L1 | 复用Step 6 exact scope/proof/digest、same-snapshot source、report/audit/relay/stored整组和no-repair | 不复制§16.10对象schema、finding矩阵或retention细节 |
| report、diagnostic、review/test/delivery | L2/L3 | 完整body-free report surface、最小hook/Gate和禁止伪造 | 不设计审计平台、逐case测试、evidence编排或交付签署 |

任何可能把仍存活环境、未释放handle、未保存evidence、未完成handoff、未发布relay或未确认commit错误表达为成功的
unknown都会自动提升为L1。普通selection empty、not-ready、stale、provider unavailable和非安全projection/diagnostic失败
保持L2，不扩写成第二套主体设计。

### 39.3 Historical material 与冲突裁决

| historical material | current disposition |
|---|---|
| 单一`run_job(ctx, SandboxJobServiceInput)` | invalid；10个`SandboxJobKind`各有独立method和独立input，禁止generic payload或string dispatch。 |
| jobs runner扫描repository或从config扩展scope | forbidden；application selector读取一页exact scope，runner只消费返回的batch/continuation。 |
| report只保存counts、success/failed refs或最后cursor | invalid；必须逐batch、逐item保留target/result/reason/trace与input/next token链。 |
| 每页重新reserve同一job idempotency identity | invalid；一次invocation只reserve一次，后续页复用不可复制的fresh permit。 |
| duplicate构造空fresh batch再走finalizer | forbidden；duplicate在selection前直接返回完整stored report outcome，replay-only accumulator只由jobs exit factory构造。 |
| `job_run_id`或page token作为幂等key | forbidden；它们分别是invocation identity与input digest内容，不替代operation + digest + idempotency key。 |
| reconciliation经generic batch finalizer保存counts-only report | invalid；复用Step 6 typed stored envelope与atomic materialization，不能二次保存或从current report重组。 |
| job自动修复core truth | forbidden；维护只推进其正式owner允许的relay/reference/handoff/safety/projection/derived/report状态。 |

## 40. 共同 Job Application Contract

### 40.1 Planned owner 与依赖方向

| contract | unique planned owner | visibility / persistence |
|---|---|---|
| `SandboxJobService` | `crates/application/src/services.rs` | public application trait；jobs entry只依赖trait。 |
| 10个`*JobInput` | `relay_service.rs`、`consumer_service.rs`、`cleanup_service.rs`、`redline_service.rs`、`derived_service.rs` | checked transient carrier；不等于Step 8 DTO，不持久化。 |
| `SandboxJobInvocationPermit` | `crates/application/src/idempotency.rs` | application-local move-only invocation ownership；不序列化、不持久化为第二状态。 |
| `SandboxPagedJobInvocationResult<S>` | `crates/application/src/services.rs` | application-local generic closed result；只服务9个typed paged Job。 |
| `SandboxReconciliationMaterializationWriteOutcome` | Step 6 reconciliation canonical owner | 第10个Job原样返回专用atomic writer结果；不包装成第二outcome。 |
| `FinalizeSandboxJobReportInput` | `crates/application/src/services.rs` | move-only finalizer input；消费exhausted permit与完整batch parts，不进入protocol。 |
| `SandboxMaintenance*` carriers | Step 6 application owner | 本批只组合；不复制target/item/batch schema。 |
| `SandboxJobRunContext` / accumulator / exit disposition | Step 6 jobs owner | jobs-local entry carrier；不得进入application trait参数形成反向依赖。 |
| public Job input/report | Step 8 `contracts` owner | 本批只定义逐字段source requirement，不定义wire schema。 |

`application`不得依赖`jobs`，因此facade不能接收`SandboxJobRunContext`或`SandboxJobReportAccumulator`。jobs entry从
run context取得`call_context()`、`job_run_id()`和expected page token，构造本节input；application只返回自己的
typed carrier。report accumulator仍由jobs逐batch原样记录，finalizer输入则由jobs把完整不可变parts move回application，
不能暴露jobs类型本身。

### 40.2 Exact selection carriers 与 paged Job input

九个分页 Job 的 selection 是一次 invocation 的 immutable identity plan。它只保存 context anchor、正式 owner
identity 和必要的 source relation；不保存 target status、attempt、Version、cursor、guard decision、adapter outcome、
reason、body 或“继续扫描”的含义。selection 的顺序由 entry / formal selection reader 提供，constructor 拒绝重复但不
自动排序或去重。空 selection 是显式的 `known-empty`，只允许该 Job 返回 exhausted empty batch；它绝不表示 `all`、
`eligible`、`latest` 或 repository scan。

selection reader 必须先以同一 committed source snapshot确认 context、lineage、owner relation 和可见性，再把一页
exact identities交给 item callable。selection carrier 自身不读 repository，不调用 backend，不生成 page token，也不
把当前状态复制进 input。每个 public input 都以私有字段包装
`SandboxJobPageInvocation<ExactSelection>`，并以 checked constructor 和 move/accessor API 闭合；不得用一个
`SandboxJobServiceInput`、string selector 或 `Vec<SandboxOpaqueRef>` 替代以下九类输入。

#### 40.2.1 Selection carrier definitions

```rust
/// 发布 relay record 的 explicit selection；publisher attempt 由 application 从 record owner 读取。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct PublishSandboxEventRelaySelection {
    context_ref: ControlledExecutionContextRef,
    relay_record_refs: Vec<SandboxEventRelayRecordRef>,
}

impl PublishSandboxEventRelaySelection {
    pub fn try_new(
        context_ref: ControlledExecutionContextRef,
        relay_record_refs: Vec<SandboxEventRelayRecordRef>,
    ) -> ApplicationResult<Self>;
    pub fn context_ref(&self) -> &ControlledExecutionContextRef;
    pub fn relay_record_refs(&self) -> &[SandboxEventRelayRecordRef];
    pub fn is_explicit_empty(&self) -> bool;
}

/// 长期 external reference refresh 的 explicit state selection。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct RefreshSandboxReferenceStatesSelection {
    context_ref: ControlledExecutionContextRef,
    reference_state_refs: Vec<ReferenceResolutionStateRef>,
}

impl RefreshSandboxReferenceStatesSelection {
    pub fn try_new(
        context_ref: ControlledExecutionContextRef,
        reference_state_refs: Vec<ReferenceResolutionStateRef>,
    ) -> ApplicationResult<Self>;
    pub fn context_ref(&self) -> &ControlledExecutionContextRef;
    pub fn reference_state_refs(&self) -> &[ReferenceResolutionStateRef];
    pub fn is_explicit_empty(&self) -> bool;
}

/// capability refresh 的一个 immutable source/requirement/current-summary relation。
/// current_summary_ref 为空表示本次是首次 materialization，不表示 capability 已不存在。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct BackendCapabilityRefreshTarget {
    backend_ref: ExternalSourceRef,
    requirement_ref: BoundaryRequirementSetRef,
    current_summary_ref: Option<BackendCapabilitySummaryRef>,
}

impl BackendCapabilityRefreshTarget {
    pub fn try_new(
        backend_ref: ExternalSourceRef,
        requirement_ref: BoundaryRequirementSetRef,
        current_summary_ref: Option<BackendCapabilitySummaryRef>,
    ) -> ApplicationResult<Self>;
    pub fn backend_ref(&self) -> &ExternalSourceRef;
    pub fn requirement_ref(&self) -> &BoundaryRequirementSetRef;
    pub fn current_summary_ref(&self) -> Option<&BackendCapabilitySummaryRef>;
}

/// backend capability summary refresh 的 explicit ordered target set。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct RefreshBackendCapabilitySummariesSelection {
    context_ref: ControlledExecutionContextRef,
    targets: Vec<BackendCapabilityRefreshTarget>,
}

impl RefreshBackendCapabilitySummariesSelection {
    pub fn try_new(
        context_ref: ControlledExecutionContextRef,
        targets: Vec<BackendCapabilityRefreshTarget>,
    ) -> ApplicationResult<Self>;
    pub fn context_ref(&self) -> &ControlledExecutionContextRef;
    pub fn targets(&self) -> &[BackendCapabilityRefreshTarget];
    pub fn is_explicit_empty(&self) -> bool;
}

/// 一个 handoff aggregate 中待重试的 exact target key；不是独立 Sandbox object ref。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct PendingMaterialHandoffTarget {
    target_kind: HandoffTargetKind,
    target_ref: ExternalSourceRef,
}

impl PendingMaterialHandoffTarget {
    pub fn try_new(
        target_kind: HandoffTargetKind,
        target_ref: ExternalSourceRef,
    ) -> ApplicationResult<Self>;
    pub fn target_kind(&self) -> HandoffTargetKind;
    pub fn target_ref(&self) -> &ExternalSourceRef;
}

/// 一个 handoff aggregate 及其 explicit ordered target-key selection。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct PendingMaterialHandoffGroup {
    handoff_ref: HandoffFactRef,
    targets: Vec<PendingMaterialHandoffTarget>,
}

impl PendingMaterialHandoffGroup {
    pub fn try_new(
        handoff_ref: HandoffFactRef,
        targets: Vec<PendingMaterialHandoffTarget>,
    ) -> ApplicationResult<Self>;
    pub fn handoff_ref(&self) -> &HandoffFactRef;
    pub fn targets(&self) -> &[PendingMaterialHandoffTarget];
}

/// material handoff retry 的 explicit ordered aggregate/target-key groups。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct RetryPendingMaterialHandoffsSelection {
    context_ref: ControlledExecutionContextRef,
    handoff_groups: Vec<PendingMaterialHandoffGroup>,
}

impl RetryPendingMaterialHandoffsSelection {
    pub fn try_new(
        context_ref: ControlledExecutionContextRef,
        handoff_groups: Vec<PendingMaterialHandoffGroup>,
    ) -> ApplicationResult<Self>;
    pub fn context_ref(&self) -> &ControlledExecutionContextRef;
    pub fn handoff_groups(&self) -> &[PendingMaterialHandoffGroup];
    pub fn is_explicit_empty(&self) -> bool;
}

/// lease/orphan reaper 只选择 lease truth；orphan、handle 和 cleanup evidence 由 application load 完整关系。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct RunLeaseOrphanReaperSelection {
    context_ref: ControlledExecutionContextRef,
    lease_refs: Vec<LeaseRecordRef>,
}

impl RunLeaseOrphanReaperSelection {
    pub fn try_new(
        context_ref: ControlledExecutionContextRef,
        lease_refs: Vec<LeaseRecordRef>,
    ) -> ApplicationResult<Self>;
    pub fn context_ref(&self) -> &ControlledExecutionContextRef;
    pub fn lease_refs(&self) -> &[LeaseRecordRef];
    pub fn is_explicit_empty(&self) -> bool;
}

/// cleanup job 只选择既有 cleanup readiness truth，不把 guard existence 当作 release authorization。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct EvaluatePendingCleanupGuardsSelection {
    context_ref: ControlledExecutionContextRef,
    cleanup_guard_refs: Vec<CleanupGuardRef>,
}

impl EvaluatePendingCleanupGuardsSelection {
    pub fn try_new(
        context_ref: ControlledExecutionContextRef,
        cleanup_guard_refs: Vec<CleanupGuardRef>,
    ) -> ApplicationResult<Self>;
    pub fn context_ref(&self) -> &ControlledExecutionContextRef;
    pub fn cleanup_guard_refs(&self) -> &[CleanupGuardRef];
    pub fn is_explicit_empty(&self) -> bool;
}

/// redline maintenance 只选择 containment truth；preservation/investigation/解除 containment 由 owner 决定。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct MaintainRedlineContainmentHandoffsSelection {
    context_ref: ControlledExecutionContextRef,
    redline_refs: Vec<RedlineContainmentRef>,
}

impl MaintainRedlineContainmentHandoffsSelection {
    pub fn try_new(
        context_ref: ControlledExecutionContextRef,
        redline_refs: Vec<RedlineContainmentRef>,
    ) -> ApplicationResult<Self>;
    pub fn context_ref(&self) -> &ControlledExecutionContextRef;
    pub fn redline_refs(&self) -> &[RedlineContainmentRef];
    pub fn is_explicit_empty(&self) -> bool;
}

/// projection rebuild 的 explicit target selection；source snapshot 必须由 formal read port 提供。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct RebuildSandboxReadProjectionsSelection {
    context_ref: ControlledExecutionContextRef,
    projection_refs: Vec<SandboxReadProjectionRef>,
}

impl RebuildSandboxReadProjectionsSelection {
    pub fn try_new(
        context_ref: ControlledExecutionContextRef,
        projection_refs: Vec<SandboxReadProjectionRef>,
    ) -> ApplicationResult<Self>;
    pub fn context_ref(&self) -> &ControlledExecutionContextRef;
    pub fn projection_refs(&self) -> &[SandboxReadProjectionRef];
    pub fn is_explicit_empty(&self) -> bool;
}

/// derived inspect/preview/trend maintenance 的 explicit state selection。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct MaintainDerivedInspectPreviewTrendSelection {
    context_ref: ControlledExecutionContextRef,
    derived_state_refs: Vec<DerivedInspectPreviewTrendStateRef>,
}

impl MaintainDerivedInspectPreviewTrendSelection {
    pub fn try_new(
        context_ref: ControlledExecutionContextRef,
        derived_state_refs: Vec<DerivedInspectPreviewTrendStateRef>,
    ) -> ApplicationResult<Self>;
    pub fn context_ref(&self) -> &ControlledExecutionContextRef;
    pub fn derived_state_refs(&self) -> &[DerivedInspectPreviewTrendStateRef];
    pub fn is_explicit_empty(&self) -> bool;
}
```

所有上述 `try_new` 的共同检查顺序固定为：context ref non-empty / named-kind正确 -> source identity non-empty ->
同一 carrier 内 exact identity 去重 -> source-specific closed relation -> validated selection cardinality ceiling。
constructor 不排序、不读取 owner、不比较 status/version、不自动补 target。`BackendCapabilityRefreshTarget` 还必须
拒绝非 `ExternalSourceKind::IsolationBackend` 的 backend ref；`PendingMaterialHandoffTarget` 必须拒绝
`HandoffTargetKind::EventRelay | Other`；group 必须含至少一个 ordered-unique target key，selection 则拒绝重复
`HandoffFactRef`。application 再验证 target kind 与 external source kind、handoff plan、progress 和 material selection 的
完整关系。一个 handoff group 对应一个 `SandboxMaintenanceTargetRef::Truth(HandoffFact)` item，组内 target keys 进入
完整 report selection scope而不伪装成独立 object ref。selection 中存在 current summary、lease、guard 或 redline ref，
不等于其状态允许执行。

#### 40.2.2 Nine exact paged input carriers

```rust
/// 每个 input 均为独立 public carrier；字段不可由 protocol / runner 直接写入。
#[derive(Debug)]
pub struct PublishSandboxEventRelayJobInput {
    invocation: SandboxJobPageInvocation<PublishSandboxEventRelaySelection>,
}

#[derive(Debug)]
pub struct RefreshSandboxReferenceStatesJobInput {
    invocation: SandboxJobPageInvocation<RefreshSandboxReferenceStatesSelection>,
}

#[derive(Debug)]
pub struct RefreshBackendCapabilitySummariesJobInput {
    invocation: SandboxJobPageInvocation<RefreshBackendCapabilitySummariesSelection>,
}

#[derive(Debug)]
pub struct RetryPendingMaterialHandoffsJobInput {
    invocation: SandboxJobPageInvocation<RetryPendingMaterialHandoffsSelection>,
}

#[derive(Debug)]
pub struct RunLeaseOrphanReaperJobInput {
    invocation: SandboxJobPageInvocation<RunLeaseOrphanReaperSelection>,
}

#[derive(Debug)]
pub struct EvaluatePendingCleanupGuardsJobInput {
    invocation: SandboxJobPageInvocation<EvaluatePendingCleanupGuardsSelection>,
}

#[derive(Debug)]
pub struct MaintainRedlineContainmentHandoffsJobInput {
    invocation: SandboxJobPageInvocation<MaintainRedlineContainmentHandoffsSelection>,
}

#[derive(Debug)]
pub struct RebuildSandboxReadProjectionsJobInput {
    invocation: SandboxJobPageInvocation<RebuildSandboxReadProjectionsSelection>,
}

#[derive(Debug)]
pub struct MaintainDerivedInspectPreviewTrendJobInput {
    invocation: SandboxJobPageInvocation<MaintainDerivedInspectPreviewTrendSelection>,
}
```

每个 input 必须提供下列同名但独立声明的 API；这里列出完整 signature，禁止用一个 macro 生成可绕过 fixed
operation 的 generic input。`try_new` 对 `Start` 校验 invocation 的 fixed `SandboxJobKind`、non-zero page limit、
起始 token shape 和 selection cardinality；对 `Continue` 校验 permit 的 fixed kind、selection 类型、expected page
request 与 exhaustion relation。`invocation()` 只读借用，`into_invocation(self)` 是唯一 move-out API。

```rust
impl PublishSandboxEventRelayJobInput {
    pub fn try_new(invocation: SandboxJobPageInvocation<PublishSandboxEventRelaySelection>) -> ApplicationResult<Self>;
    pub fn invocation(&self) -> &SandboxJobPageInvocation<PublishSandboxEventRelaySelection>;
    pub fn into_invocation(self) -> SandboxJobPageInvocation<PublishSandboxEventRelaySelection>;
}
impl RefreshSandboxReferenceStatesJobInput {
    pub fn try_new(invocation: SandboxJobPageInvocation<RefreshSandboxReferenceStatesSelection>) -> ApplicationResult<Self>;
    pub fn invocation(&self) -> &SandboxJobPageInvocation<RefreshSandboxReferenceStatesSelection>;
    pub fn into_invocation(self) -> SandboxJobPageInvocation<RefreshSandboxReferenceStatesSelection>;
}
impl RefreshBackendCapabilitySummariesJobInput {
    pub fn try_new(invocation: SandboxJobPageInvocation<RefreshBackendCapabilitySummariesSelection>) -> ApplicationResult<Self>;
    pub fn invocation(&self) -> &SandboxJobPageInvocation<RefreshBackendCapabilitySummariesSelection>;
    pub fn into_invocation(self) -> SandboxJobPageInvocation<RefreshBackendCapabilitySummariesSelection>;
}
impl RetryPendingMaterialHandoffsJobInput {
    pub fn try_new(invocation: SandboxJobPageInvocation<RetryPendingMaterialHandoffsSelection>) -> ApplicationResult<Self>;
    pub fn invocation(&self) -> &SandboxJobPageInvocation<RetryPendingMaterialHandoffsSelection>;
    pub fn into_invocation(self) -> SandboxJobPageInvocation<RetryPendingMaterialHandoffsSelection>;
}
impl RunLeaseOrphanReaperJobInput {
    pub fn try_new(invocation: SandboxJobPageInvocation<RunLeaseOrphanReaperSelection>) -> ApplicationResult<Self>;
    pub fn invocation(&self) -> &SandboxJobPageInvocation<RunLeaseOrphanReaperSelection>;
    pub fn into_invocation(self) -> SandboxJobPageInvocation<RunLeaseOrphanReaperSelection>;
}
impl EvaluatePendingCleanupGuardsJobInput {
    pub fn try_new(invocation: SandboxJobPageInvocation<EvaluatePendingCleanupGuardsSelection>) -> ApplicationResult<Self>;
    pub fn invocation(&self) -> &SandboxJobPageInvocation<EvaluatePendingCleanupGuardsSelection>;
    pub fn into_invocation(self) -> SandboxJobPageInvocation<EvaluatePendingCleanupGuardsSelection>;
}
impl MaintainRedlineContainmentHandoffsJobInput {
    pub fn try_new(invocation: SandboxJobPageInvocation<MaintainRedlineContainmentHandoffsSelection>) -> ApplicationResult<Self>;
    pub fn invocation(&self) -> &SandboxJobPageInvocation<MaintainRedlineContainmentHandoffsSelection>;
    pub fn into_invocation(self) -> SandboxJobPageInvocation<MaintainRedlineContainmentHandoffsSelection>;
}
impl RebuildSandboxReadProjectionsJobInput {
    pub fn try_new(invocation: SandboxJobPageInvocation<RebuildSandboxReadProjectionsSelection>) -> ApplicationResult<Self>;
    pub fn invocation(&self) -> &SandboxJobPageInvocation<RebuildSandboxReadProjectionsSelection>;
    pub fn into_invocation(self) -> SandboxJobPageInvocation<RebuildSandboxReadProjectionsSelection>;
}
impl MaintainDerivedInspectPreviewTrendJobInput {
    pub fn try_new(invocation: SandboxJobPageInvocation<MaintainDerivedInspectPreviewTrendSelection>) -> ApplicationResult<Self>;
    pub fn invocation(&self) -> &SandboxJobPageInvocation<MaintainDerivedInspectPreviewTrendSelection>;
    pub fn into_invocation(self) -> SandboxJobPageInvocation<MaintainDerivedInspectPreviewTrendSelection>;
}
```

`SandboxJobPageInvocation::Continue` 的 permit 已冻结首次 selection，因此后续 input 不能携带第二个 selection；
`ctx` 参数与 permit 的 `call_context()` 必须逐字段相等。首个 `Start` 由 runner 提供 `JobRunId`，但 idempotency
reservation 只由 application 根据 `SandboxServiceCallContext` 的 operation + request digest + idempotency key
执行一次。page token 只能来自上一页的 `SandboxMaintenanceBatchOutcome::next_page_token()`；selection reader 不得
从 target ref、count、clock 或当前 truth 生成 token。

#### 40.2.3 Selection-to-owner and Step 8 source matrix

| exact input | selection identity source | target/status source | minimum mapping rule | level |
|---|---|---|---|---|
| `PublishSandboxEventRelayJobInput` | committed relay index -> `context_ref + SandboxEventRelayRecordRef` | relay record + active `SandboxRelayAttempt` + frozen payload | publisher只消费已冻结attempt；source truth不回滚 | L1 on attempt/commit unknown |
| `RefreshSandboxReferenceStatesJobInput` | committed reference-state index -> `ReferenceResolutionStateRef` | `ReferenceResolutionState` + resolver observation | 每个state只绑定一个 external source；technical resolver error不伪造business status | L2, stale/identity race升L1 |
| `RefreshBackendCapabilitySummariesJobInput` | validated backend/requirement/current-summary relation | `BackendCapabilitySummary` + requirement + backend resolver result | 不以summary存在性代替 capability freshness；boundary安全影响升L1 | L2, safety path L1 |
| `RetryPendingMaterialHandoffsJobInput` | committed handoff progress index -> `HandoffFactRef` group + explicit `(target_kind, ExternalSourceRef)` keys | complete handoff plan/progress/material selection + active attempt | group对应一个report item；per-target attempt独立推进；capture truth和已发送payload不回滚 | L1 |
| `RunLeaseOrphanReaperJobInput` | committed lease index -> `LeaseRecordRef` | lease + handle + orphan/recovery + cleanup evidence | unavailable/unknown不得形成 confirmed release；不直接释放资源 | L1 |
| `EvaluatePendingCleanupGuardsJobInput` | committed cleanup index -> `CleanupGuardRef` | full cleanup evidence, redline coverage, handoff and release basis | guard evaluation不等于release authorization；unknown保持blocked | L1 |
| `MaintainRedlineContainmentHandoffsJobInput` | committed containment index -> `RedlineContainmentRef` | containment + preservation + investigation/handoff relation | 不自动解除containment；任何未知保持strict hold | L1 |
| `RebuildSandboxReadProjectionsJobInput` | committed projection index -> `SandboxReadProjectionRef` | `SandboxReadProjectionSourceSnapshot` + stale markers | whole-group rebuild；query zero-write；旧projection body不可作source | L2, safety view impact升L1 |
| `MaintainDerivedInspectPreviewTrendJobInput` | committed derived-state index -> `DerivedInspectPreviewTrendStateRef` | `DerivedMaterializationSourceSnapshot` + derived owner | 不反写core truth；source incomplete只形成degraded/stale | L2 |

Step 8 DTO 必须逐字段从上述 selection carrier 或 jobs `SandboxJobRunContext` 映射：context anchor、typed refs、target
kind、backend/requirement relation、page request、`JobRunId`、trace、digest 和 key 的 source 必须可追溯到一个
canonical owner。DTO 不得新增 status、decision、attempt outcome、report count、cursor 或 opaque ref 字段；这些由
application / owner / report mapper 形成。不存在 source 的字段不得由 protocol 猜测、补默认值或从字符串派生。

### 40.3 Invocation-level idempotency kernel

```rust
/// 一次fresh operations-job invocation持有的application幂等执行权。
///
/// permit不实现Clone、Serialize或Deserialize；它只是已持久化Reserved record的线性能力，
/// 不新增domain truth或第二套idempotency lifecycle。
#[derive(Debug)]
pub struct SandboxJobInvocationPermit<S> {
    /// permit唯一绑定的closed job selector。
    job_kind: SandboxJobKind,
    /// core-owned invocation identity；不参与duplicate key。
    job_run_id: JobRunId,
    /// 已持久化Reserved record的typed identity。
    idempotency_record_ref: SandboxIdempotencyRecordRef,
    /// 首次reserve时冻结的operation/request/key binding。
    call_context: SandboxServiceCallContext,
    /// jobs trusted clock提供且首次调用后不可替换的job start time。
    started_at: Timestamp,
    /// 首次调用形成且后续页不可替换的exact typed selection。
    selection: S,
    /// 首次调用的bounded page request；供finalizer验证完整batch chain起点。
    initial_page_request: SandboxJobPageRequest,
    /// 下一次application selection reader必须消费的page request；None唯一表示已耗尽。
    next_page_request: Option<SandboxJobPageRequest>,
    /// 已完成page数量的checked计数；只用于调用链校验，不进入public report truth。
    completed_page_count: u32,
}

/// application-local bounded job page request；不等于truth cursor或repository Version。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct SandboxJobPageRequest {
    /// selection reader本页必须消费的token；None只表示selection起点。
    input_page_token: Option<PageToken>,
    /// 经entry与validated config ceiling共同校验的non-zero page limit。
    page_limit: NonZeroU32,
}

/// 一个paged Job exact input的首次调用或线性续页闭集。
#[derive(Debug)]
pub enum SandboxJobPageInvocation<S> {
    /// 首次调用；application必须先完成唯一idempotency reservation。
    Start {
        /// core-owned invocation identity；不参与duplicate key。
        job_run_id: JobRunId,
        /// jobs run context从trusted clock冻结的job start time。
        started_at: Timestamp,
        /// 本次完整job input固定的typed selection。
        selection: S,
        /// Step 8 job input给出的首批bounded page request。
        page_request: SandboxJobPageRequest,
    },
    /// 后续页；permit已绑定原selection、context和expected page request。
    Continue(SandboxJobInvocationPermit<S>),
}

impl SandboxJobPageRequest {
    /// 校验present token non-empty和page limit ceiling后构造request。
    pub fn try_new(
        input_page_token: Option<PageToken>,
        page_limit: NonZeroU32,
    ) -> ApplicationResult<Self>;
    /// 返回selection reader必须消费的token。
    pub fn input_page_token(&self) -> Option<&PageToken>;
    /// 返回本页non-zero limit。
    pub fn page_limit(&self) -> NonZeroU32;
}

impl<S> SandboxJobInvocationPermit<S> {
    /// 返回permit固定的job kind。
    pub fn job_kind(&self) -> SandboxJobKind;
    /// 返回本次job invocation identity。
    pub fn job_run_id(&self) -> &JobRunId;
    /// 返回Reserved record identity，供finalizer完成同一record。
    pub fn idempotency_record_ref(&self) -> &SandboxIdempotencyRecordRef;
    /// 返回首次reserve时冻结且已校验的call context。
    pub fn call_context(&self) -> &SandboxServiceCallContext;
    /// 返回首次调用冻结的job start time。
    pub fn started_at(&self) -> &Timestamp;
    /// 返回首次调用固定的typed selection；后续页不得替换。
    pub fn selection(&self) -> &S;
    /// 返回首次调用的page request，供完整report chain校验。
    pub fn initial_page_request(&self) -> &SandboxJobPageRequest;
    /// 返回下一页必须使用的request；None表示只能进入finalizer。
    pub fn next_page_request(&self) -> Option<&SandboxJobPageRequest>;
    /// 返回已完成page数量；不得作为report item count。
    pub fn completed_page_count(&self) -> u32;
    /// 判断selection是否已明确耗尽。
    pub fn is_exhausted(&self) -> bool;
}
```

每个10-method runner在第一页前调用其固定method；service先校验`Job` channel、fixed operation、system actor、digest/key和
`job_run_id`，再原子reserve。`Duplicate`必须读取并验证kind=`JobReport`且`validate_for_job(fixed_kind)`通过的完整stored
surface，构造`SandboxServiceOutcome::duplicate_replayed`并立即返回。`InFlight/Conflict/FailedTerminal`返回typed
application error，不允许selection或“帮忙继续”另一个invocation。

fresh permit在线性调用链中随每个page input move入，再随`FreshBatch` move回；这样第二页不重新reserve，也不能并发复制同一
invocation ownership。泛型`S`是该fixed method的exact immutable selection，scope无法在续页时替换。permit的
`call_context`必须与后续method参数完全相等，`started_at`与initial request不得重传；每次page完成后 application仅从
`SandboxMaintenanceBatchOutcome::next_page_token()`和原page limit形成下一request，terminal token使
`next_page_request=None`。process crash后不能凭`job_run_id`重建permit；恢复必须先检查Reserved relation和任何已冻结
external attempt，再按Step 9/13的typed recovery route处理，不得盲重跑。

### 40.4 Exact facade

```rust
/// Sandbox的10个one-shot operations-job use case；每个method固定一个closed selector。
pub trait SandboxJobService: Send + Sync {
    /// 发布一页eligible event relay records，source truth永不因发布失败回滚。
    async fn publish_sandbox_event_relay(
        &self,
        ctx: SandboxServiceCallContext,
        input: PublishSandboxEventRelayJobInput,
    ) -> ApplicationResult<
        SandboxPagedJobInvocationResult<PublishSandboxEventRelaySelection>,
    >;

    /// 刷新一页explicit tracked external reference states。
    async fn refresh_sandbox_reference_states(
        &self,
        ctx: SandboxServiceCallContext,
        input: RefreshSandboxReferenceStatesJobInput,
    ) -> ApplicationResult<
        SandboxPagedJobInvocationResult<RefreshSandboxReferenceStatesSelection>,
    >;

    /// 刷新一页explicit backend capability summary targets。
    async fn refresh_backend_capability_summaries(
        &self,
        ctx: SandboxServiceCallContext,
        input: RefreshBackendCapabilitySummariesJobInput,
    ) -> ApplicationResult<
        SandboxPagedJobInvocationResult<RefreshBackendCapabilitySummariesSelection>,
    >;

    /// 重试一页pending/retryable material handoff targets，不回滚capture truth。
    async fn retry_pending_material_handoffs(
        &self,
        ctx: SandboxServiceCallContext,
        input: RetryPendingMaterialHandoffsJobInput,
    ) -> ApplicationResult<
        SandboxPagedJobInvocationResult<RetryPendingMaterialHandoffsSelection>,
    >;

    /// 对一页lease/orphan targets执行guarded conservative reaper evaluation。
    async fn run_lease_orphan_reaper(
        &self,
        ctx: SandboxServiceCallContext,
        input: RunLeaseOrphanReaperJobInput,
    ) -> ApplicationResult<
        SandboxPagedJobInvocationResult<RunLeaseOrphanReaperSelection>,
    >;

    /// 重评一页pending cleanup guards，不直接绕过evidence owner执行release。
    async fn evaluate_pending_cleanup_guards(
        &self,
        ctx: SandboxServiceCallContext,
        input: EvaluatePendingCleanupGuardsJobInput,
    ) -> ApplicationResult<
        SandboxPagedJobInvocationResult<EvaluatePendingCleanupGuardsSelection>,
    >;

    /// 维护一页redline preservation/investigation handoff，不自动解除containment。
    async fn maintain_redline_containment_handoffs(
        &self,
        ctx: SandboxServiceCallContext,
        input: MaintainRedlineContainmentHandoffsJobInput,
    ) -> ApplicationResult<
        SandboxPagedJobInvocationResult<MaintainRedlineContainmentHandoffsSelection>,
    >;

    /// 从一页explicit committed source rebuild plan重建read projections。
    async fn rebuild_sandbox_read_projections(
        &self,
        ctx: SandboxServiceCallContext,
        input: RebuildSandboxReadProjectionsJobInput,
    ) -> ApplicationResult<
        SandboxPagedJobInvocationResult<RebuildSandboxReadProjectionsSelection>,
    >;

    /// 维护一页inspect/preview/trend derived states，不反写core truth。
    async fn maintain_derived_inspect_preview_trend(
        &self,
        ctx: SandboxServiceCallContext,
        input: MaintainDerivedInspectPreviewTrendJobInput,
    ) -> ApplicationResult<
        SandboxPagedJobInvocationResult<MaintainDerivedInspectPreviewTrendSelection>,
    >;

    /// 运行一个exact reconciliation scope并原子物化完整stored report group。
    async fn run_sandbox_reconciliation(
        &self,
        input: RunSandboxReconciliationJobInput,
    ) -> ApplicationResult<SandboxReconciliationMaterializationWriteOutcome>;

    /// 在所有fresh batches耗尽后保存完整public report surface并完成原reservation。
    async fn finalize_job_report(
        &self,
        input: FinalizeSandboxJobReportInput,
    ) -> ApplicationResult<SandboxServiceOutcome>;
}
```

10个logical entry method计入42-entry join；`finalize_job_report`是所有fresh entry共享的application helper，不是第43个
`SandboxJobKind`，不得被route、binary或protocol直接分派。不存在`run_job`、`run_maintenance`、`execute(kind, payload)`、
string operation或trait-object payload downcast。

### 40.5 Paged result 与 reconciliation-specific result

```rust
/// 九个paged Job在application边界返回的互斥结果；selection type保持到下一页或finalizer。
#[derive(Debug)]
pub enum SandboxPagedJobInvocationResult<S> {
    /// fresh invocation完成一页selection与item处理，并返还同类型线性permit。
    FreshBatch {
        /// 必须由下一页或finalizer继续消费的唯一invocation ownership。
        permit: SandboxJobInvocationPermit<S>,
        /// application返回的完整、有序batch与continuation。
        batch: SandboxMaintenanceBatchOutcome,
    },
    /// completed duplicate的完整stored report outcome；不得附带空batch或fresh permit。
    DuplicateReplayed {
        /// `DuplicateReplayed`且stored kind=`JobReport`的完整application outcome。
        outcome: SandboxServiceOutcome,
    },
}

impl<S> SandboxPagedJobInvocationResult<S> {
    /// 校验结果variant、fixed job kind、stored surface、permit和batch relation。
    pub fn validate_for_job(&self, expected: SandboxJobKind) -> ApplicationResult<()>;
    /// 返回duplicate stored outcome；fresh batch返回None。
    pub fn duplicate_outcome(&self) -> Option<&SandboxServiceOutcome>;
}
```

`FreshBatch`只允许前九个paged maintenance method。runner 对 public enum 做穷尽 pattern match，直接 move
`permit`和`batch`，因此不再声明未定义的`SandboxJobInvocationResultParts`或丢字段的tuple adapter。
`validate_for_job`固定检查：expected不是`RunSandboxReconciliation`；permit/batch job kind都等于expected；batch input token
等于本次 permit进入service前的 expected request；batch item shape有效；application根据batch next token形成的新permit
状态与返回batch一致。`DuplicateReplayed`要求 outcome status严格为`DuplicateReplayed`、truth/side-effect/reason集合为空、
stored result存在且`validate_for_job(expected)`通过；它不能与fresh permit或空batch并存。

第十个`RunSandboxReconciliation`直接返回Step 6 canonical
`SandboxReconciliationMaterializationWriteOutcome::{Committed, DuplicateReplayed}`，不新增
`SandboxReconciliationJobInvocationResult`同义类型，也不构造通用`SandboxServiceOutcome`。原因是reconciliation
report属于projection-side immutable report，不属于`SandboxTruthRefSet`；finding非空时还必须同UoW append relay。将其强制
映成`Accepted/NoChange/Degraded/Failed`会违反Step 6 service-outcome shape或错误改变canonical report status。

`Committed`原样携带current binding和完整`SandboxReconciliationStoredJobReport`；`DuplicateReplayed`只携带原stored
envelope并叠加本次调用处置，不返回current binding、不改原run/status/times、不读current report。reconciliation runner
直接以stored envelope的机械status和完整finding/report/audit/relay关系构造Step 8 report与existing entry disposition；它
不创建per-target空batch，不进入`SandboxJobReportAccumulator`或`finalize_job_report`。Step 6 application/entry shared
carrier中“十个Job都经generic exit disposition”的旧泛化口径，以更晚且更具体的reconciliation §16.10为current override，
登记为`historical_material`而非上游blocker。

### 40.6 Shared report finalizer exact input

九类selection permit只在finalization边界汇入closed union。该 union不是generic dispatch input：只有各自 facade返回的
已耗尽permit可进入，protocol/route不能直接构造或分派它；finalizer仍只完成原operation的report/stored/idempotency
relation，不执行任一业务item。

```rust
/// 九个paged Job可交给shared finalizer的move-only permit闭集。
#[derive(Debug)]
pub enum SandboxFinalizableJobPermit {
    PublishSandboxEventRelay(
        SandboxJobInvocationPermit<PublishSandboxEventRelaySelection>,
    ),
    RefreshSandboxReferenceStates(
        SandboxJobInvocationPermit<RefreshSandboxReferenceStatesSelection>,
    ),
    RefreshBackendCapabilitySummaries(
        SandboxJobInvocationPermit<RefreshBackendCapabilitySummariesSelection>,
    ),
    RetryPendingMaterialHandoffs(
        SandboxJobInvocationPermit<RetryPendingMaterialHandoffsSelection>,
    ),
    RunLeaseOrphanReaper(
        SandboxJobInvocationPermit<RunLeaseOrphanReaperSelection>,
    ),
    EvaluatePendingCleanupGuards(
        SandboxJobInvocationPermit<EvaluatePendingCleanupGuardsSelection>,
    ),
    MaintainRedlineContainmentHandoffs(
        SandboxJobInvocationPermit<MaintainRedlineContainmentHandoffsSelection>,
    ),
    RebuildSandboxReadProjections(
        SandboxJobInvocationPermit<RebuildSandboxReadProjectionsSelection>,
    ),
    MaintainDerivedInspectPreviewTrend(
        SandboxJobInvocationPermit<MaintainDerivedInspectPreviewTrendSelection>,
    ),
}

impl SandboxFinalizableJobPermit {
    /// 校验enum variant、permit job kind和operation mapping后构造对应closed branch。
    pub fn try_publish_sandbox_event_relay(
        permit: SandboxJobInvocationPermit<PublishSandboxEventRelaySelection>,
    ) -> ApplicationResult<Self>;
    pub fn try_refresh_sandbox_reference_states(
        permit: SandboxJobInvocationPermit<RefreshSandboxReferenceStatesSelection>,
    ) -> ApplicationResult<Self>;
    pub fn try_refresh_backend_capability_summaries(
        permit: SandboxJobInvocationPermit<RefreshBackendCapabilitySummariesSelection>,
    ) -> ApplicationResult<Self>;
    pub fn try_retry_pending_material_handoffs(
        permit: SandboxJobInvocationPermit<RetryPendingMaterialHandoffsSelection>,
    ) -> ApplicationResult<Self>;
    pub fn try_run_lease_orphan_reaper(
        permit: SandboxJobInvocationPermit<RunLeaseOrphanReaperSelection>,
    ) -> ApplicationResult<Self>;
    pub fn try_evaluate_pending_cleanup_guards(
        permit: SandboxJobInvocationPermit<EvaluatePendingCleanupGuardsSelection>,
    ) -> ApplicationResult<Self>;
    pub fn try_maintain_redline_containment_handoffs(
        permit: SandboxJobInvocationPermit<MaintainRedlineContainmentHandoffsSelection>,
    ) -> ApplicationResult<Self>;
    pub fn try_rebuild_sandbox_read_projections(
        permit: SandboxJobInvocationPermit<RebuildSandboxReadProjectionsSelection>,
    ) -> ApplicationResult<Self>;
    pub fn try_maintain_derived_inspect_preview_trend(
        permit: SandboxJobInvocationPermit<MaintainDerivedInspectPreviewTrendSelection>,
    ) -> ApplicationResult<Self>;

    pub fn job_kind(&self) -> SandboxJobKind;
    pub fn job_run_id(&self) -> &JobRunId;
    pub fn idempotency_record_ref(&self) -> &SandboxIdempotencyRecordRef;
    pub fn call_context(&self) -> &SandboxServiceCallContext;
    pub fn started_at(&self) -> &Timestamp;
    pub fn completed_page_count(&self) -> u32;
    pub fn is_exhausted(&self) -> bool;
}

/// 九个paged Job完整、exhausted batch chain的application finalizer input。
#[derive(Debug)]
pub struct FinalizeSandboxJobReportInput {
    /// 已耗尽且仍持有原idempotency reservation ownership的closed permit。
    permit: SandboxFinalizableJobPermit,
    /// jobs accumulator原样move回的全部application batches；不得flatten或重建。
    batches: Vec<SandboxMaintenanceBatchOutcome>,
    /// constructor从完整items机械派生的original public report status。
    report_status: SandboxJobReportStatus,
}

impl FinalizeSandboxJobReportInput {
    /// 校验exhaustion、selection coverage、完整token chain、item shape和机械status后构造finalizer input。
    pub fn try_new(
        permit: SandboxFinalizableJobPermit,
        batches: Vec<SandboxMaintenanceBatchOutcome>,
    ) -> ApplicationResult<Self>;
    pub fn permit(&self) -> &SandboxFinalizableJobPermit;
    pub fn batches(&self) -> &[SandboxMaintenanceBatchOutcome];
    pub fn report_status(&self) -> SandboxJobReportStatus;
    /// 从完整batch items checked派生，不保存第二个count字段。
    pub fn item_count(&self) -> ApplicationResult<u64>;
    /// 移交完整permit、batch chain和constructor-derived status。
    pub fn into_parts(
        self,
    ) -> (
        SandboxFinalizableJobPermit,
        Vec<SandboxMaintenanceBatchOutcome>,
        SandboxJobReportStatus,
    );
}
```

`SandboxFinalizableJobPermit::try_*`只接受`next_page_request=None`的permit，并重验variant对应fixed job kind、Job
channel、operation、system actor和idempotency relation。`FinalizeSandboxJobReportInput::try_new`按以下顺序闭合：

1. permit已耗尽，且`completed_page_count`能checked转换为`usize`并等于`batches.len()`；至少有一个terminal batch。
2. 第一批input token等于permit initial page request token；每批job kind与permit相等；每批均通过Step 6 batch validator。
3. 每一非末批`next_page_token`非空且等于下一批`input_page_token`；末批`next_page_token=None`；每批item数不超过原page limit。
4. 所有batch target全局ordered-unique；variant-specific mapper确认每个target都在permit selection中，且完整selection
   identity恰好被覆盖一次。explicit empty selection只允许一个terminal empty batch。
5. 遍历全部items机械派生status：any Failed + any non-Failed -> `PartialFailed`；all Failed -> `Failed`；无Failed且
   any Degraded -> `Degraded`；全部Skipped或空 -> `Skipped`；其余含Succeeded -> `Succeeded`。不得接受caller status。
6. `DuplicateReplayed`永远不由fresh batch chain派生，也不能构造finalizer input；reconciliation permit没有union variant。

variant-specific coverage映射固定为：relay -> `EventRelay(ref)`；reference/capability/handoff/lease/cleanup/redline ->
matching `Truth(...)`，其中首次capability materialization可用`External(IsolationBackend)`；projection -> `Projection(ref)`；
derived -> `Derived(ref)`。handoff selection的一组聚合/target keys对应一个`Truth(HandoffFact)` item，finalizer还重验组内
target keys已经由该item的完整result/reason surface承接；不得把external target key伪装成第二maintenance item identity。

### 40.7 Finalizer materialization 与 stored replay

finalizer调用application result-store的Step 8 report builder时，字段来源固定如下；这是协议重验的source requirement，
不是在Step 7提前定义wire DTO。

| report field family | unique source | finalizer rule | forbidden substitute |
|---|---|---|---|
| job kind / operation | finalizable permit variant + canonical mapping | exact equal；不存在caller operation | binary name、string、route |
| original run id | permit `JobRunId` | 原样保存；duplicate不生成new original id | stored surface ref、clock |
| original status | `FinalizeSandboxJobReportInput.report_status` | 只保存五个fresh status | persisted `DuplicateReplayed`、count猜测 |
| selection scope | permit variant的immutable exact selection | 完整保存或由typed report surface可逆引用 | all/latest scope、opaque digest-only |
| start time | permit `started_at` | 原样保存 | finalizer current clock回填 |
| finish/recorded time | application clock在finalization UoW中取得 | `>= started_at`并同时用于surface/stored relation | jobs post-finalizer exit time、item time |
| batches/items | input完整batch chain | 逐batch逐item原样映射target/result/reason/trace和token chain | flat counts、success/failed ref lists、last cursor |
| processed count | checked遍历完整items | 只作机械public field；不持久化第二计数truth | runner counter、repository recount |
| stored identities | result-store typed generator / frozen surface | `JobReport` kind、operation和reservation全等 | report/run/ref文本派生 |
| final outcome | status + stored result exact matrix | 见下表；finalizer不创建业务truth | 从current truth scan重组 |

finalizer唯一 write order 为：validate moved input outside write UoW -> open UoW并锁定原Reserved idempotency record ->
allocate typed report surface/stored identities -> freeze完整report surface -> stage generic
`SandboxStoredOperationResult` -> `SandboxIdempotencyRecord::mark_completed` -> atomic commit -> post-commit low-cardinality
hook。finalizer不执行selection、item、repository latest scan、publisher/backend/handoff call，也不创建、回滚或修复前序item
已经提交的业务truth。

| derived report status | final `SandboxServiceOutcome` | stored status | reason / side-effect rule |
|---|---|---|---|
| `Succeeded` | `NoChange` | `Completed` | empty reasons；finalizer本身没有新业务truth/side effect |
| `PartialFailed` | `Degraded` | `Completed` | 从failed/degraded items稳定聚合non-empty safe reasons；side effects empty |
| `Failed` | `Failed` | `Failed` | 从全部failed items稳定聚合non-empty safe reasons；side effects empty |
| `Skipped` | `NoChange` | `Completed` | reasons可按items原样聚合；explicit empty selection可为空 |
| `Degraded` | `Degraded` | `Completed` | 从degraded items稳定聚合non-empty safe reasons；side effects empty |

`Succeeded`固定返回`NoChange`而非`Accepted`，因为item业务写入已在前序UoW提交，finalizer当前UoW只保存report/stored
surface；把旧truth refs再次放入`Accepted`会谎称它们正在当前UoW stage。item result refs仍完整保存在report，不被final
outcome重复拥有。stored report保存成功和idempotency completion必须同一commit；任一pre-commit失败全部不可见，原record
仍为Reserved或进入typed commit-unknown inspection。commit unknown不得直接重用已消费permit盲调finalizer，必须沿原
operation/digest/key、stored identity和idempotency relation判断fully committed / fully absent / indeterminate；只有完整
committed relation可按duplicate读取，indeterminate保持fail-closed并交Step 12/13 recovery owner。

duplicate在第一页selection/read/external call之前结束：从Completed record的exact stored result ref读取完整JobReport
surface，验证operation/kind/原run/status/times/batches/items/selection relation后返回
`SandboxServiceOutcome::duplicate_replayed`。缺失、wrong-kind、half-commit或损坏返回
`DuplicateMissingResult`/integrity error，不从current truth、item repositories或report counts重建，也不进入finalizer。

## 41. 逐 Job Owner Load、事务与 Safe-default 矩阵

本节只定义每个facade在一页explicit selection上的application执行边界。repository、UoW、resolver和external port的
physical trait签名仍分别由`7R-02~04`拥有；实现不得因此自由选择owner、Version、事务拆分或unknown处置。共同顺序固定为：

1. 先执行§40.3 invocation preflight；`DuplicateReplayed`在任何selection read、owner load、ID分配或external call前返回。
2. selection reader按permit的exact selection和page request读取一页稳定ordered identities；不得扫描all/latest/eligible。
3. 每个item重新读取exact current owner与`Version`，验证context/lineage和selection relation；selection里的status不是授权。
4. external side effect前若canonical owner要求active attempt，先在短UoW以CAS保存attempt、audit/relay marker等完整恢复点并commit。
5. UoW外只调用一次matching typed port；raw provider结果先映射为Step 6 finite body-free observation。
6. 在新UoW重读owner + current `Version`，只把matching observation应用到matching active attempt；提交item truth与必要关联。
7. item outcome只引用本次已确认提交或明确保持的local identities；repository/mapper/internal错误直接返回
   `ApplicationError`，不得伪装成业务`Failed` item。普通finite not-ready/unavailable才按下述矩阵形成`Skipped/Degraded/Failed`。

### 41.1 `PublishSandboxEventRelay`

| concern | exact contract |
|---|---|
| selection / owner load | 对每个`SandboxEventRelayRecordRef`读取record、payload snapshot/persistence pair、active/latest attempt、target binding和retry policy；校验context source lineage、payload integrity、record ref与selection exact相等。读取必须同时返回record `Version`，不能只读status view。 |
| guard / eligibility | `Published | DeadLetter | Failed`安全跳过且返回existing relay result ref；`Pending | Retryable`必须调用`evaluate_attempt_eligibility`。`RetryNotReady`为`Skipped`；`RetryExhausted`在无external call的UoW中调用`dead_letter_retry_exhausted`；已有active attempt禁止新发送，必须走exact attempt inspect。 |
| pre-call UoW | 对`InitialAttemptAllowed | RetryAllowed`预生成`SandboxRelayAttemptRef`，调用`begin_publish_attempt`，以loaded `Version` CAS保存record、attempt relation和audit；commit confirmed后才可把immutable attempt/payload/target binding交publisher。CAS conflict整项重读，不复用旧decision或旧Version。 |
| external / post-call UoW | publisher只接收已提交attempt与冻结payload；返回`SandboxRelayDeliveryObservation`。随后重读record/Version，要求active attempt、ordinal、payload与binding全部匹配，调用`apply_delivery_observation`并原子保存record + audit。`Published` result为同一relay ref；retryable/dead-letter也保留该ref及safe reason。 |
| unknown / duplicate | timeout、process crash或publisher commit unknown不产生新attempt；先用`(relay_record_ref, attempt_ref, payload identity, target binding)` inspect。confirmed published应用receipt，confirmed absent才允许原attempt安全完成为retryable，conflict/unclassifiable调用`record_integrity_failure`并fail closed。item retry不得回滚原source truth、payload snapshot或既有attempt。 |
| item mapping | 本次推进到`Published`或合法完成terminal transition为`Succeeded(EventRelay)`；not-ready/已terminal为`Skipped`；typed retryable/unavailable且record已诚实保存为`Degraded(EventRelay, reason)`；完整性失败已提交为`Failed(EventRelay, reason)`。任何未提交mutation不得出现在result refs。 |
| forbidden | 从topic/route字符串选record、publisher call前不落attempt、timeout后直接新attempt、重编码payload、删除DeadLetter重建record、publisher失败回滚source fact、把post-commit diagnostic失败改成item失败。 |

### 41.2 `RefreshSandboxReferenceStates`

该Job是L2保障维护；只在external source identity或结果可能影响仍可launch的boundary安全判断时升级为L1 fail-closed处理，
不在本节复制resolver所有错误variant。

| concern | exact contract |
|---|---|
| owner load | 对selection中的`ReferenceResolutionStateRef`读取exact state + `Version`，校验context lineage、state ref和单一`ExternalSourceRef`。不存在、wrong-kind、cross-context或binding损坏是application error，不形成`Unresolved`业务状态。 |
| guard / source read | `requires_refresh()==false`返回`Skipped`；需要刷新时从state current binding形成typed resolver input。resolver不得接收safe-summary文本来猜source kind，也不得把technical error直接映射为business disposition。 |
| transaction | resolver调用在UoW外完成；返回Step 6 `ReferenceResolutionObservation`后开启短UoW，重读same state/Version，调用`apply_resolution`并以CAS保存state + 最小audit/derived stale marker。没有external pre-call mutation，也不持久化transient selection。 |
| race / safe default | CAS conflict丢弃旧observation并返回可重试application conflict，不能把旧结果应用到新binding。typed `Stale | Unresolved | Invalid | Unavailable`必须按canonical observation诚实保存并形成`Degraded(Truth(state), safe reason)`；若该reference正参与安全decision，调用方只能fail closed，不得沿用旧resolved summary。 |
| item mapping | fresh `Resolved` commit为`Succeeded(Truth(ReferenceResolutionState))`；无需刷新为`Skipped`；有限非resolved commit为`Degraded`。resolver transport失败且没有canonical observation时为item `Failed`或application error，禁止伪造`Resolved`。 |
| forbidden | all-reference scan、从summary反向解析source/status、last-write-wins、失败时保留可被误认为fresh的旧状态、reference Job直接修改boundary/policy/run truth。 |

### 41.3 `RefreshBackendCapabilitySummaries`

capability summary是immutable assessment；refresh必须形成新candidate并原子替换logical current binding，禁止原地修改历史
summary。首次materialization target以`External(IsolationBackend)`报告，replacement target以selection中的current
`Truth(BackendCapabilitySummary)`报告。

| concern | exact contract |
|---|---|
| exact owner load | 读取backend binding、`BoundaryRequirementSet`和optional current summary/current-binding `Version`；三者必须与`BackendCapabilityRefreshTarget`相等，且backend source kind固定为`IsolationBackend`。current summary缺失只在selection明确为first时合法。 |
| resolver / candidate | UoW外调用typed capability resolver并构造Step 6 `BackendCapabilitySummary::{fresh,stale,unknown,unsupported}` immutable candidate；candidate ref由typed ID port生成，verdict必须完整覆盖十类boundary limit，不能从provider文本或旧summary补项。 |
| write UoW | first用absent expectation；replacement用selection current ref + loaded binding `Version`。同UoW append candidate、CAS current binding、audit和必要reference/projection stale marker；任一失败candidate不可见。CAS loser不保存为可见historical success，必须返回conflict并重新选择新invocation scope。 |
| safety default | `unknown/stale/unsupported`可作为诚实summary提交并返回`Degraded`；任何消费该summary的boundary/launch path必须通过`must_fail_closed_at_age`等owner guard，不得把“refresh成功写入”解释为capability supported。resolver无typed observation时不得沿用旧summary并报告Succeeded。 |
| item mapping | fresh supported candidate与binding commit为`Succeeded(Truth(new summary))`；fresh但non-supporting candidate为`Degraded(Truth(new summary), reason)`；current relation已被exact equivalent candidate覆盖可`Skipped`或`Succeeded`，但必须由writer finite duplicate outcome决定，不能比较digest自行判断。 |
| forbidden | 更新旧summary row、缺维度默认supported、current summary存在性当freshness、CAS conflict后last-write-wins、capability Job直接建立boundary或启动run、把backend SDK body写进candidate/reason。 |

### 41.4 `RetryPendingMaterialHandoffs`

一个`PendingMaterialHandoffGroup`始终产生一个`Truth(HandoffFact)` item；组内每个target key按selection顺序独立执行，
但最终item必须保留整个group的处理结果和safe reasons。任何target成功或失败都不得回滚immutable capture fact、已捕获材料或
其他target已提交的receipt。

| concern | exact contract |
|---|---|
| owner load / group validation | 读取`HandoffFact + Version`、完整target plan/progress、source observability/captured material owners及其Versions、active cleanup block和target binding。验证context/run/generation、selection handoff ref、每个`(target_kind,target_ref)`均存在且kind/source/selection完全匹配；未选target不处理。 |
| eligibility | `Delivered | Failed` target安全跳过；`Pending`可开始首次attempt；`Retryable`必须通过`can_retry_at_age`；`Attempting`禁止新attempt并转exact inspect；aggregate `BlockedByCleanupGuard`不得调用adapter，item至少为`Skipped/Degraded`并保留block reason。 |
| pre-call UoW | 对每个eligible target预生成`HandoffDeliveryAttemptRef`，调用`HandoffFact::begin_target_attempt`；以handoff `Version` CAS保存fact/progress、audit和恢复关联。只有commit confirmed后才把attempt、target和immutable material selection交给matching handoff adapter。不得把多个target attempt先放内存后一次外呼。 |
| external / post-call UoW | adapter返回`HandoffTargetDeliveryObservation`；新UoW重读handoff + source materials及Versions，要求matching active attempt，调用`apply_target_observation`，再从完整progress机械派生aggregate和每份material delivery kind，同UoW保存fact、受影响material/observability lifecycle、audit、relay/projection marker。 |
| target failure / continuation | 一个target的retryable/failed observation按canonical状态提交后继续组内下一个selected target；它不回滚先前target。repository/internal relation error终止本item/application页，不把未知部分伪装成完整group outcome。item status从组内已提交结果机械派生：全eligible完成为`Succeeded`；混合完成与retryable/blocked为`Degraded`；全跳过为`Skipped`；存在terminal failed为`Failed`或按已成功混合诚实`Degraded`，完整明细留report reason surface。 |
| unknown / re-entry | timeout/crash/commit unknown按`(handoff_ref,target_ref,attempt_ref)` inspect：confirmed delivered应用同receipt；confirmed absent才允许把同一attempt导向typed retry；unknown/conflict保持`Attempting`或fail-closed recovery，不创建新attempt。duplicate job只 replay stored report，不重查current progress。 |
| result refs | 一个item至少返回`Truth(HandoffFact)`；只有本次同UoW实际推进的source material truth才可附加到result refs。外部target/receipt不是Sandbox truth ref，不得伪造第二maintenance item或result identity。 |
| forbidden | retry生成新handoff fact、只按aggregate status选target、最后一个receipt覆盖progress、adapter前不保存attempt、一个target失败回滚capture/其他target、将Delivered解释为下游formal truth成立、cleanup blocked时继续发送。 |

### 41.5 `RunLeaseOrphanReaper`

该Job只维护 Sandbox-owned lease expiry / orphan suspicion truth。它不拥有 backend lifecycle，也不执行 cleanup release、
handle release、lease renewal或context closure。`ReaperEligibilityMarker`必须来自 lease owner 的 checked transition；job
不能根据字符串 reason、status view或caller bool自行生成 orphan 结论。

| concern | exact contract |
|---|---|
| owner load | 对每个`LeaseRecordRef`读取lease + `Version`、exact handle、context、environment identity、boundary、generation、optional active run和当前 incident index。已存在的matching `OrphanRecoveryRecord`必须按同一lease/handle/generation加载；不得按latest timestamp挑选。 |
| checked position | 从trusted application clock取得一次checked elapsed；`Active`按`position_at_elapsed`分流：`Renewable`为`Skipped`，`RenewalClosed`由lease owner形成`LeaseExpiring` marker并CAS提交`mark_expiring`，`Expired`形成`LeaseExpired` marker并CAS提交`mark_expired`。`Expiring/Expired/OrphanSuspected`不允许新launch；`Released`和terminal recovery只读。 |
| lifecycle inspection | 只有已到期或已有lifecycle-conflict marker的exact handle才调用inspect port；输入必须带handle、lease、generation、context lineage和operation correlation。inspect不是release。返回必须先映射为`BackendLifecycleSummary`，不把`Released` observation直接写成lease/orphan released/recovered。 |
| post-inspect UoW | 重读lease/handle/orphan及Versions。`Present | Unavailable | Conflicted`且lease为`Expired`时，lease owner可应用`mark_orphan_suspected`；不存在matching orphan则在同一UoW生成唯一`OrphanRecoveryRecordRef`并调用`OrphanRecoveryRecord::suspect`，已有`Suspected`只保留同一incident。`Present | Conflicted`对已有`Suspected`可调用`confirm`；`Unavailable`保持`Suspected`，不能确认。所有lease/orphan/audit/required relay或view marker必须同UoW提交。 |
| released / unknown | inspect明确`Released`时只形成reconciliation/cleanup input，若当前Sandbox truth仍未完成guarded release则item `Degraded`或application integrity result；不得调用`mark_released`或`mark_recovered`。timeout、unavailable、commit unknown不创建新orphan、不推进确认、不重跑release；沿exact `(lease, handle, generation, incident)`进入typed inspection/recovery。 |
| item mapping | expiry marker或orphan suspicion/confirmation已CAS提交，且未有未决side effect时，返回对应`Truth(LeaseRecord)`，可附加matching orphan truth；`Renewable`/已terminal为`Skipped`；inspection unavailable或released mismatch在保留安全事实后为`Degraded`；lineage、marker或Version integrity error为application error，不伪装业务failed。 |
| forbidden | reaper直接调用release adapter、用`Unavailable`确认orphan、用`Released` observation绕过cleanup guard、复用旧orphan ref跨incident、删除lease/handle evidence、将`Expiring`当作可继续launch、扫描所有lease或从report count修复truth。 |

### 41.6 `EvaluatePendingCleanupGuards`

该Job只重评 cleanup readiness truth。它可以提交`PendingEvidence | PendingInvestigation | Blocked | Allowed`的
`CleanupGuard` decision，但不执行 backend teardown，也不把`Allowed`提升为`Completed`。release authorization、completion
basis和failure basis分别由受控主流程消费；本Job不得创建或提交这些basis。

| concern | exact contract |
|---|---|
| owner load | 对每个`CleanupGuardRef`读取guard + `Version`、完整`CleanupEvidenceSnapshot`、investigation summary、optional orphan、exact redline coverage及ordered containment rows，并校验context/identity/run/boundary/handle/lease/generation全等。missing sibling、coverage不完整或wrong lineage是integrity error，不用空集合补齐。 |
| strict evaluation | 只调用immutable `CleanupSafetyGuard::evaluate`；输入包含完整evidence、orphan、redline coverage/rows、investigation和trusted evaluation time。`Allowed`只表示当前evidence允许生成release authorization，不表示release已经发生；`PendingEvidence`、`PendingInvestigation`、`Blocked`均是合法保守结果。 |
| decision UoW | selection只含既有guard，因此在UoW中重读guard `Version`后只调用`apply_decision`，再CAS保存guard、decision/audit linkage、必要read marker和stored item relation；本Job不得调用`open`补造缺失truth。若已有`release_basis`/`completion_basis`/`release_failure_basis`，只允许按Step 6规则重评fresh redline coverage；不得覆盖basis、清除failure blocker或把post-release hold改成Allowed。 |
| safe defaults | evidence/read/lineage unavailable、redline coverage缺失、orphan confirmation未知、fresh release inspection `Unavailable`均保持当前安全阻断或形成typed `PendingEvidence/Blocked`，不能降级成Allowed。application/repository failure不写新的decision；旧guard truth仍可见并由item返回safe degraded/error。 |
| item mapping | exact decision已同UoW提交且关系完整时，`Allowed`或明确blocked/pending均表示guard evaluation完成；可返回`Succeeded(Truth(CleanupGuard))`，guard status由result surface承载。若只得到不完整source、unknown或CAS loser，则返回`Degraded(Truth(CleanupGuard), reason)`；不得把blocked safety result当作release success。 |
| forbidden | 调用release/inspect backend、`authorize_release_for`、`require_completion_basis`或`settle_release_confirmation`；删除capture/handoff/investigation证据；从单个`Allowed`标志关闭context；用query view、operator flag、config或caller bool清除blocker。 |

### 41.7 `MaintainRedlineContainmentHandoffs`

该Job维护redline的preservation recovery point和typed investigation handoff。它不解释调查正文，不拥有下游case
lifecycle，不自动恢复boundary/run，也不把redline `Released`等同于cleanup `Completed`。所有安全关键未知均保持
containment block。

| concern | exact contract |
|---|---|
| owner load | 对每个`RedlineContainmentRef`读取containment + `Version`、strict guard、lineage owners、preservation snapshot、latest investigation observation和exact observability material/source owner。selection ref必须与context/generation绑定；不得按“最新redline”替换。 |
| phase guard | `Detected`不得被本Job跳过为handoff；必须由redline primary flow完成typed containment/stop-new-use。`Contained`可由本Job组装与持久化matching `RedlinePreservationSnapshot`并进入`HandoffPending`；`HandoffPending`只能沿同一material/handoff ref刷新单调snapshot。`Released | Terminal`为terminal maintenance read，不能重开。 |
| preservation UoW | active-run使用`from_run_material`，post-run使用`from_post_run_material`，boundary-only使用`from_boundary_signal`；snapshot assembly必须从owner getter复制status/ref，不能由caller传status。以redline `Version` CAS提交`mark_handoff_pending`或`refresh_preservation_snapshot`、audit和必要 material/view marker；commit confirmed前不调用investigation port。 |
| external handoff | investigation port只接 exact redline ref、persisted snapshot、typed target和body-free correlation；返回`RedlineInvestigationHandoffObservation`。本批不新增独立investigation domain attempt；port的finite outcome、idempotency key和inspect/recovery carrier由`7R-03C`定义。raw case/body/receipt不得进入application或domain。 |
| observation / decision UoW | 先对重读的containment/Version、persisted snapshot与matching observation调用strict guard `evaluate_release`。`KeepPending`不得调用`record_investigation_observation`或任何truth transition，只保存operation-level safe disposition并保持containment字段不变。只有`ReleaseCleanupBlock | MakeTerminal`才在同一UoW先调用`record_investigation_observation`，再分别调用`release_cleanup_block | mark_terminal`；containment、audit、必要cleanup/read marker和stored item relation一次CAS提交。 |
| unknown / duplicate | external timeout、process crash或post-observation commit unknown不得再次调用investigation。先按exact `(redline_ref, preservation snapshot identity, operation/digest/key)`检查stored relation与已提交observation：fully committed可duplicate replay，fully absent才沿同一operation恢复，indeterminate保持`HandoffPending`/strict hold并交`7R-03C` recovery。旧snapshot observation不能套用到新snapshot。 |
| item mapping | preservation point或matching observation/terminal redline transition已提交且关系完整为`Succeeded(Truth(RedlineContainment))`；`KeepPending`、typed unavailable或仍需外部责任移交为`Degraded`并保留containment ref/reason；`MakeTerminal`是安全终态但仍block cleanup，不能报告环境已释放；integrity/lineage错误为application error。 |
| forbidden | 未持久化snapshot先调外部investigation、把`Accepted`当调查完成、把`Released`当cleanup completion、解除containment或恢复run、覆盖prior boundary failure、删除preservation/evidence、向下游传case/body/host/process/secret、unknown后盲重发。 |

### 41.8 C 批安全矩阵统一约束

以上前七个Job的`item_status`描述一次application维护调用是否诚实完成，不是对环境安全状态的替代枚举。所有
`Truth(...)` result ref都必须来自本次UoW已确认的owner identity；`Degraded`只表示已保存的有限事实或保守停留，不能
携带未提交的“预计成功”。任何涉及仍存活环境、release目标、redline containment、未确认external side effect或
commit-unknown的分支，默认保持原owner truth与阻断状态，直到exact typed inspection / recovery形成新的可提交证据。

### 41.9 `RebuildSandboxReadProjections` (historical snapshot; superseded by §52)

该Job的下列内容是旧的L2 read-side maintenance snapshot，当前首次物化规则由物理末尾§52取代。selection来自committed projection index并只包含既有
`SandboxReadProjectionRef`；缺失row是index/integrity error，不能在本Job中调用`create`或`create_unavailable`补行。
projection永远不是core truth source，query也不能借本Job获得write authority。

| concern | exact contract |
|---|---|
| owner/source load | 先以exact projection ref读取`SandboxReadProjection + Version`并校验context；再由formal source reader在一个committed snapshot中读取完整status-view bindings、redline truth/view ordered coverage、truth cursor、optional reference cursor、source audit和safe degraded reasons。不得执行八次latest read后拼组，也不得从旧projection body反推source。 |
| attempt fence | `Fresh`且无pending marker且已覆盖source cursors为`Skipped`；其它eligible state用current source构造`SandboxProjectionRebuildAttempt::{from_stale|initial}`。`initial`只适用于已有`Unavailable` identity且coverage/cursor/marker全空；任何existing coverage或marker必须使用fenced `from_stale`。 |
| start UoW | 重读projection `Version`，调用`start_rebuild`，以CAS提交`Rebuilding` state、matching attempt和audit；commit confirmed后才运行后续body-free binding builder/source reload。新truth/reference marker并发到达时，owner transition必须使旧attempt失效，不能由job id或时间放宽。 |
| completion UoW | 从新的committed source snapshot构造`SandboxProjectionRebuildCompletion`；重读projection + new `Version`。完整source调用`finish_rebuild`并whole-group替换bindings/cursors；caller-safe非安全gap调用`mark_degraded`；正式source unavailable调用`mark_unavailable`。mutated projection、audit、必要reference marker先stage，再由UoW分配对应cursor并一次CAS提交。 |
| safe default / race | redline coverage缺失、known containment缺view、mixed cursor或same-snapshot proof失败是typed integrity/unavailable，不能构造degraded source。CAS conflict或new marker使旧completion失败；保留current committed projection，返回可重试application conflict或`Degraded`，不得reload latest后套用旧attempt。 |
| item mapping | `finish_rebuild`提交为`Succeeded(Projection(ref))`；合法`mark_degraded/mark_unavailable`提交为`Degraded(Projection(ref), reason)`；已经覆盖exact source为`Skipped`。result ref只指existing projection identity，不表示query可见或core truth fresh。 |
| forbidden | query触发rebuild、创建缺失projection、扫描all projection、混用truth/reference cursor、用`Version`/timestamp/page token充cursor、旧body作source、repository直接改status、projection回写execution/boundary/policy/run/capture/cleanup/redline truth。 |

### 41.10 `MaintainDerivedInspectPreviewTrend` (historical snapshot; superseded by §52)

该Job的下列内容是旧的L2 existing-only writer snapshot，当前首次物化规则由物理末尾§52取代。它不执行
backend capability选择、reconciliation、tools semantic execution或runtime agent loop，任何builder失败都不得升级为
`FailureClassification`。

| concern | exact contract |
|---|---|
| owner/source load | 对每个`DerivedInspectPreviewTrendStateRef`读取state + `Version`、current `DerivedSourceRefSet`、matching rebuild marker和last-success coverage；formal source reader按source set在同一committed snapshot返回typed refs、truth/reference cursors和safe availability。缺失state是selection index integrity error，不补造initial state。 |
| read-only guard | 在读source或builder前由`DerivedReadOnlyGuard::evaluate`验证requested read kinds和唯一允许write target为matching derived state/materialization；任何试图写core truth、projection sibling或外部owner的authorization直接拒绝。guard不是caller bool，也不由config关闭。 |
| start UoW | `Fresh`且没有更新marker为`Skipped`；`Stale | Failed | Unavailable`必须持有matching `DerivedRebuildMarker`，重读`Version`后调用`start_rebuild`并CAS提交`Rebuilding`、marker relation和audit。只有commit confirmed后才运行body-free builder；不得先构造Fresh再补Unavailable。 |
| completion UoW | builder只能返回Step 6 `DerivedRebuildCompletion`、`DerivedFailureSummary`或classified safe unavailable。新UoW重读state/Version/marker：matching completion调用`finish_rebuild`并同时更新current与last-success source coverage/cursors；finite builder/validation failure调用`mark_failed`；source unavailable调用`mark_unavailable`。state、immutable materialization/current binding、audit和必要marker必须whole-group CAS提交。 |
| safe default / race | new marker、source-set replacement或Version conflict使旧completion/failure失效；保留newer state，不自动重跑或覆盖。Failed/Unavailable保留last-success coverage但不能宣称current Fresh；没有last-success时只返回status surface，不从cache/view body补材料。 |
| item mapping | matching completion commit为`Succeeded(Derived(ref))`；committed Failed/Unavailable为`Degraded(Derived(ref), safe reason)`；无需rebuild为`Skipped`。technical repository/mapper error无canonical state transition时返回application error，不把raw cause写入reason。 |
| forbidden | 修改core truth或read projection、从view/body/metric/builder response填state、generic source cursor、latest source scan、query-side repair、derived failure创建core failure、把comparison/reconciliation塞入Inspect/Preview/Trend kind。 |

### 41.11 `RunSandboxReconciliation`

该Job直接消费Step 6 canonical `RunSandboxReconciliationJobInput`并返回
`SandboxReconciliationMaterializationWriteOutcome`。它不是第十个paged batch分支，不创建
`SandboxJobInvocationPermit`，不进入`SandboxJobReportAccumulator`或`finalize_job_report`，也不伪造一个空maintenance
item。report是对账/审计记录面，不修复source truth或projection。

| concern | exact contract |
|---|---|
| input preflight | 校验Job channel、fixed operation、system actor、`JobRunId`、idempotency key/fingerprint、完整explicit scope、selection proof与canonical verified scope digest binding逐字段相等。scope empty仍是explicit empty，不表示all；禁止target kinds、page cursor、latest selector和caller report status。 |
| duplicate / conflict | 在任何source read或identity allocation前处理idempotency。same fingerprint completed从typed stored result ref加载`SandboxReconciliationStoredJobReport`及exact report/finding/audit/optional relay bundle并重验，零写返回`DuplicateReplayed { stored_job_report }`；不读取或返回current binding。same key/different fingerprint、in-flight或损坏relation返回typed error。 |
| exact source assembly | fresh winner按scope/proof从一个committed snapshot读取每个truth/projection target、双cursor watermark和five-channel coverage；每个checked target恰有一个typed observation。application预生成互不碰撞的report/finding/audit/optional relay/stored identities，纯装配immutable report draft，绝不调用source transition或repair port。 |
| relay hard gate | finding为空时relay draft必须为空且不得分配relay/payload identity；finding非空时必须在write前证明relay store、canonical encoder/verifier、schema、route/target binding和same-generation retry policy完整，并生成携带全部ordered finding refs的唯一Pending relay draft。任一append prerequisite不可用返回`FindingRelayUnavailable`并整组零可见；publisher暂不可投递不阻断合法Pending append。 |
| expectation / UoW | logical key是完整scope + verified digest。first使用`FirstMaterialization`并在同一transaction检查current/history/tombstone/in-flight全为空；replacement必须先读取exact current binding + core `Version`，使用`ReplaceCurrent`。stage report/findings/current binding/audit/optional relay pair/typed stored envelope/generic stored result/idempotency completion，分配report truth cursor，finalize并逐字段重验后一次commit。 |
| result mapping | whole group commit confirmed才返回`Committed { binding, stored_job_report }`。report `Clean | IssuesFound`机械映射original job `Succeeded`，`Degraded`映射`Degraded`，`Failed`映射`Failed`；这些是stored envelope字段，不经过generic item/finalizer status推导。post-commit low-cardinality hook失败不改outcome。 |
| rollback / concurrency | 任一pre-commit失败使reservation、candidate rows、binding、audit、relay、stored relation和cursor全部不可见。first/CAS loser不留下private historical report；late older source或Version conflict不得reload latest后覆盖。不同operation同scope只有完整UoW winner可见。 |
| commit unknown | 冻结原operation/candidate/stored/report identities并执行专用只读relation inspection：完整group存在且重验通过为committed，全部relation不存在为fully absent，其余为indeterminate。只在完整committed时恢复原outcome；absent交上层显式新调用；indeterminate quarantine/fail-closed。不得重读source、重算finding/payload、生成新identity或修复index/current。 |
| forbidden | generic derived repository、generic batch finalizer、current/latest report重组duplicate、report-only finding、CAS loser historical success、reconciliation修truth/projection/relay、count-only finding payload、query触发materialization、tools/runtime/member orchestration。 |

### 41.12 10 Job 执行矩阵共同停点

前九个paged Job都在一页内保持selection顺序并产生exactly one item per selected owner identity；handoff group是唯一明确
的一组target keys对应一个owner item例外。每页结束只由formal reader给出next token，application把原selection与token
装回linear permit。第十个reconciliation一次消费完整explicit scope并走专用atomic writer。审计、diagnostic、测试和交付
不在这些facade内形成第二套业务流程；post-commit hook失败只按L2记录，不回滚已确认主体truth或报告组。

## 42. `7R-01D` 10/10 Job Join

### 42.1 Selector、method、input、selection 与 result 唯一映射

| # | `SandboxJobKind` | exact method | exact input / selection | closed result | matrix |
|---:|---|---|---|---|---|
| 1 | `PublishSandboxEventRelay` | `publish_sandbox_event_relay` | `PublishSandboxEventRelayJobInput` / `PublishSandboxEventRelaySelection` | `SandboxPagedJobInvocationResult<PublishSandboxEventRelaySelection>` | §41.1 |
| 2 | `RefreshSandboxReferenceStates` | `refresh_sandbox_reference_states` | `RefreshSandboxReferenceStatesJobInput` / `RefreshSandboxReferenceStatesSelection` | `SandboxPagedJobInvocationResult<RefreshSandboxReferenceStatesSelection>` | §41.2 |
| 3 | `RefreshBackendCapabilitySummaries` | `refresh_backend_capability_summaries` | `RefreshBackendCapabilitySummariesJobInput` / `RefreshBackendCapabilitySummariesSelection` | `SandboxPagedJobInvocationResult<RefreshBackendCapabilitySummariesSelection>` | §41.3 |
| 4 | `RetryPendingMaterialHandoffs` | `retry_pending_material_handoffs` | `RetryPendingMaterialHandoffsJobInput` / `RetryPendingMaterialHandoffsSelection` | `SandboxPagedJobInvocationResult<RetryPendingMaterialHandoffsSelection>` | §41.4 |
| 5 | `RunLeaseOrphanReaper` | `run_lease_orphan_reaper` | `RunLeaseOrphanReaperJobInput` / `RunLeaseOrphanReaperSelection` | `SandboxPagedJobInvocationResult<RunLeaseOrphanReaperSelection>` | §41.5 |
| 6 | `EvaluatePendingCleanupGuards` | `evaluate_pending_cleanup_guards` | `EvaluatePendingCleanupGuardsJobInput` / `EvaluatePendingCleanupGuardsSelection` | `SandboxPagedJobInvocationResult<EvaluatePendingCleanupGuardsSelection>` | §41.6 |
| 7 | `MaintainRedlineContainmentHandoffs` | `maintain_redline_containment_handoffs` | `MaintainRedlineContainmentHandoffsJobInput` / `MaintainRedlineContainmentHandoffsSelection` | `SandboxPagedJobInvocationResult<MaintainRedlineContainmentHandoffsSelection>` | §41.7 |
| 8 | `RebuildSandboxReadProjections` | `rebuild_sandbox_read_projections` | `RebuildSandboxReadProjectionsJobInput` / `RebuildSandboxReadProjectionsSelection` | `SandboxPagedJobInvocationResult<RebuildSandboxReadProjectionsSelection>` | §41.9 |
| 9 | `MaintainDerivedInspectPreviewTrend` | `maintain_derived_inspect_preview_trend` | `MaintainDerivedInspectPreviewTrendJobInput` / `MaintainDerivedInspectPreviewTrendSelection` | `SandboxPagedJobInvocationResult<MaintainDerivedInspectPreviewTrendSelection>` | §41.10 |
| 10 | `RunSandboxReconciliation` | `run_sandbox_reconciliation` | Step 6 canonical `RunSandboxReconciliationJobInput` / complete explicit scope | `SandboxReconciliationMaterializationWriteOutcome` | §41.11 |

前九行均有独立checked input、immutable known selection、linear invocation permit、fresh/duplicate互斥结果和完整batch chain。第十行复用Step 6 canonical input与whole-group writer，不创建第十个paged selection，也不进入generic finalizer。`finalize_job_report`仅是前九行fresh exhausted路径共享helper，不属于`SandboxJobKind`、42-entry或protocol dispatch。

### 42.2 Job closure audit

| check | expected | observed design result |
|---|---:|---:|
| Job selector / logical entry method | 10 / 10 | 10 / 10；missing 0，duplicate 0。 |
| paged input / immutable selection | 9 / 9 | 9 / 9；reconciliation使用1个Step 6 canonical input。 |
| checked input constructor / accessor family | 9 / 9 | 9 / 9；public struct literal 0。 |
| execution matrix | 10 | 10；L1安全例外和L2停止点均明确。 |
| generic positive dispatch | 0 | 0；`run_job`、`SandboxJobServiceInput`只存在于historical invalidation或禁止项。 |
| undefined positive carrier | 0 | 0；`SandboxJobInvocationResultParts`只存在于禁止声明说明。 |
| opaque/latest/all-scan positive path | 0 | 0；所有匹配均为historical evidence、Query受控selector或明确禁止项。 |
| reconciliation进入generic permit/accumulator/finalizer | 0 | 0。 |
| source repair / query-side write | 0 | 0。 |

## 43. 42/42 Application Callable Closure

### 43.1 Family join

| family | canonical selector count | independent entry method | exact input | result ownership | unresolved callable |
|---|---:|---:|---:|---|---:|
| Command | 10 | 10 | 10 | `ApplicationResult<SandboxServiceOutcome>` | 0 |
| Query | 13 | 13 | 13 | typed query result / page result | 0 |
| Consumer | 9 | 9 | 9 | application-local result；worker owns receipt | 0 |
| Job | 10 | 10 | 9 local + 1 Step 6 canonical | 9 paged + 1 reconciliation-specific | 0 |
| **total** | **42** | **42** | **42** | each selector maps exactly once | **0** |

`finalize_job_report`不计第43个entry；它没有selector、entry route或public DTO。canonical enum到method采用逐variant显式映射，禁止从route、topic、binary name、`Debug`文本或opaque payload反推。service侧42/42已经闭合；entry adapter双向映射仍由`7R-06`拥有，因此`STEP7-DISPATCH-001`只能记录service-side partial evidence，不能在本批关闭。

### 43.2 Blocker disposition

| blocker | `7R-01` current evidence | status after `7R-01` |
|---|---|---|
| `SBX-DDD-GRANULARITY-STEP7-INPUT-001` | 42/42 exact application input、字段来源/optionality、checked construction、typed output和DTO source requirement均有唯一owner；undefined positive `*Input`为0。 | `resolved_in_7r_01_wait_review`；后续若Step 8无法逐字段机械映射则必须重开。 |
| `...-DISPATCH-001` | service侧42/42独立method闭合，generic/string/topic dispatch为0。 | `partial_service_42_of_42`；等待`7R-06` entry双向映射。 |
| `...-REF-001` | current input使用named refs，positive `SandboxOpaqueRef`为0。 | 保持open；`7R-02`仍须关闭repository/core `Version` join。 |
| `...-OUTCOME-001` | callable禁止adapter直接写status。 | 保持open；等待`7R-03/05` finite outcome与parity。 |
| `...-READ-001` | exact selector、owner load和whole-group requirement已登记。 | 保持open；等待`7R-04` exact port surface。 |
| `...-ENTRY-001` | DTO source与receipt/report ownership已固定。 | 保持open；等待`7R-06` entry mapper。 |

未发现需要重开Step 6或上游L1/L2正式文档的新blocker。当前五项Step 7内部blocker继续开放，Step 8、正式`03~07`和implementation仍冻结。

### 43.3 `7R-01` Completion Gate

| gate | result |
|---|---|
| 10 Command / 13 Query / 9 Consumer / 10 Job | 42/42 exact callable，missing 0，duplicate 0。 |
| exact input and result owner | 42/42；Job为9 local + 1 Step 6 canonical，helper不冒充entry。 |
| L1/L2/L3 discipline | 主流程与安全truth exact；普通维护/异常/审计停在L2；review/test/delivery未扩写。 |
| safety unknown | release、attempt、handoff、redline和commit unknown均保守，不产生虚假success。 |
| scope redline | tools semantic execution、runtime agent loop、member lifecycle orchestration均未进入。 |
| Markdown/static hygiene | code fence parity、trailing whitespace和identifier negative scan必须在同步后复核。 |
| formal/implementation facts | 正式`03~07`、planned skeleton、代码、run、test、evidence、acceptance、commit修改或宣称均为0。 |

```text
current_document = 03-详细设计.md
current_step = Step 7 regression / 7R-01 completed_wait_user_review
completed_batch = 7R-01A,7R-01B,7R-01C,7R-01D
current_gate = S7-G01 user review pending
command_callable = 10/10
query_callable = 13/13
consumer_callable = 9/9
job_callable = 10/10
current_callable_defined = 42/42
input_blocker = resolved_in_7r_01_wait_review
remaining_step_7_internal_blockers = 5/6 open with owner
next_allowed_action = wait_user_review_before_7R_02
step_8 = blocked_by_step_7_regression
formal_03_07 = historical_reviewed_revalidation_pending
implementation = CB-SBX-01A blocked / wait_design
real_test_execution = not_started
real_evidence_created = no
commit_required = no
```

---

# `7R-02B` Current Activation：mutable owner reachability最终口径

> 本节位于本文件物理末尾，是`7R-02B` facade owner reachability的唯一current activation（2026-07-26）。
> §44~§51均为historical-position diagnosis / draft；§41.9~§41.10的existing-only Job文字也是historical snapshot。
> 与这些历史材料冲突时，以本节、repository产物§25和Step 6 current object contract为准。
> 本节不提前定义`7R-02C/02D`的immutable、audit、stored-result、relay-attempt或index schema。

## 52.1 Authority与闭合结果

| check | current result |
|---|---|
| mutable roots | 20个mutable status owner映射到19个persisted logical root；`HandoffTargetProgress`只嵌入`HandoffFact`，无独立repository、ref或`Version` |
| repository methods | 19/19 root各有exact `get/create/save`，共57/57 method；generic repository/upsert/bulk create为0 |
| transaction groups | 21/21 same-UoW group均有named application owner；`C*`只是G01/G06逐row create规则，不是repository API |
| callable join | Command 10/10、Query 13/13、Consumer 9/9、Job 10/10，共42/42；未新增第43个public callable |
| Query guard | 13/13 Query的mutable get-for-write、create、save、identity/cursor allocation、write UoW和external call均为0 |
| idempotency | 10 Command + 9 Consumer + 10 Job共29/29 fresh callable经唯一`reserve_fresh_operation`；duplicate/recovery不二次create |
| relay | 只有当前fresh callable的finalized draft且`requires_event_relay() == true`时，唯一`append_finalized_relay`可create |
| negative scope | tools semantic execution、runtime agent loop、member lifecycle orchestration均不进入Sandbox application facade |

## 52.2 Unique create-owner reachability

19个root的create primitive只可由repository产物§25.3登记的唯一application kernel调用。以下特殊路径覆盖原有不可达差集：

1. `ReferenceResolutionState`首次创建只归
   `open_controlled_execution_context -> write_initial_reference_state -> create_reference_state`。intake固定checked explicit
   source set，为每个source预生成一个state ref并取得finite body-free observation，再在`MUT-G01`逐row stage；refresh Job和
   三个reference consumer只允许existing `get + transition + save`，`NotFound`是selection/index integrity error。
2. `CapturedMaterialRef`只由`record_capture_result -> write_capture_material_group`在`MUT-G06`创建。candidate set必须来自
   同一terminal run/capture snapshot并带完整性证明；每个composite key逐row调用`create_captured_material`。zero row只接受
   domain factory的terminal zero-material proof；任一row或observability relation失败使whole group rollback。
3. `SandboxReadProjection`由`rebuild_sandbox_read_projections`的formal target分出
   `FirstMaterialization | Existing`。first重验stable ref、context/kind/scope、source proof与exact absence后调用domain
   `create`/`create_unavailable`和`create_read_projection`；existing按exact `Version` transition并save。`NotFound`不是first proof。
4. `DerivedInspectPreviewTrendState`由`maintain_derived_inspect_preview_trend`的formal target/source proof分出first/existing。
   first只可经`from_sources`或`unavailable_from_sources`后create；existing按Version transition并save。empty source、Query
   absence、builder cache/failure不得制造第二identity或`FailureClassification`。
5. `FailureClassification`首次create只经`write_failure_classification`；`CleanupGuard`首次create只经
   `evaluate_cleanup_readiness / write_cleanup_guard / MUT-G13`；`OrphanRecoveryRecord`首次create只经`MUT-G18` eligible
   incident branch。cleanup release/confirmation路径、`MUT-G15`及后续安全维护只保存existing owner。

## 52.3 Relay、idempotency与race停点

`reserve_fresh_operation`必须先于business read、business identity allocation和external call完成fresh claim；same key/same
digest duplicate只加载完整stored surface，same key/different digest、in-flight、损坏relation和无法证明等价的
`AlreadyExists`均返回typed conflict/integrity。commit unknown只冻结原identity并做whole-group只读inspection，不重算source、
不生成新identity，也不把partial relation映射为success。

`append_finalized_relay`只接受当前operation已经finalize的draft，并重验source truth/cursor、payload、target、generation、
schema/retry prerequisite和required gate。gate false时不分配relay identity；required prerequisite缺失时主体group不得退化为
report-only成功。publisher、feedback consumer和retry Job仅可对existing relay执行get/save/attempt transition。

## 52.4 Completion与停审

本批静态差集审计结果为：19/19 roots、57/57 methods、21/21 groups、42/42 callables、29/29 fresh reservation owner、
Query mutable write 0/13、current activation 1且位于物理末尾、generic fallback 0。该结论只证明设计文档可落码闭合；
它不是compile、test、run、evidence、验收签署或commit事实。

`S7-02B`在repository、facade、control、flow和两层ledger同步后完成。`REF-001`仍等待`7R-02C/02D`的immutable、stored与
index join，`S7-G02`也仍未到达；因此本批完成后停审，不自动进入`7R-02C`。

```text
current_document = 03-详细设计.md
current_step = Step 7 regression / 7R-02B completed_wait_user_review
completed_task = S7-02B mutable truth repository owner reachability
mutable_owner = 20/20
logical_repository_root = 19/19
repository_method = 57/57
same_uow_group = 21/21
application_callable = 42/42
fresh_idempotency_owner = 29/29
query_mutable_write = 0/13
current_activation = 1_at_physical_eof
next_allowed_action = wait_user_review_before_7R_02C
ref_blocker = open_wait_7r_02c_02d
step_8 = blocked_by_step_7_regression
formal_03_07 = historical_reviewed_revalidation_pending
implementation = CB-SBX-01A blocked / wait_design
real_test_execution = not_started
real_evidence_created = no
commit_required = no
```

---

## EOF Current Overlay: `S7-02D` facade join

本节位于物理 EOF，覆盖本文中段的 activation draft。`S7-02D` 不新增第43个 public callable；它只把29个 fresh
non-Query callable接到唯一 reservation kernel，并为三类 typed stored surface定义后续精确消费边界。

```text
current_document = 03-详细设计.md
current_step = Step 7 regression / 7R-02D in_progress
current_batch = S7-02D idempotency / stored result / facade join
batch_status = in_progress
gate_status = content_in_progress
current_callable = 42/42
fresh_reservation_owner = 29/29
duplicate_path = exact claim + exact stored surface replay only
query_write = 0/13
public_callable_added = 0
completed_internal_batches = S7-02D-B1,S7-02D-B2
current_internal_batch = S7-02D-B3 typed stored carrier and full surface stores
next_allowed_action = write_s7_02d_b3_batch_1
ref_blocker = in_progress_wait_s7_02d
formal_03_07 = historical_reviewed_revalidation_pending
implementation = CB-SBX-01A blocked / wait_design
commit_required = no
```

---

## EOF Current Recovery Override: `S7-02D-B3-1` facade source ready, B3-2 next

本节位于物理EOF并覆盖本文全部前置facade overlay。三类surface source归application；未新增public callable。

```text
current_document = 03-详细设计.md
current_step = Step 7 regression / 7R-02D in_progress
current_batch = S7-02D idempotency / stored result / facade join
batch_status = in_progress
gate_status = content_in_progress
completed_internal_sub_batch = S7-02D-B3-1
current_internal_batch = S7-02D-B3
surface_source = application_owned_transport_neutral
public_callable_added = 0
query_write = 0/13
next_allowed_action = write_s7_02d_b3_batch_2
ref_blocker = in_progress_wait_s7_02d
formal_03_07 = historical_reviewed_revalidation_pending
implementation = CB-SBX-01A blocked / wait_design
commit_required = no
```

---

## EOF Current Recovery Override: `S7-02D-B3-2` completed, B3-3 active

本节位于物理 EOF，覆盖前置 facade overlay。B3-2 只补齐 application-owned stored surface 的 persistence boundary，未
新增 public callable，未改变 42/42 entry input/output；fresh 与 duplicate 的 operation/kind/status/ref/time 共用校验
仍由 B3-3 完成。Step 8 仅消费已验证的 frozen surface。

```text
current_document = 03-详细设计.md
current_step = Step 7 regression / 7R-02D in_progress
current_batch = S7-02D idempotency / stored result / facade join
batch_status = in_progress
gate_status = content_in_progress
completed_internal_sub_batch = S7-02D-B3-2 typed store exact traits and errors
current_internal_batch = S7-02D-B3
next_internal_sub_batch = S7-02D-B3-3 cross-validation
next_allowed_action = write_s7_02d_b3_batch_3
current_callable = 42/42
public_callable_added = 0
fresh_reservation_owner = 29/29
surface_store_methods = carrier_2 + typed_6
write_handle = same_uow_stage 4/4
read_handle = committed_snapshot 6/6
query_write = 0/13
ref_blocker = in_progress_wait_s7_02d
formal_03_07 = historical_reviewed_revalidation_pending
implementation = CB-SBX-01A blocked / wait_design
commit_required = no
```

---

## EOF Current Recovery Override: `S7-02D-B4` facade orchestration closed

本节位于 facade 产物物理 EOF，覆盖前置 B3 facade overlay。B4 没有改变42个public application method或其input/output；
它只固定29个write-capable method的共同 reservation/finalization/recovery suffix。13个Query继续zero idempotency/write。

```text
current_document = 03-详细设计.md
current_step = Step 7 regression / 7R-02D in_progress
current_batch = S7-02D idempotency / stored result / facade join
batch_status = in_progress
gate_status = user_confirmation_pending_for_internal_batch
completed_internal_batches = S7-02D-B1,S7-02D-B2,S7-02D-B3,S7-02D-B4
completed_internal_batch = S7-02D-B4 whole-group application orchestration
next_internal_batch = S7-02D-B5 necessary bounded selector/index and parity join
next_allowed_action = wait_user_confirmation_before_s7_02d_b5
current_callable = 42/42
fresh_reservation_owner = 29/29
query_idempotency = 0/13
query_write = 0/13
public_callable_added = 0
entry_duplicate_overlay_write = 0
duplicate_business_external_rerun = 0/0
second_durable_identity = 0
whole_group_modes = 3/3
whole_group_results = 3/3
S7-02D-INT-04 = closed
S7-02D-INT-05 = open
ref_blocker = open_wait_s7_02d_b5_b6
formal_03_07 = historical_reviewed_revalidation_pending
implementation = CB-SBX-01A blocked / wait_design
real_test_execution = not_started
real_evidence_created = no
commit_required = no
```

---

## EOF Current Recovery Override: `S7-02D-B5` selector-bound paged Job facade closed

> 本节位于facade产物物理EOF，是B5 facade join的唯一current authority（2026-07-27）。本节显式采纳前部
> `Historical-Position Foundation: S7-02D-B5 selector-bound paged Job facade draft` §§53~57和
> `Historical-Position Activation Draft: S7-02D-B5 selector-bound paged Job facade` §§58~60；两处仅保留推导轨迹。
> 冲突时，以本节和idempotency/index主产物物理EOF §§64~70为准。

current固定为：九个既有`*Selection`类型只保存selector identity，不保存全量target vector；前七类冻结一次trusted cutoff，
projection保存explicit refs，derived保存supported `Inspect/Preview/Trend` kinds。`SandboxJobInvocationPermit<S>`线性保存原
selector、page limit、snapshot-bound `next_cursor`和page count；Start cursor只能为None，Continue不能接受caller token或第二
selector。九个service method各调用一个exact read-only reader，index target随后必须exact owner reload和domain recheck。

`SandboxMaintenanceBatchOutcome`中的PageToken仅由matching codec从input/next repository cursor编码，用于完整report chain；
它不是repository key、Version、truth/reference cursor或恢复授权。finalizer只消费exhausted permit与完整ordered-unique
batch chain，不重读selection/current truth，不重建target vector。duplicate在selection/cursor/owner/external/write之前完成完整
stored report replay。`RunSandboxReconciliation`继续完整explicit scope，不进入paged reader。

capability item target统一从 `BackendCapabilityRefreshTarget` lossless映射为 Step 6 current
`SandboxMaintenanceTargetRef::BackendCapability { backend_ref, requirement_ref }`；first 与 replacement 不再分别使用
`External(IsolationBackend)`和`Truth(BackendCapabilitySummary)`。同一 backend 可对多个 immutable requirement refs形成不同
target，report ordered-unique / cross-batch duplicate检查必须保留这对复合identity；`current_summary_ref`仅用于owner reload和
CAS expectation，不参与target identity。matching page-token codec current只有`encode`：Start没有public token，Continue直接
move permit cursor，因而 facade 不得调用或装配 `decode`。Step 6 current overlay已删除
`SandboxJobRunContext.initial_page_token`和`SandboxJobReportAccumulator.initial_page_token`；batch outcome内部的
`input_page_token / next_page_token`只记录当前invocation的完整report chain，不回流为下一次Start input。

```text
current_document = 03-详细设计.md
current_step = Step 7 regression / 7R-02D
current_batch = S7-02D idempotency / stored result / bounded index
batch_status = in_progress
completed_internal_batches = S7-02D-B1,S7-02D-B2,S7-02D-B3,S7-02D-B4,S7-02D-B5
completed_internal_batch = S7-02D-B5 selector-bound paged Job facade
next_internal_batch = S7-02D-B6 closure audit and recovery-source synchronization
next_allowed_action = wait_user_confirmation_before_s7_02d_b6
current_callable = 42/42
fresh_reservation_owner = 29/29
paged_selector = 9/9
paged_reader = 9/9
query_maintenance_index = 0/13
query_write = 0/13
reconciliation_paged_reader = 0/1
S7-02D-INT-05 = closed
ref_blocker = open_wait_s7_02d_b6
formal_03_07 = historical_reviewed_revalidation_pending
implementation = CB-SBX-01A blocked / wait_design
real_test_execution = not_started
real_evidence_created = no
commit_required = no
```

---

## EOF Current Recovery Override: `S7-02D-B6` facade closure consumed

本节位于 facade 产物物理 EOF，覆盖 B5 selector-bound facade overlay。B6 只确认 facade 与 repository/control 的
cross-source join，不改变 42 个 public application method、输入输出、Job permit、selector或finalizer。

| facade closure | result |
|---|---:|
| application callable | `42/42` |
| write-capable fresh reservation owner | `29/29` |
| Query idempotency / write | `0/13` / `0/13` |
| paged maintenance selector / reader | `9/9` / `9/9` |
| reconciliation paged reader | `0/1` |
| duplicate business/external rerun | `0/0` |
| public callable or repository method added by B6 | `0/0` |
| B6 source join | repository §§71~74、facade B5 EOF、control B6 EOF一致 |

```text
current_document = 03-详细设计.md
current_step = Step 7 regression / 7R-02D completed_wait_user_review
current_batch = S7-02D idempotency / stored result / bounded index
batch_status = completed_wait_user_review
gate_status = user_review_pending
completed_internal_batches = S7-02D-B1,S7-02D-B2,S7-02D-B3,S7-02D-B4,S7-02D-B5,S7-02D-B6
current_internal_batch = none
current_callable = 42/42
fresh_reservation_owner = 29/29
paged_selector = 9/9
paged_reader = 9/9
query_maintenance_index = 0/13
query_write = 0/13
reconciliation_paged_reader = 0/1
S7-02D-INT-01 = closed
S7-02D-INT-02 = closed
S7-02D-INT-03 = closed
S7-02D-INT-04 = closed
S7-02D-INT-05 = closed
ref_blocker = resolved_in_7r_02d
next_allowed_action = wait_user_review_before_s7_g02
step_8 = blocked_by_step_7_regression
formal_03_07 = historical_reviewed_revalidation_pending
implementation = CB-SBX-01A blocked / wait_design
real_test_execution = not_started
real_evidence_created = no
commit_required = no
```

---

## EOF Current Recovery Override: `S7-03B` launch facade ordering consumed

本节位于 facade 产物物理 EOF，是 `start_controlled_execution_run` 对 `S7-03B` lifecycle contract 的唯一 current authority。
前部同名段只保留为 `historical_material`。public facade method、input schema、42/42 callable 集合均不新增或改名。

### Current facade algorithm

```text
start_controlled_execution_run(ctx, input)
  -> validate fixed operation/channel/authority/digest/idempotency key
  -> reservation-only UoW: claim_idempotency_reservation
  -> commit reservation
       DuplicateReplayed -> exact stored replay; zero business read/allocation/port/write
       Existing / conflict / in-flight / failed -> typed application error; zero business body
       NotCommitted / StatusUnknown -> strict hold or reservation inspection; zero business body
       Confirmed -> retain FreshReservationOwnership
  -> exact-read context/identity/requirement/boundary/capability/handle/lease/policy
  -> allocate run/capture/launch-failure refs exactly once
  -> ControlledRunIdentityBundle::try_from_generated
  -> ControlledExecutionRun::prepare
  -> preparation UoW: create Preparing run + capture/audit/launch-recovery relation
  -> preparation commit confirmed; drop UoW
  -> fresh-read Preparing group + committed reservation
  -> require_prebound_launch_failure_ref + authorize_launch
  -> call launch port outside UoW
  -> validate finite result, or inspect exact same correlation on side-effect unknown
  -> fresh-read run/recovery group + Version
  -> finalization UoW: apply one branch and save complete stored surface
  -> commit confirmed -> return SandboxServiceOutcome
```

| launch branch | facade/domain action | resulting truth | forbidden |
|---|---|---|---|
| `Launched` | validate matching observation; `mark_running`; save run | `Preparing -> Running`; prebound candidate retired | create failure or reuse old Version |
| `BackendLaunchFailed` | same-ref marker/classification/basis; `mark_failed`; save classification and run | classification `Classified`; run `Preparing -> Failed` | second ref, `PendingInput`, `mark_terminal`, adapter status write |
| `NotLaunched` | preserve exact Preparing recovery point; bounded same-key retry only after revalidation | run/ref unchanged | create a second identity or infer success |
| `Unavailable` | preserve unknown side-effect relation and hold | no terminal inference | blind retry or map to `NotLaunched` |
| `Conflicted` | route typed conflict to formal failure/control/redline owner | single checked safety winner | direct port mutation or last-write-wins |

### Facade closure

| check | result |
|---|---:|
| public method delta | `0` |
| public input delta | `0` |
| committed UoW sequence | `reservation_only -> run_preparation -> finalization` |
| launch branch closure | `5/5` |
| external call while UoW held | `0` |
| duplicate business/external rerun | `0/0` |
| second run/capture/failure identity | `0` |
| tools/runtime/member semantic execution fields | `0` |
| new L1/L2 upstream blocker | `0` |

```text
current_document = 03-详细设计.md
current_step = Step 7 regression / 7R-03B completed_wait_user_review
current_batch = S7-03B establish/launch/inspect/release ports
artifact_content_status = completed
artifact_review_status = user_review_pending
facade_current_authority = EOF_S7-03B_launch_ordering_overlay
public_method_delta = 0
public_input_delta = 0
committed_uow_sequence = reservation_only,run_preparation,finalization
launch_finite_branches = 5/5
launch_failure_mark_terminal = forbidden
duplicate_business_external_rerun = 0/0
new_l1_l2_blocker = 0
next_allowed_action = wait_user_review_before_s7_03c
step_8 = blocked_by_step_7_regression
formal_03_07 = historical_reviewed_revalidation_pending
implementation = CB-SBX-01A blocked / wait_design
real_test_execution = not_started
real_evidence_created = no
commit_required = no
```

---

## EOF Current Recovery Override: `7R-06C-1B-R` Worker relay paged finalization consumed

> 本节位于 facade 产物物理 EOF，是 `7R-06C-1B-R` 的唯一 current authority（2026-07-29）。本节显式采纳前部
> `Historical-Position Foundation: 7R-06C-1B-R Worker relay paged finalization contract` 的 R1~R6 全部规则、
> 字段 join、Rust-style pseudocode、status matrix、failure boundary 和 static audit。前部同批 activation draft 只保留
> 定位轨迹。若 B5/B6、旧 §40.6、旧 Worker mapping 或 `S7-03B` EOF 与本 activation冲突，只在 relay paged/finalizer
> channel 与 Worker handoff范围内以本节为准。

Current delta严格限定为：

1. `publish_sandbox_event_relay`、其 `SandboxJobInvocationPermit<PublishSandboxEventRelaySelection>`、
   `SandboxFinalizableJobPermit::PublishSandboxEventRelay` 和 shared `finalize_job_report` 接受原 invocation channel
   `Worker | Job`；其它八个 paged Job 与 reconciliation 仍是 `Job` only。
2. Start/Continue/finalizer全链必须保留同一个 `SandboxServiceCallContext`；Continue 的 caller context 与 permit context
   逐字段相等，禁止 Worker/Job channel中途切换。channel不进入 duplicate key，也不能产生第二 report。
3. Worker Start唯一输入 join为：`SandboxRelayLoopInvocation` 提供 context、`JobRunId`、started_at、selector context、
   selector cutoff、page limit、digest/key；Start cursor固定 `None`。started_at与cutoff取同一 trusted timestamp。
4. Worker仅在一个 async invocation 内 move-preserve完整 batch vector；nonterminal permit只进入一次 Continue，terminal permit
   只进入一次 `FinalizeSandboxJobReportInput::try_new`。Worker不复制 cursor、不flatten items、不推导status。
5. finalizer input在 move 前通过 `report_status()` 暴露 constructor-derived status；finalizer返回完整
   `SandboxServiceOutcome`。Worker只把这两项交 `SandboxRelayLoopResult::finish`。
6. fresh current relation固定为 `Succeeded | Skipped -> NoChange/Completed`、
   `PartialFailed | Degraded -> Degraded/Completed`、`Failed -> Failed/Failed`；duplicate overlay为
   `DuplicateReplayed`。`NoChange + Succeeded` 与 `NoChange + Skipped` 均为显式合法分支。
7. page/finalizer error、permit loss、process crash或 commit unknown均不产生 loop success；Worker不得按 run id、last token、
   count、publisher response、repository/current truth重建 continuation/report。

| closure | result |
|---|---:|
| logical application callable | `42/42` |
| new public callable / DTO | `0 / 0` |
| relay channel branches | `2/2` (`Worker`,`Job`) |
| non-relay Worker-channel maintenance | `0/9` |
| first-page field join | `7/7` |
| full batch chain -> exhausted permit -> finalizer | closed_for_design |
| duplicate no-read/no-write/no-external | closed_for_design |
| Worker -> Jobs / repository / UoW / publisher direct dependency | `0 / 0 / 0 / 0` |
| new L1/L2 blocker | `0` |

本 activation关闭 relay blocker 的 service facade owner子条件；entry adapter 已按同一 context、linear permit、完整batch
chain和application finalizer完成回审，entry owner子条件也已满足。`SBX-DDD-GRANULARITY-STEP7-RELAY-001` 已解除；仍须等待
用户复核后才能进入 `7R-06C-1C`，不得提前进入 C-2、Step 8、正式 `03` 或 implementation。

```text
current_document = 03-详细设计.md
current_step = Step 7 regression / 7R-06
current_sub_batch = 7R-06C-1B-R service facade contract consumed_by_completed_entry_reaudit
artifact = 03_ddd_step_07_service_facades_inputs_outputs.md
artifact_content_status = completed
artifact_review_status = consumed_by_completed_entry_reaudit
current_authority = physical_eof_7r_06c_1b_r_consumed_activation
relay_channel_allow_set = Worker|Job
other_paged_job_channel_allow_set = Job_only
relay_first_page_field_join = 7/7
relay_fresh_finalization_chain = closed_for_design
relay_duplicate_chain = closed_for_design
new_application_callable = 0
new_public_dto = 0
worker_jobs_dependency = 0
new_l1_l2_blocker = 0
internal_relay_blocker = resolved_by_completed_entry_reaudit
resolved_blocker = SBX-DDD-GRANULARITY-STEP7-RELAY-001
next_allowed_action = wait_user_review_before_7r_06c_1c_jobs_mapping
formal_03_writeback = forbidden
implementation = not_started
real_test_execution = not_started
real_evidence_created = no
acceptance_signoff = no
commit_required = no
```

---

## EOF Current Owner Activation: `7R-06C-1C-R` borrowed JobReport finalizer

> 本节是本文物理EOF的唯一current authority（2026-07-29）。它完整采纳文件顶部
> `Historical-Position Foundation: 7R-06C-1C-R borrowed JobReport finalizer`的§§40.8~40.12。前部§§40.6~40.7与
> `7R-06C-1B-R`在冲突处降为historical material。

Current exact contract固定为：

1. `FinalizeSandboxJobReportInput<'a>`按值拥有exhausted `SandboxFinalizableJobPermit`，只借用
   `&'a [SandboxMaintenanceBatchOutcome]`，constructor唯一派生fresh report status。
2. `SandboxJobService::finalize_job_report<'a>(&'a self, input: FinalizeSandboxJobReportInput<'a>)`返回
   `ApplicationResult<SandboxFinalizedJobReport>`；等价`BoxFuture<'a, ...>`形态允许，但不得形成第二callable。
3. future不得要求`'static`、spawn/detach或让borrow逃逸。application使用
   `SandboxMaintenanceJobReportWriteSource<'a>`逐项stage完整typed report，不clone/rebuild完整chain。
4. owned `SandboxMaintenanceJobReportSurfaceDraft`只作为committed persistence read/rehydration结果；fresh write不先构造它。
5. report clock只在finalization UoW读取一次；typed surface `finished_at`、generic carrier `recorded_at`和idempotency
   `terminal_at`完全相等。commit confirmed后才构造witness。
6. Worker relay fresh消费witness；duplicate使用专用factory。旧“entry复制status再与普通outcome拼接”的口径失效。

| closure | result |
|---|---:|
| logical Job entry methods | `10/10` |
| shared finalizer helper | `1`，不计第43个entry |
| finalizer owned full batch chain | `0` |
| finalizer borrowed full chain | `1` |
| application status derivation owner | `1` |
| complete-chain clone/rebuild | `0 / 0` |
| public DTO/callable/job kind delta | `0 / 0 / 0` |
| new L1/L2 blocker | `0` |

```text
current_document = 03-详细设计.md
current_step = Step 7 regression / 7R-06
current_sub_batch = 7R-06C-1C-R service facade borrowed finalizer activated
artifact = 03_ddd_step_07_service_facades_inputs_outputs.md
artifact_content_status = completed
artifact_review_status = consumed_by_typed_store_and_entry_reaudit_pending
current_authority = physical_eof_7r_06c_1c_r_borrowed_finalizer_activation
finalizer_batch_ownership = borrowed_slice
finalizer_output = SandboxFinalizedJobReport
application_fresh_status_deriver_count = 1
new_public_dto = 0
new_application_callable = 0
new_l1_l2_blocker = 0
next_allowed_action = update_typed_store_borrowed_write_surface
formal_03_writeback = forbidden
implementation = not_started
real_test_execution = not_started
real_evidence_created = no
acceptance_signoff = no
commit_required = no
```

---

## EOF Current Owner Amendment: `7R-06C-1C-R` complete fresh/replay report sources

> 本节取代上一C-1C-R facade activation并成为本文物理EOF的唯一current authority。ownership回审发现仅返回body-free
> `SandboxServiceOutcome`无法让duplicate mapper取得完整stored JobReport，而Worker fresh若丢弃local batches也无法形成完整
> report source。本amendment补齐应用层内部carrier，不新增public DTO、logical callable、stored kind或repository read。

### 40.13 Fresh completion的完整非batch header

historical `SandboxFinalizedJobReport`名称失效，不提供alias。九个paged maintenance Job唯一使用：

```rust
/// application完成maintenance JobReport同一UoW提交后返回的fresh非batch source。
///
/// batch chain仍由调用entry唯一拥有；本对象只保存permit/write-source中不可由batch恢复的完整header与commit结果。
#[derive(Debug, Eq, PartialEq)]
pub struct SandboxFinalizedMaintenanceJobReport {
    job_kind: SandboxJobKind,
    original_job_run_id: JobRunId,
    trace_context: SandboxTraceContext,
    selection: SandboxStoredMaintenanceJobSelection,
    initial_page_request: SandboxJobPageRequest,
    report_status: SandboxJobReportStatus,
    outcome: SandboxServiceOutcome,
    started_at: Timestamp,
    report_recorded_at: Timestamp,
}

impl SandboxFinalizedMaintenanceJobReport {
    pub fn job_kind(&self) -> SandboxJobKind;
    pub fn original_job_run_id(&self) -> &JobRunId;
    pub fn trace_context(&self) -> &SandboxTraceContext;
    pub fn selection(&self) -> &SandboxStoredMaintenanceJobSelection;
    pub fn initial_page_request(&self) -> &SandboxJobPageRequest;
    pub fn report_status(&self) -> SandboxJobReportStatus;
    pub fn outcome(&self) -> &SandboxServiceOutcome;
    pub fn started_at(&self) -> &Timestamp;
    pub fn report_recorded_at(&self) -> &Timestamp;
}
```

字段全部来自被finalizer消费的permit与同一`SandboxMaintenanceJobReportWriteSource<'a>`；constructor保持
application-private。它固定校验selection variant/job kind、call-context operation、original run、trace、initial request、五态fresh
status、outcome generic carrier和`started_at <= report_recorded_at`。它不含batches/count/last cursor，不实现serde或clone。

`SandboxMaintenanceJobReportWriteSource<'a>`在commit confirmed后提供唯一module-private消费函数：

```rust
pub(crate) fn into_finalized_report(
    self,
    outcome: SandboxServiceOutcome,
) -> ApplicationResult<SandboxFinalizedMaintenanceJobReport>;
```

该函数只能在staged receipt/source/carrier校验通过且UoW commit confirmed后调用。它移动header并释放`batches` borrow，不遍历或
复制batch；pre-commit error、rollback与StatusUnknown不得调用。

### 40.14 Duplicate完整typed replay carrier

```rust
/// paged maintenance duplicate从同一committed snapshot加载的完整application replay source。
#[derive(Debug, Eq, PartialEq)]
pub struct SandboxReplayedMaintenanceJobReport {
    /// 完整owned typed JobReport；payload必须为Maintenance而非Reconciliation。
    surface: SandboxStoredJobReportSurface,
    /// 由matching generic carrier形成的body-free DuplicateReplayed outcome。
    outcome: SandboxServiceOutcome,
}

impl SandboxReplayedMaintenanceJobReport {
    pub(crate) fn try_from_loaded(
        expected_job_kind: SandboxJobKind,
        surface: SandboxStoredJobReportSurface,
        carrier: SandboxStoredOperationResult,
    ) -> ApplicationResult<Self>;

    pub fn job_kind(&self) -> SandboxJobKind;
    pub fn original_job_run_id(&self) -> &JobRunId;
    pub fn original_report_status(&self) -> SandboxJobReportStatus;
    pub fn surface(&self) -> &SandboxStoredJobReportSurface;
    pub fn outcome(&self) -> &SandboxServiceOutcome;
    pub fn report_recorded_at(&self) -> &Timestamp;
}
```

constructor顺序固定为：expected不是reconciliation -> surface payload variant=`Maintenance` -> surface job kind=expected -> original
status为五态fresh之一 -> `surface.validate_carrier(&carrier)` -> carrier kind/operation/status/time完整相等 ->
`SandboxServiceOutcome::duplicate_replayed(carrier)`。它不读取current truth，不刷新original status/time，不生成新run/ref，也不
clone typed surface。

### 40.15 Paged result与finalizer current signature

```rust
#[derive(Debug)]
pub enum SandboxPagedJobInvocationResult<S> {
    FreshBatch {
        permit: SandboxJobInvocationPermit<S>,
        batch: SandboxMaintenanceBatchOutcome,
    },
    DuplicateReplayed {
        replay: SandboxReplayedMaintenanceJobReport,
    },
}

impl<S> SandboxPagedJobInvocationResult<S> {
    pub fn validate_for_job(&self, expected: SandboxJobKind) -> ApplicationResult<()>;
    pub fn duplicate_replay(&self) -> Option<&SandboxReplayedMaintenanceJobReport>;
}

pub trait SandboxJobService: Send + Sync {
    async fn finalize_job_report<'a>(
        &'a self,
        input: FinalizeSandboxJobReportInput<'a>,
    ) -> ApplicationResult<SandboxFinalizedMaintenanceJobReport>;
}
```

`DuplicateReplayed`只在Start reservation得到exact completed duplicate时返回；application duplicate kernel必须先完成generic
carrier + typed Maintenance surface同snapshot校验，再构造replay carrier。旧`duplicate_outcome()`删除。fresh借用、store stage、
commit顺序不变，只把finalizer返回类型收窄并补全header。

### 40.16 Source completeness audit

| report branch | complete source | second batch chain | current clock after result |
|---|---|---:|---:|
| Jobs fresh | Jobs唯一accumulator + finalized maintenance header | `0` | `0` |
| Worker fresh | Worker唯一local batch vector + finalized maintenance header | `0` | `0` |
| paged duplicate | owned exact `SandboxStoredJobReportSurface` + matching duplicate outcome | `0` | `0` |
| reconciliation | existing dedicated committed/duplicate envelope | `0` | `0` |

```text
current_document = 03-详细设计.md
current_step = Step 7 regression / 7R-06
current_sub_batch = 7R-06C-1C-R complete fresh/replay facade sources activated
artifact = 03_ddd_step_07_service_facades_inputs_outputs.md
artifact_content_status = completed
artifact_review_status = consumed_by_store_and_entry_amendment_complete
current_authority = physical_eof_7r_06c_1c_r_complete_report_source_amendment
fresh_finalizer_output = SandboxFinalizedMaintenanceJobReport
duplicate_paged_output = SandboxReplayedMaintenanceJobReport
complete_report_source_branches = JobsFresh|WorkerFresh|PagedDuplicate|Reconciliation
new_public_dto = 0
new_application_callable = 0
new_stored_kind = 0
new_l1_l2_blocker = 0
next_allowed_action = wait_user_review_before_7r_06c_2
formal_03_writeback = forbidden
implementation = not_started
real_test_execution = not_started
real_evidence_created = no
acceptance_signoff = no
commit_required = no
```
