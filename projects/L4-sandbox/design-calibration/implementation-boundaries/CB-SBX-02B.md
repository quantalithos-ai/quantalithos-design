# CB-SBX-02B implementation ledger

> Created by L4-sandbox Step 13 from reviewed Step 6~11 matrices.
> This is a planned recovery contract, not proof of implementation, test execution, evidence, review, acceptance, or authorization.

| field | value |
|---|---|
| project | `L4-sandbox` |
| boundary_id | `CB-SBX-02B` |
| phase | `PH-02` |
| verifiable_goal | 建立可证明rollback、version和三通道replay的semantic persistence kernel。 |
| direct_predecessor | `CB-SBX-02A` |
| design_baseline | `not_fixed` |
| implementation_repo | `/home/aris/Projects/quantalithos-sandbox (absent)` |
| status | `planned` |
| next_allowed_action | `wait_until_current` |
| current_identity | no; wait for project-ledger activation |
| task_ids | `IMPL-SBX-02-03`; `IMPL-SBX-02-04` |
| batch_ids | `BATCH-SBX-02B-01`; `BATCH-SBX-02B-02`; `BATCH-SBX-02B-03` |
| evidence_maturity | G0;fake无法证明all-or-nothing、version loser或stored replay即不提交;不得统计237主case |
| implementation_started | `no` |

## Required Reads

| document | required_section | status | notes |
|---|---|---|---|
| projects/L4-sandbox/07-实施计划.md | §1, §3, §5~§12 and this exact boundary row in §6 | not_run | Formal implementation authority and control rules. |
| projects/L4-sandbox/03-详细设计.md | §5.6~§5.7 / §10.1~§10.5 / §12.1~§12.4 / §15.4 | not_run | Exact owner reading copied from Step 6 section 7.4. |
| projects/L4-sandbox/05-测试方案.md | §6 TXN / RACE | not_run | Exact owner reading copied from Step 6 section 7.4. |
| projects/L4-sandbox/design-calibration/03_ddd_step_11_persistence_transaction_consistency.md | `03_ddd_step_11_persistence_transaction_consistency.md` | not_run | Exact calibration or standard reference copied from Step 6 section 7.4. |
| projects/L4-sandbox/design-calibration/03_ddd_step_13_concurrency_idempotency.md | `03_ddd_step_13_concurrency_idempotency.md` | not_run | Exact calibration or standard reference copied from Step 6 section 7.4. |
| projects/L4-sandbox/design-calibration/07_implementation_plan_step_06_tasks_commit_boundaries.md | §7.1, §7.2, §7.4~§7.8, §7.11; CB-SBX-02B | not_run | Goal, predecessor, closure profiles, scope, tasks, batches, checks, and skeleton schema. |
| projects/L4-sandbox/design-calibration/07_implementation_plan_step_07_test_acceptance_gates.md | §6 and §8; CB-SBX-02B | not_run | Exact suite, AC, VETO, artifact, report, maturity, and review gate. |
| projects/L4-sandbox/design-calibration/07_implementation_plan_step_08_boundary_readiness_matrix.md | CB-SBX-02B readiness row | not_run | Config, environment, adapter, external dependency, and unavailable disposition. |
| projects/L4-sandbox/design-calibration/07_implementation_plan_step_09_boundary_risk_matrix.md | CB-SBX-02B risk row | not_run | Full Spike, Risk, OQ, closure, and safe routing. |
| projects/L4-sandbox/design-calibration/07_implementation_plan_step_10_boundary_control_matrix.md | CB-SBX-02B control row | not_run | Pause, rollback, invalidation, and recovery routing. |
| projects/L4-sandbox/design-calibration/07_implementation_plan_step_11_boundary_commit_message_matrix.md | CB-SBX-02B planned message and commit timing rows | not_run | Exact title, summary, body groups, evidence references, and commit prohibition. |
| projects/L4-sandbox/design-calibration/07_implementation_plan_step_11_review_delivery_audit.md | CB-SBX-02B review and delivery rows | not_run | Independent review, worktree protection, delivery, and handoff discipline. |
| standards/document/代码实施台账与门禁规范.md | project ledger, boundary ledger, nine Gate types, blockers, Commit Gate, and Handoff Gate | not_run | State values and recovery contract. |
| standards/document/设计真相源闭环与可落码性标准.md | boundary codeability and design writeback rules | not_run | Implementation must not invent missing design truth. |
| standards/document/全局项目依赖关系与裁剪规则.md | L4 Sandbox dependency direction and sibling-repository trimming | not_run | Only the allowed core dependency may be compile-time; adjacent products remain ports, events, handoffs, or fakes. |
| standards/document/子项目目录与代码文件组织规范.md | workspace, crate, binary, scripts, artifacts, reports, and implementation-ledger layout | not_run | Directory and code-file organization authority. |
| standards/coding/rust.md | applicable Rust source, tests, formatting, lint, and naming rules | not_run | Target-repository rules may add stricter requirements after repository creation. |

## Allowed Scope

| type | path_or_rule | status |
|---|---|---|
| allowed_path_or_rule | `crates/application/src/{ports,repositories,unit_of_work,idempotency,stored_results,errors}.rs` | planned |
| allowed_path_or_rule | `crates/infra/src/{truth_repositories,idempotency_store,result_store,clock_id,fakes}.rs` | planned |
| allowed_path_or_rule | `tests/{service,integration,support}/**` | planned |
| included_behavior | `DEL-SBX-CODE-004`;`DEL-SBX-CODE-005`;`DEL-SBX-CODE-011`;`DEL-SBX-ADP-001`;`DEL-SBX-TEST-005`共享kernel增量;UoW、version、cursor、idempotency、stored result、fake repository | planned |
| boundary_goal | 建立可证明rollback、version和三通道replay的semantic persistence kernel。 | planned |

## Forbidden Scope

| rule | status | failure_action |
|---|---|---|
| 具体Command flow、domain-specific repository callable、config loader、real adapter、Query / Job | active | block_scope_gate; remove the change or reopen design |
| 具体Command / Consumer / Job flow、raw config、real adapter | active | block_scope_gate; do not stage or commit |
| Do not implement tools semantic execution, runtime agent-loop orchestration, or member lifecycle orchestration inside Sandbox. | active | block_scope_gate; return the concern to its owning project |
| Do not use latest paths, static evidence aliases, prefilled Passed or acceptance decisions, raw secret or process bodies, or unrelated user changes. | active | block_evidence_or_worktree_gate; preserve safe failure material |

## Tasks And Batches

### Tasks

| task_id | order | implementation_action | input | completion_criterion |
|---|---|---|---|---|
| `IMPL-SBX-02-03` | 3 | 编写repository / UoW / version / cursor / idempotency / stored-result traits | `03`§10 / §12 | trait签名与transaction ordering闭合 |
| `IMPL-SBX-02-04` | 4 | 编写semantic fake、fault schedule与rollback / replay tests | TXN / RACE切口 | staging、winner和duplicate不重算可测 |

### Batches

| batch_id | goal | input_to_output | expected_size | post_batch_check | commit_relation |
|---|---|---|---|---|---|
| `BATCH-SBX-02B-01` | persistence traits | transaction contract -> repository / UoW / cursor traits | 200~300 | compile;trait contract tests | one commit after every batch passes |
| `BATCH-SBX-02B-02` | idempotency / stored replay | key / digest contract -> reserve / result fake | 200~300 | same / different digest;missing result | one commit after every batch passes |
| `BATCH-SBX-02B-03` | high-risk UoW parity | fault schedule -> commit / rollback / version / cursor fake | 200~300 | rollback visibility;single winner | one commit after every batch passes |

Subfunction grouping: UoW / repository + idempotency / stored result + semantic fake

Same-commit cause: fake必须与同一transaction / replay contract一起review,否则不能证明parity

Verification closure: rollback / version / replay tests

Explicitly excluded: concrete flow

## Activation Readiness

| dimension | planned_requirement | actual_status |
|---|---|---|
| config_and_source | 直接constructor fixture;尚不依赖03A loader;预留I017 /I022 /I096 /I097正式绑定 | not_run |
| environment_and_adapter | ENV-02 semantic store /UoW /clock /id fake | not_run |
| external_and_tooling | deterministic scheduler、rollback /version /three-channel replay fixtures | not_run |
| unavailable_disposition | 外部harness缺失记`dependency_wait`并`blocked / handoff`;当前scope fake实现失败为`blocked / fix_gate_failure`;不得以无事务map /sleep替代 | not_run |
| boundary_specific_activation | 02A Handoff Gate | not_run |

## Design Closure And Risk

| field | planned_value | actual_status |
|---|---|---|
| closure_profiles | persistence / idempotency;BASE+TXN | not_run |
| applicable_experience | generic / typed ref分离;accepted cursor;idempotency context;stored result;rollback / version fake parity;domain-specific finder后置 | not_run |
| formal_evidence_location | `03`§10 / §12 / §15.4;`05`TXN / RACE | not_run |
| explicit_non_applicability | public protocol / artifact / concrete boundary finder不适用:本boundary只实现共享kernel | not_run |
| design_level_conclusion | `passed_design`;不得由fake添加私有index /状态 / latest scan | design_record_only |
| activation_or_design_closure | semantic fake具备UoW staged commit /rollback、version、idempotency和three-channel stored replay | not_run |
| safe_route_if_open_or_triggered | 外部required harness缺失记`dependency_wait`并`handoff`;当前scope fake失败`fix_gate_failure`;设计语义不唯一`wait_design`;不得简化为无事务map /盲重试 | not_run |

| reference_type | full_references | execution_status |
|---|---|---|
| spike | `SP-SBX-IMP-007` | not_run |
| risk | `R-SBX-IMP-003`; `R-SBX-IMP-005`; `R-SBX-IMP-011`; `R-SBX-IMP-019`; `R-SBX-IMP-020` | not_run |
| open_question | none_by_boundary_matrix | not_run |

## Required Checks

| check_id | command_or_assertion | required_status | actual_status | evidence |
|---|---|---|---|---|
| CHK-ACTIVATION | Close predecessor CB-SBX-02A; 02A Handoff Gate | closed_or_formal_blocked | not_run | absent |
| CHK-DESIGN | persistence / idempotency;BASE+TXN; closure evidence: `03`§10 / §12 / §15.4;`05`TXN / RACE; repeat-check rule: `passed_design`;不得由fake添加私有index /状态 / latest scan | design_consistent | not_run | absent |
| CHK-SCOPE | Allowed: `crates/application/src/{ports,repositories,unit_of_work,idempotency,stored_results,errors}.rs`;`crates/infra/src/{truth_repositories,idempotency_store,result_store,clock_id,fakes}.rs`;`tests/{service,integration,support}/**`; included behavior: `DEL-SBX-CODE-004`;`DEL-SBX-CODE-005`;`DEL-SBX-CODE-011`;`DEL-SBX-ADP-001`;`DEL-SBX-TEST-005`共享kernel增量;UoW、version、cursor、idempotency、stored result、fake repository; forbidden: 具体Command flow、domain-specific repository callable、config loader、real adapter、Query / Job; 具体Command / Consumer / Job flow、raw config、real adapter | scope_clean | not_run | absent |
| CHK-WORKTREE | Record target root, HEAD, initial git status, local identity, user-owned changes, and staged-file ownership. | worktree_recorded | not_run | absent |
| CHK-BUILD | staged commit / rollback / unique / version / cursor / stored replay tests;`cargo check -p sandbox-application -p sandbox-infra`完成后 | pass_or_formal_allowed_status | not_run | absent |
| CHK-TEST | SUITE-SBX-007 kernel precondition;TXN-001~014涉及的staged commit / rollback / version / cursor / three-channel replay primitive fixtures,但不冒充具体flow主结果 | all_mandatory_pass | not_run | absent |
| CHK-AC-VETO | AC-SBX-032 /039 /040;VETO-SBX-010 /012 /013 | assertions_present_and_no_triggered_veto | not_run | absent |
| CHK-ARTIFACT | `no_runtime_artifact`:semantic fake trace与stored replay assertion记ledger | maturity_contract_satisfied | not_run | absent |
| CHK-REPORT | 无run report;handoff摘要固定rollback / version / replay contract | paired_report_or_G0_reason | not_run | absent |
| CHK-EVIDENCE-MATURITY | G0;fake无法证明all-or-nothing、version loser或stored replay即不提交;不得统计237主case | status_fidelity_and_safe_failure | not_run | absent |
| CHK-READINESS | Config/source: 直接constructor fixture;尚不依赖03A loader;预留I017 /I022 /I096 /I097正式绑定; ENV/adapter: ENV-02 semantic store /UoW /clock /id fake; external/tool: deterministic scheduler、rollback /version /three-channel replay fixtures; unavailable route: 外部harness缺失记`dependency_wait`并`blocked / handoff`;当前scope fake实现失败为`blocked / fix_gate_failure`;不得以无事务map /sleep替代 | ready_or_formally_blocked | not_run | absent |
| CHK-RISK | Close or confirm before Activation/Design: semantic fake具备UoW staged commit /rollback、version、idempotency和three-channel stored replay; route: 外部required harness缺失记`dependency_wait`并`handoff`;当前scope fake失败`fix_gate_failure`;设计语义不唯一`wait_design`;不得简化为无事务map /盲重试 | closed_or_routed | not_run | absent |
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

Boundary artifact contract: `no_runtime_artifact`:semantic fake trace与stored replay assertion记ledger

Boundary report contract: 无run report;handoff摘要固定rollback / version / replay contract

Planned evidence/review reference: boundary ledger中的rollback / version / three-channel replay / semantic fake traces

Commit is allowed only when: UoW all-or-nothing、loser visibility、stored replay和fake parity均闭合

Forbidden proof substitution: 237主case、具体command结果

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
| planned_commit_title | `feat(persistence): add transactional persistence and replay kernel` |
| planned_commit_summary | `Add the rollback-safe persistence and replay kernel for CB-SBX-02B.` |
| planned_body_groups | `Transaction and repository kernel:`;`Idempotency and stored replay:`;`Semantic fakes and rollback fixtures:` |
| same_commit_cause | fake、UoW、version、idempotency和stored result必须一起证明durable parity与rollback |
| planned_footer | `Co-Authored-By: Codex <noreply@openai.com>` |
| staged_files_checked | `not_run` |
| commit_message_checked | `not_run` |
| committed_hash | `not_committed` |
| committed_message | `not_committed` |
| post_commit_status | `not_run` |

## Review Record

| field | planned_or_actual_value |
|---|---|
| required_review_responsibility | application / infra consistency reviewer核fake parity和无domain-specific私有语义 |
| type_and_scope_review | `feat(persistence)`对应kernel |
| body_group_review | UoW / replay / fake共同证明parity |
| review_and_evidence_discipline | consistency review;G0 rollback / replay |
| design_discipline_record | passed_design |
| future_repeat_check | actual fake与durable contract等价 |
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

Expected successor after a real Handoff Gate pass: `CB-SBX-02C`. The project ledger alone activates that successor.

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
