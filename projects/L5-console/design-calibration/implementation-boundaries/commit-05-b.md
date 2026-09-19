# commit-05-b implementation ledger (planned)

| field | value |
|---|---|
| project | L5-console |
| boundary_id | `commit-05-b` |
| phase | `PH-05` |
| design_baseline | `not_fixed` |
| implementation_repo | `/home/aris/Projects/quantalithos-console` (not_created) |
| status | `planned` |
| next_allowed_action | `wait_until_current` |
| planned_commit_message | `feat(console): compose owner topic partitions` |

## Required Reads

`03-详细设计.md` §7/§8/§15；`05-测试方案.md` TOPIC/SEC/CONSISTENCY；`06-验收标准.md` AC-CON-005、IFG-CON-006、VETO-CON-007；`07-实施计划.md` §6～§7。状态：`pending / wait_until_current`。

## Allowed Scope

| type | path_or_rule | status |
|---|---|---|
| allowed_file | future eight partition query composition and isolation tests | planned |
| allowed_rule | canonical owner order, local partial/failure isolation, safe material only | planned |
| forbidden_rule | no cross-owner transaction, projection/cursor/rebuild, unified health/readiness | active |
| forbidden_rule | no owner positive value when contract is missing | active |

## Gate Matrix

| gate | status | evidence | next_if_failed |
|---|---|---|---|
| design_gate | blocked | owner query facets and safe-field contracts pending | wait_design |
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
| required_checks | controlled-composition, redaction, AC-CON-005, VETO-CON-007 (future) |
| committed_hash | pending; no commit exists |
| committed_message | pending |
| post_commit_status | pending |
| handoff_notes | Per-topic positive integration is conditional |
