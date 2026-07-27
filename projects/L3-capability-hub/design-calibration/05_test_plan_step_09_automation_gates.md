# L3-capability-hub 05 测试方案 Step 9: 自动化与 CI/CD 门禁

> 对应 SOP: `standards/document/测试方案讨论流程_SOP.md` Step 9
> 书写规范: `standards/document/测试方案书写规范.md` §5.9
> 回填章节: `projects/L3-capability-hub/05-测试方案.md` §9
> 创建日期: 2026-07-25
> 当前模式: full-restart / continuous execution
> Step 状态: `accepted-designed`
> 当前任务: `T031`

---

## 1. 本步目标、输入与禁止范围

### 1.1 目标

把 Step 6 的 189 个 canonical TC、Step 7 的 189 个 canonical DS 和 Step 8 的 environment contracts 分配到可实施的 automated suite、PR/main/nightly/selected/release gate、future gate/check/report script interface 以及 raw artifact/report path contract。

本步必须确保：

- main gate 的 primary suite manifest 无遗漏、无重复地覆盖 189 TC；
- every blocking suite 可定位 exact TC/DS/EVC candidate、环境、profile/entry、script、artifact和report；
- state suite完整消费638 pair，不允许抽样；
- failed/flaky/timeout/infra unavailable/report missing/redaction finding都不能改写为pass；
- report/evidence candidate只能从同一`<run_id>`的真实raw artifact派生；
- 不创建script、CI YAML、artifact、report、run_id或真实evidence。

### 1.2 输入

| 输入 | 用途 |
|---|---|
| Step 4 | L0~L6 primary/secondary layer与failure handling |
| Step 6 | 189 TC、source cut、automation intent、EVC candidate |
| Step 7 | 189 DS、scenario/parameter identity、cleanup和fault script contract |
| Step 8 | 7 environment contracts、3 profiles/entries、dependency和unavailable semantics |
| formal 03 §15 | minimum cut/script handoff and Rustdoc/responsibility redlines |
| formal 04 §12 | strict config、binding、redaction和failure downstream gates |

### 1.3 禁止范围

- 本文件中的 `scripts/*`、`artifacts/*` 和 `reports/*` 路径均是目标实现仓 future contract，设计仓不创建这些文件。
- 不选择 CI vendor、runner image、executor、retention backend或test framework command。
- 不分配真实 run ID、正式 evidence alias、digest、pass/fail、coverage、report或acceptance verdict。
- 不用 `latest`、project-nested artifact root、static JSON pass declaration或人工口头结果替代raw artifact。
- 不以P1 selected suite unavailable阻断P0 main设计，也不把它记成selected pass。

## 2. SOP 十四问回答

| 问题 | 设计结论 |
|---|---|
| 1. 哪些 suite 必须进 PR？ | `static-contract-docs`、`domain-state`、`service-command-query`、`configuration-strict`的fast manifest；dependency/Rustdoc/case/state/config checks同步阻断。 |
| 2. 哪些进 main CI？ | 10个primary suite全部运行，canonical TC denominator=`189/189`；main是P0完整自动化门禁。 |
| 3. 哪些进 nightly？ | main全部重跑，并扩展property permutations、638 registry regeneration、full fault schedule、race schedule和report pairing；扩展参数不新增canonical TC。 |
| 4. 哪些是staging/release？ | `selected-product-parity`只在P1 selected environment；release gate执行10-suite selected smoke + mandatory checks + report pairing，但当前environment/products不存在。 |
| 5. flaky/timeout/dependency故障？ | P0无flaky allowance；任一unexpected timeout/flaky/infra dependency fault为failed/invalid run并阻断。只有exact scripted timeout/unavailable case可按typed oracle裁决。 |
| 6. 每个blocking suite由哪个gate script？ | PR=`run_pr_gate.sh`，main=`run_main_gate.sh`，nightly=`run_nightly_gate.sh`，selected=`run_selected_integration_gate.sh`，release=`run_release_gate.sh`；suite manifest由`--suite`定位。 |
| 7. 默认artifact root？ | 固定`artifacts/test/<run_id>`；suite位于`suites/<suite-id>/`，不得多一层project或使用latest。 |
| 8. gate参数？ | 所有gate支持`--run-id`、`--artifact-root`、`--config-profile`；runtime suite另支持`--entry`，reporting gate支持`--report-root`。 |
| 9. release checks？ | case-manifest、state-pair、dependency、Rustdoc、config-catalog、responsibility、redaction、artifact/report pairing、no-static-evidence共9项。 |
| 10. report scripts？ | suite report、run summary、gate summary、evidence candidate index由`scripts/reports/`从raw artifact生成到`reports/runs/<run_id>`。 |
| 11. suite覆盖TC/EVC？ | §5定义无重叠primary mapping；每行TC ordinal映射同ordinal DS和EVC candidate。 |
| 12. 哪些P0不可自动化？ | `0`。manual local仅复现/审阅，不替代任何P0 case。 |
| 13. 每个blocking suite停审？ | 10/10 primary suite和5类gate逐项检查coverage/script/path/failure；见§10。 |
| 14. 跨suite缺口？ | primary missing=0、duplicate=0、P0 manual gap=0、artifact/report path gap=0、EVC candidate collision=0；正式EV与归档生命周期留Step 13。 |

## 3. 当前问题诊断与取舍

| 问题 | 风险 | 处理 |
|---|---|---|
| 189 cases只有automation intent | 实施者无法知道gate owner | 固定10个primary suite和exact count |
| 同一TC可能被多个confidence suite重跑 | denominator重复 | primary owner唯一；secondary run显式不重复计coverage |
| 638 state pair可能nightly抽样 | P0状态风险漏检 | main `domain-state`必须全638；nightly只扩展 |
| release smoke容易只看test count | 场景/责任边界未证明 | release使用same TC manifest + mandatory checks，不接受aggregate count-only |
| static evidence文件可伪造pass | evidence provenance断裂 | no-static-evidence和artifact/report pairing强制阻断 |
| report script可能覆盖failed状态 | 造证据 | report只能保真投影raw status；missing/parse/report failure均阻断 |

### 3.1 取舍

| 方案 | 裁决 | 理由 |
|---|---|---|
| 一个全仓mega-suite | reject | 定位、ownership和release pairing不可审计 |
| 按189 case各建script | reject | script爆炸且重复环境装配 |
| 10个owner-aligned primary suite + manifest | accept | 保持canonical identity并可批量执行 |
| PR运行完整recovery矩阵 | reject | PR只做fast风险发现；main仍完整阻断 |
| main省略nightly类故障用例 | reject | 所有canonical P0必须在main，nightly仅增加参数强度 |
| selected product parity阻断P0 | reject | 产品未选；只阻断selected/release声明 |

## 4. Primary suite inventory

### 4.1 Exact non-overlapping partition

| Suite ID | Primary canonical TC owner | Count | Main environment | Primary risk |
|---|---|---:|---|---|
| `SUITE-CH-STATIC-CONTRACT-DOCS` | FOUNDATION-001,008~011,013~015 | 8 | CI static | inventory/dependency/Rustdoc/protocol/helper/digest drift |
| `SUITE-CH-DOMAIN-STATE` | FOUNDATION-002,012;STATE-001~024 | 26 | CI deterministic | object invariant、111 variants、638 pairs、immutable formations |
| `SUITE-CH-SERVICE-COMMAND-QUERY` | FOUNDATION-003;CMD-001~026;QUERY-001~033 | 60 | CI deterministic | application orchestration、UoW、no-write、typed result |
| `SUITE-CH-ENTRY-INBOUND` | FOUNDATION-005~006;INBOUND-001~006 | 8 | integration controlled | API mapping/barrier、six-source header/receipt/lifecycle |
| `SUITE-CH-OUTBOUND-COLLABORATION` | OUTBOUND-001~010 | 10 | integration/recovery controlled | immutable snapshot、A/B/C、external status ownership |
| `SUITE-CH-JOBS-LIFECYCLE` | FOUNDATION-007;JOB-001~008 | 9 | integration/recovery controlled | frozen plan、ordinal target、report/journal/reentry |
| `SUITE-CH-REPOSITORY-TRANSACTION` | FOUNDATION-004,016,018;TX-001~022 | 25 | CI/recovery controlled | one authority、110 methods、commit tri-state、winner/crash |
| `SUITE-CH-RUNTIME-BINDING` | FOUNDATION-017;BIND-001~012 | 13 | integration controlled | Stage 0~7、profile、9/14、6/10/8、retry/shutdown |
| `SUITE-CH-OBSERVABILITY-REDACTION` | OBS-001~012 | 12 | CI/integration controlled | 155 profiles+3 events、Off/Redacted、no business effect |
| `SUITE-CH-CONFIGURATION-STRICT` | CONFIG-001~018 | 18 | CI/integration/recovery | strict source、27 rows、failure phases、frozen root |
| **Total** | **all canonical TC** | **189** | **P0 main** | **missing=0;primary duplicate=0** |

Arithmetic:

```text
8 + 26 + 60 + 8 + 10 + 9 + 25 + 13 + 12 + 18 = 189
```

### 4.2 Suite execution table

All paths below are future contracts and do not currently exist.

| Suite | PR | Main | Nightly | Selected / release | Blocking | Future gate invocation | Raw artifact | Report |
|---|---|---|---|---|---|---|---|---|
| static-contract-docs | full | full | full | release full | P0 | `run_*_gate.sh --suite static-contract-docs` | `artifacts/test/<run_id>/suites/static-contract-docs/` | `reports/runs/<run_id>/suites/static-contract-docs.md` |
| domain-state | fast but all canonical rows | full 638 | full + property | release selected smoke + full manifest proof | P0 | `... --suite domain-state` | `.../suites/domain-state/` | `.../suites/domain-state.md` |
| service-command-query | fast branches | full | full + permutations | release representative + manifest proof | P0 | `... --suite service-command-query` | `.../suites/service-command-query/` | `.../suites/service-command-query.md` |
| entry-inbound | no | full | full + lifecycle faults | release entry smoke | P0 main | `... --suite entry-inbound` | `.../suites/entry-inbound/` | `.../suites/entry-inbound.md` |
| outbound-collaboration | no | full | full + all crash/race schedules | release representative | P0 main | `... --suite outbound-collaboration` | `.../suites/outbound-collaboration/` | `.../suites/outbound-collaboration.md` |
| jobs-lifecycle | no | full | full + all crash schedules | release representative | P0 main | `... --suite jobs-lifecycle` | `.../suites/jobs-lifecycle/` | `.../suites/jobs-lifecycle.md` |
| repository-transaction | fast fake contract | full | full + race schedules | selected durable parity / release | P0;P1 selected separate | `... --suite repository-transaction` | `.../suites/repository-transaction/` | `.../suites/repository-transaction.md` |
| runtime-binding | no | full controlled | full + lifecycle faults | selected product parity / release | P0;P1 selected separate | `... --suite runtime-binding` | `.../suites/runtime-binding/` | `.../suites/runtime-binding.md` |
| observability-redaction | no | full | full + sink permutations | release full check | P0 main/release | `... --suite observability-redaction` | `.../suites/observability-redaction/` | `.../suites/observability-redaction.md` |
| configuration-strict | fast parse/profile | full | full + stage/cleanup combinations | release full | P0 | `... --suite configuration-strict` | `.../suites/configuration-strict/` | `.../suites/configuration-strict.md` |

`fast` may reduce noncanonical permutations only; it may not omit a canonical TC identity or any of the 638 state pair identities where the row says all canonical rows. Main always executes all planned canonical scenario requirements before a P0 run can be complete.

## 5. Gate topology and semantics

#### 自动化门禁图: Capability Hub planned gates

```text
PR
  -> run_pr_gate.sh
     -> 4 fast primary suites
     -> case / dependency / Rustdoc / state / config checks

Main
  -> run_main_gate.sh
     -> 10 primary suites / 189 TC / 638 state pairs
     -> redaction + responsibility checks
     -> raw artifact completeness
     -> generate suite and run reports

Nightly
  -> run_nightly_gate.sh
     -> Main denominator
     -> property / race / crash / cleanup expansions
     -> artifact-report-pairing + no-static-evidence

Selected integration (P1)
  -> run_selected_integration_gate.sh
     -> durable / external Port / source / route / TLS / observer parity
     -> unavailable = blocked, never pass

Release candidate
  -> run_release_gate.sh
     -> lower-gate run references bound to one explicit run_id set
     -> selected smoke + 9 mandatory checks
     -> reports/runs/<run_id> generation
     -> Step 13 evidence-candidate handoff only
```

关键说明：

- Main是唯一P0完整canonical denominator owner；nightly与release不补偿main缺口。
- 每个gate必须使用显式`run_id`，正式路径和引用禁止`latest`。
- selected suite产品/环境不可用只产生blocked/unavailable raw result，不产生pass或P0替代证据。
- report generation发生在raw artifacts之后；report不能作为suite执行来源。

### 5.1 Gate interface contract

| Gate | Required parameters | Suite policy | Failure disposition |
|---|---|---|---|
| `scripts/gates/run_pr_gate.sh` | `--run-id --artifact-root --config-profile`;optional `--suite` | allowlisted 4 fast suites + checks | any missing/fail/timeout/nonzero blocks PR |
| `scripts/gates/run_main_gate.sh` | same + `--entry` for entry partitions | exactly 10 primary suites; 189 manifest | any canonical missing/duplicate/fail blocks main |
| `scripts/gates/run_nightly_gate.sh` | same + expansion manifest | main denominator + deterministic expansions | any failure blocks nightly result; no auto-pass retry |
| `scripts/gates/run_selected_integration_gate.sh` | same + selected immutable config artifact ref | allowlisted selected parity subsets | unavailable/failed recorded distinctly; no P0 pass |
| `scripts/gates/run_release_gate.sh` | `--run-id --artifact-root --report-root --config-profile`;selected lower-run refs | release smoke + mandatory checks + report generation | any P0/check/report gap blocks acceptance handoff |

`--artifact-root` defaults only after an explicit run ID to `artifacts/test/<run_id>`。`--report-root` defaults to `reports/runs/<run_id>`。`--config-profile` accepts only formal wire values `local|integration|deployment`; `--entry` accepts only `api|worker|jobs`。No gate may accept an arbitrary config override or raw secret parameter.

## 6. Gate / check / report script contract

All scripts in this section are planned implementation-repository boundaries. This design does not create or execute them.

### 6.1 Script inventory

| Future script | Type | Required input | Raw output / report output | Blocking semantics |
|---|---|---|---|---|
| `scripts/gates/run_pr_gate.sh` | gate | explicit `run_id`, profile, artifact root and optional allowlisted suite | four fast suite results plus five PR check results under the same artifact root | any non-passed required result blocks PR |
| `scripts/gates/run_main_gate.sh` | gate | explicit `run_id`, profile, artifact root and entry partition where applicable | ten primary suite results, 189-case manifest result, 638-pair result and all main checks | missing, duplicate, failed, timeout, flaky, unavailable or invalid output blocks main |
| `scripts/gates/run_nightly_gate.sh` | gate | main arguments plus immutable expansion-manifest reference | complete main denominator plus property/race/crash/cleanup attempt results | expansion failure blocks nightly; a nightly pass cannot repair a main failure |
| `scripts/gates/run_selected_integration_gate.sh` | gate | explicit selected immutable config artifact reference in addition to common arguments | selected durable/external/source/route/TLS/observer parity results | unavailable is `blocked_dependency`, never `passed` and never a P0 substitute |
| `scripts/gates/run_release_gate.sh` | gate | explicit run, artifact/report roots, profile and immutable lower-gate run references | release smoke, nine check results, report-generation status and candidate-index status | any P0, check, pairing, report or provenance gap blocks handoff to acceptance |
| `scripts/checks/check_case_manifest.sh` | check | Step-6-derived implementation manifest and suite raw results | `checks/case-manifest/check-result.json` | primary owner must be exact and `189/189`; missing/extra/duplicate blocks |
| `scripts/checks/check_state_pair_registry.sh` | check | generated state registry and `domain-state` parameter results | `checks/state-pair-registry/check-result.json` | exact `638=239+98+301` identity/count/coverage required; sampling blocks |
| `scripts/checks/check_dependency_boundary.sh` | check | workspace metadata, manifests, imports and public signatures | `checks/dependency-boundary/check-result.json` | only declared `core-contracts` sibling compile edge candidate is permitted |
| `scripts/checks/check_rustdoc_coverage.sh` | check | future public Rust source declarations | `checks/rustdoc-coverage/check-result.json` | missing/non-English-empty `///`, undocumented struct field/variant/payload/trait/method/callable, or field-level `pub` in enum struct variants blocks |
| `scripts/checks/check_config_catalog.sh` | check | typed schema/catalog/profile/entry/source/binding inventories | `checks/config-catalog/check-result.json` | 18 modules, 27 rows, 21 bounded env leaves, 9/14 external slots/callables, 6 sources, 10 routes and 3 profiles/entries must remain exact |
| `scripts/checks/check_responsibility_boundary.sh` | check | manifests, imports, declarations, call graph and exposed protocol inventory | `checks/responsibility-boundary/check-result.json` | any owned runtime/tools execution, governance approval, method body/source, marketplace listing, provider route/cost or SDK client/cache implementation surface blocks |
| `scripts/checks/check_redaction.sh` | check | all raw artifacts and generated reports for the explicit run | `checks/redaction/check-result.json` | forbidden material finding blocks without reproducing the material in its finding |
| `scripts/checks/check_artifact_report_pairing.sh` | check | explicit artifact root and report root | `checks/artifact-report-pairing/check-result.json` | every required report must back-reference one same-run raw source and digest; gap blocks |
| `scripts/checks/check_no_static_evidence.sh` | check | report/evidence-candidate sources and generation provenance | `checks/no-static-evidence/check-result.json` | static pass declarations, hand-authored result maps or raw-less evidence candidates block |
| `scripts/reports/generate_suite_reports.sh` | report | explicit run and artifact/report roots | `reports/runs/<run_id>/suites/<suite-id>.md` | missing/unparseable/raw-incomplete input or write failure returns nonzero |
| `scripts/reports/build_run_summary.sh` | report | complete suite/check raw results and suite reports | `reports/runs/<run_id>/summary.md` | summary preserves worst status and cannot infer pass from counts alone |
| `scripts/reports/build_gate_summary.sh` | report | gate manifest, suite/check raw results and generation statuses | `reports/runs/<run_id>/gate-summary.md` | any unresolved required cell keeps gate non-passed |
| `scripts/reports/build_evidence_candidate_index.sh` | report | same-run case raw results, suite reports and candidate mapping | `reports/runs/<run_id>/evidence-index.md` and `reports/runs/<run_id>/evidence-index.json`, plus per-EV pages | output remains candidate-only; orphan, cross-run or raw-less row blocks |

### 6.2 Mandatory check placement

| Check | PR | Main | Nightly | Selected | Release | Primary assertion |
|---|---|---|---|---|---|---|
| case manifest | blocking | blocking | blocking | selected subset + base manifest | blocking | canonical owner/count/provenance |
| state-pair registry | blocking | blocking full 638 | blocking full + regeneration | not applicable | blocking manifest proof | no state sampling or count drift |
| dependency boundary | blocking | blocking | blocking | blocking | blocking | compile/runtime/event direction remains legal |
| Rustdoc coverage | blocking | blocking | blocking | blocking for selected source | blocking | every future public declaration and nested structure is documented |
| config catalog | blocking | blocking | blocking | blocking selected values | blocking | strict catalog/cardinality/profile/entry contract |
| responsibility boundary | not required for fast PR unless owned surface changes | blocking | blocking | blocking | blocking | no forbidden responsibility absorption |
| redaction | raw fast output scan | blocking all artifacts | blocking all artifacts | blocking selected artifacts | blocking artifacts and reports | no forbidden material leakage |
| artifact/report pairing | after PR report generation | blocking | blocking | blocking when selected run is produced | blocking | same-run raw-to-report provenance |
| no-static-evidence | report source scan | blocking | blocking | blocking | blocking | no result or evidence without raw execution source |

The placement table defines future gate behavior, not existing CI jobs. A skipped mandatory check is a missing gate cell, not a pass.

## 7. Raw artifact and report contracts

### 7.1 Planned directory contract

```text
artifacts/test/<run_id>/
  run-manifest.json
  gates/<gate-id>/gate-result.json
  suites/<suite-id>/
    suite-result.json
    cases/<tc-id>.json
    parameters/<parameter-result-id>.json
    stdout.log
    stderr.log
  checks/<check-id>/check-result.json

reports/runs/<run_id>/
  summary.md
  gate-summary.md
  evidence-index.md
  evidence-index.json
  suites/<suite-id>.md
  checks/<check-id>.md
```

`reports/acceptance/` is reserved for Step 13 and `06-验收标准.md`; Step 9 neither defines a verdict file nor writes acceptance output. No formal path may contain `latest` or an extra project directory. `evidence-index.md` and `evidence-index.json` are candidate indexes, not accepted evidence or verdicts.

### 7.2 Minimum raw record fields

| Record | Required fields | Invariant |
|---|---|---|
| `run-manifest.json` | schema version, explicit run ID, gate ID, immutable suite/check manifest digests, profile, selected entries, start/finish timestamps, aggregate status | run ID and roots are immutable; no credential, body or arbitrary config override |
| `gate-result.json` | gate ID, required suite/check IDs, each raw result reference/digest, report-generation status, aggregate status, safe failure classes | aggregate is worst required status; no count-only pass |
| `suite-result.json` | suite ID, primary TC IDs, DS IDs, EVC candidate IDs, parameter registry digest, case result refs/digests, status, safe failure class, duration | primary identity is unique; secondary repetitions carry `secondary` role and do not change denominator |
| `cases/<tc-id>.json` | TC ID, exact DS ID, exact EVC candidate ID, source cut, scenario/parameter identity, oracle/result status, zero-effect assertions, safe failure class, timestamps | one primary result per canonical TC; candidate is not formal evidence |
| `parameters/*.json` | owner TC, parameter identity such as `SP-CH-*`, expected class, observed typed class, status, safe finding | all 638 state pairs remain individually addressable |
| `check-result.json` | check ID, checked manifest/input digests, closed status, safe findings with source locations, timestamps | findings never contain forbidden source material |

Allowed infrastructure/result statuses are closed to `passed`, `failed`, `timed_out`, `flaky_detected`, `blocked_dependency`, `invalid_artifact` and `cancelled`. A domain test whose declared oracle expects a typed timeout/unavailable outcome may still be `passed`; a harness timeout or unexpected dependency outage uses the corresponding non-passed infrastructure status.

### 7.3 Report projection and provenance

| Report | Raw authority | Required projection | Forbidden behavior |
|---|---|---|---|
| suite report | one `suite-result.json` plus referenced case/parameter records | suite identity, exact denominator, status distribution, safe failed assertions and raw refs/digests | editing status, omitting failed rows, embedding raw body/secret |
| check report | one `check-result.json` | check scope, input digest, status and safe source locations | treating missing check as not applicable without manifest authority |
| run summary | run/gate/suite/check raw results | complete required-cell matrix and worst status | deriving pass from executed test count or report presence |
| gate summary | gate manifest plus all required results | gate-specific required/observed mapping and report-generation status | allowing nightly/release to compensate for failed/missing main cells |
| evidence candidate index | case raw result + suite report pair | candidate ID, TC/DS, raw ref/digest, report ref and future acceptance consumer placeholder | assigning formal EV, VETO pass, signoff or cross-run alias |

## 8. Exact suite-to-TC/DS/EVC-candidate mapping

The notation below is an exact finite range expression. For each ordinal, `TC`, `DS` and `EVC` carry the same ordinal; `CMD/QUERY/INBOUND/OUTBOUND/JOB` TC and EVC families map to the corresponding `FLOW-C/Q/I/O/J` DS family.

| Primary suite | Source cuts | Canonical TC owner | Exact DS owner | Exact EVC candidate owner | Count | Blocking path |
|---|---|---|---|---|---:|---|
| `static-contract-docs` | `CUT-MOD-01`;`CUT-MOD-DEP-01..03`;`CUT-MOD-DOC-01`;`CUT-OBJ-HELPER/PROTOCOL/DIGEST` | `TC-CH-FOUNDATION-{001,008..011,013..015}` | `DS-CH-FOUNDATION-{001,008..011,013..015}` | `EVC-CH-FOUNDATION-{001,008..011,013..015}` | 8 | PR/main/nightly/release |
| `domain-state` | `CUT-MOD-02`;`CUT-OBJ-CORE`;`CUT-STATE-01..24` | `TC-CH-FOUNDATION-{002,012}` + `TC-CH-STATE-001..024` | same foundation ordinals + `DS-CH-STATE-001..024` | same foundation ordinals + `EVC-CH-STATE-001..024` | 26 | PR all canonical identities; main full 638 |
| `service-command-query` | `CUT-MOD-03`;`CUT-FLOW-C-01..26`;`CUT-FLOW-Q-01..33` | `TC-CH-FOUNDATION-003` + `TC-CH-CMD-001..026` + `TC-CH-QUERY-001..033` | `DS-CH-FOUNDATION-003` + `DS-CH-FLOW-C-001..026` + `DS-CH-FLOW-Q-001..033` | `EVC-CH-FOUNDATION-003` + `EVC-CH-CMD-001..026` + `EVC-CH-QUERY-001..033` | 60 | PR fast branches; main full |
| `entry-inbound` | `CUT-MOD-05..06`;`CUT-FLOW-I-01..06` | `TC-CH-FOUNDATION-005..006` + `TC-CH-INBOUND-001..006` | same foundation ordinals + `DS-CH-FLOW-I-001..006` | same foundation ordinals + `EVC-CH-INBOUND-001..006` | 8 | main/nightly/release entry smoke |
| `outbound-collaboration` | `CUT-FLOW-O-01..10` | `TC-CH-OUTBOUND-001..010` | `DS-CH-FLOW-O-001..010` | `EVC-CH-OUTBOUND-001..010` | 10 | main/nightly/release representative |
| `jobs-lifecycle` | `CUT-MOD-07`;`CUT-FLOW-J-01..08` | `TC-CH-FOUNDATION-007` + `TC-CH-JOB-001..008` | `DS-CH-FOUNDATION-007` + `DS-CH-FLOW-J-001..008` | `EVC-CH-FOUNDATION-007` + `EVC-CH-JOB-001..008` | 9 | main/nightly/release representative |
| `repository-transaction` | `CUT-MOD-04`;`CUT-PORT-LOCAL`;`CUT-REPO-ALL`;`CUT-TX-01..22` | `TC-CH-FOUNDATION-{004,016,018}` + `TC-CH-TX-001..022` | same foundation ordinals + `DS-CH-TX-001..022` | same foundation ordinals + `EVC-CH-TX-001..022` | 25 | PR fake contract/main/nightly; P1 durable parity separate |
| `runtime-binding` | `CUT-PORT-EXTERNAL`;`CUT-BIND-01..12` | `TC-CH-FOUNDATION-017` + `TC-CH-BIND-001..012` | `DS-CH-FOUNDATION-017` + `DS-CH-BIND-001..012` | `EVC-CH-FOUNDATION-017` + `EVC-CH-BIND-001..012` | 13 | main/nightly; selected parity/release |
| `observability-redaction` | `CUT-OBS-01..12` | `TC-CH-OBS-001..012` | `DS-CH-OBS-001..012` | `EVC-CH-OBS-001..012` | 12 | main/nightly/release full check |
| `configuration-strict` | `CFG-F-01..18` | `TC-CH-CONFIG-001..018` | `DS-CH-CONFIG-001..018` | `EVC-CH-CONFIG-001..018` | 18 | PR/main/nightly/release |
| **Total** | **171 DDD cuts + 18 config expansions** | **189 unique TC** | **189 unique DS** | **189 unique candidates** | **189** | **P0 main denominator complete** |

Secondary release smoke, property permutations and selected parity may reference these identities, but must mark results `secondary`. They neither create a new canonical ID nor provide a second primary owner.

## 9. Failure, retry and incompleteness semantics

| Condition | Required disposition | Pass prohibition |
|---|---|---|
| canonical TC absent or primary duplicate | `invalid_artifact`; block current gate | aggregate count cannot hide identity defect |
| expected exact scripted timeout/unavailable oracle observed | case may pass if typed result and zero-effect assertions match | must not confuse with harness/dependency timeout |
| harness timeout | `timed_out`; preserve partial safe artifact; block | rerun cannot overwrite original attempt |
| divergent repeated attempt | `flaky_detected`; retain every attempt; block | a later pass cannot erase divergence |
| unexpected fake/controlled dependency unavailable | `blocked_dependency` or `failed` by phase; block | cannot be treated as expected degradation |
| selected product/environment unavailable | `blocked_dependency`; selected/release claim remains incomplete | cannot count as P0 or selected pass |
| process cancellation | `cancelled`; preserve terminalization/cleanup observations; block | caller cancellation is not an oracle unless the case explicitly owns it |
| raw artifact missing, malformed or digest mismatch | `invalid_artifact`; block report and gate | report presence cannot substitute raw data |
| report generation or write failure | gate remains non-passed; raw result retained | no hand-written replacement report |
| redaction finding | failed check and gate block; finding uses class/location only | no secret/body echo in failure output |
| check not run | required cell missing and gate blocked | no implicit not-applicable or pass |

Automatic retries are not part of the P0 pass contract. A diagnostic rerun must have an explicit attempt identity and remain linked to the original non-passed attempt; only a new explicit run may seek a new gate verdict, without rewriting prior artifacts or reports.

## 10. P0 manual automation gap

| P0 category | Canonical count | Automated primary owner | Manual-only count | Disposition |
|---|---:|---|---:|---|
| foundation/domain/state | 34 | static-contract-docs + domain-state | 0 | automated |
| service/entry/outbound/jobs | 87 | four owner suites | 0 | automated |
| repository/transaction/runtime | 38 | repository-transaction + runtime-binding | 0 | automated |
| observability/configuration | 30 | observability-redaction + configuration-strict | 0 | automated |
| **Total** | **189** | **10 primary suites** | **0** | **no P0 risk acceptance required for automation** |

Human review may inspect reports, triage failures and perform the later acceptance decision. It never replaces a canonical P0 case result, raw artifact, blocking check or report pairing.

## 11. Per-suite and per-gate stop review

### 11.1 Primary suites

| Suite | Coverage identity | Script/path pairing | Failure semantics | Stop-review conclusion |
|---|---|---|---|---|
| static-contract-docs | 8 exact primary rows | complete | blocking; Rustdoc includes declarations, struct fields, enum variants/payloads, traits, methods and callables | pass-designed |
| domain-state | 26 TC + all 638 state pairs | complete | no sampling; missing pair invalidates | pass-designed |
| service-command-query | 60 exact primary rows | complete | typed result, UoW and zero-write assertions retained | pass-designed |
| entry-inbound | 8 exact primary rows | complete | barrier/lifecycle failure cannot be hidden by caller timeout | pass-designed |
| outbound-collaboration | 10 exact primary rows | complete | A/B/C status and crash/race remain separate | pass-designed |
| jobs-lifecycle | 9 exact primary rows | complete | journal/effect/report symmetry and no unsafe terminalization | pass-designed |
| repository-transaction | 25 exact primary rows | complete | commit tri-state, winner and corruption are blocking | pass-designed |
| runtime-binding | 13 exact primary rows | complete | missing/illegal binding blocks complete graph exposure | pass-designed |
| observability-redaction | 12 exact primary rows | complete | observer failure has zero business effect; leakage blocks | pass-designed |
| configuration-strict | 18 exact primary rows | complete | no fallback, partial root or fabricated recovery | pass-designed |

### 11.2 Gates

| Gate | Required denominator | Artifact/report pairing | Incomplete handling | Stop-review conclusion |
|---|---|---|---|---|
| PR | four fast suites with every declared canonical identity + required checks | same explicit run | any required gap blocks PR | pass-designed |
| main | 10 suites / 189 primary TC / 189 DS / 638 state pairs + checks | same explicit run | complete P0 denominator required | pass-designed |
| nightly | main denominator + deterministic expansions | same explicit run | no compensation for main; expansion gaps block nightly | pass-designed |
| selected | explicitly allowlisted P1 parity rows | same explicit selected run | unavailable remains blocked, not pass | pass-designed |
| release | smoke + nine checks + report builders + immutable lower-run refs | explicit run/ref set, never `latest` | any provenance/report/check gap blocks acceptance handoff | pass-designed |

`pass-designed` means the design contract is complete enough to implement. It is not an execution result and does not assert that a suite, script, environment or CI gate exists.

## 12. Cross-suite gate and evidence audit

| Audit item | Mechanical/design result | Gap / correction |
|---|---|---|
| canonical TC primary coverage | `189/189`; missing=0; duplicate=0 | secondary repetitions excluded from denominator |
| DS mapping | `189/189`; missing=0; duplicate=0 | flow-family renaming is explicitly mapped in §8 |
| EVC candidate mapping | `189/189`; missing=0; duplicate=0 | remains candidate-only until Step 13 |
| state pair coverage | `638/638 = 239 current + 98 reserved + 301 illegal` | main sampling forbidden |
| suite count arithmetic | `8+26+60+8+10+9+25+13+12+18=189` | no overlap |
| P0 manual gap | 0 | human acceptance/review is downstream, not test substitution |
| gate script placement | 5/5 under `scripts/gates/` | files are future contracts only |
| check placement/release coverage | 9/9 under `scripts/checks/`; all nine release-blocking | skipped check is missing cell |
| report placement | 4/4 under `scripts/reports/`; outputs under `reports/runs/<run_id>` | generator never lives under output directory |
| raw artifact/report pairing | explicit same-run refs and digests | `latest` and project-nested root forbidden |
| evidence collision | 0 canonical candidate collision | formal EV allocation deferred to Step 13 |
| failure-status preservation | closed non-pass states defined | retry/report cannot overwrite failure |
| redaction | raw artifacts and reports both scanned | findings cannot reproduce material |
| release coverage | smoke + manifest + nine checks + report generation | release cannot repair main gap |
| responsibility leakage | 0 designed owner leakage | seven forbidden ownership families checked |
| fabricated execution facts | 0 | no script/job/environment/run/result/evidence/signoff exists by this document |

## 13. Upstream impact, formal fill draft and next-step gate

### 13.1 Upstream impact

| Finding | Upstream writeback | Disposition |
|---|---|---|
| all 189 cases have deterministic suite/environment placement | none | Step 6~8 contracts are sufficient |
| all 638 state pairs can remain main-blocking | none | retain complete registry contract |
| Rustdoc check needs nested declaration coverage | none | already required by formal 03; implementation plan must preserve it |
| product-selected parity is not currently executable | none | downstream prerequisite/residual, not an upstream blocker |
| formal evidence IDs and acceptance verdict are not yet allocated | none | Step 13 and formal 06 own them |

Current writeback / blocking confirmation / unresolved upstream blocker = `0 / 0 / 0`.

### 13.2 Formal `05` §9 fill draft

Formal §9 must carry:

- the ten-suite exact 189-row partition and main ownership of all 638 state pairs;
- PR/main/nightly/selected/release topology and non-compensation rule;
- five gate, nine check and four report future script contracts;
- fixed `artifacts/test/<run_id>` and `reports/runs/<run_id>` roots without `latest`;
- raw record/provenance and failure-preservation semantics;
- exact suite-to-TC/DS/EVC-candidate mapping and P0 manual gap `0`;
- per-suite/gate stop review and cross-suite audit;
- an explicit statement that these are planned contracts, not existing execution evidence.

Formal `05-测试方案.md` remains unchanged until Step 15 assembly.

### 13.3 Step 10 entry gate

| Entry condition | Status | Basis |
|---|---|---|
| P0 automation topology is complete | pass-designed | 10 suites and 5 gates |
| every blocking suite has exact cases/data/candidates/script/artifact/report | pass-designed | §§4,6~8 |
| failure and incompleteness cannot become pass | pass-designed | §9 |
| P0 manual automation gap is closed | pass-designed | 0/189 in §10 |
| per-suite and cross-suite audits have no unresolved conflict | pass-designed | §§11~12 |
| no formal evidence or execution fact was fabricated | pass-designed | candidate-only and future-contract labels |

Next allowed action: read Test Plan SOP/writing-standard Step 10 plus formal `00`~`04`, Step 4 strategy, Step 6 cases, Step 8 environments and this Step 9 artifact; then create `05_test_plan_step_10_nonfunctional.md` without modifying formal `05`.
