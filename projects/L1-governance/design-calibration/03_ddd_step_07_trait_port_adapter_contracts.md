# Step 7. 逐模块定义 Trait / Port / Adapter 契约

### 1. Step 状态

- 状态:[x] 已完成;可进入 Step 8 API / Command / Query / Event / Job 协议契约
- 对应 SOP:`standards/document/详细设计讨论流程_SOP.md` Step 7
- 回填章节:`03-详细设计.md` §5 模块实现契约中的 Trait / Port / Adapter 契约 / §6 全局 Trait 索引

### 2. 本步目标

在 Step 5 固定的七个实现模块和 Step 6 已闭合的对象契约基础上,定义 `L1-governance` 的 application port、repository、resolver、publisher、handoff、result store、UnitOfWork、Clock 和 IdGenerator 契约。

本 Step 的目标不是定义 protocol DTO 或 persistence table,而是闭合实现者最容易遇到的接缝问题:

- generated id 从哪个 port 来。
- repository 读取面是否返回 transition 所需对象和 optimistic version。
- projection stale / affected views 是否有正式读取面。
- reference refresh 是否有 versioned read / list scope。
- outbox publisher 是否读取 stored payload snapshot,而不是现查 current truth。
- duplicate command / event / job 是否有 stored result / receipt / report surface。
- external resolver / handoff / export 是否只返回 body-free ref、summary、snapshot、package ref 或 receipt ref。

### 3. 本步输入

| 输入 | 用途 |
|---|---|
| `03_ddd_step_05_module_contracts.md` | 七模块主轴、依赖方向和 port 归属门禁 |
| `03_ddd_step_06_object_contracts.md` | 对象、字段、state、factory、record、view/report、entry object 和待闭合事项 |
| `02_hld_step_07_api_interface_skeleton.md` | Command / Query / Consumer / Outbound Event / Job 骨架 |
| `02_hld_step_08_processing_flows.md` | command / query / consumer / job 处理流族和 no-write / no-repair 边界 |
| `02_hld_step_09_state_machine.md` | 状态组、触发方和 forbidden transition |
| `01-架构设计.md` §8 / §9 | 数据所有权、一致性、通信方式和非 sibling 编译依赖裁剪 |
| `standards/document/设计真相源闭环与可落码性标准.md` | version 来源、affected projection view、outbox payload、duplicate result surface 等闭环规则 |

### 4. 分批写入计划

| 批次 | 写入内容 | 状态 |
|---|---|---|
| 7.0 | Step 7 框架、输入、模块归属、共享 helper 和写入门禁 | [x] 已完成 |
| 7.1 | `application` 基础 port: UnitOfWork、Clock、IdGenerator、versioned page helper | [x] 已完成 |
| 7.2 | `application` truth repository port: context / input / gate / decision / approval / policy / control / nonconformity | [x] 已完成 |
| 7.3 | append-only / maintenance repository port: trace、audit、history、projection、reference、outbox、result | [x] 已完成 |
| 7.4 | external seam port: source resolver、publisher、handoff、archive、external GRC、adapter availability | [x] 已完成 |
| 7.5 | `infra` adapter implementation contract and `api` / `worker` / `jobs` entry restrictions | [x] 已完成 |
| 7.6 | 模块停审、跨模块接缝审计、Step 6 open item closure、回填草稿 | [x] 已完成 |

### 5. SOP 问题回答

1. 哪些模块需要定义 trait / port?

   回答:`application` 是唯一正式定义 repository、resolver、publisher、handoff、UnitOfWork、Clock、IdGenerator、idempotency 和 result store trait 的模块。`infra` 只实现这些 trait。`api`、`worker`、`jobs` 只调用 application service / facade,不得直接定义或调用 repository port。`contracts` 和 `domain` 不定义 infrastructure port。

2. 哪些模块负责实现这些 trait / port?

   回答:`infra` 负责实现所有 application port。实现可分布在 `repositories.rs`、`projection_stores.rs`、`reference_stores.rs`、`outbox_store.rs`、`idempotency_store.rs`、`source_resolvers.rs`、`publishers.rs`、`handoff_adapters.rs`、`external_grc_adapters.rs`、`clock_id.rs` 和 `runtime_builder.rs`。

3. 哪些 capability 需要接缝?

   回答:所有 command truth mutation、query read surface、consumer snapshot/stale marker、outbox publish、projection rebuild、reference refresh、reconciliation、handoff/export 和 duplicate replay 都需要正式 port。domain object transition 不接触 port。

4. 每个 trait / port 承接 Step 6 的哪个对象能力或字段 / 状态来源?

   回答:§8~§12 的 port 表逐项列出承接对象。核心映射为:domain truth repository 承接 truth object;trace/audit/history repository 承接 append-only record;projection repository 承接 `DerivedGovernanceViewState` 和 public view/report;reference repository 承接 `ReferenceResolutionState` 与 snapshot;outbox repository 承接 `GovernanceOutboxRecord`、payload snapshot ref 和 publication state;result repository 承接 `StoredGovernanceOperationResult`。

5. repository、outbox、projection、external client 的函数签名是什么?

   回答:§8~§12 给出 Rust trait 片段。所有写入函数必须携带 `&dyn GovernanceUnitOfWork` 和 `expected_version` 或 append-only 语义;所有需要 optimistic update 的对象必须先通过 `get_*_with_version(...)` 读取。

6. 每个读取函数是否覆盖后续 DTO / flow / state matrix / projection stale 所需读取面?

   回答:是。Step 7 明确了 `get_with_version`、`list_by_scope`、`find_active_*`、`list_views_affected_by_*`、`list_reference_states`、`list_pending_with_payload` 和 stored result `get`。

7. 每个写入函数的 expected_version、UnitOfWork、幂等、append-only record 或 sidecar truth 口径是否闭合?

   回答:是。truth save 和 maintenance marker 使用 `expected_version`;trace/history/audit append 是 append-only;outbox marker 使用 pending record version;idempotency result save/get 有独立 repository;consumer/job duplicate 不重新执行 mutation。

### 6. 模块级 port 归属总览

| 模块 | 是否定义 port | 是否实现 port | 是否可直接访问 port | 结论 |
|---|---|---|---|---|
| `contracts` | 否 | 否 | 否 | 只定义 public DTO / ref / state / reason / view / event / job |
| `domain` | 否 | 否 | 否 | 只定义 object / policy / invariant;不得读取 repository 或 external adapter |
| `application` | 是 | 否 | 是 | 定义并调用所有 port;负责 transaction、idempotency 和 flow orchestration |
| `infra` | 否 | 是 | 否 | 实现 application port,由 runtime builder 注入 |
| `api` | 否 | 否 | 否 | 只解析 command/query DTO 并调用 application service |
| `worker` | 否 | 否 | 否 | 只解析 event/outbox/projection loop item 并调用 application service |
| `jobs` | 否 | 否 | 否 | 只解析 job DTO 并调用 application job service |

### 7. Shared application port helper

以下 helper 属于 `crates/application/src/ports.rs` 或 `unit_of_work.rs` 的 application-local surface。它们不进入 public protocol DTO;若 Step 8 需要 public page / marker,必须在 contracts 层另行定义。

```rust
/// Stable application-local reference for a write transaction.
pub struct GovernanceTransactionRef(pub String);

/// Optimistic version attached to a persisted Governance object.
pub struct GovernanceVersion(pub u64);

/// Cursor used by repository pagination inside application ports.
pub struct GovernanceRepositoryCursor(pub String);

/// Page request used by application repositories.
pub struct GovernanceRepositoryPage {
    /// Opaque cursor from a previous repository page.
    pub cursor: Option<GovernanceRepositoryCursor>,
    /// Maximum number of items requested by the caller.
    pub limit: u32,
}

/// A persisted object with its optimistic version.
pub struct Versioned<T> {
    /// Persisted object value.
    pub value: T,
    /// Version to pass into the next optimistic write.
    pub version: GovernanceVersion,
}

/// A repository page with opaque pagination cursor.
pub struct Page<T> {
    /// Items returned by the repository.
    pub items: Vec<T>,
    /// Cursor for the next page.
    pub next_cursor: Option<GovernanceRepositoryCursor>,
}

/// A body-free union ref for AIIA and SoA conclusion query lists.
pub enum ComplianceConclusionVersionedRef {
    /// Versioned AIIA conclusion reference.
    Aiia {
        /// AIIA conclusion reference.
        conclusion_ref: AIIAConclusionRef,
        /// Optimistic version for the conclusion.
        version: GovernanceVersion,
    },
    /// Versioned SoA conclusion reference.
    Soa {
        /// SoA conclusion reference.
        conclusion_ref: SoAConclusionRef,
        /// Optimistic version for the conclusion.
        version: GovernanceVersion,
    },
}

/// Application-local scope used by reference repository refresh scans.
pub enum ExternalContextRefreshScope {
    /// Refresh only explicitly supplied external Governance references.
    ExplicitRefs(ExternalGovernanceReferenceRefSet),
    /// Refresh references whose current local state is not healthy.
    UnhealthyReferences,
    /// Refresh references indexed under one Governance scope.
    GovernanceScope(GovernanceScopeRef),
}

/// Transaction handle passed to repository writes.
pub trait GovernanceUnitOfWork {
    /// Returns a stable transaction reference for logging and adapter assertions.
    fn transaction_ref(&self) -> GovernanceTransactionRef;

    /// Assigns the accepted truth boundary cursor after truth writes are staged in this UoW.
    fn assign_truth_change_cursor(&self) -> Result<GovernanceTruthCursor, ApplicationError>;

    /// Assigns a committed reference marker cursor after reference/snapshot writes are staged in this UoW.
    fn assign_reference_change_cursor(&self) -> Result<GovernanceTruthCursor, ApplicationError>;
}

/// Creates and commits Governance write transactions.
pub trait GovernanceUnitOfWorkManager {
    /// Begins a new Governance write transaction.
    async fn begin(&self) -> Result<Box<dyn GovernanceUnitOfWork>, ApplicationError>;

    /// Commits a previously opened transaction.
    async fn commit(&self, uow: Box<dyn GovernanceUnitOfWork>) -> Result<(), ApplicationError>;

    /// Rolls a transaction back after a failed application flow.
    async fn rollback(&self, uow: Box<dyn GovernanceUnitOfWork>) -> Result<(), ApplicationError>;
}
```

| helper | 作用 | 闭环口径 |
|---|---|---|
| `GovernanceTransactionRef` | UoW 事务引用 | application-local opaque ref;用于日志、fake adapter 断言和 error context;不得进入 public protocol truth |
| `GovernanceVersion` | truth / marker optimistic update token | 只能来自 `get_*_with_version` 或 `list_*_with_version`;不得用 cursor 替代 |
| `GovernanceRepositoryCursor` | repository page cursor | 只表达列表位置;不得当 version 或 truth cursor |
| `Versioned<T>` | object + version 配对读取面 | 所有 mutation 前置读取必须使用 |
| `ComplianceConclusionVersionedRef` | AIIA / SoA union list helper | query / projection / approval flow 可先列 ref+version,再按 branch 读取具体 object;不得把 AIIA 和 SoA 合并为一个 domain object |
| `ExternalContextRefreshScope` | reference refresh repository scope helper | application-local helper;Step 8 若暴露 public job request 必须定义对应 DTO;不得由实现全表猜测或临时拼 source filter |
| `GovernanceTruthChangeSubjectMapper` | accepted truth subject helper | 从 typed truth ref 映射同源的 trace / audit / outbox subject refs;command service 不拼 `ExternalSourceRef` 字符串 |
| `GovernanceReferenceMarkerSubjectMapper` | reference marker trace subject helper | 从 `ExternalGovernanceReferenceRef` 映射 consumer/reference-only marker trace subject;consumer service / fake / durable 不拼 `ExternalSourceRef` 字符串 |
| `GovernanceUnitOfWork` | transaction write boundary | truth、trace、audit、outbox、projection stale、result 必须同事务提交;`assign_truth_change_cursor()` 是 command accepted path 的唯一 truth cursor 来源;`assign_reference_change_cursor()` 是 consumer/reference-refresh reference-only stale marker 的唯一 cursor 来源 |

| UoW cursor rule | 正式口径 |
|---|---|
| call timing | accepted command 必须先把所有 changed truth save/stage 到同一 UoW,再调用 `assign_truth_change_cursor()` |
| visibility | 分配的 cursor 只在 UoW commit 后成为 committed truth cursor;rollback 不得泄露 cursor |
| multiplicity | 每个 accepted command transaction 调用一次并复用返回值;同一 command 的多个 `GovernanceTruthChange` 使用同一个 boundary cursor |
| fake / durable parity | in-memory fake 必须提供单调、稳定、可断言的等价 cursor;durable adapter 可由 store / transaction sequence 分配,但不得由 service 拼接 |
| forbidden source | 不得用 `GovernanceRepositoryCursor`、`GovernanceVersion`、timestamp、id generator、trace id、idempotency digest 或 hard-coded string 代替 |

| UoW reference cursor rule | 正式口径 |
|---|---|
| call timing | inbound consumer / reference refresh 必须先把 `ReferenceResolutionState` 和对应 typed snapshot/ref save/stage 到同一 UoW,再调用 `assign_reference_change_cursor()` |
| visibility | 分配的 cursor 只在 UoW commit 后成为 committed reference marker cursor;rollback 不得泄露 cursor |
| multiplicity | 每个 reference-only consumer/refresh transaction 调用一次并复用返回值;同一 transaction 的 affected projection stale marker 和 optional marker trace 使用同一个 cursor |
| fake / durable parity | in-memory fake 必须提供单调、稳定、可断言的等价 cursor;durable adapter 可由 store / transaction sequence 分配,但不得由 service 拼接 |
| forbidden source | 不得用 source version、snapshot version、event dedup key、idempotency digest、page cursor、timestamp、trace id、id generator 或 hard-coded string 代替 |
| not a truth change | reference cursor 不创建 `GovernanceTruthChange`,不生成 outbox payload,不表示 core Governance truth accepted |

#### 7.1 Accepted truth change subject helper

`GovernanceTruthChange.subject_ref`、`GovernanceTraceRecord.subject_ref` 和 `GovernanceAuditTrail.subject_ref` 必须由 application-local helper 从已保存 / 已加载的 typed truth ref 映射。Helper 为每个 truth ref 生成一个 canonical subject key,并把同一个 key 分别包装成 outbox、trace 和 audit subject ref。Command service、repository adapter 和 fake runtime 不得自行拼接 `ExternalSourceRef` 字符串。

```rust
/// Accepted subject refs that share one canonical Governance subject key.
pub struct GovernanceAcceptedSubjectRefs {
    pub outbox_subject_ref: GovernanceOutboxSubjectRef,
    pub trace_subject_ref: GovernanceTraceSubjectRef,
    pub audit_subject_ref: GovernanceAuditSubjectRef,
}

/// Maps typed Governance truth refs to body-free trace/audit/outbox subjects.
pub trait GovernanceTruthChangeSubjectMapper {
    fn context_subjects(&self, context_ref: GovernanceContextRef) -> GovernanceAcceptedSubjectRefs;
    fn input_subjects(&self, input_ref: GovernanceInputRef) -> GovernanceAcceptedSubjectRefs;
    fn gate_subjects(&self, gate_ref: GateRef) -> GovernanceAcceptedSubjectRefs;
    fn decision_subjects(&self, decision_ref: GovernanceDecisionRef) -> GovernanceAcceptedSubjectRefs;
    fn responsibility_subjects(&self, responsibility_ref: ApprovalResponsibilityRef) -> GovernanceAcceptedSubjectRefs;
    fn policy_fact_subjects(&self, policy_fact_ref: PolicyEffectiveFactRef) -> GovernanceAcceptedSubjectRefs;
    fn shared_rule_set_subjects(&self, rule_set_ref: SharedRuleSetRef) -> GovernanceAcceptedSubjectRefs;
    fn policy_conflict_subjects(&self, conflict_ref: PolicyConflictRef) -> GovernanceAcceptedSubjectRefs;
    fn control_applicability_subjects(&self, applicability_ref: ControlApplicabilityRef) -> GovernanceAcceptedSubjectRefs;
    fn control_review_subjects(&self, review_ref: ControlReviewRef) -> GovernanceAcceptedSubjectRefs;
    fn compliance_conclusion_subjects(&self, conclusion_ref: ComplianceConclusionRef) -> GovernanceAcceptedSubjectRefs;
    fn nonconformity_subjects(&self, nonconformity_ref: NonconformityRef) -> GovernanceAcceptedSubjectRefs;
}
```

| helper rule | 正式口径 |
|---|---|
| input source | 只能接收 typed truth `to_ref()` 结果或 loaded relation ref |
| canonical key | helper 内部使用 `governance:<truth-kind>:<id>` 形成 canonical `ExternalSourceRef`;`<id>` 是 typed ref 内部 id newtype 的完整 opaque value,即使包含分隔符也作为剩余整体处理,业务逻辑不得解析 |
| output | 返回 `GovernanceAcceptedSubjectRefs`;三个 subject ref 必须包装同一个 canonical key |
| trace/outbox/audit relation | `GovernanceTruthChange.subject_ref = refs.outbox_subject_ref`;`GovernanceTraceRecord::from_truth_change(..., refs.trace_subject_ref, ...)`;accepted flow 必须先用 `GovernanceAuditHistoryRepository.get_audit_trail_by_subject_with_version(refs.audit_subject_ref)` 读取既有 trail;若不存在才用 `GovernanceAuditTrail.start_for_subject(new_audit_trail_id(), refs.audit_subject_ref)` 创建 |
| fake / durable parity | fake runtime 和 durable adapter 必须按同一 canonical key table 生成 subject refs,测试可直接断言具体 key |
| forbidden | 不得在 service / adapter 中解析 ref 字符串、拼接 route path、使用 title/source body、event topic、trace id 或 cursor 代替 subject |

| typed truth ref | canonical subject key |
|---|---|
| `GovernanceContextRef { context_id }` | `governance:context:<context_id>` |
| `GovernanceInputRef { input_id }` | `governance:input:<input_id>` |
| `GateRef { gate_id }` | `governance:gate:<gate_id>` |
| `GovernanceDecisionRef { decision_id }` | `governance:decision:<decision_id>` |
| `ApprovalResponsibilityRef { responsibility_id }` | `governance:responsibility:<responsibility_id>` |
| `PolicyEffectiveFactRef { policy_fact_id }` | `governance:policy-fact:<policy_fact_id>` |
| `SharedRuleSetRef { rule_set_id }` | `governance:shared-rule-set:<rule_set_id>` |
| `PolicyConflictRef { conflict_id }` | `governance:policy-conflict:<conflict_id>` |
| `ControlApplicabilityRef { applicability_id }` | `governance:control-applicability:<applicability_id>` |
| `ComplianceConclusionRef::AIIA(conclusion_ref)` | `governance:compliance-conclusion:aiia:<aiia_conclusion_id>` |
| `ComplianceConclusionRef::SoA(conclusion_ref)` | `governance:compliance-conclusion:soa:<soa_conclusion_id>` |
| `NonconformityRef { nonconformity_id }` | `governance:nonconformity:<nonconformity_id>` |

#### 7.2 Consumer/reference marker trace subject helper

Consumer / reference-refresh path 只写 `ReferenceResolutionState`、typed snapshot/ref、projection stale marker、stored receipt 和可选 marker trace,不创建 `GovernanceTruthChange` 或 outbox payload。凡 Step 9 flow table 标记 `trace marker = yes` 的 reference-only accepted path,必须先通过本 helper 取得正式 marker trace subject,再调用 `GovernanceTraceRecord::from_marker(...)`。Application service、repository adapter、worker 和 fake runtime 不得根据 event topic、payload type、external ref 字符串、dedup key、trace id 或 cursor 自行拼接 `GovernanceTraceSubjectRef`。

```rust
/// Maps body-free Governance reference markers to trace subjects for consumer/reference-only marker traces.
pub trait GovernanceReferenceMarkerSubjectMapper {
    fn reference_marker_subject(&self, reference_ref: ExternalGovernanceReferenceRef) -> GovernanceTraceSubjectRef;
}
```

| helper rule | 正式口径 |
|---|---|
| input source | 只能接收 flow 已正式导出的 `ExternalGovernanceReferenceRef`,例如 typed snapshot/ref `snapshot_state.reference_ref` 或 inbound envelope `source_ref` |
| canonical key | helper 内部使用 `governance:reference-marker:<external_reference_ref.0>` 形成 canonical `ExternalSourceRef`;`<external_reference_ref.0>` 是 `ExternalSourceRef` 的完整 opaque value,即使包含分隔符也作为剩余整体处理,业务逻辑不得解析 |
| output | 返回 `GovernanceTraceSubjectRef`;该 helper 不返回 audit/outbox subject,因为 reference-only consumer marker 不创建 `GovernanceTruthChange`、不创建 outbox payload,也不更新 audit trail |
| trace relation | `GovernanceTraceRecord::from_marker(new_trace_id, mapper.reference_marker_subject(reference_ref), trace_kind, core_trace_id, Some(reference_cursor))` |
| fake / durable parity | fake runtime 和 durable adapter 必须按同一 canonical key 生成 subject refs,测试可直接断言具体 key |
| forbidden | 不得在 service / adapter 中解析 external ref 字符串、拼 route path、使用 payload type、event topic、source version、reference cursor、dedup key、idempotency digest、trace id 或 hard-coded string 代替 subject |

| reference marker ref | canonical marker trace subject key |
|---|---|
| `ExternalGovernanceReferenceRef(ref)` | `governance:reference-marker:<ref>` |

### 8. Application 基础 port 契约

#### 8.1 `ClockPort`

`Timestamp` 来自 `core-contracts`。本 Step 只定义 clock 读取面,不重新定义时间结构。

```rust
/// Provides trusted application time for records, snapshots, and markers.
pub trait ClockPort {
    /// Returns current application time.
    fn now(&self) -> Timestamp;
}
```

| 函数 | 使用方 | 字段来源 | 禁止事项 |
|---|---|---|---|
| `now` | command / consumer / job service | trace、audit、reference checked-at、history、outbox、result、job marker 时间 | 不得从 adapter response body 或 database default 隐式取代 |

#### 8.2 `IdGeneratorPort`

`IdGeneratorPort` 必须覆盖 Step 6 所有由 application / runner 生成的 id。domain object、handler、worker entry 和 repository adapter 不得拼接 id。

```rust
/// Generates stable Governance identifiers used by application flows.
pub trait IdGeneratorPort {
    fn new_governance_context_id(&self) -> GovernanceContextId;
    fn new_governance_input_id(&self) -> GovernanceInputId;
    fn new_gate_id(&self) -> GateId;
    fn new_governance_decision_id(&self) -> GovernanceDecisionId;

    fn new_approval_responsibility_id(&self) -> ApprovalResponsibilityId;
    fn new_approver_requirement_id(&self) -> ApproverRequirementId;
    fn new_responsibility_chain_id(&self) -> ResponsibilityChainId;

    fn new_policy_effective_fact_id(&self) -> PolicyEffectiveFactId;
    fn new_shared_rule_set_id(&self) -> SharedRuleSetId;
    fn new_policy_conflict_record_id(&self) -> PolicyConflictRecordId;

    fn new_control_applicability_id(&self) -> ControlApplicabilityId;
    fn new_control_review_id(&self) -> ControlReviewId;
    fn new_aiia_conclusion_id(&self) -> AIIAConclusionId;
    fn new_soa_conclusion_id(&self) -> SoAConclusionId;

    fn new_nonconformity_id(&self) -> NonconformityId;
    fn new_corrective_action_id(&self) -> CorrectiveActionId;
    fn new_verification_result_id(&self) -> VerificationResultId;

    fn new_derived_governance_view_id(&self) -> DerivedGovernanceViewId;
    fn new_reconciliation_report_id(&self) -> GovernanceReconciliationReportId;
    fn new_reconciliation_finding_id(&self) -> GovernanceReconciliationFindingId;

    fn new_trace_id(&self) -> GovernanceTraceId;
    fn new_audit_trail_id(&self) -> GovernanceAuditTrailId;
    fn new_outbox_id(&self) -> GovernanceOutboxId;
    fn new_outbox_payload_snapshot_ref(&self) -> GovernanceOutboxPayloadSnapshotRef;

    fn new_decision_record_id(&self) -> DecisionRecordId;
    fn new_responsibility_trace_record_id(&self) -> ResponsibilityTraceRecordId;
    fn new_policy_change_record_id(&self) -> PolicyChangeRecordId;
    fn new_control_change_record_id(&self) -> ControlChangeRecordId;
    fn new_compliance_conclusion_record_id(&self) -> ComplianceConclusionRecordId;
    fn new_nonconformity_change_record_id(&self) -> NonconformityChangeRecordId;

    fn new_handoff_marker_id(&self) -> GovernanceHandoffMarkerId;
    fn new_application_result_ref(&self) -> GovernanceApplicationResultRef;
    fn new_api_entry_ref(&self) -> GovernanceApiEntryRef;
    fn new_worker_entry_ref(&self) -> GovernanceWorkerEntryRef;
    fn new_job_entry_ref(&self) -> GovernanceJobEntryRef;
    fn new_job_run_id(&self) -> GovernanceJobRunId;
}
```

| 覆盖组 | 方法 | Step 6 来源 |
|---|---|---|
| core truth | context / input / gate / decision id | §11 context、input、gate、decision factories |
| responsibility | responsibility / requirement / chain id | §11 approval responsibility objects |
| policy / control / compliance | policy fact、shared rule、conflict、control、review、AIIA、SoA id | §12 policy / control object contracts |
| nonconformity | nonconformity、corrective、verification id | §12 corrective loop object contracts |
| derived / report | view、reconciliation report、finding id | §13 / §15 report and projection |
| trace / audit / outbox / history | trace、audit、outbox、outbox payload snapshot、history record ids | §13.3~§13.5 and Step 8 outbound snapshot |
| entry / result / job | result、api/worker/job entry、job run id | §15.7 / §16 |

#### 8.3 UnitOfWork 停审记录

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| truth + sidecar 同事务 | 通过 | command accepted path 必须在同一 `GovernanceUnitOfWork` 保存 truth、history、trace、audit、outbox、stale marker、stored result |
| append-only record | 通过 | trace/history/audit/outbox append 使用 same uow,但不使用 expected_version |
| maintenance marker | 通过 | projection/reference/outbox state update 使用 versioned read + expected_version |
| entry modules | 通过 | api/worker/jobs 不直接开启 repository write;只调用 application service |

### 9. Truth repository port capability 清单

#### 9.1 Capability / 接缝清单

| capability / 对象能力 | 需要的接缝 | 调用方 | 实现方 | 后续承接 |
|---|---|---|---|---|
| create / update context | context versioned read / save / list by subject | `context_service` | `infra::repositories` | Step 9 context flow,Step 11 persistence |
| submit / accept input | input versioned read / save / list by context/source | `context_service` | `infra::repositories` | Step 9 input flow |
| gate / decision | gate active lookup、decision versioned read/save、decision history append | `decision_service` | `infra::repositories` | Step 9 decision flow |
| approval / responsibility | approver requirement read/save、responsibility by context/actor、chain read/save | `approval_service` | `infra::repositories` | Step 9 approval flow |
| policy / shared rules / conflict | active policy facts by scope、rule set by scope、conflict lookup/save、subject-scope relation resolve | `policy_service` | `infra::repositories` / external relation resolver | Step 9 policy flow |
| control / compliance | control applicability/review/conclusion read/save | `control_compliance_service` | `infra::repositories` | Step 9 control flow |
| nonconformity corrective | nonconformity/corrective/verification read/save/list | `nonconformity_service` | `infra::repositories` | Step 9 corrective flow |
| body-free truth snapshot | committed truth refs by scope/context | `projection_service`、`reconciliation_service`、`export_service` | `infra::repositories` | Step 9 rebuild / reconciliation / export job flow |

#### 9.2 Context / input repositories

```rust
/// Persists Governance context truth.
pub trait GovernanceContextRepository {
    async fn get_with_version(
        &self,
        context_ref: GovernanceContextRef,
    ) -> Result<Option<Versioned<GovernanceContext>>, ApplicationError>;

    async fn find_by_subject(
        &self,
        subject_ref: GovernedSubjectRef,
        page: GovernanceRepositoryPage,
    ) -> Result<Page<Versioned<GovernanceContext>>, ApplicationError>;

    async fn save(
        &self,
        context: GovernanceContext,
        expected_version: Option<GovernanceVersion>,
        uow: &dyn GovernanceUnitOfWork,
    ) -> Result<GovernanceContextRef, ApplicationError>;
}

/// Persists Governance input truth.
pub trait GovernanceInputRepository {
    async fn get_with_version(
        &self,
        input_ref: GovernanceInputRef,
    ) -> Result<Option<Versioned<GovernanceInput>>, ApplicationError>;

    async fn list_by_context(
        &self,
        context_ref: GovernanceContextRef,
        page: GovernanceRepositoryPage,
    ) -> Result<Page<Versioned<GovernanceInput>>, ApplicationError>;

    async fn list_by_source(
        &self,
        source_ref: GovernanceSourceRef,
        page: GovernanceRepositoryPage,
    ) -> Result<Page<Versioned<GovernanceInput>>, ApplicationError>;

    async fn save(
        &self,
        input: GovernanceInput,
        expected_version: Option<GovernanceVersion>,
        uow: &dyn GovernanceUnitOfWork,
    ) -> Result<GovernanceInputRef, ApplicationError>;
}
```

| 函数 | 闭合点 |
|---|---|
| `get_with_version` | `UpdateGovernanceInputState` 和 context transition 的 expected_version 来源 |
| `find_by_subject` / `list_by_context` | query、dashboard、reconciliation、context duplicate prevention |
| `list_by_source` | external source changed / stale marker / reconciliation 反查 |

#### 9.3 Gate / decision repositories

```rust
/// Persists Governance gate truth.
pub trait GateRepository {
    async fn get_with_version(
        &self,
        gate_ref: GateRef,
    ) -> Result<Option<Versioned<Gate>>, ApplicationError>;

    async fn find_open_by_context(
        &self,
        context_ref: GovernanceContextRef,
        page: GovernanceRepositoryPage,
    ) -> Result<Page<Versioned<Gate>>, ApplicationError>;

    async fn save(
        &self,
        gate: Gate,
        expected_version: Option<GovernanceVersion>,
        uow: &dyn GovernanceUnitOfWork,
    ) -> Result<GateRef, ApplicationError>;
}

/// Persists formal Governance decisions.
pub trait GovernanceDecisionRepository {
    async fn get_with_version(
        &self,
        decision_ref: GovernanceDecisionRef,
    ) -> Result<Option<Versioned<GovernanceDecision>>, ApplicationError>;

    async fn find_current_by_gate(
        &self,
        gate_ref: GateRef,
    ) -> Result<Option<Versioned<GovernanceDecision>>, ApplicationError>;

    async fn list_by_context(
        &self,
        context_ref: GovernanceContextRef,
        page: GovernanceRepositoryPage,
    ) -> Result<Page<Versioned<GovernanceDecision>>, ApplicationError>;

    async fn save(
        &self,
        decision: GovernanceDecision,
        expected_version: Option<GovernanceVersion>,
        uow: &dyn GovernanceUnitOfWork,
    ) -> Result<GovernanceDecisionRef, ApplicationError>;
}
```

| 函数 | 闭合点 |
|---|---|
| `find_open_by_context` | `OpenGovernanceGate` 防重复和 `RecordGovernanceDecision` 读取当前 gate |
| `find_current_by_gate` | `SupersedeGovernanceDecision` 和 query summary 不从历史临时推断 current decision |
| `save(... expected_version ...)` | gate / decision 状态迁移 optimistic update |

#### 9.4 Approval / responsibility repositories

```rust
/// Persists immutable approver requirement value objects.
pub trait ApproverRequirementRepository {
    async fn get(
        &self,
        requirement_ref: ApproverRequirementRef,
    ) -> Result<Option<ApproverRequirement>, ApplicationError>;

    async fn save(
        &self,
        requirement: ApproverRequirement,
        uow: &dyn GovernanceUnitOfWork,
    ) -> Result<ApproverRequirementRef, ApplicationError>;
}

/// Persists approval responsibility and chain truth.
pub trait ApprovalResponsibilityRepository {
    async fn get_with_version(
        &self,
        responsibility_ref: ApprovalResponsibilityRef,
    ) -> Result<Option<Versioned<ApprovalResponsibility>>, ApplicationError>;

    async fn list_by_context(
        &self,
        context_ref: GovernanceContextRef,
        page: GovernanceRepositoryPage,
    ) -> Result<Page<Versioned<ApprovalResponsibility>>, ApplicationError>;

    async fn list_by_actor(
        &self,
        actor_ref: ActorRef,
        page: GovernanceRepositoryPage,
    ) -> Result<Page<Versioned<ApprovalResponsibility>>, ApplicationError>;

    async fn save(
        &self,
        responsibility: ApprovalResponsibility,
        expected_version: Option<GovernanceVersion>,
        uow: &dyn GovernanceUnitOfWork,
    ) -> Result<ApprovalResponsibilityRef, ApplicationError>;
}

/// Persists responsibility chain state.
pub trait ResponsibilityChainRepository {
    async fn get_with_version(
        &self,
        chain_ref: ResponsibilityChainRef,
    ) -> Result<Option<Versioned<ResponsibilityChain>>, ApplicationError>;

    async fn find_by_context(
        &self,
        context_ref: GovernanceContextRef,
    ) -> Result<Option<Versioned<ResponsibilityChain>>, ApplicationError>;

    async fn save(
        &self,
        chain: ResponsibilityChain,
        expected_version: Option<GovernanceVersion>,
        uow: &dyn GovernanceUnitOfWork,
    ) -> Result<ResponsibilityChainRef, ApplicationError>;
}
```

| 函数 | 闭合点 |
|---|---|
| `ApproverRequirementRepository.get` | `RecordApprovalVote` / `DelegateApprovalResponsibility` / chain satisfaction 需要按 `requirement_ref` 读取 threshold、capability 和 delegation rule |
| `ApproverRequirementRepository.save` | `AssignApprovalResponsibility` 和 `OpenGovernanceGate` 创建 requirement 后保存可回查 value object |
| `ApprovalResponsibilityRepository.list_by_context` | chain satisfaction 读取链上责任当前 vote / state |
| `ResponsibilityChainRepository.find_by_context` | decision flow 与 vote flow 不从 gate / context 临时拼 chain ref |

#### 9.5 Policy / shared rules / conflict repositories

```rust
/// Persists policy effective facts.
pub trait PolicyEffectiveFactRepository {
    async fn get_with_version(
        &self,
        policy_fact_ref: PolicyEffectiveFactRef,
    ) -> Result<Option<Versioned<PolicyEffectiveFact>>, ApplicationError>;

    async fn list_active_by_scope(
        &self,
        scope_ref: GovernanceScopeRef,
        page: GovernanceRepositoryPage,
    ) -> Result<Page<Versioned<PolicyEffectiveFact>>, ApplicationError>;

    async fn list_by_method_policy(
        &self,
        method_policy_ref: MethodPolicyRef,
        page: GovernanceRepositoryPage,
    ) -> Result<Page<Versioned<PolicyEffectiveFact>>, ApplicationError>;

    async fn save(
        &self,
        policy_fact: PolicyEffectiveFact,
        expected_version: Option<GovernanceVersion>,
        uow: &dyn GovernanceUnitOfWork,
    ) -> Result<PolicyEffectiveFactRef, ApplicationError>;
}

/// Persists shared rule sets.
pub trait SharedRuleSetRepository {
    async fn get_with_version(
        &self,
        rule_set_ref: SharedRuleSetRef,
    ) -> Result<Option<Versioned<SharedRuleSet>>, ApplicationError>;

    async fn find_active_by_scope(
        &self,
        scope_ref: GovernanceScopeRef,
    ) -> Result<Option<Versioned<SharedRuleSet>>, ApplicationError>;

    async fn save(
        &self,
        rule_set: SharedRuleSet,
        expected_version: Option<GovernanceVersion>,
        uow: &dyn GovernanceUnitOfWork,
    ) -> Result<SharedRuleSetRef, ApplicationError>;
}

/// Persists policy conflict records.
pub trait PolicyConflictRepository {
    async fn get_with_version(
        &self,
        conflict_ref: PolicyConflictRecordRef,
    ) -> Result<Option<Versioned<PolicyConflictRecord>>, ApplicationError>;

    async fn list_unresolved_by_scope(
        &self,
        scope_ref: GovernanceScopeRef,
        page: GovernanceRepositoryPage,
    ) -> Result<Page<Versioned<PolicyConflictRecord>>, ApplicationError>;

    async fn save(
        &self,
        conflict: PolicyConflictRecord,
        expected_version: Option<GovernanceVersion>,
        uow: &dyn GovernanceUnitOfWork,
    ) -> Result<PolicyConflictRecordRef, ApplicationError>;
}
```

#### 9.6 Control / compliance repositories

```rust
/// Persists control applicability truth.
pub trait ControlApplicabilityRepository {
    async fn get_with_version(
        &self,
        applicability_ref: ControlApplicabilityRef,
    ) -> Result<Option<Versioned<ControlApplicability>>, ApplicationError>;

    async fn list_by_context(
        &self,
        context_ref: GovernanceContextRef,
        page: GovernanceRepositoryPage,
    ) -> Result<Page<Versioned<ControlApplicability>>, ApplicationError>;

    async fn list_by_method_control(
        &self,
        method_control_ref: MethodControlRef,
        page: GovernanceRepositoryPage,
    ) -> Result<Page<Versioned<ControlApplicability>>, ApplicationError>;

    async fn save(
        &self,
        applicability: ControlApplicability,
        expected_version: Option<GovernanceVersion>,
        uow: &dyn GovernanceUnitOfWork,
    ) -> Result<ControlApplicabilityRef, ApplicationError>;
}

/// Persists control reviews.
pub trait ControlReviewRepository {
    async fn get_with_version(
        &self,
        review_ref: ControlReviewRef,
    ) -> Result<Option<Versioned<ControlReview>>, ApplicationError>;

    async fn list_by_applicability(
        &self,
        applicability_ref: ControlApplicabilityRef,
        page: GovernanceRepositoryPage,
    ) -> Result<Page<Versioned<ControlReview>>, ApplicationError>;

    async fn save(
        &self,
        review: ControlReview,
        expected_version: Option<GovernanceVersion>,
        uow: &dyn GovernanceUnitOfWork,
    ) -> Result<ControlReviewRef, ApplicationError>;
}

/// Persists AIIA and SoA conclusions.
pub trait ComplianceConclusionRepository {
    async fn get_aiia_with_version(
        &self,
        conclusion_ref: AIIAConclusionRef,
    ) -> Result<Option<Versioned<AIIAConclusion>>, ApplicationError>;

    async fn get_soa_with_version(
        &self,
        conclusion_ref: SoAConclusionRef,
    ) -> Result<Option<Versioned<SoAConclusion>>, ApplicationError>;

    async fn list_by_context(
        &self,
        context_ref: GovernanceContextRef,
        page: GovernanceRepositoryPage,
    ) -> Result<Page<ComplianceConclusionVersionedRef>, ApplicationError>;

    async fn save_aiia(
        &self,
        conclusion: AIIAConclusion,
        expected_version: Option<GovernanceVersion>,
        uow: &dyn GovernanceUnitOfWork,
    ) -> Result<AIIAConclusionRef, ApplicationError>;

    async fn save_soa(
        &self,
        conclusion: SoAConclusion,
        expected_version: Option<GovernanceVersion>,
        uow: &dyn GovernanceUnitOfWork,
    ) -> Result<SoAConclusionRef, ApplicationError>;
}
```

#### 9.7 Nonconformity repositories

```rust
/// Persists nonconformity truth.
pub trait NonconformityRepository {
    async fn get_with_version(
        &self,
        nonconformity_ref: NonconformityRef,
    ) -> Result<Option<Versioned<NonconformityRecord>>, ApplicationError>;

    async fn list_by_context(
        &self,
        context_ref: GovernanceContextRef,
        page: GovernanceRepositoryPage,
    ) -> Result<Page<Versioned<NonconformityRecord>>, ApplicationError>;

    async fn list_open_by_owner(
        &self,
        actor_ref: ActorRef,
        page: GovernanceRepositoryPage,
    ) -> Result<Page<Versioned<NonconformityRecord>>, ApplicationError>;

    async fn save(
        &self,
        nonconformity: NonconformityRecord,
        expected_version: Option<GovernanceVersion>,
        uow: &dyn GovernanceUnitOfWork,
    ) -> Result<NonconformityRef, ApplicationError>;
}

/// Persists corrective actions and verification results.
pub trait CorrectiveActionRepository {
    async fn get_action_with_version(
        &self,
        action_ref: CorrectiveActionRef,
    ) -> Result<Option<Versioned<CorrectiveAction>>, ApplicationError>;

    async fn get_verification_with_version(
        &self,
        verification_ref: VerificationResultRef,
    ) -> Result<Option<Versioned<VerificationResult>>, ApplicationError>;

    async fn list_actions_by_nonconformity(
        &self,
        nonconformity_ref: NonconformityRef,
        page: GovernanceRepositoryPage,
    ) -> Result<Page<Versioned<CorrectiveAction>>, ApplicationError>;

    async fn save_action(
        &self,
        action: CorrectiveAction,
        expected_version: Option<GovernanceVersion>,
        uow: &dyn GovernanceUnitOfWork,
    ) -> Result<CorrectiveActionRef, ApplicationError>;

    async fn save_verification(
        &self,
        verification: VerificationResult,
        expected_version: Option<GovernanceVersion>,
        uow: &dyn GovernanceUnitOfWork,
    ) -> Result<VerificationResultRef, ApplicationError>;
}
```

#### 9.8 Truth repository 停审记录

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| version 来源 | 通过 | 所有 mutable truth 都有 `get_*_with_version` 或 `list_*` 返回 `Versioned<T>` |
| active lookup | 通过 | gate、decision、responsibility、policy、shared rule、conflict、control、nonconformity 均有正式读取面 |
| transaction | 通过 | 所有 save 均携带 `&dyn GovernanceUnitOfWork` |
| external body | 通过 | repository 只返回 Governance truth 或 body-free ref/snapshot;不返回 sibling 正文 |

#### 9.9 Governance truth snapshot repository

`GovernanceTruthSnapshotRepository` 只读取 committed Governance truth 的 body-free ref 集合,供 projection rebuild、reconciliation 和 external GRC export 使用。它不是 projection repository,不得保存 view body;也不是 query assembler,不得绕过 visibility policy 暴露对象正文。

```rust
/// Reads body-free Governance truth summaries from committed truth stores.
pub trait GovernanceTruthSnapshotRepository {
    async fn load_scope_snapshot(
        &self,
        scope_ref: GovernanceScopeRef,
        page: GovernanceRepositoryPage,
    ) -> Result<GovernanceTruthSnapshot, ApplicationError>;

    async fn load_context_snapshot(
        &self,
        context_ref: GovernanceContextRef,
        page: GovernanceRepositoryPage,
    ) -> Result<Option<GovernanceTruthSnapshot>, ApplicationError>;
}
```

| 函数 | 闭合点 |
|---|---|
| `load_scope_snapshot(scope_ref, page)` | `RebuildGovernanceProjections`、`RunGovernanceReconciliation` 和 `PrepareExternalGrcExport` 需要从 committed truth 生成 `GovernanceTruthSnapshot` |
| `load_context_snapshot(context_ref, page)` | control coverage、nonconformity status、context dashboard 等 projection 可以从 context 聚合 truth refs |

| 约束 | 说明 |
|---|---|
| snapshot 只含 refs / scope / cursor | 不返回 policy、control、conclusion、nonconformity 正文 |
| page 是读取批次,不是 freshness/version | `GovernanceRepositoryPage` 只控制 ref-set 分页;不得当作 optimistic version |
| source cursor 来自 committed truth scan | `GovernanceTruthSnapshot.source_cursor` 表示本次摘要覆盖的提交游标;不得由 projection state 推导 |
| query 不直接复用 bypass visibility | public query 必须仍走 `AuthorizedGovernanceQueryService` 和 `ReadVisibilityPolicy` |

### 10. Append-only、Projection、Reference、Outbox 和 Result ports

#### 10.1 Trace / audit / history repositories

```rust
/// Appends and reads Governance trace records.
pub trait GovernanceTraceRepository {
    async fn append(
        &self,
        record: GovernanceTraceRecord,
        uow: &dyn GovernanceUnitOfWork,
    ) -> Result<GovernanceTraceRecordRef, ApplicationError>;

    async fn get(
        &self,
        trace_ref: GovernanceTraceRecordRef,
    ) -> Result<Option<GovernanceTraceRecord>, ApplicationError>;

    async fn list_by_subject(
        &self,
        subject_ref: GovernanceTraceSubjectRef,
        page: GovernanceRepositoryPage,
    ) -> Result<Page<GovernanceTraceRecord>, ApplicationError>;
}

/// Appends audit trails and history records.
pub trait GovernanceAuditHistoryRepository {
    async fn get_audit_trail_with_version(
        &self,
        audit_ref: GovernanceAuditTrailRef,
    ) -> Result<Option<Versioned<GovernanceAuditTrail>>, ApplicationError>;

    async fn get_audit_trail_by_subject_with_version(
        &self,
        subject_ref: GovernanceAuditSubjectRef,
    ) -> Result<Option<Versioned<GovernanceAuditTrail>>, ApplicationError>;

    async fn save_audit_trail(
        &self,
        trail: GovernanceAuditTrail,
        expected_version: Option<GovernanceVersion>,
        uow: &dyn GovernanceUnitOfWork,
    ) -> Result<GovernanceAuditTrailRef, ApplicationError>;

    async fn append_decision_record(&self, record: DecisionRecord, uow: &dyn GovernanceUnitOfWork) -> Result<DecisionRecordRef, ApplicationError>;
    async fn append_responsibility_record(&self, record: ResponsibilityTraceRecord, uow: &dyn GovernanceUnitOfWork) -> Result<ResponsibilityTraceRecordRef, ApplicationError>;
    async fn append_policy_record(&self, record: PolicyChangeRecord, uow: &dyn GovernanceUnitOfWork) -> Result<PolicyChangeRecordRef, ApplicationError>;
    async fn append_control_record(&self, record: ControlChangeRecord, uow: &dyn GovernanceUnitOfWork) -> Result<ControlChangeRecordRef, ApplicationError>;
    async fn append_compliance_record(&self, record: ComplianceConclusionRecord, uow: &dyn GovernanceUnitOfWork) -> Result<ComplianceConclusionRecordRef, ApplicationError>;
    async fn append_nonconformity_record(&self, record: NonconformityChangeRecord, uow: &dyn GovernanceUnitOfWork) -> Result<NonconformityChangeRecordRef, ApplicationError>;
}
```

| 函数 | 闭合点 |
|---|---|
| `append_*_record` | history record 不使用 expected_version,但必须在 command accepted transaction 内 append |
| `list_by_subject` | `GetGovernanceTrace`、handoff、archive、audit query 的读取面 |
| `save_audit_trail` | audit trail 是 ref set 状态,需要 versioned update |

#### 10.1.1 Handoff marker repository

`GovernanceHandoffMarkerRepository` 保存 handoff / archive / external GRC export job 产生的 body-free marker。Marker 是 operations surface,不是 core Governance truth;保存 marker 不得修改 trace、audit、outbox 或业务对象。

```rust
/// Persists and reads body-free handoff / export markers.
pub trait GovernanceHandoffMarkerRepository {
    async fn get_with_version(
        &self,
        marker_ref: GovernanceHandoffMarkerRef,
    ) -> Result<Option<Versioned<GovernanceHandoffMarker>>, ApplicationError>;

    async fn list_by_target(
        &self,
        target_ref: TraceHandoffTargetRef,
        page: GovernanceRepositoryPage,
    ) -> Result<Page<Versioned<GovernanceHandoffMarker>>, ApplicationError>;

    async fn save(
        &self,
        marker: GovernanceHandoffMarker,
        expected_version: Option<GovernanceVersion>,
        uow: &dyn GovernanceUnitOfWork,
    ) -> Result<GovernanceHandoffMarkerRef, ApplicationError>;
}
```

| 函数 | 闭合点 |
|---|---|
| `get_with_version` | delivery retry 或 marker 状态更新必须有 expected_version 来源 |
| `list_by_target` | operations query / audit 可以按 target 读取 marker,不得扫描 adapter body |
| `save` | handoff / archive / export job 保存 `Prepared`、`Delivered` 或 `Failed` marker |

| 禁止事项 | 说明 |
|---|---|
| 不保存 package body | package/ref body 归 archive、observability 或 external GRC adapter |
| 不修复 trace | marker 只引用 `GovernanceTraceRecordRefSet`,不得改写 trace record |
| 不替代 job report | job report 仍由 `StoredGovernanceResultRepository` 保存并支持 duplicate replay |

#### 10.2 Projection repository

```rust
/// Typed projection target resolved from a public derived view ref.
pub enum GovernanceProjectionTargetRef {
    /// Governance dashboard view.
    Dashboard {
        view_ref: DerivedGovernanceViewRef,
        scope_ref: GovernanceScopeRef,
    },
    /// Decision summary view.
    DecisionSummary {
        view_ref: DecisionSummaryViewRef,
        decision_ref: GovernanceDecisionRef,
        gate_ref: GateRef,
    },
    /// Policy effective view.
    PolicyEffective {
        view_ref: PolicyEffectiveViewRef,
        scope_ref: GovernanceScopeRef,
    },
    /// Control coverage view.
    ControlCoverage {
        view_ref: ControlCoverageViewRef,
        context_ref: GovernanceContextRef,
    },
    /// Nonconformity status view.
    NonconformityStatus {
        view_ref: NonconformityStatusViewRef,
        nonconformity_ref: NonconformityRef,
    },
}

/// Reads and maintains derived Governance views.
pub trait GovernanceProjectionRepository {
    async fn resolve_projection_target(
        &self,
        view_ref: DerivedGovernanceViewRef,
    ) -> Result<Option<GovernanceProjectionTargetRef>, ApplicationError>;

    async fn find_dashboard_view_ref_by_scope(
        &self,
        scope_ref: GovernanceScopeRef,
    ) -> Result<Option<DerivedGovernanceViewRef>, ApplicationError>;

    async fn find_policy_effective_view_ref_by_scope(
        &self,
        scope_ref: GovernanceScopeRef,
    ) -> Result<Option<PolicyEffectiveViewRef>, ApplicationError>;

    async fn find_decision_summary_view_ref_by_decision(
        &self,
        decision_ref: GovernanceDecisionRef,
    ) -> Result<Option<DecisionSummaryViewRef>, ApplicationError>;

    async fn find_decision_summary_view_ref_by_gate(
        &self,
        gate_ref: GateRef,
    ) -> Result<Option<DecisionSummaryViewRef>, ApplicationError>;

    async fn find_control_coverage_view_ref_by_context(
        &self,
        context_ref: GovernanceContextRef,
    ) -> Result<Option<ControlCoverageViewRef>, ApplicationError>;

    async fn find_nonconformity_status_view_ref_by_nonconformity(
        &self,
        nonconformity_ref: NonconformityRef,
    ) -> Result<Option<NonconformityStatusViewRef>, ApplicationError>;

    async fn get_state_with_version(
        &self,
        view_ref: DerivedGovernanceViewRef,
    ) -> Result<Option<Versioned<DerivedGovernanceViewState>>, ApplicationError>;

    async fn get_dashboard_view(
        &self,
        view_ref: DerivedGovernanceViewRef,
    ) -> Result<Option<GovernanceDashboardView>, ApplicationError>;

    async fn get_decision_summary_view(
        &self,
        view_ref: DecisionSummaryViewRef,
    ) -> Result<Option<DecisionSummaryView>, ApplicationError>;

    async fn list_pending_decision_summary_views(
        &self,
        context_ref: Option<GovernanceContextRef>,
        scope_ref: Option<GovernanceScopeRef>,
        page: GovernanceRepositoryPage,
    ) -> Result<Page<DecisionSummaryView>, ApplicationError>;

    async fn get_policy_effective_view(
        &self,
        view_ref: PolicyEffectiveViewRef,
    ) -> Result<Option<PolicyEffectiveView>, ApplicationError>;

    async fn get_control_coverage_view(
        &self,
        view_ref: ControlCoverageViewRef,
    ) -> Result<Option<ControlCoverageView>, ApplicationError>;

    async fn get_nonconformity_status_view(
        &self,
        view_ref: NonconformityStatusViewRef,
    ) -> Result<Option<NonconformityStatusView>, ApplicationError>;

    async fn search_governance_facts(
        &self,
        scope_ref: Option<GovernanceScopeRef>,
        fact_kind: Option<GovernanceFactKind>,
        read_subject_ref: Option<GovernanceReadSubjectRef>,
        page: GovernanceRepositoryPage,
    ) -> Result<Page<GovernanceFactSearchResultItem>, ApplicationError>;

    async fn list_views_affected_by_truth_change(
        &self,
        change: GovernanceTruthChange,
        page: GovernanceRepositoryPage,
    ) -> Result<Page<DerivedGovernanceViewRef>, ApplicationError>;

    async fn list_views_affected_by_references(
        &self,
        reference_refs: ExternalGovernanceReferenceRefSet,
        page: GovernanceRepositoryPage,
    ) -> Result<Page<DerivedGovernanceViewRef>, ApplicationError>;

    async fn mark_stale(
        &self,
        view_refs: DerivedGovernanceViewRefSet,
        source_cursor: GovernanceTruthCursor,
        uow: &dyn GovernanceUnitOfWork,
    ) -> Result<(), ApplicationError>;

    async fn save_state(
        &self,
        state: DerivedGovernanceViewState,
        expected_version: Option<GovernanceVersion>,
        uow: &dyn GovernanceUnitOfWork,
    ) -> Result<DerivedGovernanceViewRef, ApplicationError>;

    async fn replace_dashboard_view(
        &self,
        view: GovernanceDashboardView,
        state: DerivedGovernanceViewState,
        expected_version: Option<GovernanceVersion>,
        uow: &dyn GovernanceUnitOfWork,
    ) -> Result<DerivedGovernanceViewRef, ApplicationError>;

    async fn replace_decision_summary_view(&self, view: DecisionSummaryView, state: DerivedGovernanceViewState, expected_version: Option<GovernanceVersion>, uow: &dyn GovernanceUnitOfWork) -> Result<DecisionSummaryViewRef, ApplicationError>;
    async fn replace_policy_effective_view(&self, view: PolicyEffectiveView, state: DerivedGovernanceViewState, expected_version: Option<GovernanceVersion>, uow: &dyn GovernanceUnitOfWork) -> Result<PolicyEffectiveViewRef, ApplicationError>;
    async fn replace_control_coverage_view(&self, view: ControlCoverageView, state: DerivedGovernanceViewState, expected_version: Option<GovernanceVersion>, uow: &dyn GovernanceUnitOfWork) -> Result<ControlCoverageViewRef, ApplicationError>;
    async fn replace_nonconformity_status_view(&self, view: NonconformityStatusView, state: DerivedGovernanceViewState, expected_version: Option<GovernanceVersion>, uow: &dyn GovernanceUnitOfWork) -> Result<NonconformityStatusViewRef, ApplicationError>;
}
```

| 函数 | 闭合点 |
|---|---|
| `resolve_projection_target` | `RebuildGovernanceProjections` 将 public `DerivedGovernanceViewRef` 映射为 typed replace path 和 source identity,不得按 view id 字符串猜测 |
| `find_dashboard_view_ref_by_scope` | `GetGovernanceDashboard` 从 request `scope_ref` 读取 existing dashboard view ref;missing 返回 degraded/missing projection,不得创建或拼接 |
| `find_policy_effective_view_ref_by_scope` | `GetPolicyEffectiveView` 从 request `scope_ref` 读取 existing policy view ref;query 不生成新 view identity |
| `find_decision_summary_view_ref_by_decision` | `GetGateDecision(decision_ref)` 从 request / loaded decision ref 读取 existing decision summary view ref;missing 返回 degraded/missing projection,不得拼 `DecisionSummaryViewRef` |
| `find_decision_summary_view_ref_by_gate` | `GetGateDecision(gate_ref)` 从 request gate ref 读取 existing current decision summary view ref;missing 返回 degraded/missing projection,不得扫描 projection store 或拼 view id |
| `find_control_coverage_view_ref_by_context` | `GetControlCoverage` 从 request `context_ref` 读取 existing coverage view ref;query 不扫描 truth 聚合 view |
| `find_nonconformity_status_view_ref_by_nonconformity` | `GetNonconformityStatus` 从 request `nonconformity_ref` 读取 existing status view ref;query 不从 nonconformity id 拼 view id |
| `get_*_view` | public projection-backed query 必须有正式读取面,不得从 view ref 临时重建 body |
| `list_pending_decision_summary_views` | `ListPendingGovernanceDecisions` 读取 existing decision summary page |
| `search_governance_facts` | `SearchGovernanceFacts` 读取 body-free search projection page |
| `list_views_affected_by_truth_change` | command accepted 后 affected view 不能由实现临时拼接 |
| `list_views_affected_by_references` | consumer / refresh job 成功后 stale 既有 public views |
| `mark_stale` | 只接收正式 view refs 和 truth cursor |
| `replace_*_view` | projection rebuild 保存 view body + state,不反写真相 |

#### 10.2.1 Reconciliation report repository

```rust
/// Persists and reads Governance reconciliation reports.
pub trait GovernanceReconciliationReportRepository {
    async fn get(
        &self,
        report_ref: GovernanceReconciliationReportRef,
    ) -> Result<Option<GovernanceReconciliationReport>, ApplicationError>;

    async fn find_latest_by_scope(
        &self,
        scope_ref: GovernanceScopeRef,
    ) -> Result<Option<GovernanceReconciliationReport>, ApplicationError>;

    async fn save(
        &self,
        report: GovernanceReconciliationReport,
        uow: &dyn GovernanceUnitOfWork,
    ) -> Result<GovernanceReconciliationReportRef, ApplicationError>;
}
```

| 函数 | 闭合点 |
|---|---|
| `get` | `GetGovernanceReconciliationReport(report_ref)` 读取正式 report body |
| `find_latest_by_scope` | `GetGovernanceReconciliationReport(scope_ref)` 不得临时扫描或猜 latest |
| `save` | reconciliation job 保存 report,query 只读 report |

#### 10.2.2 Read visibility resolution resolver

```rust
/// Resolves read subject and scope before public query visibility policy is invoked.
pub trait GovernanceReadVisibilityResolverPort {
    async fn resolve_read_subject(
        &self,
        read_subject_ref: GovernanceReadSubjectRef,
    ) -> Result<Option<GovernanceReadVisibilityResolution>, ApplicationError>;

    async fn resolve_scope_read(
        &self,
        scope_ref: GovernanceScopeRef,
    ) -> Result<Option<GovernanceReadVisibilityResolution>, ApplicationError>;

    async fn resolve_context_read(
        &self,
        context_ref: GovernanceContextRef,
    ) -> Result<Option<GovernanceReadVisibilityResolution>, ApplicationError>;

    async fn resolve_input_read(
        &self,
        input_ref: GovernanceInputRef,
    ) -> Result<Option<GovernanceReadVisibilityResolution>, ApplicationError>;

    async fn resolve_gate_read(
        &self,
        gate_ref: GateRef,
    ) -> Result<Option<GovernanceReadVisibilityResolution>, ApplicationError>;

    async fn resolve_decision_read(
        &self,
        decision_ref: GovernanceDecisionRef,
    ) -> Result<Option<GovernanceReadVisibilityResolution>, ApplicationError>;

    async fn resolve_responsibility_read(
        &self,
        responsibility_ref: ApprovalResponsibilityRef,
    ) -> Result<Option<GovernanceReadVisibilityResolution>, ApplicationError>;

    async fn resolve_policy_conflict_read(
        &self,
        conflict_ref: PolicyConflictRef,
    ) -> Result<Option<GovernanceReadVisibilityResolution>, ApplicationError>;

    async fn resolve_compliance_conclusion_read(
        &self,
        conclusion_ref: ComplianceConclusionRef,
    ) -> Result<Option<GovernanceReadVisibilityResolution>, ApplicationError>;

    async fn resolve_nonconformity_read(
        &self,
        nonconformity_ref: NonconformityRef,
    ) -> Result<Option<GovernanceReadVisibilityResolution>, ApplicationError>;

    async fn resolve_trace_subject_read(
        &self,
        subject_ref: GovernanceTraceSubjectRef,
    ) -> Result<Option<GovernanceReadVisibilityResolution>, ApplicationError>;

    async fn resolve_reconciliation_report_read(
        &self,
        report_ref: GovernanceReconciliationReportRef,
    ) -> Result<Option<GovernanceReadVisibilityResolution>, ApplicationError>;
}
```

| 函数 | 闭合点 |
|---|---|
| `resolve_read_subject` | `SearchGovernanceFacts` item-level visibility 在只有 `GovernanceReadSubjectRef` 时取得 scope;不得从 read subject string 切分 |
| `resolve_scope_read` | `GetGovernanceDashboard`、`GetGovernanceReconciliationReport(scope_ref)`、scope-filtered projection / search query 取得 scope-level read subject;不得从 scope string 拼 subject |
| `resolve_context_read` | `GetGovernanceContext` 在 request 只有 `context_ref` 时取得 `GovernanceReadSubjectRef` + `GovernanceScopeRef`;实现不得从 `context_id` 拼 scope |
| `resolve_input_read` | `GetGovernanceInput` 在 request 只有 `input_ref` 时取得 input 所属 context / subject / scope 的正式读取解析 |
| `resolve_gate_read` | `GetGateDecision(gate_ref)` 在 decision 尚未定位或缺失时仍可形成 body-free visibility/degraded surface |
| `resolve_decision_read` | `GetGateDecision(decision_ref)`、`ListPendingGovernanceDecisions` item-level visibility 取得正式 decision read subject / scope |
| `resolve_responsibility_read` | `GetApprovalResponsibility(responsibility_ref)` 取得 responsibility 所属 context / subject / scope;context_ref 分支可先按 context resolver 解析 |
| `resolve_policy_conflict_read` | `GetPolicyConflict` 取得 conflict scope 和 read subject;可基于 loaded `PolicyConflictRecord.scope_ref` 与正式 subject index,不得解析 conflict id |
| `resolve_compliance_conclusion_read` | `GetComplianceConclusion` 取得 AIIA / SoA 所属 context / subject / scope,union branch 必须保留 |
| `resolve_nonconformity_read` | `GetNonconformityStatus(nonconformity_ref)` 取得 nonconformity 所属 context / subject / scope;不得从 nonconformity id 推导 |
| `resolve_trace_subject_read` | `GetGovernanceTrace` 从 trace subject 取得 read subject 与 scope;不得从 trace subject 字符串切分或用 trace cursor 代替 scope |
| `resolve_reconciliation_report_read` | `GetGovernanceReconciliationReport(report_ref)` 在 request 未提供 scope 时取得 report 的 scope/read subject;resolver 必须保证返回的 `scope_ref` 与 loaded report 的 `scope_ref` 一致,query service 不从 report id 或 report body自行推导 |

| 约束 | 说明 |
|---|---|
| resolver 返回 body-free summary | 只返回 `GovernanceReadVisibilityResolution`;不得返回 query body、truth body、artifact / work / runtime / policy body |
| request 显式 scope 优先但仍需 subject | 当 request 已携带 `scope_ref` 时,query service 可以直接使用该 scope,但 `read_subject_ref` 仍必须来自 request/view item 或 resolver summary |
| missing resolution 不是 visible | `None` 必须映射为 body-free degraded / not-visible surface 或 rejected malformed query,不得默认放行 |
| fake 与 durable 同规则 | in-memory fake 必须使用同一 typed ref / scope relation,不得使用字符串拼接捷径 |

#### 10.3 Reference snapshot repository

```rust
/// Persists external reference resolution state and body-free snapshots.
pub trait ReferenceSnapshotRepository {
    async fn get_reference_state_with_version(
        &self,
        reference_ref: ExternalGovernanceReferenceRef,
    ) -> Result<Option<Versioned<ReferenceResolutionState>>, ApplicationError>;

    async fn list_reference_states(
        &self,
        scope: ExternalContextRefreshScope,
        page: GovernanceRepositoryPage,
    ) -> Result<Page<Versioned<ReferenceResolutionState>>, ApplicationError>;

    async fn save_reference_state(
        &self,
        state: ReferenceResolutionState,
        expected_version: Option<GovernanceVersion>,
        uow: &dyn GovernanceUnitOfWork,
    ) -> Result<ExternalGovernanceReferenceRef, ApplicationError>;

    async fn get_actor_capability_snapshot(
        &self,
        actor_ref: ActorRef,
    ) -> Result<Option<ActorCapabilitySnapshot>, ApplicationError>;

    async fn save_actor_capability_snapshot(&self, snapshot: ActorCapabilitySnapshot, expected_version: Option<GovernanceVersion>, uow: &dyn GovernanceUnitOfWork) -> Result<ActorCapabilitySnapshotRef, ApplicationError>;
    async fn save_method_policy_snapshot(&self, snapshot: MethodPolicySnapshot, expected_version: Option<GovernanceVersion>, uow: &dyn GovernanceUnitOfWork) -> Result<MethodPolicySnapshotRef, ApplicationError>;
    async fn save_method_control_snapshot(&self, snapshot: MethodControlSnapshot, expected_version: Option<GovernanceVersion>, uow: &dyn GovernanceUnitOfWork) -> Result<MethodControlSnapshotRef, ApplicationError>;
    async fn save_evidence_summary_ref(&self, reference_ref: ExternalGovernanceReferenceRef, summary_ref: EvidenceSummaryRef, expected_version: Option<GovernanceVersion>, uow: &dyn GovernanceUnitOfWork) -> Result<EvidenceSummaryRef, ApplicationError>;
    async fn save_process_context_ref(&self, context_ref: ProcessGovernanceContextRef, expected_version: Option<GovernanceVersion>, uow: &dyn GovernanceUnitOfWork) -> Result<ProcessGovernanceContextRef, ApplicationError>;
    async fn save_work_context_ref(&self, context_ref: WorkGovernanceContextRef, expected_version: Option<GovernanceVersion>, uow: &dyn GovernanceUnitOfWork) -> Result<WorkGovernanceContextRef, ApplicationError>;
    async fn save_runtime_signal_ref(&self, signal_ref: RuntimeSignalRef, expected_version: Option<GovernanceVersion>, uow: &dyn GovernanceUnitOfWork) -> Result<RuntimeSignalRef, ApplicationError>;
}
```

| 函数 | 闭合点 |
|---|---|
| `get_reference_state_with_version` | refresh success/failure 的 expected_version 来源 |
| `list_reference_states(scope, page)` | `RefreshExternalContextSnapshots` 不做全表猜测 |
| `get_actor_capability_snapshot(actor_ref)` | query visibility、approval view 和 responsibility command 读取本地 body-free actor capability snapshot;缺失返回 `None` 并按 flow 映射为 degraded / rejected,不得调用 identity resolver 刷新 |
| `save_*_snapshot` | consumer / refresh 只保存 body-free snapshot/ref |

Reference snapshot / ref sidecar version rule:

- `ReferenceSnapshotRepository` 对同一个 `ExternalGovernanceReferenceRef` 下的 `ReferenceResolutionState` 与 typed snapshot/ref sidecar 使用同一个 reference bundle version。
- consumer / refresh flow 更新 typed snapshot/ref 时,`save_actor_capability_snapshot`、`save_method_policy_snapshot`、`save_method_control_snapshot`、`save_evidence_summary_ref`、`save_process_context_ref`、`save_work_context_ref`、`save_runtime_signal_ref` 的 `expected_version` 必须来自同一 flow 中 `get_reference_state_with_version(reference_ref)` 或 `list_reference_states(...).items[*].version`。
- 当 flow 明确允许创建一个新的 tracked reference state 时,`save_reference_state(..., None, uow)` 与对应 typed snapshot/ref `save_* (..., None, uow)` 必须在同一个 UoW 内一起 stage;否则 missing tracked reference state 必须映射为 delayed / rejected / failed item,不得私自 upsert。
- 当前 Step 7 不提供 `get_method_policy_snapshot_with_version(...)` 等 typed sidecar versioned read;实现不得发明 typed snapshot 私有 version,也不得使用 snapshot ref 字符串、source version、event version、timestamp、dedup key 或 fake private map 作为 `expected_version`。
- fake 与 durable adapter 必须用同一 reference bundle version 规则做 optimistic check;typed sidecar save 与 `save_reference_state` 对同一 `reference_ref` 的 version 冲突必须表现为同一类 repository version conflict。
- `GovernanceSourceRef` 不是 `ExternalGovernanceReferenceRef`,不能作为 reference bundle key、expected_version 来源、marker trace subject 来源或 affected-view reference。Runtime / observability payload 中的 `payload.source_ref: GovernanceSourceRef` 只可作为 pending input / pending nonconformity source marker。若 typed sidecar 使用 `signal_state.reference_ref`,它必须与 inbound envelope `source_ref: ExternalGovernanceReferenceRef` 对齐;当前 Step 7 不提供 `GovernanceSourceRef -> ExternalGovernanceReferenceRef` 转换或 dual-bundle save helper。

| typed save | `reference_ref` 来源 | `expected_version` 来源 |
|---|---|---|
| `save_actor_capability_snapshot(snapshot, expected_version, uow)` | `snapshot.snapshot_state.reference_ref` | `get_reference_state_with_version(snapshot.snapshot_state.reference_ref).version` 或 matching list item version |
| `save_method_policy_snapshot(snapshot, expected_version, uow)` | `snapshot.snapshot_state.reference_ref` | `get_reference_state_with_version(snapshot.snapshot_state.reference_ref).version` 或 matching list item version |
| `save_method_control_snapshot(snapshot, expected_version, uow)` | `snapshot.snapshot_state.reference_ref` | `get_reference_state_with_version(snapshot.snapshot_state.reference_ref).version` 或 matching list item version |
| `save_evidence_summary_ref(reference_ref, summary_ref, expected_version, uow)` | explicit `reference_ref = inbound envelope source_ref = ReferenceResolutionState.reference_ref` for that evidence summary | current reference state version for the explicit reference ref |
| `save_process_context_ref(context_ref, expected_version, uow)` | `context_ref.snapshot_state.reference_ref` | `get_reference_state_with_version(context_ref.snapshot_state.reference_ref).version` 或 matching list item version |
| `save_work_context_ref(context_ref, expected_version, uow)` | `context_ref.snapshot_state.reference_ref` | `get_reference_state_with_version(context_ref.snapshot_state.reference_ref).version` 或 matching list item version |
| `save_runtime_signal_ref(signal_ref, expected_version, uow)` | `signal_ref.signal_state.reference_ref` | `get_reference_state_with_version(signal_ref.signal_state.reference_ref).version` 或 matching list item version |

Runtime / observability consumer special rules:

| Consumer path | reference bundle key | `expected_version` 来源 | 禁止事项 |
|---|---|---|---|
| `ConsumeRuntimeSignalRecordedFlow` | `payload.runtime_signal_ref.signal_state.reference_ref`, and it must equal inbound envelope `source_ref` | `get_reference_state_with_version(payload.runtime_signal_ref.signal_state.reference_ref).version`, or `None` only when this same tracked reference is created in the UoW | 不得把 optional `payload.source_ref: GovernanceSourceRef` 保存为 `ReferenceResolutionState`;不得用它读取 version |
| `ConsumeObservabilityAlertRaisedFlow` | inbound envelope `source_ref`;optional `payload.runtime_signal_ref.signal_state.reference_ref` must equal it before saving runtime signal sidecar | `get_reference_state_with_version(envelope.source_ref).version`, or `None` only when this same tracked reference is created in the UoW | 不得把 `payload.source_ref: GovernanceSourceRef` 保存为 `ReferenceResolutionState`;不得在同一 flow 隐式更新第二个 reference bundle |

| `ExternalContextRefreshScope` branch | repository list rule | 禁止事项 |
|---|---|---|
| `ExplicitRefs(refs)` | 只返回已存在的 tracked reference states;缺失 ref 由 Step 9 refresh flow 进入 failed refs 或 rejected item | 不得为缺失 ref 隐式创建 state |
| `UnhealthyReferences` | 返回 `ReferenceResolutionState.is_unhealthy() == true` 的 tracked refs,按 `reference_ref` 稳定分页 | 不得把 repository cursor 当 freshness / version |
| `GovernanceScope(scope_ref)` | 从 Governance scope reference index 枚举关联 refs,再返回 versioned state | 不得扫描 sibling body 或按字符串拼接 scope identity |

#### 10.4 Outbox repository and payload snapshot lookup

Step 7 只定义 outbox storage / publisher lookup 接缝。具体 outbound event envelope 和 payload body 由 Step 8 定义;payload snapshot persistence schema 由 Step 11 定义。

```rust
/// Stable identity for a stored Governance outbox payload snapshot.
pub struct GovernanceOutboxPayloadSnapshotRef(pub String);

/// Serialized outbound payload captured when the outbox record was appended.
pub struct GovernanceSerializedOutboundPayload(pub Vec<u8>);

/// Stored outbound payload snapshot shell used by publishers.
pub struct GovernanceOutboxPayloadSnapshot {
    /// Stable snapshot reference.
    pub snapshot_ref: GovernanceOutboxPayloadSnapshotRef,
    /// Outbound event kind stored with the snapshot.
    pub event_kind: GovernanceOutboxEventKind,
    /// Subject that caused the outbound event.
    pub subject_ref: GovernanceOutboxSubjectRef,
    /// Schema version of the stored payload.
    pub schema_version: GovernanceEventSchemaVersion,
    /// Serialized outbound payload captured at accepted transaction time.
    pub serialized_payload: GovernanceSerializedOutboundPayload,
    /// Trace context captured at accepted transaction time.
    pub core_trace_id: TraceId,
}

/// Pending outbox item with its stored payload snapshot reference.
pub struct GovernanceOutboxPendingItem {
    /// Versioned outbox record.
    pub record: GovernanceOutboxRecord,
    /// Stored payload snapshot to publish.
    pub payload_snapshot_ref: GovernanceOutboxPayloadSnapshotRef,
}
```

| 类型 | 作用 | 约束 / 来源 |
|---|---|---|
| `GovernanceOutboxPayloadSnapshotRef` | outbox payload snapshot identity | application id / store 生成;不得等同 outbox id 或 event id |
| `GovernanceSerializedOutboundPayload` | 已序列化 outbound event payload | 来源于 accepted transaction 内的 Step 8 outbound payload builder;不保存 external body;publisher 不再回查 current truth |
| `GovernanceOutboxPayloadSnapshot` | publisher 所需的 stored payload shell | 包含 event kind、subject、schema version、serialized payload 和 core trace id;不保存 current truth body |
| `GovernanceOutboxPendingItem` | pending scan 读取结果 | 与 `Versioned<GovernanceOutboxPendingItem>` 搭配返回 outbox expected_version |

```rust
/// Persists outbox records and stored outbound payload snapshots.
pub trait GovernanceOutboxRepository {
    async fn append(
        &self,
        record: GovernanceOutboxRecord,
        payload_snapshot: GovernanceOutboxPayloadSnapshot,
        uow: &dyn GovernanceUnitOfWork,
    ) -> Result<GovernanceOutboxRef, ApplicationError>;

    async fn get_with_version(
        &self,
        outbox_ref: GovernanceOutboxRef,
    ) -> Result<Option<Versioned<GovernanceOutboxRecord>>, ApplicationError>;

    async fn get_payload_snapshot(
        &self,
        payload_snapshot_ref: GovernanceOutboxPayloadSnapshotRef,
    ) -> Result<Option<GovernanceOutboxPayloadSnapshot>, ApplicationError>;

    async fn list_pending_with_payload(
        &self,
        page: GovernanceRepositoryPage,
    ) -> Result<Page<Versioned<GovernanceOutboxPendingItem>>, ApplicationError>;

    async fn mark_published(
        &self,
        outbox_ref: GovernanceOutboxRef,
        publication_ref: OutboxPublicationRef,
        expected_version: GovernanceVersion,
        uow: &dyn GovernanceUnitOfWork,
    ) -> Result<(), ApplicationError>;

    async fn mark_failed(
        &self,
        outbox_ref: GovernanceOutboxRef,
        failure_reason: OutboxFailureReason,
        expected_version: GovernanceVersion,
        uow: &dyn GovernanceUnitOfWork,
    ) -> Result<(), ApplicationError>;

    async fn mark_dead_lettered(
        &self,
        outbox_ref: GovernanceOutboxRef,
        reason: OutboxDeadLetterReason,
        expected_version: GovernanceVersion,
        uow: &dyn GovernanceUnitOfWork,
    ) -> Result<(), ApplicationError>;
}
```

| 类型 | 归属 | Step 8 / 11 承接 |
|---|---|---|
| `GovernanceOutboxPayloadSnapshotRef` | contracts shared ref,由 Step 8 outbound event surface 固定 | event payload snapshot identity |
| `GovernanceOutboxPayloadSnapshot` | contracts / application payload snapshot shell,由 Step 8 定义字段 | publisher 读取 stored payload |
| `GovernanceOutboxPendingItem` | application helper: record + payload snapshot ref | `list_pending_with_payload` 返回 version 来源 |

| `append(record, payload_snapshot, uow)` 审计规则 | 说明 |
|---|---|
| 同事务保存 | accepted command 必须在同一 `GovernanceUnitOfWork` 保存 outbox record 和 stored payload snapshot |
| 字段一致 | `record.event_kind == payload_snapshot.event_kind` 且 `record.subject_ref == payload_snapshot.subject_ref` |
| 读取闭环 | `list_pending_with_payload` 返回 snapshot ref,`get_payload_snapshot` 必须能读取 append 时保存的 snapshot |
| 禁止 current truth lookup | publisher 不得因为只拿到 ref 而回查 current truth 重建 payload |

#### 10.5 Idempotency and stored result repository

```rust
/// Stable application-local idempotency record reference.
pub struct GovernanceIdempotencyRef(pub String);

/// Result of trying to reserve an idempotency key.
pub enum GovernanceIdempotencyReservation {
    /// A new operation may continue and must later complete or conflict.
    Reserved {
        /// Reserved idempotency record.
        idempotency_ref: GovernanceIdempotencyRef,
    },
    /// Same key and digest were already completed.
    Duplicate {
        /// Stored result to replay.
        result_ref: GovernanceApplicationResultRef,
    },
    /// Same key was reused with a different digest or operation.
    Conflict {
        /// Existing idempotency record.
        idempotency_ref: GovernanceIdempotencyRef,
        /// Redacted conflict reason.
        reason: GovernanceIdempotencyConflictReason,
    },
}

/// Stored command result envelope placeholder closed by Step 8.
pub struct GovernanceCommandResultEnvelope {
    /// Stored result reference.
    pub result_ref: GovernanceApplicationResultRef,
    /// Command operation name.
    pub operation_name: GovernanceOperationName,
    /// Surface ref for the serialized command result DTO.
    pub surface_ref: GovernanceStoredResultSurfaceRef,
}

/// Stored command rejection envelope for save-before rejected command paths.
pub struct GovernanceCommandRejectionEnvelope {
    /// Stored result reference.
    pub result_ref: GovernanceApplicationResultRef,
    /// Command operation name.
    pub operation_name: GovernanceOperationName,
    /// Surface ref for the serialized command rejection envelope.
    pub surface_ref: GovernanceStoredResultSurfaceRef,
    /// Public protocol rejection surface.
    pub rejection: GovernanceProtocolRejection,
}

/// Minimal stored consumer receipt summary; full replay uses GovernanceConsumerReceiptEnvelope.
pub struct GovernanceConsumerReceipt {
    /// Stored result reference.
    pub result_ref: GovernanceApplicationResultRef,
    /// Source event that produced the receipt.
    pub source_event_ref: GovernanceSourceEventRef,
    /// Worker disposition for the receipt.
    pub disposition: GovernanceWorkerDisposition,
    /// Optional trace record for accepted receipt paths.
    pub trace_record_ref: Option<GovernanceTraceRecordRef>,
}

/// Stored consumer receipt envelope used by duplicate replay.
pub struct GovernanceConsumerReceiptEnvelope {
    /// Stored result reference.
    pub result_ref: GovernanceApplicationResultRef,
    /// Consumer operation name.
    pub operation_name: GovernanceOperationName,
    /// Surface ref for the serialized inbound event receipt.
    pub surface_ref: GovernanceStoredResultSurfaceRef,
    /// Public inbound event receipt surface.
    pub receipt: GovernanceInboundEventReceipt,
}
```

| 类型 | 作用 | 约束 / 来源 |
|---|---|---|
| `GovernanceIdempotencyRef` | application-local idempotency record ref | 不进入 public DTO;repository save/load identity |
| `GovernanceIdempotencyReservation` | reserve 结果 | `Duplicate` 必须携带 stored result ref;不得要求 caller 重跑 operation |
| `GovernanceCommandResultEnvelope` | command accepted duplicate replay placeholder | 完整 command result variants 由 Step 8 闭合;本 Step 只固定 stored lookup surface |
| `GovernanceCommandRejectionEnvelope` | command rejected duplicate replay placeholder | 保存 `GovernanceProtocolRejection` 和 surface ref;用于 save-before rejected command duplicate replay;不得包含 command body、artifact body、adapter response 或 stack trace |
| `GovernanceConsumerReceipt` | consumer receipt minimal summary | 仅保留 result/source/disposition/trace 快速索引面;不得作为 duplicate replay 的完整 stored surface |
| `GovernanceConsumerReceiptEnvelope` | consumer duplicate replay envelope | 保存完整 public `GovernanceInboundEventReceipt` surface 和 serialized surface ref;duplicate replay 必须返回该 stored receipt,不得重跑 consumer mutation 或临时重建 receipt |

```rust
/// Reserves and completes command, consumer, and job idempotency records.
pub trait GovernanceIdempotencyRepository {
    async fn reserve(
        &self,
        context: &GovernanceOperationContext,
        request_digest: GovernanceRequestDigest,
        uow: &dyn GovernanceUnitOfWork,
    ) -> Result<GovernanceIdempotencyReservation, ApplicationError>;

    async fn complete(
        &self,
        idempotency_ref: GovernanceIdempotencyRef,
        result_ref: GovernanceApplicationResultRef,
        uow: &dyn GovernanceUnitOfWork,
    ) -> Result<(), ApplicationError>;

    async fn mark_conflict(
        &self,
        idempotency_ref: GovernanceIdempotencyRef,
        conflict_reason: GovernanceIdempotencyConflictReason,
        uow: &dyn GovernanceUnitOfWork,
    ) -> Result<(), ApplicationError>;
}

/// Stores command results, consumer receipts, and job reports for duplicate replay.
pub trait StoredGovernanceResultRepository {
    async fn save(
        &self,
        result: StoredGovernanceOperationResult,
        uow: &dyn GovernanceUnitOfWork,
    ) -> Result<GovernanceApplicationResultRef, ApplicationError>;

    async fn get(
        &self,
        result_ref: GovernanceApplicationResultRef,
    ) -> Result<Option<StoredGovernanceOperationResult>, ApplicationError>;

    async fn get_command_result(
        &self,
        result_ref: GovernanceApplicationResultRef,
    ) -> Result<Option<GovernanceCommandResultEnvelope>, ApplicationError>;

    async fn get_command_rejection(
        &self,
        result_ref: GovernanceApplicationResultRef,
    ) -> Result<Option<GovernanceCommandRejectionEnvelope>, ApplicationError>;

    async fn save_consumer_receipt(
        &self,
        envelope: GovernanceConsumerReceiptEnvelope,
        uow: &dyn GovernanceUnitOfWork,
    ) -> Result<GovernanceApplicationResultRef, ApplicationError>;

    async fn get_consumer_receipt(
        &self,
        result_ref: GovernanceApplicationResultRef,
    ) -> Result<Option<GovernanceConsumerReceiptEnvelope>, ApplicationError>;

    async fn get_job_report(
        &self,
        result_ref: GovernanceApplicationResultRef,
    ) -> Result<Option<GovernanceJobReport>, ApplicationError>;
}
```

| 函数 | 闭合点 |
|---|---|
| `reserve` | duplicate / conflict 判断不重跑 mutation |
| `save(StoredGovernanceOperationResult)` | accepted command result、rejected command result、consumer receipt、job report 都必须在 same UoW 内先保存 stored surface,再 complete idempotency |
| `get_command_rejection(result_ref)` | duplicate same digest 且 stored kind 为 `CommandRejection` 时返回保存的 `GovernanceProtocolRejection`;不得重新调用 resolver、domain policy 或 repository |
| `save_consumer_receipt(envelope, uow)` | accepted / delayed / rejected / unsupported consumer path 在 same UoW 内保存完整 public `GovernanceInboundEventReceipt` replay surface;内部必须同时保存或关联 `StoredGovernanceOperationResult { result_kind: ConsumerReceipt }`;不得只保存 placeholder |
| `get_consumer_receipt(result_ref)` | duplicate same digest 且 stored kind 为 `ConsumerReceipt` 时返回保存的完整 `GovernanceConsumerReceiptEnvelope`;missing / wrong kind 是一致性错误,不得重跑 consumer |
| `complete` | idempotency record 指向 stored result |
| `get_job_report` | operations job duplicate replay 返回既有 report |

### 11. External resolver、publisher、handoff 和 export ports

#### 11.1 External source resolver port

所有 resolver 只能返回 body-free ref、safe summary、source version、digest、snapshot 或 resolution state。不得返回 process/work/artifact/method/runtime/conversation/observability 正文。

```rust
/// Resolves external Governance references into body-free summaries and snapshots.
pub trait ExternalGovernanceSourceResolverPort {
    async fn resolve_governed_subject(
        &self,
        subject_ref: GovernedSubjectRef,
    ) -> Result<ReferenceResolutionState, ApplicationError>;

    async fn resolve_governance_source(
        &self,
        source_ref: GovernanceSourceRef,
    ) -> Result<ReferenceResolutionState, ApplicationError>;

    async fn resolve_actor_capability(
        &self,
        actor_ref: ActorRef,
    ) -> Result<ActorCapabilitySnapshot, ApplicationError>;

    async fn resolve_method_policy(
        &self,
        policy_ref: MethodPolicyRef,
    ) -> Result<MethodPolicySnapshot, ApplicationError>;

    async fn resolve_method_control(
        &self,
        control_ref: MethodControlRef,
    ) -> Result<MethodControlSnapshot, ApplicationError>;

    async fn resolve_evidence_summary(
        &self,
        evidence_ref: EvidenceSummaryRef,
    ) -> Result<ReferenceResolutionState, ApplicationError>;

    async fn resolve_artifact_ref(
        &self,
        artifact_ref: ArtifactRef,
    ) -> Result<ReferenceResolutionState, ApplicationError>;

    async fn resolve_process_context(
        &self,
        context_ref: ProcessGovernanceContextRef,
    ) -> Result<ReferenceResolutionState, ApplicationError>;

    async fn resolve_work_context(
        &self,
        context_ref: WorkGovernanceContextRef,
    ) -> Result<ReferenceResolutionState, ApplicationError>;

    async fn resolve_runtime_signal(
        &self,
        signal_ref: RuntimeSignalRef,
    ) -> Result<ReferenceResolutionState, ApplicationError>;

    async fn resolve_scope_subject_relation(
        &self,
        subject_ref: GovernedSubjectRef,
        scope_ref: GovernanceScopeRef,
    ) -> Result<GovernanceScopeSubjectRelation, ApplicationError>;
}
```

| 函数 | 闭合点 |
|---|---|
| `resolve_artifact_ref(artifact_ref)` | 返回 body-free `ReferenceResolutionState`;用于 `SubmitAIIAConclusionFlow` / `SubmitSoAConclusionFlow` 在 draft 创建前判定 artifact ref 是否 resolved;`Unresolved` / `Stale` / `Unavailable` / `Invalid` / digest mismatch outcome 必须 save 前 rejected,不得创建 AIIA / SoA truth,不得返回 artifact body |
| `resolve_scope_subject_relation(subject_ref, scope_ref)` | 返回 body-free `GovernanceScopeSubjectRelation`;用于 `PolicyScopePolicy` 在 `ActivatePolicyEffectiveFactFlow` / `UpdateSharedRuleSetFlow` save 前判定 subject/scope mismatch;不得解析 ref 字符串、不得扫描 adapter 私有状态、不得返回 scope body |

#### 11.2 Publisher port

```rust
/// Publishes stored Governance outbound payload snapshots.
pub trait GovernanceOutboxPublisherPort {
    async fn publish(
        &self,
        record: GovernanceOutboxRecord,
        payload_snapshot: GovernanceOutboxPayloadSnapshot,
    ) -> Result<OutboxPublicationRef, OutboxFailureReason>;
}
```

| 闭合点 | 说明 |
|---|---|
| stored snapshot | publisher 接收 `GovernanceOutboxPayloadSnapshot`,不得回查 current truth 造 payload |
| failure reason | adapter failure 进入 `OutboxFailureReason`,不得回滚 accepted truth |
| topic / schema | topic map、schema version 和 unsupported handling 由 Step 8 / Step 14 / Step 13 继续闭合 |

#### 11.3 Handoff / archive / external GRC ports

```rust
/// Prepares and delivers Governance trace handoff packages.
pub trait GovernanceTraceHandoffPort {
    async fn prepare(
        &self,
        target_ref: TraceHandoffTargetRef,
        trace_refs: GovernanceTraceRecordRefSet,
    ) -> Result<HandoffPackageRef, HandoffFailureReason>;

    async fn deliver(
        &self,
        target_ref: TraceHandoffTargetRef,
        package_ref: HandoffPackageRef,
    ) -> Result<HandoffReceiptRef, HandoffFailureReason>;
}

/// Prepares archive handoff packages from committed Governance refs.
pub trait GovernanceArchiveHandoffPort {
    async fn prepare_archive(
        &self,
        target_ref: TraceHandoffTargetRef,
        trace_refs: GovernanceTraceRecordRefSet,
        report_refs: GovernanceReportRefSet,
    ) -> Result<HandoffPackageRef, HandoffFailureReason>;
}

/// Prepares export packages for external GRC systems.
pub trait ExternalGrcExportPort {
    async fn prepare_export(
        &self,
        target_ref: TraceHandoffTargetRef,
        snapshot: GovernanceTruthSnapshot,
    ) -> Result<HandoffPackageRef, HandoffFailureReason>;

    async fn deliver_export(
        &self,
        target_ref: TraceHandoffTargetRef,
        package_ref: HandoffPackageRef,
    ) -> Result<HandoffReceiptRef, HandoffFailureReason>;
}
```

| port | 禁止事项 |
|---|---|
| `GovernanceTraceHandoffPort` | 不保存 observability ledger body;只返回 package / receipt ref |
| `GovernanceArchiveHandoffPort` | 不保存 archive package body;package body 归 archive |
| `ExternalGrcExportPort` | external GRC 不反写 Governance truth |

#### 11.4 Adapter availability port

```rust
/// Reads adapter availability and validated config binding surfaces.
pub trait GovernanceAdapterRegistryPort {
    async fn get_adapter_availability(
        &self,
        slot: GovernanceInfraAdapterSlot,
    ) -> Result<GovernanceAdapterAvailabilityMarker, ApplicationError>;

    async fn list_enabled_handoff_targets(
        &self,
        page: GovernanceRepositoryPage,
    ) -> Result<Page<TraceHandoffTargetRef>, ApplicationError>;
}
```

### 12. Infra、API、Worker、Jobs 实现契约

#### 12.1 `infra` adapter implementation matrix

| application port | infra 实现文件 | adapter 状态对象 | 实现要求 |
|---|---|---|---|
| truth repositories | `repositories.rs` | store state | versioned read、expected_version、same-uow write |
| truth snapshot repository | `truth_snapshot_store.rs` | snapshot read state | 从 committed truth refs 构造 body-free `GovernanceTruthSnapshot` |
| projection repository | `projection_stores.rs` | `GovernanceProjectionStoreState` | affected view lookup 不拼接 ad hoc id |
| reference repository | `reference_stores.rs` | reference store state | list scope、versioned read、body-free snapshot |
| outbox repository | `outbox_store.rs` | outbox store state | pending list 返回 record + payload snapshot + version |
| handoff marker repository | `handoff_marker_store.rs` | handoff marker state | versioned marker read/save;不保存 package body |
| idempotency/result repositories | `idempotency_store.rs` | idempotency store state | duplicate replay 不重跑 mutation/job |
| source resolver | `source_resolvers.rs` | resolver adapter state | 只返回 body-free snapshot / state |
| publisher | `publishers.rs` | publisher adapter state | 发布 stored payload snapshot |
| handoff/export | `handoff_adapters.rs` / `external_grc_adapters.rs` | handoff adapter state | 只返回 package / receipt / failure refs |
| clock/id | `clock_id.rs` | generator state | 生成 opaque id,不得由对象字段拼接 |

#### 12.2 Entry module restrictions

| 模块 | 可调用 | 禁止调用 |
|---|---|---|
| `api` | application command/query service facade | repository、domain transition、publisher、resolver |
| `worker` | application consumer / outbox / projection service facade | repository、domain transition、outbox store、projection store |
| `jobs` | application job service facade | repository、domain transition、publisher/handoff adapter direct call |

### 13. Step 6 open item closure

| Step 6 open item | Step 7 关闭结论 | 后续 Step |
|---|---|---|
| GVN-S6-OPEN-001 id generator 覆盖 | `IdGeneratorPort` 已列出所有 Step 6 generated id / ref | Step 11 实现持久化生成策略 |
| GVN-S6-OPEN-002 repository 读取面和 version | truth / maintenance repositories 均提供 `Versioned<T>` 读取面 | Step 11 定义持久化 schema |
| GVN-S6-OPEN-003 resolver body-free | `ExternalGovernanceSourceResolverPort` 只返回 resolution / snapshot | Step 14 定义 adapter binding |
| GVN-S6-OPEN-007 outbox payload / version | `GovernanceOutboxRepository` 提供 payload snapshot lookup 和 pending version | Step 8/11/13 定义 payload schema、persistence、retry |
| GVN-S6-OPEN-008 affected views | `GovernanceProjectionRepository.list_views_affected_by_*` 正式闭合 | Step 9 定义调用时机 |
| GVN-S6-OPEN-009 stored result | `StoredGovernanceResultRepository` 覆盖 command / consumer / job replay | Step 8/13 定义 DTO/result variants |
| GVN-S6-OPEN-010 truth snapshot / handoff marker | `GovernanceTruthSnapshotRepository` 和 `GovernanceHandoffMarkerRepository` 正式闭合 job 读取面与 marker 保存面 | Step 9 rebuild / handoff / export flow |

### 14. 模块内停审记录

| 模块 | 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|---|
| `contracts` | 是否被 port 反向依赖 domain-only type | 通过 | Step 8 仍需定义 payload snapshot DTO 和 command/query/event/job body |
| `domain` | 是否定义 repository / adapter trait | 通过 | domain 只暴露 object / policy |
| `application` | port capability 是否覆盖 Step 6 对象能力 | 通过 | error/retry 细节留给 Step 12/13 |
| `infra` | 实现方是否清楚 | 通过 | durable schema 留给 Step 11 |
| `api` | 是否绕过 application | 通过 | handler DTO 细节留给 Step 8 |
| `worker` | 是否绕过 application | 通过 | unsupported/dead-letter 细节留给 Step 12/13 |
| `jobs` | 是否直接修复 truth | 通过 | job DTO/report body 留给 Step 8/13 |

### 15. 跨模块接缝闭环审计表

| 审计项 | 结论 | 缺口 / 修正 |
|---|---|---|
| duplicate port | 通过 | repository、resolver、publisher、handoff 均由 application 统一定义 |
| 反向依赖 | 通过 | application 不依赖 infra;entry modules 不依赖 repository |
| 读取面缺失 | 通过 | command、query、consumer、job 关键读取面均有 port |
| version 来源 | 通过 | mutable truth/marker 均有 versioned read;outbox pending list 返回 version |
| affected projection view | 通过 | truth change 和 reference change 均有 affected views list |
| outbox publisher payload | 通过 | publisher 读取 stored payload snapshot,不现查 current truth |
| truth snapshot | 通过 | rebuild/reconciliation/export job 通过 `GovernanceTruthSnapshotRepository` 读取 body-free committed truth summary |
| handoff marker | 通过 | handoff/export job 通过 `GovernanceHandoffMarkerRepository` 保存和读取 marker |
| external body 泄漏 | 通过 | resolver、handoff、export 均只返回 body-free refs / snapshots |
| Step 8 / 9 / 10 承接 | 通过 | DTO、flow、state matrix 可按本 Step port 继续展开 |

### 16. 回填草稿

> 校准来源:
> - `design-calibration/03_ddd_step_07_trait_port_adapter_contracts.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“Truth repository port capability 清单”“Projection repository”“Reference snapshot repository”“Outbox repository and payload snapshot lookup”“External resolver、publisher、handoff 和 export ports”小节,了解 Step 7 如何闭合读取面、version 来源、stored payload 和 duplicate replay。

正式 `03-详细设计.md` §5 模块实现契约应补入:

- `application` 是 repository / resolver / publisher / handoff / UnitOfWork / Clock / IdGenerator / result store trait 的唯一 owner。
- `infra` 是这些 port 的唯一实现层。
- `api`、`worker`、`jobs` 只调用 application service facade,不得直接读写 repository 或调用 domain transition。
- 所有 mutable truth 和 maintenance marker 的写入必须先通过 `get_*_with_version` 或 versioned list 获得 `GovernanceVersion`。
- Outbox publisher 只读取 stored payload snapshot,不得回查 current truth 构造 payload。
- Duplicate command / event / job 必须通过 stored result / receipt / report replay,不得重新执行 mutation 或 job scan。

### 17. 进入下一步条件

| 检查项 | 结论 | 依据 |
|---|---|---|
| 所有跨模块接缝有正式 trait / port | 通过 | §8~§12 |
| 每个 port 有调用方和实现方 | 通过 | §9 / §12 |
| 读取面覆盖 Step 8 / 9 / 10 / 11 需求 | 通过 | versioned read、affected views、reference list、payload snapshot lookup |
| 写入面 version / transaction 闭合 | 通过 | `GovernanceVersion` + `GovernanceUnitOfWork` |
| Step 6 open item 已承接 | 通过 | §13 |
| 无 unresolved Step 7 blocker | 通过 | 剩余事项属于 Step 8 / 9 / 11 / 12 / 13 正式职责 |

结论:Step 7 可以关闭,下一步进入 Step 8 “定义 API / Command / Query / Event / Job 协议契约”。
