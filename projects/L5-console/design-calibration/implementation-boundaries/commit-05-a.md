# commit-05-a implementation ledger (planned)

| field | value |
|---|---|
| project | L5-console |
| boundary_id | `commit-05-a` |
| phase | `PH-05` |
| design_baseline | `not_fixed` |
| implementation_repo | `/home/aris/Projects/quantalithos-console` (not_created) |
| status | `planned` |
| next_allowed_action | `wait_until_current` |
| planned_commit_message | `feat(console): establish topic activation boundaries` |

## Required Reads

`03-详细设计.md` §5～§8/§9；`05-测试方案.md` TOPIC/VIEW；`06-验收标准.md` AC-FR-005～010、ST-CON-007、VETO-CON-005/007；`07-实施计划.md` §5～§7。状态：`pending / wait_until_current`。

## Allowed Scope

| type | path_or_rule | status |
|---|---|---|
| allowed_file | future `src/features/**` topic descriptors, owner registry and activation tests | planned |
| allowed_rule | eight topics, canonical order and formal activation ceiling | planned |
| forbidden_rule | no owner domain copy, page-derived activation, unified readiness/health | active |
| forbidden_rule | no positive facet without formal capability/mode/context | active |

## Gate Matrix

| gate | status | evidence | next_if_failed |
|---|---|---|---|
| design_gate | blocked | owner facet/activation authority pending | wait_design |
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
| required_checks | pure-contract, module-flow, activation/registry (future) |
| committed_hash | pending; no commit exists |
| committed_message | pending |
| post_commit_status | pending |
| handoff_notes | Positive topic activation remains conditional |
