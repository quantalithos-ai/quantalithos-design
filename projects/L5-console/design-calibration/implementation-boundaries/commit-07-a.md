# commit-07-a implementation ledger (planned)

| field | value |
|---|---|
| project | L5-console |
| boundary_id | `commit-07-a` |
| phase | `PH-07` |
| design_baseline | `not_fixed` |
| implementation_repo | `/home/aris/Projects/quantalithos-console` (not_created) |
| status | `planned` |
| next_allowed_action | `wait_until_current` |
| planned_commit_message | `feat(console): establish formal adapter registry` |

## Required Reads

`03-详细设计.md` §6/§7/§13；`04-配置设计.md` §8～§12；`05-测试方案.md` ADAPTER/ARCH；`06-验收标准.md` IFG-CON-007、AR-CON-002/005/010、VETO-CON-001；`07-实施计划.md` §6～§8。状态：`pending / wait_until_current`。

## Allowed Scope

| type | path_or_rule | status |
|---|---|---|
| allowed_file | future `src/adapters/**` registry/slot/availability/disabled shell | planned |
| allowed_rule | SDK/formal boundary only, typed availability and fail-closed posture | planned |
| forbidden_rule | no concrete guessed method/path/schema, DB/repository/private bus/BFF | active |

## Gate Matrix

| gate | status | evidence | next_if_failed |
|---|---|---|---|
| design_gate | blocked | SDK export/host/package authority pending | wait_design |
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
| required_checks | port-adapter, architecture-static, IFG-CON-007 (future) |
| committed_hash | pending; no commit exists |
| committed_message | pending |
| post_commit_status | pending |
| handoff_notes | Registry/disabled branch only until exports are fixed |
