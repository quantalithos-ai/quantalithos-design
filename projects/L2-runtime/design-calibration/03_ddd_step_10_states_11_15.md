# L2-runtime Step 10 state machines: SM-11~15

> 状态: done
> 范围: checkpoint, recovery, local outcome, handoff attempt/gap, source availability

## SM-11 Runtime Checkpoint

Variants: `Preparing`, `Prepared`, `CommitPending`, `Committed`, `Invalid`, `CommitUnknown`, `Superseded`.

```text
[Preparing] -> [Prepared] -> [CommitPending] -> [Committed]
     |             |              +---------> [CommitUnknown]
     +----------> [Invalid]
[Committed] --------------------------------> [Superseded]
```

| From | Trigger | Guard/proof | To | Side effect |
|---|---|---|---|---|
| create | `RuntimeCheckpoint::prepare` | stable candidate versions/history/fence | Preparing | checkpoint object |
| Preparing | `mark_prepared` | validation complete; local save known | Prepared | history/version++ |
| Preparing/Prepared | `invalidate` | digest/source/version/fence invalid | Invalid | reason/version++ |
| Prepared | `mark_commit_pending` | request digest/idempotency fixed | CommitPending | commit request/version++ |
| CommitPending | `mark_committed` | matching receipt ID/digest/nonempty commit ref | Committed | commit ref/history/outbox/version++ |
| CommitPending | `mark_commit_unknown` | physical result uncertain | CommitUnknown | fence/manual review/version++ |
| Committed | `supersede` | newer committed checkpoint exists | Superseded | replacement/version++ |

Illegal: Preparing/Prepared stable for resume; repository save means Committed; CommitUnknown to Committed without reconciliation receipt; Invalid retried in place; Superseded resume; unknown external effect permits checkpoint. Tests: proof fields, digest mismatch, CP-001 pending, commit unknown, resume eligibility, supersession.

## SM-12 Recovery Decision and Continuation

Recovery decision variants: `Resume`, `RestartFromStable`, `ReconcileOnly`, `WaitForFact`, `Blocked`, `Cancel`, `ManualReview`. Decisions are immutable; continuation state variants: `Waiting`, `Claimed`, `Applied`, `Blocked`, `ManualReview`, `Completed`.

```text
[request] -> [Resume|RestartFromStable] -> continuation:[Waiting]->[Claimed]->[Applied]->[Completed]
    +-----> [ReconcileOnly|WaitForFact|Blocked|Cancel|ManualReview]
```

| Subject/from | Trigger | Guard | To | Side effect |
|---|---|---|---|---|
| request | `RecoveryDecision::decide` | committed checkpoint + closed fence | Resume/RestartFromStable | immutable decision/history |
| request | same | unknown effect/commit | ReconcileOnly/ManualReview | fence/history |
| request | same | missing source may arrive | WaitForFact | source refs/history |
| request | same | formal conflict/pending contract | Blocked | reason/history |
| decision | `RecoveryContinuation::schedule` | disposition requires continuation | Waiting | continuation record |
| Waiting | `claim` | matching live lease | Claimed | lease/attempt |
| Claimed | `apply` | versions/checkpoint/fence still match | Applied | new progress/run transition |
| Applied | `complete` | local commit known | Completed | report/cursor |
| Waiting/Claimed | block/manual | lost guard/unknown fence | Blocked/ManualReview | report/reason |

Illegal: mutate/supersede prior decision in place; process restart means safe retry; unknown marker permits Resume; lease loss continues; continuation performs a different decision; Completed repeats effect. Tests: each decision variant, checkpoint/fence/current version, lease, revalidation, immutable supersession, no blind retry.

## SM-13 Runtime Outcome

`RuntimeOutcome` is created once with terminal `OutcomeDisposition`: `Succeeded`, `Partial`, `Blocked`, `Failed`, `Cancelled`, `Unknown`; candidate phase exists only during validation.

```text
[candidate] -- terminal proof + local commit --> [Succeeded|Partial|Blocked|Failed|Cancelled|Unknown]
```

| From | Trigger | Guard | To | Side effect |
|---|---|---|---|---|
| candidate | `RuntimeOutcome::finalize` | terminal decision + closed fence + policy success | Succeeded | outcome/run/history/outbox |
| candidate | same | terminal with explicit omissions | Partial | omission refs/history |
| candidate | same | terminal blocked posture | Blocked | reason/history |
| candidate | same | known local failure | Failed | reason/history |
| candidate | same | valid local cancel | Cancelled | reason/history |
| candidate | same | terminal truth cannot be determined | Unknown | fence/history |

Illegal: nonterminal progress creates outcome; handoff/ack/observed/acceptance changes disposition; unknown becomes success/failure without new recovery and new outcome policy; second outcome for run; external Method/Work completion directly maps success. Tests: terminal proof each variant, one outcome, fence, local commit first, downstream independence.

## SM-14 Handoff Attempt and Gap

Attempt variants: `Candidate`, `Submitted`, `Acknowledged`, `Rejected`, `Blocked`, `Unknown`. Gap variants: `Open`, `Reconciling`, `Closed`, `Unknown`.

```text
attempt:[Candidate] -> [Submitted] -> [Acknowledged|Rejected|Unknown]
           +-------> [Blocked]
gap:[Open] -> [Reconciling] -> [Closed]
     +----------------------> [Unknown]
```

| Subject/from | Trigger | Guard | To | Side effect |
|---|---|---|---|---|
| attempt create | `create_candidate` | eligible material/digest/target | Candidate | attempt/history/outbox |
| Candidate | `mark_submitted` | stable submission ref | Submitted | version/history |
| Candidate | `block` | route/contract pending | Blocked | gap/history |
| Submitted | `acknowledge` | matching verified ack | Acknowledged | ack ref/history |
| Submitted | `reject` | verified downstream rejection | Rejected | reason/gap |
| Candidate/Submitted | `mark_unknown` | submission/ack uncertain | Unknown | fence/gap |
| gap create | `HandoffGap::open` | known missing/rejected/pending route | Open | gap version |
| Open | `begin_reconciliation` | lease + attempt identity | Reconciling | version++ |
| Reconciling | `close` | matching verified acknowledgement source | Closed | closing source/ack/version++ |
| Open/Reconciling | `mark_unknown` | status cannot be determined | Unknown | fence/version++ |

Illegal: Candidate means delivered; Acknowledged means accepted/observed; gap self-closes; republish alone closes; attempt/gap mutates local outcome; Unknown normal retry; ack mismatch accepted. Tests: material digest, route pending, ack identity, no acceptance, no self-close, unknown, local outcome independence.

## SM-15 Source Availability

Variants: `Available`, `Unavailable`, `PendingContract`, `Stale`, `Unknown`, `Degraded`.

```text
[PendingContract|Unknown|Stale|Unavailable]
       | verified authority/version/freshness
       v
   [Available]
       | expiry/change/failure
       v
   [Stale|Unavailable|Degraded|Unknown]
```

| From | Trigger | Guard | To | Side effect |
|---|---|---|---|---|
| factory/any | `SourceAvailability::record/refresh` | owner/version/freshness verified | Available | marker/version/history |
| factory/any | same | owner contract absent | PendingContract | blocker/version |
| Available | refresh/event/clock | freshness expired | Stale | reason/version/projection stale |
| any | refresh/event | known owner unavailable | Unavailable | reason/version |
| Available/Stale | refresh/event | partial safe source remains | Degraded | reason/version |
| any | refresh/event | authority/completeness cannot determine | Unknown | reason/version |
| Stale/Unavailable/Pending/Unknown | refresh/event | new verified source | Available | checked version/deadline/version++ |

Illegal: design file/fake/ping means Available/readiness; stale meets current requirement; unknown fail-open; local Runtime mutates owner source/version; older event overwrites newer availability. Tests: expiry, version ordering, authority, pending contract, degraded constraint, fake negative, projection stale.

## Batch gate

Checkpoint proof, recovery decision, local outcome, handoff receipt and source availability have independent owners and cannot promote one another across boundaries.
