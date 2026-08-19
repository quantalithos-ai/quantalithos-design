# L2-runtime 03 Step 16: 逐对象 / Port / 协议 / Flow / State 测试切口

> 创建日期: 2026-08-09
> 状态: done
> 说明: 仅定义 planned test cuts、fixtures、assertions and fake seams；未运行测试、未生成 report/artifact/evidence

## 1. Test layer contract

| Layer | Test target | Allowed dependency | Forbidden assertion |
|---|---|---|---|
| contracts | type/schema/digest/redaction roundtrip | deterministic core/fake | external readiness |
| domain | pure invariant/state/transition | no I/O | repository/adapter behavior |
| application | service orchestration/UoW/idempotency/error mapping | fake Ports | real external result |
| infra | repository/transaction/outbox/projection/lease logical behavior | in-memory/fake store | physical DB production readiness |
| entry | mapper/dispatch/ack ordering | fake facade/mapper | transport route readiness |
| cross-seam | pending/blocked/unknown contract | explicit blocked adapters | positive upstream integration |

## 2. Object invariant test cuts

| Object | Test cases | Assertions |
|---|---|---|
| RuntimeScope/Boundary | root/child/readonly/parent mismatch/empty ID | containment; write permission; cross-scope `ScopeViolation` |
| Correlation/Metadata | child identity, mismatch, digest canonicalization, missing actor/key | stable IDs; trace excluded; body rejected; `CorrelationMismatch` |
| SourceReference/Snapshot/Availability | owner mismatch, scope mismatch, version freshness, partial/unknown | typed owner/version; stale/pending/unknown fail closed |
| SafeReason | body/secret/hidden rationale injection | `validate_body_free` rejects; source ref optional safe |
| IdempotencyReservation | reserve same/different digest, expiry, complete/replay | same digest replay; different conflict; no silent reuse |
| Trigger/Admission/Run | accepted/rejected/waiting/blocked; run create/terminal/unknown | accepted only creates run; terminal/unknown cannot overwrite |
| GoalPlan/Item/Progress | dependency closure, candidate ordering, terminal eligibility | missing dependency waiting/blocked; no method body |
| Context/Segment/Budget | ordering, per-source cap, freeze, expire/degrade | digest deterministic; frozen immutable; budget fail |
| WorkingMemory/Entry/Use | duplicate, compaction partition, frozen/degraded, use identity | no silent delete/durable write; expected version |
| ModelIntent/Turn/Submission | provider-neutral selection, frozen context, accepted/rejected/unknown | no route/secret/raw; unknown no action |
| ModelSemanticResult/Decision/Summary | finite variants, result mismatch, redaction | semantic mapping deterministic; body-free summary |
| Action/Candidate/Guard | model source, scope, guard version, pending owner | choice != execution; unknown not allowed |
| SideEffect/Attempt | record-before-submit, statuses, unknown fence, feedback match | no blind retry; effect class preserved |
| Delegation/Boundary/Budget | scope subset, depth, result once, parent independence | no member lifecycle; once-only incorporation |
| Feedback/Reflection | duplicate/late/out-of-order/mismatch, trigger/decision fence | immutable record; quarantine; no hidden reasoning |
| Checkpoint/Recovery | stable candidate, commit proof, unknown, decision immutability | prepared != committed; unknown no resume |
| Outcome | terminal proof/dispositions/one per run | delivery/ack cannot mutate; unknown explicit |
| Handoff/Gap | safe material, attempt/ack/gap source and no self-close | ack != acceptance; gap remains open without evidence |
| Projection/View | contiguous cursor, stale/current/degraded/visibility/redaction | rebuild only from history; stale not current |
| Config/Adapter/Job | profile/slot/limit/lease/cursor validation | no Ready; blocked seam; lost lease stops |

## 3. Port contract tests

| Port group | Fake setup | Independent assertions |
|---|---|---|
| Clock/ID/Digest | fixed clock; per-kind ID queue; deterministic digest | no ID reuse; forbidden body digest rejection; clock injected |
| UoW/Idempotency | in-memory transaction log with commit fail/unknown; reservation map | atomic enlist/rollback; replay/conflict; commit unknown surfaced |
| Lease | token/expiry/owner map | claim/renew/release; owner mismatch; expiry fencing |
| Run/Workspace/History | map store + version CAS + append log | expected version; strict sequence; history no update/delete; cursor |
| Decision/Action/Guard/Effect/Delegation | append/map stores | immutable append; unique identity; marker unknown; once-only child |
| Context/Memory/Source | source status matrix; candidate pages; versioned windows | stale/pending/unknown; body-free snapshots; compaction partition |
| Model/Turn | finite semantic result fake; accepted/rejected/unknown matrix | adapter route absent; result matching; unknown fence |
| Governance/Capability | imported view fake | formal denied/pending/unknown; no local truth writes |
| Tools/Sandbox | candidate/reject/unknown fake only | no execution/cleanup success; local commit-before-call |
| CheckpointCommit | commit proof/unknown/conflict fake | matching receipt only committed; reconcile same digest |
| Handoff/Publisher | ack/publish/reject/unknown fake | gap no self-close; snapshot stable; no acceptance |
| Projection/Outbox | history replay/store/cursor fake | current proof; stale/gap; exact payload replay |
| Inbox/JobState | event map; lease/cursor page fake | duplicate/late; page atomicity; cursor preserve |

## 4. Protocol schema tests

### 4.1 Commands

Every one of the 17 Command schemas receives a contract test with: valid construction; missing metadata; wrong schema; digest mismatch; forbidden body; same-key same-digest replay; same-key different-digest conflict; secondary type enum roundtrip; result reference roundtrip; public error mapping.

Command-specific assertions:

| Command | Additional assertions |
|---|---|
| Accept | non-accepted result has no run ref; accepted requires source/precondition |
| Control | resume checkpoint/fence; cancel not external cleanup |
| Progress | terminal candidate proof; dependency refs |
| Compose/Memory | candidate exclusion/use record; budget/working-only |
| Model | frozen context/digest; semantic-only |
| Action/Guard | model source; checked versions; no execution |
| Delegation/Feedback | child boundary/result once; ordering/quarantine |
| Checkpoint/Recovery | prepared/committed/unknown; no blind retry |
| Outcome/Handoff/Source | local-first; ack/gap; source body-free |

### 4.2 Queries

Each of 12 Query schemas has valid/missing field/schema/visibility/cursor/limit tests. Query service spy asserts zero UoW begin, zero mutation Port call and no external refresh. Each result checks `Current|Empty|Stale|Rebuilding|Degraded|NotVisible|Unknown` mapping for its read surface.

### 4.3 Events

Each of 6 inbound events has source owner/schema/correlation/order/digest/dedupe/late/mismatch tests and asserts event ack only after durable receipt. Each of 6 outbound payloads has body-free schema, commit-time snapshot, stable event ID/digest and publisher replay tests; no delivery/observed/acceptance assertion is allowed.

### 4.4 Jobs

Each of 7 Jobs has job metadata/profile/lease/cursor/page/count/report/replay tests. Lease loss, page conflict, commit unknown and partial item failures must preserve prior cursor and emit typed report posture. Tests assert no direct repository mutation outside application service.

## 5. Flow tests

| Flow group | Required test cuts |
|---|---|
| 17 Commands | handler dispatch; operation context; idempotency; read ordering; domain call; write set; UoW commit/rollback/unknown; external call ordering; result mapping |
| 12 Queries | visibility before read; independent repository surface; no-write; freshness/degraded/empty |
| 6 consumers | inbox reserve; source/ordering; duplicate/late/mismatch; local record; ack ordering; unknown |
| 6 outbound materializers | source fact commit; exact snapshot; schema/digest; pending publisher |
| 7 jobs | profile enablement; lease; page; per-item disposition; cursor/report commit; lease loss/replay |

## 6. State matrix tests

SM-01~18 each require one test module with one assertion per allowed transition, every illegal transition, stale expected version, replay identity, late/duplicate if applicable, unknown/manual fence and side-effect/history/outbox expectation. No global state-machine test may replace the 18 module tests.

## 7. Negative boundary tests

| Boundary | Assertion |
|---|---|
| Tools execution | Runtime cannot set `Completed` from submit/ack |
| Capability registry | Runtime cannot create identity/registry/exposure truth |
| Governance | Runtime cannot manufacture approval/policy |
| Sandbox | Runtime cannot own isolation policy/cleanup |
| Method Library | Runtime stores ref/summary only; no body |
| Durable memory | Runtime working-only; no retention/delete/rebuild owner |
| Model provider | no secret/route/quota/cost/raw response |
| Observability | observation candidate != observed/audit evidence |
| Artifact/marketplace/member/product | no body/verdict/listing/lifecycle/entry ownership |

## 8. Evidence boundary

This file contains planned assertions and fake behavior only. It does not contain test command output, report paths, run IDs, artifacts, evidence aliases, acceptance verdicts or readiness status.

## 9. Step gate

| Check | Result |
|---|---|
| every object group has independent invariant cuts | pass |
| every Port group has fake/error/transaction tests | pass |
| 17/12/6/6/7 protocol families have independent tests | pass |
| 18 states have independent matrix modules | pass |
| negative owner-boundary tests explicit | pass |

```text
step_16 = done
next_allowed_action = step_17_implementation_handoff
```
