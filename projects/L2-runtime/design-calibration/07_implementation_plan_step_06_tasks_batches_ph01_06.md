# Step 6 Annex A. PH-01~PH-06 boundary task and batch contracts

> Parent: `07_implementation_plan_step_06_tasks_commit_boundaries.md`
> Fact boundary: all rows are `planned/blocked/waiting`; no implementation, run, artifact, report, evidence or commit is asserted.
> Covered identities: `commit-01-a` through `commit-06-c`, `GATE-01` through `GATE-18`.

## 1. Per-boundary schema

Every boundary below has exactly three `IMPL` tasks and three matching `BATCH` units. `IMPL` names the implementation obligation; `BATCH` names the smallest reviewable writing unit. A future skeleton must copy the row's scope and may narrow it only after a controlled design reopen.

| Boundary | Allowed scope | Forbidden scope | Required reads | Gate / blocker |
|---|---|---|---|---|
| `commit-01-a` | workspace manifest, member manifests, lib/bin shells, dependency scan | business DTO, shadow Core, runtime framework | 03 §3~4; Step 3 tool/layout reads | GATE-01; `L2R-IMPL-001`, `L2R-LANG-001/002` |
| `commit-01-b` | IDs/refs/scope/metadata modules and contract tests | local duplicate Core types, provider/body fields | 03 §6.1/7.1; Core source candidate | GATE-02; Core pending |
| `commit-01-c` | reason/error/digest/operation context and deterministic tests | service flow, repository, external adapter | 03 §6.2/11; Rust coding standard | GATE-03; `L2R-LANG-002` |
| `commit-02-a` | Port traits, record/version/cursor carriers, conformance fakes | generic `save`, business aggregate mutation, product clients | 03 §6.8/10; PRT-002/003 | GATE-04; predecessor |
| `commit-02-b` | UoW/CAS/inbox/outbox/idempotency local stores and journals | LWW, partial commit, broker/DB choice | 03 §10~13; TX-001/003~006/009 | GATE-05; SP-L2R-002 |
| `commit-02-c` | Unknown/fence/lease/page/projection fakes and fault tests | blind retry, cursor skip, scheduler product | 03 SM-18/TX; 05 fault/concurrency | GATE-06; physical product pending |
| `commit-03-a` | loop cursor/snapshot/activation/step contracts and SM-25~27 | capability admission, recursive dispatch, external calls | 03 §5.3/§6.4/§9.5; 05 CUT-02/28 | GATE-07; `L2R-LANG-002` |
| `commit-03-b` | wakeup/continuation/yield/reservation state and SM-28~30 | scheduler product, recursive self-wakeup, multi-service step | 03 loop flows/SM-25~30; 05 CUT-02/16/32 | GATE-08; `SP-L2R-002` |
| `commit-03-c` | closed next-operation planner and T1/T2/T3 loop service | admission policy, model/provider call, action execution | 03 loop service/Port flows; 05 CUT-02/21/28 | GATE-09; `L2R-LANG-002` |
| `commit-04-a` | admission/run/goal-plan contracts, aggregates and SM-01~03/19~21 | loop recursion, Governance/Method body, context/model/action calls | 03 CAP-02/03, §6~9; 05 construction cuts | GATE-10; `L2R-UP-008` |
| `commit-04-b` | accepted-only admission/control services, UoW/outbox/replay | nonaccepted run creation, policy mutation, query writes | 03 C01/C02 flows; 05 service/TX | GATE-11; source closure |
| `commit-04-c` | progress/history/query services and facade mapping | projection repair, model/action calls, hidden progress writes | 03 C03/Q01~03; 05 query/CAP-01 | GATE-12; zero-write |
| `commit-05-a` | source snapshot/context composition contracts and SM-04/15 | durable body/index, provider materialization, current substitution | 03 CAP-04/05, C04/C17/Q04; 04 source roots | GATE-13; `L2R-UP-005` |
| `commit-05-b` | working memory/window/use/exclusion/compaction services | durable memory lifecycle, owner writes, duplicate use | 03 C05/Q05; 05 memory cuts; 04 working root | GATE-14; `L2R-UP-005` |
| `commit-05-c` | E04 consumer, J02/J03 bounded page runners and entry mapping | scheduler/container lifecycle, durable rebuild, early ACK | 03 event/job flows; 05 worker/jobs | GATE-15; lease/source pending |
| `commit-06-a` | model intent/binding/materialization/turn/result contracts and SM-06/22/23 | provider route/secret/quota/cost/raw response | 03 CAP-06/C06/07/E01; 04 model root | GATE-16; `L2R-UP-004` |
| `commit-06-b` | two-UoW model submission service, stable attempt, blocked adapter | provider SDK, blind retry, raw body persistence | 03 StartModelTurn/TX; 05 BND-007 | GATE-17; `L2R-UP-004` |
| `commit-06-c` | result classification, E01 consumer, Q06 safe view | late rewrite, Observed/backend, provider truth | 03 classify/event/query; 05 CAP-003/SEC | GATE-18; `L2R-UP-004` |

## 2. Boundary task registry

| Boundary | IMPL-1 | IMPL-2 | IMPL-3 | BATCH-1 | BATCH-2 | BATCH-3 |
|---|---|---|---|---|---|---|
| 01-a | exact Cargo workspace/member set | crate lib/bin shells | dependency/name static checks | manifests | shells | checks |
| 01-b | typed ID/ref newtypes | scope/metadata carriers | roundtrip/body-free tests | contracts | metadata | tests |
| 01-c | reason/error enums | digest/context ports | deterministic/redaction tests | errors | ports | tests |
| 02-a | record/version types | repository/Port methods | conformance negative fakes | records | ports | fake tests |
| 02-b | UoW/write-set types | CAS/inbox/outbox/idempotency stores | commit/replay/fault tests | UoW | stores | tests |
| 02-c | Unknown/fence types | lease/page/cursor fakes | concurrency journals | fences | lease | fault tests |
| 03-a | loop cursor/snapshot/activation carriers | state factories and epoch guards | loop state tests | carriers | state | tests |
| 03-b | wakeup/continuation/yield inputs | reservation and lease-aware service | lost-wakeup/spin tests | inputs | service | tests |
| 03-c | planner/step envelopes | T1/T2/T3 loop service | one-service/no-progress tests | envelopes | planner | tests |
| 04-a | admission/run/plan DTOs | aggregate/state factories | accepted-only/state tests | DTOs | state | tests |
| 04-b | admission/control inputs | application UoW flows | rejected/replay tests | inputs | services | tests |
| 04-c | progress/history result | query/facade mapping | zero-write/visibility tests | result | queries | tests |
| 05-a | source/context DTOs | snapshot/composition domain | freshness/body-free tests | DTOs | domain | tests |
| 05-b | working memory records | use/compaction services | working-only/dedup tests | records | service | tests |
| 05-c | event/job carriers | bounded consumer/runners | ACK/lease/cursor tests | carriers | runners | tests |
| 06-a | model DTO/state | binding/materialization domain | provider-field negatives | DTOs | state | tests |
| 06-b | submission identity | two-UoW service/fake | Unknown/no-retry tests | identity | service | tests |
| 06-c | classification/result views | E01/Q06 mapping | late/redaction tests | mapper | entry | tests |

## 3. Stop review and experience applicability

For each row, the design reviewer must record: `field/DTO`, `factory/state`, `Port/read-write`, `UoW/idempotency`, `query/event/job`, `dependency/owner`, `phase boundary`, and `Rustdoc` applicability. `not_applicable` requires a reason; any missing source becomes `blocked / wait_design`.

| Boundary group | Stop-review conclusion |
|---|---|
| PH-01 | `pass-designed`; activation remains blocked by target repo, Core compatibility and `L2R-LANG-002` |
| PH-02 | `pass-designed`; local semantic kernel only, no product readiness |
| PH-03 | `pass-designed`; cursor/activation/wakeup/planner/T1-T3 are one loop boundary, no recursive dispatch or external call |
| PH-04 | `pass-designed`; accepted-only admission/run/plan and query zero-write are independent |
| PH-05 | `pass-designed`; source/context and working memory stay ref/body bounded, durable positive blocked |
| PH-06 | `pass-designed`; provider-neutral model submission is Unknown-fenced, provider qualification blocked |
| PH-07 | `pass-designed`; action call remains downstream seam, fail-open is veto direction |

```text
annex_a = complete
covered_boundaries = 18
covered_impl = 54
covered_batches = 54
actual_implementation = none
```
