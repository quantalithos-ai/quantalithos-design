# commit-04-b implementation ledger

| field | value |
|---|---|
| project | L1-identity |
| boundary_id | commit-04-b |
| phase | PH-04 Command write path vertical slices |
| design_baseline | `d9f9e71` |
| implementation_repo | `/home/aris/Projects/quantalithos-identity` |
| status | pending |
| next_allowed_action | read_docs |
| current_recovery_point | role/career/memory command write chain开工门禁 |

---

## Required Reads

| document | required_section | status | notes |
|---|---|---|---|
| `standards/document/代码实施台账与门禁规范.md` | 全文,尤其固定文件位置、Design Gate、Scope Gate、Commit Gate、Handoff Gate | pending | 先按台账推进,不得直接改代码。 |
| `standards/document/设计真相源闭环与可落码性标准.md` | 实现不得自行补 schema / port / state / mapper / evidence 的闭口规则 | pending | 发现闭口缺口必须暂停。 |
| `projects/L1-identity/07-实施计划.md` | §3、§6、§7、§9、§11 与 implementation ledger 补充章节 | pending | 当前 boundary、门禁、提交信息来源。 |
| `projects/L1-identity/design-calibration/07_implementation_plan_step_06_tasks_commit_boundaries.md` | PH-04 / commit-04-b 的 batch、scope、经验复核、停审记录 | pending | BATCH-04-03~05 的正式边界来源。 |
| `projects/L1-identity/design-calibration/07_implementation_plan_step_07_test_acceptance_gates.md` | commit-04-b gate row | pending | GATE-04 / GATE-10、TC、EV、report path 来源。 |
| `projects/L1-identity/design-calibration/07_implementation_plan_step_11_commit_review_delivery.md` | commit-04-b commit body grouping | pending | commit message body 分组来源。 |
| `projects/L1-identity/design-calibration/03_ddd_step_06_object_contracts.md` | Role capability、career、memory/reference、trace/audit/outbox/stored result related objects | pending | 字段、不变量、body-free 规则。 |
| `projects/L1-identity/design-calibration/03_ddd_step_07_trait_port_adapter_contracts.md` | command write path repositories、sidecar reads、id/clock/UoW/stored result ports | pending | 不新增私有 port。 |
| `projects/L1-identity/design-calibration/03_ddd_step_08_protocol_contracts.md` | role/career/memory command request/response public surface | pending | public DTO 与 stored replay 输入。 |
| `projects/L1-identity/design-calibration/03_ddd_step_09_function_flows.md` | command 9.1-b role/career/memory accepted/rejected/duplicate/conflict flows | pending | side-effect 顺序与同 UoW。 |
| `projects/L1-identity/design-calibration/03_ddd_step_10_state_matrix.md` | role/career/memory/reference related state transitions | pending | 状态词表不得漂移。 |
| `projects/L1-identity/design-calibration/03_ddd_step_11_persistence_transaction_consistency.md` | command same-UoW、expected_version、append-only、sidecar persistence | pending | version/read/save 来源。 |
| `projects/L1-identity/design-calibration/03_ddd_step_12_error_recovery.md` | rejected/retry/conflict/redaction/body-free failure rules | pending | error mapping 不解析字符串。 |
| `projects/L1-identity/design-calibration/03_ddd_step_13_concurrency_idempotency.md` | command duplicate accepted/rejected replay | pending | duplicate 不重跑 mutation。 |
| `projects/L1-identity/design-calibration/03_ddd_step_15_observability_audit.md` | safe trace/audit/redaction material | pending | 观测材料不得泄漏正文。 |
| `projects/L1-identity/design-calibration/03_ddd_step_16_test_cuts.md` | command and redaction test cuts | pending | targeted tests 来源。 |

---

## Allowed Scope

| type | path_or_rule | status |
|---|---|---|
| allowed_crate | `/home/aris/Projects/quantalithos-identity/crates/application` | pending |
| allowed_crate | `/home/aris/Projects/quantalithos-identity/crates/domain` only if role/career/memory command helpers require already-defined domain behavior | pending |
| allowed_crate | `/home/aris/Projects/quantalithos-identity/crates/contracts` only if current design already defines missing public refs/DTO surface and code has not caught up | pending |
| allowed_crate | `/home/aris/Projects/quantalithos-identity/crates/infra` only for fake/runtime support required by role/career/memory command tests | pending |
| allowed_tests | Targeted command, idempotency, append-only, body-free, redaction tests for `TC-ID-CMD-005~010`, related `TC-ID-IDEMP-*`, `TC-ID-REDACTION-001~003` | pending |
| allowed_reports | `reports/runs/<run_id>/suites/service-flow-fast.md`; `reports/runs/<run_id>/redaction-check.md` when current implementation boundary can generate them formally | pending |
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
| design_gate | pending | Read all required design sources and confirm no schema / port / state / mapper / evidence gap. | wait_design |
| scope_gate | pending | `git status --short` and diff scope match Allowed Scope. | fix_gate_failure |
| worktree_gate | pending | Initial implementation worktree status recorded; unrelated user changes protected. | fix_gate_failure |
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
| none | not_applicable | not_applicable | No open blocker recorded at ledger creation. | not_applicable | read_docs |
