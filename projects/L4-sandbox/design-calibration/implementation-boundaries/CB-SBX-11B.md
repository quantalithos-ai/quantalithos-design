# CB-SBX-11B implementation ledger

> Created by L4-sandbox Step 13 from reviewed Step 6~11 matrices.
> This is a planned recovery contract, not proof of implementation, test execution, evidence, review, acceptance, or authorization.

| field | value |
|---|---|
| project | `L4-sandbox` |
| boundary_id | `CB-SBX-11B` |
| phase | `PH-11` |
| verifiable_goal | 打通relay / reference / capability / handoff维护jobs。 |
| direct_predecessor | `CB-SBX-11A` |
| design_baseline | `not_fixed` |
| implementation_repo | `/home/aris/Projects/quantalithos-sandbox (absent)` |
| status | `planned` |
| next_allowed_action | `wait_until_current` |
| current_identity | no; wait for project-ledger activation |
| task_ids | `IMPL-SBX-11-03` |
| batch_ids | `BATCH-SBX-11B-01`; `BATCH-SBX-11B-02`; `BATCH-SBX-11B-03`; `BATCH-SBX-11B-04` |
| evidence_maturity | G1;scope expansion、整批重复副作用、refresh建boundary / policy truth、handoff回滚source或partial隐藏即不提交 |
| implementation_started | `no` |

## Required Reads

| document | required_section | status | notes |
|---|---|---|---|
| projects/L4-sandbox/07-实施计划.md | §1, §3, §5~§12 and this exact boundary row in §6 | not_run | Formal implementation authority and control rules. |
| projects/L4-sandbox/03-详细设计.md | §8.4 Job flow / §10~§12 | not_run | Exact owner reading copied from Step 6 section 7.4. |
| projects/L4-sandbox/05-测试方案.md | JOB-001~004 | not_run | Exact owner reading copied from Step 6 section 7.4. |
| projects/L4-sandbox/06-验收标准.md | PG-SBX-046~049 | not_run | Exact owner reading copied from Step 6 section 7.4. |
| projects/L4-sandbox/design-calibration/07_implementation_plan_step_06_tasks_commit_boundaries.md | relay / refresh / handoff job校准 | not_run | Exact calibration or standard reference copied from Step 6 section 7.4. |
| projects/L4-sandbox/design-calibration/07_implementation_plan_step_06_tasks_commit_boundaries.md | `04`retry / page policy | not_run | Exact calibration or standard reference copied from Step 6 section 7.4. |
| projects/L4-sandbox/design-calibration/07_implementation_plan_step_06_tasks_commit_boundaries.md | §7.1, §7.2, §7.4~§7.8, §7.11; CB-SBX-11B | not_run | Goal, predecessor, closure profiles, scope, tasks, batches, checks, and skeleton schema. |
| projects/L4-sandbox/design-calibration/07_implementation_plan_step_07_test_acceptance_gates.md | §6 and §8; CB-SBX-11B | not_run | Exact suite, AC, VETO, artifact, report, maturity, and review gate. |
| projects/L4-sandbox/design-calibration/07_implementation_plan_step_08_boundary_readiness_matrix.md | CB-SBX-11B readiness row | not_run | Config, environment, adapter, external dependency, and unavailable disposition. |
| projects/L4-sandbox/design-calibration/07_implementation_plan_step_09_boundary_risk_matrix.md | CB-SBX-11B risk row | not_run | Full Spike, Risk, OQ, closure, and safe routing. |
| projects/L4-sandbox/design-calibration/07_implementation_plan_step_10_boundary_control_matrix.md | CB-SBX-11B control row | not_run | Pause, rollback, invalidation, and recovery routing. |
| projects/L4-sandbox/design-calibration/07_implementation_plan_step_11_boundary_commit_message_matrix.md | CB-SBX-11B planned message and commit timing rows | not_run | Exact title, summary, body groups, evidence references, and commit prohibition. |
| projects/L4-sandbox/design-calibration/07_implementation_plan_step_11_review_delivery_audit.md | CB-SBX-11B review and delivery rows | not_run | Independent review, worktree protection, delivery, and handoff discipline. |
| standards/document/代码实施台账与门禁规范.md | project ledger, boundary ledger, nine Gate types, blockers, Commit Gate, and Handoff Gate | not_run | State values and recovery contract. |
| standards/document/设计真相源闭环与可落码性标准.md | boundary codeability and design writeback rules | not_run | Implementation must not invent missing design truth. |
| standards/document/全局项目依赖关系与裁剪规则.md | L4 Sandbox dependency direction and sibling-repository trimming | not_run | Only the allowed core dependency may be compile-time; adjacent products remain ports, events, handoffs, or fakes. |
| standards/document/子项目目录与代码文件组织规范.md | workspace, crate, binary, scripts, artifacts, reports, and implementation-ledger layout | not_run | Directory and code-file organization authority. |
| standards/coding/rust.md | applicable Rust source, tests, formatting, lint, and naming rules | not_run | Target-repository rules may add stricter requirements after repository creation. |

## Allowed Scope

| type | path_or_rule | status |
|---|---|---|
| allowed_path_or_rule | `crates/application/src/{jobs,services,ports,repositories}.rs` | planned |
| allowed_path_or_rule | `crates/infra/src/{publishers,handoff_adapters,backend_capability_adapters,truth_repositories,fakes}.rs` | planned |
| allowed_path_or_rule | `crates/jobs/src/{event_relay_publish,reference_refresh,backend_capability_refresh,handoff_retry,bin/**}.rs` | planned |
| allowed_path_or_rule | `tests/{service,integration}/**` | planned |
| included_behavior | `DEL-SBX-CODE-004`;`DEL-SBX-CODE-005`;`DEL-SBX-CODE-008`;`DEL-SBX-CODE-009`;`DEL-SBX-CODE-010`;`DEL-SBX-CODE-011`;`DEL-SBX-CODE-012`;`DEL-SBX-ADP-001`;Jobs 1~4: publish relay、reference refresh、capability refresh、handoff retry | planned |
| boundary_goal | 打通relay / reference / capability / handoff维护jobs。 | planned |

## Forbidden Scope

| rule | status | failure_action |
|---|---|---|
| cleanup / release;projection / reconciliation;source truth rewrite;real scheduler | active | block_scope_gate; remove the change or reopen design |
| reaper / cleanup / projection;source truth repair;real scheduler | active | block_scope_gate; do not stage or commit |
| Do not implement tools semantic execution, runtime agent-loop orchestration, or member lifecycle orchestration inside Sandbox. | active | block_scope_gate; return the concern to its owning project |
| Do not use latest paths, static evidence aliases, prefilled Passed or acceptance decisions, raw secret or process bodies, or unrelated user changes. | active | block_evidence_or_worktree_gate; preserve safe failure material |

## Tasks And Batches

### Tasks

| task_id | order | implementation_action | input | completion_criterion |
|---|---|---|---|---|
| `IMPL-SBX-11-03` | 3 | 编写publish / reference / capability / handoff四jobs及binary | Jobs 1~4 | bounded、no rollback、no core repair |

### Batches

| batch_id | goal | input_to_output | expected_size | post_batch_check | commit_relation |
|---|---|---|---|---|---|
| `BATCH-SBX-11B-01` | relay publish job | stored relay -> publish / report | 200~300 | JOB-001;terminal / retry / duplicate | one commit after every batch passes |
| `BATCH-SBX-11B-02` | reference / capability refresh | typed scope -> marker / report | 200~300 | JOB-002/003;cursor / no boundary create | one commit after every batch passes |
| `BATCH-SBX-11B-03` | handoff retry | retryable selection -> outcome / report | 200~300 | JOB-004;no capture rollback | one commit after every batch passes |
| `BATCH-SBX-11B-04` | four job binaries | service set -> input / output wiring | 150~250 | entry job tests / bounded page | one commit after every batch passes |

Subfunction grouping: relay publish + ref / capability refresh + handoff retry + binaries

Same-commit cause: 四个collaboration jobs都只推进formal marker / relay / handoff owner并共享page / report

Verification closure: JOB-001~004 / no rollback

Explicitly excluded: cleanup / projection

## Activation Readiness

| dimension | planned_requirement | actual_status |
|---|---|---|
| config_and_source | I052~I064 /I076~I078;registered relay /context /capability /handoff refs | not_run |
| environment_and_adapter | ENV-02 deterministic jobs;ENV-03 controlled seam;ENV-04 replay simulation适用 | not_run |
| external_and_tooling | manual job entry、publisher /resolver /handoff fake、bounded report | not_run |
| unavailable_disposition | adapter failure写partial /failed,no rollback /no core repair;不要求real scheduler | not_run |
| boundary_specific_activation | bounded selection / page / retry profiles稳定 | not_run |

## Design Closure And Risk

| field | planned_value | actual_status |
|---|---|---|
| closure_profiles | collaboration jobs;BASE+TXN+JOB+RELAY | not_run |
| applicable_experience | maintenance typed output;bounded selection;reference cursor;publisher / handoff outcome;report refs;no rollback | not_run |
| formal_evidence_location | `03`§8.4 / §10~§12;`05`JOB-001~004 | not_run |
| explicit_non_applicability | projection rebuild / release不适用:四jobs只推进marker / relay / handoff | not_run |
| design_level_conclusion | `passed_design`;partial failure不可隐藏 | design_record_only |
| activation_or_design_closure | relay /reference /capability /handoff job target、partial report与no-rollback /no-repair闭合 | not_run |
| safe_route_if_open_or_triggered | real target不作为P0-C前置;adapter failure写partial /failed,不得修source或隐藏failed item | not_run |

| reference_type | full_references | execution_status |
|---|---|---|
| spike | `SP-SBX-IMP-007`; `SP-SBX-IMP-011` | not_run |
| risk | `R-SBX-IMP-003`; `R-SBX-IMP-005`; `R-SBX-IMP-008`; `R-SBX-IMP-009`; `R-SBX-IMP-010`; `R-SBX-IMP-011`; `R-SBX-IMP-019`; `R-SBX-IMP-020` | not_run |
| open_question | `OQ-SBX-IMP-016` | not_run |

## Required Checks

| check_id | command_or_assertion | required_status | actual_status | evidence |
|---|---|---|---|---|
| CHK-ACTIVATION | Close predecessor CB-SBX-11A; bounded selection / page / retry profiles稳定 | closed_or_formal_blocked | not_run | absent |
| CHK-DESIGN | collaboration jobs;BASE+TXN+JOB+RELAY; closure evidence: `03`§8.4 / §10~§12;`05`JOB-001~004; repeat-check rule: `passed_design`;partial failure不可隐藏 | design_consistent | not_run | absent |
| CHK-SCOPE | Allowed: `crates/application/src/{jobs,services,ports,repositories}.rs`;`crates/infra/src/{publishers,handoff_adapters,backend_capability_adapters,truth_repositories,fakes}.rs`;`crates/jobs/src/{event_relay_publish,reference_refresh,backend_capability_refresh,handoff_retry,bin/**}.rs`;`tests/{service,integration}/**`; included behavior: `DEL-SBX-CODE-004`;`DEL-SBX-CODE-005`;`DEL-SBX-CODE-008`;`DEL-SBX-CODE-009`;`DEL-SBX-CODE-010`;`DEL-SBX-CODE-011`;`DEL-SBX-CODE-012`;`DEL-SBX-ADP-001`;Jobs 1~4: publish relay、reference refresh、capability refresh、handoff retry; forbidden: cleanup / release;projection / reconciliation;source truth rewrite;real scheduler; reaper / cleanup / projection;source truth repair;real scheduler | scope_clean | not_run | absent |
| CHK-WORKTREE | Record target root, HEAD, initial git status, local identity, user-owned changes, and staged-file ownership. | worktree_recorded | not_run | absent |
| CHK-BUILD | `JOB-001~004`,`JOB-011/012`;bounded page、per-item UoW、duplicate owner calls=0、relay / handoff no-rollback、partial refs | pass_or_formal_allowed_status | not_run | absent |
| CHK-TEST | SUITE-SBX-006 /012及005 /007~010适用:JOB-001~004 /011 /012;bounded page、per-item UoW、duplicate owner calls=0、relay / handoff no-rollback、honest partial | all_mandatory_pass | not_run | absent |
| CHK-AC-VETO | AC-SBX-018~023 /030 /032~041;VETO-SBX-005 /006 /009~013 /016 | assertions_present_and_no_triggered_veto | not_run | absent |
| CHK-ARTIFACT | G1 collaboration job / read / relay / replay / consistency / config / audit raw | maturity_contract_satisfied | not_run | absent |
| CHK-REPORT | job / operations reports、targeted pairing / redaction report | paired_report_or_G0_reason | not_run | absent |
| CHK-EVIDENCE-MATURITY | G1;scope expansion、整批重复副作用、refresh建boundary / policy truth、handoff回滚source或partial隐藏即不提交 | status_fidelity_and_safe_failure | not_run | absent |
| CHK-READINESS | Config/source: I052~I064 /I076~I078;registered relay /context /capability /handoff refs; ENV/adapter: ENV-02 deterministic jobs;ENV-03 controlled seam;ENV-04 replay simulation适用; external/tool: manual job entry、publisher /resolver /handoff fake、bounded report; unavailable route: adapter failure写partial /failed,no rollback /no core repair;不要求real scheduler | ready_or_formally_blocked | not_run | absent |
| CHK-RISK | Close or confirm before Activation/Design: relay /reference /capability /handoff job target、partial report与no-rollback /no-repair闭合; route: real target不作为P0-C前置;adapter failure写partial /failed,不得修source或隐藏failed item | closed_or_routed | not_run | absent |
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

Boundary artifact contract: G1 collaboration job / read / relay / replay / consistency / config / audit raw

Boundary report contract: job / operations reports、targeted pairing / redaction report

Planned evidence/review reference: job / operations reports及pairing / redaction

Commit is allowed only when: JOB-001~004、bounded page、per-item UoW、duplicate call=0、no rollback和honest partial通过

Forbidden proof substitution: cleanup / projection /source repair

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
| planned_commit_title | `feat(jobs): run collaboration maintenance jobs safely` |
| planned_commit_summary | `Run collaboration maintenance jobs without source repair for CB-SBX-11B.` |
| planned_body_groups | `Relay, reference, and capability maintenance jobs:`;`Handoff retry jobs:`;`Job binaries and partial-report verification:` |
| same_commit_cause | 四个协作job只推进formal relay / ref / handoff owner并共享page、UoW和report |
| planned_footer | `Co-Authored-By: Codex <noreply@openai.com>` |
| staged_files_checked | `not_run` |
| commit_message_checked | `not_run` |
| committed_hash | `not_committed` |
| committed_message | `not_committed` |
| post_commit_status | `not_run` |

## Review Record

| field | planned_or_actual_value |
|---|---|
| required_review_responsibility | jobs / relay / handoff / reference reviewer核bounded selection、per-item UoW与owner call budget |
| type_and_scope_review | `feat(jobs)`对应collaboration jobs |
| body_group_review | relay / refresh / handoff / binaries共享bounded job协议 |
| review_and_evidence_discipline | jobs + relay + handoff + reference |
| design_discipline_record | passed_design |
| future_repeat_check | no source repair / owner call budget |
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

Expected successor after a real Handoff Gate pass: `CB-SBX-11C`. The project ledger alone activates that successor.

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
