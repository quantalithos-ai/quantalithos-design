# L2-tools Step 9 函数流附录: 4 outbound Event continuations

> 状态: completed / pass
> 主文件: `03_ddd_step_09_function_flows.md`
> 入口: `SafeMaterialContinuationUseCases::continue_material`
> 协作 Port: `SafeEventCollaborationPort`
> Blockers: `L2T-UP-004~007`; logical event mapping is closed, physical route/delivery/observation is not.

## 1. Batch input and invariant

This batch expands the four Step 8 semantic Event variants into one application-owned
continuation flow each. The input is a committed immutable `SafeHandoffMaterial` reference plus
its exact class, target and `ContinuationKey`; the worker cannot provide an arbitrary event name,
payload, route or retry instruction. The application reloads material, derives the closed event
variant through a pure mapper, and verifies the canonical event identity before touching the
submission store.

The side-effect fence is deliberately two phase:

```text
committed SafeHandoffMaterial
  -> pure map_tool_semantic_event_from_material
  -> phase-1 UoW: create ExternalSubmissionAttempt::Prepared + idempotency claim
  -> commit/resolve commit
  -> exactly one SafeEventCollaborationPort::submit call
  -> phase-2 UoW: save local attempt disposition + complete stored continuation result
  -> commit/resolve commit
```

`Prepared`, `SubmissionOutcomeUnknown`, `LocallyFailed`, `RouteBlocked` and `Degraded` are local
attempt states. None means delivered, observed, accepted by a downstream owner, routed, retried or
placed in a DLQ. An existing attempt for the same `(material_id, event_id, target_class)` is always
reused; a persisted `Prepared` marker is not a license for a second worker to call the Port.
`SubmissionOutcomeUnknown` is an integrity/manual-owner branch and remains incomplete.

## 2. Shared continuation helpers

```rust
/// Maps one committed material to its only legal semantic Event envelope.
fn map_tool_semantic_event_from_material(
    material: &SafeHandoffMaterial,
) -> Result<ToolSemanticEventEnvelope, ApplicationError>;

/// Validates material, event identity and target symmetry before an attempt is created.
fn validate_event_material_symmetry(
    material: &SafeHandoffMaterial,
    event: &ToolSemanticEventEnvelope,
    input: &SafeMaterialContinuationInput,
) -> Result<(), ApplicationError>;

/// Returns a deterministic key for the one semantic material continuation.
fn continuation_idempotency_scope(
    input: &SafeMaterialContinuationInput,
) -> IdempotencyScope;

/// Maps a local collaboration response to one immutable attempt state.
fn map_local_submission_result(
    material: &SafeHandoffMaterial,
    event: &ToolSemanticEventEnvelope,
    response: Result<PortResolution<SafeEventSubmissionLocalResponse>, PortCallError>,
    attempted_at: AttemptTime,
) -> Result<ExternalSubmissionAttempt, ApplicationError>;

/// Constructs the entry-safe view from committed attempt and attributable gap refs.
fn map_attempt_view(
    material: &SafeHandoffMaterial,
    event: &ToolSemanticEventEnvelope,
    attempt: &ExternalSubmissionAttempt,
    gap_refs: ConsistencyGapRefSet,
    correlation_ref: CorrelationRef,
) -> Result<ExternalSubmissionAttemptView, ApplicationError>;
```

`map_tool_semantic_event_from_material` is a closed match over `SafeMaterialClass`: `ContractChange`
maps to `ToolContractChanged`, `BindingChange` to `CapabilityBindingChanged`, `OutcomeAudit` to
`ToolOutcomeAuditMaterialAvailable`, and `ConsistencyGap` to `ToolConsistencyGapChanged`. It reads
only the material's safe summary and typed `source_truth_refs`; it never queries current truth or
interprets an external response. A source/material mismatch, non-canonical ref set or event-ID
collision is `ApplicationError::IntegrityFailure` and creates no attempt.

The continuation service uses `ExternalSubmissionStore::find_attempt_for_event` before creating an
attempt. `ExistingEqual`, terminal local states and `SubmissionOutcomeUnknown` are returned as
stored views without a Port call. A `Prepared` record is returned as `Awaiting`/manual recovery;
the application does not infer that the call was not started merely from worker re-entry. Only an
explicit recovery owner may inspect the marker and decide the next action, outside this flow.

## 3. `OF-01 ToolContractChanged`

### 3.1 Entry, target and source closure

| Item | Exact contract |
|---|---|
| Entry | `SafeMaterialContinuationUseCases::continue_material(SafeMaterialContinuationInput, ...)` |
| Input class | `SafeMaterialClass::ContractChange` and `ExternalCollaborationClass` target |
| Source | committed `ToolContractEvolutionFact` referenced by material; source refs must match the evolution fact |
| Event | `ToolEventEnvelope<ToolContractChangedPayload>` with event name `ToolContractChanged`, schema `1` |
| Result | `ExternalSubmissionAttemptView`; local attempt only |
| Owner | application safe-material continuation service; `ExternalSubmissionStore` and collaboration Port are injected |

### 3.2 ASCII call graph

```text
[worker::continue_material]
  | call SafeMaterialContinuationUseCases::continue_material
  v
[ExternalSubmissionStore::get_material]
  | validate ContractChange + correlation/target
  v
[map_tool_semantic_event_from_material]
  | pure map + ToolEventId digest
  v
[phase-1 ToolsUnitOfWork]
  | create_attempt(Prepared) + IdempotencyStore::reserve/complete marker
  | commit
  v
[SafeEventCollaborationPort::submit]
  | one post-commit call
  v
[phase-2 ToolsUnitOfWork]
  | save_attempt(SubmittedLocally/Degraded/LocallyFailed/RouteBlocked)
  | store result + commit
  v
[ExternalSubmissionAttemptView]
```

### 3.3 Typed pseudocode

```rust
input.validate()?;
let scope = continuation_idempotency_scope(&input);
let digest = canonical_continuation_digest(&input)?;
match idempotency_store.get(&scope, &input.continuation_key.into()).await? {
    Some(record) if record.value.matches_digest(&digest) && record.value.is_committed() => {
        return replay_continuation_view(record.value, &input).await;
    }
    Some(record) if !record.value.matches_digest(&digest) => {
        return Err(ProtocolError::conflict(input.correlation_ref));
    }
    Some(record) => return Err(ProtocolError::retry_same_input(input.correlation_ref)),
    None => {}
}
let material = require_some(submission_store.get_material(&input.material_ref.id()).await?)?;
validate_event_material_symmetry(&material.value, &map_class(&input)?, &input)?;
let event = map_tool_semantic_event_from_material(&material.value)?;
let existing = submission_store.find_attempt_for_event(
    &material.value.material_id, event.event_id(), material.value.target_class,
).await?;
if let Some(attempt) = existing {
    return map_attempt_view(&material.value, &event, &attempt.value,
        load_attempt_gaps(&attempt.value).await?, input.correlation_ref);
}
let phase1 = uow_manager.begin().await?;
let claim = reserve_continuation_claim(&phase1, &scope, &digest, &input).await?;
let prepared = ExternalSubmissionAttempt::prepare(
    ids.new_submission_attempt_id()?, &material.value, &event,
    material.value.target_class, clock.now()?.as_attempt_time(),
)?;
let attempt = require_created(submission_store.create_attempt(prepared, &*phase1).await?)?;
store_prepared_continuation_marker(&phase1, claim, &attempt)?;
commit_confirmed(phase1).await?;
let response = collaboration.submit(&SafeEventSubmissionRequest {
    material_ref: input.material_ref.clone(), target_class: material.value.target_class, event: event.clone(),
}).await;
let terminal = map_local_submission_result(
    &material.value, &event, response, clock.now()?.as_attempt_time(),
)?;
let phase2 = uow_manager.begin().await?;
let loaded = require_same_attempt(submission_store.get_attempt(&attempt.value.attempt_id).await?, &attempt)?;
let saved = submission_store.save_attempt(
    terminal.clone(), loaded.expected_version, &*phase2,
).await?;
let gaps = gaps_for_attempt_state(&terminal)?;
let gap_refs = append_gaps(projection_store, gaps, &*phase2).await?;
complete_continuation_result(&phase2, claim, map_attempt_view(
    &material.value, &event, &saved.value, gap_refs, input.correlation_ref,
)?).await?;
commit_confirmed(phase2).await?;
if terminal.state == ExternalSubmissionAttemptState::SubmissionOutcomeUnknown {
    return Err(ProtocolError::side_effect_unknown(input.correlation_ref));
}
Ok(map_attempt_view(&material.value, &event, &saved.value, gap_refs, input.correlation_ref)?)
```

The actual `map_class(&input)` call is a pure closed conversion from `input.material_class`; it
cannot be supplied by the worker. `ToolContractChangedPayload` is constructed only from the
evolution fact summary carried by the material. The flow does not append another evolution fact,
change a contract revision or perform a second event mapping after the Port call.

### 3.4 Transaction, errors, effects and tests

| Concern | Exact behavior |
|---|---|
| Phase 1 | Material lookup and pure mapping precede UoW; Prepared attempt and claim commit before Port. Rollback removes both on known failure. |
| Port | One `SafeEventCollaborationPort::submit` call after phase-1 commit; no UoW is passed and no hidden retry occurs. |
| Phase 2 | Saves one local attempt disposition, gap refs and stored view in one UoW; commit unknown is resolved by the same authority. |
| Errors | Missing material, class/source mismatch or unsupported schema -> integrity/blocked with zero attempt. Route blocked/local reject -> local attempt plus typed gap/error. Ambiguous call -> `SubmissionOutcomeUnknown`, manual owner, no replay completion. |
| State/effects | Material immutable; attempt `Prepared -> one local terminal state`; contract truth and evolution history unchanged. |
| Test cuts | valid establish/adopt/retire source; source-ref mismatch; target/sensitivity mismatch; duplicate existing terminal/prepared; Port blocked/rejected/accepted/degraded/unknown; crash at each commit boundary; assert exactly one Port call and no physical-delivery claim. |

Stop review: `OF-01` pass.

## 4. `OF-02 CapabilityBindingChanged`

### 4.1 Entry, target and source closure

| Item | Exact contract |
|---|---|
| Input class | `SafeMaterialClass::BindingChange` |
| Source | committed `CapabilityBindingChangeFact` or binding-scoped `ConsistencyGap` selected by the material source variant |
| Event | `ToolEventEnvelope<CapabilityBindingChangedPayload>`; exclusive `FormalChange` or `ConsistencyGap` subject |
| Result | `ExternalSubmissionAttemptView` |
| Forbidden | no Binding mutation, Hub registry read, invocation-anchor rewrite or external lifecycle claim |

### 4.2 ASCII call graph

```text
[continuation entry]
  | get_material + validate BindingChange source
  v
[map CapabilityBindingChangedPayload]
  | pure branch: FormalChange xor ConsistencyGap
  v
[phase-1 UoW: Prepared attempt + claim] -> commit
  v
[SafeEventCollaborationPort::submit] -> one call
  v
[phase-2 UoW: save attempt + gap refs + replay] -> commit
  v
[attempt view]
```

### 4.3 Typed pseudocode

```rust
input.validate_class(SafeMaterialClass::BindingChange)?;
let material = require_material_for_continuation(&input, submission_store).await?;
let event = map_tool_semantic_event_from_material(&material.value)?;
ensure_binding_event_subject_exclusive(&event)?;
let attempt_or_new = prepare_or_replay_attempt(
    &input, &material.value, &event, &scope, &digest,
).await?;
let prepared = require_prepared_or_existing(attempt_or_new)?;
if prepared.is_existing_terminal_or_unknown() {
    return map_attempt_view_with_gaps(&material.value, &event, prepared).await;
}
commit_prepared_attempt(prepared).await?;
let response = collaboration.submit(&SafeEventSubmissionRequest {
    material_ref: input.material_ref.clone(), target_class: material.value.target_class, event: event.clone(),
}).await;
save_post_call_attempt_and_replay(response, material, event, input, claim).await
```

`FormalChange` must preserve `successor_binding_id` only for `Replaced`; the gap branch is a gap
notification and cannot be interpreted as a relation change. A binding-scoped gap may be sent even
when no valid Hub snapshot exists, because its source is committed local gap truth.

### 4.4 Transaction, errors, effects and tests

| Concern | Exact behavior |
|---|---|
| Deterministic negative | Wrong material class, mixed subject branch, missing binding subject or mismatched source refs fails before attempt creation. |
| External result | `SubmittedLocally`/`Degraded` records only local Port response; Bus/Observation status is separate. |
| Reentry | Same material/event/target returns stored attempt; no duplicate Port call, including a Prepared marker. |
| Side effects | One Prepared attempt, one optional local terminal save, typed gap append and idempotency replay only. |
| Tests | Declaration/replacement/invalidation fact variants; binding gap variant; successor symmetry; missing Hub authority; local rejection/route block/unknown; duplicate/conflict and commit recovery. |

Stop review: `OF-02` pass.

## 5. `OF-03 ToolOutcomeAuditMaterialAvailable`

### 5.1 Entry, target and source closure

| Item | Exact contract |
|---|---|
| Input class | `SafeMaterialClass::OutcomeAudit` |
| Source | one committed `OutcomeAuditPair` with exact `outcome_id`/`audit_entry_id` refs |
| Event | `ToolEventEnvelope<ToolOutcomeAuditMaterialAvailablePayload>` |
| Result | local attempt view; never an outcome or audit mutation |
| Consumers | Bus/logical Observability collaborators through the same collaboration Port; no route claim |

### 5.2 ASCII call graph

```text
[continuation entry]
  | get_material -> verify OutcomeAudit source refs
  v
[pure outcome/audit payload mapper]
  v
[phase-1 Prepared attempt + claim] -> commit
  v
[SafeEventCollaborationPort::submit] -> one call
  v
[phase-2 save attempt/gaps/replay] -> commit
  v
[attempt view]
```

### 5.3 Typed pseudocode

```rust
let material = require_material_for_continuation(&input, submission_store).await?;
ensure_class_and_target(&material.value, SafeMaterialClass::OutcomeAudit, &input)?;
let event = map_tool_semantic_event_from_material(&material.value)?;
let payload = match &event {
    ToolSemanticEventEnvelope::ToolOutcomeAuditMaterialAvailable(envelope) => &envelope.payload,
    _ => return Err(ApplicationError::IntegrityFailure),
};
ensure_outcome_audit_refs_match_material(payload, &material.value)?;
let attempt = prepare_or_replay_attempt(&input, &material.value, &event, &scope, &digest).await?;
if attempt.is_terminal_or_unknown() { return map_attempt_view_with_gaps(...).await; }
commit_prepared_attempt(attempt.clone()).await?;
let response = collaboration.submit(&SafeEventSubmissionRequest {
    material_ref: input.material_ref.clone(), target_class: material.value.target_class, event,
}).await;
save_post_call_attempt_and_replay(response, material, event, input, attempt.claim()).await
```

The payload carries only outcome class, contract anchor and typed refs. It cannot contain a result
body, error body, audit body, observation status or Bus delivery status. The event's `occurred_at`
is the committed source fact time, not Port call time.

### 5.4 Transaction, errors, effects and tests

| Concern | Exact behavior |
|---|---|
| Source integrity | Missing pair, half pair or ref mismatch -> integrity failure; no attempt. |
| Local failure | Port rejection/blocked response creates local attempt state and gap; outcome/audit remains readable. |
| Ambiguity | `SubmissionOutcomeUnknown` blocks automatic replay/resubmission and leaves claim incomplete. |
| Tests | success/tool-failure/no-execution outcome classes; body-free payload; pair mismatch/half pair; duplicate terminal attempt; route blocked, degraded and unknown responses; one-call assertion. |

Stop review: `OF-03` pass.

## 6. `OF-04 ToolConsistencyGapChanged`

### 6.1 Entry, target and source closure

| Item | Exact contract |
|---|---|
| Input class | `SafeMaterialClass::ConsistencyGap` |
| Source | committed `ConsistencyGap` lifecycle snapshot and exact transition refs |
| Event | `ToolEventEnvelope<ToolConsistencyGapChangedPayload>` |
| Result | local attempt view; event does not resolve or repair the gap |
| Allowed transition basis | create Open, Open -> ResolutionPending, ResolutionPending -> Resolved, Open/ResolutionPending -> Superseded |

### 6.2 ASCII call graph

```text
[continuation entry]
  | get_material -> validate gap source/state symmetry
  v
[pure gap event mapper]
  v
[phase-1 Prepared attempt + claim] -> commit
  v
[SafeEventCollaborationPort::submit] -> one call
  v
[phase-2 save attempt/gaps/replay] -> commit
  v
[attempt view]
```

### 6.3 Typed pseudocode

```rust
let material = require_material_for_continuation(&input, submission_store).await?;
ensure_class_and_target(&material.value, SafeMaterialClass::ConsistencyGap, &input)?;
let event = map_tool_semantic_event_from_material(&material.value)?;
let payload = match &event {
    ToolSemanticEventEnvelope::ToolConsistencyGapChanged(envelope) => &envelope.payload,
    _ => return Err(ApplicationError::IntegrityFailure),
};
ensure_gap_transition_symmetric(payload, &material.value)?;
let attempt = prepare_or_replay_attempt(&input, &material.value, &event, &scope, &digest).await?;
if attempt.is_terminal_or_unknown() { return map_attempt_view_with_gaps(...).await; }
commit_prepared_attempt(attempt.clone()).await?;
let response = collaboration.submit(&SafeEventSubmissionRequest {
    material_ref: input.material_ref.clone(), target_class: material.value.target_class, event,
}).await;
save_post_call_attempt_and_replay(response, material, event, input, attempt.claim()).await
```

The event is a notification of the exact local gap state, not proof of resolution. A resolution
evidence field is only a typed locator summary permitted by the gap state; no evidence body, alias,
run ID, test result or signature is accepted. `OF-04` never calls `RecordConsistencyGapResolution`
and never changes the source gap in phase 2.

### 6.4 Transaction, errors, effects and tests

| Concern | Exact behavior |
|---|---|
| Source integrity | Illegal transition, missing previous state or subject-ref mismatch fails before attempt creation. |
| Local failure | Route blocked, local rejection or degraded response is recorded as attempt/gap only; source gap remains unchanged. |
| Reentry | Existing Prepared/terminal/unknown attempt is returned without a second Port call. |
| Tests | each allowed gap transition; illegal transition; evidence-body rejection; source/material mismatch; duplicate and commit-unknown; one-call and no-repair assertions. |

Stop review: `OF-04` pass.

## 7. Outbound Event family stop review

| Review item | Result | Closure |
|---|---|---|
| Four independent Event flows map 1:1 to Step 8 variants | pass | `OF-01~04` sections 3~6 |
| Material/source/event identity is deterministic and body-free | pass | pure mapper + canonical `ToolEventId` |
| Prepared marker precedes side-effecting Port call | pass | phase-1 commit before `submit` |
| At-most-one automatic external call | pass | unique `(material,event,target)` attempt key |
| Submission ambiguity is fail-closed | pass | `SubmissionOutcomeUnknown` manual branch |
| Local attempt is not delivery/observation truth | pass | separate feedback refs and gaps |
| No route/retry/DLQ/readiness claim | pass | blockers `L2T-UP-004~007` retained |
| DTO/object/Port/UoW/error/state/test closure | pass | all four flow cards complete |

Batch 4 gate: **pass**. Job batch `JF-01~04` and R-9 cross-flow audit have subsequently passed;
this former “next Job batch” line is superseded workflow history. Formal `03-详细设计.md` remains
write-closed until Step 19.
