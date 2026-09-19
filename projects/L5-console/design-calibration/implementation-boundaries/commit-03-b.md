# commit-03-b implementation ledger (planned)

| field | value |
|---|---|
| project | L5-console |
| boundary_id | `commit-03-b` |
| phase | `PH-03` |
| design_baseline | `not_fixed` |
| implementation_repo | `/home/aris/Projects/quantalithos-console` (not_created) |
| status | `planned` |
| next_allowed_action | `wait_until_current` |
| planned_commit_message | `feat(console): add core query read seam` |

## Required Reads

`03-详细设计.md` §6～§8；`05-测试方案.md` VIEW/QUERY/ARCH；`06-验收标准.md` AC-CON-003、IFG-CON-002；`07-实施计划.md` §6～§7。状态：`pending / wait_until_current`。

## Allowed Scope

| type | path_or_rule | status |
|---|---|---|
| allowed_file | future Core Query read adapters/call ledger/focused tests | planned |
| allowed_rule | first four Core Query presentations, zero-write observation | planned |
| forbidden_rule | no repository/DB/projection/cache write, no owner body or guessed DTO | active |
| forbidden_rule | no Topic Query or command binding | active |

## Gate Matrix

| gate | status | evidence | next_if_failed |
|---|---|---|---|
| design_gate | pending |  | wait_design |
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
| required_checks | query no-write, port-adapter, IFG-CON-002 (future) |
| committed_hash | pending; no commit exists |
| committed_message | pending |
| post_commit_status | pending |
| handoff_notes | Wait until `commit-03-a` is advanced |
