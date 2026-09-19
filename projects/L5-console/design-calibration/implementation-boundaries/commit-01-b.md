# commit-01-b implementation ledger (planned)

| field | value |
|---|---|
| project | L5-console |
| boundary_id | `commit-01-b` |
| phase | `PH-01` |
| design_baseline | `not_fixed` |
| implementation_repo | `/home/aris/Projects/quantalithos-console` (not_created) |
| status | `planned` |
| next_allowed_action | `wait_until_current` |
| planned_commit_message | `chore(console): establish gate and evidence path skeleton` |

## Required Reads

`03-详细设计.md` §4/§15；`04-配置设计.md` §9～§12；`05-测试方案.md` §7～§9/§13；`06-验收标准.md` §10～§14；`07-实施计划.md` §6～§8。状态：`pending / wait_until_current`。

## Allowed Scope

| type | path_or_rule | status |
|---|---|---|
| allowed_file | future `scripts/gates/**`, `scripts/checks/**`, `scripts/reports/**`, fixture/manifest roots | planned |
| allowed_rule | explicit run/profile/root; raw→paired report only | planned |
| forbidden_rule | no static evidence, no hand-written pass, no acceptance verdict/signoff/readiness | active |
| forbidden_rule | no business modules or owner truth | active |

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
| required_checks | pending |
| committed_hash | pending; no commit exists |
| committed_message | pending |
| post_commit_status | pending |
| handoff_notes | Wait until `commit-01-a` is advanced by the project ledger |
