# Step9 U2 申请/正式审核交接独立flow小循环

## 思考、诊断与取舍

本族从Step8完整typed请求逐入口推导读取/构造/guard/Tx/结果。先current披露与fulloriginalreplay，再fresh业务；SQLtx不跨externalowner调用。采用原typedcheckpoint/permission/probe/完整manifest，拒绝body复制、scan/ACK审批、取消覆盖lateeffect和不可见count泄漏。伪代码只设计，不宣称compile/run。

## 批次表

| flow | 协议 | 对象能力 | Tx / effect |
|---|---|---|---|
| CreatePublicationDraftFlow | CreatePublicationDraftRequest | PublicationApplication.draft / current publisher edit authority | 单accepted UoW |
| RevisePublicationDraftFlow | RevisePublicationDraftRequest | PublicationApplication.revise / Draft guard | 单accepted UoW |
| SubmitPublicationApplicationFlow | SubmitPublicationApplicationRequest | PublicationBasis.freeze + PublicationApplication.submit + ReviewHandoff.prepare / source currentqualified | 单accepted UoW |
| TerminatePublicationApplicationFlow | TerminatePublicationApplicationRequest | PublicationApplication.terminate / formal terminateauthority | 单accepted UoW |
| RecordGovernanceDecisionFlow | RecordGovernanceDecisionRequest | GovernanceDecisionBinding.from_governance + ReviewHandoff.record_decision / GovernancePort.read_decision | 单accepted UoW |
| GetPublicationProgressFlow | GetPublicationProgressRequest | MarketStore app/basis/review typedreads + safeview | readonly，无写 |
| DispatchReviewHandoffFlow | DispatchReviewHandoffRequest | ReviewHandoff.record_dispatch / formal Gov dispatch afterpermission | claim/permission→external outsideTx→result UoW |
| ReconcileReviewHandoffFlow | ReconcileReviewHandoffRequest | Gov originalintentprobe + formal decision/currentbinding | claim/permission→external outsideTx→result UoW |

### CreatePublicationDraftFlow

#### 入口与目标

`pub async fn create_publication_draft(&self, request: CommandEnvelope<CreatePublicationDraftRequest>) -> Result<ExecutionResult<PublicationApplicationResult>, MarketError>`；planned publication_review/create_publication_draft.rs。目标：PublicationApplication.draft / current publisher edit authority。只允许Step6方法、Step7 typedports/[application callables](03_ddd_step_07_application_callables.md)，不能调用未定义业务builder。

#### 函数级ASCII调用图

```text
[API create_publication_draft typedRequest]
  | call CommandRunner.prepare(current scope -> fullresult replay)
  v
[fresh readonly local facts -> external formal prechecks; no write Tx]
  | tx begin ReadWrite -> reserve under operation-key lock
  v
[PublicationApplication factory/member + typed guard]
  | save Draft +安全candidate；无basis/review/approval
  v
[work/plan + audit + StoredResult + Operation.complete]
  | commit -> KnownCommitted / Unknown-key-resolution
  v
[original typed PublicationApplicationResult]
```

#### Rust风格伪代码

```rust
let source_candidates: Vec<SourceVerificationTarget> = vec![request.body.draft_spec.source_candidate.clone()];
let requested_scope: Option<MarketScopeRef> = Some(request.body.draft_spec.scope_ref.clone());
// [CommandRunner.prepare(CommandEnvelope request, MarketOperationKind kind, typed subjects, candidates, requested_scope)]
let subjects = vec![];
let start = commands.prepare(request, MarketOperationKind::CreatePublicationDraft, subjects, source_candidates, requested_scope).await?;
let prepared = match start {
    CommandStart::Fresh(p) => p,
    CommandStart::Replayed(stored) => return match stored.safe_result { MarketResultSurface::Application(value) => Ok(ExecutionResult { value, disposition: ReplayDisposition::OriginalReplayed }), _ => Err(support.error(ErrorCode::IntegrityFailure)) },
};
let body: CreatePublicationDraftRequest = prepared.body.clone();
// [UnitOfWork.begin(UowMode::ReadOnly)]
let mut reads = uow.begin(UowMode::ReadOnly).await?;
let local_read = async {
let publisher_row = support.require(store.load_publisher(&mut reads, body.draft_spec.publisher_ref.clone()).await?)?;
Ok((publisher_row,))
}.await;
// [UnitOfWork.rollback(readonly tx)]
uow.rollback(reads).await?;
let (publisher_row,) = local_read?;

// [formal owner ports / FreshGate.publication or admission; outside SQL tx]
let authority = publisher_port.current_authority(publisher_row.value.clone(), prepared.scope.read_context.clone()).await?;
// [UnitOfWork.begin(UowMode::ReadWrite)]
let mut tx = uow.begin(UowMode::ReadWrite).await?;
// [CommandRunner.reserve(tx, prepared): lock key -> replay race / fresh ids]
let reserved = match commands.reserve(&mut tx, &prepared).await {
    Ok(ReservationOutcome::Fresh(r)) => r,
    Ok(ReservationOutcome::Replayed(stored)) => {
        uow.rollback(tx).await?;
        return match stored.safe_result {
            MarketResultSurface::Application(value) => Ok(ExecutionResult { value, disposition: ReplayDisposition::OriginalReplayed }),
            _ => Err(support.error(ErrorCode::IntegrityFailure)),
        };
    },
    Err(error) => { uow.rollback(tx).await?; return Err(error); },
};
let outcome = async {
    let mut works: Vec<PlannedResponsibility> = vec![];
    let mut bases: SafeBasisReferenceSet = prepared.scope.authority_basis.clone();
    bases.push(support.basis(SafeBasisKind::Publisher, authority.authority_ref.token.clone())?);
    let window = support.bounded_window(reserved.cursor, None)?;
    // [UnitOfWork.lock_publisher(Tx tx, PublisherRelationRef publisher_ref)]
    uow.lock_publisher(&mut tx, body.draft_spec.publisher_ref.clone()).await?;
    let current_publisher = support.require(store.load_publisher(&mut tx, body.draft_spec.publisher_ref.clone()).await?)?;
    support.assert_binding(current_publisher.value.state == PublisherRelationState::Bound)?;
    // Current formal authority must match this exact reloaded relation; local Release uses same lock.
    // [PublicationApplication factory/member; typed owner input construction]
    let application = PublicationApplication::draft(DraftPublicationInput { application_ref: ids.new_publication_application_ref(), draft_spec: body.draft_spec.clone() })?;
    store.save_application(&mut tx, application.clone(), ExpectedMarketRevision::MustNotExist).await?;
    let subject = MarketAuditSubjectRef::Application(application.application_ref.clone());
    // [FlowSupport.queue_projections(tx, reserved, subject, current scope)]
    works.extend(support.queue_projections(&mut tx, &reserved, subject.clone(), prepared.scope.read_context.clone()).await?);
    // [FlowSupport.audit / receipt: stable reserved IDs, complete safe refs]
    let audit = support.audit(&reserved, subject, bases.clone())?;
    // Freeze the accepted audit handoff before constructing the complete original receipt.
    works.push(support.schedule(
        &reserved, None,
        MarketWorkTargetRef::Observation(reserved.operation.value.operation_ref.clone()),
        MarketEffectIntentRef::Observation(reserved.operation.value.operation_ref.clone()),
        MarketOperationKind::DispatchObservation, prepared.scope.read_context.scope_ref.clone(),
        None, None, vec![audit.audit_ref.clone()],
    )?);
    let receipt = support.receipt(&reserved, works.iter().map(|w|w.work.work_ref.clone()).collect(), bases);
    let result = PublicationApplicationResult { receipt, application_ref: application.application_ref, state: application.state, draft_spec: application.draft_spec, basis_ref: application.basis_ref, review_ref: application.review_ref };
    Ok((MarketResultSurface::Application(result), audit, works))
}.await;
match outcome {
    Err(error) => { uow.rollback(tx).await?; Err(error) },
    Ok((surface, audit, works)) => {
        // [CommandRunner.finish: work+plan -> audit -> complete original result -> operation -> commit]
        let execution = commands.finish(tx, reserved, surface, audit, works).await?;
        support.public_result(execution, |s| match s { MarketResultSurface::Application(v) => Ok(v), _ => Err(support.error(ErrorCode::IntegrityFailure)) })
    },
}
```

#### 输入构造与条件来源

| 符号 / 参数 | 唯一来源 | missing / binding / 保持规则 |
|---|---|---|
| body | CreatePublicationDraftRequest完整schema | HLD Qualified输入只是内侧构造，不信client approved/verified |
| source_candidates/requested_scope | 本DTO source_candidate或draft_spec.source_candidate/target.scope_ref、Bind requested_scope；无该字段时empty/None | 正式ScopeResolver.resolve重新裁剪，不从opaqueparse；taxonomyCreate明确requested_scope |
| readonly本体 | 上述load返回完整Versioned或immutablebasis | Missing拒绝；mutablefresh在writeTx重读、CAS和fixedbasis/subject相等 |
| formal qualified变量 | let authority = publisher_port.current_authority(publisher_row.value.clone(), prepared.scope.read_context.clone()).await?; | fields逐schema full复制；consumer_contract取不到blocked，不自造true |
| bases | currentScope.authority_basis + 当次formal source/material/Gov/receiver/disposition/notice safe refs | 同kind typedtoken通过FlowSupport.basis复制；缺正式proof不形成allow/approval |
| window | reserved.cursor固定upper+validatedbatchlimit | 只durable内部scan，不是Querypage；需要所有页时durablecontinuation，不首page冒全量 |
| result/receipt | above完整familyliteral，IDs/revision取actualstaged save/readback | originalfulltyped result同Tx，replay不再生成/更新 |

#### Tx、状态与副作用inventory

| 项 | 本flow边界 |
|---|---|
| accepted局部变化 | Draft +安全candidate；无basis/review/approval |
| 同UoW必写 | typed owningfacts + qualification/disposition sidecar（如适用）+ Corecontext + audit + 完整PublicationApplicationResult + Operation Completed + 必要work/plan |
| external effect | 无Command直接dispatch；fresh external调用仅formalread/qualification，业务write effect由durableJob |
| projection | 只安排必要typed derivedwork；不命令伪改Fresh；read发现cursor落后degraded，Rebuild正式推进 |
| failure | malformed/notvisible/diffintent/缺ref/不匹配/非法state/CAS→safe错误与全部rollback；commitUnknown key-read正式resolve，不blind freshretry |
| replay | 当前authority/disclosure先核；同key+fingerprint读原完整payload，不业务precheck/ID/Clock/method/save/dispatch |

#### 测试切口与停审

planned create_publication_draft: freshaccepted、samekeyoriginalreplay（副作用0）、changedintentconflict、scopehide、missing/unsafe/candidatewrongkind、每save后故障rollback、CASrace，以及“Draft +安全candidate；无basis/review/approval”特有状态/binding/竞态。文档小循环检查DTO、完整method/port调用、result与副作用；不造测试run/evidence。下一flow仅在本flow规则已列后展开。


### RevisePublicationDraftFlow

#### 入口与目标

`pub async fn revise_publication_draft(&self, request: CommandEnvelope<RevisePublicationDraftRequest>) -> Result<ExecutionResult<PublicationApplicationResult>, MarketError>`；planned publication_review/revise_publication_draft.rs。目标：PublicationApplication.revise / Draft guard。只允许Step6方法、Step7 typedports/[application callables](03_ddd_step_07_application_callables.md)，不能调用未定义业务builder。

#### 函数级ASCII调用图

```text
[API revise_publication_draft typedRequest]
  | call CommandRunner.prepare(current scope -> fullresult replay)
  v
[fresh readonly local facts -> external formal prechecks; no write Tx]
  | tx begin ReadWrite -> reserve under operation-key lock
  v
[PublicationApplication factory/member + typed guard]
  | save 仅Draft修订，不Submitted替换fixedbasis
  v
[work/plan + audit + StoredResult + Operation.complete]
  | commit -> KnownCommitted / Unknown-key-resolution
  v
[original typed PublicationApplicationResult]
```

#### Rust风格伪代码

```rust
let source_candidates: Vec<SourceVerificationTarget> = vec![request.body.draft_spec.source_candidate.clone()];
let requested_scope: Option<MarketScopeRef> = Some(request.body.draft_spec.scope_ref.clone());
// [CommandRunner.prepare(CommandEnvelope request, MarketOperationKind kind, typed subjects, candidates, requested_scope)]
let subjects = vec![MarketAuditSubjectRef::Application(request.body.application_ref.clone())];
let start = commands.prepare(request, MarketOperationKind::RevisePublicationDraft, subjects, source_candidates, requested_scope).await?;
let prepared = match start {
    CommandStart::Fresh(p) => p,
    CommandStart::Replayed(stored) => return match stored.safe_result { MarketResultSurface::Application(value) => Ok(ExecutionResult { value, disposition: ReplayDisposition::OriginalReplayed }), _ => Err(support.error(ErrorCode::IntegrityFailure)) },
};
let body: RevisePublicationDraftRequest = prepared.body.clone();
// [UnitOfWork.begin(UowMode::ReadOnly)]
let mut reads = uow.begin(UowMode::ReadOnly).await?;
let local_read = async {
let application_row = support.require(store.load_application(&mut reads, body.application_ref.clone()).await?)?;
let publisher_row = support.require(store.load_publisher(&mut reads, body.draft_spec.publisher_ref.clone()).await?)?;
Ok((application_row, publisher_row))
}.await;
// [UnitOfWork.rollback(readonly tx)]
uow.rollback(reads).await?;
let (application_row, publisher_row) = local_read?;

// [formal owner ports / FreshGate.publication or admission; outside SQL tx]
let authority = publisher_port.current_authority(publisher_row.value.clone(), prepared.scope.read_context.clone()).await?;
// [UnitOfWork.begin(UowMode::ReadWrite)]
let mut tx = uow.begin(UowMode::ReadWrite).await?;
// [CommandRunner.reserve(tx, prepared): lock key -> replay race / fresh ids]
let reserved = match commands.reserve(&mut tx, &prepared).await {
    Ok(ReservationOutcome::Fresh(r)) => r,
    Ok(ReservationOutcome::Replayed(stored)) => {
        uow.rollback(tx).await?;
        return match stored.safe_result {
            MarketResultSurface::Application(value) => Ok(ExecutionResult { value, disposition: ReplayDisposition::OriginalReplayed }),
            _ => Err(support.error(ErrorCode::IntegrityFailure)),
        };
    },
    Err(error) => { uow.rollback(tx).await?; return Err(error); },
};
let outcome = async {
    let mut works: Vec<PlannedResponsibility> = vec![];
    let mut bases: SafeBasisReferenceSet = prepared.scope.authority_basis.clone();
    bases.push(support.basis(SafeBasisKind::Publisher, authority.authority_ref.token.clone())?);
    let window = support.bounded_window(reserved.cursor, None)?;
    // [UnitOfWork.lock_publisher(Tx tx, PublisherRelationRef publisher_ref)]
    uow.lock_publisher(&mut tx, body.draft_spec.publisher_ref.clone()).await?;
    let current_publisher = support.require(store.load_publisher(&mut tx, body.draft_spec.publisher_ref.clone()).await?)?;
    support.assert_binding(current_publisher.value.state == PublisherRelationState::Bound)?;
    // Current formal authority must match this exact reloaded relation; local Release uses same lock.
    // [PublicationApplication factory/member; typed owner input construction]
    let loaded = support.require(store.load_application(&mut tx, body.application_ref.clone()).await?)?;
    support.expect_revision(loaded.revision, body.expected_revision)?;
    let mut application = loaded.value;
    application.revise(DraftPublicationInput { application_ref: body.application_ref.clone(), draft_spec: body.draft_spec.clone() })?;
    store.save_application(&mut tx, application.clone(), ExpectedMarketRevision::Exact(loaded.revision)).await?;
    let subject = MarketAuditSubjectRef::Application(application.application_ref.clone());
    // [FlowSupport.queue_projections(tx, reserved, subject, current scope)]
    works.extend(support.queue_projections(&mut tx, &reserved, subject.clone(), prepared.scope.read_context.clone()).await?);
    // [FlowSupport.audit / receipt: stable reserved IDs, complete safe refs]
    let audit = support.audit(&reserved, subject, bases.clone())?;
    // Freeze the accepted audit handoff before constructing the complete original receipt.
    works.push(support.schedule(
        &reserved, None,
        MarketWorkTargetRef::Observation(reserved.operation.value.operation_ref.clone()),
        MarketEffectIntentRef::Observation(reserved.operation.value.operation_ref.clone()),
        MarketOperationKind::DispatchObservation, prepared.scope.read_context.scope_ref.clone(),
        None, None, vec![audit.audit_ref.clone()],
    )?);
    let receipt = support.receipt(&reserved, works.iter().map(|w|w.work.work_ref.clone()).collect(), bases);
    let result = PublicationApplicationResult { receipt, application_ref: application.application_ref, state: application.state, draft_spec: application.draft_spec, basis_ref: application.basis_ref, review_ref: application.review_ref };
    Ok((MarketResultSurface::Application(result), audit, works))
}.await;
match outcome {
    Err(error) => { uow.rollback(tx).await?; Err(error) },
    Ok((surface, audit, works)) => {
        // [CommandRunner.finish: work+plan -> audit -> complete original result -> operation -> commit]
        let execution = commands.finish(tx, reserved, surface, audit, works).await?;
        support.public_result(execution, |s| match s { MarketResultSurface::Application(v) => Ok(v), _ => Err(support.error(ErrorCode::IntegrityFailure)) })
    },
}
```

#### 输入构造与条件来源

| 符号 / 参数 | 唯一来源 | missing / binding / 保持规则 |
|---|---|---|
| body | RevisePublicationDraftRequest完整schema | HLD Qualified输入只是内侧构造，不信client approved/verified |
| source_candidates/requested_scope | 本DTO source_candidate或draft_spec.source_candidate/target.scope_ref、Bind requested_scope；无该字段时empty/None | 正式ScopeResolver.resolve重新裁剪，不从opaqueparse；taxonomyCreate明确requested_scope |
| readonly本体 | 上述load返回完整Versioned或immutablebasis | Missing拒绝；mutablefresh在writeTx重读、CAS和fixedbasis/subject相等 |
| formal qualified变量 | let authority = publisher_port.current_authority(publisher_row.value.clone(), prepared.scope.read_context.clone()).await?; | fields逐schema full复制；consumer_contract取不到blocked，不自造true |
| bases | currentScope.authority_basis + 当次formal source/material/Gov/receiver/disposition/notice safe refs | 同kind typedtoken通过FlowSupport.basis复制；缺正式proof不形成allow/approval |
| window | reserved.cursor固定upper+validatedbatchlimit | 只durable内部scan，不是Querypage；需要所有页时durablecontinuation，不首page冒全量 |
| result/receipt | above完整familyliteral，IDs/revision取actualstaged save/readback | originalfulltyped result同Tx，replay不再生成/更新 |

#### Tx、状态与副作用inventory

| 项 | 本flow边界 |
|---|---|
| accepted局部变化 | 仅Draft修订，不Submitted替换fixedbasis |
| 同UoW必写 | typed owningfacts + qualification/disposition sidecar（如适用）+ Corecontext + audit + 完整PublicationApplicationResult + Operation Completed + 必要work/plan |
| external effect | 无Command直接dispatch；fresh external调用仅formalread/qualification，业务write effect由durableJob |
| projection | 只安排必要typed derivedwork；不命令伪改Fresh；read发现cursor落后degraded，Rebuild正式推进 |
| failure | malformed/notvisible/diffintent/缺ref/不匹配/非法state/CAS→safe错误与全部rollback；commitUnknown key-read正式resolve，不blind freshretry |
| replay | 当前authority/disclosure先核；同key+fingerprint读原完整payload，不业务precheck/ID/Clock/method/save/dispatch |

#### 测试切口与停审

planned revise_publication_draft: freshaccepted、samekeyoriginalreplay（副作用0）、changedintentconflict、scopehide、missing/unsafe/candidatewrongkind、每save后故障rollback、CASrace，以及“仅Draft修订，不Submitted替换fixedbasis”特有状态/binding/竞态。文档小循环检查DTO、完整method/port调用、result与副作用；不造测试run/evidence。下一flow仅在本flow规则已列后展开。


### SubmitPublicationApplicationFlow

#### 入口与目标

`pub async fn submit_publication_application(&self, request: CommandEnvelope<SubmitPublicationApplicationRequest>) -> Result<ExecutionResult<PublicationApplicationResult>, MarketError>`；planned publication_review/submit_publication_application.rs。目标：PublicationBasis.freeze + PublicationApplication.submit + ReviewHandoff.prepare / source currentqualified。只允许Step6方法、Step7 typedports/[application callables](03_ddd_step_07_application_callables.md)，不能调用未定义业务builder。

#### 函数级ASCII调用图

```text
[API submit_publication_application typedRequest]
  | call CommandRunner.prepare(current scope -> fullresult replay)
  v
[fresh readonly local facts -> external formal prechecks; no write Tx]
  | tx begin ReadWrite -> reserve under operation-key lock
  v
[PublicationApplication factory/member + typed guard]
  | save fixedBasis +Submitted+PendingDispatch review+durablework；没有Govapproval
  v
[work/plan + audit + StoredResult + Operation.complete]
  | commit -> KnownCommitted / Unknown-key-resolution
  v
[original typed PublicationApplicationResult]
```

#### Rust风格伪代码

```rust
let source_candidates: Vec<SourceVerificationTarget> = vec![];
let requested_scope: Option<MarketScopeRef> = None;
// [CommandRunner.prepare(CommandEnvelope request, MarketOperationKind kind, typed subjects, candidates, requested_scope)]
let subjects = vec![MarketAuditSubjectRef::Application(request.body.application_ref.clone())];
let start = commands.prepare(request, MarketOperationKind::SubmitPublicationApplication, subjects, source_candidates, requested_scope).await?;
let prepared = match start {
    CommandStart::Fresh(p) => p,
    CommandStart::Replayed(stored) => return match stored.safe_result { MarketResultSurface::Application(value) => Ok(ExecutionResult { value, disposition: ReplayDisposition::OriginalReplayed }), _ => Err(support.error(ErrorCode::IntegrityFailure)) },
};
let body: SubmitPublicationApplicationRequest = prepared.body.clone();
// [UnitOfWork.begin(UowMode::ReadOnly)]
let mut reads = uow.begin(UowMode::ReadOnly).await?;
let local_read = async {
let application_row = support.require(store.load_application(&mut reads, body.application_ref.clone()).await?)?;
let publisher_row = support.require(store.load_publisher(&mut reads, application_row.value.draft_spec.publisher_ref.clone()).await?)?;
Ok((application_row, publisher_row))
}.await;
// [UnitOfWork.rollback(readonly tx)]
uow.rollback(reads).await?;
let (application_row, publisher_row) = local_read?;

// [formal owner ports / FreshGate.publication or admission; outside SQL tx]
let q = gates.publication(publisher_row.value.clone(), application_row.value.draft_spec.clone(), prepared.scope.read_context.clone()).await?;
// [UnitOfWork.begin(UowMode::ReadWrite)]
let mut tx = uow.begin(UowMode::ReadWrite).await?;
// [CommandRunner.reserve(tx, prepared): lock key -> replay race / fresh ids]
let reserved = match commands.reserve(&mut tx, &prepared).await {
    Ok(ReservationOutcome::Fresh(r)) => r,
    Ok(ReservationOutcome::Replayed(stored)) => {
        uow.rollback(tx).await?;
        return match stored.safe_result {
            MarketResultSurface::Application(value) => Ok(ExecutionResult { value, disposition: ReplayDisposition::OriginalReplayed }),
            _ => Err(support.error(ErrorCode::IntegrityFailure)),
        };
    },
    Err(error) => { uow.rollback(tx).await?; return Err(error); },
};
let outcome = async {
    let mut works: Vec<PlannedResponsibility> = vec![];
    let mut bases: SafeBasisReferenceSet = prepared.scope.authority_basis.clone();
    bases.push(support.basis(SafeBasisKind::Publisher, q.authority.authority_ref.token.clone())?);
    bases.push(support.basis(SafeBasisKind::Source, q.source.eligibility_ref.token.clone())?);
    for material in &q.materials { bases.push(support.basis(SafeBasisKind::Material, material.material_ref.token.clone())?); }
    let window = support.bounded_window(reserved.cursor, None)?;
    // [UnitOfWork.lock_publisher(Tx tx, PublisherRelationRef publisher_ref)]
    uow.lock_publisher(&mut tx, application_row.value.draft_spec.publisher_ref.clone()).await?;
    let current_publisher = support.require(store.load_publisher(&mut tx, application_row.value.draft_spec.publisher_ref.clone()).await?)?;
    support.assert_binding(current_publisher.value.state == PublisherRelationState::Bound)?;
    // Current formal authority must match this exact reloaded relation; local Release uses same lock.
    // [PublicationApplication factory/member; typed owner input construction]
    let loaded = support.require(store.load_application(&mut tx, body.application_ref.clone()).await?)?;
    support.expect_revision(loaded.revision, body.expected_revision)?;
    support.assert_binding(loaded.value.draft_spec == application_row.value.draft_spec)?;
    let input = QualifiedPublicationInput { basis_ref: ids.new_publication_basis_ref(), source: q.source, publisher_ref: loaded.value.draft_spec.publisher_ref.clone(), materials: q.materials, scope_ref: prepared.scope.read_context.scope_ref.clone(), review_ref: ids.new_review_handoff_ref() };
    let basis = PublicationBasis::freeze(input.clone())?;
    let mut application = loaded.value;
    application.submit(input.clone())?;
    let review = ReviewHandoff::prepare(SubmittedApplicationInput { handoff_ref: input.review_ref.clone(), application_ref: application.application_ref.clone(), basis_ref: basis.basis_ref.clone() })?;
    store.append_basis(&mut tx, basis).await?;
    store.save_application(&mut tx, application.clone(), ExpectedMarketRevision::Exact(loaded.revision)).await?;
    store.save_review(&mut tx, review.clone(), ExpectedMarketRevision::MustNotExist).await?;
    works.push(support.schedule(&reserved, None, MarketWorkTargetRef::Review(review.handoff_ref.clone()), MarketEffectIntentRef::Review(review.handoff_ref), MarketOperationKind::DispatchReviewHandoff, prepared.scope.read_context.scope_ref.clone(), None, None, vec![])?);
    let subject = MarketAuditSubjectRef::Application(application.application_ref.clone());
    // [FlowSupport.queue_projections(tx, reserved, subject, current scope)]
    works.extend(support.queue_projections(&mut tx, &reserved, subject.clone(), prepared.scope.read_context.clone()).await?);
    // [FlowSupport.audit / receipt: stable reserved IDs, complete safe refs]
    let audit = support.audit(&reserved, subject, bases.clone())?;
    // Freeze the accepted audit handoff before constructing the complete original receipt.
    works.push(support.schedule(
        &reserved, None,
        MarketWorkTargetRef::Observation(reserved.operation.value.operation_ref.clone()),
        MarketEffectIntentRef::Observation(reserved.operation.value.operation_ref.clone()),
        MarketOperationKind::DispatchObservation, prepared.scope.read_context.scope_ref.clone(),
        None, None, vec![audit.audit_ref.clone()],
    )?);
    let receipt = support.receipt(&reserved, works.iter().map(|w|w.work.work_ref.clone()).collect(), bases);
    let result = PublicationApplicationResult { receipt, application_ref: application.application_ref, state: application.state, draft_spec: application.draft_spec, basis_ref: application.basis_ref, review_ref: application.review_ref };
    Ok((MarketResultSurface::Application(result), audit, works))
}.await;
match outcome {
    Err(error) => { uow.rollback(tx).await?; Err(error) },
    Ok((surface, audit, works)) => {
        // [CommandRunner.finish: work+plan -> audit -> complete original result -> operation -> commit]
        let execution = commands.finish(tx, reserved, surface, audit, works).await?;
        support.public_result(execution, |s| match s { MarketResultSurface::Application(v) => Ok(v), _ => Err(support.error(ErrorCode::IntegrityFailure)) })
    },
}
```

#### 输入构造与条件来源

| 符号 / 参数 | 唯一来源 | missing / binding / 保持规则 |
|---|---|---|
| body | SubmitPublicationApplicationRequest完整schema | HLD Qualified输入只是内侧构造，不信client approved/verified |
| source_candidates/requested_scope | 本DTO source_candidate或draft_spec.source_candidate/target.scope_ref、Bind requested_scope；无该字段时empty/None | 正式ScopeResolver.resolve重新裁剪，不从opaqueparse；taxonomyCreate明确requested_scope |
| readonly本体 | 上述load返回完整Versioned或immutablebasis | Missing拒绝；mutablefresh在writeTx重读、CAS和fixedbasis/subject相等 |
| formal qualified变量 | let q = gates.publication(publisher_row.value.clone(), application_row.value.draft_spec.clone(), prepared.scope.read_context.clone()).await?; | fields逐schema full复制；consumer_contract取不到blocked，不自造true |
| bases | currentScope.authority_basis + 当次formal source/material/Gov/receiver/disposition/notice safe refs | 同kind typedtoken通过FlowSupport.basis复制；缺正式proof不形成allow/approval |
| window | reserved.cursor固定upper+validatedbatchlimit | 只durable内部scan，不是Querypage；需要所有页时durablecontinuation，不首page冒全量 |
| result/receipt | above完整familyliteral，IDs/revision取actualstaged save/readback | originalfulltyped result同Tx，replay不再生成/更新 |

#### Tx、状态与副作用inventory

| 项 | 本flow边界 |
|---|---|
| accepted局部变化 | fixedBasis +Submitted+PendingDispatch review+durablework；没有Govapproval |
| 同UoW必写 | typed owningfacts + qualification/disposition sidecar（如适用）+ Corecontext + audit + 完整PublicationApplicationResult + Operation Completed + 必要work/plan |
| external effect | 无Command直接dispatch；fresh external调用仅formalread/qualification，业务write effect由durableJob |
| projection | 只安排必要typed derivedwork；不命令伪改Fresh；read发现cursor落后degraded，Rebuild正式推进 |
| failure | malformed/notvisible/diffintent/缺ref/不匹配/非法state/CAS→safe错误与全部rollback；commitUnknown key-read正式resolve，不blind freshretry |
| replay | 当前authority/disclosure先核；同key+fingerprint读原完整payload，不业务precheck/ID/Clock/method/save/dispatch |

#### 测试切口与停审

planned submit_publication_application: freshaccepted、samekeyoriginalreplay（副作用0）、changedintentconflict、scopehide、missing/unsafe/candidatewrongkind、每save后故障rollback、CASrace，以及“fixedBasis +Submitted+PendingDispatch review+durablework；没有Govapproval”特有状态/binding/竞态。文档小循环检查DTO、完整method/port调用、result与副作用；不造测试run/evidence。下一flow仅在本flow规则已列后展开。


### TerminatePublicationApplicationFlow

#### 入口与目标

`pub async fn terminate_publication_application(&self, request: CommandEnvelope<TerminatePublicationApplicationRequest>) -> Result<ExecutionResult<PublicationApplicationResult>, MarketError>`；planned publication_review/terminate_publication_application.rs。目标：PublicationApplication.terminate / formal terminateauthority。只允许Step6方法、Step7 typedports/[application callables](03_ddd_step_07_application_callables.md)，不能调用未定义业务builder。

#### 函数级ASCII调用图

```text
[API terminate_publication_application typedRequest]
  | call CommandRunner.prepare(current scope -> fullresult replay)
  v
[fresh readonly local facts -> external formal prechecks; no write Tx]
  | tx begin ReadWrite -> reserve under operation-key lock
  v
[PublicationApplication factory/member + typed guard]
  | save Terminated；原review/permission/external决定和unknown责任保留
  v
[work/plan + audit + StoredResult + Operation.complete]
  | commit -> KnownCommitted / Unknown-key-resolution
  v
[original typed PublicationApplicationResult]
```

#### Rust风格伪代码

```rust
let source_candidates: Vec<SourceVerificationTarget> = vec![];
let requested_scope: Option<MarketScopeRef> = None;
// [CommandRunner.prepare(CommandEnvelope request, MarketOperationKind kind, typed subjects, candidates, requested_scope)]
let subjects = vec![MarketAuditSubjectRef::Application(request.body.application_ref.clone())];
let start = commands.prepare(request, MarketOperationKind::TerminatePublicationApplication, subjects, source_candidates, requested_scope).await?;
let prepared = match start {
    CommandStart::Fresh(p) => p,
    CommandStart::Replayed(stored) => return match stored.safe_result { MarketResultSurface::Application(value) => Ok(ExecutionResult { value, disposition: ReplayDisposition::OriginalReplayed }), _ => Err(support.error(ErrorCode::IntegrityFailure)) },
};
let body: TerminatePublicationApplicationRequest = prepared.body.clone();
// [UnitOfWork.begin(UowMode::ReadOnly)]
let mut reads = uow.begin(UowMode::ReadOnly).await?;
let local_read = async {
let application_row = support.require(store.load_application(&mut reads, body.application_ref.clone()).await?)?;
Ok((application_row,))
}.await;
// [UnitOfWork.rollback(readonly tx)]
uow.rollback(reads).await?;
let (application_row,) = local_read?;

// [formal owner ports / FreshGate.publication or admission; outside SQL tx]
let authority = publisher_port.authorize_operation(MarketOperationKind::TerminatePublicationApplication, MarketAuditSubjectRef::Application(body.application_ref.clone()), prepared.scope.read_context.clone()).await?;
// [UnitOfWork.begin(UowMode::ReadWrite)]
let mut tx = uow.begin(UowMode::ReadWrite).await?;
// [CommandRunner.reserve(tx, prepared): lock key -> replay race / fresh ids]
let reserved = match commands.reserve(&mut tx, &prepared).await {
    Ok(ReservationOutcome::Fresh(r)) => r,
    Ok(ReservationOutcome::Replayed(stored)) => {
        uow.rollback(tx).await?;
        return match stored.safe_result {
            MarketResultSurface::Application(value) => Ok(ExecutionResult { value, disposition: ReplayDisposition::OriginalReplayed }),
            _ => Err(support.error(ErrorCode::IntegrityFailure)),
        };
    },
    Err(error) => { uow.rollback(tx).await?; return Err(error); },
};
let outcome = async {
    let mut works: Vec<PlannedResponsibility> = vec![];
    let mut bases: SafeBasisReferenceSet = prepared.scope.authority_basis.clone();
    bases.extend(authority.basis_refs.clone());
    let window = support.bounded_window(reserved.cursor, None)?;
    // [PublicationApplication factory/member; typed owner input construction]
    let loaded = support.require(store.load_application(&mut tx, body.application_ref.clone()).await?)?;
    support.expect_revision(loaded.revision, body.expected_revision)?;
    let mut application = loaded.value;
    application.terminate(ApplicationTerminationInput { authority_ref: support.require(authority.disposition_ref)?, reason_ref: body.reason_ref.clone() })?;
    store.save_application(&mut tx, application.clone(), ExpectedMarketRevision::Exact(loaded.revision)).await?;
    let subject = MarketAuditSubjectRef::Application(application.application_ref.clone());
    // [FlowSupport.queue_projections(tx, reserved, subject, current scope)]
    works.extend(support.queue_projections(&mut tx, &reserved, subject.clone(), prepared.scope.read_context.clone()).await?);
    // [FlowSupport.audit / receipt: stable reserved IDs, complete safe refs]
    let audit = support.audit(&reserved, subject, bases.clone())?;
    // Freeze the accepted audit handoff before constructing the complete original receipt.
    works.push(support.schedule(
        &reserved, None,
        MarketWorkTargetRef::Observation(reserved.operation.value.operation_ref.clone()),
        MarketEffectIntentRef::Observation(reserved.operation.value.operation_ref.clone()),
        MarketOperationKind::DispatchObservation, prepared.scope.read_context.scope_ref.clone(),
        None, None, vec![audit.audit_ref.clone()],
    )?);
    let receipt = support.receipt(&reserved, works.iter().map(|w|w.work.work_ref.clone()).collect(), bases);
    let result = PublicationApplicationResult { receipt, application_ref: application.application_ref, state: application.state, draft_spec: application.draft_spec, basis_ref: application.basis_ref, review_ref: application.review_ref };
    Ok((MarketResultSurface::Application(result), audit, works))
}.await;
match outcome {
    Err(error) => { uow.rollback(tx).await?; Err(error) },
    Ok((surface, audit, works)) => {
        // [CommandRunner.finish: work+plan -> audit -> complete original result -> operation -> commit]
        let execution = commands.finish(tx, reserved, surface, audit, works).await?;
        support.public_result(execution, |s| match s { MarketResultSurface::Application(v) => Ok(v), _ => Err(support.error(ErrorCode::IntegrityFailure)) })
    },
}
```

#### 输入构造与条件来源

| 符号 / 参数 | 唯一来源 | missing / binding / 保持规则 |
|---|---|---|
| body | TerminatePublicationApplicationRequest完整schema | HLD Qualified输入只是内侧构造，不信client approved/verified |
| source_candidates/requested_scope | 本DTO source_candidate或draft_spec.source_candidate/target.scope_ref、Bind requested_scope；无该字段时empty/None | 正式ScopeResolver.resolve重新裁剪，不从opaqueparse；taxonomyCreate明确requested_scope |
| readonly本体 | 上述load返回完整Versioned或immutablebasis | Missing拒绝；mutablefresh在writeTx重读、CAS和fixedbasis/subject相等 |
| formal qualified变量 | let authority = publisher_port.authorize_operation(MarketOperationKind::TerminatePublicationApplication, MarketAuditSubjectRef::Application(body.application_ref.clone()), prepared.scope.read_context.clone()).await?; | fields逐schema full复制；consumer_contract取不到blocked，不自造true |
| bases | currentScope.authority_basis + 当次formal source/material/Gov/receiver/disposition/notice safe refs | 同kind typedtoken通过FlowSupport.basis复制；缺正式proof不形成allow/approval |
| window | reserved.cursor固定upper+validatedbatchlimit | 只durable内部scan，不是Querypage；需要所有页时durablecontinuation，不首page冒全量 |
| result/receipt | above完整familyliteral，IDs/revision取actualstaged save/readback | originalfulltyped result同Tx，replay不再生成/更新 |

#### Tx、状态与副作用inventory

| 项 | 本flow边界 |
|---|---|
| accepted局部变化 | Terminated；原review/permission/external决定和unknown责任保留 |
| 同UoW必写 | typed owningfacts + qualification/disposition sidecar（如适用）+ Corecontext + audit + 完整PublicationApplicationResult + Operation Completed + 必要work/plan |
| external effect | 无Command直接dispatch；fresh external调用仅formalread/qualification，业务write effect由durableJob |
| projection | 只安排必要typed derivedwork；不命令伪改Fresh；read发现cursor落后degraded，Rebuild正式推进 |
| failure | malformed/notvisible/diffintent/缺ref/不匹配/非法state/CAS→safe错误与全部rollback；commitUnknown key-read正式resolve，不blind freshretry |
| replay | 当前authority/disclosure先核；同key+fingerprint读原完整payload，不业务precheck/ID/Clock/method/save/dispatch |

#### 测试切口与停审

planned terminate_publication_application: freshaccepted、samekeyoriginalreplay（副作用0）、changedintentconflict、scopehide、missing/unsafe/candidatewrongkind、每save后故障rollback、CASrace，以及“Terminated；原review/permission/external决定和unknown责任保留”特有状态/binding/竞态。文档小循环检查DTO、完整method/port调用、result与副作用；不造测试run/evidence。下一flow仅在本flow规则已列后展开。


### RecordGovernanceDecisionFlow

#### 入口与目标

`pub async fn record_governance_decision(&self, request: CommandEnvelope<RecordGovernanceDecisionRequest>) -> Result<ExecutionResult<ReviewProgressResult>, MarketError>`；planned publication_review/record_governance_decision.rs。目标：GovernanceDecisionBinding.from_governance + ReviewHandoff.record_decision / GovernancePort.read_decision。只允许Step6方法、Step7 typedports/[application callables](03_ddd_step_07_application_callables.md)，不能调用未定义业务builder。

#### 函数级ASCII调用图

```text
[API record_governance_decision typedRequest]
  | call CommandRunner.prepare(current scope -> fullresult replay)
  v
[fresh readonly local facts -> external formal prechecks; no write Tx]
  | tx begin ReadWrite -> reserve under operation-key lock
  v
[ReviewHandoff factory/member + typed guard]
  | save formal MatchedDecision；允许matched rejected也存，不自动Listed，不能matchedPolicy要求approved
  v
[work/plan + audit + StoredResult + Operation.complete]
  | commit -> KnownCommitted / Unknown-key-resolution
  v
[original typed ReviewProgressResult]
```

#### Rust风格伪代码

```rust
let source_candidates: Vec<SourceVerificationTarget> = vec![];
let requested_scope: Option<MarketScopeRef> = None;
// [CommandRunner.prepare(CommandEnvelope request, MarketOperationKind kind, typed subjects, candidates, requested_scope)]
let subjects = vec![MarketAuditSubjectRef::Review(request.body.handoff_ref.clone())];
let start = commands.prepare(request, MarketOperationKind::RecordGovernanceDecision, subjects, source_candidates, requested_scope).await?;
let prepared = match start {
    CommandStart::Fresh(p) => p,
    CommandStart::Replayed(stored) => return match stored.safe_result { MarketResultSurface::Review(value) => Ok(ExecutionResult { value, disposition: ReplayDisposition::OriginalReplayed }), _ => Err(support.error(ErrorCode::IntegrityFailure)) },
};
let body: RecordGovernanceDecisionRequest = prepared.body.clone();
// [UnitOfWork.begin(UowMode::ReadOnly)]
let mut reads = uow.begin(UowMode::ReadOnly).await?;
let local_read = async {
let review_row = support.require(store.load_review(&mut reads, body.handoff_ref.clone()).await?)?;
let basis = support.require(store.load_basis(&mut reads, review_row.value.basis_ref.clone()).await?)?;
Ok((review_row, basis))
}.await;
// [UnitOfWork.rollback(readonly tx)]
uow.rollback(reads).await?;
let (review_row, basis) = local_read?;

// [formal owner ports / FreshGate.publication or admission; outside SQL tx]
let qualified_governance_contract_ref = governance_port.consumer_contract()?;
let formal = governance_port.read_decision(GovernanceReadInput { application_ref: review_row.value.application_ref.clone(), basis: basis.clone(), decision_candidate: Some(body.decision_candidate.clone()), scope: prepared.scope.read_context.clone() }).await?;
let decision = GovernanceDecisionBinding::from_governance(formal.binding)?;
let matched = ReviewBindingPolicy::new(ReviewBindingRequirements { contract_ref: qualified_governance_contract_ref, require_approved_for_listing: false })?.evaluate(basis, decision.clone(), formal.current)?;
support.assert_allowed(matched)?;
// [UnitOfWork.begin(UowMode::ReadWrite)]
let mut tx = uow.begin(UowMode::ReadWrite).await?;
// [CommandRunner.reserve(tx, prepared): lock key -> replay race / fresh ids]
let reserved = match commands.reserve(&mut tx, &prepared).await {
    Ok(ReservationOutcome::Fresh(r)) => r,
    Ok(ReservationOutcome::Replayed(stored)) => {
        uow.rollback(tx).await?;
        return match stored.safe_result {
            MarketResultSurface::Review(value) => Ok(ExecutionResult { value, disposition: ReplayDisposition::OriginalReplayed }),
            _ => Err(support.error(ErrorCode::IntegrityFailure)),
        };
    },
    Err(error) => { uow.rollback(tx).await?; return Err(error); },
};
let outcome = async {
    let mut works: Vec<PlannedResponsibility> = vec![];
    let mut bases: SafeBasisReferenceSet = prepared.scope.authority_basis.clone();
    bases.push(support.basis(SafeBasisKind::Decision, decision.decision_ref.token.clone())?);
    let window = support.bounded_window(reserved.cursor, None)?;
    // [ReviewHandoff factory/member; typed owner input construction]
    let loaded = support.require(store.load_review(&mut tx, body.handoff_ref.clone()).await?)?;
    support.assert_binding(loaded.value.basis_ref == decision.basis_ref && loaded.value.application_ref == decision.application_ref)?;
    let mut review = loaded.value;
    review.record_decision(decision)?;
    store.save_review(&mut tx, review.clone(), ExpectedMarketRevision::Exact(loaded.revision)).await?;
    let subject = MarketAuditSubjectRef::Review(review.handoff_ref.clone());
    // [FlowSupport.queue_projections(tx, reserved, subject, current scope)]
    works.extend(support.queue_projections(&mut tx, &reserved, subject.clone(), prepared.scope.read_context.clone()).await?);
    // [FlowSupport.audit / receipt: stable reserved IDs, complete safe refs]
    let audit = support.audit(&reserved, subject, bases.clone())?;
    // Freeze the accepted audit handoff before constructing the complete original receipt.
    works.push(support.schedule(
        &reserved, None,
        MarketWorkTargetRef::Observation(reserved.operation.value.operation_ref.clone()),
        MarketEffectIntentRef::Observation(reserved.operation.value.operation_ref.clone()),
        MarketOperationKind::DispatchObservation, prepared.scope.read_context.scope_ref.clone(),
        None, None, vec![audit.audit_ref.clone()],
    )?);
    let receipt = support.receipt(&reserved, works.iter().map(|w|w.work.work_ref.clone()).collect(), bases);
    let result = ReviewProgressResult { receipt, handoff_ref: review.handoff_ref, state: review.state, decision_binding: review.decision_binding, failure_ref: review.failure_ref, dispatch_outcome_ref: review.dispatch_outcome_ref };
    Ok((MarketResultSurface::Review(result), audit, works))
}.await;
match outcome {
    Err(error) => { uow.rollback(tx).await?; Err(error) },
    Ok((surface, audit, works)) => {
        // [CommandRunner.finish: work+plan -> audit -> complete original result -> operation -> commit]
        let execution = commands.finish(tx, reserved, surface, audit, works).await?;
        support.public_result(execution, |s| match s { MarketResultSurface::Review(v) => Ok(v), _ => Err(support.error(ErrorCode::IntegrityFailure)) })
    },
}
```

#### 输入构造与条件来源

| 符号 / 参数 | 唯一来源 | missing / binding / 保持规则 |
|---|---|---|
| body | RecordGovernanceDecisionRequest完整schema | HLD Qualified输入只是内侧构造，不信client approved/verified |
| source_candidates/requested_scope | 本DTO source_candidate或draft_spec.source_candidate/target.scope_ref、Bind requested_scope；无该字段时empty/None | 正式ScopeResolver.resolve重新裁剪，不从opaqueparse；taxonomyCreate明确requested_scope |
| readonly本体 | 上述load返回完整Versioned或immutablebasis | Missing拒绝；mutablefresh在writeTx重读、CAS和fixedbasis/subject相等 |
| formal qualified变量 | let qualified_governance_contract_ref = governance_port.consumer_contract()?; <br> let formal = governance_port.read_decision(GovernanceReadInput { application_ref: review_row.value.application_ref.clone(), basis: basis.clone(), decision_candidate: Some(body.decision_candidate.clone()), scope: prepared.scope.read_context.clone() }).await?; <br> let decision = GovernanceDecisionBinding::from_governance(formal.binding)?; <br> let matched = ReviewBindingPolicy::new(ReviewBindingRequirements { contract_ref: qualified_governance_contract_ref, require_approved_for_listing: false })?.evaluate(basis, decision.clone(), formal.current)?; <br> support.assert_allowed(matched)?; | fields逐schema full复制；consumer_contract取不到blocked，不自造true |
| bases | currentScope.authority_basis + 当次formal source/material/Gov/receiver/disposition/notice safe refs | 同kind typedtoken通过FlowSupport.basis复制；缺正式proof不形成allow/approval |
| window | reserved.cursor固定upper+validatedbatchlimit | 只durable内部scan，不是Querypage；需要所有页时durablecontinuation，不首page冒全量 |
| result/receipt | above完整familyliteral，IDs/revision取actualstaged save/readback | originalfulltyped result同Tx，replay不再生成/更新 |

#### Tx、状态与副作用inventory

| 项 | 本flow边界 |
|---|---|
| accepted局部变化 | formal MatchedDecision；允许matched rejected也存，不自动Listed，不能matchedPolicy要求approved |
| 同UoW必写 | typed owningfacts + qualification/disposition sidecar（如适用）+ Corecontext + audit + 完整ReviewProgressResult + Operation Completed + 必要work/plan |
| external effect | 无Command直接dispatch；fresh external调用仅formalread/qualification，业务write effect由durableJob |
| projection | 只安排必要typed derivedwork；不命令伪改Fresh；read发现cursor落后degraded，Rebuild正式推进 |
| failure | malformed/notvisible/diffintent/缺ref/不匹配/非法state/CAS→safe错误与全部rollback；commitUnknown key-read正式resolve，不blind freshretry |
| replay | 当前authority/disclosure先核；同key+fingerprint读原完整payload，不业务precheck/ID/Clock/method/save/dispatch |

#### 测试切口与停审

planned record_governance_decision: freshaccepted、samekeyoriginalreplay（副作用0）、changedintentconflict、scopehide、missing/unsafe/candidatewrongkind、每save后故障rollback、CASrace，以及“formal MatchedDecision；允许matched rejected也存，不自动Listed，不能matchedPolicy要求approved”特有状态/binding/竞态。文档小循环检查DTO、完整method/port调用、result与副作用；不造测试run/evidence。下一flow仅在本flow规则已列后展开。


### GetPublicationProgressFlow

#### 入口与目标

`pub async fn get_publication_progress(&self, request: QueryEnvelope<GetPublicationProgressRequest>) -> Result<ReadSurface<ApplicationProgressReadModel>, MarketError>`；planned publication_review/get_publication_progress.rs。目标：MarketStore app/basis/review typedreads + safeview。只允许Step6方法、Step7 typedports/[application callables](03_ddd_step_07_application_callables.md)，不能调用未定义业务builder。

#### 函数级ASCII调用图

```text
[API get_publication_progress QueryEnvelope]
  | call ReadFacade.authorize -> formal current scope/disclosure
  v
[ReadOnly Tx -> exact typed source pair / readonly formalowner read]
  | assemble ApplicationProgressReadModel; never save/reserve/dispatch/refresh
  v
[Ready / Empty / NotVisible / Missing / Degraded]
```

#### Rust风格伪代码

```rust
let source_candidates: Vec<SourceVerificationTarget> = vec![];
let requested_scope: Option<MarketScopeRef> = None;
// [ReadFacade.authorize(QueryEnvelope, typed subjects, source candidates, requested_scope)]
let scope = reads.authorize(&request, vec![MarketAuditSubjectRef::Application(request.body.application_ref.clone())], source_candidates, requested_scope).await?;
let body: GetPublicationProgressRequest = request.body.clone();
// [UnitOfWork.begin(UowMode::ReadOnly)]
let mut tx = uow.begin(UowMode::ReadOnly).await?;
let outcome = async {
let cursor = uow.current_cursor(&mut tx).await?;
let application = support.require(store.load_application(&mut tx, body.application_ref.clone()).await?)?.value;
let review = match application.review_ref.clone() { Some(r) => store.load_review(&mut tx, r).await?, None => None };
let view = ApplicationProgressView::assemble(ApplicationProgressReadInput { application_ref: application.application_ref.clone(), review_ref: application.review_ref.clone(), decision_binding: review.as_ref().and_then(|r|r.value.decision_binding.clone()), status: ReadSurfaceKind::Ready })?;
let value = ApplicationProgressReadModel { view, application_state: application.state, review_state: review.as_ref().map(|r|r.value.state.clone()), basis_ref: application.basis_ref, failure_ref: review.and_then(|r|r.value.failure_ref) };
// [ReadFacade.ready(items, PageInfo, ReadMarker); no writes]
let marker = support.ready_marker(None, cursor);
let surface = reads.ready(vec![value], reads.detail_info(cursor), marker)?;
Ok(surface)
}.await;
// [UnitOfWork.rollback(Tx readonly_tx)]
uow.rollback(tx).await?;
match outcome { Ok(surface) => Ok(surface), Err(error) => reads.map_read_error(error) }
```

#### 读取、构造与失败来源

application/basis/review完整；Submitted有ref缺本体IntegrityFailure；Draft无review正常。所有free symbol是明确typedsource映射而不是builder占位：source_candidates/requested_scope按本Request字段或empty/None；state与readmodel字段逐原值copy；qualified_visible_summary只QualifiedSnapshotMaterial::Source且当前可见，缺可选摘要None不证明合格；typed_notice_read_items/attempt_snapshots按已声明纯函数逐字段copy；formal_saved_observation_binding从AuditStore.get_observation_binding读取；current_gap来自formal错误safe code，不生成owner扫描/支付结果。

ownerqualification分支gate_allows/formal_gate_basis/current_gap从当前正式结果及纯policyevaluate确定，Listed与未撤回/currentapproved/receiver必需。body.field缺失reject；scope不可证明NotVisible（不带ref/count/cursor）；typedsourceMissing只authorizedMissing；Stale/Rebuilding/Unavailable/Unsupported/Failed/Disabled走Degraded，no-query-write/no-cache-refresh。每个earlyreturn/error位于显式async Result作用域，退出后readonly rollback一次；formalprecheck先关闭本地读取事务再调用owner，不二次consume handle。

#### Tx与副作用 / 测试

localWrite/ID/Clock/operationreserve/audit/work/ownerwrite/event均0；只有当前formalread与typedReadonly访问。列表/详情/版本/数量/分页同currentvisibility交集，下一token只当前可见item的boundedCorepage；historychunk不冒称全量。测试：visible/empty/NotVisible/authorizedmissing、错误不echo、wrongscope/filtertoken、state/bodypair缺失、stale/rebuilding/unsupported、locale不改refs/key、Query全部writer计数0。单flow停审：typedDTO/source/model/marker与no-write边界已列，外部资格blocked不变。



### DispatchReviewHandoffFlow

#### 思考、诊断与取舍

application.state == Submitted；basis与application.basis_ref和handoff.basis_ref全等；Publisher.current_authority + SourceOwner.read_current + Material.resolve_materials固定basis；Gov.consumer_contract正式qualified。Failed/ContractBlocked须正式原intent KnownNotCommitted；Pending且无许可为初始派发；WaitingDecision/MatchedDecision只合法no-op。 不允许shared runner掩盖本Job对象动作。采用下列typed原请求链；不扩大ownertruth/事件/支付范围。

#### 入口与目标

`pub async fn dispatch_review_handoff(&self, request: JobEnvelope<DispatchReviewHandoffRequest>) -> Result<ExecutionResult<ReviewJobReport>, MarketError>`。planned application/publication_review/dispatch_review_handoff.rs；协议见[Step8 U2](03_ddd_step_08_part_u2.md)，对象见[Step6 U2](03_ddd_step_06_part_u2.md)，port见[Step7](03_ddd_step_07_typed_ports.md)。完整控制流见[Job执行](03_ddd_step_09_job_execution.md)。

#### 函数级ASCII调用图

```text
[dispatch_review_handoff: typed JobEnvelope]
  | call JobRunner.prepare -> current disclosure / full original replay
  v
[typed local reads -> formal precheck]
  | tx A: reserve / claim / checkpoint / permission
  | commit A; unresolved commit stops before any effect
  v
[ReviewHandoff.record_dispatch / formal Gov dispatch afterpermission]
  | external outside write Tx; no blind retry
  v
[tx B: exact domain methods / versioned save / full report / audit / successors]
  | call JobRunner.finish -> commit -> original typed ReviewJobReport
```

#### 关键伪代码与字段绑定

```rust
// [UnitOfWork.lock_publisher(Tx tx, PublisherRelationRef publisher_ref)]
uow.lock_publisher(&mut tx_a, frozen_basis.publisher_ref.clone()).await?;
let publisher = support.require(store.load_publisher(&mut tx_a, frozen_basis.publisher_ref.clone()).await?)?;
support.assert_binding(publisher.value.state == PublisherRelationState::Bound)?;
// Formal authority matches this exact publisher; lock order publisher -> version.
// [WorkStorePort.append_permission(Tx tx, DispatchPermission permission)]
let permission = support.permission(&reserved, &work.value, None, bases.clone());
work_store.append_permission(&mut tx_a, permission.clone()).await?;
// Tx A also freezes InternalJobRequest::DispatchReviewHandoff(prepared.body.clone()); commit before call.
// [GovernancePort.dispatch_review(ReviewExternalInput input)]
let outcome = governance_port.dispatch_review(input).await;
// Tx B: load_review again and verify exact frozen application/basis, versioned CAS.
// [ReviewHandoff.record_dispatch(ReviewDispatchOutcomeInput outcome)]
handoff.record_dispatch(outcome_input)?;
// [MarketStorePort.save_review(Tx tx, ReviewHandoff value, ExpectedMarketRevision expected)]
store.save_review(&mut tx_b, handoff, ExpectedMarketRevision::Exact(review_revision)).await?;
```

伪代码标注A/B插入点，不是独立实现。所有externalcall均在A的KnownCommitted后、B开始前。 条件分支严格以下表，成功分支代码不能套入负向/Unknown。

| 参数 / 符号 | 精确来源 / 约束 |
|---|---|
| body | DispatchReviewHandoffRequest: handoff_ref:ReviewHandoffRef; work_ref:DeferredWorkRef；无actor/key/trace第二authority |
| internal_request | InternalJobRequest::DispatchReviewHandoff(prepared.body.clone())；A immutablecheckpoint |
| owning rows/revision | MarketStore.load_review(body.handoff_ref) -> load_application(handoff.application_ref) -> load_basis(handoff.basis_ref) -> load_publisher(basis.publisher_ref)；Missing安全错误，scope不证明先NotVisible |
| input / outcome / *_context | ReviewExternalInput { handoff_ref: handoff.handoff_ref, application_ref: handoff.application_ref, basis: frozen_basis, permission: committed_permission } |
| bases / inspection / qualified_* | 当次正式typedport输出精确匹配；local maintenance只local committedfactrefs；缺formalproof为Unknown/Blocked而不是填true/ref |
| subject/target/effectintent | committedwork.plan typedtarget，经FlowSupport.subject_for_target；不能parse opaque。原外部intent不随Joboperation或newfence改变 |
| items/successors/report | 每target JobItemResult完整target/outcome/bases/gap/effectintent/cursor；Job执行§Report逐字段，实际sameB workIDs，不由projection重建 |

#### 事务、错误与状态副作用

| 分支 | 精确行为 |
|---|---|
| 正向/负向/Unknown | 正式Confirmed→WaitingDecision，绝不MatchedDecision/Listed；KnownNotCommitted→Failed；Unknown→CommitUnknown且durable ReconcileReviewHandoff，缺probe则Blocked work。正式consumer缺口且未许可用ReviewHandoff.block→ContractBlocked，无外call。 |
| 本地副作用 | handoff局部进度、安全完整report/audit、原intentreconcile责任；审查决定仍由RecordGovernanceDecision消费。 |
| A失败 / A commit未知 | rollback A；或originalkey/checkpoint/permission只读resolve；未证实A提交不externalcall |
| 外部timeout/ACK / B失败 | 不等NotCommitted；A仍持有恢复责任。B rollback不撤销外效应；原intentprobe，不重新dispatch |
| binding / CAS / fence失败 | BindingMismatch/VersionConflict/FenceMismatch；rollback本B，不丢旧effect；lateformal结果新授权Reconcile承担 |
| ownercontract缺口 | ContractBlocked/Unsupported/Unavailable带safegap；no phantom body/outcome/approval；未许可可block，已许可unknown只probe |
| replay | currentactor/disclosure+samekey+fingerprint→完整原ReviewJobReport；0新ID/claim/gate/effect/scan/work；Reserved不冒充Completed |
| event / ownertruth | 0event/outbox/支付/Archive；不复制资产body，局部Confirmed不approval/evidence/readiness |

#### 测试切口与单flow停审

planned：正式接收但无决定、ACK/超时Unknown、Failed有据同intent再发、未知A commit禁止外call、取消申请与旧结果保存；另覆盖完整report全字段重放、changedintent冲突、current披露收缩、每writepoint rollback与A/Bcommit未知、缺checkpoint/plan、lease过期probe-only、每itemgap保留。这里只设计静态检查，不宣称run。

| 审查项 | 结论 |
|---|---|
| DTO→factory/member→typedport | 明确上述来源；外部exact consumerqualification保持blocked，不凭candidate名称声称owner支持 |
| Tx/副作用/原报告 | A许可/原checkpoint与B完整结果分别原子；必要successor同B；0长SQL跨effect |
| 状态/测试 | 对应14carrier；Step10核对全部statepairs；本flow不新增全局state |
| 范围停审 | 文档内flow已展开，后续编译/集成须实现期真实证据；未执行测试/commit |



### ReconcileReviewHandoffFlow

#### 思考、诊断与取舍

Current披露可读原handoff；以原handoff intent和basis查probe。WaitingDecision允许read_decision；MatchedDecision不重发；原permission必须存在，不以新fence替代externalintent。 不允许shared runner掩盖本Job对象动作。采用下列typed原请求链；不扩大ownertruth/事件/支付范围。

#### 入口与目标

`pub async fn reconcile_review_handoff(&self, request: JobEnvelope<ReconcileReviewHandoffRequest>) -> Result<ExecutionResult<ReviewJobReport>, MarketError>`。planned application/publication_review/reconcile_review_handoff.rs；协议见[Step8 U2](03_ddd_step_08_part_u2.md)，对象见[Step6 U2](03_ddd_step_06_part_u2.md)，port见[Step7](03_ddd_step_07_typed_ports.md)。完整控制流见[Job执行](03_ddd_step_09_job_execution.md)。

#### 函数级ASCII调用图

```text
[reconcile_review_handoff: typed JobEnvelope]
  | call JobRunner.prepare -> current disclosure / full original replay
  v
[typed local reads -> formal original-intent probe]
  | tx A: reserve / claim / checkpoint
  | commit A; unresolved commit stops before any effect
  v
[Gov originalintentprobe + formal decision/currentbinding]
  | external outside write Tx; no blind retry
  v
[tx B: exact domain methods / versioned save / full report / audit / successors]
  | call JobRunner.finish -> commit -> original typed ReviewJobReport
```

#### 关键伪代码与字段绑定

```rust
// [GovernancePort.probe_review(ReviewExternalInput input)]
let probe = governance_port.probe_review(original_input).await?;
// Probe is outside SQL. Optional exact decision is part of the formal probe result.
// If only receipt exists, a separate readonly read_decision may be made outside B with original application/basis.
// Tx B: classified formal result; a proof token is never converted into a receipt ID.
if let Some(outcome) = probe.dispatch_outcome.clone() {
    // [ReviewHandoff.record_dispatch(ReviewDispatchOutcomeInput outcome)]
    handoff.record_dispatch(outcome)?;
}
// None receipt + Confirmed inspection alone keeps CommitUnknown unless complete decision proves binding.
if let Some(formal) = probe.decision {
    let contract_ref = governance_port.consumer_contract()?;
    // [GovernanceDecisionBinding.from_governance(QualifiedDecisionInput input)]
    let binding = GovernanceDecisionBinding::from_governance(formal.binding)?;
    // [ReviewBindingPolicy.new(ReviewBindingRequirements requirements)]
    let review_policy = ReviewBindingPolicy::new(ReviewBindingRequirements { contract_ref, require_approved_for_listing: false })?;
    // [ReviewBindingPolicy.evaluate(PublicationBasis basis, GovernanceDecisionBinding decision, CurrentDecisionInput current)]
    support.assert_allowed(review_policy.evaluate(frozen_basis, binding.clone(), formal.current)?)?;
    // [ReviewHandoff.record_decision(GovernanceDecisionBinding binding)]
    handoff.record_decision(binding)?;
}
store.save_review(&mut tx_b, handoff, ExpectedMarketRevision::Exact(review_revision)).await?;
// Unknown/no exact result: durable original-intent probe or Blocked/waiting, never dispatch.
```

伪代码标注A/B插入点，不是独立实现。本Job不创建第二dispatch许可；claim新fence只probe-only。 条件分支严格以下表，成功分支代码不能套入负向/Unknown。

| 参数 / 符号 | 精确来源 / 约束 |
|---|---|
| body | ReconcileReviewHandoffRequest: handoff_ref:ReviewHandoffRef; work_ref:DeferredWorkRef；无actor/key/trace第二authority |
| internal_request | InternalJobRequest::ReconcileReviewHandoff(prepared.body.clone())；A immutablecheckpoint |
| owning rows/revision | load_review -> load_application/load_basis -> WorkStore.get_permission(original target, checkpoint.fence)；OperationStore.find_checkpoints_by_work；Missing安全错误，scope不证明先NotVisible |
| input / outcome / *_context | ReviewExternalInput四字段取旧checkpoint/本体/原permission；GovernanceReadInput取原application+basis+decision candidate（候选存在时） |
| bases / inspection / qualified_* | 当次正式typedport输出精确匹配；local maintenance只local committedfactrefs；缺formalproof为Unknown/Blocked而不是填true/ref |
| subject/target/effectintent | committedwork.plan typedtarget，经FlowSupport.subject_for_target；不能parse opaque。原外部intent不随Joboperation或newfence改变 |
| items/successors/report | 每target JobItemResult完整target/outcome/bases/gap/effectintent/cursor；Job执行§Report逐字段，实际sameB workIDs，不由projection重建 |

#### 事务、错误与状态副作用

| 分支 | 精确行为 |
|---|---|
| 正向/负向/Unknown | formalprobe Confirmed须正式dispatch结果ref；inspection只有basis没有outcome_ref时不能造ref/推进WaitingDecision，保留unknown等待正式read_decision。有完整决定可CommitUnknown→MatchedDecision；只审查绑定，不approval。Unknown保持unknown；NotCommitted→Failed，安全再发由新明确dispatch Job完成。 |
| 本地副作用 | 原effect收敛、正式决定binding、完整reconcile报告；有完整原报告依据才finish_original，否则旧Reserved等待，不dispatch。 |
| A失败 / A commit未知 | rollback A；或originalkey/checkpoint/permission只读resolve；未证实A提交不externalcall |
| 外部timeout/ACK / B失败 | 不等NotCommitted；A仍持有恢复责任。B rollback不撤销外效应；原intentprobe，不重新dispatch |
| binding / CAS / fence失败 | BindingMismatch/VersionConflict/FenceMismatch；rollback本B，不丢旧effect；lateformal结果新授权Reconcile承担 |
| ownercontract缺口 | ContractBlocked/Unsupported/Unavailable带safegap；no phantom body/outcome/approval；未许可可block，已许可unknown只probe |
| replay | currentactor/disclosure+samekey+fingerprint→完整原ReviewJobReport；0新ID/claim/gate/effect/scan/work；Reserved不冒充Completed |
| event / ownertruth | 0event/outbox/支付/Archive；不复制资产body，局部Confirmed不approval/evidence/readiness |

#### 测试切口与单flow停审

planned：无probe、只有basis缺outcome ref、rejected决定可MatchedDecision不Listed、错basis/替代决定、旧checkpoint缺字段；另覆盖完整report全字段重放、changedintent冲突、current披露收缩、每writepoint rollback与A/Bcommit未知、缺checkpoint/plan、lease过期probe-only、每itemgap保留。这里只设计静态检查，不宣称run。

| 审查项 | 结论 |
|---|---|
| DTO→factory/member→typedport | 明确上述来源；外部exact consumerqualification保持blocked，不凭candidate名称声称owner支持 |
| Tx/副作用/原报告 | A许可/原checkpoint与B完整结果分别原子；必要successor同B；0长SQL跨effect |
| 状态/测试 | 对应14carrier；Step10核对全部statepairs；本flow不新增全局state |
| 范围停审 | 文档内flow已展开，后续编译/集成须实现期真实证据；未执行测试/commit |
