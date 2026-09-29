# L4-archive 03 Step 07：Trait / Port / Adapter 契约

## 1. 状态、授权与逐模块计划

- 日期：2026-09-11；模式：`single-agent-serial / full-restart`。
- 用户明确授权“继续完成 07”，承接当前 03 Step 06，解释为详细设计 Step 07，不是正式 `07-实施计划.md`。
- 当前状态：`completed / pass_with_upstream_blockers / stop_review`；用户审查尚未发生，不自动进入 Step 08。
- 只写 Archive 校准材料及台账；不改正式 03、不实现、不执行项目测试、不提交。
- 产物上限：本地 required Rust-facing port 契约；不证明外部合同、实现、集成或 readiness。

| 顺序 | 模块 / 小循环 | 状态 | 本轮输出 |
|---|---|---|---|
| M1 | contracts | completed / internal_review_pass | 公共类型与 local carrier 分界，不创建基础设施 trait |
| M2 | domain CP1～CP6 | completed / internal_review_pass | 对象能力到读取、原子写、guard、append-only 需求 |
| M3 | application | completed / internal_review_pass_with_upstream_blockers | support、local store、六外部 family、调用约束 |
| M4 | infra | completed / internal_review_pass_with_upstream_blockers | adapter / constructor / blocked / fake-durable parity |
| M5 | api | completed / internal_review_pass | 只调用 service、no-write query、协议承接 |
| M6 | worker | completed / internal_review_pass_with_upstream_blockers | claim/checkpoint/可信事件接缝、owner 路由 |
| A1 | 跨模块审计 | completed / stop_review | 对象/入口/错误/版本/事务/来源/后续承接 |

## 2. 阅读输入与核验结论

本轮依据详细设计 SOP Step 7、书写规范 §5.5/5.6、通则逐模块小循环、中间产物规范恢复/写前门禁、真相源标准 typed read / callable / visibility / UoW / stored result / version 条款，以及全局依赖规则 §4.1。Rust 片段采用英文标识符与 rustdoc，仍是设计契约，不是已编译源码。

| 正式输入 / 校准输入 | 当前使用范围 | 结论 |
|---|---|---|
| 本仓正式 01 §8～10、02 §5～9 | dependency、source-authority、30 入口、局部与外部一致性 | 7 family 是需求分母，不是 7 个万能接口 |
| 03 Step04/05 | 六 crate 文件布局、8 service、26 对象、30/32 入口/方法 | application 定义需求，infra 实现；无 jobs/outbox/publisher |
| 03 Step06 §5～14，尤其 §14.5/14.9 | typed fields、loaded-object guard、历史与完整 safe views | 不允许只有 ref/摘要的 guard 或只有 save 的 repository |
| L1-governance 03 Step07 §7/9/10/11 | transaction、versioned read、result、resolver outcome 的粒度 | 参考分层与逐方法粒度；不复制其领域对象、outbox 或实现选型 |
| L1-workspace 正式 03、project ledger | 正式 00～07 已停审；ExportWorkspaceReadModel 与 WS-UP-006 | 只读 projection；不产 archive artifact，不冒充 canonical snapshot |
| identity/conversation/work/process 正式 01/03 归档与交接段 | owner snapshot、业务状态和恢复事实边界 | 现有 handoff 概念不是本仓 exact export/restore 合同 |
| governance/artifact 正式 03 归档/export/依赖段 | decision 与 artifact/lineage truth | ref/marker 不等完整决定、包正文或 receiver commit |
| observability 正式 03 forbidden body/consumer 边界 | 脱敏 observation/evidence material | 审计后端与原始审计链不在本仓；AR-UP-007 保留 |
| L0-core 真实 contracts 与前序核验、L0-bus/L0-sdk 正式边界 | 共享符号、event ACK、SDK downstream | 仅 core-contracts 已核验符号 compile；其他 runtime/event/ref |

本轮不宣称重读所有上游全文；沿用前序已停审基线，对受影响正式段落定向核验。旧 README/正式 03/draft 仍为 historical_material，不用于补齐缺失合同。

## 3. SOP 问题回答与写前取舍

| 问题 | 回答 / 取舍 |
|---|---|
| 哪些模块定义 trait，谁实现？ | application 拥有 required ports；infra 实现；contracts/domain 不引入 I/O；entry 不持有 repository。 |
| 接缝从哪里来？ | 从 Step06 每对象的 identity/version/guard/history 和各 service 能力逐组展开，不从治理项目复制总表。 |
| read 面是否完整？ | exact get、stable lookup、分页列表、嵌套 value 读取、同 snapshot 聚合读取；缺失与故障分离。 |
| 如何传事务？ | transaction 自身实现 repository capability，所有 staged read/write 使用同一 handle；不把裸 transaction string 当可用事务。 |
| async/dyn 是否一致？ | boxed Send future，具体 associated read/UoW；不把原生 async trait 直接 Box<dyn>。 |
| version 来源？ | store 分配，get/list 返回；Absent 与 Exact 显式分支，禁止 timestamp/fence/cursor 代替。 |
| duplicate 保存什么？ | 完整 typed result payload + shell + reservation 原子提交；不得仅存 surface_ref，重放时不得重跑业务。 |
| worker 类型在哪里？ | 持久 claim/checkpoint 及其必要 carrier 下移 application-local 单一 owner；worker 保留运行状态/handler，禁止 application 反依赖 worker。 |
| 外部失败如何表示？ | 可保存的业务姿态是 typed outcome；call/setup failure 是 safe error。may-have-dispatched 错误进入 unknown，不能普通 retry。 |
| 上游未闭合怎么办？ | 本地 required input/outcome 可以设计；对应 production binding 阻塞，不能默认成功。 |
| 是否新增业务对象/入口/family？ | 否；技术 carrier 不计入 26 对象、30 入口、7 family。 |
| 本步与后续界线？ | 本步闭合 ports 与内部 typed payload；Step08 才展开公开协议，Step09/10/11/13 才逐流/迁移/物理持久化/并发策略；没有可实施 boundary 放行。 |

## 4. contracts 模块小循环

### 4.1 Capability / 接缝清单

| capability / Step06 来源 | 本模块责任 | 协作方 | 后续 |
|---|---|---|---|
| scope/decision、typed refs、五 safe view | 公共值形状和拒绝未知分类；不读取或签发 authority | domain/application 使用同一 schema | Step08 wire/helper |
| request/result/consumer/job vocabulary | 固定名称；不放 repo、UoW、provider、lease 或 raw body | entry 映射 application | Step08 exact schema |
| ManifestEntrySet / closure evaluation | 保持 domain 所有，不在 contracts 导入 domain | application 组装后安全裁剪 | Step09 flow |

### 4.2 模块内停审

`pass_at_step_7`：本模块不新增 I/O trait；contracts → core-contracts 不变。Public pagination 不能直接 re-export application repository cursor；Step08 必须独立闭合 visibility-bound cursor/schema。所有 local support 与 stored payload 不作为 public protocol 直接序列化。

## 5. domain 模块小循环

### 5.1 Capability / 接缝清单与对象字段来源

| CP / 对象能力 | 需要的 application 接缝 | 写入 / 读取成对约束 | domain 禁止行为 |
|---|---|---|---|
| CP1 request/scope/job/stage | request exact/operation lookup、job CAS、stage append/list | immutable request+scope、初始 job/stage/result 同事务；job transition 与 stage 同事务 | 不签发 authority、不决定项目状态 |
| CP2 binding/attempt/coverage/finding | binding/attempt versioned get、owner export/probe、capture sidecar | coverage 内嵌 attempt；finding 与原始 typed source observation 同事务；替换保留旧 attempt | 不回源、跨 owner 比 version、把 workspace 当 canonical |
| CP3 bundle/manifest/entry/closure/finding | bundle CAS、immutable manifest append/get、same-input guard read | entry/closure 内嵌 manifest；读回 declared/actual 两集合及全部 findings | 不把存储成功当 closure、不自动修复 |
| CP4 assessment/finding | fixed-input exact/list、integrity/compatibility outcome | Verified 与 formal evidence 同输入；immutable compatibility、append findings | 不生成算法、密钥或 schema support |
| CP5 placement/execution/action | versioned state、完整 action intent input、decision/storage/probe | 持久 intent 先于 I/O；ACK、commit、retrieval 独立；保存全部历史 | 不解释 retention/hold/delete，不直接调用 provider |
| CP6 request/plan/item/handoff/outcome/compensation | plan/items exact set、receiver/material/authority、outcome append/list | 冻结 inputs 不变；结果逐 owner 保存；补偿保持原历史 | 不重写 owner DB，不推断 restored |

### 5.2 模块内停审

`pass_at_step_7`：domain 无 repository/client trait，无 async I/O。26 正式对象仍为 2 contracts + 24 domain；CaptureCoverage、ManifestClosure 不新增 ID；ManifestEntry 已有 ID 但只作为 immutable manifest 成员持久化。Version 的赋值属于 store；domain 只验 loaded expected version。状态、factory、全部 history 字段沿用 Step06，不在本步复制成第二套对象。

## 6. application 模块小循环

### 6.1 写前 capability / 接缝清单

| 当前能力 | Step06 字段 / 状态来源 | 本模块定义 | 实现者 |
|---|---|---|---|
| 局部一致写、同快照读 | record_version、bundle_version、immutable revisions | store manager、read/write repository capabilities、UoW | infra store |
| safe duplicate / commit-unknown | operation context、reservation、result shell | typed result save/get、stable lookup、transaction probe | 同一个 infra store |
| 来源/固定输入与外部效果 | source coverage、manifest、assessment、action/handoff | 六外部 required family + typed observations | 对应 infra adapter |
| ID/time/context/visibility | factory 必填 ID、RecordedAt、current disclosure | application-local support traits | infra support，不新建业务 family |
| bounded worker | claim、lease、fence、checkpoint | application-local control 与存储 seam | infra store；worker 仅调 control |

### 6.2 文件、async 与 carrier 通则

所有路径均为 planned `crates/application/src/`，不创建源码。新增 `ports/support.rs`、`worker_control.rs` 是前序布局的必要细化，已回填 Step04/05。七 business/local family 不变。`ports/store.rs` 拆若干 trait capability，不等于新增业务 family。

```rust
/// Carries a Send future without requiring a runtime or async-trait dependency.
pub type PortFuture<'a, T, E> = std::pin::Pin<
    Box<dyn std::future::Future<Output = Result<T, E>> + Send + 'a>
>;

/// Couples a stored value to its optimistic token.
pub struct Versioned<T> { pub value: T, pub version: RecordVersion }
/// Separates create-only writes from compare-and-swap updates.
pub enum ExpectedVersion { Absent, Exact(RecordVersion) }
/// Returns a staged identity/version, not commit evidence.
pub struct Staged<K> { pub key: K, pub version: RecordVersion }
/// Identifies an immutable local read snapshot, not an owner fence.
pub struct ArchiveReadSnapshotRef(pub String);
/// Identifies one local transaction for recovery lookup.
pub struct ArchiveTransactionRef(pub String);
/// Carries a repository-private, snapshot-bound continuation.
pub struct RepositoryCursor(pub String);
/// Carries a validated nonzero limit; no default is specified here.
pub struct RepositoryLimit(pub std::num::NonZeroU32);
/// Selects one bounded repository page.
pub struct RepositoryPageRequest {
    pub snapshot_ref: ArchiveReadSnapshotRef,
    pub cursor: Option<RepositoryCursor>,
    pub limit: RepositoryLimit,
}
/// Returns rows and a continuation from the same snapshot.
pub struct RepositoryPage<T> {
    pub snapshot_ref: ArchiveReadSnapshotRef,
    pub rows: Vec<T>,
    pub next: Option<RepositoryCursor>,
}
```

`Versioned<T>` 等在 `ports/store.rs`，future/error/support 在 `ports/support.rs` / `errors.rs`，transaction 在 `unit_of_work.rs`。各片段共享已声明类型/import，不重复定义；文档不声称独立代码块可直接编译。`&self` 方法的 future 捕获要求实现 `Sync`；write 用 `&mut self` 串行，所有 handle `Send + Sync`。不使用原生 async trait 的 `dyn`，不要求 domain 依赖 Tokio，不给未核验第三方 crate 新增 compile dependency。

全部 opaque local String newtype 必须 non-empty/body-free，private field + checked constructor；仅存定位 token，不含 path/URL/credential/provider error。类型名不代表可由 service 任意 mint。集合的空与重复规则分别明确；不存在 `Any`、`serde_json::Value`、未约束 `Map<String, String>` 或 raw byte payload 作为 port 真相输入。

### 6.3 错误完整边界

```rust
/// Defines store failures independently from domain outcomes.
pub enum ArchiveStoreError {
    Unavailable { reason: SafeReasonRef },
    ContractBlocked { reason: SafeReasonRef },
    VersionConflict { reason: SafeReasonRef, expected: ExpectedVersion, actual: Option<RecordVersion> },
    UniqueConflict { reason: SafeReasonRef },
    CorruptRecord { reason: SafeReasonRef },
    InconsistentRead { reason: SafeReasonRef },
    SnapshotExpired { reason: SafeReasonRef },
    InvalidCursor { reason: SafeReasonRef },
    ForeignHandle { reason: SafeReasonRef },
    FenceRejected { reason: SafeReasonRef },
    ResultMissing { reason: SafeReasonRef },
    InputConflict { reason: SafeReasonRef },
}
/// Classifies uncertainty without asserting an external effect rolled back.
pub enum DispatchKnowledge { NotDispatched, MayHaveDispatched }
/// Defines adapter call failures, not persistable business postures.
pub enum ArchivePortError {
    ContractBlocked { reason: SafeReasonRef },
    InvalidInput { reason: SafeReasonRef },
    Unavailable { reason: SafeReasonRef, dispatch: DispatchKnowledge },
    DeadlineExceeded { reason: SafeReasonRef, dispatch: DispatchKnowledge },
    InvalidResponse { reason: SafeReasonRef, dispatch: DispatchKnowledge },
    BindingMismatch { reason: SafeReasonRef },
}
/// Defines support/control failures without infrastructure payloads.
pub enum ArchiveSupportError {
    ContractBlocked { reason: SafeReasonRef },
    InvalidContext { reason: SafeReasonRef },
    Unavailable { reason: SafeReasonRef },
    IdConflict { reason: SafeReasonRef },
    AuthorityUnavailable { reason: SafeReasonRef },
    InvalidClaim { reason: SafeReasonRef },
}
```

| 错误 / 来源 | 安全处理 | 禁止映射 |
|---|---|---|
| unavailable / deadline | 读可延期；写若 may-have-dispatched，先记录 CommitUnknown/reconcile | timeout→definite failure、自动再发 |
| version/unique/input conflict | rollback 后 exact read；同 input duplicate 才重放，异输入 Conflict | upsert、last-write-wins |
| corrupt/inconsistent/result missing | fail-closed，保留诊断 reason；不重做已完成请求 | missing result→new operation |
| snapshot/cursor | 重启只读流程，重新 current visibility；不拼接不同 snapshots | 把当前第一页和旧下一页合并 |
| foreign handle/fence | reject；旧 worker 不提交，无 epoch fallback | 租约超时证明 external rollback |
| invalid response | 不接纳伪 proof；若可能已派发进入 unknown | parse failure→NotDispatched |
| contract/binding/authority | blocker，正向 adapter 不构造 | fake/default allow |

`SafeReasonRef` 来自本地安全分类 registry 或正式 adapter 的脱敏映射，不承载 raw SQL/HTTP/IO/panic。详细对外错误码与重试配置留 Step08/12/14；这些端口 enum 已完整限定本 Step 方法返回面，不允许 fake-only variant。

### 6.4 Read snapshot / UoW / ArchiveStorePort

```rust
/// Reports only the local transaction outcome.
pub enum LocalCommitOutcome {
    Committed { transaction_ref: ArchiveTransactionRef },
    Aborted { transaction_ref: ArchiveTransactionRef, reason: SafeReasonRef },
    Unknown { transaction_ref: ArchiveTransactionRef, reason: SafeReasonRef },
}
/// Reports a stable transaction lookup without treating absence as rollback.
pub enum LocalCommitProbe {
    Committed { transaction_ref: ArchiveTransactionRef },
    Aborted { transaction_ref: ArchiveTransactionRef, reason: SafeReasonRef },
    Pending { transaction_ref: ArchiveTransactionRef },
    Unknown { transaction_ref: ArchiveTransactionRef, reason: SafeReasonRef },
}
/// Closes an owned, read-only snapshot handle.
pub trait ArchiveReadSession: ArchiveReadPorts + Send + Sync + Sized + 'static {
    fn snapshot_ref(&self) -> ArchiveReadSnapshotRef;
    fn close(self) -> PortFuture<'static, (), ArchiveStoreError>;
}
/// Owns staged reads and writes from one store instance.
pub trait ArchiveUnitOfWork: ArchiveWritePorts + Send + Sync + Sized + 'static {
    fn transaction_ref(&self) -> ArchiveTransactionRef;
    fn snapshot_ref(&self) -> ArchiveReadSnapshotRef;
    fn initial_version(&self) -> RecordVersion;
    fn commit(self) -> PortFuture<'static, LocalCommitOutcome, ArchiveStoreError>;
    fn rollback(self) -> PortFuture<'static, LocalCommitOutcome, ArchiveStoreError>;
}
/// Provides only read sessions to query composition.
pub trait ArchiveReadStorePort: Send + Sync {
    type Read: ArchiveReadSession;
    fn open_read(&self) -> PortFuture<'_, Self::Read, ArchiveStoreError>;
}
/// Owns the local persistence family; no owner database handle is accepted.
pub trait ArchiveStorePort: ArchiveReadStorePort {
    type Tx: ArchiveUnitOfWork;
    fn begin(&self) -> PortFuture<'_, Self::Tx, ArchiveStoreError>;
    fn probe_commit(&self, transaction: ArchiveTransactionRef)
        -> PortFuture<'_, LocalCommitProbe, ArchiveStoreError>;
}
```

`ArchiveReadPorts` / `ArchiveWritePorts` 的完整 supertrait 列表在本模块尾；read session 和 tx 都以自身为唯一 repository 上下文，所有方法不接外部 connection 或 string uow。backend instance/transaction/snapshot 绑定必须由实现检查，不能跨 store 混用。RequestService 的 I 与 S 必须使用相同 result/reservation capability 和同一 Tx；I 是 `IdempotencyCoordinator` 纯协议 helper，不是第二数据库。

事务规则：begin → 同 tx exact reads/negative reads/list scans → domain guards → staged writes/history/sidecars → 完整 result + reservation completion + checkpoint → commit。Tx 自动记录所有 guard read 依赖（包括未改对象、negative lookup 与 range/phantom predicate），commit 验证 serializable-equivalent read set 及 worker fence。仅对被写 row 做 CAS 不足以支持 seal/restore guard；backend 无此能力即 ContractBlocked。外部 I/O 绝不在打开的本地事务内执行；先 intent commit、关闭事务，再调用外部，回包另开 tx 重读所有固定依据。

`Absent` 只能创建，不是 upsert；`Exact(v)` 必须来自当前 tx get/list 返回。domain 工厂初值用 `tx.initial_version()`；domain mutation 保留 loaded version，store save 检查后为 staged 值分配新 token，并保证读回 wrapper.version 与对象内部 record_version（或 Job/Bundle wrapper）相等。immutable 无 version，append 同 key 同完整内容可幂等复用，异内容 UniqueConflict。rollback 无 truth/history/result/sequence/checkpoint 可见；已分配但未提交的 ID/token 可有空洞，不是事实。

commit/rollback 的 Err 只允许可证明提交未开始的本地错误；任何可能发出提交的失联/崩溃/取消均为 Unknown，不能宣称 aborted。进程取消来不及回值时，恢复凭 begin 已返回的 transaction ref 与稳定 operation key 查证。probe NotFound 不作为正式状态；无法证明不存在效果返回 Unknown。只读 session 固定 committed snapshot；Tx 可读己写。Query 不拿 ArchiveStorePort，仅拿 `ReadOnlyStore<S>` 包装后的 ArchiveReadStorePort，包装不暴露底层 S。

分页：cursor 绑定 store、snapshot、typed parent/filter/order、上页位置；稳定按 typed identity 或明确 append sequence 排序；空 rows 且 next=Some 只允许有正式预算耗尽语义，否则错误。RepositoryPage.next=None 才表示该查询全集耗尽；未知/故障不是空全集。不固定 page/lease 数值。public cursor 不等 repo cursor，Step08 需定义与 principal/visibility/selection 绑定的独立 carrier；本 Step 没有新增 public page helper。

### 6.5 Local CP1 repository：受理、作业与 scope

写前判断：scope 内嵌 immutable ArchiveRequest，不能另建可能漂移的 scope truth；ArchiveJob 对 OperationRequest 唯一；stage append-only，必须完整读取以构造 status 与恢复。

```rust
/// Reads immutable admission records and mutable job state.
pub trait AdmissionRead: Send + Sync {
    fn get_archive_request(&self, key: ArchiveRequestRef) -> PortFuture<'_, Option<ArchiveRequest>, ArchiveStoreError>;
    fn get_restore_request(&self, key: RestoreRequestRef) -> PortFuture<'_, Option<RestoreRequest>, ArchiveStoreError>;
    fn get_declared_scope(&self, key: DeclaredScopeRef) -> PortFuture<'_, Option<DeclaredArchiveScope>, ArchiveStoreError>;
    fn get_job_with_version(&self, key: ArchiveJobRef) -> PortFuture<'_, Option<Versioned<ArchiveJob>>, ArchiveStoreError>;
    fn find_job_by_request(&self, key: OperationRequestRef) -> PortFuture<'_, Option<Versioned<ArchiveJob>>, ArchiveStoreError>;
    fn get_stage(&self, key: JobStageRecordId) -> PortFuture<'_, Option<ArchiveJobStageRecord>, ArchiveStoreError>;
    fn list_stages(&self, job: ArchiveJobRef, page: RepositoryPageRequest) -> PortFuture<'_, RepositoryPage<ArchiveJobStageRecord>, ArchiveStoreError>;
}
/// Stages admission, job, and append-only stage records.
pub trait AdmissionWrite: AdmissionRead {
    fn append_archive_request(&mut self, value: ArchiveRequest) -> PortFuture<'_, ArchiveRequestRef, ArchiveStoreError>;
    fn append_restore_request(&mut self, value: RestoreRequest) -> PortFuture<'_, RestoreRequestRef, ArchiveStoreError>;
    fn save_job(&mut self, value: ArchiveJob, expected: ExpectedVersion) -> PortFuture<'_, Staged<ArchiveJobRef>, ArchiveStoreError>;
    fn append_stage(&mut self, value: ArchiveJobStageRecord) -> PortFuture<'_, JobStageRecordId, ArchiveStoreError>;
}
```

`get_declared_scope` 按 request_ref + scope_version 同时核对，版本不匹配返回 None，不返回该请求另一版本。C01/C02/E01 只本地受理；job 创建与 stage/result 同提交。按幂等 key 查 admission 使用 §6.11 的统一 reservation，不新增第二套 command idempotency index。J01 聚合 required components 从 immutable request + committed workflow 读取，不能从“哪些行恰好存在”反推 required 集合。

### 6.6 Local CP2 repository：来源、capture 与安全 observation sidecar

写前判断：CaptureAttempt 只存 material refs/coverage，无法自行还原 manifest member/locator/schema/owner inventory；故本 Step 定义 immutable `CapturedSourceRecord`，保存 exact mapped source observation。它是 attempt 的技术承接材料，无第二 truth ID，不能补造 source body。详细 schema 在 §6.13。

```rust
/// Reads exact sources, capture histories, nested coverage, and approved inventories.
pub trait CaptureRead: Send + Sync {
    fn get_binding_with_version(&self, key: SourceBindingRef) -> PortFuture<'_, Option<Versioned<ArchiveSourceBinding>>, ArchiveStoreError>;
    fn list_bindings(&self, request: ArchiveRequestRef, page: RepositoryPageRequest) -> PortFuture<'_, RepositoryPage<Versioned<ArchiveSourceBinding>>, ArchiveStoreError>;
    fn get_capture_with_version(&self, key: CaptureAttemptRef) -> PortFuture<'_, Option<Versioned<CaptureAttempt>>, ArchiveStoreError>;
    fn list_captures(&self, binding: SourceBindingRef, page: RepositoryPageRequest) -> PortFuture<'_, RepositoryPage<Versioned<CaptureAttempt>>, ArchiveStoreError>;
    fn get_capture_coverage(&self, attempt: CaptureAttemptRef) -> PortFuture<'_, Option<CaptureCoverage>, ArchiveStoreError>;
    fn get_captured_source(&self, attempt: CaptureAttemptRef) -> PortFuture<'_, Option<CapturedSourceRecord>, ArchiveStoreError>;
    fn get_source_finding(&self, key: SourceCaptureFindingRef) -> PortFuture<'_, Option<SourceCaptureFinding>, ArchiveStoreError>;
    fn list_source_findings(&self, attempt: CaptureAttemptRef, page: RepositoryPageRequest) -> PortFuture<'_, RepositoryPage<SourceCaptureFinding>, ArchiveStoreError>;
}
/// Stages source state and immutable supporting observations.
pub trait CaptureWrite: CaptureRead {
    fn save_binding(&mut self, value: ArchiveSourceBinding, expected: ExpectedVersion) -> PortFuture<'_, Staged<SourceBindingRef>, ArchiveStoreError>;
    fn save_capture(&mut self, value: CaptureAttempt, expected: ExpectedVersion) -> PortFuture<'_, Staged<CaptureAttemptRef>, ArchiveStoreError>;
    fn append_captured_source(&mut self, value: CapturedSourceRecord) -> PortFuture<'_, CaptureAttemptRef, ArchiveStoreError>;
    fn append_source_finding(&mut self, value: SourceCaptureFinding) -> PortFuture<'_, SourceCaptureFindingRef, ArchiveStoreError>;
}
```

`get_capture_coverage=None` 表示 attempt 缺失或未 settle；要区分内部状态，必须配对 get_capture，public 一律安全裁剪。一个 settled attempt 只能有一份 final source record，同 key 异观察不得覆盖；晚到冲突进入安全结果/显式新 attempt，不改旧 immutable inventory。binding block/retire 历史、attempt replacement 全量 round-trip。scope/selector/requiredness 唯一约束防重复 planning；replacement 必须指向同 request 合法新绑定，不能自环。

### 6.7 Local CP3 repository：Bundle 与 immutable manifest

```rust
/// Reads complete immutable entry sets and mutable Bundle identity state.
pub trait BundleRead: Send + Sync {
    fn get_bundle_with_version(&self, key: ArchiveBundleRef) -> PortFuture<'_, Option<Versioned<ArchiveBundle>>, ArchiveStoreError>;
    fn find_bundle_by_request(&self, key: ArchiveRequestRef) -> PortFuture<'_, Option<Versioned<ArchiveBundle>>, ArchiveStoreError>;
    fn get_manifest(&self, key: BundleManifestRef) -> PortFuture<'_, Option<BundleManifest>, ArchiveStoreError>;
    fn find_manifest_by_revision(&self, key: BundleRevisionRef) -> PortFuture<'_, Option<BundleManifest>, ArchiveStoreError>;
    fn list_manifests(&self, bundle: ArchiveBundleRef, page: RepositoryPageRequest) -> PortFuture<'_, RepositoryPage<BundleManifest>, ArchiveStoreError>;
    fn get_manifest_entry(&self, revision: BundleRevisionRef, key: ManifestEntryRef) -> PortFuture<'_, Option<ManifestEntry>, ArchiveStoreError>;
    fn list_manifest_entries(&self, revision: BundleRevisionRef, role: ManifestEntryRole, page: RepositoryPageRequest) -> PortFuture<'_, RepositoryPage<ManifestEntry>, ArchiveStoreError>;
    fn get_manifest_closure(&self, revision: BundleRevisionRef) -> PortFuture<'_, Option<ManifestClosure>, ArchiveStoreError>;
    fn get_closure_finding(&self, key: ClosureFindingRef) -> PortFuture<'_, Option<ClosureFinding>, ArchiveStoreError>;
    fn list_closure_findings(&self, revision: BundleRevisionRef, page: RepositoryPageRequest) -> PortFuture<'_, RepositoryPage<ClosureFinding>, ArchiveStoreError>;
}
/// Stages a complete manifest with immutable nested entries and closure.
pub trait BundleWrite: BundleRead {
    fn save_bundle(&mut self, value: ArchiveBundle, expected: ExpectedVersion) -> PortFuture<'_, Staged<ArchiveBundleRef>, ArchiveStoreError>;
    fn append_manifest(&mut self, value: BundleManifest) -> PortFuture<'_, BundleManifestRef, ArchiveStoreError>;
    fn append_closure_finding(&mut self, value: ClosureFinding) -> PortFuture<'_, ClosureFindingRef, ArchiveStoreError>;
}
```

约束：一个 archive request 对应唯一 Bundle；(bundle, revision) 与 manifest ID 都唯一。entries/closure 只能由 append_manifest 原子保存，不提供 entry.update 或 closure.save。J05 读取 frozen scope + all required bindings/selected settled attempts/typed inventories，按 exact set 计算；分页未读尽、required source Unknown、owner inventory 不证明闭合均不得 freeze Complete。J06 同 tx 读取 manifest、全部 required assessment、placement、bindings/coverage/sidecars；seal 保存 exact basis 与 state。`assembly_origin_ref`、previous_revision_ref 与 current revision 同时检查，旧 manifest 不作为新 assembly 完成依据。

### 6.8 Local CP4 repository：输入绑定的 assessment

```rust
/// Selects one exact compatibility target without a latest-result fallback.
pub struct CompatibilitySelection {
    pub revision: BundleRevisionRef,
    pub target: CompatibilityTargetContext,
    pub schemas: SchemaVersionRefSet,
}
/// Reads integrity and target-specific compatibility with their findings.
pub trait AssessmentRead: Send + Sync {
    fn get_verification_with_version(&self, key: VerificationAssessmentRef) -> PortFuture<'_, Option<Versioned<VerificationAssessment>>, ArchiveStoreError>;
    fn list_verifications(&self, input: VerificationInputBinding, page: RepositoryPageRequest) -> PortFuture<'_, RepositoryPage<Versioned<VerificationAssessment>>, ArchiveStoreError>;
    fn get_compatibility(&self, key: CompatibilityAssessmentRef) -> PortFuture<'_, Option<CompatibilityAssessment>, ArchiveStoreError>;
    fn list_compatibilities(&self, selection: CompatibilitySelection, page: RepositoryPageRequest) -> PortFuture<'_, RepositoryPage<CompatibilityAssessment>, ArchiveStoreError>;
    fn get_verification_finding(&self, key: VerificationFindingRef) -> PortFuture<'_, Option<VerificationFinding>, ArchiveStoreError>;
    fn list_verification_findings(&self, assessment: AssessmentRef, page: RepositoryPageRequest) -> PortFuture<'_, RepositoryPage<VerificationFinding>, ArchiveStoreError>;
}
/// Stages an assessment with its exact-input safe findings.
pub trait AssessmentWrite: AssessmentRead {
    fn save_verification(&mut self, value: VerificationAssessment, expected: ExpectedVersion) -> PortFuture<'_, Staged<VerificationAssessmentRef>, ArchiveStoreError>;
    fn append_compatibility(&mut self, value: CompatibilityAssessment) -> PortFuture<'_, CompatibilityAssessmentRef, ArchiveStoreError>;
    fn append_verification_finding(&mut self, value: VerificationFinding) -> PortFuture<'_, VerificationFindingRef, ArchiveStoreError>;
}
```

不存在“任意最新成功”的 find。Service 明确选择 assessment refs，再校验 fixed input/target/schema/capability；multiple/conflicting 保守记录，不私选成功项。尚无 assessment 返回 None，不构造 Unknown assessment body；safe view 对可选结果保持 None。Finding ID 由 Archive ID source 分配，adapter 只返回 finding draft，不伪造本地 finding ref。

### 6.9 Local CP5 repository：完整 intent、decision 与 effect 历史

```rust
/// Reads placements, lifecycle executions, and exact external action records.
pub trait StorageStateRead: Send + Sync {
    fn get_placement_with_version(&self, key: ArchivePlacementRef) -> PortFuture<'_, Option<Versioned<ArchivePlacement>>, ArchiveStoreError>;
    fn list_placements(&self, revision: BundleRevisionRef, page: RepositoryPageRequest) -> PortFuture<'_, RepositoryPage<Versioned<ArchivePlacement>>, ArchiveStoreError>;
    fn get_lifecycle_with_version(&self, key: LifecycleExecutionRef) -> PortFuture<'_, Option<Versioned<LifecycleExecution>>, ArchiveStoreError>;
    fn list_lifecycles(&self, revision: BundleRevisionRef, page: RepositoryPageRequest) -> PortFuture<'_, RepositoryPage<Versioned<LifecycleExecution>>, ArchiveStoreError>;
    fn list_lifecycles_by_decision(&self, decision: GovernanceDecisionRef, page: RepositoryPageRequest) -> PortFuture<'_, RepositoryPage<Versioned<LifecycleExecution>>, ArchiveStoreError>;
    fn get_action_with_version(&self, key: ExternalActionRecordRef) -> PortFuture<'_, Option<Versioned<ExternalActionRecord>>, ArchiveStoreError>;
    fn find_action_by_key(&self, key: StorageEffectKey) -> PortFuture<'_, Option<Versioned<ExternalActionRecord>>, ArchiveStoreError>;
    fn list_actions(&self, target: ExternalActionTargetRef, page: RepositoryPageRequest) -> PortFuture<'_, RepositoryPage<Versioned<ExternalActionRecord>>, ArchiveStoreError>;
    fn get_storage_intent(&self, key: StorageIntent) -> PortFuture<'_, Option<StorageDispatchInput>, ArchiveStoreError>;
}
/// Stages effect state without issuing an external request.
pub trait StorageStateWrite: StorageStateRead {
    fn save_placement(&mut self, value: ArchivePlacement, expected: ExpectedVersion) -> PortFuture<'_, Staged<ArchivePlacementRef>, ArchiveStoreError>;
    fn save_lifecycle(&mut self, value: LifecycleExecution, expected: ExpectedVersion) -> PortFuture<'_, Staged<LifecycleExecutionRef>, ArchiveStoreError>;
    fn save_action(&mut self, value: ExternalActionRecord, expected: ExpectedVersion) -> PortFuture<'_, Staged<ExternalActionRecordRef>, ArchiveStoreError>;
    fn append_storage_intent(&mut self, key: StorageIntent, value: StorageDispatchInput) -> PortFuture<'_, StorageIntent, ArchiveStoreError>;
}
```

GovernanceDecisionRef 作为原决定/current block history 内嵌 LifecycleExecution，lookup 正式决定由 GovernanceDecisionPort，禁止本地政策 repo。`list_lifecycles_by_decision` 按 owner+decision ID 找所有受影响记录（含旧版本），然后逐项重新正式核验，不仅 exact 新版匹配导致漏掉旧执行。原决定不被 event 覆盖。

`StorageDispatchInput` 与 StorageIntent 一对一 immutable sidecar，同 action 创建事务保存，完整 schema 在 §6.17；不能只存 opaque intent、重试时从当前 config 重建。action key 唯一约束为 external authority + capability contract + external key，异 digest 拒绝。全部 observations/reconcile_history 原样保存；retrieval 与 placement 两轴不互相替代。

### 6.10 Local CP6 repository：恢复 exact set 与独立 outcome

```rust
/// Reads fixed restore inputs and all owner-specific outcomes.
pub trait RestoreRead: Send + Sync {
    fn get_plan_with_version(&self, key: RestorePlanRef) -> PortFuture<'_, Option<Versioned<RestorePlan>>, ArchiveStoreError>;
    fn list_plans(&self, request: RestoreRequestRef, page: RepositoryPageRequest) -> PortFuture<'_, RepositoryPage<Versioned<RestorePlan>>, ArchiveStoreError>;
    fn get_item_with_version(&self, key: RestoreItemRef) -> PortFuture<'_, Option<Versioned<RestoreItem>>, ArchiveStoreError>;
    fn list_items(&self, plan: RestorePlanRef, page: RepositoryPageRequest) -> PortFuture<'_, RepositoryPage<Versioned<RestoreItem>>, ArchiveStoreError>;
    fn get_handoff_with_version(&self, key: RestoreHandoffRef) -> PortFuture<'_, Option<Versioned<RestoreHandoff>>, ArchiveStoreError>;
    fn find_handoff_by_key(&self, key: ReceiverEffectKey) -> PortFuture<'_, Option<Versioned<RestoreHandoff>>, ArchiveStoreError>;
    fn list_handoffs(&self, item: RestoreItemRef, page: RepositoryPageRequest) -> PortFuture<'_, RepositoryPage<Versioned<RestoreHandoff>>, ArchiveStoreError>;
    fn get_handoff_outcome(&self, key: HandoffOutcomeRef) -> PortFuture<'_, Option<HandoffOutcome>, ArchiveStoreError>;
    fn list_handoff_outcomes(&self, handoff: RestoreHandoffRef, page: RepositoryPageRequest) -> PortFuture<'_, RepositoryPage<HandoffOutcome>, ArchiveStoreError>;
    fn get_compensation_with_version(&self, key: CompensationRecordRef) -> PortFuture<'_, Option<Versioned<CompensationRecord>>, ArchiveStoreError>;
    fn find_compensation_by_key(&self, key: ReceiverEffectKey) -> PortFuture<'_, Option<Versioned<CompensationRecord>>, ArchiveStoreError>;
    fn list_compensations(&self, handoff: RestoreHandoffRef, page: RepositoryPageRequest) -> PortFuture<'_, RepositoryPage<Versioned<CompensationRecord>>, ArchiveStoreError>;
    fn get_restore_material(&self, item: RestoreItemRef) -> PortFuture<'_, Option<PreparedRestoreMaterial>, ArchiveStoreError>;
    fn get_handoff_intent(&self, handoff: RestoreHandoffRef) -> PortFuture<'_, Option<HandoffDispatchInput>, ArchiveStoreError>;
    fn get_compensation_intent(&self, compensation: CompensationRecordRef) -> PortFuture<'_, Option<CompensationDispatchInput>, ArchiveStoreError>;
}
/// Stages per-owner restore truth, immutable observations, and exact effect inputs.
pub trait RestoreWrite: RestoreRead {
    fn save_plan(&mut self, value: RestorePlan, expected: ExpectedVersion) -> PortFuture<'_, Staged<RestorePlanRef>, ArchiveStoreError>;
    fn save_item(&mut self, value: RestoreItem, expected: ExpectedVersion) -> PortFuture<'_, Staged<RestoreItemRef>, ArchiveStoreError>;
    fn save_handoff(&mut self, value: RestoreHandoff, expected: ExpectedVersion) -> PortFuture<'_, Staged<RestoreHandoffRef>, ArchiveStoreError>;
    fn append_handoff_outcome(&mut self, value: HandoffOutcome) -> PortFuture<'_, HandoffOutcomeRef, ArchiveStoreError>;
    fn save_compensation(&mut self, value: CompensationRecord, expected: ExpectedVersion) -> PortFuture<'_, Staged<CompensationRecordRef>, ArchiveStoreError>;
    fn append_restore_material(&mut self, value: PreparedRestoreMaterial) -> PortFuture<'_, RestoreItemRef, ArchiveStoreError>;
    fn append_handoff_intent(&mut self, value: HandoffDispatchInput) -> PortFuture<'_, RestoreHandoffRef, ArchiveStoreError>;
    fn append_compensation_intent(&mut self, value: CompensationDispatchInput) -> PortFuture<'_, CompensationRecordRef, ArchiveStoreError>;
}
```

plan revision key `(request, plan_revision)` 唯一；mutable record_version 不等 immutable plan_revision。item set 与每项 owner/material/assessment input 在同 snapshot 验证 exact equality；不能分页一部分 recompute 成 HandoffComplete。原 handoff commit 与冲突反馈并存，不覆盖已提交证据。PreparedRestoreMaterial 按 item 一次固定；需换 material/input 则新 item/plan revision，不能因 sidecar 更新隐式换来源。handoff/outcome/compensation 与 item/plan posture 在本次局部事务一起保存，不扩成跨 owner 事务。

### 6.11 幂等与完整结果的保存 / 重放

写前问题：Step06 shell 只有 surface_ref，不能支持 duplicate；本节闭合 application-local replay payload，Step08 的公开 DTO 必须从它逐字段投影，新增公开 replay 字段时必须先回填本 schema。原始 public body / provider body 不进入此载体。

```rust
/// Names the local deduplication scope supplied by a validated context binding.
pub struct ArchiveDedupScopeRef(pub String);
/// Selects one channel/operation/key within one explicit caller/source/target scope.
pub struct ArchiveOperationKey {
    pub scope: ArchiveDedupScopeRef,
    pub channel: ArchiveOperationChannel,
    pub operation: ArchiveOperationName,
    pub key: ArchiveOperationIdempotencyKey,
}
/// Preserves every safe per-item effect detail; no counter-only replay is allowed.
pub struct StoredItemResult {
    pub subject: ArchiveRecordRef,
    pub outcome: StoredItemOutcome,
    pub related: Vec<ArchiveRecordRef>,
    pub details: Vec<StoredResultDetail>,
}
/// Preserves exact non-record details returned by a bounded invocation.
pub enum StoredResultDetail {
    HandoffOutcome(HandoffOutcomeRef),
    Manifest(BundleManifestRef),
    SourceFinding(SourceCaptureFindingRef),
    ClosureFinding(ClosureFindingRef),
    VerificationFinding(VerificationFindingRef),
    ManifestEntry(ManifestEntryRef),
    ArchivedMaterial(ArchivedMaterialRef),
    RestoreMaterial(RestoreMaterialRef),
    Stage(JobStageRecordId),
    StorageObservation(ExternalActionObservation),
    ReceiverFeedback(MappedReceiverFeedback),
    CompensationFeedback(MappedCompensationResult),
}
/// Separates local progress from external and owner outcomes.
pub enum StoredItemOutcome {
    Advanced,
    Unchanged,
    Partial { reason: SafeReasonRef },
    Blocked { reason: SafeReasonRef },
    Failed { reason: SafeReasonRef },
    Stale { reason: SafeReasonRef },
    Missing { reason: SafeReasonRef },
    Conflicting { reason: SafeReasonRef },
    UnsupportedVersion { reason: SafeReasonRef },
    IntegrityFailed { reason: SafeReasonRef },
    CommitUnknown { reason: CommitUnknownBasis },
}
/// Preserves admission result refs, not inferred current project state.
pub enum StoredAdmissionResult {
    ArchiveAccepted { request: ArchiveRequestRef, job: ArchiveJobRef },
    RestoreAccepted { request: RestoreRequestRef, job: ArchiveJobRef },
    LifecycleAccepted { execution: LifecycleExecutionRef, action: Option<ExternalActionRecordRef> },
    Rejected { reason: SafeReasonRef },
    Blocked { reason: SafeReasonRef },
}
/// Preserves a bounded consumer/job result including every processed item.
pub struct StoredProgressResult {
    pub disposition: StoredProgressDisposition,
    pub items: Vec<StoredItemResult>,
    pub continuation: Option<WorkerTargetRef>,
}
/// Summarizes only the local invocation and retains safe failure detail.
pub enum StoredProgressDisposition {
    Applied,
    Ignored { reason: SafeReasonRef },
    Partial { reason: SafeReasonRef },
    Blocked { reason: SafeReasonRef },
    Rejected { reason: SafeReasonRef },
    CommitUnknown { reason: CommitUnknownBasis },
}
/// Fixes the exact producing entry on an immutable replay payload.
pub enum StoredArchivePayload {
    RequestArchive(StoredAdmissionResult),
    RequestRestore(StoredAdmissionResult),
    RequestLifecycleExecution(StoredAdmissionResult),
    ConsumeArchiveTrigger(StoredProgressResult),
    ConsumeSourceExportFeedback(StoredProgressResult),
    ConsumeGovernanceDecisionChange(StoredProgressResult),
    ConsumeStorageActionFeedback { target: ExternalActionTargetRef, result: StoredProgressResult },
    ConsumeRestoreReceiverFeedback(StoredProgressResult),
    AdvanceArchiveJob(StoredProgressResult),
    PlanArchiveSources(StoredProgressResult),
    CaptureArchiveSource(StoredProgressResult),
    ReconcileSourceCapture(StoredProgressResult),
    AssembleBundleManifest(StoredProgressResult),
    SealArchiveBundle(StoredProgressResult),
    AssessBundleIntegrity(StoredProgressResult),
    AssessBundleCompatibility(StoredProgressResult),
    PlaceArchiveBundle(StoredProgressResult),
    RetrieveArchiveBundle(StoredProgressResult),
    ExecuteArchiveLifecycle(StoredProgressResult),
    ReconcileExternalAction { target: ExternalActionTargetRef, result: StoredProgressResult },
    BuildRestorePlan(StoredProgressResult),
    PrepareRestoreMaterial(StoredProgressResult),
    DispatchRestoreHandoff(StoredProgressResult),
    ReconcileRestoreHandoff(StoredProgressResult),
    ExecuteRestoreCompensation(StoredProgressResult),
}
/// Supplies all stable fields before the result store assigns its surface reference.
pub struct ArchiveResultToStore {
    pub result_ref: ArchiveApplicationResultRef,
    pub payload: StoredArchivePayload,
    pub trace_id: archive_contracts::context::core_shared::metadata::TraceId,
    pub recorded_at: RecordedAt,
}
/// Couples the complete immutable result and its original operation binding.
pub struct CompleteArchiveResult {
    pub key: ArchiveOperationKey,
    pub input_digest: ArchiveOperationInputDigest,
    pub shell: StoredArchiveOperationResult,
    pub payload: StoredArchivePayload,
}
/// Returns exact reservation and replay state, never a reconstructed result.
pub enum ReservationOutcome {
    Reserved(Versioned<ArchiveIdempotencyRecord>),
    Existing(Versioned<ArchiveIdempotencyRecord>),
    Replay(CompleteArchiveResult),
    Conflict { reason: SafeReasonRef },
}
/// Reads both idempotency state and full immutable result payloads.
pub trait OperationResultRead: Send + Sync {
    fn get_reservation_with_version(&self, key: ArchiveOperationKey) -> PortFuture<'_, Option<Versioned<ArchiveIdempotencyRecord>>, ArchiveStoreError>;
    fn get_complete_result(&self, key: ArchiveApplicationResultRef) -> PortFuture<'_, Option<CompleteArchiveResult>, ArchiveStoreError>;
    fn find_complete_result_by_operation(&self, key: ArchiveOperationKey) -> PortFuture<'_, Option<CompleteArchiveResult>, ArchiveStoreError>;
    fn get_result_by_surface(&self, key: StoredResultSurfaceRef) -> PortFuture<'_, Option<CompleteArchiveResult>, ArchiveStoreError>;
}
/// Stages key reservation and complete result in the same truth transaction.
pub trait OperationResultWrite: OperationResultRead {
    fn reserve_operation(&mut self, context: ArchiveOperationContext, scope: ArchiveDedupScopeRef, digest: ArchiveOperationInputDigest)
        -> PortFuture<'_, ReservationOutcome, ArchiveStoreError>;
    fn save_complete_result(&mut self, key: ArchiveOperationKey, digest: ArchiveOperationInputDigest, value: ArchiveResultToStore)
        -> PortFuture<'_, CompleteArchiveResult, ArchiveStoreError>;
    fn complete_operation(&mut self, key: ArchiveOperationKey, digest: ArchiveOperationInputDigest, result: ArchiveApplicationResultRef, expected: RecordVersion)
        -> PortFuture<'_, Staged<ArchiveOperationKey>, ArchiveStoreError>;
}
```

| 规则 | exact 约束 |
|---|---|
| key namespace | scope+channel+operation+normalized key 是唯一键；scope 明确来自 caller/source/target 正式绑定。不同 channel/operation 隔离；不得在 reserve 猜 channel。namespace encoding/canonical digest 实现仍由 Step13 闭口，未闭口不得生产执行。 |
| selector | 25 non-query variant 与 3+5+17 一一对应；C01/C02/C03 只允许对应 Accepted variant 或 Rejected/Blocked；E04/J12 的 target 是从 action 读回的唯一分支，写入 stable input，不靠 route/config 猜。 |
| payload 明细 | items 按 subject 唯一、顺序固定；related 保存本次已落盘 record refs（outcome、compensation、assessment 等）；details 原样保存 finding/material/stage 及 mapped effect feedback，不需重查当前 truth 来重构原明细。items 空只可 Ignored/Blocked/Rejected，Applied 必须非空。 |
| progress 含义 | Advanced/Applied 只说明局部 invocation 推进；外部 Acknowledged/Committed/Unknown 等由 related action/handoff 与 outcome 明示，不以 Applied 推 archived/restored。continuation 是显式 bounded target，不是统计数或 raw page。 |
| save→complete | save 完整 payload，store 分配 surface_ref 并生成 shell.result_kind；complete 只接受当前 tx 已存同 key/digest/operation 的 result，随后 truth/history/result/reservation/checkpoint 同提交。 |
| scope 持久归属 | ArchiveIdempotencyRecord 不增加 scope 字段；store row/key 必须同时持久完整 ArchiveOperationKey，不可从私有 map 重建。record 的 channel/name/key 与 row key 全等。 |
| duplicate | Completed 必须原样返回 CompleteArchiveResult；不是 shell，不查当前 domain 重新生成报告。错 operation/kind/surface/digest→InputConflict/CorruptRecord；Completed 无 payload→ResultMissing。 |
| Reserved | 新调用不能抢占、完成或将旧 reservation 改 Conflict；按 checkpoint/intent/transaction probe 恢复。异输入返回 Conflict，不修改原 reservation。 |
| replay disclosure | 原 payload 不变；出站前重新 current visibility/authority 校验。撤销后返回统一 NotAvailable/安全拒绝；不泄漏原 refs。duplicate flag 和本次 transport trace 为 overlay，不改变原 recorded_at/trace/payload。 |
| commit-unknown | 仅本地 outcome Unknown 不持久“成功完成”报告。查 transaction/key/result 后决定返回；外部 unknown 可作为已提交的局部保守结果，后续 probe 必须是新的显式操作 key，不重开已 Completed 操作。 |

`IdempotencyCoordinator` 定义在 `idempotency.rs`，仅有 `pub fn validate_context(context: &ArchiveOperationContext, key: &ArchiveOperationKey) -> Result<(), ArchiveSupportError>` 与 `pub fn validate_replay(result: &CompleteArchiveResult, key: &ArchiveOperationKey, digest: &ArchiveOperationInputDigest) -> Result<(), ArchiveStoreError>`；无持久状态、I/O 或 channel fallback。Step06 的 RequestService 泛型 I 固定为该类型；其他写服务使用同 helper 与自身 Tx，避免双 store。

### 6.12 Context / authority / visibility / worker support

#### 6.12.1 ID、时钟与输入等价性

```rust
/// Supplies Archive-owned identities only; external refs are never minted here.
pub trait ArchiveIdSource: Send + Sync {
    fn archive_request_id(&self) -> Result<ArchiveRequestId, ArchiveSupportError>;
    fn restore_request_id(&self) -> Result<RestoreRequestId, ArchiveSupportError>;
    fn job_id(&self) -> Result<ArchiveJobId, ArchiveSupportError>;
    fn stage_id(&self) -> Result<JobStageRecordId, ArchiveSupportError>;
    fn binding_id(&self) -> Result<SourceBindingId, ArchiveSupportError>;
    fn capture_id(&self) -> Result<CaptureAttemptId, ArchiveSupportError>;
    fn source_finding_id(&self) -> Result<SourceCaptureFindingId, ArchiveSupportError>;
    fn bundle_id(&self) -> Result<ArchiveBundleId, ArchiveSupportError>;
    fn manifest_id(&self) -> Result<BundleManifestId, ArchiveSupportError>;
    fn manifest_revision(&self) -> Result<ManifestRevisionId, ArchiveSupportError>;
    fn manifest_entry_id(&self) -> Result<ManifestEntryId, ArchiveSupportError>;
    fn closure_finding_id(&self) -> Result<ClosureFindingId, ArchiveSupportError>;
    fn verification_id(&self) -> Result<VerificationAssessmentId, ArchiveSupportError>;
    fn compatibility_id(&self) -> Result<CompatibilityAssessmentId, ArchiveSupportError>;
    fn verification_finding_id(&self) -> Result<VerificationFindingId, ArchiveSupportError>;
    fn placement_id(&self) -> Result<ArchivePlacementId, ArchiveSupportError>;
    fn lifecycle_id(&self) -> Result<LifecycleExecutionId, ArchiveSupportError>;
    fn action_id(&self) -> Result<ExternalActionId, ArchiveSupportError>;
    fn restore_plan_id(&self) -> Result<RestorePlanId, ArchiveSupportError>;
    fn restore_item_id(&self) -> Result<RestoreItemId, ArchiveSupportError>;
    fn handoff_id(&self) -> Result<RestoreHandoffId, ArchiveSupportError>;
    fn handoff_outcome_id(&self) -> Result<HandoffOutcomeId, ArchiveSupportError>;
    fn compensation_id(&self) -> Result<CompensationRecordId, ArchiveSupportError>;
    fn application_result_id(&self) -> Result<ArchiveApplicationResultId, ArchiveSupportError>;
    fn storage_intent_ref(&self) -> Result<StorageIntent, ArchiveSupportError>;
}
/// Supplies local observation time, not owner time or a lease clock.
pub trait ArchiveClock: Send + Sync {
    fn recorded_at(&self) -> Result<RecordedAt, ArchiveSupportError>;
}
/// Supplies positive ordinals transactionally without mixing them with record versions.
pub trait OrdinalWrite: Send + Sync {
    fn next_plan_revision(&mut self, request: RestoreRequestRef) -> PortFuture<'_, RestorePlanRevision, ArchiveStoreError>;
    fn next_effect_attempt(&mut self, target: ExternalActionTargetRef, intent: StorageIntent) -> PortFuture<'_, ExternalAttemptNumber, ArchiveStoreError>;
    fn next_checkpoint_sequence(&mut self, entry: WorkerEntryRef, target: WorkerTargetRef) -> PortFuture<'_, WorkerCheckpointSequence, ArchiveStoreError>;
}
```

25 ID/ref 方法只分配本地 identity，不产生 key/digest/proof；ID collision 在 store 唯一约束拒绝，不能默认为已有成功。ordinal allocator 与对应记录同 Tx，rollback 不消费可见 ordinal；不能读取 max+1 后在无锁条件下保存。result surface ref、transaction ref、snapshot ref、claim/fence/lease/claim ID/checkpoint ID 由 owning store 分配。ScopeDeclarationVersion 是声明版本，不由通用 ID source 伪造；owner refs、receiver key namespace 与 input digest 必须从正式 codec/binding 得到。Step13 定义稳定 canonical input 算法前，相应 service 在输入校验处 ContractBlocked；本步不私造 digest 字符串或默认 SHA 算法。

#### 6.12.2 正式访问依据，非第八业务 family

```rust
/// Pins an exact authority input to the intended Archive operation.
pub enum ArchiveAuthorityTarget {
    Archive { scope: DeclaredArchiveScope, authority: AuthorityRef },
    Restore { bundle: ArchiveBundleRef, owners: RestoreTargetOwnerSet, authority: RestoreAuthorityRef },
    Lifecycle { revision: BundleRevisionRef, decision: GovernanceDecisionRef, action: LifecycleActionKind },
    Compensation { handoff: RestoreHandoffRef, authority: CompensationAuthorityRef, action: CompensationAction },
}
/// Requests current authorization; actor metadata alone is not permission.
pub struct OperationAuthorityInput {
    pub context: ArchiveOperationContext,
    pub target: ArchiveAuthorityTarget,
}
/// Records the formal boundary's decision for the exact input.
pub enum OperationAuthorityOutcome {
    Allowed { input: OperationAuthorityInput, evidence: ExternalEvidenceRef },
    Denied { reason: SafeReasonRef },
    Unavailable { reason: SafeReasonRef },
    Stale { reason: SafeReasonRef },
    Conflicting { reason: SafeReasonRef },
}
/// Consumes formal access/authority decisions without evaluating policy.
pub trait ArchiveAuthorityPort: Send + Sync {
    fn authorize(&self, input: OperationAuthorityInput) -> PortFuture<'_, OperationAuthorityOutcome, ArchivePortError>;
    fn resolve_admission_visibility(&self, root: OperationRequestRef, input: OperationAuthorityInput)
        -> PortFuture<'_, ArchiveVisibilityBinding, ArchivePortError>;
    fn authorize_replay(&self, context: ArchiveOperationContext, result: CompleteArchiveResult)
        -> PortFuture<'_, ReplayDisclosureOutcome, ArchivePortError>;
}
/// Allows disclosure of the whole saved result or hides it uniformly.
pub enum ReplayDisclosureOutcome {
    Allowed { result_ref: ArchiveApplicationResultRef, evidence: ExternalEvidenceRef },
    NotAvailable,
}
```

该 application-local support seam 提供 caller admission 与 dispatch 的正式依据检查，不拥有决定、RetentionPolicy、legal hold 或 risk。Lifecycle 还必须调用 §6.16 的 current applicability，不能以 Allowed 代替 hold/delete 规则；restore compensation 由 receiver 的正式授权边界再次确认。无 current contract 返回 ContractBlocked/Unavailable。Allowed 只可用于 exact invocation/target，不能跨 item、重试或复用过期观察；外部最后派发必须携带正式 proof，由 receiver/storage 原子检查 freshness/epoch/revocation。若对端不能提供该保证，dispatch blocked，而不是本地时钟比较后假定安全。

authorize_replay 不执行 domain/result mutation；必须覆盖保存结果的全部 refs、details、counts 与原 caller/source/target scope，不能只验证 result ID 属于当前 operation。只允许整份 payload 可披露时 Allowed，否则统一 NotAvailable，不合成缺字段的“原结果”。entry 的 application-local `ArchiveReplayDisclosure<A: ArchiveAuthorityPort>`（private authority:A；`new(authority:A)->Self`；`authorize(context: ArchiveOperationContext, result: CompleteArchiveResult) -> PortFuture<'_, ReplayDisclosureOutcome, ArchivePortError>`）委托此方法，API/worker 不直持 authority port。它是出站安全 helper，不计入八业务 service，也不是新的 Query 入口。

#### 6.12.3 Visibility resolver、同 snapshot provenance 与字段裁剪

```rust
/// Selects one query subject without parsing opaque identifiers.
pub enum ArchiveReadSelector {
    Job(ArchiveJobRef),
    JobForRequest(OperationRequestRef),
    Bundle { bundle: ArchiveBundleRef, revision: Option<ManifestRevisionId> },
    Verification(BundleRevisionRef),
    Plan(RestorePlanRef),
    Handoff(RestoreHandoffRef),
    HandoffForItem(RestoreItemRef),
}
/// Names the explicit formal disclosure scope.
pub struct ArchiveVisibilityScopeRef(pub String);
/// Records the typed resolution source in the same local snapshot.
pub struct ArchiveReadResolution {
    pub selector: ArchiveReadSelector,
    pub subject: ArchiveReadSubjectRef,
    pub scope: ArchiveVisibilityScopeRef,
    pub snapshot: ArchiveReadSnapshotRef,
    pub source_record: ArchiveRecordRef,
    pub source_version: Option<RecordVersion>,
    pub source_marker: ExternalEvidenceRef,
}
/// Reads an admission-bound visibility link; missing is not public existence proof.
pub trait VisibilityResolutionRead: Send + Sync {
    fn resolve_read(&self, selector: ArchiveReadSelector) -> PortFuture<'_, Option<ArchiveReadResolution>, ArchiveStoreError>;
}
/// Pins the formal scope relationship on an admitted root.
pub struct ArchiveVisibilityBinding {
    pub root: OperationRequestRef,
    pub scope: ArchiveVisibilityScopeRef,
    pub source_marker: ExternalEvidenceRef,
}
/// Saves a scope relation atomically with admission, never by parsing a ref.
pub trait VisibilityResolutionWrite: VisibilityResolutionRead {
    fn append_visibility_binding(&mut self, binding: ArchiveVisibilityBinding) -> PortFuture<'_, OperationRequestRef, ArchiveStoreError>;
}
/// Lists independently controlled disclosure categories.
pub enum ArchiveDisclosureField {
    Identity, Status, Reasons, Provenance, SourceVersion, Fence,
    MaterialLocator, Digest, Signature, Decision, StorageLocation,
    StorageTier, CommitReference, Receiver, Counts, History,
}
/// Carries the current formal visibility result and explicit category allow-list.
pub struct CurrentArchiveDisclosure {
    pub decision: ArchiveReadVisibilityDecision,
    pub resolution: ArchiveReadResolution,
    pub allowed_fields: Vec<ArchiveDisclosureField>,
}
/// Resolves current visibility without modifying Archive or owner state.
pub trait ArchiveVisibilityPort: Send + Sync {
    fn evaluate(&self, actor: archive_contracts::context::core_shared::actor::ActorContext, resolution: ArchiveReadResolution)
        -> PortFuture<'_, CurrentArchiveDisclosure, ArchivePortError>;
}
```

visibility binding 的 scope/source_marker 必须由 ArchiveAuthorityPort 的 `resolve_admission_visibility(root, input)` 正式返回；root 在 admission 先分配/确定，返回必须 exact match。只对 C01/C02/E01 的被受理 root 创建链接；lifecycle 使用 Bundle→archive request 已存链接。link 是外部 scope 引用，不是 permission cache；current authority 每次仍由 evaluate 检查。

resolver 在只读 tx 按 typed relation 遍历：Job→request；Bundle/Verification→archive_request；Plan→restore_request；Handoff→item→plan→restore_request；HandoffForItem 使用 item.latest_handoff_ref；Bundle revision None 用已存 current_manifest/current_revision，不造 Draft revision。缺任何 linkage 或 required ref 返回 None；mismatch/corruption 失败，不从 ID、route、project 字符串推 scope。source_record/version/source_marker 及 snapshot 必须与随后 loaded data 核对。元数据 freshness 由 exact local snapshot/revision 判定，不能把外部“允许”当 Current。无当前 visibility、hidden、missing 一律 NotAvailable；允许但必填 ref 不可披露时整项/整 view NotAvailable，不能 synthetic ref。

`allowed_fields` 非空、唯一，来自正式披露决定；可选字段按 allow-list 删除，counts/history/provenance 同步裁剪，不能计 hidden rows。Step08 按十类 safe summary 字段建立 mask 映射；本 Step 不改其 schema。Query store read → formal visibility query → 仍在同只读 snapshot 组 view（无本地写事务）→ 出站前确认当前决定有效，撤权/过期/无法确认则 NotAvailable；不写 read cache。

#### 6.12.4 Worker 持久 carrier 的单一归属修正

下列 Step06 已定义类型迁至 `application::worker_control`，schema 不复制：WorkerEntryRef、WorkerClaimId、WorkerCheckpointId、WorkerLeaseRef、WorkerLeaseExpiresAt、WorkerFenceToken、WorkerCheckpointSequence、WorkerTargetRef、WorkerClaimState、WorkerClaim、WorkerCheckpoint。worker 只导入它们；WorkerEntryKind/consumer/job registry、WorkerEntryState、ArchiveWorkerEntry、WorkerItemDisposition/WorkerIssueRef 仍在 worker。claim/checkpoint factory 错误改用 ArchiveSupportError；技术载体不是正式业务对象。

```rust
/// Selects an exact configured entry and persisted target for a new lease.
pub struct ClaimRequest {
    pub entry: WorkerEntryRef,
    pub operation: ArchiveOperationName,
    pub target: WorkerTargetRef,
    pub holder: archive_contracts::context::core_shared::actor::ActorRef,
}
/// Returns either a granted claim or a non-success control posture.
pub enum ClaimOutcome {
    Acquired(Versioned<WorkerClaim>),
    Busy,
    Missing,
    Blocked { reason: SafeReasonRef },
}
/// Reads persisted control state without granting a new fence.
pub trait WorkerControlRead: Send + Sync {
    fn get_claim_with_version(&self, id: WorkerClaimId) -> PortFuture<'_, Option<Versioned<WorkerClaim>>, ArchiveStoreError>;
    fn latest_checkpoint(&self, entry: WorkerEntryRef, target: WorkerTargetRef) -> PortFuture<'_, Option<WorkerCheckpoint>, ArchiveStoreError>;
    fn get_checkpoint(&self, id: WorkerCheckpointId) -> PortFuture<'_, Option<WorkerCheckpoint>, ArchiveStoreError>;
}
/// Fences a truth transaction and stages its resume point atomically.
pub trait WorkerControlWrite: WorkerControlRead {
    fn protect_with_claim(&mut self, claim: WorkerClaimId, fence: WorkerFenceToken) -> PortFuture<'_, (), ArchiveStoreError>;
    fn append_checkpoint_for_result(&mut self, claim: WorkerClaimId, fence: WorkerFenceToken, sequence: WorkerCheckpointSequence, result: ArchiveApplicationResultRef, recorded_at: RecordedAt)
        -> PortFuture<'_, WorkerCheckpoint, ArchiveStoreError>;
}
/// Implements atomic lease control outside a long-lived business transaction.
pub trait WorkerLeasePort: Send + Sync {
    fn acquire(&self, request: ClaimRequest) -> PortFuture<'_, ClaimOutcome, ArchiveStoreError>;
    fn renew(&self, claim: WorkerClaimId, fence: WorkerFenceToken, expected: RecordVersion) -> PortFuture<'_, ClaimOutcome, ArchiveStoreError>;
    fn release(&self, claim: WorkerClaimId, fence: WorkerFenceToken, expected: RecordVersion) -> PortFuture<'_, Versioned<WorkerClaim>, ArchiveStoreError>;
}
```

lease duration/budget 只由经验证 runtime binding 与 store clock domain 提供；缺配置 Blocked，无默认秒数。本地 worker clock 只能显示，不能证明 fence 有效。protect 在最终 commit 再检查 claim still Active、expiry、新 holder/同 target 单活动 fence；local check 不替代 commit guard。claim acquire 对所有互斥 entry 的同一业务 target 排他，不能只按 entry 分锁使两个操作同时派发。外部不接受 fencing/idempotency 的路径仍 blocked；lease 不能锁住 owner DB。

worker claim 通过 Step06 ArchiveOperationContext.worker_claim 显式带入每个 Job service；from_job 必填，API/consumer/query factory 设 None。service 必须核验 operation/target/holder 与 context 一致，再在所有 intent/result/checkpoint Tx 调 protect_with_claim；不能靠 entry 自己 assert_active 就通过。consumer 只映射反馈或受理，不直接派发外部 effect，使用 exact CAS/read-set 与幂等防乱序；不得伪造 system worker claim。

checkpoint 字段由 store 从实际 claim/result 同 tx 填入，必须读到 staged 完整 result，sequence 来自该 tx allocator；构造名修正为 `from_staged_result`，时间表示本地提交观察输入，只有 commit 确认后可作为已提交 checkpoint 使用。新 worker 先新 claim，再读取 checkpoint；旧 fence 不复用。事件消费的本地 checkpoint/result commit 不等 Bus ACK；ACK 契约见 §9。

result.recorded_at 与 claim.expires_at 不属于可默认相互比较的时钟来源。checkpoint 的 from_staged_result 仅比较 claim state/identity/result；lease 有效性由 store 同一 lease clock 在 protect 和 commit 时验证，不将 application RecordedAt 传作租期证明。renew 返回 same claim/lease/fence 的新 expiry 与 RecordVersion，acquired_at 不变；epoch 变化只能新 acquire。

### 6.13 SourceExportPort 与 source-authority matrix

#### 6.13.1 先核验 source-authority，不统一成 canonical export

| SourceClass | 正式 authority / owning project | 允许 material class | coverage / fence / restore 限制 | blocker |
|---|---|---|---|---|
| Identity | L1-identity | CanonicalSnapshot | owner-approved scope/version；receiver 必须 identity 正式边界 | AR-UP-001/009 |
| Conversation | L1-conversation | CanonicalSnapshot | 只取获准正文或 ref；trace handoff 不是完整 conversation export | AR-UP-001/009 |
| Work | L1-work | CanonicalSnapshot | Project/WorkItem 状态与 archived/dissolved/restored 都由 work 决定 | AR-UP-001/002/009 |
| Process | L1-process | CanonicalSnapshot | owner instance/checkpoint 恢复连续性，不重放 runtime execution | AR-UP-001/009 |
| Governance | L1-governance 或其明确 owner | CanonicalSnapshot / DecisionReference | owner 声明决定版本和范围，Archive 不执行政策解释 | AR-UP-001/003/009 |
| Artifact | L1-artifact | ArtifactMaterial | body/version/lineage/baseline 各自 closure 由 owner 证明，不能用 ref count 补正文 | AR-UP-006/009 |
| WorkspaceProjection | L1-workspace | WorkspaceProjection | 永远 Auxiliary；view generation/coverage 不代 source fence；无正式 receiver 不 restore | AR-UP-008/009 |
| ObservabilityMaterial | L4-observability | ObservabilityMaterial | 必须获准脱敏；材料不等完整审计链/后端 | AR-UP-007/009 |

八类 owner 是 runtime/ref，异步反馈为 event；本地 port/infra 实现为 adapter；测试为 fake。无 L1/L4 sibling compile dependency。Conditional 的条件判定必须 owner 正式回复；Archive 不将未决定条件当“不需要”。不同 owner fence 不合成全局 wall-clock snapshot；跨域一致性仅能声明每源 fence 与显式未闭合关系。

#### 6.13.2 完整 required carrier

```rust
/// Requests one explicit source binding under an admitted immutable scope.
pub struct SourceBindingInput {
    pub binding: SourceBindingRef,
    pub scope: DeclaredScopeRef,
    pub declaration: DeclaredArchiveScope,
    pub selector: OwnerSliceSelector,
    pub requiredness: SourceRequiredness,
    pub authority: AuthorityRef,
}
/// Returns only owner-proven binding and conditional participation.
pub enum SourceBindingOutcome {
    Bound { input: SourceBindingInput, authority: SourceAuthorityRef, contract: SourceContractRef, participation: SourceParticipation, fence: Option<SnapshotFenceRef> },
    Blocked { reason: SafeReasonRef },
    Unsupported { reason: SafeReasonRef },
    Conflicting { reason: SafeReasonRef },
}
/// Makes conditional participation explicit without evaluating policy locally.
pub enum SourceParticipation {
    Included { basis: ExternalEvidenceRef },
    Excluded { basis: ExternalEvidenceRef },
    Undecided { reason: SafeReasonRef },
}
/// Pins all correlation and authorization inputs before capture or probe.
pub struct SourceCaptureInput {
    pub attempt: CaptureAttemptRef,
    pub binding: SourceBindingRef,
    pub scope: DeclaredScopeRef,
    pub selector: OwnerSliceSelector,
    pub authority: SourceAuthorityRef,
    pub contract: SourceContractRef,
    pub capture_authority: AuthorityRef,
    pub requested_fence: Option<SnapshotFenceRef>,
}
/// Carries a safe owner-declared member without inventing a local entry ID.
pub struct DeclaredSourceMember {
    pub member: ManifestMemberKeyRef,
    pub material_class: ArchiveMaterialClass,
    pub source_version: Option<SourceVersionRef>,
}
/// Carries one actually approved material member and its exact locator/schema.
pub struct CapturedSourceMember {
    pub member: ManifestMemberKeyRef,
    pub material_class: ArchiveMaterialClass,
    pub material: ArchivedMaterialRef,
    pub locator: MaterialLocatorRef,
    pub source_version: Option<SourceVersionRef>,
    pub digest: Option<DigestRef>,
    pub schemas: SchemaVersionRefSet,
}
/// Carries safe finding inputs; application assigns Archive finding IDs.
pub struct SourceFindingDraft {
    pub kind: SourceCaptureFindingKind,
    pub subject: SafeSourceSubjectRef,
    pub basis: Option<ExternalEvidenceRef>,
}
/// Preserves one final owner-mapped observation for a fixed capture attempt.
pub struct SourceCaptureObservation {
    pub input: SourceCaptureInput,
    pub coverage: OwnerCoverageEvidence,
    pub declared: Vec<DeclaredSourceMember>,
    pub actual: Vec<CapturedSourceMember>,
    pub inventory_evidence: ExternalEvidenceRef,
    pub findings: Vec<SourceFindingDraft>,
}
/// Adds the application observation time to a complete immutable source observation.
pub struct CapturedSourceRecord {
    pub observation: SourceCaptureObservation,
    pub recorded_at: RecordedAt,
}
/// Separates a mappable observation from pending or unavailable capture capability.
pub enum SourceCaptureOutcome {
    Observed(SourceCaptureObservation),
    Pending { input: SourceCaptureInput, feedback: ExternalFeedbackRef },
    Blocked { input: SourceCaptureInput, reason: SafeReasonRef },
    Failed { input: SourceCaptureInput, reason: SafeReasonRef },
    Unknown { input: SourceCaptureInput, reason: SafeReasonRef },
}
/// Requests minimal owner-specific restore material from fixed archived members.
pub struct RestoreMaterialInput {
    pub item: RestoreItemRef,
    pub revision: BundleRevisionRef,
    pub owner: RestoreOwnerRef,
    pub receiver: RestoreReceiverRef,
    pub entries: Vec<RestoreMaterialEntry>,
    pub authority: RestoreAuthorityRef,
}
/// Keeps each selected manifest entry coupled to its exact source and captured material.
pub struct RestoreMaterialEntry {
    pub entry: ManifestEntryRef,
    pub binding: SourceBindingRef,
    pub attempt: CaptureAttemptRef,
    pub member: CapturedSourceMember,
}
/// Pins the owner-approved material and every input used to prepare it.
pub struct PreparedRestoreMaterial {
    pub input: RestoreMaterialInput,
    pub material: RestoreMaterialRef,
    pub evidence: ExternalEvidenceRef,
}
/// Retains every prerequisite posture without deriving success from ref existence.
pub enum RestoreMaterialOutcome {
    Prepared(PreparedRestoreMaterial),
    Partial { reason: SafeReasonRef },
    Stale { reason: SafeReasonRef },
    Missing { reason: SafeReasonRef },
    Conflicting { reason: SafeReasonRef },
    UnsupportedVersion { reason: SafeReasonRef },
    IntegrityFailed { reason: SafeReasonRef },
    Blocked { reason: SafeReasonRef },
    Unknown { reason: SafeReasonRef },
}
/// Consumes formal owner export/material capabilities; never reads owner databases.
pub trait SourceExportPort: Send + Sync {
    fn bind_source(&self, input: SourceBindingInput) -> PortFuture<'_, SourceBindingOutcome, ArchivePortError>;
    fn capture(&self, input: SourceCaptureInput) -> PortFuture<'_, SourceCaptureOutcome, ArchivePortError>;
    fn probe_capture(&self, input: SourceCaptureInput) -> PortFuture<'_, SourceCaptureOutcome, ArchivePortError>;
    fn prepare_restore_material(&self, input: RestoreMaterialInput) -> PortFuture<'_, RestoreMaterialOutcome, ArchivePortError>;
}
```

`bind_source` 的 participation/fence 与 capture input 必须持久，而不是下次从当前配置重建：binding/attempt key 对应 immutable sidecar 的 exact get/append 在 §6.19 补充，维持 single authority。requested_fence 只从 BoundSourceRecord.fence 或显式已保存的正式 owner fence 请求读取，不由 ArchiveClock/worker fence 生成；新 owner fence 需要新 binding/attempt 语境。Required 不允许 Excluded；Auxiliary 不计 canonical closure；Conditional Undecided 阻塞包闭口。declared/actual 各按 `(member, material_class)` 唯一，跨 binding 分开比较；空集只有 owner 的明确 inventory/coverage 证明才能作为空内容，Unknown 不能空集化。实际 material refs 与 CaptureAttempt.material_refs exact equality；locator/digest/version/schema 不从 material ref 字符串推导。

Observed 可含 Partial/Stale/Missing/Conflicting/Unknown coverage，保存真实观察，不自动成功；source authority/scope/selector/attempt/fence correlation 错误拒绝映射。正向 complete 必须证据覆盖 exact declaration、版本和所要求 fence；owner 不支持 fence 时按所需一致性声明阻塞，不造 fence。application 接收完整 SourceCaptureObservation 后从 ArchiveClock 取得 recorded_at，组装 CapturedSourceRecord；adapter 不生成本地时间或以 provider timestamp 替换。prepare 不能捕获当前 live truth 当 archived material，不允许 owner 依赖循环；源 owner 没有正式 material preparation 合同即 blocked。

映射顺序：adapter 返回无本地 finding ID 的 draft → application ID source → SourceCaptureFinding::record → refs 集合 → CaptureCoverage::assess → CaptureAttempt::settle，并在一个 tx 保存 source record/coverage/findings。对端不得 mint Archive IDs。Source capture 超时未知用 block/reconcile posture，不能当 Missing 或失败；probe 不支持时 Unknown，禁止盲 recapture。

### 6.14 IntegrityCapabilityPort

```rust
/// Carries finding inputs without pretending the adapter persisted a finding.
pub struct VerificationFindingDraft {
    pub kind: VerificationFindingKind,
    pub subject: SafeVerificationSubjectRef,
    pub basis: Option<CapabilityEvidenceRef>,
}
/// Pins one integrity invocation to an existing assessment and immutable input.
pub struct IntegrityInput {
    pub assessment: VerificationAssessmentRef,
    pub input: VerificationInputBinding,
    pub capability: IntegrityCapabilityRef,
}
/// Distinguishes verified evidence from persistable negative/unknown outcomes.
pub enum IntegrityOutcome {
    Verified { input: IntegrityInput, evidence: IntegrityEvidence },
    IntegrityFailed { input: IntegrityInput, findings: Vec<VerificationFindingDraft> },
    Unknown { input: IntegrityInput, findings: Vec<VerificationFindingDraft> },
    Blocked { input: IntegrityInput, reason: SafeReasonRef },
}
/// Resolves the formally bound capability without selecting an algorithm locally.
pub enum IntegrityCapabilityOutcome {
    Available(IntegrityCapabilityRef),
    Blocked(SafeReasonRef),
}
/// Verifies only exact fixed inputs under a formal integrity capability.
pub trait IntegrityCapabilityPort: Send + Sync {
    fn resolve(&self, input: VerificationInputBinding) -> PortFuture<'_, IntegrityCapabilityOutcome, ArchivePortError>;
    fn assess(&self, input: IntegrityInput) -> PortFuture<'_, IntegrityOutcome, ArchivePortError>;
    fn probe(&self, input: IntegrityInput) -> PortFuture<'_, IntegrityOutcome, ArchivePortError>;
}
```

application persist Pending/InProgress assessment/input 后才 assess。Verified 的 evidence.input_binding/capability 必须 exact match，digest/signature refs 至少一类非空且是正式 capability 产物；缺算法、key authority、签名验证、加密解密/压缩可读规则时 Blocked/Unknown，不用本地 SafeInputDigest 代替。IntegrityFailed/Unknown findings 非空；application 分配 IDs 并保存后构造 Step06 MappedIntegrityResult。失联不自动另开 assessment，当原 capability 不支持 probe 时保持 Unknown，重评需显式新 assessment。完整性证明仅固定材料，不等业务真实性或复原权限。

### 6.15 CompatibilityCapabilityPort

```rust
/// Pins the exact manifest, schemas, and verification/read/receiver target.
pub struct CompatibilityInput {
    pub assessment: CompatibilityAssessmentRef,
    pub selection: CompatibilitySelection,
}
/// Retains target-specific support without schema transformation authority.
pub enum CompatibilityOutcome {
    Supported { input: CompatibilityInput, capability: CompatibilityCapabilityRef },
    Unsupported { input: CompatibilityInput, findings: Vec<VerificationFindingDraft> },
    Unknown { input: CompatibilityInput, findings: Vec<VerificationFindingDraft> },
    Conflicting { input: CompatibilityInput, findings: Vec<VerificationFindingDraft> },
}
/// Checks formal compatibility; it cannot migrate a schema or rewrite a Bundle.
pub trait CompatibilityCapabilityPort: Send + Sync {
    fn assess(&self, input: CompatibilityInput) -> PortFuture<'_, CompatibilityOutcome, ArchivePortError>;
}
```

输入 ID 与固定 selection 在 operation reservation/intent 存储后调用，immutable CompatibilityAssessment 与 findings 一次 append。schema set 空只能 Unknown；Supported 要正式非空 schema + exact target/capability。Unsupported/Conflicting 需 formal evidence；缺 capability 合同属于 Err ContractBlocked，application 可保存有 Unknown finding 的 assessment，但不能伪造正式 unsupported proof。`RestoreReceiver(R)` 与 Read/Verification 不互换，未来 schema evolution 需要 owner 正式版本转换接缝，本地无 migrate 方法。Integrity/Compatibility refs 不承载 raw key、signature body 或 schema body。

### 6.16 GovernanceDecisionPort

```rust
/// Pins one lifecycle decision to the exact target and action.
pub struct GovernanceCheckInput {
    pub decision: GovernanceDecisionRef,
    pub revision: BundleRevisionRef,
    pub action: LifecycleActionKind,
}
/// Preserves current applicability and formal hold/decision conflicts.
pub enum GovernanceCheckOutcome {
    Applicable(GovernanceApplicabilityProof),
    Held(LifecycleBlockBasis),
    Stale(LifecycleBlockBasis),
    Conflicting(LifecycleBlockBasis),
    Denied(LifecycleBlockBasis),
    Missing { reason: SafeReasonRef },
    Unknown { reason: SafeReasonRef },
}
/// Resolves only a formally published decision binding.
pub enum GovernanceLookupOutcome {
    Found(MappedGovernanceDecisionBinding),
    Missing { reason: SafeReasonRef },
    Unknown { reason: SafeReasonRef },
    Conflicting { reason: SafeReasonRef },
}
/// Queries a formally authorized lifecycle compensation observation.
pub struct LifecycleCompensationInput {
    pub execution: LifecycleExecutionRef,
    pub decision: GovernanceDecisionRef,
    pub revision: BundleRevisionRef,
    pub action: LifecycleActionKind,
}
/// Separates actual compensation proof from a request or approval to compensate.
pub enum LifecycleCompensationOutcome {
    Completed { input: LifecycleCompensationInput, evidence: LifecycleCompensationEvidenceRef },
    Pending { reason: SafeReasonRef },
    Blocked { reason: SafeReasonRef },
    Unknown { reason: SafeReasonRef },
}
/// Consumes governance truth; no policy, retention, hold, or deletion decision is made here.
pub trait GovernanceDecisionPort: Send + Sync {
    fn lookup(&self, decision: GovernanceDecisionRef) -> PortFuture<'_, GovernanceLookupOutcome, ArchivePortError>;
    fn check_current(&self, input: GovernanceCheckInput) -> PortFuture<'_, GovernanceCheckOutcome, ArchivePortError>;
    fn observe_lifecycle_compensation(&self, input: LifecycleCompensationInput) -> PortFuture<'_, LifecycleCompensationOutcome, ArchivePortError>;
}
```

lookup 给出的 owner/ID/version/scope/validity/kind 必须一起原子映射；Found 不等 Applicable。派发前 check_current，Applicable proof 与 original decision/version/revision/action exact match；新版 hold 不能被旧 release/delete 覆盖。旧 execution 保留 original decision 和 current block history；Missing/Unknown 无 current decision 时不能造 LifecycleBlockBasis，只保存 safe blocker/result，不清除已有 dispatched/unknown 姿态。

Archive 不定义保留期限或销毁规则，没有 `approve_delete`、`release_hold`、`accept_risk`。Completed lifecycle compensation 只作为正式已发生事实观察，不等允许 Archive 主动执行补偿；restore CompensationRecord 仍另归 receiver。AR-UP-003 未闭合前正向 production check/compensation mapping 全 blocked。

### 6.17 ArchiveStoragePort

```rust
/// Identifies one formally bound storage capability without an endpoint or vendor SDK.
pub struct StorageCapabilityRef(pub String);
/// Scopes a storage idempotency key to its actual external authority and contract.
pub struct StorageEffectKey {
    pub owner: OwnerRef,
    pub capability: StorageCapabilityRef,
    pub key: ExternalIdempotencyKey,
}
/// Pins the exact action correlation before any external I/O.
pub struct StorageActionContext {
    pub action: ExternalActionRecordRef,
    pub target: ExternalActionTargetRef,
    pub revision: BundleRevisionRef,
    pub intent: StorageIntent,
    pub key: StorageEffectKey,
    pub digest: SafeInputDigest,
    pub attempt: ExternalAttemptNumber,
}
/// Carries all provider-neutral inputs needed to replay or probe one original effect.
pub enum StorageDispatchInput {
    Place {
        context: StorageActionContext,
        input: VerificationInputBinding,
        storage_policy: ExternalEvidenceRef,
    },
    Retrieve {
        context: StorageActionContext,
        placement: ArchivePlacementRef,
        location: StorageLocationRef,
        tier: StorageTierRef,
        commit: ExternalCommitRef,
    },
    Lifecycle {
        context: StorageActionContext,
        execution: LifecycleExecutionRef,
        proof: GovernanceApplicabilityProof,
    },
}
/// Returns a formal mapping for placement policy/location handling without choosing a provider.
pub enum StorageBindingOutcome {
    Bound { owner: OwnerRef, capability: StorageCapabilityRef, storage_policy: ExternalEvidenceRef },
    Blocked { reason: SafeReasonRef },
    Unsupported { reason: SafeReasonRef },
}
/// Retains the complete original input with its correlated observation.
pub struct StorageObservedOutcome {
    pub input: StorageDispatchInput,
    pub observation: ExternalActionObservation,
}
/// Pins an active execution fence separately from the immutable effect input.
pub struct ExternalDispatchPermit {
    pub operation: ArchiveOperationName,
    pub target: WorkerTargetRef,
    pub claim: WorkerClaimId,
    pub fence: WorkerFenceToken,
    pub authority_evidence: Option<ExternalEvidenceRef>,
}
/// Executes or probes only a previously committed, exact Archive storage intent.
pub trait ArchiveStoragePort: Send + Sync {
    fn resolve_binding(&self, revision: BundleRevisionRef) -> PortFuture<'_, StorageBindingOutcome, ArchivePortError>;
    fn dispatch(&self, input: StorageDispatchInput, permit: ExternalDispatchPermit) -> PortFuture<'_, StorageObservedOutcome, ArchivePortError>;
    fn probe(&self, input: StorageDispatchInput) -> PortFuture<'_, StorageObservedOutcome, ArchivePortError>;
    fn inspect_retrievability(&self, revision: BundleRevisionRef, placement: ArchivePlacementRef, location: StorageLocationRef, commit: ExternalCommitRef)
        -> PortFuture<'_, MappedRetrievalResult, ArchivePortError>;
}
```

`storage_policy` 是外部正式承载规则 evidence/ref，不是本仓配置的 vendor/tier/期限；缺 profile/capability、压缩、加密或内容打包合同则 Bound 不成立。Place 所有材料由 exact manifest verification input 提供；Retrieve 只用已提交 placement 的 location/tier/commit；Lifecycle 只用 formal proof，不为 delete/retain 伪造 location。所有 context 字段来自 committed action+sidecar，expected_version 来自本地再读取而不发给 provider 当 authority。

dispatch/probe 必须验证 input 与 observation 的 action/target/revision/operation/key/digest 全等；input 内 attempt/owner/capability 也须 formal response correlation 支持，不能因为 body 碰巧一致就接纳另一次 provider 回调。probe 是只读外部核对，绝不可偷偷重发；不支持 probe 返回 conservative CommitUnknown，不发第二次。

`MayHaveDispatched` 错误必须 application 保存 action.require_reconcile；与 placement/execution/result 同提交。ACK 不更新 Committed；retrieval effect Committed 和 retrievability evidence 独立。inspect 是 operation 前提读取，Q03 等 Query 不能调用它。危险 lifecycle dispatch 要对端正式验证 proof 仍有效并拒绝新 hold/stale decision；不能保证 TOCTOU 安全时阻塞。签名/KMS/secret 或 vendor endpoint 全留 infra runtime binding，不成为本地 truth。

### 6.18 RestoreReceiverPort

```rust
/// Scopes receiver idempotency independently from storage and from other owners.
pub struct ReceiverEffectKey {
    pub owner: RestoreOwnerRef,
    pub receiver: RestoreReceiverRef,
    pub key: ReceiverIdempotencyKey,
}
/// Requests a formal receiver for one owner and fixed restore input.
pub struct ReceiverResolveInput {
    pub owner: RestoreOwnerRef,
    pub revision: BundleRevisionRef,
    pub authority: RestoreAuthorityRef,
}
/// Returns a receiver binding only when the owner formally supports it.
pub enum ReceiverResolveOutcome {
    Bound { input: ReceiverResolveInput, receiver: RestoreReceiverRef, evidence: ExternalEvidenceRef },
    Missing { reason: SafeReasonRef },
    UnsupportedVersion { reason: SafeReasonRef },
    Conflicting { reason: SafeReasonRef },
    Blocked { reason: SafeReasonRef },
}
/// Pins every input sent across one owner's restore boundary.
pub struct HandoffDispatchInput {
    pub handoff: RestoreHandoffRef,
    pub item: RestoreItemRef,
    pub plan: RestorePlanRef,
    pub plan_revision: RestorePlanRevision,
    pub key: ReceiverEffectKey,
    pub digest: SafeInputDigest,
    pub eligibility: RestoreEligibilityBasis,
    pub material: PreparedRestoreMaterial,
    pub receiver_evidence: ExternalEvidenceRef,
}
/// Retains the original input with a formally correlated owner feedback.
pub struct HandoffObservedOutcome {
    pub input: HandoffDispatchInput,
    pub feedback: MappedReceiverFeedback,
}
/// Pins a separately authorized compensation without altering original handoff history.
pub struct CompensationDispatchInput {
    pub compensation: CompensationRecordRef,
    pub handoff: RestoreHandoffRef,
    pub key: ReceiverEffectKey,
    pub digest: SafeInputDigest,
    pub authority: CompensationAuthorityRef,
    pub action: CompensationAction,
    pub original: HandoffDispatchInput,
}
/// Preserves compensation feedback for its exact independent effect key.
pub struct CompensationObservedOutcome {
    pub input: CompensationDispatchInput,
    pub outcome: MappedCompensationResult,
}
/// Dispatches only through formal owner receivers, never through shared database access.
pub trait RestoreReceiverPort: Send + Sync {
    fn resolve(&self, input: ReceiverResolveInput) -> PortFuture<'_, ReceiverResolveOutcome, ArchivePortError>;
    fn dispatch(&self, input: HandoffDispatchInput, permit: ExternalDispatchPermit) -> PortFuture<'_, HandoffObservedOutcome, ArchivePortError>;
    fn probe_handoff(&self, input: HandoffDispatchInput) -> PortFuture<'_, HandoffObservedOutcome, ArchivePortError>;
    fn compensate(&self, input: CompensationDispatchInput, permit: ExternalDispatchPermit) -> PortFuture<'_, CompensationObservedOutcome, ArchivePortError>;
    fn probe_compensation(&self, input: CompensationDispatchInput) -> PortFuture<'_, CompensationObservedOutcome, ArchivePortError>;
}
```

receiver outcome 必须与 owner/receiver/handoff/item/plan/material/revision/key/digest 全匹配；Succeeded 必有 formal ReceiverCommitRef，Acknowledged 只能等待，Conflicting 另存观察并 reconcile，不消掉已知 commit。Bundle/eligibility refs 不是写权限；owner import/restore/command/handoff 接收方负责业务提交与自身权限检查。

compensate 仅在 ArchiveAuthorityPort 与 receiver 正式处置 authority 同时有效时运行，使用独立 key/digest，不借原 handoff key；action ManualHandoff 不通过 effect adapter 自动反写，应等待正式人工 handoff 接缝或保持 Blocked，不能把所有 action 都转换为 reverse SQL。probe_compensation 不代行 compensation；RetryAfterProbe 必须先由正式 probe 证明未提交，原 unknown effect 未查明前不得盲 retry。即便所有 handoff/compensation Completed，项目 restored 仍只由 owning domain 判断。

AR-UP-009（以及材料/完整性相关 blocker）阻断 production。本文 input/outcome 是 Archive 本地 required shape，不声明对端已经拥有同名方法或响应字段。

ExternalDispatchPermit 在 application 从当前已验证 claim 与本次正式 authority outcome 构造，不能由 API/worker 任意输入；它不是新的 authority truth。Lifecycle/Handoff/Compensation 必须 authority_evidence=Some；Place/Retrieve 可 None，但须 input 内正式 storage policy/已提交 placement 的权限合同成立。permit 与 immutable intent 分离，重取 claim 不改变原 external key/digest；adapter 必须把正式 fencing/authorization 语义映射到对端支持的机制，不假定对端理解 Archive token。缺少该机制仍由 AR-UP-005/009 阻断。probe 不需要写 permit、不得产生任何重试副作用。

effect unique guard 除 key 唯一外，还要求同一逻辑 target/operation/fixed input 不得并存两个未解决 intent：placement 按 bundle revision + approved storage policy，retrieval 按 placement + revision，lifecycle 按 execution + action，handoff 按 item + material + receiver，compensation 按 handoff + formal authority + action。重复 stage 必须查既有 intent/result，未知未解决时不得生成新 external key 绕过幂等；需要替代/新版本必须显式处置旧记录。索引物理写法在 Step11，guard 在同 Tx read-set/unique validation 执行，不能靠 worker entry 锁单独保证。

### 6.19 Application 模块内停审

#### 6.19.1 补齐引用到完整 fixed input 的读取 / 保存

写前复核：仅把 source binding、compatibility input、manifest selected attempts 写在 prose 会让实现猜 source selection；本节用 immutable 技术 carrier 与 typed save/get 封口，不新建业务对象。业务引用对象仍唯一，sidecar 只承载它没保存但重试/guard 必须使用的输入。

```rust
/// Freezes a formally resolved binding and its explicit participation basis.
pub struct BoundSourceRecord {
    pub input: SourceBindingInput,
    pub authority: SourceAuthorityRef,
    pub contract: SourceContractRef,
    pub participation: SourceParticipation,
    pub fence: Option<SnapshotFenceRef>,
}
/// Pins exactly one selected settled attempt for a manifest source binding.
pub struct ManifestSourceSelection {
    pub binding: SourceBindingRef,
    pub attempt: Option<CaptureAttemptRef>,
}
/// Records the complete source selection behind an immutable manifest.
pub struct ManifestSourceRecord {
    pub manifest: BundleManifestRef,
    pub revision: BundleRevisionRef,
    pub scope: DeclaredScopeRef,
    pub sources: Vec<ManifestSourceSelection>,
}
/// Reads all immutable inputs required for retry, assembly, and guard reconstruction.
pub trait FixedInputRead: Send + Sync {
    fn get_bound_source(&self, binding: SourceBindingRef) -> PortFuture<'_, Option<BoundSourceRecord>, ArchiveStoreError>;
    fn get_capture_input(&self, attempt: CaptureAttemptRef) -> PortFuture<'_, Option<SourceCaptureInput>, ArchiveStoreError>;
    fn get_compatibility_input(&self, assessment: CompatibilityAssessmentRef) -> PortFuture<'_, Option<CompatibilityInput>, ArchiveStoreError>;
    fn get_manifest_sources(&self, manifest: BundleManifestRef) -> PortFuture<'_, Option<ManifestSourceRecord>, ArchiveStoreError>;
}
/// Stages immutable fixed inputs with the record that owns each key.
pub trait FixedInputWrite: FixedInputRead {
    fn append_bound_source(&mut self, value: BoundSourceRecord) -> PortFuture<'_, SourceBindingRef, ArchiveStoreError>;
    fn append_capture_input(&mut self, value: SourceCaptureInput) -> PortFuture<'_, CaptureAttemptRef, ArchiveStoreError>;
    fn append_compatibility_input(&mut self, value: CompatibilityInput) -> PortFuture<'_, CompatibilityAssessmentRef, ArchiveStoreError>;
    fn append_manifest_sources(&mut self, value: ManifestSourceRecord) -> PortFuture<'_, BundleManifestRef, ArchiveStoreError>;
}
/// Aggregates the read-only local repository family without a write capability.
pub trait ArchiveReadPorts:
    AdmissionRead + CaptureRead + BundleRead + AssessmentRead + StorageStateRead + RestoreRead
    + OperationResultRead + VisibilityResolutionRead + WorkerControlRead + FixedInputRead
    + WorkerCandidateRead {}
/// Aggregates transaction-only staged writes and complete guard reads.
pub trait ArchiveWritePorts:
    ArchiveReadPorts + AdmissionWrite + CaptureWrite + BundleWrite + AssessmentWrite
    + StorageStateWrite + RestoreWrite + OperationResultWrite + VisibilityResolutionWrite
    + WorkerControlWrite + OrdinalWrite + FixedInputWrite {}
```

implementor 必须显式实现 aggregate marker trait（不凭正文暗含 blanket impl）。sources 非空且按 binding 唯一；每个正式 Included binding 只能选一个已保存 attempt，attempt/binding/request/scope/authority 匹配。Conditional 正式 Excluded 的 binding 保留在 sources 且 attempt=None，读取 BoundSourceRecord.participation 的正式 exclusion evidence；Undecided 不能借 None 充当 Excluded。需要新 capture 则新 manifest，不能替换旧 sidecar。SourceParticipation 在 binding 成功时固定；若正式条件变化需显式退休旧 binding、新绑定/manifest，不能在当前配置覆盖。compatibility input 在调用前有稳定 key，返回同 key final assessment；同 key 异 selection 拒绝。所有 sidecar get missing 都是前提缺失，不能到 fake private map 找补。

RestoreMaterialInput.entries 是非空、按 entry 唯一且稳定排序的 RestoreMaterialEntry 集合；entry 必须来自 fixed manifest.actual_entries，binding/attempt 来自该 manifest 的 ManifestSourceRecord，member 与 CapturedSourceRecord 中对应 member/class 完全相等。集合投影出的 ManifestEntryRefSet 必须等于 RestoreItem.source_entry_refs，不能用 entries/members 两个并行数组靠顺序猜关系；跨 owner 的 binding 拒绝。PreparedRestoreMaterial、eligibility、handoff.input 的 material/owner/receiver/revision/entry set 全等。

#### 6.19.2 八 service 的 exact constructor bounds 与调用权限

| Service 泛型位置 | 要求的 bounds / concrete helper | 允许的 repository 子能力与外部方法 |
|---|---|---|
| ArchiveRequestService `<S,I,C>` | S: ArchiveStorePort；I=IdempotencyCoordinator；C: ArchiveIdSource + ArchiveClock + ArchiveAuthorityPort | Admission/Result/Visibility write，CP posture read；authority admission |
| SourceCaptureService `<S,E,C>` | S: ArchiveStorePort；E: SourceExportPort；C: ArchiveIdSource + ArchiveClock | Capture/FixedInput/Result，Admission read；bind/capture/probe |
| BundleAssemblyService `<S,C>` | S: ArchiveStorePort；C: ArchiveIdSource + ArchiveClock | Bundle/FixedInput write；Capture/Assessment/StorageState/Admission read；无 external effect |
| BundleVerificationService `<S,I,V,C>` | S: ArchiveStorePort；I: IntegrityCapabilityPort；V: CompatibilityCapabilityPort；C: ArchiveIdSource + ArchiveClock | Assessment/FixedInput/Result；Bundle/Capture read；assess/probe |
| PlacementService `<S,A,C>` | S: ArchiveStorePort；A: ArchiveStoragePort；C: ArchiveIdSource + ArchiveClock | StorageState/Result；Bundle/Assessment read；place/retrieve/probe |
| LifecycleExecutionService `<S,G,A,C>` | S: ArchiveStorePort；G: GovernanceDecisionPort；A: ArchiveStoragePort；C: ArchiveIdSource + ArchiveClock + ArchiveAuthorityPort | StorageState/Result；Bundle read；current decision/authorized storage |
| RestoreService `<S,E,I,V,A,R,C>` | S: ArchiveStorePort；E: SourceExportPort；I: IntegrityCapabilityPort；V: CompatibilityCapabilityPort；A: ArchiveStoragePort；R: RestoreReceiverPort；C: ArchiveIdSource + ArchiveClock + ArchiveAuthorityPort | Restore/Result；Admission/Bundle/Capture/Assessment/FixedInput read；material/eligibility/receiver |
| ArchiveQueryService `<R,V,C>` | R: ArchiveReadStorePort；V: ArchiveVisibilityPort；C: ArchiveClock | 五 safe views；无 write UoW、ID、source refresh、verify、storage、receiver |

S 是统一事务 family，不宣称各 service 整个 Tx 在编译期只含表中子能力；私有 flow helper 必须以表内 read/write subtrait bounds 接收 `&mut impl Capability` 限制使用，静态审计禁止越界调用。Query 使用只实现 read trait 的封装，形成真实编译能力隔离。写 service 的 C 仅在对应 bounds 暴露 authority/ID/clock，不允许万能 runtime/ServiceLocator，也不新增第九业务 service。

all write services 还使用 Result + WorkerControl + Ordinal 等与该入口有关的 support；Command 不强制 claim，Job 写及反馈影响同 target 时需同一 fencing 规则。Facade 只转发 Step06 32 方法面；E04/J12 在 application 读 persisted action target 后唯一分派，不让 entry 做 repo 读取。

#### 6.19.3 Application 模块停审

| 检查 | 结论 |
|---|---|
| 参数/返回/error | 所有 required trait 方法为完整 Rust-facing typed signature，PortFuture error 完整 enum；无裸 transaction ref 代 handle |
| 对象覆盖 | 26 对象均由 CP1～CP6 repo 或内嵌对象读写承接；mutable get/save 配对，immutable append/get/list |
| 依据闭环 | binding/capture/compatibility/manifest/material/storage/handoff/compensation sidecars 有 exact get/append，无法私补 material/schema/intent |
| 结果闭环 | 25 non-query payload variant、完整 shell/payload/result lookup、context reserve、same tx completion；Query 无 result write |
| source truth | 八 source class 与 owner mapping 保留；不提升 auxiliary/ref/audit 材料 |
| 当前门禁 | `pass_at_step_7_with_upstream_blockers`；local port 契约可承接 Step08，production capability 与正式实现 boundary 均未放行 |

## 7. infra 模块小循环

### 7.1 写前问题回答与 capability 清单

已复读 Step06 §11、Step04/05 文件 owner、正式01 §8～10 以及治理 Step07 §12。取舍：infra 只实现 application 所需能力，不把“有 binding ref”当 constructed handle；store/clock/authority/visibility 各有独立验证，所有 required slot 先冻结后装配。authority/visibility 新增 technical slots，不新增业务 family。

| capability / 对象来源 | 需要的实现接缝 | 调用方 | 实现文件（均 planned） |
|---|---|---|---|
| UoW、read、version、sidecar、完整 result | ArchiveStoreAdapter 的 Read/Tx，WorkerLeasePort | application service/control | `crates/infra/src/store_adapter.rs` |
| ID/clock | ArchiveContextAdapter | application context source | `crates/infra/src/context_adapter.rs` |
| admission/current authority、scope link | ArchiveAuthorityAdapter | Request/Lifecycle/Restore | `crates/infra/src/authority_adapter.rs` |
| current visibility/disclosure | ArchiveVisibilityAdapter | Query / replay disclosure | `crates/infra/src/visibility_adapter.rs` |
| 八 source class、owner-approved export | SourceExportAdapters | SourceCapture/Restore | `crates/infra/src/source_export_adapters.rs` |
| fixed integrity / compatibility | IntegrityAdapter / CompatibilityAdapter | Verification/Restore | `crates/infra/src/integrity_adapter.rs`、`compatibility_adapter.rs` |
| formal decision | GovernanceDecisionAdapter | Lifecycle | `crates/infra/src/governance_adapter.rs` |
| storage effect/probe | ArchiveStorageAdapter | Placement/Lifecycle/Restore eligibility | `crates/infra/src/archive_storage_adapter.rs` |
| per-owner handoff/compensation | RestoreReceiverAdapters | Restore | `crates/infra/src/restore_receiver_adapters.rs` |
| trusted envelope 映射 | consumer mapping，非业务 port | worker entry | `crates/infra/src/consumer_adapters.rs` |
| runtime assembly | binding verifier + typed factory | worker composition root | `crates/infra/src/runtime_builder.rs` |

每个 adapter 使用本 Step 完整 trait 方法，不再定义第二组省略结果字段的接口。实现体/provider schema/backend 仍未选择；本 Step 的“实现方”是计划职责，不代表存在实现。

### 7.2 Typed construction 与验证面

```rust
/// Carries a safe construction failure, never a provider error body.
pub enum ArchiveBuildError {
    MissingBinding { slot: ArchiveAdapterSlot, reason: InfraIssueRef },
    ContractBlocked { slot: ArchiveAdapterSlot, reason: InfraIssueRef },
    InvalidBinding { slot: ArchiveAdapterSlot, reason: InfraIssueRef },
    ConstructionFailed { slot: ArchiveAdapterSlot, reason: InfraIssueRef },
}
/// Pins the profile and exact slot to the supplied binding identity.
pub struct ArchiveSlotBuildInput {
    pub profile: ArchiveRuntimeProfileRef,
    pub config: ArchiveInfraConfigRef,
    pub slot: ArchiveAdapterSlot,
    pub binding: ArchiveRuntimeBindingRef,
}
/// Returns an actual constructed handle paired with its exact-slot availability.
pub struct BuiltArchiveAdapter<P> {
    pub port: P,
    pub marker: AdapterAvailabilityMarker,
}
/// Validates contract/binding availability without fabricating a port instance.
pub trait ArchiveBindingVerifier: Send + Sync {
    fn inspect(&self, input: ArchiveSlotBuildInput)
        -> PortFuture<'_, AdapterAvailabilityMarker, ArchiveBuildError>;
}
/// Builds typed handles; marker-only success is not a valid return value.
pub trait ArchiveAdapterFactory: Send + Sync {
    type Store: ArchiveStorePort + WorkerLeasePort;
    type Context: ArchiveIdSource + ArchiveClock;
    type Authority: ArchiveAuthorityPort;
    type Visibility: ArchiveVisibilityPort;
    type Source: SourceExportPort;
    type Integrity: IntegrityCapabilityPort;
    type Compatibility: CompatibilityCapabilityPort;
    type Governance: GovernanceDecisionPort;
    type Storage: ArchiveStoragePort;
    type Receiver: RestoreReceiverPort;
    fn build_store(&self, input: ArchiveSlotBuildInput) -> PortFuture<'_, BuiltArchiveAdapter<Self::Store>, ArchiveBuildError>;
    fn build_context(&self, input: ArchiveSlotBuildInput) -> PortFuture<'_, BuiltArchiveAdapter<Self::Context>, ArchiveBuildError>;
    fn build_authority(&self, input: ArchiveSlotBuildInput) -> PortFuture<'_, BuiltArchiveAdapter<Self::Authority>, ArchiveBuildError>;
    fn build_visibility(&self, input: ArchiveSlotBuildInput) -> PortFuture<'_, BuiltArchiveAdapter<Self::Visibility>, ArchiveBuildError>;
    fn build_source(&self, input: ArchiveSlotBuildInput) -> PortFuture<'_, BuiltArchiveAdapter<Self::Source>, ArchiveBuildError>;
    fn build_integrity(&self, input: ArchiveSlotBuildInput) -> PortFuture<'_, BuiltArchiveAdapter<Self::Integrity>, ArchiveBuildError>;
    fn build_compatibility(&self, input: ArchiveSlotBuildInput) -> PortFuture<'_, BuiltArchiveAdapter<Self::Compatibility>, ArchiveBuildError>;
    fn build_governance(&self, input: ArchiveSlotBuildInput) -> PortFuture<'_, BuiltArchiveAdapter<Self::Governance>, ArchiveBuildError>;
    fn build_storage(&self, input: ArchiveSlotBuildInput) -> PortFuture<'_, BuiltArchiveAdapter<Self::Storage>, ArchiveBuildError>;
    fn build_receiver(&self, input: ArchiveSlotBuildInput) -> PortFuture<'_, BuiltArchiveAdapter<Self::Receiver>, ArchiveBuildError>;
}
```

该 factory 是 infra 自身的构造 abstraction，不进入 application 编译依赖。associated type 是具体实现类型，不是动态服务定位器；每次 build 只接受对应 slot，Store 只接受 Store binding，其他只接受 Adapter binding。Source/Receiver 按 SourceClass/RestoreOwnerRef 精确实例化与匹配输入，不使用 wildcard owner。per-owner dispatcher 由 runtime builder 静态组合已构建端口，未知 owner 必须 BindingMismatch，不选第一个 adapter。

build 方法必须重新核验 exact profile/config/binding 与实际 constructed handle；单独 inspect 的 Enabled 不是实例，也不能解除 owner blocker。factory 内 adapter 具体初始化参数、provider client 和 secret resolver 的 schema 在正式04/Step14 前禁止实施；不为占位 ref 私造真实 client。clock 不可用时返回 build error，不生成虚假 observed_at 的 marker。

required slot 规则：所有公开 surface 需 Store/ContextSource；Query 另需 Visibility；C01/C02/E01 需 Authority；lifecycle 需 Authority/GovernanceDecision/ArchiveStorage；restore effect 需 Authority、各 selected SourceExport/RestoreReceiver、Integrity/Compatibility、ArchiveStorage；capture 需各 selected SourceExport；inbound 另需 exact family mapping。选定暴露 surface 的 required 集合在 assembly.begin 冻结，不能事后把失败项移出。local read-only profile 只能是另一次明确 profile 装配，不能把 full-profile 失败冒充降级 Ready。

ContextSource 的 handle 不包含授权 fallback。需要 C: ID+Clock+Authority 的 service 使用 `AuthorizedContext<C,A>`（private fields `context: C, authority: A`；`pub fn new(context: C, authority: A) -> Self`），逐方法委托对应 trait，绝不把 A 的 refs 当 ID。Query C 使用只暴露 ArchiveClock 的 `ClockOnly<C>`；R 使用 `ReadOnlyStore<S>`（private `store: S`；`pub fn new(store: S) -> Self`），仅委托 open_read。两 wrapper 都定义在 application::ports::support，infra 只构造，不让调用方 unwrap。

### 7.3 Fake / durable parity 与 fail-closed

| 切口 | fake 和 durable 都必须遵守 | 明确不证明 |
|---|---|---|
| Tx isolation | staging、read-your-writes、rollback 隐藏、guard read set/phantom 检查、CAS 后 token 原样读回 | fake 不证明生产事务隔离 |
| immutable / sidecar | same key + same complete value 可复用，different value 拒绝；内嵌 history 不丢字段 | memory map 不构成正文 truth |
| result | complete payload/shell/scope/channel/key/digest 原子保存；missing result 不重跑 | fixture 不是真实 report/evidence |
| snapshot/page | 固定 snapshot、稳定过滤/顺序、cursor 失配显式失败 | 不用 HashMap 顺序冒充稳定分页 |
| lease/fence | exact target/holder/fence、renew 不更换身份、expiry/新 fence 拒绝旧 commit | 本地租约不证明外部锁定 |
| adapter | 同 typed outcomes、同 correlation；fault injection 区分 NotDispatched/MayHaveDispatched | fake 的 Verified/Committed 不能进入 production readiness |
| unavailable | 正向默认拒绝，无 fake fallback；空 inventory/未支持 schema 不变成功 | 不声称 provider/crypto/key 已选择 |
| entry | 只调 application，不从 fake 私有表补 DTO、统计或 authority | API/worker 不获得 owner 写权 |

fakes 只计划放在 `crates/application/tests/support/fakes.rs`；不把 test-only implementation 注入生产 factory。以上是后续测试断言，不是本轮测试结果。production store/backend 未选也须保持 blocked，不能因本地 repository 方法已写全而宣布可运行。

### 7.4 模块内停审

`pass_at_step_7_with_upstream_blockers`：实现文件、factory 参数/返回/error、typed handle 与 marker 配对已明确；无 application→infra、无 SDK/L1 implementation compile；required slots 不裁短，provider/crypto/secret/body 不泄漏。本 Step 不提供 outbound publisher、outbox 或审计后端。

## 8. api 模块小循环

### 8.1 写前问题回答与 capability 清单

已复读 Step06 §10.9/10.10/12、正式02 §7.2/7.3/8.7。api 是 transport-neutral entry，没有 host/client trait。既有 3 Command/5 Query 对 concrete service 的调用足够，不增第二层动态 dispatcher；不把未定义 wire DTO 当可实施。

| capability | definition owner / 调用方 | 可调用面 | 禁止事项 |
|---|---|---|---|
| C01/C02 | `api::command_handlers` → ArchiveRequestService | request_archive / request_restore | entry 不读 store、不自行构造 accepted refs |
| C03 | command_handlers → LifecycleExecutionService | request_execution | 无 apply_policy/delete-direct API |
| Q01～Q05 | `api::query_handlers` → ArchiveQueryService | get_job_status/get_bundle/verify_bundle/get_restore_plan/get_restore_handoff_status | 无 write、repair、capture、重验、取回、cache write |
| response/disposition | api errors/handler → Step08 safe DTO | 原 application result 或 SafeRead | 不从 result_ref 现查重构原报告 |

Step06 §10.9 的方法参数/返回名保持唯一；entry input 是对应 concrete `Request*Input` / `Get*Input`，context 用 from_command/from_query 构造。没有 generic route/typed_refs 数组决定业务 selector。3 Command 不共享一个可猜测 selector 的 shell，5 Query 按各 concrete handler 固定 selector；E04/J12 特殊分支只归 application/worker 协作。

### 8.2 读取、重放与安全输出接缝

| Query | 当前完整读取入口 | 必要关系核验 | 缺失/隐藏 |
|---|---|---|---|
| Q01 | resolve_read + get_job/find_job_by_request + request + list_stages + component exact reads | operation/job kind、request scope、全部 component 来源 | 统一 NotAvailable；缺 component 不造 Completed |
| Q02 | BundleRead + manifest source sidecar + capture/binding + placements/lifecycles | exact revision、来源类别、coverage/fence/entry locator | Draft 无 current manifest 不伪造 revision；按 Step08 明确合法输出 |
| Q03 | BundleRead + AssessmentRead + FixedInputRead | exact input/target/schema；finding 全集同 snapshot | absent assessment 保留 None，不隐式 assess |
| Q04 | plan + list_items + each handoff/outcome/compensation | fixed item set/owner、最新 ref 与历史一致 | 不混 plan revision、不推 restored |
| Q05 | handoff 或 item.latest_handoff → outcome/compensation list | exact owner/item/material/receiver 与 append history | 不 probe/retry/compensate |

本 Step 的 safe view 投影源由 typed repo 闭合；public transport encoding、request/response exact fields、public pagination/disclosure mask、error code 全留 Step08。任何公开新增字段若 stored payload 没有对应来源，必须回填本 Step，不能实施时临时查询当前 truth。public accepted/replay 仅从已提交 CompleteArchiveResult 的对应 variant 转换；完整原值重放再做当前披露覆盖，禁止原响应权限复活。

### 8.3 模块内停审

`pass_at_step_7`：api 不定义 repository/provider port，不反向依赖 domain/infra；8 个入口调用方/实现方清楚、Query 真实 read-only。没有把 Step08 预留 DTO 命名登记误写成协议完成，当前不放行 API 实现或路由/服务端选型。

## 9. worker 模块小循环

### 9.1 写前问题回答与 capability 清单

已复读 Step06 §13、正式02 §7.4/7.5/8.6、Bus 的 commit-uncertain 边界和 workspace 禁止 outbox 结论。worker 运行状态继续归 worker，持久 claim/checkpoint 的唯一 owner 下移 application。选工作、claim、resume 和 branch lookup 都通过 application control；runner 不读 repository、不创建业务字段。

| capability | port / control | 状态来源 | 限制 |
|---|---|---|---|
| bounded 候选选择 | WorkerCandidateRead / ArchiveWorkerControl | committed operation input/target + same snapshot version | 返回 typed refs，不从 topic/route 猜 |
| acquire/renew/release | WorkerLeasePort，由 control 委托 | store clock/fence/version | entry 只拿 safe claim，不直持 store |
| checkpoint/resume | WorkerControlRead/Write | result 与 checkpoint 同 UoW | checkpoint 不证明 Bus ACK |
| E04/J12 owner 路由 | control.resolve_action_target | get_action_with_version.target_ref | Placement/Lifecycle 二选一；缺失/冲突拒绝 |
| 五 consumer 映射 | infra consumer_adapters | 正式 envelope/producer/schema/trust boundary | raw body 不进 application，不按错误文本猜 outcome |

### 9.2 Application-local worker control 的可调用面

```rust
/// Requests a bounded scan for one finite registered operation.
pub struct WorkerScanInput {
    pub operation: ArchiveOperationName,
    pub page: RepositoryPageRequest,
}
/// Pins a persisted candidate; it does not authorize a dispatch.
pub struct WorkerCandidate {
    pub operation: ArchiveOperationName,
    pub target: WorkerTargetRef,
    pub expected_version: Option<RecordVersion>,
}
/// Reads pending work without generating plans or changing domain state.
pub trait WorkerCandidateRead: Send + Sync {
    fn list_candidates(&self, input: WorkerScanInput)
        -> PortFuture<'_, RepositoryPage<WorkerCandidate>, ArchiveStoreError>;
}
/// Exposes only control and read-back operations to the runner.
pub struct ArchiveWorkerControl<S> { store: S }
impl<S: ArchiveStorePort + WorkerLeasePort> ArchiveWorkerControl<S> {
    pub fn new(store: S) -> Self;
    pub fn open_candidates(&self) -> PortFuture<'_, WorkerCandidateSession<S::Read>, ArchiveStoreError>;
    pub fn acquire(&self, request: ClaimRequest) -> PortFuture<'_, ClaimOutcome, ArchiveStoreError>;
    pub fn renew(&self, claim: WorkerClaimId, fence: WorkerFenceToken, expected: RecordVersion)
        -> PortFuture<'_, ClaimOutcome, ArchiveStoreError>;
    pub fn release(&self, claim: WorkerClaimId, fence: WorkerFenceToken, expected: RecordVersion)
        -> PortFuture<'_, Versioned<WorkerClaim>, ArchiveStoreError>;
    pub fn resume(&self, entry: WorkerEntryRef, target: WorkerTargetRef)
        -> PortFuture<'_, Option<WorkerCheckpoint>, ArchiveStoreError>;
    pub fn resolve_action_target(&self, action: ExternalActionRecordRef)
        -> PortFuture<'_, Option<ExternalActionTargetRef>, ArchiveStoreError>;
}
```

```rust
/// Restricts runner access to bounded candidate pages from one read snapshot.
pub struct WorkerCandidateSession<R> { read: R }
impl<R: ArchiveReadSession> WorkerCandidateSession<R> {
    pub fn snapshot_ref(&self) -> ArchiveReadSnapshotRef;
    pub fn list(&self, input: WorkerScanInput) -> PortFuture<'_, RepositoryPage<WorkerCandidate>, ArchiveStoreError>;
    pub fn close(self) -> PortFuture<'static, (), ArchiveStoreError>;
}
```

open_candidates 只返回 private read field 的 WorkerCandidateSession，无 unwrap/Deref/全 repo trait 实现，runner 只能 list/snapshot/close；实际 S::Read 留在 application 内。control 不执行业务 mutation，故不是第九业务 service。

候选选取只使用本文已有 typed exact/get/list 的状态与固定输入；`expected_version=None` 只对 immutable target。创建 source/manifest/plan 等尚无 child identity 的阶段，target 使用已存在 Job，并由其 immutable request 进入 owning service；不制造虚假 Bundle revision/RestorePlanRef。J03 使用 SourceBinding、J04 使用 CaptureAttempt、J12 使用 ExternalAction；两个新增 target 分支已回填 Step06，不用未创建 attempt 或“最新 action”猜输入。worker 不靠 candidate 补业务 DTO；实际调用仍由 owning application service 在 Tx 重读。operation name 必须有限 registry 校验，未知返回 InputConflict，不做全表 generic work。AR-HLD-Q-002 未关闭前无 page 默认值或自动 schedule。

| Job | 唯一 candidate target / version 来源 | service 读取 / 创建输入 |
|---|---|---|
| J01/J02/J05/J13 | Job / get_job_with_version | immutable request；J02 创建 bindings，J05 创建或读取 request 的 Bundle，J13 创建 plan |
| J03 | SourceBinding / get_binding_with_version | 正式 binding/input → 创建并先保存新 attempt，或按显式既有 operation key 恢复原 attempt |
| J04 | CaptureAttempt / get_capture_with_version | exact saved capture input；不另建 attempt |
| J06/J07/J08/J09 | Bundle revision / get_bundle_with_version | same manifest revision；创建 assessment 或 placement 前先保存固定 input |
| J10 | Placement / get_placement_with_version | exact bundle revision/location/commit |
| J11 | Lifecycle / get_lifecycle_with_version | exact decision/target/action |
| J12 | ExternalAction / get_action_with_version | exact persisted action/target/input；不从 parent 列表选择 latest |
| J14/J15 | RestoreItem / get_item_with_version | fixed plan/owner/entries/material；J15 显式创建 handoff intent |
| J16 | RestoreHandoff / get_handoff_with_version | exact handoff input |
| J17 | Compensation / get_compensation_with_version | 已获正式授权的 compensation intent |

scanner 不能只靠进程内 continuation 创建候选；候选的 prerequisite/operation eligibility 必须来自已提交 root stage、fixed input 或显式 intent。对应 index/schema 留 Step11，逐候选 eligibility/避免 busy-loop 留 Step09/13；尚无合法持久目标时不返回候选。该表不构成允许所有 eligible work 自动运行的配置授权。

### 9.3 22 个 worker 入口与存储接缝映射

| 入口 | application owner | 关键读取/写入或外部接缝 |
|---|---|---|
| E01 ConsumeArchiveTrigger | Request | trusted trigger → authority + Admission/Result/Visibility；不直接 Completed |
| E02 ConsumeSourceExportFeedback | SourceCapture | Capture/FixedInput；exact attempt/fence/coverage，source finding append |
| E03 ConsumeGovernanceDecisionChange | Lifecycle | decision 受影响 execution list → current governance check → 局部 block/result |
| E04 ConsumeStorageActionFeedback | Placement 或 Lifecycle | persisted action target 唯一路由；StorageState/Result，observation correlation |
| E05 ConsumeRestoreReceiverFeedback | Restore | handoff intent → exact mapped outcome → Restore/Result 同事务 |
| J01 AdvanceArchiveJob | Request | Admission + CP component read；job CAS + stage append |
| J02 PlanArchiveSources | SourceCapture | admitted scope + bind_source → binding/fixed source record |
| J03 CaptureArchiveSource | SourceCapture | binding + saved capture input → capture → attempt/coverage/inventory/findings |
| J04 ReconcileSourceCapture | SourceCapture | saved capture input → probe_capture；不盲 recapture |
| J05 AssembleBundleManifest | BundleAssembly | complete selected source inventory → exact closure/manifest/source sidecar |
| J06 SealArchiveBundle | BundleAssembly | Bundle/Manifest/Capture/Assessment/Placement same Tx guard → Bundle seal basis |
| J07 AssessBundleIntegrity | Verification | persist assessment input → integrity resolve/assess/probe → assessment/findings |
| J08 AssessBundleCompatibility | Verification | saved compatibility input → exact-target assess → immutable assessment/findings |
| J09 PlaceArchiveBundle | Placement | complete saved storage intent → dispatch → placement/action observations |
| J10 RetrieveArchiveBundle | Placement | same revision/placement → persisted retrieval intent → effect/availability 分离 |
| J11 ExecuteArchiveLifecycle | Lifecycle | current authority + decision/hold → saved intent → dispatch |
| J12 ReconcileExternalAction | Placement 或 Lifecycle | persisted owner route + saved input → probe → same action histories |
| J13 BuildRestorePlan | Restore | accepted request + fixed manifest/source/receiver → fixed plan/items |
| J14 PrepareRestoreMaterial | Restore | exact entry/source map + assessment/retrieval/authority → approved material sidecar |
| J15 DispatchRestoreHandoff | Restore | saved handoff input + current formal authority → owner dispatch |
| J16 ReconcileRestoreHandoff | Restore | saved handoff input → owner probe → new immutable outcome |
| J17 ExecuteRestoreCompensation | Restore | independent intent/key/authority → compensate/probe_compensation |

E04/J12 的两路仍只是 2 个逻辑入口，不新增 entry；总计 3 Command + 5 Query + 5 Consumer + 17 Job = 30，具体 service 方法面 32。

### 9.4 Consumer 信任、ACK 与 outbound 裁剪

inbound adapter 分两层：外部 host 验 producer/channel/schema/version/真实性，infra 映射成正式 local carrier，application 校验该事件与持久 input/owner/key/digest 的 correlation。source feedback 只接受 SourceCaptureObservation；storage feedback 只接受 StorageObservedOutcome；receiver feedback 只接受 HandoffObservedOutcome 或对应 compensation observation，不能只回一个 success bool。AR-UP-001/002/003/005/009 未闭合的 exact family 不注册、不订阅，不伪造 trusted envelope。

trigger 与 governance change 的 wire/local input 完整 schema 属 Step08；未定义前不能实现 mapper。Step08 必须同时给 trusted envelope source proof、外部 schema→local selector 的精确表、source event dedup 与各字段来源。runtime slot 改为 `InboundConsumer(ArchiveInboundFamily)`，按五类逻辑 consumer 唯一选择；source class/owner 作为各正式 envelope 的额外校验，不让 storage infrastructure producer 伪装某个 L1 SourceClass。ArchiveInboundFamily 归 infra runtime binding，不引用 worker enum，见 Step06 同步修正。

仅在本地完整 result/checkpoint commit 已确定后，runner 才可请求外部 host 按正式 Bus 协议 ACK。ACK 丢失只会产生重复消费，走完整 stored replay；不得以 ACK 证明 owner commit。commit-unknown 不 ACK 成功、不盲重跑，先本地 stable lookup。quarantine/deny 是安全处置意图，不声称 Bus 已 DLQ/rejected/acked；具体 transport ack schema/实现无正式绑定时保持 blocked。不新增 Archive outbound topic、outbox、publisher 或 observability backend。

### 9.5 模块内停审

`pass_at_step_7_with_upstream_blockers`：worker 只持 application 服务/control，5+17 registry、local claim/checkpoint 与 ACK 分离；外部 wire 未闭合不注册。lease/flow 调度、public report DTO 和全部 worker input selector 字段需 Step08/09/13 承接，当前未实现任何 runner。

## 10. 跨模块审计、回填与停审门禁

### 10.1 Step06 承接项逐项关闭

| Step06 §14.5 要求 | 本 Step 落点 | 结论 / 上限 |
|---|---|---|
| local store/read/UoW | §6.4～6.10/6.19 | exact get/list/stable lookup 与 write 成对；typed Tx、CAS/read-set/fence，backend pending |
| context/identity source | §6.12 | 25 typed ID/ref 方法、clock、transactional ordinals；不 mint external refs/digest |
| SourceExportPort | §6.13 | 8 source authority matrix、fixed source input、inventory/member/coverage/fence/probe/material |
| IntegrityCapabilityPort | §6.14 | fixed input/capability、safe findings、Verified evidence，不产生算法/key |
| CompatibilityCapabilityPort | §6.15 | exact revision/schema/target，不自动 migration |
| GovernanceDecisionPort | §6.16 | lookup/current applicability/hold conflict、正式 lifecycle compensation observation |
| ArchiveStoragePort | §6.17 | 完整 immutable intent、独立 dispatch permit、ACK/commit/retrieval/probe |
| RestoreReceiverPort | §6.18 | exact owner/material/plan/receiver、原 intent 与独立 compensation key，禁止 owner DB |
| visibility/read resolver | §6.12.3/8.2 | formal root scope link、resolver-first、current disclosure、同 snapshot 裁剪 |
| infra factory | §7 | actual typed handles + marker；required slots 冻结、fake/durable parity |
| worker control/consumer | §9 | claim/checkpoint 单 owner、受限候选 session、5+17 入口、ACK 与 commit 分离 |

### 10.2 对象、输入和结果的持久归属审计

| 归属 | 对象/载体 | 写面 → 读面 | version / immutable |
|---|---|---|---|
| CP1 | ArchiveRequest、RestoreRequest、DeclaredArchiveScope | append request → exact get/scope read；job stable lookup | request immutable，scope 嵌套 |
| CP1 | ArchiveJob、ArchiveJobStageRecord | save_job/append_stage → versioned get/list_stages | CAS + append-only 同 Tx |
| CP2 | ArchiveSourceBinding、CaptureAttempt、CaptureCoverage、SourceCaptureFinding | save binding/capture、append finding → exact/list/coverage | 两 mutable CAS；coverage 嵌套、finding immutable |
| CP3 | ArchiveBundle、BundleManifest、ManifestEntry、ManifestClosure、ClosureFinding | save bundle/append manifest/finding → exact/list/entry/closure | Bundle CAS；manifest 及嵌套成员 immutable |
| CP4 | VerificationAssessment、CompatibilityAssessment、VerificationFinding | save verification/append compatibility/finding → exact/list | verification CAS，其他 immutable |
| CP5 | ArchivePlacement、LifecycleExecution、ExternalActionRecord、GovernanceDecisionRef | save state → exact/list/key lookup | 3 mutable CAS；decision 嵌套原决定/current history |
| CP6 | RestorePlan、RestoreItem、RestoreHandoff、HandoffOutcome、CompensationRecord | save/append → exact/list/key lookup | outcome append-only；其余 record CAS，plan input immutable |
| technical | BoundSourceRecord、SourceCaptureInput、CapturedSourceRecord、CompatibilityInput、ManifestSourceRecord | append_* → get_* | 按 owning record key immutable，非新正式对象 |
| technical | StorageDispatchInput、PreparedRestoreMaterial、HandoffDispatchInput、CompensationDispatchInput | append_*_intent/material → get_* | 全输入固定，副作用发生前提交 |
| technical | ArchiveVisibilityBinding、ArchiveOperationKey/reservation、CompleteArchiveResult | append/reserve/save/complete → resolve/get/find | scope link immutable；reservation CAS；payload immutable |
| technical | WorkerClaim、WorkerCheckpoint、ordinals | acquire/renew/release、append_checkpoint → exact/latest | claim row version sidecar；checkpoint immutable，与 result 原子可见 |

正式对象总数 26；表中 RestoreRequest 只在 CP1 admission 读写，不重复计数，领域归属仍 CP6。两个 contracts 正式对象分别嵌入 request/lifecycle，未建 shadow truth。所有 technical sidecar 不计入正式对象、Artifact 或 evidence registry。

### 10.3 新增载体唯一定义文件

以下均为 planned 路径，Rust `pub` 是 crate 间可见，不是外部 wire contract；§6 逻辑 schema 实施时 private fields + checked constructor，不能 struct literal mint 正向 proof。

| planned application/infra 文件 | 唯一类型/trait 组 | 禁止重复定义 |
|---|---|---|
| application/ports/support.rs | PortFuture、ArchiveIdSource、ArchiveClock、authority target/input/outcome/port、ReplayDisclosureOutcome、visibility selector/resolution/binding/fields/disclosure/port、受限 wrappers | contracts 不导入这些内部类型；Core 只通过 contracts re-export |
| application/ports/store.rs | Versioned/ExpectedVersion/Staged、read snapshot/page、CP1～CP6 read/write、OperationResultRead/Write、FixedInputRead/Write、VisibilityResolutionRead/Write、aggregate traits/OrdinalWrite | adapter 不复制 repository schema |
| application/unit_of_work.rs | ArchiveTransactionRef、LocalCommitOutcome/Probe、ArchiveReadSession/UnitOfWork/ReadStorePort/StorePort | 不用裸 string 替代 handle |
| application/idempotency.rs | ArchiveDedupScopeRef/OperationKey、StoredItemResult/Outcome/Detail、StoredAdmissionResult/ProgressResult/Disposition/ArchivePayload、ArchiveResultToStore/CompleteArchiveResult/ReservationOutcome、IdempotencyCoordinator | Step06 result shell 原定义仍唯一；不复制进 worker |
| application/worker_control.rs | Step06 11 个 control carrier、ClaimRequest/Outcome、WorkerControlRead/Write/LeasePort、WorkerScanInput/Candidate/CandidateRead、ArchiveWorkerControl/WorkerCandidateSession | worker 只拥有 entry/runner state，不反向依赖 |
| application/ports/source_export.rs | SourceBindingInput/Outcome/Participation、SourceCaptureInput/Observation、Declared/CapturedSourceMember、SourceFindingDraft/CapturedSourceRecord、RestoreMaterialInput/Entry/Outcome/PreparedRestoreMaterial、BoundSourceRecord/ManifestSourceSelection/Record、SourceExportPort | 只存 approved ref/material shape，不存 owner live truth |
| application/ports/integrity.rs | VerificationFindingDraft、IntegrityInput/Outcome/CapabilityOutcome/Port | finding ID 不由 adapter 生成 |
| application/ports/compatibility.rs | CompatibilitySelection/Input/Outcome/Port | selection 在 store 中使用，仍仅此定义 |
| application/ports/governance.rs | GovernanceCheckInput/Outcome、LookupOutcome、LifecycleCompensationInput/Outcome、GovernanceDecisionPort | Step06 contracts proof/decision 不复制 |
| application/ports/archive_storage.rs | StorageCapabilityRef/EffectKey/ActionContext/DispatchInput/BindingOutcome/ObservedOutcome、ExternalDispatchPermit、ArchiveStoragePort | provider schema 不进 application |
| application/ports/restore_receiver.rs | ReceiverEffectKey/ResolveInput/Outcome、HandoffDispatchInput/ObservedOutcome、CompensationDispatchInput/ObservedOutcome、RestoreReceiverPort | receiver owner/authority 不从 key 解析 |
| application/errors.rs | ArchiveStoreError/PortError/SupportError、DispatchKnowledge | Step12 补公开映射，不扩成 raw error |
| application 的 entry/security helper | ArchiveReplayDisclosure 定义于 ports/support.rs | 只供 application 出站安全封装，不是额外业务 service |
| infra/runtime_builder.rs | ArchiveSlotBuildInput、BuiltArchiveAdapter、ArchiveBindingVerifier、ArchiveAdapterFactory | 不暴露给 application，具体 provider factory 仍 blocked |
| infra/errors.rs | ArchiveBuildError | 原 InfraError 后续映射使用此 safe 分类 |

### 10.4 跨模块一致性与负向切口

| 审计项 | 本地闭合结论 | 后续应验证的负向切口（本轮未执行） |
|---|---|---|
| dependency | contracts→Core；domain→contracts；application→domain/contracts；infra→application/domain/contracts；api→application/contracts；worker→infra/application/contracts | forbidden dependency/static import；无 SDK/L1 runtime package dependency |
| 26 对象/30 入口/32 方法 | 与 Step05/06/正式02 对齐；8 service，7 family | 漏入口、重复 owner、E04/J12 双派发 |
| store read-set | exact/list/negative lookup 同 tx；commit 重验 CAS/read-set/range/fence | 未写 guard row 变化、phantom、stale worker commit |
| snapshot/closure | 本地 snapshot 不当 owner fence；manifest 固定 source selection 与所有 required/conditional/excluded basis | mixed revision、缺页、空 owner inventory、auxiliary 补 canonical |
| immutable input | source/assessment/storage/material/handoff/compensation 全字段 save/get | 同 key 异 input、晚回包跨 attempt、当前 config 重建旧 intent |
| sidecar/member | entry↔binding↔attempt↔member↔material exact typed map | 两数组顺序猜配、wrong owner、entry locator 漂移 |
| result replay | 25 non-query variant，全 payload/details/shell/context 保存 | 仅 shell、丢 outcome/finding refs、缺 result 重跑、撤权后重放泄露 |
| 正式 authority | current owner decision 与 Archive local progress 分开 | old hold release、无 delete authority、Bundle 变写权限 |
| external uncertainty | ACK/commit/retrieval/owner outcome 不混，permit 独立于 immutable digest | timeout→失败、unknown 盲重发、跨 receiver/key、补偿抹历史 |
| entry/control | Query 无 write handle，worker candidate wrapper 无 repo escape | Query repair/cache write、runner 私读 store、claim 仅 entry 校验 |
| async/type | boxed Send future + owned associated Read/Tx；Core 显式 re-export | dyn async 不兼容、跨 crate 错 owner、外部 payload/raw error 泄露 |
| evidence/readiness | fakes/文档静态检查只证明本地契约检查 | 假 bundle/digest/report/run/commit/verdict/signoff/readiness |

### 10.5 本轮前后对比与正式回填草稿

此前仅有七 family 名称、Step06 对象/服务签名及若干 opaque refs。本轮补齐逐方法 repository、typed transaction、完整 source/intent/result/read resolver 与外部 outcome，并修正 worker 类型反向依赖、原始 Core path、checkpoint 提交时序、source-class/inbound-family 混用、恢复材料成员关联和 Job claim 入 service 链路。

正式03 在 Step19 装配时，§5.5 按本文件 §4～9 回填各模块 Trait/Port/Adapter 契约，§5.6 建唯一索引；§6.4 UoW/read-set、§6.11 完整 replay、§6.13 source-authority、§6.17/18 external effect 接缝是不可删的追溯点。不得把 technical port family 展开当成新增领域对象；不得把本地 required schema 说成上游已实现接口。当前正式03仍为 historical_material，不执行装配。

### 10.6 未关闭 blocker 与后续承接

| 项 | owning project / authority | 当前上限 |
|---|---|---|
| AR-UP-001/002 | 各 L1 owner、L1-work | export/snapshot/fence/coverage、项目生命周期/trigger 尚不闭合 |
| AR-UP-003 | L1-governance 或明确决定 owner | retention/hold/delete/risk、当前访问/dispatch applicability 合同仍 blocked |
| AR-UP-004 | 明确 integrity/crypto/key/schema authority（待确认） | 不选算法、KMS/secret、加解密/压缩/schema evolution，不造 verified |
| AR-UP-005 | 正式 storage/provider owner（待确认） | backend/tier/retrieval/幂等/fencing/TOCTOU 接缝未闭合，不声称 storage ready |
| AR-UP-006/007/008 | L1-artifact / L4-observability / L1-workspace（WS-UP-006） | approved content closure、脱敏材料、只读 export 不能替代 canonical truth |
| AR-UP-009 | 各 restore receiving owner | receiver import/restore/command、probe/compensation/authority 未闭合 |
| AR-ARCH-001 | 全局依赖标准 owner + L0-sdk | SDK compile 方向冲突保留，本仓不依赖 SDK |
| AR-HLD-Q-001/002 | Archive 设计 owner + 正式 Bus/运行环境与 workload authority | 无 publisher/outbox；无 batch/lease/page/RTO 数值 |

无新增 owning-project blocker；只明确既有 blocker 对本地 required ports 的影响。持久 backend、稳定 digest codec、authority/visibility 运行期绑定仍未决，均不因本 Step 完成而获实施放行。

| 下一阶段 | 应先读什么 | 必须承接 |
|---|---|---|
| Step08（须新授权） | 详细设计 SOP Step8、书写规范协议章、真相源 callable/selector/page 条款、Step06/07、L1-governance Step08 样本、受影响正式上游 | concrete service inputs/outputs、25 stored variant 映射、5 safe views、worker selector/context/fence、public page/disclosure/error |
| Step09/10 | 本 Step exact ports 与 Step08 完整 DTO | 30 入口逐函数流程、guard 来源、每对象迁移与 unknown/partial/retry |
| Step11/13 | Tx/read-set、sidecar、result/claim/key 规则 | 物理 schema/index/unique/CAS/事务、namespace/digest、epoch/续租/幂等/recovery |
| Step14/正式04 | factory/required slots/blocker | 配置/算法/provider/secret 引用权属、budget，不给未知默认 |
| Step16/正式05～07 | 本表负向切口与门禁 | 实测 evidence/实施 boundary，全部仍 planned/blocked/waiting，不伪造结果 |

### 10.7 完成门禁与静态自检

| 门禁 | 结论 |
|---|---|
| Step 开工/阅读/回答/取舍 | 已记录授权、标准、正式上游和前序来源；全部工作由当前单 agent 完成 |
| 六模块小循环 | contracts/domain/application/infra/api/worker 的 capability、调用方/实现方、约束和内部停审完成 |
| trait 方法/读写/version/transaction | typed params/result/error、mutable get/save、immutable append/get、sidecar/replay/UoW/commit-unknown、guard read-set 已闭合 |
| 对象/入口/family | 26 正式对象、8 service、30 入口/32 方法；7 business/local family 不变；25 non-query replay variant、25 本地 ID/ref 方法 |
| 前序必要修正 | Step04/05 五 planned 文件与 owner 修正；Step06 claim/context/checkpoint、Core re-export、authority/visibility/inbound slots、真实 worker target；未改正式03 |
| 文档静态检查 | 围栏、表列、尾空白、重复 Rust 类型声明检查通过；Step06 当前 74 enum/378 variant；git diff --check 通过 |
| 上游 blocker | AR-UP-001～009、AR-ARCH-001、AR-HLD-Q-001～002 全开放；无新增 owning-project blocker |
| 后续未授权 | Step08 文件未创建，正式03 未装配，04～07 未进入；不执行任何实施或项目测试 |
| 事实诚实 | 本轮无源码、baseline、commit、run_id、测试结果、Bundle/digest/artifact/report/evidence/verdict/signoff/readiness；static check 不是运行证据 |

修改文件共六个，均位于本项目 design-calibration：本 Step07、Step04、Step05、Step06、03 flow、project_execution_ledger。前序正式00/01/02及其他项目脏改动保持原样。用户审查未发生；完成结论只表示本 agent 内部设计检查，不代表用户批准或生产 readiness。

```text
step_status = completed
gate_status = pass_with_upstream_blockers / stop_review
next_allowed_action = wait_for_user_review_and_explicit_step_8_authorization
formal_03_write_allowed = false_until_step_19
implementation_write_allowed = false
test_execution_allowed = false
commit_required = false
```
