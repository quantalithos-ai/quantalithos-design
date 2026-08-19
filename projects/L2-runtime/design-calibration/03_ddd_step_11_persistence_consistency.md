# L2-runtime 03 Step 11: 逐 record / Flow 持久化、事务与一致性契约

> 创建日期: 2026-08-09
> 状态: done
> 边界: 逻辑 record/transaction contract；未选择数据库、schema migration tool、isolation product 或 physical checkpoint store

## 1. Persistence ownership

Runtime persists only local run/working state/decision/history/marker/attempt/gap/projection/inbox/outbox/idempotency/job records. External owner bodies and truth remain references. Every mutable aggregate uses its own typed optimistic version; immutable facts use unique identity + append sequence.

## 2. Record contracts

| Record | Primary identity | Required field groups | Write mode/version | Required read/index surface | Retention/deletion boundary |
|---|---|---|---|---|---|
| `run_record` | `run_id` | scope/status/workspace/current decision/checkpoint/outcome/version/timestamps | insert then expected `RunVersion` update | run ID; scope+status; resume candidate cursor | terminal record retained; no cascade from projection/handoff |
| `goal_plan_record` | `workspace_id` | run/goals/items/constraints/progress/source refs/version/time | insert/expected `WorkspaceVersion` full transition | run ID; workspace version; plan cursor/order | working state retained through run policy; no Method body |
| `context_record` | `context_id` | run/composition/segments/budget/source refs/digest/status/version/time | insert then expected `ContextVersion`; frozen immutable except expire/degrade marker | run; composition; status/freshness | body-free refs; new composition creates new identity |
| `memory_window_record` | `memory_id` | run/entries/window version/source refs/status/digest/time | expected `MemoryWindowVersion`; compaction creates new logical window version | run+window; entry ref; status | no durable owner content/delete; old window traceable |
| `memory_use_record` | `run_id+candidate_id+decision_id` | use/candidate/source/decision/context/disposition/time | append unique | run cursor; decision; candidate identity | immutable; no source body |
| `model_turn_record` | `turn_id` | run/intent/context digest/status/submission/result/decision/version/time | expected `ModelTurnVersion` | turn; submission unique; run+status | unknown/terminal retained |
| `decision_record` | typed decision ID | run/kind/disposition/reason/source/correlation/time | append-only | run+kind+sequence; correlation; source ref | immutable; supersession by ref only |
| `action_record` | `action_decision_id` | run/model decision/candidate/disposition/guard/marker/source/version/time | expected `ActionDecisionVersion` | action; run+status; marker | choice retained independently from effect |
| `precondition_record` | `precondition_decision_id` | action/disposition/checked refs+versions/reason/sources/time | append-only | latest for action; checked source version | immutable; re-evaluation appends |
| `action_attempt_record` | `attempt_id` | run/action/marker/target/intent digest/guard versions/status/submission/time | append then status transition if modeled as one record; expected attempt version required | action; marker; submission unique | never implies execution |
| `effect_marker_record` | `marker_id` | run/action/effect class/status/attempt/submission/feedback/fence/version/time | expected `SideEffectVersion` | run+unresolved cursor; action; submission | unknown retained until verified decision |
| `delegation_record` | `delegation_id` | parent/action/child scope/context/budget/goals/status/child refs/version/time | expected `DelegationVersion` | parent run; child run; status | no member/container lifecycle |
| `feedback_record` | `feedback_id` | run/action/marker/source event/external ref/submission/disposition/result/order/correlation/source/time | append unique source event+digest | event ID; action latest; ordering stream+sequence | immutable including quarantine |
| `reflection_record` | `reflection decision_id` | trigger/run/disposition/next refs/reason/sources/time | append-only | run; trigger; disposition | no hidden reasoning body |
| `checkpoint_record` | `checkpoint_id` | run/candidate/stable refs/source versions/fence+state digest/history sequence/status/commit ref/version/time | expected `CheckpointVersion` | run latest stable; commit-unknown cursor; digest | prepared/unknown/superseded retained |
| `recovery_record` | `recovery decision_id` | run/disposition/checkpoint/versions/fence/reason/sources/supersedes/time | append-only | run; manual-review cursor; checkpoint | immutable decision |
| `continuation_record` | `continuation_id` | decision/run/checkpoint/status/lease/cursor/attempt/next time/error | expected continuation version | eligible time+status; lease; decision | operational retention; no scheduler truth |
| `outcome_record` | `outcome_id`; unique `run_id` | run/disposition/terminal decision/result+summary refs/checkpoint/fence/sources/version/time | insert-once | run unique; disposition | immutable local terminal truth |
| `handoff_material_record` | `material_id` | run/outcome/safe refs/redaction/digest/eligibility/time | insert immutable | run/outcome; digest; eligibility | body-free; no evidence/report body |
| `handoff_attempt_record` | `attempt_id` | run/material/digest/target/status/submission/ack/correlation/version/time | expected `HandoffAttemptVersion` | run; material; submission; status | delivery/acceptance excluded |
| `handoff_gap_record` | `gap_id` | attempt/kind/status/reason/open+close sources/ack/version/time | expected `HandoffGapVersion` | open-gap cursor; attempt; status | no self-delete/close |
| `source_marker_record` | `source_ref_id` | owner/object/scope/version/freshness/availability/status/reason/checked time/local version | expected `AvailabilityVersion` | owner+object; scope; stale cursor | no source owner body |
| `history_record` | `entry_id`; unique `run_id+sequence` | run/sequence/kind/fact/causation/correlation/sources/commit time | append-only strict next sequence | run cursor; correlation; fact ref | never update/delete through business Flow |
| `idempotency_record` | `operation+key` | digest/status/stored result/expiry | atomic reserve then complete in UoW | operation+key unique; expiry scan | expiry cannot silently change digest identity |
| `inbox_record` | `event_id+source_owner` | event digest/status/receipt/linked fact/correlation/time | atomic reserve + durable receipt | event/source unique; unknown scan | duplicate retained |
| `outbox_record` | `outbox_id`; unique event ID | exact event snapshot/digest/correlation/status/attempt receipt/time | append with source fact; publisher status transition | pending cursor; event ID; status | payload immutable; no current rebuild |
| `projection_state_record` | `projection_id` | name/status/cursor/source version/sequence/rebuild/gaps/version/time | expected `ProjectionVersion`, monotonic cursor | projection; status; rebuild ID | rebuildable, never source truth |
| `safe_view_record` | `view_id`; logical run+scope | safe view fields/projection cursor/freshness/visibility/redaction/time | derived upsert under cursor | run+scope; projection+cursor | rebuildable; no domain cascade |
| `job_state_record` | `operation+partition` | cursor/status/lease/report/version/time | expected `JobStateVersion`; page atomic | operation/status/next eligible | operational only |
| `job_report_record` | `job_id+page cursor` | counts/disposition/error refs/lease/config/cursor | append unique page | job; operation; cursor | not evidence/readiness |

## 3. Command atomic write sets

| Command | One local atomic set | Before transaction reads | After commit activity | Commit unknown posture |
|---|---|---|---|---|
| Accept | idempotency + admission + optional run/workspace + history + outbox | source/governance views | publisher later | no accepted response; reconciliation/manual |
| Control | idempotency + run + control decision + history + result/outbox | checkpoint/effect reads | none | run unknown if mutation uncertain |
| Progress | idempotency + progress decision + run/workspace + history + result/outbox | definitions/source/effect reads | continuation candidate only | affected aggregates unknown/reload |
| Compose | idempotency + context/window/use records + history + result/outbox | memory/source candidate reads | none | no usable context claim |
| Record memory | idempotency + window/entry/use/history/result | source availability | none | old version authoritative until reconcile |
| Model start | first UoW intent/turn/history/result/outbox; second UoW submission posture | context/availability | adapter submit between UoWs | turn unknown fence |
| Model classify | idempotency + turn/decision/summary/history/result/outbox | semantic result read | none | decision not published as known |
| Propose action | idempotency + action/history/result/outbox | model decision | none | action unknown/not submittable |
| Evaluate guard | idempotency + guard/action anchor/history/result/outbox | Governance/Hub/Tools/Sandbox views | none | guard unknown, no submit |
| Propose delegation | idempotency + delegation/admission/history/result/outbox | parent/context | child submit later internal operation | no child call claim |
| Feedback | inbox/idempotency + feedback + optional marker/progress/run/workspace + history/result/outbox | prior order/action | event ack | receipt unknown; no source ack |
| Prepare checkpoint | idempotency + prepared checkpoint/history/result | run/workspace/memory/context/effects | physical commit not called | not stable |
| Commit checkpoint | checkpoint status/history/result; outbox only if proof | physical commit request | reconciliation for unknown | `CommitUnknown` fence |
| Recovery | idempotency + recovery decision/history/result/outbox | run/checkpoint/fence/source | continuation later | decision unknown/not applied |
| Finalize outcome | idempotency + outcome/run/history/result/outbox | terminal decision/effects | handoff later | no terminal positive response |
| Handoff candidate | idempotency + material/attempt/gap/history/result/outbox | outcome/safe refs/route config | submit/reconcile later | attempt/gap unknown |
| Capture source | idempotency + snapshot metadata/source marker/history/result/outbox | source resolve | none | marker unknown |

## 4. Event and job atomic sets

| Flow | Atomicity rule | Ordering/cursor rule | Partial failure |
|---|---|---|---|
| Consumer | inbox reservation + local record/transition + history/outbox + receipt together where physical store permits | event ID/source/digest and ordering sequence | no ack until durable disposition; unknown receipt reconciled |
| Outbox publisher | one publish receipt/status per immutable entry; source fact not in publisher transaction | stable outbox cursor and event ID | unknown remains pending; payload unchanged |
| Projection page | view rows + projection cursor/state + page report together | contiguous history sequence and expected cursor | gap -> degraded; no cursor skip |
| Source refresh page | marker changes + stale projection markers + report/cursor | source cursor/version ordering | per-record pending/unknown reported |
| Memory compaction | new window transition + history + report/cursor | window version and lease fence | old window remains authoritative on unknown |
| Recovery page | each new decision/history then page report/cursor | run/version/lease revalidated per item | manual/unknown item isolated and reported |
| Effect reconciliation | new verified feedback/recovery fact only | marker/checkpoint cursor | absence preserves unknown; no retry |
| Handoff reconciliation | reconciliation record + attempt/gap transition + history/report | attempt/gap version and ack identity | no ack keeps gap open |

## 5. Consistency windows

| Window | Truth before | Action | Truth after known success | Unknown handling |
|---|---|---|---|---|
| local UoW | previous committed aggregate/history | enlist versioned writes | all local set visible atomically | reload/reconcile; do not claim result |
| model/tools/sandbox/child external call | committed local candidate/attempt | call adapter seam | second UoW stores stable submission posture | fence unknown; no blind retry |
| checkpoint physical commit | prepared local checkpoint | pending physical Port | matching receipt -> committed | commit-unknown; no resume |
| outbox publish | local fact + immutable snapshot committed | publisher sends snapshot | publisher receipt recorded | source truth unchanged, entry pending |
| handoff ack | local candidate/submitted/gap | consume verified ack | attempt/gap local transition | no self-close/acceptance |
| projection rebuild | committed history cursor | apply page | current only when caught up | stale/degraded/unknown exposed |

## 6. Physical contract blocker

`L2R-CP-001` remains open: physical database/store choice, atomicity across record sets, isolation level, checkpoint serialization, commit status query and recovery after process crash are not selected. Therefore this Step defines required logical guarantees and Port receipts only; positive implementation qualification is blocked.

## 7. Step gate

| Check | Result |
|---|---|
| Every persisted object/marker/carrier has identity, fields, write mode, read surface | pass |
| Every Command/Event/Job has an atomic set and unknown posture | pass |
| External calls are separated from local commit windows | pass |
| Outbox payload and projection source are immutable committed facts | pass |
| External bodies/truth are not persisted | pass |

```text
step_11 = done
next_allowed_action = step_12_per_flow_error_and_recovery
```
