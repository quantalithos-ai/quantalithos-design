# commit-06-b implementation ledger (planned)

| field | value |
|---|---|
| project | L5-console |
| boundary_id | `commit-06-b` |
| phase | `PH-06` |
| design_baseline | `not_fixed` |
| implementation_repo | `/home/aris/Projects/quantalithos-console` (not_created) |
| status | `planned` |
| next_allowed_action | `wait_until_current` |
| planned_commit_message | `feat(console): establish semantic accessibility paths` |

## Required Reads

`03-详细设计.md` §5/§11/§15；`05-测试方案.md` A11Y/RECOVERY/NAV；`06-验收标准.md` AC-FR-012、AC-NFR-007、VETO-CON-006；`07-实施计划.md` §6～§7。状态：`pending / wait_until_current`。

## Allowed Scope

| type | path_or_rule | status |
|---|---|---|
| allowed_file | future semantic action, focus/announcement mapping and host fallback tests | planned |
| allowed_rule | visual/keyboard/AT use same action key, guard, input, outcome and ceiling | planned |
| forbidden_rule | no alternate guard, browser compatibility verdict or host-specific guess | active |

## Gate Matrix

| gate | status | evidence | next_if_failed |
|---|---|---|---|
| design_gate | blocked | selected browser/AT matrix and host authority pending | wait_design |
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
| required_checks | semantic-a11y, AC-FR-012, VETO-CON-006 (future) |
| committed_hash | pending; no commit exists |
| committed_message | pending |
| post_commit_status | pending |
| handoff_notes | Semantic fallback only until selected matrix is fixed |
