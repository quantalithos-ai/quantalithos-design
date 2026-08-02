# CB-SBX-13B implementation ledger

> Created by L4-sandbox Step 13 from reviewed Step 6~11 matrices.
> This is a planned recovery contract, not proof of implementation, test execution, evidence, review, acceptance, or authorization.

| field | value |
|---|---|
| project | `L4-sandbox` |
| boundary_id | `CB-SBX-13B` |
| phase | `PH-13` |
| verifiable_goal | 执行能力面所需13 CONF harness和cleanup disposition producer。 |
| direct_predecessor | `CB-SBX-13A` |
| design_baseline | `not_fixed` |
| implementation_repo | `/home/aris/Projects/quantalithos-sandbox (absent)` |
| status | `planned` |
| next_allowed_action | `wait_until_current` |
| current_identity | no; wait for project-ledger activation |
| task_ids | `IMPL-SBX-13-03`; `IMPL-SBX-13-04`; `IMPL-SBX-13-05` |
| batch_ids | `BATCH-SBX-13B-01`; `BATCH-SBX-13B-02`; `BATCH-SBX-13B-03`; `BATCH-SBX-13B-04`; `BATCH-SBX-13B-05` |
| evidence_maturity | G2 capability;缺packet即Blocked +0 launch;probe Failed、raw leak、substitution、teardown / containment无disposition均不提交且保留调查材料 |
| implementation_started | `no` |

## Required Reads

| document | required_section | status | notes |
|---|---|---|---|
| projects/L4-sandbox/07-实施计划.md | §1, §3, §5~§12 and this exact boundary row in §6 | not_run | Formal implementation authority and control rules. |
| projects/L4-sandbox/05-测试方案.md | CONF-001~013 / SUITE-013 / GATE-P0Q / §13 | not_run | Exact owner reading copied from Step 6 section 7.4. |
| projects/L4-sandbox/06-验收标准.md | P0-Q适用AC / VETO | not_run | Exact owner reading copied from Step 6 section 7.4. |
| projects/L4-sandbox/design-calibration/05_test_plan_step_06_cases_config_security_qualification.md | `05_test_plan_step_06_cases_config_security_qualification.md` | not_run | Exact calibration or standard reference copied from Step 6 section 7.4. |
| projects/L4-sandbox/design-calibration/06_acceptance_step_03_baseline.md | `06_acceptance_step_03_baseline.md` | not_run | Exact calibration or standard reference copied from Step 6 section 7.4. |
| projects/L4-sandbox/design-calibration/07_implementation_plan_step_06_tasks_commit_boundaries.md | §7.1, §7.2, §7.4~§7.8, §7.11; CB-SBX-13B | not_run | Goal, predecessor, closure profiles, scope, tasks, batches, checks, and skeleton schema. |
| projects/L4-sandbox/design-calibration/07_implementation_plan_step_07_test_acceptance_gates.md | §6 and §8; CB-SBX-13B | not_run | Exact suite, AC, VETO, artifact, report, maturity, and review gate. |
| projects/L4-sandbox/design-calibration/07_implementation_plan_step_08_boundary_readiness_matrix.md | CB-SBX-13B readiness row | not_run | Config, environment, adapter, external dependency, and unavailable disposition. |
| projects/L4-sandbox/design-calibration/07_implementation_plan_step_09_boundary_risk_matrix.md | CB-SBX-13B risk row | not_run | Full Spike, Risk, OQ, closure, and safe routing. |
| projects/L4-sandbox/design-calibration/07_implementation_plan_step_10_boundary_control_matrix.md | CB-SBX-13B control row | not_run | Pause, rollback, invalidation, and recovery routing. |
| projects/L4-sandbox/design-calibration/07_implementation_plan_step_11_boundary_commit_message_matrix.md | CB-SBX-13B planned message and commit timing rows | not_run | Exact title, summary, body groups, evidence references, and commit prohibition. |
| projects/L4-sandbox/design-calibration/07_implementation_plan_step_11_review_delivery_audit.md | CB-SBX-13B review and delivery rows | not_run | Independent review, worktree protection, delivery, and handoff discipline. |
| standards/document/代码实施台账与门禁规范.md | project ledger, boundary ledger, nine Gate types, blockers, Commit Gate, and Handoff Gate | not_run | State values and recovery contract. |
| standards/document/设计真相源闭环与可落码性标准.md | boundary codeability and design writeback rules | not_run | Implementation must not invent missing design truth. |
| standards/document/全局项目依赖关系与裁剪规则.md | L4 Sandbox dependency direction and sibling-repository trimming | not_run | Only the allowed core dependency may be compile-time; adjacent products remain ports, events, handoffs, or fakes. |
| standards/document/子项目目录与代码文件组织规范.md | workspace, crate, binary, scripts, artifacts, reports, and implementation-ledger layout | not_run | Directory and code-file organization authority. |
| standards/coding/rust.md | applicable Rust source, tests, formatting, lint, and naming rules | not_run | Target-repository rules may add stricter requirements after repository creation. |

## Allowed Scope

| type | path_or_rule | status |
|---|---|---|
| allowed_path_or_rule | `crates/infra/src/isolation_backend_adapters.rs` | planned |
| allowed_path_or_rule | `tests/{integration,support}/**` | planned |
| allowed_path_or_rule | `scripts/gates/run_backend_conformance_gate.sh` | planned |
| allowed_path_or_rule | `scripts/checks/{check_redaction,check_qualification_identity,check_cleanup_disposition,check_blocked_propagation}.sh` | planned |
| included_behavior | `DEL-SBX-TEST-001`;`DEL-SBX-TEST-002`;`DEL-SBX-TEST-004`;`DEL-SBX-AUTO-001`;`DEL-SBX-AUTO-003`;`DEL-SBX-EVD-001`;`DEL-SBX-EVD-002`;`DEL-SBX-EVD-003`;`DEL-SBX-DATA-001`;`DEL-SBX-DATA-002`;`DEL-SBX-DATA-003`;SUITE-013、CONF-001~013、P0Q writer / checks / teardown | planned |
| boundary_goal | 执行能力面所需13 CONF harness和cleanup disposition producer。 | planned |

## Forbidden Scope

| rule | status | failure_action |
|---|---|---|
| static qualification result;PROFILE-06;production / capacity;缺identity仍launch | active | block_scope_gate; remove the change or reopen design |
| PROFILE-06、production / capacity、多candidate、预填Passed | active | block_scope_gate; do not stage or commit |
| Do not implement tools semantic execution, runtime agent-loop orchestration, or member lifecycle orchestration inside Sandbox. | active | block_scope_gate; return the concern to its owning project |
| Do not use latest paths, static evidence aliases, prefilled Passed or acceptance decisions, raw secret or process bodies, or unrelated user changes. | active | block_evidence_or_worktree_gate; preserve safe failure material |

## Tasks And Batches

### Tasks

| task_id | order | implementation_action | input | completion_criterion |
|---|---|---|---|---|
| `IMPL-SBX-13-03` | 3 | 编写CONF-001~006四维 / capability / lifecycle probe harness | SUITE-013 | 同identity packet且无weak fallback |
| `IMPL-SBX-13-04` | 4 | 编写CONF-007~013 capture / failure / reaper / redline / material / cleanup harness | SUITE-013 | teardown / containment disposition完整 |
| `IMPL-SBX-13-05` | 5 | 编写P0Q gate writer和identity / redaction / cleanup / blocked checks | `05`§9 / §13 | raw / report可生成但无静态结论 |

### Batches

| batch_id | goal | input_to_output | expected_size | post_batch_check | commit_relation |
|---|---|---|---|---|---|
| `BATCH-SBX-13B-01` | CONF-001~003 | resource / fs / network probes | 200~300 | identity / boundary assertions | one commit after every batch passes |
| `BATCH-SBX-13B-02` | CONF-004~006 | process / lifecycle / launch probes | 200~300 | no host fallback / honest outcome | one commit after every batch passes |
| `BATCH-SBX-13B-03` | CONF-007~010 | capture / failure / terminate / reaper probes | 200~300 | body-free / guard / disposition | one commit after every batch passes |
| `BATCH-SBX-13B-04` | CONF-011~013 | redline / material / anti-leak probes | 200~300 | containment / provider / scanner | one commit after every batch passes |
| `BATCH-SBX-13B-05` | P0Q writer / checks | all probe raw -> gate / report source | 200~300 | identity / redaction / cleanup / blocked | one commit after every batch passes |

Subfunction grouping: 13 CONF groups + P0Q writer / checks

Same-commit cause: probe、teardown、redaction和result writer必须共享同一qualification identity

Verification closure: CONF-001~013 / cleanup disposition

Explicitly excluded: P1 / static qualification

## Activation Readiness

| dimension | planned_requirement | actual_status |
|---|---|---|
| config_and_source | 13A immutable packet;capture /release /cleanup /redline /material bindings完整 | not_run |
| environment_and_adapter | 同一ENV-05 /P05;candidate-real;controlled non-production target | not_run |
| external_and_tooling | CONF-001~013 harness、identity /redaction /cleanup checks、product +lab disposition | not_run |
| unavailable_disposition | preflight异常不执行CONF;failure保留;teardown /containment无处置不提交 | not_run |
| boundary_specific_activation | 13A immutable packet有效;缺一项仍Blocked且0 launch | not_run |

## Design Closure And Risk

| field | planned_value | actual_status |
|---|---|---|
| closure_profiles | candidate probe / evidence;BASE+CANDIDATE+SAFETY+EVIDENCE | not_run |
| applicable_experience | 13 CONF identity continuity;artifact schema;redaction;cleanup / containment disposition;blocked propagation | not_run |
| formal_evidence_location | `05`CONF-001~013 / §9 / §13;`06`P0-Q AC / VETO | not_run |
| explicit_non_applicability | P1 real-like不适用:PROFILE-06不可补P0-Q | not_run |
| design_level_conclusion | `blocked_pre_implementation`:依赖13A全部Activation inputs;缺失时0 launch | design_record_only |
| activation_or_design_closure | 13A packet未变、CONF harness、identity /redaction /cleanup checks、product +lab disposition与authorized lab形成 | not_run |
| safe_route_if_open_or_triggered | preflight异常不执行CONF;failure /containment保留;teardown不能改写product truth;无source Passed预填 | not_run |

| reference_type | full_references | execution_status |
|---|---|---|
| spike | `SP-SBX-IMP-007`; `SP-SBX-IMP-008`; `SP-SBX-IMP-014` | not_run |
| risk | `R-SBX-IMP-003`; `R-SBX-IMP-005`; `R-SBX-IMP-007`; `R-SBX-IMP-008`; `R-SBX-IMP-009`; `R-SBX-IMP-012`; `R-SBX-IMP-013`; `R-SBX-IMP-019`; `R-SBX-IMP-020` | not_run |
| open_question | `OQ-SBX-IMP-006`; `OQ-SBX-IMP-007`; `OQ-SBX-IMP-008`; `OQ-SBX-IMP-009` | not_run |

## Required Checks

| check_id | command_or_assertion | required_status | actual_status | evidence |
|---|---|---|---|---|
| CHK-ACTIVATION | Close predecessor CB-SBX-13A; 13A immutable packet有效;缺一项仍Blocked且0 launch | closed_or_formal_blocked | not_run | absent |
| CHK-DESIGN | candidate probe / evidence;BASE+CANDIDATE+SAFETY+EVIDENCE; closure evidence: `05`CONF-001~013 / §9 / §13;`06`P0-Q AC / VETO; repeat-check rule: `blocked_pre_implementation`:依赖13A全部Activation inputs;缺失时0 launch | design_consistent | not_run | absent |
| CHK-SCOPE | Allowed: `crates/infra/src/isolation_backend_adapters.rs`;`tests/{integration,support}/**`;`scripts/gates/run_backend_conformance_gate.sh`;`scripts/checks/{check_redaction,check_qualification_identity,check_cleanup_disposition,check_blocked_propagation}.sh`; included behavior: `DEL-SBX-TEST-001`;`DEL-SBX-TEST-002`;`DEL-SBX-TEST-004`;`DEL-SBX-AUTO-001`;`DEL-SBX-AUTO-003`;`DEL-SBX-EVD-001`;`DEL-SBX-EVD-002`;`DEL-SBX-EVD-003`;`DEL-SBX-DATA-001`;`DEL-SBX-DATA-002`;`DEL-SBX-DATA-003`;SUITE-013、CONF-001~013、P0Q writer / checks / teardown; forbidden: static qualification result;PROFILE-06;production / capacity;缺identity仍launch; PROFILE-06、production / capacity、多candidate、预填Passed | scope_clean | not_run | absent |
| CHK-WORKTREE | Record target root, HEAD, initial git status, local identity, user-owned changes, and staged-file ownership. | worktree_recorded | not_run | absent |
| CHK-BUILD | identity preflight -> 13 CONF harness -> redaction / identity / cleanup checks;Blocked / Failed保留;teardown / containment有disposition | pass_or_formal_allowed_status | not_run | absent |
| CHK-TEST | SUITE-SBX-013全CONF-001~013;identity preflight -> four-dimension / lifecycle / capture / failure / reaper / redline / material / anti-leak -> teardown;VC-001 /007 /008 /009 | all_mandatory_pass | not_run | absent |
| CHK-AC-VETO | P0-Q适用AC-SBX-008~011 /013~014 /016~023 /027~030 /034~035 /037~041;AC-SBX-031 ARCH-SLICE supporting;VETO-SBX-001~017适用predicate | assertions_present_and_no_triggered_veto | not_run | absent |
| CHK-ARTIFACT | G2 P0Q fixed source raw能力、qualification-result、identity / redaction / cleanup checks与ESLOT-017~019 producer | maturity_contract_satisfied | not_run | absent |
| CHK-REPORT | SUITE-SBX-013 / qualification / identity / redaction / cleanup / report-audit reports | paired_report_or_G0_reason | not_run | absent |
| CHK-EVIDENCE-MATURITY | G2 capability;缺packet即Blocked +0 launch;probe Failed、raw leak、substitution、teardown / containment无disposition均不提交且保留调查材料 | status_fidelity_and_safe_failure | not_run | absent |
| CHK-READINESS | Config/source: 13A immutable packet;capture /release /cleanup /redline /material bindings完整; ENV/adapter: 同一ENV-05 /P05;candidate-real;controlled non-production target; external/tool: CONF-001~013 harness、identity /redaction /cleanup checks、product +lab disposition; unavailable route: preflight异常不执行CONF;failure保留;teardown /containment无处置不提交 | ready_or_formally_blocked | not_run | absent |
| CHK-RISK | Close or confirm before Activation/Design: 13A packet未变、CONF harness、identity /redaction /cleanup checks、product +lab disposition与authorized lab形成; route: preflight异常不执行CONF;failure /containment保留;teardown不能改写product truth;无source Passed预填 | closed_or_routed | not_run | absent |
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

Boundary artifact contract: G2 P0Q fixed source raw能力、qualification-result、identity / redaction / cleanup checks与ESLOT-017~019 producer

Boundary report contract: SUITE-SBX-013 / qualification / identity / redaction / cleanup / report-audit reports

Planned evidence/review reference: SUITE-SBX-013 report、qualification / identity / redaction / cleanup / report-audit材料

Commit is allowed only when: 同一packet下CONF-001~013 harness、status、redaction、product disposition和lab teardown闭合

Forbidden proof substitution: 静态qualification、P1、无identity launch

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
| planned_commit_title | `test(qualification): add backend conformance qualification harness` |
| planned_commit_summary | `Add the complete backend conformance harness for CB-SBX-13B.` |
| planned_body_groups | `Backend conformance case groups:`;`P0Q source writer and identity checks:`;`Teardown, redaction, and cleanup disposition:` |
| same_commit_cause | CONF、identity、raw、product disposition与lab teardown必须绑定同一qualification packet |
| planned_footer | `Co-Authored-By: Codex <noreply@openai.com>` |
| staged_files_checked | `not_run` |
| commit_message_checked | `not_run` |
| committed_hash | `not_committed` |
| committed_message | `not_committed` |
| post_commit_status | `not_run` |

## Review Record

| field | planned_or_actual_value |
|---|---|
| required_review_responsibility | qualification runner + security + operations reviewer核13/13 exact packet、product disposition和lab teardown |
| type_and_scope_review | `test(qualification)`对应CONF harness |
| body_group_review | cases / P0Q writer / teardown共同绑定single packet |
| review_and_evidence_discipline | qualification + security + operations |
| design_discipline_record | passed_with_precondition |
| future_repeat_check | 13A packet与lab authorization |
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

Expected successor after a real Handoff Gate pass: `CB-SBX-14A`. The project ledger alone activates that successor.

## Blockers

| blocker_id | gate | status | reason | design_fix_baseline | next_allowed_action |
|---|---|---|---|---|---|
| `BLK-SBX-HDO-001` | activation_gate | resolved | Step 13 formal package review prerequisite is closed; this does not pass HDO or the Activation Gate. | not_fixed | wait_design |
| `BLK-SBX-BASELINE-001` | design_gate | open | Reproducible design commit baseline is not fixed. | not_fixed | wait_design |
| `BLK-SBX-P0Q-001` | activation_gate | open | Immutable candidate, P05, ENV-05, provider, material, and lab packet is absent. | not_fixed | handoff |

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
