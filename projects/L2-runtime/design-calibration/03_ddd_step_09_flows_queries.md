# L2-runtime Step 9 function flows: 12 Queries

> 状态: done
> Query discipline: validate -> visibility -> committed read -> view mapping -> freshness/degraded result; no idempotency mutation, no UoW, no external refresh/write

## 1. `GetRunStatusFlow`

`RuntimeQueryHandler.handle -> QueryMetadata.validate -> ReadVisibilityPort.require_run_scope -> RunRepositoryPort.get(run_ref, ReadVersion::LatestCommitted, read_scope) -> HistoryRepositoryPort.find_fact(current_decision_ref) -> RunStatusView mapper -> QueryViewEnvelope`.

Errors: not visible uses leak-safe `NotVisible`; absent visible run -> `NotFound`; repository unknown -> `ViewFreshness::Unknown`; no write or refresh.

## 2. `GetRunHistoryFlow`

Validate metadata/cursor/limit/filter; verify run visibility; call `HistoryRepositoryPort.list_by_run(run_id, cursor, limit, scope)`; map each entry to `HistoryItemView` after body-free redaction; attach source watermark/page status/correlation. Cursor invalid -> `CursorInvalid`; empty -> `PageStatus::Empty`; stale projection marker remains stale.

## 3. `GetGoalPlanFlow`

Validate metadata and run/workspace visibility; load workspace at latest committed `ReadVersion`; verify workspace belongs to run; map every working item/dependency/progress/source version to `PlanItemView`; attach projection/freshness. Method/process body is not resolved. Cross-run workspace -> `NotVisible/ProtocolMismatch`; degraded sources -> envelope degraded.

## 4. `GetWorkingContextFlow`

Validate metadata and context visibility; read context/projection by typed ref; verify context digest/status; map ordered safe segment refs/redaction/source versions to view. Forbidden fragment/body -> `ProjectionError::UnsafeView`; expired/degraded context is returned with explicit status; no source resolver refresh.

## 5. `GetMemoryUseFlow`

Validate metadata/cursor/limit and run visibility; call `MemoryUseRepositoryPort.list_by_run`; map use identity, candidate/source/decision/context refs and disposition; return body-free page. Durable memory owner pending does not prevent reading already committed local use records; absence yields empty, not fake unavailable content.

## 6. `GetModelTurnFlow`

Validate metadata/turn visibility; load `ModelTurnRepositoryPort.get`; map turn/intent/context/submission/result refs, finite status and version. Optionally load `DecisionRepositoryPort` only when decision ref is visible; never call provider/model adapter. Pending/unknown turn is a valid view; raw output request is rejected.

## 7. `GetActionStateFlow`

Validate metadata/action visibility; read `ActionRepositoryPort.get`, latest precondition decision, side-effect marker and latest feedback header; map distinct choice/guard/effect refs and version. Missing marker for proposed action is legal; unknown marker remains unknown; feedback body is not exposed.

## 8. `GetDelegationStateFlow`

Validate metadata/delegation visibility; read delegation and child result ref; verify child scope is contained by caller read scope; map boundary/budget/status/child refs/version. Does not call child runtime or member/container services; pending/unknown remain visible.

## 9. `GetCheckpointStateFlow`

Validate metadata/run visibility; when checkpoint ref absent call `CheckpointRepositoryPort.get_latest_stable`; otherwise load specified checkpoint; map status/digests/history sequence/commit ref/version. `Prepared`, `CommitPending`, `CommitUnknown` and `Committed` remain distinct. No `CheckpointCommitPort.reconcile` is called by query.

## 10. `GetRuntimeOutcomeFlow`

Validate metadata/run visibility; call `OutcomeRepositoryPort.get_by_run`; map optional outcome disposition/result/safe summary/fence/finalized time. No outcome is a valid not-finalized view; query never calls handoff/artifact/observability owner and never promotes disposition.

## 11. `GetHandoffStateFlow`

Validate that attempt or gap ref is present and visible; load attempt and optional gap; map material/digest/status/ack/gap/freshness. Acknowledged does not become accepted; open/unknown gap is returned explicitly. No reconciliation or external status call occurs.

## 12. `GetProjectionStateFlow`

Validate metadata/projection visibility; call `ProjectionStorePort.read(ProjectionQuery::State)`; map name/status/cursor/source sequence/version/rebuild/gaps. If projection store is stale/degraded/rebuilding, return that posture rather than reading domain repositories to construct a pseudo-current view.

## 13. Query audit

| Query | Primary read surface | Cursor | Visibility before read | No-write assertion |
|---|---|---|---|---|
| `GetRunStatus` | run + current history anchor | none | yes | no UoW/external call |
| `GetRunHistory` | history page | history | yes | no append |
| `GetGoalPlan` | workspace | none | yes | no Method resolve |
| `GetWorkingContext` | context/projection | none | yes | no source refresh |
| `GetMemoryUse` | memory use page | memory-use | yes | no durable memory write |
| `GetModelTurn` | turn/decision ref | none | yes | no model adapter |
| `GetActionState` | action/guard/marker/feedback header | none | yes | no Tools/Sandbox |
| `GetDelegationState` | delegation/child refs | none | yes | no child runtime |
| `GetCheckpointState` | checkpoint | none | yes | no commit reconcile |
| `GetRuntimeOutcome` | local outcome | none | yes | no handoff/obs/artifact |
| `GetHandoffState` | attempt/gap | none | yes | no reconcile/status call |
| `GetProjectionState` | projection state | none | yes | no pseudo-rebuild |

```text
next_allowed_action = create_step_09_inbound_outbound_job_flows
```
