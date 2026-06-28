# commit-02-a implementation ledger

| field | value |
|---|---|
| project | L3-method-library |
| boundary_id | commit-02-a |
| phase | PH-02 contracts / domain foundation |
| design_baseline | `planned-after-d3faf90-handoff-ledger` |
| implementation_repo | `/home/aris/Projects/quantalithos-method-library` |
| status | planned |
| next_allowed_action | wait_until_current |
| current_recovery_point | future public contract foundation boundary; cannot start until `commit-01-b` is implemented and project ledger advances |

---

## Activation Guard

| rule | status | consequence |
|---|---|---|
| project ledger current_boundary must equal `commit-02-a` | planned | If project ledger still points to an earlier boundary, implementation agent must not use this file to modify code. |
| `commit-01-b` handoff must be closed | planned | Formal workspace layout, config skeleton, script shell and artifact/report roots must exist before contract foundation work starts. |
| project ledger must set `next_allowed_action = read_docs` for `commit-02-a` | planned | Until then this boundary remains `wait_until_current`. |

---

## Required Reads

| document | required_section | status | notes |
|---|---|---|---|
| `standards/document/代码实施台账与门禁规范.md` | planned boundary activation, gate matrix, commit and handoff rules | pending | This future boundary cannot be executed until it becomes current. |
| `standards/document/设计真相源闭环与可落码性标准.md` | no invented DTO, field, marker, schema, evidence or test surface | pending | Any missing ref/DTO/metadata/marker field must return to design. |
| `standards/coding/rust.md` | Rust naming, module layout, test and documentation rules | pending | Source identifiers, comments, rustdoc, error text and test names must be English. |
| `projects/L3-method-library/00-需求文档.md` | P0 requirements, non-goals and old-material exclusion | pending | Prevent old MethodContent / publish / snapshot objects from leaking into contracts. |
| `projects/L3-method-library/01-架构设计.md` | dependency direction and contract ownership | pending | Contracts may depend only on allowed core contracts and local Rust dependencies. |
| `projects/L3-method-library/02-概要设计.md` | code subject framework and key object groups | pending | Use method-library contract subjects, not governance or identity subjects. |
| `projects/L3-method-library/03-详细设计.md` | object contracts, protocol contracts, test cut and implementation handoff | pending | Formal source for typed refs, metadata, safe markers, DTO shells, views, errors and fixtures. |
| `projects/L3-method-library/04-配置设计.md` | config-sensitive redaction and body-free boundaries | pending | Contract errors and fixtures must not expose config/env/secret/body. |
| `projects/L3-method-library/05-测试方案.md` | contract-domain-fast, TC/EV seed and artifact/report rules | pending | Targeted contract reports may be generated only from raw artifacts; no static pass. |
| `projects/L3-method-library/06-验收标准.md` | ML-SYNC seed, ML-STATE/TX/IDEMP seed and evidence integrity | pending | Contract foundation cannot claim later service/domain gates. |
| `projects/L3-method-library/07-实施计划.md` | §3, §6, §7, §8, §11 and §12 | pending | Current source for phase, boundary, allowed scope, checks and commit discipline. |
| `projects/L3-method-library/design-calibration/03_ddd_step_06_object_contracts.md` | typed refs, metadata, safe marker and public object shells | pending | Do not invent fields or marker source values. |
| `projects/L3-method-library/design-calibration/03_ddd_step_08_protocol_contracts.md` | command/query/event/job DTO shells and public errors | pending | This boundary can add DTO shells, not accepted flow behavior. |
| `projects/L3-method-library/design-calibration/03_ddd_step_16_test_cut.md` | contract-domain-fast ownership | pending | Use only the foundation slice relevant to public contracts. |
| `projects/L3-method-library/design-calibration/07_implementation_plan_step_06_tasks_commit_boundaries.md` | `commit-02-a` row | pending | Allowed scope is refs, metadata, safe marker, shared shells and fixtures. |
| `projects/L3-method-library/design-calibration/07_implementation_plan_step_07_test_acceptance_gates.md` | `commit-02-a` gate row and PH-02 gate | pending | Required checks are contracts check and contract-domain-fast foundation. |
| `projects/L3-method-library/design-calibration/07_implementation_plan_step_11_commit_review_delivery.md` | `commit-02-a` commit body grouping | pending | Commit body must include `Public contract foundation:` and `Shared shell fixtures:`. |
| `/home/aris/Projects/quantalithos-method-library` git status and `commit-01-b` handoff state | latest implementation state | pending | Must confirm PH-01 baselines landed before this boundary starts. |

---

## Allowed Scope

| type | path_or_rule | status |
|---|---|---|
| allowed_path | `/home/aris/Projects/quantalithos-method-library/crates/contracts/Cargo.toml` for contract crate dependencies and feature flags closed by design | planned |
| allowed_path | `/home/aris/Projects/quantalithos-method-library/crates/contracts/src/**` for typed refs, metadata, safe markers, DTO shells, view shells, error shells and fixtures | planned |
| allowed_path | `/home/aris/Projects/quantalithos-method-library/crates/contracts/tests/**` for public contract fixture and serialization tests | planned |
| allowed_path | `/home/aris/Projects/quantalithos-method-library/artifacts/test/<run_id>/suites/contract-domain-fast/**` only if generated by an actual targeted run after activation | planned |
| allowed_path | `/home/aris/Projects/quantalithos-method-library/reports/runs/<run_id>/suites/contract-domain-fast.md` only if generated from raw artifact after activation | planned |
| allowed_rule | Add public typed refs, metadata, safe marker wrappers, request/result/view/event/job shell structs, public error shells and stable fixtures explicitly defined by formal design. | planned |
| allowed_rule | Add serialization/fixture tests that prove public contract shape without exercising domain truth or service flow. | planned |
| forbidden_rule | Do not implement domain truth objects, state transitions, guards, policies, application ports, UoW, repositories, infra fakes, API handlers, workers or jobs. | active |
| forbidden_rule | Do not implement business accepted flows, query behavior, event publishing behavior, stored replay behavior or job execution. | active |
| forbidden_rule | Do not add method asset definition/catalog-specific truth behavior beyond contract DTO shells assigned to this boundary. | active |
| forbidden_rule | Do not invent DTO fields, marker values, enum variants, config keys, fixture schemas or evidence schema not closed by formal `03/05/06/07`. | active |
| forbidden_rule | Do not use raw body, external provider response, secret, config/env value, full sensitive ref, stack trace or old MethodContent/publish/snapshot/outbox material in public fixtures. | active |
| forbidden_rule | Do not claim PH-03+ functional gates, service-flow-fast, infra-runtime-fake, release EV, VETO checklist or acceptance handoff. | active |
| forbidden_rule | Do not stage unrelated user changes, generated target directories or implementation outputs from previous boundaries. | active |

---

## Required Checks

| check | command_or_evidence | status | notes |
|---|---|---|---|
| activation guard | project ledger shows `current_boundary = commit-02-a` and `next_allowed_action = read_docs` | pending | Must pass before any implementation edit. |
| prior handoff | `commit-01-b` implementation commit and handoff recorded | pending | PH-01 layout/config/script/path baselines must exist. |
| worktree baseline | `git -C /home/aris/Projects/quantalithos-method-library status --short` | pending | Record before edits and protect unrelated files. |
| local git identity | `git -C /home/aris/Projects/quantalithos-method-library config user.name` and `user.email` | pending | Must remain `quantalithos-labs <quantalithos.ai@gmail.com>`. |
| format | `cargo fmt --all` | pending | Run in implementation repo after Rust changes. |
| workspace check | `cargo check` | pending | Ensures the full workspace still compiles. |
| contracts check | `cargo check -p method-library-contracts` or the formal contracts package check | pending | Use the actual package name from formal workspace once activated. |
| contracts tests | `cargo test -p method-library-contracts` or targeted contract fixture tests | pending | Tests must stay in contract/fixture scope. |
| contract-domain-fast foundation | generated targeted artifact/report for contract foundation if the scripts exist after `commit-01-b` | pending | Optional until scripts exist; if generated, report must derive from raw artifact. |
| dependency boundary | inspect Cargo manifests / metadata for compile-time sibling dependencies | pending | Only formal `core-contracts` sibling dependency is allowed. |
| redaction fixture scan | check fixtures do not include forbidden raw body/secret/provider/config material | pending | Required for safe public contract fixtures. |
| whitespace | `git diff --check` and `git diff --cached --check` before commit | pending | Required for Commit Gate. |
| staged scope | `git diff --cached --name-only` | pending | Must match Allowed Scope. |

---

## Gate Matrix

| gate | status | evidence | next_if_failed |
|---|---|---|---|
| activation_gate | pending | Boundary is planned until project ledger advances from `commit-01-b` to `commit-02-a`. | wait_until_current |
| design_gate | pending | Implementation agent must reread Required Reads and confirm public contract field/DTO/marker closure. | wait_design |
| scope_gate | pending | Planned changes must be limited to contract foundation and fixture tests. | fix_gate_failure |
| worktree_gate | pending | Initial implementation worktree status recorded; unrelated user changes protected. | fix_gate_failure |
| build_gate | pending | Formatting, workspace check, contracts check and dependency boundary checks pass or failure is recorded. | fix_gate_failure |
| test_gate | pending | Contract fixture tests and any contract-domain-fast foundation seed pass after activation. | fix_gate_failure |
| evidence_gate | pending | Targeted artifact/report is optional; any generated report must be run-scoped and raw-artifact-derived. | fix_gate_failure |
| commit_gate | pending | staged scope, commit message, whitespace and required checks have evidence. | fix_gate_failure |
| handoff_gate | pending | commit hash, checks run, tests not run, blockers and next boundary state recorded. | handoff |

---

## Commit Gate

| gate | status | evidence |
|---|---|---|
| staged_scope | pending | Must include only allowed `commit-02-a` contract foundation files and generated targeted evidence if applicable. |
| unrelated_changes | pending | User-owned unrelated changes must remain unstaged. |
| commit_message_format | pending | Planned subject: `feat(contracts): add method library contract foundation` |
| commit_body_group | pending | Body group must include `Public contract foundation:` and `Shared shell fixtures:` from Step 11 mapping. |
| whitespace | pending | `git diff --cached --check` must pass. |
| required_checks | pending | Required Checks table must have pass/not_applicable evidence. |

---

## Handoff Gate

| gate | status | evidence |
|---|---|---|
| committed_hash | pending | Fill after implementation repo commit. |
| committed_message | pending | Fill after implementation repo commit. |
| gates_run | pending | List exact commands and targeted reports. |
| tests_not_run | pending | Must state none or explain; cannot claim later domain/service suites. |
| remaining_blockers | pending | Must reference blocker table; any blocking design gap prevents handoff. |
| final_conclusion | pending | Must be one of pass / fail / cannot_decide with exact evidence source. |
| user_owned_changes_untouched | pending | List unrelated files left untouched. |

---

## Blockers

| blocker_id | gate | status | blocking_reason | requested_design_closure | next_allowed_action |
|---|---|---|---|---|---|
| BLK-ML-02A-ACTIVATION-001 | activation_gate | planned | Project ledger has not advanced through `commit-01-b`; this future boundary must not be used for implementation yet. | After `commit-01-b` handoff, update project ledger to `commit-02-a` and set this boundary to current. | wait_until_current |

---

## Experience Review

| item | conclusion | action |
|---|---|---|
| future boundary pre-creation | applies current planned-ledger rule | Pre-created future ledgers must use `planned / wait_until_current` and must not authorize code changes until project ledger advances. |
| contract foundation | existing design-closure rule applies | Contract DTO/field/marker gaps must be fixed in `03/05/06/07` before code; implementation must not invent schema in `crates/contracts`. |
