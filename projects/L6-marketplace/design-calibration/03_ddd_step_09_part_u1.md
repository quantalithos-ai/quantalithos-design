# Step9 U1 来源/发布责任独立flow小循环

## 思考、诊断与取舍

本族从Step8完整typed请求逐入口推导读取/构造/guard/Tx/结果。先current披露与fulloriginalreplay，再fresh业务；SQLtx不跨externalowner调用。采用原typedcheckpoint/permission/probe/完整manifest，拒绝body复制、scan/ACK审批、取消覆盖lateeffect和不可见count泄漏。伪代码只设计，不宣称compile/run。

## 批次表

| flow | 协议 | 对象能力 | Tx / effect |
|---|---|---|---|
| BindPublisherRelationFlow | BindPublisherRelationRequest | PublisherRelation.bind / PublisherAuthorityPort.resolve_publisher | 单accepted UoW |
| ReleasePublisherRelationFlow | ReleasePublisherRelationRequest | PublisherRelation.release + SourceVerification.invalidate / formal exactoperation | 单accepted UoW |
| VerifyPublicationSourceFlow | VerifyPublicationSourceRequest | SourceBinding/MaterialReference factory + SourceGatePolicy.evaluate + SourceVerification.start/record / SourceOwner/Material/Publisher ports | 单accepted UoW |
| GetSourceQualificationFlow | GetSourceQualificationRequest | MarketStore.load_verification/load_qualification_outcome + typed snapshot | readonly，无写 |

### BindPublisherRelationFlow

#### 入口与目标

`pub async fn bind_publisher_relation(&self, request: CommandEnvelope<BindPublisherRelationRequest>) -> Result<ExecutionResult<PublisherRelationResult>, MarketError>`；planned source_responsibility/bind_publisher_relation.rs。目标：PublisherRelation.bind / PublisherAuthorityPort.resolve_publisher。只允许Step6方法、Step7 typedports/[application callables](03_ddd_step_07_application_callables.md)，不能调用未定义业务builder。

#### 函数级ASCII调用图

```text
[API bind_publisher_relation typedRequest]
  | call CommandRunner.prepare(current scope -> fullresult replay)
  v
[fresh readonly local facts -> external formal prechecks; no write Tx]
  | tx begin ReadWrite -> reserve under operation-key lock
  v
[PublisherRelation factory/member + typed guard]
  | save Bound责任关联；无资格/approval，审计与原fullresult
  v
[work/plan + audit + StoredResult + Operation.complete]
  | commit -> KnownCommitted / Unknown-key-resolution
  v
[original typed PublisherRelationResult]
```

#### Rust风格伪代码

```rust
let source_candidates: Vec<SourceVerificationTarget> = vec![];
let requested_scope: Option<MarketScopeRef> = request.body.requested_scope.clone();
// [CommandRunner.prepare(CommandEnvelope request, MarketOperationKind kind, typed subjects, candidates, requested_scope)]
let subjects = vec![];
let start = commands.prepare(request, MarketOperationKind::BindPublisherRelation, subjects, source_candidates, requested_scope).await?;
let prepared = match start {
    CommandStart::Fresh(p) => p,
    CommandStart::Replayed(stored) => return match stored.safe_result { MarketResultSurface::Publisher(value) => Ok(ExecutionResult { value, disposition: ReplayDisposition::OriginalReplayed }), _ => Err(support.error(ErrorCode::IntegrityFailure)) },
};
let body: BindPublisherRelationRequest = prepared.body.clone();
// No fresh local business reads are needed; no extra readonly transaction is opened.

// [formal owner ports / FreshGate.publication or admission; outside SQL tx]
let resolved = publisher_port.resolve_publisher(PublisherResolveRequest { principal_candidate: body.principal_candidate.clone(), scope: prepared.scope.read_context.clone() }).await?;
// [UnitOfWork.begin(UowMode::ReadWrite)]
let mut tx = uow.begin(UowMode::ReadWrite).await?;
// [CommandRunner.reserve(tx, prepared): lock key -> replay race / fresh ids]
let reserved = match commands.reserve(&mut tx, &prepared).await {
    Ok(ReservationOutcome::Fresh(r)) => r,
    Ok(ReservationOutcome::Replayed(stored)) => {
        uow.rollback(tx).await?;
        return match stored.safe_result {
            MarketResultSurface::Publisher(value) => Ok(ExecutionResult { value, disposition: ReplayDisposition::OriginalReplayed }),
            _ => Err(support.error(ErrorCode::IntegrityFailure)),
        };
    },
    Err(error) => { uow.rollback(tx).await?; return Err(error); },
};
let outcome = async {
    let mut works: Vec<PlannedResponsibility> = vec![];
    let mut bases: SafeBasisReferenceSet = prepared.scope.authority_basis.clone();
    bases.push(support.basis(SafeBasisKind::Publisher, resolved.authority_ref.token.clone())?);
    let window = support.bounded_window(reserved.cursor, None)?;
    // [PublisherRelation factory/member; typed owner input construction]
    let relation = PublisherRelation::bind(QualifiedPublisherInput { relation_ref: ids.new_publisher_relation_ref(), principal_ref: resolved.principal_ref, authority_ref: resolved.authority_ref, scope_ref: resolved.scope_ref })?;
    let saved = store.save_publisher(&mut tx, relation.clone(), ExpectedMarketRevision::MustNotExist).await?;
    let subject = MarketAuditSubjectRef::Publisher(relation.relation_ref.clone());
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
    let result = PublisherRelationResult { receipt, relation_ref: relation.relation_ref, state: relation.state, principal_ref: relation.principal_ref, authority_ref: relation.authority_ref, scope_ref: relation.scope_ref };
    Ok((MarketResultSurface::Publisher(result), audit, works))
}.await;
match outcome {
    Err(error) => { uow.rollback(tx).await?; Err(error) },
    Ok((surface, audit, works)) => {
        // [CommandRunner.finish: work+plan -> audit -> complete original result -> operation -> commit]
        let execution = commands.finish(tx, reserved, surface, audit, works).await?;
        support.public_result(execution, |s| match s { MarketResultSurface::Publisher(v) => Ok(v), _ => Err(support.error(ErrorCode::IntegrityFailure)) })
    },
}
```

#### 输入构造与条件来源

| 符号 / 参数 | 唯一来源 | missing / binding / 保持规则 |
|---|---|---|
| body | BindPublisherRelationRequest完整schema | HLD Qualified输入只是内侧构造，不信client approved/verified |
| source_candidates/requested_scope | 本DTO source_candidate或draft_spec.source_candidate/target.scope_ref、Bind requested_scope；无该字段时empty/None | 正式ScopeResolver.resolve重新裁剪，不从opaqueparse；taxonomyCreate明确requested_scope |
| readonly本体 | 上述load返回完整Versioned或immutablebasis | Missing拒绝；mutablefresh在writeTx重读、CAS和fixedbasis/subject相等 |
| formal qualified变量 | let resolved = publisher_port.resolve_publisher(PublisherResolveRequest { principal_candidate: body.principal_candidate.clone(), scope: prepared.scope.read_context.clone() }).await?; | fields逐schema full复制；consumer_contract取不到blocked，不自造true |
| bases | currentScope.authority_basis + 当次formal source/material/Gov/receiver/disposition/notice safe refs | 同kind typedtoken通过FlowSupport.basis复制；缺正式proof不形成allow/approval |
| window | reserved.cursor固定upper+validatedbatchlimit | 只durable内部scan，不是Querypage；需要所有页时durablecontinuation，不首page冒全量 |
| result/receipt | above完整familyliteral，IDs/revision取actualstaged save/readback | originalfulltyped result同Tx，replay不再生成/更新 |

#### Tx、状态与副作用inventory

| 项 | 本flow边界 |
|---|---|
| accepted局部变化 | Bound责任关联；无资格/approval，审计与原fullresult |
| 同UoW必写 | typed owningfacts + qualification/disposition sidecar（如适用）+ Corecontext + audit + 完整PublisherRelationResult + Operation Completed + 必要work/plan |
| external effect | 无Command直接dispatch；fresh external调用仅formalread/qualification，业务write effect由durableJob |
| projection | 只安排必要typed derivedwork；不命令伪改Fresh；read发现cursor落后degraded，Rebuild正式推进 |
| failure | malformed/notvisible/diffintent/缺ref/不匹配/非法state/CAS→safe错误与全部rollback；commitUnknown key-read正式resolve，不blind freshretry |
| replay | 当前authority/disclosure先核；同key+fingerprint读原完整payload，不业务precheck/ID/Clock/method/save/dispatch |

#### 测试切口与停审

planned bind_publisher_relation: freshaccepted、samekeyoriginalreplay（副作用0）、changedintentconflict、scopehide、missing/unsafe/candidatewrongkind、每save后故障rollback、CASrace，以及“Bound责任关联；无资格/approval，审计与原fullresult”特有状态/binding/竞态。文档小循环检查DTO、完整method/port调用、result与副作用；不造测试run/evidence。下一flow仅在本flow规则已列后展开。


### ReleasePublisherRelationFlow

#### 入口与目标

`pub async fn release_publisher_relation(&self, request: CommandEnvelope<ReleasePublisherRelationRequest>) -> Result<ExecutionResult<PublisherRelationResult>, MarketError>`；planned source_responsibility/release_publisher_relation.rs。目标：PublisherRelation.release + SourceVerification.invalidate / formal exactoperation。只允许Step6方法、Step7 typedports/[application callables](03_ddd_step_07_application_callables.md)，不能调用未定义业务builder。

#### 函数级ASCII调用图

```text
[API release_publisher_relation typedRequest]
  | call CommandRunner.prepare(current scope -> fullresult replay)
  v
[fresh readonly local facts -> external formal prechecks; no write Tx]
  | tx begin ReadWrite -> reserve under operation-key lock
  v
[PublisherRelation factory/member + typed guard]
  | save Released立即禁新gate；有限typed关联verification Invalidated；未列关联仅旧历史核验
  v
[work/plan + audit + StoredResult + Operation.complete]
  | commit -> KnownCommitted / Unknown-key-resolution
  v
[original typed PublisherRelationResult]
```

#### Rust风格伪代码

```rust
let source_candidates: Vec<SourceVerificationTarget> = vec![];
let requested_scope: Option<MarketScopeRef> = None;
// [CommandRunner.prepare(CommandEnvelope request, MarketOperationKind kind, typed subjects, candidates, requested_scope)]
let subjects = vec![MarketAuditSubjectRef::Publisher(request.body.relation_ref.clone())];
let start = commands.prepare(request, MarketOperationKind::ReleasePublisherRelation, subjects, source_candidates, requested_scope).await?;
let prepared = match start {
    CommandStart::Fresh(p) => p,
    CommandStart::Replayed(stored) => return match stored.safe_result { MarketResultSurface::Publisher(value) => Ok(ExecutionResult { value, disposition: ReplayDisposition::OriginalReplayed }), _ => Err(support.error(ErrorCode::IntegrityFailure)) },
};
let body: ReleasePublisherRelationRequest = prepared.body.clone();
// [UnitOfWork.begin(UowMode::ReadOnly)]
let mut reads = uow.begin(UowMode::ReadOnly).await?;
let local_read = async {
let publisher_row = support.require(store.load_publisher(&mut reads, body.relation_ref.clone()).await?)?;
Ok((publisher_row,))
}.await;
// [UnitOfWork.rollback(readonly tx)]
uow.rollback(reads).await?;
let (publisher_row,) = local_read?;

// [formal owner ports / FreshGate.publication or admission; outside SQL tx]
let authority = publisher_port.authorize_operation(MarketOperationKind::ReleasePublisherRelation, MarketAuditSubjectRef::Publisher(body.relation_ref.clone()), prepared.scope.read_context.clone()).await?;
// [UnitOfWork.begin(UowMode::ReadWrite)]
let mut tx = uow.begin(UowMode::ReadWrite).await?;
// [CommandRunner.reserve(tx, prepared): lock key -> replay race / fresh ids]
let reserved = match commands.reserve(&mut tx, &prepared).await {
    Ok(ReservationOutcome::Fresh(r)) => r,
    Ok(ReservationOutcome::Replayed(stored)) => {
        uow.rollback(tx).await?;
        return match stored.safe_result {
            MarketResultSurface::Publisher(value) => Ok(ExecutionResult { value, disposition: ReplayDisposition::OriginalReplayed }),
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
    // [UnitOfWork.lock_publisher(Tx tx, PublisherRelationRef publisher_ref)]
    uow.lock_publisher(&mut tx, body.relation_ref.clone()).await?;
    let current_publisher = support.require(store.load_publisher(&mut tx, body.relation_ref.clone()).await?)?;
    support.assert_binding(current_publisher.value.state == PublisherRelationState::Bound)?;
    // Current formal authority must match this exact reloaded relation; local Release uses same lock.
    // [PublisherRelation factory/member; typed owner input construction]
    let loaded = support.require(store.load_publisher(&mut tx, body.relation_ref.clone()).await?)?;
    support.expect_revision(loaded.revision, body.expected_revision)?;
    let mut relation = loaded.value;
    relation.release(AuthorityDispositionInput { authority_ref: support.require(authority.disposition_ref)?, reason_ref: body.reason_ref.clone(), verification_refs: body.verification_refs.clone() })?;
    store.save_publisher(&mut tx, relation.clone(), ExpectedMarketRevision::Exact(loaded.revision)).await?;
    for reference in &body.verification_refs {
        let v = support.require(store.load_verification(&mut tx, reference.clone()).await?)?;
        support.assert_binding(v.value.publisher_ref == relation.relation_ref && v.value.source_candidate.scope_ref == relation.scope_ref)?;
        // 必须从原verification与publisher relation的typed保存关联核验，不能只同scope。
        let outcome_ref = ids.new_qualification_outcome_ref();
        let mut value = v.value;
        value.invalidate(SourceInvalidationInput { outcome_ref: outcome_ref.clone(), reason_ref: body.reason_ref.clone() })?;
        store.append_qualification_outcome(&mut tx, QualificationOutcomeRecord { outcome_ref, verification_ref: value.verification_ref.clone(), failure_ref: Some(SafeFailureRef { code: ErrorCode::CurrentGateDenied, reason_ref: Some(body.reason_ref.clone()) }), basis_refs: bases.clone() }).await?;
        store.save_verification(&mut tx, value, ExpectedMarketRevision::Exact(v.revision)).await?;
    }
    let subject = MarketAuditSubjectRef::Publisher(relation.relation_ref.clone());
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
    let result = PublisherRelationResult { receipt, relation_ref: relation.relation_ref, state: relation.state, principal_ref: relation.principal_ref, authority_ref: relation.authority_ref, scope_ref: relation.scope_ref };
    Ok((MarketResultSurface::Publisher(result), audit, works))
}.await;
match outcome {
    Err(error) => { uow.rollback(tx).await?; Err(error) },
    Ok((surface, audit, works)) => {
        // [CommandRunner.finish: work+plan -> audit -> complete original result -> operation -> commit]
        let execution = commands.finish(tx, reserved, surface, audit, works).await?;
        support.public_result(execution, |s| match s { MarketResultSurface::Publisher(v) => Ok(v), _ => Err(support.error(ErrorCode::IntegrityFailure)) })
    },
}
```

#### 输入构造与条件来源

| 符号 / 参数 | 唯一来源 | missing / binding / 保持规则 |
|---|---|---|
| body | ReleasePublisherRelationRequest完整schema | HLD Qualified输入只是内侧构造，不信client approved/verified |
| source_candidates/requested_scope | 本DTO source_candidate或draft_spec.source_candidate/target.scope_ref、Bind requested_scope；无该字段时empty/None | 正式ScopeResolver.resolve重新裁剪，不从opaqueparse；taxonomyCreate明确requested_scope |
| readonly本体 | 上述load返回完整Versioned或immutablebasis | Missing拒绝；mutablefresh在writeTx重读、CAS和fixedbasis/subject相等 |
| formal qualified变量 | let authority = publisher_port.authorize_operation(MarketOperationKind::ReleasePublisherRelation, MarketAuditSubjectRef::Publisher(body.relation_ref.clone()), prepared.scope.read_context.clone()).await?; | fields逐schema full复制；consumer_contract取不到blocked，不自造true |
| bases | currentScope.authority_basis + 当次formal source/material/Gov/receiver/disposition/notice safe refs | 同kind typedtoken通过FlowSupport.basis复制；缺正式proof不形成allow/approval |
| window | reserved.cursor固定upper+validatedbatchlimit | 只durable内部scan，不是Querypage；需要所有页时durablecontinuation，不首page冒全量 |
| result/receipt | above完整familyliteral，IDs/revision取actualstaged save/readback | originalfulltyped result同Tx，replay不再生成/更新 |

#### Tx、状态与副作用inventory

| 项 | 本flow边界 |
|---|---|
| accepted局部变化 | Released立即禁新gate；有限typed关联verification Invalidated；未列关联仅旧历史核验 |
| 同UoW必写 | typed owningfacts + qualification/disposition sidecar（如适用）+ Corecontext + audit + 完整PublisherRelationResult + Operation Completed + 必要work/plan |
| external effect | 无Command直接dispatch；fresh external调用仅formalread/qualification，业务write effect由durableJob |
| projection | 只安排必要typed derivedwork；不命令伪改Fresh；read发现cursor落后degraded，Rebuild正式推进 |
| failure | malformed/notvisible/diffintent/缺ref/不匹配/非法state/CAS→safe错误与全部rollback；commitUnknown key-read正式resolve，不blind freshretry |
| replay | 当前authority/disclosure先核；同key+fingerprint读原完整payload，不业务precheck/ID/Clock/method/save/dispatch |

#### 测试切口与停审

planned release_publisher_relation: freshaccepted、samekeyoriginalreplay（副作用0）、changedintentconflict、scopehide、missing/unsafe/candidatewrongkind、每save后故障rollback、CASrace，以及“Released立即禁新gate；有限typed关联verification Invalidated；未列关联仅旧历史核验”特有状态/binding/竞态。文档小循环检查DTO、完整method/port调用、result与副作用；不造测试run/evidence。下一flow仅在本flow规则已列后展开。


### VerifyPublicationSourceFlow

#### 入口与目标

`pub async fn verify_publication_source(&self, request: CommandEnvelope<VerifyPublicationSourceRequest>) -> Result<ExecutionResult<SourceQualificationResult>, MarketError>`；planned source_responsibility/verify_publication_source.rs。目标：SourceBinding/MaterialReference factory + SourceGatePolicy.evaluate + SourceVerification.start/record / SourceOwner/Material/Publisher ports。只允许Step6方法、Step7 typedports/[application callables](03_ddd_step_07_application_callables.md)，不能调用未定义业务builder。

#### 函数级ASCII调用图

```text
[API verify_publication_source typedRequest]
  | call CommandRunner.prepare(current scope -> fullresult replay)
  v
[fresh readonly local facts -> external formal prechecks; no write Tx]
  | tx begin ReadWrite -> reserve under operation-key lock
  v
[SourceVerification factory/member + typed guard]
  | save Qualified或Blocked+真实gap sidecar；合格Source safe snapshot，scan/signature不Govapproval
  v
[work/plan + audit + StoredResult + Operation.complete]
  | commit -> KnownCommitted / Unknown-key-resolution
  v
[original typed SourceQualificationResult]
```

#### Rust风格伪代码

```rust
let source_candidates: Vec<SourceVerificationTarget> = vec![request.body.source_candidate.clone()];
let requested_scope: Option<MarketScopeRef> = Some(request.body.source_candidate.scope_ref.clone());
// [CommandRunner.prepare(CommandEnvelope request, MarketOperationKind kind, typed subjects, candidates, requested_scope)]
let subjects = vec![MarketAuditSubjectRef::Publisher(request.body.publisher_ref.clone())];
let start = commands.prepare(request, MarketOperationKind::VerifyPublicationSource, subjects, source_candidates, requested_scope).await?;
let prepared = match start {
    CommandStart::Fresh(p) => p,
    CommandStart::Replayed(stored) => return match stored.safe_result { MarketResultSurface::Source(value) => Ok(ExecutionResult { value, disposition: ReplayDisposition::OriginalReplayed }), _ => Err(support.error(ErrorCode::IntegrityFailure)) },
};
let body: VerifyPublicationSourceRequest = prepared.body.clone();
// [UnitOfWork.begin(UowMode::ReadOnly)]
let mut reads = uow.begin(UowMode::ReadOnly).await?;
let local_read = async {
let publisher_row = support.require(store.load_publisher(&mut reads, body.publisher_ref.clone()).await?)?;
Ok((publisher_row,))
}.await;
// [UnitOfWork.rollback(readonly tx)]
uow.rollback(reads).await?;
let (publisher_row,) = local_read?;

// [formal owner ports / FreshGate.publication or admission; outside SQL tx]
let precheck = gates.publication(publisher_row.value.clone(), DraftPublicationSpec { source_candidate: body.source_candidate.clone(), publisher_ref: body.publisher_ref.clone(), material_candidates: body.material_candidates.clone(), scope_ref: prepared.scope.read_context.scope_ref.clone() }, prepared.scope.read_context.clone()).await;
// [UnitOfWork.begin(UowMode::ReadWrite)]
let mut tx = uow.begin(UowMode::ReadWrite).await?;
// [CommandRunner.reserve(tx, prepared): lock key -> replay race / fresh ids]
let reserved = match commands.reserve(&mut tx, &prepared).await {
    Ok(ReservationOutcome::Fresh(r)) => r,
    Ok(ReservationOutcome::Replayed(stored)) => {
        uow.rollback(tx).await?;
        return match stored.safe_result {
            MarketResultSurface::Source(value) => Ok(ExecutionResult { value, disposition: ReplayDisposition::OriginalReplayed }),
            _ => Err(support.error(ErrorCode::IntegrityFailure)),
        };
    },
    Err(error) => { uow.rollback(tx).await?; return Err(error); },
};
let outcome = async {
    let mut works: Vec<PlannedResponsibility> = vec![];
    let mut bases: SafeBasisReferenceSet = prepared.scope.authority_basis.clone();
    let window = support.bounded_window(reserved.cursor, None)?;
    // [UnitOfWork.lock_publisher(Tx tx, PublisherRelationRef publisher_ref)]
    uow.lock_publisher(&mut tx, body.publisher_ref.clone()).await?;
    let current_publisher = support.require(store.load_publisher(&mut tx, body.publisher_ref.clone()).await?)?;
    support.assert_binding(current_publisher.value.state == PublisherRelationState::Bound)?;
    // Current formal authority must match this exact reloaded relation; local Release uses same lock.
    // [SourceVerification factory/member; typed owner input construction]
    let mut verification = SourceVerification::start(SourceVerificationInput { verification_ref: ids.new_source_verification_ref(), publisher_ref: body.publisher_ref.clone(), source_candidate: body.source_candidate.clone() })?;
    let outcome_ref = ids.new_qualification_outcome_ref();
    let mut gap = None;
    match precheck {
        Ok(q) => {
            bases.push(support.basis(SafeBasisKind::Publisher, q.authority.authority_ref.token.clone())?);
            bases.push(support.basis(SafeBasisKind::Source, q.source.eligibility_ref.token.clone())?);
            for material in &q.materials { bases.push(support.basis(SafeBasisKind::Material, material.material_ref.token.clone())?); }
            verification.record(QualificationOutcomeInput::Qualified(QualifiedQualificationPayload { binding: q.source.clone(), materials: q.materials, outcome_ref: outcome_ref.clone() }))?;
            let snapshot = QualifiedReferenceSnapshot::capture(QualifiedSnapshotInput { snapshot_ref: ids.new_qualified_reference_snapshot_ref(), source_ref: q.source.owner_ref.clone(), source_version: q.source.owner_version.clone(), safe_material: QualifiedSnapshotMaterial::Source(q.summary), validity_ref: q.validity_ref })?;
            // snapshot unique(source,scope)：已有则same CAS refresh，不隐式覆盖错owner。
            let old = snapshots.find_snapshot(&mut tx, q.source.owner_ref, prepared.scope.read_context.scope_ref.clone()).await?;
            match old {
                Some(existing) => { let mut value = existing.value; value.refresh(QualifiedSnapshotInput { snapshot_ref: value.snapshot_ref.clone(), source_ref: snapshot.source_ref, source_version: snapshot.source_version, safe_material: snapshot.safe_material, validity_ref: snapshot.validity_ref })?; snapshots.save_snapshot(&mut tx, value, ExpectedMarketRevision::Exact(existing.revision)).await?; },
                None => { snapshots.save_snapshot(&mut tx, snapshot, ExpectedMarketRevision::MustNotExist).await?; },
            }
        },
        Err(failure) => { gap = Some(SafeFailureRef { code: failure.code.clone(), reason_ref: failure.reason_ref.clone() }); verification.record(QualificationOutcomeInput::Blocked(QualificationFailurePayload { outcome_ref: outcome_ref.clone(), failure_ref: SafeFailureRef { code: failure.code, reason_ref: failure.reason_ref } }))?; },
    }
    store.append_qualification_outcome(&mut tx, QualificationOutcomeRecord { outcome_ref, verification_ref: verification.verification_ref.clone(), failure_ref: gap.clone(), basis_refs: bases.clone() }).await?;
    store.save_verification(&mut tx, verification.clone(), ExpectedMarketRevision::MustNotExist).await?;
    let subject = MarketAuditSubjectRef::Verification(verification.verification_ref.clone());
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
    let result = SourceQualificationResult { receipt, verification_ref: verification.verification_ref, state: verification.state, source_binding: verification.source_binding, material_refs: verification.material_refs, outcome_ref: verification.outcome_ref };
    Ok((MarketResultSurface::Source(result), audit, works))
}.await;
match outcome {
    Err(error) => { uow.rollback(tx).await?; Err(error) },
    Ok((surface, audit, works)) => {
        // [CommandRunner.finish: work+plan -> audit -> complete original result -> operation -> commit]
        let execution = commands.finish(tx, reserved, surface, audit, works).await?;
        support.public_result(execution, |s| match s { MarketResultSurface::Source(v) => Ok(v), _ => Err(support.error(ErrorCode::IntegrityFailure)) })
    },
}
```

#### 输入构造与条件来源

| 符号 / 参数 | 唯一来源 | missing / binding / 保持规则 |
|---|---|---|
| body | VerifyPublicationSourceRequest完整schema | HLD Qualified输入只是内侧构造，不信client approved/verified |
| source_candidates/requested_scope | 本DTO source_candidate或draft_spec.source_candidate/target.scope_ref、Bind requested_scope；无该字段时empty/None | 正式ScopeResolver.resolve重新裁剪，不从opaqueparse；taxonomyCreate明确requested_scope |
| readonly本体 | 上述load返回完整Versioned或immutablebasis | Missing拒绝；mutablefresh在writeTx重读、CAS和fixedbasis/subject相等 |
| formal qualified变量 | let precheck = gates.publication(publisher_row.value.clone(), DraftPublicationSpec { source_candidate: body.source_candidate.clone(), publisher_ref: body.publisher_ref.clone(), material_candidates: body.material_candidates.clone(), scope_ref: prepared.scope.read_context.scope_ref.clone() }, prepared.scope.read_context.clone()).await; | fields逐schema full复制；consumer_contract取不到blocked，不自造true |
| bases | currentScope.authority_basis + 当次formal source/material/Gov/receiver/disposition/notice safe refs | 同kind typedtoken通过FlowSupport.basis复制；缺正式proof不形成allow/approval |
| window | reserved.cursor固定upper+validatedbatchlimit | 只durable内部scan，不是Querypage；需要所有页时durablecontinuation，不首page冒全量 |
| result/receipt | above完整familyliteral，IDs/revision取actualstaged save/readback | originalfulltyped result同Tx，replay不再生成/更新 |

#### Tx、状态与副作用inventory

| 项 | 本flow边界 |
|---|---|
| accepted局部变化 | Qualified或Blocked+真实gap sidecar；合格Source safe snapshot，scan/signature不Govapproval |
| 同UoW必写 | typed owningfacts + qualification/disposition sidecar（如适用）+ Corecontext + audit + 完整SourceQualificationResult + Operation Completed + 必要work/plan |
| external effect | 无Command直接dispatch；fresh external调用仅formalread/qualification，业务write effect由durableJob |
| projection | 只安排必要typed derivedwork；不命令伪改Fresh；read发现cursor落后degraded，Rebuild正式推进 |
| failure | malformed/notvisible/diffintent/缺ref/不匹配/非法state/CAS→safe错误与全部rollback；commitUnknown key-read正式resolve，不blind freshretry |
| replay | 当前authority/disclosure先核；同key+fingerprint读原完整payload，不业务precheck/ID/Clock/method/save/dispatch |

#### 测试切口与停审

planned verify_publication_source: freshaccepted、samekeyoriginalreplay（副作用0）、changedintentconflict、scopehide、missing/unsafe/candidatewrongkind、每save后故障rollback、CASrace，以及“Qualified或Blocked+真实gap sidecar；合格Source safe snapshot，scan/signature不Govapproval”特有状态/binding/竞态。文档小循环检查DTO、完整method/port调用、result与副作用；不造测试run/evidence。下一flow仅在本flow规则已列后展开。


### GetSourceQualificationFlow

#### 入口与目标

`pub async fn get_source_qualification(&self, request: QueryEnvelope<GetSourceQualificationRequest>) -> Result<ReadSurface<SourceQualificationReadModel>, MarketError>`；planned source_responsibility/get_source_qualification.rs。目标：MarketStore.load_verification/load_qualification_outcome + typed snapshot。只允许Step6方法、Step7 typedports/[application callables](03_ddd_step_07_application_callables.md)，不能调用未定义业务builder。

#### 函数级ASCII调用图

```text
[API get_source_qualification QueryEnvelope]
  | call ReadFacade.authorize -> formal current scope/disclosure
  v
[ReadOnly Tx -> exact typed source pair / readonly formalowner read]
  | assemble SourceQualificationReadModel; never save/reserve/dispatch/refresh
  v
[Ready / Empty / NotVisible / Missing / Degraded]
```

#### Rust风格伪代码

```rust
let source_candidates: Vec<SourceVerificationTarget> = vec![];
let requested_scope: Option<MarketScopeRef> = None;
// [ReadFacade.authorize(QueryEnvelope, typed subjects, source candidates, requested_scope)]
let scope = reads.authorize(&request, vec![MarketAuditSubjectRef::Verification(request.body.verification_ref.clone())], source_candidates, requested_scope).await?;
let body: GetSourceQualificationRequest = request.body.clone();
// [UnitOfWork.begin(UowMode::ReadOnly)]
let mut tx = uow.begin(UowMode::ReadOnly).await?;
let outcome = async {
let cursor = uow.current_cursor(&mut tx).await?;
let verification = support.require(store.load_verification(&mut tx, body.verification_ref.clone()).await?)?.value;
let outcome = match verification.outcome_ref.clone() { Some(r) => store.load_qualification_outcome(&mut tx, r).await?, None => None };
let snapshot = match verification.source_binding.clone() { Some(b) => snapshots.find_snapshot(&mut tx, b.owner_ref, scope.scope_ref.clone()).await?, None => None };
let safe_summary = match snapshot { Some(v) if v.value.state == ReferenceSnapshotState::Qualified => match v.value.safe_material { QualifiedSnapshotMaterial::Source(s) => Some(s), _ => return Err(support.error(ErrorCode::IntegrityFailure)) }, _ => None };
let view = SourceQualificationView::assemble(SourceQualificationReadInput { verification_ref: verification.verification_ref.clone(), safe_summary, read_context: scope.clone(), status: ReadSurfaceKind::Ready })?;
let value = SourceQualificationReadModel { view, state: verification.state, source_binding: verification.source_binding, material_refs: verification.material_refs, outcome };
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

verification+完整qualification outcome+qualified source snapshotpair；Blocked summary=None。所有free symbol是明确typedsource映射而不是builder占位：source_candidates/requested_scope按本Request字段或empty/None；state与readmodel字段逐原值copy；qualified_visible_summary只QualifiedSnapshotMaterial::Source且当前可见，缺可选摘要None不证明合格；typed_notice_read_items/attempt_snapshots按已声明纯函数逐字段copy；formal_saved_observation_binding从AuditStore.get_observation_binding读取；current_gap来自formal错误safe code，不生成owner扫描/支付结果。

ownerqualification分支gate_allows/formal_gate_basis/current_gap从当前正式结果及纯policyevaluate确定，Listed与未撤回/currentapproved/receiver必需。body.field缺失reject；scope不可证明NotVisible（不带ref/count/cursor）；typedsourceMissing只authorizedMissing；Stale/Rebuilding/Unavailable/Unsupported/Failed/Disabled走Degraded，no-query-write/no-cache-refresh。每个earlyreturn/error位于显式async Result作用域，退出后readonly rollback一次；formalprecheck先关闭本地读取事务再调用owner，不二次consume handle。

#### Tx与副作用 / 测试

localWrite/ID/Clock/operationreserve/audit/work/ownerwrite/event均0；只有当前formalread与typedReadonly访问。列表/详情/版本/数量/分页同currentvisibility交集，下一token只当前可见item的boundedCorepage；historychunk不冒称全量。测试：visible/empty/NotVisible/authorizedmissing、错误不echo、wrongscope/filtertoken、state/bodypair缺失、stale/rebuilding/unsupported、locale不改refs/key、Query全部writer计数0。单flow停审：typedDTO/source/model/marker与no-write边界已列，外部资格blocked不变。
