# L3-capability-hub 03 详细设计 Step 7: 逐模块定义 Trait / Port / Adapter 契约

> 对应 SOP: `standards/document/详细设计讨论流程_SOP.md` Step 7
> 回填章节: `projects/L3-capability-hub/03-详细设计.md` §5 模块实现契约中的 Trait / Port / Adapter 契约;§6 全局 Trait 索引
> 创建日期: 2026-07-10
> 当前模式: full-restart
> 状态: completed_with_step_14_5_2_2_3_async_trait_binding_reopen
> Step 14 batch 14.5.2.2.3 async object-safety回开: 2026-07-21;33个含native async callable且进入dyn graph的application Port / repository trait逐声明增加`#[async_trait::async_trait]`，版本固定`0.1.89`、future保持`Send`且禁止`?Send`；infra durable / fake adapter impl必须使用同一attribute。36 Ports、22 repository traits / 110 methods、方法签名、error与fake parity均不变
> Step 14 batch 14.2 commit-resolution回开修正: 2026-07-19;existing `CapabilityUnitOfWorkManager`新增按stable transaction ref返回`CapabilityCommitResolution`三态的`resolve_commit` callable；所有commit-unknown recovery read固定single persistence authority的linearizable语义。36 Ports、22 repository traits / 110 methods不变；新增1个support enum + 3 variants + 1 callable，均有英文Rustdoc
> Step 13 并发 / 幂等回开修正: 2026-07-18;existing idempotency repository的normalized key由Step 6 three-variant closed enum承接，`save(...)`只接受`Reserved -> Completed`；same-key mismatch、atomic reserve loser与different Job run均只返回zero-write winner classification。36 Ports、22 repository traits / 110 methods不变，无新trait / method / field / type
> Step 9 batch 9.3 回开修正: 2026-07-13;existing controlled-view / derived-material repositories补reference-aware affected lookup与`MutableAffectedByReference` scan variant；Port总数仍为35,无新trait / business truth
> Step 9 batch 9.6 回开修正: 2026-07-13;existing downstream-summary scope补exact optional impact filter,existing traceability repository补historical `get_revision`,existing audit handoff scope补`try_from_input`；Port总数仍为35,新增field / callable均有英文Rustdoc
> Step 9 batch 9.9 回开修正: 2026-07-14;existing `CapabilityEventCollaborationOutcome`补exact immutable source字段并收紧outcome / item / candidate source symmetry；Port总数仍为35,新增field有英文Rustdoc
> Step 9 batch 9.11 pre-entry 回开修正: 2026-07-15;新增application-owned `CapabilityJobExecutionRepository`,以normalized idempotency key提供exact get、atomic create和optimistic save,并要求initial create持久化完整target plan或typed planning-failure空计划及initial run issues,关闭multi-target Job post-target / pre-report恢复缺口。当前Port总数为36；无list / scan、execution id、scheduler / lease / attempt state或business truth
> Step 9 batch 9.11 planned-target回开澄清: 2026-07-15;existing Job execution repository接受plan/ref对称且outcome仍为Planned的`PreclassifiedFailure` target,后续只允许zero-effect UoW单调save为Failed；trait/method/Port数量不变
> Step 9 batch 9.12 collaboration-repair回开澄清: 2026-07-15;existing capture / collaboration / Job execution contracts固定repair Job application service-owned orchestration:Captured stable-intent bind与matching journal success同一target UoW,IntentBound / intent-only status/repair只提交journal outcome；不调用自提交short-UoW facade,不新增trait/method/Port
> Step 10 batch 10.2 relation-current回开澄清: 2026-07-16;existing governance / method `find_current_by_identity`固定返回非终态current relation并排除historical terminal,使Unresolved relation可被duplicate guard、replacement / removal和Query一致读取；无新trait、method、Port或business truth
> Step 10 batch 10.6 event-capture trace-owner回开澄清: 2026-07-17;existing loaded-capture / repository prose移除不存在的capture `trace_id / bytes`对称要求,固定capture与snapshot校验source、snapshot id、schema、digest、captured time,snapshot独占trace / complete envelope并校验non-empty bytes / digest；无新field、type、method、trait、Port或protocol
> Step 12 batch 12.4 Query-degraded回开澄清: 2026-07-17;existing read-visibility resolver/fake只能用closed `CapabilityReadDegradedReason::from_kind(...)`形成Degraded resolution,kind必须来自formal typed authority；禁止safe-text、error text、first-item或adapter-private分类。无新field、type、method、trait、Port或protocol
> 本轮口径: 以 Step 5 七模块主轴和 Step 6 exact object contract 为输入,由 `application` 定义并调用 repository / projection / reference / resolver / handoff / event collaboration / idempotency / stored-result / UnitOfWork / Clock / IdGenerator ports,由 `infra` 实现并满足 durable / fake parity,`api/worker/jobs` 只调用 application service。本 Step 不定义 HTTP / RPC / event / job DTO schema、topic / queue / bus、DDL / index、完整函数级 flow、完整状态矩阵、配置 key、测试结果、实现 commit、run_id、evidence alias 或验收签署。

---

## 0. Step 开工确认

| 项目 | 内容 |
|---|---|
| 当前文档 | `03-详细设计.md` |
| 当前 Step | Step 7 `逐模块定义 Trait / Port / Adapter 契约` |
| 用户确认 | 用户已回复“同意”,确认 Step 6 并允许进入 Step 7 |
| 直接前序 | `design-calibration/03_ddd_step_06_object_contracts.md` 原状态 `completed_wait_user_review`;Step 8 batch `8.5` durable capture与batch `8.7` typed Job replay均已按reopen gate闭合,本文件状态为`completed_with_step_8_reopen` |
| 正式文档写入 | 本 Step 不修改正式 `03-详细设计.md`;正式装配留到 Step 19 |
| 上游接口输入 | `02_hld_step_07_api_interface_skeleton.md` 六类接口骨架;`02_hld_step_08_processing_flows.md` generic / independent flows |
| 架构 / 模块输入 | 正式 `01-架构设计.md` data ownership / communication;`03_ddd_step_05_module_contracts.md` owner / dependency gate |
| 对象输入 | Step 6 43 个 HLD objects、7 个 application technical helpers、field / state audit、Step 7 handoff list;event snapshot / capture关闭pre-intent窗口,Job execution journal关闭post-target / pre-report窗口,均不增加业务 truth |
| 参考粒度 | `projects/L1-governance/design-calibration/03_ddd_step_07_trait_port_adapter_contracts.md`;`projects/L1-artifact/design-calibration/03_ddd_step_07_trait_port_adapter_contracts.md` |
| 旧材料处理 | 旧 `03` repository / service / gateway / outbox / provider adapter 只作 historical material / pollution audit |

## 1. Step 7 写入批次状态表

| 批次 | 覆盖范围 | 写入状态 | 是否内容完整 | 停审状态 | 后续批次 |
|---|---|---|---|---|---|
| `7.0` | 开工、输入、SOP 回答、模块 owner、接缝分组、写入门禁 | completed | 是 | completed | `7.1` |
| `7.1` | application-local page / loaded / scan helper、UoW、Clock、IdGenerator | completed | 是 | completed | `7.2` |
| `7.2` | identity / registry / descriptor / relation / exposure truth repositories | completed | 是 | completed | `7.3` |
| `7.3` | change / trace / impact、view / material / report、truth snapshot repositories | completed | 是 | completed | `7.4` |
| `7.4` | external reference / canonical state、idempotency / stored result repositories | completed | 是 | completed | `7.5` |
| `7.5` | external resolver、consumer ref、audit handoff、event collaboration ports;infra / entry contracts | completed | 是 | completed | `7.6` |
| `7.6` | 模块停审、跨接缝审计、Step 6 watchpoint、回填草稿、Step 8 handoff | completed | 是 | completed_wait_user_review | 无 |
| `7.R1` | Step 8 batch `8.5` 可靠传播反查:durable payload snapshot / capture repository、same-UoW capture、post-commit stable-intent bind、adapter parity 与计数重审 | completed | 是 | completed_with_step_8_reopen | 回到 Step 8 batch `8.5` |
| `7.R2` | Step 8 batch `8.7` 跨协议 replay 反查:variant-bound typed Job response envelope、stored-result save/get、adapter parity 与Job no-rerun gate | completed | 是 | completed_with_step_8_reopen | 回到 Step 8 batch `8.7` |
| `7.R3` | Step 9 batch `9.2` 多changed-subject material反查:先收集、typed union去重、single-load / single-save / single-capture | completed | 是 | completed_with_step_9_reopen | 回到 Step 9 batch `9.2` |
| `7.R4` | Step 9 batch `9.3` canonical-reference material反查:exact reference index、typed union、single-load / single-save / single-capture | completed | 是 | completed_with_step_9_reopen | 回到 Step 9 batch `9.3` |
| `7.R5` | Step 9 batch `9.6` Query反查:exact-impact paged summary scope、historical exact trace read、handoff scope one-way mapping | completed | 是 | completed_with_step_9_reopen | 回到 Step 9 batch `9.6` |
| `7.R6` | Step 9 batch `9.9` collaboration反查:external outcome exact source、candidate / capture / snapshot / outcome source symmetry | completed | 是 | completed_with_step_9_reopen | 回到 Step 9 batch `9.9` |
| `7.R7` | Step 9 batch `9.11` pre-entry反查:Job execution journal exact get / atomic create / optimistic save、durable / fake parity与no-scan gate | completed | 是 | completed_with_step_9_reopen | 回到 Step 9 batch `9.11` pre-entry gate |
| `7.R8` | Step 9 batch `9.11`反查:preclassified failed-target zero-effect terminal save与adapter parity | completed | 是 | completed_with_step_9_reopen | 回到 Step 9 batch `9.11` |
| `7.R9` | Step 9 batch `9.12`反查:repair Job captured bind + journal success same-UoW与IntentBound / intent-only journal outcome | completed | 是 | completed_with_step_9_reopen | 回到 Step 9 batch `9.12` |
| `7.R10` | Step 10 batch `10.2`反查:governance / method current-by-identity exact non-terminal state subset与route parity | completed | 是 | completed_with_step_10_reopen | 回到 Step 10 batch `10.2` |
| `7.R11` | Step 12 batch `12.4`反查:read-visibility resolver closed degraded source与durable/fake parity | completed | 是 | completed_with_step_12_reopen | 回到 Step 12 batch `12.4` |

## 2. 本步输入

| 输入 | 当前状态 | 本 Step 用途 |
|---|---|---|
| `project_execution_ledger.md` / `03_ddd_calibration_flow.md` | read | 确认 Step 6 已完成停审且用户已确认进入 Step 7。 |
| `03_ddd_step_05_module_contracts.md` | completed | 提供七模块 owner、依赖方向、port / adapter / entry 归属门禁和文件位置。 |
| `03_ddd_step_06_object_contracts.md` | completed_with_step_9_reopen | 提供 exact object / ref / state / 7 个 application technical helper、field source、expected-version / append-only / handoff承接；新增event snapshot / capture与Job execution journal exact contract。 |
| 正式 `01-架构设计.md` §8 / §9 | active baseline | 提供数据 owner、一致性、runtime / event collaboration 和非编译 sibling 依赖边界。 |
| 正式 `02-概要设计.md` §7 / §8 / §9 / §12 | active baseline | 提供接口分类、flow family、state trigger 和详细设计 handoff。 |
| `02_hld_step_07_api_interface_skeleton.md` | completed | 提供 26 Command、Query、6 Inbound、10 Outbound candidate、8 Job、6 External Port skeleton 的用途与边界。 |
| `02_hld_step_08_processing_flows.md` | completed | 提供 generic write / read / consumer / job、event candidate 形成、no-write / no-repair / no-rollback 要求。 |
| `02_hld_step_09_state_machine.md` | completed | 提供 state owner、状态传播和 Step 10 matrix 输入。 |
| 详细设计 SOP Step 7 / 书写规范 §5.5 | read | 约束逐模块 port capability -> exact trait、read / write pairing、version / UoW 和跨模块审计。 |
| L1 governance / artifact Step 7 | read | 参考 service seam、repository read surface、stored result、resolver / publisher / handoff 和 fake parity 粒度。 |

## 3. SOP 问题回答

### 3.1 哪些模块定义、实现和调用 port?

- `application` 是唯一正式定义并直接调用 repository、projection、reference、resolver、handoff、event collaboration、idempotency、stored result、UoW、clock 和 id generator trait 的模块。
- `infra` 只实现这些 trait,不得复制 trait、修改参数 / 返回类型或在 adapter 内重做 domain policy。
- `api`、`worker`、`jobs` 只调用 application service / internal publication facade,不得直接持有 repository、resolver、handoff、publisher 或 UoW。
- `contracts` 只拥有 public carrier;`domain` 只拥有 object / policy / invariant;二者不定义 infrastructure port。

### 3.2 哪些 Step 6 对象能力需要接缝?

需要正式接缝的能力包括:

- 43 个 domain object 的 versioned load / save、current / active relation lookup、append-only change read / append。
- controlled view、directory projection、audit export、ecosystem discovery 和 reconciliation report 的 source lookup、replace / append、affected-material scan。
- 8 类 external ref 与 canonical resolution state 的 get / save / subject uniqueness / refresh scan。
- trace append revision、impact / downstream summary、handoff ref 的 current / list / save。
- application idempotency reserve / complete、zero-write conflict classification 与 immutable stored-result surface save / replay。
- application Job execution journal按normalized idempotency key exact load、initial atomic create、per-target / final optimistic save；不得按run或scope扫描恢复。
- body-free external resolution、observability / audit handoff 和 capability access event collaboration。

### 3.3 读取面怎样覆盖 Step 8 / 9 / 10?

- mutation repository 必须返回 `Loaded<T>`:object + persisted `expected_version`,禁止 transition 后再从 mutated object 猜 expected version。
- Query / Job 必需的 current-by-owner、list-by-scope、find-by-source、find-affected-material 和 current-resolution-by-subject 读取面必须显式命名。
- page / cursor helper 只属于 application port;Step 8 public page DTO 必须另行映射,不得直接暴露 repository cursor internal format。
- not found 返回 `Option`;port / adapter failure 返回 `ApplicationError`;not-visible / degraded 由 application read decision 处理,不得由 repository 伪装 not found。

### 3.4 写入面怎样闭合 version、UoW、append-only 和幂等?

- create / update truth、relation、fact、view、reference state、idempotency 使用 `expected_version: Option<Version>`;create = `None`,update 必须来自 `Loaded<T>.expected_version`。
- immutable change record / report 使用 append;trace append-revision 使用 `expected_previous_version` 保证 current revision 不分叉。
- 所有同一 accepted operation 的 local truth、change、trace / impact、stored result、完整 outbound envelope snapshot 和 initial capture 必须传同一 UoW。snapshot / capture 只固定 committed exact source 与可恢复 bytes,不表示 external collaboration 已发生;external intent 仍须在 commit 后经 port 形成,再由独立短 local UoW绑定。exact save order留给Step 11。
- fresh multi-target Job必须先完成deterministic planning,再将reservation与完整execution plan或typed planning-failure空计划及initial run issues传入同一initial UoW；每个target business effect / matching capture与terminal success必须传同一target UoW；typed report、journal finalization与idempotency completion必须传同一final UoW。journal update的expected version只来自`Loaded<CapabilityJobExecutionRecord>.expected_version`。
- duplicate replay 只经 idempotency + stored-result repository,不得重新执行 domain mutation或从 current truth 重算 response。

### 3.5 external port 如何保持 body-free 和 owner 边界?

- resolver 只返回 `ReferenceResolutionObservation` 和明确允许的 safe summary,不返回 external source、governance、method、secret、document、SDK、runtime 或 audit body。
- `CapabilityAccessEventCollaborationPort` 只接收从 official immutable payload snapshot 恢复出的 transient candidate,不接收 source truth body,也不定义 topic、outbox / relay产品、retry 参数或 message-bus 产品。
- `ObservabilityAuditHandoffPort` 只交接 trace / export / audit refs 和 safe scope,不写 observability store,不返回 evidence alias。

### 3.6 Step 6 reopen watchpoint 是否触发?

Step 8 batch `8.5` 已触发并闭合一次最小回开:

- `CH-DDD-S7-WATCH-001` 触发原因是 transient-only post-commit formation 在 local source commit 与 external intent 建立之间存在不可恢复崩溃窗口,无法满足 repair job 已声明的恢复语义。
- Step 6 已新增 application-owned immutable `CapabilityEventPayloadSnapshot` 与 versioned `CapabilityEventCaptureRecord`;本 Step 新增 `CapabilityEventCaptureRepository`、snapshot / capture id generator、same-UoW capture、exact load / scan和stable-intent bind surface。
- local capture只表达`Captured -> IntentBound`,不复制external `PendingDelivery / Delivered / Failed / HandoffUnavailable`;因此没有把 external delivery truth、本地 outbox产品、relay、topic或retry机制并入本仓。
- repository page、loaded wrapper、scan scope、resolver observation、handoff / collaboration outcome仍是application-local callable carrier;`infra/api/worker/jobs`没有获得新的业务truth owner。

Step 9 batch `9.11` pre-entry又触发并闭合一次受控回开:

- `CH-DDD-S9-JOB-TX-001`证明仅有`reservation UoW -> per-target UoW* -> final-report UoW`不足以恢复target commit后的exact outcome。
- Step 6已新增idempotency-key-owned `CapabilityJobExecutionRecord`;本Step新增一个repository Port,只提供exact get、atomic create与optimistic save。
- repository不提供list / scan / find-by-run,也不创建execution id、progress blob、lease、attempt或scheduler state。current application-owned Port因此由35增至36。

## 4. 模块级 port 归属与执行顺序

### 4.1 模块归属总览

| 模块 | 定义 port | 实现 port | 直接访问 port | 本 Step 结论 |
|---|---|---|---|---|
| `contracts` | 否 | 否 | 否 | 只提供 Step 6 shared carrier;Step 8 才定义 public protocol。 |
| `domain` | 否 | 否 | 否 | 只提供 object / policy / invariant;不得依赖 repository / external client。 |
| `application` | 是 | 否 | 是 | 所有 port trait 和 application-local callable helper 的唯一 owner。 |
| `infra` | 否 | 是 | 否 | 实现 application port;通过 runtime builder 注入;负责 durable / fake parity。 |
| `api` | 否 | 否 | 否 | 只做 command / query mapping 并调用 application service。 |
| `worker` | 否 | 否 | 否 | 只做 inbound / publication / projection loop entry 并调用 application facade。 |
| `jobs` | 否 | 否 | 否 | 只做 one-shot job mapping / exit surface 并调用 application job service。 |

### 4.2 接缝执行顺序

| 顺序 | 接缝组 | Step 6 来源 | 完成后停审点 |
|---:|---|---|---|
| 1 | application helper / UoW / clock / id | metadata、all factory ids、expected version | factory field source 与 transaction handle 不再悬空 |
| 2 | identity / registry repositories | identity / review / registry truth + records | command / query load-save pairing 闭合 |
| 3 | descriptor / governance / method / exposure repositories | descriptor / ref / relation / exposure / visibility | prerequisite lookup、version write、body-free ref read 闭合 |
| 4 | change / trace / impact repositories | six change records、trace revisions、impact / feedback | append / current / history / consumer lookup 闭合 |
| 5 | view / derived / report / snapshot repositories | consumer view、directory / export / discovery / report | Query / Job source / affected material / rebuild surface 闭合 |
| 6 | external reference / canonical state repositories | 8 refs + one canonical state | subject uniqueness、refresh scan、state save 闭合 |
| 7 | idempotency / stored result / Job execution | Step 6 application helper | reserve / complete / replay / reserved reentry / missing surface 闭合 |
| 8 | resolver / handoff / collaboration + adapter / entry | HLD external port skeleton | body-free boundary、fake parity、entry access rule 闭合 |

## 5. Step 7 写入门禁

- 每个 trait 必须给 exact Rust signature、参数 / 返回 / error type、定义方、调用方、实现方和后续承接。
- mutation 前置读取必须返回 persisted expected version;写入不得从 current time / caller input / mutated object 猜 version。
- `save` / `append` 必须显式携带 `&dyn CapabilityUnitOfWork`;Query-only repository read 不得开启 write UoW。
- append-only change / report 不得暴露 update;trace revision 必须 append,不得 overwrite 历史 revision。
- resolver / handoff / collaboration 只使用 Step 6 body-free carrier;禁止 external body / execution payload / SDK client / governance / method / secret / audit store material。
- adapter 不解释 business state,不调用 domain mutation,不定义 parallel error / DTO / object owner。
- 本 Step 不用“调用数据库 / 外部服务”替代 callable contract,也不固定具体 persistence / bus / SDK 产品。
- 代码块中的 native `async fn` 是 Rust-facing callable contract。Step 14 batch `14.5.2.2.3` 已固定所有进入 `Arc / Box<dyn ... + Send + Sync>` graph 的本 Step async trait 使用 `#[async_trait::async_trait]`，版本 `0.1.89`，且不得使用 `?Send`；该 lowering 不得改变方法名、参数 / 返回 / error 语义或 durable / fake parity。

---

## 6. Shared application port helper

### 6.1 loaded / page / scan / snapshot helper

以下类型归 `crates/application/src/ports.rs` 或 `unit_of_work.rs`,只用于 application-to-port callable surface,不进入 `contracts` public protocol。

```rust
/// Stable application-local reference for one write transaction.
#[derive(Clone)]
pub struct CapabilityTransactionRef(
    /// Opaque transaction identity used only for authoritative commit resolution.
    CapabilityOpaqueId,
);

/// Opaque application-local cursor for repository pagination.
pub struct CapabilityRepositoryCursor(CapabilityOpaqueId);

/// Validated repository page request.
pub struct CapabilityRepositoryPageRequest {
    /// Opaque continuation cursor returned by the same repository method.
    pub cursor: Option<CapabilityRepositoryCursor>,
    /// Maximum number of items requested from the adapter.
    pub limit: u32,
}

/// Repository page returned to application services.
pub struct CapabilityRepositoryPage<T> {
    /// Items in stable repository order.
    pub items: Vec<T>,
    /// Opaque continuation cursor when more items remain.
    pub next_cursor: Option<CapabilityRepositoryCursor>,
}

/// Persisted object paired with the version required by the next save.
pub struct Loaded<T> {
    /// Persisted object value.
    pub value: T,
    /// Persisted optimistic version captured before domain mutation.
    pub expected_version: Version,
}

/// Scope used to load committed capability access truth references.
pub enum CapabilityTruthSnapshotScope {
    /// Snapshot centered on one registry entry.
    RegistryEntry(CapabilityRegistryEntryId),
    /// Snapshot centered on one formal exposure.
    FormalExposure(FormalExposureBoundaryId),
    /// Snapshot centered on one traceability record.
    Traceability(CapabilityAccessTraceabilityRecordId),
    /// Snapshot limited to one downstream consumer boundary.
    Consumer(CapabilityConsumerRef),
    /// Snapshot for a declared reconciliation scope.
    Reconciliation(CapabilityReconciliationScope),
    /// Paged snapshot of all committed capability access truth.
    AllCommittedTruth,
}

/// Body-free committed truth snapshot used by rebuild and reconciliation flows.
pub struct CapabilityAccessTruthSnapshot {
    /// Scope used to load the snapshot.
    pub scope: CapabilityTruthSnapshotScope,
    /// Non-empty committed truth references covered by the snapshot.
    pub truth_refs: AccessTruthRefSet,
    /// Exact source versions covered by the snapshot.
    pub source_versions: DerivedMaterialSourceVersionSet,
}

/// Scope used by canonical external-reference refresh scans.
pub enum CapabilityReferenceScanScope {
    /// Explicit local reference subjects.
    ExplicitSubjects(Vec<ReferenceSubjectRef>),
    /// All references of the declared kinds.
    ReferenceKinds(Vec<ReferenceKind>),
    /// References whose canonical value is not resolved.
    NonResolved,
    /// All registered capability-hub references.
    AllReferences,
}

/// Application-local scope used to find derived materials for stale propagation, maintenance, or reconciliation.
pub enum CapabilityDerivedMaterialScanScope {
    /// All materials indexed as affected by one access truth subject.
    AffectedByTruth(CapabilityTraceSubjectRef),
    /// Mutable non-view materials that must be marked stale with one truth change.
    MutableAffectedByTruth(CapabilityTraceSubjectRef),
    /// Mutable non-view materials that must be marked stale with one canonical reference-state change.
    MutableAffectedByReference(ReferenceSubjectRef),
    /// Materials of one rebuildable category.
    MaterialKind(DerivedMaterialKind),
    /// Materials covered by a reconciliation scope.
    Reconciliation(CapabilityReconciliationScope),
    /// All derived materials,including immutable reconciliation reports.
    AllMaterials,
}

/// Application-local filters supported by identity search persistence.
pub struct CapabilityIdentityRepositorySearchScope {
    /// Exact stable identity key when the caller supplied one.
    pub identity_key: Option<CapabilityIdentityKey>,
    /// Allowed identity states;an empty vector means all states.
    pub identity_states: Vec<CapabilityIdentityState>,
    /// Exact source reference when the search is source-centered.
    pub source_ref_id: Option<ExternalCapabilitySourceRefId>,
    /// Allowed source kind when the search is source-family-centered.
    pub source_kind: Option<ExternalCapabilitySourceKind>,
}

/// Application-local filters supported by registry truth listing.
pub struct CapabilityRegistryRepositoryListScope {
    /// Exact capability identity when the caller supplied one.
    pub identity_id: Option<CapabilityIdentityId>,
    /// Allowed lifecycle states;an empty vector means all states.
    pub lifecycle_states: Vec<RegistryLifecycleState>,
    /// Exact body-free visibility basis when the caller supplied one.
    pub visibility_basis: Option<RegistryVisibilityBasis>,
}

/// Application-local filters for downstream impact summary queries.
pub struct CapabilityDownstreamSummaryRepositoryScope {
    /// Exact capability impact fact when the query is impact-centered.
    pub impact_fact_ref: Option<CapabilityChangeImpactFactRef>,
    /// Exact consumer boundary when the query is consumer-centered.
    pub consumer_ref: Option<CapabilityConsumerRef>,
    /// Exact changed truth subject when the query is capability-centered.
    pub change_subject: Option<CapabilityTraceSubjectRef>,
    /// Inclusive lower observation time bound.
    pub observed_from: Option<Timestamp>,
    /// Exclusive upper observation time bound.
    pub observed_until: Option<Timestamp>,
}

/// Application-local search input for directory projection persistence.
pub struct CapabilityDirectoryRepositorySearchScope {
    /// Optional validated body-free search text.
    pub query_text: Option<CapabilitySafeText>,
    /// Optional typed facet set.
    pub facets: Option<DirectorySearchFacetSet>,
}

/// Application-local filters for one consumer's controlled-view page.
pub struct CapabilityControlledViewRepositoryListScope {
    /// Exact consumer boundary that owns every returned view.
    pub consumer_ref: CapabilityConsumerRef,
    /// Explicit exposure ids selected by application scope mapping;empty means all for the consumer.
    pub exposure_ids: Vec<FormalExposureBoundaryId>,
    /// Allowed freshness states;empty means all visible states are returned for explicit mapping.
    pub freshness_states: Vec<ConsumerViewFreshnessState>,
}

/// Body-free application-local scope of an observability or audit handoff.
pub struct CapabilityAuditHandoffScope(CapabilitySafeText);

impl CapabilityAuditHandoffScope {
    /// Validates and copies one public body-free handoff scope into the application boundary.
    pub fn try_from_input(
        input: &CapabilityAuditHandoffScopeInput,
    ) -> Result<Self, ApplicationError>;
}
```

| helper | factory / validation | 不变量 |
|---|---|---|
| `CapabilityRepositoryPageRequest` | `pub fn try_new(cursor: Option<CapabilityRepositoryCursor>, limit: u32) -> Result<Self, ApplicationError>` | `limit > 0`;最大值由 Step 14 config validator 限制;cursor 只能回传给产生它的同一方法 / scope |
| `CapabilityRepositoryPage<T>` | adapter 构造 | stable order;空 items 可带 `next_cursor = None`;不得向 public DTO 暴露 cursor 内部格式 |
| `Loaded<T>` | repository successful read | `expected_version` 是 mutation save 的唯一来源;不得从 mutated `value.version` 回读 |
| `CapabilityTruthSnapshotScope` | job / query application input mapping | scope variant 必须在 application 显式分发,adapter 不猜业务分支 |
| `CapabilityAccessTruthSnapshot` | truth snapshot repository | 只含 committed typed refs / exact versions,不含 external / runtime / secret / method / governance body |
| `CapabilityReferenceScanScope` | refresh job mapping | explicit / kind vectors 非空;不允许 raw locator filter |
| `CapabilityDerivedMaterialScanScope` | Command stale propagation / rebuild / reconcile mapping | `MutableAffectedByTruth`只供core-truth Command；`MutableAffectedByReference`只供canonical reference-state Command；其余variant服务maintenance / reconciliation；任何variant都不得返回core truth mutation target |
| `CapabilityIdentityRepositorySearchScope` | Step 8 identity search DTO mapping | application 先验证 filters;adapter 只执行 typed filter,不得做全文搜索猜测或把结果升格为 registry truth |
| `CapabilityRegistryRepositoryListScope` | Step 8 registry list DTO mapping | 空 state vector 表示 all;不得加入 runtime availability、allowlist、ranking 或 marketplace filter |
| `CapabilityDownstreamSummaryRepositoryScope` | Step 8 downstream summary query mapping | impact / consumer / subject 至少一个存在;多个selector按AND组合;time range 若同时存在必须 `from < until`;exact impact ref按summary-owned link索引收窄,adapter不得解析summary text猜subject |
| `CapabilityDirectoryRepositorySearchScope` | Step 8 search / browse DTO mapping | query text / facets 可同时缺失,表示按稳定顺序 browse all;只查询 projection,不得回退创建 registry、读取 marketplace listing 或执行 external capability |
| `CapabilityControlledViewRepositoryListScope` | Step 8 runtime/tools consumer page mapping | application 先把 public capability scope解析为 explicit exposure ids;empty exposure ids表示该 consumer全部 view,不得由 adapter读取 runtime allowlist / execution state猜 scope |
| `CapabilityAuditHandoffScope` | Step 8 handoff command / query / job mapping | validated non-empty safe text;不得包含 authorization token、raw query、audit body、evidence alias或target credential |

`CapabilityAuditHandoffScope::try_from_input` is the only public one-way constructor from the Step 8 input carrier. It reruns the application forbidden-body / non-empty validation and copies the already body-free safe value without exposing the private tuple field。It does not parse a reference selector、target、credential or external query and does not call a repository / Port。

### 6.2 polymorphic repository / seam helper

```rust
/// Body-free union of the six immutable capability access change records.
pub enum CapabilityChangeRecord {
    /// Capability identity change record.
    Identity(CapabilityIdentityChangeRecord),
    /// Capability registry change record.
    Registry(RegistryChangeRecord),
    /// Adapter descriptor change record.
    Descriptor(DescriptorChangeRecord),
    /// Governance seam relation change record.
    GovernanceSeam(GovernanceSeamChangeRecord),
    /// Capability-method relation change record.
    MethodRelation(MethodRelationChangeRecord),
    /// Formal exposure or controlled-view change record.
    Exposure(CapabilityExposureChangeRecord),
}

/// Body-free union of all eight external reference objects.
pub enum CapabilityExternalReference {
    /// External MCP, A2A, or API capability source reference.
    ExternalCapabilitySource(ExternalCapabilitySourceRef),
    /// Governance or policy result reference.
    GovernanceResult(GovernanceResultRef),
    /// Method-library asset reference.
    MethodAsset(MethodAssetRef),
    /// Externally managed secret reference.
    Secret(SecretRef),
    /// External protocol, schema, or access document reference.
    ExternalDocument(ExternalDocumentRef),
    /// Runtime or tools consumer boundary reference.
    RuntimeToolsConsumer(RuntimeToolsConsumerRef),
    /// SDK server-consumer boundary reference.
    SdkConsumer(SdkExposureConsumerRef),
    /// Observability or audit material reference.
    ObservabilityAudit(ObservabilityAuditRef),
}

/// Body-free observation returned by an external reference resolver.
pub struct ReferenceResolutionObservation {
    /// Local reference subject that was checked.
    pub reference_subject: ReferenceSubjectRef,
    /// Reference kind consistent with the subject variant.
    pub reference_kind: ReferenceKind,
    /// Observed canonical resolution value.
    pub resolution_value: ReferenceResolutionValue,
    /// Body-free resolver explanation.
    pub resolution_reason: ReferenceResolutionReason,
    /// Digest of the body-free candidate fields that were checked.
    pub candidate_digest: ReferenceCandidateDigest,
}

/// Serialized public result surface stored for duplicate replay.
pub struct CapabilityStoredResultSurface {
    /// Opaque local surface reference.
    pub surface_ref: CapabilityStoredResultSurfaceRef,
    /// Integrity digest of the serialized surface.
    pub surface_digest: CapabilityStoredResultDigest,
    /// Serialized Step 8 public result surface.
    pub serialized_surface: Vec<u8>,
}

/// Application-local typed envelope for one complete public inbound consumer receipt.
pub struct CapabilityConsumerReceiptEnvelope {
    /// Stable application result reference stored in the idempotency record.
    pub result_ref: CapabilityApplicationResultRef,
    /// Closed inbound consumer operation that produced the receipt.
    pub operation_name: CapabilityOperationName,
    /// Opaque serialized-surface reference shared with the stored result shell.
    pub surface_ref: CapabilityStoredResultSurfaceRef,
    /// Complete Step 8 public receipt used for duplicate replay.
    pub receipt: CapabilityInboundEventReceipt,
}

/// Closed typed public operations-job response stored for exact duplicate replay.
pub enum CapabilityStoredJobResponse {
    /// Response produced by registry-centered capability reconciliation.
    RegistryReconciliation(
        /// Complete typed response for the registry reconciliation job.
        CapabilityJobResponse<CapabilityRegistryReconciliationJobResult>,
    ),
    /// Response produced by controlled consumer-view refresh.
    ControlledViewRefresh(
        /// Complete typed response for the controlled-view refresh job.
        CapabilityJobResponse<ControlledConsumerViewRefreshJobResult>,
    ),
    /// Response produced by directory search and browse projection rebuild.
    DirectoryProjectionRebuild(
        /// Complete typed response for the directory projection rebuild job.
        CapabilityJobResponse<DirectorySearchBrowseProjectionRebuildJobResult>,
    ),
    /// Response produced by audit-friendly export preparation.
    AuditExportPreparation(
        /// Complete typed response for the audit export preparation job.
        CapabilityJobResponse<AuditFriendlyExportPreparationJobResult>,
    ),
    /// Response produced by read-only ecosystem discovery rebuild.
    EcosystemDiscoveryRebuild(
        /// Complete typed response for the ecosystem discovery rebuild job.
        CapabilityJobResponse<ReadOnlyEcosystemDiscoveryRebuildJobResult>,
    ),
    /// Response produced by derived-material reconciliation.
    DerivedMaterialReconciliation(
        /// Complete typed response for the derived-material reconciliation job.
        CapabilityJobResponse<DerivedMaterialReconciliationJobResult>,
    ),
    /// Response produced by external-reference resolution refresh.
    ReferenceResolutionRefresh(
        /// Complete typed response for the reference-resolution refresh job.
        CapabilityJobResponse<ExternalReferenceResolutionRefreshJobResult>,
    ),
    /// Response produced by outbound event-collaboration repair.
    EventCollaborationRepair(
        /// Complete typed response for the event-collaboration repair job.
        CapabilityJobResponse<CapabilityAccessEventCollaborationRepairJobResult>,
    ),
}

/// Application-local typed envelope for one complete public operations-job response.
pub struct CapabilityStoredJobReportEnvelope {
    /// Stable application result reference stored in the idempotency record.
    pub result_ref: CapabilityApplicationResultRef,
    /// Closed application operation that produced the job response.
    pub operation_name: CapabilityOperationName,
    /// Closed public job name mapped from the application operation.
    pub job_name: CapabilityJobName,
    /// Exact stored public response and typed report-detail schema version.
    pub schema_version: CapabilityProtocolSchemaVersion,
    /// Core job run identity copied from the accepted request metadata.
    pub run_id: JobRunId,
    /// Opaque serialized-surface reference shared with the stored result shell.
    pub surface_ref: CapabilityStoredResultSurfaceRef,
    /// Complete variant-bound Step 8 response used for duplicate replay.
    pub response: CapabilityStoredJobResponse,
}

/// One loaded durable event capture and its immutable payload snapshot.
pub struct LoadedCapabilityEventCapture {
    /// Versioned local capture record and persisted expected version.
    pub capture: Loaded<CapabilityEventCaptureRecord>,
    /// Immutable complete outbound event envelope snapshot.
    pub payload_snapshot: CapabilityEventPayloadSnapshot,
}

/// Application-local scan scope for durable event captures.
pub enum CapabilityEventCaptureScanScope {
    /// Explicit exact capture references selected by the caller.
    ExplicitCaptures(
        /// Non-empty duplicate-free capture references.
        Vec<CapabilityEventCaptureRef>,
    ),
    /// Captures committed locally but not yet bound to an external intent.
    AwaitingIntent,
}

/// Transient protocol-safe event candidate passed to the collaboration seam.
pub struct CapabilityEventCollaborationCandidateSurface {
    /// Exact durable local capture from which this transient surface was loaded.
    pub capture_ref: CapabilityEventCaptureRef,
    /// Immutable payload snapshot backing the candidate bytes.
    pub payload_snapshot_id: CapabilityEventPayloadSnapshotId,
    /// Immutable exact source copied from the stored capture and snapshot.
    pub source: CapabilityEventCaptureSourceRef,
    /// Step 8 schema and version selected by application mapping.
    pub schema_ref: CapabilityEventSchemaRef,
    /// Integrity digest of the serialized candidate.
    pub candidate_digest: CapabilityEventCandidateDigest,
    /// Complete serialized Step 8 outbound event envelope loaded from the snapshot.
    pub serialized_envelope: Vec<u8>,
    /// Distributed trace copied from the committed source operation.
    pub trace_id: TraceId,
}

/// Body-free event collaboration outcome.
pub struct CapabilityEventCollaborationOutcome {
    /// Exact immutable event source acknowledged by the collaboration intent.
    pub source: CapabilityEventCaptureSourceRef,
    /// Stable intent reference owned by the collaboration boundary.
    pub intent_ref: CapabilityEventCollaborationIntentRef,
    /// Current collaboration delivery status.
    pub status: EventCollaborationStatus,
    /// Explicit body-free reason for failed or unavailable status.
    pub reason: Option<ChangeReason>,
}

/// Scope used by the collaboration repair job.
pub enum CapabilityEventCollaborationScanScope {
    /// Explicit collaboration intent references.
    ExplicitIntents(
        /// Non-empty duplicate-free external collaboration intent references.
        Vec<CapabilityEventCollaborationIntentRef>,
    ),
    /// Intents formed from one exact immutable event source.
    Source(
        /// Exact event source used by every returned intent.
        CapabilityEventCaptureSourceRef,
    ),
    /// All pending, failed, or unavailable intents visible to the adapter.
    Repairable,
}

/// One exact event-collaboration item visible through the external seam.
pub struct CapabilityEventCollaborationItem {
    /// Stable intent reference owned by the collaboration boundary.
    pub intent_ref: CapabilityEventCollaborationIntentRef,
    /// Immutable source reference from which the intent was formed.
    pub source: CapabilityEventCaptureSourceRef,
    /// Current body-free delivery outcome.
    pub outcome: CapabilityEventCollaborationOutcome,
}
```

helper 红线:

- `CapabilityChangeRecord` / `CapabilityExternalReference` 只是 application port union,不创建第二 truth owner;variant body 必须是 Step 6 exact object。
- `ReferenceResolutionObservation` 不携带 resolver response、external body、HTTP status body、secret、governance、method、SDK、runtime 或 audit material。
- `CapabilityStoredResultSurface.serialized_surface` 只能是 Step 8 允许的 command result / rejection、consumer receipt 或 job report;不得保存 request body / external body;size / codec Step 8 / 14 闭合。
- `CapabilityConsumerReceiptEnvelope` 是 application-local typed replay carrier,不是第二份 event truth。其`result_ref.operation_name`、`operation_name`、`surface_ref`与stored shell / serialized surface必须完全对称,且`receipt.result_ref`必须映射同一application result ref。
- `CapabilityStoredJobResponse` / `CapabilityStoredJobReportEnvelope` 是 application-local typed replay carrier,不是新的Job、report truth或第36个Port。union variant、`operation_name`、`job_name`、`schema_version`、`run_id`、`result_ref`、`surface_ref`与typed response / stored shell / serialized surface必须完全对称;wrong variant、wrong schema、missing surface或run identity不对称均返回explicit consistency error。
- Job duplicate只允许从`CapabilityStoredJobReportEnvelope.response`恢复原typed detail,再把对外disposition临时映射为`DuplicateReplayed`;不得保存`DuplicateReplayed`、选择generic bytes decoder、扫描report / material / reference / capture repository、调用resolver / handoff / collaboration或从current truth重建detail。
- `CapabilityEventSchemaRef`、`CapabilityEventCandidateDigest`、`CapabilityEventCollaborationIntentRef`、`CapabilityEventCaptureSourceRef`、`CapabilityEventPayloadSnapshot`和`CapabilityEventCaptureRecord`均由Step 6 batch `8.5`回开后的application technical contract拥有;本节不得重复定义第二套carrier。
- `CapabilityEventCollaborationCandidateSurface`只在application-to-port调用期间存在,且只能从`LoadedCapabilityEventCapture`中的official immutable snapshot构造。application / worker / adapter均不得回查current truth、重新运行mapper、改写schema / digest / bytes或用missing snapshot补发。
- capture source必须是immutable / exact-version ref。Capture record与snapshot必须在source、snapshot id、schema、digest和captured time上完全对称；trace与complete serialized envelope只由immutable snapshot持有,transient candidate只能从该snapshot原样复制,不得要求或新增不存在的capture `trace_id / bytes`字段。
- collaboration outcome必须回显candidate或existing intent的exact `CapabilityEventCaptureSourceRef`;application在bind前比较outcome source与loaded capture / snapshot source。Opaque intent ref不得被解析来猜source,source mismatch不得bind。
- source revision、snapshot和`Captured` record必须在同一local UoW提交;external collaboration只能发生在该UoW commit之后。`Captured` scan关闭commit后尚未建立external intent的恢复窗口。
- `CapabilityEventCollaborationItem` 只提供 source / outcome 对称读取面,不拥有 payload、topic、attempt log、schedule 或 retry counter。
- collaboration intent ref / outcome属于external callable result;local capture只持久化opaque intent binding,不复制external pending / delivered / failed / unavailable state。若external intent建立后local bind前崩溃,重复同一capture / source / digest必须返回同一stable intent。

application-local typed Job replay construction:

| stored response variant | exact public job name | exact response detail | allowed stored disposition |
|---|---|---|---|
| `RegistryReconciliation` | `RunCapabilityRegistryReconciliation` | `CapabilityRegistryReconciliationJobResult` | `Completed / PartiallyCompleted / Failed / Retryable` |
| `ControlledViewRefresh` | `RefreshControlledConsumerView` | `ControlledConsumerViewRefreshJobResult` | same fresh set |
| `DirectoryProjectionRebuild` | `RebuildDirectorySearchBrowseProjection` | `DirectorySearchBrowseProjectionRebuildJobResult` | same fresh set |
| `AuditExportPreparation` | `PrepareAuditFriendlyExportSummary` | `AuditFriendlyExportPreparationJobResult` | same fresh set |
| `EcosystemDiscoveryRebuild` | `RebuildReadOnlyEcosystemDiscoverySummary` | `ReadOnlyEcosystemDiscoveryRebuildJobResult` | same fresh set |
| `DerivedMaterialReconciliation` | `RunDerivedMaterialReconciliation` | `DerivedMaterialReconciliationJobResult` | same fresh set |
| `ReferenceResolutionRefresh` | `RefreshExternalReferenceResolution` | `ExternalReferenceResolutionRefreshJobResult` | same fresh set |
| `EventCollaborationRepair` | `RepairCapabilityAccessEventCollaboration` | `CapabilityAccessEventCollaborationRepairJobResult` | same fresh set |

```rust
impl CapabilityStoredJobReportEnvelope {
    /// Builds a closed typed envelope for one freshly completed operations-job response.
    pub fn try_new(
        result_ref: CapabilityApplicationResultRef,
        operation_name: CapabilityOperationName,
        job_name: CapabilityJobName,
        schema_version: CapabilityProtocolSchemaVersion,
        run_id: JobRunId,
        surface_ref: CapabilityStoredResultSurfaceRef,
        response: CapabilityStoredJobResponse,
    ) -> Result<Self, ApplicationError>;

    /// Validates typed response identity and byte semantics against the immutable shell and surface.
    pub fn validate_against(
        &self,
        result: &StoredCapabilityOperationResult,
        surface: &CapabilityStoredResultSurface,
    ) -> Result<(), ApplicationError>;

    /// Returns the original typed response with only its caller-visible disposition marked as replayed.
    pub fn into_duplicate_response(
        self,
    ) -> Result<CapabilityStoredJobResponse, ApplicationError>;
}
```

factory / validator rules:

- `try_new` validates closed operation-to-job mapping,matching union variant,positive accepted schema,matching response job / schema / run,`report=Some`,fresh stored disposition andprotocol/application result-ref mapping。Fresh application Job service calls it before`save_job_report`。
- `validate_against` requires`JobReport + OperationsJob(fresh disposition)`,matching application result ref、operation、surface ref / digest andbyte-semantics-equivalent typed response。Wrong ormissing fields areconsistency errors onbothrepository save andget paths。
- `into_duplicate_response` revalidatesthe envelope,keepsall original fields / detail / issue refs andchanges onlythe returned public response disposition to`DuplicateReplayed`;it does notmutate the stored envelope。

`CapabilityProtocolResultRef`与`CapabilityApplicationResultRef`的映射必须复制同一`operation_name` safe value与同一`CapabilityApplicationResultId`;不得以`JobRunId`、reconciliation report id或surface ref替代result id。`validate_against`中的byte-semantics equivalence固定typed response与serialized surface表达同一public body；exact codec / canonicalization仍由Step 13定义,repository不得因此自行反序列化选择variant。

application-local collaboration helper construction:

| helper | construction / validation contract | owner boundary |
|---|---|---|
| `LoadedCapabilityEventCapture` | repository只在capture / snapshot id、source、schema、digest、captured time完全对称且snapshot bytes non-empty / recomputed digest匹配时返回；snapshot trace保持snapshot-owned；capture ref的version来自`Loaded.expected_version` | official collaboration / recovery read surface;不解析envelope body |
| `CapabilityEventCaptureScanScope` | `ExplicitCaptures`非空且去重;`AwaitingIntent`只匹配`Captured + intent=None` | application validates;capture repository executes typed scan |
| `CapabilityEventSchemaRef` | Step 6 `pub fn new(value: impl Into<String>) -> Result<Self, ApplicationError>`;exact event-name / schema-version encoding由Step 8 mapper固定 | application event mapper;adapter不得改写 |
| `CapabilityEventCandidateDigest` | Step 6 `pub fn from_serialized_envelope(bytes: &[u8]) -> Result<Self, ApplicationError>`;non-empty bytes;canonical algorithm留Step 13 | application digest calculator;entry / adapter不得各自计算不同口径 |
| `CapabilityEventCollaborationCandidateSurface` | `pub fn try_from_stored_capture(loaded: &LoadedCapabilityEventCapture) -> Result<Self, ApplicationError>`；校验capture / snapshot五元组与snapshot digest,再复制exact capture / snapshot refs、stored source / schema / digest及snapshot-owned bytes / trace；任何不对称或missing snapshot均失败 | transient application-to-port carrier;禁止直接从source object / public DTO构造 |
| `CapabilityEventCollaborationIntentRef` | Step 6 non-empty opaque ref;adapter不得解析内部值选择topic / status / retry policy | external collaboration boundary owner;local capture只保存binding |
| `CapabilityEventCollaborationOutcome` | `pub fn try_new(source: CapabilityEventCaptureSourceRef, intent_ref: CapabilityEventCollaborationIntentRef, status: EventCollaborationStatus, reason: Option<ChangeReason>) -> Result<Self, ApplicationError>`;failed / unavailable要求reason,candidate / pending / delivered禁止reason | external callable result;source必须复制candidate或existing intent的exact immutable source,不是本仓 truth |
| `CapabilityEventCollaborationItem` | `pub fn try_new(source: CapabilityEventCaptureSourceRef, outcome: CapabilityEventCollaborationOutcome) -> Result<Self, ApplicationError>`;item intent必须等于outcome intent且item source必须等于outcome source | external repair read carrier;不含payload / local snapshot |
| `CapabilityEventCollaborationScanScope` | `ExplicitIntents`非空且去重;`Source`是exact source;`Repairable`只匹配pending / failed / unavailable external intent | application validates;external adapter executes typed scope |

---

## 7. Application 基础 port 契约

### 7.1 `CapabilityUnitOfWork` / `CapabilityUnitOfWorkManager`

```rust
/// Marker and identity surface for one capability-hub write transaction.
pub trait CapabilityUnitOfWork: Send + Sync {
    /// Returns the stable application-local transaction reference.
    fn transaction_ref(&self) -> &CapabilityTransactionRef;

    /// Exposes the concrete transaction handle for checked infra-adapter downcasting.
    fn as_any(&self) -> &(dyn std::any::Any + Send + Sync);
}

/// Authoritative durability resolution for one completed local transaction attempt.
pub enum CapabilityCommitResolution {
    /// The transaction is durably committed and all atomic writes are authority-visible.
    Durable,
    /// The transaction authority proves that this transaction did not and cannot commit.
    NotDurable,
    /// The transaction authority cannot yet prove either durable or not-durable status.
    Unknown,
}

/// Opens and completes capability-hub application transactions.
#[async_trait::async_trait]
pub trait CapabilityUnitOfWorkManager: Send + Sync {
    /// Opens a new write transaction.
    async fn begin(&self) -> Result<Box<dyn CapabilityUnitOfWork>, ApplicationError>;

    /// Commits all writes registered against the transaction.
    async fn commit(
        &self,
        uow: Box<dyn CapabilityUnitOfWork>,
    ) -> Result<(), ApplicationError>;

    /// Rolls back a transaction that has not committed.
    async fn rollback(
        &self,
        uow: Box<dyn CapabilityUnitOfWork>,
    ) -> Result<(), ApplicationError>;

    /// Resolves the authoritative durability status of one completed transaction attempt.
    async fn resolve_commit(
        &self,
        transaction_ref: &CapabilityTransactionRef,
    ) -> Result<CapabilityCommitResolution, ApplicationError>;
}
```

| 契约 | 调用方 | 实现方 | 事务 / version 规则 |
|---|---|---|---|
| `begin` | command / accepted consumer / write job application service | `infra::runtime_builder` 注入的 durable / fake UoW adapter | Query 不调用;一个 operation 只允许一个 current UoW |
| repository `save` / `append` | application service | infra repository adapter | 必须接收同一 `&dyn CapabilityUnitOfWork`;adapter 不自行 commit |
| `commit` | application service | infra UoW manager | idempotency completed / stored result / required sidecar 与 truth 的 exact order Step 11 闭合 |
| `rollback` | application error path | infra UoW manager | 只撤销未提交本地 writes;不得向 external system 宣称 rollback |
| `resolve_commit` | commit-unknown recovery path only | same infra UoW / persistence authority | 按original `transaction_ref`返回`Durable / NotDurable / Unknown`;不得用row absence、elapsed time或replica状态代替 |

UoW 红线:

- resolver read、Query read、external handoff / collaboration delivery 不得被伪装成可由本地 UoW 回滚的 side effect。
- Step 6 batch `8.5`回开后,complete outbound envelope snapshot + initial capture必须与其exact source write进入同一local UoW;它们只是local durable sidecar,不代表external call已发生。source / snapshot / capture任一save失败时该local UoW整体rollback。
- external collaboration与audit handoff仍只在source UoW commit后调用,其失败不回滚已提交truth。event collaboration返回stable intent后,application用新的短local UoW执行capture intent binding;bind失败时原capture仍保持可扫描,repair重用同一snapshot / digest恢复。
- repository adapter 不允许创建 nested transaction 或忽略传入 UoW。
- durable / fake repository adapter 通过 `as_any()` checked downcast取得自己所属的 concrete UoW handle;类型不匹配是 wiring / consistency defect。adapter不得改用 global transaction map、只凭 `transaction_ref` 找隐式 handle或静默开启新事务;concrete UoW内部并发可变性机制由 Step 11裁剪。
- application必须在调用`commit`前复制`uow.transaction_ref()`；`commit`消费boxed UoW后，该ref只用于`resolve_commit`与redacted correlation，不得作为repository key、business id或新transaction handle。`CapabilityTransactionRef`因此必须实现`Clone`，但仍不得公开inner value或实现业务解析。
- `Durable`必须保证随后通过同一persistence binding执行的recovery reads至少观察到该transaction的完整atomic write set；`NotDurable`必须保证该transaction不会稍后变为durable。`Unknown`不等于timeout、rollback或absent，application继续返回`CommitOutcomeUnknown`。

### 7.2 `ClockPort`

```rust
/// Provides trusted application time for capability-hub objects and records.
pub trait ClockPort: Send + Sync {
    /// Returns the current authoritative application timestamp.
    fn now(&self) -> Timestamp;
}
```

| 使用方 | 字段来源 | 禁止事项 |
|---|---|---|
| object / record / report factory | created / updated / recorded / generated / checked / stored time | 不用 database default、external response time 或 client arbitrary time 替代 authoritative application time |
| operation / revision transition | same operation time | 同一 transition 的 truth / record / result 不得各自读取不同 clock 值 |

### 7.3 `IdGeneratorPort`

`IdGeneratorPort` 覆盖 Step 6 所有 `system_generated` id。domain object、handler、worker、job runner 和 repository adapter 均不得自行拼接业务 id。

```rust
/// Generates stable capability-hub identifiers for application object factories.
pub trait IdGeneratorPort: Send + Sync {
    /// Generates a capability identity identifier.
    fn new_capability_identity_id(&self) -> CapabilityIdentityId;
    /// Generates an access review fact identifier.
    fn new_access_review_fact_id(&self) -> CapabilityAccessReviewFactId;
    /// Generates an external capability source reference identifier.
    fn new_external_capability_source_ref_id(&self) -> ExternalCapabilitySourceRefId;
    /// Generates an identity change record identifier.
    fn new_identity_change_record_id(&self) -> CapabilityIdentityChangeRecordId;

    /// Generates a capability registry entry identifier.
    fn new_registry_entry_id(&self) -> CapabilityRegistryEntryId;
    /// Generates a registry change record identifier.
    fn new_registry_change_record_id(&self) -> RegistryChangeRecordId;

    /// Generates an adapter descriptor identifier.
    fn new_adapter_descriptor_id(&self) -> AdapterDescriptorId;
    /// Generates a descriptor risk summary identifier.
    fn new_descriptor_risk_summary_id(&self) -> DescriptorRiskConstraintSummaryId;
    /// Generates a secret reference identifier.
    fn new_secret_ref_id(&self) -> SecretRefId;
    /// Generates a secret handling safe summary identifier.
    fn new_secret_safe_summary_id(&self) -> SecretHandlingSafeSummaryId;
    /// Generates a descriptor change record identifier.
    fn new_descriptor_change_record_id(&self) -> DescriptorChangeRecordId;

    /// Generates a governance seam relation identifier.
    fn new_governance_seam_relation_id(&self) -> GovernanceSeamRelationId;
    /// Generates a governance result reference identifier.
    fn new_governance_result_ref_id(&self) -> GovernanceResultRefId;
    /// Generates a body-free capability-method relation identifier.
    fn new_method_relation_id(&self) -> CapabilityMethodBodyFreeRelationId;
    /// Generates a method asset reference identifier.
    fn new_method_asset_ref_id(&self) -> MethodAssetRefId;
    /// Generates a governance seam change record identifier.
    fn new_governance_seam_change_record_id(&self) -> GovernanceSeamChangeRecordId;
    /// Generates a method relation change record identifier.
    fn new_method_relation_change_record_id(&self) -> MethodRelationChangeRecordId;

    /// Generates a formal exposure boundary identifier.
    fn new_formal_exposure_id(&self) -> FormalExposureBoundaryId;
    /// Generates a formal visibility applicability identifier.
    fn new_formal_visibility_id(&self) -> FormalVisibilityApplicabilityId;
    /// Generates a controlled consumer view identifier.
    fn new_consumer_view_id(&self) -> ControlledConsumerViewId;
    /// Generates an exposure change record identifier.
    fn new_exposure_change_record_id(&self) -> CapabilityExposureChangeRecordId;

    /// Generates an access traceability record identifier.
    fn new_traceability_record_id(&self) -> CapabilityAccessTraceabilityRecordId;
    /// Generates a capability change impact fact identifier.
    fn new_impact_fact_id(&self) -> CapabilityChangeImpactFactId;
    /// Generates a downstream impact summary identifier.
    fn new_downstream_impact_summary_id(&self) -> DownstreamConsumptionImpactSummaryId;

    /// Generates a directory projection identifier.
    fn new_directory_projection_id(&self) -> DirectorySearchBrowseProjectionId;
    /// Generates an audit-friendly export summary identifier.
    fn new_audit_export_id(&self) -> AuditFriendlyExportSummaryId;
    /// Generates an ecosystem discovery summary identifier.
    fn new_ecosystem_discovery_id(&self) -> ReadOnlyEcosystemDiscoverySummaryId;
    /// Generates a reconciliation report identifier.
    fn new_reconciliation_report_id(&self) -> CapabilityReconciliationReportId;

    /// Generates a canonical reference resolution state identifier.
    fn new_reference_resolution_state_id(&self) -> ReferenceResolutionStateId;
    /// Generates an external document reference identifier.
    fn new_external_document_ref_id(&self) -> ExternalDocumentRefId;
    /// Generates a runtime or tools consumer reference identifier.
    fn new_runtime_tools_consumer_ref_id(&self) -> RuntimeToolsConsumerRefId;
    /// Generates an SDK exposure consumer reference identifier.
    fn new_sdk_consumer_ref_id(&self) -> SdkExposureConsumerRefId;
    /// Generates an observability or audit reference identifier.
    fn new_observability_audit_ref_id(&self) -> ObservabilityAuditRefId;

    /// Generates an immutable outbound event payload snapshot identifier.
    fn new_event_payload_snapshot_id(&self) -> CapabilityEventPayloadSnapshotId;
    /// Generates a durable outbound event capture identifier.
    fn new_event_capture_id(&self) -> CapabilityEventCaptureId;

    /// Generates an application result identifier.
    fn new_application_result_id(&self) -> CapabilityApplicationResultId;
    /// Generates an opaque stored-result surface reference.
    fn new_stored_result_surface_ref(&self) -> CapabilityStoredResultSurfaceRef;
}
```

| 覆盖组 | Step 6 factory / field source | 禁止事项 |
|---|---|---|
| identity / registry | identity / review / source ref / change / registry ids | 不用 source URL、identity key、trace id 代替 |
| descriptor / relation | descriptor / summaries / refs / relation / change ids | 不从 external provider / governance / method id 猜 local id |
| exposure / trace / impact | exposure / visibility / view / change / trace / impact / feedback ids | 不用 consumer ref / source event id 代替 |
| derived / report | directory / export / discovery / report ids | 不用 job run id / cursor 代替 |
| canonical references | resolution state / document / consumer / SDK / audit ids | local id 与 external locator / ref value 分离 |
| event capture | immutable payload snapshot / durable capture ids | 不用source ref、schema ref、candidate digest或external intent替代 |
| application result | result id / surface ref | 不用 truth id、trace id、job run id 或 external URL 代替 |

### 7.4 `CapabilityReadVisibilityResolverPort`

Query必须在读取truth / projection / report body之前取得正式visibility resolution。下列helper归`application::ports`,只在application-to-port边界传递,不进入public Query DTO或持久化truth。

```rust
/// Closed scope resolved for one capability-hub read decision.
pub enum CapabilityReadScopeRef {
    /// Capability-hub-wide catalog scope filtered by the trusted actor.
    CapabilityHub,
    /// Scope owned by one capability identity.
    Identity(
        /// Capability identity that owns the read scope.
        CapabilityIdentityId,
    ),
    /// Scope owned by one capability registry entry.
    RegistryEntry(
        /// Registry entry that owns the read scope.
        CapabilityRegistryEntryId,
    ),
    /// Scope owned by one formal exposure boundary.
    FormalExposure(
        /// Formal exposure that owns the read scope.
        FormalExposureBoundaryId,
    ),
    /// Scope owned by one registered consumer boundary.
    Consumer(
        /// Consumer boundary that owns the read scope.
        CapabilityConsumerRef,
    ),
    /// Scope owned by one access truth subject and its trace history.
    TraceSubject(
        /// Access truth subject that owns the read scope.
        CapabilityTraceSubjectRef,
    ),
    /// Scope owned by one rebuildable derived material.
    DerivedMaterial(
        /// Derived material that owns the read scope.
        DerivedMaterialRef,
    ),
    /// Scope owned by one body-free external reference.
    Reference(
        /// External reference subject that owns the read scope.
        ReferenceSubjectRef,
    ),
    /// Scope for downstream summaries selected by impact, consumer, and/or change subject.
    DownstreamImpact {
        /// Exact capability impact fact when the page is impact-centered.
        impact_fact_ref: Option<CapabilityChangeImpactFactRef>,
        /// Consumer boundary when the page is consumer-centered.
        consumer_ref: Option<CapabilityConsumerRef>,
        /// Changed truth subject when the page is subject-centered.
        change_subject: Option<CapabilityTraceSubjectRef>,
    },
    /// Scope for audit exports selected by an exact body-free export scope.
    AuditExport(
        /// Body-free audit export scope used by the repository lookup.
        AuditExportScope,
    ),
    /// Scope for immutable reconciliation reports.
    Reconciliation(
        /// Declared reconciliation scope used by the report repository.
        CapabilityReconciliationScope,
    ),
}

/// Stable source used by the resolver to form a read visibility result.
pub enum CapabilityReadVisibilitySourceMarker {
    /// Trusted entry actor scope is sufficient for this catalog-level read.
    TrustedEntryScope,
    /// A persisted owner-chain index resolved the subject scope.
    OwnerChainIndex,
    /// Formal visibility applicability is the visibility authority.
    FormalVisibilityFact,
    /// Registered consumer applicability is the visibility authority.
    ConsumerApplicability,
    /// Persisted derived-material state is the read authority.
    DerivedMaterialState,
    /// Trace or impact subject index is the read authority.
    TraceabilityIndex,
    /// Canonical external-reference boundary is the read authority.
    ReferenceBoundary,
    /// A page-level access policy resolved visibility before item loading.
    PageScopePolicy,
}

/// Resolver-first visibility result for one single or page-level read subject.
pub struct CapabilityReadVisibilityResolution {
    /// Exact single or collection subject requested by the query service.
    pub read_subject_ref: CapabilityReadSubjectRef,
    /// Formal owner or page scope resolved without parsing an opaque id.
    pub scope_ref: CapabilityReadScopeRef,
    /// Trusted actor evaluated by the resolver.
    pub actor_context: ActorContext,
    /// Visible, not-visible, or degraded resolver outcome.
    pub visibility: CapabilityReadVisibilityMarker,
    /// Required closed public-safe reason for a degraded outcome.
    pub degraded_reason: Option<CapabilityReadDegradedReason>,
    /// Exact truth or material versions used by the resolver.
    pub source_versions: DerivedMaterialSourceVersionSet,
    /// Stable authority that produced this resolution.
    pub source_marker: CapabilityReadVisibilitySourceMarker,
    /// Authoritative application time of the resolution.
    pub resolved_at: Timestamp,
}
```

| helper capability | exact contract | invariant |
|---|---|---|
| subject / actor parity | `pub fn assert_matches(&self, subject: &CapabilityReadSubjectRef, actor: &ActorContext) -> Result<(), ApplicationError>` | exact subject + trusted actor match;不得从loaded body重写resolution |
| decision mapping | `pub fn into_decision(self) -> Result<CapabilityReadVisibilityDecision, ApplicationError>` | 只复制subject / actor / marker / degraded reason / source versions / time到Step 6 decision;不得重新计算visibility |
| degraded pairing | constructor / adapter validation | `Degraded`必须`Some(CapabilityReadDegradedReason::from_kind(closed_kind))`;`Visible / NotVisible`禁止reason；kind只可来自`source_marker`对应formal typed authority |
| page-level empty | collection subject + scope | resolver在repository page读取前返回resolution;empty page不依赖item生成visibility |

```rust
/// Resolves read visibility and owner scope before any query body is loaded.
#[async_trait::async_trait]
pub trait CapabilityReadVisibilityResolverPort: Send + Sync {
    /// Resolves one exact single-object read subject.
    async fn resolve_subject(
        &self,
        actor_context: &ActorContext,
        subject: CapabilityReadSubjectRef,
    ) -> Result<CapabilityReadVisibilityResolution, ApplicationError>;

    /// Resolves page-level access for an identity search.
    async fn resolve_identity_search(
        &self,
        actor_context: &ActorContext,
        scope: &CapabilityIdentityRepositorySearchScope,
    ) -> Result<CapabilityReadVisibilityResolution, ApplicationError>;

    /// Resolves page-level access for a registry truth listing.
    async fn resolve_registry_list(
        &self,
        actor_context: &ActorContext,
        scope: &CapabilityRegistryRepositoryListScope,
    ) -> Result<CapabilityReadVisibilityResolution, ApplicationError>;

    /// Resolves page-level access for descriptor history owned by one identity.
    async fn resolve_descriptor_history(
        &self,
        actor_context: &ActorContext,
        identity_id: CapabilityIdentityId,
    ) -> Result<CapabilityReadVisibilityResolution, ApplicationError>;

    /// Resolves page-level access for relation history owned by one identity.
    async fn resolve_relation_history(
        &self,
        actor_context: &ActorContext,
        identity_id: CapabilityIdentityId,
    ) -> Result<CapabilityReadVisibilityResolution, ApplicationError>;

    /// Resolves page-level access for controlled consumer views.
    async fn resolve_controlled_view_list(
        &self,
        actor_context: &ActorContext,
        scope: &CapabilityControlledViewRepositoryListScope,
    ) -> Result<CapabilityReadVisibilityResolution, ApplicationError>;

    /// Resolves page-level access for traceability history.
    async fn resolve_traceability_list(
        &self,
        actor_context: &ActorContext,
        subject: CapabilityTraceSubjectRef,
    ) -> Result<CapabilityReadVisibilityResolution, ApplicationError>;

    /// Resolves page-level access for downstream impact summaries.
    async fn resolve_downstream_summary_list(
        &self,
        actor_context: &ActorContext,
        scope: &CapabilityDownstreamSummaryRepositoryScope,
    ) -> Result<CapabilityReadVisibilityResolution, ApplicationError>;

    /// Resolves page-level access for directory search.
    async fn resolve_directory_search(
        &self,
        actor_context: &ActorContext,
        scope: &CapabilityDirectoryRepositorySearchScope,
    ) -> Result<CapabilityReadVisibilityResolution, ApplicationError>;

    /// Resolves page-level access for directory browse.
    async fn resolve_directory_browse(
        &self,
        actor_context: &ActorContext,
        scope: &CapabilityDirectoryRepositorySearchScope,
    ) -> Result<CapabilityReadVisibilityResolution, ApplicationError>;

    /// Resolves page-level access for audit exports in one scope.
    async fn resolve_audit_export_list(
        &self,
        actor_context: &ActorContext,
        scope: &AuditExportScope,
    ) -> Result<CapabilityReadVisibilityResolution, ApplicationError>;

    /// Resolves page-level access for reconciliation reports in one scope.
    async fn resolve_reconciliation_report_list(
        &self,
        actor_context: &ActorContext,
        scope: &CapabilityReconciliationScope,
    ) -> Result<CapabilityReadVisibilityResolution, ApplicationError>;
}
```

resolver rules:

- `resolve_subject`必须根据closed `CapabilityReadSubjectRef`使用正式owner / visibility / reference index;不得先加载query body再从字段拼scope。
- page方法必须在repository `search / list`前执行并返回对应collection subject;empty page沿用该resolution,不得从第一项或cursor生成marker。
- `NotVisible`是成功resolution,application返回body-free public surface;missing target只有在resolution允许暴露absence后才能映射visible not-found。
- `Degraded`的reason不是诊断文本。resolver必须从formal typed policy、persisted material state、canonical reference value或typed visibility rule选择existing 8个`CapabilityQueryDegradedKind`之一,再调用`CapabilityReadDegradedReason::from_kind(...)`;不得从`CapabilitySafeText`、raw / formatted error、timestamp、cursor、first item或adapter-private enum推导。
- `CapabilityReadVisibilitySourceMarker`只说明authority family,不能单独决定degraded kind。例如`ReferenceBoundary`仍需canonical `ReferenceResolutionValue`决定Unresolved / Unavailable / Stale / Redacted；`DerivedMaterialState`仍需persisted state决定Stale / Rebuilding / MaterialUnavailable / Partial。
- resolver只读actor scope、owner relation、formal visibility、consumer applicability、derived state、trace index或reference boundary;不刷新projection / reference、不创建truth、不调用write UoW。
- durable实现归`infra::read_visibility`,fake必须保持subject / scope / marker / closed degraded kind / source versions / empty-page语义一致;不得用fixture默认`Visible`或fake-private reason。

### 7.5 application 基础 port 停审记录

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| factory id / time 来源是否闭合 | pass | `IdGeneratorPort` + `ClockPort` 覆盖 Step 6 system-generated / authoritative-time fields |
| expected version 来源是否闭合 | pass | repository read 统一返回 `Loaded<T>`;save 使用 captured `expected_version` |
| Query resolver-first visibility | pass after Step 8 reopen | single subject + 11类collection subject均有正式resolution;empty page不依赖item |
| transaction handle 是否有唯一 owner | pass | application manager / marker trait;infra 实现;entry / domain 不创建 UoW |
| page helper 是否会泄漏 public protocol | blocked by contract | application-local cursor / page;Step 8 必须映射 public page schema |
| Step 6 reopen 是否触发 | yes and closed in batch `8.5` | read/page/UoW helper仍非persisted object;event payload snapshot / capture已按Step 6 technical-helper contract正式回开并由§13.4承接 |

---

## 8. Identity / Registry truth repository 契约

### 8.1 port capability / 接缝清单

| capability / 对象能力 | 需要的接缝 | 调用方 | 实现方 | 后续承接 |
|---|---|---|---|---|
| create / correct / retire identity | key / ref versioned read、save、paged scan | identity command service | `infra::repositories` | Step 9 identity flow;Step 11 persistence |
| record / supersede / invalidate access review | review exact read、current-by-identity、save / list | identity / descriptor service | `infra::repositories` | Step 8 review query;Step 9 review flow |
| register / transition / retire registry entry | entry versioned read、identity uniqueness lookup、save / list | registry service | `infra::repositories` | Step 9 registry flow;Step 10 matrix |
| identity / registry query | exact read、stable page | query service | `infra::repositories` | Step 8 view / page mapping |

### 8.2 `CapabilityIdentityRepository`

```rust
/// Persists capability identity truth with optimistic concurrency.
#[async_trait::async_trait]
pub trait CapabilityIdentityRepository: Send + Sync {
    /// Loads one capability identity and its persisted expected version.
    async fn get_with_version(
        &self,
        identity_ref: CapabilityIdentityRef,
    ) -> Result<Option<Loaded<CapabilityIdentity>>, ApplicationError>;

    /// Finds the current capability identity with one local identity id.
    async fn find_by_id(
        &self,
        identity_id: CapabilityIdentityId,
    ) -> Result<Option<Loaded<CapabilityIdentity>>, ApplicationError>;

    /// Finds the current identity with the declared stable identity key.
    async fn find_by_identity_key(
        &self,
        identity_key: &CapabilityIdentityKey,
    ) -> Result<Option<Loaded<CapabilityIdentity>>, ApplicationError>;

    /// Searches capability identities by validated application-local filters.
    async fn search(
        &self,
        scope: CapabilityIdentityRepositorySearchScope,
        page: CapabilityRepositoryPageRequest,
    ) -> Result<CapabilityRepositoryPage<Loaded<CapabilityIdentity>>, ApplicationError>;

    /// Creates or updates capability identity truth in the supplied transaction.
    async fn save(
        &self,
        identity: CapabilityIdentity,
        expected_version: Option<Version>,
        uow: &dyn CapabilityUnitOfWork,
    ) -> Result<CapabilityIdentityRef, ApplicationError>;
}
```

| 函数 | 读取 / 写入面 | version / uniqueness 规则 |
|---|---|---|
| `get_with_version` | correct / retire / query exact identity | exact ref version 非空时必须匹配;返回 persisted expected version |
| `find_by_id` | HLD Query / relation composition by local identity id | 读取 current persisted identity;不从 `CapabilityIdentityRef` 字符串或 source locator反解 id |
| `find_by_identity_key` | create duplicate guard / search identity anchor | stable key current uniqueness;retired history 不伪装 current active |
| `search` | identity search read source | typed filters + stable order + opaque cursor;public filter / page DTO Step 8 映射 |
| `save` | create / state transition | create expected `None`;update `Some(loaded.expected_version)`;conflict explicit error |

### 8.3 `CapabilityAccessReviewRepository`

```rust
/// Persists body-free capability access review facts.
#[async_trait::async_trait]
pub trait CapabilityAccessReviewRepository: Send + Sync {
    /// Loads one access review fact with its persisted expected version.
    async fn get_with_version(
        &self,
        review_ref: CapabilityAccessReviewFactRef,
    ) -> Result<Option<Loaded<CapabilityAccessReviewFact>>, ApplicationError>;

    /// Finds the current recorded review fact for one identity.
    async fn find_current_by_identity(
        &self,
        identity_id: CapabilityIdentityId,
    ) -> Result<Option<Loaded<CapabilityAccessReviewFact>>, ApplicationError>;

    /// Lists historical and current review facts for one identity.
    async fn list_by_identity(
        &self,
        identity_id: CapabilityIdentityId,
        page: CapabilityRepositoryPageRequest,
    ) -> Result<CapabilityRepositoryPage<Loaded<CapabilityAccessReviewFact>>, ApplicationError>;

    /// Creates or updates one access review fact in the supplied transaction.
    async fn save(
        &self,
        review: CapabilityAccessReviewFact,
        expected_version: Option<Version>,
        uow: &dyn CapabilityUnitOfWork,
    ) -> Result<CapabilityAccessReviewFactRef, ApplicationError>;
}
```

review repository 红线:

- `find_current_by_identity` 只能返回 `Recorded`;draft / superseded / invalidated 通过 exact/history read 可见。
- repository 不解释 review 为 governance approval,也不读取 governance system。
- supersede flow 必须在同一 UoW 保存 old / replacement fact 与 change / trace sidecar;exact order Step 11 闭合。

### 8.4 `CapabilityRegistryRepository`

```rust
/// Persists capability registry entry truth with identity uniqueness.
#[async_trait::async_trait]
pub trait CapabilityRegistryRepository: Send + Sync {
    /// Loads one registry entry and its persisted expected version.
    async fn get_with_version(
        &self,
        entry_ref: CapabilityRegistryEntryRef,
    ) -> Result<Option<Loaded<CapabilityRegistryEntry>>, ApplicationError>;

    /// Finds the current registry entry for one capability identity.
    async fn find_current_by_identity(
        &self,
        identity_id: CapabilityIdentityId,
    ) -> Result<Option<Loaded<CapabilityRegistryEntry>>, ApplicationError>;

    /// Lists registry entries by validated application-local truth filters.
    async fn list_matching(
        &self,
        scope: CapabilityRegistryRepositoryListScope,
        page: CapabilityRepositoryPageRequest,
    ) -> Result<CapabilityRepositoryPage<Loaded<CapabilityRegistryEntry>>, ApplicationError>;

    /// Creates or updates registry truth in the supplied transaction.
    async fn save(
        &self,
        entry: CapabilityRegistryEntry,
        expected_version: Option<Version>,
        uow: &dyn CapabilityUnitOfWork,
    ) -> Result<CapabilityRegistryEntryRef, ApplicationError>;
}
```

registry repository 红线:

- current-by-identity uniqueness 由 durable / fake adapter 同样保证;retired entry 仍可 exact/history read,不作为 current。
- `list_matching` 读取 registry truth,不是 directory search projection,不得加入 runtime availability、ranking 或 marketplace filters。
- repository 不补建 descriptor / governance seam / exposure,也不根据 runtime availability 改 lifecycle state。

### 8.5 identity / registry repository 停审记录

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| create / update 是否有 read-save pairing | pass | three repositories all return `Loaded<T>` and accept `Option<Version>` |
| uniqueness lookup 是否正式命名 | pass | identity key、current review by identity、current registry by identity |
| Query read surface 是否完整 | pass | exact get + history + typed identity search / registry list scope;public filters留 Step 8 mapping |
| owner / boundary 是否越界 | pass | 无 governance approval、runtime / marketplace、external body read |

---

## 9. Descriptor / Relation / Exposure truth repository 契约

### 9.1 port capability / 接缝清单

| capability / 对象能力 | 需要的接缝 | 调用方 | 实现方 | 后续承接 |
|---|---|---|---|---|
| descriptor establish / replace / summary attach | descriptor versioned read-save、current-by-entry、summary current lookup | descriptor service | `infra::repositories` | Step 9 descriptor flow |
| governance seam attach / replace / expire | seam versioned read-save、current-by-identity | relation service | `infra::repositories` | Step 9 seam flow |
| method relation attach / remove / stale | method relation versioned read-save、current-by-identity | relation service | `infra::repositories` | Step 9 method flow |
| formal exposure / visibility establish / update | exposure / visibility current lookup + versioned save | exposure service | `infra::repositories` | Step 9 exposure flow;Step 10 matrix |
| descriptor / relation / exposure query | exact / current / paged read | query service | `infra::repositories` | Step 8 read bundles |

### 9.2 `AdapterDescriptorRepository`

```rust
/// Persists adapter descriptor truth with one current descriptor per registry entry.
#[async_trait::async_trait]
pub trait AdapterDescriptorRepository: Send + Sync {
    /// Loads one adapter descriptor and its persisted expected version.
    async fn get_with_version(
        &self,
        descriptor_ref: AdapterDescriptorRef,
    ) -> Result<Option<Loaded<AdapterDescriptor>>, ApplicationError>;

    /// Finds the current descriptor for one registry entry.
    async fn find_current_by_registry_entry(
        &self,
        registry_entry_id: CapabilityRegistryEntryId,
    ) -> Result<Option<Loaded<AdapterDescriptor>>, ApplicationError>;

    /// Lists descriptor history for one registry entry.
    async fn list_by_registry_entry(
        &self,
        registry_entry_id: CapabilityRegistryEntryId,
        page: CapabilityRepositoryPageRequest,
    ) -> Result<CapabilityRepositoryPage<Loaded<AdapterDescriptor>>, ApplicationError>;

    /// Creates or updates adapter descriptor truth in the supplied transaction.
    async fn save(
        &self,
        descriptor: AdapterDescriptor,
        expected_version: Option<Version>,
        uow: &dyn CapabilityUnitOfWork,
    ) -> Result<AdapterDescriptorRef, ApplicationError>;
}
```

### 9.3 `DescriptorSafeSummaryRepository`

```rust
/// Persists descriptor risk and secret-handling safe summaries.
#[async_trait::async_trait]
pub trait DescriptorSafeSummaryRepository: Send + Sync {
    /// Loads one descriptor risk summary with its persisted expected version.
    async fn get_risk_summary_with_version(
        &self,
        summary_id: DescriptorRiskConstraintSummaryId,
    ) -> Result<Option<Loaded<DescriptorRiskConstraintSummary>>, ApplicationError>;

    /// Finds the current non-superseded risk summary for one descriptor.
    async fn find_current_risk_summary(
        &self,
        descriptor_id: AdapterDescriptorId,
    ) -> Result<Option<Loaded<DescriptorRiskConstraintSummary>>, ApplicationError>;

    /// Saves one descriptor risk summary in the supplied transaction.
    async fn save_risk_summary(
        &self,
        summary: DescriptorRiskConstraintSummary,
        expected_version: Option<Version>,
        uow: &dyn CapabilityUnitOfWork,
    ) -> Result<DescriptorRiskConstraintSummaryId, ApplicationError>;

    /// Loads one secret handling safe summary with its persisted expected version.
    async fn get_secret_summary_with_version(
        &self,
        summary_id: SecretHandlingSafeSummaryId,
    ) -> Result<Option<Loaded<SecretHandlingSafeSummary>>, ApplicationError>;

    /// Finds the current safe summary for one secret reference.
    async fn find_current_secret_summary(
        &self,
        secret_ref_id: SecretRefId,
    ) -> Result<Option<Loaded<SecretHandlingSafeSummary>>, ApplicationError>;

    /// Finds the current secret handling safe summary attached through one descriptor.
    async fn find_current_secret_summary_by_descriptor(
        &self,
        descriptor_id: AdapterDescriptorId,
    ) -> Result<Option<Loaded<SecretHandlingSafeSummary>>, ApplicationError>;

    /// Saves one secret handling safe summary in the supplied transaction.
    async fn save_secret_summary(
        &self,
        summary: SecretHandlingSafeSummary,
        expected_version: Option<Version>,
        uow: &dyn CapabilityUnitOfWork,
    ) -> Result<SecretHandlingSafeSummaryId, ApplicationError>;
}
```

summary repository 只保存 Step 6 body-free fields,不得解析 secret ref、读取 secret value 或用 missing summary 表示低风险。`find_current_secret_summary_by_descriptor` 通过 descriptor `secret_ref_id` relation / index定位 current summary,不得扫描 safe-summary text或读取 secret provider。

### 9.4 `GovernanceSeamRepository`

```rust
/// Persists body-free governance seam relation truth.
#[async_trait::async_trait]
pub trait GovernanceSeamRepository: Send + Sync {
    /// Loads one governance seam relation and its persisted expected version.
    async fn get_with_version(
        &self,
        seam_ref: GovernanceSeamRelationRef,
    ) -> Result<Option<Loaded<GovernanceSeamRelation>>, ApplicationError>;

    /// Finds the current non-terminal seam for one capability identity.
    async fn find_current_by_identity(
        &self,
        identity_id: CapabilityIdentityId,
    ) -> Result<Option<Loaded<GovernanceSeamRelation>>, ApplicationError>;

    /// Lists governance seam relation history for one identity.
    async fn list_by_identity(
        &self,
        identity_id: CapabilityIdentityId,
        page: CapabilityRepositoryPageRequest,
    ) -> Result<CapabilityRepositoryPage<Loaded<GovernanceSeamRelation>>, ApplicationError>;

    /// Creates or updates one governance seam relation in the supplied transaction.
    async fn save(
        &self,
        relation: GovernanceSeamRelation,
        expected_version: Option<Version>,
        uow: &dyn CapabilityUnitOfWork,
    ) -> Result<GovernanceSeamRelationRef, ApplicationError>;
}
```

`find_current_by_identity`只可返回`Pending / Active / Unresolved / Expired`,必须排除historical `Replaced`与candidate-terminal `Forbidden`。当前flow实际持久化`Active / Unresolved / Expired`;`Pending`保留给future正式持久化方向。adapter不得用“resolved only”过滤掉current degraded seam,否则attach duplicate guard和replacement会产生第二current relation。

### 9.5 `CapabilityMethodRelationRepository`

```rust
/// Persists body-free capability-method relation truth.
#[async_trait::async_trait]
pub trait CapabilityMethodRelationRepository: Send + Sync {
    /// Loads one capability-method relation and its persisted expected version.
    async fn get_with_version(
        &self,
        relation_ref: CapabilityMethodRelationRef,
    ) -> Result<Option<Loaded<CapabilityMethodBodyFreeRelation>>, ApplicationError>;

    /// Finds the current non-terminal method relation for one identity.
    async fn find_current_by_identity(
        &self,
        identity_id: CapabilityIdentityId,
    ) -> Result<Option<Loaded<CapabilityMethodBodyFreeRelation>>, ApplicationError>;

    /// Lists capability-method relation history for one identity.
    async fn list_by_identity(
        &self,
        identity_id: CapabilityIdentityId,
        page: CapabilityRepositoryPageRequest,
    ) -> Result<CapabilityRepositoryPage<Loaded<CapabilityMethodBodyFreeRelation>>, ApplicationError>;

    /// Lists current and historical relations that reference one method asset.
    async fn list_by_method_asset(
        &self,
        method_asset_ref_id: MethodAssetRefId,
        page: CapabilityRepositoryPageRequest,
    ) -> Result<CapabilityRepositoryPage<Loaded<CapabilityMethodBodyFreeRelation>>, ApplicationError>;

    /// Creates or updates one body-free method relation in the supplied transaction.
    async fn save(
        &self,
        relation: CapabilityMethodBodyFreeRelation,
        expected_version: Option<Version>,
        uow: &dyn CapabilityUnitOfWork,
    ) -> Result<CapabilityMethodRelationRef, ApplicationError>;
}
```

`find_current_by_identity`只可返回`Pending / Active / Stale / Unresolved`,必须排除historical `Removed`与candidate-terminal `Forbidden`。当前flow实际持久化`Active / Unresolved`;`Pending / Stale`保留给future正式持久化方向。adapter不得把Unresolved遗漏为“无current relation”,否则重复attach可绕过唯一current relation门禁。

relation repository 红线:

- current lookup 不读取 governance approval / Policy / shared_rules 或 method asset body / lifecycle。
- removed method relation、forbidden candidate 和 replaced governance seam 仍可 exact/history read,但不得返回为 current active prerequisite。
- identity 与 external ref endpoint uniqueness / current relation uniqueness 在 durable / fake adapter 中保持一致。

### 9.6 `FormalExposureRepository`

```rust
/// Persists formal exposure boundary truth with optimistic concurrency.
#[async_trait::async_trait]
pub trait FormalExposureRepository: Send + Sync {
    /// Loads one formal exposure and its persisted expected version.
    async fn get_with_version(
        &self,
        exposure_ref: FormalExposureBoundaryRef,
    ) -> Result<Option<Loaded<FormalExposureBoundary>>, ApplicationError>;

    /// Finds the current formal exposure for one registry entry.
    async fn find_current_by_registry_entry(
        &self,
        registry_entry_id: CapabilityRegistryEntryId,
    ) -> Result<Option<Loaded<FormalExposureBoundary>>, ApplicationError>;

    /// Lists formal exposure history for one registry entry.
    async fn list_by_registry_entry(
        &self,
        registry_entry_id: CapabilityRegistryEntryId,
        page: CapabilityRepositoryPageRequest,
    ) -> Result<CapabilityRepositoryPage<Loaded<FormalExposureBoundary>>, ApplicationError>;

    /// Creates or updates formal exposure truth in the supplied transaction.
    async fn save(
        &self,
        exposure: FormalExposureBoundary,
        expected_version: Option<Version>,
        uow: &dyn CapabilityUnitOfWork,
    ) -> Result<FormalExposureBoundaryRef, ApplicationError>;
}
```

### 9.7 `FormalVisibilityRepository`

```rust
/// Persists formal visibility applicability facts.
#[async_trait::async_trait]
pub trait FormalVisibilityRepository: Send + Sync {
    /// Loads one visibility fact and its persisted expected version.
    async fn get_with_version(
        &self,
        visibility_id: FormalVisibilityApplicabilityId,
    ) -> Result<Option<Loaded<FormalVisibilityApplicability>>, ApplicationError>;

    /// Finds the current visibility fact for one formal exposure.
    async fn find_current_by_exposure(
        &self,
        exposure_id: FormalExposureBoundaryId,
    ) -> Result<Option<Loaded<FormalVisibilityApplicability>>, ApplicationError>;

    /// Creates or updates one formal visibility fact in the supplied transaction.
    async fn save(
        &self,
        visibility: FormalVisibilityApplicability,
        expected_version: Option<Version>,
        uow: &dyn CapabilityUnitOfWork,
    ) -> Result<FormalVisibilityApplicabilityId, ApplicationError>;
}
```

### 9.8 descriptor / relation / exposure repository 停审记录

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| prerequisite current lookup 是否闭合 | pass | descriptor by entry、seam / method by identity、exposure by entry、visibility by exposure |
| history / exact read 是否闭合 | pass | descriptor / seam / method / exposure 均有 exact + paged owner history |
| safe summary 是否与 truth 分层 | pass | dedicated summary repository;missing / unavailable 不改 descriptor / secret truth |
| forbidden external body 是否可能进入 repository | blocked by contract | repository inputs only Step 6 body-free objects;ref body由后续 resolver port 禁止 |
| expected version / UoW 是否一致 | pass | all mutable objects use `Loaded<T>` + `Option<Version>` + same UoW |

---

## 10. Change / Trace / Impact repository 契约

### 10.1 port capability / 接缝清单

| capability / 对象能力 | 需要的接缝 | 调用方 | 实现方 | 后续承接 |
|---|---|---|---|---|
| append six change record kinds | typed append + exact / subject history read | all command services / trace query | `infra::repositories` | Step 9 generic write;Step 11 append store |
| append trace revision / exact + current read | exact historical load、current revision compare + append、subject / change lookup | trace / impact / handoff service | `infra::repositories` | Step 9 trace flow;Step 11 revision storage |
| save / query impact fact | trace / subject / consumer lookup + optimistic save | impact service / query | `infra::repositories` | Step 9 impact flow |
| accept / dedup downstream summary | source feedback lookup + optimistic save / consumer list | inbound consumer / impact service | `infra::repositories` | Step 9 consumer;Step 13 dedup |

### 10.2 `CapabilityChangeRecordRepository`

```rust
/// Appends and reads immutable capability access change records.
#[async_trait::async_trait]
pub trait CapabilityChangeRecordRepository: Send + Sync {
    /// Appends one capability identity change record.
    async fn append_identity_change(
        &self,
        record: CapabilityIdentityChangeRecord,
        uow: &dyn CapabilityUnitOfWork,
    ) -> Result<CapabilityChangeRecordRef, ApplicationError>;

    /// Appends one capability registry change record.
    async fn append_registry_change(
        &self,
        record: RegistryChangeRecord,
        uow: &dyn CapabilityUnitOfWork,
    ) -> Result<CapabilityChangeRecordRef, ApplicationError>;

    /// Appends one adapter descriptor change record.
    async fn append_descriptor_change(
        &self,
        record: DescriptorChangeRecord,
        uow: &dyn CapabilityUnitOfWork,
    ) -> Result<CapabilityChangeRecordRef, ApplicationError>;

    /// Appends one governance seam relation change record.
    async fn append_governance_seam_change(
        &self,
        record: GovernanceSeamChangeRecord,
        uow: &dyn CapabilityUnitOfWork,
    ) -> Result<CapabilityChangeRecordRef, ApplicationError>;

    /// Appends one capability-method relation change record.
    async fn append_method_relation_change(
        &self,
        record: MethodRelationChangeRecord,
        uow: &dyn CapabilityUnitOfWork,
    ) -> Result<CapabilityChangeRecordRef, ApplicationError>;

    /// Appends one formal exposure or controlled-view change record.
    async fn append_exposure_change(
        &self,
        record: CapabilityExposureChangeRecord,
        uow: &dyn CapabilityUnitOfWork,
    ) -> Result<CapabilityChangeRecordRef, ApplicationError>;

    /// Loads one immutable change record by its typed union reference.
    async fn get(
        &self,
        change_ref: CapabilityChangeRecordRef,
    ) -> Result<Option<CapabilityChangeRecord>, ApplicationError>;

    /// Lists change records for one access truth subject.
    async fn list_by_subject(
        &self,
        subject: CapabilityTraceSubjectRef,
        page: CapabilityRepositoryPageRequest,
    ) -> Result<CapabilityRepositoryPage<CapabilityChangeRecord>, ApplicationError>;
}
```

change repository 只 append,不定义 update / delete。返回 union variant 必须与 requested `CapabilityChangeRecordRef` variant 对称;adapter 不从 table name / payload 内容猜 variant。

### 10.3 `CapabilityTraceabilityRepository`

```rust
/// Appends versioned traceability revisions without overwriting history.
#[async_trait::async_trait]
pub trait CapabilityTraceabilityRepository: Send + Sync {
    /// Loads one exact traceability revision without requiring it to be current.
    async fn get_revision(
        &self,
        trace_ref: CapabilityAccessTraceabilityRecordRef,
    ) -> Result<Option<CapabilityAccessTraceabilityRecord>, ApplicationError>;

    /// Loads the current traceability revision and its persisted expected version.
    async fn get_current_with_version(
        &self,
        trace_ref: CapabilityAccessTraceabilityRecordRef,
    ) -> Result<Option<Loaded<CapabilityAccessTraceabilityRecord>>, ApplicationError>;

    /// Finds the latest traceability record covering one immutable change record.
    async fn find_current_by_change(
        &self,
        change_ref: CapabilityChangeRecordRef,
    ) -> Result<Option<Loaded<CapabilityAccessTraceabilityRecord>>, ApplicationError>;

    /// Lists current and historical traceability revisions for one truth subject.
    async fn list_by_subject(
        &self,
        subject: CapabilityTraceSubjectRef,
        page: CapabilityRepositoryPageRequest,
    ) -> Result<CapabilityRepositoryPage<CapabilityAccessTraceabilityRecord>, ApplicationError>;

    /// Appends the first or next traceability revision in the supplied transaction.
    async fn append_revision(
        &self,
        record: CapabilityAccessTraceabilityRecord,
        expected_previous_version: Option<Version>,
        uow: &dyn CapabilityUnitOfWork,
    ) -> Result<CapabilityAccessTraceabilityRecordRef, ApplicationError>;
}
```

trace revision rules:

- `get_revision`要求ref包含exact version并只返回该id + version的accepted revision;missing exact revision返回`None`,不得回退current、latest或邻近version。它服务historical Query / exact read,不提供下一次save所需expected version。
- `get_current_with_version`只返回最高committed revision及其persisted expected version,供impact / handoff Command的current-state guard与下一revision append;historical ref不得命中。
- first revision uses `None`;next revision uses `Some(loaded.expected_version)` and must have the same record id with next object version。
- adapter preserves every revision and exposes only highest committed version as current;`superseded_by` still points to a distinct replacement record when business supersession occurs。
- concurrent next revisions from one expected version conflict;adapter不得 overwrite / last-write-wins。
- list order is record id + version stable order,not observability trace time guessed from external logs。

Batch `9.6` controlled reopen `CH-DDD-S9-TRACE-EXACT-READ-001`:audit handoff Query与trace-and-scope audit export Query都接受exact historical trace revision,而原repository只有current read。现有trait增加有英文Rustdoc的`get_revision`,不新增trait / Port；Command继续使用`get_current_with_version`,Query不得把historical exact ref升级为current或误报stale。

### 10.4 `CapabilityImpactRepository`

```rust
/// Persists capability change impact facts and body-free downstream summaries.
#[async_trait::async_trait]
pub trait CapabilityImpactRepository: Send + Sync {
    /// Loads one impact fact and its persisted expected version.
    async fn get_impact_with_version(
        &self,
        impact_ref: CapabilityChangeImpactFactRef,
    ) -> Result<Option<Loaded<CapabilityChangeImpactFact>>, ApplicationError>;

    /// Finds the current impact fact derived from one traceability revision.
    async fn find_impact_by_traceability(
        &self,
        trace_ref: CapabilityAccessTraceabilityRecordRef,
    ) -> Result<Option<Loaded<CapabilityChangeImpactFact>>, ApplicationError>;

    /// Lists impact facts affecting one consumer boundary.
    async fn list_impacts_by_consumer(
        &self,
        consumer_ref: CapabilityConsumerRef,
        page: CapabilityRepositoryPageRequest,
    ) -> Result<CapabilityRepositoryPage<Loaded<CapabilityChangeImpactFact>>, ApplicationError>;

    /// Creates or updates one impact fact in the supplied transaction.
    async fn save_impact(
        &self,
        impact: CapabilityChangeImpactFact,
        expected_version: Option<Version>,
        uow: &dyn CapabilityUnitOfWork,
    ) -> Result<CapabilityChangeImpactFactRef, ApplicationError>;

    /// Loads one downstream impact summary and its persisted expected version.
    async fn get_downstream_summary_with_version(
        &self,
        summary_ref: DownstreamConsumptionImpactSummaryRef,
    ) -> Result<Option<Loaded<DownstreamConsumptionImpactSummary>>, ApplicationError>;

    /// Finds a stored summary by its body-free inbound source event reference.
    async fn find_downstream_summary_by_source_feedback(
        &self,
        source_feedback_ref: &CapabilityInboundEventRef,
    ) -> Result<Option<Loaded<DownstreamConsumptionImpactSummary>>, ApplicationError>;

    /// Lists downstream impact summaries by validated impact, consumer, subject, and time filters.
    async fn list_downstream_summaries(
        &self,
        scope: CapabilityDownstreamSummaryRepositoryScope,
        page: CapabilityRepositoryPageRequest,
    ) -> Result<CapabilityRepositoryPage<Loaded<DownstreamConsumptionImpactSummary>>, ApplicationError>;

    /// Creates or updates one downstream safe summary in the supplied transaction.
    async fn save_downstream_summary(
        &self,
        summary: DownstreamConsumptionImpactSummary,
        expected_version: Option<Version>,
        uow: &dyn CapabilityUnitOfWork,
    ) -> Result<DownstreamConsumptionImpactSummaryRef, ApplicationError>;
}
```

impact repository 红线:

- source-feedback lookup 是 consumer dedup 的正式读取面;duplicate 读取 stored receipt / summary,不再次产生 impact mutation。
- impact-to-summary索引由summary的exact `impact_fact_ref`写入维护,并由`list_downstream_summaries`的optional exact impact filter分页读取;不得从impact fact私有列表、summary text或任意第一页推导完整集合。
- consumer list 只按 typed consumer ref,不读取 runtime / tools / SDK execution state。
- downstream unavailable / delayed 只保存 summary / impact state,不得调用 exposure / registry repository mutation。
- `list_downstream_summaries` 通过exact impact link、impact-to-subject / consumer relation与observation-time index收窄;多个present filter按AND组合,不得扫描summary body猜capability subject。

Batch `9.6` controlled reopen `CH-DDD-S9-IMPACT-SUMMARY-PAGE-001`:删除只为无分页single impact view服务的`list_downstream_summary_refs_by_impact`;existing `CapabilityDownstreamSummaryRepositoryScope`和`CapabilityReadScopeRef::DownstreamImpact`增加有英文Rustdoc的`impact_fact_ref`。Port仍为35个,repository trait数量不变,existing `list_downstream_summaries`成为exact-impact、consumer、subject和time组合过滤的唯一完整分页读取面。

### 10.5 change / trace / impact repository 停审记录

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| immutable change append / read 是否对称 | pass | six typed append + union get / subject history |
| trace overwrite 风险 | blocked by contract | append revision + expected previous version + full revision history |
| impact / feedback read-save pairing | pass | exact / trace / consumer / source-feedback lookups + optimistic saves |
| downstream no-rollback | pass | repository surface 无 exposure / registry mutation shortcut |

---

## 11. View / Derived Material / Snapshot repository 契约

### 11.1 port capability / 接缝清单

| capability / 对象能力 | 需要的接缝 | 调用方 | 实现方 | 后续承接 |
|---|---|---|---|---|
| build / refresh controlled view | exact / current audience lookup、affected scan、save | exposure query / maintenance service | `infra::projection_stores` | Step 9 refresh flow |
| directory search / rebuild | registry owner lookup、facet search page、affected scan、save | query / maintenance | `infra::projection_stores` | Step 8 query page;Step 9 rebuild |
| audit export / ecosystem discovery | source-owner lookup、save / list | maintenance / query | `infra::projection_stores` | Step 9 export / discovery |
| reconciliation report | immutable append、get / scope / job run list | reconciliation job / query | `infra::projection_stores` | Step 8 report;Step 11 persistence |
| source truth snapshot | paged committed refs / versions by explicit scope | rebuild / reconciliation / handoff job | `infra::repositories` | Step 9 jobs;Step 11 cursor |

### 11.2 `ControlledConsumerViewRepository`

```rust
/// Persists controlled consumer views and supports affected-view lookup.
#[async_trait::async_trait]
pub trait ControlledConsumerViewRepository: Send + Sync {
    /// Loads one controlled consumer view and its persisted expected version.
    async fn get_with_version(
        &self,
        view_ref: ControlledConsumerViewRef,
    ) -> Result<Option<Loaded<ControlledConsumerView>>, ApplicationError>;

    /// Finds the current view for one exposure and consumer boundary.
    async fn find_current_by_exposure_and_consumer(
        &self,
        exposure_id: FormalExposureBoundaryId,
        consumer_ref: CapabilityConsumerRef,
    ) -> Result<Option<Loaded<ControlledConsumerView>>, ApplicationError>;

    /// Lists controlled views by validated consumer, exposure, and freshness filters.
    async fn list_matching(
        &self,
        scope: CapabilityControlledViewRepositoryListScope,
        page: CapabilityRepositoryPageRequest,
    ) -> Result<CapabilityRepositoryPage<Loaded<ControlledConsumerView>>, ApplicationError>;

    /// Lists views affected by a changed access truth subject.
    async fn list_affected_by_truth(
        &self,
        subject: CapabilityTraceSubjectRef,
        page: CapabilityRepositoryPageRequest,
    ) -> Result<CapabilityRepositoryPage<Loaded<ControlledConsumerView>>, ApplicationError>;

    /// Lists views affected by one changed canonical external-reference subject.
    async fn list_affected_by_reference(
        &self,
        subject: ReferenceSubjectRef,
        page: CapabilityRepositoryPageRequest,
    ) -> Result<CapabilityRepositoryPage<Loaded<ControlledConsumerView>>, ApplicationError>;

    /// Creates or replaces one controlled consumer view in the supplied transaction.
    async fn save(
        &self,
        view: ControlledConsumerView,
        expected_version: Option<Version>,
        uow: &dyn CapabilityUnitOfWork,
    ) -> Result<ControlledConsumerViewRef, ApplicationError>;
}
```

`list_affected_by_truth`与`list_affected_by_reference`必须分别根据stored truth-source / reference-source version marker index返回candidate views,不得全表扫描后让application解析summary body。结果按`consumer_view_id`稳定排序,跨页不得重复或遗漏；返回的是current `Loaded<ControlledConsumerView>`,Command只能从其中取得`expected_version`。reference index只允许返回`source_versions`含matching reference marker的view。`list_matching`是`ListConsumableCapabilitiesForRuntimeTools`的正式分页来源;Query只调用get/find/list,不调用save / mark stale。

### 11.3 `CapabilityDerivedMaterialRepository`

```rust
/// Persists rebuildable directory, audit-export, and ecosystem-discovery materials.
#[async_trait::async_trait]
pub trait CapabilityDerivedMaterialRepository: Send + Sync {
    /// Loads one directory projection and its persisted expected version.
    async fn get_directory_projection_with_version(
        &self,
        projection_ref: DirectorySearchBrowseProjectionRef,
    ) -> Result<Option<Loaded<DirectorySearchBrowseProjection>>, ApplicationError>;

    /// Finds the current directory projection for one registry entry.
    async fn find_directory_projection_by_registry_entry(
        &self,
        registry_entry_id: CapabilityRegistryEntryId,
    ) -> Result<Option<Loaded<DirectorySearchBrowseProjection>>, ApplicationError>;

    /// Searches directory projections by validated body-free text and facets.
    async fn search_directory_projections(
        &self,
        scope: CapabilityDirectoryRepositorySearchScope,
        page: CapabilityRepositoryPageRequest,
    ) -> Result<CapabilityRepositoryPage<Loaded<DirectorySearchBrowseProjection>>, ApplicationError>;

    /// Saves one directory projection in the supplied transaction.
    async fn save_directory_projection(
        &self,
        projection: DirectorySearchBrowseProjection,
        expected_version: Option<Version>,
        uow: &dyn CapabilityUnitOfWork,
    ) -> Result<DirectorySearchBrowseProjectionRef, ApplicationError>;

    /// Loads one audit-friendly export and its persisted expected version.
    async fn get_audit_export_with_version(
        &self,
        export_ref: AuditFriendlyExportSummaryRef,
    ) -> Result<Option<Loaded<AuditFriendlyExportSummary>>, ApplicationError>;

    /// Finds the current audit-friendly export for one traceability revision and scope.
    async fn find_audit_export_by_traceability(
        &self,
        trace_ref: CapabilityAccessTraceabilityRecordRef,
        export_scope: &AuditExportScope,
    ) -> Result<Option<Loaded<AuditFriendlyExportSummary>>, ApplicationError>;

    /// Lists audit-friendly exports for one exact body-free audit scope.
    async fn list_audit_exports_by_scope(
        &self,
        export_scope: &AuditExportScope,
        page: CapabilityRepositoryPageRequest,
    ) -> Result<CapabilityRepositoryPage<Loaded<AuditFriendlyExportSummary>>, ApplicationError>;

    /// Saves one audit-friendly export in the supplied transaction.
    async fn save_audit_export(
        &self,
        export: AuditFriendlyExportSummary,
        expected_version: Option<Version>,
        uow: &dyn CapabilityUnitOfWork,
    ) -> Result<AuditFriendlyExportSummaryRef, ApplicationError>;

    /// Loads one ecosystem discovery summary and its persisted expected version.
    async fn get_ecosystem_discovery_with_version(
        &self,
        discovery_ref: ReadOnlyEcosystemDiscoverySummaryRef,
    ) -> Result<Option<Loaded<ReadOnlyEcosystemDiscoverySummary>>, ApplicationError>;

    /// Finds the current discovery summary for one exposure and ecosystem context.
    async fn find_ecosystem_discovery(
        &self,
        exposure_id: FormalExposureBoundaryId,
        ecosystem_context_ref: &EcosystemContextRef,
    ) -> Result<Option<Loaded<ReadOnlyEcosystemDiscoverySummary>>, ApplicationError>;

    /// Saves one ecosystem discovery summary in the supplied transaction.
    async fn save_ecosystem_discovery(
        &self,
        discovery: ReadOnlyEcosystemDiscoverySummary,
        expected_version: Option<Version>,
        uow: &dyn CapabilityUnitOfWork,
    ) -> Result<ReadOnlyEcosystemDiscoverySummaryRef, ApplicationError>;

    /// Lists body-free derived material refs for stale propagation, rebuild, or reconciliation.
    async fn list_material_refs(
        &self,
        scope: CapabilityDerivedMaterialScanScope,
        page: CapabilityRepositoryPageRequest,
    ) -> Result<CapabilityRepositoryPage<DerivedMaterialRef>, ApplicationError>;
}
```

derived repository 红线:

- `search_directory_projections` 只读 projection;不回退读取 / 创建 registry truth,不加入 marketplace listing / provider runtime filter。
- find-current methods must return explicit stale / unavailable objects;adapter 不用 missing 伪装 degraded state。
- `list_audit_exports_by_scope` 支撑 HLD “export ref 或 audit scope”读取;scope 是 exact safe value equality / indexed lookup,adapter 不解析 raw audit query或外部 target。
- save methods 只写 corresponding material + source markers,不得调用 core truth repository。
- `list_material_refs` 只返回 typed refs,不返回 search index / audit / ecosystem external body。
- `MutableAffectedByTruth(subject)`只返回`DirectoryProjection`、`AuditExport`和`EcosystemDiscovery`三类current mutable material id,明确排除由`ControlledConsumerViewRepository::list_affected_by_truth`独立返回的view以及immutable `ReconciliationReport`。`AffectedByTruth(subject)`继续服务reconciliation / inspection,可以包含report,不得被Command stale propagation误用。
- `MutableAffectedByReference(subject)`只返回source-version marker包含该exact `ReferenceSubjectRef`的三类current mutable material id,并明确排除view和immutable report；view只能由`list_affected_by_reference`返回。adapter不得扫描locator、safe summary或material body猜依赖。
- `MutableAffectedByTruth`结果按`DerivedMaterialRef` kind固定顺序`DirectoryProjection -> AuditExport -> EcosystemDiscovery`,同kind按typed id稳定排序；跨页不得重复或遗漏。application再以`VersionedRef::current(id)`调用对应`get_*_with_version`,不得把scan ref自身当expected version。
- scan命中后exact current load缺失、wrong kind或owner / source-index不对称是consistency / persistence error,不是静默skip。任一该错误使当前Command UoW整体rollback。

### 11.3.1 Core-truth affected-material propagation contract

本节是Step 9 batch `9.1`按`CH-DDD-S9-AFFECTED-MATERIAL-001`回开的application orchestration contract,不是新trait、generic repository或可由entry调用的public service。identity / registry / descriptor / relation / exposure source-owning Command service必须在fresh accepted分支复用同一顺序:

```text
terminal accepted change record + changed CapabilityTraceSubjectRef
  -> page ControlledConsumerViewRepository.list_affected_by_truth(subject)
  -> page CapabilityDerivedMaterialRepository.list_material_refs(
       MutableAffectedByTruth(subject))
  -> process stable kind/id order in the current Command UoW
       controlled view: non-stale -> mark_stale + save(expected_version)
                        -> capture ControlledConsumerViewAvailabilityChanged
       directory:       non-stale -> mark_stale + save(expected_version)
                        -> capture DerivedMaterialRefreshed
       audit export:    non-stale -> mark_stale + save(expected_version)
                        -> capture DerivedMaterialRefreshed
       ecosystem:       non-stale -> mark_stale + save(expected_version)
                        -> capture DerivedMaterialRefreshed
       already stale:   no write / no id / no capture / no effect ref
  -> return exactly the refs whose stale revisions were saved
```

Exact rules:

| Axis | Required behavior |
|---|---|
| selection | 扫描changed subject,不是related identity、consumer、route或event name；multi-change same subject只扫描一次 |
| reason source | 使用terminal accepted change record的`ChangeReason` typed bridges；不得拼字符串或读取adapter error |
| current load | controlled view直接使用affected page中的`Loaded`;另外三类按scan id exact current load |
| optimistic version | 每个save只使用对应`Loaded<T>.expected_version`;不得复用truth expected version、scan cursor或material object version猜值 |
| stale eligibility | any non-stale current material可推进为stale；already-stale严格no-op,不进入effect |
| immutable report | reconciliation report永不进入mutation path、effect stale refs或stale capture |
| capture | 每个实际保存的新material revision在同一Command UoW调用对应Step 8 capture service；capture failure回滚truth、change、trace、全部material、stored result与completion |
| stable result order | `ControlledConsumerView -> DirectoryProjection -> AuditExport -> EcosystemDiscovery`,同kind遵循repository id稳定序 |
| duplicate | completed duplicate只读取stored command result；不scan、不load material、不mark stale、不capture |
| external phase | Command commit前不调用event collaboration；post-commit outbound flow只读official capture / snapshot |

Multi-subject accepted Command additional rules:

| Axis | Required behavior |
|---|---|
| subject order | 按该flow明确的changed-subject canonical order逐subject扫描；descriptor establish / replace固定为descriptor subject在前、registry subject在后。每个subject只扫描一次。 |
| collect before mutation | 扫描阶段只收集controlled-view `Loaded` candidate与三类mutable `DerivedMaterialRef` candidate,不得边扫描第一个subject边mark / capture / save。application不得依赖本UoW material write可被后续subject scan读到。 |
| typed union key | 以`DerivedMaterialRef`的typed variant + typed id为唯一union key；同一material被多个changed subject命中时只保留一次。controlled view映射为`DerivedMaterialRef::ControlledConsumerView(view_id)`后进入同一union。 |
| canonical material order | union后固定按`ControlledConsumerView -> DirectoryProjection -> AuditExport -> EcosystemDiscovery`处理,同kind按typed id稳定排序；不得按subject分组输出重复ref。 |
| exact current load | 每个union material只exact current load一次。controlled view若只命中一次可复用其`Loaded`;多subject返回同id时必须验证candidate revision / owner-index一致后保留唯一`Loaded`,不二次读取。三类derived material始终按union id加载一次。 |
| reason ownership | 每个material使用canonical subject scan中首次命中的terminal accepted change record之typed reason bridge。multi-subject records必须源于同一个caller command reason；不得拼接reason、按错误文本派生reason或为同一material形成多条stale history。 |
| write / capture | 每个eligible material至多mark一次、capture一次、save一次并进入effect一次。already-stale仍严格no-op；immutable report或candidate kind / id / revision / owner-index不对称仍使整个Command rollback。 |

该规则只收紧既有repository返回值的application编排,不新增trait、Port、helper service或隐藏read-your-writes要求。Step 11必须为multi-subject scan依赖的affected index与同一Command UoW快照语义闭口。

Repository page读取可以发生在application已打开的Command UoW期间,但read method不接受或创建隐藏transaction。Step 11必须保证同一Command UoW的truth / material writes与optimistic checks原子提交；任一material并发变化造成整个Command conflict / rollback,不得只提交core truth后补stale。

### 11.3.2 Canonical-reference affected-material propagation contract

`RecordReferenceResolutionState`没有core change record或`CapabilityTraceSubjectRef`,因此不得复用truth scan并伪造change / trace。Fresh accepted actual state transition必须在同一Command UoW按以下顺序执行:

```text
final ReferenceResolutionState revision + exact ReferenceSubjectRef
  -> page ControlledConsumerViewRepository.list_affected_by_reference(subject)
  -> page CapabilityDerivedMaterialRepository.list_material_refs(
       MutableAffectedByReference(subject))
  -> union by DerivedMaterialRef typed variant + id
  -> stable View -> Directory -> AuditExport -> Ecosystem order
  -> each non-stale current revision:
       mark_stale(final state.resolution_reason typed bridge)
       capture exact material availability event
       save with its own Loaded.expected_version
       append actual saved ref to effect once
```

Rules:

- candidate collection completes before any material mutation;duplicate view id must have identical loaded revision / owner-index evidence,otherwise consistency error。
- each material is loaded / marked / captured / saved at most once。Already-stale is a strict no-op with no id、capture or effect ref。
- exact current missing、wrong kind、reference marker absent despite index hit、immutable report returned or expected-version conflict rolls back state + capture + material + result + idempotency completion together。
- reason only comes from final `ReferenceResolutionState.resolution_reason` through Step 6 typed bridges；不得 read resolver response、locator、forbidden body、enum display或adapter error。
- this section adds one method to the existing controlled-view repository and one application-local scan variant。It does not add a trait / Port,reference truth owner,generic relation repair or full-table scan。

### 11.4 `CapabilityReconciliationReportRepository`

```rust
/// Appends and reads immutable capability reconciliation reports.
#[async_trait::async_trait]
pub trait CapabilityReconciliationReportRepository: Send + Sync {
    /// Loads one immutable reconciliation report.
    async fn get(
        &self,
        report_ref: CapabilityReconciliationReportRef,
    ) -> Result<Option<CapabilityReconciliationReport>, ApplicationError>;

    /// Lists reconciliation reports for one declared scope.
    async fn list_by_scope(
        &self,
        scope: &CapabilityReconciliationScope,
        page: CapabilityRepositoryPageRequest,
    ) -> Result<CapabilityRepositoryPage<CapabilityReconciliationReport>, ApplicationError>;

    /// Finds the report produced by one operations job run.
    async fn find_by_job_run(
        &self,
        job_run_id: &JobRunId,
    ) -> Result<Option<CapabilityReconciliationReport>, ApplicationError>;

    /// Appends one immutable reconciliation report in the supplied transaction.
    async fn append(
        &self,
        report: CapabilityReconciliationReport,
        uow: &dyn CapabilityUnitOfWork,
    ) -> Result<CapabilityReconciliationReportRef, ApplicationError>;
}
```

report repository 不定义 update / delete / repair truth。`find_by_job_run`只支撑显式report Query、fresh Job内部一致性检查或运维诊断读取；public Job duplicate replay只能调用`StoredCapabilityResultRepository::get_job_report`,不得用该方法重建typed response。

### 11.5 `CapabilityTruthSnapshotRepository`

```rust
/// Loads paged body-free snapshots of committed capability access truth.
#[async_trait::async_trait]
pub trait CapabilityTruthSnapshotRepository: Send + Sync {
    /// Loads the next committed truth snapshot page for an explicit scope.
    async fn load_snapshot_page(
        &self,
        scope: CapabilityTruthSnapshotScope,
        page: CapabilityRepositoryPageRequest,
    ) -> Result<CapabilityRepositoryPage<CapabilityAccessTruthSnapshot>, ApplicationError>;
}
```

snapshot contract:

- application service must match scope variant before call and verify returned snapshot scope equals requested scope;adapter 不得 silently widen scope。
- items only contain committed `AccessTruthRefSet` + exact source versions;no domain object body、derived body、external body、runtime cache or database row dump。
- cursor represents coverage continuation,not object Version / expected version / business state。
- reconciliation / rebuild reads current objects via their repositories after snapshot refs are fixed;adapter 不返回 mixed-time object graph pretending atomic global snapshot。

### 11.6 view / derived / snapshot repository 停审记录

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| Query full / degraded read surface | pass | exact/current material object including state;adapter 不把 degraded 映射 missing |
| affected projection lookup | pass | controlled view by truth subject + derived material scan scope |
| rebuild source coverage | pass | truth snapshot provides committed refs / exact versions + cursor |
| report immutability | pass | append/get/list/find-by-job;no update / truth repair |
| source version / expected version | pass | material loaded wrapper and snapshot source markers separated |

---

## 12. External Reference / Canonical Resolution repository 契约

### 12.1 port capability / 接缝清单

| capability / 对象能力 | 需要的接缝 | 调用方 | 实现方 | 后续承接 |
|---|---|---|---|---|
| register / replace 8 类 body-free ref | subject / digest lookup、versioned save、kind / scope scan | identity / descriptor / relation / reference services | `infra::reference_stores` | Step 9 ref command / consumer |
| record / refresh canonical state | state exact / current-by-subject、versioned save | reference service / refresh job | `infra::reference_stores` | Step 9 refresh;Step 10 per-kind matrix |
| reference Query | ref + canonical state paired read | query service | `infra::reference_stores` | Step 8 reference views |
| refresh scan | explicit / kind / non-resolved / all reference page | maintenance service | `infra::reference_stores` | Step 8 job;Step 11 persistence |

### 12.2 `CapabilityExternalReferenceRepository`

```rust
/// Persists all body-free external reference objects behind one typed union.
#[async_trait::async_trait]
pub trait CapabilityExternalReferenceRepository: Send + Sync {
    /// Loads one external reference and its persisted expected version.
    async fn get_with_version(
        &self,
        subject: ReferenceSubjectRef,
    ) -> Result<Option<Loaded<CapabilityExternalReference>>, ApplicationError>;

    /// Finds a registered reference by kind and canonical body-free candidate digest.
    async fn find_by_candidate_digest(
        &self,
        kind: ReferenceKind,
        candidate_digest: &ReferenceCandidateDigest,
    ) -> Result<Option<Loaded<CapabilityExternalReference>>, ApplicationError>;

    /// Lists registered references in an explicit refresh scan scope.
    async fn list(
        &self,
        scope: CapabilityReferenceScanScope,
        page: CapabilityRepositoryPageRequest,
    ) -> Result<CapabilityRepositoryPage<Loaded<CapabilityExternalReference>>, ApplicationError>;

    /// Creates or updates one body-free external reference in the supplied transaction.
    async fn save(
        &self,
        reference: CapabilityExternalReference,
        expected_version: Option<Version>,
        uow: &dyn CapabilityUnitOfWork,
    ) -> Result<ReferenceSubjectRef, ApplicationError>;
}
```

reference repository rules:

- union variant、`ReferenceSubjectRef` variant、`ReferenceKind` 和 object id 必须一一对应;adapter mismatch 返回 explicit application error。
- `find_by_candidate_digest` 只做 local duplicate / replacement guard;必须查询Step 6八类reference对象自身持久化的canonical `candidate_digest`,不得由adapter临时重算、扫描locator / safe-summary字段或读取external body。kind + digest在同一reference family内唯一;命中对象的variant / kind / digest必须与请求完全对称。
- `list(NonResolved)` 必须通过 canonical state relation / index 判断,不得解析 per-ref string status,也不得复制第二份 resolution value。
- `save` 只保存 typed fields + `resolution_state_id`;禁止 resolver response、external body、SDK client、runtime payload、secret / method / governance / audit body。

### 12.3 `ReferenceResolutionStateRepository`

```rust
/// Persists the single canonical resolution state for each external reference subject.
#[async_trait::async_trait]
pub trait ReferenceResolutionStateRepository: Send + Sync {
    /// Loads one canonical resolution state and its persisted expected version.
    async fn get_with_version(
        &self,
        state_ref: ReferenceResolutionStateRef,
    ) -> Result<Option<Loaded<ReferenceResolutionState>>, ApplicationError>;

    /// Finds the single current canonical state for one external reference subject.
    async fn find_current_by_subject(
        &self,
        subject: ReferenceSubjectRef,
    ) -> Result<Option<Loaded<ReferenceResolutionState>>, ApplicationError>;

    /// Lists canonical states for references in one explicit scan scope.
    async fn list_by_reference_scope(
        &self,
        scope: CapabilityReferenceScanScope,
        page: CapabilityRepositoryPageRequest,
    ) -> Result<CapabilityRepositoryPage<Loaded<ReferenceResolutionState>>, ApplicationError>;

    /// Creates or updates canonical reference resolution truth in the supplied transaction.
    async fn save(
        &self,
        state: ReferenceResolutionState,
        expected_version: Option<Version>,
        uow: &dyn CapabilityUnitOfWork,
    ) -> Result<ReferenceResolutionStateRef, ApplicationError>;
}
```

canonical state rules:

- one reference subject has exactly one current state id;replacement ref creates a new subject / state,not a second current value for old subject。
- ref object `resolution_state_id` and repository current state id must match before relation / exposure / view use。
- `list_by_reference_scope` returns explicit unresolved / stale / invalid / unavailable / forbidden / expired values,adapter 不映射为 missing / resolved。
- per-kind allowed values / transitions are validated by `ReferenceResolutionPolicy` before save and closed in Step 10,not by adapter conditionals。

### 12.4 reference repository 停审记录

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 8 类 ref 是否统一一个 port union | pass | exact object variant preserved;public typed reads由 Step 8 mapper narrow |
| candidate duplicate lookup | pass | kind + body-free digest;no raw locator / body lookup |
| canonical state uniqueness | pass | current-by-subject + ref state-id parity rule |
| refresh scan / page | pass | explicit scope + opaque cursor;non-resolved uses canonical state |
| duplicate resolution truth | blocked by contract | per-ref object stores id only;state repository is single value owner |

---

## 13. Idempotency / Stored Result / Job Execution repository 契约

### 13.1 reserve helper

```rust
/// Atomic result of reserving an application idempotency key if absent.
pub enum CapabilityIdempotencyReserveResult {
    /// A new reservation and its persisted initial expected version were created.
    Reserved(Loaded<CapabilityIdempotencyRecord>),
    /// An existing reservation was loaded for application-level match evaluation.
    Existing(Loaded<CapabilityIdempotencyRecord>),
}
```

`Existing` 不表示 duplicate success。application 必须调用 Step 6 `matches(...)`:same operation / digest + completed -> replay;matching transient owner -> in-progress / delayed surface;committed Command / Inbound orphan Reserved -> consistency defect;matching Job Reserved -> exact journal resume;different channel / operation / digest orrun -> zero-write conflict。Repository 不替 application 做 business classification。

`Reserved(Loaded<_>)`中的`expected_version`必须是adapter在同一UoW原子insert后分配并接受的initial persisted version。fresh flow执行`record.complete(...)`后只能把该值传给`CapabilityIdempotencyRepository::save`;不得读取`record.version`、假设create version等于`1`或在completion前额外`get_with_version`。若UoW rollback,该loaded reservation及其expected version均不得在后续operation复用。

### 13.2 `CapabilityIdempotencyRepository`

```rust
/// Persists technical idempotency reservations for command, consumer, and job operations.
#[async_trait::async_trait]
pub trait CapabilityIdempotencyRepository: Send + Sync {
    /// Loads one reservation by normalized idempotency key.
    async fn get_with_version(
        &self,
        key: &CapabilityOperationIdempotencyKey,
    ) -> Result<Option<Loaded<CapabilityIdempotencyRecord>>, ApplicationError>;

    /// Atomically creates the reservation when the normalized key is absent.
    async fn reserve_if_absent(
        &self,
        reservation: CapabilityIdempotencyRecord,
        uow: &dyn CapabilityUnitOfWork,
    ) -> Result<CapabilityIdempotencyReserveResult, ApplicationError>;

    /// Updates one existing reservation with optimistic concurrency.
    async fn save(
        &self,
        reservation: CapabilityIdempotencyRecord,
        expected_version: Version,
        uow: &dyn CapabilityUnitOfWork,
    ) -> Result<(), ApplicationError>;
}
```

idempotency repository rules:

- normalized key is the unique repository key;query channel never calls this port。
- `reserve_if_absent` must be atomic in durable / fake adapters and return the exact stored record on collision。
- completed record mismatch does not mutate original reservation;application returns conflict surface。
- `save` only accepts `Reserved -> Completed` validated by object;adapter不接受Conflict row、same-state write、terminal reopen或completed result-ref clear/replace。
- same-key mismatch、atomic reserve loser和different Job run preserve the exact winning record、version、first trace andstored result；conflict telemetry belongsStep 15 andneverusesrepository `save`。

### 13.3 `StoredCapabilityResultRepository`

```rust
/// Persists immutable application result shells and serialized replay surfaces.
#[async_trait::async_trait]
pub trait StoredCapabilityResultRepository: Send + Sync {
    /// Loads the immutable result shell and its exact serialized surface.
    async fn get(
        &self,
        result_ref: &CapabilityApplicationResultRef,
    ) -> Result<Option<(StoredCapabilityOperationResult, CapabilityStoredResultSurface)>, ApplicationError>;

    /// Loads one serialized surface by its opaque local reference.
    async fn get_surface(
        &self,
        surface_ref: &CapabilityStoredResultSurfaceRef,
    ) -> Result<Option<CapabilityStoredResultSurface>, ApplicationError>;

    /// Saves one immutable result shell and matching serialized surface.
    async fn save(
        &self,
        result: StoredCapabilityOperationResult,
        surface: CapabilityStoredResultSurface,
        uow: &dyn CapabilityUnitOfWork,
    ) -> Result<(), ApplicationError>;

    /// Loads one complete typed inbound receipt for exact duplicate replay.
    async fn get_consumer_receipt(
        &self,
        result_ref: &CapabilityApplicationResultRef,
    ) -> Result<Option<CapabilityConsumerReceiptEnvelope>, ApplicationError>;

    /// Saves one complete typed inbound receipt with its matching shell and surface.
    async fn save_consumer_receipt(
        &self,
        result: StoredCapabilityOperationResult,
        surface: CapabilityStoredResultSurface,
        envelope: CapabilityConsumerReceiptEnvelope,
        uow: &dyn CapabilityUnitOfWork,
    ) -> Result<(), ApplicationError>;

    /// Loads one complete variant-bound operations-job response for exact duplicate replay.
    async fn get_job_report(
        &self,
        result_ref: &CapabilityApplicationResultRef,
    ) -> Result<Option<CapabilityStoredJobReportEnvelope>, ApplicationError>;

    /// Saves one complete typed operations-job response with its matching shell and surface.
    async fn save_job_report(
        &self,
        result: StoredCapabilityOperationResult,
        surface: CapabilityStoredResultSurface,
        envelope: CapabilityStoredJobReportEnvelope,
        uow: &dyn CapabilityUnitOfWork,
    ) -> Result<(), ApplicationError>;
}
```

stored result rules:

- result `surface_ref` / `surface_digest` must exactly match surface fields before write;kind / disposition pairing remains Step 6 invariant。
- save is insert-only by `CapabilityApplicationResultRef`;same ref + different digest is conflict,not overwrite。
- get missing / shell-surface mismatch / digest mismatch is explicit invariant or persistence error;duplicate path 不 fallback 重跑 mutation / job / consumer。
- serialized surface is protocol-safe result only;codec / version / size / redaction Step 8 / 14 闭合,repository 不解析业务 fields。
- consumer accepted / delayed / ignored / rejected / unsupported / quarantined path一旦完成幂等reservation,必须用`save_consumer_receipt`原子保存完整typed receipt、shell和surface;不得只调用generic `save`保存placeholder bytes。
- `get_consumer_receipt`只接受`ConsumerReceipt` + `InboundEvent`配对;operation、result ref、surface ref、surface digest和typed receipt result ref任一不对称均返回explicit invariant / persistence error,不得解码generic bytes、补字段或重算current state。
- fresh Job `Completed / PartiallyCompleted / Failed / Retryable`一旦完成幂等reservation,必须用`save_job_report`在同一UoW原子保存`JobReport` shell、serialized surface和完整variant-bound typed response;不得只调用generic `save`或只append reconciliation report。
- `get_job_report`只接受`JobReport` + `OperationsJob(...)`配对。shell disposition必须与stored response的fresh disposition相同;`DuplicateReplayed / Rejected`不得作为stored Job response。union variant、application operation、public job name、schema version、run id、result ref、surface ref、surface digest和typed report result ref任一不对称均返回explicit consistency / persistence error。
- generic `get` / `save`继续服务command result / rejection;consumer与Job duplicate replay必须分别使用typed method。typed envelope与serialized surface必须byte-semantics等价,exact codec / canonicalization留Step 13。
- Job duplicate命中后只把返回给当前caller的response disposition临时映射为`DuplicateReplayed`,保留原job name、schema version、run id、result ref、generic refs、typed detail和issues;stored envelope与shell保持fresh original disposition且不得覆盖。
- typed Job replay failure不得fallback选择decoder、读取`CapabilityReconciliationReportRepository::find_by_job_run`、扫描truth / material / reference / capture或调用resolver / handoff / collaboration;这些行为都等价于重跑Job。

### 13.4 `CapabilityEventCaptureRepository`

```rust
/// Persists recoverable outbound event captures and immutable payload snapshots.
#[async_trait::async_trait]
pub trait CapabilityEventCaptureRepository: Send + Sync {
    /// Loads one current capture together with its immutable complete envelope snapshot.
    async fn get_with_snapshot(
        &self,
        capture_ref: CapabilityEventCaptureRef,
    ) -> Result<Option<LoadedCapabilityEventCapture>, ApplicationError>;

    /// Finds the single capture for one exact source and closed event schema.
    async fn find_by_source_and_schema(
        &self,
        source_ref: &CapabilityEventCaptureSourceRef,
        schema_ref: &CapabilityEventSchemaRef,
    ) -> Result<Option<LoadedCapabilityEventCapture>, ApplicationError>;

    /// Lists captures for an explicit or awaiting-intent recovery scope.
    async fn list(
        &self,
        scope: CapabilityEventCaptureScanScope,
        page: CapabilityRepositoryPageRequest,
    ) -> Result<CapabilityRepositoryPage<LoadedCapabilityEventCapture>, ApplicationError>;

    /// Atomically saves one immutable payload snapshot and its initial capture record.
    async fn capture(
        &self,
        payload_snapshot: CapabilityEventPayloadSnapshot,
        capture: CapabilityEventCaptureRecord,
        uow: &dyn CapabilityUnitOfWork,
    ) -> Result<CapabilityEventCaptureRef, ApplicationError>;

    /// Saves the stable external intent binding with optimistic concurrency.
    async fn bind_intent(
        &self,
        capture: CapabilityEventCaptureRecord,
        expected_version: Version,
        uow: &dyn CapabilityUnitOfWork,
    ) -> Result<CapabilityEventCaptureRef, ApplicationError>;
}
```

event capture repository rules:

- `capture`必须由持有source-write UoW的application service调用,并与六类change record、impact revision、controlled view / derived material / reconciliation report revision或reference-resolution revision进入同一transaction。adapter不得另开transaction,也不得先提交source后补snapshot。
- create input必须是`Captured + collaboration_intent_ref=None + version=1`;record与snapshot的source、snapshot id、schema、digest和captured time必须完全对称,snapshot bytes必须non-empty且其recomputed digest匹配。Trace只存在于snapshot并来自同一完整envelope mapping；不得要求或添加capture trace字段。任一不对称返回explicit consistency error,不得只保存其中一个。
- `(source_ref,schema_ref)`是唯一capture key。same key + different digest / snapshot id是collision;不得overwrite。completed command / consumer / job duplicate通过stored result replay,不会重新创建capture;并发细节留Step 13。
- `get_with_snapshot` / `find_by_source_and_schema` / `list`命中capture但snapshot missing、digest不对称或bytes empty时返回explicit invariant / persistence error,不得返回`None`、不得回查source repository重建。
- `list(AwaitingIntent)`只返回`Captured + intent=None`;稳定顺序为capture id,分页cursor只属于本方法 / scope。`ExplicitCaptures`保持请求去重后的typed order或repository声明的稳定order,exact ordering Step 11闭合。
- `bind_intent`只接受application已执行`capture.bind_intent(...)`后的`IntentBound + Some(intent)`record,expected version只能来自loaded capture。Capture record的source、snapshot id、schema、digest和captured time不可改变；关联immutable snapshot的trace与bytes也不得替换。
- repair Job若处理`EventCapture` target,必须由Job application service直接编排official capture load、stored candidate/existing-intent read、source validation和bind。`Captured + None`取得stable external outcome后,mutated capture的`bind_intent`save与matching execution-journal`Succeeded(EventCollaboration)`save必须进入同一个target UoW；该路径不得调用会自行开启/提交short UoW的`CapabilityEventCollaborationService::collaborate_captured_event`。`IntentBound + Some`只读external `get`并以journal-only target UoW记录success,不得再次bind。
- snapshot是insert-only immutable record;repository不提供update / delete。capture除intent binding外不提供状态写面,external delivery状态继续由`CapabilityAccessEventCollaborationPort`拥有。
- durable / fake实现必须在same-UoW、unique key、missing snapshot、digest mismatch、stale version和stable ordering上完全一致。

### 13.5 `CapabilityJobExecutionRepository`

```rust
/// Persists idempotency-owned operations-job execution journals for exact reserved reentry.
#[async_trait::async_trait]
pub trait CapabilityJobExecutionRepository: Send + Sync {
    /// Loads one execution journal by its normalized idempotency owner key.
    async fn get_with_version(
        &self,
        key: &CapabilityOperationIdempotencyKey,
    ) -> Result<Option<Loaded<CapabilityJobExecutionRecord>>, ApplicationError>;

    /// Atomically inserts one complete planned execution journal in the supplied initial transaction.
    async fn create(
        &self,
        execution: CapabilityJobExecutionRecord,
        uow: &dyn CapabilityUnitOfWork,
    ) -> Result<Loaded<CapabilityJobExecutionRecord>, ApplicationError>;

    /// Saves target-terminal or final execution state with optimistic concurrency.
    async fn save(
        &self,
        execution: CapabilityJobExecutionRecord,
        expected_version: Version,
        uow: &dyn CapabilityUnitOfWork,
    ) -> Result<(), ApplicationError>;
}
```

Job execution repository rules:

- normalized `CapabilityOperationIdempotencyKey` is the sole unique repository key。`JobRunId`、operation name、result ref、target ref andordinal are not alternate lookup keys。
- `create` accepts only `Planned` execution、complete contiguous target plan、all present targets `Planned`、stable duplicate-free initial `run_issues`、`final_result_ref=None` and`finalized_at=None`。A valid complete scan may produce an empty plan with no stable/retryable issue;scope-level planning failure may produce an empty plan only with at least one `StableFailure` or `RetryablePrerequisite` run issue。A stable per-target failure with an established target identity stays in the complete plan as`PreclassifiedFailure`,whose embedded issue target must match the outer target ref;it is not an initial terminal outcome。Each issue ref must already be a typed redacted protocol/policy-mapping result;the adapter must not invent a target、issue、opaque id or impact。It atomically inserts the journal in the same initial UoW as the matching fresh idempotency reservation and returns the adapter-assigned initial `Loaded.expected_version`。
- existing key on `create` is an explicit uniqueness / consistency conflict;adapter must not return the existing record as an upsert result。Collision classification remainsapplication-owned through idempotency reserve + exact journal get。
- `get_with_version` is the only recovery read。`Existing + Reserved` application reentry must require exactly one matching journal and validate key / operation / Job / schema / run / digest symmetry before reading targets。Missing or asymmetric journal is aconsistency failure,not permission to rescan scope or start over。
- `save` accepts only an unchanged plan / ordinal / target identity plus one monotonic transition:exactly one `Planned` target becomesone terminal outcome,one duplicate-free run issue is appended,or an all-terminal execution becomes`Finalized` with an exact result ref。It rejects terminal-outcome overwrite、plan mutation、target reorder、initial or appended issue removal / reorder / impact rewrite andfinalized mutation。
- `expected_version` comes only from the `Loaded<CapabilityJobExecutionRecord>` returned by `create` or the latest exact `get_with_version`。Caller must not use object `version`、target ordinal、idempotency expected version、timestamp orcursor as the token。
- target success `save` participates in the same target UoW as the declared material / report / reference / local binding effect and matching outbound snapshot / capture。A rolled-back target effect cannot leave a success outcome。
- event-collaboration repair target follows the same rule:`Captured -> IntentBound` repository save andits plan-symmetric journal success share one target UoW；already-IntentBound capture andintent-only external status/repair have no local collaboration-state write andcommit onlythe journal success/failure outcome。An external outcome obtained beforea failed local target commit does not byitself terminalize the target;reentry repeats onlythe declared idempotent same-candidate collaborate orsame-intent get/repair operation。
- after a target transaction rollback,application may exact-load the still-`Planned` journal and use a separate no-business-effect UoW to save `Failed` or `Skipped` when the protocol declares a stable terminal issue。It must not claim a failure before rollback completes。
- a `PreclassifiedFailure` target has no attempted business-effect transaction to roll back。Application exact-loads it inordinal order anduses one no-business-effect UoW containing only`record_failed(...)`journal save;adapter rejects any success、plan rewrite、source effect orcapture joined to that transition。
- final `save` participates in the same final-report UoW as `save_job_report` and idempotency `Completed`。The same `CapabilityApplicationResultRef` must appear in journal、stored shell / envelope andidempotency record。
- there is no list、scan、find-by-run、find-by-target、delete、append-target、lease、claim orattempt method。Operational discovery / scheduling is not this repository's responsibility;reentry is always keyed by the caller's normalized idempotency key。
- durable andfake adapters must preserve exact same-UoW visibility、unique key、initial expected version、optimistic conflict、plan immutability、terminal immutability andmissing/asymmetry failures。Fake private maps orprogress fields may not become alternate recovery truth。

### 13.6 idempotency / stored result / event capture / Job execution 停审记录

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| atomic absent-key reserve | pass | dedicated `reserve_if_absent` + durable / fake parity |
| repository vs application classification | pass | repository returns Reserved / Existing;application evaluates digest / state |
| stored shell / surface symmetry | pass after Step 8 reopen | generic command shell / surface保持对称;consumer receipt与Job response分别有typed save/get并校验完整envelope、variant、schema和run identity |
| duplicate replay missing behavior | pass | explicit failure;no current-state recomputation |
| UoW / completion ordering | partial by Step boundary | ports accept same UoW;exact save / complete / commit order Step 11 |
| post-commit / pre-intent event recovery | pass after Step 8 reopen | source + immutable snapshot + Captured record same-UoW;AwaitingIntent scan + intent bind闭合 |
| publisher current-truth rebuild | blocked by contract | collaboration surface只能从`LoadedCapabilityEventCapture`构造;missing snapshot explicit failure |
| post-target / pre-report Job recovery | pass after Step 9 batch 9.11 pre-entry reopen | reservation + complete planning outcome initial UoW、target effect + terminal outcome target UoW、typed report + finalized + completed final UoW |
| reserved reentry source | pass | normalized-key exact `get_with_version` only;no run lookup、scope rescan、current-truth reconstruction orprivate progress table |
| Job journal expected version | pass | initial token from`create`;later token fromlatest exact load;never object version / ordinal / idempotency token |

---

## 14. External Resolver / Handoff / Event Collaboration Port 契约

### 14.1 body-free external outcome helper

```rust
/// Body-free governance reference resolution observation.
pub struct GovernanceResultReferenceObservation {
    /// Canonical body-free resolution observation.
    pub resolution: ReferenceResolutionObservation,
    /// Allowed governance summary without approval or policy body.
    pub allowed_safe_summary: GovernanceSafeSummary,
}

/// Body-free secret handling resolution observation.
pub struct SecretReferenceObservation {
    /// Canonical body-free resolution observation.
    pub resolution: ReferenceResolutionObservation,
    /// Allowed secret handling boundary summary.
    pub handling_boundary: SecretHandlingBoundarySummary,
    /// Exposure marker produced without reading secret material.
    pub exposure_marker: ExposureSafetyMarker,
}

/// Stable external receipt reference for an observability or audit handoff.
pub struct CapabilityHandoffReceiptRef(CapabilityOpaqueId);

/// Final or retryable disposition of one body-free audit handoff attempt.
pub enum CapabilityHandoffDisposition {
    /// The external handoff boundary accepted the body-free refs and summary.
    Accepted,
    /// The external handoff boundary is temporarily unavailable.
    Unavailable,
    /// The handoff was rejected by a stable boundary rule.
    Rejected,
    /// The handoff may be retried without changing source truth.
    Retryable,
}

/// Body-free outcome of one observability or audit handoff attempt.
pub struct CapabilityAuditHandoffOutcome {
    /// Audit reference targeted by the handoff.
    pub audit_ref_id: ObservabilityAuditRefId,
    /// Handoff attempt disposition.
    pub disposition: CapabilityHandoffDisposition,
    /// External body-free receipt reference when accepted.
    pub receipt_ref: Option<CapabilityHandoffReceiptRef>,
    /// Explicit safe reason for non-accepted outcomes.
    pub reason: Option<ChangeReason>,
}
```

outcome invariants:

- accepted requires receipt / no failure reason;unavailable / rejected / retryable require reason / no fake receipt。
- observations carry only Step 6 safe fields;adapter raw response / external status body maps to `ApplicationError` or redacted reason,never enters object。
- external outcome time is not authoritative object time;application uses `ClockPort.now()` when constructing state / record。

### 14.2 `ExternalCapabilitySourceReferencePort`

```rust
/// Resolves body-free MCP, A2A, or API capability source references.
#[async_trait::async_trait]
pub trait ExternalCapabilitySourceReferencePort: Send + Sync {
    /// Resolves one body-free external capability source candidate.
    async fn resolve_source_reference(
        &self,
        subject: ReferenceSubjectRef,
        source_kind: ExternalCapabilitySourceKind,
        locator: ExternalLocatorSummary,
        candidate: ReferenceCandidate,
    ) -> Result<ReferenceResolutionObservation, ApplicationError>;
}
```

该 port 不执行 capability invocation,不返回 MCP tool result、A2A message、API response、provider health / route / quota / cost。它只检查 body-free locator / candidate 并返回 resolution observation。

### 14.3 `GovernanceResultReferencePort`

```rust
/// Resolves governance or policy result references without importing governance truth.
#[async_trait::async_trait]
pub trait GovernanceResultReferencePort: Send + Sync {
    /// Resolves one body-free governance result reference candidate.
    async fn resolve_governance_result_reference(
        &self,
        subject: ReferenceSubjectRef,
        ref_kind: GovernanceRefKind,
        source: GovernanceSourceRef,
        scope: GovernanceResultScopeSummary,
        candidate: ReferenceCandidate,
    ) -> Result<GovernanceResultReferenceObservation, ApplicationError>;
}
```

port 不返回 approval、Policy、shared_rules、vote、workflow 或 governance event body。`allowed_safe_summary` 必须通过 capability-hub forbidden-body scanner / policy。

### 14.4 `MethodAssetReferencePort`

```rust
/// Resolves method-library asset references without importing method body material.
#[async_trait::async_trait]
pub trait MethodAssetReferencePort: Send + Sync {
    /// Resolves one body-free method asset reference candidate.
    async fn resolve_method_asset_reference(
        &self,
        subject: ReferenceSubjectRef,
        asset_kind: MethodAssetKindSummary,
        locator: MethodLibraryLocator,
        candidate: ReferenceCandidate,
    ) -> Result<ReferenceResolutionObservation, ApplicationError>;
}
```

port 不形成 Cargo path dependency,不返回 method content、TaskDefinition、AIPolicyDef、ProcessTemplateDef、version body 或 source code。

### 14.5 `SecretReferencePort`

```rust
/// Resolves externally managed secret references without reading secret material.
#[async_trait::async_trait]
pub trait SecretReferencePort: Send + Sync {
    /// Resolves one body-free secret reference and safe handling boundary.
    async fn resolve_secret_reference(
        &self,
        subject: ReferenceSubjectRef,
        provider_ref: ExternalSecretProviderRef,
        usage_scope: SecretUsageScopeSummary,
        candidate: ReferenceCandidate,
    ) -> Result<SecretReferenceObservation, ApplicationError>;
}
```

port 禁止返回 secret value、ciphertext、token、password、private key、decryption material、rotation state 或 provider access policy。

### 14.6 `ExternalDocumentReferencePort`

```rust
/// Resolves external document references without importing document or schema bodies.
#[async_trait::async_trait]
pub trait ExternalDocumentReferencePort: Send + Sync {
    /// Resolves one body-free external document reference candidate.
    async fn resolve_external_document_reference(
        &self,
        subject: ReferenceSubjectRef,
        document_kind: ExternalDocumentKind,
        locator: ExternalDocumentLocatorSummary,
        candidate: ReferenceCandidate,
    ) -> Result<ReferenceResolutionObservation, ApplicationError>;
}
```

port 不返回 OpenAPI / protocol / schema / guide body;descriptor support review uses typed document ref + canonical state only。

### 14.7 `CapabilityConsumerReferencePort`

```rust
/// Resolves runtime, tools, and SDK consumer boundaries without reading consumer execution state.
#[async_trait::async_trait]
pub trait CapabilityConsumerReferencePort: Send + Sync {
    /// Resolves one runtime or tools consumer boundary candidate.
    async fn resolve_runtime_tools_consumer(
        &self,
        subject: ReferenceSubjectRef,
        consumer_kind: RuntimeToolsConsumerKind,
        locator: RuntimeToolsConsumerLocator,
        scope: CapabilityConsumerScope,
        candidate: ReferenceCandidate,
    ) -> Result<ReferenceResolutionObservation, ApplicationError>;

    /// Resolves one SDK server-consumer boundary candidate.
    async fn resolve_sdk_consumer(
        &self,
        subject: ReferenceSubjectRef,
        locator: SdkConsumerLocator,
        surface: SdkSurfaceSummary,
        scope: SdkExposureScope,
        candidate: ReferenceCandidate,
    ) -> Result<ReferenceResolutionObservation, ApplicationError>;
}
```

consumer port 不读取 invocation / tool result、runtime cache / allowlist、SDK client / binding / package / cache;resolved 只表示 reference boundary 可解析,不表示 execution authorized。

### 14.8 `ObservabilityAuditReferencePort`

```rust
/// Resolves observability or audit references without reading external material bodies.
#[async_trait::async_trait]
pub trait ObservabilityAuditReferencePort: Send + Sync {
    /// Resolves one body-free observability or audit reference candidate.
    async fn resolve_observability_audit_reference(
        &self,
        subject: ReferenceSubjectRef,
        material_kind: AuditMaterialKind,
        locator: AuditMaterialLocatorSummary,
        candidate: ReferenceCandidate,
    ) -> Result<ReferenceResolutionObservation, ApplicationError>;
}
```

该 port 只供reference command / consumer / refresh service检查body-free audit locator与candidate。它不读取或返回raw log、span、trace、metric series、alert、audit event、GRC body、evidence alias或验收签署；也不得复用outbound `ObservabilityAuditHandoffPort`伪装resolver。

### 14.9 `ObservabilityAuditHandoffPort`

```rust
/// Delivers body-free trace and export references to an observability or audit boundary.
#[async_trait::async_trait]
pub trait ObservabilityAuditHandoffPort: Send + Sync {
    /// Hands off one exact traceability revision to one validated audit reference.
    async fn handoff_traceability(
        &self,
        traceability_ref: CapabilityAccessTraceabilityRecordRef,
        audit_ref: ObservabilityAuditRefId,
        handoff_scope: CapabilityAuditHandoffScope,
    ) -> Result<CapabilityAuditHandoffOutcome, ApplicationError>;

    /// Hands off one exact audit-friendly export revision to one audit reference.
    async fn handoff_audit_export(
        &self,
        export_ref: AuditFriendlyExportSummaryRef,
        audit_ref: ObservabilityAuditRefId,
        handoff_scope: CapabilityAuditHandoffScope,
    ) -> Result<CapabilityAuditHandoffOutcome, ApplicationError>;
}
```

handoff contract:

- application 必须先从 `CapabilityTraceabilityRepository` / `CapabilityDerivedMaterialRepository` 加载 exact revision,并通过 `CapabilityExternalReferenceRepository` + `ReferenceResolutionStateRepository` 验证 audit ref;adapter 不得解析 typed ref 后反查本仓 repository。
- port 只接收 exact ref + body-free handoff scope,不接收 trace record body、export body、raw log、span、metric、alert、audit event、acceptance evidence 或 evidence alias。
- `RecordTraceabilityHandoffSummary` 未提供 audit ref 时不得调用本 port;application 只追加 pending / partial trace revision。调用发生时 outcome `audit_ref_id` 必须等于输入 id。
- accepted / unavailable / rejected / retryable 的 object mutation 与 append-revision save 由 application service 执行;adapter 不直接改 trace / export state。
- handoff 是 local commit 之外的 external side effect;失败不回滚 identity、registry、descriptor、relation、exposure、change、trace 或 impact truth。

### 14.10 `CapabilityAccessEventCollaborationPort`

```rust
/// Collaborates body-free capability access event candidates across the external event boundary.
#[async_trait::async_trait]
pub trait CapabilityAccessEventCollaborationPort: Send + Sync {
    /// Forms and attempts delivery of one transient Step 8 outbound event candidate.
    async fn collaborate(
        &self,
        candidate: CapabilityEventCollaborationCandidateSurface,
    ) -> Result<CapabilityEventCollaborationOutcome, ApplicationError>;

    /// Loads one external collaboration item by its stable intent reference.
    async fn get(
        &self,
        intent_ref: &CapabilityEventCollaborationIntentRef,
    ) -> Result<Option<CapabilityEventCollaborationItem>, ApplicationError>;

    /// Lists external collaboration items for repair inspection.
    async fn list(
        &self,
        scope: CapabilityEventCollaborationScanScope,
        page: CapabilityRepositoryPageRequest,
    ) -> Result<CapabilityRepositoryPage<CapabilityEventCollaborationItem>, ApplicationError>;

    /// Retries one failed or unavailable collaboration intent without changing source truth.
    async fn repair(
        &self,
        intent_ref: &CapabilityEventCollaborationIntentRef,
    ) -> Result<CapabilityEventCollaborationOutcome, ApplicationError>;
}
```

collaboration contract:

- `collaborate`的candidate必须由application通过`CapabilityEventCaptureRepository::get_with_snapshot`或`list(AwaitingIntent)`读取,再用`CapabilityEventCollaborationCandidateSurface::try_from_stored_capture`构造。adapter只传递stored complete envelope,不得回查current truth、projection、external source、governance、method、secret、runtime、SDK或audit body重建candidate。
- successful call的outcome `intent_ref`必须稳定且`source`必须等于candidate source;重复同一capture ref / payload snapshot / candidate digest / source的adapter行为必须返回同一stable intent语义。若external intent已建立但local bind前崩溃,重调`collaborate`不得创建第二intent;exact duplicate / collision algorithm留Step 13。
- application取得typed outcome后先校验`outcome.source == loaded.capture.value.source_ref == loaded.payload_snapshot.source_ref`,再在独立短local UoW调用capture object `bind_intent`与`CapabilityEventCaptureRepository::bind_intent`。source mismatch或binding失败不修改source truth或snapshot,原`Captured`record继续可恢复。
- `get` / `list`是已建立external intent的status read surface;local pre-intent recovery只走capture repository。`Repairable`只能返回`PendingDelivery / Failed / HandoffUnavailable`,不得返回`Candidate / Delivered`或从transport error log猜状态。
- `repair` 对 `PendingDelivery` 继续既有intent的投递并进入 `Delivered / Failed / HandoffUnavailable`;对 `Failed / HandoffUnavailable` 先恢复为同一intent的 `PendingDelivery`,再进入投递结果。不得对 `Candidate / Delivered` 形成第二intent,exact state guard 在 Step 10 闭合。
- `ApplicationError` 表示调用无法获得一个可解释 outcome、wiring / serialization / contract failure;可保存的 `Failed / HandoffUnavailable` 必须返回 `CapabilityEventCollaborationOutcome`,不得靠错误字符串、HTTP status、topic 或 adapter private code 分流。
- 该port不定义payload mapping、local snapshot / capture storage、broker relay、topic、consumer group、attempt store、retry count、schedule或bus product。official local durability只来自Step 6 snapshot / capture与§13.4 repository;`infra::publishers`不得再私藏第二queue / payload copy。

Repair Job clarification:

- `CapabilityEventCollaborationService::collaborate_captured_event` remains the exact source-continuation / worker callable andowns its independent short bind UoW。The repair Job service must not call it for a journal target,because that would make the local bind visible beforethe target journal outcome。
- for a planned local capture,the Job service uses the same existing repository / candidate / Port / object calls inline。When the capture was`Captured`,the target UoW contains `CapabilityEventCaptureRepository::bind_intent` and`CapabilityJobExecutionRepository::save` together。When it wasalready`IntentBound`,the service calls external`get`andwrites onlythe journal outcome。
- for a planned external intent,the service calls exact`get`forCandidate/Delivered inspection or`repair`onlyforPendingDelivery/Failed/HandoffUnavailable,validatesitem/outcome intent/source symmetry,andwrites onlythe journal outcome。External state cannot be rolled backorcopied into a local domain object。
- public`CapabilityOutboundEventSourceRef`andapplication`CapabilityEventCaptureSourceRef`areclosed isomorphic unions。Application performs anexhaustive variant-preserving one-way copy atthe protocol boundary;no string/debug/opaque parsing、source repository lookup ornew public helper is introduced。

### 14.11 external port 调用 / 实现关系表

| port | 定义 / 调用方 | infra 实现位置 | callable outcome | 后续承接 |
|---|---|---|---|---|
| `ExternalCapabilitySourceReferencePort` | `application::reference_service` | `infra::source_resolvers` | body-free `ReferenceResolutionObservation` | Step 9 reference flow;Step 10 state;Step 14 binding |
| `GovernanceResultReferencePort` | `application::relation_service` / consumer service | `infra::source_resolvers` | resolution + allowed governance safe summary | Step 8 consumer;Step 9 seam flow |
| `MethodAssetReferencePort` | `application::relation_service` / consumer service | `infra::source_resolvers` | body-free resolution observation | Step 8 consumer;Step 9 method flow |
| `SecretReferencePort` | `application::descriptor_service` | `infra::source_resolvers` | resolution + handling boundary / exposure marker | Step 9 descriptor flow;Step 14 binding |
| `ExternalDocumentReferencePort` | `application::reference_service` / consumer service | `infra::source_resolvers` | body-free resolution observation | Step 8 document protocol;Step 9 refresh |
| `CapabilityConsumerReferencePort` | `application::reference_service` / query support | `infra::source_resolvers` | runtime/tools/SDK body-free resolution | Step 8 consumer ref protocols;Step 9 flow |
| `ObservabilityAuditReferencePort` | `application::reference_service` / consumer service | `infra::source_resolvers` | body-free audit reference resolution observation | Step 8 audit consumer;Step 9 reference flow |
| `ObservabilityAuditHandoffPort` | `application::trace_impact_service` / derived service | `infra::handoff_adapters` | accepted / unavailable / rejected / retryable + receipt ref | Step 9 handoff flow;Step 10 trace / export matrix |
| `CapabilityAccessEventCollaborationPort` | application event-collaboration facade | `infra::publishers` | stored-snapshot candidate -> stable intent + candidate / pending / delivered / failed / unavailable status | Step 8 event DTO / capture;Step 9 collaborate / bind / repair;Step 10 status matrix |

### 14.12 external port 停审记录

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 七类 resolver 是否覆盖 HLD external reference skeleton | pass after Step 8 reopen | source / governance / method / secret / document / runtime-tools-SDK / observability-audit均有exact callable signature |
| audit handoff read / outcome 是否可解释 | pass | exact trace / export ref input + body-free receipt / disposition;不返回 external body / evidence |
| event collaboration status / repair 是否闭合 | pass after Step 8 reopen | local capture repository关闭pre-intent gap;external get / list / repair仍是delivery-state owner |
| adapter error 是否替代 business outcome | blocked by contract | 可保存 unavailable / failed 必须 typed outcome;`ApplicationError` 不供 service 猜状态 |
| Step 6 reopen 是否触发 | yes and closed | batch `8.5`已新增immutable payload snapshot + versioned capture;未新增business truth或复制external delivery state |

---

## 15. Application Service / Entry Callable Boundary Index

Step 7 不定义 Step 8 request / response / event / job DTO 字段,也不展开 Step 9 service method 参数。本节只固定每个 HLD 接口族进入 application 后必须使用的 port group,防止入口模块直接抓 repository 或 adapter。

### 15.1 Command family to port group

| Command family | application service owner | 必需 port group | 明确禁止 |
|---|---|---|---|
| identity intake / correction / retirement / access review | `identity_service` | UoW、clock / id、identity / review / external-ref / resolution repositories、source resolver、change / trace、idempotency / stored result | API 直接解析外部 source body;review 被当 governance approval |
| registry lifecycle / visibility basis | `registry_service` | UoW、clock / id、identity / registry repositories、change / trace、affected-view lookup、idempotency / stored result | reconciliation / search / runtime state 改 registry truth |
| descriptor / risk / secret safe summary | `descriptor_service` | UoW、clock / id、registry / descriptor / summary repositories、external-ref / state repositories、source / secret / document resolver、change / trace、idempotency / stored result | provider runtime、secret value、document body 入仓 |
| governance seam / method relation | `relation_service` | UoW、clock / id、identity / registry / relation repositories、external-ref / state repositories、governance / method resolver、change / trace、idempotency / stored result | approval / Policy / method body 复制入仓 |
| formal exposure / visibility | `exposure_service` | UoW、clock / id、registry / descriptor / relation / exposure / visibility repositories、canonical ref state、change / trace、affected-view lookup、idempotency / stored result | runtime allow-deny、SDK package、consumer view 反写 exposure |
| impact / trace handoff | `trace_impact_service` | UoW、clock / id、change / trace / impact repositories、audit ref / resolution repositories、audit handoff、idempotency / stored result | downstream / audit failure 回滚 source truth |
| reference state / document / consumer ref | `reference_service` | UoW、clock / id、external-ref / canonical-state repositories、matching resolver、change / trace when applicable、idempotency / stored result | per-ref duplicate state、resolver body 或 execution state 入仓 |

### 15.2 Query family to port group

| Query family | application service owner | 只读 port group | no-write gate |
|---|---|---|---|
| identity / review / registry | `query_service` | read-visibility resolver first;identity typed search、review exact/current/history、registry typed list / current | 不开 UoW,不 reserve idempotency,不创建缺失 review / registry |
| descriptor / risk / secret / relation | `query_service` | read-visibility resolver first;descriptor / safe-summary / governance seam / method relation exact/current/history | 不调用external resolver刷新,不读取 secret / governance / method body |
| exposure / controlled consumer / SDK boundary | `query_service` | read-visibility resolver first;exposure / visibility、controlled view exact / consumer page、consumer ref + canonical state | 不刷新 view,不做 runtime authorization,不生成 SDK client state |
| trace / impact / handoff summary | `query_service` | read-visibility resolver first;change / trace / impact / downstream typed-scope list、audit ref / state | 不触发 handoff,不读取 raw observability / execution body |
| directory / export / ecosystem / report | `query_service` | page / subject read-visibility resolver first;derived material typed search / exact/current、immutable report reads | degraded object 必须显式映射,不得 missing fallback 到 core truth rebuild |
| reference state / external refs | `query_service` | read-visibility resolver first;external-ref exact、canonical state exact/current/scope list | 不调用external resolver,不根据 ref string 猜 state |

### 15.3 Consumer / Job / Worker-only collaboration facade

| Entry family | application owner | port group | entry 可见结果边界 |
|---|---|---|---|
| six inbound event consumers | `consumer_service` | idempotency / typed consumer receipt stored result、external-ref / canonical state、matching resolver、impact repository as applicable、UoW | Step 8完整consumer receipt;worker只映射ack / disposition;reference-only consumer不直接改relation / derived material |
| view / directory / export / ecosystem rebuild | `job_service` / `derived_material_service` | truth snapshot、truth / relation reads、projection / material stores、clock / id、UoW、idempotency / Job execution / typed Job stored result | Step 8 typed job response;reserved reentry只处理journal Planned targets;completed duplicate不扫描、不改 core truth |
| registry / derived reconciliation | `job_service` | truth snapshot、material scan、immutable report append、clock / id、UoW、idempotency / Job execution / typed Job stored result | report ref + typed Step 8 job response;reserved reentry用frozen plan,不按run反查report,report不执行 repair |
| external reference refresh | `job_service` / `reference_service` | external-ref / state scan、matching resolver、state save、clock / UoW、idempotency / Job execution / typed Job stored result | per-item typed resolution / failure summary;reserved reentry不重扫scope;duplicate不调用resolver,不创建 core truth |
| event collaboration repair | `job_service` + event-collaboration facade | event-capture get / scan、stored snapshot、external collaboration get / list / collaborate / repair、idempotency / Job execution / typed Job stored result | captured / delivery / handoff typed summary;reserved reentry只用frozen capture / intent targets;duplicate不调用collaboration,失败不回滚 truth |
| outbound event capture / collaboration | source-owning write service + Step 8 `CapabilityOutboundEventCaptureService` + internal application event-collaboration facade | 10个Step 8 pure mapper、event-capture repository、collaboration port | same-UoW capture ref;post-commit `CapabilityEventCollaborationOutcome`;worker loop不拿repository / publisher handle |

event-collaboration facade rule:

- source-owning command / consumer / job service在其local UoW内把final accepted source object交给Step 8 mapper,冻结complete envelope snapshot并调用capture repository;它不得先commit source再临时补snapshot。
- `worker::event_publisher`只把capture ref或typed scan scope交给application facade;10个source-specific mapper / capture callable已由Step 8 §10闭合,post-commit loader / collaborate / bind exact flow由Step 9继续展开。
- facade只加载official capture + snapshot、构造transient candidate、调用external collaboration并绑定stable intent;不得重新加载source object或重跑Step 8 mapper。
- worker不得读取change / trace / impact / derived / reference / capture repository,也不得直接调用`CapabilityAccessEventCollaborationPort`。

---

## 16. Infra Adapter Implementation Contract

### 16.1 adapter implementation matrix

| application port group | infra 文件 | durable / fake 必须保持的语义 | 禁止事项 |
|---|---|---|---|
| UoW manager / marker | `runtime_builder.rs` 注入的 transaction adapter + `fakes.rs` | begin / commit / rollback / resolve_commit、same-UoW identity、stable transaction ref、authority read-after-resolution、no nested transaction | repository 私开事务、replica/status猜测、external side effect 伪装 rollback |
| read visibility resolution | `read_visibility.rs` + `fakes.rs` | resolver-first subject / scope / source marker、not-visible / closed degraded kind、source versions、empty-page resolution parity | 先读body后猜scope、empty page默认visible、从id / cursor / safe-text / error文本 / private enum拼marker |
| identity / registry / descriptor / relation / exposure repositories | `repositories.rs` + `fakes.rs` | exact/current/history、typed filter / stable page、uniqueness、`Loaded.expected_version`、same-UoW save | last-write-wins、adapter policy、runtime / marketplace lookup |
| change / trace / impact repositories | `repositories.rs` + `fakes.rs` | immutable append、trace append-revision、consumer / source-feedback / subject lookup、optimistic save | change/report update/delete、trace overwrite、execution body |
| controlled view / derived material / report stores | `projection_stores.rs` + `fakes.rs` | exact/current/degraded reads、typed search / affected scan、material save、report append | missing 伪装 degraded、projection 反写 truth、marketplace / audit body |
| truth snapshot | `repositories.rs` + `fakes.rs` | explicit scope、committed typed refs、exact source versions、stable cursor | widened scope、mixed body graph、row dump |
| external ref / canonical state stores | `reference_stores.rs` + `fakes.rs` | union symmetry、digest lookup、subject-state uniqueness、typed scan、expected version | per-ref second state、raw locator / body search、string dispatch |
| idempotency / stored result | `idempotency_store.rs` + `fakes.rs` | atomic reserve、exact collision record、immutable shell/surface、typed consumer receipt与variant-bound typed Job response save/get、digest / envelope / job-name / schema / run parity | duplicate rerun、generic bytes receipt/report decode、wrong Job variant、surface mismatch fallback、completed overwrite |
| Job execution journal | `idempotency_store.rs` + `fakes.rs` | normalized-key exact get、same-initial-UoW atomic create、adapter-returned initial expected version、plan / terminal immutability、optimistic per-target / final save、missing / asymmetry failure | list / scan / run lookup、upsert、private progress blob、current-truth reconstruction、scheduler / lease / attempt state |
| seven resolver groups | `source_resolvers.rs` + `fakes.rs` | typed business observation、body-free summary、same unavailable / invalid / forbidden mapping | external / audit body、secret material、governance / method truth、execution result |
| audit handoff | `handoff_adapters.rs` + `fakes.rs` | typed disposition、stable receipt ref、input/output ref parity | raw audit body、fake evidence / acceptance alias、truth mutation |
| event capture repository + external collaboration | `publishers.rs` + `fakes.rs` | same-UoW immutable snapshot / initial capture、exact capture+snapshot load、awaiting-intent scan、optimistic intent bind、stored-snapshot candidate、stable external intent、get/list/repair status parity、typed failure | second hidden queue / payload copy、post-commit source rebuild、capture中复制delivery state、topic/private-code state inference |
| clock / id | `clock_id.rs` + `fakes.rs` | deterministic fake、non-empty collision-safe durable ids、authoritative time | URL / trace / job / source id 拼接;adapter time 替代 application clock |

### 16.2 durable / fake parity gate

| parity axis | mandatory assertion |
|---|---|
| signature / owner | fake 与 durable 只实现 application trait,不得添加 caller 必须知道的 private precondition 或 extra method |
| get / save symmetry | save / append 成功后 exact get 可读取同一 typed ref;fake 不得跳过 union / digest / state-id parity check |
| typed replay parity | consumer与Job typed save/get在fake / durable中执行相同shell、surface、operation、variant、schema、run id与result-ref校验;不得让fake从generic bytes或private enum恢复 |
| version conflict | create `None` / update persisted expected version / stale version conflict 在 fake 与 durable 一致;trace concurrent next revision 必须冲突 |
| uniqueness / atomicity | identity key、current owner relation、reference subject state、idempotency absent-key reserve 在 fake 与 durable 一致 |
| event capture atomicity | source + complete envelope snapshot + initial capture同一local UoW;`(source_ref,schema_ref)`唯一、snapshot immutable、intent bind optimistic version和missing / mismatch failure在fake与durable一致 |
| Job execution atomicity | reservation + complete planning outcome initial UoW、target effect + terminal outcome target UoW、typed response + execution finalization + idempotency completion final UoW；normalized-key uniqueness、initial / later expected version和terminal immutability在fake与durable一致 |
| page / scan | stable order、cursor scope binding、empty page、next cursor、typed filter 在 fake 与 durable 一致 |
| degraded / failure | unavailable / stale / forbidden / failed 不得被 fake 简化为 missing / success；resolver degraded kind必须与durable使用同一typed authority和closed mapping,external typed outcome mapping一致 |
| forbidden body | fake 也必须执行与 durable 相同的 body-free / safe-summary boundary,不得用测试便利绕过 |
| no hidden owner | adapter private state 不能升格为 application / domain / public truth;若需要唯一 persisted carrier,触发 Step 6 reopen |

### 16.3 runtime builder / config boundary

- `infra::runtime_builder` 只组装 concrete adapter 并注入 application service / facade;不得定义第二套 port 或改变 trait signature。
- runtime builder 通过 Step 14 固定的 `async-trait 0.1.89` object-safe `Send` future 注入全部 async Port / repository；当前 `&dyn CapabilityUnitOfWork` 的同步 marker contract保持不变。application trait声明与infra durable / fake adapter impl必须成对使用 `#[async_trait::async_trait]`，不得使用 `?Send`、boxed-generic fallback或弱化 `Send + Sync` / fake parity。
- concrete database、search、transport、bus、endpoint、timeout、credential ref 和 handoff target 绑定留给 Step 14 / `04-配置设计.md`;本 Step 不宣称任何产品已选型或可用。
- startup availability / config validation 若后续需要唯一 public / persisted state,必须按 `CH-DDD-S6-WATCH-001` 回开 Step 6;当前不得在 adapter 私建 canonical availability object。

---

## 17. API / Worker / Jobs Entry Contract

### 17.1 `api`

| 可做 | 必须调用 | 禁止事项 |
|---|---|---|
| route / RPC metadata validation、Command / Query DTO mapping、operation context factory 调用、application result / error 映射 | application command / query service facade | repository、resolver、UoW、domain transition、publisher / handoff adapter direct call |
| public page request / response mapping | application-local page request / page result through query service | 暴露 repository cursor 内部格式、把 query 变成 refresh / rebuild |

### 17.2 `worker`

| 可做 | 必须调用 | 禁止事项 |
|---|---|---|
| inbound envelope / trusted source actor / source event ref 归一化、application receipt 到 ack / quarantine / retry mapping | application consumer service | 直接保存 ref state / relation / impact / stale marker、调用 resolver、UoW 或 repository |
| timer / loop trigger 到 outbound collaboration facade 调用、facade outcome 到 runner state mapping | internal application event-collaboration facade | 直接访问 collaboration port / publisher adapter、私建第二queue / payload copy、绕过official capture、从current truth重建event |
| projection maintenance trigger mapping | application maintenance facade | 直接修改 projection / truth、把 worker local state 升格 canonical state |

### 17.3 `jobs`

| 可做 | 必须调用 | 禁止事项 |
|---|---|---|
| validated job input / operation context mapping、application job result 到 report / exit surface mapping | application job / maintenance service | repository、resolver、publisher、handoff adapter、UoW direct call |
| scheduler / process exit / operator-facing safe diagnostic mapping | Step 8 job result / Step 12 error mapping | repair core truth、从 report 自动执行 mutation、伪造 run_id / test result / evidence / acceptance sign-off |

entry modules 通过 `infra::runtime_builder` 获得 application service handle,但只持有 service / facade abstraction。它们不得借 assembly dependency 获取 concrete store / adapter handle 并绕过 application。

---

## 18. 模块内 Trait / Port / Adapter 停审记录

| 模块 | 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|---|
| `contracts` | 是否误定义 repository / resolver / adapter port | pass | Step 8 只定义 public DTO / view / receipt / event / job surface;不得把 protocol carrier 升格为 persistence helper |
| `domain` | 是否访问 repository / external adapter | pass | 只定义 object / policy / invariant / event candidate formation;Step 9 不得从 domain 反向调用 port |
| `application` | Step 6 object / helper 是否有 repository、resolver、handoff、collaboration、replay、UoW 承接 | pass after Step 9 batch 9.11 pre-entry reopen | consumer完整receipt、8类Job response typed replay及Job execution journal exact recovery均有Port承接;exact service flow留Step 9,但只能使用本文件port family |
| `infra` | adapter owner、durable / fake parity、body-free / version / cursor gate 是否清楚 | pass | concrete product / config binding 留 Step 14;当前无新增 canonical adapter state |
| `api` | 是否只做 sync entry mapping | pass | 继续禁止 query write、repository / resolver / UoW direct access |
| `worker` | consumer / collaboration / projection loop 是否只调用 application facade | pass after Step 8 reopen | collaboration loop只传capture ref / scan scope;不得私建第二queue / payload copy,也不得从current truth重建event |
| `jobs` | maintenance / repair 是否只调用 application service且 no-core-truth-repair | pass after Step 9 batch 9.11 pre-entry reopen | reserved reentry与typed replay均由application处理;entry不访问journal repository、不选decoder、不按run反查report;retry error mapping留Step 12 / 13 |

---

## 19. 跨模块接缝闭环审计

### 19.1 读取面完整性审计

| HLD read / flow need | Step 7 callable surface | 结论 |
|---|---|---|
| single / paged Query visibility resolution | exact subject resolver + 11类page resolver method;resolution携带scope / source marker / versions | pass after Step 8 reopen |
| identity search / registry list | typed identity search scope;typed registry list scope + stable page | pass |
| descriptor / seam / method relation lookup | exact/current/history + method-asset reverse list | pass |
| formal exposure / controlled consumer / SDK view | exposure / visibility exact/current;view exact/current/consumer page;consumer ref + canonical state | pass |
| trace / impact / downstream summary | change / trace subject page;impact exact/trace/consumer;downstream typed consumer/subject/time scope | pass |
| directory search / browse / degraded derived read | typed text/facet projection search;exact/current material object includes state | pass |
| report / reconciliation duplicate lookup | immutable report get / scope / job-run read | pass |
| reference Query / refresh | external ref exact / digest / scan + canonical state exact/current/scan | pass |
| audit handoff / collaboration repair | typed outcome;collaboration get/list/repair | pass |
| interrupted reserved Job | `CapabilityJobExecutionRepository::get_with_version(normalized key)` + frozen target plan / terminal outcomes | pass after Step 9 batch 9.11 pre-entry reopen |

### 19.2 write / dependency / boundary audit

| 审计项 | 结论 | 缺口 / 修正 |
|---|---|---|
| duplicate port | pass | all repository / resolver / handoff / collaboration / technical ports 仅由 application 定义;infra 不复制 trait |
| reverse dependency | pass | contracts/domain 不依赖 application/infra;application 不依赖 infra;entry 不直接依赖 port implementation |
| expected-version source | pass | mutable object save 由 `Loaded.expected_version`;trace next revision由 current loaded version;change/report append-only |
| UoW source | pass | all local writes receive same `&dyn CapabilityUnitOfWork`;Query / external resolver read 不开 write UoW |
| idempotency / stored replay | pass after Step 8 reopen | atomic reserve + immutable stored surface;consumer完整receipt与8类Job response走typed save/get;missing / variant / schema / run mismatch不重跑mutation / scan / resolver / collaboration |
| Job execution journal | pass after Step 9 batch 9.11 pre-entry reopen | exact normalized-key read、atomic create、optimistic save、immutable plan / terminal outcomes；无list / scan / run lookup / private checkpoint |
| canonical reference state | pass | eight ref variants share one state repository;per-ref only stores state id |
| external body / owner leakage | pass | resolver / handoff / collaboration signatures不接收 owner body;secret/governance/method/runtime/SDK/audit body 禁入 |
| runtime / tools execution boundary | pass | consumer port只解析 boundary ref;无 invocation / tool-result / provider route / quota / cost callable surface |
| marketplace boundary | pass | directory/discovery stores只承接 read-only material;无 listing / pricing / transaction port |
| governance approval boundary | pass | governance port只返回 ref resolution + allowed safe summary;无 approval / Policy mutation |
| method-library relation boundary | pass | method resolver + body-free relation repository;无 source/path dependency或 asset body |
| SDK exposure boundary | pass | formal exposure + SDK consumer ref / controlled view读取;无 SDK client / package / cache port |
| page helper public leakage | blocked by contract | repository cursor application-local;Step 8必须映射 public page DTO且不得暴露内部格式 |

### 19.3 Step 6 watchpoint audit

| Watchpoint | Step 7 result | 是否回开 |
|---|---|---|
| `CH-DDD-S6-WATCH-001` non-core stable carrier | infra / api / worker / jobs 只获得 adapter / entry rule;无唯一 public / persisted runtime object | 否 |
| `CH-DDD-S6-WATCH-002` per-kind ref state | one canonical state owner保持不变;exact subset继续交 Step 10 | 否 |
| `CH-DDD-S6-WATCH-003` trace / impact revision persistence | trace append-revision port + impact optimistic save已闭合;schema交 Step 11 | 否 |
| `CH-DDD-S6-WATCH-004` stored result transaction | reserve / shell / surface / UoW port已闭合;exact ordering交 Step 11 / 13 | 否 |
| `CH-DDD-S6-WATCH-005` error taxonomy | trait只使用 stable error type names;variants / retry mapping交 Step 12 | 否 |
| Step 8 Query visibility resolution | Step 6扩展read subject;Step 7补single / page resolver、scope / source resolution和fake parity | 是,已在batch `8.3`开工时闭合 |
| Step 8 typed consumer receipt replay | Step 7补完整receipt envelope与typed save/get;generic bytes不再承担receipt schema恢复 | 是,已在batch `8.4`开工时闭合;未新增business truth |
| Step 8 typed Job response replay | Step 7补8-variant response union、完整Job envelope与typed save/get;generic bytes不再承担Job detail decoder选择 | 是,已在batch `8.7`跨协议审计时闭合;未新增trait或business truth |
| Step 8 observability / audit inbound resolution | Step 7补`ObservabilityAuditReferencePort`;outbound handoff port保持独立 | 是,已在batch `8.4`开工时闭合;未读取audit body |
| event collaboration local durability | Step 6 snapshot / capture + §13.4 repository已关闭pre-intent gap;external delivery status仍由collaboration port拥有 | 是,已在Step 8 batch `8.5`回开闭合;不是业务outbox / relay |
| `CH-DDD-S9-JOB-TX-001` Job execution recovery | Step 6 typed journal + §13.5 exact repository关闭post-target / pre-report gap；reentry按normalized key而非run / scope | 是,已在Step 9 batch `9.11` pre-entry回开闭合;不是execution engine / scheduler |

### 19.4 historical-material pollution audit

| historical material | 当前处理 | 结果 |
|---|---|---|
| old `ProviderContract` repository / gateway | 未继承;descriptor / safe summary / ref / resolver 分层 | pass |
| old `CapabilityDecision` / allow-deny service | 未继承;formal exposure / visibility / controlled view 分层 | pass |
| old `QueryCapabilities` runtime cache query | 未继承;truth / controlled view / directory projection read surface分层 | pass |
| old cost / quota / route / failover / provider health | 无 repository、port、adapter surface | pass |
| old KMS / Vault / secret store | 仅 secret ref + safe summary + no-secret resolver | pass |
| old governance policy refresh / approval | 仅 result ref / safe summary resolver + seam relation | pass |
| old runtime/tools execution gateway | 仅 consumer ref / view / impact collaboration | pass |
| old marketplace listing | 仅 read-only ecosystem discovery;无 listing truth port | pass |
| old concrete outbox relay / retry | 未继承产品、topic、attempt log或retry配置;只新增产品中立的immutable snapshot / versioned capture作为local recovery prerequisite | pass |

---

## 20. 正式文档回填草稿

本节只供 Step 19 装配使用,当前不修改正式 `03-详细设计.md`。

### 20.1 正式 §5 模块实现契约回填

- `contracts`:无 repository / resolver / adapter trait;Step 8 public protocol carrier 不能泄漏 application cursor / loaded / transient surface。
- `domain`:无 infrastructure port;只暴露 Step 6 object / policy / invariant / event-candidate formation能力。
- `application`:repository、resolver、audit handoff、event collaboration、idempotency、stored result、Job execution journal、UoW、clock / id 的唯一 trait owner和直接调用方;Command / Query / Consumer / Job / internal collaboration facade均由这里编排。
- `infra`:1:1 实现 application port;durable / fake 必须保持 signature、version、uniqueness、cursor、typed outcome和body-free parity;不得重做 domain policy。
- `api`:只做同步 protocol / context / result / error mapping并调用 application service。
- `worker`:只做 inbound envelope、ack / disposition、collaboration / projection loop trigger mapping并调用 application facade。
- `jobs`:只做 one-shot job context、report / exit mapping并调用 application job service;禁止 core truth repair。

### 20.2 正式 §6 Trait / Port / Adapter 索引回填

正式全局索引必须逐项列出本文件中的:

- 5 个基础 / read-gate port:`CapabilityUnitOfWork`、`CapabilityUnitOfWorkManager`、`ClockPort`、`IdGeneratorPort`、`CapabilityReadVisibilityResolverPort`。
- 18 个 repository / store port:identity、review、registry、descriptor、safe summary、governance seam、method relation、exposure、visibility、change、trace、impact、controlled view、derived material、reconciliation report、truth snapshot、event capture、Job execution journal。
- 4 个 reference / replay port:external reference、canonical resolution state、idempotency、stored result（其中stored result含consumer receipt与8-variant Job response typed save/get）。
- 9 个 external port:source、governance、method、secret、document、consumer、observability / audit resolver、audit handoff、event collaboration。

当前application-owned Trait / Port总数为36；分类求和必须与代码块中的`pub trait`声明一一对应,不得漏计read-visibility gate / event capture repository / Job execution repository或把typed receipt / Job replay method误算为独立trait。

索引只引用正式 §5 module contract和本 Step callable contract,不得在索引发明新 trait / method。

---

## 21. Step 8 / 9 / 10 / 11 Handoff

| 后续 Step | 必须直接读取的 Step 7 结论 | 不得回头猜测 |
|---|---|---|
| Step 8 protocol | application-local page如何映射 public page;stored result允许的 command / rejection、typed consumer receipt与variant-bound typed Job response surface;10类 outbound event如何从exact source形成完整envelope并冻结snapshot / capture;collaboration / handoff结果的 public view | repository cursor、capture id、event schema ref或serialized bytes不得泄漏为无归属public字段;Job entry不得选择decoder |
| Step 9 function flow | interface family -> service owner -> port group;consumer / Job duplicate typed get;reserved Job reentry exact journal get + Planned-only target processing;core-truth Command按§11.3.1同步标记affected material stale;source + snapshot + capture same-UoW;commit后external collaborate +独立intent bind;handoff / collaboration failure no-rollback | 不得在 flow临时发明 repository / resolver / publisher method、按run反查Job report、按scope重扫或回查current truth重跑mapper / job |
| Step 10 state matrix | trace append-revision、impact save、reference canonical state、event collaboration typed outcome | 不得让 adapter error string决定 state transition |
| Step 11 persistence | expected-version、append-only change/report、trace revision、typed lookup / page / scan、idempotency / stored result / Job execution transaction | 不得用 last-write-wins、current truth replay、private progress table或per-ref second state |
| Step 12 / 13 / 14 / 15 / 16 | error taxonomy、duplicate/collision、config/product binding、observability invocation、contract/fake parity test cuts | 不得在 Step 7声称 concrete product、retry algorithm、test result或evidence已存在 |

Step 8 继续前强制复核:

1. Outbound event必须从exact source在source-owning local UoW内形成完整envelope,并调用`CapabilityEventCaptureRepository::capture`;不得退回post-commit transient-only formation。
2. External collaboration只能从`get_with_snapshot` / `list(AwaitingIntent)`返回的official stored snapshot构造candidate;missing / mismatch必须失败,不得重跑mapper。
3. 若某 public DTO需要新的 stable business / persisted / entry carrier,先判断 Step 6 reopen,不得把 application-local capture helper导出。
4. 若某协议或 flow需要本文件不存在的读取 / 写入 method,先回到 Step 7修正并重新停审。

---

## 22. 待确认事项与 Step 自检

### 22.1 当前 blocker / pending item

| ID | 事项 | 当前判断 | 后续 owner |
|---|---|---|---|
| `CH-DDD-S7-WATCH-001` | event collaboration是否需要本地 durable capture / payload snapshot | 已触发并关闭:transient-only存在不可恢复pre-intent gap;Step 6 / 7已补产品中立snapshot、capture与repository,但external delivery owner不变 | Step 8 mapper/capture;Step 9 / 11 / 13继续闭合调用顺序、transaction和reentry |
| `CH-DDD-S7-WATCH-002` | concrete persistence / search / event transport / endpoint product | 当前未选型且不影响 port callable contract | Step 11 / 14 / `04` |
| `CH-DDD-S7-WATCH-003` | exact error variants / retryability / duplicate algorithm | stable error / outcome type name已足够;不阻塞 | Step 12 / 13 |
| `CH-DDD-S7-QUERY-RESOLUTION-001` | Query resolver-first / empty-page visibility读取面 | Step 8 batch `8.3`开工反查后已补`CapabilityReadVisibilityResolverPort`;不再pending | Step 8 / 9读取修正后契约 |
| `CH-DDD-S7-CONSUMER-REPLAY-001` | Consumer duplicate完整receipt replay读取 / 保存面 | Step 8 batch `8.4`开工反查后已补`CapabilityConsumerReceiptEnvelope`与typed save/get;不再pending | Step 8 / 9 / 11 / 13读取修正后契约 |
| `CH-DDD-S7-JOB-REPLAY-001` | Job duplicate完整typed report replay读取 / 保存面 | Step 8 batch `8.7`跨协议反查后已补`CapabilityStoredJobResponse`、`CapabilityStoredJobReportEnvelope`与typed save/get;不再pending | Step 8 / 9 / 11 / 13读取修正后契约 |
| `CH-DDD-S7-AUDIT-RESOLUTION-001` | Audit changed consumer缺少inbound resolver | Step 8 batch `8.4`开工反查后已补`ObservabilityAuditReferencePort`;outbound handoff Port保持独立;不再pending | Step 8 / 9 / 14读取修正后契约 |
| `CH-DDD-S7-REFERENCE-DIGEST-001` | 统一candidate-digest lookup缺少前四类ref持久化字段 | Step 8 batch `8.4`构造闭环反查后已在Step 6为source / secret / governance / method ref补canonical digest及factory / replace参数;不再pending | Step 8 / 9 / 11读取修正后对象契约 |
| `CH-DDD-S9-AFFECTED-MATERIAL-001` | core truth change缺少可落码的affected-material stale scan / reason / version / capture闭环 | Step 9 batch `9.1`已最小回开§6.1 `MutableAffectedByTruth`与§11.2~§11.3.1；复用既有controlled-view / derived repository和capture service,明确排除immutable report并固定same-UoW atomicity；不新增trait | Step 9各Command flow与Step 11 transaction / index读取修正后契约 |
| `CH-DDD-S9-IDEMPOTENCY-VERSION-001` | fresh reservation completion缺少initial persisted expected version | Step 9 batch `9.1`已将§13.1 fresh结果收紧为`Reserved(Loaded<CapabilityIdempotencyRecord>)`;completion save只使用该loaded value的`expected_version`,不猜create version、不二次读取 | Step 9所有write flow与Step 11 / 13读取修正后契约 |
| `CH-DDD-S9-MULTI-SUBJECT-MATERIAL-001` | descriptor + registry同UoW变化时,逐subject即时stale会重复save / capture并隐含read-your-writes | Step 9 batch `9.2`已回开§11.3.1:canonical subject scan先收candidate,再按typed variant + id union；每个material exact load / mark / capture / save至多一次,reason取首次命中terminal record；不新增trait / Port | Step 9 multi-subject Command与Step 11 affected-index / transaction snapshot读取修正后契约 |
| `CH-DDD-S9-REFERENCE-MATERIAL-001` | canonical reference-state变化没有core change / trace,旧读取面无法exact定位实际依赖该reference marker的mutable material | Step 9 batch `9.3`已回开§6.1、§11.2与§11.3.2:existing repositories按exact `ReferenceSubjectRef`返回controlled view及三类mutable material candidate,collect后typed union,每项只load / mark / capture / save一次；already-stale no-op、immutable report排除,不新增trait / Port | Step 9 reference-state Command与Step 11 reference affected-index / same-UoW读取修正后契约 |
| `CH-DDD-S9-COLLAB-OUTCOME-SOURCE-001` | post-commit collaborate outcome原缺exact source,application无法执行协议要求的bind前source对称校验 | Step 9 batch `9.9`最小回开existing `CapabilityEventCollaborationOutcome`:新增带英文Rustdoc的`source`,factory显式接收source,item / port契约要求candidate / outcome / item source一致；不新增trait / Port | Step 9 Outbound flow、Step 10 collaboration state与Step 13 duplicate/collision读取修正后契约 |
| `CH-DDD-S9-JOB-TX-001` | multi-target Job target commit后、final report前没有durable exact outcome source | Step 9 batch `9.11` pre-entry已新增Step 6 typed execution journal与本Step `CapabilityJobExecutionRepository`;normalized-key exact get、atomic create、optimistic save及no-scan / fake parity闭合 | Step 8 journal-to-response assembly；Step 9 reserved reentry；Step 10 / 11 / 13 state / transaction / concurrency |
| `CH-DDD-S9-COLLAB-REPAIR-TX-001` | source-continuation facade自提交short bind UoW,无法与repair target journal success原子可见 | Step 9 batch `9.12`固定Job application service inline existing capture/candidate/collaboration/object calls；Captured bind与matching journal success同一target UoW,IntentBound / intent-only只提交journal outcome；无新trait / method / Port | Step 8 plan/result symmetry；Step 9 repair flow；Step 11 / 13 external-call-before-local-commit与reentry |
| `CH-DDD-S10-RELATION-CURRENT-INDEX-001` | method current lookup旧说明只返回Active / Pending,遗漏attach flow实际持久化的Unresolved relation；governance / method current index terminal排除也未逐态固定 | existing governance / method `find_current_by_identity`收紧为exact non-terminal subset；Unresolved必须保持current可读,Replaced / Forbidden或Removed / Forbidden必须排除；不新增trait / method / Port | Step 8/9 attach duplicate、replace / remove current parity；Step 10 relation matrix；Step 11 current uniqueness / index |
| `CH-DDD-S12-QUERY-DEGRADED-SOURCE-001` | resolver-level `Degraded`原只携带safe-text reason,无法无文本解析地形成closed public kind / issue ref | Step 6将existing reason private inner收紧为`CapabilityQueryDegradedKind`;本节固定resolver / fake只经typed authority + `from_kind`构造并保持parity。无trait signature、method、Port、field或type新增 | Step 8 public marker / freshness mapping；Step 9 Query flows；Step 12 batch `12.4` |
| `CH-DDD-S13-CORE-IDEMPOTENCY-CANONICAL-001` | normalized Command / Job key的durable encoding及Inbound digest需要core `IdempotencyKey`稳定inner-byte accessor；L0-core正式设计未声明 | 历史诊断保留；2026-07-18用户显式授权Capability Hub采用existing `IdempotencyKey::as_str().as_bytes()`原始UTF-8字节语义，禁止trim / case-fold / normalization / `Display / Debug / serde`替代。项目内阻塞已解除，L0-core正式设计同步为非阻塞债务；签名或字节语义变化必须回开Step 13 | L0-core contracts design debt；Step 13 / Step 14 |

当前application-owned Trait / Port为36个:原32个 + read-visibility resolver + observability/audit inbound resolver + event-capture repository + Job-execution repository。typed consumer receipt与typed Job response仍只扩展既有stored-result repository方法；batch `9.11` pre-entry新增的唯一Port只承接Step 6 typed journal。`CH-DDD-S7-WATCH-001`、`CH-DDD-S9-AFFECTED-MATERIAL-001`、`CH-DDD-S9-REFERENCE-MATERIAL-001`、`CH-DDD-S9-IDEMPOTENCY-VERSION-001`、`CH-DDD-S9-COLLAB-OUTCOME-SOURCE-001`、`CH-DDD-S9-JOB-TX-001`与`CH-DDD-S9-COLLAB-REPAIR-TX-001`均已按强制回开路径闭合；不得把technical capture或Job journal伪装为已选型outbox / relay、execution engine或scheduler产品。

### 22.2 Step 7 完成门禁

| 检查项 | 结论 | 依据 |
|---|---|---|
| 所有跨模块 / 外部接缝有 exact trait / port | pass | §7~§17 |
| Query resolver-first / empty-page read gate | pass after Step 8 reopen | §7.4;single subject + 11类page method + durable / fake parity |
| Query resolver closed degraded source | pass after Step 12 batch `12.4` reopen | §7.4、§16.1~§16.2；8-kind typed authority mapping,无safe-text / raw-error / fake-private推导 |
| Consumer typed receipt replay / audit inbound resolution | pass after Step 8 reopen | §6.2、§13.3、§14.8;完整receipt typed save/get + 独立audit resolver |
| Job typed report replay / variant symmetry | pass after Step 8 reopen | §6.2、§13.3、§15.3;8-variant response union + typed save/get + no-scan/no-resolver/no-collaboration duplicate gate |
| Job reserved reentry / target outcome recovery | pass after Step 9 batch 9.11 pre-entry reopen | Step 6 journal + §13.5 / §15.3;normalized-key exact read、Planned-only processing、target/final same-UoW joins、no run/scope scan |
| Collaboration repair bind / journal atomicity | pass after Step 9 batch 9.12 clarification | §13.4~§14.10;Captured bind + journal success same target UoW,IntentBound / intent-only journal-only,no nested facade UoW |
| Reference candidate digest lookup symmetry | pass after Step 8 reopen | Step 6八类ref均持久化canonical digest;§12.2 lookup无需adapter重算 / locator扫描 |
| Outbound durable capture / pre-intent recovery | pass after Step 8 reopen | Step 6 snapshot / capture;§6.2、§13.4、§14.9、§15.3、§16.1;same-UoW capture + stored-snapshot-only collaboration |
| 每个 trait有 owner、caller、implementer | pass | §4、§14.10、§15~§17 |
| repository读取面覆盖 Step 8 / 9 / 10 / 11 | pass | §8~§13、§19.1 |
| expected version / UoW / append-only闭合 | pass after Step 9 reopen | `Loaded<T>`、same UoW、change/report append、trace append revision；affected material逐项使用自己的loaded expected version |
| canonical reference affected-material闭合 | pass after Step 9 reopen | §11.3.2 exact reference-aware index、typed union、final state reason bridge、own expected version、actual-stale-only capture / effect；无fake change / trace |
| external body / sibling truth / execution边界 | pass | resolver / handoff / collaboration typed body-free contracts |
| durable / fake parity | pass | §16.2 |
| module stop review / cross-seam audit | pass | §18~§19 |
| Step 6 watchpoint audit | pass after documented reopen | §19.3;`CH-DDD-S7-WATCH-001`已触发并关闭,其他watchpoint保持未触发 |
| historical material隔离 | pass | §19.4 |
| formal document未提前修改 | pass | 正式 `03-详细设计.md` 留 Step 19 |
| Step 8 / implementation artifacts未提前创建 | pass | 本 Step仅更新校准产物和台账 |

### 22.3 停审结论

Step 7原评审已完成,并在Step 8 batches `8.5 / 8.7`、Step 9 batches `9.1 / 9.3 / 9.6 / 9.9 / 9.11 / 9.12`、Step 10 batch `10.2`、Step 12 batch `12.4`、Step 13及Step 14 batches `14.2 / 14.5.2.2.3`完成既有受控回开；relation current index保持exact,read-visibility resolver只产生closed degraded reason,idempotency save只允许`Reserved -> Completed`。当前状态为`completed_with_step_14_5_2_2_3_async_trait_binding_reopen`；Port总数仍为36，repository仍为22 traits / 110 methods；33个async trait声明已机械核对为`33/33`固定attribute，不新增trait、method、business truth、execution engine或scheduler state。既有support enum / variants / callable及全部trait method英文Rustdoc保持完整，结构体注释未遗漏。正式`03-详细设计.md`仍未修改；未创建implementation ledger / planned boundary skeleton；未提交commit。原`CH-DDD-S13-CORE-IDEMPOTENCY-CANONICAL-001`已由Step 13精确用户授权依赖假设解除，L0-core正式设计同步保留为非阻塞债务。
