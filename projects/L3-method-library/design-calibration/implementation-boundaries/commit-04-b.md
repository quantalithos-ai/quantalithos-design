# commit-04-b implementation ledger

| field | value |
|---|---|
| project | L3-method-library |
| boundary_id | commit-04-b |
| phase | PH-04 formalization and version semantics |
| design_baseline | `current-design-with-commit-04-b-service-replay-closure` |
| implementation_repo | `/home/aris/Projects/quantalithos-method-library` |
| status | ready |
| next_allowed_action | read_docs |
| current_recovery_point | Exact current-boundary formalization/version service/replay closure is now published. Reread all Required Reads, then rerun Design Gate and Scope Gate from `read_docs` before editing `crates/application`, minimal `crates/contracts`, `crates/infra` or minimal `crates/api`. |

---

## Activation Guard

| rule | status | consequence |
|---|---|---|
| project ledger current_boundary must equal `commit-04-b` | pass | Project ledger now points to `commit-04-b`; implementation may use this file only within the formalization/version service/replay scope. |
| `commit-04-a` handoff must be closed | pass | Formalization/version contracts/domain handoff is closed by implementation commit `821ba8bfce080164a2a8b081c32f32e4ad7d6f0a`. |
| project ledger must set `next_allowed_action = read_current_boundary_ledger` for `commit-04-b` | pass | Project ledger now requires reading this current boundary ledger before implementation edits. |

---

## Required Reads

| document | required_section | status | notes |
|---|---|---|---|
| `standards/document/代码实施台账与门禁规范.md` | planned boundary activation, gate matrix, commit and handoff rules | pass | Re-read and applied while reactivating `commit-04-b`; project ledger now points here and implementation must restart from `read_docs` under the updated current-boundary ledger. |
| `standards/document/设计真相源闭环与可落码性标准.md` | no invented service flow, idempotency, stored result, version conflict, commit unknown or evidence fields | pass | Re-read and confirmed the updated baseline now closes the current-boundary callable surface and carrier/source maps, so implementation can proceed without inventing local service/replay semantics. |
| `standards/coding/rust.md` | Rust application/infra module, trait, error and test conventions | pass | Re-read and confirmed Rust naming/testing rules for any future application/infra implementation. |
| `projects/L3-method-library/00-需求文档.md` | formalization/version requirements and replay/idempotency expectations | pass | Re-read and confirmed formal version semantics, duplicate replay and commit unknown handling remain P0 blocking behavior. |
| `projects/L3-method-library/01-架构设计.md` | formal version ownership, transaction direction and dependency direction | pass | Re-read and confirmed formalization/version truth stays local and cannot be reconstructed from downstream use truth or runtime artifacts. |
| `projects/L3-method-library/02-概要设计.md` | formalization/version processing flow and transaction outline | pass | Re-read and confirmed PH-04 owns formalization/version services and replay, but only at component/flow level until exact current-boundary callable surface exists. |
| `projects/L3-method-library/03-详细设计.md` | trait/port contracts, protocol contracts, function flows, persistence/UoW, error/recovery, concurrency/idempotency and implementation handoff | pass | Re-read against baseline `current-design-with-commit-04-b-service-replay-closure`; formal §6.3B now closes the exact current-boundary facade, source carrier, service input, repository/resolver, replay helper and stored-result surface for formalization/version services. |
| `projects/L3-method-library/04-配置设计.md` | controlled/fake adapter binding and body-free redaction | pass | Re-read and confirmed config cannot invent repository/UoW/replay semantics or fill missing current-boundary callable surfaces. |
| `projects/L3-method-library/05-测试方案.md` | service-flow-fast formalization/replay and artifact/report rules | pass | Re-read the target suite/report rules; service-flow-fast formalization/replay remains the required targeted suite now that current-boundary service/replay closure is published. |
| `projects/L3-method-library/06-验收标准.md` | ML-FG-002/006, ML-RL-003/007, ML-STATE, ML-IDEMP, `VETO-ML-002` and `VETO-ML-004` | pass | Re-read and confirmed duplicate rerun, commit unknown ambiguity and silent overwrite remain blocking acceptance failures. |
| `projects/L3-method-library/07-实施计划.md` | §3, §6, §7, §8, §11 and §12 | pass | Re-read and confirmed `commit-04-b` scope is services, idempotency stored result, version conflict and commit unknown only, plus minimal contracts ref-kind registry/export for the six selector intent labels. |
| `projects/L3-method-library/design-calibration/03_ddd_step_07_trait_port_adapter.md` | formalization/version repository ports, UoW and fake adapter contracts | pass | Re-read and applied `R7.10B`; exact facade I/O, selector enum, six service inputs, repositories, resolvers, UoW carriers, retirement precheck helpers and fake parity are now closed for current-boundary implementation. |
| `projects/L3-method-library/design-calibration/03_ddd_step_08_protocol_contracts.md` | formalization/version command/request/response and rejection surface | pass | Re-read and applied `6A`; exact selector/source map, dispatch I/O and duplicate digest rules are now closed for the six PH-04 command families. |
| `projects/L3-method-library/design-calibration/03_ddd_step_09_function_flows.md` | formalization/version accepted service flows | pass | Re-read and applied `3A`; each PH-04 flow now has exact function-level sequence, callable surface and safe rejection / commit-unknown read-back rules. |
| `projects/L3-method-library/design-calibration/03_ddd_step_11_persistence_tx_consistency.md` | repository fake, expected version, rollback and commit unknown semantics | pass | Re-read and applied `3C`; logical stores, read/write keys, exact transaction sequences, `CommitUnknown` behavior and fake parity are now closed for current-boundary services. |
| `projects/L3-method-library/design-calibration/03_ddd_step_12_errors_recovery.md` | replay consistency failure, safe rejection and recovery behavior | pass | Re-read and confirmed missing stored surface or missing callable closure must fail safely and return to design; implementation cannot patch the gap with local recovery rules. |
| `projects/L3-method-library/design-calibration/03_ddd_step_13_concurrency_idempotency.md` | idempotency key, digest, stored result and duplicate replay semantics | pass | Re-read and confirmed duplicate replay / commit unknown depend on formal stored surfaces and exact method closure, not on local heuristics or rerun mutation. |
| `projects/L3-method-library/design-calibration/03_ddd_step_16_test_cut.md` | service-flow-fast formalization/replay ownership | pass | Re-read and confirmed the targeted PH-04 tests belong to the formalization/version service and replay slice once exact callable surfaces exist. |
| `projects/L3-method-library/design-calibration/07_implementation_plan_step_06_tasks_commit_boundaries.md` | `commit-04-b` row | pass | Re-read the `commit-04-b` boundary row and confirmed services/replay plus minimal contracts selector-label scope are the current allowed implementation subset. |
| `projects/L3-method-library/design-calibration/07_implementation_plan_step_07_test_acceptance_gates.md` | `commit-04-b` gate row and PH-04 gate | pass | Re-read and confirmed service-flow-fast formalization/replay is the active required gate for this boundary once implementation reruns `read_docs`. |
| `projects/L3-method-library/design-calibration/07_implementation_plan_step_11_commit_review_delivery.md` | `commit-04-b` commit body grouping | pass | Re-read and confirmed the implementation commit must use the formal `commit-04-b` body groups `Formalization services:` and `Stored replay and conflict handling:` after the current boundary gates pass. |
| `/home/aris/Projects/quantalithos-method-library` git status and `commit-04-a` handoff state | latest implementation state | pass | Recorded `?? .gitignore`; the user-owned file remains untouched and `commit-04-a` handoff is closed by `821ba8bfce080164a2a8b081c32f32e4ad7d6f0a`. |

---

## Allowed Scope

| type | path_or_rule | status |
|---|---|---|
| allowed_path | `/home/aris/Projects/quantalithos-method-library/crates/application/src/**` for formalization/version service, idempotency stored result integration, conflict handling and commit unknown handling assigned to `commit-04-b` | planned |
| allowed_path | `/home/aris/Projects/quantalithos-method-library/crates/application/tests/**` for formalization/version service-flow and replay tests | planned |
| allowed_path | `/home/aris/Projects/quantalithos-method-library/crates/contracts/src/**` for minimal ref-kind registry/export entries required by the six formalization/version selector intent labels only | planned |
| allowed_path | `/home/aris/Projects/quantalithos-method-library/crates/contracts/tests/**` for minimal selector-label contract fixtures only if needed by the ref-kind registry/export change | planned |
| allowed_path | `/home/aris/Projects/quantalithos-method-library/crates/infra/src/**` for formalization/version fake repository and stored replay support assigned to `commit-04-b` | planned |
| allowed_path | `/home/aris/Projects/quantalithos-method-library/crates/infra/tests/**` for formalization/version fake replay and rollback tests | planned |
| allowed_path | `/home/aris/Projects/quantalithos-method-library/crates/api/src/**` for minimal formalization/version API handler if explicitly defined and only delegating to application facade | planned |
| allowed_path | `/home/aris/Projects/quantalithos-method-library/artifacts/test/<run_id>/suites/service-flow-fast/**` only if generated by an actual targeted run after activation | planned |
| allowed_path | `/home/aris/Projects/quantalithos-method-library/reports/runs/<run_id>/suites/service-flow-fast.md` only if generated from raw artifact after activation | planned |
| allowed_rule | Implement formalization/version services, idempotency stored result, version conflict handling, commit unknown handling, fake replay storage and rollback/version checks explicitly defined by formal design. | planned |
| allowed_rule | Add only the minimal contracts ref-kind registry/export and selector-label fixture updates explicitly required by Step 6 `4B.5`; no other contracts DTO or payload work is opened by this boundary. | planned |
| allowed_rule | Add targeted tests for accepted path, rejected path, duplicate replay, version conflict, commit unknown, rollback and missing stored surface failure within formalization/version only. | planned |
| forbidden_rule | Do not implement consumption/distribution, Definition vs Use consumption guard, availability, handoff, trace/audit/impact, external/peripheral, query/material, event/publisher or job behavior. | active |
| forbidden_rule | Do not add outbound publisher, worker, job runner, read material projection, report generator, release evidence, acceptance handoff or VETO checklist. | active |
| forbidden_rule | Do not broaden API handler beyond formalization/version entry or allow entry to bypass application facade. | active |
| forbidden_rule | Do not broaden contracts work beyond the six selector intent labels, their exact ref-kind registry/export and directly paired selector fixtures. | active |
| forbidden_rule | Do not invent repository methods, UoW fields, stored result schema, idempotency keys, config keys, marker values, error variants, commit unknown semantics or evidence schema not closed by formal `03/05/06/07`. | active |
| forbidden_rule | Do not rebuild duplicate responses from current truth, rerun duplicate mutation, silently overwrite versions, partially commit after failure, or hide replay consistency failures. | active |
| forbidden_rule | Do not use raw body, external provider response, secret, config/env value, full sensitive ref, stack trace or old MethodContent/publish/snapshot/outbox material in tests/reports. | active |
| forbidden_rule | Do not stage unrelated user changes, generated target directories or implementation outputs from previous boundaries. | active |

---

## Required Checks

| check | command_or_evidence | status | notes |
|---|---|---|---|
| activation guard | project ledger shows `current_boundary = commit-04-b` and `next_allowed_action = read_current_boundary_ledger` | pass | Project ledger activates this boundary; implementation must continue with this file and then required reads. |
| prior handoff | `commit-04-a` implementation commit and handoff recorded | pass | PH-04 formalization/version contracts/domain slice is recorded at `821ba8bfce080164a2a8b081c32f32e4ad7d6f0a`. |
| worktree baseline | `git -C /home/aris/Projects/quantalithos-method-library status --short` | pass | Recorded `?? .gitignore`; the unrelated user-owned file remains untouched and unstaged. |
| local git identity | `git -C /home/aris/Projects/quantalithos-method-library config user.name` and `user.email` | pass | Confirmed `quantalithos-labs <quantalithos.ai@gmail.com>`. |
| format | `cargo fmt --all` | pending | Run in implementation repo after Rust changes. |
| workspace check | `cargo check` | pending | Ensures the full workspace still compiles. |
| application check | `cargo check -p method-library-application` or the formal application package check | pending | Use actual package name from formal workspace once activated. |
| infra check | `cargo check -p method-library-infra` or the formal infra package check | pending | Fake replay storage and runtime support must compile. |
| api check | `cargo check -p method-library-api` or the formal API package check if API files changed | pending | Minimal handler must compile and call application facade only. |
| service-flow-fast formalization | targeted formalization/version service-flow and replay tests | pending | Must cover accepted, rejected, duplicate replay, version conflict and commit unknown paths. |
| replay consistency tests | stored result missing / mismatch / duplicate replay tests | pending | Missing surface must fail safely, not rebuild from truth. |
| VETO targeted audit | check `VETO-ML-002` / `VETO-ML-004` risk is not introduced | pending | Silent overwrite or invalid use edge blocks commit. |
| dependency boundary | inspect Cargo manifests / metadata for forbidden sibling or reverse dependencies | pending | Application must not depend on infra/API; infra may depend inward. |
| redaction fixture scan | check tests/artifacts/reports do not include forbidden raw body/secret/provider/config material | pending | Required for body-free service evidence. |
| evidence report | run-scoped `service-flow-fast` artifact/report if scripts exist | pending | Generated reports must derive from raw artifacts and retain failures. |
| whitespace | `git diff --check` and `git diff --cached --check` before commit | pending | Required for Commit Gate. |
| staged scope | `git diff --cached --name-only` | pending | Must match Allowed Scope. |

---

## Gate Matrix

| gate | status | evidence | next_if_failed |
|---|---|---|---|
| activation_gate | pass | Project ledger has advanced from `commit-04-a` to `commit-04-b`, and `commit-04-a` handoff is closed by `821ba8bfce080164a2a8b081c32f32e4ad7d6f0a`. | read_docs |
| design_gate | pass | Required reads now recheck cleanly against baseline `current-design-with-commit-04-b-service-replay-closure`; exact current-boundary callable surface, selector/source carriers, repository/resolver signatures and replay/persistence rules are closed without local invention. | scope_gate |
| scope_gate | pending | Planned changes must be limited to formalization/version services and replay slice. | fix_gate_failure |
| worktree_gate | pending | Initial implementation worktree status recorded; unrelated user changes protected. | fix_gate_failure |
| build_gate | pending | Formatting, workspace/application/infra/API checks and dependency boundary checks pass or failure is recorded. | fix_gate_failure |
| test_gate | pending | Service-flow-fast formalization/replay and VETO targeted checks pass after activation. | fix_gate_failure |
| evidence_gate | pending | Targeted artifact/report is optional until scripts exist; any generated report must be run-scoped and raw-artifact-derived. | fix_gate_failure |
| commit_gate | pending | staged scope, commit message, whitespace and required checks have evidence. | fix_gate_failure |
| handoff_gate | pending | commit hash, checks run, tests not run, blockers and next boundary state recorded. | handoff |

---

## Commit Gate

| gate | status | evidence |
|---|---|---|
| staged_scope | pending | Must include only allowed `commit-04-b` formalization service/replay files and generated targeted evidence if applicable. |
| unrelated_changes | pending | User-owned unrelated changes must remain unstaged. |
| commit_message_format | pending | Planned subject: `feat(formalization): add version service replay` |
| commit_body_group | pending | Body group must include `Formalization services:` and `Stored replay and conflict handling:` from Step 11 mapping. |
| whitespace | pending | `git diff --cached --check` must pass. |
| required_checks | pending | Required Checks table must have pass/not_applicable evidence. |

---

## Handoff Gate

| gate | status | evidence |
|---|---|---|
| committed_hash | pending | Fill after implementation repo commit. |
| committed_message | pending | Fill after implementation repo commit. |
| gates_run | pending | List exact commands and targeted reports. |
| tests_not_run | pending | Must state none or explain; cannot claim consumption/query/publisher/job suites. |
| remaining_blockers | pending | Must reference blocker table; any blocking design gap prevents handoff. |
| final_conclusion | pending | Must be one of pass / fail / cannot_decide with exact evidence source. |
| user_owned_changes_untouched | pending | List unrelated files left untouched. |

---

## Blockers

| blocker_id | gate | status | blocking_reason | requested_design_closure | next_allowed_action |
|---|---|---|---|---|---|
| BLK-ML-04B-ACTIVATION-001 | activation_gate | resolved | Project ledger had not advanced through `commit-04-a`; this future boundary could not be used for implementation yet. | Project ledger now advances to `commit-04-b`, records `commit-04-a` handoff closure and sets this boundary to current. | read_docs |
| BLK-ML-04B-DESIGN-001 | design_gate | resolved | Formal `03` §6.3B, Step 6 `4B.5`, Step 7 `R7.10B` and formal `07` now publish the exact current-boundary facade, selector/source carrier, service input, repository, replay helper, UoW and stored-result callable surface for `commit-04-b`. | Implementation must reread the current boundary ledger, then rerun `read_docs` and Design Gate against `current-design-with-commit-04-b-service-replay-closure`. | read_docs |
| BLK-ML-04B-DESIGN-002 | design_gate | resolved | Step 8 `6A`, Step 9 `3A` and formal `03` §6.3B now close exact PH-04 command selector/source/input/output carriers, duplicate digest rules and replay-safe result mapping for the six current-boundary command flows. | Implementation must reread the current boundary ledger, then rerun `read_docs` and Design Gate against `current-design-with-commit-04-b-service-replay-closure`. | read_docs |
| BLK-ML-04B-DESIGN-003 | design_gate | resolved | Step 7 `R7.10B`, Step 11 `3C` and formal `03` §6.3B now close exact repository, resolver, policy-diagnostic, retirement precheck, `MethodAssetCommitObservation` and fake-parity callable methods/signatures required by the current flows. | Implementation must reread the current boundary ledger, then rerun `read_docs` and Design Gate against `current-design-with-commit-04-b-service-replay-closure`. | read_docs |

---

## Experience Review

| item | conclusion | action |
|---|---|---|
| future boundary pre-creation | applies current planned-ledger rule | Pre-created future ledgers must use `planned / wait_until_current` and must not authorize code changes until project ledger advances. |
| formalization/version replay | existing design-closure rule applies | Service, idempotency, stored replay, version conflict and commit unknown gaps must be fixed in `03/05/06/07` before code; implementation must not invent replay semantics. |
| formalization/version current-boundary callable surface | resolved for current boundary | Once application/infra implementation starts, family-level repository or flow prose is insufficient; `commit-04-b` now records the exact callable surface in formal `03` §6.3B and Step 7 `R7.10B`, and implementation must reread those sections before code resumes. |
| formalization/version command carrier closure | resolved for current boundary | The six PH-04 command flows now have exact Rust-facing selector/source/input/output carriers and source maps in Step 6 `4B.5`, Step 8 `6A` and Step 9 `3A`; generic `Command shell` cards are no longer the last word. |
| repository / resolver exact method closure | resolved for current boundary | `FormalizationStateRepository`, `FormalMethodAssetVersionRepository`, `FormalizationBasisSummaryRepository`, retirement precheck helpers, `FormalizationBasisResolverPort` and `MethodAssetPolicyDiagnosticBuilderPort` now have exact current-boundary method/return/parity closure in Step 7 `R7.10B` and Step 11 `3C`. |
| standards update necessity | no additional standards delta | Existing `设计真相源闭环与可落码性标准` already covered the missing callable-surface, carrier/source-map and repository/resolver closure pattern; this turn only had to apply it to `commit-04-b`. |
