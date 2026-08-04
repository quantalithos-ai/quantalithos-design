# L4-observability 详细设计 Step 06 R06.6-F2 application record / UoW assembly 校准

> 文档状态: `completed_design_only_waiting_user`
>
> 当前正式文档: `projects/L4-observability/03-详细设计.md`
>
> 当前 Step: Step 06 `逐模块定义对象实现契约`
>
> 当前子批次: `R06.6-F2`
>
> 当前门禁: `R06.6-F2_done_waiting_user_before_R06.7`

## 1. 执行边界与恢复点

| 项 | 当前裁定 |
|---|---|
| 上游停审点 | `R06.6-F1-W3_done_waiting_user_before_F2`；用户已明确确认进入 F2 |
| 本批唯一目标 | 闭合 application 层同一 UoW 内 `pre-cursor obligation/seed -> derive cursor namespace -> assign exactly one cursor -> execute cursor-dependent local mutation -> materialize typed records/followers -> append/commit` 的 process-local assembly 对象与失败原子性 |
| 当前写入状态 | `R06.6-F2_done_waiting_user_before_R06.7`；authority、ownership、三阶段 assembly closure、rollback、fake/durable parity 与 affected-definition 已闭合为 design-only，未进入 R06.7 |
| 当前允许写入 | 本专项；被 F2 直接影响的 Step 06 current owner；`03_ddd_step_06_object_contracts.md`、`03_ddd_calibration_flow.md`、`project_execution_ledger.md` |
| 当前禁止写入 | 冻结 Step 07~19、正式 `03-详细设计.md`、任何 `04` 文件、implementation ledger、planned boundary skeleton、任何实现代码 |
| 直接上游一致性 blocker | `R06.6-F2-H13-UPSTREAM=open_controlled`：正式 `02` 把 `DefineReplayScope` 映射为 `ReplayExecutionRecord`，而 current H13 factory 只接受 per-target `ReplayCoordinationTransition`；F2 禁止静默同义化，保持 Command 无 H13 writer，待后续受控回灌正式 `02` |
| 当前内部 blocker | `03-RPR-S06-GRANULARITY=open`；F2 definition owner 已闭合，但 `R06-F-AFFECT-UOW-01=open_controlled_downstream` 仍须在 R06.8 解冻 Step 07/09/11/13/16 后传播 |
| 测试与证据纪律 | 本批只能定义 `planned/not_run` verification；不伪造 commit、run_id、evidence alias、验收签署或测试结果 |
| 是否需要提交 | 不需要；用户未要求提交 |

### 1.1 写入前检查

| 检查项 | F2 当前结论 |
|---|---|
| 用户授权 | 已确认进入 `R06.6-F2`；未授权进入 `R06.7` |
| Step 06 标准 | 已读取 capability -> 对象映射 -> 对象能力到字段/函数/状态 -> 独立对象卡 -> 模块停审要求 |
| current record owner | 已读取 R06.5 H1~H13、typed metadata、same-UoW、append-only 与 affected-definition |
| current post-state owner | 已读取 R06.3/R06.4 current transition / post-state、`SignalRollupWindow::accept_signal` 的 cursor 输入，以及 D 批 H12 accepted item result |
| frozen downstream | Step 07/09/11/16 只作为冲突诊断和 affected-use 输入；本批不修改其内容 |
| historical material | 旧 `record -> cursor` 顺序、假定所有 transition 都在 cursor 前产生、generic history ref mint、consuming save 与 H6 merged save 只作 repair input，不沿用为 current contract |
| 正式正文污染 | `no`；正式 `03` 继续冻结 |

## 2. 输入权威与使用顺序

| 顺序 | 输入 | F2 使用结论 | 权威限制 |
|---:|---|---|---|
| 1 | `project_execution_ledger.md`、`03_ddd_calibration_flow.md`、Step 06 主控 | 恢复点、允许范围、blocker 与停审门禁 | 只由 current pointer 授权写入 |
| 2 | Step 06 SOP、详细设计书写规范、真相源闭环标准 | application helper 也必须有 capability、逐对象字段/函数/来源、失败与后续承接 | 标准不替代本项目 record 语义 |
| 3 | `03_ddd_step_06_contracts_carriers.md` §§12、14、18 | 两个 cursor namespace、13 typed record ref、tagged committed cursor | 不在 application 复制 contracts declaration |
| 4 | `03_ddd_step_06_policy_guard_records.md` §§16、58~73 | metadata、H1~H13 accepted input / post-state / factory / origin / visibility / cursor matrix | concrete record schema 与 factory 仍由 `domain::records` 拥有 |
| 5 | R06.3/R06.4 current object cards | accepted transition 和 same-UoW post-state 的唯一来源 | 不允许 repository reload 或 record 反推 post-state |
| 6 | D-3/D-6 Job item/result cards | H12 fieldwise-compatible accepted result 与 immutable item classification | job plan/claim/report 不进入 record metadata |
| 7 | E 批 service/error owner | application façade调用边界和 typed error 汇聚 | F2 不新增 façade、error enum 或 repository trait |
| 8 | 冻结 Step 07/09/11/16 | 发现 generic mint、record-before-cursor、consuming save、H6 merged save 与缺失 H12 append | 只登记 affected definition，不能原位修改或宣称已修复 |
| 9 | L1-governance、L1-artifact相似 UoW / record 设计 | 对象卡、顺序、原子性与 fake/durable parity 的写作粒度 | 不复制相邻域 truth、record family 或 port 名称 |

## 3. F2 分段状态

| 分段 | 覆盖范围 | 状态 | 完成条件 |
|---|---|---|---|
| F2-1 | capability、边界、冲突诊断、13-family inventory | `done_in_current_draft` | H1~H13 factory allowlist与current operation writer分层，H7无writer，H13冲突已登记 |
| F2-2 | metadata seed、obligation、primary/follower plan、append item/batch 与 commit-class 对象卡 | `done_design_only` | 每个对象有 schema、字段来源、factory/member、失败与禁止事项 |
| F2-3 | owner 修正、UoW 顺序、rollback、fake/durable parity、affected register | `done_design_only` | H6/H10/H11/H12/cursor ownership闭合，下游变更逐项命名 |
| F2-4 | 主控/flow/ledger同步与停审 | `done_design_only` | current pointer切到`R06.6-F2_done_waiting_user_before_R06.7` |

本文件已在同一获准子批次内补全。完成仅表示 F2 design definition 闭合；不表示冻结下游已修复、测试已运行、Step 06 已完成或正式 `03` 已重新装配。

## 4. authority、冲突诊断与 current 裁定

### 4.1 layer owner

| concern | canonical owner | F2 responsibility | F2 explicitly does not own |
|---|---|---|---|
| record schema / factory / validated rehydrate | `domain::records` H1~H13 | borrow exact accepted input/post-state, bind metadata, invoke factory | record field inference, persistence schema, policy rerun |
| record ref schema | `contracts::refs` | reserve exact typed ref before accepted transition | generic history ref, ref derivation from cursor/time/digest |
| cursor values / namespace tag | `contracts::refs` | derive one required namespace and exact-copy one assigned value into all metadata | allocator, database sequence, cross-namespace ordering |
| process-local assembly | `application::unit_of_work` | request, write footprint, commit class, append item and batch | durable truth, repository trait, transaction implementation |
| accepted truth/state | owning `domain::*` module | retain a borrow until every mandatory factory succeeds | aggregate clone, row reload, record-to-state reconstruction |
| append / save / cursor allocation | Step 07 port and infra adapter | publish exact semantic handoff and affected definition | define or modify frozen traits in F2 |
| UoW ordering / persistence atomicity | Step 09/11 after affected review | freeze required ordering and rollback matrix | claim frozen downstream is already repaired |

F2 does not create an `application::records` persistence owner. The planned physical file remains Step 04's `crates/application/src/unit_of_work.rs`; whether R06.8 later extracts a private submodule is a file-layout review, not a second object owner. Concrete H records remain in logical `domain::records`, even though historical Step 04 currently names `domain/history.rs`.

### 4.2 historical conflicts

| historical / frozen shape | current defect | F2 ruling |
|---|---|---|
| `stage record -> assign cursor` | every current H factory requires committed cursor in metadata | stage borrowed post-state/request first; assign cursor; only then construct and append record |
| `new_history_record_ref() -> BodyFreeRef` | loses exact PK type and permits wrong-family identity | replace in downstream affected review with 12 current typed mint methods; H7 has no current mint method |
| save methods consume aggregate before record factory | unique same-UoW post-state is unavailable without cloning/reload | current writer save/stage accepts `&T` or returns an exact borrowed/staged snapshot; aggregate `Clone` is not required |
| `save_no_write_violation(violation, record, ...)` | violation stage and cursor-bound append cannot obey required order independently | split versioned violation stage from `append_no_write_violation_record` |
| H10 always requires Observation cursor | reference-only refresh contract assigns Reference cursor | H10 accepts the one batch cursor: Reference for reference-only, Observation for mixed observation-owned UoW |
| H12 consumes `GapScanPostState` by value | item/report assembly still needs the same post-result values after record construction | H12 factory borrows `&GapScanPostState` |
| all accepted transitions exist before cursor allocation | `SignalRollupWindow::accept_signal(..., ObservationCursor)` can only create H11 `SignalAccepted` after the one UoW cursor exists | pre-cursor stores an exact obligation and mutable-window borrow; post-cursor executes the member and immediately assembles H11 without returning a self-referential borrowed request |
| protocol outbox snapshot can be built before cursor | protocol envelope and exact serialized bytes contain `ObservationCommittedCursor` | pre-cursor stores typed outbound payload material only; post-cursor builds/encodes the protocol snapshot and then the application outbox pair |
| allocate both cursor namespaces for mixed work | creates two apparent transaction orders and violates PCI-OBS-021 | a mixed UoW is one Observation-class commit; assigning Reference as well is rejected |
| clone or re-read staged aggregate | can observe a different state and makes fake/durable behavior diverge | only small immutable value carriers may use declared value-copy semantics; truth/state aggregates are borrowed, never cloned or reloaded for history |

### 4.3 domain factory allowlist versus current operation writer registry

`ObservationRecordOrigin` is a coarse, persisted lane. It answers which boundary accepted a record, but it neither authorizes an operation nor identifies the concrete operation. F2 therefore keeps two separate registries:

1. **domain factory allowlist**: the set of origins a concrete H factory/accepted-input branch may accept;
2. **current operation writer registry**: the current `ObservationOperationName` or named resident-worker branch that can actually produce that accepted input.

The second registry must be a subset of the first. An origin being present in the factory allowlist never enables every operation in that lane.

| H family | corrected domain factory allowlist | current concrete writer registry / branch restriction | explicit exclusion |
|---|---|---|---|
| H1 | Command / InboundConsumer | `SubmitObservationMaterial`;`RecordSafetyDisposition`;`ConsumeBusObservationMaterial`;sandbox consumer only for an accepted safety branch | Query and unrelated consumers/jobs |
| H2 | Command / InboundConsumer | `BindCorrelationContext`;`RecordSafeSignal`;runtime/sandbox consumer only when a canonical H2 transition exists | safe-signal input marker without correlation effect |
| H3 | Command / InboundConsumer / OperationsJob | `AppendAuditProjection`;`LinkBodyFreeEvidence`;`ConsumeSourceAuditMaterial`;artifact/governance consumer only on an accepted H3 linkage/projection branch; any Job branch must be named by Step 09 before use | resident worker and generic maintenance job |
| H4 | **Command / InboundConsumer / OperationsJob** | `PrepareReportHandoff`;`EvaluateAuthenticityHint`;`ConsumeArchiveHandoffFeedback`;`PrepareReportHandoffDelivery` | archive feedback marker with no H4 transition |
| H5 | Command / OperationsJob | `SetRetentionMarker`;`ProtectActiveReference`;a named Job branch only when it accepts an H5 marker/protection transition | replay coordination alone |
| H6 | Command / InboundConsumer / ResidentWorker / OperationsJob | `RecordNoWriteViolation`;other lanes only for an explicit existing-violation block/escalate/close transition | P10 Blocked decision and initial Detected creation |
| H7 | AsynchronousReadAudit only | **none in current phase** | all 14 Query operations; no ID, request, UoW, cursor, append or outbox |
| H8 | Command / InboundConsumer / ResidentWorker / OperationsJob | `RecordGapState`;`ConsumeReportConsumerFeedback`;gap-scan and named derived branches only per accepted P12/H8 transition | H12 discovered ref without independent H8 mutation |
| H9 | **Command / InboundConsumer / OperationsJob** | `PrepareExternalAuditExport`;`ConsumeReportConsumerFeedback`;`PrepareExternalAuditExportDelivery`;named peripheral rebuild branch only with H9 transition | consumer feedback that only opens H8 gap |
| H10 | **Command / InboundConsumer / OperationsJob** | `RegisterReferenceSnapshot`;`UpdateReferenceSnapshotState`;identity/governance/artifact/runtime context consumers only on accepted snapshot branch;`RefreshReferenceSnapshots` | PreserveCurrent, unresolved input with no accepted snapshot mutation |
| H11 | **Command / InboundConsumer / ResidentWorker / OperationsJob**, narrowed by subject branch | `SignalRollupAccepted`: `RecordSafeSignal` or runtime/sandbox consumer; projection/diagnostic stale branch: named resident worker or maintenance operation; rollup/rebuild branch: `RebuildSignalRollups`; read-model/peripheral maintenance branch: corresponding Job | synchronous Query; generic origin without a matching accepted-input variant |
| H12 | OperationsJob | `ScanObservationGaps` accepted item only | plan/start/claim/report-only UoW and H8-only mutation |
| H13 | OperationsJob | `CoordinateObservationReplay` per-target accepted coordination transition only | **`DefineReplayScope` Command is not an H13 writer under current factory** |

For H11, the factory performs the branch-specific check, not merely `origin in {Command, InboundConsumer, ResidentWorker, OperationsJob}`. In particular, Command/InboundConsumer are allowed only for `SignalRollupAccepted` or another explicitly mapped accepted-input branch; they cannot emit projection rebuild completion records. `ResidentWorker` is not part of the 48 public operation catalog and must be named in R06.7 as an internal worker branch before implementation; absence of that later mapping disables the lane rather than defaulting to it.

### 4.4 H13 direct-upstream consistency blocker

| source | current statement | conflict with H13 | F2 treatment |
|---|---|---|---|
| formal `02-概要设计.md` §7.2 | `DefineReplayScope -> ReplayExecutionRecord` | H13 requires an existing Approved `ReplayScope`, exact `ReplayCoordinationState`, target and `ReplayCoordinationTransition`; scope definition has none of those | register `R06.6-F2-H13-UPSTREAM`; do not mint H13 ref or invoke F2 assembler for scope-only accepted UoW |
| formal `02-概要设计.md` Job catalog | `CoordinateObservationReplay -> ReplayExecutionRecord` | matches per-target H13 | retain as current H13 writer |
| early R06.5 mapping | `ReplayScopeTransition -> H13` for approval/close | contradicts final H13 §§72.1~72.5 accepted input | classify as historical/affected statement; final H13 card wins inside Step 06 |

F2 cannot decide whether replay-scope lifecycle needs a future separate append-only family or should remain `explicit_no_record`; that changes the completed HLD object/record pool. Until the direct-upstream correction is explicitly performed, the conservative executable rule is: `DefineReplayScope` may commit its observation-owned scope mutation and mandatory non-record followers, but it must not create `ReplayExecutionRecord`. If no other current H-family transition exists, it does not call the F2 record assembler.

### 4.5 record-bearing UoW applicability

This batch applies only after an accepted local mutation/result has at least one mandatory current H-family record. It is not a generic transaction wrapper.

| flow kind | F2 assembler allowed | reason |
|---|---|---|
| current accepted H1~H6/H8~H13 branch | required | accepted branch has a mandatory typed append-only record |
| H7 synchronous Query | forbidden | current phase has no writer, ID, UoW, cursor, record, outbox or stored mutation |
| explicit-no-record / phase-reserved transition | forbidden unless another accepted branch in the same UoW independently requires a current record | record absence is part of the total mapping; assembler cannot invent history |
| duplicate replay / idempotency conflict / in-flight | forbidden | no mutation body and no new successful record |
| publisher marker-only UoW | outside F2 | publication lifecycle and stable token rules are owned by B/C and later flow review |
| Job start/claim/finalize with no H-family accepted branch | outside F2 | plan/report/claim lifecycle does not become domain history merely by using a UoW |

An accepted observation-owned mutation that is `explicit_no_record` may coexist with H10 in one transaction. It must still enter the write footprint as `ObservationOwnedMutation`; therefore commit class is derived from both primary write families and record families, not from H10 alone.

## 5. application capability and functional boundary

### 5.1 capability list

| capability | exact input | output | process-local state / side effect | downstream handoff |
|---|---|---|---|---|
| reserve record material | accepted operation context, exact obligation cardinality, ID generator, ClockPort | typed record refs and no-cursor metadata seeds | unused refs/time may be discarded on rejection; no durable write | Step 07 typed ID methods |
| retain pre-cursor obligation | cursor-independent accepted transition/proof/result or the exact input needed for a cursor-dependent member | bounded typed obligation set | no record construction, serialization or persistence | owning service lifetime |
| classify primary footprint | actual accepted primary mutation family, independent of records/followers | derived `ObservationCommitClass` | pure finite classification | UoW cursor assignment validation |
| assign one cursor | derived commit class and staged UoW | one tagged `ObservationCommittedCursor` | allocator called exactly once; rollback may leave invisible gap | Step 07 UoW trait/adapter |
| execute cursor-dependent primary | exact `SignalRollupAcceptSeed` plus Observation cursor | accepted H11 transition and same borrowed post-window | mutates only the loaded window inside the UoW; duplicate yields no obligation fulfillment | domain owner + versioned save |
| bind metadata | no-cursor typed seed and exact assigned cursor | `ObservationRecordMetadata<R>` | consumes one seed; exact-copy cursor value only | H1~H13 factory |
| materialize records | each obligation and exact post-state after all required local mutation | owned concrete H record | domain validation only; no repository append inside factory | append item |
| validate batch | derived class, assigned cursor and all concrete items | nonempty `ObservationRecordAppendBatch` | validates family/count/cursor equality | Step 07 concrete append methods |
| append mandatory records | batch items and same UoW | all rows staged or error | durable side effect only through downstream port | Step 07/11 |
| materialize followers | typed membership/outbox/stale/result/idempotency/item/report seeds and exact cursor | `ObservationCursorFollowerMaterial` set | no current-truth reload, config reread or hidden external call | family-specific Step 07 ports |
| preserve rollback atomicity | any factory/append/follower/CAS/commit failure | no visible mutation or record | rollback whole UoW; allocated cursor not reused | Step 09/11/16 |

### 5.2 function-to-object mapping

| object | object category | capabilities | does not undertake |
|---|---|---|---|
| `ObservationRecordMetadataSeed<R>` | typed process-local value | retain exact record ref/origin/actor/time/trace/causation/visibility without cursor; bind once | cursor allocation, visibility authorization, record factory validation |
| 12 `*RecordAssemblyRequest<'a>` | borrowed application helper | materialize each H factory's exact accepted input and same-UoW post-state after cursor availability | durable storage, generic transition serialization, aggregate ownership |
| `ObservationRecordAssemblyRequest<'a>` | post-cursor process-local tagged union | heterogeneous factory dispatch and family inspection | persisted union row, H7, unknown/other family |
| `ObservationRecordObligation<'a>` | pre-cursor process-local tagged union | retain complete cursor-independent request or explicit cursor-dependent H11 seed | record append, cursor allocation, self-referential transition borrow |
| `ObservationRecordWriteFamily` | finite classifier | current 12 writer identities and static cursor influence | public protocol token, persisted discriminator, H7 future activation |
| `ObservationPrimaryWriteFamily` | finite primary classifier | distinguish observation-owned and reference-snapshot primary mutation only | record/follower family, caller-selected class, repository proof |
| `SignalRollupAcceptSeed<'a>` | cursor-dependent primary seed | retain loaded mutable rollup, committed signal/context and H11 metadata seed until Observation cursor exists | closure/trait object, spawned future, record or persistence row |
| `ObservationCursorFollowerPlan` | pre-cursor process-local plan | hold exact membership/outbox/stale and same-UoW non-cursor follower seeds | primary truth, record family, arbitrary callback or bare boolean |
| `ObservationRecordAssemblyPlan<'a>` | two-phase process-local plan | validate obligation/primary/follower totality, derive class, own pre-cursor seeds | append rows, own aggregate, survive UoW |
| `ObservationCommitClass` | derived finite value | choose exactly Observation or Reference assignment | cross-namespace total order, caller constructor |
| `ObservationRecordAppendItem` | owned process-local dispatch union | hold one of 12 concrete records after factory success | generic persistence schema, update/delete/retry |
| `ObservationRecordAppendBatch` | nonempty process-local batch | prove all planned items share the one assigned cursor and exact class | repository implementation, in-UoW ordinal, partial append success |
| `ObservationCursorFollowerMaterial` | owned post-cursor tagged union | carry exact material to family-specific follower writes | causal ordering claim, generic serialization or external effect |

### 5.3 object capability to field/function/state map

| object | required fields | factory / construction | core member | state / variant | field source |
|---|---|---|---|---|---|
| metadata seed | typed ref, origin, actor, recorded time, trace, causation, visibility | `try_new(...)` | `bind_cursor(self, cursor)` | none | operation context + typed ID + ClockPort |
| family request | accepted input, post-state, seed | family `try_new(...)` | `assemble(self, cursor)` | 12 concrete types | accepted domain output + in-memory post-state after required cursor-dependent mutation |
| request union | one concrete request | `From<ConcreteRequest>` only | `family`, `assemble` | 12 variants | concrete request |
| obligation | family expectation + request or H11 rollup seed | typed constructors only | `identity`, `family`, `materialize` | 12 families, one cursor-dependent H11 branch | accepted branch plan |
| write family | no payload | request-derived only | `cursor_influence` | 12 variants | request variant |
| primary family | no payload | accepted branch mapper only | `commit_class_influence` | 2 variants | actual accepted primary mutation |
| write footprint | nonempty primary families + exact record obligation multiset + follower plan shape | crate-private typed planners | `derive_commit_class` | validated value | actual accepted write plan |
| follower plan | membership updates, outbound seeds, stale targets, non-cursor atomic followers | `try_new(...)` | `materialize(cursor)` | process-local seed state | accepted branch + staged relations |
| assembly plan | nonempty obligations, exact footprint, follower plan, derived class | `try_new(...)` | `assign_and_prepare` | pre-cursor only | obligation set + affected write plan |
| append item | one concrete record | only request assembly | `family`, `committed_cursor` | 12 variants | domain factory success |
| append batch | class, cursor, owned items | `try_new(class, cursor, items)` | `into_items` | constructed only | already validated obligations + all factory outputs |
| follower material | one concrete post-cursor write input | follower plan only | family-specific dispatch | membership/outbox/stale/non-cursor | seed + exact cursor |

## 6. current record family and write-footprint totality

### 6.1 `ObservationRecordWriteFamily`

```rust
/// Current append-only record families that have an authorized writer.
pub(crate) enum ObservationRecordWriteFamily {
    /// H1 accepted intake or safety decision history.
    IntakeDecision,
    /// H2 accepted correlation-link history.
    CorrelationLink,
    /// H3 accepted audit projection or evidence-linkage history.
    AuditAppend,
    /// H4 accepted handoff or authenticity-hint history.
    HandoffLifecycle,
    /// H5 accepted retention marker or active-protection history.
    RetentionChange,
    /// H6 accepted no-write violation lifecycle history.
    NoWriteViolation,
    /// H8 accepted gap or degraded-output history.
    GapTransition,
    /// H9 accepted peripheral delivery or export-preparation history.
    PeripheralDelivery,
    /// H10 accepted reference-snapshot refresh history.
    ReferenceRefresh,
    /// H11 accepted projection, diagnostic, rollup, or rebuild history.
    ProjectionMaintenance,
    /// H12 accepted immutable gap-scan item result history.
    GapScan,
    /// H13 accepted per-target replay coordination history.
    ReplayExecution,
}
```

| variant | H family | cursor influence when alone | persisted record | current cardinality rule |
|---|---:|---|---|---|
| `IntakeDecision` | H1 | Observation required | `IntakeDecisionRecord` | one per accepted receipt/safety branch; one UoW may hold separate receipt and safety records |
| `CorrelationLink` | H2 | Observation required | `CorrelationLinkRecord` | one per explicitly classified context/signal linkage effect |
| `AuditAppend` | H3 | Observation required | `AuditAppendRecord` | one per accepted projection/linkage branch; projection transition metadata ref must match |
| `HandoffLifecycle` | H4 | Observation required | `HandoffLifecycleRecord` | one per accepted handoff/hint branch |
| `RetentionChange` | H5 | Observation required | `RetentionChangeRecord` | one per marker/protection branch; P8 two-stage UoW may have two PKs |
| `NoWriteViolation` | H6 | Observation required | `NoWriteViolationRecord` | one per accepted existing-violation transition; initial Detected remains no-record |
| `GapTransition` | H8 | Observation required | `GapTransitionRecord` | one per accepted gap/degraded branch with exact gap relation |
| `PeripheralDelivery` | H9 | Observation required | `PeripheralDeliveryRecord` | one per accepted delivery/preparation branch |
| `ReferenceRefresh` | H10 | Reference compatible | `ReferenceRefreshRecord` | one per in-place/new-snapshot accepted branch; becomes Observation in a mixed UoW |
| `ProjectionMaintenance` | H11 | Observation required | `ProjectionMaintenanceRecord` | one per accepted projection/diagnostic/rollup/rebuild branch |
| `GapScan` | H12 | Observation required | `GapScanRecord` | one per accepted immutable gap-scan item result |
| `ReplayExecution` | H13 | Observation required | `ReplayExecutionRecord` | one per exact scope/coordination/target transition |

`ReadAccessRecord` / H7 is intentionally absent. There is no `Other`, `Reserved`, string decoder, H7 variant or public constructor. A future asynchronous read-audit phase must change the design, add a writer envelope and redo the family/batch/ID/port/test matrices; configuration cannot activate it.

### 6.2 exact request matrix

| family | request object | accepted field type | post-state field type | metadata ref | domain factory allowlist |
|---|---|---|---|---|---|
| H1 | `IntakeDecisionRecordAssemblyRequest<'a>` | `IntakeDecisionAcceptedInput<'a>` | `IntakeDecisionPostState<'a>` | `IntakeDecisionRecordRef` | Command / InboundConsumer |
| H2 | `CorrelationLinkRecordAssemblyRequest<'a>` | `CorrelationLinkAcceptedInput<'a>` | `CorrelationLinkPostState<'a>` | `CorrelationLinkRecordRef` | Command / InboundConsumer |
| H3 | `AuditAppendRecordAssemblyRequest<'a>` | `AuditAppendAcceptedInput<'a>` | `AuditAppendPostState<'a>` | `AuditAppendRecordRef` | Command / InboundConsumer / OperationsJob |
| H4 | `HandoffLifecycleRecordAssemblyRequest<'a>` | `HandoffLifecycleAcceptedInput<'a>` | `HandoffLifecyclePostState<'a>` | `HandoffLifecycleRecordRef` | Command / InboundConsumer / OperationsJob |
| H5 | `RetentionChangeRecordAssemblyRequest<'a>` | `RetentionChangeAcceptedInput<'a>` | `RetentionChangePostState<'a>` | `RetentionChangeRecordRef` | Command / OperationsJob |
| H6 | `NoWriteViolationRecordAssemblyRequest<'a>` | `NoWriteViolationAcceptedInput<'a>` | `&'a NoWriteViolation` | `NoWriteViolationRecordRef` | Command / InboundConsumer / ResidentWorker / OperationsJob |
| H8 | `GapTransitionRecordAssemblyRequest<'a>` | `GapTransitionAcceptedInput<'a>` | `GapTransitionPostState<'a>` | `GapTransitionRecordRef` | Command / InboundConsumer / ResidentWorker / OperationsJob |
| H9 | `PeripheralDeliveryRecordAssemblyRequest<'a>` | `PeripheralDeliveryAcceptedInput<'a>` | `PeripheralDeliveryPostState<'a>` | `PeripheralDeliveryRecordRef` | Command / InboundConsumer / OperationsJob |
| H10 | `ReferenceRefreshRecordAssemblyRequest<'a>` | `ReferenceRefreshAcceptedInput<'a>` | `ReferenceRefreshPostState<'a>` | `ReferenceRefreshRecordRef` | Command / InboundConsumer / OperationsJob |
| H11 | `ProjectionMaintenanceRecordAssemblyRequest<'a>` | `ProjectionMaintenanceAcceptedInput<'a>` | `ProjectionMaintenancePostState<'a>` | `ProjectionMaintenanceRecordRef` | Command / InboundConsumer / ResidentWorker / OperationsJob |
| H12 | `GapScanRecordAssemblyRequest<'a>` | `GapScanAcceptedInput<'a>` | `&'a GapScanPostState` | `GapScanRecordRef` | OperationsJob only |
| H13 | `ReplayExecutionRecordAssemblyRequest<'a>` | `ReplayExecutionAcceptedInput<'a>` | `ReplayExecutionPostState<'a>` | `ReplayExecutionRecordRef` | OperationsJob only |

Each row is one record instance, not one family slot. An obligation collection may contain repeated family variants with different typed record refs and subjects. The allowlist is still only a domain factory gate; the current operation writer registry in §4.3 is the stricter producer gate. The operation-specific accepted-effect mapper consumes each accepted effect once and independently emits the expected family multiset; it rejects a repeated representation of the same accepted effect before building the footprint. The generic plan then rejects duplicate record refs or an obligation count/family multiplicity that differs from that independently produced expectation. H11 `SignalAccepted` is the one current request family whose accepted input is materialized only after the Observation cursor is assigned; its pre-cursor form is an `ObservationRecordObligation`.

### 6.3 primary write, record obligation and follower classification

```rust
/// Only primary accepted mutations participate in cursor namespace derivation.
pub(crate) enum ObservationPrimaryWriteFamily {
    /// Any observation-owned truth, guard, projection, maintenance, signal, item or scope mutation.
    ObservationOwnedMutation,
    /// An accepted local reference-snapshot mutation.
    ReferenceSnapshotMutation,
}

/// Finite classifier for primary mutations that execute only after cursor assignment.
pub(crate) enum ObservationCursorDependentPrimaryKind {
    /// `SignalRollupWindow::accept_signal` requires the assigned Observation cursor.
    SignalRollupAccept,
}
```

| primary footprint / record obligations | derived class | rule |
|---|---|---|
| at least one `ObservationOwnedMutation` | `Observation` | all records/followers use the one Observation cursor, including H10 |
| no observation primary; at least one `ReferenceSnapshotMutation`; every record obligation is H10 | `Reference` | H10 and all applicable followers use the one Reference cursor |
| both observation and reference primary mutations | `Observation` | mixed work is one Observation-class commit; no second cursor |
| no primary mutation | reject | record/follower-only work cannot manufacture accepted truth |
| Observation primary with only H10 records | `Observation` | explicit-no-record observation mutation still controls the transaction namespace |
| Reference-only primary with any non-H10 obligation | reject | family mapping contradicts the staged primary write |
| both cursor allocator results present | reject | one UoW has exactly one commit class and cursor value |

`ObservationPrimaryWriteFamily` is not freely assembled by API/worker/jobs. Owning application services obtain it from accepted transition/result tags. Record obligations and follower plans are separate inputs and cannot promote themselves to primary writes. A non-H10 obligation under a reference-only primary is therefore a contradiction, not an implicit promotion. R06.8 must map every concrete Step 07 stage/save/append method to one of these primary families or to an explicit follower category and make the UoW adapter verify the requested class against actual staged writes.

### 6.4 cursor-dependent primary seed: `SignalRollupAcceptSeed<'a>`

`SignalRollupWindow::accept_signal` is the current proof that “accepted transition before cursor” is not total. The signal itself may already be accepted and staged, but the rollup member requires the exact `ObservationCursor`; therefore the application must retain a seed and execute this local mutation after the one cursor is assigned.

```rust
/// Pre-cursor material required to accept one already-validated signal into its rollup window.
pub(crate) struct SignalRollupAcceptSeed<'a> {
    rollup: &'a mut SignalRollupWindow,
    expected_version: Option<ObservationRepositoryVersion>,
    signal: &'a SafeSignal,
    context: &'a CorrelationContext,
    record_metadata: ObservationRecordMetadataSeed<ProjectionMaintenanceRecordRef>,
}

/// Cursor-dependent primary post-state that must be staged before record append.
pub(crate) struct SignalRollupAcceptedMaterial<'a> {
    rollup: &'a SignalRollupWindow,
    expected_version: Option<ObservationRepositoryVersion>,
}

impl<'a> SignalRollupAcceptSeed<'a> {
    pub(crate) fn try_new(
        rollup: &'a mut SignalRollupWindow,
        expected_version: Option<ObservationRepositoryVersion>,
        signal: &'a SafeSignal,
        context: &'a CorrelationContext,
        record_metadata: ObservationRecordMetadataSeed<ProjectionMaintenanceRecordRef>,
    ) -> Result<Self, ApplicationError>;

    pub(crate) fn accept_and_materialize_record(
        self,
        cursor: ObservationCommittedCursor,
    ) -> Result<
        (SignalRollupAcceptedMaterial<'a>, ObservationRecordAppendItem),
        ApplicationError,
    >;
}
```

The constructor validates static identity/family compatibility and retains the exact version read with this rollup. `accept_and_materialize_record` requires `ObservationCommittedCursor::Observation`; `Reference` maps to `RecordAssemblyFailureKind::CursorNamespaceMismatch`. Its domain call is exactly `rollup.accept_signal(signal, context, observation_cursor)`.

`Ok(None)` is valid only on a duplicate/no-op path that must have been classified before a record-bearing plan was built. Seeing it after this obligation exists maps to `RecordAssemblyFailureKind::CursorDependentMutationProducedNoTransition` and rolls back. On `Ok(Some(transition))`, the method performs all of the following before the local transition is dropped:

1. borrows the mutated `rollup` as the unique same-UoW H11 post-state;
2. binds the metadata seed to the assigned Observation cursor;
3. constructs a cursor-bound `ProjectionMaintenanceRecordAssemblyRequest` with `ProjectionMaintenanceAcceptedInput::SignalRollupAccepted(&transition)` and `ProjectionMaintenancePostState::SignalRollup(&*rollup)`;
4. invokes the H11 factory and obtains an owned `ProjectionMaintenanceRecord`;
5. returns the borrowed post-rollup plus expected version as primary staging material and the owned H11 append item.

This sequence prevents a self-referential request: neither `transition` nor a request borrowing it escapes the member. `SignalRollupAcceptedMaterial<'a>` may be passed only to the corrected borrow-stage `save_rollup(&SignalRollupWindow, expected_version, uow)` surface. It is not a persisted DTO and does not authorize a second mutation after H11 construction.

This object does not call a repository, allocate a second cursor, read current truth, rerun policy, serialize an event or create a report. If the domain member or H11 factory fails, the in-memory rollup candidate is discarded and the enclosing UoW rolls back every previously staged write. A successfully allocated cursor may leave a non-visible gap, but it is never reused.

## 7. shared metadata and request objects

### 7.1 `ObservationRecordMetadataSeed<R>`

```rust
/// Complete typed record metadata before the current UoW assigns its cursor.
pub(crate) struct ObservationRecordMetadataSeed<R> {
    /// Exact typed append-only record identity reserved for one record instance.
    record_ref: R,
    /// Finite accepted writer lane copied from the trusted operation context.
    origin: ObservationRecordOrigin,
    /// Body-free actor or system principal projection.
    actor_ref: ActorSafeRef,
    /// One trusted local record time reserved before factory construction.
    recorded_at: ObservedAt,
    /// Optional body-free trace correlation value.
    trace_ref: Option<TraceCorrelationRef>,
    /// Optional body-free causation value from a trusted envelope/context.
    causation_ref: Option<CausationRef>,
    /// Requested maximum projection eligibility, still checked by the concrete factory.
    audit_visibility: RecordAuditVisibility,
}
```

| field | exact source | invariant |
|---|---|---|
| `record_ref` | exact typed ID generator method before the accepted domain member | never generic `BodyFreeRef`; one seed/request/record only |
| `origin` | `ObservationOperationContext` family mapped to finite `ObservationRecordOrigin` | Query has no mapping; runner/route name cannot substitute |
| `actor_ref` | operation context safe actor projection | no credential/session/provider/raw actor material |
| `recorded_at` | one `ClockPort.now()` capture reserved by the accepted operation | no DB default, cursor, source occurred time or adapter result time |
| `trace_ref` | trusted operation context | optional is explicit; no URL/span body parsing |
| `causation_ref` | trusted inbound envelope or operation context | no derivation from trace/time/cursor |
| `audit_visibility` | family/branch plan requested ceiling | concrete H factory may reject an upgrade; seed is not read authorization |

```rust
impl<R> ObservationRecordMetadataSeed<R> {
    pub(crate) fn try_new(
        record_ref: R,
        origin: ObservationRecordOrigin,
        actor_ref: ActorSafeRef,
        recorded_at: ObservedAt,
        trace_ref: Option<TraceCorrelationRef>,
        causation_ref: Option<CausationRef>,
        audit_visibility: RecordAuditVisibility,
    ) -> Result<Self, ApplicationError>;

    pub(crate) fn bind_cursor(
        self,
        committed_cursor: ObservationCommittedCursor,
    ) -> ObservationRecordMetadata<R>;

    pub(crate) fn record_ref(&self) -> &R;
}
```

`bind_cursor` consumes the seed, always creates `committed_cursor=Some(...)`, and cannot be called twice. It does not validate concrete family state; that remains the H factory's duty. No public constructor accepts `Option<ObservationCommittedCursor>`, so current F2 writers cannot accidentally build cursorless metadata.

### 7.2 family-specific request schema pattern

The following complete pattern applies with the exact type substitutions in §6.2; each named request is a separate current Step 06 object, not a type alias or macro-only design placeholder.

```rust
/// Borrowed inputs required to assemble one H1 record after cursor assignment.
pub(crate) struct IntakeDecisionRecordAssemblyRequest<'a> {
    accepted: IntakeDecisionAcceptedInput<'a>,
    post_state: IntakeDecisionPostState<'a>,
    metadata_seed: ObservationRecordMetadataSeed<IntakeDecisionRecordRef>,
}

impl<'a> IntakeDecisionRecordAssemblyRequest<'a> {
    pub(crate) fn try_new(
        accepted: IntakeDecisionAcceptedInput<'a>,
        post_state: IntakeDecisionPostState<'a>,
        metadata_seed: ObservationRecordMetadataSeed<IntakeDecisionRecordRef>,
    ) -> Result<Self, ApplicationError>;

    pub(crate) fn assemble(
        self,
        cursor: ObservationCommittedCursor,
    ) -> Result<IntakeDecisionRecord, ApplicationError>;

    pub(crate) fn identity(&self) -> ObservationRecordIdentity;
}
```

`try_new` performs only application-layer family/origin prechecks and preserves the exact domain inputs. `assemble` calls `metadata_seed.bind_cursor(cursor)`, delegates to `IntakeDecisionRecord::from_accepted`, and maps `DomainError` to `ApplicationError::Domain` without parsing text. The remaining eleven cards use the same two members but return their own concrete records; they do not share a generic `Record` trait or erase accepted/post-state types.

### 7.3 twelve independent request cards

| request object | object capability | `try_new` additional gate | `assemble` exact delegation | failure / no side effect |
|---|---|---|---|---|
| `IntakeDecisionRecordAssemblyRequest<'a>` | retain H1 receipt/safety branch and possible dual post-state | origin Command/InboundConsumer; seed ref exact | `IntakeDecisionRecord::from_accepted(accepted, post_state, metadata)` | mismatch leaves receipt/disposition staged only; whole UoW rolls back |
| `CorrelationLinkRecordAssemblyRequest<'a>` | retain H2 context/signal branch and loaded relation | origin Command/InboundConsumer; explicit linkage effect required by accepted enum | `CorrelationLinkRecord::from_accepted(...)` | no effect inference from signal state; no partial record |
| `AuditAppendRecordAssemblyRequest<'a>` | retain H3 projection/linkage branch | origin matrix; seed ref must equal projection transition-carried ref when applicable | `AuditAppendRecord::from_accepted(...)` | no second ref mint after transition; rollback on mismatch |
| `HandoffLifecycleRecordAssemblyRequest<'a>` | retain H4 handoff/hint branch and decisions | Command/InboundConsumer/OperationsJob; visibility ceiling precheck | `HandoffLifecycleRecord::from_accepted(...)` | does not call delivery or readiness policy |
| `RetentionChangeRecordAssemblyRequest<'a>` | retain H5 marker/protection branch | Command/OperationsJob; each P8 stage gets a separate seed | `RetentionChangeRecord::from_accepted(...)` | two-stage failure rolls back both PKs and state writes |
| `NoWriteViolationRecordAssemblyRequest<'a>` | retain H6 existing violation transition and borrowed post-state | no initial Detected/P10-only request; four allowed origins | `NoWriteViolationRecord::from_accepted(accepted, post_state, metadata)` | forbidden write remains blocked; failed persistence never authorizes it |
| `GapTransitionRecordAssemblyRequest<'a>` | retain H8 creation/transition proof and gap relation | exact accepted enum; Query decision and gapless degraded branch excluded | `GapTransitionRecord::from_accepted(...)` | does not open/close gap by observing a ref |
| `PeripheralDeliveryRecordAssemblyRequest<'a>` | retain H9 delivery/preparation branch | Command/InboundConsumer/OperationsJob; initial/exact replay excluded | `PeripheralDeliveryRecord::from_accepted(...)` | no external call or acceptance claim |
| `ReferenceRefreshRecordAssemblyRequest<'a>` | retain H10 in-place/new-identity refresh proof | Command/InboundConsumer/OperationsJob; cursor may be Reference or Observation according to plan | `ReferenceRefreshRecord::from_accepted(...)` | PreserveCurrent/error has no request; no old-row mutation inference |
| `ProjectionMaintenanceRecordAssemblyRequest<'a>` | retain H11 exact projection/diagnostic/rollup/rebuild branch | origin and subject family compatibility | `ProjectionMaintenanceRecord::from_accepted(...)` | no view rebuild/source repair inside assembly |
| `GapScanRecordAssemblyRequest<'a>` | retain H12 immutable accepted result and borrowed post-state | OperationsJob only; item result/post-state association exact | `GapScanRecord::from_accepted(accepted, post_state, metadata)` | no gap creation, item/report/claim lifecycle or source completeness claim |
| `ReplayExecutionRecordAssemblyRequest<'a>` | retain H13 per-target transition and approved scope | OperationsJob only; one target membership | `ReplayExecutionRecord::from_accepted(...)` | no scope expansion, source replay or report completion |

For every card, fields are private; there is no serde/default/builder/rehydrate path. Requests live no longer than the service's accepted UoW. Their post-state fields are borrowed or are enums/structs containing borrows; none owns or clones a domain aggregate.

### 7.4 `ObservationRecordAssemblyRequest<'a>`

```rust
/// Heterogeneous process-local dispatch for current mandatory record requests.
pub(crate) enum ObservationRecordAssemblyRequest<'a> {
    /// One H1 request.
    IntakeDecision(IntakeDecisionRecordAssemblyRequest<'a>),
    /// One H2 request.
    CorrelationLink(CorrelationLinkRecordAssemblyRequest<'a>),
    /// One H3 request.
    AuditAppend(AuditAppendRecordAssemblyRequest<'a>),
    /// One H4 request.
    HandoffLifecycle(HandoffLifecycleRecordAssemblyRequest<'a>),
    /// One H5 request.
    RetentionChange(RetentionChangeRecordAssemblyRequest<'a>),
    /// One H6 request.
    NoWriteViolation(NoWriteViolationRecordAssemblyRequest<'a>),
    /// One H8 request.
    GapTransition(GapTransitionRecordAssemblyRequest<'a>),
    /// One H9 request.
    PeripheralDelivery(PeripheralDeliveryRecordAssemblyRequest<'a>),
    /// One H10 request.
    ReferenceRefresh(ReferenceRefreshRecordAssemblyRequest<'a>),
    /// One H11 request.
    ProjectionMaintenance(ProjectionMaintenanceRecordAssemblyRequest<'a>),
    /// One H12 request.
    GapScan(GapScanRecordAssemblyRequest<'a>),
    /// One H13 request.
    ReplayExecution(ReplayExecutionRecordAssemblyRequest<'a>),
}
```

| member | exact contract |
|---|---|
| `family(&self) -> ObservationRecordWriteFamily` | total static match; no string/parser/config branch |
| `assemble(self, cursor) -> Result<ObservationRecordAppendItem, ApplicationError>` | delegates to the concrete request and wraps only after concrete factory success |
| `From<ConcreteRequest>` | one implementation for each of the 12 exact request types; no generic `From<T>` blanket |
| `identity(&self) -> ObservationRecordIdentity` | returns an owned exact typed identity before the request is consumed; only the immutable typed ref is cloned |

This enum is crate-private and process-local. It is not serialized, persisted, exposed in protocol, passed into domain, or accepted by a generic repository upsert.

### 7.5 `ObservationRecordObligation<'a>`

An assembly request is already complete and may wait for a cursor. An obligation is broader: it either retains one such request or retains the exact cursor-dependent primary seed from which the H11 request can only be created after assignment.

```rust
/// One mandatory record obligation retained before the UoW cursor exists.
pub(crate) enum ObservationRecordObligation<'a> {
    IntakeDecision(IntakeDecisionRecordAssemblyRequest<'a>),
    CorrelationLink(CorrelationLinkRecordAssemblyRequest<'a>),
    AuditAppend(AuditAppendRecordAssemblyRequest<'a>),
    HandoffLifecycle(HandoffLifecycleRecordAssemblyRequest<'a>),
    RetentionChange(RetentionChangeRecordAssemblyRequest<'a>),
    NoWriteViolation(NoWriteViolationRecordAssemblyRequest<'a>),
    GapTransition(GapTransitionRecordAssemblyRequest<'a>),
    PeripheralDelivery(PeripheralDeliveryRecordAssemblyRequest<'a>),
    ReferenceRefresh(ReferenceRefreshRecordAssemblyRequest<'a>),
    ProjectionMaintenance(ProjectionMaintenanceRecordAssemblyRequest<'a>),
    SignalRollupAccept(SignalRollupAcceptSeed<'a>),
    GapScan(GapScanRecordAssemblyRequest<'a>),
    ReplayExecution(ReplayExecutionRecordAssemblyRequest<'a>),
}

impl<'a> ObservationRecordObligation<'a> {
    pub(crate) fn family(&self) -> ObservationRecordWriteFamily;
    pub(crate) fn identity(&self) -> ObservationRecordIdentity;
    pub(crate) fn is_cursor_dependent(&self) -> bool;

    fn materialize(
        self,
        cursor: ObservationCommittedCursor,
    ) -> Result<ObservationRecordMaterialization<'a>, ApplicationError>;
}
```

| variant group | pre-cursor payload | cursor-bound action | primary staging output |
|---|---|---|---|
| H1~H6, H8~H10, non-rollup H11, H12, H13 | one complete family request borrowing the accepted input and same-UoW post-state | bind metadata, call exact domain factory, wrap the owned concrete record | none; its primary mutation was already staged by borrow |
| `SignalRollupAccept` | mutable rollup, exact loaded version, recorded signal, correlation context and H11 metadata seed | require Observation cursor, call `accept_signal`, construct H11 before the local transition is dropped | `SignalRollupAcceptedMaterial<'a>` for the corrected borrow-stage save |

`family()` maps both H11 variants to `ProjectionMaintenance`. `identity()` returns an owned tagged identity copied only from the request metadata seed; it does not consume the request and does not clone an aggregate or transition. There is no H7, unknown family, closure, boxed callback, serde representation or persisted obligation row.

```rust
/// Result of materializing one obligation with the assigned UoW cursor.
struct ObservationRecordMaterialization<'a> {
    cursor_dependent_primary: Option<SignalRollupAcceptedMaterial<'a>>,
    append_item: ObservationRecordAppendItem,
}
```

Only `SignalRollupAccept` may return `Some(cursor_dependent_primary)`. Every other variant must return `None`; a mismatched shape is `AssembledItemMismatch`. The materialization is consumed within the same service call and UoW.

## 8. assembly error, identity and bounded cardinality objects

### 8.1 `RecordAssemblyFailureKind`

```rust
/// Finite application-internal invariant failures while planning or assembling mandatory records.
pub enum RecordAssemblyFailureKind {
    /// A record-bearing plan contained no current record obligation.
    EmptyObligationSet,
    /// The obligation set exceeded the compile-time UoW safety ceiling.
    ObligationLimitExceeded,
    /// Records or cursor followers were planned without an accepted primary mutation.
    MissingPrimaryMutation,
    /// An accepted branch required a record family for which no obligation was supplied.
    MissingMandatoryObligation,
    /// An obligation was supplied for a family absent from the accepted branch expectation.
    UnexpectedMandatoryObligation,
    /// The same typed record identity appeared more than once in one plan or batch.
    DuplicateRecordRef,
    /// Two outbox seeds reuse a record, event, or payload snapshot identity.
    DuplicateFollowerIdentity,
    /// The cursor-dependent primary inventory does not match its exact obligation.
    CursorDependentPrimaryMismatch,
    /// A planned cursor-dependent domain member unexpectedly returned no transition.
    CursorDependentMutationProducedNoTransition,
    /// The follower plan shape differs from the accepted operation's required write set.
    FollowerPlanMismatch,
    /// Primary writes and requested record families cannot share a valid commit class.
    IncompatibleWriteFamily,
    /// The assigned tagged cursor does not match the derived commit class.
    CursorNamespaceMismatch,
    /// A concrete assembled record does not retain the batch's exact tagged cursor value.
    RecordCursorMismatch,
    /// Assembled item family, count, or identity differs from the validated pre-cursor plan.
    AssembledItemMismatch,
}
```

| variant | producer | recovery | forbidden mapping |
|---|---|---|---|
| `EmptyObligationSet` | plan factory | rollback; implementation/design defect | accepted no-op, Query success |
| `ObligationLimitExceeded` | plan factory before cursor | rollback/split the operation under a redesigned exact boundary | truncate, config increase, partial history |
| `MissingPrimaryMutation` | footprint validation | rollback/manual consistency diagnosis | allocate cursor for followers only |
| `MissingMandatoryObligation` | obligation/expectation totality check | rollback/manual defect | silently commit unrecorded accepted mutation |
| `UnexpectedMandatoryObligation` | obligation/expectation totality check | rollback/manual defect | append best-effort audit row |
| `DuplicateRecordRef` | plan or batch identity check | rollback; reserve new exact refs only on a new execution | upsert, overwrite, deduplicate by last-write-wins |
| `DuplicateFollowerIdentity` | follower-plan factory | rollback before cursor; correct exact outbox/result relation | last-write-wins or reuse one event/snapshot identity |
| `CursorDependentPrimaryMismatch` | footprint/plan validation | rollback before cursor; correct H11 obligation mapping | execute an unrecorded rollup mutation |
| `CursorDependentMutationProducedNoTransition` | `SignalRollupAcceptSeed` after cursor | rollback whole UoW; diagnose duplicate/no-op preclassification | silently omit H11 or commit only the signal |
| `FollowerPlanMismatch` | footprint/follower/material validation | rollback; correct operation-specific accepted side-effect inventory | drop a mandatory follower or invent one after cursor |
| `IncompatibleWriteFamily` | commit-class derivation | rollback/design correction | allocate both namespaces or let caller choose |
| `CursorNamespaceMismatch` | plan/batch bind | rollback | retag numeric value or compare untagged number |
| `RecordCursorMismatch` | append-batch validation | rollback | rewrite immutable record metadata |
| `AssembledItemMismatch` | post-factory plan comparison | rollback | drop extra item or continue with a subset |

The type is owned by `application::errors`; it is body-free, has exact internal tokens, and carries no record ref, raw value, provider text or serialized transition. `ApplicationError` adds exactly one wrapper variant:

```rust
/// Mandatory append-only record planning or assembly violated a finite application invariant.
RecordAssemblyInvariantViolation(RecordAssemblyFailureKind),
```

Domain factory rejection remains `ApplicationError::Domain(DomainError)`. Allocator failure remains `CursorAllocationFailed`; repository append failure remains the concrete repository/transaction error. No error string is parsed to manufacture a `RecordAssemblyFailureKind`.

### 8.2 `ObservationRecordIdentity`

```rust
/// Owned typed identity copied from one record metadata seed before request consumption.
#[derive(Clone, Debug, Eq, Hash, PartialEq)]
pub(crate) enum ObservationRecordIdentity {
    /// H1 identity.
    IntakeDecision(IntakeDecisionRecordRef),
    /// H2 identity.
    CorrelationLink(CorrelationLinkRecordRef),
    /// H3 identity.
    AuditAppend(AuditAppendRecordRef),
    /// H4 identity.
    HandoffLifecycle(HandoffLifecycleRecordRef),
    /// H5 identity.
    RetentionChange(RetentionChangeRecordRef),
    /// H6 identity.
    NoWriteViolation(NoWriteViolationRecordRef),
    /// H8 identity.
    GapTransition(GapTransitionRecordRef),
    /// H9 identity.
    PeripheralDelivery(PeripheralDeliveryRecordRef),
    /// H10 identity.
    ReferenceRefresh(ReferenceRefreshRecordRef),
    /// H11 identity.
    ProjectionMaintenance(ProjectionMaintenanceRecordRef),
    /// H12 identity.
    GapScan(GapScanRecordRef),
    /// H13 identity.
    ReplayExecution(ReplayExecutionRecordRef),
}
```

The assembly plan snapshots this value before consuming any obligation. Cloning is permitted only for these immutable typed ref wrappers; accepted transitions, aggregate post-state, records, requests, obligations and plans are never cloned to satisfy ownership. Equal inner body-free bytes under different variants are distinct typed identities, and Step 11 must persist the family discriminator with the PK. The enum has no serde, generic body-free downcast, string constructor, `Other` or H7 variant.

`ObservationRecordAppendItem::identity()` also returns an owned `ObservationRecordIdentity`. Post-materialization validation compares the owned expected vector with item identities; it never keeps a reference into a request that has already been consumed.

### 8.3 compile-time bound

```rust
/// Absolute safety ceiling for current mandatory H-records assembled by one local UoW.
pub(crate) const MAX_OBSERVATION_RECORDS_PER_UOW: usize = 258;
```

The ceiling is derived from the widest current item boundary: `GapStateRefSet` permits at most 256 exact discovered gaps, each separately accepted H8 mutation may require one H8 record, the item requires one H12 result record, and an optional accepted maintenance-state transition may require one H11 record. H12 alone never creates H8; the 256 H8 entries exist only when the owning flow separately performs and proves each P12/H8 accepted mutation.

| boundary | exact narrower expectation |
|---|---|
| ordinary single-subject Command/Consumer transition | one record per accepted branch, usually 1 |
| H1 intake with safety + receipt accepted changes | exactly 2 different H1 refs |
| H5 P8 protection then marker accepted changes | exactly 2 different H5 refs |
| reference-only refresh | exactly one H10 per accepted snapshot mutation |
| gap-scan item | exact `accepted H8 count + 1 H12 + optional 1 H11`; never inferred from 258 |
| per-target replay item | one H13 plus only independently accepted local records named by that item plan |

The constant is not a config key, runtime default, batch target or permission to combine unrelated operations. Inputs above the exact operation expectation fail even when below 258. Inputs above 258 fail before cursor allocation; no truncation or multi-commit claim is allowed. A future larger atomic boundary requires a design change or an explicit split into independently auditable UoWs.

## 9. write footprint and commit-class objects

### 9.1 `ObservationUowWriteFootprint`

```rust
/// Finite follower categories that must commit after the UoW cursor is assigned.
#[derive(Clone, Copy, Debug, Eq, PartialEq)]
pub(crate) enum ObservationCursorFollowerFamily {
    ProjectionMembership,
    ProjectionStaleMarker,
    OutboxPair,
    StoredResult,
    IdempotencyCompletion,
    JobItemAndReportFold,
}

/// Validated process-local inventory of primary writes, records, and followers for one UoW.
pub(crate) struct ObservationUowWriteFootprint {
    /// Actual accepted primary mutation families; nonempty.
    primary_writes: Vec<ObservationPrimaryWriteFamily>,
    /// Cursor-dependent primary kinds represented by exact obligations.
    cursor_dependent_primaries: Vec<ObservationCursorDependentPrimaryKind>,
    /// Exact mandatory record-family multiset derived from obligations.
    mandatory_record_families: Vec<ObservationRecordWriteFamily>,
    /// Exact follower-family multiset derived from a validated follower plan.
    follower_families: Vec<ObservationCursorFollowerFamily>,
}
```

| field | exact source | invariant |
|---|---|---|
| `primary_writes` | operation-specific total mapper over actual accepted local mutations | nonempty; only `ObservationOwnedMutation` and `ReferenceSnapshotMutation`; records/followers do not count |
| `cursor_dependent_primaries` | exact `SignalRollupAccept` obligations | current cardinality `0..=1`; every entry is also one Observation-owned primary and one H11 obligation |
| `mandatory_record_families` | `ObservationRecordObligation::family()` | preserves multiplicity; H1/H5/H8 repeats are legal; H7 impossible |
| `follower_families` | `ObservationCursorFollowerPlan::families()` | preserves outbox multiplicity; singleton families appear at most once; no family chooses the cursor namespace |

```rust
impl ObservationUowWriteFootprint {
    /// Called only by an operation-specific total mapper over accepted effects.
    pub(crate) fn try_from_expected_effects(
        primary_writes: Vec<ObservationPrimaryWriteFamily>,
        cursor_dependent_primaries: Vec<ObservationCursorDependentPrimaryKind>,
        mandatory_record_families: Vec<ObservationRecordWriteFamily>,
        follower_families: Vec<ObservationCursorFollowerFamily>,
    ) -> Result<Self, ApplicationError>;

    pub(crate) fn derive_commit_class(
        &self,
    ) -> Result<ObservationCommitClass, ApplicationError>;

    pub(crate) fn expected_record_families(
        &self,
    ) -> &[ObservationRecordWriteFamily];

    pub(crate) fn expected_follower_families(
        &self,
    ) -> &[ObservationCursorFollowerFamily];
}
```

The projection planner's actual output is `Vec<ProjectionSourceIndexUpdate>`; no `ProjectionSourceIndexUpdateSet` type exists. A nonempty successful vector is moved into `ObservationCursorFollowerPlan::projection_membership`. An empty planner result means the operation has no membership follower; an individual `ProjectionSourceIndexUpdate.memberships` may still be empty to express a validated full withdrawal.

The footprint factory is crate-private and can be called only from a total operation-specific mapper after accepted branches exist. Its four vectors are expected effects, not values copied from the obligations or follower plan that they will validate. The mapper derives them from concrete accepted transition/result variants, accepted primary mutation tags and the static outbound/result/job mapping; it cannot inspect record metadata or ask a repository what was appended. It rejects an empty primary set, an empty expected record set for an F2 call, more than one cursor-dependent primary, a cursor-dependent primary without exactly one expected H11 family, duplicate accepted-effect slots and impossible singleton follower multiplicity. Duplicate primary family entries collapse only for namespace classification; record and outbox multiplicity is retained. The factory accepts no strings, public operation names, repository table names, booleans or caller-selected commit class.

The later `ObservationRecordAssemblyPlan::try_new` is the independent comparison point: obligations must equal `mandatory_record_families`, and `followers.families()` must equal `follower_families`, including multiplicity. An implementation that calls `obligations.iter().map(family)` or `followers.families()` to manufacture the expected footprint fails the F2 contract even if all local assertions pass.

### 9.2 projection-membership and stale followers

```rust
/// Exact no-cursor output of the current projection membership planner.
pub(crate) struct ObservationProjectionMembershipFollower {
    updates: Vec<ProjectionSourceIndexUpdate>,
}

/// Exact existing projections that must receive this UoW's tagged stale position.
pub(crate) struct ObservationProjectionStaleFollower {
    affected: AffectedProjectionSet,
}
```

| object | factory | invariant | cursor-bound dispatch |
|---|---|---|---|
| membership | `try_new(updates: Vec<ProjectionSourceIndexUpdate>)` | vector nonempty, canonical unique by typed `ProjectionSourceRef`; every update already came from `ObservationProjectionMembershipPlanner.plan_updates(ProjectionSourceChangeSet, uow)`; empty member list inside one update remains a valid full withdrawal | `record_committed_sources(updates, committed_cursor, uow)` |
| stale | `try_new(affected: AffectedProjectionSet)` | source/view sets are canonical, body-free and resolved from the dependency index; an empty set is omitted from the plan rather than encoded as intent | `mark_views_stale(affected, committed_cursor, uow)` |

Neither object allocates a cursor, reloads truth, scans all views or derives a namespace. Membership updates themselves do not carry a cursor; the store receives the plan's one tagged value. Stale resolution must complete before cursor allocation and may not be repeated after writes are staged to obtain a different set.

### 9.3 outbox follower seed and append pair

```rust
/// Complete accepted event material before the UoW cursor exists.
pub(crate) struct ObservationOutboxSnapshotSeed<T> {
    outbox_ref: OutboxRecordRef,
    payload_snapshot_ref: OutboxPayloadSnapshotRef,
    event_ref: OutboundEventRef,
    event_name: ObservationOutboundEventName,
    schema_version: SchemaVersion,
    effect_binding_ref: ExternalEffectBindingRef,
    committed_subject_ref: BodyFreeRef,
    trace_ref: Option<TraceCorrelationRef>,
    stored_at: ObservedAt,
    payload: T,
}

/// Closed current event-payload dispatch; one variant maps to one Step 08 payload schema.
pub(crate) enum ObservationOutboxFollowerSeed {
    ObservationReceiptChanged(ObservationOutboxSnapshotSeed<ObservationReceiptChangedPayload>),
    SafetyDispositionChanged(ObservationOutboxSnapshotSeed<SafetyDispositionChangedPayload>),
    SafeSignalRecorded(ObservationOutboxSnapshotSeed<SafeSignalRecordedPayload>),
    AuditProjectionAppended(ObservationOutboxSnapshotSeed<AuditProjectionAppendedPayload>),
    EvidenceLinkageChanged(ObservationOutboxSnapshotSeed<EvidenceLinkageChangedPayload>),
    ReportHandoffChanged(ObservationOutboxSnapshotSeed<ReportHandoffChangedPayload>),
    RetentionMarkerChanged(ObservationOutboxSnapshotSeed<RetentionMarkerChangedPayload>),
    NoWriteViolationRecorded(ObservationOutboxSnapshotSeed<NoWriteViolationRecordedPayload>),
    GapStateChanged(ObservationOutboxSnapshotSeed<GapStateChangedPayload>),
    ReferenceSnapshotChanged(ObservationOutboxSnapshotSeed<ReferenceSnapshotChangedPayload>),
    DerivedProjectionChanged(ObservationOutboxSnapshotSeed<DerivedProjectionChangedPayload>),
    PeripheralDeliveryChanged(ObservationOutboxSnapshotSeed<PeripheralDeliveryChangedPayload>),
}

/// Owned record/snapshot pair passed once to the existing outbox append port.
pub(crate) struct ObservationOutboxAppendPair {
    record: ObservationOutboxRecord,
    payload: ObservationOutboxPayloadSnapshot,
}
```

`ObservationOutboxSnapshotSeed::try_new(...)` validates independent identities, the static event-name/payload variant mapping, subject identity, supported schema, exact frozen publication binding, safe trace and one accepted-UoW time. It intentionally contains no serialized payload, digest or committed cursor. A caller cannot provide pre-encoded bytes because the protocol envelope includes the assigned cursor.

`ObservationOutboxFollowerSeed::materialize(committed_cursor)` performs a total static match and executes this exact pure sequence:

1. call the current typed protocol snapshot encoder with `payload_snapshot_ref`, `event_ref`, exact event name, subject, schema, typed payload, assigned cursor, trace and `stored_at`;
2. obtain one `ObservationOutboundEventPayloadSnapshot` whose serialized bytes/digest include the exact tagged cursor and whose event/name/subject/time equal the seed;
3. call `ObservationOutboxPayloadSnapshot::from_protocol_snapshot(effect_binding_ref, protocol_snapshot)`;
4. call `ObservationOutboxRecord::pending(outbox_ref, &payload, stored_at)`;
5. validate record/snapshot identity, cursor and time equality and return one owned pair.

The typed encoder callable is an affected definition for Step 08: it must be exposed as a deterministic contracts factory or equivalent static encoder and may not require repository/config access. The current Step 08 `ReferenceSnapshotChangedPayload.snapshot_ref` must use canonical `ReferenceSnapshotStateRef`; historical `ReferenceSnapshotRef` is not accepted by this seed. Until those frozen use-sites are repaired, the F2 semantic contract above is authoritative and `R06-F2-AFFECT-08-OUTBOX-ENCODER` remains open-controlled.

No outbox seed is created for a branch without a mapped current outbound event. H7, Query, duplicate replay, conflict, in-flight, rejected pre-UoW input and publisher marker-only UoWs have no seed. `MAX_OBSERVATION_OUTBOX_PAIRS_PER_UOW` equals the F2 absolute record ceiling `258`; every operation still has a narrower exact event cardinality and cannot use the ceiling to emit unrelated events.

```rust
/// Absolute safety ceiling for cursor-bound outbox pairs in one record-bearing UoW.
pub(crate) const MAX_OBSERVATION_OUTBOX_PAIRS_PER_UOW: usize = 258;
```

This is a separate application assembly invariant even though its current numeric value equals `MAX_OBSERVATION_RECORDS_PER_UOW`. It is not an alias, configuration key, throughput target or statement that every record emits an event. Changing either bound requires an independent cardinality review.

### 9.4 stored-result and idempotency-completion followers

```rust
/// An immutable result that must be saved after all accepted local material is valid.
pub(crate) struct ObservationStoredResultFollower {
    result: StoredObservationResult,
}

/// Reserved row that must point to that exact result and become Completed in the same UoW.
pub(crate) struct ObservationIdempotencyCompletionFollower {
    reservation: ObservationIdempotencyReservation,
    result_ref: StoredObservationResultRef,
}

/// Post-validation completion material; never independently durable in memory.
pub(crate) struct ObservationIdempotencyCompletionMaterial {
    completed_reservation: ObservationIdempotencyReservation,
    result_ref: StoredObservationResultRef,
}
```

`ObservationStoredResultFollower::try_new(result)` accepts only an already validated immutable result built from the current Reserved reservation and exact application result surface. `ObservationIdempotencyCompletionFollower::try_new(reservation, result_ref)` requires the reservation to be `Reserved`, pointer-free and identical to the result's idempotency/operation/actor/digest relation. The follower plan requires these two fields to be both present or both absent and requires their result refs to match.

After cursor-bound records/outbox material have been constructed successfully, `ObservationIdempotencyCompletionFollower::materialize()` calls `reservation.attach_result(result_ref.clone())` then `reservation.complete()`. Persistence dispatch remains strictly `save_result(result, uow)` before `mark_completed(completed_reservation, result_ref, uow)`. A committed `Reserved + Some(result_ref)` intermediate is impossible. These followers do not embed the cursor, but they remain after-cursor followers because their replay surface may include the accepted operation's already reserved changed/outbox refs and may be persisted only after all mandatory cursor-bound material succeeds.

### 9.5 job item/report-fold follower

```rust
/// Same-UoW application coordination writes associated with one record-bearing Job item.
pub(crate) struct ObservationJobItemReportFollower {
    item: ObservationJobPlanItem,
    item_expected_version: ObservationRepositoryVersion,
    claim: ObservationExecutionClaim,
    claim_expected_version: ObservationRepositoryVersion,
    authority_now: ObservedAt,
    report: ObservationJobReportDraft,
    report_expected_version: ObservationRepositoryVersion,
    fold_entry: JobReportItemFoldEntry,
    scope_items: Vec<ProjectionScopeItemReport>,
}

/// Fully validated item/report candidate after all in-memory folds have succeeded.
pub(crate) struct ObservationPreparedJobItemReportFollower {
    item: ObservationJobPlanItem,
    item_expected_version: ObservationRepositoryVersion,
    claim: ObservationExecutionClaim,
    claim_expected_version: ObservationRepositoryVersion,
    authority_now: ObservedAt,
    report: ObservationJobReportDraft,
    report_expected_version: ObservationRepositoryVersion,
}
```

The owning Job service must register the exact claim tuple with the current UoW before it invokes the protected in-memory item classification and before it constructs this follower. Registration is a commit guard, not a follower row and not a preflight boolean; the durable adapter rechecks it at commit. The factory then accepts only an item classified by `ObservationJobPlanItem::classify_with_cas` using the exact typed outcome, including the same H12 accepted result where applicable. It validates all of the following before cursor allocation:

- item and report bind the same immutable `plan_ref`, and the fold entry binds that item work key exactly;
- the item expected version is the version read from the item row, while `claim_expected_version` is the separately read claim-row version;
- the claim exact tuple protects this plan/item subject, is Active at `authority_now`, and equals the tuple embedded in `JobReportItemSnapshotProof::ItemCas`;
- report remains Draft, report expected version is present, and every optional scope item is losslessly supported by the fold entry;
- the H12 result, `GapScanPostState`, item outcome association and fold entry preserve target/snapshot/outcome/time/ref fields exactly; no H8 mutation is inferred from discovered refs.

`ObservationJobItemReportFollower::materialize(self)` applies `report.record_item_snapshot(fold_entry)` and every `record_scope_item` in memory and returns `ObservationPreparedJobItemReportFollower`. All fold invariants therefore succeed before the first record append or follower repository dispatch. Post-record dispatch only stages the already classified item with its item-row CAS and saves the already folded report with its independent report-row CAS. It does not register a second claim guard, reclassify the item or rerun a report fold. Any stale claim at commit, item CAS or report CAS rolls back the primary mutation, cursor-bound records and all followers. A claim/fence boolean, naked fencing token, `JobRunId` or report counter cannot substitute.

This follower is present only in a record-bearing item UoW. Job start/plan materialization, claim-only, heartbeat/release/expiry, report-only accounting and terminal report/result/reservation finalize UoWs do not call the F2 assembler. Finalize continues to use an execution claim and its dedicated D-6/E same-UoW contract.

### 9.6 `ObservationCursorFollowerPlan` and material

```rust
/// Validated exact post-cursor write plan for one record-bearing accepted UoW.
pub(crate) struct ObservationCursorFollowerPlan {
    projection_membership: Option<ObservationProjectionMembershipFollower>,
    projection_stale: Option<ObservationProjectionStaleFollower>,
    outbox: Vec<ObservationOutboxFollowerSeed>,
    stored_result: Option<ObservationStoredResultFollower>,
    idempotency_completion: Option<ObservationIdempotencyCompletionFollower>,
    job_item_report: Option<ObservationJobItemReportFollower>,
}

/// Owned material produced only after the exact UoW cursor exists.
pub(crate) struct ObservationCursorFollowerMaterial {
    projection_membership: Option<(Vec<ProjectionSourceIndexUpdate>, ObservationCommittedCursor)>,
    projection_stale: Option<(AffectedProjectionSet, ObservationCommittedCursor)>,
    outbox: Vec<ObservationOutboxAppendPair>,
    stored_result: Option<StoredObservationResult>,
    idempotency_completion: Option<ObservationIdempotencyCompletionMaterial>,
    job_item_report: Option<ObservationPreparedJobItemReportFollower>,
}
```

```rust
impl ObservationCursorFollowerPlan {
    pub(crate) fn try_new(
        projection_membership: Option<ObservationProjectionMembershipFollower>,
        projection_stale: Option<ObservationProjectionStaleFollower>,
        outbox: Vec<ObservationOutboxFollowerSeed>,
        stored_result: Option<ObservationStoredResultFollower>,
        idempotency_completion: Option<ObservationIdempotencyCompletionFollower>,
        job_item_report: Option<ObservationJobItemReportFollower>,
    ) -> Result<Self, ApplicationError>;

    pub(crate) fn families(&self) -> Vec<ObservationCursorFollowerFamily>;

    fn materialize(
        self,
        committed_cursor: ObservationCommittedCursor,
    ) -> Result<ObservationCursorFollowerMaterial, ApplicationError>;
}
```

The factory canonicalizes no caller-provided string and accepts no `has_*` booleans. It checks nonempty `Some` values, duplicate outbox refs/event refs/snapshot refs, the 258 absolute outbox bound, stored-result/completion co-presence and exact relation, and job/report proof consistency. An all-empty plan is valid when the accepted recorded mutation has no current follower.

`materialize` exact-copies the tagged cursor into membership/stale wrappers and every outbox pair, creates idempotency completion material, and completes the job report fold in memory. It does not call repositories, append rows or commit. If outbox N, completion construction or report fold N fails, all material is dropped and the UoW rolls back without dispatching any record or follower. Stored result and job material do not gain a cursor field; being in this object expresses mandatory post-cursor ordering, not a second truth schema.

### 9.7 `ObservationCommitClass`

```rust
/// Exactly one local cursor namespace derived for an accepted write UoW.
#[derive(Clone, Copy, Debug, Eq, PartialEq)]
pub(crate) enum ObservationCommitClass {
    /// The UoW contains an observation-owned mutation or Observation-required record.
    Observation,
    /// The UoW contains only reference-snapshot primary mutations and H10 records.
    Reference,
}
```

| variant | exact derivation | allocator call | allowed records |
|---|---|---|---|
| `Observation` | at least one actual observation-owned primary mutation; a non-H10 obligation requires this class but cannot create it | `assign_observation_cursor()` exactly once | all current families; H10 may join |
| `Reference` | reference-snapshot primary mutation(s), no observation-owned primary, and every request is H10 | `assign_reference_cursor()` exactly once | H10 only |

```rust
impl ObservationCommitClass {
    pub(crate) fn assign_cursor(
        self,
        uow: &dyn ObservationUnitOfWork,
    ) -> Result<ObservationCommittedCursor, ApplicationError>;

    pub(crate) fn accepts(self, cursor: ObservationCommittedCursor) -> bool;
}
```

There is no public `new`, parser, serde decoder or caller-supplied class. `assign_cursor` statically matches the variant, calls only one allocator method and wraps the result. It never probes both allocators, falls back between them, retags a numeric value, or retries allocation. A second allocator call in the same UoW must be rejected by the UoW implementation; F2's only sanctioned call site is `ObservationRecordAssemblyPlan::assign_and_prepare`.

## 10. `ObservationRecordAssemblyPlan<'a>` object card

### 10.1 schema

```rust
/// Validated pre-cursor plan retaining every mandatory record factory input by borrow.
pub(crate) struct ObservationRecordAssemblyPlan<'a> {
    /// Exact pre-cursor obligations; nonempty and bounded by the compile-time ceiling.
    obligations: Vec<ObservationRecordObligation<'a>>,
    /// Owned expected identities captured before obligations are consumed.
    expected_identities: Vec<ObservationRecordIdentity>,
    /// Accepted write footprint whose mandatory-family multiset matches the obligations.
    footprint: ObservationUowWriteFootprint,
    /// Exact followers to materialize only after the cursor exists.
    followers: ObservationCursorFollowerPlan,
    /// Derived, never caller-selected cursor class.
    commit_class: ObservationCommitClass,
}

/// Fully materialized process-local commit input after every primary stage has succeeded.
pub(crate) struct ObservationPreparedRecordCommit {
    commit_class: ObservationCommitClass,
    committed_cursor: ObservationCommittedCursor,
    records: ObservationRecordAppendBatch,
    followers: ObservationCursorFollowerMaterial,
}
```

### 10.2 factory and validation order

```rust
impl<'a> ObservationRecordAssemblyPlan<'a> {
    pub(crate) fn try_new(
        obligations: Vec<ObservationRecordObligation<'a>>,
        footprint: ObservationUowWriteFootprint,
        followers: ObservationCursorFollowerPlan,
    ) -> Result<Self, ApplicationError>;

    pub(crate) fn commit_class(&self) -> ObservationCommitClass;
    pub(crate) fn obligation_count(&self) -> usize;

    pub(crate) async fn assign_and_prepare(
        self,
        uow: &dyn ObservationUnitOfWork,
        correlation_repository: &dyn CorrelationSignalRepository,
    ) -> Result<ObservationPreparedRecordCommit, ApplicationError>;
}
```

`try_new` executes in this exact order:

1. Reject empty obligations and count above `MAX_OBSERVATION_RECORDS_PER_UOW`.
2. Compare the obligation-family multiset with `footprint.mandatory_record_families`; no missing/extra family or multiplicity is allowed.
3. Call `identity()` on every obligation, reject duplicate typed identities, and store the owned identity vector before obligations can be consumed.
4. Verify the exact cursor-dependent-primary inventory: current cardinality is zero or one; one `SignalRollupAccept` kind requires exactly one corresponding H11 obligation and an Observation-owned primary.
5. Compare `followers.families()` with the footprint follower multiset, including outbox multiplicity.
6. Derive `commit_class` only from the actual primary writes. Reject Reference if any obligation is not H10 or any follower requires an observation-owned branch; permit H10 under Observation.
7. Retain obligations, identities, footprint and followers without constructing records/followers or allocating a cursor.

`assign_and_prepare` executes three explicit phases:

```text
Phase A: validated pre-cursor plan
  -> commit_class.assign_cursor(uow) exactly once
  -> retain the returned tagged value

Phase B: cursor-dependent primary closure
  -> take the optional SignalRollupAccept obligation out of the plan
  -> execute accept_signal with the assigned Observation cursor
  -> construct its H11 record before the local transition is dropped
  -> immediately call borrow-stage save_rollup(&rollup, expected_version, uow)

Phase C: complete in-memory materialization
  -> construct every remaining concrete H record
  -> validate family / identity / cursor against owned expectations
  -> construct nonempty ObservationRecordAppendBatch
  -> materialize all projection/outbox/result/idempotency/job followers
  -> return ObservationPreparedRecordCommit
```

The plan consumes obligations as `(original_index, obligation)` pairs. It removes the optional cursor-dependent H11 pair, materializes and stages it first, places its owned record into that original result slot, then materializes every remaining pair into its own slot. It rejects any empty/overwritten slot before batch construction. The resulting batch therefore preserves validated plan order without treating that order as causality. The H11 domain factory must run while the local transition is alive, and its versioned rollup stage must succeed before any remaining record/follower materialization. Every other domain and follower factory must succeed before the first record or follower repository call. If the rollup stage, obligation N or follower factory N fails, prior owned records/pairs are dropped and the whole UoW is rolled back. An allocated cursor may remain as an invisible gap and is never reused.

`assign_and_prepare` uses the existing `CorrelationSignalRepository`; it does not define a second port. R06.8 must change the frozen consuming `save_rollup(SignalRollupWindow, ...)` surface to `save_rollup(&SignalRollupWindow, ...)`. No generic repository callback or closure is accepted by the plan.

`ObservationPreparedRecordCommit` exposes crate-private consuming access only to the owning service dispatcher. It has no public constructor, serde, clone, rehydrate or commit member. Every primary stage, including the optional cursor-dependent rollup stage, has succeeded before this value exists. The dispatcher may only append the complete record batch and dispatch the complete follower material in §12.1 order; it cannot take one record or follower independently and report partial success.

The plan has no clone, serde, rehydrate, append, save, commit or rollback member. It cannot outlive the borrowed transitions/post-states and cannot be stored in a service field, task queue, report or repository.

## 11. assembled item and append batch objects

### 11.1 `ObservationRecordAppendItem`

```rust
/// One fully validated concrete record ready for its family-specific append port.
pub(crate) enum ObservationRecordAppendItem {
    /// One H1 record.
    IntakeDecision(IntakeDecisionRecord),
    /// One H2 record.
    CorrelationLink(CorrelationLinkRecord),
    /// One H3 record.
    AuditAppend(AuditAppendRecord),
    /// One H4 record.
    HandoffLifecycle(HandoffLifecycleRecord),
    /// One H5 record.
    RetentionChange(RetentionChangeRecord),
    /// One H6 record.
    NoWriteViolation(NoWriteViolationRecord),
    /// One H8 record.
    GapTransition(GapTransitionRecord),
    /// One H9 record.
    PeripheralDelivery(PeripheralDeliveryRecord),
    /// One H10 record.
    ReferenceRefresh(ReferenceRefreshRecord),
    /// One H11 record.
    ProjectionMaintenance(ProjectionMaintenanceRecord),
    /// One H12 record.
    GapScan(GapScanRecord),
    /// One H13 record.
    ReplayExecution(ReplayExecutionRecord),
}
```

| member | exact contract |
|---|---|
| `family(&self) -> ObservationRecordWriteFamily` | total static match |
| `identity(&self) -> ObservationRecordIdentity` | clones only the concrete metadata typed ref and preserves its family tag |
| `committed_cursor(&self) -> Result<ObservationCommittedCursor, ApplicationError>` | requires metadata `Some`; exact-copy return; missing maps to assembly invariant |

The enum owns only already validated domain records. It has no generic constructor, serde, rehydrate, update, delete, correction or body-free-erasing accessor. A match arm may call only the corresponding Step 07 append method. It is not a single-table persistence schema and does not authorize a generic `append_record(BodyFreeRef, bytes)` port.

### 11.2 `ObservationRecordAppendBatch`

```rust
/// Nonempty all-or-rollback set of current records sharing one exact UoW cursor.
pub(crate) struct ObservationRecordAppendBatch {
    /// Derived class used for the single allocator call.
    commit_class: ObservationCommitClass,
    /// Exact tagged value copied into every concrete record metadata.
    committed_cursor: ObservationCommittedCursor,
    /// Complete concrete item set; never a successful subset.
    items: Vec<ObservationRecordAppendItem>,
}
```

```rust
impl ObservationRecordAppendBatch {
    fn try_from_assembled_plan(
        commit_class: ObservationCommitClass,
        committed_cursor: ObservationCommittedCursor,
        expected_identities: &[ObservationRecordIdentity],
        expected_families: &[ObservationRecordWriteFamily],
        items: Vec<ObservationRecordAppendItem>,
    ) -> Result<Self, ApplicationError>;

    pub(crate) fn commit_class(&self) -> ObservationCommitClass;
    pub(crate) fn committed_cursor(&self) -> ObservationCommittedCursor;
    pub(crate) fn len(&self) -> usize;
    pub(crate) fn into_items(self) -> Vec<ObservationRecordAppendItem>;
}
```

The factory is private to the assembly plan. It checks nonempty/bound, class/tag compatibility, exact item count, family multiset, identity set and every item's exact cursor equality. It does not sort records into a claimed causal order. `into_items` transfers ownership once to the application dispatcher; no mutable slice or partial-success marker is exposed.

### 11.3 cursor exact-copy ownership rule

`ObservationCursor`, `ReferenceCursor` and `ObservationCommittedCursor` are small immutable value carriers. Their current contracts are amended to implement value-copy semantics:

```rust
#[derive(Clone, Copy, Debug, Eq, Hash, Ord, PartialEq, PartialOrd)]
pub struct ObservationCursor(u64);

#[derive(Clone, Copy, Debug, Eq, Hash, Ord, PartialEq, PartialOrd)]
pub struct ReferenceCursor(u64);

#[derive(Clone, Copy, Debug, Eq, Hash, PartialEq)]
pub enum ObservationCommittedCursor {
    Observation(ObservationCursor),
    Reference(ReferenceCursor),
}
```

`ObservationCommittedCursor` intentionally has no `Ord`/`PartialOrd`: two variants have no total order. Copying the tagged value into multiple records/outbox/stale/result carriers preserves the same allocation; it is not a second allocator call and creates no new cursor. Aggregate/post-state/transition/record/request/plan/batch types do not inherit `Copy` or `Clone` from this rule.

## 12. authoritative UoW order and Rust ownership closure

### 12.1 exact accepted order

```text
validate typed input and operation context
  -> begin UoW / acquire idempotency reservation where applicable
  -> reserve all exact truth/record/outbox/result refs and one operation time
  -> versioned load + policy evaluation + accepted domain transition/result
  -> retain cursor-independent transition/proof/result and borrow same-UoW post-state
  -> register the exact Job claim commit guard once, where applicable
  -> stage every cursor-independent primary truth/state by borrow
  -> build no-cursor projection-membership, stale-target and follower seeds
  -> build exact write footprint and nonempty record assembly plan
  -> derive commit class from actual accepted writes
  -> call exactly one cursor allocator
  -> execute optional SignalRollupWindow.accept_signal with the Observation cursor
  -> construct that H11 record while its transition is alive
  -> stage the cursor-dependent rollup by borrow with its exact version
  -> construct every remaining concrete record with the exact copied cursor
  -> validate nonempty append batch
  -> materialize every membership/stale/outbox/job/result/idempotency follower
  -> append every concrete record through its family-specific port
  -> record committed source memberships with the same cursor
  -> mark the pre-resolved affected projections stale with the same cursor
  -> append every outbox record/payload pair with the same cursor
  -> stage the already classified Job item and already folded Draft report with independent CAS
  -> save the immutable stored result
  -> complete the idempotency reservation against that exact result
  -> commit, atomically revalidating the once-registered Job claim guard where applicable
```

IDs/time may be reserved before transition because H3 carries its append ref in the transition and all factories require a stable recorded time. A rejected/no-record branch may leave unused process-local generated values; it must not persist them. Cursor allocation occurs only after a nonempty validated plan exists and every cursor-independent primary write has been staged. The only current cursor-dependent primary is the rollup acceptance above; it is staged immediately after its H11 factory succeeds. “Materialize every follower” is process-local construction, not repository dispatch. No record/follower append begins until the complete batch and follower material are valid.

### 12.2 borrow-stage rule

| rule | required implementation behavior | forbidden substitute |
|---|---|---|
| post-state lifetime | request holds `&T` directly or a tagged carrier containing `&T` until factory completion | aggregate `Clone`, raw serialization snapshot |
| versioned save | stage method accepts `&T` or returns an exact typed staged snapshot that preserves all factory fields | consume `T` before record construction |
| read-your-writes | membership planner may inspect the same staged relation through the UoW | reload current committed row as post-state |
| async boundary | owning service keeps aggregate/transition values alive through stage/plan/assembly | move into spawned task/queue or persist request |
| factory | consumes accepted-input tag/metadata seed but borrows truth/state | repository, clock, ID, adapter or policy call inside factory |
| after factory | request borrows end; aggregate remains available for follower construction if needed | mutate aggregate again under the same accepted transition |

This rule does not require every repository to retain a Rust borrow until commit. An adapter may synchronously/within its async call copy validated persistence fields into its UoW staging buffer, but the application-owned aggregate remains alive and is the only post-state supplied to the factory. The adapter may not demand `T: Clone`, hand back an opaque row as replacement truth, or alter fields during mapping.

### 12.3 H6 split

The current semantic port boundary is two operations:

```text
stage_no_write_violation(&NoWriteViolation, expected_version, uow)
append_no_write_violation_record(NoWriteViolationRecord, uow)
```

The first happens before cursor assignment and preserves the borrowed H6 post-state. The second happens only after batch construction. `save_no_write_violation(violation, record, ...)` is historical/affected material and cannot remain in the repaired Step 07 contract. Initial Detected creation still has no H6 request; a P10 Blocked decision alone cannot call either history factory or invent a lifecycle transition.

### 12.4 H10 namespace selection

H10 has three current entry lanes because the current 16-Command catalog includes `RegisterReferenceSnapshot` and `UpdateReferenceSnapshotState`, in addition to reference Consumers and `RefreshReferenceSnapshots` Job.

| H10 UoW footprint | metadata cursor | explanation |
|---|---|---|
| only reference-snapshot primary mutation + H10 + followers | `Reference` | Command/Consumer/Job lane does not itself imply Observation namespace |
| reference snapshot plus any observation-owned primary mutation | `Observation` | one mixed commit uses the Observation namespace |
| H10 plus H1~H6/H8/H9/H11~H13 | `Observation` | another mandatory family makes the UoW Observation-class |
| both tagged variants or caller-selected tag | reject | one UoW cannot expose two commit orders |

H10's concrete factory/rehydration accepts either tagged variant and still rejects missing cursor. The application plan proves which variant is valid for the current UoW. Source version, dual maintenance watermarks, row version, claim fence, JobRunId and timestamp cannot replace the commit cursor.

### 12.5 H12 borrowed post-state

The current H12 factory signature is corrected to:

```rust
pub fn from_accepted(
    accepted: GapScanAcceptedInput<'_>,
    post_state: &GapScanPostState,
    metadata: ObservationRecordMetadata<GapScanRecordRef>,
) -> Result<Self, DomainError>;
```

The application creates one `GapScanPostState` from the exact accepted item result, borrows it for H12 construction, and retains the same values for item/report classification. The factory cannot consume the only post-state, reconstruct it from `ObservationJobPlanItemOutcome`, or load current gap rows. H12 always requires Observation-class metadata even when its target snapshot contains only a Reference watermark; target watermarks are body fields, not the UoW commit class.

## 13. prepared commit dispatch contract

### 13.1 record-family dispatch

`ObservationPreparedRecordCommit` is consumed once by a private dispatcher owned by the same façade implementation. It statically matches each append item and calls only the matching repository method. The dispatcher is not a public service, port, repository or dynamically registered handler.

| append item | exact repository owner | required Step 07 append surface | current F2 rule |
|---|---|---|---|
| H1 `IntakeDecision` | `ObservationIntakeRepository` | `append_intake_decision(record, uow)` | append one immutable H1 row |
| H2 `CorrelationLink` | `CorrelationSignalRepository` | `append_correlation_record(record, uow)` | append one immutable H2 row |
| H3 `AuditAppend` | `AuditEvidenceRepository` | `append_audit_record(record, uow)` | append one immutable H3 row |
| H4 `HandoffLifecycle` | `ReportHandoffRepository` | `append_lifecycle_record(record, uow)` | append one immutable H4 row |
| H5 `RetentionChange` | `RetentionGuardRepository` | `append_retention_record(record, uow)` | append one immutable H5 row |
| H6 `NoWriteViolation` | `RetentionGuardRepository` | `append_no_write_violation_record(record, uow)` | separate from borrow-stage violation save |
| H8 `GapTransition` | `RetentionGuardRepository` | `append_gap_record(record, uow)` | append one immutable H8 row |
| H9 `PeripheralDelivery` | `PeripheralDeliveryRepository` | `append_delivery_record(record, uow)` | append one immutable H9 row |
| H10 `ReferenceRefresh` | `ReferenceMaintenanceRepository` | `append_refresh_record(record, uow)` | accepts the batch's Reference or Observation tag |
| H11 `ProjectionMaintenance` | `ReferenceMaintenanceRepository` | `append_projection_maintenance_record(record, uow)` | includes the cursor-dependent rollup branch |
| H12 `GapScan` | `RetentionGuardRepository` | `append_gap_scan_record(record, uow)` | new affected surface; H12 is not job lifecycle truth |
| H13 `ReplayExecution` | `RetentionGuardRepository` | `append_replay_execution_record(record, uow)` | only per-target coordination transition |

The current Step 07 trait lacks the separate H6 and H12 append methods; that is an explicit affected-definition blocker, not permission to merge record persistence into `save_no_write_violation`, `save_gap`, `save_report` or a generic byte append. The dispatcher never reports item-level append success. A method returning `Ok` means only that its row is staged in the still-open UoW.

### 13.2 follower dispatch

After the complete record batch is staged, follower material is consumed in this fixed repository-call order:

1. `ObservationProjectionStore.record_committed_sources(updates, committed_cursor, uow)` when membership material exists;
2. `ObservationProjectionStore.mark_views_stale(affected, committed_cursor, uow)` when stale material exists;
3. `ObservationOutboxRepository.append(record, payload, uow)` once per prevalidated pair;
4. `ObservationJobExecutionRepository.stage_item_classification(item, item_expected_version, claim tuple, uow)` and then `ObservationJobReportRepository.save_report(report, report_expected_version, uow)` when an item/report follower exists;
5. `ObservationStoredResultRepository.save_result(result, uow)` when a stored result exists;
6. `ObservationIdempotencyRepository.mark_completed(completed_reservation, result_ref, uow)` only after the exact result was staged;
7. `ObservationUnitOfWorkManager.commit(uow)`, which atomically revalidates the already registered claim guard when applicable.

The Step 07 job repository currently has no typed item-classification stage surface and must gain the method in R06.8. Its exact claim tuple and item expected version are both required; a naked fencing token is insufficient. The claim guard was registered before protected in-memory classification and is not registered again in step 4. There is no report-only or completion-only fallback inside this dispatcher.

### 13.3 order semantics

The order above is an application invocation order, not a durable partial-commit allowance. A durable adapter may reorder internal statements only when all of the following remain true: the UoW has one atomic commit; every uniqueness/CAS/fence constraint is checked; no staged row is externally visible before commit; injected failure at any later stage leaves no visible subset; and fake call tracing still reports the semantic phase order. Record order inside a batch is canonical input order for deterministic dispatch only. It does not establish causality between records sharing one cursor.

## 14. rollback and failure-injection matrix

### 14.1 pre-commit failure behavior

| injection point | expected error owner | writes that may be staged in the UoW | required visible result after known rollback | forbidden recovery |
|---|---|---|---|---|
| input/context/ID/time validation | protocol/application validation | none | none | enter UoW or mint durable rejection implicitly |
| idempotency `Replay/Conflict/InFlight` | idempotency result/error | reservation read only; incoming UoW rolled back | original replay only for `Replay`; no new cursor/record/follower | invoke F2 assembler or rerun accepted mutation |
| versioned load/policy/domain rejection | domain/application | reservation may be staged only where formal rejection is intentionally durable | no accepted truth, cursor, H record or success follower | turn rejection into append-only success history |
| cursor-independent primary stage/CAS mapping | repository/application | earlier primary candidates may be staged | no visible primary, record, follower or completed reservation | retain a partial primary subset |
| footprint/obligation/follower validation | `RecordAssemblyInvariantViolation` | cursor-independent primaries may be staged | no visible write; no cursor allocated | derive expectation from actual obligations to make validation pass |
| cursor allocation | `CursorAllocationFailed` | primary candidates staged | no visible write | call the other allocator or reuse a prior value |
| cursor-dependent `accept_signal` / H11 factory | domain or record assembly | cursor-independent primaries staged; cursor allocated | no visible write; allocated value may be an invisible gap | commit signal without rollup/H11 or rerun with a second cursor |
| cursor-dependent `save_rollup` CAS/stage | repository/application | same as above plus in-memory rollup candidate | no visible write | reload/clone rollup and reconstruct H11 |
| any remaining H factory / append-batch validation | domain or record assembly | all primary candidates staged | no visible write | drop failed record and continue |
| protocol snapshot/outbox/idempotency/report-fold materialization | application/protocol/domain owner | all primary candidates staged; no record/follower repository dispatch yet | no visible write | serialize from Debug/current truth or fold report after append begins |
| record append N | repository/application | all primaries and records `0..N` staged | no visible write | return partial success or upsert duplicate ref |
| membership/stale/outbox pair N | repository/application | primaries, all records and earlier followers staged | no visible write | omit failed follower or publish directly |
| item classification/report CAS | `OptimisticConflict`, `ExecutionFenceConflict` or `Job(_)` | all preceding local material staged | no visible write; stale writer cannot write a failure outcome | register a second guard or classify from report summary |
| stored result save | repository/application | all preceding local material staged | no visible write; reservation remains as before the UoW | complete reservation without a result |
| idempotency completion | repository/application | exact result and all preceding material staged | no visible write | return fresh success with Reserved row |
| known commit failure + successful rollback | `CommitFailed` | any/all writes staged | no visible primary, record, membership, stale marker, outbox, item/report, result or completion | retry blindly with generated refs/cursor |
| rollback failure before known commit | `RollbackFailed` | outcome cannot be proven by application memory | no success may be claimed | infer rollback from cursor gap or absence of one row |

Every fake and durable-like adapter must expose an injection cut for each repository phase above, including record N and outbox pair N, without exposing provider-specific error text through `ApplicationError`. “Visible result” includes point reads, list/page results, unique-index conflicts, projection upper positions, pending publisher scans, idempotency replay and job resume reads.

### 14.2 commit outcome unknown

`CommitOutcomeUnknown` is not a known rollback. The service returns no fresh success and does not release/reacquire a Job claim or rerun the accepted mutation. Current Step 07 has no formal transaction-status probe, so `ObservationTransactionRef`, cursor gaps, local memory, missing outbox, clock time or one missing row cannot establish the outcome. Recovery is read-only probing of the exact idempotency scope/result, primary identities, record refs, outbox refs and item/report identities defined by the owning flow; unresolved disagreement remains manual intervention. A future transaction-status probe requires Step 07/11 design and fake/durable parity before use.

## 15. fake / durable parity contract

| semantic surface | fake requirement | durable/durable-like requirement | parity assertion |
|---|---|---|---|
| transaction staging | private staged state isolated by UoW identity | database transaction or equivalent isolated write set | no read outside UoW observes staged rows |
| read-your-writes | planner and same-UoW readers see staged primary relations | transaction-local reads see the same candidate state | identical membership/follower plan for the same accepted input |
| cursor allocation | independent monotonic Observation/Reference allocators; reject a second call per UoW | independent durable namespaces/sequences; same rejection contract | exactly one tagged value copied into every record/cursor-bearing follower |
| rollback cursor gap | allocated value may be consumed but never visible as a commit and never reused | sequence gap is allowed; no rollback reuse | later successful cursor may skip values without exposing failed rows |
| append-only identity | typed family + ref unique; no update/upsert | PK/family constraints reject duplicate | duplicate fails whole UoW with no overwrite |
| primary CAS | exact loaded repository version | atomic compare-and-set | one winner; loser has no records/followers |
| item/report CAS | independent item and report versions plus exact registered claim tuple | row CAS plus commit-time claim/fence predicate | stale authority produces zero visible write |
| record/follower atomicity | staged maps/lists publish only on commit | one transaction covers all stores in this local boundary | injected failure leaves no visible subset |
| result-before-complete | fake refuses completion unless exact staged result relation exists | foreign key/transactional invariant or equivalent validation | Completed always resolves one exact immutable result |
| unknown commit | explicit injected unknown state; never auto-rollback | driver/transaction ambiguity maps to `CommitOutcomeUnknown` | both require probe/manual, never blind retry |
| canonical order trace | records semantic phase calls without changing behavior | adapter test harness records equivalent phase boundaries | phase assertions do not become business truth or production evidence |
| H10 namespace | Reference-only and mixed fixtures produce different tags as specified | same derived class and allocator choice | no untagged numeric comparison or cross-namespace `Ord` |

A fake that uses direct global-map writes, returns default success, allocates both cursors, bypasses typed append methods, lacks Nth-write injection, ignores claim/CAS, reconstructs post-state from rows, or auto-resolves unknown commit is non-conforming. Durable support is not claimed by this design document; the matrix defines later implementation and test obligations only.

## 16. planned verification inventory

All rows are `planned / not_run`. They define test intent and do not claim an implementation, test result, run id, evidence alias or acceptance signature.

| test cut | required cases | expected invariant | status |
|---|---|---|---|
| family dispatch totality | H1~H6/H8~H13 once each; H7 absent | exact repository method, no generic append | `planned/not_run` |
| writer registry | every §4.3 operation/lane allow and deny branch | origin allowlist never authorizes unrelated operation | `planned/not_run` |
| H13 blocker | `DefineReplayScope` versus `CoordinateObservationReplay` | first cannot mint H13; second requires per-target transition | `planned/not_run` |
| footprint independence | missing/extra/repeated accepted effect, obligation and follower multiplicity | self-derived expectation is rejected by review/test helper API shape | `planned/not_run` |
| cardinality | 0, 1, 258, 259 records; exact narrower operation counts | empty/259 reject before cursor; no truncation | `planned/not_run` |
| identity ownership | duplicate same family/ref and equal inner bytes across different family tags | first rejects; second remains typed-distinct | `planned/not_run` |
| commit class | Observation-only, Reference-only H10, mixed, Reference + non-H10, no primary | one expected tag or finite rejection | `planned/not_run` |
| exact-once allocator | success and every post-allocation failure | one allocator call; no fallback/second namespace/reuse | `planned/not_run` |
| H11 rollup | accepted, duplicate/no-transition, wrong cursor, save conflict, H11 factory failure | mutate/factory/stage order and whole-UoW rollback | `planned/not_run` |
| H6 split | existing violation transition, initial Detected, P10 Blocked-only | only accepted lifecycle uses separate stage + append | `planned/not_run` |
| H12 borrow | item result/post-state/report fold exact field copy and factory failure | one post-state borrowed; no consume/reload/inferred H8 | `planned/not_run` |
| outbox materialization | all 12 payload variants, wrong snapshot ref, Nth encode failure, 259 pairs | exact tagged cursor/bytes/pair; no dispatch on materialization failure | `planned/not_run` |
| job guard | once-register, stale at commit, item CAS, report CAS, report fold failure | no second registration; no stale-writer failure outcome | `planned/not_run` |
| follower order | membership, stale, N outbox, item/report, result, completion | exact semantic call trace and atomic rollback | `planned/not_run` |
| failure injection | every row in §14.1 for first/middle/last repeated write | no visible partial state after known rollback | `planned/not_run` |
| unknown outcome | result present/absent/disagreeing probes | no automatic retry or success inference | `planned/not_run` |
| fake/durable parity | same fixtures and injected cuts over both adapter suites | same result/error/visibility/cursor/claim semantics | `planned/not_run` |
| ownership compile cuts | request consumed after owned identity snapshot; aggregate/transition non-Clone | no dangling borrow or clone workaround | `planned/not_run` |
| body-free scan | raw body, locator, credential, provider payload/message, real run id, evidence alias, verdict/signoff | absent from helper/error/debug/persisted record material | `planned/not_run` |

## 17. affected-definition register

“Open controlled” means F2 has fixed the current semantic requirement but has not edited the frozen downstream owner. It is not an implementation defect waiver.

| ID | owner / affected use | observed drift | required correction | status / timing |
|---|---|---|---|---|
| `R06-F2-AFFECT-02-H13` | formal `02` §7.2 and later formal consistency audit | `DefineReplayScope -> ReplayExecutionRecord` conflicts with per-target H13 factory | decide explicit-no-record versus a separately designed scope lifecycle record; until then only `CoordinateObservationReplay` writes H13 | `open_controlled_upstream`; before formal `03` reassembly |
| `R06-F2-AFFECT-04-FILE-OWNER` | Step 04 file layout | historical `domain/history.rs` obscures logical `domain::records`; application helper file not audited | R06.8 choose physical files without duplicating owners; F2 helper remains `application::unit_of_work` | `open_controlled`; R06.8 |
| `R06-F2-AFFECT-06-CONTRACTS-CURSOR` | contracts owner | tagged cursor value needs Copy but no cross-namespace order | derive Copy on both concrete cursors/tagged enum; omit Ord/PartialOrd on tagged enum | `resolved_in_F2_owner_addendum` |
| `R06-F2-AFFECT-06-RECORD-METADATA` | records owner H1~H13 | old cards require Observation cursor for all writers and H12 consumes post-state | require committed tagged cursor; H10 permits Reference/Observation per plan; H12 borrows `&GapScanPostState`; factory origin corrections H4/H9/H10/H11 | `resolved_in_F2_owner_addendum` |
| `R06-F2-AFFECT-06-SERVICE-ERROR` | application service/error owner | no prepared-commit handoff or assembly error wrapper | add private helper use and `RecordAssemblyInvariantViolation(RecordAssemblyFailureKind)`; no new façade/repository owner | `resolved_in_F2_owner_addendum` |
| `R06-F2-AFFECT-06-JOB-BOUNDARY` | job/boundary owner | item/report fold and cursor-dependent rollup order not integrated | register claim once before protected classification; materialize fold before append; commit revalidates; rollup stage after cursor | `resolved_in_F2_owner_addendum` |
| `R06-F2-AFFECT-07-ID-MINT` | Step 07 `IdGeneratorPort` | generic `new_history_record_ref` cannot preserve family | replace with 12 exact H1~H6/H8~H13 methods; no H7 mint | `open_controlled_downstream`; R06.8 |
| `R06-F2-AFFECT-07-BORROW-STAGE` | all Step 07 primary save methods | consuming saves can destroy same-UoW post-state before factory | accept `&T` or exact typed staged snapshot; specifically borrow `save_rollup`; no aggregate Clone/reload | `open_controlled_downstream`; R06.8 |
| `R06-F2-AFFECT-07-H6-H12` | `RetentionGuardRepository` | H6 save merges record; H12 has store but no append port | split H6 stage/append and add `append_gap_scan_record`; retain family-specific append | `open_controlled_downstream`; R06.8 |
| `R06-F2-AFFECT-07-UOW` | `ObservationUnitOfWork` | frozen order stages record before cursor and does not reject any second namespace call | stage cursor-independent primary, assign exactly one derived cursor, then H11/records/followers; reject second allocator call | `open_controlled_downstream`; R06.8 |
| `R06-F2-AFFECT-07-JOB-ITEM` | `ObservationJobExecutionRepository` | no typed item classification stage with row version + exact claim tuple | add `stage_item_classification`; preserve once-registered commit guard and independent report CAS | `open_controlled_downstream`; R06.8 |
| `R06-F2-AFFECT-08-OUTBOX-ENCODER` | Step 08 outbound contracts | no callable deterministic typed encoder; stale `ReferenceSnapshotRef` use | expose static typed snapshot encoder and canonical `ReferenceSnapshotStateRef`; exact cursor is encoded before outbox construction | `open_controlled_downstream`; after R06.8 |
| `R06-F2-AFFECT-09-FLOW-ORDER` | Step 09 all record-bearing flows | record-before-cursor, generic mint and incomplete H12/job paths | apply §12/§13 per concrete flow; explicit-no-record/duplicate/query/finalize paths bypass F2 | `open_controlled_downstream`; after Step 07 repair |
| `R06-F2-AFFECT-11-ATOMICITY` | Step 11 stores/UoW | no complete 12-family append/parity/order contract | family PK/tagged cursor, H12 append, one UoW, Nth-write rollback, unknown outcome and invisible cursor gaps | `open_controlled_downstream`; after Step 07 repair |
| `R06-F2-AFFECT-13-REENTRY` | Step 13 | commit unknown/reentry not tied to exact prepared set | probe exact identities; no blind rerun, cursor reuse, claim release/reacquire or partial completion | `open_controlled_downstream`; affected review |
| `R06-F2-AFFECT-16-TESTS` | Step 16 | no full assembly/failure/parity matrix | consume §16 as planned cuts and add fake/durable-like suites; do not predeclare evidence | `open_controlled_downstream`; affected review |

## 18. F2 module stop review

### 18.1 closure audit

| review item | F2 conclusion |
|---|---|
| capability -> object | pass design-only; reservation, obligation, footprint, cursor class, primary/follower materialization, batch and dispatcher each have one owner |
| object -> field/function/state | pass design-only; exact schemas, factories, members, finite variants, source and prohibitions are specified |
| H1~H13 coverage | pass current phase; H1~H6/H8~H13 total, H7 explicitly absent, no generic record family |
| origin versus operation authority | pass; persisted origin is a coarse allowlist and current writer registry is the stricter gate |
| one-cursor invariant | pass; class derives only from accepted primary mutations; one allocator call; H10 mixed/reference-only rules explicit |
| Rust ownership | pass design-only; owned typed identity snapshot, borrowed aggregate/post-state, local H11 transition closure, no Clone/reload workaround |
| cursor-dependent primary | pass design-only; H11 rollup member/factory/borrow-stage happen after cursor and before other record/follower dispatch |
| complete-before-dispatch | pass design-only; all records and follower objects/folds validate before first record append, except primary stages that are intentionally transactional |
| rollback / unknown | pass design-only; known rollback has no visible subset; unknown outcome is not fabricated as rollback or success |
| fake/durable parity | pass as contract only; implementation and test execution remain absent |
| no business truth | pass; helpers project observation/audit/evidence linkage only and never write source/business truth or external acceptance |
| direct upstream blocker | `R06.6-F2-H13-UPSTREAM=open_controlled`; conservative executable boundary is fixed, but formal `02` correction remains required |
| downstream affected blocker | `R06-F-AFFECT-UOW-01=open_controlled_downstream`; expanded exact entries are in §17 and must be consumed in R06.8+ |
| overall Step 06 blocker | `03-RPR-S06-GRANULARITY=open`; F2 completion does not complete R06.7/R06.8 or Step 06 |
| verification truthfulness | all tests `planned/not_run`; no implementation commit, run id, evidence alias, acceptance signature or result claimed |

### 18.2 stop gate

| gate | status | next action |
|---|---|---|
| F2 content | `pass_design_only` | retain this file as F2 current definition owner |
| F2 owner backfill | `pass_design_only` | four Step 06 owner addenda and control files synchronized |
| current pointer | `R06.6-F2_done_waiting_user_before_R06.7` | stop and wait for explicit user confirmation |
| R06.7 authorization | `not_granted` | do not read/write R06.7 working sections yet |
| formal/downstream | `frozen` | no formal `03`, Step 07~19, `04`, implementation ledger or code write |
| commit | `not_required` | user did not request a commit |

F2 stops here. After explicit confirmation, the next module is `R06.7 runtime / infra / api / worker / jobs stable carrier`. Its first reading set is the Step 06 SOP/writing standard, this file's §§13~18, the Step 06 main controller §§6.7 and 7.8, `03_ddd_step_06_contracts_carriers.md` §19.7, the E façade dependency bundles, and frozen Step 07/08/09/14 entry/runtime use-sites for affected diagnosis only. R06.8, Step 07 repair, formal `03`, every `04` file and implementation code remain out of scope until their own gates.
