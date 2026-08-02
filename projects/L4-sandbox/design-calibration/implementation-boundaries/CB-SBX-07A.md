# CB-SBX-07A implementation ledger

> Created by L4-sandbox Step 13 from reviewed Step 6~11 matrices.
> This is a planned recovery contract, not proof of implementation, test execution, evidence, review, acceptance, or authorization.

| field | value |
|---|---|
| project | `L4-sandbox` |
| boundary_id | `CB-SBX-07A` |
| phase | `PH-07` |
| verifiable_goal | 打通守卫后的controlled run launch truth。 |
| direct_predecessor | `CB-SBX-06B` |
| design_baseline | `not_fixed` |
| implementation_repo | `/home/aris/Projects/quantalithos-sandbox (absent)` |
| status | `planned` |
| next_allowed_action | `wait_until_current` |
| current_identity | no; wait for project-ledger activation |
| task_ids | `IMPL-SBX-07-01` |
| batch_ids | `BATCH-SBX-07A-01`; `BATCH-SBX-07A-02`; `BATCH-SBX-07A-03` |
| evidence_maturity | G1;guard任一不匹配仍launch、lease重算、duplicate relaunch、rollback半状态或tool semantics进入scope即不提交 |
| implementation_started | `no` |

## Required Reads

| document | required_section | status | notes |
|---|---|---|---|
| projects/L4-sandbox/07-实施计划.md | §1, §3, §5~§12 and this exact boundary row in §6 | not_run | Formal implementation authority and control rules. |
| projects/L4-sandbox/03-详细设计.md | §6 run / §7.3 Command 4 / §8.5 run flow / §9 run / §10~§12 | not_run | Exact owner reading copied from Step 6 section 7.4. |
| projects/L4-sandbox/04-配置设计.md | I041/I065 | not_run | Exact owner reading copied from Step 6 section 7.4. |
| projects/L4-sandbox/05-测试方案.md | CMD-007/008 | not_run | Exact owner reading copied from Step 6 section 7.4. |
| projects/L4-sandbox/06-验收标准.md | PG-SBX-004 | not_run | Exact owner reading copied from Step 6 section 7.4. |
| projects/L4-sandbox/design-calibration/03_ddd_step_06_object_contracts.md | `03_ddd_step_06_object_contracts.md` | not_run | Exact calibration or standard reference copied from Step 6 section 7.4. |
| projects/L4-sandbox/design-calibration/03_ddd_step_07_trait_port_adapter_contracts.md | `03_ddd_step_07_trait_port_adapter_contracts.md` | not_run | Exact calibration or standard reference copied from Step 6 section 7.4. |
| projects/L4-sandbox/design-calibration/03_ddd_step_09_function_flows.md | `03_ddd_step_09_function_flows.md` | not_run | Exact calibration or standard reference copied from Step 6 section 7.4. |
| projects/L4-sandbox/design-calibration/03_ddd_step_11_persistence_transaction_consistency.md | `03_ddd_step_11_persistence_transaction_consistency.md` | not_run | Exact calibration or standard reference copied from Step 6 section 7.4. |
| projects/L4-sandbox/design-calibration/04_config_step_07_config_items.md | `04_config_step_07_config_items.md` | not_run | Exact calibration or standard reference copied from Step 6 section 7.4. |
| projects/L4-sandbox/design-calibration/07_implementation_plan_step_06_tasks_commit_boundaries.md | §7.1, §7.2, §7.4~§7.8, §7.11; CB-SBX-07A | not_run | Goal, predecessor, closure profiles, scope, tasks, batches, checks, and skeleton schema. |
| projects/L4-sandbox/design-calibration/07_implementation_plan_step_07_test_acceptance_gates.md | §6 and §8; CB-SBX-07A | not_run | Exact suite, AC, VETO, artifact, report, maturity, and review gate. |
| projects/L4-sandbox/design-calibration/07_implementation_plan_step_08_boundary_readiness_matrix.md | CB-SBX-07A readiness row | not_run | Config, environment, adapter, external dependency, and unavailable disposition. |
| projects/L4-sandbox/design-calibration/07_implementation_plan_step_09_boundary_risk_matrix.md | CB-SBX-07A risk row | not_run | Full Spike, Risk, OQ, closure, and safe routing. |
| projects/L4-sandbox/design-calibration/07_implementation_plan_step_10_boundary_control_matrix.md | CB-SBX-07A control row | not_run | Pause, rollback, invalidation, and recovery routing. |
| projects/L4-sandbox/design-calibration/07_implementation_plan_step_11_boundary_commit_message_matrix.md | CB-SBX-07A planned message and commit timing rows | not_run | Exact title, summary, body groups, evidence references, and commit prohibition. |
| projects/L4-sandbox/design-calibration/07_implementation_plan_step_11_review_delivery_audit.md | CB-SBX-07A review and delivery rows | not_run | Independent review, worktree protection, delivery, and handoff discipline. |
| standards/document/代码实施台账与门禁规范.md | project ledger, boundary ledger, nine Gate types, blockers, Commit Gate, and Handoff Gate | not_run | State values and recovery contract. |
| standards/document/设计真相源闭环与可落码性标准.md | boundary codeability and design writeback rules | not_run | Implementation must not invent missing design truth. |
| standards/document/全局项目依赖关系与裁剪规则.md | L4 Sandbox dependency direction and sibling-repository trimming | not_run | Only the allowed core dependency may be compile-time; adjacent products remain ports, events, handoffs, or fakes. |
| standards/document/子项目目录与代码文件组织规范.md | workspace, crate, binary, scripts, artifacts, reports, and implementation-ledger layout | not_run | Directory and code-file organization authority. |
| standards/coding/rust.md | applicable Rust source, tests, formatting, lint, and naming rules | not_run | Target-repository rules may add stricter requirements after repository creation. |

## Allowed Scope

| type | path_or_rule | status |
|---|---|---|
| allowed_path_or_rule | `crates/contracts/src/{commands,events,views}.rs` | planned |
| allowed_path_or_rule | `crates/domain/src/{run,relay,audit,errors}.rs` | planned |
| allowed_path_or_rule | `crates/application/src/{commands,services,ports,repositories}.rs` | planned |
| allowed_path_or_rule | `crates/infra/src/{isolation_backend_adapters,truth_repositories,fakes}.rs` | planned |
| allowed_path_or_rule | `crates/api/src/command_handlers.rs` | planned |
| allowed_path_or_rule | `crates/worker/src/fulfillment_worker.rs` | planned |
| allowed_path_or_rule | `tests/{domain,service,integration}/**` | planned |
| included_behavior | `DEL-SBX-CODE-002`;`DEL-SBX-CODE-003`;`DEL-SBX-CODE-004`;`DEL-SBX-CODE-005`;`DEL-SBX-CODE-006`;`DEL-SBX-CODE-007`;`DEL-SBX-CODE-009`;`DEL-SBX-CODE-010`;`DEL-SBX-CODE-011`;`DEL-SBX-CODE-012`;`DEL-SBX-ADP-001`适用增量;Command 4、`SandboxRunChanged`、run truth及boundary -> handle -> persisted lease exact reads + Accepted policy guarded backend launch | planned |
| boundary_goal | 打通守卫后的controlled run launch truth。 | planned |

## Forbidden Scope

| rule | status | failure_action |
|---|---|---|
| tool semantic execution;agent loop;lease profile / window重算;capture / handoff;real candidate | active | block_scope_gate; remove the change or reopen design |
| tool semantics / agent loop、lease profile / window重算、capture、real candidate | active | block_scope_gate; do not stage or commit |
| Do not implement tools semantic execution, runtime agent-loop orchestration, or member lifecycle orchestration inside Sandbox. | active | block_scope_gate; return the concern to its owning project |
| Do not use latest paths, static evidence aliases, prefilled Passed or acceptance decisions, raw secret or process bodies, or unrelated user changes. | active | block_evidence_or_worktree_gate; preserve safe failure material |

## Tasks And Batches

### Tasks

| task_id | order | implementation_action | input | completion_criterion |
|---|---|---|---|---|
| `IMPL-SBX-07-01` | 1 | 编写Command 4 / Run event / run truth、boundary -> handle -> persisted lease exact reads和Accepted policy guarded launch flow | `StartControlledExecutionRun`;PG-SBX-004 | mismatch / inactive / expired / non-Accepted均0 call,duplicate不relaunch,不得重算lease window |

### Batches

| batch_id | goal | input_to_output | expected_size | post_batch_check | commit_relation |
|---|---|---|---|---|---|
| `BATCH-SBX-07A-01` | run contract / state | formal run schema -> DTO / truth / event | 200~300 | state / redaction / source map | one commit after every batch passes |
| `BATCH-SBX-07A-02` | launch side effect | exact boundary / handle / lease / policy guard + backend port -> UoW / fake / service | 200~300 | mismatch / expired / denied call=0;failure / replay | one commit after every batch passes |
| `BATCH-SBX-07A-03` | run entry tests | service result -> API / fulfillment mapping | 150~250 | CMD-007 /008;race / rollback | one commit after every batch passes |

Subfunction grouping: run carrier / truth + boundary / handle / persisted lease / policy guard + entry

Same-commit cause: run事实只在四类前序truth精确匹配且backend outcome与UoW同组时成立

Verification closure: mismatch / expired / denied call=0;state / replay / race

Explicitly excluded: lease重算 / capture / agent loop

## Activation Readiness

| dimension | planned_requirement | actual_status |
|---|---|---|
| config_and_source | I041 /I042 /I065 + persisted boundary /handle /lease +Accepted policy refs | not_run |
| environment_and_adapter | ENV-02 non-executing launch outcome fake;ENV-03 lifecycle seam仅补强 | not_run |
| external_and_tooling | backend port call trace、exact four-way guard、worker fixture | not_run |
| unavailable_disposition | mismatch /inactive /expired /non-Accepted call=0;不重算lease /不实现tool semantics | not_run |
| boundary_specific_activation | boundary / handle / persisted lease / policy exact reads与clock可用 | not_run |

## Design Closure And Risk

| field | planned_value | actual_status |
|---|---|---|
| closure_profiles | run / backend side effect;BASE+CONTRACT+STATE+TXN | not_run |
| applicable_experience | public intent;exact boundary / handle / lease / policy reads;active / expiry guard;adapter outcome;run initial / terminal state;duplicate no-relaunch;event payload | not_run |
| formal_evidence_location | `03`§6~§12;`04`I065;`05`CMD-007/008;`06`PG-004 | not_run |
| explicit_non_applicability | capture / lease selection / agent loop不适用:run只校验前序lease且不解释tool semantics | not_run |
| design_level_conclusion | `passed_design`;四类guard任一失败backend call=0 | design_record_only |
| activation_or_design_closure | exact boundary /handle /lease active guard、Accepted policy、non-executing launch outcome与owner-call trace闭合 | not_run |
| safe_route_if_open_or_triggered | mismatch /expiry /non-Accepted时launch=0;不得重算lease、scan latest或实现tool semantics | not_run |

| reference_type | full_references | execution_status |
|---|---|---|
| spike | `SP-SBX-IMP-006`; `SP-SBX-IMP-007` | not_run |
| risk | `R-SBX-IMP-003`; `R-SBX-IMP-005`; `R-SBX-IMP-007`; `R-SBX-IMP-008`; `R-SBX-IMP-011`; `R-SBX-IMP-019`; `R-SBX-IMP-020` | not_run |
| open_question | none_by_boundary_matrix | not_run |

## Required Checks

| check_id | command_or_assertion | required_status | actual_status | evidence |
|---|---|---|---|---|
| CHK-ACTIVATION | Close predecessor CB-SBX-06B; boundary / handle / persisted lease / policy exact reads与clock可用 | closed_or_formal_blocked | not_run | absent |
| CHK-DESIGN | run / backend side effect;BASE+CONTRACT+STATE+TXN; closure evidence: `03`§6~§12;`04`I065;`05`CMD-007/008;`06`PG-004; repeat-check rule: `passed_design`;四类guard任一失败backend call=0 | design_consistent | not_run | absent |
| CHK-SCOPE | Allowed: `crates/contracts/src/{commands,events,views}.rs`;`crates/domain/src/{run,relay,audit,errors}.rs`;`crates/application/src/{commands,services,ports,repositories}.rs`;`crates/infra/src/{isolation_backend_adapters,truth_repositories,fakes}.rs`;`crates/api/src/command_handlers.rs`;`crates/worker/src/fulfillment_worker.rs`;`tests/{domain,service,integration}/**`; included behavior: `DEL-SBX-CODE-002`;`DEL-SBX-CODE-003`;`DEL-SBX-CODE-004`;`DEL-SBX-CODE-005`;`DEL-SBX-CODE-006`;`DEL-SBX-CODE-007`;`DEL-SBX-CODE-009`;`DEL-SBX-CODE-010`;`DEL-SBX-CODE-011`;`DEL-SBX-CODE-012`;`DEL-SBX-ADP-001`适用增量;Command 4、`SandboxRunChanged`、run truth及boundary -> handle -> persisted lease exact reads + Accepted policy guarded backend launch; forbidden: tool semantic execution;agent loop;lease profile / window重算;capture / handoff;real candidate; tool semantics / agent loop、lease profile / window重算、capture、real candidate | scope_clean | not_run | absent |
| CHK-WORKTREE | Record target root, HEAD, initial git status, local identity, user-owned changes, and staged-file ownership. | worktree_recorded | not_run | absent |
| CHK-BUILD | `TC-SBX-CMD-007`;`TC-SBX-CMD-008`;Preparing / Running / terminal;boundary / handle / lease mismatch、inactive / expired lease或non-Accepted policy时call=0;launch failed before accepted、duplicate no-relaunch、rollback / race tests | pass_or_formal_allowed_status | not_run | absent |
| CHK-TEST | SUITE-SBX-002 /004 /008 /010及007 /009适用:CMD-007/008、STA-013 run slice、TXN / RACE / ERR;boundary / handle / persisted lease / policy exact guard、duplicate no-relaunch | all_mandatory_pass | not_run | absent |
| CHK-AC-VETO | AC-SBX-016 /019 /029 /032~041适用;VETO-SBX-001~006 /010 /013 /016 | assertions_present_and_no_triggered_veto | not_run | absent |
| CHK-ARTIFACT | G1 run / protocol / replay / consistency / error / audit raw与adapter call trace | maturity_contract_satisfied | not_run | absent |
| CHK-REPORT | suite reports、targeted redaction / pairing report | paired_report_or_G0_reason | not_run | absent |
| CHK-EVIDENCE-MATURITY | G1;guard任一不匹配仍launch、lease重算、duplicate relaunch、rollback半状态或tool semantics进入scope即不提交 | status_fidelity_and_safe_failure | not_run | absent |
| CHK-READINESS | Config/source: I041 /I042 /I065 + persisted boundary /handle /lease +Accepted policy refs; ENV/adapter: ENV-02 non-executing launch outcome fake;ENV-03 lifecycle seam仅补强; external/tool: backend port call trace、exact four-way guard、worker fixture; unavailable route: mismatch /inactive /expired /non-Accepted call=0;不重算lease /不实现tool semantics | ready_or_formally_blocked | not_run | absent |
| CHK-RISK | Close or confirm before Activation/Design: exact boundary /handle /lease active guard、Accepted policy、non-executing launch outcome与owner-call trace闭合; route: mismatch /expiry /non-Accepted时launch=0;不得重算lease、scan latest或实现tool semantics | closed_or_routed | not_run | absent |
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

Boundary artifact contract: G1 run / protocol / replay / consistency / error / audit raw与adapter call trace

Boundary report contract: suite reports、targeted redaction / pairing report

Planned evidence/review reference: run / replay / consistency / audit raw与suite / pairing reports

Commit is allowed only when: exact boundary / handle / persisted lease / policy guard、duplicate no-relaunch和UoW通过

Forbidden proof substitution: tool semantics、agent loop、real candidate

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
| planned_commit_title | `feat(run): launch guarded controlled runs` |
| planned_commit_summary | `Launch controlled runs only after exact persisted guards for CB-SBX-07A.` |
| planned_body_groups | `Run contracts and owner truth:`;`Boundary, handle, lease, and policy guards:`;`Worker and API entry with replay verification:` |
| same_commit_cause | run truth只在四类前序truth精确匹配且adapter outcome与UoW同组时成立 |
| planned_footer | `Co-Authored-By: Codex <noreply@openai.com>` |
| staged_files_checked | `not_run` |
| commit_message_checked | `not_run` |
| committed_hash | `not_committed` |
| committed_message | `not_committed` |
| post_commit_status | `not_run` |

## Review Record

| field | planned_or_actual_value |
|---|---|
| required_review_responsibility | run / boundary / policy / backend / transaction reviewer核四方guard与owner truth |
| type_and_scope_review | `feat(run)`对应controlled launch |
| body_group_review | truth / guards / entry共同形成唯一run事实 |
| review_and_evidence_discipline | run + boundary + policy + backend |
| design_discipline_record | passed_design |
| future_repeat_check | exact persisted guards / no relaunch |
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

Expected successor after a real Handoff Gate pass: `CB-SBX-07B`. The project ledger alone activates that successor.

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
