# CB-SBX-08B implementation ledger

> Created by L4-sandbox Step 13 from reviewed Step 6~11 matrices.
> This is a planned recovery contract, not proof of implementation, test execution, evidence, review, acceptance, or authorization.

| field | value |
|---|---|
| project | `L4-sandbox` |
| boundary_id | `CB-SBX-08B` |
| phase | `PH-08` |
| verifiable_goal | 打通cleanup guard、redline containment和release=0安全闭环。 |
| direct_predecessor | `CB-SBX-08A` |
| design_baseline | `not_fixed` |
| implementation_repo | `/home/aris/Projects/quantalithos-sandbox (absent)` |
| status | `planned` |
| next_allowed_action | `wait_until_current` |
| current_identity | no; wait for project-ledger activation |
| task_ids | `IMPL-SBX-08-03`; `IMPL-SBX-08-04` |
| batch_ids | `BATCH-SBX-08B-01`; `BATCH-SBX-08B-02`; `BATCH-SBX-08B-03` |
| evidence_maturity | G1;non-Allowed release、early delete、force-clean、advisory redline、ordinary receipt解除containment或无disposition即不提交 |
| implementation_started | `no` |

## Required Reads

| document | required_section | status | notes |
|---|---|---|---|
| projects/L4-sandbox/07-实施计划.md | §1, §3, §5~§12 and this exact boundary row in §6 | not_run | Formal implementation authority and control rules. |
| projects/L4-sandbox/03-详细设计.md | §6 cleanup / redline / lease / §7.3 Commands 9~10 / §8.5 / §9 / §11~§12 | not_run | Exact owner reading copied from Step 6 section 7.4. |
| projects/L4-sandbox/05-测试方案.md | CMD-017~020 | not_run | Exact owner reading copied from Step 6 section 7.4. |
| projects/L4-sandbox/06-验收标准.md | PG-SBX-009/010,VETO safety | not_run | Exact owner reading copied from Step 6 section 7.4. |
| projects/L4-sandbox/design-calibration/03_ddd_step_10_state_matrix.md | `03_ddd_step_10_state_matrix.md` | not_run | Exact calibration or standard reference copied from Step 6 section 7.4. |
| projects/L4-sandbox/design-calibration/04_config_step_11_failure_degradation.md | `04_config_step_11_failure_degradation.md` | not_run | Exact calibration or standard reference copied from Step 6 section 7.4. |
| projects/L4-sandbox/design-calibration/06_acceptance_step_11_veto.md | `06_acceptance_step_11_veto.md` | not_run | Exact calibration or standard reference copied from Step 6 section 7.4. |
| projects/L4-sandbox/design-calibration/07_implementation_plan_step_06_tasks_commit_boundaries.md | §7.1, §7.2, §7.4~§7.8, §7.11; CB-SBX-08B | not_run | Goal, predecessor, closure profiles, scope, tasks, batches, checks, and skeleton schema. |
| projects/L4-sandbox/design-calibration/07_implementation_plan_step_07_test_acceptance_gates.md | §6 and §8; CB-SBX-08B | not_run | Exact suite, AC, VETO, artifact, report, maturity, and review gate. |
| projects/L4-sandbox/design-calibration/07_implementation_plan_step_08_boundary_readiness_matrix.md | CB-SBX-08B readiness row | not_run | Config, environment, adapter, external dependency, and unavailable disposition. |
| projects/L4-sandbox/design-calibration/07_implementation_plan_step_09_boundary_risk_matrix.md | CB-SBX-08B risk row | not_run | Full Spike, Risk, OQ, closure, and safe routing. |
| projects/L4-sandbox/design-calibration/07_implementation_plan_step_10_boundary_control_matrix.md | CB-SBX-08B control row | not_run | Pause, rollback, invalidation, and recovery routing. |
| projects/L4-sandbox/design-calibration/07_implementation_plan_step_11_boundary_commit_message_matrix.md | CB-SBX-08B planned message and commit timing rows | not_run | Exact title, summary, body groups, evidence references, and commit prohibition. |
| projects/L4-sandbox/design-calibration/07_implementation_plan_step_11_review_delivery_audit.md | CB-SBX-08B review and delivery rows | not_run | Independent review, worktree protection, delivery, and handoff discipline. |
| standards/document/代码实施台账与门禁规范.md | project ledger, boundary ledger, nine Gate types, blockers, Commit Gate, and Handoff Gate | not_run | State values and recovery contract. |
| standards/document/设计真相源闭环与可落码性标准.md | boundary codeability and design writeback rules | not_run | Implementation must not invent missing design truth. |
| standards/document/全局项目依赖关系与裁剪规则.md | L4 Sandbox dependency direction and sibling-repository trimming | not_run | Only the allowed core dependency may be compile-time; adjacent products remain ports, events, handoffs, or fakes. |
| standards/document/子项目目录与代码文件组织规范.md | workspace, crate, binary, scripts, artifacts, reports, and implementation-ledger layout | not_run | Directory and code-file organization authority. |
| standards/coding/rust.md | applicable Rust source, tests, formatting, lint, and naming rules | not_run | Target-repository rules may add stricter requirements after repository creation. |

## Allowed Scope

| type | path_or_rule | status |
|---|---|---|
| allowed_path_or_rule | `crates/contracts/src/{commands,events,views}.rs` | planned |
| allowed_path_or_rule | `crates/domain/src/{cleanup,redline,boundary,handoff,relay,audit,errors}.rs` | planned |
| allowed_path_or_rule | `crates/application/src/{commands,services,ports,repositories}.rs` | planned |
| allowed_path_or_rule | `crates/infra/src/{isolation_backend_adapters,handoff_adapters,fakes}.rs` | planned |
| allowed_path_or_rule | `crates/api/src/command_handlers.rs` | planned |
| allowed_path_or_rule | `tests/{domain,service,integration}/**` | planned |
| included_behavior | 同上及`ADP-001`;Commands 9~10、Cleanup / Redline events、guard / containment / lease / release-call primitive | planned |
| boundary_goal | 打通cleanup guard、redline containment和release=0安全闭环。 | planned |

## Forbidden Scope

| rule | status | failure_action |
|---|---|---|
| public Jobs;force cleanup;真实teardown;risk acceptance;材料删除 | active | block_scope_gate; remove the change or reopen design |
| public Job、force cleanup、real teardown、risk acceptance | active | block_scope_gate; do not stage or commit |
| Do not implement tools semantic execution, runtime agent-loop orchestration, or member lifecycle orchestration inside Sandbox. | active | block_scope_gate; return the concern to its owning project |
| Do not use latest paths, static evidence aliases, prefilled Passed or acceptance decisions, raw secret or process bodies, or unrelated user changes. | active | block_evidence_or_worktree_gate; preserve safe failure material |

## Tasks And Batches

### Tasks

| task_id | order | implementation_action | input | completion_criterion |
|---|---|---|---|---|
| `IMPL-SBX-08-03` | 3 | 编写Commands 9~10、Cleanup / Redline events和guard / containment states | PG-SBX-009 /010 | non-Allowed不可release |
| `IMPL-SBX-08-04` | 4 | 编写investigation / release ports、service和no-early-delete tests | CMD-017~020 | guard-first / containment / call budget闭合 |

### Batches

| batch_id | goal | input_to_output | expected_size | post_batch_check | commit_relation |
|---|---|---|---|---|---|
| `BATCH-SBX-08B-01` | cleanup guard contract | Command 9 -> DTO / guard / lease linkage | 200~300 | allowed / blocked / pending branches | one commit after every batch passes |
| `BATCH-SBX-08B-02` | redline containment | Command 10 -> DTO / containment / investigation | 200~300 | non-advisory / no raw finding | one commit after every batch passes |
| `BATCH-SBX-08B-03` | destructive-side-effect guard | ports -> call budget / UoW / entry / tests | 200~300 | non-Allowed=0;no early delete / race | one commit after every batch passes |

Subfunction grouping: cleanup guard + redline containment + guarded destructive seam

Same-commit cause: release资格、containment和call budget必须同提交防止guard与副作用分离

Verification closure: non-Allowed=0 / no early delete

Explicitly excluded: public Job / force cleanup

## Activation Readiness

| dimension | planned_requirement | actual_status |
|---|---|---|
| config_and_source | I043 /I059~I060 /I065~I075 /I094~I095;guard配置完整 | not_run |
| environment_and_adapter | ENV-02 negative guard + ENV-04 simulated handle /lease /release /containment | not_run |
| external_and_tooling | investigation /release fake、call budget、resource disposition fixture | not_run |
| unavailable_disposition | non-Allowed release=0;缺evidence /target保持Blocked /Contained;无真实delete | not_run |
| boundary_specific_activation | cleanup / investigation / redline guard来源完整 | not_run |

## Design Closure And Risk

| field | planned_value | actual_status |
|---|---|---|
| closure_profiles | cleanup / redline / destructive guard;BASE+CONTRACT+STATE+TXN+SAFETY | not_run |
| applicable_experience | guard truth;lease / handle version;investigation marker;public target;release outcome;material retention;non-advisory | not_run |
| formal_evidence_location | `03`§6~§12;`04`§11;`05`CMD-017~020;`06`VETO | not_run |
| explicit_non_applicability | public Job不适用:本boundary用direct service / fake证明primitive | not_run |
| design_level_conclusion | `passed_design`;non-Allowed release=0 | design_record_only |
| activation_or_design_closure | guard-first、release call budget、lease /orphan /containment /investigation与simulation disposition闭合 | not_run |
| safe_route_if_open_or_triggered | non-Allowed release=0;物理TTL /fleet项`disclosure_only`;若法规 /production claim激活则MandatoryBlocker,无真实delete探索 | not_run |

| reference_type | full_references | execution_status |
|---|---|---|
| spike | `SP-SBX-IMP-007`; `SP-SBX-IMP-008` | not_run |
| risk | `R-SBX-IMP-003`; `R-SBX-IMP-005`; `R-SBX-IMP-008`; `R-SBX-IMP-009`; `R-SBX-IMP-017`; `R-SBX-IMP-019`; `R-SBX-IMP-020` | not_run |
| open_question | `OQ-SBX-IMP-013`; `OQ-SBX-IMP-017` | not_run |

## Required Checks

| check_id | command_or_assertion | required_status | actual_status | evidence |
|---|---|---|---|---|
| CHK-ACTIVATION | Close predecessor CB-SBX-08A; cleanup / investigation / redline guard来源完整 | closed_or_formal_blocked | not_run | absent |
| CHK-DESIGN | cleanup / redline / destructive guard;BASE+CONTRACT+STATE+TXN+SAFETY; closure evidence: `03`§6~§12;`04`§11;`05`CMD-017~020;`06`VETO; repeat-check rule: `passed_design`;non-Allowed release=0 | design_consistent | not_run | absent |
| CHK-SCOPE | Allowed: `crates/contracts/src/{commands,events,views}.rs`;`crates/domain/src/{cleanup,redline,boundary,handoff,relay,audit,errors}.rs`;`crates/application/src/{commands,services,ports,repositories}.rs`;`crates/infra/src/{isolation_backend_adapters,handoff_adapters,fakes}.rs`;`crates/api/src/command_handlers.rs`;`tests/{domain,service,integration}/**`; included behavior: 同上及`ADP-001`;Commands 9~10、Cleanup / Redline events、guard / containment / lease / release-call primitive; forbidden: public Jobs;force cleanup;真实teardown;risk acceptance;材料删除; public Job、force cleanup、real teardown、risk acceptance | scope_clean | not_run | absent |
| CHK-WORKTREE | Record target root, HEAD, initial git status, local identity, user-owned changes, and staged-file ownership. | worktree_recorded | not_run | absent |
| CHK-BUILD | `CMD-017~020`;Allowed / blocked / pending evidence / investigation、non-Allowed release=0、redline non-advisory、no early delete / race tests | pass_or_formal_allowed_status | not_run | absent |
| CHK-TEST | SUITE-SBX-002 /004 /010 /012及007 /009适用:CMD-017~020、STA-017~019、ERR-010/011;Allowed / Blocked / PendingEvidence / Investigation、release=0、redline / retention / race | all_mandatory_pass | not_run | absent |
| CHK-AC-VETO | AC-SBX-021~023 /030 /032~041;VETO-SBX-001 /005 /006 /010 /012~016 | assertions_present_and_no_triggered_veto | not_run | absent |
| CHK-ARTIFACT | G1 cleanup / redline / lease / containment / error / audit raw与cleanup disposition check | maturity_contract_satisfied | not_run | absent |
| CHK-REPORT | suite reports、`redaction-check.md`,targeted cleanup / report-audit | paired_report_or_G0_reason | not_run | absent |
| CHK-EVIDENCE-MATURITY | G1;non-Allowed release、early delete、force-clean、advisory redline、ordinary receipt解除containment或无disposition即不提交 | status_fidelity_and_safe_failure | not_run | absent |
| CHK-READINESS | Config/source: I043 /I059~I060 /I065~I075 /I094~I095;guard配置完整; ENV/adapter: ENV-02 negative guard + ENV-04 simulated handle /lease /release /containment; external/tool: investigation /release fake、call budget、resource disposition fixture; unavailable route: non-Allowed release=0;缺evidence /target保持Blocked /Contained;无真实delete | ready_or_formally_blocked | not_run | absent |
| CHK-RISK | Close or confirm before Activation/Design: guard-first、release call budget、lease /orphan /containment /investigation与simulation disposition闭合; route: non-Allowed release=0;物理TTL /fleet项`disclosure_only`;若法规 /production claim激活则MandatoryBlocker,无真实delete探索 | closed_or_routed | not_run | absent |
| CHK-STAGED | Run git diff --cached --name-only and git diff --cached --check; staged files must match this boundary and the exact planned message. | scope_and_whitespace_clean | not_run | absent |

## Gate Matrix

| gate | status | evidence | next_if_failed |
|---|---|---|---|
| activation_gate | planned | not_run | wait_until_current |
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

Boundary artifact contract: G1 cleanup / redline / lease / containment / error / audit raw与cleanup disposition check

Boundary report contract: suite reports、`redaction-check.md`,targeted cleanup / report-audit

Planned evidence/review reference: cleanup / redline / containment raw与redaction / cleanup / report audit

Commit is allowed only when: guard-first、non-Allowed release=0、retention / redline和resource disposition通过

Forbidden proof substitution: force cleanup、风险接受、材料删除

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
| planned_commit_title | `feat(safety): enforce cleanup guards and redline containment` |
| planned_commit_summary | `Enforce guarded cleanup and redline containment for CB-SBX-08B.` |
| planned_body_groups | `Cleanup and redline contracts:`;`Guarded destructive seam and containment:`;`Release-zero, retention, and race verification:` |
| same_commit_cause | release资格、containment、call budget和resource disposition必须同提交防止guard与副作用分离 |
| planned_footer | `Co-Authored-By: Codex <noreply@openai.com>` |
| staged_files_checked | `not_run` |
| commit_message_checked | `not_run` |
| committed_hash | `not_committed` |
| committed_message | `not_committed` |
| post_commit_status | `not_run` |

## Review Record

| field | planned_or_actual_value |
|---|---|
| required_review_responsibility | safety + operations + security reviewer核guard-first、release call budget和调查材料保留 |
| type_and_scope_review | `feat(safety)`对应guard / containment |
| body_group_review | guard、destructive seam、release-zero验证不可拆 |
| review_and_evidence_discipline | safety + operations + security |
| design_discipline_record | passed_design |
| future_repeat_check | resource disposition和VETO redline |
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

Expected successor after a real Handoff Gate pass: `CB-SBX-09A`. The project ledger alone activates that successor.

## Blockers

| blocker_id | gate | status | reason | design_fix_baseline | next_allowed_action |
|---|---|---|---|---|---|
| `BLK-SBX-HDO-001` | activation_gate | resolved | Step 13 formal package review prerequisite is closed; this does not pass HDO or the Activation Gate. | not_fixed | wait_design |
| `BLK-SBX-BASELINE-001` | design_gate | open | Reproducible design commit baseline is not fixed. | not_fixed | wait_design |

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
