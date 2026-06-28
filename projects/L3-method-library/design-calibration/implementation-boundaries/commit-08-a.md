# commit-08-a implementation ledger

| field | value |
|---|---|
| project | L3-method-library |
| boundary_id | commit-08-a |
| phase | PH-08 query, read material and projection surfaces |
| design_baseline | `planned-after-d3faf90-handoff-ledger` |
| implementation_repo | `/home/aris/Projects/quantalithos-method-library` |
| status | planned |
| next_allowed_action | wait_until_current |
| current_recovery_point | future query/view DTO and read material port boundary; cannot start until `commit-07-b` is implemented and project ledger advances |

---

## Activation Guard

| rule | status | consequence |
|---|---|---|
| project ledger current_boundary must equal `commit-08-a` | planned | If project ledger still points to an earlier boundary, implementation agent must not use this file to modify code. |
| `commit-07-b` handoff must be closed | planned | Peripheral package/set residual boundary must exist before PH-08 query/read material contract work starts. |
| project ledger must set `next_allowed_action = read_docs` for `commit-08-a` | planned | Until then this boundary remains `wait_until_current`. |

---

## Required Reads

| document | required_section | status | notes |
|---|---|---|---|
| `standards/document/代码实施台账与门禁规范.md` | planned boundary activation, gate matrix, commit and handoff rules | pending | This future boundary cannot be executed until it becomes current. |
| `standards/document/设计真相源闭环与可落码性标准.md` | no invented query DTO, view surface, material port, marker source, repository port or evidence schema | pending | Missing query/view/material field or marker source must return to design. |
| `standards/coding/rust.md` | Rust contract/application port module, error and test conventions | pending | Source identifiers, comments, rustdoc, errors and test names must be English. |
| `projects/L3-method-library/00-需求文档.md` | read/query scope, no-write rule and old material exclusion | pending | Query surfaces must not mutate truth or restore old publish/snapshot/outbox semantics. |
| `projects/L3-method-library/01-架构设计.md` | query/read material dependency direction and marker copy-only rule | pending | `VETO-ML-010` applies if query writes truth or invents marker sources. |
| `projects/L3-method-library/02-概要设计.md` | query/view DTO, read material and projection surface outline | pending | Use current query family and material shape; do not implement query service behavior here. |
| `projects/L3-method-library/03-详细设计.md` | 57 Query shells, view/page surfaces, material/repository ports, marker and error contracts | pending | Formal source for query DTOs, page/view shells, read material ports and safe public surfaces. |
| `projects/L3-method-library/04-配置设计.md` | read material unavailable/degraded and marker source boundary | pending | This boundary defines contracts/ports only; no runtime material store or refresh behavior. |
| `projects/L3-method-library/05-测试方案.md` | contracts check, query DTO tests and artifact/report rules | pending | Query DTO report is optional; any generated report must derive from raw artifact. |
| `projects/L3-method-library/06-验收标准.md` | ML-SYNC-002 seed, ML-READ-001 seed, ML-RL-008/009/012 and `VETO-ML-010` | pending | Query writes and private marker synthesis are blocking. |
| `projects/L3-method-library/07-实施计划.md` | §3, §6, §7, §8, §11 and §12 | pending | Current source for phase, boundary, allowed scope, checks and commit discipline. |
| `projects/L3-method-library/design-calibration/03_ddd_step_05_module_contracts.md` | query/read material module boundary | pending | Keep query contract/port shells separate from query services, stores and API handlers. |
| `projects/L3-method-library/design-calibration/03_ddd_step_06_object_contracts.md` | view/page surfaces, read material objects, freshness/degraded/unavailable marker objects | pending | Required typed refs, marker copy source and state fields must be formal. |
| `projects/L3-method-library/design-calibration/03_ddd_step_07_trait_port_adapter.md` | read material/repository ports and query adapter seams | pending | Do not add ports, stores or fakes beyond formal contracts. |
| `projects/L3-method-library/design-calibration/03_ddd_step_08_protocol_contracts.md` | 57 Query DTO shells and safe query result contracts | pending | Public query surfaces must be safe, page-stable and marker-source explicit. |
| `projects/L3-method-library/design-calibration/03_ddd_step_09_function_flows.md` | query flow contract inputs and material access expectations | pending | Use only to shape DTO/port boundaries; do not implement flow behavior in this boundary. |
| `projects/L3-method-library/design-calibration/03_ddd_step_10_state_machine.md` | query/read material freshness, degraded and unavailable state guards | pending | State enum/value surfaces must match formal matrix. |
| `projects/L3-method-library/design-calibration/03_ddd_step_11_persistence_tx_consistency.md` | material/repository port consistency and no-write constraints | pending | Ports must not imply query truth mutation. |
| `projects/L3-method-library/design-calibration/03_ddd_step_12_errors_recovery.md` | query safe errors, degraded/unavailable surfaces and recovery rules | pending | Errors must be safe and marker-source explicit. |
| `projects/L3-method-library/design-calibration/03_ddd_step_13_concurrency_idempotency.md` | read consistency, replay and marker source constraints | pending | Query contracts must support no-write and copy-only marker semantics. |
| `projects/L3-method-library/design-calibration/03_ddd_step_16_test_cut.md` | query DTO contract tests and PH-08 test ownership | pending | Use query DTO/port contract slice only. |
| `projects/L3-method-library/design-calibration/07_implementation_plan_step_06_tasks_commit_boundaries.md` | `commit-08-a` row | pending | Allowed scope is 57 query shells, view/page surfaces and material/repository ports. |
| `projects/L3-method-library/design-calibration/07_implementation_plan_step_07_test_acceptance_gates.md` | `commit-08-a` gate row and PH-08 gate | pending | Required checks are contracts check and query DTO tests; query DTO report optional. |
| `projects/L3-method-library/design-calibration/07_implementation_plan_step_11_commit_review_delivery.md` | `commit-08-a` commit body grouping | pending | Commit body must include `Query and view contracts:` and `Read material ports:`. |
| `/home/aris/Projects/quantalithos-method-library` git status and `commit-07-b` handoff state | latest implementation state | pending | Must confirm peripheral residual boundary landed before this boundary starts. |

---

## Allowed Scope

| type | path_or_rule | status |
|---|---|---|
| allowed_path | `/home/aris/Projects/quantalithos-method-library/crates/contracts/src/**` for 57 query DTO shells, query request/result shells, view/page surfaces, safe marker wrappers and query public error/result shells assigned to `commit-08-a` | planned |
| allowed_path | `/home/aris/Projects/quantalithos-method-library/crates/contracts/tests/**` for query DTO, view/page surface and marker-source fixture tests | planned |
| allowed_path | `/home/aris/Projects/quantalithos-method-library/crates/application/src/**` for read material/repository port traits, query access port shells and no-write interface markers assigned to `commit-08-a` | planned |
| allowed_path | `/home/aris/Projects/quantalithos-method-library/crates/application/tests/**` for compile/contract tests of read material ports if formal workspace uses application-level port tests | planned |
| allowed_path | `/home/aris/Projects/quantalithos-method-library/crates/domain/src/**` only for narrow read material marker/value guards explicitly defined by formal design | planned |
| allowed_path | `/home/aris/Projects/quantalithos-method-library/crates/domain/tests/**` only for focused marker/value guard tests if those guards are formal domain objects | planned |
| allowed_path | `/home/aris/Projects/quantalithos-method-library/artifacts/test/<run_id>/suites/contract-domain-fast/**` only if generated by an actual targeted run after activation | planned |
| allowed_path | `/home/aris/Projects/quantalithos-method-library/reports/runs/<run_id>/suites/contract-domain-fast.md` only if generated from raw artifact after activation | planned |
| allowed_path | `/home/aris/Projects/quantalithos-method-library/reports/runs/<run_id>/query-dto-report.md` only if generated from an actual targeted query DTO run after activation | planned |
| allowed_rule | Add query/view DTO shells, page/view surfaces, read material/repository port traits, freshness/degraded/unavailable marker wrappers and safe query errors explicitly defined by formal design. | planned |
| allowed_rule | Add focused compile/contract tests for query DTO completeness, view/page surface shape, port signatures, marker-source explicitness and no query write capability. | planned |
| forbidden_rule | Do not implement query service behavior, query flow orchestration, material store behavior, repository fake storage, projection refresh, API query handler, worker, operations job or report generator behavior. | active |
| forbidden_rule | Do not add core query services, trace/external/peripheral query services, stale/degraded marker copy behavior, infra material store, refresh jobs, worker events or release evidence verdict behavior. | active |
| forbidden_rule | Do not invent query DTO fields, view/page fields, material port methods, repository keys, marker sources, freshness semantics, degraded/unavailable values, config keys, report schema or VETO evidence schema not closed by formal `03/05/06/07`. | active |
| forbidden_rule | Do not let any query contract imply truth mutation, side effect, current truth repair, marker synthesis or stale/degraded fallback without a formal source. | active |
| forbidden_rule | Do not persist or expose raw provider body, secret, config/env value, full sensitive ref, stack trace, unsafe source payload or old MethodContent/publish/snapshot/outbox material in DTOs/tests/artifacts/logs. | active |
| forbidden_rule | Do not claim core query service, extended query, material store, API handler, query report, no-write runtime proof, refresh job or release coverage from this boundary. | active |
| forbidden_rule | Do not stage unrelated user changes, generated target directories or implementation outputs from previous boundaries. | active |

---

## Required Checks

| check | command_or_evidence | status | notes |
|---|---|---|---|
| activation guard | project ledger shows `current_boundary = commit-08-a` and `next_allowed_action = read_docs` | pending | Must pass before any implementation edit. |
| prior handoff | `commit-07-b` implementation commit and handoff recorded | pending | Peripheral residual boundary must exist. |
| worktree baseline | `git -C /home/aris/Projects/quantalithos-method-library status --short` | pending | Record before edits and protect unrelated files. |
| local git identity | `git -C /home/aris/Projects/quantalithos-method-library config user.name` and `user.email` | pending | Must remain `quantalithos-labs <quantalithos.ai@gmail.com>`. |
| format | `cargo fmt --all` | pending | Run in implementation repo after Rust changes. |
| workspace check | `cargo check` | pending | Ensures the full workspace still compiles. |
| contracts check | `cargo check -p method-library-contracts` or the formal contracts package check | pending | Use actual package name from formal workspace once activated. |
| application check | `cargo check -p method-library-application` or the formal application package check if port files changed | pending | Use actual package name from formal workspace once activated. |
| domain check | `cargo check -p method-library-domain` or the formal domain package check if marker guards changed | pending | Use actual package name from formal workspace once activated. |
| query DTO tests | targeted query DTO/view/page/marker-source tests | pending | Must cover 57 query shell completeness where formal test data exists. |
| no-write interface seed | static/compile check that query DTO/port shells expose no write/truth mutation capability | pending | Runtime no-write service tests belong to `commit-08-b`/`commit-08-c`. |
| marker source closure seed | query marker source dry-run or checklist from formal surfaces | pending | Missing marker source blocks implementation; no synthetic marker allowed. |
| evidence report | run-scoped query DTO artifact/report if scripts exist | pending | Optional until scripts exist; generated reports must derive from raw artifacts. |
| whitespace | `git diff --check` and `git diff --cached --check` before commit | pending | Required for Commit Gate. |
| staged scope | `git diff --cached --name-only` | pending | Must match Allowed Scope. |

---

## Gate Matrix

| gate | status | evidence | next_if_failed |
|---|---|---|---|
| activation_gate | pending | Boundary is planned until project ledger advances from `commit-07-b` to `commit-08-a`. | wait_until_current |
| design_gate | pending | Implementation agent must reread Required Reads and confirm query DTO, view/page surface, material port and marker source closure. | wait_design |
| scope_gate | pending | Planned changes must be limited to query/view contracts, read material ports and focused contract tests. | fix_gate_failure |
| worktree_gate | pending | Initial implementation worktree status recorded; unrelated user changes protected. | fix_gate_failure |
| build_gate | pending | Formatting, workspace/contracts/application/domain checks and dependency boundary checks pass or failure is recorded. | fix_gate_failure |
| test_gate | pending | Query DTO tests, no-write interface seed and marker source closure seed pass after activation. | fix_gate_failure |
| evidence_gate | pending | Targeted artifact/report is optional; any generated report must be run-scoped and raw-artifact-derived. | fix_gate_failure |
| commit_gate | pending | staged scope, commit message, whitespace and required checks have evidence. | fix_gate_failure |
| handoff_gate | pending | commit hash, checks run, tests not run, blockers and next boundary state recorded. | handoff |

---

## Commit Gate

| gate | status | evidence |
|---|---|---|
| staged_scope | pending | Must include only allowed `commit-08-a` query/view DTO, read material port, marker guard, test and generated targeted evidence files. |
| unrelated_changes | pending | User-owned unrelated changes must remain unstaged. |
| commit_message_format | pending | Planned subject: `feat(query): add view contracts and material ports` |
| commit_body_group | pending | Body group must include `Query and view contracts:` and `Read material ports:` from Step 11 mapping. |
| whitespace | pending | `git diff --cached --check` must pass. |
| required_checks | pending | Required Checks table must have pass/not_applicable evidence. |

---

## Handoff Gate

| gate | status | evidence |
|---|---|---|
| committed_hash | pending | Fill after implementation repo commit. |
| committed_message | pending | Fill after implementation repo commit. |
| gates_run | pending | List exact commands and targeted reports. |
| tests_not_run | pending | Must state none or explain; cannot claim query service/material/API/runtime no-write suites. |
| remaining_blockers | pending | Must reference blocker table; any blocking design gap prevents handoff. |
| final_conclusion | pending | Must be one of pass / fail / cannot_decide with exact evidence source. |
| user_owned_changes_untouched | pending | List unrelated files left untouched. |

---

## Blockers

| blocker_id | gate | status | blocking_reason | requested_design_closure | next_allowed_action |
|---|---|---|---|---|---|
| BLK-ML-08A-ACTIVATION-001 | activation_gate | planned | Project ledger has not advanced through `commit-07-b`; this future boundary must not be used for implementation yet. | After `commit-07-b` handoff, update project ledger to `commit-08-a` and set this boundary to current. | wait_until_current |

---

## Experience Review

| item | conclusion | action |
|---|---|---|
| future boundary pre-creation | applies current planned-ledger rule | Pre-created future ledgers must use `planned / wait_until_current` and must not authorize code changes until project ledger advances. |
| query contract closure | existing design-closure rule applies | Query DTO, view/page surface, read material port and marker source gaps must be fixed in `03/05/06/07` before code; implementation must not invent query service behavior, writes or synthetic marker semantics. |
