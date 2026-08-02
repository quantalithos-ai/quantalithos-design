# CB-SBX-07B implementation ledger

> Created by L4-sandbox Step 13 from reviewed Step 6~11 matrices.
> This is a planned recovery contract, not proof of implementation, test execution, evidence, review, acceptance, or authorization.

| field | value |
|---|---|
| project | `L4-sandbox` |
| boundary_id | `CB-SBX-07B` |
| phase | `PH-07` |
| verifiable_goal | 通过`CaptureCollectionPort::{collect_capture, inspect_capture}`记录不可变body-free `CaptureFact`，诚实保留complete / partial / failed / unavailable。 |
| direct_predecessor | `CB-SBX-07A` |
| design_baseline | `not_fixed` |
| implementation_repo | `/home/aris/Projects/quantalithos-sandbox (absent)` |
| status | `planned` |
| next_allowed_action | `wait_until_current` |
| current_identity | no; wait for project-ledger activation |
| task_ids | `IMPL-SBX-07-02` |
| batch_ids | `BATCH-SBX-07B-01`; `BATCH-SBX-07B-02`; `BATCH-SBX-07B-03` |
| evidence_maturity | G1;raw process output、`CaptureFactStatus`含`Pending`或创建后改写、Partial升Complete、Artifact / Obs truth升格、unknown时重新collect或rollback不诚实即不提交 |
| implementation_started | `no` |

## Required Reads

| document | required_section | status | notes |
|---|---|---|---|
| projects/L4-sandbox/07-实施计划.md | §1, §3, §5~§12 and this exact boundary row in §6 | not_run | Formal implementation authority and control rules. |
| projects/L4-sandbox/03-详细设计.md | §6 capture / §7.3 Command 5 / §8.5 capture flow / §9 / §11 | not_run | Exact owner reading copied from Step 6 section 7.4. |
| projects/L4-sandbox/05-测试方案.md | CMD-009/010 | not_run | Exact owner reading copied from Step 6 section 7.4. |
| projects/L4-sandbox/06-验收标准.md | PG-SBX-005 | not_run | Exact owner reading copied from Step 6 section 7.4. |
| projects/L4-sandbox/design-calibration/07_implementation_plan_step_06_tasks_commit_boundaries.md | capture / material / observability handoff校准 | not_run | Exact calibration or standard reference copied from Step 6 section 7.4. |
| projects/L4-sandbox/design-calibration/07_implementation_plan_step_06_tasks_commit_boundaries.md | `04`§8 | not_run | Exact calibration or standard reference copied from Step 6 section 7.4. |
| projects/L4-sandbox/design-calibration/07_implementation_plan_step_06_tasks_commit_boundaries.md | §7.1, §7.2, §7.4~§7.8, §7.11; CB-SBX-07B | not_run | Goal, predecessor, closure profiles, scope, tasks, batches, checks, and skeleton schema. |
| projects/L4-sandbox/design-calibration/07_implementation_plan_step_07_test_acceptance_gates.md | §6 and §8; CB-SBX-07B | not_run | Exact suite, AC, VETO, artifact, report, maturity, and review gate. |
| projects/L4-sandbox/design-calibration/07_implementation_plan_step_08_boundary_readiness_matrix.md | CB-SBX-07B readiness row | not_run | Config, environment, adapter, external dependency, and unavailable disposition. |
| projects/L4-sandbox/design-calibration/07_implementation_plan_step_09_boundary_risk_matrix.md | CB-SBX-07B risk row | not_run | Full Spike, Risk, OQ, closure, and safe routing. |
| projects/L4-sandbox/design-calibration/07_implementation_plan_step_10_boundary_control_matrix.md | CB-SBX-07B control row | not_run | Pause, rollback, invalidation, and recovery routing. |
| projects/L4-sandbox/design-calibration/07_implementation_plan_step_11_boundary_commit_message_matrix.md | CB-SBX-07B planned message and commit timing rows | not_run | Exact title, summary, body groups, evidence references, and commit prohibition. |
| projects/L4-sandbox/design-calibration/07_implementation_plan_step_11_review_delivery_audit.md | CB-SBX-07B review and delivery rows | not_run | Independent review, worktree protection, delivery, and handoff discipline. |
| standards/document/代码实施台账与门禁规范.md | project ledger, boundary ledger, nine Gate types, blockers, Commit Gate, and Handoff Gate | not_run | State values and recovery contract. |
| standards/document/设计真相源闭环与可落码性标准.md | boundary codeability and design writeback rules | not_run | Implementation must not invent missing design truth. |
| standards/document/全局项目依赖关系与裁剪规则.md | L4 Sandbox dependency direction and sibling-repository trimming | not_run | Only the allowed core dependency may be compile-time; adjacent products remain ports, events, handoffs, or fakes. |
| standards/document/子项目目录与代码文件组织规范.md | workspace, crate, binary, scripts, artifacts, reports, and implementation-ledger layout | not_run | Directory and code-file organization authority. |
| standards/coding/rust.md | applicable Rust source, tests, formatting, lint, and naming rules | not_run | Target-repository rules may add stricter requirements after repository creation. |

## Allowed Scope

| type | path_or_rule | status |
|---|---|---|
| allowed_path_or_rule | `crates/contracts/src/{commands,events,views}.rs` | planned |
| allowed_path_or_rule | `crates/domain/src/{capture,relay,audit,errors}.rs` | planned |
| allowed_path_or_rule | `crates/application/src/{commands,services,ports,repositories}.rs` | planned |
| allowed_path_or_rule | `crates/infra/src/{handoff_adapters,truth_repositories,fakes}.rs` | planned |
| allowed_path_or_rule | `crates/api/src/command_handlers.rs` | planned |
| allowed_path_or_rule | `tests/{domain,service,integration}/**` | planned |
| included_behavior | 同上适用增量;Command 5、`SandboxCaptureChanged`、`CaptureCollectionPort::{collect_capture, inspect_capture}`、`CaptureFact::record(...)`、不可变`CaptureFactStatus`、body-free material / observability refs | planned |
| boundary_goal | 从exact committed terminal-eligible run冻结capture request；port只返回typed candidate / closed error，application经guard调用`CaptureFact::record(...)`一次定格status。 | planned |

## Forbidden Scope

| rule | status | failure_action |
|---|---|---|
| raw process output;Artifact / observability truth;handoff delivery;failure classification | active | block_scope_gate; remove the change or reopen design |
| handoff delivery、Artifact body、failure / cleanup | active | block_scope_gate; do not stage or commit |
| Do not implement tools semantic execution, runtime agent-loop orchestration, or member lifecycle orchestration inside Sandbox. | active | block_scope_gate; return the concern to its owning project |
| Do not use latest paths, static evidence aliases, prefilled Passed or acceptance decisions, raw secret or process bodies, or unrelated user changes. | active | block_evidence_or_worktree_gate; preserve safe failure material |

## Tasks And Batches

### Tasks

| task_id | order | implementation_action | input | completion_criterion |
|---|---|---|---|---|
| `IMPL-SBX-07-02` | 2 | 编写Command 5 / Capture event、`CaptureCollectionPort::{collect_capture, inspect_capture}`、candidate -> guard -> immutable fact mapping和adapter parity | `RecordCaptureResult`;PG-SBX-005 | `collect_capture`每个correlation至多一次；unknown只`inspect_capture`；`CaptureFact::record(...)`创建即定格且无`Pending`，无raw body |

### Batches

| batch_id | goal | input_to_output | expected_size | post_batch_check | commit_relation |
|---|---|---|---|---|---|
| `BATCH-SBX-07B-01` | capture contract / state | formal capture schema -> checked request / candidate / `CaptureFactStatus` / truth / event | 200~300 | no `Pending`;factory-only immutable status / material refs / no body | one commit after every batch passes |
| `BATCH-SBX-07B-02` | capture side effect | `collect_capture` + `inspect_capture` -> service / fake / post-call UoW | 200~300 | one collect per correlation;unknown inspect only;complete / partial / failed / unavailable parity | one commit after every batch passes |
| `BATCH-SBX-07B-03` | capture entry tests | service -> API / producer tests | 100~200 | CMD-009 /010;safe mapping | one commit after every batch passes |

Subfunction grouping: capture carrier / truth + capture side effect + entry

Same-commit cause: capture status与material refs必须由同一adapter outcome诚实形成

Verification closure: `CaptureCollectionPort` 2 /2 methods;`CaptureFactStatus` factory-only immutable;complete / partial / failed / unavailable / no-body

Explicitly excluded: handoff / Artifact truth

## Activation Readiness

| dimension | planned_requirement | actual_status |
|---|---|---|
| config_and_source | I044~I048 /I057~I058 /I094~I095;body-free material class | not_run |
| environment_and_adapter | ENV-02 capture fake;ENV-03 controlled capture /obs seam | not_run |
| external_and_tooling | capture outcome /size /redaction fixtures;no raw process body | not_run |
| unavailable_disposition | unavailable /failed /partial诚实;不得升格Artifact /Obs truth | not_run |
| boundary_specific_activation | exact committed terminal-eligible run、预绑定`CaptureFactRef`和`CaptureCollectionPort` 2 /2 method contract稳定 | not_run |

## Design Closure And Risk

| field | planned_value | actual_status |
|---|---|---|
| closure_profiles | capture / material refs;BASE+CONTRACT+STATE+TXN+MATERIAL | not_run |
| applicable_experience | checked capture request;typed candidate;`CaptureFact::record(...)`;immutable status;material typed refs;unknown inspect;event source;raw body redaction;duplicate no-recapture | not_run |
| formal_evidence_location | `03`§6~§12;`04`§8;`05`CMD-009/010;`06`PG-005 | not_run |
| explicit_non_applicability | handoff delivery不适用:capture owner独立结束 | not_run |
| design_level_conclusion | `passed_design`;Partial / Failed不得升格 | design_record_only |
| activation_or_design_closure | `collect_capture` / `inspect_capture`、candidate / closed error、factory-only status、capture outcome /size /redaction /partial /failed /unavailable、body-free material和source truth no-rollback闭合 | not_run |
| safe_route_if_open_or_triggered | side-effect unknown只inspect same correlation，不得重新collect；raw leak为S /VETO；unavailable /partial诚实保留；不得升格Artifact /observability truth | not_run |

| reference_type | full_references | execution_status |
|---|---|---|
| spike | `SP-SBX-IMP-007` | not_run |
| risk | `R-SBX-IMP-003`; `R-SBX-IMP-005`; `R-SBX-IMP-008`; `R-SBX-IMP-009`; `R-SBX-IMP-011`; `R-SBX-IMP-019`; `R-SBX-IMP-020` | not_run |
| open_question | none_by_boundary_matrix | not_run |

## Required Checks

| check_id | command_or_assertion | required_status | actual_status | evidence |
|---|---|---|---|---|
| CHK-ACTIVATION | Close predecessor CB-SBX-07A; exact committed terminal-eligible run、预绑定capture ref和`CaptureCollectionPort` 2 /2 method contract稳定 | closed_or_formal_blocked | not_run | absent |
| CHK-DESIGN | capture / material refs;BASE+CONTRACT+STATE+TXN+MATERIAL; closure evidence: `03`§6~§12;`04`§8;`05`CMD-009/010;`06`PG-005; repeat-check rule: `passed_design`;`CaptureFact::record(...)`创建即定格、无`Pending`；Partial / Failed不得升格；unknown只inspect same correlation | design_consistent | not_run | absent |
| CHK-SCOPE | Allowed: `crates/contracts/src/{commands,events,views}.rs`;`crates/domain/src/{capture,relay,audit,errors}.rs`;`crates/application/src/{commands,services,ports,repositories}.rs`;`crates/infra/src/{handoff_adapters,truth_repositories,fakes}.rs`;`crates/api/src/command_handlers.rs`;`tests/{domain,service,integration}/**`; included behavior: 同上适用增量;Command 5、`SandboxCaptureChanged`、capture truth、body-free material / observability refs; forbidden: raw process output;Artifact / observability truth;handoff delivery;failure classification; handoff delivery、Artifact body、failure / cleanup | scope_clean | not_run | absent |
| CHK-WORKTREE | Record target root, HEAD, initial git status, local identity, user-owned changes, and staged-file ownership. | worktree_recorded | not_run | absent |
| CHK-BUILD | `TC-SBX-CMD-009`;`TC-SBX-CMD-010`;`CaptureCollectionPort` 2 /2 methods、`CaptureFactStatus` no-`Pending` /immutable、Complete / Partial / Failed / Unavailable、raw-body rejection、unknown inspect、duplicate no-recapture、capture race / rollback tests | pass_or_formal_allowed_status | not_run | absent |
| CHK-TEST | SUITE-SBX-002 /004 /008 /010及007 /009适用:CMD-009/010、STA-014 capture slice、ERR-009 /037 /038;factory-only immutable status、Complete / Partial / Failed / Unavailable、raw-body rejection、unknown只inspect、no-recapture | all_mandatory_pass | not_run | absent |
| CHK-AC-VETO | AC-SBX-016~019 /029 /032~041;VETO-SBX-001 /005 /006 /009 /010 /013 /016 | assertions_present_and_no_triggered_veto | not_run | absent |
| CHK-ARTIFACT | G1 capture / material-ref / protocol / consistency / audit raw与redaction check | maturity_contract_satisfied | not_run | absent |
| CHK-REPORT | suite reports、targeted `redaction-check.md` / `report-audit.md` | paired_report_or_G0_reason | not_run | absent |
| CHK-EVIDENCE-MATURITY | G1;raw process output、`CaptureFactStatus`含`Pending`或创建后改写、Partial升Complete、Artifact / Obs truth升格、unknown时重新collect或rollback不诚实即不提交 | status_fidelity_and_safe_failure | not_run | absent |
| CHK-READINESS | Config/source: I044~I048 /I057~I058 /I094~I095;body-free material class; ENV/adapter: ENV-02 capture fake;ENV-03 controlled capture /obs seam; external/tool: capture outcome /size /redaction fixtures;no raw process body; unavailable route: unavailable /failed /partial诚实;不得升格Artifact /Obs truth | ready_or_formally_blocked | not_run | absent |
| CHK-RISK | Close or confirm before Activation/Design: capture outcome /size /redaction /partial /failed、body-free material和source truth no-rollback闭合; route: raw leak为S /VETO;unavailable /partial诚实保留;不得升格Artifact /observability truth | closed_or_routed | not_run | absent |
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

Boundary artifact contract: G1 capture / material-ref / protocol / consistency / audit raw与redaction check

Boundary report contract: suite reports、targeted `redaction-check.md` / `report-audit.md`

Planned evidence/review reference: capture / material / audit raw与suite / redaction / report audit

Commit is allowed only when: `CaptureCollectionPort` 2 /2、factory-only immutable `CaptureFactStatus`、Complete / Partial / Failed / Unavailable、no-body、unknown inspect、no-recapture和rollback诚实通过

Forbidden proof substitution: Artifact / Observability truth、handoff

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
| planned_commit_title | `feat(capture): capture body-free execution materials` |
| planned_commit_summary | `Capture execution materials with honest body-free outcomes for CB-SBX-07B.` |
| planned_body_groups | `Capture contracts and owner truth:`;`Capture side effect and material safety:`;`API entry with partial and failed verification:` |
| same_commit_cause | adapter outcome、capture status、safe refs和entry必须一起保持Complete / Partial / Failed诚实性 |
| planned_footer | `Co-Authored-By: Codex <noreply@openai.com>` |
| staged_files_checked | `not_run` |
| commit_message_checked | `not_run` |
| committed_hash | `not_committed` |
| committed_message | `not_committed` |
| post_commit_status | `not_run` |

## Review Record

| field | planned_or_actual_value |
|---|---|
| required_review_responsibility | capture + material + observability-boundary + security reviewer核body-free refs和status honesty |
| type_and_scope_review | `feat(capture)`对应capture事实 |
| body_group_review | contract / side effect / partial verification共同保持诚实状态 |
| review_and_evidence_discipline | capture + material + security |
| design_discipline_record | passed_design |
| future_repeat_check | 2 /2 capture methods;no `Pending`;immutable fact;unknown inspect;no raw body / no truth升格 |
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

Expected successor after a real Handoff Gate pass: `CB-SBX-07C`. The project ledger alone activates that successor.

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
