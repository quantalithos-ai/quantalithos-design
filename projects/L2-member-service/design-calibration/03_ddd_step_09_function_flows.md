# Step 9：函数级处理流

> 状态：completed / pass_with_upstream_blockers
> 目标文档：`projects/L2-member-service/03-详细设计.md`
> 校准日期：2026-09-02
> 参考粒度：`projects/L1-governance/design-calibration/03_ddd_step_09_function_flows.md`

## 1. 本步目标与边界

本步把 Step 8 的每一个 Command、Query、Inbound Consumer、Outbound Event 和 Operations Job 展开为可落码的函数级处理流。每条 flow 都说明入口、application service、domain method、Port、UoW、状态与副作用；同构路径可以共享纪律，但不能把不同接口合并为无法实现的泛化流程。

本步不定义状态全集、错误码全集、DDL、配置 key 或实施 commit；这些由 Step 10~17 收口。所有上游 exact contract 继续 `pending / blocked / waiting / placeholder`。

## 2. 输入与 SOP 问题回答

| 输入 | 用途 |
|---|---|
| `03_ddd_step_06_object_contracts.md` | factory、member method、状态和 invariant |
| `03_ddd_step_07_trait_port_adapter_contracts.md` | 可调用的 application Port、读写面和返回错误 |
| `03_ddd_step_08_protocol_contracts.md` | 每个协议的 DTO、metadata、结果和 receipt |
| `02_hld_step_08_processing_flows.md` | 业务顺序、local-first、query no-write 和 handoff 边界 |

| SOP 问题 | 结论 |
|---|---|
| 每个接口是否有独立 flow？ | 是；下表 8 个 public command、2 个 internal command、6 个 query、5 个 consumer、7 个 job 和 1 个 outbox append helper 均有独立卡。 |
| UoW 从哪里开始？ | 所有会写 local truth/record/marker 的 flow 在 application service 中 `begin`；Query 不开写事务。 |
| accepted path 的相对顺序？ | reserve -> load with version -> domain transition -> save truth -> allocate cursor -> history/material/outbox/projection marker -> stored result -> complete idempotency -> commit。 |
| duplicate 如何处理？ | reserve 返回 duplicate 后 rollback 当前事务，读取 stored result/receipt/report，原样回放，不重复 mutation。 |
| external call 何时发生？ | attempt、cleanup 或 outbox record 已经 local commit 后由 Job/adapter 发生；同步 Command 不宣称 external success。 |
| 查询是否修复？ | 否；stale/degraded/unavailable 原样返回，不能 refresh projection、reference 或 session。 |

## 3. 共享函数模板

### 3.1 accepted local write template

```text
Entry.validate(dto)
  -> ApplicationContextFactory.from_validated_metadata(dto.metadata)
  -> UoWManager.begin()
  -> IdempotencyRepository.reserve(context, digest, uow)
       Duplicate -> rollback; StoredResultRepository.get; replay
       Conflict  -> save rejection; commit; return Conflict
  -> Repository.get_*_with_version(...)
  -> DomainObject::factory / object.method(typed input)
  -> Repository.save_*(value, expected_revision, uow)
  -> assign_truth_change_cursor()       // only accepted truth mutation
  -> append HostHistoryEntry / HostFactMaterial when applicable
  -> OutboxRecord::from_material_snapshot (if public propagation applies)
  -> ProjectionRepository.list_affected + mark_stale (if read model affected)
  -> StoredResultRepository.save(result, uow)
  -> IdempotencyRepository.complete(reservation, result_ref, uow)
  -> UoWManager.commit(uow)
  -> return accepted result
```

任何 domain guard、expected revision、required qualification、cursor、redaction 或 upstream availability 失败，都必须在相应层返回 `Rejected`、`Conflict`、`Blocked`、`Unknown` 或 `Unavailable`，不得伪造 accepted truth。

### 3.2 consumer template

```text
EnvelopeValidator.validate_version_and_identity(envelope)
  Unsupported -> body-free receipt, no payload parse
  -> UoWManager.begin()
  -> reserve(message/idempotency)
       Duplicate -> rollback + replay stored receipt
  -> FeedbackMapper.map(safe payload)
  -> save matching snapshot / attempt / handoff marker
  -> assign_committed_change_cursor() when only reference/marker facts change
  -> mark affected projection stale
  -> save consumer receipt + complete idempotency
  -> commit
```

Consumer 不能创建 intent、decision、generation、recovery、closure 或新的 effect key；late/unknown 只写 matching history/gap。

## 4. Command flows

### 4.1 `AcceptHostIntentCommand`

```text
ApiCommandEntry.handle(AcceptHostIntentCommand)
  -> HostCommandMapper.map_metadata_and_subject()
  -> HostApplicationService.accept_intent(context, input)
  -> HostControlRepository.get_current_decision(subject)
  -> HostIntent::accept(dual_anchor, source, action, scope, key)
  -> HostControlRepository.save_intent(intent, None, uow)
  -> HostHistoryRepository.append(intent.acceptance_entry)
  -> HostMaterialService.materialize_intent(intent)
  -> projection stale + stored command result
  -> commit
```

负向：subject/scope/source 缺失 `Rejected`；同 key 同输入 `Duplicate`；同 key 异输入 `Conflict`；不触发 host/generation/action。

### 4.2 `DecideHostOrchestrationCommand`

```text
HostApplicationService.decide_orchestration(context, input)
  -> get_intent_with_version + get_current_host
  -> HostControlPolicy.permits_decision(intent, current, input)
  -> HostOrchestrationDecision::propose(...)
  -> decision.commit_if_allowed()
  -> save_decision(expected_revision)
  -> append history/material/outbox/stale/result
  -> commit
```

旧 current 或 expected revision 不匹配返回 `Conflict/Superseded`；decision committed 只作为后续 qualification/generation/closure 输入。

### 4.3 `ResolveHostQualificationCommand`

```text
HostApplicationService.resolve_qualification(context, input)
  -> load committed decision and target generation
  -> GlobalMemberQualificationPort.resolve()
  -> ProjectMemberQualificationPort.resolve()
  -> PinnedImageSupplyPortPlaceholder.resolve()
  -> LaunchCredentialQualificationPortPlaceholder.qualify()
  -> SandboxHostBindingPortPlaceholder.bind-capability()  // qualification only
  -> HostCarrierCapabilityPort.inspect()
  -> RequiredQualificationPolicy.evaluate(all typed results)
  -> HostQualificationContext::record(...)
  -> save qualification + history/material/stale/result
  -> commit
```

缺项、stale、conflict、unknown 或上游 placeholder 均保留对应 gap；不得使用缓存、默认值或 host fallback 形成 `Ready`。

### 4.4 `CoordinateHostAssemblyCommand`

```text
HostApplicationService.coordinate_assembly(context, input)
  -> get qualification with version
  -> HostAssembly::freeze_required_items(input.required_set)
  -> for each item: HostAssembly.record_item_outcome(safe outcome/gap)
  -> HostReadinessDecision::evaluate(policy, assembly, current facts)
  -> save assembly + readiness (if evaluated) in same UoW
  -> history/material/stale/stored result
  -> commit
```

`Complete` assembly 只能表示 required item 记录完毕；`Ready` 必须由独立 readiness decision 且所有 required source positive、fresh、same generation。

### 4.5 `EstablishHostGenerationCommand`（internal）

```text
HostApplicationService.establish_generation(inherited_context, input)
  -> get committed orchestration/recovery decision
  -> get current host + generation with version
  -> HostGenerationFence.guard_new_generation(...)
  -> MemberExecutionHost::establish(new_host_id, next_generation, predecessor)
  -> save host/current pointer with expected revision
  -> append history/material/stale (no external call)
  -> commit
```

竞争建立返回 `Conflict/Held`；逻辑 host 建立不等于 container、Member process、Runtime session 或 Sandbox resource 建立。

### 4.6 `PrepareHostActionCommand`（internal）

```text
HostApplicationService.prepare_action(inherited_context, input)
  -> load decision, host and generation
  -> HostGenerationFence.guard_action_target(...)
  -> ExternalEffectKeyFactory.from_committed_context()
  -> HostActionAttempt::prepare(decision_ref, host_ref, generation, target, key)
  -> HostProgressionRepository.save_attempt(attempt, None, uow)
  -> append history/material/stale/result
  -> commit
```

`Prepared` 之后才能进入 dispatch Job；不得在此函数调用 carrier、Runtime、Sandbox 或 registry。

### 4.7 `AcceptHostRegistrationCommandPlaceholder`

```text
HostApplicationService.accept_registration(context, input)
  -> load host/generation and qualification facts
  -> MemberRegistrationPortPlaceholder.read_registration()
  -> LaunchCredentialQualificationPortPlaceholder.qualify()
  -> RegistrationSessionPolicy.guard(input, source, dual_anchor, generation)
  -> HostRegistration::accept_or_block(...)
  -> HostSessionRepository.save_registration(...)
  -> history/material/stale/result -> commit
```

Member request body、credential secret 和 endpoint raw body 不入本地对象。`MSVC-UP-002/006` 未闭合时 positive path 为 blocked/waiting。

### 4.8 `MaintainHostSessionCommandPlaceholder`

```text
HostApplicationService.maintain_session(context, input)
  -> get accepted registration + current endpoint/session
  -> RuntimeHostSessionPortPlaceholder.associate()  // only when formal contract exists
  -> HostEndpoint::activate_or_invalidate(safe_endpoint)
  -> HostSession::associate_or_hold(runtime_safe_ref)
  -> save endpoint/session with expected revisions
  -> history/material/stale/result -> commit
```

Runtime association返回 blocked/unknown 时只保存本地 shell disposition；不生成 Runtime run、turn、checkpoint 或 outcome。

### 4.9 `DecideHostRecoveryCommand`

```text
HostApplicationService.decide_recovery(context, input)
  -> get current host/generation
  -> get assessment/failure with version
  -> FormalRecoveryContextPort.load(input.control_source)
  -> HostRecoveryDecision::propose(action, prerequisites, scope)
  -> decision.commit_if_allowed()
  -> save recovery decision + history/material/stale/result
  -> commit
```

`Recover`/`Restart`/`Stop`/`Terminate` 仅形成 host-side decision；Runtime entry 或 closure execution 由后续受限 seam 承接。缺 formal control source 时 `Blocked`。

### 4.10 `CloseHostCommand`

```text
HostApplicationService.close_host(context, input)
  -> get host/generation + current registration/session/association
  -> HostClosure::open(scope, causality)
  -> local invalidation of registration/endpoint/session/association
  -> CleanupAttempt::prepare(stable_effect_key, cleanup_target)
  -> save closure + cleanup attempts in one UoW
  -> history/material/stale/stored result -> commit
```

此流只完成 local invalidation 与 cleanup attempt；Sandbox/carrier cleanup 的 external result 由 Job/Consumer 记录。

## 5. Query flows

所有 Query 采用 `HostQueryService`：验证 actor/visibility -> 读取 source 或 projection -> redaction-aware mapper -> 返回 `Visible/NotVisible/Degraded/Unavailable`。以下各查询独立列出读取面。

| Query | 函数级读取顺序 | 禁止动作 |
|---|---|---|
| `QueryCurrentHostDecision` | visibility -> control repo current decision -> host current pointer -> `SafeHostView` mapper | 不创建 decision、刷新 source |
| `QueryHostAssemblyReadiness` | visibility -> qualification/assembly/readiness repo -> per-axis mapper -> freshness marker | 不调用 resolver、不重评估 |
| `QueryHostAccessSession` | visibility -> registration/endpoint/session repo -> redact endpoint/session -> safe view | 不接受注册、不建立 Runtime association |
| `QueryHostHealthFailure` | visibility -> signal/assessment/failure/recovery repo -> four-axis mapper | 不评估、不 recovery |
| `QuerySafeHostFacts` | visibility -> projection/material reader -> projection state -> safe view/page | 不 rebuild、mark fresh 或回写 source |
| `QueryHostHistory` | visibility -> history repo list_by_subject(page) -> safe history mapper | 不追加 history、不推断 current |

Query 读取异常映射为 `Unavailable/Degraded`；不得把 repository empty 当作对象不存在以外的业务状态，也不得用 timeout 推导 healthy。

## 6. Inbound consumer flows

### 6.1 `QualificationSourceChangedConsumerPlaceholder`

验证 event identity/version -> map safe source snapshot -> save qualification source marker -> assign committed marker cursor -> mark affected views stale -> save receipt。不得写 HostIntent/Decision/Readiness。

### 6.2 `HostActionOutcomeConsumerPlaceholder`

验证 effect key/attempt/generation -> `find_attempt_by_effect_key` -> `HostActionAttempt.record_safe_outcome` -> association matching -> 保存 late/duplicate/unknown classification -> marker cursor/stale/receipt。新 key、旧 generation 或 source mismatch 不覆盖 current。

### 6.3 `HostHealthSignalConsumerPlaceholder`

验证 source/message/order/freshness -> `HealthSignalSnapshot::capture` -> append signal -> mark assessment due -> receipt。signal accepted 不等于 healthy，不直接创建 recovery。

### 6.4 `HostCleanupFeedbackConsumerPlaceholder`

验证 cleanup effect key/target/generation -> matching cleanup attempt -> record safe release outcome -> open/update residual finding/case when mismatch -> marker cursor/stale/receipt。timeout/ack 不等于 cleanup complete。

### 6.5 `HostHandoffFeedbackConsumerPlaceholder`

验证 handoff key/material ref/target -> update exactly one feedback layer (`submitted`/`delivered`/`observed`/`accepted`) -> save handoff marker/receipt。不得从一个层推导其余层。

## 7. Outbound material and job flows

### 7.1 `HostFactMaterialEventCandidate` append helper

在 accepted truth UoW 内：加载 committed local change -> `HostFactMaterial::from_change`（body-free）-> `HostOutboxRecord::from_material_snapshot` -> append history/material/outbox -> projection stale。publisher 不在此函数执行。

### 7.2 `DispatchPendingHostActionsJob`

job envelope validate -> reserve job key -> list prepared attempts -> 对每 item 建短 UoW -> call `HostCarrierLifecyclePort.dispatch` 或 placeholder -> record dispatched/failed/unknown with same effect key -> save job report -> commit item。不可重新创建 decision/generation。

### 7.3 `EvaluateDueHostHealthJob`

select accepted snapshots/current facts -> read basis -> `HostHealthAssessment::evaluate` -> optional `HostFailureClassification::classify` -> save assessment/failure + marker/history -> report。不得创建 recovery decision。

### 7.4 `ProgressPendingHostCleanupJob`

select prepared cleanup attempts -> release Port（若 exact contract available）-> record result/unknown/gap -> update closure local status -> report。未知结果保留原 key，进入 reconciliation。

### 7.5 `ReconcileHostResidualsJob`

select open finding/case -> compare local facts with safe external summary -> append finding/case disposition -> report。不得删除资源、修改 sibling truth 或发起隐式 action。

### 7.6 `PublishHostFactOutboxJob`

select outbox pending with stored payload -> call publication Port -> save submitted/unknown/gap marker and handoff record -> report。不得回查 current truth 组包。

### 7.7 `RebuildSafeHostProjectionJob`

select committed source cursor and stale projection -> read committed material/history -> rebuild `HostProjectionState`/safe view -> save projection state -> report。Query 不调用此 job；rebuild 不反写 source。

### 7.8 `ReconcileHostHandoffGapsJob`

select handoff unknown/gap -> match same `HandoffKey` and target -> create waiting feedback link or bounded retry marker -> report。不可换 key 盲重放、不可声明 accepted。

## 8. 跨 flow 事务、状态和副作用审计

| 事项 | 统一规则 |
|---|---|
| actor / scope | 每个 command/consumer/job 明确传入并保留；internal flow 继承原语境 |
| version | mutation 前从 `Versioned<T>` 读取；expected mismatch 返回 conflict |
| cursor | truth mutation 使用 `HostChangeCursor`；reference/material marker 使用 `CommittedChangeCursor`；exact type pending |
| history | accepted local fact append；rejected/duplicate 不伪造 accepted history |
| outbox | 只从 committed material snapshot 构造；publisher 只读 stored payload |
| projection | 只 mark stale/rebuild derived state；不反写 source |
| idempotency | command/consumer/job 先 reserve；duplicate 回放 stored surface |
| external outcome | adapter/feedback 只更新 matching attempt/handoff layer；不推导 ready/healthy/closed |

## 9. 回填草稿、blocker 与 Gate

正式 03 §8 仅装配共享模板、按 CMP 的 flow 索引和每类流程的副作用边界；本文件是函数级调用顺序真相源。

| 检查项 | 结果 |
|---|---|
| 每个 Command/Query/Consumer/Job 独立覆盖 | pass |
| DTO -> application -> domain -> Port -> result 闭环 | pass_with_upstream_blockers |
| UoW/幂等/history/material/outbox/projection 顺序 | pass_with_upstream_blockers |
| Query no-write、Job no-authorization、Consumer safe write ceiling | pass |
| late/duplicate/unknown/blocked 负向流 | pass_with_upstream_blockers |
| `MSVC-UP-001~008` | pending / blocked / fail-closed |
| 正式 03 写入 | forbidden until Step 19 |

```text
step_09_status = completed
step_09_gate = pass_with_upstream_blockers
next_allowed_step = Step 10 state_machine
formal_03_write_allowed = false_until_step_19
```
