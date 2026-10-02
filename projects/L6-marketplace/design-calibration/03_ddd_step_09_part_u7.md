# Step9 U7 引用/snapshot/索引独立flow小循环

## 思考、诊断与取舍

本族从Step8完整typed请求逐入口推导读取/构造/guard/Tx/结果。先current披露与fulloriginalreplay，再fresh业务；SQLtx不跨externalowner调用。采用原typedcheckpoint/permission/probe/完整manifest，拒绝body复制、scan/ACK审批、取消覆盖lateeffect和不可见count泄漏。伪代码只设计，不宣称compile/run。

## 批次表

| flow | 协议 | 对象能力 | Tx / effect |
|---|---|---|---|
| GetReferenceFreshnessFlow | GetReferenceFreshnessRequest | SnapshotStore.load_snapshot state+body→current披露marker | readonly，无写 |
| GetProjectionFreshnessFlow | GetProjectionFreshnessRequest | ProjectionStore.load_projection pair→scope-bound marker | readonly，无写 |
| RefreshQualifiedReferencesFlow | RefreshQualifiedReferencesRequest | formal SourceOwner.read_snapshot→snapshot.refresh/stale/unavailable，不业务truthrepair | claim/permission→external outsideTx→result UoW |
| RebuildMarketReadProjectionFlow | RebuildMarketReadProjectionRequest | typednonemptyplan+committedfacts+qualifiedsnapshots→projection.begin_rebuild/publish | claim/permission→external outsideTx→result UoW |

### GetReferenceFreshnessFlow

#### 入口与目标

`pub async fn get_reference_freshness(&self, request: QueryEnvelope<GetReferenceFreshnessRequest>) -> Result<ReadSurface<ReferenceFreshnessView>, MarketError>`；planned reference_read/get_reference_freshness.rs。目标：SnapshotStore.load_snapshot state+body→current披露marker。只允许Step6方法、Step7 typedports/[application callables](03_ddd_step_07_application_callables.md)，不能调用未定义业务builder。

#### 函数级ASCII调用图

```text
[API get_reference_freshness QueryEnvelope]
  | call ReadFacade.authorize -> formal current scope/disclosure
  v
[ReadOnly Tx -> exact typed source pair / readonly formalowner read]
  | assemble ReferenceFreshnessView; never save/reserve/dispatch/refresh
  v
[Ready / Empty / NotVisible / Missing / Degraded]
```

#### Rust风格伪代码

```rust
let source_candidates: Vec<SourceVerificationTarget> = vec![];
let requested_scope: Option<MarketScopeRef> = None;
// [ReadFacade.authorize(QueryEnvelope, typed subjects, source candidates, requested_scope)]
let scope = reads.authorize(&request, vec![MarketAuditSubjectRef::Snapshot(request.body.snapshot_ref.clone())], source_candidates, requested_scope).await?;
let body: GetReferenceFreshnessRequest = request.body.clone();
// [UnitOfWork.begin(UowMode::ReadOnly)]
let mut tx = uow.begin(UowMode::ReadOnly).await?;
let outcome = async {
let cursor = uow.current_cursor(&mut tx).await?;
let snapshot = support.require(snapshots.load_snapshot(&mut tx, body.snapshot_ref.clone()).await?)?.value;
let value = ReferenceFreshnessView { snapshot_ref: snapshot.snapshot_ref, source_ref: snapshot.source_ref, source_version: snapshot.source_version, validity_ref: snapshot.validity_ref, state: snapshot.state };
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

typedsnapshot state/body成对；当前Scope允许才暴露marker，不查询刷新。所有free symbol是明确typedsource映射而不是builder占位：source_candidates/requested_scope按本Request字段或empty/None；state与readmodel字段逐原值copy；qualified_visible_summary只QualifiedSnapshotMaterial::Source且当前可见，缺可选摘要None不证明合格；typed_notice_read_items/attempt_snapshots按已声明纯函数逐字段copy；formal_saved_observation_binding从AuditStore.get_observation_binding读取；current_gap来自formal错误safe code，不生成owner扫描/支付结果。

ownerqualification分支gate_allows/formal_gate_basis/current_gap从当前正式结果及纯policyevaluate确定，Listed与未撤回/currentapproved/receiver必需。body.field缺失reject；scope不可证明NotVisible（不带ref/count/cursor）；typedsourceMissing只authorizedMissing；Stale/Rebuilding/Unavailable/Unsupported/Failed/Disabled走Degraded，no-query-write/no-cache-refresh。每个earlyreturn/error位于显式async Result作用域，退出后readonly rollback一次；formalprecheck先关闭本地读取事务再调用owner，不二次consume handle。

#### Tx与副作用 / 测试

localWrite/ID/Clock/operationreserve/audit/work/ownerwrite/event均0；只有当前formalread与typedReadonly访问。列表/详情/版本/数量/分页同currentvisibility交集，下一token只当前可见item的boundedCorepage；historychunk不冒称全量。测试：visible/empty/NotVisible/authorizedmissing、错误不echo、wrongscope/filtertoken、state/bodypair缺失、stale/rebuilding/unsupported、locale不改refs/key、Query全部writer计数0。单flow停审：typedDTO/source/model/marker与no-write边界已列，外部资格blocked不变。


### GetProjectionFreshnessFlow

#### 入口与目标

`pub async fn get_projection_freshness(&self, request: QueryEnvelope<GetProjectionFreshnessRequest>) -> Result<ReadSurface<ProjectionFreshnessView>, MarketError>`；planned reference_read/get_projection_freshness.rs。目标：ProjectionStore.load_projection pair→scope-bound marker。只允许Step6方法、Step7 typedports/[application callables](03_ddd_step_07_application_callables.md)，不能调用未定义业务builder。

#### 函数级ASCII调用图

```text
[API get_projection_freshness QueryEnvelope]
  | call ReadFacade.authorize -> formal current scope/disclosure
  v
[ReadOnly Tx -> exact typed source pair / readonly formalowner read]
  | assemble ProjectionFreshnessView; never save/reserve/dispatch/refresh
  v
[Ready / Empty / NotVisible / Missing / Degraded]
```

#### Rust风格伪代码

```rust
let source_candidates: Vec<SourceVerificationTarget> = vec![];
let requested_scope: Option<MarketScopeRef> = None;
// [ReadFacade.authorize(QueryEnvelope, typed subjects, source candidates, requested_scope)]
let scope = reads.authorize(&request, vec![MarketAuditSubjectRef::Projection(request.body.projection_ref.clone())], source_candidates, requested_scope).await?;
let body: GetProjectionFreshnessRequest = request.body.clone();
// [UnitOfWork.begin(UowMode::ReadOnly)]
let mut tx = uow.begin(UowMode::ReadOnly).await?;
let outcome = async {
let cursor = uow.current_cursor(&mut tx).await?;
let projection = support.require(projections.load_projection(&mut tx, body.projection_ref.clone()).await?)?;
let value = ProjectionFreshnessView { projection_ref: projection.projection.value.projection_ref, kind: projection.projection.value.kind, scope_ref: projection.projection.value.scope_ref, state: projection.projection.value.state, source_cursor: projection.projection.value.source_cursor };
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

sameScope state+manifest pair；Fresh不是readiness，cursor落后明确Stale读姿态。所有free symbol是明确typedsource映射而不是builder占位：source_candidates/requested_scope按本Request字段或empty/None；state与readmodel字段逐原值copy；qualified_visible_summary只QualifiedSnapshotMaterial::Source且当前可见，缺可选摘要None不证明合格；typed_notice_read_items/attempt_snapshots按已声明纯函数逐字段copy；formal_saved_observation_binding从AuditStore.get_observation_binding读取；current_gap来自formal错误safe code，不生成owner扫描/支付结果。

ownerqualification分支gate_allows/formal_gate_basis/current_gap从当前正式结果及纯policyevaluate确定，Listed与未撤回/currentapproved/receiver必需。body.field缺失reject；scope不可证明NotVisible（不带ref/count/cursor）；typedsourceMissing只authorizedMissing；Stale/Rebuilding/Unavailable/Unsupported/Failed/Disabled走Degraded，no-query-write/no-cache-refresh。每个earlyreturn/error位于显式async Result作用域，退出后readonly rollback一次；formalprecheck先关闭本地读取事务再调用owner，不二次consume handle。

#### Tx与副作用 / 测试

localWrite/ID/Clock/operationreserve/audit/work/ownerwrite/event均0；只有当前formalread与typedReadonly访问。列表/详情/版本/数量/分页同currentvisibility交集，下一token只当前可见item的boundedCorepage；historychunk不冒称全量。测试：visible/empty/NotVisible/authorizedmissing、错误不echo、wrongscope/filtertoken、state/bodypair缺失、stale/rebuilding/unsupported、locale不改refs/key、Query全部writer计数0。单flow停审：typedDTO/source/model/marker与no-write边界已列，外部资格blocked不变。



### RefreshQualifiedReferencesFlow

#### 思考、诊断与取舍

SourceOwner.read_snapshot(snapshot_ref, loaded source_ref, scope)与返回ref/type/version/material/validity exact；当前披露。adapter错误不得用错误字符串选择业务state。 不允许shared runner掩盖本Job对象动作。采用下列typed原请求链；不扩大ownertruth/事件/支付范围。

#### 入口与目标

`pub async fn refresh_qualified_references(&self, request: JobEnvelope<RefreshQualifiedReferencesRequest>) -> Result<ExecutionResult<ReferenceRefreshReport>, MarketError>`。planned application/reference_read/refresh_qualified_references.rs；协议见[Step8 U7](03_ddd_step_08_part_u7.md)，对象见[Step6 U7](03_ddd_step_06_part_u7.md)，port见[Step7](03_ddd_step_07_typed_ports.md)。完整控制流见[Job执行](03_ddd_step_09_job_execution.md)。

#### 函数级ASCII调用图

```text
[refresh_qualified_references: typed JobEnvelope]
  | call JobRunner.prepare -> current disclosure / full original replay
  v
[typed local reads -> formal precheck]
  | tx A: reserve / claim / checkpoint
  | commit A; unresolved commit stops before any effect
  v
[formal SourceOwner.read_snapshot→snapshot.refresh/stale/unavailable，不业务truthrepair]
  | external outside write Tx; no blind retry
  v
[tx B: exact domain methods / versioned save / full report / audit / successors]
  | call JobRunner.finish -> commit -> original typed ReferenceRefreshReport
```

#### 关键伪代码与字段绑定

```rust
// Read all tracked snapshots before owner calls; missing tracked row is a Blocked report item.
// [SourceOwnerPort.read_snapshot(QualifiedReferenceSnapshotRef snapshot_ref, TypedOwnerReference source, SafeReadContext scope)]
let result = source_port.read_snapshot(row.value.snapshot_ref.clone(), row.value.source_ref.clone(), scope.clone()).await;
// Tx B reloads same snapshot identity/revision; each result becomes one complete JobItemResult.
match result {
    Ok(qualified_input) => {
        // [QualifiedReferenceSnapshot.refresh(QualifiedSnapshotInput input)]
        snapshot.refresh(qualified_input)?;
    },
    Err(error) => {
        // failure_input from typed ExternalPortError plus ACTUAL current-safe old material.
        if has_safe_visible_old_material && snapshot.state != ReferenceSnapshotState::Unavailable {
            // [QualifiedReferenceSnapshot.mark_stale(SourceRefreshFailureInput input)]
            snapshot.mark_stale(failure_input)?;
        } else {
            // [QualifiedReferenceSnapshot.mark_unavailable(SourceRefreshFailureInput input)]
            snapshot.mark_unavailable(failure_input)?;
        }
    },
}
snapshot_store.save_snapshot(&mut tx_b, snapshot, ExpectedMarketRevision::Exact(snapshot_revision)).await?;
```

伪代码标注A/B插入点，不是独立实现。所有externalcall均在A的KnownCommitted后、B开始前。 条件分支严格以下表，成功分支代码不能套入负向/Unknown。

| 参数 / 符号 | 精确来源 / 约束 |
|---|---|
| body | RefreshQualifiedReferencesRequest: snapshot_refs:QualifiedReferenceSnapshotRefSet; work_ref:DeferredWorkRef；无actor/key/trace第二authority |
| internal_request | InternalJobRequest::RefreshQualifiedReferences(prepared.body.clone())；A immutablecheckpoint |
| owning rows/revision | 每body.snapshot_refs必须非空、规范化、bounded且等plan.targets Snapshot；SnapshotStore.load_snapshot每ref→source_ref typed variant；Missing安全错误，scope不证明先NotVisible |
| input / outcome / *_context | QualifiedSnapshotInput完整ref/source/version/safe_material/validity由formal snapshot output；SourceRefreshFailureInput由安全错误+实际旧材料是否当前合法，不由client bool |
| bases / inspection / qualified_* | 当次正式typedport输出精确匹配；local maintenance只local committedfactrefs；缺formalproof为Unknown/Blocked而不是填true/ref |
| subject/target/effectintent | committedwork.plan typedtarget，经FlowSupport.subject_for_target；不能parse opaque。原外部intent不随Joboperation或newfence改变 |
| items/successors/report | 每target JobItemResult完整target/outcome/bases/gap/effectintent/cursor；Job执行§Report逐字段，实际sameB workIDs，不由projection重建 |

#### 事务、错误与状态副作用

| 分支 | 精确行为 |
|---|---|
| 正向/负向/Unknown | Stale/Unavailable→Qualified仅完整正式输出；Unavailable不能Stale。成功与失败各item完整报告；缺tracked row记录Blocked，不隐式造source/validity。 |
| 本地副作用 | typed body-free snapshot+failuregap+必要projection责任/report/audit；不复活Restricted/Withdrawn、不自动批准application。 |
| A失败 / A commit未知 | rollback A；或originalkey/checkpoint/permission只读resolve；未证实A提交不externalcall |
| 外部timeout/ACK / B失败 | 不等NotCommitted；A仍持有恢复责任。B rollback不撤销外效应；原intentprobe，不重新dispatch |
| binding / CAS / fence失败 | BindingMismatch/VersionConflict/FenceMismatch；rollback本B，不丢旧effect；lateformal结果新授权Reconcile承担 |
| ownercontract缺口 | ContractBlocked/Unsupported/Unavailable带safegap；no phantom body/outcome/approval；未许可可block，已许可unknown只probe |
| replay | currentactor/disclosure+samekey+fingerprint→完整原ReferenceRefreshReport；0新ID/claim/gate/effect/scan/work；Reserved不冒充Completed |
| event / ownertruth | 0event/outbox/支付/Archive；不复制资产body，局部Confirmed不approval/evidence/readiness |

#### 测试切口与单flow停审

planned：全部finite materialvariants、wrongtype/validity、source ID绑定、部分成功report全保留、Unavailable不能Stale、Missing非empty；另覆盖完整report全字段重放、changedintent冲突、current披露收缩、每writepoint rollback与A/Bcommit未知、缺checkpoint/plan、lease过期probe-only、每itemgap保留。这里只设计静态检查，不宣称run。

| 审查项 | 结论 |
|---|---|
| DTO→factory/member→typedport | 明确上述来源；外部exact consumerqualification保持blocked，不凭candidate名称声称owner支持 |
| Tx/副作用/原报告 | A许可/原checkpoint与B完整结果分别原子；必要successor同B；0长SQL跨effect |
| 状态/测试 | 对应14carrier；Step10核对全部statepairs；本flow不新增全局state |
| 范围停审 | 文档内flow已展开，后续编译/集成须实现期真实证据；未执行测试/commit |



### RebuildMarketReadProjectionFlow

#### 思考、诊断与取舍

plan projection/kind/scope/sourcecursor/view_keys/sources非空且映射完整，每viewkey唯一Rendered或Omitted；snapshot refs exact。旧index不得source，fresh missing manifest integrity failure。所有authoritative facts可fixedcursor读取，否则blocked。 不允许shared runner掩盖本Job对象动作。采用下列typed原请求链；不扩大ownertruth/事件/支付范围。

#### 入口与目标

`pub async fn rebuild_market_read_projection(&self, request: JobEnvelope<RebuildMarketReadProjectionRequest>) -> Result<ExecutionResult<ProjectionRebuildReport>, MarketError>`。planned application/reference_read/rebuild_market_read_projection.rs；协议见[Step8 U7](03_ddd_step_08_part_u7.md)，对象见[Step6 U7](03_ddd_step_06_part_u7.md)，port见[Step7](03_ddd_step_07_typed_ports.md)。完整控制流见[Job执行](03_ddd_step_09_job_execution.md)。

#### 函数级ASCII调用图

```text
[rebuild_market_read_projection: typed JobEnvelope]
  | call JobRunner.prepare -> current disclosure / full original replay
  v
[typed local reads -> formal precheck]
  | tx A: reserve / claim / checkpoint
  | commit A; unresolved commit stops before any effect
  v
[typednonemptyplan+committedfacts+qualifiedsnapshots→projection.begin_rebuild/publish]
  | external outside write Tx; no blind retry
  v
[tx B: exact domain methods / versioned save / full report / audit / successors]
  | call JobRunner.finish -> commit -> original typed ProjectionRebuildReport
```

#### 关键伪代码与字段绑定

```rust
// Tx A existing projection; initialize only Stale, never Fresh with an empty shadow.
// [ReadProjection.begin_rebuild(ProjectionRebuildPlanInput input)]
projection.begin_rebuild(body.plan.clone())?;
projection_store.save_projection(&mut tx_a, projection, ExpectedMarketRevision::Exact(projection_revision)).await?;
// Commit A. ReadOnly build errors are captured, then rollback this readonly handle exactly once.
let mut read_tx = uow.begin(UowMode::ReadOnly).await?;
// [ProjectionStorePort.read_truth_sources(Tx tx, ProjectionRebuildPlanInput plan, SafeReadContext scope)]
let build = projection_store.read_truth_sources(&mut read_tx, body.plan.clone(), scope.clone()).await;
uow.rollback(read_tx).await?;
// Tx B re-read projection revision/current scope.
// [ProjectionStorePort.source_cursor(Tx tx, ProjectionIdentity identity)]
let committed_cursor = projection_store.source_cursor(&mut tx_b, ProjectionIdentity { kind: body.plan.kind, scope_ref: body.plan.scope_ref.clone() }).await?;
match build {
    Ok(items) if committed_cursor == body.plan.source_cursor => {
        // [ReadProjection.publish(ProjectionBuildOutcomeInput input)]
        projection.publish(ProjectionBuildOutcomeInput { plan: body.plan.clone(), items: items.clone() })?;
        // [ProjectionStorePort.publish_views(Tx tx, ReadProjection value, Vec<ProjectionBuildItem> items, ExpectedMarketRevision expected)]
        projection_store.publish_views(&mut tx_b, projection, items, ExpectedMarketRevision::Exact(projection_revision)).await?;
    },
    Ok(_) if committed_cursor > body.plan.source_cursor => {
        // [ReadProjection.mark_stale(ProjectionInvalidationInput input)]
        projection.mark_stale(ProjectionInvalidationInput { source_cursor: committed_cursor, reason_ref: actual_invalidation_reason })?;
        projection_store.save_projection(&mut tx_b, projection, ExpectedMarketRevision::Exact(projection_revision)).await?;
        // Exact durable new-work/newplan continuation; this old shadow is not Fresh.
    },
    Ok(_) => return Err(support.error(ErrorCode::IntegrityFailure)),
    Err(error) => {
        // actual_safe_failure maps typed PortError with safe code/reason; never raw text.
        // [ReadProjection.mark_unavailable(ProjectionBuildFailureInput input)]
        projection.mark_unavailable(ProjectionBuildFailureInput { failure_ref: actual_safe_failure, source_cursor: body.plan.source_cursor })?;
        projection_store.save_projection(&mut tx_b, projection, ExpectedMarketRevision::Exact(projection_revision)).await?;
    },
}
```

伪代码标注A/B插入点，不是独立实现。所有externalcall均在A的KnownCommitted后、B开始前。 条件分支严格以下表，成功分支代码不能套入负向/Unknown。

| 参数 / 符号 | 精确来源 / 约束 |
|---|---|
| body | RebuildMarketReadProjectionRequest: projection_ref:MarketProjectionRef; work_ref:DeferredWorkRef; plan:ProjectionRebuildPlanInput；无actor/key/trace第二authority |
| internal_request | InternalJobRequest::RebuildMarketReadProjection(prepared.body.clone())；A immutablecheckpoint |
| owning rows/revision | ProjectionStore.load_projection(body.projection_ref)完整state/views/manifest；body.plan与plan.projection_plan（如已有）exact；read_truth_sources(body.plan, current scope)从committed owning facts+qualified snapshot；Missing安全错误，scope不证明先NotVisible |
| input / outcome / *_context | ProjectionRebuildPlanInput frozen完整对象；ProjectionBuildOutcomeInput { plan, items: 全manifest逐keysafe Rendered/Omitted }; ProjectionInvalidationInput committedcursor |
| bases / inspection / qualified_* | 当次正式typedport输出精确匹配；local maintenance只local committedfactrefs；缺formalproof为Unknown/Blocked而不是填true/ref |
| subject/target/effectintent | committedwork.plan typedtarget，经FlowSupport.subject_for_target；不能parse opaque。原外部intent不随Joboperation或newfence改变 |
| items/successors/report | 每target JobItemResult完整target/outcome/bases/gap/effectintent/cursor；Job执行§Report逐字段，实际sameB workIDs，不由projection重建 |

#### 事务、错误与状态副作用

| 分支 | 精确行为 |
|---|---|
| 正向/负向/Unknown | sourcecursor仍对应且完整manifest→Rebuilding→Fresh原子views+marker。构建期间更高committedcursor→mark_stale，当前shadow不伪Fresh、明确新plan successor。缺safe sources→mark_unavailable，不发布partial。 |
| 本地副作用 | 仅派生index/view/marker+fullreport/audit/work，不业务truth。旧reader跨epoch读state/body成对，当前授权仍独立裁剪。 |
| A失败 / A commit未知 | rollback A；或originalkey/checkpoint/permission只读resolve；未证实A提交不externalcall |
| 外部timeout/ACK / B失败 | 不等NotCommitted；A仍持有恢复责任。B rollback不撤销外效应；原intentprobe，不重新dispatch |
| binding / CAS / fence失败 | BindingMismatch/VersionConflict/FenceMismatch；rollback本B，不丢旧effect；lateformal结果新授权Reconcile承担 |
| ownercontract缺口 | ContractBlocked/Unsupported/Unavailable带safegap；no phantom body/outcome/approval；未许可可block，已许可unknown只probe |
| replay | currentactor/disclosure+samekey+fingerprint→完整原ProjectionRebuildReport；0新ID/claim/gate/effect/scan/work；Reserved不冒充Completed |
| event / ownertruth | 0event/outbox/支付/Archive；不复制资产body，局部Confirmed不approval/evidence/readiness |

#### 测试切口与单flow停审

planned：完整manifest/遗漏键/重复键、Omitted非空安全原因、源变化CAS、先Rebuilding再Fresh、无旧indexsource、崩溃新授权maintenance；另覆盖完整report全字段重放、changedintent冲突、current披露收缩、每writepoint rollback与A/Bcommit未知、缺checkpoint/plan、lease过期probe-only、每itemgap保留。这里只设计静态检查，不宣称run。

| 审查项 | 结论 |
|---|---|
| DTO→factory/member→typedport | 明确上述来源；外部exact consumerqualification保持blocked，不凭candidate名称声称owner支持 |
| Tx/副作用/原报告 | A许可/原checkpoint与B完整结果分别原子；必要successor同B；0长SQL跨effect |
| 状态/测试 | 对应14carrier；Step10核对全部statepairs；本flow不新增全局state |
| 范围停审 | 文档内flow已展开，后续编译/集成须实现期真实证据；未执行测试/commit |


## Step10投影cursor与结果frame分离

ReadProjection.source_cursor指typedplan覆盖的owning business/qualified snapshot依赖游标，由ProjectionStore.source_cursor按typedidentity/受控sourcepolicy读取；不是UnitOfWork全局commitcursor。纯operation/lease/checkpoint/projection维护audit/report/self-writes不计入投影依赖，因此重建不会使自己永远落后。Audit投影只选accepted business auditfacts，完整maintenance audit仍由GetMarketAudit读取。结果B assign_cursor仍是实际本地commit帧；publish不把旧plan cursor改成自己的resultcursor。
