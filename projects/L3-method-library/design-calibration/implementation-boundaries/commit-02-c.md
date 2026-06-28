# commit-02-c implementation ledger

| field | value |
|---|---|
| project | L3-method-library |
| boundary_id | commit-02-c |
| phase | PH-02 contracts / domain foundation |
| design_baseline | `planned-after-d3faf90-handoff-ledger` |
| implementation_repo | `/home/aris/Projects/quantalithos-method-library` |
| status | planned |
| next_allowed_action | wait_until_current |
| current_recovery_point | future application foundation ports / UoW / idempotency shell boundary; cannot start until `commit-02-b` is implemented and project ledger advances |

---

## Activation Guard

| rule | status | consequence |
|---|---|---|
| project ledger current_boundary must equal `commit-02-c` | planned | If project ledger still points to an earlier boundary, implementation agent must not use this file to modify code. |
| `commit-02-b` handoff must be closed | planned | Domain foundation, base state/policy/error and test support must exist before application foundation work starts. |
| project ledger must set `next_allowed_action = read_docs` for `commit-02-c` | planned | Until then this boundary remains `wait_until_current`. |

---

## Required Reads

| document | required_section | status | notes |
|---|---|---|---|
| `standards/document/代码实施台账与门禁规范.md` | planned boundary activation, gate matrix, commit and handoff rules | pending | This future boundary cannot be executed until it becomes current. |
| `standards/document/设计真相源闭环与可落码性标准.md` | no invented port, UoW, idempotency, stored surface, evidence or config fields | pending | Any missing port/signature/replay surface must return to design. |
| `standards/coding/rust.md` | Rust application module, trait, error and test conventions | pending | Source identifiers, comments, rustdoc, errors and test names must be English. |
| `projects/L3-method-library/00-需求文档.md` | P0 requirements and boundary rules seed | pending | Application foundation must not implement business-specific flows yet. |
| `projects/L3-method-library/01-架构设计.md` | application responsibility, dependency direction and runtime seam | pending | Application may define ports but must not implement concrete adapters. |
| `projects/L3-method-library/02-概要设计.md` | code subject framework, transaction and interaction outline | pending | Use current method-library application boundary, not old snapshot/outbox worker direction. |
| `projects/L3-method-library/03-详细设计.md` | trait/port adapter contracts, persistence/transaction consistency, concurrency/idempotency and implementation handoff | pending | Formal source for ports, UoW, idempotency keys, stored result shells and application errors. |
| `projects/L3-method-library/04-配置设计.md` | config binding boundary and fail-fast/degraded rules | pending | Application may expose config-facing seams only if formal; it must not invent config keys. |
| `projects/L3-method-library/05-测试方案.md` | application unit tests, service seed, artifact/report rules | pending | Foundation tests may be targeted; reports must derive from raw artifact. |
| `projects/L3-method-library/06-验收标准.md` | ML-TX seed, ML-IDEMP seed, evidence integrity and no static pass | pending | Application foundation cannot claim business service completion. |
| `projects/L3-method-library/07-实施计划.md` | §3, §6, §7, §8, §11 and §12 | pending | Current source for phase, boundary, allowed scope, checks and commit discipline. |
| `projects/L3-method-library/design-calibration/03_ddd_step_07_trait_port_adapter.md` | formal trait/port contracts and adapter boundary | pending | Only formal ports/signatures may be introduced. |
| `projects/L3-method-library/design-calibration/03_ddd_step_11_persistence_tx_consistency.md` | UoW and transaction semantics | pending | UoW shell must not implement concrete storage semantics. |
| `projects/L3-method-library/design-calibration/03_ddd_step_13_concurrency_idempotency.md` | idempotency and stored replay surface | pending | Only idempotency/stored result shell; duplicate behavior comes in later service boundaries. |
| `projects/L3-method-library/design-calibration/03_ddd_step_16_test_cut.md` | application foundation test ownership | pending | Use only PH-02 application foundation tests. |
| `projects/L3-method-library/design-calibration/07_implementation_plan_step_06_tasks_commit_boundaries.md` | `commit-02-c` row | pending | Allowed scope is application ports, UoW and idempotency/stored surface shell. |
| `projects/L3-method-library/design-calibration/07_implementation_plan_step_07_test_acceptance_gates.md` | `commit-02-c` gate row and PH-02 gate | pending | Required checks are application check and UoW/idempotency unit tests. |
| `projects/L3-method-library/design-calibration/07_implementation_plan_step_11_commit_review_delivery.md` | `commit-02-c` commit body grouping | pending | Commit body must include `Application transaction surface:` and `Idempotency and UoW shell:`. |
| `/home/aris/Projects/quantalithos-method-library` git status and `commit-02-b` handoff state | latest implementation state | pending | Must confirm domain foundation landed before this boundary starts. |

---

## Allowed Scope

| type | path_or_rule | status |
|---|---|---|
| allowed_path | `/home/aris/Projects/quantalithos-method-library/crates/application/Cargo.toml` for application crate dependencies closed by design | planned |
| allowed_path | `/home/aris/Projects/quantalithos-method-library/crates/application/src/**` for formal ports, UoW shell, idempotency/stored surface shell, mapper shell and application error shell | planned |
| allowed_path | `/home/aris/Projects/quantalithos-method-library/crates/application/tests/**` for application foundation, UoW shell and idempotency shell tests | planned |
| allowed_path | `/home/aris/Projects/quantalithos-method-library/artifacts/test/<run_id>/suites/contract-domain-fast/**` only if generated by an actual targeted run after activation | planned |
| allowed_path | `/home/aris/Projects/quantalithos-method-library/reports/runs/<run_id>/suites/contract-domain-fast.md` only if generated from raw artifact after activation | planned |
| allowed_rule | Add formal application trait/port definitions, UoW boundary traits, idempotency key/digest/result shell, stored surface shell and safe application errors explicitly defined by formal design. | planned |
| allowed_rule | Add unit tests proving shell wiring, trait object compile shape, safe errors and idempotency/UoW boundary invariants without concrete storage. | planned |
| forbidden_rule | Do not implement concrete repositories, in-memory/fake stores, adapters, runtime builder, config loader, API handler, worker, jobs or report generator. | active |
| forbidden_rule | Do not implement business-specific command/query/consumer/outbound/job services, accepted flows, duplicate replay behavior, transaction mutation or rollback behavior. | active |
| forbidden_rule | Do not create private maps, fake UoW semantics, persisted stores, durable indexes, event publisher outcomes or job checkpoint/report behavior. | active |
| forbidden_rule | Do not invent port methods, UoW fields, idempotency key fields, stored result schema, application errors, config keys or evidence schema not closed by formal `03/05/06/07`. | active |
| forbidden_rule | Do not read config/env, filesystem, network, adapter output, repository state or system clock except through formal shell types if explicitly defined. | active |
| forbidden_rule | Do not claim PH-03+ service-flow-fast, infra-runtime-fake, transaction rollback, stored replay completion, release EV, VETO checklist or acceptance handoff. | active |
| forbidden_rule | Do not stage unrelated user changes, generated target directories or implementation outputs from previous boundaries. | active |

---

## Required Checks

| check | command_or_evidence | status | notes |
|---|---|---|---|
| activation guard | project ledger shows `current_boundary = commit-02-c` and `next_allowed_action = read_docs` | pending | Must pass before any implementation edit. |
| prior handoff | `commit-02-b` implementation commit and handoff recorded | pending | Domain foundation must exist. |
| worktree baseline | `git -C /home/aris/Projects/quantalithos-method-library status --short` | pending | Record before edits and protect unrelated files. |
| local git identity | `git -C /home/aris/Projects/quantalithos-method-library config user.name` and `user.email` | pending | Must remain `quantalithos-labs <quantalithos.ai@gmail.com>`. |
| format | `cargo fmt --all` | pending | Run in implementation repo after Rust changes. |
| workspace check | `cargo check` | pending | Ensures the full workspace still compiles. |
| application check | `cargo check -p method-library-application` or the formal application package check | pending | Use the actual package name from formal workspace once activated. |
| application tests | `cargo test -p method-library-application` or targeted UoW/idempotency shell tests | pending | Tests must stay in shell/foundation scope. |
| contract-domain-fast foundation | generated targeted artifact/report for application foundation if scripts exist | pending | If generated, report must derive from raw artifact and preserve failures. |
| dependency boundary | inspect Cargo manifests / metadata for forbidden concrete adapter/runtime/entry dependencies in application | pending | Application may define ports; it must not depend on infra/api/worker/jobs. |
| idempotency closure audit | verify shell fields/methods map to formal Step 13 concurrency/idempotency design | pending | Missing or contradictory stored surface blocks implementation. |
| whitespace | `git diff --check` and `git diff --cached --check` before commit | pending | Required for Commit Gate. |
| staged scope | `git diff --cached --name-only` | pending | Must match Allowed Scope. |

---

## Gate Matrix

| gate | status | evidence | next_if_failed |
|---|---|---|---|
| activation_gate | pending | Boundary is planned until project ledger advances from `commit-02-b` to `commit-02-c`. | wait_until_current |
| design_gate | pending | Implementation agent must reread Required Reads and confirm port/UoW/idempotency/stored surface closure. | wait_design |
| scope_gate | pending | Planned changes must be limited to application foundation shells and tests. | fix_gate_failure |
| worktree_gate | pending | Initial implementation worktree status recorded; unrelated user changes protected. | fix_gate_failure |
| build_gate | pending | Formatting, workspace check, application check and dependency boundary checks pass or failure is recorded. | fix_gate_failure |
| test_gate | pending | UoW/idempotency shell tests and any contract-domain-fast foundation seed pass after activation. | fix_gate_failure |
| evidence_gate | pending | Targeted artifact/report is optional; any generated report must be run-scoped and raw-artifact-derived. | fix_gate_failure |
| commit_gate | pending | staged scope, commit message, whitespace and required checks have evidence. | fix_gate_failure |
| handoff_gate | pending | commit hash, checks run, tests not run, blockers and next boundary state recorded. | handoff |

---

## Commit Gate

| gate | status | evidence |
|---|---|---|
| staged_scope | pending | Must include only allowed `commit-02-c` application foundation files and generated targeted evidence if applicable. |
| unrelated_changes | pending | User-owned unrelated changes must remain unstaged. |
| commit_message_format | pending | Planned subject: `feat(application): add transaction and idempotency foundation` |
| commit_body_group | pending | Body group must include `Application transaction surface:` and `Idempotency and UoW shell:` from Step 11 mapping. |
| whitespace | pending | `git diff --cached --check` must pass. |
| required_checks | pending | Required Checks table must have pass/not_applicable evidence. |

---

## Handoff Gate

| gate | status | evidence |
|---|---|---|
| committed_hash | pending | Fill after implementation repo commit. |
| committed_message | pending | Fill after implementation repo commit. |
| gates_run | pending | List exact commands and targeted reports. |
| tests_not_run | pending | Must state none or explain; cannot claim later business service suites. |
| remaining_blockers | pending | Must reference blocker table; any blocking design gap prevents handoff. |
| final_conclusion | pending | Must be one of pass / fail / cannot_decide with exact evidence source. |
| user_owned_changes_untouched | pending | List unrelated files left untouched. |

---

## Blockers

| blocker_id | gate | status | blocking_reason | requested_design_closure | next_allowed_action |
|---|---|---|---|---|---|
| BLK-ML-02C-ACTIVATION-001 | activation_gate | planned | Project ledger has not advanced through `commit-02-b`; this future boundary must not be used for implementation yet. | After `commit-02-b` handoff, update project ledger to `commit-02-c` and set this boundary to current. | wait_until_current |

---

## Experience Review

| item | conclusion | action |
|---|---|---|
| future boundary pre-creation | applies current planned-ledger rule | Pre-created future ledgers must use `planned / wait_until_current` and must not authorize code changes until project ledger advances. |
| application foundation | existing design-closure rule applies | Port/UoW/idempotency/stored surface gaps must be fixed in `03/05/06/07` before code; implementation must not invent application interfaces. |
