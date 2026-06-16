# commit-05-a implementation ledger

| field | value |
|---|---|
| project | L1-identity |
| boundary_id | commit-05-a |
| phase | PH-05 Query / read model / visibility slices |
| design_baseline | `pending-current-design-with-read-subject-access-summary` |
| implementation_repo | `/home/aris/Projects/quantalithos-identity` |
| status | design_updated |
| next_allowed_action | implementation_agent_restart_design_gate |
| current_recovery_point | read subject source closed via `IdentityVisibilityAccessSummary.read_subject_ref`;query visibility, stable lookup, and no-write foundation opening gate |

---

## Required Reads

| document | required_section | status | notes |
|---|---|---|---|
| `standards/document/代码实施台账与门禁规范.md` | 全文,尤其固定文件位置、Design Gate、Scope Gate、Commit Gate、Handoff Gate | pending | 先按台账推进,不得直接改代码。 |
| `standards/document/设计真相源闭环与可落码性标准.md` | 实现不得自行补 schema / port / state / mapper / config / evidence 的闭口规则 | pending | 发现闭口缺口必须暂停并回写 blocker。 |
| `projects/L1-identity/07-实施计划.md` | §3.5、§6、§7、§9、§11 的 commit-05-a boundary、gate、commit body 和 handoff 要求 | pending | 当前 boundary、门禁、提交信息来源。 |
| `projects/L1-identity/design-calibration/07_implementation_plan_step_06_tasks_commit_boundaries.md` | PH-05 / commit-05-a 的 BATCH-05-01~02、scope、经验复核、停审记录 | pending | query foundation、visibility、stable lookup、no-write spy 的正式边界来源。 |
| `projects/L1-identity/design-calibration/07_implementation_plan_step_07_test_acceptance_gates.md` | commit-05-a gate row | pending | `GATE-05` / `GATE-03` subset、TC、EV、report path 来源。 |
| `projects/L1-identity/design-calibration/07_implementation_plan_step_11_commit_review_delivery.md` | commit-05-a commit body grouping | pending | commit message body 分组来源。 |
| `projects/L1-identity/design-calibration/03_ddd_step_06_object_contracts.md` | `MemberSummaryView`、`IdentityVisibilityDecision`、projection/read state、read subject/scope/view lookup 字段闭环 | pending | view ref、visibility scope、read surface 不得由 query 拼接或反推。 |
| `projects/L1-identity/design-calibration/03_ddd_step_07_trait_port_adapter_contracts.md` | read/visibility/projection repository ports、stable lookup、mapper/resolver and fake equivalence requirements | pending | 不新增私有 port、fake-only map 或字符串 lookup 规则。 |
| `projects/L1-identity/design-calibration/03_ddd_step_08_protocol_contracts.md` | query request/response public shell、visibility/degraded/redaction markers、query surface | pending | public DTO 和 marker 输出必须来自正式协议面。 |
| `projects/L1-identity/design-calibration/03_ddd_step_09_function_flows.md` | shared query discipline、query no-write、visibility-first、projection lookup foundation | pending | query 不开写 UoW、不 repair、不 rebuild、不 refresh。 |
| `projects/L1-identity/design-calibration/03_ddd_step_10_state_matrix.md` | read/visibility/projection/reference state surface | pending | stale/degraded/missing/not-visible 状态词表不得漂移。 |
| `projects/L1-identity/design-calibration/03_ddd_step_11_persistence_transaction_consistency.md` | stable lookup indexes、read-only persistence semantics、member summary view lookup | pending | `find_member_summary_view_ref(member_ref, visibility_scope_ref)` 必须读取正式 index。 |
| `projects/L1-identity/design-calibration/03_ddd_step_12_error_recovery.md` | query missing/not-visible/degraded/stale and replay consistency failure rules | pending | 不用错误字符串判断,不得把 missing 当成 create/repair。 |
| `projects/L1-identity/design-calibration/03_ddd_step_13_concurrency_idempotency.md` | query no idempotency reserve / no mutation replay implications | pending | query 不能使用 command duplicate replay 路径补结果。 |
| `projects/L1-identity/design-calibration/03_ddd_step_15_observability_audit.md` | query safe trace/audit/redaction material and no raw body | pending | 可观测材料不得泄漏正文或成为 truth。 |
| `projects/L1-identity/design-calibration/03_ddd_step_16_test_cuts.md` | query visibility-first、no-write、stable lookup、degraded/missing/stale cuts | pending | targeted tests 来源。 |

---

## Allowed Scope

| type | path_or_rule | status |
|---|---|---|
| allowed_crate | `/home/aris/Projects/quantalithos-identity/crates/application` | pending |
| allowed_crate | `/home/aris/Projects/quantalithos-identity/crates/contracts` only if current design already defines missing query public refs/DTO/read markers and code has not caught up | pending |
| allowed_crate | `/home/aris/Projects/quantalithos-identity/crates/domain` only if current design already defines read/visibility helper behavior needed by query foundation | pending |
| allowed_crate | `/home/aris/Projects/quantalithos-identity/crates/infra` only for fake runtime stable lookup and query no-write spy support required by commit-05-a tests | pending |
| allowed_tests | Targeted query foundation, visibility-first, stable lookup, missing lookup, stale/degraded surface, and query no-write tests for `TC-ID-QUERY-015`, related `TC-ID-STATE-001`, and fake lookup cases | pending |
| allowed_reports | `reports/runs/<run_id>/suites/service-flow-fast.md`; write-audit artifact when current implementation boundary can generate them formally | pending |
| forbidden_rule | Do not implement the full 14 query family bodies in this boundary; reserve core/member/trace/audit reads for `commit-05-b` and operations reads for `commit-05-c`. | active |
| forbidden_rule | Do not implement consumer/callback, outbound propagation, operations jobs, API/worker/jobs entry, PH-08 scripts, rebuild/refresh/reconciliation/publish/deliver mutations, or handoff delivery. | active |
| forbidden_rule | Do not write business truth, projection repair, reference refresh, report generation, outbox/handoff mutation, idempotency reserve, stored result, or command side-effect from query path. | active |
| forbidden_rule | Do not store external body, memory original text, embeddings, archive package, audit raw log, adapter response body, or sibling truth. | active |
| forbidden_rule | Do not invent schema, port, state, mapper, config key, artifact JSON field, TC/EV/AC/VETO, stable lookup key, or private fake-only map. | active |
| forbidden_rule | Do not construct view refs, read subject refs, visibility scopes, or projection refs by string parsing, concatenation, timestamp, cursor, digest, or idempotency key. | active |

---

## Required Checks

| check | command_or_evidence | status | notes |
|---|---|---|---|
| format | `cargo fmt --all` | pending | Run in implementation repo if Rust files changed. |
| application compile | `cargo check -p identity-application` | pending | Minimum check for query foundation changes. |
| contracts compile | `cargo check -p identity-contracts` | pending | Required if public query refs/DTOs are touched. |
| domain compile | `cargo check -p identity-domain` | pending | Required if domain read/visibility helpers are touched. |
| infra compile | `cargo check -p identity-infra` | pending | Required if fake runtime / no-write spy / stable lookup support is touched. |
| targeted tests | query visibility-first, stable lookup, missing lookup, stale/degraded, no-write spy tests | pending | Test names must be recorded after implementation. |
| write audit | evidence that query does not open write UoW, reserve idempotency, repair projection/reference/report/outbox/handoff, or write stored result | pending | Required by `GATE-05`. |
| report evidence | `reports/runs/<run_id>/suites/service-flow-fast.md` and write-audit artifact when formal writer exists | pending | If formal writer is unavailable, record not_applicable with source. |
| whitespace | `git diff --check` and `git diff --cached --check` before commit | pending | Required for Commit Gate. |
| staged scope | `git diff --cached --name-only` | pending | Must match allowed scope and exclude user unrelated files. |

---

## Gate Matrix

| gate | status | evidence | next_if_failed |
|---|---|---|---|
| design_gate | ready_for_implementation_recheck | Step 6/7/8/9 now close `IdentityReadSubjectRef` source through `IdentityVisibilityAccessSummary.read_subject_ref`;implementation agent must reread required docs and confirm no remaining schema / port / state / mapper / config / evidence / phase-scope gap. | wait_design |
| scope_gate | pending | `git status --short` and diff scope match Allowed Scope. | fix_gate_failure |
| worktree_gate | pending | Initial implementation worktree status recorded; unrelated user changes protected. | fix_gate_failure |
| build_gate | pending | Required cargo checks pass or failure recorded. | fix_gate_failure |
| test_gate | pending | Targeted query foundation and no-write tests pass or failure recorded. | fix_gate_failure |
| evidence_gate | pending | `GATE-05` and `GATE-03` subset evidence generated when formal writer exists; otherwise record not_applicable with source. | fix_gate_failure |
| commit_gate | pending | staged scope, commit message, whitespace, and required checks have evidence. | fix_gate_failure |
| handoff_gate | pending | commit hash, gates run, tests not run, blockers, next boundary, user changes untouched. | handoff |

---

## Commit Gate

| gate | status | evidence |
|---|---|---|
| staged_scope | pending | Must include only allowed `commit-05-a` implementation files. |
| unrelated_changes | pending | User-owned unrelated changes must remain unstaged. |
| commit_message_format | pending | Planned subject: `feat(identity-application): add query visibility foundation` |
| commit_body_group | pending | Body group must include `Read visibility, stable lookup, and no-write checks:` from Step 11 mapping. |
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
| next_boundary | pending | Expected next boundary: `commit-05-b`. |
| user_owned_changes_untouched | pending | List unrelated files left untouched. |

---

## Blockers

| blocker_id | gate | status | blocking_reason | requested_design_closure | next_allowed_action |
|---|---|---|---|---|---|
| none | not_applicable | not_applicable | No open blocker recorded at ledger creation. | not_applicable | read_docs |
