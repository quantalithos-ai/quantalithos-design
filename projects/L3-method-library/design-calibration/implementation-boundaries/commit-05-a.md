# commit-05-a implementation ledger

| field | value |
|---|---|
| project | L3-method-library |
| boundary_id | commit-05-a |
| phase | PH-05 controlled consumption and distribution semantics |
| design_baseline | `current-design-with-commit-05-a-consumption-carrier-closure` |
| implementation_repo | `/home/aris/Projects/quantalithos-method-library` |
| status | ready |
| next_allowed_action | read_docs |
| current_recovery_point | Design closed the controlled-consumption material state, guard/boundary carriers and availability-marker source surface. Implementation must restart from this ledger `read_docs` sequence, reread all Required Reads and rerun Design Gate / Scope Gate before editing contracts/domain code. |

---

## Activation Guard

| rule | status | consequence |
|---|---|---|
| project ledger current_boundary must equal `commit-05-a` | pass | Project ledger now points to `commit-05-a`; implementation may use this file only within the controlled consumption contracts/domain scope. |
| `commit-04-b` handoff must be closed | pass | Formalization/version service and stored replay handoff is closed by implementation commits `ce425b55fa3726f0149ae338ad9337e684e45f93` and `1672e71f3fbe5e1b4035c1f3bf7c394aad7a162f`. |
| project ledger must set `next_allowed_action = read_current_boundary_ledger` for `commit-05-a` | pass | Project ledger now requires rereading this current boundary ledger, then this ledger requires `read_docs` before implementation edits. |

---

## Required Reads

| document | required_section | status | notes |
|---|---|---|---|
| `standards/document/代码实施台账与门禁规范.md` | planned boundary activation, gate matrix, commit and handoff rules | pending | Implementation must reread before code; blocker handling still requires `blocked / wait_design` if any current-boundary closure is missing or contradictory. |
| `standards/document/设计真相源闭环与可落码性标准.md` | no invented consumption material, guard, availability marker, downstream truth or evidence schema | pending | Includes current-boundary marker/watch closure rule;implementation must not invent material state, guard carrier or availability marker source. |
| `standards/coding/rust.md` | Rust contract/domain module, error and test conventions | pending | Source identifiers, comments, rustdoc, errors and test names must be English. |
| `projects/L3-method-library/00-需求文档.md` | controlled consumption scope and Definition vs Use boundary | pass | Re-read and confirmed `VETO-ML-003` / `VETO-ML-004` remain blocking for any controlled-consumption implementation. |
| `projects/L3-method-library/01-架构设计.md` | Definition vs Use, downstream boundary and dependency direction | pending | Must confirm current guard/boundary implementation does not allow downstream truth replacement. |
| `projects/L3-method-library/02-概要设计.md` | consumption material key objects and availability outline | pending | Must compare key objects against formal `03` §6.3C and Step 6 `4C` current closure. |
| `projects/L3-method-library/03-详细设计.md` | consumption object contracts, protocol contracts, state matrix, errors and test cut | pending | Must include §6.3C `commit-05-a` implementation-facing controlled-consumption carrier closure. |
| `projects/L3-method-library/04-配置设计.md` | availability, degraded/unavailable and downstream handoff boundary | pass | Re-read and confirmed this boundary still cannot defer missing marker schema to runtime/adapter work. |
| `projects/L3-method-library/05-测试方案.md` | contract-domain-fast consumption material and artifact/report rules | pass | Re-read; no evidence run was started because code activation did not pass Design Gate. |
| `projects/L3-method-library/06-验收标准.md` | ML-FG-003/007/008 seed, ML-RL-002, `VETO-ML-003` and `VETO-ML-004` | pass | Re-read and confirmed acceptance redlines; the current gate stopped before any implementation because those risks cannot be audited without exact formal closure. |
| `projects/L3-method-library/07-实施计划.md` | §3, §6, §7, §8, §11 and §12 | pending | Must confirm `commit-05-a` scope is contracts/domain only and excludes service/repository/runtime/query/evidence behavior. |
| `projects/L3-method-library/design-calibration/03_ddd_step_05_module_contracts.md` | consumption/distribution module boundary | pending | Must use current module boundaries; do not invent modules. |
| `projects/L3-method-library/design-calibration/03_ddd_step_06_object_contracts.md` | consumption material, availability marker and guard object contracts | pending | Must include Step 6 `4C` exact typed refs, state carriers, safe reason wrappers, support carriers and availability marker carrier. |
| `projects/L3-method-library/design-calibration/03_ddd_step_08_protocol_contracts.md` | consumption material DTO shells | pending | Protocol scope must copy closed contracts/domain carriers and must not add service/runtime behavior. |
| `projects/L3-method-library/design-calibration/03_ddd_step_10_state_machine.md` | consumption state and availability guard matrix | pending | Must include `MethodAssetConsumptionMaterial` exact state mapping and Step 10 `8.2` current-boundary controlled-consumption state closure supplement. |
| `projects/L3-method-library/design-calibration/03_ddd_step_12_errors_recovery.md` | consumption safe error surfaces | pending | Must include Step 12 `6.1` material availability marker closure and missing-source blocker rule. |
| `projects/L3-method-library/design-calibration/03_ddd_step_16_test_cut.md` | contract-domain-fast consumption ownership | pending | Must cover contract/domain exact-label, copy-only marker and no-downstream-truth tests. |
| `projects/L3-method-library/design-calibration/07_implementation_plan_step_06_tasks_commit_boundaries.md` | `commit-05-a` row | pending | Must verify allowed scope and forbidden runtime/service/query/evidence scope. |
| `projects/L3-method-library/design-calibration/07_implementation_plan_step_07_test_acceptance_gates.md` | `commit-05-a` gate row and PH-05 gate | pending | Required checks are contract-domain-fast consumption material and VETO targeted audit. |
| `projects/L3-method-library/design-calibration/07_implementation_plan_step_11_commit_review_delivery.md` | `commit-05-a` commit body grouping | pending | Commit body must include `Consumption material contracts:` and `Definition versus use guards:`. |
| `/home/aris/Projects/quantalithos-method-library` git status and `commit-04-b` handoff state | latest implementation state | pending | Must recheck before edits; prior report recorded user-owned `?? .gitignore` and `commit-04-b` closed by `ce425b55fa3726f0149ae338ad9337e684e45f93` / `1672e71f3fbe5e1b4035c1f3bf7c394aad7a162f`. |

---

## Allowed Scope

| type | path_or_rule | status |
|---|---|---|
| allowed_path | `/home/aris/Projects/quantalithos-method-library/crates/contracts/src/**` for consumption material DTOs, typed refs, availability markers and public error/result shells assigned to `commit-05-a` | planned |
| allowed_path | `/home/aris/Projects/quantalithos-method-library/crates/contracts/tests/**` for consumption material contract fixture tests | planned |
| allowed_path | `/home/aris/Projects/quantalithos-method-library/crates/domain/src/**` for consumption material domain object, Definition vs Use guard, availability marker guard and safe errors assigned to `commit-05-a` | planned |
| allowed_path | `/home/aris/Projects/quantalithos-method-library/crates/domain/tests/**` for consumption guard and availability marker tests | planned |
| allowed_path | `/home/aris/Projects/quantalithos-method-library/artifacts/test/<run_id>/suites/contract-domain-fast/**` only if generated by an actual targeted run after activation | planned |
| allowed_path | `/home/aris/Projects/quantalithos-method-library/reports/runs/<run_id>/suites/contract-domain-fast.md` only if generated from raw artifact after activation | planned |
| allowed_rule | Add consumption material request/result/view shell DTOs, Definition vs Use guard, availability marker wrappers, state guards and safe domain errors explicitly defined by formal design. | planned |
| allowed_rule | Add focused contract/domain tests for formalized-only consumption, non-formal/non-approved rejection, availability marker copy-only and downstream truth exclusion. | planned |
| forbidden_rule | Do not implement consumption/distribution application service, availability mapper service, downstream runtime, handoff shell fake, repository fake, API handler, worker, publisher or job behavior. | active |
| forbidden_rule | Do not implement distribution context, handoff delivery, real handoff target, event publishing, trace/audit/impact, external/peripheral, query/material or report generator behavior. | active |
| forbidden_rule | Do not add concrete storage, fake repository maps, runtime builder, config loader, real downstream adapter, release evidence, acceptance handoff or VETO checklist. | active |
| forbidden_rule | Do not invent consumption fields, Definition vs Use rules, availability marker source, degraded/unavailable marker values, error variants, config keys or evidence schema not closed by formal `03/05/06/07`. | active |
| forbidden_rule | Do not let downstream use truth replace definition/formalization truth, consume non-formal material, or treat unavailable/degraded material as accepted success. | active |
| forbidden_rule | Do not use raw body, external provider response, secret, config/env value, full sensitive ref, stack trace or old MethodContent/publish/snapshot/outbox material in DTOs/tests. | active |
| forbidden_rule | Do not stage unrelated user changes, generated target directories or implementation outputs from previous boundaries. | active |

---

## Required Checks

| check | command_or_evidence | status | notes |
|---|---|---|---|
| activation guard | project ledger shows `current_boundary = commit-05-a` and `next_allowed_action = read_current_boundary_ledger`; this ledger shows `next_allowed_action = read_docs` | pending | Implementation must verify both ledgers before edits. |
| prior handoff | `commit-04-b` implementation commit and handoff recorded | pass | PH-04 formalization/version service and replay slice is recorded at `ce425b55fa3726f0149ae338ad9337e684e45f93` and `1672e71f3fbe5e1b4035c1f3bf7c394aad7a162f`. |
| worktree baseline | `git -C /home/aris/Projects/quantalithos-method-library status --short` | pending | Record before edits and protect unrelated files. |
| local git identity | `git -C /home/aris/Projects/quantalithos-method-library config user.name` and `user.email` | pending | Must remain `quantalithos-labs <quantalithos.ai@gmail.com>`. |
| format | `cargo fmt --all` | pending | Run in implementation repo after Rust changes. |
| workspace check | `cargo check` | pending | Ensures the full workspace still compiles. |
| contracts check | `cargo check -p method-library-contracts` or the formal contracts package check | pending | Use actual package name from formal workspace once activated. |
| domain check | `cargo check -p method-library-domain` or the formal domain package check | pending | Use actual package name from formal workspace once activated. |
| contract-domain-fast consumption | targeted consumption material contract-domain tests | pending | Must cover exact labels, wrong-kind refs, body-free carriers, copy-only marker transition and downstream truth exclusion. |
| VETO targeted audit | check `VETO-ML-003` / `VETO-ML-004` risk is not introduced | pending | Downstream truth replacement or invalid consumption blocks commit. |
| redaction fixture scan | check tests/fixtures do not include forbidden raw body/secret/provider/config material | pending | Required for body-free consumption boundary. |
| evidence report | run-scoped `contract-domain-fast` artifact/report if scripts exist | pending | Optional until scripts exist; generated reports must derive from raw artifacts. |
| whitespace | `git diff --check` and `git diff --cached --check` before commit | pending | Required for Commit Gate. |
| staged scope | `git diff --cached --name-only` | pending | Must match Allowed Scope. |

---

## Gate Matrix

| gate | status | evidence | next_if_failed |
|---|---|---|---|
| activation_gate | pending | `commit-04-b` handoff is closed and the project ledger has advanced to `commit-05-a`; implementation must verify both ledgers before code edits. | read_docs |
| design_gate | pending | Formal `03` §6.3C, Step 6 `4C`, Step 10 `8.2`, Step 12 `6.1`, formal `07` and this boundary now close the current-boundary controlled-consumption state/carrier/availability-marker surface; implementation must reread and verify. | wait_design |
| scope_gate | pending | Planned work must remain limited to allowed `crates/contracts` and `crates/domain` consumption slice. | fix_gate_failure |
| worktree_gate | pending | Initial implementation worktree status must be recorded; unrelated user changes protected. | fix_gate_failure |
| build_gate | pending | Formatting, workspace/contract/domain checks and dependency boundary checks pass or failure is recorded. | fix_gate_failure |
| test_gate | pending | Contract-domain-fast consumption material slice and VETO targeted checks pass after activation. | fix_gate_failure |
| evidence_gate | pending | Targeted artifact/report is optional; any generated report must be run-scoped and raw-artifact-derived. | fix_gate_failure |
| commit_gate | pending | staged scope, commit message, whitespace and required checks have evidence. | fix_gate_failure |
| handoff_gate | pending | commit hash, checks run, tests not run, blockers and next boundary state recorded. | handoff |

---

## Commit Gate

| gate | status | evidence |
|---|---|---|
| staged_scope | pending | Must include only allowed `commit-05-a` consumption contract/domain files and generated targeted evidence if applicable. |
| unrelated_changes | pending | User-owned unrelated changes must remain unstaged. |
| commit_message_format | pending | Planned subject: `feat(consumption): add controlled consumption material` |
| commit_body_group | pending | Body group must include `Consumption material contracts:` and `Definition versus use guards:` from Step 11 mapping. |
| whitespace | pending | `git diff --cached --check` must pass. |
| required_checks | pending | Required Checks table must have pass/not_applicable evidence. |

---

## Handoff Gate

| gate | status | evidence |
|---|---|---|
| committed_hash | pending | Fill after implementation repo commit. |
| committed_message | pending | Fill after implementation repo commit. |
| gates_run | pending | List exact commands and targeted reports. |
| tests_not_run | pending | Must state none or explain; cannot claim distribution/handoff service suites. |
| remaining_blockers | pending | Must reference blocker table; any blocking design gap prevents handoff. |
| final_conclusion | pending | Must be one of pass / fail / cannot_decide with exact evidence source. |
| user_owned_changes_untouched | pending | List unrelated files left untouched. |

---

## Blockers

| blocker_id | gate | status | blocking_reason | requested_design_closure | next_allowed_action |
|---|---|---|---|---|---|
| BLK-ML-05A-ACTIVATION-001 | activation_gate | resolved | Project ledger had not advanced through `commit-04-b`; this future boundary could not be used for implementation yet. | `commit-04-b` handoff is now closed, project ledger advances to `commit-05-a`, and implementation must continue from `read_docs` and rerun the current-boundary Design Gate before editing code. | read_docs |
| BLK-ML-05A-DESIGN-001 | design_gate | resolved | Formal `03` and Step 10 previously used conflicting material state labels. | Formal `03` §6.3C, Step 6 `4C.3` and Step 10 `MethodAssetConsumptionMaterial` / `8.2` now close `MethodAssetConsumptionMaterialState = Prepared | Ready | Stale | Unavailable | Constrained`, map historical `degraded` to `Constrained` and exclude local material `Retired`. | read_docs |
| BLK-ML-05A-DESIGN-002 | design_gate | resolved | Step 6 object cards previously named consumption/guard/boundary refs and support carriers without one current-boundary Rust-facing closure. | Formal `03` §6.3C and Step 6 `4C.1`~`4C.5` now close exact typed refs, safe reason wrappers, body-free support carriers, guard/boundary state carriers and object helper closure. | read_docs |
| BLK-ML-05A-DESIGN-003 | design_gate | resolved | Availability marker wrappers/tests were in scope while marker source was still a watch item. | Formal `03` §6.3C, Step 6 `4C.2`, Step 10 `8.2` and Step 12 `6.1` now close `MethodAssetConsumptionAvailabilityMarker`, target/source enums, copy-only transition and missing-source blocker rule. | read_docs |

---

## Experience Review

| item | conclusion | action |
|---|---|---|
| future boundary pre-creation | applies current planned-ledger rule | Pre-created future ledgers must use `planned / wait_until_current` and must not authorize code changes until project ledger advances. |
| controlled consumption guards | standards updated | Added current-boundary marker/watch closure rule to `standards/document/设计真相源闭环与可落码性标准.md`; consumption material, Definition vs Use guard and availability marker gaps are now closed in formal `03`, Step 6, Step 10, Step 12 and this ledger. |

## Blocker BLK-ML-05A-DESIGN-001

- status: resolved by `current-design-with-commit-05-a-consumption-carrier-closure`.
- Formal `03` §6.3C, Step 6 `4C.3` and Step 10 `MethodAssetConsumptionMaterial` / `8.2` now define the only Rust-facing material state as `MethodAssetConsumptionMaterialState = Prepared | Ready | Stale | Unavailable | Constrained`.
- Historical / display labels are fixed: `preparing -> Prepared`, `available -> Ready`, `stale -> Stale`, `unavailable -> Unavailable`, `degraded -> Constrained`;`retired` is not material state and is enforced through `FormalMethodAssetVersionState::Retired`.

## Blocker BLK-ML-05A-DESIGN-002

- status: resolved by `current-design-with-commit-05-a-consumption-carrier-closure`.
- Formal `03` §6.3C and Step 6 `4C.1`~`4C.5` now define exact consumption typed refs, safe reason wrappers, body-free support carriers, object fields, helper signatures and test redlines.
- Current boundary must use `DefinitionUseBoundaryGuardState = Monitoring | ViolationRecorded | RejectedCandidate | ManualReviewRequired` and `DownstreamConsumptionBoundaryState = Registered | Unsupported | Constrained | Unavailable | Retired`;the older `commit-02-b` generic shell supplement is not authoritative for `commit-05-a` controlled-consumption carrier implementation.

## Blocker BLK-ML-05A-DESIGN-003

- status: resolved by `current-design-with-commit-05-a-consumption-carrier-closure`.
- Formal `03` §6.3C, Step 6 `4C.2`, Step 10 `8.2` and Step 12 `6.1` now define `MethodAssetConsumptionAvailabilityMarker`, `MethodAssetConsumptionAvailabilityTarget = Ready | Stale | Unavailable | Constrained` and `MethodAssetConsumptionAvailabilityMarkerSource = AvailabilityResolver | DegradedMapper | DownstreamConsumptionBoundaryGuard`.
- Implementation must copy the marker carrier. Missing marker/source remains a design blocker;raw errors, runtime state, query result or fake private enum must not synthesize availability/degraded/unavailable state.
