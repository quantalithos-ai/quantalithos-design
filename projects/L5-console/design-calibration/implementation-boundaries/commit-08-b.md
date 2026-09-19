# commit-08-b implementation ledger (planned)

| field | value |
|---|---|
| project | L5-console |
| boundary_id | `commit-08-b` |
| phase | `PH-08` |
| design_baseline | `not_fixed` |
| implementation_repo | `/home/aris/Projects/quantalithos-console` (not_created) |
| status | `planned` |
| next_allowed_action | `wait_until_current` |
| planned_commit_message | `chore(console): generate evidence candidates from runs` |

## Required Reads

`05-测试方案.md` §9/§13/§14；`06-验收标准.md` §10～§14；`07-实施计划.md` §7/§9/§12。状态：`pending / wait_until_current`。

## Allowed Scope

| type | path_or_rule | status |
|---|---|---|
| allowed_file | future `scripts/reports/**` run reports and evidence candidate generator | planned |
| allowed_rule | candidate only from same-run raw/report/digest/source pairing | planned |
| forbidden_rule | no static JSON, cross-run merge, manual source injection, formal EV/verdict/signoff/readiness | active |

## Gate Matrix

| gate | status | evidence | next_if_failed |
|---|---|---|---|
| design_gate | blocked | baseline/run/report authority absent | wait_design |
| scope_gate | pending |  | fix_gate_failure |
| worktree_gate | pending |  | fix_gate_failure |
| build_gate | pending |  | fix_gate_failure |
| test_gate | pending |  | fix_gate_failure |
| evidence_gate | pending |  | fix_gate_failure |
| commit_gate | pending |  | fix_gate_failure |
| handoff_gate | pending |  | handoff |

## Commit / Handoff Record

| field | value |
|---|---|
| staged_files_checked | pending |
| required_checks | report-generation-audit, pairing/redaction/no-static (future) |
| committed_hash | pending; no commit exists |
| committed_message | pending |
| post_commit_status | pending |
| handoff_notes | EV candidate is not formal EV; no source means no candidate |
