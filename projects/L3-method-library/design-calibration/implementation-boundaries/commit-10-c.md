# commit-10-c implementation ledger

| field | value |
|---|---|
| project | L3-method-library |
| boundary_id | commit-10-c |
| phase | PH-10 operations jobs, replay, recovery and reports |
| design_baseline | `planned-after-d3faf90-handoff-ledger` |
| implementation_repo | `/home/aris/Projects/quantalithos-method-library` |
| status | planned |
| next_allowed_action | wait_until_current |
| current_recovery_point | future recovery/replay/handoff job behavior boundary; cannot start until `commit-10-b` is implemented and project ledger advances |

---

## Activation Guard

| rule | status | consequence |
|---|---|---|
| project ledger current_boundary must equal `commit-10-c` | planned | If project ledger still points to an earlier boundary, implementation agent must not use this file to modify code. |
| `commit-10-b` handoff must be closed | planned | Read material refresh job family must exist before recovery/replay/handoff job behavior starts. |
| project ledger must set `next_allowed_action = read_docs` for `commit-10-c` | planned | Until then this boundary remains `wait_until_current`. |

---

## Required Reads

| document | required_section | status | notes |
|---|---|---|---|
| `standards/document/代码实施台账与门禁规范.md` | planned boundary activation, gate matrix, commit and handoff rules | pending | This future boundary cannot be executed until it becomes current. |
| `standards/document/设计真相源闭环与可落码性标准.md` | no invented recovery task, stored report replay, partial issue, handoff/export, marker, report or evidence schema | pending | Missing recovery/replay/handoff closure must return to design. |
| `standards/coding/rust.md` | Rust jobs/application/infra/worker module, error and test conventions | pending | Source identifiers, comments, rustdoc, errors and test names must be English. |
| `projects/L3-method-library/00-需求文档.md` | operations replay, recovery no truth repair, stored report replay and handoff/export scope | pending | Recovery jobs may record convergence summaries/issues only; they must not repair core truth. |
| `projects/L3-method-library/01-架构设计.md` | operations job boundary, replay boundary, handoff/export seam and release evidence boundary | pending | Handoff/export seam must not become release evidence verdict or external business truth. |
| `projects/L3-method-library/02-概要设计.md` | 8 Operations Job family, recovery/replay/handoff outline and report replay | pending | Use current job protocol; do not add report generator or release signoff here. |
| `projects/L3-method-library/03-详细设计.md` | recovery convergence, partial issue, stored report replay, checkpoint, handoff/export seam, state and errors | pending | Formal source for recovery inputs, issue/report surfaces, replay source and handoff/export outcome. |
| `projects/L3-method-library/04-配置设计.md` | operations-replay profile, job run input, handoff/export target seam and report store binding | pending | Do not invent real scheduler, lease, retry, target, transport, export sink or release config. |
| `projects/L3-method-library/05-测试方案.md` | operations-replay-core recovery/replay/handoff, entry-worker-job job slice and artifact/report rules | pending | Recovery/handoff reports must derive from raw run artifacts if generated. |
| `projects/L3-method-library/06-验收标准.md` | ML-SYNC-005, ML-JOB-TX-001, ML-IDEMP, ML-CHKPT, ML-NFR-006 and `VETO-ML-010` | pending | Duplicate rerun, partial no report, truth repair or unsafe handoff blocks implementation. |
| `projects/L3-method-library/07-实施计划.md` | §3, §6, §7, §8, §11 and §12 | pending | Current source for phase, boundary, allowed scope, checks and commit discipline. |
| `projects/L3-method-library/design-calibration/03_ddd_step_05_module_contracts.md` | jobs module, recovery/replay and handoff/export boundary | pending | Keep recovery/handoff jobs separate from release report generator and acceptance handoff shell. |
| `projects/L3-method-library/design-calibration/03_ddd_step_06_object_contracts.md` | recovery task, recovery issue, progress, checkpoint, run history, stored report and handoff/export refs | pending | Required typed refs, issue fields, marker fields and body-free report/handoff fields must be formal. |
| `projects/L3-method-library/design-calibration/03_ddd_step_07_trait_port_adapter.md` | recovery repositories, stored report replay, checkpoint/report/progress stores, handoff/export ports and runner seams | pending | Do not add ports, stores, mappers, adapters or fakes beyond formal contracts. |
| `projects/L3-method-library/design-calibration/03_ddd_step_08_protocol_contracts.md` | recovery job input/result/report shells, stored report replay and handoff/export safe result | pending | Public job/handoff surfaces must be safe, refs-only and replayable. |
| `projects/L3-method-library/design-calibration/03_ddd_step_09_function_flows.md` | `RunConsistencyRecoveryConvergenceFlow`, duplicate replay, partial failure, completion, stored report and handoff hint overlays | pending | Implement recovery/replay/handoff behavior only; refresh family belongs to `commit-10-b`. |
| `projects/L3-method-library/design-calibration/03_ddd_step_10_state_machine.md` | recovery task, recovery issue, progress/checkpoint/report, handoff outcome and idempotency/replay states | pending | Job-local completion does not mean business truth repaired or release accepted. |
| `projects/L3-method-library/design-calibration/03_ddd_step_11_persistence_tx_consistency.md` | recovery issue store, stored report/checkpoint persistence, run history, handoff/export outcome persistence and transaction consistency | pending | Recovery/handoff must preserve replayability and must not mutate truth. |
| `projects/L3-method-library/design-calibration/03_ddd_step_12_errors_recovery.md` | formal intervention required, partial issue, blocked/unavailable/degraded and handoff/export safe failures | pending | Safe issues and handoff outcomes must be marker-sourced and body-free. |
| `projects/L3-method-library/design-calibration/03_ddd_step_13_concurrency_idempotency.md` | duplicate replay, resume/reentry, stored report replay, commit unknown and no rerun/no repair constraints | pending | Duplicate recovery/handoff must replay stored surface and must not rerun mutation. |
| `projects/L3-method-library/design-calibration/03_ddd_step_16_test_cut.md` | operations job tests, stored replay, checkpoint/resume, partial failure, handoff job slice and no truth repair | pending | Use operations-replay-core and entry-worker-job job slice only. |
| `projects/L3-method-library/design-calibration/07_implementation_plan_step_06_tasks_commit_boundaries.md` | `commit-10-c` row | pending | Allowed scope is recovery convergence, partial issue, stored report replay and handoff/export seam. |
| `projects/L3-method-library/design-calibration/07_implementation_plan_step_07_test_acceptance_gates.md` | `commit-10-c` gate row and PH-10 gate | pending | Required checks are operations-replay-core recovery/replay/handoff and entry-worker-job job slice. |
| `projects/L3-method-library/design-calibration/07_implementation_plan_step_11_commit_review_delivery.md` | `commit-10-c` commit body grouping | pending | Commit body must include `Recovery and handoff jobs:` and `Stored report replay:`. |
| `/home/aris/Projects/quantalithos-method-library` git status and `commit-10-b` handoff state | latest implementation state | pending | Must confirm refresh job family landed before this boundary starts. |

---

## Allowed Scope

| type | path_or_rule | status |
|---|---|---|
| allowed_path | `/home/aris/Projects/quantalithos-method-library/crates/jobs/src/**` for recovery convergence, stored report replay, partial issue and handoff/export job behavior assigned to `commit-10-c` | planned |
| allowed_path | `/home/aris/Projects/quantalithos-method-library/crates/jobs/tests/**` for operations-replay-core recovery/replay/handoff and entry-worker-job job slice tests | planned |
| allowed_path | `/home/aris/Projects/quantalithos-method-library/crates/application/src/**` for recovery orchestration services, issue/report save calls, stored report replay calls, checkpoint/progress calls and handoff/export seam calls assigned to `commit-10-c` | planned |
| allowed_path | `/home/aris/Projects/quantalithos-method-library/crates/application/tests/**` for recovery/replay/handoff orchestration and no truth repair service tests if formal workspace uses application-level tests | planned |
| allowed_path | `/home/aris/Projects/quantalithos-method-library/crates/infra/src/**` for formally defined in-memory/fake recovery issue store, stored report store, checkpoint/progress store and handoff/export fake needed by tests | planned |
| allowed_path | `/home/aris/Projects/quantalithos-method-library/crates/infra/tests/**` for recovery issue/report/checkpoint/handoff fake tests | planned |
| allowed_path | `/home/aris/Projects/quantalithos-method-library/crates/worker/src/**` only for job entry runner glue assigned to the formal entry-worker-job job slice | planned |
| allowed_path | `/home/aris/Projects/quantalithos-method-library/crates/worker/tests/**` only for job runner entry slice tests if formal workspace uses worker-level tests | planned |
| allowed_path | `/home/aris/Projects/quantalithos-method-library/crates/contracts/src/**` only for narrow recovery issue, handoff/export outcome or stored report replay fields already formalized but not landed in `commit-10-a` / `commit-10-b` | planned |
| allowed_path | `/home/aris/Projects/quantalithos-method-library/crates/domain/src/**` only for narrow recovery issue/report/checkpoint state guards explicitly defined by formal design | planned |
| allowed_path | `/home/aris/Projects/quantalithos-method-library/artifacts/test/<run_id>/suites/operations-replay-core/**` only if generated by an actual targeted run after activation | planned |
| allowed_path | `/home/aris/Projects/quantalithos-method-library/artifacts/test/<run_id>/suites/entry-worker-job/**` only if generated by an actual targeted job entry slice run after activation | planned |
| allowed_path | `/home/aris/Projects/quantalithos-method-library/reports/runs/<run_id>/suites/operations-replay-core.md` only if generated from raw artifact after activation | planned |
| allowed_path | `/home/aris/Projects/quantalithos-method-library/reports/runs/<run_id>/suites/entry-worker-job.md` only if generated from raw artifact after activation | planned |
| allowed_rule | Implement recovery convergence, formal intervention issue recording, partial issue/report behavior, stored report replay, resume/reentry and body-free handoff/export seam explicitly defined by formal design. | planned |
| allowed_rule | Add focused tests for recovery convergence no truth repair, partial issue/report, duplicate stored report replay, checkpoint resume, handoff/export safe outcome and job entry runner boundary. | planned |
| forbidden_rule | Do not implement release evidence verdict, final acceptance signoff, report generator, evidence index, release smoke, VETO checklist, risk acceptance or human approval workflow. | active |
| forbidden_rule | Do not create, modify, delete, repair, supersede or backfill core truth, business truth, relation truth, package truth, external source truth, audit truth or read material truth as a recovery side effect unless formal design says it is derived material from `commit-10-b`. | active |
| forbidden_rule | Do not invent recovery target fields, issue fields, intervention states, stored report replay schema, checkpoint schema, handoff/export target fields, outcome schema, config keys, scheduler semantics or evidence schema not closed by formal `03/05/06/07`. | active |
| forbidden_rule | Do not treat partial failure, formal intervention required, blocked target, unavailable handoff/export target, missing stored report or checkpoint gap as silent success. | active |
| forbidden_rule | Do not rerun recovery/handoff body on duplicate when formal stored report/checkpoint replay is required. | active |
| forbidden_rule | Do not make handoff/export outcome prove external business completion, external delivery truth, release pass/fail, VETO pass/fail or final acceptance. | active |
| forbidden_rule | Do not persist or expose raw provider body, artifact body, report body, external receipt body, raw log, secret, config/env value, full sensitive ref, unsafe event payload or marketplace transaction in jobs/tests/artifacts/logs. | active |
| forbidden_rule | Do not claim report-generation-audit, release-main-smoke, VETO checklist, acceptance handoff or final evidence coverage from this boundary. | active |
| forbidden_rule | Do not stage unrelated user changes, generated target directories or implementation outputs from previous boundaries. | active |

---

## Required Checks

| check | command_or_evidence | status | notes |
|---|---|---|---|
| activation guard | project ledger shows `current_boundary = commit-10-c` and `next_allowed_action = read_docs` | pending | Must pass before any implementation edit. |
| prior handoff | `commit-10-b` implementation commit and handoff recorded | pending | Read material refresh job family must exist. |
| worktree baseline | `git -C /home/aris/Projects/quantalithos-method-library status --short` | pending | Record before edits and protect unrelated files. |
| local git identity | `git -C /home/aris/Projects/quantalithos-method-library config user.name` and `user.email` | pending | Must remain `quantalithos-labs <quantalithos.ai@gmail.com>`. |
| format | `cargo fmt --all` | pending | Run in implementation repo after Rust changes. |
| workspace check | `cargo check` | pending | Ensures the full workspace still compiles. |
| jobs check | `cargo check -p method-library-jobs` or the formal jobs package check | pending | Use actual package name from formal workspace once activated. |
| application check | `cargo check -p method-library-application` or the formal application package check if orchestration/ports changed | pending | Use actual package name from formal workspace once activated. |
| infra check | `cargo check -p method-library-infra` or the formal infra package check if fakes/stores changed | pending | Use actual package name from formal workspace once activated. |
| worker check | `cargo check -p method-library-worker` or the formal worker package check if job entry runner files changed | pending | Use actual package name from formal workspace once activated. |
| operations-replay-core recovery/replay/handoff | targeted recovery convergence, stored report replay and handoff/export job tests | pending | Must cover recovery issue, partial report, duplicate replay and handoff/export safe outcome. |
| entry-worker-job job slice | targeted job entry runner tests | pending | Must prove runner boundary calls formal job facade and does not bypass application. |
| no truth repair | targeted test/static check that recovery jobs record issues/progress/checkpoint/report only and never mutate core/business truth | pending | Any truth repair blocks commit. |
| duplicate stored report replay | targeted duplicate test that replays stored job report/checkpoint and does not rerun recovery/handoff body | pending | Duplicate rerun blocks commit. |
| checkpoint/resume/reentry | targeted checkpoint/resume/reentry tests | pending | Must verify checkpoint source and stored report replay semantics. |
| partial issue/report | targeted partial failure and formal intervention required tests | pending | Partial/final report must carry safe issue refs and cannot be silent success. |
| handoff/export safe outcome | targeted handoff/export unavailable/blocked/failure tests | pending | Outcome must be body-free and must not claim external truth or release verdict. |
| redaction/body-free scan | targeted scan/test over job artifacts, reports, handoff outputs and logs | pending | Raw body, secret, config value, report body and unsafe refs must not leak. |
| evidence report | run-scoped operations-replay-core and entry-worker-job job artifacts/reports if scripts exist | pending | Optional until scripts exist; generated reports must derive from raw artifacts. |
| whitespace | `git diff --check` and `git diff --cached --check` before commit | pending | Required for Commit Gate. |
| staged scope | `git diff --cached --name-only` | pending | Must match Allowed Scope. |

---

## Gate Matrix

| gate | status | evidence | next_if_failed |
|---|---|---|---|
| activation_gate | pending | Boundary is planned until project ledger advances from `commit-10-b` to `commit-10-c`. | wait_until_current |
| design_gate | pending | Implementation agent must reread Required Reads and confirm recovery issue, stored report replay, checkpoint/resume, handoff/export and safe outcome closure. | wait_design |
| scope_gate | pending | Planned changes must be limited to recovery/replay/handoff job behavior, job entry runner slice, fakes/stores and focused tests assigned to `commit-10-c`. | fix_gate_failure |
| worktree_gate | pending | Initial implementation worktree status recorded; unrelated user changes protected. | fix_gate_failure |
| build_gate | pending | Formatting, workspace/jobs/application/infra/worker checks and dependency boundary checks pass or failure is recorded. | fix_gate_failure |
| test_gate | pending | Operations-replay-core recovery/replay/handoff, entry-worker-job job slice, no truth repair, duplicate replay, checkpoint/resume, partial issue and redaction/body-free checks pass after activation. | fix_gate_failure |
| evidence_gate | pending | Targeted artifacts/reports are optional; any generated report must be run-scoped and raw-artifact-derived. | fix_gate_failure |
| commit_gate | pending | staged scope, commit message, whitespace and required checks have evidence. | fix_gate_failure |
| handoff_gate | pending | commit hash, checks run, tests not run, blockers and next boundary state recorded. | handoff |

---

## Commit Gate

| gate | status | evidence |
|---|---|---|
| staged_scope | pending | Must include only allowed `commit-10-c` recovery/replay/handoff job, job entry runner, fake/store, test and generated targeted evidence files. |
| unrelated_changes | pending | User-owned unrelated changes must remain unstaged. |
| commit_message_format | pending | Planned subject: `feat(jobs): add recovery and handoff jobs` |
| commit_body_group | pending | Body group must include `Recovery and handoff jobs:` and `Stored report replay:` from Step 11 mapping. |
| whitespace | pending | `git diff --cached --check` must pass. |
| required_checks | pending | Required Checks table must have pass/not_applicable evidence. |

---

## Handoff Gate

| gate | status | evidence |
|---|---|---|
| committed_hash | pending | Fill after implementation repo commit. |
| committed_message | pending | Fill after implementation repo commit. |
| gates_run | pending | List exact commands and targeted reports. |
| tests_not_run | pending | Must state none or explain; cannot claim report-generation-audit/release/VETO/acceptance suites. |
| remaining_blockers | pending | Must reference blocker table; any blocking design gap prevents handoff. |
| final_conclusion | pending | Must be one of pass / fail / cannot_decide with exact evidence source. |
| user_owned_changes_untouched | pending | List unrelated files left untouched. |

---

## Blockers

| blocker_id | gate | status | blocking_reason | requested_design_closure | next_allowed_action |
|---|---|---|---|---|---|
| BLK-ML-10C-ACTIVATION-001 | activation_gate | planned | Project ledger has not advanced through `commit-10-b`; this future boundary must not be used for implementation yet. | After `commit-10-b` handoff, update project ledger to `commit-10-c` and set this boundary to current. | wait_until_current |

---

## Experience Review

| item | conclusion | action |
|---|---|---|
| future boundary pre-creation | applies current planned-ledger rule | Pre-created future ledgers must use `planned / wait_until_current` and must not authorize code changes until project ledger advances. |
| recovery/replay/handoff closure | existing design-closure rule applies | Recovery issue, formal intervention, stored report replay, checkpoint/resume, handoff/export outcome and marker gaps must be fixed in `03/05/06/07` before code; implementation must not invent release verdict, report generator, truth repair, external delivery truth or final acceptance semantics. |
