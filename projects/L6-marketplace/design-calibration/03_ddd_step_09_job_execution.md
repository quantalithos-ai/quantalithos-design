# Step9 Job 执行、原结果与故障边界

## 思考与取舍

12 Job独立业务链见U2/U4/U5/U6/U7附录。本文件仅闭合重复的事务、report、checkpoint和故障语义，不代替逐Job流程。输入来自Step8完整JobEnvelope；调用面来自[typed ports](03_ddd_step_07_typed_ports.md)和[application callables](03_ddd_step_07_application_callables.md)。无实现或运行证明。

## 分段执行契约

```text
[JobEnvelope<T>]
  | call JobRunner.prepare: current disclosure -> original full report replay
  v
[fresh readonly work/plan/target/checkpoint -> formal prechecks outside SQL]
  | tx A: lock key -> reserve -> claim -> domain begin / permission / checkpoint
  | commit A; Unknown commit => resolve original key, never external dispatch
  v
[external dispatch OR original-intent probe OR local maintenance]
  | no open write Tx; immutable original request/effect intent
  v
[tx B: reload fence/revision/subject -> domain settle / typed safe shadow]
  | append result + audit + durable successor + complete operation
  | commit B; Unknown => original key/result resolution, no effect repeat
  v
[ExecutionResult<family MarketJobReport>]
```

| 段 | 精确调用 / 输入 | 约束 |
|---|---|---|
| prepare | JobRunner.prepare(request, kind, subjects) | 当前Core actor+ScopeResolver先校验，结果内所有typed主体披露交集，再find_by_key完整结果；相同key不同fingerprint冲突；Reserved只OperationInProgress或正式恢复，不当Fresh |
| fresh source | WorkStore.load_work/load_plan + owning store typed get + OperationStore.find_checkpoints_by_work | body.work_ref必须等context.fence.work_ref；plan.work_ref/targets/operation_kind或正式Dispatch→Reconcile pair匹配，scope从plan与目标typed本体取交集，不parse字符串 |
| claim | JobRunner.claim(tx, loaded_work, context, inspection) | Pending且无旧许可/checkpoint为初始claim，不将Unknown包装为正式notcommit；Blocked需正式恢复依据/current gate；旧Claimed过期仅Reconcile probe-only新fence。external inspection由正式probe且Some；缺probe Some(Unknown)并禁止再dispatch；本地maintenance或无旧许可Pending为None，不伪造外部notcommit |
| reserve | JobRunner.reserve + OperationStore.append_checkpoint | key lock下race再核，不在race replay分配ID。checkpoint包括完整InternalJobRequest变体、reserved原result/audit/context/cursor和claim fence |
| permission | FlowSupport.permission + WorkStore.append_permission | **只dispatch分支**；按目标版本序列化+当次正式非空authority/gate依据；attempt.begin/notice.begin/必要许可+claim+checkpoint同A。probe读取原permission，不生成第二dispatch许可 |
| Tx A commit | UnitOfWork.commit | KnownCommitted才进external段；Unknown使用find_by_key/load_checkpoint/get_permission只读解析，本地无法证明则等待，不能猜已提交/已回滚 |
| Tx B apply | owning load/save Exact revision + lock_version（分发/late影响） | formal outcome全intent/target/version/receiver/scope匹配；旧fence结果不得覆盖新work。原正式结果仍应在新授权Reconcile内持久化，不因lease/撤回/取消丢弃 |
| result | FlowSupport.job_report + JobRunner.finish | items逐target完整；authority+formal结果refs或actual local facts/gap；nextcursor只source highwater摘要，续页tie-break完整RepositoryCursor存在子DeferredPlan.window.after，不用摘要充当续页键 |
| finish old | JobRunner.finish_original(tx, checkpoint, full_original_report) | 仅已证明原操作完整结果且能还原其实际successor refs；原请求/IDs/fence从checkpoint。只有effect proof不足以重建原全部report时不得补完成，保持旧Reserved等待正式恢复；当前reconcile完整报告可先持久化 |
| failure | UnitOfWork.rollback / safe MarketError | A提交前错误无外效应；A后错误不能回滚外效应。B失败保留A checkpoint/permission/Dispatching，恢复先原intentprobe。外部timeout/transport/ACK不等KnownNotCommitted |

## 可落码 runner 轮廓

各Job伪代码中的prepared/reserved/work/plan/scope/permission/items/successors分别由上述段提供；必须按以下签名展开，不能以任意builder替代对象动作。

```rust
// [JobRunner.prepare(JobEnvelope<T> request, MarketOperationKind kind, Vec<MarketAuditSubjectRef> subjects)]
let prepared = match jobs.prepare(request, kind, subjects).await? {
    JobStart::Replayed(stored) => return support.public_result(
        ExecutionResult { value: stored.safe_result, disposition: ReplayDisposition::OriginalReplayed },
        |surface| match surface {
            MarketResultSurface::Job(report) => Ok(report),
            _ => Err(support.error(ErrorCode::IntegrityFailure)),
        }),
    JobStart::Fresh(prepared) => prepared,
};
let scope = prepared.scope.read_context.clone();
// [UnitOfWork.begin(UowMode::ReadWrite)]
let mut tx_a = uow.begin(UowMode::ReadWrite).await?;
// All fallible Tx A calls execute inside an async Result block; Err rolls back tx_a.
let reserved = match jobs.reserve(&mut tx_a, &prepared).await? {
    ReservationOutcome::Fresh(r) => r,
    ReservationOutcome::Replayed(stored) => {
        uow.rollback(tx_a).await?;
        return support.public_result(
            ExecutionResult { value: stored.safe_result, disposition: ReplayDisposition::OriginalReplayed },
            |s| match s { MarketResultSurface::Job(v) => Ok(v), _ => Err(support.error(ErrorCode::IntegrityFailure)) });
    },
};
// [WorkStorePort.load_work(Tx tx, DeferredWorkRef reference)]
let loaded_work = support.require(work_store.load_work(&mut tx_a, prepared.body.work_ref.clone()).await?)?;
let plan = support.require(work_store.load_plan(&mut tx_a, loaded_work.value.work_ref.clone()).await?)?;
// inspection: exact formal probe result for recovery; initial Pending uses None and does not assert a remote outcome.
// [JobRunner.claim(Tx tx, Versioned<DeferredWork> work, MarketWorkerContext context, Option<ExternalEffectInspectionInput> inspection)]
let work = jobs.claim(&mut tx_a, loaded_work, prepared.context.clone(), inspection).await?;
// Individual flow inserts its exact begin/permission calls here (none for a probe).
// [OperationStorePort.append_checkpoint(Tx tx, JobCheckpoint value)]
operation_store.append_checkpoint(&mut tx_a, JobCheckpoint {
    reserved: reserved.clone(),
    request: internal_request, // exact variant + prepared.body; per-flow table
    work_ref: work.value.work_ref.clone(),
    fence: work.value.fence.clone(),
}).await?;
// [UnitOfWork.commit(Tx tx)]
let a_commit = uow.commit(tx_a).await?;
// Match CommitDisposition: KnownCommitted proceeds; Unknown uses original-key read resolution.
// No external call on an unresolved A commit.

// Individual flow: external call outside SQL Tx, or local typed maintenance plan.
// [UnitOfWork.begin(UowMode::ReadWrite)]
let mut tx_b = uow.begin(UowMode::ReadWrite).await?;
// Every fallible Tx B call is scoped; Err rolls back B, preserving A and its recovery duty.
// [UnitOfWork.assign_cursor(Tx result_tx)]
let result_cursor = uow.assign_cursor(&mut tx_b).await?; // one committed result frame; not claim A cursor.
// Keep the original checkpoint unchanged; result-derived plans use the NEW B frame.
let result_reserved = ReservedOperation { cursor: result_cursor.clone(), ..reserved.clone() };
// Individual flow: reload current owning rows/fence, apply typed result, collect successors/items.
// [FlowSupport.audit(ReservedOperation reserved, MarketAuditSubjectRef subject, SafeBasisReferenceSet bases)]
let audit = support.audit_at(&reserved, subject, bases, result_cursor.clone())?;
// Apply the finite side-effect inventory from Step15 BEFORE the full report.
// These are durable LOCAL responsibilities, not new owner effects or outbox events.
match &prepared.operation_kind {
    MarketOperationKind::DispatchObservation
    | MarketOperationKind::ReconcileObservation
    | MarketOperationKind::RebuildMarketReadProjection => {},
    MarketOperationKind::RunMarketRecovery => {
        successors.extend(support.queue_projections(
            &mut tx_b, &result_reserved, audit.subject_ref.clone(), scope.clone(),
        ).await?);
    },
    MarketOperationKind::DispatchReviewHandoff
    | MarketOperationKind::ReconcileReviewHandoff
    | MarketOperationKind::DispatchDistribution
    | MarketOperationKind::ReconcileDistribution
    | MarketOperationKind::EnumerateKnownImpact
    | MarketOperationKind::DispatchNotice
    | MarketOperationKind::ReconcileNotice
    | MarketOperationKind::RefreshQualifiedReferences => {
        successors.extend(support.queue_projections(
            &mut tx_b, &result_reserved, audit.subject_ref.clone(), scope.clone(),
        ).await?);
        successors.push(support.schedule(
            &reserved, None,
            MarketWorkTargetRef::Observation(reserved.operation.value.operation_ref.clone()),
            MarketEffectIntentRef::Observation(reserved.operation.value.operation_ref.clone()),
            MarketOperationKind::DispatchObservation, scope.scope_ref.clone(),
            None, None, vec![audit.audit_ref.clone()],
        )?);
    },
    _ => return Err(support.error(ErrorCode::IntegrityFailure)), // A Command kind is never a Job.
}
// Work disposition must be computed BEFORE report construction:
// [DeferredWork.settle(WorkSettlementInput input)]
// Only on proven local completion or formal outcome with no dangling duty/durable successor.
work.value.settle(WorkSettlementInput { fence: work.value.fence.clone(), result_ref: reserved.result_ref.clone() })?;
// Alternative unknown/no-probe branch (not executed after settle):
// [DeferredWork.block(ContractGapInput gap)]
// work.value.block(actual_gap)?; // actual_gap from typed safe failure; report Blocked, not Settled.
// [FlowSupport.job_report(ReservedOperation reserved, DeferredWork work, Vec<JobItemResult> items, Option<MarketSourceCursor> next_cursor, DeferredWorkRefSet successors)]
let report = support.job_report(&result_reserved, &work.value, items, next_cursor,
    successors.iter().map(|s| s.work.work_ref.clone()).collect());
// [JobRunner.finish(Tx tx, ReservedOperation reserved, MarketJobReport report, Versioned<DeferredWork> work, MarketAuditRecord audit, Vec<PlannedResponsibility> successors)]
jobs.finish(tx_b, reserved, report, work, audit, successors).await
```

此轮廓是控制流设计，不是可直接编译代码；kind/subjects/internal_request/inspection/subject/bases由每flow绑定表与对应schema提供。Tx A/B的Result作用域及错误rollback为强制契约，`?`不可跨未清理handle直接泄漏。所有planned async函数须英文Rustdoc和固定签名，完整API声明补见callables末节。

## Report逐字段规则

| 字段 | 权威来源 |
|---|---|
| operation_ref/result_ref/audit_refs | reserved的原IDs；审计真实同Tx保存 |
| work_ref/fence/work_state | owning work在本B实际拟保存值；finish不得先报告Claimed再隐式改Settled |
| items[].target_ref/effect_intent | committed plan目标、work原intent；missing仍以请求typedtarget记录Blocked，不能伪造目标本体 |
| items[].outcome/basis_refs/failure_ref | 原正式匹配结果或局部完成事实；KnownNotCommitted必须正式证明；Unknown必须安全缺口；Blocked有具体原因 |
| items[].source_cursor | 本地committed scan或已冻结plan cursor；external结果不造本地cursor |
| next_cursor | 有下一页时的safe highwater；完整after保存在实际durable子plan |
| spawned_work_refs | 同B实际保存的责任ID，完整固定原report；重复不再生成 |

## 停审与跨flow约束

每Job独立附录含输入、对象调用、事务、分支、副作用及测试；当前只文档检查。外部positive仍blocked。0 event/outbox/Billing/Archive lane。旧checkpoint缺失/不完整为IntegrityFailure或正式等待，不猜原result。下一Step10按14carrier核对，不新增GlobalState。


## Blocked/Unknown、逐item与durable successor的精确收口

```rust
// Unqualified BEFORE dispatch permission; no external effect has been attempted.
// Owning aggregate accepts block only from its matrix-approved source state.
// [ReviewHandoff.block(ContractGapInput gap)] / [DistributionAttempt.block(ContractGapInput gap)]
// [NoticeIntent.block(ContractGapInput gap)]
owning_value.block(ContractGapInput { failure_ref: safe_failure.clone() })?;
// save owning value Exact revision in the accepted blocked-result transaction.
// [DeferredWork.block(ContractGapInput gap)]
work.value.block(ContractGapInput { failure_ref: safe_failure.clone() })?;
let item = JobItemResult { target_ref: work.value.target_ref.clone(), outcome: JobItemOutcome::Blocked,
    basis_refs: current_scope_basis, failure_ref: Some(safe_failure),
    effect_intent: work.value.intent_ref.clone(), source_cursor: None };
// The exact JobRunner.finish call captures full Blocked report/result+audit with no owner call.
```

`owning_value`不是新增对象/helper，只是每flow表指定的ReviewHandoff/DistributionAttempt/NoticeIntent。没有这种block方法的Snapshot/Projection/Recovery按本机明确mark_unavailable/record(Blocked)；Operation Reserved不能被block成不存在的state。

外部dispatch错误match只读typed ExternalPortError，不能parse文本：

| typed错误 / 正式结果 | 处理 |
|---|---|
| CommitUnknown/Unavailable（dispatch已调用后） | 实际safe failure→owning Unknown→CommitUnknown；item CommitUnknown。原intentprobe successor与原checkpoint/permission保留；no-probe workBlocked |
| ContractBlocked/NotVisible/BindingMismatch（预许可前） | 明确no-call的block分支；negative不生成正式resultbinding |
| KnownNotCommitted | 仅adapter已经从正式proof分类，可owning Failed；ordinarytimeout/ACK禁止此分类 |
| Confirmed正式结果 | 必须binding Some与outcome的binding完全相等、inspection Confirmed全原intentbasis；验证失败不能退成假NotCommitted，应保留可能提交与waiting |
| 矛盾outcome/inspection | BindingMismatch/IntegrityFailure，B rollback，A保留probe责任；不得选择有利一半 |

```rust
// [FlowSupport.schedule(...)] unknown effect -> exact same target/intent, fresh durable Reconcile successor.
let successor = support.schedule(&reserved, None, work.value.target_ref.clone(),
    work.value.intent_ref.clone(), reconcile_kind, scope.scope_ref.clone(), None, None, vec![])?;
// reconcile_kind is the fixed per-protocol Dispatch->Reconcile pair in Step8, not dynamic JSON.
successors.push(successor);
// Required successor is saved by JobRunner.finish in the SAME result UoW before old work settlement.
// Known-not-committed retry still requires explicit current recovery authority and current business gate.
```

Maintenance Job对每typed target逐item分支；qualified输出schema完整才saveExact，safe失败不create fake truth。空实际合法scan也必须一个SkippedNoOp target报告，store不可用不能empty。所有continuation fixedupper+完整after/type identity，新的work不是重放已完成原Job结果。配置accepted-UoW item/time预算超限安全rollback/Unsupported，不截断称完整。

## local maintenance lease过期与原Reserved

旧Claimed过期不能在相同key重跑Refresh/Rebuild/Impact/Recovery。当前没有这些Job的新增第13个Reconcile入口；通过已定义RunMarketRecovery并持有正式恢复authority读取原checkpoint及完整本地结果，只有无未知外部effect/原work安全settled或blocked并形成完整原report的正式依据才CAS收束旧work。需要新的typed maintenance时生成**新work/newkey**并保留原identity/计划，重新读qualifiedfacts；不把此过程称old fullresultreplay。原report不能还原则旧Operation Reserved继续waiting，不伪Complete，也不擅自steal旧lease开始第二build。

## 结果游标与late impact

JobA持久claim/permission/checkpoint及对应合法begin局部事实，其reserved.cursor只标A帧，不用于B新业务事实排序。结果B调用UnitOfWork.assign_cursor一次并供audit_at、结果fact行本地commitcursor、JobItemResult.source_cursor及late ImpactDeltaInput.coverage_cursor；before-cursor扫描仍使用原plan固定upper，两种游标不能混用。若Withdraw已于A/B之间提交，则result_cursor必须大于其disposition.source_cursor，KnownScopeComplete依include(false, newer cursor)回Partial。B回滚不发布此cursor，不用Clock/requesttime伪补顺序；Bcommit未知按原key读取完整结果等待resolve。
