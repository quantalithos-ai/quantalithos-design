# commit-02-a implementation ledger

| field | value |
|---|---|
| project | L1-artifact |
| boundary_id | commit-02-a |
| phase | PH-02 fact contracts / domain truth |
| design_baseline | `formal-07-assembled-not-yet-committed` |
| implementation_repo | `/home/aris/Projects/quantalithos-artifact` |
| status | planned |
| next_allowed_action | wait_until_current |
| current_recovery_point | Future boundary. Not authorized until project ledger advances. |

## Required Reads

| document | required_section | status | notes |
|---|---|---|---|
| `projects/L1-artifact/07-实施计划.md` | §2, §3, §5, §6, §7, §11, §12 | pending | Fact boundary and commit discipline. |
| `projects/L1-artifact/03-详细设计.md` | fact/intake/review/responsibility objects, protocol, state matrix | pending | Field, DTO and state names are authoritative. |
| `projects/L1-artifact/05-测试方案.md` | contract-domain fact slice | pending | Targeted tests and artifact/report expectations. |
| `projects/L1-artifact/06-验收标准.md` | `AC-ART-001~004`, `AC-ART-021`, `AC-ART-033` | pending | Acceptance risks for fact truth. |
| `design-calibration/03_ddd_step_06_object_contracts.md` | fact/intake/review/responsibility slice | pending | Object contracts. |
| `design-calibration/03_ddd_step_08_protocol_contracts.md` | fact command contracts | pending | DTO contracts. |
| `design-calibration/03_ddd_step_10_state_matrix.md` | fact state rules | pending | Legal / illegal transitions. |

## Allowed Scope

| type | path_or_rule | status |
|---|---|---|
| allowed_path | `/home/aris/Projects/quantalithos-artifact/crates/contracts/**` fact/intake/review/responsibility slice | pending |
| allowed_path | `/home/aris/Projects/quantalithos-artifact/crates/domain/**` fact/intake/review/responsibility slice | pending |
| allowed_path | `/home/aris/Projects/quantalithos-artifact/tests/contract/**` fact slice | pending |
| allowed_path | `/home/aris/Projects/quantalithos-artifact/tests/domain/**` fact slice | pending |
| forbidden_rule | Do not implement application services, repositories, API handlers, query/event/job surfaces. | active |
| forbidden_rule | Do not introduce version, lineage, baseline or consumer/event/job behavior. | active |

## Required Checks

| check | command_or_evidence | status | notes |
|---|---|---|---|
| design gate readout | field / DTO / state closure note | pending | Must pass before edits. |
| contract-domain-fast fact slice | targeted command/domain tests | pending | Required. |
| workspace check | `cargo check` | pending | Required. |
| whitespace | `git diff --check` and staged check | pending | Required. |
| staged scope | `git diff --cached --name-only` | pending | Contracts/domain/test slice only. |

## Commit Gate

| gate | status | evidence |
|---|---|---|
| staged_scope | pending | Public contracts + domain truth only. |
| unrelated_changes | pending | User changes unstaged. |
| commit_message_format | pending | Suggested subject: `feat(fact): add artifact fact contracts and domain state` |
| commit_body_group | pending | `Artifact fact contracts:`;`Fact domain state:` |
| whitespace | pending | staged diff check passes. |
| required_checks | pending | Required checks have evidence. |

## Handoff Gate

| gate | status | evidence |
|---|---|---|
| committed_hash | pending | Fill after implementation commit. |
| gates_run | pending | Command list and reports. |
| tests_not_run | pending | Reason, if any. |
| remaining_blockers | pending | Blocker list or `none`. |
| next_boundary | pending | `commit-02-b` after design ledger advancement. |
| user_owned_changes_untouched | pending | File list / statement. |
