# CB-SBX-07C implementation ledger

> Created by L4-sandbox Step 13 from reviewed Step 6~11 matrices.
> This is a planned recovery contract, not proof of implementation, test execution, evidence, review, acceptance, or authorization.

| field | value |
|---|---|
| project | `L4-sandbox` |
| boundary_id | `CB-SBX-07C` |
| phase | `PH-07` |
| verifiable_goal | 通过`HandoffTargetDeliveryPort::{deliver, inspect_same_attempt}`打通per-target handoff，opening零外呼且delivery失败不回滚capture。 |
| direct_predecessor | `CB-SBX-07B` |
| design_baseline | `not_fixed` |
| implementation_repo | `/home/aris/Projects/quantalithos-sandbox (absent)` |
| status | `planned` |
| next_allowed_action | `wait_until_current` |
| current_identity | no; wait for project-ledger activation |
| task_ids | `IMPL-SBX-07-03` |
| batch_ids | `BATCH-SBX-07C-01`; `BATCH-SBX-07C-02`; `BATCH-SBX-07C-03` |
| evidence_maturity | G1;opening delivery call非0、target plan / complete progress set不完整、未先提交`Attempting`、unknown重新deliver、手工覆盖`HandoffFactStatus`、伪Delivered或回滚capture即不提交 |
| implementation_started | `no` |

## Required Reads

| document | required_section | status | notes |
|---|---|---|---|
| projects/L4-sandbox/07-实施计划.md | §1, §3, §5~§12 and this exact boundary row in §6 | not_run | Formal implementation authority and control rules. |
| projects/L4-sandbox/03-详细设计.md | §6 handoff / §7.3 Command 6 / §8.5 handoff flow / §10~§12 | not_run | Exact owner reading copied from Step 6 section 7.4. |
| projects/L4-sandbox/05-测试方案.md | CMD-011/012 | not_run | Exact owner reading copied from Step 6 section 7.4. |
| projects/L4-sandbox/06-验收标准.md | PG-SBX-006 | not_run | Exact owner reading copied from Step 6 section 7.4. |
| projects/L4-sandbox/design-calibration/07_implementation_plan_step_06_tasks_commit_boundaries.md | handoff adapter / no-rollback校准 | not_run | Exact calibration or standard reference copied from Step 6 section 7.4. |
| projects/L4-sandbox/design-calibration/06_acceptance_step_05_function_gate.md | `06_acceptance_step_05_function_gate.md` | not_run | Exact calibration or standard reference copied from Step 6 section 7.4. |
| projects/L4-sandbox/design-calibration/07_implementation_plan_step_06_tasks_commit_boundaries.md | §7.1, §7.2, §7.4~§7.8, §7.11; CB-SBX-07C | not_run | Goal, predecessor, closure profiles, scope, tasks, batches, checks, and skeleton schema. |
| projects/L4-sandbox/design-calibration/07_implementation_plan_step_07_test_acceptance_gates.md | §6 and §8; CB-SBX-07C | not_run | Exact suite, AC, VETO, artifact, report, maturity, and review gate. |
| projects/L4-sandbox/design-calibration/07_implementation_plan_step_08_boundary_readiness_matrix.md | CB-SBX-07C readiness row | not_run | Config, environment, adapter, external dependency, and unavailable disposition. |
| projects/L4-sandbox/design-calibration/07_implementation_plan_step_09_boundary_risk_matrix.md | CB-SBX-07C risk row | not_run | Full Spike, Risk, OQ, closure, and safe routing. |
| projects/L4-sandbox/design-calibration/07_implementation_plan_step_10_boundary_control_matrix.md | CB-SBX-07C control row | not_run | Pause, rollback, invalidation, and recovery routing. |
| projects/L4-sandbox/design-calibration/07_implementation_plan_step_11_boundary_commit_message_matrix.md | CB-SBX-07C planned message and commit timing rows | not_run | Exact title, summary, body groups, evidence references, and commit prohibition. |
| projects/L4-sandbox/design-calibration/07_implementation_plan_step_11_review_delivery_audit.md | CB-SBX-07C review and delivery rows | not_run | Independent review, worktree protection, delivery, and handoff discipline. |
| standards/document/代码实施台账与门禁规范.md | project ledger, boundary ledger, nine Gate types, blockers, Commit Gate, and Handoff Gate | not_run | State values and recovery contract. |
| standards/document/设计真相源闭环与可落码性标准.md | boundary codeability and design writeback rules | not_run | Implementation must not invent missing design truth. |
| standards/document/全局项目依赖关系与裁剪规则.md | L4 Sandbox dependency direction and sibling-repository trimming | not_run | Only the allowed core dependency may be compile-time; adjacent products remain ports, events, handoffs, or fakes. |
| standards/document/子项目目录与代码文件组织规范.md | workspace, crate, binary, scripts, artifacts, reports, and implementation-ledger layout | not_run | Directory and code-file organization authority. |
| standards/coding/rust.md | applicable Rust source, tests, formatting, lint, and naming rules | not_run | Target-repository rules may add stricter requirements after repository creation. |

## Allowed Scope

| type | path_or_rule | status |
|---|---|---|
| allowed_path_or_rule | `crates/contracts/src/{commands,events,views}.rs` | planned |
| allowed_path_or_rule | `crates/domain/src/{handoff,relay,audit,errors}.rs` | planned |
| allowed_path_or_rule | `crates/application/src/{commands,services,ports,repositories}.rs` | planned |
| allowed_path_or_rule | `crates/infra/src/{handoff_adapters,truth_repositories,fakes}.rs` | planned |
| allowed_path_or_rule | `crates/api/src/command_handlers.rs` | planned |
| allowed_path_or_rule | `tests/{domain,service,integration}/**` | planned |
| included_behavior | 同上适用增量;Command 6、`SandboxMaterialHandoffChanged`、`HandoffTargetDeliveryPort::{deliver, inspect_same_attempt}`、fixed target plan、完整progress set、per-attempt UoW、derived `HandoffFactStatus`和no-capture-rollback | planned |
| boundary_goal | opening只提交fixed target plan、完整`Pending` progress set和派生`HandoffFact`且delivery calls=0；每个target先commit exact `Attempting` attempt再外呼一次，unknown只inspect same attempt。 | planned |

## Forbidden Scope

| rule | status | failure_action |
|---|---|---|
| retry Job / feedback Consumer;downstream truth;capture rollback;acceptance结论 | active | block_scope_gate; remove the change or reopen design |
| retry Job / feedback Consumer、downstream truth、acceptance | active | block_scope_gate; do not stage or commit |
| Do not implement tools semantic execution, runtime agent-loop orchestration, or member lifecycle orchestration inside Sandbox. | active | block_scope_gate; return the concern to its owning project |
| Do not use latest paths, static evidence aliases, prefilled Passed or acceptance decisions, raw secret or process bodies, or unrelated user changes. | active | block_evidence_or_worktree_gate; preserve safe failure material |

## Tasks And Batches

### Tasks

| task_id | order | implementation_action | input | completion_criterion |
|---|---|---|---|---|
| `IMPL-SBX-07-03` | 3 | 编写Command 6 / Handoff event、opening UoW、`HandoffTargetDeliveryPort` 2 /2 methods、per-target attempt flow和aggregate derivation | `OpenMaterialHandoff`;PG-SBX-006 | opening call=0；`Pending | eligible Retryable -> Attempting`先提交；每个committed attempt最多一次deliver；unknown只inspect same attempt；delivery失败只改handoff且不回滚capture |

### Batches

| batch_id | goal | input_to_output | expected_size | post_batch_check | commit_relation |
|---|---|---|---|---|---|
| `BATCH-SBX-07C-01` | handoff opening / state | target / material refs -> fixed plan / complete `Pending` progress set / derived fact / event | 200~300 | opening delivery calls=0;target-plan/progress 1:1;no material `DeadLetter` | one commit after every batch passes |
| `BATCH-SBX-07C-02` | per-target delivery no-rollback | commit exact `Attempting` -> one `deliver` -> typed observation or `inspect_same_attempt` -> CAS apply | 200~300 | same-attempt identity;retryable / failed source unchanged;aggregate mechanically derived | one commit after every batch passes |
| `BATCH-SBX-07C-03` | handoff entry tests | service -> API / producer tests | 100~200 | CMD-011 /012;version / replay | one commit after every batch passes |

Subfunction grouping: handoff carrier / truth + delivery + entry

Same-commit cause: delivery outcome、owner state与no-capture-rollback必须同一审查单元

Verification closure: opening call=0;complete progress set;`HandoffTargetDeliveryPort` 2 /2;attempt-before-call;same-attempt inspect;derived aggregate;source unchanged

Explicitly excluded: retry Job / downstream truth

## Activation Readiness

| dimension | planned_requirement | actual_status |
|---|---|---|
| config_and_source | I055~I064;registered target与frozen material refs | not_run |
| environment_and_adapter | ENV-02 handoff fake;ENV-03 controlled target /receipt seam | not_run |
| external_and_tooling | target identity、retryable /failed、no-capture-rollback trace | not_run |
| unavailable_disposition | target missing current command reject或failed;receipt不等于downstream accepted | not_run |
| boundary_specific_activation | immutable capture refs、registered target plan和`HandoffTargetDeliveryPort` 2 /2 method contract可用 | not_run |

## Design Closure And Risk

| field | planned_value | actual_status |
|---|---|---|
| closure_profiles | handoff / external delivery;BASE+CONTRACT+STATE+TXN | not_run |
| applicable_experience | fixed target plan;complete progress set;per-target attempt identity;attempt-before-call;same-attempt inspection;finite observation;mechanically derived aggregate;no-rollback;stored result;terminal guard | not_run |
| formal_evidence_location | `03`§6~§12;`05`CMD-011/012;`06`PG-006 | not_run |
| explicit_non_applicability | retry Job / feedback Consumer不适用:用formal outcome fake验证owner truth | not_run |
| design_level_conclusion | `passed_design`;不拥有下游truth | design_record_only |
| activation_or_design_closure | opening零外呼、target identity /complete progress set、`Attempting` commit、single deliver、same-attempt inspect、`HandoffFactStatus` mechanical derivation、receipt证明上限与capture no-rollback闭合 | not_run |
| safe_route_if_open_or_triggered | reservation commit unknown停止外呼并fresh-read；delivery unknown只inspect same attempt；target缺失按formal reject /failed；receipt不等于downstream accepted；不得回滚capture | not_run |

| reference_type | full_references | execution_status |
|---|---|---|
| spike | `SP-SBX-IMP-007` | not_run |
| risk | `R-SBX-IMP-003`; `R-SBX-IMP-005`; `R-SBX-IMP-008`; `R-SBX-IMP-009`; `R-SBX-IMP-019`; `R-SBX-IMP-020` | not_run |
| open_question | none_by_boundary_matrix | not_run |

## Required Checks

| check_id | command_or_assertion | required_status | actual_status | evidence |
|---|---|---|---|---|
| CHK-ACTIVATION | Close predecessor CB-SBX-07B; immutable capture refs、registered target plan和`HandoffTargetDeliveryPort` 2 /2 method contract可用 | closed_or_formal_blocked | not_run | absent |
| CHK-DESIGN | handoff / external delivery;BASE+CONTRACT+STATE+TXN; closure evidence: `03`§6~§12;`05`CMD-011/012;`06`PG-006; repeat-check rule: `passed_design`;opening提交fixed plan + complete `Pending` set且0 delivery；attempt-before-call；unknown只inspect same attempt；aggregate只机械派生且无material `DeadLetter`；不拥有下游truth | design_consistent | not_run | absent |
| CHK-SCOPE | Allowed: `crates/contracts/src/{commands,events,views}.rs`;`crates/domain/src/{handoff,relay,audit,errors}.rs`;`crates/application/src/{commands,services,ports,repositories}.rs`;`crates/infra/src/{handoff_adapters,truth_repositories,fakes}.rs`;`crates/api/src/command_handlers.rs`;`tests/{domain,service,integration}/**`; included behavior: 同上适用增量;Command 6、`SandboxMaterialHandoffChanged`、handoff truth / target / outcome和no-capture-rollback; forbidden: retry Job / feedback Consumer;downstream truth;capture rollback;acceptance结论; retry Job / feedback Consumer、downstream truth、acceptance | scope_clean | not_run | absent |
| CHK-WORKTREE | Record target root, HEAD, initial git status, local identity, user-owned changes, and staged-file ownership. | worktree_recorded | not_run | absent |
| CHK-BUILD | `TC-SBX-CMD-011`;`TC-SBX-CMD-012`;STA-015 /STA-031；opening call=0、complete set、`Attempting` commit、one deliver、same-attempt inspect、Delivered / Retryable / Failed、target mismatch、duplicate、version conflict、source unchanged tests | pass_or_formal_allowed_status | not_run | absent |
| CHK-TEST | SUITE-SBX-002 /004 /008 /010及007 /009适用:CMD-011/012、STA-015 /031 handoff slices、ERR-009/035~038;opening zero-call、attempt-before-call、same-attempt inspection、derived aggregate、Delivered / Retryable / Failed、target mismatch、source unchanged | all_mandatory_pass | not_run | absent |
| CHK-AC-VETO | AC-SBX-017~019 /029 /032~041;VETO-SBX-001 /005 /006 /009~011 /013 /016 | assertions_present_and_no_triggered_veto | not_run | absent |
| CHK-ARTIFACT | G1 handoff / relay / replay / consistency / audit raw与pairing check | maturity_contract_satisfied | not_run | absent |
| CHK-REPORT | suite reports、targeted pairing / redaction report | paired_report_or_G0_reason | not_run | absent |
| CHK-EVIDENCE-MATURITY | G1;opening delivery call非0、target plan / complete progress set不完整、未先提交`Attempting`、unknown重新deliver、手工覆盖`HandoffFactStatus`、伪Delivered、downstream truth入仓或回滚capture即不提交 | status_fidelity_and_safe_failure | not_run | absent |
| CHK-READINESS | Config/source: I055~I064;registered target与frozen material refs; ENV/adapter: ENV-02 handoff fake;ENV-03 controlled target /receipt seam; external/tool: target identity、retryable /failed、no-capture-rollback trace; unavailable route: target missing current command reject或failed;receipt不等于downstream accepted | ready_or_formally_blocked | not_run | absent |
| CHK-RISK | Close or confirm before Activation/Design: target identity、handoff fact、retryable /failed、receipt证明上限与capture no-rollback闭合; route: target缺失按formal reject /failed;receipt不等于downstream accepted;不得回滚capture | closed_or_routed | not_run | absent |
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

Boundary artifact contract: G1 handoff / relay / replay / consistency / audit raw与pairing check

Boundary report contract: suite reports、targeted pairing / redaction report

Planned evidence/review reference: handoff / relay / replay raw与suite / pairing / redaction reports

Commit is allowed only when: opening zero-call、complete progress set、`HandoffTargetDeliveryPort` 2 /2、attempt-before-call、same-attempt inspect、derived `HandoffFactStatus`、source unchanged和stored replay通过

Forbidden proof substitution: downstream accepted truth、retry job

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
| planned_commit_title | `feat(handoff): deliver captured materials without rollback` |
| planned_commit_summary | `Deliver captured materials without changing capture truth for CB-SBX-07C.` |
| planned_body_groups | `Handoff contracts and owner truth:`;`Delivery adapter and no-capture-rollback transaction:`;`API entry and stored replay verification:` |
| same_commit_cause | delivery outcome、owner state、stored replay和source unchanged共同闭合handoff |
| planned_footer | `Co-Authored-By: Codex <noreply@openai.com>` |
| staged_files_checked | `not_run` |
| commit_message_checked | `not_run` |
| committed_hash | `not_committed` |
| committed_message | `not_committed` |
| post_commit_status | `not_run` |

## Review Record

| field | planned_or_actual_value |
|---|---|
| required_review_responsibility | handoff / transaction / downstream-seam reviewer核target identity、stored result和no rollback |
| type_and_scope_review | `feat(handoff)`对应delivery事实 |
| body_group_review | truth / adapter / no-rollback entry同组 |
| review_and_evidence_discipline | handoff + transaction + seam |
| design_discipline_record | passed_design |
| future_repeat_check | opening zero-call / target-progress 1:1 / same-attempt identity / derived aggregate / source unchanged |
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

Expected successor after a real Handoff Gate pass: `CB-SBX-08A`. The project ledger alone activates that successor.

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
