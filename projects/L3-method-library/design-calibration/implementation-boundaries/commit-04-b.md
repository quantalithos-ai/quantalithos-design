# commit-04-b implementation ledger

| field | value |
|---|---|
| project | L3-method-library |
| boundary_id | commit-04-b |
| phase | PH-04 formalization and version semantics |
| design_baseline | `planned-after-d3faf90-handoff-ledger` |
| implementation_repo | `/home/aris/Projects/quantalithos-method-library` |
| status | planned |
| next_allowed_action | wait_until_current |
| current_recovery_point | future formalization/version service and stored replay boundary; cannot start until `commit-04-a` is implemented and project ledger advances |

---

## Activation Guard

| rule | status | consequence |
|---|---|---|
| project ledger current_boundary must equal `commit-04-b` | planned | If project ledger still points to an earlier boundary, implementation agent must not use this file to modify code. |
| `commit-04-a` handoff must be closed | planned | Formalization/version DTOs, state guards and domain tests must exist before service/replay work starts. |
| project ledger must set `next_allowed_action = read_docs` for `commit-04-b` | planned | Until then this boundary remains `wait_until_current`. |

---

## Required Reads

| document | required_section | status | notes |
|---|---|---|---|
| `standards/document/代码实施台账与门禁规范.md` | planned boundary activation, gate matrix, commit and handoff rules | pending | This future boundary cannot be executed until it becomes current. |
| `standards/document/设计真相源闭环与可落码性标准.md` | no invented service flow, idempotency, stored result, version conflict, commit unknown or evidence fields | pending | Any missing formalization service/replay surface must return to design. |
| `standards/coding/rust.md` | Rust application/infra module, trait, error and test conventions | pending | Source identifiers, comments, rustdoc, errors and test names must be English. |
| `projects/L3-method-library/00-需求文档.md` | formalization/version requirements and replay/idempotency expectations | pending | Service must preserve formal version semantics and avoid silent overwrite. |
| `projects/L3-method-library/01-架构设计.md` | formal version ownership, transaction direction and dependency direction | pending | `VETO-ML-002` applies to version overwrite; downstream use truth cannot replace formalization truth. |
| `projects/L3-method-library/02-概要设计.md` | formalization/version processing flow and transaction outline | pending | Service flow must follow current method-library model. |
| `projects/L3-method-library/03-详细设计.md` | trait/port contracts, protocol contracts, function flows, persistence/UoW, error/recovery, concurrency/idempotency and implementation handoff | pending | Formal source for services, stored replay, version conflict and commit unknown behavior. |
| `projects/L3-method-library/04-配置设计.md` | controlled/fake adapter binding and body-free redaction | pending | Fake runtime must keep formal version/UoW/replay semantics and must not add unclosed config keys. |
| `projects/L3-method-library/05-测试方案.md` | service-flow-fast formalization/replay and artifact/report rules | pending | Targeted reports must derive from raw artifacts if generated. |
| `projects/L3-method-library/06-验收标准.md` | ML-FG-002/006, ML-RL-003/007, ML-STATE, ML-IDEMP, `VETO-ML-002` and `VETO-ML-004` | pending | Duplicate rerun, commit unknown gap and silent overwrite are blocking. |
| `projects/L3-method-library/07-实施计划.md` | §3, §6, §7, §8, §11 and §12 | pending | Current source for phase, boundary, allowed scope, checks and commit discipline. |
| `projects/L3-method-library/design-calibration/03_ddd_step_07_trait_port_adapter.md` | formalization/version repository ports, UoW and fake adapter contracts | pending | Only formal ports and fake semantics may be implemented. |
| `projects/L3-method-library/design-calibration/03_ddd_step_08_protocol_contracts.md` | formalization/version command/request/response and rejection surface | pending | Public protocol must match `commit-04-a` contracts and formal DTOs. |
| `projects/L3-method-library/design-calibration/03_ddd_step_09_function_flows.md` | formalization/version accepted service flows | pending | Service order, conflict handling, UoW and failure handling must follow formal flow. |
| `projects/L3-method-library/design-calibration/03_ddd_step_11_persistence_tx_consistency.md` | repository fake, expected version, rollback and commit unknown semantics | pending | Fake must preserve version/UoW semantics and must not partially commit. |
| `projects/L3-method-library/design-calibration/03_ddd_step_12_errors_recovery.md` | replay consistency failure, safe rejection and recovery behavior | pending | Missing stored surface must fail safely, not rebuild from truth. |
| `projects/L3-method-library/design-calibration/03_ddd_step_13_concurrency_idempotency.md` | idempotency key, digest, stored result and duplicate replay semantics | pending | Duplicate accepted/rejected replay must use formal stored surface; no rerun mutation. |
| `projects/L3-method-library/design-calibration/03_ddd_step_16_test_cut.md` | service-flow-fast formalization/replay ownership | pending | Use only formalization/version service and replay slice. |
| `projects/L3-method-library/design-calibration/07_implementation_plan_step_06_tasks_commit_boundaries.md` | `commit-04-b` row | pending | Allowed scope is services, idempotency stored result, version conflict and commit unknown. |
| `projects/L3-method-library/design-calibration/07_implementation_plan_step_07_test_acceptance_gates.md` | `commit-04-b` gate row and PH-04 gate | pending | Required checks are service-flow-fast formalization/replay. |
| `projects/L3-method-library/design-calibration/07_implementation_plan_step_11_commit_review_delivery.md` | `commit-04-b` commit body grouping | pending | Commit body must include `Formalization services:` and `Stored replay and conflict handling:`. |
| `/home/aris/Projects/quantalithos-method-library` git status and `commit-04-a` handoff state | latest implementation state | pending | Must confirm formalization/version contracts/domain landed before this boundary starts. |

---

## Allowed Scope

| type | path_or_rule | status |
|---|---|---|
| allowed_path | `/home/aris/Projects/quantalithos-method-library/crates/application/src/**` for formalization/version service, idempotency stored result integration, conflict handling and commit unknown handling assigned to `commit-04-b` | planned |
| allowed_path | `/home/aris/Projects/quantalithos-method-library/crates/application/tests/**` for formalization/version service-flow and replay tests | planned |
| allowed_path | `/home/aris/Projects/quantalithos-method-library/crates/infra/src/**` for formalization/version fake repository and stored replay support assigned to `commit-04-b` | planned |
| allowed_path | `/home/aris/Projects/quantalithos-method-library/crates/infra/tests/**` for formalization/version fake replay and rollback tests | planned |
| allowed_path | `/home/aris/Projects/quantalithos-method-library/crates/api/src/**` for minimal formalization/version API handler if explicitly defined and only delegating to application facade | planned |
| allowed_path | `/home/aris/Projects/quantalithos-method-library/artifacts/test/<run_id>/suites/service-flow-fast/**` only if generated by an actual targeted run after activation | planned |
| allowed_path | `/home/aris/Projects/quantalithos-method-library/reports/runs/<run_id>/suites/service-flow-fast.md` only if generated from raw artifact after activation | planned |
| allowed_rule | Implement formalization/version services, idempotency stored result, version conflict handling, commit unknown handling, fake replay storage and rollback/version checks explicitly defined by formal design. | planned |
| allowed_rule | Add targeted tests for accepted path, rejected path, duplicate replay, version conflict, commit unknown, rollback and missing stored surface failure within formalization/version only. | planned |
| forbidden_rule | Do not implement consumption/distribution, Definition vs Use consumption guard, availability, handoff, trace/audit/impact, external/peripheral, query/material, event/publisher or job behavior. | active |
| forbidden_rule | Do not add outbound publisher, worker, job runner, read material projection, report generator, release evidence, acceptance handoff or VETO checklist. | active |
| forbidden_rule | Do not broaden API handler beyond formalization/version entry or allow entry to bypass application facade. | active |
| forbidden_rule | Do not invent repository methods, UoW fields, stored result schema, idempotency keys, config keys, marker values, error variants, commit unknown semantics or evidence schema not closed by formal `03/05/06/07`. | active |
| forbidden_rule | Do not rebuild duplicate responses from current truth, rerun duplicate mutation, silently overwrite versions, partially commit after failure, or hide replay consistency failures. | active |
| forbidden_rule | Do not use raw body, external provider response, secret, config/env value, full sensitive ref, stack trace or old MethodContent/publish/snapshot/outbox material in tests/reports. | active |
| forbidden_rule | Do not stage unrelated user changes, generated target directories or implementation outputs from previous boundaries. | active |

---

## Required Checks

| check | command_or_evidence | status | notes |
|---|---|---|---|
| activation guard | project ledger shows `current_boundary = commit-04-b` and `next_allowed_action = read_docs` | pending | Must pass before any implementation edit. |
| prior handoff | `commit-04-a` implementation commit and handoff recorded | pending | Formalization/version contract/domain truth must exist. |
| worktree baseline | `git -C /home/aris/Projects/quantalithos-method-library status --short` | pending | Record before edits and protect unrelated files. |
| local git identity | `git -C /home/aris/Projects/quantalithos-method-library config user.name` and `user.email` | pending | Must remain `quantalithos-labs <quantalithos.ai@gmail.com>`. |
| format | `cargo fmt --all` | pending | Run in implementation repo after Rust changes. |
| workspace check | `cargo check` | pending | Ensures the full workspace still compiles. |
| application check | `cargo check -p method-library-application` or the formal application package check | pending | Use actual package name from formal workspace once activated. |
| infra check | `cargo check -p method-library-infra` or the formal infra package check | pending | Fake replay storage and runtime support must compile. |
| api check | `cargo check -p method-library-api` or the formal API package check if API files changed | pending | Minimal handler must compile and call application facade only. |
| service-flow-fast formalization | targeted formalization/version service-flow and replay tests | pending | Must cover accepted, rejected, duplicate replay, version conflict and commit unknown paths. |
| replay consistency tests | stored result missing / mismatch / duplicate replay tests | pending | Missing surface must fail safely, not rebuild from truth. |
| VETO targeted audit | check `VETO-ML-002` / `VETO-ML-004` risk is not introduced | pending | Silent overwrite or invalid use edge blocks commit. |
| dependency boundary | inspect Cargo manifests / metadata for forbidden sibling or reverse dependencies | pending | Application must not depend on infra/API; infra may depend inward. |
| redaction fixture scan | check tests/artifacts/reports do not include forbidden raw body/secret/provider/config material | pending | Required for body-free service evidence. |
| evidence report | run-scoped `service-flow-fast` artifact/report if scripts exist | pending | Generated reports must derive from raw artifacts and retain failures. |
| whitespace | `git diff --check` and `git diff --cached --check` before commit | pending | Required for Commit Gate. |
| staged scope | `git diff --cached --name-only` | pending | Must match Allowed Scope. |

---

## Gate Matrix

| gate | status | evidence | next_if_failed |
|---|---|---|---|
| activation_gate | pending | Boundary is planned until project ledger advances from `commit-04-a` to `commit-04-b`. | wait_until_current |
| design_gate | pending | Implementation agent must reread Required Reads and confirm formalization/version service, stored replay and conflict closure. | wait_design |
| scope_gate | pending | Planned changes must be limited to formalization/version services and replay slice. | fix_gate_failure |
| worktree_gate | pending | Initial implementation worktree status recorded; unrelated user changes protected. | fix_gate_failure |
| build_gate | pending | Formatting, workspace/application/infra/API checks and dependency boundary checks pass or failure is recorded. | fix_gate_failure |
| test_gate | pending | Service-flow-fast formalization/replay and VETO targeted checks pass after activation. | fix_gate_failure |
| evidence_gate | pending | Targeted artifact/report is optional until scripts exist; any generated report must be run-scoped and raw-artifact-derived. | fix_gate_failure |
| commit_gate | pending | staged scope, commit message, whitespace and required checks have evidence. | fix_gate_failure |
| handoff_gate | pending | commit hash, checks run, tests not run, blockers and next boundary state recorded. | handoff |

---

## Commit Gate

| gate | status | evidence |
|---|---|---|
| staged_scope | pending | Must include only allowed `commit-04-b` formalization service/replay files and generated targeted evidence if applicable. |
| unrelated_changes | pending | User-owned unrelated changes must remain unstaged. |
| commit_message_format | pending | Planned subject: `feat(formalization): add version service replay` |
| commit_body_group | pending | Body group must include `Formalization services:` and `Stored replay and conflict handling:` from Step 11 mapping. |
| whitespace | pending | `git diff --cached --check` must pass. |
| required_checks | pending | Required Checks table must have pass/not_applicable evidence. |

---

## Handoff Gate

| gate | status | evidence |
|---|---|---|
| committed_hash | pending | Fill after implementation repo commit. |
| committed_message | pending | Fill after implementation repo commit. |
| gates_run | pending | List exact commands and targeted reports. |
| tests_not_run | pending | Must state none or explain; cannot claim consumption/query/publisher/job suites. |
| remaining_blockers | pending | Must reference blocker table; any blocking design gap prevents handoff. |
| final_conclusion | pending | Must be one of pass / fail / cannot_decide with exact evidence source. |
| user_owned_changes_untouched | pending | List unrelated files left untouched. |

---

## Blockers

| blocker_id | gate | status | blocking_reason | requested_design_closure | next_allowed_action |
|---|---|---|---|---|---|
| BLK-ML-04B-ACTIVATION-001 | activation_gate | planned | Project ledger has not advanced through `commit-04-a`; this future boundary must not be used for implementation yet. | After `commit-04-a` handoff, update project ledger to `commit-04-b` and set this boundary to current. | wait_until_current |

---

## Experience Review

| item | conclusion | action |
|---|---|---|
| future boundary pre-creation | applies current planned-ledger rule | Pre-created future ledgers must use `planned / wait_until_current` and must not authorize code changes until project ledger advances. |
| formalization/version replay | existing design-closure rule applies | Service, idempotency, stored replay, version conflict and commit unknown gaps must be fixed in `03/05/06/07` before code; implementation must not invent replay semantics. |
