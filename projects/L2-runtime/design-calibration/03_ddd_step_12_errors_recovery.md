# L2-runtime 03 Step 12: 逐层、逐 Flow 错误与恢复契约

> 创建日期: 2026-08-09
> 状态: done
> 原则: known failure, conflict, pending, blocked and unknown are distinct; retry is allowed only before side effect or after explicit recovery proof

## 1. Layer error types

```rust
pub enum DomainError {
    InvalidInvariant,
    ScopeViolation,
    CorrelationMismatch,
    IllegalStateTransition,
    VersionMismatch,
    DependencyUnresolved,
    SourceNotEligible,
    BudgetExceeded,
    ForbiddenBody,
    UnknownEffectFence,
    TerminalEligibilityFailed,
}

pub enum RepositoryError {
    NotFound,
    NotVisible,
    VersionConflict,
    CursorInvalid,
    OrderingConflict,
    CorruptRecord,
    Unavailable,
    Unknown,
}

pub enum CommitError {
    Conflict,
    KnownFailure,
    Unknown { fence_ref: FenceRef },
}

pub enum ExternalBoundaryError {
    PendingContract { blocker_ref: BlockerRef },
    Unconfigured,
    Unavailable { reason: SafeReason },
    Rejected { reason: SafeReason },
    SchemaMismatch,
    ScopeMismatch,
    TimeoutBeforeAcceptance,
    UnknownAfterSubmission { fence_ref: FenceRef },
}

pub enum PublicErrorCode {
    InvalidRequest,
    NotVisible,
    NotFound,
    Conflict,
    Waiting,
    Blocked,
    Unavailable,
    Degraded,
    Unknown,
    InternalFailure,
}
```

Public errors expose code, safe reason, correlation and optional retry posture; they never expose secret/body/hidden rationale, store product, endpoint or raw dependency error.

## 2. Recovery action vocabulary

| Recovery action | Preconditions | Forbidden use |
|---|---|---|
| `ReturnReplay` | same operation/key/digest and committed stored result | different digest or unknown commit |
| `RetryLocalBeforeEffect` | version conflict/transient local read; no external call made; bounded attempt | after possible external submission |
| `WaitForFact` | named source/contract/input may arrive and no unknown effect | hiding conflict/unknown as waiting |
| `BlockFailClosed` | policy/contract/authority missing or unknown | converting to degraded positive operation |
| `QuarantineEvent` | source event valid enough to record but late/order/mismatch prevents mutation | dropping event silently |
| `ReconcileStatusOnly` | stable submission/checkpoint/attempt identity exists | issuing a second side effect |
| `ManualReview` | unknown effect/commit/ack cannot be safely resolved | declaring failure/success |
| `RebuildProjection` | committed history is source and gap/cursor known | repairing domain truth |

## 3. Command error/recovery matrix

| Command | Validation/domain errors | Repository/UoW errors | External errors | Public posture | Recovery |
|---|---|---|---|---|---|
| Accept | invalid metadata/scope/source/precondition | reservation/version/commit | source/governance pending/unknown | invalid/rejected/waiting/blocked/unknown | replay; retry before run creation; unknown manual |
| Control | illegal transition/checkpoint/effect fence | run version/commit | none | conflict/blocked/unknown | reload before mutation; recovery decision |
| Progress | dependency/terminal eligibility/source | run/workspace conflict/commit | definition/source pending | waiting/blocked/conflict/unknown | new verified fact; no in-place rewrite |
| Compose | budget/body/source/mandatory segment | window/context conflict/commit | memory/source pending/stale | blocked/degraded/unknown | recomposition with new decision; no durable write |
| Record memory | scope/duplicate/frozen window | window conflict/commit | source pending | waiting/conflict/unknown | replay or reload before write |
| Model start | context/selection invalid | turn commit conflict/unknown | adapter pending/reject/unknown after submit | blocked/unavailable/unknown | no call before local commit; status reconcile only |
| Model classify | result mismatch/body/schema/late | turn/decision conflict/commit | result unavailable/pending | rejected/blocked/unknown | quarantine late; reconcile result by same submission |
| Propose action | model/candidate/scope/budget | action commit | none | invalid/blocked/unknown | new decision/supersede; no submit |
| Evaluate guard | input authority/stale/unknown | action/guard conflict/commit | Governance/Hub/Tools/Sandbox pending | denied/waiting/blocked/unknown | reevaluate with new source versions |
| Propose delegation | scope/context/budget | delegation commit | child seam not called | blocked/conflict/unknown | new delegation candidate only |
| Incorporate feedback | source/correlation/order/mismatch | inbox/marker/progress conflict/commit | source contract pending | duplicate/late/out-of-order/blocked/unknown | quarantine; status reconcile; no reverse write |
| Prepare checkpoint | stable/version/fence invalid | checkpoint local commit | none | blocked/invalid/unknown | new candidate after verified state |
| Commit checkpoint | digest/receipt mismatch | checkpoint conflict/commit | CP pending/rejected/unknown | blocked/conflict/unknown | reconcile same request; no resume |
| Recovery | no stable point/fence/source | decision append/commit | status source pending | waiting/blocked/manual/unknown | new immutable decision |
| Finalize outcome | nonterminal/fence/result invalid | outcome/run conflict/commit | none | blocked/conflict/unknown | recovery/new terminal decision |
| Handoff candidate | body/redaction/eligibility | attempt/gap commit | route/producer pending | blocked/gap/unknown | reconcile same attempt; outcome unchanged |
| Capture source | authority/body/freshness | marker conflict/commit | source pending/stale/unknown | pending/stale/blocked/unknown | refresh same source/version |

## 4. Query error mapping

| Query class | Not visible/not found | Stale/degraded | Store unknown | Recovery boundary |
|---|---|---|---|---|
| run/workspace/context/memory/model/action/delegation/checkpoint/outcome/handoff | apply visibility before exposing existence; public mapping configured leak-safe | return typed view/page marker when safe | `Unknown`/`Unavailable`, never cached current claim | client may retry read; query never mutates/refreshes |
| projection | visibility still applies | state is result (`Stale/Rebuilding/Degraded`) | `Unknown` | operations job may rebuild; query cannot |
| cursor page | invalid cursor is protocol error | watermark/freshness exposed | preserve cursor | restart from explicit initial cursor only, not silent |

## 5. Event consumer error/recovery matrix

| Failure | Inbox receipt | Local truth mutation | Source ack | Recovery |
|---|---|---|---|---|
| invalid schema/forbidden body | Rejected | rejection/quarantine record if safe | dead-letter candidate per adapter | contract/schema fix |
| source/target mismatch | Rejected/Blocked | no target mutation; safe rejection record | known rejection ack if durable | owner correction/manual |
| duplicate same digest | Duplicate | none | ack durable existing receipt | no retry |
| same event ID different digest | Blocked | conflict/quarantine | no positive ack | manual/security review |
| late/out-of-order | Late/OutOfOrder | quarantine record only | ack after record | wait missing predecessor/new decision |
| local version conflict before commit | none/temporary | none | no ack | bounded local retry after reload |
| local commit known failure | none | rollback | no ack | broker retry bounded |
| local commit unknown | Unknown | cannot determine | no ack | inbox/local reconciliation; avoid duplicate effect |
| external status unknown | Accepted/Unknown depending local record | unknown marker/recovery fact | ack only after durable fact | status-only reconcile |

## 6. Job error/recovery matrix

| Job | Lease/cursor conflict | Item failure | Page commit unknown | Safe resume |
|---|---|---|---|---|
| projection rebuild | stop/no write | gap -> degraded | preserve prior cursor | same rebuild ID/from prior committed cursor |
| source refresh | stop page | record pending/stale/error ref | preserve cursor | next page/retry source without readiness claim |
| memory compact | stop | block item/old window authoritative | no new window claim | reload expected window/new decision |
| resume runs | stop | manual/blocked item isolated | no applied claim | read committed recovery decision |
| effect reconcile | stop | absent status keeps unknown | preserve fence/cursor | same marker/status-only |
| handoff reconcile | stop | no ack keeps gap open | no gap close claim | same attempt/gap/version |
| outbox publish | stop | known reject or unknown retained | entry pending/unknown | same event ID/payload digest |

## 7. State-specific recovery

| State | May retry | Must create new decision/object | Manual/reconcile required |
|---|---|---|---|
| run Waiting/Blocked | after new verified input | new progress/recovery decision | Unknown run requires manual |
| context Expired/Degraded | no in-place positive mutation | new composition/context | source unknown may wait |
| model Unknown | no resubmit | new recovery/model turn only after proof | same submission status reconcile |
| action/marker Unknown | no action retry | recovery/reflection decision | effect status reconcile/manual |
| checkpoint CommitUnknown | no new commit request key | recovery/reconciliation record | physical status reconcile/manual |
| outcome Unknown | no promotion | new recovery/terminal decision under policy | manual if fence unresolved |
| handoff Unknown/gap Open | same attempt status query only | reconciliation record | no self-close |
| projection Unknown | rebuild from committed cursor | new rebuild record | no domain repair |

## 8. Step gate

| Check | Result |
|---|---|
| Every Command has differentiated error and recovery mapping | pass |
| Query/Event/Job failures have independent contracts | pass |
| retry eligibility excludes possible external side effects | pass |
| unknown creates fence/reconcile/manual posture | pass |
| public errors remain body-free | pass |

```text
step_12 = done
next_allowed_action = step_13_concurrency_idempotency_reentry
```
