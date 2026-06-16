# commit-05-b implementation ledger

| field | value |
|---|---|
| project | L1-identity |
| boundary_id | commit-05-b |
| phase | PH-05 Query / read model / visibility slices |
| design_baseline | `pending-current-design-with-member-summary-missing-freshness-mapper` |
| implementation_repo | `/home/aris/Projects/quantalithos-identity` |
| status | ready |
| next_allowed_action | read_docs |
| current_recovery_point | core truth, member summary, trace and audit query family opening gate after implementation `commit-05-a` at `bc6267a`; restart design gate after member summary missing freshness mapper closure |

---

## Required Reads

| document | required_section | status | notes |
|---|---|---|---|
| `standards/document/代码实施台账与门禁规范.md` | 全文,尤其固定文件位置、Design Gate、Scope Gate、Commit Gate、Handoff Gate | pending | 先按台账推进,不得直接改代码。 |
| `standards/document/设计真相源闭环与可落码性标准.md` | 实现不得自行补 schema / port / state / mapper / config / evidence 的闭口规则 | pending | 发现闭口缺口必须暂停并回写 blocker。 |
| `projects/L1-identity/07-实施计划.md` | §3.5、§6、§7、§9、§11 的 commit-05-b boundary、gate、commit body 和 handoff 要求 | pending | 当前 boundary、门禁、提交信息来源。 |
| `projects/L1-identity/design-calibration/07_implementation_plan_step_06_tasks_commit_boundaries.md` | PH-05 / commit-05-b 的 BATCH-05-03~05、scope、经验复核、停审记录 | pending | core truth、member summary、trace/audit query family 的正式边界来源。 |
| `projects/L1-identity/design-calibration/07_implementation_plan_step_07_test_acceptance_gates.md` | commit-05-b gate row | pending | `GATE-05`、必要时 `GATE-10`、TC、EV、report path 来源。 |
| `projects/L1-identity/design-calibration/07_implementation_plan_step_11_commit_review_delivery.md` | commit-05-b commit body grouping | pending | commit message body 分组来源。 |
| `projects/L1-identity/design-calibration/03_ddd_step_06_object_contracts.md` | core truth/member summary/trace/audit read objects, visibility decision, redaction/degraded markers, `IdentityQueryMaterialDegradationSummary` | pending | output 不得泄漏 existence、raw body 或 sibling truth;loaded material degraded marker 必须来自正式 summary;member summary missing freshness is material degraded,not stale success. |
| `projects/L1-identity/design-calibration/03_ddd_step_07_trait_port_adapter_contracts.md` | core read repository ports, projection/read surface, trace/audit read ports, visibility/access resolver contracts, `IdentityQueryMaterialDegradationMapper` | pending | 不新增私有 port、fake-only map 或字符串 lookup 规则;query 内部 degraded marker 只能复制 mapper 输出;missing freshness uses `member_summary_view_missing_freshness(...)`. |
| `projects/L1-identity/design-calibration/03_ddd_step_08_protocol_contracts.md` | query request/response DTOs for core/member/trace/audit reads, public redaction/degraded surface | pending | public DTO 和 marker 输出必须来自正式协议面。 |
| `projects/L1-identity/design-calibration/03_ddd_step_09_function_flows.md` | Step 9 query flows 9.2-a/b for core truth/member summary/trace/audit reads | pending | visibility-first、stable lookup、query no-write 仍继承 commit-05-a 基座。 |
| `projects/L1-identity/design-calibration/03_ddd_step_10_state_matrix.md` | read/visibility/projection/reference/report state priorities used by core read outputs | pending | stale/degraded/missing/not-visible 状态词表不得漂移。 |
| `projects/L1-identity/design-calibration/03_ddd_step_11_persistence_transaction_consistency.md` | stable lookup indexes and read-only persistence semantics for member summary and trace/audit reads | pending | query 不 repair projection/reference/report/outbox/handoff。 |
| `projects/L1-identity/design-calibration/03_ddd_step_12_error_recovery.md` | query missing/not-visible/degraded/stale, redaction and replay consistency failure rules | pending | missing/not-visible 不得泄漏 existence;partial/mismatch/unsafe material degraded 必须带 mapper marker。 |
| `projects/L1-identity/design-calibration/03_ddd_step_13_concurrency_idempotency.md` | query no idempotency reserve / no mutation replay implications | pending | query 不能使用 command duplicate replay 路径补结果。 |
| `projects/L1-identity/design-calibration/03_ddd_step_15_observability_audit.md` | trace/audit output redaction and safe observability material | pending | raw audit/trace body 不得泄漏。 |
| `projects/L1-identity/design-calibration/03_ddd_step_16_test_cuts.md` | core/member/trace/audit query cuts, no-write and redaction cuts | pending | targeted tests 来源。 |

---

## Allowed Scope

| type | path_or_rule | status |
|---|---|---|
| allowed_crate | `/home/aris/Projects/quantalithos-identity/crates/application` | pending |
| allowed_crate | `/home/aris/Projects/quantalithos-identity/crates/contracts` only if current design already defines missing query public refs/DTO/read markers and code has not caught up | pending |
| allowed_crate | `/home/aris/Projects/quantalithos-identity/crates/domain` only if current design already defines read/visibility/redaction helper behavior needed by commit-05-b query family | pending |
| allowed_crate | `/home/aris/Projects/quantalithos-identity/crates/infra` only for fake runtime read fixtures, stable lookup and query no-write spy support required by commit-05-b tests | pending |
| allowed_tests | Targeted core truth, member summary, trace/audit, visibility-first, missing/not-visible, degraded/stale, redaction and no-write tests for `TC-ID-QUERY-001~011` and `TC-ID-QUERY-015` | pending |
| allowed_reports | `reports/runs/<run_id>/suites/service-flow-fast.md`; optional `reports/runs/<run_id>/redaction-check.md` if output/log redaction is touched and formal writer exists | pending |
| forbidden_rule | Do not implement maintenance/report/outbox/handoff operations read family in this boundary; reserve operations reads for `commit-05-c`. | active |
| forbidden_rule | Do not implement consumer/callback, outbound propagation, operations jobs, API/worker/jobs entry, PH-08 scripts, rebuild/refresh/reconciliation/publish/deliver mutations, or handoff delivery. | active |
| forbidden_rule | Do not write business truth, projection repair, reference refresh, report generation, outbox/handoff mutation, idempotency reserve, stored result, or command side-effect from query path. | active |
| forbidden_rule | Do not leak missing/not-visible existence, trace raw body, audit raw body, external body, memory original text, embeddings, archive package, adapter response body, or sibling truth. | active |
| forbidden_rule | Do not invent schema, port, state, mapper, config key, artifact JSON field, TC/EV/AC/VETO, stable lookup key, or private fake-only map. | active |
| forbidden_rule | Do not construct view refs, read subject refs, visibility scopes, trace/audit subjects, or projection refs by string parsing, concatenation, timestamp, cursor, digest, idempotency key, or route param. | active |

---

## Required Checks

| check | command_or_evidence | status | notes |
|---|---|---|---|
| format | `cargo fmt --all` | pending | Run in implementation repo if Rust files changed. |
| application compile | `cargo check -p identity-application` | pending | Minimum check for commit-05-b query family changes. |
| contracts compile | `cargo check -p identity-contracts` | pending | Required if public query refs/DTOs are touched. |
| domain compile | `cargo check -p identity-domain` | pending | Required if domain read/visibility/redaction helpers are touched. |
| infra compile | `cargo check -p identity-infra` | pending | Required if fake runtime / no-write spy / stable lookup support is touched. |
| targeted tests | core truth, member summary, trace/audit, missing/not-visible, degraded/stale, redaction, no-write tests | pending | Test names must be recorded after implementation. |
| write audit | evidence that query does not open write UoW, reserve idempotency, repair projection/reference/report/outbox/handoff, or write stored result | pending | Required by `GATE-05`. |
| redaction audit | evidence that trace/audit output does not leak raw body or restricted data when `GATE-10` is applicable | pending | Required if output/log redaction is touched. |
| report evidence | `reports/runs/<run_id>/suites/service-flow-fast.md`; optional redaction report when formal writer exists | pending | If formal writer is unavailable, record not_applicable with source. |
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
| test_gate | pending | Targeted query family and no-write tests pass or failure recorded. | fix_gate_failure |
| evidence_gate | pending | `GATE-05` and optional `GATE-10` evidence generated when formal writer exists; otherwise record not_applicable with source. | fix_gate_failure |
| commit_gate | pending | staged scope, commit message, whitespace, and required checks have evidence. | fix_gate_failure |
| handoff_gate | pending | commit hash, gates run, tests not run, blockers, next boundary, user changes untouched. | handoff |

---

## Commit Gate

| gate | status | evidence |
|---|---|---|
| staged_scope | pending | Must include only allowed `commit-05-b` implementation files. |
| unrelated_changes | pending | User-owned unrelated changes must remain unstaged. |
| commit_message_format | pending | Planned subject: `feat(identity-application): add core identity read queries` |
| commit_body_group | pending | Body group must include `Core identity, member, trace, and audit reads:` from Step 11 mapping. |
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
| next_boundary | pending | Expected next boundary: `commit-05-c`. |
| user_owned_changes_untouched | pending | List unrelated files left untouched. |

---

## Blockers

| blocker_id | gate | status | blocking_reason | requested_design_closure | next_allowed_action |
|---|---|---|---|---|---|
| BLK-ID-05B-DEGRADED-MARKER-001 | design_gate | resolved | Degraded/StaleVisible query branches for loaded view/trace/audit material missing,owner/scope/subject mismatch,forbidden material or partial item missing had no formal marker carrier. | Step 6 now defines `IdentityQueryMaterialDegradationSummary`;Step 7 defines `IdentityQueryMaterialDegradationMapper`;Step 8/9/10/12 and formal `03` require service to copy mapper markers. | read_docs |
| BLK-ID-05B-MISSING-FRESHNESS-001 | design_gate | resolved | `ReadMemberSummaryFlow` loaded stale/degraded `MemberSummaryView` can lack `projection_freshness_ref`, but service cannot synthesize degraded marker or read projection state. | Step 7 adds `member_summary_view_missing_freshness(...)`;Step 6/8/9/10/12 and formal `03` require this branch to return `Degraded` with mapper summary and no projection-state read. | read_docs |
