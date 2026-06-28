# commit-06-b implementation ledger

| field | value |
|---|---|
| project | L3-method-library |
| boundary_id | commit-06-b |
| phase | PH-06 traceability, impact, audit and evidence lineage |
| design_baseline | `planned-after-d3faf90-handoff-ledger` |
| implementation_repo | `/home/aris/Projects/quantalithos-method-library` |
| status | planned |
| next_allowed_action | wait_until_current |
| current_recovery_point | future trace/audit/impact services and stores boundary; cannot start until `commit-06-a` is implemented and project ledger advances |

---

## Activation Guard

| rule | status | consequence |
|---|---|---|
| project ledger current_boundary must equal `commit-06-b` | planned | If project ledger still points to an earlier boundary, implementation agent must not use this file to modify code. |
| `commit-06-a` handoff must be closed | planned | Trace/audit/impact/lineage contracts-domain must exist before service/store work starts. |
| project ledger must set `next_allowed_action = read_docs` for `commit-06-b` | planned | Until then this boundary remains `wait_until_current`. |

---

## Required Reads

| document | required_section | status | notes |
|---|---|---|---|
| `standards/document/代码实施台账与门禁规范.md` | planned boundary activation, gate matrix, commit and handoff rules | pending | This future boundary cannot be executed until it becomes current. |
| `standards/document/设计真相源闭环与可落码性标准.md` | no invented service port, store, mapper, marker, redaction rule, replay schema or report schema | pending | Missing trace/audit/impact service/store closure must return to design. |
| `standards/coding/rust.md` | Rust application/infra module, fake store, error and test conventions | pending | Source identifiers, comments, rustdoc, errors and test names must be English. |
| `projects/L3-method-library/00-需求文档.md` | traceability, impact, audit and evidence lineage service expectations | pending | Services must be refs-only and must not expose raw body or unsafe provider material. |
| `projects/L3-method-library/01-架构设计.md` | trace/audit service ownership, consistency, observability and redaction boundary | pending | `VETO-ML-005` / `VETO-ML-006` / `VETO-ML-011` apply to leaks, untraceable evidence and unsafe reporting. |
| `projects/L3-method-library/02-概要设计.md` | trace/audit/impact service and store outline | pending | Use current service/store split; do not introduce report generator or operations job behavior. |
| `projects/L3-method-library/03-详细设计.md` | trace/audit/impact ports, flows, persistence, state, replay and error contracts | pending | Formal source for service order, store semantics, refs-only behavior and safe failures. |
| `projects/L3-method-library/04-配置设计.md` | redaction, observability and disabled/degraded runtime seams | pending | This boundary may wire formal fake stores/seams only; no production adapter or report generator. |
| `projects/L3-method-library/05-测试方案.md` | service-flow-fast trace/audit/impact, redaction targeted and artifact/report rules | pending | Targeted reports must derive from raw artifacts if generated. |
| `projects/L3-method-library/06-验收标准.md` | ML-FG-004/009/010/011, ML-RL-004/009, `VETO-ML-005/006/009/011` | pending | Redaction leak, untraceable evidence or unsafe report/log detail blocks commit. |
| `projects/L3-method-library/07-实施计划.md` | §3, §6, §7, §8, §11 and §12 | pending | Current source for phase, boundary, allowed scope, checks and commit discipline. |
| `projects/L3-method-library/design-calibration/03_ddd_step_05_module_contracts.md` | trace/audit/impact/evidence lineage module boundary | pending | Keep PH-06 services/stores separate from report generator, jobs and query projection. |
| `projects/L3-method-library/design-calibration/03_ddd_step_06_object_contracts.md` | trace material, audit trail, impact summary and lineage object contracts | pending | Service code may only construct/copy fields with formal source. |
| `projects/L3-method-library/design-calibration/03_ddd_step_07_trait_port_adapter.md` | trace/audit/impact service ports, repositories/stores and adapter seams | pending | Do not add ports, stores or fakes beyond formal contracts. |
| `projects/L3-method-library/design-calibration/03_ddd_step_08_protocol_contracts.md` | trace/audit/impact service request/result shells | pending | Public surfaces must be refs-only and body-free. |
| `projects/L3-method-library/design-calibration/03_ddd_step_09_function_flows.md` | trace/audit/impact service flows | pending | Service behavior must follow formal flow order, replay rules and safe failure branches. |
| `projects/L3-method-library/design-calibration/03_ddd_step_10_state_machine.md` | trace/audit/impact state transitions and consistency guards | pending | No implicit success or trace repair beyond formal state matrix. |
| `projects/L3-method-library/design-calibration/03_ddd_step_11_persistence_tx_consistency.md` | store, UoW, version and transaction consistency | pending | Fake stores must preserve version/UoW and stored replay semantics if used. |
| `projects/L3-method-library/design-calibration/03_ddd_step_12_errors_recovery.md` | safe errors, redaction failures and recovery surfaces | pending | Errors/logs/reports must be safe, refs-only and body-free. |
| `projects/L3-method-library/design-calibration/03_ddd_step_13_concurrency_idempotency.md` | duplicate replay, stored result and trace consistency constraints | pending | Duplicate/replay must not rerun side effects or rebuild evidence from current truth. |
| `projects/L3-method-library/design-calibration/03_ddd_step_16_test_cut.md` | service-flow-fast trace/audit/impact and redaction targeted ownership | pending | Use trace/audit service slice only. |
| `projects/L3-method-library/design-calibration/07_implementation_plan_step_06_tasks_commit_boundaries.md` | `commit-06-b` row | pending | Allowed scope is application services, stores and refs-only tests. |
| `projects/L3-method-library/design-calibration/07_implementation_plan_step_07_test_acceptance_gates.md` | `commit-06-b` gate row and PH-06 gate | pending | Required checks are service-flow-fast trace/audit/impact and redaction targeted. |
| `projects/L3-method-library/design-calibration/07_implementation_plan_step_11_commit_review_delivery.md` | `commit-06-b` commit body grouping | pending | Commit body must include `Trace service flows:` and `Redaction targeted checks:`. |
| `/home/aris/Projects/quantalithos-method-library` git status and `commit-06-a` handoff state | latest implementation state | pending | Must confirm trace/audit contracts-domain landed before this boundary starts. |

---

## Allowed Scope

| type | path_or_rule | status |
|---|---|---|
| allowed_path | `/home/aris/Projects/quantalithos-method-library/crates/application/src/**` for trace/audit/impact application services, service errors, replay-safe orchestration and refs-only service facades assigned to `commit-06-b` | planned |
| allowed_path | `/home/aris/Projects/quantalithos-method-library/crates/application/tests/**` for trace/audit/impact service-flow-fast tests | planned |
| allowed_path | `/home/aris/Projects/quantalithos-method-library/crates/infra/src/**` for formal in-memory/fake trace/audit/impact stores and adapter seams needed by service tests | planned |
| allowed_path | `/home/aris/Projects/quantalithos-method-library/crates/infra/tests/**` for fake store, UoW/version and redaction-safe runtime seam tests | planned |
| allowed_path | `/home/aris/Projects/quantalithos-method-library/crates/contracts/src/**` only for narrow compile integration of already-formal service DTO/port shells needed by service wiring | planned |
| allowed_path | `/home/aris/Projects/quantalithos-method-library/crates/domain/src/**` only for narrow compile integration of already-formal domain guards needed by service wiring | planned |
| allowed_path | `/home/aris/Projects/quantalithos-method-library/artifacts/test/<run_id>/suites/service-flow-fast/**` only if generated by an actual targeted run after activation | planned |
| allowed_path | `/home/aris/Projects/quantalithos-method-library/reports/runs/<run_id>/suites/service-flow-fast.md` only if generated from raw artifact after activation | planned |
| allowed_path | `/home/aris/Projects/quantalithos-method-library/reports/runs/<run_id>/redaction-check.md` only if generated from an actual targeted redaction check after activation | planned |
| allowed_rule | Implement trace/audit/impact service flows, store writes/reads, UoW/version handling, stored replay-safe behavior and refs-only consistency checks explicitly defined by formal design. | planned |
| allowed_rule | Add focused service/fake tests for trace material append/read, audit trail append/read, impact summary derivation, lineage/evidence ref integrity, stored replay regression and redaction-safe outputs. | planned |
| forbidden_rule | Do not implement report generator, evidence index generator, operations job, recovery/replay job, query projection, API handler, worker, publisher or release evidence verdict behavior. | active |
| forbidden_rule | Do not add external provider body handling, source/archive lifecycle, peripheral package/set, query/read material, inbound/outbound event, final report audit or acceptance handoff behavior. | active |
| forbidden_rule | Do not invent service ports, store keys, mapper methods, audit entry schema, impact derivation source, evidence refs, redaction marker source, config keys, report schema or VETO evidence schema not closed by formal `03/05/06/07`. | active |
| forbidden_rule | Do not reconstruct evidence or replay response by rereading current truth when formal stored result/replay surface is required. | active |
| forbidden_rule | Do not persist or expose raw body, external provider response, secret, config/env value, full sensitive ref, stack trace, unsafe diff or old MethodContent/publish/snapshot/outbox material in services/tests/artifacts/logs. | active |
| forbidden_rule | Do not stage unrelated user changes, generated target directories or implementation outputs from previous boundaries. | active |

---

## Required Checks

| check | command_or_evidence | status | notes |
|---|---|---|---|
| activation guard | project ledger shows `current_boundary = commit-06-b` and `next_allowed_action = read_docs` | pending | Must pass before any implementation edit. |
| prior handoff | `commit-06-a` implementation commit and handoff recorded | pending | Trace/audit/impact contracts-domain slice must exist. |
| worktree baseline | `git -C /home/aris/Projects/quantalithos-method-library status --short` | pending | Record before edits and protect unrelated files. |
| local git identity | `git -C /home/aris/Projects/quantalithos-method-library config user.name` and `user.email` | pending | Must remain `quantalithos-labs <quantalithos.ai@gmail.com>`. |
| format | `cargo fmt --all` | pending | Run in implementation repo after Rust changes. |
| workspace check | `cargo check` | pending | Ensures the full workspace still compiles. |
| application check | `cargo check -p method-library-application` or the formal application package check | pending | Use actual package name from formal workspace once activated. |
| infra check | `cargo check -p method-library-infra` or the formal infra package check | pending | Use actual package name from formal workspace once activated. |
| service-flow-fast trace/audit/impact | targeted trace/audit/impact service tests | pending | Must cover refs-only service behavior, UoW/version and replay-safe outcomes. |
| redaction targeted | targeted redaction scan/test over service artifacts, reports and logs | pending | PH-06 service boundary must not leak raw body/secret/provider/config material. |
| stored replay regression | duplicate/replay checks for trace/audit/impact surfaces where formal design requires stored results | pending | Must not rerun side effects or reconstruct from current truth. |
| VETO targeted audit | check `VETO-ML-005` / `VETO-ML-006` / `VETO-ML-009` / `VETO-ML-011` risk is not introduced | pending | Leak, untraceable evidence, unsafe observability/report detail or redaction failure blocks commit. |
| evidence report | run-scoped `service-flow-fast` and redaction artifacts/reports if scripts exist | pending | Optional until scripts exist; generated reports must derive from raw artifacts. |
| whitespace | `git diff --check` and `git diff --cached --check` before commit | pending | Required for Commit Gate. |
| staged scope | `git diff --cached --name-only` | pending | Must match Allowed Scope. |

---

## Gate Matrix

| gate | status | evidence | next_if_failed |
|---|---|---|---|
| activation_gate | pending | Boundary is planned until project ledger advances from `commit-06-a` to `commit-06-b`. | wait_until_current |
| design_gate | pending | Implementation agent must reread Required Reads and confirm trace/audit/impact service, store, replay, redaction and evidence closure. | wait_design |
| scope_gate | pending | Planned changes must be limited to trace/audit/impact application services, formal stores/seams and focused tests. | fix_gate_failure |
| worktree_gate | pending | Initial implementation worktree status recorded; unrelated user changes protected. | fix_gate_failure |
| build_gate | pending | Formatting, workspace/application/infra checks and dependency boundary checks pass or failure is recorded. | fix_gate_failure |
| test_gate | pending | Service-flow-fast trace/audit/impact, redaction targeted, replay regression and VETO targeted checks pass after activation. | fix_gate_failure |
| evidence_gate | pending | Targeted artifacts/reports are optional; any generated report must be run-scoped and raw-artifact-derived. | fix_gate_failure |
| commit_gate | pending | staged scope, commit message, whitespace and required checks have evidence. | fix_gate_failure |
| handoff_gate | pending | commit hash, checks run, tests not run, blockers and next boundary state recorded. | handoff |

---

## Commit Gate

| gate | status | evidence |
|---|---|---|
| staged_scope | pending | Must include only allowed `commit-06-b` trace/audit/impact service, store, test and generated targeted evidence files. |
| unrelated_changes | pending | User-owned unrelated changes must remain unstaged. |
| commit_message_format | pending | Planned subject: `feat(trace): add audit service flows` |
| commit_body_group | pending | Body group must include `Trace service flows:` and `Redaction targeted checks:` from Step 11 mapping. |
| whitespace | pending | `git diff --cached --check` must pass. |
| required_checks | pending | Required Checks table must have pass/not_applicable evidence. |

---

## Handoff Gate

| gate | status | evidence |
|---|---|---|
| committed_hash | pending | Fill after implementation repo commit. |
| committed_message | pending | Fill after implementation repo commit. |
| gates_run | pending | List exact commands and targeted reports. |
| tests_not_run | pending | Must state none or explain; cannot claim report generator/job/query/release suites. |
| remaining_blockers | pending | Must reference blocker table; any blocking design gap prevents handoff. |
| final_conclusion | pending | Must be one of pass / fail / cannot_decide with exact evidence source. |
| user_owned_changes_untouched | pending | List unrelated files left untouched. |

---

## Blockers

| blocker_id | gate | status | blocking_reason | requested_design_closure | next_allowed_action |
|---|---|---|---|---|---|
| BLK-ML-06B-ACTIVATION-001 | activation_gate | planned | Project ledger has not advanced through `commit-06-a`; this future boundary must not be used for implementation yet. | After `commit-06-a` handoff, update project ledger to `commit-06-b` and set this boundary to current. | wait_until_current |

---

## Experience Review

| item | conclusion | action |
|---|---|---|
| future boundary pre-creation | applies current planned-ledger rule | Pre-created future ledgers must use `planned / wait_until_current` and must not authorize code changes until project ledger advances. |
| trace/audit service redaction | existing design-closure rule applies | Trace/audit/impact service, store, replay, redaction and evidence gaps must be fixed in `03/05/06/07` before code; implementation must not invent body-bearing, untraceable or report-generator semantics. |
