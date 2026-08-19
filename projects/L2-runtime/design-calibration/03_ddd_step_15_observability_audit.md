# L2-runtime 03 Step 15: 逐 Flow / State / Event 观测与审计接缝

> 创建日期: 2026-08-09
> 状态: done
> 边界: Runtime emits body-free local observation candidates; L4-observability owns backend, observed/audit truth, retention and evidence qualification

## 1. Observation carrier

```rust
pub struct RuntimeObservation {
    pub observation_id: ObservationCandidateId,
    pub operation: OperationName,
    pub phase: OperationPhase,
    pub disposition: ObservationDisposition,
    pub correlation: RuntimeCorrelation,
    pub actor_ref: Option<ActorRef>,
    pub scope_ref: Option<ScopeId>,
    pub object_refs: Vec<TypedRef>,
    pub source_refs: Vec<SourceReference>,
    pub version_refs: Vec<VersionRef>,
    pub safe_reason: Option<SafeReason>,
    pub config_snapshot_ref: ConfigSnapshotRef,
    pub occurred_at: Timestamp,
    pub redaction: RedactionMarker,
}

pub enum OperationPhase { Entry, Validation, Reservation, Read, Decision, LocalCommit, ExternalAttempt, Incorporation, Projection, Publish, Completion }
pub enum ObservationDisposition { Started, Accepted, Replayed, Waiting, Blocked, Rejected, Conflict, Committed, Quarantined, Degraded, Unknown, Completed }
```

Observation ID is a candidate identity, not evidence alias. No prompt/body/raw response/secret/hidden rationale/artifact/report content is permitted.

## 2. Command observation matrix

| Command group | Required phases | Object/version refs | Mandatory dispositions | Forbidden field/claim |
|---|---|---|---|---|
| Accept | Entry/Validation/Reservation/Decision/LocalCommit | request/admission/run/workspace/history versions | accepted/replay/wait/block/reject/unknown | principal/product truth; executed |
| Control | Entry/Read/Decision/LocalCommit | run/control/checkpoint/fence versions | applied/conflict/blocked/unknown | external cancellation success |
| Progress | Entry/Read/Decision/LocalCommit | run/workspace/decision/source versions | continue/wait/block/terminal candidate/unknown | Method/Work completion |
| Compose/Memory | Entry/Read/Decision/LocalCommit | candidate/source/context/window/use refs | accepted/partial/degraded/blocked/unknown | memory body/query text |
| Model start/classify | Entry/LocalCommit/ExternalAttempt/Incorporation | turn/context digest/submission/result/decision refs | candidate/submitted/classified/blocked/unknown | provider route/secret/raw output/token/cost |
| Action/Guard | Entry/Read/Decision/LocalCommit | model/action/guard/version refs | proposed/allowed/denied/waiting/blocked/unknown | approval/execution/isolation truth |
| Delegation | Entry/Decision/LocalCommit/ExternalAttempt | parent/delegation/boundary/child refs | proposed/submitted/blocked/unknown/incorporated | member/container lifecycle/context body |
| Feedback | Entry/Reservation/Incorporation/LocalCommit | event/action/marker/ordering/progress refs | accepted/duplicate/late/out-of-order/mismatch/unknown | tool/sandbox result body |
| Checkpoint | Entry/Read/Decision/LocalCommit/ExternalAttempt | checkpoint/digests/history/fence/commit refs | prepared/committed/invalid/unknown | persistence readiness |
| Recovery/Outcome | Entry/Read/Decision/LocalCommit | run/checkpoint/fence/decision/outcome refs | resume/wait/block/manual/terminal/unknown | repaired external truth/delivery |
| Handoff/Source | Entry/Read/Decision/LocalCommit | material/attempt/gap/source/snapshot refs | candidate/gap/pending/stale/unknown | delivered/observed/accepted/source body |

Each phase record includes operation/correlation/config snapshot. Failure before ID allocation may omit object refs but still includes request/correlation when safe.

## 3. State transition audit records

| State subject | Transition audit fields | Special redaction | Required negative record |
|---|---|---|---|
| Admission | decision ref; from factory; to disposition; source refs | no trigger body | unknown prerequisite blocked |
| Run | run ref; from/to status; version; decision/fence/outcome ref | safe reason only | illegal terminal transition |
| GoalPlan | workspace; from/to; selected item refs; version | no Method body | missing dependency no Ready |
| Context | context/composition; status; digest; source versions | fragment refs only | forbidden body rejection |
| WorkingMemory | memory/window; status/version; compaction ref | no durable body | silent delete rejection |
| ModelTurn | turn; from/to; submission/result refs; version | no provider/raw output | unknown no retry |
| Action/Effect | action/guard/attempt/marker; from/to; versions | intent ref/digest only | proposed != execution; unknown fence |
| Delegation | delegation/parent/child refs; boundary digest; version | no context/member body | duplicate incorporation |
| Feedback | event/feedback/order/disposition | result refs only | late/out-of-order/mismatch quarantine |
| Checkpoint/Recovery | checkpoint/digests/receipt/recovery ref | stable refs only | prepared != committed; unknown no resume |
| Outcome/Handoff | outcome/material/attempt/gap/ack refs | safe refs/redaction | ack != acceptance; gap no self-close |
| Source/Projection/Adapter/Job | marker/cursor/slot/lease/report refs | no endpoint/secret/backend payload | fake != ready; stale != current; lost lease stop |

Audit append failure does not roll back already committed local truth unless the audit record is part of the local history atomic set; external Observability delivery failure always creates pending/gap and never rewrites domain truth.

## 4. Inbound/outbound/job observation

| Flow | Required local record | External observation boundary |
|---|---|---|
| consumer | envelope identity/source/schema/order; inbox disposition; linked fact; commit; ack candidate | ack/observed backend status not Runtime truth |
| outbound materialize | source fact; outbox event ID/digest/schema; snapshot created | no delivered/observed claim |
| publisher | attempt number; entry/event; receipt posture; latency class | receipt != observed/accepted |
| job page | job/operation/partition/lease/config/from-to cursor/counts/disposition/error refs | report != evidence/readiness |
| projection rebuild | rebuild ID; history range; views/gaps; final status | backend state external |
| reconciliation | marker/gap/checkpoint refs; checked source; decision | absence preserves unknown/open |

## 5. Metric/log/trace semantic names

Specific telemetry backend and metric syntax are not selected. Code must expose semantic counters/timers/gauges at these binding points:

| Semantic observation | Labels allowed | Labels forbidden |
|---|---|---|
| operation disposition count | operation, phase, safe disposition, profile | actor ID, prompt, body, high-cardinality object ID |
| local transaction duration/result | operation, known/unknown/conflict | DB endpoint/query text |
| external seam attempt/result | slot, capability class, safe posture | provider route/secret/model product/cost |
| consumer disposition | event kind, source owner class, disposition | raw payload/event body |
| job page counts/duration | job operation, partition class, disposition | full cursor/record refs as labels |
| state transition count | state subject, from/to, allowed/illegal | run ID as metric label |
| open unknown/gap/degraded posture | posture kind, owner class | hidden reason/body |

Trace correlation may carry stable IDs in trace attributes under redaction policy, but metrics keep bounded cardinality. Logs use `RuntimeObservation` safe fields only.

## 6. Observation failure and fail-closed

| Failure | Runtime behavior |
|---|---|
| local observation construction contains forbidden body | reject construction; record safe security reason locally if possible |
| external Observation adapter pending/unavailable | keep local outbox/observation candidate pending; no observed claim |
| publish unknown | same candidate/event identity for reconciliation; no regenerated evidence alias |
| redaction policy unavailable | block external emission; domain operation follows its own requirement only if safe local history remains |
| audit-required local history append fails | local UoW fails/unknown according to Flow |
| optional diagnostic sink fails | domain truth remains; explicit diagnostic gap/counter candidate |

## 7. Evidence boundary

This design defines no `run_id` execution, artifact, report file, evidence alias, acceptance verdict or signature. Future tests/acceptance may cite observation candidates only after implementation-generated artifacts and owner-qualified evidence exist. L4-observability positive `observed`/audit interface remains `L2R-UP-002/006/007` blocked.

## 8. Step gate

| Check | Result |
|---|---|
| all Command groups have phase/object/version/disposition observations | pass |
| 18 state subjects have transition audit fields and negative record | pass |
| consumers/outbound/jobs have independent observation points | pass |
| redaction/cardinality/body-free boundaries explicit | pass |
| no backend/evidence/readiness fabricated | pass |

```text
step_15 = done
next_allowed_action = step_16_per_object_port_protocol_flow_state_tests
```
