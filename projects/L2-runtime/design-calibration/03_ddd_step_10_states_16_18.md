# L2-runtime Step 10 state machines: SM-16~18

> 状态: done
> 范围: projection, adapter binding/availability, job lease and durable page state

## SM-16 Projection State

Variants: `Empty`, `Current`, `Stale`, `Rebuilding`, `Degraded`, `Unknown`.

```text
[Empty|Stale|Degraded] -> [Rebuilding] -> [Current]
                              |  +----> [Degraded]
                              +-------> [Unknown]
[Current] -- committed source fact --> [Stale]
```

| From | Trigger/function | Guard | To | Side effect |
|---|---|---|---|---|
| create | `ProjectionState::empty` | projection identity valid | Empty | state/version |
| Empty/Stale/Degraded | `begin_rebuild` | rebuild ID/cursor/lease valid | Rebuilding | rebuild/version++ |
| Rebuilding | `advance` | same rebuild ID, contiguous history, expected cursor | Rebuilding | cursor/watermark/version++ |
| Rebuilding | `mark_current` | caught up to committed history watermark | Current | final cursor/source/version++ |
| Current | `mark_stale` | newer committed source version | Stale | reason/version/outbox |
| Rebuilding | `mark_degraded` | history/source gap known | Degraded | gap refs/version++ |
| any | `mark_unknown` | cursor/source/commit cannot determine | Unknown | reason/version++ |

Illegal: stale/degraded/unknown returned as current; cursor regression/skip; rebuild reads external current truth instead of committed history; projection writes domain; current without caught-up proof; lease loss advances cursor. Tests: contiguous pages, replay same page, conflict, gap, current proof, source invalidation, body-free view.

## SM-17 Adapter Binding and Availability

Config activation variants: `Disabled`, `Blocked`, `Candidate`. Runtime availability variants: `Unconfigured`, `PendingContract`, `Blocked`, `Unavailable`, `Degraded`, `Candidate`. There is intentionally no `Ready`.

```text
[Unconfigured] -> [PendingContract|Blocked|Unavailable]
       | config+contract candidate
       v
   [Candidate] <-> [Degraded]
       | failure/change
       +---------> [Blocked|Unavailable|PendingContract]
```

| From | Trigger | Guard | To | Side effect |
|---|---|---|---|---|
| no slot | builder validate | optional disabled | Unconfigured/Disabled | local build report |
| any | builder validate | owner contract missing | PendingContract/Blocked | blocker reason |
| any | availability check | known adapter unavailable | Unavailable | checked time/reason |
| config candidate | `validate_against` | contract/schema/capability compatible | Candidate | binding state only |
| Candidate | runtime check | partial capability/availability | Degraded | reason/cap summary |
| Candidate/Degraded | contract/config change | no longer compatible | Blocked/PendingContract | reason |

Illegal: design document/fake/endpoint ping produces Ready; blocked adapter performs positive call; fake binds non-test profile; provider secret/route/quota/cost stored; adapter state changes domain truth; unavailable silently falls back across data boundary. Tests: required/optional slot, schema mismatch, blocked default, no Ready enum, fake profile, degraded capability, fail-closed call.

## SM-18 Job Lease and Page State

Lease lifecycle: available before claim; `Claimed`, renewed claim, released/expired are Port receipt postures. Durable `JobStateRecord` variants: `Waiting`, `Running`, `CompletedPage`, `Blocked`, `Failed`, `Unknown`.

```text
lease:[available] -> [Claimed] -> [renewed] -> [released]
                          +---------------> [expired]
job:[Waiting] -- claim --> [Running] -- page commit --> [CompletedPage] -> [Waiting|Running]
                           +--------------> [Blocked|Failed|Unknown]
```

| Subject/from | Trigger | Guard | To | Side effect |
|---|---|---|---|---|
| lease available | `LeasePort::claim` | partition free, owner/TTL valid | Claimed | fencing token/expiry |
| Claimed | `renew` | same live token/owner | renewed Claimed | new expiry |
| Claimed | `release` | same token/owner | released | release receipt |
| Claimed | clock/claim check | expiry reached | expired | no more page work |
| job Waiting/CompletedPage | `JobStateRecord::claim` | live matching lease, expected version | Running | lease ref/version++ |
| Running | `complete_page` | page changes+cursor+report committed atomically | CompletedPage | cursor/report/version++ |
| CompletedPage | next page | live renewed lease and next cursor | Running | version++ |
| Running | `block` | upstream pending/unknown guard | Blocked | reason/report |
| Running | `fail` | known local infrastructure failure | Failed | safe error/report |
| Running | commit/lease uncertainty | result cannot determine | Unknown | preserve prior cursor/fence |

Illegal: work without claim; expired/lost lease continues; cursor advances before page commit; duplicate page creates second external effect; report counts inconsistent; failed/unknown converted completed; scheduler/container lifecycle stored. Tests: owner/token mismatch, expiry, renewal, page atomicity, cursor replay, partial counts, lost lease stop, unknown preserves cursor.

## Cross-state propagation

```text
committed local history
  -> projection stale/rebuild/current
  -> outbox snapshot/publisher attempt
  -> job page/report

external source/feedback/ack
  -> inbox record
  -> new local decision/marker/gap
  -> never direct prior-truth overwrite
```

## Batch gate

Projection is derived read state, adapter availability is binding posture without readiness, and job state is operational continuation without scheduler/product ownership.
