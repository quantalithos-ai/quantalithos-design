# Step9 U4 受控分发独立flow小循环

## 思考、诊断与取舍

本族从Step8完整typed请求逐入口推导读取/构造/guard/Tx/结果。先current披露与fulloriginalreplay，再fresh业务；SQLtx不跨externalowner调用。采用原typedcheckpoint/permission/probe/完整manifest，拒绝body复制、scan/ACK审批、取消覆盖lateeffect和不可见count泄漏。伪代码只设计，不宣称compile/run。

## 批次表

| flow | 协议 | 对象能力 | Tx / effect |
|---|---|---|---|
| RequestDistributionFlow | RequestDistributionRequest | AcquisitionGatePolicy.evaluate + DistributionIntent.accept + relation + PreparedAttempt / exactreceiverformal | 单accepted UoW |
| CancelDistributionFlow | CancelDistributionRequest | DistributionIntent.cancel / currentconsumerauthority，保留attempt | 单accepted UoW |
| RecordReceiverOutcomeFlow | RecordReceiverOutcomeRequest | formal Receiver probe_result + DistributionAttempt.settle/Relation.attach；lateimpact | 单accepted UoW |
| GetAcquisitionEligibilityFlow | GetAcquisitionEligibilityRequest | formalcurrent read source/auth/Gov/receiver + AcquisitionGatePolicy，无intent | readonly，无写 |
| GetDistributionProgressFlow | GetDistributionProgressRequest | intent/relation/attempt完整read，不probe/retry | readonly，无写 |
| DispatchDistributionFlow | DispatchDistributionRequest | attempt.begin/currentversionlock/permission then ReceiverPort.dispatch | claim/permission→external outsideTx→result UoW |
| ReconcileDistributionFlow | ReconcileDistributionRequest | 原intentprobe，不盲发；formalnotcommit后newattempt sameintent | claim/permission→external outsideTx→result UoW |

### RequestDistributionFlow

#### 入口与目标

`pub async fn request_distribution(&self, request: CommandEnvelope<RequestDistributionRequest>) -> Result<ExecutionResult<DistributionResult>, MarketError>`；planned distribution/request_distribution.rs。目标：AcquisitionGatePolicy.evaluate + DistributionIntent.accept + relation + PreparedAttempt / exactreceiverformal。只允许Step6方法、Step7 typedports/[application callables](03_ddd_step_07_application_callables.md)，不能调用未定义业务builder。

#### 函数级ASCII调用图

```text
[API request_distribution typedRequest]
  | call CommandRunner.prepare(current scope -> fullresult replay)
  v
[fresh readonly local facts -> external formal prechecks; no write Tx]
  | tx begin ReadWrite -> reserve under operation-key lock
  v
[DistributionIntent factory/member + typed guard]
  | save Accepted+relation+Preparedattempt+work；未installed/paid；workref必须与attempt初fence一致
  v
[work/plan + audit + StoredResult + Operation.complete]
  | commit -> KnownCommitted / Unknown-key-resolution
  v
[original typed DistributionResult]
```

#### Rust风格伪代码

```rust
let source_candidates: Vec<SourceVerificationTarget> = vec![];
let requested_scope: Option<MarketScopeRef> = Some(request.body.target.scope_ref.clone());
// [CommandRunner.prepare(CommandEnvelope request, MarketOperationKind kind, typed subjects, candidates, requested_scope)]
let subjects = vec![MarketAuditSubjectRef::Version(request.body.target.version_ref.clone())];
let start = commands.prepare(request, MarketOperationKind::RequestDistribution, subjects, source_candidates, requested_scope).await?;
let prepared = match start {
    CommandStart::Fresh(p) => p,
    CommandStart::Replayed(stored) => return match stored.safe_result { MarketResultSurface::Distribution(value) => Ok(ExecutionResult { value, disposition: ReplayDisposition::OriginalReplayed }), _ => Err(support.error(ErrorCode::IntegrityFailure)) },
};
let body: RequestDistributionRequest = prepared.body.clone();
// [UnitOfWork.begin(UowMode::ReadOnly)]
let mut reads = uow.begin(UowMode::ReadOnly).await?;
let local_read = async {
let version_row = support.require(store.load_version(&mut reads, body.target.version_ref.clone()).await?)?;
let application_row = support.require(store.load_application(&mut reads, version_row.value.application_ref.clone()).await?)?;
let basis = support.require(store.load_basis(&mut reads, support.require(application_row.value.basis_ref.clone())?).await?)?;
let publisher_row = support.require(store.load_publisher(&mut reads, basis.publisher_ref.clone()).await?)?;
Ok((version_row, application_row, basis, publisher_row))
}.await;
// [UnitOfWork.rollback(readonly tx)]
uow.rollback(reads).await?;
let (version_row, application_row, basis, publisher_row) = local_read?;

// [formal owner ports / FreshGate.publication or admission; outside SQL tx]
let q = gates.admission(version_row.value.clone(), basis.clone(), publisher_row.value.clone(), prepared.scope.read_context.clone()).await?;
let target = receiver_port.qualify_target(body.target.clone(), prepared.scope.read_context.clone()).await?;
let requirements = AcquisitionRequirements { admission: q.requirements.clone(), receiver_contract_ref: receiver_port.consumer_contract()? };
// [UnitOfWork.begin(UowMode::ReadWrite)]
let mut tx = uow.begin(UowMode::ReadWrite).await?;
// [CommandRunner.reserve(tx, prepared): lock key -> replay race / fresh ids]
let reserved = match commands.reserve(&mut tx, &prepared).await {
    Ok(ReservationOutcome::Fresh(r)) => r,
    Ok(ReservationOutcome::Replayed(stored)) => {
        uow.rollback(tx).await?;
        return match stored.safe_result {
            MarketResultSurface::Distribution(value) => Ok(ExecutionResult { value, disposition: ReplayDisposition::OriginalReplayed }),
            _ => Err(support.error(ErrorCode::IntegrityFailure)),
        };
    },
    Err(error) => { uow.rollback(tx).await?; return Err(error); },
};
let outcome = async {
    let mut works: Vec<PlannedResponsibility> = vec![];
    let mut bases: SafeBasisReferenceSet = prepared.scope.authority_basis.clone();
    bases.push(support.basis(SafeBasisKind::Publisher, q.current.publisher.authority_ref.token.clone())?);
    bases.push(support.basis(SafeBasisKind::Source, q.current.source.eligibility_ref.token.clone())?);
    for material in &q.current.materials { bases.push(support.basis(SafeBasisKind::Material, material.material_ref.token.clone())?); }
    bases.push(support.basis(SafeBasisKind::Decision, q.decision_binding.decision_ref.token.clone())?);
    let window = support.bounded_window(reserved.cursor, None)?;
    // [UnitOfWork.lock_publisher(Tx tx, PublisherRelationRef publisher_ref)]
    uow.lock_publisher(&mut tx, publisher_row.value.relation_ref.clone()).await?;
    let current_publisher = support.require(store.load_publisher(&mut tx, publisher_row.value.relation_ref.clone()).await?)?;
    support.assert_binding(current_publisher.value.state == PublisherRelationState::Bound)?;
    // Current formal authority must match this exact reloaded relation; local Release uses same lock.
    // [DistributionIntent factory/member; typed owner input construction]
    uow.lock_version(&mut tx, target.version_ref.clone()).await?;
    let loaded = support.require(store.load_version(&mut tx, target.version_ref.clone()).await?)?;
    support.assert_allowed(AcquisitionGatePolicy::new(requirements)?.evaluate(loaded.value, q.current.clone(), target.clone())?)?;
    let intent = DistributionIntent::accept(QualifiedAcquisitionInput { intent_ref: ids.new_distribution_intent_ref(), target, current: q.current })?;
    let relation = DistributionRelation::for_intent(AcceptedDistributionInput { relation_ref: ids.new_distribution_relation_ref(), intent: DistributionIntentSnapshot { intent_ref: intent.intent_ref.clone(), version_ref: intent.version_ref.clone(), consumer_ref: intent.consumer_ref.clone(), receiver_ref: intent.receiver_ref.clone(), scope_ref: intent.scope_ref.clone(), state: intent.state, revision: intent.revision } })?;
    let work_ref = ids.new_deferred_work_ref();
    let fence = DispatchFence { work_ref: work_ref.clone(), generation: 0, expires_at: clock.now() };
    let attempt = DistributionAttempt::prepare(DistributionDispatchInput { attempt_ref: ids.new_distribution_attempt_ref(), intent_ref: intent.intent_ref.clone(), fence })?;
    store.save_intent(&mut tx, intent.clone(), ExpectedMarketRevision::MustNotExist).await?;
    store.save_relation(&mut tx, relation.clone(), ExpectedMarketRevision::MustNotExist).await?;
    store.save_attempt(&mut tx, attempt.clone(), ExpectedMarketRevision::MustNotExist).await?;
    works.push(support.schedule(&reserved, Some(work_ref.clone()), MarketWorkTargetRef::Distribution(attempt.attempt_ref.clone()), MarketEffectIntentRef::Distribution(intent.intent_ref.clone()), MarketOperationKind::DispatchDistribution, intent.scope_ref.clone(), None, None, vec![])?);
    let subject = MarketAuditSubjectRef::Distribution(intent.intent_ref.clone());
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
    let intent = support.require(store.load_intent(&mut tx, intent.intent_ref.clone()).await?)?.value;
    let relation = support.require(store.get_relation_by_intent(&mut tx, intent.intent_ref.clone()).await?)?.value;
    let attempts = vec![support.require(store.load_attempt(&mut tx, attempt.attempt_ref.clone()).await?)?.value];
    let result = support.distribution_result(receipt, intent, relation, attempts, works.iter().filter(|w|matches!(w.work.target_ref, MarketWorkTargetRef::Impact(_))).map(|w|w.work.work_ref.clone()).collect());
    Ok((MarketResultSurface::Distribution(result), audit, works))
}.await;
match outcome {
    Err(error) => { uow.rollback(tx).await?; Err(error) },
    Ok((surface, audit, works)) => {
        // [CommandRunner.finish: work+plan -> audit -> complete original result -> operation -> commit]
        let execution = commands.finish(tx, reserved, surface, audit, works).await?;
        support.public_result(execution, |s| match s { MarketResultSurface::Distribution(v) => Ok(v), _ => Err(support.error(ErrorCode::IntegrityFailure)) })
    },
}
```

#### 输入构造与条件来源

| 符号 / 参数 | 唯一来源 | missing / binding / 保持规则 |
|---|---|---|
| body | RequestDistributionRequest完整schema | HLD Qualified输入只是内侧构造，不信client approved/verified |
| source_candidates/requested_scope | 本DTO source_candidate或draft_spec.source_candidate/target.scope_ref、Bind requested_scope；无该字段时empty/None | 正式ScopeResolver.resolve重新裁剪，不从opaqueparse；taxonomyCreate明确requested_scope |
| readonly本体 | 上述load返回完整Versioned或immutablebasis | Missing拒绝；mutablefresh在writeTx重读、CAS和fixedbasis/subject相等 |
| formal qualified变量 | let q = gates.admission(version_row.value, basis, publisher_row.value, prepared.scope.read_context.clone()).await?; <br> let target = receiver_port.qualify_target(body.target.clone(), prepared.scope.read_context.clone()).await?; <br> let requirements = AcquisitionRequirements { admission: q.requirements.clone(), receiver_contract_ref: receiver_port.consumer_contract()? }; | fields逐schema full复制；consumer_contract取不到blocked，不自造true |
| bases | currentScope.authority_basis + 当次formal source/material/Gov/receiver/disposition/notice safe refs | 同kind typedtoken通过FlowSupport.basis复制；缺正式proof不形成allow/approval |
| window | reserved.cursor固定upper+validatedbatchlimit | 只durable内部scan，不是Querypage；需要所有页时durablecontinuation，不首page冒全量 |
| result/receipt | above完整familyliteral，IDs/revision取actualstaged save/readback | originalfulltyped result同Tx，replay不再生成/更新 |

#### Tx、状态与副作用inventory

| 项 | 本flow边界 |
|---|---|
| accepted局部变化 | Accepted+relation+Preparedattempt+work；未installed/paid；workref必须与attempt初fence一致 |
| 同UoW必写 | typed owningfacts + qualification/disposition sidecar（如适用）+ Corecontext + audit + 完整DistributionResult + Operation Completed + 必要work/plan |
| external effect | 无Command直接dispatch；fresh external调用仅formalread/qualification，业务write effect由durableJob |
| projection | 只安排必要typed derivedwork；不命令伪改Fresh；read发现cursor落后degraded，Rebuild正式推进 |
| failure | malformed/notvisible/diffintent/缺ref/不匹配/非法state/CAS→safe错误与全部rollback；commitUnknown key-read正式resolve，不blind freshretry |
| replay | 当前authority/disclosure先核；同key+fingerprint读原完整payload，不业务precheck/ID/Clock/method/save/dispatch |

#### 测试切口与停审

planned request_distribution: freshaccepted、samekeyoriginalreplay（副作用0）、changedintentconflict、scopehide、missing/unsafe/candidatewrongkind、每save后故障rollback、CASrace，以及“Accepted+relation+Preparedattempt+work；未installed/paid；workref必须与attempt初fence一致”特有状态/binding/竞态。文档小循环检查DTO、完整method/port调用、result与副作用；不造测试run/evidence。下一flow仅在本flow规则已列后展开。


### CancelDistributionFlow

#### 入口与目标

`pub async fn cancel_distribution(&self, request: CommandEnvelope<CancelDistributionRequest>) -> Result<ExecutionResult<DistributionResult>, MarketError>`；planned distribution/cancel_distribution.rs。目标：DistributionIntent.cancel / currentconsumerauthority，保留attempt。只允许Step6方法、Step7 typedports/[application callables](03_ddd_step_07_application_callables.md)，不能调用未定义业务builder。

#### 函数级ASCII调用图

```text
[API cancel_distribution typedRequest]
  | call CommandRunner.prepare(current scope -> fullresult replay)
  v
[fresh readonly local facts -> external formal prechecks; no write Tx]
  | tx begin ReadWrite -> reserve under operation-key lock
  v
[DistributionIntent factory/member + typed guard]
  | save Cancelled intent，不覆盖Confirmed/Unknown attempts；lateformal可保存
  v
[work/plan + audit + StoredResult + Operation.complete]
  | commit -> KnownCommitted / Unknown-key-resolution
  v
[original typed DistributionResult]
```

#### Rust风格伪代码

```rust
let source_candidates: Vec<SourceVerificationTarget> = vec![];
let requested_scope: Option<MarketScopeRef> = None;
// [CommandRunner.prepare(CommandEnvelope request, MarketOperationKind kind, typed subjects, candidates, requested_scope)]
let subjects = vec![MarketAuditSubjectRef::Distribution(request.body.intent_ref.clone())];
let start = commands.prepare(request, MarketOperationKind::CancelDistribution, subjects, source_candidates, requested_scope).await?;
let prepared = match start {
    CommandStart::Fresh(p) => p,
    CommandStart::Replayed(stored) => return match stored.safe_result { MarketResultSurface::Distribution(value) => Ok(ExecutionResult { value, disposition: ReplayDisposition::OriginalReplayed }), _ => Err(support.error(ErrorCode::IntegrityFailure)) },
};
let body: CancelDistributionRequest = prepared.body.clone();
// [UnitOfWork.begin(UowMode::ReadOnly)]
let mut reads = uow.begin(UowMode::ReadOnly).await?;
let local_read = async {
let intent_row = support.require(store.load_intent(&mut reads, body.intent_ref.clone()).await?)?;
Ok((intent_row,))
}.await;
// [UnitOfWork.rollback(readonly tx)]
uow.rollback(reads).await?;
let (intent_row,) = local_read?;

// [formal owner ports / FreshGate.publication or admission; outside SQL tx]
let authority = publisher_port.authorize_operation(MarketOperationKind::CancelDistribution, MarketAuditSubjectRef::Distribution(body.intent_ref.clone()), prepared.scope.read_context.clone()).await?;
// [UnitOfWork.begin(UowMode::ReadWrite)]
let mut tx = uow.begin(UowMode::ReadWrite).await?;
// [CommandRunner.reserve(tx, prepared): lock key -> replay race / fresh ids]
let reserved = match commands.reserve(&mut tx, &prepared).await {
    Ok(ReservationOutcome::Fresh(r)) => r,
    Ok(ReservationOutcome::Replayed(stored)) => {
        uow.rollback(tx).await?;
        return match stored.safe_result {
            MarketResultSurface::Distribution(value) => Ok(ExecutionResult { value, disposition: ReplayDisposition::OriginalReplayed }),
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
    // [DistributionIntent factory/member; typed owner input construction]
    let loaded = support.require(store.load_intent(&mut tx, body.intent_ref.clone()).await?)?;
    support.expect_revision(loaded.revision, body.expected_revision)?;
    uow.lock_version(&mut tx, loaded.value.version_ref.clone()).await?;
    let mut intent = loaded.value;
    intent.cancel(DistributionCancelInput { authority_ref: support.require(authority.recovery_ref)?, reason_ref: body.reason_ref.clone() })?;
    store.save_intent(&mut tx, intent.clone(), ExpectedMarketRevision::Exact(loaded.revision)).await?;
    let relation = support.require(store.get_relation_by_intent(&mut tx, intent.intent_ref.clone()).await?)?.value;
    let attempts = store.list_attempts_by_intent(&mut tx, intent.intent_ref.clone(), window.clone()).await?.items.into_iter().map(|v|v.value).collect();
    let subject = MarketAuditSubjectRef::Distribution(intent.intent_ref.clone());
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
    let intent = support.require(store.load_intent(&mut tx, intent.intent_ref.clone()).await?)?.value;
    let relation = support.require(store.get_relation_by_intent(&mut tx, intent.intent_ref.clone()).await?)?.value;
    // attempts preserves the original bounded snapshot captured above; Query exposes current paged history.
    let result = support.distribution_result(receipt, intent, relation, attempts, works.iter().filter(|w|matches!(w.work.target_ref, MarketWorkTargetRef::Impact(_))).map(|w|w.work.work_ref.clone()).collect());
    Ok((MarketResultSurface::Distribution(result), audit, works))
}.await;
match outcome {
    Err(error) => { uow.rollback(tx).await?; Err(error) },
    Ok((surface, audit, works)) => {
        // [CommandRunner.finish: work+plan -> audit -> complete original result -> operation -> commit]
        let execution = commands.finish(tx, reserved, surface, audit, works).await?;
        support.public_result(execution, |s| match s { MarketResultSurface::Distribution(v) => Ok(v), _ => Err(support.error(ErrorCode::IntegrityFailure)) })
    },
}
```

#### 输入构造与条件来源

| 符号 / 参数 | 唯一来源 | missing / binding / 保持规则 |
|---|---|---|
| body | CancelDistributionRequest完整schema | HLD Qualified输入只是内侧构造，不信client approved/verified |
| source_candidates/requested_scope | 本DTO source_candidate或draft_spec.source_candidate/target.scope_ref、Bind requested_scope；无该字段时empty/None | 正式ScopeResolver.resolve重新裁剪，不从opaqueparse；taxonomyCreate明确requested_scope |
| readonly本体 | 上述load返回完整Versioned或immutablebasis | Missing拒绝；mutablefresh在writeTx重读、CAS和fixedbasis/subject相等 |
| formal qualified变量 | let authority = publisher_port.authorize_operation(MarketOperationKind::CancelDistribution, MarketAuditSubjectRef::Distribution(body.intent_ref.clone()), prepared.scope.read_context.clone()).await?; | fields逐schema full复制；consumer_contract取不到blocked，不自造true |
| bases | currentScope.authority_basis + 当次formal source/material/Gov/receiver/disposition/notice safe refs | 同kind typedtoken通过FlowSupport.basis复制；缺正式proof不形成allow/approval |
| window | reserved.cursor固定upper+validatedbatchlimit | 只durable内部scan，不是Querypage；需要所有页时durablecontinuation，不首page冒全量 |
| result/receipt | above完整familyliteral，IDs/revision取actualstaged save/readback | originalfulltyped result同Tx，replay不再生成/更新 |

#### Tx、状态与副作用inventory

| 项 | 本flow边界 |
|---|---|
| accepted局部变化 | Cancelled intent，不覆盖Confirmed/Unknown attempts；lateformal可保存 |
| 同UoW必写 | typed owningfacts + qualification/disposition sidecar（如适用）+ Corecontext + audit + 完整DistributionResult + Operation Completed + 必要work/plan |
| external effect | 无Command直接dispatch；fresh external调用仅formalread/qualification，业务write effect由durableJob |
| projection | 只安排必要typed derivedwork；不命令伪改Fresh；read发现cursor落后degraded，Rebuild正式推进 |
| failure | malformed/notvisible/diffintent/缺ref/不匹配/非法state/CAS→safe错误与全部rollback；commitUnknown key-read正式resolve，不blind freshretry |
| replay | 当前authority/disclosure先核；同key+fingerprint读原完整payload，不业务precheck/ID/Clock/method/save/dispatch |

#### 测试切口与停审

planned cancel_distribution: freshaccepted、samekeyoriginalreplay（副作用0）、changedintentconflict、scopehide、missing/unsafe/candidatewrongkind、每save后故障rollback、CASrace，以及“Cancelled intent，不覆盖Confirmed/Unknown attempts；lateformal可保存”特有状态/binding/竞态。文档小循环检查DTO、完整method/port调用、result与副作用；不造测试run/evidence。下一flow仅在本flow规则已列后展开。


### RecordReceiverOutcomeFlow

#### 入口与目标

`pub async fn record_receiver_outcome(&self, request: CommandEnvelope<RecordReceiverOutcomeRequest>) -> Result<ExecutionResult<DistributionResult>, MarketError>`；planned distribution/record_receiver_outcome.rs。目标：formal Receiver probe_result + DistributionAttempt.settle/Relation.attach；lateimpact。只允许Step6方法、Step7 typedports/[application callables](03_ddd_step_07_application_callables.md)，不能调用未定义业务builder。

#### 函数级ASCII调用图

```text
[API record_receiver_outcome typedRequest]
  | call CommandRunner.prepare(current scope -> fullresult replay)
  v
[fresh readonly local facts -> external formal prechecks; no write Tx]
  | tx begin ReadWrite -> reserve under operation-key lock
  v
[DistributionAttempt factory/member + typed guard]
  | save matchingformalresult+relation；Cancelled仍保存；known/unknown/late impact责任同UoW，不丢通知
  v
[work/plan + audit + StoredResult + Operation.complete]
  | commit -> KnownCommitted / Unknown-key-resolution
  v
[original typed DistributionResult]
```

#### Rust风格伪代码

```rust
let source_candidates: Vec<SourceVerificationTarget> = vec![];
let requested_scope: Option<MarketScopeRef> = None;
// [CommandRunner.prepare(CommandEnvelope request, MarketOperationKind kind, typed subjects, candidates, requested_scope)]
let subjects = vec![MarketAuditSubjectRef::Attempt(request.body.attempt_ref.clone())];
let start = commands.prepare(request, MarketOperationKind::RecordReceiverOutcome, subjects, source_candidates, requested_scope).await?;
let prepared = match start {
    CommandStart::Fresh(p) => p,
    CommandStart::Replayed(stored) => return match stored.safe_result { MarketResultSurface::Distribution(value) => Ok(ExecutionResult { value, disposition: ReplayDisposition::OriginalReplayed }), _ => Err(support.error(ErrorCode::IntegrityFailure)) },
};
let body: RecordReceiverOutcomeRequest = prepared.body.clone();
// [UnitOfWork.begin(UowMode::ReadOnly)]
let mut reads = uow.begin(UowMode::ReadOnly).await?;
let local_read = async {
let attempt_row = support.require(store.load_attempt(&mut reads, body.attempt_ref.clone()).await?)?;
let intent_row = support.require(store.load_intent(&mut reads, attempt_row.value.intent_ref.clone()).await?)?;
Ok((attempt_row, intent_row))
}.await;
// [UnitOfWork.rollback(readonly tx)]
uow.rollback(reads).await?;
let (attempt_row, intent_row) = local_read?;

// [formal owner ports / FreshGate.publication or admission; outside SQL tx]
let formal = receiver_port.probe_distribution(ReceiverProbeInput { intent_ref: intent_row.value.intent_ref.clone(), context: DistributionOutcomeContext { intent_ref: intent_row.value.intent_ref.clone(), version_ref: intent_row.value.version_ref.clone(), consumer_ref: intent_row.value.consumer_ref.clone(), receiver_ref: intent_row.value.receiver_ref.clone(), scope_ref: intent_row.value.scope_ref.clone() } }).await?;
support.assert_binding(matches!(&formal.outcome, ReceiverOutcomeInput::Confirmed(_)))?;
support.assert_binding(support.require(formal.binding.clone())?.outcome_ref == body.outcome_candidate)?;
// [UnitOfWork.begin(UowMode::ReadWrite)]
let mut tx = uow.begin(UowMode::ReadWrite).await?;
// [CommandRunner.reserve(tx, prepared): lock key -> replay race / fresh ids]
let reserved = match commands.reserve(&mut tx, &prepared).await {
    Ok(ReservationOutcome::Fresh(r)) => r,
    Ok(ReservationOutcome::Replayed(stored)) => {
        uow.rollback(tx).await?;
        return match stored.safe_result {
            MarketResultSurface::Distribution(value) => Ok(ExecutionResult { value, disposition: ReplayDisposition::OriginalReplayed }),
            _ => Err(support.error(ErrorCode::IntegrityFailure)),
        };
    },
    Err(error) => { uow.rollback(tx).await?; return Err(error); },
};
let outcome = async {
    let mut works: Vec<PlannedResponsibility> = vec![];
    let mut bases: SafeBasisReferenceSet = prepared.scope.authority_basis.clone();
    bases.push(support.basis(SafeBasisKind::Receiver, support.require(formal.binding.clone())?.outcome_ref.token.clone())?);
    let window = support.bounded_window(reserved.cursor, None)?;
    // [DistributionAttempt factory/member; typed owner input construction]
    let loaded = support.require(store.load_attempt(&mut tx, body.attempt_ref.clone()).await?)?;
    let intent = support.require(store.load_intent(&mut tx, loaded.value.intent_ref.clone()).await?)?.value;
    uow.lock_version(&mut tx, intent.version_ref.clone()).await?;
    let old_relation = support.require(store.get_relation_by_intent(&mut tx, intent.intent_ref.clone()).await?)?;
    let binding = ReceiverOutcomeBinding::from_receiver(support.require(formal.binding)?)?;
    support.assert_binding(binding.matches(DistributionOutcomeContext { intent_ref: intent.intent_ref.clone(), version_ref: intent.version_ref.clone(), consumer_ref: intent.consumer_ref.clone(), receiver_ref: intent.receiver_ref.clone(), scope_ref: intent.scope_ref.clone() }))?;
    let mut attempt = loaded.value;
    support.assert_binding(matches!(&formal.outcome, ReceiverOutcomeInput::Confirmed(value) if value == &binding))?;
    attempt.settle(formal.outcome)?;
    let mut relation = old_relation.value;
    relation.attach(binding)?;
    store.save_attempt(&mut tx, attempt.clone(), ExpectedMarketRevision::Exact(loaded.revision)).await?;
    store.save_relation(&mut tx, relation.clone(), ExpectedMarketRevision::Exact(old_relation.revision)).await?;
    let mut disposition_window = window.clone();
    loop {
        // [MarketStorePort.list_dispositions_by_version(Tx tx, MarketVersionRef version_ref, ReadWindow window)]
        let page = store.list_dispositions_by_version(&mut tx, intent.version_ref.clone(), disposition_window.clone()).await?;
        for disposition in page.items {
            let loaded_impact = support.require(store.get_impact_by_disposition(&mut tx, disposition.disposition_ref.clone()).await?)?;
            let mut impact = loaded_impact.value;
            // [ImpactRecord.include(ImpactDeltaInput delta)]
            impact.include(ImpactDeltaInput { relation_refs: vec![relation.relation_ref.clone()],
                unknown_attempt_refs: vec![], coverage_cursor: reserved.cursor, enumeration_complete: false })?;
            store.save_impact(&mut tx, impact.clone(), ExpectedMarketRevision::Exact(loaded_impact.revision)).await?;
            works.push(support.schedule(&reserved, None, MarketWorkTargetRef::Impact(impact.impact_ref),
                MarketEffectIntentRef::Distribution(intent.intent_ref.clone()), MarketOperationKind::EnumerateKnownImpact,
                intent.scope_ref.clone(), Some(window.clone()), None, vec![])?);
        }
        match page.next_cursor { Some(after) => disposition_window.after = Some(after), None => break }
        // Configured accepted-UoW item/time budget exceeded => safe Unsupported + whole rollback.
        // Original external outcome remains recoverable by probe; no truncation or repeat send.
    }
    let attempts = vec![attempt.clone()];
    let subject = MarketAuditSubjectRef::Attempt(body.attempt_ref.clone());
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
    let intent = support.require(store.load_intent(&mut tx, intent.intent_ref.clone()).await?)?.value;
    let relation = support.require(store.get_relation_by_intent(&mut tx, intent.intent_ref.clone()).await?)?.value;
    let attempts = vec![support.require(store.load_attempt(&mut tx, attempt.attempt_ref.clone()).await?)?.value];
    let result = support.distribution_result(receipt, intent, relation, attempts, works.iter().filter(|w|matches!(w.work.target_ref, MarketWorkTargetRef::Impact(_))).map(|w|w.work.work_ref.clone()).collect());
    Ok((MarketResultSurface::Distribution(result), audit, works))
}.await;
match outcome {
    Err(error) => { uow.rollback(tx).await?; Err(error) },
    Ok((surface, audit, works)) => {
        // [CommandRunner.finish: work+plan -> audit -> complete original result -> operation -> commit]
        let execution = commands.finish(tx, reserved, surface, audit, works).await?;
        support.public_result(execution, |s| match s { MarketResultSurface::Distribution(v) => Ok(v), _ => Err(support.error(ErrorCode::IntegrityFailure)) })
    },
}
```

#### 输入构造与条件来源

| 符号 / 参数 | 唯一来源 | missing / binding / 保持规则 |
|---|---|---|
| body | RecordReceiverOutcomeRequest完整schema | HLD Qualified输入只是内侧构造，不信client approved/verified |
| source_candidates/requested_scope | 本DTO source_candidate或draft_spec.source_candidate/target.scope_ref、Bind requested_scope；无该字段时empty/None | 正式ScopeResolver.resolve重新裁剪，不从opaqueparse；taxonomyCreate明确requested_scope |
| readonly本体 | 上述load返回完整Versioned或immutablebasis | Missing拒绝；mutablefresh在writeTx重读、CAS和fixedbasis/subject相等 |
| formal qualified变量 | let formal = receiver_port.probe_distribution(ReceiverProbeInput { intent_ref: intent_row.value.intent_ref.clone(), context: DistributionOutcomeContext { intent_ref: intent_row.value.intent_ref.clone(), version_ref: intent_row.value.version_ref.clone(), consumer_ref: intent_row.value.consumer_ref.clone(), receiver_ref: intent_row.value.receiver_ref.clone(), scope_ref: intent_row.value.scope_ref.clone() } }).await?; <br> support.assert_binding(support.require(formal.binding.clone())?.outcome_ref == body.outcome_candidate)?; | fields逐schema full复制；consumer_contract取不到blocked，不自造true |
| bases | currentScope.authority_basis + 当次formal source/material/Gov/receiver/disposition/notice safe refs | 同kind typedtoken通过FlowSupport.basis复制；缺正式proof不形成allow/approval |
| window | reserved.cursor固定upper+validatedbatchlimit | 只durable内部scan，不是Querypage；需要所有页时durablecontinuation，不首page冒全量 |
| result/receipt | above完整familyliteral，IDs/revision取actualstaged save/readback | originalfulltyped result同Tx，replay不再生成/更新 |

#### Tx、状态与副作用inventory

| 项 | 本flow边界 |
|---|---|
| accepted局部变化 | matchingformalresult+relation；Cancelled仍保存；known/unknown/late impact责任同UoW，不丢通知 |
| 同UoW必写 | typed owningfacts + qualification/disposition sidecar（如适用）+ Corecontext + audit + 完整DistributionResult + Operation Completed + 必要work/plan |
| external effect | 无Command直接dispatch；fresh external调用仅formalread/qualification，业务write effect由durableJob |
| projection | 只安排必要typed derivedwork；不命令伪改Fresh；read发现cursor落后degraded，Rebuild正式推进 |
| failure | malformed/notvisible/diffintent/缺ref/不匹配/非法state/CAS→safe错误与全部rollback；commitUnknown key-read正式resolve，不blind freshretry |
| replay | 当前authority/disclosure先核；同key+fingerprint读原完整payload，不业务precheck/ID/Clock/method/save/dispatch |

#### 测试切口与停审

planned record_receiver_outcome: freshaccepted、samekeyoriginalreplay（副作用0）、changedintentconflict、scopehide、missing/unsafe/candidatewrongkind、每save后故障rollback、CASrace，以及“matchingformalresult+relation；Cancelled仍保存；known/unknown/late impact责任同UoW，不丢通知”特有状态/binding/竞态。文档小循环检查DTO、完整method/port调用、result与副作用；不造测试run/evidence。下一flow仅在本flow规则已列后展开。


### GetAcquisitionEligibilityFlow

#### 入口与目标

`pub async fn get_acquisition_eligibility(&self, request: QueryEnvelope<GetAcquisitionEligibilityRequest>) -> Result<ReadSurface<DistributionProgressReadModel>, MarketError>`；planned distribution/get_acquisition_eligibility.rs。目标：formalcurrent read source/auth/Gov/receiver + AcquisitionGatePolicy，无intent。只允许Step6方法、Step7 typedports/[application callables](03_ddd_step_07_application_callables.md)，不能调用未定义业务builder。

#### 函数级ASCII调用图

```text
[API get_acquisition_eligibility QueryEnvelope]
  | call ReadFacade.authorize -> formal current scope/disclosure
  v
[ReadOnly Tx -> exact typed source pair / readonly formalowner read]
  | assemble DistributionProgressReadModel; never save/reserve/dispatch/refresh
  v
[Ready / Empty / NotVisible / Missing / Degraded]
```

#### Rust风格伪代码

```rust
let source_candidates: Vec<SourceVerificationTarget> = vec![];
let requested_scope: Option<MarketScopeRef> = Some(request.body.target.scope_ref.clone());
// [ReadFacade.authorize(QueryEnvelope, typed subjects, source candidates, requested_scope)]
let scope = reads.authorize(&request, vec![MarketAuditSubjectRef::Version(request.body.target.version_ref.clone())], source_candidates, requested_scope).await?;
let body: GetAcquisitionEligibilityRequest = request.body.clone();
// [UnitOfWork.begin(UowMode::ReadOnly)]
let mut tx = uow.begin(UowMode::ReadOnly).await?;
let local_read = async {
let cursor = uow.current_cursor(&mut tx).await?;
let version = support.require(store.load_version(&mut tx, body.target.version_ref.clone()).await?)?.value;
let application = support.require(store.load_application(&mut tx, version.application_ref.clone()).await?)?.value;
let basis = support.require(store.load_basis(&mut tx, support.require(application.basis_ref)?).await?)?;
let publisher = support.require(store.load_publisher(&mut tx, basis.publisher_ref.clone()).await?)?.value;
Ok((cursor, version, basis, publisher))
}.await;
uow.rollback(tx).await?;
let (cursor, version, basis, publisher) = match local_read { Ok(v) => v, Err(error) => return reads.map_read_error(error) };
let qualification = gates.admission(version.clone(), basis, publisher, scope.clone()).await;
let receiver = receiver_port.qualify_target(body.target.clone(), scope.clone()).await;
let (gate_allows, formal_gate_basis, current_gap) = match qualification {
    Ok(q) => { let gate = AcquisitionGatePolicy::new(AcquisitionRequirements { admission: q.requirements, receiver_contract_ref: receiver_port.consumer_contract()? })?.evaluate(version.clone(), q.current, receiver?)?; (gate.allowed, gate.basis_refs, gate.failure) },
    Err(error) => (false, vec![], Some(SafeFailureRef { code: error.code, reason_ref: error.reason_ref })),
};

let view = DistributionReadView::assemble(DistributionReadInput { intent_ref: None, relation_ref: None, attempt_refs: vec![], read_context: scope.clone(), status: ReadSurfaceKind::Ready })?;
let value = DistributionProgressReadModel { view, intent_state: None, attempts: vec![], eligible: Some(gate_allows), gate_basis_refs: formal_gate_basis, failure_ref: current_gap };
// [ReadFacade.ready(items, PageInfo, ReadMarker); no writes]
let marker = support.ready_marker(None, cursor);
let surface = reads.ready(vec![value], reads.detail_info(cursor), marker)?;
// Readonly transaction was already closed before owner reads.
Ok(surface)
```

#### 读取、构造与失败来源

formal currentqualification+receiverqualify+AcquisitionGatePolicy.evaluate只纯read；no ID/intentrelation/work。所有free symbol是明确typedsource映射而不是builder占位：source_candidates/requested_scope按本Request字段或empty/None；state与readmodel字段逐原值copy；qualified_visible_summary只QualifiedSnapshotMaterial::Source且当前可见，缺可选摘要None不证明合格；typed_notice_read_items/attempt_snapshots按已声明纯函数逐字段copy；formal_saved_observation_binding从AuditStore.get_observation_binding读取；current_gap来自formal错误safe code，不生成owner扫描/支付结果。

ownerqualification分支gate_allows/formal_gate_basis/current_gap从当前正式结果及纯policyevaluate确定，Listed与未撤回/currentapproved/receiver必需。body.field缺失reject；scope不可证明NotVisible（不带ref/count/cursor）；typedsourceMissing只authorizedMissing；Stale/Rebuilding/Unavailable/Unsupported/Failed/Disabled走Degraded，no-query-write/no-cache-refresh。每个earlyreturn/error位于显式async Result作用域，退出后readonly rollback一次；formalprecheck先关闭本地读取事务再调用owner，不二次consume handle。

#### Tx与副作用 / 测试

localWrite/ID/Clock/operationreserve/audit/work/ownerwrite/event均0；只有当前formalread与typedReadonly访问。列表/详情/版本/数量/分页同currentvisibility交集，下一token只当前可见item的boundedCorepage；historychunk不冒称全量。测试：visible/empty/NotVisible/authorizedmissing、错误不echo、wrongscope/filtertoken、state/bodypair缺失、stale/rebuilding/unsupported、locale不改refs/key、Query全部writer计数0。单flow停审：typedDTO/source/model/marker与no-write边界已列，外部资格blocked不变。


### GetDistributionProgressFlow

#### 入口与目标

`pub async fn get_distribution_progress(&self, request: QueryEnvelope<GetDistributionProgressRequest>) -> Result<ReadSurface<DistributionProgressReadModel>, MarketError>`；planned distribution/get_distribution_progress.rs。目标：intent/relation/attempt完整read，不probe/retry。只允许Step6方法、Step7 typedports/[application callables](03_ddd_step_07_application_callables.md)，不能调用未定义业务builder。

#### 函数级ASCII调用图

```text
[API get_distribution_progress QueryEnvelope]
  | call ReadFacade.authorize -> formal current scope/disclosure
  v
[ReadOnly Tx -> exact typed source pair / readonly formalowner read]
  | assemble DistributionProgressReadModel; never save/reserve/dispatch/refresh
  v
[Ready / Empty / NotVisible / Missing / Degraded]
```

#### Rust风格伪代码

```rust
let source_candidates: Vec<SourceVerificationTarget> = vec![];
let requested_scope: Option<MarketScopeRef> = None;
// [ReadFacade.authorize(QueryEnvelope, typed subjects, source candidates, requested_scope)]
let scope = reads.authorize(&request, vec![MarketAuditSubjectRef::Distribution(request.body.intent_ref.clone())], source_candidates, requested_scope).await?;
let body: GetDistributionProgressRequest = request.body.clone();
// [UnitOfWork.begin(UowMode::ReadOnly)]
let mut tx = uow.begin(UowMode::ReadOnly).await?;
let outcome = async {
let cursor = uow.current_cursor(&mut tx).await?;
let intent = support.require(store.load_intent(&mut tx, body.intent_ref.clone()).await?)?.value;
let relation = support.require(store.get_relation_by_intent(&mut tx, intent.intent_ref.clone()).await?)?.value;
let page = store.page_attempts_by_intent(&mut tx, intent.intent_ref.clone(), PageReadContext { actor: request.actor.clone(), scope: scope.clone(), selector: MarketPageSelector::GetDistributionProgress }, support.require(request.meta.page.clone())?).await?;
let view = DistributionReadView::assemble(DistributionReadInput { intent_ref: Some(intent.intent_ref), relation_ref: Some(relation.relation_ref), attempt_refs: page.items.iter().map(|v|v.value.attempt_ref.clone()).collect(), read_context: scope.clone(), status: ReadSurfaceKind::Ready })?;
let typed_attempt_snapshots = page.items.iter().map(|v|support.attempt_snapshot(v.value.clone())).collect();
let value = DistributionProgressReadModel { view, intent_state: Some(intent.state), attempts: typed_attempt_snapshots, eligible: None, gate_basis_refs: vec![], failure_ref: None };
// [ReadFacade.ready(items, PageInfo, ReadMarker); no writes]
let marker = support.ready_marker(None, cursor);
let surface = reads.ready(vec![value], page.info, marker)?;
Ok(surface)
}.await;
// [UnitOfWork.rollback(Tx readonly_tx)]
uow.rollback(tx).await?;
match outcome { Ok(surface) => Ok(surface), Err(error) => reads.map_read_error(error) }
```

#### 读取、构造与失败来源

typedintent/relation/attempt history，不probe；boundedattempt页要nextcursor不丢，当前scope再裁剪。所有free symbol是明确typedsource映射而不是builder占位：source_candidates/requested_scope按本Request字段或empty/None；state与readmodel字段逐原值copy；qualified_visible_summary只QualifiedSnapshotMaterial::Source且当前可见，缺可选摘要None不证明合格；typed_notice_read_items/attempt_snapshots按已声明纯函数逐字段copy；formal_saved_observation_binding从AuditStore.get_observation_binding读取；current_gap来自formal错误safe code，不生成owner扫描/支付结果。

ownerqualification分支gate_allows/formal_gate_basis/current_gap从当前正式结果及纯policyevaluate确定，Listed与未撤回/currentapproved/receiver必需。body.field缺失reject；scope不可证明NotVisible（不带ref/count/cursor）；typedsourceMissing只authorizedMissing；Stale/Rebuilding/Unavailable/Unsupported/Failed/Disabled走Degraded，no-query-write/no-cache-refresh。每个earlyreturn/error位于显式async Result作用域，退出后readonly rollback一次；formalprecheck先关闭本地读取事务再调用owner，不二次consume handle。

#### Tx与副作用 / 测试

localWrite/ID/Clock/operationreserve/audit/work/ownerwrite/event均0；只有当前formalread与typedReadonly访问。列表/详情/版本/数量/分页同currentvisibility交集，下一token只当前可见item的boundedCorepage；historychunk不冒称全量。测试：visible/empty/NotVisible/authorizedmissing、错误不echo、wrongscope/filtertoken、state/bodypair缺失、stale/rebuilding/unsupported、locale不改refs/key、Query全部writer计数0。单flow停审：typedDTO/source/model/marker与no-write边界已列，外部资格blocked不变。



### DispatchDistributionFlow

#### 思考、诊断与取舍

FreshGate.admission+Receiver.qualify_target+consumer_contract；Tx A lock_version重读version及intent/attempt/fence，Intent Accepted、Version Listed、未撤回/当前正式approved、全binding不漂移。仅Prepared可begin；旧Dispatching/Unknown只probe。 不允许shared runner掩盖本Job对象动作。采用下列typed原请求链；不扩大ownertruth/事件/支付范围。

#### 入口与目标

`pub async fn dispatch_distribution(&self, request: JobEnvelope<DispatchDistributionRequest>) -> Result<ExecutionResult<DistributionJobReport>, MarketError>`。planned application/distribution/dispatch_distribution.rs；协议见[Step8 U4](03_ddd_step_08_part_u4.md)，对象见[Step6 U4](03_ddd_step_06_part_u4.md)，port见[Step7](03_ddd_step_07_typed_ports.md)。完整控制流见[Job执行](03_ddd_step_09_job_execution.md)。

#### 函数级ASCII调用图

```text
[dispatch_distribution: typed JobEnvelope]
  | call JobRunner.prepare -> current disclosure / full original replay
  v
[typed local reads -> formal precheck]
  | tx A: reserve / claim / checkpoint / permission
  | commit A; unresolved commit stops before any effect
  v
[attempt.begin/currentversionlock/permission then ReceiverPort.dispatch]
  | external outside write Tx; no blind retry
  v
[tx B: exact domain methods / versioned save / full report / audit / successors]
  | call JobRunner.finish -> commit -> original typed DistributionJobReport
```

#### 关键伪代码与字段绑定

```rust
// [UnitOfWork.lock_publisher(Tx tx, PublisherRelationRef publisher_ref)]
uow.lock_publisher(&mut tx_a, frozen_basis.publisher_ref.clone()).await?;
let publisher = support.require(store.load_publisher(&mut tx_a, frozen_basis.publisher_ref.clone()).await?)?;
support.assert_binding(publisher.value.state == PublisherRelationState::Bound)?;
// Formal authority matches this exact publisher; lock order publisher -> version.
// [UnitOfWork.lock_version(Tx tx, MarketVersionRef version_ref)]
uow.lock_version(&mut tx_a, intent.version_ref.clone()).await?;
let permission = support.permission(&reserved, &work.value, Some(intent.version_ref.clone()), bases.clone());
// [DistributionAttempt.begin(CurrentDispatchGateInput input)]
attempt.begin(CurrentDispatchGateInput { permission: permission.clone(), current: qualification.current })?;
store.save_attempt(&mut tx_a, attempt, ExpectedMarketRevision::Exact(attempt_revision)).await?;
work_store.append_permission(&mut tx_a, permission).await?;
// Commit A before external call.
// [ReceiverPort.dispatch_distribution(ReceiverDispatchInput input)]
let formal = receiver_port.dispatch_distribution(input).await;
// Tx B: lock same version, load attempt/intent/relation; validate outcome+inspection.
// [DistributionAttempt.settle(ReceiverOutcomeInput input)]
attempt.settle(outcome.clone())?;
if let ReceiverOutcomeInput::Confirmed(binding) = outcome {
    support.assert_binding(binding.matches(original_context))?;
    relation.attach(binding)?;
    store.save_relation(&mut tx_b, relation, ExpectedMarketRevision::Exact(relation_revision)).await?;
}
store.save_attempt(&mut tx_b, attempt, ExpectedMarketRevision::Exact(attempt_revision)).await?;
```

伪代码标注A/B插入点，不是独立实现。所有externalcall均在A的KnownCommitted后、B开始前。 条件分支严格以下表，成功分支代码不能套入负向/Unknown。

| 参数 / 符号 | 精确来源 / 约束 |
|---|---|
| body | DispatchDistributionRequest: attempt_ref:DistributionAttemptRef; work_ref:DeferredWorkRef；无actor/key/trace第二authority |
| internal_request | InternalJobRequest::DispatchDistribution(prepared.body.clone())；A immutablecheckpoint |
| owning rows/revision | load_attempt(body.attempt_ref) -> load_intent(attempt.intent_ref) -> load_version(intent.version_ref) -> load_application/load_basis/load_publisher -> get_relation_by_intent；Missing安全错误，scope不证明先NotVisible |
| input / outcome / *_context | ReceiverDispatchInput { intent_ref, attempt_ref, source: frozen source_binding, target: exact version/consumer/receiver/scope, permission }; DistributionOutcomeContext五字段从原intent |
| bases / inspection / qualified_* | 当次正式typedport输出精确匹配；local maintenance只local committedfactrefs；缺formalproof为Unknown/Blocked而不是填true/ref |
| subject/target/effectintent | committedwork.plan typedtarget，经FlowSupport.subject_for_target；不能parse opaque。原外部intent不随Joboperation或newfence改变 |
| items/successors/report | 每target JobItemResult完整target/outcome/bases/gap/effectintent/cursor；Job执行§Report逐字段，实际sameB workIDs，不由projection重建 |

#### 事务、错误与状态副作用

| 分支 | 精确行为 |
|---|---|
| 正向/负向/Unknown | Confirmed保存正式receiverbinding；KnownNotCommitted→Failed，旧attempt终态；Unknown→CommitUnknown+原intentreconcile。许可前cancel/withdraw/缺合同→Prepared.block→Blocked，不发。许可后取消/撤回不丢late正式结果。 |
| 本地副作用 | attempt+Confirmed时relation+lateimpact/durable successor/report/audit同B；不保存installed/payment或资产正文。 |
| A失败 / A commit未知 | rollback A；或originalkey/checkpoint/permission只读resolve；未证实A提交不externalcall |
| 外部timeout/ACK / B失败 | 不等NotCommitted；A仍持有恢复责任。B rollback不撤销外效应；原intentprobe，不重新dispatch |
| binding / CAS / fence失败 | BindingMismatch/VersionConflict/FenceMismatch；rollback本B，不丢旧effect；lateformal结果新授权Reconcile承担 |
| ownercontract缺口 | ContractBlocked/Unsupported/Unavailable带safegap；no phantom body/outcome/approval；未许可可block，已许可unknown只probe |
| replay | currentactor/disclosure+samekey+fingerprint→完整原DistributionJobReport；0新ID/claim/gate/effect/scan/work；Reserved不冒充Completed |
| event / ownertruth | 0event/outbox/支付/Archive；不复制资产body，局部Confirmed不approval/evidence/readiness |

#### 测试切口与单flow停审

planned：许可与撤回/取消两种串行顺序、receiverbinding mismatch、B失败后probe、Failed不能begin、首workref等attemptfence；另覆盖完整report全字段重放、changedintent冲突、current披露收缩、每writepoint rollback与A/Bcommit未知、缺checkpoint/plan、lease过期probe-only、每itemgap保留。这里只设计静态检查，不宣称run。

| 审查项 | 结论 |
|---|---|
| DTO→factory/member→typedport | 明确上述来源；外部exact consumerqualification保持blocked，不凭candidate名称声称owner支持 |
| Tx/副作用/原报告 | A许可/原checkpoint与B完整结果分别原子；必要successor同B；0长SQL跨effect |
| 状态/测试 | 对应14carrier；Step10核对全部statepairs；本flow不新增全局state |
| 范围停审 | 文档内flow已展开，后续编译/集成须实现期真实证据；未执行测试/commit |



### ReconcileDistributionFlow

#### 思考、诊断与取舍

原intent/version/consumer/receiver/scope精确ReceiverProbeInput；Unknown/Dispatching可能提交先probe；Cancelled/Withdrawn允许保存旧结果但禁止新dispatch许可。 不允许shared runner掩盖本Job对象动作。采用下列typed原请求链；不扩大ownertruth/事件/支付范围。

#### 入口与目标

`pub async fn reconcile_distribution(&self, request: JobEnvelope<ReconcileDistributionRequest>) -> Result<ExecutionResult<DistributionJobReport>, MarketError>`。planned application/distribution/reconcile_distribution.rs；协议见[Step8 U4](03_ddd_step_08_part_u4.md)，对象见[Step6 U4](03_ddd_step_06_part_u4.md)，port见[Step7](03_ddd_step_07_typed_ports.md)。完整控制流见[Job执行](03_ddd_step_09_job_execution.md)。

#### 函数级ASCII调用图

```text
[reconcile_distribution: typed JobEnvelope]
  | call JobRunner.prepare -> current disclosure / full original replay
  v
[typed local reads -> formal original-intent probe]
  | tx A: reserve / claim / checkpoint
  | commit A; unresolved commit stops before any effect
  v
[原intentprobe，不盲发；formalnotcommit后newattempt sameintent]
  | external outside write Tx; no blind retry
  v
[tx B: exact domain methods / versioned save / full report / audit / successors]
  | call JobRunner.finish -> commit -> original typed DistributionJobReport
```

#### 关键伪代码与字段绑定

```rust
// [ReceiverPort.probe_distribution(ReceiverProbeInput input)]
let formal = receiver_port.probe_distribution(probe_input).await?;
// Tx B: lock_version, reload original attempt/intent/relation.
// [DistributionAttempt.settle(ReceiverOutcomeInput input)]
attempt.settle(formal.outcome.clone())?;
if let ReceiverOutcomeInput::Confirmed(binding) = formal.outcome.clone() {
    support.assert_binding(binding.matches(original_context))?;
    relation.attach(binding)?;
    store.save_relation(&mut tx_b, relation, ExpectedMarketRevision::Exact(relation_revision)).await?;
}
store.save_attempt(&mut tx_b, attempt, ExpectedMarketRevision::Exact(attempt_revision)).await?;
// Only explicit recovery authority + KnownNotCommitted + current acquisition gate permits a successor.
if safe_retry_authorized {
// [DistributionAttempt.prepare(DistributionDispatchInput input)]
let successor_attempt = DistributionAttempt::prepare(DistributionDispatchInput {
    attempt_ref: ids.new_distribution_attempt_ref(), intent_ref: original_intent.intent_ref,
    fence: successor_work_fence,
})?;
store.save_attempt(&mut tx_b, successor_attempt, ExpectedMarketRevision::MustNotExist).await?;
} // false: record the original negative outcome only, never create another attempt.
```

伪代码标注A/B插入点，不是独立实现。本Job不创建第二dispatch许可；claim新fence只probe-only。 条件分支严格以下表，成功分支代码不能套入负向/Unknown。

| 参数 / 符号 | 精确来源 / 约束 |
|---|---|
| body | ReconcileDistributionRequest: attempt_ref:DistributionAttemptRef; work_ref:DeferredWorkRef；无actor/key/trace第二authority |
| internal_request | InternalJobRequest::ReconcileDistribution(prepared.body.clone())；A immutablecheckpoint |
| owning rows/revision | load_attempt -> load_intent/version -> get_relation_by_intent；原checkpoint/permission；B list_dispositions_by_version固定window完整续页；Missing安全错误，scope不证明先NotVisible |
| input / outcome / *_context | ReceiverProbeInput { intent_ref: original_intent.intent_ref, context: DistributionOutcomeContext全五字段 }; safe新attempt仍同intent但新attempt/fence/work |
| bases / inspection / qualified_* | 当次正式typedport输出精确匹配；local maintenance只local committedfactrefs；缺formalproof为Unknown/Blocked而不是填true/ref |
| subject/target/effectintent | committedwork.plan typedtarget，经FlowSupport.subject_for_target；不能parse opaque。原外部intent不随Joboperation或newfence改变 |
| items/successors/report | 每target JobItemResult完整target/outcome/bases/gap/effectintent/cursor；Job执行§Report逐字段，实际sameB workIDs，不由projection重建 |

#### 事务、错误与状态副作用

| 分支 | 精确行为 |
|---|---|
| 正向/负向/Unknown | Unknown保持，缺probe workBlocked；Confirmed保存原结果及lateimpact；KnownNotCommitted旧attempt Failed。新attempt代码只在正式安全恢复+当前gate分支，普通probe只记录不自动重试；旧Failed/Blocked不能改回Prepared。 |
| 本地副作用 | 旧正式结果+影响责任；安全恢复新attempt/newwork但同externalintent；原fullreport不可覆写。 |
| A失败 / A commit未知 | rollback A；或originalkey/checkpoint/permission只读resolve；未证实A提交不externalcall |
| 外部timeout/ACK / B失败 | 不等NotCommitted；A仍持有恢复责任。B rollback不撤销外效应；原intentprobe，不重新dispatch |
| binding / CAS / fence失败 | BindingMismatch/VersionConflict/FenceMismatch；rollback本B，不丢旧effect；lateformal结果新授权Reconcile承担 |
| ownercontract缺口 | ContractBlocked/Unsupported/Unavailable带safegap；no phantom body/outcome/approval；未许可可block，已许可unknown只probe |
| replay | currentactor/disclosure+samekey+fingerprint→完整原DistributionJobReport；0新ID/claim/gate/effect/scan/work；Reserved不冒充Completed |
| event / ownertruth | 0event/outbox/支付/Archive；不复制资产body，局部Confirmed不approval/evidence/readiness |

#### 测试切口与单flow停审

planned：未知不能新attempt、Cancelled禁止newattempt仍保存Confirmed、新attempt不改intent、晚结果/更高cursor影响回Partial；另覆盖完整report全字段重放、changedintent冲突、current披露收缩、每writepoint rollback与A/Bcommit未知、缺checkpoint/plan、lease过期probe-only、每itemgap保留。这里只设计静态检查，不宣称run。

| 审查项 | 结论 |
|---|---|
| DTO→factory/member→typedport | 明确上述来源；外部exact consumerqualification保持blocked，不凭candidate名称声称owner支持 |
| Tx/副作用/原报告 | A许可/原checkpoint与B完整结果分别原子；必要successor同B；0长SQL跨effect |
| 状态/测试 | 对应14carrier；Step10核对全部statepairs；本flow不新增全局state |
| 范围停审 | 文档内flow已展开，后续编译/集成须实现期真实证据；未执行测试/commit |


## Step10结果帧与lateimpact回修

Dispatch/ReconcileDistribution的结果Tx B在lock_version后调用UnitOfWork.assign_cursor，late ImpactRecord.include使用此result_cursor，不使用permission/checkpoint的claim A游标；所有当时适用disposition通过完整fixedwindow遍历或受控预算rollback，不截断。已撤回时每适用impact包括Confirmed relation与仍Unknown attempt并安排durable EnumerateKnownImpact。C RecordReceiverOutcome处于单acceptedUoW，其reserved.cursor已是该结果帧，不需第二游标。原intent取消/withdraw后仍保存正式matchingresult。
