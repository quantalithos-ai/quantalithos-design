# L2-runtime Step 9 function flows: Commands 13~17

> 状态: done
> 范围: `CommitRuntimeCheckpoint`, `RequestRecoveryDecision`, `FinalizeRuntimeOutcome`, `CreateHandoffCandidate`, `CaptureSourceSnapshot`

## 1. `CommitRuntimeCheckpointFlow`

1. Validate metadata/digest and reserve idempotency.
2. Load checkpoint under expected `CheckpointVersion`; require `Prepared` or `CommitPending`, matching state/effect digests and run scope.
3. Begin the physical checkpoint contract via `CheckpointCommitPort::commit(CheckpointCommitRequest)`; this Port is `L2R-CP-001` pending.
4. Map receipt: matching `Committed` receipt calls `RuntimeCheckpoint::mark_committed`; rejection/conflict invalidates or blocks; `Unknown` calls `mark_commit_unknown(FenceRef)`.
5. Save checkpoint/status, history, outbox (only for proven committed status) and stored result in a local UoW; commit status itself is never inferred from method return alone.
6. Return `CheckpointCommitResult`. A `CommitUnknown` result schedules reconciliation/manual review and cannot be used by resume.

Errors: prepared digest mismatch -> `CheckpointInvalid`; physical contract pending -> `ExternalPending`; receipt mismatch -> `CommitError`; unknown commit -> explicit unknown fence; version conflict -> retry only before physical call.

## 2. `RequestRecoveryDecisionFlow`

1. Validate metadata/digest and reserve idempotency.
2. Read run, optional checkpoint, side-effect markers, source availability and prior recovery decision.
3. Compute `EffectFenceSummary`; build `RecoveryInputs` with trigger, requested mode, lease/source refs and current aggregate versions.
4. Call `RecoveryDecision::decide`; `Resume`/`RestartFromStable` require committed checkpoint, matching digest/versions and closed fence; `ReconcileOnly` performs no external action.
5. Append recovery decision/history/outbox and stored result in one UoW; previous decisions remain immutable.
6. Return `RecoveryResult` with next action ref only when a new local continuation is eligible.

Errors: no stable point -> `NoStableCheckpoint`; unknown effect/commit -> `ManualReview` or `WaitForFact`; stale source -> `SourceStale`; version conflict/duplicate handled by reservation.

## 3. `FinalizeRuntimeOutcomeFlow`

1. Validate metadata/digest and reserve idempotency.
2. Load run/workspace/terminal progress decision and unresolved side-effect markers; compute effect fence.
3. Validate `LocalOutcomeInputs` and `RunProgressDecision::is_terminal`; requested `Succeeded`/`Partial` must meet policy-specific terminal proof, and unknown fence blocks positive disposition.
4. Call `RuntimeOutcome::finalize`; update `ControlledRun::finalize_outcome` at expected run version.
5. Save outcome/run/history/outbox/stored result in one local UoW; commit local truth before handoff or publisher attempts.
6. Return `OutcomeResult`. Handoff/ack/observed/artifact acceptance remain independent downstream facts.

Errors: non-terminal decision -> `NonTerminalProgress`; unknown fence -> `UnknownEffectFence`; terminal duplicate -> replay/existing outcome; version conflict -> `VersionConflict`; commit unknown -> run/outcome unknown posture.

## 4. `CreateHandoffCandidateFlow`

1. Validate metadata/digest and reserve idempotency.
2. Read committed `RuntimeOutcome`, safe result/summary refs and target visibility; build `SafeHandoffMaterial` with redaction and digest policy.
3. Call `HandoffAttempt::create_candidate`; if material is ineligible or route contract pending, create an explicit gap/blocked candidate without external submit.
4. Save material/attempt/gap/history/outbox/stored result in one UoW.
5. Return `HandoffResult`; a later internal submission/reconciliation operation may call `HandoffPort`, but this public Command does not claim delivery.

Errors: missing local outcome -> `OutcomeUnavailable`; forbidden body -> `ForbiddenBody`; pending route/producer -> `ExternalPending`; digest/version conflict -> conflict; commit unknown -> attempt/gap unknown.

## 5. `CaptureSourceSnapshotFlow`

1. Validate metadata/digest and reserve idempotency.
2. Validate source authority/scope and call `SourceResolverPort::resolve` with requested freshness.
3. Convert result to `SourceSnapshot::capture` and `SourceAvailability::record`; partial/metadata-only/unknown completeness remains explicit.
4. Save snapshot metadata, availability marker, source-change history/outbox and stored result in one UoW.
5. Return `SourceSnapshotResult`; owner body is never stored in Runtime.

Errors: owner authority mismatch -> `SourceError::AuthorityMismatch`; pending contract -> `SnapshotPending`; stale -> `SnapshotStale`; forbidden body -> protocol rejection; commit unknown -> source marker unknown.

## 6. Command inventory audit

| # | Command | Independent Flow | Main local write set | External call position |
|---:|---|---|---|---|
| 1 | `AcceptRuntimeTrigger` | `AcceptRuntimeTriggerFlow` | admission/run/workspace/history/outbox/idempotency | before run decision only safe reads |
| 2 | `ApplyRuntimeControl` | `ApplyRuntimeControlFlow` | run/control/history/result | no external effect cancellation |
| 3 | `EvaluateRunProgress` | `EvaluateRunProgressFlow` | decision/run/workspace/history/result | source/definition reads |
| 4 | `ComposeWorkingContext` | `ComposeWorkingContextFlow` | context/memory/use/history/result | source/memory reads |
| 5 | `RecordWorkingMemory` | `RecordWorkingMemoryFlow` | window/entry/use/history/result | no durable owner write |
| 6 | `StartModelTurn` | `StartModelTurnFlow` | intent/turn/history/result then status | after first local commit |
| 7 | `ClassifyModelResult` | `ClassifyModelResultFlow` | turn/decision/summary/history/result | semantic result read |
| 8 | `ProposeAction` | `ProposeActionFlow` | action/history/result | no external call |
| 9 | `EvaluateActionPreconditions` | `EvaluateActionPreconditionsFlow` | guard/action/history/result | read external views |
| 10 | `ProposeDelegation` | `ProposeDelegationFlow` | delegation/admission/history/result | child call is later internal operation |
| 11 | `IncorporateActionFeedback` | `IncorporateActionFeedbackFlow` | feedback/marker/progress/history/result | feedback source read |
| 12 | `PrepareRuntimeCheckpoint` | `PrepareRuntimeCheckpointFlow` | checkpoint/history/result | no physical commit |
| 13 | `CommitRuntimeCheckpoint` | `CommitRuntimeCheckpointFlow` | checkpoint/history/outbox/result | after local prepare, pending Port |
| 14 | `RequestRecoveryDecision` | `RequestRecoveryDecisionFlow` | recovery/history/result | no blind external retry |
| 15 | `FinalizeRuntimeOutcome` | `FinalizeRuntimeOutcomeFlow` | outcome/run/history/outbox/result | no handoff before commit |
| 16 | `CreateHandoffCandidate` | `CreateHandoffCandidateFlow` | material/attempt/gap/history/outbox/result | external submit is later operation |
| 17 | `CaptureSourceSnapshot` | `CaptureSourceSnapshotFlow` | snapshot/availability/history/outbox/result | safe source resolve |

## 7. Batch gate

```text
next_allowed_action = create_step_09_flows_queries_events_jobs
```
