# commit-05-a implementation ledger

| field | value |
|---|---|
| project | L3-method-library |
| boundary_id | commit-05-a |
| phase | PH-05 controlled consumption and distribution semantics |
| design_baseline | `planned-after-d3faf90-handoff-ledger` |
| implementation_repo | `/home/aris/Projects/quantalithos-method-library` |
| status | planned |
| next_allowed_action | wait_until_current |
| current_recovery_point | future controlled consumption material contracts/domain boundary; cannot start until `commit-04-b` is implemented and project ledger advances |

---

## Activation Guard

| rule | status | consequence |
|---|---|---|
| project ledger current_boundary must equal `commit-05-a` | planned | If project ledger still points to an earlier boundary, implementation agent must not use this file to modify code. |
| `commit-04-b` handoff must be closed | planned | Formalization/version service and stored replay must exist before controlled consumption material work starts. |
| project ledger must set `next_allowed_action = read_docs` for `commit-05-a` | planned | Until then this boundary remains `wait_until_current`. |

---

## Required Reads

| document | required_section | status | notes |
|---|---|---|---|
| `standards/document/代码实施台账与门禁规范.md` | planned boundary activation, gate matrix, commit and handoff rules | pending | This future boundary cannot be executed until it becomes current. |
| `standards/document/设计真相源闭环与可落码性标准.md` | no invented consumption material, guard, availability marker, downstream truth or evidence schema | pending | Any missing consumption/availability field or guard must return to design. |
| `standards/coding/rust.md` | Rust contract/domain module, error and test conventions | pending | Source identifiers, comments, rustdoc, errors and test names must be English. |
| `projects/L3-method-library/00-需求文档.md` | controlled consumption scope and Definition vs Use boundary | pending | Consumption cannot create or replace definition/formalization truth. |
| `projects/L3-method-library/01-架构设计.md` | Definition vs Use, downstream boundary and dependency direction | pending | `VETO-ML-003` / `VETO-ML-004` apply to downstream truth replacement and invalid use. |
| `projects/L3-method-library/02-概要设计.md` | consumption material key objects and availability outline | pending | Use current controlled consumption object model. |
| `projects/L3-method-library/03-详细设计.md` | consumption object contracts, protocol contracts, state matrix, errors and test cut | pending | Formal source for consumption material, Definition vs Use guard and availability markers. |
| `projects/L3-method-library/04-配置设计.md` | availability, degraded/unavailable and downstream handoff boundary | pending | This boundary defines marker contracts/domain only; no runtime downstream adapter. |
| `projects/L3-method-library/05-测试方案.md` | contract-domain-fast consumption material and artifact/report rules | pending | Targeted report must derive from raw artifact if generated. |
| `projects/L3-method-library/06-验收标准.md` | ML-FG-003/007/008 seed, ML-RL-002, `VETO-ML-003` and `VETO-ML-004` | pending | Downstream truth replacement and invalid consumption are blocking. |
| `projects/L3-method-library/07-实施计划.md` | §3, §6, §7, §8, §11 and §12 | pending | Current source for phase, boundary, allowed scope, checks and commit discipline. |
| `projects/L3-method-library/design-calibration/03_ddd_step_05_module_contracts.md` | consumption/distribution module boundary | pending | Use current module boundaries; do not invent modules. |
| `projects/L3-method-library/design-calibration/03_ddd_step_06_object_contracts.md` | consumption material, availability marker and guard object contracts | pending | Required typed refs, marker source and state fields must be formal. |
| `projects/L3-method-library/design-calibration/03_ddd_step_08_protocol_contracts.md` | consumption material DTO shells | pending | This boundary can add DTOs, not service/handoff behavior. |
| `projects/L3-method-library/design-calibration/03_ddd_step_10_state_machine.md` | consumption state and availability guard matrix | pending | State/guard implementation must match formal matrix. |
| `projects/L3-method-library/design-calibration/03_ddd_step_12_errors_recovery.md` | consumption safe error surfaces | pending | Errors must be safe and body-free. |
| `projects/L3-method-library/design-calibration/03_ddd_step_16_test_cut.md` | contract-domain-fast consumption ownership | pending | Use consumption material contract-domain slice only. |
| `projects/L3-method-library/design-calibration/07_implementation_plan_step_06_tasks_commit_boundaries.md` | `commit-05-a` row | pending | Allowed scope is consumption material, Definition vs Use guard and availability marker. |
| `projects/L3-method-library/design-calibration/07_implementation_plan_step_07_test_acceptance_gates.md` | `commit-05-a` gate row and PH-05 gate | pending | Required checks are contract-domain-fast consumption material. |
| `projects/L3-method-library/design-calibration/07_implementation_plan_step_11_commit_review_delivery.md` | `commit-05-a` commit body grouping | pending | Commit body must include `Consumption material contracts:` and `Definition versus use guards:`. |
| `/home/aris/Projects/quantalithos-method-library` git status and `commit-04-b` handoff state | latest implementation state | pending | Must confirm formalization/version services landed before this boundary starts. |

---

## Allowed Scope

| type | path_or_rule | status |
|---|---|---|
| allowed_path | `/home/aris/Projects/quantalithos-method-library/crates/contracts/src/**` for consumption material DTOs, typed refs, availability markers and public error/result shells assigned to `commit-05-a` | planned |
| allowed_path | `/home/aris/Projects/quantalithos-method-library/crates/contracts/tests/**` for consumption material contract fixture tests | planned |
| allowed_path | `/home/aris/Projects/quantalithos-method-library/crates/domain/src/**` for consumption material domain object, Definition vs Use guard, availability marker guard and safe errors assigned to `commit-05-a` | planned |
| allowed_path | `/home/aris/Projects/quantalithos-method-library/crates/domain/tests/**` for consumption guard and availability marker tests | planned |
| allowed_path | `/home/aris/Projects/quantalithos-method-library/artifacts/test/<run_id>/suites/contract-domain-fast/**` only if generated by an actual targeted run after activation | planned |
| allowed_path | `/home/aris/Projects/quantalithos-method-library/reports/runs/<run_id>/suites/contract-domain-fast.md` only if generated from raw artifact after activation | planned |
| allowed_rule | Add consumption material request/result/view shell DTOs, Definition vs Use guard, availability marker wrappers, state guards and safe domain errors explicitly defined by formal design. | planned |
| allowed_rule | Add focused contract/domain tests for formalized-only consumption, non-formal/non-approved rejection, availability marker copy-only and downstream truth exclusion. | planned |
| forbidden_rule | Do not implement consumption/distribution application service, availability mapper service, downstream runtime, handoff shell fake, repository fake, API handler, worker, publisher or job behavior. | active |
| forbidden_rule | Do not implement distribution context, handoff delivery, real handoff target, event publishing, trace/audit/impact, external/peripheral, query/material or report generator behavior. | active |
| forbidden_rule | Do not add concrete storage, fake repository maps, runtime builder, config loader, real downstream adapter, release evidence, acceptance handoff or VETO checklist. | active |
| forbidden_rule | Do not invent consumption fields, Definition vs Use rules, availability marker source, degraded/unavailable marker values, error variants, config keys or evidence schema not closed by formal `03/05/06/07`. | active |
| forbidden_rule | Do not let downstream use truth replace definition/formalization truth, consume non-formal material, or treat unavailable/degraded material as accepted success. | active |
| forbidden_rule | Do not use raw body, external provider response, secret, config/env value, full sensitive ref, stack trace or old MethodContent/publish/snapshot/outbox material in DTOs/tests. | active |
| forbidden_rule | Do not stage unrelated user changes, generated target directories or implementation outputs from previous boundaries. | active |

---

## Required Checks

| check | command_or_evidence | status | notes |
|---|---|---|---|
| activation guard | project ledger shows `current_boundary = commit-05-a` and `next_allowed_action = read_docs` | pending | Must pass before any implementation edit. |
| prior handoff | `commit-04-b` implementation commit and handoff recorded | pending | Formalization/version service and replay must exist. |
| worktree baseline | `git -C /home/aris/Projects/quantalithos-method-library status --short` | pending | Record before edits and protect unrelated files. |
| local git identity | `git -C /home/aris/Projects/quantalithos-method-library config user.name` and `user.email` | pending | Must remain `quantalithos-labs <quantalithos.ai@gmail.com>`. |
| format | `cargo fmt --all` | pending | Run in implementation repo after Rust changes. |
| workspace check | `cargo check` | pending | Ensures the full workspace still compiles. |
| contracts check | `cargo check -p method-library-contracts` or the formal contracts package check | pending | Use actual package name from formal workspace once activated. |
| domain check | `cargo check -p method-library-domain` or the formal domain package check | pending | Use actual package name from formal workspace once activated. |
| contract-domain-fast consumption | targeted consumption material contract-domain tests | pending | Must cover Definition vs Use guard and availability marker semantics. |
| VETO targeted audit | check `VETO-ML-003` / `VETO-ML-004` risk is not introduced | pending | Downstream truth replacement or invalid consumption blocks commit. |
| redaction fixture scan | check tests/fixtures do not include forbidden raw body/secret/provider/config material | pending | Required for body-free consumption boundary. |
| evidence report | run-scoped `contract-domain-fast` artifact/report if scripts exist | pending | Optional until scripts exist; generated reports must derive from raw artifacts. |
| whitespace | `git diff --check` and `git diff --cached --check` before commit | pending | Required for Commit Gate. |
| staged scope | `git diff --cached --name-only` | pending | Must match Allowed Scope. |

---

## Gate Matrix

| gate | status | evidence | next_if_failed |
|---|---|---|---|
| activation_gate | pending | Boundary is planned until project ledger advances from `commit-04-b` to `commit-05-a`. | wait_until_current |
| design_gate | pending | Implementation agent must reread Required Reads and confirm consumption material, Definition vs Use guard and availability marker closure. | wait_design |
| scope_gate | pending | Planned changes must be limited to consumption material contracts/domain and guard tests. | fix_gate_failure |
| worktree_gate | pending | Initial implementation worktree status recorded; unrelated user changes protected. | fix_gate_failure |
| build_gate | pending | Formatting, workspace/contract/domain checks and dependency boundary checks pass or failure is recorded. | fix_gate_failure |
| test_gate | pending | Contract-domain-fast consumption material slice and VETO targeted checks pass after activation. | fix_gate_failure |
| evidence_gate | pending | Targeted artifact/report is optional; any generated report must be run-scoped and raw-artifact-derived. | fix_gate_failure |
| commit_gate | pending | staged scope, commit message, whitespace and required checks have evidence. | fix_gate_failure |
| handoff_gate | pending | commit hash, checks run, tests not run, blockers and next boundary state recorded. | handoff |

---

## Commit Gate

| gate | status | evidence |
|---|---|---|
| staged_scope | pending | Must include only allowed `commit-05-a` consumption contract/domain files and generated targeted evidence if applicable. |
| unrelated_changes | pending | User-owned unrelated changes must remain unstaged. |
| commit_message_format | pending | Planned subject: `feat(consumption): add controlled consumption material` |
| commit_body_group | pending | Body group must include `Consumption material contracts:` and `Definition versus use guards:` from Step 11 mapping. |
| whitespace | pending | `git diff --cached --check` must pass. |
| required_checks | pending | Required Checks table must have pass/not_applicable evidence. |

---

## Handoff Gate

| gate | status | evidence |
|---|---|---|
| committed_hash | pending | Fill after implementation repo commit. |
| committed_message | pending | Fill after implementation repo commit. |
| gates_run | pending | List exact commands and targeted reports. |
| tests_not_run | pending | Must state none or explain; cannot claim distribution/handoff service suites. |
| remaining_blockers | pending | Must reference blocker table; any blocking design gap prevents handoff. |
| final_conclusion | pending | Must be one of pass / fail / cannot_decide with exact evidence source. |
| user_owned_changes_untouched | pending | List unrelated files left untouched. |

---

## Blockers

| blocker_id | gate | status | blocking_reason | requested_design_closure | next_allowed_action |
|---|---|---|---|---|---|
| BLK-ML-05A-ACTIVATION-001 | activation_gate | planned | Project ledger has not advanced through `commit-04-b`; this future boundary must not be used for implementation yet. | After `commit-04-b` handoff, update project ledger to `commit-05-a` and set this boundary to current. | wait_until_current |

---

## Experience Review

| item | conclusion | action |
|---|---|---|
| future boundary pre-creation | applies current planned-ledger rule | Pre-created future ledgers must use `planned / wait_until_current` and must not authorize code changes until project ledger advances. |
| controlled consumption guards | existing design-closure rule applies | Consumption material, Definition vs Use guard and availability marker gaps must be fixed in `03/05/06/07` before code; implementation must not invent downstream truth or marker semantics. |
