# L4-observability 03-详细设计 Step 06 - R06.8-B final cross-module gate

## 1. 批次状态与范围

| 项 | 当前结论 |
|---|---|
| 正式文档 | `projects/L4-observability/03-详细设计.md`，本批不修改 |
| 当前 Step | Step 06，逐模块定义对象实现契约 |
| 修复批次 | `R06.8-B` |
| 状态 | `done_design_only_waiting_user_before_Step07` |
| R06.8静态复审 | `pass_design_only`；current runtime/publication/input owner已同步主控、flow与ledger，所有验证仍为`planned/not_run` |
| 本批 current source | 本文件 §§1~21；input assembly 详表唯一见 `03_ddd_step_06_application_input_assembly_r06_8a.md` |
| 本批目标 | 完成 zero-unowned-type、zero-family-substitute、字段/状态/owner、C-11/C-13、single publication Job、Step 07 handoff 和 affected-use 总门禁 |
| 外部上游 blocker | `none newly found` |
| 保留的上游/下游受控项 | `R06.6-F2-H13-UPSTREAM=open_controlled`；`R06-F-AFFECT-UOW-01=open_controlled_downstream`；Step 07~16 affected propagation尚未执行 |
| 下一允许动作 | 停审；用户明确确认后才可进入 `03 / Step 07` affected-only review |
| 禁止动作 | 不自动进入 Step 07~19、不修改正式 `03`、任何 `04` 文件或实现代码，不创建提交/真实证据/运行标识/验收签署 |

R06.8-B 是 Step 06 修复的最终设计门禁，不是整个 `03-详细设计` 完成声明。它关闭 Step 06 内部 definition gap，并把所有仍需修改的冻结 use-site 精确交给后续 Step；后续文件未传播前，项目仍不得按旧 Step 07/08/09/14 接缝实施。

## 2. 必读输入与 authority order

| 顺序 | 输入 | 本批效力 |
|---:|---|---|
| 1 | current 正式 `00/01/02` | Observability 只拥有观测、审计投影、local coordination 与 immutable handoff material；不拥有业务 truth |
| 2 | Step 06 SOP、详细设计书写规范、truth-source/可落码标准 | 每个 stable carrier必须有唯一 owner、schema、factory、状态、来源、错误、去向和禁止替代 |
| 3 | R06.2~R06.6 current 专项 | contracts/domain/policy/record/application 对象与 current owner；早期 family 草稿不恢复 |
| 4 | R06.7-A~E | runtime/entry authority、C-01~C-15、五个 DX、`EntryDisposition=HX`、三个 executable seam |
| 5 | R06.8-A | 48 concrete input、三类有限 assembler、profile-aware admission 与旧 alias 替换 |
| 6 | 冻结 Step 04/05/07~16 与正式 `03` | definition/use 反查和 affected register；不反向覆盖 current Step 06 |
| 7 | L1-governance / L1-artifact Step 06 | final gate粒度参考；不复制相邻域对象或 truth |

冲突处理规则为：current Step 06 独立对象卡 > 本文件 final decision > 冻结后置 use-site > historical formal/草稿。若后置文件仍写 worker publication、裸 context factory、旧 alias、record-before-cursor 或 generic disposition，该位置必须标为 affected，而不是把冲突倒灌回 Step 06。

## 3. R06.8 必答问题

| 问题 | 最终回答 |
|---|---|
| 48 个 service `*Input` 是否有唯一 schema owner？ | 是；`application::inputs`，逐项字段和 factory 见 R06.8-A §§5~11 |
| entry 是否仍需要裸 context factory/canonicalizer？ | 否；三个 least-authority assembler facet 直接返回 concrete input |
| Command/Consumer/Job migration admission是否保留全部 digest candidates？ | 是；write-lane concrete input持有 process-local `RequestDigestCandidates`；Query明确不持有 |
| worker 是否承载 publication cadence/limit或 resident loop？ | 否；C-11只含 inbound registrations；publication只有完整 Operations Job |
| publication 是否具备 idempotency、plan、claim、report、stored result闭环？ | 是；由统一 Operations Job façade编排，publication collaborator只处理已计划且已claim的 exact item |
| C-13 是否可通过多个 accessor任意重组完整 runtime？ | 否；每个独立 binary 的 builder invocation 只产生一个 profile-specific typed runtime，整个 runtime 只能被对应 entry activation 消费一次；无 assignment getter/Clone/reconstruction |
| 三类 assignment 是否遵守最小权限？ | 是；API仅Command/Query，worker仅Consumer，jobs仅九类Operations Job；它们是三种互斥的进程内 projection，不是同一 runtime 内的三个并存字段 |
| dead-letter Job item association是否丢失terminal reason/ref？ | 否；private association固定11 tags，`PublicationDeadLetter`保留exact reason/ref和compatible optional retained failure，canonical tag为`publication_dead_letter` |
| Step 04 `history.rs` 与 logical `domain::records` 是否仍可任选？ | 否；current physical decision是 `domain/src/records/` module tree；`history.rs`为affected historical path，禁止双owner |
| 是否出现新外部上游 blocker？ | 否；H13是既有受控上游冲突，状态不变 |
| Step 06 是否可视为 design-complete？ | 是，限 current中间产物；implementation readiness仍被 Step07/08/09/11/12/13/14/16 affected propagation阻塞 |

## 4. C-11 final correction: `ValidatedWorkerEntryConfig`

### 4.1 Exact schema

```rust
/// Immutable locator-free Consumer registration slice for one worker root.
pub struct ValidatedWorkerEntryConfig {
    inbound_consumers: Vec<ValidatedInboundConsumerRegistration>,
}
```

`outbox_loop_cadence`、`outbox_candidate_limit`及其 constructor参数/accessor从 current schema删除，不保留 deprecated field、optional compatibility field、extension map或同义 wrapper。

| field/member | exact signature / source | invariant |
|---|---|---|
| constructor | `pub(crate) fn from_validated(inbound_consumers: Vec<ValidatedInboundConsumerRegistration>) -> Result<Self, RuntimeAssemblyError>` | canonical operation order、unique、每项有matching private slot；invalid/duplicate/cardinality mismatch失败且不暴露worker assignment |
| registrations | `pub fn inbound_consumers(&self) -> &[ValidatedInboundConsumerRegistration]` | safe metadata only；no locator/private handle |
| membership | `pub fn enables_consumer(&self, operation: ObservationInboundConsumerOperation) -> bool` | exact finite membership；no default |
| count | `pub fn consumer_count(&self) -> usize` | telemetry/totality helper only；不能替代逐slot验证 |

### 4.2 Publication values reassignment

| historical worker value | current owner / derivation | durable freeze point | prohibited substitution |
|---|---|---|---|
| resident publication cadence | raw Job schedule source -> validated schedule binding -> C-02 private registrar capability | not part of plan；schedule只触发完整 request | worker sleep loop、C-11 field、process timer synthesis of actor/key/input |
| publication request `limit` | validated `PublishObservationOutboxJobInput.limit` narrowed by runtime hard/config bound | `JobConfigBinding::CandidateLimit` in `JobExecutionConfigSnapshot` and immutable plan | C-11 limit、current config read on resume、actual completed count |
| event filter/cursor | complete Job request from scheduler/operator | request digest and immutable candidate plan | worker last cursor、process-local checkpoint、relist after duplicate |
| retry/backoff | publication-specific frozen `JobConfigBinding::PublicationRetry` | execution config snapshot | worker loop retry policy、provider text、new token/payload |

The Job schedule registrar may fire only a complete existing C-07 invocation. A schedule with cadence but without a complete actor、`JobRunId`、idempotency key、cursor、limit and filter request capability fails startup/registration；it never asks worker or infra to synthesize missing values.

### 4.3 Lifecycle and cuts

C-11 is constructed at runtime assembly, moved once into the worker assignment, consumed by worker group registration and dropped with that root. It has no state transition、persistence、truth write or publication capability.

Planned cuts: empty/subset/all Consumer sets；canonical ordering；duplicate/unknown rejection；no publication fields/accessors；worker binary/type inventory has no outbox loop；schedule-only publication invocation. Status remains `planned/not_run`.

## 5. Canonical Operations Job façade

### 5.1 Façade convergence

The entry-callable Job façade is renamed to the exact responsibility `ObservationOperationsJobService`. It is the only application façade visible to the jobs assignment and owns all nine Operations Job orchestration methods.

```rust
/// Entry-callable application facade for all nine observation Operations Jobs.
pub trait ObservationOperationsJobService: Send + Sync {
    async fn publish_observation_outbox(
        &self,
        input: PublishObservationOutboxInput,
    ) -> Result<ObservationJobResult, ApplicationError>;

    async fn rebuild_observation_read_models(
        &self,
        input: RebuildObservationReadModelsInput,
    ) -> Result<ObservationJobResult, ApplicationError>;

    async fn rebuild_signal_rollups(
        &self,
        input: RebuildSignalRollupsInput,
    ) -> Result<ObservationJobResult, ApplicationError>;

    async fn refresh_reference_snapshots(
        &self,
        input: RefreshReferenceSnapshotsInput,
    ) -> Result<ObservationJobResult, ApplicationError>;

    async fn scan_observation_gaps(
        &self,
        input: ScanObservationGapsInput,
    ) -> Result<ObservationJobResult, ApplicationError>;

    async fn coordinate_observation_replay(
        &self,
        input: CoordinateObservationReplayInput,
    ) -> Result<ObservationJobResult, ApplicationError>;

    async fn prepare_report_handoff_delivery(
        &self,
        input: PrepareReportHandoffDeliveryInput,
    ) -> Result<ObservationJobResult, ApplicationError>;

    async fn prepare_external_audit_export_delivery(
        &self,
        input: PrepareExternalAuditExportDeliveryInput,
    ) -> Result<ObservationJobResult, ApplicationError>;

    async fn rebuild_peripheral_views(
        &self,
        input: RebuildPeripheralViewsInput,
    ) -> Result<ObservationJobResult, ApplicationError>;
}
```

| old subject | final disposition |
|---|---|
| entry-visible `ObservationMaintenanceService` | affected rename/use migration to `ObservationOperationsJobService`; its eight method semantics remain, no compatibility alias |
| `ObservationPublicationService` trait / worker façade | deleted as entry/application port surface；the name is retained only for the crate-private collaborator object in §6 |
| `ObservationPublicationBatchResult` as fifth façade result | no longer an entry result；retained only as an internal validated batch fold under one Job execution |
| jobs bundle with maintenance + publication handles | replaced by one `operations_jobs` façade handle |

The externally visible application façade count is therefore four: truth write、read、inbound event、operations job. Publication remains a specialized internal capability, not a fifth entry authority.

### 5.2 Job façade dependencies

`ObservationOperationsJobServiceImpl` owns the existing Job orchestration dependencies: UoW、clock、ID generator、idempotency/stored-result、execution/plan/item/claim/report repositories、operation-specific local repositories/resolvers/delivery ports and one crate-private `ObservationPublicationService`. The public trait exposes none of those dependencies.

The concrete implementation must not accept raw config map、scheduler、transport ack、source/business writer、public response assembler、real run/evidence/signoff generator or arbitrary service locator. Publication adapter and outbox repository are reachable only through the internal publication collaborator and exact Job flow.

## 6. `ObservationPublicationService` internal collaborator

### 6.1 Responsibility and visibility

```rust
/// Crate-private collaborator for one already planned and claimed publication item.
pub(crate) struct ObservationPublicationService {
    uow: Arc<dyn ObservationUnitOfWorkManager>,
    clock: Arc<dyn ClockPort>,
    outbox: Arc<dyn ObservationOutboxRepository>,
    publisher: Arc<dyn ObservationEventPublisher>,
    availability: Arc<dyn AdapterAvailabilityProbe>,
}
```

This object is not a public trait, runtime assignment field, worker façade, Job entry, scheduler target or repository owner. It cannot list candidates, create/resume a plan, acquire/release a claim, fold/seal a report, save a stored Job result or complete idempotency.

### 6.2 Claimed item input

```rust
/// Borrowed authority and immutable material for one publication item call.
pub(crate) struct ClaimedObservationPublicationItem<'a> {
    plan: &'a ObservationJobExecutionPlan,
    item: &'a ObservationJobPlanItem,
    claim: &'a ObservationExecutionClaim,
}
```

| field | exact validation before external call | forbidden inference |
|---|---|---|
| `plan` | operation is `PublishObservationOutbox`; plan committed；config snapshot has exact candidate/claim/retry/publication binding support | current config、new candidates、scheduler metadata |
| `item` | belongs to plan；work key is exact outbox key；planned material captures outbox ref、snapshot digest、binding/source guards；state is eligible | relist、current truth rebuild、changing cursor/filter/limit |
| `claim` | Active；exact plan ref、execution ref、global work key、owner、lease and fresh fence match item mutation proof | process lock、worker identity、claim expiry implies rollback |

Factory:

```rust
pub(crate) fn try_borrow(
    plan: &'a ObservationJobExecutionPlan,
    item: &'a ObservationJobPlanItem,
    claim: &'a ObservationExecutionClaim,
) -> Result<ClaimedObservationPublicationItem<'a>, ApplicationError>;
```

It performs only relation checks and returns borrowed authority；it does not load a row, mutate state, renew a claim or call the publisher. The type is non-`Clone`, non-serializable and never persisted.

### 6.3 Exact callable

```rust
impl ObservationPublicationService {
    pub(crate) async fn publish_claimed_item(
        &self,
        input: ClaimedObservationPublicationItem<'_>,
    ) -> Result<ObservationPublicationItemResult, ApplicationError>;
}
```

`ObservationPublicationItemResult` is not a new R06.8 carrier. Its canonical
schema remains R06.6-E `03_ddd_step_06_application_report_error_service.md`
§18.1 with exactly four variants: `Published { outbox_ref, receipt }`,
`Retryable { outbox_ref, failure }`, `Failed { outbox_ref, failure }` and
`DeadLettered { outbox_ref, reason, dead_letter_ref }`. R06.8 only narrows its
construction authority to this claimed-item collaborator and fixes the total
mapping below:

| collaborator result | required durable outbox state after the short UoW | Job item state | `ObservationJobPlanItemOutcome` association | automatic next-call rule |
|---|---|---|---|---|
| `Published { receipt }` after direct call or matching positive probe | `Published` with the exact receipt/snapshot/token relation | `Succeeded` | `None`; affected/progress refs contain the exact local outbox/receipt facts selected by the item mapper | no external call; terminal |
| `Retryable { failure }` | `Failed` with the exact `PublicationFailure`; failure is a known retryable class and frozen `PublicationRetry` still permits an additional attempt | `FailedRetryable` | `PublicationFailure(exact kind)` | only fresh claim/fence, same plan material/snapshot/token and the frozen retry budget may reenter |
| `Failed { failure }` where probe is `Unknown`/`Unsupported`, probe is unavailable, or automatic retry is otherwise unsafe | `Failed`; retain `TransportTimeout` or `OutcomeUnknown` for ambiguity | `Blocked` | `PublicationFailure(exact kind)` | no automatic resend; probe/manual state change required |
| `Failed { failure }` where a formal negative/known failure is non-retryable and no accepted dead-letter transition has occurred | `Failed` | `FailedPermanent` | `PublicationFailure(exact kind)` | terminal for this execution; does not imply external or business rejection |
| `DeadLettered { reason, dead_letter_ref }` | `DeadLettered` with exact reason/ref co-presence and compatible retained failure | `FailedPermanent` | `PublicationDeadLetter { reason, dead_letter_ref, retained_failure }` | terminal; never rebuild or resend payload |

`PublicationFailureKind::OutcomeUnknown` therefore uses the existing
`Failed { failure: OutcomeUnknown }` shape. It is never inserted in
`Retryable`, and no fifth `Unknown` item-result variant is permitted. The
private item-outcome association remains the R06.6-D owner-qualified
`PublicationFailure(PublicationFailureKind)`; no generic publication reason or
second publication state is introduced. Every mapping validates exact
`outbox_ref`, snapshot, token, claim/fence and marker state before item CAS.

For the `Blocked` row, `PublicationFailureKind::{TransportTimeout,
OutcomeUnknown, UnsupportedCapability}` is the owner-qualified block reason:
the association value plus `Blocked` state is the complete tagged meaning.
This is not a new `PublicationBlockReason` object.

R06.8 adds one owner-qualified variant to the existing private R06.6-D
`ObservationJobPlanItemOutcomeAssociation`; it does not add a public object:

```rust
PublicationDeadLetter {
    reason: DeadLetterReason,
    dead_letter_ref: DeadLetterRef,
    retained_failure: Option<PublicationFailureKind>,
}
```

The option is `Some` exactly when the source outbox record retains a compatible
`PublicationFailure`; its value must equal that retained failure kind. It is
`None` only for a valid direct dead-letter transition whose R06.6-B matrix
permits no retained failure. The association must exactly equal the canonical
`DeadLetterReason`/`DeadLetterRef` on the terminal outbox record, and the item
refs must include the outbox and dead-letter facts. Report fold may revalidate
the record but never infer reason from a ref.

This pre-implementation addendum supersedes the ten-tag R06.6-F1 design-only
registry: `job_item_outcome.association` now has an eleventh exact tag
`publication_dead_letter` whose value order is `reason`, `dead_letter_ref`,
then tagged `retained_failure` Option. The three nested values use their
existing owner encoders. No profile is implemented or migrated yet, so this
is the current initial v1 registry rather than an in-place change to persisted
bytes. Step 07/11/13/16 must consume and verify this exact tag; no free-text or
generic failure encoding is allowed.

The existing `ObservationPublicationBatchResult` may be built only by the Job orchestrator as a canonical fold of item results for response assembly. Every planned item appears exactly once；the four sets are canonical、disjoint and cover all scanned items. It cannot be returned directly to jobs entry or worker.

### 6.4 Item sequence

```text
Job orchestrator: load immutable plan/item -> acquire exact global claim/fence
  -> ClaimedObservationPublicationItem::try_borrow
  -> collaborator loads the exact outbox record + immutable payload snapshot
  -> validate planned ref/digest/binding/schema and derive stable publication token
  -> outside local UoW: publish or probe exact token/snapshot
  -> short UoW: revalidate active claim/fence + outbox CAS
  -> mark Published / Failed / DeadLettered or preserve unknown
  -> return exact item result
Job orchestrator: item CAS -> report fold -> claim release -> seal report
  -> save Job stored result -> complete reservation -> public response
```

Rules:

1. The external call always receives the stored immutable payload snapshot and its stable token. It never receives current truth or a rebuilt DTO.
2. Unknown external outcome or finalize ambiguity probes the same token first. Unsupported/unknown probe never becomes automatic resend.
3. Outbox marker mutation is not an H1~H13 primary and never calls the record-UoW assembler or allocates an observation/reference cursor.
4. Claim/fence protects local item/marker writes only；it does not prove external exactly-once or external cancellation.
5. Publication failure cannot roll back the original observation truth. It becomes an exact item/report classification under the current Job execution.
6. Any stale claim、snapshot mismatch、binding mismatch、corrupt digest or persisted profile error fails closed before another external call.

## 7. Complete `PublishObservationOutbox` Job lifecycle

| phase | exact owner/input | output / durable action | forbidden shortcut |
|---|---|---|---|
| request assembly | `ObservationJobInputAssembler::publish_observation_outbox` | concrete input + candidates/context/`JobRunId` | worker cadence/limit、raw hash、generated key/run |
| admission | Operations Job façade + atomic idempotency repository | Acquired/Replay/Conflict/InFlight | direct outbox list before reserve；profile-current-only compare |
| start materialization | validated cursor/limit/filter + current compatible outbox snapshots + runtime bounds | execution ref、plan ref、config snapshot、canonical items、Draft report in one start relation | mutable candidate list、current-config resume、plan without report |
| duplicate | original reservation/result/report | exact stored Job response/report replay | relist、republish、new report/run/plan |
| item execution | immutable item + exact global claim/fence + internal collaborator | outbox CAS + item outcome under protected short UoW | worker loop、unclaimed batch、current payload rebuild |
| report fold | all current terminal item outcomes | lossless Draft fold and terminal seal | report invents item/reason；partial set marked complete |
| completion | sealed report + stored result + reservation | `ObservationJobResult` and exact public response | batch result returned as façade result、reservation completed before result |

The request `limit` is a maximum candidate selector, not a completion count. Fewer compatible candidates is valid；more candidates are excluded from this immutable plan and require a separately supplied future Job request/key. A retry/resume executes only the original planned items.

## 8. C-13 final correction: profile-specific one-shot runtime

### 8.1 Topology correction and authority boundary

Step 04/05 already fix `observability-api`、`observability-worker` and each
operations Job action as independent binary-oriented entry crates. They may run
in different processes and must not depend on one another. Therefore a single
process-local `BuiltObservabilityRuntime` cannot own all three entry assignments
or activate all three roots in one transaction.

The current C-13 contract is instead:

1. API、worker and jobs binaries all invoke the same validated loader、owner
   registry and builder stage recipe, but each invocation selects exactly one
   entry build method.
2. One builder invocation constructs every field required by that selected
   entry from one `ValidatedObservabilityConfig` and one `ConfigBindingRef`, then
   returns one of three finite typed built-runtime wrappers or one C-15 error.
3. The returned runtime contains exactly one least-authority assignment. It has
   no other profile's slice、service、assembler or registrar and cannot be split
   into multiple assignments.
4. Stage 13 is process-local. API route activation is atomic only for the API
   root；Consumer registration is atomic only for the worker group；Job schedule
   registration is atomic only for the jobs group.
5. Reusing the same validated config revision across processes provides a
   common recipe and body-free config identity. It does not prove simultaneous
   startup、identical private adapter instances or cross-process atomic
   activation.

`RuntimeProfileClass::{LocalTest, IntegrationLike, RuntimeLike}` remains the
adapter/config compatibility class and is not reused as an entry selector. No
new public profile enum is introduced. The three explicit builder methods are
the only entry selection surface；a binary name、environment guess or raw config
field cannot silently change the selected entry.

The former §§8.1~8.4 design that placed API/worker/jobs assignments in one
`ObservationEntryAssignments` and required `ObservationAssemblySeal`、
`ObservationActivationPermit` and
`ObservationEntryActivationTransaction` is `historical_material_superseded`.
Those types have no current owner or implementation handoff and must not be
created in Step 07/14.

### 8.2 Least-authority assignment objects

```rust
/// Complete one-shot API projection from one builder invocation.
pub struct ObservationApiAssignment {
    api_entry: ValidatedApiEntryConfig,
    truth_write: Arc<dyn ObservationTruthWriteService>,
    read: Arc<dyn ObservationReadService>,
    inputs: Arc<dyn ObservationApiInputAssembler>,
}

/// Complete one-shot inbound Consumer projection from one builder invocation.
pub struct ObservationWorkerAssignment {
    worker_entry: ValidatedWorkerEntryConfig,
    inbound: Arc<dyn ObservationInboundEventService>,
    inputs: Arc<dyn ObservationInboundInputAssembler>,
    registrar: Arc<dyn InboundConsumerRegistrar>,
}

/// Complete one-shot Operations Job projection from one builder invocation.
pub struct ObservationJobsAssignment {
    jobs_entry: ValidatedJobsEntryConfig,
    operations_jobs: Arc<dyn ObservationOperationsJobService>,
    inputs: Arc<dyn ObservationJobInputAssembler>,
    registrar: Arc<dyn JobScheduleRegistrar>,
}
```

| assignment | allowed exact fields | explicit absences |
|---|---|---|
| API | validated API safe slice；truth-write/read façades；30-method API input assembler | inbound、Operations Job/publication、registrars、repository/UoW/resolver/adapter/raw config/context factory/canonicalizer |
| worker | Consumer-only C-11；inbound façade；9-method inbound assembler；C-06 registrar | truth-write/read、Operations Job/publication、Job registrar、outbox loop/cadence/limit、repository/UoW/resolver/adapter |
| jobs | C-12；single 9-method Operations Job façade；9-method Job assembler；C-10 registrar | Command/Query/inbound façades、direct publication collaborator、repository/publisher/delivery/raw config/context factory/canonicalizer |

Each assignment has private fields and one `pub(crate)` all-fields constructor
owned by `infra::runtime_builder`. The constructor is called only after the
selected profile's stage-11 totality checks succeed. None implements `Clone`,
`Default`, serde, `Any` or downcast；none has a public constructor、getter、
`into_parts`、field replacement or cross-assignment conversion. An assignment
is not persisted, logged as a value or treated as runtime/run/evidence/signoff
identity.

### 8.3 Three finite built-runtime wrappers and activation seams

```rust
/// Complete wiring for exactly one API process projection.
pub struct BuiltApiObservabilityRuntime {
    assignment: ObservationApiAssignment,
}

/// Complete wiring for exactly one worker process projection.
pub struct BuiltWorkerObservabilityRuntime {
    assignment: ObservationWorkerAssignment,
}

/// Complete wiring for exactly one jobs process projection.
pub struct BuiltJobsObservabilityRuntime {
    assignment: ObservationJobsAssignment,
}

impl BuiltApiObservabilityRuntime {
    pub fn activate_with<T>(
        self,
        activation: T,
    ) -> Result<T::ActivatedRoot, RuntimeAssemblyError>
    where
        T: ObservationApiRootActivation;
}

impl BuiltWorkerObservabilityRuntime {
    pub fn activate_with<T>(
        self,
        activation: T,
    ) -> Result<T::ActivatedRoot, RuntimeAssemblyError>
    where
        T: ObservationWorkerRootActivation;
}

impl BuiltJobsObservabilityRuntime {
    pub fn activate_with<T>(
        self,
        activation: T,
    ) -> Result<T::ActivatedRoot, RuntimeAssemblyError>
    where
        T: ObservationJobsRootActivation;
}

pub trait ObservationApiRootActivation {
    type ActivatedRoot;

    fn activate(
        self,
        api_entry: ValidatedApiEntryConfig,
        truth_write: Arc<dyn ObservationTruthWriteService>,
        read: Arc<dyn ObservationReadService>,
        inputs: Arc<dyn ObservationApiInputAssembler>,
    ) -> Result<Self::ActivatedRoot, RuntimeAssemblyError>;
}

pub trait ObservationWorkerRootActivation {
    type ActivatedRoot;

    fn activate(
        self,
        worker_entry: ValidatedWorkerEntryConfig,
        inbound: Arc<dyn ObservationInboundEventService>,
        inputs: Arc<dyn ObservationInboundInputAssembler>,
        registrar: Arc<dyn InboundConsumerRegistrar>,
    ) -> Result<Self::ActivatedRoot, RuntimeAssemblyError>;
}

pub trait ObservationJobsRootActivation {
    type ActivatedRoot;

    fn activate(
        self,
        jobs_entry: ValidatedJobsEntryConfig,
        operations_jobs: Arc<dyn ObservationOperationsJobService>,
        inputs: Arc<dyn ObservationJobInputAssembler>,
        registrar: Arc<dyn JobScheduleRegistrar>,
    ) -> Result<Self::ActivatedRoot, RuntimeAssemblyError>;
}
```

There is no generic `BuiltObservabilityRuntime<A>` family and no public runtime
constructor. Infra owns one crate-private all-fields constructor for each
listed wrapper, and no constructor accepts an already built assignment from an
entry. Each wrapper's only public operation is its matching consuming
`activate_with`. Infra destructures the private assignment and invokes the
matching trait method with all fields in one call；it never returns an
assignment、tuple or individual getter.

`ObservationApiRootActivation`、`ObservationWorkerRootActivation` and
`ObservationJobsRootActivation` are three exact infra technical seams for Step
07, not application business ports or canonical objects. The matching entry
crate implements only its own trait for an entry-local activation value. Each
receives, in one consuming call, exactly the fields listed in §8.2 for its
family and returns one process-local activated root. There is no generic
activation trait、map input、default implementation or cross-family method.
Worker/jobs activation invokes only its matching all-or-nothing registrar；API
activation only prepares and publishes the complete finite route set.

The runtime and activation value are both consumed, so supported safe code
cannot activate twice. Because there is no aggregate assignment type or
cross-family constructor, assignments from separate builder invocations cannot
be recombined into a supported runtime or used to claim cross-process atomicity.

Removed C-13 surface:

- all `truth_write_service()` / `read_service()` / `inbound_event_service()` / `maintenance_service()` / `publication_service()` accessors;
- `operation_context_factory()` and `availability_probe()` accessors;
- independent safe-slice and registrar accessors;
- `ObservationEntryAssignments`、`ObservationAssemblySeal`、`ObservationActivationPermit` and aggregate `ObservationEntryActivationTransaction`;
- public assignment extraction、generic runtime family/constructor、`Clone`, field replacement, `with_*`, downcast, service locator or reconstruction constructor.

### 8.4 Builder methods, same-invocation proof and stage 13

The builder selection surface is explicit and finite:

```rust
pub trait ObservabilityRuntimeBuilder {
    async fn build_api(
        &self,
        config: ValidatedObservabilityConfig,
    ) -> Result<BuiltApiObservabilityRuntime, RuntimeAssemblyError>;

    async fn build_worker(
        &self,
        config: ValidatedObservabilityConfig,
    ) -> Result<BuiltWorkerObservabilityRuntime, RuntimeAssemblyError>;

    async fn build_jobs(
        &self,
        config: ValidatedObservabilityConfig,
    ) -> Result<BuiltJobsObservabilityRuntime, RuntimeAssemblyError>;
}
```

All three methods execute the common stages 5~10 with the same owner rules.
Stages 8~11 construct and validate only the external/entry capabilities required
by the selected method；they must not silently substitute another entry or
weaken a selected profile's required capability. Stage 11 derives exactly one
assignment and checks every assignment field, safe item and private slot against
the invocation's one `ConfigBindingRef`. Stage 12 moves that assignment into the
typed runtime. No field is independently supplied by a caller, so same-invocation
origin is structural and needs no seal, random ID or pointer-equality token.

Stage 13 then follows one of three local paths:

| selected build | stage-13 atomic boundary | success output | failure cleanup |
|---|---|---|---|
| `build_api` | complete enabled Command/Query route table | one API root owning all published routes | publish no route；drop all prepared route state |
| `build_worker` | complete nine-slot/subset Consumer catalog plus matching C-06 registrar group | one worker root owning the opaque registered Consumer set | registrar revoke/join all prepared callbacks；expose no callback/root |
| `build_jobs` | complete nine-slot Job catalog plus matching C-10 schedule registrar group and one-shot runners | one jobs root owning opaque scheduled set and runners | registrar revoke/join all prepared schedules；expose no callback/root |

The three rows are independent process transactions. An API activation failure
does not roll back an already active worker process；a worker failure does not
claim that jobs activation failed. Deployment-level coordinated rollout/drain
belongs to configuration/deployment policy and cannot be represented as an
observation truth、C-13 durable state or evidence assertion.

This discipline does not require a canonical `EntryActivationState` object. Prepared/armed framework state remains private to registrars；if a framework wrapper needs fields beyond the exact assignment or must persist/serialize state, Step 06 must be reopened.

### 8.5 Error behavior

| failure | exact result | zero-partial guarantee |
|---|---|---|
| missing selected service/assembler/slice/registrar or private-slot relation before C-13 | existing C-15 `RequiredCapabilityMissing` / `EntryBindingIncomplete` | no typed runtime or assignment escapes |
| wrong builder method inferred from binary/config instead of explicit invocation | static/startup contract violation | no fallback to another assignment profile |
| activation attempts assignment extraction/reconstruction | compile-fail/static contract violation；no runtime fallback branch | no supported safe surface exposes assignment parts |
| worker/jobs group registration failure | matching startup registration error with safe C-14 issue ref if available | all selected-profile prepared handles revoked；no root/callback exposed |
| API route preparation failure | existing startup invalid/binding error | no API route/root exposed；does not make a claim about other processes |
| later application call failure | existing `ApplicationError`/protocol mapping | does not rebuild or partially replace runtime |

No error contains raw config、locator、credential、frame、provider body、service object or private handle. No new run/evidence/acceptance identity is introduced.

## 9. File-owner decision

R06.8 makes the following physical layout decision for later Step 04 propagation. This section is the current owner decision；the frozen Step 04 tree remains an affected use until its own review.

```text
crates/domain/src/
  records/
    mod.rs
    intake.rs
    correlation.rs
    audit.rs
    handoff.rs
    retention.rs
    no_write.rs
    read_access.rs
    gap.rs
    peripheral.rs
    reference.rs
    maintenance.rs
    gap_scan.rs
    replay.rs

crates/application/src/
  context.rs
  digest.rs
  inputs.rs
  input_assembly.rs
  idempotency.rs
  stored_result.rs
  outbox.rs
  external_effects.rs
  jobs.rs
  report.rs
  record_assembly.rs
  services.rs
  ports.rs
  unit_of_work.rs
  errors.rs
```

| decision | consequence |
|---|---|
| logical `domain::records` maps to physical `domain/src/records/` | frozen `history.rs` is removed during Step 04 affected review；never keep `history` re-export plus `records` definition |
| H1~H13 family files mirror current logical submodules | shared metadata remains in `records/mod.rs`；record refs remain in `contracts::refs` |
| `record_assembly.rs` is application-private helper module | it does not create `application::records` owner；domain factories remain in `domain::records` |
| `inputs.rs` owns 48 concrete input structs | protocol DTOs remain in contracts；no input schema duplication in services/entry |
| `input_assembly.rs` owns three assembler traits + implementation | canonicalizer/context helper remain private modules；entry sees facets only |
| `jobs.rs` owns plan/item/claim/config coordination | publication collaborator is private under application service composition, not worker |

This resolves `R06-F2-AFFECT-04-FILE-OWNER` at the Step 06 decision level. Actual Step 04 text propagation remains pending and cannot be claimed done in this batch.

## 10. Final owner inventory by module

| module | current Step 06 owner groups | no-owner / duplicate-owner result |
|---|---|---|
| `contracts` | typed refs/metadata/scopes/sets/surfaces/views and public protocol-independent carriers from R06.2~R06.4 | zero unowned current type；historical aliases remain HX only |
| `domain` | truth/state/transition/decision objects；18 policies；H1~H13 records under `domain::records` | no application/infra truth duplicate；H7 remains reserved/no current writer |
| `application::context/idempotency` | finite operation namespace、event identity、context、scope/reservation/outcome | Query excluded from writer lane；no entry-local context owner |
| `application::digest` | profile support、12-kind sealed material registry、canonicalizer/candidates | no raw/generic hash surface |
| `application::inputs/input_assembly` | 48 concrete inputs、three finite assembler facets、one implementation | R06.8-A closes prior schema owner gap |
| `application::stored_result/outbox/external_effects` | immutable replay、outbox snapshot/state、stable intent/token/result | no current-truth payload rebuild or external truth owner |
| `application::jobs/report` | execution/plan/item/config/claim/fence/report and unified Operations Job façade | `JobRunId` only correlation；no real run identity |
| `application::record_assembly` | process-local three-phase plan/materialization helper | no second record schema/repository owner |
| `infra::runtime_builder` | B availability construction；C-01~C-15 technical carriers/registrars/assembly | C-11/C-13 corrected；no publication business façade |
| `api` | static exact handler/root details only | five historical state candidates remain DX；no canonical result state |
| `worker` | exact Consumer handlers + private root wrapper | no outbox/projection loop、publication service、generic disposition |
| `jobs` | exact nine Job handlers + private root wrapper | no plan/report/result mint；no direct publisher/delivery/repository |

No current stable type discovered by R06.2~R06.8 lacks an owner. Explicit `DX` items have named later owners and are not used as current schema；`HX` items have current replacements or deletion proof；remaining controlled items concern upstream semantic conflict or frozen use propagation, not missing Step 06 type ownership.

## 11. Zero-family-substitute audit

| prohibited family substitute | final result | canonical replacement |
|---|---|---|
| family table standing in for independent object cards | absent from current authority | R06.2~R06.8 independent cards/registries |
| generic `EntryDisposition` or API/worker/jobs aliases | `HX`, absent | typed public response、C-05、C-08/C-09、stored/report owners |
| generic service input envelope or `assemble<T>` | absent | 48 concrete inputs + 48 named methods |
| public/free-text operation route | absent | four finite operation enums + total maps |
| raw/generic digest/hash helper | absent | sealed material registry + private canonicalizer |
| generic record/history row | absent | H1~H13 exact records under `domain::records` |
| generic Job work-key string/hash | absent | nine-variant typed global work key |
| generic external effect result/token | absent | four phase-specific tokens/results/intent relation |
| generic runtime service locator/full-authority root | absent | three finite profile-specific built runtimes, each owning one one-shot assignment |
| resident worker publication/projection loop | absent | typed Operations Jobs only |
| `ReferenceSnapshotRef` historical alias | no current input/digest use | `ReferenceSnapshotStateRef` |
| `PeripheralConsumerScopeRef` historical wrapper | no current input/work-key use | structured consumer + projection scope |

## 12. Field-source final audit

| high-risk field | unique current source | consumers | forbidden alternative |
|---|---|---|---|
| operation | exact static public route/body or C-03/C-07 variant map | material/context/input/service | free text、payload inference、config remap |
| actor | authenticated API metadata、C-03 actor-policy projection or complete Job request | context/idempotency/record metadata | peer/pod/process/display/credential |
| trace | validated optional metadata/envelope/Job request | context/record/outbox correlation | span parent fabrication、actor/causation substitute |
| idempotency key | trusted Command/Consumer/Job metadata | scope/reservation | attempt、cursor、run、time、source event alone |
| request digest | application canonicalizer over exact typed material | context/new row/stored relation | supplied value adoption、raw JSON/debug/body hash |
| candidates | one application canonicalizer call over all readable profiles | writer-lane atomic admission | only current profile、persist all candidates、Query use |
| source event identity | fixed Consumer + authenticated producer + source event ref | Consumer context/secondary index | message ID、offset、dedup key alias、payload ref |
| requested/occurred time | trusted boundary metadata | input/audit context only as defined | source ordering、source version、claim lease proof |
| `JobRunId` | complete public Job metadata | input/plan/report correlation | local execution ref、external real run ID、generated fake value |
| local Job execution/plan/report refs | application ID generator after Acquired | durable Job lineage | `JobRunId` conversion、key/time/hash |
| candidate limit | validated Job request narrowed by typed runtime/hard bound | config snapshot/plan | worker config、completed count、resume current config |
| publication payload | immutable outbox payload snapshot | stable-token publisher call | current truth/event DTO rebuild、provider fallback |
| record cursor | exactly one UoW allocator selected by accepted primary footprint | records/outbox/stale/result followers | record-first inference、second namespace、clone/reload |
| evidence/handoff refs | current typed body-free owner or existing immutable snapshot | linkage/handoff/export input | real evidence alias、body、signoff/verdict mint |

## 13. State and lifecycle final audit

| state/lifecycle subject | unique owner | allowed writer | forbidden conflation |
|---|---|---|---|
| domain truth transitions | owning domain object/policy | application accepted flow under UoW | entry/config/adapter/public DTO |
| H1~H13 append-only records | `domain::records` factories | F2 application assembler dispatch | generic history state、report/item state |
| idempotency durable state | reservation owner: `Reserved -> Completed` | atomic repository/application service | Replay/Conflict/InFlight as durable states |
| outbox publication state | `ObservationOutboxRecord` | internal claimed publication collaborator under Job | worker loop state、Job report state、source truth |
| Job item state/outcome | `ObservationJobPlanItem` | exact claim/fence + CAS | claim state、public outcome、report setter |
| execution claim state | `ObservationExecutionClaim` | claim authority/repository | item success、external cancellation、exactly-once proof |
| Job report state | `ObservationJobReportDraft` / `JobReportState` | lossless item fold and seal | public outcome、real run/signoff、generic disposition |
| public outcomes/surfaces | Step 08 typed protocol response | exact response assembler from current application result | domain transition owner、transport action owner |
| Consumer transport action | C-05 | exact per-Consumer mapper after receipt/error classification | receipt outcome default、durable state |
| runtime assembly lifecycle | C-13 selected-profile one-shot activation + matching private registrar/route transaction | runtime builder + current process composition root | cross-process transaction、durable state、availability truth、partial root |

No new canonical `EntryActivationState`、`PublisherLoopState` or generic disposition is required. Framework-private transient state is allowed only when it is fully determined by a least-authority assignment, unobservable as schema/truth, nonpersistent and unable to retain prior result/input/identity after the call.

## 14. Truth and redaction boundary audit

Every accepted write remains limited to observation-owned receipt、safety/correlation/signal projection、audit/evidence linkage、handoff preparation、retention/no-write/gap/reference/maintenance coordination、append-only local record、stored result、immutable outbox snapshot and derived read model. The following remain prohibited across all assembler、service、runtime and entry objects:

- raw log/metric/trace、source/event/evidence/runtime/archive/report body persistence or hashing as a surrogate;
- Governance、Artifact、Identity、Runtime、Sandbox、Archive、Report、external audit/GRC/dashboard/alert truth write;
- final verdict、real evidence alias、acceptance signoff or external real run identity generation;
- using trace/correlation/digest/availability/report as authorization or business truth;
- publication/delivery failure rolling back original observation truth;
- query, visibility, diagnostic or stale read triggering hidden refresh/repair/mutation.

Redaction remains structural: forbidden bodies have no current field/encoder/port, safe references/summaries retain typed owner discrimination, and errors/debug/metrics cannot include canonical bytes、digest values、keys、locators、credentials or provider bodies.

## 15. Step 07 exact handoff

Step 07 may begin only after explicit user confirmation. Its affected review must process the following order and cannot mark the Step complete while a row remains old-current.

| order | Step 07 subject | required current definition/use | forbidden retained shape |
|---:|---|---|---|
| 1 | application input assembly traits | define the three exact facets with all 48 named methods and concrete outputs | naked context factory port、generic assembler/hash/material method |
| 2 | service façade traits | four entry façades；`ObservationOperationsJobService` has all nine Job methods | maintenance/publication dual façade、worker publication method |
| 3 | input/service signatures | every method consumes exact R06.8-A input by value | first definition of input in Step 07/08、generic input envelope |
| 4 | idempotency repository | atomic reserve receives scope、optional event identity and full candidates | `reserve_or_load(context)` with one digest、secondary insert after row creation |
| 5 | UoW/cursor contract | primary stage -> derive one namespace -> assign one cursor -> H11/records/followers -> dispatch | record-before-cursor、two allocators、consuming save/clone/reload |
| 6 | Job identity/plan/claim/report ports | current D-2~D-6 exact refs、global work key、claim tuple、plan/report relation | `JobExecutionRef`、naked fence、plan-local uniqueness |
| 7 | publication ports | publisher accepts stable token + immutable snapshot；repository methods support exact CAS/probe relation | candidate listing by worker、current payload rebuild、raw adapter result |
| 8 | entry runtime/activation seams | three finite built-runtime wrappers、three exact assignment field sets、three matching consuming activation traits | aggregate three-assignment runtime、generic runtime family、public assignment getter/full root、cross-process activation claim |
| 9 | registrar lifecycle | complete finite catalogs、all-or-nothing registration/revoke | callback exposure before totality、schedule request synthesis |
| 10 | error owners | existing `ApplicationError`/C-15/entry errors mapped without duplicate definitions | raw provider/infra error、generic retry bool/message parsing |

Step 07 must reread R06.8-A §§4~14、this file §§4~8 and the original owner cards for every affected signature before writing. It must not infer trait syntax from frozen Step 07 snippets that this register supersedes.

## 16. Downstream affected register

| affected ID | file/Step | required repair | current state after R06.8 |
|---|---|---|---|
| `R06.8-AFFECT-04-LAYOUT` | Step 04 | replace `history.rs` with exact records tree；add application context/digest/input/assembly/job/record modules | `pending_affected_review` |
| `R06.8-AFFECT-05-ENTRY` | Step 05 | worker responsibility removes outbox loop；jobs owns all nine operations；four façade boundary | `pending_affected_review` |
| `R06.8-AFFECT-07-INPUT` | Step 07 | 48-method assembler facets and no naked context factory | `pending_next_step` |
| `R06.8-AFFECT-07-JOB` | Step 07 | one unified Job façade；publication collaborator private；current idempotency/UoW/claim contracts | `pending_next_step` |
| `R06.8-AFFECT-08-PROTOCOL` | Step 08 | per-protocol maps；`JobRunId`、`ReferenceSnapshotStateRef`、structured peripheral targets；exact response assemblers | `pending_later_step` |
| `R06.8-AFFECT-09-FLOW` | Step 09 | each of 48 flows uses exact assembler；nine complete Jobs；per-Consumer action matrix；F2 ordering | `pending_later_step` |
| `R06.8-AFFECT-10-STATE` | Step 10 | owner-qualified states only；remove loop/generic disposition/current old Job aliases | `pending_later_step` |
| `R06.8-AFFECT-11-PERSIST` | Step 11 | current refs/schema、atomic candidates、one cursor order、claim/report/publish CAS | `pending_later_step` |
| `R06.8-AFFECT-12-ERROR` | Step 12 | total recovery for assembly/digest/claim/publication unknown；no generic retry/default | `pending_later_step` |
| `R06.8-AFFECT-13-CONCURRENCY` | Step 13 | profile-aware admission、secondary index atomicity、global claims、stable-token probe, no worker loop | `pending_later_step` |
| `R06.8-AFFECT-14-RUNTIME` | Step 14 | C-11 Consumer-only；C-13 three finite profile-specific built runtimes and process-local activation；one assembler implementation；publication schedule/request/config derivation | `pending_later_step` |
| `R06.8-AFFECT-15-OBS` | Step 15 | safe operation/phase refs only；no digest/key/body/private binding/runtime proof leakage | `pending_later_step` |
| `R06.8-AFFECT-16-TEST` | Step 16 | add R06.8 planned cuts and compile/static no-surface gates | `pending_later_step` |
| `R06.8-AFFECT-17-HANDOFF` | Step 17 | implementation handoff references current owners/files and blocks historical shapes | `pending_later_step` |
| `R06.8-AFFECT-19-FORMAL` | Step 19/formal `03` | assemble only after all affected Steps；exclude DX/HX/old aliases/worker publication | `frozen` |

No row authorizes bulk modification now. Each later Step must read its SOP/书写规范 and upstream current documents, write its own intermediate artifact, then stop for user review.

## 17. Blocker and resolution ledger

| item | state before R06.8 | state after R06.8 | remaining scope |
|---|---|---|---|
| `R06-F1-AFFECT-07-01` | open controlled affected | `resolved_at_step06_definition_in_R06.8-A` | Step 07/08/09/13/14 use propagation pending |
| `R06.7-D-ENTRY-ASSIGNMENT-SEAM` | open controlled affected | `resolved_at_step06_definition_in_R06.8-B` | Step 07/14 three finite runtime/activation signatures and independent-process topology propagation pending |
| `R06.7-D-PUBLICATION-JOB-SEAM` | open controlled internal | `resolved_at_step06_definition_in_R06.8-B` | Step 05/07/08/09/12/13/14 propagation pending |
| `R06-F2-AFFECT-04-FILE-OWNER` | open controlled | `resolved_at_step06_decision_in_R06.8-B` | Step 04 physical tree text pending |
| `03-RPR-S06-GRANULARITY` | open | `resolved_in_R06.8_design_only` | no Step 06 definition gap；whole-document repair continues |
| `R06.6-F2-H13-UPSTREAM` | open controlled | unchanged | formal `03` assembly前裁定 scope-only record absence/new lifecycle record |
| `R06-F-AFFECT-UOW-01` | open controlled downstream | unchanged | Step 07/08/09/11/13/16 propagation |
| `03-RPR-S08-PER-PROTOCOL` | open controlled | unchanged | Step 08逐协议重建 |
| `03-RPR-S09-PER-FLOW` | open | unchanged | Step 09逐flow重建 |
| newly found external upstream blocker | none | none | none |

Resolving a Step 06 definition seam does not mean its frozen use-sites are repaired. Implementation remains blocked until the relevant affected rows are current and consistent.

## 18. Planned verification gates

| ID | boundary | planned assertion | status |
|---|---|---|---|
| `TC-OBS-R068B-C11-001` | worker config type surface | only inbound registrations；no cadence/limit/publication getter | `planned/not_run` |
| `TC-OBS-R068B-PUB-001` | binary/file/type inventory | no resident worker publisher loop；only C-07 Job entry | `planned/not_run` |
| `TC-OBS-R068B-PUB-002` | duplicate Job | exact original plan/report/result replay；zero list/publish | `planned/not_run` |
| `TC-OBS-R068B-PUB-003` | item authority | external call requires exact plan/item/active claim/fence/snapshot/token relation | `planned/not_run` |
| `TC-OBS-R068B-PUB-004` | unknown effect | probe same stable token before any resend；unsupported remains manual | `planned/not_run` |
| `TC-OBS-R068B-PUB-005` | truth boundary | publication failure changes only local outbox/item/report state | `planned/not_run` |
| `TC-OBS-R068B-PUB-006` | terminal association | 11-tag registry包含exact `publication_dead_letter`；reason/ref/retained failure与terminal outbox record一致，illegal state/tag pair拒绝 | `planned/not_run` |
| `TC-OBS-R068B-C13-001` | compile-time surface | exact three built-runtime wrappers and three activation traits；no generic runtime、assignment getter/Clone/downcast/replace | `planned/not_run` |
| `TC-OBS-R068B-C13-002` | authority | each selected profile contains exactly its §8.2 fields and no other profile's fields/capabilities | `planned/not_run` |
| `TC-OBS-R068B-C13-003` | activation failure injection | each profile-local preparation/registration failure exposes zero route/callback/root in that process | `planned/not_run` |
| `TC-OBS-R068B-C13-004` | process topology | API/worker/jobs can build/activate independently from the same validated recipe；no API requires worker/jobs assignment and no cross-process atomicity assertion exists | `planned/not_run` |
| `TC-OBS-R068B-OWN-001` | owner registry | all current Step 06 types exactly one owner；all DX/HX absent from current schema | `planned/not_run` |
| `TC-OBS-R068B-FAM-001` | substitute scan | no generic input/disposition/record/work-key/service-locator family | `planned/not_run` |
| `TC-OBS-R068B-LAYOUT-001` | module tree | no simultaneous `history` and `records` definition modules | `planned/not_run` |
| `TC-OBS-R068B-TRUTH-001` | source-write spy set | zero source/business/external-truth writes across all 48 inputs and publication | `planned/not_run` |

All gates are design-planned. No implementation repository was changed；no command output is test evidence；no test, runtime, integration, acceptance, commit, run ID, evidence alias or signoff is claimed.

## 19. Step 06 completion gate

| gate | result | basis |
|---|---|---|
| every current stable object has one owner | `pass_design_only` | R06.2~R06.8 owner cards + §10 |
| every application service input has exact schema/factory | `pass_design_only` | R06.8-A 48-row registry |
| exact field source and current typed aliases | `pass_design_only` | R06.8-A §§5~10 + this §12 |
| state subject/writer/transition separation | `pass_design_only` | prior cards + §13 |
| single publication authority/lifecycle | `pass_design_only` | §§4~7 |
| publication dead-letter association/encoding | `pass_design_only` | §6.3；11-tag registry与exact terminal relation |
| least-authority one-shot runtime assignment | `pass_design_only` | §8 |
| physical/logical owner conflict decided | `pass_design_only` | §9；actual Step 04 propagation pending |
| zero generic family substitute | `pass_design_only` | §11 |
| Step 07 exact handoff complete | `pass_design_only` | §15 |
| affected downstream locations enumerated | `pass_design_only` | §16 |
| external blocker handling truthful | `pass` | none new；H13/UoW retained |
| tests/evidence truthfulness | `pass` | every test planned/not_run；no fabricated artifacts |
| formal `03` / later Step untouched | `pass_scope` | current batch only adds Step 06 intermediate artifacts/control sync |

Step 06 is now `done_design_only_waiting_user_before_Step07`. This result means the Step 06 definition set is sufficiently precise for the next affected review；it does not mean frozen Step 07~19 or formal `03` are current, and it does not grant implementation permission.

## 20. Formal assembly handoff

When Step 19 is eventually reached, formal `03` must preserve at least:

- the 48-operation finite input assembly registry and family-specific digest/admission rules;
- four entry-callable application façades, with all nine Operations Jobs under one Job service;
- internal-only claimed publication collaborator and full plan/claim/report/stored-result lifecycle;
- 11-tag Job item association registry, including exact `publication_dead_letter` reason/ref/retained-failure encoding;
- C-11 Consumer-only schema and C-13 three finite profile-specific one-shot runtime schemas, with no cross-process joint activation;
- `domain::records` physical/logical owner and application input/digest/context/record assembly modules;
- no business truth ownership、raw body hash/persistence、real run/evidence/signoff fabrication or external-truth write;
- every still-open controlled blocker and all planned/not-run verification truthfulness.

Formal assembly must not copy the historical worker publication façade、naked context factory、old aliases、generic disposition、record-before-cursor sequence or old file tree simply because they remain present in frozen files during the repair chain.

## 21. Stop-review

Current completion point is `03-详细设计 / Step 06 / R06.8-B_done_design_only_waiting_user_before_Step07`.

Files modified by this R06.8 work are limited to R06.8 intermediate artifacts plus the Step 06 master/flow/project ledger synchronization performed after this file. No formal document, Step 07~19 artifact, `04` document or implementation code is modified.

No new upstream blocker was found. The next permitted reading set, only after explicit user confirmation, is:

1. `standards/document/详细设计讨论流程_SOP.md` Step 07 and the detailed-design writing standard;
2. current Step 05/06 owners, especially R06.8-A §§4~14 and this file §§4~18;
3. frozen `03_ddd_step_07_trait_port_adapter_contracts.md` as affected material only;
4. R06.6 F1/F2、D-2~D-6、E and R06.7-C/E exact affected registers;
5. current calibration flow and project execution ledger.

Current submission requirement: none. The user did not request a commit, and this batch must remain uncommitted unless explicitly requested.
