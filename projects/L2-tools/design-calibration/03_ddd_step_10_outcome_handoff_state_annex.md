# Step 10.5 状态族附录: Outcome、审计与安全交接

> 状态: completed / pass
> Canonical inputs: Step 6 outcome/audit annex; Step 9 CF-11/12, IF-03/04/05, OF-01~04, JF-04

## 1. `ExecutionSourceAssessmentState`

| State | Meaning | Can normalize outcome |
|---|---|---:|
| `Accepted` | source attributable, correlated, versioned and mapped | yes |
| `Rejected` | source attributable but semantically unacceptable | no |
| `Missing` | required source ref absent | no |
| `Conflicting` | authority/invocation/handoff/class/revision conflict | no |
| `MappingBlocked` | source locatable but mapping contract absent | no |
| `Unverifiable` | formal source authority cannot be proven | no |

Each is an immutable assessment snapshot. A later source never flips a prior assessment.

## 2. `ToolOutcomeClass`

```text
[ToolInvocationOutcome]
  (one creation) -> Succeeded | ToolFailed | ExecutionFailed | CaptureFailed
  (one creation) -> NoExecutionRejected | NoExecutionUnavailable
```

| State | Required basis | Terminal |
|---|---|---:|
| `Succeeded` | accepted source + normalized result | yes |
| `ToolFailed` | accepted source + semantic tool error | yes |
| `ExecutionFailed` | accepted source + formal carrier failure | yes |
| `CaptureFailed` | accepted source + formal capture failure | yes |
| `NoExecutionRejected` | admission rejection or authorization deny | yes |
| `NoExecutionUnavailable` | precondition/source/mapping unavailable before execution | yes |

| From | To | Trigger | Preconditions | Side effects | Illegal error |
|---|---|---|---|---|---|
| none | any terminal class | `ToolInvocationOutcome::{succeeded,tool_failed,execution_failed,capture_failed,no_execution_rejected,no_execution_unavailable}` / CF-08/11 | exactly one invocation; result/error symmetry; accepted source for execution classes | same UoW writes outcome + `ToolAuditEntry`; stored result; stale markers where named | `TerminalConflict` / `InvalidOutcomePayload` |
| terminal | none | late source or duplicate attempt | no overwrite allowed | append `ConsistencyGap::TerminalConflict` only | `InvalidStateTransition` |

Outcome and audit are an atomic pair. A duplicate same digest replays the stored typed value; a
different digest or late external material cannot replace the terminal outcome.

## 3. `SafeHandoffEligibilityState`

| State | Meaning | Material allowed |
|---|---|---:|
| `Eligible` | minimal, body-free, redacted, correlated checks all pass for target | yes |
| `Ineligible` | one or more checks fail with attributable local reason | no |
| `Unverifiable` | source/target/authority cannot be proven | no |

| From | To | Trigger / flow | Preconditions | Side effects | Illegal error |
|---|---|---|---|---|---|
| none | one snapshot | `SafeHandoffEligibility::evaluate(...)` / CF-12 | exact source set; target-specific four checks; no forbidden body | append eligibility; ineligible/unverifiable may append gap | `InvalidEligibilityInput` |

No eligibility state is mutated; new source/target evaluation creates a new eligibility fact.

## 4. `ExternalSubmissionAttemptState`

```text
[ExternalSubmissionAttempt]
  Prepared -> SubmittedLocally
  Prepared -> LocallyFailed
  Prepared -> RouteBlocked
  Prepared -> Degraded
  Prepared -> SubmissionOutcomeUnknown
```

| State | Meaning | External claim |
|---|---|---|
| `Prepared` | event identity/material committed; collaboration Port not yet called by this flow | none |
| `SubmittedLocally` | local Port returned valid safe response | no delivered/observed claim |
| `LocallyFailed` | local adapter failure before known external delivery | none |
| `RouteBlocked` | route/source contract not closed | none |
| `Degraded` | local response lacks required locator/revision | none |
| `SubmissionOutcomeUnknown` | call may have crossed adapter boundary without valid disposition | manual only |

| From | To | Trigger / flow | Preconditions | Side effects | Illegal error |
|---|---|---|---|---|---|
| none | `Prepared` | `ExternalSubmissionAttempt::prepare(...)` / OF-01~04 | committed material + canonical event id/name/schema + target | phase-1 claim/attempt commit | `UniquenessConflict` |
| `Prepared` | `SubmittedLocally` | `record_submission(...)` / OF-01~04 | one Port call returned valid local locator/revision | phase-2 save + replay completion | `InvalidStateTransition` |
| `Prepared` | `LocallyFailed` | `record_local_failure(...)` / OF-01~04 | call known not to cross side-effect boundary | phase-2 save error | `InvalidStateTransition` |
| `Prepared` | `RouteBlocked` | `record_route_blocked(...)` / OF-01~04 | typed route/source blocker | phase-2 save gap/error | `InvalidStateTransition` |
| `Prepared` | `Degraded` | `record_degraded(...)` / OF-01~04 | local response valid but target-required locator/revision absent | phase-2 save gap; no positive claim | `InvalidStateTransition` |
| `Prepared` | `SubmissionOutcomeUnknown` | `record_outcome_unknown(...)` / OF-01~04 | `SideEffectOutcomeUnknown` | phase-2 save uncertainty; no replay completion/auto-call | `InvalidStateTransition` |

## 5. External status reference states

### 5.1 `ExternalStatusState` (`BusDeliveryStatusRef`)

| State | Meaning | L2 interpretation |
|---|---|---|
| `Unknown` | no formal feedback | preserve unknown |
| `Referenced` | formal delivery ref/status exists | not local delivery owner |
| `Stale` | feedback may be old | append new ref/gap |
| `Conflicting` | attempt/authority/ref conflict | gap |
| `Unverifiable` | source cannot be attributed | gap/blocked |

### 5.2 `ObservationStatusState` (`ObservationMaterialRef`)

| State | Meaning | L2 interpretation |
|---|---|---|
| `RouteBlocked` | producer/source/route not formally closed | current default under `L2T-UP-005~006` |
| `Unknown` | no verifiable material status | no inference |
| `Referenced` | formal observation material ref exists | not audit replacement |
| `Stale` | material status may be old | gap |
| `Conflicting` | attempt/authority/material conflict | gap |
| `Unverifiable` | source cannot be attributed | gap |

Feedback states are appended by IF-04/05 or JF-04 and never mutate local submission/outcome/audit.

## 6. Stop review and tests

| 审查项 | 结论 |
|---|---|
| source assessment and outcome terminal are separate | pass |
| outcome/result/error symmetry and uniqueness | pass |
| safe four-gate check is target-specific | pass |
| local submission vs external delivery/observation | pass |
| ambiguous call never auto-retries | pass |
| tests | all source assessment variants; six outcome classes; duplicate/late terminal conflict; four eligibility checks; each attempt branch; independent Bus/Obs unknown/stale/conflict/route-blocked; exact replay and commit-unknown |

```text
state_family = outcome_safe_handoff
stop_review = pass
```
