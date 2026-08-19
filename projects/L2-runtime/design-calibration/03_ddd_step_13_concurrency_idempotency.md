# L2-runtime 03 Step 13: 逐协议并发、幂等与重入保护

> 创建日期: 2026-08-09
> 状态: done
> 目标: stable identity + optimistic version + append/order + lease fence; no global lock or retry blanket

## 1. Command idempotency identities

| Command | Identity tuple | Digest includes | Stored result | Conflict/reentry rule |
|---|---|---|---|---|
| Accept | operation+key+actor+scope+goal/source/precondition refs+versions | full body-free trigger semantics | admission/run/workspace refs | same digest same run; different digest conflict |
| Control | operation+key+run+intent+reason/checkpoint+expected version | control enum payload | run/decision/version | terminal replay returns existing; stale version conflict |
| Progress | key+run+workspace+decision inputs+expected versions | candidate/source/constraint/fence refs | decision/new versions | same inputs replay; new facts require new key |
| Compose | key+run+retrieval request+mandatory refs+budget+window version | ordering/freshness/policy refs | composition/context/use refs | no second context for same digest |
| Record memory | key+run+candidate identity+window version | source snapshot/version/disposition | entry/use/window refs | `MemoryUseIdentity` unique |
| Model start | key+run+intent+context digest+run version | logical selection/purpose/budget | turn/submission posture | same turn candidate; unknown no new key retry |
| Model classify | key+turn+submission/result ref+turn version | semantic result digest/schema | decision/summary | one decision per stable result identity |
| Propose action | key+run+model decision+candidate digest | target/input/scope/budget | action ref | new alternative uses new candidate/decision identity |
| Evaluate guard | key+action+checked refs+version set | all precondition views | guard ref/disposition | stale source set requires new key/decision |
| Propose delegation | key+parent/action+child scope+boundary digest+budget/goals | all child boundary semantics | delegation ref | no second child for same digest |
| Feedback | key+source event+external feedback digest+action+marker version | ordering/source/result refs | feedback/incorporation refs | event ID/digest unique; quarantine replay stable |
| Prepare checkpoint | key+run+state/fence digest+aggregate versions | stable candidate refs/history sequence | checkpoint ref/status | same candidate same checkpoint |
| Commit checkpoint | key+checkpoint+state digest+checkpoint version | physical request identity | commit disposition/ref | unknown reconciles same key; no fresh request |
| Recovery | key+run+trigger/mode/checkpoint/fence/current versions | full recovery inputs | decision ref | new fact creates new decision/key |
| Finalize outcome | key+run+terminal decision+disposition/result/fence+version | terminal semantics | outcome/run refs | unique outcome per run |
| Handoff candidate | key+outcome+safe refs+target+material digest | redaction/eligibility semantics | material/attempt/gap refs | same material/target same attempt |
| Capture source | key+source+freshness+expected source version | owner/object/scope/version | snapshot/availability refs | new source version uses new key |

## 2. Aggregate concurrency guards

| Aggregate | Expected version | Concurrent conflict protected | Merge allowed |
|---|---|---|---|
| ControlledRun | `RunVersion` | progress/control/outcome/recovery anchor | none; reload + new decision |
| GoalPlanWorkspace | `WorkspaceVersion` | candidate progress/dependency reconciliation | no implicit merge |
| WorkingContext | `ContextVersion` | freeze/expire/degrade | frozen immutable; no segment merge |
| WorkingMemory | `MemoryWindowVersion` | add/compaction/freeze/degrade | only domain compaction partition |
| ModelTurn | `ModelTurnVersion` | submission/classification/fail/unknown | duplicate same result maps existing |
| ActionDecision | `ActionDecisionVersion` | guard/submit/cancel/supersede | prior decision immutable semantics |
| SideEffectMarker | `SideEffectVersion` | attempt/submission/feedback/unknown | never merge different external facts |
| Delegation | `DelegationVersion` | submit/child/result/incorporate | once-only result |
| Checkpoint | `CheckpointVersion` | prepare/commit/unknown/supersede | same receipt may replay |
| HandoffAttempt/Gap | typed versions | submit/ack/reconcile/unknown | matching ack replay only |
| SourceAvailability | `AvailabilityVersion` | event/refresh ordering | newer verified version wins by domain rule, not store LWW |
| Projection | `ProjectionVersion` + cursor | page/rebuild/stale marking | replay exact page allowed |
| JobState | `JobStateVersion` + lease token | page runners/cursor | no concurrent page merge |

No last-write-wins on domain truth. Store-level CAS conflict maps to `VersionConflict`, and application reloads only when no external side effect may have occurred.

## 3. Event dedupe and ordering

| Event | Dedupe identity | Ordering key/sequence | Concurrent handling |
|---|---|---|---|
| model result | owner+event ID+digest; submission unique | turn/submission stream | inbox reserve winner; later duplicate reads receipt |
| action feedback | event ID+digest; external feedback ref unique | action/submission ordering sequence | append/quarantine under marker version |
| child result | event ID+digest; delegation+child result unique | delegation stream | once-only incorporation CAS |
| source change | owner+event ID+source version | source ref/version | older event late; equal digest duplicate; conflict quarantine |
| governance change | owner+event/formal decision/effective version | decision/policy stream | new decision append; no old overwrite |
| handoff ack | event ID+ack ref; attempt+submission | attempt stream | gap version CAS; duplicate stable receipt |

Inbox reservation and target write are one logical atomic set. If physical stores cannot guarantee this, adapter qualification is blocked or must provide an inbox-outbox recovery protocol; design cannot claim exactly-once external delivery.

## 4. External side-effect reentry

| Seam | Local record before call | Stable external identity | On timeout/unknown | Allowed retry |
|---|---|---|---|---|
| model submit | model turn submission candidate | turn/submission request digest | turn Unknown/fence | status query same identity; new turn after recovery proof |
| Tools submit | action attempt + marker AttemptRecorded | canonical intent digest/correlation | marker Unknown | no submit retry; feedback/status reconcile |
| Sandbox handoff | attempt/marker + isolation ref | submission/correlation | marker Unknown | no handoff retry without recovery proof |
| child create | delegation SubmissionCandidate | delegation/request digest | delegation Unknown | child lookup same identity |
| checkpoint commit | CommitPending checkpoint | checkpoint/request digest | CommitUnknown | physical reconcile same request only |
| handoff submit | attempt Candidate/gap | attempt/material digest | attempt/gap Unknown | status/ack reconcile; no new attempt unless policy decision |
| event publish | immutable outbox entry | event ID/payload digest | entry pending/unknown | republish same event/payload only |

## 5. Job lease/cursor fencing

Every job partition identity is `operation + partition`; claim returns an opaque fencing token and expiry. Job state mutation requires matching live lease ref, expected job version and expected cursor. Page side effects, next cursor and report commit atomically. On lease loss or commit unknown, runner stops immediately; another runner reloads last committed cursor. Per-item external effect follows the side-effect table and is not reissued based solely on cursor position.

| Job | Partition | Cursor | Item identity | Replay behavior |
|---|---|---|---|---|
| rebuild views | projection/shard | projection/history cursor | history sequence | exact page idempotent; no cursor skip |
| refresh sources | owner/shard | source cursor | source ref+expected version | newer verified marker only |
| compact memory | run shard | run/window cursor | run+window version | old window retained on unknown |
| resume runs | recovery shard | recovery cursor | run+recovery decision | apply decision once |
| reconcile effects | marker/checkpoint shard | dual cursors | marker/checkpoint+fence | status-only repetition |
| reconcile gaps | gap shard | handoff cursor | gap+attempt version | close once with ack ref |
| publish outbox | outbox shard | outbox cursor | event ID+digest | same payload republish |

## 6. Idempotency retention/expiry

Retention duration is configuration-bound in Step 14/04, but semantics are fixed: an expired reservation with a committed result remains discoverable for the domain uniqueness window; expiration cannot permit duplicate run/outcome/checkpoint/attempt creation. Cleanup must preserve operation/key/digest/result identity or a permanent unique domain constraint. No exact TTL/default is invented here.

## 7. Step gate

| Check | Result |
|---|---|
| 17 Command identities and stored results independently specified | pass |
| every mutable aggregate has typed version guard | pass |
| 6 events have dedupe/order/concurrency semantics | pass |
| every external call has local-before-call identity and unknown fence | pass |
| 7 Jobs have partition/cursor/item/replay semantics | pass |
| no exactly-once/readiness claim | pass |

```text
step_13 = done
next_allowed_action = step_14_configuration_dependency_bindings
```
