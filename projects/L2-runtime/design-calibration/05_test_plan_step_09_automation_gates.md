# L2-runtime 05 测试方案 Step 9：自动化与 CI/CD 门禁

> 对应 SOP：`standards/document/测试方案讨论流程_SOP.md` Step 9
> 回填位置：正式 `05-测试方案.md` §9
> 输入：Step 4 分层、Step 6 canonical cases、Step 7 data、Step 8 environment/config
> 状态：`completed_continuous_authorized`
> 实施事实：本章所有 suite、selector、script、pipeline、artifact、report 均为 `planned_not_created`；没有真实 run、结果或 evidence

## 1. 前置 canonicalization 与历史污染处置

旧 Step 9 的 18-state、旧 `CMD/QRY/INE/OUT` ID、旧 suite 分母和 Sandbox/集成正向假设全部废弃。Step 9 开工审计发现 Step 6 的 13 个 slot owning cases 缺独立 EV，已受控回写为 `EV-CON-446~458`；不改变 case/oracle，只闭合身份。

```text
owning_raw_cases = 172
same_run_aggregate_cases = 5
canonical_tc = 177
canonical_ev = 177
states = 31
protocols_jobs = 17 Commands + 12 Queries + 6 inbound + 6 outbound + 7 Jobs
external_slots = 13
config_slices = 15
```

Step 5 中未被 Step 6 保留的 TC/EV 仅是需求级候选，不得进入 selector、artifact、report 或验收引用。一个 raw case/variant 只能有一个 `owning_suite`；companion/aggregate 只引用结果，不复制所有权。

## 2. Planned suite registry 与唯一分母

Selector 展开由 future source manifest 完成；范围表达式必须展开为逐 ID 集合并校验数量，不允许 runner 自行解释模糊 glob。

| Suite | Exact owning selector | Denominator | Profile | Owner oracle / Planned EV | 阻断 |
|---|---|---:|---|---|---|
| `unit_state` | `CAP01-001`;`LOOP-002~003`;`OBS-001`;`SM01~31-001` | 35 raw | `ci_contract/TestFake` | vocabulary、selector/yield、observation carrier、31 state subjects；UNIT EV | P0 |
| `contract_protocol` | `Q01~12-001`;`O01~06-001`;`SLOT01~13-001`;`LPORT-001` | 32 raw | `ci_contract/TestFake` | query no-write、outbound snapshot、13 slot finite contract、local deterministic Port；CON EV | P0 |
| `service_semantics` | `C01~17-001`;all CAP except CAP01；`LOOP-001` | 32 raw | `ci_contract/TestFake` | command/UoW orchestration、CAP-02~12、one bounded activation；SVC/FAULT EV | P0 |
| `entry_worker_job` | `E01~06-001`;`J01~07-001`;`ENTRY-001~003` | 16 raw | `ci_contract/TestFake` | inbox-before-ACK、lease/page/cursor、Api/Worker/Jobs dispatch；ENTRY/JOB EV | P0 |
| `fault_replay_consistency` | `LOOP-004~006`;`LPORT-002~003`;`UOW-001~007`;`REPLAY-001~006`;`ERR-001~007` | 25 raw | `ci_contract/fault` | crash windows、CAS/identity/replay、unknown fence、typed errors；FAULT/CON EV | P0 |
| `config_builder` | `CFG01~15-001` | 15 raw | `ci_contract/TestFake` + cold simulation | 12/153/39/13x5/7x6/V0~V12/CF-A/B/blocker matrix；CFG/STATIC EV | P0 |
| `security_source_boundary` | `BOUND-001~008`;`DEP-001`;`ENTRY-004`;`OBS-002~003`;`SEC-001~003`;`SOURCE-001`;`TRUTH-001` | 17 raw | `static_source` + `ci_contract/TestFake` | owner boundary、fake leak、redaction、source/denominator/truth-state；STATIC/FAULT EV | P0 veto |
| `local_e2e` | `E2E-001~005` | 5 aggregate | `ci_contract/TestFake` | same-run raw result aggregation；E2E EV | P0 aggregate |

Raw suite sum is exactly `35+32+32+16+25+15+17=172`; aggregate sum is 5. `local_e2e` may pass only when every declared child raw result exists in the same `<run_id>` and passed. It cannot rerun, replace, cherry-pick or mask a child result.

## 3. 独立 integration 与 positive qualification lanes

| Lane | Current selector | Entry requirement | Current disposition | Forbidden inference |
|---|---|---|---|---|
| `integration_candidate` | no current owning TC；future adapter/profile parity manifest | target implemented；owner contract/schema frozen；Candidate profile；isolated environment | `blocked_dependency/not_runnable` where prerequisites absent | Candidate/Bound -> ready；fake parity -> owner qualification |
| `positive_qualification` | reserved `TC-QUAL-SLOT01~13`, excluded from 177 current denominator | real adapter + non-TestFake profile + owner implementation/environment + independent oracle | all 13 `blocked_dependency/not_runnable` | local slot EV, ping, design file, fake, report or ACK closes blocker |

The lanes have independent future `<run_id>` values. No integration/qualification result may be merged into a local run; release-design reports local closure and external blockers as separate dimensions.

## 4. Planned automation gate graph

```text
[source/toolchain/config preflight]
          |
          v
[PR gate / ci_contract]
  unit_state + contract_protocol + service_semantics
  config_builder + security_source_boundary
          |
          v
[main gate / ci_contract]
  PR + entry_worker_job + fault_replay_consistency
     + local_e2e(same-run aggregate)
          |
          v
[nightly / new fixed run]
  all 177 identities + declared expanded variants/seeds
  + artifact/report integrity checks
          |
          v
[release-design gate / fixed nightly or new full run]
  complete local denominator + mandatory checks + reports
  => local contract result only; never product readiness

[integration_candidate] ---- independent blocked/candidate lane
[positive_qualification] --- independent 13-slot blocked lane
```

| Gate | Required suites | Required checks | Trigger | Future outcome meaning |
|---|---|---|---|---|
| `pr` | 6 suites: raw 131 | source manifest、denominator、dependency、forbidden material、fake leak | PR changes affecting Runtime | fast P0 local semantics; no entry/fault/full claim |
| `main` | all 7 raw suites + `local_e2e`: 177 TC | PR checks + status truth + redaction + artifact pairing | merge/main | full deterministic local contract candidate |
| `nightly` | same 177 identities with manifest-declared variant/fault/property expansion | all checks + no-static-evidence + report generation | scheduled/manual | wider deterministic characterization; no unbounded/random denominator |
| `release_design` | a complete single full run; no cross-run cherry-pick | every mandatory check and report generator | future release candidate request | design-defined local exit input only; actual qualification currently unavailable |
| `integration_candidate` | independent candidate manifest | dependency preflight、status truth、redaction、pairing | manual/nightly when individually runnable | parity/candidate facts only |
| `positive_qualification` | exact runnable subset of 13 reserved identities; absent prerequisites remain blocked | owner/schema/adapter/profile/environment/evidence preflight | explicit owner qualification | real seam evidence candidate; never inferred from local run |

## 5. Planned gate scripts

Every script must require `--run-id`, `--artifact-root`, `--config-profile`, `--case-manifest`; suite scripts additionally require `--suite`. Formal runs reject `latest`, empty run ID, root mismatch, implicit filters and unknown manifest versions.

| Script | Responsibility | Output root | Failure rule |
|---|---|---|---|
| `scripts/gates/run_unit_state.sh` | exact 35 raw | `.../suites/unit_state/` | missing/extra/failed case blocks |
| `scripts/gates/run_contract_protocol.sh` | exact 32 raw | `.../suites/contract_protocol/` | schema/no-write/slot mismatch blocks |
| `scripts/gates/run_service_semantics.sh` | exact 32 raw | `.../suites/service_semantics/` | state/write/call/phase mismatch blocks |
| `scripts/gates/run_entry_worker_job.sh` | exact 16 raw | `.../suites/entry_worker_job/` | ACK/lease/page/entry mismatch blocks |
| `scripts/gates/run_fault_replay_consistency.sh` | exact 25 raw | `.../suites/fault_replay_consistency/` | flake/timeout/unknown mishandling blocks |
| `scripts/gates/run_config_builder.sh` | exact 15 raw | `.../suites/config_builder/` | any denominator/stage/profile gap blocks |
| `scripts/gates/run_security_source_boundary.sh` | exact 17 raw | `.../suites/security_source_boundary/` | any veto/boundary/redaction/source gap blocks |
| `scripts/gates/build_local_e2e.sh` | derive 5 aggregate cases from same-run raw only | `.../suites/local_e2e/` | child missing/non-pass blocks aggregate |
| `scripts/gates/run_pr.sh` | preflight + required PR suites/checks | `artifacts/test/<run_id>/` | any required component non-pass blocks |
| `scripts/gates/run_main.sh` | full deterministic P0 local gate | same fixed run root | 177 TC closure required |
| `scripts/gates/run_nightly.sh` | new full expanded run | new fixed run root | prior failure preserved; no merge-to-green |
| `scripts/gates/run_release_design.sh` | validate one fixed full run and reports | referenced fixed run root | no `latest`; blocked external status disclosed |
| `scripts/gates/run_integration_candidate.sh` | independent controlled candidate lane | independent fixed run root | missing prerequisite -> blocked, never fake fallback |
| `scripts/gates/run_positive_qualification.sh` | independent real slot qualification | independent fixed run root | non-runnable slot retained explicitly |

`...` above expands only to `artifacts/test/<run_id>` supplied by the caller. No script or directory currently exists.

## 6. Mandatory checks and report generators

| Planned check | Exact responsibility | Gate |
|---|---|---|
| `scripts/checks/check_source_manifest.sh` | all requirement/design/CUT/TC/EV refs resolve current formal sources; historical aliases rejected | all |
| `scripts/checks/check_test_denominators.sh` | exact 172 raw + 5 aggregate、12 CAP、17/12/6/6/7、31 states、13 slots、15 config；one raw owner | all |
| `scripts/checks/check_dependency_boundaries.sh` | only Core compile candidate；runtime/event/ref/adapter/fake separated；no direct Sandbox/provider/member/Obs backend package | all |
| `scripts/checks/check_forbidden_material.sh` | forbidden body/secret/route/quota/cost/hidden reasoning/owner truth absent | all |
| `scripts/checks/check_fake_profile_leak.sh` | fake only CI/TestFake；non-test profile zero fake binding | PR/main/nightly/release-design |
| `scripts/checks/check_status_truth.sh` | planned/blocked/not-run/fake/ACK/receipt cannot promote pass/readiness/acceptance | main/nightly/release-design/integration |
| `scripts/checks/check_redaction.sh` | artifacts, logs and reports scanned before evidence eligibility | main/nightly/release-design/integration |
| `scripts/checks/check_artifact_report_pairing.sh` | each candidate EV has raw case + suite report + fixed run linkage | nightly/release-design/integration |
| `scripts/checks/check_no_static_evidence.sh` | evidence index derived from raw/report pairs, not hand-authored mappings | nightly/release-design |

| Planned report script | Input | Output | Prohibition |
|---|---|---|---|
| `scripts/reports/generate_suite_reports.sh` | same-run suite raw records/logs | `reports/runs/<run_id>/suites/<suite>.md` | no missing-result synthesis |
| `scripts/reports/generate_gate_summary.sh` | suite/check reports | `reports/runs/<run_id>/gate-results.md` | no status rewrite/cherry-pick |
| `scripts/reports/generate_evidence_index.sh` | valid raw/report pairs | `reports/runs/<run_id>/evidence-index.md` + raw index | no static EV or moving alias |
| `scripts/reports/generate_acceptance_drafts.sh` | fixed run index + blocker/defect/risk registries | `reports/acceptance/*.md` draft | no verdict/signoff/risk acceptance/readiness |

## 7. Artifact/report contract handed to Step 13

```text
artifacts/test/<run_id>/
  meta/context.json
  meta/case-manifest.json
  meta/selector.json
  meta/blockers.json
  checks/<check>.json
  suites/<suite>/report.json
  suites/<suite>/stdout.log
  suites/<suite>/stderr.log
  suites/<suite>/cases/<case_id>.json
  gate-summary.json

reports/runs/<run_id>/
  summary.md
  gate-results.md
  evidence-index.md
  redaction-check.md
  suites/<suite>.md
```

Step 13 fixes schemas and acceptance drafts. A valid case record must bind fixed run ID、case/variant、owning suite、fixture manifest digest、config snapshot ref/digest、status、oracle assertions、safe failure category、artifact refs and timestamps. Current state remains `planned_not_created`.

## 8. Execution status, filtering, flake and retry rules

| Condition | Required future classification | Gate behavior |
|---|---|---|
| selector expands to zero / denominator mismatch / undeclared filter | `invalid_execution` | hard block; exit 0 cannot pass |
| required raw case skipped/ignored/missing | `invalid_execution` | hard block; skip is not pass |
| assertion/product invariant fails | `failed` | hard block and defect candidate |
| timeout or flaky result | `failed` | hard block; record seed/fault schedule; no auto-pass |
| fixture/runner/toolchain/namespace failure | `infra_error` | affected gate not qualified |
| cleanup/residue scan failure | `infra_error` | raw product result retained but evidence ineligible |
| positive owner prerequisite absent | `blocked_dependency/not_runnable` | only independent positive lane; never local pass/fail rewrite |
| controlled negative case receives expected unavailable/blocked outcome | case oracle may `passed` | proves only declared fail-closed local behavior |
| cancellation | `cancelled` | incomplete gate, not pass |

Retry always creates a new `<run_id>`, references `prior_run_id`, and preserves the first failed/infra run and artifacts. Rerunning a failed case inside the same formal run, deleting failed artifacts, merging best results across runs, or changing the selector to green is prohibited.

## 9. Suite stop-review and cross-suite audit

| Review | Result |
|---|---|
| raw owner uniqueness | 172/172 assigned exactly once across 7 suites |
| aggregate ownership | 5/5 distinct；same-run raw reference only |
| TC/EV closure | 177/177 planned identities；no actual evidence |
| canonical denominators | 12 CAP、17/12/6/6/7 protocols/jobs、31 states、13 slots、15 config retained |
| P0 manual-only gap | 0；human/Agent report review never substitutes oracle |
| integration/positive truth | independent and currently blocked; zero fake promotion |
| scripts paths | gates/checks/reports separated and all planned_not_created |
| artifact/report roots | exact standard paths；no project subdirectory or `latest` |
| failure semantics | empty/filter/skip/flake/cleanup/infra/blocker/retry all explicit |
| historical aliases | rejected by source/denominator checks |

```text
step_status = completed_continuous_authorized
suite_denominator = 172_raw + 5_aggregate
actual_pipeline_or_script = false
actual_run_or_result = false
positive_qualification = blocked_dependency/not_runnable_13_of_13
next_step = Step 10
formal_05_write_allowed = false_until_step_15
```
