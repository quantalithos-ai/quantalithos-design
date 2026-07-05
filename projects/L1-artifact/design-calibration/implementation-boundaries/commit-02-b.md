# commit-02-b implementation ledger

| field | value |
|---|---|
| project | L1-artifact |
| boundary_id | commit-02-b |
| phase | PH-02 accepted fact command flow |
| design_baseline | `formal-07-assembled-not-yet-committed` |
| implementation_repo | `/home/aris/Projects/quantalithos-artifact` |
| status | planned |
| next_allowed_action | wait_until_current |
| current_recovery_point | Future boundary. Not authorized until project ledger advances. |

## Required Reads

| document | required_section | status | notes |
|---|---|---|---|
| `projects/L1-artifact/07-实施计划.md` | §6, §7, §10, §11, §12 | pending | Accepted fact flow gates and commit discipline. |
| `projects/L1-artifact/03-详细设计.md` | fact command flow, ports/UoW/idempotency, persistence consistency | pending | UoW and version sources are authoritative. |
| `design-calibration/03_ddd_step_07_trait_port_adapter_contracts.md` | fact repositories / ports | pending | Application and infra contracts. |
| `design-calibration/03_ddd_step_09_function_flows.md` | accepted fact flows | pending | Service orchestration. |
| `design-calibration/03_ddd_step_11_persistence_transaction_consistency.md` | UoW and transaction order | pending | Atomicity rules. |
| `design-calibration/03_ddd_step_13_concurrency_idempotency.md` | stored result / duplicate replay | pending | Idempotency rules. |

## Allowed Scope

| type | path_or_rule | status |
|---|---|---|
| allowed_path | `/home/aris/Projects/quantalithos-artifact/crates/application/**` fact service slice | pending |
| allowed_path | `/home/aris/Projects/quantalithos-artifact/crates/infra/**` fact fake/runtime slice | pending |
| allowed_path | `/home/aris/Projects/quantalithos-artifact/crates/api/**` fact command handler slice | pending |
| allowed_path | `/home/aris/Projects/quantalithos-artifact/tests/service/**` fact slice | pending |
| allowed_path | `/home/aris/Projects/quantalithos-artifact/tests/integration/**` fact slice | pending |
| forbidden_rule | Do not add version/lineage/baseline/query/event/job behavior. | active |
| forbidden_rule | Do not repair truth from query, consumer, relay or job paths. | active |

## Required Checks

| check | command_or_evidence | status | notes |
|---|---|---|---|
| design gate readout | UoW/idempotency/source closure note | pending | Must pass before edits. |
| service-flow-fast fact slice | targeted service tests | pending | Required. |
| infra-runtime-fake fact slice | fake parity / stored result tests | pending | Required. |
| workspace check | `cargo check` | pending | Required. |
| whitespace | `git diff --check` and staged check | pending | Required. |
| staged scope | `git diff --cached --name-only` | pending | Application/infra/api/tests fact slice only. |

## Commit Gate

| gate | status | evidence |
|---|---|---|
| staged_scope | pending | Accepted fact flow files only. |
| unrelated_changes | pending | User changes unstaged. |
| commit_message_format | pending | Suggested subject: `feat(fact): add accepted artifact fact flow` |
| commit_body_group | pending | `Accepted fact command flow:`;`Repository fake and idempotency:`;`API command entry:` |
| whitespace | pending | staged diff check passes. |
| required_checks | pending | Required checks have evidence. |

## Handoff Gate

| gate | status | evidence |
|---|---|---|
| committed_hash | pending | Fill after implementation commit. |
| gates_run | pending | Command list and reports. |
| tests_not_run | pending | Reason, if any. |
| remaining_blockers | pending | Blocker list or `none`. |
| next_boundary | pending | `commit-03-a` after design ledger advancement. |
| user_owned_changes_untouched | pending | File list / statement. |
