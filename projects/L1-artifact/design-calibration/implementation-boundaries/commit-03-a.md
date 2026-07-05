# commit-03-a implementation ledger

| field | value |
|---|---|
| project | L1-artifact |
| boundary_id | commit-03-a |
| phase | PH-03 version contracts / domain state |
| design_baseline | `formal-07-assembled-not-yet-committed` |
| implementation_repo | `/home/aris/Projects/quantalithos-artifact` |
| status | planned |
| next_allowed_action | wait_until_current |
| current_recovery_point | Future boundary. Not authorized until project ledger advances. |

## Required Reads

| document | required_section | status | notes |
|---|---|---|---|
| `projects/L1-artifact/07-实施计划.md` | §6, §7, §11, §12 | pending | Version boundary rules. |
| `projects/L1-artifact/03-详细设计.md` | version contracts, domain state, history retain | pending | Formal version truth. |
| `design-calibration/03_ddd_step_06_object_contracts.md` | version objects | pending | Field closure. |
| `design-calibration/03_ddd_step_08_protocol_contracts.md` | version command/result contracts | pending | DTO closure. |
| `design-calibration/03_ddd_step_10_state_matrix.md` | version state matrix | pending | Legal transitions. |
| `projects/L1-artifact/05-测试方案.md` | version contract/domain cut | pending | Targeted tests. |

## Allowed Scope

| type | path_or_rule | status |
|---|---|---|
| allowed_path | `/home/aris/Projects/quantalithos-artifact/crates/contracts/**` version slice | pending |
| allowed_path | `/home/aris/Projects/quantalithos-artifact/crates/domain/**` version slice | pending |
| allowed_path | `/home/aris/Projects/quantalithos-artifact/tests/contract/**` version slice | pending |
| allowed_path | `/home/aris/Projects/quantalithos-artifact/tests/domain/**` version slice | pending |
| forbidden_rule | Do not add lineage service, baseline, query, event or job behavior. | active |

## Required Checks

| check | command_or_evidence | status | notes |
|---|---|---|---|
| design gate readout | version field/state closure note | pending | Must pass before edits. |
| contract-domain-fast version slice | targeted version tests | pending | Required. |
| workspace check | `cargo check` | pending | Required. |
| whitespace | `git diff --check` and staged check | pending | Required. |
| staged scope | `git diff --cached --name-only` | pending | Version contracts/domain only. |

## Commit Gate

| gate | status | evidence |
|---|---|---|
| staged_scope | pending | Version public/domain slice only. |
| unrelated_changes | pending | User changes unstaged. |
| commit_message_format | pending | Suggested subject: `feat(version): add artifact version contracts and state` |
| commit_body_group | pending | `Artifact version contracts:`;`Version domain history:` |
| whitespace | pending | staged diff check passes. |
| required_checks | pending | Required checks have evidence. |

## Handoff Gate

| gate | status | evidence |
|---|---|---|
| committed_hash | pending | Fill after implementation commit. |
| gates_run | pending | Command list and reports. |
| tests_not_run | pending | Reason, if any. |
| remaining_blockers | pending | Blocker list or `none`. |
| next_boundary | pending | `commit-03-b` after design ledger advancement. |
| user_owned_changes_untouched | pending | File list / statement. |
