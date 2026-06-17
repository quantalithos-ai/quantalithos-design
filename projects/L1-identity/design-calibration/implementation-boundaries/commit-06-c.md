# commit-06-c implementation ledger

| field | value |
|---|---|
| project | L1-identity |
| boundary_id | commit-06-c |
| phase | PH-06 Inbound / callback / outbound material slices |
| design_baseline | `current-design-with-commit-06-c-ledger` |
| implementation_repo | `/home/aris/Projects/quantalithos-identity` |
| status | ready |
| next_allowed_action | read_docs |
| current_recovery_point | outbound accepted material factories, payload marker and outbox snapshot after implementation `commit-06-b` supporting commits `12aa1ae`, `df6b21e`, code commit `2ae3bad` and evidence commit `dde1dfc`; covers BATCH-06-06~07, `TC-ID-OUTBOX-001~008` and related `TC-ID-REDACTION-*` |

---

## Required Reads

| document | required_section | status | notes |
|---|---|---|---|
| `standards/document/代码实施台账与门禁规范.md` | 全文,尤其 Design Gate、Scope Gate、Commit Gate、Handoff Gate 和 blocker 回流记录 | pending | 先按台账推进,不得直接改代码。 |
| `standards/document/设计真相源闭环与可落码性标准.md` | 实现不得自行补 schema / port / state / mapper / config / evidence 的闭口规则;implementation ledger 规则 | pending | 缺 payload marker、subject mapper、topic key 或 outbox snapshot schema 时必须暂停。 |
| `projects/L1-identity/07-实施计划.md` | §3.5、§6、§7、§9、§11 的 commit-06-c boundary、gate、commit body 和 handoff 要求 | pending | 当前 boundary、门禁、提交信息来源。 |
| `projects/L1-identity/design-calibration/07_implementation_plan_step_06_tasks_commit_boundaries.md` | PH-06 / commit-06-c 的 BATCH-06-06~07、scope、经验复核、停审记录 | pending | accepted outbound material 与 outbox snapshot 的正式边界来源。 |
| `projects/L1-identity/design-calibration/07_implementation_plan_step_07_test_acceptance_gates.md` | commit-06-c gate row | pending | `GATE-07`、`GATE-10`、TC、EV、report path 来源。 |
| `projects/L1-identity/design-calibration/07_implementation_plan_step_11_commit_review_delivery.md` | commit-06-c commit body grouping | pending | commit message body 分组来源。 |
| `projects/L1-identity/design-calibration/03_ddd_step_06_object_contracts.md` | `IdentityOutboxRecord`, `OutboxState`, outbound payload marker refs, safe summary refs, trace refs and body-free invariants | pending | outbox material 只能保存 ref/marker/safe summary,不得保存外部正文或 adapter response。 |
| `projects/L1-identity/design-calibration/03_ddd_step_07_trait_port_adapter_contracts.md` | id generator, accepted subject mapper, outbox repository, payload marker builder/store, topic key refs, UoW cursor and fake parity contracts | pending | 不新增私有 subject/topic/payload map;publisher 后续只能读 saved marker。 |
| `projects/L1-identity/design-calibration/03_ddd_step_08_protocol_contracts.md` | 10 outbound event protocols, payload DTO refs, `IdentityOutboundEventEnvelope`, payload marker and outbox view fields | pending | public payload shape and marker refs must match formal protocol. |
| `projects/L1-identity/design-calibration/03_ddd_step_09_function_flows.md` | 9.4 outbound accepted material, shared accepted material creation flow, accepted-only guard and saved-marker-only publisher boundary | pending | 本 boundary 只落 material creation/snapshot;不实现 `PublishIdentityOutboxFlow` execution. |
| `projects/L1-identity/design-calibration/03_ddd_step_10_state_matrix.md` | outbox pending material state, accepted-only transitions and no publish-state mutation in material boundary | pending | commit-06-c may create `PendingPublish`;`Published`/retry/failure states remain job boundary. |
| `projects/L1-identity/design-calibration/03_ddd_step_11_persistence_transaction_consistency.md` | accepted transaction outbox append, payload marker persistence, same-UoW rollback and stored surface references | pending | outbox append / payload marker save failure must roll back owning accepted transaction. |
| `projects/L1-identity/design-calibration/03_ddd_step_12_error_recovery.md` | rejected/query/retry-only no material, outbox append failure rollback and body-free error/report mapping | pending | rejected/delayed/quarantined/noop branches create material only where Step 9 explicitly allows it. |
| `projects/L1-identity/design-calibration/03_ddd_step_13_concurrency_idempotency.md` | duplicate command/consumer/callback replay and outbox material immutability | pending | duplicate replay must return stored outbox refs;must not recreate payload marker or outbox record. |
| `projects/L1-identity/design-calibration/03_ddd_step_15_observability_audit.md` | outbound event/payload marker log redaction and safe diagnostics | pending | logs/reports must not leak raw payload, role definition body, memory text, archive package or receipt body. |
| `projects/L1-identity/design-calibration/03_ddd_step_16_test_cuts.md` | `outbound_material_accepted_only`, `outbound_payload_marker_snapshot`, `outbound_forbidden_body_absent` and rollback test cuts | pending | targeted tests 来源。 |

---

## Allowed Scope

| type | path_or_rule | status |
|---|---|---|
| allowed_crate | `/home/aris/Projects/quantalithos-identity/crates/application` | pending |
| allowed_crate | `/home/aris/Projects/quantalithos-identity/crates/contracts` only if current design already defines missing outbound payload/marker DTOs and code has not caught up | pending |
| allowed_crate | `/home/aris/Projects/quantalithos-identity/crates/domain` only if current design already defines outbox state helpers, payload marker helpers or accepted material guards needed by commit-06-c | pending |
| allowed_crate | `/home/aris/Projects/quantalithos-identity/crates/infra` only for fake outbox repository, payload marker store, subject/topic fixture and rollback parity required by commit-06-c tests | pending |
| allowed_tests | Targeted tests for 10 outbound materials, accepted-only guard, payload marker body-free snapshot, outbox append rollback, duplicate replay no material recreation, and no current-truth reconstruction | pending |
| allowed_reports | `reports/runs/<run_id>/suites/operations-replay-core.md`; `reports/runs/<run_id>/redaction-check.md` | pending |
| forbidden_rule | Do not implement `PublishIdentityOutboxFlow`, `DeliverTraceHandoffFlow`, `RetryIdentityPropagationFailuresFlow`, publisher adapter execution, delivery adapter execution, retry scheduling or job report replay; reserve for PH-07. | active |
| forbidden_rule | Do not implement API/worker/jobs entry wiring, broker ack/retry/dead-letter loops, config entry binding, PH-08 scripts or release evidence scripts. | active |
| forbidden_rule | Do not create outbound material from rejected command, rejected/quarantined/delayed/noop consumer/callback branches unless Step 9 explicitly owns a marker-only material; query and retry-only paths must never create accepted material. | active |
| forbidden_rule | Do not reconstruct outbound payload from current truth, query views, reports, publisher result or job retry state; payload marker must come from the owning accepted transaction. | active |
| forbidden_rule | Do not persist raw payload body, callback body, archive package, receipt body, adapter raw diagnostic, role/capability definition body, work body, memory text, embedding or sibling truth. | active |
| forbidden_rule | Do not invent schema, port, state, mapper, config key, artifact JSON field, TC/EV/AC/VETO, topic raw string, accepted subject identity, payload digest rule or private fake-only material map. | active |

---

## Required Checks

| check | command_or_evidence | status | notes |
|---|---|---|---|
| format | `cargo fmt --all` | pending | Run in implementation repo if Rust files changed. |
| application compile | `cargo check -p identity-application` | pending | Minimum check for commit-06-c material creation changes. |
| contracts compile | `cargo check -p identity-contracts` | pending | Required if outbound payload, marker or event DTOs are touched. |
| domain compile | `cargo check -p identity-domain` | pending | Required if outbox state helpers, payload marker helpers or accepted material guards are touched. |
| infra compile | `cargo check -p identity-infra` | pending | Required if fake outbox/payload marker repository or rollback parity is touched. |
| targeted tests | 10 outbound material snapshot tests, accepted-only guard, payload body-free test, outbox append rollback, duplicate replay no material recreation and no current-truth reconstruction tests | pending | Test names must be recorded after implementation. |
| accepted-only audit | evidence that rejected/query/retry-only paths do not create accepted material and accepted transaction owns all outbox refs | pending | Required by `GATE-07` and `TC-ID-OUTBOX-008`. |
| payload marker audit | evidence that saved outbox record binds event name, schema version, topic key ref, subject, trace, cursor and payload marker without raw body | pending | Required by `TC-ID-OUTBOX-001~007`. |
| redaction/body-free audit | evidence that payload markers, stored outbox records, reports and logs do not contain raw payload/body/receipt/archive package/adapter diagnostics or memory text | pending | Required by `GATE-10` and related redaction cases. |
| report evidence | `reports/runs/<run_id>/suites/operations-replay-core.md`; `reports/runs/<run_id>/redaction-check.md` | pending | If a formal writer is unavailable, record not_applicable with source. |
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
| test_gate | pending | Targeted outbound material and outbox snapshot tests pass or failure recorded. | fix_gate_failure |
| evidence_gate | pending | `GATE-07` and `GATE-10` evidence generated when formal writer exists; otherwise record not_applicable with source. | fix_gate_failure |
| commit_gate | pending | staged scope, commit message, whitespace and required checks have evidence. | fix_gate_failure |
| handoff_gate | pending | commit hash, gates run, tests not run, blockers, next boundary and user changes untouched. | handoff |

---

## Commit Gate

| gate | status | evidence |
|---|---|---|
| staged_scope | pending | Must include only allowed `commit-06-c` implementation files. |
| unrelated_changes | pending | User-owned unrelated changes must remain unstaged. |
| commit_message_format | pending | Planned subject: `feat(identity-application): add outbound accepted material` |
| commit_body_group | pending | Body group must include `Accepted outbound material:` from Step 11 mapping. |
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
| next_boundary | pending | Expected next boundary: `commit-07-a`. |
| user_owned_changes_untouched | pending | List unrelated files left untouched. |

---

## Blockers

| blocker_id | gate | status | blocking_reason | requested_design_closure | next_allowed_action |
|---|---|---|---|---|---|
| BLK-ID-06C-LEDGER-001 | design_gate | resolved | Project ledger still pointed to `commit-06-b` and `implementation-boundaries/commit-06-c.md` was missing, so implementation agent could not start the outbound accepted material boundary. | Project ledger now advances to `commit-06-c`; this boundary ledger defines required reads, allowed scope, required checks, Commit Gate and Handoff Gate. | read_docs |

---

## Experience Review

| item | conclusion | action |
|---|---|---|
| BLK-ID-06C-LEDGER-001 | no new reusable standard required | Existing `standards/document/代码实施台账与门禁规范.md` and `standards/document/设计真相源闭环与可落码性标准.md` already require current boundary ledger before implementation; this file records the concrete recovery point for `commit-06-c`. |
