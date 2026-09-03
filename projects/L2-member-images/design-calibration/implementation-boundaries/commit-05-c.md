# commit-05-c implementation boundary ledger

> 设计期 planned boundary skeleton；不代表实现授权、代码存在或门禁通过。

## Boundary Header

| field | value |
|---|---|---|
| project | `L2-member-images` |
| boundary_id | `commit-05-c` |
| phase | `PH-05` |
| design_baseline | `planned` |
| implementation_repo | `/home/aris/Projects/quantalithos-member-images` |
| status | `planned` |
| last_gate | `GATE-15` / `not_run` |
| next_allowed_action | `wait_until_current` |
| current_recovery_point | `await-project-ledger-activation` |
| current blocker | MI-UP-001 |
| actual commit/hash/run | `none / not_started` |

## Required Reads

- formal `00-需求文档.md` through `07-实施计划.md` (formal source priority).
- `design-calibration/07_implementation_plan_step_05_phases_dependencies.md` and `07_implementation_plan_step_06_tasks_commit_boundaries.md`.
- `07_implementation_plan_step_07_test_acceptance_gates.md` and boundary-specific Step 8~12 sources.
- `03-详细设计.md`, `04-配置设计.md`, `05-测试方案.md`, `06-验收标准.md` sections named by this boundary.
- `standards/document/设计真相源闭环与可落码性标准.md` §九 and implementation ledger rules.

## One-sentence Increment

consumer gap/facade mapping。

## Allowed Scope

ConsumerHandoffGap/unavailable mapping。只允许建立与本 boundary 对应的 typed contract、pure rule、negative/no-write、marker、gap 或 planned tooling；不得扩大到后续 Phase。

## Forbidden Scope

manifest/confirmation；不得创建 owner body、container/process lifecycle、runtime loop、tool execution、external provider truth、outbound event、Artifact acceptance、consumer confirmation 或 readiness。

## Planned Batches

| batch | planned action | required local check | state |
|---|---|---|---|
| A | public contract、support carrier、fixture shape | type/shape/body-free check | `planned` |
| B | domain/application guard or conservative mapper | state/no-write/error check | `planned` |
| C | infra/entry/test/script mapping within boundary | dependency/path/redaction check | `planned` |

## Required Checks

| check | command_or_evidence | status | notes |
|---|---|---|---|
| design gate readout | formal 00~07, current boundary and blocker records | `pending` | wait for project-ledger activation |
| worktree baseline | target worktree status, branch, HEAD and user-change inventory | `pending` | no worktree fact recorded |
| dependency boundary | Core/sibling dependency classification and boundary-specific check | `pending` | no implementation command run |
| format/build/test | future target-repo commands | `pending` | no implementation command run |
| evidence path/pairing | future same-run raw/report/EV contract | `not_generated` | no evidence instance |
| whitespace/staged scope | future diff checks and allowed scope | `pending` | no staged diff |

## Gate Contract

| gate | required assertion | current result |
|---|---|---|
| Design Gate | fields、DTO、support carrier、state、ref identity、validation truth and phase boundary are traceable | `pending` |
| Scope Gate | only allowed scope; no direct store/transport/owner body leakage | `pending` |
| GATE-15 | corresponding TC/suite/check and failure action from formal 07 | `not_run` |
| Commit Gate | exact diff, message, identity and all required checks are recorded | `pending` |
| Handoff Gate | post-status, baseline, blocker and next boundary are recorded | `not_started` |

## Gate Matrix

| gate | status | evidence | next_if_failed |
|---|---|---|---|
| design_gate | pending | planned; awaits project-ledger activation and boundary review | wait_design |
| scope_gate | pending | planned; awaits current boundary worktree review | fix_gate_failure |
| worktree_gate | pending | planned; no worktree fact recorded | fix_gate_failure |
| build_gate | pending | planned; no implementation command run | fix_gate_failure |
| test_gate | pending | planned; no test command run | fix_gate_failure |
| evidence_gate | pending | planned; no raw/report/evidence instance | fix_gate_failure |
| commit_gate | pending | planned; no staged diff or commit | fix_gate_failure |
| handoff_gate | pending | planned; no handoff exists | handoff |

## Test and Evidence Contract

Planned test selectors and EV families come from formal `05-测试方案.md` and Step 7. Any future evidence must use one non-empty `<run_id>`, raw root `artifacts/test/<run_id>/`, report root `reports/runs/<run_id>/`, and same-run pairing. Current artifact/report/evidence state is `not_generated`; no static table, stdout, `latest` or cross-run merge is valid.

## Blocker and Recovery

Current blocker posture: **MI-UP-001**. If a field, port, state, result-ref, recovery edge, owner contract or artifact schema is missing, stop with `blocked / wait_design`; do not invent a fallback, cache, lease, TTL, ACK, bare digest, event, scheduler or private type. Recovery requires an owning formal-document update, a new immutable baseline and repeated Design/Scope/Gate review.

## Activation Rule

This file is a pre-created ledger only. It may become current only when the project-level `implementation_execution_ledger.md` explicitly advances to `commit-05-c`. Future boundaries remain `planned / wait_until_current`; file existence does not authorize implementation.

## Current Stop Review

| item | result |
|---|---|---|
| implementation code | `not_started` |
| tests/run/artifacts/reports | `not_started / not_generated` |
| acceptance/verdict/signoff/readiness | `not_entered` |
| commit | `none` |

**Boundary status: `planned`; next action: `wait_until_current`.**

## Worktree Gate

| check | status | required fact |
|---|---|---|
| target repository | `pending` | exact implementation worktree, branch, HEAD and user-change inventory |
| design baseline | `pending` | immutable formal 00~07 and boundary calibration identity |
| dependency cut | `pending` | active sibling compile dependency remains zero unless MI-UP-004 is closed |
| current activation | `wait_until_current` | only project ledger may activate this boundary |

## Commit Gate

| item | status | rule |
|---|---|---|
| design/scope/build/test/evidence gates | `pending` | all required checks must have real evidence before commit |
| staged diff | `pending` | only this boundary allowed scope; no unrelated user files |
| commit identity | `none` | no hash or commit exists in design phase |
| message | `planned` | implementation repo uses English `type(scope): subject` and fixed footer |

## Handoff Gate

| item | status | rule |
|---|---|---|
| post-commit status/hash | `not_started` | record only after a real implementation commit |
| test/report/evidence refs | `not_generated` | same-run raw/report pair; no static pass |
| blocker and next boundary | `pending` | update project ledger before successor activation |
| acceptance handoff | `not_entered` | 06 authority reviews drafts; implementation agent cannot sign off |

## Implementation Ledger Update

No implementation-side ledger, code, test, run, artifact, report, evidence, digest, verdict, signoff or readiness is created by this design skeleton. When this boundary becomes current, the implementation agent must update the project-level ledger first, then record real preflight facts and stop on any unresolved blocker.

## Blockers

| blocker_id | status | blocking_reason | requested_design_closure | next_allowed_action |
|---|---|---|---|---|
| BOUNDARY-NOT-CURRENT | `planned` | project ledger has not activated this boundary | predecessor handoff and explicit project-ledger advancement | `wait_until_current` |

## Commit Record

| field | value |
|---|---|
| planned_commit_message | `not_set_until_boundary_review` |
| staged_files_checked | `not_started` |
| commit_message_checked | `not_started` |
| committed_hash | `none` |
| committed_message | `none` |
| post_commit_status | `not_started` |
