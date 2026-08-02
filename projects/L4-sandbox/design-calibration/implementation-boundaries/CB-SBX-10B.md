# CB-SBX-10B implementation ledger

> Created by L4-sandbox Step 13 from reviewed Step 6~11 matrices.
> This is a planned recovery contract, not proof of implementation, test execution, evidence, review, acceptance, or authorization.

| field | value |
|---|---|
| project | `L4-sandbox` |
| boundary_id | `CB-SBX-10B` |
| phase | `PH-10` |
| verifiable_goal | 通过`SandboxEventPublisherPort::publish`发布committed frozen relay bundle的exact attempt，成功状态为`Published`且不回滚source truth。 |
| direct_predecessor | `CB-SBX-10A` |
| design_baseline | `not_fixed` |
| implementation_repo | `/home/aris/Projects/quantalithos-sandbox (absent)` |
| status | `planned` |
| next_allowed_action | `wait_until_current` |
| current_identity | no; wait for project-ledger activation |
| task_ids | `IMPL-SBX-10-03`; `IMPL-SBX-10-04` |
| batch_ids | `BATCH-SBX-10B-01`; `BATCH-SBX-10B-02`; `BATCH-SBX-10B-03`; `BATCH-SBX-10B-04` |
| evidence_maturity | G1;从current truth重建、缺stored payload、bundle / attempt错配、同一attempt重复publish、unknown猜success、route越界或publisher失败回滚source即不提交 |
| implementation_started | `no` |

## Required Reads

| document | required_section | status | notes |
|---|---|---|---|
| projects/L4-sandbox/07-实施计划.md | §1, §3, §5~§12 and this exact boundary row in §6 | not_run | Formal implementation authority and control rules. |
| projects/L4-sandbox/03-详细设计.md | §7.6 / §8.4~§8.5 relay / §10.4 Relay / §11~§12 | not_run | Exact owner reading copied from Step 6 section 7.4. |
| projects/L4-sandbox/05-测试方案.md | EVT-001~015,SUITE-005 | not_run | Exact owner reading copied from Step 6 section 7.4. |
| projects/L4-sandbox/06-验收标准.md | PG-SBX-033~045 | not_run | Exact owner reading copied from Step 6 section 7.4. |
| projects/L4-sandbox/design-calibration/07_implementation_plan_step_06_tasks_commit_boundaries.md | event payload / outbox / no-rollback校准 | not_run | Exact calibration or standard reference copied from Step 6 section 7.4. |
| projects/L4-sandbox/design-calibration/06_acceptance_step_07_interfaces_events_sync.md | `06_acceptance_step_07_interfaces_events_sync.md` | not_run | Exact calibration or standard reference copied from Step 6 section 7.4. |
| projects/L4-sandbox/design-calibration/07_implementation_plan_step_06_tasks_commit_boundaries.md | §7.1, §7.2, §7.4~§7.8, §7.11; CB-SBX-10B | not_run | Goal, predecessor, closure profiles, scope, tasks, batches, checks, and skeleton schema. |
| projects/L4-sandbox/design-calibration/07_implementation_plan_step_07_test_acceptance_gates.md | §6 and §8; CB-SBX-10B | not_run | Exact suite, AC, VETO, artifact, report, maturity, and review gate. |
| projects/L4-sandbox/design-calibration/07_implementation_plan_step_08_boundary_readiness_matrix.md | CB-SBX-10B readiness row | not_run | Config, environment, adapter, external dependency, and unavailable disposition. |
| projects/L4-sandbox/design-calibration/07_implementation_plan_step_09_boundary_risk_matrix.md | CB-SBX-10B risk row | not_run | Full Spike, Risk, OQ, closure, and safe routing. |
| projects/L4-sandbox/design-calibration/07_implementation_plan_step_10_boundary_control_matrix.md | CB-SBX-10B control row | not_run | Pause, rollback, invalidation, and recovery routing. |
| projects/L4-sandbox/design-calibration/07_implementation_plan_step_11_boundary_commit_message_matrix.md | CB-SBX-10B planned message and commit timing rows | not_run | Exact title, summary, body groups, evidence references, and commit prohibition. |
| projects/L4-sandbox/design-calibration/07_implementation_plan_step_11_review_delivery_audit.md | CB-SBX-10B review and delivery rows | not_run | Independent review, worktree protection, delivery, and handoff discipline. |
| standards/document/代码实施台账与门禁规范.md | project ledger, boundary ledger, nine Gate types, blockers, Commit Gate, and Handoff Gate | not_run | State values and recovery contract. |
| standards/document/设计真相源闭环与可落码性标准.md | boundary codeability and design writeback rules | not_run | Implementation must not invent missing design truth. |
| standards/document/全局项目依赖关系与裁剪规则.md | L4 Sandbox dependency direction and sibling-repository trimming | not_run | Only the allowed core dependency may be compile-time; adjacent products remain ports, events, handoffs, or fakes. |
| standards/document/子项目目录与代码文件组织规范.md | workspace, crate, binary, scripts, artifacts, reports, and implementation-ledger layout | not_run | Directory and code-file organization authority. |
| standards/coding/rust.md | applicable Rust source, tests, formatting, lint, and naming rules | not_run | Target-repository rules may add stricter requirements after repository creation. |

## Allowed Scope

| type | path_or_rule | status |
|---|---|---|
| allowed_path_or_rule | `crates/contracts/src/events.rs` | planned |
| allowed_path_or_rule | `crates/domain/src/relay.rs` | planned |
| allowed_path_or_rule | `crates/application/src/{commands,consumers,services,ports,repositories}.rs` | planned |
| allowed_path_or_rule | `crates/infra/src/{publishers,truth_repositories,fakes}.rs` | planned |
| allowed_path_or_rule | `crates/worker/src/{event_relay_worker,worker_runtime}.rs` | planned |
| allowed_path_or_rule | `tests/{contracts,service,integration}/**` | planned |
| included_behavior | `DEL-SBX-CODE-002`;`DEL-SBX-CODE-003`;`DEL-SBX-CODE-004`;`DEL-SBX-CODE-005`;`DEL-SBX-CODE-007`;`DEL-SBX-CODE-009`;`DEL-SBX-CODE-010`;`DEL-SBX-CODE-011`;`DEL-SBX-CODE-012`;`DEL-SBX-ADP-001`;13 Event payload / mapping、immutable frozen relay bundle、exact attempt、`SandboxEventPublisherPort::publish`、relay repository、publisher worker / outcome / route binding | planned |
| boundary_goal | source UoW提交frozen relay bundle；relay worker先提交exact `Attempting` reservation，再至多一次`publish`；unknown只inspect同一attempt；success映射`SandboxEventRelayStatus::Published`，source truth不回滚。 | planned |

## Forbidden Scope

| rule | status | failure_action |
|---|---|---|
| payload从latest truth重建;source rollback;public Job;real topic provisioning | active | block_scope_gate; remove the change or reopen design |
| public Job runner、latest-truth rebuild、real bus provisioning | active | block_scope_gate; do not stage or commit |
| Do not implement tools semantic execution, runtime agent-loop orchestration, or member lifecycle orchestration inside Sandbox. | active | block_scope_gate; return the concern to its owning project |
| Do not use latest paths, static evidence aliases, prefilled Passed or acceptance decisions, raw secret or process bodies, or unrelated user changes. | active | block_evidence_or_worktree_gate; preserve safe failure material |

## Tasks And Batches

### Tasks

| task_id | order | implementation_action | input | completion_criterion |
|---|---|---|---|---|
| `IMPL-SBX-10-03` | 3 | 编写13 Event payload builders、source snapshot和relay repository | PG-SBX-033~045 | payload immutable且来自source tx |
| `IMPL-SBX-10-04` | 4 | 编写`SandboxEventPublisherPort::publish`、frozen bundle / exact attempt relay loop、topic map和no-rollback tests | EVT-001~015 | 一个committed attempt至多一次publish；unknown只inspect same attempt；success=`Published`；retry / dead-letter不回滚source |

### Batches

| batch_id | goal | input_to_output | expected_size | post_batch_check | commit_relation |
|---|---|---|---|---|---|
| `BATCH-SBX-10B-01` | core event payloads | Events 1~6 -> stored payload builders | 200~300 | EVT-001~006 + common | one commit after every batch passes |
| `BATCH-SBX-10B-02` | safety / read event payloads | Events 7~13 -> stored payload builders | 200~300 | EVT-007~013 + common | one commit after every batch passes |
| `BATCH-SBX-10B-03` | relay append / repository | source side-effect inventory -> relay records | 200~300 | immutable snapshot / source cursor | one commit after every batch passes |
| `BATCH-SBX-10B-04` | publisher high risk | frozen relay bundle / exact attempt -> worker / one-call publisher / same-attempt inspect / retry / dead-letter | 200~300 | EVT-014/015;RACE-014/015;`Published` mapping;no rollback | one commit after every batch passes |

Subfunction grouping: two Event payload groups + relay append + publisher

Same-commit cause: 13 payload、stored snapshot和publisher status共同闭合no-rollback outbox链

Verification closure: EVT-001~015 / race / topic map;frozen bundle + exact attempt;publisher method;`Published`;same-attempt inspect;source no rollback

Explicitly excluded: public Job / real bus

## Activation Readiness

| dimension | planned_requirement | actual_status |
|---|---|---|
| config_and_source | I014 /I015 /I021 /I050~I054 /I091 /I094~I095;13-key route map | not_run |
| environment_and_adapter | ENV-02 fake publisher主slice;ENV-03 controlled publisher seam | not_run |
| external_and_tooling | stored payload /relay store、route coverage、retry /dead-letter fixtures | not_run |
| unavailable_disposition | enabled dependency缺失startup reject;publish failure no rollback;无real topic provisioning | not_run |
| boundary_specific_activation | consumer marker、read contract、immutable stored payload、frozen relay bundle和route map均已由前序handoff冻结 | not_run |

## Design Closure And Risk

| field | planned_value | actual_status |
|---|---|---|
| closure_profiles | event / relay / publisher;BASE+CONTRACT+TXN+RELAY | not_run |
| applicable_experience | canonical payload;source-tx snapshot;frozen bundle identity;exact attempt;accepted side effect;subject / cursor;relay version;publisher method;topic binding;one-call / same-attempt inspect;`Published`;no-rollback | not_run |
| formal_evidence_location | `03`§7.6 / §8.4 / §10~§12;`05`EVT;`06`PG-033~045 | not_run |
| explicit_non_applicability | public Job不适用:publisher为worker loop,Job后续只复用 | not_run |
| design_level_conclusion | `passed_design`;payload不得从current truth重建 | design_record_only |
| activation_or_design_closure | 13 stored payload、source identity、frozen bundle、exact attempt、publisher method、route、`Published` / retry / failed / dead-letter和source no-rollback闭合 | not_run |
| safe_route_if_open_or_triggered | reservation commit unknown停止外呼；publisher unknown只inspect same attempt；real bus只`disclosure_only`；payload source缺口`wait_design`；publish failure不得回滚source | not_run |

| reference_type | full_references | execution_status |
|---|---|---|
| spike | `SP-SBX-IMP-007`; `SP-SBX-IMP-010` | not_run |
| risk | `R-SBX-IMP-003`; `R-SBX-IMP-005`; `R-SBX-IMP-008`; `R-SBX-IMP-009`; `R-SBX-IMP-011`; `R-SBX-IMP-019`; `R-SBX-IMP-020` | not_run |
| open_question | `OQ-SBX-IMP-016` | not_run |

## Required Checks

| check_id | command_or_assertion | required_status | actual_status | evidence |
|---|---|---|---|---|
| CHK-ACTIVATION | Close predecessor CB-SBX-10A; consumer marker、read contract、immutable stored payload、frozen relay bundle和route map均已由前序handoff冻结 | closed_or_formal_blocked | not_run | absent |
| CHK-DESIGN | event / relay / publisher;BASE+CONTRACT+TXN+RELAY; closure evidence: `03`§7.6 / §8.4 / §10~§12;`05`EVT;`06`PG-033~045; repeat-check rule: `passed_design`;publisher只消费committed frozen bundle + exact attempt；success=`Published`；unknown只inspect same attempt；payload不得从current truth重建 | design_consistent | not_run | absent |
| CHK-SCOPE | Allowed: `crates/contracts/src/events.rs`;`crates/domain/src/relay.rs`;`crates/application/src/{commands,consumers,services,ports,repositories}.rs`;`crates/infra/src/{publishers,truth_repositories,fakes}.rs`;`crates/worker/src/{event_relay_worker,worker_runtime}.rs`;`tests/{contracts,service,integration}/**`; included behavior: `DEL-SBX-CODE-002`;`DEL-SBX-CODE-003`;`DEL-SBX-CODE-004`;`DEL-SBX-CODE-005`;`DEL-SBX-CODE-007`;`DEL-SBX-CODE-009`;`DEL-SBX-CODE-010`;`DEL-SBX-CODE-011`;`DEL-SBX-CODE-012`;`DEL-SBX-ADP-001`;13 Event payload / mapping、relay repository、publisher worker / outcome / route binding; forbidden: payload从latest truth重建;source rollback;public Job;real topic provisioning; public Job runner、latest-truth rebuild、real bus provisioning | scope_clean | not_run | absent |
| CHK-WORKTREE | Record target root, HEAD, initial git status, local identity, user-owned changes, and staged-file ownership. | worktree_recorded | not_run | absent |
| CHK-BUILD | `EVT-001~015`,SUITE-005 targeted,`RACE-014/015`;13 stored payload immutable、frozen bundle / exact attempt、publisher 1 /1 method、one-call、same-attempt inspect、`Published`、retry / dead-letter、source unchanged、topic key闭集 | pass_or_formal_allowed_status | not_run | absent |
| CHK-TEST | SUITE-SBX-005 /008 /011及007 /009 /010适用:EVT-001~015、RACE-014/015;13 payload、frozen stored snapshot、exact attempt、one-call publisher、unknown inspect、`Published`、relay retry / dead-letter、topic key、source unchanged | all_mandatory_pass | not_run | absent |
| CHK-AC-VETO | AC-SBX-017~023 /029 /031~041适用;VETO-SBX-005 /006 /009~013 /016 | assertions_present_and_no_triggered_veto | not_run | absent |
| CHK-ARTIFACT | G1 event / protocol / relay / replay / consistency / error / audit raw与pairing / redaction checks | maturity_contract_satisfied | not_run | absent |
| CHK-REPORT | event / relay / protocol reports、targeted integrity reports | paired_report_or_G0_reason | not_run | absent |
| CHK-EVIDENCE-MATURITY | G1;kind / payload错配、从current truth重建、缺stored payload发布、bundle / attempt错配、同attempt重复publish、unknown猜success、route越界或publisher失败回滚source即不提交 | status_fidelity_and_safe_failure | not_run | absent |
| CHK-READINESS | Config/source: I014 /I015 /I021 /I050~I054 /I091 /I094~I095;13-key route map; ENV/adapter: ENV-02 fake publisher主slice;ENV-03 controlled publisher seam; external/tool: stored payload /relay store、route coverage、retry /dead-letter fixtures; unavailable route: enabled dependency缺失startup reject;publish failure no rollback;无real topic provisioning | ready_or_formally_blocked | not_run | absent |
| CHK-RISK | Close or confirm before Activation/Design: 13 stored payload /source identity /route /publisher outcome /dead-letter闭合; route: real bus只`disclosure_only`;payload source缺口`wait_design`;publish failure不得回滚source | closed_or_routed | not_run | absent |
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

Boundary artifact contract: G1 event / protocol / relay / replay / consistency / error / audit raw与pairing / redaction checks

Boundary report contract: event / relay / protocol reports、targeted integrity reports

Planned evidence/review reference: event / relay / protocol reports及pairing / redaction integrity

Commit is allowed only when: 13 stored payload、source-tx snapshot、frozen bundle、exact attempt、publisher one-call / same-attempt inspect、`Published` mapping、route、retry / dead-letter和source no-rollback通过

Forbidden proof substitution: current-state payload rebuild、real topic

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
| planned_commit_title | `feat(relay): publish stored event snapshots without rollback` |
| planned_commit_summary | `Publish immutable stored event snapshots without source rollback for CB-SBX-10B.` |
| planned_body_groups | `Stored event snapshots and relay append:`;`Publisher adapter and route handling:`;`Relay worker and no-rollback verification:` |
| same_commit_cause | 13 payload、source-tx snapshot、relay status和publisher outcome共同闭合outbox链 |
| planned_footer | `Co-Authored-By: Codex <noreply@openai.com>` |
| staged_files_checked | `not_run` |
| commit_message_checked | `not_run` |
| committed_hash | `not_committed` |
| committed_message | `not_committed` |
| post_commit_status | `not_run` |

## Review Record

| field | planned_or_actual_value |
|---|---|
| required_review_responsibility | event / outbox / publisher / transaction reviewer核source-tx snapshot、cursor、route和no rollback |
| type_and_scope_review | `feat(relay)`对应stored publish |
| body_group_review | snapshot / publisher / relay loop共同闭合outbox |
| review_and_evidence_discipline | event + outbox + publisher + transaction |
| design_discipline_record | passed_design |
| future_repeat_check | 13 payload / frozen bundle / exact attempt / `Published` / source no rollback |
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

Expected successor after a real Handoff Gate pass: `CB-SBX-11A`. The project ledger alone activates that successor.

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
