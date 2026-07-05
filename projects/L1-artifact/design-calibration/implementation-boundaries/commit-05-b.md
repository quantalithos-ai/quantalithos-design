# commit-05-b implementation ledger

| field | value |
|---|---|
| project | L1-artifact |
| boundary_id | commit-05-b |
| phase | PH-05 core query services |
| design_baseline | `formal-07-assembled-not-yet-committed` |
| implementation_repo | `/home/aris/Projects/quantalithos-artifact` |
| status | planned |
| next_allowed_action | wait_until_current |
| current_recovery_point | Future boundary. Not authorized until project ledger advances. |

## Required Reads

| document | required_section | status | notes |
|---|---|---|---|
| `projects/L1-artifact/07-实施计划.md` | §6, §7, §10, §11, §12 | pending | Query service gates and no-write rules. |
| `projects/L1-artifact/03-详细设计.md` | query services, projection repositories, visibility/degraded/freshness | pending | Query flow source maps. |
| `design-calibration/03_ddd_step_07_trait_port_adapter_contracts.md` | read repositories and visibility decisions | pending | Port contracts. |
| `design-calibration/03_ddd_step_09_function_flows.md` | 13 Query flows | pending | Service orchestration. |
| `design-calibration/03_ddd_step_11_persistence_transaction_consistency.md` | query no-write | pending | No write transaction. |
| `projects/L1-artifact/06-验收标准.md` | `AC-ART-024`, `AC-ART-027`, `AC-ART-037`, `VETO-ART-004` | pending | Read surface redlines. |

## Allowed Scope

| type | path_or_rule | status |
|---|---|---|
| allowed_path | `/home/aris/Projects/quantalithos-artifact/crates/application/**` query slice | pending |
| allowed_path | `/home/aris/Projects/quantalithos-artifact/crates/infra/**` projection/read repositories | pending |
| allowed_path | `/home/aris/Projects/quantalithos-artifact/tests/service/**` query slice | pending |
| forbidden_rule | Do not write core truth, refresh/rebuild projection in query path, or add consumer/event/job/release behavior. | active |

## Required Checks

| check | command_or_evidence | status | notes |
|---|---|---|---|
| design gate readout | visibility/degraded/stale source closure note | pending | Must pass before edits. |
| service-flow-fast query slice | no-write / visibility / degraded / freshness tests | pending | Required. |
| projection targeted tests | stale/freshness marker tests | pending | Required. |
| workspace check | `cargo check` | pending | Required. |
| whitespace | `git diff --check` and staged check | pending | Required. |
| staged scope | `git diff --cached --name-only` | pending | Query service scope only. |

## Commit Gate

| gate | status | evidence |
|---|---|---|
| staged_scope | pending | Query services and projection repos only. |
| unrelated_changes | pending | User changes unstaged. |
| commit_message_format | pending | Suggested subject: `feat(query): add artifact query services` |
| commit_body_group | pending | `Query services and visibility decisions:`;`Projection freshness and no-write guards:` |
| whitespace | pending | staged diff check passes. |
| required_checks | pending | Required checks have evidence. |

## Handoff Gate

| gate | status | evidence |
|---|---|---|
| committed_hash | pending | Fill after implementation commit. |
| gates_run | pending | Command list and reports. |
| tests_not_run | pending | Reason, if any. |
| remaining_blockers | pending | Blocker list or `none`. |
| next_boundary | pending | `commit-05-c` after design ledger advancement. |
| user_owned_changes_untouched | pending | File list / statement. |
