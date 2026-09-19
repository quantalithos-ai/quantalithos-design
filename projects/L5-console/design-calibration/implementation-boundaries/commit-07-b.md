# commit-07-b implementation ledger (planned)

| field | value |
|---|---|
| project | L5-console |
| boundary_id | `commit-07-b` |
| phase | `PH-07` |
| design_baseline | `not_fixed` |
| implementation_repo | `/home/aris/Projects/quantalithos-console` (not_created) |
| status | `planned` |
| next_allowed_action | `wait_until_current` |
| planned_commit_message | `feat(console): bind approved formal adapters` |

## Required Reads

`03-详细设计.md` §6/§7/§8/§13；`05-测试方案.md` ADAPTER/COMPOSITION/CONSISTENCY；`06-验收标准.md` IFG-CON-001/006/007、AR-CON-001/002/007/010；`07-实施计划.md` §6～§8。状态：`pending / wait_until_current`。

## Allowed Scope

| type | path_or_rule | status |
|---|---|---|
| allowed_file | future approved narrow formal adapters and parity/negative tests | planned |
| allowed_rule | only exact contract-backed query/command/reconcile/link/activation mapping | planned |
| forbidden_rule | no guessed DTO/path/error/idempotency, private sibling imports, owner body or second truth | active |

## Gate Matrix

| gate | status | evidence | next_if_failed |
|---|---|---|---|
| design_gate | blocked | exact owner/SDK query/command/result/ref contracts pending | wait_design |
| scope_gate | pending |  | fix_gate_failure |
| worktree_gate | pending |  | fix_gate_failure |
| build_gate | pending |  | fix_gate_failure |
| test_gate | pending |  | fix_gate_failure |
| evidence_gate | pending |  | fix_gate_failure |
| commit_gate | pending |  | fix_gate_failure |
| handoff_gate | pending |  | handoff |

## Commit / Handoff Record

| field | value |
|---|---|
| staged_files_checked | pending |
| required_checks | adapter parity, controlled composition, concurrency/race (future) |
| committed_hash | pending; no commit exists |
| committed_message | pending |
| post_commit_status | pending |
| handoff_notes | Current status is `blocked_for_positive`; planned title is not a binding |
