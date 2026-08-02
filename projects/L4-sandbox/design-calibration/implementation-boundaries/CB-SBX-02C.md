# CB-SBX-02C implementation ledger

> Created by L4-sandbox Step 13 from reviewed Step 6~11 matrices.
> This is a planned recovery contract, not proof of implementation, test execution, evidence, review, acceptance, or authorization.

| field | value |
|---|---|
| project | `L4-sandbox` |
| boundary_id | `CB-SBX-02C` |
| phase | `PH-02` |
| verifiable_goal | 建立RFC 8785 canonical machine artifact writer / verifier primitive。 |
| direct_predecessor | `CB-SBX-02B` |
| design_baseline | `not_fixed` |
| implementation_repo | `/home/aris/Projects/quantalithos-sandbox (absent)` |
| status | `planned` |
| next_allowed_action | `wait_until_current` |
| current_identity | no; wait for project-ledger activation |
| task_ids | `IMPL-SBX-02-05` |
| batch_ids | `BATCH-SBX-02C-01`; `BATCH-SBX-02C-02` |
| evidence_maturity | G1 fixture-only;RFC 8785设计选择已固定但fixtures未运行，digest / path / schema任一失败即不提交;原失败样本保留 |
| implementation_started | `no` |

## Required Reads

| document | required_section | status | notes |
|---|---|---|---|
| projects/L4-sandbox/07-实施计划.md | §1, §3, §5~§12 and this exact boundary row in §6 | not_run | Formal implementation authority and control rules. |
| projects/L4-sandbox/05-测试方案.md | §7.1~§7.5 / §9.4 / §13.1~§13.5 | not_run | Exact owner reading copied from Step 6 section 7.4. |
| projects/L4-sandbox/06-验收标准.md | §10.1~§10.4 | not_run | Exact owner reading copied from Step 6 section 7.4. |
| projects/L4-sandbox/design-calibration/07_implementation_plan_step_15_technical_baseline_decisions.md | §3 and §5 | not_run | Exact provider/version, strict verifier, self-digest algorithm, fixtures and Activation split. |
| projects/L4-sandbox/design-calibration/05_test_plan_step_13_evidence.md | `05_test_plan_step_13_evidence.md` | not_run | Exact calibration or standard reference copied from Step 6 section 7.4. |
| projects/L4-sandbox/design-calibration/05_test_plan_step_13_evidence_schemas.md | `05_test_plan_step_13_evidence_schemas.md` | not_run | Exact calibration or standard reference copied from Step 6 section 7.4. |
| projects/L4-sandbox/design-calibration/07_implementation_plan_step_03_prerequisites_reading.md | Step 3 PRE-SBX-008 | not_run | Exact calibration or standard reference copied from Step 6 section 7.4. |
| projects/L4-sandbox/design-calibration/07_implementation_plan_step_06_tasks_commit_boundaries.md | §7.1, §7.2, §7.4~§7.8, §7.11; CB-SBX-02C | not_run | Goal, predecessor, closure profiles, scope, tasks, batches, checks, and skeleton schema. |
| projects/L4-sandbox/design-calibration/07_implementation_plan_step_07_test_acceptance_gates.md | §6 and §8; CB-SBX-02C | not_run | Exact suite, AC, VETO, artifact, report, maturity, and review gate. |
| projects/L4-sandbox/design-calibration/07_implementation_plan_step_08_boundary_readiness_matrix.md | CB-SBX-02C readiness row | not_run | Config, environment, adapter, external dependency, and unavailable disposition. |
| projects/L4-sandbox/design-calibration/07_implementation_plan_step_09_boundary_risk_matrix.md | CB-SBX-02C risk row | not_run | Full Spike, Risk, OQ, closure, and safe routing. |
| projects/L4-sandbox/design-calibration/07_implementation_plan_step_10_boundary_control_matrix.md | CB-SBX-02C control row | not_run | Pause, rollback, invalidation, and recovery routing. |
| projects/L4-sandbox/design-calibration/07_implementation_plan_step_11_boundary_commit_message_matrix.md | CB-SBX-02C planned message and commit timing rows | not_run | Exact title, summary, body groups, evidence references, and commit prohibition. |
| projects/L4-sandbox/design-calibration/07_implementation_plan_step_11_review_delivery_audit.md | CB-SBX-02C review and delivery rows | not_run | Independent review, worktree protection, delivery, and handoff discipline. |
| standards/document/代码实施台账与门禁规范.md | project ledger, boundary ledger, nine Gate types, blockers, Commit Gate, and Handoff Gate | not_run | State values and recovery contract. |
| standards/document/设计真相源闭环与可落码性标准.md | boundary codeability and design writeback rules | not_run | Implementation must not invent missing design truth. |
| standards/document/全局项目依赖关系与裁剪规则.md | L4 Sandbox dependency direction and sibling-repository trimming | not_run | Only the allowed core dependency may be compile-time; adjacent products remain ports, events, handoffs, or fakes. |
| standards/document/子项目目录与代码文件组织规范.md | workspace, crate, binary, scripts, artifacts, reports, and implementation-ledger layout | not_run | Directory and code-file organization authority. |
| standards/coding/rust.md | applicable Rust source, tests, formatting, lint, and naming rules | not_run | Target-repository rules may add stricter requirements after repository creation. |

## Allowed Scope

| type | path_or_rule | status |
|---|---|---|
| allowed_path_or_rule | `tests/support/**` | planned |
| allowed_path_or_rule | canonical writer / verifier support及fixtures | planned |
| included_behavior | `DEL-SBX-EVD-001`;`DEL-SBX-EVD-003`;`DEL-SBX-DATA-001`增量;九schema共享identity / path / status / RFC 8785 / sha256 writer-verifier primitive | planned |
| boundary_goal | 建立RFC 8785 canonical machine artifact writer / verifier primitive。 | planned |

## Forbidden Scope

| rule | status | failure_action |
|---|---|---|
| script编排;static EV / pass;业务case;acceptance draft | active | block_scope_gate; remove the change or reopen design |
| gate编排、report renderer、业务suite、static pass | active | block_scope_gate; do not stage or commit |
| Do not implement tools semantic execution, runtime agent-loop orchestration, or member lifecycle orchestration inside Sandbox. | active | block_scope_gate; return the concern to its owning project |
| Do not use latest paths, static evidence aliases, prefilled Passed or acceptance decisions, raw secret or process bodies, or unrelated user changes. | active | block_evidence_or_worktree_gate; preserve safe failure material |

## Tasks And Batches

### Tasks

| task_id | order | implementation_action | input | completion_criterion |
|---|---|---|---|---|
| `IMPL-SBX-02-05` | 5 | 按Step 15固定provider与算法实现RFC 8785 canonical writer / verifier及九schema共享identity | `05`§13;Step 15 §3 | canonical bytes / self-digest / relative path可测 |

### Batches

| batch_id | goal | input_to_output | expected_size | post_batch_check | commit_relation |
|---|---|---|---|---|---|
| `BATCH-SBX-02C-01` | machine identity / path | schema contract -> shared structs / path validator | 150~250 | path escape / enum / required fixture | one commit after every batch passes |
| `BATCH-SBX-02C-02` | canonical digest | selected RFC 8785 tool -> writer / verifier | 200~300 | canonical / noncanonical / self-digest | one commit after every batch passes |

Subfunction grouping: machine identity / path + canonical digest

Same-commit cause: writer与verifier必须共享同一schema identity、canonical bytes和self-digest规则

Verification closure: canonical roundtrip fixtures

Explicitly excluded: scripts / reports

## Activation Readiness

| dimension | planned_requirement | actual_status |
|---|---|---|
| config_and_source | machine schema identity /path /status不来自runtime config | not_run |
| environment_and_adapter | ENV-02 synthetic artifact corpus;无真实run | not_run |
| external_and_tooling | RFC 8785 implementation、sha256 rules、canonical /noncanonical /self-digest /path fixtures | not_run |
| unavailable_disposition | PRE-SBX-008未关闭则blocked;禁止以`jq` /`sha256sum`存在代替 | not_run |
| boundary_specific_activation | RFC 8785实现库 / verifier工具固定 | not_run |

## Design Closure And Risk

| field | planned_value | actual_status |
|---|---|---|
| closure_profiles | evidence schema;BASE+EVIDENCE | not_run |
| applicable_experience | machine JSON schema;artifact materialization;path baseline;canonical digest;writer / reader owner | not_run |
| formal_evidence_location | `05`§13.1~§13.5;`06`§10.1~§10.4 | not_run |
| explicit_non_applicability | command / query / job不适用:只处理synthetic schema fixture | not_run |
| design_level_conclusion | `passed_design_pending_activation`:provider、版本、strict verifier与digest算法已固定；target resolution及fixtures未运行 | design_record_only |
| activation_or_design_closure | RFC 8785实现 /verifier、canonical /self-digest /path fixtures与schema owner确定 | not_run |
| safe_route_if_open_or_triggered | `blocked`;无合格现实tool记`dependency_wait`并`handoff`,schema冲突`wait_design`,当前scope writer错误`fix_gate_failure`;不得静态EV、Passed或命令存在性替代 | not_run |

| reference_type | full_references | execution_status |
|---|---|---|
| spike | `SP-SBX-IMP-003` | not_run |
| risk | `R-SBX-IMP-003`; `R-SBX-IMP-008`; `R-SBX-IMP-013`; `R-SBX-IMP-014`; `R-SBX-IMP-019`; `R-SBX-IMP-020` | not_run |
| open_question | `OQ-SBX-IMP-004` | not_run |

## Required Checks

| check_id | command_or_assertion | required_status | actual_status | evidence |
|---|---|---|---|---|
| CHK-ACTIVATION | Close predecessor CB-SBX-02B; RFC 8785实现库 / verifier工具固定 | closed_or_formal_blocked | not_run | absent |
| CHK-DESIGN | evidence schema;BASE+EVIDENCE; closure evidence: `05`§13.1~§13.5;`06`§10.1~§10.4;Step 15 §3; repeat-check rule: fixed provider/version/algorithm, target resolution and fixtures remain Activation facts | design_consistent | not_run | absent |
| CHK-SCOPE | Allowed: `tests/support/**`;canonical writer / verifier support及fixtures; included behavior: `DEL-SBX-EVD-001`;`DEL-SBX-EVD-003`;`DEL-SBX-DATA-001`增量;九schema共享identity / path / status / RFC 8785 / sha256 writer-verifier primitive; forbidden: script编排;static EV / pass;业务case;acceptance draft; gate编排、report renderer、业务suite、static pass | scope_clean | not_run | absent |
| CHK-WORKTREE | Record target root, HEAD, initial git status, local identity, user-owned changes, and staged-file ownership. | worktree_recorded | not_run | absent |
| CHK-BUILD | `SBX-IMP-CANONICAL-JSON-001`关闭;canonical / noncanonical / self-digest / path escape / redaction fixtures和writer-reader roundtrip完成后 | pass_or_formal_allowed_status | not_run | absent |
| CHK-TEST | canonical / noncanonical / self-digest / path escape / schema status / redaction writer-reader fixtures;不认领业务suite主结果 | all_mandatory_pass | not_run | absent |
| CHK-AC-VETO | AC-SBX-035 /039;EG-SBX-001~007前置;VETO-SBX-006 /017 | assertions_present_and_no_triggered_veto | not_run | absent |
| CHK-ARTIFACT | fixture-only `artifacts/test/<run_id>/meta/*`,`checks/*`及safe schema样本;无source role / EV | maturity_contract_satisfied | not_run | absent |
| CHK-REPORT | `reports/runs/<run_id>/summary.md`与fixture detail,只从raw生成 | paired_report_or_G0_reason | not_run | absent |
| CHK-EVIDENCE-MATURITY | G1 fixture-only;fixed provider未解析或任一digest / path / schema fixture失败即不提交;原失败样本保留 | status_fidelity_and_safe_failure | not_run | absent |
| CHK-READINESS | Config/source: machine schema identity /path /status不来自runtime config; ENV/adapter: ENV-02 synthetic artifact corpus;无真实run; external/tool: RFC 8785 implementation、sha256 rules、canonical /noncanonical /self-digest /path fixtures; unavailable route: PRE-SBX-008未关闭则blocked;禁止以`jq` /`sha256sum`存在代替 | ready_or_formally_blocked | not_run | absent |
| CHK-RISK | Close or confirm before Activation/Design: RFC 8785实现 /verifier、canonical /self-digest /path fixtures与schema owner确定; route: `blocked`;无合格现实tool记`dependency_wait`并`handoff`,schema冲突`wait_design`,当前scope writer错误`fix_gate_failure`;不得静态EV、Passed或命令存在性替代 | closed_or_routed | not_run | absent |
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

Boundary artifact contract: fixture-only `artifacts/test/<run_id>/meta/*`,`checks/*`及safe schema样本;无source role / EV

Boundary report contract: `reports/runs/<run_id>/summary.md`与fixture detail,只从raw生成

Planned evidence/review reference: `artifacts/test/<run_id>` fixture raw + `reports/runs/<run_id>/summary.md`及fixture detail

Commit is allowed only when: RFC 8785方案已关闭且canonical / digest / path / redaction roundtrip配对成功

Forbidden proof substitution: source role、EV、业务suite

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
| planned_commit_title | `feat(evidence): add canonical machine artifact primitives` |
| planned_commit_summary | `Add canonical machine artifact identity and digest primitives for CB-SBX-02C.` |
| planned_body_groups | `Machine artifact identity and paths:`;`Canonical digest writer and verifier:` |
| same_commit_cause | writer / verifier必须共享schema identity、canonical bytes、self-digest和path规则 |
| planned_footer | `Co-Authored-By: Codex <noreply@openai.com>` |
| staged_files_checked | `not_run` |
| commit_message_checked | `not_run` |
| committed_hash | `not_committed` |
| committed_message | `not_committed` |
| post_commit_status | `not_run` |

## Review Record

| field | planned_or_actual_value |
|---|---|
| required_review_responsibility | evidence tooling + security reviewer核canonical bytes、self-digest、path和safe finding |
| type_and_scope_review | `feat(evidence)`对应canonical primitive |
| body_group_review | identity / path与digest writer / verifier不可拆 |
| review_and_evidence_discipline | evidence + security;G1 paired fixture |
| design_discipline_record | passed_with_precondition |
| future_repeat_check | target dependency resolution与canonical fixture执行后重核 |
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

Expected successor after a real Handoff Gate pass: `CB-SBX-02D`. The project ledger alone activates that successor.

## Blockers

| blocker_id | gate | status | reason | design_fix_baseline | next_allowed_action |
|---|---|---|---|---|---|
| `BLK-SBX-HDO-001` | activation_gate | resolved | Step 13 formal package review prerequisite is closed; this does not pass the Activation Gate. | not_fixed | wait_until_current |
| `BLK-SBX-BASELINE-001` | design_gate | open_wait_explicit_commit_authorization | Reproducible design commit baseline is not fixed. | not_fixed | wait_until_current |
| `BLK-SBX-CANONICAL-001` | design_gate | resolved_for_design_selection | `serde_json_canonicalizer = "=0.3.2"`, strict verifier, self-digest and SHA-256 rules are fixed by Step 15. | not_fixed | wait_until_current |
| `BLK-SBX-CANONICAL-VERIFY-001` | activation_gate | open_activation_validation | Target dependency resolution and required official/negative/roundtrip fixtures have not run. | not_fixed | wait_until_current |

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

## PHYSICAL EOF Current Override: final design closure `DC-05`

```text
boundary_id = CB-SBX-02C
design_baseline = not_fixed
status = planned
next_allowed_action = wait_until_current
canonical_owner = CB-SBX-02C_only
canonical_provider = serde_json_canonicalizer_=0.3.2|serde_json_=1.0.145_float_roundtrip|sha2_=0.10.9
design_selection = resolved_for_design_selection
activation_verification = BLK-SBX-CANONICAL-VERIFY-001_open_not_run
implementation_started = no
real_test_execution = not_started
real_evidence_created = no
```
