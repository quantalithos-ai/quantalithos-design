# commit-01-b implementation ledger

| field | value |
|---|---|
| project | L1-artifact |
| boundary_id | commit-01-b |
| phase | PH-01 config / script / artifact root baseline |
| design_baseline | `formal-07-assembled-not-yet-committed` |
| implementation_repo | `/home/aris/Projects/quantalithos-artifact` |
| status | planned |
| next_allowed_action | wait_until_current |
| current_recovery_point | Future boundary. Not authorized until project ledger advances from `commit-01-a`. |

## Required Reads

| document | required_section | status | notes |
|---|---|---|---|
| `projects/L1-artifact/07-实施计划.md` | §3, §4, §6, §7, §8, §10, §11 | pending | Config/script/root scope and checks. |
| `projects/L1-artifact/04-配置设计.md` | P0 profiles, source priority, strict validation | pending | Config shell must align with formal profile names. |
| `projects/L1-artifact/05-测试方案.md` | automation gates, artifact/report roots | pending | Script paths and report roots are authoritative. |
| `projects/L1-artifact/06-验收标准.md` | evidence integrity and VETO rules | pending | No static pass or fake verdict. |
| `design-calibration/07_implementation_plan_step_06_tasks_commit_boundaries.md` | `commit-01-b` rows | pending | Boundary scope and checks. |

## Allowed Scope

| type | path_or_rule | status |
|---|---|---|
| allowed_path | `/home/aris/Projects/quantalithos-artifact/config/**` | pending |
| allowed_path | `/home/aris/Projects/quantalithos-artifact/scripts/gates/**` | pending |
| allowed_path | `/home/aris/Projects/quantalithos-artifact/scripts/reports/**` | pending |
| allowed_path | `/home/aris/Projects/quantalithos-artifact/scripts/checks/**` | pending |
| allowed_path | `/home/aris/Projects/quantalithos-artifact/scripts/dev/**` | pending |
| allowed_path | `/home/aris/Projects/quantalithos-artifact/artifacts/test/.gitkeep` or equivalent root placeholder | pending |
| allowed_path | `/home/aris/Projects/quantalithos-artifact/reports/.gitkeep` or equivalent root placeholder | pending |
| allowed_rule | Minimal runtime config shell only; no business truth or real evidence. | pending |
| forbidden_rule | Do not add business DTO/domain/service/query/event/job logic. | active |
| forbidden_rule | Do not write static passed reports, final evidence, real `run_id`, VETO pass or signoff. | active |

## Required Checks

| check | command_or_evidence | status | notes |
|---|---|---|---|
| design gate readout | required reads and contradiction note | pending | Must complete before edits. |
| config parse smoke | minimal valid and invalid profile fixtures | pending | Invalid profile must fail fast. |
| scripts dry-run | `--help` or shellcheck-equivalent path dry-run | pending | No final report content required. |
| workspace check | `cargo check` | pending | Existing workspace remains compiling. |
| whitespace | `git diff --check` and staged check | pending | Required before commit. |
| staged scope | `git diff --cached --name-only` | pending | Must match allowed scope. |

## Commit Gate

| gate | status | evidence |
|---|---|---|
| staged_scope | pending | Only config / scripts / roots. |
| unrelated_changes | pending | User-owned unrelated changes remain unstaged. |
| commit_message_format | pending | Suggested subject: `chore(config): add artifact config and gate shells` |
| commit_body_group | pending | `Runtime config shell:`;`Gate and report roots:` |
| whitespace | pending | `git diff --cached --check` passes. |
| required_checks | pending | Required checks have evidence. |

## Handoff Gate

| gate | status | evidence |
|---|---|---|
| committed_hash | pending | Fill after implementation commit. |
| gates_run | pending | Config smoke / dry-run commands. |
| tests_not_run | pending | Behavioral tests not applicable unless scripts add behavior. |
| remaining_blockers | pending | Blocker list or `none`. |
| next_boundary | pending | `commit-02-a` after design ledger advancement. |
| user_owned_changes_untouched | pending | File list / statement. |
