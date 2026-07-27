# commit-02-c implementation ledger

| field | value |
|---|---|
| project | L3-capability-hub |
| boundary_id | commit-02-c |
| phase | PH-02 |
| design_baseline | planned-after-commit-02-b |
| implementation_repo | /home/aris/Projects/quantalithos-capability-hub (not established) |
| status | planned |
| gate_status | pending |
| next_allowed_action | wait_until_current |
| current_recovery_point | future boundary; wait for project ledger activation |

> Planned design-handoff skeleton only. It contains no implementation fact and does not authorize code changes.

## Activation Guard

| rule | status | consequence |
|---|---|---|
| project ledger current_boundary equals commit-02-c | pending | Future boundary stays inactive until project ledger advances. |
| predecessor handoff is closed | pending | A real predecessor Commit and Handoff Gate are required. |
| activation permission | pending | Activate only through the project ledger. |

## Required Reads

| document | required_section | status | notes |
|---|---|---|---|
| standards/document/代码实施台账与门禁规范.md | state machine and planned boundary rule | pending | Read first. |
| standards/document/设计真相源闭环与可落码性标准.md | field/DTO/Port/state/evidence closure | pending | Do not invent missing surfaces. |
| projects/L3-capability-hub/07-实施计划.md | sections 3, 6, 7, 8, 10, 11, 12 | pending | Active implementation authority. |
| projects/L3-capability-hub/design-calibration/project_execution_ledger.md | current recovery state | pending | First project-level input. |
| projects/L3-capability-hub/design-calibration/07_implementation_plan_step_06_tasks_commit_boundaries.md | commit-02-c row, batches and scope | pending | Exact boundary contract. |
| projects/L3-capability-hub/design-calibration/07_implementation_plan_step_07_tests_acceptance_gates.md | commit-02-c gate row | pending | Exact selector and command contract. |
| projects/L3-capability-hub/design-calibration/07_implementation_plan_step_08_config_environment_dependencies.md | commit-02-c readiness row | pending | Exact prerequisite and unavailable behavior. |
| projects/L3-capability-hub/design-calibration/07_implementation_plan_step_10_rollback_pause_change_control.md | PAUSE-CH-01..10 and RB-CH-01..09 | pending | Preserve user changes and failed history. |
| projects/L3-capability-hub/design-calibration/07_implementation_plan_step_11_commit_review_delivery.md | commit-02-c title/body/reviewer/handoff | pending | Planned message only. |
| formal upstream sources | formal 03 sections 7 and 11-13; DDD Steps 7, 9, 11 and 13; formal 05 transaction contracts; formal 07 sections 3, 6, 7, 8, 10, 11, 12 | pending | Exact schema and truth remain upstream-owned. |

## Allowed Scope

| type | path_or_rule | status |
|---|---|---|
| allowed_rule | 36 Ports; 22 repositories and 110 methods; UoW/TX; idempotency/stored-result/replay carriers; parity-complete fakes | planned |
| allowed_rule | BATCH-02-C1 Port declarations -> BATCH-02-C2 UoW/transaction shell -> BATCH-02-C3 idempotency/stored result -> BATCH-02-C4 fake parity | planned |
| allowed_rule | run-scoped output only under artifacts/test/<run_id> and reports/runs/<run_id> after a real run | planned |
| allowed_rule | every public declaration, struct field, enum variant/payload field, trait, method and callable has complete English /// | active |
| forbidden_rule | concrete capability service; API/Worker/Jobs entry runtime; hidden finder or second authority; sibling Cargo dependencies | active |
| forbidden_rule | no unrelated staging or out-of-boundary file changes | active |
| forbidden_rule | no latest alias, evidence-candidates.md alias, cross-run evidence, static pass, fake commit/run/verdict/signoff | active |
| forbidden_rule | no implementation-side schema, Port, state, mapper, config, fallback or evidence invention | active |

## Batch Plan

| batch sequence | target | status |
|---|---|---|
| BATCH-02-C1 Port declarations -> BATCH-02-C2 UoW/transaction shell -> BATCH-02-C3 idempotency/stored result -> BATCH-02-C4 fake parity | each batch is a 100-300 line locally verifiable increment | planned |

## Design Closure Gate

| closure item | required conclusion before code | status |
|---|---|---|
| field/support carrier | every required field/reason/summary/ref-set/kind/status has one formal source and owner | pending |
| DTO construction | request/event/job input and result/receipt/report replay surface are exact | pending |
| typed-ref identity | kind/variant, owner, ordering, deduplication and missing semantics are closed | pending |
| Port/repository | method, key, return, version, conflict and UoW order match formal 03 | pending |
| state/transition | current/reserved/illegal and terminal/degraded oracle are closed | pending |
| metadata/idempotency | digest, reserve, winner, stored result/receipt/report and replay are closed | pending |
| Query/read material | visibility/page/marker/freshness/degraded/no-write order is closed where applicable | pending |
| event/job surface | snapshot/capture/receipt/frozen plan/target/final report/reentry are closed where applicable | pending |
| config binding | formal 04 key/source/profile/activation/failure and unavailable mapping are closed | pending |
| evidence | raw schema, explicit roots, builder, digest/pairing/redaction source are closed | pending |
| responsibility | runtime/tools/approval/body/provider/marketplace/SDK client/backend remain outside Hub | pending |
| Rustdoc | public declarations, struct fields, variants/payloads, traits, methods and callables have complete English ///; no field-level pub on struct variants | pending |
| phase closure | this boundary does not consume a later phase object, service, job, report or evidence | pending |

## Exact Step 7 Gate Contract

| field | exact contract |
|---|---|
| boundary_readiness | 36 Ports, 22/110 repository surface, UoW, idempotency/result/capture/job fake shell |
| primary_selector | FOUNDATION-003,004,016,018; TX-001..022 |
| targeted_selector | Port/repository method parity, UoW, idempotency, stored result and fake parity |
| planned_commands | cargo fmt --check; cargo check --workspace; cargo test --workspace -- application-transaction; run_pr_gate.sh --run-id <run_id> --artifact-root <root> --suite repository-transaction; check_rustdoc_coverage.sh --scope application; check_case_manifest.sh --selector FOUNDATION-003,004,016,018,TX-001..022 |
| gate_set | GATE-01, GATE-02, GATE-04, GATE-07 |
| raw_report_contract | artifacts/test/<run_id>/raw; reports/runs/<run_id>/suites/repository-transaction/; reports/runs/<run_id>/checks/case-manifest/ |
| evidence_contract | 22 TX rows with authority, UoW order, commit tri-state, winner/replay/corruption; fake cannot bypass version or idempotency |
| AC_VF_VETO_direction | AC-CH-023/025/029/030/036; VF-CH-009/010/012; VETO-CH-009/010/012; VETO-CH-P-009 |
| failure_return | Port/repository/UoW ordering, idempotency winner or commit-unknown mismatch returns `wait_design`; fake parity cannot hide a missing durable authority. |
| execution_status | Planned contract only; no command, test, run, artifact, report or evidence instance has been created. |
| planned reviewer | application owner + transaction reviewer |
| planned title | feat(application): add ports transactions and replay foundations |
| required body groups | Application ports and transactions:; Replay and fake parity: |
| next boundary | commit-03-a |

Selector shorthand must be expanded to exact TC/DS/EV identities during implementation. Targeted rows never increase the 189 primary denominator.

## Required Checks

| check | command_or_evidence | status | notes |
|---|---|---|---|
| activation | project ledger current boundary and action | pending | Pending until this boundary is current. |
| design closure | required reads and immutable design baseline | pending | Dirty design HEAD cannot substitute for a baseline. |
| worktree ownership | target repository status and unrelated-file inventory | pending | Record before any edit. |
| format/build | planned command contract | pending | No command has run in this design task. |
| targeted behavior | Port/repository method parity, UoW, idempotency, stored result and fake parity | pending | No test result exists. |
| evidence/provenance | 22 TX rows with authority, UoW order, commit tri-state, winner/replay/corruption; fake cannot bypass version or idempotency | pending | Planned paths are not evidence. |
| Rustdoc | declaration, field, variant/payload, trait, method and callable coverage | pending | Missing English /// blocks Commit Gate. |
| responsibility/dependency | scope-appropriate checks | pending | Forbidden owner leakage is a veto. |
| whitespace/staged scope | git diff --check; git diff --cached --check; staged-name review | pending | Must be target-repository output. |

## Worktree Gate

| check | required observation | status |
|---|---|---|
| target repository | path, authorized git worktree, branch and baseline recorded before activation | pending |
| initial status | exact git status captured before edits | pending |
| user-owned changes | unrelated files remain unstaged and untouched | pending |
| scope ownership | touched paths map only to this boundary | pending |
| destructive actions | no reset, checkout, cleanup or cross-boundary staging | pending |

## Build Gate

| check | planned command or oracle | status |
|---|---|---|
| format | cargo fmt --check | pending |
| compile | cargo check --workspace and affected-package check | pending |
| Rustdoc | complete English Rustdoc coverage for declarations, fields, variants/payloads, traits, methods and callables | pending |
| static/dependency | exact Step 7 dependency/config/responsibility/schema checks | pending |
| whitespace | git diff --check before staging | pending |

## Test Gate

| check | contract | status |
|---|---|---|
| targeted tests | exact Step 7 selector and boundary cases | pending |
| negative branches | invalid state/config and forbidden responsibility behavior | pending |
| replay/no-write | applicable duplicate, race, replay, no-write, capture and terminal branches | pending |
| denominator | targeted regression does not add to canonical 189 primary denominator | pending |
| failure retention | failed, blocked, timeout, flaky and invalid attempts remain immutable | pending |

## Evidence Gate

| check | planned canonical contract | status |
|---|---|---|
| raw artifact | artifacts/test/<run_id>/raw from a real run | not_created |
| report | reports/runs/<run_id>/suites and checks from same-run raw | not_created |
| evidence index | reports/runs/<run_id>/evidence-index.md and .json only | not_created |
| provenance | same-run digest pairing and redaction/dependency audit | not_created |

No planned path is evidence until a real run creates it. latest and evidence-candidates.md aliases are forbidden.

## Gate Matrix

| gate | status | evidence | next_if_failed |
|---|---|---|---|
| activation_gate | pending | Wait for project ledger activation. | wait_until_current |
| design_gate | pending | Required reads and baseline are pending. | wait_design |
| scope_gate | pending | No implementation diff exists. | fix_gate_failure |
| worktree_gate | pending | No target-repository audit exists. | fix_gate_failure |
| build_gate | pending | No build or Rustdoc command has run. | fix_gate_failure |
| test_gate | pending | No targeted test has run. | fix_gate_failure |
| evidence_gate | pending | No raw/report/evidence instance exists. | fix_gate_failure |
| commit_gate | pending | No staged files or commit exists. | fix_gate_failure |
| handoff_gate | pending | No implementation handoff exists. | handoff |

## Evidence Contract

| item | planned canonical contract | current state |
|---|---|---|
| raw artifacts | artifacts/test/<run_id>/raw with explicit run/profile/entry/baseline metadata | not_created |
| suite reports | reports/runs/<run_id>/suites/<suite-id>.md from same-run raw | not_created |
| gate summary | reports/runs/<run_id>/gate-summary.md and .json | not_created |
| evidence index | reports/runs/<run_id>/evidence-index.md and .json only | not_created |
| redaction/dependency audit | reports/runs/<run_id>/redaction-check.md and dependency-boundary.md | not_created |
| acceptance/review draft | only under reports/acceptance or reports/review where applicable; never final verdict | not_created |

No path in this section is evidence until a real run creates it with same-run provenance. latest and evidence-candidates.md are forbidden.

## Pause and Rollback Rules

| rule | trigger | action |
|---|---|---|
| PAUSE-CH-01 | repository/core/toolchain/P0 root missing | pause and preserve prerequisite blocker |
| PAUSE-CH-02 | formal field/DTO/Port/state/config/evidence conflict | blocked + wait_design; return to owning source |
| PAUSE-CH-03 | scope or boundary drift | pause; change-control review before further edit |
| PAUSE-CH-04 | unowned user/agent worktree changes | protect worktree; do not stage or clean unrelated files |
| PAUSE-CH-05 | format/build/test/Rustdoc failure | blocked + fix_gate_failure; rerun required gates |
| PAUSE-CH-06 | artifact/report/pairing/redaction/dependency failure | preserve failed raw/report; repair provenance or design |
| PAUSE-CH-07 | VETO/S/current P0 A | pause; no waiver; fix and rerun |
| PAUSE-CH-08 | baseline drift | invalidate eligibility; freeze new baseline and rerun |
| PAUSE-CH-09 | selected dependency unavailable | record blocked_dependency; do not compensate P0 |
| PAUSE-CH-10 | Spike/OQ deadline or uncertainty | pause affected scope; adopt/reject/reopen decision required |
| RB-CH-01..09 | worktree, fix-forward, design, config, credential, run, selected-product or Spike case | preserve history; no hard reset, cross-run stitching, fallback or truth repair |

## Commit Gate

| gate | status | evidence |
|---|---|---|
| staged_scope | pending | Only this boundary allowed scope may be staged. |
| unrelated_changes | pending | User-owned and other-agent files remain untouched and unstaged. |
| commit_message_format | pending | Planned subject: feat(application): add ports transactions and replay foundations |
| commit_body_group | pending | Required groups: Application ports and transactions:; Replay and fake parity: |
| rustdoc_coverage | pending | All public declarations and nested fields/variants/payloads/traits/methods/callables have English ///. |
| whitespace | pending | git diff --cached --check must pass in target repository. |
| required_checks | pending | Every applicable check has real evidence or explicit not_applicable reason. |

## Commit Record

| field | value |
|---|---|
| planned_commit_message | pending planned title only; no commit exists in this design task |
| staged_files_checked | pending |
| commit_message_checked | pending |
| committed_hash | pending; fill only after a real implementation commit |
| committed_message | pending; fill only after reviewing the real message |
| post_commit_status | pending |

## Handoff Gate

| gate | status | evidence |
|---|---|---|
| committed_hash | pending | Fill only after a real implementation commit. |
| committed_message | pending | Fill only after reviewing the real message file. |
| gates_run | pending | List actual commands and same-run paths. |
| tests_not_run | pending | State exact non-run reason; do not hide missing tests. |
| remaining_blockers | pending | Link structured blockers and owners. |
| next_boundary | pending | Must match project ledger after real handoff. |
| user_owned_changes_untouched | pending | Record actual target worktree ownership. |
| final_conclusion | pending | Never prefill pass. |

## Blockers

| blocker_id | gate | status | blocking_reason | requested_design_closure | next_allowed_action |
|---|---|---|---|---|---|
| BLK-CH-02-C-ACTIVATION-001 | activation_gate | planned | Project ledger has not advanced to this future boundary. | Advance the project ledger through the predecessor handoff and set this boundary current. | wait_until_current |

## Experience Review

| item | conclusion | action |
|---|---|---|
| planned boundary pre-creation | mandatory planned-ledger rule applies | Future status remains planned and no gate is pass. |
| nested Rustdoc coverage | blocking Rustdoc rule applies | Recheck declarations, fields, variants/payloads, traits, methods and callables. |
| responsibility boundary | formal 00/01/02 and VETO redlines apply | Return forbidden owner requests to the owning source. |
| evidence provenance | formal 05/06 canonical path rule applies | Generate only same-run raw-derived reports; never create aliases. |
| boundary-specific closure | formal 03/04/07 exact source applies | Missing schema, Port, state, config or selector pauses the boundary. |

## Current Conclusion

planned / wait_until_current / implementation not authorized.
