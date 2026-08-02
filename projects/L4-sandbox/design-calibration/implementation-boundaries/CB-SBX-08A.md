# CB-SBX-08A implementation ledger

> Created by L4-sandbox Step 13 from reviewed Step 6~11 matrices.
> This is a planned recovery contract, not proof of implementation, test execution, evidence, review, acceptance, or authorization.

| field | value |
|---|---|
| project | `L4-sandbox` |
| boundary_id | `CB-SBX-08A` |
| phase | `PH-08` |
| verifiable_goal | 打通control与failure classification并保持unknown不成功。 |
| direct_predecessor | `CB-SBX-07C` |
| design_baseline | `not_fixed` |
| implementation_repo | `/home/aris/Projects/quantalithos-sandbox (absent)` |
| status | `planned` |
| next_allowed_action | `wait_until_current` |
| current_identity | no; wait for project-ledger activation |
| task_ids | `IMPL-SBX-08-01`; `IMPL-SBX-08-02` |
| batch_ids | `BATCH-SBX-08A-01`; `BATCH-SBX-08A-02`; `BATCH-SBX-08A-03` |
| evidence_maturity | G1;unknown变success、classification改run truth、raw detail泄漏、second winner或runtime recovery编排混入即不提交 |
| implementation_started | `no` |

## Required Reads

| document | required_section | status | notes |
|---|---|---|---|
| projects/L4-sandbox/07-实施计划.md | §1, §3, §5~§12 and this exact boundary row in §6 | not_run | Formal implementation authority and control rules. |
| projects/L4-sandbox/03-详细设计.md | §6 failure / control / §7.3 Commands 7~8 / §8.5 flows / §9 / §11~§12 | not_run | Exact owner reading copied from Step 6 section 7.4. |
| projects/L4-sandbox/05-测试方案.md | CMD-013~016 | not_run | Exact owner reading copied from Step 6 section 7.4. |
| projects/L4-sandbox/06-验收标准.md | PG-SBX-007/008 | not_run | Exact owner reading copied from Step 6 section 7.4. |
| projects/L4-sandbox/design-calibration/03_ddd_step_12_error_recovery.md | `03_ddd_step_12_error_recovery.md` | not_run | Exact calibration or standard reference copied from Step 6 section 7.4. |
| projects/L4-sandbox/design-calibration/05_test_plan_step_06_cases_errors_recovery.md | `05_test_plan_step_06_cases_errors_recovery.md` | not_run | Exact calibration or standard reference copied from Step 6 section 7.4. |
| projects/L4-sandbox/design-calibration/07_implementation_plan_step_06_tasks_commit_boundaries.md | §7.1, §7.2, §7.4~§7.8, §7.11; CB-SBX-08A | not_run | Goal, predecessor, closure profiles, scope, tasks, batches, checks, and skeleton schema. |
| projects/L4-sandbox/design-calibration/07_implementation_plan_step_07_test_acceptance_gates.md | §6 and §8; CB-SBX-08A | not_run | Exact suite, AC, VETO, artifact, report, maturity, and review gate. |
| projects/L4-sandbox/design-calibration/07_implementation_plan_step_08_boundary_readiness_matrix.md | CB-SBX-08A readiness row | not_run | Config, environment, adapter, external dependency, and unavailable disposition. |
| projects/L4-sandbox/design-calibration/07_implementation_plan_step_09_boundary_risk_matrix.md | CB-SBX-08A risk row | not_run | Full Spike, Risk, OQ, closure, and safe routing. |
| projects/L4-sandbox/design-calibration/07_implementation_plan_step_10_boundary_control_matrix.md | CB-SBX-08A control row | not_run | Pause, rollback, invalidation, and recovery routing. |
| projects/L4-sandbox/design-calibration/07_implementation_plan_step_11_boundary_commit_message_matrix.md | CB-SBX-08A planned message and commit timing rows | not_run | Exact title, summary, body groups, evidence references, and commit prohibition. |
| projects/L4-sandbox/design-calibration/07_implementation_plan_step_11_review_delivery_audit.md | CB-SBX-08A review and delivery rows | not_run | Independent review, worktree protection, delivery, and handoff discipline. |
| standards/document/代码实施台账与门禁规范.md | project ledger, boundary ledger, nine Gate types, blockers, Commit Gate, and Handoff Gate | not_run | State values and recovery contract. |
| standards/document/设计真相源闭环与可落码性标准.md | boundary codeability and design writeback rules | not_run | Implementation must not invent missing design truth. |
| standards/document/全局项目依赖关系与裁剪规则.md | L4 Sandbox dependency direction and sibling-repository trimming | not_run | Only the allowed core dependency may be compile-time; adjacent products remain ports, events, handoffs, or fakes. |
| standards/document/子项目目录与代码文件组织规范.md | workspace, crate, binary, scripts, artifacts, reports, and implementation-ledger layout | not_run | Directory and code-file organization authority. |
| standards/coding/rust.md | applicable Rust source, tests, formatting, lint, and naming rules | not_run | Target-repository rules may add stricter requirements after repository creation. |

## Allowed Scope

| type | path_or_rule | status |
|---|---|---|
| allowed_path_or_rule | `crates/contracts/src/{commands,events,views}.rs` | planned |
| allowed_path_or_rule | `crates/domain/src/{failure,control,run,relay,audit,errors}.rs` | planned |
| allowed_path_or_rule | `crates/application/src/{commands,services,ports,repositories}.rs` | planned |
| allowed_path_or_rule | `crates/api/src/command_handlers.rs` | planned |
| allowed_path_or_rule | `crates/worker/src/control_worker.rs` | planned |
| allowed_path_or_rule | `tests/{domain,service,integration}/**` | planned |
| included_behavior | `DEL-SBX-CODE-002`;`DEL-SBX-CODE-003`;`DEL-SBX-CODE-004`;`DEL-SBX-CODE-005`;`DEL-SBX-CODE-006`;`DEL-SBX-CODE-007`;`DEL-SBX-CODE-009`;`DEL-SBX-CODE-010`;`DEL-SBX-CODE-011`;`DEL-SBX-CODE-012`适用增量;Commands 7~8、Control / Failure events、control / failure truth | planned |
| boundary_goal | 打通control与failure classification并保持unknown不成功。 | planned |

## Forbidden Scope

| rule | status | failure_action |
|---|---|---|
| runtime recovery orchestration;cleanup / release;redline;unknown=>success | active | block_scope_gate; remove the change or reopen design |
| runtime recovery orchestration、cleanup / redline / release | active | block_scope_gate; do not stage or commit |
| Do not implement tools semantic execution, runtime agent-loop orchestration, or member lifecycle orchestration inside Sandbox. | active | block_scope_gate; return the concern to its owning project |
| Do not use latest paths, static evidence aliases, prefilled Passed or acceptance decisions, raw secret or process bodies, or unrelated user changes. | active | block_evidence_or_worktree_gate; preserve safe failure material |

## Tasks And Batches

### Tasks

| task_id | order | implementation_action | input | completion_criterion |
|---|---|---|---|---|
| `IMPL-SBX-08-01` | 1 | 编写Commands 7~8、Control / Failure events和owner states | PG-SBX-007 /008 | conflict / unknown / terminal规则闭合 |
| `IMPL-SBX-08-02` | 2 | 编写control / classification UoW、worker mapping和race / replay tests | CMD-013~016 | unknown不成功,不做runtime recovery |

### Batches

| batch_id | goal | input_to_output | expected_size | post_batch_check | commit_relation |
|---|---|---|---|---|---|
| `BATCH-SBX-08A-01` | control contract / state | Command 7 -> DTO / truth / event / guard | 200~300 | accepted / conflict / duplicate | one commit after every batch passes |
| `BATCH-SBX-08A-02` | failure contract / state | Command 8 -> classification / event / errors | 200~300 | pending / classified / unknown / terminal | one commit after every batch passes |
| `BATCH-SBX-08A-03` | safety transaction | two formal flows -> UoW / worker / tests | 200~300 | race / rollback / no runtime recover | one commit after every batch passes |

Subfunction grouping: control + failure classification + safety transaction

Same-commit cause: formal control可影响failure source marker,二者共同保证single truth和unknown不成功

Verification closure: conflict / unknown / race / replay

Explicitly excluded: cleanup / runtime recovery

## Activation Readiness

| dimension | planned_requirement | actual_status |
|---|---|---|
| config_and_source | entry /worker envelope与safe output;无新recovery config | not_run |
| environment_and_adapter | ENV-02 control /failure fixtures;ENV-04 race simulation补强 | not_run |
| external_and_tooling | deterministic control race、classification source、audit /replay stores | not_run |
| unavailable_disposition | unknown保持unknown /failed;不得混入runtime recovery orchestration | not_run |
| boundary_specific_activation | run / capture / handoff markers可定位;runtime recovery仍外部 | not_run |

## Design Closure And Risk

| field | planned_value | actual_status |
|---|---|---|
| closure_profiles | control / failure;BASE+CONTRACT+STATE+TXN+SAFETY | not_run |
| applicable_experience | public command intent;source marker;single truth;unknown mapping;terminal state;race / replay | not_run |
| formal_evidence_location | `03`§6~§12;`05`CMD-013~016;`06`PG-007/008 | not_run |
| explicit_non_applicability | cleanup / release不适用:不触发destructive adapter | not_run |
| design_level_conclusion | `passed_design`;不得引入runtime recovery orchestration | design_record_only |
| activation_or_design_closure | control race、failure classification source、unknown /partial语义和audit /replay闭合 | not_run |
| safe_route_if_open_or_triggered | 无唯一classification`wait_design`;unknown不得成功;不得混入runtime agent recovery orchestration | not_run |

| reference_type | full_references | execution_status |
|---|---|---|
| spike | `SP-SBX-IMP-007` | not_run |
| risk | `R-SBX-IMP-003`; `R-SBX-IMP-005`; `R-SBX-IMP-007`; `R-SBX-IMP-008`; `R-SBX-IMP-009`; `R-SBX-IMP-019`; `R-SBX-IMP-020` | not_run |
| open_question | none_by_boundary_matrix | not_run |

## Required Checks

| check_id | command_or_assertion | required_status | actual_status | evidence |
|---|---|---|---|---|
| CHK-ACTIVATION | Close predecessor CB-SBX-07C; run / capture / handoff markers可定位;runtime recovery仍外部 | closed_or_formal_blocked | not_run | absent |
| CHK-DESIGN | control / failure;BASE+CONTRACT+STATE+TXN+SAFETY; closure evidence: `03`§6~§12;`05`CMD-013~016;`06`PG-007/008; repeat-check rule: `passed_design`;不得引入runtime recovery orchestration | design_consistent | not_run | absent |
| CHK-SCOPE | Allowed: `crates/contracts/src/{commands,events,views}.rs`;`crates/domain/src/{failure,control,run,relay,audit,errors}.rs`;`crates/application/src/{commands,services,ports,repositories}.rs`;`crates/api/src/command_handlers.rs`;`crates/worker/src/control_worker.rs`;`tests/{domain,service,integration}/**`; included behavior: `DEL-SBX-CODE-002`;`DEL-SBX-CODE-003`;`DEL-SBX-CODE-004`;`DEL-SBX-CODE-005`;`DEL-SBX-CODE-006`;`DEL-SBX-CODE-007`;`DEL-SBX-CODE-009`;`DEL-SBX-CODE-010`;`DEL-SBX-CODE-011`;`DEL-SBX-CODE-012`适用增量;Commands 7~8、Control / Failure events、control / failure truth; forbidden: runtime recovery orchestration;cleanup / release;redline;unknown=>success; runtime recovery orchestration、cleanup / redline / release | scope_clean | not_run | absent |
| CHK-WORKTREE | Record target root, HEAD, initial git status, local identity, user-owned changes, and staged-file ownership. | worktree_recorded | not_run | absent |
| CHK-BUILD | `CMD-013~016`;accepted / conflict / duplicate / pending input / classified / unknown-not-success / terminal guard / race tests | pass_or_formal_allowed_status | not_run | absent |
| CHK-TEST | SUITE-SBX-002 /004 /010 /012及007 /009适用:CMD-013~016、STA-016、ERR全相关;control conflict / replay、known / unknown classification、terminal guard / race | all_mandatory_pass | not_run | absent |
| CHK-AC-VETO | AC-SBX-020 /022 /032~041适用;VETO-SBX-001 /005 /006 /010 /012 /013 /016 | assertions_present_and_no_triggered_veto | not_run | absent |
| CHK-ARTIFACT | G1 control / failure / replay / consistency / error / audit raw | maturity_contract_satisfied | not_run | absent |
| CHK-REPORT | suite reports、targeted redaction / report-audit | paired_report_or_G0_reason | not_run | absent |
| CHK-EVIDENCE-MATURITY | G1;unknown变success、classification改run truth、raw detail泄漏、second winner或runtime recovery编排混入即不提交 | status_fidelity_and_safe_failure | not_run | absent |
| CHK-READINESS | Config/source: entry /worker envelope与safe output;无新recovery config; ENV/adapter: ENV-02 control /failure fixtures;ENV-04 race simulation补强; external/tool: deterministic control race、classification source、audit /replay stores; unavailable route: unknown保持unknown /failed;不得混入runtime recovery orchestration | ready_or_formally_blocked | not_run | absent |
| CHK-RISK | Close or confirm before Activation/Design: control race、failure classification source、unknown /partial语义和audit /replay闭合; route: 无唯一classification`wait_design`;unknown不得成功;不得混入runtime agent recovery orchestration | closed_or_routed | not_run | absent |
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

Boundary artifact contract: G1 control / failure / replay / consistency / error / audit raw

Boundary report contract: suite reports、targeted redaction / report-audit

Planned evidence/review reference: control / failure / race / replay reports与report audit

Commit is allowed only when: conflict、single winner、known / unknown分类和保守传播通过

Forbidden proof substitution: runtime recovery orchestration、cleanup

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
| planned_commit_title | `feat(control): control runs and classify failures conservatively` |
| planned_commit_summary | `Control runs and preserve conservative failure classification for CB-SBX-08A.` |
| planned_body_groups | `Control contracts and worker entry:`;`Failure classification and safety transaction:`;`Conflict, race, and replay verification:` |
| same_commit_cause | control影响与failure source marker需同一事务审查,保证single truth和unknown不成功 |
| planned_footer | `Co-Authored-By: Codex <noreply@openai.com>` |
| staged_files_checked | `not_run` |
| commit_message_checked | `not_run` |
| committed_hash | `not_committed` |
| committed_message | `not_committed` |
| post_commit_status | `not_run` |

## Review Record

| field | planned_or_actual_value |
|---|---|
| required_review_responsibility | safety domain / control worker / transaction reviewer核single truth和unknown保守传播 |
| type_and_scope_review | `feat(control)`对应control / classification |
| body_group_review | worker / classification / race共同保证single truth |
| review_and_evidence_discipline | safety + control + transaction |
| design_discipline_record | passed_design |
| future_repeat_check | unknown保守传播 |
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

Expected successor after a real Handoff Gate pass: `CB-SBX-08B`. The project ledger alone activates that successor.

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
