# commit-09-a implementation ledger

| field | value |
|---|---|
| project | L3-method-library |
| boundary_id | commit-09-a |
| phase | PH-09 inbound / outbound event and publisher worker |
| design_baseline | `planned-after-d3faf90-handoff-ledger` |
| implementation_repo | `/home/aris/Projects/quantalithos-method-library` |
| status | planned |
| next_allowed_action | wait_until_current |
| current_recovery_point | future inbound consumer intake/receipt boundary; cannot start until `commit-08-c` is implemented and project ledger advances |

---

## Activation Guard

| rule | status | consequence |
|---|---|---|
| project ledger current_boundary must equal `commit-09-a` | planned | If project ledger still points to an earlier boundary, implementation agent must not use this file to modify code. |
| `commit-08-c` handoff must be closed | planned | Extended query/material boundary must exist before inbound worker/receipt work starts. |
| project ledger must set `next_allowed_action = read_docs` for `commit-09-a` | planned | Until then this boundary remains `wait_until_current`. |

---

## Required Reads

| document | required_section | status | notes |
|---|---|---|---|
| `standards/document/代码实施台账与门禁规范.md` | planned boundary activation, gate matrix, commit and handoff rules | pending | This future boundary cannot be executed until it becomes current. |
| `standards/document/设计真相源闭环与可落码性标准.md` | no invented consumer envelope, receipt schema, dedup key, source adapter fake, worker entry or evidence schema | pending | Missing inbound envelope/receipt/dedup/parse closure must return to design. |
| `standards/coding/rust.md` | Rust contracts/application/infra/worker module, error and test conventions | pending | Source identifiers, comments, rustdoc, errors and test names must be English. |
| `projects/L3-method-library/00-需求文档.md` | inbound consumer scope, receipt replay and no truth repair rule | pending | Inbound intake records safe receipt/outcome and must not mutate core truth directly. |
| `projects/L3-method-library/01-架构设计.md` | inbound/outbound event seam, topic-neutral binding and truth boundary | pending | Inbound missing topic/source must fail safe; inbound must not become a write-side truth repair path. |
| `projects/L3-method-library/02-概要设计.md` | inbound consumer envelope, receipt store and source adapter fake outline | pending | Use current consumer family and receipt model; do not add outbound candidate/publisher here. |
| `projects/L3-method-library/03-详细设计.md` | 4 Inbound Consumer envelopes, receipt/dedup ports, worker entry, flow, state and errors | pending | Formal source for envelope fields, digest/key, receipt replay and unsupported parse behavior. |
| `projects/L3-method-library/04-配置设计.md` | inbound source binding, topic-neutral source, disabled/degraded and redaction boundary | pending | Source adapter fake must follow formal config/binding rules; no real transport unless formal. |
| `projects/L3-method-library/05-测试方案.md` | entry-worker-job inbound slice and artifact/report rules | pending | Inbound report must derive from raw artifact if generated. |
| `projects/L3-method-library/06-验收标准.md` | ML-SYNC-003, ML-TX-002 and PH-09 VETO/redaction constraints | pending | Inbound truth mutation, unsupported parse success or unsafe payload leak blocks commit. |
| `projects/L3-method-library/07-实施计划.md` | §3, §6, §7, §8, §11 and §12 | pending | Current source for phase, boundary, allowed scope, checks and commit discipline. |
| `projects/L3-method-library/design-calibration/03_ddd_step_05_module_contracts.md` | inbound worker/event module boundary | pending | Keep inbound intake/receipt separate from outbound publisher and operations jobs. |
| `projects/L3-method-library/design-calibration/03_ddd_step_06_object_contracts.md` | consumer envelope, receipt, dedup key, source marker and safe payload shell objects | pending | Required typed refs, digest fields and safe payload surfaces must be formal. |
| `projects/L3-method-library/design-calibration/03_ddd_step_07_trait_port_adapter.md` | inbound consumer ports, receipt store, dedup/replay port and source adapter fake seam | pending | Do not add ports, stores or fakes beyond formal contracts. |
| `projects/L3-method-library/design-calibration/03_ddd_step_08_protocol_contracts.md` | inbound consumer protocol shells and receipt/result contracts | pending | Public receipt surfaces must be safe and must not include raw inbound body. |
| `projects/L3-method-library/design-calibration/03_ddd_step_09_function_flows.md` | inbound intake, parse, receipt and dedup replay flows | pending | Flow order, unsupported parse and duplicate receipt behavior must be formal. |
| `projects/L3-method-library/design-calibration/03_ddd_step_10_state_machine.md` | inbound receipt/dedup state guards | pending | Receipt states and duplicate replay transitions must match formal state matrix. |
| `projects/L3-method-library/design-calibration/03_ddd_step_11_persistence_tx_consistency.md` | receipt store, UoW, dedup and transaction consistency | pending | Receipt save/replay must be atomic and must not roll into core truth mutation. |
| `projects/L3-method-library/design-calibration/03_ddd_step_12_errors_recovery.md` | inbound safe errors, unsupported parse and source unavailable recovery | pending | Errors/logs/reports must be safe, refs-only and body-free. |
| `projects/L3-method-library/design-calibration/03_ddd_step_13_concurrency_idempotency.md` | inbound dedup key, digest, stored receipt and duplicate replay constraints | pending | Duplicate inbound must return stored receipt and must not rerun side effects. |
| `projects/L3-method-library/design-calibration/03_ddd_step_16_test_cut.md` | entry-worker-job inbound slice ownership | pending | Use inbound consumer/receipt slice only. |
| `projects/L3-method-library/design-calibration/07_implementation_plan_step_06_tasks_commit_boundaries.md` | `commit-09-a` row | pending | Allowed scope is 4 consumer envelopes, receipt store, dedup replay and source adapter fake. |
| `projects/L3-method-library/design-calibration/07_implementation_plan_step_07_test_acceptance_gates.md` | `commit-09-a` gate row and PH-09 gate | pending | Required checks are entry-worker-job inbound slice and service receipt evidence. |
| `projects/L3-method-library/design-calibration/07_implementation_plan_step_11_commit_review_delivery.md` | `commit-09-a` commit body grouping | pending | Commit body must include `Inbound consumer contracts:` and `Receipt and dedup services:`. |
| `/home/aris/Projects/quantalithos-method-library` git status and `commit-08-c` handoff state | latest implementation state | pending | Must confirm extended query/material boundary landed before this boundary starts. |

---

## Allowed Scope

| type | path_or_rule | status |
|---|---|---|
| allowed_path | `/home/aris/Projects/quantalithos-method-library/crates/contracts/src/**` for 4 inbound consumer envelopes, receipt DTOs, dedup key/digest shells, safe source refs and public result/error shells assigned to `commit-09-a` | planned |
| allowed_path | `/home/aris/Projects/quantalithos-method-library/crates/contracts/tests/**` for inbound envelope/receipt contract fixture tests | planned |
| allowed_path | `/home/aris/Projects/quantalithos-method-library/crates/application/src/**` for inbound intake services, receipt/dedup services, duplicate replay orchestration and safe service errors assigned to `commit-09-a` | planned |
| allowed_path | `/home/aris/Projects/quantalithos-method-library/crates/application/tests/**` for inbound service/receipt/dedup tests | planned |
| allowed_path | `/home/aris/Projects/quantalithos-method-library/crates/infra/src/**` for formally defined in-memory/fake receipt store, dedup store and source adapter fake needed by inbound tests | planned |
| allowed_path | `/home/aris/Projects/quantalithos-method-library/crates/infra/tests/**` for fake receipt store, dedup replay and source adapter fake tests | planned |
| allowed_path | `/home/aris/Projects/quantalithos-method-library/crates/worker/src/**` for inbound worker entry/runner shell that only calls the application facade assigned to `commit-09-a` | planned |
| allowed_path | `/home/aris/Projects/quantalithos-method-library/crates/worker/tests/**` for entry-worker-job inbound runner tests if formal workspace uses worker-level tests | planned |
| allowed_path | `/home/aris/Projects/quantalithos-method-library/crates/domain/src/**` only for narrow receipt/dedup state guards explicitly defined by formal design | planned |
| allowed_path | `/home/aris/Projects/quantalithos-method-library/artifacts/test/<run_id>/suites/entry-worker-job/**` only if generated by an actual targeted run after activation | planned |
| allowed_path | `/home/aris/Projects/quantalithos-method-library/reports/runs/<run_id>/suites/entry-worker-job.md` only if generated from raw artifact after activation | planned |
| allowed_rule | Implement inbound envelope parsing/intake, receipt save/get, dedup key/digest replay, source adapter fake and inbound worker entry behavior explicitly defined by formal design. | planned |
| allowed_rule | Add focused tests for supported parse, unsupported parse safe failure, duplicate receipt replay, no core truth mutation, source unavailable/degraded behavior and body-free artifacts/logs. | planned |
| forbidden_rule | Do not implement outbound event candidate, publisher worker, publisher outcome, real transport, operations job, recovery/replay job, query/material refresh, report generator or release evidence verdict behavior. | active |
| forbidden_rule | Do not mutate definition/formalization/consumption/core truth from inbound intake; inbound may only persist formal receipt/dedup/source state unless formal design says otherwise. | active |
| forbidden_rule | Do not invent consumer envelope fields, receipt schema, dedup key/digest algorithm, parser behavior, source adapter fake behavior, topic binding, config keys, report schema or evidence schema not closed by formal `03/05/06/07`. | active |
| forbidden_rule | Do not treat unsupported parse, missing topic/source, source unavailable or unknown envelope as accepted success unless formal flow defines that exact safe surface. | active |
| forbidden_rule | Do not persist or expose raw inbound body, raw provider body, secret, config/env value, full sensitive ref, stack trace, unsafe source payload or old MethodContent/publish/snapshot/outbox material in services/tests/artifacts/logs. | active |
| forbidden_rule | Do not claim outbound/publisher, operations replay, refresh job, real transport, report generator, release or final evidence coverage from this boundary. | active |
| forbidden_rule | Do not stage unrelated user changes, generated target directories or implementation outputs from previous boundaries. | active |

---

## Required Checks

| check | command_or_evidence | status | notes |
|---|---|---|---|
| activation guard | project ledger shows `current_boundary = commit-09-a` and `next_allowed_action = read_docs` | pending | Must pass before any implementation edit. |
| prior handoff | `commit-08-c` implementation commit and handoff recorded | pending | Extended query/material boundary must exist. |
| worktree baseline | `git -C /home/aris/Projects/quantalithos-method-library status --short` | pending | Record before edits and protect unrelated files. |
| local git identity | `git -C /home/aris/Projects/quantalithos-method-library config user.name` and `user.email` | pending | Must remain `quantalithos-labs <quantalithos.ai@gmail.com>`. |
| format | `cargo fmt --all` | pending | Run in implementation repo after Rust changes. |
| workspace check | `cargo check` | pending | Ensures the full workspace still compiles. |
| contracts check | `cargo check -p method-library-contracts` or the formal contracts package check if envelopes/receipts changed | pending | Use actual package name from formal workspace once activated. |
| application check | `cargo check -p method-library-application` or the formal application package check | pending | Use actual package name from formal workspace once activated. |
| infra check | `cargo check -p method-library-infra` or the formal infra package check if fake/source files changed | pending | Use actual package name from formal workspace once activated. |
| worker check | `cargo check -p method-library-worker` or the formal worker package check if worker entry files changed | pending | Use actual package name from formal workspace once activated. |
| entry-worker-job inbound slice | targeted inbound consumer/receipt/dedup worker tests | pending | Must cover supported parse, unsupported parse, receipt replay and source adapter fake. |
| no core truth mutation | targeted static/service test that inbound intake writes only receipt/dedup/source state | pending | Inbound truth mutation blocks commit. |
| redaction/body-free scan | targeted scan/test over inbound artifacts, reports and logs | pending | Raw inbound body, secret, provider/config material and unsafe refs must not leak. |
| event topic-neutral source dry-run | source/topic matrix and fixture list if formal script/check exists | pending | Missing topic/source behavior must fail safe, not silently succeed. |
| evidence report | run-scoped `entry-worker-job` inbound artifacts/reports if scripts exist | pending | Optional until scripts exist; generated reports must derive from raw artifacts. |
| whitespace | `git diff --check` and `git diff --cached --check` before commit | pending | Required for Commit Gate. |
| staged scope | `git diff --cached --name-only` | pending | Must match Allowed Scope. |

---

## Gate Matrix

| gate | status | evidence | next_if_failed |
|---|---|---|---|
| activation_gate | pending | Boundary is planned until project ledger advances from `commit-08-c` to `commit-09-a`. | wait_until_current |
| design_gate | pending | Implementation agent must reread Required Reads and confirm inbound envelope, receipt, dedup, source adapter fake and worker entry closure. | wait_design |
| scope_gate | pending | Planned changes must be limited to inbound consumer/receipt/dedup/source fake, inbound worker entry and focused tests. | fix_gate_failure |
| worktree_gate | pending | Initial implementation worktree status recorded; unrelated user changes protected. | fix_gate_failure |
| build_gate | pending | Formatting, workspace/contracts/application/infra/worker checks and dependency boundary checks pass or failure is recorded. | fix_gate_failure |
| test_gate | pending | Entry-worker-job inbound, no core truth mutation, redaction/body-free and topic-neutral source checks pass after activation. | fix_gate_failure |
| evidence_gate | pending | Targeted artifacts/reports are optional; any generated report must be run-scoped and raw-artifact-derived. | fix_gate_failure |
| commit_gate | pending | staged scope, commit message, whitespace and required checks have evidence. | fix_gate_failure |
| handoff_gate | pending | commit hash, checks run, tests not run, blockers and next boundary state recorded. | handoff |

---

## Commit Gate

| gate | status | evidence |
|---|---|---|
| staged_scope | pending | Must include only allowed `commit-09-a` inbound envelope, receipt/dedup, source fake, worker entry, test and generated targeted evidence files. |
| unrelated_changes | pending | User-owned unrelated changes must remain unstaged. |
| commit_message_format | pending | Planned subject: `feat(inbound): add receipt dedup intake` |
| commit_body_group | pending | Body group must include `Inbound consumer contracts:` and `Receipt and dedup services:` from Step 11 mapping. |
| whitespace | pending | `git diff --cached --check` must pass. |
| required_checks | pending | Required Checks table must have pass/not_applicable evidence. |

---

## Handoff Gate

| gate | status | evidence |
|---|---|---|
| committed_hash | pending | Fill after implementation repo commit. |
| committed_message | pending | Fill after implementation repo commit. |
| gates_run | pending | List exact commands and targeted reports. |
| tests_not_run | pending | Must state none or explain; cannot claim outbound/publisher/job/release suites. |
| remaining_blockers | pending | Must reference blocker table; any blocking design gap prevents handoff. |
| final_conclusion | pending | Must be one of pass / fail / cannot_decide with exact evidence source. |
| user_owned_changes_untouched | pending | List unrelated files left untouched. |

---

## Blockers

| blocker_id | gate | status | blocking_reason | requested_design_closure | next_allowed_action |
|---|---|---|---|---|---|
| BLK-ML-09A-ACTIVATION-001 | activation_gate | planned | Project ledger has not advanced through `commit-08-c`; this future boundary must not be used for implementation yet. | After `commit-08-c` handoff, update project ledger to `commit-09-a` and set this boundary to current. | wait_until_current |

---

## Experience Review

| item | conclusion | action |
|---|---|---|
| future boundary pre-creation | applies current planned-ledger rule | Pre-created future ledgers must use `planned / wait_until_current` and must not authorize code changes until project ledger advances. |
| inbound receipt closure | existing design-closure rule applies | Inbound envelope, receipt schema, dedup key/digest, source adapter fake, unsupported parse and body-free gaps must be fixed in `03/05/06/07` before code; implementation must not invent core truth mutation or outbound publisher semantics. |
