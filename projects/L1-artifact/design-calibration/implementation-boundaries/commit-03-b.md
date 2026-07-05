# commit-03-b implementation ledger

| field | value |
|---|---|
| project | L1-artifact |
| boundary_id | commit-03-b |
| phase | PH-03 lineage contracts / relation state |
| design_baseline | `formal-07-assembled-not-yet-committed` |
| implementation_repo | `/home/aris/Projects/quantalithos-artifact` |
| status | planned |
| next_allowed_action | wait_until_current |
| current_recovery_point | Future boundary. Not authorized until project ledger advances. |

## Required Reads

| document | required_section | status | notes |
|---|---|---|---|
| `projects/L1-artifact/07-实施计划.md` | §6, §7, §11, §12 | pending | Lineage boundary rules. |
| `projects/L1-artifact/03-详细设计.md` | lineage contracts, relation state, impact summary | pending | Formal lineage truth. |
| `design-calibration/03_ddd_step_06_object_contracts.md` | lineage objects | pending | Field closure. |
| `design-calibration/03_ddd_step_08_protocol_contracts.md` | lineage contracts | pending | DTO closure. |
| `design-calibration/03_ddd_step_10_state_matrix.md` | lineage state matrix | pending | Legal transitions. |
| `projects/L1-artifact/05-测试方案.md` | lineage contract/domain cut | pending | Targeted tests. |

## Allowed Scope

| type | path_or_rule | status |
|---|---|---|
| allowed_path | `/home/aris/Projects/quantalithos-artifact/crates/contracts/**` lineage slice | pending |
| allowed_path | `/home/aris/Projects/quantalithos-artifact/crates/domain/**` lineage slice | pending |
| allowed_path | `/home/aris/Projects/quantalithos-artifact/tests/contract/**` lineage slice | pending |
| allowed_path | `/home/aris/Projects/quantalithos-artifact/tests/domain/**` lineage slice | pending |
| forbidden_rule | Do not add version service, baseline, query, event or job behavior. | active |

## Required Checks

| check | command_or_evidence | status | notes |
|---|---|---|---|
| design gate readout | lineage field/state closure note | pending | Must pass before edits. |
| contract-domain-fast lineage slice | targeted lineage tests | pending | Required. |
| workspace check | `cargo check` | pending | Required. |
| whitespace | `git diff --check` and staged check | pending | Required. |
| staged scope | `git diff --cached --name-only` | pending | Lineage contracts/domain only. |

## Commit Gate

| gate | status | evidence |
|---|---|---|
| staged_scope | pending | Lineage public/domain slice only. |
| unrelated_changes | pending | User changes unstaged. |
| commit_message_format | pending | Suggested subject: `feat(lineage): add artifact lineage relation state` |
| commit_body_group | pending | `Lineage relation contracts:`;`Lineage impact state:` |
| whitespace | pending | staged diff check passes. |
| required_checks | pending | Required checks have evidence. |

## Handoff Gate

| gate | status | evidence |
|---|---|---|
| committed_hash | pending | Fill after implementation commit. |
| gates_run | pending | Command list and reports. |
| tests_not_run | pending | Reason, if any. |
| remaining_blockers | pending | Blocker list or `none`. |
| next_boundary | pending | `commit-03-c` after design ledger advancement. |
| user_owned_changes_untouched | pending | File list / statement. |
