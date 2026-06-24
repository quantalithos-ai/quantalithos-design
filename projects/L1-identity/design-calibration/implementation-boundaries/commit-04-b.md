# commit-04-b implementation ledger

| field | value |
|---|---|
| project | L1-identity |
| boundary_id | commit-04-b |
| phase | PH-04 Command write path vertical slices |
| design_baseline | `d9f9e71` |
| implementation_repo | `/home/aris/Projects/quantalithos-identity` |
| status | pass |
| next_allowed_action | implement |
| current_recovery_point | role/career/memory command write chain gates passed; implementation may begin within allowed scope |

---

## Required Reads

| document | required_section | status | notes |
|---|---|---|---|
| `standards/document/代码实施台账与门禁规范.md` | 全文,尤其固定文件位置、Design Gate、Scope Gate、Commit Gate、Handoff Gate | pass | 已按固定文件位置、Design/Scope/Worktree Gate 规则复核。 |
| `standards/document/设计真相源闭环与可落码性标准.md` | 实现不得自行补 schema / port / state / mapper / evidence 的闭口规则 | pass | 已按实现阶段闭口规则复核,当前未发现新的设计缺口。 |
| `projects/L1-identity/07-实施计划.md` | §3、§6、§7、§9、§11 与 implementation ledger 补充章节 | pass | 已确认 `commit-04-b` baseline、allowed scope、required checks 与提交门禁。 |
| `projects/L1-identity/design-calibration/07_implementation_plan_step_06_tasks_commit_boundaries.md` | PH-04 / commit-04-b 的 batch、scope、经验复核、停审记录 | pass | 已确认 BATCH-04-03~05 与 body-free/source-ref pattern 边界。 |
| `projects/L1-identity/design-calibration/07_implementation_plan_step_07_test_acceptance_gates.md` | commit-04-b gate row | pass | 已确认 `GATE-04` / `GATE-10`、`TC-ID-CMD-005~010` 与报告路径。 |
| `projects/L1-identity/design-calibration/07_implementation_plan_step_11_commit_review_delivery.md` | commit-04-b commit body grouping | pass | 已确认 body group 为 `Role, career, and memory commands:`。 |
| `projects/L1-identity/design-calibration/03_ddd_step_06_object_contracts.md` | Role capability、career、memory/reference、trace/audit/outbox/stored result related objects | pass | 已复核对象字段、append-only、body-free 与 stored replay shell/envelope 规则。 |
| `projects/L1-identity/design-calibration/03_ddd_step_07_trait_port_adapter_contracts.md` | command write path repositories、sidecar reads、id/clock/UoW/stored result ports | pass | 已确认 role/career/memory 所需正式 port 已闭合,不得新增私有 port。 |
| `projects/L1-identity/design-calibration/03_ddd_step_08_protocol_contracts.md` | role/career/memory command request/response public surface | pass | 已确认三条 command DTO/result、effect envelope 与 body-free 输入输出。 |
| `projects/L1-identity/design-calibration/03_ddd_step_09_function_flows.md` | command 9.1-b role/career/memory accepted/rejected/duplicate/conflict flows | pass | 已确认 accepted side-effect 顺序、duplicate replay 与 no-external-body 规则。 |
| `projects/L1-identity/design-calibration/03_ddd_step_10_state_matrix.md` | role/career/memory/reference related state transitions | pass | 已确认 role/source、career、memory relation 状态迁移与禁止分支。 |
| `projects/L1-identity/design-calibration/03_ddd_step_11_persistence_transaction_consistency.md` | command same-UoW、expected_version、append-only、sidecar persistence | pass | 已确认 expected_version 来源、same-UoW 保存顺序与 append-only 持久化。 |
| `projects/L1-identity/design-calibration/03_ddd_step_12_error_recovery.md` | rejected/retry/conflict/redaction/body-free failure rules | pass | 已确认 rejected/dependency/conflict 与 replay consistency failure 映射。 |
| `projects/L1-identity/design-calibration/03_ddd_step_13_concurrency_idempotency.md` | command duplicate accepted/rejected replay | pass | 已确认 generic stored shell + typed accepted/rejected envelope replay 规则。 |
| `projects/L1-identity/design-calibration/03_ddd_step_15_observability_audit.md` | safe trace/audit/redaction material | pass | 已确认 role/career/memory trace cut 与 redaction safe material 边界。 |
| `projects/L1-identity/design-calibration/03_ddd_step_16_test_cuts.md` | command and redaction test cuts | pass | 已确认 accepted/rejected/duplicate/conflict 最小测试切口。 |

---

## Allowed Scope

| type | path_or_rule | status |
|---|---|---|
| allowed_crate | `/home/aris/Projects/quantalithos-identity/crates/application` | pass |
| allowed_crate | `/home/aris/Projects/quantalithos-identity/crates/domain` only if role/career/memory command helpers require already-defined domain behavior | pass |
| allowed_crate | `/home/aris/Projects/quantalithos-identity/crates/contracts` only if current design already defines missing public refs/DTO surface and code has not caught up | pass |
| allowed_crate | `/home/aris/Projects/quantalithos-identity/crates/infra` only for fake/runtime support required by role/career/memory command tests | pass |
| allowed_tests | Targeted command, idempotency, append-only, body-free, redaction tests for `TC-ID-CMD-005~010`, related `TC-ID-IDEMP-*`, `TC-ID-REDACTION-001~003` | pass |
| allowed_reports | `reports/runs/<run_id>/suites/service-flow-fast.md`; `reports/runs/<run_id>/redaction-check.md` when current implementation boundary can generate them formally | pass |
| forbidden_rule | Do not implement trace handoff command, consumer/callback, outbound propagation, query family, operations jobs, API/worker/jobs entry, or PH-08 scripts in this boundary. | active |
| forbidden_rule | Do not store external body, memory original text, embeddings, archive package, or sibling truth. | active |
| forbidden_rule | Do not invent schema, port, state, mapper, config key, artifact JSON field, TC/EV/AC/VETO, or private fake-only map. | active |
| forbidden_rule | Do not replay duplicate accepted command by re-reading truth or rerunning mutation. | active |

---

## Required Checks

| check | command_or_evidence | status | notes |
|---|---|---|---|
| format | `cargo fmt --all` | pending | Run in implementation repo if Rust files changed. |
| application compile | `cargo check -p identity-application` | pending | Minimum check for command service changes. |
| domain/contracts compile | `cargo check -p identity-domain`; `cargo check -p identity-contracts` | pending | Required if those crates are touched. |
| infra compile | `cargo check -p identity-infra` | pending | Required if fake/runtime support is touched. |
| targeted tests | command role/career/memory accepted/rejected/conflict/duplicate tests | pending | Test names must be recorded after implementation. |
| redaction/body-free scan | current project redaction check or targeted grep/test evidence | pending | Required by GATE-10. |
| whitespace | `git diff --check` and `git diff --cached --check` before commit | pending | Required for Commit Gate. |
| staged scope | `git diff --cached --name-only` | pending | Must match allowed scope and exclude user unrelated files. |

---

## Gate Matrix

| gate | status | evidence | next_if_failed |
|---|---|---|---|
| design_gate | pass | Read all required design sources; baseline `d9f9e71` confirmed against design repo HEAD `2f0bfed`; no new schema / port / state / mapper / config / evidence / phase-scope gap found for `commit-04-b`. | wait_design |
| scope_gate | pass | `git status --short` shows only untracked `.codex/` and `target/`; no tracked touched files yet, so current scope is within `commit-04-b` allowed paths. | fix_gate_failure |
| worktree_gate | pass | Initial worktree recorded before edits: `git status --short` => `?? .codex/`, `?? target/`; no destructive commands used; unrelated user changes remain untouched. | fix_gate_failure |
| build_gate | pending | Required cargo checks pass or failure recorded. | fix_gate_failure |
| test_gate | pending | Targeted command/idempotency/redaction tests pass or failure recorded. | fix_gate_failure |
| evidence_gate | pending | GATE-04/GATE-10 report paths generated when formal writer exists; otherwise record not_applicable with source. | fix_gate_failure |
| commit_gate | pending | staged scope, commit message, whitespace, and required checks have evidence. | fix_gate_failure |
| handoff_gate | pending | commit hash, gates run, tests not run, blockers, next boundary, user changes untouched. | handoff |

---

## Commit Gate

| gate | status | evidence |
|---|---|---|
| staged_scope | pending | Must include only allowed `commit-04-b` implementation files. |
| unrelated_changes | pending | User-owned unrelated changes must remain unstaged. |
| commit_message_format | pending | Planned subject: `feat(identity-application): add role career and memory commands` |
| commit_body_group | pending | Body group must include `Role, career, and memory commands:` from Step 11 mapping. |
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
| next_boundary | pending | Expected next boundary: `commit-04-c`. |
| user_owned_changes_untouched | pending | List unrelated files left untouched. |

---

## Blockers

| blocker_id | gate | status | blocking_reason | requested_design_closure | next_allowed_action |
|---|---|---|---|---|---|
| none | not_applicable | not_applicable | No open blocker after required_reads and Design/Scope/Worktree gates; proceed within `commit-04-b` allowed scope. | not_applicable | implement |
