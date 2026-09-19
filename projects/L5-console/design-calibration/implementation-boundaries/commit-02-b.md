# commit-02-b implementation ledger (planned)

| field | value |
|---|---|
| project | L5-console |
| boundary_id | `commit-02-b` |
| phase | `PH-02` |
| design_baseline | `not_fixed` |
| implementation_repo | `/home/aris/Projects/quantalithos-console` (not_created) |
| status | `planned` |
| next_allowed_action | `wait_until_current` |
| planned_commit_message | `feat(console): establish guarded navigation shell` |

## Required Reads

`03-详细设计.md` §5/§8/§9；`05-测试方案.md` NAV/A11Y；`06-验收标准.md` AC-CON-002；`07-实施计划.md` §5～§7。状态：`pending / wait_until_current`。

## Allowed Scope

| type | path_or_rule | status |
|---|---|---|
| allowed_file | future `src/navigation/**` and route/semantic tests | planned |
| allowed_rule | guarded selection/history/cleanup and semantic route binding | planned |
| forbidden_rule | no route-derived permission, no topic owner query, no business readiness | active |

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
| required_checks | module-flow, semantic-a11y, AC-CON-002 (future) |
| committed_hash | pending; no commit exists |
| committed_message | pending |
| post_commit_status | pending |
| handoff_notes | Wait until `commit-02-a` is complete |
