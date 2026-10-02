# Step9 U6 审计/恢复独立flow小循环

## 思考、诊断与取舍

本族从Step8完整typed请求逐入口推导读取/构造/guard/Tx/结果。先current披露与fulloriginalreplay，再fresh业务；SQLtx不跨externalowner调用。采用原typedcheckpoint/permission/probe/完整manifest，拒绝body复制、scan/ACK审批、取消覆盖lateeffect和不可见count泄漏。伪代码只设计，不宣称compile/run。

## 批次表

| flow | 协议 | 对象能力 | Tx / effect |
|---|---|---|---|
| RequestMarketRecoveryFlow | RequestMarketRecoveryRequest | formaloperator/targetauthority→RecoveryIntent.request | 单accepted UoW |
| GetMarketAuditFlow | GetMarketAuditRequest | AuditStore.list_audits + formalobs binding，onlysafe | readonly，无写 |
| GetRecoveryProgressFlow | GetRecoveryProgressRequest | Recovery/work/原fullreport读取，无run | readonly，无写 |
| GetOperationResultFlow | GetOperationResultRequest | OperationStore.load_by_operation，fulloriginaltyped不重建 | readonly，无写 |
| RunMarketRecoveryFlow | RunMarketRecoveryRequest | Recovery.begin/record+policy + typed原targetprobe，无任意SQL修业务 | claim/permission→external outsideTx→result UoW |
| DispatchObservationFlow | DispatchObservationRequest | 正式safeproducer/redaction/auditplan→Obs.dispatch，receipt独立 | claim/permission→external outsideTx→result UoW |
| ReconcileObservationFlow | ReconcileObservationRequest | 原auditintentprobe→formalbinding，缺probeblockedwaiting | claim/permission→external outsideTx→result UoW |

### RequestMarketRecoveryFlow

#### 入口与目标

`pub async fn request_market_recovery(&self, request: CommandEnvelope<RequestMarketRecoveryRequest>) -> Result<ExecutionResult<RecoveryResult>, MarketError>`；planned audit_recovery/request_market_recovery.rs。目标：formaloperator/targetauthority→RecoveryIntent.request。只允许Step6方法、Step7 typedports/[application callables](03_ddd_step_07_application_callables.md)，不能调用未定义业务builder。

#### 函数级ASCII调用图

```text
[API request_market_recovery typedRequest]
  | call CommandRunner.prepare(current scope -> fullresult replay)
  v
[fresh readonly local facts -> external formal prechecks; no write Tx]
  | tx begin ReadWrite -> reserve under operation-key lock
  v
[RecoveryIntent factory/member + typed guard]
  | save Requested恢复及durablework，不任意SQL写owner，不宣称ready
  v
[work/plan + audit + StoredResult + Operation.complete]
  | commit -> KnownCommitted / Unknown-key-resolution
  v
[original typed RecoveryResult]
```

#### Rust风格伪代码

```rust
let source_candidates: Vec<SourceVerificationTarget> = vec![];
let requested_scope: Option<MarketScopeRef> = None;
// [CommandRunner.prepare(CommandEnvelope request, MarketOperationKind kind, typed subjects, candidates, requested_scope)]
let subjects = vec![support.subject_for_target(request.body.target_ref.clone())];
let start = commands.prepare(request, MarketOperationKind::RequestMarketRecovery, subjects, source_candidates, requested_scope).await?;
let prepared = match start {
    CommandStart::Fresh(p) => p,
    CommandStart::Replayed(stored) => return match stored.safe_result { MarketResultSurface::Recovery(value) => Ok(ExecutionResult { value, disposition: ReplayDisposition::OriginalReplayed }), _ => Err(support.error(ErrorCode::IntegrityFailure)) },
};
let body: RequestMarketRecoveryRequest = prepared.body.clone();
// No fresh local business reads are needed; no extra readonly transaction is opened.

// [formal owner ports / FreshGate.publication or admission; outside SQL tx]
let subject = support.subject_for_target(body.target_ref.clone());
let authority = publisher_port.authorize_operation(MarketOperationKind::RequestMarketRecovery, subject.clone(), prepared.scope.read_context.clone()).await?;
// [UnitOfWork.begin(UowMode::ReadWrite)]
let mut tx = uow.begin(UowMode::ReadWrite).await?;
// [CommandRunner.reserve(tx, prepared): lock key -> replay race / fresh ids]
let reserved = match commands.reserve(&mut tx, &prepared).await {
    Ok(ReservationOutcome::Fresh(r)) => r,
    Ok(ReservationOutcome::Replayed(stored)) => {
        uow.rollback(tx).await?;
        return match stored.safe_result {
            MarketResultSurface::Recovery(value) => Ok(ExecutionResult { value, disposition: ReplayDisposition::OriginalReplayed }),
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
    // [RecoveryIntent factory/member; typed owner input construction]
    let recovery = RecoveryIntent::request(RecoveryRequestInput { recovery_ref: ids.new_recovery_intent_ref(), target_ref: body.target_ref.clone(), authority_ref: support.require(authority.recovery_ref)? })?;
    store.save_recovery(&mut tx, recovery.clone(), ExpectedMarketRevision::MustNotExist).await?;
    let local_work_ref = ids.new_deferred_work_ref();
    works.push(support.schedule(&reserved, Some(local_work_ref.clone()), MarketWorkTargetRef::Recovery(recovery.recovery_ref.clone()), MarketEffectIntentRef::LocalWork(local_work_ref), MarketOperationKind::RunMarketRecovery, prepared.scope.read_context.scope_ref.clone(), None, None, vec![])?);
    let subject = MarketAuditSubjectRef::Recovery(recovery.recovery_ref.clone());
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
    let result = RecoveryResult { receipt, recovery_ref: recovery.recovery_ref, target_ref: recovery.target_ref, state: recovery.state, report_ref: recovery.report_ref };
    Ok((MarketResultSurface::Recovery(result), audit, works))
}.await;
match outcome {
    Err(error) => { uow.rollback(tx).await?; Err(error) },
    Ok((surface, audit, works)) => {
        // [CommandRunner.finish: work+plan -> audit -> complete original result -> operation -> commit]
        let execution = commands.finish(tx, reserved, surface, audit, works).await?;
        support.public_result(execution, |s| match s { MarketResultSurface::Recovery(v) => Ok(v), _ => Err(support.error(ErrorCode::IntegrityFailure)) })
    },
}
```

#### 输入构造与条件来源

| 符号 / 参数 | 唯一来源 | missing / binding / 保持规则 |
|---|---|---|
| body | RequestMarketRecoveryRequest完整schema | HLD Qualified输入只是内侧构造，不信client approved/verified |
| source_candidates/requested_scope | 本DTO source_candidate或draft_spec.source_candidate/target.scope_ref、Bind requested_scope；无该字段时empty/None | 正式ScopeResolver.resolve重新裁剪，不从opaqueparse；taxonomyCreate明确requested_scope |
| readonly本体 | 上述load返回完整Versioned或immutablebasis | Missing拒绝；mutablefresh在writeTx重读、CAS和fixedbasis/subject相等 |
| formal qualified变量 | let authority = publisher_port.authorize_operation(MarketOperationKind::RequestMarketRecovery, subject.clone(), prepared.scope.read_context.clone()).await?; | fields逐schema full复制；consumer_contract取不到blocked，不自造true |
| bases | currentScope.authority_basis + 当次formal source/material/Gov/receiver/disposition/notice safe refs | 同kind typedtoken通过FlowSupport.basis复制；缺正式proof不形成allow/approval |
| window | reserved.cursor固定upper+validatedbatchlimit | 只durable内部scan，不是Querypage；需要所有页时durablecontinuation，不首page冒全量 |
| result/receipt | above完整familyliteral，IDs/revision取actualstaged save/readback | originalfulltyped result同Tx，replay不再生成/更新 |

#### Tx、状态与副作用inventory

| 项 | 本flow边界 |
|---|---|
| accepted局部变化 | Requested恢复及durablework，不任意SQL写owner，不宣称ready |
| 同UoW必写 | typed owningfacts + qualification/disposition sidecar（如适用）+ Corecontext + audit + 完整RecoveryResult + Operation Completed + 必要work/plan |
| external effect | 无Command直接dispatch；fresh external调用仅formalread/qualification，业务write effect由durableJob |
| projection | 只安排必要typed derivedwork；不命令伪改Fresh；read发现cursor落后degraded，Rebuild正式推进 |
| failure | malformed/notvisible/diffintent/缺ref/不匹配/非法state/CAS→safe错误与全部rollback；commitUnknown key-read正式resolve，不blind freshretry |
| replay | 当前authority/disclosure先核；同key+fingerprint读原完整payload，不业务precheck/ID/Clock/method/save/dispatch |

#### 测试切口与停审

planned request_market_recovery: freshaccepted、samekeyoriginalreplay（副作用0）、changedintentconflict、scopehide、missing/unsafe/candidatewrongkind、每save后故障rollback、CASrace，以及“Requested恢复及durablework，不任意SQL写owner，不宣称ready”特有状态/binding/竞态。文档小循环检查DTO、完整method/port调用、result与副作用；不造测试run/evidence。下一flow仅在本flow规则已列后展开。


### GetMarketAuditFlow

#### 入口与目标

`pub async fn get_market_audit(&self, request: QueryEnvelope<GetMarketAuditRequest>) -> Result<ReadSurface<AuditRecoveryReadModel>, MarketError>`；planned audit_recovery/get_market_audit.rs。目标：AuditStore.list_audits + formalobs binding，onlysafe。只允许Step6方法、Step7 typedports/[application callables](03_ddd_step_07_application_callables.md)，不能调用未定义业务builder。

#### 函数级ASCII调用图

```text
[API get_market_audit QueryEnvelope]
  | call ReadFacade.authorize -> formal current scope/disclosure
  v
[ReadOnly Tx -> exact typed source pair / readonly formalowner read]
  | assemble AuditRecoveryReadModel; never save/reserve/dispatch/refresh
  v
[Ready / Empty / NotVisible / Missing / Degraded]
```

#### Rust风格伪代码

```rust
let source_candidates: Vec<SourceVerificationTarget> = vec![];
let requested_scope: Option<MarketScopeRef> = None;
// [ReadFacade.authorize(QueryEnvelope, typed subjects, source candidates, requested_scope)]
let scope = reads.authorize(&request, vec![request.body.subject_ref.clone()], source_candidates, requested_scope).await?;
let body: GetMarketAuditRequest = request.body.clone();
// [UnitOfWork.begin(UowMode::ReadOnly)]
let mut tx = uow.begin(UowMode::ReadOnly).await?;
let outcome = async {
let cursor = uow.current_cursor(&mut tx).await?;
let page = audit_store.list_audits(&mut tx, body.subject_ref.clone(), PageReadContext { actor: request.actor.clone(), scope: scope.clone(), selector: MarketPageSelector::GetMarketAudit }, support.require(request.meta.page.clone())?).await?;
let mut values = vec![];
for a in page.items {
let formal_saved_observation_binding = audit_store.get_observation_binding(&mut tx, a.operation_ref.clone()).await?;
values.push(AuditRecoveryReadModel { operation_ref: Some(a.operation_ref.clone()), audit_items: vec![MarketAuditReadItem { audit_ref: a.audit_ref, subject_ref: a.subject_ref, operation_ref: a.operation_ref, basis_refs: a.basis_refs, cursor: a.cursor }], recovery_ref: None, recovery_state: None, report: None, observation_binding: formal_saved_observation_binding });
}
// [ReadFacade.ready(items, PageInfo, ReadMarker); no writes]
let marker = support.ready_marker(None, cursor);
let surface = reads.ready(values, page.info, marker)?;
Ok(surface)
}.await;
// [UnitOfWork.rollback(Tx readonly_tx)]
uow.rollback(tx).await?;
match outcome { Ok(surface) => Ok(surface), Err(error) => reads.map_read_error(error) }
```

#### 读取、构造与失败来源

append-onlylocalaudit + AuditStore.get_observation_binding pervisibleoperation；no raw/evidence/verdict。所有free symbol是明确typedsource映射而不是builder占位：source_candidates/requested_scope按本Request字段或empty/None；state与readmodel字段逐原值copy；qualified_visible_summary只QualifiedSnapshotMaterial::Source且当前可见，缺可选摘要None不证明合格；typed_notice_read_items/attempt_snapshots按已声明纯函数逐字段copy；formal_saved_observation_binding从AuditStore.get_observation_binding读取；current_gap来自formal错误safe code，不生成owner扫描/支付结果。

ownerqualification分支gate_allows/formal_gate_basis/current_gap从当前正式结果及纯policyevaluate确定，Listed与未撤回/currentapproved/receiver必需。body.field缺失reject；scope不可证明NotVisible（不带ref/count/cursor）；typedsourceMissing只authorizedMissing；Stale/Rebuilding/Unavailable/Unsupported/Failed/Disabled走Degraded，no-query-write/no-cache-refresh。每个earlyreturn/error位于显式async Result作用域，退出后readonly rollback一次；formalprecheck先关闭本地读取事务再调用owner，不二次consume handle。

#### Tx与副作用 / 测试

localWrite/ID/Clock/operationreserve/audit/work/ownerwrite/event均0；只有当前formalread与typedReadonly访问。列表/详情/版本/数量/分页同currentvisibility交集，下一token只当前可见item的boundedCorepage；historychunk不冒称全量。测试：visible/empty/NotVisible/authorizedmissing、错误不echo、wrongscope/filtertoken、state/bodypair缺失、stale/rebuilding/unsupported、locale不改refs/key、Query全部writer计数0。单flow停审：typedDTO/source/model/marker与no-write边界已列，外部资格blocked不变。


### GetRecoveryProgressFlow

#### 入口与目标

`pub async fn get_recovery_progress(&self, request: QueryEnvelope<GetRecoveryProgressRequest>) -> Result<ReadSurface<AuditRecoveryReadModel>, MarketError>`；planned audit_recovery/get_recovery_progress.rs。目标：Recovery/work/原fullreport读取，无run。只允许Step6方法、Step7 typedports/[application callables](03_ddd_step_07_application_callables.md)，不能调用未定义业务builder。

#### 函数级ASCII调用图

```text
[API get_recovery_progress QueryEnvelope]
  | call ReadFacade.authorize -> formal current scope/disclosure
  v
[ReadOnly Tx -> exact typed source pair / readonly formalowner read]
  | assemble AuditRecoveryReadModel; never save/reserve/dispatch/refresh
  v
[Ready / Empty / NotVisible / Missing / Degraded]
```

#### Rust风格伪代码

```rust
let source_candidates: Vec<SourceVerificationTarget> = vec![];
let requested_scope: Option<MarketScopeRef> = None;
// [ReadFacade.authorize(QueryEnvelope, typed subjects, source candidates, requested_scope)]
let scope = reads.authorize(&request, vec![MarketAuditSubjectRef::Recovery(request.body.recovery_ref.clone())], source_candidates, requested_scope).await?;
let body: GetRecoveryProgressRequest = request.body.clone();
// [UnitOfWork.begin(UowMode::ReadOnly)]
let mut tx = uow.begin(UowMode::ReadOnly).await?;
let outcome = async {
let cursor = uow.current_cursor(&mut tx).await?;
let recovery = support.require(store.load_recovery(&mut tx, body.recovery_ref.clone()).await?)?.value;
let report = match recovery.report_ref.clone() { Some(r) => ops.load_result(&mut tx, r).await?, None => None };
let typed_original_job_report = match report.clone() { Some(r) => match r.safe_result { MarketResultSurface::Job(j) => Some(j), _=>return Err(support.error(ErrorCode::IntegrityFailure)) }, None=>None };
let value = AuditRecoveryReadModel { operation_ref: report.as_ref().map(|r|r.operation_ref.clone()), audit_items: vec![], recovery_ref: Some(recovery.recovery_ref), recovery_state: Some(recovery.state), report: typed_original_job_report, observation_binding: None };
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

原fullresultreport按MarketResultSurface::Job exactkind提取；missing/错schemaIntegrityFailure，不跑Recovery。所有free symbol是明确typedsource映射而不是builder占位：source_candidates/requested_scope按本Request字段或empty/None；state与readmodel字段逐原值copy；qualified_visible_summary只QualifiedSnapshotMaterial::Source且当前可见，缺可选摘要None不证明合格；typed_notice_read_items/attempt_snapshots按已声明纯函数逐字段copy；formal_saved_observation_binding从AuditStore.get_observation_binding读取；current_gap来自formal错误safe code，不生成owner扫描/支付结果。

ownerqualification分支gate_allows/formal_gate_basis/current_gap从当前正式结果及纯policyevaluate确定，Listed与未撤回/currentapproved/receiver必需。body.field缺失reject；scope不可证明NotVisible（不带ref/count/cursor）；typedsourceMissing只authorizedMissing；Stale/Rebuilding/Unavailable/Unsupported/Failed/Disabled走Degraded，no-query-write/no-cache-refresh。每个earlyreturn/error位于显式async Result作用域，退出后readonly rollback一次；formalprecheck先关闭本地读取事务再调用owner，不二次consume handle。

#### Tx与副作用 / 测试

localWrite/ID/Clock/operationreserve/audit/work/ownerwrite/event均0；只有当前formalread与typedReadonly访问。列表/详情/版本/数量/分页同currentvisibility交集，下一token只当前可见item的boundedCorepage；historychunk不冒称全量。测试：visible/empty/NotVisible/authorizedmissing、错误不echo、wrongscope/filtertoken、state/bodypair缺失、stale/rebuilding/unsupported、locale不改refs/key、Query全部writer计数0。单flow停审：typedDTO/source/model/marker与no-write边界已列，外部资格blocked不变。


### GetOperationResultFlow

#### 入口与目标

`pub async fn get_operation_result(&self, request: QueryEnvelope<GetOperationResultRequest>) -> Result<ReadSurface<StoredOperationResult>, MarketError>`；planned audit_recovery/get_operation_result.rs。目标：OperationStore.load_by_operation，fulloriginaltyped不重建。只允许Step6方法、Step7 typedports/[application callables](03_ddd_step_07_application_callables.md)，不能调用未定义业务builder。

#### 函数级ASCII调用图

```text
[API get_operation_result QueryEnvelope]
  | call ReadFacade.authorize -> formal current scope/disclosure
  v
[ReadOnly Tx -> exact typed source pair / readonly formalowner read]
  | assemble StoredOperationResult; never save/reserve/dispatch/refresh
  v
[Ready / Empty / NotVisible / Missing / Degraded]
```

#### Rust风格伪代码

```rust
let source_candidates: Vec<SourceVerificationTarget> = vec![];
let requested_scope: Option<MarketScopeRef> = None;
// [ReadFacade.authorize(QueryEnvelope, typed subjects, source candidates, requested_scope)]
let scope = reads.authorize(&request, vec![MarketAuditSubjectRef::Operation(request.body.operation_ref.clone())], source_candidates, requested_scope).await?;
let body: GetOperationResultRequest = request.body.clone();
// [UnitOfWork.begin(UowMode::ReadOnly)]
let mut tx = uow.begin(UowMode::ReadOnly).await?;
let outcome = async {
let cursor = uow.current_cursor(&mut tx).await?;
let value = support.require(ops.load_by_operation(&mut tx, body.operation_ref.clone()).await?)?;
support.assert_binding(value.operation_ref == body.operation_ref && value.schema_ref == MarketResultSchemaRef::V1)?;
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

当前披露完整originalfullpayload，隐含refs可见交集全部满足才返回；不projection重建。所有free symbol是明确typedsource映射而不是builder占位：source_candidates/requested_scope按本Request字段或empty/None；state与readmodel字段逐原值copy；qualified_visible_summary只QualifiedSnapshotMaterial::Source且当前可见，缺可选摘要None不证明合格；typed_notice_read_items/attempt_snapshots按已声明纯函数逐字段copy；formal_saved_observation_binding从AuditStore.get_observation_binding读取；current_gap来自formal错误safe code，不生成owner扫描/支付结果。

ownerqualification分支gate_allows/formal_gate_basis/current_gap从当前正式结果及纯policyevaluate确定，Listed与未撤回/currentapproved/receiver必需。body.field缺失reject；scope不可证明NotVisible（不带ref/count/cursor）；typedsourceMissing只authorizedMissing；Stale/Rebuilding/Unavailable/Unsupported/Failed/Disabled走Degraded，no-query-write/no-cache-refresh。每个earlyreturn/error位于显式async Result作用域，退出后readonly rollback一次；formalprecheck先关闭本地读取事务再调用owner，不二次consume handle。

#### Tx与副作用 / 测试

localWrite/ID/Clock/operationreserve/audit/work/ownerwrite/event均0；只有当前formalread与typedReadonly访问。列表/详情/版本/数量/分页同currentvisibility交集，下一token只当前可见item的boundedCorepage；historychunk不冒称全量。测试：visible/empty/NotVisible/authorizedmissing、错误不echo、wrongscope/filtertoken、state/bodypair缺失、stale/rebuilding/unsupported、locale不改refs/key、Query全部writer计数0。单flow停审：typedDTO/source/model/marker与no-write边界已列，外部资格blocked不变。



### RunMarketRecoveryFlow

#### 思考、诊断与取舍

正式recovery_ref与RecoveryIntent.authority_ref匹配、current actor/scope；RecoveryPolicy.evaluate(RecoveryTargetInput目标+原effectintent)，require_original_intent=true。owner未提供probe则明确Blocked。 不允许shared runner掩盖本Job对象动作。采用下列typed原请求链；不扩大ownertruth/事件/支付范围。

#### 入口与目标

`pub async fn run_market_recovery(&self, request: JobEnvelope<RunMarketRecoveryRequest>) -> Result<ExecutionResult<RecoveryJobReport>, MarketError>`。planned application/audit_recovery/run_market_recovery.rs；协议见[Step8 U6](03_ddd_step_08_part_u6.md)，对象见[Step6 U6](03_ddd_step_06_part_u6.md)，port见[Step7](03_ddd_step_07_typed_ports.md)。完整控制流见[Job执行](03_ddd_step_09_job_execution.md)。

#### 函数级ASCII调用图

```text
[run_market_recovery: typed JobEnvelope]
  | call JobRunner.prepare -> current disclosure / full original replay
  v
[typed local reads -> formal precheck]
  | tx A: reserve / claim / checkpoint
  | commit A; unresolved commit stops before any effect
  v
[Recovery.begin/record+policy + typed原targetprobe，无任意SQL修业务]
  | external outside write Tx; no blind retry
  v
[tx B: exact domain methods / versioned save / full report / audit / successors]
  | call JobRunner.finish -> commit -> original typed RecoveryJobReport
```

#### 关键伪代码与字段绑定

```rust
// [PublisherAuthorityPort.authorize_operation(MarketOperationKind operation_kind, MarketAuditSubjectRef subject, SafeReadContext scope)]
let authority = publisher_port.authorize_operation(MarketOperationKind::RunMarketRecovery, recovery_subject.clone(), scope.clone()).await?;
// [RecoveryPolicy.evaluate(RecoveryIntent intent, RecoveryTargetInput target)]
support.assert_allowed(recovery_policy.evaluate(recovery.clone(), target_input)?)?;
// The typed Review/Distribution/Notice/Observation target branch performs its ORIGINAL probe outside SQL.
// Snapshot/Projection branches schedule exact maintenance instead; never fake external proof.
// [RecoveryIntent.begin(QualifiedRecoveryInput input)]
recovery.begin(QualifiedRecoveryInput { authority_ref, target_ref: recovery.target_ref.clone(), inspection: inspection.clone() })?;
// Tx A owning Running progress is persisted with claim/checkpoint; reload revision before B.
store.save_recovery(&mut tx_a, recovery, ExpectedMarketRevision::Exact(recovery_revision)).await?;
// Tx B: result points at the full report captured atomically by JobRunner.finish.
// [MarketStorePort.load_recovery(Tx tx_b, RecoveryIntentRef reference)]
let current_recovery = support.require(store.load_recovery(&mut tx_b, body.recovery_ref.clone()).await?)?;
let recovery_revision = current_recovery.revision;
let mut recovery = current_recovery.value; // Never reuse the moved Tx A value or revision.
// [RecoveryIntent.record(RecoveryOutcomeInput input)]
recovery.record(recovery_outcome)?;
store.save_recovery(&mut tx_b, recovery, ExpectedMarketRevision::Exact(recovery_revision)).await?;
```

伪代码标注A/B插入点，不是独立实现。所有externalcall均在A的KnownCommitted后、B开始前。 条件分支严格以下表，成功分支代码不能套入负向/Unknown。

| 参数 / 符号 | 精确来源 / 约束 |
|---|---|
| body | RunMarketRecoveryRequest: recovery_ref:RecoveryIntentRef; work_ref:DeferredWorkRef；无actor/key/trace第二authority |
| internal_request | InternalJobRequest::RunMarketRecovery(prepared.body.clone())；A immutablecheckpoint |
| owning rows/revision | load_recovery(body.recovery_ref) -> typed target match →所属原work/plan/checkpoint/permission/localfacts；Publisher.authorize_operation精确Recovery subject；Missing安全错误，scope不证明先NotVisible |
| input / outcome / *_context | QualifiedRecoveryInput { authority_ref, target_ref, inspection }; RecoveryOutcomeInput引用本次reserved.result_ref；恢复模式typed target match，不任意SQL |
| bases / inspection / qualified_* | 当次正式typedport输出精确匹配；local maintenance只local committedfactrefs；缺formalproof为Unknown/Blocked而不是填true/ref |
| subject/target/effectintent | committedwork.plan typedtarget，经FlowSupport.subject_for_target；不能parse opaque。原外部intent不随Joboperation或newfence改变 |
| items/successors/report | 每target JobItemResult完整target/outcome/bases/gap/effectintent/cursor；Job执行§Report逐字段，实际sameB workIDs，不由projection重建 |

#### 事务、错误与状态副作用

| 分支 | 精确行为 |
|---|---|
| 正向/负向/Unknown | Requested/Blocked→Running有据；逐目标义务完整并已durable承接→Completed，否则Blocked；Completed非业务ready。Operation/Impact目标没有外部probe，精确本地完整result/scan责任，缺formalbasis不强修。 |
| 本地副作用 | Recovery进度/report+明确typed reconcile/maintenance责任；不改ownertruth、不虚造原Completed。 |
| A失败 / A commit未知 | rollback A；或originalkey/checkpoint/permission只读resolve；未证实A提交不externalcall |
| 外部timeout/ACK / B失败 | 不等NotCommitted；A仍持有恢复责任。B rollback不撤销外效应；原intentprobe，不重新dispatch |
| binding / CAS / fence失败 | BindingMismatch/VersionConflict/FenceMismatch；rollback本B，不丢旧effect；lateformal结果新授权Reconcile承担 |
| ownercontract缺口 | ContractBlocked/Unsupported/Unavailable带safegap；no phantom body/outcome/approval；未许可可block，已许可unknown只probe |
| replay | currentactor/disclosure+samekey+fingerprint→完整原RecoveryJobReport；0新ID/claim/gate/effect/scan/work；Reserved不冒充Completed |
| event / ownertruth | 0event/outbox/支付/Archive；不复制资产body，局部Confirmed不approval/evidence/readiness |

#### 测试切口与单flow停审

planned：每target variant、权限缺失、任意target拒绝、原report不全不得finish_original、unknown不压Completed；另覆盖完整report全字段重放、changedintent冲突、current披露收缩、每writepoint rollback与A/Bcommit未知、缺checkpoint/plan、lease过期probe-only、每itemgap保留。这里只设计静态检查，不宣称run。

| 审查项 | 结论 |
|---|---|
| DTO→factory/member→typedport | 明确上述来源；外部exact consumerqualification保持blocked，不凭candidate名称声称owner支持 |
| Tx/副作用/原报告 | A许可/原checkpoint与B完整结果分别原子；必要successor同B；0长SQL跨effect |
| 状态/测试 | 对应14carrier；Step10核对全部statepairs；本flow不新增全局state |
| 范围停审 | 文档内flow已展开，后续编译/集成须实现期真实证据；未执行测试/commit |



#### 恢复target逐variant调用闭环

进入原probe前先用current披露及原typedtarget读取exact owningfacts/plan/permission；下列原input逐字段按相应独立Reconcile flow构造，不借当前投影。局部target None表示没有远端提交语义，不是NotCommitted。

```rust
// [RecoveryPolicy.classify(ExternalEffectInspectionInput input)]
let inspection: Option<ExternalEffectInspectionInput> = match recovery.target_ref.clone() {
    MarketWorkTargetRef::Review(reference) => {
        // load_review -> exact application/basis -> find_by_intent(Review(reference), Review(reference))
        // -> load_plan/find_checkpoints_by_work/get_permission at ORIGINAL checkpoint fence.
        // [GovernancePort.probe_review(ReviewExternalInput input)]
        Some(recovery_policy.classify(governance_port.probe_review(original_review_input).await?.inspection)?)
    },
    MarketWorkTargetRef::Distribution(reference) => {
        // load_attempt(reference) -> load_intent; original context has all five receiver binding fields.
        // [ReceiverPort.probe_distribution(ReceiverProbeInput input)]
        Some(recovery_policy.classify(receiver_port.probe_distribution(original_receiver_input).await?.inspection)?)
    },
    MarketWorkTargetRef::Notice(reference) => {
        // load_notice(reference) -> same notice/impact/target/channel/scope + originalpermission.
        // [NoticeChannelPort.probe_notice(NoticeExternalInput input)]
        Some(recovery_policy.classify(notice_port.probe_notice(original_notice_input).await?.inspection)?)
    },
    MarketWorkTargetRef::Observation(reference) => {
        // exact committed AuditStore auditset from originalplan + original operation + permission.
        // [ObservationPort.probe_observation(ObservationDispatchInput input)]
        Some(recovery_policy.classify(observation_port.probe_observation(original_observation_input).await?.inspection)?)
    },
    MarketWorkTargetRef::Snapshot(reference) => {
        // load_snapshot(reference), formal operator scope, original body-free typed source.
        // Schedule RefreshQualifiedReferences on this exact tracked Snapshot; no remote proof invented.
        None
    },
    MarketWorkTargetRef::Projection(reference) => {
        // load_projection(reference) + nonempty typed plan through prepare_projection_request.
        // Schedule RebuildMarketReadProjection, not arbitrary SQL source repairs.
        None
    },
    MarketWorkTargetRef::Impact(reference) => {
        // load_impact/reference.disposition -> fixedupper exact scan plan.
        // Schedule EnumerateKnownImpact with that existing disposition/impact pair.
        None
    },
    MarketWorkTargetRef::Recovery(_) => return Err(support.error(ErrorCode::Unsupported)),
};
// Some Unknown: keep recovery Blocked if no qualified formal continuation/manual basis.
// Some Confirmed/NotCommitted: schedule exact owning Reconcile; a retry is never the probe itself.
// None: actual local continuation + report CompletedLocal; no fake ExternalEffectInspectionInput::Confirmed.
// Missing tracked target/plan/checkpoint: safe Missing/IntegrityFailure, not reconstruct from current view.
```

| 原typedinput | 唯一来源 |
|---|---|
| original_review_input | ReviewExternalInput四字段：load_review的handoff/application、load_basis、原checkpointpermission；见ReconcileReviewHandoff |
| original_receiver_input | ReceiverProbeInput：load_attempt→load_intent的intent_ref与DistributionOutcomeContext五字段；见ReconcileDistribution |
| original_notice_input | NoticeExternalInput六字段：load_notice原字段+原checkpointpermission；见ReconcileNotice |
| original_observation_input | ObservationDispatchInput四字段：原Observation target operation+DeferredPlan.audit_refs/scope+原permission；见ReconcileObservation |
| local continuation | 原tracked target/ref/原typedplan及formal当前操作权限；完整sourceplan不具备则Blocked，不emptyplan |
| recovery_outcome | 只有逐item职责有正式结论或已durable承接取Completed(reserved.result_ref)；否则Blocked(reserved.result_ref)，same B fullreport+audit+work |


### DispatchObservationFlow

#### 思考、诊断与取舍

MarketWorkTargetRef::Observation(original_operation)、MarketEffectIntentRef::Observation相等；只安全audit refs+摘要，不rawbody。ObservationPort adapter必须正式producer/redaction consumer，否则externalport ContractBlocked。 不允许shared runner掩盖本Job对象动作。采用下列typed原请求链；不扩大ownertruth/事件/支付范围。

#### 入口与目标

`pub async fn dispatch_observation(&self, request: JobEnvelope<DispatchObservationRequest>) -> Result<ExecutionResult<ObservationJobReport>, MarketError>`。planned application/audit_recovery/dispatch_observation.rs；协议见[Step8 U6](03_ddd_step_08_part_u6.md)，对象见[Step6 U6](03_ddd_step_06_part_u6.md)，port见[Step7](03_ddd_step_07_typed_ports.md)。完整控制流见[Job执行](03_ddd_step_09_job_execution.md)。

#### 函数级ASCII调用图

```text
[dispatch_observation: typed JobEnvelope]
  | call JobRunner.prepare -> current disclosure / full original replay
  v
[typed local reads -> formal precheck]
  | tx A: reserve / claim / checkpoint / permission
  | commit A; unresolved commit stops before any effect
  v
[正式safeproducer/redaction/auditplan→Obs.dispatch，receipt独立]
  | external outside write Tx; no blind retry
  v
[tx B: exact domain methods / versioned save / full report / audit / successors]
  | call JobRunner.finish -> commit -> original typed ObservationJobReport
```

#### 关键伪代码与字段绑定

```rust
// Precheck outside SQL before Tx A permission; formal safe producer/redaction scope only.
// [ObservationPort.qualify_observation(ObservationOutcomeContext input, SafeReadContext scope)]
let producer_bases = observation_port.qualify_observation(original_observation_context.clone(), scope.clone()).await?;
bases.extend(producer_bases);
let permission = support.permission(&reserved, &work.value, None, bases.clone());
work_store.append_permission(&mut tx_a, permission).await?;
// Commit A before external effect.
// [ObservationPort.dispatch_observation(ObservationDispatchInput input)]
let formal = observation_port.dispatch_observation(input).await;
// Tx B; only complete confirmed inspection has a qualified binding.
match formal.inspection {
    ExternalEffectInspectionInput::Confirmed(proof) => {
        // [ObservationOutcomeBinding.from_observer(QualifiedObservationOutcome input)]
        let binding = ObservationOutcomeBinding::from_observer(support.require(formal.binding)?)?;
        // [ObservationOutcomeBinding.matches(ObservationOutcomeContext input)]
        support.assert_binding(binding.matches(original_observation_context))?;
        audit_store.save_observation_binding(&mut tx_b, binding).await?;
        // item Confirmed with proof; does not establish evidence/signoff.
    },
    ExternalEffectInspectionInput::KnownNotCommitted(proof) => {
        // full negative report with proof, no receipt; explicit authority required before a later dispatch.
    },
    ExternalEffectInspectionInput::Unknown(failure) => {
        // CommitUnknown report + original-intent reconcile successor or Blocked/no-probe waiting.
    },
}
```

伪代码标注A/B插入点，不是独立实现。所有externalcall均在A的KnownCommitted后、B开始前。 条件分支严格以下表，成功分支代码不能套入负向/Unknown。

| 参数 / 符号 | 精确来源 / 约束 |
|---|---|
| body | DispatchObservationRequest: audit_refs:MarketAuditRefSet; work_ref:DeferredWorkRef；无actor/key/trace第二authority |
| internal_request | InternalJobRequest::DispatchObservation(prepared.body.clone())；A immutablecheckpoint |
| owning rows/revision | 原DeferredPlan.audit_refs非空，与body.audit_refs规范化集合相等；AuditStore.load_audit每ref，均同committed原operation/scope；原producer/redaction正式资格；Missing安全错误，scope不证明先NotVisible |
| input / outcome / *_context | ObservationDispatchInput { operation_ref: original_operation, audit_refs: frozen original plan.audit_refs, scope_ref: original scope, permission }; 非当前Joboperation |
| bases / inspection / qualified_* | 当次正式typedport输出精确匹配；local maintenance只local committedfactrefs；缺formalproof为Unknown/Blocked而不是填true/ref |
| subject/target/effectintent | committedwork.plan typedtarget，经FlowSupport.subject_for_target；不能parse opaque。原外部intent不随Joboperation或newfence改变 |
| items/successors/report | 每target JobItemResult完整target/outcome/bases/gap/effectintent/cursor；Job执行§Report逐字段，实际sameB workIDs，不由projection重建 |

#### 事务、错误与状态副作用

| 分支 | 精确行为 |
|---|---|
| 正向/负向/Unknown | Confirmed仅formal producer receipt；Unknown+缺probe持久Blocked/reconcile；NotCommitted有正式proof不造receipt。binding仅Confirmed分支，负向不能require Some。 |
| 本地副作用 | Obs receipt独立安全关联，原local audit始终存在，不evidence/verdict/signoff；当前Job audit不自动再次派发（无无限自审计链）。 |
| A失败 / A commit未知 | rollback A；或originalkey/checkpoint/permission只读resolve；未证实A提交不externalcall |
| 外部timeout/ACK / B失败 | 不等NotCommitted；A仍持有恢复责任。B rollback不撤销外效应；原intentprobe，不重新dispatch |
| binding / CAS / fence失败 | BindingMismatch/VersionConflict/FenceMismatch；rollback本B，不丢旧effect；lateformal结果新授权Reconcile承担 |
| ownercontract缺口 | ContractBlocked/Unsupported/Unavailable带safegap；no phantom body/outcome/approval；未许可可block，已许可unknown只probe |
| replay | currentactor/disclosure+samekey+fingerprint→完整原ObservationJobReport；0新ID/claim/gate/effect/scan/work；Reserved不冒充Completed |
| event / ownertruth | 0event/outbox/支付/Archive；不复制资产body，局部Confirmed不approval/evidence/readiness |

#### 测试切口与单flow停审

planned：ACK不是receipt、全部auditref同scope、集合顺序规范化、producer/redaction缺口、原operation而非当前jobop；另覆盖完整report全字段重放、changedintent冲突、current披露收缩、每writepoint rollback与A/Bcommit未知、缺checkpoint/plan、lease过期probe-only、每itemgap保留。这里只设计静态检查，不宣称run。

| 审查项 | 结论 |
|---|---|
| DTO→factory/member→typedport | 明确上述来源；外部exact consumerqualification保持blocked，不凭candidate名称声称owner支持 |
| Tx/副作用/原报告 | A许可/原checkpoint与B完整结果分别原子；必要successor同B；0长SQL跨effect |
| 状态/测试 | 对应14carrier；Step10核对全部statepairs；本flow不新增全局state |
| 范围停审 | 文档内flow已展开，后续编译/集成须实现期真实证据；未执行测试/commit |



### ReconcileObservationFlow

#### 思考、诊断与取舍

请求只有workref，从immutable plan恢复audit set/operation/scope；拒绝当前投影反推；原producer/redaction probe capability formalqualified。 不允许shared runner掩盖本Job对象动作。采用下列typed原请求链；不扩大ownertruth/事件/支付范围。

#### 入口与目标

`pub async fn reconcile_observation(&self, request: JobEnvelope<ReconcileObservationRequest>) -> Result<ExecutionResult<ObservationJobReport>, MarketError>`。planned application/audit_recovery/reconcile_observation.rs；协议见[Step8 U6](03_ddd_step_08_part_u6.md)，对象见[Step6 U6](03_ddd_step_06_part_u6.md)，port见[Step7](03_ddd_step_07_typed_ports.md)。完整控制流见[Job执行](03_ddd_step_09_job_execution.md)。

#### 函数级ASCII调用图

```text
[reconcile_observation: typed JobEnvelope]
  | call JobRunner.prepare -> current disclosure / full original replay
  v
[typed local reads -> formal original-intent probe]
  | tx A: reserve / claim / checkpoint
  | commit A; unresolved commit stops before any effect
  v
[原auditintentprobe→formalbinding，缺probeblockedwaiting]
  | external outside write Tx; no blind retry
  v
[tx B: exact domain methods / versioned save / full report / audit / successors]
  | call JobRunner.finish -> commit -> original typed ObservationJobReport
```

#### 关键伪代码与字段绑定

```rust
// [ObservationPort.probe_observation(ObservationDispatchInput input)]
let formal = observation_port.probe_observation(original_input).await?;
// Tx B; only complete confirmed inspection has a qualified binding.
match formal.inspection {
    ExternalEffectInspectionInput::Confirmed(proof) => {
        // [ObservationOutcomeBinding.from_observer(QualifiedObservationOutcome input)]
        let binding = ObservationOutcomeBinding::from_observer(support.require(formal.binding)?)?;
        // [ObservationOutcomeBinding.matches(ObservationOutcomeContext input)]
        support.assert_binding(binding.matches(original_observation_context))?;
        audit_store.save_observation_binding(&mut tx_b, binding).await?;
        // item Confirmed with proof; does not establish evidence/signoff.
    },
    ExternalEffectInspectionInput::KnownNotCommitted(proof) => {
        // full negative report with proof, no receipt; explicit authority required before a later dispatch.
    },
    ExternalEffectInspectionInput::Unknown(failure) => {
        // CommitUnknown report + original-intent reconcile successor or Blocked/no-probe waiting.
    },
}
```

伪代码标注A/B插入点，不是独立实现。本Job不创建第二dispatch许可；claim新fence只probe-only。 条件分支严格以下表，成功分支代码不能套入负向/Unknown。

| 参数 / 符号 | 精确来源 / 约束 |
|---|---|
| body | ReconcileObservationRequest: work_ref:DeferredWorkRef；无actor/key/trace第二authority |
| internal_request | InternalJobRequest::ReconcileObservation(prepared.body.clone())；A immutablecheckpoint |
| owning rows/revision | 原work/DeferredPlan.audit_refs + target Observation(originalop) -> AuditStore.load_audit + get_observation_binding(originalop)；原permission/checkpoint；Missing安全错误，scope不证明先NotVisible |
| input / outcome / *_context | ObservationDispatchInput取原plan/target/permission；QualifiedObservationOutcome含outcome_ref/operation_ref/audit_refs/scope_ref完整字段 |
| bases / inspection / qualified_* | 当次正式typedport输出精确匹配；local maintenance只local committedfactrefs；缺formalproof为Unknown/Blocked而不是填true/ref |
| subject/target/effectintent | committedwork.plan typedtarget，经FlowSupport.subject_for_target；不能parse opaque。原外部intent不随Joboperation或newfence改变 |
| items/successors/report | 每target JobItemResult完整target/outcome/bases/gap/effectintent/cursor；Job执行§Report逐字段，实际sameB workIDs，不由projection重建 |

#### 事务、错误与状态副作用

| 分支 | 精确行为 |
|---|---|
| 正向/负向/Unknown | Unknown保持，no probe waiting/manual formalbasis；NotCommitted保存正式negative报告，不自动dispatch；Confirmed保存原receipt不能替换不匹配旧binding。 |
| 本地副作用 | 独立正式receipt+fullreport，原audit不可变；无Audit/Archive evidence生成。 |
| A失败 / A commit未知 | rollback A；或originalkey/checkpoint/permission只读resolve；未证实A提交不externalcall |
| 外部timeout/ACK / B失败 | 不等NotCommitted；A仍持有恢复责任。B rollback不撤销外效应；原intentprobe，不重新dispatch |
| binding / CAS / fence失败 | BindingMismatch/VersionConflict/FenceMismatch；rollback本B，不丢旧effect；lateformal结果新授权Reconcile承担 |
| ownercontract缺口 | ContractBlocked/Unsupported/Unavailable带safegap；no phantom body/outcome/approval；未许可可block，已许可unknown只probe |
| replay | currentactor/disclosure+samekey+fingerprint→完整原ObservationJobReport；0新ID/claim/gate/effect/scan/work；Reserved不冒充Completed |
| event / ownertruth | 0event/outbox/支付/Archive；不复制资产body，局部Confirmed不approval/evidence/readiness |

#### 测试切口与单flow停审

planned：请求不复制audit metadata、原plan缺失、错原operation、negative无binding、不能用当前audit重构；另覆盖完整report全字段重放、changedintent冲突、current披露收缩、每writepoint rollback与A/Bcommit未知、缺checkpoint/plan、lease过期probe-only、每itemgap保留。这里只设计静态检查，不宣称run。

| 审查项 | 结论 |
|---|---|
| DTO→factory/member→typedport | 明确上述来源；外部exact consumerqualification保持blocked，不凭candidate名称声称owner支持 |
| Tx/副作用/原报告 | A许可/原checkpoint与B完整结果分别原子；必要successor同B；0长SQL跨effect |
| 状态/测试 | 对应14carrier；Step10核对全部statepairs；本flow不新增全局state |
| 范围停审 | 文档内flow已展开，后续编译/集成须实现期真实证据；未执行测试/commit |
