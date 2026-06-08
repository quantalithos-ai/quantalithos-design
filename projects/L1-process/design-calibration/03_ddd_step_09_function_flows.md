# Step 9. 逐接口定义函数级处理流

### 1. Step 状态

- 状态:[x] 已确认
- 对应 SOP:`standards/document/详细设计讨论流程_SOP.md` Step 9
- 回填章节:`03-详细设计.md` §8 逐接口函数级处理流

### 2. 本步输入

- 上一步中间产物:
  - `projects/L1-process/design-calibration/03_ddd_step_06_object_contracts.md`
  - `projects/L1-process/design-calibration/03_ddd_step_07_trait_port_adapter_contracts.md`
  - `projects/L1-process/design-calibration/03_ddd_step_08_protocol_contracts.md`
- 上游正式文档:
  - `projects/L1-process/02-概要设计.md` §8 / §10 / §12
- 规范输入:
  - `standards/document/详细设计书写规范.md` §5.8
  - `standards/document/设计真相源闭环与可落码性标准.md`

### 3. SOP 问题回答

1. 哪些协议必须拥有函数级处理流?

   回答:Step 8 中列出的 13 个 Command、11 个 Query、7 个 inbound consumer、7 个 operations job 必须拥有函数级处理流。Outbound event 不作为外部调用入口单独执行业务流,但必须在 `PublishProcessOutboxFlow` 中定义 event envelope 构造和 dispatch 规则。

2. 每个处理流的入口函数是什么?

   回答:Command 入口为 `api::*CommandHandler` 调用 application service 的 `handle_*` 函数。Query 入口为 `ProcessQueryHandler` 调用 `AuthorizedProcessQueryService`。Consumer 入口为 `ProcessInboundConsumer.consume_*`。Job 入口为 `jobs` runner 的 `run_*` 函数。具体入口见处理流总表。

3. 入口函数调用哪些 application service、domain method、repository 和 outbox?

   回答:每个独立流小节列出 application service、domain object / policy、repository 和 outbox / trace 副作用。写路径统一经过 `UnitOfWork`、`IdempotencyRepository`、truth repository、trace repository、outbox repository 和 `OperationResultRepository`。

4. 入口 DTO 在哪一步被校验、派生、转换或用于构造 Domain 对象?

   回答:Command 在 `validate_command_context`、`reserve_command` 后加载 / 解析依赖,再调用 domain factory / method。Query 在 visibility 校验后构造 view DTO。Consumer 先验证 envelope / dedup / source actor,再解析 typed payload。Job 先验证 metadata / scope / idempotency,再执行 scan / mutate / report。

5. 如果构造目标对象所需字段缺失,处理流在哪个函数返回错误或进入恢复路径?

   回答:DTO 必填字段缺失在 handler validation 返回 `ProcessApiError::InvalidRequest` 或 `ConsumerDisposition::Quarantined`。repository missing 返回 `ProcessApiError::NotFound` 或 query `Missing` surface。外部 source unavailable 返回 `ResolverError::SourceUnavailable`,consumer / job 进入 delayed / partial path。

6. 事务在哪里开始,在哪里提交,哪些错误触发回滚?

   回答:Command、consumer、job 写路径在 application service 内 `UnitOfWork.begin()` 后开始事务,保存所有 truth / trace / outbox / marker / receipt / idempotency result 后 commit。domain error、repository conflict、resolver reject、publisher / handoff unrecoverable error 在提交前触发 rollback。Query 不打开 write transaction。

7. 哪些状态会被修改,哪些事件会被写入?

   回答:Command 可修改 Step 6 truth state 并写 `ProcessTruthChange`、trace、outbox。Consumer 修改 snapshot / reference / stale marker。Job 修改 outbox publication state、projection state、reference state、reconciliation report、handoff state 或 recovery maintenance state。Outbound event 由 `ProcessOutboxRecord.event_kind` 映射生成。

8. 每个处理流至少需要哪些测试切口?

   回答:每个 Command 至少覆盖 success、duplicate、idempotency conflict、domain reject、repository conflict。每个 Query 覆盖 available、missing、not visible、degraded。每个 Consumer 覆盖 accepted、duplicate、quarantine、delayed、noop。每个 Job 覆盖 completed、duplicate、partial failure、invalid input。

### 4. 当前文档问题诊断

| 位置 | 当前问题 | 本步处理 |
|---|---|---|
| Step 8 | DTO 和协议字段已闭合,但尚未说明调用链 | 本 Step 定义 handler -> service -> repository -> domain -> trace/outbox 的调用顺序 |
| Step 7 | trait 已定义,但未绑定到具体处理流 | 本 Step 把每个流绑定到 port trait |
| Step 6 | domain method 已定义,但未说明由哪个 DTO 触发 | 本 Step 明确 DTO 到 domain method 调用点 |
| Outbound event | 事件 schema 已定义,但 event build / publish 还未串入 job | 本 Step 在 outbox publish flow 中闭合 |

### 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| Command | DTO / result schema | 可落码调用链、事务、幂等和副作用 | 支撑 service 实现 |
| Query | request / view schema | read path、visibility、degraded surface | 支撑 query handler |
| Consumer | envelope / payload / receipt schema | intake validation、dedup、snapshot / marker 写入 | 支撑 worker |
| Job | input / receipt schema | scan、mutate、report、partial failure | 支撑 jobs runner |

### 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| A. 每个接口完整复制事务和幂等伪代码 | 单小节完全自足 | 大量重复,容易漂移 | 不采用 |
| B. 共享模板 + 每个接口独立差异步骤 | 减少重复且保留独立可落码信息 | 需要先阅读共享模板 | 采用 |
| C. Consumer 直接调用 command service | 复用 command 逻辑 | 违反 consumer 不推进核心 truth 的边界 | 不采用 |
| D. Consumer 只写 snapshot / marker service | 边界清楚 | 需要后续 command 显式承接 | 采用 |

### 7. 结构化中间产物

#### 7.1 处理流总表

| 处理流 | 对应协议 | 入口函数 | 主要事务 | 状态变化 | 测试切口 |
|---|---|---|---|---|---|
| `SyncRuntimeProcessShapeFlow` | `SyncRuntimeProcessShapeRequest` | `ProcessShapeSyncService.sync_runtime_process_shape` | write tx | `RuntimeProcessShapeState`;snapshot marker;outbox | success / duplicate / source unavailable / digest mismatch |
| `AdoptProcessProfileFlow` | `AdoptProcessProfileRequest` | `ProcessProfileCommandService.adopt_process_profile` | write tx | `ProcessProfileState`;profile change;outbox | success / duplicate / inactive shape / work context mismatch |
| `UpdateProcessProfileTailoringFlow` | `UpdateProcessProfileTailoringRequest` | `ProcessProfileCommandService.update_process_profile_tailoring` | write tx | `ProcessProfileState`;profile change;outbox | success / duplicate / high-risk missing evidence / version conflict |
| `StartProcessInstanceFlow` | `StartProcessInstanceRequest` | `ProcessInstanceCommandService.start_process_instance` | write tx | `ProcessInstanceState`;initial activity/token/gateway;outbox | success / duplicate / inactive profile / shape invalid |
| `AdvanceProcessActivityFlow` | `AdvanceProcessActivityRequest` | `ActivityProgressionService.advance_process_activity` | write tx | `ActivityState`;`TokenState`;`GatewayState`;outbox | success / duplicate / expected position conflict / invalid transition |
| `RecordActivityFeedbackFlow` | `RecordActivityFeedbackRequest` | `ActivityProgressionService.record_activity_feedback` | write tx | `Activity.feedback_ref`;progression record | success / duplicate / feedback mismatch / body rejected |
| `OpenWaitingGateFlow` | `OpenWaitingGateRequest` | `WaitingGateCoordinationService.open_waiting_gate` | write tx | `WaitingGateState`;`ProcessInstanceState`;token waiting;outbox | success / duplicate / invalid instance state / missing requirement |
| `ResumeWaitingGateFlow` | `ResumeWaitingGateRequest` | `WaitingGateCoordinationService.resume_waiting_gate` | write tx | `WaitingGateState`;`ProcessInstanceState`;token active;outbox | success / duplicate / decision mismatch / already terminal |
| `CreateProcessCheckpointFlow` | `CreateProcessCheckpointRequest` | `ProcessRecoveryService.create_process_checkpoint` | write tx | `CheckpointState`;trace/audit | success / duplicate / instance missing / evidence invalid |
| `StartRecoveryAttemptFlow` | `StartRecoveryAttemptRequest` | `ProcessRecoveryService.start_recovery_attempt` | write tx | `RecoveryAttemptState`;instance recovering;history | success / duplicate / checkpoint invalid / fork violation |
| `CompleteRecoveryAttemptFlow` | `CompleteRecoveryAttemptRequest` | `ProcessRecoveryService.complete_recovery_attempt` | write tx | `RecoveryAttemptState`;history;outbox | success / duplicate / outcome mismatch / terminal attempt |
| `BindProcessTimeboxFlow` | `BindProcessTimeboxRequest` | `ProcessRhythmService.bind_process_timebox` | write tx | `TimeboxBindingState`;outbox | success / duplicate / work context unavailable / external timebox unresolved / invalid binding |
| `UpdateProcessStageStateFlow` | `UpdateProcessStageStateRequest` | `ProcessRhythmService.update_process_stage_state` | write tx | `StageState`;outbox | success / duplicate / illegal stage target / version conflict |
| `GetRuntimeProcessShapeFlow` | `GetRuntimeProcessShapeRequest` | `AuthorizedProcessQueryService.get_runtime_process_shape` | read only | none | available / missing / not visible / stale snapshot |
| `GetProcessProfileFlow` | `GetProcessProfileRequest` | `AuthorizedProcessQueryService.get_process_profile` | read only | none | available / missing / not visible / degraded |
| `GetProcessInstanceFlow` | `GetProcessInstanceRequest` | `AuthorizedProcessQueryService.get_process_instance` | read only | none | available / missing / not visible |
| `GetActivityStatusFlow` | `GetActivityStatusRequest` | `AuthorizedProcessQueryService.get_activity_status` | read only | none | available / missing / feedback degraded |
| `GetWaitingGateFlow` | `GetWaitingGateRequest` | `AuthorizedProcessQueryService.get_waiting_gate` | read only | none | available / missing / decision degraded |
| `GetRecoveryStatusFlow` | `GetRecoveryStatusRequest` | `AuthorizedProcessQueryService.get_recovery_status` | read only | none | available empty / missing / not visible |
| `GetProcessTimelineFlow` | `GetProcessTimelineRequest` | `AuthorizedProcessQueryService.get_process_timeline` | read only | none | page / empty / filtered / gap degraded |
| `GetProcessProgressSummaryFlow` | `GetProcessProgressSummaryRequest` | `AuthorizedProcessQueryService.get_process_progress_summary` | read only | none | available / stale / rebuilding / disabled |
| `SearchProcessInstancesFlow` | `SearchProcessInstancesRequest` | `AuthorizedProcessQueryService.search_process_instances` | read only | none | result page / empty / stale / disabled |
| `GetProcessTraceFlow` | `GetProcessTraceRequest` | `AuthorizedProcessQueryService.get_process_trace` | read only | none | page / filtered / missing |
| `GetReconciliationReportFlow` | `GetReconciliationReportRequest` | `AuthorizedProcessQueryService.get_reconciliation_report` | read only | none | clean / has issues / missing |
| `ConsumeMethodDefinitionChangedFlow` | `InboundEventEnvelope<MethodDefinitionChangedEvent>` | `ProcessConsumerService.consume_method_definition_changed` | write tx | snapshot / reference / stale marker | accepted / duplicate / quarantine / delayed |
| `ConsumeWorkContextChangedFlow` | `InboundEventEnvelope<WorkContextChangedEvent>` | `ProcessConsumerService.consume_work_context_changed` | write tx | work snapshot / timing stale marker | accepted / duplicate / noop / delayed |
| `ConsumeIdentityActorCapabilityChangedFlow` | `InboundEventEnvelope<IdentityActorCapabilityChangedEvent>` | `ProcessConsumerService.consume_identity_actor_capability_changed` | write tx | actor capability snapshot | accepted / duplicate / quarantine / unavailable |
| `ConsumeGovernanceDecisionChangedFlow` | `InboundEventEnvelope<GovernanceDecisionChangedEvent>` | `ProcessConsumerService.consume_governance_decision_changed` | write tx | decision marker / gate stale marker | accepted / duplicate / noop / decision mismatch |
| `ConsumeArtifactEvidenceChangedFlow` | `InboundEventEnvelope<ArtifactEvidenceChangedEvent>` | `ProcessConsumerService.consume_artifact_evidence_changed` | write tx | evidence marker / checkpoint stale marker | accepted / duplicate / quarantine / delayed |
| `ConsumeRuntimeActivityFeedbackFlow` | `InboundEventEnvelope<RuntimeActivityFeedbackEvent>` | `ProcessConsumerService.consume_runtime_activity_feedback` | write tx | runtime feedback marker / activity stale marker | accepted / duplicate / no direct complete / body rejected |
| `ConsumeConversationContextChangedFlow` | `InboundEventEnvelope<ConversationContextChangedEvent>` | `ProcessConsumerService.consume_conversation_context_changed` | write tx | conversation context marker / timeline stale | accepted / duplicate / noop / source unavailable |
| `PublishProcessOutboxFlow` | `PublishProcessOutboxJob` | `ProcessOutboxService.publish_pending` | write tx per record | `OutboxPublicationState`;publication receipt | published / retry / failed / duplicate job |
| `RebuildProcessProjectionsFlow` | `RebuildProcessProjectionsJob` | `ProcessProjectionService.rebuild` | write tx | projections / `DerivedProcessViewState` | completed / stale source / failed projection |
| `RefreshExternalContextSnapshotsFlow` | `RefreshExternalContextSnapshotsJob` | `ProcessReferenceRefreshService.refresh` | write tx | snapshots / `ReferenceResolutionState` | completed / unavailable / partial |
| `RunProcessReconciliationFlow` | `RunProcessReconciliationJob` | `ProcessReconciliationService.run` | write tx | `ReconciliationReport` | clean / issues / failed |
| `PrepareProcessTraceHandoffFlow` | `PrepareProcessTraceHandoffJob` | `ProcessTraceService.prepare_trace_handoff` | write tx | `TraceHandoffRecord` state | delivered / retryable failed / permanent failed |
| `PrepareProcessArchiveHandoffFlow` | `PrepareProcessArchiveHandoffJob` | `ProcessTraceService.prepare_archive_handoff` | write tx | archive handoff marker | delivered / partial / body not stored |
| `MaintainRecoveryAttemptsFlow` | `MaintainRecoveryAttemptsJob` | `ProcessRecoveryMaintenanceService.maintain` | write tx per attempt | `RecoveryAttemptState`;history;outbox | abandoned / failed / skipped / partial |

#### 7.2 通用 Command 写路径模板

```text
[API Command Handler]
  | call validate_command_request(Request)
  v
[Application Command Service]
  | tx begin
  | call IdempotencyRepository.reserve_command(...)
  | duplicate -> OperationResultRepository.get_result(...)
  | conflict -> rollback + ProcessApiError::IdempotencyConflict
  v
[Load / Resolve Dependencies]
  | call repositories.get(...)
  | call resolver.resolve_*(...) when needed
  v
[Domain Object + Policy]
  | call Policy.assert_*(...)
  | call DomainObject.factory_or_transition(...)
  v
[Trace + Outbox + Result]
  | append ProcessTraceRecord
  | append ProcessOutboxRecord when truth change requires publication
  | save StoredProcessOperationResult::Command(...)
  | complete idempotency
  | tx commit
```

```rust
// [UnitOfWork.begin()]
let mut uow = self.unit_of_work.begin().await?;

// [IdempotencyRepository.reserve_command(ProcessCommandKind, IdempotencyKey, RequestDigest, CommandMetadata, &mut dyn UnitOfWorkHandle)]
match self.idempotency.reserve_command(command_kind, key, digest, metadata.clone(), uow.as_mut()).await? {
    IdempotencyReservation::Duplicate(result_ref) => {
        // [OperationResultRepository.get_result(ApplicationResultRef)]
        return self.operation_results.get_result(result_ref).await?.ok_or(ProcessApiError::IdempotencyResultMissing(result_ref));
    }
    IdempotencyReservation::Conflict(conflict_ref) => {
        uow.rollback().await?;
        return Err(ProcessApiError::IdempotencyConflict(conflict_ref));
    }
    IdempotencyReservation::Reserved(reservation_ref) => reservation_ref,
};
```

Command transaction rules:

- Validate `CommandMetadata.expected_version` against the Step 8 command matrix before computing digest or reserving idempotency.
- Do not reserve idempotency outside the same write transaction.
- Save truth, trace, outbox, operation result, and idempotency completion before commit.
- If operation result save fails, rollback the whole command.
- Duplicate replay must not call domain methods.

#### 7.3 通用 Query 读路径模板

```text
[API Query Handler]
  | call validate_query_request(Request)
  v
[AuthorizedProcessQueryService]
  | call ReadVisibilityPolicy.evaluate_read_visibility(...)
  | hidden -> ProcessQueryResponse { status: NotVisible, visibility_marker }
  v
[Repository / Projection]
  | call truth repository or ProjectionRepository
  | missing -> status: Missing
  | stale/failed/rebuilding -> status: Degraded/Unavailable + marker
  v
[View Mapper]
  | map contracts view DTO
```

Query rules:

- Query does not call `UnitOfWork.begin`.
- Query does not call external resolver.
- Query does not repair projection or snapshot.
- Missing subject is a query surface,not a domain transition.

#### 7.4 通用 Consumer 写路径模板

```text
[Worker Consumer]
  | call validate_envelope(InboundEventEnvelope<T>)
  | invalid envelope -> ConsumerReceipt { Quarantined }
  v
[ProcessConsumerService]
  | tx begin
  | call IdempotencyRepository.reserve_event(...)
  | duplicate -> OperationResultRepository.get_result(...) and return stored ConsumerReceipt
  v
[Source Resolver / Snapshot Repository]
  | call resolver.resolve_*(...)
  | source unavailable -> delayed receipt
  | forbidden body / digest mismatch -> quarantine
  v
[Marker Write]
  | upsert snapshot/reference state
  | mark affected projection/truth stale when allowed
  | save StoredProcessOperationResult::Consumer(receipt)
  | complete event idempotency
  | tx commit
```

Consumer rules:

- `InboundEventEnvelope.metadata.source_actor_ref` is a trusted source actor only inside this consumer flow.
- Consumer must not call command service to advance instance, complete activity, or resume waiting gate.
- Consumer accepted path may write snapshot / reference / stale / pending marker. It may write a trace record only when Step 6 / Step 8 define a formal `ProcessTraceSubjectRef` and `ProcessTraceRecord` source for that consumer;otherwise `ConsumerReceipt.trace_record_ref` must be `None`.

#### 7.5 通用 Job 写路径模板

```text
[Job Runner]
  | call validate_job(Job)
  v
[Application Job Service]
  | tx begin for job receipt / per item mutation
  | call IdempotencyRepository.reserve_job(...)
  | duplicate -> OperationResultRepository.get_result(...) and return previous JobRunReceipt
  v
[Scan / Execute]
  | call repository.list_*(scope, page)
  | call publisher/resolver/handoff port when required
  | save state/report
  | save StoredProcessOperationResult::Job(receipt)
  | tx commit
```

Job rules:

- Jobs use `JobMetadata.job_idempotency_key`.
- Job may run per-item transactions for outbox publish and handoff delivery,so one item failure does not require rolling back all prior successes.
- Job returns `JobRunReceipt` with counts and optional report;duplicate replay must read the stored receipt and must not recompute counters from current repositories.

#### 7.6 Command 流明细

##### 7.6.1 `SyncRuntimeProcessShapeFlow`

入口:`ProcessShapeCommandHandler.sync_runtime_process_shape(SyncRuntimeProcessShapeRequest)`.

```text
[ProcessShapeCommandHandler]
  | call sync_runtime_process_shape(request)
  v
[ProcessShapeSyncService]
  | tx begin + reserve command
  | call MethodDefinitionResolverPort.resolve_definition(...)
  | call ProcessShapeRepository.find_by_definition_version(...)
  v
[ShapeDefinitionPolicy + RuntimeProcessShape]
  | call ShapeDefinitionPolicy.assert_can_index(MethodDefinitionSnapshot)
  | call RuntimeProcessShape::from_definition(RuntimeProcessShapeId, MethodDefinitionSnapshot, ActorRef)
  | or call RuntimeProcessShape.activate(&MethodDefinitionSnapshot, ActorRef)
  v
[Repositories]
  | save shape
  | upsert method snapshot
  | append trace + outbox RuntimeShapeChanged
  | save operation result + complete idempotency
```

Key calls:

```rust
// [MethodDefinitionResolverPort.resolve_definition(MethodDefinitionRef, MethodDefinitionVersionRef, Option<SourceDigest>)]
let snapshot = self.method_resolver.resolve_definition(req.definition_ref, req.definition_version_ref, req.source_digest).await?;

// [RuntimeProcessShape::from_definition(RuntimeProcessShapeId, MethodDefinitionSnapshot, ActorRef)]
let shape = RuntimeProcessShape::from_definition(shape_id, snapshot.clone(), req.actor_context.actor_ref)?;
```

Errors:

- resolver `SourceUnavailable` -> rollback + `ProcessApiError::TemporarilyUnavailable`.
- resolver `DigestMismatch` / `BodyNotAllowed` -> rollback + `ProcessApiError::DomainRejected`.
- existing shape version conflict -> rollback + conflict error.

Tests:success create;success refresh;duplicate replay;source unavailable;digest mismatch;no method body persisted.

##### 7.6.2 `AdoptProcessProfileFlow`

入口:`ProcessProfileCommandHandler.adopt_process_profile(AdoptProcessProfileRequest)`.

Steps:

1. Reserve command idempotency.
2. Load `RuntimeProcessShape` by `shape_ref`;reject missing / invalid / retired.
3. Resolve or load `WorkContextSnapshot` for `work_context_ref`.
4. `ProfileTailoringPolicy.assert_can_adopt(shape, project_ref)`.
5. `ProcessProfile::propose(profile_id, project_ref, shape_ref, actor)`.
6. `ProcessProfile.activate(&shape, actor)` creates `ProfileChangeRecord`.
7. Save profile, append change record, append audit / trace, append outbox `ProfileChanged`.
8. Store `ProcessProfileCommandResult` and complete idempotency.

Tests:success;duplicate;shape retired rejected;work context not visible;result store failure rollback.

##### 7.6.3 `UpdateProcessProfileTailoringFlow`

入口:`ProcessProfileCommandHandler.update_process_profile_tailoring(UpdateProcessProfileTailoringRequest)`.

Steps:

1. Reserve command idempotency.
2. Load `ProcessProfile` with `expected_version`.
3. If `next_shape_ref` exists,load `RuntimeProcessShape`.
4. `ProfileTailoringPolicy.assert_high_risk_change_has_evidence(ProfileChangeContext)`.
5. Call `ProcessProfile.switch_to(...)`, `suspend(...)`, or `retire(...)` according to `tailoring_change_ref` and reason.
6. Save profile using loaded `StorageVersion`.
7. Append `ProfileChangeRecord`, audit, trace, outbox `ProfileChanged`.
8. Save `ProcessProfileCommandResult`.

Tests:success switch;duplicate;high-risk no evidence;stale version conflict;retired profile reject.

##### 7.6.4 `StartProcessInstanceFlow`

入口:`ProcessInstanceCommandHandler.start_process_instance(StartProcessInstanceRequest)`.

Steps:

1. Reserve command idempotency.
2. Load active `ProcessProfile`;load `WorkContextSnapshot`.
3. Load `ProcessStartBootstrapSummary` through `ProcessShapeRepository.get_start_bootstrap_summary(profile.shape_ref, start_intent_ref.start_node_ref)`.
4. Validate `start_intent_ref` against Step 6 §7.2.2 / §7.3: `start_reason` must be non-empty;summary must exist;`summary.start_node_ref == start_intent_ref.start_node_ref`;`summary.shape_ref == profile.shape_ref`;`initial_gateway_ref` must equal `summary.initial_gateway.gateway_ref` only when `summary.requires_gateway_tracking = true`,and must be absent when `summary.requires_gateway_tracking = false`.
5. `InstanceProgressionPolicy.assert_can_start(profile, project_ref)`.
6. Generate `ProcessInstanceId`、`ProcessTokenSetRef`、initial `ActivityId` / `TokenId`;if gateway tracking is required,also generate `GatewayId` through `IdGeneratorPort::new_gateway_id()`.
7. Create initial `Activity::from_shape_node(activity_id, process_instance_id, summary.start_node_ref, summary.activity_kind)` and `Token::start_at(token_id, process_instance_id, summary.start_node_ref)`.
8. Create initial `Gateway::from_shape_node(gateway_id, summary.initial_gateway.shape_node_ref, summary.initial_gateway.gateway_kind)` only when `summary.requires_gateway_tracking = true`;the caller `initial_gateway_ref` is only matched against the body-free shape summary and is not the generated `GatewayId`.
9. `ProcessInstance::create(...)` then `ProcessInstance.start(&profile, initial_activity.ref(), actor)`.
10. Save instance, activity, token / gateway initial state, trace, outbox `InstanceChanged`;do not append `ActivityProgressionRecord` during instance bootstrap.
11. Store `ProcessInstanceCommandResult`.

Tests:success;duplicate;profile suspended;work context mismatch;missing start node;activity kind from summary;missing required gateway;gateway supplied when not required;gateway mismatch.

##### 7.6.5 `AdvanceProcessActivityFlow`

入口:`ActivityCommandHandler.advance_process_activity(AdvanceProcessActivityRequest)`.

Steps:

1. Reserve command idempotency.
2. Load `ProcessInstance`、`Activity`、active token / gateway by subject refs.
3. Validate `progression_ref` against Step 6 §7.2.3:activity transition variant must contain its required reason / summary ref,flow-control variant must contain all required token / gateway / route / target refs.
4. Compare `expected_position_ref` with loaded token current position when `progression_ref.flow_control` references a token;conflict if mismatch.
5. `InstanceProgressionPolicy.assert_can_advance(...)`.
6. Generate one `ActivityProgressionId` via `IdGeneratorPort::new_activity_progression_id()`;the generated id must be passed into the activity transition that returns `ActivityTransitionOutcome`,domain must not generate it.
7. Apply `progression_ref.activity_transition` exactly as Step 6 §7.2.3 maps it:
   - `Ready` -> `Activity.ready(progression_id, actor)`.
   - `Start` -> `Activity.start(progression_id, actor)`.
   - `Complete { reason, feedback_summary_ref }` -> if activity has feedback / is waiting feedback,load matching `RuntimeFeedbackSummary` by `feedback_summary_ref`,run `ActivityFeedbackPolicy.assert_feedback_can_complete(...)` and `assert_no_runtime_body(...)`,then `Activity.complete(progression_id, reason, actor)`.
   - `Skip { reason }` -> `Activity.skip(progression_id, reason, actor)`.
   - `Fail { reason }` -> `Activity.fail(progression_id, reason, actor)`.
8. Apply `progression_ref.flow_control` exactly as Step 6 §7.2.3 maps it:
   - `None` -> no token / gateway save.
   - `MoveToken` -> load token and call `Token.move_to(next_position_ref)`.
   - `ConsumeToken` -> load token and call `Token.consume()`.
   - `TerminateToken` -> load token and call `Token.terminate(reason)`.
   - `SelectGatewayRoute` -> load body-free `GatewayRouteSet` via `ProcessShapeRepository::get_gateway_route_set(gateway_ref)`,run `GatewayRoutingPolicy.assert_route_allowed(...)`,call `Gateway.select_route(route_ref, decision_reason, actor)`,then `Token.move_to(next_position_ref)`.
   - `JoinGateway` -> build `TokenSet` from loaded tokens and owning instance `token_set_ref`,run `GatewayRoutingPolicy.assert_can_join(...)`,then `Gateway.join_tokens(token_set)`;loaded gateway must be `PendingJoin` for pure join gateway or `RouteSelected` for decision gateway after route selection.
9. Call `ProcessInstance.advance(activity.ref(), actor)` only to update the instance current activity pointer;it returns `()` and must not construct `ActivityProgressionRecord`.
10. Save changed objects and append `ActivityProgressionRecord` by calling `ActivityProgressionRecord::from_activity_transition(activity_outcome, changed_token_refs, changed_gateway)` after flow-control truth has been changed;record `token_refs` / `gateway_ref` / `selected_route_ref` from changed truth,where single-token variants put one ref,`JoinGateway` copies all joined token refs,and route selection copies committed `Gateway.selected_route_ref`.
11. Append trace and outbox `ActivityProgressed`.
12. Store `ActivityProgressionCommandResult`,copying `selected_route_ref` from the same `ActivityProgressionRecord`;duplicate replay returns the stored result surface.

Tests:success;expected position conflict;invalid activity state;gateway invalid route;duplicate replay.

##### 7.6.6 `RecordActivityFeedbackFlow`

入口:`ActivityCommandHandler.record_activity_feedback(RecordActivityFeedbackRequest)`.

Steps:

1. Reserve command idempotency.
2. Load `Activity`.
3. Resolve `RuntimeFeedbackResolution` through `RuntimeFeedbackResolverPort.resolve_feedback(request.runtime_feedback_ref, request.activity_ref, None)`.
4. Assert `resolution.feedback_summary.feedback_summary_ref == request.feedback_summary_ref`.
5. `ActivityFeedbackPolicy.assert_feedback_matches_activity(activity, resolution.runtime_feedback_ref)`.
6. `ActivityFeedbackPolicy.assert_no_runtime_body(resolution.feedback_summary)`.
7. Plain feedback binding must not complete activity; explicit completion paths consume the stored body-free summary before `Activity.complete(...)`.
8. Generate `ActivityProgressionId` via `IdGeneratorPort::new_activity_progression_id()` and call `Activity.attach_feedback(progression_id, resolution.runtime_feedback_ref)` to obtain `ActivityTransitionOutcome`.
9. Save activity, append progression record from the outcome with empty `token_refs` and no gateway, then append trace.
10. Outbox only when policy says feedback binding is a publishable `ActivityProgressed` truth.
11. Store `ActivityProgressionCommandResult`.

Tests:success;feedback mismatch;runtime body rejected;duplicate;unresolved feedback.

##### 7.6.7 `OpenWaitingGateFlow`

入口:`WaitingGateCommandHandler.open_waiting_gate(OpenWaitingGateRequest)`.

Steps:

1. Reserve command idempotency.
2. Load `ProcessInstance` and `Activity`.
3. Generate `PauseContextId` via `IdGeneratorPort::new_pause_context_id()` and create `PauseContext::from_activity(pause_context_id, ...)`.
4. `WaitingGatePolicy.assert_can_open(activity, pause_context)`.
5. Generate `WaitingGateId` via `IdGeneratorPort::new_waiting_gate_id()` and create `WaitingGate::open_for_activity(waiting_gate_id, ...)`.
6. Generate `WaitingGateChangeId` via `IdGeneratorPort::new_waiting_gate_change_id()` and call `ProcessInstance.pause_for_gate(change_id, &gate, actor)`.
7. Move current token to waiting state via `Token.wait_at(...)`.
8. Save pause context、gate、instance、token;append waiting change record、trace、outbox `WaitingGateChanged`.
9. Store `WaitingGateCommandResult`.

Tests:success;instance terminal;activity mismatch;duplicate;missing resume requirement.

##### 7.6.8 `ResumeWaitingGateFlow`

入口:`WaitingGateCommandHandler.resume_waiting_gate(ResumeWaitingGateRequest)`.

Steps:

1. Reserve command idempotency.
2. Load `WaitingGate` by `waiting_gate_ref`;load `PauseContext` via `WaitingGateRepository.get_pause_context(gate.pause_context_ref)`;load `ProcessInstance` and waiting token.
3. Resolve / validate `GovernanceDecisionRef`.
4. `WaitingGatePolicy.assert_decision_matches(gate, decision_ref)` and `assert_can_resume(gate)`.
5. Generate `WaitingGateChangeId` for decision attachment and call `WaitingGate.attach_decision(change_id, decision_ref, actor)` if not already attached.
6. Generate `WaitingGateChangeId` for resume and call `WaitingGate.resume(change_id, resume_reason, actor)`.
7. Generate `WaitingGateChangeId` for instance resume and call `ProcessInstance.resume_from_gate(change_id, &gate, actor)`;then `Token.resume_at(...)`.
8. Save all changed objects;append change record、trace、outbox `WaitingGateChanged`.
9. Store `WaitingGateCommandResult`.

Tests:success;decision mismatch;gate already resumed;missing pause context;token missing;duplicate.

Resume command missing pause context is not a degraded read model case. If `get_pause_context(gate.pause_context_ref)` returns `None`,map to command reject / invariant failure and do not resume gate,instance,or token;do not append success trace / outbox / result. Query degraded handling is limited to `GetWaitingGateFlow`.

##### 7.6.9 `CreateProcessCheckpointFlow`

入口:`RecoveryCommandHandler.create_process_checkpoint(CreateProcessCheckpointRequest)`.

Steps:

1. Reserve command idempotency.
2. Load `ProcessInstance`;validate optional `ActivityRef`.
3. Validate `CheckpointEvidenceRef` through artifact evidence marker when available.
4. Generate `ProcessCheckpointId` and `RecoveryHistoryId` via `IdGeneratorPort`.
5. `ProcessCheckpoint::capture(checkpoint_id, &instance, activity_ref, evidence_ref)`.
6. Supersede previous available checkpoint when policy requires;each superseded checkpoint history uses its own `RecoveryHistoryId`.
7. Save checkpoint;append `RecoveryHistoryRecord` with `CheckpointCaptured` and optional `CheckpointSuperseded`;append trace / audit.
8. Store `ProcessCheckpointCommandResult`.

Tests:success;duplicate;instance missing;activity not in instance;evidence invalid.

##### 7.6.10 `StartRecoveryAttemptFlow`

入口:`RecoveryCommandHandler.start_recovery_attempt(StartRecoveryAttemptRequest)`.

Steps:

1. Reserve command idempotency.
2. Load `ProcessCheckpoint` and owning `ProcessInstance`.
3. `RecoveryContinuityPolicy.assert_checkpoint_matches_instance(...)`.
4. Generate `RecoveryAttemptId` and two `RecoveryHistoryId` values via `IdGeneratorPort`.
5. `RecoveryAttempt::start(recovery_attempt_id, process_instance_id, checkpoint_ref, actor)`.
6. Build primary `RecoveryHistoryRecord` with `AttemptStarted`,then call `ProcessInstance.mark_recovering(second_history_id, &checkpoint, &attempt, actor)`.
7. Save attempt and instance;append both history records、trace、outbox `RecoveryAttemptChanged`.
8. Store `RecoveryAttemptCommandResult`.

Tests:success;checkpoint expired;fork violation;duplicate;instance terminal.

##### 7.6.11 `CompleteRecoveryAttemptFlow`

入口:`RecoveryCommandHandler.complete_recovery_attempt(CompleteRecoveryAttemptRequest)`.

Steps:

1. Reserve command idempotency.
2. Load `RecoveryAttempt` and owning `ProcessInstance`.
3. Validate outcome reason fields:
   - `Applied` requires `failure_reason = None` and `abandon_reason = None`.
   - `Failed` requires `failure_reason = Some(...)` and `abandon_reason = None`.
   - `Abandoned` requires `abandon_reason = Some(...)` and `failure_reason = None`.
4. Generate one `RecoveryHistoryId` per history record appended in this flow.
5. Match `RecoveryOutcome`:
   - `Applied` -> `RecoveryAttempt.mark_applied(history_id, actor)` and `ProcessInstance.complete_recovery(second_history_id, &attempt, actor)`.
   - `Failed` -> `RecoveryAttempt.mark_failed(history_id, failure_reason)`.
   - `Abandoned` -> `RecoveryAttempt.abandon(history_id, abandon_reason, actor)`.
6. Save attempt and instance when changed.
7. Append recovery history、trace、outbox `RecoveryAttemptChanged`.
8. Store `RecoveryAttemptCommandResult`.

Tests:applied;failed;abandoned;missing failure reason;missing abandon reason;conflicting reason fields;terminal attempt duplicate.

##### 7.6.12 `BindProcessTimeboxFlow`

入口:`RhythmCommandHandler.bind_process_timebox(BindProcessTimeboxRequest)`.

Steps:

1. Reserve command idempotency.
2. Resolve / load `WorkContextSnapshot` by calling `WorkContextResolverPort.resolve_work_context(input.work_context_ref, source_version_ref)`.
3. Generate `binding_id = IdGeneratorPort.new_process_timebox_binding_id()`.
4. Create candidate `ProcessTimeboxBinding::bind(binding_id, input.process_subject_ref, input.process_timebox_ref, input.external_timebox_ref, actor)`.
5. `ProcessRhythmPolicy.assert_timebox_binding_allowed(binding, snapshot)`, including `input.external_timebox_ref` visibility / membership in the resolved work context.
6. Build `ProcessTimingRef { process_subject_ref: input.process_subject_ref, stage_ref: None, timebox_binding_ref: Some(binding_ref) }`.
7. Save binding;append trace;append outbox `TimingChanged(timing_ref)`.
8. Store `ProcessTimingCommandResult`.

Tests:success;work context unavailable;external timebox unavailable;external timebox not in resolved work context;invalid binding;duplicate;no Work truth mutation.

##### 7.6.13 `UpdateProcessStageStateFlow`

入口:`RhythmCommandHandler.update_process_stage_state(UpdateProcessStageStateRequest)`.

Steps:

1. Reserve command idempotency.
2. Load `ProcessStageState`.
3. Validate `input.stage_target` and `input.stage_change_reason` use the same variant;any mismatch -> `InvalidRequest`.
4. `ProcessRhythmPolicy.assert_stage_transition_allowed(stage, input.stage_target, input.stage_change_reason)`.
5. Apply the unique mapped domain method:
   - `Activate` + `StageChangeReason::Activate(reason)` -> `ProcessStageState.activate(actor)`;`reason` is kept in policy / trace context.
   - `Pause` + `StageChangeReason::Pause(reason)` -> `ProcessStageState.pause(reason, actor)`.
   - `Complete` + `StageChangeReason::Complete(reason)` -> `ProcessStageState.complete(reason, actor)`.
   - `Skip` + `StageChangeReason::Skip(reason)` -> `ProcessStageState.skip(reason, actor)`.
6. Build `ProcessTimingRef { process_subject_ref: ProcessTimingSubjectRef::ProcessInstance(ProcessInstanceRef { value: stage.process_instance_id.value }), stage_ref: Some(input.stage_ref), timebox_binding_ref: None }`.
7. Save stage;append trace;append outbox `TimingChanged(timing_ref)`.
8. Store `ProcessTimingCommandResult`.

Tests:activate;pause;complete;skip;illegal transition;duplicate.

#### 7.7 Query 流明细

##### 7.7.1 truth object query flows

适用:`GetRuntimeProcessShapeFlow`、`GetProcessProfileFlow`、`GetProcessInstanceFlow`.

```text
[ProcessQueryHandler]
  | call get_*(request)
  v
[AuthorizedProcessQueryService]
  | call ReadVisibilityPolicy.evaluate_read_visibility(ProcessReadSubjectRef, ProcessConsumerRef, ActorContext)
  | hidden -> ProcessQueryResponse { status: NotVisible, visibility_marker }
  | call repository.get(subject_ref)
  | missing -> ProcessQueryResponse { status: Missing }
  v
[View Mapper]
  | map truth object + marker into contracts view DTO
```

Pseudo:

```rust
// [ReadVisibilityPolicy.evaluate_read_visibility(ProcessReadSubjectRef, ProcessConsumerRef, ActorContext)]
let visibility = self.read_policy.evaluate_read_visibility(
    subject_ref.clone(),
    consumer_ref.clone(),
    req.actor_context.clone(),
)?;
if visibility.visibility_decision == VisibilityDecision::Hidden {
    return Ok(ProcessQueryResponse::not_visible(
        subject_ref,
        visibility.visibility_marker.required(),
    ));
}

// [ProcessInstanceRepository.get(ProcessInstanceRef)]
let Some(versioned) = self.instances.get(req.process_instance_ref).await? else {
    return Ok(ProcessQueryResponse::missing(subject_ref));
};
```

Errors and surfaces:

- visibility hidden -> `ProcessViewStatus::NotVisible` with `ProcessVisibilityMarker` from `ProcessReadVisibilityDecision`.
- visibility filtered -> include visible body / items and `ProcessVisibilityMarker`;if filtering produces an empty page,return `ProcessViewStatus::NotVisible`.
- repository missing -> `ProcessViewStatus::Missing`.
- source snapshot stale -> `ProcessViewStatus::Degraded`.

Tests:available;missing;not visible;degraded marker.

##### 7.7.2 status query flows

适用:`GetActivityStatusFlow`、`GetWaitingGateFlow`、`GetRecoveryStatusFlow`.

Steps:

1. Validate actor and query metadata.
2. Call `ReadVisibilityPolicy.evaluate_read_visibility(...)`;hidden returns `NotVisible` with marker before returning any body.
3. Load primary truth object.
4. Load secondary context:
   - activity status loads feedback reference state.
   - waiting gate loads pause context via `WaitingGateRepository.get_pause_context(gate.pause_context_ref)` and decision state.
   - recovery status loads checkpoint / recovery attempt / latest history.
5. Map to Step 8 view DTO.
6. If secondary context is missing or stale,return `Degraded` with marker.

Tests:activity feedback stale;waiting gate missing pause context;recovery empty available;not visible.

##### 7.7.3 page query flows

适用:`GetProcessTimelineFlow`、`SearchProcessInstancesFlow`、`GetProcessTraceFlow`.

Steps:

1. Convert `ProcessPageRequest` to Step 7 `PageRequest`.
2. Validate page limit.
3. Call `ReadVisibilityPolicy.evaluate_read_visibility(...)` before repository read when subject known;hidden returns `NotVisible` with marker.
4. Call `TraceRepository.list_trace_records` or `ProjectionRepository.search_instances`.
5. Apply item-level filtering after repository read when required;filtered pages include `ProcessVisibilityMarker`,and filtered-to-empty maps to `NotVisible`.
6. Convert `PageInfo` to `ProcessPageInfo`.
7. Map true empty page to `Available` with `items = []`.
8. Map trace gap / stale projection to `Degraded`.

Tests:empty page;next cursor;filtered page;projection disabled;trace gap degraded.

##### 7.7.4 summary / report query flows

适用:`GetProcessProgressSummaryFlow`、`GetReconciliationReportFlow`.

Steps:

1. Validate actor and query metadata.
2. Load projection or report by repository key.
3. Apply visibility policy.
4. If projection view state is `Fresh`,return `Available`.
5. If `Stale` or `Rebuilding`,return `Degraded`.
6. If `Failed` or `Disabled`,return `Unavailable`.
7. Reconciliation report query returns `Available` for `Clean` / `HasIssues` / `Partial`;missing report returns `Missing`.

Tests:fresh summary;stale summary;disabled summary;clean report;report missing.

#### 7.8 Inbound Consumer 流明细

##### 7.8.1 common consumer envelope flow

```rust
// [validate_inbound_envelope(InboundEventEnvelope<T>)]
let metadata = validate_inbound_envelope(&envelope)?;

// [UnitOfWork.begin()]
let mut uow = self.unit_of_work.begin().await?;

// [IdempotencyRepository.reserve_event(ProcessInboundEventKind, EventDedupKey, EventDigest, EventMetadata, &mut dyn UnitOfWorkHandle)]
let reservation = self.idempotency.reserve_event(event_kind, metadata.dedup_key, digest, metadata.clone(), uow.as_mut()).await?;
```

Rules:

- Invalid envelope returns `ConsumerReceipt { disposition: Quarantined }` without domain mutation.
- Duplicate returns stored receipt and does not call resolver.
- Resolver `SourceUnavailable` returns `Delayed` receipt and commits delayed marker when configured.
- Resolver `BodyNotAllowed` or digest mismatch returns `Quarantined`.

##### 7.8.2 `ConsumeMethodDefinitionChangedFlow`

Steps:

1. Validate envelope / reserve event.
2. `MethodDefinitionResolverPort.resolve_definition(definition_ref, definition_version_ref, source_digest)`.
3. `ReferenceSnapshotRepository.upsert_method_snapshot(snapshot)`.
4. `ReferenceSnapshotRepository.upsert_reference_state(snapshot.snapshot_state)`.
5. Mark affected `RuntimeProcessShape` / profile derived state stale if source version changed.
6. Save `ConsumerReceipt::Accepted` with `reference_state_ref = Some(snapshot.snapshot_state.to_ref())` and `trace_record_ref = None`,then complete event idempotency.

`ConsumeMethodDefinitionChangedFlow` does not append `ProcessTraceRecord`: the changed object is an external method definition snapshot,not a committed Process truth subject. The accepted receipt, operation result, and consumer observability event are the formal trace surface for this intake.

Tests:accepted;duplicate;unsupported schema quarantine;source unavailable delayed;digest mismatch quarantine.

##### 7.8.3 `ConsumeWorkContextChangedFlow`

Steps:

1. Validate envelope / reserve event.
2. Resolve `WorkContextSnapshot` or build snapshot from payload summary fields.
3. Upsert work snapshot and reference state.
4. When payload `external_timebox_ref` is present,call `RhythmRepository.find_bindings_by_external_timebox(external_timebox_ref, page)`.
5. For each returned `Versioned<ProcessTimeboxBinding>`,call `ProcessTimeboxBinding.mark_stale(ReferenceStaleReason)` and save with the loaded version.
6. For each changed binding,call `ProjectionRepository.list_view_states_affected_by_subject(ProcessTraceSubjectRef::TimeboxBinding(binding_ref), page)`.
7. For each returned view state ref,load via `ProjectionRepository.get_view_state(view_state_ref)`,call `DerivedProcessViewState.mark_stale(ProjectionStaleReason)`,then save via `ProjectionRepository.save_view_state(...)`.
8. If `external_timebox_ref` is absent or both affected binding page and affected view page are empty,return `Noop` after snapshot/reference upsert and idempotency completion.

Tests:accepted with binding stale;duplicate;noop;source unavailable;no Work truth mutation.

##### 7.8.4 `ConsumeIdentityActorCapabilityChangedFlow`

Steps:

1. Validate envelope / reserve event.
2. `ActorCapabilityResolverPort.resolve_actor_capability(actor_ref, source_version_ref)`.
3. Upsert `ActorCapabilitySnapshot`.
4. Call `ProjectionRepository.list_view_states_affected_by_actor(actor_ref, page)`.
5. For each returned view state ref,load via `ProjectionRepository.get_view_state(view_state_ref)`,call `DerivedProcessViewState.mark_stale(ProjectionStaleReason)`,then save via `ProjectionRepository.save_view_state(...)`.
6. Complete event idempotency.

Tests:accepted;duplicate;missing actor quarantine;source unavailable delayed;capability stale marker.

##### 7.8.5 `ConsumeGovernanceDecisionChangedFlow`

Steps:

1. Validate envelope / reserve event.
2. `GovernanceDecisionResolverPort.resolve_decision(decision_ref, source_digest)`.
3. Upsert `GovernanceDecisionRef` marker / reference state.
4. When payload `resume_requirement_ref` is present,call `WaitingGateRepository.find_open_by_resume_requirement(resume_requirement_ref, page)`.
5. Mark matching gates as decision-resolved marker only if Step 10 state matrix allows;do not call `WaitingGate.resume`.
6. For each matched gate,call `ProjectionRepository.list_view_states_affected_by_subject(ProcessTraceSubjectRef::WaitingGate(waiting_gate_ref), page)`.
7. For each returned view state ref,load via `ProjectionRepository.get_view_state(view_state_ref)`,call `DerivedProcessViewState.mark_stale(ProjectionStaleReason)`,then save via `ProjectionRepository.save_view_state(...)`.
8. If `resume_requirement_ref` is absent or no matching open gate exists,return `Noop` after marker/reference upsert and idempotency completion.

Tests:accepted marker;duplicate;decision mismatch noop;body rejected;does not resume gate.

##### 7.8.6 `ConsumeArtifactEvidenceChangedFlow`

Steps:

1. Validate envelope / reserve event.
2. `ArtifactEvidenceResolverPort.resolve_evidence(evidence_ref, source_digest)`.
3. Upsert evidence marker and reference state.
4. When `checkpoint_ref` is present,call `ProjectionRepository.list_view_states_affected_by_subject(ProcessTraceSubjectRef::Checkpoint(checkpoint_ref), page)`.
5. For each returned view state ref,load via `ProjectionRepository.get_view_state(view_state_ref)`,call `DerivedProcessViewState.mark_stale(ProjectionStaleReason)`,then save via `ProjectionRepository.save_view_state(...)`.
6. Complete event idempotency.

Tests:accepted;duplicate;digest mismatch quarantine;checkpoint stale marker;no artifact body persisted.

##### 7.8.7 `ConsumeRuntimeActivityFeedbackFlow`

Steps:

1. Validate envelope / reserve event.
2. `RuntimeFeedbackResolverPort.resolve_feedback(runtime_feedback_ref, activity_ref, source_digest)`.
3. Upsert `RuntimeFeedbackRef` marker and body-free `RuntimeFeedbackSummary` marker.
4. Mark activity pending feedback / stale;do not call `Activity.complete`.
5. Complete event idempotency.

Tests:accepted pending marker;duplicate;feedback mismatch quarantine;source unavailable delayed;activity not completed.

##### 7.8.8 `ConsumeConversationContextChangedFlow`

Steps:

1. Validate envelope / reserve event.
2. `ConversationContextResolverPort.resolve_context(conversation_ref, context_kind, source_version_ref)`.
3. Upsert `ConversationContextRef` marker.
4. Mark affected timeline / trace view stale when `trace_subject_ref` exists.
5. If no affected subject,return `Noop`.

Tests:accepted;duplicate;noop;source unavailable;no conversation body persisted.

#### 7.9 Operations Job 流明细

##### 7.9.1 `PublishProcessOutboxFlow`

```text
[PublishProcessOutboxRunner]
  | call run_publish_process_outbox(job)
  v
[ProcessOutboxService]
  | reserve job idempotency
  | list pending outbox records
  | for each record: tx begin per record
  | build ProcessOutboundEventEnvelope by copying outbox event_kind + truth_ref + trace_context + visibility_marker + payload_snapshot
  | call ProcessOutboxPublisherPort.publish(envelope)
  | mark_published / mark_retry / mark_failed
```

Rules:

- envelope payload must be the `ProcessOutboxRecord.payload_snapshot` captured in the accepted transition transaction.
- publish job must not reload current truth by `truth_ref` to recompute payload, trace context, or visibility marker.
- event kind / truth ref / payload snapshot variant must still match the Step 8 outbox event mapping table; mismatch marks the record failed with invalid mapping.
- publisher failure does not rollback committed process truth.
- each record state save uses its loaded `StorageVersion`.

Tests:publish success;retryable failure;permanent failure;duplicate job;invalid mapping rejected.

##### 7.9.2 `RebuildProcessProjectionsFlow`

Steps:

1. Reserve job idempotency.
2. Load committed truth / trace since `from_cursor_ref`.
3. Build `ProcessReadModel`、`ProcessTimelineView`、`ProcessProgressSummary` according to `projection_kinds`.
4. Save projection objects and `DerivedProcessViewState.mark_fresh(cursor_ref)`.
5. On build error,`DerivedProcessViewState.mark_failed(reason)`.
6. Return `JobRunReceipt` with counts.

Tests:rebuild read model;rebuild timeline;projection failed marker;duplicate job;does not create business truth.

##### 7.9.3 `RefreshExternalContextSnapshotsFlow`

Steps:

1. Reserve job idempotency.
2. Convert `job.page` to application `PageRequest`,then call `ReferenceSnapshotRepository.list_reference_states_for_refresh(job.scope, page)` to list `Page<Versioned<ReferenceResolutionState>>`.
3. Call matching resolver port by `ExternalContextKind`.
4. For each returned state,resolve by `ReferenceResolutionState.reference_ref` and matching `ExternalContextKind`;upsert the body-free snapshot / marker and mark the loaded `ReferenceResolutionState` as `Resolved` in the same UoW,using the returned `StorageVersion` when updating existing state.
5. On source unavailable,mark `Unavailable` or keep stale according to Step 12 error policy,save the updated state with the returned `StorageVersion`,and count partial failure.
6. Return `JobRunReceipt`.

Rules:

- `ExternalContextRefreshScope.context_kinds` is applied by the repository list method;an empty set means all registered external context kinds.
- `ExternalContextRefreshScope.process_instance_ref` is applied through the repository's formal process-instance dependency index for reference states;the flow must not scan process truth or infer references from snapshot maps.
- `ExternalContextRefreshScope.reference_state` filters by `ReferenceResolutionLifecycleState`.
- Pagination order is stable `(ExternalContextKind, ExternalContextRef, ReferenceResolutionStateId)` as defined by Step 7.
- The version returned with each listed state is the only allowed expected-version source for refresh success and failure updates.

Tests:refresh method;refresh work;source unavailable partial;body rejected quarantine-equivalent;duplicate job.

##### 7.9.4 `RunProcessReconciliationFlow`

Steps:

1. Reserve job idempotency.
2. Create `ReconciliationReport::for_scope(report_id, scope_ref)`.
3. Compare truth repository, projection repository, snapshot repository and outbox cursor.
4. `ReconciliationReport.add_issue(issue_ref)` for each mismatch.
5. Save report and return `JobRunReceipt`.
6. Do not repair truth / projection in this job.

Tests:clean;has issues;partial failure;duplicate;no repair.

##### 7.9.5 `PrepareProcessTraceHandoffFlow`

Steps:

1. Reserve job idempotency.
2. If `scope.include_unprepared_traces`,list trace records using `TraceRepository.list_trace_records_for_handoff(scope)`.
3. List existing retryable handoff records using `TraceRepository.list_handoff_refs(scope)` when `scope.handoff_states` is non-empty.
4. For each trace record,generate `TraceHandoffRef` and call `ProcessTraceRecord.prepare_handoff(handoff_ref, target_ref)`.
5. Save prepared `TraceHandoffRecord`.
6. Call `TraceHandoffPort.deliver_trace(handoff_record.handoff_ref, target_ref, metadata)` for prepared or retryable handoff records.
7. On success mark delivered and save receipt marker.
8. On retryable failure mark failed / delayed according to Step 10 / 12.

Tests:delivered;retryable failure;permanent failure;duplicate;no observability body persisted.

##### 7.9.6 `PrepareProcessArchiveHandoffFlow`

Steps:

1. Reserve job idempotency.
2. If `scope.include_unprepared_traces`,list trace records using `TraceRepository.list_trace_records_for_handoff(scope)`.
3. List existing retryable archive handoff records using `TraceRepository.list_handoff_refs(scope)` when `scope.handoff_states` is non-empty.
4. Generate `TraceHandoffRef` and prepare `TraceHandoffRecord` for archive target for each unprepared trace record.
5. Call `ArchiveHandoffPort.deliver_archive(handoff_record.handoff_ref, target_ref, metadata)` for prepared or retryable handoff records.
6. Save `ArchiveHandoffReceipt.archive_package_ref` as reference marker only.
7. Return partial failure if some records fail.

Tests:archive delivered;partial failure;permanent failure;no archive package body;duplicate.

##### 7.9.7 `MaintainRecoveryAttemptsFlow`

Steps:

1. Reserve job idempotency.
2. List pending / failed attempts by `RecoveryMaintenanceScope`.
3. For each attempt,load checkpoint and instance.
4. Apply recovery retry / expiry policy:
   - eligible expired pending attempt -> `RecoveryAttempt.abandon(...)`.
   - failed attempt included and retry policy exhausted -> remain failed or abandon according to Step 10.
5. Append `RecoveryHistoryRecord`.
6. Append outbox `RecoveryAttemptChanged` when state changed.
7. Return `JobRunReceipt`.

Tests:abandon expired;skip fresh pending;partial failure;duplicate;no new process instance.

### 8. 回填草稿

> 校准来源:
> - `design-calibration/03_ddd_step_09_function_flows.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“处理流总表”“通用 Command 写路径模板”“通用 Query 读路径模板”“通用 Consumer 写路径模板”“通用 Job 写路径模板”和逐接口流明细。

## 8. 逐接口函数级处理流

所有 Command 写路径必须在 application service 中开启 `UnitOfWork`,先执行 command idempotency reservation,再加载依赖、调用 policy 和 domain object,最后保存 truth、trace、outbox、operation result 并完成 idempotency。duplicate replay 必须读取 `OperationResultRepository`,不得重放 domain transition。

所有 Query 只读,不得开启 write unit of work,不得刷新外部 snapshot,不得修复 projection。Query response 必须使用 Step 8 的 `ProcessViewStatus`、visibility marker、degraded marker 和 projection marker。

所有 Inbound Consumer 必须先验证 `InboundEventEnvelope<T>`,再执行 event dedup。trusted source actor 只在 consumer 内用于 source isolation 和 marker 写入,不得推进核心 command state。Consumer 只写 snapshot、reference、pending、stale 或 no-op marker。

所有 Operations Job 必须携带 `JobMetadata.job_idempotency_key`。outbox publish / handoff job 可采用 per-item transaction,确保单条失败不回滚已完成条目。Job 不得静默修复 Process truth。

### 9. 待确认事项

| 待确认项 | 当前处理 | 后续 Step |
|---|---|---|
| 每个状态迁移的完整 From/To 合法矩阵 | 本 Step 描述触发函数和副作用 | Step 10 |
| repository 保存顺序和 transaction isolation | 本 Step 描述边界 | Step 11 |
| error variant 到 API / receipt / retry 的完整映射 | 本 Step 描述主要分支 | Step 12 |
| idempotency digest 字段集合和窗口 | 本 Step 描述 reservation / duplicate | Step 13 |

### 10. 进入下一步条件

```text
每个关键接口都已经具备可编码的函数级处理流，并能回指模块、对象、trait、协议契约和 DTO 构造闭环。
Step 10 可以基于这些处理流定义状态机与转换矩阵。
```
