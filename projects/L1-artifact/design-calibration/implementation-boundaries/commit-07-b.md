# commit-07-b implementation ledger

| field | value |
|---|---|
| project | L1-artifact |
| boundary_id | commit-07-b |
| phase | PH-07 maintenance / rebuild / reconcile / report replay services |
| design_baseline | `formal-07-assembled-not-yet-committed` |
| implementation_repo | `/home/aris/Projects/quantalithos-artifact` |
| status | planned |
| next_allowed_action | wait_until_current |
| current_recovery_point | Future boundary. Not authorized until project ledger advances. |

## Required Reads

| document | required_section | status | notes |
|---|---|---|---|
| `projects/L1-artifact/07-实施计划.md` | §6, §7, §10, §11, §12 | pending | Maintenance jobs and report replay boundary. |
| `projects/L1-artifact/03-详细设计.md` | maintenance/rebuild/reconcile jobs and report replay | pending | Job flow source. |
| `design-calibration/03_ddd_step_07_trait_port_adapter_contracts.md` | job repositories, projection rebuild and report stores | pending | Callable surface. |
| `design-calibration/03_ddd_step_09_function_flows.md` | maintenance job flows | pending | Service orchestration. |
| `design-calibration/03_ddd_step_11_persistence_transaction_consistency.md` | job UoW and stored report replay | pending | Tx consistency. |
| `design-calibration/03_ddd_step_15_observability_audit.md` | job audit and report emission | pending | Report/audit surface. |
| `projects/L1-artifact/05-测试方案.md` | `operations-replay-core` jobs slice | pending | Required tests. |
| `projects/L1-artifact/06-验收标准.md` | `AC-ART-030`, `AC-ART-036`, `AC-ART-038`, `AC-ART-039`, `AC-ART-040` | pending | Job acceptance. |

## Allowed Scope

| type | path_or_rule | status |
|---|---|---|
| allowed_path | `/home/aris/Projects/quantalithos-artifact/crates/application/**` maintenance job service slice | pending |
| allowed_path | `/home/aris/Projects/quantalithos-artifact/crates/infra/**` job stores and fake runtime slice | pending |
| allowed_path | `/home/aris/Projects/quantalithos-artifact/crates/jobs/**` maintenance runner slice | pending |
| allowed_path | `/home/aris/Projects/quantalithos-artifact/tests/jobs/**` maintenance/replay slice | pending |
| forbidden_rule | Do not add handoff/export adapters, release scripts or final acceptance reports. | active |
| forbidden_rule | Jobs must not repair Artifact truth unless the formal flow explicitly allows the write. | active |

## Required Checks

| check | command_or_evidence | status | notes |
|---|---|---|---|
| design gate readout | maintenance target, report replay and no-truth-repair closure note | pending | Must pass before edits. |
| operations-replay-core jobs slice | rebuild/refresh/reconcile/report replay tests | pending | Required. |
| workspace check | `cargo check` | pending | Required. |
| whitespace | `git diff --check` and staged check | pending | Required. |
| staged scope | `git diff --cached --name-only` | pending | Maintenance job service scope only. |

## Commit Gate

| gate | status | evidence |
|---|---|---|
| staged_scope | pending | Maintenance job services, report replay and fake runtime only. |
| unrelated_changes | pending | User changes unstaged. |
| commit_message_format | pending | Suggested subject: `feat(job): add artifact maintenance job services` |
| commit_body_group | pending | `Maintenance job services:`;`Replay and partial report output:` |
| whitespace | pending | staged diff check passes. |
| required_checks | pending | Required checks have evidence. |

## Handoff Gate

| gate | status | evidence |
|---|---|---|
| committed_hash | pending | Fill after implementation commit. |
| gates_run | pending | Command list and reports. |
| tests_not_run | pending | Reason, if any. |
| remaining_blockers | pending | Blocker list or `none`. |
| next_boundary | pending | `commit-07-c` after design ledger advancement. |
| user_owned_changes_untouched | pending | File list / statement. |
