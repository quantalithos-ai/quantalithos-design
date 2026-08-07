# Step 10.4 状态族附录: 执行前置与条件交接

> 状态: completed / pass
> Canonical inputs: Step 6 precondition/handoff annex; Step 9 CF-09/10, IF-02, QF-05

## 1. Requirement classification

`ExecutionRequirement` is a derived classification, not an authorization state:

| Variant | Meaning | Allowed continuation |
|---|---|---|
| `NoExternalGovernance` | definition declares no authorization result required | evaluate applicable carrier/Sandbox rule |
| `AuthorizationRequired` | invocation-bound authorization result required | consume Authorization Port result |
| `SandboxRequired` | formal Sandbox seam required | consume readiness and call only Sandbox port |
| `AuthorizationAndSandboxRequired` | both are required | both accepted/constrained and available |
| `Unsupported` | current contract cannot express required combination | no-execution unavailable |

`derive(...)` is pure and has no transition or external side effect.

## 2. `AuthorizationConsumptionState`

| State | Meaning | Handoff effect |
|---|---|---|
| `AcceptedAllow` | formal result matches invocation/authority/revision and allows | may continue |
| `AcceptedConstrained` | allows with typed constraints | may continue only if handoff proves constraints |
| `AcceptedDeny` | formal result denies | no execution; creates rejected outcome |
| `Missing` | result absent | fail closed |
| `Stale` | result not valid at consumption time | fail closed |
| `Conflicting` | authority/subject/revision conflict | fail closed |
| `Unverifiable` | owner/schema cannot be proven | fail closed; current blockers |

| From | To | Trigger | Preconditions | Side effect | Illegal handling |
|---|---|---|---|---|---|
| none | any state | `consume(...)` or `fail_closed(...)` / CF-09, IF-02 | invocation-bound request; result fields body-free; exact authority/subject/revision check | append immutable assessment; conservative states append gap | malformed result -> `InvalidAssessmentInput`; no local allowlist |

No assessment state mutates in place. `AcceptedDeny` is not the same as `AdmissionState::Rejected`.

## 3. `SandboxMappingState`

| Variant | Meaning | Current status |
|---|---|---|
| `Available` | formal seam reports compatible carrier/mapping | conditional on `L2T-UP-003~004` |
| `Unavailable` | required carrier unavailable | blocked |
| `MappingBlocked` | L2-to-Sandbox mapping not closed | current conservative branch |
| `Conflicting` | authority/carrier/subject conflict | blocked |
| `Unverifiable` | formal Sandbox authority cannot be proven | blocked |

Snapshot is immutable and never owns environment/run lifecycle.

## 4. `HandoffState`

```text
[ExecutionHandoff]
  Preparing -> Eligible
  Preparing -> Blocked
  Preparing -> Invalidated
```

| 状态 | 作用 | 终态 | 允许操作 |
|---|---|---:|---|
| `Preparing` | 正在组合 requirement/authorization/readiness checks。 | 否 | `evaluate_eligibility`, `mark_blocked` |
| `Eligible` | L2 允许创建一次 local handoff attempt。 | 是（该 handoff 事实） | create attempt only |
| `Blocked` | required precondition/mapping/carrier failed. | 是 | read/gap/no-execution |
| `Invalidated` | anchor/snapshot changed before call. | 是 | new handoff context |

| From | To | Trigger / flow | Preconditions | Side effects | Illegal error |
|---|---|---|---|---|---|
| factory | `Preparing` | `ExecutionHandoff::prepare(...)` / CF-10 | invocation/admission/requirement refs match; body-free summary | local object only | `InvalidInput` |
| `Preparing` | `Eligible` | `evaluate_eligibility(...)` / CF-10 | all applicable auth/readiness states accepted; constraints represented; correlation exact | save eligible handoff; create prepared attempt in next phase | `InvalidStateTransition` / `PreconditionBlocked` |
| `Preparing` | `Blocked` | `mark_blocked(reason)` / CF-10 | typed gap/blocker present | save handoff + gap; no external call; no-execution result when flow contract requires | `InvalidStateTransition` |
| `Preparing` | `Invalidated` | `invalidate(reason)` / CF-10 | anchor/revision/snapshot mismatch before call | save invalidated handoff + gap | `InvalidStateTransition` |

## 5. `HandoffAttemptState`

```text
[ExecutionHandoffAttempt]
  Prepared -> AttemptedLocally
  Prepared -> LocallyFailed
  Prepared -> CarrierUnavailable
  Prepared -> MappingBlocked
  Prepared -> CallOutcomeUnknown
```

| 状态 | 作用 | 终态 | 允许操作 |
|---|---|---:|---|
| `Prepared` | local attempt marker committed; Port not yet called by this flow. | 否 | one named post-commit call / manual recovery |
| `AttemptedLocally` | valid local safe response stored; no external lifecycle claim. | 是 | read |
| `LocallyFailed` | adapter failed before known external side effect. | 是 | read/manual policy |
| `CarrierUnavailable` | required carrier unavailable before call. | 是 | read/gap |
| `MappingBlocked` | mapping contract blocked before call. | 是 | read/gap |
| `CallOutcomeUnknown` | side-effect may have crossed adapter boundary; disposition unknown. | 是 (manual) | resolve by formal owner; no blind retry |

| From | To | Trigger / flow | Preconditions | Side effects | Illegal error |
|---|---|---|---|---|---|
| factory | `Prepared` | `ExecutionHandoffAttempt::prepared(...)` / CF-10 | handoff `Eligible`; claim and attempt key unique | phase-1 UoW saves marker + idempotency claim before Port | `UniquenessConflict` |
| `Prepared` | `AttemptedLocally` | `record_local_submission(...)` / CF-10 | Port returned valid safe response; same attempt version | phase-2 UoW saves local response + stored result | `InvalidStateTransition` / `VersionConflict` |
| `Prepared` | `LocallyFailed` | `record_local_failure(...)` / CF-10 | adapter proves call did not cross side-effect boundary | phase-2 save failure + replay disposition | `InvalidStateTransition` |
| `Prepared` | `CarrierUnavailable` | `record_carrier_unavailable(...)` / CF-10 | typed availability failure before call | phase-2 save gap/result | `InvalidStateTransition` |
| `Prepared` | `MappingBlocked` | `record_mapping_blocked(...)` / CF-10 | typed Sandbox mapping blocker | phase-2 save gap/result | `InvalidStateTransition` |
| `Prepared` | `CallOutcomeUnknown` | `record_outcome_unknown(...)` / CF-10 | `PortCallError::SideEffectOutcomeUnknown` | phase-2 save uncertainty + open gap; claim remains incomplete/manual | `InvalidStateTransition` |

`Prepared` is never evidence that a call did not happen; re-entry returns awaiting/manual recovery.

## 6. Stop review and tests

| 审查项 | 结论 |
|---|---|
| requirement classification is not authorization | pass |
| positive auth/Sandbox states remain blocked-aware | pass |
| handoff eligible is not external accepted | pass |
| attempt has one post-prepare terminal and unknown fence | pass |
| tests | every requirement variant; auth allow/deny/missing/stale/conflict; readiness blockers; eligible/blocked/invalidated; one call; prepared crash; local failure vs unknown; version conflict; no host fallback |

```text
state_family = precondition_handoff
stop_review = pass
```
