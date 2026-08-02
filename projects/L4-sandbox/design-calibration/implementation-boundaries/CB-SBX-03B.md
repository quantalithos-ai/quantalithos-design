# CB-SBX-03B implementation ledger

> Created by L4-sandbox Step 13 from reviewed Step 6~11 matrices.
> This is a planned recovery contract, not proof of implementation, test execution, evidence, review, acceptance, or authorization.

| field | value |
|---|---|
| project | `L4-sandbox` |
| boundary_id | `CB-SBX-03B` |
| phase | `PH-03` |
| verifiable_goal | 原子装配material-safe profile generation和P01~05 runtime composition。 |
| direct_predecessor | `CB-SBX-03A` |
| design_baseline | `not_fixed` |
| implementation_repo | `/home/aris/Projects/quantalithos-sandbox (absent)` |
| status | `planned` |
| next_allowed_action | `wait_until_current` |
| current_identity | no; wait for project-ledger activation |
| task_ids | `IMPL-SBX-03-04`; `IMPL-SBX-03-05`; `IMPL-SBX-03-06` |
| batch_ids | `BATCH-SBX-03B-01`; `BATCH-SBX-03B-02`; `BATCH-SBX-03B-03`; `BATCH-SBX-03B-04` |
| evidence_maturity | G1;partial / mixed generation、raw material、P05 fallback或P06 /07冒充P0均不提交 |
| implementation_started | `no` |

## Required Reads

| document | required_section | status | notes |
|---|---|---|---|
| projects/L4-sandbox/07-实施计划.md | §1, §3, §5~§12 and this exact boundary row in §6 | not_run | Formal implementation authority and control rules. |
| projects/L4-sandbox/03-详细设计.md | §13.1~§13.5 | not_run | Exact owner reading copied from Step 6 section 7.4. |
| projects/L4-sandbox/04-配置设计.md | §6 / §8~§12 | not_run | Exact owner reading copied from Step 6 section 7.4. |
| projects/L4-sandbox/05-测试方案.md | §8.4~§8.5 / §10.3 | not_run | Exact owner reading copied from Step 6 section 7.4. |
| projects/L4-sandbox/design-calibration/04_config_step_06_environment_profiles_matrix.md | `04_config_step_06_environment_profiles_matrix.md` | not_run | Exact calibration or standard reference copied from Step 6 section 7.4. |
| projects/L4-sandbox/design-calibration/04_config_step_08_sensitive_secrets.md | `04_config_step_08_sensitive_secrets.md` | not_run | Exact calibration or standard reference copied from Step 6 section 7.4. |
| projects/L4-sandbox/design-calibration/04_config_step_12_downstream_handoff.md | `04_config_step_12_downstream_handoff.md` | not_run | Exact calibration or standard reference copied from Step 6 section 7.4. |
| projects/L4-sandbox/design-calibration/07_implementation_plan_step_06_tasks_commit_boundaries.md | §7.1, §7.2, §7.4~§7.8, §7.11; CB-SBX-03B | not_run | Goal, predecessor, closure profiles, scope, tasks, batches, checks, and skeleton schema. |
| projects/L4-sandbox/design-calibration/07_implementation_plan_step_07_test_acceptance_gates.md | §6 and §8; CB-SBX-03B | not_run | Exact suite, AC, VETO, artifact, report, maturity, and review gate. |
| projects/L4-sandbox/design-calibration/07_implementation_plan_step_08_boundary_readiness_matrix.md | CB-SBX-03B readiness row | not_run | Config, environment, adapter, external dependency, and unavailable disposition. |
| projects/L4-sandbox/design-calibration/07_implementation_plan_step_09_boundary_risk_matrix.md | CB-SBX-03B risk row | not_run | Full Spike, Risk, OQ, closure, and safe routing. |
| projects/L4-sandbox/design-calibration/07_implementation_plan_step_10_boundary_control_matrix.md | CB-SBX-03B control row | not_run | Pause, rollback, invalidation, and recovery routing. |
| projects/L4-sandbox/design-calibration/07_implementation_plan_step_11_boundary_commit_message_matrix.md | CB-SBX-03B planned message and commit timing rows | not_run | Exact title, summary, body groups, evidence references, and commit prohibition. |
| projects/L4-sandbox/design-calibration/07_implementation_plan_step_11_review_delivery_audit.md | CB-SBX-03B review and delivery rows | not_run | Independent review, worktree protection, delivery, and handoff discipline. |
| standards/document/代码实施台账与门禁规范.md | project ledger, boundary ledger, nine Gate types, blockers, Commit Gate, and Handoff Gate | not_run | State values and recovery contract. |
| standards/document/设计真相源闭环与可落码性标准.md | boundary codeability and design writeback rules | not_run | Implementation must not invent missing design truth. |
| standards/document/全局项目依赖关系与裁剪规则.md | L4 Sandbox dependency direction and sibling-repository trimming | not_run | Only the allowed core dependency may be compile-time; adjacent products remain ports, events, handoffs, or fakes. |
| standards/document/子项目目录与代码文件组织规范.md | workspace, crate, binary, scripts, artifacts, reports, and implementation-ledger layout | not_run | Directory and code-file organization authority. |
| standards/coding/rust.md | applicable Rust source, tests, formatting, lint, and naming rules | not_run | Target-repository rules may add stricter requirements after repository creation. |

## Allowed Scope

| type | path_or_rule | status |
|---|---|---|
| allowed_path_or_rule | `crates/application/src/ports.rs` | planned |
| allowed_path_or_rule | `crates/infra/src/{config,runtime_builder,fakes,*_adapters}.rs` | planned |
| allowed_path_or_rule | `tests/{integration,support}/**` | planned |
| included_behavior | `DEL-SBX-CFG-004`;`DEL-SBX-CFG-005`;`DEL-SBX-CFG-006`;`DEL-SBX-ADP-001`;`DEL-SBX-CODE-005`;`DEL-SBX-CODE-012`;P01~05 eligibility、23 material slots、complete generation、atomic runtime builder、P01~04 fake registry | planned |
| boundary_goal | 原子装配material-safe profile generation和P01~05 runtime composition。 | planned |

## Forbidden Scope

| rule | status | failure_action |
|---|---|---|
| concrete candidate产品;真实material;hot reload / LKG / P07 activation;业务service实现 | active | block_scope_gate; remove the change or reopen design |
| candidate实现、真实secret、hot reload / LKG、业务service实例 | active | block_scope_gate; do not stage or commit |
| Do not implement tools semantic execution, runtime agent-loop orchestration, or member lifecycle orchestration inside Sandbox. | active | block_scope_gate; return the concern to its owning project |
| Do not use latest paths, static evidence aliases, prefilled Passed or acceptance decisions, raw secret or process bodies, or unrelated user changes. | active | block_evidence_or_worktree_gate; preserve safe failure material |

## Tasks And Batches

### Tasks

| task_id | order | implementation_action | input | completion_criterion |
|---|---|---|---|---|
| `IMPL-SBX-03-04` | 4 | 编写23 material slot descriptor / lease / revoke provider-neutral面 | `04`§8 | raw material不进入ordinary carrier |
| `IMPL-SBX-03-05` | 5 | 编写P01~05 eligibility、P06 conditional、P07 reopen语义 | `04`§6 | profile状态无fallback或伪激活 |
| `IMPL-SBX-03-06` | 6 | 编写complete generation、atomic publication、registry和runtime builder | `04`§9~§12 | partial / mixed generation不可见 |

### Batches

| batch_id | goal | input_to_output | expected_size | post_batch_check | commit_relation |
|---|---|---|---|---|---|
| `BATCH-SBX-03B-01` | sensitive registry | 23 slot contract -> descriptor / lifecycle | 200~300 | no-output / lease / revoke tests | one commit after every batch passes |
| `BATCH-SBX-03B-02` | profile eligibility | PROFILE-01~07 -> eligibility / rejection | 150~250 | P05 missing;P06 conditional;P07 reopen | one commit after every batch passes |
| `BATCH-SBX-03B-03` | generation publication | validated groups -> complete immutable generation | 200~300 | partial / mixed rollback tests | one commit after every batch passes |
| `BATCH-SBX-03B-04` | runtime assembly | generation + registry -> atomic service target set | 200~300 | availability / fake parity / no default | one commit after every batch passes |

Subfunction grouping: material registry + profile eligibility + generation + runtime builder

Same-commit cause: complete generation必须携带适用material和adapter availability,不能发布半组合

Verification closure: material / profile / atomic publication

Explicitly excluded: concrete candidate

## Activation Readiness

| dimension | planned_requirement | actual_status |
|---|---|---|
| config_and_source | P01~05 composition;23 descriptors /10 class;S04 fake outcomes;S05 /S06 isolation;atomic generation | not_run |
| environment_and_adapter | ENV-01~04 fake /controlled /simulation registry;P05 missing-input rejection;P06 conditional;P07 inactive | not_run |
| external_and_tooling | runtime builder constructor graph、availability /redaction /lease-revoke fixtures | not_run |
| unavailable_disposition | partial /mixed generation或raw material阻断;真实provider /candidate不在scope | not_run |
| boundary_specific_activation | profile / material / generation表未漂移 | not_run |

## Design Closure And Risk

| field | planned_value | actual_status |
|---|---|---|
| closure_profiles | material / generation / assembly;BASE+CONFIG+MATERIAL | not_run |
| applicable_experience | config binding;material lifecycle;complete generation;adapter availability;atomic publication;phase boundary | not_run |
| formal_evidence_location | `03`§13;`04`§6 / §8~§12 | not_run |
| explicit_non_applicability | public command / Query不适用:builder只装配已定义service target | not_run |
| design_level_conclusion | `passed_design`;candidate仍只拒绝面,不得实现产品 | design_record_only |
| activation_or_design_closure | P01~05 composition、23 descriptor /10 class、same-generation publication、P06 conditional和P07 reject可机械判定 | not_run |
| safe_route_if_open_or_triggered | current P0缺口阻断;P06保持`NotRunConditional`;P07请求DesignReopen;真实产品不作为P0-C前置 | not_run |

| reference_type | full_references | execution_status |
|---|---|---|
| spike | `SP-SBX-IMP-005`; `SP-SBX-IMP-007` | not_run |
| risk | `R-SBX-IMP-003`; `R-SBX-IMP-005`; `R-SBX-IMP-006`; `R-SBX-IMP-008`; `R-SBX-IMP-016`; `R-SBX-IMP-019`; `R-SBX-IMP-020` | not_run |
| open_question | `OQ-SBX-IMP-014`; `OQ-SBX-IMP-015`; `OQ-SBX-IMP-016` | not_run |

## Required Checks

| check_id | command_or_assertion | required_status | actual_status | evidence |
|---|---|---|---|---|
| CHK-ACTIVATION | Close predecessor CB-SBX-03A; profile / material / generation表未漂移 | closed_or_formal_blocked | not_run | absent |
| CHK-DESIGN | material / generation / assembly;BASE+CONFIG+MATERIAL; closure evidence: `03`§13;`04`§6 / §8~§12; repeat-check rule: `passed_design`;candidate仍只拒绝面,不得实现产品 | design_consistent | not_run | absent |
| CHK-SCOPE | Allowed: `crates/application/src/ports.rs`;`crates/infra/src/{config,runtime_builder,fakes,*_adapters}.rs`;`tests/{integration,support}/**`; included behavior: `DEL-SBX-CFG-004`;`DEL-SBX-CFG-005`;`DEL-SBX-CFG-006`;`DEL-SBX-ADP-001`;`DEL-SBX-CODE-005`;`DEL-SBX-CODE-012`;P01~05 eligibility、23 material slots、complete generation、atomic runtime builder、P01~04 fake registry; forbidden: concrete candidate产品;真实material;hot reload / LKG / P07 activation;业务service实现; candidate实现、真实secret、hot reload / LKG、业务service实例 | scope_clean | not_run | absent |
| CHK-WORKTREE | Record target root, HEAD, initial git status, local identity, user-owned changes, and staged-file ownership. | worktree_recorded | not_run | absent |
| CHK-BUILD | profile / generation / material lease / revoke / redaction / partial publication / P05 missing-input / P06 conditional / P07 reopen tests完成后 | pass_or_formal_allowed_status | not_run | absent |
| CHK-TEST | SUITE-SBX-003 /008 targeted:CFG generation / material / profile / availability / atomic publication / parity;P05缺前置拒绝、P06 conditional、P07 reopen | all_mandatory_pass | not_run | absent |
| CHK-AC-VETO | AC-SBX-010 /011 /031 /034 /035 /037 /038 /041;VETO-SBX-002 /003 /006~008 /016 | assertions_present_and_no_triggered_veto | not_run | absent |
| CHK-ARTIFACT | G1 config generation、safe material descriptor、adapter parity suite raw与redaction checks | maturity_contract_satisfied | not_run | absent |
| CHK-REPORT | suite reports、targeted redaction / scope report | paired_report_or_G0_reason | not_run | absent |
| CHK-EVIDENCE-MATURITY | G1;partial / mixed generation、raw material、P05 fallback或P06 /07冒充P0均不提交 | status_fidelity_and_safe_failure | not_run | absent |
| CHK-READINESS | Config/source: P01~05 composition;23 descriptors /10 class;S04 fake outcomes;S05 /S06 isolation;atomic generation; ENV/adapter: ENV-01~04 fake /controlled /simulation registry;P05 missing-input rejection;P06 conditional;P07 inactive; external/tool: runtime builder constructor graph、availability /redaction /lease-revoke fixtures; unavailable route: partial /mixed generation或raw material阻断;真实provider /candidate不在scope | ready_or_formally_blocked | not_run | absent |
| CHK-RISK | Close or confirm before Activation/Design: P01~05 composition、23 descriptor /10 class、same-generation publication、P06 conditional和P07 reject可机械判定; route: current P0缺口阻断;P06保持`NotRunConditional`;P07请求DesignReopen;真实产品不作为P0-C前置 | closed_or_routed | not_run | absent |
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

Boundary artifact contract: G1 config generation、safe material descriptor、adapter parity suite raw与redaction checks

Boundary report contract: suite reports、targeted redaction / scope report

Planned evidence/review reference: config / material / parity suite reports及targeted redaction / scope report

Commit is allowed only when: material descriptor、P01~05 eligibility、availability与complete generation原子发布通过

Forbidden proof substitution: concrete candidate、P06 /P07 claim

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
| planned_commit_title | `feat(composition): assemble atomic profile runtime generations` |
| planned_commit_summary | `Assemble material-safe complete runtime generations for CB-SBX-03B.` |
| planned_body_groups | `Material-safe adapter registry:`;`Profile eligibility and atomic generation:`;`Runtime builder and parity fixtures:` |
| same_commit_cause | material、availability、profile和builder必须同代原子发布,不能形成半组合 |
| planned_footer | `Co-Authored-By: Codex <noreply@openai.com>` |
| staged_files_checked | `not_run` |
| commit_message_checked | `not_run` |
| committed_hash | `not_committed` |
| committed_message | `not_committed` |
| post_commit_status | `not_run` |

## Review Record

| field | planned_or_actual_value |
|---|---|
| required_review_responsibility | config / material / runtime-builder reviewer核same-generation complete set与lease / revoke边界 |
| type_and_scope_review | `feat(composition)`对应generation |
| body_group_review | registry / eligibility / generation / builder同代 |
| review_and_evidence_discipline | config + material + runtime builder |
| design_discipline_record | passed_design |
| future_repeat_check | concrete provider仍非本scope |
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

Expected successor after a real Handoff Gate pass: `CB-SBX-04A`. The project ledger alone activates that successor.

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
