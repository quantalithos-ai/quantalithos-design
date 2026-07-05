# commit-04-b implementation ledger

| field | value |
|---|---|
| project | L1-artifact |
| boundary_id | commit-04-b |
| phase | PH-04 baseline services / audit |
| design_baseline | `formal-07-assembled-not-yet-committed` |
| implementation_repo | `/home/aris/Projects/quantalithos-artifact` |
| status | planned |
| next_allowed_action | wait_until_current |
| current_recovery_point | Future boundary. Not authorized until project ledger advances. |

## Required Reads

| document | required_section | status | notes |
|---|---|---|---|
| `projects/L1-artifact/07-实施计划.md` | §6, §7, §10, §11, §12 | pending | Baseline service boundary and gates. |
| `projects/L1-artifact/03-详细设计.md` | baseline service flow, persistence, history audit | pending | Flow and version sources. |
| `design-calibration/03_ddd_step_07_trait_port_adapter_contracts.md` | baseline repositories and ports | pending | Application/infra contracts. |
| `design-calibration/03_ddd_step_09_function_flows.md` | baseline accepted flows | pending | Service orchestration. |
| `design-calibration/03_ddd_step_11_persistence_transaction_consistency.md` | UoW and audit order | pending | Atomicity rules. |

## Allowed Scope

| type | path_or_rule | status |
|---|---|---|
| allowed_path | `/home/aris/Projects/quantalithos-artifact/crates/application/**` baseline slice | pending |
| allowed_path | `/home/aris/Projects/quantalithos-artifact/crates/infra/**` baseline slice | pending |
| allowed_path | `/home/aris/Projects/quantalithos-artifact/crates/api/**` baseline handlers | pending |
| allowed_path | `/home/aris/Projects/quantalithos-artifact/tests/service/**` baseline slice | pending |
| forbidden_rule | Do not add query, consumer, event, relay, job or release scripts. | active |

## Required Checks

| check | command_or_evidence | status | notes |
|---|---|---|---|
| design gate readout | baseline service closure note | pending | Must pass before edits. |
| service-flow-fast baseline slice | targeted tests | pending | Required. |
| workspace check | `cargo check` | pending | Required. |
| redaction targeted | if audit/report output is touched | pending | Required when observable output changes. |
| whitespace | `git diff --check` and staged check | pending | Required. |
| staged scope | `git diff --cached --name-only` | pending | Baseline service scope only. |

## Commit Gate

| gate | status | evidence |
|---|---|---|
| staged_scope | pending | Baseline service/runtime/audit files only. |
| unrelated_changes | pending | User changes unstaged. |
| commit_message_format | pending | Suggested subject: `feat(baseline): add artifact baseline services` |
| commit_body_group | pending | `Baseline service orchestration:`;`History audit and runtime fake:` |
| whitespace | pending | staged diff check passes. |
| required_checks | pending | Required checks have evidence. |

## Handoff Gate

| gate | status | evidence |
|---|---|---|
| committed_hash | pending | Fill after implementation commit. |
| gates_run | pending | Command list and reports. |
| tests_not_run | pending | Reason, if any. |
| remaining_blockers | pending | Blocker list or `none`. |
| next_boundary | pending | `commit-05-a` after design ledger advancement. |
| user_owned_changes_untouched | pending | File list / statement. |
