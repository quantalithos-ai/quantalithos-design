# L3-capability-hub 05 测试方案 Step 12: 进入准则与退出准则

> 对应 SOP: `standards/document/测试方案讨论流程_SOP.md` Step 12
> 书写规范: `standards/document/测试方案书写规范.md` §5.12
> 回填章节: `projects/L3-capability-hub/05-测试方案.md` §12
> 创建日期: 2026-07-25
> 当前模式: full-restart / continuous execution
> Step 状态: `accepted-designed`
> 当前任务: `T034`

---

## 1. 本步目标、输入与状态语义

### 1.1 目标

把Steps 7~11的数据、环境、自动化、专项和缺陷规则汇总成无模糊项的进入/退出门禁，并严格区分：

1. 当前设计流程能否进入Step 13；
2. 未来P0测试执行能否启动；
3. P0 semantic test cycle能否退出；
4. P1 selected integration能否声称完成；
5. release gate能否把测试证据交给formal 06裁决。

这五层不能互相替代。设计门禁通过不表示实现/测试就绪；P0 semantic测试完成不表示selected/release完成；release evidence handoff也不等于formal 06验收通过。

### 1.2 输入

| 输入 | 本步承接 |
|---|---|
| active formal `00`~`04` | requirement/design/config truth baseline |
| Step 6 | 189 canonical TC、638 state-pair parameter registry |
| Step 7 | 189 logical DS、fixture/isolation/cleanup contract |
| Step 8 | 7 environment contracts、3 profiles/entries、dependency readiness semantics |
| Step 9 | 10 suites、5 gates、9 checks、4 report builders、raw/report roots/statuses |
| Step 10 | 20 NFR specialties、structural performance/sample和redline gates |
| Step 11 | observation classification、S/A/B、13 vetoes、retest/closure policy |
| DDD Step 17/config handoff | target repo/formal 07/product facts are future prerequisites |

### 1.3 Status legend

| Status | Meaning | Can support execution/pass claim? |
|---|---|---|
| `pass-designed` | design contract is complete and internally auditable | no |
| `future_pending` | required future implementation/execution fact has not been established | no |
| `satisfied-by-evidence` | future explicit run/source/config/artifact proves criterion | yes,for exact criterion only |
| `blocked` | required prerequisite or criterion unavailable/failed | no |
| `not_applicable_by_manifest` | exact gate manifest formally excludes criterion | only for non-P0/conditional row;never implicit |
| `not_evaluated` | no valid measurement/verdict exists | no |

All implementation/execution checklists in this document are intentionally unchecked. No target repository, test binary, script, environment, run, artifact, report, defect state or signoff is claimed.

## 2. SOP five-question answers

| Question | Decision |
|---|---|
| 1. Which documents must be frozen? | Actual execution binds immutable revisions of active formal 00~07 and the Step-13 evidence contract; any semantic delta reopens affected test design before run. Current 05/06/07 are not all formal yet,so execution entry is pending. |
| 2. Which environments/data must be available? | P0 requires the first five Step-8 environments, all applicable 189 DS, complete 638 state pairs, controlled/fake/disabled seams, strict config candidates, isolation and cleanup. Selected/release additionally require selected products and Deployment artifacts. |
| 3. Which automation must run? | Main requires all 10 primary suites and applicable nine checks; PR/nightly/selected/release use exact Step-9 manifests. Missing script/check/result is blocked,not pass. |
| 4. Which cases must pass to exit? | P0 cycle requires 189/189 unique primary TC and 638/638 state pairs pass with all main checks. Selected/release have separate additional criteria and cannot compensate for main. |
| 5. Which defects/risks block exit? | Any S or current P0 A,design blocker,test-system blocker,invalid artifact,unexpected unavailable,missing report pairing or unaccepted required prerequisite blocks its gate. B/residual is eligible only with later formal owner and no P0/evidence impact. |

## 3. Diagnosis and tradeoffs

### 3.1 Problems and treatment

| Problem | Risk | Treatment |
|---|---|---|
| checklist could be read as current readiness | fabricated implementation fact | every future row is unchecked and status table says `future_pending` |
| P0 and release completion conflated | selected products silently waived | separate exit gates |
| formal 05 Step 13 follows Step 12 | circular evidence prerequisite | Step 12 defines future requirement;Step 13 supplies schema before formal assembly/execution |
| source changes during run | evidence no longer matches design | immutable baseline/source/config manifest per run |
| aggregate test count hides duplicates | false 189 coverage | exact identity set and primary-owner uniqueness required |
| cleanup succeeds but test failed | failure erased | cleanup is separate criterion;worst status preserved |
| P1 unavailable called residual pass | product parity fabricated | selected gate remains blocked/incomplete |

### 3.2 Tradeoffs

| Option | Decision | Reason |
|---|---|---|
| allow test execution from calibration Steps before formal 05~07 | reject | actual implementation needs final baseline and boundary plan |
| allow P0 semantic cycle before selected products | accept | P0 is product-neutral controlled contract proof |
| call P0 cycle “release ready” | reject | selected/Deployment/evidence/acceptance criteria remain separate |
| allow A severity waiver | reject for current P0 | Step 11 explicitly requires fix/retest |
| require numeric target | reject | no active source;sample presence only |
| use one run across diagnostic retries | reject | old failure provenance must remain immutable |

## 4. Current design-process entry/exit

This section is the only gate evaluated now.

### 4.1 Step 13 design entry

| Criterion | Current design status | Basis |
|---|---|---|
| Steps 1~11 artifacts exist in order | `pass-designed` | independent files and flow records |
| 189 TC/DS/EVC candidates and 638 pairs are closed | `pass-designed` | Steps 6~9 audits |
| environment/gate/nonfunctional/defect contracts are unambiguous | `pass-designed` | Steps 8~11 |
| no active upstream design blocker | `pass-designed` | writeback/blocker count 0 |
| formal 05 may be modified now | no | only Step 15 may assemble it |

### 4.2 Current truthfulness exit

| Assertion | Value |
|---|---|
| design can enter Step 13 | yes |
| actual test can start | no fact established |
| P0 test passed | not evaluated |
| selected/release passed | not evaluated |
| formal evidence/signoff exists | no |

## 5. Future P0 execution entry criteria

### 5.1 Baseline and repository

- [ ] Formal `00-需求文档.md` through `07-实施计划.md` revisions for the run are recorded in an immutable baseline manifest.
- [ ] Step 13 formal evidence schema and Step 14 residual-risk policy are included in the baseline.
- [ ] No unresolved design blocker affects any of the 189 canonical TC or 638 state pairs.
- [ ] The target implementation repository exists and its source revision is explicit; no uncommitted/unidentified source is used for formal evidence.
- [ ] The expected seven workspace members, 15 local dependency edges and only allowed sibling `core-contracts` compile candidate are verifiable.
- [ ] Compatible `core-contracts` path/version/API prerequisites are satisfied; absence is `blocked_dependency`,not copied replacement.
- [ ] Future public Rust declarations have complete English `///` coverage for declarations,struct fields,enum variants/payloads,traits,methods and callables;enum struct-variant fields have no field-level `pub`.

### 5.2 Case, data and oracle readiness

- [ ] The implementation case manifest contains exactly 189 unique canonical TC with one primary suite owner each.
- [ ] Every TC maps to exactly one canonical DS and EVC/EV identity according to the current Step-13 schema.
- [ ] The generated state registry contains exactly `638=239 current+98 reserved+301 illegal` pair identities.
- [ ] All 189 DS can be constructed with deterministic Clock/ID/refs/digests and exact typed builders.
- [ ] Positive,negative,boundary,concurrency,recovery and corruption scenarios are independently selectable.
- [ ] Run namespace isolation,seed ownership and cleanup/disposal are executable for every persistence/event/observer/config fixture.
- [ ] Forbidden-material fixtures are synthetic markers and contain no real secret,credential,external body or production data.
- [ ] Every oracle includes typed result,state/version/history/call-order and required zero-effect assertions;no generic success/count-only oracle remains.

### 5.3 Environment and configuration readiness

- [ ] `ENV-CH-CI-STATIC` is available for L0/L1 static/compile checks.
- [ ] `ENV-CH-CI-DETERMINISTIC` is available with one controlled local authority.
- [ ] `ENV-CH-INTEGRATION-CONTROLLED` is available for API/Worker/Jobs and exact external slot/source/route behavior.
- [ ] `ENV-CH-RECOVERY-CONTROLLED` is available with deterministic barriers,commit tri-state,race,crash and lifecycle fault injection.
- [ ] `ENV-CH-LOCAL-CONTRACT` can reproduce a selected failed case without becoming formal evidence authority.
- [ ] Formal profiles remain exactly `Local|Integration|Deployment` and entries exactly `API|Worker|Jobs`;test purpose creates no new profile/entry.
- [ ] Run config artifact and profile/entry selection are immutable and validated through V0~V8,Stage 0~7 and the entry barrier.
- [ ] 18 config modules,27 rows,21 bounded env leaves,9/14 external slots/callables,6 sources and 10 routes match the canonical catalog.
- [ ] Unexpected unavailable Fake/Controlled dependency blocks the run;only exact scripted unavailable branches can pass their own oracle.

### 5.4 Automation and artifact readiness

- [ ] Five future gate scripts,all required suite executors,nine checks and four report builders exist and satisfy Step-9 interfaces.
- [ ] Main can invoke all ten primary suites under one explicit run manifest without hidden selection or retry-to-pass.
- [ ] `--run-id`,`--artifact-root`,`--config-profile`,`--entry` where applicable and `--report-root` are validated closed inputs.
- [ ] Raw output root is exactly `artifacts/test/<run_id>` and report root is exactly `reports/runs/<run_id>`;`latest` and project nesting are rejected.
- [ ] Artifact/report roots are writable,run-isolated and collision-safe before suite execution.
- [ ] Case/suite/check raw schema validation,redaction scan,pairing and no-static-evidence checks can fail the gate.
- [ ] Test-system fixtures prove a failed/timed-out/flaky/blocked/invalid/cancelled result cannot be rewritten as passed.

### 5.5 Execution authorization

- [ ] No open S/P0-A implementation defect or blocking test-system defect affects entry prerequisites.
- [ ] The exact intended gate manifest,source/config baseline and environment IDs are recorded before starting.
- [ ] The explicit run ID is unique and has no pre-existing raw/report output.
- [ ] Required prerequisite owners have provided real artifacts/config/products where the selected gate needs them.
- [ ] Execution owner acknowledges that a pass is determined only from complete raw results,not console output or manual assertion.

All boxes above are `future_pending` now.

## 6. Gate-specific entry matrix

| Gate | Additional entry | Must not enter when | Current status |
|---|---|---|---|
| PR | four fast suite manifest;PR checks;Local/CI-static roots | canonical identity omitted,source/config unknown,script unavailable | future_pending |
| main | all ten suites;189/638 manifests;four P0 environments;all main checks | any P0 suite/data/environment/check missing | future_pending |
| nightly | valid complete main denominator plus immutable expansion manifest and schedule/barrier fixtures | intended to compensate main failure or expansion is nondeterministic/unidentified | future_pending |
| selected integration | selected product list,Deployment config artifact,credential/TLS refs,cleanup plan and exact canonical subset | product/config/environment unavailable or P0 baseline incomplete | future_pending/blocked prerequisite |
| release | complete main run refs,required selected run refs,release source/config manifest,all nine checks/report builders and Step-13 evidence schema | any lower run missing/non-passed,`latest` ref,open S/A or report gap | future_pending/blocked prerequisite |

## 7. Future P0 semantic test exit criteria

### 7.1 Canonical execution

- [ ] Exactly 189/189 unique primary canonical TC have `passed` raw results;missing,extra or primary duplicate count is 0.
- [ ] Exactly 189/189 TC map to the expected DS and formal evidence identity/candidate contract for the same explicit run.
- [ ] Exactly 638/638 state pairs execute and pass:239 current,98 reserved and 301 illegal;sampling count is 0.
- [ ] All 83 exact flows,24 state families,22 TX,12 BIND,12 OBS and 18 CONFIG failure identities are represented by their canonical owners.
- [ ] All structural NFR hard oracles pass;required duration/count/call-count samples exist,while unsupported numeric verdict remains `not_evaluated`.

### 7.2 Suites,checks and statuses

- [ ] All ten main primary suites have complete passed suite results and reports.
- [ ] All nine mandatory main/release-relevant checks required by the P0 manifest have passed raw results.
- [ ] Rustdoc coverage includes every declaration,struct field,enum variant/payload,trait,method and callable and detects field-level `pub` on enum struct variants.
- [ ] No required result has `failed`,`timed_out`,`flaky_detected`,`blocked_dependency`,`invalid_artifact` or `cancelled` status.
- [ ] Diagnostic attempts and prior failed runs remain preserved and are not counted in the primary denominator.
- [ ] Every failed/retested case follows Step-11 distinct-run and regression-scope rules.

### 7.3 Data,cleanup and side effects

- [ ] Each suite/case has its expected run namespace,fixture/data digest and parameter identity in raw artifacts.
- [ ] Required cleanup/disposal executes and reports independently;cleanup failure remains non-pass.
- [ ] Forbidden body/secret/private material findings are 0 across stores,events,logs,metrics,spans,raw artifacts,reports,stdout and stderr.
- [ ] Runtime/tools execution,governance approval,method body/source,marketplace listing,provider route/cost and SDK client/cache ownership findings are 0.
- [ ] Query/derived/Inbound/Outbound/Job/observer forbidden core-truth writes are 0.

### 7.4 Defects and evidence readiness

- [ ] Open confirmed S implementation defects affecting the baseline = 0.
- [ ] Open P0 A implementation defects affecting the baseline = 0.
- [ ] Blocking test-system defects and design blockers affecting evidence = 0.
- [ ] Every blocking suite/check raw artifact has a same-run report ref and verified digest pairing.
- [ ] Run summary and gate summary preserve worst status and complete required-cell matrix.
- [ ] Step-13 evidence index/report contract can derive every P0 evidence row from same-run raw artifacts without static pass declarations.
- [ ] B/residual records,if any,have exact non-P0 scope,owner,reason and reopen trigger as required by formal 06;none supplies a P0 pass.

When all P0 exit boxes are satisfied,only the P0 semantic test cycle is complete. This does not claim selected parity,release readiness or acceptance.

## 8. Selected-integration exit criteria

- [ ] P0 semantic exit criteria are satisfied for the bound baseline.
- [ ] Exact selected durable/external/source/route/TLS/observer products and versions are recorded.
- [ ] Deployment config artifact is validated and bound to the selected run.
- [ ] Every selected canonical subset case has a passed raw result under the same contract manifest used by P0.
- [ ] Fake/durable and Configured/selected semantic parity assertions pass where formally declared.
- [ ] Selected environment/dependency unavailable count is 0;an unavailable marker cannot satisfy this criterion.
- [ ] Product-safe cleanup and redaction checks pass,with no production body copied into evidence.
- [ ] Selected reports pair to raw artifacts and remain distinct from P0 evidence identities.

Current selected status is `future_pending/blocked prerequisite` because no product or environment has been selected.

## 9. Release and acceptance-handoff exit criteria

- [ ] A complete passed main run is referenced by immutable explicit run ID and source/config baseline.
- [ ] All selected lower-run references required by the release manifest satisfy §8;none is `latest` or unavailable.
- [ ] Release smoke produces scenario-level assertions and cannot rely on aggregate test count.
- [ ] All nine release checks pass against raw artifacts and generated reports.
- [ ] Four report builders complete without changing any raw status or omitting non-pass rows.
- [ ] `reports/runs/<run_id>/summary.md`,`gate-summary.md`,suite/check reports and formal Step-13 evidence index are complete.
- [ ] Every P0 evidence alias is unique,same-run raw-derived,redacted and mapped to its formal-06 acceptance consumer.
- [ ] Open S and P0 A defects = 0;eligible B/residual decisions have real formal owners and records.
- [ ] No acceptance verdict or signature is inferred by the release gate;the bundle is handed to formal 06 for independent decision.
- [ ] Any required `reports/acceptance` output is produced only by the Step-13/06-defined acceptance process,not by a suite pretending to approve itself.

Current release/acceptance-handoff status is `future_pending/blocked prerequisite`.

## 10. Pause,block and invalidation rules

| Trigger | Immediate state | Required action |
|---|---|---|
| active formal source conflict/missing oracle | design blocked | stop affected cases;reopen exact owning 00~04 and downstream Steps |
| source/config baseline changes after run starts | run invalid for formal evidence | preserve artifacts;start new explicit run after review |
| case/DS/state manifest count or identity drift | gate blocked/invalid | repair manifest/design sync;no aggregate-count waiver |
| P0 environment/Fake/Controlled dependency unavailable unexpectedly | gate blocked | restore prerequisite;do not classify expected degradation |
| selected product unavailable | selected/release blocked | record prerequisite;P0 status unchanged |
| S or P0 A implementation defect | test exit blocked | fix and retest per Step 11 |
| test-system flaky/timeout/invalid output | run non-pass | preserve attempts;repair tool;new run |
| redaction/responsibility/dependency finding | gate blocked | no risk acceptance;fix and full affected scan |
| raw/report pairing or static evidence finding | evidence invalid/release blocked | rebuild from raw after pipeline fix;never hand-edit pass |
| cleanup failure | suite/gate non-pass | preserve primary and cleanup statuses;investigate both |
| numeric sample outside historical candidate | no numeric verdict | retain sample;do not fail/pass without controlled baseline reopen |

## 11. Traceability and audit of criteria

### 11.1 Entry-source mapping

| Entry group | Authority | Exact completeness |
|---|---|---|
| baseline/repository | formal 00~07;DDD Step 17;Step 11 | immutable revisions,no blocker,repo/dependency/Rustdoc prerequisites |
| cases/data | Steps 6~7 | 189/189 and 638 exact,deterministic data/cleanup |
| environment/config | Step 8;formal 04 | first five P0 envs,3 profiles/entries,canonical catalog |
| automation/artifacts | Step 9 | 5 gates/10 suites/9 checks/4 reports,fixed roots |
| specialties/defects | Steps 10~11 | 20 NFR,13 veto,S/A=blocking |

### 11.2 Exit-source mapping

| Exit group | Authority | Exact completeness |
|---|---|---|
| canonical pass | Steps 6/9 | 189 unique primary + 638 pairs |
| redlines/NFR | Steps 10/11 | 20 NFR,13 veto,forbidden ownership/body zero |
| gate/provenance | Step 9 and future Step 13 | suites/checks/reports/raw pairing,no static evidence |
| defect state | Step 11 | S=0,P0 A=0,blocking tool/design=0 |
| selected/release | Step 8/9 and future 06/07/09 | separate product/config/evidence/acceptance gates |

### 11.3 Stop review

| Review | Design conclusion | Ambiguity/gap |
|---|---|---|
| design vs execution status separated | pass-designed | future boxes intentionally unchecked |
| P0 vs selected/release separated | pass-designed | no compensation or implicit waiver |
| entry conditions are binary and sourced | pass-designed | no “basically ready” language |
| exit denominator is exact | pass-designed | 189/638 and 10/9 inventory |
| defect/evidence rules block false pass | pass-designed | S/A=0 and same-run provenance |
| numeric target absence handled | pass-designed | sample required,numeric verdict not_evaluated |

### 11.4 Cross-criteria audit

| Audit item | Result |
|---|---|
| ambiguous “mostly/basically” criterion | 0 |
| future execution checkbox marked complete | 0 |
| P0 missing case allowed | 0 |
| veto/A waiver path | 0 |
| selected unavailable counted as pass | 0 |
| release used to compensate main | 0 |
| report used without raw pairing | 0 |
| formal acceptance inferred by test | 0 |
| upstream blocker | 0 |

## 12. Upstream impact,formal fill draft and Step 13 gate

### 12.1 Upstream impact

| Conclusion | Upstream impact | Disposition |
|---|---|---|
| criteria can be expressed from existing test contracts | none | no 00~04 writeback |
| actual execution currently cannot enter | none | expected downstream prerequisites,not design blocker |
| selected/release currently blocked | none | products/07/09/evidence/06 remain future |
| future criterion cannot be proven | controlled reopen | classify design/test-system/prerequisite per Step 11 |

Current writeback / blocking confirmation / unresolved upstream blocker = `0 / 0 / 0`.

### 12.2 Formal `05` §12 fill draft

Formal §12 must retain:

- status legend and separation of design,P0,selected,release/acceptance gates;
- all future entry/exit checklists as unchecked operational criteria,not current claims;
- exact 189/638/10-suite/9-check P0 denominator;
- baseline/repository/Rustdoc/data/environment/config/script/artifact prerequisites;
- S=0,P0 A=0 and non-pass preservation;
- selected and release additional criteria plus current blocked-prerequisite truth;
- pause/invalidation and cross-criteria audit rules.

Formal `05-测试方案.md` remains unchanged until Step 15.

### 12.3 Step 13 design entry gate

| Condition | Status | Basis |
|---|---|---|
| entry/exit criteria have no ambiguous item | pass-designed | §§5~10 |
| future boxes are not presented as current facts | pass-designed | status legend/current truth table |
| P0/selected/release boundaries are distinct | pass-designed | §§7~9 |
| report/evidence requirements are ready for schema allocation | pass-designed | §§7.4/9 |
| no upstream blocker exists | pass-designed | §§11~12 |

Next allowed action: read Test Plan SOP/writing-standard Step 13, evidence truth-source standards, Steps 5/6/9/11/12 and future acceptance consumers; then create `05_test_plan_step_13_evidence.md` without modifying formal `05`.
