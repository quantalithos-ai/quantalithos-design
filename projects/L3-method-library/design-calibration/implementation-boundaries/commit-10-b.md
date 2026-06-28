# commit-10-b implementation ledger

| field | value |
|---|---|
| project | L3-method-library |
| boundary_id | commit-10-b |
| phase | PH-10 operations jobs, replay, recovery and reports |
| design_baseline | `planned-after-d3faf90-handoff-ledger` |
| implementation_repo | `/home/aris/Projects/quantalithos-method-library` |
| status | planned |
| next_allowed_action | wait_until_current |
| current_recovery_point | future read material refresh job family boundary; cannot start until `commit-10-a` is implemented and project ledger advances |

---

## Activation Guard

| rule | status | consequence |
|---|---|---|
| project ledger current_boundary must equal `commit-10-b` | planned | If project ledger still points to an earlier boundary, implementation agent must not use this file to modify code. |
| `commit-10-a` handoff must be closed | planned | Job protocol, checkpoint, progress and stored report foundation must exist before refresh job bodies start. |
| project ledger must set `next_allowed_action = read_docs` for `commit-10-b` | planned | Until then this boundary remains `wait_until_current`. |

---

## Required Reads

| document | required_section | status | notes |
|---|---|---|---|
| `standards/document/代码实施台账与门禁规范.md` | planned boundary activation, gate matrix, commit and handoff rules | pending | This future boundary cannot be executed until it becomes current. |
| `standards/document/设计真相源闭环与可落码性标准.md` | no invented job body, checkpoint, target planner, material builder, marker, report or evidence schema | pending | Missing refresh target/material/report closure must return to design. |
| `standards/coding/rust.md` | Rust jobs/application/infra module, error and test conventions | pending | Source identifiers, comments, rustdoc, errors and test names must be English. |
| `projects/L3-method-library/00-需求文档.md` | operations jobs, read material refresh and no truth repair scope | pending | Refresh jobs may rebuild derived read materials only; they must not repair core truth. |
| `projects/L3-method-library/01-架构设计.md` | operations job boundary, derived material boundary, checkpoint and report replay | pending | Refresh reports/checkpoints must be replayable and must not become release evidence verdicts. |
| `projects/L3-method-library/02-概要设计.md` | 8 Operations Job family and read material refresh outline | pending | Use refresh families assigned to this boundary; do not implement recovery/handoff job behavior here. |
| `projects/L3-method-library/03-详细设计.md` | refresh job flows, target planner, material stores, progress/checkpoint/report and partial issue rules | pending | Formal source for target planning, committed reads, material writes, partial issues and stored report. |
| `projects/L3-method-library/04-配置设计.md` | operations-replay profile, refresh job input and report/checkpoint store binding | pending | Do not invent scheduler, lease, retry, target registry or report sink config. |
| `projects/L3-method-library/05-测试方案.md` | operations-replay-core refresh jobs, checkpoint and artifact/report rules | pending | Refresh job report must derive from raw run artifact if generated. |
| `projects/L3-method-library/06-验收标准.md` | ML-SYNC-005, ML-JOB-TX-001, ML-CHKPT-001 and `VETO-ML-010` | pending | Truth repair, checkpoint gaps or duplicate rerun block implementation. |
| `projects/L3-method-library/07-实施计划.md` | §3, §6, §7, §8, §11 and §12 | pending | Current source for phase, boundary, allowed scope, checks and commit discipline. |
| `projects/L3-method-library/design-calibration/03_ddd_step_05_module_contracts.md` | jobs module and refresh family boundary | pending | Keep refresh job family separate from recovery/handoff jobs and release reports. |
| `projects/L3-method-library/design-calibration/03_ddd_step_06_object_contracts.md` | refresh task, target refs, read material, progress, checkpoint, report and partial issue objects | pending | Required typed refs, marker fields and body-free report fields must be formal. |
| `projects/L3-method-library/design-calibration/03_ddd_step_07_trait_port_adapter.md` | target planner, material repositories, checkpoint/report/progress ports and runner seams | pending | Do not add ports, stores, mappers or fakes beyond formal contracts. |
| `projects/L3-method-library/design-calibration/03_ddd_step_08_protocol_contracts.md` | refresh job input/result/report shells and safe job surface | pending | Public job surfaces must be safe, refs-only and replayable. |
| `projects/L3-method-library/design-calibration/03_ddd_step_09_function_flows.md` | `RefreshCatalogAndDefinitionReadMaterialsFlow`, `RefreshFormalVersionReadMaterialsFlow`, `RefreshConsumptionReadMaterialsFlow`, `RefreshRelationDistributionMaterialsFlow`, `RefreshExternalSummaryReadMaterialsFlow`, `RefreshTraceAuditImpactMaterialsFlow`, `RefreshPeripheralReadMaterialsFlow` | pending | Implement only read material refresh flows; recovery convergence belongs to `commit-10-c`. |
| `projects/L3-method-library/design-calibration/03_ddd_step_10_state_machine.md` | refresh task, progress, checkpoint, partial failure and job report states | pending | Job-local states must not be confused with business truth completion. |
| `projects/L3-method-library/design-calibration/03_ddd_step_11_persistence_tx_consistency.md` | derived material writes, checkpoint/report persistence and transaction consistency | pending | Refresh must read committed truth and write derived materials/progress/checkpoint/report atomically as formalized. |
| `projects/L3-method-library/design-calibration/03_ddd_step_12_errors_recovery.md` | partial target failure, unavailable/degraded marker and safe issue/report surfaces | pending | Partial issues must be safe, refs-only and marker-sourced. |
| `projects/L3-method-library/design-calibration/03_ddd_step_13_concurrency_idempotency.md` | job duplicate replay, resume, checkpoint and no rerun/no repair constraints | pending | Duplicate refresh must replay stored report/checkpoint and must not rerun target mutation. |
| `projects/L3-method-library/design-calibration/03_ddd_step_16_test_cut.md` | operations job tests, checkpoint/resume, partial failure and no truth repair | pending | Use operations-replay-core refresh slice only. |
| `projects/L3-method-library/design-calibration/07_implementation_plan_step_06_tasks_commit_boundaries.md` | `commit-10-b` row | pending | Allowed scope is catalog/formal/consumption/relation/external/trace/peripheral refresh jobs. |
| `projects/L3-method-library/design-calibration/07_implementation_plan_step_07_test_acceptance_gates.md` | `commit-10-b` gate row and PH-10 gate | pending | Required checks are operations-replay-core refresh jobs, ML-JOB-TX and checkpoint coverage. |
| `projects/L3-method-library/design-calibration/07_implementation_plan_step_11_commit_review_delivery.md` | `commit-10-b` commit body grouping | pending | Commit body must include `Refresh job family:` and `Checkpoint progress reports:`. |
| `/home/aris/Projects/quantalithos-method-library` git status and `commit-10-a` handoff state | latest implementation state | pending | Must confirm job protocol/checkpoint foundation landed before this boundary starts. |

---

## Allowed Scope

| type | path_or_rule | status |
|---|---|---|
| allowed_path | `/home/aris/Projects/quantalithos-method-library/crates/jobs/src/**` for read material refresh job implementations assigned to `commit-10-b` | planned |
| allowed_path | `/home/aris/Projects/quantalithos-method-library/crates/jobs/tests/**` for operations-replay-core refresh job tests | planned |
| allowed_path | `/home/aris/Projects/quantalithos-method-library/crates/application/src/**` for refresh job orchestration services, target planner calls, material refresh ports, progress/checkpoint/report save calls and safe errors assigned to `commit-10-b` | planned |
| allowed_path | `/home/aris/Projects/quantalithos-method-library/crates/application/tests/**` for refresh orchestration and no truth repair service tests if formal workspace uses application-level tests | planned |
| allowed_path | `/home/aris/Projects/quantalithos-method-library/crates/infra/src/**` for formally defined in-memory/fake target planner, material stores, progress/checkpoint/report stores needed by refresh tests | planned |
| allowed_path | `/home/aris/Projects/quantalithos-method-library/crates/infra/tests/**` for refresh store/planner fake tests | planned |
| allowed_path | `/home/aris/Projects/quantalithos-method-library/crates/contracts/src/**` only for narrow refresh job report/progress/partial issue fields already formalized but not landed in `commit-10-a` | planned |
| allowed_path | `/home/aris/Projects/quantalithos-method-library/crates/domain/src/**` only for narrow derived material/progress/checkpoint state guards explicitly defined by formal design | planned |
| allowed_path | `/home/aris/Projects/quantalithos-method-library/artifacts/test/<run_id>/suites/operations-replay-core/**` only if generated by an actual targeted run after activation | planned |
| allowed_path | `/home/aris/Projects/quantalithos-method-library/reports/runs/<run_id>/suites/operations-replay-core.md` only if generated from raw artifact after activation | planned |
| allowed_rule | Implement refresh flows for catalog/definition, formal version, consumption, relation/distribution, external summary, trace/audit/impact and peripheral read materials explicitly defined by formal design. | planned |
| allowed_rule | Add focused tests for target planning, committed truth reads, derived material writes, progress/checkpoint/report save, partial target issues, duplicate stored report replay, resume and no truth repair. | planned |
| forbidden_rule | Do not implement consistency recovery convergence, recovery issue intervention behavior, handoff/export job behavior, release evidence verdict, final acceptance handoff, real scheduler, lease or retry engine. | active |
| forbidden_rule | Do not create, modify, delete, repair, supersede or backfill core truth, business truth, external source truth, relation truth, package truth or audit truth from refresh jobs. | active |
| forbidden_rule | Do not invent refresh target fields, material builder inputs, progress states, checkpoint schema, partial issue fields, report schema, marker sources, config keys, scheduler semantics or evidence schema not closed by formal `03/05/06/07`. | active |
| forbidden_rule | Do not treat missing target, stale committed truth, unavailable adapter, builder failure, checkpoint gap or partial target failure as silent success. | active |
| forbidden_rule | Do not rerun refresh body on duplicate when formal stored report/checkpoint replay is required. | active |
| forbidden_rule | Do not persist or expose raw provider body, artifact body, report body, raw log, secret, config/env value, full sensitive ref, unsafe event payload or marketplace transaction in jobs/tests/artifacts/logs. | active |
| forbidden_rule | Do not claim recovery/replay/handoff job, entry-worker-job job slice, report generator, release smoke, VETO checklist or final evidence coverage from this boundary. | active |
| forbidden_rule | Do not stage unrelated user changes, generated target directories or implementation outputs from previous boundaries. | active |

---

## Required Checks

| check | command_or_evidence | status | notes |
|---|---|---|---|
| activation guard | project ledger shows `current_boundary = commit-10-b` and `next_allowed_action = read_docs` | pending | Must pass before any implementation edit. |
| prior handoff | `commit-10-a` implementation commit and handoff recorded | pending | Job protocol/checkpoint/report foundation must exist. |
| worktree baseline | `git -C /home/aris/Projects/quantalithos-method-library status --short` | pending | Record before edits and protect unrelated files. |
| local git identity | `git -C /home/aris/Projects/quantalithos-method-library config user.name` and `user.email` | pending | Must remain `quantalithos-labs <quantalithos.ai@gmail.com>`. |
| format | `cargo fmt --all` | pending | Run in implementation repo after Rust changes. |
| workspace check | `cargo check` | pending | Ensures the full workspace still compiles. |
| jobs check | `cargo check -p method-library-jobs` or the formal jobs package check | pending | Use actual package name from formal workspace once activated. |
| application check | `cargo check -p method-library-application` or the formal application package check if orchestration/ports changed | pending | Use actual package name from formal workspace once activated. |
| infra check | `cargo check -p method-library-infra` or the formal infra package check if fakes/stores changed | pending | Use actual package name from formal workspace once activated. |
| operations-replay-core refresh jobs | targeted refresh job family tests | pending | Must cover all refresh flows assigned to this boundary or explain formal not-applicable rows. |
| no truth repair | targeted test/static check that refresh jobs write only derived materials/progress/checkpoint/report and never mutate core/business truth | pending | Any truth repair blocks commit. |
| checkpoint/resume | targeted checkpoint/resume tests | pending | Must verify checkpoint identity and resume source; no page cursor/version/queue offset substitution. |
| duplicate stored report replay | targeted duplicate test that replays stored job report/checkpoint and does not rerun refresh body | pending | Duplicate rerun blocks commit. |
| partial issue/report | targeted partial failure tests for missing/unavailable/degraded target handling | pending | Partial target failure must produce safe issue/report, not silent success. |
| redaction/body-free scan | targeted scan/test over job artifacts, reports and logs | pending | Raw body, secret, config value, report body and unsafe refs must not leak. |
| evidence report | run-scoped `operations-replay-core` refresh job artifacts/reports if scripts exist | pending | Optional until scripts exist; generated reports must derive from raw artifacts. |
| whitespace | `git diff --check` and `git diff --cached --check` before commit | pending | Required for Commit Gate. |
| staged scope | `git diff --cached --name-only` | pending | Must match Allowed Scope. |

---

## Gate Matrix

| gate | status | evidence | next_if_failed |
|---|---|---|---|
| activation_gate | pending | Boundary is planned until project ledger advances from `commit-10-a` to `commit-10-b`. | wait_until_current |
| design_gate | pending | Implementation agent must reread Required Reads and confirm refresh target planner, material builder, checkpoint/report and partial issue closure. | wait_design |
| scope_gate | pending | Planned changes must be limited to read material refresh job family, stores/fakes and focused tests assigned to `commit-10-b`. | fix_gate_failure |
| worktree_gate | pending | Initial implementation worktree status recorded; unrelated user changes protected. | fix_gate_failure |
| build_gate | pending | Formatting, workspace/jobs/application/infra checks and dependency boundary checks pass or failure is recorded. | fix_gate_failure |
| test_gate | pending | Operations-replay-core refresh, no truth repair, checkpoint/resume, duplicate replay, partial issue and redaction/body-free checks pass after activation. | fix_gate_failure |
| evidence_gate | pending | Targeted artifacts/reports are optional; any generated report must be run-scoped and raw-artifact-derived. | fix_gate_failure |
| commit_gate | pending | staged scope, commit message, whitespace and required checks have evidence. | fix_gate_failure |
| handoff_gate | pending | commit hash, checks run, tests not run, blockers and next boundary state recorded. | handoff |

---

## Commit Gate

| gate | status | evidence |
|---|---|---|
| staged_scope | pending | Must include only allowed `commit-10-b` refresh job, progress/checkpoint/report, fake/store, test and generated targeted evidence files. |
| unrelated_changes | pending | User-owned unrelated changes must remain unstaged. |
| commit_message_format | pending | Planned subject: `feat(jobs): add read material refresh jobs` |
| commit_body_group | pending | Body group must include `Refresh job family:` and `Checkpoint progress reports:` from Step 11 mapping. |
| whitespace | pending | `git diff --cached --check` must pass. |
| required_checks | pending | Required Checks table must have pass/not_applicable evidence. |

---

## Handoff Gate

| gate | status | evidence |
|---|---|---|
| committed_hash | pending | Fill after implementation repo commit. |
| committed_message | pending | Fill after implementation repo commit. |
| gates_run | pending | List exact commands and targeted reports. |
| tests_not_run | pending | Must state none or explain; cannot claim recovery/handoff/release suites. |
| remaining_blockers | pending | Must reference blocker table; any blocking design gap prevents handoff. |
| final_conclusion | pending | Must be one of pass / fail / cannot_decide with exact evidence source. |
| user_owned_changes_untouched | pending | List unrelated files left untouched. |

---

## Blockers

| blocker_id | gate | status | blocking_reason | requested_design_closure | next_allowed_action |
|---|---|---|---|---|---|
| BLK-ML-10B-ACTIVATION-001 | activation_gate | planned | Project ledger has not advanced through `commit-10-a`; this future boundary must not be used for implementation yet. | After `commit-10-a` handoff, update project ledger to `commit-10-b` and set this boundary to current. | wait_until_current |

---

## Experience Review

| item | conclusion | action |
|---|---|---|
| future boundary pre-creation | applies current planned-ledger rule | Pre-created future ledgers must use `planned / wait_until_current` and must not authorize code changes until project ledger advances. |
| refresh job closure | existing design-closure rule applies | Target planner, material builder, progress/checkpoint/report, partial issue, duplicate replay and marker gaps must be fixed in `03/05/06/07` before code; implementation must not invent recovery, handoff, truth repair, scheduler or release verdict semantics. |
