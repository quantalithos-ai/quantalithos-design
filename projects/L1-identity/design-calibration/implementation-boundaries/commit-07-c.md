# commit-07-c implementation ledger

| field | value |
|---|---|
| project | L1-identity |
| boundary_id | commit-07-c |
| phase | PH-07 Operations job / propagation / maintenance slices |
| design_baseline | `current-design-with-commit-07-c-active-ledger` |
| implementation_repo | `/home/aris/Projects/quantalithos-identity` |
| status | implemented |
| next_allowed_action | handoff_complete |
| current_recovery_point | propagation job family boundary completed by implementation commits `9bd5dc0` and `75ca2ee`; project ledger advances to `commit-08-a` |

---

## Required Reads

| document | required_section | status | notes |
|---|---|---|---|
| `standards/document/代码实施台账与门禁规范.md` | Design Gate、Scope Gate、Commit Gate、Handoff Gate 和 blocker 回流记录 | pending | 项目级台账当前已推进到 `commit-07-c`;仍须先读台账再改代码。 |
| `standards/document/设计真相源闭环与可落码性标准.md` | no self-invented schema/port/state/mapper/config/evidence, propagation outcome, body-free adapter and terminal retry rules | pending | 缺 publisher/handoff outcome、retry target、terminal guard 或 evidence schema 时必须暂停。 |
| `projects/L1-identity/07-实施计划.md` | §3.5、§6、§7、§9、§11 的 `commit-07-c` boundary、gate、commit body 和 handoff 要求 | pending | 当前 boundary、门禁、提交信息来源。 |
| `projects/L1-identity/design-calibration/07_implementation_plan_step_06_tasks_commit_boundaries.md` | PH-07 / `commit-07-c` 的 BATCH-07-06~08、scope、经验复核、停审记录 | pending | publish / deliver / retry propagation family 的正式边界来源。 |
| `projects/L1-identity/design-calibration/07_implementation_plan_step_07_test_acceptance_gates.md` | `commit-07-c` gate row | pending | `GATE-07`、`GATE-08`、必要时 `GATE-10`、TC、EV、report path 来源。 |
| `projects/L1-identity/design-calibration/07_implementation_plan_step_11_commit_review_delivery.md` | `commit-07-c` commit body grouping | pending | commit message body 分组来源。 |
| `projects/L1-identity/design-calibration/03_ddd_step_06_object_contracts.md` | outbox record, handoff intent, propagation outcome, retry marker, safe issue/report and body-free invariants | pending | Propagation jobs must not rebuild accepted truth or store adapter payload/body. |
| `projects/L1-identity/design-calibration/03_ddd_step_07_trait_port_adapter_contracts.md` | publisher, handoff, retry target expansion, outbox/handoff repositories, job report repository and fake parity contracts | pending | Do not add private fake maps, raw topic strings or adapter-specific outcome parsing outside formal ports. |
| `projects/L1-identity/design-calibration/03_ddd_step_08_protocol_contracts.md` | publish, deliver, retry job DTOs and public job report surfaces | pending | Public output must be body-free and replayable from stored report refs. |
| `projects/L1-identity/design-calibration/03_ddd_step_09_function_flows.md` | `PublishIdentityOutboxFlow`, `DeliverTraceHandoffFlow`, `RetryIdentityPropagationFailuresFlow` and shared operations job discipline | pending | This boundary implements propagation job bodies only; entry runner remains PH-08. |
| `projects/L1-identity/design-calibration/03_ddd_step_10_state_matrix.md` | outbox publish state, handoff delivery state, retryable/terminal state and cross-state transition guard | pending | State names, owner and terminal retry priority must not drift. |
| `projects/L1-identity/design-calibration/03_ddd_step_11_persistence_transaction_consistency.md` | outbox/handoff versioned updates, stored job report save-before-complete and rollback visibility | pending | Adapter failure must not roll back accepted command/consumer truth. |
| `projects/L1-identity/design-calibration/03_ddd_step_12_error_recovery.md` | publisher failure classification, handoff delivery failure, retry exhaustion, terminal guard and safe issue mapping | pending | Failed items must produce safe refs/markers, not raw diagnostics. |
| `projects/L1-identity/design-calibration/03_ddd_step_13_concurrency_idempotency.md` | duplicate job replay, concurrent publish/deliver/retry, stored report replay and terminal conflict matrix | pending | Duplicate same digest loads stored report and must not re-call adapters. |
| `projects/L1-identity/design-calibration/03_ddd_step_15_observability_audit.md` | propagation audit cuts, metrics and body-free diagnostics | pending | Observability cannot leak adapter response body, payload body or handoff receipt body. |
| `projects/L1-identity/design-calibration/03_ddd_step_16_test_cuts.md` | publish outbox, deliver trace handoff, retry propagation failures and terminal retry cuts | pending | targeted tests 来源。 |

---

## Allowed Scope

| type | path_or_rule | status |
|---|---|---|
| allowed_crate | `/home/aris/Projects/quantalithos-identity/crates/application` for propagation job services and shared job orchestration required by `commit-07-c` | pending |
| allowed_crate | `/home/aris/Projects/quantalithos-identity/crates/contracts` only if current design already defines missing propagation job DTO/report output refs and code has not caught up | pending |
| allowed_crate | `/home/aris/Projects/quantalithos-identity/crates/domain` only if current design already defines missing outbox/handoff state helpers, retry guards or safe issue helpers needed by `commit-07-c` | pending |
| allowed_crate | `/home/aris/Projects/quantalithos-identity/crates/infra` only for fake publisher/handoff adapters, outbox/handoff repositories, retry target expansion, stored job report replay parity and targeted tests required by `commit-07-c` | pending |
| allowed_tests | Targeted publish outbox, deliver trace handoff, retry propagation failures, terminal retry guard, adapter failure classification, duplicate no-rerun replay and body-free report tests | pending |
| allowed_reports | `reports/runs/<run_id>/suites/operations-replay-core.md`; optional `reports/runs/<run_id>/redaction-check.md` if payload/report output is touched | pending |
| forbidden_rule | Do not implement API/worker/jobs entry wiring, job binary argument schema, scheduler loop, broker ack/retry/dead-letter loop, runtime builder, config binding, PH-08 scripts or release evidence scripts. | active |
| forbidden_rule | Do not change maintenance job semantics from `commit-07-b` or repair `GlobalMember`, lifecycle, role/career/memory truth, external source truth, projection truth or reconciliation truth from propagation jobs. | active |
| forbidden_rule | Do not persist raw outbound payload body, adapter request/response body, raw diagnostic dump, config/env/secret, stack trace, handoff receipt body, archive package, memory text, embedding or remediation plan. | active |
| forbidden_rule | Do not synthesize publisher outcome, handoff outcome, retryability, terminal state, topic key, trace subject, payload marker or report item refs from strings or fake-only maps. | active |
| forbidden_rule | Do not invent schema, port, state, mapper, config key, artifact JSON field, TC/EV/AC/VETO, report digest rule, retry marker or private fake-only propagation map. | active |

---

## Required Checks

| check | command_or_evidence | status | notes |
|---|---|---|---|
| format | `cargo fmt --all` | pending | Run in implementation repo if Rust files changed. |
| application compile | `cargo check -p identity-application` | pending | Minimum check for propagation job services. |
| contracts compile | `cargo check -p identity-contracts` | pending | Required if propagation job DTO/report output surfaces are touched. |
| domain compile | `cargo check -p identity-domain` | pending | Required if outbox/handoff state helpers, retry guards or issue helpers are touched. |
| infra compile | `cargo check -p identity-infra` | pending | Required if fake publisher/handoff adapters, repositories or stored report replay parity is touched. |
| targeted tests | publish outbox job, deliver trace handoff job, retry propagation failures job, terminal retry guard, duplicate no-rerun replay and adapter failure classification tests | pending | Test names must be recorded after implementation. |
| transition audit | evidence that Published/Delivered/Failed/Retryable/Terminal transitions follow Step 10 and do not roll back accepted truth | pending | Required by `GATE-07`, `GATE-08` and `VETO-ID-005`. |
| replay audit | evidence that duplicate propagation job replay loads stored report and does not re-list targets, re-call adapters or rebuild report from current state | pending | Required by `GATE-08` and related idempotency tests. |
| body-free audit | evidence that job report, safe issues, logs and metrics contain only safe refs/markers/counts and no raw payload/adapter/receipt material | pending | Required by `GATE-10` if payload/report output is touched. |
| report evidence | `reports/runs/<run_id>/suites/operations-replay-core.md`; optional `reports/runs/<run_id>/redaction-check.md` | pending | If a formal writer is unavailable, record not_applicable with source. |
| whitespace | `git diff --check` and `git diff --cached --check` before commit | pending | Required for Commit Gate. |
| staged scope | `git diff --cached --name-only` | pending | Must match allowed scope and exclude user unrelated files. |

---

## Gate Matrix

| gate | status | evidence | next_if_failed |
|---|---|---|---|
| design_gate | pending | Implementation agent must reread required docs and confirm no remaining schema / port / state / mapper / config / evidence / phase-scope gap. | wait_design |
| scope_gate | pending | `git status --short` and diff scope match Allowed Scope. | fix_gate_failure |
| worktree_gate | pending | Initial implementation worktree status recorded; unrelated user changes protected. | fix_gate_failure |
| build_gate | pending | Required cargo checks pass or failure recorded. | fix_gate_failure |
| test_gate | pending | Targeted propagation job tests pass or failure recorded. | fix_gate_failure |
| evidence_gate | pending | `GATE-07`, `GATE-08` and optional `GATE-10` evidence generated when formal writer exists; otherwise record not_applicable with source. | fix_gate_failure |
| commit_gate | pending | staged scope, commit message, whitespace and required checks have evidence. | fix_gate_failure |
| handoff_gate | pending | commit hash, gates run, tests not run, blockers, next boundary and user changes untouched. | handoff |

---

## Commit Gate

| gate | status | evidence |
|---|---|---|
| staged_scope | pending | Must include only allowed `commit-07-c` implementation files. |
| unrelated_changes | pending | User-owned unrelated changes must remain unstaged. |
| commit_message_format | pending | Planned subject: `feat(identity-jobs): add propagation job family` |
| commit_body_group | pending | Body group must include `Propagation job family:` from Step 11 mapping. |
| whitespace | pending | `git diff --cached --check` must pass. |
| required_checks | pending | Required Checks table must have pass/not_applicable evidence. |

---

## Handoff Gate

| gate | status | evidence |
|---|---|---|
| committed_hash | pass | Implementation handoff records code commit `9bd5dc0` and run evidence commit `75ca2ee`. |
| committed_message | pass | `9bd5dc0 test(identity-jobs): add propagation retryable coverage`;`75ca2ee test(identity-jobs): add commit-07-c run evidence`. |
| gates_run | pass | Implementation handoff states commit-07-c code and run evidence completed; detailed command/report evidence remains in the implementation repo artifacts and reports. |
| tests_not_run | pass | No omitted tests were reported in the implementation handoff. |
| remaining_blockers | pass | No remaining `commit-07-c` design blocker in this handoff; the only reported blocker was project ledger advancement to `commit-08-a`. |
| next_boundary | pass | Project ledger advances to `commit-08-a`. |
| user_owned_changes_untouched | pass | Implementation handoff reported only untracked `.codex/` and `target/` left untouched. |

---

## Blockers

| blocker_id | gate | status | blocking_reason | requested_design_closure | next_allowed_action |
|---|---|---|---|---|---|
| BLK-ID-07C-LEDGER-001 | design_gate | resolved | `implementation-boundaries/commit-07-c.md` was missing while formal Step 6/7/11 already defined `commit-07-c`; implementation would block after `commit-07-b` handoff. | This boundary ledger defines required reads, allowed scope, required checks, Commit Gate and Handoff Gate, and the project ledger now advances to `commit-07-c`. | read_docs |

---

## Experience Review

| item | conclusion | action |
|---|---|---|
| commit-07-c handoff to commit-08-a | existing reusable memory applies | `MEM-ID-012` requires next-boundary advancement after implementation handoff. This fix advances the project ledger after `commit-07-c` completed at `9bd5dc0` / `75ca2ee`; no new standard rule is needed. |
