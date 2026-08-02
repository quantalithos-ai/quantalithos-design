# CB-SBX-01A implementation ledger

> Created by L4-sandbox Step 13 from the current v7.9-closeout design package.
> This is a planned recovery contract, not proof of implementation, test execution, evidence, review, acceptance, or authorization.
> Current design state: `00~07` design semantics are closed and the technical selections are fixed. This skeleton remains the unique current identity but stays `blocked / activation_gate / handoff` until a reproducible baseline and real Activation prerequisites close.

| field | value |
|---|---|
| project | `L4-sandbox` |
| boundary_id | `CB-SBX-01A` |
| phase | `PH-01` |
| verifiable_goal | 建立可识别七crate且只有core编译依赖的目标workspace。 |
| direct_predecessor | `HDO-SBX-00` |
| design_baseline | `not_fixed` |
| implementation_repo | `/home/aris/Projects/quantalithos-sandbox (absent)` |
| status | `blocked` |
| next_allowed_action | `handoff` |
| current_identity | yes; unique current identity without implementation authorization |
| actor_authority_lock | core `ActorKind`: `Human`, `AiMember`, `System`, `Integration`; P0 worker/job uses `ActorKind::System`; trusted source requires `source_ref` plus envelope/source gate |
| task_ids | `IMPL-SBX-01-01`; `IMPL-SBX-01-02`; `IMPL-SBX-01-03` |
| batch_ids | `BATCH-SBX-01A-01`; `BATCH-SBX-01A-02`; `BATCH-SBX-01A-03` |
| evidence_maturity | G0;design baseline、target repo、toolchain/core现实核验、workspace / graph任一不闭合即不提交 /不激活02A |
| implementation_started | `no` |

## Required Reads

| document | required_section | status | notes |
|---|---|---|---|
| projects/L4-sandbox/design-calibration/project_execution_ledger.md | current recovery point and `v7.9-closeout` | not_run | Read first; design flow is closed; implementation cannot start until the reproducible design baseline and remaining Activation prerequisites close. |
| projects/L4-sandbox/design-calibration/03_ddd_calibration_flow.md | v7.9 current recovery point and current contract lock | not_run | Design flow is closed; implementation still cannot start without Activation prerequisites. |
| projects/L4-sandbox/design-calibration/03_ddd_step_19_formal_document_assembly.md | current Step 19 assembly and downstream propagation | not_run | Current design-only source for capture / handoff / relay / ordinary hook lock. |
| projects/L4-sandbox/design-calibration/07_implementation_plan_step_15_technical_baseline_decisions.md | §2 and §5 | not_run | Exact edition, rust-version, toolchain, resolver, core path/revision and Activation verification split. |
| projects/L4-sandbox/07-实施计划.md | §1, §3, §5~§12 and this exact boundary row in §6 | not_run | Current design-only implementation plan; it does not authorize implementation. |
| projects/L4-sandbox/03-详细设计.md | current §§3~§16 as referenced by the v7.9 assembly | not_run | Current design contract; no runtime or implementation result is implied. |
| projects/L4-sandbox/05-测试方案.md | current design inventory and §15 readiness | not_run | 254 test designs only; no test execution or result exists. |
| projects/L4-sandbox/design-calibration/03_ddd_step_04_file_layout.md | `03_ddd_step_04_file_layout.md` | not_run | Exact calibration or standard reference copied from Step 6 section 7.4. |
| projects/L4-sandbox/design-calibration/07_implementation_plan_step_03_prerequisites_reading.md | Step 3 §7.8~§7.10 | not_run | Exact calibration or standard reference copied from Step 6 section 7.4. |
| projects/L4-sandbox/design-calibration/07_implementation_plan_step_06_tasks_commit_boundaries.md | Rust /目录 /依赖规范 | not_run | Exact calibration or standard reference copied from Step 6 section 7.4. |
| projects/L4-sandbox/design-calibration/07_implementation_plan_step_06_tasks_commit_boundaries.md | §7.1, §7.2, §7.4~§7.8, §7.11; CB-SBX-01A | not_run | Goal, predecessor, closure profiles, scope, tasks, batches, checks, and skeleton schema. |
| projects/L4-sandbox/design-calibration/07_implementation_plan_step_07_test_acceptance_gates.md | §6 and §8; CB-SBX-01A | not_run | Exact suite, AC, VETO, artifact, report, maturity, and review gate. |
| projects/L4-sandbox/design-calibration/07_implementation_plan_step_08_boundary_readiness_matrix.md | CB-SBX-01A readiness row | not_run | Config, environment, adapter, external dependency, and unavailable disposition. |
| projects/L4-sandbox/design-calibration/07_implementation_plan_step_09_boundary_risk_matrix.md | CB-SBX-01A risk row | not_run | Full Spike, Risk, OQ, closure, and safe routing. |
| projects/L4-sandbox/design-calibration/07_implementation_plan_step_10_boundary_control_matrix.md | CB-SBX-01A control row | not_run | Pause, rollback, invalidation, and recovery routing. |
| projects/L4-sandbox/design-calibration/07_implementation_plan_step_11_boundary_commit_message_matrix.md | CB-SBX-01A planned message and commit timing rows | not_run | Exact title, summary, body groups, evidence references, and commit prohibition. |
| projects/L4-sandbox/design-calibration/07_implementation_plan_step_11_review_delivery_audit.md | CB-SBX-01A review and delivery rows | not_run | Independent review, worktree protection, delivery, and handoff discipline. |
| standards/document/代码实施台账与门禁规范.md | project ledger, boundary ledger, nine Gate types, blockers, Commit Gate, and Handoff Gate | not_run | State values and recovery contract. |
| standards/document/设计真相源闭环与可落码性标准.md | boundary codeability and design writeback rules | not_run | Implementation must not invent missing design truth. |
| standards/document/全局项目依赖关系与裁剪规则.md | L4 Sandbox dependency direction and sibling-repository trimming | not_run | Only the allowed core dependency may be compile-time; adjacent products remain ports, events, handoffs, or fakes. |
| standards/document/子项目目录与代码文件组织规范.md | workspace, crate, binary, scripts, artifacts, reports, and implementation-ledger layout | not_run | Directory and code-file organization authority. |
| standards/coding/rust.md | applicable Rust source, tests, formatting, lint, and naming rules | not_run | Target-repository rules may add stricter requirements after repository creation. |

## Allowed Scope

| type | path_or_rule | status |
|---|---|---|
| allowed_path_or_rule | `Cargo.toml` | planned |
| allowed_path_or_rule | `Cargo.lock` | planned |
| allowed_path_or_rule | `.gitignore` | planned |
| allowed_path_or_rule | `.codex/implementation_ledger.md` | planned |
| allowed_path_or_rule | 七个`crates/*/Cargo.toml` | planned |
| allowed_path_or_rule | 七个`crates/*/src/lib.rs` | planned |
| allowed_path_or_rule | 正式binary空入口 | planned |
| included_behavior | `DEL-SBX-CODE-001`;七crate / binary skeleton、Cargo依赖图、target version、local git / scratch入口 | planned |
| boundary_goal | 建立可识别七crate且只有core编译依赖的目标workspace。 | planned |

## Forbidden Scope

| rule | status | failure_action |
|---|---|---|
| 任何业务DTO / state / service / adapter / test结果 / script实现 | active | block_scope_gate; remove the change or reopen design |
| DTO、state、service、adapter、script实现 | active | block_scope_gate; do not stage or commit |
| Do not implement tools semantic execution, runtime agent-loop orchestration, or member lifecycle orchestration inside Sandbox. | active | block_scope_gate; return the concern to its owning project |
| Do not use latest paths, static evidence aliases, prefilled Passed or acceptance decisions, raw secret or process bodies, or unrelated user changes. | active | block_evidence_or_worktree_gate; preserve safe failure material |

## Tasks And Batches

### Tasks

| task_id | order | implementation_action | input | completion_criterion |
|---|---|---|---|---|
| `IMPL-SBX-01-01` | 1 | 核对HDO、design / core baseline、target version、目标路径和本地git身份 | Step 3前置;HDO | 所有值有真实ledger记录,未关闭即停止 |
| `IMPL-SBX-01-02` | 2 | 创建root workspace和七member manifest | `03`§4.2~§4.3 | Cargo metadata识别七member且依赖方向可检查 |
| `IMPL-SBX-01-03` | 3 | 建立library / binary空skeleton和scratch恢复入口 | `03`§4.3~§4.4 | workspace独立check,未引入业务行为 |

### Batches

| batch_id | goal | input_to_output | expected_size | post_batch_check | commit_relation |
|---|---|---|---|---|---|
| `BATCH-SBX-01A-01` | root / member manifest | target baseline -> root +七crate Cargo | 100~200 | `cargo metadata --no-deps`;dependency graph | one commit after every batch passes |
| `BATCH-SBX-01A-02` | crate / binary skeleton | layout map -> lib / bin empty entry | 200~300 | `cargo check --workspace`;binary inventory | one commit after every batch passes |
| `BATCH-SBX-01A-03` | repo guard / scratch | Step 3规则 -> git local config / ignore / scratch | 100~200 | repo root、git config、status保护检查 | one commit after every batch passes |

Subfunction grouping: workspace manifests + crate / binary skeleton + repo guard

Same-commit cause: 共同形成唯一可编译、可恢复、可审查的bootstrap graph;任一缺失都不能独立交付

Verification closure: metadata / workspace check / git identity

Explicitly excluded: 业务行为

## Activation Readiness

| dimension | planned_requirement | actual_status |
|---|---|---|
| config_and_source | 无runtime config;只固定future raw owner /七crate边界 | not_run |
| environment_and_adapter | 不要求ENV实例 | not_run |
| external_and_tooling | HDO;target repo /git;Rust baseline;core exact revision;Cargo metadata /graph /naming | not_run |
| unavailable_disposition | repo /core /version缺失记`dependency_wait`并`blocked / handoff`;design baseline缺失`blocked / wait_design`;无业务claim | not_run |
| boundary_specific_activation | design baseline、target repo策略、edition / rust-version、core revision、git identity | not_run |

## Design Closure And Risk

| field | planned_value | actual_status |
|---|---|---|
| closure_profiles | build / dependency;BASE+BOOT | not_run |
| applicable_experience | path baseline;typed-ref owner scope for future crates;phase boundary;用户改动保护 | not_run |
| formal_evidence_location | `03`§3~§4;Step 3 §7.8~§7.10 | not_run |
| explicit_non_applicability | DTO / state / UoW不适用:本boundary禁止业务类型和行为 | not_run |
| design_level_conclusion | `passed_design_pending_activation`:Rust/core值已固定；design baseline、目标仓与现实兼容核验仍开放 | design_record_only |
| activation_or_design_closure | HDO、目标仓策略、用户文件保护、git identity、Rust baseline、core exact revision /compatibility、only-core graph | not_run |
| safe_route_if_open_or_triggered | design /scope漂移`wait_design`;repo /core /tool缺失记`dependency_wait`并`handoff`;不得创建业务代码、local shared type或commit | not_run |

| reference_type | full_references | execution_status |
|---|---|---|
| spike | `SP-SBX-IMP-001`; `SP-SBX-IMP-002` | not_run |
| risk | `R-SBX-IMP-001`; `R-SBX-IMP-002`; `R-SBX-IMP-003`; `R-SBX-IMP-004`; `R-SBX-IMP-019`; `R-SBX-IMP-020` | not_run |
| open_question | `OQ-SBX-IMP-001`; `OQ-SBX-IMP-002`; `OQ-SBX-IMP-003`; `OQ-SBX-IMP-018` | not_run |

## Required Checks

| check_id | command_or_assertion | required_status | actual_status | evidence |
|---|---|---|---|---|
| CHK-ACTIVATION | Close predecessor HDO-SBX-00; design baseline、target repo策略、edition / rust-version、core revision、git identity | closed_or_formal_blocked | not_run | absent |
| CHK-DESIGN | build / dependency;BASE+BOOT; closure evidence: `03`§3~§4;Step 3 §7.8~§7.10;Step 15 §2; repeat-check rule: fixed Rust/core design, baseline publication and target compatibility remain Activation facts | design_consistent | not_run | absent |
| CHK-SCOPE | Allowed: `Cargo.toml`;`Cargo.lock`;`.gitignore`;`.codex/implementation_ledger.md`;七个`crates/*/Cargo.toml`;七个`crates/*/src/lib.rs`;正式binary空入口; included behavior: `DEL-SBX-CODE-001`;七crate / binary skeleton、Cargo依赖图、target version、local git / scratch入口; forbidden: 任何业务DTO / state / service / adapter / test结果 / script实现; DTO、state、service、adapter、script实现 | scope_clean | not_run | absent |
| CHK-WORKTREE | Record target root, HEAD, initial git status, local identity, user-owned changes, and staged-file ownership. | worktree_recorded | not_run | absent |
| CHK-BUILD | HDO、version / core revision关闭且`cargo metadata --no-deps`;`cargo check --workspace`;package / binary / dependency direction检查完成后 | pass_or_formal_allowed_status | not_run | absent |
| CHK-TEST | direct Cargo / package / binary / dependency graph结构检查;ARCH-001 /003只能在目标仓形成后判定 | all_mandatory_pass | not_run | absent |
| CHK-AC-VETO | AC-SBX-031 ARCH-SLICE;VETO-SBX-005 /016 | assertions_present_and_no_triggered_veto | not_run | absent |
| CHK-ARTIFACT | `no_runtime_artifact`:boundary ledger记录command、target revision与无producer理由 | maturity_contract_satisfied | not_run | absent |
| CHK-REPORT | 无`reports/runs`;handoff摘要记录seven-crate / only-core检查 | paired_report_or_G0_reason | not_run | absent |
| CHK-EVIDENCE-MATURITY | G0;HDO、target version、core revision、workspace / graph任一不闭合即不提交 /不激活02A | status_fidelity_and_safe_failure | not_run | absent |
| CHK-READINESS | Config/source: 无runtime config;只固定future raw owner /七crate边界; ENV/adapter: 不要求ENV实例; external/tool: HDO;target repo /git;Rust baseline;core exact revision;Cargo metadata /graph /naming; unavailable route: repo /core /version缺失记`dependency_wait`并`blocked / handoff`;design baseline缺失`blocked / wait_design`;无业务claim | ready_or_formally_blocked | not_run | absent |
| CHK-RISK | Close or confirm before Activation/Design: HDO、目标仓策略、用户文件保护、git identity、Rust baseline、core exact revision /compatibility、only-core graph; route: design /scope漂移`wait_design`;repo /core /tool缺失记`dependency_wait`并`handoff`;不得创建业务代码、local shared type或commit | closed_or_routed | not_run | absent |
| CHK-STAGED | Run git diff --cached --name-only and git diff --cached --check; staged files must match this boundary and the exact planned message. | scope_and_whitespace_clean | not_run | absent |

## Gate Matrix

| gate | status | evidence | next_if_failed |
|---|---|---|---|
| activation_gate | blocked | not_run | wait_design |
| design_gate | pending | not_run | wait_design |
| scope_gate | pending | not_run | fix_gate_failure |
| worktree_gate | pending | not_run | fix_gate_failure |
| build_gate | pending | not_run | fix_gate_failure |
| test_gate | pending | not_run | fix_gate_failure |
| evidence_gate | pending | not_run | fix_gate_failure |
| commit_gate | pending | not_run | fix_gate_failure |
| handoff_gate | pending | not_run | handoff |

No Gate status above is a runtime pass. A design-level closure record does not satisfy Activation or Design Gate for implementation.

## Evidence And Canonical Paths

Boundary artifact contract: `no_runtime_artifact`:boundary ledger记录command、target revision与无producer理由

Boundary report contract: 无`reports/runs`;handoff摘要记录seven-crate / only-core检查

Planned evidence/review reference: boundary ledger中的Cargo metadata / workspace / dependency graph / git identity direct checks和`no_runtime_artifact`理由

Commit is allowed only when: HDO、目标仓、target version、core revision、only-core graph与workspace checks均真实关闭

Forbidden proof substitution: 空run、ARCH结果、业务行为

| artifact_or_report | canonical_path | status |
|---|---|---|
| raw root | artifacts/test/<run_id> | planned_path_template |
| run summary | reports/runs/<run_id>/summary.md | planned_path_template |
| gate results | reports/runs/<run_id>/gate-results.md | planned_path_template |
| evidence index | reports/runs/<run_id>/evidence-index.md | planned_path_template |
| redaction | reports/runs/<run_id>/redaction-check.md | planned_path_template |
| dependency boundary | reports/runs/<run_id>/dependency-boundary.md | planned_path_template |
| report audit | reports/runs/<run_id>/report-audit.md | planned_path_template |
| acceptance handoff | reports/acceptance/handoff.md | planned_path_template |
| VETO checklist | reports/acceptance/veto-checklist.md | planned_path_template |
| risk acceptance | reports/acceptance/risk-acceptance.md | planned_path_template |
| open issues | reports/acceptance/open-issues.md | planned_path_template |
| human review | reports/review/reviewer-notes.md | planned_path_template |
| agent review | reports/review/agent-review.md | planned_path_template |

Forbidden aliases: `latest`; `gate-summary.md`; `final-decision.md`; `acceptance-summary.md`.

## Commit Plan And Record

| field | value |
|---|---|
| planned_commit_title | `chore(workspace): bootstrap the seven-crate sandbox workspace` |
| planned_commit_summary | `Bootstrap the complete workspace and repository guard for CB-SBX-01A.` |
| planned_body_groups | `Workspace manifests and package graph:`;`Binary entry shells and repository guard:` |
| same_commit_cause | manifests、七crate / binary空入口、only-core依赖和repo guard共同构成唯一可编译bootstrap graph |
| planned_footer | `Co-Authored-By: Codex <noreply@openai.com>` |
| staged_files_checked | `not_run` |
| commit_message_checked | `not_run` |
| committed_hash | `not_committed` |
| committed_message | `not_committed` |
| post_commit_status | `not_run` |

## Review Record

| field | planned_or_actual_value |
|---|---|
| required_review_responsibility | build / architecture reviewer核路径、依赖方向和无业务scope;design owner关闭现实前置 |
| type_and_scope_review | `chore(workspace)`对应bootstrap,scope稳定 |
| body_group_review | manifests / graph与entry / repo guard表达共同bootstrap |
| review_and_evidence_discipline | architecture / build review;G0 direct checks |
| design_discipline_record | current_design_static_closeout_v7.9 |
| future_repeat_check | 目标仓hooks、identity、version和core revision |
| review_status | `not_reviewed` |
| reviewer_identity | `absent` |
| review_findings | `absent` |
| review_evidence | `absent` |

## Delivery Record

| delivery_id | delivery_item | status | future_required_record | actual_reference |
|---|---|---|---|---|
| DLD-SBX-01 | boundary identity | not_run | boundary, phase, baseline, and implementation repo must match both ledgers | absent |
| DLD-SBX-02 | commit record | not_run | future real hash, exact message, parent, and post-commit status | absent |
| DLD-SBX-03 | scope summary | not_run | semantic groups, actual basenames, and approximate deltas | absent |
| DLD-SBX-04 | gates run | not_run | command, exact status, report reference, and reviewer for every required gate | absent |
| DLD-SBX-05 | tests not run | not_run | exact item, reason, impact, and next action | absent |
| DLD-SBX-06 | blocker state | not_run | ID, gate, owner, status, baseline, and legal next action | absent |
| DLD-SBX-07 | artifact and report | not_run | fixed path, schema, digest, source identity, and pairing | absent |
| DLD-SBX-08 | user changes | not_run | untouched list or explicitly authorized shared modifications | absent |
| DLD-SBX-09 | acceptance and review | not_run | real draft and review state bound to a fixed RELEASE | absent |
| DLD-SBX-10 | next boundary | not_run | exact successor, Activation prerequisites, and project-ledger action | absent |

Expected successor after a real Handoff Gate pass: `CB-SBX-02A`. The project ledger alone activates that successor.

## Blockers

| blocker_id | gate | status | reason | design_fix_baseline | next_allowed_action |
|---|---|---|---|---|---|
| `BLK-SBX-HDO-001` | activation_gate | resolved | Step 13 formal package review prerequisite is closed; this does not pass the Activation Gate. | not_fixed | handoff |
| `BLK-SBX-DESIGN-REOPEN-001` | activation_gate / design_gate | resolved_for_design_static_closeout | Step 6~10 regression, Step 19 formal reassembly, downstream `04~07` propagation and current inventory audit are complete. | not_fixed | handoff |
| `BLK-SBX-ACTOR-AUTHORITY-001` | design_gate | resolved_for_design_static_closeout | Core authority is fixed to `Human | AiMember | System | Integration`; P0 worker/job uses `ActorKind::System` only; trusted source is proven by `source_ref` and envelope/source gate. | not_fixed | handoff |
| `BLK-SBX-BASELINE-001` | design_gate | open_wait_explicit_commit_authorization | Reproducible design commit baseline is not fixed; no commit authorization has been given. | not_fixed | handoff |
| `BLK-SBX-REPO-001` | activation_gate | open | Target implementation repository is absent. | not_fixed | handoff |
| `BLK-SBX-VERSION-001` | design_gate | resolved_for_design_selection | edition `2024`, rust-version `1.93`, toolchain `1.93.0`, resolver `2`, core path and required revision are fixed by Step 15. | not_fixed | handoff |
| `BLK-SBX-TOOLCHAIN-VERIFY-001` | activation_gate | open_activation_validation | Target manifest/toolchain, core HEAD/API, only-core graph and Cargo checks are not verified. | not_fixed | handoff |
| `BLK-SBX-GIT-001` | worktree_gate | open | Target-repository git identity, hooks, and branch policy cannot be checked while the repository is absent. | not_fixed | handoff |

## Initial Fact Boundary

| fact | value |
|---|---|
| target_repository_exists | `no` |
| implementation_commit | `not_committed` |
| run_id | `absent` |
| evidence_alias | `absent` |
| test_result | `not_run` |
| review_result | `not_reviewed` |
| acceptance_result | `absent` |
| authorization | `absent` |

## PHYSICAL EOF Current Override: final design closure `DC-05`

This section supersedes historical `wait_design` wording where it referred only to technical selection. No implementation Gate has
passed and no target-repository action is authorized.

```text
boundary_id = CB-SBX-01A
design_baseline = not_fixed
status = blocked
last_gate = activation_gate
next_allowed_action = handoff
technical_selection = completed_design_static_only
rust_core = edition_2024|rust_version_1.93|toolchain_1.93.0|resolver_2|core_ef0d24941fe6e00c24d423ac330347e6e1acb2da
open_activation_blockers = BLK-SBX-BASELINE-001|BLK-SBX-REPO-001|BLK-SBX-TOOLCHAIN-VERIFY-001|BLK-SBX-GIT-001
implementation_started = no
real_commit_count = 0
real_run_count = 0
real_test_execution = not_started
real_evidence_created = no
acceptance_signoff = no
```

## PHYSICAL EOF Current Override: DC-07 disposition completed without publication

Step 17 最终设计静态审计已通过，Step 18 已完成 baseline 发布处置。由于没有明确 commit 授权，design baseline仍未固定，
`BLK-SBX-BASELINE-001`继续开放。本覆盖不构成任何implementation Gate Transition，也不授权目标仓操作。

```text
boundary_id = CB-SBX-01A
design_conclusion = design_closed_ready_for_baseline_publication
design_baseline = not_fixed
baseline_publication_disposition = completed_without_publication
baseline_publication_status = not_published
baseline_blocker = BLK-SBX-BASELINE-001
baseline_blocker_status = open_wait_explicit_commit_authorization
commit_authorization = absent
status = blocked
last_gate = activation_gate
next_allowed_action = handoff
implementation_repo_exists = no
implementation_started = no
real_commit_count = 0
real_run_count = 0
real_test_execution = not_started
real_evidence_created = no
acceptance_signoff = no
```
