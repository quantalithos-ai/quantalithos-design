# CB-SBX-11A implementation ledger

> Created by L4-sandbox Step 13 from reviewed Step 6~11 matrices.
> This is a planned recovery contract, not proof of implementation, test execution, evidence, review, acceptance, or authorization.

| field | value |
|---|---|
| project | `L4-sandbox` |
| boundary_id | `CB-SBX-11A` |
| phase | `PH-11` |
| verifiable_goal | 固定10 Job的typed input、selection、report和stored replay kernel。 |
| direct_predecessor | `CB-SBX-10B` |
| design_baseline | `not_fixed` |
| implementation_repo | `/home/aris/Projects/quantalithos-sandbox (absent)` |
| status | `planned` |
| next_allowed_action | `wait_until_current` |
| current_identity | no; wait for project-ledger activation |
| task_ids | `IMPL-SBX-11-01`; `IMPL-SBX-11-02` |
| batch_ids | `BATCH-SBX-11A-01`; `BATCH-SBX-11A-02`; `BATCH-SBX-11A-03`; `BATCH-SBX-11A-04` |
| evidence_maturity | G1;10 surface缺失、job_run_ref作key、partial无item、duplicate重算report、entry直访repository或Failed无report即不提交 |
| implementation_started | `no` |

## Required Reads

| document | required_section | status | notes |
|---|---|---|---|
| projects/L4-sandbox/07-实施计划.md | §1, §3, §5~§12 and this exact boundary row in §6 | not_run | Formal implementation authority and control rules. |
| projects/L4-sandbox/03-详细设计.md | §7.2 / §7.6 / §7.7 / §8.4 / §10.4 Job / §12 | not_run | Exact owner reading copied from Step 6 section 7.4. |
| projects/L4-sandbox/05-测试方案.md | JOB-001~012 | not_run | Exact owner reading copied from Step 6 section 7.4. |
| projects/L4-sandbox/06-验收标准.md | PG-SBX-046~055 | not_run | Exact owner reading copied from Step 6 section 7.4. |
| projects/L4-sandbox/design-calibration/07_implementation_plan_step_06_tasks_commit_boundaries.md | job surface / stored report / idempotency校准 | not_run | Exact calibration or standard reference copied from Step 6 section 7.4. |
| projects/L4-sandbox/design-calibration/07_implementation_plan_step_06_tasks_commit_boundaries.md | §7.1, §7.2, §7.4~§7.8, §7.11; CB-SBX-11A | not_run | Goal, predecessor, closure profiles, scope, tasks, batches, checks, and skeleton schema. |
| projects/L4-sandbox/design-calibration/07_implementation_plan_step_07_test_acceptance_gates.md | §6 and §8; CB-SBX-11A | not_run | Exact suite, AC, VETO, artifact, report, maturity, and review gate. |
| projects/L4-sandbox/design-calibration/07_implementation_plan_step_08_boundary_readiness_matrix.md | CB-SBX-11A readiness row | not_run | Config, environment, adapter, external dependency, and unavailable disposition. |
| projects/L4-sandbox/design-calibration/07_implementation_plan_step_09_boundary_risk_matrix.md | CB-SBX-11A risk row | not_run | Full Spike, Risk, OQ, closure, and safe routing. |
| projects/L4-sandbox/design-calibration/07_implementation_plan_step_10_boundary_control_matrix.md | CB-SBX-11A control row | not_run | Pause, rollback, invalidation, and recovery routing. |
| projects/L4-sandbox/design-calibration/07_implementation_plan_step_11_boundary_commit_message_matrix.md | CB-SBX-11A planned message and commit timing rows | not_run | Exact title, summary, body groups, evidence references, and commit prohibition. |
| projects/L4-sandbox/design-calibration/07_implementation_plan_step_11_review_delivery_audit.md | CB-SBX-11A review and delivery rows | not_run | Independent review, worktree protection, delivery, and handoff discipline. |
| standards/document/代码实施台账与门禁规范.md | project ledger, boundary ledger, nine Gate types, blockers, Commit Gate, and Handoff Gate | not_run | State values and recovery contract. |
| standards/document/设计真相源闭环与可落码性标准.md | boundary codeability and design writeback rules | not_run | Implementation must not invent missing design truth. |
| standards/document/全局项目依赖关系与裁剪规则.md | L4 Sandbox dependency direction and sibling-repository trimming | not_run | Only the allowed core dependency may be compile-time; adjacent products remain ports, events, handoffs, or fakes. |
| standards/document/子项目目录与代码文件组织规范.md | workspace, crate, binary, scripts, artifacts, reports, and implementation-ledger layout | not_run | Directory and code-file organization authority. |
| standards/coding/rust.md | applicable Rust source, tests, formatting, lint, and naming rules | not_run | Target-repository rules may add stricter requirements after repository creation. |

## Allowed Scope

| type | path_or_rule | status |
|---|---|---|
| allowed_path_or_rule | `crates/contracts/src/{jobs,status,errors}.rs` | planned |
| allowed_path_or_rule | `crates/application/src/{jobs,services,ports,repositories,stored_results}.rs` | planned |
| allowed_path_or_rule | `crates/jobs/src/{lib,job_runtime,errors}.rs` | planned |
| allowed_path_or_rule | `tests/{contracts,service,support}/**` | planned |
| included_behavior | `DEL-SBX-CODE-002`;`DEL-SBX-CODE-004`;`DEL-SBX-CODE-008`;`DEL-SBX-CODE-009`;`DEL-SBX-CODE-010`;`DEL-SBX-CODE-011`;`DEL-SBX-CODE-012`增量;10 Job DTO / scope / selection / report / item / stored replay / jobs entry kernel | planned |
| boundary_goal | 固定10 Job的typed input、selection、report和stored replay kernel。 | planned |

## Forbidden Scope

| rule | status | failure_action |
|---|---|---|
| concrete job behavior;core truth repair;scheduler;release reports | active | block_scope_gate; remove the change or reopen design |
| concrete job side effect、scheduler、release reports | active | block_scope_gate; do not stage or commit |
| Do not implement tools semantic execution, runtime agent-loop orchestration, or member lifecycle orchestration inside Sandbox. | active | block_scope_gate; return the concern to its owning project |
| Do not use latest paths, static evidence aliases, prefilled Passed or acceptance decisions, raw secret or process bodies, or unrelated user changes. | active | block_evidence_or_worktree_gate; preserve safe failure material |

## Tasks And Batches

### Tasks

| task_id | order | implementation_action | input | completion_criterion |
|---|---|---|---|---|
| `IMPL-SBX-11-01` | 1 | 编写10 Job input、scope / selector、report / item / exit carrier | PG-SBX-046~055 | full public job surface和source map齐全 |
| `IMPL-SBX-11-02` | 2 | 编写job idempotency、selection paging、per-item UoW、stored report和entry kernel | shared job flow | duplicate不重复owner calls,partial可见 |

### Batches

| batch_id | goal | input_to_output | expected_size | post_batch_check | commit_relation |
|---|---|---|---|---|---|
| `BATCH-SBX-11A-01` | Job schemas 1~5 | formal inventory -> inputs / reports / items | 200~300 | roundtrip / status / required refs | one commit after every batch passes |
| `BATCH-SBX-11A-02` | Job schemas 6~10 | formal inventory -> inputs / reports / items | 200~300 | roundtrip / scope / partial | one commit after every batch passes |
| `BATCH-SBX-11A-03` | job orchestration kernel | shared flow -> selection / per-item UoW / replay | 200~300 | empty / duplicate / partial / conflict | one commit after every batch passes |
| `BATCH-SBX-11A-04` | jobs entry kernel | application report -> runtime / exit disposition | 150~250 | entry detail / no repository bypass | one commit after every batch passes |

Subfunction grouping: 10 Job schemas + orchestration / report replay + entry kernel

Same-commit cause: 所有public Jobs必须先共享同一idempotency、partial report和entry detail面

Verification closure: JOB common / duplicate report

Explicitly excluded: concrete maintenance

## Activation Readiness

| dimension | planned_requirement | actual_status |
|---|---|---|
| config_and_source | I010~I013 /I022 /I025~I027;10 job registry和typed scope | not_run |
| environment_and_adapter | ENV-02 deterministic job harness | not_run |
| external_and_tooling | selection /page、per-item UoW、stored report /replay store | not_run |
| unavailable_disposition | missing report /scope source阻断;duplicate不得重做owner calls | not_run |
| boundary_specific_activation | relay / marker owner汇合;job report / replay contract稳定 | not_run |

## Design Closure And Risk

| field | planned_value | actual_status |
|---|---|---|
| closure_profiles | public job surface;BASE+CONTRACT+TXN+JOB | not_run |
| applicable_experience | job DTO / selector / source map;scope expansion;report details;stored replay;entry context;partial status | not_run |
| formal_evidence_location | `03`§7.6~§8.4 / §10 / §12;`05`JOB;`06`PG-046~055 | not_run |
| explicit_non_applicability | concrete adapter side effect不适用:只建立shared kernel | not_run |
| design_level_conclusion | `passed_design`;job_run_ref不得作idempotency key | design_record_only |
| activation_or_design_closure | 10 typed job input /scope /selection /page /per-item UoW /stored report replay闭合 | not_run |
| safe_route_if_open_or_triggered | scope /report缺口`wait_design`;duplicate owner calls必须0,不得用job修truth | not_run |

| reference_type | full_references | execution_status |
|---|---|---|
| spike | `SP-SBX-IMP-007`; `SP-SBX-IMP-011` | not_run |
| risk | `R-SBX-IMP-003`; `R-SBX-IMP-005`; `R-SBX-IMP-008`; `R-SBX-IMP-010`; `R-SBX-IMP-011`; `R-SBX-IMP-019`; `R-SBX-IMP-020` | not_run |
| open_question | none_by_boundary_matrix | not_run |

## Required Checks

| check_id | command_or_assertion | required_status | actual_status | evidence |
|---|---|---|---|---|
| CHK-ACTIVATION | Close predecessor CB-SBX-10B; relay / marker owner汇合;job report / replay contract稳定 | closed_or_formal_blocked | not_run | absent |
| CHK-DESIGN | public job surface;BASE+CONTRACT+TXN+JOB; closure evidence: `03`§7.6~§8.4 / §10 / §12;`05`JOB;`06`PG-046~055; repeat-check rule: `passed_design`;job_run_ref不得作idempotency key | design_consistent | not_run | absent |
| CHK-SCOPE | Allowed: `crates/contracts/src/{jobs,status,errors}.rs`;`crates/application/src/{jobs,services,ports,repositories,stored_results}.rs`;`crates/jobs/src/{lib,job_runtime,errors}.rs`;`tests/{contracts,service,support}/**`; included behavior: `DEL-SBX-CODE-002`;`DEL-SBX-CODE-004`;`DEL-SBX-CODE-008`;`DEL-SBX-CODE-009`;`DEL-SBX-CODE-010`;`DEL-SBX-CODE-011`;`DEL-SBX-CODE-012`增量;10 Job DTO / scope / selection / report / item / stored replay / jobs entry kernel; forbidden: concrete job behavior;core truth repair;scheduler;release reports; concrete job side effect、scheduler、release reports | scope_clean | not_run | absent |
| CHK-WORKTREE | Record target root, HEAD, initial git status, local identity, user-owned changes, and staged-file ownership. | worktree_recorded | not_run | absent |
| CHK-BUILD | `JOB-001~012`shared contract;invalid input / empty selection / duplicate report / idempotency conflict / partial status / entry detail tests | pass_or_formal_allowed_status | not_run | absent |
| CHK-TEST | SUITE-SBX-006 /011 contract-kernel slice:JOB-001~012 shared contract、invalid / empty / partial / stored report replay;适用TXN / ERR | all_mandatory_pass | not_run | absent |
| CHK-AC-VETO | AC-SBX-018~023 /030~041适用;AC-SBX-031 PROTOCOL-SLICE;VETO-SBX-005 /006 /010 /012 /013 /016 | assertions_present_and_no_triggered_veto | not_run | absent |
| CHK-ARTIFACT | G1 job carrier / selection / replay / error / audit raw | maturity_contract_satisfied | not_run | absent |
| CHK-REPORT | job / protocol suite reports与targeted report-audit | paired_report_or_G0_reason | not_run | absent |
| CHK-EVIDENCE-MATURITY | G1;10 surface缺失、job_run_ref作key、partial无item、duplicate重算report、entry直访repository或Failed无report即不提交 | status_fidelity_and_safe_failure | not_run | absent |
| CHK-READINESS | Config/source: I010~I013 /I022 /I025~I027;10 job registry和typed scope; ENV/adapter: ENV-02 deterministic job harness; external/tool: selection /page、per-item UoW、stored report /replay store; unavailable route: missing report /scope source阻断;duplicate不得重做owner calls | ready_or_formally_blocked | not_run | absent |
| CHK-RISK | Close or confirm before Activation/Design: 10 typed job input /scope /selection /page /per-item UoW /stored report replay闭合; route: scope /report缺口`wait_design`;duplicate owner calls必须0,不得用job修truth | closed_or_routed | not_run | absent |
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

Boundary artifact contract: G1 job carrier / selection / replay / error / audit raw

Boundary report contract: job / protocol suite reports与targeted report-audit

Planned evidence/review reference: job / protocol reports及report audit

Commit is allowed only when: 10 /10 input、bounded selection、per-item result、partial / failed report与stored replay通过

Forbidden proof substitution: concrete maintenance、scheduler

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
| planned_commit_title | `feat(jobs): add replayable operations job kernel` |
| planned_commit_summary | `Add the shared replayable public job kernel for CB-SBX-11A.` |
| planned_body_groups | `Job schemas and bounded selection:`;`Per-item orchestration and stored report replay:`;`Job runtime entry kernel:` |
| same_commit_cause | 10 Job必须先共享idempotency、selection、partial report、stored replay和entry detail面 |
| planned_footer | `Co-Authored-By: Codex <noreply@openai.com>` |
| staged_files_checked | `not_run` |
| commit_message_checked | `not_run` |
| committed_hash | `not_committed` |
| committed_message | `not_committed` |
| post_commit_status | `not_run` |

## Review Record

| field | planned_or_actual_value |
|---|---|
| required_review_responsibility | job contract / application / entry reviewer核10/10 input、selection、per-item report和stored replay |
| type_and_scope_review | `feat(jobs)`对应shared kernel |
| body_group_review | schema / orchestration / runtime共享stored report |
| review_and_evidence_discipline | jobs contract + application + entry |
| design_discipline_record | passed_design |
| future_repeat_check | 10 /10 job / partial report |
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

Expected successor after a real Handoff Gate pass: `CB-SBX-11B`. The project ledger alone activates that successor.

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
