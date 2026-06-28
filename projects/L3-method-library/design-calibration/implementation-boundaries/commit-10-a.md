# commit-10-a implementation ledger

| field | value |
|---|---|
| project | L3-method-library |
| boundary_id | commit-10-a |
| phase | PH-10 operations jobs, replay, recovery and reports |
| design_baseline | `planned-after-d3faf90-handoff-ledger` |
| implementation_repo | `/home/aris/Projects/quantalithos-method-library` |
| status | planned |
| next_allowed_action | wait_until_current |
| current_recovery_point | future job protocol/checkpoint/report foundation boundary; cannot start until `commit-09-b` is implemented and project ledger advances |

---

## Activation Guard

| rule | status | consequence |
|---|---|---|
| project ledger current_boundary must equal `commit-10-a` | planned | If project ledger still points to an earlier boundary, implementation agent must not use this file to modify code. |
| `commit-09-b` handoff must be closed | planned | Outbound publisher worker boundary must exist before operations job protocol foundation starts. |
| project ledger must set `next_allowed_action = read_docs` for `commit-10-a` | planned | Until then this boundary remains `wait_until_current`. |

---

## Required Reads

| document | required_section | status | notes |
|---|---|---|---|
| `standards/document/代码实施台账与门禁规范.md` | planned boundary activation, gate matrix, commit and handoff rules | pending | This future boundary cannot be executed until it becomes current. |
| `standards/document/设计真相源闭环与可落码性标准.md` | no invented job input, checkpoint, progress, report, replay schema or evidence schema | pending | Missing job protocol/checkpoint/report surface must return to design. |
| `standards/coding/rust.md` | Rust contracts/application/jobs module, error and test conventions | pending | Source identifiers, comments, rustdoc, errors and test names must be English. |
| `projects/L3-method-library/00-需求文档.md` | operations jobs, checkpoint/progress and no truth repair scope | pending | Job protocol must not imply body-side truth repair or duplicate rerun. |
| `projects/L3-method-library/01-架构设计.md` | operations job boundary, report replay and truth boundary | pending | Job report/checkpoint surfaces must be replayable and must not become release evidence verdicts. |
| `projects/L3-method-library/02-概要设计.md` | 8 Operations Job protocol, checkpoint and report outline | pending | Use current job family; do not implement refresh/recovery job bodies here. |
| `projects/L3-method-library/03-详细设计.md` | job input/report/progress/checkpoint DTOs, ports, stored report, state and errors | pending | Formal source for job report surface, checkpoint shape, progress state and duplicate replay contracts. |
| `projects/L3-method-library/04-配置设计.md` | operations-replay profile, job run input, report store and handoff/export seam outline | pending | This boundary defines protocol/ports only; no job body or export behavior. |
| `projects/L3-method-library/05-测试方案.md` | contracts check, job DTO/report tests and artifact/report rules | pending | Job protocol report is optional; generated reports must derive from raw artifacts. |
| `projects/L3-method-library/06-验收标准.md` | ML-SYNC-005 seed, ML-JOB-TX, ML-IDEMP, ML-CHKPT and `VETO-ML-010` seed | pending | Job truth repair, missing report surface or duplicate rerun semantics block later implementation. |
| `projects/L3-method-library/07-实施计划.md` | §3, §6, §7, §8, §11 and §12 | pending | Current source for phase, boundary, allowed scope, checks and commit discipline. |
| `projects/L3-method-library/design-calibration/03_ddd_step_05_module_contracts.md` | operations job module boundary | pending | Keep job protocol foundation separate from refresh/recovery job bodies and release reports. |
| `projects/L3-method-library/design-calibration/03_ddd_step_06_object_contracts.md` | job input, progress, checkpoint, stored report, partial issue and handoff refs | pending | Required typed refs, progress/checkpoint fields and report fields must be formal. |
| `projects/L3-method-library/design-calibration/03_ddd_step_07_trait_port_adapter.md` | job protocol ports, checkpoint store, report store and runner seams | pending | Do not add ports or stores beyond formal contracts. |
| `projects/L3-method-library/design-calibration/03_ddd_step_08_protocol_contracts.md` | 8 job protocol shells and safe job result/report contracts | pending | Public job surfaces must be safe, replayable and report-source explicit. |
| `projects/L3-method-library/design-calibration/03_ddd_step_09_function_flows.md` | job flow input/report expectations | pending | Use only to shape protocol/port boundaries; do not implement job body behavior in this boundary. |
| `projects/L3-method-library/design-calibration/03_ddd_step_10_state_machine.md` | job progress, checkpoint, partial failure and report state guards | pending | State enum/value surfaces must match formal matrix. |
| `projects/L3-method-library/design-calibration/03_ddd_step_11_persistence_tx_consistency.md` | checkpoint/report store and transaction consistency | pending | Ports must support checkpoint/report atomicity without truth repair. |
| `projects/L3-method-library/design-calibration/03_ddd_step_12_errors_recovery.md` | job safe errors, partial issue and recovery report surfaces | pending | Errors/reports must be safe, refs-only and body-free. |
| `projects/L3-method-library/design-calibration/03_ddd_step_13_concurrency_idempotency.md` | job duplicate replay, stored report and idempotency constraints | pending | Protocol must support stored report replay and must not require rerunning job body. |
| `projects/L3-method-library/design-calibration/03_ddd_step_16_test_cut.md` | job protocol/report contract tests and PH-10 ownership | pending | Use job protocol/checkpoint/report contract slice only. |
| `projects/L3-method-library/design-calibration/07_implementation_plan_step_06_tasks_commit_boundaries.md` | `commit-10-a` row | pending | Allowed scope is 8 job input/report/progress/checkpoint DTO and ports. |
| `projects/L3-method-library/design-calibration/07_implementation_plan_step_07_test_acceptance_gates.md` | `commit-10-a` gate row and PH-10 gate | pending | Required checks are contracts check and job DTO/report tests; job protocol report optional. |
| `projects/L3-method-library/design-calibration/07_implementation_plan_step_11_commit_review_delivery.md` | `commit-10-a` commit body grouping | pending | Commit body must include `Job protocol surface:` and `Checkpoint and report contracts:`. |
| `/home/aris/Projects/quantalithos-method-library` git status and `commit-09-b` handoff state | latest implementation state | pending | Must confirm outbound publisher boundary landed before this boundary starts. |

---

## Allowed Scope

| type | path_or_rule | status |
|---|---|---|
| allowed_path | `/home/aris/Projects/quantalithos-method-library/crates/contracts/src/**` for 8 job input DTOs, progress DTOs, checkpoint DTOs, report DTOs, partial issue shells and safe job result/error shells assigned to `commit-10-a` | planned |
| allowed_path | `/home/aris/Projects/quantalithos-method-library/crates/contracts/tests/**` for job DTO/report/checkpoint contract fixture tests | planned |
| allowed_path | `/home/aris/Projects/quantalithos-method-library/crates/application/src/**` for job protocol port traits, checkpoint/report store traits, runner facade shells and no-body service interfaces assigned to `commit-10-a` | planned |
| allowed_path | `/home/aris/Projects/quantalithos-method-library/crates/application/tests/**` for compile/contract tests of job ports if formal workspace uses application-level port tests | planned |
| allowed_path | `/home/aris/Projects/quantalithos-method-library/crates/jobs/src/**` only for no-body job runner shell/types required to compile formal job protocol surfaces | planned |
| allowed_path | `/home/aris/Projects/quantalithos-method-library/crates/jobs/tests/**` only for job protocol/runner shell tests with no job body execution | planned |
| allowed_path | `/home/aris/Projects/quantalithos-method-library/crates/domain/src/**` only for narrow job progress/checkpoint/report state guards explicitly defined by formal design | planned |
| allowed_path | `/home/aris/Projects/quantalithos-method-library/artifacts/test/<run_id>/suites/contract-domain-fast/**` only if generated by an actual targeted run after activation | planned |
| allowed_path | `/home/aris/Projects/quantalithos-method-library/reports/runs/<run_id>/job-protocol-report.md` only if generated from an actual targeted job DTO/report run after activation | planned |
| allowed_rule | Add job input/report/progress/checkpoint DTOs, job protocol ports, checkpoint/report store traits, runner shell types, safe errors and report replay contract fields explicitly defined by formal design. | planned |
| allowed_rule | Add focused compile/contract tests for 8 job shell completeness, checkpoint/progress shape, stored report replay shape, partial issue surfaces and no job body execution. | planned |
| forbidden_rule | Do not implement job body logic, refresh job family, recovery/replay job behavior, handoff/export job behavior, report generator, release evidence verdict or acceptance handoff behavior. | active |
| forbidden_rule | Do not add truth repair, current truth mutation, read material refresh, consistency recovery, duplicate rerun behavior, real handoff/export adapter or operations execution runner behavior. | active |
| forbidden_rule | Do not invent job input fields, checkpoint fields, progress states, report schema, partial issue fields, stored report replay schema, config keys, handoff fields or evidence schema not closed by formal `03/05/06/07`. | active |
| forbidden_rule | Do not make job report surfaces imply release pass/fail, VETO pass/fail or final acceptance verdict. | active |
| forbidden_rule | Do not persist or expose raw provider body, raw inbound body, secret, config/env value, full sensitive ref, stack trace, unsafe source payload or old MethodContent/publish/snapshot/outbox material in DTOs/tests/artifacts/logs. | active |
| forbidden_rule | Do not claim refresh job, recovery job, handoff job, operations-replay-core, entry-worker-job job slice, report generator, release or final evidence coverage from this boundary. | active |
| forbidden_rule | Do not stage unrelated user changes, generated target directories or implementation outputs from previous boundaries. | active |

---

## Required Checks

| check | command_or_evidence | status | notes |
|---|---|---|---|
| activation guard | project ledger shows `current_boundary = commit-10-a` and `next_allowed_action = read_docs` | pending | Must pass before any implementation edit. |
| prior handoff | `commit-09-b` implementation commit and handoff recorded | pending | Outbound publisher boundary must exist. |
| worktree baseline | `git -C /home/aris/Projects/quantalithos-method-library status --short` | pending | Record before edits and protect unrelated files. |
| local git identity | `git -C /home/aris/Projects/quantalithos-method-library config user.name` and `user.email` | pending | Must remain `quantalithos-labs <quantalithos.ai@gmail.com>`. |
| format | `cargo fmt --all` | pending | Run in implementation repo after Rust changes. |
| workspace check | `cargo check` | pending | Ensures the full workspace still compiles. |
| contracts check | `cargo check -p method-library-contracts` or the formal contracts package check if job DTOs changed | pending | Use actual package name from formal workspace once activated. |
| application check | `cargo check -p method-library-application` or the formal application package check if job ports changed | pending | Use actual package name from formal workspace once activated. |
| jobs check | `cargo check -p method-library-jobs` or the formal jobs package check if runner shell files changed | pending | Use actual package name from formal workspace once activated. |
| job DTO/report tests | targeted job DTO/checkpoint/progress/report tests | pending | Must cover 8 job shell completeness and stored report replay surface. |
| no job body execution | static/compile test that this boundary exposes protocol/ports only and no job body execution path | pending | Job body implementation belongs to `commit-10-b` / `commit-10-c`. |
| stored report replay dry-run | stored report/checkpoint closure checklist if formal script/check exists | pending | Missing report/checkpoint closure blocks implementation. |
| evidence report | run-scoped job protocol artifact/report if scripts exist | pending | Optional until scripts exist; generated reports must derive from raw artifacts. |
| whitespace | `git diff --check` and `git diff --cached --check` before commit | pending | Required for Commit Gate. |
| staged scope | `git diff --cached --name-only` | pending | Must match Allowed Scope. |

---

## Gate Matrix

| gate | status | evidence | next_if_failed |
|---|---|---|---|
| activation_gate | pending | Boundary is planned until project ledger advances from `commit-09-b` to `commit-10-a`. | wait_until_current |
| design_gate | pending | Implementation agent must reread Required Reads and confirm job input/report/progress/checkpoint, stored report replay and port closure. | wait_design |
| scope_gate | pending | Planned changes must be limited to job protocol/checkpoint/report DTOs, ports, runner shell types and focused tests. | fix_gate_failure |
| worktree_gate | pending | Initial implementation worktree status recorded; unrelated user changes protected. | fix_gate_failure |
| build_gate | pending | Formatting, workspace/contracts/application/jobs checks and dependency boundary checks pass or failure is recorded. | fix_gate_failure |
| test_gate | pending | Job DTO/report tests, no body execution check and stored report replay dry-run pass after activation. | fix_gate_failure |
| evidence_gate | pending | Targeted artifacts/reports are optional; any generated report must be run-scoped and raw-artifact-derived. | fix_gate_failure |
| commit_gate | pending | staged scope, commit message, whitespace and required checks have evidence. | fix_gate_failure |
| handoff_gate | pending | commit hash, checks run, tests not run, blockers and next boundary state recorded. | handoff |

---

## Commit Gate

| gate | status | evidence |
|---|---|---|
| staged_scope | pending | Must include only allowed `commit-10-a` job protocol, checkpoint/report, port, runner shell, test and generated targeted evidence files. |
| unrelated_changes | pending | User-owned unrelated changes must remain unstaged. |
| commit_message_format | pending | Planned subject: `feat(jobs): add job protocol surface` |
| commit_body_group | pending | Body group must include `Job protocol surface:` and `Checkpoint and report contracts:` from Step 11 mapping. |
| whitespace | pending | `git diff --cached --check` must pass. |
| required_checks | pending | Required Checks table must have pass/not_applicable evidence. |

---

## Handoff Gate

| gate | status | evidence |
|---|---|---|
| committed_hash | pending | Fill after implementation repo commit. |
| committed_message | pending | Fill after implementation repo commit. |
| gates_run | pending | List exact commands and targeted reports. |
| tests_not_run | pending | Must state none or explain; cannot claim refresh/recovery/handoff job/release suites. |
| remaining_blockers | pending | Must reference blocker table; any blocking design gap prevents handoff. |
| final_conclusion | pending | Must be one of pass / fail / cannot_decide with exact evidence source. |
| user_owned_changes_untouched | pending | List unrelated files left untouched. |

---

## Blockers

| blocker_id | gate | status | blocking_reason | requested_design_closure | next_allowed_action |
|---|---|---|---|---|---|
| BLK-ML-10A-ACTIVATION-001 | activation_gate | planned | Project ledger has not advanced through `commit-09-b`; this future boundary must not be used for implementation yet. | After `commit-09-b` handoff, update project ledger to `commit-10-a` and set this boundary to current. | wait_until_current |

---

## Experience Review

| item | conclusion | action |
|---|---|---|
| future boundary pre-creation | applies current planned-ledger rule | Pre-created future ledgers must use `planned / wait_until_current` and must not authorize code changes until project ledger advances. |
| job protocol closure | existing design-closure rule applies | Job input/report/progress/checkpoint, stored report replay, partial issue and port gaps must be fixed in `03/05/06/07` before code; implementation must not invent job body execution, truth repair or release verdict semantics. |
