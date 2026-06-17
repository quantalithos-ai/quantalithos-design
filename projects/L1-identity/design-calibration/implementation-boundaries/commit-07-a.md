# commit-07-a implementation ledger

| field | value |
|---|---|
| project | L1-identity |
| boundary_id | commit-07-a |
| phase | PH-07 Operations job / propagation / maintenance slices |
| design_baseline | `current-design-with-commit-07-a-ledger` |
| implementation_repo | `/home/aris/Projects/quantalithos-identity` |
| status | ready |
| next_allowed_action | read_docs |
| current_recovery_point | job request/report shared surface, job report assembly, stored job report replay and fake parity after implementation reported `commit-06-c` complete; covers BATCH-07-01~02, `TC-ID-JOB-006~008`, `TC-ID-IDEMP-004` and related `TC-ID-CONTRACT-*` |

---

## Required Reads

| document | required_section | status | notes |
|---|---|---|---|
| `standards/document/代码实施台账与门禁规范.md` | 全文,尤其 Design Gate、Scope Gate、Commit Gate、Handoff Gate 和 blocker 回流记录 | pending | 先按台账推进,不得直接改代码。 |
| `standards/document/设计真相源闭环与可落码性标准.md` | stored report replay、job report assembly、entry loop detail surface、machine artifact 和 no self-invented schema/port/state/mapper/config/evidence rules | pending | 缺 job report item refs、stored typed save/get、idempotency context 或 fake parity 时必须暂停。 |
| `projects/L1-identity/07-实施计划.md` | §3.5、§6、§7、§9、§11 的 commit-07-a boundary、gate、commit body 和 handoff 要求 | pending | 当前 boundary、门禁、提交信息来源。 |
| `projects/L1-identity/design-calibration/07_implementation_plan_step_06_tasks_commit_boundaries.md` | PH-07 / commit-07-a 的 BATCH-07-01~02、scope、经验复核、停审记录 | pending | job report + stored replay foundation 的正式边界来源。 |
| `projects/L1-identity/design-calibration/07_implementation_plan_step_07_test_acceptance_gates.md` | commit-07-a gate row | pending | `GATE-08`、`GATE-03` subset、TC、EV、report path 来源。 |
| `projects/L1-identity/design-calibration/07_implementation_plan_step_11_commit_review_delivery.md` | commit-07-a commit body grouping | pending | commit message body 分组来源。 |
| `projects/L1-identity/design-calibration/03_ddd_step_06_object_contracts.md` | `IdentityJobRunReport`, job report state/counts/item refs, stored operation result/report surfaces, body-free issue refs | pending | report 必须保存 replay 所需 refs/counts/issues,不得保存 raw job body/log/adapter response。 |
| `projects/L1-identity/design-calibration/03_ddd_step_07_trait_port_adapter_contracts.md` | stored job report save/get, job report repository, idempotency repository, application facade dispatch, fake parity contracts | pending | 不新增私有 report map、runner-store shortcut 或 fake-only replay shortcut。 |
| `projects/L1-identity/design-calibration/03_ddd_step_08_protocol_contracts.md` | 8.1 shared job envelope and 8.6 operations job protocols: `IdentityJobRequest<T>`, `IdentityJobResponse<T>`, `IdentityJobReportSurface`, `IdentityJobRunDisposition`, job output refs | pending | public job surface and duplicate replay must be reconstructable from stored report surface. |
| `projects/L1-identity/design-calibration/03_ddd_step_09_function_flows.md` | shared operations job discipline, job report assembly, duplicate replay no-rerun and no business truth repair rules | pending | This boundary implements shared skeleton only; actual 6 job bodies remain later boundaries. |
| `projects/L1-identity/design-calibration/03_ddd_step_10_state_matrix.md` | job report result/disposition states, report item failed/partial/retryable/terminal semantics | pending | State names and priority must not drift. |
| `projects/L1-identity/design-calibration/03_ddd_step_11_persistence_transaction_consistency.md` | stored job report transaction order, save-before-idempotency-complete, rollback visibility and fake/durable parity | pending | stored report save failure must not complete idempotency or return job success. |
| `projects/L1-identity/design-calibration/03_ddd_step_12_error_recovery.md` | stored report missing/wrong-kind replay consistency failure, invalid job request, pre-report failure and safe issue mapping | pending | duplicate must not rerun job body to recover missing report. |
| `projects/L1-identity/design-calibration/03_ddd_step_13_concurrency_idempotency.md` | job idempotency key/digest, duplicate report replay, in-flight conflict and no rerun matrix | pending | same key/same digest loads stored report;different digest conflicts. |
| `projects/L1-identity/design-calibration/03_ddd_step_15_observability_audit.md` | operations job report observability, duplicate replay logging and body-free diagnostics | pending | logs/metrics cannot replace stored report or business audit. |
| `projects/L1-identity/design-calibration/03_ddd_step_16_test_cuts.md` | `job_duplicate_report_replay`, `transaction_job_report_same_uow`, `error_stored_replay_missing_wrong_kind`, `idempotency_same_digest_job_report_replay`, `audit_stored_replay_refs_only` | pending | targeted tests 来源。 |

---

## Allowed Scope

| type | path_or_rule | status |
|---|---|---|
| allowed_crate | `/home/aris/Projects/quantalithos-identity/crates/application` | pending |
| allowed_crate | `/home/aris/Projects/quantalithos-identity/crates/contracts` only if current design already defines missing job request/report/output DTOs and code has not caught up | pending |
| allowed_crate | `/home/aris/Projects/quantalithos-identity/crates/domain` only if current design already defines job report state/count/item helpers needed by commit-07-a | pending |
| allowed_crate | `/home/aris/Projects/quantalithos-identity/crates/infra` only for fake stored job report repository, idempotency replay parity, rollback visibility and job report tests required by commit-07-a | pending |
| allowed_tests | Targeted job shared skeleton, report assembly, stored job report save/get, duplicate report replay, save-before-complete, missing/wrong-kind stored report, fake rollback parity and body-free report tests | pending |
| allowed_reports | `reports/runs/<run_id>/suites/operations-replay-core.md`; `reports/runs/<run_id>/suites/entry-worker-job.md` when formal writer exists | pending |
| forbidden_rule | Do not implement `RebuildIdentityProjectionFlow`, `RefreshExternalReferenceStateFlow`, `RunIdentityReconciliationFlow`, `PublishIdentityOutboxFlow`, `DeliverTraceHandoffFlow` or `RetryIdentityPropagationFailuresFlow` job bodies in this boundary. | active |
| forbidden_rule | Do not implement job CLI/bin runner, scheduler loop, broker ack/retry/dead-letter loop, API/worker/jobs entry wiring, runtime builder, config binding, PH-08 scripts or release evidence scripts. | active |
| forbidden_rule | Do not let runner/service direct-scan repositories on duplicate replay; duplicate same key/same digest must load stored result and stored job report surface. | active |
| forbidden_rule | Do not repair core identity truth, projection truth, reference sidecar truth, outbox/handoff state or reconciliation reports from the shared skeleton except formal stored job report/idempotency surfaces required by Step 11/13. | active |
| forbidden_rule | Do not persist raw job input, raw job log, adapter response body, outbound payload body, handoff receipt body, archive package, config/env/secret, stack trace, memory text, embedding or sibling truth in reports/stored replay. | active |
| forbidden_rule | Do not invent schema, port, state, mapper, config key, artifact JSON field, TC/EV/AC/VETO, job item ref field, result kind, report digest rule or private fake-only report map. | active |

---

## Required Checks

| check | command_or_evidence | status | notes |
|---|---|---|---|
| format | `cargo fmt --all` | pending | Run in implementation repo if Rust files changed. |
| application compile | `cargo check -p identity-application` | pending | Minimum check for commit-07-a job service skeleton. |
| contracts compile | `cargo check -p identity-contracts` | pending | Required if job request/report/output DTOs are touched. |
| domain compile | `cargo check -p identity-domain` | pending | Required if job report domain helpers/state are touched. |
| infra compile | `cargo check -p identity-infra` | pending | Required if fake stored job report repository or rollback parity is touched. |
| targeted tests | job report assembly, stored job report save/get, duplicate no-rerun replay, save-before-idempotency-complete, missing/wrong-kind stored report, fake rollback visibility, body-free report tests | pending | Test names must be recorded after implementation. |
| replay audit | evidence that duplicate job replay does not re-list targets, rerun rebuild/refresh/reconcile/publish/deliver/retry body, call publisher/handoff/resolver or reconstruct report from current state | pending | Required by `GATE-08` and `TC-ID-JOB-006~008`. |
| report item refs audit | evidence that stored `IdentityJobRunReport` / public report surface includes item refs/counts/issues needed for replay | pending | Required by `EV-ID-JOB-001`. |
| body-free audit | evidence that stored report, public report, logs and reports do not contain raw job input/log/config/secret/adapter response/payload/receipt/archive/memory body | pending | Required by related contract/redaction checks. |
| report evidence | `reports/runs/<run_id>/suites/operations-replay-core.md`; `reports/runs/<run_id>/suites/entry-worker-job.md` | pending | If a formal writer is unavailable, record not_applicable with source. |
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
| test_gate | pending | Targeted job report/stored replay tests pass or failure recorded. | fix_gate_failure |
| evidence_gate | pending | `GATE-08` and `GATE-03` subset evidence generated when formal writer exists; otherwise record not_applicable with source. | fix_gate_failure |
| commit_gate | pending | staged scope, commit message, whitespace and required checks have evidence. | fix_gate_failure |
| handoff_gate | pending | commit hash, gates run, tests not run, blockers, next boundary and user changes untouched. | handoff |

---

## Commit Gate

| gate | status | evidence |
|---|---|---|
| staged_scope | pending | Must include only allowed `commit-07-a` implementation files. |
| unrelated_changes | pending | User-owned unrelated changes must remain unstaged. |
| commit_message_format | pending | Planned subject: `feat(identity-jobs): add job report replay foundation` |
| commit_body_group | pending | Body group must include `Job report and stored replay foundation:` from Step 11 mapping. |
| whitespace | pending | `git diff --cached --check` must pass. |
| required_checks | pending | Required Checks table must have pass/not_applicable evidence. |

---

## Handoff Gate

| gate | status | evidence |
|---|---|---|
| committed_hash | pending | Fill after commit. |
| committed_message | pending | Fill after commit. |
| gates_run | pending | List exact commands and reports. |
| tests_not_run | pending | Must state none or explain. |
| remaining_blockers | pending | Must reference blocker table. |
| next_boundary | pending | Expected next boundary: `commit-07-b`. |
| user_owned_changes_untouched | pending | List unrelated files left untouched. |

---

## Blockers

| blocker_id | gate | status | blocking_reason | requested_design_closure | next_allowed_action |
|---|---|---|---|---|---|
| BLK-ID-07A-LEDGER-001 | design_gate | resolved | Project ledger still pointed to `commit-06-c` and `implementation-boundaries/commit-07-a.md` was missing, so implementation agent could not start PH-07 job replay foundation. | Project ledger now advances to `commit-07-a`; this boundary ledger defines required reads, allowed scope, required checks, Commit Gate and Handoff Gate. | read_docs |

---

## Experience Review

| item | conclusion | action |
|---|---|---|
| BLK-ID-07A-LEDGER-001 | project reusable memory required | Added `MEM-ID-012` to `projects/L1-identity/07-实施计划.md`: next-boundary ledger advancement is part of implementation handoff closure; if previous implementation handoff lacks exact commit hash, record that fact instead of fabricating one. |
