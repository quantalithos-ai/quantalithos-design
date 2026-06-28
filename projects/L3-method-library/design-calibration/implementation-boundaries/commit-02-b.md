# commit-02-b implementation ledger

| field | value |
|---|---|
| project | L3-method-library |
| boundary_id | commit-02-b |
| phase | PH-02 contracts / domain foundation |
| design_baseline | `planned-after-d3faf90-handoff-ledger` |
| implementation_repo | `/home/aris/Projects/quantalithos-method-library` |
| status | planned |
| next_allowed_action | wait_until_current |
| current_recovery_point | future domain foundation and test support boundary; cannot start until `commit-02-a` is implemented and project ledger advances |

---

## Activation Guard

| rule | status | consequence |
|---|---|---|
| project ledger current_boundary must equal `commit-02-b` | planned | If project ledger still points to an earlier boundary, implementation agent must not use this file to modify code. |
| `commit-02-a` handoff must be closed | planned | Public contract refs, metadata, safe markers, shared shells and fixtures must exist before domain foundation work starts. |
| project ledger must set `next_allowed_action = read_docs` for `commit-02-b` | planned | Until then this boundary remains `wait_until_current`. |

---

## Required Reads

| document | required_section | status | notes |
|---|---|---|---|
| `standards/document/代码实施台账与门禁规范.md` | planned boundary activation, gate matrix, commit and handoff rules | pending | This future boundary cannot be executed until it becomes current. |
| `standards/document/设计真相源闭环与可落码性标准.md` | no invented domain state, transition, policy, error, marker or test evidence | pending | Any missing state/policy/error/test cut must return to design. |
| `standards/coding/rust.md` | Rust domain module, error and test conventions | pending | Source identifiers, comments, rustdoc, errors and test names must be English. |
| `projects/L3-method-library/00-需求文档.md` | P0 requirements and business rules seed | pending | Domain foundation must remain generic/base and not implement later business slices. |
| `projects/L3-method-library/01-架构设计.md` | domain responsibility and dependency direction | pending | Domain must not depend on config, repository, runtime, API, worker or jobs. |
| `projects/L3-method-library/02-概要设计.md` | key object groups and state/policy outline | pending | Use current method-library object groups; do not restore old MethodContent/publish/snapshot truth. |
| `projects/L3-method-library/03-详细设计.md` | object contracts, state machine, errors/recovery, test cut and implementation handoff | pending | Formal source for domain state, base policies, errors and invariant tests. |
| `projects/L3-method-library/04-配置设计.md` | config boundary and forbidden fallback | pending | Domain must not read config or env; config-driven behavior belongs outside domain. |
| `projects/L3-method-library/05-测试方案.md` | domain tests, contract-domain-fast and artifact/report rules | pending | Domain tests may be targeted; any report must derive from raw artifact. |
| `projects/L3-method-library/06-验收标准.md` | ML-STATE, ML-TX seed, ML-IDEMP seed and evidence integrity | pending | Domain foundation cannot claim service transaction/idempotency completion. |
| `projects/L3-method-library/07-实施计划.md` | §3, §6, §7, §8, §11 and §12 | pending | Current source for phase, boundary, allowed scope, checks and commit discipline. |
| `projects/L3-method-library/design-calibration/03_ddd_step_06_object_contracts.md` | domain object shells, typed refs usage and safe marker constraints | pending | Domain foundation may use contract types but must not add unowned contract fields. |
| `projects/L3-method-library/design-calibration/03_ddd_step_10_state_machine.md` | state matrix foundation | pending | Only base state/transition helpers in this boundary; business-specific transitions belong to later boundaries. |
| `projects/L3-method-library/design-calibration/03_ddd_step_12_errors_recovery.md` | domain error and safe failure surface | pending | Domain errors must be safe and must not leak raw body/config/secret/provider response. |
| `projects/L3-method-library/design-calibration/03_ddd_step_16_test_cut.md` | domain foundation test ownership | pending | Use only domain foundation tests relevant to PH-02. |
| `projects/L3-method-library/design-calibration/07_implementation_plan_step_06_tasks_commit_boundaries.md` | `commit-02-b` row | pending | Allowed scope is domain base error/state/policy/test support. |
| `projects/L3-method-library/design-calibration/07_implementation_plan_step_07_test_acceptance_gates.md` | `commit-02-b` gate row and PH-02 gate | pending | Required checks are domain check and domain tests. |
| `projects/L3-method-library/design-calibration/07_implementation_plan_step_11_commit_review_delivery.md` | `commit-02-b` commit body grouping | pending | Commit body must include `Domain foundation:` and `State and policy tests:`. |
| `/home/aris/Projects/quantalithos-method-library` git status and `commit-02-a` handoff state | latest implementation state | pending | Must confirm contract foundation landed before this boundary starts. |

---

## Allowed Scope

| type | path_or_rule | status |
|---|---|---|
| allowed_path | `/home/aris/Projects/quantalithos-method-library/crates/domain/Cargo.toml` for domain crate dependencies closed by design | planned |
| allowed_path | `/home/aris/Projects/quantalithos-method-library/crates/domain/src/**` for base domain error, state, policy, guard, invariant and test-support modules | planned |
| allowed_path | `/home/aris/Projects/quantalithos-method-library/crates/domain/tests/**` for domain foundation and state/policy tests | planned |
| allowed_path | `/home/aris/Projects/quantalithos-method-library/artifacts/test/<run_id>/suites/contract-domain-fast/**` only if generated by an actual targeted run after activation | planned |
| allowed_path | `/home/aris/Projects/quantalithos-method-library/reports/runs/<run_id>/suites/contract-domain-fast.md` only if generated from raw artifact after activation | planned |
| allowed_rule | Add base domain errors, base state wrappers, policy/guard helpers, invariant helpers, deterministic test support and focused unit tests explicitly defined by formal design. | planned |
| allowed_rule | Use public contract refs/metadata/safe markers from `crates/contracts` without redefining their schema. | planned |
| forbidden_rule | Do not implement business-specific method asset definition/catalog/formalization/consumption/distribution/trace/external/peripheral behavior. | active |
| forbidden_rule | Do not add application ports, UoW, idempotency store, repositories, infra fakes, runtime builder, API handlers, workers, jobs or report generators. | active |
| forbidden_rule | Do not read config/env, repository state, system clock, filesystem, network, adapter output or runtime profile inside domain. | active |
| forbidden_rule | Do not invent domain states, transitions, policy outcomes, error variants, marker values or test evidence fields not closed by formal `03/05/06/07`. | active |
| forbidden_rule | Do not claim accepted command flow, service-flow-fast, infra-runtime-fake, transaction rollback, stored replay, release EV, VETO checklist or acceptance handoff. | active |
| forbidden_rule | Do not use raw body, external provider response, secret, config/env value, full sensitive ref, stack trace or old MethodContent/publish/snapshot/outbox material in tests. | active |
| forbidden_rule | Do not stage unrelated user changes, generated target directories or implementation outputs from previous boundaries. | active |

---

## Required Checks

| check | command_or_evidence | status | notes |
|---|---|---|---|
| activation guard | project ledger shows `current_boundary = commit-02-b` and `next_allowed_action = read_docs` | pending | Must pass before any implementation edit. |
| prior handoff | `commit-02-a` implementation commit and handoff recorded | pending | Public contract foundation must exist. |
| worktree baseline | `git -C /home/aris/Projects/quantalithos-method-library status --short` | pending | Record before edits and protect unrelated files. |
| local git identity | `git -C /home/aris/Projects/quantalithos-method-library config user.name` and `user.email` | pending | Must remain `quantalithos-labs <quantalithos.ai@gmail.com>`. |
| format | `cargo fmt --all` | pending | Run in implementation repo after Rust changes. |
| workspace check | `cargo check` | pending | Ensures the full workspace still compiles. |
| domain check | `cargo check -p method-library-domain` or the formal domain package check | pending | Use the actual package name from formal workspace once activated. |
| domain tests | `cargo test -p method-library-domain` or targeted domain foundation tests | pending | Tests must stay in base domain/state/policy scope. |
| contract-domain-fast foundation | generated targeted artifact/report for domain foundation if scripts exist | pending | If generated, report must derive from raw artifact and preserve failures. |
| dependency boundary | inspect Cargo manifests / metadata for forbidden config/runtime/repository/API dependencies in domain | pending | Domain may depend on contracts; it must not depend on application/infra/entry crates. |
| redaction fixture scan | check domain tests do not include forbidden raw body/secret/provider/config material | pending | Required for safe test support. |
| whitespace | `git diff --check` and `git diff --cached --check` before commit | pending | Required for Commit Gate. |
| staged scope | `git diff --cached --name-only` | pending | Must match Allowed Scope. |

---

## Gate Matrix

| gate | status | evidence | next_if_failed |
|---|---|---|---|
| activation_gate | pending | Boundary is planned until project ledger advances from `commit-02-a` to `commit-02-b`. | wait_until_current |
| design_gate | pending | Implementation agent must reread Required Reads and confirm domain state/policy/error/test closure. | wait_design |
| scope_gate | pending | Planned changes must be limited to domain foundation and test support. | fix_gate_failure |
| worktree_gate | pending | Initial implementation worktree status recorded; unrelated user changes protected. | fix_gate_failure |
| build_gate | pending | Formatting, workspace check, domain check and dependency boundary checks pass or failure is recorded. | fix_gate_failure |
| test_gate | pending | Domain foundation tests and any contract-domain-fast foundation seed pass after activation. | fix_gate_failure |
| evidence_gate | pending | Targeted artifact/report is optional; any generated report must be run-scoped and raw-artifact-derived. | fix_gate_failure |
| commit_gate | pending | staged scope, commit message, whitespace and required checks have evidence. | fix_gate_failure |
| handoff_gate | pending | commit hash, checks run, tests not run, blockers and next boundary state recorded. | handoff |

---

## Commit Gate

| gate | status | evidence |
|---|---|---|
| staged_scope | pending | Must include only allowed `commit-02-b` domain foundation files and generated targeted evidence if applicable. |
| unrelated_changes | pending | User-owned unrelated changes must remain unstaged. |
| commit_message_format | pending | Planned subject: `feat(domain): add method library domain foundation` |
| commit_body_group | pending | Body group must include `Domain foundation:` and `State and policy tests:` from Step 11 mapping. |
| whitespace | pending | `git diff --cached --check` must pass. |
| required_checks | pending | Required Checks table must have pass/not_applicable evidence. |

---

## Handoff Gate

| gate | status | evidence |
|---|---|---|
| committed_hash | pending | Fill after implementation repo commit. |
| committed_message | pending | Fill after implementation repo commit. |
| gates_run | pending | List exact commands and targeted reports. |
| tests_not_run | pending | Must state none or explain; cannot claim later application/service suites. |
| remaining_blockers | pending | Must reference blocker table; any blocking design gap prevents handoff. |
| final_conclusion | pending | Must be one of pass / fail / cannot_decide with exact evidence source. |
| user_owned_changes_untouched | pending | List unrelated files left untouched. |

---

## Blockers

| blocker_id | gate | status | blocking_reason | requested_design_closure | next_allowed_action |
|---|---|---|---|---|---|
| BLK-ML-02B-ACTIVATION-001 | activation_gate | planned | Project ledger has not advanced through `commit-02-a`; this future boundary must not be used for implementation yet. | After `commit-02-a` handoff, update project ledger to `commit-02-b` and set this boundary to current. | wait_until_current |

---

## Experience Review

| item | conclusion | action |
|---|---|---|
| future boundary pre-creation | applies current planned-ledger rule | Pre-created future ledgers must use `planned / wait_until_current` and must not authorize code changes until project ledger advances. |
| domain foundation | existing design-closure rule applies | Domain state/policy/error gaps must be fixed in `03/05/06/07` before code; implementation must not invent behavior in `crates/domain`. |
