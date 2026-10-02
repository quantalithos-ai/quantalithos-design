# Step7 application callable闭口补充（Step9反查回修）

## 思考与诊断

公共runner可以收敛scope/key/replay/commit，但必须有完整typed输入/输出且不能替代独立业务flow。新增支撑来自原checkpoint恢复、单Coreauthority及逐scope manifest；不增加business入口/owner/state。选择显式genericports/runners/gates/support，拒绝字符串service locator/fake private map。以下对象位于已planned command_runner/job_runner/read_facade/operation_context/各U mod，Clock/ID在ports/unit_of_work，无新增member。

### ReservedOperation

```rust
/// Carries ReservedOperation with explicit sources and no upstream body.
pub struct ReservedOperation {
    /// Carries operation; see the source and invariant table.
    pub operation: Versioned<OperationRecord>,
    /// Carries context_ref; see the source and invariant table.
    pub context_ref: MarketContextRef,
    /// Carries result_ref; see the source and invariant table.
    pub result_ref: StoredOperationResultRef,
    /// Carries audit_ref; see the source and invariant table.
    pub audit_ref: MarketAuditRef,
    /// Carries cursor; see the source and invariant table.
    pub cursor: MarketSourceCursor,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| operation | `Versioned<OperationRecord>` | OperationRunner winningkey内fresh生成；唯一context/ID/cursor，Job checkpoint持久引用，未Completed不外称accepted |
| context_ref | `MarketContextRef` | OperationRunner winningkey内fresh生成；唯一context/ID/cursor，Job checkpoint持久引用，未Completed不外称accepted |
| result_ref | `StoredOperationResultRef` | OperationRunner winningkey内fresh生成；唯一context/ID/cursor，Job checkpoint持久引用，未Completed不外称accepted |
| audit_ref | `MarketAuditRef` | OperationRunner winningkey内fresh生成；唯一context/ID/cursor，Job checkpoint持久引用，未Completed不外称accepted |
| cursor | `MarketSourceCursor` | OperationRunner winningkey内fresh生成；唯一context/ID/cursor，Job checkpoint持久引用，未Completed不外称accepted |

归属：application；OperationRunner winningkey内fresh生成；唯一context/ID/cursor，Job checkpoint持久引用，未Completed不外称accepted


### CommandPreparation<T>

```rust
/// Carries CommandPreparation<T> with explicit sources and no upstream body.
pub struct CommandPreparation<T> {
    /// Carries body; see the source and invariant table.
    pub body: T,
    /// Carries actor; see the source and invariant table.
    pub actor: core_contracts::actor::ActorContext,
    /// Carries meta; see the source and invariant table.
    pub meta: core_contracts::metadata::CommandMetadata,
    /// Carries scope; see the source and invariant table.
    pub scope: ScopeResolution,
    /// Carries fingerprint; see the source and invariant table.
    pub fingerprint: MarketIntentFingerprint,
    /// Carries operation_kind; see the source and invariant table.
    pub operation_kind: MarketOperationKind,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| body | `T` | key从meta唯一读，scope formal，selector固定typedmethod；不重复key/trace |
| actor | `core_contracts::actor::ActorContext` | key从meta唯一读，scope formal，selector固定typedmethod；不重复key/trace |
| meta | `core_contracts::metadata::CommandMetadata` | key从meta唯一读，scope formal，selector固定typedmethod；不重复key/trace |
| scope | `ScopeResolution` | key从meta唯一读，scope formal，selector固定typedmethod；不重复key/trace |
| fingerprint | `MarketIntentFingerprint` | key从meta唯一读，scope formal，selector固定typedmethod；不重复key/trace |
| operation_kind | `MarketOperationKind` | key从meta唯一读，scope formal，selector固定typedmethod；不重复key/trace |

归属：application；key从meta唯一读，scope formal，selector固定typedmethod；不重复key/trace


### JobPreparation<T>

```rust
/// Carries JobPreparation<T> with explicit sources and no upstream body.
pub struct JobPreparation<T> {
    /// Carries body; see the source and invariant table.
    pub body: T,
    /// Carries context; see the source and invariant table.
    pub context: MarketWorkerContext,
    /// Carries scope; see the source and invariant table.
    pub scope: ScopeResolution,
    /// Carries fingerprint; see the source and invariant table.
    pub fingerprint: MarketIntentFingerprint,
    /// Carries operation_kind; see the source and invariant table.
    pub operation_kind: MarketOperationKind,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| body | `T` | key从context.request唯一读，当前scope/fence仍核，typedfrozenbodyselector |
| context | `MarketWorkerContext` | key从context.request唯一读，当前scope/fence仍核，typedfrozenbodyselector |
| scope | `ScopeResolution` | key从context.request唯一读，当前scope/fence仍核，typedfrozenbodyselector |
| fingerprint | `MarketIntentFingerprint` | key从context.request唯一读，当前scope/fence仍核，typedfrozenbodyselector |
| operation_kind | `MarketOperationKind` | key从context.request唯一读，当前scope/fence仍核，typedfrozenbodyselector |

归属：application；key从context.request唯一读，当前scope/fence仍核，typedfrozenbodyselector


### CommandStart<T>

```rust
/// Represents the finite CommandStart<T> surface without owning upstream truth.
pub enum CommandStart<T> {
    /// Carries Fresh with CommandPreparation<T>.
    Fresh(CommandPreparation<T>),
    /// Carries Replayed with StoredOperationResult.
    Replayed(StoredOperationResult),
}
```

| 变体 | Rustdoc语义 | 来源 / 去向 |
|---|---|---|
| Fresh(CommandPreparation<T>) | Carries Fresh. | prebusiness replay gate；完整payload只有全部当前disclosure允许才重放，否则NotVisible不部分重建 |
| Replayed(StoredOperationResult) | Carries Replayed. | prebusiness replay gate；完整payload只有全部当前disclosure允许才重放，否则NotVisible不部分重建 |

归属：application；prebusiness replay gate；完整payload只有全部当前disclosure允许才重放，否则NotVisible不部分重建


### JobStart<T>

```rust
/// Represents the finite JobStart<T> surface without owning upstream truth.
pub enum JobStart<T> {
    /// Carries Fresh with JobPreparation<T>.
    Fresh(JobPreparation<T>),
    /// Carries Replayed with StoredOperationResult.
    Replayed(StoredOperationResult),
}
```

| 变体 | Rustdoc语义 | 来源 / 去向 |
|---|---|---|
| Fresh(JobPreparation<T>) | Carries Fresh. | scope先重放，reportkind exact；Reserved OperationInProgress/原checkpoint对账 |
| Replayed(StoredOperationResult) | Carries Replayed. | scope先重放，reportkind exact；Reserved OperationInProgress/原checkpoint对账 |

归属：application；scope先重放，reportkind exact；Reserved OperationInProgress/原checkpoint对账


### ReservationOutcome

```rust
/// Represents the finite ReservationOutcome surface without owning upstream truth.
pub enum ReservationOutcome {
    /// Carries Fresh with ReservedOperation.
    Fresh(ReservedOperation),
    /// Carries Replayed with StoredOperationResult.
    Replayed(StoredOperationResult),
}
```

| 变体 | Rustdoc语义 | 来源 / 去向 |
|---|---|---|
| Fresh(ReservedOperation) | Carries Fresh. | writeTx operationkey序列锁后再次lookup；race loser不生成ID、不写truth，rollbackreturnoriginal |
| Replayed(StoredOperationResult) | Carries Replayed. | writeTx operationkey序列锁后再次lookup；race loser不生成ID、不写truth，rollbackreturnoriginal |

归属：application；writeTx operationkey序列锁后再次lookup；race loser不生成ID、不写truth，rollbackreturnoriginal


### PlannedResponsibility

```rust
/// Carries PlannedResponsibility with explicit sources and no upstream body.
pub struct PlannedResponsibility {
    /// Carries work; see the source and invariant table.
    pub work: DeferredWork,
    /// Carries plan; see the source and invariant table.
    pub plan: DeferredPlan,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| work | `DeferredWork` | 同UoW fullwork+frozenplan，字段关联必一致，scheduler不private重建 |
| plan | `DeferredPlan` | 同UoW fullwork+frozenplan，字段关联必一致，scheduler不private重建 |

归属：application；同UoW fullwork+frozenplan，字段关联必一致，scheduler不private重建


### JobCheckpoint

```rust
/// Carries JobCheckpoint with explicit sources and no upstream body.
pub struct JobCheckpoint {
    /// Carries reserved; see the source and invariant table.
    pub reserved: ReservedOperation,
    /// Carries request; see the source and invariant table.
    pub request: InternalJobRequest,
    /// Carries work_ref; see the source and invariant table.
    pub work_ref: DeferredWorkRef,
    /// Carries fence; see the source and invariant table.
    pub fence: DispatchFence,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| reserved | `ReservedOperation` | initialclaim/permission同UoW append immutable原typedrequest+result/auditIDs；原OperationRecord持有Reserved生命周期，checkpoint无新state；crash恢复不能猜request/ref |
| request | `InternalJobRequest` | initialclaim/permission同UoW append immutable原typedrequest+result/auditIDs；原OperationRecord持有Reserved生命周期，checkpoint无新state；crash恢复不能猜request/ref |
| work_ref | `DeferredWorkRef` | initialclaim/permission同UoW append immutable原typedrequest+result/auditIDs；原OperationRecord持有Reserved生命周期，checkpoint无新state；crash恢复不能猜request/ref |
| fence | `DispatchFence` | initialclaim/permission同UoW append immutable原typedrequest+result/auditIDs；原OperationRecord持有Reserved生命周期，checkpoint无新state；crash恢复不能猜request/ref |

归属：application；initialclaim/permission同UoW append immutable原typedrequest+result/auditIDs；原OperationRecord持有Reserved生命周期，checkpoint无新state；crash恢复不能猜request/ref


### PublicationPrecheck

```rust
/// Carries PublicationPrecheck with explicit sources and no upstream body.
pub struct PublicationPrecheck {
    /// Carries source; see the source and invariant table.
    pub source: SourceBinding,
    /// Carries materials; see the source and invariant table.
    pub materials: MaterialReferenceSet,
    /// Carries authority; see the source and invariant table.
    pub authority: CurrentAuthorityInput,
    /// Carries rules; see the source and invariant table.
    pub rules: QualifiedSourceRuleInput,
    /// Carries summary; see the source and invariant table.
    pub summary: SourceSafeSummary,
    /// Carries validity_ref; see the source and invariant table.
    pub validity_ref: SourceValidityRef,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| source | `SourceBinding` | SourceOwner.resolve/read_current + Publisher.current + Material.resolve；SourceGate.evaluate允许basis，不需要Govapproval才草稿/申请 |
| materials | `MaterialReferenceSet` | SourceOwner.resolve/read_current + Publisher.current + Material.resolve；SourceGate.evaluate允许basis，不需要Govapproval才草稿/申请 |
| authority | `CurrentAuthorityInput` | SourceOwner.resolve/read_current + Publisher.current + Material.resolve；SourceGate.evaluate允许basis，不需要Govapproval才草稿/申请 |
| rules | `QualifiedSourceRuleInput` | SourceOwner.resolve/read_current + Publisher.current + Material.resolve；SourceGate.evaluate允许basis，不需要Govapproval才草稿/申请 |
| summary | `SourceSafeSummary` | SourceOwner.resolve/read_current + Publisher.current + Material.resolve；SourceGate.evaluate允许basis，不需要Govapproval才草稿/申请 |
| validity_ref | `SourceValidityRef` | SourceOwner.resolve/read_current + Publisher.current + Material.resolve；SourceGate.evaluate允许basis，不需要Govapproval才草稿/申请 |

归属：application；SourceOwner.resolve/read_current + Publisher.current + Material.resolve；SourceGate.evaluate允许basis，不需要Govapproval才草稿/申请


### AdmissionPrecheck

```rust
/// Carries AdmissionPrecheck with explicit sources and no upstream body.
pub struct AdmissionPrecheck {
    /// Carries current; see the source and invariant table.
    pub current: CurrentQualificationInput,
    /// Carries decision_binding; see the source and invariant table.
    pub decision_binding: GovernanceDecisionBinding,
    /// Carries requirements; see the source and invariant table.
    pub requirements: VersionAdmissionRequirements,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| current | `CurrentQualificationInput` | exactbasis/Gov/currentsource/material/publisher；requirements formal consumer，approved只formalGovmapping |
| decision_binding | `GovernanceDecisionBinding` | exactbasis/Gov/currentsource/material/publisher；requirements formal consumer，approved只formalGovmapping |
| requirements | `VersionAdmissionRequirements` | exactbasis/Gov/currentsource/material/publisher；requirements formal consumer，approved只formalGovmapping |

归属：application；exactbasis/Gov/currentsource/material/publisher；requirements formal consumer，approved只formalGovmapping


### ResolvedNoticeTarget

```rust
/// Carries ResolvedNoticeTarget with explicit sources and no upstream body.
pub struct ResolvedNoticeTarget {
    /// Carries target_ref; see the source and invariant table.
    pub target_ref: NoticeTargetRef,
    /// Carries channel_ref; see the source and invariant table.
    pub channel_ref: NoticeChannelRef,
    /// Carries scope_ref; see the source and invariant table.
    pub scope_ref: MarketScopeRef,
    /// Carries basis_refs; see the source and invariant table.
    pub basis_refs: SafeBasisReferenceSet,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| target_ref | `NoticeTargetRef` | formal notice target/channel authority；candidateStrings只请求线索，不callerqualified |
| channel_ref | `NoticeChannelRef` | formal notice target/channel authority；candidateStrings只请求线索，不callerqualified |
| scope_ref | `MarketScopeRef` | formal notice target/channel authority；candidateStrings只请求线索，不callerqualified |
| basis_refs | `SafeBasisReferenceSet` | formal notice target/channel authority；candidateStrings只请求线索，不callerqualified |

归属：application；formal notice target/channel authority；candidateStrings只请求线索，不callerqualified


## 完整callable、字段构造与副作用

2026-10-02 canonical闭口：CommandRunner/JobRunner prepare与reserve的T必须是application sealed `CanonicalMarketIntent`，完整trait/两方法与`intent_fingerprint<T>(kind, &CoreActorContext, &MarketScopeRef, &T)`见[Step13§7.2～7.3](03_ddd_step_13_concurrency_idempotency.md)。prepare调用该pure函数，body.operation_kind()==kind；reserve只复用prepared指纹与原metadata。API/Worker泛型委托相同bound；Query无此bound或operation写入。

| 对象 | 完整签名 | source / 调用序 / output / effect |
|---|---|---|
| CommandRunner<P> | `pub async fn prepare<T: CanonicalMarketIntent>(&self, request: CommandEnvelope<T>, kind: MarketOperationKind, subjects: Vec<MarketAuditSubjectRef>, candidates: Vec<SourceVerificationTarget>, requested_scope: Option<MarketScopeRef>) -> Result<CommandStart<T>, MarketError>` | P:MarketPorts；decode/key+currentScope→readonlyOperationStore.find_by_key→current披露全部resultsubject检查→samefingerprintfullreplay；fresh返回body/Core唯一meta，不做业务precheck或ID生成 |
| CommandRunner<P> | `pub async fn reserve<T: CanonicalMarketIntent>(&self, tx: &mut P::Tx, prepared: &CommandPreparation<T>) -> Result<ReservationOutcome, MarketError>` | lock_operation_key→find_by_key再核；Replay无ID/写；fresh generate op/context/result/audit IDs→CoreContextRecord.from_command→OperationContext.from_entry/OperationRecord.reserve→appendcontext/saveReserved→assigncursor；所有stagedsameTx |
| CommandRunner<P> | `pub async fn finish(&self, tx: P::Tx, reserved: ReservedOperation, surface: MarketResultSurface, audit: MarketAuditRecord, responsibilities: Vec<PlannedResponsibility>) -> Result<ExecutionResult<MarketResultSurface>, MarketError>` | alreadytyped业务save后：appendwork+plan→append audit→StoredResult.capture→append_result→Operation.complete→saveOperationExact→commit；KnownCommitted value完整原typed，Unknown新readonlykeylookup且完整result存在才返original，否则CommitUnknown/等待正式commitresolution；错误rollback |
| JobRunner<P> | `pub async fn prepare<T: CanonicalMarketIntent>(&self, request: JobEnvelope<T>, kind: MarketOperationKind, subjects: Vec<MarketAuditSubjectRef>) -> Result<JobStart<T>, MarketError>` | currentactor/disclosure + key/fingerprint + fullreportreplay；freshwork/plan/selectorpair/fence校验。Dispatch与Reconcile原planselector可按8明确pair，原externalintent不变 |
| JobRunner<P> | `pub async fn reserve<T: CanonicalMarketIntent>(&self, tx: &mut P::Tx, prepared: &JobPreparation<T>) -> Result<ReservationOutcome, MarketError>` | 同Command reserve但CoreContextRecord.from_job，meta唯一context.request；Reserved未fullresult不称accepted，checkpoint同初始Tx保存 |
| JobRunner<P> | `pub async fn claim(&self, tx: &mut P::Tx, work: Versioned<DeferredWork>, context: MarketWorkerContext, inspection: Option<ExternalEffectInspectionInput>) -> Result<Versioned<DeferredWork>, MarketError>` | DeferredWork.claim + WorkStore.claim sameTx；None只localwork或Pending且无旧permission；external recovery必须Some formal原intentinspection；Pending可claim，Blocked需正式恢复/currentgate，Claimedexpired只Reconcile probe-only新fence；generation/expires由loadedwork+Clock/runtimelease校验，no secondsend |
| JobRunner<P> | `pub async fn finish(&self, tx: P::Tx, reserved: ReservedOperation, report: MarketJobReport, work: Versioned<DeferredWork>, audit: MarketAuditRecord, successors: Vec<PlannedResponsibility>) -> Result<ExecutionResult<MarketJobReport>, MarketError>` | load原Reserved/CAS→验证work拟保存终态与fullreport.work_state一致；所属flow已settle（无悬空责任或durable successor）或block实际gap→append fullreport→保存work+audit+successors→Operation.complete→commit；不在report之后隐式修改workstate；unknown/缺probe不能假settle；originalreportimmutable |
| JobRunner<P> | `pub async fn finish_original(&self, tx: &mut P::Tx, checkpoint: JobCheckpoint, report: MarketJobReport) -> Result<(), MarketError>` | 只已证明原Reserved结果的formalprobe/完整frozenrequest，可原resultref/audit/framecursor构造完整originalreport，sameUoW complete旧Operation；已有Completed只原value核对，不能overwrite或currentprojection重建 |
| JobRunner<P> | `pub async fn prepare_projection_request(&self, work_ref: DeferredWorkRef, context: MarketWorkerContext) -> Result<RebuildMarketReadProjectionRequest, MarketError>` | 先current披露→worktypedidentity→若旧checkpoint直接原Request；fresh readonlyProjection.source_cursor(identity)→plan_projection同sourcepolicy/sourcecursor构造完整typedplan，非empty；进入49之一Rebuild；无全局隐式scan，超容量Blocked |
| FreshGate<P> | `pub async fn publication(&self, publisher: PublisherRelation, spec: DraftPublicationSpec, scope: SafeReadContext) -> Result<PublicationPrecheck, MarketError>` | publication SourceOwner.resolve→SourceBinding.from_owner；Material.resolve每itemfromauthority；Publisher.current→SourceGatePolicy.new/evaluate；只有full正式sourcegate才完整precheck；DBtx外，无approval |
| FreshGate<P> | `pub async fn admission(&self, version: MarketVersion, basis: PublicationBasis, publisher: PublisherRelation, scope: SafeReadContext) -> Result<AdmissionPrecheck, MarketError>` | source.read_current + material.resolve fixedsource + publisher.current + Gov.read_decision(application,basis,currentbindingcandidate)→GovernanceDecisionBinding.from_governance + ReviewBindingPolicy.evaluate；currentapproved只用于admission/acquisition，不client自填 |
| FlowSupport<P> | `pub fn assert_allowed(&self, gate: LocalGateResult) -> Result<SafeBasisReferenceSet, MarketError>` | allowed=true且basis非空/failureNone；false safeCurrentGateDenied，不把bool当approval |
| FlowSupport<P> | `pub fn expect_revision(&self, actual: MarketRevision, expected: MarketRevision) -> Result<(), MarketError>` | exact比对，fresh only，replay不重新业务CAS |
| FlowSupport<P> | `pub fn assert_binding(&self, matches: bool) -> Result<(), MarketError>` | 只typedfield equality，false BindingMismatch，无I/O或truth |
| FlowSupport<P> | `pub fn receipt(&self, reserved: &ReservedOperation, work_refs: DeferredWorkRefSet, basis_refs: SafeBasisReferenceSet) -> CommandReceipt` | op/result/audit/cursor逐字段reserved，workrefs来自实际同Txplannedresponsibilities |
| FlowSupport<P> | `pub fn audit(&self, reserved: &ReservedOperation, subject: MarketAuditSubjectRef, bases: SafeBasisReferenceSet) -> Result<MarketAuditRecord, MarketError>` | MarketAuditRecord.append_fact{auditID,subject,operationID,ActorReference(contextref),basis,cursor}完整输入，无rawbody/Obsreceipt |
| FlowSupport<P> | `pub fn schedule(&self, reserved: &ReservedOperation, work_ref: Option<DeferredWorkRef>, target: MarketWorkTargetRef, intent: MarketEffectIntentRef, kind: MarketOperationKind, scope: MarketScopeRef, window: Option<ReadWindow>, plan: Option<ProjectionRebuildPlanInput>, audits: MarketAuditRefSet) -> Result<PlannedResponsibility, MarketError>` | fresh IDwork/fencegen0/localtechnicalexpiry→DeferredWork.schedule；DeferredPlan{work,kind,scope,targets:[target],window,projection_plan,auditrefs}，所有nonemptytypedfields；无DB/externalcall；Some必须freshIDport既分配值，用于attempt.fence一致；LocalWork意图取最终同workref，不另造不同ref。 |
| FlowSupport<P> | `pub async fn queue_projections(&self, tx: &mut P::Tx, reserved: &ReservedOperation, subject: MarketAuditSubjectRef, scope: SafeReadContext) -> Result<Vec<PlannedResponsibility>, MarketError>` | affected_projections→find_projection uniqueidentity；无existing时ReadProjection.initialize+saveMustNotExist；schedule Projection/LocalWork同UoW；现有Fresh不命令改state，currentread发现cursor落后只degraded，RebuildJob正式markstale；actualplan freshinternalhelper readonlycommittedfacts生成后freezecheckpoint |
| FlowSupport<P> | `pub fn permission(&self, reserved: &ReservedOperation, work: &DeferredWork, version_ref: Option<MarketVersionRef>, bases: SafeBasisReferenceSet) -> DispatchPermission` | target/原effectintent/currentfence从work，版本显式，issued_at Clock；只有formalcurrentgate与sameversionserializationtxappend才可外call；构造本身非permissiondurable |
| FlowSupport<P> | `pub fn job_report(&self, reserved: &ReservedOperation, work: &DeferredWork, items: Vec<JobItemResult>, next_cursor: Option<MarketSourceCursor>, successors: DeferredWorkRefSet) -> MarketJobReport` | 完整字段op/result/work/fence/items/nextcursor/workstate/auditRefs/spawnedWorkRefs；items非empty若合法no-op需1typedSkippedNoOp，不丢gap |
| FlowSupport<P> | `pub fn version_item(&self, version: MarketVersion) -> MarketVersionReadItem` | 逐字段version/listing/source/app/state/decision/disposition/revisioncopy，无新truth |
| FlowSupport<P> | `pub fn distribution_result(&self, receipt: CommandReceipt, intent: DistributionIntent, relation: DistributionRelation, attempts: Vec<DistributionAttempt>, impact_work_refs: DeferredWorkRefSet) -> DistributionResult` | 各Snapshot逐字段copy原typedfacts；cancelled不改变attempt；不造installed/paid |
| ReadFacade<P> | `pub async fn authorize<T>(&self, request: &QueryEnvelope<T>, subjects: Vec<MarketAuditSubjectRef>, candidates: Vec<SourceVerificationTarget>, requested_scope: Option<MarketScopeRef>) -> Result<SafeReadContext, MarketError>` | ScopeResolver.resolve currentactor/scope/sourceintersection；NotVisible无existence/cursor/count，Query无ID/contextwrite |
| ReadFacade<P> | `pub fn ready<T>(&self, items: Vec<T>, info: PageInfo, marker: ReadMarker) -> Result<ReadSurface<T>, MarketError>` | nonempty=>Ready，empty=>Empty；marker必须Ready/Empty对应合法source/currentdisclosure，degraded独立无unsafeoldbody |
| ReadFacade<P> | `pub fn detail_info(&self, cursor: MarketSourceCursor) -> PageInfo` | nexttokenNone/sourcecursor/visiblecountSome1；missing/notvisible不调用 |
| ReadFacade<P> | `pub fn degrade<T>(&self, marker: ReadMarker) -> ReadSurface<T>` | 仅Stale/Rebuilding/Unavailable/Unsupported/Failed/Disabled，非Ready/Empty；不写state |
| ReadFacade<P> | `pub fn map_read_error<T>(&self, error: MarketError) -> Result<ReadSurface<T>, MarketError>` | NotVisible→NotVisible；authorizedMissing→Missing；源缺口/Unavailable等→Degraded；invalidinput或scope authorityerror安全reject |

FreshGate<P>/FlowSupport<P>与三个Runner均只持有`ports: P`，constructor `pub fn new(ports: P) -> Self`。所有辅助严格按上表映射，不能生成owner refs/verdict/approval。方法只能用Step7 typedports及Step6factory/member，不是新businessprotocol，49 publicinventory不变。逐flow仍须列具体typed对象动作/Tx/effects，不允许helpers遮蔽业务规则。

### FreshGate<P>

```rust
/// Carries FreshGate<P> with explicit sources and no upstream body.
pub struct FreshGate<P> {
    /// Carries ports; see the source and invariant table.
    pub ports: P,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| ports | `P` | generic applicationrequiredports，非infra concrete type |

归属：application；pure/generichelper无ownertruth，不新增public入口


### FlowSupport<P>

```rust
/// Carries FlowSupport<P> with explicit sources and no upstream body.
pub struct FlowSupport<P> {
    /// Carries ports; see the source and invariant table.
    pub ports: P,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| ports | `P` | generic applicationrequiredports，非infra concrete type |

归属：application；pure/generichelper无ownertruth，不新增public入口


### ResolvedPublisherAuthority

```rust
/// Carries ResolvedPublisherAuthority with explicit sources and no upstream body.
pub struct ResolvedPublisherAuthority {
    /// Carries principal_ref; see the source and invariant table.
    pub principal_ref: PublisherPrincipalRef,
    /// Carries authority_ref; see the source and invariant table.
    pub authority_ref: PublisherAuthorityRef,
    /// Carries scope_ref; see the source and invariant table.
    pub scope_ref: MarketScopeRef,
    /// Carries validity_ref; see the source and invariant table.
    pub validity_ref: SourceValidityRef,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| principal_ref | `PublisherPrincipalRef` | formal human/org/publisher授权输出，没有本地relationID；MP-UP003正向mapping仍blocked |
| authority_ref | `PublisherAuthorityRef` | formal human/org/publisher授权输出，没有本地relationID；MP-UP003正向mapping仍blocked |
| scope_ref | `MarketScopeRef` | formal human/org/publisher授权输出，没有本地relationID；MP-UP003正向mapping仍blocked |
| validity_ref | `SourceValidityRef` | formal human/org/publisher授权输出，没有本地relationID；MP-UP003正向mapping仍blocked |

归属：application；formal human/org/publisher授权输出，没有本地relationID；MP-UP003正向mapping仍blocked


### FreshGate精确内部调用与requirements来源

publication：SourceOwner.resolve(candidate,scope)取得QualifiedSourceInput/rules/summary/validity，SourceBinding.from_owner完整复制；PublisherAuthority.current_authority(publisher,scope)取formalcurrent；MaterialAuthority.resolve_materials(material_candidates,source,scope)取全部formal切片；SourceGatePolicy.new(source.rules).evaluate(source,publisher,materials,currentauthority)全部guard满足才返回PublicationPrecheck。

admission：SourceOwner.read_current(version.source_binding,scope)、PublisherAuthority.current_authority、MaterialAuthority.resolve_materials(basis.material refs,fixedsource,scope)、Governance.read_decision(application,basis,decisioncandidate,scope)取完整formalbinding/current。ReviewBindingRequirements来自正式consumer合同已qualify的adapterbinding而非任意配置字符串；若该适用规则exact字段/SDK映射无法取得，MP-UP002保持blocked，不自行填true。VersionAdmissionRequirements组合source.rules/正式reviewrequirements。GovernanceDecisionBinding.from_governance→ReviewBindingPolicy.evaluate，只有fullmatching/currentapproved后返回AdmissionPrecheck；source/basis不能换版本。actor/scope/资格返回是读取时formal依据，外部执行时还须receiver自己的currentenforcement，不能宣称跨owner原子撤销。


## pure utility补充

| 对象 | 完整签名 | 来源 / 约束 |
|---|---|---|
| FlowSupport<P> | `pub fn require<T>(&self, value: Option<T>) -> Result<T, MarketError>` | present完整typedvalue；None安全Missing，fresh mutation拒绝/Query按披露map，不默认补对象 |
| FlowSupport<P> | `pub fn error(&self, code: ErrorCode) -> MarketError` | code+reasonNone+operationNone安全构造，不回raw SQL/SDK/body |
| FlowSupport<P> | `pub fn ready_marker(&self, projection_ref: Option<MarketProjectionRef>, cursor: MarketSourceCursor) -> ReadMarker` | 仅在当前scope/源完整后构造Ready，failureNone；不是currentauthority替代 |


## 结果映射与basis纯转换

| 对象 | 完整签名 | 来源 / 约束 |
|---|---|---|
| FlowSupport<P> | `pub fn basis(&self, kind: SafeBasisKind, token: String) -> Result<SafeBasisReference, MarketError>` | 仅复制当次formaltypedport输出或明确localfact/reason引用；kind由typed调用位置固定，opaque token不parse；不从客户端bool/文字推basis |
| FlowSupport<P> | `pub fn public_result<T, F>(&self, execution: ExecutionResult<MarketResultSurface>, extract: F) -> Result<ExecutionResult<T>, MarketError> where F: FnOnce(MarketResultSurface) -> Result<T, MarketError>` | extract是逐协议固定variant match，wrongkind IntegrityFailure；payload完全原值，disposition外层无第二truth |


ReviewBindingPolicy.evaluate用于RecordGovernanceDecision时require_approved_for_listing=false，只验证formalbinding/来源当前适用，不把rejected正式决定丢弃；VersionAdmissionPolicy/AcquisitionGatePolicy始终要求currentdecision.approved=true和正式validity、fullbasis。对应consumercontractref必须是formalqualified Governance adapterbinding，取不到就MP-UP002 blocked，不写任意字符串。NoticeIntent scope与SourceVerification publisher_ref的DDD补充是原能力所需字段，已回原对象/Row/factoryinput，非新ownertruth。

## 目标映射与窗口

| 对象 | 完整签名 | 规则 |
|---|---|---|
| FlowSupport<P> | `pub fn subject_for_target(&self, target: MarketWorkTargetRef) -> MarketAuditSubjectRef` | 显式Review/DistributionAttempt/Notice/Operation/Recovery/Snapshot/Projection/Impact variant映射，不parseopaque token |
| FlowSupport<P> | `pub fn bounded_window(&self, upper: MarketSourceCursor, after: Option<RepositoryCursor>) -> Result<ReadWindow, MarketError>` | limit来自validated worker_batch_limit>0，fixedupper+after；非Query第二pageauthority |


## Query snapshot纯映射

| 对象 | 完整签名 | 字段来源 |
|---|---|---|
| FlowSupport<P> | `pub fn attempt_snapshot(&self, value: DistributionAttempt) -> DistributionAttemptSnapshot` | 全字段attempt_ref/intent_ref/fence/outcome_binding/failure/state/revision逐字段copy，no installed/paid |
| FlowSupport<P> | `pub fn notice_item(&self, value: NoticeIntent) -> NoticeReadItem` | notice_ref/state/outcome_binding/failure_ref原字段，no delivered/read |

含historychunk的GetMarketplaceListing/GetDistributionProgress/GetWithdrawalImpact使用Coremeta.page且返回同page.info.next_token，必须明示当前页不是全历史；actualperref currentvisibility裁剪后才copy，隐藏unknown_attempt_ref不得返回。detail无page的纯字段查询为1item，列表empty走Empty。pseudocode每个earlydegraded/readerror通过作用域统一readonlyrollback，不因此保留SQLtx跨ownerread。

### ImpactScanItem

```rust
/// Represents the finite ImpactScanItem surface without owning upstream truth.
pub enum ImpactScanItem {
    /// Carries a committed relation in a bounded local impact scan.
    Relation(Versioned<DistributionRelation>),
    /// Carries a locally unknown attempt without claiming external commit.
    UnknownAttempt(Versioned<DistributionAttempt>),
}
```

| 变体 | Rustdoc语义 | 来源 / 去向 |
|---|---|---|
| Relation(Versioned<DistributionRelation>) | Carries a committed relation in a bounded local impact scan. | 联合本地typed已提交relation/unknownattempt流；固定upper，subjectvariant参与tie-break，不能把两个table独立page当同cursor |
| UnknownAttempt(Versioned<DistributionAttempt>) | Carries a locally unknown attempt without claiming external commit. | 联合本地typed已提交relation/unknownattempt流；固定upper，subjectvariant参与tie-break，不能把两个table独立page当同cursor |

归属：application；联合本地typed已提交relation/unknownattempt流；固定upper，subjectvariant参与tie-break，不能把两个table独立page当同cursor



## public callable英文Rustdoc声明

下面逐个复述既定完整签名，英文Rustdoc为planned实现要求；没有函数实现、编译或运行声明。参数/返回/错误/副作用以上表为唯一权威。

### CommandRunner<P>.prepare

```rust
/// Executes the declared prepare contract with typed inputs and safe results.
/// Preserves current disclosure, original-intent replay and the documented effect boundary.
pub async fn prepare<T: CanonicalMarketIntent>(&self, request: CommandEnvelope<T>, kind: MarketOperationKind, subjects: Vec<MarketAuditSubjectRef>, candidates: Vec<SourceVerificationTarget>, requested_scope: Option<MarketScopeRef>) -> Result<CommandStart<T>, MarketError>;
```

### CommandRunner<P>.reserve

```rust
/// Executes the declared reserve contract with typed inputs and safe results.
/// Preserves current disclosure, original-intent replay and the documented effect boundary.
pub async fn reserve<T: CanonicalMarketIntent>(&self, tx: &mut P::Tx, prepared: &CommandPreparation<T>) -> Result<ReservationOutcome, MarketError>;
```

### CommandRunner<P>.finish

```rust
/// Executes the declared finish contract with typed inputs and safe results.
/// Preserves current disclosure, original-intent replay and the documented effect boundary.
pub async fn finish(&self, tx: P::Tx, reserved: ReservedOperation, surface: MarketResultSurface, audit: MarketAuditRecord, responsibilities: Vec<PlannedResponsibility>) -> Result<ExecutionResult<MarketResultSurface>, MarketError>;
```

### JobRunner<P>.prepare

```rust
/// Executes the declared prepare contract with typed inputs and safe results.
/// Preserves current disclosure, original-intent replay and the documented effect boundary.
pub async fn prepare<T: CanonicalMarketIntent>(&self, request: JobEnvelope<T>, kind: MarketOperationKind, subjects: Vec<MarketAuditSubjectRef>) -> Result<JobStart<T>, MarketError>;
```

### JobRunner<P>.reserve

```rust
/// Executes the declared reserve contract with typed inputs and safe results.
/// Preserves current disclosure, original-intent replay and the documented effect boundary.
pub async fn reserve<T: CanonicalMarketIntent>(&self, tx: &mut P::Tx, prepared: &JobPreparation<T>) -> Result<ReservationOutcome, MarketError>;
```

### JobRunner<P>.claim

```rust
/// Executes the declared claim contract with typed inputs and safe results.
/// Preserves current disclosure, original-intent replay and the documented effect boundary.
pub async fn claim(&self, tx: &mut P::Tx, work: Versioned<DeferredWork>, context: MarketWorkerContext, inspection: Option<ExternalEffectInspectionInput>) -> Result<Versioned<DeferredWork>, MarketError>;
```

### JobRunner<P>.finish

```rust
/// Executes the declared finish contract with typed inputs and safe results.
/// Preserves current disclosure, original-intent replay and the documented effect boundary.
pub async fn finish(&self, tx: P::Tx, reserved: ReservedOperation, report: MarketJobReport, work: Versioned<DeferredWork>, audit: MarketAuditRecord, successors: Vec<PlannedResponsibility>) -> Result<ExecutionResult<MarketJobReport>, MarketError>;
```

### JobRunner<P>.finish_original

```rust
/// Executes the declared finish_original contract with typed inputs and safe results.
/// Preserves current disclosure, original-intent replay and the documented effect boundary.
pub async fn finish_original(&self, tx: &mut P::Tx, checkpoint: JobCheckpoint, report: MarketJobReport) -> Result<(), MarketError>;
```

### JobRunner<P>.prepare_projection_request

```rust
/// Executes the declared prepare_projection_request contract with typed inputs and safe results.
/// Preserves current disclosure, original-intent replay and the documented effect boundary.
pub async fn prepare_projection_request(&self, work_ref: DeferredWorkRef, context: MarketWorkerContext) -> Result<RebuildMarketReadProjectionRequest, MarketError>;
```

### FreshGate<P>.publication

```rust
/// Executes the declared publication contract with typed inputs and safe results.
/// Preserves current disclosure, original-intent replay and the documented effect boundary.
pub async fn publication(&self, publisher: PublisherRelation, spec: DraftPublicationSpec, scope: SafeReadContext) -> Result<PublicationPrecheck, MarketError>;
```

### FreshGate<P>.admission

```rust
/// Executes the declared admission contract with typed inputs and safe results.
/// Preserves current disclosure, original-intent replay and the documented effect boundary.
pub async fn admission(&self, version: MarketVersion, basis: PublicationBasis, publisher: PublisherRelation, scope: SafeReadContext) -> Result<AdmissionPrecheck, MarketError>;
```

### FlowSupport<P>.assert_allowed

```rust
/// Executes the declared assert_allowed contract with typed inputs and safe results.
/// Preserves current disclosure, original-intent replay and the documented effect boundary.
pub fn assert_allowed(&self, gate: LocalGateResult) -> Result<SafeBasisReferenceSet, MarketError>;
```

### FlowSupport<P>.expect_revision

```rust
/// Executes the declared expect_revision contract with typed inputs and safe results.
/// Preserves current disclosure, original-intent replay and the documented effect boundary.
pub fn expect_revision(&self, actual: MarketRevision, expected: MarketRevision) -> Result<(), MarketError>;
```

### FlowSupport<P>.assert_binding

```rust
/// Executes the declared assert_binding contract with typed inputs and safe results.
/// Preserves current disclosure, original-intent replay and the documented effect boundary.
pub fn assert_binding(&self, matches: bool) -> Result<(), MarketError>;
```

### FlowSupport<P>.receipt

```rust
/// Executes the declared receipt contract with typed inputs and safe results.
/// Preserves current disclosure, original-intent replay and the documented effect boundary.
pub fn receipt(&self, reserved: &ReservedOperation, work_refs: DeferredWorkRefSet, basis_refs: SafeBasisReferenceSet) -> CommandReceipt;
```

### FlowSupport<P>.audit

```rust
/// Executes the declared audit contract with typed inputs and safe results.
/// Preserves current disclosure, original-intent replay and the documented effect boundary.
pub fn audit(&self, reserved: &ReservedOperation, subject: MarketAuditSubjectRef, bases: SafeBasisReferenceSet) -> Result<MarketAuditRecord, MarketError>;
```

### FlowSupport<P>.schedule

```rust
/// Executes the declared schedule contract with typed inputs and safe results.
/// Preserves current disclosure, original-intent replay and the documented effect boundary.
pub fn schedule(&self, reserved: &ReservedOperation, work_ref: Option<DeferredWorkRef>, target: MarketWorkTargetRef, intent: MarketEffectIntentRef, kind: MarketOperationKind, scope: MarketScopeRef, window: Option<ReadWindow>, plan: Option<ProjectionRebuildPlanInput>, audits: MarketAuditRefSet) -> Result<PlannedResponsibility, MarketError>;
```

### FlowSupport<P>.queue_projections

Step17结果帧复核：Command输入reserved.cursor是该C帧；Job B传同原IDs/context但cursor已显式替换为result Tx B cursor的`result_reserved`，不修改A原checkpoint。derivedplan.upper不得取旧A cursor遗漏本B变化；affected/sourcekind规则沿Step11，puremaintenance/Obs排除沿Step15。当前Tx stagedfacts及其assignedframe可读，计划冻结只覆盖这一local提交帧，不声称owner原子可见。

```rust
/// Executes the declared queue_projections contract with typed inputs and safe results.
/// Preserves current disclosure, original-intent replay and the documented effect boundary.
pub async fn queue_projections(&self, tx: &mut P::Tx, reserved: &ReservedOperation, subject: MarketAuditSubjectRef, scope: SafeReadContext) -> Result<Vec<PlannedResponsibility>, MarketError>;
```

### FlowSupport<P>.permission

```rust
/// Executes the declared permission contract with typed inputs and safe results.
/// Preserves current disclosure, original-intent replay and the documented effect boundary.
pub fn permission(&self, reserved: &ReservedOperation, work: &DeferredWork, version_ref: Option<MarketVersionRef>, bases: SafeBasisReferenceSet) -> DispatchPermission;
```

### FlowSupport<P>.job_report

```rust
/// Executes the declared job_report contract with typed inputs and safe results.
/// Preserves current disclosure, original-intent replay and the documented effect boundary.
pub fn job_report(&self, reserved: &ReservedOperation, work: &DeferredWork, items: Vec<JobItemResult>, next_cursor: Option<MarketSourceCursor>, successors: DeferredWorkRefSet) -> MarketJobReport;
```

### FlowSupport<P>.version_item

```rust
/// Executes the declared version_item contract with typed inputs and safe results.
/// Preserves current disclosure, original-intent replay and the documented effect boundary.
pub fn version_item(&self, version: MarketVersion) -> MarketVersionReadItem;
```

### FlowSupport<P>.distribution_result

```rust
/// Executes the declared distribution_result contract with typed inputs and safe results.
/// Preserves current disclosure, original-intent replay and the documented effect boundary.
pub fn distribution_result(&self, receipt: CommandReceipt, intent: DistributionIntent, relation: DistributionRelation, attempts: Vec<DistributionAttempt>, impact_work_refs: DeferredWorkRefSet) -> DistributionResult;
```

### ReadFacade<P>.authorize

```rust
/// Executes the declared authorize contract with typed inputs and safe results.
/// Preserves current disclosure, original-intent replay and the documented effect boundary.
pub async fn authorize<T>(&self, request: &QueryEnvelope<T>, subjects: Vec<MarketAuditSubjectRef>, candidates: Vec<SourceVerificationTarget>, requested_scope: Option<MarketScopeRef>) -> Result<SafeReadContext, MarketError>;
```

### ReadFacade<P>.ready

```rust
/// Executes the declared ready contract with typed inputs and safe results.
/// Preserves current disclosure, original-intent replay and the documented effect boundary.
pub fn ready<T>(&self, items: Vec<T>, info: PageInfo, marker: ReadMarker) -> Result<ReadSurface<T>, MarketError>;
```

### ReadFacade<P>.detail_info

```rust
/// Executes the declared detail_info contract with typed inputs and safe results.
/// Preserves current disclosure, original-intent replay and the documented effect boundary.
pub fn detail_info(&self, cursor: MarketSourceCursor) -> PageInfo;
```

### ReadFacade<P>.degrade

```rust
/// Executes the declared degrade contract with typed inputs and safe results.
/// Preserves current disclosure, original-intent replay and the documented effect boundary.
pub fn degrade<T>(&self, marker: ReadMarker) -> ReadSurface<T>;
```

### ReadFacade<P>.map_read_error

```rust
/// Executes the declared map_read_error contract with typed inputs and safe results.
/// Preserves current disclosure, original-intent replay and the documented effect boundary.
pub fn map_read_error<T>(&self, error: MarketError) -> Result<ReadSurface<T>, MarketError>;
```

### FlowSupport<P>.require

```rust
/// Executes the declared require contract with typed inputs and safe results.
/// Preserves current disclosure, original-intent replay and the documented effect boundary.
pub fn require<T>(&self, value: Option<T>) -> Result<T, MarketError>;
```

### FlowSupport<P>.error

```rust
/// Executes the declared error contract with typed inputs and safe results.
/// Preserves current disclosure, original-intent replay and the documented effect boundary.
pub fn error(&self, code: ErrorCode) -> MarketError;
```

### FlowSupport<P>.ready_marker

```rust
/// Executes the declared ready_marker contract with typed inputs and safe results.
/// Preserves current disclosure, original-intent replay and the documented effect boundary.
pub fn ready_marker(&self, projection_ref: Option<MarketProjectionRef>, cursor: MarketSourceCursor) -> ReadMarker;
```

### FlowSupport<P>.basis

```rust
/// Executes the declared basis contract with typed inputs and safe results.
/// Preserves current disclosure, original-intent replay and the documented effect boundary.
pub fn basis(&self, kind: SafeBasisKind, token: String) -> Result<SafeBasisReference, MarketError>;
```

### FlowSupport<P>.public_result

```rust
/// Executes the declared public_result contract with typed inputs and safe results.
/// Preserves current disclosure, original-intent replay and the documented effect boundary.
pub fn public_result<T, F>(&self, execution: ExecutionResult<MarketResultSurface>, extract: F) -> Result<ExecutionResult<T>, MarketError> where F: FnOnce(MarketResultSurface) -> Result<T, MarketError>;
```

### FlowSupport<P>.subject_for_target

```rust
/// Executes the declared subject_for_target contract with typed inputs and safe results.
/// Preserves current disclosure, original-intent replay and the documented effect boundary.
pub fn subject_for_target(&self, target: MarketWorkTargetRef) -> MarketAuditSubjectRef;
```

### FlowSupport<P>.bounded_window

```rust
/// Executes the declared bounded_window contract with typed inputs and safe results.
/// Preserves current disclosure, original-intent replay and the documented effect boundary.
pub fn bounded_window(&self, upper: MarketSourceCursor, after: Option<RepositoryCursor>) -> Result<ReadWindow, MarketError>;
```

### FlowSupport<P>.attempt_snapshot

```rust
/// Executes the declared attempt_snapshot contract with typed inputs and safe results.
/// Preserves current disclosure, original-intent replay and the documented effect boundary.
pub fn attempt_snapshot(&self, value: DistributionAttempt) -> DistributionAttemptSnapshot;
```

### FlowSupport<P>.notice_item

```rust
/// Executes the declared notice_item contract with typed inputs and safe results.
/// Preserves current disclosure, original-intent replay and the documented effect boundary.
pub fn notice_item(&self, value: NoticeIntent) -> NoticeReadItem;
```


### ReviewProbeResult

```rust
/// Carries ReviewProbeResult with explicit sources and no upstream body.
pub struct ReviewProbeResult {
    /// Carries inspection; see the source and invariant table.
    pub inspection: ExternalEffectInspectionInput,
    /// Carries dispatch_outcome; see the source and invariant table.
    pub dispatch_outcome: Option<ReviewDispatchOutcomeInput>,
    /// Carries decision; see the source and invariant table.
    pub decision: Option<GovernanceReadOutput>,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| inspection | `ExternalEffectInspectionInput` | formal original handoff intent probe; KnownNotCommitted requires proof, not ACK |
| dispatch_outcome | `Option<ReviewDispatchOutcomeInput>` | formal original handoff dispatch receipt/outcome if owner explicitly provides it; Confirmed needs actual ReviewDispatchOutcomeRef |
| decision | `Option<GovernanceReadOutput>` | formal exact application/basis/scope current decision if probe supports returning it; absence does not imply approved |

归属：application；inspection-only Confirmed with no receipt/decision keeps original handoff Unknown and waiting, never manufactures outcome_ref from proof token; no owner support claim



## Job结果提交帧与审计callable

| 对象 | 完整签名 | 字段与副作用 |
|---|---|---|
| FlowSupport<P> | `pub fn audit_at(&self, reserved: &ReservedOperation, subject: MarketAuditSubjectRef, bases: SafeBasisReferenceSet, cursor: MarketSourceCursor) -> Result<MarketAuditRecord, MarketError>` | 与audit同ID/context/subject/bases映射；cursor取UnitOfWork.assign_cursor(result Tx B)而非旧claim A游标。MarketAuditRecord.append_fact完整MarketAuditInput逐字段，pure no I/O |
| FlowSupport<P> | `pub fn audit(&self, reserved: &ReservedOperation, subject: MarketAuditSubjectRef, bases: SafeBasisReferenceSet) -> Result<MarketAuditRecord, MarketError>` | Command单acceptedUoW沿reserved.cursor；Job必须audit_at结果B游标。claim/frame不是ownercommit证据 |

```rust
/// Captures a safe local audit fact at the actual result transaction cursor.
/// Preserves the winning operation, result and audit identities without inventing owner evidence.
pub fn audit_at(&self, reserved: &ReservedOperation, subject: MarketAuditSubjectRef, bases: SafeBasisReferenceSet, cursor: MarketSourceCursor) -> Result<MarketAuditRecord, MarketError>;
```

JobCheckpoint.reserved.cursor为已提交初始claim的本地游标；业务结果与lateimpact在结果Tx B新增本地cursor。不能以A游标排序B新事实。原IDs/context/key/typedrequest保持原值，首次完整原report捕获于真实结果提交B；只有完整实际原报告依据才finish_original，不能声称过去已经有不存在的B/evidence。
