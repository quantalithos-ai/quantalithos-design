# commit-07-a implementation ledger

| field | value |
|---|---|
| project | L1-artifact |
| boundary_id | commit-07-a |
| phase | PH-07 public jobs shared schema / report / result carriers |
| design_baseline | `formal-07-assembled-not-yet-committed` |
| implementation_repo | `/home/aris/Projects/quantalithos-artifact` |
| status | planned |
| next_allowed_action | wait_until_current |
| current_recovery_point | Future boundary. Not authorized until project ledger advances. |

## Required Reads

| document | required_section | status | notes |
|---|---|---|---|
| `projects/L1-artifact/07-实施计划.md` | §6, §7, §10, §11, §12 | pending | Public job shared surface. |
| `projects/L1-artifact/03-详细设计.md` | public job / report / handoff marker contracts | pending | Job DTO source. |
| `design-calibration/03_ddd_step_08_protocol_contracts.md` | job protocol and report/result carriers | pending | DTO closure. |
| `design-calibration/03_ddd_step_13_concurrency_idempotency.md` | job idempotency and stored report replay | pending | Replay rules. |
| `projects/L1-artifact/05-测试方案.md` | job contract tests | pending | Required tests. |

## Allowed Scope

| type | path_or_rule | status |
|---|---|---|
| allowed_path | `/home/aris/Projects/quantalithos-artifact/crates/contracts/**` job/report/result carrier slice | pending |
| allowed_path | `/home/aris/Projects/quantalithos-artifact/crates/application/**` job trait shell only | pending |
| allowed_path | `/home/aris/Projects/quantalithos-artifact/tests/contract/**` job contract slice | pending |
| forbidden_rule | Do not add concrete job services, handoff/export adapters, release scripts or final reports. | active |

## Required Checks

| check | command_or_evidence | status | notes |
|---|---|---|---|
| design gate readout | job report/result carrier closure note | pending | Must pass before edits. |
| job contract tests | public job schema and stored report carrier tests | pending | Required. |
| workspace check | `cargo check` | pending | Required. |
| whitespace | `git diff --check` and staged check | pending | Required. |
| staged scope | `git diff --cached --name-only` | pending | Public job shared surface only. |

## Commit Gate

| gate | status | evidence |
|---|---|---|
| staged_scope | pending | Job contracts and shared report/result carriers only. |
| unrelated_changes | pending | User changes unstaged. |
| commit_message_format | pending | Suggested subject: `feat(job): add artifact job protocol carriers` |
| commit_body_group | pending | `Public job protocol surface:`;`Stored report replay carriers:` |
| whitespace | pending | staged diff check passes. |
| required_checks | pending | Required checks have evidence. |

## Handoff Gate

| gate | status | evidence |
|---|---|---|
| committed_hash | pending | Fill after implementation commit. |
| gates_run | pending | Command list and reports. |
| tests_not_run | pending | Reason, if any. |
| remaining_blockers | pending | Blocker list or `none`. |
| next_boundary | pending | `commit-07-b` after design ledger advancement. |
| user_owned_changes_untouched | pending | File list / statement. |
