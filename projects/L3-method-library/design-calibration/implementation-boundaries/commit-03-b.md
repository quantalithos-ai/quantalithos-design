# commit-03-b implementation ledger

| field | value |
|---|---|
| project | L3-method-library |
| boundary_id | commit-03-b |
| phase | PH-03 method asset definition and catalog truth |
| design_baseline | `current-design-with-commit-03-b-truth-ref-factory-closure` |
| implementation_repo | `/home/aris/Projects/quantalithos-method-library` |
| status | implemented |
| next_allowed_action | start_next_boundary |
| current_recovery_point | Accepted definition/catalog service vertical slice completed by implementation commits `891d323` (service flow) and `66496cf` (run-scoped evidence); future boundary activation must restart from `read_docs` before editing the next allowed scope. |

---

## Activation Guard

| rule | status | consequence |
|---|---|---|
| project ledger current_boundary must equal `commit-03-b` | pass | Project ledger now points to `commit-03-b`; implementation may use this file only within the accepted service vertical-slice scope. |
| `commit-03-a` handoff must be closed | pass | Definition/catalog contracts and domain truth state were implemented at `5376349eded0e277258c32d0b32b07a7c5aa2fe6`. |
| `commit-03-b` activation had already reached `read_docs` before the latest blocker was recorded | pass | Boundary activation is complete; accepted-path source carrier, definition lifecycle and catalog retirement blockers are now closed, so implementation resumes from `read_docs` and must rerun gates against the latest baseline. |

---

## Required Reads

Accepted-path command source, definition lifecycle design closure, catalog retirement closure and retire formal-version check carve-out reactivated this boundary. Any `pass` value below records the previous failed Design Gate read only; implementation must reread every row from the current design baseline before code edits.

| document | required_section | status | notes |
|---|---|---|---|
| `standards/document/代码实施台账与门禁规范.md` | planned boundary activation, gate matrix, commit and handoff rules | pass | Re-read during the `commit-03-b` gate rerun; blocker handling requires `blocked / wait_design` when schema or mapper closure is missing. |
| `standards/document/设计真相源闭环与可落码性标准.md` | no invented service flow, repository port/fake, UoW, stored result, lifecycle/status carrier, config or evidence fields | pass | Re-read during the `commit-03-b` gate rerun. The lifecycle/status carrier gaps are now closed; implementation still cannot invent local definition/catalog status fields or fake-only side-state. |
| `standards/coding/rust.md` | Rust application/infra/API module, trait, error and test conventions | pass | Re-read and applied; no implementation files were edited after the blocker was found. |
| `projects/L3-method-library/00-需求文档.md` | definition/catalog P0 use cases and boundary rules | pass | Re-read and confirmed the accepted flow must stay on current definition/catalog truth only. |
| `projects/L3-method-library/01-架构设计.md` | truth owner, transaction direction and dependency direction | pass | Re-read and confirmed the minimal API entry must delegate into the application boundary instead of owning truth or runtime state. |
| `projects/L3-method-library/02-概要设计.md` | definition/catalog processing flow and code subject framework | pass | Re-read and confirmed `commit-03-b` is only the accepted service vertical slice with a minimal API entry. |
| `projects/L3-method-library/03-详细设计.md` | trait/port contracts, protocol contracts, function flows, persistence/UoW, error/recovery, idempotency and implementation handoff | pass | Formal `03` §6 / §6.3A / §9 / §10 now closes command-source assembly, catalog helper signatures, replay envelope/support ref factory, definition/catalog truth-ref factory, definition lifecycle persistence, the `retire_definition` carve-out and catalog retirement mapping. |
| `projects/L3-method-library/04-配置设计.md` | controlled/fake adapter binding and body-free redaction | pass | Re-read and confirmed fake runtime support cannot fill the current missing port/type closure with config or binding invention. |
| `projects/L3-method-library/05-测试方案.md` | service-flow-fast, infra-runtime-fake and artifact/report rules | pass | Re-read the current-boundary service/infra suite direction. Definition lifecycle tests must cover establish Active, adjust Active, retire Retired, post-retire rejection/replay and fake parity;catalog tests must cover register Visible, reclassify Visible and retire Visible -> Retired. |
| `projects/L3-method-library/06-验收标准.md` | ML-FG-001/005, ML-RL-001, ML-TX-001 and evidence integrity | pass | Re-read the current-boundary acceptance sections. Accepted service and rollback checks must now use the formal `definition_lifecycle` and `catalog_status` carriers instead of private side-state. |
| `projects/L3-method-library/07-实施计划.md` | §3, §6, §7, §8, §11 and §12 | pass | Re-read and confirmed `commit-03-b` forbids inventing repository methods, UoW fields, stored-result schema, service input fields, error variants or minimal-entry service boundaries. |
| `projects/L3-method-library/design-calibration/03_ddd_step_07_trait_port_adapter.md` | definition/catalog repository ports, UoW and fake adapter contracts | pass | Step 7 now states `commit-03-b` exact callable surface closes definition/catalog repositories, stored-result/UoW methods, catalog helper invocation rules, replay envelope/support ref factory usage and definition/catalog truth-ref factory calls;`retire_definition` must not inspect formal-version refs in this boundary. |
| `projects/L3-method-library/design-calibration/03_ddd_step_08_protocol_contracts.md` | definition/catalog command/request/response surface | pass | Command protocol remains shell-only; accepted-path structured fields come from the formal application-owned `MethodAssetDefinitionCatalogCommandSource`, not from public DTO body fields. |
| `projects/L3-method-library/design-calibration/03_ddd_step_09_function_flows.md` | definition/catalog accepted service flows | pass | Step 9 now requires establish to initialize `Active` after `new_definition_ref(...)`, register catalog to create `catalog_entry_ref` through `new_catalog_entry_ref(...)`, adjust to require/preserve `Active`, and retire to persist `Retired`;the formal-version traceability / active-conflict check is explicitly deferred to PH-04. |
| `projects/L3-method-library/design-calibration/03_ddd_step_11_persistence_tx_consistency.md` | repository fake, version and rollback semantics | pass | Re-read §3A / §3B. Persistence/UoW semantics are closed for definition/catalog stores and stored-result replay;`retire_definition` uses only definition lifecycle and expected-version truth, while `retire_catalog_entry` persists catalog `Retired` through the catalog repository. |
| `projects/L3-method-library/design-calibration/03_ddd_step_12_errors_recovery.md` | safe rejection and recovery behavior | pass | Re-read and confirmed missing stored-replay or port closure is a design blocker and must not be repaired in the implementation repo. |
| `projects/L3-method-library/design-calibration/03_ddd_step_13_concurrency_idempotency.md` | idempotency key, digest and stored result semantics | pass | Re-read and confirmed duplicate handling depends on formal stored-result surfaces and no-rerun replay. |
| `projects/L3-method-library/design-calibration/03_ddd_step_16_test_cut.md` | service-flow-fast and infra-runtime-fake definition/catalog ownership | pass | Re-read the current-boundary test cut. The suites remain scoped to definition/catalog accepted service, lifecycle/status persistence, fake parity and replay behavior. |
| `projects/L3-method-library/design-calibration/07_implementation_plan_step_06_tasks_commit_boundaries.md` | `commit-03-b` row | pass | Re-read the `commit-03-b` boundary row. It allows only the formal command source, service/fake/minimal-entry/contracts/domain lifecycle/status transition scope and support-ref factory truth-ref generation;it still forbids public DTO body, local truth-ref minting or private lifecycle/status side-state. |
| `projects/L3-method-library/design-calibration/07_implementation_plan_step_07_test_acceptance_gates.md` | `commit-03-b` gate row and PH-03 gate | pass | Re-read the `commit-03-b` gate row. Accepted flow or repo-fake gaps remain explicit blockers. |
| `projects/L3-method-library/design-calibration/07_implementation_plan_step_11_commit_review_delivery.md` | `commit-03-b` commit body grouping | pass | Re-read the `commit-03-b` commit body rule. Commit is allowed only after implementation reruns and passes Design/Scope/Worktree/Build/Test/Evidence gates. |
| `/home/aris/Projects/quantalithos-method-library` git status and `commit-03-a` handoff state | latest implementation state | pass | Recorded `?? .gitignore`; the user-owned `.gitignore` remains untouched and unstaged, and `commit-03-a` handoff is closed at `5376349eded0e277258c32d0b32b07a7c5aa2fe6`. |

---

## Allowed Scope

| type | path_or_rule | status |
|---|---|---|
| allowed_path | `/home/aris/Projects/quantalithos-method-library/crates/application/src/**` for definition/catalog accepted service, body-free command source carrier / source-to-service-input assembly, replay envelope/support ref factory port including definition/catalog truth-ref factory methods, formal ports usage, UoW orchestration, mapper shell and stored result integration assigned to `commit-03-b` | planned |
| allowed_path | `/home/aris/Projects/quantalithos-method-library/crates/application/tests/**` for definition/catalog service-flow-fast tests | planned |
| allowed_path | `/home/aris/Projects/quantalithos-method-library/crates/contracts/src/**` only for Step 6 `3B.1` / `3B.1A` `MethodLibraryTypedBoundaryRefKind` labels, named wrapper/export plumbing and selector fixture support required by current-boundary application refs and command intent labels | planned |
| allowed_path | `/home/aris/Projects/quantalithos-method-library/crates/contracts/tests/**` only for targeted typed-ref kind / selector shell fixture tests if required by the existing test layout | planned |
| allowed_path | `/home/aris/Projects/quantalithos-method-library/crates/domain/src/**` only for `MethodAssetDefinitionLifecycle`, `definition_lifecycle` field wiring, catalog `MethodAssetCatalogEntryStatus` Visible/Retired guard support, and current-boundary transition helpers required by accepted service behavior | planned |
| allowed_path | `/home/aris/Projects/quantalithos-method-library/crates/domain/tests/**` only for targeted lifecycle/status transition guard tests if required by the existing test layout | planned |
| allowed_path | `/home/aris/Projects/quantalithos-method-library/crates/infra/src/**` for definition/catalog in-memory/fake repository, support ref factory fake/runtime support and runtime fake support assigned to `commit-03-b` | planned |
| allowed_path | `/home/aris/Projects/quantalithos-method-library/crates/infra/tests/**` for infra-runtime-fake definition/catalog tests | planned |
| allowed_path | `/home/aris/Projects/quantalithos-method-library/crates/api/src/**` for minimal definition/catalog API handler that only calls application facade | planned |
| allowed_path | `/home/aris/Projects/quantalithos-method-library/crates/api/tests/**` for minimal entry smoke if required by formal plan | planned |
| allowed_path | `/home/aris/Projects/quantalithos-method-library/artifacts/test/<run_id>/suites/service-flow-fast/**` only if generated by an actual targeted run after activation | planned |
| allowed_path | `/home/aris/Projects/quantalithos-method-library/artifacts/test/<run_id>/suites/infra-runtime-fake/**` only if generated by an actual targeted run after activation | planned |
| allowed_path | `/home/aris/Projects/quantalithos-method-library/reports/runs/<run_id>/suites/service-flow-fast.md` only if generated from raw artifact after activation | planned |
| allowed_path | `/home/aris/Projects/quantalithos-method-library/reports/runs/<run_id>/suites/infra-runtime-fake.md` only if generated from raw artifact after activation | planned |
| allowed_rule | Implement definition/catalog accepted service vertical slice, UoW/stored result integration, fake repository, rollback/version checks and minimal API entry explicitly defined by formal design. | planned |
| allowed_rule | Add targeted tests for accepted path, rejection path, rollback, duplicate replay, definition lifecycle persistence, catalog Visible -> Retired persistence, post-retire rejection/replay, old material pollution prevention and fake version semantics within definition/catalog only. | planned |
| forbidden_rule | Do not implement formalization/version, consumption/distribution, trace/audit/impact, external/peripheral, query/material, event/publisher or job behavior. | active |
| forbidden_rule | Do not use the newly opened contracts scope to add public command DTO body, route/RPC binding, protocol payload fields, future command intent labels outside Step 6 `3B.1A`, body-free source carrier fields outside Step 6 `3B.1B`, or unrelated contracts helpers. | active |
| forbidden_rule | Do not add outbound publisher, worker, job runner, read material projection, report generator, release evidence, acceptance handoff or VETO checklist. | active |
| forbidden_rule | Do not broaden minimal API handler beyond definition/catalog entry or allow entry to bypass application facade. | active |
| forbidden_rule | Do not invent repository methods, UoW fields, stored result schema, idempotency keys, config keys, marker values, error variants or evidence schema not closed by formal `03/05/06/07`. | active |
| forbidden_rule | Do not represent definition lifecycle through catalog status, stored result kind, formal version state, string status, timestamp, typed-ref parsing, fake private side map or default-to-Active reload rule. | active |
| forbidden_rule | Do not represent catalog retirement through search visibility, stored result kind, route/RPC name, config value, raw reason text, `mark_deprecated`, fake private status map, or default-to-Visible reload rule;`Pending` / `Hidden` / `Deprecated` must not be silently treated as current `Registered`. | active |
| forbidden_rule | Do not locally construct replay envelope refs, operation context refs, digest refs, dedup scope refs, stored result refs, accepted/rejected/effect refs or replay markers from strings, timestamps, counters, route/config values, typed-ref text or repository ids;use the formal support ref factory only. | active |
| forbidden_rule | Do not locally mint, replace or derive `MethodAssetDefinitionRef` / `MethodAssetCatalogEntryRef` for establish/register from generic IdGenerator calls, strings, routes, timestamps, counters, repository ids, typed-ref text, config or fake maps;use `MethodAssetDefinitionCatalogSupportRefFactory.new_definition_ref(...)` / `new_catalog_entry_ref(...)` only at the formal flow points. | active |
| forbidden_rule | Do not extend catalog object helpers locally or keep stale/default `catalog_classification` / `applicability_summary`;use the formal helper signatures and reject scope mismatch. | active |
| forbidden_rule | Do not use private fake maps with semantics absent from durable ports, duplicate mutation rerun, partial commit, query-time repair or hidden rollback shortcuts. | active |
| forbidden_rule | Do not use raw body, external provider response, secret, config/env value, full sensitive ref, stack trace or old MethodContent/publish/snapshot/outbox material in tests/reports. | active |
| forbidden_rule | Do not stage unrelated user changes, generated target directories or implementation outputs from previous boundaries. | active |

---

## Required Checks

| check | command_or_evidence | status | notes |
|---|---|---|---|
| activation guard | project ledger shows `current_boundary = commit-03-b` and `next_allowed_action = read_current_boundary_ledger` after the latest design closure | pass | Boundary activation remains valid and the latest lifecycle/status Design Gate blockers are closed; implementation must restart from this ledger. |
| prior handoff | `commit-03-a` implementation commit and handoff recorded | pass | Definition/catalog contracts/domain truth are recorded at `5376349eded0e277258c32d0b32b07a7c5aa2fe6`. |
| worktree baseline | `git -C /home/aris/Projects/quantalithos-method-library status --short` | pass | Recorded `?? .gitignore`; no implementation files were edited and the user-owned file remains untouched. |
| local git identity | `git -C /home/aris/Projects/quantalithos-method-library config user.name` and `user.email` | pass | Confirmed `quantalithos-labs <quantalithos.ai@gmail.com>`. |
| format | `cargo fmt --all` | pass | `cargo fmt --all` passes after the committed service/fake/minimal-entry and evidence changes. |
| workspace check | `cargo check` | pass | Full workspace compiles after implementation commits `891d323` and `66496cf`. |
| contracts check | `cargo check -p method-library-contracts` or the formal contracts package check | pass | `cargo check -p method-library-contracts` passes after the selector/ref-kind registry and export changes. |
| application check | `cargo check -p method-library-application` or the formal application package check | pass | `cargo check -p method-library-application` passes for the definition/catalog accepted-service slice. |
| infra check | `cargo check -p method-library-infra` or the formal infra package check | pass | `cargo check -p method-library-infra` passes for the in-memory fake/runtime support. |
| api check | `cargo check -p method-library-api` or the formal API package check if API files changed | pass | `cargo check -p method-library-api` passes for the minimal facade-only API entry. |
| service-flow-fast definition | targeted definition/catalog service-flow tests | pass | `cargo test -p method-library-application -p method-library-api` passed and raw output is captured under `artifacts/test/20260702T073133Z-commit-03-b/suites/service-flow-fast/test-output.txt`; derived report is `reports/runs/20260702T073133Z-commit-03-b/suites/service-flow-fast.md`. |
| infra-runtime-fake definition | targeted fake repository/runtime tests | pass | `cargo test -p method-library-infra` passed and raw output is captured under `artifacts/test/20260702T073133Z-commit-03-b/suites/infra-runtime-fake/test-output.txt`; derived report is `reports/runs/20260702T073133Z-commit-03-b/suites/infra-runtime-fake.md`. |
| dependency boundary | inspect Cargo manifests / metadata for forbidden sibling or reverse dependencies | pass | Workspace manifests keep `application -> contracts/domain`, `infra -> application/contracts/domain`, `api -> application/contracts/infra`; application does not depend on infra or API. |
| redaction fixture scan | check tests/artifacts/reports do not include forbidden raw body/secret/provider/config material | pass | A targeted `rg` scan over current-boundary tests, raw artifacts and reports found no `MethodContent`, `publish`, `snapshot`, `outbox`, `secret`, `provider body`, `raw body`, `http status` or `stack trace` leakage. |
| evidence report | run-scoped `service-flow-fast` / `infra-runtime-fake` artifacts and reports if scripts exist | pass | Raw artifacts were captured under `artifacts/test/20260702T073133Z-commit-03-b/**`; run-scoped reports are `reports/runs/20260702T073133Z-commit-03-b/suites/service-flow-fast.md` and `reports/runs/20260702T073133Z-commit-03-b/suites/infra-runtime-fake.md`; `check_paths.sh` and `generate_reports.sh` dry runs also passed for the same roots. |
| whitespace | `git diff --check` and `git diff --cached --check` before commit | pass | `git diff --check` and `git diff --cached --check` passed before both implementation commits; staged evidence files were whitespace-clean after EOF normalization. |
| staged scope | `git diff --cached --name-only` | pass | Final commit scope stayed inside allowed contracts/domain/application/infra/api files plus the current-boundary `artifacts/test/20260702T073133Z-commit-03-b/**` and `reports/runs/20260702T073133Z-commit-03-b/**` outputs. |

---

## Gate Matrix

| gate | status | evidence | next_if_failed |
|---|---|---|---|
| activation_gate | pass | `commit-03-a` handoff is closed and the project ledger has advanced to `commit-03-b`; activation completed before the design blockers were recorded, and the latest design closure resumes this boundary from `read_docs`. | read_docs |
| design_gate | pass | Required reads were rerun against baseline `current-design-with-commit-03-b-truth-ref-factory-closure`; no new carrier, selector/source map, helper parameter, opaque ref, truth ref, lifecycle/status state or evidence schema had to be invented locally. | scope_gate |
| scope_gate | pass | Implementation stayed inside the allowed contracts/domain/application/infra/api definition/catalog slice plus run-scoped evidence outputs only. | worktree_gate |
| worktree_gate | pass | Pre-edit and final worktree audits preserved the unrelated untracked `.gitignore`; `.codex/` and `target/` were never staged. | build_gate |
| build_gate | pass | `cargo fmt --all`, `cargo check`, `cargo check -p method-library-contracts`, `cargo check -p method-library-application`, `cargo check -p method-library-infra` and `cargo check -p method-library-api` all pass. | test_gate |
| test_gate | pass | `cargo test -p method-library-contracts -p method-library-domain`, `cargo test -p method-library-application -p method-library-api` and `cargo test -p method-library-infra` all pass inside the current-boundary definition/catalog slice. | evidence_gate |
| evidence_gate | pass | Run-scoped raw artifacts and derived reports were generated under `artifacts/test/20260702T073133Z-commit-03-b/**` and `reports/runs/20260702T073133Z-commit-03-b/**`, with matching path/report dry-run validation. | commit_gate |
| commit_gate | pass | Commit scope, subjects/body groups, whitespace and required checks were rechecked across implementation commits `891d323` and `66496cf`. | handoff_gate |
| handoff_gate | pass | Implementation commits, targeted checks, run-scoped evidence and untouched user-change audit close this boundary. | start_next_boundary |

---

## Commit Gate

| gate | status | evidence |
|---|---|---|
| staged_scope | pass | Commit `891d323` stayed inside allowed contracts/domain/application/infra/api files, and commit `66496cf` stayed inside the allowed run-scoped artifact/report outputs. |
| unrelated_changes | pass | The user-owned untracked `.gitignore` remained outside both commits. |
| commit_message_format | pass | Current boundary is delivered by `feat(definition): add definition service flow` and `test(definition): add commit-03-b suite evidence`. |
| commit_body_group | pass | Both implementation commits include the required body groups `Definition service flow:` and `Repository fake and minimal entry:`. |
| whitespace | pass | `git diff --cached --check` passed before each commit and the committed evidence files are whitespace-clean. |
| required_checks | pass | Required Checks now contain only `pass` outcomes with concrete command, artifact or report evidence. |

---

## Handoff Gate

| gate | status | evidence |
|---|---|---|
| committed_hash | pass | Implementation handoff closes on evidence commit `66496cf`, following service-flow commit `891d323`. |
| committed_message | pass | `test(definition): add commit-03-b suite evidence` after `feat(definition): add definition service flow`. |
| gates_run | pass | Handoff audit ran `git status --short`, `git config user.name`, `git config user.email`, `cargo fmt --all`, `cargo check`, `cargo check -p method-library-contracts`, `cargo check -p method-library-application`, `cargo check -p method-library-infra`, `cargo check -p method-library-api`, `cargo test -p method-library-contracts -p method-library-domain`, `cargo test -p method-library-application -p method-library-api`, `cargo test -p method-library-infra`, `bash scripts/checks/check_paths.sh --run-id 20260702T073133Z-commit-03-b --artifact-root artifacts/test/20260702T073133Z-commit-03-b --report-root reports/runs/20260702T073133Z-commit-03-b`, `bash scripts/reports/generate_reports.sh --run-id 20260702T073133Z-commit-03-b --artifact-root artifacts/test/20260702T073133Z-commit-03-b --report-root reports/runs/20260702T073133Z-commit-03-b`, `git diff --check` and `git diff --cached --check`. |
| tests_not_run | pass | No formalization/version, query/material, publisher/worker, job, external summary dereference or release/acceptance suites were run because they belong to later boundaries. |
| remaining_blockers | pass | No remaining blocker was found inside `commit-03-b`; future boundary activation remains outside this handoff. |
| final_conclusion | pass | `commit-03-b` allowed scope is implemented and handoff is closed by implementation commits `891d323` and `66496cf` plus successful targeted checks and run-scoped `service-flow-fast` / `infra-runtime-fake` evidence. |
| user_owned_changes_untouched | pass | Implementation handoff preserved user-owned untracked `.gitignore`; `.codex/` and `target/` remained unstaged. |

---

## Blockers

| blocker_id | gate | status | blocking_reason | requested_design_closure | next_allowed_action |
|---|---|---|---|---|---|
| BLK-ML-03B-ACTIVATION-001 | activation_gate | resolved | Project ledger had not advanced through `commit-03-a`; this future boundary could not be used for implementation yet. | `commit-03-a` handoff is now closed, the project ledger advances to `commit-03-b`, and implementation must continue from `read_docs`. | read_docs |
| BLK-ML-03B-DESIGN-001 | design_gate | resolved | `MethodAssetApiCommandHandlerEntry` previously depended on `MethodAssetCommandFamilyKind` and `MethodAssetApplicationDispatchRef` without a formal application dispatch/service boundary. | Formal `03` §6.3A and Step 7 `R7.10A` now close `MethodAssetCommandFamilyKind` as `MethodLibraryCapabilityKind::DefinitionCatalog`, `MethodAssetApplicationDispatchRef` as an application-owned opaque dispatch marker, and `MethodAssetDefinitionCatalogCommandFacade.dispatch_definition_catalog_command(input)` as the current-boundary facade. | read_docs |
| BLK-ML-03B-DESIGN-002 | design_gate | resolved | Repository/UoW/stored-result semantics previously stopped at family-level exact-read / lookup / versioned-save semantics. | Formal `03` §6.3A / §10.2A, Step 7 `R7.10A` and Step 11 §3A/§3B now close `Versioned<T>`, `VersionedRef<TRef>`, `MethodAssetRepositoryVersion`, `MethodAssetExpectedVersion`, exact definition/catalog repository methods, stored-result repository methods, UoW transaction order, fake parity and duplicate replay. | read_docs |
| BLK-ML-03B-DESIGN-003 | design_gate | resolved | `03_ddd_step_07_trait_port_adapter.md` named `MethodAssetDefinitionCatalogCommandDispatchInput` / `Output`, six `*Input` carriers and stored-result repository signatures, but did not close the exact Rust-facing shapes of those carriers or the referenced application-owned replay/idempotency refs and `MethodAssetRepositoryError`; `03_ddd_step_06_object_contracts.md` only listed those support refs by name. | Formal `03` §6.3A, Step 6 `3B` and Step 7 `R7.10A` now close the exact struct/newtype/enum schema for facade I/O, six service input carriers, `MethodAssetOperationContextRef` / `MethodAssetIdempotencyKeyRef` / `MethodAssetOperationDigestRef` / `MethodAssetDedupScopeRef` / `MethodAssetStoredOperationResultRef`, accepted/rejected/effect/replay result refs, stored result carriers and the `MethodAssetRepositoryError` variant surface used by current-boundary repositories. | read_docs |
| BLK-ML-03B-DESIGN-004 | design_gate | resolved | Step 6 `3B.1` requires exact application-owned `MethodLibraryTypedBoundaryRefKind` labels for `MethodAssetOperationContextRef`, replay/idempotency refs, `MethodAssetApplicationDispatchRef` and `MethodAssetApiEntryContextRef`, but the owning kind registry is `crates/contracts`. | Allowed Scope now includes minimal `/crates/contracts/src/**` and `/crates/contracts/tests/**` changes only for Step 6 `3B.1` / `3B.1A` ref kind labels, named wrapper/export plumbing and selector fixtures; unrelated contracts DTO/payload work remains forbidden. | read_docs |
| BLK-ML-03B-DESIGN-005 | design_gate | resolved | `MethodLibraryCommandShell` was shell-only and Step 7 / Step 9 needed dispatch into six exact service inputs without a formal selector source. | Step 6 `3B.1A`, Step 7 `R7.10A` §1B and Step 9 definition/catalog notes now define `command_shell.boundary_ref.kind` as the only selector source, list six exact intent labels, map them 1:1 to selector variants/service inputs/methods, and require safe rejection for unsupported/unknown/missing selector. | read_docs |
| BLK-ML-03B-DESIGN-006 | design_gate | resolved | Selector closure was not enough to implement the accepted path because structured accepted fields were not present in `MethodLibraryCommandShell`. | Step 6 `3B.1B` now introduces `MethodAssetDefinitionCatalogCommandSource`; Step 7 `R7.10A` §1A / §1C adds it to dispatch input and defines selector/source match, field copy rules, expected-version load, safe rejection and duplicate digest canonicalization. | read_docs |
| BLK-ML-03B-DESIGN-007 | design_gate | resolved | `RetireMethodAssetDefinitionFlow` needed a persistable `Active -> Retired` truth carrier and post-retire guard source. | Formal `03` §6/§9/§10, Step 6, Step 7, Step 9 and Step 10 now close `MethodAssetDefinitionLifecycle = Active | Retired` as `MethodAssetDefinition.definition_lifecycle`; establish initializes `Active`, adjust requires/preserves `Active`, retire persists `Retired`, and repository fake/durable implementations must return the lifecycle through `Versioned<MethodAssetDefinition>` without private side-state. | read_docs |
| BLK-ML-03B-DESIGN-008 | design_gate | resolved | `RetireMethodAssetDefinitionFlow` previously required formal-version traceability / active-conflict inspection without a current-boundary callable surface. | Formal `03`, Step 7, Step 9, Step 10 and formal `07` now carve that check out of `commit-03-b`;current boundary `retire_definition` only uses definition lifecycle, loaded expected version, safe retirement marker, UoW and stored result. Implementation must not add formal-version repository calls or fake conflict checks. | read_docs |
| BLK-ML-03B-DESIGN-009 | design_gate | resolved | Step 7 required `retire_catalog_entry` / `RetireMethodAssetCatalogEntryInput`, Step 9 required `RetireMethodAssetCatalogEntryFlow` to mark retired, and Step 10 required `Registered -> Retired`, but Step 6 did not close a same-layer catalog-retirement transition helper or exact current-boundary `MethodAssetCatalogEntryStatus` mapping. | Formal `03`, Step 6, Step 9, Step 10 and formal `07` now close `MethodAssetCatalogEntry.mark_retired(retirement_marker_ref: MethodLibrarySafeMarker)`, `Registered == Visible`, register creates `Visible`, reclassify requires/preserves `Visible`, retire requires `Visible` and persists `Retired`;`Pending` / `Hidden` / `Deprecated` are not silently mapped to `Registered`. | read_docs |
| BLK-ML-03B-DESIGN-010 | design_gate | resolved | Step 6 object card did not close the exact same-layer helper signature / field-copy rule for persisted catalog fields required by current boundary. | Formal `03`, Step 6, Step 7 and formal `07` now close `create_for_definition(catalog_entry_ref, definition_ref, catalog_scope_ref, catalog_classification, applicability_summary)` and `reclassify(new_catalog_classification, new_applicability_summary)`;both cover persisted classification/applicability and reject scope mismatch. | read_docs |
| BLK-ML-03B-DESIGN-011 | design_gate | resolved | Step 7 replay-envelope assembly required operation-context and canonical opaque-ref creation, but the callable Rust-facing helper surface remained unclosed. | Formal `03`, Step 6 `3B.1.1`, Step 7 `R7.10A` and formal `07` now close `MethodAssetDefinitionCatalogSupportRefFactory`, replay envelope input/output and build error surfaces;implementation must copy factory outputs and must not mint opaque refs locally. | read_docs |
| BLK-ML-03B-DESIGN-012 | design_gate | resolved | `EstablishMethodAssetDefinitionFlow` and `RegisterMethodAssetCatalogEntryFlow` needed new `MethodAssetDefinitionRef` / `MethodAssetCatalogEntryRef`, but current design did not close an exact current-boundary Rust-facing helper/port for minting those truth refs. | Formal `03`, Step 6 `3B.1.1`, Step 7 `R7.10A`, Step 9 definition/catalog overlay and formal `07` now close `MethodAssetDefinitionCatalogSupportRefFactory.new_definition_ref(...)` / `new_catalog_entry_ref(...)`;services may call them only at establish/register accepted flow points and domain/repository/API/fake code must not mint or replace truth refs. | read_docs |

---

## Experience Review

| item | conclusion | action |
|---|---|---|
| future boundary pre-creation | applies current planned-ledger rule | Pre-created future ledgers must use `planned / wait_until_current` and must not authorize code changes until project ledger advances. |
| accepted service vertical slice | existing design-closure rule applies | Accepted flow, repository fake, UoW and stored result gaps must be fixed in `03/05/06/07` before code; implementation must not invent service semantics. |
| facade/service input exact schema | new closure applies | Naming a dispatch input/output or service `*Input` carrier is insufficient; current boundary must close every field, optionality, source, forbidden fallback and repository error variant before implementation resumes. |
| typed-ref owner scope | new closure applies | When a boundary introduces exact typed-ref kind labels, the allowed scope must include the owning registry/export file or the design must reuse an existing kind; otherwise implementation is forced to越界 or invent local aliases. |
| shared shell selector | new closure applies | A shared shell feeding multiple service inputs must have a formal selector source and 1:1 mapping; selector cannot be inferred from routes, typed_refs ordering, marker text, config or fake maps. |
| accepted-path carrier assembly | new closure applied | Selector closure alone is insufficient when the selected service input needs structured carriers not present in the shared shell. The design must close the exact source carrier / field source map before implementation resumes; `commit-03-b` now uses `MethodAssetDefinitionCatalogCommandSource`. |
| definition lifecycle persistence | new closure applied | `commit-03-b` now exposes `MethodAssetDefinitionLifecycle` in the truth object / repository surface. A current-boundary command flow that retires truth and rejects later updates must keep lifecycle in the persisted truth object, not in state-machine prose, stored result, catalog status or fake-only side-state. |
| flow precondition port closure | new closure applied | A Step 9 / Step 10 precondition that changes accepted vs rejected behavior must either have an exact current-boundary callable surface in Step 7 or be explicitly carved out of the boundary. `commit-03-b` now carves formal-version traceability / active-conflict out of `retire_definition` and defers it to PH-04. |
| catalog retirement transition helper | new closure applied | A Step 9 / Step 10 catalog transition cannot rely on repository-private mutation or inferred status defaults. If current-boundary service requires `retire_catalog_entry`, Step 6 must close the same-layer transition helper and exact Rust-facing status mapping for create/reclassify/retire;`commit-03-b` now maps `Registered` to `Visible` and retires through `mark_retired(MethodLibrarySafeMarker)`. | Implementation resumes from `read_docs` and must not invent private catalog status maps. |
| catalog helper persisted-field coverage | new closure applied | Object helper signatures must carry every persisted field that current-boundary service constructs or updates. `commit-03-b` now closes catalog create/reclassify helpers so classification and applicability cannot be invented, defaulted or left stale in implementation. |
| replay envelope opaque-ref factory | new closure applied | Opaque ref wrapper rows are not enough when implementation must create refs. `commit-03-b` now closes a support ref factory and replay envelope surface;implementation must not mint operation-context, digest, dedup, stored-result or effect refs from strings, timestamps, counters, route/config values or repository ids. |
| truth-ref factory callable surface | new closure applied | Wrapper/kind closure is not enough when accepted create/register flows must create new truth refs. `commit-03-b` now closes `new_definition_ref(...)` and `new_catalog_entry_ref(...)` on the same support ref factory, with exact flow call points and local minting bans. |
