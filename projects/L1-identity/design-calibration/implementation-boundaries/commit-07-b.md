# commit-07-b implementation ledger

| field | value |
|---|---|
| project | L1-identity |
| boundary_id | commit-07-b |
| phase | PH-07 Operations job / propagation / maintenance slices |
| design_baseline | `current-design-with-commit-07-b-maintenance-job-port-closure` |
| implementation_repo | `/home/aris/Projects/quantalithos-identity` |
| status | ready |
| next_allowed_action | read_docs |
| current_recovery_point | maintenance job family after implementation reported `commit-07-a` complete; exact `commit-07-a` implementation hash was not supplied, so this boundary starts from the design ledger baseline and covers BATCH-07-03~05, `TC-ID-JOB-001~003`, `TC-ID-JOB-008`, related `TC-ID-IDEMP-*`, related `TC-ID-QUERY-*` and no-repair/write-audit evidence |

---

## Required Reads

| document | required_section | status | notes |
|---|---|---|---|
| `standards/document/代码实施台账与门禁规范.md` | 全文,尤其 Design Gate、Scope Gate、Commit Gate、Handoff Gate 和 blocker 回流记录 | pending | 先按台账推进,不得直接改代码。 |
| `standards/document/设计真相源闭环与可落码性标准.md` | no self-invented schema/port/state/mapper/config/evidence, job no-repair, report-only maintenance, stored replay and fake parity rules | pending | 缺 projection cursor、reference bundle version、maintenance target expansion、safe issue/finding 或 report-only surface 时必须暂停。 |
| `projects/L1-identity/07-实施计划.md` | §3.5、§6、§7、§9、§11 的 commit-07-b boundary、gate、commit body 和 handoff 要求 | pending | 当前 boundary、门禁、提交信息来源。 |
| `projects/L1-identity/design-calibration/07_implementation_plan_step_06_tasks_commit_boundaries.md` | PH-07 / commit-07-b 的 BATCH-07-03~05、scope、经验复核、停审记录 | pending | rebuild / refresh / reconciliation maintenance family 的正式边界来源。 |
| `projects/L1-identity/design-calibration/07_implementation_plan_step_07_test_acceptance_gates.md` | commit-07-b gate row | pending | `GATE-08`、`GATE-05` no-repair audit、TC、EV、report path 来源。 |
| `projects/L1-identity/design-calibration/07_implementation_plan_step_11_commit_review_delivery.md` | commit-07-b commit body grouping | pending | commit message body 分组来源。 |
| `projects/L1-identity/design-calibration/03_ddd_step_06_object_contracts.md` | `ProjectionState`, `ReferenceResolutionState`, `ReconciliationPolicy`, `ReconciliationReport`, maintenance target refs, issue/finding refs, job run report assembly and body-free invariants | pending | Maintenance jobs must not repair core identity truth, external truth or projection truth. |
| `projects/L1-identity/design-calibration/03_ddd_step_07_trait_port_adapter_contracts.md` | projection repository, reference state repository, reconciliation report repository, maintenance target expansion, job report repository, idempotency repository and fake parity contracts | pending | Do not add private fake maps, ref-string parsing or repository shortcuts outside formal ports. |
| `projects/L1-identity/design-calibration/03_ddd_step_08_protocol_contracts.md` | maintenance job DTOs and public job report surfaces for rebuild, refresh and reconciliation | pending | Public job output must be body-free and replayable from stored report refs. |
| `projects/L1-identity/design-calibration/03_ddd_step_09_function_flows.md` | `RebuildIdentityProjectionFlow`, `RefreshExternalReferenceStateFlow`, `RunIdentityReconciliationFlow` and shared operations job discipline | pending | This boundary implements maintenance job bodies only; propagation jobs remain `commit-07-c`. |
| `projects/L1-identity/design-calibration/03_ddd_step_10_state_matrix.md` | projection state, reference resolution state, reconciliation report state, maintenance issue/finding disposition and no-repair cross-state audit | pending | State names, owner and priority must not drift. |
| `projects/L1-identity/design-calibration/03_ddd_step_11_persistence_transaction_consistency.md` | projection rebuild versioning, reference bundle versioned save, report-only reconciliation write, stored job report save-before-complete and rollback visibility | pending | Maintenance job partial failure must be visible in stored report without repairing business truth. |
| `projects/L1-identity/design-calibration/03_ddd_step_12_error_recovery.md` | projection unsupported/missing cursor, reference unavailable/unrecognized/failed refresh, reconciliation forbidden material, partial/failed report and safe issue mapping | pending | Failed items must produce safe issue/finding refs, not raw diagnostics. |
| `projects/L1-identity/design-calibration/03_ddd_step_13_concurrency_idempotency.md` | projection rebuild race, reference sidecar bundle version, report ref uniqueness, duplicate job replay and no rerun matrix | pending | Duplicate same digest loads stored report; it must not rebuild, refresh or reconcile again. |
| `projects/L1-identity/design-calibration/03_ddd_step_15_observability_audit.md` | projection/reference/reconciliation maintenance audit cuts, metrics and body-free diagnostics | pending | Observability cannot replace report refs or become repair truth. |
| `projects/L1-identity/design-calibration/03_ddd_step_16_test_cuts.md` | `RebuildIdentityProjection_job`, `RefreshExternalReferenceState_job`, `RunIdentityReconciliation_job`, `cross_state_job_no_truth_repair`, `partial_reconciliation_report_only`, `audit_projection_reference_report_no_truth_repair` | pending | targeted tests 来源。 |

---

## Allowed Scope

| type | path_or_rule | status |
|---|---|---|
| allowed_crate | `/home/aris/Projects/quantalithos-identity/crates/application` | pending |
| allowed_crate | `/home/aris/Projects/quantalithos-identity/crates/contracts` only if current design already defines missing maintenance job DTO/report output refs and code has not caught up | pending |
| allowed_crate | `/home/aris/Projects/quantalithos-identity/crates/domain` only if current design already defines missing projection/reference/report state helpers, no-repair guards or safe issue/finding helpers needed by commit-07-b | pending |
| allowed_crate | `/home/aris/Projects/quantalithos-identity/crates/infra` only for fake projection/reference/report repositories, maintenance target expansion, stored job report replay parity and targeted tests required by commit-07-b | pending |
| allowed_tests | Targeted rebuild projection, refresh external reference state, run identity reconciliation, partial/failed/no-finding report-only, duplicate no-rerun replay, projection rebuild race, reference bundle version, no-repair and body-free issue/finding tests | pending |
| allowed_reports | `reports/runs/<run_id>/suites/operations-replay-core.md`; optional write-audit/no-repair report when formal writer exists | pending |
| forbidden_rule | Do not implement `PublishIdentityOutboxFlow`, `DeliverTraceHandoffFlow` or `RetryIdentityPropagationFailuresFlow`; reserve propagation jobs for `commit-07-c`. | active |
| forbidden_rule | Do not implement job CLI/bin runner, scheduler loop, broker ack/retry/dead-letter loop, API/worker/jobs entry wiring, runtime builder, config binding, PH-08 scripts or release evidence scripts. | active |
| forbidden_rule | Do not repair `GlobalMember`, lifecycle, role/career/memory truth, external source truth, projection truth or accepted outbox/handoff truth from rebuild/refresh/reconciliation jobs. | active |
| forbidden_rule | Do not let query paths trigger rebuild/refresh/reconciliation or save job reports; query no-write remains enforced. | active |
| forbidden_rule | Do not parse maintenance target refs from strings, config names, route params or fake-only maps; use formal maintenance target expansion and typed refs only. | active |
| forbidden_rule | Do not persist raw external body, raw diagnostic dump, adapter response body, provider response, config/env/secret, stack trace, outbound payload body, handoff receipt body, archive package, memory text, embedding or remediation plan in job reports, reconciliation findings, logs or metrics. | active |
| forbidden_rule | Do not invent schema, port, state, mapper, config key, artifact JSON field, TC/EV/AC/VETO, report digest rule, safe issue/finding field, projection cursor source, reference bundle key or private fake-only report map. | active |

---

## Required Checks

| check | command_or_evidence | status | notes |
|---|---|---|---|
| format | `cargo fmt --all` | pending | Run in implementation repo if Rust files changed. |
| application compile | `cargo check -p identity-application` | pending | Minimum check for maintenance job services. |
| contracts compile | `cargo check -p identity-contracts` | pending | Required if maintenance job DTO/report output surfaces are touched. |
| domain compile | `cargo check -p identity-domain` | pending | Required if projection/reference/report state helpers, no-repair guards or issue/finding helpers are touched. |
| infra compile | `cargo check -p identity-infra` | pending | Required if fake projection/reference/report repositories, target expansion or stored report replay parity is touched. |
| targeted tests | rebuild projection job, refresh reference job, reconciliation job, partial/failed/no-finding report-only, duplicate no-rerun replay, projection rebuild race, reference bundle version, no-repair and body-free issue/finding tests | pending | Test names must be recorded after implementation. |
| no-repair audit | evidence that rebuild/refresh/reconcile do not mutate core identity truth, external truth, projection truth as repair, outbox/handoff accepted truth or query surfaces | pending | Required by `GATE-05` no-repair audit and `VETO-ID-002/005`. |
| replay audit | evidence that duplicate maintenance job replay loads stored report and does not re-expand targets, rebuild projections, call resolvers, refresh references, generate a new reconciliation report or reconstruct report from current state | pending | Required by `GATE-08` and related idempotency tests. |
| body-free audit | evidence that job report, reconciliation report/finding, issues, logs and metrics contain only safe refs/markers/counts and no raw diagnostic/external body/secret/adapter response/remediation plan | pending | Required by `EV-ID-JOB-001`, `EV-ID-NFR-001` if degraded sample touched and related redaction checks. |
| report evidence | `reports/runs/<run_id>/suites/operations-replay-core.md` | pending | If a formal writer is unavailable, record not_applicable with source. |
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
| test_gate | pending | Targeted maintenance job tests pass or failure recorded. | fix_gate_failure |
| evidence_gate | pending | `GATE-08` and `GATE-05` no-repair evidence generated when formal writer exists; otherwise record not_applicable with source. | fix_gate_failure |
| commit_gate | pending | staged scope, commit message, whitespace and required checks have evidence. | fix_gate_failure |
| handoff_gate | pending | commit hash, gates run, tests not run, blockers, next boundary and user changes untouched. | handoff |

---

## Commit Gate

| gate | status | evidence |
|---|---|---|
| staged_scope | pending | Must include only allowed `commit-07-b` implementation files. |
| unrelated_changes | pending | User-owned unrelated changes must remain unstaged. |
| commit_message_format | pending | Planned subject: `feat(identity-jobs): add maintenance job family` |
| commit_body_group | pending | Body group must include `Maintenance job family:` from Step 11 mapping. |
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
| next_boundary | pending | Expected next boundary: `commit-07-c`. |
| user_owned_changes_untouched | pending | List unrelated files left untouched. |

---

## Blockers

| blocker_id | gate | status | blocking_reason | requested_design_closure | next_allowed_action |
|---|---|---|---|---|---|
| BLK-ID-07B-LEDGER-001 | design_gate | resolved | Project ledger still pointed to `commit-07-a` and `implementation-boundaries/commit-07-b.md` was missing, so implementation agent could not start the maintenance job family boundary. | Project ledger now advances to `commit-07-b`; this boundary ledger defines required reads, allowed scope, required checks, Commit Gate and Handoff Gate. | read_docs |
| BLK-ID-07B-MAINTENANCE-JOB-PORTS-001 | design_gate | resolved | Projection rebuild lacked formal member-summary scope source; reference refresh resolver returned only `ReferenceResolutionState`; reconciliation target inspection lacked target marker -> typed loaded state context. Implementation could only parse opaque refs, infer sidecars or use fake-only scans. | Step 6/7/9/11/12/13 now define `MemberSummaryProjectionRebuildPlan`, `ExternalReferenceResolutionOutcome`, `IdentityMaintenanceInspectionContext`, `get_member_summary_rebuild_plan(...)`, `load_maintenance_target_inspection_context(...)`, resolver outcome return type and issue mapper methods. Service/fake must copy formal outputs only. | read_docs |

---

## Experience Review

| item | conclusion | action |
|---|---|---|
| BLK-ID-07B-LEDGER-001 | existing reusable memory applies | `MEM-ID-012` already requires design-side next-boundary advancement after implementation handoff. This fix applies it to `commit-07-b` and records that the previous handoff did not supply an exact implementation commit hash. |
| BLK-ID-07B-MAINTENANCE-JOB-PORTS-001 | reusable experience required | Added `MEM-ID-013` to `projects/L1-identity/07-实施计划.md` and updated `standards/document/设计真相源闭环与可落码性标准.md` with maintenance job plan / resolver outcome / target inspection positive/negative examples and pre-boundary checklist. Implementation agent must check this before adding or changing rebuild/refresh/reconciliation maintenance jobs. |
