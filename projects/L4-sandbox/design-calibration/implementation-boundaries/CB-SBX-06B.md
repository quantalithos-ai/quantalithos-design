# CB-SBX-06B implementation ledger

> Created by L4-sandbox Step 13 from reviewed Step 6~11 matrices.
> This is a planned recovery contract, not proof of implementation, test execution, evidence, review, acceptance, or authorization.

| field | value |
|---|---|
| project | `L4-sandbox` |
| boundary_id | `CB-SBX-06B` |
| phase | `PH-06` |
| verifiable_goal | 打通EvaluatePolicyExecution并证明非允许路径0 launch。 |
| direct_predecessor | `CB-SBX-06A` |
| design_baseline | `not_fixed` |
| implementation_repo | `/home/aris/Projects/quantalithos-sandbox (absent)` |
| status | `planned` |
| next_allowed_action | `wait_until_current` |
| current_identity | no; wait for project-ledger activation |
| task_ids | `IMPL-SBX-06-03`; `IMPL-SBX-06-04` |
| batch_ids | `BATCH-SBX-06B-01`; `BATCH-SBX-06B-02`; `BATCH-SBX-06B-03` |
| evidence_maturity | G1;current config重建、latest scan、旧Accepted复用、entry bypass或任何backend launch依赖即不提交 |
| implementation_started | `no` |

## Required Reads

| document | required_section | status | notes |
|---|---|---|---|
| projects/L4-sandbox/07-实施计划.md | §1, §3, §5~§12 and this exact boundary row in §6 | not_run | Formal implementation authority and control rules. |
| projects/L4-sandbox/03-详细设计.md | §8.2 / §8.5 policy flow / §10 / §12 / §14 | not_run | Exact owner reading copied from Step 6 section 7.4. |
| projects/L4-sandbox/05-测试方案.md | policy targeted | not_run | Exact owner reading copied from Step 6 section 7.4. |
| projects/L4-sandbox/06-验收标准.md | AC-SBX-012~015 | not_run | Exact owner reading copied from Step 6 section 7.4. |
| projects/L4-sandbox/design-calibration/03_ddd_step_07_trait_port_adapter_contracts.md | `03_ddd_step_07_trait_port_adapter_contracts.md` | not_run | Exact calibration or standard reference copied from Step 6 section 7.4. |
| projects/L4-sandbox/design-calibration/03_ddd_step_09_function_flows.md | `03_ddd_step_09_function_flows.md` | not_run | Exact calibration or standard reference copied from Step 6 section 7.4. |
| projects/L4-sandbox/design-calibration/03_ddd_step_11_persistence_transaction_consistency.md | `03_ddd_step_11_persistence_transaction_consistency.md` | not_run | Exact calibration or standard reference copied from Step 6 section 7.4. |
| projects/L4-sandbox/design-calibration/03_ddd_step_13_concurrency_idempotency.md | `03_ddd_step_13_concurrency_idempotency.md` | not_run | Exact calibration or standard reference copied from Step 6 section 7.4. |
| projects/L4-sandbox/design-calibration/06_acceptance_step_05_function_gate.md | `06_acceptance_step_05_function_gate.md` | not_run | Exact calibration or standard reference copied from Step 6 section 7.4. |
| projects/L4-sandbox/design-calibration/07_implementation_plan_step_06_tasks_commit_boundaries.md | §7.1, §7.2, §7.4~§7.8, §7.11; CB-SBX-06B | not_run | Goal, predecessor, closure profiles, scope, tasks, batches, checks, and skeleton schema. |
| projects/L4-sandbox/design-calibration/07_implementation_plan_step_07_test_acceptance_gates.md | §6 and §8; CB-SBX-06B | not_run | Exact suite, AC, VETO, artifact, report, maturity, and review gate. |
| projects/L4-sandbox/design-calibration/07_implementation_plan_step_08_boundary_readiness_matrix.md | CB-SBX-06B readiness row | not_run | Config, environment, adapter, external dependency, and unavailable disposition. |
| projects/L4-sandbox/design-calibration/07_implementation_plan_step_09_boundary_risk_matrix.md | CB-SBX-06B risk row | not_run | Full Spike, Risk, OQ, closure, and safe routing. |
| projects/L4-sandbox/design-calibration/07_implementation_plan_step_10_boundary_control_matrix.md | CB-SBX-06B control row | not_run | Pause, rollback, invalidation, and recovery routing. |
| projects/L4-sandbox/design-calibration/07_implementation_plan_step_11_boundary_commit_message_matrix.md | CB-SBX-06B planned message and commit timing rows | not_run | Exact title, summary, body groups, evidence references, and commit prohibition. |
| projects/L4-sandbox/design-calibration/07_implementation_plan_step_11_review_delivery_audit.md | CB-SBX-06B review and delivery rows | not_run | Independent review, worktree protection, delivery, and handoff discipline. |
| standards/document/代码实施台账与门禁规范.md | project ledger, boundary ledger, nine Gate types, blockers, Commit Gate, and Handoff Gate | not_run | State values and recovery contract. |
| standards/document/设计真相源闭环与可落码性标准.md | boundary codeability and design writeback rules | not_run | Implementation must not invent missing design truth. |
| standards/document/全局项目依赖关系与裁剪规则.md | L4 Sandbox dependency direction and sibling-repository trimming | not_run | Only the allowed core dependency may be compile-time; adjacent products remain ports, events, handoffs, or fakes. |
| standards/document/子项目目录与代码文件组织规范.md | workspace, crate, binary, scripts, artifacts, reports, and implementation-ledger layout | not_run | Directory and code-file organization authority. |
| standards/coding/rust.md | applicable Rust source, tests, formatting, lint, and naming rules | not_run | Target-repository rules may add stricter requirements after repository creation. |

## Allowed Scope

| type | path_or_rule | status |
|---|---|---|
| allowed_path_or_rule | `crates/application/src/{commands,services,ports,repositories}.rs` | planned |
| allowed_path_or_rule | `crates/infra/src/{policy_adapters,truth_repositories,fakes}.rs` | planned |
| allowed_path_or_rule | `crates/api/src/command_handlers.rs` | planned |
| allowed_path_or_rule | `tests/{service,integration}/**` | planned |
| included_behavior | `DEL-SBX-CODE-004`;`DEL-SBX-CODE-005`;`DEL-SBX-CODE-006`;`DEL-SBX-CODE-009`;`DEL-SBX-CODE-011`;`DEL-SBX-CODE-012`;`DEL-SBX-ADP-001`;Command 3按typed requirement ref读取前序事实,summary port一次返回body-free policy / authorization / high-risk snapshot,再原子保存snapshot / decision / audit / relay / replay并映射API | planned |
| boundary_goal | 打通EvaluatePolicyExecution并证明非允许路径0 launch。 | planned |

## Forbidden Scope

| rule | status | failure_action |
|---|---|---|
| backend launch / run / capture;caller推断allow;config allowlist;real unauthorized probe | active | block_scope_gate; remove the change or reopen design |
| backend launch / run / capture;local allowlist;real unauthorized probe | active | block_scope_gate; do not stage or commit |
| Do not implement tools semantic execution, runtime agent-loop orchestration, or member lifecycle orchestration inside Sandbox. | active | block_scope_gate; return the concern to its owning project |
| Do not use latest paths, static evidence aliases, prefilled Passed or acceptance decisions, raw secret or process bodies, or unrelated user changes. | active | block_evidence_or_worktree_gate; preserve safe failure material |

## Tasks And Batches

### Tasks

| task_id | order | implementation_action | input | completion_criterion |
|---|---|---|---|---|
| `IMPL-SBX-06-03` | 3 | 编写typed requirement read、policy summary port / fake和Command 3 UoW | policy flow | 只读前序requirement;snapshot / decision / audit / relay / replay原子 |
| `IMPL-SBX-06-04` | 4 | 编写API映射和non-Allowed guard-result contract tests | `TC-SBX-CMD-005`;`TC-SBX-CMD-006` | blocked / fail-closed产生durable non-Allowed decision;backend调用不属于本boundary;`TC-SBX-CMD-008`留07A |

### Batches

| batch_id | goal | input_to_output | expected_size | post_batch_check | commit_relation |
|---|---|---|---|---|---|
| `BATCH-SBX-06B-01` | policy seam | typed requirement read + one-shot body-free snapshot port -> fake / repository | 150~250 | context mismatch / availability / stale outcome | one commit after every batch passes |
| `BATCH-SBX-06B-02` | policy transaction | shared UoW -> snapshot / high-risk / decision / side effects / stored replay | 200~300 | duplicate / rollback / no current-config rebuild | one commit after every batch passes |
| `BATCH-SBX-06B-03` | policy entry | service -> API / durable non-Allowed tests | 150~250 | `TC-SBX-CMD-005`;`TC-SBX-CMD-006`;no backend dependency | one commit after every batch passes |

Subfunction grouping: typed requirement read + policy snapshot / decision UoW + entry

Same-commit cause: 只有同一纵切才能证明policy仅消费前序requirement并持久化durable Accepted / non-Allowed truth;backend调用严格后置

Verification closure: CMD / duplicate / context mismatch / no backend dependency

Explicitly excluded: run / local allowlist

## Activation Readiness

| dimension | planned_requirement | actual_status |
|---|---|---|
| config_and_source | I031~I034 + exact prior requirement ref;current config不可重建old decision | not_run |
| environment_and_adapter | ENV-02 policy semantic fake;ENV-03 controlled policy seam补强 | not_run |
| external_and_tooling | one-shot policy port、truth /audit /relay /replay stores | not_run |
| unavailable_disposition | unavailable /stale fail-closed;backend launch call=0 | not_run |
| boundary_specific_activation | body-free policy / authorization / high-risk snapshot contract稳定 | not_run |

## Design Closure And Risk

| field | planned_value | actual_status |
|---|---|---|
| closure_profiles | policy port / UoW / entry;BASE+TXN+CONFIG | not_run |
| applicable_experience | exact requirement read;context ownership;one-shot body-free snapshot;idempotency;side effects;stale snapshot;durable non-Allowed | not_run |
| formal_evidence_location | `03`§8 / §10 / §12~§13;`06`AC-012~015 | not_run |
| explicit_non_applicability | Query / job / backend launch不适用:只执行formal Command 3并输出launch guard truth | not_run |
| design_level_conclusion | `passed_design`;不得从current config或latest boundary重建requirement | design_record_only |
| activation_or_design_closure | one-shot policy port、exact prior requirement、stored result /audit /relay /replay与backend call budget=0闭合 | not_run |
| safe_route_if_open_or_triggered | missing /stale /conflict /unsupported保持formal reject;不得复用old decision或launch | not_run |

| reference_type | full_references | execution_status |
|---|---|---|
| spike | `SP-SBX-IMP-006`; `SP-SBX-IMP-007` | not_run |
| risk | `R-SBX-IMP-003`; `R-SBX-IMP-005`; `R-SBX-IMP-007`; `R-SBX-IMP-008`; `R-SBX-IMP-011`; `R-SBX-IMP-019`; `R-SBX-IMP-020` | not_run |
| open_question | none_by_boundary_matrix | not_run |

## Required Checks

| check_id | command_or_assertion | required_status | actual_status | evidence |
|---|---|---|---|---|
| CHK-ACTIVATION | Close predecessor CB-SBX-06A; body-free policy / authorization / high-risk snapshot contract稳定 | closed_or_formal_blocked | not_run | absent |
| CHK-DESIGN | policy port / UoW / entry;BASE+TXN+CONFIG; closure evidence: `03`§8 / §10 / §12~§13;`06`AC-012~015; repeat-check rule: `passed_design`;不得从current config或latest boundary重建requirement | design_consistent | not_run | absent |
| CHK-SCOPE | Allowed: `crates/application/src/{commands,services,ports,repositories}.rs`;`crates/infra/src/{policy_adapters,truth_repositories,fakes}.rs`;`crates/api/src/command_handlers.rs`;`tests/{service,integration}/**`; included behavior: `DEL-SBX-CODE-004`;`DEL-SBX-CODE-005`;`DEL-SBX-CODE-006`;`DEL-SBX-CODE-009`;`DEL-SBX-CODE-011`;`DEL-SBX-CODE-012`;`DEL-SBX-ADP-001`;Command 3按typed requirement ref读取前序事实,summary port一次返回body-free policy / authorization / high-risk snapshot,再原子保存snapshot / decision / audit / relay / replay并映射API; forbidden: backend launch / run / capture;caller推断allow;config allowlist;real unauthorized probe; backend launch / run / capture;local allowlist;real unauthorized probe | scope_clean | not_run | absent |
| CHK-WORKTREE | Record target root, HEAD, initial git status, local identity, user-owned changes, and staged-file ownership. | worktree_recorded | not_run | absent |
| CHK-BUILD | accepted / rejected / fail-closed / blocked / duplicate;requirement-context mismatch、stale snapshot、current config重建均拒绝;本boundary不调用backend launch | pass_or_formal_allowed_status | not_run | absent |
| CHK-TEST | SUITE-SBX-004 /010主slice +002 /007 /009补强:CMD-005/006/008及policy适用TXN / RACE / ERR;non-Allowed launch call=0、exact requirement、stale / duplicate | all_mandatory_pass | not_run | absent |
| CHK-AC-VETO | AC-SBX-012~015 /028 /032~041;VETO-SBX-001 /004~006 /010 /012 /013 /016 | assertions_present_and_no_triggered_veto | not_run | absent |
| CHK-ARTIFACT | G1 policy / replay / consistency / error / audit raw与blocked / redaction checks | maturity_contract_satisfied | not_run | absent |
| CHK-REPORT | suite reports、targeted redaction / status-fidelity / report-audit | paired_report_or_G0_reason | not_run | absent |
| CHK-EVIDENCE-MATURITY | G1;current config重建、latest scan、旧Accepted复用、entry bypass或任何backend launch依赖即不提交 | status_fidelity_and_safe_failure | not_run | absent |
| CHK-READINESS | Config/source: I031~I034 + exact prior requirement ref;current config不可重建old decision; ENV/adapter: ENV-02 policy semantic fake;ENV-03 controlled policy seam补强; external/tool: one-shot policy port、truth /audit /relay /replay stores; unavailable route: unavailable /stale fail-closed;backend launch call=0 | ready_or_formally_blocked | not_run | absent |
| CHK-RISK | Close or confirm before Activation/Design: one-shot policy port、exact prior requirement、stored result /audit /relay /replay与backend call budget=0闭合; route: missing /stale /conflict /unsupported保持formal reject;不得复用old decision或launch | closed_or_routed | not_run | absent |
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

Boundary artifact contract: G1 policy / replay / consistency / error / audit raw与blocked / redaction checks

Boundary report contract: suite reports、targeted redaction / status-fidelity / report-audit

Planned evidence/review reference: policy / replay / consistency reports及redaction / status fidelity / report audit

Commit is allowed only when: exact requirement、one-shot snapshot、duplicate、UoW及所有non-allow backend call=0通过

Forbidden proof substitution: run、旧Accepted复用

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
| planned_commit_title | `feat(policy): evaluate policy without unauthorized launch` |
| planned_commit_summary | `Evaluate policy without introducing any backend launch path for CB-SBX-06B.` |
| planned_body_groups | `Requirement and policy snapshot reads:`;`Policy decision transaction and zero-launch entry:` |
| same_commit_cause | exact prior requirement、one-shot snapshot、decision UoW和entry共同证明backend call为0 |
| planned_footer | `Co-Authored-By: Codex <noreply@openai.com>` |
| staged_files_checked | `not_run` |
| commit_message_checked | `not_run` |
| committed_hash | `not_committed` |
| committed_message | `not_committed` |
| post_commit_status | `not_run` |

## Review Record

| field | planned_or_actual_value |
|---|---|
| required_review_responsibility | application / policy integration / transaction reviewer核one-shot snapshot、UoW与0 launch |
| type_and_scope_review | `feat(policy)`对应evaluation纵切 |
| body_group_review | exact read与decision UoW / zero-launch entry同组 |
| review_and_evidence_discipline | application + policy + transaction |
| design_discipline_record | passed_design |
| future_repeat_check | backend call=0 trace |
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

Expected successor after a real Handoff Gate pass: `CB-SBX-07A`. The project ledger alone activates that successor.

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
