# Step 6. 逐模块定义对象实现契约

### 1. Step 状态

- 状态:[x] 已确认
- 对应 SOP:`standards/document/详细设计讨论流程_SOP.md` Step 6
- 回填章节:`03-详细设计.md` §5 模块实现契约中的对象实现契约 / §6 全局对象索引

### 2. 本步输入

| 输入 | 内容 | 本步使用方式 |
|---|---|---|
| `03_ddd_step_05_module_contracts.md` | 模块主轴、依赖方向、对象归属门禁 | 确认对象落到 `contracts` / `domain` / `application` / `infra` / entry module |
| `02_hld_step_06_key_objects*.md` | 概要层关键对象轮廓 | 作为对象、字段、函数和禁止事项来源 |
| `02_hld_step_07_api_interface_skeleton.md` | Command / Query / Event / Job 骨架 | 判断哪些 ref / state / view 必须属于 `contracts` |
| `02_hld_step_09_state_machine.md` | 状态集合和核心流转 | 固定状态 enum 变体和允许迁移方向 |
| `02_hld_step_12_detailed_design_handoff.md` | 详细设计承接清单 | 防止新增概要层未点名的核心对象 |
| `03_ddd_step_03_constraints.md` | Rust 2024、源码英文、rustdoc、依赖约束 | Rust code block 内 rustdoc 使用英文 |
| `standards/document/设计真相源闭环与可落码性标准.md` | 字段、状态、DTO / Domain 闭环标准 | 检查对象字段来源和 public DTO 归属 |

### 3. 分批写入记录

本 Step 按 `设计文档讨论中间产物规范.md` §3.4 分批写入:

| 批次 | 内容 | 状态 |
|---|---|---|
| 6.1 | 文件骨架、输入、对象归属和 contracts shared type 主轴 | [x] |
| 6.2 | domain truth / reference / projection / audit / outbox 对象契约 | [x] |
| 6.3 | domain policy、application service object、infra / entry object 和闭环表 | [x] |

### 4. SOP 问题回答

1. 每个模块中需要定义哪些 struct / enum / value object / service?

   回答:
   - `contracts`:本仓 typed id / ref、state enum、reason / target enum、DTO 共享值对象、query visible view DTO、receipt / protocol error 支撑对象。
   - `domain`:Project、ProjectMember、Backlog、WorkItem、ChildWorkItem、WorkDependency、WorkBlocker、Iteration、IterationCommitment、PromoteResult、snapshot / reference state、audit / history / outbox record 和 policy。
   - `application`:command / query / consumer / job service object、UnitOfWork / Idempotency 支撑对象和应用错误对象。repository / port trait 本身留给 Step 7。
   - `infra`:runtime config binding、runtime builder、fake repository / adapter state object。具体 adapter trait impl 留给 Step 7 / Step 11。
   - `api` / `worker` / `jobs`:入口 handler / runner object,只持有 application service facade 和 boundary metadata。

2. 每个对象的主要责任和不变量是什么?

   回答:本 Step 在每个对象小节中给出主要责任、不变量和禁止事项。核心不变量是 Work truth 不能吸收相邻仓正文,projection / reference / outbox 不能反写真相,query / job 不能创建核心业务事实。

3. 每个字段的类型、作用和约束是什么?

   回答:对象小节中的字段表给出字段类型、作用和约束。凡会进入 Command / Query / Event / Job / View 的 shared ref、state、reason 均归属 `contracts`,domain 直接复用,避免 contracts 依赖 domain。

4. 每个成员函数的完整签名、参数类型、返回类型和副作用是什么?

   回答:本 Step 对 domain object 和 application object 给出函数签名、参数类型、返回类型和副作用。repository / resolver / publisher / handoff trait 函数留给 Step 7。

5. 哪些函数是工厂函数或静态函数?

   回答:每个 domain object 的 `create` / `open` / `formalize` / `link` / `from_*` / `empty_*` 等函数均列入工厂函数表。

6. 哪些状态 enum 需要写变体、允许来源和允许去向?

   回答:Project、ProjectMember、Backlog、WorkItem、PromoteResult、Dependency、Blocker、Iteration、IterationCommitment、Derived freshness、Reference resolution、Outbox publication 均定义正式 enum 变体表。

7. 每个 enum variant 的 Rustdoc 注释是什么?带载荷 variant 的载荷类型承载什么语义?

   回答:本 Step 的 enum code block 和变体表均写 Rustdoc 注释。带载荷 variant 暂只用于错误 / target 类后续 Step;本 Step 状态 enum 不使用带载荷 variant。

### 5. 当前文档问题诊断

| 位置 | 当前问题 | 本步处理 |
|---|---|---|
| `02_hld_step_06_key_objects*.md` | `SourceWorkRef`、`ExternalEvidenceRef` 作为 reference object 出现,同时又会被 Command DTO 使用 | 本 Step 将这类跨 DTO / domain 的 reference object 归入 `contracts`,domain 直接消费 |
| `02_hld_step_09_state_machine.md` | 状态集合是概要候选,未说明 `contracts` / `domain` 归属 | 本 Step 把会进入 event / view / command result 的 state enum 上提为 `contracts` shared enum |
| `02_hld_step_06_key_objects_projections.md` | `ProjectBoardView` 等 projection / read model 可能被误写成 truth | 本 Step 明确它们是 derived read object,不可反写真相;public view DTO 归属 `contracts/views.rs` |
| Step 5 文件布局 | `application` service object 与 repository trait 仍未区分 | 本 Step 只定义 service object 和 application helper;trait / port 留给 Step 7 |
| 旧 `03-详细设计.md` | 旧 Project / Iteration / child work 状态残留 | 本 Step 只承接新版 `02` 和 HLD step,不继承旧状态 |

### 6. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| ref / state 归属 | HLD 中只出现类型名 | 固定 shared ref / state / reason 在 `contracts` | 防止 contracts view 引用 domain-only 类型 |
| domain object | 只有关键字段骨架 | 给出 Rust struct、字段表、函数表和不变量 | 支撑实现者直接落 `domain` 类型 |
| projection / read model | 只说明只读可重建 | 明确 public view DTO 与 derived state 关系 | 防止 projection 成第二 truth |
| application object | HLD 未定义 service struct | 给出 service object 责任和主要依赖 | 支撑 Step 7 port 和 Step 9 flow |

### 7. 结构化中间产物

#### 7.1 对象归属总表

| 模块 | 对象类别 | 正式对象 |
|---|---|---|
| `contracts` | typed id / ref | `ProjectId`、`ProjectRef`、`ProjectOwnerRef`、`ProjectMemberId`、`ProjectMemberRef`、`GlobalMemberRef`、`BacklogId`、`BacklogRef`、`WorkItemId`、`ChildWorkItemId`、`FormalWorkRef`、`IterationRef`、`SourceWorkRef`、`ExternalEvidenceRef` 等 |
| `contracts` | state / target / reason | `ProjectLifecycleState`、`ProjectMemberResponsibilityState`、`BacklogState`、`WorkItemState`、`PromoteResultState`、`DependencyState`、`BlockerState`、`IterationState`、`CommitmentState`、`DerivedFreshnessState`、`ReferenceResolutionStatus`、`OutboxPublicationState` |
| `contracts` | projection view DTO | `ProjectBoardView`、`MemberWorkView`、`IterationSummaryView`、`WorkSearchProjection`、`ReconciliationReport` |
| `domain` | truth / state object | `Project`、`ProjectMember`、`Backlog`、`WorkItem`、`ChildWorkItem`、`WorkDependency`、`WorkBlocker`、`Iteration`、`IterationCommitment`、`PromoteResult` |
| `domain` | reference / snapshot | `MemberCapabilitySnapshot`、`MethodDefinitionSnapshot`、`ReferenceResolutionState`、`PendingPromoteIntake` |
| `domain` | audit / history / outbox | `WorkTraceRecord`、`WorkAuditTrail`、`WorkOutboxRecord`、`TraceHandoffMarker`、`ArchiveHandoffIntent`、`ArchiveHandoffMarker`、`PromoteDecisionRecord`、`DependencyChangeRecord`、`IterationChangeRecord` |
| `domain` | policy | `WorkTruthPolicy`、`ProjectLifecyclePolicy`、`MemberResponsibilityPolicy`、`FormalWorkPolicy`、`BacklogAvailabilityPolicy`、`PromotePolicy`、`DependencyGraphPolicy`、`IterationCommitmentPolicy`、`CompletionEvidencePolicy`、`DerivedWorkViewPolicy` |
| `application` | service object / helper | `ProjectCommandService`、`ProjectMemberCommandService`、`WorkItemCommandService`、`PromoteCommandService`、`DependencyBlockerService`、`IterationCommandService`、`AuthorizedWorkQueryService`、`WorkQueryVisibilityPolicy`、`QueryActorMemberRef`、`TraceVisibilityDeps`、`WorkDerivedMaintenanceService`、`ApplicationResultRef`、`IdempotencyRecord` |
| `infra` | runtime / adapter state | `WorkRuntimeConfig`、`WorkRuntimeBuilder`、`InMemoryWorkStores` |
| `api` / `worker` / `jobs` | entry object | `WorkCommandHandlers`、`WorkQueryHandlers`、`WorkInboundConsumers`、`WorkOperationsJobRunner` |

#### 7.2 `contracts/refs.rs` shared value object 契约

`contracts/refs.rs` 只定义可跨 DTO、event、view、domain 复用的轻量值对象。普通 id / ref 使用 opaque string newtype;实现可以用 macro 生成,但 public type 名必须与本表一致。

```rust
/// Identifies a Work-owned project subject.
pub struct ProjectId(pub String);

/// References a Work-owned project subject across APIs and events.
pub struct ProjectRef {
    /// Stable Work project id.
    pub project_id: ProjectId,
}

/// Identifies a project-local member responsibility.
pub struct ProjectMemberId(pub String);

/// References a project-local member responsibility.
pub struct ProjectMemberRef {
    /// Stable project member responsibility id.
    pub project_member_id: ProjectMemberId,
}

/// References an identity-owned global member.
pub struct GlobalMemberRef(pub String);

/// Identifies a Work-owned backlog.
pub struct BacklogId(pub String);

/// References a Work-owned backlog.
pub struct BacklogRef {
    /// Stable backlog id.
    pub backlog_id: BacklogId,
}

/// Identifies a formal root work item.
pub struct WorkItemId(pub String);

/// Identifies a formal child work item.
pub struct ChildWorkItemId(pub String);

/// Identifies a formal work dependency.
pub struct WorkDependencyId(pub String);

/// References a formal work dependency.
pub struct WorkDependencyRef {
    /// Stable dependency id.
    pub dependency_id: WorkDependencyId,
}

/// Identifies a formal work blocker.
pub struct WorkBlockerId(pub String);

/// References a formal work blocker.
pub struct WorkBlockerRef {
    /// Stable blocker id.
    pub blocker_id: WorkBlockerId,
}

/// Identifies a Work-owned iteration.
pub struct IterationId(pub String);

/// References a Work-owned iteration.
pub struct IterationRef {
    /// Stable iteration id.
    pub iteration_id: IterationId,
}

/// Identifies an iteration commitment set.
pub struct IterationCommitmentId(pub String);

/// Identifies a promote result.
pub struct PromoteResultId(pub String);

/// References a promote result.
pub struct PromoteResultRef {
    /// Stable promote result id.
    pub promote_result_id: PromoteResultId,
}

/// Identifies a promote decision record.
pub struct PromoteDecisionId(pub String);

/// Identifies a dependency or blocker change record.
pub struct DependencyChangeId(pub String);

/// Identifies an iteration change record.
pub struct IterationChangeId(pub String);

/// Identifies a Work trace record.
pub struct WorkTraceId(pub String);

/// Identifies a Work audit trail.
pub struct WorkAuditTrailId(pub String);

/// Identifies a Work outbox record.
pub struct WorkOutboxId(pub String);

/// Identifies a stored application result surface.
pub struct ResultId(pub String);

/// Identifies an upstream source event.
pub struct SourceEventId(pub String);

/// References an upstream source version.
pub struct ExternalVersionRef(pub String);

/// Points to the external owner of a Work project without owning that body.
pub struct ProjectOwnerRef {
    /// Owner system or tenant family.
    pub owner_kind: ProjectOwnerKind,
    /// Stable external owner pointer.
    pub external_ref: ExternalSourceRef,
}

/// References formal Work truth regardless of root or child shape.
pub enum FormalWorkRef {
    /// A root formal work item.
    WorkItem(WorkItemId),
    /// A formal child work item.
    ChildWorkItem(ChildWorkItemId),
}

/// Points to an external source that may be formalized or promoted into Work truth.
pub struct SourceWorkRef {
    /// Source category.
    pub source_kind: SourceWorkKind,
    /// External stable pointer.
    pub external_ref: ExternalSourceRef,
    /// Optional digest for source summary verification.
    pub source_digest: Option<SourceDigest>,
}

/// Points to an external completion, blocker, governance, or artifact evidence without storing the body.
pub struct ExternalEvidenceRef {
    /// Evidence category.
    pub evidence_kind: EvidenceKind,
    /// External stable pointer.
    pub external_ref: ExternalSourceRef,
    /// Verification state of the referenced evidence.
    pub verified_state: EvidenceVerifiedState,
}
```

| 类型 | 字段 / 形态 | 作用 | 约束 |
|---|---|---|---|
| `ProjectId` | string newtype | Project identity | 系统生成或由创建命令确定;不可复用外部 id |
| `ProjectRef` | `project_id` | 跨 DTO / event 引用 Project | 不含 workspace project body |
| `ProjectOwnerRef` | `owner_kind`、`external_ref` | 指向 workspace / org / external owner | 只保存引用 |
| `ProjectMemberId` | string newtype | 项目内承担身份 | 不等于 GlobalMember id |
| `ProjectMemberRef` | `project_member_id` | 引用项目成员承担 | 不接管 identity truth |
| `GlobalMemberRef` | string newtype 或 external ref wrapper | 指向 identity 成员 | 只读引用 |
| `BacklogId` / `BacklogRef` | id / ref | 正式工作全集身份 | 与 Project 一对一或由 Step 11 存储约束确定 |
| `WorkItemId` / `ChildWorkItemId` | string newtype | 正式工作身份 | 不等于 plan item / runtime step |
| `FormalWorkRef` | `WorkItem` / `ChildWorkItem` | dependency / iteration 的统一工作引用 | 必须指向已 formalized work |
| `SourceWorkRef` | `source_kind`、`external_ref`、`source_digest` | formalize / promote 来源 | 不得保存来源正文 |
| `ExternalEvidenceRef` | `evidence_kind`、`external_ref`、`verified_state` | 完成 / 阻塞 / 解除依据 | 不得保存 evidence body |
| `WorkTraceContextRef` | `trace_id: TraceId`;`request_id: Option<RequestId>` | 指向 L0-core trace / request metadata | 不替代 observability trace body |
| `ExternalReferenceRef` | `Member` / `MethodDefinition` / `SourceWork` / `Evidence` / `ProcessTimebox` typed variant | 本地 reference snapshot key | 只能由 typed ref conversion 构造,不得手写字符串 |
| `WorkTitle` | string newtype | Formal Work public title | trim 后 1..=160 UTF-8 chars;不得包含换行;空白折叠由 DTO validation 完成 |
| `WorkSearchText` | string newtype | formal work search text | trim 后 1..=120 UTF-8 chars;不得包含控制字符;不作为全文索引产品约束 |
| `WorkSearchCriteriaDigest` | string newtype | normalized `WorkSearchCriteria` stable digest | 由完整 criteria 的 canonical form 计算;必须包含 work_state、assignee_ref、source_kind、text_query;不得包含 page、actor、trace、request id 或 projection freshness |
| `FormalWorkRefSet` | `refs: Vec<FormalWorkRef>` | iteration / policy 的正式工作集合 | 非空;去重;同一 command 内顺序稳定;全部必须指向已 formalized work |
| `CapabilityRefSet` | `refs: Vec<CapabilityRef>` | member responsibility capability 摘要 | 只含 capability ref;空集合表示不要求能力,不表示未知 |
| `WorkTruthCursor` | `cursor: String` | committed Work truth source position | 由 repository / outbox / rebuild source 生成;不得与 `Version` 或 `PageToken` 比较 |
| `DerivedWorkViewRef` | `view_kind: DerivedWorkViewKind`;`scope_ref: DerivedWorkViewScopeRef` | projection freshness key | 由 query scope 稳定派生;不等于业务 truth id |
| `WorkTraceSubjectRef` | typed enum over project / member / backlog / formal work / promote / dependency / blocker / iteration / handoff | trace subject key | 只指向 Work-owned truth / history / handoff marker |
| `WorkAuditSubjectRef` | typed enum over Work truth subjects | audit trail subject key | 与 `WorkTraceSubjectRef` 同源,但只用于 audit trail |
| `WorkTraceRecordRefSet` | `trace_ids: Vec<WorkTraceId>` | audit trail 中 trace record 引用集合 | 只保存 trace id;不得复制 trace body |
| `TraceHandoffRef` | string newtype | trace handoff output pointer | 由 handoff port 返回;不等于 observability log id body |
| `TraceHandoffTargetRef` | `target_kind: TraceHandoffTargetKind`;`external_ref: ExternalSourceRef` | trace handoff target | 指向 observability / archive / diagnostic consumer;不保存目标配置 |
| `ArchiveHandoffRef` | string newtype | archive handoff output pointer | 由 archive handoff port 返回;不等于 archive 内容 |
| `ArchiveHandoffScope` | `scope_kind: ArchiveHandoffScopeKind`;`subject_refs: Vec<WorkTraceSubjectRef>`;`source_cursor: Option<WorkTruthCursor>` | archive handoff coverage | subject 非空;只含 Work refs / cursor;不含正文 |
| `ArchiveHandoffTargetRef` | `target_kind: ArchiveHandoffTargetKind`;`external_ref: ExternalSourceRef` | archive handoff target | 指向 archive boundary;不保存 archive body |
| `WorkReconciliationScopeRef` | `scope_kind: WorkReconciliationScopeKind`;`project_ref: Option<ProjectRef>`;`view_ref: Option<DerivedWorkViewRef>`;`reference_ref: Option<ExternalReferenceRef>` | reconciliation job scope | `Project` scope 必须带 `project_ref`;`View` scope 必须带 `view_ref`;`Reference` scope 必须带 `reference_ref` |
| `ExternalReferenceScope` | `scope_kind: ExternalReferenceScopeKind`;`project_ref: Option<ProjectRef>`;`reference_refs: Vec<ExternalReferenceRef>` | reference refresh scope | absent in job input means stale refs;explicit scope 不保存外部正文 |
| `JobRunId` | string newtype | operations job run identity | job trigger 提供或系统生成;同一 job retry 保持稳定 |

##### trace / audit / handoff shared schema

```rust
/// Subject affected by a Work trace record.
pub enum WorkTraceSubjectRef {
    /// Project subject.
    Project(ProjectRef),
    /// Backlog subject.
    Backlog(BacklogRef),
    /// Project member subject.
    ProjectMember(ProjectMemberRef),
    /// Formal work subject.
    FormalWork(FormalWorkRef),
    /// Promote result subject.
    PromoteResult(PromoteResultRef),
    /// Dependency or blocker subject.
    Relation(DependencyOrBlockerRef),
    /// Iteration subject.
    Iteration(IterationRef),
    /// Trace or archive handoff subject.
    Handoff(TraceHandoffRef),
}

/// Subject used to own an audit trail.
pub enum WorkAuditSubjectRef {
    /// Project audit subject.
    Project(ProjectRef),
    /// Backlog audit subject.
    Backlog(BacklogRef),
    /// Project member audit subject.
    ProjectMember(ProjectMemberRef),
    /// Formal work audit subject.
    FormalWork(FormalWorkRef),
    /// Promote result audit subject.
    PromoteResult(PromoteResultRef),
    /// Dependency or blocker audit subject.
    Relation(DependencyOrBlockerRef),
    /// Iteration audit subject.
    Iteration(IterationRef),
}

/// Set of trace records linked from an audit trail.
pub struct WorkTraceRecordRefSet {
    /// Trace record ids in append order.
    pub trace_ids: Vec<WorkTraceId>,
}

/// External trace handoff pointer.
pub struct TraceHandoffRef(pub String);

/// External archive handoff pointer.
pub struct ArchiveHandoffRef(pub String);

/// Intent produced before a trace handoff marker is persisted.
pub struct TraceHandoffIntent {
    /// Trace to hand off.
    pub trace_id: WorkTraceId,
    /// Archive or observability target.
    pub target_ref: TraceHandoffTargetRef,
    /// Subject covered by the handoff.
    pub subject_ref: WorkTraceSubjectRef,
}
```

| 类型 | 字段 / 形态 | 作用 | 约束 |
|---|---|---|---|
| `WorkTraceSubjectRef` | typed enum | trace subject | 只指向 Work-owned truth / history / handoff marker |
| `WorkAuditSubjectRef` | typed enum | audit trail subject | 不包含 handoff subject;handoff 另由 marker 管理 |
| `WorkTraceRecordRefSet` | `trace_ids` | audit trail trace refs | append order;不得复制 trace body |
| `TraceHandoffRef` | string newtype | trace handoff output pointer | 由 handoff port 返回 |
| `ArchiveHandoffRef` | string newtype | archive handoff output pointer | 由 archive handoff port 返回 |
| `TraceHandoffIntent` | trace / target / subject refs | trace handoff input | 不保存 observability log body |

##### low-level shared ref / helper schema

```rust
/// Safe short text stored by Work for protocol-visible summaries.
pub struct SafeSummaryText(pub String);

/// Opaque pointer to an external source boundary.
pub struct ExternalSourceRef {
    /// External system category.
    pub source_system: ExternalSourceSystem,
    /// Stable external id or URI-like pointer.
    pub external_id: String,
}

/// External source system category.
pub enum ExternalSourceSystem {
    /// Workspace or owner system.
    Workspace,
    /// Identity system.
    Identity,
    /// Method library system.
    MethodLibrary,
    /// Conversation system.
    Conversation,
    /// Runtime system.
    Runtime,
    /// Process system.
    Process,
    /// Governance system.
    Governance,
    /// Artifact system.
    Artifact,
    /// Archive or observability boundary.
    Archive,
}

/// Kind of external owner for a Work project.
pub enum ProjectOwnerKind {
    /// Workspace project owner.
    WorkspaceProject,
    /// Organization owner.
    Organization,
    /// External project owner.
    ExternalProject,
}

/// Project responsibility category used by Work policy.
pub enum ProjectResponsibilityKind {
    /// Person or agent accountable for project work.
    Owner,
    /// Contributor who can be assigned work.
    Contributor,
    /// Reviewer who can inspect or approve work.
    Reviewer,
    /// Observer with read-only responsibility.
    Observer,
}

/// Capability reference from identity or method policy.
pub struct CapabilityRef(pub String);

/// Method-library definition reference.
pub struct MethodDefinitionRef(pub String);

/// Method-library definition kind safe for Work policy.
pub enum MethodDefinitionKind {
    /// Task-like work definition.
    Task,
    /// Product or deliverable definition.
    Product,
    /// Process or timebox definition.
    Process,
    /// View or board profile definition.
    ViewProfile,
}

/// Process timebox reference.
pub struct ProcessTimeboxRef(pub String);

/// Safe summary resolved from Process for iteration opening.
pub struct ProcessTimeboxSummary {
    /// Process timebox reference resolved by the port.
    pub timebox_ref: ProcessTimeboxRef,
    /// Project scope that this timebox may bind to.
    pub project_ref: ProjectRef,
    /// Whether Process currently allows Work to open an iteration for this timebox.
    pub can_open_iteration: bool,
    /// Optional safe summary supplied by Process.
    pub summary: Option<SafeSummaryText>,
    /// Digest of the Process-owned timebox summary snapshot.
    pub source_digest: SourceDigest,
}

/// Digest supplied by an external source summary.
pub struct SourceDigest(pub String);

/// Evidence category safe for Work policy.
pub enum EvidenceKind {
    /// Completion evidence.
    Completion,
    /// Blocker resolution evidence.
    BlockerResolution,
    /// Governance evidence.
    Governance,
    /// Artifact evidence.
    Artifact,
}

/// Derived view category.
pub enum DerivedWorkViewKind {
    /// Project board projection.
    ProjectBoard,
    /// Member work projection.
    MemberWork,
    /// Iteration summary projection.
    IterationSummary,
    /// Search projection.
    Search,
}

/// Scope used to derive a stable projection key.
pub enum DerivedWorkViewScopeRef {
    /// Project-scoped view.
    Project(ProjectRef),
    /// Project-member-scoped view.
    ProjectMember(ProjectMemberRef),
    /// Iteration-scoped view.
    Iteration(IterationRef),
    /// Search-scoped view derived from a full WorkSearchCriteria digest.
    Search(ProjectRef, WorkSearchCriteriaDigest),
}

/// Reference to either a dependency or a blocker.
pub enum DependencyOrBlockerRef {
    /// Dependency reference.
    Dependency(WorkDependencyRef),
    /// Blocker reference.
    Blocker(WorkBlockerRef),
}

/// Safe blocker cause reference.
pub struct BlockerCauseRef {
    /// External source carrying the cause.
    pub source_ref: ExternalSourceRef,
    /// Optional evidence ref for the cause.
    pub evidence_ref: Option<ExternalEvidenceRef>,
}

/// Read-only blocker impact explanation.
pub struct BlockerImpactExplanation {
    /// Blocker reference.
    pub blocker_ref: WorkBlockerRef,
    /// Work affected by the blocker.
    pub affected_work_ref: FormalWorkRef,
    /// Safe summary text.
    pub summary: SafeSummaryText,
}

/// Work outbox event category derived from a truth change.
pub enum WorkOutboxEventKind {
    /// Project changed event.
    ProjectChanged,
    /// Backlog availability changed event.
    BacklogChanged,
    /// Project member changed event.
    ProjectMemberChanged,
    /// Work item changed event.
    WorkItemChanged,
    /// Promote result recorded event.
    PromoteResultRecorded,
    /// Dependency changed event.
    WorkDependencyChanged,
    /// Blocker changed event.
    WorkBlockerChanged,
    /// Iteration changed event.
    IterationChanged,
    /// Trace became available.
    WorkTraceAvailable,
    /// Derived view changed event.
    DerivedWorkViewChanged,
}

/// Publication reference returned by the outbox publisher.
pub struct OutboxPublicationRef(pub String);

/// Failure reason recorded for an outbox publish attempt.
pub struct OutboxFailureReason {
    /// Safe failure category.
    pub reason_kind: OutboxFailureReasonKind,
    /// Safe short message.
    pub message: SafeSummaryText,
}

/// Outbox publication failure category.
pub enum OutboxFailureReasonKind {
    /// Publisher returned a retryable error.
    Retryable,
    /// Publisher returned a terminal error.
    Terminal,
}
```

| 类型 | 字段 / 形态 | 作用 | 约束 |
|---|---|---|---|
| `SafeSummaryText` | string newtype | safe summary / reason text | trim 后 1..=240 UTF-8 chars;不得包含外部正文或 stack trace |
| `ExternalSourceRef` | `source_system`、`external_id` | external pointer | `external_id` trim 后非空;不保存 body |
| `ProjectOwnerKind` | enum | project owner category | 不代表 owner truth |
| `ProjectResponsibilityKind` | enum | project member policy category | 不改变 identity truth |
| `CapabilityRef` / `CapabilityRefSet` | string ref / ref set | capability summary | 只读 ref |
| `MethodDefinitionRef` / `MethodDefinitionKind` | ref / enum | method summary | 不保存 method definition body |
| `ProcessTimeboxRef` | string ref | process timebox pointer | 不保存 process body |
| `ProcessTimeboxSummary` | `timebox_ref`、`project_ref`、`can_open_iteration`、`summary`、`source_digest` | process timebox resolver safe summary | 归属 `contracts/refs.rs`;用于 `ProcessTimeboxResolution.summary` 和 OpenIteration validation;不得保存 process body;不得进入 `Iteration` truth;OpenIteration 不写 process timebox reference state;`source_digest` 必填 |
| `SourceDigest` | string digest | source summary verification | 格式由 resolver / tests 固定;Work 不解释 digest algorithm |
| `EvidenceKind` | enum | evidence category | 与 `EvidenceVerifiedState` 搭配使用 |
| `DerivedWorkViewKind` / `DerivedWorkViewScopeRef` | enum | projection key derivation | kind 与 scope 必须匹配;`Search` scope 必须使用 `WorkSearchCriteriaDigest`,不得只用 `WorkSearchText` |
| `DependencyOrBlockerRef` | enum | relation union ref | 不得手写字符串合并 |
| `BlockerCauseRef` | source/evidence refs | blocker cause | 不保存 governance / artifact 正文 |
| `BlockerImpactExplanation` | blocker/work/summary | read-only explanation | 不作为 truth change |
| `WorkOutboxEventKind` | enum | outbox event routing | 只能从 `WorkTruthChange` 派生 |
| `OutboxPublicationRef` | string ref | publish result pointer | 不保存 published payload |
| `OutboxFailureReason` | kind + safe message | publish failure marker | 不含 stack trace / payload body |

`ExternalReferenceRef` 正式转换函数:

| 函数签名 | 来源 | 用途 |
|---|---|---|
| `ExternalReferenceRef::from_member(member_ref: GlobalMemberRef) -> Self` | identity member ref | member capability snapshot / stale marker |
| `ExternalReferenceRef::from_method_definition(definition_ref: MethodDefinitionRef) -> Self` | method definition ref | method snapshot / stale marker |
| `ExternalReferenceRef::from_source_work(source_ref: SourceWorkRef) -> Self` | conversation / runtime / governance source | source reference state |
| `ExternalReferenceRef::from_evidence(evidence_ref: ExternalEvidenceRef) -> Self` | artifact / governance evidence | evidence reference state |
| `ExternalReferenceRef::from_process_timebox(timebox_ref: ProcessTimeboxRef) -> Self` | process timebox ref | process timing reference state |

##### shared target / reason / decision value objects

以下类型归属 `contracts/refs.rs`,可被 command DTO、domain method、event payload、trace / audit / history record 共同引用。reason 类型只保存安全解释引用或短枚举,不得保存外部正文。

```rust
/// Target lifecycle state requested for a Work project.
pub enum ProjectLifecycleTarget {
    /// Move the project to read-only mode.
    ReadOnly,
    /// Close the project for normal Work writes.
    Closed,
    /// Archive a closed project.
    Archived,
}

/// Target availability state requested for a backlog.
pub enum BacklogAvailabilityTarget {
    /// Reopen the backlog after maintenance.
    Open,
    /// Lock the backlog for maintenance.
    LockedForMaintenance,
}

/// Target responsibility state requested for a project member.
pub enum ResponsibilityTarget {
    /// Activate or resume the responsibility.
    Active,
    /// Pause the responsibility.
    Paused,
    /// Release the responsibility.
    Released,
}

/// Target lifecycle state requested for formal work.
pub enum WorkLifecycleTarget {
    /// Start work.
    InProgress,
    /// Mark work complete.
    Completed,
    /// Cancel work.
    Cancelled,
    /// Supersede work with another formal record.
    Superseded,
}

/// Review decision for a promote result.
pub enum PromoteReviewDecision {
    /// Accept the source into formal Work.
    Accept,
    /// Reject the source with an auditable reason.
    Reject(PromoteRejectReason),
}

/// Target state requested for a dependency.
pub enum DependencyTarget {
    /// Activate a proposed dependency.
    Active,
    /// Mark the dependency satisfied.
    Satisfied,
    /// Waive the dependency.
    Waived,
    /// Cancel the dependency.
    Cancelled,
}

/// Target lifecycle state requested for an iteration.
pub enum IterationLifecycleTarget {
    /// Start a committed iteration.
    InProgress,
    /// Close the iteration.
    Closed,
    /// Cancel the iteration.
    Cancelled,
}

/// Reason supplied for a project lifecycle transition.
pub struct ProjectLifecycleReason {
    /// Reason category.
    pub reason_kind: ProjectLifecycleReasonKind,
    /// Optional external evidence or decision reference.
    pub reason_ref: Option<ExternalEvidenceRef>,
    /// Optional safe short summary.
    pub note: Option<SafeSummaryText>,
}

/// Reason supplied for backlog maintenance transitions.
pub struct BacklogMaintenanceReason {
    /// Reason category.
    pub reason_kind: BacklogMaintenanceReasonKind,
    /// Optional external evidence or decision reference.
    pub reason_ref: Option<ExternalEvidenceRef>,
}

/// Reason supplied for project member responsibility transitions.
pub struct ProjectMemberReason {
    /// Reason category.
    pub reason_kind: ProjectMemberReasonKind,
    /// Optional external evidence or decision reference.
    pub reason_ref: Option<ExternalEvidenceRef>,
}

/// Reason supplied for formal work lifecycle transitions.
pub struct WorkLifecycleReason {
    /// Reason category.
    pub reason_kind: WorkLifecycleReasonKind,
    /// Formal work superseding this record when applicable.
    pub superseding_ref: Option<FormalWorkRef>,
    /// Optional external evidence or decision reference.
    pub reason_ref: Option<ExternalEvidenceRef>,
}

/// Reason supplied for a promote request.
pub struct PromoteReason {
    /// Reason category.
    pub reason_kind: PromoteReasonKind,
    /// Optional source summary reference.
    pub source_summary_ref: Option<SourceWorkRef>,
}

/// Reason supplied when a promote review rejects the source.
pub struct PromoteRejectReason {
    /// Rejection category.
    pub reason_kind: PromoteRejectReasonKind,
    /// Optional external evidence or decision reference.
    pub reason_ref: Option<ExternalEvidenceRef>,
}

/// Reason supplied when a dependency is linked.
pub struct DependencyReason {
    /// Reason category.
    pub reason_kind: DependencyReasonKind,
    /// Optional external evidence or decision reference.
    pub reason_ref: Option<ExternalEvidenceRef>,
}

/// Reason supplied when a dependency changes state.
pub struct DependencyChangeReason {
    /// Reason category.
    pub reason_kind: DependencyChangeReasonKind,
    /// Optional external evidence or decision reference.
    pub reason_ref: Option<ExternalEvidenceRef>,
    /// Optional blocker cause that produced this dependency change.
    pub blocker_cause_ref: Option<BlockerCauseRef>,
}

/// Reason supplied when blocker mitigation starts.
pub struct BlockerMitigationReason {
    /// Reason category.
    pub reason_kind: BlockerMitigationReasonKind,
    /// Optional external evidence or decision reference.
    pub reason_ref: Option<ExternalEvidenceRef>,
}

/// Reason supplied when a blocker record is closed.
pub struct BlockerCloseReason {
    /// Reason category.
    pub reason_kind: BlockerCloseReasonKind,
    /// Optional external evidence or decision reference.
    pub reason_ref: Option<ExternalEvidenceRef>,
}

/// Reason supplied when an iteration or commitment changes.
pub struct IterationChangeReason {
    /// Reason category.
    pub reason_kind: IterationChangeReasonKind,
    /// Optional external evidence or decision reference.
    pub reason_ref: Option<ExternalEvidenceRef>,
}

/// Reason supplied when an iteration closes.
pub struct IterationCloseReason {
    /// Reason category.
    pub reason_kind: IterationCloseReasonKind,
    /// Optional external evidence or decision reference.
    pub reason_ref: Option<ExternalEvidenceRef>,
}

/// Reason supplied when committed work is removed or adjusted.
pub struct CommitmentChangeReason {
    /// Reason category.
    pub reason_kind: CommitmentChangeReasonKind,
    /// Optional external evidence or decision reference.
    pub reason_ref: Option<ExternalEvidenceRef>,
}
```

| 类型 | 字段 / 形态 | 来源 | 用途 | 约束 |
|---|---|---|---|---|
| `ProjectLifecycleReason` | `reason_kind: ProjectLifecycleReasonKind`;`reason_ref: Option<ExternalEvidenceRef>`;`note: Option<SafeSummaryText>` | command body | project lifecycle audit / trace | `Archived` target 需要明确 close / archive reason |
| `BacklogMaintenanceReason` | `reason_kind: BacklogMaintenanceReasonKind`;`reason_ref: Option<ExternalEvidenceRef>` | command body | maintenance lock / reopen | 不得由 projection job 自动生成 |
| `ProjectMemberReason` | `reason_kind: ProjectMemberReasonKind`;`reason_ref: Option<ExternalEvidenceRef>` | command body | member responsibility transition | release / pause 必须有 reason kind |
| `WorkLifecycleReason` | `reason_kind: WorkLifecycleReasonKind`;`superseding_ref: Option<FormalWorkRef>`;`reason_ref: Option<ExternalEvidenceRef>` | command body | work lifecycle audit | `Completed` 由 `evidence_ref` 支撑;`Superseded` 必须带 `superseding_ref` |
| `PromoteReason` | `reason_kind: PromoteReasonKind`;`source_summary_ref: Option<SourceWorkRef>` | command / runtime event | promote policy input | 不代表 promote decision |
| `PromoteRejectReason` | `reason_kind: PromoteRejectReasonKind`;`reason_ref: Option<ExternalEvidenceRef>` | review command | reject path | 必须可追溯 |
| `DependencyReason` | `reason_kind: DependencyReasonKind`;`reason_ref: Option<ExternalEvidenceRef>` | `LinkWorkDependency` command body | dependency creation | 不得保存正文 |
| `DependencyChangeReason` | `reason_kind: DependencyChangeReasonKind`;`reason_ref: Option<ExternalEvidenceRef>`;`blocker_cause_ref: Option<BlockerCauseRef>` | `UpdateWorkDependencyState` command / blocker cause / link activation helper | dependency state transition and history | `Activated` target 使用 `DependencyChangeReasonKind::Activated`;`from_link_reason` 生成 `Activated`、继承 link reason 的 `reason_ref`、`blocker_cause_ref = None`;`from_blocker_cause` 只填 `blocker_cause_ref` |
| `BlockerMitigationReason` | `reason_kind: BlockerMitigationReasonKind`;`reason_ref: Option<ExternalEvidenceRef>` | future command / internal flow | blocker mitigating transition | P0 无 public command 时不得自行开放 API |
| `BlockerCloseReason` | `reason_kind: BlockerCloseReasonKind`;`reason_ref: Option<ExternalEvidenceRef>` | future command / internal flow | blocker close transition | 只允许 resolved 后 close |
| `IterationChangeReason` | `reason_kind: IterationChangeReasonKind`;`reason_ref: Option<ExternalEvidenceRef>` | command body / process event | iteration start / cancel / commitment change | 不保存 process body;不得用于 iteration close |
| `IterationCloseReason` | `reason_kind: IterationCloseReasonKind`;`reason_ref: Option<ExternalEvidenceRef>` | command body | iteration close | close 必须保留 reason |
| `CommitmentChangeReason` | `reason_kind: CommitmentChangeReasonKind`;`reason_ref: Option<ExternalEvidenceRef>` | command body | remove committed work | remove 必须保留 reason |

| enum | 变体 | Rustdoc 注释 |
|---|---|---|
| `ProjectLifecycleReasonKind` | `Policy`;`Maintenance`;`OwnerRequest`;`ArchivePrepared` | project lifecycle explanation category |
| `BacklogMaintenanceReasonKind` | `MaintenanceWindow`;`PolicyHold`;`ManualUnlock` | backlog availability explanation category |
| `ProjectMemberReasonKind` | `Assigned`;`CapabilityChanged`;`Paused`;`Released` | project member responsibility explanation category |
| `WorkLifecycleReasonKind` | `Start`;`CompletionEvidence`;`Cancellation`;`Superseded` | formal work lifecycle explanation category |
| `PromoteReasonKind` | `RuntimeRequest`;`ConversationSignal`;`GovernanceRecommendation`;`ManualReview` | promote request explanation category |
| `PromoteRejectReasonKind` | `NotCollaborativeWork`;`Duplicate`;`InsufficientEvidence`;`PolicyRejected` | promote rejection category |
| `DependencyReasonKind` | `ExplicitOrdering`;`EvidencePrerequisite`;`GovernanceRequirement`;`ManualReview` | dependency creation category |
| `DependencyChangeReasonKind` | `Activated`;`SatisfiedByEvidence`;`Waived`;`Cancelled`;`FromBlockerCause` | dependency change category |
| `BlockerMitigationReasonKind` | `PlanCreated`;`OwnerAction`;`ExternalDependency` | blocker mitigation category |
| `BlockerCloseReasonKind` | `ResolvedVerified`;`NoLongerApplies`;`Superseded` | blocker close category |
| `IterationChangeReasonKind` | `CommitmentCreated`;`CommitmentChanged`;`Started`;`Cancelled`;`ProcessSignal` | iteration change category |
| `IterationCloseReasonKind` | `Completed`;`Cancelled`;`TimeboxEnded`;`ManualClose` | iteration close category |
| `CommitmentChangeReasonKind` | `ScopeReduced`;`ScopeExpanded`;`DependencyChanged`;`ManualAdjustment` | commitment change category |

##### policy helper / truth summary value objects

这些对象是 domain policy 与 projection rebuild 的输入摘要。它们归属 `contracts/refs.rs` 或 `contracts/views.rs` 的共享 DTO 层,domain 只消费,不得把外部正文提升为 Work truth。

```rust
/// Scope used by Work truth policy checks.
pub struct WorkPolicyScope {
    /// Project scope for the check.
    pub project_ref: ProjectRef,
    /// Optional formal work affected by the check.
    pub work_ref: Option<FormalWorkRef>,
    /// Optional external source considered by the check.
    pub source_ref: Option<SourceWorkRef>,
}

/// Safe summary of current Work truth for policy checks.
pub struct WorkTruthSnapshot {
    /// Project covered by this snapshot.
    pub project_ref: ProjectRef,
    /// Project lifecycle state.
    pub lifecycle_state: ProjectLifecycleState,
    /// Backlog state when available.
    pub backlog_state: Option<BacklogState>,
    /// Current truth cursor.
    pub source_cursor: WorkTruthCursor,
}

/// Safe candidate summary for formal work admission.
pub struct FormalWorkCandidateSummary {
    /// Candidate title.
    pub title: WorkTitle,
    /// Source reference.
    pub source_ref: SourceWorkRef,
    /// Optional method definition reference.
    pub method_definition_ref: Option<MethodDefinitionRef>,
    /// Candidate assignee.
    pub assignee_ref: ProjectMemberRef,
}

/// Safe external source summary used by Work policy.
pub struct ExternalSourceSummary {
    /// Source reference.
    pub source_ref: SourceWorkRef,
    /// Source kind.
    pub source_kind: SourceWorkKind,
    /// Optional digest supplied by the source.
    pub source_digest: Option<SourceDigest>,
    /// Whether the resolver observed an external body that must be rejected.
    pub has_external_body: bool,
}

/// Decision returned by promote policy before a PromoteResult is mutated.
pub enum PromoteDecision {
    /// Promotion may proceed.
    Allow,
    /// Promotion must be rejected with a reason.
    Reject(PromoteRejectReason),
    /// Promotion duplicates an existing formal work record.
    Duplicate(FormalWorkRef),
}

/// Describes an accepted Work truth change for trace and outbox construction.
pub enum WorkTruthChange {
    /// A project was created.
    ProjectCreated(ProjectRef),
    /// A project lifecycle changed.
    ProjectLifecycleChanged(ProjectRef),
    /// A backlog availability state changed.
    BacklogAvailabilityChanged(BacklogRef),
    /// A project member responsibility changed.
    ProjectMemberChanged(ProjectMemberRef),
    /// A formal work item changed.
    WorkItemChanged(FormalWorkRef),
    /// A promote result was recorded.
    PromoteResultRecorded(PromoteResultRef),
    /// A dependency or blocker changed.
    WorkRelationChanged(DependencyOrBlockerRef),
    /// An iteration or commitment changed.
    IterationChanged(IterationRef),
    /// A trace or archive handoff marker changed.
    HandoffMarkerChanged(WorkTraceSubjectRef),
}
```

| 类型 | 字段 / 形态 | 作用 | 约束 |
|---|---|---|---|
| `WorkPolicyScope` | project/work/source refs | policy 作用域 | 至少包含 `project_ref`;optional ref 不得互相矛盾 |
| `WorkTruthSnapshot` | project state + backlog state + cursor | truth policy / rebuild source summary | 只读;不得从 projection 反推 |
| `FormalWorkCandidateSummary` | title/source/method/assignee | formal work policy input | 不含 external body |
| `ExternalSourceSummary` | source ref/kind/digest/body marker | forbidden-body guard | `has_external_body=true` 必须 reject |
| `PromoteDecision` | `Allow` / `Reject` / `Duplicate` | promote policy output | service 必须把 decision 转成正式 result / error |
| `WorkTruthChange` | typed truth change enum | trace / audit / outbox 统一输入 | 只能由已提交成功的 command / consumer flow 构造 |

`WorkTruthChange` 到 `WorkOutboxEventKind` 的正式映射:

| WorkTruthChange | WorkOutboxEventKind | outbound event payload |
|---|---|---|
| `ProjectCreated(ProjectRef)` | `ProjectChanged` | `ProjectChangedEvent` |
| `ProjectLifecycleChanged(ProjectRef)` | `ProjectChanged` | `ProjectChangedEvent` |
| `BacklogAvailabilityChanged(BacklogRef)` | `BacklogChanged` | `BacklogChangedEvent` |
| `ProjectMemberChanged(ProjectMemberRef)` | `ProjectMemberChanged` | `ProjectMemberChangedEvent` |
| `WorkItemChanged(FormalWorkRef)` | `WorkItemChanged` | `WorkItemChangedEvent` |
| `PromoteResultRecorded(PromoteResultRef)` | `PromoteResultRecorded` | `PromoteResultRecordedEvent` |
| `WorkRelationChanged(DependencyOrBlockerRef)` | `WorkDependencyChanged` 或 `WorkBlockerChanged` | `WorkDependencyChangedEvent` 或 `WorkBlockerChangedEvent` by typed ref variant |
| `IterationChanged(IterationRef)` | `IterationChanged` | `IterationChangedEvent` |
| `HandoffMarkerChanged(WorkTraceSubjectRef)` | `WorkTraceAvailable` | `WorkTraceAvailableEvent` |

`WorkOutboxRecord::from_truth_change(...)` 必须使用上表映射。若新增 `WorkTruthChange` variant,必须同批补 `WorkOutboxEventKind`、outbound payload schema、publisher dispatch、测试和验收映射;不得让实现侧自行选择复用哪一种 event。

##### projection / reconciliation helper DTO

```rust
/// Committed truth snapshot used to rebuild project-scoped projections.
pub struct ProjectWorkTruthSnapshot {
    /// Project truth.
    pub project: Project,
    /// Backlog truth when present.
    pub backlog: Option<Backlog>,
    /// Project members in scope.
    pub members: Vec<ProjectMember>,
    /// Formal work records in scope.
    pub work_items: Vec<FormalWorkRef>,
    /// Dependency and blocker refs in scope.
    pub relation_refs: Vec<DependencyOrBlockerRef>,
    /// Iteration refs in scope.
    pub iteration_refs: Vec<IterationRef>,
    /// Source cursor covered by this snapshot.
    pub source_cursor: WorkTruthCursor,
}

/// Projection rebuild output for one project.
pub struct ProjectProjectionBatch {
    /// Project board views to replace.
    pub board_views: Vec<ProjectBoardView>,
    /// Member work views to replace.
    pub member_views: Vec<MemberWorkView>,
    /// Iteration summary views to replace.
    pub iteration_views: Vec<IterationSummaryView>,
    /// Search projection records to replace.
    pub search_records: Vec<WorkSearchProjection>,
}

/// Report produced by reconciliation jobs.
pub struct ReconciliationReport {
    /// Scope inspected by the job.
    pub scope_ref: WorkReconciliationScopeRef,
    /// Truth cursor inspected.
    pub truth_cursor: WorkTruthCursor,
    /// Derived views found stale or failed.
    pub projection_gaps: Vec<DerivedWorkViewRef>,
    /// Outbox records requiring repair or retry.
    pub outbox_gaps: Vec<WorkOutboxId>,
    /// External references requiring refresh.
    pub reference_gaps: Vec<ExternalReferenceRef>,
}

/// Search projection record stored by projection repository.
pub struct WorkSearchProjection {
    /// Project searched.
    pub project_ref: ProjectRef,
    /// Formal work represented by this search row.
    pub work_ref: FormalWorkRef,
    /// Searchable title.
    pub title: WorkTitle,
    /// Current work state.
    pub work_state: WorkItemState,
    /// Current assignee when available.
    pub assignee_ref: Option<ProjectMemberRef>,
    /// Source cursor that produced this row.
    pub source_cursor: WorkTruthCursor,
}
```

| 类型 | 字段 / 形态 | 作用 | 约束 |
|---|---|---|---|
| `ProjectWorkTruthSnapshot` | committed truth refs + cursor | rebuild source | 由 repository 从 committed truth 读取;不得读取旧 projection |
| `ProjectProjectionBatch` | board/member/iteration/search projection DTO | rebuild replace input | 必须由 `ProjectWorkTruthSnapshot` 构造 |
| `ReconciliationReport` | scope/cursor/gap refs | reconciliation output | report 不是 business truth;不得修复 projection 本身 |
| `WorkSearchProjection` | project/work/title/state/assignee/cursor | internal search row | public response 通过 `WorkSearchResult` 映射 |

##### `SourceWorkKind`

```rust
/// Classifies an external work source that can be evaluated for formalization.
pub enum SourceWorkKind {
    /// A conversation-originated suggestion or context marker.
    Conversation,
    /// A runtime plan item or execution-local source.
    Runtime,
    /// An artifact or evidence-originated source.
    Artifact,
    /// A process planning or timing source.
    Process,
    /// A governance-originated recommendation or decision pointer.
    Governance,
}
```

| 变体 | Rustdoc 注释 | 作用 | 允许来源 | 允许去向 |
|---|---|---|---|---|
| `Conversation` | `A conversation-originated suggestion or context marker.` | 对话来源 | conversation event / command | formalize / promote review |
| `Runtime` | `A runtime plan item or execution-local source.` | runtime 来源 | runtime promote request | promote review |
| `Artifact` | `An artifact or evidence-originated source.` | artifact 来源 | artifact event / command | formalize / evidence policy |
| `Process` | `A process planning or timing source.` | process 来源 | process event | iteration / formalize review |
| `Governance` | `A governance-originated recommendation or decision pointer.` | governance 来源 | governance event | promote / evidence policy |

##### `EvidenceVerifiedState`

```rust
/// Indicates whether an external evidence reference is safe to use.
pub enum EvidenceVerifiedState {
    /// The evidence has not been checked by an accepted resolver.
    Unverified,
    /// The evidence was checked and may be used for completion or resolution.
    Verified,
    /// The evidence resolver failed or rejected the evidence.
    Rejected,
}
```

| 变体 | Rustdoc 注释 | 作用 | 允许来源 | 允许去向 |
|---|---|---|---|---|
| `Unverified` | `The evidence has not been checked by an accepted resolver.` | 未验证 | ref 创建 | `Verified` / `Rejected` |
| `Verified` | `The evidence was checked and may be used for completion or resolution.` | 可用于完成 / 解除 | resolver 成功 | 不适用 |
| `Rejected` | `The evidence resolver failed or rejected the evidence.` | 不可作为依据 | resolver 失败 | `Unverified` |

##### shared state enum

```rust
/// Lifecycle state for a Work project.
pub enum ProjectLifecycleState {
    /// The project accepts normal Work changes.
    Active,
    /// The project can be read but normal Work changes are blocked.
    ReadOnly,
    /// The project is closed for new Work changes.
    Closed,
    /// The project is archived and terminal for normal write paths.
    Archived,
}

/// Responsibility state for a member inside one Work project.
pub enum ProjectMemberResponsibilityState {
    /// The responsibility has been proposed but is not yet active.
    Proposed,
    /// The member can currently take project work.
    Active,
    /// The member responsibility is temporarily paused.
    Paused,
    /// The member responsibility has been released.
    Released,
}

/// Availability state for a project's formal backlog.
pub enum BacklogState {
    /// The backlog accepts formal work changes.
    Open,
    /// The backlog is locked for maintenance.
    LockedForMaintenance,
    /// The backlog is archived with its project.
    Archived,
}

/// Lifecycle state for a formal Work item.
pub enum WorkItemState {
    /// The work item is formally admitted into the backlog.
    Formalized,
    /// The work item is committed into an iteration scope.
    Committed,
    /// The work item is actively being worked.
    InProgress,
    /// The work item is completed with accepted evidence.
    Completed,
    /// The work item was cancelled before completion.
    Cancelled,
    /// The work item was superseded by another formal work record.
    Superseded,
}

/// Decision state for an external source promotion review.
pub enum PromoteResultState {
    /// The source is waiting for review.
    PendingReview,
    /// The source was accepted and linked to formal work.
    Accepted,
    /// The source was rejected with a reason.
    Rejected,
    /// The decision was superseded by a later review.
    Superseded,
}

/// Lifecycle state for a formal work dependency.
pub enum DependencyState {
    /// The dependency is proposed but not yet active.
    Proposed,
    /// The dependency is active.
    Active,
    /// The dependency was satisfied by evidence.
    Satisfied,
    /// The dependency was explicitly waived.
    Waived,
    /// The dependency was cancelled.
    Cancelled,
}

/// Lifecycle state for a work blocker.
pub enum BlockerState {
    /// The blocker is open.
    Open,
    /// Mitigation is in progress.
    Mitigating,
    /// The blocker was resolved by evidence.
    Resolved,
    /// The blocker record is closed.
    Closed,
}

/// Lifecycle state for a Work-owned iteration.
pub enum IterationState {
    /// The iteration is being planned.
    Planning,
    /// The iteration has a committed work scope.
    Committed,
    /// The iteration is in progress.
    InProgress,
    /// The iteration was closed.
    Closed,
    /// The iteration was cancelled.
    Cancelled,
}

/// Lifecycle state for an iteration commitment set.
pub enum CommitmentState {
    /// The commitment set is a candidate.
    Candidate,
    /// The commitment set is active.
    Committed,
    /// The commitment set was changed after initial commit.
    Changed,
    /// The commitment set is closed.
    Closed,
}

/// Freshness state for derived Work views.
pub enum DerivedFreshnessState {
    /// The derived view covers the current source cursor.
    Fresh,
    /// The derived view is behind committed Work truth.
    Stale,
    /// The derived view is currently rebuilding.
    Rebuilding,
    /// The last rebuild failed and the view is degraded.
    Failed,
}

/// Resolution state for an external reference snapshot.
pub enum ReferenceResolutionStatus {
    /// The reference has not been resolved.
    Unresolved,
    /// The reference is resolved.
    Resolved,
    /// The reference snapshot is stale.
    Stale,
    /// The reference failed to resolve.
    Failed,
}

/// Publication state for a committed Work outbox record.
pub enum OutboxPublicationState {
    /// The event is waiting for publication.
    Pending,
    /// The event was published successfully.
    Published,
    /// The last publication attempt failed.
    Failed,
}
```

| enum | 变体 | Rustdoc 注释 | 允许来源 | 允许去向 |
|---|---|---|---|---|
| `ProjectLifecycleState` | `Active` | `The project accepts normal Work changes.` | `Project::create` | `ReadOnly`、`Closed` |
| `ProjectLifecycleState` | `ReadOnly` | `The project can be read but normal Work changes are blocked.` | `Active` | `Closed` |
| `ProjectLifecycleState` | `Closed` | `The project is closed for new Work changes.` | `Active`、`ReadOnly` | `Archived` |
| `ProjectLifecycleState` | `Archived` | `The project is archived and terminal for normal write paths.` | `Closed` | 不适用 |
| `ProjectMemberResponsibilityState` | `Proposed` | `The responsibility has been proposed but is not yet active.` | `ProjectMember::assign` | `Active`、`Released` |
| `ProjectMemberResponsibilityState` | `Active` | `The member can currently take project work.` | `Proposed`、`Paused` | `Paused`、`Released` |
| `ProjectMemberResponsibilityState` | `Paused` | `The member responsibility is temporarily paused.` | `Active` | `Active`、`Released` |
| `ProjectMemberResponsibilityState` | `Released` | `The member responsibility has been released.` | `Proposed`、`Active`、`Paused` | 不适用 |
| `BacklogState` | `Open` | `The backlog accepts formal work changes.` | `Backlog::open_for_project`、maintenance reopen | `LockedForMaintenance`、`Archived` |
| `BacklogState` | `LockedForMaintenance` | `The backlog is locked for maintenance.` | `Open` | `Open` |
| `BacklogState` | `Archived` | `The backlog is archived with its project.` | `Open` | 不适用 |
| `WorkItemState` | `Formalized` | `The work item is formally admitted into the backlog.` | `WorkItem::formalize`、promote accept | `Committed`、`InProgress`、`Cancelled`、`Superseded` |
| `WorkItemState` | `Committed` | `The work item is committed into an iteration scope.` | `Formalized` | `InProgress`、`Cancelled`、`Superseded` |
| `WorkItemState` | `InProgress` | `The work item is actively being worked.` | `Formalized`、`Committed` | `Completed`、`Superseded` |
| `WorkItemState` | `Completed` | `The work item is completed with accepted evidence.` | `InProgress` | 不适用 |
| `WorkItemState` | `Cancelled` | `The work item was cancelled before completion.` | `Formalized`、`Committed` | 不适用 |
| `WorkItemState` | `Superseded` | `The work item was superseded by another formal work record.` | non-terminal states | 不适用 |
| `PromoteResultState` | `PendingReview` | `The source is waiting for review.` | `PromoteResult::evaluate` | `Accepted`、`Rejected`、`Superseded` |
| `PromoteResultState` | `Accepted` | `The source was accepted and linked to formal work.` | `PendingReview` | `Superseded` |
| `PromoteResultState` | `Rejected` | `The source was rejected with a reason.` | `PendingReview` | `Superseded` |
| `PromoteResultState` | `Superseded` | `The decision was superseded by a later review.` | `PendingReview`、`Accepted`、`Rejected` | 不适用 |
| `DependencyState` | `Proposed` | `The dependency is proposed but not yet active.` | `WorkDependency::link` | `Active`、`Cancelled` |
| `DependencyState` | `Active` | `The dependency is active.` | `Proposed` | `Satisfied`、`Waived`、`Cancelled` |
| `DependencyState` | `Satisfied` | `The dependency was satisfied by evidence.` | `Active` | 不适用 |
| `DependencyState` | `Waived` | `The dependency was explicitly waived.` | `Active` | 不适用 |
| `DependencyState` | `Cancelled` | `The dependency was cancelled.` | `Proposed`、`Active` | 不适用 |
| `BlockerState` | `Open` | `The blocker is open.` | `WorkBlocker::open` | `Mitigating`、`Resolved` |
| `BlockerState` | `Mitigating` | `Mitigation is in progress.` | `Open` | `Resolved` |
| `BlockerState` | `Resolved` | `The blocker was resolved by evidence.` | `Open`、`Mitigating` | `Closed` |
| `BlockerState` | `Closed` | `The blocker record is closed.` | `Resolved` | 不适用 |
| `IterationState` | `Planning` | `The iteration is being planned.` | `Iteration::open` | `Committed`、`Cancelled` |
| `IterationState` | `Committed` | `The iteration has a committed work scope.` | `Planning` | `InProgress`、`Cancelled` |
| `IterationState` | `InProgress` | `The iteration is in progress.` | `Committed` | `Closed` |
| `IterationState` | `Closed` | `The iteration was closed.` | `InProgress` | 不适用 |
| `IterationState` | `Cancelled` | `The iteration was cancelled.` | `Planning`、`Committed` | 不适用 |
| `CommitmentState` | `Candidate` | `The commitment set is a candidate.` | `IterationCommitment::from_candidates` | `Committed` |
| `CommitmentState` | `Committed` | `The commitment set is active.` | `Candidate` | `Changed`、`Closed` |
| `CommitmentState` | `Changed` | `The commitment set was changed after initial commit.` | `Committed` | `Closed` |
| `CommitmentState` | `Closed` | `The commitment set is closed.` | `Committed`、`Changed` | 不适用 |
| `DerivedFreshnessState` | `Fresh` | `The derived view covers the current source cursor.` | rebuild success | `Stale` |
| `DerivedFreshnessState` | `Stale` | `The derived view is behind committed Work truth.` | truth change / failed recovery | `Rebuilding` |
| `DerivedFreshnessState` | `Rebuilding` | `The derived view is currently rebuilding.` | `Stale`、`Failed` | `Fresh`、`Failed` |
| `DerivedFreshnessState` | `Failed` | `The last rebuild failed and the view is degraded.` | `Rebuilding` | `Rebuilding` |
| `ReferenceResolutionStatus` | `Unresolved` | `The reference has not been resolved.` | reference state init | `Resolved`、`Failed` |
| `ReferenceResolutionStatus` | `Resolved` | `The reference is resolved.` | resolver success | `Stale`、`Failed` |
| `ReferenceResolutionStatus` | `Stale` | `The reference snapshot is stale.` | upstream change / retention | `Resolved`、`Failed` |
| `ReferenceResolutionStatus` | `Failed` | `The reference failed to resolve.` | resolver failure | `Resolved` |
| `OutboxPublicationState` | `Pending` | `The event is waiting for publication.` | outbox create / retry | `Published`、`Failed` |
| `OutboxPublicationState` | `Published` | `The event was published successfully.` | publisher success | 不适用 |
| `OutboxPublicationState` | `Failed` | `The last publication attempt failed.` | publisher failure | `Pending` |

##### reference reason helper

| 函数签名 | 来源 | 用途 |
|---|---|---|
| `ReferenceStaleReason::rejected_evidence(evidence_ref: ExternalEvidenceRef) -> Self` | artifact / governance evidence rejected | `ArtifactEvidenceChanged` 将 evidence reference 标记为 stale / failed visible marker |

##### auxiliary failure / retry reasons

| 类型 | 字段 / 形态 | 来源 | 用途 | 约束 |
|---|---|---|---|---|
| `ProjectionFailureReason` | `message: String`;`source_cursor: WorkTruthCursor` | projection build / replace failure | `DerivedWorkViewState::mark_failed(...)` | 不含外部正文或 stack trace body |
| `ReferenceFailureReason` | `message: String`;`reference_ref: ExternalReferenceRef` | resolver / upstream unavailable / unsupported payload | `ReferenceResolutionState::mark_failed(...)` | 不删除最后成功快照 |
| `OutboxRetryReason` | `message: String`;`previous_failure: OutboxFailureReason` | publish retry policy | `WorkOutboxRecord::mark_pending_for_retry(...)` | 只允许 `Failed -> Pending` |

| 函数签名 | 来源 | 用途 |
|---|---|---|
| `ProjectionFailureReason::from_build_error(cursor: WorkTruthCursor, message: String) -> Self` | projection build / replace failure | rebuild job failed marker |
| `ReferenceFailureReason::from_resolver_error(reference_ref: ExternalReferenceRef, message: String) -> Self` | resolver / upstream failure | reference failed marker |
| `OutboxRetryReason::from_failure(previous_failure: OutboxFailureReason, message: String) -> Self` | outbox retry policy | failed outbox requeue marker |

#### 7.3 `domain/project.rs` object 契约

##### `Project`

```rust
/// Represents the Work-owned project subject and protects its lifecycle boundary.
pub struct Project {
    /// Stable Work project identity.
    pub project_id: ProjectId,
    /// External owner pointer without owner body.
    pub owner_ref: ProjectOwnerRef,
    /// Current lifecycle state.
    pub lifecycle_state: ProjectLifecycleState,
}
```

| 字段 | 类型 | 作用 | 约束 |
|---|---|---|---|
| `project_id` | `ProjectId` | Project truth identity | Work-owned |
| `owner_ref` | `ProjectOwnerRef` | 外部 owner 引用 | 不保存 owner 正文 |
| `lifecycle_state` | `ProjectLifecycleState` | 生命周期 | `Archived` 为普通写路径终态 |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `transition_lifecycle(&mut self, target: ProjectLifecycleTarget, reason: ProjectLifecycleReason, actor: ActorRef) -> Result<(), DomainError>` | 执行生命周期迁移 | target、reason、actor | `Result<(), DomainError>` | 不改变 owner truth |
| `close(&mut self, actor: ActorRef, reason: ProjectLifecycleReason) -> Result<(), DomainError>` | 关闭项目 | actor、reason | `Result<(), DomainError>` | 阻止新 Work 进入 |

| 函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `Project::create(project_id: ProjectId, spec: ProjectSpec, actor: ActorRef) -> Result<Self, DomainError>` | 创建 Active 项目 | project id、spec、actor | `Result<Self, DomainError>` | `CreateProject`;`project_id` 由 application 通过 `IdGeneratorPort.next_project_id()` 生成 |

不变量与禁止事项:

- 不代表 workspace project view、process instance 或 runtime context。
- `Archived` 后普通 command 不得改写 Work truth。

##### `ProjectMember`

```rust
/// Represents a GlobalMember responsibility inside one Work project.
pub struct ProjectMember {
    /// Stable project member responsibility id.
    pub project_member_id: ProjectMemberId,
    /// Owning project.
    pub project_id: ProjectId,
    /// Referenced identity member.
    pub member_ref: GlobalMemberRef,
    /// Current responsibility state.
    pub responsibility_state: ProjectMemberResponsibilityState,
}
```

| 字段 | 类型 | 作用 | 约束 |
|---|---|---|---|
| `project_member_id` | `ProjectMemberId` | 项目内承担身份 | 不等于 GlobalMember id |
| `project_id` | `ProjectId` | 所属项目 | 必须存在 |
| `member_ref` | `GlobalMemberRef` | identity 成员引用 | 不保存 identity 正文 |
| `responsibility_state` | `ProjectMemberResponsibilityState` | 承担状态 | `Released` 不可恢复 |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `activate(&mut self, snapshot: MemberCapabilitySnapshot, actor: ActorRef) -> Result<(), DomainError>` | 激活承担 | capability snapshot、actor | `Result<(), DomainError>` | snapshot 必须支持 spec |
| `pause(&mut self, reason: ProjectMemberReason, actor: ActorRef) -> Result<(), DomainError>` | 暂停承担 | reason、actor | `Result<(), DomainError>` | 不改变 GlobalMember |
| `resume(&mut self, snapshot: MemberCapabilitySnapshot, actor: ActorRef) -> Result<(), DomainError>` | 恢复承担 | snapshot、actor | `Result<(), DomainError>` | 必须重新校验能力 |
| `release(&mut self, reason: ProjectMemberReason, actor: ActorRef) -> Result<(), DomainError>` | 释放承担 | reason、actor | `Result<(), DomainError>` | 保留追溯 |

| 函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `ProjectMember::assign(project_member_id: ProjectMemberId, project_id: ProjectId, member_ref: GlobalMemberRef, spec: ProjectResponsibilitySpec) -> Result<Self, DomainError>` | 创建项目承担关系 | project member id、project、member、spec | `Result<Self, DomainError>` | `AssignProjectMember`;`project_member_id` 由 application 通过 `IdGeneratorPort.next_project_member_id()` 生成 |

##### `Backlog`

```rust
/// Owns the formal Work universe for one project.
pub struct Backlog {
    /// Stable backlog identity.
    pub backlog_id: BacklogId,
    /// Project that owns this backlog.
    pub project_id: ProjectId,
    /// Current availability state.
    pub backlog_state: BacklogState,
}
```

| 字段 | 类型 | 作用 | 约束 |
|---|---|---|---|
| `backlog_id` | `BacklogId` | 正式工作全集身份 | Work-owned |
| `project_id` | `ProjectId` | 所属项目 | 必须匹配 Project |
| `backlog_state` | `BacklogState` | availability 状态 | `Archived` 只读 |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `accept_work_item(&self, work_item: &WorkItem, actor: ActorRef) -> Result<(), DomainError>` | 校验接收正式工作 | work item、actor | `Result<(), DomainError>` | 不接收非正式来源 |
| `assert_can_accept(&self, intent: &FormalWorkIntent) -> Result<(), DomainError>` | 判断候选是否可进入 | intent | `Result<(), DomainError>` | 不修改状态 |
| `lock_for_maintenance(&mut self, reason: BacklogMaintenanceReason, actor: ActorRef) -> Result<(), DomainError>` | 维护锁定 | reason、actor | `Result<(), DomainError>` | 阻止新增 work |
| `reopen_after_maintenance(&mut self, reason: BacklogMaintenanceReason, actor: ActorRef) -> Result<(), DomainError>` | 解锁 | reason、actor | `Result<(), DomainError>` | 只从 maintenance 恢复 |
| `archive_with_project(&mut self, project_ref: ProjectRef, actor: ActorRef) -> Result<(), DomainError>` | 随项目归档 | project ref、actor | `Result<(), DomainError>` | 只能随 Project archive |

| 函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `Backlog::open_for_project(backlog_id: BacklogId, project_id: ProjectId, actor: ActorRef) -> Result<Self, DomainError>` | 创建正式工作全集 | backlog id、project、actor | `Result<Self, DomainError>` | `CreateProject`;`backlog_id` 由 application 通过 `IdGeneratorPort.next_backlog_id()` 生成 |

#### 7.4 `domain/work_item.rs` object 契约

##### `WorkItem`

```rust
/// Represents a formal collaborative work item admitted into a backlog.
pub struct WorkItem {
    /// Stable formal work id.
    pub work_item_id: WorkItemId,
    /// Owning backlog.
    pub backlog_id: BacklogId,
    /// Current assignee inside the project.
    pub assignee_ref: ProjectMemberRef,
    /// Current formal work lifecycle state.
    pub work_state: WorkItemState,
    /// Optional external completion evidence.
    pub completion_ref: Option<ExternalEvidenceRef>,
}
```

| 字段 | 类型 | 作用 | 约束 |
|---|---|---|---|
| `work_item_id` | `WorkItemId` | 正式工作身份 | Work-owned |
| `backlog_id` | `BacklogId` | 所属全集 | 必须属于同一 Project |
| `assignee_ref` | `ProjectMemberRef` | 当前承担者 | 必须 Active 或按 policy 可承担 |
| `work_state` | `WorkItemState` | 生命周期 | 终态不可普通恢复 |
| `completion_ref` | `Option<ExternalEvidenceRef>` | 完成依据 | `Completed` 必须有 verified evidence |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `assign(&mut self, member_ref: ProjectMemberRef, actor: ActorRef) -> Result<(), DomainError>` | 指派承担者 | member、actor | `Result<(), DomainError>` | 不改变 member truth |
| `mark_committed(&mut self, iteration_ref: IterationRef, actor: ActorRef) -> Result<(), DomainError>` | 标记进入承诺范围 | iteration、actor | `Result<(), DomainError>` | 只从 formalized 进入 committed |
| `transition_lifecycle(&mut self, target: WorkLifecycleTarget, reason: WorkLifecycleReason, evidence_ref: Option<ExternalEvidenceRef>, actor: ActorRef) -> Result<(), DomainError>` | 显式生命周期迁移 | target、reason、evidence、actor | `Result<(), DomainError>` | 完成必须有 evidence |
| `mark_completed(&mut self, evidence_ref: ExternalEvidenceRef, actor: ActorRef) -> Result<(), DomainError>` | 完成工作 | evidence、actor | `Result<(), DomainError>` | 不保存 evidence body |

| 函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `WorkItem::formalize(work_item_id: WorkItemId, backlog_id: BacklogId, intent: FormalWorkIntent, source_ref: SourceWorkRef, actor: ActorRef) -> Result<Self, DomainError>` | 从正式化意图创建 work | work item id、backlog、intent、source、actor | `Result<Self, DomainError>` | `CreateWorkItem` / promote accept;`work_item_id` 由 application 通过 `IdGeneratorPort.next_work_item_id()` 生成 |

##### `ChildWorkItem`

```rust
/// Represents a formal child work item split from a parent work item.
pub struct ChildWorkItem {
    /// Stable child work id.
    pub child_work_item_id: ChildWorkItemId,
    /// Parent formal work id.
    pub parent_work_item_id: WorkItemId,
    /// Source used for split or promotion.
    pub source_ref: SourceWorkRef,
    /// Current child work lifecycle state.
    pub work_state: WorkItemState,
    /// Completion evidence reference when the child work is completed.
    pub completion_ref: Option<ExternalEvidenceRef>,
}
```

| 字段 | 类型 | 作用 | 约束 |
|---|---|---|---|
| `child_work_item_id` | `ChildWorkItemId` | 子工作身份 | Work-owned |
| `parent_work_item_id` | `WorkItemId` | 父工作 | 必须存在且未终止到禁止拆分状态 |
| `source_ref` | `SourceWorkRef` | 来源引用 | 不保存 plan / runtime 正文 |
| `work_state` | `WorkItemState` | 生命周期 | 与 WorkItem 共用状态集合 |
| `completion_ref` | `Option<ExternalEvidenceRef>` | 完成依据 | `Completed` 必须有 verified evidence;不得保存 evidence body |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `attach_to_parent(&mut self, parent_id: WorkItemId, actor: ActorRef) -> Result<(), DomainError>` | 固定父子关系 | parent、actor | `Result<(), DomainError>` | 不形成多父 |
| `promote_from_source(&mut self, source_ref: SourceWorkRef, actor: ActorRef) -> Result<(), DomainError>` | 标记显式 promote 来源 | source、actor | `Result<(), DomainError>` | 不保存来源正文 |
| `mark_committed(&mut self, iteration_ref: IterationRef, actor: ActorRef) -> Result<(), DomainError>` | 标记子工作进入承诺范围 | iteration、actor | `Result<(), DomainError>` | 与 `WorkItem::mark_committed(...)` 同约束;只从 formalized 进入 committed |
| `transition_lifecycle(&mut self, target: WorkLifecycleTarget, reason: WorkLifecycleReason, evidence_ref: Option<ExternalEvidenceRef>, actor: ActorRef) -> Result<(), DomainError>` | 子工作生命周期迁移 | target、reason、evidence、actor | `Result<(), DomainError>` | 与 WorkItem 同约束;完成时写入 `completion_ref` |

| 函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `ChildWorkItem::create_child(child_work_item_id: ChildWorkItemId, parent_id: WorkItemId, intent: FormalWorkIntent, source_ref: SourceWorkRef) -> Result<Self, DomainError>` | 创建正式子工作 | child id、parent、intent、source | `Result<Self, DomainError>` | `CreateChildWorkItem`;`child_work_item_id` 由 application 通过 `IdGeneratorPort.next_child_work_item_id()` 生成 |

不变量与禁止事项:

- 不得把普通 plan item、tool execution step 或个人 checklist 自动升级为 child work。
- child work 仍是正式 Work truth,不是 runtime 执行步骤。
- `CommitIterationScopeFlow` 的 unified `FormalWorkRecord` candidate 可以是 root work 或 child work;child candidate 必须通过 `ChildWorkItem::mark_committed(...)` 进入 `Committed`,不得把 candidate set 收窄为 root-only。

#### 7.5 `domain/dependency.rs` object 契约

##### `WorkDependency`

```rust
/// Represents an explainable dependency between formal work records.
pub struct WorkDependency {
    /// Stable dependency id.
    pub dependency_id: WorkDependencyId,
    /// Work that must happen first.
    pub upstream_work_ref: FormalWorkRef,
    /// Work affected by the dependency.
    pub downstream_work_ref: FormalWorkRef,
    /// Current dependency lifecycle state.
    pub dependency_state: DependencyState,
}
```

| 字段 | 类型 | 作用 | 约束 |
|---|---|---|---|
| `dependency_id` | `WorkDependencyId` | 依赖身份 | Work-owned |
| `upstream_work_ref` | `FormalWorkRef` | 被依赖工作 | 必须存在 |
| `downstream_work_ref` | `FormalWorkRef` | 受影响工作 | 必须存在且不同于 upstream |
| `dependency_state` | `DependencyState` | 依赖状态 | 满足 / 豁免 / 取消需 reason 或 evidence |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `activate(&mut self, actor: ActorRef, reason: DependencyChangeReason) -> Result<(), DomainError>` | 激活依赖 | actor、state-change reason | `Result<(), DomainError>` | 只允许从 `Proposed` 进入 `Active`;reason.kind 必须为 `Activated`;不允许孤儿依赖 |
| `mark_satisfied(&mut self, evidence_ref: ExternalEvidenceRef, actor: ActorRef) -> Result<(), DomainError>` | 满足依赖 | evidence、actor | `Result<(), DomainError>` | evidence 必须可接受 |
| `waive(&mut self, reason: DependencyChangeReason, actor: ActorRef) -> Result<(), DomainError>` | 豁免依赖 | reason、actor | `Result<(), DomainError>` | 保留解释 |
| `cancel(&mut self, reason: DependencyChangeReason, actor: ActorRef) -> Result<(), DomainError>` | 取消依赖 | reason、actor | `Result<(), DomainError>` | 不删除历史 |

| 函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `WorkDependency::link(dependency_id: WorkDependencyId, upstream: FormalWorkRef, downstream: FormalWorkRef, reason: DependencyReason) -> Result<Self, DomainError>` | 建立依赖 | dependency id、upstream、downstream、reason | `Result<Self, DomainError>` | `LinkWorkDependency`;`dependency_id` 由 application 通过 `IdGeneratorPort.next_work_dependency_id()` 生成 |

##### `DependencyGraphSnapshot`

```rust
/// Project-scoped relation snapshot consumed by dependency graph policy.
pub struct DependencyGraphSnapshot {
    /// Project scope that produced this snapshot.
    pub project_ref: ProjectRef,
    /// Formal work dependency edges in this project.
    pub dependency_edges: Vec<(FormalWorkRef, FormalWorkRef)>,
    /// Currently active blockers by formal work.
    pub active_blockers: Vec<(FormalWorkRef, WorkBlockerRef)>,
}
```

| 字段 | 类型 | 作用 | 约束 |
|---|---|---|---|
| `project_ref` | `ProjectRef` | graph scope | 必须来自 `FormalWorkScope.project_ref` 或 explicit project command scope |
| `dependency_edges` | `Vec<(FormalWorkRef, FormalWorkRef)>` | cycle / duplicate edge policy input | 只含同一 project formal work refs;不含外部正文 |
| `active_blockers` | `Vec<(FormalWorkRef, WorkBlockerRef)>` | blocker-aware policy input | 只含 active blocker refs;不保存 cause / evidence body |

##### `WorkBlocker`

```rust
/// Represents a blocker that prevents or degrades progress on formal work.
pub struct WorkBlocker {
    /// Stable blocker id.
    pub blocker_id: WorkBlockerId,
    /// Formal work blocked by this record.
    pub blocked_work_ref: FormalWorkRef,
    /// Reference describing the blocker cause.
    pub cause_ref: BlockerCauseRef,
    /// Current blocker lifecycle state.
    pub blocker_state: BlockerState,
    /// Evidence that resolved the blocker, present only after successful resolution.
    pub resolved_evidence_ref: Option<ExternalEvidenceRef>,
}
```

| 字段 | 类型 | 作用 | 约束 |
|---|---|---|---|
| `blocker_id` | `WorkBlockerId` | 阻塞身份 | Work-owned |
| `blocked_work_ref` | `FormalWorkRef` | 被阻塞工作 | 必须存在 |
| `cause_ref` | `BlockerCauseRef` | 阻塞原因引用 | 不保存 governance / artifact 正文 |
| `blocker_state` | `BlockerState` | 阻塞状态 | close 必须在 resolved 后 |
| `resolved_evidence_ref` | `Option<ExternalEvidenceRef>` | 解除阻塞依据引用 | `Open` / `Mitigating` 时为空;`resolve(...)` 成功后必须写入 verified evidence ref;不保存 evidence 正文 |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `start_mitigation(&mut self, reason: BlockerMitigationReason, actor: ActorRef) -> Result<(), DomainError>` | 进入处理中 | reason、actor | `Result<(), DomainError>` | 保留阻塞解释 |
| `resolve(&mut self, evidence_ref: ExternalEvidenceRef, actor: ActorRef) -> Result<(), DomainError>` | 解除阻塞 | evidence、actor | `Result<(), DomainError>` | evidence 必须可接受;成功时 `blocker_state = Resolved` 且 `resolved_evidence_ref = Some(evidence_ref)` |
| `close(&mut self, reason: BlockerCloseReason, actor: ActorRef) -> Result<(), DomainError>` | 关闭阻塞记录 | reason、actor | `Result<(), DomainError>` | 不删除历史 |
| `explain_impact(&self) -> BlockerImpactExplanation` | 生成影响解释 | 无 | `BlockerImpactExplanation` | 只读 |

| 函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `WorkBlocker::open(blocker_id: WorkBlockerId, work_ref: FormalWorkRef, cause_ref: BlockerCauseRef, actor: ActorRef) -> Result<Self, DomainError>` | 创建阻塞记录 | blocker id、work、cause、actor | `Result<Self, DomainError>` | `OpenWorkBlocker`;`blocker_id` 由 application 通过 `IdGeneratorPort.next_work_blocker_id()` 生成 |

#### 7.6 `domain/iteration.rs` object 契约

##### `Iteration`

```rust
/// Represents a Work-owned commitment window for one project.
pub struct Iteration {
    /// Stable iteration id.
    pub iteration_id: IterationId,
    /// Project that owns the iteration.
    pub project_id: ProjectId,
    /// External process timebox pointer.
    pub timebox_ref: ProcessTimeboxRef,
    /// Current iteration lifecycle state.
    pub iteration_state: IterationState,
}
```

| 字段 | 类型 | 作用 | 约束 |
|---|---|---|---|
| `iteration_id` | `IterationId` | iteration 身份 | Work-owned |
| `project_id` | `ProjectId` | 所属项目 | 必须 Active / allowed |
| `timebox_ref` | `ProcessTimeboxRef` | process 节奏引用 | 不保存 process 正文 |
| `iteration_state` | `IterationState` | lifecycle | process event 不可直接 commit |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `commit(&mut self, commitment: IterationCommitment, actor: ActorRef) -> Result<(), DomainError>` | 固定承诺范围 | commitment、actor | `Result<(), DomainError>` | 候选必须来自 backlog |
| `start(&mut self, reason: IterationChangeReason, actor: ActorRef) -> Result<(), DomainError>` | 开始推进 | reason、actor | `Result<(), DomainError>` | 不改 process truth |
| `close(&mut self, reason: IterationCloseReason, actor: ActorRef) -> Result<(), DomainError>` | 关闭窗口 | reason、actor | `Result<(), DomainError>` | 关闭承诺集合 |
| `cancel(&mut self, reason: IterationChangeReason, actor: ActorRef) -> Result<(), DomainError>` | 取消窗口 | reason、actor | `Result<(), DomainError>` | 不删除 history |

| 函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `Iteration::open(iteration_id: IterationId, project_id: ProjectId, timebox_ref: ProcessTimeboxRef, actor: ActorRef) -> Result<Self, DomainError>` | 建立 iteration | iteration id、project、timebox、actor | `Result<Self, DomainError>` | `OpenIteration`;`iteration_id` 由 application 通过 `IdGeneratorPort.next_iteration_id()` 生成 |

##### `IterationCommitment`

```rust
/// Represents the formal work set committed into one iteration.
pub struct IterationCommitment {
    /// Stable commitment id.
    pub commitment_id: IterationCommitmentId,
    /// Owning iteration.
    pub iteration_id: IterationId,
    /// Formal work committed into the iteration.
    pub committed_work_refs: FormalWorkRefSet,
    /// Current commitment state.
    pub commitment_state: CommitmentState,
}
```

| 字段 | 类型 | 作用 | 约束 |
|---|---|---|---|
| `commitment_id` | `IterationCommitmentId` | 承诺集合身份 | Work-owned |
| `iteration_id` | `IterationId` | 所属 iteration | 必须存在 |
| `committed_work_refs` | `FormalWorkRefSet` | 承诺工作集合 | 只允许正式工作 |
| `commitment_state` | `CommitmentState` | 集合状态 | `Closed` 不可变更 |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `contains(&self, work_ref: FormalWorkRef) -> bool` | 判断是否包含工作 | work ref | `bool` | 只读 |
| `apply_change(&mut self, change_set: IterationCommitmentChangeSet, reason: IterationChangeReason, actor: ActorRef) -> Result<(), DomainError>` | 调整承诺集合 | changes、reason、actor | `Result<(), DomainError>` | 版本只增不减 |
| `remove(&mut self, work_ref: FormalWorkRef, reason: CommitmentChangeReason) -> Result<(), DomainError>` | 移出工作 | work、reason | `Result<(), DomainError>` | 必须记录原因 |
| `close(&mut self, reason: IterationCloseReason, actor: ActorRef) -> Result<(), DomainError>` | 关闭集合 | reason、actor | `Result<(), DomainError>` | 随 iteration close;reason 与 `Iteration::close(...)` 同源 |

| 函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `IterationCommitment::from_candidates(commitment_id: IterationCommitmentId, iteration_id: IterationId, candidates: FormalWorkRefSet, actor: ActorRef) -> Result<Self, DomainError>` | 从候选形成承诺集合 | commitment id、iteration、candidates、actor | `Result<Self, DomainError>` | `CommitIterationScope`;`commitment_id` 由 application 通过 `IdGeneratorPort.next_iteration_commitment_id()` 生成 |

#### 7.7 `domain/promote.rs` object 契约

##### `PromoteResult`

```rust
/// Records whether an external source was accepted into formal Work truth.
pub struct PromoteResult {
    /// Stable promote result id.
    pub promote_result_id: PromoteResultId,
    /// Evaluated source reference.
    pub source_ref: SourceWorkRef,
    /// Current promote decision state.
    pub result_state: PromoteResultState,
    /// Formal work created after acceptance.
    pub created_work_ref: Option<FormalWorkRef>,
}
```

| 字段 | 类型 | 作用 | 约束 |
|---|---|---|---|
| `promote_result_id` | `PromoteResultId` | promote 结果身份 | Work-owned |
| `source_ref` | `SourceWorkRef` | 被评估来源 | 不保存正文 |
| `result_state` | `PromoteResultState` | 判断状态 | accepted 必须绑定 work |
| `created_work_ref` | `Option<FormalWorkRef>` | 接受后正式工作 | rejected 时为空 |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `accept(&mut self, work_ref: FormalWorkRef, actor: ActorRef) -> Result<(), DomainError>` | 接受升级 | work、actor | `Result<(), DomainError>` | 绑定正式 work |
| `reject(&mut self, reason: PromoteRejectReason, actor: ActorRef) -> Result<(), DomainError>` | 拒绝升级 | reason、actor | `Result<(), DomainError>` | 保留来源和理由 |

| 函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `PromoteResult::evaluate(promote_result_id: PromoteResultId, source_ref: SourceWorkRef, reason: PromoteReason, actor: ActorRef) -> Result<Self, DomainError>` | 创建待审 promote 结果 | promote result id、source、reason、actor | `Result<Self, DomainError>` | `RequestWorkPromotion`;`promote_result_id` 由 application 通过 `IdGeneratorPort.next_promote_result_id()` 生成 |

##### `PendingPromoteIntake`

```rust
/// Records an inbound runtime promote request without creating Work truth.
pub struct PendingPromoteIntake {
    /// Runtime source that may later be promoted through an explicit command.
    pub source_ref: SourceWorkRef,
    /// Reason supplied by runtime.
    pub promote_reason: PromoteReason,
    /// Source event that produced the intake marker.
    pub source_event_id: SourceEventId,
}
```

| 字段 | 类型 | 作用 | 约束 |
|---|---|---|---|
| `source_ref` | `SourceWorkRef` | 待人工 / command 评审的 runtime 来源 | 不保存 runtime 正文 |
| `promote_reason` | `PromoteReason` | runtime 提供的升级理由 | 不等于正式 promote decision |
| `source_event_id` | `SourceEventId` | inbound dedup / trace 来源 | 不等于 Work outbox id |

| 函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `PendingPromoteIntake::from_runtime_event(source_ref: SourceWorkRef, promote_reason: PromoteReason, source_event_id: SourceEventId) -> Result<Self, DomainError>` | 从 runtime promote request 形成待处理 marker | source、reason、source event id | `Result<Self, DomainError>` | `ConsumeRuntimePromoteRequested`;不得创建 `PromoteResult` |

#### 7.8 `domain/reference.rs` object 契约

##### `ReferenceResolutionState`

```rust
/// Tracks whether an external Work-related reference is resolved, stale, or failed.
pub struct ReferenceResolutionState {
    /// External reference being tracked.
    pub reference_ref: ExternalReferenceRef,
    /// Current reference resolution status.
    pub resolution_state: ReferenceResolutionStatus,
    /// Last successful resolution timestamp.
    pub last_resolved_at: Option<Timestamp>,
}
```

| 字段 | 类型 | 作用 | 约束 |
|---|---|---|---|
| `reference_ref` | `ExternalReferenceRef` | 外部引用 | 不保存正文 |
| `resolution_state` | `ReferenceResolutionStatus` | 解析状态 | failed / stale 必须可见 |
| `last_resolved_at` | `Option<Timestamp>` | 最近成功解析时间 | unresolved 时为空 |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `mark_resolved(&mut self, resolved_at: Timestamp) -> Result<(), DomainError>` | 标记解析成功 | timestamp | `Result<(), DomainError>` | 不生成外部 truth |
| `mark_stale(&mut self, reason: ReferenceStaleReason) -> Result<(), DomainError>` | 标记过期 | reason | `Result<(), DomainError>` | 不删除已成立 Work truth |
| `mark_failed(&mut self, reason: ReferenceFailureReason, occurred_at: Timestamp) -> Result<(), DomainError>` | 标记解析失败 | failure reason、timestamp | `Result<(), DomainError>` | 不删除旧快照,failed 必须 query/job 可见 |

| 函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `ReferenceResolutionState::unresolved(reference_ref: ExternalReferenceRef) -> Self` | 创建未解析状态 | external ref | `Self` | event consumer / refresh job |

##### `MemberCapabilitySnapshot`

```rust
/// Stores a safe local summary of a member's project responsibility capability.
pub struct MemberCapabilitySnapshot {
    /// Referenced identity member.
    pub member_ref: GlobalMemberRef,
    /// Capability refs allowed for responsibility checks.
    pub capability_refs: CapabilityRefSet,
    /// Resolution state of this snapshot.
    pub snapshot_state: ReferenceResolutionState,
}
```

| 字段 | 类型 | 作用 | 约束 |
|---|---|---|---|
| `member_ref` | `GlobalMemberRef` | identity 成员引用 | 不保存 GlobalMember 正文 |
| `capability_refs` | `CapabilityRefSet` | 可承担能力引用 | 只含安全摘要 |
| `snapshot_state` | `ReferenceResolutionState` | 解析 / stale 状态 | stale 不得伪装 fresh |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `supports(&self, spec: &ProjectResponsibilitySpec) -> bool` | 判断能力满足承担要求 | responsibility spec | `bool` | 只读 |
| `mark_stale(&mut self, reason: ReferenceStaleReason) -> Result<(), DomainError>` | 标记快照过期 | reason | `Result<(), DomainError>` | 不改变 identity truth |

| 函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `MemberCapabilitySnapshot::from_identity(member_ref: GlobalMemberRef, capability_refs: CapabilityRefSet) -> Result<Self, DomainError>` | 从 identity 摘要形成快照 | member、capabilities | `Result<Self, DomainError>` | `ConsumeIdentityMemberChanged` |

##### `MethodDefinitionSnapshot`

```rust
/// Stores a safe local summary of a method-library definition.
pub struct MethodDefinitionSnapshot {
    /// Referenced method definition.
    pub definition_ref: MethodDefinitionRef,
    /// Definition category.
    pub definition_kind: MethodDefinitionKind,
    /// Resolution state of this snapshot.
    pub snapshot_state: ReferenceResolutionState,
}
```

| 字段 | 类型 | 作用 | 约束 |
|---|---|---|---|
| `definition_ref` | `MethodDefinitionRef` | method-library 定义引用 | 不保存定义正文 |
| `definition_kind` | `MethodDefinitionKind` | 定义类别 | task / product / process / view profile |
| `snapshot_state` | `ReferenceResolutionState` | 解析状态 | failed / stale 可见 |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `matches(&self, intent: &FormalWorkIntent) -> bool` | 判断与正式工作意图匹配 | intent | `bool` | 只读 |
| `mark_stale(&mut self, reason: ReferenceStaleReason) -> Result<(), DomainError>` | 标记过期 | reason | `Result<(), DomainError>` | 不改 method truth |

| 函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `MethodDefinitionSnapshot::from_method_library(definition_ref: MethodDefinitionRef, definition_kind: MethodDefinitionKind) -> Result<Self, DomainError>` | 从 method 摘要形成快照 | ref、kind | `Result<Self, DomainError>` | `ConsumeMethodDefinitionChanged` |

#### 7.9 `domain/projection.rs` object 契约

##### `DerivedWorkViewState`

```rust
/// Tracks freshness for a derived Work consumption view.
pub struct DerivedWorkViewState {
    /// Derived view reference.
    pub view_ref: DerivedWorkViewRef,
    /// Last source cursor covered by the view.
    pub source_cursor: WorkTruthCursor,
    /// Current freshness state.
    pub freshness_state: DerivedFreshnessState,
}
```

| 字段 | 类型 | 作用 | 约束 |
|---|---|---|---|
| `view_ref` | `DerivedWorkViewRef` | 派生视图引用 | 不等于 truth id |
| `source_cursor` | `WorkTruthCursor` | 已消费 truth 位置 | rebuild 成功后更新 |
| `freshness_state` | `DerivedFreshnessState` | 新鲜度 | query 必须暴露 stale / failed |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `mark_stale(&mut self, cursor: WorkTruthCursor) -> Result<(), DomainError>` | 标记过期 | cursor | `Result<(), DomainError>` | 不改 truth |
| `mark_rebuilding(&mut self, cursor: WorkTruthCursor) -> Result<(), DomainError>` | 标记重建中 | cursor | `Result<(), DomainError>` | 只能由 rebuild job 触发 |
| `mark_fresh(&mut self, cursor: WorkTruthCursor) -> Result<(), DomainError>` | 标记新鲜 | cursor | `Result<(), DomainError>` | 只能由 rebuild 成功触发 |
| `mark_failed(&mut self, cursor: WorkTruthCursor, reason: ProjectionFailureReason) -> Result<(), DomainError>` | 标记重建失败 | cursor、failure reason | `Result<(), DomainError>` | 不反写 truth,query 必须暴露 failed |

| 函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `DerivedWorkViewState::for_view(view_ref: DerivedWorkViewRef) -> Self` | 初始化派生状态 | view ref | `Self` | projection init |

##### projection / read model DTO 边界

`ProjectBoardView`、`MemberWorkView`、`IterationSummaryView`、`WorkSearchProjection` 和 `ReconciliationReport` 属于 `contracts/views.rs` 的 public read DTO / report DTO。它们只能从 committed Work truth / snapshot / projection state 构造,不得进入 `domain` repository 作为 truth。Step 7 / Step 8 必须为它们补 query / job response 字段闭环。

#### 7.10 `domain/audit.rs` / `domain/outbox.rs` object 契约

##### `WorkTraceRecord`

```rust
/// Records traceable context for an accepted Work truth change.
pub struct WorkTraceRecord {
    /// Stable trace record id.
    pub trace_id: WorkTraceId,
    /// Subject affected by the trace.
    pub subject_ref: WorkTraceSubjectRef,
    /// Core trace and request context pointer.
    pub trace_context_ref: WorkTraceContextRef,
}
```

| 字段 | 类型 | 作用 | 约束 |
|---|---|---|---|
| `trace_id` | `WorkTraceId` | 追溯记录身份 | Work-owned |
| `subject_ref` | `WorkTraceSubjectRef` | 被追溯对象 | 指向 Work truth / history |
| `trace_context_ref` | `WorkTraceContextRef` | L0-core trace / request 关联 | 不替代 observability trace body |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `relates_to(&self, subject_ref: WorkTraceSubjectRef) -> bool` | 判断关联 | subject | `bool` | 只读 |
| `prepare_handoff(&self, target_ref: TraceHandoffTargetRef) -> Result<TraceHandoffIntent, DomainError>` | 形成 trace handoff 交接意图 | observability / archive / diagnostic target | `Result<TraceHandoffIntent, DomainError>` | 不保存 observability log body 或 archive 正文;`ArchiveHandoffRef` 是 archive handoff port 输出指针,不得作为 trace intent 输入 |

| 函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `WorkTraceRecord::from_truth_change(trace_id: WorkTraceId, change: WorkTruthChange, trace_context_ref: WorkTraceContextRef) -> Result<Self, DomainError>` | 从已成立变化形成 trace | trace id、change、trace ref | `Result<Self, DomainError>` | command / consumer success;`trace_id` 由 application 通过 `IdGeneratorPort.next_trace_id()` 生成 |
| `TraceHandoffMarker::from_trace(trace_id: WorkTraceId, handoff_ref: TraceHandoffRef) -> Result<Self, DomainError>` | 记录 trace 已准备交接 | trace id、handoff ref | `Result<Self, DomainError>` | `PrepareWorkTraceHandoff`;不替代 observability log |
| `ArchiveHandoffIntent::from_work_summaries(summaries: WorkArchiveSummarySet, target_ref: ArchiveHandoffTargetRef) -> Result<Self, DomainError>` | 从 Work truth 摘要形成 archive handoff intent | summaries、target | `Result<Self, DomainError>` | `PrepareArchiveHandoff`;不保存 archive 长期正文 |
| `ArchiveHandoffMarker::from_archive_ref(scope: ArchiveHandoffScope, archive_ref: ArchiveHandoffRef) -> Result<Self, DomainError>` | 记录 archive handoff 已准备 | scope、archive ref | `Result<Self, DomainError>` | `PrepareArchiveHandoff` |

##### handoff marker objects

```rust
/// Records that a Work trace was handed off to an external boundary.
pub struct TraceHandoffMarker {
    /// Trace record prepared for handoff.
    pub trace_id: WorkTraceId,
    /// External handoff reference returned by the port.
    pub handoff_ref: TraceHandoffRef,
}

/// Carries Work summaries prepared for archive handoff.
pub struct ArchiveHandoffIntent {
    /// Work summaries eligible for archive handoff.
    pub summaries: WorkArchiveSummarySet,
    /// Archive target reference.
    pub target_ref: ArchiveHandoffTargetRef,
}

/// Summarizes Work-owned records eligible for archive handoff.
pub struct WorkArchiveSummarySet {
    /// Archive scope covered by the summaries.
    pub archive_scope: ArchiveHandoffScope,
    /// Work truth refs included in this handoff.
    pub truth_refs: Vec<WorkTraceSubjectRef>,
    /// Trace records related to the truth refs.
    pub trace_refs: Vec<WorkTraceId>,
    /// Source cursor covered by the summary set.
    pub source_cursor: WorkTruthCursor,
}

/// Records that an archive handoff was prepared.
pub struct ArchiveHandoffMarker {
    /// Archive scope covered by the marker.
    pub archive_scope: ArchiveHandoffScope,
    /// External archive handoff reference returned by the port.
    pub archive_ref: ArchiveHandoffRef,
}
```

| 对象 | 字段 | 字段来源 | 约束 |
|---|---|---|---|
| `TraceHandoffMarker` | `trace_id`、`handoff_ref` | `WorkTraceRecord` + `TraceHandoffPort` | 不保存 observability log body |
| `ArchiveHandoffIntent` | `summaries`、`target_ref` | committed Work truth summaries + job input | 不保存 archive 长期正文 |
| `WorkArchiveSummarySet` | `archive_scope`、`truth_refs`、`trace_refs`、`source_cursor` | truth repositories + audit repository + truth cursor | 只含 refs / cursor,不含正文 |
| `ArchiveHandoffMarker` | `archive_scope`、`archive_ref` | job input + `ArchiveHandoffPort` | marker 不代表 archive 拥有 Work truth |

##### `WorkAuditTrail`

```rust
/// Maintains the audit record chain for a Work subject.
pub struct WorkAuditTrail {
    /// Stable audit trail id.
    pub audit_trail_id: WorkAuditTrailId,
    /// Subject being audited.
    pub subject_ref: WorkAuditSubjectRef,
    /// Trace records associated with the subject.
    pub record_refs: WorkTraceRecordRefSet,
}
```

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `append(&mut self, record: WorkTraceRecord) -> Result<(), DomainError>` | 追加 trace 引用 | record | `Result<(), DomainError>` | 不复制外部正文 |
| `has_gap(&self) -> bool` | 判断审计缺口 | 无 | `bool` | 只读 |

| 函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `WorkAuditTrail::start_for_subject(subject_ref: WorkAuditSubjectRef) -> Self` | 初始化审计链 | subject | `Self` | truth 创建 |

##### `WorkOutboxRecord`

```rust
/// Represents a committed Work truth change pending publication or handoff.
pub struct WorkOutboxRecord {
    /// Stable outbox id.
    pub outbox_id: WorkOutboxId,
    /// Work event category.
    pub event_kind: WorkOutboxEventKind,
    /// Current publication state.
    pub publication_state: OutboxPublicationState,
}
```

| 字段 | 类型 | 作用 | 约束 |
|---|---|---|---|
| `outbox_id` | `WorkOutboxId` | outbox 记录身份 | 系统生成 |
| `event_kind` | `WorkOutboxEventKind` | 事件类别 | 只能来自已成立 truth change |
| `publication_state` | `OutboxPublicationState` | 发布状态 | 发布失败不回滚 truth |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `mark_published(&mut self, publication_ref: OutboxPublicationRef) -> Result<(), DomainError>` | 标记发布成功 | publication ref | `Result<(), DomainError>` | 不改 truth |
| `mark_failed(&mut self, reason: OutboxFailureReason) -> Result<(), DomainError>` | 标记发布失败 | reason | `Result<(), DomainError>` | 可重试 |
| `mark_pending_for_retry(&mut self, reason: OutboxRetryReason) -> Result<(), DomainError>` | 标记可重试待发布 | retry reason | `Result<(), DomainError>` | 只能从 failed 进入 pending,不改 truth |

| 函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `WorkOutboxRecord::from_truth_change(outbox_id: WorkOutboxId, change: WorkTruthChange) -> Result<Self, DomainError>` | 从已成立变化形成 outbox | outbox id、truth change | `Result<Self, DomainError>` | command / consumer commit;`outbox_id` 由 application 通过 `IdGeneratorPort.next_outbox_id()` 生成 |

##### history records

| 对象 | 字段 | 函数 | 禁止事项 |
|---|---|---|---|
| `PromoteDecisionRecord` | `decision_id: PromoteDecisionId`;`source_ref: SourceWorkRef`;`result_ref: PromoteResultRef` | `from_result(decision_id: PromoteDecisionId, result: PromoteResult, actor: ActorRef) -> Result<Self, DomainError>` | 不修改已成立 PromoteResult;`decision_id` 由 application 通过 `IdGeneratorPort.next_promote_decision_id()` 生成 |
| `DependencyChangeRecord` | `change_id: DependencyChangeId`;`relation_ref: DependencyOrBlockerRef`;`change_reason: DependencyChangeReason` | `from_dependency_change(change_id: DependencyChangeId, dependency: WorkDependency, reason: DependencyChangeReason) -> Result<Self, DomainError>`;`from_blocker_change(change_id: DependencyChangeId, blocker: WorkBlocker, reason: DependencyChangeReason) -> Result<Self, DomainError>`;`DependencyChangeReason::from_link_reason(reason: DependencyReason) -> Self`;`DependencyChangeReason::from_blocker_cause(cause_ref: BlockerCauseRef) -> Self` | 不替代当前 dependency / blocker truth;`from_link_reason` 生成 `Activated` state-change reason,继承 `reason_ref` 且不设置 `blocker_cause_ref`;`change_id` 由 application 通过 `IdGeneratorPort.next_dependency_change_id()` 生成 |
| `IterationChangeRecord` | `change_id: IterationChangeId`;`iteration_ref: IterationRef`;`changed_work_refs: FormalWorkRefSet` | `from_commitment(change_id: IterationChangeId, iteration: Iteration, commitment: IterationCommitment, actor: ActorRef) -> Result<Self, DomainError>` | 只记录 commitment scope / changed formal work refs history;不替代当前 commitment truth;`change_id` 由 application 通过 `IdGeneratorPort.next_iteration_change_id()` 生成;`UpdateIterationLifecycleFlow` 不得构造 lifecycle-only history 或空 `changed_work_refs` |

#### 7.11 `domain/policies.rs` object 契约

Policy object 只判断,不保存 truth,不访问 repository / adapter / config。

```rust
/// Guards Work truth ownership and forbidden-body invariants.
pub struct WorkTruthPolicy {
    /// Scope where the policy applies.
    pub policy_scope: WorkPolicyScope,
    /// Current Work truth summary.
    pub truth_snapshot: WorkTruthSnapshot,
}

/// Guards project lifecycle transitions.
pub struct ProjectLifecyclePolicy {
    /// Project being checked.
    pub project_ref: ProjectRef,
    /// Current lifecycle state.
    pub current_state: ProjectLifecycleState,
}

/// Guards formal work admission into a backlog.
pub struct FormalWorkPolicy {
    /// Backlog being maintained.
    pub backlog_ref: BacklogRef,
    /// Candidate summary used for checks.
    pub candidate_summary: FormalWorkCandidateSummary,
}
```

| Policy | 关键函数 | 参数 | 返回 | 不变量 |
|---|---|---|---|---|
| `WorkTruthPolicy` | `assert_truth_change_allowed(change: WorkTruthChange, actor: ActorRef) -> Result<(), DomainError>` | change、actor | `Result<(), DomainError>` | 不允许外部正文进入 Work truth |
| `WorkTruthPolicy` | `assert_no_external_body(source: ExternalSourceSummary) -> Result<(), DomainError>` | source summary | `Result<(), DomainError>` | 只接受 ref / digest / summary |
| `ProjectLifecyclePolicy` | `assert_lifecycle_transition_allowed(project: &Project, target: ProjectLifecycleTarget, reason: ProjectLifecycleReason, actor: ActorRef) -> Result<(), DomainError>` | project、target、reason、actor | `Result<(), DomainError>` | `Archived` 普通路径终态 |
| `MemberResponsibilityPolicy` | `assert_can_assign(member_ref: GlobalMemberRef, spec: ProjectResponsibilitySpec) -> Result<(), DomainError>` | member、spec | `Result<(), DomainError>` | 不改变 GlobalMember |
| `FormalWorkPolicy` | `assert_formal_work(intent: FormalWorkIntent, source_ref: SourceWorkRef) -> Result<(), DomainError>` | intent、source | `Result<(), DomainError>` | 拒绝 personal checklist / runtime step |
| `BacklogAvailabilityPolicy` | `assert_availability_transition_allowed(backlog: &Backlog, target: BacklogAvailabilityTarget, reason: BacklogMaintenanceReason, actor: ActorRef) -> Result<(), DomainError>` | backlog、target、reason、actor | `Result<(), DomainError>` | projection / job 不可隐式改状态 |
| `PromotePolicy` | `can_promote(source_ref: SourceWorkRef, reason: PromoteReason) -> PromoteDecision` | source、reason | `PromoteDecision` | 不跳过 promote 创建 Work |
| `DependencyGraphPolicy` | `assert_can_link(graph: &DependencyGraphSnapshot, upstream: FormalWorkRef, downstream: FormalWorkRef) -> Result<(), DomainError>` | graph snapshot、upstream、downstream | `Result<(), DomainError>` | 无孤儿、无不可解释循环;graph 由 `DependencyRepository.load_graph_snapshot(project_ref)` 读取 |
| `IterationCommitmentPolicy` | `assert_commitment_allowed(iteration: &Iteration, candidates: FormalWorkRefSet) -> Result<(), DomainError>` | iteration、candidates | `Result<(), DomainError>` | candidates 必须来自 backlog |
| `CompletionEvidencePolicy` | `assert_completion_evidence(work_ref: FormalWorkRef, evidence_ref: ExternalEvidenceRef) -> Result<(), DomainError>` | work、evidence | `Result<(), DomainError>` | evidence 必须 verified |
| `DerivedWorkViewPolicy` | `assert_read_only_projection(view_ref: DerivedWorkViewRef) -> Result<(), DomainError>` | view ref | `Result<(), DomainError>` | projection 不生成业务事实 |

#### 7.12 `application` service object 契约

本 Step 只定义 application service object 和应用层 helper 的形态;repository / port trait 的函数签名留给 Step 7。

```rust
/// Coordinates project commands inside application transaction boundaries.
pub struct ProjectCommandService<P, U, I, C> {
    /// Project repository port.
    pub project_repo: P,
    /// Unit of work factory.
    pub unit_of_work: U,
    /// Id generator.
    pub ids: I,
    /// Clock port.
    pub clock: C,
}

/// Carries a stable reference to an application result for idempotency.
pub struct ApplicationResultRef {
    /// Operation that produced the result.
    pub operation: OperationName,
    /// Stable result id or receipt id.
    pub result_id: ResultId,
}

/// Stores idempotency state for a write or job operation.
pub struct IdempotencyRecord {
    /// Operation-specific idempotency key.
    pub idempotency_key: IdempotencyKey,
    /// Operation name protected by this record.
    pub operation: OperationName,
    /// Canonical request digest.
    pub request_digest: RequestDigest,
    /// Existing result when completed.
    pub result_ref: Option<ApplicationResultRef>,
    /// Current idempotency status.
    pub status: IdempotencyStatus,
}

/// Application helper for Work query visibility decisions.
pub struct WorkQueryVisibilityPolicy;

/// Application-local resolved identity for query visibility decisions.
pub struct QueryActorMemberRef {
    /// Current actor from core metadata.
    pub actor_ref: ActorRef,
    /// Identity member ref resolved by `ActorMemberResolverPort`.
    pub member_ref: GlobalMemberRef,
}

/// Repository / port bundle used only by trace query visibility helpers.
pub struct TraceVisibilityDeps<'a> {
    pub actor_member_resolver: &'a dyn ActorMemberResolverPort,
    pub member_repo: &'a dyn ProjectMemberRepository,
    pub backlog_repo: &'a dyn BacklogRepository,
    pub work_repo: &'a dyn WorkItemRepository,
    pub promote_repo: &'a dyn PromoteRepository,
    pub dependency_repo: &'a dyn DependencyRepository,
    pub iteration_repo: &'a dyn IterationRepository,
    pub audit_repo: &'a dyn AuditRepository,
}
```

| Service object | 责任 | 主要依赖 | 禁止事项 |
|---|---|---|---|
| `ProjectCommandService` | create / lifecycle project orchestration | project repo、backlog repo、audit、outbox、UoW、id、clock、idempotency | 不访问 infra concrete adapter |
| `ProjectMemberCommandService` | assign / pause / resume / release member responsibility | member repo、member reference resolver、audit、outbox | 不改 identity truth |
| `WorkItemCommandService` | create / child / lifecycle WorkItem | backlog repo、work repo、policy、audit、outbox | 不保存 plan / runtime body |
| `PromoteCommandService` | request / review promote | promote repo、source resolver、work repo | 不绕过 explicit promote |
| `DependencyBlockerService` | dependency / blocker command | dependency repo、evidence resolver、graph policy | 不生成 governance decision |
| `IterationCommandService` | open / commit / update iteration | iteration repo、work repo、member capacity resolver | 不改 process truth |
| `AuthorizedWorkQueryService` | authorized facts / board / trace query | project / member / backlog / work / promote / dependency / iteration / audit repo、projection store、`ActorMemberResolverPort`、`WorkQueryVisibilityPolicy` | query no-write;不得解释 `ActorContext.role_refs` 为权限;不得保存 identity / governance 正文 |
| `WorkDerivedMaintenanceService` | projection rebuild / stale / reconciliation | truth repo、projection store、reference store | 不修复 business truth |

| Helper | 字段 | 约束 |
|---|---|---|
| `ResultId` | string newtype | 由 `IdGeneratorPort.next_result_id()` 生成;只用于 stored result surface |
| `ApplicationResultRef` | `operation`、`result_id` | duplicate idempotency 必须返回同一 result ref;必须可由 `CommandResultRepository.get_result(...)` 读回原 result surface |
| `IdempotencyRecord` | `idempotency_key`、`operation`、`request_digest`、`result_ref`、`status` | conflict 由 digest 不同判定 |
| `RequestDigest` | canonical hash string | 由 Command / Job canonical payload 生成 |
| `IdempotencyStatus` | `Reserved` / `Completed` / `Conflict` | `Completed` 不可回到 `Reserved` |
| `WorkQueryVisibilityPolicy` | stateless application helper | 只承载 query visibility helper 函数;不进入 domain;不保存状态;不访问 concrete infra |
| `QueryActorMemberRef` | `actor_ref`、`member_ref` | 只由 `ActorMemberResolverPort.resolve_actor_member(...)` 构造;用于 query 可见性裁决;不得把 `ActorRef.actor_id` 字符串强转为 `GlobalMemberRef` |
| `TraceVisibilityDeps` | actor-member resolver + member / backlog / work / promote / dependency / iteration / audit repo | 只作为 application helper 参数分组;不进入 contracts;不得隐藏新增持久化依赖 |

##### Authorized query visibility helper 契约

`AuthorizedWorkQueryService` 的授权 helper 属于 application 层,不进入 domain policy,也不生成 public DTO。helper 只读 repository / resolver port,不 begin UoW,不写 audit、outbox、idempotency、projection freshness 或 reference state。

| helper | 签名 | 读取来源 | 成功条件 | 失败映射 |
|---|---|---|---|---|
| `resolve_query_actor_member` | `async fn resolve_query_actor_member(actor: &ActorContext, actor_member_resolver: &dyn ActorMemberResolverPort) -> Result<QueryActorMemberRef, ApplicationError>` | `ActorMemberResolverPort.resolve_actor_member(actor)` | 外层可信 actor 可解析到 `GlobalMemberRef` | `PortError::NotFound` / `Rejected` -> `ApplicationError::NotVisible`;`PortError::Unavailable` -> `ApplicationError::TemporarilyUnavailable` |
| `authorize_project_read` | `async fn authorize_project_read(actor: &ActorContext, project_ref: ProjectRef, actor_member_resolver: &dyn ActorMemberResolverPort, member_repo: &dyn ProjectMemberRepository) -> Result<ProjectMemberRef, ApplicationError>` | actor-member resolver + `ProjectMemberRepository.get_by_member(project_ref, member_ref)` | 找到同一 project 的 ProjectMember,且 `responsibility_state` 为 `Active` 或 `Paused` | actor 未解析、member 缺失、`Proposed` / `Released` -> `NotVisible`;repo unavailable -> `TemporarilyUnavailable` |
| `authorize_work_read` | `async fn authorize_work_read(actor: &ActorContext, scope: &FormalWorkScope, actor_member_resolver: &dyn ActorMemberResolverPort, member_repo: &dyn ProjectMemberRepository) -> Result<ProjectMemberRef, ApplicationError>` | `FormalWorkScope.project_ref` + project read helper | formal work 所属 project 对 actor 可见 | 同 `authorize_project_read` |
| `authorize_member_work_read` | `async fn authorize_member_work_read(actor: &ActorContext, target_member: &ProjectMember, actor_member_resolver: &dyn ActorMemberResolverPort, member_repo: &dyn ProjectMemberRepository) -> Result<ProjectMemberRef, ApplicationError>` | target `ProjectMember.project_id` + project read helper | actor 在 target member 所属 project 有 `Active` / `Paused` 承担;target member 自身为 `Active` / `Paused` 时才返回其 work projection | target `Proposed` / `Released` 或 actor 不可见 -> `NotVisible` |
| `authorize_iteration_read` | `async fn authorize_iteration_read(actor: &ActorContext, iteration: &Iteration, actor_member_resolver: &dyn ActorMemberResolverPort, member_repo: &dyn ProjectMemberRepository) -> Result<ProjectMemberRef, ApplicationError>` | `Iteration.project_id` + project read helper | iteration 所属 project 对 actor 可见 | 同 `authorize_project_read` |
| `authorize_trace_read` | `async fn authorize_trace_read(actor: &ActorContext, subject_ref: WorkTraceSubjectRef, deps: &TraceVisibilityDeps) -> Result<ProjectMemberRef, ApplicationError>` | subject scope 解析表 + project read helper | trace subject 可解析到 actor 可见 project | subject scope 缺失、未接受 promote、未知 handoff marker、actor 不可见 -> `NotVisible`;repo unavailable -> `TemporarilyUnavailable` |

`ProjectMemberResponsibilityState` 的 query 可见性规则固定为:

| state | query 可见性 |
|---|---|
| `Active` | 可读取该 project 范围的 Work query |
| `Paused` | 可读取历史和当前 project 范围的 Work query,但不表示可承担新 work |
| `Proposed` | 不可读取;返回 `NotVisible` |
| `Released` | 不可读取;返回 `NotVisible` |

`authorize_trace_read(...)` 的 subject scope 解析表:

| `WorkTraceSubjectRef` variant | project scope 解析来源 | 缺失 / 不可解析 |
|---|---|---|
| `Project(project_ref)` | `project_ref` | project missing 时 query surface `Missing`;actor 不可见时 `NotVisible` |
| `Backlog(backlog_ref)` | `BacklogRepository.get(backlog_ref).project_id` | `NotVisible` |
| `ProjectMember(project_member_ref)` | `ProjectMemberRepository.get(project_member_ref).project_id` | `NotVisible` |
| `FormalWork(work_ref)` | `WorkItemRepository.get_formal_work_scope(work_ref).project_ref` | `NotVisible` |
| `PromoteResult(promote_result_ref)` | `PromoteRepository.get(promote_result_ref).created_work_ref` -> `WorkItemRepository.get_formal_work_scope(work_ref).project_ref` | result missing、`created_work_ref = None` 或 scope missing -> `NotVisible` |
| `Relation(Dependency(ref))` | `DependencyRepository.get_dependency(ref).downstream_work_ref` -> `WorkItemRepository.get_formal_work_scope(work_ref).project_ref` | `NotVisible` |
| `Relation(Blocker(ref))` | `DependencyRepository.get_blocker(ref).blocked_work_ref` -> `WorkItemRepository.get_formal_work_scope(work_ref).project_ref` | `NotVisible` |
| `Iteration(iteration_ref)` | `IterationRepository.get_iteration(iteration_ref).project_id` | `NotVisible` |
| `Handoff(handoff_ref)` | `AuditRepository.get_trace_handoff_marker(handoff_ref).trace_id` -> `AuditRepository.get_trace_record(trace_id).subject_ref` -> recursive subject scope | marker / trace missing or recursion cannot resolve -> `NotVisible` |

P0 不允许 query path 使用 `ActorContext.role_refs`、`ActorKind::System`、`ActorKind::Integration` 或 project owner ref 绕过 membership 可见性。需要系统级或治理级读取时,必须在后续版本补正式 trusted source actor 例外、入口协议、non-bypass gates 和测试切口。

#### 7.13 `infra` / entry module object 契约

```rust
/// Runtime configuration root for the Work implementation.
pub struct WorkRuntimeConfig {
    /// Store configuration.
    pub store: WorkStoreConfig,
    /// Command and query boundary configuration.
    pub boundary: WorkBoundaryConfig,
    /// Idempotency and event deduplication configuration.
    pub idempotency: WorkIdempotencyConfig,
    /// Projection and rebuild configuration.
    pub projection: WorkProjectionConfig,
    /// Operations job configuration.
    pub jobs: WorkJobConfig,
    /// External seam configuration.
    pub external: WorkExternalConfig,
    /// Outbox publisher configuration.
    pub outbox: WorkOutboxConfig,
    /// Trace and archive handoff configuration.
    pub handoff: WorkHandoffConfig,
    /// Runtime feature switches that may only affect derived / peripheral behavior.
    pub features: WorkFeatureConfig,
}

/// Store configuration loaded by `infra/config.rs`.
pub struct WorkStoreConfig {
    /// Store adapter selected for Work-owned truth and support stores.
    pub adapter_kind: WorkStoreAdapterKind,
    /// Transaction and unit-of-work operation timeout.
    pub transaction_timeout: Duration,
    /// Project owner uniqueness policy.
    pub project_owner_uniqueness: ProjectOwnerUniquenessPolicy,
}

/// Command and query boundary configuration.
pub struct WorkBoundaryConfig {
    /// Maximum accepted command body size in bytes.
    pub max_command_body_bytes: ByteSize,
    /// Maximum accepted query page limit.
    pub max_page_limit: PageLimit,
    /// Query read timeout.
    pub query_read_timeout: Duration,
}

/// Idempotency and deduplication retention configuration.
pub struct WorkIdempotencyConfig {
    /// Command idempotency record retention.
    pub command_retention: Duration,
    /// Inbound event deduplication record retention.
    pub event_dedup_retention: Duration,
    /// Maximum age for reserved / unknown idempotency records.
    pub reserved_record_max_age: Duration,
}

/// Projection store and rebuild configuration.
pub struct WorkProjectionConfig {
    /// Projection adapter selected for derived views.
    pub adapter_kind: WorkProjectionAdapterKind,
    /// Threshold after which a projection is surfaced as stale.
    pub stale_threshold: Duration,
    /// Replace scope used by projection rebuild jobs.
    pub replace_scope: ProjectionReplaceScope,
}

/// Operations job configuration.
pub struct WorkJobConfig {
    /// Default job batch size.
    pub default_batch_size: BatchSize,
    /// Maximum job parallelism.
    pub max_parallelism: NonZeroUsize,
    /// Retry limit for retry-capable job items.
    pub retry_limit: RetryLimit,
    /// Timeout for a single job run.
    pub job_timeout: Duration,
}

/// External resolver seam configuration.
pub struct WorkExternalConfig {
    /// Identity resolver configuration.
    pub identity: ExternalAdapterConfig,
    /// Method library resolver configuration.
    pub method_library: ExternalAdapterConfig,
    /// Source work resolver configuration.
    pub source_work: ExternalAdapterConfig,
    /// Evidence resolver configuration.
    pub evidence: ExternalAdapterConfig,
    /// Process timebox resolver configuration.
    pub process_timebox: ExternalAdapterConfig,
}

/// Outbox publisher configuration.
pub struct WorkOutboxConfig {
    /// Outbox publish batch size.
    pub publish_batch_size: BatchSize,
    /// Retry policy for outbox publication attempts.
    pub publish_retry: RetryPolicyConfig,
    /// Publisher adapter configuration.
    pub publisher: ExternalAdapterConfig,
}

/// Trace / archive handoff adapter configuration.
pub struct WorkHandoffConfig {
    /// Trace handoff target configuration.
    pub trace_target: HandoffTargetConfig,
    /// Archive handoff target configuration.
    pub archive_target: HandoffTargetConfig,
}

/// Feature switches that cannot change core truth behavior.
pub struct WorkFeatureConfig {
    /// Enables derived views while preserving query no-write behavior.
    pub derived_views_enabled: bool,
    /// Enables advanced search only when the P0 search contract and backend exist.
    pub advanced_search_enabled: bool,
}

/// Local configuration duration parsed from JSON / env.
pub struct Duration {
    /// Positive duration in milliseconds.
    pub millis: u64,
}

/// Local byte-size configuration value.
pub struct ByteSize {
    /// Positive byte count.
    pub bytes: u64,
}

/// Local page-limit configuration value.
pub struct PageLimit {
    /// Positive page limit.
    pub value: u32,
}

/// Local retry-limit configuration value.
pub struct RetryLimit {
    /// Retry attempts. Job retry limit allows zero; retry policy max attempts must be >= 1.
    pub attempts: u32,
}

/// Retry policy configuration for outbox publishing.
pub struct RetryPolicyConfig {
    /// Maximum attempts for one publish operation.
    pub max_attempts: RetryLimit,
    /// Base retry delay.
    pub base_delay: Duration,
    /// Maximum retry delay.
    pub max_delay: Duration,
}

/// Generic configured external seam adapter settings.
pub struct ExternalAdapterConfig {
    /// Adapter mode.
    pub adapter_kind: ExternalAdapterKind,
    /// Endpoint reference for configured adapters.
    pub endpoint_ref: Option<EndpointRef>,
    /// Credential reference for configured adapters.
    pub credential_ref: Option<CredentialRef>,
    /// Optional source reference used by resolver-specific adapters.
    pub source_ref: Option<AdapterSourceRef>,
}

/// Handoff adapter settings.
pub struct HandoffTargetConfig {
    /// Adapter mode.
    pub adapter_kind: HandoffAdapterKind,
    /// Target reference for configured handoff adapters.
    pub target_ref: Option<TargetRef>,
    /// Credential reference for configured handoff adapters.
    pub credential_ref: Option<CredentialRef>,
}

pub enum WorkStoreAdapterKind {
    InMemory,
}

pub enum WorkProjectionAdapterKind {
    InMemory,
}

pub enum ProjectOwnerUniquenessPolicy {
    NotUnique,
}

pub enum ProjectionReplaceScope {
    ProjectProjectionSet,
}

pub enum ExternalAdapterKind {
    Fake,
    Configured,
}

pub enum HandoffAdapterKind {
    Fake,
    Configured,
}

pub struct EndpointRef(String);
pub struct SecretRef(String);
pub struct CredentialRef(String);
pub struct AdapterSourceRef(String);
pub struct TargetRef(String);

/// Assembles repositories, adapters, and application services.
pub struct WorkRuntimeBuilder {
    /// Runtime configuration.
    pub config: WorkRuntimeConfig,
}
```

| 对象 | 归属 | 责任 | 禁止事项 |
|---|---|---|---|
| `WorkRuntimeConfig` | `infra/config.rs` | 配置 root、adapter 参数、projection / outbox / handoff 参数 | 不改变 truth 归属和 promote 规则 |
| `WorkRuntimeBuilder` | `infra/runtime_builder.rs` | 装配 application services 和 infra adapters | 不把 adapter 注入 domain |
| `InMemoryWorkStores` | `infra/repositories.rs` | P0 fake stores / fixtures | 不成为正式存储 schema 真相源 |
| `WorkCommandHandlers` | `api/command_handlers.rs` | command envelope -> application service | 不直接调用 repository |
| `WorkQueryHandlers` | `api/query_handlers.rs` | query envelope -> application service | 不写 truth |
| `WorkInboundConsumers` | `worker/consumers.rs` | event envelope -> consumer service | 不绕过 application |
| `WorkOperationsJobRunner` | `jobs/lib.rs` | operations job dispatch | 不直接修复 business truth |

| Config section | 归属 | 作用 | 禁止事项 |
|---|---|---|---|
| `WorkStoreConfig` | `infra/config.rs` | store adapter kind、transaction timeout、project owner uniqueness policy | 不改变 logical schema truth |
| `WorkBoundaryConfig` | `infra/config.rs` | command / query validation、request size、page limit、read timeout | 不绕过 metadata / actor / visibility |
| `WorkIdempotencyConfig` | `infra/config.rs` | command idempotency retention、event dedup retention、reserved record max age | 不允许缺 key 写 truth |
| `WorkProjectionConfig` | `infra/config.rs` | projection adapter kind、stale threshold、replace scope、rebuild timeout | 不允许 query / projection 反写真相 |
| `WorkJobConfig` | `infra/config.rs` | job batch size、parallelism、timeout、retry limit | 不允许 job 修业务 truth |
| `WorkExternalConfig` | `infra/config.rs` | identity / method / source / evidence / process resolver adapter 参数 | 不引入 sibling Cargo dependency |
| `WorkOutboxConfig` | `infra/config.rs` | outbox batch、publish retry、dead-letter / failed marker policy | 不回滚已成立 truth |
| `WorkHandoffConfig` | `infra/config.rs` | trace / archive handoff target、batch、timeout | 不保存 observability / archive 正文 |
| `WorkFeatureConfig` | `infra/config.rs` | derived / peripheral feature enablement | 不改变 Project / Backlog / WorkItem / Iteration 不变量 |

| Config helper | JSON / env 输入形态 | validation / mapping |
|---|---|---|
| `Duration` | string,格式为 `<positive integer><unit>`;支持单位 `ms`、`s`、`m`、`h`、`d` | trim 外层空白后解析;空字符串、0、负数、未知单位、大小写不匹配、内部空白或毫秒换算溢出均 fail-fast;进入 runtime adapter 前可转换为 `std::time::Duration` |
| `ByteSize` | positive integer | 0、负数、非整数或溢出 fail-fast |
| `PageLimit` | positive integer | 0、负数、非整数或超过 implementation max fail-fast;映射到 core `PageRequest.limit` 时不得超过该值 |
| `BatchSize` | core-contracts `BatchSize` / positive integer | 0、负数、非整数或超过 implementation max fail-fast |
| `NonZeroUsize` | positive integer | 0、负数、非整数或超过 implementation max fail-fast;实现使用 `std::num::NonZeroUsize` |
| `RetryLimit` | non-negative integer | 负数、非整数或超过 implementation max fail-fast;`RetryPolicyConfig.max_attempts` 额外要求 `>= 1` |
| `RetryPolicyConfig` | object:`max_attempts`、`base_delay`、`max_delay` | `max_attempts >= 1`;`base_delay > 0`;`max_delay >= base_delay`;非法组合 fail-fast |
| `ExternalAdapterConfig` | object:`adapter_kind` plus optional `endpoint_ref` / `credential_ref` / `source_ref` | `Fake` 不要求 refs 且必须输出 fake marker;`Configured` 必须满足对应 resolver 的 ref 条件,不得 fallback fake success |
| `HandoffTargetConfig` | object:`adapter_kind` plus optional `target_ref` / `credential_ref` | `Fake` 不要求 refs 且必须输出 fake marker;`Configured` 必须有 `target_ref`,需要凭据时必须有 `credential_ref`;不得保存 handoff target 正文 |
| `EndpointRef` / `SecretRef` / `CredentialRef` / `AdapterSourceRef` / `TargetRef` | non-empty string newtype | 只保存 ref,不得保存 raw secret、raw token、raw payload、provider response body 或外部正文 |

#### 7.14 字段闭环表

| Domain 对象 | 字段 | 类型 | 字段来源 | 构造入口 | DTO / Event 字段 | 缺失处理 | 测试覆盖 |
|---|---|---|---|---|---|---|---|
| `Project` | `project_id` | `ProjectId` | id generator / command explicit id policy | `Project::create(...)` | `CreateProject` | reject / generate by policy | `TC-WORK-PROJECT-*` |
| `Project` | `owner_ref` | `ProjectOwnerRef` | command input | `Project::create(...)` | `CreateProject.project_spec.owner_ref` | reject | `TC-WORK-PROJECT-*` |
| `ProjectMember` | `member_ref` | `GlobalMemberRef` | command input / identity event | `ProjectMember::assign(...)` | `AssignProjectMember.member_ref` | reject | `TC-WORK-MEMBER-*` |
| `WorkItem` | `completion_ref` | `Option<ExternalEvidenceRef>` | lifecycle command / evidence event | `WorkItem::mark_completed(...)` | `UpdateWorkItemLifecycle.evidence_ref` | reject completed without evidence | `TC-WORK-ITEM-*` |
| `ChildWorkItem` | `source_ref` | `SourceWorkRef` | command / promote result | `ChildWorkItem::create_child(...)` | `CreateChildWorkItem.source_ref` | reject | `TC-WORK-PROMOTE-*` |
| `ChildWorkItem` | `completion_ref` | `Option<ExternalEvidenceRef>` | lifecycle command / evidence event | `ChildWorkItem::transition_lifecycle(...)` | `UpdateWorkItemLifecycle.evidence_ref` | reject completed without evidence | `TC-WORK-ITEM-*` |
| `WorkDependency` | `upstream_work_ref` | `FormalWorkRef` | command input | `WorkDependency::link(...)` | `LinkWorkDependency.upstream` | reject missing / same as downstream | `TC-WORK-DEP-*` |
| `WorkBlocker` | `resolved_evidence_ref` | `Option<ExternalEvidenceRef>` | resolve command + evidence resolver | `WorkBlocker::resolve(...)` | `ResolveWorkBlocker.evidence_ref`;`WorkBlockerChanged.evidence_ref` | reject missing / unverified evidence;unresolved blocker event uses `None` | `TC-WORK-DEP-*`;`WorkBlockerChanged_event_schema` |
| `IterationCommitment` | `committed_work_refs` | `FormalWorkRefSet` | command input + work repo lookup | `IterationCommitment::from_candidates(...)` | `CommitIterationScope.candidates` | reject non-formal work | `TC-WORK-ITER-*` |
| `PromoteResult` | `created_work_ref` | `Option<FormalWorkRef>` | review accept path | `PromoteResult::accept(...)` | `ReviewWorkPromotion.decision` | absent for rejected | `TC-WORK-PROMOTE-*` |
| `DerivedWorkViewState` | `freshness_state` | `DerivedFreshnessState` | truth change / rebuild job | `DerivedWorkViewState::for_view(...)` | query / job marker | missing -> stale marker | `TC-WORK-DERIVED-*` |
| `WorkOutboxRecord` | `event_kind` | `WorkOutboxEventKind` | truth change | `WorkOutboxRecord::from_truth_change(...)` | outbound event | reject unknown change | `TC-WORK-OUTBOX-*` |

#### 7.15 DTO / Event / Job 到 Domain 构造闭环表

| 输入契约 | 目标 Domain 对象 | 必填字段是否齐全 | 派生字段来源 | 不得混同的字段 | 缺失时行为 | 后续处理流 |
|---|---|---|---|---|---|---|
| `CreateProject` | `Project`、`Backlog` | 是 | `project_id` / `backlog_id` 由 `IdGeneratorPort` 生成并显式传入 factory | `ProjectOwnerRef` != workspace project body | reject owner missing | Step 9 |
| `AssignProjectMember` | `ProjectMember`、`MemberCapabilitySnapshot` | 是 | capability 由 resolver / snapshot repo | `GlobalMemberRef` != `ProjectMemberRef` | reject unresolved member | Step 9 |
| `CreateWorkItem` | `WorkItem` | 是 | state = `Formalized` | `SourceWorkRef` != source body | reject invalid source | Step 9 |
| `ReviewWorkPromotion` | `PromoteResult`、可选 `WorkItem` / `ChildWorkItem` | 是 | accepted path 由 `IdGeneratorPort` 生成 formal work id 并显式传入 factory | `PromoteResultRef` != created work ref | reject invalid transition | Step 9 |
| `LinkWorkDependency` | `WorkDependency` | 是 | graph snapshot 由 repository / policy 读取 | upstream != downstream | reject cycle / orphan | Step 9 |
| `CommitIterationScope` | `IterationCommitment` | 是 | candidates 由 work repo 验证 | process timebox != commitment truth | reject non-formal candidate | Step 9 |
| `RebuildWorkProjections` | `DerivedWorkViewState`、view DTO | 是 | truth snapshot / cursor | projection != truth | failed marker | Step 9 |
| `PublishWorkOutbox` | `WorkOutboxRecord` | 是 | publication ref 来自 publisher result | published event != truth decision | retry / failed | Step 9 |

### 8. 设计取舍

| 取舍 | 结论 | 理由 |
|---|---|---|
| shared ref / state 放 `contracts` 还是 `domain` | 放 `contracts` | Query / Event / Job DTO 与 domain 都会使用,避免第二真相 |
| `SourceWorkRef` 是否留在 domain | 否,归入 `contracts` | 它是外部来源引用,会进入 command / event / promote result |
| projection view 是否放 domain | 否,public view DTO 归 `contracts`;`DerivedWorkViewState` 归 domain | 防止 view 成为 truth |
| repository trait 是否本 Step 定义 | 否 | Step 7 专门定义 trait / port / adapter |
| application service 是否本 Step 定义 | 是,只定义 object 责任和 helper | service 是对象契约的一部分,具体 flow 留给 Step 9 |

### 9. 回填草稿

正式 `03-详细设计.md` §5 / §6 可引用本文件以下内容:

- §7.1 对象归属总表
- §7.2 contracts shared value object 和状态 enum
- §7.3~§7.11 domain object / policy 契约
- §7.12~§7.13 application / infra / entry object 契约
- §7.14~§7.15 字段和构造闭环表

正式文档整理必须保留校准来源:

```text
对象契约来源: `projects/L1-work/design-calibration/03_ddd_step_06_object_contracts.md`。
```

### 10. 待确认事项

无阻塞进入 Step 7 的对象契约待确认事项。Command DTO、Query view、Job input / report 和 projection helper 的字段全集由 Step 8 正式协议契约承接并闭合。

### 11. 进入下一步条件

```text
contracts shared object、domain truth object、policy、projection state、reference snapshot、audit / outbox record、application service object 和 entry object 已有可实现契约。
字段均有类型、作用和约束;核心状态 enum 已有 variant rustdoc 和来源 / 去向表。
可以进入 Step 7,逐模块定义 Trait / Port / Adapter 契约。
```
