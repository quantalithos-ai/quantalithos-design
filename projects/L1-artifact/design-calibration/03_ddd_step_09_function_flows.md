# Step 9. 定义逐接口函数级处理流

> 对应 SOP: `standards/document/详细设计讨论流程_SOP.md` Step 9
> 回填章节: `03-详细设计.md` §8 逐接口函数级处理流
> 生成日期: 2026-07-03
> 状态: 已完成

---

## 1. Step 状态

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

## 2. 本步目标

把 Step 8 已定义的 16 个 Command、13 个 Query、6 个 Inbound Event Consumer、8 个 Outbound Event、6 个 Operations Job 和 1 个 worker-only relay publication facade,逐一收口成可落码的函数级处理流。

本步必须为每条 flow 明确:

- public DTO 如何进入 handler / service。
- idempotency / duplicate replay 在哪里 reserve、读取和完成。
- 哪些 repository / resolver / publisher / handoff port 被调用,且只能使用 Step 7 已定义函数。
- 哪些 Step 6 domain factory / member method / policy guard 被调用。
- UnitOfWork 在哪里 begin / commit / rollback。
- accepted path 保存 truth、history、trace、audit、relay、derived stale marker、stored result 的顺序。
- rejected / duplicate / delayed / unsupported / partial failure path 的返回 surface。
- 每条 flow 的测试切口。

本步不定义状态转换矩阵、错误码全集、DDL、索引、配置 key、transport route、topic 名称、retry 参数或实施 commit boundary。这些分别由 Step 10~17 继续收口。

---

## 3. 本步输入

| 输入 | 状态 | 用途 |
|---|---|---|
| `02_hld_step_08_processing_flows.md` | 已完成 | 提供 command / query / consumer / job 处理流族和 no-write / no-repair 边界 |
| `03_ddd_step_06_object_contracts.md` | 已完成 | 提供对象字段、factory、transition method、policy guard、state enum 和 record object |
| `03_ddd_step_07_trait_port_adapter_contracts.md` | 已完成 | 提供 repository、projection、reference、relay、result、resolver、publisher、handoff port 函数 |
| `03_ddd_step_08_protocol_contracts.md` | 已完成 | 提供 request / response / event / job DTO 字段和 route inventory |
| `projects/L1-governance/design-calibration/03_ddd_step_09_function_flows.md` | 已读取 | 作为 Step 9 粒度、共享模板和逐 flow 停审组织方式参考 |
| `设计真相源闭环与可落码性标准.md` | 已生效 | 校验 DTO 构造闭环、version 来源、relay stored snapshot、duplicate replay 和 query no-write |
| `详细设计讨论流程_SOP.md` | 已生效 | 要求每个 Command / Query / Consumer / Job 独立 flow、分批停审和跨 flow 审计 |

---

## 4. 分批写入计划

> 分批写入只限制单次写入规模,不限制章节最终详尽程度。若一个 flow 批次超过单批容量,继续拆成多批补全字段、调用顺序、错误分支和停审记录。

| 批次 | Flow 族 | 内容 | 状态 |
|---|---|---|---|
| 9.0 | shared flow discipline | Step 9 框架、flow 总表、全局 transaction / idempotency / side effect 模板 | [x] 已写入 |
| 9.1-a | intake / fact / version commands | 5 个 command flow、停审记录 | [x] 已写入 |
| 9.1-b | lineage / baseline commands | 5 个 command flow、停审记录 | [x] 已写入 |
| 9.1-c | review / automation / consumption commands | 6 个 command flow、停审记录 | [x] 已写入 |
| 9.2 | query flows | 13 个 query flow、read-only / visibility / freshness / degraded 分支 | [x] 已写入 |
| 9.3 | inbound consumers | 6 个 consumer flow、unsupported / duplicate / delayed / rejected 口径 | [x] 已写入 |
| 9.4 | outbound relay append / publish | accepted write relay append helper、8 个 outbound payload map、worker publication flow | [x] 已写入 |
| 9.5 | operations jobs | 6 个 maintenance / handoff job flow | [x] 已写入 |
| 9.6 | final audit | per-flow 停审汇总、跨 flow transaction/state/relay/query/idempotency 审计 | [x] 已写入 |

---

## 5. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 每个 Command / Query / Event / Job 是否独立讨论? | 是。本 Step 用 flow 名逐项覆盖 Step 8 inventory;同构流程只共享模板,不合并为一个不可落码的泛化流程。 |
| Flow 是否按接口类别或所属模块分批? | 是。Command 按 intake/fact/version、lineage/baseline、review/automation/consumption 分三批;Query、Consumer、Outbound、Job 独立批次。 |
| 每条 flow 如何回指 Step 6 / 7 / 8? | Flow 表中列出协议 DTO、目标对象 / policy、依赖 port 和副作用;调用图只使用 Step 6 函数名和 Step 7 port 函数名。 |
| 事务在哪里开始和提交? | Command accepted path、consumer accepted path、job mutation path、relay publication marker update 都由 `ArtifactUnitOfWorkManager.begin()` 开启,在 stored result / receipt / report 完成后 commit。Query 不开启写事务。 |
| Duplicate replay 如何处理? | Command / Consumer / Job 先调用 `ArtifactIdempotencyRepository.reserve(...)`;duplicate 读取 `StoredArtifactResultRepository` 对应 surface 并返回,不得重跑 mutation。 |
| Relay payload 何时生成? | Accepted command / job transaction 内从 `ArtifactCommittedChange` 构造 outbound envelope,由 `ArtifactOutboundPayloadSnapshotBuilder` 生成 stored snapshot,再调用 `ArtifactCommittedChangeRelayRepository.append(...)`。Publisher 只读取 stored snapshot。 |
| Query denied / degraded 如何表达? | Query service 返回 `ArtifactQuerySurface`;visibility / freshness / degraded 都是 response surface,不是 mutation。 |
| Consumer 是否能创建 core truth? | 不能。Inbound consumer 只能写 reference state、local mirror snapshot、stale derived marker、receipt 和必要 trace,不得创建 fact/version/lineage/baseline/consumable truth。 |
| Job 是否允许修复 truth? | 不允许。Job 只能维护 derived view、external reference state、reconciliation report、handoff material 和 relay publication state。 |
| 每条 flow 的停审项目是什么? | DTO 构造、domain method、port、version 来源、transaction、错误分支、truth/history/trace/audit/relay/derived/stored-result 副作用、测试切口。 |

---

## 6. Flow inventory

### 6.1 Command flow inventory

| Flow | 协议 DTO | Service | 目标对象 | 主要 port | 状态 / 副作用 | 停审状态 |
|---|---|---|---|---|---|---|
| `RegisterArtifactIntakeFlow` | `RegisterArtifactIntakeRequest` | `ArtifactIntakeReviewService.register_artifact_intake` | `ArtifactIntakeContext`, `ArtifactSubmissionRecord`, `ArtifactInputResolutionRecord` | intake/submission/audit/resolver/result/idempotency/relay | intake 收束、submission、resolution、stored result | 已审 |
| `EstablishArtifactFactFlow` | `EstablishArtifactFactRequest` | `ArtifactTruthWriteService.establish_artifact_fact` | `ArtifactFact`, `ArtifactContentFactContext` | intake/content/fact/change/trace/result/idempotency/relay | fact established、fact change、trace、stored result | 已审 |
| `CreateArtifactVersionCandidateFlow` | `CreateArtifactVersionCandidateRequest` | `ArtifactTruthWriteService.create_artifact_version_candidate` | `ArtifactVersionCandidate` | fact/content/candidate/result/idempotency/relay | candidate open / ready path、stored result | 已审 |
| `PublishArtifactVersionFlow` | `PublishArtifactVersionRequest` | `ArtifactTruthWriteService.publish_artifact_version` | `ArtifactVersionCandidate`, `ArtifactVersion`, `ArtifactFact` | candidate/version/fact/change/trace/result/idempotency/relay | version published、fact current bound、stored result | 已审 |
| `SupersedeArtifactVersionFlow` | `SupersedeArtifactVersionRequest` | `ArtifactTruthWriteService.supersede_artifact_version` | `ArtifactVersion`, `ArtifactFact` | version/fact/change/trace/result/idempotency/relay | next supersedes current、fact current rebind | 已审 |
| `EstablishArtifactLineageLinkFlow` | `EstablishArtifactLineageLinkRequest` | `ArtifactTruthWriteService.establish_artifact_lineage_link` | `ArtifactLineageLink` | version/lineage/change/result/idempotency/relay | lineage established | 已审 |
| `RejectArtifactLineageLinkFlow` | `RejectArtifactLineageLinkRequest` | `ArtifactTruthWriteService.reject_artifact_lineage_link` | `ArtifactLineageLink` | lineage/change/result/idempotency/relay | lineage rejected | 已审 |
| `CreateArtifactBaselineCandidateFlow` | `CreateArtifactBaselineCandidateRequest` | `ArtifactTruthWriteService.create_artifact_baseline_candidate` | `ArtifactBaseline`, `ArtifactBaselineMembership` | version/baseline/membership/result/idempotency/relay | candidate baseline + membership | 已审 |
| `FreezeArtifactBaselineFlow` | `FreezeArtifactBaselineRequest` | `ArtifactTruthWriteService.freeze_artifact_baseline` | `ArtifactBaseline`, `ArtifactBaselineMembership` | baseline/membership/review/change/result/idempotency/relay | baseline frozen、members frozen | 已审 |
| `SupersedeArtifactBaselineFlow` | `SupersedeArtifactBaselineRequest` | `ArtifactTruthWriteService.supersede_artifact_baseline` | `ArtifactBaseline` | baseline/change/result/idempotency/relay | current superseded | 已审 |
| `OpenArtifactReviewAnchorFlow` | `OpenArtifactReviewAnchorRequest` | `ArtifactIntakeReviewService.open_artifact_review_anchor` | `ArtifactReviewAnchor`, `ArtifactReviewTraceRecord` | review/trace/audit/result/idempotency/relay | review anchor opened / ready | 已审 |
| `AssignArtifactResponsibilityFlow` | `AssignArtifactResponsibilityRequest` | `ArtifactIntakeReviewService.assign_artifact_responsibility` | `ArtifactResponsibilityAssignment`, `ArtifactReviewAnchor` | review/responsibility/audit/result/idempotency/relay | responsibility assigned, review pending responsibility | 已审 |
| `RegisterAutomationArtifactInputFlow` | `RegisterAutomationArtifactInputRequest` | `ArtifactIntakeReviewService.register_automation_artifact_input` | `AutomationArtifactInput`, `AutomationIntakeAuditRecord` | automation/audit/result/idempotency/relay | automation candidate registered | 已审 |
| `AcceptAutomationArtifactInputFlow` | `AcceptAutomationArtifactInputRequest` | `ArtifactIntakeReviewService.accept_automation_artifact_input` | `AutomationArtifactInput`, optional `ArtifactIntakeContext` | automation/intake/audit/result/idempotency/relay | automation accepted into intake boundary | 已审 |
| `IssueConsumableArtifactReferenceFlow` | `IssueConsumableArtifactReferenceRequest` | `ArtifactTruthWriteService.issue_consumable_artifact_reference` | `ConsumableArtifactReference` | consumable/trace/result/idempotency/relay | consumable ref ready | 已审 |
| `RecordArtifactConsumptionBackrefFlow` | `RecordArtifactConsumptionBackrefRequest` | `ArtifactTruthWriteService.record_artifact_consumption_backref` | `ArtifactConsumptionBackref`, `ArtifactTraceRecord` | consumable/backref/trace/result/idempotency/relay | backref recorded and explained | 已审 |

### 6.2 Query / consumer / outbound / job flow inventory

| Flow family | Flow count | 主要 port | 状态 / 副作用 | 停审状态 |
|---|---:|---|---|---|
| core truth query flows | 6 | truth repositories, summary view repository, read service | read-only;missing/degraded surface | 已审 |
| consumption / trace / search query flows | 3 | read surface, backref, trace, summary search | read-only;visibility/freshness/page surface | 已审 |
| derived / report / reference query flows | 4 | preview/report/reconciliation/reference state repositories | read-only;freshness/degraded surface | 已审 |
| inbound consumer flows | 6 | idempotency, resolver, reference state, mirror snapshot, refresh record, stored result | reference/stale/receipt;no core truth | 已审 |
| outbound append / publication flows | 8 event append + 1 publication facade | relay repository, payload snapshot builder, publisher | stored snapshot, publication marker | 已审 |
| operations job flows | 6 | truth snapshot, projection, reference, handoff, result repositories and handoff ports | derived/reference/report/handoff only | 已审 |

---

## 7. Shared command transaction template

所有 accepted Command flow 必须按下列顺序编排。具体 command 可跳过不适用的 history / trace / relay variant,但不得改变 truth、record、relay、derived stale 和 stored result 的相对语义。

```text
[API handler]
  | validate ArtifactCommandRequest<T>
  | map metadata -> ArtifactCommandCallContext
  | operation_context = ArtifactOperationContextFactory.for_command(operation_name, context)
  | digest = canonical request digest
  v
[Application service]
  | uow = ArtifactUnitOfWorkManager.begin()
  | reservation = ArtifactIdempotencyRepository.reserve(operation_context, digest, uow)
  | if Duplicate -> rollback uow, load StoredArtifactResultRepository.get_command_result(...) or get_command_rejection(...), return replay
  | if Conflict -> mark_conflict, save command rejection, complete/commit as Step 12 defines, return protocol rejection
  v
[Load and guard]
  | load required truth/support objects through Step 7 get_*_with_version / find_* methods
  | call Step 6 policy guards
  | reject before mutation if required refs are missing, selector invalid, state illegal or body-free boundary violated
  v
[Domain transition]
  | call Step 6 factory / member methods
  | collect accepted changed truth/support/record refs
  v
[Persist accepted effects]
  | save all changed objects with expected_version from loaded Versioned<T>
  | append history/audit/trace records when the target family owns one
  | source_cursor = uow.assign_truth_cursor()
  | build ArtifactCommittedChange variant(s) with source_cursor
  | generate relay_item_ref + payload_snapshot_ref through IdGeneratorPort
  | build outbound event envelope and ArtifactRelayPayloadSnapshot
  | ArtifactCommittedChangeRelayRepository.append(change, payload_snapshot, uow)
  | mark relevant ArtifactDerivedViewState as stale through repository state save when the flow owns a stale marker
  | save StoredArtifactOperationResult::CommandResult
  | ArtifactIdempotencyRepository.complete(idempotency_ref, result_ref, uow)
  | commit uow
  v
[Response]
  | map service result to ArtifactCommandResponse<T>
```

| 步骤 | 必须使用的正式契约 | 禁止事项 |
|---|---|---|
| idempotency reserve | `ArtifactIdempotencyRepository.reserve(...)` | duplicate 不得重跑 domain transition |
| mutation read | `get_*_with_version(...)` / `find_*` 返回 `Versioned<T>` | 不得用 cursor、timestamp 或 hard-coded version 充当 expected_version |
| domain transition | Step 6 object factory / member method / policy guard | 不得在 application 里直接改字段绕过 domain |
| source cursor | `ArtifactUnitOfWork.assign_truth_cursor()` after accepted write staging | 不得从 page cursor、optimistic version、timestamp、trace id 或 id generator 推导 |
| relay | `ArtifactCommittedChangeRelayRepository.append(...)` + stored payload snapshot | publisher 不得回查 current truth 构造 payload |
| stored result | `StoredArtifactResultRepository.save(...)` + `complete(...)` | accepted command 不得只返回内存 result |

---

## 8. Shared query read template

所有 public Query flow 必须保持 read-only。Query 可以读取 truth、projection、reference state、trace、report 和 view state,但不得刷新 snapshot、修复 projection、append trace、写 audit、创建 relay 或写 stored result。

```text
[API handler]
  | validate ArtifactQueryRequest<T>
  | map metadata -> ArtifactQueryCallContext
  | map public ArtifactPageRequest -> ArtifactRepositoryPage when needed
  v
[ArtifactReadConsumptionService]
  | load target truth / view / report / reference state through Step 7 read ports
  | evaluate ArtifactReadVisibilityPolicy when consumer or actor visibility matters
  | inspect ArtifactDerivedViewState when freshness matters
  v
[Response assembler]
  | map application read model to Step 8 public view DTO
  | attach ArtifactQuerySurface { visibility, freshness, degraded, result_ref? }
  | attach ArtifactPageSurface when result is paged
  | return response
```

| 查询路径 | 允许读取 | 禁止写入 |
|---|---|---|
| single truth view | target truth repo, optional summary view, optional reference state | trace/audit/relay/projection/reconciliation |
| read surface | consumable/read surface/backref/trace reads, visibility policy | consumption backref write, trace append |
| projection view | projection repo view/state | rebuild/mark fresh/mark stale |
| trace view | `ArtifactTraceRepository.list_by_truth_anchor(...)` | append trace / repair audit trail |
| report / reconciliation | report / reconciliation repo, derived state read | create new report or fix drift |
| external reference | resolution state / mirror snapshot / refresh record reads | call resolver / save refresh result |

Query missing / degraded rule:

- Missing required truth ref maps to Step 12 not-found surface;it is not a degraded read.
- Existing truth with missing optional summary / view maps to `Degraded` only when Step 8 response surface names that projection freshness gap.
- External reference `Unresolved` / `Failed` state maps to degraded response marker;query must not refresh.
- Empty page is a valid `ArtifactPageResponse` with no write side effect.

---

## 9. Shared inbound consumer template

所有 inbound consumer 必须先处理 envelope、schema version 和 idempotency。Accepted path 只能写 external resolution state、local mirror snapshot、refresh record、derived stale marker、stored receipt 和可选 trace,不得创建 core Artifact truth。

```text
[Worker entry]
  | validate ArtifactInboundEventEnvelope<T>
  | if unsupported schema_version -> store UnsupportedSchema receipt without parsing payload
  | map envelope -> ArtifactInboundEventCallContext
  | operation_context = ArtifactOperationContextFactory.for_inbound_event(operation_name, context, trusted_actor)
  | digest = canonical envelope digest
  v
[ArtifactIntakeReviewService consumer method]
  | uow = begin()
  | reservation = ArtifactIdempotencyRepository.reserve(operation_context, digest, uow)
  | duplicate -> rollback uow, load StoredArtifactResultRepository.get_inbound_receipt(result_ref), return replay
  | validate body-free payload refs
  | call ExternalArtifactSourceResolverPort when consumer needs a fresh body-free resolution outcome
  | save ExternalReferenceResolutionState / ArtifactLocalMirrorSnapshot / ExternalMirrorRefreshRecord as allowed
  | mark affected ArtifactDerivedViewState stale only through repository save and reference cursor
  | save StoredArtifactOperationResult::InboundReceipt
  | complete idempotency
  | commit uow
```

| 分支 | 处理口径 |
|---|---|
| `Accepted` | 写 resolution state / mirror snapshot / stale marker / receipt;不写 core truth |
| `Duplicate` | 返回 stored `ArtifactInboundReceiptEnvelope`;不重放 mutation |
| `Delayed` | 不写 core truth;可写 pending resolution state 和 receipt |
| `Rejected` | 不写 snapshot/stale;返回 redacted issue refs |
| `UnsupportedSchema` | 不解析 payload、不写 snapshot、不 mark stale |
| `Quarantined` | dedup conflict 或 unsafe payload relation;不写 truth |

---

## 10. Shared operations job template

所有 public operations job 必须通过 stored job report 支持 duplicate replay。Job body 不得修复 Artifact core truth。

```text
[Jobs entry]
  | validate ArtifactJobRequest<T>
  | map metadata -> ArtifactJobCallContext
  | map public scope/page DTO -> application-local scope/page helper
  | operation_context = ArtifactOperationContextFactory.for_job(operation_name, context)
  | digest = canonical job request digest
  v
[ArtifactDerivedMaintenanceService]
  | uow = begin()
  | reservation = ArtifactIdempotencyRepository.reserve(operation_context, digest, uow)
  | duplicate -> rollback uow, load StoredArtifactResultRepository.get_job_report(result_ref), return replay
  v
[Job body]
  | process one page / explicit refs / truth anchors from request
  | update only allowed derived/reference/report/handoff material
  | append relay only for ArtifactDerivedViewStateChanged / ArtifactTraceAvailable when Step 9 flow names a committed change
  | save StoredArtifactOperationResult::JobReport
  | complete idempotency
  | commit uow
  v
[Response]
  | return ArtifactJobProtocolResponse
```

| Job family | Allowed mutation | Forbidden mutation |
|---|---|---|
| rebuild derived views | summary/read/preview/report/reconciliation view body and `ArtifactDerivedViewState` | fact/version/lineage/baseline/intake/review/consumption truth |
| refresh reference | external resolution state, local mirror snapshot, refresh record, stale marker | core truth, command result, consumer body |
| reconciliation | reconciliation report / finding refs / derived state | automatic truth repair |
| handoff preparation | prepared handoff material, handoff record, optional trace | archive/sync body ownership or truth mutation |
| relay publication | relay item publication state | payload snapshot rebuild or accepted truth rollback |

---

## 11. Shared relay append and publication template

Accepted writes and jobs append relay work items in the same transaction that produced the committed change. Relay publication is a separate worker-only flow.

```text
[Accepted writer]
  | change = ArtifactCommittedChange::<variant> { ..., truth_cursor }
  | payload_snapshot_ref = IdGeneratorPort.new_artifact_relay_payload_snapshot_ref()
  | relay_item_ref = IdGeneratorPort.new_artifact_relay_item_ref()
  | envelope = ArtifactOutboundEventEnvelope<T> from Step 8 map
  | payload_snapshot = ArtifactOutboundPayloadSnapshotBuilder.build(payload_snapshot_ref, event_kind, schema_version, envelope)
  | ArtifactCommittedChangeRelayRepository.append(change, payload_snapshot, uow)
```

```text
[Relay publication worker]
  | page = map worker ArtifactPageRequest -> ArtifactRepositoryPage
  | page_items = ArtifactCommittedChangeRelayRepository.list_pending_with_payload(page)
  | for each Versioned<ArtifactPendingRelayItem>:
  |   snapshot = ArtifactCommittedChangeRelayRepository.get_payload_snapshot(item.payload_snapshot_ref)
  |   if missing -> mark_failed or mark_retryable with expected_version
  |   outcome = ArtifactRelayPublisherPort.publish(item, snapshot)
  |   Published -> mark_published(relay_item_ref, publication_ref, expected_version, uow)
  |   Retryable -> mark_retryable(relay_item_ref, reason, expected_version, uow)
  |   Failed -> mark_failed(relay_item_ref, reason, expected_version, uow)
```

Relay red lines:

- Publisher only receives `ArtifactPendingRelayItem` + `ArtifactRelayPayloadSnapshot`.
- Missing payload snapshot is never repaired by reading current truth.
- Relay publication failure never rolls back the accepted command / job transaction that created the relay item.
- Worker cannot directly access repository / publisher;it must call `ArtifactRelayPublicationService.publish_pending_artifact_relays(...)`.

---

## 12. Command flow batch 9.1-a: intake / fact / version

本批覆盖输入收束、fact truth 建立、version candidate、publish 和 supersede。所有 flow 都使用 §7 shared command template。为避免实现侧自行补 schema,本批同步修正 Step 7 / Step 8: `CreateArtifactVersionCandidateInput` 和 `CreateArtifactVersionCandidateRequest` 必须携带 `submission_ref: ArtifactSubmissionRef`,作为 `ArtifactVersionCandidate::from_submission(...)` 的唯一来源。

### 12.1 `RegisterArtifactIntakeFlow`

| 项目 | 内容 |
|---|---|
| 协议 | `ArtifactCommandRequest<RegisterArtifactIntakeRequest>` |
| service entry | `ArtifactIntakeReviewService.register_artifact_intake(input)` |
| service input | `RegisterArtifactIntakeInput` |
| 目标对象 | `ArtifactIntakeContext`, `ArtifactSubmissionRecord`, optional `ArtifactInputResolutionRecord`, optional `ExternalReferenceResolutionState`, optional `ArtifactLocalMirrorSnapshot` |
| 依赖 port | `ArtifactOperationContextFactory`, `ArtifactIdempotencyRepository`, `ArtifactIntakeContextRepository`, `ArtifactSubmissionRepository`, `ArtifactBoundaryAuditRepository.append_input_resolution`, `ExternalArtifactSourceResolverPort.resolve_content_source`, `ExternalReferenceResolutionStateRepository`, `ArtifactLocalMirrorSnapshotRepository`, `StoredArtifactResultRepository`, `ArtifactCommittedChangeRelayRepository`, `IdGeneratorPort`, `ArtifactUnitOfWorkManager` |
| accepted result | `ArtifactIntakeWriteResult` -> `ArtifactIntakeCommandResult` |
| outbound | 无 core truth relay;若实现要通知 derived stale,只能由后续 consumer / job 的 `ArtifactDerivedViewStateChanged` 表达 |
| 测试切口 | source resolved success; unresolved source delayed/pending; duplicate replay; conflict rejection; no body persisted; optional context refs copied only as refs |

```text
[API handler]
  | validate RegisterArtifactIntakeRequest
  | build ArtifactCommandCallContext from envelope metadata
  v
[ArtifactIntakeReviewService.register_artifact_intake]
  | uow begin + idempotency reserve
  | existing = ArtifactIntakeContextRepository.find_by_source(source_ref)
  | resolution = ExternalArtifactSourceResolverPort.resolve_content_source(source_ref)
  v
[Domain]
  | if existing exists:
  |   intake = existing.value
  |   expected_version = Some(existing.version)
  | else:
  |   intake = ArtifactIntakeContext::from_source(new_artifact_intake_context_ref(), source_ref, intake_kind)
  | match resolution:
  |   Resolved { state, body: mirror_snapshot }:
  |     save mirror snapshot
  |     save / update ExternalReferenceResolutionState from state
  |     intake.resolve_source(source_ref)
  |   Unresolved / Failed:
  |     save / update ExternalReferenceResolutionState from state reason
  |     intake.mark_pending_reference(resolution_state_ref)
  | submission = ArtifactSubmissionRecord::record(new_artifact_submission_ref(), intake.to_ref(), actor_ref, source_ref)
  | if intake is resolved -> submission.accept()
  | else -> keep submission received and record pending resolution
  | input_resolution = ArtifactInputResolutionRecord::record_resolution(...)
  v
[Persistence]
  | intake_repo.save(intake, expected_version, uow)
  | submission_repo.save(submission, None, uow)
  | boundary_audit_repo.append_input_resolution(input_resolution, uow)
  | save StoredArtifactOperationResult::CommandResult
  | idempotency.complete(...)
  | commit
```

```rust
let intake = ArtifactIntakeContext::from_source(
    id_generator.new_artifact_intake_context_ref(),
    input.source_ref,
    input.intake_kind,
);
```

| 分支 | 处理口径 |
|---|---|
| accepted resolved | save intake as `Resolved`, save accepted submission, append input resolution record, store result |
| accepted pending | save intake as `PendingReference`, save received submission, append pending input resolution record, store result |
| duplicate | rollback current UoW, load `get_command_result(...)` or `get_command_rejection(...)`, return replay |
| duplicate conflict | mark idempotency conflict, save rejection envelope with `DuplicateConflict`, no domain transition |
| resolver `ApplicationError` | maps to Step 12 application failure;does not become business `Unresolved` unless resolver returned `ArtifactReferenceRefreshResolution::Unresolved` |
| invalid source/body | reject before saving intake;store command rejection |

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| DTO 构造 | 通过 | request body fields copy 1:1;context from envelope |
| domain method | 通过 | `from_source`, `resolve_source`, `mark_pending_reference`, `ArtifactSubmissionRecord::record`, `accept`, `record_resolution` |
| port | 通过 | intake/submission/audit/resolver/reference/mirror/result/idempotency ports already exist |
| version 来源 | 通过 | existing intake uses `existing.version`;new intake/submission/audit use `None` |
| 副作用 | 通过 | no core truth;no relay unless future state change flow explicitly defines derived state change |
| 禁止事项 | 通过 | no external body, no fact/version creation, no query-side write |

### 12.2 `EstablishArtifactFactFlow`

| 项目 | 内容 |
|---|---|
| 协议 | `ArtifactCommandRequest<EstablishArtifactFactRequest>` |
| service entry | `ArtifactTruthWriteService.establish_artifact_fact(input)` |
| service input | `EstablishArtifactFactInput` |
| 目标对象 | `ArtifactFact`, `ArtifactContentFactContext`, loaded `ArtifactIntakeContext`, optional loaded `ArtifactReviewAnchor` |
| 依赖 port | `ArtifactIntakeContextRepository`, `ArtifactContentContextRepository`, `ArtifactFactRepository`, `ArtifactReviewAnchorRepository`, `ArtifactChangeRecordRepository.append_fact_change`, `ArtifactTraceRepository`, `StoredArtifactResultRepository`, `ArtifactCommittedChangeRelayRepository`, `IdGeneratorPort`, UoW / idempotency |
| policy | `ArtifactFactPolicy.assert_fact_establishable`, `assert_no_external_body_ownership`, `assert_no_derived_material_as_truth`, `assert_single_truth_anchor` |
| accepted result | `ArtifactTruthWriteResult` -> `ArtifactTruthCommandResult` |
| outbound | `ArtifactCommittedChange::Fact` -> `ArtifactFactChanged` |
| 测试切口 | establish success; intake missing; intake pending rejected; duplicate fact anchor rejected; content unavailable rejected; review hint missing rejected; duplicate replay; relay snapshot stored |

```text
[ArtifactTruthWriteService.establish_artifact_fact]
  | uow begin + idempotency reserve
  | intake_v = ArtifactIntakeContextRepository.get_with_version(intake_context_ref)
  | existing_fact = ArtifactFactRepository.find_by_content_context(content_context_ref from intake/source path when available)
  | review_v = ArtifactReviewAnchorRepository.get_with_version(review_anchor_ref) when provided
  v
[Domain]
  | content_context = ArtifactContentFactContext::from_source(new_content_context_ref, intake.source_ref)
  | policy = ArtifactFactPolicy { intake_context_ref, content_resolution_state_ref }
  | policy.assert_fact_establishable(intake, content_context)
  | policy.assert_no_external_body_ownership(content_context)
  | policy.assert_no_derived_material_as_truth(intake.source_ref)
  | policy.assert_single_truth_anchor(existing_fact.ref?)
  | intake.transfer_to_truth_write()
  | fact = ArtifactFact::new_pending(new_artifact_fact_ref(), definition_ref, content_context.to_ref(), intake.to_ref())
  | fact.establish()
  | change_record = ArtifactFactChangeRecord::record_change(new_fact_change_record_ref(), fact, Established, actor_ref, publish_basis?)
  v
[Persistence]
  | content_context_repo.save(content_context, None, uow)
  | intake_repo.save(intake, Some(intake_v.version), uow)
  | fact_repo.save(fact, None, uow)
  | change_repo.append_fact_change(change_record, uow)
  | trace_repo.append(ArtifactTraceRecord::record_trace(...), uow) when traceability is required by current actor/consumer context
  | truth_cursor = uow.assign_truth_cursor()
  | append relay `ArtifactCommittedChange::Fact { artifact_fact_ref, content_context_ref, change_kind: Established, truth_cursor }`
  | save command result and complete idempotency
  | commit
```

| 分支 | 处理口径 |
|---|---|
| accepted | creates content context and fact, transfers intake, appends fact change, relay and stored result |
| duplicate | stored command result / rejection replay only |
| intake missing | rejected as `MissingRequiredReference` before new refs are persisted |
| intake pending / rejected | rejected as `InvalidState` / `PolicyRejected`;no fact created |
| duplicate truth anchor | rejected through `ArtifactFactPolicy.assert_single_truth_anchor(...)` |
| review hint invalid | rejected before fact creation;review anchor is not created here |

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| DTO 构造 | 通过 | `intake_context_ref`, `definition_ref`, `review_anchor_ref` all explicit |
| domain method | 通过 | fact/content/intake/change-record methods are in Step 6 |
| port | 通过 | all repository and relay surfaces are in Step 7 |
| version 来源 | 通过 | intake expected version from `intake_v.version`;new content/fact use `None` |
| 副作用 | 通过 | fact truth, content context, intake transfer, change record, relay snapshot, stored result |
| 禁止事项 | 通过 | no source body saved;no candidate/version created implicitly |

### 12.3 `CreateArtifactVersionCandidateFlow`

| 项目 | 内容 |
|---|---|
| 协议 | `ArtifactCommandRequest<CreateArtifactVersionCandidateRequest>` |
| service entry | `ArtifactTruthWriteService.create_artifact_version_candidate(input)` |
| service input | `CreateArtifactVersionCandidateInput` |
| 目标对象 | `ArtifactVersionCandidate`, loaded `ArtifactFact`, loaded `ArtifactContentFactContext`, loaded `ArtifactSubmissionRecord` |
| 依赖 port | `ArtifactFactRepository`, `ArtifactContentContextRepository`, `ArtifactSubmissionRepository`, `ArtifactVersionCandidateRepository`, `StoredArtifactResultRepository`, UoW / idempotency / id generator |
| policy | `ArtifactVersionPolicy.assert_history_traceable` and fact/content boundary checks |
| accepted result | `ArtifactTruthWriteResult` with `truth_anchor_ref = ArtifactTruthAnchorRef::Fact(artifact_fact_ref)` and no version change record |
| outbound | no `ArtifactVersionChanged` until publish;candidate creation remains support state unless Step 8 adds a candidate event later |
| 测试切口 | candidate success; fact missing; content context missing; submission missing; submission not accepted; duplicate replay; candidate does not bind current version |

```text
[ArtifactTruthWriteService.create_artifact_version_candidate]
  | uow begin + idempotency reserve
  | fact_v = ArtifactFactRepository.get_with_version(artifact_fact_ref)
  | content_v = ArtifactContentContextRepository.get_with_version(proposed_content_context_ref)
  | submission_v = ArtifactSubmissionRepository.get_with_version(submission_ref)
  v
[Domain]
  | assert fact is established and owns candidate-compatible truth anchor
  | assert content context is linked/verified and not unavailable
  | assert submission is accepted and belongs to an intake compatible with fact.intake_context_ref
  | candidate = ArtifactVersionCandidate::from_submission(new_candidate_ref(), fact.ref, proposed_content_context_ref, candidate_source_ref, submission_ref)
  | candidate.mark_ready() only when policy says publish-ready evidence is already complete
  v
[Persistence]
  | candidate_repo.save(candidate, None, uow)
  | save command result and complete idempotency
  | commit
```

| 分支 | 处理口径 |
|---|---|
| accepted | save candidate only;fact current version remains unchanged |
| accepted publish-ready | candidate may call `mark_ready()` when formal readiness is already loaded;no version object is created |
| duplicate | stored result replay |
| missing submission | rejected;service must not invent `submission_ref` |
| content unavailable | rejected;degraded read marker is not allowed on write path |
| fact terminal | rejected through state guard;candidate not saved |

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| DTO 构造 | 通过 | Step 7/8 now include `submission_ref` |
| domain method | 通过 | `ArtifactVersionCandidate::from_submission`, optional `mark_ready` |
| port | 通过 | fact/content/submission/candidate repositories exist |
| version 来源 | 通过 | loaded objects are read-only preconditions;new candidate uses `None` |
| 副作用 | 通过 | candidate only;no fact/version relay |
| 禁止事项 | 通过 | no formal version, no current binding, no body copy |

### 12.4 `PublishArtifactVersionFlow`

| 项目 | 内容 |
|---|---|
| 协议 | `ArtifactCommandRequest<PublishArtifactVersionRequest>` |
| service entry | `ArtifactTruthWriteService.publish_artifact_version(input)` |
| service input | `PublishArtifactVersionInput` |
| 目标对象 | loaded `ArtifactVersionCandidate`, loaded `ArtifactFact`, new `ArtifactVersion`, changed `ArtifactFact` |
| 依赖 port | `ArtifactVersionCandidateRepository`, `ArtifactFactRepository`, `ArtifactVersionRepository`, `ArtifactChangeRecordRepository.append_version_change`, `ArtifactTraceRepository`, `StoredArtifactResultRepository`, relay, UoW / idempotency / id generator |
| policy | `ArtifactVersionPolicy.assert_publish_allowed`, `assert_no_silent_overwrite`, `assert_history_traceable` |
| accepted result | `ArtifactTruthWriteResult` -> `ArtifactTruthCommandResult` |
| outbound | `ArtifactCommittedChange::Version` -> `ArtifactVersionChanged` |
| 测试切口 | first publish success; candidate not ready rejected; candidate/fact mismatch rejected; existing current without supersede rejected; duplicate replay; fact current bound to version ref |

```text
[ArtifactTruthWriteService.publish_artifact_version]
  | uow begin + idempotency reserve
  | candidate_v = ArtifactVersionCandidateRepository.get_with_version(candidate_ref)
  | fact_v = ArtifactFactRepository.get_with_version(candidate.artifact_fact_ref)
  | current_v = ArtifactVersionRepository.find_current_by_fact(fact.ref)
  v
[Domain]
  | policy = ArtifactVersionPolicy { artifact_fact_ref: fact.ref, current_version_ref: fact.current_version_ref }
  | policy.assert_publish_allowed(fact, candidate)
  | policy.assert_no_silent_overwrite(current_v.as_ref())
  | policy.assert_history_traceable(Some(candidate.ref))
  | version = ArtifactVersion::from_candidate(new_version_ref(), fact.ref, candidate.proposed_content_context_ref, candidate.ref)
  | version.publish()
  | fact.bind_current_version(version.to_ref())
  | version_change = ArtifactVersionChangeRecord::record_change(new_version_change_record_ref(), version, Published, actor_ref)
  v
[Persistence]
  | version_repo.save(version, None, uow)
  | fact_repo.save(fact, Some(fact_v.version), uow)
  | change_repo.append_version_change(version_change, uow)
  | truth_cursor = uow.assign_truth_cursor()
  | append relay `ArtifactCommittedChange::Version { artifact_version_ref, artifact_fact_ref, version_state: Published, truth_cursor }`
  | save command result and complete idempotency
  | commit
```

| 分支 | 处理口径 |
|---|---|
| accepted first publish | save version, update fact current, append version change, relay and stored result |
| existing current without explicit supersede | rejected;caller must use `SupersedeArtifactVersion` |
| duplicate | stored result replay |
| candidate missing / not ready / rejected | rejected before version creation |
| candidate fact mismatch | rejected through policy |
| relay append failure | fails current transaction before commit;truth is not committed without stored relay snapshot |

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| DTO 构造 | 通过 | request carries candidate ref and publish reason |
| domain method | 通过 | `from_candidate`, `publish`, `bind_current_version`, version change record |
| port | 通过 | candidate/fact/version/change/relay/result ports exist |
| version 来源 | 通过 | fact expected version from `fact_v.version`;new version uses `None` |
| 副作用 | 通过 | formal version and fact current binding, change record, relay, stored result |
| 禁止事项 | 通过 | no current latest shortcut;no candidate as public formal version |

### 12.5 `SupersedeArtifactVersionFlow`

| 项目 | 内容 |
|---|---|
| 协议 | `ArtifactCommandRequest<SupersedeArtifactVersionRequest>` |
| service entry | `ArtifactTruthWriteService.supersede_artifact_version(input)` |
| service input | `SupersedeArtifactVersionInput` |
| 目标对象 | loaded current `ArtifactVersion`, loaded next `ArtifactVersion`, loaded `ArtifactFact` |
| 依赖 port | `ArtifactVersionRepository`, `ArtifactFactRepository`, `ArtifactChangeRecordRepository.append_version_change`, `ArtifactTraceRepository`, `StoredArtifactResultRepository`, relay, UoW / idempotency |
| policy | `ArtifactVersionPolicy.assert_supersede_allowed`, `assert_no_silent_overwrite` |
| accepted result | `ArtifactTruthWriteResult` |
| outbound | `ArtifactCommittedChange::Version` for next version and optionally current retired/superseded marker if Step 10 keeps both transitions |
| 测试切口 | supersede success; cross-fact rejected; current not current rejected; next not published rejected; duplicate replay; fact current rebind |

```text
[ArtifactTruthWriteService.supersede_artifact_version]
  | uow begin + idempotency reserve
  | current_v = ArtifactVersionRepository.get_with_version(current_version_ref)
  | next_v = ArtifactVersionRepository.get_with_version(next_version_ref)
  | fact_v = ArtifactFactRepository.get_with_version(current.artifact_fact_ref)
  v
[Domain]
  | policy.assert_supersede_allowed(current, next)
  | assert fact.current_version_ref == Some(current_version_ref)
  | next.supersede(current_version_ref)
  | fact.bind_current_version(next_version_ref)
  | version_change = ArtifactVersionChangeRecord::record_change(new_version_change_record_ref(), next, Superseded, actor_ref)
  v
[Persistence]
  | version_repo.save(next, Some(next_v.version), uow)
  | fact_repo.save(fact, Some(fact_v.version), uow)
  | append version_change
  | truth_cursor = uow.assign_truth_cursor()
  | append relay `ArtifactCommittedChange::Version { artifact_version_ref: next_version_ref, artifact_fact_ref, version_state: next.version_state, truth_cursor }`
  | save command result and complete idempotency
  | commit
```

| 分支 | 处理口径 |
|---|---|
| accepted | next version records explicit supersede link and fact current points to next |
| current version missing | rejected before mutation |
| next version missing | rejected before mutation |
| cross fact | rejected by policy |
| stale current | rejected;service does not use repository latest to override request |
| duplicate | stored result replay |

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| DTO 构造 | 通过 | current / next / reason explicit |
| domain method | 通过 | `supersede`, `bind_current_version`, change record |
| port | 通过 | version/fact/change/relay/result ports exist |
| version 来源 | 通过 | next/fact expected versions from loaded objects |
| 副作用 | 通过 | current relationship preserved by `supersedes_version_ref`;fact current rebind persisted |
| 禁止事项 | 通过 | no dynamic latest, no deleting prior version |

### 12.6 9.1-a stop-review

| 检查项 | 结论 |
|---|---|
| 5 个 command 是否都有独立 flow | 是 |
| `ArtifactVersionCandidate.submission_ref` 是否闭口 | 是,已回补 Step 7/8 request/input 字段 |
| accepted path 是否全部有 stored result | 是 |
| duplicate 是否重跑 mutation | 否 |
| relay 是否只来自 accepted truth change | 是,fact/version publish/supersede 才 append relay |
| 是否有 query write / consumer truth write 混入 | 否 |

---

## 13. Command flow batch 9.1-b: lineage / baseline

本批覆盖 formal version 之间的 lineage 和 controlled baseline。所有 flow 必须保持两个核心约束: lineage 只能锚定 formal `ArtifactVersionRef`;baseline 成员必须显式保存为 `ArtifactBaselineMembership`,不得在 freeze 时动态解析 current latest。

### 13.1 `EstablishArtifactLineageLinkFlow`

| 项目 | 内容 |
|---|---|
| 协议 | `ArtifactCommandRequest<EstablishArtifactLineageLinkRequest>` |
| service entry | `ArtifactTruthWriteService.establish_artifact_lineage_link(input)` |
| service input | `EstablishArtifactLineageLinkInput` |
| 目标对象 | `ArtifactLineageLink`, loaded source / target `ArtifactVersion` |
| 依赖 port | `ArtifactVersionRepository`, `ArtifactLineageRepository`, `ArtifactChangeRecordRepository.append_lineage_change`, `StoredArtifactResultRepository`, relay, UoW / idempotency / id generator |
| policy | `ArtifactLineagePolicy.assert_anchor_versions_resolved`, `assert_relation_basis_sufficient`, `assert_no_runtime_trace_as_truth`, `assert_no_current_content_shortcut` |
| accepted result | `ArtifactLineageWriteResult` -> `ArtifactLineageCommandResult` |
| outbound | `ArtifactCommittedChange::Lineage` -> `ArtifactLineageChanged` |
| 测试切口 | establish success; source missing; target missing; duplicate endpoints rejected/replayed; basis insufficient; self-link rejected; relay snapshot stored |

```text
[ArtifactTruthWriteService.establish_artifact_lineage_link]
  | uow begin + idempotency reserve
  | source_v = ArtifactVersionRepository.get_with_version(source_version_ref)
  | target_v = ArtifactVersionRepository.get_with_version(target_version_ref)
  | existing = ArtifactLineageRepository.find_by_endpoints(source_version_ref, target_version_ref, relation_kind)
  v
[Domain]
  | policy = ArtifactLineagePolicy { source_version_ref, target_version_ref }
  | policy.assert_anchor_versions_resolved(source, target)
  | policy.assert_relation_basis_sufficient(basis_ref)
  | policy.assert_no_runtime_trace_as_truth(basis_ref)
  | policy.assert_no_current_content_shortcut(source.content_context_ref, target.content_context_ref)
  | reject if existing established lineage already exists
  | lineage = ArtifactLineageLink::connect(new_lineage_ref(), source_version_ref, target_version_ref, relation_kind, basis_ref)
  | lineage.establish()
  | change = ArtifactLineageChangeRecord::record_change(new_lineage_change_record_ref(), lineage, Established)
  v
[Persistence]
  | lineage_repo.save(lineage, None, uow)
  | change_repo.append_lineage_change(change, uow)
  | truth_cursor = uow.assign_truth_cursor()
  | append relay `ArtifactCommittedChange::Lineage { artifact_lineage_link_ref, source_version_ref, target_version_ref, relation_kind, truth_cursor }`
  | save command result and complete idempotency
  | commit
```

| 分支 | 处理口径 |
|---|---|
| accepted | save established lineage, append lineage change, relay and stored result |
| duplicate endpoint same relation | if prior result exists use idempotency replay;otherwise reject as duplicate truth anchor |
| missing source/target | reject before lineage ref generation |
| self-link | reject by policy / state guard |
| runtime trace as basis | reject;trace can support audit,not lineage truth |

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| DTO 构造 | 通过 | source/target/kind/basis explicit |
| domain method | 通过 | `connect`, `establish`, lineage change record |
| port | 通过 | version/lineage/change/relay/result ports exist |
| version 来源 | 通过 | new lineage uses `None`;source/target only precondition reads |
| 副作用 | 通过 | lineage truth + change + relay + stored result |
| 禁止事项 | 通过 | no candidate/view/current-content shortcut |

### 13.2 `RejectArtifactLineageLinkFlow`

| 项目 | 内容 |
|---|---|
| 协议 | `ArtifactCommandRequest<RejectArtifactLineageLinkRequest>` |
| service entry | `ArtifactTruthWriteService.reject_artifact_lineage_link(input)` |
| service input | `RejectArtifactLineageLinkInput` |
| 目标对象 | loaded `ArtifactLineageLink` |
| 依赖 port | `ArtifactLineageRepository`, `ArtifactChangeRecordRepository.append_lineage_change`, `StoredArtifactResultRepository`, relay, UoW / idempotency / id generator |
| accepted result | `ArtifactLineageWriteResult` |
| outbound | `ArtifactCommittedChange::Lineage` -> `ArtifactLineageChanged` |
| 测试切口 | reject pending success; reject established if allowed by Step 10; already rejected idempotent behavior; missing link; duplicate replay |

```text
[ArtifactTruthWriteService.reject_artifact_lineage_link]
  | uow begin + idempotency reserve
  | lineage_v = ArtifactLineageRepository.get_with_version(lineage_ref)
  v
[Domain]
  | lineage.reject(reject_reason)
  | change = ArtifactLineageChangeRecord::record_change(new_lineage_change_record_ref(), lineage, Rejected)
  v
[Persistence]
  | lineage_repo.save(lineage, Some(lineage_v.version), uow)
  | change_repo.append_lineage_change(change, uow)
  | truth_cursor = uow.assign_truth_cursor()
  | append relay `ArtifactCommittedChange::Lineage { ..., truth_cursor }`
  | save command result and complete idempotency
  | commit
```

| 分支 | 处理口径 |
|---|---|
| accepted | update lineage state to rejected, append change, relay and stored result |
| missing lineage | rejected as missing required reference |
| terminal lineage | rejected by domain transition |
| duplicate | stored result replay |
| optimistic conflict | repository save returns conflict;Step 12 maps to retryable / conflict response |

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| DTO 构造 | 通过 | link ref and reject reason explicit |
| domain method | 通过 | `reject`, lineage change record |
| port | 通过 | lineage get/save/change/relay/result |
| version 来源 | 通过 | `lineage_v.version` |
| 副作用 | 通过 | no deletion;history preserved |
| 禁止事项 | 通过 | rejection reason remains basis ref,not free text |

### 13.3 `CreateArtifactBaselineCandidateFlow`

| 项目 | 内容 |
|---|---|
| 协议 | `ArtifactCommandRequest<CreateArtifactBaselineCandidateRequest>` |
| service entry | `ArtifactTruthWriteService.create_artifact_baseline_candidate(input)` |
| service input | `CreateArtifactBaselineCandidateInput` |
| 目标对象 | `ArtifactBaseline`, multiple `ArtifactBaselineMembership`, loaded member `ArtifactVersion` |
| 依赖 port | `ArtifactVersionRepository`, `ArtifactBaselineRepository`, `ArtifactBaselineMembershipRepository`, `StoredArtifactResultRepository`, UoW / idempotency / id generator |
| policy | `ArtifactBaselinePolicy.assert_only_formal_versions`, `assert_historical_baseline_preserved` |
| accepted result | `ArtifactBaselineWriteResult` -> `ArtifactBaselineCommandResult` |
| outbound | no `ArtifactBaselineChanged` until freeze;candidate remains not frozen |
| 测试切口 | candidate success; empty members rejected; duplicate members rejected before service; member missing; member candidate/non-formal rejected; current baseline preserved |

```text
[ArtifactTruthWriteService.create_artifact_baseline_candidate]
  | uow begin + idempotency reserve
  | reject empty member_version_refs
  | reject duplicate member_version_refs while preserving request order
  | for each version_ref in order:
  |   version_v = ArtifactVersionRepository.get_with_version(version_ref)
  | current_baseline = ArtifactBaselineRepository.find_current_by_scope(baseline_scope_ref)
  v
[Domain]
  | membership_refs = []
  | for each loaded formal version:
  |   membership = ArtifactBaselineMembership::select(new_membership_ref(), new_baseline_ref, version.ref, membership_reason)
  |   membership_refs.push(membership.to_ref())
  | baseline = ArtifactBaseline::from_members(new_baseline_ref(), baseline_scope_ref, ArtifactBaselineMembershipRefSet(membership_refs))
  | policy.assert_only_formal_versions(memberships)
  | policy.assert_historical_baseline_preserved(current_baseline.as_ref())
  v
[Persistence]
  | baseline_repo.save(baseline, None, uow)
  | membership_repo.save(each membership, None, uow)
  | save command result and complete idempotency
  | commit
```

| 分支 | 处理口径 |
|---|---|
| accepted | save candidate baseline and selected memberships;no frozen relay |
| empty members | rejected before ids are generated |
| duplicate members | rejected before ids are generated |
| member not formal | rejected by policy |
| current baseline exists | preserved;candidate does not supersede until explicit flow |

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| DTO 构造 | 通过 | candidate request does not need freeze context |
| domain method | 通过 | `from_members` creates candidate with `freeze_context_ref = None` |
| port | 通过 | version/baseline/membership repositories exist |
| version 来源 | 通过 | new baseline/members use `None`;loaded versions are preconditions |
| 副作用 | 通过 | candidate only,no relay |
| 禁止事项 | 通过 | no dynamic current latest;no synthetic review anchor |

### 13.4 `FreezeArtifactBaselineFlow`

| 项目 | 内容 |
|---|---|
| 协议 | `ArtifactCommandRequest<FreezeArtifactBaselineRequest>` |
| service entry | `ArtifactTruthWriteService.freeze_artifact_baseline(input)` |
| service input | `FreezeArtifactBaselineInput` |
| 目标对象 | loaded `ArtifactBaseline`, loaded `ArtifactBaselineMembership[]`, loaded `ArtifactReviewAnchor` |
| 依赖 port | `ArtifactBaselineRepository`, `ArtifactBaselineMembershipRepository`, `ArtifactReviewAnchorRepository`, `ArtifactChangeRecordRepository.append_baseline_change`, `StoredArtifactResultRepository`, relay, UoW / idempotency |
| policy | `ArtifactBaselinePolicy.assert_only_formal_versions`, `assert_freeze_context_ready`, `assert_no_dynamic_current_resolution` |
| accepted result | `ArtifactBaselineWriteResult` |
| outbound | `ArtifactCommittedChange::Baseline` -> `ArtifactBaselineChanged` |
| 测试切口 | freeze success; review missing/not ready; membership empty; membership non-formal; already frozen; duplicate replay |

```text
[ArtifactTruthWriteService.freeze_artifact_baseline]
  | uow begin + idempotency reserve
  | baseline_v = ArtifactBaselineRepository.get_with_version(baseline_ref)
  | memberships_page = ArtifactBaselineMembershipRepository.list_by_baseline(baseline_ref, full page discipline from Step 13)
  | review_v = ArtifactReviewAnchorRepository.get_with_version(freeze_context_ref)
  v
[Domain]
  | policy.assert_freeze_context_ready(review)
  | policy.assert_only_formal_versions(memberships)
  | policy.assert_no_dynamic_current_resolution(baseline)
  | baseline.freeze(freeze_context_ref)
  | for each membership: membership.freeze_member()
  | baseline_change = ArtifactBaselineChangeRecord::record_change(new_baseline_change_record_ref(), baseline, Frozen, actor_ref)
  v
[Persistence]
  | membership_repo.save(each membership, Some(version), uow)
  | baseline_repo.save(baseline, Some(baseline_v.version), uow)
  | change_repo.append_baseline_change(baseline_change, uow)
  | truth_cursor = uow.assign_truth_cursor()
  | append relay `ArtifactCommittedChange::Baseline { artifact_baseline_ref, baseline_scope_ref, baseline_state: Frozen, truth_cursor }`
  | save command result and complete idempotency
  | commit
```

| 分支 | 处理口径 |
|---|---|
| accepted | freezes baseline and all memberships, appends change, relay and stored result |
| review missing/not ready | rejected before mutation |
| membership page incomplete | Step 13 must define page completeness;implementation cannot freeze partial membership set |
| already frozen/superseded/retired | rejected by domain transition |
| duplicate | stored result replay |

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| DTO 构造 | 通过 | baseline ref and freeze context explicit |
| domain method | 通过 | `freeze`, `freeze_member`, baseline change record |
| port | 通过 | baseline/membership/review/change/relay/result |
| version 来源 | 通过 | baseline and membership versions from loaded pages |
| 副作用 | 通过 | frozen truth, membership freeze, change, relay, stored result |
| 禁止事项 | 通过 | no dynamic current resolution |

### 13.5 `SupersedeArtifactBaselineFlow`

| 项目 | 内容 |
|---|---|
| 协议 | `ArtifactCommandRequest<SupersedeArtifactBaselineRequest>` |
| service entry | `ArtifactTruthWriteService.supersede_artifact_baseline(input)` |
| service input | `SupersedeArtifactBaselineInput` |
| 目标对象 | loaded current `ArtifactBaseline`, loaded next `ArtifactBaseline` |
| 依赖 port | `ArtifactBaselineRepository`, `ArtifactChangeRecordRepository.append_baseline_change`, `StoredArtifactResultRepository`, relay, UoW / idempotency |
| policy | `ArtifactBaselinePolicy.assert_historical_baseline_preserved` |
| accepted result | `ArtifactBaselineWriteResult` |
| outbound | `ArtifactCommittedChange::Baseline` -> `ArtifactBaselineChanged` for current superseded |
| 测试切口 | supersede success; cross-scope rejected; current not frozen rejected; next not frozen rejected unless Step 10 allows candidate next; duplicate replay |

```text
[ArtifactTruthWriteService.supersede_artifact_baseline]
  | uow begin + idempotency reserve
  | current_v = ArtifactBaselineRepository.get_with_version(current_baseline_ref)
  | next_v = ArtifactBaselineRepository.get_with_version(next_baseline_ref)
  v
[Domain]
  | assert current.baseline_scope_ref == next.baseline_scope_ref
  | policy.assert_historical_baseline_preserved(Some(current))
  | current.supersede()
  | baseline_change = ArtifactBaselineChangeRecord::record_change(new_baseline_change_record_ref(), current, Superseded, actor_ref)
  v
[Persistence]
  | baseline_repo.save(current, Some(current_v.version), uow)
  | change_repo.append_baseline_change(baseline_change, uow)
  | truth_cursor = uow.assign_truth_cursor()
  | append relay `ArtifactCommittedChange::Baseline { artifact_baseline_ref: current_ref, baseline_scope_ref, baseline_state: Superseded, truth_cursor }`
  | save command result and complete idempotency
  | commit
```

| 分支 | 处理口径 |
|---|---|
| accepted | current baseline moves to superseded;next remains explicit separate baseline |
| missing current/next | rejected before mutation |
| cross-scope | rejected;no implicit migration |
| next not suitable | rejected;Step 10 decides allowed next states |
| duplicate | stored result replay |

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| DTO 构造 | 通过 | current and next explicit |
| domain method | 通过 | `supersede`, baseline change record |
| port | 通过 | baseline/change/relay/result ports exist |
| version 来源 | 通过 | current expected version from `current_v.version` |
| 副作用 | 通过 | no membership rewrite;history preserved |
| 禁止事项 | 通过 | no deletion, no dynamic current baseline selector |

### 13.6 9.1-b stop-review

| 检查项 | 结论 |
|---|---|
| 5 个 lineage / baseline command 是否都有独立 flow | 是 |
| lineage 是否只锚定 formal version | 是 |
| baseline 是否禁止 current latest 动态解析 | 是 |
| duplicate 是否重跑 mutation | 否 |
| relay 是否只来自 accepted lineage / frozen-or-superseded baseline | 是 |
| 当前设计缺口 | 无;baseline candidate 的 freeze context 已由 Step 6 调整为冻结时绑定 |

---

## 14. Command flow batch 9.1-c: review / automation / consumption

本批覆盖 review anchor、responsibility、automation candidate-only boundary、consumable reference 和 explicit consumption backref。所有 flow 都保持 support boundary 语义:review 不改 truth,automation 不直接 truth 化,query read 不自动记录 consumption。

### 14.1 `OpenArtifactReviewAnchorFlow`

| 项目 | 内容 |
|---|---|
| 协议 | `ArtifactCommandRequest<OpenArtifactReviewAnchorRequest>` |
| service entry | `ArtifactIntakeReviewService.open_artifact_review_anchor(input)` |
| service input | `OpenArtifactReviewAnchorInput` |
| 目标对象 | `ArtifactReviewAnchor`, `ArtifactReviewTraceRecord` |
| 依赖 port | `ArtifactReviewAnchorRepository`, `ArtifactBoundaryAuditRepository.append_review_trace`, `StoredArtifactResultRepository`, relay, UoW / idempotency / id generator |
| policy | `ArtifactReviewPolicy.assert_review_anchor_resolved`, `assert_no_view_state_as_basis` |
| accepted result | `ArtifactReviewWriteResult` -> `ArtifactReviewCommandResult` |
| outbound | `ArtifactCommittedChange::Review` -> `ArtifactReviewChanged` |
| 测试切口 | open success; duplicate open by truth anchor rejected or replayed; candidate/view anchor rejected; duplicate replay; relay snapshot stored |

```text
[ArtifactIntakeReviewService.open_artifact_review_anchor]
  | uow begin + idempotency reserve
  | existing = ArtifactReviewAnchorRepository.find_open_by_truth_anchor(truth_anchor_ref)
  v
[Domain]
  | reject if existing open anchor exists and this is not idempotency replay
  | review = ArtifactReviewAnchor::from_truth_anchor(new_review_anchor_ref(), truth_anchor_ref, review_reason)
  | review.mark_ready()
  | trace = ArtifactReviewTraceRecord::record_trace(new_review_trace_record_ref(), review, None, Opened)
  v
[Persistence]
  | review_repo.save(review, None, uow)
  | boundary_audit_repo.append_review_trace(trace, uow)
  | truth_cursor = uow.assign_truth_cursor()
  | append relay `ArtifactCommittedChange::Review { review_anchor_ref, responsibility_assignment_ref: None, review_state, truth_cursor }`
  | save command result and complete idempotency
  | commit
```

| 分支 | 处理口径 |
|---|---|
| accepted | creates ready review anchor, append review trace, relay and stored result |
| duplicate open subject | duplicate with same idempotency replays;otherwise rejected as duplicate open review anchor |
| invalid truth anchor | rejected before review ref generation |
| duplicate | stored result replay |

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| DTO 构造 | 通过 | truth anchor and reason explicit |
| domain method | 通过 | `from_truth_anchor`, `mark_ready`, review trace record |
| port | 通过 | review/audit/relay/result ports exist |
| version 来源 | 通过 | new review uses `None` |
| 副作用 | 通过 | review support object + audit trace + relay |
| 禁止事项 | 通过 | no truth lifecycle mutation |

### 14.2 `AssignArtifactResponsibilityFlow`

| 项目 | 内容 |
|---|---|
| 协议 | `ArtifactCommandRequest<AssignArtifactResponsibilityRequest>` |
| service entry | `ArtifactIntakeReviewService.assign_artifact_responsibility(input)` |
| service input | `AssignArtifactResponsibilityInput` |
| 目标对象 | `ArtifactResponsibilityAssignment`, changed `ArtifactReviewAnchor`, `ArtifactReviewTraceRecord` |
| 依赖 port | `ArtifactReviewAnchorRepository`, `ArtifactResponsibilityRepository`, `ArtifactBoundaryAuditRepository.append_review_trace`, `StoredArtifactResultRepository`, relay, UoW / idempotency / id generator |
| policy | `ArtifactReviewPolicy.assert_review_anchor_resolved`, `assert_responsibility_explainable` |
| accepted result | `ArtifactReviewWriteResult` |
| outbound | `ArtifactCommittedChange::Review` -> `ArtifactReviewChanged` |
| 测试切口 | assign success; review missing; review closed/invalid; duplicate assignment rejected; actor copied by ref only; relay stored |

```text
[ArtifactIntakeReviewService.assign_artifact_responsibility]
  | uow begin + idempotency reserve
  | review_v = ArtifactReviewAnchorRepository.get_with_version(review_anchor_ref)
  | existing_assignments = ArtifactResponsibilityRepository.list_by_review_anchor(review_anchor_ref, page)
  v
[Domain]
  | reject if active assignment already exists for this review unless Step 10 allows replacement
  | assignment = ArtifactResponsibilityAssignment::from_review_anchor(new_assignment_ref(), review_anchor_ref, basis_ref, responsible_party_ref)
  | assignment.assign()
  | review.wait_responsibility(assignment.to_ref())
  | trace = ArtifactReviewTraceRecord::record_trace(new_review_trace_record_ref(), review, Some(assignment.to_ref()), ResponsibilityAssigned)
  v
[Persistence]
  | responsibility_repo.save(assignment, None, uow)
  | review_repo.save(review, Some(review_v.version), uow)
  | boundary_audit_repo.append_review_trace(trace, uow)
  | truth_cursor = uow.assign_truth_cursor()
  | append relay `ArtifactCommittedChange::Review { review_anchor_ref, responsibility_assignment_ref: Some(assignment_ref), review_state, truth_cursor }`
  | save command result and complete idempotency
  | commit
```

| 分支 | 处理口径 |
|---|---|
| accepted | creates assignment, links review, append review trace, relay and stored result |
| review missing | rejected |
| active assignment exists | rejected unless a future state matrix defines replacement |
| invalid actor/basis | rejected before save |
| duplicate | stored result replay |

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| DTO 构造 | 通过 | review anchor, actor and basis explicit |
| domain method | 通过 | assignment factory/assign and review wait responsibility |
| port | 通过 | review/responsibility/audit/relay/result ports exist |
| version 来源 | 通过 | review expected version from `review_v.version`;new assignment uses `None` |
| 副作用 | 通过 | review support state + assignment + audit trace + relay |
| 禁止事项 | 通过 | actor profile body not stored |

### 14.3 `RegisterAutomationArtifactInputFlow`

| 项目 | 内容 |
|---|---|
| 协议 | `ArtifactCommandRequest<RegisterAutomationArtifactInputRequest>` |
| service entry | `ArtifactIntakeReviewService.register_automation_artifact_input(input)` |
| service input | `RegisterAutomationArtifactInputInput` |
| 目标对象 | `AutomationArtifactInput`, `AutomationIntakeAuditRecord` |
| 依赖 port | `AutomationArtifactInputRepository`, `ArtifactBoundaryAuditRepository.append_automation_audit`, `ExternalArtifactSourceResolverPort.resolve_automation_source`, `StoredArtifactResultRepository`, UoW / idempotency / id generator |
| policy | `AutomationBoundaryPolicy.assert_no_direct_truth_creation`, `assert_source_traceable` |
| accepted result | `ArtifactAutomationWriteResult` -> `ArtifactAutomationCommandResult` |
| outbound | no core truth relay;automation candidate is boundary support |
| 测试切口 | register success; unresolved automation source rejected/pending; derived_from missing/non-truth rejected; duplicate replay; no runtime body persisted |

```text
[ArtifactIntakeReviewService.register_automation_artifact_input]
  | uow begin + idempotency reserve
  | source_resolution = ExternalArtifactSourceResolverPort.resolve_automation_source(automation_source_ref)
  | existing_inputs = AutomationArtifactInputRepository.list_by_source(automation_source_ref, page)
  v
[Domain]
  | policy.assert_no_direct_truth_creation(derived_from_ref)
  | policy.assert_source_traceable(resolution_state)
  | automation_input = AutomationArtifactInput::from_source(new_automation_input_ref(), automation_source_ref, candidate_kind, derived_from_ref)
  | audit = AutomationIntakeAuditRecord::record_audit(new_automation_audit_ref(), automation_input.to_ref(), Registered, Accepted, None)
  v
[Persistence]
  | automation_repo.save(automation_input, None, uow)
  | boundary_audit_repo.append_automation_audit(audit, uow)
  | save command result and complete idempotency
  | commit
```

| 分支 | 处理口径 |
|---|---|
| accepted | saves automation input and audit record only |
| unresolved source | rejected or pending according to Step 12;no truth write |
| duplicate runtime source | idempotency replay if same request;otherwise policy/state rejection |
| derived_from not formal truth | rejected |
| duplicate | stored result replay |

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| DTO 构造 | 通过 | source, candidate kind and formal anchor explicit |
| domain method | 通过 | `from_source`, automation audit record |
| port | 通过 | automation/audit/resolver/result ports exist |
| version 来源 | 通过 | new automation input uses `None` |
| 副作用 | 通过 | support object + audit only |
| 禁止事项 | 通过 | no direct fact/version/lineage/baseline truth |

### 14.4 `AcceptAutomationArtifactInputFlow`

| 项目 | 内容 |
|---|---|
| 协议 | `ArtifactCommandRequest<AcceptAutomationArtifactInputRequest>` |
| service entry | `ArtifactIntakeReviewService.accept_automation_artifact_input(input)` |
| service input | `AcceptAutomationArtifactInputInput` |
| 目标对象 | loaded `AutomationArtifactInput`, loaded `ArtifactIntakeContext`, `AutomationIntakeAuditRecord` |
| 依赖 port | `AutomationArtifactInputRepository`, `ArtifactIntakeContextRepository`, `ArtifactBoundaryAuditRepository.append_automation_audit`, `StoredArtifactResultRepository`, UoW / idempotency |
| policy | `AutomationBoundaryPolicy.assert_candidate_only`, `assert_requires_formal_convergence` |
| accepted result | `ArtifactAutomationWriteResult` |
| outbound | no core truth relay |
| 测试切口 | accept success; automation missing; intake missing/pending rejected; already accepted replay/reject; no truth creation |

```text
[ArtifactIntakeReviewService.accept_automation_artifact_input]
  | uow begin + idempotency reserve
  | automation_v = AutomationArtifactInputRepository.get_with_version(automation_input_ref)
  | intake_v = ArtifactIntakeContextRepository.get_with_version(intake_context_ref)
  v
[Domain]
  | policy.assert_candidate_only(automation_input)
  | policy.assert_requires_formal_convergence(None or review_anchor_ref from future flow)
  | automation_input.accept()
  | audit = AutomationIntakeAuditRecord::record_audit(new_automation_audit_ref(), automation_input.to_ref(), AcceptedIntoIntake, Accepted, Some(intake_context_ref))
  v
[Persistence]
  | automation_repo.save(automation_input, Some(automation_v.version), uow)
  | boundary_audit_repo.append_automation_audit(audit, uow)
  | save command result and complete idempotency
  | commit
```

| 分支 | 处理口径 |
|---|---|
| accepted | automation input enters formal convergence;intake is referenced but not converted to truth here |
| automation missing | rejected |
| intake missing / rejected | rejected |
| automation terminal | rejected by domain transition |
| duplicate | stored result replay |

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| DTO 构造 | 通过 | automation input and intake context explicit |
| domain method | 通过 | `accept`, automation audit record |
| port | 通过 | automation/intake/audit/result ports exist |
| version 来源 | 通过 | automation expected version from loaded object |
| 副作用 | 通过 | automation state + audit only |
| 禁止事项 | 通过 | does not establish fact or version |

### 14.5 `IssueConsumableArtifactReferenceFlow`

| 项目 | 内容 |
|---|---|
| 协议 | `ArtifactCommandRequest<IssueConsumableArtifactReferenceRequest>` |
| service entry | `ArtifactTruthWriteService.issue_consumable_artifact_reference(input)` |
| service input | `IssueConsumableArtifactReferenceInput` |
| 目标对象 | `ConsumableArtifactReference` |
| 依赖 port | `ConsumableArtifactReferenceRepository`, `StoredArtifactResultRepository`, relay, UoW / idempotency / id generator |
| policy | `ArtifactReadVisibilityPolicy.assert_visible` only after object exists;pre-issue uses truth anchor formal check from Step 10 |
| accepted result | `ArtifactConsumptionWriteResult` -> `ArtifactConsumptionCommandResult` |
| outbound | `ArtifactCommittedChange::Consumable` -> `ConsumableArtifactReferenceChanged` |
| 测试切口 | issue success; duplicate truth-anchor/scope returns existing or rejects per Step 10; non-formal truth anchor rejected; duplicate replay; relay stored |

```text
[ArtifactTruthWriteService.issue_consumable_artifact_reference]
  | uow begin + idempotency reserve
  | existing = ConsumableArtifactReferenceRepository.find_by_truth_anchor_and_scope(truth_anchor_ref, consumer_scope_ref)
  v
[Domain]
  | reject if existing ready consumable exists and this is not idempotency replay
  | reference = ConsumableArtifactReference::from_anchor(new_consumable_ref(), truth_anchor_ref, consumer_scope_ref)
  v
[Persistence]
  | consumable_repo.save(reference, None, uow)
  | truth_cursor = uow.assign_truth_cursor()
  | append relay `ArtifactCommittedChange::Consumable { consumable_ref, truth_anchor_ref, reference_state: Ready, truth_cursor }`
  | save command result and complete idempotency
  | commit
```

| 分支 | 处理口径 |
|---|---|
| accepted | creates ready consumable ref, relay and stored result |
| existing same anchor/scope | replay only if same idempotency;otherwise reject or return existing only if Step 12 defines idempotent semantic |
| non-formal truth anchor | rejected |
| duplicate | stored result replay |
| relay failure | transaction fails before commit |

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| DTO 构造 | 通过 | truth anchor and consumer scope explicit |
| domain method | 通过 | `from_anchor` |
| port | 通过 | consumable repository + relay/result |
| version 来源 | 通过 | new consumable uses `None` |
| 副作用 | 通过 | consumable support truth + relay + stored result |
| 禁止事项 | 通过 | no read surface generation here |

### 14.6 `RecordArtifactConsumptionBackrefFlow`

| 项目 | 内容 |
|---|---|
| 协议 | `ArtifactCommandRequest<RecordArtifactConsumptionBackrefRequest>` |
| service entry | `ArtifactTruthWriteService.record_artifact_consumption_backref(input)` |
| service input | `RecordArtifactConsumptionBackrefInput` |
| 目标对象 | `ArtifactConsumptionBackref`, `ArtifactTraceRecord`, optional changed `ArtifactConsumptionBackref` explained state |
| 依赖 port | `ConsumableArtifactReferenceRepository`, `ArtifactConsumptionBackrefRepository`, `ArtifactTraceRepository`, `StoredArtifactResultRepository`, relay, UoW / idempotency / id generator |
| policy | `ArtifactTraceabilityPolicy.assert_no_unanchored_consumption`, `assert_backref_complete` |
| accepted result | `ArtifactConsumptionWriteResult` |
| outbound | `ArtifactCommittedChange::Traceability` -> `ArtifactTraceAvailable` |
| 测试切口 | record success; consumable missing/restricted; duplicate consumer+consumable backref; trace link explained; query does not auto-write backref |

```text
[ArtifactTruthWriteService.record_artifact_consumption_backref]
  | uow begin + idempotency reserve
  | consumable_v = ConsumableArtifactReferenceRepository.get_with_version(consumable_ref)
  | existing_by_consumer_page = ArtifactConsumptionBackrefRepository.list_by_consumer(consumer_ref, page)
  v
[Domain]
  | policy.assert_no_unanchored_consumption(consumable)
  | reject if existing active backref for same consumer + consumable exists and not idempotency replay
  | backref = ArtifactConsumptionBackref::record(new_backref_ref(), consumer_ref, consumable_ref, consumption_reason)
  | trace = ArtifactTraceRecord::record_trace(new_trace_record_ref(), consumer_ref, consumable.truth_anchor_ref, ConsumptionBackrefRecorded, Recorded, Some(backref.to_ref()))
  | backref.mark_explained(trace.to_ref())
  | policy.assert_backref_complete(backref)
  v
[Persistence]
  | backref_repo.save(backref, None, uow)
  | trace_repo.append(trace, uow)
  | truth_cursor = uow.assign_truth_cursor()
  | append relay `ArtifactCommittedChange::Traceability { trace_record_ref, truth_anchor_ref, handoff_record_ref: None, trace_state: Recorded, truth_cursor }`
  | save command result and complete idempotency
  | commit
```

| 分支 | 处理口径 |
|---|---|
| accepted | saves backref, appends trace, marks backref explained, relay and stored result |
| consumable missing | rejected |
| consumable restricted/stale/unavailable | rejected or policy maps to Step 12 command rejection;not degraded read |
| duplicate backref | replay only by idempotency;otherwise reject duplicate consumption explanation |
| duplicate | stored result replay |

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| DTO 构造 | 通过 | consumer, consumable and reason explicit |
| domain method | 通过 | `record`, `mark_explained`, trace record |
| port | 通过 | consumable/backref/trace/relay/result ports exist |
| version 来源 | 通过 | new backref uses `None`;consumable read is precondition |
| 副作用 | 通过 | explicit write command creates backref and trace |
| 禁止事项 | 通过 | query read surface never writes backref |

### 14.7 9.1-c stop-review

| 检查项 | 结论 |
|---|---|
| 6 个 review / automation / consumption command 是否都有独立 flow | 是 |
| review 是否不改 core truth | 是 |
| automation 是否 candidate-only | 是 |
| consumable/backref 是否通过 explicit command 写入 | 是 |
| duplicate 是否重跑 mutation | 否 |
| relay 是否只在 review / consumable / traceability accepted path append | 是 |

---

## 15. Query flow batch 9.2: read-only query flows

所有 Query 都通过 `ArtifactReadConsumptionService` 进入,不 reserve idempotency、不 begin write UoW、不保存 stored result、不 append trace / relay / audit。`ArtifactQuerySurface` 是 visibility / freshness / degraded 的唯一 response surface。

### 15.1 Shared authorized query flow

```text
[API handler]
  | validate ArtifactQueryRequest<T>
  | build ArtifactQueryCallContext from metadata
  | map ArtifactPageRequest -> ArtifactRepositoryPage when needed
  v
[ArtifactReadConsumptionService]
  | load target through Step 7 repository
  | if visibility matters -> ArtifactReadVisibilityPolicy.assert_visible(...)
  | load optional summary / derived state / reference state
  | assemble application read model
  v
[Response]
  | map read model to Step 8 public view DTO
  | attach ArtifactQuerySurface
  | return no-write response
```

Query no-write test rule:

- Test fake repositories must assert no `save`, `append`, `mark_*`, `reserve`, `complete`, `publish`, `deliver` method is called during query.
- Missing optional projection must set degraded/freshness surface,not trigger rebuild.

### 15.2 Core truth query flows

| Flow | Service method | Required reads | Response body | Missing / degraded branch | Test cuts |
|---|---|---|---|---|---|
| `GetArtifactFactFlow` | `get_artifact_fact` | `ArtifactFactRepository.get_with_version`, `ArtifactContentContextRepository.get_with_version`, `ArtifactSummaryViewRepository.find_fact_summary_by_fact` | `ArtifactFactView` | missing fact/content => not found;missing summary => degraded summary missing | success, missing fact, missing content, missing summary degraded |
| `GetArtifactVersionFlow` | `get_artifact_version` | `ArtifactVersionRepository.get_with_version`, `ArtifactSummaryViewRepository.find_version_summary_by_version` | `ArtifactVersionView` | missing version => not found;missing summary => degraded | success, retired version visible, missing summary |
| `ListArtifactVersionsByFactFlow` | `list_artifact_versions_by_fact` | `ArtifactFactRepository.get_with_version`, `ArtifactVersionRepository.list_by_fact` | `ArtifactPageResponse<ArtifactVersionSummaryView>` | missing fact => not found;empty page => empty response | page order, empty page, next cursor preserved |
| `GetArtifactLineageSummaryFlow` | `get_artifact_lineage_summary` | `ArtifactVersionRepository.get_with_version`, `ArtifactLineageRepository.list_by_version`, `ArtifactSummaryViewRepository.find_lineage_summary_by_version` | `ArtifactLineageView` | missing version => not found;empty links => empty relation set;missing summary => degraded | source/target links stable, no trace write |
| `GetArtifactBaselineFlow` | `get_artifact_baseline` | `ArtifactBaselineRepository.get_with_version`, `ArtifactBaselineMembershipRepository.list_by_baseline`, `ArtifactSummaryViewRepository.find_baseline_summary_by_baseline` | `ArtifactBaselineView` | missing baseline => not found;membership page incomplete => degraded/page-limited | frozen members stable, missing summary |
| `GetArtifactReviewSummaryFlow` | `get_artifact_review_summary` | `ArtifactReviewAnchorRepository.get_with_version`, `ArtifactResponsibilityRepository.list_by_review_anchor`, `ArtifactSummaryViewRepository.find_review_summary_by_anchor` | `ArtifactReviewView` | missing review => not found;no assignment => body has `None`;missing summary => degraded | ready review, pending responsibility, closed review |

Core truth query red lines:

- Query DTO never accepts raw content source body or runtime payload.
- `ListArtifactVersionsByFactFlow` must not call `find_current_by_fact` to reinterpret the list;current marker comes from version/fact view surface.
- `GetArtifactBaselineFlow` reads existing membership refs;it never recomputes membership from current fact/version.

### 15.3 Consumption / trace / search query flows

| Flow | Service method | Required reads | Response body | Visibility / freshness branch | Test cuts |
|---|---|---|---|---|---|
| `GetArtifactReadSurfaceFlow` | `get_artifact_read_surface` | selector branch: `ConsumableArtifactReferenceRepository.get_with_version` or `find_by_truth_anchor_and_scope`;`ArtifactReadSurfaceRepository.find_by_consumable`;`ArtifactConsumptionBackrefRepository.list_by_consumable`;optional `ArtifactTraceRepository.list_by_truth_anchor` | `ArtifactReadSurfaceView` | invalid selector rejected;visibility denied => not-visible surface;missing read surface => degraded;stale consumable => degraded/stale | consumable branch, truth-anchor branch, both/none selector rejected, denied no-write |
| `GetArtifactTraceFlow` | `get_artifact_trace` | `ArtifactTraceRepository.list_by_truth_anchor` | `ArtifactPageResponse<ArtifactTraceRecord>` | missing truth anchor does not create trace;empty page valid | page order, empty trace page, no append |
| `SearchArtifactFactsFlow` | `search_artifact_facts` | `ArtifactSummaryViewRepository.search_fact_summaries`;optional derived state by kind | `ArtifactPageResponse<ArtifactFactSummaryView>` | stale summary index => freshness degraded;empty page valid | filters copied, stale marker surfaced, no rebuild |

`GetArtifactReadSurfaceFlow` selector closure:

```text
if consumable_ref.is_some() && truth_anchor_ref.is_some() -> reject selector
if consumable_ref.is_none() && truth_anchor_ref.is_none() -> reject selector
if consumable_ref:
  load consumable by ref
if truth_anchor_ref:
  find consumable by truth_anchor_ref + consumer_ref-derived scope only when scope is formally available
visibility = ArtifactReadVisibilityPolicy { consumer_ref, truth_anchor_ref }.assert_visible(consumable)
read_surface = ArtifactReadSurfaceRepository.find_by_consumable(consumable_ref)
```

Backref rule:

- `GetArtifactReadSurfaceFlow` may read backrefs and traces.
- It must not call `RecordArtifactConsumptionBackrefFlow`.
- Missing backref is a degraded/traceability surface only when policy requires one;it is not repaired in query.

### 15.4 Derived / report / reference query flows

| Flow | Service method | Required reads | Response body | Missing / degraded branch | Test cuts |
|---|---|---|---|---|---|
| `GetArtifactPreviewFlow` | `get_artifact_preview` | `ArtifactPreviewViewRepository.find_by_truth_anchor`, `ArtifactDerivedViewStateRepository.find_by_kind` | `ArtifactPreviewView` | missing preview => degraded missing preview;state stale/failed => freshness degraded | stale preview, missing state, no rebuild |
| `GetArtifactReportFlow` | `get_artifact_report` | `ArtifactReportViewRepository.find_by_scope`, `ArtifactDerivedViewStateRepository.find_by_kind` | `ArtifactReportView` | missing report => degraded;state failed => degraded | report found, missing report, stale state |
| `GetArtifactReconciliationReportFlow` | `get_artifact_reconciliation_report` | `ArtifactReconciliationReportRepository.find_by_scope`, optional `ArtifactDerivedViewStateRepository.find_by_kind` | `ArtifactReconciliationReport` | missing report => degraded/not ready;state stale => freshness marker | missing report no job run, failed state |
| `GetExternalReferenceResolutionFlow` | `get_external_reference_resolution` | selector branch: `ExternalReferenceResolutionStateRepository.get_with_version` or `find_by_external_ref_and_kind`;optional `ExternalMirrorRefreshRecordRepository.list_by_external_ref`;optional `ArtifactLocalMirrorSnapshotRepository.get` | `ArtifactReferenceResolutionView` | both/none selector rejected;unresolved/failed state => degraded;missing snapshot => degraded | state-ref branch, external+kind branch, selector conflict |

External reference selector closure:

```text
if resolution_state_ref.is_some() && (external_ref.is_some() || reference_kind.is_some()) -> reject
if resolution_state_ref.is_none() && !(external_ref.is_some() && reference_kind.is_some()) -> reject
if state ref branch -> get_with_version(resolution_state_ref)
if external+kind branch -> find_by_external_ref_and_kind(external_ref, reference_kind)
if state.captured_snapshot_ref is Some -> ArtifactLocalMirrorSnapshotRepository.get(snapshot_ref)
ExternalMirrorRefreshRecordRepository.list_by_external_ref(...) may provide last_refresh_record_ref
```

Reference query red lines:

- It must not call `ExternalArtifactSourceResolverPort`.
- It must not save `ExternalReferenceResolutionState`.
- `ApplicationError` from repository is not business `Failed` state;Step 12 maps it separately.

### 15.5 Query stop-review

| 检查项 | 结论 |
|---|---|
| 13 个 Query 是否都有 flow | 是 |
| Query 是否写入 | 否 |
| visibility/freshness/degraded 是否只在 response surface | 是 |
| selector冲突是否在 entry/service 前置拒绝 | 是 |
| page cursor 是否替代 truth cursor/version | 否 |
| missing projection 是否触发 rebuild | 否 |

---

## 16. Inbound consumer flow batch 9.3

Inbound consumer 只承接外部仓变化的 body-free ref / summary / source version / reference state。它可以刷新 local mirror 和 reference state,也可以标记相关 derived state stale;它不能创建 `ArtifactFact`、`ArtifactVersion`、`ArtifactLineageLink`、`ArtifactBaseline`、`ConsumableArtifactReference` 或 `ArtifactConsumptionBackref`。

### 16.1 Shared reference consumer accepted flow

```text
[Worker entry]
  | validate ArtifactInboundEventEnvelope<T>
  | if schema unsupported -> save UnsupportedSchema receipt;do not parse payload
  | build ArtifactInboundEventCallContext
  | operation_context = ArtifactOperationContextFactory.for_inbound_event(...)
  v
[ArtifactIntakeReviewService.consume_*]
  | uow begin + idempotency reserve
  | duplicate -> rollback, load StoredArtifactResultRepository.get_inbound_receipt(result_ref), return replay
  | call matching ExternalArtifactSourceResolverPort.resolve_*(payload ref)
  | match resolver outcome:
  |   Resolved { state, body } -> save state, optional mirror snapshot / typed body-free ref;append refresh record
  |   Unresolved { reason } -> save state.mark_unresolved(reason);append refresh record;receipt Delayed or Accepted per consumer mapping
  |   Failed { reason } -> save state.mark_failed(reason);append refresh record;receipt Accepted with degraded state or Quarantined per Step 12
  | mark reachable derived state stale only when Step 7 repository can identify it by formal kind
  | save StoredArtifactOperationResult::InboundReceipt
  | complete idempotency
  | commit
```

Resolver outcome red line:

- `ArtifactReferenceRefreshResolution::Unresolved` and `Failed` are business outcomes.
- `ApplicationError` returned by resolver port is orchestration failure,not a business unresolved/failed classification.
- Consumer must not parse or persist upstream body.

### 16.2 Consumer flow table

| Flow | Envelope payload | Service method | Resolver / state target | Accepted mutation | Receipt branch | Test cuts |
|---|---|---|---|---|---|---|
| `ConsumeWorkArtifactContextChangedFlow` | `WorkArtifactContextChangedPayload` | `consume_work_artifact_context_changed` | `resolve_work_context(work_context_ref)` -> `ExternalReferenceResolutionState` | save resolution state, refresh record, optional stale derived state | Accepted / Delayed / UnsupportedSchema / Duplicate | resolved, unresolved, duplicate, unsupported |
| `ConsumeProcessArtifactContextChangedFlow` | `ProcessArtifactContextChangedPayload` | `consume_process_artifact_context_changed` | `resolve_process_context(process_context_ref)` | save resolution state, refresh record, optional stale | Accepted / Delayed / UnsupportedSchema / Duplicate | process ref copied only, no process body |
| `ConsumeGovernanceArtifactContextChangedFlow` | `GovernanceArtifactContextChangedPayload` | `consume_governance_artifact_context_changed` | `resolve_governance_context(governance_context_ref)` | save resolution state, refresh record, optional stale | Accepted / Delayed / UnsupportedSchema / Duplicate | governance body forbidden |
| `ConsumeMethodArtifactDefinitionChangedFlow` | `MethodArtifactDefinitionChangedPayload` | `consume_method_artifact_definition_changed` | `resolve_artifact_definition(definition_ref)` | save definition resolution state, refresh record, mark fact/search related derived state stale when formally identified | Accepted / Delayed / UnsupportedSchema / Duplicate | no method definition body stored |
| `ConsumeRuntimeArtifactSignalRecordedFlow` | `RuntimeArtifactSignalRecordedPayload` | `consume_runtime_artifact_signal_recorded` | `resolve_automation_source(automation_source_ref)` | save automation source state;may create pending automation marker only through existing automation boundary if formal input exists | Accepted / Delayed / Quarantined / Duplicate | runtime output not truth, optional anchor copied |
| `ConsumeExternalContentSourceChangedFlow` | `ExternalContentSourceChangedPayload` | `consume_external_content_source_changed` | `resolve_content_source(source_ref)` -> `ArtifactLocalMirrorSnapshot` | save mirror snapshot, resolution state, refresh record, intake/read derived stale marker | Accepted / Delayed / Failed / UnsupportedSchema / Duplicate | snapshot body-free, content body forbidden |

### 16.3 Per-consumer branch notes

#### 16.3.1 `ConsumeWorkArtifactContextChangedFlow`

- Payload field source: `work_context_ref` copied from payload;source metadata copied from envelope.
- Resolver: `ExternalArtifactSourceResolverPort.resolve_work_context(...)`.
- Resolution state key: `ExternalSourceRef` from envelope or resolver state plus `ArtifactExternalReferenceKind::WorkContext`.
- Accepted side effects: state save, refresh record append, stored receipt.
- Forbidden: create intake, fact, review or backref from work context event.

#### 16.3.2 `ConsumeProcessArtifactContextChangedFlow`

- Payload field source: `process_context_ref` copied from payload.
- Resolver: `resolve_process_context(...)`.
- Accepted side effects mirror work context, with reference kind `ProcessContext`.
- Forbidden: derive lineage truth from process relation body;lineage still requires explicit command.

#### 16.3.3 `ConsumeGovernanceArtifactContextChangedFlow`

- Payload field source: `governance_context_ref` copied from payload.
- Resolver: `resolve_governance_context(...)`.
- Accepted side effects: update reference state and refresh record.
- Forbidden: create review/baseline/freeze context from governance event body.

#### 16.3.4 `ConsumeMethodArtifactDefinitionChangedFlow`

- Payload field source: `definition_ref` copied from payload.
- Resolver: `resolve_artifact_definition(...)`.
- Accepted side effects: definition reference state and refresh record;derived state stale if formal derived view kind is identifiable.
- Forbidden: copy L3-method-library definition body or alter existing `ArtifactFact.definition_ref`.

#### 16.3.5 `ConsumeRuntimeArtifactSignalRecordedFlow`

- Payload field source: `automation_source_ref` and optional `derived_truth_anchor_ref`.
- Resolver: `resolve_automation_source(...)`.
- Accepted side effects: automation source resolution state and receipt.
- If `derived_truth_anchor_ref` is absent,receipt may be `Delayed` or `Quarantined` per Step 12;consumer must not invent a truth anchor.
- Forbidden: directly create `AutomationArtifactInput`;that remains explicit command `RegisterAutomationArtifactInput` unless Step 10/12 later authorizes a specific consumer-created support marker.

#### 16.3.6 `ConsumeExternalContentSourceChangedFlow`

- Payload field source: `source_ref` copied from payload.
- Resolver: `resolve_content_source(...)`,which returns `ArtifactReferenceRefreshResolution<ArtifactLocalMirrorSnapshot>`.
- Accepted side effects: save body-free mirror snapshot, save resolution state, append `ExternalMirrorRefreshRecord`.
- Forbidden: save external content body, establish fact, create version candidate or mark content verified without formal digest.

### 16.4 Consumer stop-review

| 检查项 | 结论 |
|---|---|
| 6 个 consumer 是否都有 flow | 是 |
| unsupported schema 是否不解析 payload | 是 |
| duplicate 是否重跑 mutation | 否 |
| resolver business outcome 与 `ApplicationError` 是否分离 | 是 |
| consumer 是否创建 core truth | 否 |
| external body 是否入仓 | 否 |
| stale marker 是否可能私扫 projection | 否;只能通过 formal derived state identity / repository surface |

---

## 17. Outbound relay append / publish batch 9.4

Outbound Event 在 `L1-artifact` 不作为 public command/query/job surface 暴露。它是 accepted write / maintenance state change 的 durable relay material。Step 9 只定义 append 和 worker publication flow;transport topic、retry policy、broker binding 留给 Step 14 / Step 15。

### 17.1 Accepted change relay append helper

每个 accepted writer 在同一 UoW 内执行:

```text
truth_cursor = uow.assign_truth_cursor()
change = ArtifactCommittedChange::<variant> { ..., truth_cursor }
payload_snapshot_ref = IdGeneratorPort.new_artifact_relay_payload_snapshot_ref()
envelope = ArtifactOutboundEventEnvelope<T> {
  event_kind,
  event_name,
  schema_version,
  relay_item_ref,
  payload_snapshot_ref,
  subject_ref,
  source_cursor: truth_cursor,
  core_trace_id,
  topic_key,
  payload,
}
payload_snapshot = ArtifactOutboundPayloadSnapshotBuilder.build(payload_snapshot_ref, event_kind, schema_version, envelope)
relay_repo.append(change, payload_snapshot, uow)
```

Append order rule:

1. Domain transition and repository saves are staged first.
2. `assign_truth_cursor()` is called once.
3. Payload snapshot is built from `ArtifactCommittedChange` + Step 8 event map.
4. Relay item and payload snapshot are appended before stored result completion.
5. If relay append fails,transaction fails before commit.

### 17.2 Outbound payload mapping

| Committed change | Event kind / payload | Subject | Producing flows |
|---|---|---|---|
| `Fact { artifact_fact_ref, content_context_ref, change_kind, truth_cursor }` | `ArtifactFactChangedPayload` | `ArtifactTruthAnchorRef::Fact(artifact_fact_ref)` | `EstablishArtifactFactFlow` |
| `Version { artifact_version_ref, artifact_fact_ref, version_state, truth_cursor }` | `ArtifactVersionChangedPayload` | `ArtifactTruthAnchorRef::Version(artifact_version_ref)` | `PublishArtifactVersionFlow`, `SupersedeArtifactVersionFlow` |
| `Lineage { artifact_lineage_link_ref, source_version_ref, target_version_ref, relation_kind, truth_cursor }` | `ArtifactLineageChangedPayload` | `ArtifactTruthAnchorRef::Lineage(artifact_lineage_link_ref)` | `EstablishArtifactLineageLinkFlow`, `RejectArtifactLineageLinkFlow` |
| `Baseline { artifact_baseline_ref, baseline_scope_ref, baseline_state, truth_cursor }` | `ArtifactBaselineChangedPayload` | `ArtifactTruthAnchorRef::Baseline(artifact_baseline_ref)` | `FreezeArtifactBaselineFlow`, `SupersedeArtifactBaselineFlow` |
| `Review { review_anchor_ref, responsibility_assignment_ref, review_state, truth_cursor }` | `ArtifactReviewChangedPayload` | none unless loaded review exposes formal truth anchor | `OpenArtifactReviewAnchorFlow`, `AssignArtifactResponsibilityFlow` |
| `Consumable { consumable_ref, truth_anchor_ref, reference_state, truth_cursor }` | `ConsumableArtifactReferenceChangedPayload` | `truth_anchor_ref` | `IssueConsumableArtifactReferenceFlow` |
| `Traceability { trace_record_ref, truth_anchor_ref, handoff_record_ref, trace_state, truth_cursor }` | `ArtifactTraceAvailablePayload` | `truth_anchor_ref` | `RecordArtifactConsumptionBackrefFlow`, handoff jobs |
| `DerivedViewState { derived_view_state_ref, derived_view_kind, freshness_state, truth_cursor }` | `ArtifactDerivedViewStateChangedPayload` | none | `RebuildArtifactDerivedViewsFlow`, `RefreshExternalReferenceStatesFlow`, reconciliation / handoff state maintenance when it changes derived freshness |

Payload red lines:

- Payload contains only refs, state/kind labels, cursor and trace metadata.
- It never embeds content body, report body, method definition body, runtime output body or actor profile.
- Review event subject must not invent a truth anchor if the committed change does not carry one.
- Derived view state event leaves `subject_ref = None`;downstream must not infer truth anchor from view kind.

### 17.3 `PublishPendingArtifactRelaysFlow`

| 项目 | 内容 |
|---|---|
| worker entry | `PublishPendingArtifactRelaysWorkerInput` |
| application facade | `ArtifactRelayPublicationService.publish_pending_artifact_relays(input)` |
| reads | `ArtifactCommittedChangeRelayRepository.list_pending_with_payload`, `get_payload_snapshot` |
| writes | `mark_published`, `mark_retryable`, `mark_failed` |
| publisher | `ArtifactRelayPublisherPort.publish(pending_item, payload_snapshot)` |
| duplicate behavior | no stored job replay;expected version and relay item state control idempotence |
| output | `PublishPendingArtifactRelaysWorkerResponse` / `ArtifactRelayPublicationBatchResult` |

```text
[Worker relay loop]
  | map ArtifactPageRequest -> ArtifactRepositoryPage
  | ArtifactRelayPublicationService.publish_pending_artifact_relays(input)
  v
[Application facade]
  | pending_page = relay_repo.list_pending_with_payload(page)
  | for each versioned pending item:
  |   uow = begin()
  |   snapshot = relay_repo.get_payload_snapshot(item.payload_snapshot_ref)
  |   if snapshot missing:
  |     relay_repo.mark_failed(item.ref, missing_snapshot_reason, versioned.version, uow)
  |     commit;continue
  |   outcome = relay_publisher.publish(item, snapshot)
  |   Published(receipt) -> relay_repo.mark_published(item.ref, receipt, versioned.version, uow)
  |   Retryable(reason) -> relay_repo.mark_retryable(item.ref, reason, versioned.version, uow)
  |   Failed(reason) -> relay_repo.mark_failed(item.ref, reason, versioned.version, uow)
  |   commit
```

| 分支 | 处理口径 |
|---|---|
| published | mark published with expected version from pending page |
| retryable | mark retryable;do not rebuild snapshot |
| failed | mark failed;do not rollback original accepted truth |
| missing snapshot | mark failed or retryable per Step 12;never read current truth |
| publisher `ApplicationError` | maps to failed item in batch result;does not infer retryability from error text |
| optimistic conflict | skip / report failed for current item;next scan may retry |

### 17.4 Outbound stop-review

| 检查项 | 结论 |
|---|---|
| 8 个 outbound event 是否映射到 committed change | 是 |
| payload 是否 stored snapshot only | 是 |
| publisher 是否读取 current truth | 否 |
| relay publication failure 是否回滚 accepted truth | 否 |
| expected version 来源是否闭口 | 是,来自 `list_pending_with_payload` 返回的 `Versioned` |
| worker 是否直连 repository / publisher | 否,只调用 application facade |

---

## 18. Operations job flow batch 9.5

Operations job 是显式后台维护入口。它们使用 `ArtifactDerivedMaintenanceService`,支持 stored job report duplicate replay,但不修复 core truth。每个 job 只能处理 request page / explicit refs 指定的范围。

### 18.1 `RebuildArtifactDerivedViewsFlow`

| 项目 | 内容 |
|---|---|
| 协议 | `ArtifactJobRequest<RebuildArtifactDerivedViewsJobInput>` |
| service entry | `ArtifactDerivedMaintenanceService.rebuild_artifact_derived_views(input)` |
| input | `RebuildArtifactDerivedViewsInput` |
| reads | `ArtifactTruthSnapshotRepository.load_*_snapshot` according to `snapshot_scope`, current view/state repositories |
| writes | `ArtifactSummaryViewRepository.save_*`, `ArtifactReadSurfaceRepository.save`, `ArtifactPreviewViewRepository.save`, `ArtifactReportViewRepository.save`, `ArtifactReconciliationReportRepository.save`, `ArtifactDerivedViewStateRepository.save`, stored job report |
| outbound | `ArtifactCommittedChange::DerivedViewState` when derived state changes |
| forbidden | fact/version/lineage/baseline/intake/review/consumption truth mutation |

```text
[ArtifactDerivedMaintenanceService.rebuild_artifact_derived_views]
  | uow begin + idempotency reserve
  | snapshot = dispatch ArtifactTruthSnapshotScope to exact load_*_snapshot(...)
  | for each derived_view_kind in request order:
  |   state_v = ArtifactDerivedViewStateRepository.find_by_kind(kind)
  |   state.start_rebuild()
  |   assemble body-free view/report from snapshot refs only
  |   save matching view/report repository
  |   state.mark_rebuilt(snapshot.source_cursor)
  |   save state with expected version
  |   append DerivedViewState relay
  | save StoredArtifactOperationResult::JobReport
  | complete idempotency
  | commit
```

| 分支 | 处理口径 |
|---|---|
| completed | all requested view kinds rebuilt, state fresh, report saved |
| partially completed | some view kinds failed;failed refs recorded;successful state saves remain in same committed policy only if Step 13 allows partial commit |
| failed | no derived mutation committed unless Step 13 defines partial behavior |
| duplicate | stored job report replay |
| empty view kind set | rejected unless Step 12 defines all-views semantic |

### 18.2 `RefreshExternalReferenceStatesFlow`

| 项目 | 内容 |
|---|---|
| 协议 | `ArtifactJobRequest<RefreshExternalReferenceStatesJobInput>` |
| service entry | `ArtifactDerivedMaintenanceService.refresh_external_reference_states(input)` |
| input | `RefreshExternalReferenceStatesInput` |
| reads | `ExternalReferenceResolutionStateRepository.list_by_refresh_scope`, resolver ports by reference kind |
| writes | `ExternalReferenceResolutionStateRepository.save`, `ArtifactLocalMirrorSnapshotRepository.save`, `ExternalMirrorRefreshRecordRepository.append`, optional `ArtifactDerivedViewStateRepository.save`, stored job report |
| outbound | `ArtifactCommittedChange::DerivedViewState` only when derived freshness state changes |
| forbidden | core truth writes;resolver `ApplicationError` classification as unresolved/failed |

```text
[ArtifactDerivedMaintenanceService.refresh_external_reference_states]
  | uow begin + idempotency reserve
  | states_page = ExternalReferenceResolutionStateRepository.list_by_refresh_scope(refresh_scope, page)
  | for each state_v:
  |   call resolver matching state.reference_kind
  |   Resolved -> save mirror snapshot if provided;state.mark_resolved(snapshot_ref)
  |   Unresolved -> state.mark_unresolved(reason)
  |   Failed -> state.mark_failed(reason)
  |   append ExternalMirrorRefreshRecord::record_refresh(...)
  |   save state with expected version
  |   mark affected derived state stale only through formal `find_by_kind` / `save`
  | save StoredArtifactOperationResult::JobReport
  | complete idempotency
  | commit
```

| 分支 | 处理口径 |
|---|---|
| resolved | state resolved, optional mirror snapshot saved, refresh record appended |
| unresolved | state unresolved/pending, refresh record appended, report changed state |
| failed business outcome | state failed, refresh record appended |
| resolver application error | item failed in job report;do not infer business state from error text |
| duplicate | stored job report replay |

### 18.3 `RunArtifactReconciliationFlow`

| 项目 | 内容 |
|---|---|
| 协议 | `ArtifactJobRequest<RunArtifactReconciliationJobInput>` |
| service entry | `ArtifactDerivedMaintenanceService.run_artifact_reconciliation(input)` |
| input | `RunArtifactReconciliationInput` |
| reads | `ArtifactTruthSnapshotRepository.load_reconciliation_scope_snapshot`, `ArtifactReconciliationReportRepository.find_by_scope`, optional derived state |
| writes | `ArtifactReconciliationReportRepository.save`, `ArtifactDerivedViewStateRepository.save`, stored job report |
| outbound | `ArtifactCommittedChange::DerivedViewState` when reconciliation freshness changes |
| forbidden | automatic truth repair |

```text
[ArtifactDerivedMaintenanceService.run_artifact_reconciliation]
  | uow begin + idempotency reserve
  | snapshot = load_reconciliation_scope_snapshot(reconciliation_scope_ref, page)
  | current_report = ArtifactReconciliationReportRepository.find_by_scope(reconciliation_scope_ref)
  | derive finding refs / issue refs from loaded body-free snapshot refs and current reference states
  | save reconciliation report with expected version from current_report if any
  | update derived state to Fresh or Failed
  | save StoredArtifactOperationResult::JobReport
  | complete idempotency
  | commit
```

| 分支 | 处理口径 |
|---|---|
| completed | report saved and state fresh |
| drift found | report records finding refs;truth remains unchanged |
| failed | report/state failure recorded;truth remains unchanged |
| duplicate | stored job report replay |
| snapshot mismatch | rejected or failed report;no truth repair |

### 18.4 `PrepareArtifactArchiveHandoffFlow`

| 项目 | 内容 |
|---|---|
| 协议 | `ArtifactJobRequest<PrepareArtifactArchiveHandoffJobInput>` |
| service entry | `ArtifactDerivedMaintenanceService.prepare_artifact_archive_handoff(input)` |
| input | `PrepareArtifactArchiveHandoffInput` |
| reads | truth snapshot by scope, trace refs from snapshot, report/baseline refs from snapshot |
| writes | `ArtifactHandoffRecordRepository.append`, `PreparedArtifactHandoffRepository.save`, optional `ArtifactArchiveHandoffPort.deliver`, stored job report |
| outbound | `ArtifactCommittedChange::Traceability` when handoff record has trace |
| forbidden | archive body ownership, truth mutation |

```text
[ArtifactDerivedMaintenanceService.prepare_artifact_archive_handoff]
  | uow begin + idempotency reserve
  | snapshot = dispatch snapshot_scope to exact truth snapshot reader
  | handoff_record = ArtifactHandoffRecord::record_handoff(new_handoff_record_ref(), target_ref, selected_truth_anchor, archive_channel_ref, Prepared, trace_ref)
  | material = PreparedArtifactHandoffMaterial::Archive(...)
  | ArtifactHandoffRecordRepository.append(handoff_record, uow)
  | PreparedArtifactHandoffRepository.save(material, uow)
  | optionally deliver through ArtifactArchiveHandoffPort only if job mode says deliver-now
  | save job report and complete idempotency
  | commit
```

| 分支 | 处理口径 |
|---|---|
| prepared | handoff record/material saved, report contains handoff ref |
| delivered | delivery receipt copied into record/report per Step 12/15;truth unchanged |
| retryable/failed delivery | handoff record/report reflect outcome;truth unchanged |
| duplicate | stored job report replay |

### 18.5 `PrepareArtifactObservabilityHandoffFlow`

| 项目 | 内容 |
|---|---|
| 协议 | `ArtifactJobRequest<PrepareArtifactObservabilityHandoffJobInput>` |
| service entry | `ArtifactDerivedMaintenanceService.prepare_artifact_observability_handoff(input)` |
| input | `PrepareArtifactObservabilityHandoffInput` |
| reads | `ArtifactTraceRepository.list_by_truth_anchor`, optional review summary reads for provided truth anchors |
| writes | handoff record, prepared observability handoff material, optional delivery outcome, stored job report |
| outbound | `ArtifactTraceAvailable` only when a handoff trace record is appended |
| forbidden | creating missing trace on query path;truth mutation |

| 分支 | 处理口径 |
|---|---|
| prepared | material stores truth_anchor_refs, trace_refs, review_anchor_refs only |
| missing trace for anchor | failed_refs/degraded handoff report;no trace repair unless this job explicitly appends a handoff trace |
| delivered/retryable/failed | maps delivery outcome to handoff record/report |
| duplicate | stored job report replay |

### 18.6 `PrepareArtifactSyncHandoffFlow`

| 项目 | 内容 |
|---|---|
| 协议 | `ArtifactJobRequest<PrepareArtifactSyncHandoffJobInput>` |
| service entry | `ArtifactDerivedMaintenanceService.prepare_artifact_sync_handoff(input)` |
| input | `PrepareArtifactSyncHandoffInput` |
| reads | `ArtifactTruthSnapshotRepository.load_consumer_scope_snapshot`, `ConsumableArtifactReferenceRepository` / read surface refs from snapshot-supported repositories |
| writes | handoff record, prepared sync handoff material, optional delivery outcome, stored job report |
| outbound | `ArtifactTraceAvailable` or `ArtifactDerivedViewStateChanged` only when corresponding record/state changes |
| forbidden | generating consumable refs;sync uses already issued consumables |

| 分支 | 处理口径 |
|---|---|
| prepared | material stores consumable refs, read surface refs, trace refs |
| no consumables | completed empty or rejected per Step 12;does not issue new consumable references |
| delivered/retryable/failed | maps delivery outcome to handoff record/report |
| duplicate | stored job report replay |

### 18.7 Operations job stop-review

| 检查项 | 结论 |
|---|---|
| 6 个 public job 是否都有 flow | 是 |
| job duplicate 是否 replay stored report | 是 |
| job 是否修复 core truth | 否 |
| truth snapshot 是否只返回 body-free refs/cursor | 是 |
| handoff 是否拥有 external body | 否 |
| relay 是否只由 derived state / traceability committed change 产生 | 是 |

---

## 19. Final audit batch 9.6

### 19.1 Flow coverage summary

| Flow family | Step 8 count | Step 9 coverage | 结论 |
|---|---:|---:|---|
| Command | 16 | 16 | pass |
| Query | 13 | 13 | pass |
| Inbound Event Consumer | 6 | 6 | pass |
| Outbound Event | 8 | 8 payload / committed-change mapping | pass |
| Operations Job | 6 | 6 | pass |
| Worker-only relay publication facade | 1 | 1 | pass |

### 19.2 Cross-flow closure audit

| 审计项 | 结论 | 说明 |
|---|---|---|
| command idempotency | pass | 所有 command 使用 reserve / duplicate replay / complete 模板 |
| command expected version | pass | mutation save 只使用 loaded `Versioned<T>.version` 或 new object `None` |
| version candidate source | pass | Step 7/8 已补 `submission_ref` 字段,与 Step 6 candidate factory 对齐 |
| baseline candidate source | pass | Step 6 已修正 candidate 阶段 `freeze_context_ref = None`,freeze 命令再绑定 review anchor |
| query no-write | pass | 13 个 query 均禁止 save / append / reserve / relay |
| consumer no-truth-write | pass | 6 个 consumer 只写 reference / mirror / stale / receipt |
| relay stored snapshot | pass | accepted change append snapshot;publisher只读 snapshot |
| job no-truth-repair | pass | 6 个 job 只维护 derived / reference / report / handoff |
| external body boundary | pass | content/method/governance/process/runtime body 均不入仓 |
| Step 10 handoff | pass | 状态合法性细节、terminal matrix、partial job commit 继续由 Step 10 / 13 收口 |

### 19.3 Design-side fixes made during Step 9

| 修正 | 文件 | 原因 |
|---|---|---|
| `CreateArtifactVersionCandidateRequest` / `CreateArtifactVersionCandidateInput` 增加 `submission_ref: ArtifactSubmissionRef` | `03_ddd_step_07_trait_port_adapter_contracts.md`;`03_ddd_step_08_protocol_contracts.md` | Step 6 `ArtifactVersionCandidate::from_submission(...)` 要求候选版本回指正式 submission;Step 7/8 原输入缺来源 |
| `ArtifactBaseline.freeze_context_ref` 改为 `Option<ArtifactReviewAnchorRef>`;`from_members(...)` 不再要求 freeze context;`freeze(...)` 绑定 review anchor | `03_ddd_step_06_object_contracts.md` | candidate 创建阶段没有 freeze context 是合理业务状态;冻结命令已有 `freeze_context_ref` |

### 19.4 Step 10~13 handoff items

| 后续 Step | 需要继续闭口的事项 |
|---|---|
| Step 10 state matrix | command 中各对象 terminal / retry / replacement 状态矩阵;baseline candidate -> frozen 的 `freeze_context_ref` 非空不变量;lineage reject allowed states |
| Step 11 persistence / consistency | membership page completeness、partial job commit 事务策略、derived state identity and affected stale marker persistence |
| Step 12 error / recovery | duplicate conflict rejection envelope、resolver `ApplicationError` vs business outcome mapping、missing relay snapshot publication recovery |
| Step 13 concurrency / idempotency | relay publication optimistic conflict retry, command duplicate same/different digest, job partial result replay |
| Step 14 config binding | outbound topic-neutral key to broker topic mapping, delivery mode, job page size, retry intervals |
| Step 15 observability / audit | trace / audit metric fields, relay publication counters, consumer receipt observability |
| Step 16 tests | no-write query fake assertions, stored snapshot only publisher tests, consumer no-truth-write tests |

### 19.5 Step 9 completion checklist

| 检查项 | 结论 |
|---|---|
| 是否直接修改正式 `03-详细设计.md` | 否 |
| 是否覆盖 Step 8 inventory | 是 |
| 是否新增未闭口 port | 否 |
| 是否把设计缺口推给实现端 | 否,本 Step 修正了 2 个当前可闭口的输入/对象冲突 |
| 是否保留后续 Step 的边界 | 是,状态矩阵、错误模型、事务一致性、并发幂等和配置绑定未提前展开 |
| 是否达到进入 Step 10 条件 | 是 |

---

## 20. 回填草稿

正式 `03-详细设计.md` Step 19 装配时,§8 可采用以下结构:

```markdown
## 8. 逐接口函数级处理流

### 8.1 共享处理模板
- Command transaction / idempotency / stored result template
- Query read-only template
- Inbound consumer reference update template
- Operations job stored report template
- Relay append / publication template

### 8.2 Command flows
- intake / fact / version
- lineage / baseline
- review / automation / consumption

### 8.3 Query flows
- core truth read
- consumption / trace / search
- derived / report / external reference

### 8.4 Consumer flows
- work / process / governance / method / runtime / external content changed

### 8.5 Outbound relay flows
- committed change to stored payload snapshot
- publish pending relays

### 8.6 Operations job flows
- rebuild derived views
- refresh external references
- reconciliation
- archive / observability / sync handoff
```

---

## 21. 进入下一步条件

Step 9 已完成。进入 Step 10 前必须:

1. 用户确认进入 Step 10。
2. 读取本文件和更新后的 Step 6 / Step 7 / Step 8。
3. Step 10 以本文件所有 state transition notes 为输入,正式产出状态机与转换矩阵。
