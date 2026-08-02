# CB-SBX-06A implementation ledger

> Created by L4-sandbox Step 13 from reviewed Step 6~11 matrices.
> This is a planned recovery contract, not proof of implementation, test execution, evidence, review, acceptance, or authorization.

| field | value |
|---|---|
| project | `L4-sandbox` |
| boundary_id | `CB-SBX-06A` |
| phase | `PH-06` |
| verifiable_goal | 固定policy / authorization / high-risk fail-closed truth。 |
| direct_predecessor | `CB-SBX-05B` |
| design_baseline | `not_fixed` |
| implementation_repo | `/home/aris/Projects/quantalithos-sandbox (absent)` |
| status | `planned` |
| next_allowed_action | `wait_until_current` |
| current_identity | no; wait for project-ledger activation |
| task_ids | `IMPL-SBX-06-01`; `IMPL-SBX-06-02` |
| batch_ids | `BATCH-SBX-06A-01`; `BATCH-SBX-06A-02` |
| evidence_maturity | G1;policy body、local allow、unknown->Accepted、unsafe error或状态不闭合即不提交 |
| implementation_started | `no` |

## Required Reads

| document | required_section | status | notes |
|---|---|---|---|
| projects/L4-sandbox/07-实施计划.md | §1, §3, §5~§12 and this exact boundary row in §6 | not_run | Formal implementation authority and control rules. |
| projects/L4-sandbox/03-详细设计.md | §6 policy / §7.3 Command 3 / §9 policy states / §11 | not_run | Exact owner reading copied from Step 6 section 7.4. |
| projects/L4-sandbox/05-测试方案.md | `TC-SBX-CMD-005`,`TC-SBX-CMD-006`,`TC-SBX-STA-010`,`TC-SBX-STA-011`,`TC-SBX-STA-012`,`TC-SBX-ERR-005` | not_run | Exact owner reading copied from Step 6 section 7.4. |
| projects/L4-sandbox/06-验收标准.md | PG-SBX-003 | not_run | Exact owner reading copied from Step 6 section 7.4. |
| projects/L4-sandbox/design-calibration/03_ddd_step_06_object_contracts.md | `03_ddd_step_06_object_contracts.md` | not_run | Exact calibration or standard reference copied from Step 6 section 7.4. |
| projects/L4-sandbox/design-calibration/03_ddd_step_10_state_matrix.md | `03_ddd_step_10_state_matrix.md` | not_run | Exact calibration or standard reference copied from Step 6 section 7.4. |
| projects/L4-sandbox/design-calibration/04_config_step_11_failure_degradation.md | `04_config_step_11_failure_degradation.md` | not_run | Exact calibration or standard reference copied from Step 6 section 7.4. |
| projects/L4-sandbox/design-calibration/07_implementation_plan_step_06_tasks_commit_boundaries.md | §7.1, §7.2, §7.4~§7.8, §7.11; CB-SBX-06A | not_run | Goal, predecessor, closure profiles, scope, tasks, batches, checks, and skeleton schema. |
| projects/L4-sandbox/design-calibration/07_implementation_plan_step_07_test_acceptance_gates.md | §6 and §8; CB-SBX-06A | not_run | Exact suite, AC, VETO, artifact, report, maturity, and review gate. |
| projects/L4-sandbox/design-calibration/07_implementation_plan_step_08_boundary_readiness_matrix.md | CB-SBX-06A readiness row | not_run | Config, environment, adapter, external dependency, and unavailable disposition. |
| projects/L4-sandbox/design-calibration/07_implementation_plan_step_09_boundary_risk_matrix.md | CB-SBX-06A risk row | not_run | Full Spike, Risk, OQ, closure, and safe routing. |
| projects/L4-sandbox/design-calibration/07_implementation_plan_step_10_boundary_control_matrix.md | CB-SBX-06A control row | not_run | Pause, rollback, invalidation, and recovery routing. |
| projects/L4-sandbox/design-calibration/07_implementation_plan_step_11_boundary_commit_message_matrix.md | CB-SBX-06A planned message and commit timing rows | not_run | Exact title, summary, body groups, evidence references, and commit prohibition. |
| projects/L4-sandbox/design-calibration/07_implementation_plan_step_11_review_delivery_audit.md | CB-SBX-06A review and delivery rows | not_run | Independent review, worktree protection, delivery, and handoff discipline. |
| standards/document/代码实施台账与门禁规范.md | project ledger, boundary ledger, nine Gate types, blockers, Commit Gate, and Handoff Gate | not_run | State values and recovery contract. |
| standards/document/设计真相源闭环与可落码性标准.md | boundary codeability and design writeback rules | not_run | Implementation must not invent missing design truth. |
| standards/document/全局项目依赖关系与裁剪规则.md | L4 Sandbox dependency direction and sibling-repository trimming | not_run | Only the allowed core dependency may be compile-time; adjacent products remain ports, events, handoffs, or fakes. |
| standards/document/子项目目录与代码文件组织规范.md | workspace, crate, binary, scripts, artifacts, reports, and implementation-ledger layout | not_run | Directory and code-file organization authority. |
| standards/coding/rust.md | applicable Rust source, tests, formatting, lint, and naming rules | not_run | Target-repository rules may add stricter requirements after repository creation. |

## Allowed Scope

| type | path_or_rule | status |
|---|---|---|
| allowed_path_or_rule | `crates/contracts/src/{commands,events,views,errors}.rs` | planned |
| allowed_path_or_rule | `crates/domain/src/{policy,audit,relay,errors}.rs` | planned |
| allowed_path_or_rule | `tests/{contracts,domain}/**` | planned |
| included_behavior | `DEL-SBX-CODE-002`;`DEL-SBX-CODE-003`;`DEL-SBX-CODE-009`;`DEL-SBX-CODE-010`;`DEL-SBX-CODE-012`增量;`EvaluatePolicyExecution` carrier、`SandboxPolicyDecisionChanged` payload、applicability / decision / high-risk truth与STA-010~012 | planned |
| boundary_goal | 固定policy / authorization / high-risk fail-closed truth。 | planned |

## Forbidden Scope

| rule | status | failure_action |
|---|---|---|
| policy DSL / body;application side effect;backend launch | active | block_scope_gate; remove the change or reopen design |
| policy body / DSL、port调用、launch | active | block_scope_gate; do not stage or commit |
| Do not implement tools semantic execution, runtime agent-loop orchestration, or member lifecycle orchestration inside Sandbox. | active | block_scope_gate; return the concern to its owning project |
| Do not use latest paths, static evidence aliases, prefilled Passed or acceptance decisions, raw secret or process bodies, or unrelated user changes. | active | block_evidence_or_worktree_gate; preserve safe failure material |

## Tasks And Batches

### Tasks

| task_id | order | implementation_action | input | completion_criterion |
|---|---|---|---|---|
| `IMPL-SBX-06-01` | 1 | 编写Command 3、policy event、applicability / decision / high-risk carrier | `EvaluatePolicyExecution`;PG-SBX-003 | body-free source map完整 |
| `IMPL-SBX-06-02` | 2 | 编写STA-010 /011 /012、fail-closed guards和ERR-005 | policy matrix | 非Applicable不可Accepted |

### Batches

| batch_id | goal | input_to_output | expected_size | post_batch_check | commit_relation |
|---|---|---|---|---|---|
| `BATCH-SBX-06A-01` | policy contracts | formal summaries -> DTO / payload | 150~250 | roundtrip / no policy body | one commit after every batch passes |
| `BATCH-SBX-06A-02` | fail-closed state | state matrix -> policy / high-risk truth / errors | 200~300 | missing / stale / conflict / terminal | one commit after every batch passes |

Subfunction grouping: policy carrier + applicability / decision / high-risk truth

Same-commit cause: fail-closed语义由DTO source map和owner states共同定义

Verification closure: CMD schema / STA / ERR

Explicitly excluded: summary port / launch

## Activation Readiness

| dimension | planned_requirement | actual_status |
|---|---|---|
| config_and_source | I031~I034 strict high-risk /freshness语义;无port调用 | not_run |
| environment_and_adapter | ENV-02 contract /domain fixture | not_run |
| external_and_tooling | policy /authorization body-free carrier和fail-closed matrix | not_run |
| unavailable_disposition | missing /stale /conflict /unsupported不得Accepted | not_run |
| boundary_specific_activation | immutable requirement ref可读;无Boundary反向Policy依赖 | not_run |

## Design Closure And Risk

| field | planned_value | actual_status |
|---|---|---|
| closure_profiles | policy contract / state;BASE+CONTRACT+STATE | not_run |
| applicable_experience | summary typed read;applicability / high-risk markers;factory / state;public target;body-free policy refs | not_run |
| formal_evidence_location | `03`§6 / §7.3 / §9 / §11;`05`CMD / STA;`06`PG-003 | not_run |
| explicit_non_applicability | backend launch / UoW不适用:只定义policy truth | not_run |
| design_level_conclusion | `passed_design`;不得保存DSL /正文 | design_record_only |
| activation_or_design_closure | policy /authorization body-free carrier、freshness /conflict /unsupported与high-risk fail-closed matrix闭合 | not_run |
| safe_route_if_open_or_triggered | 任一source /state不唯一`wait_design`;不得local allow、正文入仓或Accepted default | not_run |

| reference_type | full_references | execution_status |
|---|---|---|
| spike | `SP-SBX-IMP-006` | not_run |
| risk | `R-SBX-IMP-003`; `R-SBX-IMP-007`; `R-SBX-IMP-008`; `R-SBX-IMP-019`; `R-SBX-IMP-020` | not_run |
| open_question | none_by_boundary_matrix | not_run |

## Required Checks

| check_id | command_or_assertion | required_status | actual_status | evidence |
|---|---|---|---|---|
| CHK-ACTIVATION | Close predecessor CB-SBX-05B; immutable requirement ref可读;无Boundary反向Policy依赖 | closed_or_formal_blocked | not_run | absent |
| CHK-DESIGN | policy contract / state;BASE+CONTRACT+STATE; closure evidence: `03`§6 / §7.3 / §9 / §11;`05`CMD / STA;`06`PG-003; repeat-check rule: `passed_design`;不得保存DSL /正文 | design_consistent | not_run | absent |
| CHK-SCOPE | Allowed: `crates/contracts/src/{commands,events,views,errors}.rs`;`crates/domain/src/{policy,audit,relay,errors}.rs`;`tests/{contracts,domain}/**`; included behavior: `DEL-SBX-CODE-002`;`DEL-SBX-CODE-003`;`DEL-SBX-CODE-009`;`DEL-SBX-CODE-010`;`DEL-SBX-CODE-012`增量;`EvaluatePolicyExecution` carrier、`SandboxPolicyDecisionChanged` payload、applicability / decision / high-risk truth与STA-010~012; forbidden: policy DSL / body;application side effect;backend launch; policy body / DSL、port调用、launch | scope_clean | not_run | absent |
| CHK-WORKTREE | Record target root, HEAD, initial git status, local identity, user-owned changes, and staged-file ownership. | worktree_recorded | not_run | absent |
| CHK-BUILD | `TC-SBX-CMD-005`;`TC-SBX-CMD-006`;`TC-SBX-STA-010`;`TC-SBX-STA-011`;`TC-SBX-STA-012`;`TC-SBX-ERR-005`;missing / stale / conflict / unsupported均不Accepted的domain tests完成后 | pass_or_formal_allowed_status | not_run | absent |
| CHK-TEST | SUITE-SBX-002 /004 /010 contract-domain slice:CMD-005/006、STA-010~012、ERR-005;missing / stale / conflict / unsupported均非Accepted | all_mandatory_pass | not_run | absent |
| CHK-AC-VETO | AC-SBX-012~015 /028 /032~035 /037~041;VETO-SBX-001 /004~006 /010 /016 | assertions_present_and_no_triggered_veto | not_run | absent |
| CHK-ARTIFACT | G1 policy state / protocol / typed-error / safe-audit raw | maturity_contract_satisfied | not_run | absent |
| CHK-REPORT | suite reports与targeted redaction report | paired_report_or_G0_reason | not_run | absent |
| CHK-EVIDENCE-MATURITY | G1;policy body、local allow、unknown->Accepted、unsafe error或状态不闭合即不提交 | status_fidelity_and_safe_failure | not_run | absent |
| CHK-READINESS | Config/source: I031~I034 strict high-risk /freshness语义;无port调用; ENV/adapter: ENV-02 contract /domain fixture; external/tool: policy /authorization body-free carrier和fail-closed matrix; unavailable route: missing /stale /conflict /unsupported不得Accepted | ready_or_formally_blocked | not_run | absent |
| CHK-RISK | Close or confirm before Activation/Design: policy /authorization body-free carrier、freshness /conflict /unsupported与high-risk fail-closed matrix闭合; route: 任一source /state不唯一`wait_design`;不得local allow、正文入仓或Accepted default | closed_or_routed | not_run | absent |
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

Boundary artifact contract: G1 policy state / protocol / typed-error / safe-audit raw

Boundary report contract: suite reports与targeted redaction report

Planned evidence/review reference: policy state / protocol / error reports与redaction report

Commit is allowed only when: body-free carrier、missing / stale / conflict / unsupported均非Accepted且state闭合

Forbidden proof substitution: local allowlist、backend launch

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
| planned_commit_title | `feat(policy): add fail-closed policy decision contracts` |
| planned_commit_summary | `Add body-free fail-closed policy truth for CB-SBX-06A.` |
| planned_body_groups | `Policy and authorization carriers:`;`Applicability, decision, and high-risk truth:` |
| same_commit_cause | source map、applicability、decision和high-risk state共同定义non-allow语义 |
| planned_footer | `Co-Authored-By: Codex <noreply@openai.com>` |
| staged_files_checked | `not_run` |
| commit_message_checked | `not_run` |
| committed_hash | `not_committed` |
| committed_message | `not_committed` |
| post_commit_status | `not_run` |

## Review Record

| field | planned_or_actual_value |
|---|---|
| required_review_responsibility | policy contract / domain / security reviewer核body-free source map与fail-closed state |
| type_and_scope_review | `feat(policy)`对应fail-closed truth |
| body_group_review | carrier与decision / high-risk state共同定义non-allow |
| review_and_evidence_discipline | policy + domain + security |
| design_discipline_record | passed_design |
| future_repeat_check | body-free与all non-allow states |
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

Expected successor after a real Handoff Gate pass: `CB-SBX-06B`. The project ledger alone activates that successor.

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
