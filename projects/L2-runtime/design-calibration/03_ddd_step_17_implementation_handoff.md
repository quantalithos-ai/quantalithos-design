# L2-runtime 03 Step 17: 详细设计到实施的 planned boundary handoff

> 创建日期: 2026-08-09
> 状态: done
> 目标: 给实施 Agent 逐 crate/file/object/Port/protocol/Flow/state/test 的承接边界；不创建实现仓、不写 commit/run/test/evidence/readiness

## 1. Target repository status

Planned implementation repository: `/home/aris/Projects/quantalithos-runtime`. It does not exist in the current workspace. All rows below are `planned`, `blocked` or `waiting`, never implementation status.

## 2. Crate/file boundary handoff

| Crate/package | Planned files | Implement first | Blocked/waiting dependency |
|---|---|---|---|
| `runtime-contracts` | ids/refs, metadata, reasons, commands, queries, events, jobs, views, errors | typed IDs/envelopes/schema validators/body-free digest | Core exact schema candidate `L2R-UP-006`; no transport |
| `runtime-domain` | run, goal_plan, history, context, memory, source, model, action, delegation, checkpoint, recovery, outcome, handoff, projection, policies/errors | pure structs/enums/invariants/state methods | external body/owner truth; all I/O forbidden |
| `runtime-application` | facade, operation_context, idempotency, ports, 13 command services, query/consumer/job services | typed Port traits, UoW/error mapping, service flows | external Port contracts; checkpoint physical `CP-001` |
| `runtime-infra` | repositories, UoW/idempotency/inbox/outbox/projection/lease, adapters, config, builder, fakes | logical stores and blocked adapter wrappers | physical store/adapter qualification absent |
| `runtime-api` | command/query handlers, protocol mappers, route-neutral entry | finite dispatch + no direct truth write | entry/member/product boundary `ENTRY-001`; transport not selected |
| `runtime-worker` | event mapper/consumer/ack/continuation | inbox -> application -> durable receipt | Bus route/schema and upstream event contracts pending |
| `runtime-jobs` | runner, seven job request/report mappings | lease/cursor/page handoff | scheduler/product lifecycle not Runtime-owned |

## 3. Object implementation order

| Phase | Objects/functions | Prerequisite | Completion boundary |
|---:|---|---|---|
| IU-01 | Core-compatible IDs/refs/metadata/digest/reasons | exact Core schema review | contracts compile candidate |
| IU-02 | scope/correlation/admission/run/control | contracts + technical fakes | pure state/invariant tests |
| IU-03 | goal-plan/workspace/progress/history | run types + source refs | append/version tests |
| IU-04 | source/context/memory/candidate/use/compaction | source/memory Ports | working-only and body-free tests |
| IU-05 | model intent/turn/result/decision/summary | frozen context + model Port | semantic-only/unknown tests |
| IU-06 | action/candidate/guard/attempt/effect | model decision + owner view Ports | no execution inference tests |
| IU-07 | delegation/boundary/child result/feedback/reflection | action/effect + child seam | once-only incorporation/order tests |
| IU-08 | checkpoint/recovery/continuation | stable candidate/fence + CP Port | commit proof/unknown tests |
| IU-09 | outcome/handoff/gap | local outcome + safe material | local-first/gap tests |
| IU-10 | projection/view/outbox/inbox/job state/report | history + cursor/lease Ports | rebuild/replay/no-readiness tests |
| IU-11 | application services/facade | all domain/Port contracts | 17/12/6/6/7 orchestration tests |
| IU-12 | infra adapters/builder/config | profile/slot schema and real qualification | planned blocked/candidate binding only |
| IU-13 | API/worker/jobs entry | facade + protocol mappers | route-neutral handlers; no lifecycle truth |

## 4. Protocol implementation handoff

| Family | Count | Implementation unit | Per-unit required outputs |
|---|---:|---|---|
| Command | 17 | one request/result module and handler mapping per name | typed DTO, validator, service call, stored result, public error, replay test |
| Query | 12 | one query/view mapper per name | request/view/page schema, visibility, freshness, no-write test |
| Inbound Event | 6 | one consumer payload/handler per source family | envelope specialization, inbox identity, ordering, receipt, quarantine test |
| Outbound Event | 6 | one commit-time materializer per canonical family | payload snapshot, event ID/digest, outbox record, publish replay test |
| Job | 7 | one request/report/runner per operation | lease key, cursor, page UoW, partial/unknown report, resume test |

## 5. Flow/state/test handoff matrix

| Capability | Primary Flow units | State units | Test unit | Phase dependency |
|---|---|---|---|---|
| Admission/control | Accept, Control | SM-01/02 | scope/idempotency/control | IU-02 + Governance pending |
| Goal/plan | Progress | SM-03 | dependency/terminal | IU-03 + Definition pending |
| Context/memory | Compose, Record, Refresh, Compact | SM-04/05/15 | budget/stale/working-only | IU-04 + Memory pending |
| Model | Start, Classify, Consume | SM-06/17 | frozen/semantic/unknown | IU-05 + Model pending |
| Action | Propose, Guard, Submit internal | SM-07/08/17 | no execution/unknown | IU-06 + Tools/Sandbox pending |
| Delegation/feedback | Propose, Child consumer, Feedback | SM-09/10 | boundary/order/once | IU-07 + Child seam |
| Checkpoint/recovery | Prepare, Commit, Request, Resume | SM-11/12/18 | proof/fence/lease | IU-08 + CP-001 |
| Outcome/handoff | Finalize, Candidate, Ack/Reconcile | SM-13/14 | local-first/gap | IU-09 + UP-002 |
| Projection/ops | Rebuild, Publish, Query | SM-16/18 | cursor/snapshot/no readiness | IU-10 + Bus/Obs pending |

## 6. Implementation boundary rules

- Implementers may create only the planned Rust workspace under the target implementation repository after a separate implementation authorization; this design task does not create it.
- `planned` means file/object boundary is designed, not present.
- `blocked` means code may have a typed blocked adapter/fake seam but cannot qualify positive integration.
- `waiting` means a decision/config/owner input is needed before activation.
- No implementation phase may claim `ready`, `passed`, `verified`, `delivered`, `observed`, `accepted`, `signed`, `evidence`, `report` or `run_id` facts from this document alone.
- Any discovered mismatch with upstream formal protocol/schema must stop the dependent phase and create a new blocker; local shadow types are forbidden.

## 7. Handoff audit

| Check | Result |
|---|---|
| every planned file maps to object/Port/protocol/Flow/state/test | pass |
| every protocol family has count and independent implementation unit | pass |
| phase dependency and blocked/pending seam explicit | pass |
| target implementation repo/implementation status not fabricated | pass |
| no commit/run/artifact/evidence/acceptance/readiness claim | pass |

```text
step_17 = done
next_allowed_action = step_18_cascade_blocker_review
```
