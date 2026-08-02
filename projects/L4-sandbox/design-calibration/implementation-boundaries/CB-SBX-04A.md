# CB-SBX-04A implementation ledger

> Created by L4-sandbox Step 13 from reviewed Step 6~11 matrices.
> This is a planned recovery contract, not proof of implementation, test execution, evidence, review, acceptance, or authorization.

| field | value |
|---|---|
| project | `L4-sandbox` |
| boundary_id | `CB-SBX-04A` |
| phase | `PH-04` |
| verifiable_goal | 固定受理与execution identity的contract / domain闭环。 |
| direct_predecessor | `CB-SBX-03B` |
| design_baseline | `not_fixed` |
| implementation_repo | `/home/aris/Projects/quantalithos-sandbox (absent)` |
| status | `planned` |
| next_allowed_action | `wait_until_current` |
| current_identity | no; wait for project-ledger activation |
| task_ids | `IMPL-SBX-04-01`; `IMPL-SBX-04-02` |
| batch_ids | `BATCH-SBX-04A-01`; `BATCH-SBX-04A-02` |
| evidence_maturity | G1;anonymous / unresolved变Accepted、wrong ref、正文进入carrier或状态不闭合即不提交 |
| implementation_started | `no` |

## Required Reads

| document | required_section | status | notes |
|---|---|---|---|
| projects/L4-sandbox/07-实施计划.md | §1, §3, §5~§12 and this exact boundary row in §6 | not_run | Formal implementation authority and control rules. |
| projects/L4-sandbox/03-详细设计.md | §6 / §7.2~§7.3 / §8.2 / §9 intake / §11 | not_run | Exact owner reading copied from Step 6 section 7.4. |
| projects/L4-sandbox/05-测试方案.md | CMD-001/002,STA-001~003,ERR-014/015 | not_run | Exact owner reading copied from Step 6 section 7.4. |
| projects/L4-sandbox/06-验收标准.md | PG-SBX-001 | not_run | Exact owner reading copied from Step 6 section 7.4. |
| projects/L4-sandbox/design-calibration/03_ddd_step_06_object_contracts.md | `03_ddd_step_06_object_contracts.md` | not_run | Exact calibration or standard reference copied from Step 6 section 7.4. |
| projects/L4-sandbox/design-calibration/03_ddd_step_10_state_matrix.md | `03_ddd_step_10_state_matrix.md` | not_run | Exact calibration or standard reference copied from Step 6 section 7.4. |
| projects/L4-sandbox/design-calibration/06_acceptance_step_05_function_gate.md | `06_acceptance_step_05_function_gate.md` | not_run | Exact calibration or standard reference copied from Step 6 section 7.4. |
| projects/L4-sandbox/design-calibration/07_implementation_plan_step_06_tasks_commit_boundaries.md | §7.1, §7.2, §7.4~§7.8, §7.11; CB-SBX-04A | not_run | Goal, predecessor, closure profiles, scope, tasks, batches, checks, and skeleton schema. |
| projects/L4-sandbox/design-calibration/07_implementation_plan_step_07_test_acceptance_gates.md | §6 and §8; CB-SBX-04A | not_run | Exact suite, AC, VETO, artifact, report, maturity, and review gate. |
| projects/L4-sandbox/design-calibration/07_implementation_plan_step_08_boundary_readiness_matrix.md | CB-SBX-04A readiness row | not_run | Config, environment, adapter, external dependency, and unavailable disposition. |
| projects/L4-sandbox/design-calibration/07_implementation_plan_step_09_boundary_risk_matrix.md | CB-SBX-04A risk row | not_run | Full Spike, Risk, OQ, closure, and safe routing. |
| projects/L4-sandbox/design-calibration/07_implementation_plan_step_10_boundary_control_matrix.md | CB-SBX-04A control row | not_run | Pause, rollback, invalidation, and recovery routing. |
| projects/L4-sandbox/design-calibration/07_implementation_plan_step_11_boundary_commit_message_matrix.md | CB-SBX-04A planned message and commit timing rows | not_run | Exact title, summary, body groups, evidence references, and commit prohibition. |
| projects/L4-sandbox/design-calibration/07_implementation_plan_step_11_review_delivery_audit.md | CB-SBX-04A review and delivery rows | not_run | Independent review, worktree protection, delivery, and handoff discipline. |
| standards/document/代码实施台账与门禁规范.md | project ledger, boundary ledger, nine Gate types, blockers, Commit Gate, and Handoff Gate | not_run | State values and recovery contract. |
| standards/document/设计真相源闭环与可落码性标准.md | boundary codeability and design writeback rules | not_run | Implementation must not invent missing design truth. |
| standards/document/全局项目依赖关系与裁剪规则.md | L4 Sandbox dependency direction and sibling-repository trimming | not_run | Only the allowed core dependency may be compile-time; adjacent products remain ports, events, handoffs, or fakes. |
| standards/document/子项目目录与代码文件组织规范.md | workspace, crate, binary, scripts, artifacts, reports, and implementation-ledger layout | not_run | Directory and code-file organization authority. |
| standards/coding/rust.md | applicable Rust source, tests, formatting, lint, and naming rules | not_run | Target-repository rules may add stricter requirements after repository creation. |

## Allowed Scope

| type | path_or_rule | status |
|---|---|---|
| allowed_path_or_rule | `crates/contracts/src/{commands,events,views}.rs` | planned |
| allowed_path_or_rule | `crates/domain/src/{context,identity,reference,audit,relay,errors}.rs` | planned |
| allowed_path_or_rule | `tests/{contracts,domain}/**` | planned |
| included_behavior | `DEL-SBX-CODE-002`;`DEL-SBX-CODE-003`;`DEL-SBX-CODE-009`;`DEL-SBX-CODE-010`;`DEL-SBX-CODE-012`增量;`OpenControlledExecutionContext` request/result、`SandboxExecutionContextChanged` payload、intake / identity / reference truth与STA-001~003 | planned |
| boundary_goal | 固定受理与execution identity的contract / domain闭环。 | planned |

## Forbidden Scope

| rule | status | failure_action |
|---|---|---|
| application transaction、API handler、boundary / policy / run状态 | active | block_scope_gate; remove the change or reopen design |
| resolver call、UoW、API、boundary / policy / run | active | block_scope_gate; do not stage or commit |
| Do not implement tools semantic execution, runtime agent-loop orchestration, or member lifecycle orchestration inside Sandbox. | active | block_scope_gate; return the concern to its owning project |
| Do not use latest paths, static evidence aliases, prefilled Passed or acceptance decisions, raw secret or process bodies, or unrelated user changes. | active | block_evidence_or_worktree_gate; preserve safe failure material |

## Tasks And Batches

### Tasks

| task_id | order | implementation_action | input | completion_criterion |
|---|---|---|---|---|
| `IMPL-SBX-04-01` | 1 | 编写Command 1 request / result、context event payload和source map | `OpenControlledExecutionContext`;PG-SBX-001 | DTO exact构造和event body-free |
| `IMPL-SBX-04-02` | 2 | 编写context / identity / resolution / reference factory与STA-001 /002 /003 | `03`§6 / §9 | invariant和illegal / terminal可测 |

### Batches

| batch_id | goal | input_to_output | expected_size | post_batch_check | commit_relation |
|---|---|---|---|---|---|
| `BATCH-SBX-04A-01` | intake contracts | formal protocol -> command / result / payload | 200~300 | contract roundtrip / source map | one commit after every batch passes |
| `BATCH-SBX-04A-02` | intake truth / state | object contract -> factories / guards / errors | 200~300 | STA-001 /002 /003;ERR-014 /015 | one commit after every batch passes |

Subfunction grouping: intake protocol + context / identity / reference truth

Same-commit cause: Command 1构造目标与状态必须在同一contract-domain增量闭口

Verification closure: CMD schema / STA / ERR

Explicitly excluded: transaction / entry

## Activation Readiness

| dimension | planned_requirement | actual_status |
|---|---|---|
| config_and_source | consume complete generation carrier contract;无adapter call | not_run |
| environment_and_adapter | ENV-02 contract /domain fixture | not_run |
| external_and_tooling | core refs、config identity /generation refs可构造 | not_run |
| unavailable_disposition | missing carrier回03B;不得为resolver补外部正文 | not_run |
| boundary_specific_activation | complete runtime assembly可供contract owner消费 | not_run |

## Design Closure And Risk

| field | planned_value | actual_status |
|---|---|---|
| closure_profiles | Command / state / event;BASE+CONTRACT+STATE | not_run |
| applicable_experience | DTO construction;factory signature;initial state;accepted subject identity;event payload source;forbidden body | not_run |
| formal_evidence_location | `03`§6~§9 / §11;`05`CMD / STA / ERR;`06`PG-001 | not_run |
| explicit_non_applicability | adapter outcome / UoW不适用:本boundary止于contract-domain | not_run |
| design_level_conclusion | `passed_design`;04B不得反向改schema | design_record_only |
| activation_or_design_closure | execution identity所有字段 /ref /初态 /error owner和body-free边界闭合 | not_run |
| safe_route_if_open_or_triggered | source不唯一`wait_design`;不得匿名、自造context或接收外部正文 | not_run |

| reference_type | full_references | execution_status |
|---|---|---|
| spike | none_by_boundary_matrix | not_run |
| risk | `R-SBX-IMP-003`; `R-SBX-IMP-007`; `R-SBX-IMP-008`; `R-SBX-IMP-019`; `R-SBX-IMP-020` | not_run |
| open_question | none_by_boundary_matrix | not_run |

## Required Checks

| check_id | command_or_assertion | required_status | actual_status | evidence |
|---|---|---|---|---|
| CHK-ACTIVATION | Close predecessor CB-SBX-03B; complete runtime assembly可供contract owner消费 | closed_or_formal_blocked | not_run | absent |
| CHK-DESIGN | Command / state / event;BASE+CONTRACT+STATE; closure evidence: `03`§6~§9 / §11;`05`CMD / STA / ERR;`06`PG-001; repeat-check rule: `passed_design`;04B不得反向改schema | design_consistent | not_run | absent |
| CHK-SCOPE | Allowed: `crates/contracts/src/{commands,events,views}.rs`;`crates/domain/src/{context,identity,reference,audit,relay,errors}.rs`;`tests/{contracts,domain}/**`; included behavior: `DEL-SBX-CODE-002`;`DEL-SBX-CODE-003`;`DEL-SBX-CODE-009`;`DEL-SBX-CODE-010`;`DEL-SBX-CODE-012`增量;`OpenControlledExecutionContext` request/result、`SandboxExecutionContextChanged` payload、intake / identity / reference truth与STA-001~003; forbidden: application transaction、API handler、boundary / policy / run状态; resolver call、UoW、API、boundary / policy / run | scope_clean | not_run | absent |
| CHK-WORKTREE | Record target root, HEAD, initial git status, local identity, user-owned changes, and staged-file ownership. | worktree_recorded | not_run | absent |
| CHK-BUILD | `CMD-001/002`,`STA-001~003`,`ERR-014/015`;contract roundtrip、factory invariant、illegal / terminal / forbidden-body tests完成后 | pass_or_formal_allowed_status | not_run | absent |
| CHK-TEST | SUITE-SBX-002 /004 contract-domain slice:CMD-001/002、STA-001~003、ERR-014/015;constructor / factory / illegal / terminal / forbidden-body | all_mandatory_pass | not_run | absent |
| CHK-AC-VETO | AC-SBX-006~008 /026 /032~035 /037~041;VETO-SBX-001 /002 /005 /006 /010 /016 | assertions_present_and_no_triggered_veto | not_run | absent |
| CHK-ARTIFACT | G1 `suites/SUITE-SBX-002/*`,`SUITE-SBX-004/*`的intake case raw及safe contract artifacts | maturity_contract_satisfied | not_run | absent |
| CHK-REPORT | 对应suite reports与targeted redaction report | paired_report_or_G0_reason | not_run | absent |
| CHK-EVIDENCE-MATURITY | G1;anonymous / unresolved变Accepted、wrong ref、正文进入carrier或状态不闭合即不提交 | status_fidelity_and_safe_failure | not_run | absent |
| CHK-READINESS | Config/source: consume complete generation carrier contract;无adapter call; ENV/adapter: ENV-02 contract /domain fixture; external/tool: core refs、config identity /generation refs可构造; unavailable route: missing carrier回03B;不得为resolver补外部正文 | ready_or_formally_blocked | not_run | absent |
| CHK-RISK | Close or confirm before Activation/Design: execution identity所有字段 /ref /初态 /error owner和body-free边界闭合; route: source不唯一`wait_design`;不得匿名、自造context或接收外部正文 | closed_or_routed | not_run | absent |
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

Boundary artifact contract: G1 `suites/SUITE-SBX-002/*`,`SUITE-SBX-004/*`的intake case raw及safe contract artifacts

Boundary report contract: 对应suite reports与targeted redaction report

Planned evidence/review reference: SUITE-SBX-002 /004 intake contract-domain reports与redaction report

Commit is allowed only when: Command 1 schema、STA / ERR、factory和body-free event payload闭合

Forbidden proof substitution: transaction / API成功事实

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
| planned_commit_title | `feat(intake): add execution context and identity contracts` |
| planned_commit_summary | `Add the intake and execution identity truth contracts for CB-SBX-04A.` |
| planned_body_groups | `Intake command and event contracts:`;`Context, execution identity, reference, and audit truth:` |
| same_commit_cause | Command 1目标、状态、identity和safe relay / audit carrier需在contract-domain增量闭口 |
| planned_footer | `Co-Authored-By: Codex <noreply@openai.com>` |
| staged_files_checked | `not_run` |
| commit_message_checked | `not_run` |
| committed_hash | `not_committed` |
| committed_message | `not_committed` |
| post_commit_status | `not_run` |

## Review Record

| field | planned_or_actual_value |
|---|---|
| required_review_responsibility | contracts / domain / security reviewer核Command 1 source map、factory和event payload |
| type_and_scope_review | `feat(intake)`对应contract-domain |
| body_group_review | protocol与context / identity truth共同闭口 |
| review_and_evidence_discipline | contracts + domain + security |
| design_discipline_record | passed_design |
| future_repeat_check | exact carrier / state tests |
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

Expected successor after a real Handoff Gate pass: `CB-SBX-04B`. The project ledger alone activates that successor.

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
