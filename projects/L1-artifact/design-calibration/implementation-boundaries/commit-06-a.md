# commit-06-a implementation ledger

| field | value |
|---|---|
| project | L1-artifact |
| boundary_id | commit-06-a |
| phase | PH-06 inbound consumer and event public carriers |
| design_baseline | `formal-07-assembled-not-yet-committed` |
| implementation_repo | `/home/aris/Projects/quantalithos-artifact` |
| status | planned |
| next_allowed_action | wait_until_current |
| current_recovery_point | Future boundary. Not authorized until project ledger advances. |

## Required Reads

| document | required_section | status | notes |
|---|---|---|---|
| `projects/L1-artifact/07-实施计划.md` | §6, §7, §8, §11, §12 | pending | Inbound public carrier boundary. |
| `projects/L1-artifact/03-详细设计.md` | consumer / event / receipt / outbox public contracts | pending | Formal event carrier source. |
| `design-calibration/03_ddd_step_08_protocol_contracts.md` | inbound consumer envelopes, receipts and dead-letter carriers | pending | DTO closure. |
| `design-calibration/03_ddd_step_12_error_recovery.md` | consumer disposition and retry surface | pending | Error mapping. |
| `design-calibration/03_ddd_step_13_concurrency_idempotency.md` | consumer idempotency shell | pending | Duplicate carrier source. |
| `projects/L1-artifact/05-测试方案.md` | consumer/event contract tests | pending | Required tests. |
| `projects/L1-artifact/06-验收标准.md` | `AC-ART-028`, `AC-ART-029`, `VETO-ART-005` | pending | Event seam acceptance. |

## Allowed Scope

| type | path_or_rule | status |
|---|---|---|
| allowed_path | `/home/aris/Projects/quantalithos-artifact/crates/contracts/**` consumer/event/receipt slice | pending |
| allowed_path | `/home/aris/Projects/quantalithos-artifact/crates/worker/**` input shell only | pending |
| allowed_path | `/home/aris/Projects/quantalithos-artifact/tests/contract/**` consumer/event slice | pending |
| forbidden_rule | Do not add consumer service execution, snapshot stores, publisher fake, relay loop or public jobs. | active |

## Required Checks

| check | command_or_evidence | status | notes |
|---|---|---|---|
| design gate readout | inbound carrier closure note | pending | Must pass before edits. |
| inbound event contract tests | targeted consumer/event carrier tests | pending | Required. |
| workspace check | `cargo check` | pending | Required. |
| whitespace | `git diff --check` and staged check | pending | Required. |
| staged scope | `git diff --cached --name-only` | pending | Public carrier scope only. |

## Commit Gate

| gate | status | evidence |
|---|---|---|
| staged_scope | pending | Inbound consumer/event contracts and worker input shells only. |
| unrelated_changes | pending | User changes unstaged. |
| commit_message_format | pending | Suggested subject: `feat(consumer): add inbound event carrier contracts` |
| commit_body_group | pending | `Inbound consumer contracts:`;`Worker input shells:` |
| whitespace | pending | staged diff check passes. |
| required_checks | pending | Required checks have evidence. |

## Handoff Gate

| gate | status | evidence |
|---|---|---|
| committed_hash | pending | Fill after implementation commit. |
| gates_run | pending | Command list and reports. |
| tests_not_run | pending | Reason, if any. |
| remaining_blockers | pending | Blocker list or `none`. |
| next_boundary | pending | `commit-06-b` after design ledger advancement. |
| user_owned_changes_untouched | pending | File list / statement. |
