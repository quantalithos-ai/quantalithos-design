# commit-08-a implementation ledger

| field | value |
|---|---|
| project | L1-artifact |
| boundary_id | commit-08-a |
| phase | PH-08 gate/check/report generator shell and evidence index shell |
| design_baseline | `formal-07-assembled-not-yet-committed` |
| implementation_repo | `/home/aris/Projects/quantalithos-artifact` |
| status | planned |
| next_allowed_action | wait_until_current |
| current_recovery_point | Future boundary. Not authorized until project ledger advances. |

## Required Reads

| document | required_section | status | notes |
|---|---|---|---|
| `projects/L1-artifact/07-实施计划.md` | §6, §7, §8, §9, §10, §11, §12 | pending | Release gate shell and no-static-evidence rules. |
| `projects/L1-artifact/04-配置设计.md` | runtime profile and script args | pending | Config binding. |
| `projects/L1-artifact/05-测试方案.md` | automation gates and evidence index | pending | Report generation source. |
| `projects/L1-artifact/06-验收标准.md` | `AC-ART-050`~`AC-ART-055`, `VETO-ART-006`~`VETO-ART-008` | pending | Evidence and redline acceptance. |
| `standards/document/代码实施台账与门禁规范.md` | Commit Gate and Handoff Gate | pending | Ledger closure. |

## Allowed Scope

| type | path_or_rule | status |
|---|---|---|
| allowed_path | `/home/aris/Projects/quantalithos-artifact/scripts/gates/**` release gate shell | pending |
| allowed_path | `/home/aris/Projects/quantalithos-artifact/scripts/checks/**` dependency/redaction/report checks | pending |
| allowed_path | `/home/aris/Projects/quantalithos-artifact/scripts/reports/**` evidence index shell | pending |
| allowed_path | `/home/aris/Projects/quantalithos-artifact/tests/scripts/**` or equivalent script tests | pending |
| forbidden_rule | Do not add new business functionality or final release smoke assertions. | active |
| forbidden_rule | Do not write static passed reports, real `EV-ART-*` aliases, final verdict, signoff or fake `run_id`. | active |

## Required Checks

| check | command_or_evidence | status | notes |
|---|---|---|---|
| design gate readout | evidence source and no-static-evidence closure note | pending | Must pass before edits. |
| release gate dry-run | gate shell dry-run using candidate inputs | pending | Required. |
| dependency-boundary dry-run | only-core compile dependency report shell | pending | Required. |
| redaction/report shell dry-run | redaction and report audit shell | pending | Required. |
| no-static-evidence guard | generated reports must derive from raw inputs | pending | Required. |
| workspace check | `cargo check` if code/manifests are touched | pending | Required when applicable. |
| whitespace | `git diff --check` and staged check | pending | Required. |
| staged scope | `git diff --cached --name-only` | pending | Scripts/report shell scope only. |

## Commit Gate

| gate | status | evidence |
|---|---|---|
| staged_scope | pending | Gate/check/report shell and evidence index guardrails only. |
| unrelated_changes | pending | User changes unstaged. |
| commit_message_format | pending | Suggested subject: `chore(release): add artifact release gate shells` |
| commit_body_group | pending | `Release gate shell:`;`Evidence index guardrails:` |
| whitespace | pending | staged diff check passes. |
| required_checks | pending | Required checks have evidence. |

## Handoff Gate

| gate | status | evidence |
|---|---|---|
| committed_hash | pending | Fill after implementation commit. |
| gates_run | pending | Command list and reports. |
| tests_not_run | pending | Reason, if any. |
| remaining_blockers | pending | Blocker list or `none`. |
| next_boundary | pending | `commit-08-b` after design ledger advancement. |
| user_owned_changes_untouched | pending | File list / statement. |
