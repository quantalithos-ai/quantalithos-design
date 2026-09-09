# Step 9. 十四入口函数级处理流

## 1. Step状态

状态：[x] completed；gate_status=pass_with_external_slots；前序已完成；formal_fill_allowed=false；仅设计，最多到Step10。

## 2. 输入

Step8四族/DTO、Step6工厂/成员、Step7完整callable/ports、02 §8/9；SOP Step9全文、书写§5.8；governance Step9分批/独立流/事务与测试切口作粒度参考。

## 3. SOP问题回答

1~3：十四协议逐一同名flow，按Command→Query→Consumer→Operations。4~7：每flow对象.函数调用回指6/7，外部slot缺失当场停止，不发明helper成功类型。8~12：每flow事务/错误/状态/测试切口审查后做跨flow审计。

## 4. 诊断

共享授权/结果核对纪律可以复用，但不能替代独立处理流；恢复Advance必须分阶段有界，query/export不得自动refresh。发现方法/读取面缺口先回修Step6/7再写调用。

## 5. 前后对比

此前语义/对象轮廓→本步具名合同；保留上游slot blocker，不把本地设计通过当正向集成闭合。

## 6. 取舍

逐模块/协议族/入口/状态主语小循环，先依据/问题/诊断/取舍，再合同与自检；不照搬governance业务对象。

## 7. 结构化产物

### 7.1 批次与共享执行规则

| Flow/协议 | 批次 | 入口→service | 对象组 | 停审 |
|---|---|---|---|---|
| ProvisionWorkspacePartition | Command | CommandHandlers.provision→PartitionService.provision | CP1 | 下列独立flow |
| ChangeWorkspaceLocalState | Command | CommandHandlers.change_local→LocalAttentionService.change_local | CP5 | 下列独立flow |
| GetWorkspaceView | Query | QueryHandlers.get_view→WorkspaceQueryService.get_view | CP7 | 下列独立flow |
| ListWorkspaceInbox | Query | QueryHandlers.list_inbox→WorkspaceQueryService.list_inbox | CP7 | 下列独立flow |
| GetWorkspaceLocalState | Query | QueryHandlers.get_local_state→WorkspaceQueryService.get_local_state | CP7 | 下列独立flow |
| GetWorkspaceOperationResult | Query | QueryHandlers.get_operation_result→WorkspaceQueryService.get_operation_result | CP7 | 下列独立flow |
| GetWorkspaceRecoveryStatus | Query | QueryHandlers.get_recovery_status→WorkspaceQueryService.get_recovery_status | CP7 | 下列独立flow |
| ExportWorkspaceReadModel | Query | QueryHandlers.export_read_model→WorkspaceQueryService.export_read_model | CP7 | 下列独立flow |
| ConsumeSourceChange | Consumer | SourceChangeConsumer.consume_change→ProjectionApplyService.consume_change | CP3/4 | 下列独立flow |
| ConsumeSourceInvalidation | Consumer | SourceInvalidationConsumer.consume_invalidation→RecoveryService.consume_invalidation | CP6 | 下列独立flow |
| RequestWorkspaceRecovery | Operations | RecoveryHandlers.request_recovery→RecoveryService.request_recovery | CP6 | 下列独立flow |
| AdvanceWorkspaceRecovery | Operations | RecoveryHandlers.advance_recovery→RecoveryService.advance_recovery | CP6 | 下列独立flow |
| SupersedeWorkspaceRecovery | Operations | RecoveryHandlers.supersede_recovery→RecoveryService.supersede_recovery | CP6 | 下列独立flow |
| InvalidateWorkspaceView | Operations | InvalidationHandler.invalidate_view→RecoveryService.invalidate_view | CP6 | 下列独立flow |

按两Command→六Query→两Consumer→四Operations串行，每条flow下自检。所有伪代码是设计片段：局部字段访问是字段表读取的缩写，**实现不能绕private字段，需采用下述只读getter**；`?`内部错误必须通过Step8安全映射，不能裸序列化ApplicationError。图/代码所需owner slot抽取仍blocked，不提供猜测helper实现。

#### S0 输入、幂等与事务纪律

1. 外层验证typed request/Core metadata；actor为认证宿主参数，delegated_by需正式证明；origin由入口固定。Query只Eventual、page/idem None；write key必填，reason/external_ref首版None。
2. scope.resolve先于业务数据输出；scope.authorize_operation只写入口调用。operation key/digest使用Step6/8正式构造，临时resolution不入key。维护/consumer的system身份不是权限例外。
3. `WorkspaceReadPort.operation(key)`已有同digest→现时裁剪后Duplicate；异digest→Conflict；None允许尝试**同key原子提交**，unique约束胜者返回原结果。此前unknown尚未终局不能换key重做；原key重入允许重新lookup，但Pending不执行下一业务变更。
4. 所有网络读取/验证在写事务外。唯一写事务在具名AtomicStore内部开始，比较全部expected/唯一键/失效栅栏，保存效果+精确结果后commit；错误明确rollback或Unknown。domain方法仅tentative变更，错误不改原self。
5. Unknown→`read.resolve_commit(attempt)`：Operation/Source/Gap回原结果；NotCommitted才可重新取expected后重试；Pending保持OutcomeUnknown。无记录不等rollback。公共调用超时不证明取消后没有提交；跨进程同key由store唯一键防重。
6. 所有Query无写事务、无operation记录、无last-opened/read/refresh、无owner command；只读日志不构成本地truth。全项目无outbound event/Outbox/上游回写。

#### 字段读取与纯构造回源审计

Step6所有private struct字段均增加同名只读getter，返回`&FieldType`（Copy局部ID/enum/u64可返回值），不得提供可写借用。getter覆盖字段表全项，明确在本Step6附录登记完整签名，避免flow依赖私有字段。公开DTO映射在application对应service函数体中按Step8字段表逐项做，不新造未定义Assembler/Policy对象。

### 7.2 Command：ProvisionWorkspacePartitionFlow

依据/取舍：稳定key lookup不依赖未生成partition；已存在对象新key不默默承认新创建。入口/DTO为Step8 Provision；目标WorkspacePartition/OperationRecord，ports scope/read/ids/store。

```text
[CommandHandlers.provision]
  | call PartitionService.provision
  | call ScopeService.resolve / authorize_operation
  | call WorkspaceReadPort.operation / find_partition
  v
[WorkspacePartition.provision + WorkspaceOperationRecord.committed]
  | tx WorkspaceAtomicStore.provision: unique + partition + result
  v
[Committed / NotCommitted / Unknown -> resolve_commit]
```

```rust
// [ScopeService.resolve(ActorContext actor, ScopeSelector selector)]
let scope = self.scope.resolve(&actor, &request.scope).await?;
// [ScopeService.authorize_operation(ActorContext actor, WorkspaceScope scope, OperationKind kind)]
self.scope.authorize_operation(&actor, &scope, OperationKind::Provision).await?;
// [WorkspaceReadPort.operation(WorkspaceOperationKey key)]
let prior = self.read.operation(&key).await?; // S0 same digest -> exact replay.
// [WorkspaceReadPort.find_partition(ActorId principal, StableScopeKey scope)]
let existing = self.read.find_partition(&actor.actor.actor_id, &scope.stable_key()).await?;
if existing.is_some() { return Err(ApplicationError::Conflict); }
// [IdPort.partition()]
let id = self.ids.partition().await?;
// [WorkspacePartition.provision(WorkspacePartitionId id, ActorId principal, WorkspaceScope scope)]
let partition = WorkspacePartition::provision(id, actor.actor.actor_id.clone(), scope)?;
// [WorkspaceOperationRecord.committed(WorkspaceOperationKey key, SafeInputDigest digest, WorkspaceOperationRef result_ref, StoredWorkspaceResult result)]
let result = WorkspaceOperationRecord::committed(key, digest, result_ref, stored_result)?;
// [ProvisionCommit.try_new(WorkspaceOperationContext context, WorkspacePartition partition, WorkspaceOperationRecord result)]
let change = ProvisionCommit::try_new(context, partition, result)?;
// [WorkspaceAtomicStore.provision(ProvisionCommit change)]
let outcome = self.store.provision(change).await?; // TX begins/commits/rolls back inside.
// [WorkspaceReadPort.resolve_commit(CommitAttemptId attempt)]
// Only on Unknown; S0 resolves before any fresh mutation.
```

构造：key/digest/context/result_ref/commit_attempt按S0与IdPort；StoredWorkspaceResult::Provisioned的partition相同，LocalCommitBasis::Partition version=1是**计划结果值**，只有store确认后才对外称提交。事务：stable actor+scope唯一及operation key唯一同提交；不初始化overlay/generation/coverage。错误：expected/unique Conflict，scope安全失败，unknown保留；无outbox/owner写。

测试切口（planned，未执行）：相同scope不同resolution只建一个；同key同digest exact replay；新key重复scope Conflict；commit返回未知后读原结果；Query从未触发此flow。单flow停审：DTO/工厂/ports/版本来源/原子/错误/状态完整，无新owner。

### 7.3 Command：ChangeWorkspaceLocalStateFlow

依据/取舍：Absent是明确CAS条件；用户意图跨generation保留，read override不可自动清除。目标LocalAttentionState/ReadCursor/OperationRecord。

```text
[CommandHandlers.change_local -> LocalAttentionService.change_local]
  | call ScopeService.resolve / authorize_operation
  | call WorkspaceReadPort.operation / snapshot
  | call AttentionResolverPort.resolve_change / VisibilityPort.bind_subject
  v
[LocalAttentionState.initialize? -> change]
  | tx WorkspaceAtomicStore.change_local: overlay + result + expected
  v
[Exact committed result / S0 unknown resolution]
```

```rust
// [ScopeService.resolve(ActorContext actor, ScopeSelector selector)]
let scope = self.scope.resolve(&actor, &request.scope).await?;
// [ScopeService.authorize_operation(ActorContext actor, WorkspaceScope scope, OperationKind kind)]
self.scope.authorize_operation(&actor, &scope, OperationKind::ChangeLocal).await?;
// [WorkspaceReadPort.operation(WorkspaceOperationKey key)]
let prior = self.read.operation(&key).await?; // S0 duplicate/conflict gate.
// [WorkspaceReadPort.snapshot(WorkspacePartitionId partition)]
let snapshot = self.read.snapshot(request.partition).await?.ok_or(ApplicationError::NotFound)?;
// [WorkspacePartition.assert_scope(WorkspaceScope scope)]
snapshot.partition.assert_scope(&scope)?;
// [AttentionResolverPort.resolve_change(ActorContext actor, WorkspaceScope scope, WorkspacePartitionId partition, LocalAttentionChange change)]
let resolution = self.attention.resolve_change(&actor, &scope, request.partition, &request.change).await?;
// For preference/clearing refs, build LocalChangeResolution with no attention; scope still authorized.
// [LocalAttentionState.initialize(WorkspacePartitionId partition, ActorId principal)]
// Only if snapshot.local is absent AND request.expected_local == Absent; otherwise match the existing version.
// [LocalAttentionState.change(LocalAttentionChange change, LocalChangeResolution resolution, LocalRevision expected)]
local.change(request.change, resolution, expected_revision)?;
// [WorkspaceAtomicStore.change_local(LocalChangeCommit change)]
let outcome = self.store.change_local(change).await?; // TX: expected partition/local + overlay + result.
```

字段构造：expected_revision=0仅Absent；已存在以read local_revision且必须等request Present。变更前LocalChangeResolution.validate_for；SetFocus/LastOpened(Some)调用visibility.bind_subject并最终revalidate；None清除不要求旧ref可见；SetPreference直接有限字段验证；Read/SetDisposition才调用attention.resolve_change，伪代码该调用只在这两分支。ReadCursor.apply只在匹配stream更新，MarkUnread加入override，Advance不清override。成功local revision一次checked_next，同操作result；重建和source游标不写。

测试切口：Absent race只一个胜者；expected冲突不改变self；跨stream Advance拒绝；unknown读回不二次next；清已撤权focus可清除但scope无权仍拒绝；GET不影响local revision。停审：条件构造/权限/原子与无来源receipt副作用闭合。


### 7.4 Query批次：六独立flow

共用Q0：验证metadata→ScopeService.resolve→VisibilityPort.resolve(selection)先做list/scope当前决定→读取→逐ref/item当前binding→最后revalidate→DTO。每次输出需003正式有效期/撤销模型支持；没有证明不能靠最后一次RPC声称跨系统线性授权。Query没有写store，view/local/source/current版本是read snapshot而非query生成。safe schema映射按Step8字段逐项执行，无隐藏计数/全集provenance。

#### GetWorkspaceViewFlow

依据/取舍：mode由请求显式选，不fallback；source/general分页001/006未闭合则blocked。构造目标SourceSlice/WorkspaceReadView/WorkspacePageCursor。

```text
[QueryHandlers.get_view -> WorkspaceQueryService.get_view]
  | call ScopeService.resolve / VisibilityPort.resolve
  +-- Materialized: call find_partition / snapshot
  +-- Transient: call SourceReadService.read (owner no-write)
  | call bind_slice / revalidate
  | call WorkspacePageCursor.validate? / WorkspaceReadView.compose
  v
[Safe DTO + optional codec.encode] -- no write transaction
```

```rust
// [ScopeService.resolve(ActorContext actor, ScopeSelector selector)]
let scope = self.scope.resolve(&actor, &request.scope).await?;
// [VisibilityPort.resolve(ActorContext actor, WorkspaceScope scope, ReadSelection selection)]
let scope_visibility = self.visibility.resolve(&actor, &scope, &request.selection).await?;
match request.mode {
    ReadMode::Materialized => {
        // [WorkspaceReadPort.find_partition(ActorId principal, StableScopeKey scope)]
        let partition = self.read.find_partition(&actor.actor.actor_id, &scope.stable_key()).await?;
        // [WorkspaceReadPort.snapshot(WorkspacePartitionId partition)]
        let snapshot = self.read.snapshot(partition_id).await?;
        // Match current role, safety, projection generation, and all source bindings; reject missing/blocked.
    }
    ReadMode::Transient => {
        // [SourceReadService.read(ActorContext actor, WorkspaceScope scope, OwnerReadRequest request)]
        let slice = self.source.read(&actor, &scope, &owner_read_request).await?;
        // Repeat only for the explicit bounded source selection; no durable read basis or overlay.
    }
}
// [VisibilityPort.bind_slice(ActorContext actor, WorkspaceScope scope, SourceSlice slice)]
// Applied to each selected slice and every emitted reference; hidden data is removed before pagination.
// [VisibilityPort.revalidate(ActorContext actor, WorkspaceScope scope, [VisibilityBinding] bindings)]
let visibility_context = self.visibility.revalidate(&actor, &scope, &bindings).await?;
// [WorkspaceCursorCodec.decode(WorkspacePageToken token)]
// [WorkspacePageCursor.validate(WorkspaceReadContext context)]
// If after is present, validate all bound axes; any mismatch returns CursorInvalid.
// [WorkspaceReadView.compose(WorkspaceReadInputs inputs, Vec<VisibilityBinding> bindings)]
let view = WorkspaceReadView::compose(inputs, bindings)?;
// [WorkspaceCursorCodec.encode(WorkspacePageCursor cursor)]
// Only for a proven safe materialized next page. Map fields exactly to WorkspaceViewResponse.
```

字段来源：owner_read_request由selection+正式scope映射，001未定义禁止构造；SourceReadService.read内部先OwnerReadPort.read、VisibilityPort.bind_result、SourceSlice.from_owner，避免为取得binding先构造尚未授权SourceSlice的循环。物化basis来自snapshot；Transient basis只owner版本，page.next None。freshness/coverage分别依据owner/current失效，不由items数量推导。事务：只有read snapshot，无分区/overlay写。错误：无current/不安全NotAvailable，缺schema ContractBlocked，旧token CursorInvalid。测试切口：空页先授权、stale仍授权、不同mode无fallback、current切换拒旧页、所有query依赖可替只读fake但不证明真实owner。单flow停审：构造/端口/错误/无写闭合，外部safe schema仍blocked。

#### ListWorkspaceInboxFlow

依据/取舍：从已提交current的Inbox派生，按现时allow→本地filter→稳定排序，不把source consume cursor当用户read边界。

```text
[QueryHandlers.list_inbox -> WorkspaceQueryService.list_inbox]
  | call ScopeService.resolve / VisibilityPort.resolve(Inbox)
  | call find_partition / snapshot
  | call VisibilityPort.bind_subject / AttentionResolverPort.relate
  v
[ReadCursor.classify -> filter -> stable sort -> cursor.validate]
  | call VisibilityPort.revalidate / codec.encode
  v
[WorkspaceInboxResponse] -- no writes
```

```rust
// [ScopeService.resolve(ActorContext actor, ScopeSelector selector)]
let scope = self.scope.resolve(&actor, &request.scope).await?;
// [VisibilityPort.resolve(ActorContext actor, WorkspaceScope scope, ReadSelection selection)]
let list_basis = self.visibility.resolve(&actor, &scope, &ReadSelection::Inbox).await?;
// [WorkspaceReadPort.snapshot(WorkspacePartitionId partition)]
let snapshot = self.read.snapshot(partition_id).await?; // find_partition first, exact stable scope match.
for item in visible_present_candidates {
    // [VisibilityPort.bind_subject(ActorContext actor, WorkspaceScope scope, OwnerSubjectRef subject)]
    let binding = self.visibility.bind_subject(&actor, &scope, item.source_ref()).await?;
    // [AttentionResolverPort.relate(ActorContext actor, WorkspaceScope scope, ReadCursor cursor, InboxItem item)]
    // Only when a stored matching-stream cursor exists; no proof means Unknown, not Read.
    // [ReadCursor.classify(InboxItem item, OwnerAttentionRelation relation)]
    let read = cursor.classify(item, &relation);
    // Copy item_id, subject, attention, state, read, and visible local flags to the Step8 DTO.
}
// [WorkspacePageCursor.validate(WorkspaceReadContext context)]
// Compare actor/scope/generation/view/local/selection/order/limit/visibility; filter before counting.
// [VisibilityPort.revalidate(ActorContext actor, WorkspaceScope scope, [VisibilityBinding] bindings)]
let visibility = self.visibility.revalidate(&actor, &scope, &bindings).await?;
// [WorkspaceCursorCodec.encode(WorkspacePageCursor cursor)]
// Return only a safe continuation; never update a user read cursor.
```

构造/分支：没有local overlay默认内存偏好，read Unknown；有MarkUnread override优先Unread，不用relation Missing错误把override当Read；无stream关系则Unknown，visibility缺失则不输出item或整体fail-closed，二者不同。Withdrawn不返回，local hidden依偏好过滤；排序StableIdentity=(0,id)，PinnedFirst=(0/1,id)，returned只实际项。无source/general页协议借用。事务：no-write。测试：读无local不新增行；override跨rebuild保留；local revision变化拒旧页；hidden不影响公开total（不存在total字段）；不比较source cursor。停审：public字段/状态/分页全部有来源。

#### GetWorkspaceLocalStateFlow

```text
[QueryHandlers.get_local_state -> WorkspaceQueryService.get_local_state]
  | call scope.resolve / visibility.resolve(Local)
  | call find_partition / snapshot
  +-- absent -> LocalStateSurface.Absent
  +-- present -> bind subject/attention refs -> revalidate
  v
[WorkspaceLocalStateResponse] -- no initialize/change/refresh
```

```rust
// [ScopeService.resolve(ActorContext actor, ScopeSelector selector)]
let scope = self.scope.resolve(&actor, &request.scope).await?;
// [VisibilityPort.resolve(ActorContext actor, WorkspaceScope scope, ReadSelection selection)]
let allow = self.visibility.resolve(&actor, &scope, &ReadSelection::Local).await?;
// [WorkspaceReadPort.find_partition(ActorId principal, StableScopeKey scope)]
let partition = self.read.find_partition(&actor.actor.actor_id, &scope.stable_key()).await?;
// [WorkspaceReadPort.snapshot(WorkspacePartitionId partition)]
// If a partition exists, read local state; missing partition or local -> Absent, without initialization.
// [VisibilityPort.bind_subject(ActorContext actor, WorkspaceScope scope, OwnerSubjectRef subject)]
// Revalidate each emitted focus, last-opened and attention-related reference using formal mapping.
// [VisibilityPort.revalidate(ActorContext actor, WorkspaceScope scope, [VisibilityBinding] bindings)]
// Copy only Step8 WorkspaceLocalStateView fields; no read_cursor/last_opened mutation.
```

依据/取舍：局部state存在与否仅在scope可公开后表达；Absent不是默认persist。read stream/override输出需004正式safe映射，缺失不得泄露内部全集。errors按Q0；测试：无分区Absent/无写，部分旧ref撤销统一None无原因，scope denied无scope/Absent可见，读不清意图。停审：完整字段映射、no-write。

#### GetWorkspaceOperationResultFlow

```text
[QueryHandlers.get_operation_result -> WorkspaceQueryService.get_operation_result]
  | call scope.resolve / visibility.resolve(Operation)
  | call snapshot / operation_by_ref
  | call revalidate for result scope and refs
  v
[Exact stored result or SafeReadFailure] -- never re-execute
```

```rust
// [ScopeService.resolve(ActorContext actor, ScopeSelector selector)]
let scope = self.scope.resolve(&actor, &request.scope).await?;
// [VisibilityPort.resolve(ActorContext actor, WorkspaceScope scope, ReadSelection selection)]
let allow = self.visibility.resolve(&actor, &scope, &ReadSelection::Operation).await?;
// [WorkspaceReadPort.snapshot(WorkspacePartitionId partition)]
let snapshot = self.read.snapshot(request.partition).await?;
// [WorkspaceReadPort.operation_by_ref(WorkspacePartitionId partition, WorkspaceOperationRef result)]
let record = self.read.operation_by_ref(request.partition, request.operation_ref).await?;
// [WorkspaceOperationRecord.validate_stored()]
// Validate kind/basis/partition and require current visibility of every returned reference.
// [VisibilityPort.revalidate(ActorContext actor, WorkspaceScope scope, [VisibilityBinding] bindings)]
// Return WorkspaceOperationResponse without changing the original result or creating a receipt.
```

字段：result_ref和result原record；读取请求没有operation_key替代field，未知结果ref不可猜。记录None→NotAvailable，不能NotCommitted；无法获取ref时同原幂等键重入原写入口做lookup。读取只返回不可变原业务结果，安全决定可能改变是否可返回但不能修改历史。测试：跨partition ref拒绝、结果撤权拒绝、无记录不重做、duplicate字段保持原status/revision。停审：stored结果可回读，权限与不可变性分离。

#### GetWorkspaceRecoveryStatusFlow

```text
[QueryHandlers.get_recovery_status -> WorkspaceQueryService.get_recovery_status]
  | call scope.resolve / visibility.resolve(Recovery)
  | call recovery_snapshot
  | check state-field combinations / revalidate
  v
[WorkspaceRecoveryResponse] -- never advance a job
```

```rust
// [ScopeService.resolve(ActorContext actor, ScopeSelector selector)]
let scope = self.scope.resolve(&actor, &request.scope).await?;
// [VisibilityPort.resolve(ActorContext actor, WorkspaceScope scope, ReadSelection selection)]
let allow = self.visibility.resolve(&actor, &scope, &ReadSelection::Recovery).await?;
// [WorkspaceReadPort.recovery_snapshot(WorkspacePartitionId partition, RebuildAttemptId attempt)]
let snapshot = self.read.recovery_snapshot(request.partition, request.attempt).await?;
// [RebuildAttempt.validate_stored()]
// Blocked/Failed require failure; Superseded requires replacement; candidate belongs to this attempt.
// [VisibilityPort.revalidate(ActorContext actor, WorkspaceScope scope, [VisibilityBinding] bindings)]
// Map attempt version/status and generation role/safety from this single snapshot.
```

依据/取舍：maintenance诊断不是执行状态owner；候选已Completed后其role可能Retired，不能强制把Completed映射Current。missing attempt NotAvailable；candidate SafetyBlocked可以在获准诊断输出safety但不能输出源敏感proof。测试：Requested读取不start，Blocked终态读不复活，status与failure组合一致，current pointer与candidate不同不混淆。停审：无写/无run_id，版本来源闭合。

#### ExportWorkspaceReadModelFlow

```text
[QueryHandlers.export_read_model -> WorkspaceQueryService.export_read_model]
  | call scope.resolve / visibility.resolve
  | call snapshot OR SourceReadService.read (explicit mode)
  | call bind_slice / cursor.validate / revalidate
  v
[WorkspaceReadView.compose -> WorkspaceExportResponse]
  | no archive adapter / marker / artifact / acknowledgement
```

```rust
// [ScopeService.resolve(ActorContext actor, ScopeSelector selector)]
let scope = self.scope.resolve(&actor, &request.scope).await?;
// [VisibilityPort.resolve(ActorContext actor, WorkspaceScope scope, ReadSelection selection)]
let allow = self.visibility.resolve(&actor, &scope, &request.selection).await?;
// [WorkspaceReadPort.snapshot(WorkspacePartitionId partition)]
// Materialized only; explicit Transient instead calls SourceReadService.read for the bounded selection.
// [WorkspacePageCursor.validate(WorkspaceReadContext context)]
// QueryKind::Export is required; View tokens are not interchangeable.
// [VisibilityPort.revalidate(ActorContext actor, WorkspaceScope scope, [VisibilityBinding] bindings)]
let current = self.visibility.revalidate(&actor, &scope, &bindings).await?;
// [WorkspaceReadView.compose(WorkspaceReadInputs inputs, Vec<VisibilityBinding> bindings)]
let view = WorkspaceReadView::compose(inputs, bindings)?;
// Map exactly to WorkspaceExportResponse { read_model, schema_version: 1 }.
```

与GetWorkspaceView共用取数规则而非调用其public入口（避免QueryKind漂移）；mode/页绑定独立。输出不含archive cursor/handoff receipt/可归档baseline证明；下游006未闭合不在本仓设计archive protocol。测试：export零写、无outbound、撤权阻止后续页、Transient无durable token、schema版本不是source版本。停审：scope/field/ports/错误同Q0，独立export协议可回指。

Query族跨flow停审：六Query依赖只能读能力；没有reserve/save/append/initialize/mark_seen；codec随机nonce是无持久副作用的安全封装。所有source/proof缺失在对应port返回，不能借partial/stale绕开fail-closed。


### 7.5 Consumer：ConsumeSourceChangeFlow

依据/取舍：不把接收成功当应用成功；必须先正式event校验、已有target scope/source authority，后查terminal key。候选与current不同，使用Step7 source_snapshot，不使用默认current快照。目标CP3/4，source metadata/ordering抽取002未闭合即Blocked。

```text
[SourceChangeConsumer.consume_change -> ProjectionApplyService.consume_change]
  | call SourceEventPort.validate_change
  | call source_snapshot / scope.resolve / source_application
  | call SourceEventPort.classify
  +-- Applicable -> InboxProjector.derive -> projection.apply -> tx apply_source
  +-- Late       -> unchanged projection + terminal record -> tx apply_source
  +-- Gap        -> projection.mark_gap -> tx mark_gap (no terminal key)
  +-- Blocked    -> no write
  v
[Typed receipt; Unknown -> resolve_commit] -- no bus ACK fact
```

```rust
// [SourceEventPort.validate_change(ConsumeSourceChangeRequest input)]
let trusted = self.events.validate_change(&request).await?;
// [WorkspaceReadPort.source_snapshot(WorkspacePartitionId partition, GenerationId generation)]
let before = self.read.source_snapshot(request.partition, request.generation).await?;
// [ScopeService.resolve(ActorContext actor, ScopeSelector selector)]
// Resolve the formal target selector and check source actor may act for this partition; no id parsing.
// [WorkspaceReadPort.source_application(SourceApplicationKey key)]
let prior = self.read.source_application(&key).await?;
// Same key+digest -> Duplicate with original disposition/revision/cursor; different digest -> Conflict.
// [SourceEventPort.classify(TrustedSourceChange change, SourceTargetSnapshot snapshot)]
let relation = self.events.classify(&trusted, &before).await?;
match relation {
    SourceRelation::Applicable(evaluation) => {
        // [IdPort.application()]
        let application_id = self.ids.application().await?;
        // [InboxProjector.derive(WorkspacePartitionId partition, GenerationId generation, Vec<OwnerAttentionInput> inputs, ApplicationResultRef application)]
        let inbox = InboxProjector::new().derive(request.partition, request.generation, evaluation.attention, application_id)?;
        // [PartitionProjection.apply(SourceSlice slice, SourceUpdateMode mode, Vec<InboxItem> inbox, SourceCoverage coverage, ViewRevision expected)]
        projection.apply(evaluation.slice, evaluation.mode, inbox, evaluation.coverage, expected_view)?;
        // [SourceApplicationRecord.record(SourceApplicationKey key, SafeInputDigest digest, TerminalApplyDisposition outcome, ApplicationResultRef result_ref, SourceCursorBasis cursor, ViewRevision revision)]
        // Construct Applied using the resulting safe cursor and tentative next view revision.
        // [GenerationState.invalidate_validation()]
        // Candidate only, if Validated; Ready attempt also revalidate, in the same SourceApplyCommit.
        // [WorkspaceAtomicStore.apply_source(SourceApplyCommit change)]
        let outcome = self.store.apply_source(change).await?;
    }
    SourceRelation::Late(basis) => {
        // [SourceApplicationRecord.record(SourceApplicationKey key, SafeInputDigest digest, TerminalApplyDisposition outcome, ApplicationResultRef result_ref, SourceCursorBasis cursor, ViewRevision revision)]
        // LateIgnored references the unchanged safe cursor/revision, not the obsolete input cursor.
        // [WorkspaceAtomicStore.apply_source(SourceApplyCommit change)]
        let outcome = self.store.apply_source(change).await?;
    }
    SourceRelation::Gap(basis) => {
        // [IdPort.gap()]
        // Reuse an already equivalent stored gap; otherwise allocate a new local gap identity.
        // [PartitionProjection.mark_gap(SourceStreamRef source, GapRef gap, ViewRevision expected)]
        projection.mark_gap(stream, gap, expected_view)?;
        // [WorkspaceAtomicStore.mark_gap(SourceGapCommit change)]
        let outcome = self.store.mark_gap(change).await?;
    }
    SourceRelation::Blocked => { /* Return Blocked; no source terminal record. */ }
}
```

构造前置：SourceEvaluation的slice需SourceReadService.read/正式查询与现时VisibilityBinding，attention只明示input；classify负责owner次序，不能源数字相减。Current必须partition pointer仍指目标；Candidate仅非终态attempt且与source安全栅栏匹配；Retired拒绝。Applicable原子保存projection全部slice/Inbox/coverage/cursor/next revision及SourceApplicationRecord；Late仅record，projection/attempt/view不变；Gap局部coverage/必要candidate validation变化，无terminal应用record，cursor/watermark不推进。重复事件发生在已有Gap时可重新正式判定，bridge证明到齐才能应用，不被Gap占死。

错误/未知：unsupported或正文Rejected，missing source proof Blocked，短暂来源失败Retry，异digest Conflict；commit unknown查权威结果，不回Applied或bus成功ACK。事务未知的Gap通过resolve_commit::Gap读取本地gap，不转为Source终局。测试切口：duplicate不再derive；乱序late不退；gap重投可恢复；同key异digest保持旧记录；切换/candidate supersede竞态CAS拒绝；CP3/4半保存不可见；无源写。单flow停审：对象/port/事务/状态/receipt闭合，002/003/004正向契约仍blocked。

### 7.6 Consumer：ConsumeSourceInvalidationFlow

依据/取舍：失效是现时owning决定的局部镜像；fanout不能制造全局事务。scope actor不能统一改成源服务当业务principal，target principal关系须owning source正式授权。

```text
[SourceInvalidationConsumer.consume_invalidation -> RecoveryService.consume_invalidation]
  | call SourceEventPort.validate_invalidation
  | call WorkspaceReadPort.affected_targets
  | for each bounded existing target
  |   call scope.resolve / operation / invalidation_snapshot
  |   call VisibilityPort.validate_invalidation
  |   call InvalidationRecord.record / generation.invalidate / projection.invalidate
  |   tx WorkspaceAtomicStore.invalidate (one partition only)
  v
[SourceInvalidationPageReceipt] -- each item independent; no global terminal key
```

```rust
// [SourceEventPort.validate_invalidation(ConsumeSourceInvalidationRequest input)]
let trusted = self.events.validate_invalidation(&request).await?;
// [WorkspaceReadPort.affected_targets(OwnerAffectedSelection affected, Option<WorkspacePartitionId> after, u32 limit)]
let page = self.read.affected_targets(&affected, request.after, request.limit).await?; // target=None only.
// [WorkspaceReadPort.affected_target(OwnerAffectedSelection affected, WorkspacePartitionId partition)]
// target=Some uses affected_target directly, not a limited first page.
// target=Some must be proven contained by the formal affected selection; no guessed scope.
for targets in page.items {
    // [ScopeService.resolve(ActorContext actor, ScopeSelector selector)]
    // Validate the source actor's formal authority for targets.partition and its effective principal.
    // [WorkspaceReadPort.operation(WorkspaceOperationKey key)]
    let prior = self.read.operation(&child_key).await?; // Exact per-target duplicate, not global replay.
    // [WorkspaceReadPort.invalidation_snapshot(ExistingWorkspaceTargetSet targets)]
    let before = self.read.invalidation_snapshot(&targets).await?;
    // [VisibilityPort.validate_invalidation(ActorContext actor, WorkspaceScope scope, InvalidationBasis basis, ExistingWorkspaceTargetSet targets)]
    let basis = self.visibility.validate_invalidation(&actor, &scope, &basis, &targets).await?;
    // [InvalidationRecord.record(InvalidationId id, ExistingWorkspaceTargetSet targets, InvalidationBasis basis, WorkspaceOperationRef operation)]
    let record = InvalidationRecord::record(id, targets, basis, result_ref)?;
    // [GenerationState.invalidate(InvalidationRecord record)]
    // [PartitionProjection.invalidate(InvalidationRecord record, ViewRevision expected)]
    // SafetyBlocked also calls RebuildAttempt.block for each non-terminal affected candidate.
    // [WorkspaceAtomicStore.invalidate(InvalidationCommit change)]
    let outcome = self.store.invalidate(change).await?; // Exactly one partition's targets+fences+result.
}
// Return per-target receipts and the internal page.next; no global event success record.
```

字段来源：child idempotency key=正式event identity canonical + partition id + target principal canonical，namespace SourceInvalidation，actor字段保留认证source actor，scope稳定key；缺codec005/002不能造key。相同事件不同target无碰撞；同target重复返原effect。安全失效先于状态输出生效：即使fanout未到，Query当前owner决定也必须拒绝；新candidate需要新baseline+当前proof能证明覆盖/取代旧失效，不能仅因为generation新就绕source栅栏。

DataStale只强制read freshness，保留coverage与safety；SafetyBlocked置目标generation safety/coverage并阻止切换，candidate attempt非终态变Blocked，终态保持不复活。每分区CAS所有before view/attempt/partition，after显式传入，不让store猜字段。target=None分页只本次有界处理；中途失败保留已提交项，next不得跳过未处理目标（同一返回页必须逐项给receipt；unknown项客户端先解决再推进）。NoTargets只当次无目标观察。测试切口：多target部分成功/unknown不假全局成功、无target不建分区、重复失效不再次next版本、cutover竞态安全、fake不能制造撤销proof。停审：失效来源/目标/事务/结果链完整。


### 7.7 Operations：RequestWorkspaceRecoveryFlow

依据/取舍：Request只记录明确维护意图；不在创建路径读取baseline，也不把空candidate声明Complete。mode Refresh/Rebuild都使用owner baseline，区别只在明确维护目的，不引入第二执行truth。

```text
[RecoveryHandlers.request_recovery -> RecoveryService.request_recovery]
  | call scope.resolve / authorize_operation / operation
  | call snapshot / IdPort.attempt / generation
  v
[RebuildAttempt.request + GenerationState.candidate + PartitionProjection.empty_candidate]
  | tx WorkspaceAtomicStore.save_recovery: new attempt/candidate/result
  v
[Requested + Candidate/Unverified; current unchanged]
```

```rust
// [ScopeService.resolve(ActorContext actor, ScopeSelector selector)]
let scope = self.scope.resolve(&actor, &request.scope).await?;
// [ScopeService.authorize_operation(ActorContext actor, WorkspaceScope scope, OperationKind kind)]
self.scope.authorize_operation(&actor, &scope, OperationKind::RequestRecovery).await?;
// [WorkspaceReadPort.operation(WorkspaceOperationKey key)]
let prior = self.read.operation(&key).await?; // S0 duplicate before allocation.
// [WorkspaceReadPort.snapshot(WorkspacePartitionId partition)]
let before = self.read.snapshot(request.partition).await?;
// [IdPort.attempt()]
let attempt_id = self.ids.attempt().await?;
// [IdPort.generation()]
let generation_id = self.ids.generation().await?;
// [RebuildAttempt.request(RebuildAttemptId id, WorkspacePartitionId partition, GenerationId candidate, RecoveryMode mode, PartitionVersion expected)]
let attempt = RebuildAttempt::request(attempt_id, request.partition, generation_id, request.mode, request.expected_partition);
// [GenerationState.candidate(WorkspacePartitionId partition, GenerationId id)]
let candidate = GenerationState::candidate(request.partition, generation_id);
// [PartitionProjection.empty_candidate(WorkspacePartitionId partition, GenerationId generation)]
let projection = PartitionProjection::empty_candidate(request.partition, generation_id);
// [WorkspaceAtomicStore.save_recovery(RecoveryCommit change)]
let outcome = self.store.save_recovery(change).await?; // TX: absence/partition CAS + requested attempt/candidate/result.
```

构造：新attempt version0提交为1；candidate projection revision0表示未应用数据，不对外作物化view；baseline/continuation/failure/replacement None。RecoveryCommit.before None仅表示新attempt，其expected_partition来自attempt字段且必须与读取分区相等；baseline_bindings空。允许多个显式candidate并存，通过partition pointer CAS决定胜者，不自动supersede别的尝试；资源上限Step14，超限拒绝不偷偷替换。CP5/旧current不变。

错误：分区不匹配/expected变化Conflict；未获准NotAvailable；关键source合同未绑定可创建Requested意图但之后Advance必须Blocked，不能声称恢复可执行。测试：duplicate不分配新candidate，新Request不读baseline，first generation无current也可Request，fail提交不留下孤立candidate，unknown查原result。停审：工厂/初始条件/原子/缺口与实施事实分离。

### 7.8 Operations：AdvanceWorkspaceRecoveryFlow

依据/取舍：必须明确每个状态的一个有界执行分支；不能把Requested→Completed写成后台黑盒。全路径先S0 lookup、scope操作授权、recovery_snapshot、expected_attempt一致；终态原key返回历史结果，新key拒绝InvalidTransition→Conflict。目标CP6并复用CP3/4构建候选。

```text
[RecoveryHandlers.advance_recovery -> RecoveryService.advance_recovery]
  | call scope.resolve / authorize_operation / operation / recovery_snapshot
  +-- Requested  -> attempt.start_baseline -> tx save_recovery
  +-- Baselining -> RecoverySourcePort.baseline -> projection.apply -> accept_baseline -> tx save_recovery
  +-- CatchingUp -> RecoverySourcePort.catch_up -> projection.apply -> catch_up -> tx save_recovery
  +-- Validating -> coverage + visibility -> candidate.validate + mark_ready -> tx save_recovery
  +-- Ready      -> recheck basis
  |                 +-- unchanged/safe -> promote/retire/select/complete -> tx cutover
  |                 +-- lawful change -> invalidate_validation/revalidate -> tx save_recovery
  |                 +-- unsafe/missing proof -> block -> tx save_recovery
  +-- terminal   -> reject (duplicate replay already handled)
```

```rust
// [WorkspaceReadPort.recovery_snapshot(WorkspacePartitionId partition, RebuildAttemptId attempt)]
let before = self.read.recovery_snapshot(request.partition, request.attempt).await?;
// Validate scope, expected_attempt, safety fences, and the explicit budget before this match.
match attempt.status() {
    RebuildStatus::Requested => {
        // [RebuildAttempt.start_baseline(AttemptVersion expected)]
        attempt.start_baseline(request.expected_attempt)?;
        // [WorkspaceAtomicStore.save_recovery(RecoveryCommit change)]
        self.store.save_recovery(change).await?;
    }
    RebuildStatus::Baselining => {
        // [RecoverySourcePort.baseline(ActorContext actor, WorkspaceScope scope, RebuildAttempt attempt, u32 budget)]
        let batch = self.sources.baseline(&actor, &scope, &attempt, request.budget).await?;
        // [InboxProjector.derive(WorkspacePartitionId partition, GenerationId generation, Vec<OwnerAttentionInput> inputs, ApplicationResultRef application)]
        // [PartitionProjection.apply(SourceSlice slice, SourceUpdateMode mode, Vec<InboxItem> inbox, SourceCoverage coverage, ViewRevision expected)]
        // Apply each validated bounded evaluation to candidate only; generate persisted BaselineApplicationBinding.
        // [RebuildAttempt.accept_baseline(OwnerBaselineBasis basis, Option<OwnerBaselineContinuation> continuation, bool complete, AttemptVersion expected)]
        attempt.accept_baseline(batch.baseline, batch.continuation, batch.phase_complete, request.expected_attempt)?;
        // [WorkspaceAtomicStore.save_recovery(RecoveryCommit change)]
        self.store.save_recovery(change).await?; // TX includes baseline bindings and local result.
    }
    RebuildStatus::CatchingUp => {
        // [RecoverySourcePort.catch_up(ActorContext actor, WorkspaceScope scope, RebuildAttempt attempt, u32 budget)]
        let batch = self.sources.catch_up(&actor, &scope, &attempt, request.budget).await?;
        // Apply only formal continuation inputs, using the same candidate-local atomic batch rule.
        // [RebuildAttempt.catch_up(OwnerBaselineContinuation continuation, bool complete, AttemptVersion expected)]
        attempt.catch_up(continuation, batch.phase_complete, request.expected_attempt)?;
        // [WorkspaceAtomicStore.save_recovery(RecoveryCommit change)]
        self.store.save_recovery(change).await?;
    }
    RebuildStatus::Validating => {
        // [RecoverySourcePort.coverage(WorkspaceScope scope, PartitionProjection candidate)]
        let coverage = self.sources.coverage(&scope, &candidate_projection).await?;
        // [VisibilityPort.revalidate(ActorContext actor, WorkspaceScope scope, [VisibilityBinding] bindings)]
        let visibility = self.visibility.revalidate(&actor, &scope, &bindings).await?;
        // [CutoverBasis.try_new(...)]
        // Build from exact partition/current/candidate revision, attempt next version, coverage, visibility, invalidations.
        // [GenerationState.validate(CutoverBasis basis)]
        candidate.validate(basis.clone())?;
        // [RebuildAttempt.mark_ready(CutoverBasis basis, AttemptVersion expected)]
        attempt.mark_ready(&basis, request.expected_attempt)?;
        // [WorkspaceAtomicStore.save_recovery(RecoveryCommit change)]
        self.store.save_recovery(change).await?;
    }
    RebuildStatus::Ready => {
        // [RecoverySourcePort.coverage(WorkspaceScope scope, PartitionProjection candidate)]
        // [VisibilityPort.revalidate(ActorContext actor, WorkspaceScope scope, [VisibilityBinding] bindings)]
        // Recheck source safety and every CutoverBasis field before either branch below.
        // [GenerationState.promote(CutoverBasis basis)]
        candidate.promote(&basis)?;
        // [GenerationState.retire()]
        // Retire old current iff one existed in the same snapshot.
        // [WorkspacePartition.select_generation(GenerationId generation, PartitionVersion expected)]
        partition.select_generation(candidate_id, basis.expected_partition)?;
        // [RebuildAttempt.complete(CutoverBasis basis, AttemptVersion expected)]
        attempt.complete(&basis, request.expected_attempt)?;
        // [WorkspaceAtomicStore.cutover(CutoverCommit change)]
        self.store.cutover(change).await?;
    }
    RebuildStatus::Completed | RebuildStatus::Blocked | RebuildStatus::Failed | RebuildStatus::Superseded => {
        return Err(ApplicationError::Conflict);
    }
}
```

上段Ready的promote只在basis完全匹配分支；并发合法变化分支明确调用`GenerationState.invalidate_validation()`（若Validated）、`RebuildAttempt.revalidate(current PartitionVersion, expected AttemptVersion)`，经save_recovery保留候选回Validating；非合法变化/安全失效不能走revalidate。为消除Rust借用猜测，实现match使用status只读副本，片段仅设计。

| 阶段/分支 | 必填来源 / 校验 | 写集与版本 | 失败处理 |
|---|---|---|---|
| Requested | 已存attempt.expected_partition、target、mode | attempt next version，candidate不变 | source合同未绑定在调用前可Blocked，不假执行 |
| Baselining | owner正式baseline声明source全集、片段连续性、phase_complete proof；非末批continuation必Some | candidate projection每个实质apply next view；attempt一次next；同批Inbox application binding+result | invalid baseline→Failed(InvalidBaseline)；合同缺失→Blocked(ContractBlocked) |
| CatchingUp | 与baseline绑定的正式接续，continuation即使complete也需最终接续basis以调用domain方法 | 同candidate，不写current；application mapping同事务 | 缺口且已有正式gap记录→Blocked(SourceGap, gap)；无持久gap则Blocked(ContractBlocked)，不发明gap ref |
| Validating | 全声明source coverage可证Complete、scope/item当前visibility、candidate不SafetyBlocked、全部local CAS轴 | candidate Validated与attempt Ready同提交；basis.expected_attempt=本次next attempt version | 缺proof→Blocked，临时I/O无写返回Unavailable |
| Ready同basis | re-read/revalidate安全且partition/current/candidate/attempt/失效集合一致 | old Current→Retired，candidate→Current，pointer/version、attempt→Completed、result同事务；CP5完全保留 | CAS失败不报告Completed；先read再显式合法revalidate；Unknown先resolve |
| Ready合法变化 | 变化不是任何安全失效/coverage缺口，新版本仍可验证 | invalidate_validation、attempt Ready→Validating一次next；不改pointer | 恶意/安全变化不能按并发处理 |
| 安全失效 | 已存InvalidationRecord且SafetyBlocked | 非终态→Blocked(SafetyInvalidated, invalidation)，current不替换 | 无正式invalidation ref不能伪造SafetyInvalidated，改安全无证明Blocked(ContractBlocked) |
| 技术失败 | read/owner/commit返回 | commit前可无写Unavailable；若确需终局失败且store可用，可fail(StorageFailure) | commit unknown禁止记录Failed替代未知原结果 |

每次Advance结束只输出本次原子stored Recovery结果，不循环跨阶段。baseline/source游标不互换；重建还未捕获的source事件若无正式buffer/continuation合同则Blocked，不能并发乱灌；SourceEventPort.classify/RecoverySourcePort提供同baseline接续语义002。SourceApplicationRecord不能作为baseline伪事件；BaselineApplicationBinding与完整batch/result同提交，query不使用该内部raw proof输出。

测试切口：各状态一个分支；非末批continuation缺失拒绝；同key预算变化Conflict；Blocked/Failed四终态不复活；Ready basis使用提交后attempt version；本地overlay并发更改不丢失（不切CP5）；source事件/失效/CAS并发失败不部分promote；未知提交先查；当前坏视图不自动换retired。停审：状态触发/字段/port/写集/未知/测试边界闭合；owner baseline/continuation/safety仍阻塞正向实施。

### 7.9 Operations：SupersedeWorkspaceRecoveryFlow

```text
[RecoveryHandlers.supersede_recovery -> RecoveryService.supersede_recovery]
  | call scope.resolve / authorize_operation / operation
  | call recovery_snapshot(old) / recovery_snapshot(replacement)
  v
[old_attempt.supersede]
  | tx save_recovery: compare old version + replacement active + no cycle + result
  v
[Superseded with replacement; no automatic start/cutover]
```

```rust
// [WorkspaceReadPort.operation(WorkspaceOperationKey key)]
let prior = self.read.operation(&key).await?; // After current scope/operation permission checks.
// [WorkspaceReadPort.recovery_snapshot(WorkspacePartitionId partition, RebuildAttemptId attempt)]
let old = self.read.recovery_snapshot(request.partition, request.attempt).await?;
let replacement = self.read.recovery_snapshot(request.partition, request.replacement).await?;
// Validate old expected, different ids, same partition, active replacement, and no replacement cycle.
// [RebuildAttempt.supersede(RebuildAttemptId replacement, AttemptVersion expected)]
attempt.supersede(request.replacement, request.expected_attempt)?;
// [WorkspaceAtomicStore.save_recovery(RecoveryCommit change)]
let outcome = self.store.save_recovery(change).await?; // Atomic replacement-active guard, not just stale pre-read.
```

构造：旧attempt.replacement变Some，旧attempt next、failure None，candidate/CP5/current不变；source consumer必须读取旧attempt终态后拒该candidate再写。store需同事务读取replacement当前状态/引用链，竞争Supersede A→B/B→A只允许一方通过；不允许把Completed作为旧目标或把新candidate偷当已可用current。errors missing/terminal/conflict按Step8，不回替代链细节；unknown S0。测试：交叉supersede无环、new replacement终态竞态拒绝、duplicate不修改新attempt、旧candidate事件拒绝。停审：读/写/状态/引用存在性闭合。

### 7.10 Operations：InvalidateWorkspaceViewFlow

```text
[InvalidationHandler.invalidate_view -> RecoveryService.invalidate_view]
  | call scope.resolve / authorize_operation / operation / snapshot
  | validate exact existing target set -> call invalidation_snapshot
  | call VisibilityPort.validate_invalidation
  v
[record + generation.invalidate + projection.invalidate + affected attempt.block?]
  | tx WorkspaceAtomicStore.invalidate: per-target CAS + fence + result
  v
[Invalidated result; current pointer never rewritten]
```

```rust
// [ScopeService.authorize_operation(ActorContext actor, WorkspaceScope scope, OperationKind kind)]
self.scope.authorize_operation(&actor, &scope, OperationKind::InvalidateView).await?;
// [WorkspaceReadPort.operation(WorkspaceOperationKey key)]
let prior = self.read.operation(&key).await?;
// [ExistingWorkspaceTargetSet.try_new(WorkspacePartitionId partition, Vec<GenerationId> generations, Vec<SourceStreamRef> sources)]
let targets = ExistingWorkspaceTargetSet::try_new(request.partition, request.generations, request.sources)?;
// [WorkspaceReadPort.invalidation_snapshot(ExistingWorkspaceTargetSet targets)]
let before = self.read.invalidation_snapshot(&targets).await?;
// [VisibilityPort.validate_invalidation(ActorContext actor, WorkspaceScope scope, InvalidationBasis basis, ExistingWorkspaceTargetSet targets)]
let basis = self.visibility.validate_invalidation(&actor, &scope, &request.basis, &targets).await?;
// [InvalidationRecord.record(InvalidationId id, ExistingWorkspaceTargetSet targets, InvalidationBasis basis, WorkspaceOperationRef operation)]
let record = InvalidationRecord::record(id, targets, basis, operation_ref)?;
// [GenerationState.invalidate(InvalidationRecord record)]
// [PartitionProjection.invalidate(InvalidationRecord record, ViewRevision expected)]
// For each target, produce an explicit after; SafetyBlocked also blocks a non-terminal attempt.
// [WorkspaceAtomicStore.invalidate(InvalidationCommit change)]
let outcome = self.store.invalidate(change).await?;
```

额外pre-read snapshot验证request.expected_partition与scope/principal，一切existing targets都必须存在；不能任意ID扩展范围。LocalDataStale只生成DataStale，不动generation safety/coverage、不假删除；Owner proof effect只能来自正式有效的owning依据；SafetyBlocked不卸载pointer、不回退retired、不丢CP5。已存在record的重复key不再次next view。事务为单分区全部指定targets/各自view与attempt CAS+record+result，没有跨分区原子或owner写。

测试：DataStale/安全两种副作用不同、空target拒绝、foreign generation拒绝、权限角色hint不能override、部分目标CAS失败整批rollback、unknown不能报成功、无上游反写。停审：独立维护流与consumer授权/幂等namespace不同，效果规则共享而非混入口。

### 7.11 跨flow闭环审查

| 审计 | 结论 / 修订 |
|---|---|
| 十四协议全覆盖 | 两Command/六Query/两Consumer/四Operations都有独立图、伪代码、构造/事务/错误/测试切口 |
| port缺口回源 | source_snapshot、invalidation_snapshot、affected_target、baseline_application、bind_result、validate_invalidation已回修Step7，不在flow临时凭空调用 |
| 对象缺口回源 | PartitionProjection.mark_gap/invalidate与只读getter补6B；没有上游truth新对象 |
| 版本/事务 | 所有expected来自请求确认+原子读取；candidate/current隔离；proof外部有效性不由本地事务伪造 |
| baseline provenance | 同batch存BaselineApplicationBinding，Inbox application ref可回读；无伪source事件 |
| no-write/历史结果 | Query零写；source重复/操作重复读原值，不重执行；unknown未解决不能创造终局 |
| source无补真相 | partial/stale依然owner决定；WS-UP slots未绑定即blocked |
| 副作用 | 全无Outbox/publisher/上游command/归档写，trace仅Core关联+安全技术日志，无真实evidence |
| 后续边界 | Step10状态矩阵；Step11/12/13/14/16具体持久/恢复/并发/配置/测试未执行或进入，不伪装完成 |

历史审计：未复制governance accepted path trace/history/outbox连写、read not-visible marker、job run报告；只参照其逐flow可反查和transaction审查粒度。正式§8回填十四flow的合同内容，过程停审留本Step。


## 8. 回填草稿

§7十四独立flow与共享输入/错误/事务规则可回填正式§8；回源修订已同步Step6/7/8，正式03不装配。

## 9. 待确认

WS-UP-001~008/006-S保持open，具体正向schema/绑定仍blocked；不跨项目回写。

## 10. 下一步门禁

十四flow和跨flow审计完成，允许Step10；上游slots正向接入仍blocked，不进入实现或执行测试。
