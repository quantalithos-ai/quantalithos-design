# L2-runtime Step 10 state machines: SM-06~10

> 状态: done
> 范围: model turn, action choice, side-effect marker, delegation, feedback ordering/incorporation

## SM-06 Model Turn

Variants: `Pending`, `SubmissionCandidate`, `Submitted`, `Classified`, `Failed`, `Blocked`, `Unknown`.

```text
[Pending] -> [SubmissionCandidate] -> [Submitted] -> [Classified]
    |                 |                    +-----> [Failed]
    +--------------> [Blocked]             +-----> [Unknown]
```

| From | Trigger/function | Guard | To | Side effect |
|---|---|---|---|---|
| create | `ModelTurn::start` | frozen context/digest/intention valid | Pending | local turn |
| Pending | `mark_submission_candidate` | adapter slot candidate and local intent | SubmissionCandidate | history/outbox candidate |
| SubmissionCandidate | `mark_submitted` | stable submission ref | Submitted | second-UoW history |
| Pending/SubmissionCandidate | `block` | adapter pending/unavailable/contract mismatch | Blocked | reason/history |
| Submitted | `classify` | matching semantic result/schema/order | Classified | decision/summary/history |
| Submitted | `fail` | known adapter failure | Failed | recovery candidate |
| SubmissionCandidate/Submitted | `mark_unknown` | call/receipt/commit uncertain | Unknown | fence/manual review |

Illegal: non-frozen context start; Classified to another decision; Blocked/Failed/Unknown to Submitted without new turn; duplicate different result; raw output classification; unknown automatic retry. Tests: context digest, commit-first, result identity, late quarantine, finite mapping, unknown fence, provider field absence.

## SM-07 Action Decision

Variants: `Proposed`, `Guarded`, `SubmissionCandidate`, `Cancelled`, `Superseded`, `Blocked`, `Unknown`.

```text
[Proposed] -> [Guarded] -> [SubmissionCandidate]
    |             |              |
    +---------> [Blocked]         +--> [Unknown]
    +---------> [Cancelled|Superseded]
```

| From | Trigger | Guard | To | Mutation |
|---|---|---|---|---|
| create | `ActionDecision::propose` | model decision permits action; candidate scope valid | Proposed | immutable choice/version |
| Proposed | `attach_precondition` | matching current guard | Guarded | guard ref/version++ |
| Guarded | `prepare_submission` | guard Allowed and versions current | SubmissionCandidate | marker ref/version++ |
| Proposed/Guarded | `block` | denial/pending/unknown contract | Blocked | safe reason/version++ |
| Proposed/Guarded | `cancel` | no submitted effect or local posture permits | Cancelled | reason/version++ |
| Proposed/Guarded | `supersede` | new explicit action decision exists | Superseded | replacement/version++ |
| SubmissionCandidate | `mark_unknown` | attempt state cannot be determined | Unknown | fence/version++ |

Illegal: Proposed directly executed/completed; Guarded with stale decision to submission; external feedback mutates choice; Cancelled after known submitted effect without marker; Unknown to ordinary retry; prior decision update on reflection. Tests cover scope, guard freshness, no execution variant, immutable supersession, cancel/effect separation, unknown.

## SM-08 Side-Effect Marker

Variants: `Candidate`, `AttemptRecorded`, `Submitted`, `Completed`, `Failed`, `CancelledBeforeSubmit`, `Unknown`.

```text
[Candidate] -> [AttemptRecorded] -> [Submitted] -> [Completed|Failed]
     |                 |                |
     +--> [CancelledBeforeSubmit]       +--> [Unknown]
```

| From | Trigger | Guard | To | Mutation |
|---|---|---|---|---|
| create | `SideEffectMarker::create` | action submission candidate, effect class known | Candidate | marker/version |
| Candidate | `record_attempt` | unique attempt ID, allowed guard | AttemptRecorded | attempt count/ref/version++ |
| AttemptRecorded | `mark_submitted` | matching stable submission ref | Submitted | submission/version++ |
| Submitted | `incorporate_feedback` | verified success/cleanup-complete feedback | Completed | feedback/version++ |
| Submitted | same | verified known failure/rejection/cancel | Failed | feedback/reason/version++ |
| Candidate/AttemptRecorded | `cancel_before_submit` | no external submission | CancelledBeforeSubmit | reason/version++ |
| AttemptRecorded/Submitted | `mark_unknown` | receipt/effect cannot be determined | Unknown | fence/version++ |

Illegal: Candidate directly Completed; Submitted cancelled locally without feedback; Unknown retry/Completed without verified fact; duplicate submission ref mismatch; Tools/Sandbox fake marks success; cleanup pending considered completed. Tests: record-before-call, effect class, unknown no retry, feedback matching/order, cancel-before-only, checkpoint fence.

## SM-09 Delegation

Variants: `Proposed`, `SubmissionCandidate`, `Submitted`, `ChildAccepted`, `ResultAvailable`, `Incorporated`, `Rejected`, `Cancelled`, `Failed`, `Unknown`.

```text
[Proposed] -> [SubmissionCandidate] -> [Submitted] -> [ChildAccepted]
    |                                     |              |
    +--> [Rejected|Cancelled]             +----------> [ResultAvailable] -> [Incorporated]
                                          +----------> [Failed|Unknown]
```

| From | Trigger | Guard | To | Mutation |
|---|---|---|---|---|
| create | `Delegation::create` | child scope/context/budget valid | Proposed | identity/version |
| Proposed | `prepare_submission` | parent action/guard eligible | SubmissionCandidate | version++ |
| SubmissionCandidate | `mark_submitted` | child request digest and submission ref stable | Submitted | submission/version++ |
| Submitted | `accept_child` | matching child run/delegation | ChildAccepted | child ref/version++ |
| Submitted/ChildAccepted | `record_result` | matching child result/correlation | ResultAvailable | result ref/version++ |
| ResultAvailable | `incorporate_once` | same result ref, new parent history entry | Incorporated | history ref/version++ |
| Proposed/SubmissionCandidate | `reject/cancel` | no child submission | Rejected/Cancelled | reason/version++ |
| Submitted/ChildAccepted | failure/unknown | verified failure or uncertain result | Failed/Unknown | reason/fence/version++ |

Illegal: scope/budget expansion; child result directly parent completion; incorporate twice; mutable context share; cancel submitted child without owner fact; Unknown automatic resubmit; member/container lifecycle fields. Tests: boundary allow-list, depth, request digest, once-only, parent independence, unknown.

## SM-10 Feedback Ordering and Incorporation

`ActionFeedbackRecord` is immutable; the state machine is the classification of a received event plus `FeedbackIncorporationDecision`. Record dispositions: applicable recorded states; duplicate; quarantined late/out-of-order/mismatch. Incorporation dispositions: `Apply`, `RecordOnly`, `IgnoreDuplicate`, `QuarantineLate`, `QuarantineOutOfOrder`, `BlockMismatch`, `ManualReview`.

```text
[received]
  +--> [Apply] ----------------> [marker transition + optional progress]
  +--> [RecordOnly] -----------> [history only]
  +--> [Duplicate|Late|OutOfOrder|Mismatch] -> [receipt/quarantine only]
  +--> [ManualReview] ---------> [fence/recovery fact]
```

| Input posture | Ordering/source guard | Decision | Allowed side effect |
|---|---|---|---|
| new + next sequence | source/action/submission/marker match | Apply | append record; marker transition; optional progress |
| new + nonterminal progress info | match | RecordOnly | append record/history |
| existing event ID/digest | same | IgnoreDuplicate | return existing receipt |
| sequence older than latest | source valid | QuarantineLate | append quarantine/receipt only |
| predecessor gap/future sequence | source valid | QuarantineOutOfOrder | append quarantine/receipt only |
| mismatched target/digest | invalid | BlockMismatch | append rejection/receipt; no marker |
| uncertainty may hide effect | cannot decide | ManualReview | unknown fence/recovery fact |

Illegal: update/delete feedback record; late event overwrites marker/outcome; duplicate creates second progress decision; unknown maps success/failure; receipt acceptance means execution. Tests: each classification, event digest conflict, ordering predecessor, marker mutation permission, progress trigger, inbox ack after commit.

## Batch gate

Choice, guard, attempt/effect, delegation and feedback are five distinct state owners. Every positive transition has a Step 9 Flow and every unknown posture is fenced.
