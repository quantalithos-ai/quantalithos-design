# commit-04-a implementation ledger (planned)

| field | value |
|---|---|
| project | L5-console |
| boundary_id | `commit-04-a` |
| phase | `PH-04` |
| design_baseline | `not_fixed` |
| implementation_repo | `/home/aris/Projects/quantalithos-console` (not_created) |
| status | `planned` |
| next_allowed_action | `wait_until_current` |
| planned_commit_message | `feat(console): establish local intent phase` |

## Required Reads

`03-详细设计.md` §5/§7/§9/§11；`05-测试方案.md` INTENT/STATE；`06-验收标准.md` AC-CON-004、ST-CON-005/006；`07-实施计划.md` §6～§7。状态：`pending / wait_until_current`。

## Allowed Scope

| type | path_or_rule | status |
|---|---|---|
| allowed_file | future `src/intent/**` local draft/preference/discard state and tests | planned |
| allowed_rule | local intent phase, typed reasons, nonterminal discard | planned |
| forbidden_rule | no owner submit, reconcile, durable state, automatic replay or topic features | active |

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
| required_checks | module-flow, pure-contract, ST-CON-005/006 (future) |
| committed_hash | pending; no commit exists |
| committed_message | pending |
| post_commit_status | pending |
| handoff_notes | Wait until Core Query read seam is closed |
