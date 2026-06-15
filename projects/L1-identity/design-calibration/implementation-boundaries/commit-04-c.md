# commit-04-c implementation ledger

| field | value |
|---|---|
| project | L1-identity |
| boundary_id | commit-04-c |
| phase | PH-04 Command write path vertical slices |
| design_baseline | `2f0bfed` |
| implementation_repo | `/home/aris/Projects/quantalithos-identity` |
| status | pending |
| next_allowed_action | read_docs |
| current_recovery_point | trace handoff command and command side-effect/replay audit opening gate |

---

## Required Reads

| document | required_section | status | notes |
|---|---|---|---|
| `standards/document/代码实施台账与门禁规范.md` | 全文,尤其固定文件位置、Design Gate、Scope Gate、Commit Gate、Handoff Gate | pending | 先按台账推进,不得直接改代码。 |
| `standards/document/设计真相源闭环与可落码性标准.md` | 实现不得自行补 schema / port / state / mapper / config / evidence 的闭口规则 | pending | 发现闭口缺口必须暂停并回写 blocker。 |
| `projects/L1-identity/07-实施计划.md` | §3.5、§6、§7、§9、§11 的 commit-04-c boundary、gate、commit body 和 handoff 要求 | pending | 当前 boundary、门禁、提交信息来源。 |
| `projects/L1-identity/design-calibration/07_implementation_plan_step_06_tasks_commit_boundaries.md` | PH-04 / commit-04-c 的 batch、scope、经验复核、停审记录 | pending | BATCH-04-06~07 的正式边界来源。 |
| `projects/L1-identity/design-calibration/07_implementation_plan_step_07_test_acceptance_gates.md` | commit-04-c gate row | pending | `GATE-04` / `GATE-10` / `GATE-03` subset、TC、EV、report path 来源。 |
| `projects/L1-identity/design-calibration/07_implementation_plan_step_11_commit_review_delivery.md` | commit-04-c commit body grouping | pending | commit message body 分组来源。 |
| `projects/L1-identity/design-calibration/03_ddd_step_06_object_contracts.md` | trace handoff intent、handoff marker、trace/audit/outbox/stored result related objects | pending | 对象字段、non-empty trace refs、pending state、body-free 规则。 |
| `projects/L1-identity/design-calibration/03_ddd_step_07_trait_port_adapter_contracts.md` | trace handoff command repositories、marker mapper、id/clock/UoW/stored result ports | pending | 不新增私有 port 或 marker subject 规则。 |
| `projects/L1-identity/design-calibration/03_ddd_step_08_protocol_contracts.md` | `PrepareTraceHandoff` command request/response public surface | pending | public DTO、effect envelope 与 stored replay 输入。 |
| `projects/L1-identity/design-calibration/03_ddd_step_09_function_flows.md` | command 9.1-c trace handoff accepted/rejected/duplicate/conflict flows and side-effect inventory | pending | pending intent、no-delivery、accepted side-effect 顺序与同 UoW。 |
| `projects/L1-identity/design-calibration/03_ddd_step_10_state_matrix.md` | handoff pending state and command side-effect states | pending | 状态词表不得漂移。 |
| `projects/L1-identity/design-calibration/03_ddd_step_11_persistence_transaction_consistency.md` | command same-UoW、expected_version、handoff marker persistence、stored command result | pending | version/read/save 来源和 same-UoW 保存顺序。 |
| `projects/L1-identity/design-calibration/03_ddd_step_12_error_recovery.md` | rejected/retry/conflict/redaction/body-free/handoff failure rules | pending | error mapping 不解析字符串,不得泄漏 handoff body。 |
| `projects/L1-identity/design-calibration/03_ddd_step_13_concurrency_idempotency.md` | command duplicate accepted/rejected replay and stored result closure | pending | duplicate 不重跑 mutation,stored result 缺失按正式失败口径处理。 |
| `projects/L1-identity/design-calibration/03_ddd_step_15_observability_audit.md` | trace handoff safe trace/audit/redaction material | pending | trace / audit 材料不得泄漏正文。 |
| `projects/L1-identity/design-calibration/03_ddd_step_16_test_cuts.md` | trace handoff command and replay audit test cuts | pending | targeted tests 来源。 |

---

## Allowed Scope

| type | path_or_rule | status |
|---|---|---|
| allowed_crate | `/home/aris/Projects/quantalithos-identity/crates/application` | pending |
| allowed_crate | `/home/aris/Projects/quantalithos-identity/crates/domain` only if trace handoff command helpers require already-defined domain behavior | pending |
| allowed_crate | `/home/aris/Projects/quantalithos-identity/crates/contracts` only if current design already defines missing public refs/DTO surface and code has not caught up | pending |
| allowed_crate | `/home/aris/Projects/quantalithos-identity/crates/infra` only for fake/runtime support required by trace handoff command tests | pending |
| allowed_tests | Targeted command, idempotency, handoff pending, no-delivery, stored replay, redaction/body-free tests for `TC-ID-CMD-011~015`, related `TC-ID-IDEMP-*`, `TC-ID-REDACTION-*` | pending |
| allowed_reports | `reports/runs/<run_id>/suites/service-flow-fast.md`; `reports/runs/<run_id>/redaction-check.md` when current implementation boundary can generate them formally | pending |
| forbidden_rule | Do not implement handoff delivery callback/job, consumer/callback flows, outbound propagation, query family, operations jobs, API/worker/jobs entry, or PH-08 scripts in this boundary. | active |
| forbidden_rule | Do not store external body, memory original text, embeddings, archive package, handoff body, artifact body, or sibling truth. | active |
| forbidden_rule | Do not invent schema, port, state, mapper, config key, artifact JSON field, TC/EV/AC/VETO, or private fake-only map. | active |
| forbidden_rule | Do not replay duplicate accepted command by re-reading truth or rerunning mutation. | active |
| forbidden_rule | Do not perform handoff delivery from the command path; this boundary creates pending intent only. | active |

---

## Required Checks

| check | command_or_evidence | status | notes |
|---|---|---|---|
| format | `cargo fmt --all` | pending | Run in implementation repo if Rust files changed. |
| application compile | `cargo check -p identity-application` | pending | Minimum check for command service changes. |
| domain/contracts compile | `cargo check -p identity-domain`; `cargo check -p identity-contracts` | pending | Required if those crates are touched. |
| infra compile | `cargo check -p identity-infra` | pending | Required if fake/runtime support is touched. |
| targeted tests | trace handoff command accepted/rejected/conflict/duplicate/no-delivery/stored replay tests | pending | Test names must be recorded after implementation. |
| redaction/body-free scan | current project redaction check or targeted grep/test evidence | pending | Required by GATE-10. |
| handoff pending evidence | test or report evidence that command creates pending intent only and does not deliver | pending | Required by commit-04-c boundary. |
| whitespace | `git diff --check` and `git diff --cached --check` before commit | pending | Required for Commit Gate. |
| staged scope | `git diff --cached --name-only` | pending | Must match allowed scope and exclude user unrelated files. |

---

## Gate Matrix

| gate | status | evidence | next_if_failed |
|---|---|---|---|
| design_gate | pending | Read all required design sources and confirm no schema / port / state / mapper / config / evidence / phase-scope gap. | wait_design |
| scope_gate | pending | `git status --short` and diff scope match Allowed Scope. | fix_gate_failure |
| worktree_gate | pending | Initial implementation worktree status recorded; unrelated user changes protected. | fix_gate_failure |
| build_gate | pending | Required cargo checks pass or failure recorded. | fix_gate_failure |
| test_gate | pending | Targeted command/idempotency/redaction/handoff tests pass or failure recorded. | fix_gate_failure |
| evidence_gate | pending | GATE-04/GATE-10/GATE-03 subset report paths generated when formal writer exists; otherwise record not_applicable with source. | fix_gate_failure |
| commit_gate | pending | staged scope, commit message, whitespace, and required checks have evidence. | fix_gate_failure |
| handoff_gate | pending | commit hash, gates run, tests not run, blockers, next boundary, user changes untouched. | handoff |

---

## Commit Gate

| gate | status | evidence |
|---|---|---|
| staged_scope | pending | Must include only allowed `commit-04-c` implementation files. |
| unrelated_changes | pending | User-owned unrelated changes must remain unstaged. |
| commit_message_format | pending | Planned subject: `feat(identity-application): add trace handoff command` |
| commit_body_group | pending | Body group must include `Trace handoff command and effect audit:` from Step 11 mapping. |
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
| next_boundary | pending | Expected next boundary: `commit-05-a`. |
| user_owned_changes_untouched | pending | List unrelated files left untouched. |

---

## Blockers

| blocker_id | gate | status | blocking_reason | requested_design_closure | next_allowed_action |
|---|---|---|---|---|---|
| none | not_applicable | not_applicable | No open blocker recorded at ledger creation. | not_applicable | read_docs |
