# commit-06-c implementation ledger (planned)

| field | value |
|---|---|
| project | L5-console |
| boundary_id | `commit-06-c` |
| phase | `PH-06` |
| design_baseline | `not_fixed` |
| implementation_repo | `/home/aris/Projects/quantalithos-console` (not_created) |
| status | `planned` |
| next_allowed_action | `wait_until_current` |
| planned_commit_message | `feat(console): establish diagnostic isolation` |

## Required Reads

`03-详细设计.md` §5/§14；`04-配置设计.md` §8～§12；`05-测试方案.md` DIAGNOSTIC/SECURITY；`06-验收标准.md` AC-NFR-003/006、AR-CON-003/011、VETO-CON-004；`07-实施计划.md` §6～§8。状态：`pending / wait_until_current`。

## Allowed Scope

| type | path_or_rule | status |
|---|---|---|
| allowed_file | future `src/diagnostics/**`, body-free whitelist/redaction and sink isolation tests | planned |
| allowed_rule | redacted diagnostic context; disabled/failed sink cannot change business state/result | planned |
| forbidden_rule | no raw body, secret, credential, stack, audit/evidence ownership or recursive sink | active |

## Gate Matrix

| gate | status | evidence | next_if_failed |
|---|---|---|---|
| design_gate | blocked | diagnostic sink/envelope/retention authority pending | wait_design |
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
| required_checks | redaction, diagnostic isolation, AR-CON-003/011 (future) |
| committed_hash | pending; no commit exists |
| committed_message | pending |
| post_commit_status | pending |
| handoff_notes | Body-free facade may be planned; production sink remains conditional |
