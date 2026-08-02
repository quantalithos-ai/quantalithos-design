# CB-SBX-05B implementation ledger

> Created by L4-sandbox Step 13 from reviewed Step 6~11 matrices.
> This is a planned recovery contract, not proof of implementation, test execution, evidence, review, acceptance, or authorization.

| field | value |
|---|---|
| project | `L4-sandbox` |
| boundary_id | `CB-SBX-05B` |
| phase | `PH-05` |
| verifiable_goal | 打通EstablishExecutionBoundary事务纵切且拒绝weak fallback。 |
| direct_predecessor | `CB-SBX-05A` |
| design_baseline | `not_fixed` |
| implementation_repo | `/home/aris/Projects/quantalithos-sandbox (absent)` |
| status | `planned` |
| next_allowed_action | `wait_until_current` |
| current_identity | no; wait for project-ledger activation |
| task_ids | `IMPL-SBX-05-03`; `IMPL-SBX-05-04` |
| batch_ids | `BATCH-SBX-05B-01`; `BATCH-SBX-05B-02`; `BATCH-SBX-05B-03` |
| evidence_maturity | G1;all-or-nothing、I065、exact requirement / handle / lease、duplicate或adapter call budget任一失败即不提交;fake不得升格P0-Q |
| implementation_started | `no` |

## Required Reads

| document | required_section | status | notes |
|---|---|---|---|
| projects/L4-sandbox/07-实施计划.md | §1, §3, §5~§12 and this exact boundary row in §6 | not_run | Formal implementation authority and control rules. |
| projects/L4-sandbox/03-详细设计.md | §8.2 / §8.5 boundary flow / §10~§13 / §14 | not_run | Exact owner reading copied from Step 6 section 7.4. |
| projects/L4-sandbox/04-配置设计.md | I039/I040/I041/I065 | not_run | Exact owner reading copied from Step 6 section 7.4. |
| projects/L4-sandbox/05-测试方案.md | CMD-003/004及boundary TXN / RACE | not_run | Exact owner reading copied from Step 6 section 7.4. |
| projects/L4-sandbox/06-验收标准.md | AC-SBX-009~011 | not_run | Exact owner reading copied from Step 6 section 7.4. |
| projects/L4-sandbox/design-calibration/03_ddd_step_07_trait_port_adapter_contracts.md | `03_ddd_step_07_trait_port_adapter_contracts.md` | not_run | Exact calibration or standard reference copied from Step 6 section 7.4. |
| projects/L4-sandbox/design-calibration/03_ddd_step_09_function_flows.md | `03_ddd_step_09_function_flows.md` | not_run | Exact calibration or standard reference copied from Step 6 section 7.4. |
| projects/L4-sandbox/design-calibration/03_ddd_step_11_persistence_transaction_consistency.md | `03_ddd_step_11_persistence_transaction_consistency.md` | not_run | Exact calibration or standard reference copied from Step 6 section 7.4. |
| projects/L4-sandbox/design-calibration/03_ddd_step_14_config_external_binding.md | `03_ddd_step_14_config_external_binding.md` | not_run | Exact calibration or standard reference copied from Step 6 section 7.4. |
| projects/L4-sandbox/design-calibration/04_config_step_07_config_items.md | `04_config_step_07_config_items.md` | not_run | Exact calibration or standard reference copied from Step 6 section 7.4. |
| projects/L4-sandbox/design-calibration/07_implementation_plan_step_06_tasks_commit_boundaries.md | §7.1, §7.2, §7.4~§7.8, §7.11; CB-SBX-05B | not_run | Goal, predecessor, closure profiles, scope, tasks, batches, checks, and skeleton schema. |
| projects/L4-sandbox/design-calibration/07_implementation_plan_step_07_test_acceptance_gates.md | §6 and §8; CB-SBX-05B | not_run | Exact suite, AC, VETO, artifact, report, maturity, and review gate. |
| projects/L4-sandbox/design-calibration/07_implementation_plan_step_08_boundary_readiness_matrix.md | CB-SBX-05B readiness row | not_run | Config, environment, adapter, external dependency, and unavailable disposition. |
| projects/L4-sandbox/design-calibration/07_implementation_plan_step_09_boundary_risk_matrix.md | CB-SBX-05B risk row | not_run | Full Spike, Risk, OQ, closure, and safe routing. |
| projects/L4-sandbox/design-calibration/07_implementation_plan_step_10_boundary_control_matrix.md | CB-SBX-05B control row | not_run | Pause, rollback, invalidation, and recovery routing. |
| projects/L4-sandbox/design-calibration/07_implementation_plan_step_11_boundary_commit_message_matrix.md | CB-SBX-05B planned message and commit timing rows | not_run | Exact title, summary, body groups, evidence references, and commit prohibition. |
| projects/L4-sandbox/design-calibration/07_implementation_plan_step_11_review_delivery_audit.md | CB-SBX-05B review and delivery rows | not_run | Independent review, worktree protection, delivery, and handoff discipline. |
| standards/document/代码实施台账与门禁规范.md | project ledger, boundary ledger, nine Gate types, blockers, Commit Gate, and Handoff Gate | not_run | State values and recovery contract. |
| standards/document/设计真相源闭环与可落码性标准.md | boundary codeability and design writeback rules | not_run | Implementation must not invent missing design truth. |
| standards/document/全局项目依赖关系与裁剪规则.md | L4 Sandbox dependency direction and sibling-repository trimming | not_run | Only the allowed core dependency may be compile-time; adjacent products remain ports, events, handoffs, or fakes. |
| standards/document/子项目目录与代码文件组织规范.md | workspace, crate, binary, scripts, artifacts, reports, and implementation-ledger layout | not_run | Directory and code-file organization authority. |
| standards/coding/rust.md | applicable Rust source, tests, formatting, lint, and naming rules | not_run | Target-repository rules may add stricter requirements after repository creation. |

## Allowed Scope

| type | path_or_rule | status |
|---|---|---|
| allowed_path_or_rule | `crates/application/src/{commands,services,ports,repositories}.rs` | planned |
| allowed_path_or_rule | `crates/infra/src/{backend_capability_adapters,isolation_backend_adapters,truth_repositories,fakes}.rs` | planned |
| allowed_path_or_rule | `crates/api/src/command_handlers.rs` | planned |
| allowed_path_or_rule | `tests/{service,integration}/**` | planned |
| included_behavior | `DEL-SBX-CODE-004`;`DEL-SBX-CODE-005`;`DEL-SBX-CODE-006`;`DEL-SBX-CODE-009`;`DEL-SBX-CODE-011`;`DEL-SBX-CODE-012`;`DEL-SBX-ADP-001`;Command 2 context / identity / requirement -> capability -> I065-bound backend outcome -> decision / coherent boundary / handle / bounded lease grouped save -> audit / relay / replay -> API | planned |
| boundary_goal | 打通EstablishExecutionBoundary事务纵切且拒绝weak fallback。 | planned |

## Forbidden Scope

| rule | status | failure_action |
|---|---|---|
| real candidate probe;policy decision;run launch;partial / weak fallback;cleanup release | active | block_scope_gate; remove the change or reopen design |
| real candidate;policy decision;run launch;cleanup release | active | block_scope_gate; do not stage or commit |
| Do not implement tools semantic execution, runtime agent-loop orchestration, or member lifecycle orchestration inside Sandbox. | active | block_scope_gate; return the concern to its owning project |
| Do not use latest paths, static evidence aliases, prefilled Passed or acceptance decisions, raw secret or process bodies, or unrelated user changes. | active | block_evidence_or_worktree_gate; preserve safe failure material |

## Tasks And Batches

### Tasks

| task_id | order | implementation_action | input | completion_criterion |
|---|---|---|---|---|
| `IMPL-SBX-05-03` | 3 | 编写capability / backend ports、I065-bound outcome mapping、group repository exact reads和fake | boundary flow;I065 | supported / unsupported / unavailable稳定分类;window有界且typed reads无scan |
| `IMPL-SBX-05-04` | 4 | 编写Command 2 grouped-save事务、API映射和all-or-nothing tests | CMD-003 / CMD-004 | requirement / decision / boundary / optional handle / lease原子;partial failed handle保留;rollback / race / replay闭合 |

### Batches

| batch_id | goal | input_to_output | expected_size | post_batch_check | commit_relation |
|---|---|---|---|---|---|
| `BATCH-SBX-05B-01` | capability / backend / lease seam | formal ports + I065 -> bounded outcome / fake / exact typed reads | 200~300 | failure injection / window validation / no scan | one commit after every batch passes |
| `BATCH-SBX-05B-02` | coherent grouped transaction | command template -> atomic requirement / decision / boundary / optional handle / lease | 200~300 | grouped coherence / rollback / version race / duplicate | one commit after every batch passes |
| `BATCH-SBX-05B-03` | entry / slice checks | service -> API / audit / relay / tests | 150~250 | CMD-003 /004;P0-Q no-substitution | one commit after every batch passes |

Subfunction grouping: capability / I065-bound backend seam + grouped UoW / exact reads + API

Same-commit cause: bounded outcome、requirement / decision / boundary / optional handle / lease原子可见和后序typed reads共同构成all-or-nothing boundary事实

Verification closure: unsupported / grouped rollback / exact read / call budget

Explicitly excluded: candidate / policy decision / run launch

## Activation Readiness

| dimension | planned_requirement | actual_status |
|---|---|---|
| config_and_source | I035~I043 /I065;capability /boundary /backend同代;I065只在establishment消费 | not_run |
| environment_and_adapter | ENV-02 non-executing backend +capability fake;ENV-03 availability seam补强 | not_run |
| external_and_tooling | exact context /identity /requirement reads、grouped UoW、adapter call trace | not_run |
| unavailable_disposition | unsupported /stale /unavailable formal reject;无candidate /host /weak fallback | not_run |
| boundary_specific_activation | I039 / I040 / I041 / I065同代binding;grouped-save与exact reads闭合 | not_run |

## Design Closure And Risk

| field | planned_value | actual_status |
|---|---|---|
| closure_profiles | backend / lease / transaction / entry;BASE+TXN+CONFIG+STATE | not_run |
| applicable_experience | validation truth;I065-bound bounded outcome;grouped save;partial failed handle;exact requirement / handle / lease reads;version / replay;no weak fallback | not_run |
| formal_evidence_location | `03`§8 / §10~§14;`04`I039~I041 / I065;`05`CMD-003/004 | not_run |
| explicit_non_applicability | real qualification与policy decision不适用:仅P01~04 formal fake,Boundary先于Policy | not_run |
| design_level_conclusion | `passed_design`;P0-Q保持Blocked / NotEvaluated | design_record_only |
| activation_or_design_closure | non-executing backend /capability fake、exact context /requirement /I065 generation source与no weak fallback闭合 | not_run |
| safe_route_if_open_or_triggered | P0-C fake /设计缺口阻断;candidate未定不阻塞本slice但P0-Q保持NotEvaluated;不得host fallback | not_run |

| reference_type | full_references | execution_status |
|---|---|---|
| spike | `SP-SBX-IMP-006`; `SP-SBX-IMP-007` | not_run |
| risk | `R-SBX-IMP-003`; `R-SBX-IMP-005`; `R-SBX-IMP-007`; `R-SBX-IMP-019`; `R-SBX-IMP-020` | not_run |
| open_question | `OQ-SBX-IMP-006`; `OQ-SBX-IMP-007` | not_run |

## Required Checks

| check_id | command_or_assertion | required_status | actual_status | evidence |
|---|---|---|---|---|
| CHK-ACTIVATION | Close predecessor CB-SBX-05A; I039 / I040 / I041 / I065同代binding;grouped-save与exact reads闭合 | closed_or_formal_blocked | not_run | absent |
| CHK-DESIGN | backend / lease / transaction / entry;BASE+TXN+CONFIG+STATE; closure evidence: `03`§8 / §10~§14;`04`I039~I041 / I065;`05`CMD-003/004; repeat-check rule: `passed_design`;P0-Q保持Blocked / NotEvaluated | design_consistent | not_run | absent |
| CHK-SCOPE | Allowed: `crates/application/src/{commands,services,ports,repositories}.rs`;`crates/infra/src/{backend_capability_adapters,isolation_backend_adapters,truth_repositories,fakes}.rs`;`crates/api/src/command_handlers.rs`;`tests/{service,integration}/**`; included behavior: `DEL-SBX-CODE-004`;`DEL-SBX-CODE-005`;`DEL-SBX-CODE-006`;`DEL-SBX-CODE-009`;`DEL-SBX-CODE-011`;`DEL-SBX-CODE-012`;`DEL-SBX-ADP-001`;Command 2 context / identity / requirement -> capability -> I065-bound backend outcome -> decision / coherent boundary / handle / bounded lease grouped save -> audit / relay / replay -> API; forbidden: real candidate probe;policy decision;run launch;partial / weak fallback;cleanup release; real candidate;policy decision;run launch;cleanup release | scope_clean | not_run | absent |
| CHK-WORKTREE | Record target root, HEAD, initial git status, local identity, user-owned changes, and staged-file ownership. | worktree_recorded | not_run | absent |
| CHK-BUILD | controlled backend success / unsupported / stale / unavailable / race / rollback / duplicate / partial failed handle preservation;grouped-save coherence;`get_boundary_requirement`与boundary -> handle -> lease exact reads;adapter call budget完成后 | pass_or_formal_allowed_status | not_run | absent |
| CHK-TEST | SUITE-SBX-002 /004 /008及007 /009 /010适用补强:CMD-003/004、boundary TXN / RACE / ERR;unsupported / stale / unavailable / grouped rollback / exact reads / call budget | all_mandatory_pass | not_run | absent |
| CHK-AC-VETO | AC-SBX-009~011 /027 /032~041;VETO-SBX-001~003 /005 /006 /010 /012 /013 /016 | assertions_present_and_no_triggered_veto | not_run | absent |
| CHK-ARTIFACT | G1 boundary / consistency / config / audit raw,含I065-bounded handle / lease safe refs | maturity_contract_satisfied | not_run | absent |
| CHK-REPORT | suite reports、targeted parity / redaction / report-audit | paired_report_or_G0_reason | not_run | absent |
| CHK-EVIDENCE-MATURITY | G1;all-or-nothing、I065、exact requirement / handle / lease、duplicate或adapter call budget任一失败即不提交;fake不得升格P0-Q | status_fidelity_and_safe_failure | not_run | absent |
| CHK-READINESS | Config/source: I035~I043 /I065;capability /boundary /backend同代;I065只在establishment消费; ENV/adapter: ENV-02 non-executing backend +capability fake;ENV-03 availability seam补强; external/tool: exact context /identity /requirement reads、grouped UoW、adapter call trace; unavailable route: unsupported /stale /unavailable formal reject;无candidate /host /weak fallback | ready_or_formally_blocked | not_run | absent |
| CHK-RISK | Close or confirm before Activation/Design: non-executing backend /capability fake、exact context /requirement /I065 generation source与no weak fallback闭合; route: P0-C fake /设计缺口阻断;candidate未定不阻塞本slice但P0-Q保持NotEvaluated;不得host fallback | closed_or_routed | not_run | absent |
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

Boundary artifact contract: G1 boundary / consistency / config / audit raw,含I065-bounded handle / lease safe refs

Boundary report contract: suite reports、targeted parity / redaction / report-audit

Planned evidence/review reference: boundary / consistency / config / audit reports及parity / redaction / report audit

Commit is allowed only when: capability outcome、I065、grouped rollback、exact reads、call budget和no weak fallback通过

Forbidden proof substitution: real candidate、policy、run

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
| planned_commit_title | `feat(boundary): establish coherent execution boundaries atomically` |
| planned_commit_summary | `Establish coherent execution boundaries as one grouped transaction for CB-SBX-05B.` |
| planned_body_groups | `Capability and backend establishment seam:`;`Grouped boundary establishment transaction:`;`API entry and exact-read verification:` |
| same_commit_cause | bounded adapter outcome、requirement / decision / boundary / handle / lease原子可见且后序可exact read |
| planned_footer | `Co-Authored-By: Codex <noreply@openai.com>` |
| staged_files_checked | `not_run` |
| commit_message_checked | `not_run` |
| committed_hash | `not_committed` |
| committed_message | `not_committed` |
| post_commit_status | `not_run` |

## Review Record

| field | planned_or_actual_value |
|---|---|
| required_review_responsibility | boundary + transaction + adapter reviewer核grouped save、partial failure保存和no weak fallback |
| type_and_scope_review | `feat(boundary)`对应establishment纵切 |
| body_group_review | seam / grouped transaction / entry不可横拆 |
| review_and_evidence_discipline | boundary + transaction + adapter |
| design_discipline_record | passed_design |
| future_repeat_check | I065 / exact reads / call budget |
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

Expected successor after a real Handoff Gate pass: `CB-SBX-06A`. The project ledger alone activates that successor.

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
