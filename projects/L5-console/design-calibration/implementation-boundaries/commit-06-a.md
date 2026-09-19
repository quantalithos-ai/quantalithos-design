# commit-06-a implementation ledger (planned)

| field | value |
|---|---|
| project | L5-console |
| boundary_id | `commit-06-a` |
| phase | `PH-06` |
| design_baseline | `not_fixed` |
| implementation_repo | `/home/aris/Projects/quantalithos-console` (not_created) |
| status | `planned` |
| next_allowed_action | `wait_until_current` |
| planned_commit_message | `feat(console): establish recovery safety` |

## Required Reads

`03-详细设计.md` §9/§11/§12；`05-测试方案.md` RECOVERY/STATE；`06-验收标准.md` AC-CON-006、ST-CON-008、VETO-CON-003/006；`07-实施计划.md` §6～§7。状态：`pending / wait_until_current`。

## Allowed Scope

| type | path_or_rule | status |
|---|---|---|
| allowed_file | future `src/recovery/**` typed degradation, immutable plans and guards | planned |
| allowed_rule | subject-specific one-action ceiling, stale/mismatch block, no replay | planned |
| forbidden_rule | no generic retry, repair job, worker, production sink or owner truth | active |

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
| required_checks | recovery-matrix, module-flow, ST-CON-008 (future) |
| committed_hash | pending; no commit exists |
| committed_message | pending |
| post_commit_status | pending |
| handoff_notes | Wait until topic composition is complete |
