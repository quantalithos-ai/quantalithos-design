# commit-05-a implementation ledger

| field | value |
|---|---|
| project | L1-artifact |
| boundary_id | commit-05-a |
| phase | PH-05 query/view/projection contracts |
| design_baseline | `formal-07-assembled-not-yet-committed` |
| implementation_repo | `/home/aris/Projects/quantalithos-artifact` |
| status | planned |
| next_allowed_action | wait_until_current |
| current_recovery_point | Future boundary. Not authorized until project ledger advances. |

## Required Reads

| document | required_section | status | notes |
|---|---|---|---|
| `projects/L1-artifact/07-实施计划.md` | §6, §7, §11, §12 | pending | Query contract boundary. |
| `projects/L1-artifact/03-详细设计.md` | query / view / projection public contracts | pending | Read surface protocol. |
| `design-calibration/03_ddd_step_07_trait_port_adapter_contracts.md` | query/view/projection refs and markers | pending | Read model identities. |
| `design-calibration/03_ddd_step_08_protocol_contracts.md` | 13 Query request/response contracts | pending | DTO closure. |
| `design-calibration/03_ddd_step_10_state_matrix.md` | read markers and states | pending | Marker/state closure. |
| `projects/L1-artifact/05-测试方案.md` | query/view contract tests | pending | Targeted tests. |

## Allowed Scope

| type | path_or_rule | status |
|---|---|---|
| allowed_path | `/home/aris/Projects/quantalithos-artifact/crates/contracts/**` query/view/projection slice | pending |
| allowed_path | `/home/aris/Projects/quantalithos-artifact/tests/contract/**` query/view slice | pending |
| forbidden_rule | Do not add query service execution, repositories, API handlers, consumer/event/job behavior. | active |

## Required Checks

| check | command_or_evidence | status | notes |
|---|---|---|---|
| design gate readout | query/view DTO and marker closure note | pending | Must pass before edits. |
| query contract tests | targeted query/view contract tests | pending | Required. |
| projection identity tests | targeted marker/ref tests | pending | Required if markers are added. |
| workspace check | `cargo check` | pending | Required. |
| whitespace | `git diff --check` and staged check | pending | Required. |
| staged scope | `git diff --cached --name-only` | pending | Read contracts only. |

## Commit Gate

| gate | status | evidence |
|---|---|---|
| staged_scope | pending | Query/view/projection contract files only. |
| unrelated_changes | pending | User changes unstaged. |
| commit_message_format | pending | Suggested subject: `feat(query): add artifact read model contracts` |
| commit_body_group | pending | `Read model contracts:`;`Projection identities and markers:` |
| whitespace | pending | staged diff check passes. |
| required_checks | pending | Required checks have evidence. |

## Handoff Gate

| gate | status | evidence |
|---|---|---|
| committed_hash | pending | Fill after implementation commit. |
| gates_run | pending | Command list and reports. |
| tests_not_run | pending | Reason, if any. |
| remaining_blockers | pending | Blocker list or `none`. |
| next_boundary | pending | `commit-05-b` after design ledger advancement. |
| user_owned_changes_untouched | pending | File list / statement. |
