# commit-03-c implementation ledger

| field | value |
|---|---|
| project | L1-artifact |
| boundary_id | commit-03-c |
| phase | PH-03 version / lineage services |
| design_baseline | `formal-07-assembled-not-yet-committed` |
| implementation_repo | `/home/aris/Projects/quantalithos-artifact` |
| status | planned |
| next_allowed_action | wait_until_current |
| current_recovery_point | Future boundary. Not authorized until project ledger advances. |

## Required Reads

| document | required_section | status | notes |
|---|---|---|---|
| `projects/L1-artifact/07-实施计划.md` | §6, §7, §10, §11, §12 | pending | Service boundary and gates. |
| `projects/L1-artifact/03-详细设计.md` | version/lineage services, ports, persistence, idempotency | pending | Flow and replay source. |
| `design-calibration/03_ddd_step_07_trait_port_adapter_contracts.md` | version/lineage repositories and ports | pending | Application/infra contracts. |
| `design-calibration/03_ddd_step_09_function_flows.md` | version/lineage service flows | pending | Accepted flow order. |
| `design-calibration/03_ddd_step_11_persistence_transaction_consistency.md` | UoW and transaction order | pending | Atomicity rules. |
| `design-calibration/03_ddd_step_13_concurrency_idempotency.md` | replay/conflict/commit unknown | pending | Idempotency rules. |

## Allowed Scope

| type | path_or_rule | status |
|---|---|---|
| allowed_path | `/home/aris/Projects/quantalithos-artifact/crates/application/**` version/lineage slice | pending |
| allowed_path | `/home/aris/Projects/quantalithos-artifact/crates/infra/**` version/lineage slice | pending |
| allowed_path | `/home/aris/Projects/quantalithos-artifact/crates/api/**` version/lineage handlers | pending |
| allowed_path | `/home/aris/Projects/quantalithos-artifact/tests/service/**` version/lineage slice | pending |
| forbidden_rule | Do not add baseline, query, consumer, outbox, relay or job behavior. | active |

## Required Checks

| check | command_or_evidence | status | notes |
|---|---|---|---|
| design gate readout | version/lineage service closure note | pending | Must pass before edits. |
| service-flow-fast version/lineage | targeted service tests | pending | Required. |
| infra-runtime-fake targeted | conflict/replay/fake parity | pending | Required. |
| workspace check | `cargo check` | pending | Required. |
| whitespace | `git diff --check` and staged check | pending | Required. |
| staged scope | `git diff --cached --name-only` | pending | Version/lineage service scope only. |

## Commit Gate

| gate | status | evidence |
|---|---|---|
| staged_scope | pending | Version/lineage service/runtime/handler files only. |
| unrelated_changes | pending | User changes unstaged. |
| commit_message_format | pending | Suggested subject: `feat(version): add artifact version and lineage services` |
| commit_body_group | pending | `Version and lineage services:`;`Runtime fake and replay guards:`;`Command handlers:` |
| whitespace | pending | staged diff check passes. |
| required_checks | pending | Required checks have evidence. |

## Handoff Gate

| gate | status | evidence |
|---|---|---|
| committed_hash | pending | Fill after implementation commit. |
| gates_run | pending | Command list and reports. |
| tests_not_run | pending | Reason, if any. |
| remaining_blockers | pending | Blocker list or `none`. |
| next_boundary | pending | `commit-04-a` after design ledger advancement. |
| user_owned_changes_untouched | pending | File list / statement. |
