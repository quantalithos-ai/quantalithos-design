# commit-01-a implementation ledger (planned)

| field | value |
|---|---|
| project | L5-console |
| boundary_id | `commit-01-a` |
| phase | `PH-01` |
| design_baseline | `not_fixed` |
| implementation_repo | `/home/aris/Projects/quantalithos-console` (not_created) |
| status | `blocked` |
| next_allowed_action | `wait_design` |
| planned_commit_message | `chore(console): establish package and config skeleton` |

## Required Reads

| document | required_section | status | notes |
|---|---|---|---|
| `03-详细设计.md` | §3～§4、§13 | pending | runtime, layout and dependency boundary |
| `04-配置设计.md` | §3～§12 | pending | four keys, profiles, strict startup loader |
| `05-测试方案.md` | §8～§9 | pending | config/static gate and roots |
| `06-验收标准.md` | §3、§6、§10 | pending | baseline, architecture and evidence boundary |
| `07-实施计划.md` | §3、§6～§8 | pending | current implementation plan |

## Allowed Scope

| type | path_or_rule | status |
|---|---|---|
| allowed_file | future target package/config manifest only | pending; target repo absent |
| allowed_rule | strict TypeScript/ESM package and four-key config skeleton | planned |
| forbidden_rule | no owner truth, DB, repository, projection, outbox, worker, job, BFF or private bus | active |
| forbidden_rule | no guessed framework/router/bundler/package manager or owner DTO | active |
| forbidden_rule | no implementation in design repository | active |

## Gate Matrix

| gate | status | evidence | next_if_failed |
|---|---|---|---|
| design_gate | blocked | target repo, exact contracts and immutable baseline absent | wait_design |
| scope_gate | pending | no target worktree | fix_gate_failure |
| worktree_gate | blocked | implementation repo not created | wait_design |
| build_gate | pending | no real package/build command | fix_gate_failure |
| test_gate | pending | no execution authorized | fix_gate_failure |
| evidence_gate | pending | no run/artifact/report/evidence | fix_gate_failure |
| commit_gate | pending | no staged files or authorization | fix_gate_failure |
| handoff_gate | pending | no hash/run/review | handoff |

## Blockers

| blocker_id | status | action |
|---|---|---|
| `BLK-CON-07-001` | open | wait for target implementation repository authority |
| `BLK-CON-07-002` | open | keep positive SDK/owner branch closed; do not invent schema |
| `BLK-CON-07-003` | open | fix immutable design/delivery/environment/dependency baseline |

## Commit / Handoff Record

| field | value |
|---|---|
| staged_files_checked | pending |
| required_checks | pending until target repo authority exists |
| committed_hash | pending; no commit exists |
| committed_message | pending |
| post_commit_status | pending |
| handoff_notes | Not eligible for implementation handoff; planned skeleton only |
