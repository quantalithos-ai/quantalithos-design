# commit-06-b implementation ledger

| field | value |
|---|---|
| project | L1-identity |
| boundary_id | commit-06-b |
| phase | PH-06 Inbound / callback / outbound material slices |
| design_baseline | `current-design-with-commit-06-b-ledger` |
| implementation_repo | `/home/aris/Projects/quantalithos-identity` |
| status | ready |
| next_allowed_action | read_docs |
| current_recovery_point | inbound/callback mutation flows after implementation `commit-06-a` code commit `b7fa598` and evidence commit `67335fc`; covers BATCH-06-03~05, `TC-ID-CONSUMER-001~006`, related `TC-ID-IDEMP-*` and related `TC-ID-REDACTION-*` |

---

## Required Reads

| document | required_section | status | notes |
|---|---|---|---|
| `standards/document/代码实施台账与门禁规范.md` | 全文,尤其 Design Gate、Scope Gate、Commit Gate、Handoff Gate 和 blocker 回流记录 | pending | 先按台账推进,不得直接改代码。 |
| `standards/document/设计真相源闭环与可落码性标准.md` | 实现不得自行补 schema / port / state / mapper / config / evidence 的闭口规则;implementation ledger 规则 | pending | 缺 mapper、state、target lookup 或 receipt replay surface 时必须暂停。 |
| `projects/L1-identity/07-实施计划.md` | §3.5、§6、§7、§9、§11 的 commit-06-b boundary、gate、commit body 和 handoff 要求 | pending | 当前 boundary、门禁、提交信息来源。 |
| `projects/L1-identity/design-calibration/07_implementation_plan_step_06_tasks_commit_boundaries.md` | PH-06 / commit-06-b 的 BATCH-06-03~05、scope、经验复核、停审记录 | pending | role/work/memory/archive/trace consumer/callback flow 的正式边界来源。 |
| `projects/L1-identity/design-calibration/07_implementation_plan_step_07_test_acceptance_gates.md` | commit-06-b gate row | pending | `GATE-06`、`GATE-10`、`GATE-03` subset、TC、EV、report path 来源。 |
| `projects/L1-identity/design-calibration/07_implementation_plan_step_11_commit_review_delivery.md` | commit-06-b commit body grouping | pending | commit message body 分组来源。 |
| `projects/L1-identity/design-calibration/03_ddd_step_06_object_contracts.md` | role capability source snapshot, career record, memory reference state, trace handoff intent, callback receipt, safe issue markers and body-free invariants | pending | accepted mutation 只能保存 identity-owned truth / marker / typed receipt,不得保存外部正文。 |
| `projects/L1-identity/design-calibration/03_ddd_step_07_trait_port_adapter_contracts.md` | role/career/memory repositories, reference sidecar and typed version, marker subject mapper, idempotency repository, stored consumer/callback receipt save/get, UoW cursors and fake parity contracts | pending | 不新增私有 target lookup、marker trace subject、sidecar version 或 fake-only replay shortcut。 |
| `projects/L1-identity/design-calibration/03_ddd_step_08_protocol_contracts.md` | `RoleCapabilitySourceChangedPayload`, `WorkParticipationAcceptedPayload`, `MemoryReferenceSourceStateChangedPayload`, `ArchiveHandoffResultPayload`, `TraceHandoffResultPayload`, `IdentityConsumerReceipt` and callback receipt shell | pending | public DTO、receipt kind、issue surface 和 outbox refs 必须来自正式协议面。 |
| `projects/L1-identity/design-calibration/03_ddd_step_09_function_flows.md` | shared consumer/callback discipline plus `HandleRoleCapabilitySourceChangedFlow`, `HandleWorkParticipationAcceptedFlow`, `HandleMemoryReferenceSourceStateChangedFlow`, `HandleArchiveHandoffResultFlow`, `HandleTraceHandoffResultFlow` | pending | 本 boundary 只落五条 consumer/callback mutation flow;outbound material factory 留 `commit-06-c`。 |
| `projects/L1-identity/design-calibration/03_ddd_step_10_state_matrix.md` | role source, career, memory reference, handoff, stored receipt and duplicate replay state priority | pending | accepted/delayed/quarantined/rejected/noop 状态词和优先级不得漂移。 |
| `projects/L1-identity/design-calibration/03_ddd_step_11_persistence_transaction_consistency.md` | consumer/callback transaction order, reference marker cursor, typed sidecar version, receipt envelope, stored shell and rollback visibility | pending | receipt envelope and stored shell must be saved before idempotency complete in the same UoW. |
| `projects/L1-identity/design-calibration/03_ddd_step_12_error_recovery.md` | missing target no-create, target mismatch, unsupported/delayed/quarantined/noop/rejected mapping, replay consistency failure and safe issue outcomes | pending | missing member/relation/handoff intent must not be implicitly created. |
| `projects/L1-identity/design-calibration/03_ddd_step_13_concurrency_idempotency.md` | consumer/callback idempotency key/digest, duplicate replay and conflict matrix | pending | duplicate same digest loads typed receipt only;different digest conflicts;no payload reparse. |
| `projects/L1-identity/design-calibration/03_ddd_step_15_observability_audit.md` | consumer/callback receipt/event log redaction and safe marker diagnostics | pending | logs/metrics must not leak raw payload, archive package or receipt body. |
| `projects/L1-identity/design-calibration/03_ddd_step_16_test_cuts.md` | consumer/callback accepted, delayed/quarantined, duplicate replay, missing target no-create and body-free test cuts | pending | targeted tests 来源。 |

---

## Allowed Scope

| type | path_or_rule | status |
|---|---|---|
| allowed_crate | `/home/aris/Projects/quantalithos-identity/crates/application` | pending |
| allowed_crate | `/home/aris/Projects/quantalithos-identity/crates/contracts` only if current design already defines missing inbound/callback payload, receipt or marker DTOs and code has not caught up | pending |
| allowed_crate | `/home/aris/Projects/quantalithos-identity/crates/domain` only if current design already defines state helpers or guards needed by commit-06-b flows | pending |
| allowed_crate | `/home/aris/Projects/quantalithos-identity/crates/infra` only for fake runtime repositories, resolvers, target lookup, reference sidecar, idempotency and stored receipt replay parity required by commit-06-b tests | pending |
| allowed_tests | Targeted tests for role source changed, work participation accepted, memory source state changed, archive handoff callback, trace handoff callback, duplicate replay, missing target no-create, callback target mismatch, redaction and body-free receipt checks | pending |
| allowed_reports | `reports/runs/<run_id>/suites/entry-worker-job.md`; `reports/runs/<run_id>/redaction-check.md`; `reports/runs/<run_id>/suites/infra-runtime-fake.md` if receipt replay or fake parity is touched | pending |
| forbidden_rule | Do not implement accepted outbound material factories, payload marker snapshots, outbox record creation beyond any already formal existing scaffold, publish, deliver, retry or propagation jobs; reserve them for `commit-06-c` / PH-07. | active |
| forbidden_rule | Do not implement API/worker/jobs entry wiring, broker ack/retry/dead-letter loops, config entry binding, PH-08 scripts or release evidence scripts. | active |
| forbidden_rule | Do not implicitly create missing target member, role source owner, memory relation, archive handoff relation or trace handoff intent; missing/mismatched targets must follow the formal rejected/quarantined/delayed/no-create receipt mapping. | active |
| forbidden_rule | Do not mutate truth/reference/outbox/handoff outside the five formal commit-06-b flows; do not run rebuild/refresh/reconciliation/publish/deliver/retry side effects. | active |
| forbidden_rule | Do not parse unsafe payload body for unsupported schema; do not save raw event body, callback body, archive package, receipt body, adapter raw diagnostic, embedding, memory text or sibling truth. | active |
| forbidden_rule | Do not invent schema, port, state, mapper, config key, artifact JSON field, TC/EV/AC/VETO, context channel, digest rule, stable lookup key, marker trace subject or private fake-only target/replay map. | active |

---

## Required Checks

| check | command_or_evidence | status | notes |
|---|---|---|---|
| format | `cargo fmt --all` | pending | Run in implementation repo if Rust files changed. |
| application compile | `cargo check -p identity-application` | pending | Minimum check for commit-06-b consumer/callback flow changes. |
| contracts compile | `cargo check -p identity-contracts` | pending | Required if payload, receipt or marker DTOs are touched. |
| domain compile | `cargo check -p identity-domain` | pending | Required if state helpers or domain guards are touched. |
| infra compile | `cargo check -p identity-infra` | pending | Required if fake runtime repositories, resolver fixtures, target lookup or stored receipt replay support is touched. |
| targeted tests | role source changed, work participation accepted, memory source state changed, archive handoff callback, trace handoff callback, duplicate replay, missing target no-create and callback target mismatch tests | pending | Test names must be recorded after implementation. |
| no-create audit | evidence that missing target branches do not create member/relation/handoff truth and return the formal receipt outcome | pending | Required by `GATE-06` and `VETO-ID-002/003`. |
| replay audit | evidence that duplicate consumer/callback replay does not reparse payload, rerun mutation, call resolvers, write truth/reference/outbox/handoff or synthesize receipt from current state | pending | Required by `GATE-03` subset. |
| redaction/body-free audit | evidence that receipt/envelope/stored replay/log/report surfaces do not contain raw event body, callback body, archive package, receipt body, adapter diagnostic body, role/capability definition body or memory text | pending | Required by `GATE-10` and related redaction cases. |
| report evidence | `reports/runs/<run_id>/suites/entry-worker-job.md`; `reports/runs/<run_id>/redaction-check.md`; `reports/runs/<run_id>/suites/infra-runtime-fake.md` if replay/fake parity is touched | pending | If a formal writer is unavailable, record not_applicable with source. |
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
| test_gate | pending | Targeted consumer/callback flow tests pass or failure recorded. | fix_gate_failure |
| evidence_gate | pending | `GATE-06`, `GATE-10` and `GATE-03` subset evidence generated when formal writer exists; otherwise record not_applicable with source. | fix_gate_failure |
| commit_gate | pending | staged scope, commit message, whitespace and required checks have evidence. | fix_gate_failure |
| handoff_gate | pending | commit hash, gates run, tests not run, blockers, next boundary and user changes untouched. | handoff |

---

## Commit Gate

| gate | status | evidence |
|---|---|---|
| staged_scope | pending | Must include only allowed `commit-06-b` implementation files. |
| unrelated_changes | pending | User-owned unrelated changes must remain unstaged. |
| commit_message_format | pending | Planned subject: `feat(identity-application): add inbound callback mutation flows` |
| commit_body_group | pending | Body group must include `Inbound and callback mutation flows:` from Step 11 mapping. |
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
| next_boundary | pending | Expected next boundary: `commit-06-c`. |
| user_owned_changes_untouched | pending | List unrelated files left untouched. |

---

## Blockers

| blocker_id | gate | status | blocking_reason | requested_design_closure | next_allowed_action |
|---|---|---|---|---|---|
| BLK-ID-06B-LEDGER-001 | design_gate | resolved | Project ledger still pointed to `commit-06-a` and `implementation-boundaries/commit-06-b.md` was missing, so implementation agent could not start the concrete consumer/callback mutation boundary. | Project ledger now advances to `commit-06-b`; this boundary ledger defines required reads, allowed scope, required checks, Commit Gate and Handoff Gate. | read_docs |

---

## Experience Review

| item | conclusion | action |
|---|---|---|
| BLK-ID-06B-LEDGER-001 | no new reusable standard required | Existing `standards/document/代码实施台账与门禁规范.md` and `standards/document/设计真相源闭环与可落码性标准.md` already require current boundary ledger before implementation; this file records the concrete recovery point for `commit-06-b`. |
