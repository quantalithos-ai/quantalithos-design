# commit-05-c implementation ledger

| field | value |
|---|---|
| project | `L2-tools` |
| boundary_id | `commit-05-c` |
| phase | `PH-05` |
| predecessor | `commit-05-b` |
| next_boundary | `commit-06-a` |
| design_baseline | `not_fixed_until_handoff` |
| implementation_repo | `/home/aris/Projects/quantalithos-tools` (`absent`) |
| status | `planned` |
| gate_status | `pending` |
| next_allowed_action | `wait_until_current` |
| current_recovery_point | `future_boundary_not_active` |

> Planned design-handoff ledger only. It contains no implementation commit, command result, run, artifact, report, evidence, verdict, risk acceptance or signoff.

## Boundary Intent

| item | contract |
|---|---|
| objective | Implement Prepared Sandbox handoff persistence, one-call phase fencing and explicit unknown resolution state. |
| formal authority | formal 03 handoff objects/CF-10/TX/CONC; formal 05 PRE-005~010/TX/CONC; formal 06 AC-017~018/VF; formal 07 §§6~10 |
| primary selector | PRE-005~010, TX-003~004 and CONC-010~014 |
| planned title | `feat(handoff): add prepared sandbox handoff fencing` |
| required body groups | `Prepared handoff persistence:`; `One-call and unknown fencing:` |
| next boundary | `commit-06-a` |

## Activation Guard

| rule | required observation | current observation | consequence |
|---|---|---|---|
| project ledger | `current_boundary = commit-05-c` | Project ledger has not advanced to this future boundary. | Remain planned; do not edit implementation files. |
| predecessor | real Commit and Handoff Gate for `commit-05-b`; `none` only for first boundary | `pending` | Inactive until predecessor is closed. |
| immutable baseline | authorized formal 00~07 baseline recorded | `not_fixed_until_handoff` | Design Gate cannot pass. |
| target worktree | authorized repository, branch and initial status recorded | repository `absent` | Worktree/Build/Test Gates cannot run. |

## Required Reads

| document | required section | status | purpose |
|---|---|---|---|
| `projects/L2-tools/design-calibration/project_execution_ledger.md` | current design recovery and `L2T-UP-001~009` | `pending` | recover project-level truth and blockers |
| `projects/L2-tools/design-calibration/implementation_execution_ledger.md` | current boundary and state machine | `pending` | prove activation authority |
| `projects/L2-tools/07-实施计划.md` | §§3, 6, 7, 8, 10, 11, 12 | `pending` | reads, scope, checks, controls, commit and completion |
| `design-calibration/07_implementation_plan_step_06_tasks_commit_boundaries.md` | exact `commit-05-c` row and batches | `pending` | exact scope and batch authority |
| `design-calibration/07_implementation_plan_step_07_tests_acceptance_gates.md` | exact `commit-05-c` selector/gate row | `pending` | test and evidence direction |
| `design-calibration/07_implementation_plan_step_08_config_environment_dependencies.md` | phase readiness and dependency classification | `pending` | environment and unavailable behavior |
| `design-calibration/07_implementation_plan_step_10_rollback_pause_change_control.md` | PAUSE/RB/change rules | `pending` | failure and recovery discipline |
| `design-calibration/07_implementation_plan_step_11_commit_review_delivery.md` | exact planned title/body groups | `pending` | commit and handoff discipline |
| formal/calibration authority | formal 03 handoff objects/CF-10/TX/CONC; formal 05 PRE-005~010/TX/CONC; formal 06 AC-017~018/VF; formal 07 §§6~10; 03 precondition/handoff object, Port, command-flow and state annexes; 03 Step 11~13 | `pending` | exact schema, flow, state and oracle source |
| governing standards | code ledger, truth-closure, directory and Rust standards | `pending` | fixed state, layout, Rustdoc and safety rules |

## Allowed Scope

| type | path_or_rule | state |
|---|---|---|
| allowed_rule | Sandbox readiness/handoff typed Port seam and deterministic blocked fake | `planned` |
| allowed_rule | `ExecutionHandoffAttempt` Store, Prepared phase-1 UoW and phase-2 CAS | `planned` |
| allowed_rule | one-call, duplicate, stale CAS, commit-unknown and manual-resolution tests | `planned` |
| allowed_rule | targeted tests and fixtures owned by this boundary may change with the owning behavior | `planned` |
| forbidden_rule | host/direct execution fallback, Sandbox run/capture/receipt/cleanup truth | `active` |
| forbidden_rule | blind retry, new idempotency key after unknown or guessed success | `active` |
| forbidden_rule | runtime recovery loop, queue/DLQ or provider readiness claim | `active` |
| forbidden_rule | no unrelated staging, cross-boundary implementation or user-owned worktree changes | `active` |
| forbidden_rule | no implementation-side schema, Port, state, config, fallback, evidence or owner invention | `active` |

## Batch Plan

| batch | objective | local gate | status |
|---|---|---|---|
| `BATCH-05-C1` | Implement readiness/handoff refs and typed carriers. | source/mapping/redaction checks | `planned` |
| `BATCH-05-C2` | Persist handoff and Prepared attempt in phase 1. | pre-call atomicity | `planned` |
| `BATCH-05-C3` | Perform exactly one Port call and phase-2 CAS. | outcome/unknown fence | `planned` |
| `BATCH-05-C4` | Add duplicate/concurrency/unknown tests. | PRE-005~010/TX/CONC closure | `planned` |

Each batch targets a 100~300 line locally reviewable increment. A larger or higher-risk change must be split without crossing this boundary.

## Design Closure Gate

| closure item | required conclusion before code | status |
|---|---|---|
| field/support carrier | every field/reason/summary/ref-set/kind/status has one formal owner and type | `pending` |
| DTO construction | request/result/event/job/receipt/report is constructible from formal metadata and sources | `pending` |
| typed reference | kind, owner, ordering, deduplication and missing semantics are exact | `pending` |
| callable/Port | domain member, Store/Port method, mapper and entry callable are exact | `pending` |
| state/transition | current/reserved/illegal/terminal/unknown and phase effects are explicit | `pending` |
| persistence/idempotency | key/digest/version/UoW/CAS/stored replay/commit unknown are closed | `pending` |
| Query/Job material | read source or frozen job plan/output is complete with no-write/no-repair | `pending` |
| config binding | formal key/source/profile/activation/failure is closed where applicable | `pending` |
| test/evidence | selector/data/raw/report/pairing/redaction/failure retention has an owner | `pending` |
| responsibility | Runtime/Hub/Auth/Sandbox/Bus/Obs/SDK truth stays outside L2 | `pending` |
| Rustdoc | all public declarations, fields, variants/payloads, traits, methods and callables have complete English `///` | `pending` |
| phase closure | no later-boundary object, result, job, report or evidence is consumed | `pending` |

Any unresolved closure item sets `gate_status=blocked` and `next_allowed_action=wait_design`; code-side aliases or defaults are forbidden.

## Required Checks

| check | planned command or oracle | current state |
|---|---|---|
| format | `cargo fmt --check` after the target workspace exists | `pending` |
| compile | `cargo check --workspace` plus affected-package check | `pending` |
| targeted behavior | readiness blocked, Prepared-before-call, exactly-one call, stale phase-two CAS, duplicate replay, commit unknown and no retry | `pending` |
| static boundary | no host execution/run/receipt/capture/cleanup; phase-one before Port; one-call counter | `pending` |
| whitespace | target repo `git diff --check`, then staged `git diff --cached --check` | `pending` |
| evidence | applicable raw/report/check remains `not_created` until a real fixed run | `not_created` |

## Worktree Gate

| check | required observation | status |
|---|---|---|
| repository | authorized target git worktree exists | `pending` |
| initial status | branch, HEAD and exact initial `git status --short` captured | `pending` |
| user-owned changes | unrelated changes identified and protected | `pending` |
| touched/staged scope | all paths map to Allowed Scope | `pending` |
| destructive actions | no reset/checkout/cleanup/cross-boundary staging | `pending` |

## Build Gate

| check | pass contract | status |
|---|---|---|
| format/compile | actual commands exit successfully with safe output recorded | `pending` |
| Rustdoc | nested public Rustdoc coverage passes review/static checks | `pending` |
| dependency/static | boundary-specific static checks pass | `pending` |
| whitespace | unstaged and staged whitespace checks pass at their gate | `pending` |

## Test Gate

| check | contract | status |
|---|---|---|
| selector | PRE-005~010, TX-003~004 and CONC-010~014 expands to exact formal TC identities at execution time | `pending` |
| positive/negative | readiness blocked, Prepared-before-call, exactly-one call, stale phase-two CAS, duplicate replay, commit unknown and no retry | `pending` |
| replay/concurrency | applicable duplicate, stale, race, unknown and no-write/no-repair branches run | `pending` |
| affected regression | owning suites run without changing the canonical 234 denominator | `pending` |
| failure retention | failures remain immutable and addressable | `pending` |

## Evidence Gate

| item | canonical contract | current state |
|---|---|---|
| raw artifacts | `artifacts/test/<run_id>` with explicit run/profile/baseline context | `not_created` |
| reports | `reports/runs/<run_id>` derived from matching same-run raw | `not_created` |
| checks/index | applicable mandatory checks and evidence index with same-run provenance | `not_created` |
| acceptance | only `draft / review_required`; no verdict, risk acceptance or signoff | `not_created` |

Paths and schemas in this section are not evidence until a real run creates valid same-run material. `latest`, static pass and cross-run stitching are forbidden.

## Gate Matrix

| gate | status | evidence | next_if_failed |
|---|---|---|---|
| activation_gate | `pending` | Project ledger has not advanced to this future boundary. | `wait_until_current` |
| design_gate | `pending` | Immutable baseline and required-read evidence are absent. | `wait_design` |
| scope_gate | `pending` | No target-repository diff exists. | `fix_gate_failure` |
| worktree_gate | `pending` | Target repository audit is absent. | `fix_gate_failure` |
| build_gate | `pending` | No build command has run. | `fix_gate_failure` |
| test_gate | `pending` | No targeted test has run. | `fix_gate_failure` |
| evidence_gate | `pending` | No raw/report/evidence instance exists. | `fix_gate_failure` |
| commit_gate | `pending` | No staged scope or commit exists. | `fix_gate_failure` |
| handoff_gate | `pending` | No implementation handoff exists. | `handoff` |

## Commit Gate

| item | pass condition | status |
|---|---|---|
| staged_scope | only this boundary's allowed files are staged | `pending` |
| unrelated_changes | user and other-agent changes remain untouched and unstaged | `pending` |
| commit_message | planned subject is `feat(handoff): add prepared sandbox handoff fencing` with required groups `Prepared handoff persistence:` and `One-call and unknown fencing:` | `pending` |
| Rustdoc/source language | complete English public Rustdoc and repository source-language rules | `pending` |
| whitespace | staged whitespace check passes | `pending` |
| required_checks | every applicable check has actual evidence or reasoned N/A | `pending` |

## Commit Record

| field | value |
|---|---|
| planned_commit_message | `feat(handoff): add prepared sandbox handoff fencing`; planned only |
| staged_files_checked | `pending` |
| commit_message_checked | `pending` |
| committed_hash | `none` |
| committed_message | `none` |
| post_commit_status | `pending` |

## Handoff Gate

| item | required record | status |
|---|---|---|
| committed hash/message | exact real commit values | `pending` |
| gates run | actual commands and safe same-run paths | `pending` |
| tests not run | exact selector and reason; no silent omission | `pending` |
| blockers | remaining structured blocker IDs and owners | `pending` |
| next boundary | must become `commit-06-a` only after project-ledger transition | `pending` |
| user changes | actual protected worktree changes | `pending` |
| conclusion | never prefill pass or completion | `pending` |

## Blockers

| blocker_id | gate/scope | status | reason | next_allowed_action |
|---|---|---|---|---|
| `BLK-L2T-COMMIT_05_C-ACTIVATION-001` | Activation | `planned` | Project ledger has not advanced through predecessor handoff. | `wait_until_current` |
| `L2T-UP-003~004` | conditional positive scope | `open_upstream` | Sandbox mapping, receipt, feedback, cleanup and DLQ positive contracts remain open. | `wait_design for positive run/receipt claims; keep local handoff state only` |

Upstream seam blockers do not become local success through fakes. Unaffected local/negative work may proceed only after this boundary is actually activated.

## Experience Review

| item | conclusion | action |
|---|---|---|
| boundary-specific review | Prepared marker, phase boundary, one-call, unknown and stored replay are mandatory; any host fallback or blind retry is forbidden. | Recheck the exact formal/calibration sources before implementation. |
| ownership | Runtime/Hub/Auth/Sandbox/Bus/Obs/SDK redlines remain binding. | Return owner-truth requests to the owning project. |
| evidence provenance | same-run/no-static/no-cross-run rules apply. | Preserve failed material; never create aliases or pass files. |
| planned skeleton | file presence is not activation or progress. | Keep all gates non-pass until actual evidence exists. |
| design-time truthfulness | no implementation fact exists. | Do not infer a commit, command result, run, evidence, verdict or signoff. |

## Current Conclusion

`planned / wait_until_current / implementation not authorized`.
