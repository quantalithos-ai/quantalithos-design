# commit-06-c implementation ledger

| field | value |
|---|---|
| project | L1-artifact |
| boundary_id | commit-06-c |
| phase | PH-06 outbound event snapshot / publisher fake / relay loop |
| design_baseline | `formal-07-assembled-not-yet-committed` |
| implementation_repo | `/home/aris/Projects/quantalithos-artifact` |
| status | planned |
| next_allowed_action | wait_until_current |
| current_recovery_point | Future boundary. Not authorized until project ledger advances. |

## Required Reads

| document | required_section | status | notes |
|---|---|---|---|
| `projects/L1-artifact/07-实施计划.md` | §6, §7, §8, §10, §11, §12 | pending | Outbound and relay boundary. |
| `projects/L1-artifact/03-详细设计.md` | outbound events, outbox snapshots, relay worker | pending | Event source identity. |
| `design-calibration/03_ddd_step_07_trait_port_adapter_contracts.md` | outbox and publisher ports | pending | Callable surface. |
| `design-calibration/03_ddd_step_08_protocol_contracts.md` | 8 Outbound Event payload contracts | pending | DTO closure. |
| `design-calibration/03_ddd_step_09_function_flows.md` | outbound append and relay publish flows | pending | Flow orchestration. |
| `design-calibration/03_ddd_step_11_persistence_transaction_consistency.md` | stored payload snapshot and publication marker | pending | Tx consistency. |
| `projects/L1-artifact/04-配置设计.md` | topic map and adapter mode | pending | Config binding. |
| `projects/L1-artifact/05-测试方案.md` | relay / outbox / worker cut | pending | Required tests. |
| `projects/L1-artifact/06-验收标准.md` | `AC-ART-029`, `AC-ART-041`, `VETO-ART-003`, `VETO-ART-005` | pending | Outbound acceptance. |

## Allowed Scope

| type | path_or_rule | status |
|---|---|---|
| allowed_path | `/home/aris/Projects/quantalithos-artifact/crates/contracts/**` outbound event slice | pending |
| allowed_path | `/home/aris/Projects/quantalithos-artifact/crates/application/**` outbox append / relay support slice | pending |
| allowed_path | `/home/aris/Projects/quantalithos-artifact/crates/infra/**` publisher fake and outbox store slice | pending |
| allowed_path | `/home/aris/Projects/quantalithos-artifact/crates/worker/**` relay loop slice | pending |
| allowed_path | `/home/aris/Projects/quantalithos-artifact/tests/worker/**` relay/outbox slice | pending |
| forbidden_rule | Do not add public jobs, handoff/export, release scripts or final reports. | active |
| forbidden_rule | Relay may only publish stored snapshots; it must not rebuild current truth payloads. | active |

## Required Checks

| check | command_or_evidence | status | notes |
|---|---|---|---|
| design gate readout | outbox source identity and topic map closure note | pending | Must pass before edits. |
| operations-replay-core relay slice | stored snapshot / retry / publication marker tests | pending | Required. |
| topic map check | configured outbound topics are complete | pending | Required. |
| redaction targeted | event payload scan for forbidden body content | pending | Required. |
| workspace check | `cargo check` | pending | Required. |
| whitespace | `git diff --check` and staged check | pending | Required. |
| staged scope | `git diff --cached --name-only` | pending | Outbound/relay scope only. |

## Commit Gate

| gate | status | evidence |
|---|---|---|
| staged_scope | pending | Outbound events, outbox snapshots, publisher fake and relay loop only. |
| unrelated_changes | pending | User changes unstaged. |
| commit_message_format | pending | Suggested subject: `feat(outbox): add artifact outbound relay flow` |
| commit_body_group | pending | `Outbound event snapshots:`;`Relay payload builders:`;`Publisher fake and relay loop:` |
| whitespace | pending | staged diff check passes. |
| required_checks | pending | Required checks have evidence. |

## Handoff Gate

| gate | status | evidence |
|---|---|---|
| committed_hash | pending | Fill after implementation commit. |
| gates_run | pending | Command list and reports. |
| tests_not_run | pending | Reason, if any. |
| remaining_blockers | pending | Blocker list or `none`. |
| next_boundary | pending | `commit-07-a` after design ledger advancement. |
| user_owned_changes_untouched | pending | File list / statement. |
