# commit-07-b implementation ledger

| field | value |
|---|---|
| project | L3-method-library |
| boundary_id | commit-07-b |
| phase | PH-07 external summary / reference and peripheral package/set boundary |
| design_baseline | `planned-after-d3faf90-handoff-ledger` |
| implementation_repo | `/home/aris/Projects/quantalithos-method-library` |
| status | planned |
| next_allowed_action | wait_until_current |
| current_recovery_point | future package/method set peripheral shell boundary; cannot start until `commit-07-a` is implemented and project ledger advances |

---

## Activation Guard

| rule | status | consequence |
|---|---|---|
| project ledger current_boundary must equal `commit-07-b` | planned | If project ledger still points to an earlier boundary, implementation agent must not use this file to modify code. |
| `commit-07-a` handoff must be closed | planned | External summary/source/artifact body-free boundary must exist before peripheral package/set shell starts. |
| project ledger must set `next_allowed_action = read_docs` for `commit-07-b` | planned | Until then this boundary remains `wait_until_current`. |

---

## Required Reads

| document | required_section | status | notes |
|---|---|---|---|
| `standards/document/代码实施台账与门禁规范.md` | planned boundary activation, gate matrix, commit and handoff rules | pending | This future boundary cannot be executed until it becomes current. |
| `standards/document/设计真相源闭环与可落码性标准.md` | no invented peripheral schema, marketplace transaction, residual marker, dependency rule or report schema | pending | Missing peripheral/residual field, owner or marker must return to design. |
| `standards/coding/rust.md` | Rust contract/domain/application module, fake store, error and test conventions | pending | Source identifiers, comments, rustdoc, errors and test names must be English. |
| `projects/L3-method-library/00-需求文档.md` | FR-ML-E peripheral/future scope and P0 non-blocking rule | pending | Peripheral capability is bounded/residual and must not become a P0 blocker. |
| `projects/L3-method-library/01-架构设计.md` | peripheral package/set boundary, dependency direction and core non-blocking rule | pending | `VETO-ML-008` applies if peripheral blocks core or marketplace scope becomes P0. |
| `projects/L3-method-library/02-概要设计.md` | package/method set shell and residual marker outline | pending | Use current peripheral model; do not add marketplace transaction or advanced UX behavior. |
| `projects/L3-method-library/03-详细设计.md` | package/set object, service, residual marker, risk and dependency contracts | pending | Formal source for package/set shell, residual marker semantics and safe failures. |
| `projects/L3-method-library/04-配置设计.md` | peripheral adapter/dependency boundary and disabled/degraded behavior | pending | Peripheral disabled/unavailable state must not degrade P0 core success. |
| `projects/L3-method-library/05-测试方案.md` | service-flow-fast peripheral package/set residual and artifact/report rules | pending | Peripheral residual report must derive from raw artifact if generated. |
| `projects/L3-method-library/06-验收标准.md` | ML-FG-012, ML-RL-004/005, ML-SYNC-007 and `VETO-ML-008` | pending | Peripheral blocking core or unowned residual blocks commit. |
| `projects/L3-method-library/07-实施计划.md` | §3, §6, §7, §8, §11 and §12 | pending | Current source for phase, boundary, allowed scope, checks and commit discipline. |
| `projects/L3-method-library/design-calibration/03_ddd_step_05_module_contracts.md` | peripheral package/set module boundary | pending | Keep peripheral shell separate from core truth, query/material and marketplace transaction. |
| `projects/L3-method-library/design-calibration/03_ddd_step_06_object_contracts.md` | package/set objects, peripheral refs, residual marker and risk state objects | pending | Required typed refs, residual fields and non-blocking state fields must be formal. |
| `projects/L3-method-library/design-calibration/03_ddd_step_07_trait_port_adapter.md` | package/set service ports, dependency seams and residual marker ports | pending | Do not add ports, stores or fakes beyond formal contracts. |
| `projects/L3-method-library/design-calibration/03_ddd_step_08_protocol_contracts.md` | package/set service DTO shells and safe result contracts | pending | Public surfaces must be safe and must not imply marketplace completion. |
| `projects/L3-method-library/design-calibration/03_ddd_step_09_function_flows.md` | package/set service flows and residual/risk marker flows | pending | Service behavior must preserve core non-blocking and formal residual ownership. |
| `projects/L3-method-library/design-calibration/03_ddd_step_10_state_machine.md` | peripheral/residual state guards | pending | Peripheral unavailable/residual states must match formal state matrix. |
| `projects/L3-method-library/design-calibration/03_ddd_step_11_persistence_tx_consistency.md` | package/set store, UoW and residual marker consistency | pending | Fake stores must preserve version/UoW and not bypass residual ownership. |
| `projects/L3-method-library/design-calibration/03_ddd_step_12_errors_recovery.md` | peripheral safe errors and residual escalation rules | pending | Errors must be safe and must not mark P0 core as failed unless formal VETO is hit. |
| `projects/L3-method-library/design-calibration/03_ddd_step_13_concurrency_idempotency.md` | duplicate/replay and peripheral consistency constraints | pending | Duplicate/replay must not convert residual into success or rerun marketplace-like side effects. |
| `projects/L3-method-library/design-calibration/03_ddd_step_16_test_cut.md` | service-flow-fast peripheral package/set residual ownership | pending | Use peripheral residual slice only. |
| `projects/L3-method-library/design-calibration/07_implementation_plan_step_06_tasks_commit_boundaries.md` | `commit-07-b` row | pending | Allowed scope is package/set DTO/domain/service and residual markers. |
| `projects/L3-method-library/design-calibration/07_implementation_plan_step_07_test_acceptance_gates.md` | `commit-07-b` gate row and PH-07 gate | pending | Required checks are service-flow-fast peripheral package/set residual plus risk/dependency seed checks. |
| `projects/L3-method-library/design-calibration/07_implementation_plan_step_11_commit_review_delivery.md` | `commit-07-b` commit body grouping | pending | Commit body must include `Peripheral package and set shell:` and `Residual risk markers:`. |
| `/home/aris/Projects/quantalithos-method-library` git status and `commit-07-a` handoff state | latest implementation state | pending | Must confirm external body-free boundary landed before this boundary starts. |

---

## Allowed Scope

| type | path_or_rule | status |
|---|---|---|
| allowed_path | `/home/aris/Projects/quantalithos-method-library/crates/contracts/src/**` for package/set DTOs, peripheral refs, residual marker wrappers and safe public result/error shells assigned to `commit-07-b` | planned |
| allowed_path | `/home/aris/Projects/quantalithos-method-library/crates/contracts/tests/**` for package/set peripheral contract fixture tests | planned |
| allowed_path | `/home/aris/Projects/quantalithos-method-library/crates/domain/src/**` for package/set domain objects, peripheral state guards, residual marker guards and safe errors assigned to `commit-07-b` | planned |
| allowed_path | `/home/aris/Projects/quantalithos-method-library/crates/domain/tests/**` for peripheral residual and non-blocking domain tests | planned |
| allowed_path | `/home/aris/Projects/quantalithos-method-library/crates/application/src/**` for package/set peripheral shell service, residual marker service and safe service errors assigned to `commit-07-b` | planned |
| allowed_path | `/home/aris/Projects/quantalithos-method-library/crates/application/tests/**` for service-flow-fast peripheral package/set residual tests | planned |
| allowed_path | `/home/aris/Projects/quantalithos-method-library/crates/infra/src/**` only for formally defined in-memory/fake package/set store or dependency seam needed by service tests | planned |
| allowed_path | `/home/aris/Projects/quantalithos-method-library/crates/infra/tests/**` only for peripheral fake store/dependency seam tests | planned |
| allowed_path | `/home/aris/Projects/quantalithos-method-library/artifacts/test/<run_id>/suites/service-flow-fast/**` only if generated by an actual targeted run after activation | planned |
| allowed_path | `/home/aris/Projects/quantalithos-method-library/reports/runs/<run_id>/suites/service-flow-fast.md` only if generated from raw artifact after activation | planned |
| allowed_path | `/home/aris/Projects/quantalithos-method-library/reports/runs/<run_id>/peripheral-residual.md` only if generated from an actual targeted residual/risk check after activation | planned |
| allowed_rule | Add package/method set peripheral DTO/domain/service shells, residual markers, risk ownership fields, non-blocking guards and safe errors explicitly defined by formal design. | planned |
| allowed_rule | Add focused contract/domain/service/fake tests for package/set shell behavior, residual marker creation, dependency seed checks, non-blocking P0 core behavior and `VETO-ML-008` negative cases. | planned |
| forbidden_rule | Do not implement marketplace transaction, pricing, order, purchase, install, fulfillment, advanced UX, dashboard, standard mapping, recommendation marketplace or real external marketplace adapter behavior. | active |
| forbidden_rule | Do not add core truth mutation, definition/formalization/consumption changes, external provider body handling, query/read material, inbound/outbound event, operations job, report generator or release evidence verdict behavior. | active |
| forbidden_rule | Do not invent package/set fields, marketplace fields, residual marker schema, risk owner/acceptor/deadline fields, dependency rules, config keys, report schema or VETO evidence schema not closed by formal `03/05/06/07`. | active |
| forbidden_rule | Do not allow peripheral unavailable/residual state to block P0 core success unless formal `VETO-ML-008` condition is reached. | active |
| forbidden_rule | Do not persist or expose raw provider body, secret, config/env value, full sensitive ref, stack trace, unsafe marketplace payload or old MethodContent/publish/snapshot/outbox material in code/tests/artifacts/logs. | active |
| forbidden_rule | Do not claim marketplace, advanced UX, standard mapping, query/material, operations job, release or final risk acceptance coverage from this boundary. | active |
| forbidden_rule | Do not stage unrelated user changes, generated target directories or implementation outputs from previous boundaries. | active |

---

## Required Checks

| check | command_or_evidence | status | notes |
|---|---|---|---|
| activation guard | project ledger shows `current_boundary = commit-07-b` and `next_allowed_action = read_docs` | pending | Must pass before any implementation edit. |
| prior handoff | `commit-07-a` implementation commit and handoff recorded | pending | External body-free boundary must exist. |
| worktree baseline | `git -C /home/aris/Projects/quantalithos-method-library status --short` | pending | Record before edits and protect unrelated files. |
| local git identity | `git -C /home/aris/Projects/quantalithos-method-library config user.name` and `user.email` | pending | Must remain `quantalithos-labs <quantalithos.ai@gmail.com>`. |
| format | `cargo fmt --all` | pending | Run in implementation repo after Rust changes. |
| workspace check | `cargo check` | pending | Ensures the full workspace still compiles. |
| contracts check | `cargo check -p method-library-contracts` or the formal contracts package check | pending | Use actual package name from formal workspace once activated. |
| domain check | `cargo check -p method-library-domain` or the formal domain package check | pending | Use actual package name from formal workspace once activated. |
| application check | `cargo check -p method-library-application` or the formal application package check | pending | Use actual package name from formal workspace once activated. |
| infra check | `cargo check -p method-library-infra` or the formal infra package check if fake store files changed | pending | Use actual package name from formal workspace once activated. |
| service-flow-fast peripheral package/set residual | targeted peripheral service tests | pending | Must cover package/set shell, residual marker, non-blocking core and no marketplace transaction. |
| dependency targeted seed | dependency-boundary or targeted dependency check if peripheral seams are touched | pending | Peripheral must not introduce forbidden compile-time/runtime dependency. |
| risk/residual targeted seed | targeted residual/risk check or generated peripheral residual report | pending | Residual must have formal owner/acceptor/deadline_or_trigger when required. |
| VETO targeted audit | check `VETO-ML-008` risk is not introduced | pending | Peripheral blocking core or marketplace scope becoming P0 blocks commit. |
| evidence report | run-scoped `service-flow-fast`, dependency and peripheral residual artifacts/reports if scripts exist | pending | Optional until scripts exist; generated reports must derive from raw artifacts. |
| whitespace | `git diff --check` and `git diff --cached --check` before commit | pending | Required for Commit Gate. |
| staged scope | `git diff --cached --name-only` | pending | Must match Allowed Scope. |

---

## Gate Matrix

| gate | status | evidence | next_if_failed |
|---|---|---|---|
| activation_gate | pending | Boundary is planned until project ledger advances from `commit-07-a` to `commit-07-b`. | wait_until_current |
| design_gate | pending | Implementation agent must reread Required Reads and confirm package/set shell, residual marker, dependency and `VETO-ML-008` closure. | wait_design |
| scope_gate | pending | Planned changes must be limited to package/set peripheral shell, residual markers, formal fake seams and focused tests. | fix_gate_failure |
| worktree_gate | pending | Initial implementation worktree status recorded; unrelated user changes protected. | fix_gate_failure |
| build_gate | pending | Formatting, workspace/contract/domain/application/infra checks and dependency boundary checks pass or failure is recorded. | fix_gate_failure |
| test_gate | pending | Service-flow-fast peripheral, dependency seed, risk/residual seed and VETO targeted checks pass after activation. | fix_gate_failure |
| evidence_gate | pending | Targeted artifacts/reports are optional; any generated report must be run-scoped and raw-artifact-derived. | fix_gate_failure |
| commit_gate | pending | staged scope, commit message, whitespace and required checks have evidence. | fix_gate_failure |
| handoff_gate | pending | commit hash, checks run, tests not run, blockers and next boundary state recorded. | handoff |

---

## Commit Gate

| gate | status | evidence |
|---|---|---|
| staged_scope | pending | Must include only allowed `commit-07-b` peripheral package/set, residual marker, test and generated targeted evidence files. |
| unrelated_changes | pending | User-owned unrelated changes must remain unstaged. |
| commit_message_format | pending | Planned subject: `feat(peripheral): add package set shell` |
| commit_body_group | pending | Body group must include `Peripheral package and set shell:` and `Residual risk markers:` from Step 11 mapping. |
| whitespace | pending | `git diff --cached --check` must pass. |
| required_checks | pending | Required Checks table must have pass/not_applicable evidence. |

---

## Handoff Gate

| gate | status | evidence |
|---|---|---|
| committed_hash | pending | Fill after implementation repo commit. |
| committed_message | pending | Fill after implementation repo commit. |
| gates_run | pending | List exact commands and targeted reports. |
| tests_not_run | pending | Must state none or explain; cannot claim marketplace/query/release suites. |
| remaining_blockers | pending | Must reference blocker table; any blocking design gap prevents handoff. |
| final_conclusion | pending | Must be one of pass / fail / cannot_decide with exact evidence source. |
| user_owned_changes_untouched | pending | List unrelated files left untouched. |

---

## Blockers

| blocker_id | gate | status | blocking_reason | requested_design_closure | next_allowed_action |
|---|---|---|---|---|---|
| BLK-ML-07B-ACTIVATION-001 | activation_gate | planned | Project ledger has not advanced through `commit-07-a`; this future boundary must not be used for implementation yet. | After `commit-07-a` handoff, update project ledger to `commit-07-b` and set this boundary to current. | wait_until_current |

---

## Experience Review

| item | conclusion | action |
|---|---|---|
| future boundary pre-creation | applies current planned-ledger rule | Pre-created future ledgers must use `planned / wait_until_current` and must not authorize code changes until project ledger advances. |
| peripheral residual closure | existing design-closure rule applies | Package/set shell, residual marker, dependency and `VETO-ML-008` gaps must be fixed in `03/05/06/07` before code; implementation must not invent marketplace, advanced UX or core-blocking semantics. |
