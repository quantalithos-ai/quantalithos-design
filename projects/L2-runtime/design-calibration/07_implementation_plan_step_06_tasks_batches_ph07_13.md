# Step 6 Annex B. PH-07~PH-13 boundary task and batch contracts

> Parent: `07_implementation_plan_step_06_tasks_commit_boundaries.md`
> Fact boundary: all rows are `planned/blocked/waiting`; no implementation, run, artifact, report, evidence or commit is asserted.
> Covered identities: `commit-07-a` through `commit-13-c`, `GATE-19` through `GATE-39`.

## 1. Boundary contract registry

| Boundary | Allowed scope | Forbidden scope | Required design/test anchors | Gate / blocker |
|---|---|---|---|---|
| `commit-07-a` | action domain and guard/attempt state | tools execution/registry/approval/sandbox truth | 03 CAP-07/SM-07/08; 05 action cuts | GATE-19; UP-001~003/007 |
| `commit-07-b` | five-owner guard application | owner mutation/direct call | 03 guard flow; 05 BND-001~004 | GATE-20; fail-closed |
| `commit-07-c` | action submission attempt/SM-31 | execution/cleanup/Observed | 03 action attempt; 06 VF | GATE-21; UP-001~003/007 |
| `commit-08-a` | delegation boundary/budget/request/result domain | member lifecycle/container/image | 03 CAP-08/SM-09; 05 delegation/security | GATE-22; UP-001/003/007 |
| `commit-08-b` | child result receipt/order/once | double incorporation/shared mutable context | 03 delegation/event; 05 INE-003/Q08 | GATE-23 |
| `commit-08-c` | feedback incorporation/reflection decision | method body/old truth rewrite | 03 CAP-09/SM-10/21/24; 05 CAP-004 | GATE-24 |
| `commit-09-a` | checkpoint candidate/prepared/fence | physical commit/readiness | 03 CAP-10/SM-11; 05 checkpoint | GATE-25; CP-001 |
| `commit-09-b` | matching receipt/CommitUnknown/recovery decision | blind resume/retry | 03 C13/14/TX; 05 fault | GATE-26; CP-001 |
| `commit-09-c` | continuation/resume/reconcile jobs | scheduler/product lifecycle | 03 J04/05/SM-12/18; 05 jobs | GATE-27; CP-001 |
| `commit-10-a` | local outcome/terminal proof | downstream status mutation | 03 CAP-11/SM-13; 05 outcome | GATE-28 |
| `commit-10-b` | handoff material/attempt/gap | delivery/Observed/evidence truth | 03 CAP-12/SM-14; 05 BND-008/009 | GATE-29; UP-002/006/007 |
| `commit-10-c` | ACK consumer/gap reconciliation | self-close/mismatch promotion | 03 E06/J06; 05 ack/reconcile | GATE-30; UP-002/006/007 |
| `commit-11-a` | projection state/rebuild/query | domain repair/write-back | 03 Q12/J01/SM-16; 05 projection | GATE-31 |
| `commit-11-b` | invalidation and immutable fact/decision event | Governance/source mutation | 03 E05/O01/02; 05 event | GATE-32; UP-006/007 |
| `commit-11-c` | immutable outbox publisher/job | broker/delivery/Observed backend | 03 J07/O; 05 publisher | GATE-33; UP-002/006/007 |
| `commit-12-a` | strict config roots/source/profile/snapshot | secret/body/default/partial publish | 04 §3~11; 05 CFG; 06 config gates | GATE-34; LANG/UP blockers |
| `commit-12-b` | builder, 13 slot and 7 job bindings, fake isolation | `Ready`, provider/DB choice, lifecycle | 03 §13; 04 slot/builder; 05 PRT/ENT | GATE-35; ENTRY-001 |
| `commit-12-c` | API/worker/jobs facade entries | direct I/O/transport/member lifecycle | 03 entry; 05 denominator/entry | GATE-36; ENTRY-001 |
| `commit-13-a` | 37 CUT, 177 TC/EV, 8 suite manifests and raw writers | static evidence, empty selector, project-nested path | 05 §3~9/13; 06 baseline | GATE-37; IMPL-001 |
| `commit-13-b` | 9 checks, reports and mechanical evidence index | cross-run/static/handwritten report | 05 §9/13; 06 EG/VF | GATE-38; no run yet |
| `commit-13-c` | full local aggregation and four review drafts | verdict/signoff/risk acceptance/readiness | 05/06 handoff chapters | GATE-39; positive blocked |

## 2. Stable task and batch registry

| Boundary | IMPL-1 | IMPL-2 | IMPL-3 | BATCH-1 | BATCH-2 | BATCH-3 |
|---|---|---|---|---|---|---|
| 07-a | action/guard carriers | attempt/marker states | contract/state tests | carriers | states | tests |
| 07-b | owner guard inputs | guard service/Port reads | fail-closed tests | inputs | service | tests |
| 07-c | submission identity | record-before-call service | Unknown/replay tests | identity | service | tests |
| 08-a | child scope/budget DTOs | delegation state/factory | subset/isolation tests | DTOs | domain | tests |
| 08-b | child request/receipt | consumer/UoW once | late/duplicate tests | receipt | consumer | tests |
| 08-c | feedback/order DTOs | reflection/incorporation service | CAP aggregate tests | DTOs | service | tests |
| 09-a | checkpoint candidate | Prepared/fence domain | prepared/illegal tests | candidate | state | tests |
| 09-b | commit request/receipt | recovery decision service | mismatch/Unknown tests | request | service | tests |
| 09-c | continuation/job DTOs | bounded resume/reconcile | lease/cursor tests | DTOs | jobs | tests |
| 10-a | terminal proof | outcome service/query | uniqueness tests | proof | service | tests |
| 10-b | handoff material | attempt/gap service | body/status tests | material | service | tests |
| 10-c | ACK receipt | gap job/consumer | no-self-close tests | receipt | jobs | tests |
| 11-a | projection carriers | rebuild/query service | cursor/no-write tests | carriers | service | tests |
| 11-b | invalidation envelopes | event materializers | order/no-writeback tests | envelopes | materializer | tests |
| 11-c | publisher job DTO | outbox publisher/fake | digest/Unknown tests | DTOs | publisher | tests |
| 12-a | config raw/typed roots | validation/snapshot | schema/redaction tests | raw | validators | tests |
| 12-b | builder requirements | slot/job binding/fakes | profile/dependency tests | requirements | builder | tests |
| 12-c | entry registries | facade handlers | denominator/no-write tests | registry | handlers | tests |
| 13-a | case/EV/suite manifest | runner/raw writer | path/count/failure tests | manifest | runner | tests |
| 13-b | check/report DTOs | generators/index | pairing/static/redaction tests | DTOs | generators | tests |
| 13-c | aggregate gate | handoff draft generators | same-run/review tests | gate | drafts | tests |

## 3. Boundary-specific closure and stop review

| Boundary group | Required closure | Stop condition |
|---|---|---|
| PH-07 | five-owner guard source/freshness, record-before-call, SM-31, Tool/Sandbox fail-closed | missing/unknown guard or direct call => hard stop/VF direction |
| PH-08 | subset/budget/depth, receipt-before-ACK, once-only feedback/reflection | lifecycle creep or duplicate incorporation => `wait_design` |
| PH-09 | Prepared/Committed/Unknown distinct, matching receipt, bounded cursor/lease | physical positive absent is blocked, never pass |
| PH-10 | local outcome first, body-free material, ACK/gap identity | external status cannot promote local truth |
| PH-11 | projection history-only, immutable event snapshot, publisher attempt | route/delivery/Observed remains seam |
| PH-12 | whole candidate config, 13 slots, 7 jobs, no Ready/TestFake leak, facade-only entry | any denominator or dependency drift blocks |
| PH-13 | same-run raw/report/index, exact counts, failed/blocked retained, draft-only handoff | missing/empty/cross-run/static evidence blocks |

## 4. Experience applicability matrix

Every boundary must mark the following as `pass-designed`, `not_applicable` with reason, or `blocker`: typed ref/metadata source; DTO construction; factory/state transition; Port/read-write/UoW; idempotency/replay; query/event/job cursor; config/evidence materialization; dependency owner; phase boundary; English Rustdoc. `L2R-LANG-002` applies to every Rust source boundary until formal 03 is corrected.

## 5. Annex stop review

| Check | Result |
|---|---|
| Covered boundaries | 21 (`commit-07-*` through `commit-13-*`) |
| Covered IMPL/BATCH | 63 / 63 |
| Gate identity | GATE-19~GATE-39, one per boundary |
| Loop Kernel omitted | no; PH-03 is in Annex A |
| Old 12/35/109 identities reused | no; only historical rejection references remain |
| Implementation/run/evidence facts | none |

```text
annex_b = complete
covered_boundaries = 21
covered_impl = 63
covered_batches = 63
actual_implementation = none
```
