# CB-SBX-10A implementation ledger

> Created by L4-sandbox Step 13 from reviewed Step 6~11 matrices.
> This is a planned recovery contract, not proof of implementation, test execution, evidence, review, acceptance, or authorization.

| field | value |
|---|---|
| project | `L4-sandbox` |
| boundary_id | `CB-SBX-10A` |
| phase | `PH-10` |
| verifiable_goal | 打通9 Consumer的schema、dedup、receipt和marker纵切。 |
| direct_predecessor | `CB-SBX-09B` |
| design_baseline | `not_fixed` |
| implementation_repo | `/home/aris/Projects/quantalithos-sandbox (absent)` |
| status | `planned` |
| next_allowed_action | `wait_until_current` |
| current_identity | no; wait for project-ledger activation |
| task_ids | `IMPL-SBX-10-01`; `IMPL-SBX-10-02` |
| batch_ids | `BATCH-SBX-10A-01`; `BATCH-SBX-10A-02`; `BATCH-SBX-10A-03`; `BATCH-SBX-10A-04` |
| evidence_maturity | G1;trusted source绕过、invalid仍write、body落仓、receipt重算、duplicate二写或consumer建core success即不提交 |
| implementation_started | `no` |

## Required Reads

| document | required_section | status | notes |
|---|---|---|---|
| projects/L4-sandbox/07-实施计划.md | §1, §3, §5~§12 and this exact boundary row in §6 | not_run | Formal implementation authority and control rules. |
| projects/L4-sandbox/03-详细设计.md | §7.2 / §7.5 / §7.7 / §8.4~§8.5 / §10.4 Consumer / §12 | not_run | Exact owner reading copied from Step 6 section 7.4. |
| projects/L4-sandbox/05-测试方案.md | CNS-001~022 | not_run | Exact owner reading copied from Step 6 section 7.4. |
| projects/L4-sandbox/06-验收标准.md | PG-SBX-024~032 | not_run | Exact owner reading copied from Step 6 section 7.4. |
| projects/L4-sandbox/design-calibration/03_ddd_step_08_protocol_contracts.md | `03_ddd_step_08_protocol_contracts.md` | not_run | Exact calibration or standard reference copied from Step 6 section 7.4. |
| projects/L4-sandbox/design-calibration/07_implementation_plan_step_06_tasks_commit_boundaries.md | consumer / state / replay校准 | not_run | Exact calibration or standard reference copied from Step 6 section 7.4. |
| projects/L4-sandbox/design-calibration/07_implementation_plan_step_06_tasks_commit_boundaries.md | §7.1, §7.2, §7.4~§7.8, §7.11; CB-SBX-10A | not_run | Goal, predecessor, closure profiles, scope, tasks, batches, checks, and skeleton schema. |
| projects/L4-sandbox/design-calibration/07_implementation_plan_step_07_test_acceptance_gates.md | §6 and §8; CB-SBX-10A | not_run | Exact suite, AC, VETO, artifact, report, maturity, and review gate. |
| projects/L4-sandbox/design-calibration/07_implementation_plan_step_08_boundary_readiness_matrix.md | CB-SBX-10A readiness row | not_run | Config, environment, adapter, external dependency, and unavailable disposition. |
| projects/L4-sandbox/design-calibration/07_implementation_plan_step_09_boundary_risk_matrix.md | CB-SBX-10A risk row | not_run | Full Spike, Risk, OQ, closure, and safe routing. |
| projects/L4-sandbox/design-calibration/07_implementation_plan_step_10_boundary_control_matrix.md | CB-SBX-10A control row | not_run | Pause, rollback, invalidation, and recovery routing. |
| projects/L4-sandbox/design-calibration/07_implementation_plan_step_11_boundary_commit_message_matrix.md | CB-SBX-10A planned message and commit timing rows | not_run | Exact title, summary, body groups, evidence references, and commit prohibition. |
| projects/L4-sandbox/design-calibration/07_implementation_plan_step_11_review_delivery_audit.md | CB-SBX-10A review and delivery rows | not_run | Independent review, worktree protection, delivery, and handoff discipline. |
| standards/document/代码实施台账与门禁规范.md | project ledger, boundary ledger, nine Gate types, blockers, Commit Gate, and Handoff Gate | not_run | State values and recovery contract. |
| standards/document/设计真相源闭环与可落码性标准.md | boundary codeability and design writeback rules | not_run | Implementation must not invent missing design truth. |
| standards/document/全局项目依赖关系与裁剪规则.md | L4 Sandbox dependency direction and sibling-repository trimming | not_run | Only the allowed core dependency may be compile-time; adjacent products remain ports, events, handoffs, or fakes. |
| standards/document/子项目目录与代码文件组织规范.md | workspace, crate, binary, scripts, artifacts, reports, and implementation-ledger layout | not_run | Directory and code-file organization authority. |
| standards/coding/rust.md | applicable Rust source, tests, formatting, lint, and naming rules | not_run | Target-repository rules may add stricter requirements after repository creation. |

## Allowed Scope

| type | path_or_rule | status |
|---|---|---|
| allowed_path_or_rule | `crates/contracts/src/{events,receipts,status,errors}.rs` | planned |
| allowed_path_or_rule | `crates/domain/src/{reference,handoff,control,relay,audit,errors}.rs` | planned |
| allowed_path_or_rule | `crates/application/src/{consumers,services,ports,repositories}.rs` | planned |
| allowed_path_or_rule | `crates/infra/src/{truth_repositories,fakes}.rs` | planned |
| allowed_path_or_rule | `crates/worker/src/{consumers,control_worker,worker_runtime,errors}.rs` | planned |
| allowed_path_or_rule | `tests/{contracts,service,integration}/**` | planned |
| included_behavior | `DEL-SBX-CODE-002`;`DEL-SBX-CODE-003`;`DEL-SBX-CODE-004`;`DEL-SBX-CODE-005`;`DEL-SBX-CODE-007`;`DEL-SBX-CODE-009`;`DEL-SBX-CODE-010`;`DEL-SBX-CODE-011`;`DEL-SBX-CODE-012`;`DEL-SBX-ADP-001`;9 Consumer envelope / payload / service / worker / receipt / marker | planned |
| boundary_goal | 打通9 Consumer的schema、dedup、receipt和marker纵切。 | planned |

## Forbidden Scope

| rule | status | failure_action |
|---|---|---|
| outbound publisher;core success creation;raw body;Job;real bus | active | block_scope_gate; remove the change or reopen design |
| outbound publisher;consumer建core success;real bus / topic | active | block_scope_gate; do not stage or commit |
| Do not implement tools semantic execution, runtime agent-loop orchestration, or member lifecycle orchestration inside Sandbox. | active | block_scope_gate; return the concern to its owning project |
| Do not use latest paths, static evidence aliases, prefilled Passed or acceptance decisions, raw secret or process bodies, or unrelated user changes. | active | block_evidence_or_worktree_gate; preserve safe failure material |

## Tasks And Batches

### Tasks

| task_id | order | implementation_action | input | completion_criterion |
|---|---|---|---|---|
| `IMPL-SBX-10-01` | 1 | 编写9 Consumer envelope / payload / receipt / error carrier | PG-SBX-024~032 | source / schema / digest / forbidden-body闭合 |
| `IMPL-SBX-10-02` | 2 | 编写dedup UoW、marker updates、stored receipt和worker disposition | CNS-001~022 | accepted / duplicate / delayed / quarantine闭合 |

### Batches

| batch_id | goal | input_to_output | expected_size | post_batch_check | commit_relation |
|---|---|---|---|---|---|
| `BATCH-SBX-10A-01` | reference consumers | Consumers 1~3 -> carrier / service / markers | 200~300 | CNS common +005~010 | one commit after every batch passes |
| `BATCH-SBX-10A-02` | lifecycle / handoff consumers | Consumers 4~6 -> carrier / service / markers | 200~300 | CNS-011~016;target / identity | one commit after every batch passes |
| `BATCH-SBX-10A-03` | control / investigation / relay feedback | Consumers 7~9 -> formal path / receipt | 200~300 | CNS-017~022;no core success | one commit after every batch passes |
| `BATCH-SBX-10A-04` | high-risk consumer UoW / entry | all 9 -> dedup / stored receipt / worker | 200~300 | duplicate / rollback / quarantine | one commit after every batch passes |

Subfunction grouping: three Consumer groups + shared dedup / receipt / worker UoW

Same-commit cause: 9 Consumer必须复用同一trusted-source、dedup、receipt和quarantine协议

Verification closure: CNS-001~022 / rollback

Explicitly excluded: outbound publish / core success

## Activation Readiness

| dimension | planned_requirement | actual_status |
|---|---|---|
| config_and_source | I007~I009 /I024 /I049 /I094~I101;9-key source /quarantine registry | not_run |
| environment_and_adapter | ENV-02 fixture consumers;ENV-03 controlled event seam | not_run |
| external_and_tooling | schema allowlist、source identity、dedup /receipt stores、worker loop | not_run |
| unavailable_disposition | missing enabled binding loop不启动;invalid quarantine;consumer不造core success | not_run |
| boundary_specific_activation | 09B Handoff Gate通过;shared marker / cursor / receipt contract稳定 | not_run |

## Design Closure And Risk

| field | planned_value | actual_status |
|---|---|---|
| closure_profiles | consumer / receipt / marker;BASE+CONTRACT+TXN+CONSUMER | not_run |
| applicable_experience | envelope source;dedup context;typed receipt save/get;reference cursor / trace subject;entry disposition;body-free | not_run |
| formal_evidence_location | `03`§7.5 / §8.4 / §10 / §12;`05`CNS;`06`PG-024~032 | not_run |
| explicit_non_applicability | outbound payload不适用:本boundary不publish | not_run |
| design_level_conclusion | `passed_design`;consumer不得创建core success | design_record_only |
| activation_or_design_closure | 9 source identity /schema /dedup /receipt /affected marker与quarantine闭合 | not_run |
| safe_route_if_open_or_triggered | enabled binding缺失loop不启动;consumer不得造core success、二写或吞duplicate | not_run |

| reference_type | full_references | execution_status |
|---|---|---|
| spike | `SP-SBX-IMP-007`; `SP-SBX-IMP-010` | not_run |
| risk | `R-SBX-IMP-003`; `R-SBX-IMP-005`; `R-SBX-IMP-008`; `R-SBX-IMP-010`; `R-SBX-IMP-011`; `R-SBX-IMP-019`; `R-SBX-IMP-020` | not_run |
| open_question | none_by_boundary_matrix | not_run |

## Required Checks

| check_id | command_or_assertion | required_status | actual_status | evidence |
|---|---|---|---|---|
| CHK-ACTIVATION | Close predecessor CB-SBX-09B; 09B Handoff Gate通过;shared marker / cursor / receipt contract稳定 | closed_or_formal_blocked | not_run | absent |
| CHK-DESIGN | consumer / receipt / marker;BASE+CONTRACT+TXN+CONSUMER; closure evidence: `03`§7.5 / §8.4 / §10 / §12;`05`CNS;`06`PG-024~032; repeat-check rule: `passed_design`;consumer不得创建core success | design_consistent | not_run | absent |
| CHK-SCOPE | Allowed: `crates/contracts/src/{events,receipts,status,errors}.rs`;`crates/domain/src/{reference,handoff,control,relay,audit,errors}.rs`;`crates/application/src/{consumers,services,ports,repositories}.rs`;`crates/infra/src/{truth_repositories,fakes}.rs`;`crates/worker/src/{consumers,control_worker,worker_runtime,errors}.rs`;`tests/{contracts,service,integration}/**`; included behavior: `DEL-SBX-CODE-002`;`DEL-SBX-CODE-003`;`DEL-SBX-CODE-004`;`DEL-SBX-CODE-005`;`DEL-SBX-CODE-007`;`DEL-SBX-CODE-009`;`DEL-SBX-CODE-010`;`DEL-SBX-CODE-011`;`DEL-SBX-CODE-012`;`DEL-SBX-ADP-001`;9 Consumer envelope / payload / service / worker / receipt / marker; forbidden: outbound publisher;core success creation;raw body;Job;real bus; outbound publisher;consumer建core success;real bus / topic | scope_clean | not_run | absent |
| CHK-WORKTREE | Record target root, HEAD, initial git status, local identity, user-owned changes, and staged-file ownership. | worktree_recorded | not_run | absent |
| CHK-BUILD | `CNS-001~022`;schema / source / forbidden body / dedup / accepted / duplicate / delayed / quarantine / target mismatch / rollback tests | pass_or_formal_allowed_status | not_run | absent |
| CHK-TEST | SUITE-SBX-005 /008 /011及007 /009 /010适用:CNS-001~022;9 Consumer schema / source / body / dedup / accepted / duplicate / delayed / quarantine / target mismatch / rollback | all_mandatory_pass | not_run | absent |
| CHK-AC-VETO | AC-SBX-008 /012 /015 /017~023 /029~041适用;AC-SBX-031 PROTOCOL-SLICE;VETO-SBX-005 /006 /009~013 /016 | assertions_present_and_no_triggered_veto | not_run | absent |
| CHK-ARTIFACT | G1 consumer / receipt / replay / consistency / error / audit / arch raw与redaction check | maturity_contract_satisfied | not_run | absent |
| CHK-REPORT | consumer / protocol suite reports、targeted redaction / report-audit | paired_report_or_G0_reason | not_run | absent |
| CHK-EVIDENCE-MATURITY | G1;trusted source绕过、invalid仍write、body落仓、receipt重算、duplicate二写或consumer建core success即不提交 | status_fidelity_and_safe_failure | not_run | absent |
| CHK-READINESS | Config/source: I007~I009 /I024 /I049 /I094~I101;9-key source /quarantine registry; ENV/adapter: ENV-02 fixture consumers;ENV-03 controlled event seam; external/tool: schema allowlist、source identity、dedup /receipt stores、worker loop; unavailable route: missing enabled binding loop不启动;invalid quarantine;consumer不造core success | ready_or_formally_blocked | not_run | absent |
| CHK-RISK | Close or confirm before Activation/Design: 9 source identity /schema /dedup /receipt /affected marker与quarantine闭合; route: enabled binding缺失loop不启动;consumer不得造core success、二写或吞duplicate | closed_or_routed | not_run | absent |
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

Boundary artifact contract: G1 consumer / receipt / replay / consistency / error / audit / arch raw与redaction check

Boundary report contract: consumer / protocol suite reports、targeted redaction / report-audit

Planned evidence/review reference: consumer / protocol reports及redaction / report audit

Commit is allowed only when: 9 /9 trusted source、schema、dedup、receipt、quarantine、rollback和duplicate owner-call通过

Forbidden proof substitution: outbound publish、core success

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
| planned_commit_title | `feat(consumer): consume trusted events idempotently` |
| planned_commit_summary | `Consume all trusted inbound event families idempotently for CB-SBX-10A.` |
| planned_body_groups | `Trusted consumer schemas and source checks:`;`Deduplication, receipt, and quarantine transaction:`;`Worker groups and replay verification:` |
| same_commit_cause | 9 Consumer必须共用trusted-source、dedup、receipt、marker和quarantine协议 |
| planned_footer | `Co-Authored-By: Codex <noreply@openai.com>` |
| staged_files_checked | `not_run` |
| commit_message_checked | `not_run` |
| committed_hash | `not_committed` |
| committed_message | `not_committed` |
| post_commit_status | `not_run` |

## Review Record

| field | planned_or_actual_value |
|---|---|
| required_review_responsibility | consumer / transaction / worker / security reviewer核9/9 source map、stored receipt和quarantine |
| type_and_scope_review | `feat(consumer)`对应trusted intake |
| body_group_review | schemas / dedup / worker groups共享receipt协议 |
| review_and_evidence_discipline | consumer + transaction + security |
| design_discipline_record | passed_design |
| future_repeat_check | 9 source maps / duplicate call budget |
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

Expected successor after a real Handoff Gate pass: `CB-SBX-10B`. The project ledger alone activates that successor.

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
