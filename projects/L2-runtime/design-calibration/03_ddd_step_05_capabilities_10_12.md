# L2-runtime Step 5 capability cards: CAP-10~12

> 状态: done
> 当前 Step: 5
> 批次: checkpoint/recovery、local outcome、handoff/projection
> 输入: CAP-01~09 cards、Step 3/4、L1-artifact/L4-observability granularity、checkpoint/handoff blockers

## 1. CAP-10 Checkpoint & Recovery

### 1.1 Capability contract

| 项目 | 契约 |
|---|---|
| 目标 | 在 context frozen、local mutation committed、version known、effect fence closed 的候选点创建 stable checkpoint；在异常、unknown 或外部反馈后形成新的 recovery decision |
| typed input | `CommitRuntimeCheckpoint`、`StableStateCandidate`、`RequestRecoveryDecision`、`RecoveryInputs`、effect marker page |
| typed output | `CheckpointResult`、`RecoveryResult`、`RuntimeCheckpoint`、`RecoveryDecision`、manual-review/unknown facts |
| local truth | checkpoint marker/status、recovery decision sequence、unknown/manual-review fence、resume eligibility marker |
| external owner | physical DB atomicity/status query、external effect repair、provider/tool/sandbox recovery |
| forbidden | repository call == committed；unknown checkpoint == stable；recovery rewrites history or repairs external truth；blind action retry |

### 1.2 File allocation

| layer | files | responsibility |
|---|---|---|
| contracts | `commands.rs` | checkpoint/recovery request/result/trigger/fence carriers |
| contracts | `queries.rs`、`views.rs`、`jobs.rs` | checkpoint/recovery views and `ResumeEligibleRuns`/`ReconcileUnknownEffects` reports |
| domain | `checkpoint.rs` | stable candidate、checkpoint aggregate、commit disposition/fence |
| domain | `recovery.rs` | recovery inputs/decision/disposition |
| domain | `run.rs` | attach stable checkpoint and local run posture |
| application | `recovery_service.rs` | commit checkpoint and request recovery Flows |
| application | `ports/repositories.rs` | checkpoint/recovery/run/effect/lease/history Ports |
| infra | repositories/UoW/lease/runtime builder | logical persistence; physical contract pending |
| jobs | `resume.rs`、`reconcile.rs` | bounded eligible/reconciliation jobs |

### 1.3 Object allocation

| object | required fields | functions |
|---|---|---|
| `StableStateCandidate` | run_id、run_version、frozen_context_ref、goal_plan_ref、working_memory_ref、decision_refs、state_digest、effect_fence、source_versions | `validate_stable_predicate`、`canonical_digest_input` |
| `SideEffectFence` | fence_id、run_id、unresolved_marker_refs、status、as_of_version | `is_closed`、`is_unknown` |
| `RuntimeCheckpoint` | checkpoint_id、run_id、sequence、stable_refs、state_digest、version、status、commit_receipt_ref、side_effect_fence、created_at | `prepare`、`mark_committed`、`mark_invalid`、`mark_commit_unknown`、`is_stable` |
| `RecoveryInputs` | run_ref、checkpoint_ref、effect_markers、last_error_refs、source_availability、trigger_kind | `validate`、`has_unknown_fence` |
| `RecoveryDecision` | decision_id、run_id、sequence、checkpoint_ref、disposition、reason、fence_refs、source_refs、created_at | `decide`、`requires_manual_review`、`to_history_fact` |
| `CheckpointResult` | checkpoint_ref、status、commit_disposition、fence_ref、stored_result_ref | protocol carrier; no truth ownership |
| `RecoveryApplicationService` | run/checkpoint/recovery/effect/history/idempotency/UoW/lease/outbox Ports | `commit`、`decide` |

### 1.4 Port, protocol and Flow allocation

| boundary | contract |
|---|---|
| stable reads | `ContextRepositoryPort::get_frozen_context`、`RunRepositoryPort::get_for_update`、`SideEffectRepositoryPort::list_unresolved` |
| checkpoint write | `CheckpointRepositoryPort::prepare(checkpoint, expected_version, uow)`; return must distinguish committed/rejected/unknown |
| checkpoint read | `get_latest_stable` only returns proven committed; `list_commit_unknown` feeds reconciliation, not resume |
| recovery write | `RecoveryRepositoryPort::append(decision, uow)` + `HistoryRepositoryPort::append` |
| command Flows | `CommitRuntimeCheckpointFlow` and `RequestRecoveryDecisionFlow` are separate handlers/services |
| job Flows | `ResumeEligibleRunsFlow` excludes unknown/manual-review; `ReconcileUnknownEffectsFlow` uses stable submission identity/status query only |
| query | `GetCheckpointStateFlow` exposes committed/invalid/unknown; `GetRunStatusFlow` exposes local posture |

### 1.5 State, transaction and tests

```text
checkpoint: preparing -> committed | invalid | unknown
recovery: proposed -> resume | restart | wait | block | manual_review
```

| rule | test assertion |
|---|---|
| stable predicate | missing frozen context/version/fence/source prevents `prepare` success |
| UoW | checkpoint fact/run stable marker/history/idempotency/outbox share local transaction |
| commit unknown | checkpoint remains unknown; `is_stable=false`; resume job excludes it |
| unknown effect | recovery must be wait/block/manual_review; no new external submission |
| resume | only committed checkpoint + closed fence + fresh source + new decision identity |
| restart | local working decision only; no external effect replay |
| version conflict | old run/checkpoint unchanged; new command after reload |
| query | unknown/manual review visible as safe posture, not success/not-found |
| physical blocker | fake UoW cannot mark production ready; `L2R-CP-001` stays blocked |

### 1.6 Stop review

CAP-10 separates checkpoint proof, persistence uncertainty, recovery disposition and external effect reconciliation. Stable, unknown, resume and manual-review paths are independently implementable.

## 2. CAP-11 Local Outcome

### 2.1 Capability contract

| 项目 | 契约 |
|---|---|
| 目标 | 根据 terminal local decision、known version、closed effect fence 和 safe result refs 生成 immutable Runtime local outcome；local outcome precedes handoff/observation/acceptance |
| typed input | `FinalizeRuntimeOutcome`、terminal decision refs、result refs、source refs、effect marker page |
| typed output | `OutcomeResult`、`RuntimeOutcome`、terminal run state/history/outbox |
| local truth | outcome disposition/result refs/committed version、run terminal posture |
| external read | verified feedback/effect marker/source refs only |
| forbidden | handoff ACK/observed/artifact acceptance promote outcome；unknown fence terminal success；outcome body/report/evidence ownership |

### 2.2 File and object allocation

| layer | files | responsibility |
|---|---|---|
| contracts | `commands.rs`、`views.rs`、`events.rs` | finalize command/result/outcome view/outbound snapshot |
| domain | `outcome.rs`、`run.rs` | outcome invariant and terminal run transition |
| application | `outcome_service.rs` | terminal proof and local-first commit |
| application | `ports/repositories.rs` | run/history/outcome/effect/checkpoint reads/writes |
| infra | `repositories.rs`、`outbox_store.rs` | local outcome persistence candidate |
| api | `command_handlers.rs`、`query_handlers.rs` | finalize/get outcome |
| tests | terminal proof/local-first/handoff independence |

### 2.3 Object allocation

| object | required fields | functions |
|---|---|---|
| `LocalOutcomeInputs` | run_id、terminal_decision_ref、result_ref、source_refs、run_version、effect_fences、disposition | `validate_terminal_proof`、`has_unknown_fence` |
| `RuntimeOutcome` | outcome_id、run_id、disposition、result_ref、source_refs、committed_version、terminal_reason、created_at | `finalize`、`is_terminal`、`to_safe_summary_ref` |
| `OutcomeResult` | outcome_ref、run_ref、disposition、version、stored_result_ref | `from_commit` |
| `OutcomeApplicationService` | run/outcome/history/effect/checkpoint/idempotency/UoW/outbox Ports | `finalize(FinalizeRuntimeOutcome)` |

### 2.4 Flow, state, transaction and tests

| concern | contract |
|---|---|
| Flow | load run expected version/history terminal facts/effects -> validate local proof -> `RuntimeOutcome::finalize` -> save run/outcome/history/idempotency/outbox -> commit |
| state | candidate -> succeeded/partial/blocked/failed/cancelled/unknown; no second terminal mutation |
| unknown | missing proof or commit unknown -> unknown/manual review; no handoff candidate |
| local-first | handoff adapter is not called inside outcome UoW and cannot roll back local outcome |
| tests | terminal proof matrix, one-outcome idempotency, effect unknown veto, handoff ACK independence, redaction of result refs |

### 2.5 Stop review

CAP-11 owns only local outcome and run terminal posture; accepted/observed/evidence/report/verdict remain external.

## 3. CAP-12 Handoff & Safe Projection

### 3.1 Capability contract

| 项目 | 契约 |
|---|---|
| 目标 | 从 committed local outcome 构造 body-free safe material，记录 handoff attempt/gap，维护可从 committed history 重建的 projection/read view |
| typed input | `CreateHandoffCandidate`、`ReconcileHandoffGap`、`RebuildSafeRuntimeViews`、Query metadata/cursor |
| typed output | `HandoffResult`、`GapResult`、`SafeRuntimeView`、`ProjectionState`、job reports、outbound snapshots |
| local truth | material eligibility、attempt/ack posture、gap state、projection cursor/freshness/visibility |
| external owner | delivery/observed/acceptance、artifact/evidence body、Observability backend、Bus route |
| forbidden | outcome before local commit；gap self-close；ack=>accepted；projection stale=>current without rebuild；material contains body |

### 3.2 File allocation

| layer | files | responsibility |
|---|---|---|
| contracts | `commands.rs`、`events.rs`、`queries.rs`、`jobs.rs`、`views.rs` | handoff/gap/projection DTOs, envelopes, pages/reports |
| domain | `handoff.rs`、`projection.rs` | material/attempt/gap/view/projection state/invariants |
| application | `handoff_service.rs`、`query_service.rs`、`job_service.rs` | create/reconcile/query/rebuild/publish orchestration |
| application | `ports/projection.rs`、`ports/external.rs` | ProjectionStore/Handoff/EventPublisher Ports |
| infra | `handoff.rs`、`projection_store.rs`、`publisher.rs`、`outbox_store.rs` | local derived stores and explicit pending adapters |
| api/worker/jobs | query handler, acknowledgement consumer, rebuild/reconcile/publish runners |

### 3.3 Object allocation

| object | required fields | functions |
|---|---|---|
| `SafeHandoffMaterial` | material_ref、run_id、outcome_ref、safe_summary_refs、result_refs、redaction、eligibility、material_digest | `build`、`validate_body_free`、`is_eligible` |
| `HandoffAttempt` | attempt_id、run_id、material_ref、material_digest、target_seam、status、submission_ref、correlation、version | `create_candidate`、`mark_submitted`、`mark_acknowledged`、`mark_rejected`、`mark_unknown` |
| `HandoffGap` | gap_id、attempt_id、kind、status、reason、ack_ref、source_ref、version | `open_gap`、`reconcile`、`close` |
| `SafeRuntimeView` | view_id、run_id、read_scope、safe_fields、source_cursor、source_version、freshness、visibility、projection_status | `rebuild`、`is_visible` |
| `ProjectionState` | projection_id、name、scope、cursor、source_version、status、rebuild_marker、last_error_ref | `begin_rebuild`、`advance`、`mark_stale`、`mark_degraded` |
| `HandoffApplicationService` | outcome/material/attempt/gap/history/idempotency/UoW/handoff/publisher Ports | `create`、`reconcile` |
| `ProjectionApplicationService` | history/projection/visibility/source ports、lease | `rebuild`、`read` |

### 3.4 Port, protocol and Flow allocation

| boundary | contract |
|---|---|
| local outcome read | `OutcomeRepositoryPort::get(run_id)` must return committed local outcome only |
| material | pure `SafeHandoffMaterial::build(outcome, safe_refs)`; redaction failure blocks |
| attempt/gap persistence | `HandoffRepositoryPort::save_attempt/save_gap` in local UoW; expected versions |
| handoff external | `HandoffPort::submit(material, metadata)` only after attempt commit; `reconcile(attempt_id, ack_ref)` with same identity |
| projection rebuild | `HistoryRepositoryPort::list_by_run`/committed page -> `ProjectionStorePort::write_page(expected_cursor)` |
| query | 12 Query Flows read local repositories/projection and expose visibility/freshness/stale/degraded/rebuilding |
| jobs | `RebuildSafeRuntimeViewsFlow`、`ReconcileHandoffGapsFlow`、`PublishRuntimeOutboxFlow` independent lease/cursor units |

### 3.5 State, transaction and tests

```text
handoff attempt: candidate -> submitted -> acknowledged | rejected | unknown
handoff gap: open | unknown_gap -> closed only with verified source
projection: rebuilding -> current | stale | degraded | unknown
```

| case | assertion |
|---|---|
| local outcome absent/uncommitted | no material/attempt |
| unsafe material/body | rejected; no external submit |
| submit receipt unknown | attempt unknown/open gap; no new attempt id |
| acknowledgement mismatch | gap remains open; outcome unchanged |
| projection gap/cursor regression/schema mismatch | rebuilding/degraded; no current view |
| query not-visible | no object existence/body leak |
| projection rebuild duplicate page | same cursor/digest idempotent; no duplicate derived rows |
| publisher failure | local facts remain; outbox pending/unknown same event identity |

### 3.6 Stop review

CAP-12 independently closes local-first outcome handoff, attempt/gap reconciliation and read-only rebuildable projection; external delivery/observed/acceptance remain pending.

## 4. Step 5 final capability audit

| capability | card | file/object | Port/protocol | Flow/state | txn/error/test | result |
|---|---|---|---|---|---|---|
| CAP-01 | §1 | explicit | explicit | entry validation | explicit | pass |
| CAP-02 | §2 | explicit | explicit | 2 Commands + Query | explicit | pass |
| CAP-03 | §3 | explicit | explicit | progress + query | explicit | pass |
| CAP-04 | §1 | explicit | explicit | compose + query | explicit | pass |
| CAP-05 | §2 | explicit | explicit | source/compact/query | explicit | pass |
| CAP-06 | §3 | explicit | explicit | start/result/query | explicit | pass |
| CAP-07 | §1 | explicit | explicit | guard/submit/query | explicit | pass |
| CAP-08 | §2 | explicit | explicit | create/result/query | explicit | pass |
| CAP-09 | §3 | explicit | explicit | 3 independent consumers | explicit | pass |
| CAP-10 | §1 | explicit | explicit | checkpoint/recovery/jobs | explicit | pass |
| CAP-11 | §2 | explicit | explicit | finalize/query | explicit | pass |
| CAP-12 | §3 | explicit | explicit | handoff/reconcile/query/jobs | explicit | pass |

Step 5 is complete only after this table and all capability card sections are present; row count is diagnostic only.
