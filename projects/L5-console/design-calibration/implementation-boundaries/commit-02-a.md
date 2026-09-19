# commit-02-a implementation ledger (planned)

| field | value |
|---|---|
| project | L5-console |
| boundary_id | `commit-02-a` |
| phase | `PH-02` |
| design_baseline | `not_fixed` |
| implementation_repo | `/home/aris/Projects/quantalithos-console` (not_created) |
| status | `planned` |
| next_allowed_action | `wait_until_current` |
| planned_commit_message | `feat(console): establish guarded access shell` |

## Required Reads

`03-详细设计.md` §5/§6/§8/§9；`05-测试方案.md` ENTRY/ACCESS/NAV/A11Y；`06-验收标准.md` §5～§8；`07-实施计划.md` §3/§5～§7。状态：`pending / wait_until_current`。

## Allowed Scope

| type | path_or_rule | status |
|---|---|---|
| allowed_file | future `src/entry/**`, `src/access/**` and scoped tests | planned |
| allowed_rule | formal context, visibility, qualification and disclosure ceiling | planned |
| forbidden_rule | route/page/flag may not infer authorization; no owner truth/body | active |
| forbidden_rule | no navigation or topic implementation before this boundary | active |

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
| required_checks | module-flow, redaction/security, AC-CON-001 (future) |
| committed_hash | pending; no commit exists |
| committed_message | pending |
| post_commit_status | pending |
| handoff_notes | Wait until PH-01 completes |
