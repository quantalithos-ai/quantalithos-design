# CB-SBX-03A implementation ledger

> Created by L4-sandbox Step 13 from reviewed Step 6~11 matrices.
> This is a planned recovery contract, not proof of implementation, test execution, evidence, review, acceptance, or authorization.

| field | value |
|---|---|
| project | `L4-sandbox` |
| boundary_id | `CB-SBX-03A` |
| phase | `PH-03` |
| verifiable_goal | 严格解析并验证40组 /101项 /44域typed config。 |
| direct_predecessor | `CB-SBX-02D` |
| design_baseline | `not_fixed` |
| implementation_repo | `/home/aris/Projects/quantalithos-sandbox (absent)` |
| status | `planned` |
| next_allowed_action | `wait_until_current` |
| current_identity | no; wait for project-ledger activation |
| task_ids | `IMPL-SBX-03-01`; `IMPL-SBX-03-02`; `IMPL-SBX-03-03` |
| batch_ids | `BATCH-SBX-03A-01`; `BATCH-SBX-03A-02`; `BATCH-SBX-03A-03`; `BATCH-SBX-03A-04` |
| evidence_maturity | G1;invalid输入非0 publication、分母漂移、unsafe issue或unsupported silent ignore均不提交;new surface DesignReopen |
| implementation_started | `no` |

## Required Reads

| document | required_section | status | notes |
|---|---|---|---|
| projects/L4-sandbox/07-实施计划.md | §1, §3, §5~§12 and this exact boundary row in §6 | not_run | Formal implementation authority and control rules. |
| projects/L4-sandbox/04-配置设计.md | §3~§5 / §7 / §9.1~§9.10 / §11 | not_run | Exact owner reading copied from Step 6 section 7.4. |
| projects/L4-sandbox/05-测试方案.md | CFG-001~030 / ARCH-001~003 | not_run | Exact owner reading copied from Step 6 section 7.4. |
| projects/L4-sandbox/design-calibration/04_config_step_07_config_items.md | `04_config_step_07_config_items.md` | not_run | Exact calibration or standard reference copied from Step 6 section 7.4. |
| projects/L4-sandbox/design-calibration/04_config_step_09_loading_validation_activation.md | `04_config_step_09_loading_validation_activation.md` | not_run | Exact calibration or standard reference copied from Step 6 section 7.4. |
| projects/L4-sandbox/design-calibration/04_config_step_11_failure_degradation.md | `04_config_step_11_failure_degradation.md` | not_run | Exact calibration or standard reference copied from Step 6 section 7.4. |
| projects/L4-sandbox/design-calibration/07_implementation_plan_step_06_tasks_commit_boundaries.md | §7.1, §7.2, §7.4~§7.8, §7.11; CB-SBX-03A | not_run | Goal, predecessor, closure profiles, scope, tasks, batches, checks, and skeleton schema. |
| projects/L4-sandbox/design-calibration/07_implementation_plan_step_07_test_acceptance_gates.md | §6 and §8; CB-SBX-03A | not_run | Exact suite, AC, VETO, artifact, report, maturity, and review gate. |
| projects/L4-sandbox/design-calibration/07_implementation_plan_step_08_boundary_readiness_matrix.md | CB-SBX-03A readiness row | not_run | Config, environment, adapter, external dependency, and unavailable disposition. |
| projects/L4-sandbox/design-calibration/07_implementation_plan_step_09_boundary_risk_matrix.md | CB-SBX-03A risk row | not_run | Full Spike, Risk, OQ, closure, and safe routing. |
| projects/L4-sandbox/design-calibration/07_implementation_plan_step_10_boundary_control_matrix.md | CB-SBX-03A control row | not_run | Pause, rollback, invalidation, and recovery routing. |
| projects/L4-sandbox/design-calibration/07_implementation_plan_step_11_boundary_commit_message_matrix.md | CB-SBX-03A planned message and commit timing rows | not_run | Exact title, summary, body groups, evidence references, and commit prohibition. |
| projects/L4-sandbox/design-calibration/07_implementation_plan_step_11_review_delivery_audit.md | CB-SBX-03A review and delivery rows | not_run | Independent review, worktree protection, delivery, and handoff discipline. |
| standards/document/代码实施台账与门禁规范.md | project ledger, boundary ledger, nine Gate types, blockers, Commit Gate, and Handoff Gate | not_run | State values and recovery contract. |
| standards/document/设计真相源闭环与可落码性标准.md | boundary codeability and design writeback rules | not_run | Implementation must not invent missing design truth. |
| standards/document/全局项目依赖关系与裁剪规则.md | L4 Sandbox dependency direction and sibling-repository trimming | not_run | Only the allowed core dependency may be compile-time; adjacent products remain ports, events, handoffs, or fakes. |
| standards/document/子项目目录与代码文件组织规范.md | workspace, crate, binary, scripts, artifacts, reports, and implementation-ledger layout | not_run | Directory and code-file organization authority. |
| standards/coding/rust.md | applicable Rust source, tests, formatting, lint, and naming rules | not_run | Target-repository rules may add stricter requirements after repository creation. |

## Allowed Scope

| type | path_or_rule | status |
|---|---|---|
| allowed_path_or_rule | `crates/infra/src/config.rs` | planned |
| allowed_path_or_rule | `tests/{integration,support}/**` | planned |
| allowed_path_or_rule | `crates/infra/Cargo.toml` | planned |
| included_behavior | `DEL-SBX-CFG-001`;`DEL-SBX-CFG-002`;`DEL-SBX-CFG-003`;`DEL-SBX-CODE-005`;`DEL-SBX-DATA-001`;`DEL-SBX-DATA-002`增量;S01~S06 lane、40组、I001~I101、D01~D44、NCFG / FC / XVAL | planned |
| boundary_goal | 严格解析并验证40组 /101项 /44域typed config。 | planned |

## Forbidden Scope

| rule | status | failure_action |
|---|---|---|
| runtime service assembly、candidate、raw secret / implicit default | active | block_scope_gate; remove the change or reopen design |
| runtime publication、material resolve、candidate、implicit default | active | block_scope_gate; do not stage or commit |
| Do not implement tools semantic execution, runtime agent-loop orchestration, or member lifecycle orchestration inside Sandbox. | active | block_scope_gate; return the concern to its owning project |
| Do not use latest paths, static evidence aliases, prefilled Passed or acceptance decisions, raw secret or process bodies, or unrelated user changes. | active | block_evidence_or_worktree_gate; preserve safe failure material |

## Tasks And Batches

### Tasks

| task_id | order | implementation_action | input | completion_criterion |
|---|---|---|---|---|
| `IMPL-SBX-03-01` | 1 | 编写S01~S06分lane source selector和single raw owner | `04`§3~§5 | unknown / duplicate / ambiguous稳定拒绝 |
| `IMPL-SBX-03-02` | 2 | 编写40组、I001~I101、D01~D44 typed schema和coverage index | `04`§7 | 101 /44机械闭集,无implicit default |
| `IMPL-SBX-03-03` | 3 | 编写NCFG / FC / XVAL validator和safe issue mapping | `04`§9 / §11 | invalid composition在builder前关闭 |

### Batches

| batch_id | goal | input_to_output | expected_size | post_batch_check | commit_relation |
|---|---|---|---|---|---|
| `BATCH-SBX-03A-01` | source selector / parse | S lanes -> strict raw parse | 200~300 | unknown / duplicate / unreadable fixtures | one commit after every batch passes |
| `BATCH-SBX-03A-02` | typed schema part A | I001~I101 owner table -> typed groups 1~20 | 200~300 | coverage index subset | one commit after every batch passes |
| `BATCH-SBX-03A-03` | typed schema part B | owner table -> typed groups 21~40 / D01~D44 | 200~300 | 101 /44 complete coverage | one commit after every batch passes |
| `BATCH-SBX-03A-04` | validation high risk | NCFG / FC / XVAL -> stable safe issues | 200~300 | CFG negative corpus | one commit after every batch passes |

Subfunction grouping: raw selector + typed schema + validator

Same-commit cause: 只有三者同提交才能保证invalid config在publication前被完整拒绝

Verification closure: CFG / ARCH negative corpus

Explicitly excluded: runtime publication

## Activation Readiness

| dimension | planned_requirement | actual_status |
|---|---|---|
| config_and_source | S00~S08;40组 /I001~I101 /D01~D44 expected manifests;NCFG /FC /XVAL;single raw owner | not_run |
| environment_and_adapter | ENV-01 loader smoke + ENV-02 negative config corpus;P01~07 eligibility static | not_run |
| external_and_tooling | normalized JSON corpus、allowlisted env mapping、config coverage index | not_run |
| unavailable_disposition | unknown /duplicate /ambiguous /unsupported即0 publication;不得补implicit default | not_run |
| boundary_specific_activation | strict schema baseline未漂移 | not_run |

## Design Closure And Risk

| field | planned_value | actual_status |
|---|---|---|
| closure_profiles | config schema / validation;BASE+CONFIG | not_run |
| applicable_experience | validation truth;single raw owner;exact item owner;unsupported branch;safe issue / no default | not_run |
| formal_evidence_location | `04`§3~§5 / §7 / §9 / §11;`05`CFG / ARCH | not_run |
| explicit_non_applicability | idempotency / outbox不适用:config load不写业务transaction | not_run |
| design_level_conclusion | `passed_design`;新增key / default须wait_design | design_record_only |
| activation_or_design_closure | 40组 /101项 /44域expected manifest、single raw owner、NCFG /FC /XVAL与0-publication规则闭合 | not_run |
| safe_route_if_open_or_triggered | config owner缺口`wait_design`;unknown /ambiguous /forbidden source保持Failed且0 publication | not_run |

| reference_type | full_references | execution_status |
|---|---|---|
| spike | `SP-SBX-IMP-005` | not_run |
| risk | `R-SBX-IMP-003`; `R-SBX-IMP-006`; `R-SBX-IMP-008`; `R-SBX-IMP-019`; `R-SBX-IMP-020` | not_run |
| open_question | none_by_boundary_matrix | not_run |

## Required Checks

| check_id | command_or_assertion | required_status | actual_status | evidence |
|---|---|---|---|---|
| CHK-ACTIVATION | Close predecessor CB-SBX-02D; strict schema baseline未漂移 | closed_or_formal_blocked | not_run | absent |
| CHK-DESIGN | config schema / validation;BASE+CONFIG; closure evidence: `04`§3~§5 / §7 / §9 / §11;`05`CFG / ARCH; repeat-check rule: `passed_design`;新增key / default须wait_design | design_consistent | not_run | absent |
| CHK-SCOPE | Allowed: `crates/infra/src/config.rs`;`tests/{integration,support}/**`;`crates/infra/Cargo.toml`; included behavior: `DEL-SBX-CFG-001`;`DEL-SBX-CFG-002`;`DEL-SBX-CFG-003`;`DEL-SBX-CODE-005`;`DEL-SBX-DATA-001`;`DEL-SBX-DATA-002`增量;S01~S06 lane、40组、I001~I101、D01~D44、NCFG / FC / XVAL; forbidden: runtime service assembly、candidate、raw secret / implicit default; runtime publication、material resolve、candidate、implicit default | scope_clean | not_run | absent |
| CHK-WORKTREE | Record target root, HEAD, initial git status, local identity, user-owned changes, and staged-file ownership. | worktree_recorded | not_run | absent |
| CHK-BUILD | `CFG-001~030`,`ARCH-001~003`适用;strict unknown / duplicate / ambiguous / unsupported / redacted issue fixtures;config coverage index完整后 | pass_or_formal_allowed_status | not_run | absent |
| CHK-TEST | SUITE-SBX-003:CFG-001~030 + ARCH-001~003适用;strict unknown / duplicate / ambiguous / unsupported、40 /101 /44 coverage、redacted issue | all_mandatory_pass | not_run | absent |
| CHK-AC-VETO | AC-SBX-031 /035 /037 /038 /041;VETO-SBX-006~008 /016 | assertions_present_and_no_triggered_veto | not_run | absent |
| CHK-ARTIFACT | G1 `suites/SUITE-SBX-003/*`及dependency / redaction raw checks | maturity_contract_satisfied | not_run | absent |
| CHK-REPORT | suite report、`dependency-boundary.md`,`redaction-check.md` | paired_report_or_G0_reason | not_run | absent |
| CHK-EVIDENCE-MATURITY | G1;invalid输入非0 publication、分母漂移、unsafe issue或unsupported silent ignore均不提交;new surface DesignReopen | status_fidelity_and_safe_failure | not_run | absent |
| CHK-READINESS | Config/source: S00~S08;40组 /I001~I101 /D01~D44 expected manifests;NCFG /FC /XVAL;single raw owner; ENV/adapter: ENV-01 loader smoke + ENV-02 negative config corpus;P01~07 eligibility static; external/tool: normalized JSON corpus、allowlisted env mapping、config coverage index; unavailable route: unknown /duplicate /ambiguous /unsupported即0 publication;不得补implicit default | ready_or_formally_blocked | not_run | absent |
| CHK-RISK | Close or confirm before Activation/Design: 40组 /101项 /44域expected manifest、single raw owner、NCFG /FC /XVAL与0-publication规则闭合; route: config owner缺口`wait_design`;unknown /ambiguous /forbidden source保持Failed且0 publication | closed_or_routed | not_run | absent |
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

Boundary artifact contract: G1 `suites/SUITE-SBX-003/*`及dependency / redaction raw checks

Boundary report contract: suite report、`dependency-boundary.md`,`redaction-check.md`

Planned evidence/review reference: SUITE-SBX-003 report、`dependency-boundary.md`,`redaction-check.md`

Commit is allowed only when: 40 /101 /44 coverage与unknown /duplicate /ambiguous /unsupported负向语料全部按strict semantics通过

Forbidden proof substitution: implicit default、partial publication

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
| planned_commit_title | `feat(config): add strict typed sandbox configuration loading` |
| planned_commit_summary | `Add strict source selection, typed loading, and validation for CB-SBX-03A.` |
| planned_body_groups | `Raw configuration selection and source precedence:`;`Typed schema and coverage manifests:`;`Strict validation and negative corpus:` |
| same_commit_cause | selector、schema、coverage和validator共同保证invalid输入在publication前被拒绝 |
| planned_footer | `Co-Authored-By: Codex <noreply@openai.com>` |
| staged_files_checked | `not_run` |
| commit_message_checked | `not_run` |
| committed_hash | `not_committed` |
| committed_message | `not_committed` |
| post_commit_status | `not_run` |

## Review Record

| field | planned_or_actual_value |
|---|---|
| required_review_responsibility | config + architecture + security reviewer核FDT / NCFG / FC / XVAL与absence |
| type_and_scope_review | `feat(config)`对应strict loader |
| body_group_review | selector / schema / validator共同阻断invalid publication |
| review_and_evidence_discipline | config + architecture + security |
| design_discipline_record | passed_design |
| future_repeat_check | 40 /101 /44 actual manifest |
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

Expected successor after a real Handoff Gate pass: `CB-SBX-03B`. The project ledger alone activates that successor.

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
