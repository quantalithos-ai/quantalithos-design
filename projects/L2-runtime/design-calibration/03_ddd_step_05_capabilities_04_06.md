# L2-runtime Step 5 capability cards: CAP-04~06

> 状态: done
> 当前 Step: 5
> 批次: context composition、memory mediation、model decision
> 输入: Step 3/4、正式 02、CAP-01 vocabulary、CAP-02/03 run and plan contracts

## 1. CAP-04 Context Composition

### 1.1 Capability contract

| 项目 | 契约 |
|---|---|
| 目标 | 将 run/goal-plan facts、formal source snapshots、working/durable memory candidates 按 scope、freshness、budget、ordering 与 redaction 约束组合为 immutable `WorkingContext` |
| typed input | `ComposeWorkingContext`、`CandidateQuery`、`ContextBudget`、`Page<MemoryCandidate>`、`SourceSnapshot`、`ExpectedVersion` |
| typed output | `ContextResult`、`ContextCompositionDecision`、`WorkingContext`、`MemoryUseRecord`、history/outbox facts |
| local truth | composition decision、ordered safe segment refs、frozen context snapshot identity、memory use facts |
| external read | Hub/Method/Governance/Artifact/memory owner safe snapshot/ref；只读 |
| forbidden | 保存外部正文或 provider prompt；silent truncation；使用 stale/unknown source 形成 accepted context；冻结后原地修改 |

### 1.2 File allocation

| layer | file | implementation responsibility |
|---|---|---|
| contracts | `commands.rs` | `ComposeWorkingContext`、`CandidateQuery`、`ContextBudget`、`ContextResult` |
| contracts | `views.rs` | `WorkingContextView`、`ContextSegmentView`、`CompositionDecisionView` |
| domain | `context.rs` | composition decision、context aggregate、segment refs、freeze transition |
| domain | `policies.rs` | `ContextEligibilityPolicy`、`ContextOrderingPolicy`、`ContextBudgetPolicy` |
| application | `context_service.rs` | candidate retrieval/resolution、domain composition、UoW orchestration |
| application | `ports/repositories.rs` | `ContextRepositoryPort` and history reads |
| application | `ports/external.rs` | source/memory resolution |
| infra | `repositories.rs` | context snapshot persistence candidate |
| api | `command_handlers.rs`、`query_handlers.rs` | compose command and working-context query mapping |
| tests | `domain/context.rs`、`application/context.rs` | eligibility/order/budget/freeze/unknown cases |

### 1.3 Object capability allocation

| object | required fields | functions owned by capability |
|---|---|---|
| `CandidateQuery` | run_id、memory_kinds、source_owner_filter、freshness_requirement、cursor、page_limit | `validate_scope`、`to_retrieval_request` |
| `ContextBudget` | max_segment_count、max_safe_bytes、reserved_response_bytes、omission_policy、profile_ref | `validate`、`can_include(SegmentEstimate)`、`remaining_after` |
| `SourceSnapshot` | snapshot_id、source_ref、captured_version、captured_at、completeness、redaction、safe_material_ref | `validate_authority`、`is_usable(FreshnessRequirement)` |
| `ContextSegmentRef` | segment_id、source_ref、snapshot_ref、segment_kind、safe_size、ordering_key、redaction | `from_snapshot`、`validate_body_free` |
| `ContextCompositionDecision` | decision_id、run_id、selected_refs、excluded_items、budget、disposition、source_refs、decided_at | `decide`、`permits_assembly`、`to_history_fact` |
| `ExcludedContextCandidate` | candidate_ref、reason、source_ref、ordering_position | `new`、`validate_safe_reason` |
| `WorkingContext` | context_id、run_id、composition_id、ordered_segment_refs、budget、source_refs、version、status、frozen_at | `compose`、`freeze`、`contains`、`is_frozen`、`to_view` |
| `ContextCompositionService` | run/source/memory/context/history/idempotency/UoW/outbox ports、policies | `compose(ComposeWorkingContext) -> Future<Result<ContextResult, ApplicationError>>` |

### 1.4 Port, protocol and Flow allocation

| concern | exact boundary |
|---|---|
| run read | `RunRepositoryPort::get(run_id, ReadVersion::Exact(expected_run_version))` |
| candidate read | `MemoryRetrievalPort::retrieve(RetrievalRequest) -> Page<MemoryCandidate>` |
| source read | `SourceResolverPort::resolve(SourceReference, ResolvePolicy) -> SourceSnapshot` |
| memory window | `ContextRepositoryPort::get_working_memory(run_id, expected_window_version)` |
| context write | `ContextRepositoryPort::save_context(context, ExpectedVersion::None, uow)` |
| memory use write | `MemoryRetrievalPort::record_use(record, uow)` for local use fact only |
| command | `ComposeWorkingContext` -> `ContextCompositionService::compose` -> `ContextResult` |
| query | `GetWorkingContext` -> `GetWorkingContextFlow` -> `QueryViewEnvelope<WorkingContextView>` |
| outbound | committed composition/context facts materialize `RuntimeFactCommitted` and projection-stale snapshots |

### 1.5 State and transaction

```text
context: assembling -> assembled -> frozen
context: assembling -> rejected
context: assembling -> degraded -> assembled or rejected after new verified source
```

| phase | operations |
|---|---|
| pre-UoW | metadata/digest/scope/budget validation、idempotency replay check |
| read phase | exact run/window versions、candidate page、each source snapshot/availability |
| pure decision | eligibility -> ordering -> budget inclusion/exclusion -> composition decision -> context compose/freeze |
| UoW write | decision、context、memory use facts、history、stored result、outbox snapshot |
| commit unknown | context status unknown; model submission prohibited; original idempotency identity retained |
| post commit | projection stale/outbox publish with same fact identity |

### 1.6 Errors and tests

| case | posture | required assertion |
|---|---|---|
| source owner/scope mismatch | rejected | no segment/context saved |
| stale or unknown snapshot | excluded/degraded/waiting | never accepted as selected segment |
| budget exhausted | partial/rejected according to explicit omission policy | every exclusion has safe reason; no silent truncation |
| forbidden body/unsafe redaction | rejected | value absent from object/event/log fixture |
| window version conflict | concurrency conflict | no context or use record commit |
| frozen context mutation | invalid transition | same version/segments retained |
| duplicate command | replay | same context ref; no second composition decision |
| commit unknown | unknown fence | no `StartModelTurn` adapter call |

### 1.7 Stop review

CAP-04 independently closes candidate-to-context construction, exact source/budget/freeze rules, persistence boundary and query surface. It does not own source content or provider prompt construction.

## 2. CAP-05 Working/Episodic/Semantic Memory Mediation

### 2.1 Capability contract

| 项目 | 契约 |
|---|---|
| 目标 | 维护 run-scoped working memory window；请求外部 episodic/semantic memory candidates；记录候选使用与显式 compaction，不拥有 durable memory lifecycle |
| typed input | `RetrievalRequest`、`MemoryCandidate`、`MemoryUseRecord`、`CompactWorkingMemory`、`SourceSnapshotChanged` |
| typed output | `Page<MemoryCandidate>`、updated `WorkingMemory`、`MemoryCompactionReport`、`MemoryUseView`、availability facts |
| local truth | working memory entry refs/window version/status、candidate use/disposition、compaction decision |
| external read | durable memory candidate/snapshot/ref/status；owner contract pending |
| forbidden | durable body/index/retention/delete/rebuild；silent removal；把 retrieval rank 当 Runtime truth；用 fake 声称 durable ready |

### 2.2 File allocation

| layer | file | responsibility |
|---|---|---|
| contracts | `events.rs` | `SourceSnapshotChanged` memory-source payload |
| contracts | `jobs.rs` | `CompactWorkingMemory`、`MemoryCompactionReport` |
| contracts | `queries.rs`、`views.rs` | `GetMemoryUse`、`MemoryUseView`、page helpers |
| domain | `memory.rs` | `MemoryCandidate`、`WorkingMemory`、`MemoryUseRecord`、`CompactionDecision` |
| domain | `source.rs` | memory source availability/snapshot marker |
| application | `context_service.rs` | retrieval/use during composition |
| application | `consumer_service.rs` | memory source change incorporation |
| application | `job_service.rs` | bounded compaction Flow |
| application | `ports/external.rs` | `MemoryRetrievalPort` |
| infra/jobs | memory adapter slot、compaction runner、blocked fake |

### 2.3 Object capability allocation

| object | required fields | functions |
|---|---|---|
| `RetrievalRequest` | run_id、scope、memory_kinds、query_ref、freshness_requirement、cursor、page_limit、budget_ref | `validate`、`canonical_digest_input` |
| `MemoryCandidate` | candidate_id、kind、source_ref、snapshot_ref、eligibility、ordering_hint、safe_size、retrieved_at | `from_source`、`validate_scope`、`is_eligible` |
| `WorkingMemoryEntryRef` | entry_id、candidate_ref、source_ref、use_ref、inserted_at、status | `from_candidate_use`、`mark_superseded` |
| `WorkingMemory` | memory_id、run_id、entries、window_version、source_refs、status、updated_at | `create`、`add`、`compact`、`freeze`、`mark_degraded` |
| `MemoryUseRecord` | use_id、run_id、candidate_ref、composition_id、context_id、disposition、source_ref、recorded_at | `record_use`、`is_incorporated`、`to_history_fact` |
| `CompactionDecision` | decision_id、run_id、from_version、retained_refs、removed_refs、reason、source_refs | `decide`、`validate_no_silent_removal` |
| `MemoryRefreshJobState` | job_id、shard、cursor、lease_token、source_kind、status、last_error_ref | `claim`、`advance`、`stop_on_lease_loss`、`release` |

### 2.4 Port and entry allocation

| Port/entry | functions and role |
|---|---|
| `MemoryRetrievalPort` | `retrieve`、`get_snapshot`、`record_use`; candidate/ref only; unavailable when durable owner seam is incomplete |
| `ContextRepositoryPort` | get/save working memory with exact window version |
| `SourceResolverPort` | validate memory snapshot owner/version/freshness |
| `HistoryRepositoryPort` | append use/compaction/availability facts and page query |
| `LeasePort` | claim/renew/release one run/window compaction shard |
| `ConsumeSourceSnapshotChangedFlow` | validates event owner/version then marks local availability and affected context/projection stale |
| `CompactWorkingMemoryFlow` | uses explicit decision, saves new window/history in one UoW |
| `GetMemoryUseFlow` | reads committed use history with cursor/visibility/freshness; no refresh/write |

### 2.5 State, consistency and tests

```text
working memory: open -> compacting -> open
working memory: open -> frozen
working memory: open or compacting -> degraded
source availability: pending/stale/unknown -> available/unavailable/stale/unknown
```

| concern | contract/test |
|---|---|
| add candidate | exact window version, eligible candidate, same run scope; duplicate candidate/use cannot add twice |
| compact | explicit retained/removed refs and reason; new version only after committed replacement |
| commit unknown | old window remains authoritative; candidate new window not exposed as current |
| durable adapter absent | capability returns working-only/degraded; no durable write method exists |
| source change order | only newer verified source version changes availability; stale event yields late receipt |
| lease loss | runner stops before write/cursor advance; never partially replaces window |
| query | empty/current/stale/degraded/not-visible page semantics; no source refresh |
| body boundary | candidate/snapshot fixtures containing external body are rejected before domain mapping |

### 2.6 Stop review

CAP-05 separates local working-window truth, candidate/use facts and external durable-memory ownership. Retrieval, source change, compaction, query, state and negative qualification are independently allocated.

## 3. CAP-06 Provider-neutral Model Decision

### 3.1 Capability contract

| 项目 | 契约 |
|---|---|
| 目标 | 从 frozen context 创建 provider-neutral intent/turn，使用稳定 submission identity 调用 model adapter，并将 verified semantic result 分类为 Runtime decision/safe summary |
| typed input | `StartModelTurn`、`ModelIntentPayload`、`WorkingContext`、`ModelResultAvailable`、`ModelSemanticResult` |
| typed output | `ModelTurnResult`、`EventReceipt`、`ModelTurn`、`ModelDecision`、`SafeDecisionSummary`、history/outbox facts |
| local truth | logical intent、turn/submission posture、semantic decision、safe summary ref、result incorporation fact |
| external owner | provider route/secret/quota/cost/raw response/hidden reasoning、physical submission execution |
| forbidden | non-frozen context submit；provider SDK type in contracts/domain；raw response/checkpoint；unknown result to action；timeout retry with new submission ID |

### 3.2 File allocation

| layer | files | responsibility |
|---|---|---|
| contracts | `commands.rs` | `StartModelTurn`、`ModelIntentPayload`、`ModelTurnResult` |
| contracts | `events.rs` | `ModelResultAvailable` payload and receipt |
| contracts | `queries.rs`、`views.rs` | `GetModelTurn`、`ModelTurnView`、`SafeDecisionSummaryView` |
| domain | `model.rs` | intent/turn/decision/disposition/summary invariants and state |
| application | `model_service.rs` | start/consume independent Flows |
| application | `ports/external.rs` | `ModelDecisionPort` |
| application | `ports/repositories.rs` | `ModelTurnRepositoryPort` and decision/history persistence |
| infra | `adapters.rs` | model adapter candidate or explicit blocked adapter |
| worker | `consumers.rs` | model result envelope mapping/order/dedupe |
| tests | model domain、start Flow、result consumer、adapter negative contract |

### 3.3 Object capability allocation

| object | required fields | functions |
|---|---|---|
| `ModelIntentPayload` | logical_selection、purpose、turn_budget、context_ref、source_refs | `validate_provider_neutral`、`canonical_digest_input` |
| `ModelIntent` | intent_id、run_id、logical_selection、purpose、context_ref、budget、source_refs、created_at | `create`、`validate`、`to_submission_input` |
| `ModelTurn` | turn_id、run_id、intent_id、context_id、status、submission_ref、config_snapshot_ref、version、timestamps | `start`、`mark_submitted`、`classify`、`mark_failed`、`mark_unknown` |
| `ModelSemanticResult` | submission_ref、result_kind、action_candidate_refs、input_request_ref、safe_result_ref、source_ref | `validate_schema`、`validate_correlation`、`validate_body_free` |
| `ModelDisposition` | kind、reason、action_candidate_refs、input_request_ref | `validate_variant_payload` |
| `ModelDecision` | decision_id、run_id、turn_id、disposition、source_refs、safe_summary_ref、decided_at | `from_semantic_result`、`to_safe_summary`、`to_history_fact` |
| `SafeDecisionSummary` | summary_ref、decision_id、category、redaction、source_refs、created_at | `redact`、`validate_non_reversible` |
| `ModelAdapterAvailability` | adapter_ref、logical_selections、status、reason、contract_version、checked_at | `blocked`、`candidate`、`permits_submission` |
| `ModelTurnApplicationService` | context/run/turn/feedback/history/idempotency/UoW/outbox/model/technical ports | `start(StartModelTurn)`、`consume(EventEnvelope<ModelResultAvailable>)` |

### 3.4 Port, protocol and Flow allocation

| boundary | exact contract |
|---|---|
| frozen context | `ContextRepositoryPort::get_frozen_context(context_id)`; mismatch returns `ContextNotFrozen` |
| turn persistence | `ModelTurnRepositoryPort::save(turn, expected_version, uow)` and `find_by_submission` |
| adapter availability | `ModelDecisionPort::availability(logical_selection)` returns no `Ready` claim |
| adapter submission | `ModelDecisionPort::submit(turn, context) -> ModelSubmission` with caller-stable submission identity |
| result query | `ModelDecisionPort::get_result(submission_ref) -> ModelSemanticResult` |
| start command Flow | pending turn/history/outbox committed before adapter call; receipt posture written in second UoW |
| result event Flow | envelope/source/schema/correlation/order/dedupe -> semantic mapping -> turn/decision/summary/history commit -> receipt |
| query Flow | turn/decision safe view only; raw result absent |

### 3.5 State and transaction

```text
pending -> submitted -> classified -> terminal
pending -> blocked
submitted -> failed
submitted -> unknown -> manual_review
```

| stage | local/external boundary |
|---|---|
| start UoW | intent、pending turn、history、outbox、stored result candidate |
| post-commit adapter call | same turn/submission identity; adapter `Blocked/Unavailable` cannot return success |
| receipt UoW | submitted/blocked/unknown posture, submission ref, history |
| result UoW | dedupe record、semantic decision、safe summary、turn classification、history/outbox |
| unknown | no action candidate consumption; only formal status/reconciliation or manual review |

### 3.6 Errors and tests

| case | posture | mandatory assertion |
|---|---|---|
| context not frozen/version mismatch | rejected/conflict | no turn/submission |
| adapter unconfigured/pending/blocked | blocked | pending turn may record blocked fact; no provider call success |
| submission timeout/receipt unknown | turn unknown | no new submission identity retry |
| event source/correlation/schema mismatch | rejected | no decision/classification |
| duplicate model result | duplicate stored receipt | one decision/summary only |
| late result after terminal turn | late linked fact | terminal decision unchanged |
| raw response/hidden reasoning present | protocol rejection | absent from object/event/log/checkpoint |
| semantic disposition action | action candidate refs only | execution remains CAP-07 and requires new guard |

### 3.7 Stop review

CAP-06 closes provider-neutral intent, turn, submission and semantic-result incorporation while keeping provider control external. Start, result, query, state, unknown and redaction paths are separately implementable.

## 4. Batch audit

| audit | result |
|---|---|
| CAP-04 candidate/source/budget/freeze chain is explicit | pass |
| CAP-05 working and durable memory ownership is separated | pass |
| CAP-06 local turn identity and provider control are separated | pass |
| each capability maps files, objects, Port, protocols, Flows, state, transaction and tests | pass |
| no generic “context/model manager” replaces service boundaries | pass |
