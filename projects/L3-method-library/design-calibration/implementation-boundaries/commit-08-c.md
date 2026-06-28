# commit-08-c implementation ledger

| field | value |
|---|---|
| project | L3-method-library |
| boundary_id | commit-08-c |
| phase | PH-08 query, read material and projection surfaces |
| design_baseline | `planned-after-d3faf90-handoff-ledger` |
| implementation_repo | `/home/aris/Projects/quantalithos-method-library` |
| status | planned |
| next_allowed_action | wait_until_current |
| current_recovery_point | future extended read surfaces and material marker boundary; cannot start until `commit-08-b` is implemented and project ledger advances |

---

## Activation Guard

| rule | status | consequence |
|---|---|---|
| project ledger current_boundary must equal `commit-08-c` | planned | If project ledger still points to an earlier boundary, implementation agent must not use this file to modify code. |
| `commit-08-b` handoff must be closed | planned | Core query services and no-write guards must exist before extended read surfaces start. |
| project ledger must set `next_allowed_action = read_docs` for `commit-08-c` | planned | Until then this boundary remains `wait_until_current`. |

---

## Required Reads

| document | required_section | status | notes |
|---|---|---|---|
| `standards/document/代码实施台账与门禁规范.md` | planned boundary activation, gate matrix, commit and handoff rules | pending | This future boundary cannot be executed until it becomes current. |
| `standards/document/设计真相源闭环与可落码性标准.md` | no invented extended query flow, material freshness source, degraded marker, fake material store or evidence schema | pending | Missing extended query/material/marker closure must return to design. |
| `standards/coding/rust.md` | Rust application/infra module, fake material store, error and test conventions | pending | Source identifiers, comments, rustdoc, errors and test names must be English. |
| `projects/L3-method-library/00-需求文档.md` | extended read/query scope, no-write rule and body-free old material exclusion | pending | Extended reads must not mutate truth or restore old publish/snapshot/outbox semantics. |
| `projects/L3-method-library/01-架构设计.md` | trace/external/peripheral read boundary, material freshness and marker copy-only rule | pending | `VETO-ML-010` applies if query writes truth, repairs truth or invents marker sources. |
| `projects/L3-method-library/02-概要设计.md` | trace/audit/external/peripheral query and projection/material surface outline | pending | Use current extended query model; do not add refresh job behavior here. |
| `projects/L3-method-library/03-详细设计.md` | extended query flows, projection/material stores, freshness/degraded/unavailable marker sources, state and errors | pending | Formal source for extended read behavior, material freshness and safe degraded/unavailable surfaces. |
| `projects/L3-method-library/04-配置设计.md` | material freshness, degraded/unavailable, marker source and fake material runtime boundary | pending | Runtime/fake material behavior must copy formal markers and not synthesize them. |
| `projects/L3-method-library/05-测试方案.md` | service-flow-fast extended query, infra-runtime-fake material and artifact/report rules | pending | Extended query/material report must derive from raw artifact if generated. |
| `projects/L3-method-library/06-验收标准.md` | ML-SYNC-002, ML-READ-001, ML-RL-008/009/012 and `VETO-ML-010` | pending | Query writes, stale/degraded source gaps or private marker synthesis are blocking. |
| `projects/L3-method-library/07-实施计划.md` | §3, §6, §7, §8, §11 and §12 | pending | Current source for phase, boundary, allowed scope, checks and commit discipline. |
| `projects/L3-method-library/design-calibration/03_ddd_step_05_module_contracts.md` | extended query/read material module boundary | pending | Keep extended query/material separate from refresh jobs, worker events and API query handlers unless formal boundary allows. |
| `projects/L3-method-library/design-calibration/03_ddd_step_06_object_contracts.md` | trace/audit/external/peripheral views, projection material, freshness and degraded marker objects | pending | Required typed refs, marker copy source and state fields must be formal. |
| `projects/L3-method-library/design-calibration/03_ddd_step_07_trait_port_adapter.md` | extended query service ports, material repositories and fake material seams | pending | Do not add ports, stores or fakes beyond formal contracts. |
| `projects/L3-method-library/design-calibration/03_ddd_step_08_protocol_contracts.md` | trace/audit/external/peripheral read surfaces and safe query result contracts | pending | Public surfaces must be safe, page-stable and marker-source explicit. |
| `projects/L3-method-library/design-calibration/03_ddd_step_09_function_flows.md` | trace/audit/external/peripheral query flows and material branches | pending | Service behavior must follow formal flow order and safe failure branches. |
| `projects/L3-method-library/design-calibration/03_ddd_step_10_state_machine.md` | projection/material freshness, degraded and unavailable state guards | pending | Service/material state transitions must match formal state matrix. |
| `projects/L3-method-library/design-calibration/03_ddd_step_11_persistence_tx_consistency.md` | material store, no-write, UoW and transaction consistency | pending | Query path must not mutate truth; material writes must stay within formal read material scope. |
| `projects/L3-method-library/design-calibration/03_ddd_step_12_errors_recovery.md` | extended query safe errors, stale/degraded/unavailable and recovery rules | pending | Errors/logs/reports must be safe and marker-source explicit. |
| `projects/L3-method-library/design-calibration/03_ddd_step_13_concurrency_idempotency.md` | read consistency, duplicate/replay and no truth repair constraints | pending | Extended query services must not reconstruct truth, repair truth or rerun write/refresh flows. |
| `projects/L3-method-library/design-calibration/03_ddd_step_16_test_cut.md` | service-flow-fast extended query and infra-runtime-fake material ownership | pending | Use extended query/material slice only. |
| `projects/L3-method-library/design-calibration/07_implementation_plan_step_06_tasks_commit_boundaries.md` | `commit-08-c` row | pending | Allowed scope is trace/audit/external/peripheral read surfaces, stale/degraded marker copy and material fakes. |
| `projects/L3-method-library/design-calibration/07_implementation_plan_step_07_test_acceptance_gates.md` | `commit-08-c` gate row and PH-08 gate | pending | Required checks are service-flow-fast extended query and infra-runtime-fake material. |
| `projects/L3-method-library/design-calibration/07_implementation_plan_step_11_commit_review_delivery.md` | `commit-08-c` commit body grouping | pending | Commit body must include `Extended read surfaces:` and `Material freshness and degraded markers:`. |
| `/home/aris/Projects/quantalithos-method-library` git status and `commit-08-b` handoff state | latest implementation state | pending | Must confirm core query/no-write boundary landed before this boundary starts. |

---

## Allowed Scope

| type | path_or_rule | status |
|---|---|---|
| allowed_path | `/home/aris/Projects/quantalithos-method-library/crates/application/src/**` for trace/audit/external/peripheral query services, extended read material orchestration, stale/degraded/unavailable handling and safe service errors assigned to `commit-08-c` | planned |
| allowed_path | `/home/aris/Projects/quantalithos-method-library/crates/application/tests/**` for service-flow-fast extended query tests | planned |
| allowed_path | `/home/aris/Projects/quantalithos-method-library/crates/infra/src/**` for formally defined in-memory/fake extended read material repositories, projection material stores and marker-copy seams needed by extended query tests | planned |
| allowed_path | `/home/aris/Projects/quantalithos-method-library/crates/infra/tests/**` for infra-runtime-fake material freshness, stale/degraded and marker-copy tests | planned |
| allowed_path | `/home/aris/Projects/quantalithos-method-library/crates/contracts/src/**` only for narrow compile integration of already-formal extended query DTO/result shells needed by service wiring | planned |
| allowed_path | `/home/aris/Projects/quantalithos-method-library/crates/domain/src/**` only for narrow compile integration of already-formal material marker/value guards needed by service wiring | planned |
| allowed_path | `/home/aris/Projects/quantalithos-method-library/artifacts/test/<run_id>/suites/service-flow-fast/**` only if generated by an actual targeted run after activation | planned |
| allowed_path | `/home/aris/Projects/quantalithos-method-library/artifacts/test/<run_id>/suites/infra-runtime-fake/**` only if generated by an actual targeted run after activation | planned |
| allowed_path | `/home/aris/Projects/quantalithos-method-library/reports/runs/<run_id>/suites/service-flow-fast.md` only if generated from raw artifact after activation | planned |
| allowed_path | `/home/aris/Projects/quantalithos-method-library/reports/runs/<run_id>/suites/infra-runtime-fake.md` only if generated from raw artifact after activation | planned |
| allowed_rule | Implement trace/audit/external/peripheral query services, extended read surfaces, projection/material access, stale/degraded/unavailable branches, marker copy-only behavior and no-write guards explicitly defined by formal design. | planned |
| allowed_rule | Add focused service/fake tests for extended query success/empty/degraded/unavailable branches, material freshness source, stale/degraded marker copy, no truth mutation and safe report/log output. | planned |
| forbidden_rule | Do not implement refresh jobs, read material refresh job family, worker events, inbound/outbound event behavior, API query handlers unless already formal in this boundary, operations replay, report generator or release evidence verdict behavior. | active |
| forbidden_rule | Do not add command/write flow behavior, truth repair, definition/formalization/consumption truth mutation, external provider body handling, archive lifecycle, final report audit or acceptance handoff behavior. | active |
| forbidden_rule | Do not invent extended query flow branches, material store keys, projection refs, marker sources, freshness semantics, degraded/unavailable values, repository methods, config keys, report schema or VETO evidence schema not closed by formal `03/05/06/07`. | active |
| forbidden_rule | Do not synthesize markers, infer missing freshness/degraded/unavailable state from strings, or rebuild current truth when a formal read material, projection freshness ref or resolver summary is required. | active |
| forbidden_rule | Do not persist or expose raw provider body, secret, config/env value, full sensitive ref, stack trace, unsafe source payload or old MethodContent/publish/snapshot/outbox material in services/tests/artifacts/logs. | active |
| forbidden_rule | Do not claim refresh job, worker event, API query, operations replay, report generator, release or final evidence coverage from this boundary. | active |
| forbidden_rule | Do not stage unrelated user changes, generated target directories or implementation outputs from previous boundaries. | active |

---

## Required Checks

| check | command_or_evidence | status | notes |
|---|---|---|---|
| activation guard | project ledger shows `current_boundary = commit-08-c` and `next_allowed_action = read_docs` | pending | Must pass before any implementation edit. |
| prior handoff | `commit-08-b` implementation commit and handoff recorded | pending | Core query/no-write boundary must exist. |
| worktree baseline | `git -C /home/aris/Projects/quantalithos-method-library status --short` | pending | Record before edits and protect unrelated files. |
| local git identity | `git -C /home/aris/Projects/quantalithos-method-library config user.name` and `user.email` | pending | Must remain `quantalithos-labs <quantalithos.ai@gmail.com>`. |
| format | `cargo fmt --all` | pending | Run in implementation repo after Rust changes. |
| workspace check | `cargo check` | pending | Ensures the full workspace still compiles. |
| application check | `cargo check -p method-library-application` or the formal application package check | pending | Use actual package name from formal workspace once activated. |
| infra check | `cargo check -p method-library-infra` or the formal infra package check | pending | Use actual package name from formal workspace once activated. |
| contracts check | `cargo check -p method-library-contracts` or the formal contracts package check if DTO integration changed | pending | Use actual package name from formal workspace once activated. |
| service-flow-fast extended query | targeted trace/audit/external/peripheral query service tests | pending | Must cover no-write behavior, extended surfaces and safe public outputs. |
| infra-runtime-fake material | targeted fake material store/projection freshness/stale/degraded marker tests | pending | Must cover formal material freshness and marker copy-only sources. |
| marker copy-only targeted | targeted check that extended query services copy formal marker/freshness sources and never synthesize markers | pending | Missing marker/freshness source blocks implementation. |
| VETO targeted audit | check `VETO-ML-010` and `VETO-ML-009` risk is not introduced | pending | Query write/truth repair/private marker or unsafe report detail blocks commit. |
| evidence report | run-scoped `service-flow-fast` and `infra-runtime-fake` extended query/material artifacts/reports if scripts exist | pending | Optional until scripts exist; generated reports must derive from raw artifacts. |
| whitespace | `git diff --check` and `git diff --cached --check` before commit | pending | Required for Commit Gate. |
| staged scope | `git diff --cached --name-only` | pending | Must match Allowed Scope. |

---

## Gate Matrix

| gate | status | evidence | next_if_failed |
|---|---|---|---|
| activation_gate | pending | Boundary is planned until project ledger advances from `commit-08-b` to `commit-08-c`. | wait_until_current |
| design_gate | pending | Implementation agent must reread Required Reads and confirm extended query, material freshness, degraded marker and no-write closure. | wait_design |
| scope_gate | pending | Planned changes must be limited to extended query services/read materials, formal fake material stores and focused tests. | fix_gate_failure |
| worktree_gate | pending | Initial implementation worktree status recorded; unrelated user changes protected. | fix_gate_failure |
| build_gate | pending | Formatting, workspace/application/infra/contracts checks and dependency boundary checks pass or failure is recorded. | fix_gate_failure |
| test_gate | pending | Service-flow-fast extended query, infra-runtime-fake material, marker copy-only and VETO targeted checks pass after activation. | fix_gate_failure |
| evidence_gate | pending | Targeted artifacts/reports are optional; any generated report must be run-scoped and raw-artifact-derived. | fix_gate_failure |
| commit_gate | pending | staged scope, commit message, whitespace and required checks have evidence. | fix_gate_failure |
| handoff_gate | pending | commit hash, checks run, tests not run, blockers and next boundary state recorded. | handoff |

---

## Commit Gate

| gate | status | evidence |
|---|---|---|
| staged_scope | pending | Must include only allowed `commit-08-c` extended query service, material/fake store, test and generated targeted evidence files. |
| unrelated_changes | pending | User-owned unrelated changes must remain unstaged. |
| commit_message_format | pending | Planned subject: `feat(query): add extended read surfaces` |
| commit_body_group | pending | Body group must include `Extended read surfaces:` and `Material freshness and degraded markers:` from Step 11 mapping. |
| whitespace | pending | `git diff --cached --check` must pass. |
| required_checks | pending | Required Checks table must have pass/not_applicable evidence. |

---

## Handoff Gate

| gate | status | evidence |
|---|---|---|
| committed_hash | pending | Fill after implementation repo commit. |
| committed_message | pending | Fill after implementation repo commit. |
| gates_run | pending | List exact commands and targeted reports. |
| tests_not_run | pending | Must state none or explain; cannot claim refresh job/worker/API/release suites. |
| remaining_blockers | pending | Must reference blocker table; any blocking design gap prevents handoff. |
| final_conclusion | pending | Must be one of pass / fail / cannot_decide with exact evidence source. |
| user_owned_changes_untouched | pending | List unrelated files left untouched. |

---

## Blockers

| blocker_id | gate | status | blocking_reason | requested_design_closure | next_allowed_action |
|---|---|---|---|---|---|
| BLK-ML-08C-ACTIVATION-001 | activation_gate | planned | Project ledger has not advanced through `commit-08-b`; this future boundary must not be used for implementation yet. | After `commit-08-b` handoff, update project ledger to `commit-08-c` and set this boundary to current. | wait_until_current |

---

## Experience Review

| item | conclusion | action |
|---|---|---|
| future boundary pre-creation | applies current planned-ledger rule | Pre-created future ledgers must use `planned / wait_until_current` and must not authorize code changes until project ledger advances. |
| extended query material closure | existing design-closure rule applies | Extended query, material freshness, stale/degraded marker, fake material and no-write gaps must be fixed in `03/05/06/07` before code; implementation must not invent refresh job behavior, truth repair or synthetic marker semantics. |
