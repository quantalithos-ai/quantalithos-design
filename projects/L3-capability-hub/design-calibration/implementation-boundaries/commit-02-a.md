# commit-02-a implementation ledger

| field | value |
|---|---|
| project | L3-capability-hub |
| boundary_id | commit-02-a |
| phase | PH-02 |
| design_baseline | pending_design_repair_commit_anchor |
| implementation_repo | /home/aris/Projects/quantalithos-capability-hub (verified Git worktree) |
| status | blocked |
| gate_status | blocked |
| next_allowed_action | wait_design |
| current_recovery_point | current boundary; selector contract repaired; freeze the real repair commit/tree before activation |

> Current blocked design-handoff skeleton. It records no `commit-02-a` implementation fact and does not authorize code changes before the repair anchor is frozen.

## Activation Guard

| rule | status | consequence |
|---|---|---|
| project ledger current_boundary equals commit-02-a | pass | This is the only current boundary. |
| predecessor handoff is closed | pass | PH-01 handoffs are recorded at `a4df225e3eba8cca611da3ca78f198ae36ec9045` and `8e4a422a4b6477afc214eec1f2db8676f0e1c7ec`. |
| activation permission | blocked | Wait for the real design repair commit/tree anchor; do not edit implementation code. |

## Required Reads

| document | required_section | status | notes |
|---|---|---|---|
| standards/document/代码实施台账与门禁规范.md | state machine and planned boundary rule | pending | Read first. |
| standards/document/设计真相源闭环与可落码性标准.md | field/DTO/Port/state/evidence closure | pending | Do not invent missing surfaces. |
| projects/L3-capability-hub/07-实施计划.md | sections 3, 6, 7, 8, 10, 11, 12 | pending | Active implementation authority. |
| projects/L3-capability-hub/design-calibration/project_execution_ledger.md | current recovery state | pending | First project-level input. |
| projects/L3-capability-hub/design-calibration/07_implementation_plan_step_06_tasks_commit_boundaries.md | commit-02-a row, batches and scope | pending | Exact boundary contract. |
| projects/L3-capability-hub/design-calibration/07_implementation_plan_step_07_tests_acceptance_gates.md | commit-02-a gate row | pending | Exact selector and command contract. |
| projects/L3-capability-hub/design-calibration/07_implementation_plan_step_08_config_environment_dependencies.md | commit-02-a readiness row | pending | Exact prerequisite and unavailable behavior. |
| projects/L3-capability-hub/design-calibration/07_implementation_plan_step_10_rollback_pause_change_control.md | PAUSE-CH-01..10 and RB-CH-01..09 | pending | Preserve user changes and failed history. |
| projects/L3-capability-hub/design-calibration/07_implementation_plan_step_11_commit_review_delivery.md | commit-02-a title/body/reviewer/handoff | pending | Planned message only. |
| formal upstream sources | formal 03 sections 5-8; DDD Steps 6, 8 and 12; formal 05 contract foundation; formal 07 sections 3, 6, 7, 8, 10, 11, 12 | pending | Exact schema and truth remain upstream-owned. |

## Allowed Scope

| type | path_or_rule | status |
|---|---|---|
| allowed_rule | contracts references/metadata/errors/shared carriers/codec and contract fixtures; English Rustdoc for all public declarations and nested fields | planned |
| allowed_rule | BATCH-02-A1 typed refs/metadata -> BATCH-02-A2 closed errors/shared carriers -> BATCH-02-A3 codec/Rustdoc fixtures | planned |
| allowed_rule | run-scoped output only under artifacts/test/<run_id> and reports/runs/<run_id> after a real run | planned |
| allowed_rule | every public declaration, struct field, enum variant/payload field, trait, method and callable has complete English /// | active |
| forbidden_rule | domain truth; repository or UoW behavior; external adapter; API/Worker/Job runtime; body or secret material | active |
| forbidden_rule | no unrelated staging or out-of-boundary file changes | active |
| forbidden_rule | no latest alias, evidence-candidates.md alias, cross-run evidence, static pass, fake commit/run/verdict/signoff | active |
| forbidden_rule | no implementation-side schema, Port, state, mapper, config, fallback or evidence invention | active |

## Batch Plan

| batch sequence | target | status |
|---|---|---|
| BATCH-02-A1 typed refs/metadata -> BATCH-02-A2 closed errors/shared carriers -> BATCH-02-A3 codec/Rustdoc fixtures | each batch is a 100-300 line locally verifiable increment | planned |

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
| boundary_readiness | core shared refs/metadata/codec candidate and safe error types must be checked against the target repo |
| primary_selector | none |
| targeted_selector | FOUNDATION-002 public refs, metadata, errors, codec and nested type fixtures; canonical assembly owner=`commit-11-a`; semantic source/oracle remains formal `03/04/05/06` and the corresponding contracts/domain/application/config/entry boundaries |
| planned_commands | cargo fmt --check; cargo check --workspace; cargo test --workspace -- contract-foundation; check_rustdoc_coverage.sh --scope contracts; targeted fixture inventory check --selector FOUNDATION-002 |
| gate_set | GATE-01, GATE-02 |
| raw_report_contract | artifacts/test/<run_id>/raw; targeted `reports/runs/<run_id>/suites/static-contract-docs/`; contract-foundation targeted fixture report; no `domain-state` report |
| evidence_contract | targeted refs/metadata/errors/codec rows record canonical assembly owner=`commit-11-a`; semantic source/oracle remains formal `03/04/05/06` and the corresponding contracts/domain/application/config/entry boundaries; no canonical TC/DS/EV-CH-FOUNDATION-002 chain and no canonical EV |
| AC_VF_VETO_direction | AC-CH-001/023/029/031; VF-CH-001/002/011; VETO-CH-001/002/011 |
| failure_return | Missing field source, codec/error contract or nested English Rustdoc returns `wait_design`; targeted verification cannot create a canonical primary and implementation must not invent a substitute type. |
| execution_status | Planned contract only; no command, test, run, artifact, report or evidence instance has been created. |
| planned reviewer | contracts owner + domain owner |
| planned title | feat(contracts): add the public capability contract foundation |
| required body groups | Typed references and metadata:; Shared contract carriers: |
| next boundary | commit-02-b |

Selector shorthand must be expanded to exact TC/DS/EV identities during implementation. Targeted rows never increase the 189 primary denominator.

## Required Checks

| check | command_or_evidence | status | notes |
|---|---|---|---|
| activation | project ledger current boundary and action | pending | Pending until this boundary is current. |
| design closure | required reads and immutable design baseline | pending | Dirty design HEAD cannot substitute for a baseline. |
| worktree ownership | target repository status and unrelated-file inventory | pending | Record before any edit. |
| format/build | planned command contract | pending | No command has run in this design task. |
| targeted behavior | public refs, metadata, errors, codec and nested type fixtures | pending | No test result exists. |
| evidence/provenance | targeted refs/metadata/errors/codec rows with canonical assembly owner=`commit-11-a`; semantic source/oracle remains formal `03/04/05/06` and the corresponding contracts/domain/application/config/entry boundaries; no canonical TC/DS/EV chain or EV | pending | Planned paths are not evidence. |
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
| targeted tests | FOUNDATION-002 contract fixtures and Rustdoc cases; exact canonical chain is deferred to `commit-11-a` | pending |
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
| commit_message_format | pending | Planned subject: feat(contracts): add the public capability contract foundation |
| commit_body_group | pending | Required groups: Typed references and metadata:; Shared contract carriers: |
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
| BLK-CH-02-A-DESIGN-SELECTOR-001 | design_gate | open | The selector contract is repaired in the design working tree, but its immutable repair commit/tree anchor is not frozen. | Commit only the capability-hub design repair, record the real anchor in the implementation ledger, then rerun activation review. | wait_design |

## Experience Review

| item | conclusion | action |
|---|---|---|
| planned boundary pre-creation | mandatory planned-ledger rule applies | Future status remains planned and no gate is pass. |
| nested Rustdoc coverage | blocking Rustdoc rule applies | Recheck declarations, fields, variants/payloads, traits, methods and callables. |
| responsibility boundary | formal 00/01/02 and VETO redlines apply | Return forbidden owner requests to the owning source. |
| evidence provenance | formal 05/06 canonical path rule applies | Generate only same-run raw-derived reports; never create aliases. |
| boundary-specific closure | formal 03/04/07 exact source applies | Missing schema, Port, state, config or selector pauses the boundary. |

## Current Conclusion

blocked / wait_design / current boundary / no implementation action authorized before the repair anchor is frozen.
