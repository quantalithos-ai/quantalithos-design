# CB-SBX-05A implementation ledger

> Created by L4-sandbox Step 13 from reviewed Step 6~11 matrices.
> This is a planned recovery contract, not proof of implementation, test execution, evidence, review, acceptance, or authorization.

| field | value |
|---|---|
| project | `L4-sandbox` |
| boundary_id | `CB-SBX-05A` |
| phase | `PH-05` |
| verifiable_goal | 固定active execution identity前置、四维coherent isolation boundary、workspace requirement、handle和lease的contract / domain闭环。 |
| direct_predecessor | `CB-SBX-04B` |
| design_baseline | `not_fixed` |
| implementation_repo | `/home/aris/Projects/quantalithos-sandbox (absent)` |
| status | `planned` |
| next_allowed_action | `wait_until_current` |
| current_identity | no; wait for project-ledger activation |
| task_ids | `IMPL-SBX-05-01`; `IMPL-SBX-05-02` |
| batch_ids | `BATCH-SBX-05A-01`; `BATCH-SBX-05A-02` |
| evidence_maturity | G1;active identity或required dimension缺失、跨代、partial handle、policy反向输入或weak variant即不提交;P0-Q保持NotEvaluated |
| implementation_started | `no` |

## Required Reads

| document | required_section | status | notes |
|---|---|---|---|
| projects/L4-sandbox/07-实施计划.md | §1, §3, §5~§12 and this exact boundary row in §6 | not_run | Formal implementation authority and control rules. |
| projects/L4-sandbox/03-详细设计.md | §6 boundary objects / §7.3 Command 2 / §9 boundary states / §11 | not_run | Exact owner reading copied from Step 6 section 7.4. |
| projects/L4-sandbox/05-测试方案.md | CMD-003/004,STA-004~009 | not_run | Exact owner reading copied from Step 6 section 7.4. |
| projects/L4-sandbox/06-验收标准.md | PG-SBX-002 | not_run | Exact owner reading copied from Step 6 section 7.4. |
| projects/L4-sandbox/design-calibration/03_ddd_step_06_object_contracts.md | `03_ddd_step_06_object_contracts.md` | not_run | Exact calibration or standard reference copied from Step 6 section 7.4. |
| projects/L4-sandbox/design-calibration/03_ddd_step_08_protocol_contracts.md | `03_ddd_step_08_protocol_contracts.md` | not_run | Exact calibration or standard reference copied from Step 6 section 7.4. |
| projects/L4-sandbox/design-calibration/03_ddd_step_10_state_matrix.md | `03_ddd_step_10_state_matrix.md` | not_run | Exact calibration or standard reference copied from Step 6 section 7.4. |
| projects/L4-sandbox/design-calibration/04_config_step_06_environment_profiles_matrix.md | `04_config_step_06_environment_profiles_matrix.md` | not_run | Exact calibration or standard reference copied from Step 6 section 7.4. |
| projects/L4-sandbox/design-calibration/07_implementation_plan_step_06_tasks_commit_boundaries.md | §7.1, §7.2, §7.4~§7.8, §7.11; CB-SBX-05A | not_run | Goal, predecessor, closure profiles, scope, tasks, batches, checks, and skeleton schema. |
| projects/L4-sandbox/design-calibration/07_implementation_plan_step_07_test_acceptance_gates.md | §6 and §8; CB-SBX-05A | not_run | Exact suite, AC, VETO, artifact, report, maturity, and review gate. |
| projects/L4-sandbox/design-calibration/07_implementation_plan_step_08_boundary_readiness_matrix.md | CB-SBX-05A readiness row | not_run | Config, environment, adapter, external dependency, and unavailable disposition. |
| projects/L4-sandbox/design-calibration/07_implementation_plan_step_09_boundary_risk_matrix.md | CB-SBX-05A risk row | not_run | Full Spike, Risk, OQ, closure, and safe routing. |
| projects/L4-sandbox/design-calibration/07_implementation_plan_step_10_boundary_control_matrix.md | CB-SBX-05A control row | not_run | Pause, rollback, invalidation, and recovery routing. |
| projects/L4-sandbox/design-calibration/07_implementation_plan_step_11_boundary_commit_message_matrix.md | CB-SBX-05A planned message and commit timing rows | not_run | Exact title, summary, body groups, evidence references, and commit prohibition. |
| projects/L4-sandbox/design-calibration/07_implementation_plan_step_11_review_delivery_audit.md | CB-SBX-05A review and delivery rows | not_run | Independent review, worktree protection, delivery, and handoff discipline. |
| standards/document/代码实施台账与门禁规范.md | project ledger, boundary ledger, nine Gate types, blockers, Commit Gate, and Handoff Gate | not_run | State values and recovery contract. |
| standards/document/设计真相源闭环与可落码性标准.md | boundary codeability and design writeback rules | not_run | Implementation must not invent missing design truth. |
| standards/document/全局项目依赖关系与裁剪规则.md | L4 Sandbox dependency direction and sibling-repository trimming | not_run | Only the allowed core dependency may be compile-time; adjacent products remain ports, events, handoffs, or fakes. |
| standards/document/子项目目录与代码文件组织规范.md | workspace, crate, binary, scripts, artifacts, reports, and implementation-ledger layout | not_run | Directory and code-file organization authority. |
| standards/coding/rust.md | applicable Rust source, tests, formatting, lint, and naming rules | not_run | Target-repository rules may add stricter requirements after repository creation. |

## Allowed Scope

| type | path_or_rule | status |
|---|---|---|
| allowed_path_or_rule | `crates/contracts/src/{commands,events,views,errors}.rs` | planned |
| allowed_path_or_rule | `crates/domain/src/{boundary,reference,relay,audit,errors}.rs` | planned |
| allowed_path_or_rule | `tests/{contracts,domain}/**` | planned |
| included_behavior | `DEL-SBX-CODE-002`;`DEL-SBX-CODE-003`;`DEL-SBX-CODE-009`;`DEL-SBX-CODE-010`;`DEL-SBX-CODE-012`增量;`EstablishExecutionBoundary` carrier、`SandboxBoundaryChanged` payload、resource / filesystem / network / process四维隔离requirement、workspace requirement、decision / coherent set / handle / lease与STA-004~009 | planned |
| boundary_goal | 固定active execution identity前置、四维coherent isolation boundary、workspace requirement、handle和lease的contract / domain闭环。 | planned |

## Forbidden Scope

| rule | status | failure_action |
|---|---|---|
| backend call;application UoW;real candidate probe;policy / launch;cleanup release | active | block_scope_gate; remove the change or reopen design |
| adapter call、UoW、candidate probe、policy / launch / release | active | block_scope_gate; do not stage or commit |
| Do not implement tools semantic execution, runtime agent-loop orchestration, or member lifecycle orchestration inside Sandbox. | active | block_scope_gate; return the concern to its owning project |
| Do not use latest paths, static evidence aliases, prefilled Passed or acceptance decisions, raw secret or process bodies, or unrelated user changes. | active | block_evidence_or_worktree_gate; preserve safe failure material |

## Tasks And Batches

### Tasks

| task_id | order | implementation_action | input | completion_criterion |
|---|---|---|---|---|
| `IMPL-SBX-05-01` | 1 | 编写Command 2、boundary event和显式四维隔离requirement + workspace requirement / decision carrier | `EstablishExecutionBoundary`;PG-SBX-002 | accepted context / active identity、resource / fs / network / process / workspace、profile / template / generation字段齐全且无policy输入 |
| `IMPL-SBX-05-02` | 2 | 编写coherent set、handle / lease factory、STA-004~009和typed errors | boundary object contract | partial / weak状态不可构造;failed partial handle可诚实保存 |

### Batches

| batch_id | goal | input_to_output | expected_size | post_batch_check | commit_relation |
|---|---|---|---|---|---|
| `BATCH-SBX-05A-01` | isolation + workspace requirement contracts | request + service-injected source map -> DTO / payload / immutable requirement | 200~300 | CMD schema / body-free / no-policy-input checks | one commit after every batch passes |
| `BATCH-SBX-05A-02` | boundary state high risk | formal matrix -> decision / coherent truth / handle / lease / errors | 200~300 | STA-004~009;weak fallback / partial-handle honesty | one commit after every batch passes |

Subfunction grouping: active identity + four-dimension isolation / workspace requirement carrier + coherent boundary / handle / lease truth

Same-commit cause: accepted context / active identity、显式四维隔离要求 + workspace requirement、profile / template / generation、decision和owner state必须同步,防止policy反向依赖或partial / weak形态进入代码

Verification closure: CMD schema / STA / no-policy-input / weak-fallback

Explicitly excluded: backend side effect

## Activation Readiness

| dimension | planned_requirement | actual_status |
|---|---|---|
| config_and_source | I039 /I040 /I065 typed refs和generation source map | not_run |
| environment_and_adapter | ENV-02 contract /domain fixture;无backend call | not_run |
| external_and_tooling | active identity、four-dimension isolation + workspace requirement /template /lease constructor fixtures | not_run |
| unavailable_disposition | identity或任一required dimension缺失、weak variant为`wait_design`;P0-Q保持NotEvaluated | not_run |
| boundary_specific_activation | Context -> active Identity -> four-dimension isolation + workspace requirement -> Boundary顺序和carrier未漂移 | not_run |

## Design Closure And Risk

| field | planned_value | actual_status |
|---|---|---|
| closure_profiles | active identity + four-dimension isolation / workspace requirement state;BASE+CONTRACT+STATE | not_run |
| applicable_experience | DTO construction;accepted context / active identity;explicit four-dimension isolation + workspace requirement;profile / template / generation;handle / lease ref identity;state / error closure;no policy input | not_run |
| formal_evidence_location | `03`§6 / §7.3 / §9 / §11;`05`CMD / STA;`06`PG-002 | not_run |
| explicit_non_applicability | transaction / candidate不适用:仅定义P0-C contract-domain | not_run |
| design_level_conclusion | `passed_design`;partial / weak / policy-dependent variant不得私增 | design_record_only |
| activation_or_design_closure | active identity、four-dimension isolation + workspace requirement /template、handle /lease与state owner闭合;只消费抽象capability契约 | not_run |
| safe_route_if_open_or_triggered | P0-C schema缺口`wait_design`;candidate现实输入仅`disclosure_only`,不阻塞contract boundary也不构成P0-Q证明 | not_run |

| reference_type | full_references | execution_status |
|---|---|---|
| spike | `SP-SBX-IMP-006` | not_run |
| risk | `R-SBX-IMP-003`; `R-SBX-IMP-007`; `R-SBX-IMP-019`; `R-SBX-IMP-020` | not_run |
| open_question | `OQ-SBX-IMP-007` | not_run |

## Required Checks

| check_id | command_or_assertion | required_status | actual_status | evidence |
|---|---|---|---|---|
| CHK-ACTIVATION | Close predecessor CB-SBX-04B; Context -> active Identity -> four-dimension isolation + workspace requirement -> Boundary顺序和carrier未漂移 | closed_or_formal_blocked | not_run | absent |
| CHK-DESIGN | active identity + four-dimension isolation / workspace requirement state;BASE+CONTRACT+STATE; closure evidence: `03`§6 / §7.3 / §9 / §11;`05`CMD / STA;`06`PG-002; repeat-check rule: `passed_design`;partial / weak / policy-dependent variant不得私增 | design_consistent | not_run | absent |
| CHK-SCOPE | Allowed: `crates/contracts/src/{commands,events,views,errors}.rs`;`crates/domain/src/{boundary,reference,relay,audit,errors}.rs`;`tests/{contracts,domain}/**`; included behavior: `DEL-SBX-CODE-002`;`DEL-SBX-CODE-003`;`DEL-SBX-CODE-009`;`DEL-SBX-CODE-010`;`DEL-SBX-CODE-012`增量;`EstablishExecutionBoundary` carrier、`SandboxBoundaryChanged` payload、resource / filesystem / network / process四维隔离requirement、workspace requirement、decision / coherent set / handle / lease与STA-004~009; forbidden: backend call;application UoW;real candidate probe;policy / launch;cleanup release; adapter call、UoW、candidate probe、policy / launch / release | scope_clean | not_run | absent |
| CHK-WORKTREE | Record target root, HEAD, initial git status, local identity, user-owned changes, and staged-file ownership. | worktree_recorded | not_run | absent |
| CHK-BUILD | `CMD-003/004`,`STA-004~009`,`ERR-006/007/027/029/030`;accepted context / active identity /四维隔离requirement + workspace requirement / profile / template / generation构造闭环、all-or-nothing、illegal state、weak-fallback factory tests完成后 | pass_or_formal_allowed_status | not_run | absent |
| CHK-TEST | SUITE-SBX-002 /004 contract-domain slice:CMD-003/004、STA-004~009、ERR-006/007/027/029/030;active identity、四维隔离 + workspace requirement、coherent set、handle / lease、weak fallback factory | all_mandatory_pass | not_run | absent |
| CHK-AC-VETO | AC-SBX-009~011 /027 /032~041适用;VETO-SBX-001~003 /005 /006 /010 /016 | assertions_present_and_no_triggered_veto | not_run | absent |
| CHK-ARTIFACT | G1 boundary state / protocol / error raw;无qualification result | maturity_contract_satisfied | not_run | absent |
| CHK-REPORT | suite reports与targeted redaction report | paired_report_or_G0_reason | not_run | absent |
| CHK-EVIDENCE-MATURITY | G1;active identity或required dimension缺失、跨代、partial handle、policy反向输入或weak variant即不提交;P0-Q保持NotEvaluated | status_fidelity_and_safe_failure | not_run | absent |
| CHK-READINESS | Config/source: I039 /I040 /I065 typed refs和generation source map; ENV/adapter: ENV-02 contract /domain fixture;无backend call; external/tool: active identity、four-dimension isolation + workspace requirement /template /lease constructor fixtures; unavailable route: identity或任一required dimension缺失、weak variant为`wait_design`;P0-Q保持NotEvaluated | ready_or_formally_blocked | not_run | absent |
| CHK-RISK | Close or confirm before Activation/Design: active identity、four-dimension isolation + workspace requirement /template、handle /lease与state owner闭合;只消费抽象capability契约; route: P0-C schema缺口`wait_design`;candidate现实输入仅`disclosure_only`,不阻塞contract boundary也不构成P0-Q证明 | closed_or_routed | not_run | absent |
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

Boundary artifact contract: G1 boundary state / protocol / error raw;无qualification result

Boundary report contract: suite reports与targeted redaction report

Planned evidence/review reference: boundary state / protocol / error reports与redaction report

Commit is allowed only when: active identity、四维隔离 + workspace requirement、coherent set、handle / lease和weak rejection通过

Forbidden proof substitution: backend side effect、P0-Q资格

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
| planned_commit_title | `feat(boundary): add coherent execution boundary contracts` |
| planned_commit_summary | `Add the complete coherent boundary contract for CB-SBX-05A.` |
| planned_body_groups | `Active identity and boundary requirement carriers:`;`Coherent boundary, handle, and lease truth:` |
| same_commit_cause | active identity、四维隔离、workspace requirement、generation、handle和lease必须同步闭合 |
| planned_footer | `Co-Authored-By: Codex <noreply@openai.com>` |
| staged_files_checked | `not_run` |
| commit_message_checked | `not_run` |
| committed_hash | `not_committed` |
| committed_message | `not_committed` |
| post_commit_status | `not_run` |

## Review Record

| field | planned_or_actual_value |
|---|---|
| required_review_responsibility | contracts / boundary-domain / security reviewer核active identity前置、显式四维隔离 + workspace requirement和Context -> Boundary顺序 |
| type_and_scope_review | `feat(boundary)`对应coherent contract |
| body_group_review | active identity、四维隔离 / workspace、handle / lease共同闭合 |
| review_and_evidence_discipline | boundary domain + security |
| design_discipline_record | passed_design |
| future_repeat_check | no-policy-input和weak rejection |
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

Expected successor after a real Handoff Gate pass: `CB-SBX-05B`. The project ledger alone activates that successor.

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
