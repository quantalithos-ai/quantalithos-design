# Step 9. 定义逐接口函数级处理流

### 1. Step 状态

- 状态:[x] 已确认
- 对应 SOP:`standards/document/详细设计讨论流程_SOP.md` Step 9
- 回填章节:`03-详细设计.md` §5.8 逐接口函数级处理流 / §7 API / Command / Query / Event / Job 协议契约 / §8 事务与一致性

### 2. 本步输入

| 输入 | 内容 | 本步使用方式 |
|---|---|---|
| `03_ddd_step_05_module_contracts.md` | 模块主轴和依赖方向 | 固定 handler 只调用 application service,service 只经 port 访问外部和持久化 |
| `03_ddd_step_06_object_contracts.md` | domain object、factory、policy、audit / outbox object | 固定每条 flow 的 domain method 和对象构造入口 |
| `03_ddd_step_07_trait_port_adapter_contracts.md` | repository、resolver、publisher、handoff、technical port | 固定每条 flow 使用的 port、UoW 和错误边界 |
| `03_ddd_step_08_protocol_contracts.md` | Command / Query / Event / Job DTO、handler 签名、错误映射 | 固定每条 flow 的入口函数、输入字段、response / event / report |
| `standards/document/详细设计讨论流程_SOP.md` | Step 9 输出格式和约束 | 确保每个接口都有调用图、伪代码、事务、错误、副作用和测试切口 |
| `standards/document/设计真相源闭环与可落码性标准.md` | 1:1 可落码标准 | 检查 DTO -> domain -> repository -> outbox / view 闭环 |

### 3. 分批写入记录

本 Step 按 `设计文档讨论中间产物规范.md` §3.4 分批写入:

| 批次 | 内容 | 状态 |
|---|---|---|
| 9.1 | 文件骨架、SOP 问题回答、共享处理模板、处理流总表 | [x] |
| 9.2 | 18 个 Command 函数级处理流 | [x] |
| 9.3 | 8 个 Query 函数级处理流 | [x] |
| 9.4 | 7 个 Inbound Event Consumer 和 10 个 Outbound Event 发布流 | [x] |
| 9.5 | 6 个 Operations Job、错误映射、闭环检查和回填草稿 | [x] |

### 4. SOP 问题回答

1. 哪些协议必须拥有函数级处理流?

   回答:Step 8 协议总表中标记“是否需要 Step 9 处理流 = 是”的 18 个 Command、8 个 Query、7 个 Inbound Event Consumer、10 个 Outbound Event 和 6 个 Operations Job 均必须拥有本 Step flow。Outbound Event 的 flow 是 outbox record 到 event payload 的发布转换流。

2. 每个处理流的入口函数是什么?

   回答:Command / Query 入口是 Step 8 给出的 `api::WorkCommandHandlers.handle_*` / `api::WorkQueryHandlers.handle_*`;Inbound Event 入口是 `worker::WorkInboundConsumers.consume_*`;Outbound Event 入口是 `WorkOutboxPublisher.publish_*_event` 或 `PublishWorkOutbox` job 内的 topic-specific dispatch;Operations Job 入口是 `jobs::WorkOperationsJobRunner.run_*`。

3. 入口函数调用哪些 application service、domain method、repository 和 outbox?

   回答:本文件 §8~§12 对每条 flow 独立列出调用图和伪代码。所有 repository / resolver / publisher / handoff 调用均回指 Step 7 trait;所有 domain method 均回指 Step 6 对象契约。

4. 入口 DTO 在哪一步被校验、派生、转换或用于构造 Domain 对象?

   回答:handler 校验 envelope、route/body 一致性和 metadata;application service 计算 canonical digest、幂等 reserve、lookup / resolver、生成 Work-owned id;domain factory / method 接收已校验 DTO 字段和派生字段。字段缺失按 Step 8 §12 映射为 reject / dead-letter / missing surface / report failed。

5. 如果构造目标对象所需字段缺失，处理流在哪个函数返回错误或进入恢复路径?

   回答:缺 actor / metadata / idempotency key 在 handler 或 job runner reject;repository `None` 在 service 映射 `NotFound` 或 query `Missing`;resolver unresolved 在 service 映射 `ExternalReferenceUnresolved` 或保存 unresolved reference state;domain policy rejected 在 domain method 返回 `DomainError`,由 service 映射 `DomainRejected`;publisher / handoff failure 不回滚已提交 truth,只更新 publish / handoff failure marker。

6. 事务在哪里开始，在哪里提交，哪些错误触发回滚?

   回答:写路径 application service 在幂等 key 初步校验后调用 `UnitOfWork.begin()`;repository truth 写入、audit trace、outbox enqueue、projection stale、idempotency complete 在同一 UoW 内完成;commit 前任何 repository / domain / resolver / idempotency error 均 rollback。outbound publish 对已经提交的 outbox record 单独开 UoW 标记 published / failed。

7. 哪些状态会被修改，哪些事件会被写入?

   回答:Command 修改对应 Work truth state 并写 `WorkTraceRecord`、`WorkOutboxRecord` 和 affected `DerivedWorkViewState` stale;Inbound Event 写 local snapshot / reference state,必要时 stale derived views;Rebuild job replace projection 并 mark fresh;Outbox publish 只改 `OutboxPublicationState`;Query 不改任何状态。

8. 每个处理流至少需要哪些测试切口?

   回答:每条 flow 小节列出 `TC-WORK-*` 测试切口。最低覆盖 successful path、missing / invalid input、repository none、domain reject、version conflict、idempotency duplicate / conflict、resolver failure、outbox / projection side effect。

### 5. 当前文档问题诊断

| 位置 | 当前问题 | 本步处理 |
|---|---|---|
| Step 6 domain factory | 多个 Work-owned id 字段由 Step 8 声明为 id generator 生成,但 factory 签名未显式接收 id | 已回填 Step 6:所有 Work-owned truth / history factory 显式接收 id;Step 7 `IdGeneratorPort` 补齐对应函数 |
| Step 7 port 闭环表 | 多个处理流合并描述,实现时仍可能不知道具体调用顺序 | 本 Step 为每个接口给独立 flow 和关键伪代码 |
| Step 8 command DTO | 字段闭环已定义,但未说明 UoW、audit、outbox、projection stale 的具体顺序 | 本 Step 固定写路径共享模板和每条 flow 差异 |
| Outbound Event | payload schema 已有,但 outbox publish 如何 dispatch 未展开 | 本 Step 固定 outbox record -> topic-specific payload -> publisher -> mark 状态 |
| Query | public response surface 已有,但 truth read / projection read 的 empty / stale flow 未展开 | 本 Step 固定 query no-write、projection missing 不自动 rebuild |

### 6. 共享处理约束

#### 6.1 Command 写路径模板

所有 Command 使用同一事务和幂等模板。具体 command 只替换 `operation`、domain method、repository 和 result DTO。

```text
[api::WorkCommandHandlers.handle_<command>]
  | validate WorkCommandEnvelope<T>
  | require CommandMetadata.request.idempotency_key
  | compute canonical RequestDigest from stable business input
  v
[application::<CommandService>.<operation>]
  | UnitOfWork.begin()
  | IdempotencyRepository.reserve(key, operation, digest, &uow)
  | duplicate -> return stored result without truth write
  | conflict -> mark_conflict + rollback + IdempotencyConflict
  | lookup / resolver / id generation
  v
[domain object / policy]
  | call Object.factory_or_transition(...)
  | call WorkTruthPolicy.assert_truth_change_allowed(...)
  v
[repositories + audit + outbox]
  | save truth with expected_version when present
  | WorkTraceRecord::from_truth_change(trace_id, change, trace_context_ref)
  | WorkOutboxRecord::from_truth_change(outbox_id, change, trace_context_ref, occurred_at)
  | ProjectionRepository.mark_stale(affected_views, cursor, &uow) when affected public DerivedWorkViewRef exists
  | build command result surface with WorkCommandReceipt { idempotency: Applied, ... }
  | CommandResultRepository.save_result(result_ref, StoredCommandResult::<kind>(result), &uow)
  | IdempotencyRepository.complete(reservation, result_ref, &uow)
  | UnitOfWork.commit()
```

```rust
// ProjectCommandService::execute_write(WorkCommandEnvelope<T> envelope, OperationName operation)
let key = envelope.metadata.request.idempotency_key.ok_or(ApplicationError::InvalidRequest)?;
let digest = RequestDigest::from_canonical_command_input(
    operation,
    &envelope.actor,
    &envelope.command,
)?;
let uow = unit_of_work.begin().await?;
match idempotency.reserve(key, operation, digest, &uow).await? {
    IdempotencyReservation::Duplicate(result_ref) => {
        unit_of_work.rollback(uow).await?;
        return command_results
            .get_result(result_ref)
            .await?
            .and_then(|stored| stored.into_expected_result(operation))
            .map(|result| result.with_duplicate_receipt())
            .ok_or(ApplicationError::DuplicateResultMissing);
    }
    IdempotencyReservation::Conflict(conflict) => {
        idempotency.mark_conflict(conflict, &uow).await?;
        unit_of_work.rollback(uow).await?;
        return Err(ApplicationError::IdempotencyConflict);
    }
    IdempotencyReservation::Reserved(record) => record
};
```

Command 写路径不变量:

- Handler 不直接开启事务、不直接访问 repository、不自行判重。
- Domain 不访问 id generator、clock、repository、publisher 或 external resolver。
- `WorkOutboxRecord` 只从 committed truth change 构造;publisher failure 不回滚 truth。
- `ProjectionRepository.mark_stale(...)` 只标记 derived view freshness,不得改业务 truth。
- success path 必须先 `CommandResultRepository.save_result(...)`,再 `IdempotencyRepository.complete(...)`,二者与 truth / trace / outbox / stale marker 同一 UoW。
- duplicate 必须通过 `CommandResultRepository.get_result(ApplicationResultRef)` 返回原 result surface,不得从当前 truth 现算,不得重放 domain transition。
- duplicate replay 只把 receipt 的 `idempotency` surface 标记为 `Duplicate`;`result_ref`、primary ref、state、trace / outbox refs 和 applied version 必须保持原值。
- `ApplicationResultRef` 缺失、result surface 缺失或 stored result variant 与当前 operation 不匹配时,返回 `ApplicationError::DuplicateResultMissing`。

#### 6.2 Query 读路径模板

```text
[api::WorkQueryHandlers.handle_<query>]
  | validate WorkQueryEnvelope<T>
  | read QueryMetadata.page / consistency when required
  v
[application::AuthorizedWorkQueryService.<query>]
  | authorize actor against Work-owned scope
  | repository / projection read only
  | map Page<T> -> PublicPageInfo
  | map freshness -> QuerySurface
  v
[contracts::views]
  | return WorkQueryResponse<View>
```

Query 读路径不变量:

- Query 不要求 idempotency key。
- Query 不开启写 UoW、不写 audit、不写 outbox、不触发 projection rebuild。
- not visible 返回 `WorkQueryResponse { surface: NotVisible, data: None }`。
- projection missing / stale / failed 由 `QuerySurface` 表达,不得由 query service 修复 projection。

#### 6.3 Inbound Event Consumer 模板

```text
[worker::WorkInboundConsumers.consume_<event>]
  | validate WorkInboundEventEnvelope<T>
  | build dedup key = source_event_id + topic + source_ref
  v
[application::WorkInboundConsumerService.<consumer>]
  | UnitOfWork.begin()
  | IdempotencyRepository.reserve(dedup_key, operation, digest, &uow)
  | save snapshot / reference state / pending intake
  | mark affected derived views stale when applicable
  | complete reservation
  | UnitOfWork.commit()
```

Inbound 不变量:

- Event consumer 不直接创建 `WorkItem` 或接受 promote;runtime / conversation / governance 只能形成 reference state 或 pending promote intake。
- envelope 缺失、event id 缺失、unsupported version、必填 ref 缺失进入 dead-letter。
- resolver / repository temporary failure 可 retry;不可把失败伪装为 resolved snapshot。

#### 6.4 Outbound Event 发布模板

```text
[jobs::WorkOperationsJobRunner.run_publish_work_outbox]
  | WorkOutboxRepository.list_pending(page) -> Page<Versioned<WorkOutboxRecord>>
  v
[application::WorkOutboxPublishService.publish_one(versioned)]
  | dispatch versioned.record.event_kind -> payload builder
  | WorkOutboxPublisherPort.publish(publication)
  | UnitOfWork.begin()
  | mark_published or mark_failed with versioned.version
  | UnitOfWork.commit()
```

Outbound 不变量:

- Publisher port 不修改 repository。
- payload 只来自 `WorkOutboxRecord` 指向的 committed Work truth / trace / derived view marker。
- bus event id 不等于 `WorkOutboxId`;发布结果只写 `OutboxPublicationRef`。

### 7. 处理流总表

| 处理流 | 对应协议 | 入口函数 | 主要事务 | 状态变化 / 事件副作用 | 测试切口 |
|---|---|---|---|---|---|
| `CreateProjectFlow` | `CreateProject` | `handle_create_project` | Project + Backlog + audit + outbox + idempotency | Project Active,Backlog Open,enqueue `ProjectChanged`,views stale | `TC-WORK-PROJECT-001` |
| `UpdateProjectLifecycleFlow` | `UpdateProjectLifecycle` | `handle_update_project_lifecycle` | Project (+ Backlog archive) + audit + outbox | lifecycle transition,enqueue `ProjectChanged`,views stale | `TC-WORK-PROJECT-002` |
| `UpdateBacklogAvailabilityFlow` | `UpdateBacklogAvailability` | `handle_update_backlog_availability` | Backlog + audit + outbox + projection stale | backlog availability changes,derived views stale | `TC-WORK-BACKLOG-001` |
| `AssignProjectMemberFlow` | `AssignProjectMember` | `handle_assign_project_member` | ProjectMember + snapshot ref + audit + outbox | member responsibility Proposed/Active,enqueue `ProjectMemberChanged` | `TC-WORK-MEMBER-001` |
| `UpdateProjectMemberResponsibilityFlow` | `UpdateProjectMemberResponsibility` | `handle_update_project_member_responsibility` | ProjectMember + audit + outbox | responsibility transition,enqueue `ProjectMemberChanged` | `TC-WORK-MEMBER-002` |
| `CreateWorkItemFlow` | `CreateWorkItem` | `handle_create_work_item` | WorkItem + Backlog membership + audit + outbox | WorkItem Formalized,enqueue `WorkItemChanged`,views stale | `TC-WORK-ITEM-001` |
| `CreateChildWorkItemFlow` | `CreateChildWorkItem` | `handle_create_child_work_item` | ChildWorkItem + audit + outbox | ChildWorkItem Formalized,enqueue `WorkItemChanged` | `TC-WORK-ITEM-002` |
| `UpdateWorkItemLifecycleFlow` | `UpdateWorkItemLifecycle` | `handle_update_work_item_lifecycle` | WorkItem/Child + audit + outbox | work lifecycle transition,enqueue `WorkItemChanged` | `TC-WORK-ITEM-003` |
| `RequestWorkPromotionFlow` | `RequestWorkPromotion` | `handle_request_work_promotion` | PromoteResult + audit + outbox | PromoteResult PendingReview,enqueue `PromoteResultRecorded` | `TC-WORK-PROMOTE-001` |
| `ReviewWorkPromotionFlow` | `ReviewWorkPromotion` | `handle_review_work_promotion` | PromoteResult (+ WorkItem on accept) + audit + outbox | promote accepted/rejected,optional WorkItem Formalized | `TC-WORK-PROMOTE-002` |
| `LinkWorkDependencyFlow` | `LinkWorkDependency` | `handle_link_work_dependency` | Dependency + history + audit + outbox | dependency Proposed/Active,enqueue `WorkDependencyChanged` | `TC-WORK-DEP-001` |
| `UpdateWorkDependencyStateFlow` | `UpdateWorkDependencyState` | `handle_update_work_dependency_state` | Dependency + history + audit + outbox | dependency transition,enqueue `WorkDependencyChanged` | `TC-WORK-DEP-003` |
| `OpenWorkBlockerFlow` | `OpenWorkBlocker` | `handle_open_work_blocker` | Blocker + history + audit + outbox | blocker Open,enqueue `WorkBlockerChanged` | `TC-WORK-BLOCKER-001` |
| `ResolveWorkBlockerFlow` | `ResolveWorkBlocker` | `handle_resolve_work_blocker` | Blocker + history + audit + outbox | blocker Resolved,enqueue `WorkBlockerChanged` | `TC-WORK-BLOCKER-002` |
| `OpenIterationFlow` | `OpenIteration` | `handle_open_iteration` | Iteration + audit + outbox | iteration Planning,enqueue `IterationChanged` | `TC-WORK-ITER-001` |
| `CommitIterationScopeFlow` | `CommitIterationScope` | `handle_commit_iteration_scope` | Iteration + Commitment + work marks + audit + outbox | iteration Committed,commitment Committed,work Committed | `TC-WORK-ITER-002` |
| `UpdateIterationCommitmentFlow` | `UpdateIterationCommitment` | `handle_update_iteration_commitment` | Commitment + audit + outbox | commitment Changed,views stale | `TC-WORK-ITER-003` |
| `UpdateIterationLifecycleFlow` | `UpdateIterationLifecycle` | `handle_update_iteration_lifecycle` | Iteration (+ Commitment close) + audit + outbox | iteration lifecycle transition,enqueue `IterationChanged` | `TC-WORK-ITER-004` |
| `GetProjectWorkFactsFlow` | `GetProjectWorkFacts` | `handle_get_project_work_facts` | none | query no-write | `TC-WORK-QUERY-001` |
| `GetBacklogFlow` | `GetBacklog` | `handle_get_backlog` | none | query no-write,page mapped | `TC-WORK-QUERY-002` |
| `GetWorkItemFlow` | `GetWorkItem` | `handle_get_work_item` | none | query no-write | `TC-WORK-QUERY-003` |
| `ListMemberWorkFlow` | `ListMemberWork` | `handle_list_member_work` | none | projection surface mapped | `TC-WORK-QUERY-004` |
| `GetIterationSummaryFlow` | `GetIterationSummary` | `handle_get_iteration_summary` | none | projection surface mapped | `TC-WORK-QUERY-005` |
| `SearchWorkFlow` | `SearchWork` | `handle_search_work` | none | projection page mapped | `TC-WORK-QUERY-006` |
| `GetWorkTraceFlow` | `GetWorkTrace` | `handle_get_work_trace` | none | trace page read | `TC-WORK-QUERY-007` |
| `GetProjectBoardViewFlow` | `GetProjectBoardView` | `handle_get_project_board_view` | none | projection surface mapped | `TC-WORK-QUERY-008` |
| inbound consumer flows | 7 inbound events | `consume_*` | snapshot/reference + idempotency | reference state saved,views stale when affected | `TC-WORK-INBOUND-*` |
| outbound event flows | 10 outbound events | `publish_*_event` | publish marker only | outbox Published/Failed | `TC-WORK-OUTBOX-*` |
| operations job flows | 6 jobs | `run_*` | job-specific write UoW | reports / projection / handoff / outbox state | `TC-WORK-JOB-*` |

### 8. Command 函数级处理流

#### 8.1 `CreateProjectFlow`

```text
[api.handle_create_project]
  -> ProjectCommandService.create_project(envelope)
     -> UnitOfWork.begin()
     -> IdempotencyRepository.reserve(...)
     -> IdGeneratorPort.next_project_id()
     -> IdGeneratorPort.next_backlog_id()
     -> Project::create(project_id, project_spec, actor)
     -> Backlog::open_for_project(backlog_id, project.project_id, actor)
     -> ProjectLifecycleReason::created()
     -> ProjectRepository.create(project, &uow)
     -> BacklogRepository.create(backlog, &uow)
     -> trace + outbox + stale views
     -> ProjectCommandResult::from_project(... receipt Applied ...)
     -> CommandResultRepository.save_result(result_ref, StoredCommandResult::Project(result), &uow)
     -> IdempotencyRepository.complete(reservation, result_ref, &uow)
     -> UnitOfWork.commit()
```

```rust
// ProjectCommandService::create_project(WorkCommandEnvelope<CreateProjectRequest> envelope)
let actor = envelope.actor.actor_ref();
let project_id = ids.next_project_id()?;
let backlog_id = ids.next_backlog_id()?;
let project = Project::create(project_id, envelope.command.project_spec, actor)?;
let backlog = Backlog::open_for_project(backlog_id, project.project_id, actor)?;
let reason = ProjectLifecycleReason::created();
let project_version = project_repo.create(project, &uow).await?;
backlog_repo.create(backlog, &uow).await?;
let change = WorkTruthChange::ProjectCreated(project.project_ref(), reason);
let (trace_ref, outbox_refs) = append_trace_outbox_and_mark_stale(change, &uow).await?;
let result_ref = ApplicationResultRef::for_operation(operation, ids.next_result_id()?);
let result = ProjectCommandResult::from_project(
    project.project_ref(),
    project.lifecycle_state,
    WorkCommandReceipt::applied(result_ref, trace_ref, outbox_refs, project_version),
);
command_results.save_result(result_ref, StoredCommandResult::Project(result.clone()), &uow).await?;
idempotency.complete(reservation, result_ref, &uow).await?;
unit_of_work.commit(uow).await?;
return Ok(result);
```

| 项 | 口径 |
|---|---|
| DTO -> Domain | `CreateProjectRequest.project_spec` 构造 `Project`;`ProjectId` / `BacklogId` 来自 `IdGeneratorPort` |
| 事务边界 | project、backlog、audit、outbox、projection stale、command result save、idempotency complete 同一 UoW |
| 错误映射 | 缺 idempotency -> `InvalidRequest`;id 生成失败 -> `TemporarilyUnavailable`;domain reject -> `DomainRejected`;repo fail -> rollback |
| 状态 / 事件 | Project = `Active`;Backlog = `Open`;enqueue `ProjectChanged`;mark project board / facts stale |
| 测试切口 | success creates project+backlog;stored command result saved before idempotency complete;duplicate loads same result from `CommandResultRepository`;owner missing reject;outbox and trace written |

#### 8.2 `UpdateProjectLifecycleFlow`

```text
[api.handle_update_project_lifecycle]
  -> ProjectCommandService.update_lifecycle(envelope)
     -> reserve idempotency in UoW
     -> ProjectRepository.get(project_ref)
     -> ProjectLifecyclePolicy.assert_lifecycle_transition_allowed(...)
     -> Project.transition_lifecycle(target, reason, actor)
     -> if Archived: BacklogRepository.get_by_project_with_version + Backlog.archive_with_project(...)
     -> ProjectRepository.save(project, expected_version, &uow)
     -> optional BacklogRepository.save(backlog, current_backlog_version, &uow)
     -> trace + ProjectChanged outbox + stale views + complete
```

```rust
// ProjectCommandService::update_lifecycle(WorkCommandEnvelope<UpdateProjectLifecycleRequest> envelope)
let mut project = project_repo.get(request.project_ref).await?.ok_or(ApplicationError::NotFound)?;
ProjectLifecyclePolicy::assert_lifecycle_transition_allowed(&project, request.target, request.reason, actor)?;
project.transition_lifecycle(request.target, request.reason, actor)?;
if request.target.is_archived() {
    let (mut backlog, current_backlog_version) = backlog_repo
        .get_by_project_with_version(request.project_ref)
        .await?
        .ok_or(ApplicationError::NotFound)?;
    backlog.archive_with_project(request.project_ref, actor)?;
    backlog_repo.save(backlog, current_backlog_version, &uow).await?;
}
let version = project_repo.save(project, request.expected_version, &uow).await?;
```

| 项 | 口径 |
|---|---|
| DTO -> Domain | `project_ref` lookup;`target` / `reason` 传入 policy 与 domain transition |
| 事务边界 | project save、archive 联动 backlog、audit、outbox、stale、idempotency complete 同一 UoW |
| 错误映射 | project missing -> `NotFound`;version mismatch -> `VersionConflict`;Archived 后普通写 reject |
| 状态 / 事件 | Project lifecycle 迁移;archive path 联动 Backlog `Archived`;enqueue `ProjectChanged` |
| Backlog version 来源 | archive 联动是 service 内部级联写路径,不要求 public request 携带 `expected_backlog_version`;`current_backlog_version` 必须来自 `BacklogRepository.get_by_project_with_version(project_ref)` |
| 测试切口 | valid transition;invalid transition;archive cascades backlog;version conflict rollback |

#### 8.3 `UpdateBacklogAvailabilityFlow`

```text
[api.handle_update_backlog_availability]
  -> WorkItemCommandService.update_backlog_availability(envelope)
     -> reserve idempotency in UoW
     -> BacklogRepository.get(backlog_ref)
     -> BacklogAvailabilityPolicy.assert_availability_transition_allowed(...)
     -> Backlog.lock_for_maintenance(...) or reopen_after_maintenance(...)
     -> BacklogRepository.save(backlog, expected_version, &uow)
     -> trace + outbox from WorkTruthChange::backlog_availability_changed
     -> ProjectionRepository.mark_stale(project/backlog views, cursor, &uow)
```

```rust
// WorkItemCommandService::update_backlog_availability(WorkCommandEnvelope<UpdateBacklogAvailabilityRequest> envelope)
let mut backlog = backlog_repo.get(request.backlog_ref).await?.ok_or(ApplicationError::NotFound)?;
BacklogAvailabilityPolicy::assert_availability_transition_allowed(&backlog, request.target, request.reason, actor)?;
match request.target {
    BacklogAvailabilityTarget::LockedForMaintenance => backlog.lock_for_maintenance(request.reason, actor)?,
    BacklogAvailabilityTarget::Open => backlog.reopen_after_maintenance(request.reason, actor)?,
}
let version = backlog_repo.save(backlog, request.expected_version, &uow).await?;
```

| 项 | 口径 |
|---|---|
| DTO -> Domain | `backlog_ref` lookup;`target` 选择对应 domain method |
| 事务边界 | backlog save、audit、outbox、stale、idempotency complete 同一 UoW |
| 错误映射 | backlog missing -> `NotFound`;invalid target -> `DomainRejected`;version conflict -> `VersionConflict` |
| 状态 / 事件 | Backlog `Open` / `LockedForMaintenance`;outbox event kind 来自 Work truth change;project/backlog views stale |
| 测试切口 | lock;reopen;archived backlog reject;duplicate;projection stale |

#### 8.4 `AssignProjectMemberFlow`

```text
[api.handle_assign_project_member]
  -> ProjectMemberCommandService.assign_project_member(envelope)
     -> reserve idempotency in UoW
     -> ProjectRepository.get(project_ref)
     -> ProjectMemberRepository.get_by_member(project_ref, member_ref)
     -> ReferenceSnapshotRepository.get_member_snapshot(member_ref) or MemberReferencePort.resolve_member_capability(member_ref)
     -> MemberCapabilitySnapshot::from_identity(...)
     -> MemberResponsibilityPolicy.assert_can_assign(member_ref, responsibility_spec)
     -> IdGeneratorPort.next_project_member_id()
     -> ProjectMember::assign(project_member_id, project_id, member_ref, responsibility_spec)
     -> ProjectMember.activate(snapshot, actor)
     -> create member + save snapshot/reference state + trace + outbox
```

```rust
// ProjectMemberCommandService::assign_project_member(WorkCommandEnvelope<AssignProjectMemberRequest> envelope)
let project = project_repo.get(request.project_ref).await?.ok_or(ApplicationError::NotFound)?;
ensure_no_existing_member(project.project_ref(), request.member_ref).await?;
let snapshot = load_or_resolve_member_snapshot(request.member_ref).await?;
MemberResponsibilityPolicy::assert_can_assign(request.member_ref, request.responsibility_spec)?;
let member_id = ids.next_project_member_id()?;
let mut member = ProjectMember::assign(member_id, project.project_id, request.member_ref, request.responsibility_spec)?;
member.activate(snapshot, actor)?;
let version = project_member_repo.create(member, &uow).await?;
```

| 项 | 口径 |
|---|---|
| DTO -> Domain | request `member_ref` 是 `GlobalMemberRef`;生成 `ProjectMemberId`;snapshot 只含 safe capability refs |
| 事务边界 | project member create、snapshot/reference save、audit、outbox、stale、idempotency complete 同一 UoW |
| 错误映射 | project missing -> `NotFound`;member unresolved -> `ExternalReferenceUnresolved`;duplicate assignment -> `DomainRejected` |
| 状态 / 事件 | responsibility `Active`;enqueue `ProjectMemberChanged`;member work / project facts stale |
| 测试切口 | resolver success;cached snapshot path;duplicate member reject;capability missing reject |

#### 8.5 `UpdateProjectMemberResponsibilityFlow`

```text
[api.handle_update_project_member_responsibility]
  -> ProjectMemberCommandService.update_responsibility(envelope)
     -> reserve idempotency in UoW
     -> ProjectMemberRepository.get(project_member_ref)
     -> optional MemberReferencePort.resolve_member_capability for resume
     -> ProjectMember.pause(...) / resume(...) / release(...) / activate(...)
     -> ProjectMemberRepository.save(member, expected_version, &uow)
     -> trace + ProjectMemberChanged outbox + stale views
```

```rust
// ProjectMemberCommandService::update_responsibility(WorkCommandEnvelope<UpdateProjectMemberResponsibilityRequest> envelope)
let mut member = member_repo.get(request.project_member_ref).await?.ok_or(ApplicationError::NotFound)?;
match request.target {
    ResponsibilityTarget::Pause => member.pause(request.reason, actor)?,
    ResponsibilityTarget::Resume => {
        let snapshot = load_or_resolve_member_snapshot(member.member_ref).await?;
        member.resume(snapshot, actor)?;
    }
    ResponsibilityTarget::Release => member.release(request.reason, actor)?,
    ResponsibilityTarget::Activate => {
        let snapshot = load_or_resolve_member_snapshot(member.member_ref).await?;
        member.activate(snapshot, actor)?;
    }
}
let version = member_repo.save(member, request.expected_version, &uow).await?;
```

| 项 | 口径 |
|---|---|
| DTO -> Domain | `target` 映射到 `pause` / `resume` / `release` / `activate`;resume/activate 必须重新验证 snapshot |
| 事务边界 | member save、snapshot refresh if any、audit、outbox、stale、idempotency complete 同一 UoW |
| 错误映射 | member missing -> `NotFound`;released resume -> `DomainRejected`;version conflict -> `VersionConflict` |
| 状态 / 事件 | responsibility state 迁移;enqueue `ProjectMemberChanged` |
| 测试切口 | pause/resume/release;resume unresolved reject;released terminal;duplicate |

#### 8.6 `CreateWorkItemFlow`

```text
[api.handle_create_work_item]
  -> WorkItemCommandService.create_work_item(envelope)
     -> reserve idempotency in UoW
     -> ProjectRepository.get(project_ref)
     -> BacklogRepository.get_by_project(project_ref)
     -> ProjectMemberRepository.get(work_intent.assignee_ref)
     -> SourceWorkResolverPort.resolve_source_work(source_ref)
     -> optional MethodDefinitionResolverPort.resolve_definition(method_definition_ref)
     -> FormalWorkPolicy.assert_formal_work(intent, source_ref)
     -> Backlog.assert_can_accept(&intent)
     -> IdGeneratorPort.next_work_item_id()
     -> WorkItem::formalize(work_item_id, backlog_id, intent, source_ref, actor)
     -> WorkItemRepository.create_work_item + BacklogRepository.add_formal_work
```

```rust
// WorkItemCommandService::create_work_item(WorkCommandEnvelope<CreateWorkItemRequest> envelope)
let project = project_repo.get(request.project_ref).await?.ok_or(ApplicationError::NotFound)?;
let backlog = backlog_repo.get_by_project(request.project_ref).await?.ok_or(ApplicationError::NotFound)?;
ensure_active_member(request.work_intent.assignee_ref).await?;
let source = source_resolver.resolve_source_work(request.source_ref).await?;
WorkTruthPolicy::assert_no_external_body(source.summary)?;
FormalWorkPolicy::assert_formal_work(request.work_intent, request.source_ref)?;
backlog.assert_can_accept(&request.work_intent)?;
let work_id = ids.next_work_item_id()?;
let work = WorkItem::formalize(work_id, backlog.backlog_id, request.work_intent, request.source_ref, actor)?;
let version = work_repo.create_work_item(work, &uow).await?;
backlog_repo.add_formal_work(backlog.backlog_ref(), work.formal_ref(), &uow).await?;
```

| 项 | 口径 |
|---|---|
| DTO -> Domain | `FormalWorkIntent.title` -> `WorkItem.title`;`FormalWorkIntent.method_definition_ref` -> `WorkItem.method_definition_ref`;`SourceWorkRef` -> `WorkItem.source_ref`;generated `WorkItemId` + lookup `BacklogId` |
| 事务边界 | work create、backlog membership、audit、outbox、stale、idempotency complete 同一 UoW |
| 错误映射 | project/backlog/member missing -> `NotFound`;source unresolved -> `ExternalReferenceUnresolved`;non-formal source -> `DomainRejected` |
| 状态 / 事件 | WorkItem `Formalized`;enqueue `WorkItemChanged`;board/search/member views stale |
| 测试切口 | root work creation;source body rejected;assignee missing;backlog locked reject;duplicate |

#### 8.7 `CreateChildWorkItemFlow`

```text
[api.handle_create_child_work_item]
  -> WorkItemCommandService.create_child_work_item(envelope)
     -> reserve idempotency in UoW
     -> WorkItemRepository.get_formal_work(parent_ref)
     -> BacklogRepository.get_by_project(parent.project_ref)
     -> SourceWorkResolverPort.resolve_source_work(source_ref)
     -> FormalWorkPolicy.assert_formal_work(intent, source_ref)
     -> IdGeneratorPort.next_child_work_item_id()
     -> ChildWorkItem::create_child(child_id, parent_work_item_id, intent, source_ref)
     -> WorkItemRepository.create_child_work_item(child, &uow)
     -> trace + WorkItemChanged outbox + stale views
```

```rust
// WorkItemCommandService::create_child_work_item(WorkCommandEnvelope<CreateChildWorkItemRequest> envelope)
let parent = work_repo.get_formal_work(request.parent_ref).await?.ok_or(ApplicationError::NotFound)?;
let parent_id = parent.as_root_work_item_id().ok_or(ApplicationError::DomainRejected)?;
let source = source_resolver.resolve_source_work(request.source_ref).await?;
WorkTruthPolicy::assert_no_external_body(source.summary)?;
FormalWorkPolicy::assert_formal_work(request.work_intent, request.source_ref)?;
let child_id = ids.next_child_work_item_id()?;
let child = ChildWorkItem::create_child(child_id, parent_id, request.work_intent, request.source_ref)?;
let version = work_repo.create_child_work_item(child, &uow).await?;
```

| 项 | 口径 |
|---|---|
| DTO -> Domain | parent must be root formal work;`FormalWorkIntent.title` -> `ChildWorkItem.title`;`FormalWorkIntent.method_definition_ref` -> `ChildWorkItem.method_definition_ref`;`SourceWorkRef` -> `ChildWorkItem.source_ref`;generated `ChildWorkItemId`;intent parent hint 不替代 route parent |
| 事务边界 | child create、audit、outbox、stale、idempotency complete 同一 UoW |
| 错误映射 | parent missing -> `NotFound`;parent is child or terminal -> `DomainRejected`;source unresolved -> `ExternalReferenceUnresolved` |
| 状态 / 事件 | ChildWorkItem `Formalized`;enqueue `WorkItemChanged` |
| 测试切口 | child create;non-root parent reject;source unresolved;duplicate |

#### 8.8 `UpdateWorkItemLifecycleFlow`

```text
[api.handle_update_work_item_lifecycle]
  -> WorkItemCommandService.update_lifecycle(envelope)
     -> reserve idempotency in UoW
     -> WorkItemRepository.get_formal_work(work_ref)
     -> if target requires evidence: EvidenceResolverPort.resolve_evidence(evidence_ref)
     -> CompletionEvidencePolicy.assert_completion_evidence(...)
     -> WorkItem.transition_lifecycle(...) or ChildWorkItem.transition_lifecycle(...)
     -> WorkItemRepository.save_formal_work(record, expected_version, &uow)
     -> trace + WorkItemChanged outbox + stale views
```

```rust
// WorkItemCommandService::update_lifecycle(WorkCommandEnvelope<UpdateWorkItemLifecycleRequest> envelope)
let mut record = work_repo.get_formal_work(request.work_ref).await?.ok_or(ApplicationError::NotFound)?;
if request.target.requires_evidence() {
    let evidence_ref = request.evidence_ref.ok_or(ApplicationError::InvalidRequest)?;
    let evidence = evidence_resolver.resolve_evidence(evidence_ref).await?;
    CompletionEvidencePolicy::assert_completion_evidence(request.work_ref, evidence.evidence_ref)?;
}
record.transition_lifecycle(request.target, request.reason, request.evidence_ref, actor)?;
let version = work_repo.save_formal_work(record, request.expected_version, &uow).await?;
```

| 项 | 口径 |
|---|---|
| DTO -> Domain | `work_ref` lookup 为 `FormalWorkRecord`;target/reason/evidence 传入对应 variant transition |
| 事务边界 | work save、audit、outbox、stale、idempotency complete 同一 UoW |
| 错误映射 | missing work -> `NotFound`;completed without verified evidence -> `InvalidRequest` / `ExternalReferenceUnresolved`;terminal transition -> `DomainRejected` |
| 状态 / 事件 | WorkItem / ChildWorkItem lifecycle 迁移;enqueue `WorkItemChanged` |
| 测试切口 | complete with verified evidence;complete without evidence reject;terminal reject;version conflict |

#### 8.9 `RequestWorkPromotionFlow`

```text
[api.handle_request_work_promotion]
  -> PromoteCommandService.request_promotion(envelope)
     -> reserve idempotency in UoW
     -> SourceWorkResolverPort.resolve_source_work(source_ref)
     -> PromoteRepository.find_latest_by_source(source_ref)
     -> PromotePolicy.can_promote(source_ref, reason)
     -> IdGeneratorPort.next_promote_result_id()
     -> PromoteResult::evaluate(promote_result_id, source_ref, reason, actor)
     -> PromoteRepository.create(result, &uow)
     -> trace + PromoteResultRecorded outbox + complete
```

```rust
// PromoteCommandService::request_promotion(WorkCommandEnvelope<RequestWorkPromotionRequest> envelope)
let source = source_resolver.resolve_source_work(request.source_ref).await?;
WorkTruthPolicy::assert_no_external_body(source.summary)?;
ensure_no_open_promote_for_source(request.source_ref).await?;
ensure_promote_allowed(PromotePolicy::can_promote(request.source_ref, request.reason))?;
let promote_id = ids.next_promote_result_id()?;
let result = PromoteResult::evaluate(promote_id, request.source_ref, request.reason, actor)?;
let version = promote_repo.create(result, &uow).await?;
```

| 项 | 口径 |
|---|---|
| DTO -> Domain | `SourceWorkRef` resolver 成功后才构造 `PromoteResult`;generated `PromoteResultId` |
| 事务边界 | promote create、audit、outbox、command result save、idempotency complete 同一 UoW;当前 P0 无 promote/intake public projection,不 mark projection stale |
| 错误映射 | source unresolved -> `ExternalReferenceUnresolved`;existing open promote -> `DomainRejected`;resolver body leak -> `DomainRejected` |
| 状态 / 事件 | PromoteResult `PendingReview`;enqueue `PromoteResultRecorded`;不标记不存在的 promote / intake projection stale |
| 测试切口 | request promote;duplicate source reject;source unresolved;idempotency duplicate |

#### 8.10 `ReviewWorkPromotionFlow`

```text
[api.handle_review_work_promotion]
  -> PromoteCommandService.review_promotion(envelope)
     -> reserve idempotency in UoW
     -> PromoteRepository.get(promote_result_ref)
     -> if Accept:
          require accepted_work_intent
          SourceWorkResolverPort.resolve_source_work(promote.source_ref)
          BacklogRepository.get_by_project(...)
          IdGeneratorPort.next_work_item_id()
          WorkItem::formalize(...)
          PromoteResult.accept(work_ref, actor)
          WorkItemRepository.create_work_item(...)
          BacklogRepository.add_formal_work(...)
        if Reject:
          PromoteResult.reject(reason, actor)
     -> PromoteRepository.save(result, expected_version, &uow)
     -> PromoteDecisionRecord::from_result(decision_id, result, actor)
     -> append decision + trace + outbox
     -> if Accept created formal work: mark existing work views stale
```

```rust
// PromoteCommandService::review_promotion(WorkCommandEnvelope<ReviewWorkPromotionRequest> envelope)
let mut result = promote_repo.get(request.promote_result_ref).await?.ok_or(ApplicationError::NotFound)?;
match request.decision {
    PromoteReviewDecision::Accept => {
        let intent = request.accepted_work_intent.ok_or(ApplicationError::InvalidRequest)?;
        let source = source_resolver.resolve_source_work(result.source_ref).await?;
        WorkTruthPolicy::assert_no_external_body(source.summary)?;
        let backlog = load_accept_target_backlog(&intent).await?;
        let work_id = ids.next_work_item_id()?;
        let work = WorkItem::formalize(work_id, backlog.backlog_id, intent, result.source_ref, actor)?;
        work_repo.create_work_item(work, &uow).await?;
        backlog_repo.add_formal_work(backlog.backlog_ref(), work.formal_ref(), &uow).await?;
        result.accept(work.formal_ref(), actor)?;
    }
    PromoteReviewDecision::Reject(reason) => {
        if request.accepted_work_intent.is_some() {
            return Err(ApplicationError::InvalidRequest);
        }
        result.reject(reason, actor)?;
    }
}
let version = promote_repo.save(result, request.expected_version, &uow).await?;
let decision_id = ids.next_promote_decision_id()?;
let decision = PromoteDecisionRecord::from_result(decision_id, result, actor)?;
promote_repo.append_decision(decision, &uow).await?;
```

| 项 | 口径 |
|---|---|
| DTO -> Domain | accept path 必须有 `accepted_work_intent`;reject path 从 `PromoteReviewDecision::Reject(reason)` 取得 `PromoteRejectReason`,且不得携带 `accepted_work_intent`;reject path 不创建 work |
| 事务边界 | promote save、optional work create、backlog membership、decision history、audit、outbox、command result save、idempotency complete 同一 UoW;accept 创建 / 绑定 formal work 时同步 mark 既有 work views stale;reject path 不 mark projection stale |
| 错误映射 | promote missing -> `NotFound`;accept without intent -> `InvalidRequest`;reject with accepted intent -> `InvalidRequest`;invalid transition -> `DomainRejected`;version conflict -> `VersionConflict` |
| 状态 / 事件 | PromoteResult `Accepted` / `Rejected`;accept path WorkItem `Formalized`;enqueue promote + optional work events;只有 accept 影响 `ProjectBoardView` / `MemberWorkView` / `WorkSearchResult` 等既有 public views |
| 测试切口 | accept creates work;reject no work;accept missing intent reject;decision history appended |

#### 8.11 `LinkWorkDependencyFlow`

```text
[api.handle_link_work_dependency]
  -> DependencyBlockerService.link_dependency(envelope)
     -> reserve idempotency in UoW
     -> WorkItemRepository.get_formal_work(upstream)
     -> WorkItemRepository.get_formal_work(downstream)
     -> WorkItemRepository.get_formal_work_scope(downstream)
     -> DependencyRepository.load_graph_snapshot(scope.project_ref)
     -> DependencyGraphPolicy.assert_can_link(graph, upstream, downstream)
     -> IdGeneratorPort.next_work_dependency_id()
     -> WorkDependency::link(dependency_id, upstream, downstream, reason)
     -> DependencyChangeReason::from_link_reason(reason)
     -> WorkDependency.activate(actor, activation_reason)
     -> DependencyRepository.create_dependency(...)
     -> DependencyChangeRecord::from_dependency_change(...)
     -> audit + WorkDependencyChanged outbox + stale
```

```rust
// DependencyBlockerService::link_dependency(WorkCommandEnvelope<LinkWorkDependencyRequest> envelope)
ensure_formal_work_exists(request.upstream_work_ref).await?;
ensure_formal_work_exists(request.downstream_work_ref).await?;
let downstream_scope = work_repo.get_formal_work_scope(request.downstream_work_ref).await?.ok_or(ApplicationError::NotFound)?;
let graph = dependency_repo.load_graph_snapshot(downstream_scope.project_ref).await?;
ensure_graph_scope(&graph, downstream_scope.project_ref)?;
DependencyGraphPolicy::assert_can_link(&graph, request.upstream_work_ref, request.downstream_work_ref)?;
let dependency_id = ids.next_work_dependency_id()?;
let link_reason = request.reason;
let activation_reason = DependencyChangeReason::from_link_reason(link_reason.clone());
let mut dependency = WorkDependency::link(dependency_id, request.upstream_work_ref, request.downstream_work_ref, link_reason)?;
dependency.activate(actor, activation_reason.clone())?;
let version = dependency_repo.create_dependency(dependency, &uow).await?;
let change_id = ids.next_dependency_change_id()?;
let history = DependencyChangeRecord::from_dependency_change(change_id, dependency, activation_reason)?;
dependency_repo.append_change(history, &uow).await?;
projection_repo.mark_stale(affected_relation_views(&downstream_scope), current_cursor(), &uow).await?;
```

| 项 | 口径 |
|---|---|
| DTO -> Domain | upstream/downstream 必须是不同正式工作;graph snapshot project scope 只能来自 `WorkItemRepository.get_formal_work_scope(downstream)`;`graph.project_ref` 必须匹配 downstream scope;不得实现 `project_ref_from(FormalWorkRef)` |
| 事务边界 | dependency create、history、audit、outbox、stale、idempotency complete 同一 UoW |
| 错误映射 | work missing -> `NotFound`;cycle/orphan -> `DomainRejected` |
| 状态 / 事件 | Dependency `Active`;enqueue `WorkDependencyChanged`;stale views = `project-board:{downstream_scope.project_ref}` plus `member-work:{downstream_scope.assignee_ref}` when `assignee_ref` is known;dependency / blocker relation 不进入 `WorkSearchProjection`,不得为本 flow 伪造 `work-search:*` |
| 测试切口 | link success;self dependency reject;cycle reject;missing work reject |

#### 8.12 `UpdateWorkDependencyStateFlow`

```text
[api.handle_update_work_dependency_state]
  -> DependencyBlockerService.update_dependency_state(envelope)
     -> reserve idempotency in UoW
     -> DependencyRepository.get_dependency(dependency_ref)
     -> WorkItemRepository.get_formal_work_scope(dependency.downstream_work_ref)
     -> optional EvidenceResolverPort.resolve_evidence(evidence_ref)
     -> WorkDependency.activate(...) / mark_satisfied(...) / waive(...) / cancel(...)
     -> DependencyRepository.save_dependency(dependency, expected_version, &uow)
     -> append DependencyChangeRecord
     -> audit + WorkDependencyChanged outbox + stale
```

```rust
// DependencyBlockerService::update_dependency_state(WorkCommandEnvelope<UpdateWorkDependencyStateRequest> envelope)
let mut dependency = dependency_repo.get_dependency(request.dependency_ref).await?.ok_or(ApplicationError::NotFound)?;
let downstream_scope = work_repo.get_formal_work_scope(dependency.downstream_work_ref).await?.ok_or(ApplicationError::NotFound)?;
let change_reason = request.reason;
match request.target {
    DependencyTarget::Active => {
        ensure_reason_kind(&change_reason, DependencyChangeReasonKind::Activated)?;
        ensure_formal_work_exists(dependency.upstream_work_ref).await?;
        ensure_formal_work_exists(dependency.downstream_work_ref).await?;
        dependency.activate(actor, change_reason.clone())?;
    }
    DependencyTarget::Satisfied => {
        ensure_reason_kind(&change_reason, DependencyChangeReasonKind::SatisfiedByEvidence)?;
        let evidence_ref = request.evidence_ref.ok_or(ApplicationError::InvalidRequest)?;
        let evidence = evidence_resolver.resolve_evidence(evidence_ref).await?;
        CompletionEvidencePolicy::assert_completion_evidence(dependency.downstream_work_ref, evidence.evidence_ref)?;
        dependency.mark_satisfied(evidence_ref, actor)?;
    }
    DependencyTarget::Waived => {
        ensure_reason_kind(&change_reason, DependencyChangeReasonKind::Waived)?;
        dependency.waive(change_reason.clone(), actor)?;
    }
    DependencyTarget::Cancelled => {
        ensure_reason_kind(&change_reason, DependencyChangeReasonKind::Cancelled)?;
        dependency.cancel(change_reason.clone(), actor)?;
    }
}
let version = dependency_repo.save_dependency(dependency, request.expected_version, &uow).await?;
let change_id = ids.next_dependency_change_id()?;
let history = DependencyChangeRecord::from_dependency_change(change_id, dependency, change_reason)?;
dependency_repo.append_change(history, &uow).await?;
projection_repo.mark_stale(affected_relation_views(&downstream_scope), current_cursor(), &uow).await?;
```

| 项 | 口径 |
|---|---|
| DTO -> Domain | `target` 决定 domain transition;`Active` 只允许 `Proposed -> Active` 且 `reason.kind = Activated`;`Satisfied` 必须有 verified evidence;terminal target 的 `reason.kind` 必须与 target 同族匹配;stale scope 来自 dependency.downstream 的 `FormalWorkScope` |
| 事务边界 | dependency save、history、audit、outbox、stale、idempotency complete 同一 UoW |
| 错误映射 | dependency missing -> `NotFound`;reason kind mismatch -> `InvalidRequest`;evidence unresolved -> `ExternalReferenceUnresolved`;invalid transition -> `DomainRejected` |
| 状态 / 事件 | Dependency `Active` / `Satisfied` / `Waived` / `Cancelled`;enqueue `WorkDependencyChanged`;stale views = downstream project-board + resolvable downstream member-work only |
| 测试切口 | activate from Proposed;satisfied requires evidence;waive;cancel;terminal reopen reject;version conflict |

#### 8.13 `OpenWorkBlockerFlow`

```text
[api.handle_open_work_blocker]
  -> DependencyBlockerService.open_blocker(envelope)
     -> reserve idempotency in UoW
     -> WorkItemRepository.get_formal_work(blocked_work_ref)
     -> WorkItemRepository.get_formal_work_scope(blocked_work_ref)
     -> IdGeneratorPort.next_work_blocker_id()
     -> WorkBlocker::open(blocker_id, blocked_work_ref, cause_ref, actor)
     -> DependencyRepository.create_blocker(blocker, &uow)
     -> DependencyChangeRecord::from_dependency_change(...)
     -> audit + WorkBlockerChanged outbox + stale
```

```rust
// DependencyBlockerService::open_blocker(WorkCommandEnvelope<OpenWorkBlockerRequest> envelope)
ensure_formal_work_exists(request.blocked_work_ref).await?;
let blocked_scope = work_repo.get_formal_work_scope(request.blocked_work_ref).await?.ok_or(ApplicationError::NotFound)?;
let blocker_id = ids.next_work_blocker_id()?;
let blocker = WorkBlocker::open(blocker_id, request.blocked_work_ref, request.cause_ref, actor)?;
let version = dependency_repo.create_blocker(blocker, &uow).await?;
let change_id = ids.next_dependency_change_id()?;
let reason = DependencyChangeReason::from_blocker_cause(request.cause_ref);
let history = DependencyChangeRecord::from_blocker_change(change_id, blocker, reason)?;
dependency_repo.append_change(history, &uow).await?;
projection_repo.mark_stale(affected_relation_views(&blocked_scope), current_cursor(), &uow).await?;
```

| 项 | 口径 |
|---|---|
| DTO -> Domain | `blocked_work_ref` must exist;`cause_ref` remains external ref / summary pointer only;stale scope 来自 `WorkItemRepository.get_formal_work_scope(blocked_work_ref)` |
| 事务边界 | blocker create、history、audit、outbox、stale、idempotency complete 同一 UoW |
| 错误映射 | blocked work missing -> `NotFound`;invalid cause -> `DomainRejected` |
| 状态 / 事件 | Blocker `Open`;enqueue `WorkBlockerChanged`;stale views = blocked project-board + resolvable blocked member-work only |
| 测试切口 | open blocker;missing work reject;external body not stored;duplicate |

#### 8.14 `ResolveWorkBlockerFlow`

```text
[api.handle_resolve_work_blocker]
  -> DependencyBlockerService.resolve_blocker(envelope)
     -> reserve idempotency in UoW
     -> DependencyRepository.get_blocker(blocker_ref)
     -> WorkItemRepository.get_formal_work_scope(blocker.blocked_work_ref)
     -> EvidenceResolverPort.resolve_evidence(evidence_ref)
     -> WorkBlocker.resolve(evidence_ref, actor)
     -> DependencyRepository.save_blocker(blocker, expected_version, &uow)
     -> append DependencyChangeRecord
     -> audit + WorkBlockerChanged outbox + stale
```

```rust
// DependencyBlockerService::resolve_blocker(WorkCommandEnvelope<ResolveWorkBlockerRequest> envelope)
let mut blocker = dependency_repo.get_blocker(request.blocker_ref).await?.ok_or(ApplicationError::NotFound)?;
let blocked_scope = work_repo.get_formal_work_scope(blocker.blocked_work_ref).await?.ok_or(ApplicationError::NotFound)?;
let evidence = evidence_resolver.resolve_evidence(request.evidence_ref).await?;
CompletionEvidencePolicy::assert_completion_evidence(blocker.blocked_work_ref, evidence.evidence_ref)?;
blocker.resolve(request.evidence_ref, actor)?;
assert_eq!(blocker.resolved_evidence_ref, Some(request.evidence_ref));
let version = dependency_repo.save_blocker(blocker, request.expected_version, &uow).await?;
projection_repo.mark_stale(affected_relation_views(&blocked_scope), current_cursor(), &uow).await?;
```

| 项 | 口径 |
|---|---|
| DTO -> Domain | `evidence_ref` 必填且 verified;blocker must be open/mitigating;stale scope 来自 blocker.blocked_work_ref 的 `FormalWorkScope` |
| 事务边界 | blocker save、history、audit、outbox、stale、idempotency complete 同一 UoW |
| 错误映射 | blocker missing -> `NotFound`;evidence unresolved -> `ExternalReferenceUnresolved`;closed blocker reject |
| 状态 / 事件 | Blocker `Resolved`;`resolved_evidence_ref = Some(evidence_ref)`;enqueue `WorkBlockerChanged`;stale views = blocked project-board + resolvable blocked member-work only |
| 测试切口 | resolve success;unverified evidence reject;closed blocker reject;version conflict |

Dependency / blocker relation stale helper:

```rust
fn affected_relation_views(scope: &FormalWorkScope) -> Vec<DerivedWorkViewRef> {
    let mut views = vec![project_board_view_ref(scope.project_ref.clone())];
    if let Some(member_ref) = scope.assignee_ref.clone() {
        views.push(member_work_view_ref(member_ref));
    }
    views
}
```

`affected_relation_views(...)` 只能返回 Step 8 §9.2 已定义的 public view ref。Dependency / blocker relation summary 不进入 `WorkSearchProjection` 字段,所以当前 P0 不标记 `work-search:{project_id}:{criteria_digest}`。若后续 search projection 增加 relation filter / relation state 字段,必须先在 Step 8 补对应 criteria / projection schema 和 stable key 规则,再把 search view 加入该 helper。

#### 8.15 `OpenIterationFlow`

```text
[api.handle_open_iteration]
  -> IterationCommandService.open_iteration(envelope)
     -> reserve idempotency in UoW
     -> ProjectRepository.get(project_ref)
     -> ProcessTimeboxResolverPort.resolve_timebox(timebox_ref)
     -> ensure_timebox_can_bind_to_project(resolution.summary, project.project_ref())
     -> IdGeneratorPort.next_iteration_id()
     -> Iteration::open(iteration_id, project_id, timebox_ref, actor)
     -> IterationRepository.create_iteration(iteration, &uow)
     -> audit + IterationChanged outbox + stale
```

```rust
// IterationCommandService::open_iteration(WorkCommandEnvelope<OpenIterationRequest> envelope)
let project = project_repo.get(request.project_ref).await?.ok_or(ApplicationError::NotFound)?;
let timebox_resolution = process_timebox_resolver.resolve_timebox(request.timebox_ref).await?;
ensure_timebox_can_bind_to_project(&timebox_resolution.summary, project.project_ref())?;
let iteration_id = ids.next_iteration_id()?;
let iteration = Iteration::open(iteration_id, project.project_id, request.timebox_ref, actor)?;
let version = iteration_repo.create_iteration(iteration, &uow).await?;
```

| 项 | 口径 |
|---|---|
| DTO -> Domain | `timebox_ref` resolved only as `ProcessTimeboxSummary`;generated `IterationId`;summary 不进入 `Iteration` truth |
| 事务边界 | iteration create、audit、outbox、stale、idempotency complete 同一 UoW;OpenIteration 不写 process timebox reference state |
| 错误映射 | project missing -> `NotFound`;timebox unresolved -> `ExternalReferenceUnresolved`;summary.project_ref mismatch 或 `can_open_iteration == false` -> `InvalidRequest` / `ExternalReferenceUnresolved`;closed project reject |
| 状态 / 事件 | Iteration `Planning`;enqueue `IterationChanged` |
| 测试切口 | open iteration;timebox unresolved;summary project mismatch;summary cannot open;missing digest fixture reject;project read-only/closed reject;duplicate |

`ensure_timebox_can_bind_to_project(summary, project_ref)` 只读取 Step 6 `ProcessTimeboxSummary` 字段:

- `summary.project_ref == project_ref`;
- `summary.can_open_iteration == true`;
- `summary.source_digest` must be present and valid as `SourceDigest`;
- `summary.summary` 可用于 safe audit / diagnostic text,但不得复制 Process 正文。

#### 8.16 `CommitIterationScopeFlow`

```text
[api.handle_commit_iteration_scope]
  -> IterationCommandService.commit_iteration_scope(envelope)
     -> reserve idempotency in UoW
     -> IterationRepository.get_iteration(iteration_ref)
     -> WorkItemRepository.get_formal_work_with_version(each candidate)
     -> BacklogRepository.contains_formal_work(...)
     -> IterationCommitmentPolicy.assert_commitment_allowed(...)
     -> IdGeneratorPort.next_iteration_commitment_id()
     -> IterationCommitment::from_candidates(commitment_id, iteration_id, candidates, actor)
     -> Iteration.commit(commitment, actor)
     -> WorkItem.mark_committed(...) or ChildWorkItem.mark_committed(...) for each loaded candidate
     -> save iteration + commitment + work records
```

```rust
// IterationCommandService::commit_iteration_scope(WorkCommandEnvelope<CommitIterationScopeRequest> envelope)
let mut iteration = iteration_repo.get_iteration(request.iteration_ref).await?.ok_or(ApplicationError::NotFound)?;
let candidates = validate_formal_candidates_with_versions(request.candidate_work_refs).await?;
IterationCommitmentPolicy::assert_commitment_allowed(&iteration, candidates)?;
let commitment_id = ids.next_iteration_commitment_id()?;
let commitment = IterationCommitment::from_candidates(commitment_id, iteration.iteration_id, candidates, actor)?;
iteration.commit(commitment, actor)?;
iteration_repo.save_iteration(iteration, request.expected_iteration_version, &uow).await?;
iteration_repo.save_commitment(commitment, None, &uow).await?;
mark_candidate_work_committed(candidates, request.iteration_ref, actor, &uow).await?;
```

| 项 | 口径 |
|---|---|
| DTO -> Domain | `candidate_work_refs` 必须全是 backlog 内正式 work;每个 candidate 必须通过 `WorkItemRepository.get_formal_work_with_version(...)` 取得 `(FormalWorkRecord, Version)`;`FormalWorkRecord::WorkItem` 调用 `WorkItem::mark_committed(...)`,`FormalWorkRecord::ChildWorkItem` 调用 `ChildWorkItem::mark_committed(...)`;generated `IterationCommitmentId` |
| 事务边界 | iteration save、commitment create、work marks、history、audit、outbox、stale、idempotency complete 同一 UoW |
| 错误映射 | empty candidates -> `InvalidRequest`;non-formal candidate -> `DomainRejected`;iteration missing -> `NotFound` |
| 状态 / 事件 | Iteration `Committed`;Commitment `Committed`;work `Committed`;enqueue `IterationChanged` |
| 测试切口 | commit scope;empty reject;non-formal reject;work marks committed;rollback on conflict |

#### 8.17 `UpdateIterationCommitmentFlow`

```text
[api.handle_update_iteration_commitment]
  -> IterationCommandService.update_iteration_commitment(envelope)
     -> reserve idempotency in UoW
     -> IterationRepository.get_iteration(iteration_ref)
     -> IterationRepository.get_commitment(iteration_ref)
     -> validate added work refs through WorkItemRepository.get_formal_work_with_version + BacklogRepository
     -> IterationCommitment.apply_change(change_set, reason, actor)
     -> IterationRepository.save_commitment(commitment, expected_commitment_version, &uow)
     -> append IterationChangeRecord
     -> audit + IterationChanged outbox + stale
```

```rust
// IterationCommandService::update_iteration_commitment(WorkCommandEnvelope<UpdateIterationCommitmentRequest> envelope)
ensure_non_empty_change_set(request.change_set)?;
let iteration = iteration_repo.get_iteration(request.iteration_ref).await?.ok_or(ApplicationError::NotFound)?;
let mut commitment = iteration_repo.get_commitment(request.iteration_ref).await?.ok_or(ApplicationError::NotFound)?;
validate_added_work_refs_with_versions(request.change_set.add_work_refs).await?;
commitment.apply_change(request.change_set, request.reason, actor)?;
let version = iteration_repo.save_commitment(commitment, Some(request.expected_commitment_version), &uow).await?;
let change_id = ids.next_iteration_change_id()?;
let history = IterationChangeRecord::from_commitment(change_id, iteration, commitment, actor)?;
iteration_repo.append_change(history, &uow).await?;
```

| 项 | 口径 |
|---|---|
| DTO -> Domain | `change_set` 两边都空 reject;added refs 必须 formal work;added refs 若会写 membership / work mark,必须通过 `WorkItemRepository.get_formal_work_with_version(...)` 取得 optimistic version |
| 事务边界 | commitment save、history、audit、outbox、stale、idempotency complete 同一 UoW |
| 错误映射 | no commitment -> `NotFound`;empty change -> `InvalidRequest`;closed commitment -> `DomainRejected`;version conflict |
| 状态 / 事件 | Commitment `Changed`;enqueue `IterationChanged`;iteration/member views stale |
| 测试切口 | add/remove;empty reject;closed reject;version conflict;duplicate |

#### 8.18 `UpdateIterationLifecycleFlow`

```text
[api.handle_update_iteration_lifecycle]
  -> IterationCommandService.update_iteration_lifecycle(envelope)
     -> reserve idempotency in UoW
     -> IterationRepository.get_iteration(iteration_ref)
     -> if Close: IterationRepository.get_commitment_with_version(iteration_ref)
     -> Iteration.start(change_reason, actor) / close(close_reason, actor) / cancel(change_reason, actor)
     -> if Close: IterationCommitment.close(close_reason, actor)
     -> save iteration + optional commitment
     -> audit + IterationChanged outbox + stale
```

```rust
// IterationCommandService::update_iteration_lifecycle(WorkCommandEnvelope<UpdateIterationLifecycleRequest> envelope)
let mut iteration = iteration_repo.get_iteration(request.iteration_ref).await?.ok_or(ApplicationError::NotFound)?;
match request.target {
    IterationLifecycleTarget::InProgress => {
        let reason = require_change_reason(request.change_reason, request.close_reason)?;
        iteration.start(reason, actor)?;
    }
    IterationLifecycleTarget::Closed => {
        let reason = require_close_reason(request.close_reason, request.change_reason)?;
        let (mut commitment, current_commitment_version) = iteration_repo
            .get_commitment_with_version(request.iteration_ref)
            .await?
            .ok_or(ApplicationError::NotFound)?;
        iteration.close(reason.clone(), actor)?;
        commitment.close(reason, actor)?;
        iteration_repo.save_commitment(commitment, Some(current_commitment_version), &uow).await?;
    }
    IterationLifecycleTarget::Cancelled => {
        let reason = require_change_reason(request.change_reason, request.close_reason)?;
        iteration.cancel(reason, actor)?;
    }
}
let version = iteration_repo.save_iteration(iteration, request.expected_version, &uow).await?;
```

| 项 | 口径 |
|---|---|
| DTO -> Domain | `target = InProgress` / `Cancelled` 必须提供 `change_reason` 且禁止 `close_reason`;`target = Closed` 必须提供 `close_reason` 且禁止 `change_reason`;close path 必须通过 `IterationRepository.get_commitment_with_version(...)` 加载 `(IterationCommitment, Version)` |
| 事务边界 | iteration save、optional commitment save、audit、outbox、stale、idempotency complete 同一 UoW;不追加 `IterationChangeRecord` |
| 错误映射 | iteration missing -> `NotFound`;target/reason 组合非法 -> `InvalidInput`;close without commitment -> `DomainRejected`;invalid transition -> `DomainRejected`;version conflict |
| 状态 / 事件 | Iteration `InProgress` / `Closed` / `Cancelled`;close path Commitment `Closed`;enqueue `IterationChanged`;lifecycle-only change 由 trace / outbox 表达,`IterationChangeRecord` 只由 commitment scope / work set change 形成 |
| 测试切口 | start;close closes commitment;cancel;invalid transition;duplicate |

### 9. Query 函数级处理流

#### 9.0 Query authorization / visibility helpers

所有 query authorization 均在 `AuthorizedWorkQueryService` 内执行,只读 repository / resolver port,不 begin UoW,不写 audit、outbox、idempotency、projection freshness 或 reference state。

| helper | 正式输入 | 读取来源 | 通过条件 | denied surface |
|---|---|---|---|---|
| `resolve_query_actor_member` | `ActorContext` | `ActorMemberResolverPort.resolve_actor_member(actor)` | actor 可解析到 `GlobalMemberRef` | not found / rejected -> `NotVisible`;unavailable -> `TemporarilyUnavailable` |
| `authorize_project_read` | `ActorContext`、`ProjectRef` | actor-member resolver + `ProjectMemberRepository.get_by_member(project_ref, member_ref)` | 对应 ProjectMember 为 `Active` 或 `Paused` | `NotVisible` |
| `authorize_work_read` | `ActorContext`、`FormalWorkScope` | `FormalWorkScope.project_ref` + project read helper | owning project 可见 | `NotVisible` |
| `authorize_member_work_read` | `ActorContext`、target `ProjectMember` | target `project_id` + project read helper | actor 可见 target 所属 project,且 target member 为 `Active` 或 `Paused` | `NotVisible` |
| `authorize_iteration_read` | `ActorContext`、`Iteration` | `Iteration.project_id` + project read helper | iteration 所属 project 可见 | `NotVisible` |
| `authorize_trace_read` | `ActorContext`、`WorkTraceSubjectRef`、`TraceVisibilityDeps` | Step 6 trace subject scope 解析表 + project read helper | trace subject 可解析到 actor 可见 project | `NotVisible` |

可见性规则:

- `ProjectMemberResponsibilityState::Active` 和 `Paused` 可以读取该 project 范围 query;`Paused` 不表示可承担新 work。
- `Proposed`、`Released`、actor-member not found / rejected、subject scope unresolved 均 fail-closed 为 `ApplicationError::NotVisible` / `QuerySurface::NotVisible`;actor-member resolver temporary unavailable 映射 `ApplicationError::TemporarilyUnavailable`。
- P0 不允许 query path 使用 `ActorContext.role_refs`、`ActorKind::System`、`ActorKind::Integration` 或 `ProjectOwnerRef` 绕过 ProjectMember membership。

#### 9.1 `GetProjectWorkFactsFlow`

```text
[api.handle_get_project_work_facts]
  -> AuthorizedWorkQueryService.get_project_work_facts(envelope)
     -> validate actor + QueryMetadata
     -> ProjectRepository.get(project_ref)
     -> authorize_project_read(actor, project_ref)
     -> ProjectMemberRepository.list_by_project(project_ref, page=default bounded)
     -> BacklogRepository.get_by_project(project_ref)
     -> WorkItemRepository.list_by_backlog(backlog_ref, page=default bounded)
     -> DependencyRepository.list_active_for_work(each visible work)
     -> map truth summaries -> ProjectWorkFactsView
```

```rust
// AuthorizedWorkQueryService::get_project_work_facts(WorkQueryEnvelope<GetProjectWorkFactsRequest> envelope)
let project = project_repo.get(request.project_ref).await?;
let Some(project) = project else { return Ok(WorkQueryResponse::missing()); };
authorize_project_read(&envelope.actor, project.project_ref(), &actor_member_resolver, &member_repo).await?;
let members = member_repo.list_by_project(project.project_ref(), default_page()).await?;
let backlog = backlog_repo.get_by_project(project.project_ref()).await?;
let formal_work = list_visible_work_summaries(backlog, &envelope.actor).await?;
let relations = list_visible_relations(&formal_work, &envelope.actor).await?;
Ok(WorkQueryResponse::visible(ProjectWorkFactsView::from_truth(project, members, formal_work, relations)))
```

| 项 | 口径 |
|---|---|
| DTO -> View | `project_ref` 为 truth key;response 字段全部来自 committed truth summaries |
| 事务边界 | 无写 UoW;repository read only |
| 错误 / surface | missing project -> `Missing`;authorization denied -> `NotVisible`;repo fail -> `TemporarilyUnavailable` |
| 状态 / 事件 | 无状态变化、无 outbox、无 audit |
| 测试切口 | visible facts;missing project;not visible;empty members/work;repo failure |

#### 9.2 `GetBacklogFlow`

```text
[api.handle_get_backlog]
  -> AuthorizedWorkQueryService.get_backlog(envelope)
     -> validate page from QueryMetadata
     -> ProjectRepository.get(project_ref)
     -> authorize_project_read(actor, project_ref)
     -> BacklogRepository.get_by_project(project_ref)
     -> WorkItemRepository.list_by_backlog(backlog_ref, metadata.page)
     -> map Page<FormalWorkRef> -> BacklogView.items + PublicPageInfo
```

```rust
// AuthorizedWorkQueryService::get_backlog(WorkQueryEnvelope<GetBacklogRequest> envelope)
let project = project_repo.get(request.project_ref).await?;
let Some(project) = project else { return Ok(WorkQueryResponse::missing()); };
authorize_project_read(&envelope.actor, project.project_ref(), &actor_member_resolver, &member_repo).await?;
let backlog = backlog_repo.get_by_project(project.project_ref()).await?;
let Some(backlog) = backlog else { return Ok(WorkQueryResponse::missing()); };
let refs_page = work_repo.list_by_backlog(backlog.backlog_ref(), envelope.metadata.page).await?;
let items = load_filtered_work_summaries(refs_page.items, request.filter).await?;
Ok(WorkQueryResponse::visible(BacklogView::from_parts(backlog, items, refs_page.info.into_public())))
```

| 项 | 口径 |
|---|---|
| DTO -> View | `project_ref` -> backlog lookup;`filter` 应用于 loaded work summaries;page 来自 `QueryMetadata.page` |
| 事务边界 | 无写 UoW |
| 错误 / surface | project/backlog missing -> `Missing`;empty items -> `Visible` with empty items 或 `Empty` by service policy;not visible -> `NotVisible` |
| 状态 / 事件 | 无 |
| 测试切口 | paged backlog;filter;empty backlog;missing backlog;page token mapping |

#### 9.3 `GetWorkItemFlow`

```text
[api.handle_get_work_item]
  -> AuthorizedWorkQueryService.get_work_item(envelope)
     -> WorkItemRepository.get_formal_work(work_ref)
     -> WorkItemRepository.get_formal_work_scope(work_ref)
     -> authorize formal work read by scope
     -> DependencyRepository.list_active_for_work(work_ref, page=bounded)
     -> map FormalWorkRecord + relations -> WorkItemView
```

```rust
// AuthorizedWorkQueryService::get_work_item(WorkQueryEnvelope<GetWorkItemRequest> envelope)
let record = work_repo.get_formal_work(request.work_ref).await?;
let Some(record) = record else { return Ok(WorkQueryResponse::missing()); };
let scope = work_repo.get_formal_work_scope(record.formal_ref()).await?;
let Some(scope) = scope else { return Ok(WorkQueryResponse::not_visible()); };
authorize_work_read(&envelope.actor, &scope, &actor_member_resolver, &member_repo).await?;
let relations = dependency_repo.list_active_for_work(record.formal_ref(), default_page()).await?;
Ok(WorkQueryResponse::visible(WorkItemView::from_record(record, relations.items)))
```

| 项 | 口径 |
|---|---|
| DTO -> View | `work_ref` 统一读取 root / child `FormalWorkRecord` |
| 事务边界 | 无写 UoW |
| 错误 / surface | missing work -> `Missing`;not visible -> `NotVisible`;repo failure -> protocol error |
| 状态 / 事件 | 无 |
| 测试切口 | root work view;child work view;relations;not visible;missing |

#### 9.4 `ListMemberWorkFlow`

```text
[api.handle_list_member_work]
  -> AuthorizedWorkQueryService.list_member_work(envelope)
     -> ProjectMemberRepository.get(project_member_ref)
     -> authorize_member_work_read(actor, member)
     -> ProjectionRepository.get_member_work_view(project_member_ref)
     -> map projection marker freshness -> QuerySurface
     -> apply work_state filter after projection read
```

```rust
// AuthorizedWorkQueryService::list_member_work(WorkQueryEnvelope<ListMemberWorkRequest> envelope)
let member = member_repo.get(request.project_member_ref).await?;
let Some(member) = member else { return Ok(WorkQueryResponse::missing()); };
authorize_member_work_read(&envelope.actor, &member, &actor_member_resolver, &member_repo).await?;
let projection = projection_repo.get_member_work_view(member.project_member_ref()).await?;
let Some(projection) = projection else { return Ok(WorkQueryResponse::rebuilding_or_missing(member_work_view_ref(member.project_member_ref()))); };
Ok(map_projection_to_query_response(projection, request.work_state, envelope.metadata.page))
```

| 项 | 口径 |
|---|---|
| DTO -> View | `project_member_ref` 是 projection key;state filter 不生成 rebuild |
| 事务边界 | 无写 UoW |
| 错误 / surface | member missing -> `Missing`;projection stale -> `Stale`;projection failed -> `Failed`;not visible -> `NotVisible` |
| 状态 / 事件 | 无 |
| 测试切口 | fresh projection;stale surface;failed surface;missing projection;filter |

#### 9.5 `GetIterationSummaryFlow`

```text
[api.handle_get_iteration_summary]
  -> AuthorizedWorkQueryService.get_iteration_summary(envelope)
     -> IterationRepository.get_iteration(iteration_ref)
     -> authorize_iteration_read(actor, iteration)
     -> ProjectionRepository.get_iteration_summary_view(iteration_ref)
     -> map IterationSummaryView + ProjectionViewMarker
```

```rust
// AuthorizedWorkQueryService::get_iteration_summary(WorkQueryEnvelope<GetIterationSummaryRequest> envelope)
let iteration = iteration_repo.get_iteration(request.iteration_ref).await?;
let Some(iteration) = iteration else { return Ok(WorkQueryResponse::missing()); };
authorize_iteration_read(&envelope.actor, &iteration, &actor_member_resolver, &member_repo).await?;
let projection = projection_repo.get_iteration_summary_view(iteration.iteration_ref()).await?;
let Some(projection) = projection else { return Ok(WorkQueryResponse::rebuilding_or_missing(iteration_summary_view_ref(iteration.iteration_ref()))); };
Ok(map_projection_to_query_response(projection))
```

| 项 | 口径 |
|---|---|
| DTO -> View | `iteration_ref` 先验证 truth 存在,再读 projection |
| 事务边界 | 无写 UoW |
| 错误 / surface | iteration missing -> `Missing`;projection missing -> `Rebuilding` / `Missing`;stale marker preserved |
| 状态 / 事件 | 无 |
| 测试切口 | summary fresh;missing iteration;stale projection;not visible |

#### 9.6 `SearchWorkFlow`

```text
[api.handle_search_work]
  -> AuthorizedWorkQueryService.search_work(envelope)
     -> ProjectRepository.get(project_ref)
     -> authorize_project_read(actor, project_ref)
     -> ProjectionRepository.search_work(project_ref, criteria, metadata.page)
     -> map Page<WorkSearchProjection> -> WorkSearchResult + PublicPageInfo
```

```rust
// AuthorizedWorkQueryService::search_work(WorkQueryEnvelope<SearchWorkRequest> envelope)
let project = project_repo.get(request.project_ref).await?;
let Some(project) = project else { return Ok(WorkQueryResponse::missing()); };
authorize_project_read(&envelope.actor, project.project_ref(), &actor_member_resolver, &member_repo).await?;
let page = projection_repo.search_work(project.project_ref(), request.criteria, envelope.metadata.page).await?;
Ok(WorkQueryResponse::visible(WorkSearchResult::from_page(project.project_ref(), request.criteria, page)))
```

| 项 | 口径 |
|---|---|
| DTO -> View | projection identity = `ProjectRef + WorkSearchCriteriaDigest`;repository read = `ProjectRef + WorkSearchCriteria + PageRequest`;criteria 不携带 page, page 不进入 `DerivedWorkViewRef` |
| 事务边界 | 无写 UoW |
| 错误 / surface | project missing -> `Missing`;projection failed -> `Failed`;not visible -> `NotVisible` |
| 状态 / 事件 | 无 |
| 测试切口 | criteria search;pagination;projection failure;missing project |

#### 9.7 `GetWorkTraceFlow`

```text
[api.handle_get_work_trace]
  -> AuthorizedWorkQueryService.get_work_trace(envelope)
     -> authorize trace subject read through `TraceVisibilityDeps`
     -> AuditRepository.list_trace_records(subject_ref, metadata.page)
     -> map Page<WorkTraceRecord> -> WorkTraceView
```

```rust
// AuthorizedWorkQueryService::get_work_trace(WorkQueryEnvelope<GetWorkTraceRequest> envelope)
let deps = TraceVisibilityDeps {
    actor_member_resolver: &actor_member_resolver,
    member_repo: &member_repo,
    backlog_repo: &backlog_repo,
    work_repo: &work_repo,
    promote_repo: &promote_repo,
    dependency_repo: &dependency_repo,
    iteration_repo: &iteration_repo,
    audit_repo: &audit_repo,
};
authorize_trace_read(&envelope.actor, request.subject_ref, &deps).await?;
let page = audit_repo.list_trace_records(request.subject_ref, envelope.metadata.page).await?;
if page.items.is_empty() {
    return Ok(WorkQueryResponse::empty(WorkTraceView::empty(request.subject_ref, page.info.into_public())));
}
Ok(WorkQueryResponse::visible(WorkTraceView::from_page(request.subject_ref, page)))
```

| 项 | 口径 |
|---|---|
| DTO -> View | `subject_ref` maps to trace records;page maps to `PublicPageInfo` |
| 事务边界 | 无写 UoW |
| 错误 / surface | not visible -> `NotVisible`;no records -> `Empty`;repo fail -> `TemporarilyUnavailable` |
| 状态 / 事件 | 无 |
| 测试切口 | trace page;empty;not visible;page token |

#### 9.8 `GetProjectBoardViewFlow`

```text
[api.handle_get_project_board_view]
  -> AuthorizedWorkQueryService.get_project_board_view(envelope)
     -> ProjectRepository.get(project_ref)
     -> authorize_project_read(actor, project_ref)
     -> ProjectionRepository.get_project_board_view(project_ref)
     -> map ProjectionViewMarker -> QuerySurface
```

```rust
// AuthorizedWorkQueryService::get_project_board_view(WorkQueryEnvelope<GetProjectBoardViewRequest> envelope)
let project = project_repo.get(request.project_ref).await?;
let Some(project) = project else { return Ok(WorkQueryResponse::missing()); };
authorize_project_read(&envelope.actor, project.project_ref(), &actor_member_resolver, &member_repo).await?;
let projection = projection_repo.get_project_board_view(project.project_ref()).await?;
let Some(projection) = projection else { return Ok(WorkQueryResponse::rebuilding_or_missing(project_board_view_ref(project.project_ref()))); };
Ok(map_projection_to_query_response(projection))
```

| 项 | 口径 |
|---|---|
| DTO -> View | `project_ref` 是 projection key;board view 由 projection repo 返回 |
| 事务边界 | 无写 UoW |
| 错误 / surface | project missing -> `Missing`;projection missing -> `Rebuilding` / `Missing`;freshness stale -> `Stale` |
| 状态 / 事件 | 无 |
| 测试切口 | fresh board;stale board;missing projection;not visible |

### 10. Inbound Event Consumer 函数级处理流

#### 10.1 `ConsumeIdentityMemberChangedFlow`

```text
[worker.consume_identity_member_changed]
  -> WorkInboundConsumerService.consume_identity_member_changed(envelope)
     -> validate envelope + version + member_ref
     -> reserve dedup key in UoW
     -> MemberCapabilitySnapshot::from_identity(member_ref, capability_refs)
     -> ReferenceResolutionState::unresolved(ExternalReferenceRef::from_member(member_ref))
     -> ReferenceResolutionState.mark_resolved(occurred_at)
     -> ReferenceSnapshotRepository.save_member_snapshot(...)
     -> ReferenceSnapshotRepository.save_reference_state(...)
     -> ProjectMemberRepository.list_by_member(member_ref, page=bounded)
     -> ProjectionRepository.list_views_affected_by_member(member_ref, page=bounded)
     -> ProjectionRepository.mark_stale(affected public member/project views, cursor, &uow) when affected not empty
     -> idempotency complete + commit
```

```rust
// WorkInboundConsumerService::consume_identity_member_changed(WorkInboundEventEnvelope<IdentityMemberChangedPayload> envelope)
let key = inbound_dedup_key(&envelope, "identity.member.changed.v1")?;
let uow = unit_of_work.begin().await?;
reserve_inbound(key, envelope.payload_digest(), &uow).await?;
let mut state = ReferenceResolutionState::unresolved(ExternalReferenceRef::from_member(envelope.payload.member_ref));
state.mark_resolved(envelope.occurred_at)?;
let snapshot = MemberCapabilitySnapshot::from_identity(envelope.payload.member_ref, envelope.payload.capability_refs)?;
reference_repo.save_reference_state(state, None, &uow).await?;
reference_repo.save_member_snapshot(snapshot, None, &uow).await?;
let affected_members_page: PageRequest = consumer_config.projection_stale_page();
let affected_views_page: PageRequest = consumer_config.projection_stale_page();
let affected_members = project_member_repo
    .list_by_member(envelope.payload.member_ref, affected_members_page)
    .await?;
let affected_views = projection_repo
    .list_views_affected_by_member(envelope.payload.member_ref, affected_views_page)
    .await?;
if !affected_views.items.is_empty() {
    projection_repo.mark_stale(affected_views.items, truth_cursor_from_event(&envelope), &uow).await?;
}
```

| 项 | 口径 |
|---|---|
| Event -> Domain | payload `member_ref` + `capability_refs` 构造 `MemberCapabilitySnapshot` |
| 事务边界 | snapshot、reference state、projection stale、idempotency complete 同一 UoW |
| 错误映射 | missing member/capabilities -> `DeadLetter`;version unsupported -> `DeadLetter`;repo failure -> retry |
| 状态 / 事件 | reference `Resolved`;`ProjectMemberRepository.list_by_member(...)` 确认 Work-owned affected responsibilities;`ProjectionRepository.list_views_affected_by_member(...)` 返回既有 public `DerivedWorkViewRef`;affected member/project/search views stale;不写 Work truth |
| 测试切口 | consume success;duplicate event;missing member dead-letter;stale views marked;no affected public views -> snapshot saved and no stale marker |

#### 10.2 `ConsumeMethodDefinitionChangedFlow`

```text
[worker.consume_method_definition_changed]
  -> WorkInboundConsumerService.consume_method_definition_changed(envelope)
     -> reserve dedup in UoW
     -> MethodDefinitionSnapshot::from_method_library(definition_ref, definition_kind)
     -> ReferenceResolutionState::unresolved(ExternalReferenceRef::from_method_definition(definition_ref))
     -> mark_resolved(occurred_at)
     -> save method snapshot + reference state
     -> ProjectionRepository.list_views_affected_by_method(definition_ref, page=bounded)
     -> mark project/search views stale for affected method definition when affected not empty
```

```rust
// WorkInboundConsumerService::consume_method_definition_changed(WorkInboundEventEnvelope<MethodDefinitionChangedPayload> envelope)
let snapshot = MethodDefinitionSnapshot::from_method_library(envelope.payload.definition_ref, envelope.payload.definition_kind)?;
let mut state = ReferenceResolutionState::unresolved(ExternalReferenceRef::from_method_definition(envelope.payload.definition_ref));
state.mark_resolved(envelope.occurred_at)?;
reference_repo.save_method_snapshot(snapshot, None, &uow).await?;
reference_repo.save_reference_state(state, None, &uow).await?;
let affected_views_page: PageRequest = consumer_config.projection_stale_page();
let affected_views = projection_repo
    .list_views_affected_by_method(envelope.payload.definition_ref, affected_views_page)
    .await?;
if !affected_views.items.is_empty() {
    projection_repo.mark_stale(affected_views.items, truth_cursor_from_event(&envelope), &uow).await?;
}
```

| 项 | 口径 |
|---|---|
| Event -> Domain | definition ref/kind 构造 method snapshot |
| 事务边界 | snapshot、reference state、projection stale、idempotency complete 同一 UoW |
| 错误映射 | missing definition -> `DeadLetter`;repo failure -> retry |
| 状态 / 事件 | reference `Resolved`;`ProjectionRepository.list_views_affected_by_method(...)` 返回既有 public `DerivedWorkViewRef`;affected search/board views stale;不改 WorkItem truth |
| 测试切口 | snapshot save;duplicate;missing ref dead-letter;affected views stale;no affected public views -> snapshot saved and no stale marker |

`affected_members_page` / `affected_views_page` 是 consumer/service 依据配置 `PageLimit` 形成的 core `PageRequest`,不进入 public query DTO,也不进入 `DerivedWorkViewRef`。`affected_members` 只用于确认该 `GlobalMemberRef` 在 Work truth 中存在受影响 project responsibility,并为 fake / tests 提供可断言 scope;consumer 不得用它临时构造 project-board / member-work / work-search ref。所有进入 `mark_stale(...)` 的 affected views 必须来自 `ProjectionRepository.list_views_affected_by_member(...)` / `list_views_affected_by_method(...)` 返回的既有 public view refs。返回空页表示当前没有可标脏 public projection,不是错误。

#### 10.3 `ConsumeConversationWorkContextChangedFlow`

```text
[worker.consume_conversation_work_context_changed]
  -> WorkInboundConsumerService.consume_conversation_work_context_changed(envelope)
     -> reserve dedup in UoW
     -> validate SourceWorkRef and optional digest
     -> ReferenceResolutionState::unresolved(ExternalReferenceRef::from_source_work(source_ref))
     -> optionally mark_resolved when digest matches source_digest contract
     -> save reference state / pending source marker
     -> mark affected existing public work views stale when source_ref already participates in board/member/search projections;otherwise no projection stale
```

```rust
// WorkInboundConsumerService::consume_conversation_work_context_changed(WorkInboundEventEnvelope<ConversationWorkContextChangedPayload> envelope)
let reference_ref = ExternalReferenceRef::from_source_work(envelope.payload.source_ref);
let mut state = ReferenceResolutionState::unresolved(reference_ref);
if digest_matches(envelope.payload.source_ref.source_digest, envelope.payload.source_digest) {
    state.mark_resolved(envelope.occurred_at)?;
}
reference_repo.save_reference_state(state, None, &uow).await?;
let affected = affected_existing_source_work_views(envelope.payload.source_ref)?;
if !affected.is_empty() {
    projection_repo.mark_stale(affected, truth_cursor_from_event(&envelope), &uow).await?;
}
```

| 项 | 口径 |
|---|---|
| Event -> Domain | `SourceWorkRef` 只保存 ref/digest,不保存 conversation body |
| 事务边界 | reference state、pending source marker、projection stale only when existing public work views are affected、idempotency complete 同一 UoW |
| 错误映射 | missing source -> `DeadLetter`;digest mismatch -> unresolved state,不创建 Work truth |
| 状态 / 事件 | source reference unresolved/resolved marker;不创建 PromoteResult;不创建 promote / intake projection identity |
| 测试切口 | source marker;digest mismatch;missing source dead-letter;duplicate;no ad hoc promote/intake view ref |

#### 10.4 `ConsumeProcessTimingChangedFlow`

```text
[worker.consume_process_timing_changed]
  -> WorkInboundConsumerService.consume_process_timing_changed(envelope)
     -> reserve dedup in UoW
     -> ReferenceResolutionState::unresolved(ExternalReferenceRef::from_process_timebox(timebox_ref))
     -> mark_resolved(occurred_at)
     -> save reference state
     -> if project_ref present: mark iteration summary / board stale
```

```rust
// WorkInboundConsumerService::consume_process_timing_changed(WorkInboundEventEnvelope<ProcessTimingChangedPayload> envelope)
let mut state = ReferenceResolutionState::unresolved(ExternalReferenceRef::from_process_timebox(envelope.payload.timebox_ref));
state.mark_resolved(envelope.occurred_at)?;
reference_repo.save_reference_state(state, None, &uow).await?;
if let Some(project_ref) = envelope.payload.project_ref {
    projection_repo.mark_stale(affected_process_views(project_ref), truth_cursor_from_event(&envelope), &uow).await?;
}
```

| 项 | 口径 |
|---|---|
| Event -> Domain | process timebox ref 只更新 local reference state |
| 事务边界 | reference state、optional stale、idempotency complete 同一 UoW |
| 错误映射 | missing timebox -> `DeadLetter`;repo failure -> retry |
| 状态 / 事件 | timebox reference resolved;不直接 open / close Iteration |
| 测试切口 | with project stale;without project only reference;missing timebox;duplicate |

#### 10.5 `ConsumeGovernanceDecisionChangedFlow`

```text
[worker.consume_governance_decision_changed]
  -> WorkInboundConsumerService.consume_governance_decision_changed(envelope)
     -> reserve dedup in UoW
     -> save source reference state when source_ref present
     -> save evidence reference state when evidence_ref present
     -> mark affected dependency/blocker/work views stale
```

```rust
// WorkInboundConsumerService::consume_governance_decision_changed(WorkInboundEventEnvelope<GovernanceDecisionChangedPayload> envelope)
if envelope.payload.source_ref.is_none() && envelope.payload.evidence_ref.is_none() {
    return Err(ApplicationError::DeadLetter);
}
if let Some(source_ref) = envelope.payload.source_ref {
    save_resolved_reference(ExternalReferenceRef::from_source_work(source_ref), envelope.occurred_at, &uow).await?;
}
if let Some(evidence_ref) = envelope.payload.evidence_ref {
    save_resolved_reference(ExternalReferenceRef::from_evidence(evidence_ref), envelope.occurred_at, &uow).await?;
}
projection_repo.mark_stale(affected_governance_views(&envelope.payload), truth_cursor_from_event(&envelope), &uow).await?;
```

| 项 | 口径 |
|---|---|
| Event -> Domain | governance source/evidence 只形成 reference state |
| 事务边界 | reference states、stale、idempotency complete 同一 UoW |
| 错误映射 | source/evidence 都缺失 -> `DeadLetter`;repo failure -> retry |
| 状态 / 事件 | affected views stale;不生成 governance decision / dependency truth |
| 测试切口 | source only;evidence only;both missing dead-letter;duplicate |

#### 10.6 `ConsumeArtifactEvidenceChangedFlow`

```text
[worker.consume_artifact_evidence_changed]
  -> WorkInboundConsumerService.consume_artifact_evidence_changed(envelope)
     -> reserve dedup in UoW
     -> ReferenceResolutionState::unresolved(ExternalReferenceRef::from_evidence(evidence_ref))
     -> mark_resolved or failed based on evidence_ref.verified_state
     -> save reference state
     -> mark work/dependency/blocker views stale
```

```rust
// WorkInboundConsumerService::consume_artifact_evidence_changed(WorkInboundEventEnvelope<ArtifactEvidenceChangedPayload> envelope)
let mut state = ReferenceResolutionState::unresolved(ExternalReferenceRef::from_evidence(envelope.payload.evidence_ref));
match envelope.payload.evidence_ref.verified_state {
    EvidenceVerifiedState::Verified => state.mark_resolved(envelope.occurred_at)?,
    EvidenceVerifiedState::Rejected => state.mark_stale(ReferenceStaleReason::rejected_evidence(envelope.payload.evidence_ref))?,
    EvidenceVerifiedState::Unverified => {}
}
reference_repo.save_reference_state(state, None, &uow).await?;
projection_repo.mark_stale(affected_evidence_views(envelope.payload.evidence_ref), truth_cursor_from_event(&envelope), &uow).await?;
```

| 项 | 口径 |
|---|---|
| Event -> Domain | `ExternalEvidenceRef` 只更新 evidence reference state |
| 事务边界 | reference state、stale、idempotency complete 同一 UoW |
| 错误映射 | missing evidence -> `DeadLetter`;repo failure -> retry |
| 状态 / 事件 | evidence reference resolved/stale/unresolved;不直接 complete work |
| 测试切口 | verified evidence;rejected evidence;unverified;missing evidence;duplicate |

#### 10.7 `ConsumeRuntimePromoteRequestedFlow`

```text
[worker.consume_runtime_promote_requested]
  -> WorkInboundConsumerService.consume_runtime_promote_requested(envelope)
     -> reserve dedup in UoW
     -> SourceWorkResolverPort.resolve_source_work(source_ref)
     -> WorkTruthPolicy.assert_no_external_body(source.summary)
     -> save ReferenceResolutionState for source_ref
     -> PendingPromoteIntake::from_runtime_event(source_ref, promote_reason, source_event_id)
     -> PromoteRepository.save_pending_intake(intake, &uow)
     -> complete idempotency
```

```rust
// WorkInboundConsumerService::consume_runtime_promote_requested(WorkInboundEventEnvelope<RuntimePromoteRequestedPayload> envelope)
let source = source_resolver.resolve_source_work(envelope.payload.source_ref).await?;
WorkTruthPolicy::assert_no_external_body(source.summary)?;
let mut state = ReferenceResolutionState::unresolved(ExternalReferenceRef::from_source_work(envelope.payload.source_ref));
state.mark_resolved(envelope.occurred_at)?;
reference_repo.save_reference_state(state, None, &uow).await?;
let intake = PendingPromoteIntake::from_runtime_event(
    envelope.payload.source_ref,
    envelope.payload.promote_reason,
    envelope.source_event_id,
)?;
promote_repo.save_pending_intake(intake, &uow).await?;
```

| 项 | 口径 |
|---|---|
| Event -> Domain | runtime source request 形成 pending intake,不调用 `PromoteResult::evaluate` |
| 事务边界 | reference state、pending intake marker、idempotency complete 同一 UoW;pending intake 无 public projection identity,不 mark projection stale |
| 错误映射 | missing source/reason -> `DeadLetter`;source unresolved -> unresolved / retry by consumer policy |
| 状态 / 事件 | no Work truth change;不 enqueue `PromoteResultRecorded`;不创建 promote / intake projection identity |
| 测试切口 | pending intake;source unresolved;missing reason dead-letter;no promote truth created |

### 11. Outbound Event 发布流

#### 11.1 Outbound dispatch 总图

```text
[PublishWorkOutboxFlow]
  -> WorkOutboxRepository.list_pending(page)
     -> for each Versioned<WorkOutboxRecord>:
          let record = versioned.record
          let expected_version = versioned.version
          validate record.event_kind matches record.source_ref
          load committed source object by record.source_ref
          build WorkOutboundPublication / WorkOutboundEventEnvelope<T>
          WorkOutboxPublisherPort.publish(publication)
          UnitOfWork.begin()
          mark_published(..., expected_version) or mark_failed(..., expected_version)
          UnitOfWork.commit()
```

```rust
// WorkOutboxPublishService::publish_one(Versioned<WorkOutboxRecord> versioned)
let record = versioned.record;
let expected_version = versioned.version;
let outbox_id = record.outbox_id;
let publication = match (record.event_kind, record.source_ref) {
    (WorkOutboxEventKind::ProjectChanged, WorkOutboxSourceRef::Project { .. }) => build_project_changed(record).await,
    (WorkOutboxEventKind::BacklogChanged, WorkOutboxSourceRef::Backlog { .. }) => build_backlog_changed(record).await,
    (WorkOutboxEventKind::ProjectMemberChanged, WorkOutboxSourceRef::ProjectMember(_)) => build_project_member_changed(record).await,
    (WorkOutboxEventKind::WorkItemChanged, WorkOutboxSourceRef::FormalWork(_)) => build_work_item_changed(record).await,
    (WorkOutboxEventKind::PromoteResultRecorded, WorkOutboxSourceRef::PromoteResult(_)) => build_promote_result_recorded(record).await,
    (WorkOutboxEventKind::WorkDependencyChanged, WorkOutboxSourceRef::Dependency(_)) => build_work_dependency_changed(record).await,
    (WorkOutboxEventKind::WorkBlockerChanged, WorkOutboxSourceRef::Blocker(_)) => build_work_blocker_changed(record).await,
    (WorkOutboxEventKind::IterationChanged, WorkOutboxSourceRef::Iteration(_)) => build_iteration_changed(record).await,
    (WorkOutboxEventKind::WorkTraceAvailable, WorkOutboxSourceRef::TraceAvailable { .. }) => build_work_trace_available(record).await,
    (WorkOutboxEventKind::DerivedWorkViewChanged, WorkOutboxSourceRef::DerivedView(_)) => build_derived_work_view_changed(record).await,
    _ => Err(ApplicationError::InvalidOutboxSource),
};
let publication_ref = outbox_publisher.publish(publication?).await;
mark_publication_result(outbox_id, publication_ref, expected_version).await?;
```

#### 11.2 Outbound event flow table

| Event | Payload builder | Topic | Source identity / lookup | Failure behavior | 测试切口 |
|---|---|---|---|---|---|
| `ProjectChanged` | `ProjectChangedEvent::from_project(project, reason)` | `work.project.changed.v1` | `WorkOutboxSourceRef::Project { project_ref, reason }` -> `ProjectRepository.get(project_ref)` | mark failed,do not rollback truth | payload fields,topic,mark published |
| `BacklogChanged` | `BacklogChangedEvent::from_backlog(backlog, reason)` | `work.backlog.changed.v1` | `WorkOutboxSourceRef::Backlog { backlog_ref, reason }` -> `BacklogRepository.get(backlog_ref)` | mark failed,do not rollback truth | payload fields,topic,mark published |
| `ProjectMemberChanged` | `ProjectMemberChangedEvent::from_member(member)` | `work.project_member.changed.v1` | `WorkOutboxSourceRef::ProjectMember(ref)` -> `ProjectMemberRepository.get(ref)` | mark failed | payload member/global distinction |
| `WorkItemChanged` | `WorkItemChangedEvent::from_formal_work(record)` | `work.formal_work.changed.v1` | `WorkOutboxSourceRef::FormalWork(ref)` -> `WorkItemRepository.get_formal_work(ref)` | mark failed | root/child payload |
| `PromoteResultRecorded` | `PromoteResultRecordedEvent::from_result(result)` | `work.promote_result.recorded.v1` | `WorkOutboxSourceRef::PromoteResult(ref)` -> `PromoteRepository.get(ref)` | mark failed | accepted/rejected payload |
| `WorkDependencyChanged` | `WorkDependencyChangedEvent::from_dependency(dependency)` | `work.dependency.changed.v1` | `WorkOutboxSourceRef::Dependency(ref)` -> `DependencyRepository.get_dependency(ref)` | mark failed | upstream/downstream/state |
| `WorkBlockerChanged` | `WorkBlockerChangedEvent::from_blocker(blocker)` | `work.blocker.changed.v1` | `WorkOutboxSourceRef::Blocker(ref)` -> `DependencyRepository.get_blocker(ref)` | mark failed | `evidence_ref` 从 `WorkBlocker.resolved_evidence_ref` 派生,不读取 evidence body |
| `IterationChanged` | `IterationChangedEvent::from_iteration(iteration, commitment)` | `work.iteration.changed.v1` | `WorkOutboxSourceRef::Iteration(ref)` -> `IterationRepository.get_iteration(ref)` + `get_commitment(ref)` | mark failed | commitment optional |
| `WorkTraceAvailable` | `WorkTraceAvailableEvent::from_trace(trace, handoff_ref)` | `work.trace.available.v1` | `WorkOutboxSourceRef::TraceAvailable { trace_id, handoff_ref }` -> `AuditRepository.get_trace_record(trace_id)` | mark failed | handoff optional |
| `DerivedWorkViewChanged` | `DerivedWorkViewChangedEvent::from_state(state)` | `work.derived_view.changed.v1` | `WorkOutboxSourceRef::DerivedView(ref)` -> `ProjectionRepository.get_freshness_state(ref)` | mark failed | freshness/cursor payload |

Outbound 发布不变量:

- `WorkOutboundEventEnvelope.outbox_id` 来自 `WorkOutboxRecord.outbox_id`;bus publication ref 只在 publish result 中返回。
- `WorkOutboundEventEnvelope.trace_context_ref` 和 `occurred_at` 来自 `WorkOutboxRecord`,不得由 publisher adapter 重新生成。
- payload builder 必须从 `record.source_ref` 回查 committed source object;不得按 `outbox_id`、event kind 或 latest record 猜 source。
- payload builder 不读取或复制外部正文。
- `mark_published` / `mark_failed` 的 `expected_version` 必须来自同一条 `Versioned<WorkOutboxRecord>` pending item;不得假定版本、重查 storage 内部版本或移除 optimistic guard。
- publish failure 只调用 `WorkOutboxRecord.mark_failed(reason)` 后保存,不修改原 truth。
- unsupported `event_kind` 或 `event_kind/source_ref` mismatch 映射 `InvalidOutboxSource` / failed marker,不得静默丢弃。

### 12. Operations Job 函数级处理流

#### 12.1 Job 共享模板

```text
[jobs::WorkOperationsJobRunner.run_<job>]
  | validate WorkJobMetadata.actor + command_metadata.idempotency_key
  | compute RequestDigest from stable job input
  v
[application::<JobService>.<job>]
  | UnitOfWork.begin()
  | IdempotencyRepository.reserve(job key, operation, digest, &uow)
  | duplicate -> rollback UoW + return JobResultRepository.get_report(result_ref)
  | execute job-specific scan / write / handoff
  | build WorkJobReport / ReconciliationReport;when report carries receipt, use { idempotency: Applied, ... }
  | JobResultRepository.save_report(result_ref, StoredJobResult::<kind>(report), &uow)
  | IdempotencyRepository.complete(reservation, result_ref, &uow)
  | UnitOfWork.commit()
```

Job 共享不变量:

- Job 写入同样必须通过 `CommandMetadata.request.idempotency_key` 保护。
- Job digest 不包含 `job_run_id`、`request_id`、`requested_at` 或 trace 字段;只包含 operation、job scope、page / batch input 和会改变结果的业务参数。
- Job 不修复业务 truth;只能发布 outbox、重建 projection、刷新 reference snapshot、写 reconciliation report / handoff marker。
- 单条 item 失败进入 `WorkJobReport.failed_refs`;整个 job 输入无效才 reject。
- Job success path 必须先 `JobResultRepository.save_report(...)`,再 `IdempotencyRepository.complete(...)`,二者与 job marker / outbox publication marker / projection marker / handoff marker 同一 UoW。
- Job duplicate 必须通过 `JobResultRepository.get_report(ApplicationResultRef)` 返回 stored report surface,不得从当前 truth / projection / outbox / reference store 重新扫描生成 report。若 report carries `WorkCommandReceipt`,duplicate replay 只 overlay receipt idempotency;无 receipt 的 report 原样返回 stored payload。
- `ApplicationResultRef` 缺失、stored report 缺失或 stored job result variant 与当前 operation 不匹配时,返回 `ApplicationError::DuplicateResultMissing` / `TemporarilyUnavailable`。

#### 12.2 `PublishWorkOutboxFlow`

```text
[jobs.run_publish_work_outbox]
  -> WorkOutboxPublishService.publish_outbox(input)
     -> WorkOutboxRepository.list_pending(page)
     -> for each Versioned<WorkOutboxRecord>:
          let record = versioned.record
          let expected_version = versioned.version
          build WorkOutboundPublication by record.event_kind + record.source_ref
          WorkOutboxPublisherPort.publish(publication)
          UnitOfWork.begin()
          WorkOutboxRecord.mark_published(publication_ref) or mark_failed(reason)
          WorkOutboxRepository.mark_published / mark_failed with expected_version
          UnitOfWork.commit()
     -> WorkJobReport
```

```rust
// WorkOutboxPublishService::publish_outbox(PublishWorkOutboxJobInput input)
let pending = outbox_repo.list_pending(input.page).await?;
for versioned in pending.items {
    let record = versioned.record;
    let expected_version = versioned.version;
    let outbox_id = record.outbox_id;
    match build_publication(record).await {
        Ok(publication) => match publisher.publish(publication).await {
            Ok(publication_ref) => mark_published(outbox_id, publication_ref, expected_version).await?,
            Err(error) => mark_failed(outbox_id, OutboxFailureReason::from(error), expected_version).await?,
        },
        Err(error) => mark_failed(outbox_id, OutboxFailureReason::from(error), expected_version).await?,
    }
}
Ok(WorkJobReport::from_counts(input.metadata.job_run_id, pending.info, changed, failed_refs))
```

| 项 | 口径 |
|---|---|
| DTO -> Job | `page` 来自 job input;metadata idempotency key 必填 |
| 事务边界 | list_pending 无写 UoW;每条 mark published/failed 单独 UoW;job report save + idempotency complete 同一 UoW |
| version 来源 | `WorkOutboxRepository.list_pending(input.page)` 返回 `Page<Versioned<WorkOutboxRecord>>`;每条 `mark_published` / `mark_failed` 使用同一 item 的 `versioned.version` 作为 `expected_version` |
| duplicate replay | completed same digest 通过 `JobResultRepository.get_report(result_ref)` 返回 stored `StoredJobResult::WorkJob`;不得重新 list pending |
| 错误映射 | missing idempotency -> `InvalidRequest`;publisher fail -> mark failed + report;version conflict -> item already handled / item conflict report;repo fail -> report failed / retry |
| 状态 / 事件 | `OutboxPublicationState` -> `Published` / `Failed` |
| 测试切口 | no pending zero report;publish success;publish failure marks failed;duplicate job;version conflict uses pending item version |

#### 12.3 `RebuildWorkProjectionsFlow`

```text
[jobs.run_rebuild_work_projections]
  -> WorkDerivedMaintenanceService.rebuild_work_projections(input)
     -> reserve job idempotency in UoW
     -> WorkTruthSnapshotRepository.load_project_truth_snapshot(project_ref)
     -> WorkTruthSnapshotRepository.load_truth_cursor(project_ref)
     -> build ProjectProjectionBatch from committed truth
     -> DerivedWorkViewPolicy.assert_read_only_projection(each view_ref)
     -> ProjectionRepository.mark_rebuilding(batch.view_refs(), cursor, &uow)
     -> ProjectionRepository.replace_project_views(batch, cursor, &uow)
     -> DerivedWorkViewState.mark_fresh(cursor)
     -> optional DerivedWorkViewChanged outbox
     -> complete + commit
```

```rust
// WorkDerivedMaintenanceService::rebuild_work_projections(RebuildWorkProjectionsJobInput input)
let snapshot = truth_snapshot_repo.load_project_truth_snapshot(input.project_ref).await?;
let cursor = truth_snapshot_repo.load_truth_cursor(input.project_ref).await?;
let batch = ProjectProjectionBatch::from_truth(snapshot, input.projection_set)?;
for view_ref in batch.view_refs() {
    DerivedWorkViewPolicy::assert_read_only_projection(view_ref)?;
}
projection_repo.mark_rebuilding(batch.view_refs(), cursor, &uow).await?;
projection_repo.replace_project_views(batch, cursor, &uow).await?;
```

`load_project_truth_snapshot(...)` 返回 Step 6 定义的 contracts shared body-free `ProjectWorkTruthSnapshot`,其字段只能是 `ProjectTruthSummary`、`BacklogTruthSummary`、`ProjectMemberTruthSummary`、`FormalWorkTruthSummary`、`WorkRelationTruthSummary` 和 `IterationTruthSummary`。`ProjectProjectionBatch::from_truth(...)` 不得要求 `Project`、`Backlog`、`ProjectMember`、`Iteration` 或 `IterationCommitment` 等 domain-only object;repository 可以在 adapter 内部从 committed truth 表组装 summary,但不能把 domain object 穿过 job / port / contracts surface。

| 项 | 口径 |
|---|---|
| DTO -> Job | `project_ref` + `projection_set` 决定 rebuild scope |
| 事务边界 | projection replace、fresh marker、optional outbox、idempotency complete 同一 UoW |
| 错误映射 | missing truth snapshot -> failed report;projection build failure -> `ProjectionRepository.mark_failed(...)`;repo failure -> rollback |
| 状态 / 事件 | derived views replaced;freshness `Fresh`;optional enqueue `DerivedWorkViewChanged` |
| 测试切口 | rebuild selected set;truth missing;failed marker;query sees fresh marker |

#### 12.4 `RefreshExternalReferenceSnapshotsFlow`

```text
[jobs.run_refresh_external_reference_snapshots]
  -> WorkReferenceRefreshService.refresh_external_reference_snapshots(input)
     -> reserve job idempotency in UoW
     -> load refresh refs by reference_scope:
        - None / StaleOnly -> ReferenceSnapshotRepository.list_stale_references(page)
        - Project -> validate project_ref, then ReferenceSnapshotRepository.list_project_references(project_ref, page)
        - ExplicitRefs -> validate non-empty reference_refs, stable dedup and page request refs
     -> dispatch each ExternalReferenceRef to resolver port
     -> save snapshot / reference state
     -> mark affected views stale
     -> report scanned/changed/failed
```

```rust
// WorkReferenceRefreshService::refresh_external_reference_snapshots(RefreshExternalReferenceSnapshotsJobInput input)
let refs = load_refresh_refs(input.reference_scope, input.page).await?;
for reference_ref in refs.items {
    match resolve_reference(reference_ref).await {
        Ok(snapshot_update) => save_snapshot_update(snapshot_update, &uow).await?,
        Err(error) => {
            let failure_reason = ReferenceFailureReason::from_resolver_error(reference_ref, error.message());
            reference_repo.mark_reference_failed(
                reference_ref,
                failure_reason,
                clock.now(),
                current_reference_version(reference_ref).await?,
                &uow,
            ).await?;
            failed_refs.push(reference_ref);
        }
    }
}
projection_repo.mark_stale(affected_reference_views(&refs.items), current_cursor(), &uow).await?;
```

`load_refresh_refs(scope, page)` formal branch mapping:

```rust
match scope {
    None => reference_repo.list_stale_references(page).await?,
    Some(scope) if scope.scope_kind == ExternalReferenceScopeKind::StaleOnly => {
        assert_scope_empty(scope.project_ref, scope.reference_refs)?;
        reference_repo.list_stale_references(page).await?
    }
    Some(scope) if scope.scope_kind == ExternalReferenceScopeKind::Project => {
        let project_ref = scope.project_ref.ok_or(ApplicationError::InvalidRequest)?;
        assert_empty(scope.reference_refs)?;
        reference_repo.list_project_references(project_ref, page).await?
    }
    Some(scope) if scope.scope_kind == ExternalReferenceScopeKind::ExplicitRefs => {
        assert_none(scope.project_ref)?;
        assert_non_empty(scope.reference_refs)?;
        Page::from_items(stable_dedup_preserve_order(scope.reference_refs), page)
    }
}
```

`ReferenceSnapshotRepository.list_project_references(project_ref, page)` is the only formal owner of `Project` expansion. It returns typed `ExternalReferenceRef` values associated with the project through committed Work truth / local reference snapshot indexes: project member identity refs, method definition refs tied to formal work admission, project / work / promote source refs, work lifecycle / dependency / blocker evidence refs, and iteration process timebox refs. The repository deduplicates by `ExternalReferenceRef` stable identity, sorts by typed variant then canonical inner ref, and applies pagination after deduplication. Empty page is a valid no-op. The flow must not scan projection rows, parse ids, or use ad hoc `refs_for_project(...)` helpers.

| 项 | 口径 |
|---|---|
| DTO -> Job | `reference_scope=None` / `StaleOnly` 表示 list stale refs;`Project` 由 repository 展开 typed refs;`ExplicitRefs` 使用 request typed refs;typed ref variant 决定 resolver |
| 事务边界 | snapshot/reference writes、stale、idempotency complete 同一 UoW;实现可按 page 分批 |
| 错误映射 | resolver failure -> failed ref + state failed/stale;invalid scope -> `InvalidRequest` |
| 状态 / 事件 | reference states refreshed;affected views stale |
| 测试切口 | stale list path;project scope expansion;explicit scope;resolver failure;no refs;duplicate job |

#### 12.5 `RunWorkReconciliationFlow`

```text
[jobs.run_work_reconciliation]
  -> WorkReconciliationService.run_work_reconciliation(input)
     -> reserve job idempotency in UoW
     -> read truth snapshot / projection freshness / outbox / reference states
     -> compute ReconciliationReport
     -> save report marker if repository supports local job report
     -> do not mutate business truth
     -> complete + commit
```

```rust
// WorkReconciliationService::run_work_reconciliation(RunWorkReconciliationJobInput input)
let truth_cursor = truth_snapshot_repo.load_truth_cursor(scope_project(input.scope_ref)).await?;
let projection_states = projection_repo.list_freshness_states(input.scope_ref, reconciliation_page()).await?;
let outbox_gaps = outbox_repo.list_pending(reconciliation_page()).await?;
let reference_gaps = reference_repo.list_stale_references(reconciliation_page()).await?;
let report = ReconciliationReport::from_gaps(input.scope_ref, truth_cursor, projection_states, outbox_gaps, reference_gaps);
```

| 项 | 口径 |
|---|---|
| DTO -> Job | `scope_ref` 决定读取范围 |
| 事务边界 | 可写 report marker + idempotency complete 同一 UoW;truth / projection read 不写 |
| 错误映射 | invalid scope -> `InvalidRequest`;repo failure -> failed report |
| 状态 / 事件 | 不修改业务 truth;可写 reconciliation report / marker |
| 测试切口 | clean report;projection gap;outbox gap;reference gap;no truth mutation |

#### 12.6 `PrepareWorkTraceHandoffFlow`

```text
[jobs.run_prepare_work_trace_handoff]
  -> WorkTraceHandoffService.prepare_work_trace_handoff(input)
     -> reserve job idempotency in UoW
     -> AuditRepository.list_trace_records(subject_ref, bounded page)
     -> WorkTraceRecord.prepare_handoff(target_ref)
     -> TraceHandoffPort.prepare_trace_handoff(intent)
     -> write handoff marker / optional WorkTraceAvailable outbox
     -> complete + commit
```

```rust
// WorkTraceHandoffService::prepare_work_trace_handoff(PrepareWorkTraceHandoffJobInput input)
let records = audit_repo.list_trace_records(input.subject_ref, handoff_page()).await?;
for record in records.items {
    let intent = record.prepare_handoff(input.target_ref)?;
    let handoff_ref = trace_handoff.prepare_trace_handoff(intent).await?;
    let marker = TraceHandoffMarker::from_trace(record.trace_id, handoff_ref)?;
    audit_repo.save_trace_handoff_marker(marker, &uow).await?;
}
```

| 项 | 口径 |
|---|---|
| DTO -> Job | `subject_ref` selects trace records;`target_ref` selects handoff target |
| 事务边界 | handoff marker、optional outbox、idempotency complete 同一 UoW;external handoff port failure records failed ref |
| 错误映射 | no trace records -> report zero/empty;handoff failure -> failed refs;invalid target -> `InvalidRequest` |
| 状态 / 事件 | trace handoff marker;optional enqueue `WorkTraceAvailable` |
| 测试切口 | handoff success;empty trace;port failure;duplicate job |

#### 12.7 `PrepareArchiveHandoffFlow`

```text
[jobs.run_prepare_archive_handoff]
  -> WorkArchiveHandoffService.prepare_archive_handoff(input)
     -> reserve job idempotency in UoW
     -> load scoped Work truth summaries and audit refs
     -> build ArchiveHandoffIntent
     -> ArchiveHandoffPort.prepare_archive_handoff(intent)
     -> save archive handoff marker / optional WorkTraceAvailable outbox
     -> complete + commit
```

```rust
// WorkArchiveHandoffService::prepare_archive_handoff(PrepareArchiveHandoffJobInput input)
let summaries = load_archive_scope_summaries(input.archive_scope).await?;
let intent = ArchiveHandoffIntent::from_work_summaries(summaries, input.archive_target_ref)?;
let archive_ref = archive_handoff.prepare_archive_handoff(intent).await?;
let marker = ArchiveHandoffMarker::from_archive_ref(input.archive_scope, archive_ref)?;
audit_repo.save_archive_handoff_marker(marker, &uow).await?;
```

| 项 | 口径 |
|---|---|
| DTO -> Job | `archive_scope` selects Work summaries;`archive_target_ref` selects destination |
| 事务边界 | handoff marker、optional outbox、idempotency complete 同一 UoW |
| 错误映射 | invalid scope -> `InvalidRequest`;archive port failure -> failed report;repo failure -> rollback |
| 状态 / 事件 | archive handoff marker;不写 archive long-term body |
| 测试切口 | archive marker;empty scope;port failure;no body stored |

### 13. 错误映射与回滚矩阵

| 场景 | 发生位置 | Command | Query | Inbound Event | Outbound Publish | Job |
|---|---|---|---|---|---|---|
| envelope / metadata 缺失 | handler / runner | `InvalidRequest` | `InvalidRequest` | `DeadLetter` | 不适用 | `InvalidRequest` |
| idempotency key 缺失 | handler / runner | `InvalidRequest` | 不适用 | `DeadLetter` / reject | 不适用 | `InvalidRequest` |
| idempotency duplicate | service | 通过 `CommandResultRepository.get_result` 返回既有 result | 不适用 | ack duplicate | skip publish duplicate marker | 通过 `JobResultRepository.get_report` 返回既有 report |
| idempotency conflict | service | rollback + `IdempotencyConflict` | 不适用 | dead-letter / conflict marker | 不适用 | rollback + reject |
| repository none | service | `NotFound` | `Missing` surface | unresolved / failed marker | mark failed if payload source missing | failed report |
| domain reject | domain method / policy | rollback + `DomainRejected` | 不适用 | unresolved / dead-letter by consumer policy | mark failed | failed report |
| version conflict | repository save | rollback + `VersionConflict` | 不适用 | retry / dead-letter by policy | mark failed | failed report |
| resolver / port unresolved | resolver | rollback + `ExternalReferenceUnresolved` | degraded / missing surface | save unresolved / retry | mark failed | failed refs |
| publisher failure | publisher | 不适用 | 不适用 | 不适用 | mark outbox failed | report failed item |
| handoff failure | handoff port | 不适用 | 不适用 | 不适用 | 不适用 | failed refs / report failed |

### 14. 状态与事件副作用闭环

| Flow family | Truth state | Reference / projection state | Audit / outbox | 不允许 |
|---|---|---|---|---|
| Project / backlog commands | Project / Backlog state | affected project views stale | trace + `ProjectChanged` 或 truth-change outbox | 不改 owner truth |
| Member commands | ProjectMember state | member snapshot / member views stale | trace + `ProjectMemberChanged` | 不改 identity truth |
| WorkItem commands | WorkItem / ChildWorkItem state | board/search/member views stale | trace + `WorkItemChanged` | 不保存 source/evidence body |
| Promote commands | PromoteResult state,optional WorkItem | source reference state read only | trace + `PromoteResultRecorded`,optional work event | event consumer 直接 accept promote |
| Dependency / blocker commands | Dependency / Blocker state + history | relation views stale | trace + dependency/blocker event | 生成 governance decision |
| Iteration commands | Iteration / Commitment / work committed state | iteration/member views stale | trace + `IterationChanged` | 改 process truth |
| Query | none | none | none | rebuild projection |
| Inbound Event | none except local snapshot / pending marker | reference state + stale | optional trace,usually no public outbox | 创建 Work truth |
| Outbound Publish | outbox publication only | none | publish marker | 回滚已提交 truth |
| Jobs | projection/reference/handoff/report only | job-specific | optional derived / trace outbox | 修复 business truth |

### 15. DTO / Domain / Port 闭环检查

| 检查项 | 结论 | 依据 |
|---|---|---|
| Command DTO 字段能构造 domain object | 是 | Step 8 §8.15 + 本文件 §8;缺失 id 均由 Step 7 `IdGeneratorPort` 生成并显式传入 Step 6 factory |
| Query response 字段有 truth/projection 来源 | 是 | Step 8 §9 + 本文件 §9;query no-write |
| Inbound event 字段能构造 snapshot/reference state | 是 | Step 8 §10.2 + Step 6 `ExternalReferenceRef::from_*` + 本文件 §10 |
| Outbound event payload 来源闭合 | 是 | Step 8 §10.4 + 本文件 §11;payload 来自 committed truth / derived state / trace |
| Job input 能定位 write/read scope | 是 | Step 8 §11.2 + 本文件 §12 |
| 事务边界可落码 | 是 | Step 7 UoW + 本文件 §6 / §8 / §10 / §12 |
| 错误映射可落码 | 是 | Step 8 §12 + 本文件 §13 |

### 16. 回填草稿

后续 Step 19 整理正式 `03-详细设计.md` 时,本 Step 内容应回填到:

- §5.8 逐接口函数级处理流:
  - Command flow:本文件 §8
  - Query flow:本文件 §9
  - Inbound / Outbound Event flow:本文件 §10 / §11
  - Operations Job flow:本文件 §12
- §7 API / Command / Query / Event / Job 协议契约:
  - 每个协议追加“处理流入口 / service / domain / repository / side effect”索引。
- §8 持久化、事务与一致性:
  - command / event / job UoW 模板、outbox publish 独立事务、query no-write。
- §10 测试切口:
  - 按本文件每个小节“测试切口”生成 TC-WORK-* 最小验证清单。

### 17. 进入下一步条件

```text
每个 Command / Query / Inbound Event / Outbound Event / Operations Job 均已有入口函数、调用图、关键伪代码、DTO 到 domain 构造步骤、事务边界、错误映射、状态与事件副作用和测试切口。
```

本 Step 已满足进入 Step 10 的文档条件。按当前执行纪律,完成本 Step 后暂停,等待审核,不直接进入 Step 10。
