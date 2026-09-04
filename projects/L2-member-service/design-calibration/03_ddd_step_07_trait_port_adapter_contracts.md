# Step 7：Trait / Port / Adapter 契约

> 状态：completed / pass_with_upstream_blockers
> 目标文档：`projects/L2-member-service/03-详细设计.md`
> 校准日期：2026-09-02
> 参考粒度：`projects/L1-governance/design-calibration/03_ddd_step_07_trait_port_adapter_contracts.md`

## 1. 本步目标与门禁

本步把 Step 5 的七个实现模块、Step 6 的对象契约和 02 的接口骨架下沉为 Trait / Port / Adapter 接缝。目标是使实现者能够知道：

1. 谁定义 trait，谁实现 trait，谁可以调用 trait；
2. 每个读写面返回哪些 typed object、revision、cursor、safe summary 或 disposition；
3. mutation 前如何取得 expected version、UoW 和幂等 reservation；
4. 外部协作只以 runtime / event / ref / adapter / fake seam 出现，不升级为源码依赖或本仓 truth；
5. exact 上游合同未闭合时，正向路径如何保持 blocked / waiting / unknown。

本步不定义 transport route、topic、数据库产品、容器产品、RPC 方法、完整 event envelope 或 retry 数字；这些属于 Step 8、Step 11、Step 13 和 Step 14，且受 `MSVC-UP-001~008` 约束。

## 2. 输入、输出与 SOP 问题回答

### 2.1 输入

| 输入 | 用途 |
|---|---|
| `03_ddd_step_05_module_contracts.md` | 固定 `contracts -> domain -> application -> infra -> api -> worker -> jobs` 依赖方向与文件 owner |
| `03_ddd_step_06_object_contracts.md` | 固定 29 个业务对象、application/entry carrier、字段和状态来源 |
| `02_hld_step_07_interface_skeleton.md` | 提供 Command、Query、Consumer、Job 和外部 seam 的接口分组 |
| `02_hld_step_08_processing_flows.md` | 提供读写顺序、local-first、no-write 和 handoff 边界 |
| `设计真相源闭环与可落码性标准.md` | 约束 version、cursor、UoW、idempotency、projection 和 outbox 闭环 |

### 2.2 SOP 问题回答

| 问题 | 收口结论 |
|---|---|
| 哪个模块定义 Port？ | 只有 `application/src/ports/` 定义本仓 Port；`contracts` / `domain` 不依赖 Port，`infra` 不重新声明同义 trait。 |
| 哪个模块实现 Port？ | `infra` 通过 persistence、adapter、runtime builder 实现；fake 与 durable 实现必须共享同一 application trait 和错误分类。 |
| API、Worker、Jobs 如何访问？ | 只调用 `application/src/services.rs` 的 facade 或 job service；不得直接引用 repository、adapter 或 domain 私有字段。 |
| 哪些读取面必须带 version？ | 所有会随后写回的 Host Truth、attempt、association、registration、session、health、closure、reconciliation、projection marker、outbox marker 和 stored result。 |
| cursor 如何定义？ | `HostChangeCursor` 与 `CommittedChangeCursor` 继续沿用 02/Step 6 名称，但 exact type、来源和兼容关系仍 pending；不创建第三种 cursor、alias 或 conversion。 |
| 外部 Port 返回什么？ | typed ref、safe summary、freshness、availability、blocked/unknown 或 safe outcome；不得返回 secret、raw body、backend state 或 owner-specific lifecycle。 |
| fake 如何证明语义？ | fake 只能证明本地 trait、UoW、幂等、generation 和错误路径；fake pass 不等于 sibling 或 backend 集成 ready。 |

## 3. Port 分层与调用规则

```text
api / worker / jobs
          |
          v
application facade + use cases
          |
          +--> domain objects / policies (pure)
          |
          +--> application ports (唯一声明方)
                    |
                    v
             infra durable / fake adapters
                    |
          +---------+----------+
          v                    v
 local persistence       runtime/event/ref adapters
```

关键说明：

- `domain` 不读取 repository、不持有 client、不生成 publication 或 external outcome。
- `application` 负责协调对象 transition、UoW、幂等、history、material、outbox 和 projection stale marker，但不保存物理 row。
- `infra` 只翻译 application contract；不得用 adapter 返回文本改变 domain 状态。
- `api`、`worker`、`jobs` 只能形成入口 disposition；入口 receipt 不等于 Host lifecycle 或 external completion。

## 4. Shared application carrier

以下类型是 application-local carrier，最终实现位置为 `crates/application/src/ports/` 或相邻 application 文件；它们不是 public transport DTO。

```rust
/// A transaction handle scoped to one local Host Truth write set.
pub trait HostUnitOfWork {
    /// Returns an opaque transaction reference for logs and fake assertions.
    fn transaction_ref(&self) -> HostTransactionRef;

    /// Allocates the accepted local Host Truth change boundary.
    fn assign_truth_change_cursor(&mut self) -> Result<HostChangeCursor, ApplicationError>;

    /// Allocates the committed marker boundary for reference-only changes.
    fn assign_committed_change_cursor(&mut self)
        -> Result<CommittedChangeCursor, ApplicationError>;
}

/// Starts, commits, or rolls back local write units.
pub trait HostUnitOfWorkManager {
    /// Opens a new local write transaction.
    async fn begin(&self) -> Result<Box<dyn HostUnitOfWork>, ApplicationError>;

    /// Commits every staged local effect atomically.
    async fn commit(&self, uow: Box<dyn HostUnitOfWork>) -> Result<(), ApplicationError>;

    /// Rolls back a transaction whose local effects must not become visible.
    async fn rollback(&self, uow: Box<dyn HostUnitOfWork>) -> Result<(), ApplicationError>;
}
```

| carrier | 来源 | 禁止替代 |
|---|---|---|
| `HostTransactionRef` | UoW implementation | trace id、broker offset、database transaction id 作为 public truth |
| `HostRevision` | `get_*_with_version` 或 rehydrate | timestamp、generation、cursor、CAS token 自行互换 |
| `HostChangeCursor` | accepted truth UoW boundary | page cursor、history id、broker offset、generation |
| `CommittedChangeCursor` | reference/material marker UoW boundary | source version、timestamp、idempotency digest |
| `Versioned<T>` | repository read | 裸 `T` 直接写回 |
| `HostOperationContext` | entry metadata + validated scope | route、payload、scheduler time 推导 actor/authority |

`HostChangeCursor` / `CommittedChangeCursor` 只在 exact 上游命名闭合后才能写入可编译类型定义；本文件不引入第三种中间类型。

## 5. 基础 Port 卡

### 5.1 Clock、ID 与 operation context

```rust
/// Provides a monotonic local capture time; it does not decide business state.
pub trait HostClockPort {
    fn now(&self) -> HostTimestamp;
}

/// Creates opaque local identities owned by this repository.
pub trait HostIdGenerationPort {
    fn host_id(&self) -> Result<HostId, ApplicationError>;
    fn decision_id(&self) -> Result<HostDecisionId, ApplicationError>;
    fn record_id(&self) -> Result<HostRecordId, ApplicationError>;
}

/// Carries validated actor, subject, correlation and replay inputs.
pub struct HostOperationContext {
    pub actor: HostActorContext,
    pub project_member_ref: ProjectMemberRef,
    pub global_member_ref: GlobalMemberRef,
    pub correlation_id: CorrelationId,
    pub idempotency_key: Option<IdempotencyKey>,
    pub source_ref: Option<HostIntentSourceRef>,
}
```

调用方是 API、Worker、Jobs 或 application 内部继承语境；实现方是 infra clock/id adapter。`ProjectMemberRef` 是唯一执行主语，`GlobalMemberRef` 只作身份锚。Query 的 `idempotency_key` 必须为 `None`，不能临时生成写键。

### 5.2 幂等与 stored result

```rust
/// Reserves one command, consumer, or job operation key.
pub trait HostIdempotencyRepository {
    async fn reserve(
        &self,
        context: &HostOperationContext,
        digest: &RequestDigest,
        uow: &mut dyn HostUnitOfWork,
    ) -> Result<IdempotencyReservation, ApplicationError>;

    async fn complete(
        &self,
        reservation: IdempotencyReservation,
        result_ref: StoredResultRef,
        uow: &mut dyn HostUnitOfWork,
    ) -> Result<(), ApplicationError>;
}

/// Stores the exact local public result needed for duplicate replay.
pub trait HostStoredResultRepository {
    async fn save(
        &self,
        result: StoredHostOperationResult,
        uow: &mut dyn HostUnitOfWork,
    ) -> Result<StoredResultRef, ApplicationError>;

    async fn get(&self, result_ref: StoredResultRef)
        -> Result<Option<StoredHostOperationResult>, ApplicationError>;
}
```

`reserve` 返回 `New`、`Duplicate(result_ref)`、`InFlight` 或 `Conflict`。Duplicate 必须先回放存储结果，再 rollback 当前 UoW；不得重新执行 domain transition。Stored result 只能保存已定义的 public safe result / receipt / job report，不保存 sibling body。

## 6. Host Truth repository Port

所有 write method 都要求 `&mut dyn HostUnitOfWork` 与 expected revision；所有 read method 对可变对象返回 `Versioned<T>`。每个 repository 只拥有其对象族，不允许万能 `HostRepository` 吞并所有 owner。

### 6.1 Control 与 qualification

```rust
/// Reads and appends CMP-MS-01 intent/decision truth.
pub trait HostControlRepository {
    async fn get_intent_with_version(
        &self, intent_ref: HostIntentRef,
    ) -> Result<Option<Versioned<HostIntent>>, ApplicationError>;
    async fn get_current_decision(
        &self, subject: ProjectMemberRef,
    ) -> Result<Option<Versioned<HostOrchestrationDecision>>, ApplicationError>;
    async fn save_intent(
        &self, value: HostIntent, expected: Option<HostRevision>,
        uow: &mut dyn HostUnitOfWork,
    ) -> Result<HostIntentRef, ApplicationError>;
    async fn save_decision(
        &self, value: HostOrchestrationDecision, expected: Option<HostRevision>,
        uow: &mut dyn HostUnitOfWork,
    ) -> Result<HostOrchestrationDecisionRef, ApplicationError>;
}

/// Persists qualification, assembly and readiness records as separate axes.
pub trait HostQualificationRepository {
    async fn get_qualification_with_version(
        &self, reference: HostQualificationContextRef,
    ) -> Result<Option<Versioned<HostQualificationContext>>, ApplicationError>;
    async fn get_assembly_with_version(
        &self, reference: HostAssemblyRef,
    ) -> Result<Option<Versioned<HostAssembly>>, ApplicationError>;
    async fn get_readiness_with_version(
        &self, reference: HostReadinessDecisionRef,
    ) -> Result<Option<Versioned<HostReadinessDecision>>, ApplicationError>;
    async fn save_qualification(
        &self, value: HostQualificationContext, expected: Option<HostRevision>,
        uow: &mut dyn HostUnitOfWork,
    ) -> Result<HostQualificationContextRef, ApplicationError>;
    async fn save_assembly(
        &self, value: HostAssembly, expected: Option<HostRevision>,
        uow: &mut dyn HostUnitOfWork,
    ) -> Result<HostAssemblyRef, ApplicationError>;
    async fn save_readiness(
        &self, value: HostReadinessDecision, expected: Option<HostRevision>,
        uow: &mut dyn HostUnitOfWork,
    ) -> Result<HostReadinessDecisionRef, ApplicationError>;
}
```

`HostQualificationRepository` 不调用 Identity、Work、Images、credential、Sandbox 或 carrier；这些由 resolver Port 提供 safe input。`HostReadinessDecision` 的 `Resolved` 只代表 policy evaluation 完成，不代表 launch ready。

### 6.2 Host、attempt、association

```rust
/// Owns local host generation and single-active pointer facts.
pub trait HostProgressionRepository {
    async fn get_current_host(
        &self, subject: ProjectMemberRef,
    ) -> Result<Option<Versioned<MemberExecutionHost>>, ApplicationError>;
    async fn get_host_with_version(
        &self, host_ref: HostRef,
    ) -> Result<Option<Versioned<MemberExecutionHost>>, ApplicationError>;
    async fn get_attempt_with_version(
        &self, attempt_ref: HostActionAttemptRef,
    ) -> Result<Option<Versioned<HostActionAttempt>>, ApplicationError>;
    async fn find_attempt_by_effect_key(
        &self, key: ExternalEffectKey,
    ) -> Result<Option<Versioned<HostActionAttempt>>, ApplicationError>;
    async fn save_host(
        &self, value: MemberExecutionHost, expected: Option<HostRevision>,
        uow: &mut dyn HostUnitOfWork,
    ) -> Result<HostRef, ApplicationError>;
    async fn save_attempt(
        &self, value: HostActionAttempt, expected: Option<HostRevision>,
        uow: &mut dyn HostUnitOfWork,
    ) -> Result<HostActionAttemptRef, ApplicationError>;
    async fn save_association(
        &self, value: HostExternalAssociation, expected: Option<HostRevision>,
        uow: &mut dyn HostUnitOfWork,
    ) -> Result<HostExternalAssociationRef, ApplicationError>;
}
```

`find_attempt_by_effect_key` 是 unknown / late / duplicate matching 的唯一读取面。它不能按新 key 创建替代 attempt；旧 generation 永远不能覆盖 current pointer。

### 6.3 Registration、session、health、closure

```rust
/// Persists registration, endpoint and Host Session shells.
pub trait HostSessionRepository {
    async fn get_registration_with_version(
        &self, reference: HostRegistrationRef,
    ) -> Result<Option<Versioned<HostRegistration>>, ApplicationError>;
    async fn get_endpoint_with_version(
        &self, reference: HostEndpointRef,
    ) -> Result<Option<Versioned<HostEndpoint>>, ApplicationError>;
    async fn get_session_with_version(
        &self, reference: HostSessionRef,
    ) -> Result<Option<Versioned<HostSession>>, ApplicationError>;
    async fn save_registration(&self, value: HostRegistration,
        expected: Option<HostRevision>, uow: &mut dyn HostUnitOfWork)
        -> Result<HostRegistrationRef, ApplicationError>;
    async fn save_endpoint(&self, value: HostEndpoint,
        expected: Option<HostRevision>, uow: &mut dyn HostUnitOfWork)
        -> Result<HostEndpointRef, ApplicationError>;
    async fn save_session(&self, value: HostSession,
        expected: Option<HostRevision>, uow: &mut dyn HostUnitOfWork)
        -> Result<HostSessionRef, ApplicationError>;
}

/// Persists signal, assessment, failure and recovery truth independently.
pub trait HostHealthRepository {
    async fn append_signal(&self, value: HealthSignalSnapshot,
        uow: &mut dyn HostUnitOfWork) -> Result<HealthSignalSnapshotRef, ApplicationError>;
    async fn save_assessment(&self, value: HostHealthAssessment,
        expected: Option<HostRevision>, uow: &mut dyn HostUnitOfWork)
        -> Result<HostHealthAssessmentRef, ApplicationError>;
    async fn save_failure(&self, value: HostFailureClassification,
        expected: Option<HostRevision>, uow: &mut dyn HostUnitOfWork)
        -> Result<HostFailureClassificationRef, ApplicationError>;
    async fn save_recovery(&self, value: HostRecoveryDecision,
        expected: Option<HostRevision>, uow: &mut dyn HostUnitOfWork)
        -> Result<HostRecoveryDecisionRef, ApplicationError>;
}

/// Persists closure, cleanup, residual and reconciliation facts.
pub trait HostClosureRepository {
    async fn save_closure(&self, value: HostClosure,
        expected: Option<HostRevision>, uow: &mut dyn HostUnitOfWork)
        -> Result<HostClosureRef, ApplicationError>;
    async fn save_cleanup(&self, value: CleanupAttempt,
        expected: Option<HostRevision>, uow: &mut dyn HostUnitOfWork)
        -> Result<CleanupAttemptRef, ApplicationError>;
    async fn save_finding(&self, value: ResidualFinding,
        expected: Option<HostRevision>, uow: &mut dyn HostUnitOfWork)
        -> Result<ResidualFindingRef, ApplicationError>;
    async fn save_case(&self, value: ReconciliationCase,
        expected: Option<HostRevision>, uow: &mut dyn HostUnitOfWork)
        -> Result<ReconciliationCaseRef, ApplicationError>;
}
```

Signal append 是 append-only；assessment/failure/recovery 与 closure/cleanup/finding/case 采用 expected revision。Job 只能推进已提交记录，不能绕过这些 repository 创建 formal decision。

## 7. Maintenance repository Port

### 7.1 History、material、projection、outbox

```rust
/// Appends immutable local history entries.
pub trait HostHistoryRepository {
    async fn append(&self, entry: HostHistoryEntry,
        uow: &mut dyn HostUnitOfWork) -> Result<HostHistoryEntryRef, ApplicationError>;
    async fn list_by_subject(&self, subject: HostReadSubjectRef,
        page: HostRepositoryPage) -> Result<HostHistoryPage, ApplicationError>;
}

/// Stores body-free host fact material and handoff records.
pub trait HostMaterialRepository {
    async fn save_material(&self, value: HostFactMaterial,
        uow: &mut dyn HostUnitOfWork) -> Result<HostFactMaterialRef, ApplicationError>;
    async fn save_handoff(&self, value: HostHandoffRecord,
        expected: Option<HostRevision>, uow: &mut dyn HostUnitOfWork)
        -> Result<HostHandoffRecordRef, ApplicationError>;
    async fn get_handoff_by_key(&self, key: HandoffKey)
        -> Result<Option<Versioned<HostHandoffRecord>>, ApplicationError>;
}

/// Owns derived projection progress, not source truth.
pub trait HostProjectionRepository {
    async fn get_state(&self, scope: HostReadSubjectRef)
        -> Result<Option<Versioned<HostProjectionState>>, ApplicationError>;
    async fn list_views_affected_by_truth_change(&self, change: HostChangeRef,
        page: HostRepositoryPage) -> Result<HostProjectionRefPage, ApplicationError>;
    async fn list_views_affected_by_reference_change(&self, scope: HostReadSubjectRef,
        page: HostRepositoryPage) -> Result<HostProjectionRefPage, ApplicationError>;
    async fn mark_stale(&self, refs: HostProjectionRefPage,
        cursor: HostChangeCursor, uow: &mut dyn HostUnitOfWork)
        -> Result<(), ApplicationError>;
    async fn save_state(&self, value: HostProjectionState,
        expected: Option<HostRevision>, uow: &mut dyn HostUnitOfWork)
        -> Result<HostProjectionStateRef, ApplicationError>;
}

/// Stores immutable payload snapshots and local publication attempts.
pub trait HostOutboxRepository {
    async fn append(&self, value: HostOutboxRecord,
        uow: &mut dyn HostUnitOfWork) -> Result<HostOutboxRecordRef, ApplicationError>;
    async fn list_pending_with_payload(&self, selector: HostOutboxSelector,
        page: HostRepositoryPage) -> Result<HostOutboxPage, ApplicationError>;
    async fn save_marker(&self, value: HostOutboxRecord,
        expected: HostRevision, uow: &mut dyn HostUnitOfWork)
        -> Result<HostOutboxRecordRef, ApplicationError>;
}
```

`HostOutboxRepository.list_pending_with_payload` 必须返回已存 payload snapshot；publisher 禁止回查 current truth 重新组包。Projection repository 只推进 projection state，不能通过 rebuild 修改 CMP-MS-01~06。

### 7.2 读取面与分页

```rust
/// Opaque repository page cursor; it is not a truth cursor or version.
pub struct HostRepositoryPage {
    pub cursor: Option<HostRepositoryCursor>,
    pub limit: u32,
}
```

`limit` 只做结构性上限校验，具体值留给配置设计；cursor 只代表列表位置。public Query 的 cursor 由 `contracts` 另定义，不能直接泄漏 infra cursor。

## 8. 外部 seam Port

### 8.1 L1、Member、Images、credential

```rust
/// Reads only the safe identity qualification needed by host assembly.
pub trait GlobalMemberQualificationPort {
    async fn resolve(&self, input: GlobalMemberQualificationInput)
        -> Result<HostQualificationSourceResult, ExternalPortError>;
}

/// Reads only the safe project-member qualification needed by host assembly.
pub trait ProjectMemberQualificationPort {
    async fn resolve(&self, input: ProjectMemberQualificationInput)
        -> Result<HostQualificationSourceResult, ExternalPortError>;
}

/// Placeholder until L2-member-images publishes the exact pinned-supply contract.
pub trait PinnedImageSupplyPortPlaceholder {
    async fn resolve(&self, input: PinnedSupplyInput)
        -> Result<HostQualificationSourceResult, ExternalPortError>;
}

/// Placeholder; the host service never signs, revokes, stores, or returns secrets.
pub trait LaunchCredentialQualificationPortPlaceholder {
    async fn qualify(&self, input: LaunchCredentialInput)
        -> Result<HostQualificationSourceResult, ExternalPortError>;
}

/// Placeholder until Member registration / heartbeat fields and transport are closed.
pub trait MemberRegistrationPortPlaceholder {
    async fn read_registration(&self, input: MemberRegistrationInput)
        -> Result<HostExternalSafeResult, ExternalPortError>;
}
```

这些 Port 的结果只能是 typed ref、safe summary、freshness、missing、stale、conflict、unavailable 或 unknown。`MSVC-UP-002/003/006` 未闭口时，任何 positive result 必须由 application 重新经过 required qualification guard；adapter 返回 `Ok` 不可直接产生 ready。

### 8.2 Runtime、Sandbox、carrier

```rust
/// Host-side association seam; does not expose Runtime run / turn / outcome truth.
pub trait RuntimeHostSessionPortPlaceholder {
    async fn associate(&self, input: RuntimeHostSessionInput)
        -> Result<HostExternalSafeResult, ExternalPortError>;
}

/// Host-level binding/release only; tool execution remains outside this repository.
pub trait SandboxHostBindingPortPlaceholder {
    async fn bind(&self, input: SandboxHostBindingInput)
        -> Result<HostExternalSafeResult, ExternalPortError>;
    async fn release(&self, input: SandboxHostReleaseInput)
        -> Result<HostExternalSafeResult, ExternalPortError>;
}

/// Product-neutral carrier lifecycle seam.
pub trait HostCarrierLifecyclePort {
    async fn dispatch(&self, input: HostCarrierDispatchInput)
        -> Result<HostExternalSafeResult, ExternalPortError>;
}
```

`MSVC-UP-001/004` 未闭口前，Runtime/Sandbox 正向路径只能返回 blocked / waiting / unknown；不得创建 Runtime run、tool invocation、Sandbox policy、backend resource 或 cleanup truth。

### 8.3 Publication 与 feedback

```rust
/// Publishes a previously stored body-free material snapshot.
pub trait HostFactPublicationPortPlaceholder {
    async fn submit(&self, input: HostPublicationInput)
        -> Result<HostSubmissionResult, ExternalPortError>;
}

/// Maps a formally closed feedback envelope into a safe local outcome.
pub trait HostFeedbackMapperPlaceholder {
    fn map(&self, input: HostFeedbackInput)
        -> Result<HostFeedbackMapping, ExternalPortError>;
}
```

publication `submitted`、`delivered`、`observed`、`accepted` 是四个独立层；`submit` 返回 acknowledgement 只能写本地 submitted/attempt marker，不得推导其他三层。

## 9. Adapter 实现契约

| adapter 类别 | 实现位置 | 必须做 | 不得做 |
|---|---|---|---|
| durable persistence | `infra/src/persistence/*.rs` | 映射 typed object、expected revision、UoW、append-only record | 定义业务状态、用 row status 替代 domain enum |
| fake persistence | `infra/src/fakes/*.rs` 或测试 assembly | 与 durable 共享 Port、冲突/回滚/幂等行为可断言 | 省略 generation guard、自动补字段、把 fake pass 写成集成证据 |
| L1/L2/L4 resolver | `infra/src/adapters/*.rs` | 将 owner-safe ref/summary 映射为中性结果 | 保存外部正文、解析 opaque ref、影子存储 sibling truth |
| runtime/carrier adapter | `infra/src/adapters/*.rs` | 传递 typed request、映射 safe outcome/error | 直接改变 Host Truth、返回 backend body 或自行重试不可逆 effect |
| publication adapter | `infra/src/adapters/publication.rs` | 提交 stored snapshot、返回本地 submission result | 查询 current truth 组包、声明 delivered/accepted |
| runtime builder | `infra/src/runtime_builder.rs` | 注入全部 Port、校验必要可用性、形成 blocked assembly | 把 availability 变成 domain ready、绕过 required dependency |

### 9.1 Fake parity 规则

fake 与 durable 必须在以下方面可互换：

- expected revision 竞争产生同一类 `Conflict`；
- rollback 不泄漏 cursor、stored result 或 outbox record；
- duplicate reservation 返回同一 stored result ref；
- unknown effect 保留原 `ExternalEffectKey`；
- single-active / generation fence 不因 fake 而放宽；
- forbidden body 在 fake 中同样拒绝；
- blocked upstream contract 不被 fake 自动升级为 positive。

## 10. 跨模块接缝审计

| 审计项 | 结论 |
|---|---|
| domain 是否依赖 infra | 否；domain 只接收 typed carrier 并执行纯 invariant。 |
| application 是否依赖具体 client | 否；只依赖 application Port。 |
| entry 是否直接写 store | 否；必须经 facade。 |
| projection/history/outbox 是否成为第二写源 | 否；它们只保存已提交结果或派生进度。 |
| cursor 是否被 version/page cursor 替代 | 否；两个 exact cursor 名称继续 pending，不创建替代物。 |
| external body/secret 是否入仓 | 否；仅 safe ref/summary/gap。 |
| Runtime/Member/Images/Sandbox positive 是否 ready | 否；`MSVC-UP-001~008` 保持 blocked/pending。 |

## 11. 回填草稿

正式 `03-详细设计.md` §5 与 §6 只需装配以下结论并回指本文件：

1. application 是唯一 Port 声明方；infra 是唯一实现方；
2. UoW、幂等、stored result、repository、projection、outbox 和 external seam 的 trait inventory；
3. 每个写入函数的 expected revision 与 UoW 规则；
4. fake/durable parity 与 blocked positive ceiling；
5. `HostChangeCursor` / `CommittedChangeCursor` exact type pending 的显式说明。

## 12. Blocker、Gate 与停审

| 项目 | 结果 |
|---|---|
| Trait / Port 唯一 owner | pass |
| repository 读取面覆盖后续 DTO/flow/state | pass_with_upstream_blockers |
| expected version / UoW / idempotency | pass_with_upstream_blockers |
| external seam 分类 | pass_with_upstream_blockers |
| fake parity | pass_with_upstream_blockers |
| `MSVC-UP-001~008` | pending / blocked / fail-closed |
| 正式 03 写入 | forbidden until Step 19 |

```text
step_07_status = completed
step_07_gate = pass_with_upstream_blockers
next_allowed_step = Step 8 protocol_contracts
formal_03_write_allowed = false_until_step_19
```
