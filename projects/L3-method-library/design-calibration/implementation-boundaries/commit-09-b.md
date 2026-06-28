# commit-09-b implementation ledger

| field | value |
|---|---|
| project | L3-method-library |
| boundary_id | commit-09-b |
| phase | PH-09 inbound / outbound event and publisher worker |
| design_baseline | `planned-after-d3faf90-handoff-ledger` |
| implementation_repo | `/home/aris/Projects/quantalithos-method-library` |
| status | planned |
| next_allowed_action | wait_until_current |
| current_recovery_point | future outbound event candidate and publisher worker boundary; cannot start until `commit-09-a` is implemented and project ledger advances |

---

## Activation Guard

| rule | status | consequence |
|---|---|---|
| project ledger current_boundary must equal `commit-09-b` | planned | If project ledger still points to an earlier boundary, implementation agent must not use this file to modify code. |
| `commit-09-a` handoff must be closed | planned | Inbound receipt/dedup and source adapter fake must exist before outbound publisher work starts. |
| project ledger must set `next_allowed_action = read_docs` for `commit-09-b` | planned | Until then this boundary remains `wait_until_current`. |

---

## Required Reads

| document | required_section | status | notes |
|---|---|---|---|
| `standards/document/代码实施台账与门禁规范.md` | planned boundary activation, gate matrix, commit and handoff rules | pending | This future boundary cannot be executed until it becomes current. |
| `standards/document/设计真相源闭环与可落码性标准.md` | no invented event candidate, outcome schema, publisher fake, worker runner, redaction rule or evidence schema | pending | Missing outbound candidate/outcome/publisher closure must return to design. |
| `standards/coding/rust.md` | Rust contracts/application/infra/worker module, error and test conventions | pending | Source identifiers, comments, rustdoc, errors and test names must be English. |
| `projects/L3-method-library/00-需求文档.md` | outbound event scope, publisher outcome and no rollback rule | pending | Publisher failure must not roll back committed truth or regenerate payload from current truth. |
| `projects/L3-method-library/01-架构设计.md` | event seam, topic-neutral binding, candidate/outcome boundary and truth boundary | pending | Publisher missing topic/source must fail safe; publisher must not become truth repair path. |
| `projects/L3-method-library/02-概要设计.md` | outbound event candidate/outcome, publisher fake and worker runner outline | pending | Use current outbound family; do not add operations job or real transport here. |
| `projects/L3-method-library/03-详细设计.md` | 34 outbound event/sender contracts, candidate/outcome ports, worker flow, state and errors | pending | Formal source for candidate source, safe payload shell, publisher outcome and failure marker. |
| `projects/L3-method-library/04-配置设计.md` | outbound topic binding, publisher fake, disabled/degraded and redaction boundary | pending | Publisher fake must follow formal config/binding rules; no real transport unless formal. |
| `projects/L3-method-library/05-测试方案.md` | entry-worker-job outbound/publisher, redaction targeted and artifact/report rules | pending | Outbound/publisher report must derive from raw artifact if generated. |
| `projects/L3-method-library/06-验收标准.md` | ML-SYNC-004/008, ML-TX-002 and PH-09 VETO/redaction constraints | pending | Payload current truth recomputation, rollback or unsafe payload leak blocks commit. |
| `projects/L3-method-library/07-实施计划.md` | §3, §6, §7, §8, §11 and §12 | pending | Current source for phase, boundary, allowed scope, checks and commit discipline. |
| `projects/L3-method-library/design-calibration/03_ddd_step_05_module_contracts.md` | outbound worker/event module boundary | pending | Keep outbound publisher separate from operations jobs, real transport and release evidence. |
| `projects/L3-method-library/design-calibration/03_ddd_step_06_object_contracts.md` | event candidate, outcome, publisher marker, safe payload shell and redaction objects | pending | Required typed refs, payload digest and safe surfaces must be formal. |
| `projects/L3-method-library/design-calibration/03_ddd_step_07_trait_port_adapter.md` | outbound event ports, candidate store, publisher fake seam and worker runner ports | pending | Do not add ports, stores or fakes beyond formal contracts. |
| `projects/L3-method-library/design-calibration/03_ddd_step_08_protocol_contracts.md` | outbound event/sender protocol shells and outcome contracts | pending | Public outcome surfaces must be safe and must not include raw body or unsafe payload. |
| `projects/L3-method-library/design-calibration/03_ddd_step_09_function_flows.md` | event candidate creation, publisher send, outcome save and duplicate replay flows | pending | Flow order, failure outcome and duplicate behavior must be formal. |
| `projects/L3-method-library/design-calibration/03_ddd_step_10_state_machine.md` | event candidate/outcome and publisher state guards | pending | Candidate/outcome transitions must match formal state matrix. |
| `projects/L3-method-library/design-calibration/03_ddd_step_11_persistence_tx_consistency.md` | candidate/outcome store, UoW and transaction consistency | pending | Publisher outcome save must not roll back truth or recompute current truth payload. |
| `projects/L3-method-library/design-calibration/03_ddd_step_12_errors_recovery.md` | outbound safe errors, publisher failure and unavailable recovery | pending | Errors/logs/reports must be safe, refs-only and body-free. |
| `projects/L3-method-library/design-calibration/03_ddd_step_13_concurrency_idempotency.md` | outbound duplicate replay, candidate source, stored payload and publisher outcome constraints | pending | Duplicate publisher must use stored candidate/outcome and must not recompute payload from current truth. |
| `projects/L3-method-library/design-calibration/03_ddd_step_16_test_cut.md` | entry-worker-job outbound/publisher and redaction ownership | pending | Use outbound event/publisher slice only. |
| `projects/L3-method-library/design-calibration/07_implementation_plan_step_06_tasks_commit_boundaries.md` | `commit-09-b` row | pending | Allowed scope is 34 event candidate/outcome, publisher fake and worker runner. |
| `projects/L3-method-library/design-calibration/07_implementation_plan_step_07_test_acceptance_gates.md` | `commit-09-b` gate row and PH-09 gate | pending | Required checks are entry-worker-job outbound/publisher and redaction targeted. |
| `projects/L3-method-library/design-calibration/07_implementation_plan_step_11_commit_review_delivery.md` | `commit-09-b` commit body grouping | pending | Commit body must include `Outbound event candidates:` and `Publisher worker outcomes:`. |
| `/home/aris/Projects/quantalithos-method-library` git status and `commit-09-a` handoff state | latest implementation state | pending | Must confirm inbound receipt/dedup boundary landed before this boundary starts. |

---

## Allowed Scope

| type | path_or_rule | status |
|---|---|---|
| allowed_path | `/home/aris/Projects/quantalithos-method-library/crates/contracts/src/**` for 34 outbound event/sender candidate DTOs, outcome DTOs, safe payload shells, publisher result/error shells assigned to `commit-09-b` | planned |
| allowed_path | `/home/aris/Projects/quantalithos-method-library/crates/contracts/tests/**` for outbound candidate/outcome contract fixture tests | planned |
| allowed_path | `/home/aris/Projects/quantalithos-method-library/crates/application/src/**` for candidate creation services, publisher orchestration, outcome save/replay and safe service errors assigned to `commit-09-b` | planned |
| allowed_path | `/home/aris/Projects/quantalithos-method-library/crates/application/tests/**` for outbound candidate/outcome and publisher service tests | planned |
| allowed_path | `/home/aris/Projects/quantalithos-method-library/crates/infra/src/**` for formally defined in-memory/fake candidate store, outcome store and publisher fake needed by outbound tests | planned |
| allowed_path | `/home/aris/Projects/quantalithos-method-library/crates/infra/tests/**` for fake candidate/outcome store and publisher fake tests | planned |
| allowed_path | `/home/aris/Projects/quantalithos-method-library/crates/worker/src/**` for outbound publisher worker runner shell that only calls the application facade assigned to `commit-09-b` | planned |
| allowed_path | `/home/aris/Projects/quantalithos-method-library/crates/worker/tests/**` for entry-worker-job outbound/publisher runner tests if formal workspace uses worker-level tests | planned |
| allowed_path | `/home/aris/Projects/quantalithos-method-library/crates/domain/src/**` only for narrow event candidate/outcome state guards explicitly defined by formal design | planned |
| allowed_path | `/home/aris/Projects/quantalithos-method-library/artifacts/test/<run_id>/suites/entry-worker-job/**` only if generated by an actual targeted run after activation | planned |
| allowed_path | `/home/aris/Projects/quantalithos-method-library/reports/runs/<run_id>/suites/entry-worker-job.md` only if generated from raw artifact after activation | planned |
| allowed_path | `/home/aris/Projects/quantalithos-method-library/reports/runs/<run_id>/redaction-check.md` only if generated from an actual targeted redaction check after activation | planned |
| allowed_rule | Implement outbound candidate creation, stored safe payload shell, publisher fake send, publisher outcome save/get, duplicate replay and worker runner behavior explicitly defined by formal design. | planned |
| allowed_rule | Add focused tests for candidate vs outcome separation, publisher success/failure, no rollback of committed truth, no current truth payload recomputation, duplicate replay and body-free artifacts/logs. | planned |
| forbidden_rule | Do not implement operations jobs, real transport, real bus, recovery/replay job, query/material refresh, report generator, release evidence verdict or acceptance handoff behavior. | active |
| forbidden_rule | Do not mutate committed truth from publisher failure or roll back accepted command state because outbound delivery failed. | active |
| forbidden_rule | Do not invent event candidate fields, outcome schema, publisher failure marker, payload shell, topic binding, fake publisher behavior, config keys, report schema or evidence schema not closed by formal `03/05/06/07`. | active |
| forbidden_rule | Do not recompute outbound payload from current truth when a formal stored candidate/payload shell is required. | active |
| forbidden_rule | Do not treat missing topic/source, publisher unavailable, transport failure or unknown outcome as accepted delivery unless formal flow defines that exact safe surface. | active |
| forbidden_rule | Do not persist or expose raw provider body, raw inbound body, secret, config/env value, full sensitive ref, stack trace, unsafe event payload or old MethodContent/publish/snapshot/outbox material in services/tests/artifacts/logs. | active |
| forbidden_rule | Do not claim operations replay, refresh job, real transport, report generator, release or final evidence coverage from this boundary. | active |
| forbidden_rule | Do not stage unrelated user changes, generated target directories or implementation outputs from previous boundaries. | active |

---

## Required Checks

| check | command_or_evidence | status | notes |
|---|---|---|---|
| activation guard | project ledger shows `current_boundary = commit-09-b` and `next_allowed_action = read_docs` | pending | Must pass before any implementation edit. |
| prior handoff | `commit-09-a` implementation commit and handoff recorded | pending | Inbound receipt/dedup boundary must exist. |
| worktree baseline | `git -C /home/aris/Projects/quantalithos-method-library status --short` | pending | Record before edits and protect unrelated files. |
| local git identity | `git -C /home/aris/Projects/quantalithos-method-library config user.name` and `user.email` | pending | Must remain `quantalithos-labs <quantalithos.ai@gmail.com>`. |
| format | `cargo fmt --all` | pending | Run in implementation repo after Rust changes. |
| workspace check | `cargo check` | pending | Ensures the full workspace still compiles. |
| contracts check | `cargo check -p method-library-contracts` or the formal contracts package check if event DTOs changed | pending | Use actual package name from formal workspace once activated. |
| application check | `cargo check -p method-library-application` or the formal application package check | pending | Use actual package name from formal workspace once activated. |
| infra check | `cargo check -p method-library-infra` or the formal infra package check if fake/publisher files changed | pending | Use actual package name from formal workspace once activated. |
| worker check | `cargo check -p method-library-worker` or the formal worker package check if worker runner files changed | pending | Use actual package name from formal workspace once activated. |
| entry-worker-job outbound/publisher | targeted outbound candidate/outcome/publisher worker tests | pending | Must cover candidate creation, outcome save, publisher failure and duplicate replay. |
| no truth rollback | targeted service/transaction test that publisher failure does not roll back accepted truth | pending | Publisher rollback blocks commit. |
| stored payload replay | targeted test that duplicate publisher uses stored candidate/payload shell and does not recompute current truth | pending | Current truth recomputation blocks commit. |
| redaction/body-free scan | targeted scan/test over outbound artifacts, reports and logs | pending | Unsafe payload, raw body, secret, provider/config material and unsafe refs must not leak. |
| event topic-neutral source dry-run | source/topic matrix and fixture list if formal script/check exists | pending | Missing topic/source behavior must fail safe, not silently succeed. |
| evidence report | run-scoped `entry-worker-job` outbound and redaction artifacts/reports if scripts exist | pending | Optional until scripts exist; generated reports must derive from raw artifacts. |
| whitespace | `git diff --check` and `git diff --cached --check` before commit | pending | Required for Commit Gate. |
| staged scope | `git diff --cached --name-only` | pending | Must match Allowed Scope. |

---

## Gate Matrix

| gate | status | evidence | next_if_failed |
|---|---|---|---|
| activation_gate | pending | Boundary is planned until project ledger advances from `commit-09-a` to `commit-09-b`. | wait_until_current |
| design_gate | pending | Implementation agent must reread Required Reads and confirm outbound candidate, outcome, publisher fake, worker runner and redaction closure. | wait_design |
| scope_gate | pending | Planned changes must be limited to outbound candidate/outcome, publisher fake, worker runner and focused tests. | fix_gate_failure |
| worktree_gate | pending | Initial implementation worktree status recorded; unrelated user changes protected. | fix_gate_failure |
| build_gate | pending | Formatting, workspace/contracts/application/infra/worker checks and dependency boundary checks pass or failure is recorded. | fix_gate_failure |
| test_gate | pending | Entry-worker-job outbound/publisher, no rollback, stored payload replay, redaction/body-free and topic-neutral checks pass after activation. | fix_gate_failure |
| evidence_gate | pending | Targeted artifacts/reports are optional; any generated report must be run-scoped and raw-artifact-derived. | fix_gate_failure |
| commit_gate | pending | staged scope, commit message, whitespace and required checks have evidence. | fix_gate_failure |
| handoff_gate | pending | commit hash, checks run, tests not run, blockers and next boundary state recorded. | handoff |

---

## Commit Gate

| gate | status | evidence |
|---|---|---|
| staged_scope | pending | Must include only allowed `commit-09-b` outbound event, candidate/outcome, publisher fake, worker runner, test and generated targeted evidence files. |
| unrelated_changes | pending | User-owned unrelated changes must remain unstaged. |
| commit_message_format | pending | Planned subject: `feat(event): add outbound publisher worker` |
| commit_body_group | pending | Body group must include `Outbound event candidates:` and `Publisher worker outcomes:` from Step 11 mapping. |
| whitespace | pending | `git diff --cached --check` must pass. |
| required_checks | pending | Required Checks table must have pass/not_applicable evidence. |

---

## Handoff Gate

| gate | status | evidence |
|---|---|---|
| committed_hash | pending | Fill after implementation repo commit. |
| committed_message | pending | Fill after implementation repo commit. |
| gates_run | pending | List exact commands and targeted reports. |
| tests_not_run | pending | Must state none or explain; cannot claim operations job/real transport/release suites. |
| remaining_blockers | pending | Must reference blocker table; any blocking design gap prevents handoff. |
| final_conclusion | pending | Must be one of pass / fail / cannot_decide with exact evidence source. |
| user_owned_changes_untouched | pending | List unrelated files left untouched. |

---

## Blockers

| blocker_id | gate | status | blocking_reason | requested_design_closure | next_allowed_action |
|---|---|---|---|---|---|
| BLK-ML-09B-ACTIVATION-001 | activation_gate | planned | Project ledger has not advanced through `commit-09-a`; this future boundary must not be used for implementation yet. | After `commit-09-a` handoff, update project ledger to `commit-09-b` and set this boundary to current. | wait_until_current |

---

## Experience Review

| item | conclusion | action |
|---|---|---|
| future boundary pre-creation | applies current planned-ledger rule | Pre-created future ledgers must use `planned / wait_until_current` and must not authorize code changes until project ledger advances. |
| outbound publisher closure | existing design-closure rule applies | Event candidate/outcome, publisher fake, worker runner, failure marker, stored payload and redaction gaps must be fixed in `03/05/06/07` before code; implementation must not invent real transport, operations job, truth rollback or current-truth payload recomputation semantics. |
