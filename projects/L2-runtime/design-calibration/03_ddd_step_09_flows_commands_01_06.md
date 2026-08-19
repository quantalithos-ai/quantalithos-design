# L2-runtime Step 9 function flows: Commands 01~06

> 状态: done
> 当前 Step: 9
> 范围: `AcceptRuntimeTrigger`, `ApplyRuntimeControl`, `EvaluateRunProgress`, `ComposeWorkingContext`, `RecordWorkingMemory`, `StartModelTurn`

## 1. `AcceptRuntimeTriggerFlow`

| 阶段 | 调用 | 输入/读面 | 写面/副作用 | 错误映射 |
|---|---|---|---|---|
| 1 validate | `RuntimeCommandHandler.handle` -> `CommandMetadata.validate` | envelope, schema, actor, scope, trigger refs | none | invalid field/schema/body -> `ProtocolError::InvalidRequest`; no UoW |
| 2 digest | `DigestPort.digest(metadata.canonical_digest_input(trigger))` | typed refs, enum values, scope, source version | compare request digest | mismatch -> `ProtocolError::DigestMismatch` |
| 3 reservation | `UnitOfWorkPort.begin` then `IdempotencyPort.reserve` | operation/key/digest | reservation in UoW | same digest -> replay result; different digest -> conflict; store unavailable -> `IdempotencyError` |
| 4 source reads | `SourceResolverPort.availability(source_ref)` and `GovernancePreconditionPort.read` | source owner/version/freshness, formal precondition refs | no external writes | pending/stale/unknown -> decision posture `Waiting/Blocked`, not acceptance |
| 5 domain decision | `RuntimeTriggerContext::create`; `RuntimeAdmissionDecision::decide` | trigger, `PreconditionSummary`, generated decision ID | admission decision object | scope/source/precondition violation -> `DomainError`; no run |
| 6 accepted mutation | `ControlledRun::create`; `GoalPlanWorkspace::create` | accepted decision, trigger, generated IDs/time | run/workspace local truth | duplicate run/version conflict -> `ApplicationError::VersionConflict` |
| 7 local commit | `RunRepositoryPort.save`; `GoalPlanRepositoryPort.save`; `HistoryRepositoryPort.append`; `OutboxRepositoryPort.append`; `IdempotencyPort.store_result`; `UnitOfWorkPort.commit` | expected `None`/new versions | one local UoW | commit known failure -> rollback/error; commit unknown -> run posture unknown/manual review, no accepted result |
| 8 post-commit | `EventPublisherPort` via outbox job, not inline truth write | committed snapshot | publish attempt only | publish pending/unknown -> outbox pending; local admission unchanged |
| 9 result | `AdmissionResult` | decision/run/workspace refs | stored result ref | accepted returns run; waiting/blocked/rejected returns no run |

Idempotency identity: `operation + metadata.idempotency_key + request_digest`; replay never allocates a second `RunId`.

## 2. `ApplyRuntimeControlFlow`

1. `RuntimeCommandHandler` validates `ApplyRuntimeControl` metadata/digest and reserves command identity.
2. Service begins UoW and loads `ControlledRun` with `RunRepositoryPort.get_for_update(run_ref, expected_run_version, scope)`. Missing visibility returns `NotVisible` without existence leakage.
3. For `Resume`, it loads `CheckpointRepositoryPort.get_latest_stable` or the requested checkpoint and `SideEffectRepositoryPort.list_unresolved`; for `Cancel/Stop/Pause`, it loads unresolved markers to prevent false cleanup assumptions.
4. `RuntimeControlIntent::validate_against(run, ControlGuard)` checks scope, terminal status, checkpoint stability and unknown fences.
5. `ControlledRun::apply_control` creates a new control/progress posture and `RuntimeHistoryEntry`; prior facts remain immutable.
6. Save run/history/outbox/stored result in one UoW with expected `RunVersion`, commit, then release resources.
7. Return `ControlResult`; no Tool/Sandbox cancellation call is performed because Runtime does not own external effect cancellation.

Errors: `IllegalTransition` for terminal/resume misuse; `CheckpointUnavailable` for resume without stable point; `UnknownEffectFence` for resume/cancel requiring manual posture; version conflict retries only before any external call; commit unknown returns explicit unknown result.

## 3. `EvaluateRunProgressFlow`

1. Validate command metadata/digest and reserve idempotency.
2. Begin UoW, load run/workspace/candidate page at expected versions, and read unresolved side-effect markers plus source snapshots/definition refs through `SourceResolverPort` and `DefinitionResolverPort`.
3. Build typed `DecisionInputs`; `DecisionInputs::validate_for_run` rejects cross-run refs, unknown required source and malformed terminal request.
4. Call `RunProgressDecision::decide`; disposition is one of `Continue`, `WaitForInput`, `Blocked`, `Reflect`, `ProduceAction`, `Delegate`, `PrepareCheckpoint`, `TerminalCandidate`.
5. Apply decision to `GoalPlanWorkspace::record_progress` and `ControlledRun::apply_progress`; terminal candidate does not itself finalize outcome.
6. Append decision/history/outbox and store result in one UoW; commit with both expected versions.
7. Return `ProgressResult` with next item refs and new versions. No external method/process completion is inferred.

Errors: missing dependency -> `Waiting/Blocked`; source resolver pending -> `SourcePending`; candidate page cursor conflict -> `VersionConflict`; terminal proof absent -> `TerminalEligibilityError`; commit unknown -> run/workspace unknown posture and recovery candidate.

## 4. `ComposeWorkingContextFlow`

1. Validate command metadata/digest and reserve idempotency.
2. Read run scope and working-memory window at `expected_memory_version`; issue `MemoryRetrievalPort::retrieve(RetrievalRequest)` using a bounded cursor/limit.
3. Resolve candidate snapshots and availability through `SourceResolverPort`; classify each candidate as eligible, stale, duplicate, budget-excluded, policy-denied or pending.
4. Call `ContextCompositionDecision::decide` with mandatory segments, candidates, budget and composition policy; fail closed if mandatory source is unsafe or unknown.
5. Convert selected candidates to ordered `ContextSegment`s; call `WorkingContext::assemble`; freeze only if the command requests a model-ready context and all required sources satisfy freshness.
6. Create one `MemoryUseRecord` for every considered candidate, including exclusions; save context/window/use/history/outbox in one UoW with window/context versions.
7. Commit and return `ContextCompositionResult`. Durable episodic/semantic body is never written locally.

Errors: memory owner pending -> `Partial` only for optional source, otherwise `Blocked`; stale mandatory source -> `SourceStale`; budget overflow -> `BudgetExceeded`; forbidden body -> `ForbiddenBody`; UoW unknown -> context remains uncommitted and job sees reconciliation candidate.

## 5. `RecordWorkingMemoryFlow`

1. Validate metadata/digest and reserve idempotency.
2. Load run-scoped `WorkingMemory` at expected window version and validate candidate scope, source availability and run ownership.
3. Build `WorkingMemoryEntry::from_candidate` and `MemoryUseRecord::record` with `MemoryUseDisposition::Incorporated` or an explicit exclusion.
4. Apply `WorkingMemory::add` with expected version; append memory-use/history/outbox and stored result in one UoW.
5. Commit and return new window version. A duplicate `MemoryUseIdentity` replays the stored result and does not append a second entry.

Errors: wrong run/scope -> `ScopeViolation`; unavailable durable source -> `PendingSource` or `MemoryUnavailable`; frozen window -> `IllegalTransition`; version conflict -> retry before external calls; commit unknown -> window status unknown/degraded.

## 6. `StartModelTurnFlow`

1. Validate command metadata/digest and reserve idempotency.
2. Load run and `WorkingContext` using `ContextRepositoryPort::get_frozen_context(context_ref, context_digest, scope)`; reject assembling/expired/degraded context when model policy requires frozen complete input.
3. Validate `ModelIntent::validate_context` and `LogicalModelSelection`; read adapter availability. Pending/unavailable adapter yields local blocked turn result without external submission.
4. Create `ModelTurn::start`, mark submission candidate, append turn/history/outbox and store result in a first local UoW. This records intent before the adapter call.
5. Call `ModelDecisionPort::submit(turn, frozen_context)` with correlation and digest-bound context.
6. In a second UoW, map accepted candidate to `ModelTurn::mark_submitted`; known rejection to `fail/block`; unknown call/receipt to `mark_unknown(FenceRef)` and append recovery marker.
7. Return `ModelTurnResult` with `CandidateCommitted`, `Submitted`, `Blocked` or `Unknown`.

Errors: context digest mismatch -> `ContextMismatch`; adapter pending -> `ExternalPending`; adapter rejection -> `ModelAdapterRejected`; post-call uncertainty -> `ExternalUnknown` and no automatic retry.

## 7. Batch audit

| Check | Result |
|---|---|
| Six Commands have independent phases and side effects | pass |
| Expected versions/cursors are named at every mutable read | pass |
| UoW and idempotency are explicit | pass |
| Model/memory external body and readiness are not fabricated | pass |
| Commit unknown/late/duplicate paths are explicit | pass |

```text
next_allowed_action = create_step_09_flows_commands_07_12
```
