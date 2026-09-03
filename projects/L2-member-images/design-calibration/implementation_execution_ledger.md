# L2-member-images implementation execution ledger

> 这是 future implementation 的项目级台账，不是实现日志、测试报告或验收结论。
> 当前状态只允许记录 planned / blocked / waiting；本文件不创建目标仓、不记录真实 hash/run/artifact/report/evidence/verdict/signoff/readiness。

## Current Implementation State

| field | value |
|---|---|
| project | `L2-member-images` |
| design_repo | `/home/aris/Projects/quantalithos-design` |
| implementation_repo | `/home/aris/Projects/quantalithos-member-images` |
| current_design_baseline | `not_fixed_until_handoff` |
| current_boundary | `commit-01-a` |
| gate_status | `blocked` |
| gate_reason | target implementation repository is absent; B01/B02 and MI-UP-004 remain open |
| next_allowed_action | `wait_design` |
| current_recovery_point | `commit-01-a / target-repo-and-baseline-preflight` |
| implementation_status | `not_started` |
| acceptance_status | `not_entered` |
| last_updated_by | `design calibration agent` |
| last_updated_at | `2026-09-03` |

## Authority and recovery order

Every future continuation must read, in order:

1. this project ledger;
2. `07_implementation_plan_calibration_flow.md`;
3. the current boundary ledger under `implementation-boundaries/`;
4. formal `00-需求文档.md` through `07-实施计划.md` and the boundary-specific calibration sources;
5. the actual target worktree status and user-change inventory.

If these sources disagree, stop at `blocked / wait_design`, record the conflict and rebaseline the owning formal document. An implementation agent may not add a field, port, status, config key, event, recovery edge or phase boundary to make code compile.

## Boundary Ledger

| boundary | phase | design_baseline | status | last_gate | next_allowed_action | notes |
|---|---|---|---|---|---|---|
| `commit-01-a` | PH-01 | `not_fixed_until_handoff` | `blocked` | `GATE-01` | `wait_design` | current; target repo absent |
| `commit-01-b` | PH-01 | `planned` | `planned` | `not_run` | `wait_until_current` | waits for `01-a` handoff |
| `commit-01-c` | PH-01 | `planned` | `planned` | `not_run` | `wait_until_current` | waits for `01-b` handoff |
| `commit-02-a` | PH-02 | `planned` | `planned` | `not_run` | `wait_until_current` | definition/mapping |
| `commit-02-b` | PH-02 | `planned` | `planned` | `not_run` | `wait_until_current` | static assembly |
| `commit-02-c` | PH-02 | `planned` | `planned` | `not_run` | `wait_until_current` | revision/derivation |
| `commit-03-a` | PH-03 | `planned` | `planned` | `not_run` | `wait_until_current` | build contracts |
| `commit-03-b` | PH-03 | `planned` | `planned` | `not_run` | `wait_until_current` | conservative outcome |
| `commit-03-c` | PH-03 | `planned` | `planned` | `not_run` | `wait_until_current` | bounded selectors |
| `commit-04-a` | PH-04 | `planned` | `planned` | `not_run` | `wait_until_current` | provenance/gate |
| `commit-04-b` | PH-04 | `planned` | `planned` | `not_run` | `wait_until_current` | Artifact gap |
| `commit-04-c` | PH-04 | `planned` | `planned` | `not_run` | `wait_until_current` | qualification facade |
| `commit-05-a` | PH-05 | `planned` | `planned` | `not_run` | `wait_until_current` | availability/history |
| `commit-05-b` | PH-05 | `planned` | `planned` | `not_run` | `wait_until_current` | local supply/read |
| `commit-05-c` | PH-05 | `planned` | `planned` | `not_run` | `wait_until_current` | consumer gap |
| `commit-06-a` | PH-06 | `planned` | `planned` | `not_run` | `wait_until_current` | query/view |
| `commit-06-b` | PH-06 | `planned` | `planned` | `not_run` | `wait_until_current` | projection freshness |
| `commit-06-c` | PH-06 | `planned` | `planned` | `not_run` | `wait_until_current` | API query mapping |
| `commit-07-a` | PH-07 | `planned` | `planned` | `not_run` | `wait_until_current` | inbound markers |
| `commit-07-b` | PH-07 | `planned` | `planned` | `not_run` | `wait_until_current` | bounded jobs |
| `commit-07-c` | PH-07 | `planned` | `planned` | `not_run` | `wait_until_current` | logical entry wiring |
| `commit-08-a` | PH-08 | `planned` | `planned` | `not_run` | `wait_until_current` | fixture/gate shell |
| `commit-08-b` | PH-08 | `planned` | `planned` | `not_run` | `wait_until_current` | report/evidence shell |
| `commit-08-c` | PH-08 | `planned` | `planned` | `not_run` | `wait_until_current` | smoke/handoff drafts |

`planned` means a future identity only. No future row is an authorization to edit code; the project ledger may designate exactly one current boundary at a time.

## Open Blockers

| blocker_id | affected boundary | source | status | required action | next action |
|---|---|---|---|---|---|
| `DDD-S9-B01` | all mutation Command/Job | formal 03 §17 | `blocked` | close canonical input and mutation UoW | wait design; keep zero-effect |
| `DDD-S9-B02` | all mutation Command/Job | formal 03 §17 | `blocked` | close stored result/result-ref/replay body | wait design; do not mint result |
| `DDD-S11-B03` | `commit-05-a` | formal 03 §17 | `blocked` | close terminal availability persistence | wait design; no terminal write |
| `DDD-S13-OPEN-01` | `03-b`,`07-b` | formal 03 §17 | `blocked` | close in-flight/Reserved recovery | wait design; no lease/TTL |
| `DDD-S13-OPEN-02` | `03-b`,`07-b` | formal 03 §17 | `blocked` | close channel/name namespace | wait design; no global raw key |
| `PF-UNAVAILABLE-RECOVERY` | `06-b`,`07-b` | formal 03/06 | `blocked` | define formal projection recovery edge | keep `Unavailable` |
| `MI-UP-001` | `05-c`,`08-c` | sibling pending | `blocked` | member-service consumer contract | retain `ConsumerHandoffGap` |
| `MI-UP-002` | `02-b` | sibling pending | `blocked` | member component release/compatibility | typed ref/gap only |
| `MI-UP-003` | `02-a` | method-library pending | `blocked` | Role-to-image mapping authority | ref-only/gap |
| `MI-UP-004` | `01-a` | L0-core pending | `blocked` | shared carrier compile contract | active dependency remains zero |
| `MI-UP-005` | `07-a` | event authority pending | `blocked` | inbound event schema/authority | marker-only, `accepted_input=false` |
| `MI-UP-006` | `02-b` | seed/template pending | `blocked` | policy/memory/workspace seed owner | static ref/placement only |
| `MI-UP-007` | `04-b` | L1-artifact pending | `blocked` | Artifact handoff schema | no Artifact acceptance |
| `MI-UP-008` | `02-b` | Sandbox pending | `blocked` | hardened base/Sandbox boundary | no base readiness |
| `MI-UP-009` | no outbound boundary | event authority pending | `blocked` | outbound event authority | `NoneAuthorized` |
| `Q-MI-001~004` | `02~05`,`08-c` | sibling/owner questions | `blocked` | close exact owner/schema/oracle | blocked/gap/unknown |

## Gate and artifact status

| item | status | rule |
|---|---|---|
| `GATE-01~24` | `planned / not_run` | one Gate per boundary; no static pass |
| TC/EV families | `planned` | 05/06 names are identities, not instances |
| raw artifacts | `not_generated` | only future fixed `artifacts/test/<run_id>/...` |
| run reports | `not_generated` | only future `reports/runs/<run_id>/...` |
| acceptance drafts | `not_created` | future `reports/acceptance/*`, review-required |
| commit hashes | `none` | no commit has been made |
| signoff/readiness | `not_entered` | only formal 06 authority may decide |

## Allowed state transitions

```text
planned -> current/pending -> pass -> handoff -> start_next_boundary
                         \-> blocked/wait_design
                         \-> failed/fix_gate_failure
                         \-> not_evaluable (new run required)
```

`blocked` cannot transition directly to `pass`; it requires an owning design/owner/environment fix, a new immutable baseline and a repeated gate review. `wait_until_current` cannot be changed in a boundary file alone.

## Current recovery instruction

Current action is `wait_design`: do not create or modify `/home/aris/Projects/quantalithos-member-images`, do not add Core or sibling path dependencies, do not run tests, do not generate artifacts/reports, and do not commit. When the target repository and baseline become available, reopen `commit-01-a`, record exact preflight facts, and stop again if any design or dependency blocker remains.

## Completion note

This ledger is complete as a design-period implementation handoff. It does not claim implementation completion, acceptance, release, consumer confirmation, artifact digest, evidence, verdict, signoff or readiness.
