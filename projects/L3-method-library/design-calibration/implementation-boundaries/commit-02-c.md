# commit-02-c implementation ledger

| field | value |
|---|---|
| project | L3-method-library |
| boundary_id | commit-02-c |
| phase | PH-02 contracts / domain foundation |
| design_baseline | `planned-after-commit-02-b-handoff-closure` |
| implementation_repo | `/home/aris/Projects/quantalithos-method-library` |
| status | planned |
| next_allowed_action | wait_until_current |
| current_recovery_point | future application foundation shell boundary; until `commit-02-b` handoff is closed and the project ledger advances, this file may only narrow the later shell scope and must not authorize code edits |

---

## Activation Guard

| rule | status | consequence |
|---|---|---|
| project ledger current_boundary must equal `commit-02-c` | planned | If project ledger still points to an earlier boundary, implementation must not use this file to modify code. |
| `commit-02-b` handoff must be closed | planned | Shared domain foundation must exist before application shell work starts. |
| project ledger must set `next_allowed_action = read_docs` for `commit-02-c` | planned | Until then this boundary remains `wait_until_current`. |

---

## Required Reads

| document | required_section | status | notes |
|---|---|---|---|
| `standards/document/代码实施台账与门禁规范.md` | planned boundary activation, gate matrix, commit and handoff rules | pending | This future boundary cannot be executed until it becomes current. |
| `standards/document/设计真相源闭环与可落码性标准.md` | no invented port method, field, ref family, error family, config or evidence | pending | Any missing shell carrier or exact Rust identifier must return to design. |
| `standards/coding/rust.md` | Rust application module, trait and test conventions | pending | Shell identifiers, comments, rustdoc and tests must stay English. |
| `projects/L3-method-library/00-需求文档.md` | P0 requirements and boundary rules seed | pending | Application foundation must not implement business service flow yet. |
| `projects/L3-method-library/01-架构设计.md` | application responsibility, dependency direction and runtime seam | pending | `application` owns ports; it must not implement concrete adapters. |
| `projects/L3-method-library/02-概要设计.md` | code subject framework, transaction and interaction outline | pending | Reconfirm this boundary is foundation shell only, not accepted flow or runtime behavior. |
| `projects/L3-method-library/03-详细设计.md` | `§4 / §6 / §7 / §9 / §10 / §11 / §12 / §15` | pending | Formal source for application helper names, shell port families, idempotency state labels and current deferrals. |
| `projects/L3-method-library/04-配置设计.md` | config redline and typed binding boundary | pending | This boundary must not invent config keys or runtime bindings. |
| `projects/L3-method-library/05-测试方案.md` | PH-02 application unit tests and artifact/report rules | pending | Current tests are compile-shape and exact-shell-label checks only. |
| `projects/L3-method-library/06-验收标准.md` | ML-TX-001 seed, ML-IDEMP-001 seed and evidence integrity | pending | Current boundary seeds transaction / replay closure but cannot claim service-flow completion. |
| `projects/L3-method-library/07-实施计划.md` | §3, §6, §7, §8, §11 and §12 | pending | Formal `07` keeps `commit-02-c` at application ports/UoW/idempotency shell only. |
| `projects/L3-method-library/design-calibration/03_ddd_step_06_object_contracts.md` | `R6.16` application helper / orchestration support objects | pending | Exact shell carrier names come from Step 6; field materialization remains deferred unless explicitly re-closed. |
| `projects/L3-method-library/design-calibration/03_ddd_step_07_trait_port_adapter.md` | `R7.8` / `R7.10` / `R7.12` / `R7.14` / `R7.16` / `R7.18` | pending | Exact port family names are closed here; concrete method signatures remain intentionally deferred. |
| `projects/L3-method-library/design-calibration/03_ddd_step_10_state_machine.md` | `R10.18` idempotency/runtime boundary supplement | pending | Exact idempotency guard and stored-result state labels are closed here for shell enums. |
| `projects/L3-method-library/design-calibration/03_ddd_step_11_persistence_tx_consistency.md` | `R11.18` / `R11.22` | pending | Confirms stored replay and UoW are shell boundaries here, not concrete persistence behavior. |
| `projects/L3-method-library/design-calibration/03_ddd_step_12_errors_recovery.md` | application error family deferral and no-rerun/manual rules | pending | Application error type names are not yet current-boundary closed and must remain deferred. |
| `projects/L3-method-library/design-calibration/03_ddd_step_13_concurrency_idempotency.md` | `R13.4` / `R13.6` | pending | Exact idempotency decision labels and no-rerun redlines are closed here without lock/TTL/runtime policy. |
| `projects/L3-method-library/design-calibration/03_ddd_step_16_test_cut.md` | application shell test ownership | pending | Use only PH-02 application shell tests. |
| `projects/L3-method-library/design-calibration/07_implementation_plan_step_06_tasks_commit_boundaries.md` | `commit-02-c` row | pending | Allowed scope is application shell ports, UoW shell and idempotency/stored-result shell only. |
| `projects/L3-method-library/design-calibration/07_implementation_plan_step_07_test_acceptance_gates.md` | `commit-02-c` gate row and PH-02 gate | pending | Required checks are application check and shell-focused unit tests. |
| `projects/L3-method-library/design-calibration/07_implementation_plan_step_11_commit_review_delivery.md` | `commit-02-c` commit body grouping | pending | Commit body must include `Application transaction surface:` and `Idempotency and UoW shell:`. |
| `/home/aris/Projects/quantalithos-method-library` git status and `commit-02-b` handoff state | latest implementation state | pending | Must confirm domain foundation landed before this boundary starts. |

---

## Allowed Scope

| type | path_or_rule | status |
|---|---|---|
| allowed_path | `/home/aris/Projects/quantalithos-method-library/crates/application/Cargo.toml` for current-boundary dependency checks only | planned |
| allowed_path | `/home/aris/Projects/quantalithos-method-library/crates/application/src/lib.rs` for module wiring / re-exports only | planned |
| allowed_path | `/home/aris/Projects/quantalithos-method-library/crates/application/src/ports.rs` for exact shell trait families named by Step 7 | planned |
| allowed_path | `/home/aris/Projects/quantalithos-method-library/crates/application/src/unit_of_work.rs` for exact shell UoW / Clock / IdGenerator carriers only | planned |
| allowed_path | `/home/aris/Projects/quantalithos-method-library/crates/application/src/idempotency.rs` for exact shell operation-context / idempotency / stored-result carriers and current-boundary state enums only | planned |
| allowed_path | `/home/aris/Projects/quantalithos-method-library/crates/application/tests/**` for compile-shape and exact-shell-label tests only | planned |
| allowed_path | `/home/aris/Projects/quantalithos-method-library/artifacts/test/<run_id>/suites/contract-domain-fast/**` only if generated by an actual targeted run after activation | planned |
| allowed_path | `/home/aris/Projects/quantalithos-method-library/reports/runs/<run_id>/suites/contract-domain-fast.md` only if generated from raw artifact after activation | planned |
| allowed_rule | Add only shell trait families named by Step 7 current closure: `MethodAssetDefinitionRepository`, `MethodAssetCatalogEntryRepository`, `FormalizationStateRepository`, `FormalMethodAssetVersionRepository`, `MethodAssetCommittedTruthSnapshotReader`, `FormalizationBasisSummaryRepository`, `ExternalSourceSummaryRepository`, `MethodAssetConsumptionMaterialRepository`, `MethodAssetTraceMaterialRepository`, `ConsumptionImpactSummaryRepository`, `MethodAssetAuditTrailRepository`, `MethodAssetEvidenceLineageRepository`, `MethodAssetRelationRepository`, `MethodPackageRepository`, `MethodSetAssemblyRepository`, `FormalizationBasisResolverPort`, `MethodAssetPolicyDiagnosticBuilderPort`, `MethodAssetConsumptionAvailabilityResolverPort`, `MethodAssetQueryReadResolverPort`, `MethodAssetDegradedDecisionMapperPort`, `DistributionReadMaterialBuilderPort`, `PeripheralDiscoveryContextBuilderPort`, `MarketplaceContextRefResolverPort`, `MethodAssetInboundSourcePort`, `ExternalBodyFreeSourceAdapterPort`, `MethodAssetEventCandidatePublisherPort`, `MethodAssetCollaborationHandoffPort`, `MethodAssetCollaborationTargetRegistryPort`, `MethodAssetRefreshTargetPlannerPort`, `MethodAssetJobCheckpointStorePort`, `MethodAssetRuntimeAssemblyRegistryPort`, `MethodAssetAdapterAvailabilityPort`. | planned |
| allowed_rule | Add only shell helper carriers `MethodAssetOperationContext`, `MethodAssetIdempotencyGuard`, `MethodAssetStoredOperationResult` plus exact current-boundary enums `MethodAssetIdempotencyDecisionKind` = `Fresh | DuplicateReplay | Conflict | Rejected | ReplayUnavailable` and `MethodAssetStoredOperationResultKind` = `Accepted | Rejected | Ignored | Conflict`. | planned |
| allowed_rule | Add only shell transaction carriers labeled exactly by Step 7 `UnitOfWork`, `Clock` and `IdGenerator`; keep them trait-only and body-free in the current boundary. | planned |
| allowed_rule | Add unit tests proving module export, trait-shell compile shape, exact enum labels and no forbidden dependency direction without any concrete repository/runtime behavior. | planned |
| forbidden_rule | Do not add concrete trait methods, associated types, argument lists, return DTOs, error codes or persistence semantics for any port family in this boundary. | active |
| forbidden_rule | Do not materialize local `*Ref`, `*ReasonRef`, `*MarkerRef`, `*HintRef`, `*RefSet`, `*KindSet`, version wrapper or page/cursor wrapper families in this boundary. | active |
| forbidden_rule | Do not materialize `MethodAssetReadDecision`, `MethodAssetDegradedDecision`, `MethodAssetInboundIntakeDecision`, `MethodAssetEventCandidateAssembly`, `MethodAssetJobAssemblyContext`, runtime state carriers or any application error family in this boundary. | active |
| forbidden_rule | Do not implement concrete repositories, fake stores, resolvers, mappers, publishers, handoff adapters, runtime builder, API handlers, workers, jobs or scripts. | active |
| forbidden_rule | Do not implement business-specific command/query/consumer/job services, accepted flows, version conflict handling, commit-unknown handling, duplicate replay behavior or rollback behavior. | active |
| forbidden_rule | Do not invent config keys, runtime bindings, transport fields, evidence schema, report schema or observability payloads. | active |
| forbidden_rule | Do not read config/env, filesystem, network, system clock or adapter output except through the exact shell carriers that are formally closed here. | active |
| forbidden_rule | Do not stage unrelated user changes, generated target directories or implementation outputs from previous boundaries. | active |

---

## Required Checks

| check | command_or_evidence | status | notes |
|---|---|---|---|
| activation guard | project ledger shows `current_boundary = commit-02-c` and `next_allowed_action = read_docs` | pending | Must pass before any implementation edit. |
| prior handoff | `commit-02-b` implementation commit and handoff recorded | pending | Domain foundation must exist. |
| worktree baseline | `git -C /home/aris/Projects/quantalithos-method-library status --short` | pending | Record before edits and protect unrelated files. |
| local git identity | `git -C /home/aris/Projects/quantalithos-method-library config user.name` and `user.email` | pending | Must remain `quantalithos-labs <quantalithos.ai@gmail.com>`. |
| format | `cargo fmt --all` | pending | Run in implementation repo after Rust changes. |
| workspace check | `cargo check` | pending | Ensures the full workspace still compiles. |
| application check | `cargo check -p method-library-application` | pending | Current boundary is shell-only; package must still compile cleanly. |
| application tests | `cargo test -p method-library-application` | pending | Tests must stay at shell compile-shape / exact-label scope. |
| dependency boundary | inspect Cargo manifests / metadata for forbidden infra/api/worker/jobs compile dependencies in application | pending | Application may depend on contracts/domain only in the current boundary. |
| whitespace | `git diff --check` and `git diff --cached --check` before commit | pending | Required for Commit Gate. |
| staged scope | `git diff --cached --name-only` | pending | Must match Allowed Scope. |

---

## Gate Matrix

| gate | status | evidence | next_if_failed |
|---|---|---|---|
| activation_gate | pending | Boundary remains future-only until project ledger advances from `commit-02-b` to `commit-02-c`. | wait_until_current |
| design_gate | pending | Shell-only closure must be re-read and implementation must confirm that no extra method signature, field family or error family needs to be invented. | wait_design |
| scope_gate | pending | Planned changes must stay inside application shell ports, UoW shell, idempotency/stored-result shell and shell tests only. | wait_design |
| worktree_gate | pending | Initial implementation worktree status recorded; unrelated user changes protected. | fix_gate_failure |
| build_gate | pending | Formatting, workspace check, application check and dependency boundary checks pass or failure is recorded. | fix_gate_failure |
| test_gate | pending | Application shell tests pass after activation. | fix_gate_failure |
| evidence_gate | pending | Targeted artifact/report is optional; any generated report must be run-scoped and raw-artifact-derived. | fix_gate_failure |
| commit_gate | pending | staged scope, commit message, whitespace and required checks have evidence. | fix_gate_failure |
| handoff_gate | pending | commit hash, checks run, tests not run, blockers and next boundary state recorded. | handoff |

---

## Commit Gate

| gate | status | evidence |
|---|---|---|
| staged_scope | pending | Must include only allowed `commit-02-c` application shell files and generated targeted evidence if applicable. |
| unrelated_changes | pending | User-owned unrelated changes must remain unstaged. |
| commit_message_format | pending | Planned subject: `feat(application): add transaction and idempotency foundation` |
| commit_body_group | pending | Body group must include `Application transaction surface:` and `Idempotency and UoW shell:` from Step 11 mapping. |
| whitespace | pending | `git diff --cached --check` must pass. |
| required_checks | pending | Required Checks table must have pass/not_applicable evidence. |

---

## Handoff Gate

| gate | status | evidence |
|---|---|---|
| committed_hash | pending | Fill after implementation repo commit. |
| committed_message | pending | Fill after implementation repo commit. |
| gates_run | pending | List exact commands and targeted reports. |
| tests_not_run | pending | Must state none or explain; cannot claim later business service suites. |
| remaining_blockers | pending | Must reference blocker table; any blocking design gap prevents handoff. |
| final_conclusion | pending | Must be one of pass / fail / cannot_decide with exact evidence source. |
| user_owned_changes_untouched | pending | List unrelated files left untouched. |

---

## Blockers

| blocker_id | gate | status | blocking_reason | requested_design_closure | next_allowed_action |
|---|---|---|---|---|---|
| BLK-ML-02C-ACTIVATION-001 | activation_gate | planned | Project ledger has not yet advanced through `commit-02-b`; this future boundary must not be used for implementation yet. | After `commit-02-b` handoff, update project ledger to `commit-02-c` and set this boundary to current. | wait_until_current |

---

## Experience Review

| item | conclusion | action |
|---|---|---|
| future boundary pre-closure | keep future boundary non-authoritative until activation | Future ledgers may narrow exact scope, but they must remain `planned / wait_until_current` until project ledger advances. |
| application foundation shell | exact current closure is shell-only | Current boundary may name shell carriers and shell traits, but it must defer method signatures, field materialization, error families and concrete persistence/runtime behavior to later closure or later boundaries. |
