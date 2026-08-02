# CB-SBX-09B implementation ledger

> Created by L4-sandbox Step 13 from reviewed Step 6~11 matrices.
> This is a planned recovery contract, not proof of implementation, test execution, evidence, review, acceptance, or authorization.

| field | value |
|---|---|
| project | `L4-sandbox` |
| boundary_id | `CB-SBX-09B` |
| phase | `PH-09` |
| verifiable_goal | 打通13 Query service / API并机械证明write set为0。 |
| direct_predecessor | `CB-SBX-09A` |
| design_baseline | `not_fixed` |
| implementation_repo | `/home/aris/Projects/quantalithos-sandbox (absent)` |
| status | `planned` |
| next_allowed_action | `wait_until_current` |
| current_identity | no; wait for project-ledger activation |
| task_ids | `IMPL-SBX-09-03`; `IMPL-SBX-09-04` |
| batch_ids | `BATCH-SBX-09B-01`; `BATCH-SBX-09B-02`; `BATCH-SBX-09B-03` |
| evidence_maturity | G1;任何Query write / audit append / refresh / rebuild / cleanup / repair、finder scan或visibility泄漏即不提交 |
| implementation_started | `no` |

## Required Reads

| document | required_section | status | notes |
|---|---|---|---|
| projects/L4-sandbox/07-实施计划.md | §1, §3, §5~§12 and this exact boundary row in §6 | not_run | Formal implementation authority and control rules. |
| projects/L4-sandbox/03-详细设计.md | §8.3 / §8.5 query flows / §10.4 Query read / §11~§12 / §15.1 | not_run | Exact owner reading copied from Step 6 section 7.4. |
| projects/L4-sandbox/05-测试方案.md | SUITE-004/014 | not_run | Exact owner reading copied from Step 6 section 7.4. |
| projects/L4-sandbox/06-验收标准.md | AC-SBX-030/036 | not_run | Exact owner reading copied from Step 6 section 7.4. |
| projects/L4-sandbox/design-calibration/03_ddd_step_09_function_flows.md | `03_ddd_step_09_function_flows.md` | not_run | Exact calibration or standard reference copied from Step 6 section 7.4. |
| projects/L4-sandbox/design-calibration/03_ddd_step_11_persistence_transaction_consistency.md | `03_ddd_step_11_persistence_transaction_consistency.md` | not_run | Exact calibration or standard reference copied from Step 6 section 7.4. |
| projects/L4-sandbox/design-calibration/07_implementation_plan_step_06_tasks_commit_boundaries.md | §7.1, §7.2, §7.4~§7.8, §7.11; CB-SBX-09B | not_run | Goal, predecessor, closure profiles, scope, tasks, batches, checks, and skeleton schema. |
| projects/L4-sandbox/design-calibration/07_implementation_plan_step_07_test_acceptance_gates.md | §6 and §8; CB-SBX-09B | not_run | Exact suite, AC, VETO, artifact, report, maturity, and review gate. |
| projects/L4-sandbox/design-calibration/07_implementation_plan_step_08_boundary_readiness_matrix.md | CB-SBX-09B readiness row | not_run | Config, environment, adapter, external dependency, and unavailable disposition. |
| projects/L4-sandbox/design-calibration/07_implementation_plan_step_09_boundary_risk_matrix.md | CB-SBX-09B risk row | not_run | Full Spike, Risk, OQ, closure, and safe routing. |
| projects/L4-sandbox/design-calibration/07_implementation_plan_step_10_boundary_control_matrix.md | CB-SBX-09B control row | not_run | Pause, rollback, invalidation, and recovery routing. |
| projects/L4-sandbox/design-calibration/07_implementation_plan_step_11_boundary_commit_message_matrix.md | CB-SBX-09B planned message and commit timing rows | not_run | Exact title, summary, body groups, evidence references, and commit prohibition. |
| projects/L4-sandbox/design-calibration/07_implementation_plan_step_11_review_delivery_audit.md | CB-SBX-09B review and delivery rows | not_run | Independent review, worktree protection, delivery, and handoff discipline. |
| standards/document/代码实施台账与门禁规范.md | project ledger, boundary ledger, nine Gate types, blockers, Commit Gate, and Handoff Gate | not_run | State values and recovery contract. |
| standards/document/设计真相源闭环与可落码性标准.md | boundary codeability and design writeback rules | not_run | Implementation must not invent missing design truth. |
| standards/document/全局项目依赖关系与裁剪规则.md | L4 Sandbox dependency direction and sibling-repository trimming | not_run | Only the allowed core dependency may be compile-time; adjacent products remain ports, events, handoffs, or fakes. |
| standards/document/子项目目录与代码文件组织规范.md | workspace, crate, binary, scripts, artifacts, reports, and implementation-ledger layout | not_run | Directory and code-file organization authority. |
| standards/coding/rust.md | applicable Rust source, tests, formatting, lint, and naming rules | not_run | Target-repository rules may add stricter requirements after repository creation. |

## Allowed Scope

| type | path_or_rule | status |
|---|---|---|
| allowed_path_or_rule | `crates/application/src/{queries,services,ports,repositories}.rs` | planned |
| allowed_path_or_rule | `crates/infra/src/{projection_repositories,truth_repositories,fakes}.rs` | planned |
| allowed_path_or_rule | `crates/api/src/{query_handlers,errors,bin/sandbox-api.rs}` | planned |
| allowed_path_or_rule | `tests/{service,integration}/**` | planned |
| included_behavior | `DEL-SBX-CODE-004`;`DEL-SBX-CODE-005`;`DEL-SBX-CODE-006`;`DEL-SBX-CODE-009`;`DEL-SBX-CODE-011`;`DEL-SBX-CODE-012`;`DEL-SBX-ADP-001`;13 Query services / API、projection / derived / comparison / reconciliation / audit read fakes | planned |
| boundary_goal | 打通13 Query service / API并机械证明write set为0。 | planned |

## Forbidden Scope

| rule | status | failure_action |
|---|---|---|
| any write UoW / audit append / repair;storage scan;PH-10 consumer markers as prerequisite | active | block_scope_gate; remove the change or reopen design |
| refresh / rebuild / retry / cleanup / storage scan | active | block_scope_gate; do not stage or commit |
| Do not implement tools semantic execution, runtime agent-loop orchestration, or member lifecycle orchestration inside Sandbox. | active | block_scope_gate; return the concern to its owning project |
| Do not use latest paths, static evidence aliases, prefilled Passed or acceptance decisions, raw secret or process bodies, or unrelated user changes. | active | block_evidence_or_worktree_gate; preserve safe failure material |

## Tasks And Batches

### Tasks

| task_id | order | implementation_action | input | completion_criterion |
|---|---|---|---|---|
| `IMPL-SBX-09-03` | 3 | 编写13 Query service、degraded mapper和read fake | QRY-001~026 | 每个branch有正式source且write set=0 |
| `IMPL-SBX-09-04` | 4 | 编写API query handler / disposition和no-write / page / race tests | SUITE-004 /014 | 13 /13 entry可验证,无repair |

### Batches

| batch_id | goal | input_to_output | expected_size | post_batch_check | commit_relation |
|---|---|---|---|---|---|
| `BATCH-SBX-09B-01` | status query services | Query 1~8 -> service / fake / mapper | 200~300 | QRY-001~016;write audit=0 | one commit after every batch passes |
| `BATCH-SBX-09B-02` | projection / audit services | Query 9~13 -> service / fake / mapper | 200~300 | QRY-017~026;RACE-019 | one commit after every batch passes |
| `BATCH-SBX-09B-03` | API read entry | service result -> handler disposition / tests | 200~300 | 13 protocol inventory / no repair | one commit after every batch passes |

Subfunction grouping: status queries + projection / audit queries + API mapping

Same-commit cause: 13 entry共同证明read-only facade和一致disposition,不留某族私自写入

Verification closure: QRY-001~026 / write audit=0

Explicitly excluded: maintenance / repair

## Activation Readiness

| dimension | planned_requirement | actual_status |
|---|---|---|
| config_and_source | complete projection /derived /reference generation;visibility /timeout /bounded page | not_run |
| environment_and_adapter | ENV-02 semantic read fake;ENV-04 boundedness /stale simulation补强 | not_run |
| external_and_tooling | read repository /API runtime、write-audit=0 | not_run |
| unavailable_disposition | store unavailable映射degraded /missing;不得write /refresh /repair | not_run |
| boundary_specific_activation | typed read callable surface完整;write audit可执行 | not_run |

## Design Closure And Risk

| field | planned_value | actual_status |
|---|---|---|
| closure_profiles | query service / API;BASE+QUERY | not_run |
| applicable_experience | handler disposition;projection lookup;sidecar read;visibility / degraded sources;no-write;RACE-019 | not_run |
| formal_evidence_location | `03`§8.3 / §10~§12 / §15;`05`SUITE-004/014 | not_run |
| explicit_non_applicability | idempotency / audit append不适用:Query明确不reserve /不写 | not_run |
| design_level_conclusion | `passed_design`;任何repair触发scope failure | design_record_only |
| activation_or_design_closure | semantic read fake、degraded /empty /bounded page fixtures和write-audit=0闭合 | not_run |
| safe_route_if_open_or_triggered | unavailable按formal mapper;write /refresh /repair命中VETO-SBX-012,阻断Handoff | not_run |

| reference_type | full_references | execution_status |
|---|---|---|
| spike | `SP-SBX-IMP-007`; `SP-SBX-IMP-009` | not_run |
| risk | `R-SBX-IMP-003`; `R-SBX-IMP-005`; `R-SBX-IMP-008`; `R-SBX-IMP-010`; `R-SBX-IMP-019`; `R-SBX-IMP-020` | not_run |
| open_question | none_by_boundary_matrix | not_run |

## Required Checks

| check_id | command_or_assertion | required_status | actual_status | evidence |
|---|---|---|---|---|
| CHK-ACTIVATION | Close predecessor CB-SBX-09A; typed read callable surface完整;write audit可执行 | closed_or_formal_blocked | not_run | absent |
| CHK-DESIGN | query service / API;BASE+QUERY; closure evidence: `03`§8.3 / §10~§12 / §15;`05`SUITE-004/014; repeat-check rule: `passed_design`;任何repair触发scope failure | design_consistent | not_run | absent |
| CHK-SCOPE | Allowed: `crates/application/src/{queries,services,ports,repositories}.rs`;`crates/infra/src/{projection_repositories,truth_repositories,fakes}.rs`;`crates/api/src/{query_handlers,errors,bin/sandbox-api.rs}`;`tests/{service,integration}/**`; included behavior: `DEL-SBX-CODE-004`;`DEL-SBX-CODE-005`;`DEL-SBX-CODE-006`;`DEL-SBX-CODE-009`;`DEL-SBX-CODE-011`;`DEL-SBX-CODE-012`;`DEL-SBX-ADP-001`;13 Query services / API、projection / derived / comparison / reconciliation / audit read fakes; forbidden: any write UoW / audit append / repair;storage scan;PH-10 consumer markers as prerequisite; refresh / rebuild / retry / cleanup / storage scan | scope_clean | not_run | absent |
| CHK-WORKTREE | Record target root, HEAD, initial git status, local identity, user-owned changes, and staged-file ownership. | worktree_recorded | not_run | absent |
| CHK-BUILD | `QRY-001~026`,`RACE-019`,SUITE-004/014 targeted;visible / empty / restricted / stale / degraded / missing;write audit=0 | pass_or_formal_allowed_status | not_run | absent |
| CHK-TEST | SUITE-SBX-004 /011 /014及008 /009适用:QRY-001~026、RACE-019;visible / empty / restricted / stale / degraded / missing、bounded selection、write audit=0 | all_mandatory_pass | not_run | absent |
| CHK-AC-VETO | AC-SBX-018 /020~023 /030~041;AC-SBX-031 PROTOCOL-SLICE;VETO-SBX-005 /006 /009 /010 /012 /016 | assertions_present_and_no_triggered_veto | not_run | absent |
| CHK-ARTIFACT | G1 read / protocol / consistency / audit / boundedness raw与write-audit check | maturity_contract_satisfied | not_run | absent |
| CHK-REPORT | suite reports、targeted protocol / boundedness / report-audit | paired_report_or_G0_reason | not_run | absent |
| CHK-EVIDENCE-MATURITY | G1;任何Query write / audit append / refresh / rebuild / cleanup / repair、finder scan或visibility泄漏即不提交 | status_fidelity_and_safe_failure | not_run | absent |
| CHK-READINESS | Config/source: complete projection /derived /reference generation;visibility /timeout /bounded page; ENV/adapter: ENV-02 semantic read fake;ENV-04 boundedness /stale simulation补强; external/tool: read repository /API runtime、write-audit=0; unavailable route: store unavailable映射degraded /missing;不得write /refresh /repair | ready_or_formally_blocked | not_run | absent |
| CHK-RISK | Close or confirm before Activation/Design: semantic read fake、degraded /empty /bounded page fixtures和write-audit=0闭合; route: unavailable按formal mapper;write /refresh /repair命中VETO-SBX-012,阻断Handoff | closed_or_routed | not_run | absent |
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

Boundary artifact contract: G1 read / protocol / consistency / audit / boundedness raw与write-audit check

Boundary report contract: suite reports、targeted protocol / boundedness / report-audit

Planned evidence/review reference: query / protocol / boundedness / `report-audit.md`

Commit is allowed only when: QRY-001~026、RACE-019、bounded reads、visibility和mechanical write set=0通过

Forbidden proof substitution: refresh / rebuild / audit append

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
| planned_commit_title | `feat(query): serve bounded queries without writes` |
| planned_commit_summary | `Serve all bounded query families with a zero-write facade for CB-SBX-09B.` |
| planned_body_groups | `Status query services:`;`Projection and audit query services:`;`API facade and zero-write verification:` |
| same_commit_cause | 13 entry共同证明一致disposition、bounded read和write set为0 |
| planned_footer | `Co-Authored-By: Codex <noreply@openai.com>` |
| staged_files_checked | `not_run` |
| commit_message_checked | `not_run` |
| committed_hash | `not_committed` |
| committed_message | `not_committed` |
| post_commit_status | `not_run` |

## Review Record

| field | planned_or_actual_value |
|---|---|
| required_review_responsibility | application / API / projection / audit reviewer核read-only facade、RACE-019和zero-write |
| type_and_scope_review | `feat(query)`对应read-only facade |
| body_group_review | status / projection / API共同证明zero-write |
| review_and_evidence_discipline | application + API + projection + audit |
| design_discipline_record | passed_design |
| future_repeat_check | RACE-019 / write audit=0 |
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

Expected successor after a real Handoff Gate pass: `CB-SBX-10A`. The project ledger alone activates that successor.

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
