# commit-03-b implementation ledger

| field | value |
|---|---|
| project | L3-method-library |
| boundary_id | commit-03-b |
| phase | PH-03 method asset definition and catalog truth |
| design_baseline | `planned-after-d3faf90-handoff-ledger` |
| implementation_repo | `/home/aris/Projects/quantalithos-method-library` |
| status | planned |
| next_allowed_action | wait_until_current |
| current_recovery_point | future definition/catalog accepted service vertical slice boundary; cannot start until `commit-03-a` is implemented and project ledger advances |

---

## Activation Guard

| rule | status | consequence |
|---|---|---|
| project ledger current_boundary must equal `commit-03-b` | planned | If project ledger still points to an earlier boundary, implementation agent must not use this file to modify code. |
| `commit-03-a` handoff must be closed | planned | Definition/catalog contracts and domain truth state must exist before accepted service flow work starts. |
| project ledger must set `next_allowed_action = read_docs` for `commit-03-b` | planned | Until then this boundary remains `wait_until_current`. |

---

## Required Reads

| document | required_section | status | notes |
|---|---|---|---|
| `standards/document/代码实施台账与门禁规范.md` | planned boundary activation, gate matrix, commit and handoff rules | pending | This future boundary cannot be executed until it becomes current. |
| `standards/document/设计真相源闭环与可落码性标准.md` | no invented service flow, repository port/fake, UoW, stored result, config or evidence fields | pending | Any missing accepted flow, repository or stored result surface must return to design. |
| `standards/coding/rust.md` | Rust application/infra/API module, trait, error and test conventions | pending | Source identifiers, comments, rustdoc, errors and test names must be English. |
| `projects/L3-method-library/00-需求文档.md` | definition/catalog P0 use cases and boundary rules | pending | Accepted flow must serve current definition/catalog truth, not old publish/snapshot/outbox behavior. |
| `projects/L3-method-library/01-架构设计.md` | truth owner, transaction direction and dependency direction | pending | Downstream use truth must not replace method-library definition truth. |
| `projects/L3-method-library/02-概要设计.md` | definition/catalog processing flow and code subject framework | pending | Minimal API entry only delegates to application facade. |
| `projects/L3-method-library/03-详细设计.md` | trait/port contracts, protocol contracts, function flows, persistence/UoW, error/recovery, idempotency and implementation handoff | pending | Formal source for accepted service flow, repository fake behavior, UoW order and stored result. |
| `projects/L3-method-library/04-配置设计.md` | controlled/fake adapter binding and body-free redaction | pending | Fake runtime must keep formal semantics and must not add unclosed config keys. |
| `projects/L3-method-library/05-测试方案.md` | service-flow-fast, infra-runtime-fake and artifact/report rules | pending | Targeted reports must derive from raw artifacts if generated. |
| `projects/L3-method-library/06-验收标准.md` | ML-FG-001/005, ML-RL-001, ML-TX-001, ML-SYNC-001 and evidence integrity | pending | Accepted service and UoW rollback are blocking for PH-03. |
| `projects/L3-method-library/07-实施计划.md` | §3, §6, §7, §8, §11 and §12 | pending | Current source for phase, boundary, allowed scope, checks and commit discipline. |
| `projects/L3-method-library/design-calibration/03_ddd_step_07_trait_port_adapter.md` | definition/catalog repository ports, UoW and fake adapter contracts | pending | Only formal ports and fake semantics may be implemented. |
| `projects/L3-method-library/design-calibration/03_ddd_step_08_protocol_contracts.md` | definition/catalog command/request/response surface | pending | Public protocol must match `commit-03-a` contracts and formal DTOs. |
| `projects/L3-method-library/design-calibration/03_ddd_step_09_function_flows.md` | definition/catalog accepted service flows | pending | Service order, validation, UoW and failure handling must be copied from formal flow. |
| `projects/L3-method-library/design-calibration/03_ddd_step_11_persistence_tx_consistency.md` | repository fake, version and rollback semantics | pending | Fake must preserve version/UoW semantics and must not partially commit. |
| `projects/L3-method-library/design-calibration/03_ddd_step_12_errors_recovery.md` | safe rejection and recovery behavior | pending | Errors and failure reports must be safe and body-free. |
| `projects/L3-method-library/design-calibration/03_ddd_step_13_concurrency_idempotency.md` | idempotency key, digest and stored result semantics | pending | Duplicate path must use formal stored result surface; no rerun mutation. |
| `projects/L3-method-library/design-calibration/03_ddd_step_16_test_cut.md` | service-flow-fast and infra-runtime-fake definition/catalog ownership | pending | Use only definition/catalog service vertical slice. |
| `projects/L3-method-library/design-calibration/07_implementation_plan_step_06_tasks_commit_boundaries.md` | `commit-03-b` row | pending | Allowed scope is service, repo fake, minimal API handler, UoW and stored result. |
| `projects/L3-method-library/design-calibration/07_implementation_plan_step_07_test_acceptance_gates.md` | `commit-03-b` gate row and PH-03 gate | pending | Required checks are service-flow-fast definition/catalog and infra-runtime-fake slice. |
| `projects/L3-method-library/design-calibration/07_implementation_plan_step_11_commit_review_delivery.md` | `commit-03-b` commit body grouping | pending | Commit body must include `Definition service flow:` and `Repository fake and minimal entry:`. |
| `/home/aris/Projects/quantalithos-method-library` git status and `commit-03-a` handoff state | latest implementation state | pending | Must confirm definition/catalog contracts/domain landed before this boundary starts. |

---

## Allowed Scope

| type | path_or_rule | status |
|---|---|---|
| allowed_path | `/home/aris/Projects/quantalithos-method-library/crates/application/src/**` for definition/catalog accepted service, formal ports usage, UoW orchestration, mapper shell and stored result integration assigned to `commit-03-b` | planned |
| allowed_path | `/home/aris/Projects/quantalithos-method-library/crates/application/tests/**` for definition/catalog service-flow-fast tests | planned |
| allowed_path | `/home/aris/Projects/quantalithos-method-library/crates/infra/src/**` for definition/catalog in-memory/fake repository and runtime fake support assigned to `commit-03-b` | planned |
| allowed_path | `/home/aris/Projects/quantalithos-method-library/crates/infra/tests/**` for infra-runtime-fake definition/catalog tests | planned |
| allowed_path | `/home/aris/Projects/quantalithos-method-library/crates/api/src/**` for minimal definition/catalog API handler that only calls application facade | planned |
| allowed_path | `/home/aris/Projects/quantalithos-method-library/crates/api/tests/**` for minimal entry smoke if required by formal plan | planned |
| allowed_path | `/home/aris/Projects/quantalithos-method-library/artifacts/test/<run_id>/suites/service-flow-fast/**` only if generated by an actual targeted run after activation | planned |
| allowed_path | `/home/aris/Projects/quantalithos-method-library/artifacts/test/<run_id>/suites/infra-runtime-fake/**` only if generated by an actual targeted run after activation | planned |
| allowed_path | `/home/aris/Projects/quantalithos-method-library/reports/runs/<run_id>/suites/service-flow-fast.md` only if generated from raw artifact after activation | planned |
| allowed_path | `/home/aris/Projects/quantalithos-method-library/reports/runs/<run_id>/suites/infra-runtime-fake.md` only if generated from raw artifact after activation | planned |
| allowed_rule | Implement definition/catalog accepted service vertical slice, UoW/stored result integration, fake repository, rollback/version checks and minimal API entry explicitly defined by formal design. | planned |
| allowed_rule | Add targeted tests for accepted path, rejection path, rollback, duplicate replay, old material pollution prevention and fake version semantics within definition/catalog only. | planned |
| forbidden_rule | Do not implement formalization/version, consumption/distribution, trace/audit/impact, external/peripheral, query/material, event/publisher or job behavior. | active |
| forbidden_rule | Do not add outbound publisher, worker, job runner, read material projection, report generator, release evidence, acceptance handoff or VETO checklist. | active |
| forbidden_rule | Do not broaden minimal API handler beyond definition/catalog entry or allow entry to bypass application facade. | active |
| forbidden_rule | Do not invent repository methods, UoW fields, stored result schema, idempotency keys, config keys, marker values, error variants or evidence schema not closed by formal `03/05/06/07`. | active |
| forbidden_rule | Do not use private fake maps with semantics absent from durable ports, duplicate mutation rerun, partial commit, query-time repair or hidden rollback shortcuts. | active |
| forbidden_rule | Do not use raw body, external provider response, secret, config/env value, full sensitive ref, stack trace or old MethodContent/publish/snapshot/outbox material in tests/reports. | active |
| forbidden_rule | Do not stage unrelated user changes, generated target directories or implementation outputs from previous boundaries. | active |

---

## Required Checks

| check | command_or_evidence | status | notes |
|---|---|---|---|
| activation guard | project ledger shows `current_boundary = commit-03-b` and `next_allowed_action = read_docs` | pending | Must pass before any implementation edit. |
| prior handoff | `commit-03-a` implementation commit and handoff recorded | pending | Definition/catalog contract/domain truth must exist. |
| worktree baseline | `git -C /home/aris/Projects/quantalithos-method-library status --short` | pending | Record before edits and protect unrelated files. |
| local git identity | `git -C /home/aris/Projects/quantalithos-method-library config user.name` and `user.email` | pending | Must remain `quantalithos-labs <quantalithos.ai@gmail.com>`. |
| format | `cargo fmt --all` | pending | Run in implementation repo after Rust changes. |
| workspace check | `cargo check` | pending | Ensures the full workspace still compiles. |
| application check | `cargo check -p method-library-application` or the formal application package check | pending | Use actual package name from formal workspace once activated. |
| infra check | `cargo check -p method-library-infra` or the formal infra package check | pending | Fake repository and runtime support must compile. |
| api check | `cargo check -p method-library-api` or the formal API package check if API files changed | pending | Minimal handler must compile and call application facade only. |
| service-flow-fast definition | targeted definition/catalog service-flow tests | pending | Must cover accepted, rejected, rollback and duplicate replay paths assigned to this boundary. |
| infra-runtime-fake definition | targeted fake repository/runtime tests | pending | Must preserve version, UoW and stored result semantics. |
| dependency boundary | inspect Cargo manifests / metadata for forbidden sibling or reverse dependencies | pending | Infra may depend inward; application must not depend on infra/API. |
| redaction fixture scan | check tests/artifacts/reports do not include forbidden raw body/secret/provider/config material | pending | Required for body-free service evidence. |
| evidence report | run-scoped `service-flow-fast` / `infra-runtime-fake` artifacts and reports if scripts exist | pending | Generated reports must derive from raw artifacts and retain failures. |
| whitespace | `git diff --check` and `git diff --cached --check` before commit | pending | Required for Commit Gate. |
| staged scope | `git diff --cached --name-only` | pending | Must match Allowed Scope. |

---

## Gate Matrix

| gate | status | evidence | next_if_failed |
|---|---|---|---|
| activation_gate | pending | Boundary is planned until project ledger advances from `commit-03-a` to `commit-03-b`. | wait_until_current |
| design_gate | pending | Implementation agent must reread Required Reads and confirm accepted flow, repository, UoW and stored result closure. | wait_design |
| scope_gate | pending | Planned changes must be limited to definition/catalog accepted service vertical slice. | fix_gate_failure |
| worktree_gate | pending | Initial implementation worktree status recorded; unrelated user changes protected. | fix_gate_failure |
| build_gate | pending | Formatting, workspace/application/infra/API checks and dependency boundary checks pass or failure is recorded. | fix_gate_failure |
| test_gate | pending | Service-flow-fast and infra-runtime-fake definition/catalog slices pass after activation. | fix_gate_failure |
| evidence_gate | pending | Targeted artifact/report is optional until scripts exist; any generated report must be run-scoped and raw-artifact-derived. | fix_gate_failure |
| commit_gate | pending | staged scope, commit message, whitespace and required checks have evidence. | fix_gate_failure |
| handoff_gate | pending | commit hash, checks run, tests not run, blockers and next boundary state recorded. | handoff |

---

## Commit Gate

| gate | status | evidence |
|---|---|---|
| staged_scope | pending | Must include only allowed `commit-03-b` service/fake/minimal-entry files and generated targeted evidence if applicable. |
| unrelated_changes | pending | User-owned unrelated changes must remain unstaged. |
| commit_message_format | pending | Planned subject: `feat(definition): add definition service flow` |
| commit_body_group | pending | Body group must include `Definition service flow:` and `Repository fake and minimal entry:` from Step 11 mapping. |
| whitespace | pending | `git diff --cached --check` must pass. |
| required_checks | pending | Required Checks table must have pass/not_applicable evidence. |

---

## Handoff Gate

| gate | status | evidence |
|---|---|---|
| committed_hash | pending | Fill after implementation repo commit. |
| committed_message | pending | Fill after implementation repo commit. |
| gates_run | pending | List exact commands and targeted reports. |
| tests_not_run | pending | Must state none or explain; cannot claim formalization/publisher/job/query suites. |
| remaining_blockers | pending | Must reference blocker table; any blocking design gap prevents handoff. |
| final_conclusion | pending | Must be one of pass / fail / cannot_decide with exact evidence source. |
| user_owned_changes_untouched | pending | List unrelated files left untouched. |

---

## Blockers

| blocker_id | gate | status | blocking_reason | requested_design_closure | next_allowed_action |
|---|---|---|---|---|---|
| BLK-ML-03B-ACTIVATION-001 | activation_gate | planned | Project ledger has not advanced through `commit-03-a`; this future boundary must not be used for implementation yet. | After `commit-03-a` handoff, update project ledger to `commit-03-b` and set this boundary to current. | wait_until_current |

---

## Experience Review

| item | conclusion | action |
|---|---|---|
| future boundary pre-creation | applies current planned-ledger rule | Pre-created future ledgers must use `planned / wait_until_current` and must not authorize code changes until project ledger advances. |
| accepted service vertical slice | existing design-closure rule applies | Accepted flow, repository fake, UoW and stored result gaps must be fixed in `03/05/06/07` before code; implementation must not invent service semantics. |
