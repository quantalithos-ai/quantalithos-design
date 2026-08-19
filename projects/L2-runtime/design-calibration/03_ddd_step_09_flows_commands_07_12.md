# L2-runtime Step 9 function flows: Commands 07~12

> 状态: done
> 当前 Step: 9
> 范围: `ClassifyModelResult`, `ProposeAction`, `EvaluateActionPreconditions`, `ProposeDelegation`, `IncorporateActionFeedback`, `PrepareRuntimeCheckpoint`

## 1. `ClassifyModelResultFlow`

1. Validate command metadata/digest and reserve idempotency.
2. Read `ModelTurn` by turn ref and expected version; verify result ref submission identity and correlation.
3. Resolve `ModelSemanticResult` via `ModelDecisionPort::get_result` or approved result-reference seam; reject raw/hidden/body-bearing payload.
4. Call `ModelTurn::classify`, then `ModelDecision::from_semantic_result`; build `SafeDecisionSummary::redact`.
5. Save turn, decision, summary/history/outbox and stored result in one UoW.
6. Return `ModelClassificationResult`. The result can propose action/delegation semantically but does not pass governance/capability/sandbox guards.

Errors: submission mismatch -> `ProtocolMismatch`; late result -> durable quarantine; adapter pending -> `ExternalPending`; duplicate result -> replay/existing decision; commit unknown -> turn unknown fence.

## 2. `ProposeActionFlow`

1. Validate metadata/digest and reserve idempotency.
2. Read the referenced `ModelDecision` and `ControlledRun` under scope; verify `ModelDecision::permits_action_proposal` and candidate run/turn identity.
3. Validate `ActionCandidate` target, `SafeActionInputRef`, scope, budget and side-effect class.
4. Call `ActionDecision::propose`; append action decision/history/outbox and stored result in one UoW.
5. Return `ActionProposalResult` with `Proposed` disposition. No Governance, Capability Hub, Tools or Sandbox mutation/call occurs.

Errors: model disposition not action-capable -> `IllegalTransition`; scope/candidate mismatch -> `ScopeViolation`; forbidden input body -> `ForbiddenBody`; duplicate proposal identity -> replay or superseded result.

## 3. `EvaluateActionPreconditionsFlow`

1. Validate metadata/digest and reserve idempotency.
2. Load `ActionDecision` with expected version and verify it is `Proposed` or eligible for re-evaluation; load current source/effect marker versions.
3. Read Governance effective precondition, Capability exposure/descriptor, Tools contract availability and Sandbox isolation requirement through independent Ports.
4. Construct typed `ActionPreconditionInputs`; call `ActionPreconditionDecision::evaluate`.
5. Attach guard decision to action only when version guard remains current; append guard/history/outbox/stored result in one UoW.
6. Return `ActionPreconditionResult`. Only `Allowed` is submittable and it expires when any checked version changes.

Errors: any required owner view pending/unknown -> `Waiting`, `Blocked` or `Unknown`; formal denial -> `Denied`; scope mismatch -> `ScopeViolation`; stale checked versions -> `VersionConflict`; no local positive capability/approval is invented.

## 4. `ProposeDelegationFlow`

1. Validate metadata/digest and reserve idempotency.
2. Load parent run/action and frozen context; verify parent is active and action candidate is delegation-capable.
3. Validate `ChildContextBoundary::validates_parent`, child scope containment, explicit excluded refs, delegation depth and budget.
4. Call `Delegation::create`; optionally create a child `RuntimeAdmissionDecision` as a bounded candidate, never a child container/member record.
5. Save delegation/admission/history/outbox/stored result in a local UoW before child call.
6. Return `DelegationProposalResult` with `Proposed` or `Blocked`.

Errors: parent/child scope escape -> `ScopeViolation`; budget expansion/depth zero -> `BudgetExceeded`; missing context segment -> `ContextMismatch`; child seam pending is represented only when a later internal submission operation is invoked.

## 5. `IncorporateActionFeedbackFlow`

1. Validate metadata/digest and reserve command identity; event consumer additionally reserves `event_id` in `EventInboxPort`.
2. Verify external source owner, action ID, submission ID, marker ID, run correlation and schema version.
3. Find existing feedback by source event. If found, return `Duplicate` receipt/result without marker mutation.
4. Read marker/action and previous ordering anchor; call `ActionFeedbackRecord::incorporate` and `FeedbackIncorporationDecision::decide`.
5. Append immutable feedback record. Apply marker transition only for `Apply`; late/out-of-order/mismatch become record-only/quarantine/manual-review.
6. If disposition requires progress, load run/workspace at expected versions and create a new `RunProgressDecision`; never rewrite the old outcome/decision.
7. Commit feedback, marker/progress/history/outbox/inbox receipt and stored result in one UoW.
8. Return `FeedbackResult` with explicit ordering disposition.

Errors: event/source mismatch -> `ProtocolMismatch`; duplicate -> `EventDisposition::Duplicate`; late/out-of-order -> quarantine; unknown external effect -> marker `Unknown` and recovery/manual review; commit unknown -> consumer receipt `Unknown`.

## 6. `PrepareRuntimeCheckpointFlow`

1. Validate metadata/digest and reserve idempotency.
2. Load run/workspace/working-memory/frozen-context and latest history sequence under expected versions.
3. Load all unresolved side-effect markers and compute `EffectFenceSummary`; capture `StableStateCandidate` with state/source/history digests.
4. Require `StableStateCandidate::permits_prepare` and call `RuntimeCheckpoint::prepare`; status is `Preparing` then `Prepared` only after local validation.
5. Save checkpoint/history/outbox/stored result in one UoW; no physical persistence proof is inferred.
6. Return `CheckpointPrepareResult` with `Prepared` or blocked/invalid disposition.

Errors: unknown/irreversible unresolved effect -> `UnknownEffectFence`; version/history mismatch -> `VersionConflict`; missing frozen context or source -> `CheckpointBlocked`; local commit unknown -> checkpoint `CommitUnknown` candidate, not stable.

## 7. Batch audit

| Check | Result |
|---|---|
| Each Command has distinct read set, domain call and write set | pass |
| Action selection, guard, attempt and feedback remain separate | pass |
| Child boundary and incorporation are once-only | pass |
| Checkpoint prepare is separate from physical commit | pass |
| Error/duplicate/late/unknown branches explicit | pass |

```text
next_allowed_action = create_step_09_flows_commands_13_17
```
