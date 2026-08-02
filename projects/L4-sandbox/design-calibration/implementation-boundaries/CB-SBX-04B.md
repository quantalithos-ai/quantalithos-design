# CB-SBX-04B implementation ledger

> Created by L4-sandbox Step 13 from reviewed Step 6~11 matrices.
> This is a planned recovery contract, not proof of implementation, test execution, evidence, review, acceptance, or authorization.

| field | value |
|---|---|
| project | `L4-sandbox` |
| boundary_id | `CB-SBX-04B` |
| phase | `PH-04` |
| verifiable_goal | 打通OpenControlledExecutionContext事务纵切和API entry。 |
| direct_predecessor | `CB-SBX-04A` |
| design_baseline | `not_fixed` |
| implementation_repo | `/home/aris/Projects/quantalithos-sandbox (absent)` |
| status | `planned` |
| next_allowed_action | `wait_until_current` |
| current_identity | no; wait for project-ledger activation |
| task_ids | `IMPL-SBX-04-03`; `IMPL-SBX-04-04` |
| batch_ids | `BATCH-SBX-04B-01`; `BATCH-SBX-04B-02`; `BATCH-SBX-04B-03` |
| evidence_maturity | G1;accepted group非原子、duplicate重算、entry绕service、resolver body入仓或rollback可见即不提交 |
| implementation_started | `no` |

## Required Reads

| document | required_section | status | notes |
|---|---|---|---|
| projects/L4-sandbox/07-实施计划.md | §1, §3, §5~§12 and this exact boundary row in §6 | not_run | Formal implementation authority and control rules. |
| projects/L4-sandbox/03-详细设计.md | §8.2 / §8.5 Open flow | not_run | Exact owner reading copied from Step 6 section 7.4. |
| projects/L4-sandbox/03-详细设计.md | §10 / §12 | not_run | Exact owner reading copied from Step 6 section 7.4. |
| projects/L4-sandbox/03-详细设计.md | §14 | not_run | Exact owner reading copied from Step 6 section 7.4. |
| projects/L4-sandbox/05-测试方案.md | CMD-001/002及intake TXN / RACE | not_run | Exact owner reading copied from Step 6 section 7.4. |
| projects/L4-sandbox/06-验收标准.md | AC-SBX-006~008 | not_run | Exact owner reading copied from Step 6 section 7.4. |
| projects/L4-sandbox/design-calibration/03_ddd_step_09_function_flows.md | `03_ddd_step_09_function_flows.md` | not_run | Exact calibration or standard reference copied from Step 6 section 7.4. |
| projects/L4-sandbox/design-calibration/03_ddd_step_11_persistence_transaction_consistency.md | `03_ddd_step_11_persistence_transaction_consistency.md` | not_run | Exact calibration or standard reference copied from Step 6 section 7.4. |
| projects/L4-sandbox/design-calibration/03_ddd_step_15_observability_audit.md | `03_ddd_step_15_observability_audit.md` | not_run | Exact calibration or standard reference copied from Step 6 section 7.4. |
| projects/L4-sandbox/design-calibration/07_implementation_plan_step_06_tasks_commit_boundaries.md | §7.1, §7.2, §7.4~§7.8, §7.11; CB-SBX-04B | not_run | Goal, predecessor, closure profiles, scope, tasks, batches, checks, and skeleton schema. |
| projects/L4-sandbox/design-calibration/07_implementation_plan_step_07_test_acceptance_gates.md | §6 and §8; CB-SBX-04B | not_run | Exact suite, AC, VETO, artifact, report, maturity, and review gate. |
| projects/L4-sandbox/design-calibration/07_implementation_plan_step_08_boundary_readiness_matrix.md | CB-SBX-04B readiness row | not_run | Config, environment, adapter, external dependency, and unavailable disposition. |
| projects/L4-sandbox/design-calibration/07_implementation_plan_step_09_boundary_risk_matrix.md | CB-SBX-04B risk row | not_run | Full Spike, Risk, OQ, closure, and safe routing. |
| projects/L4-sandbox/design-calibration/07_implementation_plan_step_10_boundary_control_matrix.md | CB-SBX-04B control row | not_run | Pause, rollback, invalidation, and recovery routing. |
| projects/L4-sandbox/design-calibration/07_implementation_plan_step_11_boundary_commit_message_matrix.md | CB-SBX-04B planned message and commit timing rows | not_run | Exact title, summary, body groups, evidence references, and commit prohibition. |
| projects/L4-sandbox/design-calibration/07_implementation_plan_step_11_review_delivery_audit.md | CB-SBX-04B review and delivery rows | not_run | Independent review, worktree protection, delivery, and handoff discipline. |
| standards/document/代码实施台账与门禁规范.md | project ledger, boundary ledger, nine Gate types, blockers, Commit Gate, and Handoff Gate | not_run | State values and recovery contract. |
| standards/document/设计真相源闭环与可落码性标准.md | boundary codeability and design writeback rules | not_run | Implementation must not invent missing design truth. |
| standards/document/全局项目依赖关系与裁剪规则.md | L4 Sandbox dependency direction and sibling-repository trimming | not_run | Only the allowed core dependency may be compile-time; adjacent products remain ports, events, handoffs, or fakes. |
| standards/document/子项目目录与代码文件组织规范.md | workspace, crate, binary, scripts, artifacts, reports, and implementation-ledger layout | not_run | Directory and code-file organization authority. |
| standards/coding/rust.md | applicable Rust source, tests, formatting, lint, and naming rules | not_run | Target-repository rules may add stricter requirements after repository creation. |

## Allowed Scope

| type | path_or_rule | status |
|---|---|---|
| allowed_path_or_rule | `crates/application/src/{commands,services,ports,repositories}.rs` | planned |
| allowed_path_or_rule | `crates/infra/src/{context_resolvers,truth_repositories,fakes}.rs` | planned |
| allowed_path_or_rule | `crates/api/src/{command_handlers,errors,bin/sandbox-api.rs}` | planned |
| allowed_path_or_rule | `tests/{service,integration}/**` | planned |
| included_behavior | `DEL-SBX-CODE-004`;`DEL-SBX-CODE-005`;`DEL-SBX-CODE-006`;`DEL-SBX-CODE-007`;`DEL-SBX-CODE-009`;`DEL-SBX-CODE-011`;`DEL-SBX-CODE-012`;`DEL-SBX-ADP-001`;Command 1 resolver -> UoW -> truth / audit / relay / stale / stored result -> API | planned |
| boundary_goal | 打通OpenControlledExecutionContext事务纵切和API entry。 | planned |

## Forbidden Scope

| rule | status | failure_action |
|---|---|---|
| PH-05+ truth;Query;publisher;真实相邻仓集成 | active | block_scope_gate; remove the change or reopen design |
| Query / publisher /真实相邻仓;Command 2~10 | active | block_scope_gate; do not stage or commit |
| Do not implement tools semantic execution, runtime agent-loop orchestration, or member lifecycle orchestration inside Sandbox. | active | block_scope_gate; return the concern to its owning project |
| Do not use latest paths, static evidence aliases, prefilled Passed or acceptance decisions, raw secret or process bodies, or unrelated user changes. | active | block_evidence_or_worktree_gate; preserve safe failure material |

## Tasks And Batches

### Tasks

| task_id | order | implementation_action | input | completion_criterion |
|---|---|---|---|---|
| `IMPL-SBX-04-03` | 3 | 编写resolver / repository / subject mapper和Command 1 UoW | `OpenControlledExecutionContextFlow` | accepted group原子commit |
| `IMPL-SBX-04-04` | 4 | 编写fake、API handler / fulfillment wiring和targeted tests | CMD-001 / CMD-002 | accepted / unresolved / duplicate / rollback闭合 |

### Batches

| batch_id | goal | input_to_output | expected_size | post_batch_check | commit_relation |
|---|---|---|---|---|---|
| `BATCH-SBX-04B-01` | resolver / persistence surface | port contract -> resolver / repository / mapper | 200~300 | fake parity / missing mapping | one commit after every batch passes |
| `BATCH-SBX-04B-02` | high-risk intake UoW | shared template -> reserve / save / side effects / replay | 200~300 | rollback / race / no recompute | one commit after every batch passes |
| `BATCH-SBX-04B-03` | entry / evidence producer | service result -> API / worker mapping / tests | 150~250 | CMD-001 /002;safe error / redaction | one commit after every batch passes |

Subfunction grouping: resolver / repository + intake UoW + API / worker mapping

Same-commit cause: 共同构成首个accepted纵切,拆开任一部分都不能验证原子受理

Verification closure: CMD / TXN / RACE / rollback

Explicitly excluded: Command 2+

## Activation Readiness

| dimension | planned_requirement | actual_status |
|---|---|---|
| config_and_source | I017 /I020 /I028 /I091 /I094~I097适用;exact frozen generation | not_run |
| environment_and_adapter | ENV-02 context resolver semantic fake;ENV-03 controlled seam仅补强 | not_run |
| external_and_tooling | body-free resolver、truth /audit /relay /replay stores、API runtime handle | not_run |
| unavailable_disposition | required fake缺失阻断;real source缺失不匿名 /不自造context | not_run |
| boundary_specific_activation | resolver / UoW fake可用 | not_run |

## Design Closure And Risk

| field | planned_value | actual_status |
|---|---|---|
| closure_profiles | command / UoW / entry;BASE+TXN+CONTRACT | not_run |
| applicable_experience | resolver truth;entry context factory;side-effect inventory;cursor;stale identity;stored replay;API disposition | not_run |
| formal_evidence_location | `03`§8.2 / §10 / §12 / §14;`05`CMD-001/002;`06`AC-006~008 | not_run |
| explicit_non_applicability | Query empty / job surface不适用:只处理Command 1 | not_run |
| design_level_conclusion | `passed_design`;unresolved / duplicate / rollback均有formal surface | design_record_only |
| activation_or_design_closure | exact generation、resolver fake、UoW /stored replay /audit /relay source map与negative branch闭合 | not_run |
| safe_route_if_open_or_triggered | 外部required fake缺失记`dependency_wait`并`handoff`;当前scope fake失败`fix_gate_failure`;契约缺口`wait_design`;不得等待Query /publisher或伪造real source | not_run |

| reference_type | full_references | execution_status |
|---|---|---|
| spike | `SP-SBX-IMP-006`; `SP-SBX-IMP-007` | not_run |
| risk | `R-SBX-IMP-003`; `R-SBX-IMP-005`; `R-SBX-IMP-007`; `R-SBX-IMP-008`; `R-SBX-IMP-011`; `R-SBX-IMP-019`; `R-SBX-IMP-020` | not_run |
| open_question | none_by_boundary_matrix | not_run |

## Required Checks

| check_id | command_or_assertion | required_status | actual_status | evidence |
|---|---|---|---|---|
| CHK-ACTIVATION | Close predecessor CB-SBX-04A; resolver / UoW fake可用 | closed_or_formal_blocked | not_run | absent |
| CHK-DESIGN | command / UoW / entry;BASE+TXN+CONTRACT; closure evidence: `03`§8.2 / §10 / §12 / §14;`05`CMD-001/002;`06`AC-006~008; repeat-check rule: `passed_design`;unresolved / duplicate / rollback均有formal surface | design_consistent | not_run | absent |
| CHK-SCOPE | Allowed: `crates/application/src/{commands,services,ports,repositories}.rs`;`crates/infra/src/{context_resolvers,truth_repositories,fakes}.rs`;`crates/api/src/{command_handlers,errors,bin/sandbox-api.rs}`;`tests/{service,integration}/**`; included behavior: `DEL-SBX-CODE-004`;`DEL-SBX-CODE-005`;`DEL-SBX-CODE-006`;`DEL-SBX-CODE-007`;`DEL-SBX-CODE-009`;`DEL-SBX-CODE-011`;`DEL-SBX-CODE-012`;`DEL-SBX-ADP-001`;Command 1 resolver -> UoW -> truth / audit / relay / stale / stored result -> API; forbidden: PH-05+ truth;Query;publisher;真实相邻仓集成; Query / publisher /真实相邻仓;Command 2~10 | scope_clean | not_run | absent |
| CHK-WORKTREE | Record target root, HEAD, initial git status, local identity, user-owned changes, and staged-file ownership. | worktree_recorded | not_run | absent |
| CHK-BUILD | accepted / rejected / unresolved / duplicate / digest conflict / version race / rollback / backend-call-budget tests;affected crates check完成后 | pass_or_formal_allowed_status | not_run | absent |
| CHK-TEST | SUITE-SBX-004主slice +002 /007 /009 /010补强:CMD-001/002及intake适用TXN / RACE / ERR;accepted / rejected / unresolved / duplicate / conflict / rollback / call budget | all_mandatory_pass | not_run | absent |
| CHK-AC-VETO | AC-SBX-006~008 /026 /032~041;VETO-SBX-001 /002 /005 /006 /010 /013 /016 | assertions_present_and_no_triggered_veto | not_run | absent |
| CHK-ARTIFACT | G1 intake service / consistency / error / audit raw与redaction check | maturity_contract_satisfied | not_run | absent |
| CHK-REPORT | suite reports、targeted `redaction-check.md` / `report-audit.md` | paired_report_or_G0_reason | not_run | absent |
| CHK-EVIDENCE-MATURITY | G1;accepted group非原子、duplicate重算、entry绕service、resolver body入仓或rollback可见即不提交 | status_fidelity_and_safe_failure | not_run | absent |
| CHK-READINESS | Config/source: I017 /I020 /I028 /I091 /I094~I097适用;exact frozen generation; ENV/adapter: ENV-02 context resolver semantic fake;ENV-03 controlled seam仅补强; external/tool: body-free resolver、truth /audit /relay /replay stores、API runtime handle; unavailable route: required fake缺失阻断;real source缺失不匿名 /不自造context | ready_or_formally_blocked | not_run | absent |
| CHK-RISK | Close or confirm before Activation/Design: exact generation、resolver fake、UoW /stored replay /audit /relay source map与negative branch闭合; route: 外部required fake缺失记`dependency_wait`并`handoff`;当前scope fake失败`fix_gate_failure`;契约缺口`wait_design`;不得等待Query /publisher或伪造real source | closed_or_routed | not_run | absent |
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

Boundary artifact contract: G1 intake service / consistency / error / audit raw与redaction check

Boundary report contract: suite reports、targeted `redaction-check.md` / `report-audit.md`

Planned evidence/review reference: intake service / consistency / error / audit reports及`report-audit.md`

Commit is allowed only when: resolver、grouped UoW、rollback、duplicate、stored replay和entry mapping通过

Forbidden proof substitution: PH-05+能力、真实相邻仓集成

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
| planned_commit_title | `feat(intake): open controlled execution contexts atomically` |
| planned_commit_summary | `Open controlled execution contexts as one atomic slice for CB-SBX-04B.` |
| planned_body_groups | `Resolver and repository seams:`;`Intake transaction and stored replay:`;`API entry and integration verification:` |
| same_commit_cause | resolver、grouped UoW、replay和entry共同构成首个可验证受理纵切 |
| planned_footer | `Co-Authored-By: Codex <noreply@openai.com>` |
| staged_files_checked | `not_run` |
| commit_message_checked | `not_run` |
| committed_hash | `not_committed` |
| committed_message | `not_committed` |
| post_commit_status | `not_run` |

## Review Record

| field | planned_or_actual_value |
|---|---|
| required_review_responsibility | application / transaction / API / audit reviewer核UoW side-effect inventory与stored replay |
| type_and_scope_review | `feat(intake)`同scope纵切 |
| body_group_review | resolver / UoW / entry共同验证原子受理 |
| review_and_evidence_discipline | application + transaction + API |
| design_discipline_record | passed_design |
| future_repeat_check | stored replay和call budget |
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

Expected successor after a real Handoff Gate pass: `CB-SBX-05A`. The project ledger alone activates that successor.

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
