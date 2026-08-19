# L2-runtime Step 10 state machines: SM-01~05

> 状态: done
> 权威 enum: Step 6 object annex; trigger Flow: Step 9; 本文件定义完整 transition contract

## SM-01 Runtime Admission Decision

States: factory candidate; `Accepted`, `Rejected`, `Waiting`, `Blocked`; accepted decision additionally has a separate `run_created` application result marker, not a domain enum variant.

```text
[candidate]
  | decide: verified
  v
[Accepted] -- create+commit --> [run_created]
  | decide: reject/wait/block
  +-------------------------> [Rejected|Waiting|Blocked]
```

| From | Trigger/function | Guard | To | Object/local side effect | Error/record |
|---|---|---|---|---|---|
| factory | `RuntimeAdmissionDecision::decide` | all required source/preconditions verified | Accepted | immutable decision | admission history candidate |
| factory | same | explicit formal rejection | Rejected | safe reason/source refs | stored non-run result |
| factory | same | input/source may later arrive | Waiting | waiting reason | no run |
| factory | same | conflict/unknown/pending contract | Blocked | blocker reason | no run |
| Accepted | `ControlledRun::create` + UoW commit | same digest/idempotency, new IDs | run_created | run/workspace/history/outbox | committed result |

Illegal: any terminal decision variant to another variant; non-Accepted to run creation; duplicate accepted creates second run; unknown prerequisite to Accepted. Tests assert one decision identity, no run on negative posture, replay same run ref, different digest conflict, commit unknown not `run_created`.

## SM-02 Controlled Run

Authoritative variants: `Active`, `Waiting`, `Blocked`, `Cancelled`, `Completed`, `Failed`, `Unknown`, `ManualReview`.

```text
[Active] -> [Waiting] -> [Active]
   |          |            |
   +-------> [Blocked] -----+
   +-------> [Cancelled|Completed|Failed]
   +-------> [Unknown] -> [ManualReview]
```

| From | Trigger | Guard | To | Mutation | Flow side effect |
|---|---|---|---|---|---|
| create | accepted admission commit | scope/workspace valid | Active | version=initial | history/outbox |
| Active | progress/control | verified input pending | Waiting | reason/version++ | new decision/history |
| Active/Waiting | progress/guard | conflict/formal missing/unknown | Blocked | reason/version++ | new decision/history |
| Waiting/Blocked | progress/recovery | new verified fact, no fence | Active | decision/version++ | history/outbox |
| Active/Waiting/Blocked | cancel control | local cancel allowed | Cancelled | reason/version++ | no external cancellation inference |
| Active | finalize outcome | committed local outcome succeeded/partial | Completed | outcome ref/version++ | outcome/history/outbox |
| Active | finalize outcome | committed known local failure | Failed | reason/outcome ref/version++ | outcome/history/outbox |
| nonterminal | effect/commit uncertainty | stable fence ref | Unknown | fence/version++ | recovery/manual-review candidate |
| Unknown | recovery decision | explicit manual-review disposition | ManualReview | decision/version++ | audit/history |

Illegal: terminal to Active/Waiting/Blocked; Unknown to Active/success/ordinary retry; handoff ack/observed/approval directly changes run; control overwrites outcome; stale expected version. Idempotent replay returns same version/result. Tests cover every row plus terminal freeze, waiting vs blocked, unknown fence, delivery independence, optimistic conflict.

## SM-03 Goal-Plan Workspace

Variants: `Created`, `Evaluating`, `Ready`, `Partial`, `Waiting`, `Blocked`.

```text
[Created] -> [Evaluating] -> [Ready]
                 |  |  +--> [Partial]
                 |  +-----> [Waiting]
                 +--------> [Blocked]
[Ready|Partial|Waiting|Blocked] -- new decision --> [Evaluating]
```

| From | Trigger | Guard | To | Mutation |
|---|---|---|---|---|
| create | `GoalPlanWorkspace::create` | non-empty goals, typed constraints | Created | initial version |
| Created/Ready/Partial/Waiting/Blocked | evaluate command | run nonterminal, expected version | Evaluating | candidate snapshot/version++ |
| Evaluating | `record_progress` | dependencies and selected items verified | Ready | item progress/version++ |
| Evaluating | same | optional items unavailable | Partial | explicit omissions/version++ |
| Evaluating | same | required input expected later | Waiting | reason/version++ |
| Evaluating | same | conflict/unknown/contract block | Blocked | reason/version++ |

Illegal: implicit item advancement during `next_candidates`; missing dependency to Ready; method/process body stored; external Work completion directly changes item; mutation after stale version. Tests: item uniqueness, deterministic ordering/page cursor, dependency closure, partial omission, waiting/blocking, terminal eligibility proof.

## SM-04 Working Context

Variants: `Assembled`, `Frozen`, `Rejected`, `Expired`, `Degraded`; assembling is factory phase before object construction.

```text
[assembling] -> [Assembled] -> [Frozen]
      |              |             |
      +----------> [Rejected]      +--> [Expired|Degraded]
```

| From | Trigger | Guard | To | Mutation |
|---|---|---|---|---|
| factory | `WorkingContext::assemble` | accepted/partial decision; ordered segments fit budget | Assembled | context/digest/version |
| factory | same | unsafe mandatory segment/source mismatch | Rejected | rejection reason; no model use |
| Assembled | `freeze` | expected version, digest valid | Frozen | frozen_at/version++ |
| Assembled/Frozen | `expire` | freshness deadline/source change | Expired | reason/version++ |
| Assembled/Frozen | `mark_degraded` | source unavailable but view remains safe | Degraded | reason/version++ |

Illegal: Frozen segment mutation/reorder; Rejected/Expired/Degraded to Frozen without new context identity; budget overflow assembled; raw prompt/model body field; cross-run reuse. Replay freeze with same version maps duplicate/no mutation. Tests: ordering determinism, digest, budget/per-source cap, mandatory source, frozen immutability, expiry/degrade, body-free.

## SM-05 Working Memory

Variants: `Open`, `Compacting`, `Frozen`, `Degraded`.

```text
[Open] -> [Compacting] -> [Open(new window)]
  |             |
  +--> [Frozen] +--> [Degraded]
  +----------------> [Degraded]
```

| From | Trigger | Guard | To | Mutation |
|---|---|---|---|---|
| create | `WorkingMemory::create` | run identity/digest valid | Open | empty version |
| Open | `add` | eligible unique entry, expected version | Open | entry/digest/version++ |
| Open | `begin_compaction` | explicit decision ID | Compacting | decision/version++ |
| Compacting | `apply_compaction` | partition covers old active entries, commit known | Open | new window/digest/version++ |
| Open | `freeze` | expected version | Frozen | version++ |
| Open/Compacting | `mark_degraded` | source/owner unavailable | Degraded | safe reason/version++ |

Illegal: add to Frozen; silent deletion during compaction; durable episodic/semantic body write; Compacting to Open on commit unknown; degraded to normal without new verified decision; duplicate entry ref/version. Tests: version guard, duplicate, partition coverage, no history deletion, commit unknown retains old window, frozen write rejection, durable-owner pending.

## Batch gate

All five machines have an enum owner, Step 9 trigger, complete positive transitions, explicit illegal paths and state-specific tests. No external owner lifecycle was merged.
