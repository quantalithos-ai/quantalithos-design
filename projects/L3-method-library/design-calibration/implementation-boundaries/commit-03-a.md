# commit-03-a implementation ledger

| field | value |
|---|---|
| project | L3-method-library |
| boundary_id | commit-03-a |
| phase | PH-03 method asset definition and catalog truth |
| design_baseline | `planned-after-d3faf90-handoff-ledger` |
| implementation_repo | `/home/aris/Projects/quantalithos-method-library` |
| status | planned |
| next_allowed_action | wait_until_current |
| current_recovery_point | future method asset definition/catalog contracts and domain truth state boundary; cannot start until `commit-02-c` is implemented and project ledger advances |

---

## Activation Guard

| rule | status | consequence |
|---|---|---|
| project ledger current_boundary must equal `commit-03-a` | planned | If project ledger still points to an earlier boundary, implementation agent must not use this file to modify code. |
| `commit-02-c` handoff must be closed | planned | PH-02 contract/domain/application foundations must exist before definition/catalog truth work starts. |
| project ledger must set `next_allowed_action = read_docs` for `commit-03-a` | planned | Until then this boundary remains `wait_until_current`. |

---

## Required Reads

| document | required_section | status | notes |
|---|---|---|---|
| `standards/document/代码实施台账与门禁规范.md` | planned boundary activation, gate matrix, commit and handoff rules | pending | This future boundary cannot be executed until it becomes current. |
| `standards/document/设计真相源闭环与可落码性标准.md` | no invented definition/catalog DTO, truth state, policy, marker or evidence schema | pending | Any missing definition/catalog field or truth-owner rule must return to design. |
| `standards/coding/rust.md` | Rust contract/domain module, error and test conventions | pending | Source identifiers, comments, rustdoc, errors and test names must be English. |
| `projects/L3-method-library/00-需求文档.md` | FR-ML definition/catalog scope and non-goals | pending | Do not restore old MethodContent/publish/snapshot/outbox semantics. |
| `projects/L3-method-library/01-架构设计.md` | truth owner, Definition vs Use and dependency direction | pending | `VETO-ML-001` applies if truth owner is unclear or downstream use truth replaces this truth. |
| `projects/L3-method-library/02-概要设计.md` | definition/catalog key objects and code subject framework | pending | Use current method asset definition/catalog object model. |
| `projects/L3-method-library/03-详细设计.md` | object contracts, protocol contracts, state matrix, errors, test cut and implementation handoff | pending | Formal source for definition/catalog DTOs, domain objects, state/policy and safe errors. |
| `projects/L3-method-library/04-配置设计.md` | source boundary, redaction and external summary constraints | pending | Definition/catalog must remain body-free and config-safe. |
| `projects/L3-method-library/05-测试方案.md` | contract-domain-fast definition/catalog slice and artifact/report rules | pending | Targeted report must derive from raw artifact if generated. |
| `projects/L3-method-library/06-验收标准.md` | ML-FG-001/005, ML-RL-001, ML-SYNC-001 and `VETO-ML-001` | pending | Truth owner and definition/catalog foundation are blocking. |
| `projects/L3-method-library/07-实施计划.md` | §3, §6, §7, §8, §11 and §12 | pending | Current source for phase, boundary, allowed scope, checks and commit discipline. |
| `projects/L3-method-library/design-calibration/03_ddd_step_05_module_contracts.md` | definition/catalog module contracts | pending | Use current module boundaries; do not invent modules. |
| `projects/L3-method-library/design-calibration/03_ddd_step_06_object_contracts.md` | definition/catalog object contracts and state fields | pending | Required truth fields and typed refs must be formal. |
| `projects/L3-method-library/design-calibration/03_ddd_step_08_protocol_contracts.md` | definition/catalog DTO shells | pending | This boundary can add DTOs, not accepted service behavior. |
| `projects/L3-method-library/design-calibration/03_ddd_step_10_state_machine.md` | definition/catalog state transitions and terminal rules | pending | State/policy implementation must match formal matrix. |
| `projects/L3-method-library/design-calibration/03_ddd_step_12_errors_recovery.md` | definition/catalog domain error surfaces | pending | Errors must be safe and body-free. |
| `projects/L3-method-library/design-calibration/03_ddd_step_16_test_cut.md` | contract-domain-fast definition/catalog ownership | pending | Use definition/catalog contract-domain slice only. |
| `projects/L3-method-library/design-calibration/07_implementation_plan_step_06_tasks_commit_boundaries.md` | `commit-03-a` row | pending | Allowed scope is definition/catalog DTO, domain object and state/policy. |
| `projects/L3-method-library/design-calibration/07_implementation_plan_step_07_test_acceptance_gates.md` | `commit-03-a` gate row and PH-03 gate | pending | Required checks are contract-domain-fast definition/catalog slice. |
| `projects/L3-method-library/design-calibration/07_implementation_plan_step_11_commit_review_delivery.md` | `commit-03-a` commit body grouping | pending | Commit body must include `Definition and catalog contracts:` and `Method asset truth state:`. |
| `/home/aris/Projects/quantalithos-method-library` git status and `commit-02-c` handoff state | latest implementation state | pending | Must confirm PH-02 foundations landed before this boundary starts. |

---

## Allowed Scope

| type | path_or_rule | status |
|---|---|---|
| allowed_path | `/home/aris/Projects/quantalithos-method-library/crates/contracts/src/**` for definition/catalog DTOs, typed refs, metadata and public error/result shells assigned to `commit-03-a` | planned |
| allowed_path | `/home/aris/Projects/quantalithos-method-library/crates/contracts/tests/**` for definition/catalog contract fixture tests | planned |
| allowed_path | `/home/aris/Projects/quantalithos-method-library/crates/domain/src/**` for definition/catalog domain objects, truth state, policy/guard and safe errors assigned to `commit-03-a` | planned |
| allowed_path | `/home/aris/Projects/quantalithos-method-library/crates/domain/tests/**` for definition/catalog state/policy tests | planned |
| allowed_path | `/home/aris/Projects/quantalithos-method-library/artifacts/test/<run_id>/suites/contract-domain-fast/**` only if generated by an actual targeted run after activation | planned |
| allowed_path | `/home/aris/Projects/quantalithos-method-library/reports/runs/<run_id>/suites/contract-domain-fast.md` only if generated from raw artifact after activation | planned |
| allowed_rule | Add definition/catalog request/result/view shell DTOs, domain truth objects, state wrappers, policy/guard helpers and safe domain errors explicitly defined by formal design. | planned |
| allowed_rule | Add focused contract/domain tests for definition/catalog truth owner, state/policy and old material pollution prevention. | planned |
| forbidden_rule | Do not implement definition/catalog accepted service flow, application service, UoW mutation, idempotency stored result, repository fake, infra adapter, API handler or minimal entry. | active |
| forbidden_rule | Do not implement formalization/version, consumption/distribution, trace/audit/impact, external/peripheral, query/material, event/publisher or job behavior. | active |
| forbidden_rule | Do not add concrete storage, fake repository maps, runtime builder, config loader, external resolver, worker, report generator or release evidence. | active |
| forbidden_rule | Do not invent definition/catalog fields, ownership rules, states, policy outcomes, error variants, marker values, config keys or evidence schema not closed by formal `03/05/06/07`. | active |
| forbidden_rule | Do not use raw body, external provider response, secret, config/env value, full sensitive ref, stack trace or old MethodContent/publish/snapshot/outbox material in DTOs/tests. | active |
| forbidden_rule | Do not claim service-flow-fast, infra-runtime-fake, accepted vertical slice, transaction rollback, stored replay, release EV, VETO checklist or acceptance handoff. | active |
| forbidden_rule | Do not stage unrelated user changes, generated target directories or implementation outputs from previous boundaries. | active |

---

## Required Checks

| check | command_or_evidence | status | notes |
|---|---|---|---|
| activation guard | project ledger shows `current_boundary = commit-03-a` and `next_allowed_action = read_docs` | pending | Must pass before any implementation edit. |
| prior handoff | `commit-02-c` implementation commit and handoff recorded | pending | PH-02 contract/domain/application foundations must exist. |
| worktree baseline | `git -C /home/aris/Projects/quantalithos-method-library status --short` | pending | Record before edits and protect unrelated files. |
| local git identity | `git -C /home/aris/Projects/quantalithos-method-library config user.name` and `user.email` | pending | Must remain `quantalithos-labs <quantalithos.ai@gmail.com>`. |
| format | `cargo fmt --all` | pending | Run in implementation repo after Rust changes. |
| workspace check | `cargo check` | pending | Ensures the full workspace still compiles. |
| contracts check | `cargo check -p method-library-contracts` or the formal contracts package check | pending | Use actual package name from formal workspace once activated. |
| domain check | `cargo check -p method-library-domain` or the formal domain package check | pending | Use actual package name from formal workspace once activated. |
| contract-domain-fast definition | targeted definition/catalog contract-domain tests | pending | Must cover truth owner and old material pollution prevention. |
| definition/catalog VETO audit | check `VETO-ML-001` risk is not introduced | pending | Truth owner ambiguity blocks commit. |
| redaction fixture scan | check tests/fixtures do not include raw body/secret/provider/config material | pending | Required for body-free definition/catalog boundary. |
| evidence report | run-scoped `contract-domain-fast` artifact/report if scripts exist | pending | Optional until scripts exist; generated reports must derive from raw artifacts. |
| whitespace | `git diff --check` and `git diff --cached --check` before commit | pending | Required for Commit Gate. |
| staged scope | `git diff --cached --name-only` | pending | Must match Allowed Scope. |

---

## Gate Matrix

| gate | status | evidence | next_if_failed |
|---|---|---|---|
| activation_gate | pending | Boundary is planned until project ledger advances from `commit-02-c` to `commit-03-a`. | wait_until_current |
| design_gate | pending | Implementation agent must reread Required Reads and confirm definition/catalog DTO/truth/state/policy closure. | wait_design |
| scope_gate | pending | Planned changes must be limited to definition/catalog contracts and domain truth state. | fix_gate_failure |
| worktree_gate | pending | Initial implementation worktree status recorded; unrelated user changes protected. | fix_gate_failure |
| build_gate | pending | Formatting, workspace/contract/domain checks and dependency boundary checks pass or failure is recorded. | fix_gate_failure |
| test_gate | pending | Contract-domain-fast definition/catalog slice and VETO-ML-001 targeted checks pass after activation. | fix_gate_failure |
| evidence_gate | pending | Targeted artifact/report is optional; any generated report must be run-scoped and raw-artifact-derived. | fix_gate_failure |
| commit_gate | pending | staged scope, commit message, whitespace and required checks have evidence. | fix_gate_failure |
| handoff_gate | pending | commit hash, checks run, tests not run, blockers and next boundary state recorded. | handoff |

---

## Commit Gate

| gate | status | evidence |
|---|---|---|
| staged_scope | pending | Must include only allowed `commit-03-a` definition/catalog contract/domain files and generated targeted evidence if applicable. |
| unrelated_changes | pending | User-owned unrelated changes must remain unstaged. |
| commit_message_format | pending | Planned subject: `feat(definition): add method definition contract and truth state` |
| commit_body_group | pending | Body group must include `Definition and catalog contracts:` and `Method asset truth state:` from Step 11 mapping. |
| whitespace | pending | `git diff --cached --check` must pass. |
| required_checks | pending | Required Checks table must have pass/not_applicable evidence. |

---

## Handoff Gate

| gate | status | evidence |
|---|---|---|
| committed_hash | pending | Fill after implementation repo commit. |
| committed_message | pending | Fill after implementation repo commit. |
| gates_run | pending | List exact commands and targeted reports. |
| tests_not_run | pending | Must state none or explain; cannot claim accepted service/infra suites. |
| remaining_blockers | pending | Must reference blocker table; any blocking design gap prevents handoff. |
| final_conclusion | pending | Must be one of pass / fail / cannot_decide with exact evidence source. |
| user_owned_changes_untouched | pending | List unrelated files left untouched. |

---

## Blockers

| blocker_id | gate | status | blocking_reason | requested_design_closure | next_allowed_action |
|---|---|---|---|---|---|
| BLK-ML-03A-ACTIVATION-001 | activation_gate | planned | Project ledger has not advanced through `commit-02-c`; this future boundary must not be used for implementation yet. | After `commit-02-c` handoff, update project ledger to `commit-03-a` and set this boundary to current. | wait_until_current |

---

## Experience Review

| item | conclusion | action |
|---|---|---|
| future boundary pre-creation | applies current planned-ledger rule | Pre-created future ledgers must use `planned / wait_until_current` and must not authorize code changes until project ledger advances. |
| definition/catalog truth owner | existing design-closure rule applies | Truth owner, DTO, state and policy gaps must be fixed in `03/05/06/07` before code; implementation must not invent definition/catalog truth semantics. |
