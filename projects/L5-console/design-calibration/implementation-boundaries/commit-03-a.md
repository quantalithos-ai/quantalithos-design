# commit-03-a implementation ledger (planned)

| field | value |
|---|---|
| project | L5-console |
| boundary_id | `commit-03-a` |
| phase | `PH-03` |
| design_baseline | `not_fixed` |
| implementation_repo | `/home/aris/Projects/quantalithos-console` (not_created) |
| status | `planned` |
| next_allowed_action | `wait_until_current` |
| planned_commit_message | `feat(console): establish safe view mapping` |

## Required Reads

| document | required_section | status |
|---|---|---|
| `03-详细设计.md` | §5～§8 | pending |
| `05-测试方案.md` | VIEW / ADAPTER / ARCH | pending |
| `06-验收标准.md` | §5～§7、VETO-CON-004/005 | pending |
| `07-实施计划.md` | §3、§5～§7 | pending |

## Allowed Scope

| type | path_or_rule | status |
|---|---|---|
| allowed_file | future `src/views/**` safe mapper/contracts and focused tests | planned |
| allowed_rule | approved safe material, source/status axes, opaque refs | planned |
| forbidden_rule | no owner body, projection, query write, guessed safe-field or route inference | active |
| forbidden_rule | no Core/Topic Query adapter binding before formal contract | active |

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
| required_checks | pure-contract, redaction, safe-field review (future) |
| committed_hash | pending; no commit exists |
| committed_message | pending |
| post_commit_status | pending |
| handoff_notes | Wait until PH-02 and exact safe-field contract are closed |
