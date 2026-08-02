# CB-SBX-12B implementation ledger

> Created by L4-sandbox Step 13 from reviewed Step 6~11 matrices.
> This is a planned recovery contract, not proof of implementation, test execution, evidence, review, acceptance, or authorization.

| field | value |
|---|---|
| project | `L4-sandbox` |
| boundary_id | `CB-SBX-12B` |
| phase | `PH-12` |
| verifiable_goal | 完成14 TXN、19 race、parity、redaction和P0-C source writer加固。 |
| direct_predecessor | `CB-SBX-12A` |
| design_baseline | `not_fixed` |
| implementation_repo | `/home/aris/Projects/quantalithos-sandbox (absent)` |
| status | `planned` |
| next_allowed_action | `wait_until_current` |
| current_identity | no; wait for project-ledger activation |
| task_ids | `IMPL-SBX-12-03`; `IMPL-SBX-12-04` |
| batch_ids | `BATCH-SBX-12B-01`; `BATCH-SBX-12B-02`; `BATCH-SBX-12B-03`; `BATCH-SBX-12B-04`; `BATCH-SBX-12B-05`; `BATCH-SBX-12B-06` |
| evidence_maturity | G2 capability;任一TXN / race不确定、fake parity断裂、role混用、schema / pairing / status传播失败即不提交;不得写source Passed |
| implementation_started | `no` |

## Required Reads

| document | required_section | status | notes |
|---|---|---|---|
| projects/L4-sandbox/07-实施计划.md | §1, §3, §5~§12 and this exact boundary row in §6 | not_run | Formal implementation authority and control rules. |
| projects/L4-sandbox/03-详细设计.md | §10~§15 | not_run | Exact owner reading copied from Step 6 section 7.4. |
| projects/L4-sandbox/05-测试方案.md | §6 TXN/RACE/ERR / §9~§13 | not_run | Exact owner reading copied from Step 6 section 7.4. |
| projects/L4-sandbox/06-验收标准.md | §8~§11 | not_run | Exact owner reading copied from Step 6 section 7.4. |
| projects/L4-sandbox/design-calibration/07_implementation_plan_step_06_tasks_commit_boundaries.md | consistency / evidence / architecture校准 | not_run | Exact calibration or standard reference copied from Step 6 section 7.4. |
| projects/L4-sandbox/design-calibration/07_implementation_plan_step_06_tasks_commit_boundaries.md | Step 5 §9.3~§9.4 | not_run | Exact calibration or standard reference copied from Step 6 section 7.4. |
| projects/L4-sandbox/design-calibration/07_implementation_plan_step_06_tasks_commit_boundaries.md | §7.1, §7.2, §7.4~§7.8, §7.11; CB-SBX-12B | not_run | Goal, predecessor, closure profiles, scope, tasks, batches, checks, and skeleton schema. |
| projects/L4-sandbox/design-calibration/07_implementation_plan_step_07_test_acceptance_gates.md | §6 and §8; CB-SBX-12B | not_run | Exact suite, AC, VETO, artifact, report, maturity, and review gate. |
| projects/L4-sandbox/design-calibration/07_implementation_plan_step_08_boundary_readiness_matrix.md | CB-SBX-12B readiness row | not_run | Config, environment, adapter, external dependency, and unavailable disposition. |
| projects/L4-sandbox/design-calibration/07_implementation_plan_step_09_boundary_risk_matrix.md | CB-SBX-12B risk row | not_run | Full Spike, Risk, OQ, closure, and safe routing. |
| projects/L4-sandbox/design-calibration/07_implementation_plan_step_10_boundary_control_matrix.md | CB-SBX-12B control row | not_run | Pause, rollback, invalidation, and recovery routing. |
| projects/L4-sandbox/design-calibration/07_implementation_plan_step_11_boundary_commit_message_matrix.md | CB-SBX-12B planned message and commit timing rows | not_run | Exact title, summary, body groups, evidence references, and commit prohibition. |
| projects/L4-sandbox/design-calibration/07_implementation_plan_step_11_review_delivery_audit.md | CB-SBX-12B review and delivery rows | not_run | Independent review, worktree protection, delivery, and handoff discipline. |
| standards/document/代码实施台账与门禁规范.md | project ledger, boundary ledger, nine Gate types, blockers, Commit Gate, and Handoff Gate | not_run | State values and recovery contract. |
| standards/document/设计真相源闭环与可落码性标准.md | boundary codeability and design writeback rules | not_run | Implementation must not invent missing design truth. |
| standards/document/全局项目依赖关系与裁剪规则.md | L4 Sandbox dependency direction and sibling-repository trimming | not_run | Only the allowed core dependency may be compile-time; adjacent products remain ports, events, handoffs, or fakes. |
| standards/document/子项目目录与代码文件组织规范.md | workspace, crate, binary, scripts, artifacts, reports, and implementation-ledger layout | not_run | Directory and code-file organization authority. |
| standards/coding/rust.md | applicable Rust source, tests, formatting, lint, and naming rules | not_run | Target-repository rules may add stricter requirements after repository creation. |

## Allowed Scope

| type | path_or_rule | status |
|---|---|---|
| allowed_path_or_rule | `crates/{application,infra,api,worker,jobs}/src/**` | planned |
| allowed_path_or_rule | `tests/{service,integration,support}/**` | planned |
| allowed_path_or_rule | `scripts/checks/**` | planned |
| allowed_path_or_rule | P0-C source-writer support | planned |
| included_behavior | `DEL-SBX-CODE-005`;`DEL-SBX-CODE-011`;`DEL-SBX-CODE-012`;`DEL-SBX-ADP-001`;`DEL-SBX-TEST-001`;`DEL-SBX-TEST-002`;`DEL-SBX-TEST-005`;`DEL-SBX-AUTO-003`;`DEL-SBX-EVD-001`;`DEL-SBX-EVD-002`;`DEL-SBX-EVD-003`P0-C增量;14 TXN、19 RACE、SUITE-001~012 /014 /016、MAIN / OPS writers | planned |
| boundary_goal | 完成14 TXN、19 race、parity、redaction和P0-C source writer加固。 | planned |

## Forbidden Scope

| rule | status | failure_action |
|---|---|---|
| candidate probe;PROFILE-06 claim;release aggregation;静态EV / pass | active | block_scope_gate; remove the change or reopen design |
| candidate result、P1 claim、RELEASE aggregation、static EV | active | block_scope_gate; do not stage or commit |
| Do not implement tools semantic execution, runtime agent-loop orchestration, or member lifecycle orchestration inside Sandbox. | active | block_scope_gate; return the concern to its owning project |
| Do not use latest paths, static evidence aliases, prefilled Passed or acceptance decisions, raw secret or process bodies, or unrelated user changes. | active | block_evidence_or_worktree_gate; preserve safe failure material |

## Tasks And Batches

### Tasks

| task_id | order | implementation_action | input | completion_criterion |
|---|---|---|---|---|
| `IMPL-SBX-12-03` | 3 | 补齐14 TXN、19 RACE、repository / adapter parity和structural boundedness | SUITE-007~009 /014 | deterministic / two-order / no-sleep |
| `IMPL-SBX-12-04` | 4 | 补齐SUITE-001~012 /014 /016 orchestration、checks和MAIN / OPS source writer | `05`§9 / §13 | roles / identity / raw pairing诚实 |

### Batches

| batch_id | goal | input_to_output | expected_size | post_batch_check | commit_relation |
|---|---|---|---|---|---|
| `BATCH-SBX-12B-01` | TXN 1~7 | transaction table -> deterministic cases | 200~300 | exact rollback / replay assertions | one commit after every batch passes |
| `BATCH-SBX-12B-02` | TXN 8~14 | transaction table -> deterministic cases | 200~300 | no-write / no-repair / no-rollback | one commit after every batch passes |
| `BATCH-SBX-12B-03` | RACE 1~10 | race table -> controlled schedules | 200~300 | both orderings / winner / loser | one commit after every batch passes |
| `BATCH-SBX-12B-04` | RACE 11~19 | race table -> controlled schedules | 200~300 | no sleeps / stable disposition | one commit after every batch passes |
| `BATCH-SBX-12B-05` | parity / boundedness | store / adapter contract -> SUITE-008/014 | 200~300 | page / version / no-scan / call budget | one commit after every batch passes |
| `BATCH-SBX-12B-06` | checks / P0-C writers | manifests + raw schema -> checks / source writers | 200~300 | MAIN roles / OPS / pairing / blocked | one commit after every batch passes |

Subfunction grouping: TXN + RACE + parity + checks / source writers

Same-commit cause: 共同证明P0-C一致性和source真实性;按六批独立执行后统一冻结

Verification closure: 14 /19 / suites / checks

Explicitly excluded: candidate / release aggregation

## Activation Readiness

| dimension | planned_requirement | actual_status |
|---|---|---|
| config_and_source | P01~04 complete generation、S06 run isolation、all safety /redaction settings | not_run |
| environment_and_adapter | ENV-02 MAIN-CONTRACT writer能力;ENV-03 MAIN-SEAM能力;ENV-04 OPS能力;当前无source run | not_run |
| external_and_tooling | 14 TXN /19 race、fake parity、source schema /writer、checks与fixed roots | not_run |
| unavailable_disposition | harness /role /pairing失败阻断;不得写source Passed /merge MAIN roles | not_run |
| boundary_specific_activation | 14 TXN /19 RACE / parity / source-writer工具链可执行 | not_run |

## Design Closure And Risk

| field | planned_value | actual_status |
|---|---|---|
| closure_profiles | consistency / parity / P0-C evidence;BASE+TXN+EVIDENCE+QUERY+JOB+RELAY | not_run |
| applicable_experience | transaction / race;fake parity;no-write / no-repair / no-rollback;machine schema;role identity;pairing;blocked status | not_run |
| formal_evidence_location | `03`§10~§15;`05`§6 / §9~§13;`06`§8~§11 | not_run |
| explicit_non_applicability | candidate qualification不适用:P0-C不得依赖P0-Q | not_run |
| design_level_conclusion | `passed_design`;不得把source writer能力写成source run Pass | design_record_only |
| activation_or_design_closure | 14 TXN /19 race、fake parity、redaction、MAIN-CONTRACT /MAIN-SEAM /OPS writer能力和fixed identity全量闭合 | not_run |
| safe_route_if_open_or_triggered | 任一P0-C /role /pairing缺口阻断;不得写真实source Passed、合并MAIN roles或用targeted补source | not_run |

| reference_type | full_references | execution_status |
|---|---|---|
| spike | `SP-SBX-IMP-007`; `SP-SBX-IMP-008`; `SP-SBX-IMP-012` | not_run |
| risk | `R-SBX-IMP-003`; `R-SBX-IMP-004`; `R-SBX-IMP-005`; `R-SBX-IMP-006`; `R-SBX-IMP-007`; `R-SBX-IMP-008`; `R-SBX-IMP-009`; `R-SBX-IMP-010`; `R-SBX-IMP-011`; `R-SBX-IMP-012`; `R-SBX-IMP-013`; `R-SBX-IMP-019`; `R-SBX-IMP-020` | not_run |
| open_question | none_by_boundary_matrix | not_run |

## Required Checks

| check_id | command_or_assertion | required_status | actual_status | evidence |
|---|---|---|---|---|
| CHK-ACTIVATION | Close predecessor CB-SBX-12A; 14 TXN /19 RACE / parity / source-writer工具链可执行 | closed_or_formal_blocked | not_run | absent |
| CHK-DESIGN | consistency / parity / P0-C evidence;BASE+TXN+EVIDENCE+QUERY+JOB+RELAY; closure evidence: `03`§10~§15;`05`§6 / §9~§13;`06`§8~§11; repeat-check rule: `passed_design`;不得把source writer能力写成source run Pass | design_consistent | not_run | absent |
| CHK-SCOPE | Allowed: `crates/{application,infra,api,worker,jobs}/src/**`;`tests/{service,integration,support}/**`;`scripts/checks/**`;P0-C source-writer support; included behavior: `DEL-SBX-CODE-005`;`DEL-SBX-CODE-011`;`DEL-SBX-CODE-012`;`DEL-SBX-ADP-001`;`DEL-SBX-TEST-001`;`DEL-SBX-TEST-002`;`DEL-SBX-TEST-005`;`DEL-SBX-AUTO-003`;`DEL-SBX-EVD-001`;`DEL-SBX-EVD-002`;`DEL-SBX-EVD-003`P0-C增量;14 TXN、19 RACE、SUITE-001~012 /014 /016、MAIN / OPS writers; forbidden: candidate probe;PROFILE-06 claim;release aggregation;静态EV / pass; candidate result、P1 claim、RELEASE aggregation、static EV | scope_clean | not_run | absent |
| CHK-WORKTREE | Record target root, HEAD, initial git status, local identity, user-owned changes, and staged-file ownership. | worktree_recorded | not_run | absent |
| CHK-BUILD | all 14 TXN /19 deterministic race;fake parity;dependency / redaction / coverage / protocol / pairing / blocked checks;MAIN-CONTRACT / MAIN-SEAM / OPS role separation | pass_or_formal_allowed_status | not_run | absent |
| CHK-TEST | SUITE-SBX-001~012 /014 /016;全14 TXN、19 deterministic race、fake parity、COND-004;MAIN-CONTRACT / MAIN-SEAM / OPS writer与VC-001~006 /008适用 | all_mandatory_pass | not_run | absent |
| CHK-AC-VETO | AC-SBX-006~041全部P0-C slice;EG-SBX-001~018适用;VETO-SBX-001~017的P0-C / integrity面 | assertions_present_and_no_triggered_veto | not_run | absent |
| CHK-ARTIFACT | G2三个fixed source的raw / schema / checks / ESLOT-001~016 producer与pairing能力;不预造run / EV | maturity_contract_satisfied | not_run | absent |
| CHK-REPORT | 各source run / suite / gate / coverage / protocol / PER / redaction / dependency / report-audit能力 | paired_report_or_G0_reason | not_run | absent |
| CHK-EVIDENCE-MATURITY | G2 capability;任一TXN / race不确定、fake parity断裂、role混用、schema / pairing / status传播失败即不提交;不得写source Passed | status_fidelity_and_safe_failure | not_run | absent |
| CHK-READINESS | Config/source: P01~04 complete generation、S06 run isolation、all safety /redaction settings; ENV/adapter: ENV-02 MAIN-CONTRACT writer能力;ENV-03 MAIN-SEAM能力;ENV-04 OPS能力;当前无source run; external/tool: 14 TXN /19 race、fake parity、source schema /writer、checks与fixed roots; unavailable route: harness /role /pairing失败阻断;不得写source Passed /merge MAIN roles | ready_or_formally_blocked | not_run | absent |
| CHK-RISK | Close or confirm before Activation/Design: 14 TXN /19 race、fake parity、redaction、MAIN-CONTRACT /MAIN-SEAM /OPS writer能力和fixed identity全量闭合; route: 任一P0-C /role /pairing缺口阻断;不得写真实source Passed、合并MAIN roles或用targeted补source | closed_or_routed | not_run | absent |
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

Boundary artifact contract: G2三个fixed source的raw / schema / checks / ESLOT-001~016 producer与pairing能力;不预造run / EV

Boundary report contract: 各source run / suite / gate / coverage / protocol / PER / redaction / dependency / report-audit能力

Planned evidence/review reference: fixed source writer raw / report能力及`summary.md`,`gate-results.md`,coverage / inventory / integrity reports

Commit is allowed only when: 14 TXN、19 race、fake parity、双MAIN role、OPS、schema / pairing / status propagation能力通过

Forbidden proof substitution: source run存在 /Passed、RELEASE

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
| planned_commit_title | `test(consistency): harden transactions races and source writers` |
| planned_commit_summary | `Harden P0-C consistency and fixed source writer capabilities for CB-SBX-12B.` |
| planned_body_groups | `Transaction and deterministic race hardening:`;`Semantic fake parity and integrity checks:`;`Fixed source writer capabilities:` |
| same_commit_cause | 14 TXN、19 race、parity、checks和三source writer共同证明P0-C一致性与source真实性 |
| planned_footer | `Co-Authored-By: Codex <noreply@openai.com>` |
| staged_files_checked | `not_run` |
| commit_message_checked | `not_run` |
| committed_hash | `not_committed` |
| committed_message | `not_committed` |
| post_commit_status | `not_run` |

## Review Record

| field | planned_or_actual_value |
|---|---|
| required_review_responsibility | test / consistency / evidence / security reviewers分别核237、14、19、双MAIN role、OPS和controls |
| type_and_scope_review | `test(consistency)`对应hardening主交付 |
| body_group_review | TXN / race / parity / source writers共同证明P0-C |
| review_and_evidence_discipline | test + consistency + evidence + security |
| design_discipline_record | passed_design |
| future_repeat_check | 14 /19 /source role fidelity |
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

Expected successor after a real Handoff Gate pass: `CB-SBX-13A`. The project ledger alone activates that successor.

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
