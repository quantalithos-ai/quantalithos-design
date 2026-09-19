# commit-04-b implementation ledger (planned)

| field | value |
|---|---|
| project | L5-console |
| boundary_id | `commit-04-b` |
| phase | `PH-04` |
| design_baseline | `not_fixed` |
| implementation_repo | `/home/aris/Projects/quantalithos-console` (not_created) |
| status | `planned` |
| next_allowed_action | `wait_until_current` |
| planned_commit_message | `feat(console): establish controlled submit safety` |

## Required Reads

`03-详细设计.md` §7～§12；`05-测试方案.md` INTENT/STATE/CONSISTENCY/RECOVERY；`06-验收标准.md` AC-CON-004、TX-CON-002、CC-CON-003～005、VETO-CON-003；`07-实施计划.md` §6～§7。状态：`pending / wait_until_current`。

## Allowed Scope

| type | path_or_rule | status |
|---|---|---|
| allowed_file | future controlled submit seam, receipt/result/unknown mapper, read-only reconcile and race tests | planned |
| allowed_rule | single-flight, possible dispatch→unknown, no replay, sole owner write inventory | planned |
| forbidden_rule | no guessed owner idempotency, no double submit, no automatic retry/job/replay | active |
| forbidden_rule | no durable carrier or invalidation binding | active |

## Gate Matrix

| gate | status | evidence | next_if_failed |
|---|---|---|---|
| design_gate | blocked | exact owner submit/reconcile/idempotency contract pending | wait_design |
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
| required_checks | adapter/race/recovery, AC-CON-004, VETO-CON-003 (future) |
| committed_hash | pending; no commit exists |
| committed_message | pending |
| post_commit_status | pending |
| handoff_notes | Positive submit branch is blocked until owner/SDK contract closes |
