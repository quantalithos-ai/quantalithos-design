# CB-SBX-13A implementation ledger

> Created by L4-sandbox Step 13 from reviewed Step 6~11 matrices.
> This is a planned recovery contract, not proof of implementation, test execution, evidence, review, acceptance, or authorization.

| field | value |
|---|---|
| project | `L4-sandbox` |
| boundary_id | `CB-SBX-13A` |
| phase | `PH-13` |
| verifiable_goal | 绑定单一candidate并在任何probe前固定不可替换qualification identity。 |
| direct_predecessor | `CB-SBX-12B +PH-QP` |
| design_baseline | `not_fixed` |
| implementation_repo | `/home/aris/Projects/quantalithos-sandbox (absent)` |
| status | `planned` |
| next_allowed_action | `wait_until_current` |
| current_identity | no; wait for project-ledger activation |
| task_ids | `IMPL-SBX-13-01`; `IMPL-SBX-13-02` |
| batch_ids | `BATCH-SBX-13A-01`; `BATCH-SBX-13A-02`; `BATCH-SBX-13A-03` |
| evidence_maturity | G1;全部现实activation input未闭合前boundary保持`blocked_pre_implementation`;任何missing / mismatch为Blocked且probe / launch=0 |
| implementation_started | `no` |

## Required Reads

| document | required_section | status | notes |
|---|---|---|---|
| projects/L4-sandbox/07-实施计划.md | §1, §3, §5~§12 and this exact boundary row in §6 | not_run | Formal implementation authority and control rules. |
| projects/L4-sandbox/03-详细设计.md | §13 | not_run | Exact owner reading copied from Step 6 section 7.4. |
| projects/L4-sandbox/04-配置设计.md | §6 / §8~§12 | not_run | Exact owner reading copied from Step 6 section 7.4. |
| projects/L4-sandbox/05-测试方案.md | §7~§10 / §13 | not_run | Exact owner reading copied from Step 6 section 7.4. |
| projects/L4-sandbox/06-验收标准.md | §3 / §9~§11 | not_run | Exact owner reading copied from Step 6 section 7.4. |
| projects/L4-sandbox/design-calibration/07_implementation_plan_step_06_tasks_commit_boundaries.md | candidate / qualification identity校准 | not_run | Exact calibration or standard reference copied from Step 6 section 7.4. |
| projects/L4-sandbox/design-calibration/07_implementation_plan_step_06_tasks_commit_boundaries.md | PH-QP packet | not_run | Exact calibration or standard reference copied from Step 6 section 7.4. |
| projects/L4-sandbox/design-calibration/07_implementation_plan_step_06_tasks_commit_boundaries.md | §7.1, §7.2, §7.4~§7.8, §7.11; CB-SBX-13A | not_run | Goal, predecessor, closure profiles, scope, tasks, batches, checks, and skeleton schema. |
| projects/L4-sandbox/design-calibration/07_implementation_plan_step_07_test_acceptance_gates.md | §6 and §8; CB-SBX-13A | not_run | Exact suite, AC, VETO, artifact, report, maturity, and review gate. |
| projects/L4-sandbox/design-calibration/07_implementation_plan_step_08_boundary_readiness_matrix.md | CB-SBX-13A readiness row | not_run | Config, environment, adapter, external dependency, and unavailable disposition. |
| projects/L4-sandbox/design-calibration/07_implementation_plan_step_09_boundary_risk_matrix.md | CB-SBX-13A risk row | not_run | Full Spike, Risk, OQ, closure, and safe routing. |
| projects/L4-sandbox/design-calibration/07_implementation_plan_step_10_boundary_control_matrix.md | CB-SBX-13A control row | not_run | Pause, rollback, invalidation, and recovery routing. |
| projects/L4-sandbox/design-calibration/07_implementation_plan_step_11_boundary_commit_message_matrix.md | CB-SBX-13A planned message and commit timing rows | not_run | Exact title, summary, body groups, evidence references, and commit prohibition. |
| projects/L4-sandbox/design-calibration/07_implementation_plan_step_11_review_delivery_audit.md | CB-SBX-13A review and delivery rows | not_run | Independent review, worktree protection, delivery, and handoff discipline. |
| standards/document/代码实施台账与门禁规范.md | project ledger, boundary ledger, nine Gate types, blockers, Commit Gate, and Handoff Gate | not_run | State values and recovery contract. |
| standards/document/设计真相源闭环与可落码性标准.md | boundary codeability and design writeback rules | not_run | Implementation must not invent missing design truth. |
| standards/document/全局项目依赖关系与裁剪规则.md | L4 Sandbox dependency direction and sibling-repository trimming | not_run | Only the allowed core dependency may be compile-time; adjacent products remain ports, events, handoffs, or fakes. |
| standards/document/子项目目录与代码文件组织规范.md | workspace, crate, binary, scripts, artifacts, reports, and implementation-ledger layout | not_run | Directory and code-file organization authority. |
| standards/coding/rust.md | applicable Rust source, tests, formatting, lint, and naming rules | not_run | Target-repository rules may add stricter requirements after repository creation. |

## Allowed Scope

| type | path_or_rule | status |
|---|---|---|
| allowed_path_or_rule | `crates/application/src/ports.rs` | planned |
| allowed_path_or_rule | `crates/infra/src/{config,runtime_builder,isolation_backend_adapters}.rs` | planned |
| allowed_path_or_rule | `tests/support/**` | planned |
| allowed_path_or_rule | `scripts/checks/check_qualification_identity.sh` | planned |
| included_behavior | `DEL-SBX-ADP-002`;`DEL-SBX-DATA-003`;`DEL-SBX-CFG-004`;`DEL-SBX-CFG-005`;`DEL-SBX-CFG-006`binding消费;单一candidate adapter / immutable qualification manifest / 0-launch preflight | planned |
| boundary_goal | 绑定单一candidate并在任何probe前固定不可替换qualification identity。 | planned |

## Forbidden Scope

| rule | status | failure_action |
|---|---|---|
| probe launch;fake / host substitution;多candidate;真实credential写仓 | active | block_scope_gate; remove the change or reopen design |
| CONF probe结果、多candidate、host / fake fallback、credential正文 | active | block_scope_gate; do not stage or commit |
| Do not implement tools semantic execution, runtime agent-loop orchestration, or member lifecycle orchestration inside Sandbox. | active | block_scope_gate; return the concern to its owning project |
| Do not use latest paths, static evidence aliases, prefilled Passed or acceptance decisions, raw secret or process bodies, or unrelated user changes. | active | block_evidence_or_worktree_gate; preserve safe failure material |

## Tasks And Batches

### Tasks

| task_id | order | implementation_action | input | completion_criterion |
|---|---|---|---|---|
| `IMPL-SBX-13-01` | 1 | 固定candidate ADR / revision和immutable qualification manifest schema / packet | PH-QP;PROFILE-05 | identity六维连续且不可从path猜测 |
| `IMPL-SBX-13-02` | 2 | 实现single candidate adapter和0-launch preflight / anti-substitution check | formal backend port | missing / mismatch为Blocked且0 launch |

### Batches

| batch_id | goal | input_to_output | expected_size | post_batch_check | commit_relation |
|---|---|---|---|---|---|
| `BATCH-SBX-13A-01` | qualification identity | ADR / ENV / profile / generation -> immutable manifest | 200~300 | missing / mismatch / digest / no credential | one commit after every batch passes |
| `BATCH-SBX-13A-02` | candidate binding | formal port -> concrete adapter mapping | 200~300 | capability / launch / capture / release outcome | one commit after every batch passes |
| `BATCH-SBX-13A-03` | zero-launch preflight | packet + adapter -> activation guard / check | 150~250 | substitution / missing => call budget 0 | one commit after every batch passes |

Subfunction grouping: immutable identity + candidate binding + zero-launch preflight

Same-commit cause: adapter在probe前必须被同一不可替换packet授权,否则不能安全提交

Verification closure: identity / substitution / call budget

Explicitly excluded: CONF result / credentials

## Activation Readiness

| dimension | planned_requirement | actual_status |
|---|---|---|
| config_and_source | exact P05、ENV-05、candidate /generation /template /capability /provider /material identity;S06 absent | not_run |
| environment_and_adapter | ENV-05 dedicated lab /candidate adapter preflight;当前均未形成 | not_run |
| external_and_tooling | candidate ADR /revision、provider principal /audit、lab authorization、0-launch check | not_run |
| unavailable_disposition | 任一缺失`blocked_pre_implementation`;probe /launch=0;不得candidate search /substitution | not_run |
| boundary_specific_activation | candidate ADR / revision、PROFILE-05、SBX-ENV-05、generation / template、provider / material identity全部固定 | not_run |

## Design Closure And Risk

| field | planned_value | actual_status |
|---|---|---|
| closure_profiles | candidate identity / adapter;BASE+CONFIG+MATERIAL+CANDIDATE | not_run |
| applicable_experience | immutable identity;config binding;adapter outcome;anti-substitution;zero-launch preflight;credential no-store | not_run |
| formal_evidence_location | `03`§13;`04`§6 / §8~§12;`05`§8 / §13 | not_run |
| explicit_non_applicability | probe result不适用:本boundary只固定授权和adapter | not_run |
| design_level_conclusion | `blocked_pre_implementation`:candidate ADR / revision、ENV-05、generation / template、provider / material identity待关闭 | design_record_only |
| activation_or_design_closure | 单一candidate ADR /revision、P05 /ENV-05 /generation /template /capability /provider /material /lab immutable packet全部形成 | not_run |
| safe_route_if_open_or_triggered | 任一缺失source `Blocked`;probe /launch=0;现实依赖缺失记`dependency_wait`并`handoff`,新surface`wait_design`;无搜索 /替换 | not_run |

| reference_type | full_references | execution_status |
|---|---|---|
| spike | `SP-SBX-IMP-013` | not_run |
| risk | `R-SBX-IMP-001`; `R-SBX-IMP-003`; `R-SBX-IMP-004`; `R-SBX-IMP-006`; `R-SBX-IMP-007`; `R-SBX-IMP-008`; `R-SBX-IMP-012`; `R-SBX-IMP-019`; `R-SBX-IMP-020` | not_run |
| open_question | `OQ-SBX-IMP-006`; `OQ-SBX-IMP-007`; `OQ-SBX-IMP-008`; `OQ-SBX-IMP-009` | not_run |

## Required Checks

| check_id | command_or_assertion | required_status | actual_status | evidence |
|---|---|---|---|---|
| CHK-ACTIVATION | Close predecessor CB-SBX-12B +PH-QP; candidate ADR / revision、PROFILE-05、SBX-ENV-05、generation / template、provider / material identity全部固定 | closed_or_formal_blocked | not_run | absent |
| CHK-DESIGN | candidate identity / adapter;BASE+CONFIG+MATERIAL+CANDIDATE; closure evidence: `03`§13;`04`§6 / §8~§12;`05`§8 / §13; repeat-check rule: `blocked_pre_implementation`:candidate ADR / revision、ENV-05、generation / template、provider / material identity待关闭 | design_consistent | not_run | absent |
| CHK-SCOPE | Allowed: `crates/application/src/ports.rs`;`crates/infra/src/{config,runtime_builder,isolation_backend_adapters}.rs`;`tests/support/**`;`scripts/checks/check_qualification_identity.sh`; included behavior: `DEL-SBX-ADP-002`;`DEL-SBX-DATA-003`;`DEL-SBX-CFG-004`;`DEL-SBX-CFG-005`;`DEL-SBX-CFG-006`binding消费;单一candidate adapter / immutable qualification manifest / 0-launch preflight; forbidden: probe launch;fake / host substitution;多candidate;真实credential写仓; CONF probe结果、多candidate、host / fake fallback、credential正文 | scope_clean | not_run | absent |
| CHK-WORKTREE | Record target root, HEAD, initial git status, local identity, user-owned changes, and staged-file ownership. | worktree_recorded | not_run | absent |
| CHK-BUILD | candidate ADR、revision、PROFILE-05、SBX-ENV-05、generation、template、provider / material identity全闭合;identity mismatch / missing -> Blocked且launch=0 | pass_or_formal_allowed_status | not_run | absent |
| CHK-TEST | qualification preflight fixtures:immutable candidate ADR / revision、PROFILE-05 / ENV-05 / generation / template / capability / provider / material identity;ARCH-001 + CONF identity前置;substitution / missing call=0 | all_mandatory_pass | not_run | absent |
| CHK-AC-VETO | P0-Q前置AC-SBX-008~011 /013~014 /027~028 /034~035 /038;AC-SBX-031 ARCH-SLICE supporting;VETO-SBX-001~009 /016~017适用predicate | assertions_present_and_no_triggered_veto | not_run | absent |
| CHK-ARTIFACT | G1 preflight / qualification identity raw能力;无CONF probe result、无ESLOT item | maturity_contract_satisfied | not_run | absent |
| CHK-REPORT | identity / preflight targeted report;缺输入时明确Blocked reason | paired_report_or_G0_reason | not_run | absent |
| CHK-EVIDENCE-MATURITY | G1;全部现实activation input未闭合前boundary保持`blocked_pre_implementation`;任何missing / mismatch为Blocked且probe / launch=0 | status_fidelity_and_safe_failure | not_run | absent |
| CHK-READINESS | Config/source: exact P05、ENV-05、candidate /generation /template /capability /provider /material identity;S06 absent; ENV/adapter: ENV-05 dedicated lab /candidate adapter preflight;当前均未形成; external/tool: candidate ADR /revision、provider principal /audit、lab authorization、0-launch check; unavailable route: 任一缺失`blocked_pre_implementation`;probe /launch=0;不得candidate search /substitution | ready_or_formally_blocked | not_run | absent |
| CHK-RISK | Close or confirm before Activation/Design: 单一candidate ADR /revision、P05 /ENV-05 /generation /template /capability /provider /material /lab immutable packet全部形成; route: 任一缺失source `Blocked`;probe /launch=0;现实依赖缺失记`dependency_wait`并`handoff`,新surface`wait_design`;无搜索 /替换 | closed_or_routed | not_run | absent |
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

Boundary artifact contract: G1 preflight / qualification identity raw能力;无CONF probe result、无ESLOT item

Boundary report contract: identity / preflight targeted report;缺输入时明确Blocked reason

Planned evidence/review reference: qualification identity / preflight fixture raw与run-root targeted report

Commit is allowed only when: 单一candidate packet的ADR /revision /P05 /ENV-05 /generation /template /capability /provider /material /lab全部关闭且missing call=0

Forbidden proof substitution: CONF结果、probe、credential入仓

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
| planned_commit_title | `feat(qualification): bind immutable candidate identity` |
| planned_commit_summary | `Bind one immutable qualification candidate packet before probing for CB-SBX-13A.` |
| planned_body_groups | `Immutable candidate packet and adapter binding:`;`Zero-launch preflight and identity checks:`;`Credential and material safety fixtures:` |
| same_commit_cause | adapter只有在同一不可替换packet完成preflight后才可进入probe boundary |
| planned_footer | `Co-Authored-By: Codex <noreply@openai.com>` |
| staged_files_checked | `not_run` |
| commit_message_checked | `not_run` |
| committed_hash | `not_committed` |
| committed_message | `not_committed` |
| post_commit_status | `not_run` |

## Review Record

| field | planned_or_actual_value |
|---|---|
| required_review_responsibility | design / qualification / security / provider reviewer固定单一packet和credential no-store;不得实现多candidate选择 |
| type_and_scope_review | `feat(qualification)`对应identity binding |
| body_group_review | packet / preflight / safety fixture共同保证0-launch |
| review_and_evidence_discipline | design + qualification + security + provider |
| design_discipline_record | passed_with_precondition |
| future_repeat_check | candidate / ENV-05 / material / lab |
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

Expected successor after a real Handoff Gate pass: `CB-SBX-13B`. The project ledger alone activates that successor.

## Blockers

| blocker_id | gate | status | reason | design_fix_baseline | next_allowed_action |
|---|---|---|---|---|---|
| `BLK-SBX-HDO-001` | activation_gate | resolved | Step 13 formal package review prerequisite is closed; this does not pass HDO or the Activation Gate. | not_fixed | wait_design |
| `BLK-SBX-BASELINE-001` | design_gate | open | Reproducible design commit baseline is not fixed. | not_fixed | wait_design |
| `BLK-SBX-P0Q-001` | activation_gate | open | Immutable candidate, P05, ENV-05, provider, material, and lab packet is absent. | not_fixed | handoff |

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
