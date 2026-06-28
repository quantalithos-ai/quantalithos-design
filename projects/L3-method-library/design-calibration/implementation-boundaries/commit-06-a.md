# commit-06-a implementation ledger

| field | value |
|---|---|
| project | L3-method-library |
| boundary_id | commit-06-a |
| phase | PH-06 traceability, impact, audit and evidence lineage |
| design_baseline | `planned-after-d3faf90-handoff-ledger` |
| implementation_repo | `/home/aris/Projects/quantalithos-method-library` |
| status | planned |
| next_allowed_action | wait_until_current |
| current_recovery_point | future trace/audit/impact/lineage contracts-domain boundary; cannot start until `commit-05-b` is implemented and project ledger advances |

---

## Activation Guard

| rule | status | consequence |
|---|---|---|
| project ledger current_boundary must equal `commit-06-a` | planned | If project ledger still points to an earlier boundary, implementation agent must not use this file to modify code. |
| `commit-05-b` handoff must be closed | planned | Distribution/handoff semantics services must exist before trace/audit/impact contracts-domain work starts. |
| project ledger must set `next_allowed_action = read_docs` for `commit-06-a` | planned | Until then this boundary remains `wait_until_current`. |

---

## Required Reads

| document | required_section | status | notes |
|---|---|---|---|
| `standards/document/代码实施台账与门禁规范.md` | planned boundary activation, gate matrix, commit and handoff rules | pending | This future boundary cannot be executed until it becomes current. |
| `standards/document/设计真相源闭环与可落码性标准.md` | no invented trace material, audit state, evidence lineage schema, redaction rule or report schema | pending | Missing trace/audit/impact/evidence field or safe marker must return to design. |
| `standards/coding/rust.md` | Rust contract/domain module, error and test conventions | pending | Source identifiers, comments, rustdoc, errors and test names must be English. |
| `projects/L3-method-library/00-需求文档.md` | traceability, impact, audit and evidence lineage P0 scope | pending | Trace/audit must be refs-only and must not expose raw body or unsafe provider material. |
| `projects/L3-method-library/01-架构设计.md` | trace/audit component ownership, evidence lineage and redaction boundary | pending | `VETO-ML-005` / `VETO-ML-006` apply to leaks and untraceable evidence. |
| `projects/L3-method-library/02-概要设计.md` | trace material, audit trail, impact summary and lineage object outline | pending | Use the current object/component split; do not introduce query projection or report generator behavior. |
| `projects/L3-method-library/03-详细设计.md` | trace/audit/impact/lineage object, protocol, state, error and test cut contracts | pending | Formal source for typed refs, evidence refs, redaction-safe surfaces and state guards. |
| `projects/L3-method-library/04-配置设计.md` | redaction, observability and evidence/report boundary | pending | This boundary defines contracts/domain only; no runtime report generator or transport. |
| `projects/L3-method-library/05-测试方案.md` | contract-domain-fast trace/audit/impact/lineage and artifact/report rules | pending | Targeted report must derive from raw artifact if generated. |
| `projects/L3-method-library/06-验收标准.md` | ML-FG-004/009/010/011, ML-RL-004/009, `VETO-ML-005` and `VETO-ML-006` | pending | Raw body leaks and untraceable evidence are blocking. |
| `projects/L3-method-library/07-实施计划.md` | §3, §6, §7, §8, §11 and §12 | pending | Current source for phase, boundary, allowed scope, checks and commit discipline. |
| `projects/L3-method-library/design-calibration/03_ddd_step_05_module_contracts.md` | trace/audit/impact/evidence lineage module boundary | pending | Keep PH-06 contracts/domain separate from services/stores and report generation. |
| `projects/L3-method-library/design-calibration/03_ddd_step_06_object_contracts.md` | trace material, audit trail, impact summary, lineage/evidence refs and safe markers | pending | Required typed refs, redaction constraints and state fields must be formal. |
| `projects/L3-method-library/design-calibration/03_ddd_step_07_trait_port_adapter.md` | trace/audit/impact contracts and future port seams | pending | This boundary may define contracts/domain surfaces only where formal; no service/store implementation. |
| `projects/L3-method-library/design-calibration/03_ddd_step_08_protocol_contracts.md` | trace/audit/impact DTO shells and safe public result contracts | pending | Public surfaces must be refs-only and body-free. |
| `projects/L3-method-library/design-calibration/03_ddd_step_10_state_machine.md` | trace/audit/impact and evidence lineage state guards | pending | Domain state transitions must match formal state matrix. |
| `projects/L3-method-library/design-calibration/03_ddd_step_12_errors_recovery.md` | trace/audit/impact safe error surfaces | pending | Errors must be safe, body-free and source-ref based. |
| `projects/L3-method-library/design-calibration/03_ddd_step_13_concurrency_idempotency.md` | stored replay and evidence consistency constraints | pending | Contracts must support replay/evidence consistency without duplicate truth mutation. |
| `projects/L3-method-library/design-calibration/03_ddd_step_16_test_cut.md` | contract-domain-fast trace/audit/impact/lineage ownership | pending | Use trace/audit contract-domain slice only. |
| `projects/L3-method-library/design-calibration/07_implementation_plan_step_06_tasks_commit_boundaries.md` | `commit-06-a` row | pending | Allowed scope is trace material, audit trail, impact summary and lineage/evidence refs. |
| `projects/L3-method-library/design-calibration/07_implementation_plan_step_07_test_acceptance_gates.md` | `commit-06-a` gate row and PH-06 gate | pending | Required checks are contract-domain-fast trace/audit/impact/lineage and redaction-aware report seed checks. |
| `projects/L3-method-library/design-calibration/07_implementation_plan_step_11_commit_review_delivery.md` | `commit-06-a` commit body grouping | pending | Commit body must include `Trace and audit contracts:` and `Evidence lineage state:`. |
| `/home/aris/Projects/quantalithos-method-library` git status and `commit-05-b` handoff state | latest implementation state | pending | Must confirm distribution/handoff services landed before this boundary starts. |

---

## Allowed Scope

| type | path_or_rule | status |
|---|---|---|
| allowed_path | `/home/aris/Projects/quantalithos-method-library/crates/contracts/src/**` for trace material DTOs, audit trail DTOs, impact summary DTOs, lineage/evidence refs, safe marker wrappers and public error/result shells assigned to `commit-06-a` | planned |
| allowed_path | `/home/aris/Projects/quantalithos-method-library/crates/contracts/tests/**` for trace/audit/impact/lineage contract fixture tests | planned |
| allowed_path | `/home/aris/Projects/quantalithos-method-library/crates/domain/src/**` for trace material domain objects, audit trail domain objects, impact summary guards, lineage/evidence ref guards and safe errors assigned to `commit-06-a` | planned |
| allowed_path | `/home/aris/Projects/quantalithos-method-library/crates/domain/tests/**` for trace/audit/impact/lineage domain guard tests | planned |
| allowed_path | `/home/aris/Projects/quantalithos-method-library/artifacts/test/<run_id>/suites/contract-domain-fast/**` only if generated by an actual targeted run after activation | planned |
| allowed_path | `/home/aris/Projects/quantalithos-method-library/reports/runs/<run_id>/suites/contract-domain-fast.md` only if generated from raw artifact after activation | planned |
| allowed_path | `/home/aris/Projects/quantalithos-method-library/reports/runs/<run_id>/redaction-check.md` only if generated from an actual targeted redaction check after activation | planned |
| allowed_rule | Add trace material, audit trail, impact summary, lineage/evidence refs, redaction-safe marker wrappers, state guards and safe domain errors explicitly defined by formal design. | planned |
| allowed_rule | Add focused contract/domain tests for refs-only trace/audit material, impact guard behavior, lineage/evidence ref integrity, redaction-safe public surfaces and no raw body leakage. | planned |
| forbidden_rule | Do not implement trace/audit/impact application services, stores, repository fakes, report generator, operations job, query projection, API handler, worker or publisher behavior. | active |
| forbidden_rule | Do not add external provider body handling, source/archive lifecycle, peripheral package/set, query/read material, inbound/outbound event, recovery/replay job or release evidence verdict behavior. | active |
| forbidden_rule | Do not invent trace fields, audit entry schema, impact summary fields, evidence refs, lineage source, redaction marker source, config keys, report schema or VETO evidence schema not closed by formal `03/05/06/07`. | active |
| forbidden_rule | Do not persist or expose raw body, external provider response, secret, config/env value, full sensitive ref, stack trace, unsafe diff or old MethodContent/publish/snapshot/outbox material in DTOs/tests. | active |
| forbidden_rule | Do not claim PH-06 service, redaction report, report generator, query projection or release evidence coverage from this contracts-domain boundary. | active |
| forbidden_rule | Do not stage unrelated user changes, generated target directories or implementation outputs from previous boundaries. | active |

---

## Required Checks

| check | command_or_evidence | status | notes |
|---|---|---|---|
| activation guard | project ledger shows `current_boundary = commit-06-a` and `next_allowed_action = read_docs` | pending | Must pass before any implementation edit. |
| prior handoff | `commit-05-b` implementation commit and handoff recorded | pending | Distribution/handoff service slice must exist. |
| worktree baseline | `git -C /home/aris/Projects/quantalithos-method-library status --short` | pending | Record before edits and protect unrelated files. |
| local git identity | `git -C /home/aris/Projects/quantalithos-method-library config user.name` and `user.email` | pending | Must remain `quantalithos-labs <quantalithos.ai@gmail.com>`. |
| format | `cargo fmt --all` | pending | Run in implementation repo after Rust changes. |
| workspace check | `cargo check` | pending | Ensures the full workspace still compiles. |
| contracts check | `cargo check -p method-library-contracts` or the formal contracts package check | pending | Use actual package name from formal workspace once activated. |
| domain check | `cargo check -p method-library-domain` or the formal domain package check | pending | Use actual package name from formal workspace once activated. |
| contract-domain-fast trace/audit/impact/lineage | targeted trace/audit/impact/lineage contract-domain tests | pending | Must cover refs-only behavior, evidence ref integrity and safe marker semantics. |
| redaction targeted seed | targeted scan or test for raw body/secret/provider/config material leakage | pending | Required because PH-06 starts redaction targeted ownership. |
| VETO targeted audit | check `VETO-ML-005` / `VETO-ML-006` risk is not introduced | pending | Raw body leak or untraceable evidence blocks commit. |
| evidence report | run-scoped `contract-domain-fast` artifact/report if scripts exist | pending | Optional until scripts exist; generated reports must derive from raw artifacts. |
| whitespace | `git diff --check` and `git diff --cached --check` before commit | pending | Required for Commit Gate. |
| staged scope | `git diff --cached --name-only` | pending | Must match Allowed Scope. |

---

## Gate Matrix

| gate | status | evidence | next_if_failed |
|---|---|---|---|
| activation_gate | pending | Boundary is planned until project ledger advances from `commit-05-b` to `commit-06-a`. | wait_until_current |
| design_gate | pending | Implementation agent must reread Required Reads and confirm trace/audit/impact/lineage fields, refs, safe markers and redaction closure. | wait_design |
| scope_gate | pending | Planned changes must be limited to trace/audit/impact/lineage contracts-domain and focused tests. | fix_gate_failure |
| worktree_gate | pending | Initial implementation worktree status recorded; unrelated user changes protected. | fix_gate_failure |
| build_gate | pending | Formatting, workspace/contract/domain checks and dependency boundary checks pass or failure is recorded. | fix_gate_failure |
| test_gate | pending | Contract-domain-fast trace/audit/impact/lineage, redaction targeted seed and VETO targeted checks pass after activation. | fix_gate_failure |
| evidence_gate | pending | Targeted artifact/report is optional; any generated report must be run-scoped and raw-artifact-derived. | fix_gate_failure |
| commit_gate | pending | staged scope, commit message, whitespace and required checks have evidence. | fix_gate_failure |
| handoff_gate | pending | commit hash, checks run, tests not run, blockers and next boundary state recorded. | handoff |

---

## Commit Gate

| gate | status | evidence |
|---|---|---|
| staged_scope | pending | Must include only allowed `commit-06-a` trace/audit/impact/lineage contract/domain files and generated targeted evidence if applicable. |
| unrelated_changes | pending | User-owned unrelated changes must remain unstaged. |
| commit_message_format | pending | Planned subject: `feat(trace): add audit lineage contracts` |
| commit_body_group | pending | Body group must include `Trace and audit contracts:` and `Evidence lineage state:` from Step 11 mapping. |
| whitespace | pending | `git diff --cached --check` must pass. |
| required_checks | pending | Required Checks table must have pass/not_applicable evidence. |

---

## Handoff Gate

| gate | status | evidence |
|---|---|---|
| committed_hash | pending | Fill after implementation repo commit. |
| committed_message | pending | Fill after implementation repo commit. |
| gates_run | pending | List exact commands and targeted reports. |
| tests_not_run | pending | Must state none or explain; cannot claim service/report/query/release suites. |
| remaining_blockers | pending | Must reference blocker table; any blocking design gap prevents handoff. |
| final_conclusion | pending | Must be one of pass / fail / cannot_decide with exact evidence source. |
| user_owned_changes_untouched | pending | List unrelated files left untouched. |

---

## Blockers

| blocker_id | gate | status | blocking_reason | requested_design_closure | next_allowed_action |
|---|---|---|---|---|---|
| BLK-ML-06A-ACTIVATION-001 | activation_gate | planned | Project ledger has not advanced through `commit-05-b`; this future boundary must not be used for implementation yet. | After `commit-05-b` handoff, update project ledger to `commit-06-a` and set this boundary to current. | wait_until_current |

---

## Experience Review

| item | conclusion | action |
|---|---|---|
| future boundary pre-creation | applies current planned-ledger rule | Pre-created future ledgers must use `planned / wait_until_current` and must not authorize code changes until project ledger advances. |
| trace/audit redaction closure | existing design-closure rule applies | Trace material, audit trail, impact summary, lineage/evidence refs and redaction marker gaps must be fixed in `03/05/06/07` before code; implementation must not invent body-bearing or untraceable evidence semantics. |
