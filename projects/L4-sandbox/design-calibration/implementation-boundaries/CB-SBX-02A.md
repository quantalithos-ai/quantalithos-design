# CB-SBX-02A implementation ledger

> Created by L4-sandbox Step 13 from reviewed Step 6~11 matrices.
> This is a planned recovery contract, not proof of implementation, test execution, evidence, review, acceptance, or authorization.

| field | value |
|---|---|
| project | `L4-sandbox` |
| boundary_id | `CB-SBX-02A` |
| phase | `PH-02` |
| verifiable_goal | 固定body-free typed carrier、metadata、status和public error契约。 |
| direct_predecessor | `CB-SBX-01A` |
| design_baseline | `not_fixed` |
| implementation_repo | `/home/aris/Projects/quantalithos-sandbox (absent)` |
| status | `planned` |
| next_allowed_action | `wait_until_current` |
| current_identity | no; wait for project-ledger activation |
| task_ids | `IMPL-SBX-02-01`; `IMPL-SBX-02-02` |
| batch_ids | `BATCH-SBX-02A-01`; `BATCH-SBX-02A-02` |
| evidence_maturity | G0;任一carrier / ref / metadata / safe-surface失败即不提交;不得先实现业务DTO绕过 |
| implementation_started | `no` |

## Required Reads

| document | required_section | status | notes |
|---|---|---|---|
| projects/L4-sandbox/07-实施计划.md | §1, §3, §5~§12 and this exact boundary row in §6 | not_run | Formal implementation authority and control rules. |
| projects/L4-sandbox/03-详细设计.md | §6.1~§7.7 / §11.1 | not_run | Exact owner reading copied from Step 6 section 7.4. |
| projects/L4-sandbox/05-测试方案.md | §3.2~§3.4 / §6.4 | not_run | Exact owner reading copied from Step 6 section 7.4. |
| projects/L4-sandbox/06-验收标准.md | §7.5 | not_run | Exact owner reading copied from Step 6 section 7.4. |
| projects/L4-sandbox/design-calibration/03_ddd_step_06_object_contracts.md | `03_ddd_step_06_object_contracts.md` | not_run | Exact calibration or standard reference copied from Step 6 section 7.4. |
| projects/L4-sandbox/design-calibration/03_ddd_step_08_protocol_contracts.md | `03_ddd_step_08_protocol_contracts.md` | not_run | Exact calibration or standard reference copied from Step 6 section 7.4. |
| projects/L4-sandbox/design-calibration/03_ddd_step_16_test_cuts.md | `03_ddd_step_16_test_cuts.md` | not_run | Exact calibration or standard reference copied from Step 6 section 7.4. |
| projects/L4-sandbox/design-calibration/07_implementation_plan_step_06_tasks_commit_boundaries.md | §7.1, §7.2, §7.4~§7.8, §7.11; CB-SBX-02A | not_run | Goal, predecessor, closure profiles, scope, tasks, batches, checks, and skeleton schema. |
| projects/L4-sandbox/design-calibration/07_implementation_plan_step_07_test_acceptance_gates.md | §6 and §8; CB-SBX-02A | not_run | Exact suite, AC, VETO, artifact, report, maturity, and review gate. |
| projects/L4-sandbox/design-calibration/07_implementation_plan_step_08_boundary_readiness_matrix.md | CB-SBX-02A readiness row | not_run | Config, environment, adapter, external dependency, and unavailable disposition. |
| projects/L4-sandbox/design-calibration/07_implementation_plan_step_09_boundary_risk_matrix.md | CB-SBX-02A risk row | not_run | Full Spike, Risk, OQ, closure, and safe routing. |
| projects/L4-sandbox/design-calibration/07_implementation_plan_step_10_boundary_control_matrix.md | CB-SBX-02A control row | not_run | Pause, rollback, invalidation, and recovery routing. |
| projects/L4-sandbox/design-calibration/07_implementation_plan_step_11_boundary_commit_message_matrix.md | CB-SBX-02A planned message and commit timing rows | not_run | Exact title, summary, body groups, evidence references, and commit prohibition. |
| projects/L4-sandbox/design-calibration/07_implementation_plan_step_11_review_delivery_audit.md | CB-SBX-02A review and delivery rows | not_run | Independent review, worktree protection, delivery, and handoff discipline. |
| standards/document/代码实施台账与门禁规范.md | project ledger, boundary ledger, nine Gate types, blockers, Commit Gate, and Handoff Gate | not_run | State values and recovery contract. |
| standards/document/设计真相源闭环与可落码性标准.md | boundary codeability and design writeback rules | not_run | Implementation must not invent missing design truth. |
| standards/document/全局项目依赖关系与裁剪规则.md | L4 Sandbox dependency direction and sibling-repository trimming | not_run | Only the allowed core dependency may be compile-time; adjacent products remain ports, events, handoffs, or fakes. |
| standards/document/子项目目录与代码文件组织规范.md | workspace, crate, binary, scripts, artifacts, reports, and implementation-ledger layout | not_run | Directory and code-file organization authority. |
| standards/coding/rust.md | applicable Rust source, tests, formatting, lint, and naming rules | not_run | Target-repository rules may add stricter requirements after repository creation. |

## Allowed Scope

| type | path_or_rule | status |
|---|---|---|
| allowed_path_or_rule | `crates/contracts/src/{lib,refs,metadata,kinds,status,errors,fixtures}.rs` | planned |
| allowed_path_or_rule | `tests/contracts/**` | planned |
| allowed_path_or_rule | `crates/contracts/Cargo.toml` | planned |
| included_behavior | `DEL-SBX-CODE-002`共享carrier增量;`CODE-010 /012`,`DATA-001`,`TEST-001`基础;`SandboxProtocolMetadataDto`,`ActorContext`,`Command / Query metadata`,`Page`,`Receipt`,`JobReport`,`PublicError` | planned |
| boundary_goal | 固定body-free typed carrier、metadata、status和public error契约。 | planned |

## Forbidden Scope

| rule | status | failure_action |
|---|---|---|
| command业务DTO、domain state、repository / entry | active | block_scope_gate; remove the change or reopen design |
| 10 Command业务字段、domain、UoW、entry | active | block_scope_gate; do not stage or commit |
| Do not implement tools semantic execution, runtime agent-loop orchestration, or member lifecycle orchestration inside Sandbox. | active | block_scope_gate; return the concern to its owning project |
| Do not use latest paths, static evidence aliases, prefilled Passed or acceptance decisions, raw secret or process bodies, or unrelated user changes. | active | block_evidence_or_worktree_gate; preserve safe failure material |

## Tasks And Batches

### Tasks

| task_id | order | implementation_action | input | completion_criterion |
|---|---|---|---|---|
| `IMPL-SBX-02-01` | 1 | 编写typed refs、metadata、authority、page和status carrier | `03`§7.2 | carrier可构造 / roundtrip且body-free |
| `IMPL-SBX-02-02` | 2 | 编写receipt / job report / public error共享面及contract fixtures | `03`§7.2 / §11 | exact disposition和safe mapping可测 |

### Batches

| batch_id | goal | input_to_output | expected_size | post_batch_check | commit_relation |
|---|---|---|---|---|---|
| `BATCH-SBX-02A-01` | ref / metadata carrier | shared source map -> refs / metadata / authority | 200~300 | roundtrip;missing / wrong kind | one commit after every batch passes |
| `BATCH-SBX-02A-02` | status / result carrier | disposition contract -> page / receipt / report / error | 200~300 | status closed-set;redaction | one commit after every batch passes |

Subfunction grouping: refs / metadata + status / receipt / report / error carrier

Same-commit cause: 下游三通道共用同一metadata和safe disposition,拆开会产生临时私有carrier

Verification closure: carrier contract suite

Explicitly excluded: 业务协议 / UoW

## Activation Readiness

| dimension | planned_requirement | actual_status |
|---|---|---|
| config_and_source | 无raw config;typed ref /metadata /status /error只承接core | not_run |
| environment_and_adapter | ENV-02 contract fixture identity可构造,不需要CI | not_run |
| external_and_tooling | core shared carriers可解析;contracts test harness | not_run |
| unavailable_disposition | shared type缺失回L0 /`wait_design`;不得自造private replacement | not_run |
| boundary_specific_activation | 01A Handoff Gate | not_run |

## Design Closure And Risk

| field | planned_value | actual_status |
|---|---|---|
| closure_profiles | contract / refs / metadata;BASE+CONTRACT | not_run |
| applicable_experience | support carrier闭口;typed-ref kind owner;metadata authority;public disposition;body-free | not_run |
| formal_evidence_location | `03`§6~§7 / §11;`05`§3 / §6;`06`§7.5 | not_run |
| explicit_non_applicability | UoW / projection rebuild不适用:只定义shared carrier | not_run |
| design_level_conclusion | `passed_design`;开工仍等待01A handoff | design_record_only |
| activation_or_design_closure | core shared type /kind /package与body-free carrier source map 1:1闭合 | not_run |
| safe_route_if_open_or_triggered | exact shared surface缺失回L0或`03/07`;不得alias错误kind、私造carrier或引入non-core依赖 | not_run |

| reference_type | full_references | execution_status |
|---|---|---|
| spike | `SP-SBX-IMP-002` | not_run |
| risk | `R-SBX-IMP-002`; `R-SBX-IMP-003`; `R-SBX-IMP-004`; `R-SBX-IMP-008`; `R-SBX-IMP-019`; `R-SBX-IMP-020` | not_run |
| open_question | `OQ-SBX-IMP-003` | not_run |

## Required Checks

| check_id | command_or_assertion | required_status | actual_status | evidence |
|---|---|---|---|---|
| CHK-ACTIVATION | Close predecessor CB-SBX-01A; 01A Handoff Gate | closed_or_formal_blocked | not_run | absent |
| CHK-DESIGN | contract / refs / metadata;BASE+CONTRACT; closure evidence: `03`§6~§7 / §11;`05`§3 / §6;`06`§7.5; repeat-check rule: `passed_design`;开工仍等待01A handoff | design_consistent | not_run | absent |
| CHK-SCOPE | Allowed: `crates/contracts/src/{lib,refs,metadata,kinds,status,errors,fixtures}.rs`;`tests/contracts/**`;`crates/contracts/Cargo.toml`; included behavior: `DEL-SBX-CODE-002`共享carrier增量;`CODE-010 /012`,`DATA-001`,`TEST-001`基础;`SandboxProtocolMetadataDto`,`ActorContext`,`Command / Query metadata`,`Page`,`Receipt`,`JobReport`,`PublicError`; forbidden: command业务DTO、domain state、repository / entry; 10 Command业务字段、domain、UoW、entry | scope_clean | not_run | absent |
| CHK-WORKTREE | Record target root, HEAD, initial git status, local identity, user-owned changes, and staged-file ownership. | worktree_recorded | not_run | absent |
| CHK-BUILD | carrier roundtrip、missing field、typed-ref family、digest input boundary、body-free / redaction contract tests和`cargo check -p sandbox-contracts`完成后 | pass_or_formal_allowed_status | not_run | absent |
| CHK-TEST | SUITE-SBX-001 contract slice:CTR-001~006;roundtrip、required field、typed-ref family、metadata / digest input、body-free / redaction | all_mandatory_pass | not_run | absent |
| CHK-AC-VETO | AC-SBX-031 /034 /035 /039 /040;VETO-SBX-005 /006 /016 | assertions_present_and_no_triggered_veto | not_run | absent |
| CHK-ARTIFACT | `no_runtime_artifact`:contract test结果与assertion只记boundary ledger,尚无canonical writer | maturity_contract_satisfied | not_run | absent |
| CHK-REPORT | 无run report;handoff列exact 6 /6 CTR结果与失败ref | paired_report_or_G0_reason | not_run | absent |
| CHK-EVIDENCE-MATURITY | G0;任一carrier / ref / metadata / safe-surface失败即不提交;不得先实现业务DTO绕过 | status_fidelity_and_safe_failure | not_run | absent |
| CHK-READINESS | Config/source: 无raw config;typed ref /metadata /status /error只承接core; ENV/adapter: ENV-02 contract fixture identity可构造,不需要CI; external/tool: core shared carriers可解析;contracts test harness; unavailable route: shared type缺失回L0 /`wait_design`;不得自造private replacement | ready_or_formally_blocked | not_run | absent |
| CHK-RISK | Close or confirm before Activation/Design: core shared type /kind /package与body-free carrier source map 1:1闭合; route: exact shared surface缺失回L0或`03/07`;不得alias错误kind、私造carrier或引入non-core依赖 | closed_or_routed | not_run | absent |
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

Boundary artifact contract: `no_runtime_artifact`:contract test结果与assertion只记boundary ledger,尚无canonical writer

Boundary report contract: 无run report;handoff列exact 6 /6 CTR结果与失败ref

Planned evidence/review reference: boundary ledger中的SUITE-SBX-001 contract slice与6 /6 carrier断言

Commit is allowed only when: body-free typed refs / metadata / status / error roundtrip及negative checks通过

Forbidden proof substitution: run report、业务DTO /状态

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
| planned_commit_title | `feat(contracts): add body-free shared sandbox carriers` |
| planned_commit_summary | `Add the shared safe carrier foundation for CB-SBX-02A.` |
| planned_body_groups | `Typed references and shared metadata:`;`Safe status, receipt, report, and error carriers:` |
| same_commit_cause | 三通道必须共享metadata、typed refs和safe disposition,拆开会产生临时私有carrier |
| planned_footer | `Co-Authored-By: Codex <noreply@openai.com>` |
| staged_files_checked | `not_run` |
| commit_message_checked | `not_run` |
| committed_hash | `not_committed` |
| committed_message | `not_committed` |
| post_commit_status | `not_run` |

## Review Record

| field | planned_or_actual_value |
|---|---|
| required_review_responsibility | contracts + security reviewer核formal type owner和forbidden-body拒绝 |
| type_and_scope_review | `feat(contracts)`对应shared carriers |
| body_group_review | refs / metadata与status / error不可拆 |
| review_and_evidence_discipline | contracts + security;G0 carrier checks |
| design_discipline_record | passed_design |
| future_repeat_check | core shared type实际兼容性 |
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

Expected successor after a real Handoff Gate pass: `CB-SBX-02B`. The project ledger alone activates that successor.

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
