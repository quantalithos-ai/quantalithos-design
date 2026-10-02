# Step9 U5 撤回/影响/通知独立flow小循环

## 思考、诊断与取舍

本族从Step8完整typed请求逐入口推导读取/构造/guard/Tx/结果。先current披露与fulloriginalreplay，再fresh业务；SQLtx不跨externalowner调用。采用原typedcheckpoint/permission/probe/完整manifest，拒绝body复制、scan/ACK审批、取消覆盖lateeffect和不可见count泄漏。伪代码只设计，不宣称compile/run。

## 批次表

| flow | 协议 | 对象能力 | Tx / effect |
|---|---|---|---|
| RestrictMarketVersionFlow | RestrictMarketVersionRequest | WithdrawalDisposition.record + MarketVersion.restrict + Impact.start / formal authority or正式失效basis | 单accepted UoW |
| WithdrawMarketVersionFlow | WithdrawMarketVersionRequest | Disposition.record+Version.withdraw+Impact.start / versionserialize | 单accepted UoW |
| PlanImpactNotificationsFlow | PlanImpactNotificationsRequest | formaltarget/channel→NoticeIntent.prepare + unique dedup / knownimpact | 单accepted UoW |
| RecordNoticeOutcomeFlow | RecordNoticeOutcomeRequest | formalchannelprobe/matching + NoticeIntent.settle，不推送达 | 单accepted UoW |
| GetWithdrawalImpactFlow | GetWithdrawalImpactRequest | typedknownimpact/coverage/notice safe read，不全安装集合 | readonly，无写 |
| GetNoticeProgressFlow | GetNoticeProgressRequest | typednotice/outcome+impact+disposition currentdisclosure | readonly，无写 |
| EnumerateKnownImpactFlow | EnumerateKnownImpactRequest | bounded typedrelations/unknown fixedcursor + Impact.include / durablecontinuation | claim/permission→external outsideTx→result UoW |
| DispatchNoticeFlow | DispatchNoticeRequest | Notice.begin after formalgate + permission→channelcall | claim/permission→external outsideTx→result UoW |
| ReconcileNoticeFlow | ReconcileNoticeRequest | 原noticeprobe formalnotcommitted可safe原intent恢复；无fake delivery | claim/permission→external outsideTx→result UoW |

### RestrictMarketVersionFlow

#### 入口与目标

`pub async fn restrict_market_version(&self, request: CommandEnvelope<RestrictMarketVersionRequest>) -> Result<ExecutionResult<WithdrawalResult>, MarketError>`；planned withdrawal_notice/restrict_market_version.rs。目标：WithdrawalDisposition.record + MarketVersion.restrict + Impact.start / formal authority or正式失效basis。只允许Step6方法、Step7 typedports/[application callables](03_ddd_step_07_application_callables.md)，不能调用未定义业务builder。

#### 函数级ASCII调用图

```text
[API restrict_market_version typedRequest]
  | call CommandRunner.prepare(current scope -> fullresult replay)
  v
[fresh readonly local facts -> external formal prechecks; no write Tx]
  | tx begin ReadWrite -> reserve under operation-key lock
  v
[MarketVersion factory/member + typed guard]
  | save Restricted version+immutable disposition+Partialimpact+durableimpactwork同UoW；不等待通知/审计外部接纳，不撤销已issued permission的外部effect
  v
[work/plan + audit + StoredResult + Operation.complete]
  | commit -> KnownCommitted / Unknown-key-resolution
  v
[original typed WithdrawalResult]
```

#### Rust风格伪代码

```rust
let source_candidates: Vec<SourceVerificationTarget> = vec![];
let requested_scope: Option<MarketScopeRef> = None;
// [CommandRunner.prepare(CommandEnvelope request, MarketOperationKind kind, typed subjects, candidates, requested_scope)]
let subjects = vec![MarketAuditSubjectRef::Version(request.body.version_ref.clone())];
let start = commands.prepare(request, MarketOperationKind::RestrictMarketVersion, subjects, source_candidates, requested_scope).await?;
let prepared = match start {
    CommandStart::Fresh(p) => p,
    CommandStart::Replayed(stored) => return match stored.safe_result { MarketResultSurface::Withdrawal(value) => Ok(ExecutionResult { value, disposition: ReplayDisposition::OriginalReplayed }), _ => Err(support.error(ErrorCode::IntegrityFailure)) },
};
let body: RestrictMarketVersionRequest = prepared.body.clone();
// [UnitOfWork.begin(UowMode::ReadOnly)]
let mut reads = uow.begin(UowMode::ReadOnly).await?;
let local_read = async {
let version_row = support.require(store.load_version(&mut reads, body.version_ref.clone()).await?)?;
Ok((version_row,))
}.await;
// [UnitOfWork.rollback(readonly tx)]
uow.rollback(reads).await?;
let (version_row,) = local_read?;

// [formal owner ports / FreshGate.publication or admission; outside SQL tx]
let authority = publisher_port.authorize_operation(MarketOperationKind::RestrictMarketVersion, MarketAuditSubjectRef::Version(body.version_ref.clone()), prepared.scope.read_context.clone()).await?;
// [UnitOfWork.begin(UowMode::ReadWrite)]
let mut tx = uow.begin(UowMode::ReadWrite).await?;
// [CommandRunner.reserve(tx, prepared): lock key -> replay race / fresh ids]
let reserved = match commands.reserve(&mut tx, &prepared).await {
    Ok(ReservationOutcome::Fresh(r)) => r,
    Ok(ReservationOutcome::Replayed(stored)) => {
        uow.rollback(tx).await?;
        return match stored.safe_result {
            MarketResultSurface::Withdrawal(value) => Ok(ExecutionResult { value, disposition: ReplayDisposition::OriginalReplayed }),
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
    // [MarketVersion factory/member; typed owner input construction]
    uow.lock_version(&mut tx, body.version_ref.clone()).await?;
    let loaded = support.require(store.load_version(&mut tx, body.version_ref.clone()).await?)?;
    support.expect_revision(loaded.revision, body.expected_revision)?;
    let disposition = WithdrawalDisposition::record(QualifiedDispositionInput { disposition_ref: ids.new_withdrawal_disposition_ref(), version_ref: body.version_ref.clone(), authority_ref: support.require(authority.disposition_ref)?, action: MarketDispositionKind::Restrict, reason_ref: body.reason_ref.clone(), source_cursor: reserved.cursor })?;
    let mut version = loaded.value;
    version.restrict(VersionRestrictionInput { disposition_ref: disposition.disposition_ref.clone(), authority_ref: disposition.authority_ref.clone() })?;
    let impact = ImpactRecord::start(ImpactEnumerationInput { impact_ref: ids.new_impact_record_ref(), disposition_ref: disposition.disposition_ref.clone(), coverage_cursor: reserved.cursor })?;
    store.append_disposition(&mut tx, disposition.clone()).await?;
    let saved = store.save_version(&mut tx, version.clone(), ExpectedMarketRevision::Exact(loaded.revision)).await?;
    store.save_impact(&mut tx, impact.clone(), ExpectedMarketRevision::MustNotExist).await?;
    let local_work_ref = ids.new_deferred_work_ref();
    works.push(support.schedule(&reserved, Some(local_work_ref.clone()), MarketWorkTargetRef::Impact(impact.impact_ref.clone()), MarketEffectIntentRef::LocalWork(local_work_ref), MarketOperationKind::EnumerateKnownImpact, prepared.scope.read_context.scope_ref.clone(), Some(window.clone()), None, vec![])?);
    let subject = MarketAuditSubjectRef::Version(version.version_ref.clone());
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
    let version_result = MarketVersionResult { receipt: receipt.clone(), version_ref: version.version_ref, listing_ref: version.listing_ref, source_binding: version.source_binding, application_ref: version.application_ref, state: version.state, decision_binding: version.decision_binding, disposition_ref: version.disposition_ref, revision: saved.revision };
    let result = WithdrawalResult { receipt, version: version_result, disposition: WithdrawalDispositionSnapshot { disposition_ref: disposition.disposition_ref, version_ref: disposition.version_ref, authority_ref: disposition.authority_ref, action: disposition.action, reason_ref: disposition.reason_ref, source_cursor: disposition.source_cursor }, impact_ref: impact.impact_ref, coverage_kind: impact.coverage_kind };
    Ok((MarketResultSurface::Withdrawal(result), audit, works))
}.await;
match outcome {
    Err(error) => { uow.rollback(tx).await?; Err(error) },
    Ok((surface, audit, works)) => {
        // [CommandRunner.finish: work+plan -> audit -> complete original result -> operation -> commit]
        let execution = commands.finish(tx, reserved, surface, audit, works).await?;
        support.public_result(execution, |s| match s { MarketResultSurface::Withdrawal(v) => Ok(v), _ => Err(support.error(ErrorCode::IntegrityFailure)) })
    },
}
```

#### 输入构造与条件来源

| 符号 / 参数 | 唯一来源 | missing / binding / 保持规则 |
|---|---|---|
| body | RestrictMarketVersionRequest完整schema | HLD Qualified输入只是内侧构造，不信client approved/verified |
| source_candidates/requested_scope | 本DTO source_candidate或draft_spec.source_candidate/target.scope_ref、Bind requested_scope；无该字段时empty/None | 正式ScopeResolver.resolve重新裁剪，不从opaqueparse；taxonomyCreate明确requested_scope |
| readonly本体 | 上述load返回完整Versioned或immutablebasis | Missing拒绝；mutablefresh在writeTx重读、CAS和fixedbasis/subject相等 |
| formal qualified变量 | let authority = publisher_port.authorize_operation(MarketOperationKind::RestrictMarketVersion, MarketAuditSubjectRef::Version(body.version_ref.clone()), prepared.scope.read_context.clone()).await?; | fields逐schema full复制；consumer_contract取不到blocked，不自造true |
| bases | currentScope.authority_basis + 当次formal source/material/Gov/receiver/disposition/notice safe refs | 同kind typedtoken通过FlowSupport.basis复制；缺正式proof不形成allow/approval |
| window | reserved.cursor固定upper+validatedbatchlimit | 只durable内部scan，不是Querypage；需要所有页时durablecontinuation，不首page冒全量 |
| result/receipt | above完整familyliteral，IDs/revision取actualstaged save/readback | originalfulltyped result同Tx，replay不再生成/更新 |

#### Tx、状态与副作用inventory

| 项 | 本flow边界 |
|---|---|
| accepted局部变化 | Restricted version+immutable disposition+Partialimpact+durableimpactwork同UoW；不等待通知/审计外部接纳，不撤销已issued permission的外部effect |
| 同UoW必写 | typed owningfacts + qualification/disposition sidecar（如适用）+ Corecontext + audit + 完整WithdrawalResult + Operation Completed + 必要work/plan |
| external effect | 无Command直接dispatch；fresh external调用仅formalread/qualification，业务write effect由durableJob |
| projection | 只安排必要typed derivedwork；不命令伪改Fresh；read发现cursor落后degraded，Rebuild正式推进 |
| failure | malformed/notvisible/diffintent/缺ref/不匹配/非法state/CAS→safe错误与全部rollback；commitUnknown key-read正式resolve，不blind freshretry |
| replay | 当前authority/disclosure先核；同key+fingerprint读原完整payload，不业务precheck/ID/Clock/method/save/dispatch |

#### 测试切口与停审

planned restrict_market_version: freshaccepted、samekeyoriginalreplay（副作用0）、changedintentconflict、scopehide、missing/unsafe/candidatewrongkind、每save后故障rollback、CASrace，以及“Restricted version+immutable disposition+Partialimpact+durableimpactwork同UoW；不等待通知/审计外部接纳，不撤销已issued permission的外部effect”特有状态/binding/竞态。文档小循环检查DTO、完整method/port调用、result与副作用；不造测试run/evidence。下一flow仅在本flow规则已列后展开。


### WithdrawMarketVersionFlow

#### 入口与目标

`pub async fn withdraw_market_version(&self, request: CommandEnvelope<WithdrawMarketVersionRequest>) -> Result<ExecutionResult<WithdrawalResult>, MarketError>`；planned withdrawal_notice/withdraw_market_version.rs。目标：Disposition.record+Version.withdraw+Impact.start / versionserialize。只允许Step6方法、Step7 typedports/[application callables](03_ddd_step_07_application_callables.md)，不能调用未定义业务builder。

#### 函数级ASCII调用图

```text
[API withdraw_market_version typedRequest]
  | call CommandRunner.prepare(current scope -> fullresult replay)
  v
[fresh readonly local facts -> external formal prechecks; no write Tx]
  | tx begin ReadWrite -> reserve under operation-key lock
  v
[MarketVersion factory/member + typed guard]
  | save Withdrawn version+immutable disposition+Partialimpact+durableimpactwork同UoW；不等待通知/审计外部接纳，不撤销已issued permission的外部effect
  v
[work/plan + audit + StoredResult + Operation.complete]
  | commit -> KnownCommitted / Unknown-key-resolution
  v
[original typed WithdrawalResult]
```

#### Rust风格伪代码

```rust
let source_candidates: Vec<SourceVerificationTarget> = vec![];
let requested_scope: Option<MarketScopeRef> = None;
// [CommandRunner.prepare(CommandEnvelope request, MarketOperationKind kind, typed subjects, candidates, requested_scope)]
let subjects = vec![MarketAuditSubjectRef::Version(request.body.version_ref.clone())];
let start = commands.prepare(request, MarketOperationKind::WithdrawMarketVersion, subjects, source_candidates, requested_scope).await?;
let prepared = match start {
    CommandStart::Fresh(p) => p,
    CommandStart::Replayed(stored) => return match stored.safe_result { MarketResultSurface::Withdrawal(value) => Ok(ExecutionResult { value, disposition: ReplayDisposition::OriginalReplayed }), _ => Err(support.error(ErrorCode::IntegrityFailure)) },
};
let body: WithdrawMarketVersionRequest = prepared.body.clone();
// [UnitOfWork.begin(UowMode::ReadOnly)]
let mut reads = uow.begin(UowMode::ReadOnly).await?;
let local_read = async {
let version_row = support.require(store.load_version(&mut reads, body.version_ref.clone()).await?)?;
Ok((version_row,))
}.await;
// [UnitOfWork.rollback(readonly tx)]
uow.rollback(reads).await?;
let (version_row,) = local_read?;

// [formal owner ports / FreshGate.publication or admission; outside SQL tx]
let authority = publisher_port.authorize_operation(MarketOperationKind::WithdrawMarketVersion, MarketAuditSubjectRef::Version(body.version_ref.clone()), prepared.scope.read_context.clone()).await?;
// [UnitOfWork.begin(UowMode::ReadWrite)]
let mut tx = uow.begin(UowMode::ReadWrite).await?;
// [CommandRunner.reserve(tx, prepared): lock key -> replay race / fresh ids]
let reserved = match commands.reserve(&mut tx, &prepared).await {
    Ok(ReservationOutcome::Fresh(r)) => r,
    Ok(ReservationOutcome::Replayed(stored)) => {
        uow.rollback(tx).await?;
        return match stored.safe_result {
            MarketResultSurface::Withdrawal(value) => Ok(ExecutionResult { value, disposition: ReplayDisposition::OriginalReplayed }),
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
    // [MarketVersion factory/member; typed owner input construction]
    uow.lock_version(&mut tx, body.version_ref.clone()).await?;
    let loaded = support.require(store.load_version(&mut tx, body.version_ref.clone()).await?)?;
    support.expect_revision(loaded.revision, body.expected_revision)?;
    let disposition = WithdrawalDisposition::record(QualifiedDispositionInput { disposition_ref: ids.new_withdrawal_disposition_ref(), version_ref: body.version_ref.clone(), authority_ref: support.require(authority.disposition_ref)?, action: MarketDispositionKind::Withdraw, reason_ref: body.reason_ref.clone(), source_cursor: reserved.cursor })?;
    let mut version = loaded.value;
    version.withdraw(VersionWithdrawalInput { disposition_ref: disposition.disposition_ref.clone(), authority_ref: disposition.authority_ref.clone() })?;
    let impact = ImpactRecord::start(ImpactEnumerationInput { impact_ref: ids.new_impact_record_ref(), disposition_ref: disposition.disposition_ref.clone(), coverage_cursor: reserved.cursor })?;
    store.append_disposition(&mut tx, disposition.clone()).await?;
    let saved = store.save_version(&mut tx, version.clone(), ExpectedMarketRevision::Exact(loaded.revision)).await?;
    store.save_impact(&mut tx, impact.clone(), ExpectedMarketRevision::MustNotExist).await?;
    let local_work_ref = ids.new_deferred_work_ref();
    works.push(support.schedule(&reserved, Some(local_work_ref.clone()), MarketWorkTargetRef::Impact(impact.impact_ref.clone()), MarketEffectIntentRef::LocalWork(local_work_ref), MarketOperationKind::EnumerateKnownImpact, prepared.scope.read_context.scope_ref.clone(), Some(window.clone()), None, vec![])?);
    let subject = MarketAuditSubjectRef::Version(version.version_ref.clone());
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
    let version_result = MarketVersionResult { receipt: receipt.clone(), version_ref: version.version_ref, listing_ref: version.listing_ref, source_binding: version.source_binding, application_ref: version.application_ref, state: version.state, decision_binding: version.decision_binding, disposition_ref: version.disposition_ref, revision: saved.revision };
    let result = WithdrawalResult { receipt, version: version_result, disposition: WithdrawalDispositionSnapshot { disposition_ref: disposition.disposition_ref, version_ref: disposition.version_ref, authority_ref: disposition.authority_ref, action: disposition.action, reason_ref: disposition.reason_ref, source_cursor: disposition.source_cursor }, impact_ref: impact.impact_ref, coverage_kind: impact.coverage_kind };
    Ok((MarketResultSurface::Withdrawal(result), audit, works))
}.await;
match outcome {
    Err(error) => { uow.rollback(tx).await?; Err(error) },
    Ok((surface, audit, works)) => {
        // [CommandRunner.finish: work+plan -> audit -> complete original result -> operation -> commit]
        let execution = commands.finish(tx, reserved, surface, audit, works).await?;
        support.public_result(execution, |s| match s { MarketResultSurface::Withdrawal(v) => Ok(v), _ => Err(support.error(ErrorCode::IntegrityFailure)) })
    },
}
```

#### 输入构造与条件来源

| 符号 / 参数 | 唯一来源 | missing / binding / 保持规则 |
|---|---|---|
| body | WithdrawMarketVersionRequest完整schema | HLD Qualified输入只是内侧构造，不信client approved/verified |
| source_candidates/requested_scope | 本DTO source_candidate或draft_spec.source_candidate/target.scope_ref、Bind requested_scope；无该字段时empty/None | 正式ScopeResolver.resolve重新裁剪，不从opaqueparse；taxonomyCreate明确requested_scope |
| readonly本体 | 上述load返回完整Versioned或immutablebasis | Missing拒绝；mutablefresh在writeTx重读、CAS和fixedbasis/subject相等 |
| formal qualified变量 | let authority = publisher_port.authorize_operation(MarketOperationKind::WithdrawMarketVersion, MarketAuditSubjectRef::Version(body.version_ref.clone()), prepared.scope.read_context.clone()).await?; | fields逐schema full复制；consumer_contract取不到blocked，不自造true |
| bases | currentScope.authority_basis + 当次formal source/material/Gov/receiver/disposition/notice safe refs | 同kind typedtoken通过FlowSupport.basis复制；缺正式proof不形成allow/approval |
| window | reserved.cursor固定upper+validatedbatchlimit | 只durable内部scan，不是Querypage；需要所有页时durablecontinuation，不首page冒全量 |
| result/receipt | above完整familyliteral，IDs/revision取actualstaged save/readback | originalfulltyped result同Tx，replay不再生成/更新 |

#### Tx、状态与副作用inventory

| 项 | 本flow边界 |
|---|---|
| accepted局部变化 | Withdrawn version+immutable disposition+Partialimpact+durableimpactwork同UoW；不等待通知/审计外部接纳，不撤销已issued permission的外部effect |
| 同UoW必写 | typed owningfacts + qualification/disposition sidecar（如适用）+ Corecontext + audit + 完整WithdrawalResult + Operation Completed + 必要work/plan |
| external effect | 无Command直接dispatch；fresh external调用仅formalread/qualification，业务write effect由durableJob |
| projection | 只安排必要typed derivedwork；不命令伪改Fresh；read发现cursor落后degraded，Rebuild正式推进 |
| failure | malformed/notvisible/diffintent/缺ref/不匹配/非法state/CAS→safe错误与全部rollback；commitUnknown key-read正式resolve，不blind freshretry |
| replay | 当前authority/disclosure先核；同key+fingerprint读原完整payload，不业务precheck/ID/Clock/method/save/dispatch |

#### 测试切口与停审

planned withdraw_market_version: freshaccepted、samekeyoriginalreplay（副作用0）、changedintentconflict、scopehide、missing/unsafe/candidatewrongkind、每save后故障rollback、CASrace，以及“Withdrawn version+immutable disposition+Partialimpact+durableimpactwork同UoW；不等待通知/审计外部接纳，不撤销已issued permission的外部effect”特有状态/binding/竞态。文档小循环检查DTO、完整method/port调用、result与副作用；不造测试run/evidence。下一flow仅在本flow规则已列后展开。


### PlanImpactNotificationsFlow

#### 入口与目标

`pub async fn plan_impact_notifications(&self, request: CommandEnvelope<PlanImpactNotificationsRequest>) -> Result<ExecutionResult<NoticePlanResult>, MarketError>`；planned withdrawal_notice/plan_impact_notifications.rs。目标：formaltarget/channel→NoticeIntent.prepare + unique dedup / knownimpact。只允许Step6方法、Step7 typedports/[application callables](03_ddd_step_07_application_callables.md)，不能调用未定义业务builder。

#### 函数级ASCII调用图

```text
[API plan_impact_notifications typedRequest]
  | call CommandRunner.prepare(current scope -> fullresult replay)
  v
[fresh readonly local facts -> external formal prechecks; no write Tx]
  | tx begin ReadWrite -> reserve under operation-key lock
  v
[NoticeIntent factory/member + typed guard]
  | save known受影响target核验+uniqueNoticePrepared与durablework；不调用channel dispatch
  v
[work/plan + audit + StoredResult + Operation.complete]
  | commit -> KnownCommitted / Unknown-key-resolution
  v
[original typed NoticePlanResult]
```

#### Rust风格伪代码

```rust
let source_candidates: Vec<SourceVerificationTarget> = vec![];
let requested_scope: Option<MarketScopeRef> = None;
// [CommandRunner.prepare(CommandEnvelope request, MarketOperationKind kind, typed subjects, candidates, requested_scope)]
let subjects = vec![MarketAuditSubjectRef::Impact(request.body.impact_ref.clone())];
let start = commands.prepare(request, MarketOperationKind::PlanImpactNotifications, subjects, source_candidates, requested_scope).await?;
let prepared = match start {
    CommandStart::Fresh(p) => p,
    CommandStart::Replayed(stored) => return match stored.safe_result { MarketResultSurface::NoticePlan(value) => Ok(ExecutionResult { value, disposition: ReplayDisposition::OriginalReplayed }), _ => Err(support.error(ErrorCode::IntegrityFailure)) },
};
let body: PlanImpactNotificationsRequest = prepared.body.clone();
// [UnitOfWork.begin(UowMode::ReadOnly)]
let mut reads = uow.begin(UowMode::ReadOnly).await?;
let local_read = async {
let impact_row = support.require(store.load_impact(&mut reads, body.impact_ref.clone()).await?)?;
Ok((impact_row,))
}.await;
// [UnitOfWork.rollback(readonly tx)]
uow.rollback(reads).await?;
let (impact_row,) = local_read?;

// [formal owner ports / FreshGate.publication or admission; outside SQL tx]
let mut resolved_targets = vec![];
for candidate in &body.targets { resolved_targets.push(notice_port.resolve_notice(body.impact_ref.clone(), candidate.clone(), prepared.scope.read_context.clone()).await?); }
// [UnitOfWork.begin(UowMode::ReadWrite)]
let mut tx = uow.begin(UowMode::ReadWrite).await?;
// [CommandRunner.reserve(tx, prepared): lock key -> replay race / fresh ids]
let reserved = match commands.reserve(&mut tx, &prepared).await {
    Ok(ReservationOutcome::Fresh(r)) => r,
    Ok(ReservationOutcome::Replayed(stored)) => {
        uow.rollback(tx).await?;
        return match stored.safe_result {
            MarketResultSurface::NoticePlan(value) => Ok(ExecutionResult { value, disposition: ReplayDisposition::OriginalReplayed }),
            _ => Err(support.error(ErrorCode::IntegrityFailure)),
        };
    },
    Err(error) => { uow.rollback(tx).await?; return Err(error); },
};
let outcome = async {
    let mut works: Vec<PlannedResponsibility> = vec![];
    let mut bases: SafeBasisReferenceSet = prepared.scope.authority_basis.clone();
    for target in &resolved_targets { bases.extend(target.basis_refs.clone()); }
    let window = support.bounded_window(reserved.cursor, None)?;
    // [NoticeIntent factory/member; typed owner input construction]
    let impact = support.require(store.load_impact(&mut tx, body.impact_ref.clone()).await?)?.value;
    let mut notice_refs = vec![];
    let mut duplicate_notice_refs = vec![];
    for target in resolved_targets {
        if let Some(old) = store.find_notice(&mut tx, impact.impact_ref.clone(), target.target_ref.clone(), target.channel_ref.clone(), target.scope_ref.clone()).await? { duplicate_notice_refs.push(old.value.notice_ref); continue; }
        let notice = NoticeIntent::prepare(QualifiedNoticePlanInput { notice_ref: ids.new_notice_intent_ref(), impact_ref: impact.impact_ref.clone(), target_ref: target.target_ref, channel_ref: target.channel_ref, scope_ref: target.scope_ref })?;
        store.save_notice(&mut tx, notice.clone(), ExpectedMarketRevision::MustNotExist).await?;
        notice_refs.push(notice.notice_ref.clone());
        works.push(support.schedule(&reserved, None, MarketWorkTargetRef::Notice(notice.notice_ref.clone()), MarketEffectIntentRef::Notice(notice.notice_ref), MarketOperationKind::DispatchNotice, notice.scope_ref, None, None, vec![])?);
    }
    let subject = MarketAuditSubjectRef::Impact(impact.impact_ref.clone());
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
    let result = NoticePlanResult { receipt, impact_ref: impact.impact_ref, notice_refs, duplicate_notice_refs };
    Ok((MarketResultSurface::NoticePlan(result), audit, works))
}.await;
match outcome {
    Err(error) => { uow.rollback(tx).await?; Err(error) },
    Ok((surface, audit, works)) => {
        // [CommandRunner.finish: work+plan -> audit -> complete original result -> operation -> commit]
        let execution = commands.finish(tx, reserved, surface, audit, works).await?;
        support.public_result(execution, |s| match s { MarketResultSurface::NoticePlan(v) => Ok(v), _ => Err(support.error(ErrorCode::IntegrityFailure)) })
    },
}
```

#### 输入构造与条件来源

| 符号 / 参数 | 唯一来源 | missing / binding / 保持规则 |
|---|---|---|
| body | PlanImpactNotificationsRequest完整schema | HLD Qualified输入只是内侧构造，不信client approved/verified |
| source_candidates/requested_scope | 本DTO source_candidate或draft_spec.source_candidate/target.scope_ref、Bind requested_scope；无该字段时empty/None | 正式ScopeResolver.resolve重新裁剪，不从opaqueparse；taxonomyCreate明确requested_scope |
| readonly本体 | 上述load返回完整Versioned或immutablebasis | Missing拒绝；mutablefresh在writeTx重读、CAS和fixedbasis/subject相等 |
| formal qualified变量 | let mut resolved_targets = vec![]; <br> for candidate in &body.targets { resolved_targets.push(notice_port.resolve_notice(body.impact_ref.clone(), candidate.clone(), prepared.scope.read_context.clone()).await?); } | fields逐schema full复制；consumer_contract取不到blocked，不自造true |
| bases | currentScope.authority_basis + 当次formal source/material/Gov/receiver/disposition/notice safe refs | 同kind typedtoken通过FlowSupport.basis复制；缺正式proof不形成allow/approval |
| window | reserved.cursor固定upper+validatedbatchlimit | 只durable内部scan，不是Querypage；需要所有页时durablecontinuation，不首page冒全量 |
| result/receipt | above完整familyliteral，IDs/revision取actualstaged save/readback | originalfulltyped result同Tx，replay不再生成/更新 |

#### Tx、状态与副作用inventory

| 项 | 本flow边界 |
|---|---|
| accepted局部变化 | known受影响target核验+uniqueNoticePrepared与durablework；不调用channel dispatch |
| 同UoW必写 | typed owningfacts + qualification/disposition sidecar（如适用）+ Corecontext + audit + 完整NoticePlanResult + Operation Completed + 必要work/plan |
| external effect | 无Command直接dispatch；fresh external调用仅formalread/qualification，业务write effect由durableJob |
| projection | 只安排必要typed derivedwork；不命令伪改Fresh；read发现cursor落后degraded，Rebuild正式推进 |
| failure | malformed/notvisible/diffintent/缺ref/不匹配/非法state/CAS→safe错误与全部rollback；commitUnknown key-read正式resolve，不blind freshretry |
| replay | 当前authority/disclosure先核；同key+fingerprint读原完整payload，不业务precheck/ID/Clock/method/save/dispatch |

#### 测试切口与停审

planned plan_impact_notifications: freshaccepted、samekeyoriginalreplay（副作用0）、changedintentconflict、scopehide、missing/unsafe/candidatewrongkind、每save后故障rollback、CASrace，以及“known受影响target核验+uniqueNoticePrepared与durablework；不调用channel dispatch”特有状态/binding/竞态。文档小循环检查DTO、完整method/port调用、result与副作用；不造测试run/evidence。下一flow仅在本flow规则已列后展开。


### RecordNoticeOutcomeFlow

#### 入口与目标

`pub async fn record_notice_outcome(&self, request: CommandEnvelope<RecordNoticeOutcomeRequest>) -> Result<ExecutionResult<NoticeResult>, MarketError>`；planned withdrawal_notice/record_notice_outcome.rs。目标：formalchannelprobe/matching + NoticeIntent.settle，不推送达。只允许Step6方法、Step7 typedports/[application callables](03_ddd_step_07_application_callables.md)，不能调用未定义业务builder。

#### 函数级ASCII调用图

```text
[API record_notice_outcome typedRequest]
  | call CommandRunner.prepare(current scope -> fullresult replay)
  v
[fresh readonly local facts -> external formal prechecks; no write Tx]
  | tx begin ReadWrite -> reserve under operation-key lock
  v
[NoticeIntent factory/member + typed guard]
  | save formalnoticebinding与state，不把ACK或Confirmed显示为已送达/已读
  v
[work/plan + audit + StoredResult + Operation.complete]
  | commit -> KnownCommitted / Unknown-key-resolution
  v
[original typed NoticeResult]
```

#### Rust风格伪代码

```rust
let source_candidates: Vec<SourceVerificationTarget> = vec![];
let requested_scope: Option<MarketScopeRef> = None;
// [CommandRunner.prepare(CommandEnvelope request, MarketOperationKind kind, typed subjects, candidates, requested_scope)]
let subjects = vec![MarketAuditSubjectRef::Notice(request.body.notice_ref.clone())];
let start = commands.prepare(request, MarketOperationKind::RecordNoticeOutcome, subjects, source_candidates, requested_scope).await?;
let prepared = match start {
    CommandStart::Fresh(p) => p,
    CommandStart::Replayed(stored) => return match stored.safe_result { MarketResultSurface::Notice(value) => Ok(ExecutionResult { value, disposition: ReplayDisposition::OriginalReplayed }), _ => Err(support.error(ErrorCode::IntegrityFailure)) },
};
let body: RecordNoticeOutcomeRequest = prepared.body.clone();
// [UnitOfWork.begin(UowMode::ReadOnly)]
let mut reads = uow.begin(UowMode::ReadOnly).await?;
let local_read = async {
let notice_row = support.require(store.load_notice(&mut reads, body.notice_ref.clone()).await?)?;
let original_notice_permission = support.require(work_store.get_permission(&mut reads, MarketWorkTargetRef::Notice(body.notice_ref.clone()), support.require(notice_row.value.dispatch_fence.clone())?).await?)?;
Ok((notice_row, original_notice_permission))
}.await;
// [UnitOfWork.rollback(readonly tx)]
uow.rollback(reads).await?;
let (notice_row, original_notice_permission) = local_read?;

// [formal owner ports / FreshGate.publication or admission; outside SQL tx]
let original_permission = original_notice_permission;
let formal = notice_port.probe_notice(NoticeExternalInput { notice_ref: notice_row.value.notice_ref.clone(), impact_ref: notice_row.value.impact_ref.clone(), target_ref: notice_row.value.target_ref.clone(), channel_ref: notice_row.value.channel_ref.clone(), scope_ref: notice_row.value.scope_ref.clone(), permission: original_permission }).await?;
support.assert_binding(matches!(&formal.outcome, NoticeOutcomeInput::Confirmed(_)))?;
support.assert_binding(support.require(formal.binding.clone())?.outcome_ref == body.outcome_candidate)?;
// [UnitOfWork.begin(UowMode::ReadWrite)]
let mut tx = uow.begin(UowMode::ReadWrite).await?;
// [CommandRunner.reserve(tx, prepared): lock key -> replay race / fresh ids]
let reserved = match commands.reserve(&mut tx, &prepared).await {
    Ok(ReservationOutcome::Fresh(r)) => r,
    Ok(ReservationOutcome::Replayed(stored)) => {
        uow.rollback(tx).await?;
        return match stored.safe_result {
            MarketResultSurface::Notice(value) => Ok(ExecutionResult { value, disposition: ReplayDisposition::OriginalReplayed }),
            _ => Err(support.error(ErrorCode::IntegrityFailure)),
        };
    },
    Err(error) => { uow.rollback(tx).await?; return Err(error); },
};
let outcome = async {
    let mut works: Vec<PlannedResponsibility> = vec![];
    let mut bases: SafeBasisReferenceSet = prepared.scope.authority_basis.clone();
    bases.push(support.basis(SafeBasisKind::Notice, support.require(formal.binding.clone())?.outcome_ref.token.clone())?);
    let window = support.bounded_window(reserved.cursor, None)?;
    // [NoticeIntent factory/member; typed owner input construction]
    let loaded = support.require(store.load_notice(&mut tx, body.notice_ref.clone()).await?)?;
    let mut notice = loaded.value;
    let binding = NoticeOutcomeBinding::from_channel(support.require(formal.binding)?)?;
    support.assert_binding(binding.matches(NoticeOutcomeContext { notice_ref: notice.notice_ref.clone(), target_ref: notice.target_ref.clone(), channel_ref: notice.channel_ref.clone(), scope_ref: notice.scope_ref.clone() }))?;
    support.assert_binding(matches!(&formal.outcome, NoticeOutcomeInput::Confirmed(value) if value == &binding))?;
    notice.settle(formal.outcome)?;
    store.save_notice(&mut tx, notice.clone(), ExpectedMarketRevision::Exact(loaded.revision)).await?;
    let subject = MarketAuditSubjectRef::Notice(notice.notice_ref.clone());
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
    let result = NoticeResult { receipt, notice_ref: notice.notice_ref, state: notice.state, outcome_binding: notice.outcome_binding, failure_ref: notice.failure_ref };
    Ok((MarketResultSurface::Notice(result), audit, works))
}.await;
match outcome {
    Err(error) => { uow.rollback(tx).await?; Err(error) },
    Ok((surface, audit, works)) => {
        // [CommandRunner.finish: work+plan -> audit -> complete original result -> operation -> commit]
        let execution = commands.finish(tx, reserved, surface, audit, works).await?;
        support.public_result(execution, |s| match s { MarketResultSurface::Notice(v) => Ok(v), _ => Err(support.error(ErrorCode::IntegrityFailure)) })
    },
}
```

#### 输入构造与条件来源

| 符号 / 参数 | 唯一来源 | missing / binding / 保持规则 |
|---|---|---|
| body | RecordNoticeOutcomeRequest完整schema | HLD Qualified输入只是内侧构造，不信client approved/verified |
| source_candidates/requested_scope | 本DTO source_candidate或draft_spec.source_candidate/target.scope_ref、Bind requested_scope；无该字段时empty/None | 正式ScopeResolver.resolve重新裁剪，不从opaqueparse；taxonomyCreate明确requested_scope |
| readonly本体 | 上述load返回完整Versioned或immutablebasis | Missing拒绝；mutablefresh在writeTx重读、CAS和fixedbasis/subject相等 |
| formal qualified变量 | let original_permission = original_notice_permission; <br> let formal = notice_port.probe_notice(NoticeExternalInput { notice_ref: notice_row.value.notice_ref.clone(), impact_ref: notice_row.value.impact_ref.clone(), target_ref: notice_row.value.target_ref.clone(), channel_ref: notice_row.value.channel_ref.clone(), scope_ref: notice_row.value.scope_ref.clone(), permission: original_permission }).await?; <br> support.assert_binding(support.require(formal.binding.clone())?.outcome_ref == body.outcome_candidate)?; | fields逐schema full复制；consumer_contract取不到blocked，不自造true |
| bases | currentScope.authority_basis + 当次formal source/material/Gov/receiver/disposition/notice safe refs | 同kind typedtoken通过FlowSupport.basis复制；缺正式proof不形成allow/approval |
| window | reserved.cursor固定upper+validatedbatchlimit | 只durable内部scan，不是Querypage；需要所有页时durablecontinuation，不首page冒全量 |
| result/receipt | above完整familyliteral，IDs/revision取actualstaged save/readback | originalfulltyped result同Tx，replay不再生成/更新 |

#### Tx、状态与副作用inventory

| 项 | 本flow边界 |
|---|---|
| accepted局部变化 | formalnoticebinding与state，不把ACK或Confirmed显示为已送达/已读 |
| 同UoW必写 | typed owningfacts + qualification/disposition sidecar（如适用）+ Corecontext + audit + 完整NoticeResult + Operation Completed + 必要work/plan |
| external effect | 无Command直接dispatch；fresh external调用仅formalread/qualification，业务write effect由durableJob |
| projection | 只安排必要typed derivedwork；不命令伪改Fresh；read发现cursor落后degraded，Rebuild正式推进 |
| failure | malformed/notvisible/diffintent/缺ref/不匹配/非法state/CAS→safe错误与全部rollback；commitUnknown key-read正式resolve，不blind freshretry |
| replay | 当前authority/disclosure先核；同key+fingerprint读原完整payload，不业务precheck/ID/Clock/method/save/dispatch |

#### 测试切口与停审

planned record_notice_outcome: freshaccepted、samekeyoriginalreplay（副作用0）、changedintentconflict、scopehide、missing/unsafe/candidatewrongkind、每save后故障rollback、CASrace，以及“formalnoticebinding与state，不把ACK或Confirmed显示为已送达/已读”特有状态/binding/竞态。文档小循环检查DTO、完整method/port调用、result与副作用；不造测试run/evidence。下一flow仅在本flow规则已列后展开。


### GetWithdrawalImpactFlow

#### 入口与目标

`pub async fn get_withdrawal_impact(&self, request: QueryEnvelope<GetWithdrawalImpactRequest>) -> Result<ReadSurface<ImpactNoticeReadModel>, MarketError>`；planned withdrawal_notice/get_withdrawal_impact.rs。目标：typedknownimpact/coverage/notice safe read，不全安装集合。只允许Step6方法、Step7 typedports/[application callables](03_ddd_step_07_application_callables.md)，不能调用未定义业务builder。

#### 函数级ASCII调用图

```text
[API get_withdrawal_impact QueryEnvelope]
  | call ReadFacade.authorize -> formal current scope/disclosure
  v
[ReadOnly Tx -> exact typed source pair / readonly formalowner read]
  | assemble ImpactNoticeReadModel; never save/reserve/dispatch/refresh
  v
[Ready / Empty / NotVisible / Missing / Degraded]
```

#### Rust风格伪代码

```rust
let source_candidates: Vec<SourceVerificationTarget> = vec![];
let requested_scope: Option<MarketScopeRef> = None;
// [ReadFacade.authorize(QueryEnvelope, typed subjects, source candidates, requested_scope)]
let scope = reads.authorize(&request, vec![MarketAuditSubjectRef::Disposition(request.body.disposition_ref.clone())], source_candidates, requested_scope).await?;
let body: GetWithdrawalImpactRequest = request.body.clone();
// [UnitOfWork.begin(UowMode::ReadOnly)]
let mut tx = uow.begin(UowMode::ReadOnly).await?;
let local_read = async {
    let cursor = uow.current_cursor(&mut tx).await?;
    let disposition = support.require(store.load_disposition(&mut tx, body.disposition_ref.clone()).await?)?;
    let impact = support.require(store.get_impact_by_disposition(&mut tx, disposition.disposition_ref.clone()).await?)?.value;
    let page = store.page_notices_by_impact(&mut tx, impact.impact_ref.clone(), PageReadContext { actor: request.actor.clone(), scope: scope.clone(), selector: MarketPageSelector::GetWithdrawalImpact }, support.require(request.meta.page.clone())?).await?;
    let view = ImpactNoticeView::assemble(ImpactNoticeReadInput { disposition_ref: disposition.disposition_ref, impact_ref: impact.impact_ref.clone(), notice_refs: page.items.iter().map(|v|v.value.notice_ref.clone()).collect(), read_context: scope.clone() })?;
    let notices = page.items.iter().map(|v|support.notice_item(v.value.clone())).collect();
    Ok((cursor, view, impact, notices, page.info))
}.await;
// [UnitOfWork.rollback(Tx readonly_tx)] before any per-reference formal resolver read.
uow.rollback(tx).await?;
let (cursor, view, impact, notices, info) = match local_read { Ok(v) => v, Err(error) => return reads.map_read_error(error) };
let mut visible_unknown_attempt_refs = vec![];
for reference in &impact.unknown_attempt_refs {
    // [ReadFacade.authorize(QueryEnvelope request, typed subjects, candidates, requested_scope)]
    match reads.authorize(&request, vec![MarketAuditSubjectRef::Attempt(reference.clone())], vec![], Some(scope.scope_ref.clone())).await {
        Ok(current) if current.scope_ref == scope.scope_ref => visible_unknown_attempt_refs.push(reference.clone()),
        Ok(_) => {},
        Err(error) if error.code == ErrorCode::NotVisible => {},
        Err(error) => return reads.map_read_error(error),
    }
}
let value = ImpactNoticeReadModel { view, coverage_kind: impact.coverage_kind, coverage_cursor: impact.coverage_cursor,
    unknown_attempt_refs: visible_unknown_attempt_refs, notices };
// [ReadFacade.ready(items, PageInfo info, ReadMarker marker)]
reads.ready(vec![value], info, support.ready_marker(None, cursor))
```

#### 读取、构造与失败来源

knownscope fixedcursor/partial明确，notice pages+safeunknown；不扫描external安装全集。所有free symbol是明确typedsource映射而不是builder占位：source_candidates/requested_scope按本Request字段或empty/None；state与readmodel字段逐原值copy；qualified_visible_summary只QualifiedSnapshotMaterial::Source且当前可见，缺可选摘要None不证明合格；typed_notice_read_items/attempt_snapshots按已声明纯函数逐字段copy；formal_saved_observation_binding从AuditStore.get_observation_binding读取；current_gap来自formal错误safe code，不生成owner扫描/支付结果。

ownerqualification分支gate_allows/formal_gate_basis/current_gap从当前正式结果及纯policyevaluate确定，Listed与未撤回/currentapproved/receiver必需。body.field缺失reject；scope不可证明NotVisible（不带ref/count/cursor）；typedsourceMissing只authorizedMissing；Stale/Rebuilding/Unavailable/Unsupported/Failed/Disabled走Degraded，no-query-write/no-cache-refresh。每个earlyreturn/error位于显式async Result作用域，退出后readonly rollback一次；formalprecheck先关闭本地读取事务再调用owner，不二次consume handle。

#### Tx与副作用 / 测试

localWrite/ID/Clock/operationreserve/audit/work/ownerwrite/event均0；只有当前formalread与typedReadonly访问。列表/详情/版本/数量/分页同currentvisibility交集，下一token只当前可见item的boundedCorepage；historychunk不冒称全量。测试：visible/empty/NotVisible/authorizedmissing、错误不echo、wrongscope/filtertoken、state/bodypair缺失、stale/rebuilding/unsupported、locale不改refs/key、Query全部writer计数0。单flow停审：typedDTO/source/model/marker与no-write边界已列，外部资格blocked不变。


### GetNoticeProgressFlow

#### 入口与目标

`pub async fn get_notice_progress(&self, request: QueryEnvelope<GetNoticeProgressRequest>) -> Result<ReadSurface<ImpactNoticeReadModel>, MarketError>`；planned withdrawal_notice/get_notice_progress.rs。目标：typednotice/outcome+impact+disposition currentdisclosure。只允许Step6方法、Step7 typedports/[application callables](03_ddd_step_07_application_callables.md)，不能调用未定义业务builder。

#### 函数级ASCII调用图

```text
[API get_notice_progress QueryEnvelope]
  | call ReadFacade.authorize -> formal current scope/disclosure
  v
[ReadOnly Tx -> exact typed source pair / readonly formalowner read]
  | assemble ImpactNoticeReadModel; never save/reserve/dispatch/refresh
  v
[Ready / Empty / NotVisible / Missing / Degraded]
```

#### Rust风格伪代码

```rust
let source_candidates: Vec<SourceVerificationTarget> = vec![];
let requested_scope: Option<MarketScopeRef> = None;
// [ReadFacade.authorize(QueryEnvelope, typed subjects, source candidates, requested_scope)]
let scope = reads.authorize(&request, vec![MarketAuditSubjectRef::Notice(request.body.notice_ref.clone())], source_candidates, requested_scope).await?;
let body: GetNoticeProgressRequest = request.body.clone();
// [UnitOfWork.begin(UowMode::ReadOnly)]
let mut tx = uow.begin(UowMode::ReadOnly).await?;
let local_read = async {
    let cursor = uow.current_cursor(&mut tx).await?;
    let notice = support.require(store.load_notice(&mut tx, body.notice_ref.clone()).await?)?.value;
    let impact = support.require(store.load_impact(&mut tx, notice.impact_ref.clone()).await?)?.value;
    let view = ImpactNoticeView::assemble(ImpactNoticeReadInput { disposition_ref: impact.disposition_ref.clone(), impact_ref: impact.impact_ref.clone(), notice_refs: vec![notice.notice_ref.clone()], read_context: scope.clone() })?;
    let notices = vec![support.notice_item(notice)];
    Ok((cursor, view, impact, notices, reads.detail_info(cursor)))
}.await;
// [UnitOfWork.rollback(Tx readonly_tx)] before any per-reference formal resolver read.
uow.rollback(tx).await?;
let (cursor, view, impact, notices, info) = match local_read { Ok(v) => v, Err(error) => return reads.map_read_error(error) };
let mut visible_unknown_attempt_refs = vec![];
for reference in &impact.unknown_attempt_refs {
    // [ReadFacade.authorize(QueryEnvelope request, typed subjects, candidates, requested_scope)]
    match reads.authorize(&request, vec![MarketAuditSubjectRef::Attempt(reference.clone())], vec![], Some(scope.scope_ref.clone())).await {
        Ok(current) if current.scope_ref == scope.scope_ref => visible_unknown_attempt_refs.push(reference.clone()),
        Ok(_) => {},
        Err(error) if error.code == ErrorCode::NotVisible => {},
        Err(error) => return reads.map_read_error(error),
    }
}
let value = ImpactNoticeReadModel { view, coverage_kind: impact.coverage_kind, coverage_cursor: impact.coverage_cursor,
    unknown_attempt_refs: visible_unknown_attempt_refs, notices };
// [ReadFacade.ready(items, PageInfo info, ReadMarker marker)]
reads.ready(vec![value], info, support.ready_marker(None, cursor))
```

#### 读取、构造与失败来源

typednoticeoutcome/impact，Confirmed不能推read/delivered，Query不dispatch。所有free symbol是明确typedsource映射而不是builder占位：source_candidates/requested_scope按本Request字段或empty/None；state与readmodel字段逐原值copy；qualified_visible_summary只QualifiedSnapshotMaterial::Source且当前可见，缺可选摘要None不证明合格；typed_notice_read_items/attempt_snapshots按已声明纯函数逐字段copy；formal_saved_observation_binding从AuditStore.get_observation_binding读取；current_gap来自formal错误safe code，不生成owner扫描/支付结果。

ownerqualification分支gate_allows/formal_gate_basis/current_gap从当前正式结果及纯policyevaluate确定，Listed与未撤回/currentapproved/receiver必需。body.field缺失reject；scope不可证明NotVisible（不带ref/count/cursor）；typedsourceMissing只authorizedMissing；Stale/Rebuilding/Unavailable/Unsupported/Failed/Disabled走Degraded，no-query-write/no-cache-refresh。每个earlyreturn/error位于显式async Result作用域，退出后readonly rollback一次；formalprecheck先关闭本地读取事务再调用owner，不二次consume handle。

#### Tx与副作用 / 测试

localWrite/ID/Clock/operationreserve/audit/work/ownerwrite/event均0；只有当前formalread与typedReadonly访问。列表/详情/版本/数量/分页同currentvisibility交集，下一token只当前可见item的boundedCorepage；historychunk不冒称全量。测试：visible/empty/NotVisible/authorizedmissing、错误不echo、wrongscope/filtertoken、state/bodypair缺失、stale/rebuilding/unsupported、locale不改refs/key、Query全部writer计数0。单flow停审：typedDTO/source/model/marker与no-write边界已列，外部资格blocked不变。



### EnumerateKnownImpactFlow

#### 思考、诊断与取舍

plan.targets中的Impact ref与disposition关联，scope当前复核；固定upper，只本地known relations/unknown attempts。联合流按(source_cursor, typedsubject)稳定顺序，无两个表共用after的漏读。终页完成还需前序链所有delta已同Tx保存，cursor来源committed序列。 不允许shared runner掩盖本Job对象动作。采用下列typed原请求链；不扩大ownertruth/事件/支付范围。

#### 入口与目标

`pub async fn enumerate_known_impact(&self, request: JobEnvelope<EnumerateKnownImpactRequest>) -> Result<ExecutionResult<ImpactEnumerationReport>, MarketError>`。planned application/withdrawal_notice/enumerate_known_impact.rs；协议见[Step8 U5](03_ddd_step_08_part_u5.md)，对象见[Step6 U5](03_ddd_step_06_part_u5.md)，port见[Step7](03_ddd_step_07_typed_ports.md)。完整控制流见[Job执行](03_ddd_step_09_job_execution.md)。

#### 函数级ASCII调用图

```text
[enumerate_known_impact: typed JobEnvelope]
  | call JobRunner.prepare -> current disclosure / full original replay
  v
[typed local reads -> formal precheck]
  | tx A: reserve / claim / checkpoint
  | commit A; unresolved commit stops before any effect
  v
[bounded typedrelations/unknown fixedcursor + Impact.include / durablecontinuation]
  | external outside write Tx; no blind retry
  v
[tx B: exact domain methods / versioned save / full report / audit / successors]
  | call JobRunner.finish -> commit -> original typed ImpactEnumerationReport
```

#### 关键伪代码与字段绑定

```rust
// [MarketStorePort.scan_known_impact(Tx tx, MarketVersionRef version_ref, ReadWindow window)]
let page = store.scan_known_impact(&mut tx_b, disposition.version_ref.clone(), fixed_window).await?;
let mut relation_refs = vec![];
let mut unknown_attempt_refs = vec![];
for item in page.items {
    match item {
        ImpactScanItem::Relation(row) => relation_refs.push(row.value.relation_ref),
        ImpactScanItem::UnknownAttempt(row) => unknown_attempt_refs.push(row.value.attempt_ref),
    }
}
// [ImpactRecord.include(ImpactDeltaInput delta)]
impact.include(ImpactDeltaInput { relation_refs, unknown_attempt_refs,
    coverage_cursor: page.upper, enumeration_complete: page.next_cursor.is_none() })?;
store.save_impact(&mut tx_b, impact, ExpectedMarketRevision::Exact(impact_revision)).await?;
// Some(page.next_cursor): same upper + exact after in durable continuation, not complete.
```

伪代码标注A/B插入点，不是独立实现。所有externalcall均在A的KnownCommitted后、B开始前。 条件分支严格以下表，成功分支代码不能套入负向/Unknown。

| 参数 / 符号 | 精确来源 / 约束 |
|---|---|
| body | EnumerateKnownImpactRequest: disposition_ref:WithdrawalDispositionRef; work_ref:DeferredWorkRef；无actor/key/trace第二authority |
| internal_request | InternalJobRequest::EnumerateKnownImpact(prepared.body.clone())；A immutablecheckpoint |
| owning rows/revision | load_disposition(body.disposition_ref) -> get_impact_by_disposition -> MarketStore.scan_known_impact(version_ref, fixed ReadWindow)返回同一稳定联合游标；Missing安全错误，scope不证明先NotVisible |
| input / outcome / *_context | ImpactDeltaInput { relation_refs: items Relation refs, unknown_attempt_refs: items UnknownAttempt refs, coverage_cursor: fixed upper, enumeration_complete: union scan next_cursor None且已提交连续前序页 }; 下页完整RepositoryCursor保存在子plan.window.after |
| bases / inspection / qualified_* | 当次正式typedport输出精确匹配；local maintenance只local committedfactrefs；缺formalproof为Unknown/Blocked而不是填true/ref |
| subject/target/effectintent | committedwork.plan typedtarget，经FlowSupport.subject_for_target；不能parse opaque。原外部intent不随Joboperation或newfence改变 |
| items/successors/report | 每target JobItemResult完整target/outcome/bases/gap/effectintent/cursor；Job执行§Report逐字段，实际sameB workIDs，不由projection重建 |

#### 事务、错误与状态副作用

| 分支 | 精确行为 |
|---|---|
| 正向/负向/Unknown | Partial→KnownScopeComplete只固定cursor knownscope联合流完整；下一页用完整RepositoryCursor生成durable子plan，当前report标Partial；late高cursor增量让KnownScopeComplete→Partial；不可并行乱序完成同一枚举链。 |
| 本地副作用 | Impact去重集合、明确coverage、fullreport/audit及scan continuation；通知计划仍PlanImpactNotifications明确formal target/channel，不凭consumer猜目标。 |
| A失败 / A commit未知 | rollback A；或originalkey/checkpoint/permission只读resolve；未证实A提交不externalcall |
| 外部timeout/ACK / B失败 | 不等NotCommitted；A仍持有恢复责任。B rollback不撤销外效应；原intentprobe，不重新dispatch |
| binding / CAS / fence失败 | BindingMismatch/VersionConflict/FenceMismatch；rollback本B，不丢旧effect；lateformal结果新授权Reconcile承担 |
| ownercontract缺口 | ContractBlocked/Unsupported/Unavailable带safegap；no phantom body/outcome/approval；未许可可block，已许可unknown只probe |
| replay | currentactor/disclosure+samekey+fingerprint→完整原ImpactEnumerationReport；0新ID/claim/gate/effect/scan/work；Reserved不冒充Completed |
| event / ownertruth | 0event/outbox/支付/Archive；不复制资产body，局部Confirmed不approval/evidence/readiness |

#### 测试切口与单flow停审

planned：联合源游标tie-break、相同序列不同typedsubject、空合法终页、missing store非empty、late增量、分页崩溃、不推全安装覆盖；另覆盖完整report全字段重放、changedintent冲突、current披露收缩、每writepoint rollback与A/Bcommit未知、缺checkpoint/plan、lease过期probe-only、每itemgap保留。这里只设计静态检查，不宣称run。

| 审查项 | 结论 |
|---|---|
| DTO→factory/member→typedport | 明确上述来源；外部exact consumerqualification保持blocked，不凭candidate名称声称owner支持 |
| Tx/副作用/原报告 | A许可/原checkpoint与B完整结果分别原子；必要successor同B；0长SQL跨effect |
| 状态/测试 | 对应14carrier；Step10核对全部statepairs；本flow不新增全局state |
| 范围停审 | 文档内flow已展开，后续编译/集成须实现期真实证据；未执行测试/commit |



### DispatchNoticeFlow

#### 思考、诊断与取舍

Prepared或正式notcommitted/currentgate允许的Failed/Blocked；Unknown/Dispatching只probe；NoticeChannel正式资格，当前scope/knownimpact，许可同claim A，不使用scan/ACK。 不允许shared runner掩盖本Job对象动作。采用下列typed原请求链；不扩大ownertruth/事件/支付范围。

#### 入口与目标

`pub async fn dispatch_notice(&self, request: JobEnvelope<DispatchNoticeRequest>) -> Result<ExecutionResult<NoticeJobReport>, MarketError>`。planned application/withdrawal_notice/dispatch_notice.rs；协议见[Step8 U5](03_ddd_step_08_part_u5.md)，对象见[Step6 U5](03_ddd_step_06_part_u5.md)，port见[Step7](03_ddd_step_07_typed_ports.md)。完整控制流见[Job执行](03_ddd_step_09_job_execution.md)。

#### 函数级ASCII调用图

```text
[dispatch_notice: typed JobEnvelope]
  | call JobRunner.prepare -> current disclosure / full original replay
  v
[typed local reads -> formal precheck]
  | tx A: reserve / claim / checkpoint / permission
  | commit A; unresolved commit stops before any effect
  v
[Notice.begin after formalgate + permission→channelcall]
  | external outside write Tx; no blind retry
  v
[tx B: exact domain methods / versioned save / full report / audit / successors]
  | call JobRunner.finish -> commit -> original typed NoticeJobReport
```

#### 关键伪代码与字段绑定

```rust
// [NoticeChannelPort.qualify_notice(QualifiedNoticePlanInput input, SafeReadContext scope)]
let qualified = notice_port.qualify_notice(plan_input, scope.clone()).await?;
let notice_contract = notice_port.consumer_contract()?;
bases.push(support.basis(SafeBasisKind::Notice, notice_contract.token)?);
let permission = support.permission(&reserved, &work.value, None, bases.clone());
// [NoticeIntent.begin(NoticeDispatchInput input)]
notice.begin(NoticeDispatchInput { permission: permission.clone() })?;
store.save_notice(&mut tx_a, notice, ExpectedMarketRevision::Exact(notice_revision)).await?;
work_store.append_permission(&mut tx_a, permission).await?;
// Commit A before channel effect.
// [NoticeChannelPort.dispatch_notice(NoticeExternalInput input)]
let formal = notice_port.dispatch_notice(input).await;
// Tx B reload exact notice; Confirmed binding.matches original NoticeOutcomeContext.
// [NoticeIntent.settle(NoticeOutcomeInput input)]
notice.settle(outcome)?;
store.save_notice(&mut tx_b, notice, ExpectedMarketRevision::Exact(notice_revision)).await?;
```

伪代码标注A/B插入点，不是独立实现。所有externalcall均在A的KnownCommitted后、B开始前。 条件分支严格以下表，成功分支代码不能套入负向/Unknown。

| 参数 / 符号 | 精确来源 / 约束 |
|---|---|
| body | DispatchNoticeRequest: notice_ref:NoticeIntentRef; work_ref:DeferredWorkRef；无actor/key/trace第二authority |
| internal_request | InternalJobRequest::DispatchNotice(prepared.body.clone())；A immutablecheckpoint |
| owning rows/revision | load_notice(body.notice_ref) -> load_impact(notice.impact_ref)；原work/plan/checkpoint；qualify_notice exact原notice/target/channel/scope；Missing安全错误，scope不证明先NotVisible |
| input / outcome / *_context | NoticeExternalInput所有六字段由原notice+原impact+committed permission；QualifiedNoticePlanInput五字段从原notice（不新noticeid） |
| bases / inspection / qualified_* | 当次正式typedport输出精确匹配；local maintenance只local committedfactrefs；缺formalproof为Unknown/Blocked而不是填true/ref |
| subject/target/effectintent | committedwork.plan typedtarget，经FlowSupport.subject_for_target；不能parse opaque。原外部intent不随Joboperation或newfence改变 |
| items/successors/report | 每target JobItemResult完整target/outcome/bases/gap/effectintent/cursor；Job执行§Report逐字段，实际sameB workIDs，不由projection重建 |

#### 事务、错误与状态副作用

| 分支 | 精确行为 |
|---|---|
| 正向/负向/Unknown | Confirmed仅正式channel结果；KnownNotCommitted→Failed可有据sameintent再发；Unknown→CommitUnknown+probe responsibility；缺合同且未发→Blocked。 |
| 本地副作用 | notice state/binding/gap/report/audit/必要reconcile；不推delivery/read/remediation，不复活版本。 |
| A失败 / A commit未知 | rollback A；或originalkey/checkpoint/permission只读resolve；未证实A提交不externalcall |
| 外部timeout/ACK / B失败 | 不等NotCommitted；A仍持有恢复责任。B rollback不撤销外效应；原intentprobe，不重新dispatch |
| binding / CAS / fence失败 | BindingMismatch/VersionConflict/FenceMismatch；rollback本B，不丢旧effect；lateformal结果新授权Reconcile承担 |
| ownercontract缺口 | ContractBlocked/Unsupported/Unavailable带safegap；no phantom body/outcome/approval；未许可可block，已许可unknown只probe |
| replay | currentactor/disclosure+samekey+fingerprint→完整原NoticeJobReport；0新ID/claim/gate/effect/scan/work；Reserved不冒充Completed |
| event / ownertruth | 0event/outbox/支付/Archive；不复制资产body，局部Confirmed不approval/evidence/readiness |

#### 测试切口与单flow停审

planned：同impact/target/channel/scope唯一、同intent安全重试、ACK不Confirmed、wrongscope、不泄漏通知正文；另覆盖完整report全字段重放、changedintent冲突、current披露收缩、每writepoint rollback与A/Bcommit未知、缺checkpoint/plan、lease过期probe-only、每itemgap保留。这里只设计静态检查，不宣称run。

| 审查项 | 结论 |
|---|---|
| DTO→factory/member→typedport | 明确上述来源；外部exact consumerqualification保持blocked，不凭candidate名称声称owner支持 |
| Tx/副作用/原报告 | A许可/原checkpoint与B完整结果分别原子；必要successor同B；0长SQL跨effect |
| 状态/测试 | 对应14carrier；Step10核对全部statepairs；本flow不新增全局state |
| 范围停审 | 文档内flow已展开，后续编译/集成须实现期真实证据；未执行测试/commit |



### ReconcileNoticeFlow

#### 思考、诊断与取舍

原notice/target/channel/scope全匹配；仅原intentprobe；原permission存在且fence为原checkpoint，不以新claim permission冒第二send。 不允许shared runner掩盖本Job对象动作。采用下列typed原请求链；不扩大ownertruth/事件/支付范围。

#### 入口与目标

`pub async fn reconcile_notice(&self, request: JobEnvelope<ReconcileNoticeRequest>) -> Result<ExecutionResult<NoticeJobReport>, MarketError>`。planned application/withdrawal_notice/reconcile_notice.rs；协议见[Step8 U5](03_ddd_step_08_part_u5.md)，对象见[Step6 U5](03_ddd_step_06_part_u5.md)，port见[Step7](03_ddd_step_07_typed_ports.md)。完整控制流见[Job执行](03_ddd_step_09_job_execution.md)。

#### 函数级ASCII调用图

```text
[reconcile_notice: typed JobEnvelope]
  | call JobRunner.prepare -> current disclosure / full original replay
  v
[typed local reads -> formal original-intent probe]
  | tx A: reserve / claim / checkpoint
  | commit A; unresolved commit stops before any effect
  v
[原noticeprobe formalnotcommitted可safe原intent恢复；无fake delivery]
  | external outside write Tx; no blind retry
  v
[tx B: exact domain methods / versioned save / full report / audit / successors]
  | call JobRunner.finish -> commit -> original typed NoticeJobReport
```

#### 关键伪代码与字段绑定

```rust
// [NoticeChannelPort.probe_notice(NoticeExternalInput input)]
let formal = notice_port.probe_notice(original_input).await?;
// Tx B reload; reject outcome/inspection inconsistency and wrong binding.
// [NoticeIntent.settle(NoticeOutcomeInput input)]
notice.settle(formal.outcome)?;
store.save_notice(&mut tx_b, notice, ExpectedMarketRevision::Exact(notice_revision)).await?;
```

伪代码标注A/B插入点，不是独立实现。本Job不创建第二dispatch许可；claim新fence只probe-only。 条件分支严格以下表，成功分支代码不能套入负向/Unknown。

| 参数 / 符号 | 精确来源 / 约束 |
|---|---|
| body | ReconcileNoticeRequest: notice_ref:NoticeIntentRef; work_ref:DeferredWorkRef；无actor/key/trace第二authority |
| internal_request | InternalJobRequest::ReconcileNotice(prepared.body.clone())；A immutablecheckpoint |
| owning rows/revision | load_notice -> load_impact；原checkpoint/permission；work selector只正式DispatchNotice→ReconcileNotice pair；Missing安全错误，scope不证明先NotVisible |
| input / outcome / *_context | NoticeExternalInput从原notice+原committedpermission；NoticeOutcomeContext四字段从原notice |
| bases / inspection / qualified_* | 当次正式typedport输出精确匹配；local maintenance只local committedfactrefs；缺formalproof为Unknown/Blocked而不是填true/ref |
| subject/target/effectintent | committedwork.plan typedtarget，经FlowSupport.subject_for_target；不能parse opaque。原外部intent不随Joboperation或newfence改变 |
| items/successors/report | 每target JobItemResult完整target/outcome/bases/gap/effectintent/cursor；Job执行§Report逐字段，实际sameB workIDs，不由projection重建 |

#### 事务、错误与状态副作用

| 分支 | 精确行为 |
|---|---|
| 正向/负向/Unknown | Confirmed正式ref保存；KnownNotCommitted→Failed，仅后续明确恢复Dispatch才safe sameintent；Unknown保持且workBlocked/正式后继probe，不盲发。 |
| 本地副作用 | 原结果+完整report/audit；没有外部send，无version/listing mutation。 |
| A失败 / A commit未知 | rollback A；或originalkey/checkpoint/permission只读resolve；未证实A提交不externalcall |
| 外部timeout/ACK / B失败 | 不等NotCommitted；A仍持有恢复责任。B rollback不撤销外效应；原intentprobe，不重新dispatch |
| binding / CAS / fence失败 | BindingMismatch/VersionConflict/FenceMismatch；rollback本B，不丢旧effect；lateformal结果新授权Reconcile承担 |
| ownercontract缺口 | ContractBlocked/Unsupported/Unavailable带safegap；no phantom body/outcome/approval；未许可可block，已许可unknown只probe |
| replay | currentactor/disclosure+samekey+fingerprint→完整原NoticeJobReport；0新ID/claim/gate/effect/scan/work；Reserved不冒充Completed |
| event / ownertruth | 0event/outbox/支付/Archive；不复制资产body，局部Confirmed不approval/evidence/readiness |

#### 测试切口与单flow停审

planned：无probe正式owner等待、NotCommitted不自动send、原通知候选wrongkind、旧result重放副作用0；另覆盖完整report全字段重放、changedintent冲突、current披露收缩、每writepoint rollback与A/Bcommit未知、缺checkpoint/plan、lease过期probe-only、每itemgap保留。这里只设计静态检查，不宣称run。

| 审查项 | 结论 |
|---|---|
| DTO→factory/member→typedport | 明确上述来源；外部exact consumerqualification保持blocked，不凭candidate名称声称owner支持 |
| Tx/副作用/原报告 | A许可/原checkpoint与B完整结果分别原子；必要successor同B；0长SQL跨effect |
| 状态/测试 | 对应14carrier；Step10核对全部statepairs；本flow不新增全局state |
| 范围停审 | 文档内flow已展开，后续编译/集成须实现期真实证据；未执行测试/commit |

## Step10游标与本地枚举修正

EnumerateKnownImpact的ReadWindow.upper是本次固定扫描上界；新结果Tx B的audit/resultframe为result_cursor，coverage_cursor仍取扫描upper，不能以结果写入cursor谎称覆盖全新事实。late outcome的新增commitcursor超过coverageupper时先include(false)→Partial，再明确安排新upper扫描。
