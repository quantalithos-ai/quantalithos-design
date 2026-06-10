# Step 9. 定义逐接口函数级处理流

> 对应 SOP: `standards/document/详细设计讨论流程_SOP.md` Step 9
> 回填章节: `03-详细设计.md` §8 逐接口函数级处理流
> 生成日期: 2026-06-09
> 状态: 已完成

---

### 1. Step 状态

| 项目 | 状态 |
|---|---|
| Step 1 upstream boundary | 已完成 |
| Step 2 scope | 已完成 |
| Step 3 constraints | 已完成 |
| Step 4 file layout | 已完成 |
| Step 5 module contracts | 已完成 |
| Step 6 object contracts | 已完成 |
| Step 7 trait / port / adapter contracts | 已完成 |
| Step 8 protocol contracts | 已完成 |
| Step 9 function flows | 已完成 |

本 Step 只生成 `design-calibration/03_ddd_step_09_function_flows.md` 中间产物,不直接编辑正式 `03-详细设计.md`。正式文档装配必须留到 Step 19。

---

### 2. 本步目标

把 Step 8 已定义的 22 个 Command、14 个 Query、9 个 Inbound Event Consumer、12 个 Outbound Event 和 7 个 Operations Job,逐一收口成可落码的函数级处理流。

本步必须为每条 flow 明确:

- public DTO 如何进入 handler / service。
- idempotency / duplicate replay 在哪里 reserve、读取和完成。
- 哪些 repository / resolver / publisher / handoff port 被调用,且只能使用 Step 7 已定义函数。
- 哪些 Step 6 domain factory / member method / policy guard 被调用。
- UnitOfWork 在哪里 begin / commit / rollback。
- accepted path 保存 truth、history、trace、audit、outbox、projection stale marker、stored result 的顺序。
- rejected / duplicate / delayed / unsupported / partial failure path 的返回 surface。
- 每条 flow 的测试切口。

本步不定义状态转换矩阵、错误码全集、DDL、配置 key、transport route、topic 名称、retry 参数或实施 commit boundary。这些分别由 Step 10~17 继续收口。

---

### 3. 本步输入

| 输入 | 状态 | 用途 |
|---|---|---|
| `02_hld_step_08_processing_flows.md` | 已完成 | 提供 command / query / consumer / job 处理流族和 no-write/no-repair 边界 |
| `03_ddd_step_06_object_contracts.md` | 已完成 | 提供对象字段、factory、transition method、policy guard、state enum 和 record object |
| `03_ddd_step_07_trait_port_adapter_contracts.md` | 已完成 | 提供 repository、projection、reference、outbox、result、resolver、publisher、handoff port 函数 |
| `03_ddd_step_08_protocol_contracts.md` | 已完成 | 提供 request/response/event/job DTO 字段和 route inventory |
| `设计真相源闭环与可落码性标准.md` | 已生效 | 校验 DTO 构造闭环、version 来源、projection identity、outbox snapshot、duplicate replay |
| `详细设计讨论流程_SOP.md` | 已生效 | 要求每个 Command / Query / Consumer / Job 独立 flow、分批停审和跨 flow 审计 |

---

### 4. 分批写入计划

> 分批写入只限制单次写入规模,不限制章节最终详尽程度。若一个 flow 批次超过单批容量,继续拆成多批补全字段、调用顺序、错误分支和停审记录。

| 批次 | Flow 族 | 内容 | 状态 |
|---|---|---|---|
| 9.0 | shared flow discipline | Step 9 框架、flow 总表、全局 transaction / idempotency / side effect 模板 | [x] 已写入 |
| 9.1-a | context / input / gate / decision commands | 6 个 command flow、停审记录 | [x] 已写入 |
| 9.1-b | approval / policy commands | 7 个 command flow、停审记录 | [x] 已写入 |
| 9.1-c | control / compliance / nonconformity commands | 10 个 command flow、停审记录 | [x] 已写入 |
| 9.2-a | simple truth queries | context/input/gate/approval/policy/conflict/compliance query flow | [x] 已写入 |
| 9.2-b | projection / search / trace / dashboard queries | pending decision、coverage、nonconformity、search、trace、dashboard、reconciliation flow | [x] 已写入 |
| 9.3 | inbound consumers | 9 个 consumer flow、unsupported/duplicate/delayed/rejected 口径 | [x] 已写入 |
| 9.4 | outbound event append / publish | accepted command outbox append helper、12 个 outbound payload snapshot、publish job flow | [x] 已写入 |
| 9.5 | maintenance jobs | rebuild、refresh、reconciliation job flow | [x] 已写入 |
| 9.6 | handoff / export jobs | trace handoff、archive handoff、external GRC export flow | [x] 已写入 |
| 9.7 | final audit | per-flow 停审汇总、跨 flow transaction/state/outbox/projection/idempotency 审计 | [x] 已写入 |

---

### 5. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 每个 Command / Query / Event / Job 是否独立讨论? | 是。本 Step 用 flow 名逐项覆盖 Step 8 inventory;同构流程只共享模板,不合并为一个不可落码的泛化流程。 |
| Flow 是否按接口类别或所属模块分批? | 是。Command 按业务模块分三批;Query 分 truth read 与 projection/trace/report read;Consumer、Outbound、Job 独立批次。 |
| 每条 flow 如何回指 Step 6 / 7 / 8? | Flow 表中列出协议 DTO、目标对象 / policy、依赖 port 和副作用;调用图使用 Step 6 函数名和 Step 7 port 函数名。 |
| 事务在哪里开始和提交? | Command accepted path、consumer accepted path、outbox marker update、maintenance job item update、handoff marker save 都由 `GovernanceUnitOfWorkManager.begin()` 开启,在 stored result / receipt / report 完成后 commit。Query 不开启写事务。 |
| Duplicate replay 如何处理? | Command / Consumer / Job 先调用 `GovernanceIdempotencyRepository.reserve(...)`;duplicate 读取 `StoredGovernanceResultRepository` 对应 surface 并返回,不得重跑 mutation。 |
| Outbox payload 何时生成? | Command accepted transaction 内构造 `GovernanceOutboundPayloadBuildInput<T>` 和 stored payload snapshot,再调用 `GovernanceOutboxRecord::from_truth_change(...)` 与 `GovernanceOutboxRepository.append(...)`。Publisher 只读取 stored snapshot。 |
| Projection stale 如何定位? | Command / consumer / refresh path 只能调用 `GovernanceProjectionRepository.list_views_affected_by_truth_change(...)` 或 `list_views_affected_by_references(...)`;不得拼接 ad hoc view ref。 |
| Query denied 如何表达? | `ReadVisibilityPolicy.evaluate_*` 返回 `GovernanceVisibilityMarker`;denied 返回 not-visible body-free surface,不是普通 error。 |
| Job 是否允许修复 truth? | 不允许。Job 只能维护 outbox publication state、projection、reference state、reconciliation report、handoff/export marker。 |
| 每条 flow 的停审项目是什么? | DTO 构造、domain method、port、version 来源、transaction、错误分支、state / history / trace / audit / outbox / projection 副作用、stored result、测试切口。 |

---

### 6. Flow inventory

#### 6.1 Command flow inventory

| Flow | 协议 DTO | 所属模块 | 目标对象 | 主要 port | 状态 / 副作用 | 停审状态 |
|---|---|---|---|---|---|---|
| `CreateGovernanceContextFlow` | `CreateGovernanceContextRequest` | context | `GovernanceContext` | context repo, reference resolver/repo, trace, audit, outbox, projection, result | create context, trace/outbox/stale/result | 待审 |
| `SubmitGovernanceInputFlow` | `SubmitGovernanceInputRequest` | context/input | `GovernanceInput` | context/input repo, trace, audit, outbox, projection, result | receive input, optional accepted path | 待审 |
| `UpdateGovernanceInputStateFlow` | `UpdateGovernanceInputStateRequest` | context/input | `GovernanceInput` | input/context repo, trace, audit, outbox, projection, result | accept/reject/wait/supersede | 待审 |
| `OpenGovernanceGateFlow` | `OpenGovernanceGateRequest` | decision | `Gate`, optional requirement/responsibility | context/gate/requirement/responsibility/chain repo, trace, audit, outbox, projection, result | open gate, optional requirement | 待审 |
| `RecordGovernanceDecisionFlow` | `RecordGovernanceDecisionRequest` | decision | `GovernanceDecision`, `Gate` | gate/decision/chain/shared rule repo, trace/history, outbox, projection, result | propose/finalize/attach decision | 待审 |
| `SupersedeGovernanceDecisionFlow` | `SupersedeGovernanceDecisionRequest` | decision | `GovernanceDecision` | decision/gate/chain/shared rule repo, trace/history, outbox, projection, result | create next, finalize, supersede current | 待审 |
| `AssignApprovalResponsibilityFlow` | `AssignApprovalResponsibilityRequest` | approval | `ApproverRequirement`, `ApprovalResponsibility`, `ResponsibilityChain` | context/responsibility/chain/reference repo, resolver, trace/history, outbox, projection, result | require/assign/append chain | 待审 |
| `RecordApprovalVoteFlow` | `RecordApprovalVoteRequest` | approval | `ApprovalResponsibility`, `ResponsibilityChain` | responsibility/chain repo, trace/history, outbox, projection, result | vote, optional chain satisfied | 待审 |
| `DelegateApprovalResponsibilityFlow` | `DelegateApprovalResponsibilityRequest` | approval | `ApprovalResponsibility` | responsibility/reference repo, resolver, trace/history, outbox, projection, result | delegate responsibility | 待审 |
| `ActivatePolicyEffectiveFactFlow` | `ActivatePolicyEffectiveFactRequest` | policy | `PolicyEffectiveFact`, optional conflict | policy/shared/conflict repo, trace/history, outbox, projection, result | propose/activate/detect conflict | 待审 |
| `UpdatePolicyEffectiveFactStateFlow` | `UpdatePolicyEffectiveFactStateRequest` | policy | `PolicyEffectiveFact` | policy/conflict repo, trace/history, outbox, projection, result | activate/suspend/supersede/retire | 待审 |
| `UpdateSharedRuleSetFlow` | `UpdateSharedRuleSetRequest` | policy | `SharedRuleSet`, optional conflict | shared/policy/conflict repo, trace/history, outbox, projection, result | draft/activate/add/deprecate/retire | 待审 |
| `ResolvePolicyConflictFlow` | `ResolvePolicyConflictRequest` | policy | `PolicyConflictRecord` | conflict/gate/decision repo, trace/history, outbox, projection, result | pending/resolve/waive/invalidate | 待审 |
| `AssessControlApplicabilityFlow` | `AssessControlApplicabilityRequest` | control | `ControlApplicability` | context/control repo, trace/history, outbox, projection, result | assess and mark applicability | 待审 |
| `RecordControlReviewFlow` | `RecordControlReviewRequest` | control | `ControlReview` | control/review/decision repo, trace/history, outbox, projection, result | plan/start/pass/fail/waive/supersede | 待审 |
| `SubmitAIIAConclusionFlow` | `SubmitAIIAConclusionRequest` | compliance | `AIIAConclusion` | context/compliance repo, trace/history, outbox, projection, result | draft/submit review | 待审 |
| `SubmitSoAConclusionFlow` | `SubmitSoAConclusionRequest` | compliance | `SoAConclusion` | context/compliance repo, trace/history, outbox, projection, result | draft/attach coverage/submit review | 待审 |
| `ApproveComplianceConclusionFlow` | `ApproveComplianceConclusionRequest` | compliance | `AIIAConclusion` / `SoAConclusion` | compliance/decision repo, trace/history, outbox, projection, result | approve/reject/revoke | 待审 |
| `RaiseNonconformityFlow` | `RaiseNonconformityRequest` | nonconformity | `NonconformityRecord` | context/nonconformity repo, trace/history, outbox, projection, result | raise nonconformity | 待审 |
| `ConfirmNonconformityCauseFlow` | `ConfirmNonconformityCauseRequest` | nonconformity | `NonconformityRecord` | nonconformity repo, trace/history, outbox, projection, result | confirm cause | 待审 |
| `PlanCorrectiveActionFlow` | `PlanCorrectiveActionRequest` | corrective | `CorrectiveAction`, `NonconformityRecord` | nonconformity/corrective repo, trace/history, outbox, projection, result | plan action, start correction | 待审 |
| `CompleteCorrectiveActionFlow` | `CompleteCorrectiveActionRequest` | corrective | `CorrectiveAction`, optional `NonconformityRecord` | corrective/nonconformity repo, trace/history, outbox, projection, result | start/complete/cancel/fail, optional ready for verification | 待审 |
| `VerifyNonconformityFlow` | `VerifyNonconformityRequest` | nonconformity | `VerificationResult`, `NonconformityRecord` | nonconformity/corrective repo, trace/history, outbox, projection, result | create verification, close when passed | 待审 |

#### 6.2 Query / consumer / job flow inventory

| Flow family | Flow count | 主要 port | 状态 / 副作用 | 停审状态 |
|---|---:|---|---|---|
| truth query flows | 7 | truth repositories, visibility policy, reference/projection state reads | read-only;not-visible/degraded surface | 待审 |
| projection / trace / dashboard query flows | 7 | projection repo, trace repo, report reads, visibility policy | read-only;freshness/degraded/page surface | 待审 |
| inbound consumer flows | 9 | idempotency, reference repo, projection repo, trace, stored result | snapshot/reference/stale/receipt;no core truth | 待审 |
| outbound append/publish flows | 12 event append + 1 publish job | outbox repo, payload snapshot builder, publisher | stored snapshot, publication marker | 待审 |
| maintenance job flows | 3 | projection/reference/reconciliation ports, stored result | projection/reference/report only | 待审 |
| handoff/export job flows | 3 | trace/handoff/archive/export ports, marker/result | package/receipt/marker only | 待审 |

---

### 7. Shared command transaction template

所有 accepted Command flow 必须按下列顺序编排。具体 command 可跳过不适用的 history record,但不得改变 truth、trace、outbox、projection stale 和 stored result 的相对语义。

```text
[API handler]
  | validate GovernanceCommandRequest<T>
  | build GovernanceOperationName + GovernanceRequestDigest
  v
[Application service]
  | tx = GovernanceUnitOfWorkManager.begin()
  | reservation = GovernanceIdempotencyRepository.reserve(operation, key, digest, tx)
  | if Duplicate -> rollback tx, load StoredGovernanceResultRepository.get_command_result(result_ref), return replay
  | if Conflict -> mark_conflict, commit tx, return protocol rejection
  v
[Load and guard]
  | load required truth with *_with_version(...)
  | load required snapshots / shared rules / responsibility chain
  | call Step 6 policy guards
  v
[Domain transition]
  | call Step 6 factory / member methods
  | determine accepted truth event descriptors;subject refs will be mapped from typed truth refs;do not assign source cursor here
  v
[Persist accepted effects]
  | save all changed truth with expected_version
  | subject_ref = GovernanceTruthChangeSubjectMapper.<subject>(changed_truth.to_ref())
  | source_cursor = tx.assign_truth_change_cursor()
  | build GovernanceTruthChange(s) from mapped subject_ref + event descriptor + source_cursor
  | append history record when the object family has one
  | append GovernanceTraceRecord::from_truth_change(...)
  | save / update GovernanceAuditTrail
  | build outbound payload snapshot from committed change
  | append GovernanceOutboxRecord::from_truth_change(...)
  | list_views_affected_by_truth_change(change, page)
  | mark_stale(affected_views, change.source_cursor, tx)
  | save StoredGovernanceOperationResult(CommandResult)
  | complete idempotency with result_ref
  | commit tx
  v
[Response]
  | return GovernanceCommandResponse<T>
```

```rust
// GovernanceUnitOfWorkManager.begin()
// 开启 command accepted path 的唯一写事务。
let uow = unit_of_work.begin().await?;
```

| 步骤 | 必须使用的正式契约 | 禁止事项 |
|---|---|---|
| idempotency reserve | `GovernanceIdempotencyRepository.reserve(...)` | duplicate 不得重跑 domain transition |
| mutation read | `get_*_with_version(...)` / `list_*` 返回 `Versioned<T>` | 不得用 cursor、timestamp 或 hard-coded version 充当 expected_version |
| domain transition | Step 6 object factory/member method/policy guard | 不得在 application 里直接改字段绕过 domain |
| source cursor | `GovernanceUnitOfWork.assign_truth_change_cursor()` after truth save | 不得从 page cursor、optimistic version、timestamp、trace id 或 id generator 推导 `GovernanceTruthChange.source_cursor` |
| trace | `GovernanceTraceRecord::from_truth_change(...)` + `GovernanceTraceRepository.append(...)` | rejected path 不伪造 accepted trace |
| outbox | `GovernanceOutboxRecord::from_truth_change(...)` + stored payload snapshot | publisher 不得回查 current truth 构造 payload |
| projection stale | `list_views_affected_by_truth_change(...)` / `mark_stale(...)` | 不得拼接 ad hoc `DerivedGovernanceViewRef` |
| result | `StoredGovernanceResultRepository.save(...)` + `complete(...)` | accepted command 不得只返回内存 result |

---

### 8. Shared query read template

所有 public Query flow 必须保持 read-only。Query 可以读取 truth、projection、reference state、trace、report 和 view state,但不得刷新 snapshot、修复 projection、append trace、写 audit 或创建 outbox。

```text
[API handler]
  | validate GovernanceQueryRequest<T>
  v
[AuthorizedGovernanceQueryService]
  | map request to GovernanceReadSubjectRef / GovernanceScopeRef
  | load optional ActorCapabilitySnapshot if required by visibility policy
  | visibility = ReadVisibilityPolicy.evaluate_*(...)
  | if !visibility.is_visible -> return GovernanceQueryResponse { body: None, marker }
  v
[Read repository]
  | load truth / projection / trace / report page
  | load DerivedGovernanceViewState when projection freshness is relevant
  v
[Response assembler]
  | attach GovernanceViewSurface
  | attach freshness / degraded / page marker
  | return response
```

| 查询路径 | 允许读取 | 禁止写入 |
|---|---|---|
| single truth view | target truth repo, optional reference state | trace/audit/outbox/projection/reconciliation |
| projection view | projection repo view/state | rebuild/mark fresh/mark stale |
| trace view | trace repo `list_by_subject` | append trace / repair audit trail |
| reconciliation report | report / projection state reads | create new report or fix drift |

---

### 9. Shared inbound consumer template

所有 inbound consumer 必须先处理 envelope、schema version 和 idempotency。Accepted path 只能写 snapshot、reference state、stale marker、receipt 和可选 marker trace,不得创建核心 Governance truth。

```text
[Worker entry]
  | validate GovernanceInboundEventEnvelope<T>
  | if unsupported version -> return UnsupportedVersion receipt without parsing payload
  v
[Consumer service]
  | tx = begin()
  | reservation = reserve(consumer_name, dedup_key, digest, tx)
  | duplicate -> rollback tx, load stored consumer receipt, return replay
  v
[Reference / snapshot update]
  | validate payload body-free boundary
  | save_*_snapshot or save_reference_state(...)
  | affected = list_views_affected_by_references(...)
  | mark_stale(affected, cursor, tx)
  | append GovernanceTraceRecord::from_marker(...) when accepted marker requires trace
  | save stored consumer receipt
  | complete idempotency
  | commit tx
```

| 分支 | 处理口径 |
|---|---|
| `Accepted` | 写 reference/snapshot/stale/receipt;不写 core truth |
| `Duplicate` | 返回 stored receipt;不重放 mutation |
| `Delayed` | 不写 core truth;issue / retry 细节留 Step 12/13 |
| `Rejected` | 不写 snapshot/stale;返回 redacted issue refs |
| `UnsupportedVersion` | 不解析 payload、不写 snapshot、不 mark stale |

---

### 10. Shared operations job template

所有 operations job 必须通过 stored job report 支持 duplicate replay。Job body 不得修复 Governance core truth。

```text
[Jobs entry]
  | validate GovernanceJobRequest<T>
  v
[Job service]
  | tx = begin()
  | reservation = reserve(job_kind, idempotency_key, digest, tx)
  | duplicate -> rollback tx, load StoredGovernanceResultRepository.get_job_report(result_ref), return replay
  v
[Job body]
  | process page / explicit refs / trace refs
  | update only allowed marker or derived state
  | assemble GovernanceJobReport
  | save StoredGovernanceOperationResult(JobReport)
  | complete idempotency
  | commit tx
  v
[Response]
  | return GovernanceJobResponse
```

| Job family | Allowed mutation | Forbidden mutation |
|---|---|---|
| publish outbox | outbox publication state | accepted truth, payload snapshot body |
| rebuild projection | derived view body/state | command truth, source snapshots |
| refresh reference | reference state / body-free snapshot / stale marker | decision/policy/control/nonconformity truth |
| reconciliation | reconciliation report / finding refs | automatic truth repair |
| handoff/export | handoff marker/package/receipt refs | archive/GRC body or Governance truth |

---

### 11. Command flow batch 9.1-a: context / input / gate / decision

本批覆盖 Step 8 §8.3 的 6 个 command。所有 flow 都使用 §7 的 shared command transaction template,并在 accepted path 统一调用 outbox append helper。为避免重复,本节把“append trace / audit / outbox / stale / stored result”的细节写成每条 flow 的 accepted effect 表;完整 outbox payload snapshot 构造在 9.4 批次集中闭合。

#### 11.1 `CreateGovernanceContextFlow`

| 项目 | 内容 |
|---|---|
| 协议 | `GovernanceCommandRequest<CreateGovernanceContextRequest>` |
| 入口函数 | `GovernanceContextCommandService.create_governance_context(request, operation_context)` |
| 目标对象 | `GovernanceContext` |
| 依赖 port | `GovernanceContextRepository`, `ReferenceSnapshotRepository`, `ExternalGovernanceSourceResolverPort`, `GovernanceTraceRepository`, `GovernanceAuditHistoryRepository`, `GovernanceOutboxRepository`, `GovernanceProjectionRepository`, `StoredGovernanceResultRepository`, `GovernanceIdempotencyRepository`, `IdGeneratorPort` |
| 状态变化 | `GovernanceContextState::Draft`;若 reference unresolved,同 flow 可调用 `mark_pending_reference(...)` |
| outbound event | `GovernanceContextChanged` |
| 测试切口 | create draft success; unresolved source marks pending; duplicate replay; missing subject/source rejected; projection stale uses repository affected views |

```text
[API handler]
  | handle CreateGovernanceContext
  v
[GovernanceContextCommandService]
  | tx begin + idempotency reserve
  | resolve_governed_subject(subject_ref)
  | resolve_governance_source(source_ref)
  v
[Domain]
  | GovernanceContext::from_subject(new_governance_context_id(), subject_ref, source_ref, actor)
  | GovernanceContextPolicy::for_context(context, reference_state)
  | if policy.requires_reference_refresh() -> context.mark_pending_reference(reference_state)
  v
[Persistence]
  | context_repo.save(context, None, uow)
  | source_cursor = uow.assign_truth_change_cursor()
  | subject_ref = truth_change_subjects.context_subject(context.to_ref())
  | change = GovernanceTruthChange { subject_ref, event_kind: GovernanceOutboxEventKind::GovernanceContextChanged, source_cursor }
  | GovernanceTraceRecord::from_truth_change(new_trace_id(), change, "GovernanceContextChanged", core_trace_id)
  | trace_repo.append(trace, uow)
  | audit_history_repo.save_audit_trail(...)
  | outbox_repo.append(outbox_record, payload_snapshot, uow)
  | projection_repo.list_views_affected_by_truth_change(change, page)
  | projection_repo.mark_stale(affected, change.source_cursor, uow)
  | stored_result_repo.save(command result, uow)
  | idempotency_repo.complete(idempotency_ref, result_ref, uow)
  | tx commit
```

```rust
// GovernanceContext::from_subject(GovernanceContextId context_id, GovernedSubjectRef subject_ref, GovernanceSourceRef source_ref, ActorRef actor)
let context = GovernanceContext::from_subject(context_id, subject_ref, source_ref, actor_ref)?;
```

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| DTO 构造 | 通过 | request 提供 subject/source;actor 来自 envelope |
| domain method | 通过 | `from_subject`、`mark_pending_reference` 已在 Step 6 定义 |
| port | 通过 | resolver、context save、trace、audit、outbox、projection、result 均在 Step 7 定义 |
| version 来源 | 通过 | new context 使用 `expected_version = None` |
| 副作用 | 通过 | accepted path 写 context、trace、audit、outbox、stale、stored result |
| 禁止事项 | 通过 | 不保存 external subject/source body;不由 projection 反写真相 |

#### 11.2 `SubmitGovernanceInputFlow`

| 项目 | 内容 |
|---|---|
| 协议 | `GovernanceCommandRequest<SubmitGovernanceInputRequest>` |
| 入口函数 | `GovernanceContextCommandService.submit_governance_input(request, operation_context)` |
| 目标对象 | `GovernanceInput`, loaded `GovernanceContext` |
| 依赖 port | `GovernanceContextRepository`, `GovernanceInputRepository`, trace/audit/outbox/projection/result/idempotency/id generator |
| 状态变化 | `GovernanceInputState::Received`;若 context ready 且 policy允许,可在同 flow 调用 `GovernanceInput::accept(...)` |
| outbound event | `GovernanceContextChanged` |
| 测试切口 | receive success; context missing rejected; context not ready blocks accept; pending evidence path; duplicate replay |

```text
[API handler]
  | handle SubmitGovernanceInput
  v
[GovernanceContextCommandService]
  | tx begin + idempotency reserve
  | context = context_repo.get_with_version(context_ref)
  v
[Domain]
  | GovernanceInput::receive(new_governance_input_id(), input_kind, source_ref, context_ref, actor)
  | GovernanceContextPolicy::for_context(context, reference_state)
  | if context ready and input acceptable -> input.accept(context, actor)
  | else if evidence required -> input.wait_for_evidence(evidence_ref, actor)
  v
[Persistence]
  | input_repo.save(input, None, uow)
  | append trace/audit/outbox/stale/stored result
  | tx commit
```

```rust
// GovernanceInput::receive(GovernanceInputId input_id, GovernanceInputKind input_kind, GovernanceSourceRef source_ref, GovernanceContextRef context_ref, ActorRef actor)
let input = GovernanceInput::receive(input_id, input_kind, source_ref, context_ref, actor_ref)?;
```

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| DTO 构造 | 通过 | request 提供 context/input kind/source |
| domain method | 通过 | `receive`、`accept`、`wait_for_evidence` 已定义 |
| port | 通过 | context read with version 和 input save 已定义 |
| version 来源 | 通过 | loaded context version 只用于校验;new input save 使用 `None` |
| 副作用 | 通过 | accepted input 写 trace/outbox/stale/result;不自动开 gate |
| 禁止事项 | 通过 | input accepted 不等于 decision;不保存 source body |

#### 11.3 `UpdateGovernanceInputStateFlow`

| 项目 | 内容 |
|---|---|
| 协议 | `GovernanceCommandRequest<UpdateGovernanceInputStateRequest>` |
| 入口函数 | `GovernanceContextCommandService.update_governance_input_state(request, operation_context)` |
| 目标对象 | `GovernanceInput`, loaded `GovernanceContext` when accepting |
| 依赖 port | `GovernanceInputRepository`, `GovernanceContextRepository`, trace/audit/outbox/projection/result/idempotency/id generator |
| 状态变化 | `Received/PendingEvidence -> Accepted`;`Received -> Rejected`;`Received/Accepted/PendingEvidence -> Superseded`;pending evidence update |
| outbound event | `GovernanceContextChanged` |
| 测试切口 | accept requires ready context; reject requires reason; supersede requires next ref; illegal terminal transition rejected; optimistic conflict |

```text
[API handler]
  | handle UpdateGovernanceInputState
  v
[GovernanceContextCommandService]
  | tx begin + idempotency reserve
  | input_v = input_repo.get_with_version(input_ref)
  | if target_state == Accepted -> context_v = context_repo.get_with_version(input.context_ref)
  v
[Domain]
  | match request.target_state:
  |   Accepted -> input.accept(context, actor)
  |   PendingEvidence -> input.wait_for_evidence(pending_evidence_ref, actor)
  |   Rejected -> input.reject(reject_reason, actor)
  |   Superseded -> input.supersede(superseded_by, actor)
  v
[Persistence]
  | input_repo.save(input, Some(input_v.version), uow)
  | append trace/audit/outbox/stale/stored result
  | tx commit
```

```rust
// GovernanceInput::accept(&mut self, GovernanceContext context, ActorRef actor)
input.accept(&context, actor_ref)?;
```

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| DTO 构造 | 通过 | state-specific ref/reason 字段在 request 中显式存在 |
| domain method | 通过 | accept/reject/wait/supersede 均已定义 |
| port | 通过 | input/context versioned read 与 input save 已定义 |
| version 来源 | 通过 | `input_v.version` 传入 save |
| 错误分支 | 通过 | missing reason/ref、context missing、illegal transition、optimistic conflict 均可映射 Step 12 |
| 副作用 | 通过 | input truth 变化触发 context changed payload/stale/result |

#### 11.4 `OpenGovernanceGateFlow`

| 项目 | 内容 |
|---|---|
| 协议 | `GovernanceCommandRequest<OpenGovernanceGateRequest>` |
| 入口函数 | `GovernanceDecisionCommandService.open_governance_gate(request, operation_context)` |
| 目标对象 | `Gate`, optional `ApproverRequirement`, optional `ApprovalResponsibility`, optional `ResponsibilityChain` |
| 依赖 port | `GovernanceContextRepository`, `GateRepository`, `ApproverRequirementRepository`, `ApprovalResponsibilityRepository`, `ResponsibilityChainRepository`, resolver/reference repo when actor snapshot is needed, trace/audit/outbox/projection/result/id generator |
| 状态变化 | `GateState::Open`;optional responsibility `Required/Assigned`;optional chain `Open` |
| outbound event | `GateChanged`;optional `ApprovalResponsibilityChanged` if responsibility created |
| 测试切口 | ready context opens gate; context not ready rejected; optional requirement creates responsibility; duplicate replay; affected views not ad hoc |

```text
[API handler]
  | handle OpenGovernanceGate
  v
[GovernanceDecisionCommandService]
  | tx begin + idempotency reserve
  | context_v = context_repo.get_with_version(context_ref)
  | open_existing = gate_repo.find_open_by_context(context_ref, page)
  v
[Domain]
  | GovernanceContextPolicy::for_context(context, reference_state).assert_context_ready(context)
  | Gate::open(new_gate_id(), context, gate_kind, actor)
  | if approver_requirement_intent:
  |   build ApproverRequirement(new_approver_requirement_id(), intent)
  |   ApprovalResponsibility::require(new_approval_responsibility_id(), context, requirement)
  |   ResponsibilityChain::start_for_context(new_responsibility_chain_id(), context, requirement)
  |   responsibility optional assign based on ActorCapabilitySnapshot
  v
[Persistence]
  | gate_repo.save(gate, None, uow)
  | approver_requirement_repo.save(requirement, uow) when created
  | save optional responsibility/chain
  | append trace/audit/outbox/stale/stored result
  | tx commit
```

```rust
// Gate::open(GateId gate_id, GovernanceContext context, GateKind gate_kind, ActorRef actor)
let gate = Gate::open(gate_id, &context, gate_kind, actor_ref)?;
```

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| DTO 构造 | 通过 | request 提供 context/gate kind/optional requirement intent |
| domain method | 通过 | `Gate::open`;requirement/responsibility/chain methods 已在 Step 6 定义 |
| port | 通过 | context read、open gate lookup、gate save、optional responsibility/chain save 均已定义 |
| version 来源 | 通过 | new gate/responsibility/chain save 使用 `None`;context version 只读校验 |
| 副作用 | 通过 | gate truth 触发 `GateChanged`;optional responsibility 触发 approval side effect |
| 禁止事项 | 通过 | process waiting gate 不替代 Governance gate |

#### 11.5 `RecordGovernanceDecisionFlow`

| 项目 | 内容 |
|---|---|
| 协议 | `GovernanceCommandRequest<RecordGovernanceDecisionRequest>` |
| 入口函数 | `GovernanceDecisionCommandService.record_governance_decision(request, operation_context)` |
| 目标对象 | `GovernanceDecision`, `Gate` |
| 依赖 port | `GateRepository`, `GovernanceDecisionRepository`, `ResponsibilityChainRepository`, `SharedRuleSetRepository`, `GovernanceAuditHistoryRepository`, trace/outbox/projection/result/id generator |
| 状态变化 | `GovernanceDecisionState::Proposed -> Approved/Rejected/Waived`;`GateState::PendingDecision -> Decided` |
| history | `DecisionRecord` |
| outbound event | `GovernanceDecisionChanged`, `GateChanged` |
| 测试切口 | satisfied chain required; approve requires basis; reject/waive reason; gate attach decision; history trace linked; duplicate replay |

```text
[API handler]
  | handle RecordGovernanceDecision
  v
[GovernanceDecisionCommandService]
  | tx begin + idempotency reserve
  | gate_v = gate_repo.get_with_version(gate_ref)
  | current_decision = decision_repo.find_current_by_gate(gate_ref)
  | chain_v = responsibility_chain_repo.find_by_context(gate.context_ref)
  | shared_rule_set = shared_rule_set_repo.find_active_by_scope(scope_ref)
  v
[Domain]
  | DecisionPolicy::for_gate(gate, chain, shared_rule_set_ref)
  | policy.assert_can_decide(gate, chain, actor)
  | GovernanceDecision::propose(new_governance_decision_id(), gate, decision_kind, outcome_ref, actor)
  | match finalization_intent:
  |   Approve { basis_ref } -> policy.assert_basis_sufficient(basis_ref); decision.approve(basis_ref, actor)
  |   Reject { reason } -> decision.reject(reason, actor)
  |   Waive { reason } -> decision.waive(reason, actor)
  |   ProposeOnly -> keep Proposed
  | gate.attach_decision(decision, actor) when decision.is_finalized()
  v
[Persistence]
  | decision_repo.save(decision, None, uow)
  | gate_repo.save(gate, Some(gate_v.version), uow) when attached
  | append DecisionRecord::from_decision_change(...)
  | append trace/audit/outbox/stale/stored result
  | tx commit
```

```rust
// GovernanceDecision::propose(GovernanceDecisionId decision_id, Gate gate, GovernanceDecisionKind kind, GovernanceDecisionOutcomeRef outcome_ref, ActorRef actor)
let decision = GovernanceDecision::propose(decision_id, &gate, decision_kind, outcome_ref, actor_ref)?;
```

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| DTO 构造 | 通过 | request 提供 gate/kind/outcome/finalization intent |
| domain method | 通过 | propose/approve/reject/waive/attach_decision 已定义 |
| port | 通过 | gate/decision/chain/shared rule reads 与 saves 已定义 |
| version 来源 | 通过 | gate update 使用 `gate_v.version`;new decision 使用 `None` |
| history / trace | 通过 | `DecisionRecord` 需要 generated id 和 trace ref,均由 Step 7 id/trace port 提供 |
| 禁止事项 | 通过 | vote 不等于 decision;process waiting gate 不替代 decision |

#### 11.6 `SupersedeGovernanceDecisionFlow`

| 项目 | 内容 |
|---|---|
| 协议 | `GovernanceCommandRequest<SupersedeGovernanceDecisionRequest>` |
| 入口函数 | `GovernanceDecisionCommandService.supersede_governance_decision(request, operation_context)` |
| 目标对象 | current `GovernanceDecision`, next `GovernanceDecision` |
| 依赖 port | `GovernanceDecisionRepository`, `GateRepository`, `ResponsibilityChainRepository`, `SharedRuleSetRepository`, trace/history/outbox/projection/result/id generator |
| 状态变化 | current finalized -> `Superseded`;next proposed -> finalized or proposed by intent |
| history | two `DecisionRecord` records or one compound accepted change with both refs in result |
| outbound event | `GovernanceDecisionChanged` |
| 测试切口 | current must be finalized; next same gate; basis/reason required; two saves use correct versions; duplicate replay |

```text
[API handler]
  | handle SupersedeGovernanceDecision
  v
[GovernanceDecisionCommandService]
  | tx begin + idempotency reserve
  | current_v = decision_repo.get_with_version(current_decision_ref)
  | gate_v = gate_repo.get_with_version(current.gate_ref)
  | chain_v = responsibility_chain_repo.find_by_context(gate.context_ref)
  v
[Domain]
  | next = GovernanceDecision::propose(new_governance_decision_id(), gate, next_kind, next_outcome, actor)
  | finalize next according to next_finalization_intent
  | DecisionPolicy::for_gate(gate, chain, shared_rule_set_ref).assert_supersede_allowed(current, next)
  | current.supersede(next.to_ref(), actor)
  v
[Persistence]
  | decision_repo.save(next, None, uow)
  | decision_repo.save(current, Some(current_v.version), uow)
  | append DecisionRecord for next and current
  | append trace/audit/outbox/stale/stored result
  | tx commit
```

```rust
// GovernanceDecision::supersede(&mut self, GovernanceDecisionRef next_decision_ref, ActorRef actor)
current_decision.supersede(next_decision.to_ref(), actor_ref)?;
```

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| DTO 构造 | 通过 | request 提供 current ref、next kind/outcome/finalization intent |
| domain method | 通过 | next propose/finalize 和 current supersede 已定义 |
| port | 通过 | current versioned read、gate read、decision saves、history append 已定义 |
| version 来源 | 通过 | current update uses `current_v.version`;next save uses `None` |
| outbox / projection | 通过 | decision truth change maps to `GovernanceDecisionChanged` and affected views |
| 禁止事项 | 通过 | 不原地改写旧 decision outcome;不删除旧 history |

#### 11.7 9.1-a stop-review

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 6 个 request DTO 是否都有 flow | 通过 | Create/Submit/Update/Open/Record/Supersede 已覆盖 |
| Step 6 domain method 是否存在 | 通过 | context/input/gate/decision/requirement/responsibility/chain 方法均已在 Step 6 定义 |
| Step 7 port 是否足够 | 通过 | 所需 truth repo、trace、audit/history、outbox、projection、result、idempotency、id generator 均已定义 |
| version 来源是否闭合 | 通过 | new object 用 `None`;existing object 用 `get_with_version` 版本 |
| outbox snapshot 是否越界 | 通过 | 本批只声明 accepted helper;具体 snapshot builder 在 9.4 集中闭合 |
| phase boundary | 通过 | 未引用 Step 10~17 尚未定义的实现-only schema |

---

### 12. Command flow batch 9.1-b: approval / policy

#### 12.1 `AssignApprovalResponsibilityFlow`

| 项目 | 内容 |
|---|---|
| 协议 | `GovernanceCommandRequest<AssignApprovalResponsibilityRequest>` |
| 入口函数 | `ApprovalCoordinationService.assign_approval_responsibility(request, operation_context)` |
| 目标对象 | `ApproverRequirement`, `ApprovalResponsibility`, optional `ResponsibilityChain` |
| 依赖 port | `GovernanceContextRepository`, `ApproverRequirementRepository`, `ApprovalResponsibilityRepository`, `ResponsibilityChainRepository`, `ReferenceSnapshotRepository`, `ExternalGovernanceSourceResolverPort`, trace/history/outbox/projection/result/id generator |
| 状态变化 | `ApprovalResponsibilityState::Required`;optional `Required -> Assigned`;optional chain `Open` append |
| history | `ResponsibilityTraceRecord` |
| outbound event | `ApprovalResponsibilityChanged` |
| 测试切口 | context ready required; optional actor assignment requires resolved actor snapshot; chain append uses loaded chain version; duplicate replay; no identity truth write |

```text
[API handler]
  | handle AssignApprovalResponsibility
  v
[ApprovalCoordinationService]
  | tx begin + idempotency reserve
  | context_v = context_repo.get_with_version(context_ref)
  | actor_snapshot = resolve_actor_capability(actor_ref) when request.actor_ref.is_some()
  | chain_v = chain_repo.get_with_version(chain_ref) when request.chain_ref.is_some()
  v
[Domain]
  | GovernanceContextPolicy::for_context(context, reference_state).assert_context_ready(context)
  | requirement = build ApproverRequirement from request.requirement_intent and new_approver_requirement_id()
  | responsibility = ApprovalResponsibility::require(new_approval_responsibility_id(), context, requirement)
  | if actor_snapshot:
  |   ApprovalResponsibilityPolicy::from_snapshot(responsibility, actor_snapshot).assert_can_assign(responsibility, requirement)
  |   responsibility.assign(actor_snapshot, actor)
  | if chain:
  |   chain.append(responsibility)
  v
[Persistence]
  | approver_requirement_repo.save(requirement, uow)
  | responsibility_repo.save(responsibility, None, uow)
  | chain_repo.save(chain, Some(chain_v.version), uow) when changed
  | append ResponsibilityTraceRecord::from_responsibility_change(...)
  | append trace/audit/outbox/stale/stored result
  | tx commit
```

```rust
// ApprovalResponsibility::require(ApprovalResponsibilityId responsibility_id, GovernanceContext context, ApproverRequirement requirement)
let responsibility = ApprovalResponsibility::require(responsibility_id, &context, &requirement)?;
```

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| DTO 构造 | 通过 | request 提供 context、requirement intent、optional actor/chain |
| domain method | 通过 | require/assign/chain append 已定义 |
| port | 通过 | context/requirement/responsibility/chain/ref resolver ports 已定义 |
| version 来源 | 通过 | new responsibility 使用 `None`;existing chain 使用 `chain_v.version` |
| 副作用 | 通过 | responsibility history、trace、outbox、stale、stored result |
| 禁止事项 | 通过 | 不保存 actor profile/capability body;不自动形成 decision |

#### 12.2 `RecordApprovalVoteFlow`

| 项目 | 内容 |
|---|---|
| 协议 | `GovernanceCommandRequest<RecordApprovalVoteRequest>` |
| 入口函数 | `ApprovalCoordinationService.record_approval_vote(request, operation_context)` |
| 目标对象 | `ApprovalResponsibility`, optional `ResponsibilityChain` |
| 依赖 port | `ApprovalResponsibilityRepository`, `ApproverRequirementRepository`, `ResponsibilityChainRepository`, `ReferenceSnapshotRepository`, resolver, trace/history/outbox/projection/result |
| 状态变化 | `Assigned/Accepted -> Voted`;optional chain `Open -> Satisfied` when threshold is met |
| history | `ResponsibilityTraceRecord` |
| outbound event | `ApprovalResponsibilityChanged` |
| 测试切口 | actor mismatch rejected; vote stored; chain satisfied not decision; evidence ref body excluded; duplicate replay |

```text
[API handler]
  | handle RecordApprovalVote
  v
[ApprovalCoordinationService]
  | tx begin + idempotency reserve
  | responsibility_v = responsibility_repo.get_with_version(responsibility_ref)
  | requirement = approver_requirement_repo.get(responsibility.requirement_ref)
  | actor_snapshot = resolve_actor_capability(actor)
  | chain_v = chain_repo.find_by_context(responsibility.context_ref)
  | loaded responsibilities = responsibility_repo.list_by_context(context_ref, page)
  v
[Domain]
  | ApprovalResponsibilityPolicy::from_snapshot(responsibility, actor_snapshot)
  | policy.assert_can_vote(responsibility, actor)
  | responsibility.record_vote(vote, actor)
  | if chain and policy.assert_chain_satisfied(chain, responsibilities, requirement) passes:
  |   chain.mark_satisfied(actor)
  v
[Persistence]
  | responsibility_repo.save(responsibility, Some(responsibility_v.version), uow)
  | chain_repo.save(chain, Some(chain_v.version), uow) when changed
  | append ResponsibilityTraceRecord::from_responsibility_change(...)
  | append trace/audit/outbox/stale/stored result
  | tx commit
```

```rust
// ApprovalResponsibility::record_vote(&mut self, GovernanceVote vote, ActorRef actor)
responsibility.record_vote(request.vote, actor_ref)?;
```

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| DTO 构造 | 通过 | request 提供 responsibility/vote/evidence ref |
| domain method | 通过 | `record_vote` 和 optional `mark_satisfied` 已定义 |
| port | 通过 | responsibility versioned read/save、requirement get、chain find/save、list_by_context 已定义 |
| version 来源 | 通过 | responsibility and chain updates use loaded versions |
| 副作用 | 通过 | vote emits approval changed, history, trace, stale and stored result |
| 禁止事项 | 通过 | vote / satisfied chain 不等同 formal decision |

#### 12.3 `DelegateApprovalResponsibilityFlow`

| 项目 | 内容 |
|---|---|
| 协议 | `GovernanceCommandRequest<DelegateApprovalResponsibilityRequest>` |
| 入口函数 | `ApprovalCoordinationService.delegate_approval_responsibility(request, operation_context)` |
| 目标对象 | `ApprovalResponsibility` |
| 依赖 port | `ApprovalResponsibilityRepository`, `ApproverRequirementRepository`, `ReferenceSnapshotRepository`, `ExternalGovernanceSourceResolverPort`, trace/history/outbox/projection/result |
| 状态变化 | `Assigned/Accepted -> Delegated` |
| history | `ResponsibilityTraceRecord` |
| outbound event | `ApprovalResponsibilityChanged` |
| 测试切口 | delegate snapshot required; delegation rule enforced; actor mismatch rejected; duplicate replay; no identity write |

```text
[API handler]
  | handle DelegateApprovalResponsibility
  v
[ApprovalCoordinationService]
  | tx begin + idempotency reserve
  | responsibility_v = responsibility_repo.get_with_version(responsibility_ref)
  | actor_snapshot = resolve_actor_capability(actor)
  | delegate_snapshot = resolve_actor_capability(delegate_actor_ref)
  | requirement = approver_requirement_repo.get(responsibility.requirement_ref)
  v
[Domain]
  | ApprovalResponsibilityPolicy::from_snapshot(responsibility, actor_snapshot)
  | policy.assert_can_delegate(responsibility, delegate_snapshot, requirement)
  | responsibility.delegate_to(delegate_actor_ref, delegation_reason, actor)
  v
[Persistence]
  | responsibility_repo.save(responsibility, Some(responsibility_v.version), uow)
  | append ResponsibilityTraceRecord::from_responsibility_change(...)
  | append trace/audit/outbox/stale/stored result
  | tx commit
```

```rust
// ApprovalResponsibility::delegate_to(&mut self, ActorRef delegate_ref, DelegationReason reason, ActorRef actor)
responsibility.delegate_to(request.delegate_actor_ref, request.delegation_reason, actor_ref)?;
```

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| DTO 构造 | 通过 | request 提供 responsibility/delegate/reason |
| domain method | 通过 | `delegate_to` and policy `assert_can_delegate` 已定义 |
| port | 通过 | Step 7 已补 `ApproverRequirementRepository.get/save`;actor/delegate snapshot 由 resolver 提供 |
| version 来源 | 通过 | responsibility update uses `responsibility_v.version` |
| 副作用 | 通过 | delegation history/trace/outbox/stale/result |
| 禁止事项 | 通过 | 不修改 identity / capability truth |

#### 12.4 `ActivatePolicyEffectiveFactFlow`

| 项目 | 内容 |
|---|---|
| 协议 | `GovernanceCommandRequest<ActivatePolicyEffectiveFactRequest>` |
| 入口函数 | `PolicyGovernanceService.activate_policy_effective_fact(request, operation_context)` |
| 目标对象 | `PolicyEffectiveFact`, optional `PolicyConflictRecord` |
| 依赖 port | `PolicyEffectiveFactRepository`, `SharedRuleSetRepository`, `PolicyConflictRepository`, trace/history/outbox/projection/result/id generator |
| 状态变化 | new policy `Proposed`;optional `Proposed -> Effective`;optional conflict `Detected` |
| history | `PolicyChangeRecord` |
| outbound event | `PolicyEffectiveFactChanged`;optional `PolicyConflictChanged` |
| 测试切口 | snapshot body-free; activate intent changes state; shared rule conflict creates conflict record; duplicate replay; no method body saved |

```text
[API handler]
  | handle ActivatePolicyEffectiveFact
  v
[PolicyGovernanceService]
  | tx begin + idempotency reserve
  | active_policies = policy_repo.list_active_by_scope(scope_ref, page)
  | shared_rule_set = shared_rule_set_repo.find_active_by_scope(scope_ref)
  v
[Domain]
  | scope_policy = PolicyScopePolicy::for_subject(subject_ref, scope_ref)
  | policy_fact = PolicyEffectiveFact::propose(new_policy_effective_fact_id(), policy_snapshot, scope_ref, priority, actor)
  | if activation_intent == Activate:
  |   policy_fact.activate(policy_snapshot, actor)
  | conflict_candidates = PolicyConflictPolicy::for_scope(scope_ref, policy_refs).detect_conflicts(active_policies + policy_fact, shared_rule_set)
  | if conflict_candidates not empty:
  |   conflict = PolicyConflictRecord::detect(new_policy_conflict_record_id(), conflict_candidates, scope_ref, shared_rule_set_ref, actor)
  v
[Persistence]
  | policy_repo.save(policy_fact, None, uow)
  | conflict_repo.save(conflict, None, uow) when detected
  | append PolicyChangeRecord::from_policy_change(...)
  | append trace/audit/outbox/stale/stored result
  | tx commit
```

```rust
// PolicyEffectiveFact::propose(PolicyEffectiveFactId policy_fact_id, MethodPolicySnapshot snapshot, GovernanceScopeRef scope_ref, PolicyPriority priority, ActorRef actor)
let policy_fact = PolicyEffectiveFact::propose(policy_fact_id, snapshot, scope_ref, priority, actor_ref)?;
```

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| DTO 构造 | 通过 | request 提供 policy snapshot、scope、priority、activation intent |
| domain method | 通过 | propose/activate/detect conflict 已定义 |
| port | 通过 | active policy list、shared rules lookup、conflict save 已定义 |
| version 来源 | 通过 | new policy/conflict save uses `None` |
| 副作用 | 通过 | policy changed and optional conflict changed outbox/stale/result |
| 禁止事项 | 通过 | 不保存 AIPolicyDef body;conflict 不修改 policy truth |

#### 12.5 `UpdatePolicyEffectiveFactStateFlow`

| 项目 | 内容 |
|---|---|
| 协议 | `GovernanceCommandRequest<UpdatePolicyEffectiveFactStateRequest>` |
| 入口函数 | `PolicyGovernanceService.update_policy_effective_fact_state(request, operation_context)` |
| 目标对象 | `PolicyEffectiveFact` |
| 依赖 port | `PolicyEffectiveFactRepository`, `PolicyConflictRepository`, `SharedRuleSetRepository`, trace/history/outbox/projection/result |
| 状态变化 | `Proposed/Suspended -> Effective`;`Effective -> Suspended`;`Proposed/Effective/Suspended -> Superseded/Retired` |
| history | `PolicyChangeRecord` |
| outbound event | `PolicyEffectiveFactChanged` |
| 测试切口 | update uses expected version; suspend/retire reasons; supersede next ref; conflict rescan; duplicate replay |

```text
[API handler]
  | handle UpdatePolicyEffectiveFactState
  v
[PolicyGovernanceService]
  | tx begin + idempotency reserve
  | policy_v = policy_repo.get_with_version(policy_fact_ref)
  | active_policies = policy_repo.list_active_by_scope(policy.scope_ref, page)
  | shared_rule_set = shared_rule_set_repo.find_active_by_scope(policy.scope_ref)
  v
[Domain]
  | match update_intent:
  |   Activate { snapshot } -> policy.activate(snapshot, actor)
  |   Suspend { reason } -> policy.suspend(reason, actor)
  |   Supersede { next_ref } -> policy.supersede(next_ref, actor)
  |   Retire { reason } -> policy.retire(reason, actor)
  | conflict_candidates = PolicyConflictPolicy::for_scope(scope_ref, policy_refs).detect_conflicts(active_policies, shared_rule_set)
  v
[Persistence]
  | policy_repo.save(policy, Some(policy_v.version), uow)
  | save conflict records when newly detected
  | append PolicyChangeRecord::from_policy_change(...)
  | append trace/audit/outbox/stale/stored result
  | tx commit
```

```rust
// PolicyEffectiveFact::suspend(&mut self, PolicySuspendReason reason, ActorRef actor)
policy_fact.suspend(reason, actor_ref)?;
```

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| DTO 构造 | 通过 | enum intent carries required snapshot/reason/next ref |
| domain method | 通过 | activate/suspend/supersede/retire 已定义 |
| port | 通过 | policy versioned read/save and conflict list/save are defined |
| version 来源 | 通过 | save uses `policy_v.version` |
| 副作用 | 通过 | policy change history/trace/outbox/stale/result |
| 禁止事项 | 通过 | state change 不保存 method policy body |

#### 12.6 `UpdateSharedRuleSetFlow`

| 项目 | 内容 |
|---|---|
| 协议 | `GovernanceCommandRequest<UpdateSharedRuleSetRequest>` |
| 入口函数 | `PolicyGovernanceService.update_shared_rule_set(request, operation_context)` |
| 目标对象 | `SharedRuleSet`, optional `PolicyConflictRecord` |
| 依赖 port | `SharedRuleSetRepository`, `PolicyEffectiveFactRepository`, `PolicyConflictRepository`, trace/history/outbox/projection/result/id generator |
| 状态变化 | draft/activate/add/deprecate/retire;optional conflict detected |
| history | `PolicyChangeRecord` |
| outbound event | `SharedRuleSetChanged`;optional `PolicyConflictChanged` |
| 测试切口 | draft requires scope; non-draft requires existing rule set; lower policy conflict detected; duplicate replay; no rule body saved |

```text
[API handler]
  | handle UpdateSharedRuleSet
  v
[PolicyGovernanceService]
  | tx begin + idempotency reserve
  | if rule_set_ref: rule_set_v = shared_rule_set_repo.get_with_version(rule_set_ref)
  | else: no existing rule set
  | active_policies = policy_repo.list_active_by_scope(scope_ref, page)
  v
[Domain]
  | if update_intent == Draft:
  |   rule_set = SharedRuleSet::draft(new_shared_rule_set_id(), scope_ref, actor)
  | else:
  |   use loaded rule_set
  | match update_intent:
  |   Activate -> rule_set.activate(actor)
  |   AddRule { rule_ref } -> rule_set.add_rule(rule_ref, actor)
  |   DeprecateRule { rule_ref, reason } -> rule_set.deprecate_rule(rule_ref, reason, actor)
  |   Retire { reason } -> rule_set.retire(reason, actor)
  | conflict_candidates = PolicyConflictPolicy::for_scope(scope_ref, active_policy_refs).detect_conflicts(active_policies, Some(rule_set))
  | create PolicyConflictRecord when shared-rule conflict exists
  v
[Persistence]
  | shared_rule_set_repo.save(rule_set, expected_version, uow)
  | conflict_repo.save(conflict, None, uow) when detected
  | append PolicyChangeRecord::from_shared_rule_change(...)
  | append trace/audit/outbox/stale/stored result
  | tx commit
```

```rust
// SharedRuleSet::add_rule(&mut self, SharedRuleRef rule_ref, ActorRef actor)
rule_set.add_rule(rule_ref, actor_ref)?;
```

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| DTO 构造 | 通过 | request gives optional rule set, scope and update intent |
| domain method | 通过 | draft/activate/add/deprecate/retire 已定义 |
| port | 通过 | shared rules get/save、policy list、conflict save 已定义 |
| version 来源 | 通过 | draft uses `None`; existing update uses loaded version |
| 副作用 | 通过 | shared rule changed and optional conflict changed outbox/stale/result |
| 禁止事项 | 通过 | 不保存 rule expression / standard body |

#### 12.7 `ResolvePolicyConflictFlow`

| 项目 | 内容 |
|---|---|
| 协议 | `GovernanceCommandRequest<ResolvePolicyConflictRequest>` |
| 入口函数 | `PolicyGovernanceService.resolve_policy_conflict(request, operation_context)` |
| 目标对象 | `PolicyConflictRecord` |
| 依赖 port | `PolicyConflictRepository`, `GateRepository`, `GovernanceDecisionRepository`, trace/history/outbox/projection/result |
| 状态变化 | `Detected -> PendingDecision/Resolved/Waived/Invalid`;`PendingDecision -> Resolved/Waived/Invalid` |
| history | `PolicyChangeRecord` |
| outbound event | `PolicyConflictChanged` |
| 测试切口 | pending decision requires gate; resolve/waive requires formal decision; invalidate reason; no policy truth mutation; duplicate replay |

```text
[API handler]
  | handle ResolvePolicyConflict
  v
[PolicyGovernanceService]
  | tx begin + idempotency reserve
  | conflict_v = conflict_repo.get_with_version(conflict_ref)
  | load gate or decision based on resolution_intent
  v
[Domain]
  | match resolution_intent:
  |   MarkPendingDecision { gate_ref } -> conflict.mark_pending_decision(gate, actor)
  |   Resolve { decision_ref } -> conflict.resolve(decision, actor)
  |   Waive { decision_ref, reason } -> conflict.waive(decision, reason, actor)
  |   Invalidate { reason } -> conflict.invalidate(reason, actor)
  v
[Persistence]
  | conflict_repo.save(conflict, Some(conflict_v.version), uow)
  | append PolicyChangeRecord::from_conflict_change(...)
  | append trace/audit/outbox/stale/stored result
  | tx commit
```

```rust
// PolicyConflictRecord::resolve(&mut self, GovernanceDecision decision, ActorRef actor)
conflict.resolve(&decision, actor_ref)?;
```

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| DTO 构造 | 通过 | enum intent carries required gate/decision/reason |
| domain method | 通过 | pending/resolve/waive/invalidate 已定义 |
| port | 通过 | conflict/gate/decision reads and conflict save 已定义 |
| version 来源 | 通过 | conflict update uses `conflict_v.version` |
| 副作用 | 通过 | conflict history/trace/outbox/stale/result |
| 禁止事项 | 通过 | conflict resolution 不改写 policy fact/shared rule truth |

#### 12.8 9.1-b stop-review

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 7 个 request DTO 是否都有 flow | 通过 | approval 3 条、policy/shared/conflict 4 条已覆盖 |
| Step 6 domain method 是否存在 | 通过 | responsibility、chain、policy、shared rule、conflict transition method 均已定义 |
| Step 7 port 是否足够 | 通过 | 已补 `ApproverRequirementRepository`;policy/shared/conflict 读取面闭合 |
| version 来源是否闭合 | 通过 | new value/truth 用 `None` 或 append-only;existing truth 用 versioned read |
| outbox / stale | 通过 | 使用 accepted truth change + affected view repository;不拼 view ref |
| phase boundary | 通过 | 未把 method/identity/rule body 或 later implementation schema 引入 flow |

---

### 13. Command flow batch 9.1-c: control / compliance / corrective

#### 13.1 `AssessControlApplicabilityFlow`

| 项目 | 内容 |
|---|---|
| 协议 | `GovernanceCommandRequest<AssessControlApplicabilityRequest>` |
| 入口函数 | `ControlComplianceService.assess_control_applicability(request, operation_context)` |
| 目标对象 | `ControlApplicability` |
| 依赖 port | `GovernanceContextRepository`, `ControlApplicabilityRepository`, trace/history/outbox/projection/result/id generator |
| 状态变化 | new `PendingAssessment`;optional `Applicable` / `NotApplicable` / `Excluded` |
| history | `ControlChangeRecord` |
| outbound event | `ControlApplicabilityChanged` |
| 测试切口 | context ready; snapshot acceptable; applicable basis required; exclude reason+basis; duplicate replay; no ControlDefinition body |

```text
[API handler]
  | handle AssessControlApplicability
  v
[ControlComplianceService]
  | tx begin + idempotency reserve
  | context_v = context_repo.get_with_version(context_ref)
  v
[Domain]
  | ControlApplicabilityPolicy::for_control(context, control_snapshot).assert_can_assess(context, control_snapshot)
  | applicability = ControlApplicability::assess(new_control_applicability_id(), context, control_snapshot, actor)
  | match assessment_intent:
  |   PendingAssessment -> no state finalization
  |   Applicable { basis_ref } -> policy.assert_applicability_basis(basis_ref); applicability.mark_applicable(basis_ref, actor)
  |   NotApplicable { reason } -> applicability.mark_not_applicable(reason, actor)
  |   Excluded { reason, basis_ref } -> policy.assert_applicability_basis(basis_ref); applicability.exclude(reason, basis_ref, actor)
  v
[Persistence]
  | control_applicability_repo.save(applicability, None, uow)
  | append ControlChangeRecord::from_control_change(...)
  | append trace/audit/outbox/stale/stored result
  | tx commit
```

```rust
// ControlApplicability::assess(ControlApplicabilityId applicability_id, GovernanceContext context, MethodControlSnapshot control_snapshot, ActorRef actor)
let applicability = ControlApplicability::assess(applicability_id, &context, control_snapshot, actor_ref)?;
```

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| DTO 构造 | 通过 | request 提供 context、control snapshot、assessment intent |
| domain method | 通过 | assess/mark_applicable/mark_not_applicable/exclude 已定义 |
| port | 通过 | context read and applicability save 已定义 |
| version 来源 | 通过 | new applicability save uses `None` |
| 副作用 | 通过 | control history/trace/outbox/stale/result |
| 禁止事项 | 通过 | 不保存 method control definition body;review 不自动创建 |

#### 13.2 `RecordControlReviewFlow`

| 项目 | 内容 |
|---|---|
| 协议 | `GovernanceCommandRequest<RecordControlReviewRequest>` |
| 入口函数 | `ControlComplianceService.record_control_review(request, operation_context)` |
| 目标对象 | `ControlReview` |
| 依赖 port | `ControlApplicabilityRepository`, `ControlReviewRepository`, `GovernanceDecisionRepository`, trace/history/outbox/projection/result/id generator |
| 状态变化 | plan `Planned`;`Planned -> InReview`;`InReview -> Passed/Failed/Waived`;`Planned/InReview -> Superseded` |
| history | `ControlChangeRecord` |
| outbound event | `ControlApplicabilityChanged` |
| 测试切口 | plan requires applicable control; update requires review ref; waiver requires formal decision; failed review does not create nonconformity automatically |

```text
[API handler]
  | handle RecordControlReview
  v
[ControlComplianceService]
  | tx begin + idempotency reserve
  | applicability_v = control_applicability_repo.get_with_version(applicability_ref)
  | review_v = control_review_repo.get_with_version(review_ref) when updating
  | decision = decision_repo.get_with_version(decision_ref) when waiving
  v
[Domain]
  | ControlApplicabilityPolicy::for_control(context, applicability.control_snapshot_ref)
  | if review_ref is None:
  |   assert_review_allowed(applicability, reviewer_ref)
  |   review = ControlReview::plan(new_control_review_id(), applicability, reviewer_ref)
  | else:
  |   match review_intent:
  |     Start { reviewer_ref } -> review.start(reviewer_ref)
  |     Pass { evidence_ref } -> review.pass(evidence_ref, actor)
  |     Fail { reason, evidence_ref } -> review.fail(reason, evidence_ref, actor)
  |     Waive { decision_ref } -> review.waive(decision, actor)
  |     Supersede { next_ref } -> review.supersede(next_ref, actor)
  v
[Persistence]
  | control_review_repo.save(review, expected_version, uow)
  | append ControlChangeRecord::from_review_change(...)
  | append trace/audit/outbox/stale/stored result
  | tx commit
```

```rust
// ControlReview::plan(ControlReviewId review_id, ControlApplicability applicability, ActorRef reviewer_ref)
let review = ControlReview::plan(review_id, &applicability, reviewer_ref)?;
```

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| DTO 构造 | 通过 | review intent enum carries reviewer/evidence/reason/decision/next ref |
| domain method | 通过 | plan/start/pass/fail/waive/supersede 已定义 |
| port | 通过 | applicability/review/decision reads and review save 已定义 |
| version 来源 | 通过 | new review uses `None`; existing review uses `review_v.version` |
| 副作用 | 通过 | review history/trace/outbox/stale/result |
| 禁止事项 | 通过 | failed review 不自动创建 nonconformity |

#### 13.3 `SubmitAIIAConclusionFlow`

| 项目 | 内容 |
|---|---|
| 协议 | `GovernanceCommandRequest<SubmitAIIAConclusionRequest>` |
| 入口函数 | `ControlComplianceService.submit_aiia_conclusion(request, operation_context)` |
| 目标对象 | `AIIAConclusion` |
| 依赖 port | `GovernanceContextRepository`, `ComplianceConclusionRepository`, trace/history/outbox/projection/result/id generator |
| 状态变化 | new `Drafted`;optional `Drafted -> InReview` |
| history | `ComplianceConclusionRecord` |
| outbound event | `ComplianceConclusionChanged` |
| 测试切口 | artifact ref body-free; submit requires evidence; context ready; duplicate replay; no artifact body saved |

```text
[API handler]
  | handle SubmitAIIAConclusion
  v
[ControlComplianceService]
  | tx begin + idempotency reserve
  | context_v = context_repo.get_with_version(context_ref)
  v
[Domain]
  | ComplianceConclusionPolicy::for_context(context, evidence_ref, None).assert_no_artifact_body(artifact_ref)
  | conclusion = AIIAConclusion::from_artifact(new_aiia_conclusion_id(), context, artifact_ref, actor)
  | if submission_intent == SubmitForReview { evidence_ref }:
  |   policy.assert_review_evidence(evidence_ref)
  |   conclusion.submit_for_review(evidence_ref, actor)
  v
[Persistence]
  | compliance_repo.save_aiia(conclusion, None, uow)
  | append ComplianceConclusionRecord::from_aiia_change(...)
  | append trace/audit/outbox/stale/stored result
  | tx commit
```

```rust
// AIIAConclusion::from_artifact(AIIAConclusionId aiia_conclusion_id, GovernanceContext context, ArtifactRef artifact_ref, ActorRef actor)
let conclusion = AIIAConclusion::from_artifact(aiia_id, &context, artifact_ref, actor_ref)?;
```

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| DTO 构造 | 通过 | request provides context/artifact/submission intent |
| domain method | 通过 | from_artifact and submit_for_review 已定义 |
| port | 通过 | context read and AIIA save 已定义 |
| version 来源 | 通过 | new conclusion save uses `None` |
| 副作用 | 通过 | compliance history/trace/outbox/stale/result |
| 禁止事项 | 通过 | 不保存 AIIA / artifact body |

#### 13.4 `SubmitSoAConclusionFlow`

| 项目 | 内容 |
|---|---|
| 协议 | `GovernanceCommandRequest<SubmitSoAConclusionRequest>` |
| 入口函数 | `ControlComplianceService.submit_soa_conclusion(request, operation_context)` |
| 目标对象 | `SoAConclusion` |
| 依赖 port | `GovernanceContextRepository`, `ComplianceConclusionRepository`, trace/history/outbox/projection/result/id generator |
| 状态变化 | new `Drafted`;attach coverage;optional `Drafted -> InReview` |
| history | `ComplianceConclusionRecord` |
| outbound event | `ComplianceConclusionChanged` |
| 测试切口 | coverage required; submit requires evidence; coverage does not rewrite control truth; duplicate replay |

```text
[API handler]
  | handle SubmitSoAConclusion
  v
[ControlComplianceService]
  | tx begin + idempotency reserve
  | context_v = context_repo.get_with_version(context_ref)
  v
[Domain]
  | policy = ComplianceConclusionPolicy::for_context(context, evidence_ref, Some(control_coverage_ref))
  | policy.assert_no_artifact_body(artifact_ref)
  | conclusion = SoAConclusion::from_artifact(new_soa_conclusion_id(), context, artifact_ref, actor)
  | conclusion.attach_control_coverage(control_coverage_ref, actor)
  | if submission_intent == SubmitForReview { evidence_ref }:
  |   policy.assert_soa_control_coverage(conclusion, control_coverage_ref)
  |   policy.assert_review_evidence(evidence_ref)
  |   conclusion.submit_for_review(evidence_ref, actor)
  v
[Persistence]
  | compliance_repo.save_soa(conclusion, None, uow)
  | append ComplianceConclusionRecord::from_soa_change(...)
  | append trace/audit/outbox/stale/stored result
  | tx commit
```

```rust
// SoAConclusion::attach_control_coverage(&mut self, ControlCoverageRef coverage_ref, ActorRef actor)
conclusion.attach_control_coverage(control_coverage_ref, actor_ref)?;
```

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| DTO 构造 | 通过 | request provides context/artifact/coverage/submission intent |
| domain method | 通过 | from_artifact/attach_control_coverage/submit_for_review 已定义 |
| port | 通过 | context read and SoA save 已定义 |
| version 来源 | 通过 | new conclusion save uses `None` |
| 副作用 | 通过 | compliance history/trace/outbox/stale/result |
| 禁止事项 | 通过 | coverage ref 不反写 control applicability/review truth |

#### 13.5 `ApproveComplianceConclusionFlow`

| 项目 | 内容 |
|---|---|
| 协议 | `GovernanceCommandRequest<ApproveComplianceConclusionRequest>` |
| 入口函数 | `ControlComplianceService.approve_compliance_conclusion(request, operation_context)` |
| 目标对象 | `AIIAConclusion` or `SoAConclusion` |
| 依赖 port | `ComplianceConclusionRepository`, `GovernanceDecisionRepository`, trace/history/outbox/projection/result |
| 状态变化 | `InReview -> Approved/Rejected`;`Approved/Rejected -> Revoked` |
| history | `ComplianceConclusionRecord` |
| outbound event | `ComplianceConclusionChanged` |
| 测试切口 | union branch explicit; formal decision required; SoA coverage required; revoke preserves original decision; duplicate replay |

```text
[API handler]
  | handle ApproveComplianceConclusion
  v
[ControlComplianceService]
  | tx begin + idempotency reserve
  | conclusion_v = get_aiia_with_version or get_soa_with_version by union branch
  | decision_v = decision_repo.get_with_version(decision_ref)
  v
[Domain]
  | policy = ComplianceConclusionPolicy::for_context(context, evidence_ref, coverage_ref)
  | policy.assert_approval_decision(decision)
  | match approval_intent:
  |   Approve { decision_ref } -> conclusion.approve(decision, actor)
  |   Reject { decision_ref, reason } -> conclusion.reject(decision, reason, actor)
  |   Revoke { decision_ref } -> conclusion.revoke(decision, actor)
  v
[Persistence]
  | compliance_repo.save_aiia or save_soa(conclusion, Some(conclusion_v.version), uow)
  | append ComplianceConclusionRecord::{from_aiia_change|from_soa_change}(...)
  | append trace/audit/outbox/stale/stored result
  | tx commit
```

```rust
// AIIAConclusion::approve(&mut self, GovernanceDecision decision, ActorRef actor)
aiia_conclusion.approve(&decision, actor_ref)?;
```

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| DTO 构造 | 通过 | union conclusion ref and approval intent carry branch and decision |
| domain method | 通过 | approve/reject/revoke methods exist for both AIIA and SoA |
| port | 通过 | compliance union branch reads/saves and decision read are defined |
| version 来源 | 通过 | existing conclusion update uses loaded branch version |
| 副作用 | 通过 | compliance changed history/trace/outbox/stale/result |
| 禁止事项 | 通过 | decision 不替代 evidence;revocation 不覆盖原 decision |

#### 13.6 `RaiseNonconformityFlow`

| 项目 | 内容 |
|---|---|
| 协议 | `GovernanceCommandRequest<RaiseNonconformityRequest>` |
| 入口函数 | `NonconformityService.raise_nonconformity(request, operation_context)` |
| 目标对象 | `NonconformityRecord` |
| 依赖 port | `GovernanceContextRepository`, `NonconformityRepository`, trace/history/outbox/projection/result/id generator |
| 状态变化 | new `Raised` |
| history | `NonconformityChangeRecord` |
| outbound event | `NonconformityChanged` |
| 测试切口 | context ready; source ref body-free; severity non-empty; owner actor stored as ref only; duplicate replay |

```text
[API handler]
  | handle RaiseNonconformity
  v
[NonconformityService]
  | tx begin + idempotency reserve
  | context_v = context_repo.get_with_version(context_ref)
  v
[Domain]
  | GovernanceContextPolicy::for_context(context, reference_state).assert_context_ready(context)
  | record = NonconformityRecord::raise(new_nonconformity_id(), context, severity, source_ref, owner_ref, actor)
  v
[Persistence]
  | nonconformity_repo.save(record, None, uow)
  | append NonconformityChangeRecord::from_nonconformity_change(...)
  | append trace/audit/outbox/stale/stored result
  | tx commit
```

```rust
// NonconformityRecord::raise(NonconformityId nonconformity_id, GovernanceContext context, NonconformitySeverity severity, GovernanceSourceRef source_ref, ActorRef owner_ref, ActorRef actor)
let record = NonconformityRecord::raise(nonconformity_id, &context, severity, source_ref, owner_ref, actor_ref)?;
```

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| DTO 构造 | 通过 | request provides context/severity/source/owner |
| domain method | 通过 | `raise` 已定义 |
| port | 通过 | context read and nonconformity save 已定义 |
| version 来源 | 通过 | new record save uses `None` |
| 副作用 | 通过 | nonconformity history/trace/outbox/stale/result |
| 禁止事项 | 通过 | alert/bug/work blocker 只能作为 source ref |

#### 13.7 `ConfirmNonconformityCauseFlow`

| 项目 | 内容 |
|---|---|
| 协议 | `GovernanceCommandRequest<ConfirmNonconformityCauseRequest>` |
| 入口函数 | `NonconformityService.confirm_nonconformity_cause(request, operation_context)` |
| 目标对象 | `NonconformityRecord` |
| 依赖 port | `NonconformityRepository`, trace/history/outbox/projection/result |
| 状态变化 | `Raised -> CauseConfirmed` |
| history | `NonconformityChangeRecord` |
| outbound event | `NonconformityChanged` |
| 测试切口 | cause ref required; wrong state rejected; expected version; duplicate replay |

```text
[API handler]
  | handle ConfirmNonconformityCause
  v
[NonconformityService]
  | tx begin + idempotency reserve
  | record_v = nonconformity_repo.get_with_version(nonconformity_ref)
  v
[Domain]
  | NonconformityClosurePolicy::for_record(record).assert_can_confirm_cause(record, cause_ref)
  | record.confirm_cause(cause_ref, actor)
  v
[Persistence]
  | nonconformity_repo.save(record, Some(record_v.version), uow)
  | append NonconformityChangeRecord::from_nonconformity_change(...)
  | append trace/audit/outbox/stale/stored result
  | tx commit
```

```rust
// NonconformityRecord::confirm_cause(&mut self, NonconformityCauseRef cause_ref, ActorRef actor)
record.confirm_cause(request.cause_ref, actor_ref)?;
```

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| DTO 构造 | 通过 | request carries nonconformity and cause ref |
| domain method | 通过 | `confirm_cause` and policy guard exist |
| port | 通过 | nonconformity versioned read/save 已定义 |
| version 来源 | 通过 | update uses `record_v.version` |
| 副作用 | 通过 | history/trace/outbox/stale/result |
| 禁止事项 | 通过 | cause ref 不保存 root-cause body |

#### 13.8 `PlanCorrectiveActionFlow`

| 项目 | 内容 |
|---|---|
| 协议 | `GovernanceCommandRequest<PlanCorrectiveActionRequest>` |
| 入口函数 | `NonconformityService.plan_corrective_action(request, operation_context)` |
| 目标对象 | `CorrectiveAction`, `NonconformityRecord` |
| 依赖 port | `NonconformityRepository`, `CorrectiveActionRepository`, trace/history/outbox/projection/result/id generator |
| 状态变化 | action new `Planned`;record `CauseConfirmed/Reopened -> Correcting` via `start_correction(...)` |
| history | `NonconformityChangeRecord` |
| outbound event | `NonconformityChanged` |
| 测试切口 | record can start correction; optional work ref body-free; action belongs to record; record update uses version; duplicate replay |

```text
[API handler]
  | handle PlanCorrectiveAction
  v
[NonconformityService]
  | tx begin + idempotency reserve
  | record_v = nonconformity_repo.get_with_version(nonconformity_ref)
  v
[Domain]
  | action = CorrectiveAction::plan(new_corrective_action_id(), record, owner_ref, work_ref, actor)
  | NonconformityClosurePolicy::for_record(record).assert_can_start_correction(record, action)
  | record.start_correction(action, actor)
  v
[Persistence]
  | corrective_repo.save_action(action, None, uow)
  | nonconformity_repo.save(record, Some(record_v.version), uow)
  | append NonconformityChangeRecord for action and record
  | append trace/audit/outbox/stale/stored result
  | tx commit
```

```rust
// CorrectiveAction::plan(CorrectiveActionId action_id, NonconformityRecord record, ActorRef owner_ref, Option<WorkGovernanceContextRef> work_ref, ActorRef actor)
let action = CorrectiveAction::plan(action_id, &record, owner_ref, work_ref, actor_ref)?;
```

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| DTO 构造 | 通过 | request provides nonconformity/owner/optional work ref |
| domain method | 通过 | action plan and record start_correction 已定义 |
| port | 通过 | nonconformity read/save and corrective save_action 已定义 |
| version 来源 | 通过 | new action uses `None`; record update uses `record_v.version` |
| 副作用 | 通过 | action + record history/trace/outbox/stale/result |
| 禁止事项 | 通过 | Work ref 不替代 WorkItem or action state |

#### 13.9 `CompleteCorrectiveActionFlow`

| 项目 | 内容 |
|---|---|
| 协议 | `GovernanceCommandRequest<CompleteCorrectiveActionRequest>` |
| 入口函数 | `NonconformityService.complete_corrective_action(request, operation_context)` |
| 目标对象 | `CorrectiveAction`, optional `NonconformityRecord` |
| 依赖 port | `CorrectiveActionRepository`, `NonconformityRepository`, trace/history/outbox/projection/result |
| 状态变化 | action `Planned -> InProgress`;`InProgress -> Completed/Cancelled/Failed`;if completed, record `Correcting -> ReadyForVerification` |
| history | `NonconformityChangeRecord` |
| outbound event | `NonconformityChanged` |
| 测试切口 | completed does not close record; complete requires evidence; cancel/fail reason; ready-for-verification only after completed action |

```text
[API handler]
  | handle CompleteCorrectiveAction
  v
[NonconformityService]
  | tx begin + idempotency reserve
  | action_v = corrective_repo.get_action_with_version(action_ref)
  | record_v = nonconformity_repo.get_with_version(action.nonconformity_ref)
  v
[Domain]
  | match update_intent:
  |   Start -> action.start(actor)
  |   Complete { evidence_ref } -> action.complete(evidence_ref, actor)
  |   Cancel { reason } -> action.cancel(reason, actor)
  |   Fail { reason } -> action.fail(reason, actor)
  | if action completed:
  |   NonconformityClosurePolicy::for_record(record).assert_can_enter_verification(record, action)
  |   record.mark_ready_for_verification(actor)
  v
[Persistence]
  | corrective_repo.save_action(action, Some(action_v.version), uow)
  | nonconformity_repo.save(record, Some(record_v.version), uow) when changed
  | append NonconformityChangeRecord for action and optional record
  | append trace/audit/outbox/stale/stored result
  | tx commit
```

```rust
// CorrectiveAction::complete(&mut self, EvidenceSummaryRef evidence_ref, ActorRef actor)
action.complete(evidence_ref, actor_ref)?;
```

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| DTO 构造 | 通过 | intent enum carries evidence/reason when required |
| domain method | 通过 | action start/complete/cancel/fail and record ready-for-verification 已定义 |
| port | 通过 | action and record versioned read/save 已定义 |
| version 来源 | 通过 | both updates use loaded versions |
| 副作用 | 通过 | action/record history/trace/outbox/stale/result |
| 禁止事项 | 通过 | completed action 不自动关闭 nonconformity |

#### 13.10 `VerifyNonconformityFlow`

| 项目 | 内容 |
|---|---|
| 协议 | `GovernanceCommandRequest<VerifyNonconformityRequest>` |
| 入口函数 | `NonconformityService.verify_nonconformity(request, operation_context)` |
| 目标对象 | `VerificationResult`, `NonconformityRecord` |
| 依赖 port | `NonconformityRepository`, `CorrectiveActionRepository`, trace/history/outbox/projection/result/id generator |
| 状态变化 | new verification result;when `Passed`, record `ReadyForVerification -> Closed`;failed/inconclusive do not close |
| history | `NonconformityChangeRecord` |
| outbound event | `NonconformityChanged` |
| 测试切口 | passed closes record; failed/inconclusive not closed; evidence body excluded; result immutable; duplicate replay |

```text
[API handler]
  | handle VerifyNonconformity
  v
[NonconformityService]
  | tx begin + idempotency reserve
  | record_v = nonconformity_repo.get_with_version(nonconformity_ref)
  v
[Domain]
  | result = VerificationResult::from_evidence(new_verification_result_id(), record, evidence_ref, verifier_ref, verification_state)
  | if result.is_passed():
  |   NonconformityClosurePolicy::for_record(record).assert_can_close(record, result)
  |   record.close(result, actor)
  | else:
  |   do not close; report failed/inconclusive in result surface
  v
[Persistence]
  | corrective_repo.save_verification(result, None, uow)
  | nonconformity_repo.save(record, Some(record_v.version), uow) when passed
  | append NonconformityChangeRecord for verification and optional closure
  | append trace/audit/outbox/stale/stored result
  | tx commit
```

```rust
// VerificationResult::from_evidence(VerificationResultId verification_id, NonconformityRecord nonconformity, EvidenceSummaryRef evidence_ref, ActorRef verifier_ref, VerificationState state)
let result = VerificationResult::from_evidence(verification_id, &record, evidence_ref, verifier_ref, verification_state)?;
```

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| DTO 构造 | 通过 | request provides nonconformity/evidence/state/verifier |
| domain method | 通过 | verification factory and record close 已定义 |
| port | 通过 | nonconformity read/save and verification save 已定义 |
| version 来源 | 通过 | new verification uses `None`; passed closure uses `record_v.version` |
| 副作用 | 通过 | verification/closure history/trace/outbox/stale/result |
| 禁止事项 | 通过 | failed/inconclusive verification cannot close record |

#### 13.11 9.1-c stop-review

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 10 个 request DTO 是否都有 flow | 通过 | control 2 条、compliance 3 条、nonconformity/corrective 5 条已覆盖 |
| Step 6 domain method 是否存在 | 通过 | control、review、AIIA、SoA、nonconformity、action、verification 方法均已定义 |
| Step 7 port 是否足够 | 通过 | control/compliance/nonconformity/corrective repositories 均有 versioned read/save |
| version 来源是否闭合 | 通过 | new object uses `None`; existing mutable truth uses `get_*_with_version` |
| outbox / stale | 通过 | accepted truth change maps to formal outbound event and affected views repository |
| phase boundary | 通过 | 未保存 artifact/evidence/work/control body;未让 corrective/job/query 修复 truth |

---

### 14. Query flow batch 9.2-a: truth and simple read flows

#### 14.1 Shared authorized query flow

所有 query flow 必须先映射 `GovernanceReadSubjectRef` 和 `GovernanceScopeRef`,再调用 `ReadVisibilityPolicy.evaluate_*`。visibility denied 时返回 `GovernanceViewSurface.visibility.is_visible = false` 且 `body = None`;不得抛普通 authorization error,也不得在 denied path 暴露对象正文或敏感 summary。

```text
[API handler]
  | handle GovernanceQueryRequest<T>
  v
[AuthorizedGovernanceQueryService]
  | build operation context with channel Query
  | operation_context.assert_query_no_write()
  | map request -> GovernanceReadSubjectRef + GovernanceScopeRef
  | optional actor snapshot read through ReferenceSnapshotRepository when policy needs it
  | visibility = ReadVisibilityPolicy::for_actor(actor, scope, subject).evaluate_*(...)
  | if !visibility.is_visible -> return response body None
  v
[Read repositories]
  | load truth / projection / trace / report body
  | load view state when freshness is relevant
  v
[Assembler]
  | build GovernanceViewSurface
  | return GovernanceQueryResponse or GovernancePageResponse
```

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| query no-write | 通过 | 不 reserve idempotency,不开写事务,不调用 save/append/mark_stale |
| denied surface | 通过 | visibility marker carries not-visible;body empty |
| degraded/freshness | 通过 | projection-backed reads attach view state,truth reads may attach reference degraded marker |
| body boundary | 通过 | all views expose refs/state/surface only |

#### 14.2 `GetGovernanceContextFlow`

| 项目 | 内容 |
|---|---|
| 协议 | `GovernanceQueryRequest<GetGovernanceContextRequest>` |
| 入口函数 | `AuthorizedGovernanceQueryService.get_governance_context(request, operation_context)` |
| 依赖 port | `GovernanceContextRepository`, optional `ReferenceSnapshotRepository` |
| response | `GovernanceQueryResponse<GovernanceContextView>` |
| 测试切口 | visible success; not visible body none; missing context degraded; no-write assertion |

```text
[QueryService]
  | operation_context.assert_query_no_write()
  | context_v = context_repo.get_with_version(context_ref)
  | visibility = ReadVisibilityPolicy.evaluate_read_subject(context read subject, actor_snapshot)
  | if denied -> body None
  | else assemble GovernanceContextView from loaded context + pending reference state
```

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| DTO / view | 通过 | request has context_ref; view fields map to `GovernanceContext` |
| port | 通过 | context versioned read exists |
| write safety | 通过 | no write port used |
| visibility | 通过 | denied marker body-free |

#### 14.3 `GetGovernanceInputFlow`

| 项目 | 内容 |
|---|---|
| 协议 | `GovernanceQueryRequest<GetGovernanceInputRequest>` |
| 入口函数 | `AuthorizedGovernanceQueryService.get_governance_input(request, operation_context)` |
| 依赖 port | `GovernanceInputRepository`, optional `GovernanceContextRepository` for read subject mapping |
| response | `GovernanceQueryResponse<GovernanceInputView>` |
| 测试切口 | visible success; missing input degraded; pending evidence ref body-free; no-write |

```text
[QueryService]
  | input_v = input_repo.get_with_version(input_ref)
  | map input.context_ref -> read subject
  | visibility = ReadVisibilityPolicy.evaluate_read_subject(...)
  | if visible -> assemble GovernanceInputView from input
```

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| DTO / view | 通过 | request input_ref maps to input view fields |
| port | 通过 | input versioned read exists |
| write safety | 通过 | no save/append/mark call |
| body boundary | 通过 | evidence/source body excluded |

#### 14.4 `GetGateDecisionFlow`

| 项目 | 内容 |
|---|---|
| 协议 | `GovernanceQueryRequest<GetGateDecisionRequest>` |
| 入口函数 | `AuthorizedGovernanceQueryService.get_gate_decision(request, operation_context)` |
| 依赖 port | `GateRepository`, `GovernanceDecisionRepository`, `GovernanceProjectionRepository` |
| response | `GovernanceQueryResponse<DecisionSummaryView>` |
| 测试切口 | exactly one of gate/decision ref; current decision by gate; visibility denied; stale summary marker |

```text
[QueryService]
  | validate exactly one of gate_ref / decision_ref
  | if gate_ref -> gate_v = gate_repo.get_with_version(gate_ref); decision_v = decision_repo.find_current_by_gate(gate_ref)
  | if decision_ref -> decision_v = decision_repo.get_with_version(decision_ref); gate_v = gate_repo.get_with_version(decision.gate_ref)
  | visibility = ReadVisibilityPolicy.evaluate_can_read_decision(decision_ref, read_subject, actor_snapshot)
  | if visible -> assemble or load DecisionSummaryView
  | attach freshness from projection state when projection summary is used
```

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| DTO / view | 通过 | Step 8 enforces gate-or-decision lookup shape |
| port | 通过 | gate/decision reads and projection summary reads exist |
| write safety | 通过 | query does not repair stale summary |
| visibility | 通过 | decision denied returns marker body none |

#### 14.5 `GetApprovalResponsibilityFlow`

| 项目 | 内容 |
|---|---|
| 协议 | `GovernanceQueryRequest<GetApprovalResponsibilityRequest>` |
| 入口函数 | `AuthorizedGovernanceQueryService.get_approval_responsibility(request, operation_context)` |
| 依赖 port | `ApprovalResponsibilityRepository`, `ResponsibilityChainRepository`, `ReferenceSnapshotRepository` |
| response | `GovernanceQueryResponse<ApprovalResponsibilityView>` |
| 测试切口 | by responsibility ref; by context active chain; actor snapshot optional degraded; no identity body |

```text
[QueryService]
  | validate responsibility_ref or context_ref
  | responsibility_v = responsibility_repo.get_with_version(ref) or list_by_context(context_ref, page).first_visible
  | chain_v = chain_repo.find_by_context(responsibility.context_ref)
  | actor_snapshot = reference_repo.get_reference_state_with_version(actor external ref) when actor_ref exists and available
  | visibility = ReadVisibilityPolicy.evaluate_read_subject(...)
  | assemble ApprovalResponsibilityView
```

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| DTO / view | 通过 | responsibility/context filters map to view fields |
| port | 通过 | responsibility list/get and chain find exist |
| write safety | 通过 | no snapshot refresh; stale snapshot only degraded |
| body boundary | 通过 | actor profile/credential body excluded |

#### 14.6 `GetPolicyConflictFlow`

| 项目 | 内容 |
|---|---|
| 协议 | `GovernanceQueryRequest<GetPolicyConflictRequest>` |
| 入口函数 | `AuthorizedGovernanceQueryService.get_policy_conflict(request, operation_context)` |
| 依赖 port | `PolicyConflictRepository` |
| response | `GovernanceQueryResponse<PolicyConflictView>` |
| 测试切口 | visible conflict view; missing conflict degraded; no policy/rule body |

```text
[QueryService]
  | conflict_v = conflict_repo.get_with_version(conflict_ref)
  | visibility = ReadVisibilityPolicy.evaluate_read_subject(conflict read subject, actor_snapshot)
  | if visible -> assemble PolicyConflictView from conflict
```

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| DTO / view | 通过 | conflict fields map to `PolicyConflictRecord` |
| port | 通过 | conflict versioned read exists |
| write safety | 通过 | conflict query does not resolve/invalidate conflict |
| body boundary | 通过 | policy/rule body excluded |

#### 14.7 `GetComplianceConclusionFlow`

| 项目 | 内容 |
|---|---|
| 协议 | `GovernanceQueryRequest<GetComplianceConclusionRequest>` |
| 入口函数 | `AuthorizedGovernanceQueryService.get_compliance_conclusion(request, operation_context)` |
| 依赖 port | `ComplianceConclusionRepository` |
| response | `GovernanceQueryResponse<ComplianceConclusionView>` |
| 测试切口 | AIIA branch; SoA branch; not visible; no artifact body |

```text
[QueryService]
  | match conclusion_ref:
  |   AIIA(ref) -> aiia_v = compliance_repo.get_aiia_with_version(ref)
  |   SoA(ref) -> soa_v = compliance_repo.get_soa_with_version(ref)
  | visibility = ReadVisibilityPolicy.evaluate_can_read_compliance(conclusion_ref, read_subject, actor_snapshot)
  | if visible -> assemble ComplianceConclusionView preserving union branch
```

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| DTO / view | 通过 | union ref preserved; view fields map to AIIA/SoA |
| port | 通过 | branch-specific versioned reads exist |
| write safety | 通过 | query does not approve/revoke conclusion |
| body boundary | 通过 | artifact/AIIA/SoA body excluded |

#### 14.8 9.2-a stop-review

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 7 个 simple query 是否覆盖 | 通过 | context/input/gate-decision/approval/conflict/compliance 已覆盖;policy/control/nonconformity projection queries 在 9.2-b |
| read-only 是否闭合 | 通过 | 未使用 write transaction、save、append、mark stale |
| visibility marker 是否闭合 | 通过 | denied path body none + visibility marker |
| projection read 缺口 | 已修正 | Step 7 已补 projection view body read ports |

### 15. Query flow batch 9.2-b: projection / search / trace / report flows

#### 15.1 `ListPendingGovernanceDecisionsFlow`

| 项目 | 内容 |
|---|---|
| 协议 | `GovernanceQueryRequest<ListPendingGovernanceDecisionsRequest>` |
| 入口函数 | `AuthorizedGovernanceQueryService.list_pending_governance_decisions(request, operation_context)` |
| 依赖 port | `GovernanceProjectionRepository`, optional `GateRepository` / `GovernanceDecisionRepository` for fallback only when projection missing is explicitly allowed |
| response | `GovernancePageResponse<DecisionSummaryView>` |
| 测试切口 | scope filter; context filter; stale page surface; not visible items redacted; no repair |

```text
[QueryService]
  | operation_context.assert_query_no_write()
  | views = projection_repo.list_pending_decision_summary_views(context_ref, scope_ref, page)
  | for each view:
  |   visibility = ReadVisibilityPolicy.evaluate_can_read_decision(view.decision_ref, read_subject, actor_snapshot)
  |   if denied -> omit or redacted item per page policy
  | return page with GovernanceViewSurface
```

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| DTO / page | 通过 | request has optional scope/context and page |
| port | 通过 | Step 7 `list_pending_decision_summary_views` 已补 |
| write safety | 通过 | stale projection does not trigger rebuild |
| visibility | 通过 | item-level denied does not leak body |

#### 15.2 `GetPolicyEffectiveViewFlow`

| 项目 | 内容 |
|---|---|
| 协议 | `GovernanceQueryRequest<GetPolicyEffectiveViewRequest>` |
| 入口函数 | `AuthorizedGovernanceQueryService.get_policy_effective_view(request, operation_context)` |
| 依赖 port | `GovernanceProjectionRepository` |
| response | `GovernanceQueryResponse<PolicyEffectiveView>` |
| 测试切口 | view read by stable ref/index; stale marker; not visible; no policy body |

```text
[QueryService]
  | map scope_ref -> stable PolicyEffectiveViewRef through projection index
  | view = projection_repo.get_policy_effective_view(view_ref)
  | state = projection_repo.get_state_with_version(view.view_ref)
  | visibility = ReadVisibilityPolicy.evaluate_can_read_policy(..., read_subject, actor_snapshot)
  | assemble surface with freshness from state
```

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| DTO / view | 通过 | scope maps to policy effective view |
| port | 通过 | `get_policy_effective_view` and state read exist |
| write safety | 通过 | query does not rebuild stale policy view |
| body boundary | 通过 | policy/rule body excluded |

#### 15.3 `GetControlCoverageFlow`

| 项目 | 内容 |
|---|---|
| 协议 | `GovernanceQueryRequest<GetControlCoverageRequest>` |
| 入口函数 | `AuthorizedGovernanceQueryService.get_control_coverage(request, operation_context)` |
| 依赖 port | `GovernanceProjectionRepository` |
| response | `GovernanceQueryResponse<ControlCoverageView>` |
| 测试切口 | coverage view visible; stale/degraded; missing view; no control definition body |

```text
[QueryService]
  | map context_ref -> stable ControlCoverageViewRef through projection index
  | view = projection_repo.get_control_coverage_view(view_ref)
  | state = projection_repo.get_state_with_version(view.view_ref)
  | visibility = ReadVisibilityPolicy.evaluate_read_subject(context read subject, actor_snapshot)
  | assemble surface with freshness/degraded
```

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| DTO / view | 通过 | context ref maps to coverage view |
| port | 通过 | `get_control_coverage_view` exists |
| write safety | 通过 | query does not plan review or assess control |
| body boundary | 通过 | control/evidence/artifact body excluded |

#### 15.4 `GetNonconformityStatusFlow`

| 项目 | 内容 |
|---|---|
| 协议 | `GovernanceQueryRequest<GetNonconformityStatusRequest>` |
| 入口函数 | `AuthorizedGovernanceQueryService.get_nonconformity_status(request, operation_context)` |
| 依赖 port | `GovernanceProjectionRepository`, optional `NonconformityRepository` for missing projection degraded detail |
| response | `GovernanceQueryResponse<NonconformityStatusView>` |
| 测试切口 | status view visible; missing projection degraded; no closure; no work/evidence body |

```text
[QueryService]
  | map nonconformity_ref -> stable NonconformityStatusViewRef through projection index
  | view = projection_repo.get_nonconformity_status_view(view_ref)
  | state = projection_repo.get_state_with_version(view.view_ref)
  | visibility = ReadVisibilityPolicy.evaluate_read_subject(nonconformity read subject, actor_snapshot)
  | assemble view surface
```

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| DTO / view | 通过 | nonconformity ref maps to status view |
| port | 通过 | `get_nonconformity_status_view` exists |
| write safety | 通过 | query cannot close/reopen nonconformity |
| body boundary | 通过 | corrective work/evidence body excluded |

#### 15.5 `SearchGovernanceFactsFlow`

| 项目 | 内容 |
|---|---|
| 协议 | `GovernanceQueryRequest<SearchGovernanceFactsRequest>` |
| 入口函数 | `AuthorizedGovernanceQueryService.search_governance_facts(request, operation_context)` |
| 依赖 port | `GovernanceProjectionRepository` |
| response | `GovernancePageResponse<GovernanceFactSearchResultItem>` |
| 测试切口 | scope/fact/read subject filters; page cursor; item visibility; no search-highlight body |

```text
[QueryService]
  | search_page = projection_repo.search_governance_facts(scope_ref, fact_kind, read_subject_ref, page)
  | for each item:
  |   visibility = ReadVisibilityPolicy.evaluate_read_subject(item.read_subject_ref, actor_snapshot)
  |   denied item omitted or body-free redacted per page policy
  | return GovernancePageResponse with page_info
```

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| DTO / page | 通过 | filters and page helper are public DTOs |
| port | 通过 | `search_governance_facts` exists |
| write safety | 通过 | no index rebuild/refresh in query |
| body boundary | 通过 | search item contains ref/kind/surface only |

#### 15.6 `GetGovernanceTraceFlow`

| 项目 | 内容 |
|---|---|
| 协议 | `GovernanceQueryRequest<GetGovernanceTraceRequest>` |
| 入口函数 | `AuthorizedGovernanceQueryService.get_governance_trace(request, operation_context)` |
| 依赖 port | `GovernanceTraceRepository` |
| response | `GovernancePageResponse<GovernanceTraceRecordView>` |
| 测试切口 | subject trace page; trace kind filter; not visible trace item; no trace append |

```text
[QueryService]
  | traces = trace_repo.list_by_subject(subject_ref, page)
  | filter trace_kind in memory only if repository has no typed filter
  | for each trace:
  |   visibility = ReadVisibilityPolicy.evaluate_can_read_trace(trace, actor_snapshot)
  | assemble GovernanceTraceRecordView items
```

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| DTO / page | 通过 | request has subject/kind/page |
| port | 通过 | `list_by_subject` exists |
| write safety | 通过 | query does not append missing trace or repair audit |
| body boundary | 通过 | trace view excludes command/event payload body |

#### 15.7 `GetGovernanceDashboardFlow`

| 项目 | 内容 |
|---|---|
| 协议 | `GovernanceQueryRequest<GetGovernanceDashboardRequest>` |
| 入口函数 | `AuthorizedGovernanceQueryService.get_governance_dashboard(request, operation_context)` |
| 依赖 port | `GovernanceProjectionRepository` |
| response | `GovernanceQueryResponse<GovernanceDashboardView>` |
| 测试切口 | scope dashboard visible; stale surface; missing projection degraded; no truth repair |

```text
[QueryService]
  | map scope_ref -> stable DerivedGovernanceViewRef for dashboard through projection index
  | view = projection_repo.get_dashboard_view(view_ref)
  | state = projection_repo.get_state_with_version(view.view_ref)
  | visibility = ReadVisibilityPolicy.evaluate_read_subject(scope read subject, actor_snapshot)
  | assemble dashboard response surface
```

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| DTO / view | 通过 | scope maps to dashboard view |
| port | 通过 | `get_dashboard_view` exists |
| write safety | 通过 | query does not rebuild dashboard |
| body boundary | 通过 | dashboard contains ref sets only |

#### 15.8 `GetGovernanceReconciliationReportFlow`

| 项目 | 内容 |
|---|---|
| 协议 | `GovernanceQueryRequest<GetGovernanceReconciliationReportRequest>` |
| 入口函数 | `AuthorizedGovernanceQueryService.get_governance_reconciliation_report(request, operation_context)` |
| 依赖 port | `GovernanceReconciliationReportRepository` |
| response | `GovernanceQueryResponse<GovernanceReconciliationReportView>` |
| 测试切口 | by report ref; latest by scope; both missing rejected; not visible report body none; no reconciliation run |

```text
[QueryService]
  | validate one of report_ref or scope_ref
  | if report_ref -> report = report_repo.get(report_ref)
  | if scope_ref -> report = report_repo.find_latest_by_scope(scope_ref)
  | visibility = ReadVisibilityPolicy.evaluate_read_subject(report read subject, actor_snapshot)
  | if denied -> body None
  | else assemble GovernanceReconciliationReportView
```

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| DTO / view | 通过 | report ref/latest scope shape is explicit |
| port | 通过 | Step 7 report repository get/latest read 已补 |
| write safety | 通过 | query does not run reconciliation or save report |
| body boundary | 通过 | not visible report body empty |

#### 15.9 9.2-b stop-review

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 7 个 projection/search/trace/report query 是否覆盖 | 通过 | pending decisions、policy、control、nonconformity、search、trace、dashboard、report 已覆盖 |
| Step 7 port 是否足够 | 通过 | projection view body read、search page、report repo 已补齐 |
| read-only 是否闭合 | 通过 | no save/append/mark/rebuild/refresh |
| degraded/freshness 是否闭合 | 通过 | projection-backed query 读取 view state 并组装 surface |
| phase boundary | 通过 | 不把 query 当 maintenance job,不创建 truth/outbox/trace |

---

### 16. Inbound consumer flow batch 9.3

#### 16.1 Shared consumer accepted flow

| 步骤 | 正式契约 | 说明 |
|---|---|---|
| envelope validation | `GovernanceInboundEventEnvelope<T>` | source family、source event、source ref、version、dedup、trace 必填 |
| supported version | `GovernanceEventSchemaVersion("v1")` | unsupported version 不解析 payload、不写 snapshot、不 mark stale |
| idempotency | `GovernanceIdempotencyRepository.reserve(...)` | duplicate 返回 `StoredGovernanceResultRepository.get_consumer_receipt(...)` |
| reference update | `ReferenceSnapshotRepository.save_*` / `save_reference_state(...)` | 只保存 body-free snapshot/ref/state |
| stale marker | `GovernanceProjectionRepository.list_views_affected_by_references(...)` | affected views 不临时拼接 |
| receipt | `GovernanceInboundEventReceipt` + stored result | accepted/duplicate/delayed/rejected/unsupported 均有 public receipt |

```text
[Worker entry]
  | validate envelope
  | if event_version != v1 -> return UnsupportedVersion receipt
  v
[GovernanceConsumerService]
  | tx begin + idempotency reserve
  | duplicate -> rollback, load stored consumer receipt, return replay
  | validate body-free payload
  | save snapshot/ref/reference state
  | affected = projection_repo.list_views_affected_by_references(reference_refs, page)
  | projection_repo.mark_stale(affected, current_cursor, uow)
  | optional GovernanceTraceRecord::from_marker(...)
  | save stored consumer receipt
  | complete idempotency
  | tx commit
```

#### 16.2 Consumer flow table

| Flow | Payload | save target | reference source | affected views | trace marker |
|---|---|---|---|---|---|
| `ConsumeIdentityActorCapabilityChangedFlow` | `IdentityActorCapabilityChangedPayload` | `save_actor_capability_snapshot` | `payload.actor_snapshot.snapshot_state` | `list_views_affected_by_references(actor ref)` | yes |
| `ConsumeProcessGovernanceContextChangedFlow` | `ProcessGovernanceContextChangedPayload` | `save_process_context_ref` | `payload.process_context_ref.snapshot_state` | process/context reference affected views | yes |
| `ConsumeWorkGovernanceContextChangedFlow` | `WorkGovernanceContextChangedPayload` | `save_work_context_ref` | `payload.work_context_ref.snapshot_state` | work/context reference affected views | yes |
| `ConsumeArtifactEvidenceChangedFlow` | `ArtifactEvidenceChangedPayload` | `save_evidence_summary_ref` + reference state | envelope source ref/version | compliance/control affected views | yes |
| `ConsumeMethodPolicyDefinitionChangedFlow` | `MethodPolicyDefinitionChangedPayload` | `save_method_policy_snapshot` | `payload.policy_snapshot.snapshot_state` | policy affected views | yes |
| `ConsumeMethodControlDefinitionChangedFlow` | `MethodControlDefinitionChangedPayload` | `save_method_control_snapshot` | `payload.control_snapshot.snapshot_state` | control coverage affected views | yes |
| `ConsumeRuntimeSignalRecordedFlow` | `RuntimeSignalRecordedPayload` | `save_runtime_signal_ref` + optional source reference state | `payload.runtime_signal_ref.signal_state` | context/dashboard affected views | yes |
| `ConsumeConversationContextChangedFlow` | `ConversationContextChangedPayload` | `save_reference_state` for source ref | envelope source ref/version | trace/decision affected views | yes |
| `ConsumeObservabilityAlertRaisedFlow` | `ObservabilityAlertRaisedPayload` | `save_reference_state` + optional `save_runtime_signal_ref` | payload runtime signal or envelope source | nonconformity/dashboard affected views | yes |

#### 16.3 Per-consumer function sketches

```rust
// ReferenceSnapshotRepository::save_actor_capability_snapshot(ActorCapabilitySnapshot snapshot, Option<GovernanceVersion> expected_version, GovernanceUnitOfWork uow)
reference_repo.save_actor_capability_snapshot(snapshot, expected_version, uow).await?;
```

| Flow | Function-level sequence | Rejected / delayed conditions |
|---|---|---|
| `ConsumeIdentityActorCapabilityChangedFlow` | reserve dedup; read current reference state version; save actor snapshot; save reference state; stale affected views; store receipt | unsupported schema; actor snapshot contains body; unresolved actor ref may delayed |
| `ConsumeProcessGovernanceContextChangedFlow` | reserve dedup; save process context ref; save reference state; stale affected views; trace marker; receipt | process payload body present; source unavailable |
| `ConsumeWorkGovernanceContextChangedFlow` | reserve dedup; save work context ref; save reference state; stale affected views; trace marker; receipt | work body present; invalid project/work refs |
| `ConsumeArtifactEvidenceChangedFlow` | reserve dedup; save evidence summary ref; save reference state from envelope; stale compliance/control views; receipt | evidence/artifact body present; missing evidence ref |
| `ConsumeMethodPolicyDefinitionChangedFlow` | reserve dedup; save method policy snapshot; save reference state; stale policy views; receipt | AIPolicyDef body present; unsupported method version |
| `ConsumeMethodControlDefinitionChangedFlow` | reserve dedup; save method control snapshot; save reference state; stale control views; receipt | control definition body present; invalid control snapshot |
| `ConsumeRuntimeSignalRecordedFlow` | reserve dedup; save runtime signal ref; save optional source reference state; stale context/dashboard views; receipt | runtime log body present; missing signal state |
| `ConsumeConversationContextChangedFlow` | reserve dedup; save source reference state; stale trace/decision views; receipt | message transcript present; source ref missing |
| `ConsumeObservabilityAlertRaisedFlow` | reserve dedup; save source reference state; optional runtime signal ref; stale nonconformity/dashboard views; receipt | alert body/stack trace present; invalid severity marker |

#### 16.4 Consumer stop-review

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 9 个 inbound consumer 是否覆盖 | 通过 | Step 8 §10.6 全部列入 flow table |
| core truth 是否会被 consumer 写入 | 通过 | 只写 reference/snapshot/stale/receipt/trace marker |
| version 来源 | 通过 | reference update uses `get_reference_state_with_version` 或 new upsert `None` 语义;具体 persistence retry 留 Step 11/13 |
| affected views | 通过 | only `list_views_affected_by_references(...)` |
| duplicate replay | 通过 | stored consumer receipt,不重跑 mutation |
| unsupported version | 通过 | 不解析 payload、不写 snapshot、不 mark stale |

---

### 17. Outbound event append / publish batch 9.4

本批闭合 accepted command 如何追加 outbox record、如何生成 stored outbound payload snapshot,以及 `PublishGovernanceOutboxFlow` 如何只发布 stored snapshot。任何 publisher、worker 或 retry path 都不得回查 current truth 重新构造 event payload。

#### 17.1 Accepted command outbox append helper

所有 command accepted path 在 truth save 进入同一 UoW 且 `assign_truth_change_cursor()` 返回 accepted boundary cursor 后,必须按同一 helper 追加 outbox。若一个 command 同时改变多个 truth subject,必须为每个 formal `GovernanceTruthChange` 追加独立 outbox record 和独立 payload snapshot,但这些 change 复用同一个 command boundary `source_cursor`。

```text
[Command accepted transaction]
  | all truth objects saved with expected_version
  | subject_ref = GovernanceTruthChangeSubjectMapper.<subject>(changed_truth.to_ref())
  | source_cursor = uow.assign_truth_change_cursor()
  | change = GovernanceTruthChange { subject_ref, event_kind, source_cursor }
  | history/audit append or save complete
  | trace = GovernanceTraceRecord::from_truth_change(new_trace_id(), change, trace_kind, core_trace_id)
  | trace_ref = trace_repo.append(trace, uow)
  v
[Outbox append helper]
  | outbox_id = id_generator.new_outbox_id()
  | outbox_record = GovernanceOutboxRecord::from_truth_change(outbox_id, change, trace_ref)
  | subject_ref = change.subject_ref
  | topic_key = GovernanceOutboundTopicMap.topic_for(change.event_kind)
  | payload = build_outbound_payload(change, committed_source, trace_ref)
  | envelope = GovernanceOutboundEventEnvelope { event_kind, outbox_ref, subject_ref, version v1, cursor, core_trace_id, topic_key, payload }
  | snapshot_ref = id_generator.new_outbox_payload_snapshot_ref()
  | payload_snapshot = GovernanceOutboundPayloadSnapshotBuilder::build(snapshot_ref, envelope)
  | outbox_repo.append(outbox_record, payload_snapshot, uow)
```

```rust
// GovernanceOutboxRecord::from_truth_change(GovernanceOutboxId outbox_id, GovernanceTruthChange change, GovernanceTraceRecordRef trace_ref)
let record = GovernanceOutboxRecord::from_truth_change(outbox_id, &change, trace_ref)?;
```

| 审查项 | 规则 |
|---|---|
| source object | payload builder 只能读取本 command transaction 已保存 / 已加载的 committed source object 或 source ref summary |
| event kind | 必须来自 `GovernanceTruthChange.event_kind`,不得由 publisher 再推断 |
| snapshot storage | `GovernanceOutboxRepository.append(record, payload_snapshot, uow)` 同事务保存 record 和 snapshot |
| schema version | P0 固定 `GovernanceEventSchemaVersion("v1")` |
| trace | envelope 必须携带同事务 `trace_ref` 或 core `TraceId`;outbox 不反向生成 trace |
| rollback | outbox append 失败导致 command transaction 回滚;publish 失败不得回滚 command truth |

#### 17.2 Truth outbound payload mapping

| Event kind | Payload | Source object / source summary | Triggering command flows | Required source fields |
|---|---|---|---|---|
| `GovernanceContextChanged` | `GovernanceContextChangedPayload` | saved `GovernanceContext` and optional saved `GovernanceInput` | create context、submit input、update input state | context ref/state, optional input ref/state, subject ref, cursor |
| `GateChanged` | `GateChangedPayload` | saved `Gate` and optional `ApprovalResponsibility` / `GovernanceDecision` ref | open gate、record decision | gate ref/state, context ref, required responsibility, decision ref, cursor |
| `GovernanceDecisionChanged` | `GovernanceDecisionChangedPayload` | saved `GovernanceDecision` | record decision、supersede decision | decision ref, gate ref, decision state, outcome ref, basis ref, cursor |
| `ApprovalResponsibilityChanged` | `ApprovalResponsibilityChangedPayload` | saved `ApprovalResponsibility` and optional `ResponsibilityChain` | assign responsibility、record vote、delegate | responsibility ref/state, chain ref, context ref, actor ref, vote, cursor |
| `PolicyEffectiveFactChanged` | `PolicyEffectiveFactChangedPayload` | saved `PolicyEffectiveFact` | activate/update policy fact | policy fact ref, scope ref, state, method policy snapshot, cursor |
| `SharedRuleSetChanged` | `SharedRuleSetChangedPayload` | saved `SharedRuleSet` | update shared rule set | rule set ref, scope ref, state, rule refs, cursor |
| `PolicyConflictChanged` | `PolicyConflictChangedPayload` | saved `PolicyConflictRecord` | activate/update policy, update shared rule set, resolve conflict | conflict ref/state, scope, policy refs, optional decision, cursor |
| `ControlApplicabilityChanged` | `ControlApplicabilityChangedPayload` | saved `ControlApplicability` or `ControlReview` linked to applicability | assess applicability、record review | applicability ref/state, context, method control snapshot, basis ref, cursor |
| `ComplianceConclusionChanged` | `ComplianceConclusionChangedPayload` | saved `AIIAConclusion` or `SoAConclusion` | submit/approve compliance conclusion | conclusion ref/state, context, artifact ref, decision ref, coverage ref, cursor |
| `NonconformityChanged` | `NonconformityChangedPayload` | saved `NonconformityRecord`, optional `CorrectiveAction` / `VerificationResult` | raise/confirm/plan/complete/verify nonconformity | nonconformity ref/state, context, active action ref, verification ref, cursor |

| 反例 | 违反点 |
|---|---|
| publisher 根据 `outbox_ref` 重新读取当前 `PolicyEffectiveFact` 拼 payload | current truth 可能已经变化,破坏 accepted transaction snapshot |
| `NonconformityChangedPayload` 保存 corrective work body 或 evidence body | 跨边界保存 sibling body |
| 多个 truth change 共用同一个 outbox snapshot | 无法审计 event kind / subject / cursor 一致性 |

#### 17.3 Trace and derived view outbound mapping

`GovernanceTraceAvailable` 和 `DerivedGovernanceViewChanged` 不是 command truth changed payload。它们只能由 trace / handoff marker save 或 projection state transition 触发,并且必须使用 stored ref/state 构造 snapshot。

| Event kind | Payload | Source | Append timing | 禁止事项 |
|---|---|---|---|---|
| `GovernanceTraceAvailable` | `GovernanceTraceAvailablePayload` | saved `GovernanceTraceRecord` and optional saved `GovernanceHandoffMarker` | command accepted trace append, consumer marker trace append, handoff marker save when configured for propagation | 不保存 command request、event payload 或 external log body |
| `DerivedGovernanceViewChanged` | `DerivedGovernanceViewChangedPayload` | saved `DerivedGovernanceViewState` | projection rebuild save_state / replace view, mark_stale if configured to notify | 不保存 projection view body unless already in projection store |

`DerivedGovernanceViewChanged` 的 outbox append 必须在 projection state mutation 的 same job transaction 内完成。如果 Step 11 决定 projection state update 与 outbound notification 分表持久化,仍必须保留 state version、view ref、cursor 和 snapshot ref 的一一对应。

#### 17.4 `PublishGovernanceOutboxFlow`

| 项目 | 内容 |
|---|---|
| 协议 | `GovernanceJobRequest<PublishGovernanceOutboxJobInput>` |
| 入口函数 | `GovernanceOperationsJobService.publish_governance_outbox(request, operation_context)` |
| 依赖 port | `GovernanceOutboxRepository`, `GovernanceOutboxPublisherPort`, `StoredGovernanceResultRepository`, `GovernanceIdempotencyRepository`, `GovernanceUnitOfWorkManager` |
| allowed mutation | outbox publication state only |
| job report | `GovernanceJobReport` with outbox refs / counters;duplicate returns stored report |
| 测试切口 | pending success; publisher retryable failure; dead letter mapping; duplicate replay; missing payload snapshot; no current truth lookup |

```text
[Jobs entry]
  | validate GovernanceJobRequest<PublishGovernanceOutboxJobInput>
  | operation = GovernanceOperationsJobKind::PublishGovernanceOutbox
  v
[GovernanceOperationsJobService]
  | tx = begin()
  | reservation = idempotency_repo.reserve(operation, metadata.idempotency_key, request_digest, tx)
  | duplicate -> rollback, stored_result_repo.get_job_report(result_ref), return replay
  | pending_page = outbox_repo.list_pending_with_payload(input.page)
  | assembly = GovernanceJobReportAssembly::start(operation_context, metadata.idempotency_key)
  v
[Per pending item]
  | record_v = Versioned<GovernanceOutboxPendingItem>
  | snapshot = outbox_repo.get_payload_snapshot(record_v.item.payload_snapshot_ref)
  | if snapshot missing -> outbox_repo.mark_failed(record.outbox_ref, reason, record_v.version, tx)
  | else publish(record_v.item.record, snapshot)
  |   success -> outbox_repo.mark_published(outbox_ref, publication_ref, record_v.version, tx)
  |   retryable failure -> outbox_repo.mark_failed(outbox_ref, failure_reason, record_v.version, tx)
  |   fatal failure -> outbox_repo.mark_dead_lettered(outbox_ref, dead_letter_reason, record_v.version, tx)
  | assembly.record_outbox(...)
  v
[Complete]
  | report = assembly.finish_from_counts()
  | result_ref = stored_result_repo.save(JobReport(report), tx)
  | idempotency_repo.complete(idempotency_ref, result_ref, tx)
  | commit
  | return GovernanceJobResponse { disposition, result_ref, report }
```

```rust
// GovernanceOutboxPublisherPort::publish(GovernanceOutboxRecord record, GovernanceOutboxPayloadSnapshot payload_snapshot)
let publication_ref = publisher.publish(record.clone(), payload_snapshot).await?;
```

| 分支 | 处理口径 | Job report |
|---|---|---|
| no pending items | commit stored completed report with zero scanned/changed/failed | `Completed` |
| publish success | mark `Published` with `expected_version = pending.version` | changed +1 |
| retryable failure | mark `Failed` with `expected_version = pending.version`;truth unchanged | failed +1;partial if other success |
| fatal failure | mark `DeadLettered` with `expected_version = pending.version` | failed +1 |
| missing payload snapshot | mark `Failed` or `DeadLettered` per Step 13 retry policy;never rebuild from truth | failed +1 |
| duplicate job | read stored `GovernanceJobReport`;do not list pending or publish | replayed report |
| optimistic conflict | item skipped or job partial per Step 13;do not publish after conflict | failed/skipped counter |

#### 17.5 Outbound publish stop-review

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 12 outbound event 是否覆盖 | 通过 | 10 个 truth event + trace available + derived view changed 已覆盖 |
| payload source 是否闭合 | 通过 | 每个 payload 只来自 saved truth/trace/view state/marker and cursor |
| stored snapshot 是否闭合 | 通过 | Step 7 已修正为 append record + full payload snapshot |
| expected_version 来源 | 通过 | publish marker uses `list_pending_with_payload` returned version |
| duplicate replay | 通过 | stored job report;duplicate 不重跑 publish |
| publisher 边界 | 通过 | publisher 只接收 stored snapshot;不访问 truth repository |

---

### 18. Maintenance job flow batch 9.5

本批覆盖 `RebuildGovernanceProjections`、`RefreshExternalContextSnapshots` 和 `RunGovernanceReconciliation`。三类 job 只能维护 projection、reference state 和 reconciliation report;不得创建、修改或删除 `GovernanceContext`、`Gate`、`GovernanceDecision`、policy、control、compliance、nonconformity 或 corrective truth。

#### 18.1 Shared maintenance job discipline

| 项目 | 规则 |
|---|---|
| idempotency | 先 reserve job idempotency;duplicate 返回 stored `GovernanceJobReport` |
| transaction | 每个 job run 使用 `GovernanceUnitOfWorkManager.begin()`;单项 partial failure 是否分批 commit 由 Step 13 retry 细化,但 stored report 必须与本 run 结果一致 |
| allowed reads | committed truth snapshot、projection state/view、reference state、outbox marker、reconciliation report |
| allowed writes | projection view/state、reference state/snapshot、reconciliation report、stored job report、idempotency completion |
| forbidden writes | Governance core truth、accepted command outbox truth-change record、history record、business decision |
| result | `GovernanceJobReportAssembly` 汇总 refs/counters,再保存 `StoredGovernanceOperationResult(JobReport)` |

```text
[Operations job service]
  | tx begin
  | reserve(job_kind, idempotency_key, digest, tx)
  | duplicate -> rollback, stored_result_repo.get_job_report(result_ref), return replay
  | assembly = GovernanceJobReportAssembly::start(operation_context, idempotency_key)
  | run maintenance body using only Step 7 job ports
  | report = assembly.finish_from_counts()
  | result_ref = stored_result_repo.save(JobReport(report), tx)
  | idempotency_repo.complete(idempotency_ref, result_ref, tx)
  | commit
```

#### 18.2 `RebuildGovernanceProjectionsFlow`

| 项目 | 内容 |
|---|---|
| 协议 | `GovernanceJobRequest<RebuildGovernanceProjectionsJobInput>` |
| 入口函数 | `GovernanceOperationsJobService.rebuild_governance_projections(request, operation_context)` |
| 依赖 port | `GovernanceTruthSnapshotRepository`, `GovernanceProjectionRepository`, truth repositories for typed source reads, `StoredGovernanceResultRepository`, `GovernanceIdempotencyRepository` |
| allowed mutation | replace public projection view body and `DerivedGovernanceViewState` only |
| job report | rebuilt view refs and counters |
| 测试切口 | dashboard rebuild; typed target resolution; stale -> fresh; projection set empty rejected; missing source degraded/failed; duplicate replay |

```text
[Job body]
  | validate scope_ref, projection_set non-empty, page
  | snapshot = truth_snapshot_repo.load_scope_snapshot(scope_ref, page)
  | for each requested derived_view_ref:
  |   target = projection_repo.resolve_projection_target(derived_view_ref)
  |   state_v = projection_repo.get_state_with_version(derived_view_ref)
  |   target_state = state_v.item or DerivedGovernanceViewState::for_view(derived_view_ref, snapshot.source_cursor)
  |   target_state.start_rebuild(snapshot.source_cursor)
  |   build typed view:
  |     Dashboard -> GovernanceDashboardView::from_truth(...)
  |     DecisionSummary -> load decision and gate, DecisionSummaryView::from_decision(...)
  |     PolicyEffective -> load active conflicts/shared rules, PolicyEffectiveView::from_policy_truth(...)
  |     ControlCoverage -> load context snapshot and coverage inputs, ControlCoverageView::from_control_truth(...)
  |     NonconformityStatus -> load nonconformity, NonconformityStatusView::from_nonconformity(...)
  |   target_state.mark_fresh(snapshot.source_cursor)
  |   projection_repo.replace_*_view(view, target_state, expected_state_version, tx)
  |   assembly.record_views(view_ref, changed_count +1)
```

| Target | Required builder input | Formal read source | Replace port |
|---|---|---|---|
| `Dashboard { view_ref, scope_ref }` | `GovernanceTruthSnapshot`, visible/fresh surface | `truth_snapshot_repo.load_scope_snapshot(scope_ref, page)` | `replace_dashboard_view` |
| `DecisionSummary { view_ref, decision_ref, gate_ref }` | loaded `GovernanceDecision`, loaded `Gate`, surface, cursor | `decision_repo.get_with_version`, `gate_repo.get_with_version` | `replace_decision_summary_view` |
| `PolicyEffective { view_ref, scope_ref }` | snapshot, unresolved conflict refs, optional shared rule set, surface/freshness | `truth_snapshot_repo.load_scope_snapshot`, `conflict_repo.list_unresolved_by_scope`, `shared_rule_set_repo.find_active_by_scope` | `replace_policy_effective_view` |
| `ControlCoverage { view_ref, context_ref }` | context snapshot, coverage state, surface/freshness | `truth_snapshot_repo.load_context_snapshot`, `control_applicability_repo.list_by_context`, `compliance_repo.list_by_context` | `replace_control_coverage_view` |
| `NonconformityStatus { view_ref, nonconformity_ref }` | loaded nonconformity, status summary, surface/freshness | `nonconformity_repo.get_with_version`, optional `corrective_repo.list_actions_by_nonconformity` | `replace_nonconformity_status_view` |

```rust
// GovernanceProjectionRepository::resolve_projection_target(DerivedGovernanceViewRef view_ref)
let target = projection_repo.resolve_projection_target(view_ref).await?;
```

| 分支 | 处理口径 |
|---|---|
| projection target missing | mark item failed in report;do not invent typed view ref |
| source truth missing | mark view state failed or unavailable per Step 10/13;do not create placeholder truth |
| existing state missing | create `DerivedGovernanceViewState::for_view(view_ref, snapshot.source_cursor)` with `expected_version = None` |
| existing state present | use `state_v.version` as expected version |
| view replace success | mark state fresh and include view ref in report |
| duplicate job | return stored job report;do not recompute snapshot or rebuild |

#### 18.3 `RefreshExternalContextSnapshotsFlow`

| 项目 | 内容 |
|---|---|
| 协议 | `GovernanceJobRequest<RefreshExternalContextSnapshotsJobInput>` |
| 入口函数 | `GovernanceOperationsJobService.refresh_external_context_snapshots(request, operation_context)` |
| 依赖 port | `ReferenceSnapshotRepository`, `ExternalGovernanceSourceResolverPort`, `GovernanceProjectionRepository`, `StoredGovernanceResultRepository`, `GovernanceIdempotencyRepository` |
| allowed mutation | reference resolution state, body-free snapshots/refs, affected projection stale marker |
| job report | refreshed and failed `ExternalGovernanceReferenceRef` sets |
| 测试切口 | explicit refs; unhealthy refs; governance scope refs; resolver success; resolver failure uses expected version; affected views from repository; duplicate replay |

```text
[Job body]
  | scope = map ExternalContextRefreshScopeDto -> ExternalContextRefreshScope
  | states = reference_repo.list_reference_states(scope, input.page)
  | for each state_v:
  |   reference_ref = state_v.item.reference_ref
  |   resolver call selected by reference kind / source family
  |   on success:
  |     new_state = resolved ReferenceResolutionState
  |     reference_repo.save_reference_state(new_state, Some(state_v.version), tx)
  |     save body-free snapshot/ref if resolver returned a typed snapshot
  |     affected = projection_repo.list_views_affected_by_references({reference_ref}, page)
  |     projection_repo.mark_stale(affected, current_cursor, tx)
  |     assembly.record_references({reference_ref}, empty)
  |   on failure:
  |     failed_state = state_v.item.mark_failed(...)
  |     reference_repo.save_reference_state(failed_state, Some(state_v.version), tx)
  |     assembly.record_references(empty, {reference_ref})
```

| Scope branch | Formal expansion | Missing / invalid handling |
|---|---|---|
| `ExplicitRefs(refs)` | `ReferenceSnapshotRepository.list_reference_states(ExplicitRefs(refs), page)` returns tracked states only | untracked refs enter failed refs;job must not create implicit states |
| `UnhealthyReferences` | repository returns tracked states where `is_unhealthy() == true` | empty page returns completed zero-change report |
| `GovernanceScope(scope_ref)` | repository expands scope reference index to tracked states | missing scope index returns failed/degraded job report,not full-table scan |

| Resolver result | Save behavior | Projection behavior |
|---|---|---|
| actor capability snapshot | `save_actor_capability_snapshot(..., Some(version or None), tx)` plus reference state | stale actor/capability affected views |
| method policy snapshot | `save_method_policy_snapshot(...)` plus reference state | stale policy effective views |
| method control snapshot | `save_method_control_snapshot(...)` plus reference state | stale control coverage views |
| evidence summary ref | `save_evidence_summary_ref(...)` plus reference state | stale compliance/control/nonconformity views |
| process/work context ref | `save_process_context_ref` / `save_work_context_ref` plus reference state | stale context/dashboard affected views |
| runtime signal ref | `save_runtime_signal_ref(...)` plus reference state | stale nonconformity/dashboard views |
| resolver failure | update reference state failure marker with `state_v.version` | do not mark stale unless Step 13 classifies failure as stale-worthy |

#### 18.4 `RunGovernanceReconciliationFlow`

| 项目 | 内容 |
|---|---|
| 协议 | `GovernanceJobRequest<RunGovernanceReconciliationJobInput>` |
| 入口函数 | `GovernanceOperationsJobService.run_governance_reconciliation(request, operation_context)` |
| 依赖 port | `GovernanceTruthSnapshotRepository`, `GovernanceProjectionRepository`, `GovernanceOutboxRepository`, `GovernanceReconciliationReportRepository`, stored result/idempotency |
| allowed mutation | save reconciliation report and stored job report only |
| job report | generated reconciliation report ref;failed refs/counters when report generation fails |
| 测试切口 | no findings generated; stale view finding; outbox lag finding; failed report persisted; query latest by scope; duplicate replay |

```text
[Job body]
  | input = request.reconciliation_input
  | snapshot = truth_snapshot_repo.load_scope_snapshot(input.scope_ref, page_from_job_or_default)
  | for each view_ref in input.view_refs:
  |   state_v = projection_repo.get_state_with_version(view_ref)
  |   compare state.source_cursor/freshness with input.source_cursor and snapshot.source_cursor
  | for each outbox_ref in input.outbox_refs:
  |   outbox_v = outbox_repo.get_with_version(outbox_ref)
  |   inspect publication_state and source_cursor
  | finding_refs = build body-free GovernanceReconciliationFindingRefSet
  | report = GovernanceReconciliationReport::from_reconciliation(new_reconciliation_report_id(), input, finding_refs, surface)
  | report_ref = reconciliation_report_repo.save(report, tx)
  | assembly.record_report(report_ref as GovernanceReportRef)
  | assembly.record_views(input.view_refs, changed_count 0)
```

| Finding source | Required formal read | Finding rule |
|---|---|---|
| projection state missing | `projection_repo.get_state_with_version(view_ref)` | finding ref indicates missing view state;job does not create it |
| projection stale/failed | loaded `DerivedGovernanceViewState` | finding ref indicates rebuild needed;job does not rebuild |
| outbox missing | `outbox_repo.get_with_version(outbox_ref)` | finding ref indicates outbox reference missing |
| outbox unpublished/dead-lettered | loaded `GovernanceOutboxRecord` | finding ref indicates propagation lag or terminal delivery failure |
| snapshot cursor mismatch | `truth_snapshot_repo.load_scope_snapshot` | finding ref indicates source cursor mismatch;job does not repair truth |

| 分支 | 处理口径 |
|---|---|
| no findings | save generated report with empty finding refs |
| report build failure | save `GovernanceReconciliationReport::failed(...)` if input is valid enough;otherwise rejected job response |
| duplicate job | return stored job report;do not regenerate report |
| projection/outbox read failure | record finding or failed report;do not call rebuild/publish job inline |

#### 18.5 Maintenance jobs stop-review

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 3 个 maintenance job 是否覆盖 | 通过 | rebuild、refresh、reconciliation 已覆盖 |
| job 是否修复 core truth | 通过 | 仅 projection/reference/report/result/idempotency mutation |
| Step 7 port 是否足够 | 已修正 | 补 `GovernanceTruthSnapshotRepository`、`GovernanceHandoffMarkerRepository`、`resolve_projection_target` 和 outbox snapshot append |
| version 来源 | 通过 | projection state/reference state/outbox marker 均来自 versioned read/list |
| duplicate replay | 通过 | stored job report,不重跑扫描或维护 |
| affected views | 通过 | refresh 成功只用 `list_views_affected_by_references` |

---

### 19. Handoff / export job flow batch 9.6

本批覆盖 `PrepareGovernanceTraceHandoff`、`PrepareGovernanceArchiveHandoff` 和 `PrepareExternalGrcExport`。三类 flow 都只产生 package ref、receipt ref、handoff marker 和 stored job report;不得把 observability ledger、archive package body、external GRC document body 或 adapter error body 写入 Governance 仓。

#### 19.1 Shared handoff / export discipline

| 项目 | 规则 |
|---|---|
| target validation | `GovernanceAdapterRegistryPort.get_adapter_availability(...)` or target registry must confirm target is enabled before prepare |
| marker identity | `IdGeneratorPort.new_handoff_marker_id()` creates `GovernanceHandoffMarkerRef`;do not derive from target or trace refs |
| trace reads | `GovernanceTraceRepository.get(...)` validates each requested trace ref exists;job input refs alone are not proof |
| marker save | `GovernanceHandoffMarkerRepository.save(marker, expected_version, uow)` saves prepared/delivered/failed marker |
| failed refs mapping | `TraceHandoffTargetRef(pub ExternalSourceRef)` maps to `ExternalGovernanceReferenceRef` for `GovernanceJobReport.failed_reference_refs` when target/adapter fails |
| duplicate replay | duplicate returns stored job report;does not call handoff/export adapter again |
| outbox | optional `GovernanceTraceAvailable` event may be appended from saved marker only when Step 14 config enables it;outbox snapshot still uses 9.4 helper |

```text
[Shared handoff job service]
  | tx begin + reserve idempotency
  | duplicate -> rollback, load stored job report, return replay
  | validate target enabled
  | load requested trace/report/snapshot refs according to job kind
  | call prepare adapter
  | create marker prepared(...) or failed(...)
  | optionally deliver and mark_delivered(...)
  | save marker
  | record marker ref and failed target ref when any
  | save stored job report + complete idempotency
  | commit
```

#### 19.2 `PrepareGovernanceTraceHandoffFlow`

| 项目 | 内容 |
|---|---|
| 协议 | `GovernanceJobRequest<PrepareGovernanceTraceHandoffJobInput>` |
| 入口函数 | `GovernanceOperationsJobService.prepare_governance_trace_handoff(request, operation_context)` |
| 依赖 port | `GovernanceTraceRepository`, `GovernanceTraceHandoffPort`, `GovernanceHandoffMarkerRepository`, `GovernanceAdapterRegistryPort`, stored result/idempotency/id generator |
| allowed mutation | handoff marker and stored job report only |
| job report | handoff marker refs;failed target/reference refs on adapter failure |
| 测试切口 | trace refs non-empty; missing trace rejected or failed marker; target disabled; prepare success; deliver failure marker; duplicate replay |

```text
[Job body]
  | validate trace_refs non-empty and target_ref present
  | availability = adapter_registry.get_adapter_availability(HandoffAdapter)
  | if unavailable -> build failed marker with target failed ref
  | traces = trace_repo.get(trace_ref) for each requested ref
  | if any missing -> rejected or failed marker according to Step 12 error class
  | package_ref = trace_handoff_port.prepare(target_ref, trace_refs)
  | on prepare success:
  |   marker = GovernanceHandoffMarker::prepared(new_marker_ref, trace_refs, target_ref, package_ref)
  |   deliver_result = trace_handoff_port.deliver(target_ref, package_ref)
  |   if deliver success -> marker.mark_delivered(receipt_ref)
  |   if deliver failure -> marker.mark_failed(reason)
  | on prepare failure:
  |   marker = GovernanceHandoffMarker::failed(new_marker_ref, trace_refs, target_ref, reason)
  | marker_repo.save(marker, None, tx)
  | assembly.record_handoff_marker(marker_ref)
  | if marker failed -> assembly.record_references(empty, {ExternalGovernanceReferenceRef(target_ref.0)})
```

```rust
// GovernanceHandoffMarker::prepared(marker_ref, trace_refs, target_ref, package_ref)
let marker = GovernanceHandoffMarker::prepared(marker_ref, trace_refs, target_ref, package_ref)?;
```

| 分支 | 处理口径 |
|---|---|
| target disabled | no adapter call;save failed marker when trace refs valid;report failed target ref |
| trace missing | rejected job if input invalid;or failed marker if failure occurs after accepted run starts |
| prepare success + deliver success | save delivered marker;report completed |
| prepare success + deliver failure | save failed marker preserving package ref;report partial/failed |
| prepare failure | save failed marker with reason;no package body |
| duplicate | return stored report;do not prepare/deliver again |

#### 19.3 `PrepareGovernanceArchiveHandoffFlow`

| 项目 | 内容 |
|---|---|
| 协议 | `GovernanceJobRequest<PrepareGovernanceArchiveHandoffJobInput>` |
| 入口函数 | `GovernanceOperationsJobService.prepare_governance_archive_handoff(request, operation_context)` |
| 依赖 port | `GovernanceTraceRepository`, `GovernanceReconciliationReportRepository`, `GovernanceArchiveHandoffPort`, `GovernanceHandoffMarkerRepository`, `GovernanceAdapterRegistryPort`, stored result/idempotency/id generator |
| allowed mutation | handoff marker and stored job report only |
| job report | archive handoff marker refs and report refs inspected |
| 测试切口 | trace/report refs validation; empty both rejected; archive target disabled; package prepared marker; failed marker; no archive body saved |

```text
[Job body]
  | validate trace_refs or report_refs non-empty
  | validate target through adapter registry
  | load traces through trace_repo.get(...)
  | load reports through reconciliation_report_repo.get(...)
  | package_ref = archive_handoff_port.prepare_archive(target_ref, trace_refs, report_refs)
  | on success:
  |   marker = GovernanceHandoffMarker::prepared(new_marker_ref, trace_refs, target_ref, package_ref)
  |   marker_repo.save(marker, None, tx)
  |   assembly.record_handoff_marker(marker_ref)
  |   assembly.record_report(each loaded report_ref as GovernanceReportRef)
  | on failure:
  |   marker = GovernanceHandoffMarker::failed(new_marker_ref, trace_refs, target_ref, reason)
  |   marker_repo.save(marker, None, tx)
  |   assembly.record_handoff_marker(marker_ref)
  |   assembly.record_references(empty, {ExternalGovernanceReferenceRef(target_ref.0)})
```

| Input | Formal validation | Failure behavior |
|---|---|---|
| `trace_refs` | each ref must be readable by `GovernanceTraceRepository.get` | missing trace is rejected before adapter call |
| `report_refs` | each report must exist in `GovernanceReconciliationReportRepository.get` or report store designated by Step 11 | missing report rejected or failed item,never replaced by ad hoc report |
| `target_ref` | adapter registry confirms enabled archive target | disabled target produces rejected job or failed marker |
| archive package | returned only as `HandoffPackageRef` | package body remains in archive adapter/system |

Archive handoff does not call `deliver(...)` in Step 7;it only prepares an archive package and saves marker. If a later Step adds archive delivery receipt, it must extend `GovernanceArchiveHandoffPort` and marker transition explicitly.

#### 19.4 `PrepareExternalGrcExportFlow`

| 项目 | 内容 |
|---|---|
| 协议 | `GovernanceJobRequest<PrepareExternalGrcExportJobInput>` |
| 入口函数 | `GovernanceOperationsJobService.prepare_external_grc_export(request, operation_context)` |
| 依赖 port | `ExternalGrcExportPort`, `GovernanceHandoffMarkerRepository`, `GovernanceTruthSnapshotRepository` when service reloads latest snapshot, `GovernanceAdapterRegistryPort`, stored result/idempotency/id generator |
| allowed mutation | export/handoff marker and stored job report only |
| job report | export marker refs;failed target refs;optional report refs if export adapter returns report refs in later Step |
| 测试切口 | snapshot body-free validation; target disabled; prepare export success; deliver export success/failure; duplicate replay; no external GRC truth write |

```text
[Job body]
  | validate input.truth_snapshot contains scope_ref/source_cursor/ref sets only
  | availability = adapter_registry.get_adapter_availability(ExternalGrcAdapter)
  | if service requires latest snapshot:
  |   latest = truth_snapshot_repo.load_scope_snapshot(input.truth_snapshot.scope_ref, page)
  |   compare cursor or use input snapshot according to Step 13 freshness policy
  | package_ref = external_grc_export_port.prepare_export(target_ref, truth_snapshot)
  | marker_trace = GovernanceTraceRecord::from_marker(new_trace_id, export_subject_ref, export_trace_kind, core_trace_id, Some(truth_snapshot.source_cursor))
  | trace_repo.append_trace(marker_trace, uow)
  | trace_refs = GovernanceTraceRecordRefSet([marker_trace.to_ref()])
  | on prepare success:
  |   marker = GovernanceHandoffMarker::prepared(new_marker_ref, trace_refs, target_ref, package_ref)
  |   receipt = external_grc_export_port.deliver_export(target_ref, package_ref)
  |   if receipt success -> marker.mark_delivered(receipt_ref)
  |   if receipt failure -> marker.mark_failed(reason)
  | on prepare failure:
  |   marker = GovernanceHandoffMarker::failed(new_marker_ref, trace_refs, target_ref, reason)
  | marker_repo.save(marker, None, tx)
  | assembly.record_handoff_marker(marker_ref)
  | if marker failed -> assembly.record_references(empty, {ExternalGovernanceReferenceRef(target_ref.0)})
```

| Export source | Rule |
|---|---|
| `GovernanceTruthSnapshot` in input | must be body-free;contains only scope, cursor and ref sets |
| optional latest reload | may use `GovernanceTruthSnapshotRepository.load_scope_snapshot` if Step 13 config requires freshness check |
| package/receipt | adapter-owned body;Governance stores only `HandoffPackageRef` and `HandoffReceiptRef` |
| target failure | save failed marker and failed target ref;do not create external GRC truth |

Step 10 has closed the rule:all `GovernanceHandoffMarker.trace_refs` must be non-empty. `PrepareExternalGrcExport` must create and append a marker trace through `GovernanceTraceRecord::from_marker(...)` before marker creation, then pass that trace ref into prepared or failed marker creation. Empty trace refs are rejected for export markers as well.

#### 19.5 Handoff / export stop-review

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 3 个 handoff/export job 是否覆盖 | 通过 | trace handoff、archive handoff、external GRC export 已覆盖 |
| package / receipt body 是否保存 | 通过 | 只保存 package ref、receipt ref、failure reason |
| marker repository 是否闭合 | 已修正 | Step 7 已补 `GovernanceHandoffMarkerRepository` |
| failed refs 类型是否闭合 | 通过 | target failure maps `TraceHandoffTargetRef.0` to `ExternalGovernanceReferenceRef` |
| duplicate replay | 通过 | stored job report;不重复调用 adapter |
| external GRC export marker trace refs | 通过 | Step 10 已定:必须先创建 marker trace,empty trace refs 禁止 |

---

### 20. Final audit batch 9.7

#### 20.1 Flow coverage summary

| Flow family | Expected count | Covered sections | 结论 |
|---|---:|---|---|
| Command | 23 | §11、§12、§13 | 通过 |
| Query | 14 | §14、§15 | 通过 |
| Inbound consumer | 9 | §16 | 通过 |
| Outbound event append / publish | 12 outbound payloads + publish job | §17 | 通过 |
| Maintenance jobs | 3 | §18 | 通过 |
| Handoff / export jobs | 3 | §19 | 通过 |
| Shared templates | command/query/consumer/job/outbox | §7~§10、§17.1、§18.1、§19.1 | 通过 |

#### 20.2 Cross-flow closure audit

| 审计项 | 结论 | 依据 |
|---|---|---|
| DTO -> handler -> service | 通过 | 每条 flow 指定 Step 8 request/response and service entry |
| service -> domain object | 通过 | command flow 调 Step 6 factory/member/policy guard;job flow 只调 marker/view/report helper |
| repository / port | 通过 | flow 只使用 Step 7 正式 port;缺口已即时回写 Step 7 |
| expected_version 来源 | 通过 | mutable truth uses `get_*_with_version`;projection/reference/outbox marker uses versioned read/list |
| transaction boundary | 通过 | accepted command、consumer accepted、job run 均有 begin/commit 顺序 |
| idempotency duplicate replay | 通过 | command/consumer/job duplicate 均从 `StoredGovernanceResultRepository` replay |
| outbox payload snapshot | 通过 | accepted transaction builds and stores full `GovernanceOutboxPayloadSnapshot`;publisher never rebuilds from truth |
| projection identity | 通过 | affected views and rebuild targets come from projection repository;no ad hoc view id |
| external body boundary | 通过 | resolver/handoff/export/payload/view/report only carry refs, snapshots, markers, reasons |
| query no-write | 通过 | query flow does not refresh/rebuild/append/mark stale |
| job no-repair | 通过 | jobs do not mutate core Governance truth |
| unsupported inbound version | 通过 | unsupported version does not parse payload or mark stale |

#### 20.3 Design-side fixes made during Step 9

| File | Fix | Reason |
|---|---|---|
| `03_ddd_step_07_trait_port_adapter_contracts.md` | added `ApproverRequirementRepository` | approval vote/delegate/chain satisfaction needed requirement read/write surface |
| `03_ddd_step_07_trait_port_adapter_contracts.md` | added projection view body reads and search/report reads | query flows must read existing public views without rebuilding body |
| `03_ddd_step_07_trait_port_adapter_contracts.md` | added `GovernanceReconciliationReportRepository` | reconciliation report query/job needs formal report save/get/latest surface |
| `03_ddd_step_07_trait_port_adapter_contracts.md` | added `GovernanceTruthSnapshotRepository` | rebuild/reconciliation/export jobs need committed body-free truth summary source |
| `03_ddd_step_07_trait_port_adapter_contracts.md` | added `GovernanceHandoffMarkerRepository` | handoff/export jobs need marker save/get/list with version source |
| `03_ddd_step_07_trait_port_adapter_contracts.md` | changed outbox append to accept full `GovernanceOutboxPayloadSnapshot` | stored snapshot must be persisted with record;publisher cannot rebuild payload |
| `03_ddd_step_07_trait_port_adapter_contracts.md` | added `new_outbox_payload_snapshot_ref()` | snapshot identity must have formal id source |
| `03_ddd_step_07_trait_port_adapter_contracts.md` | added `GovernanceProjectionTargetRef` and `resolve_projection_target(...)` | rebuild job must resolve public view ref to typed target and source identity |

#### 20.4 Step 10~13 handoff items

| Next step | Required decision / detail |
|---|---|
| Step 10 state matrix | closed:external GRC export marker must create `GovernanceTraceRecord::from_marker(...)` before marker creation;empty `trace_refs` forbidden |
| Step 10 state matrix | define `DerivedGovernanceViewState` transitions for rebuild item failure, unavailable source, and successful fresh replacement |
| Step 10 state matrix | define outbox `Failed -> Pending` retry vs `Failed -> DeadLettered` transition guards |
| Step 11 persistence | persist outbox record + payload snapshot atomically and enforce record/snapshot field consistency |
| Step 11 persistence | define projection target index for `resolve_projection_target(...)` and scope/context/source identity columns |
| Step 11 persistence | define handoff marker persistence and versioned read semantics |
| Step 12 errors | classify target disabled, missing trace/report, missing payload snapshot, resolver failure and projection source missing |
| Step 13 idempotency | define stored `CommandResult`、`ConsumerReceipt` and `JobReport` serialization / replay checks |
| Step 14 config | define adapter availability slots, handoff target registry, optional trace/view outbound notification switches |
| Step 16 tests | create per-flow contract tests for duplicate replay, no-write query, no-repair job, stored outbox snapshot, affected views repository usage |

#### 20.5 Step 9 completion checklist

| Checklist | 状态 |
|---|---|
| All Command flows have DTO, service entry, domain call, port call, transaction, side effect and test cuts | [x] |
| All Query flows are read-only and carry visibility/freshness/degraded surface | [x] |
| All Inbound consumers have version/idempotency/snapshot/stale/receipt rules | [x] |
| All Outbound payloads map to stored source and publisher reads stored snapshot only | [x] |
| All Operations jobs have duplicate replay and no core truth repair rule | [x] |
| Design gaps discovered by flow review are fixed in Step 7 instead of deferred to implementation | [x] |
| Remaining open choices are assigned to later SOP steps with explicit owner | [x] |

### 21. 回填草稿

> 校准来源:
> - `design-calibration/03_ddd_step_09_function_flows.md`
> - `design-calibration/03_ddd_step_06_object_contracts.md`
> - `design-calibration/03_ddd_step_07_trait_port_adapter_contracts.md`
> - `design-calibration/03_ddd_step_08_protocol_contracts.md`

正式 `03-详细设计.md` §8 应按下列结构装配:

- §8.1 处理流通用纪律: command/query/consumer/job/outbox shared templates。
- §8.2 Command flows: context/input/gate/decision、approval/policy、control/compliance/nonconformity。
- §8.3 Query flows: truth read、projection/search/trace/dashboard/report read。
- §8.4 Inbound consumer flows: 9 个 external event consumer。
- §8.5 Outbound event append and publish: outbox helper、payload mapping、publish job。
- §8.6 Operations jobs: rebuild、refresh、reconciliation、trace/archive/export handoff。
- §8.7 Cross-flow audit and later-step handoff items。

本 Step 完成后,下一步进入 Step 10 `03_ddd_step_10_state_matrix.md`,集中收口状态迁移矩阵、job/marker/projection/outbox transition guard 和 Step 9 留下的 external GRC export marker trace refs 决策。
