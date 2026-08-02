# CB-SBX-12A implementation ledger

> Created by L4-sandbox Step 13 from reviewed Step 6~11 matrices; current design inventory synchronized by `v7.9-closeout`.
> This is a planned recovery contract, not proof of implementation, test execution, evidence, review, acceptance, or authorization.

| field | value |
|---|---|
| project | `L4-sandbox` |
| boundary_id | `CB-SBX-12A` |
| phase | `PH-12` |
| verifiable_goal | 冻结55 protocol、30 owner-level state machines、31 Step 10 canonical enum entries、39 Step 6 shared status declarations、38 typed errors及254 TC /237 P0-C唯一主归属inventory；这些是实现前的current design inventory，不是执行结果。 |
| direct_predecessor | `CB-SBX-11C` |
| design_baseline | `not_fixed` |
| implementation_repo | `/home/aris/Projects/quantalithos-sandbox (absent)` |
| status | `planned` |
| next_allowed_action | `wait_until_current` |
| current_identity | no; wait for project-ledger activation |
| task_ids | `IMPL-SBX-12-01`; `IMPL-SBX-12-02` |
| batch_ids | `BATCH-SBX-12A-01`; `BATCH-SBX-12A-02`; `BATCH-SBX-12A-03`; `BATCH-SBX-12A-04` |
| evidence_maturity | G1 planned contract;55 /30 /31 /39 /38 /254 /237任一missing / duplicate /错族 /换义或owner orphan即不提交；三层状态库存不得互相替代；设计缺口回写owner |
| implementation_started | `no` |

## Required Reads

| document | required_section | status | notes |
|---|---|---|---|
| projects/L4-sandbox/07-实施计划.md | §1, §3, §5~§12 and this exact boundary row in §6 | not_run | Formal implementation authority and control rules. |
| projects/L4-sandbox/03-详细设计.md | §6~§9 / §11 / §15 | not_run | Exact owner reading copied from Step 6 section 7.4. |
| projects/L4-sandbox/05-测试方案.md | §3.3~§6.4 / §9.1 | not_run | Exact owner reading copied from Step 6 section 7.4. |
| projects/L4-sandbox/06-验收标准.md | §7.2~§8.4 | not_run | Exact owner reading copied from Step 6 section 7.4. |
| projects/L4-sandbox/design-calibration/07_implementation_plan_step_06_tasks_commit_boundaries.md | protocol / state / error inventory校准 | not_run | Exact calibration or standard reference copied from Step 6 section 7.4. |
| projects/L4-sandbox/design-calibration/07_implementation_plan_step_06_tasks_commit_boundaries.md | Step 5 §9.2~§9.3 | not_run | Exact calibration or standard reference copied from Step 6 section 7.4. |
| projects/L4-sandbox/design-calibration/07_implementation_plan_step_06_tasks_commit_boundaries.md | §7.1, §7.2, §7.4~§7.8, §7.11; CB-SBX-12A | not_run | Goal, predecessor, closure profiles, scope, tasks, batches, checks, and skeleton schema. |
| projects/L4-sandbox/design-calibration/07_implementation_plan_step_07_test_acceptance_gates.md | §6 and §8; CB-SBX-12A | not_run | Exact suite, AC, VETO, artifact, report, maturity, and review gate. |
| projects/L4-sandbox/design-calibration/07_implementation_plan_step_08_boundary_readiness_matrix.md | CB-SBX-12A readiness row | not_run | Config, environment, adapter, external dependency, and unavailable disposition. |
| projects/L4-sandbox/design-calibration/07_implementation_plan_step_09_boundary_risk_matrix.md | CB-SBX-12A risk row | not_run | Full Spike, Risk, OQ, closure, and safe routing. |
| projects/L4-sandbox/design-calibration/07_implementation_plan_step_10_boundary_control_matrix.md | CB-SBX-12A control row | not_run | Pause, rollback, invalidation, and recovery routing. |
| projects/L4-sandbox/design-calibration/07_implementation_plan_step_11_boundary_commit_message_matrix.md | CB-SBX-12A planned message and commit timing rows | not_run | Exact title, summary, body groups, evidence references, and commit prohibition. |
| projects/L4-sandbox/design-calibration/07_implementation_plan_step_11_review_delivery_audit.md | CB-SBX-12A review and delivery rows | not_run | Independent review, worktree protection, delivery, and handoff discipline. |
| standards/document/代码实施台账与门禁规范.md | project ledger, boundary ledger, nine Gate types, blockers, Commit Gate, and Handoff Gate | not_run | State values and recovery contract. |
| standards/document/设计真相源闭环与可落码性标准.md | boundary codeability and design writeback rules | not_run | Implementation must not invent missing design truth. |
| standards/document/全局项目依赖关系与裁剪规则.md | L4 Sandbox dependency direction and sibling-repository trimming | not_run | Only the allowed core dependency may be compile-time; adjacent products remain ports, events, handoffs, or fakes. |
| standards/document/子项目目录与代码文件组织规范.md | workspace, crate, binary, scripts, artifacts, reports, and implementation-ledger layout | not_run | Directory and code-file organization authority. |
| standards/coding/rust.md | applicable Rust source, tests, formatting, lint, and naming rules | not_run | Target-repository rules may add stricter requirements after repository creation. |

## Allowed Scope

| type | path_or_rule | status |
|---|---|---|
| allowed_path_or_rule | `crates/{contracts,domain,application,api,worker,jobs}/src/**` | planned |
| allowed_path_or_rule | `tests/{contracts,domain,service}/**` | planned |
| allowed_path_or_rule | expected protocol / TC manifest under`tests/support/**` | planned |
| included_behavior | `DEL-SBX-CODE-002`;`DEL-SBX-CODE-003`;`DEL-SBX-CODE-004`;`DEL-SBX-CODE-005`;`DEL-SBX-CODE-006`;`DEL-SBX-CODE-007`;`DEL-SBX-CODE-008`;`DEL-SBX-CODE-009`;`DEL-SBX-CODE-010`;`DEL-SBX-TEST-001`;`DEL-SBX-TEST-002`P0-C inventory增量;10 Command +13 Query +9 Consumer +13 Event +10 Job、30 owner machines、31 canonical enum entries、39 shared declarations、38 typed errors、254 TC /237 P0-C主case | planned |
| boundary_goal | 只冻结既有formal owner inventory和唯一主归属；不得新增协议、状态、error或case语义。 | planned |

## Forbidden Scope

| rule | status | failure_action |
|---|---|---|
| 新协议 /状态 /错误;infra product;candidate;report / release结论 | active | block_scope_gate; remove the change or reopen design |
| 新协议 /状态 /错误 /case语义、candidate、release report | active | block_scope_gate; do not stage or commit |
| Do not implement tools semantic execution, runtime agent-loop orchestration, or member lifecycle orchestration inside Sandbox. | active | block_scope_gate; return the concern to its owning project |
| Do not use latest paths, static evidence aliases, prefilled Passed or acceptance decisions, raw secret or process bodies, or unrelated user changes. | active | block_evidence_or_worktree_gate; preserve safe failure material |

## Tasks And Batches

### Tasks

| task_id | order | implementation_action | input | completion_criterion |
|---|---|---|---|---|
| `IMPL-SBX-12-01` | 1 | 建立55 protocol、30 owner-machine、31 canonical-enum、39 shared-declaration、38 typed-error、254 TC expected manifests | formal inventories | 缺失 /重复 /错族 /同义项机械失败；三层状态计数分别可追溯 |
| `IMPL-SBX-12-02` | 2 | 补齐237条P0-C主case和SUITE-001~006 /010 /011 harness | `05`§6 / §9 | P0-C主归属唯一,无candidate补偿 |

### Batches

| batch_id | goal | input_to_output | expected_size | post_batch_check | commit_relation |
|---|---|---|---|---|---|
| `BATCH-SBX-12A-01` | protocol / state manifests | formal tables -> 55 protocol + 30 owner machines +31 canonical enum +39 shared declaration expected indexes | 150~250 | exact counts / no duplicate / cross-layer join | one commit after every batch passes |
| `BATCH-SBX-12A-02` | error / TC manifests | error / case owners -> 38 /254 index | 150~250 | 38 /254 /237 split | one commit after every batch passes |
| `BATCH-SBX-12A-03` | contract / domain completion | manifests -> missing owner tests / fixes | 200~300 | SUITE-001/002/010 | one commit after every batch passes |
| `BATCH-SBX-12A-04` | service / entry completion | protocol manifest -> missing family tests / fixes | 200~300 | SUITE-004~006/011 | one commit after every batch passes |

Subfunction grouping: inventories + P0-C contract / domain / service completion

Same-commit cause: counts与缺口修复必须在同一baseline闭合,避免manifest与实现漂移

Verification closure: 55 protocol /30 owner machines /31 canonical enum entries /39 shared declarations /38 typed errors /254 TC /237 P0-C exact

Explicitly excluded: 新语义 / candidate

## Activation Readiness

| dimension | planned_requirement | actual_status |
|---|---|---|
| config_and_source | 40 /101 /44 expected index与55 /30 owner machines /31 canonical enum entries /39 shared declarations /38 /254 /237 manifests可读取 | not_run |
| environment_and_adapter | ENV-02 inventory /contract harness | not_run |
| external_and_tooling | generated manifests、protocol /state /error /TC scanners | not_run |
| unavailable_disposition | missing /duplicate /换义为Failed或`wait_design`;不得新增同义ID | not_run |
| boundary_specific_activation | 55 protocol、30 owner machines、31 canonical enum entries、39 shared declarations、38 typed errors、254 TC /237 P0-C owner集合冻结 | not_run |

## Design Closure And Risk

| field | planned_value | actual_status |
|---|---|---|
| closure_profiles | protocol / state / error / TC inventory;BASE+CONTRACT+STATE | not_run |
| applicable_experience | exact owner counts;support carrier;reserved variants;typed producer;phase boundary;test owner uniqueness | not_run |
| formal_evidence_location | `03`§6~§9 / §11;`05`§3 / §6 / §9;`06`§7~§8 | not_run |
| explicit_non_applicability | adapter / artifact runtime不适用:本boundary只修既有contract / case缺口 | not_run |
| design_level_conclusion | `passed_design`;55 /30 /31 /39 /38 /254 /237无orphan为commit前门禁 | design_record_only |
| activation_or_design_closure | 55 protocol、30 owner machines、31 canonical enum entries、39 shared declarations、38 typed errors、254 TC /237 P0-C、40 /101 /44 manifest读取与唯一主归属无缺失 /换义 | not_run |
| safe_route_if_open_or_triggered | design inventory缺口`wait_design`;不得新增同义ID或用report伪装完整 | not_run |

| reference_type | full_references | execution_status |
|---|---|---|
| spike | none_by_boundary_matrix | not_run |
| risk | `R-SBX-IMP-003`; `R-SBX-IMP-004`; `R-SBX-IMP-006`; `R-SBX-IMP-008`; `R-SBX-IMP-010`; `R-SBX-IMP-013`; `R-SBX-IMP-019`; `R-SBX-IMP-020` | not_run |
| open_question | none_by_boundary_matrix | not_run |

## Required Checks

| check_id | command_or_assertion | required_status | actual_status | evidence |
|---|---|---|---|---|
| CHK-ACTIVATION | Close predecessor CB-SBX-11C; 55 protocol、30 owner machines、31 canonical enum entries、39 shared declarations、38 typed errors、254 TC /237 P0-C owner集合冻结 | closed_or_formal_blocked | not_run | absent |
| CHK-DESIGN | protocol / state / error / TC inventory;BASE+CONTRACT+STATE; closure evidence: `03`§6~§9 / §11;`05`§3 / §6 / §9;`06`§7~§8; repeat-check rule: `passed_design`;55 /30 /31 /39 /38 /254 /237无orphan为commit前门禁 | design_consistent | not_run | absent |
| CHK-SCOPE | Allowed: `crates/{contracts,domain,application,api,worker,jobs}/src/**`;`tests/{contracts,domain,service}/**`;expected protocol / TC manifest under`tests/support/**`; included behavior: `DEL-SBX-CODE-002`;`DEL-SBX-CODE-003`;`DEL-SBX-CODE-004`;`DEL-SBX-CODE-005`;`DEL-SBX-CODE-006`;`DEL-SBX-CODE-007`;`DEL-SBX-CODE-008`;`DEL-SBX-CODE-009`;`DEL-SBX-CODE-010`;`DEL-SBX-TEST-001`;`DEL-SBX-TEST-002`P0-C inventory增量;10 Command +13 Query +9 Consumer +13 Event +10 Job、30 owner machines、31 canonical enum entries、39 shared declarations、38 typed errors、254 TC /237 P0-C主case; forbidden: 新协议 /状态 /错误;infra product;candidate;report / release结论; 新协议 /状态 /错误 /case语义、candidate、release report | scope_clean | not_run | absent |
| CHK-WORKTREE | Record target root, HEAD, initial git status, local identity, user-owned changes, and staged-file ownership. | worktree_recorded | not_run | absent |
| CHK-BUILD | protocol 55 /55、owner machines 30 /30、canonical enum entries 31 /31、shared declarations 39 /39、typed errors 38 /38、TC 254 /254且P0-C 237 unique-owner manifest;SUITE-001~006 /010 /011 targeted | pass_or_formal_allowed_status | not_run | absent |
| CHK-TEST | inventory gate:55 protocol、30 owner machines /31 canonical enum entries /39 shared declarations、38 typed error、254 expected TC与237 P0-C唯一owner;SUITE-SBX-001~006 /010 /011 targeted补缺,不得新增语义 | all_mandatory_pass | not_run | absent |
| CHK-AC-VETO | AC-SBX-006~041的P0-C trace完整性;AC-SBX-031双slice;VETO-SBX-001 /005 /006 /010 /012 /013 /016 /017 | assertions_present_and_no_triggered_veto | not_run | absent |
| CHK-ARTIFACT | G1 expected manifests、inventory raw与受影响suite raw;无machine evidence index / EV | maturity_contract_satisfied | not_run | absent |
| CHK-REPORT | suite reports、targeted `tc-coverage.md`,`protocol-inventory.md`,`per-coverage.md` | paired_report_or_G0_reason | not_run | absent |
| CHK-EVIDENCE-MATURITY | G1;55 /30 /31 /39 /38 /254 /237任一missing / duplicate /错族 /换义或owner orphan即不提交;三层库存不得互相替代；设计缺口回写owner | status_fidelity_and_safe_failure | not_run | absent |
| CHK-READINESS | Config/source: 40 /101 /44 expected index与55 /30 /31 /39 /38 /254 /237 manifests可读取; ENV/adapter: ENV-02 inventory /contract harness; external/tool: generated manifests、protocol /state /error /TC scanners; unavailable route: missing /duplicate /换义为Failed或`wait_design`;不得新增同义ID | ready_or_formally_blocked | not_run | absent |
| CHK-RISK | Close or confirm before Activation/Design: 55 protocol、30 /31 /39 state inventory、38 typed errors、254 TC /237 P0-C、40 /101 /44 manifest读取与唯一主归属无缺失 /换义; route: design inventory缺口`wait_design`;不得新增同义ID或用report伪装完整 | closed_or_routed | not_run | absent |
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

Boundary artifact contract: G1 expected manifests、inventory raw与受影响suite raw;无machine evidence index / EV

Boundary report contract: suite reports、targeted `tc-coverage.md`,`protocol-inventory.md`,`per-coverage.md`

Planned evidence/review reference: suite reports、`tc-coverage.md`,`protocol-inventory.md`,`per-coverage.md`

Commit is allowed only when: 55 protocol、30 owner machines、31 canonical enum entries、39 shared declarations、38 typed errors、254 expected、237 P0-C owner均无missing /duplicate /换义

Forbidden proof substitution: 新协议 /状态 /错误、candidate

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
| planned_commit_title | `feat(protocol): close protocol state and error inventories` |
| planned_commit_summary | `Close the canonical protocol, state, error, and P0-C owner inventories for CB-SBX-12A.` |
| planned_body_groups | `Canonical inventories and expected manifests:`;`Contract, domain, and service gap closure:`;`Unique owner and coverage checks:` |
| same_commit_cause | count manifest与实际缺口修复必须在同一baseline冻结,避免编号 / owner漂移 |
| planned_footer | `Co-Authored-By: Codex <noreply@openai.com>` |
| staged_files_checked | `not_run` |
| commit_message_checked | `not_run` |
| committed_hash | `not_committed` |
| committed_message | `not_committed` |
| post_commit_status | `not_run` |

## Review Record

| field | planned_or_actual_value |
|---|---|
| required_review_responsibility | contracts + test architecture + acceptance trace reviewer逐项核唯一owner,不按总数抽样 |
| type_and_scope_review | `feat(protocol)`对应inventory closure |
| body_group_review | manifests / gap closure / owner checks必须同baseline |
| review_and_evidence_discipline | contracts + test architecture + trace |
| design_discipline_record | passed_design |
| future_repeat_check | 55 /30 /31 /39 /38 /254 /237 exact，三层状态库存分开核对 |
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

Expected successor after a real Handoff Gate pass: `CB-SBX-12B`. The project ledger alone activates that successor.

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
